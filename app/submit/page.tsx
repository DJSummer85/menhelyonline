"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  PawPrint,
  MapPin,
  Upload,
  CheckCircle,
} from "lucide-react";
import { getUser } from "@/lib/api";

const API_BASE = "";

const SPECIES = [
  { value: "kutya", label: "🐕 Kutya" },
  { value: "macska", label: "🐱 Macska" },
  { value: "ragcsalo", label: "🐹 Rágcsáló" },
  { value: "madar", label: "🦜 Madár" },
  { value: "hüllő", label: "🦎 Hüllő" },
  { value: "egyéb", label: "🐾 Egyéb" },
];

const SIZES = ["kicsi", "közepes", "nagy"];
const GENDERS = ["hím", "nőstény"];
const COUNTIES = [
  "Bács-Kiskun", "Baranya", "Békés", "Borsod-Abaúj-Zemplén", "Csongrád-Csanád",
  "Fejér", "Győr-Moson-Sopron", "Hajdú-Bihar", "Heves", "Jász-Nagykun-Szolnok",
  "Komárom-Esztergom", "Nógrád", "Pest", "Somogy", "Szabolcs-Szatmár-Bereg",
  "Tolna", "Vas", "Veszprém", "Zala", "Budapest",
];

export default function SubmitPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("kutya");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [ageText, setAgeText] = useState("");
  const [gender, setGender] = useState("hím");
  const [size, setSize] = useState("közepes");
  const [county, setCounty] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [childFriendly, setChildFriendly] = useState(false);
  const [transportHelp, setTransportHelp] = useState(false);
  const [indoorOutdoor, setIndoorOutdoor] = useState("mindkettő");
  const [getsAlong, setGetsAlong] = useState(true);
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [pickupLine, setPickupLine] = useState("");

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setLoading(false);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/animals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: user.id,
          name,
          species,
          breed: breed || null,
          age: age || null,
          age_text: ageText || null,
          gender,
          size,
          location: location || null,
          county: county || null,
          image: image || null,
          description: description || null,
          child_friendly: childFriendly,
          transport_help: transportHelp,
          indoor_outdoor: indoorOutdoor,
          gets_along_with_others: getsAlong,
          vaccinated,
          neutered,
          pickup_line: pickupLine || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Hiba történt");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Hiba történt");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="animate-spin text-4xl">⏳</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-2">
            Állat sikeresen felvéve!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Köszönjük, hogy segítesz egy állatnak gazdát találni!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/animals"
              className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all btn-press"
            >
              Állatok megtekintése
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setBreed("");
                setDescription("");
                setImage("");
                setPickupLine("");
              }}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              + Újabb állat felvétele
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-12 dark:bg-gray-900">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-800 dark:text-white">
              Menhely<span className="text-brand-500">Online</span>
            </span>
          </Link>
          <h1 className="text-xl font-extrabold text-gray-800 dark:text-white">
            🐾 Állat felvétele
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Töltsd ki az adatokat és segíts egy állatnak gazdát találni
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-100 dark:border-gray-700 space-y-5"
        >
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40 rounded-xl px-4 py-2.5">
              <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Állat neve *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pl. Bodri"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Faj *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSpecies(s.value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all btn-press ${
                    species === s.value
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breed */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Fajta
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Pl. labrador keverék"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
            />
          </div>

          {/* Age + Gender row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                Kor (szám)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Pl. 2"
                min="0"
                max="30"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                Kor (szöveg)
              </label>
              <input
                type="text"
                value={ageText}
                onChange={(e) => setAgeText(e.target.value)}
                placeholder="Pl. 2 éves"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Ivarnem
            </label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all btn-press ${
                    gender === g
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {g === "hím" ? "♂ Hím" : "♀ Nőstény"}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Méret
            </label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all btn-press ${
                    size === s
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {s === "kicsi" ? "🐱 Kicsi" : s === "közepes" ? "🐕 Közepes" : "🦮 Nagy"}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              <MapPin size={12} className="inline mr-1" />
              Megye
            </label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
            >
              <option value="">Válassz megyét...</option>
              {COUNTIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              <MapPin size={12} className="inline mr-1" />
              Település / Cím
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Pl. Budapest, XIII. kerület"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              <Upload size={12} className="inline mr-1" />
              Kép URL (opcionális)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/kep.jpg"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Leírás
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mesélj az állatról: személyiség, szokások, különlegességek..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all resize-none"
            />
          </div>

          {/* Traits */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">
              Tulajdonságok
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Gyerekbarát", value: childFriendly, set: setChildFriendly },
                { label: "Szállítás segítve", value: transportHelp, set: setTransportHelp },
                { label: "Oltott", value: vaccinated, set: setVaccinated },
                { label: "Ivartalanítva", value: neutered, set: setNeutered },
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => t.set(!t.value)}
                  className={`flex items-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all btn-press ${
                    t.value
                      ? "border-sage-400 bg-sage-50 dark:bg-sage-500/10 text-sage-600 dark:text-sage-400"
                      : "border-gray-200 dark:border-gray-700 text-gray-400"
                  }`}
                >
                  {t.value ? (
                    <CheckCircle size={14} className="text-sage-500" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Indoor/Outdoor */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Lakás / Kert
            </label>
            <div className="flex gap-2">
              {["benti", "kinti", "mindkettő"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setIndoorOutdoor(v)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all btn-press ${
                    indoorOutdoor === v
                      ? "border-brand-400 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 shadow-md"
                      : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {v === "benti" ? "🏠 Benti" : v === "kinti" ? "🌳 Kinti" : "🏡 Mindkettő"}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup line */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
              Szívhez szóló sor (opcionális)
            </label>
            <input
              type="text"
              value={pickupLine}
              onChange={(e) => setPickupLine(e.target.value)}
              placeholder="Pl. Veled sétálnék minden nap a parkban!"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 transition-all italic"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/20 btn-press hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="animate-spin">⏳</span> Küldés...
              </span>
            ) : (
              "🐾 Állat felvétele"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
