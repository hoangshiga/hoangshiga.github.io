if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Service Worker đã được đăng ký!"))
        .catch(error => console.log("Lỗi khi đăng ký Service Worker:", error));
}
