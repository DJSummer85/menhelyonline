"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Search,
  Heart,
} from "lucide-react";
import { shelters, animals, sortSheltersByDistance, type Shelter } from "@/data/animals";

const ShelterMapInner = dynamic(
  () => import("@/components/ShelterMapInner"),
  { ssr: false }
);

export default function SheltersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const counties = [...new Set(shelters.map((s) => s.county))].sort();

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("A böngésződ nem támogatja a helymeghatározást.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError("Nem sikerült meghatározni a helyzeted. Engedélyezd a GPS-t.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const sortedShelters = userLocation
    ? sortSheltersByDistance(shelters, userLocation.lat, userLocation.lng)
    : shelters;

  const filtered = sortedShelters.filter((s) => {
    const matchSearch =
      searchTerm === "" ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCounty = selectedCounty === "" || s.county === selectedCounty;
    return matchSearch && matchCounty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Partner menhelyek 🏠
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          Ismerd meg a hozzánk csatlakozott menhelyeket, akik nap mint nap azon
          dolgoznak, hogy segítsenek a rászoruló állatokon. Mindegyik menhely
          hitelesített és rendszeresen ellenőrzött.
        </p>
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-sm">🚫</span>
          <p className="text-xs text-red-700 dark:text-red-300">
            <span className="font-bold">DEMO menhelyek</span> — a piros keretes menhelyek bemutatók, hamarosan valódi menhelyek érkeznek!
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-in-up">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-brand-500">{shelters.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Partner menhely
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-red-500">
            {shelters.reduce((acc, s) => acc + s.animalCount, 0)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Állat vár gazdára
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center card-shadow">
          <div className="text-2xl font-black text-sage-500">{counties.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
            Megye lefedve
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8 animate-fade-in-up delay-100">
        <ShelterMapInner shelters={shelters} />
      </div>

      {/* GPS button */}
      {!userLocation && (
        <div className="mb-6 animate-fade-in-up delay-100">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locationLoading}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-brand-300 hover:text-brand-600 transition-all duration-300 btn-press disabled:opacity-50"
          >
            {locationLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <span>📍</span>
            )}
            {locationLoading ? "Keresés..." : "Hozzám legközelebbi menhely"}
          </button>
          {locationError && (
            <p className="text-xs text-red-500 mt-2">{locationError}</p>
          )}
        </div>
      )}
      {userLocation && (
        <div className="mb-6 flex items-center gap-2 animate-fade-in">
          <span className="text-xs font-bold text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-500/10 px-3 py-1.5 rounded-full">
            📍 Helyszíned: {userLocation.lat.toFixed(2)}°, {userLocation.lng.toFixed(2)}° — rendezve távolság szerint
          </span>
          <button
            type="button"
            onClick={() => setUserLocation(null)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            ✕ Törlés
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in-up delay-200">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Keresés név vagy helyszín alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
          />
        </div>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all min-w-[180px]"
        >
          <option value="">Összes megye</option>
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Shelter cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((shelter, i) => (
          <ShelterCard key={shelter.id} shelter={shelter} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">
            Nincs találat a keresési feltételekre.
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 text-center animate-fade-in-up">
        <div className="bg-brand-50 dark:bg-brand-500/10 rounded-2xl p-8">
          <h3 className="text-xl font-extrabold text-gray-800 dark:text-white mb-2">
            Menhely vagy? Csatlakozz hozzánk!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Regisztrálj partnerként, és jelenjen meg a menhelyed az oldalunkon.
            Ingyenes, és segítünk az örökbefogadás népszerűsítésében.
          </p>
          <a
            href="/login?tab=register&role=shelter"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 btn-press hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-500/25"
          >
            Menhely regisztráció →
          </a>
        </div>
      </div>
    </div>
  );
}

function ShelterCard({ shelter, index }: { shelter: Shelter; index: number }) {
  const shelterAnimals = animals.filter((a) => a.shelterId === shelter.id);
  const dogCount = shelterAnimals.filter((a) => a.species === "kutya").length;
  const catCount = shelterAnimals.filter((a) => a.species === "macska").length;
  const otherCount = shelterAnimals.length - dogCount - catCount;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden group animate-fade-in-up ${shelter.demo ? "border-2 border-red-400 shadow-lg shadow-red-100 dark:shadow-red-900/20" : "card-shadow card-hover"}`}
      style={{ animationDelay: `${index * 100 + 200}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={shelter.image}
          alt={shelter.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          {shelter.demo && (
            <div className="bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              🚫 DEMO — Bemutató menhely
            </div>
          )}
        </div>
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-black text-white drop-shadow-lg">
            {shelter.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={13} className="text-white/80" />
            <span className="text-xs text-white/90 font-medium">
              {shelter.location}, {shelter.county} megye
            </span>
          </div>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg px-2.5 py-1 flex items-center gap-1.5">
          <Heart size={13} className="text-red-500" />
          <span className="text-xs font-bold text-gray-800 dark:text-white">
            {shelter.animalCount} állat
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`p-5 ${shelter.demo ? "bg-red-50 dark:bg-red-900/10" : ""}`}>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {shelter.description}
        </p>

        {/* Animal breakdown */}
        <div className="flex items-center gap-3 mb-4">
          {dogCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
              🐕 {dogCount} kutya
            </span>
          )}
          {catCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">
              🐱 {catCount} cica
            </span>
          )}
          {otherCount > 0 && (
            <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full">
              🐾 {otherCount} egyéb
            </span>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Phone size={13} className="text-gray-400 flex-shrink-0" />
            <span>{shelter.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Mail size={13} className="text-gray-400 flex-shrink-0" />
            <span>{shelter.email}</span>
          </div>
          {shelter.website && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Globe size={13} className="text-gray-400 flex-shrink-0" />
              <a
                href={shelter.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-500 transition-colors"
              >
                {shelter.website.replace("https://", "")}
              </a>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/50">
          <Link
            href={`/animals?shelter=${shelter.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-all duration-300 btn-press"
          >
            <Search size={14} />
            Állataik megtekintése
          </Link>
          {shelter.website && (
            <a
              href={shelter.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 btn-press"
            >
              <Globe size={14} />
              Weboldal
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
