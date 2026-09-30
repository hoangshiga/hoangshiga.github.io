if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registered', [registration, registration.scope]))
        .catch(err => console.log('SW error:', err))
    navigator.serviceWorker.getRegistrations()
        .then(registrations => {
            for (const registration of registrations) {
                console.log('Service Worker registered', [registration, registration.scope])
                //                registration.unregister()
            }
        })
    navigator.serviceWorker.getRegistration('/').then(registration => {
        if (registration) {
            console.log('Service Worker registered', [registration, registration.scope])
            //            registration.unregister().then(success => {
            //                console.log('Unregister success:', success);
            //            })
        }
    })
    caches.keys().then(names => console.log('caches names', names))
}