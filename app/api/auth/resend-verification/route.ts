import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findUserByEmail, updateUser } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";

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

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "MenhelyOnline - Email megerősítés",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e11d48;">Email megerősítés 🐾</h2>
            <p>Kattints az alábbi gombra a fiókod aktiválásához:</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Email megerősítése</a>
            <p style="color: #666; font-size: 14px;">A link 24 óráig érvényes.</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Email sending failed:", e);
    }

    return NextResponse.json({ message: "Uj ellenorzo email elkuldve!" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
