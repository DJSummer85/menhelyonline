import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function ImpresszumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-brand-500 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Vissza a kezdőlapra
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
            <Scale size={20} className="text-brand-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Impresszum
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-50 dark:border-gray-700 animate-fade-in-up delay-100">
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">1. Szolgáltató</h2>
            <p><strong>Név:</strong> MenhelyOnline</p>
            <p><strong>Székhely:</strong> Budapest, Magyarország</p>
            <p><strong>Elérhetőség:</strong> hamarosan</p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">2. Nyilvántartás</h2>
            <p><strong>Nyilvántartási szám:</strong> hamarosan</p>
            <p><strong>Adószám:</strong> hamarosan</p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">3. Tárhelyszolgáltató</h2>
            <p>[Tárhelyszolgáltató neve és adatai]</p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">4. Felelősség</h2>
            <p>
              Az oldalon megjelenő információk tájékoztató jellegűek. A MenhelyOnline közvetítő szerepet
              tölt be a menhelyek és a leendő gazdik között. Az örökbefogadással kapcsolatos döntések
              a felhasználó felelőssége.
            </p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">5. Szerzői jog</h2>
            <p>
              Az oldal tartalmának szerzői jogai a MenhelyOnline-t illetik. A nyilvánosan elérhető
              képek az Unsplash-ről származnak (CC0 licenc).
            </p>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 pt-2">
            Utolsó frissítés: 2026. augusztus 26.
          </p>
        </div>
      </div>

      {/* Back to home */}
      <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700/50 text-center animate-fade-in-up">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-all duration-300 btn-press"
        >
          Vissza a kezdőlapra
        </Link>
      </div>
    </div>
  );
}
