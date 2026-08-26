import { CheckCircle2, Heart, Home, Dog, Cat, AlertTriangle, Phone, FileText, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function AdoptPage() {
  const steps = [
    {
      num: 1,
      icon: <Dog className="w-6 h-6" />,
      title: "Válaszd ki az állatot",
      desc: "Böngéssz a böngésző oldalunkon, használd a szűrőket, és találd meg azt az állatot, aki a legjobban passzol az életviteledhez. Használd a 'Találd meg a párod' tesztet is!",
    },
    {
      num: 2,
      icon: <Phone className="w-6 h-6" />,
      title: "Lépj kapcsolatba a menhellyel",
      desc: "Kattints az állat adatlapján a 'Kapcsolat' gombra, és vedd fel a kapcsolatot a menhellyel telefonon vagy e-mailben. Tudd meg, mikor látogathatsz el.",
    },
    {
      num: 3,
      icon: <Home className="w-6 h-6" />,
      title: "Személyes látogatás",
      desc: "Minden menhely kötelező személyes látogatást ír elő. Látogass el a menhelyre, ismerkedj meg az állattal személyesen, sétáljatok egyet együtt.",
    },
    {
      num: 4,
      icon: <FileText className="w-6 h-6" />,
      title: "Örökbefogadási szerződés",
      desc: "Ha megszületett a döntés, töltsd ki az örökbefogadási szerződést. A menhely ellenőrzi, hogy megfelelő körülményeket tudsz biztosítani.",
    },
    {
      num: 5,
      icon: <Heart className="w-6 h-6" />,
      title: "Hazaérkezés",
      desc: "Vidd haza új kedvencedet! Készítsd elő az otthonod: alom/kutyaágy, étel, itál, játékok. Adj neki időt a megszokáshoz — az első napok kritikusak.",
    },
    {
      num: 6,
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Követés és támogatás",
      desc: "A legtöbb menhely követi az örökbefogadás után is. Kérdezheted őket bármilyen problémáról. Mi is itt vagyunk, ha segítség kell!",
    },
  ];

  const responsibilities = [
    " megfelelő táplálék és friss víz biztosítása",
    " rendszeres állatorvosi ellátás és oltások",
    " megfelelő mozgás és szocializáció",
    " chip és póráz használata sétáltatáskor",
    " felelős tartási körülmények biztosítása",
    " ivartalanítás (ha még nem volt elvégezve)",
    " az állat megfelelő azonosítása (chippelés)",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
          Hogyan fogadj örökbe? 🐾
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg mx-auto">
          Az örökbefogadás folyamata egyszerű, de felelősségteljes. Íme minden, amit tudnod kell.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-16">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-5 bg-white dark:bg-gray-800 rounded-2xl p-6 card-shadow border border-gray-50 dark:border-gray-700">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center font-black text-lg">
              {step.num}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Responsible ownership */}
      <div className="bg-sage-50 dark:bg-sage-500/5 rounded-2xl p-8 border border-sage-200 dark:border-sage-500/20 mb-12">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          <h2 className="text-xl font-extrabold text-gray-800 dark:text-white">Felelős állattartás</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Az örökbefogadás nem csak egy kedves döntés — komoly felelősség. Mielőtt döntesz, gondold át:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {responsibilities.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-sage-500 flex-shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Gyakori kérdések</h2>
        <div className="space-y-4">
          {[
            {
              q: "Mennyibe kerül az örökbefogadás?",
              a: "A menhelyek általában szimbolikus összeget kérnek (5.000–20.000 Ft), ami az oltásokat, chippelést és ivartalanítást fedezi. Egyes menhelyek ingyenes örökbefogadást is kínálnak.",
            },
            {
              q: "Mi van, ha nem jön ki a kutyámmal a macska?",
              a: "Kérj segítséget a menhelytől! A legtöbb menhely biztosít időszakos bevezetést más állatok mellé. Ha végképp nem működik, a legtöbb menhely visszafogadja az állatot.",
            },
            {
              q: "Örökbefogadhatok online?",
              a: "Nem — a személyes látogatás kötelező. De a böngésző oldalunkon megtalálhatod a menhelyek elérhetőségeit, és telefonon egyeztethetsz időpontot.",
            },
            {
              q: "Mennyi időbe telik a folyamat?",
              a: "Általában 1-2 hét: a kapcsolatfelvétel, személyes látogatás, szerződés és hazavitel. Sürgős eseteknél gyorsabban is mehet.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 card-shadow border border-gray-50 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">{faq.q}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 text-white">
        <h2 className="text-xl font-extrabold mb-3">Készen állsz? 🐾</h2>
        <p className="text-white/80 text-sm mb-4">
          Találd meg a tökéletes társat, aki bearanyozza a mindennapjaidat.
        </p>
        <Link
          href="/animals"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-600 font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Böngéssz most →
        </Link>
      </div>
    </div>
  );
}
