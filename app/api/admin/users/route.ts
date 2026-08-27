import { NextResponse } from "next/server";
import { ensureTables, getSql } from "@/lib/db";

export async function GET() {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}
