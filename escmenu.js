// ===== ESC-MENÜ: a játék közben fut tovább (többjátékos stílus), csak nálad jelenik meg =====
(function(){
const css=document.createElement('style');css.textContent=`#escM{position:fixed;inset:0;z-index:9;display:none;align-items:center;justify-content:flex-start;background:linear-gradient(90deg,#000c 0%,#0008 45%,#0000 75%);font-family:Rajdhani,Arial;color:#fff}
#escM.on{display:flex}#escM .pan{width:min(420px,92vw);margin-left:6vw;padding:22px;border-radius:22px;background:#0b1022e6;backdrop-filter:blur(14px);border:1px solid #ffffff22;box-shadow:0 30px 80px #000b;animation:escIn .18s ease-out}
@keyframes escIn{from{transform:translateX(-30px);opacity:0}to{transform:none;opacity:1}}
#escM h2{margin:0 0 4px;font:30px 'Luckiest Guy',Impact;color:#ffd23f}#escM .live{display:inline-block;margin-bottom:12px;padding:3px 10px;border-radius:999px;background:#dc262633;border:1px solid #ef4444;color:#fecaca;font-weight:700;font-size:13px}
#escM .live::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-right:6px;vertical-align:middle;animation:escBl 1s infinite}@keyframes escBl{50%{opacity:.2}}
#escM button.mb{display:block;width:100%;margin:7px 0;padding:13px 16px;border:0;border-radius:12px;text-align:left;font:20px 'Luckiest Guy',Impact;cursor:pointer;background:#1e293b;color:#fff;transition:.12s}
#escM button.mb:hover{background:#334155;transform:translateX(4px)}#escM button.mb.y{background:linear-gradient(90deg,#ffd23f,#f59e0b);color:#1a1200}#escM button.mb.r{background:#7f1d1d}#escM button.mb.r:hover{background:#b91c1c}
#escM .sub{display:none}#escM .sub.on{display:block}#escM label{display:block;margin:10px 0 2px;font-weight:700}#escM input[type=range]{width:100%;accent-color:#ffd23f}
#escM .row{display:flex;justify-content:space-between;font-weight:700;padding:5px 0;border-bottom:1px solid #ffffff14}#escM .help{line-height:1.75;font-size:15px}`;document.head.appendChild(css);
const M=document.createElement('div');M.id='escM';M.innerHTML=`<div class="pan"><h2>⏸ MENÜ</h2><div class="live">A JÁTÉK FUT TOVÁBB</div>
<div class="sub on" data-p="main"><button class="mb y" data-a="resume">▶ FOLYTATÁS</button><button class="mb" data-a="set">⚙️ BEÁLLÍTÁSOK</button><button class="mb" data-a="help">❓ IRÁNYÍTÁS</button><button class="mb" data-a="info">📊 MECCS-INFÓ</button><button class="mb r" data-a="quit">🚪 KILÉPÉS A LOBBYBA</button></div>
<div class="sub" data-p="set"><label>🎵 Zene: <span id="esV1"></span></label><input type="range" min="0" max="100" data-k="music"><label>🔊 Effektek: <span id="esV2"></span></label><input type="range" min="0" max="100" data-k="sfx"><label>🗣️ Beszéd: <span id="esV3"></span></label><input type="range" min="0" max="100" data-k="vv">
 <label>🖱️ Egér-érzékenység: <span id="esV4"></span></label><input type="range" min="20" max="250" data-k="sens"><label>🎥 Látótér (FOV): <span id="esV5"></span></label><input type="range" min="60" max="110" data-k="fov"><button class="mb" data-a="back">◀ VISSZA</button></div>
<div class="sub" data-p="help"><div class="help">🖱️ Egér: nézelődés · bal klikk: lövés<br>⌨️ WASD: mozgás · Shift: sprint · Space: ugrás / kiugrás<br>🔫 1–5 / görgő: fegyver · R: újratöltés · Q: ulti<br>🏗️ B: építés · 1/2/3: fal/rámpa/padló · E / klikk: lerakás · G: ajtó<br>❤️ Z: medkit · 🍺 X: sör · H: tánc · K: fotó · M: térkép<br>📍 középső egérgomb: jelölés · Esc / P: ez a menü<br>🛠️ Szigetvédelem: F – gyűjtés, műhely, tábla<br>♻️ Flakon: E nyomva 3 mp (a földön állva)</div><button class="mb" data-a="back">◀ VISSZA</button></div>
<div class="sub" data-p="info"><div id="esInfo"></div><button class="mb" data-a="back">◀ VISSZA</button></div>
<div class="sub" data-p="quit"><div style="font-weight:700;margin:6px 0 10px">Biztosan kilépsz? A meccs eredménye elveszik.</div><button class="mb r" data-a="quitYes">🚪 IGEN, KILÉPEK</button><button class="mb" data-a="back">◀ MÉGSE</button></div></div>`;
document.body.appendChild(M);
const show=p=>M.querySelectorAll('.sub').forEach(s=>s.classList.toggle('on',s.dataset.p===p));
const inMatch=()=>G&&run&&$('hud').classList.contains('on')&&!G.over;
let open=false,selfUnlock=false;
function openM(){if(!G||G.over||!$('hud').classList.contains('on'))return;open=true;M.classList.add('on');show('main');if(document.pointerLockElement){selfUnlock=true;document.exitPointerLock()}}
function closeM(){open=false;M.classList.remove('on')}
window.escMenu={open:openM,close:closeM,get isOpen(){return open}};
function syncSet(){const S2=window.SET||{};M.querySelectorAll('input[type=range]').forEach((r,i)=>{const k=r.dataset.k;const v=k==='sens'?Math.round((S2.sens||1)*100):k==='fov'?(S2.fov||75):Math.round((S2[k]??.8)*100);r.value=v;lbl(r)})}
function lbl(r){const k=r.dataset.k,el={music:'esV1',sfx:'esV2',vv:'esV3',sens:'esV4',fov:'esV5'}[k];$(el).textContent=k==='sens'?(r.value/100).toFixed(1)+'x':k==='fov'?r.value+'°':r.value+'%'}
M.querySelectorAll('input[type=range]').forEach(r=>r.oninput=()=>{const k=r.dataset.k;if(k==='sens')SET.sens=r.value/100;else if(k==='fov')SET.fov=+r.value;else SET[k]=r.value/100;lbl(r);try{saveSet();applySet()}catch(e){}});
M.addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;try{sfx('click')}catch(x){}
 if(a==='resume')closeM();else if(a==='set'){syncSet();show('set')}else if(a==='help')show('help');else if(a==='back')show('main');else if(a==='quit')show('quit');
 else if(a==='info'){const g=G;const t=Math.round(g.t);$('esInfo').innerHTML='<div class="row"><span>⏱️ Idő</span><span>'+Math.floor(t/60)+':'+String(t%60).padStart(2,'0')+'</span></div><div class="row"><span>💀 Eliminációk</span><span>'+g.kills+'</span></div><div class="row"><span>❤️ Életerő</span><span>'+Math.round(g.hp)+' / '+Math.round(g.mhp)+'</span></div><div class="row"><span>🛡️ Pajzs</span><span>'+Math.round(g.sh)+'</span></div><div class="row"><span>🎒 Medkit · Sör</span><span>'+g.inv.hp+' · '+g.inv.beer+'</span></div><div class="row"><span>🎮 Mód</span><span>'+({royale:'Battle Royale',stw:'Mentsd meg a szigetet',flakon:'Flakonvadászat'})[window.GAME_MODE||'royale']+'</span></div>';show('info')}
 else if(a==='quitYes'){closeM();try{quitMatch()}catch(x){}}});
// Esc: billentyű (ha nincs egérzárolás) + egérzárolás feloldása (a böngésző ilyenkor elnyeli az Esc-et)
addEventListener('keydown',e=>{const k=e.key;if(k==='Escape'){if(open){closeM();e.stopImmediatePropagation();return}if(inMatch()&&!GUI.on&&!(window.CS&&CS.on)){openM();e.stopImmediatePropagation()}}},true);
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement){if(open)closeM();return}if(selfUnlock){selfUnlock=false;return}
 // a zárolást a felhasználó oldotta fel (Esc) játék közben → menü
 const gc=document.getElementById('gChat'),ap=document.getElementById('addP'),iv=document.getElementById('invP');if((iv&&iv.classList.contains('on'))||(gc&&gc.classList.contains('on'))||(ap&&ap.classList.contains('on')))return;if(inMatch()&&!GUI.on&&!(window.CS&&CS.on)&&G.fp)openM()});
// a régi, megállító szünetmenü helyett (P) is ez nyílik
window.pauseGui=function(){if(open)closeM();else openM()};
// meccs végén / kilépéskor zárjuk
['end','quitMatch','launch'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(){closeM();return o.apply(this,arguments)}});
// a játék saját guiOpen/term. menüi elé ne kerüljön
})();
