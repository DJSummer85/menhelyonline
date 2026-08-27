"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  PawPrint,
  Users,
  BarChart3,
  Trash2,
  Eye,
  MapPin,
  LogOut,
} from "lucide-react";
import { getUser, logout } from "@/lib/api";

const API_BASE = "";

type Tab = "animals" | "users" | "stats";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("animals");
  const [animals, setAnimals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ animals: 0, users: 0, shelters: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "admin") {
      setLoading(false);
      return;
    }
    setUser(u);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [animalsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/api/animals?status=available`),
        fetch(`${API_BASE}/api/admin/users`),
      ]);
      const animalsData = animalsRes.ok ? await animalsRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];
      setAnimals(animalsData);
      setUsers(usersData);
      setStats({
        animals: animalsData.length,
        users: usersData.length,
        shelters: usersData.filter((u: any) => u.role === "shelter").length,
      });
    } catch (e) {
      console.error("Admin load error:", e);
    }
    setLoading(false);
  };

  const deleteAnimal = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/animals/${id}`, { method: "DELETE" });
      setAnimals(animals.filter((a) => a.id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center dark:bg-gray-900">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
            Nincs hozzáférésed
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            CSAK adminisztrátorok érhetik el ezt az oldalt.
          </p>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all"
          >
            Bejelentkezés
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Üdv, {user.name}!
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { logout(); window.location.href = "/"; }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} /> Kilépés
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-100">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <PawPrint size={20} />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-800 dark:text-white">{stats.animals}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Állat</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-800 dark:text-white">{stats.users}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Felhasználó</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-50 dark:bg-sage-500/10 text-sage-500 flex items-center justify-center">
              🏠
            </div>
            <div>
              <div className="text-2xl font-black text-gray-800 dark:text-white">{stats.shelters}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Menhely</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 animate-fade-in-up delay-200">
        {([
          { key: "animals", label: "🐾 Állatok", icon: <PawPrint size={16} /> },
          { key: "users", label: "👥 Felhasználók", icon: <Users size={16} /> },
          { key: "stats", label: "📊 Statisztikák", icon: <BarChart3 size={16} /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all btn-press ${
              tab === t.key
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Animals tab */}
      {tab === "animals" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl card-shadow border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-extrabold text-gray-800 dark:text-white">
              🐾 Állatok kezelése ({animals.length})
            </h3>
          </div>
          {animals.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-3xl mb-2">🐾</p>
              <p>Még nincsenek állatok az adatbázisban.</p>
              <Link href="/submit" className="text-brand-500 font-bold text-sm hover:underline">
                + Első állat felvétele
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {animals.map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <img
                    src={a.image || "/placeholder-pet.svg"}
                    alt={a.name}
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 dark:text-white truncate">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {a.species} · {a.gender || "?"} · {a.size || "?"}
                      {a.location && (
                        <span className="flex items-center gap-0.5 ml-1">
                          <MapPin size={10} /> {a.location}
                        </span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/animals/${a.id}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                    title="Megtekintés"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(a.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title="Törlés"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {tab === "users" && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl card-shadow border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-extrabold text-gray-800 dark:text-white">
              👥 Felhasználók ({users.length})
            </h3>
          </div>
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-3xl mb-2">👥</p>
              <p>Még nincsenek felhasználók.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">
                      {u.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-800 dark:text-white truncate">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    u.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      : u.role === "shelter"
                      ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {u.role === "admin" ? "Admin" : u.role === "shelter" ? "Menhely" : "Felhasználó"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats tab */}
      {tab === "stats" && (
        <div className="animate-fade-in-up">
          <Link
            href="/admin/analytics"
            className="block bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-100 dark:border-gray-700 hover:border-brand-300 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 size={28} className="text-brand-500" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">
                  📊 Részletes statisztikák
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Oldal látogatottság, eszközök, források — minden adat egy helyen
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 card-shadow animate-scale-in">
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">
              Biztosan törlöd?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Ez az állat véglegesen törlődik az adatbázisból!
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Mégse
              </button>
              <button
                type="button"
                onClick={() => deleteAnimal(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
