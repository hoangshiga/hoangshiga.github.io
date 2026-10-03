(async () => {
    console.log('sw.js', [self, this, typeof window, location])
    const CACHE_NAME = 'my-pwa-cache-v1'
    const urlsToCache = [
        '/',
        '/text/',
    ]
    const install = () => caches.open(CACHE_NAME).then(cache => console.log('caches.open', cache) || cache.addAll(urlsToCache))
    const activate = () => caches.keys().then(cacheNames => Promise.all(cacheNames.map(
        cacheName => cacheName != CACHE_NAME && (console.log('caches.delete', cacheName) || caches.delete(cacheName))
    )))
    if (self.window) return Promise.all([install(), activate()])
    self.addEventListener('install', event => console.log('install', event) || event.waitUntil(Promise.all([self.skipWaiting(), install()])))
    self.addEventListener('activate', event => console.log('activate', event) || event.waitUntil(Promise.all([self.clients.claim(), activate()])))
    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) return console.log('cache: ' + event.request.url, [event, event.request, cachedResponse]) || cachedResponse
            return fetch(event.request).then(response => {
                console.log('fetch: ' + event.request.url, response)
                if (response && response.status == 200 && response.type == 'basic') {
                    const responseToCache = response.clone()
                    console.log('cache.put: ' + event.request.url, [event, response, responseToCache])
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
                }
                return response
            })
        }))
    })
})()