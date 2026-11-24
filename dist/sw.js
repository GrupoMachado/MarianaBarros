// Service Worker de limpeza: desativa o cache antigo de MP4 que quebrava HTTP 206 no iOS/Safari
// e evita conflito de escopo com o OneSignalSDKWorker.js.
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .then(() => self.registration.unregister())
    );
});
