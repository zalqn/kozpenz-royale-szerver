// KÖZPÉNZ ROYALE – fiók-, lobby- és chatszerver
// Indítás: node server.js   →   http://localhost:3000
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { WebSocketServer } = require('ws');

const PORT = +process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');
const DATA = process.env.DATA_DIR || __dirname; try { fs.mkdirSync(DATA, { recursive: true }); } catch (e) {}
const DB_FILE = path.join(DATA, 'users.json');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };

// ---------- adatbázis ----------
// SQL (store.js, DATA_DIR/kozpenz.db) az elsődleges; ha nem elérhető → users.json. A users.json tükörként továbbra is íródik.
const store = require('./store');
let db = { users: {} };
try { db = store.loadDb() || JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (e) {}
if (!db.users) db.users = {};
let saveT = null;
const save = () => { clearTimeout(saveT); saveT = setTimeout(() => {
  try { store.saveDb(db); } catch (e) { console.log('[store] mentés hiba:', e.message); }
  fs.writeFile(DB_FILE + '.tmp', JSON.stringify(db, null, 1), err => { if (!err) fs.rename(DB_FILE + '.tmp', DB_FILE, () => {}); });
}, 300); };
const flush = () => { clearTimeout(saveT); try { store.saveDb(db); } catch (e) {} try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 1)); } catch (e) {} };
['SIGINT', 'SIGTERM'].forEach(sg => process.on(sg, () => { flush(); store.close(); process.exit(0); }));
const sessions = new Map(); // token -> username
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const pubUser = u => ({ name: u.name, created: u.created, level: u.level || 1, stats: u.stats, friends: u.friends || [], avatar: u.avatar || '😎', color: u.color || '#ffd23f', rang: u.rang | 0 });
const NAME_RE = /^[A-Za-z0-9_áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{3,16}$/;

// egyszerű próbálkozás-korlát
const tries = new Map();
function limited(key, max, ms) { const now = Date.now(), t = (tries.get(key) || []).filter(x => now - x < ms); t.push(now); tries.set(key, t); return t.length > max; }

function body(req, max) { max = max || 1e5; return new Promise((res, rej) => { let d = ''; req.on('data', c => { d += c; if (d.length > max) { rej(new Error('big')); req.destroy(); } }); req.on('end', () => { try { res(JSON.parse(d || '{}')); } catch (e) { rej(e); } }); }); }
function send(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); }
function auth(req) { const t = (req.headers.authorization || '').replace('Bearer ', ''); const n = sessions.get(t); return n && db.users[n.toLowerCase()] ? db.users[n.toLowerCase()] : null; }

// ---------- rang (rangok.js tükre: [név, Ft, zseton, ingyen szint]) ----------
const RANG = [['Tag', 0, 0, 1], ['VIP', 60000, 150, 8], ['VIP+', 180000, 450, 15], ['Elit', 450000, 1100, 28], ['Legenda', 1100000, 2600, 45], ['Mester', 2600000, 6000, 70], ['Örökös', 6000000, 14000, 110]];
// ---------- felhőmentés: server/saves/<név>.json (NEM a users.json-ban, hogy az kicsi maradjon) ----------
const SAVE_DIR = path.join(DATA, 'saves'); try { fs.mkdirSync(SAVE_DIR, { recursive: true }); } catch (e) {}
const SAVE_MAX = 2 * 1024 * 1024;
const saveFile = u => path.join(SAVE_DIR, u.name.toLowerCase().replace(/[^a-z0-9_áéíóöőúüű]/g, '_') + '.json');

require('./mod_D')({ store, db: () => db, save: () => save(), auth, send, body, limited }); // D: /api/d/* (bajnokság, gazdaság, klánháború, Közgram, promó-stat, pályák)
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  try {
    if (url.pathname === '/api/register' && req.method === 'POST') {
      if (limited('reg:' + req.socket.remoteAddress, 5, 600000)) return send(res, 429, { error: 'Túl sok regisztráció, próbáld később.' });
      const { name, pass } = await body(req);
      if (!NAME_RE.test(name || '')) return send(res, 400, { error: 'A név 3–16 karakter legyen (betű, szám, _).' });
      if (typeof pass !== 'string' || pass.length < 6 || pass.length > 72) return send(res, 400, { error: 'A jelszó legalább 6 karakter legyen.' });
      const key = name.toLowerCase();
      if (db.users[key]) return send(res, 409, { error: 'Ez a név már foglalt.' });
      const salt = crypto.randomBytes(16).toString('hex');
      db.users[key] = { name, salt, hash: hashPw(pass, salt), created: Date.now(), stats: { games: 0, wins: 0, kills: 0 }, friends: [], level: 1 };
      save();
      const token = crypto.randomBytes(24).toString('hex'); sessions.set(token, name);
      return send(res, 200, { token, user: pubUser(db.users[key]) });
    }
    if (url.pathname === '/api/login' && req.method === 'POST') {
      const { name, pass } = await body(req);
      if (limited('login:' + req.socket.remoteAddress + ':' + String(name).toLowerCase(), 8, 300000)) return send(res, 429, { error: 'Túl sok próbálkozás, várj 5 percet.' });
      const u = db.users[String(name || '').toLowerCase()];
      if (!u || typeof pass !== 'string') return send(res, 401, { error: 'Hibás név vagy jelszó.' });
      const h = hashPw(pass, u.salt);
      if (!crypto.timingSafeEqual(Buffer.from(h, 'hex'), Buffer.from(u.hash, 'hex'))) return send(res, 401, { error: 'Hibás név vagy jelszó.' });
      if (u.ban && (!u.ban.until || u.ban.until > Date.now())) return send(res, 403, { error: '⛔ Ki vagy tiltva' + (u.ban.until ? ' eddig: ' + new Date(u.ban.until).toLocaleString('hu-HU') : ' (végleg)') + '. Ok: ' + (u.ban.r || '-') }); // mod_admin
      const token = crypto.randomBytes(24).toString('hex'); sessions.set(token, u.name);
      return send(res, 200, { token, user: pubUser(u) });
    }
    if (url.pathname === '/api/save') {
      if (!req.headers.authorization && url.searchParams.get('tk')) req.headers.authorization = 'Bearer ' + url.searchParams.get('tk'); // sendBeacon
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      if (req.method === 'POST') {
        if (limited('save:' + u.name, 20, 60000)) return send(res, 429, { error: 'Túl gyakori mentés.' });
        let b; try { b = await body(req, SAVE_MAX); } catch (e) { return send(res, 413, { error: 'A mentés túl nagy (max 2 MB).' }); }
        const d = b && b.d; if (!d || typeof d !== 'object' || Array.isArray(d)) return send(res, 400, { error: 'Hibás mentés.' });
        const clean = {}; for (const k of Object.keys(d).slice(0, 2000)) { if (typeof d[k] === 'string' && k.length <= 80 && k !== 'ry_token') clean[k] = d[k]; }
        const t = Date.now(); if (store.ok) { try { store.writeSave(u.name, JSON.stringify({ t, d: clean }), t); } catch (e) { return send(res, 500, { error: 'Mentési hiba.' }); } } else fs.writeFile(saveFile(u) + '.tmp', JSON.stringify({ t, d: clean }), err => { if (!err) fs.rename(saveFile(u) + '.tmp', saveFile(u), () => {}); });
        u.saveT = t; save(); return send(res, 200, { ok: true, t });
      }
      if (store.ok) { const txt = store.readSave(u.name); if (!txt) return send(res, 200, { t: 0, d: null }); res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); return res.end(txt); }
      return fs.readFile(saveFile(u), 'utf8', (err, txt) => { if (err) return send(res, 200, { t: 0, d: null }); res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(txt); });
    }
    if (url.pathname === '/api/rang/top') {
      const list = Object.values(db.users).filter(u => (u.rang | 0) > 0).sort((a, b) => (b.rang | 0) - (a.rang | 0) || (a.rangT || 0) - (b.rangT || 0)).slice(0, 20).map(u => ({ name: u.name, rang: u.rang | 0, avatar: u.avatar || '😎', level: u.level || 1 }));
      return send(res, 200, { list });
    }
    if (url.pathname === '/api/rang/set' && req.method === 'POST') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      if (limited('rang:' + u.name, 10, 60000)) return send(res, 429, { error: 'Túl sok rang-kérés, várj egy kicsit.' });
      const b = await body(req); const cur = u.rang | 0, r = b.r | 0, how = String(b.how || '');
      const ft = Math.max(0, Math.min(1e11, +b.ft || 0)), zs = Math.max(0, Math.min(1e9, +b.zs || 0)), lv = Math.max(1, Math.min(1000, b.lv | 0));
      if (r <= cur) return send(res, 200, { ok: true, rang: cur });
      if (r >= RANG.length) return send(res, 400, { error: 'Nincs ilyen rang.', rang: cur });
      if (how === 'migr') { // egyszeri átvétel a helyi mentésből (régi játékosok) – legfeljebb Elit
        if (u.rangMigr) return send(res, 400, { error: 'A helyi rang már át lett véve.', rang: cur });
        u.rangMigr = 1; u.rang = Math.min(3, r); u.rangT = Date.now(); save(); broadcastPresence(); return send(res, 200, { ok: true, rang: u.rang });
      }
      if (how === 'lv') { let n = cur; while (n + 1 < RANG.length && n + 1 <= r && lv >= RANG[n + 1][3]) n++; if (n === cur) return send(res, 400, { error: 'Ehhez a ranghoz nincs meg a szint.', rang: cur }); u.rang = n; }
      else {
        if (r !== cur + 1) return send(res, 400, { error: 'Csak sorban léphetsz rangot.', rang: cur });
        if (how === 'ft' && ft < RANG[r][1]) return send(res, 400, { error: 'Nincs elég Ft.', rang: cur });
        if (how === 'zs' && zs < RANG[r][2]) return send(res, 400, { error: 'Nincs elég zseton.', rang: cur });
        if (how !== 'ft' && how !== 'zs') return send(res, 400, { error: 'Ismeretlen fizetési mód.', rang: cur });
        u.rang = r;
      }
      u.rangT = Date.now(); (u.rangLog = u.rangLog || []).push({ r: u.rang, how, t: u.rangT }); if (u.rangLog.length > 30) u.rangLog = u.rangLog.slice(-30);
      save(); broadcastPresence(); return send(res, 200, { ok: true, rang: u.rang });
    }
    if (url.pathname === '/api/me') { const u = auth(req); return u ? send(res, 200, { user: pubUser(u) }) : send(res, 401, { error: 'Nincs bejelentkezve.' }); }
    if (url.pathname === '/api/logout' && req.method === 'POST') { sessions.delete((req.headers.authorization || '').replace('Bearer ', '')); return send(res, 200, { ok: true }); }
    if (url.pathname === '/api/profile' && req.method === 'POST') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      const b = await body(req);
      if (typeof b.avatar === 'string' && b.avatar.length <= 8) u.avatar = b.avatar;
      if (typeof b.color === 'string' && /^#[0-9a-f]{6}$/i.test(b.color)) u.color = b.color;
      save(); broadcastPresence(); return send(res, 200, { user: pubUser(u) });
    }
    if (url.pathname === '/api/match' && req.method === 'POST') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      const b = await body(req); const k = Math.max(0, Math.min(60, b.kills | 0));
      u.stats.games++; u.stats.kills += k; if (b.win) u.stats.wins++;
      u.level = 1 + Math.floor((u.stats.kills * 40 + u.stats.wins * 1500 + u.stats.games * 200) / 1000);
      db.feed = db.feed || []; db.feed.push({ n: u.name, win: !!b.win, k, mode: String(b.mode || '').slice(0, 12), t: Date.now() }); if (db.feed.length > 400) db.feed = db.feed.slice(-400);
      save(); return send(res, 200, { user: pubUser(u) });
    }
    if (url.pathname === '/api/feed') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      const fr = new Set([u.name, ...(u.friends || [])]);
      return send(res, 200, { list: (db.feed || []).filter(f => fr.has(f.n)).slice(-40).reverse() });
    }
    if (url.pathname === '/api/gift' && req.method === 'POST') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      const b = await body(req); const o = db.users[String(b.to || '').toLowerCase()];
      if (!o || !(u.friends || []).includes(o.name)) return send(res, 400, { error: 'Csak barátnak küldhetsz ajándékot.' });
      const day = new Date().toISOString().slice(0, 10); u.giftDay = u.giftDay || {};
      if (u.giftDay[o.name] === day) return send(res, 400, { error: 'Neki ma már küldtél ajándékot.' });
      u.giftDay[o.name] = day; o.gifts = o.gifts || []; o.gifts.push({ from: u.name, t: Date.now() }); if (o.gifts.length > 30) o.gifts = o.gifts.slice(-30);
      save(); toUser(o.name, { t: 'gift', from: u.name }); return send(res, 200, { ok: true });
    }
    // ---- EXTRA50: kutyakiállítás (heti szavazás) + kártyacsere ----
    if (url.pathname.startsWith('/api/x50/')) {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Előbb jelentkezz be!' });
      const P = url.pathname.slice(9); const wk = (() => { const d = new Date(), y = new Date(d.getFullYear(), 0, 1); return d.getFullYear() + '-' + Math.floor(((d - y) / 864e5 + y.getDay()) / 7); })();
      db.dogshow = db.dogshow || { week: wk, entries: {}, last: null };
      const DS = db.dogshow;
      if (DS.week !== wk) { const arr = Object.values(DS.entries).sort((a, b) => b.votes.length - a.votes.length);
        if (arr.length) { const w = arr[0]; DS.last = { week: DS.week, top: arr.slice(0, 3).map(e => ({ n: e.n, dog: e.dog, breed: e.breed, v: e.votes.length })) };
          arr.slice(0, 3).forEach((e, i) => { const o = db.users[e.n.toLowerCase()]; if (o) { o.dsWin = o.dsWin || []; o.dsWin.push({ week: DS.week, place: i + 1, prize: [3000, 1500, 800][i] }); } }); }
        DS.week = wk; DS.entries = {}; save(); }
      if (P === 'show') { const list = Object.values(DS.entries).map(e => ({ n: e.n, dog: e.dog, breed: e.breed, eq: e.eq, lv: e.lv, v: e.votes.length, me: e.votes.includes(u.name) })).sort((a, b) => b.v - a.v);
        const wins = u.dsWin || []; if (wins.length) { u.dsWin = []; save(); } return send(res, 200, { week: wk, list, last: DS.last, mine: !!DS.entries[u.name.toLowerCase()], voted: Object.values(DS.entries).some(e => e.votes.includes(u.name)), wins }); }
      if (P === 'show/enter' && req.method === 'POST') { const b = await body(req); DS.entries[u.name.toLowerCase()] = { n: u.name, dog: String(b.dog || 'Kutyus').slice(0, 20), breed: String(b.breed || '').slice(0, 20), eq: (Array.isArray(b.eq) ? b.eq : []).slice(0, 6).map(x => String(x).slice(0, 24)), lv: Math.max(1, Math.min(99, b.lv | 0)), votes: (DS.entries[u.name.toLowerCase()] || {}).votes || [] }; save(); return send(res, 200, { ok: true }); }
      if (P === 'show/vote' && req.method === 'POST') { const b = await body(req); const e = DS.entries[String(b.n || '').toLowerCase()]; if (!e) return send(res, 404, { error: 'Nincs ilyen nevezés.' });
        if (e.n === u.name) return send(res, 400, { error: 'A saját kutyádra nem szavazhatsz.' }); if (Object.values(DS.entries).some(x => x.votes.includes(u.name))) return send(res, 400, { error: 'Ezen a héten már szavaztál.' });
        e.votes.push(u.name); save(); return send(res, 200, { ok: true }); }
      if (P === 'card/send' && req.method === 'POST') { const b = await body(req); const o = db.users[String(b.to || '').toLowerCase()]; const c = String(b.card || '').slice(0, 16);
        if (!o || o === u) return send(res, 400, { error: 'Nincs ilyen játékos.' }); if (!/^[a-z0-9_]+$/.test(c)) return send(res, 400, { error: 'Hibás kártya.' }); if (limited('card:' + u.name, 20, 3600000)) return send(res, 429, { error: 'Óránként legfeljebb 20 kártyát küldhetsz.' });
        o.cardIn = o.cardIn || []; o.cardIn.push({ from: u.name, c, t: Date.now() }); if (o.cardIn.length > 100) o.cardIn = o.cardIn.slice(-100); save(); try { toUser(o.name, { t: 'card', from: u.name }); } catch (e) {} return send(res, 200, { ok: true }); }
      if (P === 'card/inbox') { const l = u.cardIn || []; if (l.length) { u.cardIn = []; save(); } return send(res, 200, { list: l }); }
      return send(res, 404, { error: 'Ismeretlen.' });
    }
    // ---- EXTRA20: profil, klánok, rangsorolt ranglista, lottó ----
    if (url.pathname.startsWith('/api/x20/')) {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Előbb jelentkezz be!' });
      const P = url.pathname.slice(9); db.clans = db.clans || {}; const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
      const clanOf = n => { const x = db.users[String(n).toLowerCase()]; return x && x.clan && db.clans[x.clan] ? db.clans[x.clan] : null; };
      const prof = x => ({ ...pubUser(x), x20: x.x20 || {}, clan: clanOf(x.name) ? { tag: clanOf(x.name).tag, name: clanOf(x.name).name, emb: clanOf(x.name).emb } : null });
      const weekK = names => { const since = Date.now() - 7 * 864e5, s = new Set(names); return (db.feed || []).filter(f => f.t > since && s.has(f.n)).reduce((a, f) => a + (f.k || 0), 0); };
      // lottó húzás 20:00-kor
      db.lotto = db.lotto || { day: today(), tickets: [], last: null };
      const L = db.lotto, now = new Date();
      const draw = () => { const nums = []; while (nums.length < 5) { const n = 1 + Math.floor(Math.random() * 30); if (!nums.includes(n)) nums.push(n); } const winners = [];
        L.tickets.forEach(t => { const h = t.nums.filter(n => nums.includes(n)).length; const prize = h === 5 ? 50000 : h === 4 ? 2500 : h === 3 ? 300 : h === 2 ? 30 : 0; if (prize) { winners.push({ n: t.n, h, prize }); const o = db.users[t.n.toLowerCase()]; if (o) { o.lottoWin = o.lottoWin || []; o.lottoWin.push({ day: L.day, h, prize, nums }); } } });
        L.last = { day: L.day, nums, winners, cnt: L.tickets.length }; L.tickets = []; L.drawn = L.day; save(); };
      if (L.day !== today()) { if (L.drawn !== L.day && L.tickets.length) draw(); L.day = today(); L.drawn = null; L.tickets = []; save(); }
      if (now.getHours() >= 20 && L.drawn !== L.day) draw();
      if (P === 'sync' && req.method === 'POST') { const b = await body(req); const n = (v, m) => Math.max(0, Math.min(m, +v || 0));
        u.x20 = { rp: n(b.rp, 1e6), hs: n(b.hs, 1e7), ach: n(b.ach, 100), melee: n(b.melee, 1e7), skin: String(b.skin || '').slice(0, 12), t: Date.now() }; save(); return send(res, 200, { ok: true }); }
      if (P === 'profile') { const x = db.users[String(url.searchParams.get('name') || '').toLowerCase()]; if (!x) return send(res, 404, { error: 'Nincs ilyen játékos.' }); return send(res, 200, { p: prof(x), me: prof(u) }); }
      if (P === 'ranked') { const list = Object.values(db.users).filter(x => x.x20 && x.x20.rp > 0).sort((a, b) => b.x20.rp - a.x20.rp).slice(0, 30).map(x => ({ n: x.name, rp: x.x20.rp, av: x.avatar || '😎', clan: clanOf(x.name) ? clanOf(x.name).tag : '' })); return send(res, 200, { list }); }
      if (P === 'clans') { const list = Object.values(db.clans).map(c => ({ tag: c.tag, name: c.name, emb: c.emb, owner: c.owner, cnt: c.members.length, wk: weekK(c.members) })).sort((a, b) => b.wk - a.wk); return send(res, 200, { list, mine: u.clan || null }); }
      if (P === 'clan') { const c = db.clans[u.clan]; if (!c) return send(res, 200, { clan: null }); return send(res, 200, { clan: { ...c, wk: weekK(c.members), mem: c.members.map(n => { const x = db.users[n.toLowerCase()]; return { n, k: weekK([n]), av: x ? x.avatar : '😎' }; }) } }); }
      if (P === 'clan/create' && req.method === 'POST') { const b = await body(req); const tag = String(b.tag || '').toUpperCase().trim(), name = String(b.name || '').trim().slice(0, 24), emb = String(b.emb || '🛡️').slice(0, 4);
        if (u.clan && db.clans[u.clan]) return send(res, 400, { error: 'Már klántag vagy. Előbb lépj ki!' });
        if (!/^[A-Z0-9]{2,5}$/.test(tag)) return send(res, 400, { error: 'A klán-rövidítés 2–5 nagybetű vagy szám.' }); if (name.length < 3) return send(res, 400, { error: 'A klán neve legalább 3 karakter.' });
        if (db.clans[tag]) return send(res, 400, { error: 'Ez a rövidítés foglalt.' });
        db.clans[tag] = { tag, name, emb, owner: u.name, members: [u.name], chat: [], t: Date.now() }; u.clan = tag; save(); return send(res, 200, { ok: true }); }
      if (P === 'clan/join' && req.method === 'POST') { const b = await body(req); const c = db.clans[String(b.tag || '').toUpperCase()]; if (!c) return send(res, 404, { error: 'Nincs ilyen klán.' });
        if (u.clan && db.clans[u.clan]) return send(res, 400, { error: 'Már klántag vagy.' }); if (c.members.length >= 20) return send(res, 400, { error: 'A klán megtelt (20 fő).' });
        c.members.push(u.name); u.clan = c.tag; c.chat.push({ n: '📢', m: u.name + ' belépett a klánba!', t: Date.now() }); save(); return send(res, 200, { ok: true }); }
      if (P === 'clan/leave' && req.method === 'POST') { const c = db.clans[u.clan]; u.clan = null; if (c) { c.members = c.members.filter(n => n !== u.name); if (!c.members.length) delete db.clans[c.tag]; else { if (c.owner === u.name) c.owner = c.members[0]; c.chat.push({ n: '📢', m: u.name + ' kilépett.', t: Date.now() }); } } save(); return send(res, 200, { ok: true }); }
      if (P === 'clan/chat' && req.method === 'POST') { const c = db.clans[u.clan]; if (!c) return send(res, 400, { error: 'Nem vagy klántag.' }); if (limited('cc:' + u.name, 8, 10000)) return send(res, 429, { error: 'Lassabban!' });
        const b = await body(req); const m = String(b.m || '').trim().slice(0, 160); if (!m) return send(res, 400, { error: 'Üres.' }); c.chat.push({ n: u.name, m, t: Date.now() }); if (c.chat.length > 80) c.chat = c.chat.slice(-80);
        c.members.forEach(n => { if (n !== u.name) try { toUser(n, { t: 'clanmsg', from: u.name }); } catch (e) {} }); save(); return send(res, 200, { ok: true }); }
      if (P === 'lotto') { const mine = L.tickets.filter(t => t.n === u.name).map(t => t.nums); const wins = u.lottoWin || []; if (wins.length) { u.lottoWin = []; save(); } return send(res, 200, { mine, last: L.last, pool: L.tickets.length, wins, drawn: L.drawn === L.day }); }
      if (P === 'lotto/buy' && req.method === 'POST') { if (L.drawn === L.day) return send(res, 400, { error: 'A mai sorsolás már lement, holnap vehetsz újat!' });
        const b = await body(req); const nums = [...new Set((b.nums || []).map(x => x | 0).filter(x => x >= 1 && x <= 30))]; if (nums.length !== 5) return send(res, 400, { error: 'Pontosan 5 különböző számot jelölj be (1–30)!' });
        if (L.tickets.filter(t => t.n === u.name).length >= 5) return send(res, 400, { error: 'Naponta legfeljebb 5 szelvény.' }); L.tickets.push({ n: u.name, nums: nums.sort((a, b) => a - b) }); save(); return send(res, 200, { ok: true }); }
      return send(res, 404, { error: 'Ismeretlen.' });
    }
    // ---- PROMÓCIÓS KÓDOK ----
    if (url.pathname.startsWith('/api/promo/')) {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Előbb jelentkezz be!' });
      db.promos = db.promos || {}; ['zalqn111', 'zalqn222', 'zalqn333', 'zalqn444', 'zalqn555'].forEach(c => { if (!db.promos[c]) db.promos[c] = { by: null, uses: [], t: Date.now() }; });
      const roll = big => { const r = Math.random(), m = big ? 1 : .5; if (r < .4) return { k: 'ft', n: Math.round((5000 + Math.random() * 45000) * m / 1000) * 1000 }; if (r < .75) return { k: 'zs', n: Math.round((100 + Math.random() * 900) * m / 10) * 10 }; return { k: 'cos' }; };
      if (url.pathname === '/api/promo/redeem' && req.method === 'POST') {
        if (limited('promo:' + u.name, 10, 60000)) return send(res, 429, { error: 'Túl sok próbálkozás, várj egy percet!' });
        const b = await body(req); const code = String(b.code || '').trim().toLowerCase(); const p = db.promos[code];
        if (!p) return send(res, 400, { error: 'Nincs ilyen kód.' });
        if (p.by && p.by.toLowerCase() === u.name.toLowerCase()) return send(res, 400, { error: 'A saját kódodat nem válthatod be. Oszd meg a barátaiddal!' });
        u.promoUsed = u.promoUsed || []; if (u.promoUsed.includes(code)) return send(res, 400, { error: 'Ezt a kódot már beváltottad.' });
        u.promoUsed.push(code); p.uses.push({ n: u.name, t: Date.now() }); const rw = roll(true);
        if (p.by) { const o = db.users[p.by.toLowerCase()]; if (o) { o.promoRw = o.promoRw || []; o.promoRw.push({ from: u.name, code, rw: roll(false) }); if (o.promoRw.length > 50) o.promoRw = o.promoRw.slice(-50); try { toUser(o.name, { t: 'promo', from: u.name, code }); } catch (e) {} } }
        save(); return send(res, 200, { ok: true, rw, by: p.by });
      }
      if (url.pathname === '/api/promo/create' && req.method === 'POST') {
        const b = await body(req); const code = String(b.code || '').trim().toLowerCase();
        if (!/^[a-z0-9]{4,16}$/.test(code)) return send(res, 400, { error: 'A kód 4-16 karakter: csak betű (ékezet nélkül) és szám.' });
        if (db.promos[code]) return send(res, 400, { error: 'Ez a kód már foglalt.' });
        const mine = Object.values(db.promos).filter(p => p.by === u.name).length; if (mine >= 5) return send(res, 400, { error: 'Legfeljebb 5 saját kódod lehet.' });
        db.promos[code] = { by: u.name, uses: [], t: Date.now() }; save(); return send(res, 200, { ok: true, code });
      }
      if (url.pathname === '/api/promo/mine') {
        const list = Object.entries(db.promos).filter(([, p]) => p.by === u.name).map(([c, p]) => ({ code: c, uses: p.uses.length, last: p.uses.slice(-5).map(x => x.n) }));
        const pend = u.promoRw || []; u.promoRw = []; if (pend.length) save(); return send(res, 200, { list, pend });
      }
      return send(res, 404, { error: 'Ismeretlen.' });
    }
    if (url.pathname === '/api/gifts') {
      const u = auth(req); if (!u) return send(res, 401, { error: 'Nincs bejelentkezve.' });
      const day = new Date().toISOString().slice(0, 10);
      const list = u.gifts || []; u.gifts = []; save(); return send(res, 200, { list, sent: Object.entries(u.giftDay || {}).filter(([, d]) => d === day).map(([n]) => n) });
    }
    if (url.pathname === '/api/stats') { return send(res, 200, { users: Object.keys(db.users).length, online: wss ? wss.clients.size : 0 }); }
    if (url.pathname === '/api/check') { const n = (url.searchParams.get('name') || ''); return send(res, 200, { valid: NAME_RE.test(n), free: !db.users[n.toLowerCase()] }); }
    if (url.pathname === '/api/leaderboard') {
      const list = Object.values(db.users).map(pubUser).sort((a, b) => b.stats.wins - a.stats.wins || b.stats.kills - a.stats.kills).slice(0, 20);
      return send(res, 200, { list });
    }
    if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    // statikus fájlok
    let p = decodeURIComponent(url.pathname); if (p === '/') p = '/index.html';
    const fp = path.normalize(path.join(ROOT, p));
    if (!fp.startsWith(ROOT + path.sep) || /[\\/](server|backup|mentesek|node_modules|\.git)([\\/]|$)/i.test(fp.slice(ROOT.length)) || /\.(db|db-wal|db-shm|zip|bat)$/i.test(fp)) { res.writeHead(403); return res.end(); }
    fs.readFile(fp, (err, data) => { if (err) { res.writeHead(404); return res.end('Nincs ilyen fájl'); } res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': /\.(jpg|png)$/.test(fp) ? 'max-age=86400' : 'no-cache' }); res.end(data); });
  } catch (e) { send(res, 400, { error: 'Hibás kérés.' }); }
});

// ---------- valós idejű lobby: jelenlét, chat, barátok, parti ----------
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 400000 });
const online = new Map(); // name -> {ws, status, party}
const parties = new Map(); // id -> {leader, members:[names], ready:{}}
const out = (ws, o) => { try { ws.readyState === 1 && ws.send(JSON.stringify(o)); } catch (e) {} };
const toUser = (n, o) => { const c = online.get(n); if (c) out(c.ws, o); };
function presence() { return [...online.entries()].map(([n, c]) => { const u = db.users[n.toLowerCase()]; return { name: n, status: c.status, avatar: u.avatar || '😎', color: u.color || '#ffd23f', level: u.level || 1, rang: u.rang | 0 }; }); }
function broadcastPresence() { const list = presence(); online.forEach(c => out(c.ws, { t: 'presence', list })); }
function partyOf(n) { const c = online.get(n); return c && c.party ? parties.get(c.party) : null; }
function sendParty(p) { if (!p) return; const info = { t: 'party', leader: p.leader, members: p.members.map(n => { const u = db.users[n.toLowerCase()] || {}; return { name: n, ready: !!p.ready[n], avatar: u.avatar || '😎', color: u.color || '#ffd23f', level: u.level || 1 }; }) }; p.members.forEach(n => toUser(n, info)); }
function leaveParty(n) { const c = online.get(n), p = partyOf(n); if (!p) return; p.members = p.members.filter(x => x !== n); delete p.ready[n]; if (c) c.party = null; if (!p.members.length) parties.delete(p.id); else { if (p.leader === n) p.leader = p.members[0]; sendParty(p); } toUser(n, { t: 'party', leader: null, members: [] }); }
const clean = s => String(s || '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 200);

wss.on('connection', (ws, req) => {
  const token = new URL(req.url, 'http://x').searchParams.get('token');
  const name = sessions.get(token);
  if (!name) { out(ws, { t: 'error', error: 'Nincs bejelentkezve.' }); return ws.close(); }
  const prev = online.get(name); if (prev) { out(prev.ws, { t: 'kicked', error: 'Máshonnan bejelentkeztél.' }); prev.ws.close(); }
  online.set(name, { ws, status: 'lobby', party: null, msgs: [] });
  out(ws, { t: 'hello', you: name, list: presence() });
  broadcastPresence();
  online.forEach((c, n) => { if (n !== name) out(c.ws, { t: 'chat', ch: 'sys', text: name + ' csatlakozott.' }); });

  ws.on('message', raw => {
    if (raw.length > 4096 && !String(raw).startsWith('{"t":"cs_voice"')) return;
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    const me = online.get(name); if (!me || me.ws !== ws) return;
    const now = Date.now(); me.msgs = me.msgs.filter(x => now - x < 5000);
    if (m.t === 'chat') {
      if (me.msgs.length >= 5) return out(ws, { t: 'chat', ch: 'sys', text: 'Lassabban! (túl sok üzenet)' });
      me.msgs.push(now); const text = clean(m.text); if (!text) return;
      if (m.ch === 'party') { const p = partyOf(name); if (p) p.members.forEach(n => toUser(n, { t: 'chat', ch: 'party', from: name, text })); }
      else if (m.ch === 'dm' && online.has(m.to)) { [m.to, name].forEach(n => toUser(n, { t: 'chat', ch: 'dm', from: name, to: m.to, text })); }
      else online.forEach(c => out(c.ws, { t: 'chat', ch: 'global', from: name, text }));
    }
    else if (m.t === 'status') { me.status = ['lobby', 'match', 'menu'].includes(m.status) ? m.status : 'lobby'; broadcastPresence(); }
    else if (m.t === 'friend') {
      const u = db.users[name.toLowerCase()], o = db.users[String(m.name || '').toLowerCase()];
      if (!o || o.name === name) return; u.friends = u.friends || []; o.friends = o.friends || [];
      if (m.remove) { u.friends = u.friends.filter(x => x !== o.name); o.friends = o.friends.filter(x => x !== name); }
      else { if (!u.friends.includes(o.name)) u.friends.push(o.name); if (!o.friends.includes(name)) o.friends.push(name); toUser(o.name, { t: 'chat', ch: 'sys', text: name + ' felvett a barátai közé!' }); }
      save(); out(ws, { t: 'friends', list: u.friends }); toUser(o.name, { t: 'friends', list: o.friends });
    }
    else if (m.t === 'invite' && online.has(m.name) && m.name !== name) {
      let p = partyOf(name); if (!p) { p = { id: crypto.randomBytes(6).toString('hex'), leader: name, members: [name], ready: {} }; parties.set(p.id, p); me.party = p.id; sendParty(p); }
      if (p.members.length >= 4) return out(ws, { t: 'chat', ch: 'sys', text: 'A parti megtelt (max 4 fő).' });
      toUser(m.name, { t: 'invite', from: name, id: p.id });
    }
    else if (m.t === 'accept') { const p = parties.get(m.id); if (!p || p.members.length >= 4) return; leaveParty(name); p.members.push(name); me.party = p.id; sendParty(p); p.members.forEach(n => toUser(n, { t: 'chat', ch: 'party', from: '★', text: name + ' belépett a partiba.' })); }
    else if (m.t === 'leave') leaveParty(name);
    else if (m.t === 'prelay') { const p = partyOf(name); const d = m.d && typeof m.d === 'object' ? m.d : null; if (p && d && JSON.stringify(d).length < 2000) p.members.forEach(n => toUser(n, { t: 'prelay', from: name, d })); }
    else if (m.t === 'cs_join') {
      const u = db.users[name.toLowerCase()] || {};
      me.cs = { name, x: +m.x || 0, z: +m.z || 0, ry: +m.ry || 0, av: String(m.av || u.avatar || '😎').slice(0, 8), col: /^#[0-9a-f]{6}$/i.test(m.col || '') ? m.col : (u.color || '#ffd23f'), sit: m.sit == null ? -1 : m.sit | 0, cup: String(m.cup || '').slice(0, 24) };
      out(ws, { t: 'cs_list', list: [...online.values()].filter(c => c.cs && c !== me).map(c => c.cs) });
      online.forEach(c => { if (c.cs && c !== me) out(c.ws, { t: 'cs_join', p: me.cs }); });
    }
    else if (m.t === 'cs_leave') { if (me.cs) { me.cs = null; online.forEach(c => { if (c.cs) out(c.ws, { t: 'cs_leave', name }); }); } }
    else if (me.cs && m.t === 'cs_pos') { me.cs.x = +m.x || 0; me.cs.z = +m.z || 0; me.cs.ry = +m.ry || 0; online.forEach(c => { if (c.cs && c !== me) out(c.ws, { t: 'cs_pos', name, x: me.cs.x, z: me.cs.z, ry: me.cs.ry, mv: !!m.mv }); }); }
    else if (me.cs && m.t === 'cs_act') { const a = String(m.a || '').slice(0, 12), v = String(m.v == null ? '' : m.v).slice(0, 24); if (a === 'sit') me.cs.sit = +v; if (a === 'stand') me.cs.sit = -1; if (a === 'cup') me.cs.cup = v; online.forEach(c => { if (c.cs && c !== me) out(c.ws, { t: 'cs_act', name, a, v }); }); }
    else if (me.cs && m.t === 'cs_chat') { if (me.msgs.length >= 5) return; me.msgs.push(now); const text = clean(m.text); if (!text) return; online.forEach(c => { if (c.cs) out(c.ws, { t: 'cs_chat', name, text }); }); }
    else if (me.cs && m.t === 'cs_voice') { if (me.lastV && now - me.lastV < 1500) return; const d = String(m.d || ''); if (d.length > 380000 || !(d.startsWith('data:audio/') && d.indexOf(';base64,') > 0 && d.indexOf(';base64,') < 60)) return; me.lastV = now; online.forEach(c => { if (c.cs && c !== me) out(c.ws, { t: 'cs_voice', name, d }); }); }
    else if (m.t === 'ready') { const p = partyOf(name); if (p) { p.ready[name] = !!m.ready; sendParty(p); } }
    else if (m.t === 'start') { const p = partyOf(name); if (p && p.leader === name) { const mode = ['stw','flakon'].includes(m.mode) ? m.mode : 'royale', team = ['solo','duo','trio','squad'].includes(m.team) ? m.team : 'solo'; p.members.forEach(n => toUser(n, { t: 'start', by: name, mode, team })); } }
  });
  ws.on('close', () => { const c = online.get(name); if (c && c.ws === ws) { if (c.cs) online.forEach(o => { if (o.cs && o !== c) out(o.ws, { t: 'cs_leave', name }); }); leaveParty(name); online.delete(name); broadcastPresence(); } });
});

require('./mod_A')(server, db, wss, store); // A: /api/clientlog, napi users.json mentés, tesztfiók-takarítás
require('./mod_B')({ server, wss, db, sessions, save, online, parties, sendParty, leaveParty, saveFile, store }); // B: többjátékos modul
require('./mod_admin')({ server, db: () => db, sessions, online, save, store, send, body, saveFile, DATA }); // ADMIN: /api/admin/* (jog: users.admin, zalqn alap-admin), kitiltás, napló
require('./mod_cplus')({ server, db: () => db, sessions, online, save, store, send, body, saveFile }); // KASZINÓ+ PIAC: /api/cp/* + /api/admin/cp/* (SQL táblák cp_*)
server.listen(PORT, () => {
  const nets = require('os').networkInterfaces(); const ips = [];
  Object.values(nets).flat().forEach(n => { if (n && n.family === 'IPv4' && !n.internal) ips.push(n.address); });
  console.log('KÖZPÉNZ ROYALE szerver fut!');
  console.log('  Ezen a gépen:  http://localhost:' + PORT);
  ips.forEach(ip => console.log('  A wifin:       http://' + ip + ':' + PORT));
});
