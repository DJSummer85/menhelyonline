import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield size={20} className="text-brand-500" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Adatvédelmi nyilatkozat
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Utolsó frissítés: 2026. augusztus 26.
        </p>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-50 dark:border-gray-700 animate-fade-in-up delay-100">
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">1. Adatkezelő</h2>
            <p><strong>Név:</strong> MenhelyOnline</p>
            <p><strong>Elérhetőség:</strong> hamarosan</p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">2. Gyűjtött adatok</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Regisztráció: felhasználónév, e-mail cím, jelszó (titkosítva)</li>
              <li>Automatikusan: IP cím (anonimizált), böngésző adatok, látogatottság</li>
              <li>Menhelyek: kapcsolattartási adatok, API kulcsok (titkosítva)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">3. Adatkezelés célja és jogalapja</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fiók kezelése — szerződés teljesítése (GDPR 6. cikk (1) b)</li>
              <li>Statisztika — jogos érdek (GDPR 6. cikk (1) f)</li>
              <li>Jogi kötelezettség — GDPR 6. cikk (1) c</li>
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">4. Adatok tárolása</h2>
            <p>
              Adataidat biztonságos szervereken tároljuk. A jelszavakat bcrypt, az API kulcsokat
              AES-256-GCM titkosítással védjük. A fiók törléséig tároljuk az adataidat.
            </p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">5. Jogaid (GDPR)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Hozzáférés, helyesbítés, törlés, adathordozhatóság</li>
              <li>Tiltakozás és visszavonás joga</li>
              <li>Panaszt tehetsz a NAIH-nál (naih.hu)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">6. Cookie-k</h2>
            <p>
              Szükséges cookie-k a bejelentkezéshez, funkcionális cookie-k a beállításokhoz.
              A böngésződ beállításaiban tilthatod le őket.
            </p>
          </div>

          <div>
            <h2 className="font-extrabold text-gray-800 dark:text-white mb-1">7. Kapcsolat</h2>
            <p>
              Adatvédelmi kérdésekkel fordulj hozzánk: <strong>hamarosan</strong>
            </p>
          </div>

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
