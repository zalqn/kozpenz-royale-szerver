// store.js – SQL tároló (node:sqlite, beépített, külső csomag nélkül).
// Táblák: users(k, j) = fiókonként 1 JSON sor · meta(k, j) = a db többi része (clans, promos, …) és modulok adatai (pl. mod_D)
//         saves(k, t, j) = felhőmentések. Fájl: DATA_DIR/kozpenz.db (WAL mód).
// Első induláskor átveszi a users.json + saves/*.json + mod_D.json tartalmát (a régi fájlok maradnak).
// Ha a node:sqlite nem elérhető → ok=false, és a szerver a régi JSON-fájlos mentést használja.
const fs = require('fs'), path = require('path');
const DATA = process.env.DATA_DIR || __dirname;
const S = { ok: false, file: path.join(DATA, 'kozpenz.db') };
let sql = null, st = {};
try {
  const { DatabaseSync } = require('node:sqlite');
  sql = new DatabaseSync(S.file);
  sql.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=3000;' +
    'CREATE TABLE IF NOT EXISTS users (k TEXT PRIMARY KEY, j TEXT NOT NULL);' +
    'CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, j TEXT NOT NULL);' +
    'CREATE TABLE IF NOT EXISTS saves (k TEXT PRIMARY KEY, t INTEGER, j TEXT NOT NULL);');
  st = {
    uAll: sql.prepare('SELECT k, j FROM users'), uPut: sql.prepare('INSERT INTO users(k,j) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET j=excluded.j'),
    uDel: sql.prepare('DELETE FROM users WHERE k=?'), mGet: sql.prepare('SELECT j FROM meta WHERE k=?'),
    mPut: sql.prepare('INSERT INTO meta(k,j) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET j=excluded.j'),
    sGet: sql.prepare('SELECT j FROM saves WHERE k=?'), sPut: sql.prepare('INSERT INTO saves(k,t,j) VALUES(?,?,?) ON CONFLICT(k) DO UPDATE SET t=excluded.t, j=excluded.j')
  };
  S.ok = true;
} catch (e) { console.log('[store] node:sqlite nem elérhető, JSON-fájlos mentés marad:', e.message); sql = null; }

const tx = fn => { sql.exec('BEGIN'); try { fn(); sql.exec('COMMIT'); } catch (e) { try { sql.exec('ROLLBACK'); } catch (_) {} throw e; } };
S.saveKey = name => String(name).toLowerCase().replace(/[^a-z0-9_áéíóöőúüű]/g, '_');
const rdJson = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

S.getMeta = k => { if (!S.ok) return null; const r = st.mGet.get(k); return r ? r.j : null; };
S.setMeta = (k, j) => { if (S.ok) st.mPut.run(k, j); };

// ---- egyszeri migráció ----
if (S.ok && !S.getMeta('migrated')) {
  try {
    tx(() => {
      const old = rdJson(path.join(DATA, 'users.json'));
      if (old && old.users) { const rest = Object.assign({}, old); delete rest.users; for (const [k, u] of Object.entries(old.users)) st.uPut.run(k, JSON.stringify(u)); st.mPut.run('db_rest', JSON.stringify(rest)); }
      const sd = path.join(DATA, 'saves'); let n = 0;
      try { for (const f of fs.readdirSync(sd)) { if (!f.endsWith('.json')) continue; const txt = fs.readFileSync(path.join(sd, f), 'utf8'); let t = 0; try { t = JSON.parse(txt).t || 0; } catch (e) { continue; } st.sPut.run(f.slice(0, -5), t, txt); n++; } } catch (e) {}
      const md = path.join(DATA, 'mod_D.json'); if (fs.existsSync(md)) { const j = fs.readFileSync(md, 'utf8'); try { JSON.parse(j); st.mPut.run('mod_D', j); } catch (e) {} }
      st.mPut.run('migrated', JSON.stringify({ t: Date.now(), users: old && old.users ? Object.keys(old.users).length : 0, saves: n }));
      console.log('[store] migráció kész:', S.getMeta('migrated') || '');
    });
  } catch (e) { console.log('[store] migráció hiba, JSON-fájlos mentés marad:', e.message); S.ok = false; }
}

// ---- fiók-adatbázis ----
const last = new Map(); let lastRest = null;
S.loadDb = () => {
  if (!S.ok) return null;
  const db = Object.assign({}, JSON.parse(S.getMeta('db_rest') || '{}')); db.users = {};
  for (const r of st.uAll.all()) { try { db.users[r.k] = JSON.parse(r.j); last.set(r.k, r.j); } catch (e) {} }
  lastRest = S.getMeta('db_rest'); return db;
};
S.saveDb = db => { // csak a változott sorokat írja, 1 tranzakcióban
  if (!S.ok) return false;
  tx(() => {
    const users = db.users || {};
    for (const [k, u] of Object.entries(users)) { const j = JSON.stringify(u); if (last.get(k) !== j) { st.uPut.run(k, j); last.set(k, j); } }
    for (const k of [...last.keys()]) if (!(k in users)) { st.uDel.run(k); last.delete(k); }
    const rest = Object.assign({}, db); delete rest.users; const rj = JSON.stringify(rest);
    if (rj !== lastRest) { st.mPut.run('db_rest', rj); lastRest = rj; }
  });
  return true;
};

// ---- felhőmentések (szöveg = {"t":…,"d":{…}}) ----
S.readSave = name => { if (!S.ok) return null; const r = st.sGet.get(S.saveKey(name)); return r ? r.j : null; };
S.writeSave = (name, txt, t) => { if (!S.ok) return false; st.sPut.run(S.saveKey(name), t || Date.now(), txt); return true; };

// ---- biztonsági másolat (mod_A napi mentéséhez) ----
S.backup = file => { if (!S.ok) return false; try { if (fs.existsSync(file)) return true; sql.exec("VACUUM INTO '" + file.replace(/'/g, "''") + "'"); return true; } catch (e) { console.log('[store] backup hiba', e.message); return false; } };
S.sql = sql; S.tx = fn => tx(fn); // modulok saját táblái (pl. mod_cplus)
S.close = () => { try { sql && sql.close(); } catch (e) {} };
if (S.ok) console.log('[store] SQL adatbázis:', S.file);
module.exports = S;
