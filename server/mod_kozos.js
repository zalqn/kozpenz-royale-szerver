// mod_kozos.js – (A, 11-09) közösség 2 + szerveroldali pénz-őr + jelszó-visszaállítás + mentés-feltöltés + teljesítmény-napló
// Bekötés: server.js 1 sor a mod_cplus után (UTOLSÓ request-réteg → elsőként fut).
//  1) DATA_DIR tartósság-figyelmeztetés      2) /api/save pénz-őr (a mod_B guard ELŐTT): szerver által ismert források
//  3) /api/reset/* jelszó-visszaállítás (SMTP_* env → e-mail, különben konzol + admin panel)
//  4) BACKUP_URL: napi kozpenz_*.db feltöltés (PUT), alapból KI
//  23) meghívó-jutalom  24) levelezés (SQL k2_mail)  25) heti közös esemény  26) kreatív verseny  29) teljesítmény-napló (SQL k2_perf)
const fs = require('fs'), path = require('path'), crypto = require('crypto'), net = require('net'), tls = require('tls'), { Readable } = require('stream');

module.exports = function (X) {
  const { server, sessions, online, save, store, send, body, saveFile, DATA } = X;
  const db = () => X.db();
  const U = n => db().users[String(n || '').toLowerCase()];
  const now = () => Date.now();
  const num = v => { const x = Number(v); return isFinite(x) ? x : 0; };
  const authN = req => { const t = (req.headers.authorization || '').replace('Bearer ', '') || new URL(req.url, 'http://x').searchParams.get('tk'); const n = sessions.get(t); return n && U(n) ? U(n) : null; };
  const isAdm = u => u && (u.admin || u.name.toLowerCase() === 'zalqn');
  const tries = new Map(); const limited = (k, max, ms) => { const t = (tries.get(k) || []).filter(x => now() - x < ms); t.push(now()); tries.set(k, t); return t.length > max; };
  const toUser = (n, o) => { const c = online && online.get(n); try { c && c.ws && c.ws.readyState === 1 && c.ws.send(JSON.stringify(o)); } catch (e) {} };
  const day = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }; // helyi dátum (mint a mod_A mentésfájl)
  const week = () => Math.floor((now() + 3 * 864e5) / (7 * 864e5)); // hétfőtől hétfőig (UTC)
  const meta = (k, d) => { try { return JSON.parse(store.getMeta(k) || 'null') || d; } catch (e) { return d; } };
  const setMeta = (k, v) => { try { store.setMeta(k, JSON.stringify(v)); } catch (e) {} };
  const SQ = store.ok ? store.sql : null;

  // ================= 1. tartós adatkönyvtár =================
  (() => {
    const mk = path.join(DATA, '.tartos_jel');
    let first = null; try { first = fs.readFileSync(mk, 'utf8'); } catch (e) { try { fs.writeFileSync(mk, new Date().toISOString()); } catch (_) {} }
    if (process.env.RENDER && !process.env.DATA_DIR) console.log('⚠️ [tartós] DATA_DIR nincs beállítva Renderen → az adatbázis minden újraindításkor/deploykor ELVESZ! (render.yaml: disk + DATA_DIR=/var/data, fizetős csomag kell)');
    else if (process.env.DATA_DIR) console.log('[tartós] adatkönyvtár:', DATA, first ? '(megvan az előző indításból: ' + first + ')' : '(ÚJ – ha ez nem az első indulás, a lemez NEM tartós!)');
  })();

  // ================= SQL táblák =================
  if (SQ) SQ.exec('CREATE TABLE IF NOT EXISTS k2_mail (id INTEGER PRIMARY KEY AUTOINCREMENT, to_k TEXT, from_n TEXT, txt TEXT, t INTEGER, rd INTEGER DEFAULT 0);' +
    'CREATE INDEX IF NOT EXISTS k2_mail_to ON k2_mail(to_k);' +
    'CREATE TABLE IF NOT EXISTS k2_perf (id INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER, n TEXT, j TEXT);');
  const Q = SQ ? {
    mIns: SQ.prepare('INSERT INTO k2_mail(to_k,from_n,txt,t) VALUES(?,?,?,?)'), mList: SQ.prepare('SELECT id,from_n,txt,t,rd FROM k2_mail WHERE to_k=? ORDER BY id DESC LIMIT 60'),
    mUnr: SQ.prepare('SELECT COUNT(*) c FROM k2_mail WHERE to_k=? AND rd=0'), mRd: SQ.prepare('UPDATE k2_mail SET rd=1 WHERE to_k=? AND (id=? OR ?=0)'),
    mDel: SQ.prepare('DELETE FROM k2_mail WHERE to_k=? AND id=?'), mCnt: SQ.prepare('SELECT COUNT(*) c FROM k2_mail WHERE to_k=?'),
    mOld: SQ.prepare('DELETE FROM k2_mail WHERE t<?'),
    pIns: SQ.prepare('INSERT INTO k2_perf(t,n,j) VALUES(?,?,?)'), pList: SQ.prepare('SELECT id,t,n,j FROM k2_perf ORDER BY id DESC LIMIT 300'),
    pTrim: SQ.prepare('DELETE FROM k2_perf WHERE id < (SELECT MAX(id) FROM k2_perf) - 1000')
  } : null;
  if (Q) { try { Q.mOld.run(now() - 180 * 864e5); } catch (e) {} }
  const sysMail = (to, txt) => { if (!Q) return; try { Q.mIns.run(String(to).toLowerCase(), '★ Rendszer', txt, now()); toUser(U(to) ? U(to).name : to, { t: 'k2_mail' }); } catch (e) {} };

  // ================= ajándék (szerver által jóváírt pénz) =================
  // u.k2gift = [{id, ft, zs, why}] → kliens lekéri, /api/k2/claim → a szerver engedélyezi (mbEco.al) → kliens jóváírja.
  const gift = (u, ft, zs, why) => { u.k2gift = (u.k2gift || []).concat([{ id: crypto.randomBytes(5).toString('hex'), ft: ft | 0, zs: zs | 0, why }]).slice(-30); save(); toUser(u.name, { t: 'k2_gift' }); };
  const allow = (u, ft, zs) => { if (!u.mbEco) return; u.mbEco.al = num(u.mbEco.al) + Math.max(0, ft); u.mbEco.alz = num(u.mbEco.alz) + Math.max(0, zs); };

  // ================= 2. pénz-őr =================
  // Organikus (kliensen szerzett) növekedés: legfeljebb RATE/mp, napi plafonnal. Fölötte csak szerver által ismert forrás:
  // mbEco.al/alz (mod_B kereskedés/póker, mod_cplus, admin, ajándék, meccsjutalom /api/match, /api/k2/earn kaszinó).
  const RATE_C = 2500, RATE_Z = 4, DAY_C = 25e6, DAY_Z = 40000, BURST_C = 150000, BURST_Z = 300;
  function ecoGuard(u, d) {
    const e = u.mbEco; if (!e || isAdm(u)) return false;
    let c = d.k3c != null ? Number(d.k3c) : null, br = null, zs = null;
    try { br = d.k3br ? JSON.parse(d.k3br) : null; zs = br && br.zs != null ? Number(br.zs) : null; } catch (er) { br = null; }
    if (c != null && !isFinite(c)) c = null; if (zs != null && !isFinite(zs)) zs = null;
    const dt = Math.max(1, (now() - num(e.t)) / 1000), dd = u.k2day && u.k2day.d === day() ? u.k2day : (u.k2day = { d: day(), c: 0, z: 0 });
    let ch = false, fl = null;
    if (c != null) { const g = c - num(e.c) - num(e.al); if (g > 0) { const lim = Math.min(BURST_C + RATE_C * dt, Math.max(0, DAY_C - dd.c)); if (g > lim) { fl = { t: now(), k2c: Math.round(g), lim: Math.round(lim) }; d.k3c = String(Math.round(num(e.c) + num(e.al) + lim)); ch = true; dd.c += lim; } else dd.c += g; } }
    if (zs != null) { const g = zs - num(e.zs) - num(e.alz); if (g > 0) { const lim = Math.min(BURST_Z + RATE_Z * dt, Math.max(0, DAY_Z - dd.z)); if (g > lim) { fl = Object.assign(fl || { t: now() }, { k2z: Math.round(g), limz: Math.round(lim) }); br.zs = Math.round(num(e.zs) + num(e.alz) + lim); d.k3br = JSON.stringify(br); ch = true; dd.z += lim; } else dd.z += g; } }
    if (fl) { u.mbFlags = (u.mbFlags || []).slice(-19); u.mbFlags.push(fl); console.log('[mod_kozos] pénz-őr levágott:', u.name, JSON.stringify(fl)); }
    // a mod_B guard a saját (bőkezű) korlátja előtt már a levágott értéket látja
    return ch;
  }
  const matchReward = (u, b) => { const k = Math.max(0, Math.min(60, b.kills | 0)), w = !!b.win; allow(u, Math.min(400000, 30000 + k * 6000 + (w ? 120000 : 0)), Math.min(500, 20 + k * 4 + (w ? 150 : 0))); };

  // ================= 3. jelszó-visszaállítás + SMTP =================
  const SMTP = { host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 465, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, from: process.env.SMTP_FROM || process.env.SMTP_USER };
  const PUBLIC = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  function smtpSend(to, subj, text) { // minimális SMTP kliens: 465 = TLS, egyébként STARTTLS; AUTH LOGIN
    return new Promise((ok, no) => {
      let sock, buf = ''; const q = [];
      const fin = (er) => { try { sock.end(); } catch (e) {} er ? no(er) : ok(); };
      const wr = s => sock.write(s + '\r\n');
      const b64 = s => Buffer.from(s, 'utf8').toString('base64');
      const msg = ['From: ' + SMTP.from, 'To: ' + to, 'Subject: =?UTF-8?B?' + b64(subj) + '?=', 'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', 'Date: ' + new Date().toUTCString(), '', b64(text).replace(/.{76}/g, '$&\r\n'), '.'].join('\r\n');
      const onLine = line => {
        const code = line.slice(0, 3); if (line[3] === '-') return; // többsoros válasz
        if (+code >= 400) return fin(new Error('SMTP ' + line));
        const st = q.shift(); if (st) st(code);
      };
      const attach = s => { sock = s; sock.setEncoding('utf8'); sock.setTimeout(15000, () => fin(new Error('SMTP időtúllépés'))); sock.on('error', fin); sock.on('data', d => { buf += d; let i; while ((i = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, i).replace(/\r$/, ''); buf = buf.slice(i + 1); onLine(l); } }); };
      const auth = () => {
        q.push(() => wr('AUTH LOGIN')); // EHLO 250 után
        q.push(() => wr(b64(SMTP.user))); q.push(() => wr(b64(SMTP.pass)));
        q.push(() => wr('MAIL FROM:<' + SMTP.from.replace(/.*</, '').replace(/>.*/, '') + '>'));
        q.push(() => wr('RCPT TO:<' + to + '>')); q.push(() => wr('DATA')); q.push(() => sock.write(msg + '\r\n'));
        q.push(() => { wr('QUIT'); fin(); });
      };
      if (SMTP.port === 465) { attach(tls.connect({ host: SMTP.host, port: 465, servername: SMTP.host })); q.push(() => wr('EHLO kozpenz')); auth(); }
      else {
        attach(net.connect({ host: SMTP.host, port: SMTP.port }));
        q.push(() => wr('EHLO kozpenz')); q.push(() => wr('STARTTLS'));
        q.push(() => { sock.removeAllListeners('data'); const t = tls.connect({ socket: sock, servername: SMTP.host }, () => wr('EHLO kozpenz')); buf = ''; attach(t); });
        auth();
      }
    });
  }
  const resetLink = tok => (PUBLIC || '') + '/?reset=' + tok;
  function mkReset(u) { const tok = crypto.randomBytes(20).toString('hex'); u.k2rst = { h: crypto.createHash('sha256').update(tok).digest('hex'), exp: now() + 3600e3 }; save(); return tok; }
  const RESETS = []; // admin panelnek: utolsó kérések (token csak ha nincs SMTP)
  const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[a-z]{2,}$/i;

  // ================= 4. mentés-feltöltés =================
  async function upBackup() {
    const URL_ = process.env.BACKUP_URL; if (!URL_) return;
    const last = meta('k2_bkup', {}); if (last.d === day()) return;
    const f = path.join(DATA, 'backup', 'kozpenz_' + day() + '.db'); if (!fs.existsSync(f)) return;
    try {
      const u = URL_.includes('{file}') ? URL_.replace('{file}', path.basename(f)) : URL_;
      const h = { 'Content-Type': 'application/octet-stream', 'X-File-Name': path.basename(f) }; if (process.env.BACKUP_TOKEN) h.Authorization = 'Bearer ' + process.env.BACKUP_TOKEN;
      const r = await fetch(u, { method: process.env.BACKUP_METHOD || 'PUT', headers: h, body: fs.readFileSync(f) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      setMeta('k2_bkup', { d: day(), t: now(), size: fs.statSync(f).size }); console.log('[mod_kozos] mentés feltöltve:', path.basename(f));
    } catch (e) { console.log('[mod_kozos] mentés-feltöltés hiba:', e.message); setMeta('k2_bkup', Object.assign(last, { err: e.message, et: now() })); }
  }
  setTimeout(upBackup, 20000).unref(); setInterval(upBackup, 3600e3).unref();

  // ================= 25. heti közös esemény =================
  const EVENTS = [['💥 Közös cél: 3000 kiesés a héten!', 'k', 3000], ['🎮 Közös cél: 600 lejátszott meccs a héten!', 'g', 600], ['🏆 Közös cél: 120 győzelem a héten!', 'w', 120]];
  const statOf = (u, k) => num(u.stats && u.stats[{ k: 'kills', g: 'games', w: 'wins' }[k]]);
  function ev() {
    let E = meta('k2_ev', null); const w = week();
    if (!E || E.w !== w) {
      if (E && !E.paid && E.done) { /* már kifizetve a teljesítéskor */ }
      const [title, k, goal] = EVENTS[w % EVENTS.length]; const base = {};
      Object.values(db().users).forEach(u => base[u.name.toLowerCase()] = statOf(u, k));
      E = { w, title, k, goal, base, done: 0 }; setMeta('k2_ev', E);
    }
    return E;
  }
  function evState(u) {
    const E = ev(); let cur = 0, mine = 0;
    Object.values(db().users).forEach(x => { const d = Math.max(0, statOf(x, E.k) - num(E.base[x.name.toLowerCase()])); cur += d; if (u && x === u) mine = d; });
    if (!E.done && cur >= E.goal) { // teljesült → minden résztvevőnek jutalom
      E.done = now(); setMeta('k2_ev', E);
      Object.values(db().users).forEach(x => { if (statOf(x, E.k) - num(E.base[x.name.toLowerCase()]) > 0) { gift(x, 250000, 300, 'Heti közös esemény teljesítve'); sysMail(x.name, '🎉 A közösség teljesítette a heti célt (' + E.title + ')! Jutalmad: 250 000 Ft + 300 zseton – a Közösség+ panelen veheted át.'); } });
    }
    return { title: E.title, goal: E.goal, cur: Math.min(cur, E.goal), mine, done: !!E.done, ends: (E.w + 1) * 7 * 864e5 - 3 * 864e5 };
  }

  // ================= 26. kreatív verseny (Közgram fotó / megosztott pálya) =================
  function contest() {
    let C = meta('k2_ct', null); const w = week();
    if (!C || C.w !== w) {
      if (C && C.ent && C.ent.length) { // előző hét lezárása
        const best = C.ent.slice().sort((a, b) => b.v.length - a.v.length || a.t - b.t)[0];
        if (best && best.v.length) { const wu = U(best.n); if (wu) { gift(wu, 500000, 500, 'Kreatív verseny győzelem'); sysMail(wu.name, '🏅 Megnyerted a heti kreatív versenyt (' + best.v.length + ' szavazat)! Jutalmad: 500 000 Ft + 500 zseton.'); } }
        C = { w, ent: [], last: best && best.v.length ? { n: best.n, kind: best.kind, title: best.title, v: best.v.length } : (C.last || null) };
      } else C = { w, ent: [], last: C ? C.last : null };
      setMeta('k2_ct', C);
    }
    return C;
  }
  const modD = () => meta('mod_D', { posts: [], maps: [] });

  // ================= HTTP =================
  const orig = server.listeners('request'); server.removeAllListeners('request');
  const pass = (req, res) => orig.forEach(l => l.call(server, req, res));
  const rd = (req, max) => new Promise((ok, no) => { let d = ''; req.on('data', c => { d += c; if (d.length > max) { no(new Error('big')); req.destroy(); } }); req.on('end', () => ok(d)); req.on('error', no); });
  const reqStream = (req, raw) => { const r2 = Readable.from([raw]); r2.headers = req.headers; r2.method = req.method; r2.url = req.url; r2.socket = req.socket; r2.destroy = () => {}; return r2; };

  server.on('request', async (req, res) => {
    let url; try { url = new URL(req.url, 'http://x'); } catch (e) { return pass(req, res); }
    const p = url.pathname, M = req.method;
    try {
      // ---- 2. pénz-őr a mod_B guard előtt ----
      if (p === '/api/save' && M === 'POST') {
        const u = authN(req); if (!u || !u.mbEco) return pass(req, res);
        let raw; try { raw = await rd(req, 2 * 1024 * 1024 + 10); } catch (e) { return send(res, 413, { error: 'A mentés túl nagy (max 2 MB).' }); }
        try { const b = JSON.parse(raw || '{}'); if (b && b.d && typeof b.d === 'object' && ecoGuard(u, b.d)) raw = JSON.stringify(b); } catch (e) {}
        return pass(reqStream(req, raw), res);
      }
      if (p === '/api/match' && M === 'POST') { // meccsjutalom-keret (korláttal, 40 mp-enként 1)
        const u = authN(req); if (!u) return pass(req, res);
        let raw; try { raw = await rd(req, 1e5); } catch (e) { return send(res, 413, { error: 'nagy' }); }
        try { if (!limited('k2m:' + u.name, 1, 40000)) matchReward(u, JSON.parse(raw || '{}')); } catch (e) {}
        return pass(reqStream(req, raw), res);
      }
      // ---- 3. jelszó-visszaállítás ----
      if (p === '/api/reset/req' && M === 'POST') {
        if (limited('rst:' + req.socket.remoteAddress, 5, 900000)) return send(res, 429, { error: 'Túl sok kérés, próbáld később.' });
        const b = await body(req); const u = U(b.name);
        const okMsg = { ok: true, msg: 'Ha a fiókhoz tartozik e-mail cím, elküldtük a visszaállító linket. Ha nincs, kérd az admint (ő tud linket generálni).' };
        if (!u || u.name.toLowerCase() === 'zalqn' && !u.email) return send(res, 200, okMsg);
        const tok = mkReset(u); const link = resetLink(tok);
        if (SMTP.host && SMTP.user && u.email) {
          smtpSend(u.email, 'Közpénz Royale – jelszó-visszaállítás', 'Szia ' + u.name + '!\n\nÚj jelszót itt állíthatsz be (1 óráig érvényes):\n' + (PUBLIC ? link : 'a játék oldalán: ?reset=' + tok) + '\n\nHa nem te kérted, hagyd figyelmen kívül.')
            .then(() => console.log('[reset] e-mail elküldve:', u.name)).catch(e => console.log('[reset] SMTP hiba:', e.message));
          RESETS.unshift({ n: u.name, t: now(), mail: 1 });
        } else { console.log('[reset] ' + u.name + ' visszaállító link (nincs SMTP/e-mail): ' + link); RESETS.unshift({ n: u.name, t: now(), link }); }
        RESETS.length = Math.min(RESETS.length, 50);
        return send(res, 200, okMsg);
      }
      if (p === '/api/reset/do' && M === 'POST') {
        if (limited('rsd:' + req.socket.remoteAddress, 10, 900000)) return send(res, 429, { error: 'Túl sok próbálkozás.' });
        const b = await body(req); const tok = String(b.token || ''), pw = b.pass;
        if (typeof pw !== 'string' || pw.length < 6 || pw.length > 72) return send(res, 400, { error: 'A jelszó legalább 6 karakter legyen.' });
        const h = crypto.createHash('sha256').update(tok).digest('hex');
        const u = Object.values(db().users).find(x => x.k2rst && x.k2rst.h === h);
        if (!u || u.k2rst.exp < now()) return send(res, 400, { error: 'A link érvénytelen vagy lejárt.' });
        u.salt = crypto.randomBytes(16).toString('hex'); u.hash = crypto.scryptSync(pw, u.salt, 64).toString('hex'); delete u.k2rst;
        for (const [t, n] of sessions) if (n.toLowerCase() === u.name.toLowerCase()) sessions.delete(t); // régi munkamenetek ki
        save(); console.log('[reset] új jelszó beállítva:', u.name); return send(res, 200, { ok: true, name: u.name });
      }
      if (p.startsWith('/api/admin/k2/')) {
        const u = authN(req); if (!isAdm(u)) return send(res, 403, { error: 'Nincs jogod.' });
        if (p === '/api/admin/k2/resetlink' && M === 'POST') { const b = await body(req); const t = U(b.name); if (!t) return send(res, 404, { error: 'Nincs ilyen játékos.' }); if (t.name.toLowerCase() === 'zalqn' && u.name.toLowerCase() !== 'zalqn') return send(res, 403, { error: 'A fő admin jelszavát nem lehet.' }); const tok = mkReset(t); console.log('[reset] admin (' + u.name + ') linket generált:', t.name); return send(res, 200, { link: resetLink(tok), token: tok, exp: t.k2rst.exp }); }
        if (p === '/api/admin/k2/resets') return send(res, 200, { list: RESETS, smtp: !!(SMTP.host && SMTP.user), backup: { url: !!process.env.BACKUP_URL, last: meta('k2_bkup', {}) }, dataDir: process.env.DATA_DIR || '(nincs – nem tartós)' });
        if (p === '/api/admin/k2/perf') return send(res, 200, { list: Q ? Q.pList.all().map(r => { let j = {}; try { j = JSON.parse(r.j); } catch (e) {} return Object.assign(j, { id: r.id, t: r.t, n: r.n }); }) : [] });
        if (p === '/api/admin/k2/backupnow' && M === 'POST') { setMeta('k2_bkup', {}); await upBackup(); return send(res, 200, meta('k2_bkup', {})); }
        return send(res, 404, { error: 'Ismeretlen.' });
      }
      if (!p.startsWith('/api/k2/')) return pass(req, res);
      // ---- 29. teljesítmény-napló (vendég is küldhet) ----
      if (p === '/api/k2/perf' && M === 'POST') {
        if (limited('perf:' + req.socket.remoteAddress, 3, 3600e3)) return send(res, 429, {});
        const b = await body(req, 4000); const s = (v, n) => String(v == null ? '' : v).slice(0, n);
        const j = { fps: Math.max(0, Math.min(500, num(b.fps))), gpu: s(b.gpu, 160), res: s(b.res, 30), dpr: num(b.dpr), mob: !!b.mob, ua: s(b.ua, 200), mode: s(b.mode, 20), mem: num(b.mem), cores: num(b.cores) };
        const u = authN(req); if (Q) { Q.pIns.run(now(), u ? u.name : 'vendég', JSON.stringify(j)); Q.pTrim.run(); }
        return send(res, 200, { ok: true });
      }
      const u = authN(req); if (!u) return send(res, 401, { error: 'Jelentkezz be!' });
      const K = u.name.toLowerCase();
      if (p === '/api/k2/state') {
        const C = contest();
        return send(res, 200, { unread: Q ? Q.mUnr.get(K).c : 0, gifts: u.k2gift || [], ev: evState(u), invite: { code: u.name, used: u.k2inv || null, count: u.k2invN | 0 }, email: u.email || '', ct: { n: C.ent.length, last: C.last } });
      }
      if (p === '/api/k2/claim' && M === 'POST') { // ajándék átvétele: a szerver engedélyezi a növekedést
        const b = await body(req); const g = (u.k2gift || []).find(x => x.id === b.id); if (!g) return send(res, 404, { error: 'Nincs ilyen ajándék.' });
        u.k2gift = u.k2gift.filter(x => x !== g); allow(u, g.ft, g.zs); save(); return send(res, 200, { ok: true, ft: g.ft, zs: g.zs });
      }
      if (p === '/api/k2/earn' && M === 'POST') { // kaszinó/meccs eredmény jelzése (kliens hook: _k2.earn) – szigorú korláttal
        const b = await body(req); const src = String(b.src || '');
        const cap = { casino: [200000, 2000, 30000], match: [150000, 200, 40000] }[src]; if (!cap) return send(res, 400, { error: 'Ismeretlen forrás.' });
        if (limited('earn:' + src + ':' + u.name, 1, cap[2])) return send(res, 429, { error: 'Lassabban.' });
        const dd = u.k2earn && u.k2earn.d === day() ? u.k2earn : (u.k2earn = { d: day(), c: 0, z: 0 });
        const ft = Math.min(cap[0], Math.max(0, num(b.ft)), Math.max(0, 5e6 - dd.c)), zs = Math.min(cap[1], Math.max(0, num(b.zs)), Math.max(0, 20000 - dd.z));
        dd.c += ft; dd.z += zs; allow(u, ft, zs); save(); return send(res, 200, { ok: true, ft, zs });
      }
      if (p === '/api/k2/email' && M === 'POST') {
        const b = await body(req); const e = String(b.email || '').trim();
        if (e && !EMAIL_RE.test(e)) return send(res, 400, { error: 'Hibás e-mail cím.' });
        if (e) u.email = e; else delete u.email; save(); return send(res, 200, { ok: true, email: u.email || '' });
      }
      // ---- 23. meghívó ----
      if (p === '/api/k2/invite' && M === 'POST') {
        const b = await body(req); const inv = U(b.code);
        if (u.k2inv) return send(res, 400, { error: 'Már beváltottál egy meghívót.' });
        if (!inv || inv === u) return send(res, 400, { error: 'Érvénytelen meghívókód.' });
        if (now() - num(u.created) > 7 * 864e5) return send(res, 400, { error: 'Meghívót csak az első 7 napban lehet beváltani.' });
        if ((inv.k2invN | 0) >= 20) return send(res, 400, { error: 'Ez a meghívó betelt.' });
        if (num(inv.created) > num(u.created)) return send(res, 400, { error: 'Csak régebbi játékos hívhat meg.' });
        u.k2inv = inv.name; inv.k2invN = (inv.k2invN | 0) + 1;
        gift(u, 100000, 100, 'Meghívó beváltva (' + inv.name + ')'); gift(inv, 150000, 150, 'Meghívtad: ' + u.name);
        sysMail(inv.name, '🤝 ' + u.name + ' beváltotta a meghívódat! Jutalmad: 150 000 Ft + 150 zseton (Közösség+ panel).');
        return send(res, 200, { ok: true });
      }
      // ---- 24. levelezés ----
      if (p === '/api/k2/mail') return send(res, 200, { list: Q ? Q.mList.all(K) : [] });
      if (p === '/api/k2/mail/send' && M === 'POST') {
        if (!Q) return send(res, 500, { error: 'Nincs adatbázis.' });
        if (u.mbMuteT && u.mbMuteT > now()) return send(res, 403, { error: 'Le vagy némítva.' });
        if (limited('mail:' + u.name, 10, 600000)) return send(res, 429, { error: 'Legfeljebb 10 levél 10 percenként.' });
        const b = await body(req); const t = U(b.to); const txt = String(b.txt || '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, 500);
        if (!t) return send(res, 404, { error: 'Nincs ilyen játékos.' }); if (t === u) return send(res, 400, { error: 'Magadnak nem írhatsz.' });
        if (!txt) return send(res, 400, { error: 'Üres levél.' }); if ((t.mbMutes || []).includes(u.name)) return send(res, 403, { error: 'A címzett letiltott.' });
        if (Q.mCnt.get(t.name.toLowerCase()).c >= 200) return send(res, 400, { error: 'A címzett postafiókja tele van.' });
        Q.mIns.run(t.name.toLowerCase(), u.name, txt, now()); toUser(t.name, { t: 'k2_mail', from: u.name }); return send(res, 200, { ok: true });
      }
      if (p === '/api/k2/mail/read' && M === 'POST') { const b = await body(req); Q && Q.mRd.run(K, b.id | 0, b.id | 0); return send(res, 200, { ok: true }); }
      if (p === '/api/k2/mail/del' && M === 'POST') { const b = await body(req); Q && Q.mDel.run(K, b.id | 0); return send(res, 200, { ok: true }); }
      // ---- 26. kreatív verseny ----
      if (p === '/api/k2/contest') {
        const C = contest(), D = modD();
        const ent = C.ent.map(e => { const src = e.kind === 'gram' ? (D.posts || []).find(x => x.id === e.id && !x.hid) : (D.maps || []).find(x => x.id === e.id && !x.hid); return src ? { kind: e.kind, id: e.id, n: e.n, title: e.title, img: e.kind === 'gram' ? src.img || '' : '', cells: e.kind === 'map' ? Object.keys(src.cells || {}).length : 0, v: e.v.length, my: e.v.includes(u.name), mine: e.n === u.name } : null; }).filter(Boolean).sort((a, b) => b.v - a.v);
        const mine = { gram: (D.posts || []).filter(x => x.n === u.name && !x.hid && x.img).slice(-10).map(x => ({ id: x.id, title: String(x.txt || '').slice(0, 40) })), map: (D.maps || []).filter(x => x.n === u.name && !x.hid).map(x => ({ id: x.id, title: x.name })) };
        return send(res, 200, { ent, mine, last: C.last, ends: (C.w + 1) * 7 * 864e5 - 3 * 864e5, votesLeft: 3 - C.ent.filter(e => e.v.includes(u.name)).length });
      }
      if (p === '/api/k2/contest/enter' && M === 'POST') {
        const b = await body(req); const C = contest(), D = modD(), kind = b.kind === 'map' ? 'map' : 'gram', id = b.id | 0;
        const src = kind === 'gram' ? (D.posts || []).find(x => x.id === id && !x.hid && x.img) : (D.maps || []).find(x => x.id === id && !x.hid);
        if (!src || src.n !== u.name) return send(res, 400, { error: 'Csak a saját (fotós) posztodat vagy pályádat nevezheted.' });
        if (C.ent.some(e => e.n === u.name)) return send(res, 400, { error: 'Hetente egy nevezés.' });
        C.ent.push({ kind, id, n: u.name, title: String(kind === 'gram' ? src.txt || 'Fotó' : src.name || 'Pálya').slice(0, 40), t: now(), v: [] }); setMeta('k2_ct', C); return send(res, 200, { ok: true });
      }
      if (p === '/api/k2/contest/vote' && M === 'POST') {
        const b = await body(req); const C = contest(); const e = C.ent.find(x => x.kind === b.kind && x.id === (b.id | 0)); if (!e) return send(res, 404, { error: 'Nincs ilyen nevezés.' });
        if (e.n === u.name) return send(res, 400, { error: 'Magadra nem szavazhatsz.' });
        const i = e.v.indexOf(u.name); if (i >= 0) e.v.splice(i, 1); else { if (C.ent.filter(x => x.v.includes(u.name)).length >= 3) return send(res, 400, { error: 'Hetente 3 szavazatod van.' }); e.v.push(u.name); }
        setMeta('k2_ct', C); return send(res, 200, { ok: true });
      }
      return send(res, 404, { error: 'Ismeretlen.' });
    } catch (e) { if (!res.headersSent) send(res, 500, { error: 'Szerverhiba.' }); console.log('[mod_kozos] hiba', p, e.message); }
  });
  X.k2 = { gift, allow, smtpSend };
};
