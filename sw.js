console.log('sw.js')
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/route.js',
];

self.addEventListener('install', event => console.log('Service Worker installing...') || event.waitUntil(caches.open(CACHE_NAME).then(cache => console.log('Caching app shell') || cache.addAll(urlsToCache))))

self.addEventListener('activate', event => {
    console.log('Service Worker activating...')
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache: ' + cacheName)
            return caches.delete(cacheName)
        }
    }))))
})

self.addEventListener('fetch', event => {
    console.log('Fetch event for: ' + event.request.url)
    event.respondWith(caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return console.log('Found in cache: ' + event.request.url) || cachedResponse
        return fetch(event.request).then((response) => {
            // Nếu không phải tệp tin tĩnh (ví dụ: API), không cần lưu vào cache
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
            return response
        })
    }))
})
