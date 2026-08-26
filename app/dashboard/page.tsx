"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart, Plus, LogOut, PawPrint, Users, CheckCircle, XCircle,
  MapPin, Trash2, Edit, Eye,
} from "lucide-react";
import { getUser, logout, getMyShelter, getMyAdoptions, updateAdoption } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [shelter, setShelter] = useState<any>(null);
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"animals" | "adoptions">("animals");

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "shelter") {
      router.push("/login");
      return;
    }
    setUser(u);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, a] = await Promise.all([getMyShelter(), getMyAdoptions()]);
      setShelter(s);
      setAdoptions(a);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoption = async (id: number, status: "approved" | "rejected") => {
    try {
      await updateAdoption(id, status);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500 dark:text-gray-400">Betöltés...</p>
        </div>
      </div>
    );
  }

  if (!shelter) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
            Még nincs menhelyed
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Regisztrálj menhelyként, és hozd létre az első menhelyedet!
          </p>
          <Link
            href="/shelters"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press"
          >
            Menhely létrehozása
          </Link>
        </div>
      </div>
    );
  }

  const pendingAdoptions = adoptions.filter((a) => a.status === "pending");
  const processedAdoptions = adoptions.filter((a) => a.status !== "pending");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {shelter.name} 🏠
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {shelter.location} · Menhelyi dashboard
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all btn-press"
        >
          <LogOut size={14} /> Kilépés
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-100">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-brand-500">{adoptions.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Örökbefogadás
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-yellow-500">{pendingAdoptions.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Függőben
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-sage-500">
            {processedAdoptions.filter((a) => a.status === "approved").length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Jóváhagyva
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 animate-fade-in-up delay-200">
        {([
          { value: "adoptions" as const, label: `Kérelmek (${pendingAdoptions.length})`, icon: <Users size={16} /> },
          { value: "animals" as const, label: "Állataim", icon: <PawPrint size={16} /> },
        ]).map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 btn-press ${
              tab === t.value
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Adoptions Tab */}
      {tab === "adoptions" && (
        <div className="space-y-4 animate-fade-in-up">
          {pendingAdoptions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center card-shadow">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Nincsenek függőben lévő kérelmek
              </p>
            </div>
          ) : (
            pendingAdoptions.map((ad) => (
              <div
                key={ad.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow border border-yellow-200 dark:border-yellow-700/30"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={ad.animal_image}
                    alt={ad.animal_name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-extrabold text-gray-800 dark:text-white">
                        {ad.animal_name}
                      </h3>
                      <span className="text-[10px] font-bold text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                        ÚJ
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Jelentkező: <strong>{ad.user_name}</strong> ({ad.user_email})
                    </p>
                    {ad.message && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-3">
                        &ldquo;{ad.message}&rdquo;
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdoption(ad.id, "approved")}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-sage-500 text-white text-xs font-bold hover:bg-sage-600 transition-all btn-press"
                      >
                        <CheckCircle size={14} /> Jóváhagyás
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdoption(ad.id, "rejected")}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all btn-press"
                      >
                        <XCircle size={14} /> Elutasítás
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Animals Tab */}
      {tab === "animals" && (
        <div className="animate-fade-in-up">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center card-shadow">
            <div className="text-4xl mb-3">🐾</div>
            <h3 className="font-extrabold text-gray-800 dark:text-white mb-2">
              Állatok feltöltése
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hamarosan itt feltöltheted az állataidat és kezelheted őket.
            </p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-bold">
              🔜 Hamarosan
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
