"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { animals } from "@/data/animals";
import AnimalCard from "@/components/AnimalCard";

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; icon: string; value: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Mennyire vagy aktív?",
    options: [
      { label: "Nagyon aktív — sportolok, sétálok", icon: "🏃", value: "active" },
      { label: "Közepesen — néha sétálok", icon: "🚶", value: "moderate" },
      { label: "Inkább otthon ülök", icon: "🛋️", value: "homebody" },
    ],
  },
  {
    id: 2,
    question: "Hol laksz?",
    options: [
      { label: "Lakásban", icon: "🏢", value: "apartment" },
      { label: "Kertes házban", icon: "🏡", value: "house" },
    ],
  },
  {
    id: 3,
    question: "Van kisgyerek a családban?",
    options: [
      { label: "Igen, 6 év alatti", icon: "👶", value: "young_child" },
      { label: "Igen, 6+ éves", icon: "🧒", value: "older_child" },
      { label: "Nincs gyerek", icon: "👨‍👩‍👧", value: "no_child" },
    ],
  },
  {
    id: 4,
    question: "Mennyi időd van foglalkozni vele?",
    options: [
      { label: "Sok — több óra naponta", icon: "⏰", value: "lots" },
      { label: "Közepesen — 1-2 óra", icon: "🕐", value: "medium" },
      { label: "Kevesebb — fél óra", icon: "⏱️", value: "little" },
    ],
  },
  {
    id: 5,
    question: "Milyen méretű állatot szeretnél?",
    options: [
      { label: "Kicsi", icon: "🐕‍🦺", value: "kicsi" },
      { label: "Közepes", icon: "🐕", value: "közepes" },
      { label: "Nagy", icon: "🦮", value: "nagy" },
    ],
  },
  {
    id: 6,
    question: "Benti vagy kinti állatot szeretnél?",
    options: [
      { label: "Benti macska/kutya", icon: "🏠", value: "benti" },
      { label: "Kinti kutya", icon: "🌳", value: "kinti" },
      { label: "Mindegy", icon: "🤷", value: "mindkettő" },
    ],
  },
  {
    id: 7,
    question: "Szeretnéd, ha más állatokkal is kijönne?",
    options: [
      { label: "Igen, fontos", icon: "🐾", value: "yes" },
      { label: "Nem számít", icon: "🤷", value: "any" },
    ],
  },
  {
    id: 8,
    question: "Milyen fajtára gondolsz?",
    options: [
      { label: "Kutya", icon: "🐕", value: "kutya" },
      { label: "Macska", icon: "🐱", value: "macska" },
      { label: "Bármilyen", icon: "🐾", value: "any" },
    ],
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (isLast) {
      setTimeout(() => setShowResults(true), 400);
    } else {
      setTimeout(() => setCurrent((prev) => prev + 1), 350);
    }
  };

  const getMatches = () => {
    const preferredSpecies = answers["8"];
    const preferredSize = answers["5"];
    const prefIndoor = answers["6"];

    return animals
      .map((a) => {
        let score = 0;
        if (preferredSpecies && preferredSpecies !== "any" && a.species === preferredSpecies) score += 3;
        if (preferredSize && a.size === preferredSize) score += 2;
        if (prefIndoor && prefIndoor !== "any" && a.indoorOutdoor === prefIndoor) score += 2;
        if (answers["3"] && (answers["3"] === "young_child" || answers["3"] === "older_child") && a.childFriendly) score += 2;
        if (answers["7"] === "yes" && a.getsAlongWithOtherAnimals) score += 1;
        if (answers["2"] === "apartment" && a.size === "kicsi") score += 1;
        if (answers["1"] === "active" && a.species === "kutya") score += 1;
        if (answers["1"] === "homebody" && a.species === "macska") score += 1;
        return { animal: a, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  };

  const reset = () => {
    setCurrent(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const matches = getMatches();
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-500/10 rounded-full px-4 py-1.5 mb-4 animate-bounce-in">
            <Sparkles size={14} className="text-brand-500 animate-wiggle" />
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Eredmény</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white animate-fade-in-up">A te tökéletes társaid 🎉</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 animate-fade-in-up delay-100">
            Alapján a válaszaidra, ezek az állatok passzolnak hozzád a legjobban:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m, i) => (
            <div
              key={m.animal.id}
              className="relative animate-bounce-in"
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              {i === 0 && (
                <div className="absolute -top-2 -left-2 z-10 bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse-glow">
                  🏆 Legjobb match
                </div>
              )}
              <AnimalCard animal={m.animal} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8 animate-fade-in-up delay-600">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 btn-press hover:scale-105"
          >
            <RotateCcw size={16} className="transition-transform duration-300 hover:-rotate-180" />
            Újrakezdés
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Találd meg a párod 🧠</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Válaszolj {questions.length} egyszerű kérdésre, és megmutatjuk a hozzád passzoló állatokat.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8 animate-fade-in-down delay-100">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2">
          <span>Kérdés {current + 1} / {questions.length}</span>
          <span>{Math.round(((current) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-50 dark:border-gray-700 mb-6 animate-scale-in" key={current}>
        <h2 className="text-xl font-extrabold text-gray-800 dark:text-white mb-5 animate-fade-in-up">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(opt.value)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm font-semibold transition-all duration-300 btn-press animate-fade-in-up ${
                answers[q.id] === opt.value
                  ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-lg shadow-brand-500/10 scale-[1.02]"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-600 dark:text-gray-300 hover:border-brand-200 hover:bg-brand-50/50 dark:hover:bg-gray-700 hover:scale-[1.01]"
              }`}
              style={{ animationDelay: `${i * 100 + 200}ms` }}
            >
              <span className="text-xl transition-transform duration-200">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between animate-fade-in-up delay-400">
        <button
          type="button"
          onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
          disabled={current === 0}
          className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 btn-press"
        >
          <ArrowLeft size={16} />
          Vissza
        </button>
        {answers[q.id] && !isLast && (
          <button
            type="button"
            onClick={() => setCurrent((prev) => prev + 1)}
            className="flex items-center gap-1 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300 btn-press animate-fade-in-right hover:gap-2"
          >
            Következő
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
