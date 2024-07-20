const CACHE_NAME = "exchange-rate-cache-v1";
const urlsToCache = [
    "/pwa-cambio-blue/",            // Página inicial
    "/pwa-cambio-blue/index.html",  // HTML principal
    "/pwa-cambio-blue/styles.css",  // CSS
    "/pwa-cambio-blue/script.js",   // JavaScript
    "/pwa-cambio-blue/cleave.min.js", // Cleave.js
    "/pwa-cambio-blue/manifest.json", // Manifesto
    "/pwa-cambio-blue/icon-192x192.png", // Ícone de 192x192
    "/pwa-cambio-blue/icon-512x512.png", // Ícone de 512x512
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
});
