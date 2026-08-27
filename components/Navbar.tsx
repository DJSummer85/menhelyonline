"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, Sun, Moon, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/DarkModeProvider";
import { getUser, logout } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/", label: "Kezdőlap" },
  { href: "/animals", label: "Állatok" },
  { href: "/submit", label: "🐾 Felvétel" },
  { href: "/shelters", label: "Menhelyek" },
  { href: "/adopt", label: "Hogyan fogadj örökbe?" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [favCount, setFavCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());

    // Figyeljük a bejelentkezés/kijelentkezés eseményeket
    const handleAuth = () => setUser(getUser());
    window.addEventListener("auth-change", handleAuth);
    return () => window.removeEventListener("auth-change", handleAuth);
  }, []);

  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavCount(favs.length);
    } catch {
      // localStorage not available
    }

    // Listen for storage changes from other tabs/components
    const handleStorage = () => {
      try {
        const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavCount(favs.length);
      } catch {
        // ignore
      }
    };

    // Also poll every 2 seconds to stay in sync with AnimalCard toggles
    const interval = setInterval(() => {
      try {
        const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavCount(favs.length);
      } catch {
        // ignore
      }
    }, 2000);

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-orange-100 dark:border-gray-700/50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center group-hover:bg-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-extrabold text-gray-800 dark:text-white">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 animate-fade-in ${
                    isActive
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                      : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-brand-600 hover:scale-105"
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth buttons + Favorites + Theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dashboard */}
            {user?.role === "shelter" && (
              <Link
                href="/dashboard"
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  pathname === "/dashboard"
                    ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-500"
                }`}
                aria-label="Dashboard"
              >
                <LayoutDashboard size={20} />
              </Link>
            )}
            {/* Admin */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                  pathname === "/admin"
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600"
                }`}
              >
                ⚙️ Admin
              </Link>
            )}
            {/* Favorites */}
            <Link
              href="/favorites"
              className={`relative p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                pathname === "/favorites"
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500"
              }`}
              aria-label={`Kedvencek${favCount > 0 ? ` (${favCount})` : ""}`}
            >
              <Heart size={20} className={favCount > 0 ? "fill-red-500" : ""} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce-in shadow-md">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
              aria-label="Váltás világos/sötét mód között"
            >
              <div className="relative w-[18px] h-[18px]">
                <Sun
                  size={18}
                  className={`absolute inset-0 transition-all duration-500 ${
                    theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "rotate-90 scale-0 opacity-0"
                  }`}
                />
                <Moon
                  size={18}
                  className={`absolute inset-0 transition-all duration-500 ${
                    theme === "dark"
                      ? "-rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
              </div>
            </button>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                >
                  <User size={16} className="text-brand-500" />
                  {user.name}
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setUser(null); }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-brand-600 transition-all duration-300 hover:scale-105"
                >
                  Belépés
                </Link>
                <Link
                  href="/login?tab=register"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 transition-all duration-300 btn-press hover:shadow-lg hover:shadow-brand-500/25"
                >
                  Regisztráció
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Favorites + Theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile favorites */}
            <Link
              href="/favorites"
              className={`relative p-2 rounded-lg transition-all duration-300 ${
                pathname === "/favorites"
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-label="Kedvencek"
            >
              <Heart size={20} className={favCount > 0 ? "fill-red-500" : ""} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                  {favCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              aria-label="Váltás világos/sötét mód között"
            >
              <div className="relative w-[18px] h-[18px]">
                <Sun
                  size={18}
                  className={`absolute inset-0 transition-all duration-500 ${
                    theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "rotate-90 scale-0 opacity-0"
                  }`}
                />
                <Moon
                  size={18}
                  className={`absolute inset-0 transition-all duration-500 ${
                    theme === "dark"
                      ? "-rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                />
              </div>
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-90"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <div className="relative w-5 h-5">
                <Menu
                  size={20}
                  className={`absolute inset-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
                    mobileOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                  }`}
                />
                <X
                  size={20}
                  className={`absolute inset-0 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
                    mobileOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-orange-100 dark:border-gray-700/50 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-400 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="pb-4">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                pathname === item.href
                  ? "text-brand-500 bg-orange-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800"
              }`}
              style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/favorites"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-300 ${
              pathname === "/favorites"
                ? "text-red-500 bg-red-50 dark:bg-gray-800"
                : "text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800"
            }`}
          >
            <Heart size={16} className={favCount > 0 ? "fill-red-500 text-red-500" : ""} />
            Kedvenceim
            {favCount > 0 && (
              <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                pathname === "/admin"
                  ? "text-purple-600 bg-purple-50 dark:bg-gray-800"
                  : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800"
              }`}
            >
              ⚙️ Admin panel
            </Link>
          )}
          <div className="px-6 pt-2 flex gap-2">
            {user ? (
              <>
                <span className="flex-1 flex items-center gap-2 py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  <User size={16} className="text-brand-500" />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => { logout(); setUser(null); setMobileOpen(false); }}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 border border-red-200 dark:border-red-800 btn-press transition-all duration-300"
                >
                  <LogOut size={14} /> Kilépés
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 btn-press transition-all duration-300"
                >
                  Belépés
                </Link>
                <Link
                  href="/login?tab=register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-bold bg-brand-500 text-white btn-press transition-all duration-300"
                >
                  Regisztráció
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
