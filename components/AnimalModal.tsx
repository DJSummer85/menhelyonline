"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Heart,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  Truck,
  Baby,
  PawPrint,
  Stethoscope,
  Scissors,
} from "lucide-react";
import { type Animal, shelters } from "@/data/animals";

interface AnimalModalProps {
  animal: Animal | null;
  onClose: () => void;
}

export default function AnimalModal({ animal, onClose }: AnimalModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const shelter = shelters.find((s) => s.id === animal?.shelterId);

  useEffect(() => {
    if (!animal) return;
    try {
      const favs: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      setIsFavorite(favs.includes(animal.id));
    } catch {
      // ignore
    }
  }, [animal?.id]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!animal) return null;

  const toggleFavorite = () => {
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
      // ignore
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

  const sizeLabel =
    animal.size === "kicsi" ? "Kicsi" : animal.size === "közepes" ? "Közepes" : "Nagy";

  return (
    <>
      {/* Fixed backdrop — covers everything, blocks all clicks */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal — sits on top of backdrop, scrollable */}
      <div
        className="fixed z-[9999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="sticky top-4 float-right mr-4 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Bezárás"
        >
          <X size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {/* Hero image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {animal.demo && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
              🚫 DEMO — Nem fogadható örökbe!
            </div>
          )}
          {animal.urgent && !animal.demo && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full animate-pulse-glow shadow-lg">
              🔴 Sürgős!
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black text-white drop-shadow-lg">
                  {animal.name}
                </h2>
                <p className="text-white/90 text-sm font-semibold drop-shadow">
                  {speciesEmoji} {animal.breed || animal.species} · {animal.ageText} · {animal.gender}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleFavorite}
                className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-125 active:scale-95 shadow-lg flex-shrink-0"
              >
                <Heart
                  size={22}
                  className={`transition-all duration-300 ${
                    isFavorite
                      ? "text-red-500 fill-red-500 scale-110"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick stats */}
          <div className="flex gap-2 mb-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
              {sizeLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
              🏠 {animal.indoorOutdoor === "benti" ? "Benti" : animal.indoorOutdoor === "kinti" ? "Kinti" : "Benti és kinti"}
            </span>
            {animal.vaccinated && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400 text-xs font-bold">
                <ShieldCheck size={12} /> Oltott
              </span>
            )}
            {animal.neutered && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                <Scissors size={12} /> Ivartalanítva
              </span>
            )}
            {animal.sick && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold">
                🏥 Segítségre szorul
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
            {animal.description}
          </p>

          {/* Sick info */}
          {animal.sick && animal.sickDescription && (
            <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏥</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-orange-700 dark:text-orange-300 text-sm mb-1">
                    Egészségi állapot
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400 leading-relaxed">
                    {animal.sickDescription}
                  </p>
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-2 italic">
                    Ez az állat szerető gazdijelöltre vár, aki segít neki az egészségének karbantartásában.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Traits grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: <Baby size={16} />, label: "Gyerekbarát", value: animal.childFriendly },
              { icon: <Truck size={16} />, label: "Szállítás segítve", value: animal.transportHelp },
              { icon: <PawPrint size={16} />, label: "Más állatokkal", value: animal.getsAlongWithOtherAnimals },
              { icon: <Stethoscope size={16} />, label: "Oltva", value: animal.vaccinated },
            ].map((trait) => (
              <div
                key={trait.label}
                className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                  trait.value
                    ? "bg-sage-50 dark:bg-sage-500/10 text-sage-700 dark:text-sage-300"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                }`}
              >
                <span className={trait.value ? "text-sage-500" : "text-gray-300 dark:text-gray-600"}>
                  {trait.icon}
                </span>
                {trait.label}
                <span className="ml-auto">{trait.value ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>

          {/* Shelter info */}
          {shelter && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <img
                  src={shelter.image}
                  alt={shelter.name}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-extrabold text-gray-800 dark:text-white text-sm">
                    {shelter.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <MapPin size={12} />
                    <span>{shelter.location}, {shelter.county} megye</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-gray-400" />
                  <span>{shelter.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-gray-400" />
                  <span>{shelter.email}</span>
                </div>
                {shelter.website && (
                  <a
                    href={shelter.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-brand-500 hover:text-brand-600 transition-colors"
                  >
                    <ExternalLink size={12} />
                    <span>Weboldal megnyitása</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA */}
          {animal.demo ? (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 text-center">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                ⚠️ Ez egy DEMO állat — a valódi örökbefogadáshoz regisztrálj menhelyként!
              </p>
            </div>
          ) : (
            <a
              href={`mailto:${shelter?.email || ""}?subject=Érdeklődés: ${animal.name}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 btn-press hover:scale-[1.01] mb-4"
            >
              <Mail size={18} />
              Érdeklődöm {animal.name} iránt
            </a>
          )}
        </div>
      </div>
    </>
  );
}
