// ============================================================
//  CITY HUB RPG — SERVICE WORKER (PWA Cache)
//  Versão: 3.1
// ============================================================

const CACHE_NAME = 'cityhub-rpg-v3.1';
const CACHE_OFFLINE = 'cityhub-offline-v1';

// Recursos para cache imediato (app shell)
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Google Fonts (serão cacheadas na primeira visita)
];

// Recursos externos (CDN Fonts) — cache on fetch
const CACHE_ON_FETCH = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.habbo.com.br/habbo-imaging',
];

// ── INSTALL: cacheia o app shell ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Cacheando app shell...');
      return cache.addAll(SHELL_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpa caches antigas ───────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== CACHE_OFFLINE)
            .map(k => { console.log('[SW] Removendo cache antiga:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: estratégia híbrida ─────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API do Habbo — Network First (dados sempre frescos)
  if (url.hostname === 'www.habbo.com.br' && url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Avatares Habbo — Cache First com fallback (imagens pixel art)
  if (url.hostname === 'www.habbo.com.br' && url.pathname.includes('avatarimage')) {
    event.respondWith(cacheFirst(event.request, 60 * 60 * 24)); // 24h
    return;
  }

  // Thumbnails YouTube — Cache First
  if (url.hostname === 'img.youtube.com') {
    event.respondWith(cacheFirst(event.request, 60 * 60 * 12)); // 12h
    return;
  }

  // Google Fonts — Cache First (raramente mudam)
  if (CACHE_ON_FETCH.some(d => url.hostname.includes(d.split('/')[0]))) {
    event.respondWith(cacheFirst(event.request, 60 * 60 * 24 * 30)); // 30 dias
    return;
  }

  // App shell (index.html, manifest, icons) — Stale While Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  // Demais requisições — Network com fallback para cache
  event.respondWith(networkFirst(event.request));
});

// ── Estratégias de cache ──────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlinePage();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || await fetchPromise || offlinePage();
}

async function offlinePage() {
  const cached = await caches.match('/index.html');
  return cached || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
}

// ── Mensagens do cliente ──────────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
  }
  if (event.data === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => event.source.postMessage({ type: 'CACHE_SIZE', size }));
  }
});

async function getCacheSize() {
  let total = 0;
  const keys = await caches.keys();
  for (const key of keys) {
    const cache = await caches.open(key);
    const requests = await cache.keys();
    for (const req of requests) {
      const res = await cache.match(req);
      if (res) {
        const blob = await res.blob();
        total += blob.size;
      }
    }
  }
  return total;
}
