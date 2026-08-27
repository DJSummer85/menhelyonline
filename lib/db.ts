import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "user" | "shelter" | "admin";
  verified: number;
  verification_token: string | null;
  verification_expires: string | null;
  created_at: string;
}

interface DB {
  users: User[];
  nextId: number;
}

function ensureDir() {
  const dir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readDB(): DB {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) {
    const initial: DB = {
      users: [
        {
          id: 1,
          email: "admin@menhelyonline.hu",
          password: "$2b$12$LJ3m4ys4SzYn5NjMIvf2ZeRvFQmPzVYK1fGfqF8e1K3z5M7x9N2bW",
          name: "Admin",
          role: "admin",
          verified: 1,
          verification_token: null,
          verification_expires: null,
          created_at: new Date().toISOString(),
        },
      ],
      nextId: 2,
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data: DB) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function findUserByEmail(email: string): User | undefined {
  return readDB().users.find((u) => u.email === email);
}

export function findUserById(id: number): User | undefined {
  return readDB().users.find((u) => u.id === id);
}

export function findUserByVerificationToken(token: string): User | undefined {
  return readDB().users.find((u) => u.verification_token === token);
}

export function createUser(
  user: Omit<User, "id" | "created_at" | "verified" | "verification_token" | "verification_expires">
): User {
  const db = readDB();
  const newUser: User = {
    ...user,
    id: db.nextId,
    verified: 0,
    verification_token: null,
    verification_expires: null,
    created_at: new Date().toISOString(),
  };
  db.users.push(newUser);
  db.nextId++;
  writeDB(db);
  return newUser;
}

export function updateUser(id: number, updates: Partial<User>): void {
  const db = readDB();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...updates };
    writeDB(db);
  }
}
