// kaszino4.js – 🎰 KASZINÓ PRÉMIUM+ (a kaszino3.js és a multiB.js után töltődik)
// - Kaszinó-főmenü kiegészítés: élő jackpot-szalag (a _x14d jackpotja), saját kaszinó-VIP szint (forgalom alapján),
//   statisztika-sáv, 4 új játékkártya: 🚀 CRASH, 🎯 KENÓ, 🂠 BACCARAT, 📊 STATISZTIKA
// - Minden tét a közös extra10 canBet/bet/pay-en megy → a napi veszteséghatár (k3x10lim) érvényes. Csak játékbeli zseton.
// - Hang: rövid WebAudio jelzések (némítható, k3k4mute). Mentés: k3k4 (statisztika, előzmények). Debug: _k4
(function(){
'use strict';
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n||0).toLocaleString('hu-HU');
const KX=()=>window._x10k;
const zs=()=>(window.BR&&BR.zs)|0;
const LSG=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const R=Math.random;
const ST=Object.assign({tot:0,won:0,n:0,big:0,g:{},crH:[],day:'',dn:0,dnet:0},LSG('k3k4',{}));
const save=()=>LSS('k3k4',ST);
let MUTE=LSG('k3k4mute',0);

// ---------- hang ----------
let AC=null;
function beep(f,d,t,v){if(MUTE)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'sine';o.frequency.value=f;
 let vol=(v||.12);try{const m=LSG('k3x50snd',null);if(m&&m.sfx!=null)vol*=+m.sfx>1?m.sfx/100:+m.sfx}catch(e){}
 g.gain.setValueAtTime(vol,AC.currentTime);g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const sWin=()=>[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.18,'triangle'),i*90));
const sLose=()=>{beep(220,.25,'sawtooth',.06);setTimeout(()=>beep(160,.3,'sawtooth',.05),140)};
const sTick=()=>beep(1200,.04,'square',.04);
const sChip=()=>beep(900+R()*300,.05,'triangle',.07);

// ---------- közös tét-kezelés (napi határ!) ----------
function today(){return new Date().toISOString().slice(0,10)}
function tryBet(b){const K=KX();if(!K)return'A kaszinó még töltődik…';const e=K.canBet(b);if(e)return e;K.bet(b);
 ST.tot+=b;if(ST.day!==today()){ST.day=today();ST.dn=0;ST.dnet=0}ST.dn++;ST.dnet-=b;save();return''}
function payOut(game,b,w){const K=KX();if(w>0&&K)K.pay(w);ST.n++;ST.won+=w;ST.dnet+=w;if(w-b>ST.big)ST.big=w-b;
 const g=ST.g[game]=ST.g[game]||{n:0,b:0,w:0,best:0};g.n++;g.b+=b;g.w+=w;if(w>g.best)g.best=w;save();jpAdd(b);if(w>b)sWin();else if(w<=0)sLose();if(w>=b*10&&w>=200)setTimeout(()=>jackpotFx(w,b),450)}
function jpAdd(b){try{const D=window._x14d&&_x14d.D;if(D){D.jp+=Math.ceil(b*.02)}}catch(e){}}
const jp=()=>{try{return window._x14d&&_x14d.D?_x14d.D.jp:0}catch(e){return 0}};

// ---------- VIP (kaszinó-forgalom) ----------
const VIP=[['Bronz',0,'#cd7f32'],['Ezüst',5000,'#d1d5db'],['Arany',25000,'#facc15'],['Platina',100000,'#a5f3fc'],['Gyémánt',400000,'#c4b5fd'],['Fekete Gyémánt',1500000,'#f0abfc']];
function vip(){let i=0;VIP.forEach((v,j)=>{if(ST.tot>=v[1])i=j});const n=VIP[i+1];return{i,v:VIP[i],next:n,pct:n?(ST.tot-VIP[i][1])/(n[1]-VIP[i][1]):1}}
function vipDaily(){const v=vip();if(!v.i)return;if(ST.vd===today())return;ST.vd=today();const b=[0,25,60,150,400,1000][v.i];if(window.BR){BR.zs+=b;try{KX().SV('k3br',BR)}catch(e){}}save();
 try{KX().toast('👑 '+v.v[0]+' VIP napi ajándék: +'+b+' zseton')}catch(e){}}

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
.k4jp{display:flex;align-items:center;gap:14px;margin:8px 0 10px;padding:8px 14px;border-radius:12px;border:1px solid #c9a64a;
 background:linear-gradient(90deg,#1a0f00,#3a2600 30%,#1a0f00 70%,#3a2600);background-size:200% 100%;animation:k4sh 6s linear infinite;box-shadow:inset 0 0 18px #000,0 0 14px #facc1533}
@keyframes k4sh{to{background-position:-200% 0}}
.k4jp b.v{font:900 26px Impact,Rajdhani;letter-spacing:2px;background:linear-gradient(#fff7cc,#facc15 55%,#b7791f);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 18px #facc1555}
.k4jp .vip{margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;font-size:12px;min-width:170px}
.k4jp .bar{width:170px;height:6px;border-radius:3px;background:#0008;overflow:hidden;margin-top:3px}.k4jp .bar i{display:block;height:100%;background:linear-gradient(90deg,#b7791f,#facc15)}
.k3card.k4card em.k4n{position:absolute;top:8px;left:8px;background:#dc2626;color:#fff;font:900 11px Rajdhani;padding:2px 7px;border-radius:6px;font-style:normal;box-shadow:0 0 10px #dc2626}
.k4w{font-family:Rajdhani,Arial;color:#fff}
.k4top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px}.k4top h2{margin:0;flex:1;background:linear-gradient(#fff7cc,#facc15);-webkit-background-clip:text;background-clip:text;color:transparent}
.k4b{padding:8px 14px;border-radius:10px;border:1px solid #c9a64a;background:linear-gradient(#3b2a0a,#1a1205);color:#fde68a;font:700 15px Rajdhani;cursor:pointer;transition:transform .1s,box-shadow .2s}
.k4b:hover{box-shadow:0 0 12px #facc1588;transform:translateY(-1px)}.k4b:disabled{opacity:.4;cursor:default;transform:none;box-shadow:none}
.k4b.go{background:linear-gradient(#22c55e,#15803d);color:#fff;border-color:#86efac;font-size:19px;padding:10px 26px}
.k4b.red{background:linear-gradient(#ef4444,#991b1b);color:#fff;border-color:#fca5a5}.k4b.on{background:linear-gradient(#facc15,#b7791f);color:#1a1205}
.k4chips{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.k4chip{width:46px;height:46px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font:900 13px Rajdhani;color:#fff;
 background:radial-gradient(circle,var(--c) 0 52%,#fff 53% 58%,var(--c) 59%);border:3px dashed #fff8;box-shadow:0 3px 0 #0008;transition:transform .15s}
.k4chip.sel{transform:translateY(-6px) scale(1.08);box-shadow:0 0 14px #facc15,0 6px 0 #0008}
.k4msg{min-height:28px;text-align:center;font:800 20px Rajdhani;margin:8px 0}.k4msg.w{color:#4ade80;text-shadow:0 0 12px #4ade80}.k4msg.l{color:#fca5a5}
.k4felt{border-radius:22px;padding:14px;background:radial-gradient(ellipse at 50% 30%,#1c8a4c,#08391f 80%);border:8px solid #4a2a10;box-shadow:inset 0 0 0 2px #c9a64a,inset 0 0 40px #0009,0 10px 30px #000a}
#k4crc{width:100%;max-width:760px;height:auto;display:block;margin:0 auto;border-radius:14px;border:2px solid #c9a64a;background:#07040f}
.k4hist{display:flex;gap:5px;flex-wrap:wrap;justify-content:center;margin:6px 0}.k4hist span{padding:2px 8px;border-radius:7px;font:700 13px Rajdhani;background:#0006}
.k4kg{display:grid;grid-template-columns:repeat(10,1fr);gap:6px;max-width:560px;margin:0 auto}
.k4kg button{aspect-ratio:1;border-radius:50%;border:2px solid #c9a64a66;background:radial-gradient(circle at 35% 30%,#3b2a5e,#140a24);color:#fde68a;font:800 16px Rajdhani;cursor:pointer;transition:transform .15s}
.k4kg button.p{background:radial-gradient(circle at 35% 30%,#fde68a,#b7791f);color:#1a1205;border-color:#fff}
.k4kg button.d{box-shadow:0 0 0 3px #22d3ee,0 0 14px #22d3ee;transform:scale(1.08)}.k4kg button.d.p{box-shadow:0 0 0 3px #4ade80,0 0 20px #4ade80;animation:k4pop .4s}
@keyframes k4pop{50%{transform:scale(1.3)}}
.k4pt{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;font-size:13px;margin:6px 0}.k4pt span{background:#0007;border:1px solid #c9a64a55;border-radius:6px;padding:2px 8px}
.k4bac{display:grid;grid-template-columns:1fr 1fr;gap:16px}.k4bac .side{text-align:center}.k4bac .side h3{margin:0 0 4px;font:900 20px Rajdhani;letter-spacing:2px}
.k4bac .cards{min-height:120px;display:flex;justify-content:center;flex-wrap:wrap}.k4bac .tot{font:900 30px Impact;color:#fde68a}
.k4bac .x10card{animation:k4deal .35s ease-out}@keyframes k4deal{from{transform:translate(0,-60px) rotate(-20deg);opacity:0}}
.k4spots{display:flex;gap:10px;justify-content:center;margin-top:10px;flex-wrap:wrap}.k4spot{min-width:150px;padding:10px;border-radius:14px;border:2px solid #fde68a88;background:#0004;cursor:pointer;text-align:center;font:800 17px Rajdhani}
.k4spot small{display:block;opacity:.7;font-size:12px}.k4spot b{color:#facc15}.k4spot.sel{background:#facc1533;border-color:#facc15;box-shadow:0 0 16px #facc1588}
.k4tbl{width:100%;border-collapse:collapse;font-size:15px}.k4tbl td,.k4tbl th{padding:6px 8px;border-bottom:1px solid #c9a64a33;text-align:right}.k4tbl td:first-child,.k4tbl th:first-child{text-align:left}
.k4tbl th{color:#fde68a}.k4kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:8px 0}.k4kpi div{background:#0006;border:1px solid #c9a64a55;border-radius:10px;padding:8px;text-align:center}
.k4kpi b{display:block;font:900 22px Impact;color:#fde68a}.k4kpi small{opacity:.7}
.k4vips{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.k4vips span{padding:4px 10px;border-radius:8px;border:1px solid;font-size:13px}
@media (max-width:700px){.k4jp{flex-wrap:wrap}.k4jp .vip{margin-left:0;align-items:flex-start}.k4kg{gap:3px}.k4kg button{font-size:12px}.k4bac{grid-template-columns:1fr}.k4kpi{grid-template-columns:repeat(2,1fr)}.k4spot{min-width:96px}.k4b.go{padding:10px 16px}}
`;document.head.appendChild(css);

// ---------- ablak ----------
function openX(h){const M=$('x10M'),B=$('x10MB');if(!M||!B)return null;B.innerHTML='<div class="k4w">'+h+'</div>';M.style.display='flex';B.classList.add('k3wide');if(document.pointerLockElement)document.exitPointerLock();
 B.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{stopAll();window.x10cas&&x10cas()});return B}
function top(t){return'<div class="k4top"><h2>'+t+'</h2><span>🪙 <b data-k3="zs">'+fmt(zs())+'</b></span><span>⛔ ma: <b data-k3="lim">∞</b></span><button class="k4b" id="k4mu">'+(MUTE?'🔇':'🔊')+'</button><button class="k4b" data-back="1">◀ KASZINÓ</button></div>'}
function wireTop(B){const m=B.querySelector('#k4mu');if(m)m.onclick=()=>{MUTE=MUTE?0:1;LSS('k3k4mute',MUTE);m.textContent=MUTE?'🔇':'🔊'}}
const CC={10:'#2563eb',25:'#16a34a',50:'#dc2626',100:'#111827',250:'#9333ea',500:'#ea580c'};
function chips(sel,id){return'<div class="k4chips" id="'+id+'"><span style="opacity:.7">TÉT:</span>'+[10,25,50,100,250,500].map(v=>'<div class="k4chip'+(v===sel?' sel':'')+'" data-v="'+v+'" style="--c:'+CC[v]+'">'+v+'</div>').join('')+'</div>'}
function wireChips(B,id,cb){const c=B.querySelector('#'+id);if(!c)return;c.onclick=e=>{const d=e.target.closest('[data-v]');if(!d)return;c.querySelectorAll('.k4chip').forEach(x=>x.classList.toggle('sel',x===d));sChip();cb(+d.dataset.v)}}
function msg(t,c){const m=$('k4msg');if(m){m.textContent=t;m.className='k4msg '+(c||'')}}
let RAF=0,TMS=[];function stopAll(){cancelAnimationFrame(RAF);TMS.forEach(clearTimeout);TMS=[];if(CR.st==='run')crCash(true)}
const later=(f,ms)=>TMS.push(setTimeout(f,ms));

// =====================================================================
// 🚀 CRASH
// =====================================================================
const CR={bet:50,auto:0,st:'idle',m:1,cp:1,t0:0,pts:[],gen:0,ex:[]};
function crashPoint(){const u=R();return Math.max(1,Math.min(250,Math.floor(97/(1-u))/100))} // ~3% ház-előny
function crash(){stopAll();CR.st='idle';const B=openX(top('🚀 CRASH – KÖZPÉNZ RAKÉTA')+
 '<canvas id="k4crc" width="760" height="320"></canvas><div class="k4hist" id="k4crh"></div><div class="k4msg" id="k4msg">Tégy tétet, és szállj ki, mielőtt a rakéta felrobban!</div>'+
 '<div style="display:flex;gap:12px;align-items:center;justify-content:center;flex-wrap:wrap">'+chips(CR.bet,'k4crch')+
 '<label style="font-size:14px">Auto-kiszállás ×<select id="k4cra" class="k4b">'+[0,1.5,2,3,5,10].map(v=>'<option value="'+v+'"'+(CR.auto===v?' selected':'')+'>'+(v||'ki')+'</option>').join('')+'</select></label>'+
 '<button class="k4b go" id="k4crb">🚀 INDÍTÁS</button></div>');if(!B)return;wireTop(B);
 wireChips(B,'k4crch',v=>CR.bet=v);$('k4cra').onchange=e=>CR.auto=+e.target.value;$('k4crb').onclick=()=>CR.st==='run'?crCash():crGo();crHist();crDraw()}
function crHist(){const h=$('k4crh');if(h)h.innerHTML=ST.crH.slice(-14).map(v=>'<span style="color:'+(v>=2?'#4ade80':v>=1.3?'#fde68a':'#f87171')+'">×'+v.toFixed(2)+'</span>').join('')}
function crGo(){const e=tryBet(CR.bet);if(e){msg(e,'l');return}cancelAnimationFrame(RAF);const gen=++CR.gen;CR.cp=crashPoint();CR.st='run';CR.m=1;CR.t0=performance.now();CR.pts=[];CR.out=0;CR.ex=[];
 $('k4crb').textContent='💰 KISZÁLLOK';$('k4crb').className='k4b red';msg('Repül… ×1.00');beep(300,.3,'sawtooth',.05);let lastT=0;
 const step=()=>{if(CR.st!=='run'||gen!==CR.gen)return;if(!$('k4crc')){crCash(true);return}const t=(performance.now()-CR.t0)/1000;CR.m=Math.exp(.12*t);
  if(t-lastT>.5){lastT=t;sTick()}
  if(CR.auto&&CR.m>=CR.auto&&CR.auto<=CR.cp){CR.m=CR.auto;CR.pts.push([t,CR.m]);crCash();return}
  if(CR.m>=CR.cp){CR.m=CR.cp;CR.pts.push([Math.log(CR.cp)/.12,CR.m]);crBoom();return}CR.pts.push([t,CR.m]);msg('Repül… ×'+CR.m.toFixed(2)+' → '+fmt(CR.bet*CR.m)+' 🪙');crDraw();RAF=requestAnimationFrame(step)};RAF=requestAnimationFrame(step)}
function crEnd(){ST.crH.push(CR.cp);if(ST.crH.length>40)ST.crH.shift();save();CR.st='idle';const b=$('k4crb');if(b){b.textContent='🚀 ÚJRA';b.className='k4b go'}crHist()}
function crCash(silent){if(CR.st!=='run')return;cancelAnimationFrame(RAF);const w=Math.floor(CR.bet*CR.m);payOut('crash',CR.bet,w);CR.out=CR.m;
 if(!silent){msg('✅ Kiszálltál ×'+CR.m.toFixed(2)+' → +'+fmt(w)+' 🪙 (a rakéta ×'+CR.cp.toFixed(2)+'-nél robbant volna)','w')}
 crEnd();if(silent)return;
 // a rakéta repül tovább a robbanásig (csak látvány) – a görbe is folytatódik; új kör (gen) azonnal leállítja
 const gen=CR.gen;let t=CR.pts.length?CR.pts[CR.pts.length-1][0]:0;let last=performance.now();
 const fly=()=>{if(!$('k4crc')||gen!==CR.gen||CR.st==='run')return;const n=performance.now();t+=(n-last)/1000*2.2;last=n;const m=Math.exp(.12*t);
  if(m>=CR.cp){CR.m=CR.cp;CR.pts.push([Math.log(CR.cp)/.12,CR.cp]);crExplode(gen);return}CR.m=m;CR.pts.push([t,m]);crDraw();RAF=requestAnimationFrame(fly)};RAF=requestAnimationFrame(fly)}
function crBoom(){payOut('crash',CR.bet,0);msg('💥 BUMM ×'+CR.cp.toFixed(2)+' – elveszett: '+fmt(CR.bet)+' 🪙','l');crEnd();beep(80,.6,'sawtooth',.15);crExplode(CR.gen)}
// robbanás-animáció (részecskék + lökéshullám), ~1,4 mp
function crExplode(gen){if(!$('k4crc'))return;CR.ex=[];const t0=performance.now();
 const go=()=>{if(!$('k4crc')||gen!==CR.gen||CR.st==='run')return;const el=(performance.now()-t0)/1000;crDraw(true,Math.min(1.4,el));if(el<1.4)RAF=requestAnimationFrame(go)};RAF=requestAnimationFrame(go)}
// rajzolt rakéta (nem emoji → minden gépen látszik)
function rocket(x,X,Y,ang,fl){x.save();x.translate(X,Y);x.rotate(ang);
 const L=18+fl*14;const g=x.createLinearGradient(-14-L,0,-14,0);g.addColorStop(0,'rgba(239,68,68,0)');g.addColorStop(.5,'#f97316cc');g.addColorStop(1,'#fde047');x.fillStyle=g;
 x.beginPath();x.moveTo(-14,-6);x.quadraticCurveTo(-14-L*.6,-3-fl*3,-14-L,0);x.quadraticCurveTo(-14-L*.6,3+fl*3,-14,6);x.fill();
 const b=x.createLinearGradient(0,-9,0,9);b.addColorStop(0,'#f8fafc');b.addColorStop(.5,'#cbd5e1');b.addColorStop(1,'#64748b');x.fillStyle=b;
 x.beginPath();x.moveTo(20,0);x.quadraticCurveTo(10,-10,-14,-8);x.lineTo(-14,8);x.quadraticCurveTo(10,10,20,0);x.fill();
 x.fillStyle='#dc2626';x.beginPath();x.moveTo(-6,-8);x.lineTo(-16,-16);x.lineTo(-14,-7);x.fill();x.beginPath();x.moveTo(-6,8);x.lineTo(-16,16);x.lineTo(-14,7);x.fill();
 x.beginPath();x.moveTo(20,0);x.quadraticCurveTo(15,-5,11,-6);x.lineTo(11,6);x.quadraticCurveTo(15,5,20,0);x.fill();
 x.fillStyle='#38bdf8';x.strokeStyle='#0f172a';x.lineWidth=1.5;x.beginPath();x.arc(4,0,3.6,0,7);x.fill();x.stroke();x.restore()}
function crDraw(boom,ex){const c=$('k4crc');if(!c)return;const x=c.getContext('2d'),W=c.width,H=c.height;
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1e0b3a');g.addColorStop(1,'#07040f');x.fillStyle=g;x.fillRect(0,0,W,H);
 const sc=CR.st==='run'?(performance.now()/40)%W:0;for(let i=0;i<46;i++){x.fillStyle='#ffffff'+(i%3?'22':'66');x.fillRect(((i*137)-sc*(1+i%3)*.3+W*4)%W,(i*71)%H,2,2)}
 const maxT=Math.max(8,(CR.pts.length?CR.pts[CR.pts.length-1][0]:0)*1.15),maxM=Math.max(2,CR.m*1.2);
 const px=t=>40+t/maxT*(W-70),py=m=>H-30-(m-1)/(maxM-1)*(H-60);
 x.strokeStyle='#c9a64a33';x.fillStyle='#fde68a99';x.font='12px Rajdhani';for(let i=0;i<=4;i++){const m=1+(maxM-1)*i/4,y=py(m);x.beginPath();x.moveTo(40,y);x.lineTo(W-20,y);x.stroke();x.fillText('×'+m.toFixed(1),4,y+4)}
 if(CR.out){const y=py(CR.out);x.setLineDash([6,6]);x.strokeStyle='#4ade80aa';x.beginPath();x.moveTo(40,y);x.lineTo(W-20,y);x.stroke();x.setLineDash([])}
 if(CR.pts.length){x.beginPath();x.moveTo(px(0),py(1));CR.pts.forEach(p=>x.lineTo(px(p[0]),py(p[1])));const last=CR.pts[CR.pts.length-1];
  x.lineWidth=4;x.strokeStyle=boom?'#ef4444':'#facc15';x.shadowColor=x.strokeStyle;x.shadowBlur=14;x.stroke();x.shadowBlur=0;
  x.lineTo(px(last[0]),H-30);x.lineTo(px(0),H-30);x.fillStyle=boom?'#ef444422':'#facc1522';x.fill();
  const X=px(last[0]),Y=py(last[1]);
  if(!boom){const pr=CR.pts[Math.max(0,CR.pts.length-6)];const ang=Math.atan2(Y-py(pr[1]),X-px(pr[0]))||-.3;rocket(x,X,Y,Math.min(-.15,ang),.5+.5*Math.sin(performance.now()/40))}
  else{const e=ex==null?1.4:ex;
   if(!CR.ex.length)for(let i=0;i<70;i++){const a=R()*6.283,v=60+R()*260;CR.ex.push([Math.cos(a)*v,Math.sin(a)*v,['#fde047','#f97316','#ef4444','#fff'][i%4],2+R()*4])}
   x.globalCompositeOperation='lighter';
   x.strokeStyle='rgba(253,224,71,'+Math.max(0,.8-e*.6)+')';x.lineWidth=6*(1-e/1.4)+1;x.beginPath();x.arc(X,Y,e*220,0,7);x.stroke();
   const fg=x.createRadialGradient(X,Y,0,X,Y,90);fg.addColorStop(0,'rgba(255,240,180,'+Math.max(0,1-e)+')');fg.addColorStop(1,'rgba(239,68,68,0)');x.fillStyle=fg;x.beginPath();x.arc(X,Y,90,0,7);x.fill();
   CR.ex.forEach(p=>{const k=Math.max(0,1-e/1.4);x.globalAlpha=k;x.fillStyle=p[2];x.beginPath();x.arc(X+p[0]*e,Y+p[1]*e+60*e*e,p[3]*k+.5,0,7);x.fill()});x.globalAlpha=1;x.globalCompositeOperation='source-over';
   if(e>=1.3){x.font='bold 26px Impact';x.textAlign='center';x.fillStyle='#ef4444';x.fillText('💥 BUMM',X,Math.max(30,Y+6))}}
  x.textAlign='left'}
 x.font='900 54px Impact';x.textAlign='center';x.fillStyle=boom?'#ef4444':CR.st==='run'?'#fde68a':'#fff';x.shadowColor='#000';x.shadowBlur=10;x.fillText('×'+CR.m.toFixed(2),W/2,90);x.shadowBlur=0;
 if(CR.out){x.font='700 18px Rajdhani';x.fillStyle='#4ade80';x.fillText('kiszálltál: ×'+CR.out.toFixed(2),W/2,118)}x.textAlign='left'}

// =====================================================================
// 🎯 KENÓ (40 számból 10 húzás, 1–8 tipp)
// =====================================================================
const KE={bet:50,pick:[],drawn:[],busy:false};
const Cn=(n,k)=>{if(k<0||k>n)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r};
function kenoPay(p){const tot=Cn(40,p),m=Math.ceil((p+1)/2),out={};let ws=0;for(let h=m;h<=p;h++)ws+=(h-m+1)*(h-m+1);
 for(let h=m;h<=p;h++){const P=Cn(10,h)*Cn(30,p-h)/tot;out[h]=Math.max(1,Math.round(.93*((h-m+1)*(h-m+1)/ws)/P*10)/10)}return out}
function keno(){stopAll();KE.drawn=[];KE.busy=false;const B=openX(top('🎯 KENÓ')+
 '<div class="k4felt"><div class="k4kg" id="k4kg">'+Array.from({length:40},(_,i)=>'<button data-n="'+(i+1)+'">'+(i+1)+'</button>').join('')+'</div>'+
 '<div class="k4pt" id="k4kp"></div></div><div class="k4msg" id="k4msg">Válassz 1–8 számot! 10 számot húzunk 40-ből.</div>'+
 '<div style="display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap">'+chips(KE.bet,'k4kch')+'<button class="k4b" id="k4kq">🎲 GYORS TIPP</button><button class="k4b" id="k4kc">TÖRLÉS</button><button class="k4b go" id="k4kd">HÚZÁS</button></div>');
 if(!B)return;wireTop(B);wireChips(B,'k4kch',v=>{KE.bet=v;kRender()});
 $('k4kg').onclick=e=>{const b=e.target.closest('[data-n]');if(!b||KE.busy)return;const n=+b.dataset.n,i=KE.pick.indexOf(n);if(KE.drawn.length){KE.drawn=[]}
  if(i>=0)KE.pick.splice(i,1);else if(KE.pick.length<8)KE.pick.push(n);sChip();kRender()};
 $('k4kq').onclick=()=>{if(KE.busy)return;KE.drawn=[];KE.pick=[];while(KE.pick.length<5){const n=1+(R()*40|0);if(!KE.pick.includes(n))KE.pick.push(n)}kRender()};
 $('k4kc').onclick=()=>{if(KE.busy)return;KE.pick=[];KE.drawn=[];kRender()};$('k4kd').onclick=kDraw;kRender()}
function kRender(){const g=$('k4kg');if(!g)return;g.querySelectorAll('button').forEach(b=>{const n=+b.dataset.n;b.classList.toggle('p',KE.pick.includes(n));b.classList.toggle('d',KE.drawn.includes(n))});
 const p=KE.pick.length,pt=p?kenoPay(p):{};$('k4kp').innerHTML=p?'<span>'+p+' tipp</span>'+Object.keys(pt).map(h=>'<span>'+h+' talált: <b style="color:#facc15">×'+pt[h]+'</b> = '+fmt(pt[h]*KE.bet)+'</span>').join(''):'<span>Jelölj ki számokat a kifizetési táblához</span>'}
function kDraw(){if(KE.busy)return;const p=KE.pick.length;if(!p){msg('Előbb válassz számokat!','l');return}const e=tryBet(KE.bet);if(e){msg(e,'l');return}
 KE.busy=true;KE.drawn=[];const pool=Array.from({length:40},(_,i)=>i+1);const draw=[];for(let i=0;i<10;i++)draw.push(pool.splice(R()*pool.length|0,1)[0]);
 msg('Húzás…');kRender();draw.forEach((n,i)=>later(()=>ballFly(n,()=>{KE.drawn.push(n);kRender();KE.pick.includes(n)?beep(880+i*40,.15,'triangle'):sTick();
  if(i===9){const h=KE.pick.filter(x=>KE.drawn.includes(x)).length,m=kenoPay(p)[h]||0,w=Math.floor(m*KE.bet);payOut('keno',KE.bet,w);KE.busy=false;
   msg(h+' találat'+(w?' → ×'+m+' = +'+fmt(w)+' 🪙':' – most nem nyert'),w?'w':'l')}}),300+i*380))}

// =====================================================================
// 🂠 BACCARAT (Játékos 1:1, Bankár 0,95:1, Döntetlen 8:1)
// =====================================================================
const BA={bet:50,side:'p',busy:false};
const RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'],SU=['♠','♥','♦','♣'];
const card=()=>({r:R()*13|0,s:R()*4|0});const val=c=>c.r>=9?0:c.r+1;const tot=h=>h.reduce((a,c)=>a+val(c),0)%10;
const cHTML=c=>'<div class="x10card '+(c.s===1||c.s===2?'r':'')+'">'+RK[c.r]+'<span>'+SU[c.s]+'</span></div>';
function bac(){stopAll();BA.busy=false;const B=openX(top('🂠 BACCARAT – PUNTO BANCO')+
 '<div class="k4felt"><div class="k4bac"><div class="side"><h3 style="color:#93c5fd">JÁTÉKOS</h3><div class="cards" id="k4bp"></div><div class="tot" id="k4bpt">–</div></div>'+
 '<div class="side"><h3 style="color:#fca5a5">BANKÁR</h3><div class="cards" id="k4bb"></div><div class="tot" id="k4bbt">–</div></div></div>'+
 '<div class="k4spots" id="k4bs">'+[['p','JÁTÉKOS','1:1'],['t','DÖNTETLEN','8:1'],['b','BANKÁR','0,95:1']].map(s=>'<div class="k4spot'+(BA.side===s[0]?' sel':'')+'" data-s="'+s[0]+'">'+s[1]+'<small>fizet '+s[2]+'</small></div>').join('')+'</div></div>'+
 '<div class="k4msg" id="k4msg">Válaszd ki, ki nyer: Játékos, Bankár vagy Döntetlen. A 9-hez legközelebbi nyer.</div>'+
 '<div style="display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap">'+chips(BA.bet,'k4bch')+'<button class="k4b go" id="k4bd">OSZTÁS</button></div>');
 if(!B)return;wireTop(B);wireChips(B,'k4bch',v=>BA.bet=v);
 $('k4bs').onclick=e=>{const s=e.target.closest('[data-s]');if(!s||BA.busy)return;BA.side=s.dataset.s;$('k4bs').querySelectorAll('.k4spot').forEach(x=>x.classList.toggle('sel',x===s));sChip()};$('k4bd').onclick=bDeal}
function bDeal(){if(BA.busy)return;const e=tryBet(BA.bet);if(e){msg(e,'l');return}BA.busy=true;const P=[card(),card()],Bk=[card(),card()];
 let pt=tot(P),bt=tot(Bk),p3=null;if(pt<8&&bt<8){if(pt<=5){p3=card();P.push(p3)}
  const v=p3?val(p3):-1,draw=!p3?bt<=5:bt<=2||(bt===3&&v!==8)||(bt===4&&v>=2&&v<=7)||(bt===5&&v>=4&&v<=7)||(bt===6&&(v===6||v===7));if(draw)Bk.push(card())}
 const seq=[['p',P[0]],['b',Bk[0]],['p',P[1]],['b',Bk[1]]];if(P[2])seq.push(['p',P[2]]);if(Bk[2])seq.push(['b',Bk[2]]);
 $('k4bp').innerHTML='';$('k4bb').innerHTML='';$('k4bpt').textContent='–';$('k4bbt').textContent='–';msg('Osztás…');const sh={p:[],b:[]};
 seq.forEach((s,i)=>later(()=>{sh[s[0]].push(s[1]);const el=$(s[0]==='p'?'k4bp':'k4bb');if(!el)return;el.insertAdjacentHTML('beforeend',cHTML(s[1]));dealFx(el.lastElementChild);
  $(s[0]==='p'?'k4bpt':'k4bbt').textContent=tot(sh[s[0]]);beep(600,.06,'triangle',.08);
  if(i===seq.length-1){pt=tot(P);bt=tot(Bk);const res=pt>bt?'p':bt>pt?'b':'t';let w=0;
   if(res==='t')w=BA.side==='t'?BA.bet*9:BA.bet;else if(res===BA.side)w=res==='p'?BA.bet*2:Math.floor(BA.bet*1.95);
   payOut('bac',BA.bet,w);BA.busy=false;const nm={p:'JÁTÉKOS',b:'BANKÁR',t:'DÖNTETLEN'}[res];
   msg(nm+' ('+pt+' : '+bt+') – '+(w>BA.bet?'NYERTÉL +'+fmt(w)+' 🪙':w===BA.bet?'tét visszajár':'vesztettél'),w>=BA.bet?'w':'l')}},350+i*550))}

// =====================================================================
// 📊 STATISZTIKA & VIP
// =====================================================================
const GN={crash:'🚀 Crash',keno:'🎯 Kenó',bac:'🂠 Baccarat'};
function stats(){stopAll();vipDaily();const v=vip(),n=ST.n||0,rtp=ST.tot?ST.won/ST.tot*100:0;let K={};try{K=KX().stat?{}:{}}catch(e){}
 const B=openX(top('📊 STATISZTIKA & 👑 KASZINÓ-VIP')+
 '<div class="k4kpi"><div><small>Játszott kör</small><b>'+fmt(n)+'</b></div><div><small>Összes tét</small><b>'+fmt(ST.tot)+'</b></div><div><small>Visszanyert</small><b>'+rtp.toFixed(1)+'%</b></div><div><small>Legnagyobb nyeremény</small><b>'+fmt(ST.big)+'</b></div></div>'+
 '<div style="margin:6px 0">Ma: <b>'+(ST.day===today()?ST.dn:0)+'</b> tét · nettó: <b style="color:'+((ST.day===today()?ST.dnet:0)>=0?'#4ade80':'#f87171')+'">'+fmt(ST.day===today()?ST.dnet:0)+' 🪙</b></div>'+
 '<table class="k4tbl"><tr><th>Játék</th><th>Kör</th><th>Tét</th><th>Nyeremény</th><th>Legjobb</th></tr>'+Object.keys(GN).map(k=>{const g=ST.g[k]||{n:0,b:0,w:0,best:0};return'<tr><td>'+GN[k]+'</td><td>'+fmt(g.n)+'</td><td>'+fmt(g.b)+'</td><td>'+fmt(g.w)+'</td><td>'+fmt(g.best)+'</td></tr>'}).join('')+'</table>'+
 '<h3 style="color:'+v.v[2]+';margin:14px 0 4px">👑 '+v.v[0]+' VIP</h3><div style="font-size:14px;opacity:.85">A szinted a Crash/Kenó/Baccarat forgalmadból nő. Minden szint napi zseton-ajándékot ad (automatikusan, a kaszinó megnyitásakor).</div>'+
 '<div class="k4vips">'+VIP.map((x,i)=>'<span style="border-color:'+x[2]+';color:'+x[2]+(i===v.i?';background:'+x[2]+'22;font-weight:800':'')+'">'+x[0]+' · '+fmt(x[1])+' · +'+[0,25,60,150,400,1000][i]+'/nap</span>').join('')+'</div>'+
 (v.next?'<div style="font-size:13px">Következő: <b>'+v.next[0]+'</b> – még '+fmt(v.next[1]-ST.tot)+' zseton forgalom</div>':'<div>Elérted a legmagasabb szintet! 🎉</div>')+
 '<div class="k4msg" style="font-size:13px;opacity:.7">Felelős játék: a napi veszteséghatár minden új játékra is érvényes. Csak játékbeli zseton.</div>');if(B)wireTop(B)}

// =====================================================================
// FŐMENÜ-KIEGÉSZÍTÉS (MutationObserver: a kaszino3 lobby() bármikor újrarajzolhat)
// =====================================================================
const PV={};
function pv(id,fn){if(PV[id])return PV[id];const c=document.createElement('canvas');c.width=320;c.height=180;const x=c.getContext('2d');
 const g=x.createRadialGradient(160,60,10,160,90,240);g.addColorStop(0,'#3b1d5e');g.addColorStop(1,'#0b0614');x.fillStyle=g;x.fillRect(0,0,320,180);try{fn(x)}catch(e){}return PV[id]=c.toDataURL('image/jpeg',.82)}
const PVF={
 crash:x=>{x.strokeStyle='#facc15';x.lineWidth=5;x.shadowColor='#facc15';x.shadowBlur=12;x.beginPath();x.moveTo(30,160);for(let i=0;i<=26;i++)x.lineTo(30+i*9,160-Math.pow(i/26,2.2)*120);x.stroke();x.shadowBlur=0;x.font='36px serif';x.fillText('🚀',236,46);x.fillStyle='#fde68a';x.font='900 34px Impact';x.fillText('×4.20',40,60)},
 keno:x=>{for(let i=0;i<20;i++){const X=40+(i%10)*27,Y=55+(i/10|0)*40,hit=[2,5,9,13,17].includes(i);x.fillStyle=hit?'#facc15':'#3b2a5e';x.beginPath();x.arc(X,Y,12,0,7);x.fill();x.fillStyle=hit?'#1a1205':'#fde68a';x.font='bold 11px Rajdhani';x.textAlign='center';x.textBaseline='middle';x.fillText(i+1,X,Y)}x.fillStyle='#fde68a';x.font='900 22px Impact';x.textAlign='center';x.fillText('KENÓ 10/40',160,150)},
 bac:x=>{const g=x.createRadialGradient(160,90,10,160,90,200);g.addColorStop(0,'#1c8a4c');g.addColorStop(1,'#08391f');x.fillStyle=g;x.beginPath();x.ellipse(160,95,150,78,0,0,7);x.fill();x.lineWidth=6;x.strokeStyle='#4a2a10';x.stroke();
  [[110,'9','♦',-.1],[140,'K','♠',.08],[200,'7','♥',-.06],[230,'Q','♣',.1]].forEach(([X,r,s,a])=>{x.save();x.translate(X,90);x.rotate(a);x.fillStyle='#fffdf7';x.fillRect(-18,-26,36,52);x.fillStyle=/[♥♦]/.test(s)?'#c81e1e':'#111';x.font='bold 13px Georgia';x.fillText(r,-15,-12);x.font='22px serif';x.textAlign='center';x.fillText(s,0,12);x.restore()});
  x.fillStyle='#fde68a';x.font='900 18px Impact';x.textAlign='center';x.fillText('JÁTÉKOS  9 : 7  BANKÁR',160,155)},
 stat:x=>{[40,70,55,95,80,120,105].forEach((h,i)=>{const g=x.createLinearGradient(0,160-h,0,160);g.addColorStop(0,'#facc15');g.addColorStop(1,'#b7791f');x.fillStyle=g;x.fillRect(50+i*32,160-h,22,h)});x.font='42px serif';x.fillText('👑',246,56)}};
const NEW=[['crash','🚀 Crash','szállj ki időben!',crash],['keno','🎯 Kenó','1–8 tipp, 10 húzás',keno],['bac','🂠 Baccarat','Játékos / Bankár',bac],['stat','📊 Statisztika','VIP-szint, rekordok',stats]];
function enhance(){const B=$('x10MB');if(!B)return;const grid=B.querySelector('.k3grid');if(!grid||grid._k4)return;grid._k4=1;vipDaily();
 const v=vip(),bar=document.createElement('div');bar.className='k4jp';
 bar.innerHTML='<span style="font-size:28px">💎</span><div><div style="font-size:12px;opacity:.8;letter-spacing:2px">PROGRESSZÍV JACKPOT</div><b class="v" id="k4jpv">'+fmt(jp())+'</b> <span style="opacity:.7">zseton</span></div>'+
  '<div class="vip"><span>👑 <b style="color:'+v.v[2]+'">'+v.v[0]+' VIP</b>'+(v.next?' → '+v.next[0]:'')+'</span><div class="bar"><i style="width:'+Math.round(v.pct*100)+'%"></i></div><span style="opacity:.7">ma: '+(ST.day===today()?ST.dn:0)+' kör · rekord: '+fmt(ST.big)+'</span></div>';
 const bal=B.querySelector('.k3bal');(bal||grid).parentNode.insertBefore(bar,bal?bal.nextSibling:grid);
 NEW.forEach(([id,n,s,fn])=>{const d=document.createElement('div');d.className='k3card k4card';d.innerHTML='<img alt="" src="'+pv(id,PVF[id])+'"><div>'+n+'<small>'+s+'</small></div>'+(id!=='stat'?'<em class="k4n">ÚJ</em>':'');
  d.onclick=()=>{try{window._k2&&_k2.ac&&_k2.ac()}catch(e){}fn()};grid.appendChild(d)})}
let jpT=0;setInterval(()=>{const e=$('k4jpv');if(!e)return;const t=jp();jpT+=(t-jpT)*.25;if(Math.abs(t-jpT)<1)jpT=t;const s=fmt(jpT);if(e.textContent!==s)e.textContent=s},200);
function hook(){const B=$('x10MB');if(!B){setTimeout(hook,1000);return}new MutationObserver(()=>enhance()).observe(B,{childList:true});enhance()}
hook();
// ha bezárják az ablakot futó crash közben → automatikus kiszállás a pillanatnyi szorzón
{const o=window.x10close;if(o)window.x10close=function(){try{stopAll()}catch(e){}return o.apply(this,arguments)}}

// =====================================================================
// ✨ ANIMÁCIÓK (k4 FX): zseton-repülés, jackpot-ünneplés, kenó-golyó, baccarat-lapfordítás, lottó-gép
// =====================================================================
const fxCss=document.createElement('style');fxCss.textContent=`
#k4fx{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
.k4fchip{position:fixed;left:0;top:0;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;pointer-events:none;z-index:2147483001;
 background:radial-gradient(circle,var(--c) 0 50%,#fff 51% 57%,var(--c) 58%);border:2px dashed #fffa;box-shadow:0 2px 6px #000a,0 0 10px var(--c);will-change:transform}
.k4bump{animation:k4bump .35s}@keyframes k4bump{40%{transform:scale(1.35);filter:brightness(1.8) drop-shadow(0 0 8px #facc15)}}
.k4plus{position:fixed;pointer-events:none;z-index:2147483002;font:900 22px Impact,Rajdhani;color:#4ade80;text-shadow:0 0 10px #4ade80,0 2px 0 #000;animation:k4plus 1.2s ease-out forwards}
@keyframes k4plus{from{transform:translate(-50%,0) scale(.6);opacity:0}20%{opacity:1;transform:translate(-50%,-10px) scale(1.15)}to{transform:translate(-50%,-50px) scale(1);opacity:0}}
.k4ball{position:fixed;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;pointer-events:none;z-index:2147483001;display:flex;align-items:center;justify-content:center;
 font:900 16px Rajdhani;color:#1a1205;background:radial-gradient(circle at 35% 30%,#fff,#facc15 55%,#b7791f);box-shadow:0 4px 10px #000a,0 0 16px #facc15aa}
.k4bac .x10card{animation:none!important;backface-visibility:hidden}
.k4lotw{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;margin:8px 0}
#k4lotc{width:260px;height:230px;flex:none}
.k4tray{display:flex;gap:6px;min-height:46px;align-items:center;flex-wrap:wrap;max-width:300px}
.k4tray span{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:900 17px Rajdhani;color:#1a1205;box-shadow:0 3px 8px #000a;animation:k4tin .5s cubic-bezier(.3,1.6,.5,1)}
@keyframes k4tin{from{transform:translateY(-60px) scale(.3);opacity:0}}
.k4lotinfo{font:700 14px Rajdhani;color:#fde68a;text-align:center}
`;document.head.appendChild(fxCss);
let FXC=null,FXX=null,FXP=[],FXR=0;
function fxCanvas(){if(!FXC){FXC=document.createElement('canvas');FXC.id='k4fx';document.body.appendChild(FXC);FXX=FXC.getContext('2d')}
 if(FXC.width!==innerWidth||FXC.height!==innerHeight){FXC.width=innerWidth;FXC.height=innerHeight}return FXX}
function visEl(sel){return[...document.querySelectorAll(sel)].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&r.top>=0&&r.top<innerHeight})}
function ctr(el){const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]}
// 1) ZSETON-REPÜLÉS: nyereménykor zsetonok ívben repülnek a forrásból az egyenlegre
function chipFly(w,from){try{if(!(w>0))return;const src=from||visEl('#k4msg')||visEl('#x10sres')||visEl('#k3rMsg')||visEl('#x10MB h2')||visEl('#x14dP h2');
 const tgt=visEl('#x10MB [data-k3="zs"]')||visEl('#x20MB [data-k3="zs"]')||visEl('[data-k3="zs"]');
 const [sx,sy]=src?ctr(src):[innerWidth/2,innerHeight/2];const [tx,ty]=tgt?ctr(tgt):[innerWidth-260,30];
 const n=Math.max(4,Math.min(22,Math.round(Math.log10(w+1)*5)));const cols=['#dc2626','#16a34a','#2563eb','#111827','#9333ea','#f59e0b'];
 for(let i=0;i<n;i++){const d=document.createElement('div');d.className='k4fchip';d.style.setProperty('--c',cols[i%cols.length]);document.body.appendChild(d);
  const ox=(R()-.5)*80,oy=(R()-.5)*30,mx=(sx+tx)/2+(R()-.5)*160,my=Math.min(sy,ty)-80-R()*120;
  const kf=[];for(let k=0;k<=12;k++){const u=k/12,a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u;kf.push({transform:'translate('+(a*(sx+ox)+b*mx+c*tx)+'px,'+(a*(sy+oy)+b*my+c*ty)+'px) rotate('+(u*540)+'deg) scale('+(1-u*.45)+')',opacity:k===12?.2:1})}
  const an=d.animate(kf,{duration:650+R()*250,delay:i*45,easing:'cubic-bezier(.45,0,.6,1)',fill:'both'});
  an.onfinish=()=>{d.remove();if(tgt){tgt.classList.remove('k4bump');void tgt.offsetWidth;tgt.classList.add('k4bump')}if(i%2===0)beep(1400+R()*500,.04,'triangle',.05)}}
 const p=document.createElement('div');p.className='k4plus';p.textContent='+'+fmt(w)+' 🪙';p.style.left=sx+'px';p.style.top=(sy-20)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),1300)}catch(e){}}
// 2) JACKPOT-ÜNNEPLÉS: forgó fénysugarak, arany konfetti, felszálló számláló (kattintásra átugorható)
function jackpotFx(w,b,label){try{const x=fxCanvas();FXC.style.pointerEvents='auto';FXC.style.cursor='pointer';cancelAnimationFrame(FXR);
 const W=FXC.width,H=FXC.height,t0=performance.now(),DUR=4200;FXP=[];let done=false;
 for(let i=0;i<160;i++)FXP.push({x:W/2,y:H*.55,vx:(R()-.5)*16,vy:-6-R()*14,r:R()*6.3,vr:(R()-.5)*.3,s:5+R()*7,c:['#facc15','#fde68a','#f59e0b','#fff','#f0abfc','#4ade80'][i%6],d:R()*600});
 [523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>beep(f,.35,'triangle',.1),i*110));setTimeout(()=>[1047,1319,1568].forEach(f=>beep(f,.6,'sine',.07)),700);
 const end=()=>{if(done)return;done=true;cancelAnimationFrame(FXR);x.clearRect(0,0,W,H);FXC.style.pointerEvents='none';FXC.onclick=null};FXC.onclick=end;
 const tt=label||(w>=b*50?'💎 JACKPOT!':w>=b*20?'MEGA NYEREMÉNY!':'NAGY NYEREMÉNY!');
 const fr=()=>{const el=performance.now()-t0;if(el>DUR){end();return}const fade=el>DUR-600?(DUR-el)/600:1;x.clearRect(0,0,W,H);
  x.globalAlpha=Math.min(1,el/250)*.72*fade;x.fillStyle='#07020f';x.fillRect(0,0,W,H);
  // fénysugarak
  x.save();x.translate(W/2,H*.45);x.rotate(el/1400);x.globalAlpha=.35*fade;for(let i=0;i<18;i++){x.rotate(Math.PI/9);const g=x.createLinearGradient(0,0,0,-Math.max(W,H));g.addColorStop(0,'#facc15');g.addColorStop(1,'rgba(250,204,21,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.lineTo(-60,-Math.max(W,H));x.lineTo(60,-Math.max(W,H));x.fill()}x.restore();
  // fénykör
  x.globalAlpha=fade;const pul=1+.06*Math.sin(el/90);const rg=x.createRadialGradient(W/2,H*.45,0,W/2,H*.45,260*pul);rg.addColorStop(0,'rgba(255,240,180,.55)');rg.addColorStop(1,'rgba(250,204,21,0)');x.fillStyle=rg;x.beginPath();x.arc(W/2,H*.45,260*pul,0,7);x.fill();
  // konfetti
  FXP.forEach(p=>{if(el<p.d)return;p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.y>H+20){p.x=W/2+(R()-.5)*W*.6;p.y=-20;p.vy=R()*3}
   x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/4,p.s,p.s/2*Math.abs(Math.cos(p.r*2))+1);x.restore()});
  // felirat + számláló
  const sc=Math.min(1,el/380),bo=sc<1?1+Math.sin(sc*Math.PI)*.25:1;x.save();x.translate(W/2,H*.38);x.scale(bo*sc+.001,bo*sc+.001);x.textAlign='center';x.textBaseline='middle';
  x.font='900 '+Math.min(84,W/11)+'px "Luckiest Guy",Impact';const tg=x.createLinearGradient(0,-40,0,40);tg.addColorStop(0,'#fff7cc');tg.addColorStop(.5,'#facc15');tg.addColorStop(1,'#b45309');
  x.lineWidth=10;x.strokeStyle='#3b1500';x.strokeText(tt,0,0);x.fillStyle=tg;x.shadowColor='#facc15';x.shadowBlur=30;x.fillText(tt,0,0);x.restore();
  const cnt=Math.round(w*Math.min(1,Math.max(0,(el-300)/1800)));x.textAlign='center';x.textBaseline='middle';x.font='900 '+Math.min(64,W/16)+'px Impact';x.lineWidth=8;x.strokeStyle='#000';
  x.strokeText('+'+fmt(cnt)+' 🪙',W/2,H*.38+90);x.fillStyle='#4ade80';x.shadowColor='#4ade80';x.shadowBlur=20;x.fillText('+'+fmt(cnt)+' 🪙',W/2,H*.38+90);x.shadowBlur=0;
  x.font='700 15px Rajdhani';x.fillStyle='#fde68acc';x.fillText('kattints a folytatáshoz',W/2,H*.38+150);x.globalAlpha=1;
  FXR=requestAnimationFrame(fr)};FXR=requestAnimationFrame(fr)}catch(e){}}
// 3) KENÓ: a kihúzott golyó a gömbből ívben a számra repül, ott pattan
function ballFly(n,cb){try{const g=$('k4kg'),cell=g&&g.querySelector('[data-n="'+n+'"]');if(!cell){cb();return}const[tx,ty]=ctr(cell);const fr=$('k4kg').getBoundingClientRect();
 const sx=fr.left+fr.width/2,sy=fr.top-40;const d=document.createElement('div');d.className='k4ball';d.textContent=n;if(KE.pick.includes(n))d.style.background='radial-gradient(circle at 35% 30%,#fff,#4ade80 55%,#15803d)';document.body.appendChild(d);
 const mx=(sx+tx)/2,my=Math.min(sy,ty)-70,kf=[];for(let k=0;k<=10;k++){const u=k/10,a=(1-u)*(1-u),b=2*(1-u)*u,c=u*u;kf.push({transform:'translate('+(a*sx+b*mx+c*tx)+'px,'+(a*sy+b*my+c*ty)+'px) rotate('+(u*720)+'deg) scale('+(.5+u*.5)+')'})}
 kf.push({transform:'translate('+tx+'px,'+(ty-10)+'px) scale(1.15)'},{transform:'translate('+tx+'px,'+ty+'px) scale(1)',opacity:0});
 const an=d.animate(kf,{duration:330,easing:'ease-in'});an.onfinish=()=>{d.remove();cb()};setTimeout(()=>{if(d.isConnected){d.remove();cb()}},900)}catch(e){cb()}}
// 4) BACCARAT: a lap a cipőből érkezik hátlappal, majd megfordul
function dealFx(card){try{if(!card)return;const r=card.getBoundingClientRect(),W=$('k4bac')||card.closest('.k4felt');const fr=W?W.getBoundingClientRect():{left:r.left,top:r.top-200,width:0};
 const dx=fr.left+fr.width/2-(r.left+r.width/2),dy=fr.top-30-(r.top);
 card.animate([{transform:'translate('+dx+'px,'+dy+'px) rotate(-25deg) rotateY(180deg) scale(.6)',filter:'brightness(.25)',offset:0},{transform:'translate(0,0) rotate(0) rotateY(180deg) scale(1)',filter:'brightness(.25)',offset:.55},
  {transform:'rotateY(90deg) scale(1.08)',filter:'brightness(.6)',offset:.75},{transform:'rotateY(0) scale(1)',filter:'brightness(1)',offset:1}],{duration:520,easing:'ease-out'})}catch(e){}}
// 5) LOTTÓ-GÉP: üveggömb pattogó golyókkal; a legutóbbi húzás számai egyenként kigurulnak a tálcára
const LG={balls:[],raf:0,draw:[],shown:0,t:0};
function lottoMachine(){const B=$('x20MB');if(!B||!B.classList.contains('k3lot'))return;if(B.querySelector('#k4lotc'))return;const h2=B.querySelector('h2');if(!h2)return;
 const bs=[...B.querySelectorAll('.x20row b')].find(b=>/·|k3ball/.test(b.innerHTML));const nums=bs?(bs.querySelectorAll('.k3ball').length?[...bs.querySelectorAll('.k3ball')].map(s=>s.textContent.trim()):bs.textContent.split('·').map(s=>s.trim())).filter(Boolean):[];
 const w=document.createElement('div');w.className='k4lotw';
 const now=new Date(),nx=new Date(now);nx.setHours(20,0,0,0);if(nx<=now)nx.setDate(nx.getDate()+1);const mins=Math.round((nx-now)/60000);
 w.innerHTML='<canvas id="k4lotc" width="260" height="230"></canvas><div><div class="k4lotinfo">'+(nums.length?'Legutóbbi húzás:':'Következő sorsolás 20:00-kor')+'<br><small style="opacity:.75">'+(nums.length?'':'még '+Math.floor(mins/60)+' óra '+(mins%60)+' perc')+'</small></div><div class="k4tray" id="k4tray"></div>'+
  (nums.length?'<button class="k4b" id="k4lrp" style="margin-top:6px">▶ HÚZÁS VISSZAJÁTSZÁSA</button>':'')+'</div>';
 const info=h2.nextElementSibling&&h2.nextElementSibling.classList.contains('k3bal')?h2.nextElementSibling.nextElementSibling:h2.nextElementSibling;(info||h2).after(w);
 LG.balls=[];for(let i=1;i<=30;i++)LG.balls.push({n:i,x:130+(R()-.5)*120,y:115+(R()-.5)*100,vx:(R()-.5)*4,vy:(R()-.5)*4,c:['#facc15','#f472b6','#22d3ee','#4ade80','#fb923c'][i%5]});
 const play=()=>{LG.draw=nums.slice();LG.shown=0;LG.t=performance.now();const tr=$('k4tray');if(tr)tr.innerHTML='';LG.balls.forEach(b=>b.out=0)};
 const rp=$('k4lrp');if(rp)rp.onclick=play;if(nums.length)play();
 cancelAnimationFrame(LG.raf);const c=$('k4lotc'),x=c.getContext('2d'),CX=130,CY=112,RAD=100;
 const fr=()=>{if(!c.isConnected)return;const t=performance.now();x.clearRect(0,0,260,230);
  // talp
  x.fillStyle='#4a2a10';x.fillRect(95,205,70,22);x.fillStyle='#c9a64a';x.fillRect(90,200,80,8);
  // gömb
  const gg=x.createRadialGradient(CX-30,CY-40,10,CX,CY,RAD);gg.addColorStop(0,'rgba(255,255,255,.18)');gg.addColorStop(1,'rgba(120,80,200,.12)');x.fillStyle=gg;x.beginPath();x.arc(CX,CY,RAD,0,7);x.fill();
  // golyók (légfúvás alulról)
  LG.balls.forEach(b=>{if(b.out)return;b.vy+=.18;if(b.y>CY+RAD*.55)b.vy-=.55+R()*.5;b.vx+=(R()-.5)*.35;b.x+=b.vx;b.y+=b.vy;const dx=b.x-CX,dy=b.y-CY,d=Math.hypot(dx,dy);
   if(d>RAD-10){const nx=dx/d,ny=dy/d,dot=b.vx*nx+b.vy*ny;b.vx-=2*dot*nx*.9;b.vy-=2*dot*ny*.9;b.x=CX+nx*(RAD-10);b.y=CY+ny*(RAD-10)}
   x.fillStyle=b.c;x.beginPath();x.arc(b.x,b.y,9,0,7);x.fill();x.fillStyle='#fff8';x.beginPath();x.arc(b.x-3,b.y-3,3,0,7);x.fill();x.fillStyle='#1a1205';x.font='bold 9px Rajdhani';x.textAlign='center';x.textBaseline='middle';x.fillText(b.n,b.x,b.y+1)});
  x.strokeStyle='#c9a64a';x.lineWidth=4;x.beginPath();x.arc(CX,CY,RAD,0,7);x.stroke();x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.beginPath();x.arc(CX,CY,RAD-8,3.6,4.6);x.stroke();
  // kihúzás
  if(LG.draw.length&&LG.shown<LG.draw.length&&t-LG.t>900+LG.shown*1100){const n=LG.draw[LG.shown++];const b=LG.balls.find(q=>String(q.n)===String(n));if(b)b.out=1;
   const tr=$('k4tray');if(tr){const s=document.createElement('span');s.textContent=n;s.style.background='radial-gradient(circle at 35% 30%,#fff,'+(b?b.c:'#facc15')+' 60%)';tr.appendChild(s)}
   beep(500,.12,'triangle',.1);setTimeout(()=>beep(900,.15,'sine',.08),120)}
  LG.raf=requestAnimationFrame(fr)};LG.raf=requestAnimationFrame(fr)}
(function obsLot(){const a=$('x20MB');if(!a)return setTimeout(obsLot,800);new MutationObserver(()=>{try{lottoMachine()}catch(e){}}).observe(a,{childList:true,subtree:true})})();
// globális: minden kaszinós kifizetés (_x10k.pay – nyerőgép, rulett, kaszino4 játékai) zseton-repülést indít
(function wrapPay(){const K=window._x10k;if(!K||!K.pay){setTimeout(wrapPay,800);return}if(K.pay._k4)return;const o=K.pay;K.pay=function(w){const r=o.apply(this,arguments);if(w>0)setTimeout(()=>chipFly(w),60);return r};K.pay._k4=1})();
const FX={chips:chipFly,jackpot:jackpotFx,ball:ballFly,deal:dealFx,lotto:lottoMachine};

window._k4={ST,crash,keno,bac,stats,kenoPay,vip,crashPoint,fx:FX};
})();
