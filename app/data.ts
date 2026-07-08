export type Atividade = {
  id: string;
  titulo: string;
  nota?: string;
  /** Busca personalizada no Google Maps (padrão: título + cidade + MT) */
  local?: string;
  /** Coordenadas (para destino preciso no Uber) */
  lat?: number;
  lng?: number;
};

export type Secao = {
  cidade: string;
  datas: string;
  atividades: Atividade[];
};

export const rotaInicial: Secao[] = [
  {
    cidade: "Cuiabá",
    datas: "Dias 13, 14 e 16",
    atividades: [
      { id: "cba-01", titulo: "Sinuelo e Vilho" },
      {
        id: "cba-02",
        titulo: "Zenaide Bar",
        lat: -15.575552,
        lng: -56.072457,
      },
      {
        id: "cba-03",
        titulo: "Parque Mãe Bonifácia",
        lat: -15.58065,
        lng: -56.105196,
      },
      {
        id: "cba-04",
        titulo: "Parque Tia Nair",
        lat: -15.594912,
        lng: -56.057722,
      },
      {
        id: "cba-05",
        titulo: "Parque Júlio Domingos de Campos",
        nota: "Parque das Águas",
        lat: -15.567067,
        lng: -56.080027,
      },
      { id: "cba-06", titulo: "Parque Novo" },
      {
        id: "cba-07",
        titulo: "Shopping Pantanal",
        lat: -15.575122,
        lng: -56.072925,
      },
      {
        id: "cba-08",
        titulo: "Shopping Estação",
        lat: -15.590195,
        lng: -56.120546,
      },
      {
        id: "cba-09",
        titulo: "Clube 40 Graus",
        lat: -15.633329,
        lng: -56.088626,
      },
      { id: "cba-10", titulo: "Amanotel" },
      {
        id: "cba-13",
        titulo: "Rommanel",
        nota: "Shopping Estação",
        local: "Shopping Estação, Cuiabá, MT",
        lat: -15.590195,
        lng: -56.120546,
      },
      {
        id: "cba-11",
        titulo: "Casa da Pizza",
        lat: -15.612998,
        lng: -56.066835,
      },
      {
        id: "cba-12",
        titulo: "Show Zezé de Camargo e Mariana Fagundes",
        nota: "Dia 16",
      },
    ],
  },
  {
    cidade: "Chapada dos Guimarães",
    datas: "Dia 15",
    atividades: [
      {
        id: "cha-01",
        titulo: "Cachoeira Véu de Noiva",
        lat: -15.407418,
        lng: -55.832616,
      },
      {
        id: "cha-02",
        titulo: "Mirante e Pôr do Sol",
        lat: -15.472541,
        lng: -55.691326,
      },
      {
        id: "cha-03",
        titulo: "Mirante",
        lat: -15.472541,
        lng: -55.691326,
      },
      { id: "cha-04", titulo: "Restaurante Mirante Atma" },
      { id: "cha-05", titulo: "Vale do Rio Verde" },
    ],
  },
];
