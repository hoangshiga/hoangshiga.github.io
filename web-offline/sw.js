const CACHE_NAME = 'offline-cache-v1';
const FILES_TO_CACHE = [
    './index.html',
    './styles.css',
    './script.js'
];

// Cài đặt Service Worker và lưu cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Đang lưu các file vào cache...");
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// Lắng nghe yêu cầu fetch và trả về từ cache nếu offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Xóa cache cũ khi có bản cập nhật mới
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});
