import { NextResponse } from "next/server";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY nem allithato elo" }, { status: 500 });
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: "djsummer007@gmail.com",
      subject: "MenhelyOnline - Teszt email",
      html: "<h1>Szia! 🐾</h1><p>Ez egy teszt email a MenhelyOnline rendszerbol.</p><p>Ha ezt latod, minden mukodik!</p>",
    });
    return NextResponse.json({ success: true, result, frontendUrl, apiKeyPrefix: apiKey.substring(0, 6) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e), frontendUrl, apiKeyPrefix: apiKey.substring(0, 6) }, { status: 500 });
  }
}
