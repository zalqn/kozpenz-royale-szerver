// extra140j.js – ⚙️ KÉNYELEM: HUD méret/átlátszóság, HUD-szerkesztő, feliratok, nagy kontraszt, érzékenység/FOV,
// auto-felvétel, gyorsüzenet-kerék (Tab), értesítés-központ, billentyű-súgó (? / End), ne zavarj mód. Mentés: k3x14j
(function(){
const LS='k3x14j';
const D={hs:1,ho:1,pos:{},cap:true,hc:false,fs:1,ap:true,dnd:false};
let C;try{C=Object.assign({},D,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){C=Object.assign({},D)}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(C))}catch(e){}};
const $i=id=>document.getElementById(id);
const inMatch=()=>{try{return !!(window.G&&run&&$i('hud')&&$i('hud').classList.contains('on'))}catch(e){return false}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
window._x14j={C};

// ---------- CSS ----------
const st=document.createElement('style');st.textContent=`
#x14jBtn{background:linear-gradient(135deg,#1e293b,#0f172a);color:#e2e8f0;border:1px solid #64748b;border-radius:10px;padding:7px 10px;font:700 12px Rajdhani,Arial;cursor:pointer;box-shadow:0 4px 14px #0006}
#x14jBtn:hover{border-color:#38bdf8;color:#fff}
.x14jP{position:fixed;inset:0;z-index:60;background:#020617b0;display:flex;align-items:center;justify-content:center;font:600 14px Rajdhani,Arial;color:#e2e8f0}
.x14jP>div{background:linear-gradient(160deg,#0f172a,#1e1b4b);border:1px solid #475569;border-radius:16px;padding:18px 20px;width:min(560px,92vw);max-height:86vh;overflow:auto;box-shadow:0 20px 60px #000a}
.x14jP h2{margin:0 0 10px;font-size:22px;color:#fde68a;letter-spacing:1px}
.x14jP h3{margin:12px 0 4px;color:#7dd3fc;font-size:15px}
.x14jP label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:5px 0}
.x14jP input[type=range]{flex:1;max-width:240px}
.x14jP button{background:#334155;color:#fff;border:1px solid #64748b;border-radius:8px;padding:6px 10px;margin:3px;font:700 13px Rajdhani,Arial;cursor:pointer}
.x14jP button.on{background:#0e7490;border-color:#22d3ee}
.x14jP table{width:100%;border-collapse:collapse;font-size:13px}.x14jP td{padding:3px 6px;border-bottom:1px solid #334155}
.x14jP kbd{background:#1e293b;border:1px solid #64748b;border-radius:5px;padding:1px 6px;font-weight:800;color:#fde68a}
#x14jCap{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:9;display:flex;flex-direction:column;align-items:center;gap:3px;pointer-events:none}
#x14jCap div{background:#000c;color:#fff;font:700 15px Rajdhani,Arial;padding:3px 10px;border-radius:6px;transition:opacity .5s}
#x14jWheel{position:fixed;left:50%;top:50%;width:340px;height:340px;margin:-170px;z-index:40;border-radius:50%;background:radial-gradient(#0f172aee 30%,#1e293bdd 70%);border:2px solid #38bdf8;display:none;font:700 13px Rajdhani,Arial;color:#fff}
#x14jWheel div{position:absolute;width:110px;margin-left:-55px;text-align:center;padding:5px;border-radius:8px;background:#334155;cursor:pointer}
#x14jWheel div.sel,#x14jWheel div:hover{background:#0e7490}
body.x14jedit #hud .pan,body.x14jedit #mm{outline:2px dashed #22d3ee!important;cursor:move!important;pointer-events:auto!important}
#x14jEditBar{position:fixed;top:10px;left:50%;transform:translateX(-50%);z-index:70;background:#0f172a;border:1px solid #22d3ee;border-radius:10px;padding:6px 12px;color:#fff;font:700 14px Rajdhani,Arial}
#x14jEditBar button{margin-left:8px;background:#0e7490;color:#fff;border:0;border-radius:6px;padding:4px 10px;cursor:pointer}
body.x14jhc #hud .pan{background:#000!important;border:2px solid #fff!important;color:#fff!important;text-shadow:0 0 2px #000}
body.x14jhc #hud .bar{background:#fff3!important;border:1px solid #fff}
body.x14jhc #ann,body.x14jhc #hint{color:#ff0!important;text-shadow:0 0 4px #000,0 0 2px #000}
body.x14jhc canvas{filter:contrast(1.25) saturate(1.2)}
body.x14jdnd.x14jm [id*="oast"],body.x14jdnd.x14jm [class*="oast"]{display:none!important}
`;document.head.appendChild(st);

// ---------- alkalmazás ----------
const EDIT=()=>{const a=[...document.querySelectorAll('#hud .row > .pan')];const m=$i('mm');if(m)a.push(m);return a};
function apply(){
 document.body.classList.toggle('x14jhc',!!C.hc);document.body.classList.toggle('x14jdnd',!!C.dnd);
 EDIT().forEach((el,i)=>{el.style.zoom=C.hs;el.style.opacity=C.ho;const p=C.pos[i];el.style.translate=p?(p[0]+'px '+p[1]+'px'):''});
 ['ann','hint','gChat'].forEach(id=>{const e=$i(id);if(e)e.style.zoom=C.fs});
}
setInterval(()=>{document.body.classList.toggle('x14jm',inMatch())},500);

// ---------- 8. értesítés-központ + 10. ne zavarj ----------
const HIST=[];let lastTxt='';
function logN(src,t){t=String(t||'').replace(/<[^>]*>/g,'').trim();if(!t||t===lastTxt)return;lastTxt=t;HIST.unshift({t,src,at:new Date().toLocaleTimeString('hu-HU')});if(HIST.length>150)HIST.pop();try{sessionStorage.setItem(LS+'h',JSON.stringify(HIST.slice(0,60)))}catch(e){}}
try{HIST.push(...JSON.parse(sessionStorage.getItem(LS+'h')||'[]'))}catch(e){}
if(typeof window.say==='function'){const o=window.say;window.say=function(t){try{logN('📢',t)}catch(e){}return o.apply(this,arguments)}}
const watched=new WeakSet();
function watch(el){if(watched.has(el))return;watched.add(el);new MutationObserver(()=>{if(el.offsetParent!==null||getComputedStyle(el).display!=='none')logN('🔔',el.textContent)}).observe(el,{childList:true,characterData:true,subtree:true})}
function scanToasts(){document.querySelectorAll('[id*="oast"],[class*="oast"]').forEach(watch)}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;const s=(n.id||'')+' '+(n.className||'');if(/oast/i.test(s)){watch(n);logN('🔔',n.textContent)}}}).observe(document.body,{childList:true});
setTimeout(scanToasts,1500);setInterval(scanToasts,8000);
function openNotif(){panel('<h2>🔔 ÉRTESÍTÉS-KÖZPONT</h2><div style="margin-bottom:8px;color:#94a3b8">Az összes felugró üzenet és bemondás ('+HIST.length+')</div>'+
 (HIST.length?'<table>'+HIST.map(h=>'<tr><td style="color:#94a3b8;white-space:nowrap">'+h.at+'</td><td>'+h.src+'</td><td>'+esc(h.t)+'</td></tr>').join('')+'</table>':'<i>Még nincs üzenet.</i>')+
 '<div style="margin-top:10px"><button onclick="_x14j.clr()">🗑️ Törlés</button><button onclick="_x14j.open()">◀ Vissza</button></div>')}
window._x14j.clr=()=>{HIST.length=0;try{sessionStorage.removeItem(LS+'h')}catch(e){}openNotif()};

// ---------- 3. feliratok ----------
const CAPN={coin:'🪙 érme',buy:'🛒 vásárlás',ability:'✨ képesség',shot:'🔫 lövés',shoot:'🔫 lövés',boom:'💥 robbanás',expl:'💥 robbanás',hit:'🎯 találat',hurt:'🩸 sebződés',kill:'☠️ kiesés',reload:'🔄 újratöltés',jump:'⤴️ ugrás',land:'⤵️ landolás',storm:'🌀 vihar',step:'👣 lépések',heal:'💚 gyógyulás',shield:'🛡️ pajzs'};
const capLast={};
function caption(t){if(!C.cap||!inMatch())return;const now=performance.now();if(capLast[t]&&now-capLast[t]<900)return;capLast[t]=now;
 let b=$i('x14jCap');if(!b){b=document.createElement('div');b.id='x14jCap';document.body.appendChild(b)}
 const d=document.createElement('div');d.textContent='['+t+']';b.appendChild(d);while(b.children.length>3)b.firstChild.remove();setTimeout(()=>{d.style.opacity=0;setTimeout(()=>d.remove(),500)},1600)}
if(typeof window.sfx==='function'){const o=window.sfx;window.sfx=function(n){try{if(typeof n==='string')caption(CAPN[n]||('🔊 '+n))}catch(e){}return o.apply(this,arguments)}}
if(typeof window.hurt==='function'){const o=window.hurt;window.hurt=function(){const h0=window.G&&G.hp;const r=o.apply(this,arguments);try{if(window.G&&G.hp<h0)caption('🩸 sebződés')}catch(e){}return r}}
window._x14j.caption=caption;

// ---------- 6. auto-felvétel ----------
// BE: 6 m-es mágnes húzza magához a tárgyakat (a játék alapból 2 m-en belül vesz fel). KI: csak E gombbal 3 m-en belül.
let eGrab=false;
setInterval(()=>{try{if(!C.ap||!inMatch()||!G.pk)return;G.pk.forEach(p=>{if(p.l<=0)return;const d=Math.hypot(G.x-p.x,G.z-p.z);if(d<6&&d>1){p.x+=(G.x-p.x)*.25;p.z+=(G.z-p.z)*.25}})}catch(e){}},100);
if(typeof window.pickup==='function'){const o=window.pickup;window.pickup=function(p){if(!C.ap&&!eGrab&&inMatch()&&p){if(p.l<=0)p.l=p._x14l||20;return}return o.apply(this,arguments)}}
setInterval(()=>{try{if(inMatch()&&G.pk)G.pk.forEach(p=>{if(p.l>0)p._x14l=p.l})}catch(e){}},1000);
addEventListener('keydown',e=>{if(C.ap||!inMatch()||e.key.toLowerCase()!=='e'||(e.target&&e.target.tagName==='INPUT'))return;
 try{let n=0;eGrab=true;G.pk.forEach(p=>{if(p.l>0&&Math.hypot(p.x-G.x,p.z-G.z)<3.2){p.l=0;pickup(p);n++}});eGrab=false;if(n)caption('🎒 felvéve: '+n)}catch(er){eGrab=false}});

// ---------- 7. gyorsüzenet-kerék (Tab nyomva) ----------
const QM=['Kövessetek! 👉','Segítség kell! 🆘','Ellenfél itt! 🎯','Van nálam pajzs 🛡️','Gyógyulok 💚','Szép volt! 👏','Vigyázz, vihar! 🌀','gg 🤝'];
let wsel=-1;
function wheel(){let w=$i('x14jWheel');if(w)return w;w=document.createElement('div');w.id='x14jWheel';
 QM.forEach((m,i)=>{const a=i/QM.length*Math.PI*2-Math.PI/2,d=document.createElement('div');d.textContent=m;d.style.left=(170+Math.cos(a)*118)+'px';d.style.top=(156+Math.sin(a)*118)+'px';d.onmousedown=ev=>{ev.preventDefault();sendQ(i);hideW()};w.appendChild(d)});
 const c=document.createElement('span');c.textContent='💬';c.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:30px';w.appendChild(c);document.body.appendChild(w);return w}
function sendQ(i){const m=QM[i];if(m==null)return;
 if(inMatch()&&window.gameChat){let n='Te';try{n=(window.ME&&ME.name)||(S&&S.u&&S.u.name)||'Te'}catch(e){}gameChat(n+': '+m)}
 else{const inp=document.querySelector('#lbIn input');if(inp){inp.value=m;inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));const b=document.querySelector('#lbIn button');if(inp.value&&b)b.click()}}
 logN('💬',m)}
function showW(){const w=wheel();w.style.display='block';wsel=-1;[...w.children].forEach(c=>c.classList&&c.classList.remove('sel'))}
function hideW(){const w=$i('x14jWheel');if(w)w.style.display='none'}
let zDown=false;
addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 if(e.key==='Tab'){if(!inMatch())return;e.preventDefault();if(zDown)return;zDown=true;showW();if(document.pointerLockElement)document.exitPointerLock()}
 else if(zDown&&/^[1-8]$/.test(e.key)){e.preventDefault();e.stopImmediatePropagation();sendQ(+e.key-1);hideW();zDown=false}},true);
addEventListener('keyup',e=>{if(e.key==='Tab'){zDown=false;setTimeout(hideW,120)}});

// ---------- 2. HUD-szerkesztő ----------
function editHUD(){closeP();const hud=$i('hud');if(!inMatch()&&hud){hud._x14wasOff=!hud.classList.contains('on');hud.classList.add('on')}
 document.body.classList.add('x14jedit');const bar=document.createElement('div');bar.id='x14jEditBar';bar.innerHTML='✋ Húzd az elemeket a helyükre <button id="x14jOk">KÉSZ</button><button id="x14jRs">Alaphelyzet</button>';document.body.appendChild(bar);
 const els=EDIT();let drag=null;
 const dn=e=>{const i=els.indexOf(e.currentTarget);if(i<0)return;e.preventDefault();e.stopPropagation();const p=C.pos[i]||[0,0];drag={i,sx:e.clientX,sy:e.clientY,ox:p[0],oy:p[1]}};
 const mv=e=>{if(!drag)return;C.pos[drag.i]=[Math.round(drag.ox+(e.clientX-drag.sx)/C.hs),Math.round(drag.oy+(e.clientY-drag.sy)/C.hs)];apply()};
 const up=()=>{if(drag){drag=null;save()}};
 els.forEach(el=>el.addEventListener('mousedown',dn,true));addEventListener('mousemove',mv);addEventListener('mouseup',up);
 const done=()=>{els.forEach(el=>el.removeEventListener('mousedown',dn,true));removeEventListener('mousemove',mv);removeEventListener('mouseup',up);document.body.classList.remove('x14jedit');bar.remove();if(hud&&hud._x14wasOff)hud.classList.remove('on');save();openMain()};
 $i('x14jOk').onclick=done;$i('x14jRs').onclick=()=>{C.pos={};apply();save()}}

// ---------- 9. billentyű-súgó ----------
const KEYS=[['Mozgás','W A S D · Space ugrás · J csúszás · dupla W/A/S/D dash · , . kihajolás'],['Fegyverek','1–9 fegyver, görgő váltás · középső egér ping'],['Interakció','E (felvétel, ajtó, jármű, ásás, urna, közelharc)'],['Kütyük','H gránát · N ugrópárna · Y gyógyzóna · Ö légicsapás · K/L kutya · B kutya-gyorsmenü'],['Varázslat / ital','É elsüt · Á vált · Ő ital · Ü snowboard · Ó vape'],['Kamera','O fotómód · U telefon'],['Chat','T chat · / parancs · V push-to-talk (Teakert) · Tab nyomva gyorsüzenet-kerék (1–8)'],['Meccs vége','Enter gyors újrakezdés'],['Panelek','F8 haladás · End ⚙️ kényelem · ? ez a súgó'],['Megjegyzés','A billentyűk a billentyű-átállításban módosíthatók – ez az alapkiosztás.']];
function openKeys(){panel('<h2>⌨️ BILLENTYŰPARANCSOK</h2><table>'+KEYS.map(k=>'<tr><td style="color:#7dd3fc;white-space:nowrap">'+k[0]+'</td><td>'+k[1].replace(/(^|[\s·(])([A-ZÁÉÍÓÖŐÚÜŰ0-9?\/,.–]{1,4}|Space|Enter|End|F8)(?=[\s·)]|$)/g,'$1<kbd>$2</kbd>')+'</td></tr>').join('')+'</table><div style="margin-top:10px"><button onclick="_x14j.open()">◀ Vissza</button><button onclick="_x14j.close()">Bezár</button></div>')}

// ---------- panel ----------
function closeP(){const p=$i('x14jPanel');if(p)p.remove()}
function panel(html){closeP();const p=document.createElement('div');p.id='x14jPanel';p.className='x14jP';p.innerHTML='<div>'+html+'</div>';p.onclick=e=>{if(e.target===p)closeP()};document.body.appendChild(p);if(document.pointerLockElement)document.exitPointerLock()}
function sl(lbl,key,min,max,step,fmt){return '<label>'+lbl+' <b id="x14v_'+key+'">'+fmt(C[key])+'</b><input type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+C[key]+'" oninput="_x14j.set(\''+key+'\',+this.value)"></label>'}
const FMT={hs:v=>Math.round(v*100)+'%',ho:v=>Math.round(v*100)+'%',fs:v=>Math.round(v*100)+'%'};
window._x14j.set=(k,v)=>{C[k]=v;const b=$i('x14v_'+k);if(b)b.textContent=FMT[k](v);apply();save()};
window._x14j.tg=k=>{C[k]=!C[k];apply();save();openMain()};
window._x14j.ss=(k,v)=>{try{SET[k]=v;saveSet();applySet();const b=$i('x14s_'+k);if(b)b.textContent=k==='fov'?v+'°':v.toFixed(2)+'x'}catch(e){}};
const tb=(k,l)=>'<button class="'+(C[k]?'on':'')+'" onclick="_x14j.tg(\''+k+'\')">'+l+': '+(C[k]?'BE':'KI')+'</button>';
function openMain(){const hasSet=typeof SET!=='undefined';
 panel('<h2>⚙️ KÉNYELEM & HUD</h2>'+
 '<h3>🖥️ HUD</h3>'+sl('Méret','hs',.6,1.6,.05,FMT.hs)+sl('Átlátszóság','ho',.2,1,.05,FMT.ho)+'<button onclick="_x14j.edit()">✋ HUD-szerkesztő (húzás)</button>'+
 '<h3>♿ Akadálymentesség</h3>'+sl('Betűméret','fs',.8,1.8,.05,FMT.fs)+tb('hc','🔲 Nagy kontraszt')+tb('cap','💬 Hang-feliratok')+
 (hasSet?'<h3>🖱️ Irányítás</h3><label>Egér-érzékenység <b id="x14s_sens">'+SET.sens.toFixed(2)+'x</b><input type="range" min=".2" max="2.5" step=".05" value="'+SET.sens+'" oninput="_x14j.ss(\'sens\',+this.value)"></label><label>Látótér (FOV) <b id="x14s_fov">'+SET.fov+'°</b><input type="range" min="60" max="110" step="1" value="'+SET.fov+'" oninput="_x14j.ss(\'fov\',+this.value)"></label>':'')+
 '<h3>🎮 Játék</h3>'+tb('ap','🧲 Auto-felvétel')+tb('dnd','🔕 Ne zavarj (meccsben)')+
 '<div style="color:#94a3b8;font-size:12px">Auto-felvétel KI: tárgyak csak E-vel. Ne zavarj: meccsben elrejti a felugró toastokat (az értesítés-központ megőrzi őket).</div>'+
 '<h3>🧰 Eszközök</h3><button onclick="_x14j.notif()">🔔 Értesítés-központ ('+HIST.length+')</button><button onclick="_x14j.keys()">⌨️ Billentyű-súgó</button><button onclick="_x14j.wheel()">💬 Gyorsüzenetek</button>'+
 '<div style="margin-top:12px;text-align:right"><button onclick="_x14j.close()">Bezár</button></div>')}
window._x14j.open=openMain;window._x14j.close=closeP;window._x14j.edit=editHUD;window._x14j.notif=openNotif;window._x14j.keys=openKeys;
window._x14j.wheel=()=>panel('<h2>💬 GYORSÜZENETEK</h2><div style="color:#94a3b8">Meccsben: tartsd nyomva a <kbd>Tab</kbd>-ot, és kattints / nyomj 1–8-at.</div>'+QM.map((m,i)=>'<button onclick="_x14j.q('+i+')">'+(i+1)+'. '+esc(m)+'</button>').join('')+'<div><button onclick="_x14j.open()">◀ Vissza</button></div>');
window._x14j.q=i=>{sendQ(i);closeP()};

// ---------- billentyűk: End, ? ----------
addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 if(e.key==='End'){e.preventDefault();$i('x14jPanel')?closeP():openMain()}
 else if(e.key==='?'){e.preventDefault();$i('x14jPanel')?closeP():openKeys()}
 else if(e.key==='Escape'&&$i('x14jPanel'))closeP()});

// ---------- lobby gomb ----------
function btn(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!$i('x14jBtn')){const b=document.createElement('button');b.id='x14jBtn';b.textContent='⚙️ KÉNYELEM';b.title='Kényelem & HUD (End)';b.onclick=openMain;h.appendChild(b)}}
setInterval(()=>{btn();const b=$i('x14jBtn');if(b)b.style.display=inMatch()?'none':''},700);
setTimeout(()=>{btn();apply()},800);
// HUD újraépülés esetén újraalkalmazás
setInterval(()=>{if(inMatch())apply()},3000);
})();
