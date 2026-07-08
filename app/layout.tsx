import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "./sw-register";
import PullToRefresh from "./pull-to-refresh";

export const metadata: Metadata = {
  title: "Rota da Viagem — Cuiabá & Chapada",
  description: "Controle das rotas e atividades da viagem",
  manifest: "/manifest.webmanifest",
  applicationName: "Rota Viagem",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rota Viagem",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#08070b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <PullToRefresh />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
