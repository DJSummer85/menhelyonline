import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findUserByEmail, updateUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email cim megadasa kotelezo" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({
        message: "Ha ilyen email cimmel regisztraltal, uj ellenorzo emailt kuldunk.",
      });
    }

    if (user.verified) {
      return NextResponse.json({
        message: "Az email cimed mar megerositve van. Bejelentkezhetsz.",
        alreadyVerified: true,
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    await updateUser(user.id, {
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";
    const verifyUrl = `${FRONTEND_URL}/verify?token=${verificationToken}`;
    console.log(`Resent verification URL for ${email}: ${verifyUrl}`);

    return NextResponse.json({ message: "Uj ellenorzo email elkuldve!" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
