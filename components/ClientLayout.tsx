"use client";

import DarkModeProvider from "@/components/DarkModeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTracker from "@/components/PageTracker";
import { type ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <DarkModeProvider>
      <PageTracker />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </DarkModeProvider>
  );
}
