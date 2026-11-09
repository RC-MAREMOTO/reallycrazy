// Service worker mínimo: rede primeiro, cache como reserva (só arquivos do próprio site).
// Não toca no login do Google/Firebase (outros domínios).
const CACHE = 'rc-jogo-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const cp = res.clone();
      caches.open(CACHE).then(c => c.put(r, cp)).catch(() => {});
      return res;
    }).catch(() => caches.match(r))
  );
});
