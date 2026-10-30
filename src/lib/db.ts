import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let basePool: mysql.Pool | null = null;

/**
 * Creates database if it doesn't already exist on the MySQL server.
 */
async function ensureDatabaseExists(uriString: string): Promise<void> {
  try {
    const url = new URL(uriString.replace("mysql://", "http://"));
    const dbName = url.pathname.replace(/^\//, "");
    if (!dbName) return;

    // Connect to server without database specified
    const host = url.hostname;
    const port = parseInt(url.port || "3306", 10);
    const user = decodeURIComponent(url.username || "root");
    const password = decodeURIComponent(url.password || "");
    const isLocalhost = host === "localhost" || host === "127.0.0.1";

    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      ...(isLocalhost ? {} : { ssl: { rejectUnauthorized: false } })
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();
  } catch (err) {
    console.warn("Auto CREATE DATABASE check notice:", err);
  }
}

export function getDbPool(): mysql.Pool | null {
  const connectionUri = process.env.DATABASE_URL;

  if (!connectionUri) {
    return null;
  }

  if (!pool) {
    const isLocalhost = connectionUri.includes("localhost") || connectionUri.includes("127.0.0.1");

    pool = mysql.createPool({
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // For local MySQL, SSL is off by default; for Aiven/cloud MySQL, rejectUnauthorized: false is used
      ...(isLocalhost ? {} : { ssl: { rejectUnauthorized: false } })
    });
  }

  return pool;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T> {
  const db = getDbPool();
  if (!db) {
    throw new Error("DATABASE_URL not configured");
  }
  const [rows] = await db.query(sql, params);
  return rows as T;
}

/**
 * Initializes MySQL schema (tables for profiles, taste entities, matches, plans, and API cache)
 * Compatible with Aiven MySQL Free Tier.
 */
export async function initDbSchema(): Promise<{ success: boolean; message: string }> {
  const connectionUri = process.env.DATABASE_URL;
  if (!connectionUri) {
    return { success: false, message: "DATABASE_URL not configured. Running in offline/in-memory mode." };
  }

  await ensureDatabaseExists(connectionUri);

  const db = getDbPool();
  if (!db) {
    return { success: false, message: "DATABASE_URL not configured. Running in offline/in-memory mode." };
  }

  try {
    // 1. Profiles Table with email & password_hash
    await db.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(191) UNIQUE,
        password_hash VARCHAR(255),
        display_name VARCHAR(128) NOT NULL,
        home_city VARCHAR(64) NOT NULL,
        home_country VARCHAR(64) NOT NULL,
        target_city VARCHAR(64) NOT NULL,
        target_university VARCHAR(128) NOT NULL,
        target_lat DECIMAL(10, 7) NOT NULL,
        target_lng DECIMAL(10, 7) NOT NULL,
        major VARCHAR(128) NOT NULL,
        languages JSON,
        goals JSON,
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure email & password_hash columns exist if table was already created earlier
    try {
      await db.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(191) UNIQUE;`);
      await db.query(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);`);
    } catch {
      // Ignore if columns already present or MySQL version doesn't support IF NOT EXISTS in ALTER
    }

    // 2. Taste Entities Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS taste_entities (
        id VARCHAR(64) PRIMARY KEY,
        profile_id VARCHAR(64) NOT NULL,
        domain VARCHAR(32) NOT NULL,
        qloo_entity_id VARCHAR(128) NOT NULL,
        name VARCHAR(128) NOT NULL,
        source ENUM('user', 'inferred') DEFAULT 'user',
        weight DECIMAL(3, 2) DEFAULT 0.90,
        tags JSON,
        INDEX idx_profile (profile_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. API Cache Table (TTL Caching for Qloo, Nominatim, Overpass)
    await db.query(`
      CREATE TABLE IF NOT EXISTS api_cache (
        cache_key VARCHAR(191) PRIMARY KEY,
        response_json LONGTEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Matches Table
    await db.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id VARCHAR(64) PRIMARY KEY,
        profile_a VARCHAR(64) NOT NULL,
        profile_b VARCHAR(64) NOT NULL,
        score INT NOT NULL,
        overlap_json JSON,
        bridges_json JSON,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    return { success: true, message: "Aiven MySQL tables verified and initialized successfully." };
  } catch (err: any) {
    console.error("MySQL init error:", err);
    return { success: false, message: err.message };
  }
}

/**
 * Cache helper: Get cached API response from MySQL
 */
export async function getCachedApiResponse<T = any>(key: string): Promise<T | null> {
  const db = getDbPool();
  if (!db) return null;

  try {
    const [rows]: any = await db.query(
      "SELECT response_json FROM api_cache WHERE cache_key = ? AND expires_at > NOW() LIMIT 1",
      [key]
    );
    if (rows && rows.length > 0) {
      return JSON.parse(rows[0].response_json);
    }
  } catch (e) {
    console.warn("Cache read error:", e);
  }
  return null;
}

/**
 * Cache helper: Set cached API response with TTL in minutes
 */
export async function setCachedApiResponse(key: string, data: any, ttlMinutes: number = 1440): Promise<void> {
  const db = getDbPool();
  if (!db) return;

  try {
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    await db.query(
      `INSERT INTO api_cache (cache_key, response_json, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE response_json = VALUES(response_json), expires_at = VALUES(expires_at)`,
      [key, JSON.stringify(data), expiresAt]
    );
  } catch (e) {
    console.warn("Cache write error:", e);
  }
}
