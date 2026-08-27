"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { animals, SPECIES_FILTERS, COUNTIES, type AnimalSpecies } from "@/data/animals";
import AnimalCardWithModal from "@/components/AnimalCardWithModal";

export default function AnimalsPage() {
  const [dbAnimals, setDbAnimals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/animals")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setDbAnimals(data || []))
      .catch(() => {});
  }, []);

  // Merge static + database animals
  const allAnimals = [
    ...animals,
    ...dbAnimals.map((a: any) => ({
      id: String(a.id),
      name: a.name,
      species: a.species,
      breed: a.breed,
      ageText: a.age_text || a.age || "",
      age: a.age || "",
      gender: a.gender || "",
      size: a.size || "közepes",
      location: a.location || a.county || "",
      county: a.county || "",
      image: a.image || "/placeholder-pet.svg",
      description: a.description || "",
      childFriendly: !!a.child_friendly,
      transportHelp: !!a.transport_help,
      indoorOutdoor: a.indoor_outdoor || "mindkettő",
      getsAlongWithOtherAnimals: !!a.gets_along_with_others,
      vaccinated: !!a.vaccinated,
      neutered: !!a.neutered,
      pickupLine: a.pickup_line,
      shelterId: a.shelter_id ? String(a.shelter_id) : null,
      ownerId: a.owner_id,
      demo: false,
    })),
  ];

  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState<AnimalSpecies | "">("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [county, setCounty] = useState("");
  const [transport, setTransport] = useState(false);
  const [childFriendly, setChildFriendly] = useState(false);
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sickOnly, setSickOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return allAnimals.filter((a) => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !(a.breed && a.breed.toLowerCase().includes(search.toLowerCase()))) return false;
      if (species && a.species !== species) return false;
      if (age && a.age !== age) return false;
      if (size && a.size !== size) return false;
      if (gender && a.gender !== gender) return false;
      if (county && a.location !== county) return false;
      if (transport && !a.transportHelp) return false;
      if (childFriendly && !a.childFriendly) return false;
      if (indoorOutdoor && a.indoorOutdoor !== indoorOutdoor) return false;
      if (urgentOnly && !a.urgent) return false;
      if (sickOnly && !a.sick) return false;
      return true;
    });
  }, [search, species, age, size, gender, county, transport, childFriendly, indoorOutdoor, urgentOnly, sickOnly]);

  const activeFilterCount = [species, age, size, gender, county, transport, childFriendly, indoorOutdoor, urgentOnly, sickOnly].filter(Boolean).length;

  const clearFilters = () => {
    setSpecies(""); setAge(""); setSize(""); setGender("");
    setCounty(""); setTransport(false); setChildFriendly(false);
    setIndoorOutdoor(""); setUrgentOnly(false); setSickOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Állatok böngészése 🐾</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filtered.length} állat található a szűrők alapján
        </p>
        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-sm">🚫</span>
          <p className="text-xs text-red-700 dark:text-red-300">
            <span className="font-bold">DEMO adatok</span> — a piros keretes állatok bemutatók, nem fogadhatók örökbe.
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4 animate-fade-in-up delay-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 peer-focus:scale-110" size={18} />
          <input
            type="text"
            placeholder="Keresés név vagy fajta szerint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent focus:shadow-lg focus:shadow-brand-500/10 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 btn-press ${
            showFilters || activeFilterCount > 0
              ? "border-brand-300 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-lg shadow-brand-500/10"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <SlidersHorizontal size={16} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
          Szűrők
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center font-bold animate-bounce-in">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Species chips */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 animate-fade-in-up delay-200">
        {SPECIES_FILTERS.map((s, i) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSpecies(species === s.value ? "" : s.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 btn-press ${
              species === s.value
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20 scale-105"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:scale-105"
            }`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span className="transition-transform duration-200">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0"}`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-white">Részletes szűrők</h3>
            {activeFilterCount > 0 && (
              <button type="button" onClick={clearFilters} className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors duration-200 btn-press">
                Szűrők törlése
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Age */}
            <div className="animate-fade-in-up" style={{ animationDelay: "50ms" }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Kor</label>
              <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-brand-300 focus:outline-none">
                <option value="">Mind</option>
                <option value="kölyök">Kölyök</option>
                <option value="felnőtt">Felnőtt</option>
                <option value="idős">Idős</option>
              </select>
            </div>
            {/* Size */}
            <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Méret</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-brand-300 focus:outline-none">
                <option value="">Mind</option>
                <option value="kicsi">Kicsi</option>
                <option value="közepes">Közepes</option>
                <option value="nagy">Nagy</option>
              </select>
            </div>
            {/* Gender */}
            <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Nem</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-brand-300 focus:outline-none">
                <option value="">Mind</option>
                <option value="hím">Hím / Kan</option>
                <option value="nőstény">Nőstény / Szuka</option>
              </select>
            </div>
            {/* County */}
            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Megye</label>
              <select value={county} onChange={(e) => setCounty(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-brand-300 focus:outline-none">
                <option value="">Mind</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Indoor/Outdoor */}
            <div className="animate-fade-in-up" style={{ animationDelay: "250ms" }}>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">Benti / Kinti</label>
              <select value={indoorOutdoor} onChange={(e) => setIndoorOutdoor(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:ring-2 focus:ring-brand-300 focus:outline-none">
                <option value="">Mind</option>
                <option value="benti">Benti</option>
                <option value="kinti">Kinti</option>
                <option value="mindkettő">Mindkettő</option>
              </select>
            </div>
            {/* Checkboxes */}
            <div className="flex flex-col gap-2 pt-5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer group">
                <input type="checkbox" checked={transport} onChange={(e) => setTransport(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500 transition-all duration-200" />
                🚗 Szállítás segítve
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer group">
                <input type="checkbox" checked={childFriendly} onChange={(e) => setChildFriendly(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-brand-500 focus:ring-brand-500 transition-all duration-200" />
                👶 Gyerekbarát
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer group">
                <input type="checkbox" checked={urgentOnly} onChange={(e) => setUrgentOnly(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-red-500 focus:ring-red-500 transition-all duration-200" />
                🚨 Sürgős esetek
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer group">
                <input type="checkbox" checked={sickOnly} onChange={(e) => setSickOnly(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 transition-all duration-200" />
                🏥 Beteg állatok
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((animal, i) => (
            <div
              key={animal.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${(i % 8) * 80}ms` }}
            >
              <AnimalCardWithModal animal={animal} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 animate-fade-in">
          <div className="text-5xl mb-4 animate-bounce-in">🐾</div>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Nincs találat</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Próbálj meg más szűrőket, vagy{" "}
            <button type="button" onClick={clearFilters} className="text-brand-500 font-bold hover:underline transition-colors duration-200">
              töröld az összeset
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
