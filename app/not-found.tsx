import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">🐾</div>
      <h1 className="text-3xl font-black text-gray-900 mb-3">404 — Oldal nem található</h1>
      <p className="text-gray-500 mb-6">
        Úgy tűnik, ez az oldal eltűnt, mint egy szökevény cica.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
      >
        Vissza a kezdőlapra
      </Link>
    </div>
  );
}
