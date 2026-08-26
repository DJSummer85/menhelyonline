"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, Search } from "lucide-react";
import { animals, type Animal } from "@/data/animals";
import AnimalCardWithModal from "@/components/AnimalCardWithModal";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Animal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const favIds: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      const favAnimals = animals.filter((a) => favIds.includes(a.id));
      setFavorites(favAnimals);
    } catch {
      // localStorage not available
    }
    setLoaded(true);
  }, []);

  const removeFavorite = (animalId: string) => {
    const newFavorites = favorites.filter((a) => a.id !== animalId);
    setFavorites(newFavorites);

    try {
      const favIds: string[] = JSON.parse(localStorage.getItem("favorites") || "[]");
      const updated = favIds.filter((id) => id !== animalId);
      localStorage.setItem("favorites", JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
  };

  const clearAll = () => {
    setFavorites([]);
    try {
      localStorage.setItem("favorites", JSON.stringify([]));
    } catch {
      // localStorage not available
    }
  };

  if (!loaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Heart size={32} className="text-red-500 fill-red-500" />
            Kedvenceim
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {favorites.length > 0
              ? `${favorites.length} állatot jelöltél meg kedvencnek`
              : "Még nincsenek kedvenceid"}
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300 btn-press"
          >
            <Trash2 size={16} />
            Összes törlése
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        /* Empty state */
        <div className="text-center py-20 animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce-in">
            <Heart size={40} className="text-red-300 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
            Még nem jelöltél meg kedvencet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
            Kattints a szív ikonra bármelyik állat kártyáján, és itt megjelennek
            a kedvenceid. Így könnyen visszatalálhatsz hozzájuk!
          </p>
          <Link
            href="/animals"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 btn-press hover:scale-[1.02]"
          >
            <Search size={18} />
            Állatok böngészése
          </Link>
        </div>
      ) : (
        /* Favorites grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((animal, i) => (
            <div
              key={animal.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative group">
                <AnimalCardWithModal animal={animal} />
                <button
                  type="button"
                  onClick={() => removeFavorite(animal.id)}
                  className="absolute top-12 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/20 transition-all duration-300 hover:scale-125 active:scale-95 shadow-md opacity-0 group-hover:opacity-100"
                  aria-label="Eltávolítás a kedvencek közül"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestion */}
      {favorites.length > 0 && favorites.length < animals.length && (
        <div className="mt-12 text-center animate-fade-in-up">
          <Link
            href="/animals"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300 hover:gap-3"
          >
            További állatok böngészése →
          </Link>
        </div>
      )}
    </div>
  );
}
