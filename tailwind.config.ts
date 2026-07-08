import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        roxo: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        cinza: {
          50: "#f6f6f7",
          100: "#e9e8ec",
          200: "#d1cfd6",
          300: "#a8a5b3",
          400: "#85818f",
          500: "#605c69",
          600: "#4a4656",
          700: "#353340",
          800: "#26242e",
          850: "#201f27",
          900: "#1a191f",
          950: "#131217",
        },
      },
    },
  },
  plugins: [],
};

export default config;
