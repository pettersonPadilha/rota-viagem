export type Atividade = {
  id: string;
  titulo: string;
  nota?: string;
  /** Busca personalizada no Google Maps (padrão: título + cidade + MT) */
  local?: string;
  /** Coordenadas (para destino preciso no Uber) */
  lat?: number;
  lng?: number;
  /** Categoria (chave de CATEGORIAS) */
  categoria?: string;
};

export type Secao = {
  cidade: string;
  dias: number[];
  mes: string;
  atividades: Atividade[];
};

/** Categorias com ícone e rótulo */
export const CATEGORIAS: Record<string, { emoji: string; label: string }> = {
  hospedagem: { emoji: "🏨", label: "Hospedagem" },
  gastronomia: { emoji: "🍻", label: "Bar & Gastronomia" },
  parque: { emoji: "🌳", label: "Parque" },
  natureza: { emoji: "🏞️", label: "Natureza" },
  compras: { emoji: "🛍️", label: "Compras" },
  diversao: { emoji: "🎡", label: "Diversão" },
  show: { emoji: "🎤", label: "Show" },
  passeio: { emoji: "📸", label: "Passeio" },
  outro: { emoji: "📍", label: "Local" },
};

export const rotaInicial: Secao[] = [
  {
    cidade: "Cuiabá",
    dias: [13, 14, 16],
    mes: "Jul",
    atividades: [
      {
        id: "cba-16",
        titulo: "Hotel Nacional Inn Cuiabá",
        categoria: "hospedagem",
        lat: -15.601593,
        lng: -56.087524,
      },
      { id: "cba-01", titulo: "Sinuelo e Vilho", categoria: "gastronomia" },
      {
        id: "cba-02",
        titulo: "Zenaide Bar",
        categoria: "gastronomia",
        lat: -15.575552,
        lng: -56.072457,
      },
      {
        id: "cba-03",
        titulo: "Parque Mãe Bonifácia",
        categoria: "parque",
        lat: -15.58065,
        lng: -56.105196,
      },
      {
        id: "cba-04",
        titulo: "Parque Tia Nair",
        categoria: "parque",
        lat: -15.594912,
        lng: -56.057722,
      },
      {
        id: "cba-05",
        titulo: "Parque Júlio Domingos de Campos",
        nota: "Parque das Águas",
        categoria: "parque",
        lat: -15.567067,
        lng: -56.080027,
      },
      { id: "cba-06", titulo: "Parque Novo", categoria: "parque" },
      {
        id: "cba-07",
        titulo: "Shopping Pantanal",
        categoria: "compras",
        lat: -15.575122,
        lng: -56.072925,
      },
      {
        id: "cba-08",
        titulo: "Shopping Estação",
        categoria: "compras",
        lat: -15.590195,
        lng: -56.120546,
      },
      {
        id: "cba-17",
        titulo: "Shopping 3 Américas",
        categoria: "compras",
        lat: -15.611995,
        lng: -56.073288,
      },
      {
        id: "cba-09",
        titulo: "Clube 40 Graus",
        categoria: "diversao",
        lat: -15.633329,
        lng: -56.088626,
      },
      {
        id: "cba-14",
        titulo: "Praça da República",
        categoria: "parque",
        lat: -15.597894,
        lng: -56.095666,
      },
      {
        id: "cba-15",
        titulo: "Aquário Municipal Justino Malheiros",
        categoria: "diversao",
        lat: -15.615032,
        lng: -56.108212,
      },
      {
        id: "cba-13",
        titulo: "Rommanel - Shopping Estação Cuiabá",
        local:
          "Rommanel - Shopping Estação, Av. Miguel Sutil, 9300, Santa Rosa, Cuiabá, MT",
        categoria: "compras",
        lat: -15.5971393,
        lng: -56.0961914,
      },
      {
        id: "cba-11",
        titulo: "Casa da Pizza",
        categoria: "gastronomia",
        lat: -15.612998,
        lng: -56.066835,
      },
      {
        id: "cba-12",
        titulo: "Show Zezé de Camargo e Mariana Fagundes",
        nota: "Dia 16",
        categoria: "show",
      },
    ],
  },
  {
    cidade: "Chapada dos Guimarães",
    dias: [15],
    mes: "Jul",
    atividades: [
      {
        id: "cha-01",
        titulo: "Cachoeira Véu de Noiva",
        categoria: "natureza",
        lat: -15.407418,
        lng: -55.832616,
      },
      {
        id: "cha-02",
        titulo: "Mirante e Pôr do Sol",
        categoria: "natureza",
        lat: -15.472541,
        lng: -55.691326,
      },
      {
        id: "cha-03",
        titulo: "Mirante",
        categoria: "natureza",
        lat: -15.472541,
        lng: -55.691326,
      },
      {
        id: "cha-04",
        titulo: "Restaurante Mirante Atma",
        categoria: "gastronomia",
      },
      { id: "cha-05", titulo: "Vale do Rio Verde", categoria: "natureza" },
    ],
  },
];
