"use client";

import { useEffect, useMemo, useState } from "react";
import { rotaInicial, CATEGORIAS, type Atividade } from "./data";
import AddPlaceModal from "./add-place-modal";
import AddFab from "./add-fab";

const STORAGE_KEY = "rota-viagem-v1";

// "08/07 às 14:30" a partir de uma data ISO (null se não houver/for inválida)
function formatarQuando(iso?: string): string | null {
  if (typeof iso !== "string") return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} às ${p(d.getHours())}:${p(
    d.getMinutes()
  )}`;
}

type ItemAdicionado = { id: string; cidade: string; titulo: string };

export default function Home() {
  // feitos: id -> data/hora ISO em que foi marcado
  const [feitos, setFeitos] = useState<Record<string, string>>({});
  const [excluidos, setExcluidos] = useState<string[]>([]);
  const [adicionados, setAdicionados] = useState<ItemAdicionado[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const cidades = rotaInicial.map((s) => s.cidade);

  // A lista é SEMPRE montada a partir do código (rotaInicial), removendo os
  // excluídos e acrescentando os que você adicionou. No navegador guardamos
  // só o que foi marcado / excluído / adicionado.
  const rota = useMemo(
    () =>
      rotaInicial.map((secao) => ({
        ...secao,
        atividades: [
          ...secao.atividades.filter((a) => !excluidos.includes(a.id)),
          ...adicionados
            .filter((a) => a.cidade === secao.cidade)
            .map(
              (a): Atividade => ({
                id: a.id,
                titulo: a.titulo,
                categoria: "outro",
              })
            ),
        ],
      })),
    [excluidos, adicionados]
  );

  // Carrega estado salvo no navegador
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo) as {
          feitos?: Record<string, string>;
          excluidos?: string[];
          adicionados?: ItemAdicionado[];
        };
        if (parsed.feitos) setFeitos(parsed.feitos);
        if (parsed.excluidos) setExcluidos(parsed.excluidos);
        if (parsed.adicionados) setAdicionados(parsed.adicionados);
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ feitos, excluidos, adicionados })
    );
  }, [feitos, excluidos, adicionados, carregado]);

  const alternarFeito = (id: string) =>
    setFeitos((f) => {
      const novo = { ...f };
      if (novo[id]) delete novo[id];
      else novo[id] = new Date().toISOString();
      return novo;
    });

  const excluir = (id: string) => {
    // itens adicionados sao removidos de vez; os do codigo entram em "excluidos"
    if (id.startsWith("add-")) {
      setAdicionados((a) => a.filter((x) => x.id !== id));
    } else {
      setExcluidos((e) => (e.includes(id) ? e : [...e, id]));
    }
    setFeitos((f) => {
      const novo = { ...f };
      delete novo[id];
      return novo;
    });
  };

  const adicionar = (cidade: string, titulo: string) => {
    const nome = titulo.trim();
    if (!nome) return;
    const id = `add-${Date.now()}`;
    setAdicionados((a) => [...a, { id, cidade, titulo: nome }]);
    setModalAberto(false);
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

  // Trilha de conquistas (marcos com emoji do rank correspondente)
  const marcos = [
    { pct: 25, emoji: "🌄" },
    { pct: 50, emoji: "🧭" },
    { pct: 75, emoji: "🔥" },
    { pct: 100, emoji: "🏆" },
  ];
  const proximo = marcos.find((m) => progresso < m.pct)?.pct;
  const faltam = proximo
    ? Math.max(0, Math.ceil((total * proximo) / 100) - concluidos)
    : 0;
  // fração preenchida da trilha (do 1º ao último marco: 25%→100%)
  const trilha = Math.min(Math.max((progresso - 25) / 75, 0), 1);

  // Geometria do anel de progresso
  const raio = 34;
  const circunferencia = 2 * Math.PI * raio;
  const preenchido = circunferencia * (1 - progresso / 100);

  if (!carregado) {
    return (
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-roxo-400/80">
            Dias 13–16 · Mato Grosso
          </p>
          <h1 className="font-display mt-1.5 bg-gradient-to-br from-roxo-100 via-roxo-200 to-roxo-400 bg-clip-text text-4xl font-extrabold leading-[1.05] text-transparent sm:text-5xl">
            Rota da Viagem
          </h1>
          <p className="mt-2 text-sm text-cinza-400">
            Chapada dos Guimarães &amp; Cuiabá
          </p>

          {/* skeleton do card de progresso */}
          <div className="mt-6 rounded-2xl border border-cinza-800 bg-gradient-to-b from-cinza-950 to-[#0b0a0f] p-5 shadow-md shadow-black/40">
            <div className="flex items-center gap-5">
              <div className="skeleton h-[88px] w-[88px] shrink-0 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-5 w-40 rounded-md" />
                <div className="skeleton h-3 w-52 rounded-md" />
                <div className="skeleton h-3 w-44 rounded-md" />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-11 w-11 rounded-full" />
              ))}
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
                    className="flex items-center gap-3.5 rounded-xl border border-cinza-800 bg-gradient-to-b from-cinza-950 to-[#0b0a0f] px-4 py-3.5"
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
      <header className="reveal mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-roxo-400/80">
          Dias 13–16 · Mato Grosso
        </p>
        <h1 className="font-display mt-1.5 bg-gradient-to-br from-roxo-100 via-roxo-200 to-roxo-400 bg-clip-text text-4xl font-extrabold leading-[1.05] text-transparent sm:text-5xl">
          Rota da Viagem
        </h1>
        <p className="mt-2 text-sm text-cinza-400">
          Chapada dos Guimarães &amp; Cuiabá
        </p>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-roxo-500/25 bg-gradient-to-b from-cinza-950 to-[#0b0a0f] p-5 shadow-md shadow-black/40">
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
                <span className="font-display text-2xl font-extrabold text-cinza-50 tabular-nums">
                  {progresso}%
                </span>
              </div>
            </div>

            {/* Rank + contagem + medalhas */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{rank.emoji}</span>
                <span className="font-display truncate text-lg font-bold text-roxo-200">
                  {rank.nome}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-cinza-400">
                <span className="font-semibold text-cinza-100 tabular-nums">
                  {concluidos}
                </span>{" "}
                de {total} lugares conquistados
              </p>
              {progresso === 100 ? (
                <p className="mt-1.5 text-sm font-semibold text-emerald-400/90">
                  Tudo conquistado! 🎉
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-roxo-300/90">
                  {faltam === 1
                    ? "Falta 1 lugar pra próxima conquista"
                    : `Faltam ${faltam} lugares pra próxima conquista`}
                </p>
              )}
            </div>
          </div>

          {/* Trilha de conquistas */}
          <div className="relative mt-6">
            <div className="absolute left-[1.375rem] right-[1.375rem] top-[1.375rem] h-1 -translate-y-1/2 rounded-full bg-cinza-700" />
            <div
              className="absolute left-[1.375rem] top-[1.375rem] h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-roxo-600 to-roxo-400 transition-all duration-500"
              style={{ width: `calc((100% - 2.75rem) * ${trilha})` }}
            />
            <div className="relative flex justify-between">
              {marcos.map((m) => {
                const on = progresso >= m.pct;
                return (
                  <div
                    key={m.pct}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      title={`${m.pct}%`}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-lg transition-all duration-300 ${
                        on
                          ? "border-roxo-400 bg-gradient-to-br from-roxo-500 to-roxo-600 shadow-md shadow-roxo-500/40"
                          : "border-cinza-700 bg-cinza-850 opacity-50 grayscale"
                      }`}
                    >
                      {m.emoji}
                    </div>
                    <span
                      className={`text-[11px] font-semibold tabular-nums ${
                        on ? "text-roxo-300" : "text-cinza-500"
                      }`}
                    >
                      {m.pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8">
        {rota.map((secao, i) => (
          <section
            key={secao.cidade}
            className="reveal"
            style={{ animationDelay: `${0.1 * (i + 1)}s` }}
          >
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-cinza-700 pb-2">
              <h2 className="font-display text-2xl font-bold text-cinza-50">
                {secao.cidade}
              </h2>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-roxo-500/40 bg-roxo-500/15 py-1 pl-2.5 pr-3 text-roxo-300">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                >
                  <rect
                    x="3"
                    y="4.5"
                    width="14"
                    height="12"
                    rx="2.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M3 8h14M7 3v3M13 3v3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="flex items-center gap-1 text-xs font-semibold tabular-nums">
                  {secao.dias.map((d, idx) => (
                    <span key={d} className="flex items-center gap-1">
                      {idx > 0 && (
                        <span className="text-roxo-400/50">·</span>
                      )}
                      {d}
                    </span>
                  ))}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-roxo-400/90">
                  {secao.mes}
                </span>
              </span>
            </div>

            {secao.atividades.length === 0 ? (
              <p className="px-1 py-3 text-sm text-cinza-400">
                Nenhuma atividade nesta cidade.
              </p>
            ) : (
              <div>
                {Object.keys(CATEGORIAS)
                  .map((catKey) => ({
                    catKey,
                    itens: secao.atividades.filter(
                      (a) => (a.categoria ?? "outro") === catKey
                    ),
                  }))
                  .filter((g) => g.itens.length > 0)
                  .map((g, gi) => (
                    <div
                      key={g.catKey}
                      className={
                        gi > 0
                          ? "mt-5 border-t border-dashed border-cinza-700 pt-5"
                          : ""
                      }
                    >
                      <div className="mb-2.5 flex items-center gap-2 px-1">
                        <span className="text-lg leading-none">
                          {CATEGORIAS[g.catKey].emoji}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-cinza-400">
                          {CATEGORIAS[g.catKey].label}
                        </span>
                        <span className="text-xs text-cinza-600 tabular-nums">
                          {g.itens.length}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {g.itens.map((atividade) => {
                          const feito = !!feitos[atividade.id];
                  const quandoTxt = formatarQuando(feitos[atividade.id]);
                  const busca =
                    atividade.local ??
                    `${atividade.titulo}, ${secao.cidade}, MT`;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    busca
                  )}`;
                  const temCoord =
                    atividade.lat != null && atividade.lng != null;
                  const uberUrl =
                    `https://m.uber.com/ul/?action=setPickup&pickup=my_location` +
                    `&dropoff[nickname]=${encodeURIComponent(atividade.titulo)}` +
                    `&dropoff[formatted_address]=${encodeURIComponent(busca)}` +
                    (temCoord
                      ? `&dropoff[latitude]=${atividade.lat}&dropoff[longitude]=${atividade.lng}`
                      : "");
                  const menuAberto = menuId === atividade.id;
                  return (
                    <li
                      key={atividade.id}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                        feito
                          ? "border-cinza-850 bg-cinza-950/60"
                          : menuAberto
                            ? "border-roxo-500/50 bg-gradient-to-b from-cinza-950 to-[#0b0a0f] shadow-lg shadow-roxo-500/10"
                            : "border-cinza-800 bg-gradient-to-b from-cinza-950 to-[#0b0a0f] shadow-md shadow-black/40 hover:-translate-y-0.5 hover:border-roxo-500/50 hover:shadow-lg hover:shadow-roxo-500/10"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => alternarFeito(atividade.id)}
                          aria-label={
                            feito ? "Desmarcar atividade" : "Marcar como feito"
                          }
                          className="group/check -my-2.5 -ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center"
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                              feito
                                ? "border-roxo-400 bg-gradient-to-br from-roxo-500 to-roxo-600 text-white shadow-sm shadow-roxo-500/40"
                                : "border-cinza-600 bg-transparent group-hover/check:border-roxo-400 group-hover/check:bg-roxo-500/10"
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
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(menuAberto ? null : atividade.id)
                          }
                          aria-expanded={menuAberto}
                          className="group/map min-w-0 flex-1 text-left"
                        >
                          <p className="flex items-center gap-1.5 text-base font-bold tracking-tight">
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
                          {feito ? (
                            <p className="flex items-center gap-1 text-xs text-emerald-400/80">
                              <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                aria-hidden="true"
                                className="h-3 w-3 shrink-0"
                              >
                                <path
                                  d="M5 10.5l3.5 3.5L15 6.5"
                                  stroke="currentColor"
                                  strokeWidth="2.4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              {quandoTxt
                                ? `Concluído em ${quandoTxt}`
                                : "Concluído"}
                            </p>
                          ) : (
                            <p className="flex items-center gap-1 text-xs text-roxo-400/70 transition-colors group-hover/map:text-roxo-300">
                              {atividade.nota ? `${atividade.nota} · ` : ""}
                              <span className="group-hover/map:underline">
                                Como chegar
                              </span>
                              <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                aria-hidden="true"
                                className={`h-3 w-3 transition-transform ${
                                  menuAberto ? "rotate-180" : ""
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
                            </p>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => excluir(atividade.id)}
                          aria-label="Excluir atividade"
                          className="-my-2.5 -mr-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-cinza-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            className="h-4 w-4"
                          >
                            <path
                              d="M6 6l8 8M14 6l-8 8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {menuAberto && (
                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-cinza-700 pt-3">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuId(null)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-cinza-700 bg-cinza-900/60 px-3 py-2.5 text-sm font-semibold text-cinza-100 transition-colors hover:border-roxo-500/60 hover:text-roxo-200"
                          >
                            <svg
                              viewBox="0 0 20 20"
                              fill="#ea4335"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2c-3.31 0-6 2.69-6 6 0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Google Maps
                          </a>
                          <a
                            href={uberUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuId(null)}
                            className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path d="M3 3h4v10a5 5 0 0010 0V3h4v10a9 9 0 01-18 0V3z" />
                            </svg>
                            Uber
                          </a>
                        </div>
                      )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Botão flutuante de adicionar (arrastável) */}
      <AddFab onClick={() => setModalAberto(true)} />

      {modalAberto && (
        <AddPlaceModal
          cidades={cidades}
          onAdd={adicionar}
          onClose={() => setModalAberto(false)}
        />
      )}
    </main>
  );
}
