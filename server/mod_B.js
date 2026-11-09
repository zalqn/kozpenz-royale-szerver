// mod_B – TÖBBJÁTÉKOS bővítés (B): pénzvédelem, közös royale meccs, hangchat, barát-csatlakozás,
// ranglisták, moderálás (chatszűrő/jelentés/némítás), kereskedés, rangsorolt divíziók, póker (Texas Hold'em).
// A server.js 1 sorral hívja: require('./mod_B')({server, wss, db, sessions, save, online, parties, sendParty, leaveParty, saveFile})
const fs = require('fs'), crypto = require('crypto'), { Readable } = require('stream');

module.exports = function (X) {
  const { server, wss, db, sessions, save, online, parties, sendParty, leaveParty, saveFile, store } = X;
  const U = n => db.users[String(n || '').toLowerCase()];
  const send = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(o)); };
  const authN = req => { const t = (req.headers.authorization || '').replace('Bearer ', '') || new URL(req.url, 'http://x').searchParams.get('tk'); const n = sessions.get(t); return n && U(n) ? U(n) : null; };
  const now = () => Date.now();
  const cl = new Map(); // név -> ws (az utolsó kapcsolat)
  const out = (ws, o) => { try { ws && ws.readyState === 1 && ws.__mbSend(JSON.stringify(o)); } catch (e) {} };
  const to = (n, o) => out(cl.get(n), o);

  // ================= 14. MODERÁLÁS: chatszűrő, némítás, jelentés =================
  const BAD = ['kurv', 'fasz', 'geci', 'picsa', 'pics', 'bazd', 'baszd', 'baszo', 'basszo', 'buzi', 'köcsög', 'kocsog', 'anyád', 'anyad', 'ribanc', 'pina', 'segg', 'fuck', 'shit', 'bitch', 'cunt', 'retkes', 'szarházi', 'szarhazi', 'idióta', 'idiota', 'hülye', 'hulye', 'nyomorék', 'nyomorek'];
  const L = 'a-z0-9áéíóöőúüű';
  const BAD_RE = new RegExp('(^|[^' + L + '])((?:' + BAD.join('|') + ')[' + L + ']*)', 'gi');
  const censor = s => String(s || '').replace(BAD_RE, (m, a, w) => a + w[0] + '*'.repeat(w.length - 1));
  const gMuted = n => { const u = U(n); return u && u.mbMuteT && u.mbMuteT > now(); };
  // minden kimenő chat (lobby + Teakert) szűrése a címzett socketjén: így a server.js-t nem kell átírni
  function patch(ws, me) {
    if (ws.__mbSend) return; const orig = ws.send.bind(ws); ws.__mbSend = orig;
    ws.send = function (data, ...a) {
      if (typeof data === 'string' && data.length < 5000 && (data.startsWith('{"t":"chat"') || data.startsWith('{"t":"cs_chat"'))) {
        try {
          const o = JSON.parse(data), from = o.from || o.name;
          if (from && from !== '★' && from !== me) {
            if (gMuted(from)) return;
            const u = U(me); if (u && (u.mbMutes || []).includes(from)) return;
          }
          if (o.text) { o.text = censor(o.text); data = JSON.stringify(o); }
        } catch (e) {}
      }
      return orig(data, ...a);
    };
  }

  // ================= 3. PÉNZ/ZSETON VÉDELEM (/api/save) =================
  const num = v => { const x = Number(v); return isFinite(x) ? x : null; };
  function guard(u, d) {
    let c = num(d.k3c), br = null, zs = null;
    try { br = d.k3br ? JSON.parse(d.k3br) : null; zs = br ? num(br.zs) : null; } catch (e) {}
    const e = u.mbEco || null, t = now();
    if (!e) { u.mbEco = { c: c || 0, zs: zs || 0, t, al: 0, alz: 0 }; return null; }
    const dt = Math.max(1, (t - e.t) / 1000);
    const limC = 3e6 + 60000 * dt + (e.al || 0), limZ = 6000 + 120 * dt + (e.alz || 0); // bőkezű: kaszinó-nyeremény, dev parancs ne törjön el
    let flag = null;
    if (c != null && c - e.c > limC) { flag = { t, dc: Math.round(c - e.c), lim: Math.round(limC) }; c = Math.round(e.c + limC); d.k3c = String(c); }
    if (zs != null && zs - e.zs > limZ) { flag = Object.assign(flag || { t }, { dz: Math.round(zs - e.zs), limz: Math.round(limZ) }); zs = Math.round(e.zs + limZ); br.zs = zs; d.k3br = JSON.stringify(br); }
    if (c != null) e.c = c; if (zs != null) e.zs = zs; e.t = t; e.al = 0; e.alz = 0;
    if (flag) { u.mbFlags = (u.mbFlags || []).slice(-19); u.mbFlags.push(flag); console.log('[mod_B] gyanús pénzugrás:', u.name, JSON.stringify(flag)); }
    return flag;
  }
  const allow = (u, ft, zs) => { if (!u.mbEco) return; u.mbEco.al = (u.mbEco.al || 0) + Math.max(0, ft || 0); u.mbEco.alz = (u.mbEco.alz || 0) + Math.max(0, zs || 0); };
  // szerveren tárolt mentés olvasás/írás (kereskedés, póker)
  function rdSave(u) { try { if (store && store.ok) { const j = store.readSave(u.name); return j ? JSON.parse(j) : { t: 0, d: {} }; } return JSON.parse(fs.readFileSync(saveFile(u), 'utf8')); } catch (e) { return { t: 0, d: {} }; } }
  function wrSave(u, s) { try { s.t = now(); if (store && store.ok) store.writeSave(u.name, JSON.stringify(s), s.t); else fs.writeFileSync(saveFile(u), JSON.stringify(s)); u.saveT = s.t; } catch (e) {} }
  const ecoC = u => (u.mbEco ? u.mbEco.c : num(rdSave(u).d.k3c) || 0);
  const ecoZ = u => { if (u.mbEco) return u.mbEco.zs; try { return num(JSON.parse(rdSave(u).d.k3br).zs) || 0; } catch (e) { return 0; } };
  function ownItems(u) { try { const b = JSON.parse(rdSave(u).d.k3br || '{}'); return Object.keys(b.own || {}).filter(k => b.own[k]); } catch (e) { return []; } }
  function applyEco(u, dft, dzs, add, rem) { // szerveres mentés módosítása
    const s = rdSave(u); s.d = s.d || {};
    s.d.k3c = String(Math.max(0, (num(s.d.k3c) || 0) + dft));
    let b = {}; try { b = JSON.parse(s.d.k3br || '{}'); } catch (e) {}
    b.own = b.own || {}; b.zs = Math.max(0, (num(b.zs) || 0) + dzs);
    (rem || []).forEach(k => { delete b.own[k]; if (b.eq) for (const sl in b.eq) if (b.eq[sl] === k) delete b.eq[sl]; });
    (add || []).forEach(k => b.own[k] = 1);
    s.d.k3br = JSON.stringify(b); wrSave(u, s);
    if (u.mbEco) { u.mbEco.c = Math.max(0, u.mbEco.c + dft); u.mbEco.zs = Math.max(0, u.mbEco.zs + dzs); }
    allow(u, dft, dzs);
  }

  // ================= 24. RANGSOROLT DIVÍZIÓK =================
  const DIV = [['Bronz', 0], ['Ezüst', 400], ['Arany', 1000], ['Platina', 1900], ['Gyémánt', 3000], ['Mester', 4500]];
  const div = rp => { let i = 0; DIV.forEach((d, k) => { if (rp >= d[1]) i = k; }); return { i, n: DIV[i][0], next: DIV[i + 1] ? DIV[i + 1][1] : null }; };
  function addRp(u, d, why) { const b = u.mbRp | 0; u.mbRp = Math.max(0, b + Math.round(d)); const a = div(b).i, c = div(u.mbRp).i; to(u.name, { t: 'mb_rp', rp: u.mbRp, d: u.mbRp - b, div: div(u.mbRp), why, up: c > a, down: c < a }); save(); }

  // ================= HTTP: /api/mb/* + /api/save őr =================
  const orig = server.listeners('request'); server.removeAllListeners('request');
  const pass = (req, res) => orig.forEach(l => l.call(server, req, res));
  const rd = (req, max) => new Promise((ok, no) => { let d = ''; req.on('data', c => { d += c; if (d.length > max) { no(new Error('big')); req.destroy(); } }); req.on('end', () => ok(d)); req.on('error', no); });
  server.on('request', async (req, res) => {
    let url; try { url = new URL(req.url, 'http://x'); } catch (e) { return pass(req, res); }
    const p = url.pathname;
    try {
      if (p === '/api/save' && req.method === 'POST') {
        const u = authN(req); if (!u) return pass(req, res);
        let raw; try { raw = await rd(req, 2 * 1024 * 1024 + 10); } catch (e) { return send(res, 413, { error: 'A mentés túl nagy (max 2 MB).' }); }
        try { const b = JSON.parse(raw || '{}'); if (b && b.d && typeof b.d === 'object') { if (guard(u, b.d)) raw = JSON.stringify(b); save(); } } catch (e) {}
        const r2 = Readable.from([raw]); r2.headers = req.headers; r2.method = req.method; r2.url = req.url; r2.socket = req.socket; r2.destroy = () => {};
        return pass(r2, res);
      }
      if (!p.startsWith('/api/mb/')) return pass(req, res);
      if (p === '/api/mb/top') {
        const us = Object.values(db.users), m = (f, g) => us.map(u => ({ name: u.name, avatar: u.avatar || '😎', v: f(u) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v).slice(0, 20);
        return send(res, 200, {
          wins: m(u => ((u.stats && u.stats.wins) | 0) + ((u.mbStats && u.mbStats.w) | 0)),
          kills: m(u => ((u.stats && u.stats.kills) | 0) + ((u.mbStats && u.mbStats.k) | 0)),
          cash: m(u => (u.mbEco && !(u.mbFlags || []).length ? Math.round(u.mbEco.c) : u.mbEco ? Math.round(u.mbEco.c) : 0)),
          rang: m(u => u.rang | 0),
          rp: m(u => u.mbRp | 0).map(x => Object.assign(x, { div: div(x.v).n })),
          mp: m(u => (u.mbStats && u.mbStats.w) | 0)
        });
      }
      const u = authN(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      if (p === '/api/mb/me') return send(res, 200, { rp: u.mbRp | 0, div: div(u.mbRp | 0), divs: DIV, mutes: u.mbMutes || [], muteT: u.mbMuteT || 0, flags: (u.mbFlags || []).length, st: u.mbStats || {}, friends: u.friends || [] });
      if (p === '/api/mb/solo' && req.method === 'POST') { // bot-meccs eredménye: kis, korlátozott rangpont
        let b = {}; try { b = JSON.parse(await rd(req, 2000)); } catch (e) {}
        if (u.mbSoloT && now() - u.mbSoloT < 60000) return send(res, 200, { ok: false, rp: u.mbRp | 0 });
        u.mbSoloT = now(); addRp(u, b.win ? 18 : Math.min(10, (b.kills | 0) * 1) - 4, b.win ? 'Bot-meccs győzelem' : 'Bot-meccs'); return send(res, 200, { ok: true, rp: u.mbRp, div: div(u.mbRp) });
      }
      return send(res, 404, { error: 'Nincs ilyen.' });
    } catch (e) { try { send(res, 400, { error: 'Hibás kérés.' }); } catch (e2) {} }
  });

  // ================= 9/24. KÖZÖS ROYALE MECCS =================
  const queue = []; // {name, ranked, grp, t}
  const matches = new Map(); // id -> {id, ranked, players:[], alive:Set, kills:{}, order:[], t}
  const inMatch = new Map(); // név -> match id
  const unq = n => { const i = queue.findIndex(q => q.name === n); if (i >= 0) queue.splice(i, 1); };
  function qStatus() { queue.forEach(q => to(q.name, { t: 'mb_qs', n: queue.filter(x => x.ranked === q.ranked).length, w: Math.round((now() - q.t) / 1000) })); }
  setInterval(() => {
    [false, true].forEach(rk => {
      const q = queue.filter(x => x.ranked === rk); if (!q.length) return;
      const oldest = now() - q[0].t;
      if (q.length >= 8 || (q.length >= 2 && oldest > 8000) || oldest > 30000) startMatch(q.slice(0, 8), rk);
    });
    qStatus();
  }, 1000);
  function startMatch(list, ranked) {
    const id = crypto.randomBytes(5).toString('hex'), names = list.map(q => q.name);
    names.forEach(unq);
    const m = { id, ranked, players: names, alive: new Set(names), kills: {}, order: [], t: now(), seed: Math.random() * 1e9 | 0 };
    matches.set(id, m); names.forEach(n => inMatch.set(n, id));
    const pl = names.map((n, i) => { const u = U(n) || {}; const a = i / names.length * Math.PI * 2; return { name: n, avatar: u.avatar || '😎', color: u.color || '#ffd23f', rang: u.rang | 0, x: Math.cos(a) * 30, z: Math.sin(a) * 30 }; });
    names.forEach(n => to(n, { t: 'mb_start', id, ranked, players: pl, seed: m.seed }));
  }
  function matchOf(n) { const id = inMatch.get(n); return id ? matches.get(id) : null; }
  function mcast(m, o, except) { m.players.forEach(n => { if (n !== except) to(n, o); }); }
  function die(m, n, by) {
    if (!m || !m.alive.has(n)) return;
    m.alive.delete(n); const place = m.alive.size + 1; m.order.push({ n, place, by });
    if (by && by !== n && m.players.includes(by)) m.kills[by] = (m.kills[by] | 0) + 1;
    mcast(m, { t: 'mb_dead', name: n, by: by || null, place });
    finishFor(m, n, place);
    if (m.alive.size <= 1) {
      const w = [...m.alive][0];
      if (w && m.players.length > 1) { m.alive.delete(w); m.order.push({ n: w, place: 1 }); mcast(m, { t: 'mb_win', name: w }); finishFor(m, w, 1); }
      setTimeout(() => { m.players.forEach(p => { if (inMatch.get(p) === m.id) inMatch.delete(p); }); matches.delete(m.id); }, 3000);
    }
  }
  function finishFor(m, n, place) {
    const u = U(n); if (!u) return; const k = m.kills[n] | 0, N = m.players.length;
    u.mbStats = u.mbStats || { g: 0, w: 0, k: 0 }; u.mbStats.g++; u.mbStats.k += k; if (place === 1 && N > 1) u.mbStats.w++;
    if (m.ranked && N > 1) { const f = (N - place) / (N - 1); addRp(u, Math.round(-15 + 75 * f + 10 * k), place + '. hely / ' + N + ', ' + k + ' kiesés'); }
    to(n, { t: 'mb_res', place, n: N, kills: k, ranked: m.ranked }); save();
  }

  // ================= 15. KERESKEDÉS =================
  const trades = new Map(); // név -> trade
  function trSend(tr) { const v = { t: 'mb_tr', a: tr.a, b: tr.b, off: tr.off, ok: tr.ok }; [tr.a, tr.b].forEach(n => to(n, Object.assign({ mine: ownItems(U(n)), bal: ecoC(U(n)), balz: ecoZ(U(n)) }, v))); }
  function trEnd(tr, why) { [tr.a, tr.b].forEach(n => { trades.delete(n); to(n, { t: 'mb_tr_end', why }); }); }
  function trCheck(n, off) {
    const u = U(n); off.ft = Math.max(0, Math.floor(+off.ft || 0)); off.zs = Math.max(0, Math.floor(+off.zs || 0));
    off.items = [...new Set((off.items || []).map(String).filter(s => s.length < 40))].slice(0, 10);
    if (off.ft > ecoC(u)) return 'Nincs ennyi Ft-od (szerver szerint ' + Math.floor(ecoC(u)) + ' Ft).';
    if (off.zs > ecoZ(u)) return 'Nincs ennyi zsetonod (szerver szerint ' + Math.floor(ecoZ(u)) + ').';
    const own = ownItems(u); if (off.items.some(i => !own.includes(i))) return 'Olyan tárgyat ajánlottál, ami (a szerveres mentés szerint) nem a tiéd.';
    return null;
  }

  // ================= 26. PÓKER (Texas Hold'em, a szerver oszt) =================
  const SB = 10, BB = 20, SEATS = 6;
  const tables = new Map(); ['Sárga asztal', 'Zöld asztal', 'Kék asztal'].forEach((n, i) => tables.set('t' + i, { id: 't' + i, name: n, seats: Array(SEATS).fill(null), hand: null, btn: 0, msg: 'Várakozás játékosokra…' }));
  const pkSeat = n => { for (const t of tables.values()) { const i = t.seats.findIndex(s => s && s.name === n); if (i >= 0) return { t, i, s: t.seats[i] }; } return null; };
  function evalHand(cards) { // 7 lap -> legjobb 5 pontszáma
    let best = -1, bi = null; const n = cards.length;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { const five = cards.filter((_, i) => i !== a && i !== b); if (n === 6) {} const s = ev5(n === 5 ? cards : five); if (s > best) { best = s; bi = five; } if (n === 5) return best; }
    return best;
  }
  function ev5(c) {
    const r = c.map(x => x % 13).sort((a, b) => b - a), s = c.map(x => x / 13 | 0);
    const fl = s.every(x => x === s[0]); const cnt = {}; r.forEach(x => cnt[x] = (cnt[x] | 0) + 1);
    const g = Object.keys(cnt).map(Number).sort((a, b) => cnt[b] - cnt[a] || b - a);
    let u = [...new Set(r)], st = -1;
    if (u.length === 5) { if (u[0] - u[4] === 4) st = u[0]; else if (u[0] === 12 && u[1] === 3) st = 3; }
    const K = (cat, ks) => cat * 1e10 + ks.reduce((a, k, i) => a + k * Math.pow(13, 4 - i), 0);
    if (st >= 0 && fl) return K(8, [st]);
    if (cnt[g[0]] === 4) return K(7, [g[0], g[1]]);
    if (cnt[g[0]] === 3 && cnt[g[1]] === 2) return K(6, [g[0], g[1]]);
    if (fl) return K(5, r);
    if (st >= 0) return K(4, [st]);
    if (cnt[g[0]] === 3) return K(3, g);
    if (cnt[g[0]] === 2 && cnt[g[1]] === 2) return K(2, g);
    if (cnt[g[0]] === 2) return K(1, g);
    return K(0, r);
  }
  const HN = ['Magas lap', 'Pár', 'Két pár', 'Drill', 'Sor', 'Flöss', 'Full', 'Póker', 'Színsor'];
  function pkState(t, reveal) {
    const h = t.hand;
    return { t: 'mb_pk', id: t.id, name: t.name, btn: t.btn, msg: t.msg, board: h ? h.board : [], pot: h ? h.pot + t.seats.reduce((a, s) => a + (s ? s.bet : 0), 0) : 0, turn: h ? h.turn : -1, toCall: h ? h.cur : 0, minR: h ? h.minR : BB, dl: h ? h.dl : 0, phase: h ? h.ph : '',
      seats: t.seats.map(s => s && { name: s.name, stack: s.stack, bet: s.bet, fold: s.fold, allin: s.allin, inH: s.inH, cards: reveal && s.inH && !s.fold ? s.cards : null, last: s.last || '' }) };
  }
  function pkCast(t, reveal) { const st = pkState(t, reveal); t.seats.forEach(s => s && to(s.name, st)); for (const [n, w] of cl) if (w.__mbWatch === t.id && !t.seats.some(s => s && s.name === n)) out(w, st); }
  function pkMaybeStart(t) {
    if (t.hand || t.wait) return; const ready = t.seats.filter(s => s && s.stack >= BB);
    if (ready.length < 2) { t.msg = 'Várakozás játékosokra… (legalább 2 fő kell)'; pkCast(t); return; }
    t.wait = setTimeout(() => { t.wait = null; pkDeal(t); }, 3000); t.msg = 'Új leosztás 3 mp múlva…'; pkCast(t);
  }
  const nextSeat = (t, i, f) => { for (let k = 1; k <= SEATS; k++) { const j = (i + k) % SEATS; if (t.seats[j] && f(t.seats[j])) return j; } return -1; };
  function pkDeal(t) {
    const act = s => s.stack >= BB; if (t.seats.filter(s => s && act(s)).length < 2) return pkMaybeStart(t);
    const deck = [...Array(52).keys()]; for (let i = 51; i > 0; i--) { const j = crypto.randomInt(i + 1); [deck[i], deck[j]] = [deck[j], deck[i]]; }
    t.seats.forEach(s => { if (s) { s.inH = act(s); s.fold = !s.inH; s.allin = false; s.bet = 0; s.tot = 0; s.cards = null; s.acted = false; s.last = ''; } });
    t.btn = nextSeat(t, t.btn, s => s.inH);
    const h = t.hand = { deck, board: [], pot: 0, cur: 0, minR: BB, ph: 'preflop', turn: -1, dl: 0 };
    t.seats.forEach(s => { if (s && s.inH) { s.cards = [deck.pop(), deck.pop()]; to(s.name, { t: 'mb_pk_hole', id: t.id, cards: s.cards }); } });
    const two = t.seats.filter(s => s && s.inH).length === 2;
    const sb = two ? t.btn : nextSeat(t, t.btn, s => s.inH), bb = nextSeat(t, sb, s => s.inH);
    const post = (i, a) => { const s = t.seats[i]; const x = Math.min(a, s.stack); s.stack -= x; s.bet += x; s.tot += x; if (!s.stack) s.allin = true; };
    post(sb, SB); post(bb, BB); h.cur = BB; t.msg = 'Leosztás – vak: ' + SB + '/' + BB;
    pkTurn(t, nextSeat(t, bb, s => s.inH && !s.fold && !s.allin));
  }
  function pkTurn(t, i) {
    const h = t.hand; clearTimeout(h.tm);
    if (i < 0) return pkRound(t);
    h.turn = i; h.dl = now() + 25000; pkCast(t);
    h.tm = setTimeout(() => { const s = t.seats[i]; if (s) pkAct(t, i, s.bet >= h.cur ? 'check' : 'fold', 0, true); }, 25000);
  }
  function pkAct(t, i, a, v, auto) {
    const h = t.hand, s = t.seats[i]; if (!h || h.turn !== i || !s) return;
    const need = h.cur - s.bet;
    if (a === 'fold') { s.fold = true; s.last = auto ? 'Idő lejárt – dob' : 'Dob'; }
    else if (a === 'check') { if (need > 0) return; s.last = 'Passz'; }
    else if (a === 'call') { const x = Math.min(need, s.stack); s.stack -= x; s.bet += x; s.tot += x; if (!s.stack) s.allin = true; s.last = s.allin ? 'All-in' : 'Megad'; }
    else if (a === 'raise') {
      let target = Math.floor(+v || 0); const max = s.bet + s.stack;
      if (target > max) target = max; if (target < h.cur + h.minR && target < max) return;
      const x = target - s.bet; s.stack -= x; s.bet += x; s.tot += x; if (target - h.cur >= h.minR) h.minR = target - h.cur; h.cur = Math.max(h.cur, target);
      if (!s.stack) s.allin = true; s.last = s.allin ? 'All-in ' + target : 'Emel ' + target;
      t.seats.forEach(o => { if (o && o !== s) o.acted = false; });
    } else return;
    s.acted = true;
    const live = t.seats.filter(o => o && o.inH && !o.fold);
    if (live.length === 1) return pkEnd(t, live);
    const nx = nextSeat(t, i, o => o.inH && !o.fold && !o.allin && (!o.acted || o.bet < h.cur));
    pkTurn(t, nx);
  }
  function pkRound(t) {
    const h = t.hand; clearTimeout(h.tm);
    t.seats.forEach(s => { if (s) { h.pot += s.bet; s.bet = 0; s.acted = false; } }); h.cur = 0; h.minR = BB;
    const live = t.seats.filter(o => o && o.inH && !o.fold);
    const canAct = live.filter(o => !o.allin).length;
    if (h.ph === 'river') return pkEnd(t, live);
    if (h.ph === 'preflop') { h.board.push(h.deck.pop(), h.deck.pop(), h.deck.pop()); h.ph = 'flop'; }
    else if (h.ph === 'flop') { h.board.push(h.deck.pop()); h.ph = 'turn'; }
    else { h.board.push(h.deck.pop()); h.ph = 'river'; }
    t.msg = { flop: 'Flop', turn: 'Turn', river: 'River' }[h.ph];
    if (canAct < 2) { pkCast(t); h.tm = setTimeout(() => pkRound(t), 1200); return; }
    pkTurn(t, nextSeat(t, t.btn, o => o.inH && !o.fold && !o.allin));
  }
  function pkEnd(t, live) {
    const h = t.hand; clearTimeout(h.tm); t.seats.forEach(s => { if (s) { h.pot += s.bet; s.bet = 0; } });
    const all = t.seats.filter(s => s && s.inH); let res = [];
    if (live.length === 1) { live[0].stack += h.pot; res.push(live[0].name + ' nyert ' + h.pot + ' zsetont'); }
    else {
      while (h.board.length < 5) h.board.push(h.deck.pop());
      live.forEach(s => { s.score = evalHand(s.cards.concat(h.board)); });
      // mellékkasszák a befizetések szintjei szerint
      const lv = [...new Set(all.map(s => s.tot))].filter(x => x > 0).sort((a, b) => a - b); let prev = 0;
      lv.forEach(L => {
        const contrib = all.reduce((a, s) => a + Math.max(0, Math.min(s.tot, L) - prev), 0); const elig = live.filter(s => s.tot >= L);
        if (contrib > 0 && elig.length) { const top = Math.max(...elig.map(s => s.score)), w = elig.filter(s => s.score === top); const each = Math.floor(contrib / w.length); w.forEach((s, k) => s.stack += each + (k === 0 ? contrib - each * w.length : 0)); res.push(w.map(s => s.name).join(', ') + ' – ' + HN[Math.floor(top / 1e10)] + ' (+' + contrib + ')'); }
        prev = L;
      });
    }
    h.turn = -1; t.msg = '🏆 ' + res.join(' · '); pkCast(t, true); t.hand = null;
    setTimeout(() => { t.seats.forEach((s, i) => { if (s && s.leaving) pkLeave(t, i); }); pkMaybeStart(t); }, 5000);
  }
  function pkLeave(t, i) {
    const s = t.seats[i]; if (!s) return;
    if (t.hand && s.inH && !s.fold) { s.leaving = true; if (t.hand.turn === i) pkAct(t, i, 'fold', 0, true); else { s.fold = true; const live = t.seats.filter(o => o && o.inH && !o.fold); if (live.length === 1) pkEnd(t, live); } return; }
    t.seats[i] = null; const u = U(s.name);
    if (u && s.stack > 0) { applyEco(u, 0, s.stack, [], []); if (cl.get(s.name)) to(s.name, { t: 'mb_pk_cash', zs: s.stack, tb: t.name }); else { u.mbPkPend = (u.mbPkPend | 0) + s.stack; } save(); }
    pkCast(t); pkMaybeStart(t);
  }

  // ================= WS =================
  wss.on('connection', (ws, req) => {
    const name = sessions.get(new URL(req.url, 'http://x').searchParams.get('token')); if (!name) return;
    patch(ws, name); cl.set(name, ws);
    const u0 = U(name); if (u0 && u0.mbPkPend) { const z = u0.mbPkPend; u0.mbPkPend = 0; save(); setTimeout(() => to(name, { t: 'mb_pk_cash', zs: z, tb: 'korábbi asztal' }), 1500); }
    const rate = {}; const lim = (k, n, ms) => { const t = now(); rate[k] = (rate[k] || []).filter(x => t - x < ms); if (rate[k].length >= n) return true; rate[k].push(t); return false; };
    ws.on('message', raw => {
      if (raw.length > 400000) return; const s = String(raw); if (!s.startsWith('{"t":"mb_')) return;
      let m; try { m = JSON.parse(s); } catch (e) { return; } if (cl.get(name) !== ws) return;
      const u = U(name); if (!u) return; const t = m.t;
      // --- royale ---
      if (t === 'mb_q') { if (matchOf(name)) return; const p = [...parties.values()].find(p => p.members.includes(name));
        const grp = p && p.leader === name ? p.members.filter(n => cl.get(n) && !matchOf(n)) : [name];
        grp.forEach(n => { unq(n); queue.push({ name: n, ranked: !!m.ranked, t: now() }); to(n, { t: 'mb_qs', n: queue.length, w: 0, by: name }); }); }
      else if (t === 'mb_unq') unq(name);
      else if (t === 'mb_pos') { const M = matchOf(name); if (!M || !M.alive.has(name) || lim('p', 30, 1000)) return; mcast(M, { t: 'mb_pos', n: name, x: +m.x || 0, y: +m.y || 0, z: +m.z || 0, a: +m.a || 0, hp: m.hp | 0, w: m.w | 0 }, name); }
      else if (t === 'mb_shot') { const M = matchOf(name); if (!M || lim('s', 20, 1000)) return; mcast(M, { t: 'mb_shot', n: name, x: +m.x || 0, z: +m.z || 0, a: +m.a || 0 }, name); }
      else if (t === 'mb_hit') { const M = matchOf(name); if (!M || !M.alive.has(name) || !M.alive.has(m.to) || lim('h', 25, 1000)) return; const d = Math.max(0, Math.min(250, +m.d || 0)); to(m.to, { t: 'mb_hit', from: name, d, hs: !!m.hs }); }
      else if (t === 'mb_dead') { const M = matchOf(name); if (M) die(M, name, M.players.includes(m.by) ? m.by : null); }
      else if (t === 'mb_leave') { unq(name); const M = matchOf(name); if (M) { die(M, name, null); inMatch.delete(name); } }
      // --- 11. hangchat (meccs, különben parti) ---
      else if (t === 'mb_voice') { if (lim('v', 1, 1200)) return; const d = String(m.d || ''); if (d.length > 380000 || !d.startsWith('data:audio/') || d.indexOf(';base64,') > 60 || d.indexOf(';base64,') < 0) return; if (gMuted(name)) return;
        const M = matchOf(name), p = [...parties.values()].find(p => p.members.includes(name)); const list = M ? M.players : p ? p.members : [];
        list.forEach(n => { if (n !== name && !((U(n) || {}).mbMutes || []).includes(name)) to(n, { t: 'mb_voice', n: name, d }); }); }
      // --- 12. csatlakozz hozzám ---
      else if (t === 'mb_join') { const o = U(m.to); if (!o || !(u.friends || []).includes(o.name) || !cl.get(o.name)) return to(name, { t: 'mb_note', text: 'A barátod nem elérhető.' }); if (lim('j', 3, 10000)) return; to(o.name, { t: 'mb_join', from: name }); to(name, { t: 'mb_note', text: 'Kérés elküldve: ' + o.name }); }
      else if (t === 'mb_joinok') { const r = String(m.from || ''); if (!(u.friends || []).includes(r) || !online.get(r) || !online.get(name)) return;
        let p = [...parties.values()].find(p => p.members.includes(name));
        if (!p) { p = { id: crypto.randomBytes(6).toString('hex'), leader: name, members: [name], ready: {} }; parties.set(p.id, p); online.get(name).party = p.id; }
        if (p.members.includes(r)) return; if (p.members.length >= 4) return to(name, { t: 'mb_note', text: 'A parti megtelt.' });
        leaveParty(r); p.members.push(r); online.get(r).party = p.id; sendParty(p); to(r, { t: 'mb_note', text: '✅ Csatlakoztál ' + name + ' partijához!' }); }
      // --- 14. moderálás ---
      else if (t === 'mb_mute') { const n = String(m.name || '').slice(0, 20); u.mbMutes = (u.mbMutes || []).filter(x => x !== n); if (m.on && U(n)) u.mbMutes.push(U(n).name); save(); to(name, { t: 'mb_mutes', list: u.mbMutes }); }
      else if (t === 'mb_report') { const o = U(m.name); if (!o || o.name === name || lim('r', 3, 60000)) return; o.mbRep = (o.mbRep || []).filter(r => now() - r.t < 3600e3 && r.by !== name); o.mbRep.push({ by: name, t: now(), why: String(m.why || '').slice(0, 120) });
        if (o.mbRep.length >= 3) { o.mbMuteT = now() + 15 * 60e3; to(o.name, { t: 'mb_note', text: '🔇 Több jelentés miatt 15 percre némítva vagy.' }); }
        save(); to(name, { t: 'mb_note', text: 'Köszönjük, a jelentést rögzítettük (' + o.name + ').' }); }
      // --- 15. kereskedés ---
      else if (t === 'mb_tr_req') { const o = U(m.to); if (!o || o.name === name || !cl.get(o.name) || trades.has(name) || trades.has(o.name)) return to(name, { t: 'mb_note', text: 'A kereskedés most nem indítható.' }); to(o.name, { t: 'mb_tr_req', from: name }); }
      else if (t === 'mb_tr_acc') { const r = String(m.from || ''); if (!cl.get(r) || trades.has(r) || trades.has(name)) return; const tr = { a: r, b: name, off: { [r]: { ft: 0, zs: 0, items: [] }, [name]: { ft: 0, zs: 0, items: [] } }, ok: {} }; trades.set(r, tr); trades.set(name, tr); trSend(tr); }
      else if (t === 'mb_tr_off') { const tr = trades.get(name); if (!tr) return; const off = { ft: m.ft, zs: m.zs, items: Array.isArray(m.items) ? m.items : [] }; const e = trCheck(name, off); if (e) return to(name, { t: 'mb_note', text: e }); tr.off[name] = off; tr.ok = {}; trSend(tr); }
      else if (t === 'mb_tr_ok') { const tr = trades.get(name); if (!tr) return; tr.ok[name] = true; trSend(tr);
        if (tr.ok[tr.a] && tr.ok[tr.b]) {
          const A = U(tr.a), B = U(tr.b), oa = tr.off[tr.a], ob = tr.off[tr.b]; const e = trCheck(tr.a, oa) || trCheck(tr.b, ob); if (e) return trEnd(tr, 'Ellenőrzés sikertelen: ' + e);
          applyEco(A, ob.ft - oa.ft, ob.zs - oa.zs, ob.items, oa.items); applyEco(B, oa.ft - ob.ft, oa.zs - ob.zs, oa.items, ob.items);
          to(tr.a, { t: 'mb_tr_done', dft: ob.ft - oa.ft, dzs: ob.zs - oa.zs, add: ob.items, rem: oa.items, with: tr.b });
          to(tr.b, { t: 'mb_tr_done', dft: oa.ft - ob.ft, dzs: oa.zs - ob.zs, add: oa.items, rem: ob.items, with: tr.a });
          [tr.a, tr.b].forEach(n => trades.delete(n)); save(); console.log('[mod_B] kereskedés:', tr.a, JSON.stringify(oa), '<->', tr.b, JSON.stringify(ob));
        } }
      else if (t === 'mb_tr_x') { const tr = trades.get(name); if (tr) trEnd(tr, name + ' megszakította.'); }
      // --- 26. póker ---
      else if (t === 'mb_pk_list') { ws.__mbWatch = null; to(name, { t: 'mb_pk_list', list: [...tables.values()].map(t => ({ id: t.id, name: t.name, n: t.seats.filter(Boolean).length, max: SEATS })), sb: SB, bb: BB }); }
      else if (t === 'mb_pk_watch') { const tb = tables.get(m.id); if (!tb) return; ws.__mbWatch = tb.id; out(ws, pkState(tb)); const ps = pkSeat(name); if (ps && ps.t === tb && ps.s.cards && tb.hand) to(name, { t: 'mb_pk_hole', id: tb.id, cards: ps.s.cards }); }
      else if (t === 'mb_pk_sit') { const tb = tables.get(m.id); if (!tb || pkSeat(name)) return; const buy = Math.floor(+m.buy || 0); if (buy < 200 || buy > 20000) return to(name, { t: 'mb_note', text: 'Beszálló: 200–20 000 zseton.' });
        if (buy > ecoZ(u)) return to(name, { t: 'mb_note', text: 'Nincs ennyi zsetonod a szerveres mentés szerint (' + Math.floor(ecoZ(u)) + '). Várj, míg a felhőmentés lefut (~20 mp).' });
        const i = tb.seats.findIndex(x => !x); if (i < 0) return to(name, { t: 'mb_note', text: 'Az asztal megtelt.' });
        applyEco(u, 0, -buy, [], []); tb.seats[i] = { name, stack: buy, bet: 0 }; ws.__mbWatch = tb.id; to(name, { t: 'mb_pk_buy', zs: buy, tb: tb.name }); pkCast(tb); pkMaybeStart(tb); }
      else if (t === 'mb_pk_act') { const ps = pkSeat(name); if (ps) pkAct(ps.t, ps.i, String(m.a), m.v); }
      else if (t === 'mb_pk_leave') { const ps = pkSeat(name); if (ps) pkLeave(ps.t, ps.i); }
    });
    ws.on('close', () => {
      if (cl.get(name) !== ws) return; cl.delete(name); unq(name);
      const M = matchOf(name); if (M) { die(M, name, null); inMatch.delete(name); }
      const tr = trades.get(name); if (tr) trEnd(tr, name + ' kilépett.');
      const ps = pkSeat(name); if (ps) pkLeave(ps.t, ps.i);
    });
  });
  module.exports._t = { censor, evalHand, ev5, div };
  console.log('  [mod_B] többjátékos modul betöltve');
};
