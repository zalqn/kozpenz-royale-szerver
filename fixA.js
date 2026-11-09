// fixA.js – (A) javítások + technika: 🩹 csapat-újraélesztés (extra140c kék bot-társak), ⚡ FPS-mérés + automatikus grafika-csökkentés
// (extra140g előbeállítások), 🐞 kliens-hibanapló (/api/clientlog), 🆕 verziószám + „Mi újság?” ablak. Kulcsok: k3Aver, k3Aauto, k3Afpsm. Debug: _fixA
(function(){
'use strict';
const VER='2026.11.08';
const NEWS=['🎰 Kaszinó: a FREE SPINS-sáv bónuszkörben látszik, a /444 „KÖZPÉNZ!” felirat kisebb képernyőn is kifér',
 '🩹 Csapat-újraélesztés: a kék bot-társak (Zászlórablás) elesnek, E nyomva 3 mp-ig felsegíted őket – és ők is felsegítenek (max 2×/meccs)',
 '⚡ Automatikus grafika: ha meccsben tartósan 28 FPS alá esik a játék, egy fokozattal csökken a grafika (Grafika panelben kikapcsolható) + FPS-mérő',
 '🐞 Hibanapló: a játék hibái névtelenül a szerverre kerülnek, hogy gyorsabban javíthassuk',
 '🏅 Rangok fiókhoz kötve, ☁️ felhőmentés, 🧭 új lobby-kategóriasáv, 🐕 ritka kutyák, ⚽ VSport menedzser'];
const $=id=>document.getElementById(id);
const LG=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:v}catch(e){return d}};
const LSs=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const X={ver:VER,down:[],used:0,ehold:false,fps:0,low:0,warm:0,auto:null,errs:0};window._fixA=X;
const headless=/HeadlessChrome/.test(navigator.userAgent);
X.auto=()=>{const v=LG('k3Aauto',null);return v==null?!headless:v==='1'};
const inPlay=()=>typeof G!=='undefined'&&G&&!G.over&&G.phase==='play';
const tell=t=>{try{if(inPlay()&&typeof say==='function')return say(t)}catch(e){}let el=$('fixAT');if(!el){el=document.createElement('div');el.id='fixAT';document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2800)};

const st=document.createElement('style');st.textContent=`
#fixAT{position:fixed;left:50%;top:110px;transform:translateX(-50%);z-index:100001;background:#111827ee;color:#fff;font:700 14px system-ui;padding:9px 16px;border-radius:12px;border:1px solid #60a5fa88;opacity:0;transition:opacity .25s;pointer-events:none}#fixAT.on{opacity:1}
#fixAR{position:fixed;left:50%;top:64%;transform:translateX(-50%);z-index:31;pointer-events:none;font:700 15px system-ui;color:#fff;background:linear-gradient(135deg,#1e3a8acc,#0f766ecc);border:1px solid #60a5fa88;border-radius:12px;padding:8px 14px;display:none;text-align:center}
#fixAR u{display:block;height:6px;margin-top:5px;border-radius:4px;background:linear-gradient(90deg,#60a5fa,#34d399);width:0;text-decoration:none}
#fixAF{position:fixed;right:8px;bottom:8px;z-index:9999;font:700 12px ui-monospace,monospace;color:#a7f3d0;background:#000a;padding:3px 7px;border-radius:6px;pointer-events:none;display:none}
#fixAN{position:fixed;inset:0;z-index:100000;background:#000b;display:flex;align-items:center;justify-content:center;font:14px system-ui;color:#e5e7eb}
#fixAN .bx{width:min(560px,92vw);max-height:86vh;overflow:auto;background:linear-gradient(160deg,#0f172a,#1e1b4b);border:1px solid #facc1566;border-radius:16px;padding:18px 20px;box-shadow:0 20px 60px #000c}
#fixAN h2{margin:0 0 4px;font:900 22px system-ui;color:#facc15}#fixAN .v{color:#94a3b8;font-size:12px;margin-bottom:10px}
#fixAN li{margin:7px 0;line-height:1.35}#fixAN button{margin-top:12px;background:#facc15;color:#111;border:0;border-radius:10px;padding:9px 18px;font:800 14px system-ui;cursor:pointer}
.fixArow{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-top:1px solid #ffffff14}.fixArow small{display:block;opacity:.65;font-size:11px}
.fixArow input{width:18px;height:18px}
`;document.head.appendChild(st);
const RB=document.createElement('div');RB.id='fixAR';document.body.appendChild(RB);
const FM=document.createElement('div');FM.id='fixAF';document.body.appendChild(FM);

// ================= 🐞 kliens-hibanapló =================
const seen=new Set();
function report(m,f,l,c,stk){try{if(X.errs>=10)return;m=String(m||'').slice(0,400);const key=m+'|'+f+'|'+l;if(seen.has(key))return;seen.add(key);X.errs++;
 if(location.protocol==='file:')return;
 const u=(window.ACC&&ACC.user&&ACC.user.name)||'';
 fetch('/api/clientlog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({m,f:String(f||'').replace(location.origin,''),l,c,st:String(stk||'').slice(0,800),ua:navigator.userAgent,u,v:VER}),keepalive:true}).catch(()=>{})}catch(e){}}
addEventListener('error',e=>{if(e&&e.message)report(e.message,e.filename,e.lineno,e.colno,e.error&&e.error.stack)});
addEventListener('unhandledrejection',e=>{const r=e&&e.reason;report('Promise: '+(r&&r.message||r),'',0,0,r&&r.stack)});
X.report=report;

// ================= 🩹 csapat-újraélesztés (extra140c kék bot-társak) =================
addEventListener('keydown',e=>{if(e.code==='KeyE'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)))X.ehold=true},true);
addEventListener('keyup',e=>{if(e.code==='KeyE')X.ehold=false},true);
addEventListener('blur',()=>{X.ehold=false});
const C14=()=>{const c=window._x14c;return c&&c.on==='ctf'&&Array.isArray(c.al)?c:null};
const D2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const fh=(x,z)=>{try{return typeof floorH==='function'?floorH(x,z):0}catch(e){return 0}};
if(typeof window.hurt==='function'){const oH=window.hurt;window.hurt=function(d,storm){const r=oH.apply(this,arguments);try{const g=G,c=C14();
 if(c&&g&&g.hp<=0&&!storm&&!g._x150dn&&(g._fixAu|0)<2&&c.al.length){g._fixAu=(g._fixAu|0)+1;g.hp=1;g.sh=0;g._x150dn={t:3,x:g.x,z:g.z};g.ef.push({k:'inv',t:3.6});tell('🩹 LENT VAGY! A kék társaid felsegítenek… ('+g._fixAu+'/2)')}}catch(e){}return r}}
function teamTick(g,dt){const c=C14();if(!c){if(X.down.length)X.down=[];RB.style.display='none';return}
 if(c._fixAg!==g){c._fixAg=g;X.down=[]}
 const en=(g.en||[]).filter(e=>!e.dead);
 // a) sebzés a társakra: közeli ellenfelek lövik őket
 for(let i=c.al.length-1;i>=0;i--){const b=c.al[i];if(b.hp==null)b.hp=100;let n=0;for(const e of en)if(D2(e,b)<18)n++;
  if(n){b.hp-=Math.min(3,n)*5*dt;if(Math.random()<dt*.8)try{ftx(b.x,b.z,'-'+(4+n*2),'#f87171')}catch(e){}}
  if(b.hp<=0){c.al.splice(i,1);b.m.rotation.z=Math.PI/2;b.m.position.y=fh(b.x,b.z)+.35;X.down.push({b,t:30,pr:0,sos:0});tell('🆘 Egy kék társad elesett! Állj mellé és tartsd nyomva az E-t (3 mp).')}}
 // b) a lent levők: kivérzés 30 mp, élesztés E nyomva 3 mp
 let near=null;
 for(let i=X.down.length-1;i>=0;i--){const R=X.down[i];R.t-=dt;R.sos-=dt;if(R.sos<=0){R.sos=2;try{ftx(R.b.x,R.b.z,'🆘 '+Math.ceil(R.t)+'s','#60a5fa')}catch(e){}}
  if(R.t<=0){X.down.splice(i,1);try{scene.remove(R.b.m)}catch(e){}tell('💀 Egy kék társad kivérzett.');continue}
  if(D2(R.b,g)<3)near=R;else R.pr=Math.max(0,R.pr-dt/3)}
 if(near&&!g._x150dn){if(X.ehold)near.pr+=dt/3;else near.pr=Math.max(0,near.pr-dt/3);
  RB.style.display='block';RB.innerHTML=(X.ehold?'🩹 Társ élesztése…':'🩹 Tartsd nyomva az <b>E</b>-t a kék társ felélesztéséhez')+' ('+Math.ceil(near.t)+' mp)<u style="width:'+Math.round(near.pr*100)+'%"></u>';
  if(near.pr>=1){X.down.splice(X.down.indexOf(near),1);const b=near.b;b.hp=60;b.cd=1;b.m.rotation.z=0;c.al.push(b);X.used++;RB.style.display='none';tell('🤝 Felélesztetted a kék társadat! (+500 Ft)');g.cash=(g.cash||0)+500;try{sfx('buy')}catch(e){}}}
 else RB.style.display='none';
 // c) ha téged élesztenek: a legközelebbi álló társ odarohan
 if(g._x150dn&&c.al.length){let b=c.al[0];for(const a of c.al)if(D2(a,g)<D2(b,g))b=a;const q=D2(b,g);if(q>1.5){b.x+=(g.x-b.x)/q*9*dt;b.z+=(g.z-b.z)/q*9*dt}}}

// ================= ⚡ FPS-mérés + auto-grafika =================
const ORD=['ultra','magas','kozepes','alacsony'];let fN=0,fT=0;
function fpsTick(g,dt){fN++;fT+=dt;if(fT<1)return;X.fps=Math.round(fN/fT);fN=0;fT=0;
 if(LG('k3Afpsm','0')==='1'){FM.style.display='block';FM.textContent=X.fps+' FPS'}else FM.style.display='none';
 if(!g||!inPlay()){X.low=0;X.warm=0;return}
 X.warm++;if(X.warm<10||!X.auto())return;
 if(X.fps<28)X.low++;else X.low=Math.max(0,X.low-1);
 if(X.low>=8){X.low=0;X.warm=0;const G14=window._x14g;if(!G14||!G14.preset)return;const cur=G14.C&&G14.C.preset;let i=ORD.indexOf(cur);if(i<0)i=1;
  if(i<ORD.length-1){G14.preset(ORD[i+1]);tell('⚡ Lassú gép: grafika → '+ORD[i+1]+' ('+X.fps+' FPS). Kikapcsolható: Grafika panel.')}}}
// kapcsolók a Grafika panelbe (extra140g #x14gp)
setInterval(()=>{const P=$('x14gp');if(!P||P.querySelector('.fixArow'))return;const ft=P.querySelector('.ft');if(!ft)return;
 const mk=(k,t,s,on)=>{const d=document.createElement('label');d.className='fixArow';d.innerHTML='<div>'+t+'<small>'+s+'</small></div><input type="checkbox">';const i=d.querySelector('input');i.checked=on();i.onchange=()=>LSs(k,i.checked?'1':'0');return d};
 ft.parentNode.insertBefore(mk('k3Aauto','⚡ Automatikus grafika-csökkentés','tartósan 28 FPS alatt egy fokozattal lejjebb',X.auto),ft);
 ft.parentNode.insertBefore(mk('k3Afpsm','📊 FPS-mérő a sarokban','jobb alsó sarok',()=>LG('k3Afpsm','0')==='1'),ft)},1000);

// ================= update csomagoló =================
const oU=window.update;
if(typeof oU==='function')window.update=function(dt){const r=oU.apply(this,arguments);const d=Math.min(.1,dt||.016),g=typeof G!=='undefined'?G:null;
 try{fpsTick(g,d)}catch(e){}
 try{if(g&&!g.over&&g.phase==='play')teamTick(g,d);else RB.style.display='none'}catch(e){console.error('fixA team',e)}
 return r};

// ================= 🆕 verzió + Mi újság? =================
function news(force){if(!force&&(LG('k3Aver','')===VER||headless))return;
 if(!force){const lb=$('lb');if(!lb||!lb.classList.contains('on')){setTimeout(()=>news(false),1500);return}}
 if($('fixAN'))return;const d=document.createElement('div');d.id='fixAN';
 d.innerHTML='<div class="bx"><h2>🆕 Mi újság?</h2><div class="v">KÖZPÉNZ ROYALE · verzió '+VER+'</div><ul>'+NEWS.map(n=>'<li>'+n+'</li>').join('')+'</ul><button>Rendben, játszunk!</button></div>';
 d.onclick=e=>{if(e.target===d||e.target.tagName==='BUTTON'){d.remove();LSs('k3Aver',VER)}};document.body.appendChild(d)}
X.news=()=>news(true);
setTimeout(()=>news(false),2500);
})();
