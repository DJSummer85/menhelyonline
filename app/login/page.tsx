"use client";

import { useState } from "react";
import { Heart, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api";

type Tab = "login" | "register";
type Role = "user" | "shelter";

const API_BASE = typeof window !== "undefined"
  ? (window.location.port === "3002" ? "http://localhost:3003" : "")
  : "http://localhost:3003";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [role, setRole] = useState<Role>("user");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [county, setCounty] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showResend, setShowResend] = useState(false);

  const handleResendDirect = async () => {
    const resendEmail = email.trim();
    if (!resendEmail) {
      setResendMessage("⚠️ Kérlek, add meg az email címed!");
      return;
    }
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || "Email elküldve!");
    } catch {
      setResendMessage("⚠️ Nem sikerült elküldeni az emailt");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVerificationNeeded(false);
    setResendMessage("");

    try {
      if (tab === "login") {
        const result = await login(email, password);
        // Admin fiók → admin oldalra
        if (result.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        await register(email, password, name || shelterName, role);
        // Auto-login: azonnal átirányítás
        router.push("/");
      }
    } catch (err: any) {
      const msg = err.message || "Hiba történt";
      if (msg.includes("még nincs megerősítve")) {
        setVerificationNeeded(true);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setResendMessage(data.message || "Email elküldve!");
    } catch {
      setResendMessage("Nem sikerült elküldeni az emailt");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-down">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-brand-500/25">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up delay-100">
            {tab === "login"
              ? "Lépj be a fiókodba"
              : "Hozz létre egy fiókot"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-100 dark:border-gray-700 animate-scale-in">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                  tab === t
                    ? "bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-md"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {t === "login" ? "Belépés" : "Regisztráció"}
              </button>
            ))}
          </div>

          {tab === "register" && (
            <div className="flex gap-3 mb-5 animate-fade-in-down">
              {([
                { value: "user" as Role, label: "Örökbefogadó", icon: "👤" },
                { value: "shelter" as Role, label: "Menhely", icon: "🏠" },
              ]).map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 btn-press ${
                    role === r.value
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <span>{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl px-4 py-2.5 mb-4 animate-fade-in">
              <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                ⚠️ {error}
              </p>
              {verificationNeeded && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-xs font-bold text-brand-500 hover:text-brand-600 underline transition-colors disabled:opacity-50"
                  >
                    {resendLoading ? "Küldés..." : "📧 Új ellenőrző email küldése"}
                  </button>
                  {resendMessage && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold">{resendMessage}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-8 animate-scale-in">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">
                Ellenőrizd az emailed!
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Küldtünk egy visszaigazoló emailt a <span className="font-bold text-brand-500">{email}</span> címre.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                Kattints a linkre a fiókod aktiválásához. A link 24 óráig érvényes.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setTab("login"); }}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press shadow-md"
                >
                  ✅ Rendben, bejelentkezek
                </button>
                <Link
                  href={`/verify?resend=true&email=${encodeURIComponent(email)}`}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-500 transition-colors"
                >
                  Nem kaptam emailt → Újraküldés
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && role === "user" && (
                <div className="animate-fade-in-up" style={{ animationDelay: "50ms" }}>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                    Teljes név
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Pl. Kovács János"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              )}

              {tab === "register" && role === "shelter" && (
                <div className="space-y-4 animate-fade-in-up">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      Menhely neve
                    </label>
                    <input
                      type="text"
                      value={shelterName}
                      onChange={(e) => setShelterName(e.target.value)}
                      placeholder="Pl. Bogáncs Menhely"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                      Megye
                    </label>
                    <input
                      type="text"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      placeholder="Pl. Zala"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                  E-mail cím
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pelda@email.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                  Jelszó
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 btn-press"
                  >
                    <div className="relative w-4 h-4">
                      <Eye
                        size={16}
                        className={`absolute inset-0 transition-all duration-300 ${
                          showPass ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
                        }`}
                      />
                      <EyeOff
                        size={16}
                        className={`absolute inset-0 transition-all duration-300 ${
                          showPass ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/20 btn-press hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Betöltés...
                  </span>
                ) : (
                  tab === "login" ? "Belépés" : "Regisztráció"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 animate-fade-in-up delay-300">
          {tab === "login" ? (
            <>
              Még nincs fiókod?{" "}
              <button
                type="button"
                onClick={() => { setTab("register"); setError(""); }}
                className="text-brand-500 font-bold hover:underline transition-colors duration-200"
              >
                Regisztrálj
              </button>
            </>
          ) : (
            <>
              Már van fiókod?{" "}
              <button
                type="button"
                onClick={() => { setTab("login"); setError(""); }}
                className="text-brand-500 font-bold hover:underline transition-colors duration-200"
              >
                Lépj be
              </button>
            </>
          )}
        </p>

        {/* Resend verification section */}
        <div className="mt-4 text-center">
          {!showResend ? (
            <button
              type="button"
              onClick={() => {
                setShowResend(true);
                setError("");
                setResendMessage("");
              }}
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-500 transition-colors duration-200 py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              📧 Nem kaptad meg az aktiváló emailt? <span className="font-bold underline">Újraküldés</span>
            </button>
          ) : (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-xl animate-fade-in text-left">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-3">
                📧 Aktiváló email újraküldése
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Add meg a regisztrált email címed"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <button
                  type="button"
                  onClick={handleResendDirect}
                  disabled={resendLoading}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-all btn-press disabled:opacity-50 whitespace-nowrap"
                >
                  {resendLoading ? "⏳ Küldés..." : "📧 Küldés"}
                </button>
              </div>
              {resendMessage && (
                <div className={`mt-3 p-2.5 rounded-lg text-xs font-bold ${resendMessage.startsWith('⚠️') ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                  {resendMessage}
                </div>
              )}
              <button
                type="button"
                onClick={() => { setShowResend(false); setResendMessage(""); }}
                className="mt-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕ Bezárás
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
