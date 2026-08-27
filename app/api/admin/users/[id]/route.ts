import { NextRequest, NextResponse } from "next/server";
import { ensureTables, getSql } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureTables();
  const sql = getSql();
  const { id } = await params;
  const userId = parseInt(id);

  // Don't allow deleting yourself
  const userCheck = await sql`SELECT role FROM users WHERE id = ${userId}`;
  if (userCheck[0]?.role === "admin") {
    // Count admins
    const adminCount = await sql`SELECT COUNT(*)::int as count FROM users WHERE role = 'admin'`;
    if (adminCount[0].count <= 1) {
      return NextResponse.json({ error: "Nem törölheted az utolsó admin felhasználót!" }, { status: 400 });
    }
  }

  // Delete associated animals first
  await sql`DELETE FROM animals WHERE owner_id = ${userId}`;

  // Delete the user
  await sql`DELETE FROM users WHERE id = ${userId}`;

  return NextResponse.json({ success: true });
}
