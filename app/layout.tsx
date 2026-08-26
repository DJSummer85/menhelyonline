import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "MenhelyOnline — Örökbefogadás egyszerűen",
  description:
    "Magyarország legnagyobb örökbefogadási platformja. Találd meg új kedvencedet, vagy támogass egy menhelyet!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
