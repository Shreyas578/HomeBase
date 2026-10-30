import { NextRequest, NextResponse } from "next/server";
import { query, getDbPool } from "@/lib/db";
import { StudentProfile } from "@/types";
import { inMemoryUsers } from "@/lib/userStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const excludeId = searchParams.get("excludeId") || "";

    const livePeers: StudentProfile[] = [];
    const seenIds = new Set<string>();

    // 1. Fetch real registered users from MySQL database
    const db = getDbPool();
    if (db) {
      try {
        let sql = `
          SELECT p.*, 
            COALESCE(
              JSON_ARRAYAGG(
                IF(te.id IS NOT NULL, 
                  JSON_OBJECT(
                    'id', te.id,
                    'domain', te.domain,
                    'qloo_entity_id', te.qloo_entity_id,
                    'name', te.name,
                    'source', te.source,
                    'weight', te.weight,
                    'tags', te.tags
                  ), 
                  NULL
                )
              ), 
              JSON_ARRAY()
            ) as taste_entities_json
          FROM profiles p
          LEFT JOIN taste_entities te ON p.id = te.profile_id
          WHERE p.is_public = 1
        `;
        const params: any[] = [];
        if (excludeId) {
          sql += " AND p.id != ?";
          params.push(excludeId);
        }
        sql += " GROUP BY p.id ORDER BY p.created_at DESC LIMIT 50";

        const rows: any = await query(sql, params);
        if (Array.isArray(rows) && rows.length > 0) {
          for (const row of rows) {
            let tastes = [];
            try {
              tastes = typeof row.taste_entities_json === "string" 
                ? JSON.parse(row.taste_entities_json) 
                : (row.taste_entities_json || []);
              tastes = tastes.filter(Boolean);
            } catch {
              tastes = [];
            }

            seenIds.add(row.id);
            livePeers.push({
              id: row.id,
              email: row.email,
              display_name: row.display_name,
              home_city: row.home_city,
              home_country: row.home_country,
              target_city: row.target_city,
              target_university: row.target_university,
              target_lat: parseFloat(row.target_lat),
              target_lng: parseFloat(row.target_lng),
              major: row.major,
              languages: typeof row.languages === "string" ? JSON.parse(row.languages) : (row.languages || []),
              goals: typeof row.goals === "string" ? JSON.parse(row.goals) : (row.goals || []),
              is_public: Boolean(row.is_public),
              is_online: true,
              last_seen: "Online now",
              taste_entities: tastes,
              created_at: row.created_at
            });
          }
        }
      } catch (dbErr) {
        console.warn("Peers DB query note:", dbErr);
      }
    }

    // 2. Fetch real users from active runtime in-memory userStore
    for (const [, userRecord] of inMemoryUsers.entries()) {
      const p = userRecord.profile;
      if (p && p.id !== excludeId && !seenIds.has(p.id) && p.is_public) {
        seenIds.add(p.id);
        livePeers.push({
          ...p,
          is_online: true,
          last_seen: "Online now"
        });
      }
    }

    // Only real users who registered in the application are returned
    return NextResponse.json({ peers: livePeers });
  } catch (err: any) {
    console.error("Peers API error:", err);
    return NextResponse.json({ error: err.message || "Failed to load peers" }, { status: 500 });
  }
}
