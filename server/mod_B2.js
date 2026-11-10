// mod_B2 – B ügynök: 👥 DUÓ / SQUAD royale valódi csapattársakkal (közös busz), 🤖 bot-szinkron (host dönt, a többiek interpolálnak),
// 🎰 többjátékos rulett (közös asztal, közös pörgetés). Kliens: multiB.js (mb2_* üzenetek), kaszino3.js (rulett).
// A server.js 1 sorral hívja: require('./mod_B2')({ wss, sessions, parties });
const crypto = require('crypto');
module.exports = function (X) {
  const { wss, sessions, parties } = X;
  const now = () => Date.now();
  const cl = new Map(); // név -> ws
  const out = (ws, o) => { try { if (ws && ws.readyState === 1) (ws.__mbSend || ws.send.bind(ws))(JSON.stringify(o)); } catch (e) {} };
  const to = (n, o) => out(cl.get(n), o);

  // ================= DUÓ / SQUAD =================
  const Q = { duo: [], squad: [] }; // elemek: {grp:[nevek], t}
  const matches = new Map(), inM = new Map();
  const TS = { duo: 2, squad: 4 };
  const unq = n => { for (const k in Q) Q[k] = Q[k].filter(e => { if (e.grp.includes(n)) { e.grp.forEach(x => x !== n && to(x, { t: 'mb2_note', text: n + ' kilépett a sorból.' })); return false; } return true; }); };
  const mOf = n => { const id = inM.get(n); return id ? matches.get(id) : null; };
  const cast = (M, o, ex) => M.players.forEach(p => { if (p.name !== ex) to(p.name, o); });
  setInterval(() => {
    for (const mode in Q) {
      const q = Q[mode]; q.forEach(e => { e.grp = e.grp.filter(n => cl.get(n)); }); Q[mode] = q.filter(e => e.grp.length);
      const L = Q[mode]; if (!L.length) continue;
      const tot = L.reduce((s, e) => s + e.grp.length, 0), old = now() - L[0].t;
      if (tot >= 8 || (tot >= 2 && old > 10000) || old > 30000) start(mode, L.splice(0, L.length));
      else L.forEach(e => e.grp.forEach(n => to(n, { t: 'mb2_qs', mode, n: tot, w: Math.round((now() - e.t) / 1000) })));
    }
  }, 1000);
  function start(mode, groups) {
    const S = TS[mode], teams = []; // csoportokat csapatokba tömörítünk (egy parti nem szakad szét, ha belefér)
    groups.sort((a, b) => b.grp.length - a.grp.length).forEach(e => {
      let rest = e.grp.slice();
      while (rest.length) { let t = teams.find(t => t.length + rest.length <= S) || teams.find(t => t.length < S); if (!t) { t = []; teams.push(t); } const take = rest.splice(0, S - t.length); t.push(...take); }
    });
    const id = crypto.randomBytes(5).toString('hex'), players = [];
    teams.forEach((t, ti) => t.forEach(n => players.push({ name: n, team: ti, avatar: '😎', color: ['#22c55e', '#3b82f6', '#f97316', '#a855f7'][ti % 4] })));
    const M = { id, mode, players, alive: new Set(players.map(p => p.name)), host: players[0].name, t: now() };
    matches.set(id, M); players.forEach(p => inM.set(p.name, id));
    cast(M, { t: 'mb2_start', id, mode, players, host: M.host, team: true, ranked: false });
  }
  function die(M, n, by) {
    if (!M.alive.has(n)) return; M.alive.delete(n);
    const teamsLeft = new Set([...M.alive].map(x => M.players.find(p => p.name === x).team));
    cast(M, { t: 'mb2_dead', name: n, by: by || null, place: teamsLeft.size + 1 });
    if (M.host === n && M.alive.size) { M.host = [...M.alive][0]; cast(M, { t: 'mb2_host', host: M.host }); }
    if (teamsLeft.size <= 1) {
      const wt = [...teamsLeft][0];
      if (wt != null) cast(M, { t: 'mb2_win', team: wt, names: M.players.filter(p => p.team === wt).map(p => p.name) });
      setTimeout(() => { M.players.forEach(p => { if (inM.get(p.name) === M.id) inM.delete(p.name); }); matches.delete(M.id); }, 3000);
    }
  }

  // ================= TÖBBJÁTÉKOS RULETT =================
  const RT = { seats: new Map(), bets: new Map(), phase: 'bet', tm: 25, hist: [] }; // seats: név -> 1
  const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const rState = () => ({ t: 'mb2_rl', phase: RT.phase, tm: RT.tm, hist: RT.hist.slice(-12), players: [...RT.seats.keys()].map(n => ({ n, b: (RT.bets.get(n) || []).reduce((s, b) => s + b.v, 0) })) });
  const rCast = o => RT.seats.forEach((v, n) => to(n, o));
  setInterval(() => {
    if (!RT.seats.size) { RT.phase = 'bet'; RT.tm = 25; return; }
    RT.tm--;
    if (RT.phase === 'bet' && RT.tm <= 0) {
      RT.phase = 'spin'; RT.tm = 6; const r = crypto.randomInt(0, 37); RT.hist.push(r);
      const res = {}; RT.bets.forEach((bs, n) => { res[n] = bs; });
      rCast({ t: 'mb2_rl_spin', r, color: r === 0 ? 'zold' : RED.has(r) ? 'piros' : 'fekete', bets: res });
      RT.bets.clear();
    } else if (RT.phase === 'spin' && RT.tm <= 0) { RT.phase = 'bet'; RT.tm = 25; }
    rCast(rState());
  }, 1000);

  // ================= WS =================
  wss.on('connection', (ws, req) => {
    const name = sessions.get(new URL(req.url, 'http://x').searchParams.get('token')); if (!name) return;
    cl.set(name, ws);
    const rate = {}; const lim = (k, n, ms) => { const t = now(); rate[k] = (rate[k] || []).filter(x => t - x < ms); if (rate[k].length >= n) return true; rate[k].push(t); return false; };
    ws.on('close', () => { if (cl.get(name) !== ws) return; cl.delete(name); unq(name); const M = mOf(name); if (M) die(M, name, null); RT.seats.delete(name); RT.bets.delete(name); });
    ws.on('message', raw => {
      if (raw.length > 60000) return; const s = String(raw); if (s.indexOf('"mb2_') < 0) return;
      let m; try { m = JSON.parse(s); } catch (e) { return; } if (!m || typeof m.t !== 'string' || !m.t.startsWith('mb2_') || cl.get(name) !== ws) return;
      const t = m.t;
      if (t === 'mb2_q') {
        const mode = m.mode === 'squad' ? 'squad' : 'duo'; if (mOf(name)) return;
        const p = parties && [...parties.values()].find(p => p.members.includes(name));
        if (p && p.leader !== name) return to(name, { t: 'mb2_note', text: 'A parti vezetője állít sorba.' });
        const grp = (p ? p.members : [name]).filter(n => cl.get(n) && !mOf(n)).slice(0, TS[mode]);
        grp.forEach(unq); Q[mode].push({ grp, t: now() }); grp.forEach(n => to(n, { t: 'mb2_qs', mode, n: grp.length, w: 0 }));
      }
      else if (t === 'mb2_unq') unq(name);
      else if (t === 'mb2_pos') { const M = mOf(name); if (!M || !M.alive.has(name) || lim('p', 30, 1000)) return; cast(M, { t: 'mb2_pos', n: name, x: +m.x || 0, y: +m.y || 0, z: +m.z || 0, a: +m.a || 0, hp: m.hp | 0 }, name); }
      else if (t === 'mb2_shot') { const M = mOf(name); if (!M || lim('s', 20, 1000)) return; cast(M, { t: 'mb2_shot', n: name, x: +m.x || 0, z: +m.z || 0, a: +m.a || 0 }, name); }
      else if (t === 'mb2_hit') { const M = mOf(name); if (!M || !M.alive.has(name) || !M.alive.has(m.to) || lim('h', 25, 1000)) return;
        const a = M.players.find(p => p.name === name), b = M.players.find(p => p.name === m.to); if (!a || !b || a.team === b.team) return; // nincs csapatsebzés
        to(b.name, { t: 'mb2_hit', from: name, d: Math.max(0, Math.min(250, +m.d || 0)) }); }
      else if (t === 'mb2_dead') { const M = mOf(name); if (M) die(M, name, M.players.some(p => p.name === m.by) ? m.by : null); }
      else if (t === 'mb2_leave') { unq(name); const M = mOf(name); if (M) { die(M, name, null); inM.delete(name); } }
      // közös busz + botok: csak a host küldheti, a szerver a meccs többi tagjának továbbítja
      else if (t === 'mb2_bus' || t === 'mb2_bots') {
        if (lim('b', 12, 1000)) return; const b = Array.isArray(m.b) ? m.b.slice(0, 40) : [];
        const M = mOf(name);
        if (M) { if (M.host !== name) return; cast(M, { t, b, x: +m.x || 0, z: +m.z || 0, y: +m.y || 0, ph: String(m.ph || '').slice(0, 8) }, name); }
        else if (Array.isArray(m.to)) m.to.slice(0, 8).forEach(n => { if (typeof n === 'string' && n !== name) to(n, { t, b, x: +m.x || 0, z: +m.z || 0, y: +m.y || 0, ph: String(m.ph || '').slice(0, 8), from: name }); }); // sima közös (mod_B) meccs: a kliens adja meg a társakat
      }
      else if (t === 'mb2_bhit') { if (lim('bh', 30, 1000)) return; const M = mOf(name), host = M ? M.host : String(m.host || ''); if (host && host !== name) to(host, { t: 'mb2_bhit', i: m.i | 0, d: Math.max(0, Math.min(200, +m.d || 0)), from: name }); }
      // rulett
      else if (t === 'mb2_rl_sit') { if (RT.seats.size >= 8 && !RT.seats.has(name)) return to(name, { t: 'mb2_note', text: 'Az asztal tele (8 fő).' }); RT.seats.set(name, 1); out(ws, rState()); }
      else if (t === 'mb2_rl_leave') { RT.seats.delete(name); RT.bets.delete(name); }
      else if (t === 'mb2_rl_bet') { if (!RT.seats.has(name) || RT.phase !== 'bet' || lim('rb', 10, 1000)) return; const k = String(m.k || '').slice(0, 12), v = Math.floor(+m.v || 0); if (v < 1 || v > 100000) return;
        const bs = RT.bets.get(name) || []; if (bs.length >= 20) return; bs.push({ k, v }); RT.bets.set(name, bs); rCast(rState()); }
      else if (t === 'mb2_rl_chat') { if (!RT.seats.has(name) || lim('rc', 3, 3000)) return; rCast({ t: 'mb2_rl_chat', n: name, text: String(m.text || '').slice(0, 80) }); }
    });
  });
  console.log('[mod_B2] duó/squad + bot-szinkron + többjátékos rulett betöltve');
};
