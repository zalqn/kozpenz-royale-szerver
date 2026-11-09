// mod_admin.js – ADMIN API (/api/admin/*). Jogosultság: users rekord `admin:true` (a tokenből azonosított fiók).
// Alap-admin: "zalqn" (egyszeri migráció, meta 'adminMigr'); zalqn admin joga nem vehető el.
// Kitiltás: u.ban = {r, until(0=végleges), by, t} → sessions.get nem ad nevet (minden API + WS elutasítva), belépés 403.
// Némítás: u.mbMuteT (a mod_B chatszűrője érvényesíti). Napló: meta 'admin_log' (vagy logs/admin.json), max 500 sor.
// Bekötés: server.js-ben 1 require sor a mod_B után.
const fs = require('fs'), path = require('path');
module.exports = function (o) {
  const { server, sessions, online, save, store, send, body, saveFile, DATA } = o;
  const db = o.db; // getter
  const U = n => db().users[String(n || '').toLowerCase()];
  const now = () => Date.now();
  const ROOT_ADMIN = 'zalqn';
  const banned = u => !!(u && u.ban && (!u.ban.until || u.ban.until > now()));

  // ---- migráció: zalqn = admin ----
  try {
    const done = store && store.ok ? store.getMeta('adminMigr') : null;
    if (!done) {
      const z = U(ROOT_ADMIN); if (z && !z.admin) { z.admin = true; save(); }
      if (store && store.ok) store.setMeta('adminMigr', JSON.stringify({ t: now(), user: z ? z.name : null }));
      console.log('[mod_admin] alap-admin beállítva:', z ? z.name : '(nincs zalqn fiók)');
    } else { const z = U(ROOT_ADMIN); if (z && !z.admin) { z.admin = true; save(); } }
  } catch (e) { console.log('[mod_admin] migráció hiba', e.message); }

  // ---- munkamenet-horog: kitiltott fiók tokenje érvénytelen; utolsó belépés ----
  const sGet = sessions.get.bind(sessions), sSet = sessions.set.bind(sessions);
  sessions.get = t => { const n = sGet(t); if (!n) return n; const u = U(n); if (banned(u)) { sessions.delete(t); return undefined; } return n; };
  sessions.set = (t, n) => { const u = U(n); if (u) { u.lastLogin = now(); save(); } return sSet(t, n); };

  // ---- napló ----
  const LOGF = path.join(DATA, 'logs', 'admin.json');
  let alog = [];
  try { alog = JSON.parse((store && store.ok && store.getMeta('admin_log')) || (fs.existsSync(LOGF) ? fs.readFileSync(LOGF, 'utf8') : '[]')) || []; } catch (e) { alog = []; }
  function log(by, act, target, info) {
    alog.push({ t: now(), by, act, target: target || '', info: info || '' }); if (alog.length > 500) alog = alog.slice(-500);
    const j = JSON.stringify(alog);
    try { if (store && store.ok) store.setMeta('admin_log', j); else { fs.mkdirSync(path.dirname(LOGF), { recursive: true }); fs.writeFileSync(LOGF, j); } } catch (e) {}
  }

  // ---- felhőmentés olvasás/írás ----
  const num = v => { const x = Number(v); return isFinite(x) ? x : 0; };
  function rdSave(u) { try { if (store && store.ok) { const j = store.readSave(u.name); return j ? JSON.parse(j) : { t: 0, d: {} }; } return JSON.parse(fs.readFileSync(saveFile(u), 'utf8')); } catch (e) { return { t: 0, d: {} }; } }
  function wrSave(u, s) { s.t = now(); if (store && store.ok) store.writeSave(u.name, JSON.stringify(s), s.t); else fs.writeFileSync(saveFile(u), JSON.stringify(s)); }
  function saveInfo(u) {
    const s = rdSave(u), d = s.d || {}; let zs = 0; try { zs = num(JSON.parse(d.k3br || '{}').zs); } catch (e) {}
    return { t: s.t || 0, ft: num(d.k3c), zs, lv: num(d.k3lv) || 0, xp: num(d.k3xp), keys: Object.keys(d).length, size: JSON.stringify(d).length };
  }
  const out = (n, m) => { const c = online.get(n); if (c) try { c.ws.readyState === 1 && c.ws.send(JSON.stringify(m)); } catch (e) {} };
  const RANGN = ['Tag', 'VIP', 'VIP+', 'Elit', 'Legenda', 'Mester', 'Örökös'];
  const pub = u => ({ name: u.name, created: u.created, level: u.level || 1, rang: u.rang | 0, rangN: RANGN[u.rang | 0] || '?', admin: !!u.admin, ban: banned(u) ? u.ban : null, muteT: (u.mbMuteT || 0) > now() ? u.mbMuteT : 0, lastLogin: u.lastLogin || 0, online: online.has(u.name), flags: (u.mbFlags || []).length, stats: u.stats || {} });

  // ---- broadcast ----
  const bcHist = [];
  function broadcast(text, by) {
    const m = { t: 'adm_bc', text, by, at: now() }; bcHist.push(m); if (bcHist.length > 20) bcHist.shift();
    online.forEach(c => { try { c.ws.readyState === 1 && (c.ws.send(JSON.stringify(m)), c.ws.send(JSON.stringify({ t: 'chat', ch: 'sys', text: '📢 RENDSZER: ' + text }))); } catch (e) {} });
  }

  // ---- statisztika ----
  const dirSize = f => { try { return fs.statSync(f).size; } catch (e) { return 0; } };
  function stats() {
    const users = Object.values(db().users), mu = process.memoryUsage();
    const dbf = store && store.file ? store.file : path.join(DATA, 'kozpenz.db');
    return { users: users.length, admins: users.filter(u => u.admin).length, banned: users.filter(banned).length, online: online.size,
      day: users.filter(u => (u.lastLogin || 0) > now() - 864e5).length, rss: mu.rss, heap: mu.heapUsed, uptime: process.uptime(),
      dbSize: dirSize(dbf) + dirSize(dbf + '-wal'), jsonSize: dirSize(path.join(DATA, 'users.json')), node: process.version, sql: !!(store && store.ok), pid: process.pid };
  }

  async function handle(req, res, url) {
    const p = url.pathname;
    const t = (req.headers.authorization || '').replace('Bearer ', ''), n = sessions.get(t), me = n ? U(n) : null;
    if (!me) return send(res, 403, { error: 'Nincs bejelentkezve / nincs admin jogod.' });
    if (!me.admin && String(me.name||'').toLowerCase() === ROOT_ADMIN) { me.admin = true; save(); }
    if (!me.admin) return send(res, 403, { error: 'Nincs admin jogod.' });
    if (p === '/api/admin/me') return send(res, 200, { admin: true, name: me.name, root: me.name.toLowerCase() === ROOT_ADMIN });
    if (p === '/api/admin/stats') return send(res, 200, stats());
    if (p === '/api/admin/users') {
      const q = (url.searchParams.get('q') || '').toLowerCase(), f = url.searchParams.get('f') || '';
      let list = Object.values(db().users).filter(u => !q || u.name.toLowerCase().includes(q));
      if (f === 'online') list = list.filter(u => online.has(u.name)); if (f === 'ban') list = list.filter(banned); if (f === 'admin') list = list.filter(u => u.admin); if (f === 'flag') list = list.filter(u => (u.mbFlags || []).length);
      list.sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0));
      return send(res, 200, { total: list.length, list: list.slice(0, 200).map(pub) });
    }
    if (p === '/api/admin/user') {
      const u = U(url.searchParams.get('n')); if (!u) return send(res, 404, { error: 'Nincs ilyen fiók.' });
      return send(res, 200, Object.assign(pub(u), { save: saveInfo(u), mbFlags: (u.mbFlags || []).slice(-20), mbRp: u.mbRp | 0, friends: u.friends || [], rangLog: (u.rangLog || []).slice(-10), promoUsed: u.promoUsed || [], eco: u.mbEco || null }));
    }
    if (p === '/api/admin/online') return send(res, 200, { list: [...online.entries()].map(([nm, c]) => { const u = U(nm) || {}; return { name: nm, status: c.status, party: c.party || null, cs: !!c.cs, rang: u.rang | 0, level: u.level || 1, admin: !!u.admin }; }) });
    if (p === '/api/admin/log') return send(res, 200, { list: alog.slice(-200).reverse() });
    if (p === '/api/admin/clientlog') {
      const f = path.join(DATA, 'logs', 'client.log'); let txt = '';
      try { const st = fs.statSync(f), len = Math.min(st.size, 64000), fd = fs.openSync(f, 'r'), b = Buffer.alloc(len); fs.readSync(fd, b, 0, len, st.size - len); fs.closeSync(fd); txt = b.toString('utf8'); } catch (e) { txt = ''; }
      return send(res, 200, { lines: txt.split('\n').filter(Boolean).slice(-200).reverse() });
    }
    if (p === '/api/admin/promos') { const pr = db().promos || {}; return send(res, 200, { list: Object.entries(pr).map(([c, v]) => ({ code: c, by: v.by, uses: (v.uses || []).length, t: v.t, off: !!v.off, adm: !!v.adm })) }); }
    if (req.method !== 'POST') return send(res, 405, { error: 'POST kell.' });
    let b; try { b = await body(req, 20000); } catch (e) { return send(res, 400, { error: 'Hibás kérés.' }); }
    const tu = b.name ? U(b.name) : null;
    const need = () => { if (!tu) { send(res, 404, { error: 'Nincs ilyen fiók.' }); return false; } return true; };
    if (p === '/api/admin/eco') { // pénz/zseton adás-elvétel (felhőmentésben + élő kliensnek)
      if (!need()) return;
      const ft = Math.round(num(b.ft)), zs = Math.round(num(b.zs));
      if (Math.abs(ft) > 1e10 || Math.abs(zs) > 1e7) return send(res, 400, { error: 'Túl nagy összeg.' });
      const s = rdSave(tu); s.d = s.d || {}; s.d.k3c = String(Math.max(0, num(s.d.k3c) + ft));
      let br = {}; try { br = JSON.parse(s.d.k3br || '{}'); } catch (e) {} br.zs = Math.max(0, num(br.zs) + zs); s.d.k3br = JSON.stringify(br);
      wrSave(tu, s);
      if (tu.mbEco) { tu.mbEco.c = Math.max(0, num(tu.mbEco.c) + ft); tu.mbEco.zs = Math.max(0, num(tu.mbEco.zs) + zs); tu.mbEco.al = num(tu.mbEco.al) + Math.max(0, ft); tu.mbEco.alz = num(tu.mbEco.alz) + Math.max(0, zs); }
      save(); out(tu.name, { t: 'adm_eco', ft, zs, by: me.name });
      log(me.name, 'eco', tu.name, (ft ? (ft > 0 ? '+' : '') + ft + ' Ft ' : '') + (zs ? (zs > 0 ? '+' : '') + zs + ' zs' : ''));
      return send(res, 200, { ok: true, save: saveInfo(tu) });
    }
    if (p === '/api/admin/rang') {
      if (!need()) return; const r = Math.max(0, Math.min(6, b.r | 0)); const old = tu.rang | 0; tu.rang = r; tu.rangT = now();
      tu.rangLog = (tu.rangLog || []).slice(-19); tu.rangLog.push({ r, how: 'admin', by: me.name, t: now() }); save();
      out(tu.name, { t: 'adm_rang', r, by: me.name }); log(me.name, 'rang', tu.name, RANGN[old] + ' → ' + RANGN[r]); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/mute') {
      if (!need()) return; const min = Math.max(0, Math.min(525600, num(b.min)));
      tu.mbMuteT = min ? now() + min * 60e3 : 0; save();
      out(tu.name, { t: 'chat', ch: 'sys', text: min ? '🔇 Egy admin ' + min + ' percre lenémított.' + (b.r ? ' Ok: ' + String(b.r).slice(0, 120) : '') : '🔊 A némításod feloldva.' });
      log(me.name, min ? 'mute' : 'unmute', tu.name, min ? min + ' perc · ' + String(b.r || '').slice(0, 120) : ''); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/ban') {
      if (!need()) return;
      if (b.off) { delete tu.ban; save(); log(me.name, 'unban', tu.name); return send(res, 200, { ok: true }); }
      if (tu.name.toLowerCase() === ROOT_ADMIN) return send(res, 400, { error: 'A fő admint nem lehet kitiltani.' });
      if (tu === me) return send(res, 400, { error: 'Magadat nem tilthatod ki.' });
      const hours = Math.max(0, num(b.hours)); const r = String(b.r || 'nincs megadva').slice(0, 200);
      tu.ban = { r, until: hours ? now() + hours * 3600e3 : 0, by: me.name, t: now() }; save();
      for (const [tk, nm] of [...sessions.entries()]) if (nm.toLowerCase() === tu.name.toLowerCase()) sessions.delete(tk);
      const c = online.get(tu.name); if (c) { try { c.ws.send(JSON.stringify({ t: 'kicked', error: '⛔ Ki lettél tiltva. Ok: ' + r })); c.ws.close(); } catch (e) {} }
      log(me.name, 'ban', tu.name, (hours ? hours + ' óra' : 'végleges') + ' · ' + r); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/kick') {
      if (!need()) return; const c = online.get(tu.name); if (!c) return send(res, 400, { error: 'Nincs online.' });
      try { c.ws.send(JSON.stringify({ t: 'kicked', error: '👢 Egy admin kidobott a lobbyból.' })); c.ws.close(); } catch (e) {}
      log(me.name, 'kick', tu.name); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/setadmin') {
      if (!need()) return; const on = !!b.on;
      if (!on && tu.name.toLowerCase() === ROOT_ADMIN) return send(res, 400, { error: 'zalqn admin jogát nem lehet elvenni.' });
      if (!on && tu === me) return send(res, 400, { error: 'A saját admin jogodat nem veheted el.' });
      if (on) tu.admin = true; else delete tu.admin; save();
      log(me.name, on ? 'admin+' : 'admin-', tu.name); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/clearflags') { if (!need()) return; tu.mbFlags = []; save(); log(me.name, 'clearflags', tu.name); return send(res, 200, { ok: true }); }
    if (p === '/api/admin/broadcast') {
      const text = String(b.text || '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, 300); if (!text) return send(res, 400, { error: 'Üres üzenet.' });
      broadcast(text, me.name); log(me.name, 'broadcast', '', text); return send(res, 200, { ok: true, sent: online.size });
    }
    if (p === '/api/admin/promo') {
      const pr = db().promos = db().promos || {}; const code = String(b.code || '').trim().toLowerCase();
      if (!/^[a-z0-9_]{3,20}$/.test(code)) return send(res, 400, { error: 'Kód: 3–20 kisbetű/szám/_.' });
      if (b.act === 'add') { if (pr[code]) return send(res, 400, { error: 'Már létezik.' }); pr[code] = { by: null, uses: [], t: now(), adm: true }; }
      else if (b.act === 'del') { if (!pr[code]) return send(res, 404, { error: 'Nincs ilyen kód.' }); delete pr[code]; }
      else if (b.act === 'reset') { if (!pr[code]) return send(res, 404, { error: 'Nincs ilyen kód.' }); pr[code].uses = []; Object.values(db().users).forEach(u => { if (u.promoUsed) u.promoUsed = u.promoUsed.filter(c => c !== code); }); }
      else return send(res, 400, { error: 'Ismeretlen művelet.' });
      save(); log(me.name, 'promo-' + b.act, code); return send(res, 200, { ok: true });
    }
    if (p === '/api/admin/backup') {
      const BKD = path.join(DATA, 'backup'); try { fs.mkdirSync(BKD, { recursive: true }); } catch (e) {}
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19), out1 = [];
      try { const f = path.join(BKD, 'users_admin_' + stamp + '.json'); fs.writeFileSync(f, JSON.stringify(db(), null, 1)); out1.push(path.basename(f)); } catch (e) {}
      if (store && store.ok) { const f = path.join(BKD, 'kozpenz_admin_' + stamp + '.db'); if (store.backup(f)) out1.push(path.basename(f)); }
      log(me.name, 'backup', '', out1.join(', ')); return send(res, 200, { ok: true, files: out1 });
    }
    return send(res, 404, { error: 'Ismeretlen admin-végpont.' });
  }

  const orig = server.listeners('request').slice();
  server.removeAllListeners('request');
  server.on('request', (req, res) => {
    const u = new URL(req.url, 'http://x');
    if (!u.pathname.startsWith('/api/admin/')) return orig.forEach(f => f.call(server, req, res));
    handle(req, res, u).catch(e => { try { send(res, 500, { error: 'Admin hiba: ' + e.message }); } catch (_) {} });
  });
  console.log('[mod_admin] admin API kész');
};
