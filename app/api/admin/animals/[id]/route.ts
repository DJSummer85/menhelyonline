import { NextRequest, NextResponse } from "next/server";
import { ensureTables, getSql } from "@/lib/db";

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
