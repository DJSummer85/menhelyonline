"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Eye,
  Users,
  Calendar,
  Download,
  Trash2,
  ArrowLeft,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  getAnalyticsSummary,
  exportAnalyticsCSV,
  clearAnalytics,
  type AnalyticsSummary,
} from "@/lib/analytics";
import { getUser } from "@/lib/api";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u && u.role === "admin") {
      setData(getAnalyticsSummary());
      setLoaded(true);
    }
    setChecked(true);
  }, []);

  const handleExport = () => {
    const csv = exportAnalyticsCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearAnalytics();
    setData(getAnalyticsSummary());
    setShowClearConfirm(false);
  };

  const refreshData = () => {
    setData(getAnalyticsSummary());
  };

  // Loading
  if (!checked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <span className="animate-spin text-4xl">⏳</span>
        </div>
      </div>
    );
  }

  // Not logged in or not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 dark:bg-gray-900 min-h-screen">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 card-shadow text-center animate-fade-in-up">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Nincs hozzáférésed
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            CSAK adminisztrátorok érhetik el ezt az oldalt.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all"
          >
            Bejelentkezés
          </Link>
        </div>
      </div>
    );
  }

  if (!loaded || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const maxDayViews = Math.max(...data.viewsByDay.map((d) => d.count), 1);
  const maxHourViews = Math.max(...data.viewsByHour.map((d) => d.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              📊 Statisztikák
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
            Oldal látogatottsági adatok — utolsó frissítés: most
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refreshData}
            className="p-2 rounded-xl text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all"
            title="Frissítés"
          >
            <RefreshCw size={18} />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <Download size={14} /> CSV
          </button>
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            title="Adatok törlése"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
        <StatCard
          icon={<Eye size={20} />}
          label="Ma"
          value={data.todayViews}
          color="text-brand-500"
          bgColor="bg-brand-50 dark:bg-brand-500/10"
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Ezen a héten"
          value={data.weekViews}
          color="text-blue-500"
          bgColor="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Ebben a hónapban"
          value={data.monthViews}
          color="text-sage-500"
          bgColor="bg-sage-50 dark:bg-sage-500/10"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Összes"
          value={data.totalViews}
          color="text-purple-500"
          bgColor="bg-purple-50 dark:bg-purple-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily views chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow animate-fade-in-up delay-200">
          <h3 className="font-extrabold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-brand-500" />
            Napi látogatások (30 nap)
          </h3>
          <div className="flex items-end gap-1 h-40">
            {data.viewsByDay.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-brand-400 dark:bg-brand-500 rounded-t transition-all duration-500 hover:bg-brand-500 dark:hover:bg-brand-400"
                  style={{
                    height: `${(d.count / maxDayViews) * 100}%`,
                    minHeight: d.count > 0 ? "4px" : "1px",
                  }}
                  title={`${d.date}: ${d.count} megtekintés`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>{data.viewsByDay[0]?.date}</span>
            <span>{data.viewsByDay[data.viewsByDay.length - 1]?.date}</span>
          </div>
        </div>

        {/* Hourly views chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow animate-fade-in-up delay-300">
          <h3 className="font-extrabold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Látogatások napszak szerint (hét)
          </h3>
          <div className="flex items-end gap-1 h-40">
            {data.viewsByHour.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-blue-400 dark:bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-500 dark:hover:bg-blue-400"
                  style={{
                    height: `${(d.count / maxHourViews) * 100}%`,
                    minHeight: d.count > 0 ? "4px" : "1px",
                  }}
                  title={`${d.hour}:00 — ${d.count} megtekintés`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>0:00</span>
            <span>6:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:00</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top pages */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow lg:col-span-2 animate-fade-in-up delay-300">
          <h3 className="font-extrabold text-gray-800 dark:text-white mb-4">
            🔝 Legnépszerűbb oldalak
          </h3>
          <div className="space-y-2">
            {data.topPages.slice(0, 10).map((p, i) => (
              <div key={p.path} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                      {p.path}
                    </span>
                    <span className="text-xs font-bold text-brand-500 ml-2">
                      {p.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-brand-400 dark:bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(p.count / data.topPages[0]?.count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow animate-fade-in-up delay-400">
          <h3 className="font-extrabold text-gray-800 dark:text-white mb-4">
            📱 Eszközök
          </h3>
          <div className="space-y-4">
            {data.deviceBreakdown.map((d) => {
              const total = data.deviceBreakdown.reduce((s, x) => s + x.count, 0);
              const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
              const Icon =
                d.type === "Mobil" ? Smartphone : d.type === "Tablet" ? Tablet : Monitor;
              return (
                <div key={d.type}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {d.type}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-white">
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-brand-400 dark:bg-brand-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top referrers */}
          <h3 className="font-extrabold text-gray-800 dark:text-white mb-3 mt-6">
            🔗 Honnan jönnek?
          </h3>
          <div className="space-y-2">
            {data.topReferrers.slice(0, 5).map((r) => (
              <div key={r.referrer} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {r.referrer}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 card-shadow animate-scale-in">
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">
              Biztosan törlöd?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Minden analytics adat törlődik. Ez nem vonható vissza!
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Mégse
              </button>
              <button
                type="button"
                onClick={handleClear}
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

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${bgColor} ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-black text-gray-800 dark:text-white">{value}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
        </div>
      </div>
    </div>
  );
}
