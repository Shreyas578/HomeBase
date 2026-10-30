import fs from "fs";
import path from "path";
import { StudentProfile } from "@/types";

export interface StoredUserRecord {
  profile: StudentProfile;
  passwordHash: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureFileExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({}), "utf-8");
    }
  } catch (e) {
    console.warn("UserStore FS warning:", e);
  }
}

function readAllUsers(): Record<string, StoredUserRecord> {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch {
    return {};
  }
}

function writeAllUsers(users: Record<string, StoredUserRecord>) {
  ensureFileExists();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (e) {
    console.warn("Failed to write to users.json:", e);
  }
}

class PersistentUserStore {
  get(email: string): StoredUserRecord | undefined {
    const key = email.toLowerCase().trim();
    const users = readAllUsers();
    return users[key];
  }

  set(email: string, record: StoredUserRecord): void {
    const key = email.toLowerCase().trim();
    const users = readAllUsers();
    users[key] = record;
    writeAllUsers(users);
  }

  has(email: string): boolean {
    const key = email.toLowerCase().trim();
    const users = readAllUsers();
    return Boolean(users[key]);
  }

  entries(): [string, StoredUserRecord][] {
    const users = readAllUsers();
    return Object.entries(users);
  }

  values(): StoredUserRecord[] {
    const users = readAllUsers();
    return Object.values(users);
  }
}

export const inMemoryUsers = new PersistentUserStore();
