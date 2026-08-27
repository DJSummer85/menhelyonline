import { NextRequest, NextResponse } from "next/server";
import { ensureTables, getSql } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureTables();
  const sql = getSql();
  const { id } = await params;

  const rows = await sql`SELECT * FROM animals WHERE id = ${parseInt(id)}`;
  if (!rows[0]) {
    return NextResponse.json({ error: "Nem található" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureTables();
  const sql = getSql();
  const { id } = await params;
  const body = await req.json();

  if (body.status) {
    const validStatuses = ["available", "pending", "adopted"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Érvénytelen státusz" }, { status: 400 });
    }
    await sql`UPDATE animals SET status = ${body.status} WHERE id = ${parseInt(id)}`;
  }

  const rows = await sql`SELECT * FROM animals WHERE id = ${parseInt(id)}`;
  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureTables();
  const sql = getSql();
  const { id } = await params;
  await sql`DELETE FROM animals WHERE id = ${parseInt(id)}`;
  return NextResponse.json({ success: true });
}
