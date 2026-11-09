// sw.js – Közpénz Royale PWA service worker (E). A szerver-API-kat (/api, /ws) SOHA nem cache-eli.
const C='kpr-v1';
const CORE=['./','./index.html','./manifest.json','./icon192.png','./icon512.png','./three.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE).catch(()=>0)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const skip=u=>u.origin!==location.origin||/^\/(api|ws)(\/|$)/.test(u.pathname)||u.pathname.includes('/server/');
self.addEventListener('message',e=>{const d=e.data||{};if(d.t==='pre'&&Array.isArray(d.urls)){caches.open(C).then(c=>Promise.all(d.urls.slice(0,400).map(x=>{try{const u=new URL(x,location.href);if(skip(u))return;return fetch(u,{cache:'no-cache'}).then(r=>r.ok&&c.put(u,r)).catch(()=>0)}catch(er){}})))}});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(skip(u))return;
 const img=/\.(jpg|jpeg|png|webp|mp3|ogg)$/i.test(u.pathname);
 if(img){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res})));return}
 // HTML/JS: hálózat elsőként (frissítések), offline → gyorsítótár
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(h=>h||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
