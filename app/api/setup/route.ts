import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureTables, getSql } from "@/lib/db";

export async function POST(req: NextRequest) {
  await ensureTables();
  const sql = getSql();
  const { email, password, name, secret } = await req.json();

  // Simple secret check
  if (secret !== "menhelyonline-setup-2026") {
    return NextResponse.json({ error: "Hibás titkos kód" }, { status: 403 });
  }

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Hiányzó adatok" }, { status: 400 });
  }

  // Check if user exists
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing[0]) {
    return NextResponse.json({ error: "Ez az email már regisztrálva van" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const rows = await sql`
    INSERT INTO users (email, password, name, role, verified)
    VALUES (${email}, ${hashedPassword}, ${name}, 'admin', 1)
    RETURNING id, email, name, role
  `;

  return NextResponse.json({
    message: "Admin fiók létrehozva!",
    user: rows[0],
  });
}
