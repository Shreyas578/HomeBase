import { NextRequest, NextResponse } from "next/server";
import { query, initDbSchema } from "@/lib/db";
import { StudentProfile } from "@/types";
import { sanitizeString } from "@/lib/sanitize";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "@/lib/auth";

// In-memory user store fallback when MySQL DATABASE_URL is not set or unreachable
// Maps email -> { profile: StudentProfile, passwordHash: string }
const inMemoryUsers = new Map<string, { profile: StudentProfile; passwordHash: string }>();

// Ensure DB schema is ready on startup
let dbSchemaInitialized = false;
async function ensureDb() {
  if (!dbSchemaInitialized) {
    try {
      await initDbSchema();
      dbSchemaInitialized = true;
    } catch {
      // Ignore if offline
    }
  }
}

export async function GET(req: NextRequest) {
  // Session verification endpoint
  try {
    const token = req.cookies.get("homebase_session")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, error: "Invalid or expired session" }, { status: 401 });
    }

    await ensureDb();

    // Fetch student profile
    try {
      const rows: any = await query("SELECT * FROM profiles WHERE id = ? LIMIT 1", [payload.userId]);
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        const entityRows: any = await query(
          "SELECT id, domain, qloo_entity_id, name, source, weight, tags FROM taste_entities WHERE profile_id = ?",
          [row.id]
        );
        const student: StudentProfile = {
          id: row.id,
          email: row.email,
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
        return NextResponse.json({ authenticated: true, student });
      }
    } catch {
      // Fallback to in-memory store
    }

    const memUser = inMemoryUsers.get(payload.email.toLowerCase());
    if (memUser) {
      return NextResponse.json({ authenticated: true, student: memUser.profile });
    }

    return NextResponse.json({ authenticated: false, error: "User profile not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDb();
    const body = await req.json();
    const action = body.action || "register"; // 'register' | 'login' | 'logout'

    // LOGOUT ACTION
    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.set("homebase_session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0
      });
      return response;
    }

    // 1. LOGIN FLOW
    if (action === "login") {
      const email = sanitizeString(body.email || "", 128).toLowerCase().trim();
      const password = typeof body.password === "string" ? body.password : "";

      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required to sign in." }, { status: 400 });
      }

      let matchedStudent: StudentProfile | null = null;
      let passwordMatched = false;

      // Look up student by exact email in MySQL
      try {
        const rows: any = await query(
          "SELECT * FROM profiles WHERE LOWER(email) = ? LIMIT 1",
          [email]
        );

        if (Array.isArray(rows) && rows.length > 0) {
          const row = rows[0];
          if (row.password_hash) {
            passwordMatched = await verifyPassword(password, row.password_hash);
          }

          if (passwordMatched) {
            const entityRows: any = await query(
              "SELECT id, domain, qloo_entity_id, name, source, weight, tags FROM taste_entities WHERE profile_id = ?",
              [row.id]
            );

            matchedStudent = {
              id: row.id,
              email: row.email,
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
          }
        }
      } catch (dbErr) {
        console.warn("Database query during login, trying in-memory store:", dbErr);
      }

      // Check in-memory store if DB did not match
      if (!matchedStudent) {
        const memRecord = inMemoryUsers.get(email);
        if (memRecord) {
          const valid = await verifyPassword(password, memRecord.passwordHash);
          if (valid) {
            matchedStudent = memRecord.profile;
            passwordMatched = true;
          }
        }
      }

      if (!passwordMatched || !matchedStudent) {
        return NextResponse.json(
          { error: "Invalid email or password. Please check your credentials." },
          { status: 401 }
        );
      }

      // Generate secure signed session token
      const token = createSessionToken({
        userId: matchedStudent.id,
        email: matchedStudent.email || email,
        displayName: matchedStudent.display_name
      });

      const response = NextResponse.json({ success: true, student: matchedStudent, token });
      response.cookies.set("homebase_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 3600 // 7 days
      });

      return response;
    }

    // 2. REGISTRATION FLOW
    const profile: StudentProfile = body.profile;
    const email = sanitizeString(body.email || profile?.email || "", 128).toLowerCase().trim();
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required for registration." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    if (!profile || !profile.display_name || !profile.target_city) {
      return NextResponse.json({ error: "Missing required profile fields (Display Name & Target City)." }, { status: 400 });
    }

    // Check if user already exists
    try {
      const existing: any = await query("SELECT id FROM profiles WHERE LOWER(email) = ? LIMIT 1", [email]);
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    } catch {
      // Ignore if DB not reachable
    }

    if (inMemoryUsers.has(email)) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // Hash password securely with PBKDF2
    const passwordHash = await hashPassword(password);

    const studentId = profile.id || `student-${Date.now()}`;
    const sanitizedStudent: StudentProfile = {
      ...profile,
      id: studentId,
      email,
      display_name: sanitizeString(profile.display_name, 100),
      home_city: sanitizeString(profile.home_city || "Global", 60),
      home_country: sanitizeString(profile.home_country || "International", 60),
      target_country: sanitizeString(profile.target_country || "Germany", 60),
      target_city: sanitizeString(profile.target_city, 60),
      target_university: sanitizeString(profile.target_university || `${profile.target_city} University`, 100),
      major: sanitizeString(profile.major || "Undergraduate Studies", 100),
      target_lat: profile.target_lat || 52.52,
      target_lng: profile.target_lng || 13.405,
      languages: profile.languages && profile.languages.length > 0 ? profile.languages : ["English"],
      goals: profile.goals && profile.goals.length > 0 ? profile.goals : ["Settle comfortably", "Find kindred peers"],
      is_public: profile.is_public !== false,
      taste_entities: profile.taste_entities || [],
      created_at: new Date().toISOString()
    };

    // Store in memory cache
    inMemoryUsers.set(email, { profile: sanitizedStudent, passwordHash });

    // Save to MySQL
    try {
      await query(
        `INSERT INTO profiles (id, email, password_hash, display_name, home_city, home_country, target_city, target_university, target_lat, target_lng, major, languages, goals, is_public)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           email = VALUES(email),
           password_hash = VALUES(password_hash),
           display_name = VALUES(display_name),
           target_city = VALUES(target_city),
           target_university = VALUES(target_university)`,
        [
          sanitizedStudent.id,
          sanitizedStudent.email,
          passwordHash,
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
      if (sanitizedStudent.taste_entities && sanitizedStudent.taste_entities.length > 0) {
        for (const ent of sanitizedStudent.taste_entities) {
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
      console.warn("DB insert error, registered in active memory store:", dbErr);
    }

    // Generate session token
    const token = createSessionToken({
      userId: sanitizedStudent.id,
      email: sanitizedStudent.email || email,
      displayName: sanitizedStudent.display_name
    });

    const response = NextResponse.json({ success: true, student: sanitizedStudent, token });
    response.cookies.set("homebase_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600
    });

    return response;
  } catch (err: any) {
    console.error("Auth route error:", err);
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
