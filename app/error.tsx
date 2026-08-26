"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-2xl font-black text-gray-900 mb-3">Valami hiba történt</h1>
      <p className="text-gray-500 mb-6">{error.message || "Váratlan hiba"}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-600 transition-colors"
      >
        Újrapróbálás
      </button>
    </div>
  );
}
