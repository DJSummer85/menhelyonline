import { NextRequest, NextResponse } from "next/server";
import { findUserByVerificationToken, updateUser } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Hianyo ellenorzo token" },
        { status: 400 }
      );
    }

    const user = findUserByVerificationToken(token);
    if (!user) {
      return NextResponse.json(
        { error: "ervenytelen ellenorzo token" },
        { status: 400 }
      );
    }

    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
      return NextResponse.json(
        { error: "Az ellenorzo link lejart. Kerj uj linket." },
        { status: 400 }
      );
    }

    if (user.verified) {
      return NextResponse.json({
        message: "Az email cimed mar megerositve van. Bejelentkezhetsz!",
        alreadyVerified: true,
      });
    }

    updateUser(user.id, {
      verified: 1,
      verification_token: null,
      verification_expires: null,
    });

    return NextResponse.json({
      message: "Sikeres email megerosites! Most mar bejelentkezhetsz.",
      success: true,
    });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json(
      { error: "Szerverhiba" },
      { status: 500 }
    );
  }
}
