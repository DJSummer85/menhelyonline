import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_EMAIL_FROM || "MenhelyOnline <onboarding@resend.dev>";
