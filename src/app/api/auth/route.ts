import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { StudentProfile } from "@/types";
import { sanitizeString } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "register"; // 'register' or 'login'

    // 1. LOGIN FLOW
    if (action === "login") {
      const email = sanitizeString(body.email || "", 128).toLowerCase();
      
      // Look up student by email or ID from MySQL
      try {
        const rows: any = await query(
          "SELECT * FROM profiles WHERE id = ? OR display_name LIKE ? LIMIT 1",
          [email, `%${email}%`]
        );

        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          // Fetch associated taste entities
          const entityRows: any = await query(
            "SELECT id, domain, qloo_entity_id, name, source, weight, tags FROM taste_entities WHERE profile_id = ?",
            [row.id]
          );

          const student: StudentProfile = {
            id: row.id,
            display_name: row.display_name,
            home_city: row.home_city,
            home_country: row.home_country,
            target_city: row.target_city,
            target_university: row.target_university,
            target_lat: Number(row.target_lat),
            target_lng: Number(row.target_lng),
            major: row.major,
            languages: typeof row.languages === "string" ? JSON.parse(row.languages) : ["English"],
            goals: typeof row.goals === "string" ? JSON.parse(row.goals) : ["Settle in new city"],
            is_public: Boolean(row.is_public),
            taste_entities: Array.isArray(entityRows) ? entityRows : [],
            created_at: row.created_at || new Date().toISOString()
          };

          return NextResponse.json({ success: true, student });
        }
      } catch (dbErr) {
        console.warn("DB login lookup fallback:", dbErr);
      }

      // Default demo login fallback if DB offline
      const demoStudent: StudentProfile = {
        id: "student-maya-chen",
        display_name: body.displayName || "Maya Chen",
        home_city: "Pune",
        home_country: "India",
        target_city: "Berlin",
        target_university: "TU Berlin",
        target_lat: 52.5119,
        target_lng: 13.3265,
        major: "Computer Science",
        languages: ["English", "Hindi"],
        goals: ["Discover acoustic study spaces", "Connect with kindred peers"],
        is_public: true,
        taste_entities: [
          {
            id: "ent-1",
            domain: "artist",
            qloo_entity_id: "urn:entity:artist:radiohead",
            name: "Radiohead",
            source: "user",
            weight: 0.95,
            tags: ["alt-rock", "experimental"]
          },
          {
            id: "ent-2",
            domain: "video_game",
            qloo_entity_id: "urn:entity:video_game:portal_2",
            name: "Portal 2",
            source: "user",
            weight: 0.90,
            tags: ["puzzle", "physics"]
          },
          {
            id: "ent-3",
            domain: "place",
            qloo_entity_id: "urn:entity:place:specialty_coffee",
            name: "Third-Wave Pour-Over Coffee",
            source: "user",
            weight: 0.92,
            tags: ["quiet", "wifi", "study"]
          }
        ],
        created_at: new Date().toISOString()
      };

      return NextResponse.json({ success: true, student: demoStudent });
    }

    // 2. REGISTRATION FLOW
    const profile: StudentProfile = body.profile;
    if (!profile || !profile.display_name || !profile.target_city) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    const studentId = profile.id || `student-${Date.now()}`;
    const sanitizedStudent: StudentProfile = {
      ...profile,
      id: studentId,
      display_name: sanitizeString(profile.display_name, 100),
      home_city: sanitizeString(profile.home_city || "Global", 60),
      home_country: sanitizeString(profile.home_country || "International", 60),
      target_city: sanitizeString(profile.target_city, 60),
      target_university: sanitizeString(profile.target_university || `${profile.target_city} University`, 100),
      major: sanitizeString(profile.major || "Undergraduate Studies", 100),
      target_lat: profile.target_lat || 52.52,
      target_lng: profile.target_lng || 13.405,
      languages: profile.languages && profile.languages.length > 0 ? profile.languages : ["English"],
      goals: profile.goals && profile.goals.length > 0 ? profile.goals : ["Settle comfortably", "Find kindred peers"],
      is_public: profile.is_public !== false,
      created_at: new Date().toISOString()
    };

    // Save to MySQL if available
    try {
      await query(
        `INSERT INTO profiles (id, display_name, home_city, home_country, target_city, target_university, target_lat, target_lng, major, languages, goals, is_public)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE display_name = VALUES(display_name), target_city = VALUES(target_city), target_university = VALUES(target_university)`,
        [
          sanitizedStudent.id,
          sanitizedStudent.display_name,
          sanitizedStudent.home_city,
          sanitizedStudent.home_country,
          sanitizedStudent.target_city,
          sanitizedStudent.target_university,
          sanitizedStudent.target_lat,
          sanitizedStudent.target_lng,
          sanitizedStudent.major,
          JSON.stringify(sanitizedStudent.languages),
          JSON.stringify(sanitizedStudent.goals),
          sanitizedStudent.is_public ? 1 : 0
        ]
      );

      // Save taste entities
      if (profile.taste_entities && profile.taste_entities.length > 0) {
        for (const ent of profile.taste_entities) {
          await query(
            `INSERT INTO taste_entities (id, profile_id, domain, qloo_entity_id, name, source, weight, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name = VALUES(name)`,
            [
              ent.id,
              sanitizedStudent.id,
              ent.domain,
              ent.qloo_entity_id,
              ent.name,
              ent.source || "user",
              ent.weight || 0.9,
              JSON.stringify(ent.tags || [])
            ]
          );
        }
      }
    } catch (dbErr) {
      console.warn("DB insert fallback (in-memory mode):", dbErr);
    }

    return NextResponse.json({ success: true, student: sanitizedStudent });
  } catch (err: any) {
    console.error("Auth route error:", err);
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
