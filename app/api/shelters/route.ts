import { NextRequest, NextResponse } from "next/server";
import { ensureTables, getSql } from "@/lib/db";

export async function GET() {
  await ensureTables();
  const sql = getSql();
  const rows = await sql`SELECT * FROM shelters WHERE approved = 1 ORDER BY name`;
  return NextResponse.json(rows);
}
