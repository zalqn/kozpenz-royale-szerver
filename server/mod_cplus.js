// mod_cplus.js – 🌐 KASZINÓ+ PIAC (szerveroldali gazdaság, minden a fiókhoz kötve, SQLite saját táblákban).
// Táblák (store.sql): cp_acct (fiók-állapot: VIP-forgalom, napi bónusz, migráció), cp_hold (részvény/KözCoin/jármű),
// cp_parcels (48 telek 8 kerületben – tulaj, szint, bérleti idő, zár), cp_market (árfolyamok + előzmény),
// cp_offers (piaci/célzott ajánlatok, letétben tartott áruval), cp_auct (aukciók licittel, lejárattal, pénz-letéttel),
// cp_log (tranzakciós napló), cp_news (napi piaci hírek).
// Pénz: a felhőmentés k3c (Ft) / k3br.zs (zseton) mezője + u.mbEco igazítás – ugyanaz az út, mint a mod_B kereskedés és a mod_admin pénzadás.
// A kérő kliens a válaszban kapja a változást (dft/dzs/add/rem), a másik fél (ha online) WS 'cp_eco' üzenetben.
// Minden művelet szinkron, egy SQL-tranzakcióban → dupla kattintás / egyszerre küldött kérés nem dupláz.
// Bekötés: server.js 1 require sor a mod_admin után (a request-kezelőt becsomagolja: /api/cp/* és /api/admin/cp/*).
const fs = require('fs');
module.exports = function (o) {
  const { server, sessions, online, save, store, send, body, saveFile } = o;
  const db = o.db;
  if (!store || !store.ok || !store.sql) { console.log('[mod_cplus] SQL nem elérhető – a piac ki van kapcsolva'); return; }
  const sql = store.sql, now = () => Date.now();
  const U = n => db().users[String(n || '').toLowerCase()];
  const num = v => { const x = Number(v); return isFinite(x) ? x : 0; };
  const int = v => Math.floor(num(v));
  const today = () => new Date().toISOString().slice(0, 10);

  sql.exec(`
CREATE TABLE IF NOT EXISTS cp_acct (user TEXT PRIMARY KEY, turn REAL DEFAULT 0, bonusDay TEXT DEFAULT '', migr INTEGER DEFAULT 0, dep TEXT DEFAULT '{}', t INTEGER);
CREATE TABLE IF NOT EXISTS cp_hold (user TEXT, kind TEXT, item TEXT, qty REAL, PRIMARY KEY(user, kind, item));
CREATE TABLE IF NOT EXISTS cp_parcels (id TEXT PRIMARY KEY, d INTEGER, name TEXT, base INTEGER, owner TEXT, lv INTEGER DEFAULT 0, rt INTEGER DEFAULT 0, lock TEXT, t INTEGER);
CREATE TABLE IF NOT EXISTS cp_market (k TEXT PRIMARY KEY, price REAL, hist TEXT, t INTEGER);
CREATE TABLE IF NOT EXISTS cp_offers (id INTEGER PRIMARY KEY AUTOINCREMENT, seller TEXT, kind TEXT, item TEXT, qty REAL, price INTEGER, cur TEXT, target TEXT, status TEXT, buyer TEXT, t INTEGER, t2 INTEGER);
CREATE TABLE IF NOT EXISTS cp_auct (id INTEGER PRIMARY KEY AUTOINCREMENT, seller TEXT, kind TEXT, item TEXT, qty REAL, cur TEXT, start INTEGER, top INTEGER, topUser TEXT, bids INTEGER DEFAULT 0, ends INTEGER, status TEXT, t INTEGER);
CREATE TABLE IF NOT EXISTS cp_log (id INTEGER PRIMARY KEY AUTOINCREMENT, t INTEGER, user TEXT, other TEXT, act TEXT, kind TEXT, item TEXT, qty REAL, amt INTEGER, cur TEXT, info TEXT);
CREATE TABLE IF NOT EXISTS cp_news (day TEXT PRIMARY KEY, j TEXT);
CREATE INDEX IF NOT EXISTS cp_log_u ON cp_log(user, t);
CREATE INDEX IF NOT EXISTS cp_off_s ON cp_offers(status);
CREATE INDEX IF NOT EXISTS cp_auct_s ON cp_auct(status);`);

  // ---------- katalógus (kitalált nevek) ----------
  const CO = [['PSZT', 'Pusztai Szél Energia', 1200, 0.012], ['GULY', 'Gulyás Gépgyár', 800, 0.01], ['DUNA', 'Dunakavics Logisztika', 2500, 0.01], ['TOKJ', 'Tokaji Arany Borház', 1800, 0.015], ['KZTR', 'Köztér Robotika', 4000, 0.022], ['LANG', 'Lángos Lánc', 350, 0.018], ['PAPU', 'Paprikás Űrtechnika', 6000, 0.03], ['KC', 'KözCoin', 400, 0.025]];
  const COK = Object.fromEntries(CO.map(c => [c[0], c]));
  const VEH = { golf: ['⛳ Közkert golfkocsi', 150000], traktor: ['🚜 Szövetkezeti traktor', 300000], henger: ['🛞 Közbeszerzési úthenger', 600000], hover: ['🛸 Lebegő Lapát', 450000] };
  const DIST = [ // név, x, y, w, h (600×400-as térképen), alapár
    ['Pecsétváros', 20, 20, 170, 110, 2500000], ['Kiskapu-negyed', 210, 20, 180, 110, 1200000], ['Pályázati liget', 410, 20, 170, 110, 800000], ['Tenderpart', 20, 150, 170, 110, 6000000],
    ['Aktatáska-sor', 210, 150, 180, 110, 15000000], ['Kenőpénz-domb', 410, 150, 170, 110, 4000000], ['Közpark-lakótelep', 20, 280, 270, 100, 400000], ['Óvárosi Hivatalnegyed', 310, 280, 270, 100, 9000000]];
  const LOTN = ['Sarokház', 'Bérház', 'Üzletsor', 'Irodaház', 'Raktár', 'Villa', 'Garázssor', 'Panel', 'Műhely', 'Kávézó'];
  const PLV = ['Alap', 'Felújított', 'Prémium', 'Luxus'];
  { const ins = sql.prepare('INSERT OR IGNORE INTO cp_parcels(id,d,name,base,owner,lv,rt,lock,t) VALUES(?,?,?,?,NULL,0,0,NULL,0)');
    DIST.forEach((d, di) => { for (let i = 0; i < 6; i++) { const f = [0.7, 0.85, 1, 1.15, 1.35, 1.6][i]; ins.run('P' + di + i, di, LOTN[(di * 3 + i) % LOTN.length] + ' ' + (i + 1), Math.round(d[5] * f / 1000) * 1000); } }); }
  { const ins = sql.prepare('INSERT OR IGNORE INTO cp_market(k,price,hist,t) VALUES(?,?,?,?)'); CO.forEach(c => ins.run(c[0], c[2], JSON.stringify([c[2]]), now())); }

  // ---------- VIP (forgalom alapján) ----------
  const VIP = [['Bronz', 0, 0.05, 5, 0, 0], ['Ezüst', 1e6, 0.04, 8, 5000, 0.05], ['Arany', 5e6, 0.03, 12, 20000, 0.1], ['Platina', 2e7, 0.02, 20, 60000, 0.15], ['Gyémánt', 1e8, 0.01, 30, 150000, 0.2]]; // név, forgalom, díj, max ajánlat, napi bónusz, bérleti +%
  const Q = {
    acct: sql.prepare('SELECT * FROM cp_acct WHERE user=?'), acctIns: sql.prepare('INSERT OR IGNORE INTO cp_acct(user,turn,bonusDay,migr,dep,t) VALUES(?,0,\'\',0,\'{}\',?)'),
    turn: sql.prepare('UPDATE cp_acct SET turn=turn+? WHERE user=?'), bonus: sql.prepare('UPDATE cp_acct SET bonusDay=? WHERE user=?'), migr: sql.prepare('UPDATE cp_acct SET migr=? WHERE user=?'), dep: sql.prepare('UPDATE cp_acct SET dep=? WHERE user=?'),
    hold: sql.prepare('SELECT kind,item,qty FROM cp_hold WHERE user=? AND qty>0'), hGet: sql.prepare('SELECT qty FROM cp_hold WHERE user=? AND kind=? AND item=?'),
    hPut: sql.prepare('INSERT INTO cp_hold(user,kind,item,qty) VALUES(?,?,?,?) ON CONFLICT(user,kind,item) DO UPDATE SET qty=excluded.qty'),
    pAll: sql.prepare('SELECT * FROM cp_parcels ORDER BY id'), pGet: sql.prepare('SELECT * FROM cp_parcels WHERE id=?'), pMine: sql.prepare('SELECT * FROM cp_parcels WHERE owner=?'),
    pSet: sql.prepare('UPDATE cp_parcels SET owner=?, lv=?, rt=?, lock=?, t=? WHERE id=?'), pRt: sql.prepare('UPDATE cp_parcels SET rt=? WHERE id=?'), pLock: sql.prepare('UPDATE cp_parcels SET lock=? WHERE id=?'),
    mAll: sql.prepare('SELECT * FROM cp_market'), mSet: sql.prepare('UPDATE cp_market SET price=?, hist=?, t=? WHERE k=?'),
    oIns: sql.prepare('INSERT INTO cp_offers(seller,kind,item,qty,price,cur,target,status,buyer,t,t2) VALUES(?,?,?,?,?,?,?,\'open\',NULL,?,0)'),
    oGet: sql.prepare('SELECT * FROM cp_offers WHERE id=?'), oOpen: sql.prepare('SELECT * FROM cp_offers WHERE status=\'open\' ORDER BY id DESC LIMIT 300'),
    oCnt: sql.prepare('SELECT COUNT(*) n FROM cp_offers WHERE status=\'open\' AND seller=?'), oSet: sql.prepare('UPDATE cp_offers SET status=?, buyer=?, t2=? WHERE id=? AND status=\'open\''),
    aIns: sql.prepare('INSERT INTO cp_auct(seller,kind,item,qty,cur,start,top,topUser,bids,ends,status,t) VALUES(?,?,?,?,?,?,0,NULL,0,?,\'open\',?)'),
    aGet: sql.prepare('SELECT * FROM cp_auct WHERE id=?'), aOpen: sql.prepare('SELECT * FROM cp_auct WHERE status=\'open\' ORDER BY ends LIMIT 300'),
    aDue: sql.prepare('SELECT * FROM cp_auct WHERE status=\'open\' AND ends<=?'), aCnt: sql.prepare('SELECT COUNT(*) n FROM cp_auct WHERE status=\'open\' AND seller=?'),
    aBid: sql.prepare('UPDATE cp_auct SET top=?, topUser=?, bids=bids+1, ends=? WHERE id=? AND status=\'open\''), aSet: sql.prepare('UPDATE cp_auct SET status=? WHERE id=? AND status=\'open\''),
    aRecent: sql.prepare('SELECT * FROM cp_auct WHERE status!=\'open\' ORDER BY id DESC LIMIT 30'),
    log: sql.prepare('INSERT INTO cp_log(t,user,other,act,kind,item,qty,amt,cur,info) VALUES(?,?,?,?,?,?,?,?,?,?)'),
    logU: sql.prepare('SELECT * FROM cp_log WHERE user=? ORDER BY id DESC LIMIT ?'), logAll: sql.prepare('SELECT * FROM cp_log ORDER BY id DESC LIMIT ?'),
    nGet: sql.prepare('SELECT j FROM cp_news WHERE day=?'), nPut: sql.prepare('INSERT OR REPLACE INTO cp_news(day,j) VALUES(?,?)')
  };
  const acct = n => { Q.acctIns.run(n, now()); return Q.acct.get(n); };
  const vipOf = n => { const a = acct(n); let i = 0; VIP.forEach((v, k) => { if (a.turn >= v[1]) i = k; }); return { i, n: VIP[i][0], fee: VIP[i][2], maxOff: VIP[i][3], bonus: VIP[i][4], rentB: VIP[i][5], turn: a.turn, next: VIP[i + 1] ? VIP[i + 1][1] : null }; };
  const logTx = (user, other, act, kind, item, qty, amt, cur, info) => Q.log.run(now(), user, other || '', act, kind || '', String(item || ''), num(qty), int(amt), cur || '', info || '');

  // ---------- felhőmentés (pénz) – mod_B applyEco mintájára ----------
  function rdSave(u) { try { const j = store.readSave(u.name); return j ? JSON.parse(j) : { t: 0, d: {} }; } catch (e) { return { t: 0, d: {} }; } }
  function bal(u) { const s = rdSave(u), d = s.d || {}; let b = {}; try { b = JSON.parse(d.k3br || '{}'); } catch (e) {} return { ft: num(d.k3c), zs: num(b.zs), own: b.own || {} }; }
  // Sorszámozott változások (u.cpSeq / u.cpPend): a szerver a felhőmentésbe írja az értéket ÉS a sorszámot (d.k3cpSeq lista).
  // Ha a kliens egy régebbi (a változást még nem tartalmazó) mentést tölt fel, a /api/save utófeldolgozás hozzáadja a hiányzó tételeket
  // → elavult feltöltés / elveszett WS-üzenet nem okoz eltérést, és a kliens oldali alkalmazás sorszám szerint idempotens.
  let DEF = null, CTX = null; // tranzakció alatt halasztott mellékhatások (memória, WS) – csak sikeres COMMIT után futnak
  const later = f => { if (DEF) DEF.push(f); else f(); };
  function runTx(fn) { DEF = []; let r; try { store.tx(() => { r = fn(); }); } catch (e) { DEF = null; throw e; } const q = DEF; DEF = null; q.forEach(f => { try { f(); } catch (e) { console.log('[mod_cplus] utóművelet hiba', e.message); } }); return r; }
  const seqList = d => { try { const a = JSON.parse(d.k3cpSeq || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  function applyEco(u, dft, dzs, add, rem) {
    const s = rdSave(u); s.d = s.d || {};
    s.d.k3c = String(Math.max(0, Math.round(num(s.d.k3c) + dft)));
    let b = {}; try { b = JSON.parse(s.d.k3br || '{}'); } catch (e) {}
    b.own = b.own || {}; b.zs = Math.max(0, Math.round(num(b.zs) + dzs));
    (rem || []).forEach(k => { delete b.own[k]; if (b.eq) for (const sl in b.eq) if (b.eq[sl] === k) delete b.eq[sl]; });
    (add || []).forEach(k => b.own[k] = 1);
    s.d.k3br = JSON.stringify(b);
    const seq = u.cpSeq = (u.cpSeq | 0) + 1; const L = seqList(s.d); L.push(seq); s.d.k3cpSeq = JSON.stringify(L.slice(-300));
    s.t = now(); store.writeSave(u.name, JSON.stringify(s), s.t);
    later(() => { u.saveT = s.t; u.cpPend = (u.cpPend || []).concat([{ s: seq, ft: dft, zs: dzs, add: add || [], rem: rem || [] }]).slice(-300);
      if (u.mbEco) { u.mbEco.c = Math.max(0, num(u.mbEco.c) + dft); u.mbEco.zs = Math.max(0, num(u.mbEco.zs) + dzs); u.mbEco.al = num(u.mbEco.al) + Math.max(0, dft); u.mbEco.alz = num(u.mbEco.alz) + Math.max(0, dzs); } });
    if (CTX && CTX.user === u.name) CTX.seqs.push(seq);
    return seq;
  }
  // /api/save után: a feltöltött mentésből hiányzó szerveres tételek pótlása
  function fixSave(u) {
    if (!u || !(u.cpPend && u.cpPend.length)) return;
    try { runTx(() => {
      const s = rdSave(u); if (!s.d) return; const L = seqList(s.d), have = new Set(L);
      const miss = u.cpPend.filter(p => !have.has(p.s)), acked = new Set(u.cpPend.filter(p => have.has(p.s)).map(p => p.s));
      later(() => { u.cpPend = u.cpPend.filter(p => !acked.has(p.s) || miss.includes(p)); });
      if (!miss.length) return;
      let dft = 0, dzs = 0; let b = {}; try { b = JSON.parse(s.d.k3br || '{}'); } catch (e) {} b.own = b.own || {};
      miss.forEach(p => { dft += p.ft; dzs += p.zs; (p.rem || []).forEach(k => delete b.own[k]); (p.add || []).forEach(k => b.own[k] = 1); L.push(p.s); });
      s.d.k3c = String(Math.max(0, Math.round(num(s.d.k3c) + dft))); b.zs = Math.max(0, Math.round(num(b.zs) + dzs)); s.d.k3br = JSON.stringify(b); s.d.k3cpSeq = JSON.stringify(L.slice(-300));
      s.t = now(); store.writeSave(u.name, JSON.stringify(s), s.t);
      later(() => { u.saveT = s.t; if (u.mbEco) { u.mbEco.c = Math.max(0, num(u.mbEco.c) + dft); u.mbEco.zs = Math.max(0, num(u.mbEco.zs) + dzs); } });
      console.log('[mod_cplus] elavult feltöltés pótolva:', u.name, miss.length, 'tétel', dft, 'Ft', dzs, 'zs');
    }); } catch (e) { console.log('[mod_cplus] fixSave hiba', e.message); }
  }
  const outWs = (n, m) => { const c = online.get(n); if (c) try { c.ws.readyState === 1 && c.ws.send(JSON.stringify(m)); } catch (e) {} };
  // a MÁSIK félnek (nem a kérőnek) jóváírás: mentés + élő kliens (WS a COMMIT után)
  function credit(name, dft, dzs, add, rem, why) { const u = U(name); if (!u) return; const seq = applyEco(u, dft, dzs, add, rem); later(() => outWs(u.name, { t: 'cp_eco', seq, ft: dft, zs: dzs, add: add || [], rem: rem || [], why: why || '' })); }
  function upd(names) { names.forEach(n => n && outWs(n, { t: 'cp_upd' })); }

  // ---------- holdings ----------
  const hq = (n, k, i) => { const r = Q.hGet.get(n, k, i); return r ? r.qty : 0; };
  const hAdd = (n, k, i, d) => { const q = Math.round((hq(n, k, i) + d) * 1000) / 1000; if (q < -1e-9) throw new Error('Nincs elég ' + k); Q.hPut.run(n, k, i, Math.max(0, q)); };

  // ---------- árfolyamok + napi hírek ----------
  function rnd(seed) { let x = seed | 0; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; }
  const NEWS_T = [['📈', '{c} új állami megrendelést nyert – a befektetők ünnepelnek.', 1], ['📉', '{c}: elcsúszott a pályázati határidő, esik az árfolyam.', -1], ['📈', 'Rekordnegyedévet jelentett a(z) {c}.', 1], ['📉', 'Vizsgálat indult a(z) {c} számlái miatt (kitalált hír).', -1], ['📈', 'A(z) {c} terjeszkedik: új telephely nyílik.', 1], ['📉', 'Sztrájk a(z) {c} üzemében – lassul a termelés.', -1]];
  const NEWS_D = [['🏗️', 'Felújítási program: {d} – ma +15% bérleti díj!', 0.15], ['🚧', 'Útlezárás: {d} – ma −10% bérleti díj.', -0.1], ['🎉', 'Utcabál: {d} – ma +8% bérleti díj!', 0.08]];
  function news() {
    const d = today(), r0 = Q.nGet.get(d); if (r0) { try { return JSON.parse(r0.j); } catch (e) {} }
    const r = rnd(+d.replace(/-/g, '')), items = [], drift = {}, rent = {};
    for (let i = 0; i < 3; i++) { const c = CO[Math.floor(r() * CO.length)], t = NEWS_T[Math.floor(r() * NEWS_T.length)]; drift[c[0]] = (drift[c[0]] || 0) + t[2] * 0.004; items.push({ ic: t[0], text: t[1].replace('{c}', c[1]), k: c[0], dir: t[2] }); }
    const di = Math.floor(r() * DIST.length), t = NEWS_D[Math.floor(r() * NEWS_D.length)]; rent[di] = t[2]; items.push({ ic: t[0], text: t[1].replace('{d}', DIST[di][0]), d: di, dir: Math.sign(t[2]) });
    const j = { day: d, items, drift, rent }; Q.nPut.run(d, JSON.stringify(j)); return j;
  }
  function tick() {
    const nw = news();
    for (const m of Q.mAll.all()) { const c = COK[m.k]; if (!c) continue; let h = []; try { h = JSON.parse(m.hist); } catch (e) {}
      const g = (Math.random() + Math.random() + Math.random() - 1.5) * c[3] + (nw.drift[m.k] || 0) / 10 + (c[2] - m.price) / c[2] * 0.01;
      const p = Math.min(c[2] * 6, Math.max(c[2] * 0.15, m.price * (1 + g))); h.push(Math.round(p * 100) / 100); if (h.length > 120) h = h.slice(-120);
      Q.mSet.run(p, JSON.stringify(h), now(), m.k); }
  }
  const prices = () => { const o = {}; for (const m of Q.mAll.all()) o[m.k] = m.price; return o; };
  const pr = k => { const m = Q.mAll.all().find(x => x.k === k); return m ? m.price : 0; };

  // ---------- telkek ----------
  const RENT_DAY = 0.02, RENT_CAP = 48 * 3600e3;
  const rentRate = (p, vipB) => { const nw = news(); return p.base * RENT_DAY * (1 + 0.3 * p.lv) * (1 + (nw.rent[p.d] || 0)) * (1 + (vipB || 0)); }; // Ft / nap
  const due = (p, vipB) => p.owner ? Math.floor(rentRate(p, vipB) * Math.min(RENT_CAP, Math.max(0, now() - (p.rt || now()))) / 864e5) : 0;
  const upCost = p => Math.round(p.base * 0.4 * (p.lv + 1));
  const pVal = p => Math.round(p.base * (1 + 0.3 * p.lv));

  // ---------- értékek, ranglista ----------
  function itemVal(kind, item, qty) { if (kind === 'stock' || kind === 'coin') return pr(item) * qty; if (kind === 'veh') return (VEH[item] || [0, 0])[1] * qty; if (kind === 'parcel') { const p = Q.pGet.get(item); return p ? pVal(p) : 0; } if (kind === 'zs') return qty * 100; if (kind === 'ft') return qty; return 0; }
  let topC = null, topT = 0;
  function top() {
    if (topC && now() - topT < 60000) return topC;
    const P = prices(), rows = [];
    const parc = Q.pAll.all();
    for (const u of Object.values(db().users)) {
      const b = bal(u), h = Q.hold.all(u.name); let assets = 0; h.forEach(x => assets += x.kind === 'veh' ? (VEH[x.item] || [0, 0])[1] * x.qty : (P[x.item] || 0) * x.qty);
      const mine = parc.filter(p => p.owner === u.name); assets += mine.reduce((s, p) => s + pVal(p), 0);
      if (!b.ft && !assets && !mine.length) continue;
      rows.push({ name: u.name, ft: Math.round(b.ft), assets: Math.round(assets), total: Math.round(b.ft + assets), parcels: mine.length, vip: vipOf(u.name).n });
    }
    topC = { rich: rows.slice().sort((a, b) => b.total - a.total).slice(0, 15), land: rows.filter(r => r.parcels).sort((a, b) => b.parcels - a.parcels).slice(0, 15), t: now() }; topT = now(); return topC;
  }

  // ---------- aukciók lezárása ----------
  function giveItem(name, kind, item, qty) { // letétből a vevőhöz / vissza az eladóhoz
    if (kind === 'stock' || kind === 'coin' || kind === 'veh') hAdd(name, kind, item, qty);
    else if (kind === 'parcel') { const p = Q.pGet.get(item); Q.pSet.run(name, p.lv, now(), null, now(), item); }
    else if (kind === 'zs') credit(name, 0, qty, null, null, 'Piac: zseton');
    else if (kind === 'ft') credit(name, qty, 0, null, null, 'Piac: Ft');
    else if (kind === 'skin') credit(name, 0, 0, [item], null, 'Piac: tárgy');
  }
  function settle() {
    const due = Q.aDue.all(now()); if (!due.length) return;
    for (const a of due) {
      try { runTx(() => {
        if (Q.aSet.run(a.topUser ? 'sold' : 'expired', a.id).changes !== 1) return;
        if (a.topUser) {
          const fee = Math.floor(a.top * vipOf(a.seller).fee);
          giveItem(a.topUser, a.kind, a.item, a.qty);
          credit(a.seller, a.cur === 'ft' ? a.top - fee : 0, a.cur === 'zs' ? a.top - fee : 0, null, null, '🔨 Aukció eladva: ' + a.top + ' ' + a.cur);
          Q.turn.run(a.cur === 'ft' ? a.top : a.top * 50, a.seller); Q.turn.run(a.cur === 'ft' ? a.top : a.top * 50, a.topUser);
          logTx(a.seller, a.topUser, 'auct_sold', a.kind, a.item, a.qty, a.top - fee, a.cur, 'díj ' + fee); logTx(a.topUser, a.seller, 'auct_won', a.kind, a.item, a.qty, -a.top, a.cur, '#' + a.id);
          later(() => outWs(a.topUser, { t: 'cp_note', text: '🔨 Megnyerted az aukciót (#' + a.id + ')!' }));
        } else { giveItem(a.seller, a.kind, a.item, a.qty); logTx(a.seller, '', 'auct_exp', a.kind, a.item, a.qty, 0, a.cur, 'nem volt licit'); }
      }); upd([a.seller, a.topUser]); topT = 0; } catch (e) { console.log('[mod_cplus] aukció lezárás hiba', a.id, e.message); }
    }
  }
  setInterval(() => { try { tick(); } catch (e) { console.log('[mod_cplus] tick', e.message); } }, 60000);
  setInterval(() => { try { settle(); } catch (e) {} }, 5000);
  try { tick(); } catch (e) {}

  // ---------- letét (áru kivétele az eladótól) ----------
  // vissza: {dft,dzs,rem} – a kérő kliensnek
  function escrow(u, kind, item, qty) {
    const n = u.name;
    if (kind === 'stock' || kind === 'coin') { if (!COK[item] || (kind === 'coin') !== (item === 'KC')) throw new Error('Ismeretlen értékpapír.'); if (hq(n, kind, item) + 1e-9 < qty) throw new Error('Nincs ennyi a portfóliódban.'); hAdd(n, kind, item, -qty); return {}; }
    if (kind === 'veh') { if (!VEH[item]) throw new Error('Ismeretlen jármű.'); if (qty !== 1) throw new Error('Járműből 1 db adható egyszerre.'); if (hq(n, 'veh', item) < 1) throw new Error('Nincs ilyen jármű a garázsodban.'); hAdd(n, 'veh', item, -1); return { vehRem: item }; }
    if (kind === 'parcel') { const p = Q.pGet.get(item); if (!p || p.owner !== n) throw new Error('Ez nem a te telked.'); if (p.lock) throw new Error('Ez a telek már piacon van.'); const r = collectOne(u, p); Q.pLock.run('x', item); return { dft: r }; }
    if (kind === 'zs') { if (bal(u).zs < qty) throw new Error('Nincs elég zsetonod (a felhőmentés szerint).'); applyEco(u, 0, -qty); return { dzs: -qty }; }
    if (kind === 'ft') { if (bal(u).ft < qty) throw new Error('Nincs elég Ft-od (a felhőmentés szerint).'); applyEco(u, -qty, 0); return { dft: -qty }; }
    if (kind === 'skin') { if (!bal(u).own[item]) throw new Error('Nincs ilyen tárgyad.'); applyEco(u, 0, 0, null, [item]); return { rem: [item] }; }
    throw new Error('Ismeretlen árufajta.');
  }
  function unescrow(name, kind, item, qty) { // visszaadás az eladónak (lemondás / lejárat)
    if (kind === 'parcel') { Q.pLock.run(null, item); return; }
    giveItem(name, kind, item, qty);
  }
  function collectOne(u, p) { const v = due(p, vipOf(u.name).rentB); Q.pRt.run(now(), p.id); if (v > 0) { applyEco(u, v, 0); logTx(u.name, '', 'rent', 'parcel', p.id, 1, v, 'ft', 'automatikus beszedés'); } return v; } // a kérőnek: a válaszba kerül

  const KINDS = ['stock', 'coin', 'veh', 'parcel', 'zs', 'ft', 'skin'];
  function chkItem(kind, item, qty) {
    if (!KINDS.includes(kind)) throw new Error('Ismeretlen árufajta.');
    if (!(qty > 0) || qty > 1e9) throw new Error('Hibás mennyiség.');
    if (kind !== 'coin' && Math.floor(qty) !== qty) throw new Error('Egész mennyiség kell.');
    if (kind === 'parcel' && qty !== 1) throw new Error('Telekből 1 db.');
    if (kind === 'skin' && (!/^[\w-]{1,40}$/.test(item) || qty !== 1)) throw new Error('Hibás tárgy.');
  }

  // ---------- állapot ----------
  function state(u) {
    const n = u.name, v = vipOf(n), a = acct(n), nw = news(), P = Q.pAll.all();
    const hold = Q.hold.all(n), b = bal(u);
    const mine = P.filter(p => p.owner === n);
    const offers = Q.oOpen.all().filter(o => !o.target || o.target === n || o.seller === n);
    const markets = Q.mAll.all().map(m => { let h = []; try { h = JSON.parse(m.hist); } catch (e) {} return { k: m.k, name: COK[m.k] ? COK[m.k][1] : m.k, price: Math.round(m.price * 100) / 100, hist: h.slice(-60) }; });
    return {
      me: n, now: now(), vip: v, vipTable: VIP, bonusReady: v.bonus > 0 && a.bonusDay !== today(), migr: a.migr, bal: { ft: b.ft, zs: b.zs },
      hold, rentDue: mine.reduce((s, p) => s + due(p, v.rentB), 0), rentDay: Math.round(mine.reduce((s, p) => s + rentRate(p, v.rentB), 0)),
      dist: DIST.map(d => ({ n: d[0], x: d[1], y: d[2], w: d[3], h: d[4] })), plv: PLV,
      parcels: P.map(p => ({ id: p.id, d: p.d, name: p.name, base: p.base, val: pVal(p), owner: p.owner || null, lv: p.lv, lock: !!p.lock, rentDay: Math.round(rentRate(p, p.owner === n ? v.rentB : 0)), due: p.owner === n ? due(p, v.rentB) : 0, up: upCost(p) })),
      markets, news: nw, veh: VEH, pend: (u.cpPend || []).slice(-50), offers, auctions: Q.aOpen.all(), aRecent: Q.aRecent.all().slice(0, 10)
    };
  }

  // ---------- műveletek ----------
  const R = {}; // név -> fn(u, b) → {ok, dft, dzs, add, rem, msg}
  R.parcel_buy = (u, b) => { const p = Q.pGet.get(String(b.id)); if (!p) throw new Error('Nincs ilyen telek.'); if (p.owner) throw new Error('Ez a telek már ' + p.owner + ' tulajdona.');
    const c = pVal(p); if (bal(u).ft < c) throw new Error('Nincs elég Ft-od (' + c.toLocaleString('hu-HU') + ' Ft kell).');
    applyEco(u, -c, 0); Q.pSet.run(u.name, p.lv, now(), null, now(), p.id); Q.turn.run(c, u.name); logTx(u.name, 'Város', 'parcel_buy', 'parcel', p.id, 1, -c, 'ft', p.name); return { dft: -c, msg: '🏠 Megvetted: ' + p.name }; };
  R.parcel_up = (u, b) => { const p = Q.pGet.get(String(b.id)); if (!p || p.owner !== u.name) throw new Error('Ez nem a te telked.'); if (p.lv >= 3) throw new Error('Már Luxus szinten van.'); if (p.lock) throw new Error('Piacon lévő telek nem fejleszthető.');
    const c = upCost(p); if (bal(u).ft < c) throw new Error('Nincs elég Ft-od.'); const r = collectOne(u, p); applyEco(u, -c, 0); Q.pSet.run(u.name, p.lv + 1, now(), null, p.t, p.id); logTx(u.name, '', 'parcel_up', 'parcel', p.id, 1, -c, 'ft', PLV[p.lv + 1]); return { dft: r - c, msg: '🔨 ' + p.name + ' → ' + PLV[p.lv + 1] }; };
  R.parcel_sell = (u, b) => { const p = Q.pGet.get(String(b.id)); if (!p || p.owner !== u.name) throw new Error('Ez nem a te telked.'); if (p.lock) throw new Error('Előbb vond vissza a piacról.');
    const r = collectOne(u, p), c = Math.round(pVal(p) * 0.75); applyEco(u, c, 0); Q.pSet.run(null, 0, 0, null, now(), p.id); logTx(u.name, 'Város', 'parcel_sell', 'parcel', p.id, 1, c, 'ft', p.name); return { dft: c + r, msg: '🏚️ Eladva a városnak: +' + c.toLocaleString('hu-HU') + ' Ft' + (r ? ' (+ bérleti díj ' + r + ')' : '') }; };
  R.rent = u => { const v = vipOf(u.name); let s = 0; for (const p of Q.pMine.all(u.name)) { const x = due(p, v.rentB); Q.pRt.run(now(), p.id); s += x; }
    if (s <= 0) throw new Error('Még nincs beszedhető bérleti díj.'); applyEco(u, s, 0); logTx(u.name, '', 'rent', 'parcel', '*', 0, s, 'ft', 'összes telek'); return { dft: s, msg: '💰 Bérleti díj beszedve: +' + s.toLocaleString('hu-HU') + ' Ft' }; };
  R.bonus = u => { const v = vipOf(u.name), a = acct(u.name); if (!v.bonus) throw new Error('Napi VIP-bónusz Ezüst szinttől jár.'); if (a.bonusDay === today()) throw new Error('A mai bónuszt már felvetted.');
    Q.bonus.run(today(), u.name); applyEco(u, v.bonus, 0); logTx(u.name, '', 'vip_bonus', '', '', 0, v.bonus, 'ft', v.n); return { dft: v.bonus, msg: '👑 VIP napi bónusz: +' + v.bonus.toLocaleString('hu-HU') + ' Ft' }; };
  R.trade = (u, b) => { // részvény / KözCoin vétel-eladás a tőzsdén (szerveres árfolyam, 0,5% díj)
    const k = String(b.item), c = COK[k]; if (!c) throw new Error('Ismeretlen értékpapír.'); const kind = k === 'KC' ? 'coin' : 'stock';
    let q = num(b.qty); q = kind === 'coin' ? Math.floor(q * 1000) / 1000 : Math.floor(q); if (!(q > 0) || q > 1e7) throw new Error('Hibás mennyiség.');
    const p = pr(k), v = Math.round(p * q), fee = Math.ceil(v * 0.005);
    if (b.act === 'buy') { if (bal(u).ft < v + fee) throw new Error('Nincs elég Ft-od.'); applyEco(u, -(v + fee), 0); hAdd(u.name, kind, k, q); Q.turn.run(v, u.name); logTx(u.name, 'Tőzsde', 'buy', kind, k, q, -(v + fee), 'ft', '@' + p.toFixed(2)); return { dft: -(v + fee), msg: '📈 Vettél ' + q + ' ' + k + ' (' + (v + fee).toLocaleString('hu-HU') + ' Ft)' }; }
    if (b.act === 'sell') { if (hq(u.name, kind, k) + 1e-9 < q) throw new Error('Nincs ennyi a portfóliódban.'); hAdd(u.name, kind, k, -q); applyEco(u, v - fee, 0); Q.turn.run(v, u.name); logTx(u.name, 'Tőzsde', 'sell', kind, k, q, v - fee, 'ft', '@' + p.toFixed(2)); return { dft: v - fee, msg: '📉 Eladtál ' + q + ' ' + k + ' (+' + (v - fee).toLocaleString('hu-HU') + ' Ft)' }; }
    throw new Error('Hibás művelet.'); };
  R.veh_buy = (u, b) => { const k = String(b.k), v = VEH[k]; if (!v) throw new Error('Ismeretlen jármű.'); if (hq(u.name, 'veh', k) >= 3) throw new Error('Ebből már 3 van a garázsodban.');
    if (bal(u).ft < v[1]) throw new Error('Nincs elég Ft-od.'); applyEco(u, -v[1], 0); hAdd(u.name, 'veh', k, 1); Q.turn.run(v[1], u.name); logTx(u.name, 'Garázs', 'veh_buy', 'veh', k, 1, -v[1], 'ft', v[0]); return { dft: -v[1], veh: k, msg: '🏁 A garázsodban: ' + v[0] }; };
  R.migr = (u, b) => { // egyszeri: a helyi garázs (jarmu2 VOWN) átvétele a fiókba
    const a = acct(u.name); if (a.migr & 1) return { msg: '' }; const list = (Array.isArray(b.veh) ? b.veh : []).filter(k => VEH[k]).slice(0, 4);
    list.forEach(k => { if (hq(u.name, 'veh', k) < 1) hAdd(u.name, 'veh', k, 1); }); Q.migr.run(a.migr | 1, u.name); if (list.length) logTx(u.name, '', 'migr', 'veh', list.join(','), list.length, 0, '', 'helyi garázs átvétele');
    return { msg: list.length ? '🏁 A helyi garázsod (' + list.length + ' jármű) a fiókodhoz kötve.' : '' }; };
  R.deposit = (u, b) => { // helyi (extra140d) részvény/KözCoin befizetése a szerveres portfólióba – napi 5 M Ft értékig
    const k = String(b.item), c = COK[k]; if (!c) throw new Error('Ismeretlen értékpapír.'); const kind = k === 'KC' ? 'coin' : 'stock';
    let q = num(b.qty); q = kind === 'coin' ? Math.floor(q * 1000) / 1000 : Math.floor(q); if (!(q > 0)) throw new Error('Hibás mennyiség.');
    const a = acct(u.name); let dep = {}; try { dep = JSON.parse(a.dep || '{}'); } catch (e) {} if (dep.d !== today()) dep = { d: today(), v: 0 };
    const val = pr(k) * q; if (dep.v + val > 5e6) throw new Error('Napi befizetési keret: 5 000 000 Ft érték (ma még ' + Math.max(0, Math.floor(5e6 - dep.v)).toLocaleString('hu-HU') + ').');
    dep.v += val; Q.dep.run(JSON.stringify(dep), u.name); hAdd(u.name, kind, k, q); logTx(u.name, '', 'deposit', kind, k, q, 0, '', 'helyi tőzsdéből'); return { msg: '📥 Befizetve: ' + q + ' ' + k }; };
  R.offer = (u, b) => {
    const kind = String(b.kind), item = String(b.item || ''), qty = num(b.qty), price = int(b.price), cur = b.cur === 'zs' ? 'zs' : 'ft';
    chkItem(kind, item, qty); if (!(price >= 1 && price <= 1e10)) throw new Error('Hibás ár.');
    if ((kind === 'zs' && cur === 'zs') || (kind === 'ft' && cur === 'ft')) throw new Error('Ugyanazt a pénznemet nem cserélheted önmagára.');
    let target = b.target ? String(b.target).trim() : null; if (target) { const t = U(target); if (!t) throw new Error('Nincs ilyen játékos: ' + target); if (t.name === u.name) throw new Error('Magadnak nem küldhetsz ajánlatot.'); target = t.name; }
    const v = vipOf(u.name); if (Q.oCnt.get(u.name).n >= v.maxOff) throw new Error('Egyszerre max ' + v.maxOff + ' nyitott ajánlatod lehet (' + v.n + ' VIP).');
    const e = escrow(u, kind, kind === 'coin' ? 'KC' : item, qty); const id = Q.oIns.run(u.name, kind, kind === 'coin' ? 'KC' : item, qty, price, cur, target, now()).lastInsertRowid;
    logTx(u.name, target || '', 'offer', kind, item, qty, price, cur, '#' + id + ' letétbe'); if (target) later(() => outWs(target, { t: 'cp_note', text: '🤝 ' + u.name + ' ajánlatot küldött neked a Kaszinó+ piacon!' }));
    return Object.assign({ msg: '🏷️ Ajánlat feltéve (#' + id + ')', notify: target ? [target] : [] }, e); };
  R.offer_cancel = (u, b) => { const o = Q.oGet.get(int(b.id)); if (!o || o.status !== 'open') throw new Error('Az ajánlat már nem él.'); if (o.seller !== u.name) throw new Error('Nem a te ajánlatod.');
    if (Q.oSet.run('cancel', null, now(), o.id).changes !== 1) throw new Error('Az ajánlat már nem él.');
    const r = retLocal(u, o.kind, o.item, o.qty); logTx(u.name, '', 'offer_cancel', o.kind, o.item, o.qty, 0, o.cur, '#' + o.id); return Object.assign({ msg: '↩️ Ajánlat visszavonva, az áru visszakerült.' }, r); };
  R.offer_buy = (u, b) => { const o = Q.oGet.get(int(b.id)); if (!o || o.status !== 'open') throw new Error('Ez az ajánlat már nem elérhető (valaki megelőzött).');
    if (o.seller === u.name) throw new Error('A saját ajánlatodat nem veheted meg.'); if (o.target && o.target !== u.name) throw new Error('Ez az ajánlat másnak szól.');
    const bb = bal(u); if ((o.cur === 'ft' ? bb.ft : bb.zs) < o.price) throw new Error('Nincs elég ' + (o.cur === 'ft' ? 'Ft' : 'zseton') + 'od (a felhőmentés szerint).');
    if (o.kind === 'skin' && bb.own[o.item]) throw new Error('Ez a tárgy már megvan neked.');
    if (Q.oSet.run('sold', u.name, now(), o.id).changes !== 1) throw new Error('Ez az ajánlat már nem elérhető.');
    const fee = Math.floor(o.price * vipOf(o.seller).fee);
    // vevő: fizet + kapja az árut (saját válaszban)
    const r = { dft: 0, dzs: 0, add: [] }; if (o.cur === 'ft') r.dft -= o.price; else r.dzs -= o.price;
    if (o.kind === 'zs') r.dzs += o.qty; if (o.kind === 'ft') r.dft += o.qty; if (o.kind === 'skin') r.add.push(o.item);
    applyEco(u, r.dft, r.dzs, r.add, null);
    if (o.kind === 'stock' || o.kind === 'coin' || o.kind === 'veh') hAdd(u.name, o.kind, o.item, o.qty);
    if (o.kind === 'parcel') { const p = Q.pGet.get(o.item); Q.pSet.run(u.name, p.lv, now(), null, now(), o.item); }
    if (o.kind === 'veh') r.veh = o.item;
    credit(o.seller, o.cur === 'ft' ? o.price - fee : 0, o.cur === 'zs' ? o.price - fee : 0, null, null, '🏷️ Eladtad (#' + o.id + ') ' + u.name + ' vette meg');
    const tv = o.cur === 'ft' ? o.price : o.price * 50; Q.turn.run(tv, u.name); Q.turn.run(tv, o.seller);
    logTx(u.name, o.seller, 'buy_offer', o.kind, o.item, o.qty, -o.price, o.cur, '#' + o.id); logTx(o.seller, u.name, 'sold_offer', o.kind, o.item, o.qty, o.price - fee, o.cur, '#' + o.id + ' díj ' + fee);
    r.msg = '✅ Megvetted (#' + o.id + ')'; r.notify = [o.seller]; return r; };
  function retLocal(u, kind, item, qty) { // visszaadás a KÉRŐ felhasználónak (a változás a válaszba kerül, nem WS-be)
    if (kind === 'parcel') { Q.pLock.run(null, item); return {}; }
    if (kind === 'stock' || kind === 'coin') { hAdd(u.name, kind, item, qty); return {}; }
    if (kind === 'veh') { hAdd(u.name, 'veh', item, qty); return { veh: item }; }
    if (kind === 'zs') { applyEco(u, 0, qty); return { dzs: qty }; }
    if (kind === 'ft') { applyEco(u, qty, 0); return { dft: qty }; }
    if (kind === 'skin') { applyEco(u, 0, 0, [item]); return { add: [item] }; }
    return {};
  }
  R.auct = (u, b) => {
    const kind = String(b.kind), item = String(b.item || ''), qty = num(b.qty), start = int(b.start), cur = b.cur === 'zs' ? 'zs' : 'ft', min = int(b.min);
    chkItem(kind, item, qty); if (!(start >= 1 && start <= 1e10)) throw new Error('Hibás kikiáltási ár.'); if (![2, 10, 60, 1440].includes(min)) throw new Error('Időtartam: 2, 10, 60 perc vagy 24 óra.');
    if ((kind === 'zs' && cur === 'zs') || (kind === 'ft' && cur === 'ft')) throw new Error('Ugyanazt a pénznemet nem árverezheted önmagáért.');
    if (Q.aCnt.get(u.name).n >= Math.max(2, Math.floor(vipOf(u.name).maxOff / 2))) throw new Error('Túl sok futó aukciód van.');
    const e = escrow(u, kind, kind === 'coin' ? 'KC' : item, qty); const id = Q.aIns.run(u.name, kind, kind === 'coin' ? 'KC' : item, qty, cur, start, now() + min * 60e3, now()).lastInsertRowid;
    logTx(u.name, '', 'auct', kind, item, qty, start, cur, '#' + id + ' ' + min + ' perc'); return Object.assign({ msg: '🔨 Aukció indult (#' + id + ')' }, e); };
  R.bid = (u, b) => { const a = Q.aGet.get(int(b.id)); if (!a || a.status !== 'open' || a.ends <= now()) throw new Error('Az aukció lezárult.'); if (a.seller === u.name) throw new Error('A saját aukciódra nem licitálhatsz.');
    if (a.topUser === u.name) throw new Error('Már te vezetsz.');
    const amt = int(b.amt), minB = a.top ? a.top + Math.max(1, Math.ceil(a.top * 0.05)) : a.start; if (amt < minB) throw new Error('A minimális licit: ' + minB.toLocaleString('hu-HU'));
    const bb = bal(u); if ((a.cur === 'ft' ? bb.ft : bb.zs) < amt) throw new Error('Nincs elég ' + (a.cur === 'ft' ? 'Ft' : 'zseton') + 'od.');
    const ends = a.ends - now() < 30e3 ? now() + 30e3 : a.ends; // mesterlövész-védelem
    if (Q.aBid.run(amt, u.name, ends, a.id).changes !== 1) throw new Error('Az aukció lezárult.');
    applyEco(u, a.cur === 'ft' ? -amt : 0, a.cur === 'zs' ? -amt : 0);
    if (a.topUser) { credit(a.topUser, a.cur === 'ft' ? a.top : 0, a.cur === 'zs' ? a.top : 0, null, null, '🔨 Túllicitáltak (#' + a.id + '), visszakaptad a letétet'); logTx(a.topUser, u.name, 'bid_refund', a.kind, a.item, a.qty, a.top, a.cur, '#' + a.id); }
    logTx(u.name, a.seller, 'bid', a.kind, a.item, a.qty, -amt, a.cur, '#' + a.id + ' letét');
    return { dft: a.cur === 'ft' ? -amt : 0, dzs: a.cur === 'zs' ? -amt : 0, msg: '🔨 Licit: ' + amt.toLocaleString('hu-HU') + (a.cur === 'ft' ? ' Ft' : ' zs') + ' (letétbe)', notify: [a.seller, a.topUser] }; };
  R.auct_cancel = (u, b) => { const a = Q.aGet.get(int(b.id)); if (!a || a.status !== 'open') throw new Error('Az aukció már lezárult.'); if (a.seller !== u.name) throw new Error('Nem a te aukciód.'); if (a.topUser) throw new Error('Licit után nem vonható vissza.');
    if (Q.aSet.run('cancel', a.id).changes !== 1) throw new Error('Az aukció már lezárult.'); const r = retLocal(u, a.kind, a.item, a.qty); logTx(u.name, '', 'auct_cancel', a.kind, a.item, a.qty, 0, a.cur, '#' + a.id); return Object.assign({ msg: '↩️ Aukció visszavonva.' }, r); };

  // ---------- admin moderálás ----------
  function adminCancel(by, type, id) {
    if (type === 'offer') { const o = Q.oGet.get(id); if (!o || o.status !== 'open') throw new Error('Nem élő ajánlat.'); if (Q.oSet.run('admin', by, now(), id).changes !== 1) throw new Error('Nem élő.'); unescrow(o.seller, o.kind, o.item, o.qty); logTx(o.seller, by, 'admin_cancel', o.kind, o.item, o.qty, 0, o.cur, 'ajánlat #' + id); upd([o.seller]); return; }
    if (type === 'auct') { const a = Q.aGet.get(id); if (!a || a.status !== 'open') throw new Error('Nem élő aukció.'); if (Q.aSet.run('admin', id).changes !== 1) throw new Error('Nem élő.');
      if (a.topUser) credit(a.topUser, a.cur === 'ft' ? a.top : 0, a.cur === 'zs' ? a.top : 0, null, null, '🛡️ Admin törölte az aukciót, visszakaptad a licitet'); unescrow(a.seller, a.kind, a.item, a.qty); logTx(a.seller, by, 'admin_cancel', a.kind, a.item, a.qty, 0, a.cur, 'aukció #' + id); upd([a.seller, a.topUser]); return; }
    throw new Error('Hibás típus.');
  }

  // ---------- HTTP ----------
  const busy = new Set(), lim = new Map();
  const limited = (k, max, ms) => { const t = now(), a = (lim.get(k) || []).filter(x => t - x < ms); a.push(t); lim.set(k, a); return a.length > max; };
  async function handle(req, res, url) {
    const p = url.pathname, tk = (req.headers.authorization || '').replace('Bearer ', ''), n = sessions.get(tk), u = n ? U(n) : null;
    if (p.startsWith('/api/admin/cp/')) {
      if (!u || !u.admin) return send(res, 403, { error: 'Nincs admin jogod.' });
      if (p === '/api/admin/cp/ov') { settle(); const c = sql.prepare('SELECT COUNT(*) n, COALESCE(SUM(CASE WHEN cur=\'ft\' AND amt>0 THEN amt ELSE 0 END),0) v FROM cp_log WHERE t>?').get(now() - 864e5);
        return send(res, 200, { log: Q.logAll.all(200), offers: Q.oOpen.all(), auctions: Q.aOpen.all(), recent: Q.aRecent.all(), tx24: c.n, vol24: c.v, owned: sql.prepare('SELECT COUNT(*) n FROM cp_parcels WHERE owner IS NOT NULL').get().n, markets: Q.mAll.all().map(m => ({ k: m.k, price: m.price })) }); }
      if (p === '/api/admin/cp/cancel' && req.method === 'POST') { let b; try { b = await body(req); } catch (e) { return send(res, 400, { error: 'Hibás kérés.' }); }
        try { runTx(() => adminCancel(u.name, b.type, int(b.id))); } catch (e) { return send(res, 400, { error: e.message }); } save(); topT = 0; console.log('[mod_cplus] admin törlés', u.name, b.type, b.id); return send(res, 200, { ok: true }); }
      if (p === '/api/admin/cp/user') { const t = U(url.searchParams.get('n')); if (!t) return send(res, 404, { error: 'Nincs ilyen fiók.' }); return send(res, 200, { hold: Q.hold.all(t.name), parcels: Q.pMine.all(t.name), vip: vipOf(t.name), log: Q.logU.all(t.name, 100) }); }
      return send(res, 404, { error: 'Ismeretlen.' });
    }
    if (!u) return send(res, 401, { error: 'A Kaszinó+ piac csak bejelentkezve érhető el (vendégként nincs piac).' });
    settle();
    if (p === '/api/cp/state') return send(res, 200, state(u));
    if (p === '/api/cp/log') return send(res, 200, { log: Q.logU.all(u.name, 100) });
    if (p === '/api/cp/top') return send(res, 200, top());
    if (p === '/api/cp/act' && req.method === 'POST') {
      if (limited('cp:' + u.name, 40, 60000)) return send(res, 429, { error: 'Túl sok kérés, lassíts!' });
      let b; try { b = await body(req, 20000); } catch (e) { return send(res, 400, { error: 'Hibás kérés.' }); }
      const f = R[String(b.a)]; if (!f) return send(res, 400, { error: 'Ismeretlen művelet.' });
      if (busy.has(u.name)) return send(res, 409, { error: 'Előző műveleted még fut.' });
      busy.add(u.name); let r; CTX = { user: u.name, seqs: [] }; const ctx = CTX;
      try { r = runTx(() => f(u, b) || {}); }
      catch (e) { busy.delete(u.name); CTX = null; return send(res, 400, { error: e.message || 'Hiba' }); }
      busy.delete(u.name); CTX = null; save(); topT = 0; upd((r.notify || []).filter(x => x && x !== u.name));
      const out = { ok: true, dft: r.dft || 0, dzs: r.dzs || 0, add: r.add || [], rem: r.rem || [], veh: r.veh || null, vehRem: r.vehRem || null, seqs: ctx.seqs, msg: r.msg || '' };
      return send(res, 200, out);
    }
    return send(res, 404, { error: 'Ismeretlen piac-végpont.' });
  }
  const orig = server.listeners('request').slice();
  server.removeAllListeners('request');
  server.on('request', (req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/save' && req.method === 'POST') { // utófeldolgozás: a res.end előtt (szinkron) pótoljuk a hiányzó szerveres tételeket
      const tk = (req.headers.authorization || '').replace('Bearer ', '') || url.searchParams.get('tk') || ''; const n = sessions.get(tk), su = n ? U(n) : null;
      if (su) { const end = res.end.bind(res); res.end = function () { if (res.statusCode === 200) fixSave(su); return end.apply(null, arguments); }; }
    }
    if (!url.pathname.startsWith('/api/cp/') && !url.pathname.startsWith('/api/admin/cp/')) return orig.forEach(f => f.call(server, req, res));
    handle(req, res, url).catch(e => { try { send(res, 500, { error: 'Piac hiba: ' + e.message }); } catch (_) {} });
  });
  module.exports._dbg = { state, top };
  console.log('[mod_cplus] Kaszinó+ piac kész (SQL táblák: cp_*)');
};
