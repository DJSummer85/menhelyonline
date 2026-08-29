"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  User,
  Home,
  PawPrint,
  Upload,
  Calculator,
  Building2,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/DarkModeProvider";
import { getUser, logout } from "@/lib/api";

const NAV_ITEMS = [
  { href: "/", label: "Kezdőlap", icon: Home },
  { href: "/animals", label: "Állatok", icon: PawPrint },
  { href: "/submit", label: "Felvétel", icon: Upload },
  { href: "/calculator", label: "Kalkulátor", icon: Calculator },
  { href: "/shelters", label: "Menhelyek", icon: Building2 },
  { href: "/adopt", label: "Örökbefogadás", icon: HelpCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [favCount, setFavCount] = useState(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());

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

    const handleStorage = () => {
      try {
        const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavCount(favs.length);
      } catch {
        // ignore
      }
    };

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
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-orange-100/80 dark:border-gray-700/40 shadow-sm shadow-orange-100/20 dark:shadow-black/10 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" strokeWidth={0} />
            </div>
            <span className="text-lg font-black text-gray-800 dark:text-white tracking-tight hidden sm:block">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>

          {/* Desktop nav — pill-style with icons */}
          <div className="hidden lg:flex items-center bg-gray-100/70 dark:bg-gray-800/60 rounded-2xl p-1 gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.02]"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/80 hover:shadow-sm"
                  }`}
                >
                  <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth buttons + Favorites + Theme toggle */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Dashboard */}
            {user?.role === "shelter" && (
              <Link
                href="/dashboard"
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                  pathname === "/dashboard"
                    ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                    : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-500"
                }`}
                aria-label="Dashboard"
              >
                <LayoutDashboard size={18} />
              </Link>
            )}
            {/* Admin */}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 ${
                  pathname === "/admin"
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400"
                    : "text-gray-400 dark:text-gray-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600"
                }`}
              >
                ⚙️ Admin
              </Link>
            )}
            {/* Favorites */}
            <Link
              href="/favorites"
              className={`relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                pathname === "/favorites"
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500"
              }`}
              aria-label={`Kedvencek${favCount > 0 ? ` (${favCount})` : ""}`}
            >
              <Heart size={18} className={favCount > 0 ? "fill-red-500" : ""} />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-bounce-in shadow-md">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
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
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="hidden xl:inline">{user.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setUser(null); }}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 hover:scale-105"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 hover:scale-105"
                >
                  Belépés
                </Link>
                <Link
                  href="/login?tab=register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all duration-300 btn-press shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30 hover:scale-[1.02]"
                >
                  Regisztráció
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Favorites + Theme toggle + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/favorites"
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                pathname === "/favorites"
                  ? "text-red-500 bg-red-50 dark:bg-red-500/10"
                  : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              className="p-2 rounded-xl text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
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
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-90"
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
        className={`lg:hidden border-t border-orange-100/80 dark:border-gray-700/40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden transition-all duration-400 ease-in-out ${
          mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <div className="p-3 space-y-1">
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}

          {/* Favorites in mobile */}
          <Link
            href="/favorites"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              pathname === "/favorites"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Heart size={18} className={favCount > 0 ? "fill-current" : ""} />
            Kedvenceim
            {favCount > 0 && (
              <span className="ml-auto min-w-[20px] h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center px-1">
                {favCount}
              </span>
            )}
          </Link>

          {/* Admin in mobile */}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                pathname === "/admin"
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-500/10"
              }`}
            >
              ⚙️ Admin panel
            </Link>
          )}

          {/* Divider */}
          <div className="h-px bg-gray-200/60 dark:bg-gray-700/40 mx-2 my-1" />

          {/* Auth section */}
          <div className="px-2 pt-1 flex gap-2">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center gap-2 py-2.5 px-3 text-sm font-semibold text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center shrink-0">
                    <User size={14} className="text-white" />
                  </div>
                  {user.name}
                </Link>
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
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 btn-press transition-all duration-300"
                >
                  Belépés
                </Link>
                <Link
                  href="/login?tab=register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-600 text-white btn-press shadow-md shadow-brand-500/20 transition-all duration-300"
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
