// extra160.js – 🏛️ KÖZHIVATAL: lobby-minijátékok (pecsételő, pályázatíró, közbeszerzés-licit, átadó-memória, napi hivatali feladatok, statisztika)
// Meccsben: 💼 számvevőszéki aktatáskák, 🎀 szalagátvágás, 🇪🇺 támogatási zóna, 🖃 hivatalos pecsét (PageDown), HUD-chip, 🧾 meccsvégi elszámolás.
// Lobby gomb: x14hub „🏛️ KÖZHIVATAL” (PageUp). Mentés: k3x160st (statisztika/rekordok), k3x160day (napi feladatok). Csak játékbeli pénz. Debug: _x160
(function(){
'use strict';
const $=id=>document.getElementById(id);
const LS={g:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU');
const inMatch=()=>typeof G!=='undefined'&&G&&!G.over&&G.phase==='play';
const hasS=()=>typeof S!=='undefined'&&S;
const pay=d=>{if(!hasS())return;S.c=(S.c||0)+d;try{save()}catch(e){}};
const snd=n=>{try{sfx(n)}catch(e){}};
const R=Math.random,rnd=(a,b)=>a+R()*(b-a),pk=a=>a[Math.floor(R()*a.length)];
function toast(t){try{if(inMatch()&&typeof say==='function'){say(t);return}}catch(e){}let el=$('x160T');if(!el){el=document.createElement('div');el.id='x160T';document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2600)}
const ST=LS.g('k3x160st',{stamp:0,buzz:0,mem:0,bidW:0,bidL:0,bag:0,rib:0,zone:0,seal:0,earn:0,matches:0});
const saveST=()=>LS.s('k3x160st',ST);
const X={ST,objs:[],gref:null,m:null};window._x160=X;

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
#x160T{position:fixed;left:50%;top:80px;transform:translateX(-50%);z-index:100001;background:#0b1220ee;color:#fff;font:700 14px system-ui;padding:9px 16px;border-radius:12px;border:1px solid #38bdf888;opacity:0;transition:opacity .25s;pointer-events:none}#x160T.on{opacity:1}
#x160Btn{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-width:170px;padding:8px 12px;border-radius:12px;font:800 14px Rajdhani,Arial,sans-serif;letter-spacing:.3px;color:#fff;cursor:pointer;background:linear-gradient(135deg,#0c4a6e,#1d4ed8 60%,#b45309);border:1px solid #fbbf24;box-shadow:0 4px 14px #0008,inset 0 1px 0 #ffffff22;transition:transform .12s,filter .12s;text-shadow:0 1px 2px #0009}
#x160Btn:hover{transform:translateY(-1px);filter:brightness(1.15)}
#x160M{position:fixed;inset:0;z-index:99990;background:#000b;display:none;align-items:center;justify-content:center;font:14px system-ui;color:#e5e7eb}#x160M.on{display:flex}
#x160M .bx{width:min(900px,95vw);max-height:90vh;overflow:auto;background:linear-gradient(160deg,#0b1730,#172554 60%,#1e1b4b);border:1px solid #fbbf2455;border-radius:16px;padding:16px 18px;box-shadow:0 20px 60px #000c}
#x160M h2{margin:0 0 10px;font:800 21px system-ui;color:#fbbf24;display:flex;justify-content:space-between;align-items:center}
#x160M .tb{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
#x160M .tb button,#x160M .b{background:#1e3a8a;color:#fff;border:1px solid #60a5fa88;border-radius:9px;padding:6px 11px;cursor:pointer;font:700 13px system-ui}
#x160M button{width:auto!important;min-width:0!important;flex:0 0 auto!important;height:auto!important;margin:0!important;box-shadow:none!important;text-transform:none!important;font:700 13px system-ui!important;background:#1e3a8a!important;color:#fff!important;border:1px solid #60a5fa88!important;border-radius:9px!important;padding:6px 11px!important;transform:none!important}
#x160M .tb button.on{background:#fbbf24!important;color:#111!important}#x160M .b.g{background:#15803d!important;border-color:#4ade80!important}#x160M #x160X{background:#7f1d1d!important}
#x160M .tb button.on{background:#fbbf24;color:#111}#x160M .b:disabled{opacity:.45;cursor:default}#x160M .b.g{background:#15803d;border-color:#4ade80}
#x160M .card{background:#ffffff0d;border:1px solid #ffffff1a;border-radius:12px;padding:10px 12px;margin:6px 0}
#x160M .ar{position:relative;height:330px;border-radius:12px;background:repeating-linear-gradient(0deg,#f5f0e1,#f5f0e1 22px,#e7dfc8 23px);overflow:hidden;border:2px solid #92400e;cursor:crosshair}
#x160M .doc{position:absolute;width:92px;height:62px;border-radius:5px;font:800 11px system-ui;display:flex;align-items:center;justify-content:center;text-align:center;box-shadow:0 3px 8px #0005;user-select:none;transition:transform .1s}
#x160M .doc.ok{background:#dcfce7;color:#14532d;border:2px solid #16a34a}#x160M .doc.no{background:#fee2e2;color:#7f1d1d;border:2px solid #dc2626}
#x160M .doc.st{transform:rotate(-8deg) scale(.9);opacity:.6}#x160M .doc.st:after{content:'✔ PECSÉT';position:absolute;color:#b91c1c;font:900 15px serif;border:2px solid #b91c1c;padding:0 4px;transform:rotate(-18deg)}
#x160M .wd{display:inline-block;margin:4px;padding:8px 12px;border-radius:9px;background:#1e293b;border:1px solid #475569;cursor:pointer;font:700 14px system-ui}#x160M .wd.sel{background:#1d4ed8;border-color:#93c5fd}#x160M .wd.good{background:#15803d}#x160M .wd.bad{background:#991b1b}
#x160M .mg{display:grid;grid-template-columns:repeat(4,72px);gap:8px;justify-content:center}#x160M .mc{height:72px;border-radius:10px;background:linear-gradient(135deg,#1d4ed8,#0c4a6e);border:2px solid #fbbf24;font-size:34px;display:flex;align-items:center;justify-content:center;cursor:pointer}#x160M .mc.f{background:#fef3c7}#x160M .mc.d{background:#bbf7d0;cursor:default}
#x160M .bar{height:8px;border-radius:5px;background:#ffffff22;overflow:hidden}#x160M .bar u{display:block;height:100%;background:linear-gradient(90deg,#fbbf24,#22c55e);text-decoration:none}
#x160M input[type=range]{width:100%}
#x160H{position:fixed;left:50%;top:128px;transform:translateX(-50%);z-index:30;pointer-events:none;display:none;gap:8px;font:800 13px system-ui;color:#fff}
#x160H span{background:linear-gradient(135deg,#0c4a6ecc,#1d4ed8cc);border:1px solid #fbbf24aa;border-radius:10px;padding:5px 10px;text-shadow:0 1px 2px #000}
#x160I{position:fixed;inset:0;z-index:99995;display:none;align-items:center;justify-content:center;background:#0008}#x160I.on{display:flex}
#x160I .pp{width:min(380px,92vw);background:#fffdf5;color:#1f2937;font:14px 'Courier New',monospace;padding:18px 20px;border-radius:4px;box-shadow:0 20px 60px #000c;transform:rotate(-1.5deg);border-top:6px dashed #94a3b8;animation:x160in .5s ease}
#x160I h3{margin:0 0 8px;text-align:center;font:900 17px 'Courier New',monospace}#x160I .ln{display:flex;justify-content:space-between;border-bottom:1px dotted #9ca3af;padding:3px 0}
@keyframes x160in{from{transform:translateY(60px) rotate(4deg);opacity:0}}
`;document.head.appendChild(css);

// ================= LOBBY PANEL =================
const M=document.createElement('div');M.id='x160M';M.innerHTML='<div class="bx"><h2><span>🏛️ KÖZHIVATAL – Ügyfélfogadás</span><button class="b" id="x160X">✖</button></h2><div class="tb" id="x160Tb"></div><div id="x160B"></div></div>';
document.body.appendChild(M);
$('x160X').onclick=()=>close();M.addEventListener('click',e=>{if(e.target===M)close()});
const TABS=[['stamp','🖋️ Pecsételő'],['buzz','📝 Pályázatíró'],['bid','🔨 Közbeszerzés'],['mem','🧠 Átadó-memória'],['day','📅 Napi feladatok'],['stat','📊 Statisztika']];
let tab='stamp',timers=[];
function clr(){timers.forEach(t=>{clearInterval(t);clearTimeout(t)});timers=[]}
function close(){clr();M.classList.remove('on')}
function open(t){if(inMatch())return;tab=t||tab;M.classList.add('on');render()}
function render(){clr();$('x160Tb').innerHTML=TABS.map(([k,n])=>'<button data-k="'+k+'" class="'+(k===tab?'on':'')+'">'+n+'</button>').join('');
 $('x160Tb').querySelectorAll('button').forEach(b=>b.onclick=()=>{tab=b.dataset.k;render()});
 ({stamp:rStamp,buzz:rBuzz,bid:rBid,mem:rMem,day:rDay,stat:rStat})[tab]($('x160B'))}
X.open=open;X.close=close;

// ---- 1: Pecsételő ----
function rStamp(B){B.innerHTML='<div class="card">Pecsételd le a <b style="color:#4ade80">zöld (JÓVÁHAGYANDÓ)</b> iratokat, a <b style="color:#f87171">pirosakat</b> ne! 20 mp. Pont × 60 Ft. Rekord: <b>'+ST.stamp+'</b></div><div class="ar" id="x160ar"></div><p style="display:flex;justify-content:space-between;align-items:center"><span id="x160sc">Pont: 0 · Idő: 20</span><button class="b g" id="x160go">▶ Kezdés</button></p>';
 $('x160go').onclick=()=>{clr();const ar=$('x160ar');ar.innerHTML='';let sc=0,t=20;$('x160go').disabled=true;
  const OK=['Uszoda-felújítás','Kisvasút II.','Stadion 4.','Kilátó-terv','Díszkút','Rotunda'],NO=['Kórház-ágy','Iskolatető','Bérkorrekció','Kátyúzás','Busz-ritkítás'];
  const up=()=>{$('x160sc').textContent='Pont: '+sc+' · Idő: '+t};
  timers.push(setInterval(()=>{const ok=R()<.65,d=document.createElement('div');d.className='doc '+(ok?'ok':'no');d.textContent=ok?pk(OK):pk(NO);
   d.style.left=rnd(2,ar.clientWidth-96)+'px';d.style.top=rnd(2,ar.clientHeight-66)+'px';ar.appendChild(d);
   d.onclick=()=>{if(d.classList.contains('st'))return;d.classList.add('st');if(ok){sc++;snd('click')}else{sc=Math.max(0,sc-2);snd('hit');d.style.filter='grayscale(1)'}up()};
   setTimeout(()=>{if(d.parentNode)d.remove()},1500)},420));
  timers.push(setInterval(()=>{t--;up();if(t<=0){clr();const w=sc*60;pay(w);if(sc>ST.stamp)ST.stamp=sc;ST.earn+=w;saveST();dayAdd('stamp',sc);toast('🖋️ '+sc+' irat lepecsételve → +'+fmt(w)+' Ft');rStamp(B)}},1000))}}

// ---- 2: Pályázatíró ----
const GOOD=['fenntartható','innovatív','szinergia','kompetencia','fejlesztés','hálózatos','zöld átállás','digitális','klaszter','közösségépítő','reziliencia','esélyteremtő'];
const BAD=['ingyen sör','nyaraló','haveri','jacht','gyorsan elkölt','meglepetés','nem kérdez','zsebbe','ki tudja','lufi'];
function rBuzz(B){const w=[...GOOD].sort(()=>R()-.5).slice(0,6).concat([...BAD].sort(()=>R()-.5).slice(0,6)).sort(()=>R()-.5);let sel=new Set(),t=15;
 B.innerHTML='<div class="card">Válaszd ki a <b>6 pályázati kulcsszót</b> 15 mp alatt – a gyanús szavak levonást érnek! Rekord: <b>'+ST.buzz+'</b>/6</div><div id="x160w" style="text-align:center">'+w.map((x,i)=>'<span class="wd" data-i="'+i+'">'+x+'</span>').join('')+'</div><p style="display:flex;justify-content:space-between"><span id="x160bt">Idő: 15</span><button class="b g" id="x160bs">📨 Beadás</button></p>';
 B.querySelectorAll('.wd').forEach(s=>s.onclick=()=>{const i=+s.dataset.i;if(sel.has(i))sel.delete(i);else sel.add(i);s.classList.toggle('sel');snd('click')});
 const fin=()=>{clr();let sc=0;B.querySelectorAll('.wd').forEach(s=>{const i=+s.dataset.i,g=GOOD.includes(w[i]);s.classList.add(g?'good':'bad');if(sel.has(i))sc+=g?1:-1});sc=Math.max(0,sc);
  const win=sc*350+(sc===6?1500:0);pay(win);if(sc>ST.buzz)ST.buzz=sc;ST.earn+=win;saveST();if(sc>=4)dayAdd('buzz',1);
  $('x160bt').innerHTML=(sc>=4?'✅ A pályázat NYERT! ':'❌ Hiánypótlásra visszaküldve. ')+sc+'/6 → +'+fmt(win)+' Ft';$('x160bs').textContent='🔁 Új pályázat';$('x160bs').onclick=()=>rBuzz(B);snd(sc>=4?'win':'hit')};
 $('x160bs').onclick=fin;timers.push(setInterval(()=>{t--;const e=$('x160bt');if(e)e.textContent='Idő: '+t;if(t<=0)fin()},1000))}

// ---- 3: Közbeszerzés-licit ----
const FIRMS=['Betonbaráti Kft.','Sógor-Építő Zrt.','Aranykorlát Bt.','Kilométerkő Holding','Díszburkolat Kft.'];
const PROJ=['🚧 400 m kerékpárút','🏟️ falusi stadion','⛲ zenélő szökőkút','🗿 óriás szobor','🚏 arany buszmegálló','🛤️ kisvasút a semmibe'];
let bidCd=0;
function rBid(B){const pr=pk(PROJ),bud=Math.round(rnd(20,80))*1000,fee=500;
 B.innerHTML='<div class="card"><b>'+pr+'</b> – keretösszeg: <b>'+fmt(bud)+' Ft</b>. A <b>legalacsonyabb</b> érvényes ajánlat nyer, de a keret 55%-a alatti ajánlat „gyanúsan alacsony” → kizárás. Nyerés: az ajánlatod 12%-a haszon. Részvételi díj: '+fee+' Ft. (Mérleg: '+ST.bidW+' nyert / '+ST.bidL+' vesztett)</div><div class="card">Ajánlatod: <b id="x160bv"></b><input type="range" id="x160br" min="40" max="110" value="85"></div><button class="b g" id="x160bg">📨 Ajánlat beadása</button><div id="x160bo"></div>';
 const rg=$('x160br'),sv=()=>$('x160bv').textContent=fmt(bud*rg.value/100)+' Ft ('+rg.value+'%)';rg.oninput=sv;sv();
 $('x160bg').onclick=()=>{if(Date.now()<bidCd){toast('⏳ A bizottság még ülésezik… ('+Math.ceil((bidCd-Date.now())/1000)+' mp)');return}if(!hasS()||(S.c||0)<fee){toast('Nincs elég Ft a részvételi díjra');return}
  bidCd=Date.now()+5000;pay(-fee);const my=bud*rg.value/100,fs=[...FIRMS].sort(()=>R()-.5).slice(0,3).map(n=>({n,v:bud*rnd(.58,1.05)}));
  const all=fs.concat([{n:'⭐ TE',v:my,me:1}]).map(o=>Object.assign(o,{bad:o.v<bud*.55||o.v>bud}));const val=all.filter(o=>!o.bad).sort((a,b)=>a.v-b.v),w=val[0];
  const rows=all.sort((a,b)=>a.v-b.v).map(o=>'<div style="display:flex;justify-content:space-between;padding:3px 0;'+(o===w?'color:#fbbf24;font-weight:800':'')+'"><span>'+(o.me?'<b>'+o.n+'</b>':o.n)+'</span><span>'+fmt(o.v)+' Ft '+(o.bad?'❌ érvénytelen':o===w?'🏆':'')+'</span></div>').join('');
  let msg;if(w&&w.me){const g=Math.round(my*.12);pay(g);ST.bidW++;ST.earn+=g-fee;dayAdd('bid',1);msg='🏆 NYERTÉL! Haszon: +'+fmt(g)+' Ft (a kivitelezés „várhatóan” 2031-ben kész)';snd('win')}else{ST.bidL++;ST.earn-=fee;msg='😶 Nem nyertél. Az eredményhirdetés véletlenül egy ismerős cégnek kedvezett.';snd('hit')}
  saveST();$('x160bo').innerHTML='<div class="card">'+rows+'<p><b>'+msg+'</b></p><button class="b" id="x160bn">🔁 Új kiírás</button></div>';$('x160bn').onclick=()=>rBid(B)}}

// ---- 4: Átadó-memória ----
function rMem(B){const E=['🏟️','🚄','⛲','🗿','🎡','🏰','🚧','✂️'],c=E.concat(E).sort(()=>R()-.5);let fl=[],done=0,mv=0,lock=false;
 B.innerHTML='<div class="card">Párosítsd a beruházásokat – minden párnál szalagátvágás! Kevesebb lépés = több Ft. Legjobb: <b>'+(ST.mem||'–')+'</b> lépés</div><div class="mg" id="x160mg">'+c.map((e,i)=>'<div class="mc" data-i="'+i+'"></div>').join('')+'</div><p id="x160ms" style="text-align:center">Lépés: 0</p>';
 B.querySelectorAll('.mc').forEach(d=>d.onclick=()=>{const i=+d.dataset.i;if(lock||d.classList.contains('f')||d.classList.contains('d'))return;d.classList.add('f');d.textContent=c[i];fl.push(d);snd('click');
  if(fl.length===2){mv++;$('x160ms').textContent='Lépés: '+mv;const[a,b]=fl;fl=[];if(c[+a.dataset.i]===c[+b.dataset.i]){a.classList.add('d');b.classList.add('d');done++;snd('coin');
    if(done===8){const win=Math.max(500,6000-(mv-8)*300);pay(win);if(!ST.mem||mv<ST.mem)ST.mem=mv;ST.earn+=win;saveST();dayAdd('mem',1);$('x160ms').innerHTML='🎉 Mind átadva '+mv+' lépésből → +'+fmt(win)+' Ft <button class="b" id="x160mr">🔁</button>';$('x160mr').onclick=()=>rMem(B);snd('win')}}
   else{lock=true;setTimeout(()=>{a.classList.remove('f');b.classList.remove('f');a.textContent=b.textContent='';lock=false},650)}}})}

// ---- 5: Napi feladatok ----
const DAYT=[['bag','Gyűjts 5 aktatáskát meccsben','💼',5],['rib','Vágj át 2 szalagot meccsben','🎀',2],['zone','Teljesíts 1 támogatási zónát','🇪🇺',1],['stamp','Pecsételj le 25 iratot','🖋️',25],['bid','Nyerj 1 közbeszerzést','🔨',1],['buzz','Nyerj 1 pályázatot (≥4/6)','📝',1],['mem','Fejezz be 1 átadó-memóriát','🧠',1],['seal','Használd a hivatalos pecsétet 1×','🖃',1]];
const today=()=>new Date().toISOString().slice(0,10);
function dayGet(){let d=LS.g('k3x160day',null);if(!d||d.d!==today()){const ks=[...DAYT].sort(()=>R()-.5).slice(0,3).map(t=>t[0]);d={d:today(),ks,p:{},cl:{}};LS.s('k3x160day',d)}return d}
function dayAdd(k,n){const d=dayGet();if(!d.ks.includes(k))return;const t=DAYT.find(x=>x[0]===k);const was=(d.p[k]||0)>=t[3];d.p[k]=(d.p[k]||0)+n;LS.s('k3x160day',d);if(!was&&d.p[k]>=t[3])toast('📅 Napi hivatali feladat kész: '+t[2]+' '+t[1]+' – vedd át a jutalmat!')}
function rDay(B){const d=dayGet();B.innerHTML='<div class="card">3 napi feladat, mindegyik <b>3 000 Ft</b>, mind a három után <b>+5 000 Ft</b> „év végi jutalom”. Új feladatok éjfélkor.</div>'+d.ks.map(k=>{const t=DAYT.find(x=>x[0]===k),p=Math.min(t[3],d.p[k]||0);
  return '<div class="card" style="display:flex;gap:12px;align-items:center"><span style="font-size:28px">'+t[2]+'</span><div style="flex:1"><b>'+t[1]+'</b><div class="bar"><u style="width:'+(p/t[3]*100)+'%"></u></div>'+p+' / '+t[3]+'</div><button class="b g" data-k="'+k+'" '+(p<t[3]||d.cl[k]?'disabled':'')+'>'+(d.cl[k]?'✔ Átvéve':'Átvétel')+'</button></div>'}).join('');
 B.querySelectorAll('button[data-k]').forEach(b=>b.onclick=()=>{const d=dayGet(),k=b.dataset.k;if(d.cl[k])return;d.cl[k]=1;let w=3000;if(d.ks.every(x=>d.cl[x]))w+=5000;LS.s('k3x160day',d);pay(w);ST.earn+=w;saveST();snd('buy');toast('📅 +'+fmt(w)+' Ft');rDay(B)})}

// ---- 6: Statisztika ----
function rStat(B){const L=[['🖋️ Pecsételő rekord',ST.stamp+' irat'],['📝 Pályázatíró rekord',ST.buzz+'/6'],['🧠 Memória legjobb',(ST.mem||'–')+' lépés'],['🔨 Közbeszerzés',ST.bidW+' nyert / '+ST.bidL+' vesztett'],['💼 Aktatáskák',ST.bag],['🎀 Átvágott szalagok',ST.rib],['🇪🇺 Támogatási zónák',ST.zone],['🖃 Pecsét-használat',ST.seal],['🧾 Elszámolt meccsek',ST.matches],['💰 Összes hivatali bevétel',fmt(ST.earn)+' Ft']];
 B.innerHTML='<div class="card">'+L.map(([a,b])=>'<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #ffffff12"><span>'+a+'</span><b>'+b+'</b></div>').join('')+'</div><div class="card" style="font-size:12px;opacity:.8">Meccsben: 💼 aktatáskák (rááll = felvesz, minden 3. = 🖃 pecsét), 🎀 szalagkapu (fuss át rajta), 🇪🇺 támogatási zóna (maradj benne 6 mp), <b>PageDown</b> = hivatalos pecsét (3 mp sebezhetetlenség + a közeli ellenfelek lassulnak). Lobby: <b>PageUp</b> = Közhivatal.</div>'}

// ---- hub gomb ----
function btn(){let h=$('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 let b=$('x160Btn');if(!b){b=document.createElement('button');b.id='x160Btn';b.textContent='🏛️ KÖZHIVATAL';b.onclick=()=>open();h.appendChild(b)}b.style.display=inMatch()?'none':''}
setInterval(btn,1500);setTimeout(btn,300);

// ================= MECCSBELI ESEMÉNYEK =================
const HUD=document.createElement('div');HUD.id='x160H';document.body.appendChild(HUD);
const T3=()=>typeof THREE!=='undefined'&&typeof scene!=='undefined';
function gy(x,z){try{if(typeof floorH==='function'){const v=floorH({x,z,y:60});if(isFinite(v))return v}}catch(e){}return 0}
function beam(col,h){const m=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,h,10,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.28,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.position.y=h/2;return m}
function mkBag(x,z){const g=new THREE.Group(),gold=new THREE.MeshBasicMaterial({color:0xfbbf24});
 const b=new THREE.Mesh(new THREE.BoxGeometry(.9,.6,.28),new THREE.MeshBasicMaterial({color:0x7c2d12}));b.position.y=.9;g.add(b);
 const h=new THREE.Mesh(new THREE.TorusGeometry(.18,.05,6,12,Math.PI),gold);h.position.y=1.22;g.add(h);
 const l=new THREE.Mesh(new THREE.BoxGeometry(.92,.08,.3),gold);l.position.y=.95;g.add(l);g.add(beam(0xfbbf24,10));
 g.position.set(x,gy(x,z),z);scene.add(g);return{k:'bag',x,z,g,spin:b}}
function mkRib(x,z,a){const g=new THREE.Group(),pm=new THREE.MeshBasicMaterial({color:0xe5e7eb});
 [-1.6,1.6].forEach(s=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.8,8),pm);p.position.set(s,.9,0);g.add(p);const k=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),new THREE.MeshBasicMaterial({color:0xfbbf24}));k.position.set(s,1.85,0);g.add(k)});
 const r=new THREE.Mesh(new THREE.BoxGeometry(3.2,.18,.04),new THREE.MeshBasicMaterial({color:0xdc2626}));r.position.y=1.25;g.add(r);
 const bw=new THREE.Mesh(new THREE.TorusGeometry(.2,.07,6,12),new THREE.MeshBasicMaterial({color:0xef4444}));bw.position.y=1.25;g.add(bw);g.add(beam(0xef4444,8));
 g.rotation.y=a;g.position.set(x,gy(x,z),z);scene.add(g);return{k:'rib',x,z,a,g,r}}
function mkZone(x,z){const g=new THREE.Group();const ring=new THREE.Mesh(new THREE.RingGeometry(4.6,5,40),new THREE.MeshBasicMaterial({color:0x2563eb,transparent:true,opacity:.75,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.12;g.add(ring);
 const fill=new THREE.Mesh(new THREE.CircleGeometry(4.6,40),new THREE.MeshBasicMaterial({color:0x1d4ed8,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false}));fill.rotation.x=-Math.PI/2;fill.position.y=.1;g.add(fill);
 const stars=[];for(let i=0;i<12;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.22),new THREE.MeshBasicMaterial({color:0xfde047}));g.add(s);stars.push(s)}
 const wall=new THREE.Mesh(new THREE.CylinderGeometry(5,5,3,40,1,true),new THREE.MeshBasicMaterial({color:0x3b82f6,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));wall.position.y=1.5;g.add(wall);
 g.position.set(x,gy(x,z),z);scene.add(g);return{k:'zone',x,z,g,stars,fill,t:0,life:40}}
function rm(o){try{scene.remove(o.g);o.g.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material)m.material.dispose()})}catch(e){}}
function near(g,a,b){const an=R()*Math.PI*2,d=rnd(a,b);return[g.x+Math.cos(an)*d,g.z+Math.sin(an)*d]}
function spawn(k){const g=G;if(!g||!T3())return;
 if(k==='bag'){for(let i=0;i<3;i++){const[x,z]=near(g,8,22);X.objs.push(mkBag(x,z))}say('💼 SZÁMVEVŐSZÉKI AKTATÁSKÁK a közelben! Szedd fel őket, mielőtt eltűnnek!')}
 if(k==='rib'){const[x,z]=near(g,10,20);X.objs.push(mkRib(x,z,R()*Math.PI));say('🎀 ÁTADÓÜNNEPSÉG! Fuss át a szalagon: +800 Ft +15 HP')}
 if(k==='zone'){const[x,z]=near(g,10,18);X.objs.push(mkZone(x,z));say('🇪🇺 TÁMOGATÁSI ZÓNA nyílt! Maradj benne 6 mp-ig: +30 pajzs')}
 snd('wave')}
X.spawn=spawn;
function resetMatch(){X.objs.forEach(rm);X.objs=[];X.m={t:rnd(18,30),seal:0,bags:0,log:{bag:0,rib:0,zone:0,seal:0,ft:0},sealT:0}}
function gain(m,k,ft,txt){m.log[k]++;m.log.ft+=ft;ST[k]++;ST.earn+=ft;pay(ft);saveST();dayAdd(k,1);say(txt)}
function step(g,d){const m=X.m;m.t-=d;if(m.t<=0){spawn(pk(['bag','bag','rib','zone']));m.t=rnd(40,70)}
 if(m.sealT>0){m.sealT-=d;(g.en||[]).forEach(e=>{if(!e.dead&&Math.hypot(e.x-g.x,e.z-g.z)<12){if(e._x160s==null)e._x160s=e.sp;e.sp=e._x160s*.35}});if(m.sealT<=0)(g.en||[]).forEach(e=>{if(e._x160s!=null){e.sp=e._x160s;e._x160s=null}})}
 const tm=performance.now()/1000;
 X.objs=X.objs.filter(o=>{const dd=Math.hypot(o.x-g.x,o.z-g.z);
  if(o.k==='bag'){o.spin.parent.rotation.y=tm*2;o.spin.position.y=.9+Math.sin(tm*3)*.15;if(dd<1.9){m.bags++;let t='💼 Aktatáska! +600 Ft';if(m.bags%3===0&&m.seal<2){m.seal++;t+=' · 🖃 HIVATALOS PECSÉT (PageDown)'}gain(m,'bag',600,t);snd('coin');try{ftx(o.x,o.z,'+600 Ft','#fbbf24')}catch(e){}rm(o);return false}}
  if(o.k==='rib'){const lx=(g.x-o.x)*Math.cos(o.a)-(g.z-o.z)*Math.sin(o.a),lz=(g.x-o.x)*Math.sin(o.a)+(g.z-o.z)*Math.cos(o.a);o.r.scale.y=1+Math.sin(tm*6)*.2;
   if(Math.abs(lx)<1.7&&Math.abs(lz)<.7){g.hp=Math.min(g.mhp||100,(g.hp||0)+15);gain(m,'rib',800,'✂️ SZALAG ÁTVÁGVA! A beruházás „elkészült”. +800 Ft +15 HP');snd('win');try{ftx(o.x,o.z,'✂️ ÁTADVA!','#ef4444')}catch(e){}rm(o);return false}}
  if(o.k==='zone'){o.life-=d;o.stars.forEach((s,i)=>{const a=tm*.8+i/12*Math.PI*2;s.position.set(Math.cos(a)*4.8,2.4+Math.sin(tm*2+i)*.2,Math.sin(a)*4.8);s.rotation.y=tm*3});
   if(dd<4.8){o.t+=d;o.fill.material.opacity=.18+o.t/6*.4}else o.t=Math.max(0,o.t-d*.5);
   if(o.t>=6){g.sh=Math.min(100,(g.sh||0)+30);gain(m,'zone',1200,'🇪🇺 Támogatás lehívva! +30 pajzs +1 200 Ft (a fenntartási időszak 5 év)');snd('magic');rm(o);return false}
   if(o.life<=0){say('🇪🇺 A támogatási zóna lejárt – a keret visszaszállt Brüsszelbe.');rm(o);return false}}
  return true});
 const z=X.objs.find(o=>o.k==='zone'&&Math.hypot(o.x-g.x,o.z-g.z)<4.8);
 const html='<span>🖃 Pecsét: '+m.seal+'</span><span>💼 '+m.log.bag+' · 🎀 '+m.log.rib+' · 🇪🇺 '+m.log.zone+'</span>'+(z?'<span>🇪🇺 Lehívás: '+Math.round(z.t/6*100)+'%</span>':'')+(m.sealT>0?'<span>🛡️ Mentesség '+m.sealT.toFixed(1)+' mp</span>':'');
 if(HUD._h!==html){HUD._h=html;HUD.innerHTML=html}HUD.style.display='flex'}
function useSeal(){const g=G,m=X.m;if(!inMatch()||!m)return;if(m.seal<=0){say('🖃 Nincs hivatalos pecséted – gyűjts aktatáskát (minden 3. ad egyet)!');return}
 m.seal--;m.sealT=3;g.ef=g.ef||[];g.ef.push({k:'inv',t:3});m.log.seal++;ST.seal++;saveST();dayAdd('seal',1);say('🖃 HIVATALOS MENTESSÉG! 3 mp sebezhetetlenség, a környék ügyintézése lelassult.');snd('ult')}

const oU=window.update;
window.update=function(dt){const r=oU.apply(this,arguments);const g=typeof G!=='undefined'?G:null;
 if(g!==X.gref){X.gref=g;resetMatch()}
 if(!g||g.over||g.phase!=='play'){if(HUD.style.display!=='none')HUD.style.display='none';return r}
 try{step(g,Math.min(.1,dt||.016))}catch(e){console.error('x160',e)}
 return r};

// ---- meccsvégi elszámolás ----
const IV=document.createElement('div');IV.id='x160I';document.body.appendChild(IV);IV.onclick=()=>IV.classList.remove('on');
function invoice(){const m=X.m;if(!m)return;const L=m.log;if(!(L.bag||L.rib||L.zone||L.seal))return;ST.matches++;saveST();
 const no='KH-'+Date.now().toString(36).toUpperCase().slice(-6);
 IV.innerHTML='<div class="pp"><h3>🧾 HIVATALOS ELSZÁMOLÁS</h3><div style="text-align:center;font-size:11px">Bizonylat: '+no+' · '+new Date().toLocaleString('hu-HU')+'</div><br>'+
 [['💼 Aktatáska',L.bag,600],['🎀 Szalagátvágás',L.rib,800],['🇪🇺 Támogatás',L.zone,1200],['🖃 Pecsét-használat',L.seal,0]].map(([n,c,p])=>'<div class="ln"><span>'+n+' × '+c+'</span><span>'+fmt(c*p)+' Ft</span></div>').join('')+
 '<div class="ln" style="font-weight:900;border-bottom:2px solid #111"><span>ÖSSZESEN</span><span>'+fmt(L.ft)+' Ft</span></div><p style="font-size:11px;text-align:center">A költések „szabályosak”. Számla nem készült.<br>(kattints a bezáráshoz)</p></div>';
 IV.classList.add('on');setTimeout(()=>IV.classList.remove('on'),9000)}
X.invoice=invoice;
const oE=window.end;
if(typeof oE==='function')window.end=function(){const r=oE.apply(this,arguments);try{X.objs.forEach(rm);X.objs=[];HUD.style.display='none';invoice();X.m&&(X.m.log={bag:0,rib:0,zone:0,seal:0,ft:0})}catch(e){}return r};

// ---- billentyűk ----
addEventListener('keydown',e=>{if(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
 if(e.key==='PageDown'&&inMatch()){e.preventDefault();useSeal()}
 else if(e.key==='PageUp'&&!inMatch()){e.preventDefault();M.classList.contains('on')?close():open()}
 else if(e.key==='Escape'&&M.classList.contains('on'))close()},true);
X.useSeal=useSeal;X.dayAdd=dayAdd;X.giveSeal=()=>{if(X.m)X.m.seal=2};
})();
