"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
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
  Clock,
} from "lucide-react";
import { animals, shelters, daysWaiting, findSimilarAnimals } from "@/data/animals";
import { useParams } from "next/navigation";
import ShareButtons from "@/components/ShareButtons";
import AnimalCardWithModal from "@/components/AnimalCardWithModal";

export default function AnimalDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const router = useRouter();
  const animal = animals.find((a) => a.id === id);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (window.history.length > 1) {
          router.back();
        } else {
          window.close();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  if (!animal) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center dark:bg-gray-900 min-h-screen">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          Állat nem található
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Úgy tűnik, ez az állat eltűnt, mint egy szökevény cica.
        </p>
        <Link
          href="/animals"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
        >
          <ArrowLeft size={16} /> Vissza az állatokhoz
        </Link>
      </div>
    );
  }

  const [selectedImage, setSelectedImage] = useState(animal.image);
  const allImages = [animal.image, ...(animal.images || [])];

  const shelter = shelters.find((s) => s.id === animal.shelterId);
  const similarAnimals = findSimilarAnimals(animal, 3);
  const waitingDays = daysWaiting(animal.createdAt);

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
    animal.size === "kicsi"
      ? "Kicsi"
      : animal.size === "közepes"
      ? "Közepes"
      : "Nagy";

  return (
    <div className="max-w-2xl mx-auto dark:bg-gray-900 min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/animals"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-500 transition-colors"
          >
            <ArrowLeft size={16} /> Vissza
          </Link>
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            {animal.name}
          </span>
          <div className="w-16" />
        </div>
      </div>

      {/* Hero image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={selectedImage}
          alt={animal.name}
          className="w-full h-full object-cover transition-all duration-500"
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
        {/* Days waiting badge */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
          <Clock size={13} className="text-brand-500" />
          <span className="text-xs font-bold text-gray-800 dark:text-white">
            {waitingDays} napja vár
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-black text-white drop-shadow-lg">
            {animal.name}
          </h1>
          <p className="text-white/90 text-sm font-semibold drop-shadow">
            {speciesEmoji} {animal.breed || animal.species} · {animal.ageText} ·{" "}
            {animal.gender}
          </p>
        </div>
      </div>

      {/* Gallery thumbnails */}
      {allImages.length > 1 && (
        <div className="px-6 pt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 btn-press ${
                  selectedImage === img
                    ? "border-brand-500 ring-2 ring-brand-500/30 scale-105"
                    : "border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`${animal.name} ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Share buttons */}
        <div className="mb-5">
          <ShareButtons animal={animal} />
        </div>

        {/* Quick stats */}
        <div className="flex gap-2 mb-5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-bold">
            {sizeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
            🏠{" "}
            {animal.indoorOutdoor === "benti"
              ? "Benti"
              : animal.indoorOutdoor === "kinti"
              ? "Kinti"
              : "Benti és kinti"}
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

        {/* Pickup line */}
        {animal.pickupLine && (
          <div className="bg-brand-50 dark:bg-brand-500/10 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-brand-700 dark:text-brand-300 font-medium italic">
              &ldquo;{animal.pickupLine}&rdquo;
            </p>
          </div>
        )}

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
                  <span>
                    {shelter.location}, {shelter.county} megye
                  </span>
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
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-8 text-center">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              ⚠️ Ez egy DEMO állat — a valódi örökbefogadáshoz regisztrálj menhelyként!
            </p>
          </div>
        ) : (
          <a
            href={`mailto:${shelter?.email || ""}?subject=Érdeklődés: ${animal.name}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 btn-press hover:scale-[1.01] mb-8"
          >
            <Mail size={18} />
            Érdeklődöm {animal.name} iránt
          </a>
        )}
      </div>

      {/* Similar animals */}
      {similarAnimals.length > 0 && (
        <div className="px-6 pb-8">
          <div className="border-t border-gray-100 dark:border-gray-700/50 pt-8">
            <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-4">
              Hasonló állatok 🐾
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarAnimals.map((a, i) => (
                <div
                  key={a.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <AnimalCardWithModal animal={a} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
