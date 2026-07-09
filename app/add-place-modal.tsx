"use client";

import { useEffect, useRef, useState } from "react";

const EMOJI: Record<string, string> = {
  Cuiabá: "🌆",
  "Chapada dos Guimarães": "⛰️",
};

type Props = {
  cidades: string[];
  onAdd: (cidade: string, titulo: string) => void;
  onClose: () => void;
};

export default function AddPlaceModal({ cidades, onAdd, onClose }: Props) {
  const [cidade, setCidade] = useState(cidades[0] ?? "");
  const [titulo, setTitulo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // foca o input ao abrir + fecha no Esc + trava o scroll do fundo
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const enviar = () => {
    if (titulo.trim()) onAdd(cidade, titulo);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-4">
      {/* fundo escurecido */}
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="anim-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* painel: tela cheia no mobile, card no desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar lugar"
        className="anim-pop relative flex h-[100dvh] w-full flex-col bg-gradient-to-b from-cinza-900 to-[#08070b] p-6 sm:h-auto sm:max-w-md sm:rounded-3xl sm:border sm:border-roxo-500/30 sm:shadow-2xl sm:shadow-roxo-900/40"
        style={{
          paddingTop: "calc(1.5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-roxo-400/80">
              Novo lugar
            </p>
            <h2 className="font-display mt-1 text-2xl font-extrabold text-cinza-50">
              Adicionar à rota
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cinza-400 transition-colors hover:bg-cinza-800 hover:text-cinza-100"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <Campo label="Cidade">
            <CitySelect
              value={cidade}
              options={cidades}
              onChange={setCidade}
            />
          </Campo>

          <Campo label="Nome do lugar">
            <input
              ref={inputRef}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviar();
              }}
              placeholder="Ex.: Restaurante do João"
              aria-label="Nome do lugar"
              className="w-full rounded-xl border border-cinza-700 bg-cinza-850 px-4 py-3.5 text-base text-cinza-50 placeholder:text-cinza-500 outline-none transition-colors focus:border-roxo-500 focus:ring-2 focus:ring-roxo-500/30"
            />
          </Campo>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
          <button
            type="button"
            onClick={enviar}
            disabled={!titulo.trim()}
            className="flex-1 rounded-xl bg-gradient-to-br from-roxo-500 to-roxo-600 px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-roxo-600/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Adicionar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-cinza-700 px-4 py-3.5 text-base font-semibold text-cinza-300 transition-colors hover:border-cinza-600 hover:text-cinza-100 sm:flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  // div (não label): um <label> em volta do select customizado dispara
  // clique fantasma no gatilho e reabre a opção ao selecionar.
  return (
    <div className="block">
      <span className="mb-2 block text-sm font-medium text-cinza-300">
        {label}
      </span>
      {children}
    </div>
  );
}

/* Select customizado (bonito) de cidade */
function CitySelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={`Cidade: ${value}`}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border bg-cinza-850 px-4 py-3.5 text-left transition-colors ${
          aberto
            ? "border-roxo-500 ring-2 ring-roxo-500/30"
            : "border-cinza-700 hover:border-cinza-600"
        }`}
      >
        <span className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{EMOJI[value] ?? "📍"}</span>
          <span className="text-base font-semibold text-cinza-50">{value}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 text-roxo-400 transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {aberto && (
        <>
          {/* clique fora fecha */}
          <button
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setAberto(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            role="listbox"
            className="anim-pop absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-roxo-500/40 bg-cinza-850 p-1.5 shadow-2xl shadow-black/50"
          >
            {options.map((op) => {
              const selecionado = op === value;
              return (
                <li key={op}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selecionado}
                    onClick={() => {
                      onChange(op);
                      setAberto(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left transition-colors ${
                      selecionado
                        ? "bg-roxo-500/15 text-roxo-100"
                        : "text-cinza-200 hover:bg-cinza-800"
                    }`}
                  >
                    <span className="text-lg leading-none">
                      {EMOJI[op] ?? "📍"}
                    </span>
                    <span className="flex-1 text-base font-semibold">{op}</span>
                    {selecionado && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className="h-4 w-4 text-roxo-400"
                      >
                        <path
                          d="M5 10.5l3.5 3.5L15 6.5"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
