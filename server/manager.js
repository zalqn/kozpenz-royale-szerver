// KÖZPÉNZ ROYALE szerverkezelő – önálló folyamat, csak 127.0.0.1. Indítás: node server\manager.js (MGR_PORT, MGR_TOKEN, MAIN_PORT env)
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawn, execFile } = require('child_process');
const HOST = '127.0.0.1', MPORT = +process.env.MGR_PORT || 3900, MAIN = +process.env.MAIN_PORT || 3000, MGR_TOKEN = process.env.MGR_TOKEN || '';
const DIR = __dirname, IDIR = path.join(DIR, 'instances'), BDIR = path.join(DIR, 'instance_backups'), LIST = path.join(DIR, 'instances.json');
const NAME_RE = /^[a-z0-9_-]{1,32}$/, okPort = p => Number.isInteger(p) && p >= 3001 && p <= 3999;
const sessions = new Map(); // mgr token -> {name, exp}
const inst = new Map();     // név -> {name, port, auto, proc, start, log[], hist[], cpuPrev, stopping}
const ext = { name: 'fo-3000', port: MAIN, external: true, log: [], hist: [], pid: 0 };

function persist() { fs.writeFileSync(LIST + '.tmp', JSON.stringify([...inst.values()].map(i => ({ name: i.name, port: i.port, auto: !!i.auto })), null, 1)); fs.renameSync(LIST + '.tmp', LIST); }
try { for (const c of JSON.parse(fs.readFileSync(LIST, 'utf8'))) if (NAME_RE.test(c.name) && okPort(c.port)) inst.set(c.name, { ...c, log: [], hist: [] }); } catch (e) {}

const sse = new Set(); // {res, name}
function addLog(i, line) { i.log.push(line); if (i.log.length > 500) i.log.splice(0, i.log.length - 500); for (const c of sse) if (c.name === i.name) c.res.write('data: ' + JSON.stringify(line) + '\n\n'); }

function start(i) {
  if (i.proc) return;
  const data = path.join(IDIR, i.name); fs.mkdirSync(data, { recursive: true });
  const p = spawn(process.execPath, [path.join(DIR, 'server.js')], { cwd: DIR, env: { ...process.env, PORT: String(i.port), DATA_DIR: data }, windowsHide: true });
  i.proc = p; i.start = Date.now(); i.stopping = false; i.cpuPrev = null;
  addLog(i, `[mgr] indítás PID ${p.pid}, port ${i.port}`);
  const pipe = tag => b => String(b).split(/\r?\n/).forEach(l => l && addLog(i, tag + l));
  p.stdout.on('data', pipe('')); p.stderr.on('data', pipe('[ERR] '));
  p.on('exit', (code, sig) => {
    i.proc = null; addLog(i, `[mgr] kilépett (kód ${code}${sig ? ', ' + sig : ''})`);
    if (!i.stopping && i.auto && inst.get(i.name) === i) { addLog(i, '[mgr] automatikus újraindítás 3 mp múlva'); setTimeout(() => { if (inst.get(i.name) === i && !i.proc) start(i); }, 3000); }
  });
}
function stop(i) { return new Promise(r => { if (!i.proc) return r(); i.stopping = true; i.proc.once('exit', () => r()); i.proc.kill(); }); }

// HTTP segéd a játékszerverekhez
function req(port, p, { method = 'GET', token, json } = {}) {
  return new Promise(res => {
    const data = json ? JSON.stringify(json) : null;
    const r = http.request({ host: HOST, port, path: p, method, timeout: 2500, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}) } }, rs => {
      let b = ''; rs.on('data', d => b += d); rs.on('end', () => { let j = null; try { j = JSON.parse(b); } catch (e) {} res({ status: rs.statusCode, j }); });
    });
    r.on('error', () => res({ status: 0 })); r.on('timeout', () => r.destroy()); if (data) r.write(data); r.end();
  });
}

// Mérés 2 mp-enként: RAM/CPU PowerShell-lel (fix argumentum, csak egész PID-ek), online az /api/stats-ból
function pidOfPort(port) { return new Promise(r => execFile('netstat', ['-ano', '-p', 'TCP'], { windowsHide: true }, (e, out) => { const m = String(out || '').split('\n').find(l => / LISTENING /.test(l) && new RegExp(':' + port + '\\s').test(l)); r(m ? +m.trim().split(/\s+/).pop() : 0); })); }
function procInfo(pids) {
  pids = pids.filter(p => Number.isInteger(p) && p > 0); if (!pids.length) return Promise.resolve({});
  if (process.platform !== 'win32') return Promise.resolve({}); // shortcut: csak Windows-mérés, Linuxon /proc kellene
  return new Promise(r => execFile('powershell', ['-NoProfile', '-Command', `Get-Process -Id ${pids.join(',')} -ErrorAction SilentlyContinue | ForEach-Object { "$($_.Id) $($_.WorkingSet64) $($_.TotalProcessorTime.TotalMilliseconds)" }`], { windowsHide: true }, (e, out) => {
    const o = {}; String(out || '').split(/\r?\n/).forEach(l => { const [id, ws, cpu] = l.trim().split(' ').map(Number); if (id) o[id] = { ram: ws, cpu }; }); r(o);
  }));
}
const NCPU = require('os').cpus().length;
async function sample() {
  ext.pid = await pidOfPort(MAIN);
  const all = [ext, ...inst.values()], info = await procInfo(all.map(i => i.external ? i.pid : i.proc && i.proc.pid));
  await Promise.all(all.map(async i => {
    const pid = i.external ? i.pid : i.proc && i.proc.pid, pi = pid && info[pid], now = Date.now();
    i.ram = pi ? pi.ram : 0;
    i.cpuPct = pi && i.cpuPrev && i.cpuPrev.pid === pid ? Math.max(0, Math.round((pi.cpu - i.cpuPrev.cpu) / (now - i.cpuPrev.t) / NCPU * 1000) / 10) : 0;
    i.cpuPrev = pi ? { pid, cpu: pi.cpu, t: now } : null;
    const s = pid ? await req(i.port, '/api/stats') : { status: 0 };
    i.online = s.j ? s.j.online : null; i.users = s.j ? s.j.users : null; i.up = s.status === 200;
    i.hist.push([now, i.cpuPct, Math.round(i.ram / 1048576), i.online || 0]); while (i.hist.length && i.hist[0][0] < now - 300000) i.hist.shift();
  }));
}
setInterval(() => sample().catch(() => {}), 2000);

function view(i) { const pid = i.external ? i.pid : i.proc ? i.proc.pid : 0; return { name: i.name, port: i.port, external: !!i.external, auto: !!i.auto, running: !!pid, up: !!i.up, pid, uptime: !i.external && i.proc ? Date.now() - i.start : null, ram: i.ram || 0, cpu: i.cpuPct || 0, online: i.online, users: i.users, hist: i.hist }; }

// Belépés: a fő szerver loginja + /api/admin/me; ha a fő szerver áll → MGR_TOKEN
async function login(b) {
  let token = b.token;
  if (b.name && b.pass) { const l = await req(MAIN, '/api/login', { method: 'POST', json: { name: String(b.name), pass: String(b.pass) } }); if (l.status === 200) token = l.j.token; else if (l.status) return null; }
  if (token) { const m = await req(MAIN, '/api/admin/me', { token: String(token) }); if (m.status === 200) return m.j.name; if (m.status) return null; }
  const t = String(b.mgrToken || b.token || '');
  if (MGR_TOKEN && t.length === MGR_TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(MGR_TOKEN))) return 'MGR_TOKEN';
  return null;
}
function authed(rq, url) { const t = (rq.headers.authorization || '').replace('Bearer ', '') || url.searchParams.get('tk') || ''; const s = sessions.get(t); if (s && s.exp > Date.now()) return s; sessions.delete(t); return null; }
const tries = new Map();
function body(rq) { return new Promise(r => { let b = ''; rq.on('data', d => { b += d; if (b.length > 10000) rq.destroy(); }); rq.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (e) { r({}); } }); }); }
const send = (res, c, o) => { res.writeHead(c, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(o)); };
const stamp = () => new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);

http.createServer(async (rq, res) => {
  const url = new URL(rq.url, 'http://x'), p = url.pathname;
  if (rq.headers.host && !/^(127\.0\.0\.1|localhost):\d+$/.test(rq.headers.host)) return send(res, 403, { error: 'host' }); // DNS-rebinding ellen
  if (p === '/' || p === '/devpanel.html') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return fs.createReadStream(path.join(DIR, '..', 'devpanel.html')).pipe(res); }
  if (p === '/api/login' && rq.method === 'POST') {
    const k = rq.socket.remoteAddress, t = tries.get(k) || []; const recent = t.filter(x => x > Date.now() - 300000); if (recent.length >= 10) return send(res, 429, { error: 'Túl sok próbálkozás.' });
    const who = await login(await body(rq)); if (!who) { recent.push(Date.now()); tries.set(k, recent); return send(res, 401, { error: 'Hibás belépés vagy nem admin.' }); }
    const tk = crypto.randomBytes(24).toString('hex'); sessions.set(tk, { name: who, exp: Date.now() + 12 * 3600e3 }); return send(res, 200, { token: tk, name: who });
  }
  const s = authed(rq, url); if (!s) return send(res, 401, { error: 'Nincs token.' });
  if (p === '/api/list') return send(res, 200, { me: s.name, list: [view(ext), ...[...inst.values()].map(view)] });
  if (p === '/api/log') {
    const n = url.searchParams.get('name'), i = n === ext.name ? ext : inst.get(n); if (!i) return send(res, 404, { error: 'nincs' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' }); i.log.forEach(l => res.write('data: ' + JSON.stringify(l) + '\n\n'));
    const c = { res, name: n }; sse.add(c); rq.on('close', () => sse.delete(c)); return;
  }
  if (rq.method !== 'POST') return send(res, 404, { error: '?' });
  const b = await body(rq), name = String(b.name || '');
  if (p === '/api/external/stop') {
    if (b.confirm !== 'LEALLITOM') return send(res, 400, { error: 'Megerősítés kell: LEALLITOM' });
    if (!ext.pid) return send(res, 409, { error: 'Nem fut.' });
    execFile('taskkill', ['/PID', String(+ext.pid), '/F'], { windowsHide: true }, () => {}); addLog(ext, '[mgr] leállítva (' + s.name + ')'); return send(res, 200, { ok: true });
  }
  if (!NAME_RE.test(name)) return send(res, 400, { error: 'A név csak [a-z0-9_-] lehet (max 32).' });
  const i = inst.get(name);
  if (p === '/api/create') {
    const port = +b.port; if (i) return send(res, 409, { error: 'Már van ilyen.' });
    if (!okPort(port) || [...inst.values()].some(x => x.port === port)) return send(res, 400, { error: 'Port 3001–3999, és szabad legyen.' });
    const data = path.join(IDIR, name); fs.mkdirSync(data, { recursive: true });
    if (b.copy) { // csak olvassa a forrást
      for (const f of ['kozpenz.db', 'kozpenz.db-wal', 'kozpenz.db-shm', 'users.json', 'mod_D.json']) if (fs.existsSync(path.join(DIR, f))) fs.copyFileSync(path.join(DIR, f), path.join(data, f));
      if (fs.existsSync(path.join(DIR, 'saves'))) fs.cpSync(path.join(DIR, 'saves'), path.join(data, 'saves'), { recursive: true }); // shortcut: élő SQLite fájlmásolás, ritkán félkész tranzakciót kaphat; ha gond, VACUUM INTO
    }
    const n = { name, port, auto: !!b.auto, log: [], hist: [] }; inst.set(name, n); persist(); addLog(n, '[mgr] létrehozva' + (b.copy ? ' (adat a főből másolva)' : '')); return send(res, 200, { ok: true });
  }
  if (!i) return send(res, 404, { error: 'Nincs ilyen példány.' });
  if (p === '/api/start') { start(i); return send(res, 200, { ok: true }); }
  if (p === '/api/stop') { await stop(i); return send(res, 200, { ok: true }); }
  if (p === '/api/restart') { await stop(i); start(i); return send(res, 200, { ok: true }); }
  if (p === '/api/auto') { i.auto = !!b.auto; persist(); return send(res, 200, { ok: true }); }
  if (p === '/api/backup') { const to = path.join(BDIR, name, stamp()); fs.cpSync(path.join(IDIR, name), to, { recursive: true }); addLog(i, '[mgr] mentés: ' + to); return send(res, 200, { ok: true, path: to }); }
  if (p === '/api/delete') {
    if (b.confirm !== name) return send(res, 400, { error: 'Megerősítéshez írd be a nevet.' });
    await stop(i); inst.delete(name); persist(); for (const c of sse) if (c.name === name) c.res.end();
    fs.rmSync(path.join(IDIR, name), { recursive: true, force: true }); return send(res, 200, { ok: true });
  }
  send(res, 404, { error: '?' });
}).listen(MPORT, HOST, () => { console.log('Szerverkezelő: http://127.0.0.1:' + MPORT); for (const i of inst.values()) if (i.auto) start(i); });

const bye = async () => { await Promise.all([...inst.values()].map(stop)); process.exit(0); };
process.on('SIGINT', bye); process.on('SIGTERM', bye);
