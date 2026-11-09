// mod_D.js – D Claude szerver-bővítése (/api/d/*): heti nyerőgép-bajnokság, gazdaság-figyelő,
// klánháború (hétvége), szerveres Közgram, promókód-statisztika, pályamegosztás.
// Bekötés: server.js-ben 1 sor a http.createServer előtt – ez a modul becsomagolja a createServer handlerét.
const http = require('http'), fs = require('fs'), path = require('path');
module.exports = function (C) {
  // C: { db:()=>db, save, auth, send, body, limited }
  const DFILE = path.join(process.env.DATA_DIR || __dirname, 'mod_D.json');
  let D = { slot: {}, slotWin: {}, posts: [], maps: [], war: {}, seq: 1 };
  const ST = C.store && C.store.ok ? C.store : null; // SQL (meta 'mod_D'), különben mod_D.json
  try { D = Object.assign(D, JSON.parse((ST && ST.getMeta('mod_D')) || fs.readFileSync(DFILE, 'utf8'))); } catch (e) {}
  let tm = null; const saveD = () => { clearTimeout(tm); tm = setTimeout(() => ST ? (() => { try { ST.setMeta('mod_D', JSON.stringify(D)); } catch (e) { console.log('[mod_D] SQL hiba', e.message); } })() : fs.writeFile(DFILE + '.tmp', JSON.stringify(D), e => { if (!e) fs.rename(DFILE + '.tmp', DFILE, () => {}); }), 400); };
  const send = C.send, num = (v, a, b) => Math.max(a, Math.min(b, Math.floor(+v || 0)));
  const weekKey = (t) => { const d = new Date(t || Date.now()); const m = new Date(d); m.setHours(0, 0, 0, 0); m.setDate(m.getDate() - ((m.getDay() + 6) % 7)); return m.getFullYear() + '-' + (m.getMonth() + 1) + '-' + m.getDate(); };
  const weekStart = (t) => { const d = new Date(t || Date.now()); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); };
  const BAD = /(kurva|geci|fasz|picsa|bazdmeg|buzi|cigány|nigg)/i;
  const clean = s => String(s || '').replace(/[<>]/g, '').trim();
  const SLOT_RW = [[3000, 150000], [1500, 80000], [800, 40000], [300, 15000], [300, 15000]]; // [zseton, Ft] helyezés szerint, a többi résztvevő 50 zs

  function slotRoll() { // ha új hét van, a régi hetet lezárja és kiosztja a jutalmakat
    const wk = weekKey(); if (D.slot.wk === wk) return; const old = D.slot;
    if (old.wk && old.e) { const arr = Object.values(old.e).sort((a, b) => b.win - a.win);
      arr.forEach((x, i) => { const r = SLOT_RW[i] || [50, 0]; D.slotWin[x.n.toLowerCase()] = { wk: old.wk, place: i + 1, zs: r[0], ft: r[1], cl: false }; });
      D.slotLast = { wk: old.wk, top: arr.slice(0, 10) }; }
    D.slot = { wk, e: {} }; saveD();
  }
  function warInfo() { // hétvégi klánháború: szombat 00:00 – vasárnap 23:59, pont = kiesés + 10/győzelem a meccsnaplóból
    const db = C.db(), now = new Date(), ws = weekStart(), sat = ws + 5 * 864e5, end = ws + 7 * 864e5; const live = now >= sat && now < end;
    const from = live ? sat : sat - 7 * 864e5, to = live ? end : sat; const tagOf = {};
    Object.values(db.users).forEach(u => { if (u.clan && db.clans && db.clans[u.clan]) tagOf[u.name] = u.clan; });
    const pts = {}; (db.feed || []).forEach(f => { if (f.t >= from && f.t < to && tagOf[f.n]) { const k = tagOf[f.n]; pts[k] = pts[k] || { p: 0, m: 0, who: {} }; const v = (f.k || 0) + (f.win ? 10 : 0); pts[k].p += v; pts[k].m++; pts[k].who[f.n] = (pts[k].who[f.n] || 0) + v; } });
    const list = Object.entries(pts).map(([k, v]) => { const c = db.clans[k] || {}; return { key: k, tag: c.tag || k, name: c.name || '', emb: c.emb || '🛡️', p: v.p, m: v.m, best: Object.entries(v.who).sort((a, b) => b[1] - a[1])[0] }; }).sort((a, b) => b.p - a.p);
    const wkId = weekKey(from); if (!live && list.length && !D.war[wkId]) { D.war[wkId] = { win: list[0].key, tag: list[0].tag, p: list[0].p, cl: [] }; saveD(); }
    return { live, from, to, next: live ? end : (now < sat ? sat : sat + 7 * 864e5), list, wkId, res: D.war[wkId] || null };
  }

  async function handle(req, res, url) {
    const P = url.pathname.slice(7), u = C.auth(req), db = C.db(), M = req.method;
    const need = () => { if (!u) { send(res, 401, { error: 'Előbb jelentkezz be!' }); return true; } return false; };
    // ---------- 25: heti nyerőgép-bajnokság ----------
    if (P === 'slot/top') { slotRoll(); const e = Object.values(D.slot.e);
      return send(res, 200, { wk: D.slot.wk, ends: weekStart() + 7 * 864e5, win: e.slice().sort((a, b) => b.win - a.win).slice(0, 15), mult: e.slice().sort((a, b) => b.mult - a.mult).slice(0, 15), last: D.slotLast || null, rw: SLOT_RW, me: u ? D.slot.e[u.name.toLowerCase()] || null : null, prize: u ? D.slotWin[u.name.toLowerCase()] || null : null }); }
    if (P === 'slot/rep' && M === 'POST') { if (need()) return; if (C.limited('dslot:' + u.name, 40, 60000)) return send(res, 429, { error: 'Lassabban!' });
      slotRoll(); const b = await C.body(req); const bet = num(b.bet, 1, 100000), win = num(b.win, 0, bet * 1000); const mult = Math.round(win / bet * 10) / 10;
      const k = u.name.toLowerCase(), x = D.slot.e[k] || { n: u.name, win: 0, mult: 0, spins: 0, t: 0 }; x.spins++; if (win > x.win) { x.win = win; x.t = Date.now(); } if (mult > x.mult) x.mult = mult; D.slot.e[k] = x; saveD();
      return send(res, 200, { ok: true, me: x }); }
    if (P === 'slot/claim' && M === 'POST') { if (need()) return; slotRoll(); const p = D.slotWin[u.name.toLowerCase()]; if (!p || p.cl) return send(res, 400, { error: 'Nincs átvehető jutalom.' }); p.cl = true; saveD(); return send(res, 200, { ok: true, zs: p.zs, ft: p.ft, place: p.place, wk: p.wk }); }
    // ---------- 28: gazdaság-figyelő ----------
    if (P === 'eco' && M === 'POST') { if (need()) return; const b = await C.body(req); u.dEco = { ft: num(b.ft, 0, 1e13), zs: num(b.zs, 0, 1e10), t: Date.now() }; C.save(); return send(res, 200, { ok: true }); }
    if (P === 'eco') { const a = Object.values(db.users).filter(x => x.dEco && Date.now() - x.dEco.t < 30 * 864e5).map(x => x.dEco); const ft = a.map(x => x.ft).sort((p, q) => p - q), zs = a.reduce((s, x) => s + x.zs, 0);
      D.ecoH = D.ecoH || []; const day = new Date().toDateString(), tot = ft.reduce((s, v) => s + v, 0); if (!D.ecoH.length || D.ecoH[D.ecoH.length - 1].d !== day) { D.ecoH.push({ d: day, ft: tot, zs, n: a.length }); if (D.ecoH.length > 30) D.ecoH.shift(); saveD(); } else { Object.assign(D.ecoH[D.ecoH.length - 1], { ft: tot, zs, n: a.length }); }
      return send(res, 200, { n: a.length, ft: tot, zs, med: ft.length ? ft[ft.length >> 1] : 0, max: ft.length ? ft[ft.length - 1] : 0, rich: ft.filter(v => v >= 1e8).length, hist: D.ecoH }); }
    // ---------- 43: klánháború ----------
    if (P === 'war') { const w = warInfo(); let mine = null; if (u && u.clan && db.clans && db.clans[u.clan]) mine = u.clan; const canCl = !!(u && w.res && w.res.win === mine && !w.res.cl.includes(u.name)); return send(res, 200, { live: w.live, from: w.from, to: w.to, next: w.next, list: w.list.slice(0, 20), res: w.res, mine, canCl }); }
    if (P === 'war/claim' && M === 'POST') { if (need()) return; const w = warInfo(); if (!w.res || w.res.win !== u.clan || w.res.cl.includes(u.name)) return send(res, 400, { error: 'Nincs átvehető klánjutalom.' }); w.res.cl.push(u.name); saveD(); return send(res, 200, { ok: true, zs: 500, ft: 50000 }); }
    // ---------- 44: szerveres Közgram ----------
    if (P === 'gram') { const me = u ? u.name : ''; const list = D.posts.filter(p => !p.hid).slice(-40).reverse().map(p => ({ id: p.id, n: p.n, av: p.av, txt: p.txt, img: p.img, t: p.t, likes: p.likes.length, liked: p.likes.includes(me), com: p.com.slice(-20), mine: p.n === me })); return send(res, 200, { list }); }
    if (P === 'gram/post' && M === 'POST') { if (need()) return; if (C.limited('dgram:' + u.name, 5, 600000)) return send(res, 429, { error: 'Legfeljebb 5 poszt 10 percenként.' });
      let b; try { b = await C.body(req, 200000); } catch (e) { return send(res, 413, { error: 'A kép túl nagy (max ~140 KB).' }); }
      const txt = clean(b.txt).slice(0, 200), img = String(b.img || ''); if (BAD.test(txt)) return send(res, 400, { error: 'A szöveg nem megengedett szót tartalmaz.' });
      if (img && (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(img) || img.length > 190000)) return send(res, 400, { error: 'Érvénytelen vagy túl nagy kép (max ~140 KB).' });
      if (!txt && !img) return send(res, 400, { error: 'Üres poszt.' });
      D.posts.push({ id: D.seq++, n: u.name, av: u.avatar || '😎', txt, img, t: Date.now(), likes: [], com: [], rep: [] }); if (D.posts.length > 150) D.posts = D.posts.slice(-150); saveD(); return send(res, 200, { ok: true }); }
    if (P.startsWith('gram/') && M === 'POST') { if (need()) return; const b = await C.body(req); const p = D.posts.find(x => x.id === +b.id); if (!p) return send(res, 404, { error: 'Nincs ilyen poszt.' });
      if (P === 'gram/like') { const i = p.likes.indexOf(u.name); i < 0 ? p.likes.push(u.name) : p.likes.splice(i, 1); }
      else if (P === 'gram/com') { if (C.limited('dcom:' + u.name, 10, 60000)) return send(res, 429, { error: 'Lassabban!' }); const t = clean(b.txt).slice(0, 120); if (!t) return send(res, 400, { error: 'Üres.' }); if (BAD.test(t)) return send(res, 400, { error: 'Nem megengedett szó.' }); p.com.push({ n: u.name, t, at: Date.now() }); if (p.com.length > 50) p.com.shift(); }
      else if (P === 'gram/rep') { if (!p.rep.includes(u.name)) p.rep.push(u.name); if (p.rep.length >= 3) p.hid = 1; }
      else if (P === 'gram/del') { if (p.n !== u.name) return send(res, 403, { error: 'Csak a saját posztod törölheted.' }); p.hid = 1; }
      else return send(res, 404, { error: 'Ismeretlen.' });
      saveD(); return send(res, 200, { ok: true }); }
    // ---------- 45: promókód-statisztika ----------
    if (P === 'promo') { if (need()) return; const pr = db.promos || {}; const days = 14, d0 = Date.now() - days * 864e5;
      const mine = Object.entries(pr).filter(([, p]) => p.by === u.name).map(([c, p]) => { const per = Array(days).fill(0); p.uses.forEach(x => { if (x.t >= d0) per[Math.min(days - 1, Math.floor((x.t - d0) / 864e5))]++; }); return { code: c, t: p.t, uses: p.uses.length, uniq: new Set(p.uses.map(x => x.n)).size, per, who: p.uses.slice(-30).reverse() }; });
      const top = Object.entries(pr).map(([c, p]) => ({ code: p.by ? c.slice(0, 3) + '…' : c, by: p.by || 'rendszer', uses: p.uses.length })).sort((a, b) => b.uses - a.uses).slice(0, 10);
      return send(res, 200, { mine, top, total: Object.values(pr).reduce((s, p) => s + p.uses.length, 0) }); }
    // ---------- 46: pályamegosztás ----------
    if (P === 'maps') { const s = url.searchParams.get('s') || 'top'; const me = u ? u.name : ''; const L = D.maps.filter(m => !m.hid).map(m => { const v = Object.values(m.r); return { id: m.id, n: m.n, name: m.name, t: m.t, dl: m.dl, cnt: Object.keys(m.cells).length, avg: v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length * 10) / 10 : 0, votes: v.length, my: m.r[me] || 0, mine: m.n === me, cells: m.cells }; });
      L.sort(s === 'new' ? (a, b) => b.t - a.t : s === 'dl' ? (a, b) => b.dl - a.dl : (a, b) => b.avg - a.avg || b.votes - a.votes); return send(res, 200, { list: L.slice(0, 40) }); }
    if (P === 'maps/up' && M === 'POST') { if (need()) return; if (C.limited('dmap:' + u.name, 5, 600000)) return send(res, 429, { error: 'Lassabban!' }); const b = await C.body(req, 40000);
      const name = clean(b.name).slice(0, 30); if (!name || BAD.test(name)) return send(res, 400, { error: 'Adj meg rendes nevet!' }); const cells = {};
      Object.entries(b.cells || {}).slice(0, 256).forEach(([k, v]) => { if (/^(1[0-5]|\d),(1[0-5]|\d)$/.test(k)) cells[k] = num(v, 0, 4); }); if (Object.keys(cells).length < 3) return send(res, 400, { error: 'Legalább 3 elem kell a pályán.' });
      if (D.maps.filter(m => m.n === u.name && !m.hid).length >= 10) return send(res, 400, { error: 'Legfeljebb 10 feltöltött pályád lehet.' });
      D.maps.push({ id: D.seq++, n: u.name, name, cells, t: Date.now(), dl: 0, r: {} }); saveD(); return send(res, 200, { ok: true }); }
    if (P.startsWith('maps/') && M === 'POST') { if (need()) return; const b = await C.body(req); const m = D.maps.find(x => x.id === +b.id && !x.hid); if (!m) return send(res, 404, { error: 'Nincs ilyen pálya.' });
      if (P === 'maps/dl') m.dl++; else if (P === 'maps/rate') { if (m.n === u.name) return send(res, 400, { error: 'A saját pályádat nem értékelheted.' }); m.r[u.name] = num(b.s, 1, 5); } else if (P === 'maps/del') { if (m.n !== u.name) return send(res, 403, { error: 'Csak a sajátod.' }); m.hid = 1; } else return send(res, 404, { error: 'Ismeretlen.' });
      saveD(); return send(res, 200, { ok: true, cells: m.cells }); }
    return send(res, 404, { error: 'Ismeretlen.' });
  }
  const orig = http.createServer;
  http.createServer = function (...a) { const h = a.find(x => typeof x === 'function'); if (!h) return orig.apply(http, a); const i = a.indexOf(h);
    a[i] = (req, res) => { if (req.url.startsWith('/api/d/')) { const url = new URL(req.url, 'http://x'); handle(req, res, url).catch(e => { try { send(res, 400, { error: 'Hibás kérés.' }); } catch (_) {} }); return; } return h(req, res); };
    http.createServer = orig; return orig.apply(http, a); };
};
