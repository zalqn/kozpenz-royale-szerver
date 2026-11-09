// admin.js – 🛡️ ADMIN PANEL (Ctrl+Shift+A) + 🧪 DEVELOPER PANEL (Ctrl+Shift+D). Csak ha a szerver /api/admin/me szerint admin vagy.
// Minden admin-művelet szerveroldalon ellenőrzött (/api/admin/*, server/mod_admin.js). Vendég soha nem látja.
// Mindenkinek: rendszerüzenet-szalag (WS adm_bc), admin pénzadás alkalmazása (adm_eco), rang (adm_rang). Debug: _adm
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = v => Math.round(+v || 0).toLocaleString('hu-HU');
  const dt = t => t ? new Date(t).toLocaleString('hu-HU') : '–';
  const bytes = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : b > 1024 ? (b / 1024).toFixed(0) + ' KB' : (b | 0) + ' B';
  const RANGN = ['Tag', 'VIP', 'VIP+', 'Elit', 'Legenda', 'Mester', 'Örökös'];
  const A = { admin: false, root: false, name: '', tok: '' };

  // ---------- hibanapló (dev panel) ----------
  const ERR = [];
  addEventListener('error', e => { ERR.push({ t: Date.now(), m: e.message, f: (e.filename || '').split('/').pop() + ':' + e.lineno }); if (ERR.length > 100) ERR.shift(); });
  addEventListener('unhandledrejection', e => { ERR.push({ t: Date.now(), m: 'Promise: ' + (e.reason && e.reason.message || e.reason), f: '' }); if (ERR.length > 100) ERR.shift(); });

  // ---------- stílus ----------
  const css = document.createElement('style');
  css.textContent = `
#admDock{position:fixed;left:10px;bottom:10px;z-index:99990;display:none;gap:6px}
#admDock button{font:700 12px system-ui;padding:7px 10px;border-radius:10px;border:1px solid #ffd23f55;background:linear-gradient(180deg,#1b2235ee,#0d1220ee);color:#ffd23f;cursor:pointer;box-shadow:0 4px 14px #0008}
#admDock button:hover{border-color:#ffd23f;filter:brightness(1.2)}
.admP{position:fixed;inset:4vh 4vw;z-index:2147483600;display:none;flex-direction:column;background:radial-gradient(ellipse at top,#1d2540f2,#090c16f7);border:1px solid #ffd23f44;border-radius:16px;box-shadow:0 20px 60px #000c,inset 0 1px 0 #ffffff14;color:#e8ecf6;font:13px/1.4 system-ui,Segoe UI,sans-serif;backdrop-filter:blur(8px)}
.admP.on{display:flex}
.admP header{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #ffffff14}
.admP header h2{margin:0;font:800 18px system-ui;letter-spacing:.5px;background:linear-gradient(90deg,#ffd23f,#ff8a3d);-webkit-background-clip:text;color:transparent}
.admP header .sp{flex:1}.admP header small{color:#8b93ab}
.admP nav{display:flex;flex-wrap:wrap;gap:4px;padding:8px 12px;border-bottom:1px solid #ffffff10}
.admP nav button{background:#ffffff0a;border:1px solid #ffffff14;color:#c7cde0;padding:6px 11px;border-radius:9px;cursor:pointer;font:600 12px system-ui}
.admP nav button.on{background:linear-gradient(180deg,#ffd23f,#e0a91a);color:#1a1300;border-color:#ffd23f}
.admP main{flex:1;overflow:auto;padding:14px 16px}
.admP button.b{background:#27304a;border:1px solid #3a4566;color:#e8ecf6;padding:6px 11px;border-radius:8px;cursor:pointer;font:600 12px system-ui;margin:2px}
.admP button.b:hover{background:#334064}.admP button.g{background:#14532d;border-color:#22c55e}.admP button.r{background:#7f1d1d;border-color:#ef4444}.admP button.y{background:#713f12;border-color:#facc15}
.admP input,.admP select,.admP textarea{background:#0b1020;border:1px solid #33405f;color:#e8ecf6;border-radius:8px;padding:6px 8px;font:13px system-ui;margin:2px}
.admP textarea{font:12px/1.4 Consolas,monospace;width:100%;box-sizing:border-box}
.admP table{width:100%;border-collapse:collapse}.admP th,.admP td{text-align:left;padding:6px 8px;border-bottom:1px solid #ffffff0d;vertical-align:top}
.admP th{color:#8b93ab;font-weight:600;font-size:11px;text-transform:uppercase;position:sticky;top:-14px;background:#11172a}
.admP tr.cl:hover td{background:#ffffff08;cursor:pointer}
.admP .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
.admP .card{background:#ffffff08;border:1px solid #ffffff12;border-radius:12px;padding:10px 12px}
.admP .card b{display:block;font-size:20px;color:#ffd23f}.admP .card span{color:#8b93ab;font-size:11px}
.admP .tag{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:700;margin-right:3px}
.admP .on1{background:#14532d;color:#86efac}.admP .bn{background:#7f1d1d;color:#fca5a5}.admP .ad{background:#713f12;color:#fde68a}.admP .mu{background:#1e3a8a;color:#93c5fd}.admP .fl{background:#581c87;color:#e9d5ff}
.admP .row{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0}
.admP .box{background:#ffffff06;border:1px solid #ffffff10;border-radius:12px;padding:10px 12px;margin:8px 0}
.admP h3{margin:4px 0 8px;font:700 14px system-ui;color:#ffd23f}
.admP pre{white-space:pre-wrap;word-break:break-all;font:11.5px/1.45 Consolas,monospace;margin:0;color:#cbd5e1}
.admP .mono{font:12px Consolas,monospace}
.admP .x{background:none;border:none;color:#8b93ab;font-size:22px;cursor:pointer}
#admMsg{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:2147483646;max-width:80vw;padding:12px 22px;border-radius:12px;background:linear-gradient(90deg,#7c2d12,#b45309);color:#fff;font:700 15px system-ui;box-shadow:0 8px 30px #000a;border:1px solid #fbbf24;display:none;text-align:center}
#admToast{position:fixed;right:16px;bottom:16px;z-index:2147483647;padding:9px 14px;border-radius:10px;background:#111827f0;color:#fde68a;border:1px solid #ffd23f66;font:600 13px system-ui;display:none}
`;
  document.head.appendChild(css);

  // ---------- segédek ----------
  function toast(t) { let d = $('#admToast'); if (!d) { d = document.createElement('div'); d.id = 'admToast'; document.body.appendChild(d); } d.textContent = t; d.style.display = 'block'; clearTimeout(d._t); d._t = setTimeout(() => d.style.display = 'none', 3200); }
  function banner(t) { let d = $('#admMsg'); if (!d) { d = document.createElement('div'); d.id = 'admMsg'; document.body.appendChild(d); d.onclick = () => d.style.display = 'none'; } d.textContent = '📢 ' + t; d.style.display = 'block'; clearTimeout(d._t); d._t = setTimeout(() => d.style.display = 'none', 12000); }
  const tok = () => (window.ACC && ACC.token) || localStorage.getItem('ry_token') || '';
  async function api(p, b) {
    const r = await fetch(p, { method: b ? 'POST' : 'GET', headers: Object.assign({ Authorization: 'Bearer ' + tok() }, b ? { 'Content-Type': 'application/json' } : {}), body: b ? JSON.stringify(b) : undefined });
    let j = {}; try { j = await r.json(); } catch (e) {}
    if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status));
    return j;
  }
  const act = async (p, b, ok) => { try { const r = await api(p, b); toast('✅ ' + (ok || 'Kész')); return r; } catch (e) { toast('⛔ ' + e.message); return null; } };

  function mkPanel(id, title, tabs) {
    const P = document.createElement('div'); P.className = 'admP'; P.id = id;
    P.innerHTML = '<header><h2>' + title + '</h2><small class="who"></small><span class="sp"></span><small>Esc = bezár</small><button class="x" title="Bezár">✖</button></header><nav>' +
      tabs.map(([k, l]) => '<button data-k="' + k + '">' + l + '</button>').join('') + '</nav><main></main>';
    document.body.appendChild(P);
    P.querySelector('.x').onclick = () => close(P);
    P.addEventListener('keydown', e => { if (e.key !== 'Escape') e.stopPropagation(); }, false);
    ['keyup', 'keypress'].forEach(ev => P.addEventListener(ev, e => e.stopPropagation()));
    return P;
  }
  function open(P) { if (!A.admin) return; P.classList.add('on'); P.querySelector('.who').textContent = '· ' + A.name + (A.root ? ' (fő admin)' : ''); try { document.pointerLockElement && document.exitPointerLock(); } catch (e) {} }
  function close(P) { P.classList.remove('on'); clearInterval(P._iv); }
  function tabs(P, render) {
    const nav = P.querySelector('nav'); nav.onclick = e => { const b = e.target.closest('button'); if (!b) return; go(b.dataset.k); };
    function go(k) { clearInterval(P._iv); nav.querySelectorAll('button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); P._k = k; const m = P.querySelector('main'); m.onclick = null; m.innerHTML = '<i style="color:#8b93ab">Betöltés…</i>'; render(k, m); }
    P._go = go; return go;
  }

  // ======================= ADMIN PANEL =======================
  const AP = mkPanel('admPanel', '🛡️ ADMIN PANEL', [['ov', '📊 Áttekintés'], ['pl', '👥 Játékosok'], ['on', '🟢 Online'], ['bc', '📢 Rendszerüzenet'], ['pr', '🎟️ Promókódok'], ['cp', '🎰 Kaszinó+ piac'], ['lg', '📜 Admin-napló'], ['cl', '🐞 Kliens-hibák'], ['bk', '💾 Mentés']]);
  let selUser = null;
  const aGo = tabs(AP, async (k, m) => {
    try {
      if (k === 'ov') {
        const draw = async () => { const s = await api('/api/admin/stats'); m.innerHTML = '<div class="cards">' + [
          ['Felhasználók', fmt(s.users)], ['Online most', fmt(s.online)], ['Aktív 24 órában', fmt(s.day)], ['Adminok', s.admins], ['Kitiltva', s.banned],
          ['Memória (RSS)', bytes(s.rss)], ['Heap', bytes(s.heap)], ['Üzemidő', Math.floor(s.uptime / 3600) + ' ó ' + Math.floor(s.uptime % 3600 / 60) + ' p'],
          ['SQL adatbázis', bytes(s.dbSize)], ['users.json', bytes(s.jsonSize)], ['Tároló', s.sql ? 'SQLite' : 'JSON'], ['Node', s.node]
        ].map(([a, b]) => '<div class="card"><span>' + a + '</span><b>' + esc(b) + '</b></div>').join('') + '</div><p style="color:#8b93ab">Frissül 5 mp-enként · PID ' + s.pid + '</p>'; };
        await draw(); AP._iv = setInterval(() => AP._k === 'ov' && AP.classList.contains('on') && draw().catch(() => {}), 5000);
      }
      if (k === 'pl') {
        m.innerHTML = '<div class="row"><input id="aQ" placeholder="🔎 Név keresése…" style="width:220px"><select id="aF"><option value="">Mind</option><option value="online">Online</option><option value="ban">Kitiltott</option><option value="admin">Admin</option><option value="flag">Gyanús (mbFlags)</option></select><span id="aN" style="color:#8b93ab"></span></div><div id="aL"></div><div id="aU"></div>';
        const load = async () => { const r = await api('/api/admin/users?q=' + encodeURIComponent($('#aQ', m).value) + '&f=' + $('#aF', m).value); $('#aN', m).textContent = r.total + ' találat';
          $('#aL', m).innerHTML = '<table><tr><th>Név</th><th>Szint</th><th>Rang</th><th>Utolsó belépés</th><th>Állapot</th></tr>' + r.list.map(u => '<tr class="cl" data-n="' + esc(u.name) + '"><td><b>' + esc(u.name) + '</b></td><td>' + u.level + '</td><td>' + esc(u.rangN) + '</td><td>' + dt(u.lastLogin) + '</td><td>' + tagsOf(u) + '</td></tr>').join('') + '</table>'; };
        let qt; $('#aQ', m).oninput = () => { clearTimeout(qt); qt = setTimeout(load, 250); }; $('#aF', m).onchange = load;
        $('#aL', m).onclick = e => { const tr = e.target.closest('tr[data-n]'); if (tr) showUser(tr.dataset.n, $('#aU', m)); };
        await load(); if (selUser) showUser(selUser, $('#aU', m));
      }
      if (k === 'on') {
        const draw = async () => { const r = await api('/api/admin/online'); m.innerHTML = '<h3>🟢 Online játékosok (' + r.list.length + ')</h3><table><tr><th>Név</th><th>Állapot</th><th>Szint</th><th>Rang</th><th>Parti</th><th>Teakert</th><th></th></tr>' + r.list.map(u => '<tr><td><b>' + esc(u.name) + '</b>' + (u.admin ? ' <span class="tag ad">admin</span>' : '') + '</td><td>' + esc(u.status) + '</td><td>' + u.level + '</td><td>' + RANGN[u.rang] + '</td><td>' + (u.party ? '✔' : '') + '</td><td>' + (u.cs ? '🫖' : '') + '</td><td><button class="b" data-p="' + esc(u.name) + '">Profil</button><button class="b r" data-kick="' + esc(u.name) + '">Kidob</button></td></tr>').join('') + '</table>'; };
        m.onclick = async e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.p) { selUser = b.dataset.p; aGo('pl'); } if (b.dataset.kick && confirm('Kidobod: ' + b.dataset.kick + '?')) { await act('/api/admin/kick', { name: b.dataset.kick }, 'Kidobva'); draw(); } };
        await draw(); AP._iv = setInterval(() => AP._k === 'on' && draw().catch(() => {}), 5000);
      }
      if (k === 'bc') {
        m.innerHTML = '<h3>📢 Rendszerüzenet minden online kliensnek</h3><textarea id="aBc" rows="3" maxlength="300" placeholder="pl. 5 perc múlva szerver-újraindítás!"></textarea><div class="row"><button class="b y" id="aBcS">📢 Küldés mindenkinek</button><span style="color:#8b93ab">Felül szalagként + a chatben „RENDSZER” üzenetként jelenik meg.</span></div>';
        $('#aBcS', m).onclick = async () => { const t = $('#aBc', m).value.trim(); if (!t) return; const r = await act('/api/admin/broadcast', { text: t }, 'Elküldve'); if (r) { toast('✅ Elküldve ' + r.sent + ' kliensnek'); $('#aBc', m).value = ''; } };
      }
      if (k === 'pr') {
        const draw = async () => { const r = await api('/api/admin/promos'); m.innerHTML = '<h3>🎟️ Promókódok</h3><div class="row"><input id="aPc" placeholder="új kód (kisbetű, szám, _)"><button class="b g" id="aPa">➕ Létrehozás</button></div><table><tr><th>Kód</th><th>Készítő</th><th>Beváltás</th><th>Létrehozva</th><th></th></tr>' + r.list.sort((a, b) => b.t - a.t).map(p => '<tr><td class="mono"><b>' + esc(p.code) + '</b>' + (p.adm ? ' <span class="tag ad">admin</span>' : '') + '</td><td>' + esc(p.by || 'rendszer') + '</td><td>' + p.uses + '</td><td>' + dt(p.t) + '</td><td><button class="b y" data-rs="' + esc(p.code) + '">Nullázás</button><button class="b r" data-del="' + esc(p.code) + '">Törlés</button></td></tr>').join('') + '</table>'; };
        m.onclick = async e => { const b = e.target.closest('button'); if (!b) return;
          if (b.id === 'aPa') { await act('/api/admin/promo', { act: 'add', code: $('#aPc', m).value }, 'Kód létrehozva'); draw(); }
          if (b.dataset.del && confirm('Törlöd a kódot: ' + b.dataset.del + '?')) { await act('/api/admin/promo', { act: 'del', code: b.dataset.del }, 'Törölve'); draw(); }
          if (b.dataset.rs && confirm('Nullázod a beváltásokat (mindenki újra beválthatja)?')) { await act('/api/admin/promo', { act: 'reset', code: b.dataset.rs }, 'Nullázva'); draw(); } };
        await draw();
      }
      if (k === 'lg') { const r = await api('/api/admin/log'); m.innerHTML = '<h3>📜 Admin-napló (utolsó 200)</h3><table><tr><th>Idő</th><th>Admin</th><th>Művelet</th><th>Cél</th><th>Részlet</th></tr>' + r.list.map(l => '<tr><td>' + dt(l.t) + '</td><td>' + esc(l.by) + '</td><td><span class="tag ad">' + esc(l.act) + '</span></td><td>' + esc(l.target) + '</td><td>' + esc(l.info) + '</td></tr>').join('') + '</table>' + (r.list.length ? '' : '<i>Még üres.</i>'); }
      if (k === 'cl') { const r = await api('/api/admin/clientlog'); m.innerHTML = '<div class="row"><h3 style="margin:0">🐞 client.log (legújabb felül, max 200)</h3><input id="aClQ" placeholder="szűrés…"></div><div class="box"><pre id="aClP"></pre></div>';
        const f = () => { const q = $('#aClQ', m).value.toLowerCase(); $('#aClP', m).textContent = r.lines.filter(l => !q || l.toLowerCase().includes(q)).join('\n') || '(üres)'; }; $('#aClQ', m).oninput = f; f(); }
      if (k === 'cp') { // Kaszinó+ piac moderálás (server/mod_cplus.js)
        const KN = { stock: '📈', coin: '💠', veh: '🚗', parcel: '🏠', zs: '🪙', ft: '💵', skin: '🎁' };
        const draw = async () => { const r = await api('/api/admin/cp/ov'); const it = o => (KN[o.kind] || '') + ' ' + esc(o.kind) + ':' + esc(o.item) + ' ×' + o.qty;
          m.innerHTML = '<div class="cards">' + [['Tranzakció 24 óra', fmt(r.tx24)], ['Bevétel-forgalom 24 óra (Ft)', fmt(r.vol24)], ['Nyitott ajánlat', r.offers.length], ['Futó aukció', r.auctions.length], ['Eladott telek', r.owned]].map(([a, b]) => '<div class="card"><span>' + a + '</span><b>' + esc(b) + '</b></div>').join('') + '</div>' +
          '<div class="box"><h3>🏷️ Nyitott ajánlatok</h3><table><tr><th>#</th><th>Eladó</th><th>Áru</th><th>Ár</th><th>Címzett</th><th></th></tr>' + r.offers.map(o => '<tr><td>' + o.id + '</td><td>' + esc(o.seller) + '</td><td>' + it(o) + '</td><td>' + fmt(o.price) + ' ' + o.cur + '</td><td>' + esc(o.target || '–') + '</td><td><button class="b r" data-cx="offer:' + o.id + '">Törlés + visszaadás</button></td></tr>').join('') + '</table></div>' +
          '<div class="box"><h3>🔨 Futó aukciók</h3><table><tr><th>#</th><th>Eladó</th><th>Áru</th><th>Licit</th><th>Vezet</th><th>Lejár</th><th></th></tr>' + r.auctions.map(a => '<tr><td>' + a.id + '</td><td>' + esc(a.seller) + '</td><td>' + it(a) + '</td><td>' + fmt(a.top || a.start) + ' ' + a.cur + '</td><td>' + esc(a.topUser || '–') + '</td><td>' + new Date(a.ends).toLocaleString('hu-HU') + '</td><td><button class="b r" data-cx="auct:' + a.id + '">Törlés + visszatérítés</button></td></tr>').join('') + '</table></div>' +
          '<div class="box"><h3>📜 Tranzakciós napló (utolsó 200)</h3><input id="aCpF" placeholder="szűrés (név, művelet)…"><table id="aCpL"><tr><th>Idő</th><th>Fiók</th><th>Partner</th><th>Művelet</th><th>Tétel</th><th>Összeg</th><th>Info</th></tr>' + r.log.map(l => '<tr><td class="mono">' + new Date(l.t).toLocaleString('hu-HU') + '</td><td>' + esc(l.user) + '</td><td>' + esc(l.other) + '</td><td>' + esc(l.act) + '</td><td>' + esc(l.kind) + ':' + esc(l.item) + ' ×' + l.qty + '</td><td>' + fmt(l.amt) + ' ' + esc(l.cur) + '</td><td>' + esc(l.info) + '</td></tr>').join('') + '</table></div>';
          const f = m.querySelector('#aCpF'); f.oninput = () => { const q = f.value.toLowerCase(); m.querySelectorAll('#aCpL tr').forEach((tr, i) => { if (i) tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none'; }); };
          m.querySelectorAll('[data-cx]').forEach(b => b.onclick = async () => { const [type, id] = b.dataset.cx.split(':'); if (!confirm('Biztosan törlöd (#' + id + ')? Az áru/letét visszakerül a tulajdonoshoz.')) return; if (await act('/api/admin/cp/cancel', { type, id: +id }, 'Törölve, visszaadva')) draw(); }); };
        await draw();
      }
      if (k === 'bk') { m.innerHTML = '<h3>💾 Biztonsági mentés</h3><p>users.json-pillanatkép + SQLite VACUUM INTO a <span class="mono">server/backup/</span> mappába (users_admin_*.json, kozpenz_admin_*.db).</p><button class="b g" id="aBk">💾 Mentés indítása most</button><div id="aBkR"></div>';
        $('#aBk', m).onclick = async () => { const r = await act('/api/admin/backup', {}, 'Mentés kész'); if (r) $('#aBkR', m).innerHTML = '<div class="box mono">' + r.files.map(esc).join('<br>') + '</div>'; }; }
    } catch (e) { m.innerHTML = '<p style="color:#fca5a5">⛔ ' + esc(e.message) + '</p>'; }
  });
  function tagsOf(u) { return (u.online ? '<span class="tag on1">online</span>' : '') + (u.admin ? '<span class="tag ad">admin</span>' : '') + (u.ban ? '<span class="tag bn">kitiltva</span>' : '') + (u.muteT ? '<span class="tag mu">némítva</span>' : '') + (u.flags ? '<span class="tag fl">⚠ ' + u.flags + '</span>' : ''); }
  async function showUser(n, el) {
    selUser = n; let u; try { u = await api('/api/admin/user?n=' + encodeURIComponent(n)); } catch (e) { el.innerHTML = '<p style="color:#fca5a5">' + esc(e.message) + '</p>'; return; }
    const s = u.save;
    el.innerHTML = '<div class="box"><div class="row"><h3 style="margin:0">👤 ' + esc(u.name) + '</h3>' + tagsOf(u) + '</div>' +
      '<div class="cards" style="margin:8px 0">' + [['Fiókszint', u.level], ['Rang', u.rangN], ['Ft (felhő)', fmt(s.ft)], ['Zseton (felhő)', fmt(s.zs)], ['Játék-szint', s.lv || '–'], ['Utolsó belépés', dt(u.lastLogin)], ['Regisztrált', dt(u.created)], ['Felhőmentés', s.t ? dt(s.t) + ' · ' + bytes(s.size) : 'nincs'], ['Meccs / győz. / kiesés', (u.stats.games || 0) + ' / ' + (u.stats.wins || 0) + ' / ' + (u.stats.kills || 0)], ['RP', u.mbRp]]
        .map(([a, b]) => '<div class="card"><span>' + a + '</span><b style="font-size:15px">' + esc(b) + '</b></div>').join('') + '</div>' +
      (u.ban ? '<p style="color:#fca5a5">⛔ Kitiltva: ' + esc(u.ban.r) + ' · lejár: ' + (u.ban.until ? dt(u.ban.until) : 'soha') + ' · ' + esc(u.ban.by) + '</p>' : '') +
      (u.muteT ? '<p style="color:#93c5fd">🔇 Némítva eddig: ' + dt(u.muteT) + '</p>' : '') +
      '<h3>💵 Pénz / zseton (+ ad, − elvesz)</h3><div class="row"><input id="uFt" type="number" placeholder="Ft" style="width:130px"><input id="uZs" type="number" placeholder="zseton" style="width:110px"><button class="b g" data-a="eco">Alkalmaz</button></div>' +
      '<h3>🏅 Rang</h3><div class="row"><select id="uR">' + RANGN.map((r, i) => '<option value="' + i + '"' + (i === u.rang ? ' selected' : '') + '>' + r + '</option>').join('') + '</select><button class="b" data-a="rang">Beállít</button></div>' +
      '<h3>🔇 Némítás / ⛔ kitiltás</h3><div class="row"><input id="uMin" type="number" value="60" style="width:80px">perc<button class="b" data-a="mute">Némít</button><button class="b" data-a="unmute">Feloldás</button></div>' +
      '<div class="row"><input id="uBr" placeholder="Kitiltás oka" style="width:240px"><input id="uBh" type="number" value="24" style="width:80px">óra (0 = végleges)<button class="b r" data-a="ban">Kitilt</button><button class="b g" data-a="unban">Feloldás</button>' + (u.online ? '<button class="b y" data-a="kick">Kidob</button>' : '') + '</div>' +
      '<h3>🛡️ Admin jog</h3><div class="row">' + (u.admin ? '<button class="b r" data-a="adm0">Admin jog elvétele</button>' : '<button class="b y" data-a="adm1">Admin jog adása</button>') + '</div>' +
      '<h3>⚠ Pénz-gyanú (mbFlags: ' + u.mbFlags.length + ')</h3>' + (u.mbFlags.length ? '<pre>' + esc(u.mbFlags.map(f => dt(f.t) + '  ΔFt ' + fmt(f.dc || 0) + '  Δzs ' + fmt(f.dz || 0)).join('\n')) + '</pre><button class="b" data-a="clr">Jelzések törlése</button>' : '<i style="color:#8b93ab">nincs</i>') +
      '<h3>Egyéb</h3><pre>Barátok: ' + esc(u.friends.join(', ') || '–') + '\nBeváltott promók: ' + esc(u.promoUsed.join(', ') || '–') + '\nRang-napló: ' + esc(u.rangLog.map(r => RANGN[r.r] + '(' + r.how + ')').join(' → ') || '–') + '</pre></div>';
    el.onclick = async e => {
      const b = e.target.closest('button[data-a]'); if (!b) return; const a = b.dataset.a, nm = u.name; let r = null;
      if (a === 'eco') { const ft = +$('#uFt', el).value || 0, zs = +$('#uZs', el).value || 0; if (!ft && !zs) return; if (!confirm(nm + ': ' + fmt(ft) + ' Ft, ' + fmt(zs) + ' zseton?')) return; r = await act('/api/admin/eco', { name: nm, ft, zs }, 'Egyenleg módosítva'); }
      if (a === 'rang') r = await act('/api/admin/rang', { name: nm, r: +$('#uR', el).value }, 'Rang beállítva');
      if (a === 'mute') r = await act('/api/admin/mute', { name: nm, min: +$('#uMin', el).value || 60 }, 'Némítva');
      if (a === 'unmute') r = await act('/api/admin/mute', { name: nm, min: 0 }, 'Némítás feloldva');
      if (a === 'ban') { if (!confirm('Kitiltod: ' + nm + '?')) return; r = await act('/api/admin/ban', { name: nm, r: $('#uBr', el).value, hours: +$('#uBh', el).value || 0 }, 'Kitiltva'); }
      if (a === 'unban') r = await act('/api/admin/ban', { name: nm, off: true }, 'Kitiltás feloldva');
      if (a === 'kick') r = await act('/api/admin/kick', { name: nm }, 'Kidobva');
      if (a === 'adm1') { if (!confirm(nm + ' admin jogot kap?')) return; r = await act('/api/admin/setadmin', { name: nm, on: true }, 'Admin jog megadva'); }
      if (a === 'adm0') r = await act('/api/admin/setadmin', { name: nm, on: false }, 'Admin jog elvéve');
      if (a === 'clr') r = await act('/api/admin/clearflags', { name: nm }, 'Jelzések törölve');
      if (r) showUser(nm, el);
    };
  }

  // ======================= DEVELOPER PANEL =======================
  const DP = mkPanel('admDev', '🧪 DEVELOPER PANEL', [['pf', '📈 Teljesítmény'], ['st', '🎮 Állapot & csalások'], ['ls', '🗄️ localStorage'], ['cn', '⌨️ Konzol'], ['md', '📦 Modulok'], ['er', '🐞 Hibák'], ['qk', '⚡ Gyors tesztek']]);
  let fps = 0, fr = 0, fl = performance.now();
  (function loop() { fr++; const t = performance.now(); if (t - fl >= 1000) { fps = fr * 1000 / (t - fl); fr = 0; fl = t; } requestAnimationFrame(loop); })();
  const gG = () => { try { return typeof G !== 'undefined' ? G : null; } catch (e) { return null; } };
  const xc = c => { try { const r = (window.zalqnCheat && zalqnCheat(c)) ?? (window.extraCmd && extraCmd(c)); toast(r == null ? '⚠ Nincs válasz: ' + c : String(r)); } catch (e) { toast('⛔ ' + e.message); } };
  const conHist = [];
  tabs(DP, (k, m) => {
    if (k === 'pf') {
      const draw = () => { let ri = {}, R = null, SC = null; try { R = typeof ren !== 'undefined' && ren && ren.info ? ren : (window.LB3D && LB3D.r); SC = typeof scene !== 'undefined' && scene && gG() && gG().en ? scene : (window.LB3D && LB3D.sc); ri = (R && R.info) || {}; } catch (e) {} const me = performance.memory || {};
        m.innerHTML = '<div class="cards">' + [['FPS', fps.toFixed(1)], ['Draw call', ri.render ? ri.render.calls : '–'], ['Háromszög', ri.render ? fmt(ri.render.triangles) : '–'], ['Geometriák', ri.memory ? ri.memory.geometries : '–'], ['Textúrák', ri.memory ? ri.memory.textures : '–'], ['Programok', ri.programs ? ri.programs.length : '–'],
          ['JS heap', me.usedJSHeapSize ? bytes(me.usedJSHeapSize) : '–'], ['Heap limit', me.jsHeapSizeLimit ? bytes(me.jsHeapSizeLimit) : '–'], ['DOM elemek', document.getElementsByTagName('*').length], ['Képernyő', innerWidth + '×' + innerHeight + ' @' + devicePixelRatio], ['Jelenet objektumok', (() => { let n = 0; try { SC.traverse(() => n++); } catch (e) { return '–'; } return n; })()], ['Scriptek', document.scripts.length], ['Renderer', R ? (R === (window.LB3D && LB3D.r) ? 'lobby (LB3D.r)' : 'meccs (ren)') : '–']]
          .map(([a, b]) => '<div class="card"><span>' + a + '</span><b>' + esc(b) + '</b></div>').join('') + '</div><p style="color:#8b93ab">Frissül 1 mp-enként (ren.info, performance.memory).</p>'; };
      draw(); DP._iv = setInterval(() => DP.classList.contains('on') && draw(), 1000);
    }
    if (k === 'st') {
      const draw = () => { const g = gG(); const inM = !!(g && g.en && g.phase);
        let h = '<div class="box"><h3>🎮 G állapot</h3>' + (inM ? '<div class="cards">' + [['Fázis', g.phase], ['HP', Math.round(g.hp) + ' / ' + g.mhp], ['Pajzs', Math.round(g.sh || 0) + ' / ' + g.msh], ['Pozíció', (+g.x).toFixed(1) + ', ' + (+g.y).toFixed(1) + ', ' + (+g.z).toFixed(1)], ['Ellenfelek', g.en.filter(e => !e.dead && e.hp > 0).length + ' / ' + g.en.length], ['Kiesések', g.kills], ['Meccspénz', fmt(g.cash)], ['God', g.god ? 'BE' : 'KI']].map(([a, b]) => '<div class="card"><span>' + a + '</span><b style="font-size:15px">' + esc(b) + '</b></div>').join('') + '</div>' : '<i style="color:#8b93ab">Nincs futó meccs (G üres). A meccs-parancsok csak meccsben működnek.</i>') + '</div>';
        h += '<div class="box"><h3>🧭 Teleport</h3><div class="row">x <input id="dTx" type="number" style="width:90px" value="' + (inM ? Math.round(g.x) : 0) + '"> z <input id="dTz" type="number" style="width:90px" value="' + (inM ? Math.round(g.z) : 0) + '"><button class="b" data-c="tp">Teleport</button><button class="b" data-c="tpe">Legközelebbi ellenfélhez</button></div></div>';
        h += '<div class="box"><h3>🛠️ Parancsok</h3><div class="row"><button class="b y" data-x="god">God mód</button><button class="b" data-c="heal">Teljes gyógyítás</button><button class="b" data-x="spawn 3">Spawn 3 bot</button><button class="b" data-x="fly">Repülés (/fly)</button><button class="b" data-x="fps">FPS kijelző</button><button class="b" data-c="add">Tárgy-panel</button></div>' +
          '<div class="row">Idő: <button class="b" data-x="time nap">☀️ Nap</button><button class="b" data-x="time éj">🌙 Éj</button> Időjárás: <button class="b" data-x="weather eső">🌧️ Eső</button><button class="b" data-x="weather tiszta">🌤️ Tiszta</button></div>' +
          '<div class="row">Pénz (helyi): <input id="dFt" type="number" value="100000" style="width:120px"><button class="b g" data-c="ft">+ Ft</button><input id="dZs" type="number" value="500" style="width:90px"><button class="b g" data-c="zs">+ zseton</button><span style="color:#8b93ab">Egyenleg: ' + (typeof S !== 'undefined' ? fmt(S.c) : '–') + ' Ft · ' + (window.BR ? fmt(BR.zs) : '–') + ' zs</span></div></div>';
        m.innerHTML = h; };
      m.onclick = e => { const b = e.target.closest('button'); if (!b) return; const g = gG();
        if (b.dataset.x) { if (b.dataset.x === 'fly' && typeof DEV !== 'undefined' && !DEV) xc('developer'); xc(b.dataset.x); }
        const c = b.dataset.c;
        if (c === 'tp' && g && g.en) { g.x = +$('#dTx', m).value; g.z = +$('#dTz', m).value; g.vy = 0; toast('🧭 Teleport'); }
        if (c === 'tpe' && g && g.en) { const e2 = g.en.filter(e => !e.dead && e.hp > 0 && e.m).sort((a, b) => Math.hypot(a.m.position.x - g.x, a.m.position.z - g.z) - Math.hypot(b.m.position.x - g.x, b.m.position.z - g.z))[0]; if (e2) { g.x = e2.m.position.x + 4; g.z = e2.m.position.z + 4; toast('🧭 Ellenfél mellett'); } else toast('Nincs ellenfél'); }
        if (c === 'heal' && g && g.en) { g.hp = g.mhp; g.sh = g.msh; toast('❤️ Feltöltve'); }
        if (c === 'add') { if (window.addPanel) { close(DP); addPanel.open(); } }
        if (c === 'ft') xc('zalqnft ' + (+$('#dFt', m).value | 0));
        if (c === 'zs') xc('zalqntoken ' + (+$('#dZs', m).value | 0));
        setTimeout(draw, 150); };
      draw(); DP._iv = setInterval(() => DP.classList.contains('on') && !m.contains(document.activeElement) && draw(), 1000);
    }
    if (k === 'ls') {
      const draw = () => { const q = ($('#dLq', m) || {}).value || 'k3'; const ks = Object.keys(localStorage).filter(x => x.toLowerCase().includes(q.toLowerCase())).sort();
        m.innerHTML = '<div class="row"><input id="dLq" value="' + esc(q) + '" placeholder="kulcs-szűrő (pl. k3)"><span style="color:#8b93ab">' + ks.length + ' kulcs · ' + bytes(ks.reduce((s, x) => s + (localStorage.getItem(x) || '').length, 0)) + '</span></div><table><tr><th>Kulcs</th><th>Méret</th><th>Érték (eleje)</th><th></th></tr>' +
          ks.map(x => { const v = localStorage.getItem(x) || ''; return '<tr><td class="mono">' + esc(x) + '</td><td>' + bytes(v.length) + '</td><td class="mono" style="max-width:420px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">' + esc(v.slice(0, 120)) + '</td><td><button class="b" data-e="' + esc(x) + '">Szerkeszt</button><button class="b r" data-d="' + esc(x) + '">Töröl</button></td></tr>'; }).join('') + '</table><div id="dLe"></div>';
        $('#dLq', m).onchange = draw; };
      m.onclick = e => { const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.d && confirm('Törlöd: ' + b.dataset.d + '?')) { localStorage.removeItem(b.dataset.d); draw(); toast('🗑️ Törölve'); }
        if (b.dataset.e) { const key = b.dataset.e; let v = localStorage.getItem(key) || ''; try { v = JSON.stringify(JSON.parse(v), null, 1); } catch (x) {}
          $('#dLe', m).innerHTML = '<div class="box"><h3 class="mono">' + esc(key) + '</h3><textarea rows="14" id="dLv"></textarea><div class="row"><button class="b g" id="dLs">💾 Mentés</button><span style="color:#8b93ab">JSON esetén tömörítve mentődik. Sok modul csak újratöltés után olvassa újra.</span></div></div>';
          $('#dLv', m).value = v; $('#dLe', m).scrollIntoView();
          $('#dLs', m).onclick = () => { let t = $('#dLv', m).value; try { t = JSON.stringify(JSON.parse(t)); } catch (x) {} localStorage.setItem(key, t); toast('💾 Mentve: ' + key); }; } };
      draw();
    }
    if (k === 'cn') {
      m.innerHTML = '<div class="box" style="max-height:52vh;overflow:auto"><pre id="dCo"></pre></div><div class="row"><input id="dCi" class="mono" style="flex:1" placeholder="JS kifejezés, pl. G.hp  ·  Enter = futtat · ↑ = előző"><button class="b g" id="dCr">▶ Futtat</button><button class="b" id="dCc">Törlés</button></div>';
      const o = $('#dCo', m), i = $('#dCi', m); let hi = conHist.length;
      const str = v => { try { if (typeof v === 'function') return v.toString().slice(0, 300); if (v && typeof v === 'object') { const seen = new WeakSet(); return JSON.stringify(v, (k2, x) => { if (x && typeof x === 'object') { if (seen.has(x)) return '[kör]'; seen.add(x); if (x.isObject3D) return '[THREE ' + x.type + ']'; } return x; }, 1).slice(0, 4000); } return String(v); } catch (e) { return String(v); } };
      const run = () => { const c = i.value.trim(); if (!c) return; conHist.push(c); hi = conHist.length; i.value = '';
        let r; try { r = (0, eval)(c); o.textContent += '› ' + c + '\n' + str(r) + '\n'; } catch (e) { o.textContent += '› ' + c + '\n⛔ ' + e + '\n'; } o.parentNode.scrollTop = 1e9; };
      $('#dCr', m).onclick = run; $('#dCc', m).onclick = () => o.textContent = '';
      i.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') run(); if (e.key === 'ArrowUp' && hi > 0) i.value = conHist[--hi]; if (e.key === 'ArrowDown' && hi < conHist.length) i.value = conHist[++hi] || ''; };
      i.focus();
    }
    if (k === 'md') {
      const sc = [...document.scripts].map(s => s.src ? s.src.split('/').pop() : '(beágyazott, ' + bytes(s.textContent.length) + ')');
      const globs = ['_kp', '_k4', '_k3', '_k2', '_dp', '_sp3', '_dl2', '_x160', '_mb', '_kD', '_kE', '_rang', '_cloud', '_lb2', '_fixA', '_a3d', '_x150', '_k3C', '_x14b', '_x14d', '_x14j', '_VS2', '_PETS'].map(g => '<span class="tag ' + (window[g] ? 'on1' : 'bn') + '">' + g + '</span>').join(' ');
      m.innerHTML = '<h3>📦 Betöltött scriptek (' + sc.length + ', betöltési sorrend)</h3><div class="box"><pre>' + sc.map((s, n) => String(n + 1).padStart(3) + '. ' + esc(s)).join('\n') + '</pre></div><h3>Debug-globálisok</h3><div class="box">' + globs + '</div>';
    }
    if (k === 'er') {
      const draw = () => { m.innerHTML = '<div class="row"><h3 style="margin:0">🐞 Hibák ebben a munkamenetben (' + ERR.length + ')</h3><button class="b" id="dEc">Törlés</button></div><div class="box"><pre>' + (ERR.slice().reverse().map(e => new Date(e.t).toLocaleTimeString('hu-HU') + '  ' + esc(e.m) + (e.f ? '  @ ' + esc(e.f) : '')).join('\n') || '(nincs hiba 🎉)') + '</pre></div><p style="color:#8b93ab">A szerverre küldött kliens-hibák: Admin panel → 🐞 Kliens-hibák.</p>'; $('#dEc', m).onclick = () => { ERR.length = 0; draw(); }; };
      draw();
    }
    if (k === 'qk') {
      const Q = [['_kp', '💦 Köpködős mód'], ['_k4', '🎰 Kaszinó 4 (Crash/Kenó)'], ['_k3', '🎰 Kaszinó lobby (_k3.lobby)'], ['_dp', '🕶️ Sötét Program'], ['_sp3', '🚐 Sötét 3D lakókocsi'], ['_dl2', '⚗️ Közpénz-labor 2.0'], ['_x160', '🏛️ Közhivatal'], ['_kE', '🧭 Lobby+'], ['_lb2', '🧭 Lobby2 panel'], ['_k2', '💥 Big win (_k2.big444)'], ['_fixA', '🆕 Mi újság? (_fixA.news)'], ['_mb', '🌐 Többjátékos']];
      m.innerHTML = '<h3>⚡ Gyors megnyitás</h3><div class="row">' + Q.map(([g, l]) => '<button class="b" data-q="' + g + '"' + (window[g] ? '' : ' disabled style="opacity:.4"') + '>' + l + '</button>').join('') + '</div><p style="color:#8b93ab">A gomb a modul debug-függvényét hívja (ha függvény), különben a megfelelő metódusát / kiírja a konzolra.</p><div class="box"><pre id="dQo"></pre></div>';
      m.onclick = e => { const b = e.target.closest('button[data-q]'); if (!b) return; const g = b.dataset.q, o = window[g]; let r;
        try { close(DP);
          if (g === '_k3' && o.lobby) r = o.lobby(); else if (g === '_k2' && o.big444) r = o.big444(); else if (g === '_fixA' && o.news) r = o.news(); else if (g === '_lb2' && o.open) r = o.open('play'); else if (g === '_x160' && o.open) r = o.open();
          else if (typeof o === 'function') r = o(); else if (o && typeof o.open === 'function') r = o.open(); else { open(DP); $('#dQo', m).textContent = g + ' = ' + Object.keys(o || {}).join(', '); }
        } catch (x) { open(DP); $('#dQo', m).textContent = '⛔ ' + x; } };
    }
  });

  // ---------- gomb + billentyűk ----------
  const BTN = document.createElement('div'); BTN.id = 'admDock';
  BTN.innerHTML = '<button id="admBA" title="Admin panel (Ctrl+Shift+A)">🛡️ Admin</button><button id="admBD" title="Developer panel (Ctrl+Shift+D)">🧪 Dev</button>';
  document.body.appendChild(BTN);
  $('#admBA').onclick = () => { open(AP); if (!AP._k) aGo('ov'); else AP._go(AP._k); };
  $('#admBD').onclick = () => { open(DP); DP._go(DP._k || 'pf'); };
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { for (const P of [AP, DP]) if (P.classList.contains('on')) { close(P); e.stopImmediatePropagation(); e.preventDefault(); return; } }
    if (!A.admin || !e.ctrlKey || !e.shiftKey) return;
    const k = (e.key || '').toLowerCase();
    if (k === 'a') { e.preventDefault(); e.stopImmediatePropagation(); AP.classList.contains('on') ? close(AP) : $('#admBA').click(); }
    if (k === 'd') { e.preventDefault(); e.stopImmediatePropagation(); DP.classList.contains('on') ? close(DP) : $('#admBD').click(); }
  }, true);

  // ---------- jogosultság ellenőrzés (szerver dönt) ----------
  function setAdmin(on, info) {
    A.admin = !!on; A.root = !!(info && info.root); A.name = info ? info.name : '';
    BTN.style.display = A.admin ? 'flex' : 'none';
    if (!A.admin) { close(AP); close(DP); }
  }
  async function check() {
    const t = tok(), guest = !window.ACC || ACC.guest || !ACC.user;
    if (guest || !t) { if (A.admin) setAdmin(false); A.tok = ''; return; }
    if (t === A.tok) return; A.tok = t;
    try { const r = await api('/api/admin/me'); setAdmin(r.admin, r); } catch (e) { setAdmin(false); }
  }
  setInterval(check, 2000); setTimeout(check, 800);

  // ---------- WS: rendszerüzenet + admin-műveletek (mindenkinek) ----------
  let hooked = null;
  setInterval(() => {
    const ws = window.ACC && ACC.ws; if (!ws || ws === hooked) return; hooked = ws;
    ws.addEventListener('message', ev => {
      let m; try { if (typeof ev.data !== 'string' || ev.data.indexOf('"adm_') < 0) return; m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.t === 'adm_bc') banner(m.text);
      if (m.t === 'adm_eco') {
        try { if (m.ft && typeof S !== 'undefined') { S.c = Math.max(0, (S.c || 0) + m.ft); try { save(); } catch (e) { localStorage.setItem('k3c', JSON.stringify(S.c)); } } } catch (e) {}
        try { if (m.zs && window.BR) { BR.zs = Math.max(0, (BR.zs | 0) + m.zs); localStorage.setItem('k3br', JSON.stringify(BR)); } } catch (e) {}
        toast('🛡️ Admin (' + m.by + '): ' + (m.ft ? fmt(m.ft) + ' Ft ' : '') + (m.zs ? fmt(m.zs) + ' zseton' : ''));
      }
      if (m.t === 'adm_rang') { try { if (window._rang && _rang.D) _rang.D.r = m.r; } catch (e) {} toast('🏅 Admin rangot állított: ' + RANGN[m.r]); }
    });
  }, 1500);


  // ---------- dev-parancsok (pénz-cheat, /developer, /444) csak adminnak ----------
  const DEVCMD = /^\/?(zalqntoken|zalqnft|developer|dev|444)\b/i;
  let gated = null;
  function gateDev() { const f = window.zalqnCheat; if (!f || f === gated) return; const inner = f; gated = function (c) { if (!A.admin && DEVCMD.test(String(c || '').trim())) return '⛔ Ez fejlesztői parancs – csak admin használhatja.'; return inner.apply(this, arguments); }; window.zalqnCheat = gated; }
  const DEVX = /^\/?(god|spawn|tp)\b/i; let gatedX = null;
  function gateX() { const f = window.extraCmd; if (!f || f === gatedX) return; const inner = f; gatedX = function (c) { if (!A.admin && DEVX.test(String(c || '').trim())) return '⛔ Ez fejlesztői parancs – csak admin használhatja.'; return inner.apply(this, arguments); }; window.extraCmd = gatedX; }
  setInterval(() => { gateDev(); gateX(); }, 1000); setTimeout(() => { gateDev(); gateX(); }, 0);
  window._adm = { get admin() { return A.admin; }, open: () => $('#admBA').click(), dev: () => $('#admBD').click(), check: () => { A.tok = ''; return check(); }, ERR };
})();
