import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3002";
  const verifyUrl = `${FRONTEND_URL}/verify?token=${user.verification_token}`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "MenhelyOnline - Email megerősítés",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #e11d48;">Üdvözöljük a MenhelyOnline-on! 🐾</h2>
          <p>Köszönjük, hogy regisztráltál. A fiókod aktiválásához kattints az alábbi gombra:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e11d48; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0;">Email megerősítése</a>
          <p style="color: #666; font-size: 14px;">A link 24 óráig érvényes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">MenhelyOnline - Örökbefogadás egyszerűen</p>
        </div>
      `,
    });
    return NextResponse.json({ success: true, result, verifyUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 });
  }
}
