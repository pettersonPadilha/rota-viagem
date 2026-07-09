"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 56; // h-14 w-14
const MARGIN = 16;
const LIMIAR = 8; // px pra considerar arraste (e não toque)

type Pos = { x: number; y: number };

export default function AddFab({ onClick }: { onClick: () => void }) {
  // posição só na sessão — ao atualizar, volta pro canto inicial (não persiste)
  const [pos, setPos] = useState<Pos | null>(null);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    offX: 0,
    offY: 0,
  });

  const clamp = (x: number, y: number): Pos => {
    const maxX = Math.max(MARGIN, window.innerWidth - SIZE - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - SIZE - MARGIN);
    return {
      x: Math.min(Math.max(x, MARGIN), maxX),
      y: Math.min(Math.max(y, MARGIN), maxY),
    };
  };

  const cantoPadrao = (): Pos => ({
    x: window.innerWidth - SIZE - MARGIN,
    y: window.innerHeight - SIZE - MARGIN - 8,
  });

  // sempre inicia no canto padrão
  useEffect(() => {
    setPos(cantoPadrao());
    const onResize = () => setPos((p) => (p ? clamp(p.x, p.y) : p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > LIMIAR)
      d.moved = true;
    setPos(clamp(e.clientX - d.offX, e.clientY - d.offY));
  };

  const finalizar = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignora
    }
  };

  if (!pos) return null;

  return (
    <button
      type="button"
      aria-label="Adicionar lugar (arraste para mover)"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finalizar}
      onPointerCancel={finalizar}
      onClick={() => {
        if (drag.current.moved) return; // foi arraste, não toque
        onClick();
      }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      style={{ left: pos.x, top: pos.y, touchAction: "none" }}
      className="fixed z-40 flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full bg-gradient-to-br from-roxo-500 to-roxo-600 text-white shadow-lg shadow-roxo-600/40 transition-[transform,box-shadow] active:scale-95 active:cursor-grabbing"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
