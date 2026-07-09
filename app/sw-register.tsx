"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Em desenvolvimento, o service worker atrapalha (serve JS antigo em
    // cache). Desregistra e limpa o cache pra sempre rodar o código atual.
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((rs) => rs.forEach((r) => r.unregister()))
        .catch(() => {});
      if (window.caches) {
        caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(
          () => {}
        );
      }
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // registro falhou (ex.: sem HTTPS) — app segue funcionando normal
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
