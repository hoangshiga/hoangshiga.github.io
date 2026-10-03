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
    const openDB = () => new Promise((res, rej) => {
        const request = indexedDB.open('cache', 1)
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
        request.onupgradeneeded = () => !request.result.objectStoreNames.contains('data') && request.result.createObjectStore('data')
    })
    const saveData = (key, value) => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readwrite')
        transaction.oncomplete = () => res()
        transaction.onerror = () => rej(transaction.error)
        transaction.objectStore('data').put(value, key)
    })
    const getData = key => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readonly')
        const request = transaction.objectStore('data').get(key)
        request.onsuccess = () => res(request.result)
        request.onerror = () => rej(request.error)
    })
    const deleteData = key => new Promise(async (res, rej) => {
        const db = await openDB()
        const transaction = db.transaction('data', 'readwrite')
        const request = transaction.objectStore('data').delete(key)
        request.onsuccess = () => res()
        request.onerror = () => rej(request.error)
    })
    self.addEventListener('fetch', event => {
        event.respondWith((async () => {
            const url = event.request.url
            const status = await getData(url)
            if (status == 0) return fetch(event.request)
            if (status == 1) return caches.match(event.request).then(response => {
                if (response) return console.log('cache: ' + event.request.url, [event, event.request, response]) || response
                return fetch(event.request).then(response => {
                    console.log('fetch: ' + event.request.url, [event, event.request, response, response.status, response.type])
                    // if (!(response && response.status == 200 && response.type == 'basic')) return response
                    const responseToCache = response.clone()
                    console.log('cache.put: ' + event.request.url, [event, responseToCache])
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
                    return response
                })
            })
            if (status == 2) return fetch(event.request).then(async response => {
                console.log('fetch: ' + event.request.url, [event, event.request, response, response.status, response.type])
                // if (!(response && response.status == 200 && response.type == 'basic')) return response
                const responseToCache = response.clone()
                console.log('cache.put: ' + event.request.url, [event, responseToCache])
                await caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache))
                await saveData(url, 1)
                return response
            })
            await saveData(url, 0)
            return fetch(event.request)
        })())
    })
})()