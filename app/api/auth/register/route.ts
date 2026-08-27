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

    // Set verification token
    await updateUser(user.id, { verification_token: verificationToken, verification_expires: verificationExpires });

    // Send verification email via Resend
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";
    const verifyUrl = `${FRONTEND_URL}/verify?token=${verificationToken}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "MenhelyOnline - Email megerősítés",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e11d48;">Üdvözöljük a MenhelyOnline-on! 🐾</h2>
            <p>Köszönjük, hogy regisztráltál. A fiókod aktiválásához kattints az alábbi gombra:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Email megerősítése</a>
            <p style="color: #666; font-size: 14px;">Ha nem te regisztráltál ezzel az email címmel, hagyd figyelmen kívül ezt az üzenetet.</p>
            <p style="color: #666; font-size: 14px;">A link 24 óráig érvényes.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">MenhelyOnline - Örökbefogadás egyszerűen</p>
          </div>
        `,
      });
      console.log(`Verification email sent to ${email}`);
    } catch (e) {
      console.error("Email sending failed:", e);
      // Don't fail registration if email fails
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
