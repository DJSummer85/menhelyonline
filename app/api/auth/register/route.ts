import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { findUserByEmail, createUser, updateUser } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role = "user" } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Kotelezo mezok: email, jelszo, nev" },
        { status: 400 }
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Ez az email mar regisztralva van" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      role: role === "shelter" ? "shelter" : "user",
    });

    // TODO: Email verification visszakapcsolasa ha sajat domain lesz
    // Egyelore auto-verify: azonnal be tud jelentkezni
    await updateUser(user.id, { verified: 1 });

    // Generate token a bejelentkezéshez
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      message: "Sikeres regisztracio!",
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
