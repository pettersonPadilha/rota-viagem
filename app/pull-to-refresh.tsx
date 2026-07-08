"use client";

import { useEffect, useRef, useState } from "react";

const THRESHOLD = 70; // distância pra disparar o refresh
const MAX = 110; // limite do quanto desce
const RES = 0.5; // resistência (quanto "pesa" o arraste)

export default function PullToRefresh() {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [arrastando, setArrastando] = useState(false);
  const startY = useRef<number | null>(null);
  const pulling = useRef(false);
  const pullRef = useRef(0);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY <= 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      } else {
        pulling.current = false;
      }
    };

    const onMove = (e: TouchEvent) => {
      if (!pulling.current || startY.current == null || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY <= 0) {
        const d = Math.min(delta * RES, MAX);
        pullRef.current = d;
        setPull(d);
        setArrastando(true);
        if (d > 4) e.preventDefault();
      } else {
        pullRef.current = 0;
        setPull(0);
      }
    };

    const onEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      startY.current = null;
      setArrastando(false);
      if (pullRef.current >= THRESHOLD) {
        setRefreshing(true);
        setPull(THRESHOLD);
        setTimeout(() => window.location.reload(), 500);
      } else {
        pullRef.current = 0;
        setPull(0);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [refreshing]);

  const progresso = Math.min(pull / THRESHOLD, 1);
  const pronto = pull >= THRESHOLD;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
      style={{
        transform: `translateY(${pull - 46}px)`,
        opacity: pull > 6 || refreshing ? 1 : 0,
        transition: arrastando
          ? "none"
          : "transform 0.25s ease, opacity 0.25s ease",
      }}
    >
      <div
        className="mt-2 flex h-10 w-10 items-center justify-center rounded-full border border-cinza-700 bg-cinza-800/90 shadow-lg shadow-black/40 backdrop-blur"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={`h-5 w-5 text-roxo-400 ${refreshing ? "ptr-spin" : ""}`}
          style={{
            transform: refreshing
              ? undefined
              : `rotate(${progresso * 270}deg) scale(${0.6 + progresso * 0.4})`,
          }}
        >
          <path
            d="M12 4a8 8 0 1 1-7.5 5.2"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity={pronto || refreshing ? 1 : 0.55}
          />
          <path
            d="M3 4v5h5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={pronto || refreshing ? 1 : 0.55}
          />
        </svg>
      </div>
    </div>
  );
}
