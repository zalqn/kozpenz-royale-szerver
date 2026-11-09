// mod_A.js – (A) kliens-hibanapló (/api/clientlog → server/logs/client.log), napi users.json mentés (server/backup/, 14 nap),
// egyszeri tesztfiók-takarítás. Bekötés: server.js-ben require('./mod_A')(server, db, wss) a listen előtt.
const fs = require('fs'), path = require('path');
module.exports = function (server, db) {
  const DIR = process.env.DATA_DIR || __dirname, LOGD = path.join(DIR, 'logs'), BKD = path.join(DIR, 'backup'), DB_FILE = path.join(DIR, 'users.json');
  try { fs.mkdirSync(LOGD, { recursive: true }); fs.mkdirSync(BKD, { recursive: true }); } catch (e) {}

  // ---- 1. egyszeri takarítás: csak a kifejezetten tesztnek nevezett fiókok ----
  const TEST = ['pedteszt350', 'lb2teszt'];
  let rm = [];
  try { if (db && db.users) TEST.forEach(k => { if (db.users[k]) { delete db.users[k]; rm.push(k); } }); } catch (e) {}
  if (rm.length) {
    try { fs.copyFileSync(DB_FILE, path.join(BKD, 'users_takaritas_elott_' + Date.now() + '.json')); } catch (e) {}
    try { fs.writeFileSync(DB_FILE + '.tmp', JSON.stringify(db, null, 1)); fs.renameSync(DB_FILE + '.tmp', DB_FILE); console.log('[mod_A] tesztfiók törölve:', rm.join(', ')); } catch (e) { console.log('[mod_A] takarítás hiba', e.message); }
  }

  // ---- 2. napi users.json mentés, 14 nap megtartás ----
  function backup() {
    try {
      const d = new Date(), day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      const f = path.join(BKD, 'users_' + day + '.json');
      if (!fs.existsSync(f) && fs.existsSync(DB_FILE)) fs.copyFileSync(DB_FILE, f);
      const lim = Date.now() - 14 * 864e5;
      fs.readdirSync(BKD).forEach(n => { const p = path.join(BKD, n); try { if (/^users_/.test(n) && fs.statSync(p).mtimeMs < lim) fs.unlinkSync(p); } catch (e) {} });
    } catch (e) { console.log('[mod_A] mentés hiba', e.message); }
  }
  backup(); setInterval(backup, 3600e3).unref();

  // ---- 3. kliens-hibanapló ----
  const LOG = path.join(LOGD, 'client.log'), hits = new Map();
  const orig = server.listeners('request').slice();
  server.removeAllListeners('request');
  server.on('request', (req, res) => {
    if (req.url.split('?')[0] !== '/api/clientlog') return orig.forEach(f => f.call(server, req, res));
    const done = c => { res.writeHead(c, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end('{}'); };
    if (req.method !== 'POST') return done(405);
    const ip = req.socket.remoteAddress, now = Date.now(), t = (hits.get(ip) || []).filter(x => now - x < 600e3);
    if (t.length >= 30) return done(429); t.push(now); hits.set(ip, t);
    let d = '';
    req.on('data', c => { d += c; if (d.length > 4096) { req.destroy(); } });
    req.on('end', () => {
      let o; try { o = JSON.parse(d || '{}'); } catch (e) { return done(400); }
      const s = v => String(v == null ? '' : v).replace(/[\r\n]+/g, ' ⏎ ').slice(0, 600);
      const line = new Date().toISOString() + ' | ' + ip + ' | ' + s(o.u).slice(0, 20) + ' | ' + s(o.v).slice(0, 20) + ' | ' + s(o.m) + ' | ' + s(o.f).slice(0, 80) + ':' + (o.l | 0) + ':' + (o.c | 0) + ' | ' + s(o.st) + ' | ' + s(o.ua).slice(0, 120) + '\n';
      try { if (fs.existsSync(LOG) && fs.statSync(LOG).size > 2e6) fs.renameSync(LOG, LOG + '.1'); } catch (e) {}
      fs.appendFile(LOG, line, () => {});
      done(200);
    });
  });
};
