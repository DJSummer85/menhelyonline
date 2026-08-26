"use client";

import { useState, useEffect } from "react";
import { MapPin, Heart, Truck, Baby, ShieldCheck, Clock } from "lucide-react";
import { type Animal, daysWaiting } from "@/data/animals";

interface AnimalCardProps {
  animal: Animal;
  onClick?: () => void;
}

export default function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync with localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favs.includes(animal.id));
    } catch {
      // localStorage not available
    }
  }, [animal.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFav = !isFavorite;
    setIsFavorite(newFav);

    try {
      const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (newFav) {
        if (!favs.includes(animal.id)) favs.push(animal.id);
      } else {
        const idx = favs.indexOf(animal.id);
        if (idx > -1) favs.splice(idx, 1);
      }
      localStorage.setItem("favorites", JSON.stringify(favs));
    } catch {
      // localStorage not available
    }
  };

  const speciesEmoji =
    animal.species === "kutya"
      ? "🐕"
      : animal.species === "macska"
      ? "🐱"
      : animal.species === "ragcsalo"
      ? "🐹"
      : animal.species === "madar"
      ? "🦜"
      : "🦎";

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer group relative ${animal.demo ? "border-2 border-red-400 shadow-lg shadow-red-100 dark:shadow-red-900/20" : "card-shadow card-hover"}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
          {animal.demo && (
            <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              🚫 DEMO — Nem örökbefogadható
            </div>
          )}
          {animal.urgent && !animal.demo && (
            <div className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full animate-pulse-glow">
              🔴 Sürgős!
            </div>
          )}
          {animal.sick && !animal.demo && (
            <div className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              🏥 Segítségre szorul
            </div>
          )}
        </div>

        {/* Pickup line on hover */}
        {animal.pickupLine && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-sm font-bold text-center drop-shadow-lg leading-relaxed animate-fade-in">
              {animal.pickupLine}
            </p>
          </div>
        )}

        {/* Fav button */}
        <button
          type="button"
          aria-label={isFavorite ? "Eltávolítás a kedvencek közül" : "Hozzáadás a kedvencekhez"}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-125 active:scale-95 hover:shadow-lg"
          onClick={toggleFavorite}
        >
          <Heart
            size={16}
            className={`transition-all duration-300 ${
              isFavorite
                ? "text-red-500 fill-red-500 scale-110"
                : "text-gray-400 hover:text-red-500"
            }`}
          />
        </button>

        {/* Bottom badges */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {animal.childFriendly && (
            <span className="flex items-center gap-1 bg-sage-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100" style={{ transitionDelay: "0ms" }}>
              <Baby size={10} /> Gyerekbarát
            </span>
          )}
          {animal.transportHelp && (
            <span className="flex items-center gap-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100" style={{ transitionDelay: "50ms" }}>
              <Truck size={10} /> Szállítás
            </span>
          )}
          {animal.vaccinated && (
            <span className="flex items-center gap-1 bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 group-hover:translate-y-0 translate-y-1 opacity-0 group-hover:opacity-100" style={{ transitionDelay: "100ms" }}>
              <ShieldCheck size={10} /> Oltott
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className={`p-4 ${animal.demo ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-800 dark:text-white transition-colors duration-200 group-hover:text-brand-500">
              {animal.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {speciesEmoji} {animal.ageText}
              {animal.breed ? ` · ${animal.breed}` : ""}
              {` · ${animal.gender}`}
            </p>
          </div>
          <span className="text-xs font-bold text-brand-500 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg whitespace-nowrap transition-all duration-300 group-hover:bg-brand-500 group-hover:text-white">
            {animal.size === "kicsi"
              ? "Kicsi"
              : animal.size === "közepes"
              ? "Közepes"
              : "Nagy"}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <MapPin size={12} className="transition-transform duration-300 group-hover:scale-110" />
            <span>
              {animal.location}, {animal.shelter}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
            <Clock size={10} />
            <span>{daysWaiting(animal.createdAt)} nap</span>
          </div>
        </div>
      </div>
    </div>
  );
}
