"use client";

import { useState, useRef } from "react";
import { Heart, X, Star, MapPin, Baby, Truck, ShieldCheck } from "lucide-react";
import { animals } from "@/data/animals";

export default function SwipePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const current = animals[currentIndex];
  const remaining = animals.length - currentIndex;

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && current) {
      setFavorites((prev) => [...prev, current.name]);
    }
    setExitDir(direction);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, animals.length));
      setDragX(0);
      setExitDir(null);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    (cardRef.current as HTMLElement)?.setAttribute("data-start-x", String(e.touches[0].clientX));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const startX = Number((cardRef.current as HTMLElement)?.getAttribute("data-start-x") || 0);
    setDragX(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragX > 100) handleSwipe("right");
    else if (dragX < -100) handleSwipe("left");
    else setDragX(0);
  };

  if (currentIndex >= animals.length) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center dark:bg-gray-900 min-h-screen">
        <div className="text-6xl mb-4 animate-bounce-in">🎉</div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-3 animate-fade-in-up">Végeztél!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 animate-fade-in-up delay-100">
          {favorites.length > 0
            ? `${favorites.length} állatot mentettél kedvencekbe: ${favorites.join(", ")}`
            : "Nem találtál kedvencet, de ne add fel! Nézz vissza később."}
        </p>
        <button
          type="button"
          onClick={() => { setCurrentIndex(0); setFavorites([]); }}
          className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 btn-press hover:scale-105 animate-fade-in-up delay-200"
        >
          Újrakezdés
        </button>
      </div>
    );
  }

  const rotate = Math.min(Math.max(dragX / 15, -15), 15);
  const opacity = Math.max(1 - Math.abs(dragX) / 300, 0.5);
  const exitRotate = exitDir === "right" ? 30 : exitDir === "left" ? -30 : 0;
  const exitX = exitDir === "right" ? 400 : exitDir === "left" ? -400 : 0;

  return (
    <div className="max-w-lg mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-6 animate-fade-in-down">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Gyorskereső ⚡</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Húzd jobbra a kedvencekhez, balra a következőhöz
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {remaining} állat hátra · {favorites.length} kedvenc
        </p>
      </div>

      {/* Card */}
      <div className="relative mx-auto" style={{ maxWidth: 380 }}>
        {/* Swipe indicators */}
        <div
          className={`absolute top-4 left-4 z-20 bg-green-500 text-white text-lg font-black px-4 py-2 rounded-xl border-2 border-green-400 transition-all duration-200 ${
            dragX > 50 || exitDir === "right"
              ? "opacity-100 rotate-[-12deg] scale-100"
              : "opacity-0 rotate-0 scale-75"
          }`}
        >
          ❤️ Tetszik!
        </div>
        <div
          className={`absolute top-4 right-4 z-20 bg-red-500 text-white text-lg font-black px-4 py-2 rounded-xl border-2 border-red-400 transition-all duration-200 ${
            dragX < -50 || exitDir === "left"
              ? "opacity-100 rotate-[12deg] scale-100"
              : "opacity-0 rotate-0 scale-75"
          }`}
        >
          👋 Passz
        </div>

        <div
          ref={cardRef}
          className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden card-shadow touch-none select-none"
          style={{
            transform: `translateX(${exitDir ? exitX : dragX}px) rotate(${exitDir ? exitRotate : rotate}deg)`,
            opacity: exitDir ? 0 : opacity,
            transition: isDragging ? "none" : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative aspect-[3/4]">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white animate-fade-in-up" key={current.id}>
              <h2 className="text-2xl font-black">
                {current.name}{" "}
                <span className="text-lg font-bold opacity-80">
                  {current.ageText}
                </span>
              </h2>
              <p className="text-sm text-white/80 mt-1">
                {current.breed || current.species} · {current.gender}
              </p>
              <div className="flex items-center gap-1 mt-1 text-sm text-white/70">
                <MapPin size={14} />
                {current.location}
              </div>
              <div className="flex gap-2 mt-3 flex-wrap">
                {current.childFriendly && (
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <Baby size={10} /> Gyerekbarát
                  </span>
                )}
                {current.transportHelp && (
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <Truck size={10} /> Szállítás
                  </span>
                )}
                {current.vaccinated && (
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full animate-fade-in" style={{ animationDelay: "300ms" }}>
                    <ShieldCheck size={10} /> Oltott
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-6 animate-fade-in-up delay-200">
        <button
          type="button"
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-red-200 dark:border-red-800 text-red-400 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 hover:text-red-500 transition-all duration-300 shadow-lg btn-press hover:scale-110 hover:shadow-xl hover:shadow-red-500/20"
        >
          <X size={28} className="transition-transform duration-200" />
        </button>
        <button
          type="button"
          onClick={() => handleSwipe("right")}
          className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-400 flex items-center justify-center hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 hover:text-yellow-500 transition-all duration-300 btn-press hover:scale-110"
        >
          <Star size={20} className="transition-transform duration-300 hover:rotate-72" />
        </button>
        <button
          type="button"
          onClick={() => handleSwipe("right")}
          className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 text-green-400 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 hover:text-green-500 transition-all duration-300 shadow-lg btn-press hover:scale-110 hover:shadow-xl hover:shadow-green-500/20"
        >
          <Heart size={28} className="transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
