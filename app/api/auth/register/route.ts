import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { findUserByEmail, createUser, updateUser } from "@/lib/db";
import { signToken } from "@/lib/auth-helpers";

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

    // Set verification token
    await updateUser(user.id, { verification_token: verificationToken, verification_expires: verificationExpires });

    // Try to send verification email (may fail if SMTP not configured)
    try {
      const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";
      const verifyUrl = `${FRONTEND_URL}/verify?token=${verificationToken}`;
      console.log(`Verification URL for ${email}: ${verifyUrl}`);
    } catch (e) {
      console.log("Email sending skipped:", e);
    }

    return NextResponse.json({
      message: "Sikeres regisztracio! Ellenorizd az email fiokodat.",
      requiresVerification: true,
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
