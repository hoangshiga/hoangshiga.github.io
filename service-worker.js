const CACHE_NAME = "pwa-cache-v1";

const urlsToCache = [
    "/",
    "/manifest.json",
    "/app.js",
    "/service-worker.js",
    "/route.js",
    "/index.js",
];

// Install
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Fetch (offline support)
self.addEventListener("fetch", event => {
    console.log('event.request', event.request)
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});