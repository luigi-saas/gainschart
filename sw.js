// Service worker minimal — juste assez pour rendre l'app installable.
// Pas de cache offline agressif : les données viennent de Firestore en direct.
const CACHE_NAME = "planche-shell-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Passthrough réseau simple (pas de cache-first) pour rester toujours à jour.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
