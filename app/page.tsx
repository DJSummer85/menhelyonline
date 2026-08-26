"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  Shield,
  Users,
  ArrowRight,
  Home as HomeIcon,
  Star,
  Clock,
  Mail,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { animals, shelters, testimonials, getAnimalOfTheDay, daysWaiting } from "@/data/animals";
import AnimalCardWithModal from "@/components/AnimalCardWithModal";
import { getStats } from "@/lib/api";

export default function HomePage() {
  const [stats, setStats] = useState({ totalAnimals: 0, totalShelters: 0, totalAdopted: 0 });
  const featuredAnimals = animals.filter((a) => a.featured).slice(0, 4);
  const animalOfTheDay = getAnimalOfTheDay();
  const totalShelters = shelters.length;

  useEffect(() => {
    getStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="dark:bg-gray-900">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-orange-50 to-warm-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-200/30 dark:bg-brand-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-warm-200/30 dark:bg-warm-300/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur rounded-full px-4 py-1.5 mb-6 animate-fade-in-down">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {animals.length} demo állat vár otthonra
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight animate-fade-in-up">
              Találd meg{" "}
              <span className="text-brand-500 text-gradient">új kedvencedet</span>{" "}
              ma
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg animate-fade-in-up delay-200">
              Böngéssz a menhelyeken várakozó állatok között, és adj nekik
              egy szerető otthont. Minden örökbefogadás életet ment.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-400">
              <Link
                href="/animals"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 shadow-lg shadow-brand-500/25 btn-press hover:shadow-xl hover:shadow-brand-500/30 hover:scale-[1.02]"
              >
                <Search size={18} />
                Állatok böngészése
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 font-bold text-sm border border-brand-200 dark:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-gray-700 transition-all duration-300 btn-press hover:scale-[1.02]"
              >
                🧠 Találd meg a párod
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATISTICS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up delay-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center card-shadow">
            <div className="text-3xl font-black text-brand-500">{stats.totalAdopted}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              Örökbefogadás
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center card-shadow">
            <div className="text-3xl font-black text-red-500">{stats.totalAnimals || animals.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              Állat vár gazdára
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 text-center card-shadow">
            <div className="text-3xl font-black text-sage-500">{stats.totalShelters || totalShelters}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
              Partner menhely
            </div>
          </div>
        </div>
      </section>

      {/* ── ANIMAL OF THE DAY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-brand-50 to-orange-50 dark:from-brand-500/5 dark:to-orange-500/5 rounded-3xl p-6 md:p-8 card-shadow border border-brand-100 dark:border-brand-500/20 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg animate-wiggle">⭐</span>
            <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">
              A nap kedvence
            </h2>
            <span className="text-xs font-bold text-brand-500 bg-brand-100 dark:bg-brand-500/20 px-2 py-0.5 rounded-full">
              Mai nap
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <Link
              href={`/animals/${animalOfTheDay.id}`}
              className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0 group"
            >
              <img
                src={animalOfTheDay.image}
                alt={animalOfTheDay.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-lg font-black text-white drop-shadow-lg">{animalOfTheDay.name}</p>
                <p className="text-xs text-white/80">{animalOfTheDay.breed || animalOfTheDay.species}</p>
              </div>
            </Link>
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {animalOfTheDay.description}
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="text-brand-500" />
                  {daysWaiting(animalOfTheDay.createdAt)} napja vár gazdára
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  📍 {animalOfTheDay.location}
                </span>
              </div>
              {animalOfTheDay.pickupLine && (
                <p className="text-sm text-brand-600 dark:text-brand-400 italic mb-4">
                  &ldquo;{animalOfTheDay.pickupLine}&rdquo;
                </p>
              )}
              <Link
                href={`/animals/${animalOfTheDay.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 btn-press hover:scale-[1.02]"
              >
                Megnézem <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white animate-fade-in-up">
            Hogyan működik?
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto animate-fade-in-up delay-100">
            Három egyszerű lépés a szerető otthon megtalálásáig
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="w-7 h-7" />,
              title: "Böngéssz",
              desc: "Keress a faj, méret, kor és helyszín alapján. Szűrj a speciális igényekre: gyerekbarát, szállítás, benti/kinti.",
              color: "bg-brand-50 dark:bg-brand-500/10 text-brand-500",
            },
            {
              icon: <Heart className="w-7 h-7" />,
              title: "Kapcsolódj",
              desc: "Nézd meg az állat történetét, olvass a személyiségéről. Használd a 'Találd meg a párod' tesztet a tökéletes illesztéshez.",
              color: "bg-red-50 dark:bg-red-500/10 text-red-500",
            },
            {
              icon: <HomeIcon className="w-7 h-7" />,
              title: "Fogadj örökbe",
              desc: "Vedd fel a kapcsolatot a menhellyel, és vidd haza új kedvencedet. Mi segítünk a folyamat minden lépésében.",
              color: "bg-sage-50 dark:bg-sage-500/10 text-sage-500",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${i * 150 + 200}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}
              >
                {step.icon}
              </div>
              <div className="text-xs font-bold text-brand-400 mb-2">
                0{i + 1}
              </div>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ANIMALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Kiemelt kedvencek ⭐
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ezek az állatok most különös figyelmet érdemelnek
            </p>
          </div>
          <Link
            href="/animals"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300 hover:gap-3 animate-fade-in-right"
          >
            Összes <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredAnimals.map((animal, i) => (
            <div
              key={animal.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <AnimalCardWithModal animal={animal} />
            </div>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/animals"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 btn-press"
          >
            Összes állat megtekintése <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── WHY ADOPT ── */}
      <section className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white animate-fade-in-up">
              Miért fogadj örökbe?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Életet mentesz",
                desc: "Minden menhelyi állat egy új esélyt kap. Te vagy az, aki megadhatja neki.",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Támogatod a menhelyet",
                desc: "Azzal, hogy örökbe fogadsz, helyet szabadítasz fel egy másik rászoruló állatnak.",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Egészséges társat kapsz",
                desc: "Menhelyi állataink oltva, chippelve és ivartalanítva érkeznek hozzád.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center px-4 group animate-fade-in-up"
                style={{ animationDelay: `${i * 150 + 200}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-brand-500/20">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-gray-800 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10 animate-fade-in-up">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Sikertörténetek 💛
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Akik már örökbe fogadtak, azok mesélik el történetüket
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-50 dark:border-gray-700 animate-fade-in-up relative"
              style={{ animationDelay: `${i * 150 + 100}ms` }}
            >
              {t.demo && (
                <div className="bg-red-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-xl mb-4 flex items-center gap-2 shadow-lg">
                  🚫 DEMO — Bemutató szöveg, nem valós visszajelzés
                </div>
              )}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote size={20} className="text-brand-200 dark:text-brand-500/30 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {t.text}
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                <img
                  src={t.animalImage}
                  alt={t.animalName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{t.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    {t.animalName} örökbe fogadója · {t.shelterName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNER SHELTERS PREVIEW ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="animate-fade-in-left">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Partner menhelyek 🏠
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Ismerd meg a hozzánk csatlakozott menhelyeket
            </p>
          </div>
          <Link
            href="/shelters"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 hover:text-brand-600 transition-all duration-300 hover:gap-3 animate-fade-in-right"
          >
            Összes <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shelters.slice(0, 4).map((shelter, i) => (
            <Link
              key={shelter.id}
              href="/shelters"
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden card-shadow card-hover group animate-fade-in-up"
              style={{ animationDelay: `${i * 100 + 100}ms` }}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={shelter.image}
                  alt={shelter.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {shelter.demo && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                    DEMO
                  </div>
                )}
                <div className="absolute bottom-2 left-3">
                  <p className="text-sm font-bold text-white drop-shadow-lg">{shelter.name}</p>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-md px-2 py-0.5">
                  <span className="text-[11px] font-bold text-gray-800 dark:text-white">{shelter.animalCount} állat</span>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{shelter.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/shelters"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-500 btn-press"
          >
            Összes menhely megtekintése <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gradient-to-r from-sage-50 to-brand-50 dark:from-sage-500/5 dark:to-brand-500/5 rounded-3xl p-8 md:p-10 border border-sage-200 dark:border-sage-500/20 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={20} className="text-sage-500" />
                <h3 className="text-xl font-extrabold text-gray-800 dark:text-white">
                  Értesülj az újdonságokról!
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Iratkozz fel hírlevelünkre, és értesülj, ha új állat érkezik a menhelyekre. Heti 1 levelet küldünk, semmi spam!
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="E-mail címed..."
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-sage-500 text-white font-bold text-sm hover:bg-sage-600 transition-all duration-300 btn-press hover:scale-[1.02] whitespace-nowrap"
              >
                Feliratkozás
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-sage-400" /> Heti 1 levél</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-sage-400" /> Bármikor leiratkozhatsz</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-sage-400" /> Nincs spam</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden animate-fade-in-up card-shadow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 animate-float" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: "1s" }} />
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Készen állsz megtalálni új kedvencedet? 🐾
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-6">
              Böngéssz a menhelyek lakói között, vagy teszteld le, melyik állat
              passzol hozzád a legjobban!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/animals"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-600 font-bold text-sm hover:bg-gray-50 transition-all duration-300 btn-press hover:scale-[1.02] hover:shadow-lg"
              >
                <Search size={16} />
                Böngészés
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-bold text-sm hover:bg-white/30 transition-all duration-300 border border-white/30 btn-press hover:scale-[1.02]"
              >
                🧠 Párosító teszt
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
