"use client";

import { useEffect } from "react";

export default function ParabensModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="anim-fade absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="anim-pop relative w-full max-w-sm overflow-hidden rounded-3xl border border-roxo-500/40 bg-gradient-to-b from-cinza-900 to-[#0b0a0f] p-8 text-center shadow-2xl shadow-roxo-900/50"
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-roxo-600/25 blur-3xl" />
        <div className="relative">
          <div className="text-6xl">🎉</div>
          <h2 className="font-display mt-3 text-5xl font-bold text-roxo-200">
            Parabéns!
          </h2>
          <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-cinza-300">
            Você finalizou toda a sua viagem por Cuiabá e Chapada dos
            Guimarães! 🏆
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 w-full rounded-xl bg-gradient-to-br from-roxo-500 to-roxo-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-roxo-600/30 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
