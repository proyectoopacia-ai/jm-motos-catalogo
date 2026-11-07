// Service worker de J&M Motos: abre rápido y funciona con conexión lenta.
// Páginas y products.json: primero la red (para ver siempre lo último) y, si falla, la copia guardada.
// Fotos e íconos: primero la copia guardada y se actualiza en segundo plano.
const VERSION = "jm-v2";
const SHELL = ["./", "index.html", "guia.html", "admin.html", "products.json", "pwa.js",
  "img/logo.png", "favicon.png", "icons/catalogo-192.png", "icons/guia-192.png", "icons/admin-192.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const fresh = req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname.endsWith("/") || url.pathname.endsWith(".json") || url.pathname.endsWith(".js") || url.pathname.endsWith(".webmanifest");
  if (url.pathname.endsWith("admin-key.json")) return; // nunca guardar el acceso
  if (fresh) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
      const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
