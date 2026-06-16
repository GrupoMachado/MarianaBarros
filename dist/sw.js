/**
 * Treina em Casa - Service Worker (Video Optimizer & Cache)
 * --------------------------------------------------------
 * 1. Intercepts Bunny.net (.mp4) requests.
 * 2. Implements a "Cache-First" strategy for videos.
 * 3. Manually handles Range Requests (HTTP 206) for Safari/iOS compatibility.
 * 4. Limits cache size to the most recent 30 videos (Eviction Policy).
 */

const CACHE_NAME = 'treinaemcasa-videos';
const MAX_VIDEOS = 30;

// Skip waiting and claim clients to ensure SW is active immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only target MP4 files from Bunny.net
    if (url.href.includes('b-cdn.net') && url.pathname.endsWith('.mp4')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cachedResponse = await cache.match(event.request.url);

                if (cachedResponse) {
                    // Check if Safari is asking for a partial chunk (Range Request)
                    const rangeHeader = event.request.headers.get('Range');
                    if (rangeHeader) {
                        return handleRangeRequest(rangeHeader, cachedResponse);
                    }
                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(event.request).then((networkResponse) => {
                    // We only cache successful responses
                    if (networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        
                        // Async: store the full video in cache and enforce limit
                        cache.put(event.request.url, responseToCache).then(() => {
                            limitCacheSize(cache);
                        });
                    }
                    return networkResponse;
                });
            })
        );
    }
});

/**
 * Specifically handles the bytes=start-end request header for Safari/iOS.
 * This is CRITICAL for video playback in the Apple ecosystem.
 */
async function handleRangeRequest(rangeHeader, cachedResponse) {
    const data = await cachedResponse.arrayBuffer();
    const byteLength = data.byteLength;

    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : byteLength - 1;

    // slice the buffer to match the range
    const chunk = data.slice(start, end + 1);

    return new Response(chunk, {
        status: 206,
        statusText: 'Partial Content',
        headers: {
            'Content-Type': 'video/mp4',
            'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${end}/${byteLength}`,
            'Content-Length': chunk.byteLength,
        }
    });
}

/**
 * Keeps the cache lean by removing the oldest entries.
 * FIFO (First-In-First-Out) logic.
 */
async function limitCacheSize(cache) {
    const keys = await cache.keys();
    if (keys.length > MAX_VIDEOS) {
        // Delete the oldest entry (the first one)
        await cache.delete(keys[0]);
        // Recurse until within limit
        limitCacheSize(cache);
    }
}
