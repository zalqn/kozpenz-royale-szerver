// multiB.js – 🌐 TÖBBJÁTÉKOS (B): közös royale meccs (valódi játékosok + botok), rangsorolt divíziók,
// hangchat meccsben (V nyomva), barátok + „Csatlakozom”, szerveres ranglisták, moderálás, kereskedés, póker.
// Szerver: server/mod_B.js (WS mb_* üzenetek, /api/mb/*). Helyi kulcsok: k3B*. Debug: _mb
(function () {
  'use strict';
  const RUN = () => { try { return run; } catch (e) { return false; } }, GG = () => { try { return G; } catch (e) { return null; } };
  const K = () => window.KR, A = () => (K() ? K().acc() : {}), logged = () => { const a = A(); return a && a.token && !a.guest && a.ws && a.ws.readyState === 1; };
  const ws = o => { if (K()) K().wsend(o); };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (h, b) => { if (K()) K().toast(h, b); };
  const me = () => (A().user || {}).name;
  const fmt = n => Math.round(n || 0).toLocaleString('hu-HU');
  const LS = { g(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, s(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  async function api(p, b) { const a = A(); const r = await fetch(p, { method: b ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, a.token ? { Authorization: 'Bearer ' + a.token } : {}), body: b ? JSON.stringify(b) : undefined }); return r.json(); }
  const cloudUp = () => { try { window._cloud && window._cloud.up && window._cloud.up(true); } catch (e) {} };
  const saveBR = () => { try { localStorage.setItem('k3br', JSON.stringify(window.BR)); } catch (e) {} };
  const saveS = () => { try { typeof save === 'function' && save(); } catch (e) {} };

  // ---------------- stílus + panel ----------------
  const css = document.createElement('style');
  css.textContent = `#mbBtn{position:fixed;left:12px;top:46%;z-index:60;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;border:0;border-radius:12px;padding:10px 12px;font:700 14px system-ui;cursor:pointer;box-shadow:0 4px 14px #0008;display:none}
body:has(#lb.on) #mbBtn{display:block}
#mbP{position:fixed;inset:5% 8%;z-index:9000;background:#0b1220f2;border:2px solid #38bdf8;border-radius:16px;color:#e2e8f0;font:14px system-ui;display:none;flex-direction:column;box-shadow:0 10px 40px #000c}
#mbP.on{display:flex}#mbP h2{margin:0;font-size:20px;color:#7dd3fc}#mbP .hd{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #1e293b}
#mbP button{all:revert;width:auto!important;display:inline-block!important;margin:2px!important;background:#1e293b!important;color:#e2e8f0!important;border:1px solid #334155!important;border-radius:8px!important;padding:6px 10px!important;font:600 13px system-ui!important;cursor:pointer;box-shadow:none!important;transform:none!important;text-shadow:none!important}#mbP button.on{background:#0ea5e9!important;color:#fff!important}#mbP button.y{background:#facc15!important;color:#111!important}#mbP button.r{background:#b91c1c!important}#mbP button.g{background:#15803d!important}
#mbP .tabs{display:flex;gap:6px;padding:8px 16px;flex-wrap:wrap}#mbP .tabs button,#mbP .b{background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 10px;cursor:pointer;font:600 13px system-ui}
#mbP .tabs button.on{background:#0ea5e9;color:#fff}#mbP .b.y{background:#facc15;color:#111;border-color:#facc15}#mbP .b.r{background:#b91c1c;border-color:#ef4444}#mbP .b.g{background:#15803d;border-color:#22c55e}
#mbP .bd{flex:1;overflow:auto;padding:12px 16px}#mbP table{border-collapse:collapse;width:100%}#mbP td,#mbP th{padding:4px 6px;border-bottom:1px solid #1e293b;text-align:left}
#mbP input{background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;padding:5px 8px}#mbP .x{margin-left:auto}
.mbDot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#475569}.mbDot.on{background:#22c55e;box-shadow:0 0 6px #22c55e}.mbDot.mt{background:#f59e0b}
.mbCard{display:inline-block;width:38px;height:54px;border-radius:6px;background:#fff;color:#111;font:700 17px system-ui;text-align:center;line-height:54px;margin:2px;box-shadow:0 2px 4px #0008}.mbCard.rd{color:#dc2626}.mbCard.bk{background:repeating-linear-gradient(45deg,#1d4ed8,#1d4ed8 4px,#1e3a8a 4px,#1e3a8a 8px)}
.mbFelt{background:radial-gradient(#166534,#052e16);border:6px solid #78350f;border-radius:120px;padding:18px;text-align:center;margin:8px 0}
.mbSeat{display:inline-block;vertical-align:top;width:150px;margin:6px;padding:6px;border-radius:10px;background:#0f172acc;border:2px solid #334155}.mbSeat.turn{border-color:#facc15;box-shadow:0 0 10px #facc15}.mbSeat.fold{opacity:.45}
#mbHud{position:fixed;top:60px;left:50%;transform:translateX(-50%);z-index:70;background:#0b1220cc;color:#7dd3fc;font:700 13px system-ui;padding:5px 12px;border-radius:10px;border:1px solid #38bdf8;display:none;pointer-events:none}
#mbTalk{position:fixed;bottom:120px;left:50%;transform:translateX(-50%);z-index:70;background:#dc2626;color:#fff;font:700 14px system-ui;padding:6px 14px;border-radius:20px;display:none}`;
  document.head.appendChild(css);
  const btn = document.createElement('button'); btn.id = 'mbBtn'; btn.textContent = '🌐 TÖBBJÁTÉKOS'; btn.title = 'Többjátékos: közös royale, rangsorolt, barátok, ranglista, kereskedés, póker';
  document.body.appendChild(btn);
  const P = document.createElement('div'); P.id = 'mbP';
  P.innerHTML = '<div class="hd"><h2>🌐 TÖBBJÁTÉKOS</h2><span id="mbDiv"></span><button class="b x" id="mbX">✖</button></div><div class="tabs" id="mbTabs"></div><div class="bd" id="mbBd"></div>';
  document.body.appendChild(P);
  const TABS = [['royale', '⚔️ Közös royale'], ['fr', '👥 Barátok'], ['top', '🏆 Ranglisták'], ['tr', '🔄 Kereskedés'], ['pk', '🃏 Póker'], ['mod', '🛡️ Moderálás']];
  let tab = LS.g('k3Btab', 'royale');
  const $ = id => document.getElementById(id), bd = () => $('mbBd');
  $('mbTabs').innerHTML = TABS.map(t => '<button data-t="' + t[0] + '">' + t[1] + '</button>').join('');
  $('mbTabs').onclick = e => { const t = e.target.dataset.t; if (t) { tab = t; LS.s('k3Btab', t); render(); } };
  $('mbX').onclick = () => { P.classList.remove('on'); ws({ t: 'mb_pk_list' }); };
  btn.onclick = () => { P.classList.add('on'); render(); refreshMe(); };
  const ST = { me: null, q: null, top: null, topK: 'wins', tr: null, trReq: [], pk: null, pkList: null, hole: null, mutes: [] };
  async function refreshMe() { if (!logged()) return; try { ST.me = await api('/api/mb/me'); ST.mutes = ST.me.mutes || []; } catch (e) {} hdr(); if (tab !== 'pk' && tab !== 'tr') render(); }
  function hdr() { const m = ST.me; $('mbDiv').innerHTML = m ? '🎖️ <b style="color:#facc15">' + esc(m.div.n) + '</b> · ' + m.rp + ' RP' + (m.div.next ? ' (következő: ' + m.div.next + ')' : '') : ''; }
  const need = () => logged() ? '' : '<p>⚠️ Ehhez <b>be kell jelentkezned</b> (a szerverrel együtt: INDITAS.bat).</p>';

  function render() {
    [...$('mbTabs').children].forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    const n = need(); if (n) { bd().innerHTML = n; return; }
    ({ royale: rRoyale, fr: rFriends, top: rTop, tr: rTrade, pk: rPoker, mod: rMod })[tab]();
  }
  // ---------------- ROYALE ----------------
  function rRoyale() {
    const a = A(), p = a.party && a.party.members && a.party.members.length > 1, lead = p && a.party.leader === me();
    bd().innerHTML = '<p>Valódi játékosok <b>ugyanazon a pályán</b> – a hiányzó helyeket botok töltik. Max 8 valódi játékos, a sor 8 mp után indít (egyedül 30 mp után botokkal).</p>' +
      (p ? '<p>👥 Partiban vagy (' + a.party.members.length + ' fő). ' + (lead ? 'Vezetőként az egész partit sorba állítod.' : 'A parti vezetője állít sorba.') + '</p>' : '') +
      (ST.q ? '<p style="color:#facc15">⏳ Sorban: ' + ST.q.n + ' játékos, ' + ST.q.w + ' mp</p><button class="b r" id="mbUnq">Kilépés a sorból</button>' :
        '<button class="b y" id="mbQ0">⚔️ SIMA KÖZÖS MECCS</button> <button class="b g" id="mbQ1">🎖️ RANGSOROLT (RP)</button>') +
      '<h3>🎖️ Divíziók</h3><p>' + (ST.me ? ST.me.divs.map(d => (d[0] === ST.me.div.n ? '<b style="color:#facc15">▶ ' : '<b>') + d[0] + '</b> ' + d[1] + '+').join(' · ') : '') + '</p>' +
      '<p style="opacity:.8">Rangsorolt pont: helyezés (1. hely ≈ +60, utolsó −15) + 10 RP/kiesés valódi játékos ellen. Bot-meccs: kis pont (győzelem +18, max 1×/perc). Meccsben: <b>V nyomva = hangchat</b> (ilyenkor a nézetváltás a V-n szünetel).</p>' +
      (ST.me && ST.me.st ? '<p>Közös meccsek: ' + (ST.me.st.g | 0) + ' · győzelem: ' + (ST.me.st.w | 0) + ' · valódi kiesés: ' + (ST.me.st.k | 0) + '</p>' : '');
    const q0 = $('mbQ0'), q1 = $('mbQ1'), u = $('mbUnq');
    if (q0) q0.onclick = () => ws({ t: 'mb_q', ranked: false }); if (q1) q1.onclick = () => ws({ t: 'mb_q', ranked: true }); if (u) u.onclick = () => { ws({ t: 'mb_unq' }); ST.q = null; render(); };
  }
  // ---------------- BARÁTOK ----------------
  function rFriends() {
    const a = A(), on = {}; (a.online || []).forEach(o => on[o.name] = o);
    const fr = (a.friends && a.friends.length ? a.friends : (a.user && a.user.friends)) || [];
    bd().innerHTML = '<p><input id="mbFa" placeholder="Játékosnév"> <button class="b" id="mbFaB">➕ Barát felvétele</button></p><table><tr><th>Barát</th><th>Állapot</th><th></th></tr>' +
      (fr.length ? fr.map(n => { const o = on[n]; const st = !o ? 'offline' : o.status === 'match' ? 'meccsben' : 'online (' + (o.status === 'menu' ? 'menü' : 'lobby') + ')';
        return '<tr><td><span class="mbDot ' + (o ? o.status === 'match' ? 'mt' : 'on' : '') + '"></span>' + (o ? esc(o.avatar) + ' ' : '') + '<b>' + esc(n) + '</b>' + (o ? ' <small>Lv' + o.level + '</small>' : '') + '</td><td>' + st + '</td><td>' +
          (o ? '<button class="b y" data-inv="' + esc(n) + '">📨 Csatlakozz hozzám</button> <button class="b" data-join="' + esc(n) + '">➡️ Csatlakozom</button> <button class="b" data-tr="' + esc(n) + '">🔄</button> ' : '') +
          '<button class="b r" data-del="' + esc(n) + '">✖</button></td></tr>'; }).join('') : '<tr><td colspan=3>Még nincs barátod.</td></tr>') + '</table>' +
      '<h3>🟢 Most online</h3><p>' + (a.online || []).filter(o => o.name !== me()).map(o => '<span style="margin-right:12px"><span class="mbDot ' + (o.status === 'match' ? 'mt' : 'on') + '"></span>' + esc(o.name) + (fr.includes(o.name) ? '' : ' <button class="b" data-add="' + esc(o.name) + '">➕</button>') + '</span>').join('') + '</p>';
    $('mbFaB').onclick = () => { const v = $('mbFa').value.trim(); if (v) ws({ t: 'friend', name: v }); setTimeout(render, 500); };
    bd().onclick = common;
  }
  function common(e) { { const d = e.target.dataset; if (!d) return;
      if (d.inv) { ws({ t: 'invite', name: d.inv }); toast('📨 Meghívó elküldve: <b>' + esc(d.inv) + '</b>'); }
      if (d.join) ws({ t: 'mb_join', to: d.join });
      if (d.tr) ws({ t: 'mb_tr_req', to: d.tr });
      if (d.add) { ws({ t: 'friend', name: d.add }); setTimeout(render, 500); }
      if (d.del && confirm('Törlöd a barátaid közül: ' + d.del + '?')) { ws({ t: 'friend', name: d.del, remove: true }); setTimeout(render, 500); }
      if (d.k) { ST.topK = d.k; rTop(); }
      if (d.mute) { ws({ t: 'mb_mute', name: d.mute, on: !ST.mutes.includes(d.mute) }); }
      if (d.rep) { const w = prompt('Mi a jelentés oka? (pl. sértő chat, csalás)', 'sértő chat'); if (w != null) ws({ t: 'mb_report', name: d.rep, why: w }); }
      if (d.pkw) ws({ t: 'mb_pk_watch', id: d.pkw });
    }
  }
  // ---------------- RANGLISTÁK ----------------
  const TK = [['wins', '🏆 Győzelem'], ['kills', '💀 Kiesés'], ['cash', '💰 Pénz (szerver)'], ['rang', '🏅 Rang'], ['rp', '🎖️ Rangsorolt'], ['mp', '⚔️ Közös győzelem']];
  const RN = ['Tag', 'VIP', 'VIP+', 'Elit', 'Legenda', 'Mester', 'Örökös'];
  async function rTop() {
    if (!ST.top) { bd().innerHTML = 'Betöltés…'; try { ST.top = await api('/api/mb/top'); } catch (e) { bd().innerHTML = 'Hiba.'; return; } setTimeout(() => ST.top = null, 30000); }
    const L = ST.top[ST.topK] || [];
    bd().innerHTML = '<p>' + TK.map(t => '<button class="b' + (t[0] === ST.topK ? ' y' : '') + '" data-k="' + t[0] + '">' + t[1] + '</button>').join(' ') + '</p><table><tr><th>#</th><th>Játékos</th><th>Érték</th></tr>' +
      (L.length ? L.map((x, i) => '<tr' + (x.name === me() ? ' style="background:#0ea5e933"' : '') + '><td>' + (i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1) + '</td><td>' + esc(x.avatar) + ' ' + esc(x.name) + '</td><td>' +
        (ST.topK === 'cash' ? fmt(x.v) + ' Ft' : ST.topK === 'rang' ? RN[x.v] || x.v : ST.topK === 'rp' ? x.v + ' RP – ' + x.div : x.v) + '</td></tr>').join('') : '<tr><td colspan=3>Még üres.</td></tr>') + '</table><p style="opacity:.7">A pénz-lista a szerverre mentett (felhőmentés) egyenlegből jön; a gyanús ugrásokat a szerver korlátozza.</p>';
    rFriendsClick();
  }
  function rFriendsClick() { bd().onclick = common; }
  // ---------------- MODERÁLÁS ----------------
  function rMod() {
    const a = A();
    bd().innerHTML = '<p>🧼 A chatet (lobby, parti, Teakert) a szerver automatikusan szűri: a csúnya szavak <b>csillagozva</b> jelennek meg. 3 különböző játékos jelentése 1 órán belül → 15 perc automatikus némítás.</p>' +
      (ST.me && ST.me.muteT > Date.now() ? '<p style="color:#f87171">🔇 Némítva vagy még ' + Math.ceil((ST.me.muteT - Date.now()) / 60000) + ' percig.</p>' : '') +
      '<table><tr><th>Online játékos</th><th></th></tr>' + (a.online || []).filter(o => o.name !== me()).map(o => '<tr><td>' + esc(o.avatar) + ' ' + esc(o.name) + (ST.mutes.includes(o.name) ? ' 🔇' : '') + '</td><td><button class="b" data-mute="' + esc(o.name) + '">' + (ST.mutes.includes(o.name) ? '🔊 Némítás feloldása' : '🔇 Némítás') + '</button> <button class="b r" data-rep="' + esc(o.name) + '">🚩 Jelentés</button></td></tr>').join('') + '</table>' +
      '<p>Némítottak: ' + (ST.mutes.length ? ST.mutes.map(n => esc(n) + ' <button class="b" data-mute="' + esc(n) + '">feloldás</button>').join(' ') : '—') + '</p>';
    rFriendsClick();
  }
  // ---------------- KERESKEDÉS ----------------
  function rTrade() {
    const a = A(), t = ST.tr;
    if (!t) {
      bd().innerHTML = '<p>Kereskedés valódi játékossal: Ft, zseton és Royale-tárgyak (skinek). <b>Mindkét félnek el kell fogadnia</b>, a szerver a felhőmentés alapján ellenőrzi az egyenleget és a tárgyakat.</p>' +
        (ST.trReq.length ? '<p>📩 Kérések: ' + ST.trReq.map(n => esc(n) + ' <button class="b g" data-tacc="' + esc(n) + '">Elfogad</button>').join(' ') + '</p>' : '') +
        '<p>Válassz online játékost:</p>' + (a.online || []).filter(o => o.name !== me()).map(o => '<button class="b" data-treq="' + esc(o.name) + '">' + esc(o.avatar) + ' ' + esc(o.name) + '</button>').join(' ');
      cloudUp();
      bd().onclick = e => { const d = e.target.dataset; if (d.treq) { ws({ t: 'mb_tr_req', to: d.treq }); toast('🔄 Kereskedési kérés elküldve.'); } if (d.tacc) { ws({ t: 'mb_tr_acc', from: d.tacc }); ST.trReq = ST.trReq.filter(x => x !== d.tacc); } };
      return;
    }
    const other = t.a === me() ? t.b : t.a, mo = t.off[me()] || {}, oo = t.off[other] || {};
    const offTxt = o => (o.ft ? fmt(o.ft) + ' Ft ' : '') + (o.zs ? fmt(o.zs) + ' zseton ' : '') + (o.items || []).map(i => '🎁' + esc(i)).join(' ') || '<i>semmi</i>';
    bd().innerHTML = '<h3>🔄 Kereskedés: ' + esc(me()) + ' ⇄ ' + esc(other) + '</h3>' +
      '<p>Szerver szerinti egyenleged: <b>' + fmt(t.bal) + ' Ft</b>, <b>' + fmt(t.balz) + ' zseton</b></p>' +
      '<p>Ft: <input id="mbTf" type="number" min=0 value="' + (mo.ft | 0) + '" style="width:110px"> zseton: <input id="mbTz" type="number" min=0 value="' + (mo.zs | 0) + '" style="width:90px"></p>' +
      '<p>Tárgyaid: ' + ((t.mine || []).length ? t.mine.map(i => '<label style="margin-right:8px"><input type="checkbox" class="mbTi" value="' + esc(i) + '"' + ((mo.items || []).includes(i) ? ' checked' : '') + '> ' + esc(i) + '</label>').join('') : '<i>nincs Royale-tárgyad a szerveres mentésben</i>') + '</p>' +
      '<button class="b y" id="mbTo">📤 Ajánlat frissítése</button>' +
      '<p>Te adod: ' + offTxt(mo) + (t.ok[me()] ? ' ✅' : '') + '<br>' + esc(other) + ' adja: ' + offTxt(oo) + (t.ok[other] ? ' ✅' : '') + '</p>' +
      '<button class="b g" id="mbTok">✅ ELFOGADOM</button> <button class="b r" id="mbTx">Mégse</button><p style="opacity:.7">Ha bármelyik fél módosít, az elfogadások törlődnek.</p>';
    $('mbTo').onclick = () => ws({ t: 'mb_tr_off', ft: +$('mbTf').value || 0, zs: +$('mbTz').value || 0, items: [...document.querySelectorAll('.mbTi:checked')].map(c => c.value) });
    $('mbTok').onclick = () => ws({ t: 'mb_tr_ok' }); $('mbTx').onclick = () => ws({ t: 'mb_tr_x' });
  }
  // ---------------- PÓKER ----------------
  const SU = ['♠', '♥', '♦', '♣'], RK = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const card = c => c == null ? '<span class="mbCard bk"></span>' : '<span class="mbCard' + ((c / 13 | 0) === 1 || (c / 13 | 0) === 2 ? ' rd' : '') + '">' + RK[c % 13] + SU[c / 13 | 0] + '</span>';
  function rPoker() {
    const t = ST.pk;
    if (!t) { ws({ t: 'mb_pk_list' });
      bd().innerHTML = '<p>🃏 Texas Hold\'em valódi játékosokkal – a <b>szerver keveri és osztja a lapot</b>, a tétek zsetonban (BR zseton). Vak: 10/20. Beszálló 200–20 000 zseton; felálláskor a maradék visszajár.</p>' +
        (ST.pkList ? ST.pkList.map(x => '<button class="b y" data-pkw="' + x.id + '">' + esc(x.name) + ' (' + x.n + '/' + x.max + ')</button>').join(' ') : 'Betöltés…') + '<p>Zsetonod: <b>' + fmt(window.BR && BR.zs) + '</b></p>';
      cloudUp(); rFriendsClick(); return; }
    const mi = t.seats.findIndex(s => s && s.name === me()), my = mi >= 0 ? t.seats[mi] : null, myTurn = t.turn === mi && mi >= 0;
    const need = my ? Math.max(0, t.toCall - my.bet) : 0, left = t.dl ? Math.max(0, Math.ceil((t.dl - Date.now()) / 1000)) : 0;
    bd().innerHTML = '<p><button class="b" id="mbPkB">◀ Asztalok</button> <b>' + esc(t.name) + '</b> · ' + esc(t.msg) + '</p>' +
      '<div class="mbFelt"><div>' + (t.board.length ? t.board.map(card).join('') : '<i style="opacity:.6">közös lapok</i>') + '</div><div style="font:700 18px system-ui;color:#facc15;margin-top:6px">KASSZA: ' + fmt(t.pot) + '</div></div>' +
      '<div style="text-align:center">' + t.seats.map((s, i) => !s ? '<div class="mbSeat" style="opacity:.35">üres hely</div>' :
        '<div class="mbSeat' + (t.turn === i ? ' turn' : '') + (s.fold && s.inH ? ' fold' : '') + '"><b>' + (t.btn === i ? '🔘 ' : '') + esc(s.name) + '</b><br>💰 ' + fmt(s.stack) + (s.bet ? ' · tét ' + s.bet : '') + '<br>' +
        (s.inH ? (i === mi && ST.hole && !s.cards ? ST.hole.map(card).join('') : s.cards ? s.cards.map(card).join('') : card() + card()) : '') + '<br><small>' + esc(s.last) + (t.turn === i ? ' ⏱️' + left : '') + '</small></div>').join('') + '</div>' +
      (my ? '<p style="text-align:center">' + (myTurn ? '<button class="b r" data-pa="fold">Dob</button> ' + (need ? '<button class="b g" data-pa="call">Megad ' + Math.min(need, my.stack) + '</button>' : '<button class="b g" data-pa="check">Passz</button>') +
        ' <input id="mbPkR" type="number" style="width:90px" value="' + (t.toCall + t.minR) + '"> <button class="b y" data-pa="raise">Emel (összesen)</button>' : '<i>Várj a sorodra…</i>') +
        ' &nbsp; <button class="b" id="mbPkL">🚪 Felállok</button></p>' :
        '<p style="text-align:center">Beszálló: <input id="mbPkBuy" type="number" value="1000" style="width:90px"> <button class="b y" id="mbPkS">🪑 Leülök</button> (zsetonod: ' + fmt(window.BR && BR.zs) + ')</p>');
    $('mbPkB').onclick = () => { ST.pk = null; ws({ t: 'mb_pk_list' }); rPoker(); };
    const s = $('mbPkS'); if (s) s.onclick = () => { const b = +$('mbPkBuy').value | 0; if (!window.BR || BR.zs < b) return toast('Nincs ennyi zsetonod.'); ws({ t: 'mb_pk_sit', id: t.id, buy: b }); };
    const l = $('mbPkL'); if (l) l.onclick = () => ws({ t: 'mb_pk_leave' });
    bd().onclick = e => { const a = e.target.dataset.pa; if (a) ws({ t: 'mb_pk_act', a, v: a === 'raise' ? +$('mbPkR').value : 0 }); };
  }
  setInterval(() => { if (P.classList.contains('on') && tab === 'pk' && ST.pk && ST.pk.turn >= 0 && !document.activeElement.matches('#mbPkR,#mbPkBuy')) rPoker(); }, 1000);

  // ================= KÖZÖS ROYALE (kliens) =================
  const MB = window._mb = { m: null, R: {}, lastBy: null, lastByT: 0, sentDead: false, ST };
  const hud = document.createElement('div'); hud.id = 'mbHud'; document.body.appendChild(hud);
  const talk = document.createElement('div'); talk.id = 'mbTalk'; talk.textContent = '🎙️ Beszélsz… (V)'; document.body.appendChild(talk);
  function tag(text, col) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d');
    x.fillStyle = '#000a'; x.fillRect(0, 8, 256, 48); x.font = 'bold 30px system-ui'; x.textAlign = 'center'; x.fillStyle = col || '#7dd3fc'; x.fillText(text.slice(0, 16), 128, 43);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true })); s.scale.set(3.2, .8, 1); s.position.y = 3.6; s.renderOrder = 999; return s;
  }
  function remote(n, x, z) {
    let e = MB.R[n]; if (e) return e; if (!GG() || !RUN() || !G.en) return null;
    const pl = (MB.m.players || []).find(p => p.name === n) || {};
    try { e = sp('nav', x, z); } catch (er) { return null; }
    e.mp = n; e.hp = 1e9; e.mhp = 1e9; e.sp = 0; e.cd = 99; e.fz = 9; e.b = false; e.buf = [];
    try { e.m.add(tag('🎮 ' + n, pl.color)); } catch (er) {}
    G.en.push(e); MB.R[n] = e; return e;
  }
  function interp(e) {
    const b = e.buf; if (!b.length) return; const rt = performance.now() - 120;
    while (b.length > 2 && b[1].t <= rt) b.shift();
    let p; if (b.length >= 2 && b[0].t <= rt) { const a = b[0], c = b[1], k = Math.min(1, (rt - a.t) / Math.max(1, c.t - a.t)); p = { x: a.x + (c.x - a.x) * k, z: a.z + (c.z - a.z) * k, y: a.y + (c.y - a.y) * k, a: c.a }; } else p = b[0];
    e.x = p.x; e.z = p.z; if (e.m) { e.m.position.set(p.x, p.y || 0, p.z); e.m.rotation.y = p.a; }
  }
  let sendT = 0, shotT = 0, mouseDown = false;
  addEventListener('mousedown', ev => { if (ev.button === 0) mouseDown = true; }, true);
  addEventListener('mouseup', ev => { if (ev.button === 0) mouseDown = false; }, true);
  const fwd = () => { try { const v = new THREE.Vector3(); cam.getWorldDirection(v); return Math.atan2(v.x, v.z); } catch (e) { return 0; } };
  function wrapAll() {
    if (window.__mbW || typeof window.update !== 'function' || typeof window.dmgE !== 'function' || typeof window.end !== 'function') return false; window.__mbW = 1;
    const oU = window.update; window.update = function (dt) {
      const live = MB.m && GG() && G.en; if (live) for (const n in MB.R) { const e = MB.R[n]; if (!e.dead) { e.fz = 9; e.cd = 99; e.hp = 1e9; } }
      const r = oU.apply(this, arguments);
      if (live && RUN()) {
        for (const n in MB.R) { const e = MB.R[n]; if (!e.dead) interp(e); }
        const t = performance.now();
        if (t - sendT > 66) { sendT = t; ws({ t: 'mb_pos', x: +G.x.toFixed(2), y: +((G.y || 0)).toFixed(2), z: +G.z.toFixed(2), a: +fwd().toFixed(3), hp: G.hp | 0 }); }
        if (mouseDown && document.pointerLockElement && t - shotT > 120) { shotT = t; ws({ t: 'mb_shot', x: G.x, z: G.z, a: fwd() }); }
        const al = Object.values(MB.R).filter(e => !e.dead).length;
        hud.style.display = 'block'; hud.textContent = (MB.m.ranked ? '🎖️ RANGSOROLT' : '⚔️ KÖZÖS MECCS') + ' · valódi ellenfél: ' + al + '/' + (MB.m.players.length - 1) + ' · 🎙️ V';
      }
      return r;
    };
    const oD = window.dmgE; window.dmgE = function (e, d, ct) {
      if (!e || !e.mp) return oD.apply(this, arguments);
      if (e.dead) return; e.hp = 1e9; const r = oD.apply(this, arguments); const dealt = Math.max(0, 1e9 - e.hp); e.hp = 1e9; e.dead = false;
      if (dealt > 0) ws({ t: 'mb_hit', to: e.mp, d: Math.round(dealt) }); return r;
    };
    const oE = window.end; window.end = function (win) {
      if (MB.m && !MB.sentDead) { MB.sentDead = true; if (!win) ws({ t: 'mb_dead', by: Date.now() - MB.lastByT < 6000 ? MB.lastBy : null }); else ws({ t: 'mb_leave' }); }
      else if (!MB.m && win != null && window.GAME_MODE === 'royale' && logged() && GG()) { api('/api/mb/solo', { win: !!win, kills: G.kills | 0 }).then(r => { if (r && r.ok) refreshMe(); }).catch(() => {}); }
      const r = oE.apply(this, arguments); setTimeout(cleanup, 500); return r;
    };
    return true;
  }
  const wi = setInterval(() => { if (wrapAll()) clearInterval(wi); }, 500);
  function cleanup() { if (!MB.m || !MB.sentDead) return; MB.m = null; MB.R = {}; hud.style.display = 'none'; }
  function tracer(x, z, a) {
    try { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 1.4, z), new THREE.Vector3(x + Math.sin(a) * 40, 1.4, z + Math.cos(a) * 40)]);
      const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xfde047, transparent: true, opacity: .9 })); scene.add(l); setTimeout(() => { scene.remove(l); g.dispose(); }, 90); } catch (e) {}
  }

  // ================= HANGCHAT (V nyomva; meccsben vagy partiban) =================
  let rec = null, chunks = [], stream = null;
  const canTalk = () => logged() && ((MB.m && RUN()) || (A().party && A().party.members && A().party.members.length > 1 && !document.querySelector('#cs.on,.cs.on')));
  addEventListener('keydown', async ev => {
    if (ev.code !== 'KeyV' || ev.repeat || /INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '')) return;
    if (!(MB.m && RUN())) return; // lobby/Teakert: a meglévő V-funkciók maradnak
    ev.stopImmediatePropagation(); ev.preventDefault();
    if (rec) return;
    try { stream = stream || await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast('🎙️ Nincs mikrofon-engedély.'); return; }
    const mt = ['audio/webm;codecs=opus', 'audio/webm'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
    try { rec = new MediaRecorder(stream, mt ? { mimeType: mt, audioBitsPerSecond: 24000 } : {}); } catch (e) { return; }
    chunks = []; rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => { const b = new Blob(chunks, { type: rec.mimeType || 'audio/webm' }); rec = null; talk.style.display = 'none'; if (b.size < 800) return; const fr = new FileReader(); fr.onload = () => { if (fr.result.length < 370000) ws({ t: 'mb_voice', d: fr.result }); else toast('🎙️ Túl hosszú üzenet.'); }; fr.readAsDataURL(b); };
    rec.start(); talk.style.display = 'block'; setTimeout(() => { if (rec && rec.state === 'recording') rec.stop(); }, 8000);
  }, true);
  addEventListener('keyup', ev => { if (ev.code === 'KeyV' && rec) { ev.stopImmediatePropagation(); if (rec.state === 'recording') rec.stop(); } }, true);
  // partiban a lobbyban: Alt+V
  addEventListener('keydown', async ev => { if (!(ev.code === 'KeyV' && ev.altKey) || ev.repeat || MB.m || !canTalk() || rec) return; ev.preventDefault();
    try { stream = stream || await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return; }
    try { rec = new MediaRecorder(stream); } catch (e) { return; } chunks = []; rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => { const b = new Blob(chunks, { type: rec.mimeType || 'audio/webm' }); rec = null; talk.style.display = 'none'; const fr = new FileReader(); fr.onload = () => fr.result.length < 370000 && ws({ t: 'mb_voice', d: fr.result }); fr.readAsDataURL(b); };
    rec.start(); talk.style.display = 'block'; talk.textContent = '🎙️ Parti-hang… (Alt+V)'; setTimeout(() => { if (rec && rec.state === 'recording') rec.stop(); }, 6000); }, true);

  // ================= WS üzenetek =================
  addEventListener('krws', ev => {
    const m = ev.detail; if (!m || typeof m.t !== 'string') return;
    if (m.t === 'presence' || m.t === 'friends' || m.t === 'party') { if (P.classList.contains('on') && (tab === 'fr' || tab === 'mod' || tab === 'royale')) render(); return; }
    if (!m.t.startsWith('mb_')) return;
    const t = m.t;
    if (t === 'mb_note') toast(esc(m.text));
    else if (t === 'mb_qs') { ST.q = m; if (tab === 'royale' && P.classList.contains('on')) render(); }
    else if (t === 'mb_start') {
      ST.q = null; MB.m = m; MB.R = {}; MB.sentDead = false; P.classList.remove('on');
      toast((m.ranked ? '🎖️ Rangsorolt' : '⚔️ Közös') + ' meccs indul! Valódi játékosok: ' + m.players.map(p => esc(p.name)).join(', '));
      if (!(GG() && RUN())) { window.GAME_MODE = 'royale'; window.GAME_TEAM = 'solo'; try { typeof teamUI === 'function' && teamUI(); } catch (e) {} setTimeout(() => { try { startMatch(); } catch (e) { try { launch(); } catch (e2) {} } }, 600); }
    }
    else if (t === 'mb_pos' && MB.m) { const e = remote(m.n, m.x, m.z); if (e && !e.dead) { e.buf.push({ t: performance.now(), x: m.x, y: m.y, z: m.z, a: m.a }); if (e.buf.length > 20) e.buf.shift(); } }
    else if (t === 'mb_shot' && MB.m && RUN()) tracer(m.x, m.z, m.a);
    else if (t === 'mb_hit' && MB.m && RUN() && GG() && !G.over) { MB.lastBy = m.from; MB.lastByT = Date.now(); try { hurt(Math.min(60, m.d * .5)); } catch (e) {} }
    else if (t === 'mb_dead' && MB.m) {
      const e = MB.R[m.name];
      if (m.name !== me()) { if (e && !e.dead) { e.dead = true; if (m.by === me()) { try { kill(e); } catch (er) { G.left--; } } else G.left--; } try { say('💀 ' + m.name + ' kiesett' + (m.by ? ' (' + m.by + ')' : '') + ' – ' + m.place + '. hely'); } catch (er) {} }
    }
    else if (t === 'mb_win') { if (m.name !== me()) return; try { say('🏆 Te maradtál az utolsó valódi játékos!'); } catch (e) {} }
    else if (t === 'mb_res') toast('🏁 Közös meccs vége: <b>' + m.place + '. hely</b> / ' + m.n + ' · ' + m.kills + ' valódi kiesés' + (m.ranked ? ' (rangsorolt)' : ''));
    else if (t === 'mb_rp') { toast('🎖️ ' + (m.d >= 0 ? '+' : '') + m.d + ' RP → ' + m.rp + ' (' + esc(m.div.n) + ')' + (m.up ? ' ⬆️ FELJUTOTTÁL!' : m.down ? ' ⬇️ visszaestél' : '') + '<br><small>' + esc(m.why) + '</small>'); refreshMe(); }
    else if (t === 'mb_voice') { try { const au = new Audio(m.d); au.play().catch(() => {}); if (MB.m && RUN()) say('🔊 ' + m.n + ' beszél…'); else toast('🔊 ' + esc(m.n) + ' beszél…'); } catch (e) {} }
    else if (t === 'mb_join') toast('➡️ <b>' + esc(m.from) + '</b> csatlakozna a partidhoz!', [['ENGED', () => ws({ t: 'mb_joinok', from: m.from }), '#ffd23f'], ['NEM', null, '#334155']]);
    else if (t === 'mb_mutes') { ST.mutes = m.list; if (tab === 'mod') render(); }
    else if (t === 'mb_tr_req') { if (!ST.trReq.includes(m.from)) ST.trReq.push(m.from); toast('🔄 <b>' + esc(m.from) + '</b> kereskedne veled!', [['NYISD', () => { ws({ t: 'mb_tr_acc', from: m.from }); ST.trReq = ST.trReq.filter(x => x !== m.from); }, '#ffd23f'], ['NEM', null, '#334155']]); }
    else if (t === 'mb_tr') { cloudUp(); ST.tr = m; tab = 'tr'; P.classList.add('on'); if (!document.activeElement.matches('#mbTf,#mbTz')) render(); }
    else if (t === 'mb_tr_end') { ST.tr = null; toast('🔄 Kereskedés vége: ' + esc(m.why)); if (tab === 'tr') render(); }
    else if (t === 'mb_tr_done') {
      try { S.c = Math.max(0, (S.c || 0) + m.dft); saveS(); } catch (e) {}
      try { if (window.BR) { BR.zs = Math.max(0, (BR.zs || 0) + m.dzs); BR.own = BR.own || {}; (m.rem || []).forEach(k => { delete BR.own[k]; if (BR.eq) for (const s in BR.eq) if (BR.eq[s] === k) delete BR.eq[s]; }); (m.add || []).forEach(k => BR.own[k] = 1); saveBR(); } } catch (e) {}
      ST.tr = null; cloudUp(); toast('✅ Sikeres kereskedés ' + esc(m.with) + ' játékossal: ' + (m.dft >= 0 ? '+' : '') + fmt(m.dft) + ' Ft, ' + (m.dzs >= 0 ? '+' : '') + fmt(m.dzs) + ' zseton' + (m.add.length ? ', +' + m.add.length + ' tárgy' : '')); if (tab === 'tr') render();
      try { typeof window.hud === 'function' && window.hud(); } catch (e) {}
    }
    else if (t === 'mb_pk_list') { ST.pkList = m.list; if (tab === 'pk' && !ST.pk && P.classList.contains('on')) rPoker(); }
    else if (t === 'mb_pk') { if (!ST.pk || ST.pk.board.length > m.board.length) { if (!m.board.length && (!ST.pk || ST.pk.phase !== m.phase)) {} } if (m.phase === 'preflop' && (!ST.pk || ST.pk.phase !== 'preflop')) {} ST.pk = m; if (!m.seats.some(s => s && s.name === me() && s.inH)) ST.hole = null; if (tab === 'pk' && P.classList.contains('on') && !document.activeElement.matches('#mbPkR,#mbPkBuy')) rPoker(); }
    else if (t === 'mb_pk_hole') { ST.hole = m.cards; if (tab === 'pk') rPoker(); }
    else if (t === 'mb_pk_buy') { if (window.BR) { BR.zs = Math.max(0, BR.zs - m.zs); saveBR(); cloudUp(); } toast('🪑 Leültél: ' + esc(m.tb) + ' (−' + fmt(m.zs) + ' zseton)'); }
    else if (t === 'mb_pk_cash') { if (window.BR) { BR.zs += m.zs; saveBR(); cloudUp(); } toast('💰 Póker: +' + fmt(m.zs) + ' zseton visszajár (' + esc(m.tb) + ')'); if (ST.pk) ST.pk = null; if (tab === 'pk') rPoker(); }
  });
  console.log('[multiB] betöltve – _mb');
})();
