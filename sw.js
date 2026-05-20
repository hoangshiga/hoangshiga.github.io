const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/images/', // Nếu có thư mục hình ảnh, có thể cache toàn bộ thư mục
];

// Cài đặt Service Worker và cache các tệp tin cần thiết
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Caching các tệp tin trong danh sách khi Service Worker được cài đặt
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Kiểm tra và trả về cache khi có yêu cầu từ client
self.addEventListener('fetch', (event) => {
  console.log('Fetch event for: ' + event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Kiểm tra xem có tệp trong cache không
        if (cachedResponse) {
          console.log('Found in cache: ' + event.request.url);
          return cachedResponse;
        }
        
        // Nếu không có trong cache, tiến hành fetch từ mạng
        return fetch(event.request)
          .then((response) => {
            // Nếu không phải tệp tin tĩnh (ví dụ: API), không cần lưu vào cache
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone the response and store it in cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

// Cập nhật cache nếu cần thiết
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache: ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
