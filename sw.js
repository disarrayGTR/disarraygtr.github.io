// Service Worker для автоматизации игры
const CACHE_NAME = 'automation-game-v1.1';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.js',
    '/config.js',
    '/telegram-bot.js',
    '/scenes/Scene1.js',
    '/scenes/Scene2.js',
    '/scenes/Scene3.js',
    '/scenes/Scene4.js',
    '/scenes/Scene5.js',
    '/forms/leadForm.js',
    'https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js',
    'https://telegram.org/js/telegram-web-app.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('[SW] Failed to cache resources:', error);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    // Пропускаем запросы к Telegram API
    if (event.request.url.includes('api.telegram.org')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Возвращаем кеш, если есть
                if (response) {
                    return response;
                }

                // Иначе делаем сетевой запрос
                return fetch(event.request).then(response => {
                    // Проверяем валидность ответа
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Клонируем ответ для кеширования
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(error => {
                    console.error('[SW] Fetch failed:', error);
                    
                    // Возвращаем офлайн страницу для HTML запросов
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Обработка сообщений от клиента
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker loaded');
