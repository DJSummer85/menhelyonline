import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/db";
import { signToken } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Hibas email vagy jelszo" },
        { status: 401 }
      );
    }

    // TODO: Email verification visszakapcsolasa ha sajat domain lesz
    // if (!user.verified) {
    //   return NextResponse.json({ error: "...", requiresVerification: true }, { status: 403 });
    // }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
