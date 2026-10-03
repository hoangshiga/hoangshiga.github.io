console.log('sw.js', location)
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/route.js',
];

self.addEventListener('install', event => console.log('install', event) || event.waitUntil(caches.open(CACHE_NAME).then(
    cache => console.log('caches.open', cache) || cache.addAll(urlsToCache)
)))

self.addEventListener('activate', event => console.log('activate', event) || event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(
    cacheName => cacheName != CACHE_NAME ? console.log('caches.delete', cacheName) || caches.delete(cacheName) : 0
)))))

self.addEventListener('fetch', event => console.log('fetch', [event, event.request, event.request.url]) || event.respondWith(caches.match(event.request).then(cachedResponse => {
    if (cachedResponse) return console.log('Found cache', [event, event.request, event.request.url, cachedResponse]) || cachedResponse
    return fetch(event.request).then(response => {
        if (new URLSearchParams(location.search).has('debug')) debugger
        if (!response || response.status !== 200 || response.type !== 'basic') return response
        const responseToCache = response.clone()
        console.log('cache.put', [event, event.request.url, response, responseToCache])
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
        return response
    })
})))

// self.addEventListener('fetch', event => console.log('fetch', [event, event.request, event.request.url]) || event.respondWith(caches.match(event.request).then(cachedResponse => {
//     if (cachedResponse) return console.log('Found cache', [event, event.request, event.request.url, cachedResponse]) || cachedResponse
//     return fetch(event.request).then(response => {
//         debugger
//         if (!response || response.status !== 200 || response.type !== 'basic') return response
//         const responseToCache = response.clone()
//         console.log('cache.put', [event, event.request.url, response, responseToCache])
//         caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
//         return response
//     })
// })))
