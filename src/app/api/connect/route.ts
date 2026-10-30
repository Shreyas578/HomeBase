import { NextRequest, NextResponse } from "next/server";
import { StudentProfile, ConnectMatch } from "@/types";
import { SEEDED_PEER_STUDENTS } from "@/data/seedProfiles";
import { qlooCompareProfiles } from "@/lib/agent";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const currentProfile: StudentProfile = body.profile;

    if (!currentProfile) {
      return NextResponse.json({ error: "No student profile provided" }, { status: 400 });
    }

    // Try fetching live peer profiles from MySQL if available
    let peerPool: StudentProfile[] = SEEDED_PEER_STUDENTS;

    try {
      const dbRows: any = await query(
        "SELECT id, display_name, home_city, home_country, target_city, target_university, major, languages, is_public FROM profiles WHERE id != ? AND is_public = 1 LIMIT 10",
        [currentProfile.id]
      );

      if (Array.isArray(dbRows) && dbRows.length > 0) {
        // Hydrate DB rows with basic entities
        const hydrated: StudentProfile[] = dbRows.map((r) => ({
          ...r,
          languages: typeof r.languages === "string" ? JSON.parse(r.languages) : ["English"],
          goals: ["Explore city through taste", "Find collaborative study partners"],
          taste_entities: [
            {
              id: `taste-${r.id}-1`,
              domain: "artist",
              qloo_entity_id: "urn:entity:artist:nils_frahm",
              name: "Nils Frahm",
              source: "user",
              weight: 0.9,
              tags: ["ambient", "modern classical"]
            },
            {
              id: `taste-${r.id}-2`,
              domain: "video_game",
              qloo_entity_id: "urn:entity:video_game:disco_elysium",
              name: "Disco Elysium",
              source: "user",
              weight: 0.92,
              tags: ["rpg", "narrative"]
            }
          ],
          created_at: new Date().toISOString()
        }));
        peerPool = [...hydrated, ...SEEDED_PEER_STUDENTS];
      }
    } catch (e) {
      // Fallback cleanly to SEEDED_PEER_STUDENTS
      console.warn("DB peer fetch fallback to seed pool:", e);
    }

    // Compute Qloo match score and bridge discovery for each peer
    const matches: { peer: StudentProfile; match: ConnectMatch }[] = peerPool.map((peer) => ({
      peer,
      match: qlooCompareProfiles(currentProfile, peer)
    }));

    // Sort by descending resonance score
    matches.sort((a, b) => b.match.matchScore - a.match.matchScore);

    return NextResponse.json({
      matches,
      totalPeersScanned: matches.length,
      topMatch: matches[0] || null
    });
  } catch (err: any) {
    console.error("Connect route error:", err);
    return NextResponse.json({ error: err.message || "Failed to compute peer matches" }, { status: 500 });
  }
}
