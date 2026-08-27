import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-helpers";
import { findUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Nincs bejelentkezve" }, { status: 401 });
    }

    const claims = await verifyToken(token);
    if (!claims) {
      return NextResponse.json({ error: "Ervenytelen token" }, { status: 401 });
    }

    const user = await findUserById(claims.id);
    if (!user) {
      return NextResponse.json({ error: "Felhasznalo nem talalhato" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ error: "Szerverhiba" }, { status: 500 });
  }
}
