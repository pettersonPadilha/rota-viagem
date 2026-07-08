"use client";

import { useEffect, useMemo, useState } from "react";
import { rotaInicial, type Secao } from "./data";

const STORAGE_KEY = "rota-viagem-v1";

export default function Home() {
  const [rota, setRota] = useState<Secao[]>(rotaInicial);
  const [feitos, setFeitos] = useState<Record<string, boolean>>({});
  const [carregado, setCarregado] = useState(false);

  // Carrega estado salvo no navegador
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo) as {
          rota?: Secao[];
          feitos?: Record<string, boolean>;
        };
        if (parsed.rota) setRota(parsed.rota);
        if (parsed.feitos) setFeitos(parsed.feitos);
      }
    } catch {
      // ignora estado corrompido
    }
    // pequeno atraso pra exibir o skeleton
    const t = setTimeout(() => setCarregado(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Salva sempre que muda
  useEffect(() => {
    if (!carregado) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rota, feitos }));
  }, [rota, feitos, carregado]);

  const alternarFeito = (id: string) =>
    setFeitos((f) => ({ ...f, [id]: !f[id] }));

  const excluir = (secaoIndex: number, id: string) => {
    setRota((r) =>
      r.map((secao, i) =>
        i === secaoIndex
          ? { ...secao, atividades: secao.atividades.filter((a) => a.id !== id) }
          : secao
      )
    );
    setFeitos((f) => {
      const novo = { ...f };
      delete novo[id];
      return novo;
    });
  };

  const { total, concluidos } = useMemo(() => {
    const todos = rota.flatMap((s) => s.atividades.map((a) => a.id));
    return {
      total: todos.length,
      concluidos: todos.filter((id) => feitos[id]).length,
    };
  }, [rota, feitos]);

  const progresso = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  const rank =
    progresso === 100
      ? { nome: "Viagem completa!", emoji: "🏆" }
      : progresso >= 75
        ? { nome: "Quase lá", emoji: "🔥" }
        : progresso >= 50
          ? { nome: "Desbravador", emoji: "🧭" }
          : progresso >= 25
            ? { nome: "Aventureiro", emoji: "🌄" }
            : concluidos > 0
              ? { nome: "Explorador", emoji: "🎒" }
              : { nome: "Bora começar", emoji: "🚗" };

  const medalhas = [25, 50, 75, 100];

  // Geometria do anel de progresso
  const raio = 34;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = circunferencia * (1 - progresso / 100);

  if (!carregado) {
    return (
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-roxo-200 sm:text-4xl">
            Rota da Viagem
          </h1>
          <p className="mt-1 text-sm text-cinza-400">
            Chapada dos Guimarães &amp; Cuiabá
          </p>

          {/* skeleton do card de progresso */}
          <div className="mt-6 rounded-2xl border border-cinza-700 bg-cinza-850 p-5">
            <div className="flex items-center gap-5">
              <div className="skeleton h-[88px] w-[88px] shrink-0 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-4 w-40 rounded-md" />
                <div className="skeleton h-3 w-52 rounded-md" />
                <div className="flex gap-2 pt-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-8 w-8 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {[
            { titulo: "w-32", linhas: 5 },
            { titulo: "w-56", linhas: 4 },
          ].map((sec, s) => (
            <section key={s}>
              <div className="mb-3 flex items-center justify-between border-b border-cinza-700 pb-2">
                <div className={`skeleton h-6 rounded-md ${sec.titulo}`} />
                <div className="skeleton h-6 w-28 rounded-full" />
              </div>
              <ul className="space-y-2">
                {Array.from({ length: sec.linhas }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3.5 rounded-xl border border-cinza-700 bg-gradient-to-br from-cinza-800 to-cinza-850 px-4 py-3.5"
                  >
                    <div className="skeleton h-6 w-6 shrink-0 rounded-md" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div
                        className="skeleton h-4 rounded-md"
                        style={{ width: `${55 + ((i * 13) % 35)}%` }}
                      />
                      <div className="skeleton h-3 w-24 rounded-md" />
                    </div>
                    <div className="skeleton h-8 w-8 shrink-0 rounded-lg" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-roxo-200 sm:text-4xl">
          Rota da Viagem
        </h1>
        <p className="mt-1 text-sm text-cinza-400">
          Chapada dos Guimarães &amp; Cuiabá
        </p>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-roxo-500/30 bg-gradient-to-br from-cinza-850 to-cinza-900 p-5">
          {/* brilho roxo de fundo */}
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-roxo-600/20 blur-3xl transition-opacity duration-500"
            style={{ opacity: 0.3 + (progresso / 100) * 0.7 }}
          />

          <div className="relative flex items-center gap-5">
            {/* Anel de progresso */}
            <div className="relative shrink-0">
              <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
                <circle
                  cx="44"
                  cy="44"
                  r={raio}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-cinza-700"
                />
                <circle
                  cx="44"
                  cy="44"
                  r={raio}
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circunferencia}
                  strokeDashoffset={preenchido}
                  className="transition-all duration-500 ease-out"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-cinza-50 tabular-nums">
                  {progresso}%
                </span>
              </div>
            </div>

            {/* Rank + contagem + medalhas */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{rank.emoji}</span>
                <span className="truncate text-base font-semibold text-roxo-200">
                  {rank.nome}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-cinza-400">
                <span className="font-semibold text-cinza-100 tabular-nums">
                  {concluidos}
                </span>{" "}
                de {total} lugares conquistados
              </p>

              <div className="mt-3 flex items-center gap-2">
                {medalhas.map((marco) => {
                  const desbloqueada = progresso >= marco;
                  return (
                    <div
                      key={marco}
                      title={`${marco}%`}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 ${
                        desbloqueada
                          ? "border-roxo-400 bg-gradient-to-br from-roxo-500 to-roxo-600 text-white shadow-sm shadow-roxo-500/40"
                          : "border-cinza-700 bg-cinza-800 text-cinza-600"
                      }`}
                    >
                      {desbloqueada ? "★" : marco}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {rota.map((secao, secaoIndex) => (
          <section key={secao.cidade}>
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-cinza-700 pb-2">
              <h2 className="text-xl font-semibold text-cinza-50">
                {secao.cidade}
              </h2>
              <span className="shrink-0 rounded-full border border-roxo-500/40 bg-roxo-500/15 px-3 py-1 text-xs font-medium text-roxo-300">
                {secao.datas}
              </span>
            </div>

            {secao.atividades.length === 0 ? (
              <p className="px-1 py-3 text-sm text-cinza-400">
                Nenhuma atividade nesta cidade.
              </p>
            ) : (
              <ul className="space-y-2">
                {secao.atividades.map((atividade) => {
                  const feito = !!feitos[atividade.id];
                  const busca =
                    atividade.local ??
                    `${atividade.titulo}, ${secao.cidade}, MT`;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    busca
                  )}`;
                  return (
                    <li
                      key={atividade.id}
                      className={`group relative flex items-center gap-3.5 overflow-hidden rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                        feito
                          ? "border-cinza-800 bg-cinza-900/50"
                          : "border-cinza-700 bg-gradient-to-br from-cinza-800 to-cinza-850 hover:-translate-y-0.5 hover:border-roxo-500/60 hover:shadow-lg hover:shadow-roxo-500/10"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => alternarFeito(atividade.id)}
                        aria-label={
                          feito ? "Desmarcar atividade" : "Marcar como feito"
                        }
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          feito
                            ? "border-roxo-400 bg-gradient-to-br from-roxo-500 to-roxo-600 text-white shadow-sm shadow-roxo-500/40"
                            : "border-cinza-600 bg-transparent hover:border-roxo-400 hover:bg-roxo-500/10"
                        }`}
                      >
                        {feito && (
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-4 w-4"
                          >
                            <path
                              d="M5 10.5l3.5 3.5L15 6.5"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver no Google Maps"
                        className="group/map min-w-0 flex-1"
                      >
                        <p className="flex items-center gap-1.5 text-base font-bold tracking-tight transition-all">
                          <span
                            className={`truncate ${
                              feito
                                ? "text-cinza-500 line-through"
                                : "bg-gradient-to-r from-roxo-200 to-roxo-400 bg-clip-text text-transparent"
                            }`}
                          >
                            {atividade.titulo}
                          </span>
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className={`h-3.5 w-3.5 shrink-0 transition-all group-hover/map:scale-125 ${
                              feito
                                ? "text-cinza-600"
                                : "text-roxo-400/60 group-hover/map:text-roxo-300"
                            }`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 2c-3.31 0-6 2.69-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </p>
                        <p
                          className={`text-xs transition-colors ${
                            feito
                              ? "text-cinza-600"
                              : "text-roxo-400/70 group-hover/map:text-roxo-300"
                          }`}
                        >
                          {atividade.nota ? `${atividade.nota} · ` : ""}
                          <span className="group-hover/map:underline">
                            Ver no mapa
                          </span>
                        </p>
                      </a>

                      <button
                        type="button"
                        onClick={() => excluir(secaoIndex, atividade.id)}
                        aria-label="Excluir atividade"
                        className="shrink-0 rounded-lg p-2 text-cinza-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                          <path
                            d="M6 6l8 8M14 6l-8 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
