"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Menhely<span className="text-brand-400">Online</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Magyarország legnagyobb örökbefogadási platformja. Kössük
              össze a rászoruló állatokat szerető gazdikkal.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Navigáció
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/animals", label: "Állatok böngészése" },
                { href: "/shelters", label: "Menhelyek" },
                { href: "/adopt", label: "Örökbefogadás" },
                { href: "/quiz", label: "Találd meg a párod" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-brand-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For shelters */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Menhelyeknek
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login?tab=register" className="text-sm hover:text-brand-400 transition-colors">
                  Regisztráció menhelyként
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm hover:text-brand-400 transition-colors">
                  Állatok feltöltése
                </Link>
              </li>
              <li>
                <span className="text-sm">Elérhetőség: hamarosan</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">
              Támogatás
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">HAMAROSAN</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/analytics" className="text-xs text-gray-600 hover:text-gray-400 transition-colors" title="Admin">
              ···
            </Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Adatvédelem
            </Link>
            <Link href="/impresszum" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Impresszum
            </Link>
            <p className="text-xs text-gray-500">
              © 2025 MenhelyOnline. Minden jog fenntartva.
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Heart size={12} className="text-brand-500" fill="currentColor" />
            <span>Készítve szeretettel minden állatért</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
