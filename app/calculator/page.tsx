"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  CheckCircle2,
  Info,
  Globe,
  RefreshCw,
} from "lucide-react";

type AnimalType = "kutya" | "macska" | "kisallat" | "madar" | "hullo";
type Currency = "HUF" | "EUR";

interface CostItem {
  name: string;
  min: number;
  max: number;
  period: "egyszeri" | "havi" | "évi";
  required: boolean;
  description: string;
  emoji?: string;
}

const costsByType: Record<AnimalType, CostItem[]> = {
  kutya: [
    { name: "Örökbefogadási díj", min: 5000, max: 20000, period: "egyszeri", required: true, description: "A menhely által kért szimbolikus díj (oltás, chip, ivartalanítás fedezése)", emoji: "🏠" },
    { name: "Eledel (száraztáp)", min: 8000, max: 25000, period: "havi", required: true, description: "Minőségi kutyatáp mérettől függően", emoji: "🍖" },
    { name: "Eledel (konzerv/nasik)", min: 2000, max: 5000, period: "havi", required: false, description: "Kiegészítő eledel, jutalomfalatok", emoji: "🦴" },
    { name: "Állatorvosi költségek", min: 15000, max: 40000, period: "évi", required: true, description: "Éves oltások, ellenőrzés, féreghajtás", emoji: "💊" },
    { name: "Kutyaóvoda / sétáltatás", min: 15000, max: 40000, period: "havi", required: false, description: "Ha nincs idő naponta sétáltatni", emoji: "🚶" },
    { name: "Felszerelés (egyszeri)", min: 15000, max: 50000, period: "egyszeri", required: true, description: "Póráz, nyakörv, ház/ágy, tálak, játékok, szállítóbox", emoji: "🎒" },
    { name: "Kozmetika / ápolás", min: 3000, max: 10000, period: "havi", required: false, description: "Fajtától függően: fürdetés, körömvágás, szőrvágás", emoji: "✂️" },
    { name: "Biztosítás", min: 3000, max: 8000, period: "havi", required: false, description: "Állatbiztosítás betegség és baleset esetére", emoji: "🛡️" },
    { name: "Játékok és kiegészítők", min: 2000, max: 5000, period: "havi", required: false, description: "Rágcsák, labdák, kötél, frizbi", emoji: "🧸" },
  ],
  macska: [
    { name: "Örökbefogadási díj", min: 5000, max: 15000, period: "egyszeri", required: true, description: "A menhely által kért szimbolikus díj", emoji: "🏠" },
    { name: "Eledel (száraztáp)", min: 5000, max: 15000, period: "havi", required: true, description: "Minőségi macskaeledel", emoji: "🐟" },
    { name: "Eledel (konzerv)", min: 3000, max: 8000, period: "havi", required: false, description: "Nedves eledel, jutalomfalatok", emoji: "🥫" },
    { name: "Állatorvosi költségek", min: 15000, max: 35000, period: "évi", required: true, description: "Éves oltások, ellenőrzés, féreghajtás", emoji: "💊" },
    { name: "Alom és alomtálca", min: 3000, max: 6000, period: "havi", required: true, description: "Bent tartott macskáknál kötelező", emoji: "🧱" },
    { name: "Felszerelés (egyszeri)", min: 10000, max: 30000, period: "egyszeri", required: true, description: "Kaparófa, macskaház, játékok, tálak, szállítóbox", emoji: "🎒" },
    { name: "Karmolászás / kozmetika", min: 2000, max: 5000, period: "havi", required: false, description: "Karmok vágása, szőrápolás (hosszúszőrűeknél)", emoji: "✂️" },
    { name: "Biztosítás", min: 2000, max: 6000, period: "havi", required: false, description: "Állatbiztosítás", emoji: "🛡️" },
  ],
  kisallat: [
    { name: "Örökbefogadási díj", min: 2000, max: 8000, period: "egyszeri", required: true, description: "Szimbolikus díj", emoji: "🏠" },
    { name: "Eledel", min: 2000, max: 5000, period: "havi", required: true, description: "Magok, széna, zöldségek, pellet", emoji: "🥕" },
    { name: "Állatorvosi költségek", min: 10000, max: 25000, period: "évi", required: true, description: "Éves ellenőrzés, oltások (ha van)", emoji: "💊" },
    { name: "Felszerelés (egyszeri)", min: 10000, max: 30000, period: "egyszeri", required: true, description: "Ketrec/akvárium, alom, játékok, futókerék", emoji: "🎒" },
    { name: "Alom / almozás", min: 1500, max: 4000, period: "havi", required: true, description: "Rágcsálóknál kötelező", emoji: "🧱" },
  ],
  madar: [
    { name: "Örökbefogadási díj", min: 3000, max: 10000, period: "egyszeri", required: true, description: "Szimbolikus díj", emoji: "🏠" },
    { name: "Eledel (magok, keverék)", min: 3000, max: 8000, period: "havi", required: true, description: "Madáreledel keverék, gyümölcsök", emoji: "🌾" },
    { name: "Állatorvosi költségek", min: 10000, max: 20000, period: "évi", required: true, description: "Éves ellenőrzés", emoji: "💊" },
    { name: "Felszerelés (egyszeri)", min: 15000, max: 50000, period: "egyszeri", required: true, description: "Kalitka, röpdék, játékok, fürdő", emoji: "🎒" },
    { name: "Kiegészítők", min: 1000, max: 3000, period: "havi", required: false, description: "Ágak, játékok, fürdetés", emoji: "🪵" },
  ],
  hullo: [
    { name: "Örökbefogadási díj", min: 2000, max: 8000, period: "egyszeri", required: true, description: "Szimbolikus díj", emoji: "🏠" },
    { name: "Eledel", min: 2000, max: 6000, period: "havi", required: true, description: "Rovarok, zöldségek, tápkiegészítők", emoji: "🦗" },
    { name: "Állatorvosi költségek", min: 10000, max: 20000, period: "évi", required: true, description: "Éves ellenőrzés", emoji: "💊" },
    { name: "Felszerelés (egyszeri)", min: 20000, max: 60000, period: "egyszeri", required: true, description: "Terrárium, UV lámpa, fűtés, hőmérő, díszletek", emoji: "🎒" },
    { name: "Villany / fűtés", min: 2000, max: 5000, period: "havi", required: true, description: "Terrárium fűtése és világítása", emoji: "🔌" },
  ],
};

const animalTypes: { value: AnimalType; label: string; emoji: string }[] = [
  { value: "kutya", label: "Kutya", emoji: "🐕" },
  { value: "macska", label: "Macska", emoji: "🐱" },
  { value: "kisallat", label: "Kisállat", emoji: "🐹" },
  { value: "madar", label: "Madár", emoji: "🦜" },
  { value: "hullo", label: "Hüllő", emoji: "🦎" },
];

// Árfolyam (1 EUR = X HUF)
const DEFAULT_EUR_RATE = 405;

function formatHUF(n: number): string {
  return n.toLocaleString("hu-HU") + " Ft";
}

function formatEUR(n: number): string {
  return "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function CalculatorPage() {
  const [selectedType, setSelectedType] = useState<AnimalType>("kutya");
  const [showOptional, setShowOptional] = useState(true);
  const [currency, setCurrency] = useState<Currency>("HUF");
  const [eurRate, setEurRate] = useState(DEFAULT_EUR_RATE);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateSource, setRateSource] = useState<"mnb" | "fallback">("fallback");

  // Árfolyam lekérése az MNB-től (valós idejű)
  useEffect(() => {
    async function fetchRate() {
      setRateLoading(true);
      try {
        const res = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
        const data = await res.json();
        if (data.rates?.HUF) {
          setEurRate(data.rates.HUF);
          setRateSource("fallback");
        }
      } catch {
        // használjuk az alapértelmezett árfolyamot
      } finally {
        setRateLoading(false);
      }
    }
    fetchRate();
  }, []);

  const toEUR = (huf: number) => Math.round(huf / eurRate);

  const formatPrice = (n: number) => {
    if (currency === "EUR") return formatEUR(toEUR(n));
    return formatHUF(n);
  };

  const formatPriceSecondary = (n: number) => {
    if (currency === "EUR") return formatHUF(n);
    return formatEUR(toEUR(n));
  };

  const costs = costsByType[selectedType];
  const filteredCosts = showOptional ? costs : costs.filter((c) => c.required);

  const oneTimeTotal = filteredCosts.filter((c) => c.period === "egyszeri").reduce((s, c) => s + c.max, 0);
  const monthlyTotal = filteredCosts.filter((c) => c.period === "havi").reduce((s, c) => s + c.max, 0);
  const yearlyTotal = filteredCosts.filter((c) => c.period === "évi").reduce((s, c) => s + c.max, 0);
  const firstYearTotal = oneTimeTotal + monthlyTotal * 12 + yearlyTotal;
  const monthlyMin = filteredCosts.filter((c) => c.period === "havi").reduce((s, c) => s + c.min, 0);
  const monthlyMax = filteredCosts.filter((c) => c.period === "havi").reduce((s, c) => s + c.max, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
            <Calculator size={20} className="text-brand-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Mennyibe kerül? 💰
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          Számold ki, mennyibe kerül egy örökbefogadott állat tartása. Válaszd ki az állat típusát, és a kalkulátor megmutatja a várható költségeket.
        </p>
      </div>

      {/* Animal type selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2 animate-fade-in-up delay-100">
        {animalTypes.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSelectedType(t.value)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 btn-press ${
              selectedType === t.value
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 scale-105"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:scale-105"
            }`}
          >
            <span className="text-lg">{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls row: optional toggle + currency toggle */}
      <div className="flex flex-wrap items-center gap-4 mb-6 animate-fade-in-up delay-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOptional}
            onChange={(e) => setShowOptional(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
            Opcionális költségek mutatása
          </span>
        </label>

        {/* Currency toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <Globe size={14} className="text-gray-400" />
          <button
            type="button"
            onClick={() => setCurrency(currency === "HUF" ? "EUR" : "HUF")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold transition-all duration-300 hover:scale-105 btn-press"
          >
            <span className={`transition-all duration-200 ${currency === "HUF" ? "text-brand-500" : "text-gray-500"}`}>🇭🇺 Ft</span>
            <span className="text-gray-300 dark:text-gray-600 mx-0.5">/</span>
            <span className={`transition-all duration-200 ${currency === "EUR" ? "text-blue-500" : "text-gray-500"}`}>🇪🇺 €</span>
          </button>
          {rateLoading && (
            <RefreshCw size={12} className="text-gray-400 animate-spin" />
          )}
          <span className="text-[10px] text-gray-400 hidden sm:inline">
            1€ ≈ {eurRate} Ft
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up delay-200">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Egyszeri költség</div>
          <div className="text-2xl font-black text-brand-500">{formatPrice(oneTimeTotal)}</div>
          <div className="text-[11px] text-gray-400 mt-1">{formatPriceSecondary(oneTimeTotal)}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 card-shadow text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Havi költség</div>
          <div className="text-xl font-black text-sage-500">{formatPrice(monthlyMin)} – {formatPrice(monthlyMax)}</div>
          <div className="text-[11px] text-gray-400 mt-1">{formatPriceSecondary(monthlyMin)} – {formatPriceSecondary(monthlyMax)}</div>
        </div>
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-5 text-white text-center card-shadow">
          <div className="text-xs font-bold uppercase mb-1 opacity-80">Első év összesen</div>
          <div className="text-2xl font-black">{formatPrice(firstYearTotal)}</div>
          <div className="text-[11px] opacity-70 mt-1">{formatPriceSecondary(firstYearTotal)}</div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="space-y-3 mb-8">
        <h3 className="text-lg font-extrabold text-gray-800 dark:text-white animate-fade-in-up">
          Részletes költségvetés
        </h3>
        {filteredCosts.map((cost, i) => (
          <div
            key={cost.name}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 card-shadow border border-gray-50 dark:border-gray-700 animate-fade-in-up"
            style={{ animationDelay: `${i * 50 + 300}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{cost.emoji}</span>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white">{cost.name}</h4>
                  {cost.required ? (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-1.5 py-0.5 rounded shrink-0">Kötelező</span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded shrink-0">Opcionális</span>
                  )}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    cost.period === "egyszeri" ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" :
                    cost.period === "havi" ? "text-sage-500 bg-sage-50 dark:bg-sage-500/10" :
                    "text-purple-500 bg-purple-50 dark:bg-purple-500/10"
                  }`}>
                    {cost.period === "egyszeri" ? "1x" : cost.period === "havi" ? "/hó" : "/év"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cost.description}</p>
              </div>
              <div className="text-right ml-4 shrink-0">
                <div className="text-sm font-bold text-gray-800 dark:text-white">
                  {formatPrice(cost.min)} – {formatPrice(cost.max)}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {formatPriceSecondary(cost.min)} – {formatPriceSecondary(cost.max)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-sage-50 dark:bg-sage-500/5 rounded-2xl p-6 border border-sage-200 dark:border-sage-500/20 mb-8 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Info size={18} className="text-sage-500" />
          <h3 className="font-extrabold text-gray-800 dark:text-white">Tippek a költségek csökkentéséhez</h3>
        </div>
        <ul className="space-y-2">
          {[
            "Vásárolj nagy kiszerelésű eledelt — így olcsóbb kilónként",
            "Keresd a menhelyi akciókat és ingyenes oltási napokat",
            "Készíts saját játékokat (kötél, papírguriga, doboz)",
            "Több állat együttes örökbefogadása esetén kedvezmény lehet",
            "Használt felszerelést is vásárolhatsz (kalitka, ketrec)",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 size={16} className="text-sage-500 mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="text-center animate-fade-in-up">
        <Link
          href="/animals"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 btn-press hover:scale-[1.02]"
        >
          Böngéssz az állatok között <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
