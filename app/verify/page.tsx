"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_BASE = typeof window !== "undefined"
  ? (window.location.port === "3002" ? "http://localhost:3003" : "/api")
  : "http://localhost:3003";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "already" | "no-token" | "resend">("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const verifyToken = useCallback(async (tok: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify?token=${tok}`);
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
      } else if (data.alreadyVerified) {
        setStatus("already");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Ismeretlen hiba történt");
      }
    } catch {
      setStatus("error");
      setMessage("Nem sikerült kapcsolódni a szerverhez");
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setStatus("no-token");
      setMessage("Nincs ellenőrző token az URL-ben");
    }
  }, [token, verifyToken]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    setResendMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMessage(data.message);
      setStatus("resend");
    } catch {
      setResendMessage("Nem sikerült kapcsolódni a szerverhez");
    } finally {
      setResendLoading(false);
    }
  };

  const icons = {
    loading: <Loader2 className="w-16 h-16 text-brand-500 animate-spin" />,
    success: <CheckCircle className="w-16 h-16 text-green-500" />,
    already: <CheckCircle className="w-16 h-16 text-blue-500" />,
    error: <XCircle className="w-16 h-16 text-red-500" />,
    "no-token": <Mail className="w-16 h-16 text-gray-400" />,
    resend: <Mail className="w-16 h-16 text-brand-500" />,
  };

  const titles = {
    loading: "Ellenőrzés folyamatban...",
    success: "Email megerősítve! ✅",
    already: "Már megerősítve ✅",
    error: "Hiba az ellenőrzésnél ❌",
    "no-token": "Hiányzó token 📧",
    resend: "Új ellenőrző email elküldve 📧",
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 card-shadow border border-gray-100 dark:border-gray-700 text-center">
          <div className="flex justify-center mb-6">
            {icons[status]}
          </div>

          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-3">
            {titles[status]}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            {message}
          </p>

          {/* sikeres ellenőrzés után -> bejelentkezés gomb */}
          {(status === "success" || status === "already") && (
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press shadow-lg shadow-brand-500/20"
            >
              Belépés a fiókomba
            </Link>
          )}

          {/* hiba / no-token -> újraküldés form */}
          {(status === "error" || status === "no-token") && (
            <div className="mt-4">
              <div className="h-px bg-gray-200 dark:bg-gray-700 mb-4" />
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                Új ellenőrző email küldése:
              </p>
              <form onSubmit={handleResend} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pelda@email.com"
                  required
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press disabled:opacity-50"
                >
                  {resendLoading ? "⏳" : "Küldés"}
                </button>
              </form>
              {resendMessage && (
                <p className="mt-3 text-xs text-brand-600 dark:text-brand-400 font-bold">
                  {resendMessage}
                </p>
              )}
            </div>
          )}

          {/* resend siker */}
          {status === "resend" && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                {resendMessage}
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press"
              >
                Bejelentkezés
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
