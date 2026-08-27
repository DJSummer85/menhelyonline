import { neon } from "@neondatabase/serverless";

let sql: ReturnType<typeof neon>;

function cleanUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return raw;
  }
}

function getSql() {
  if (!sql) {
    const raw = process.env.DATABASE_URL;
    if (!raw) throw new Error("DATABASE_URL környezeti változó nincs beállítva!");
    sql = neon(cleanUrl(raw));
  }
  return sql;
}

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

let initialized = false;

async function ensureTables() {
  if (initialized) return;
  await getSql()`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'shelter', 'admin')),
      verified INTEGER DEFAULT 0,
      verification_token TEXT,
      verification_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  initialized = true;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM users WHERE email = ${email}`;
  return rows[0] as User | undefined;
}

export async function findUserById(id: number): Promise<User | undefined> {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM users WHERE id = ${id}`;
  return rows[0] as User | undefined;
}

export async function findUserByVerificationToken(token: string): Promise<User | undefined> {
  await ensureTables();
  const rows = await getSql()`SELECT * FROM users WHERE verification_token = ${token}`;
  return rows[0] as User | undefined;
}

export async function createUser(
  user: Pick<User, "email" | "password" | "name" | "role">
): Promise<User> {
  await ensureTables();
  const rows = await getSql()`
    INSERT INTO users (email, password, name, role)
    VALUES (${user.email}, ${user.password}, ${user.name}, ${user.role})
    RETURNING *
  `;
  return rows[0] as User;
}

export async function updateUser(id: number, updates: Partial<Pick<User, "verified" | "verification_token" | "verification_expires">>): Promise<void> {
  await ensureTables();
  if (updates.verified !== undefined) {
    await getSql()`UPDATE users SET verified = ${updates.verified} WHERE id = ${id}`;
  }
  if (updates.verification_token !== undefined) {
    await getSql()`UPDATE users SET verification_token = ${updates.verification_token} WHERE id = ${id}`;
  }
  if (updates.verification_expires !== undefined) {
    await getSql()`UPDATE users SET verification_expires = ${updates.verification_expires} WHERE id = ${id}`;
  }
}
