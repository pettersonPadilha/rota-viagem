export type Atividade = {
  id: string;
  titulo: string;
  nota?: string;
  /** Busca personalizada no Google Maps (padrão: título + cidade + MT) */
  local?: string;
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
      { id: "cba-02", titulo: "Zenaide Bar" },
      { id: "cba-03", titulo: "Parque Mãe Bonifácia" },
      { id: "cba-04", titulo: "Parque Tia Nair" },
      {
        id: "cba-05",
        titulo: "Parque Júlio Domingos de Campos",
        nota: "Parque das Águas",
      },
      { id: "cba-06", titulo: "Parque Novo" },
      { id: "cba-07", titulo: "Shopping Pantanal" },
      { id: "cba-08", titulo: "Shopping Estação" },
      { id: "cba-09", titulo: "Clube 40 Graus" },
      { id: "cba-10", titulo: "Amanotel" },
      { id: "cba-13", titulo: "Romatel" },
      { id: "cba-11", titulo: "Casa da Pizza" },
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
      { id: "cha-01", titulo: "Cachoeira Véu de Noiva" },
      { id: "cha-02", titulo: "Mirante e Pôr do Sol" },
      { id: "cha-03", titulo: "Mirante" },
      { id: "cha-04", titulo: "Restaurante Mirante Atma" },
      { id: "cha-05", titulo: "Vale do Rio Verde" },
    ],
  },
];
