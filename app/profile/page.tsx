"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, User, Mail, Shield, Calendar, LogOut } from "lucide-react";
import { getUser, logout } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    user: "Örökbefogadó",
    shelter: "Menhely",
    admin: "Adminisztrátor",
  };

  return (
    <div className="min-h-[80vh] px-4 py-12 dark:bg-gray-900">
      <div className="max-w-lg mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-100 dark:border-gray-700">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
              <User className="w-10 h-10 text-brand-500" />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-center text-xl font-extrabold text-gray-800 dark:text-white mb-1">
            {user.name}
          </h2>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
            {roleLabels[user.role] || user.role}
          </p>

          {/* Data */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Mail className="w-5 h-5 text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Email cím
                </p>
                <p className="text-sm text-gray-800 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Shield className="w-5 h-5 text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Szerep
                </p>
                <p className="text-sm text-gray-800 dark:text-white">
                  {roleLabels[user.role] || user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-brand-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Felhasználó azonosító
                </p>
                <p className="text-sm text-gray-800 dark:text-white">
                  #{user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500 text-white font-bold text-sm hover:bg-purple-600 transition-all btn-press shadow-lg shadow-purple-500/20"
              >
                ⚙️ Admin panel megnyitása
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 dark:border-red-800 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-all btn-press"
            >
              <LogOut size={16} />
              Kilépés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
