(async () => {
    console.log('sw.js', [self, this, typeof window, location])
    const CACHE_NAME = 'my-pwa-cache-v1'
    if (self.window) return [
        await navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister()))),
        await caches.keys().then(names => Promise.all(names.map(
            name => name != CACHE_NAME && (console.log('caches.delete', name) || caches.delete(name))
        ))),
        await caches.keys().then(cacheNames => Promise.all(cacheNames.map(
            cacheName => caches.open(cacheName).then(cache => cache.keys().then(
                keys => Promise.all(keys.map(key => cache.delete(key)))
            ))
        ))),
        await navigator.serviceWorker.register('/sw.js')
    ]
    self.addEventListener('install', event => console.log('install', event) || event.waitUntil(self.skipWaiting()))
    self.addEventListener('activate', event => console.log('activate', event) || event.waitUntil(self.clients.claim()))
    self.addEventListener('fetch', event => {
        event.respondWith(caches.match(event.request).then(response => {
            if (response) return console.log('cache: ' + event.request.url, [event, event.request, response]) || response
            return fetch(event.request).then(response => {
                eval('(' + String(() => console.log('fetch')) + ')()')
                console.log('fetch: ' + event.request.url, [event, event.request, response, response.status, response.type])
                if (response && response.status == 200 && response.type == 'basic') {
                    const responseToCache = response.clone()
                    console.log('cache.put: ' + event.request.url, [event, responseToCache])
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
                }
                return response
            })
        }))
    })
})()