// droglabor2.js – 🧪 KÖZPÉNZ-LABOR 2.0 (szatirikus tycoon, KITALÁLT anyagok, nincs valódi recept/vegyszer/lépés)
// Labor-szint 1–10, 6 gép (5 fokozat), gyártósor időzítővel, keverés-minijáték (minőség), hő + razzia-esemény,
// eladás játékbeli Ft-ért (S.c), statisztika + grafikon, prémium UI, WebAudio hangok. Mentés: k3dl2. Debug: _dl2
(function(){
'use strict';
const KEY='k3dl2';
const ld=()=>{try{return JSON.parse(localStorage.getItem(KEY))||null}catch(e){return null}};
let D=ld()||{lv:1,m:{},q:[],heat:0,st:{made:0,earn:0,raids:0,esc:0,lost:0,best:0},hist:[],pc:{}};
D.m=D.m||{};D.q=D.q||[];D.hist=D.hist||[];D.pc=D.pc||{};
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}};
const money=()=>{try{return S.c}catch(e){return 0}};
const addMoney=n=>{try{S.c=Math.max(0,Math.round(S.c+n));save()}catch(e){}try{window.updCoins&&updCoins()}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
// ---------- adatok (mind kitalált) ----------
const PR=[ // id, név, ikon, szín, ár/adag, idő mp, szükséges szint, hő
 ['por','Közpénz-por','✨','#facc15',4000,40,1,6],
 ['pirula','Pályázat-pirula','💊','#60a5fa',9000,75,2,9],
 ['csillam','Uniós Csillám','🌟','#a78bfa',18000,120,4,12],
 ['szirup','Stadion-szirup','🏟️','#34d399',32000,180,6,15],
 ['konfetti','Kampány-konfetti','🎉','#f472b6',60000,260,8,19],
 ['aura','Kétharmad-aura','👑','#fb923c',120000,360,10,24]];
const MC=[ // id, név, ikon, leírás, alapár
 ['kev','Csillámkeverő 3000','🌀','-12% gyártási idő / fokozat',15000],
 ['par','Párolós Pityu','🫧','+6% minőség / fokozat',20000],
 ['szel','Szellőző Szilárd','🌬️','-15% hő / fokozat',18000],
 ['hut','Bővített hűtőláda','🧊','+1 gyártóhely / fokozat',30000],
 ['pip','Aranypipa','🥇','+10% eladási ár / fokozat',40000],
 ['rob','Csomagolórobot','🤖','automatikus begyűjtés (1+), +5% ár',60000]];
const LVC=l=>Math.round(25000*Math.pow(2.1,l-1));
const mL=id=>D.m[id]||0;
const mCost=(id,b)=>Math.round(b*Math.pow(1.85,mL(id)));
const slots=()=>2+mL('hut');
const tMul=()=>Math.pow(.88,mL('kev'))*(1-(D.lv-1)*.02);
const pMul=()=>1+mL('pip')*.1+mL('rob')*.05+(D.lv-1)*.05;
const hMul=()=>Math.pow(.85,mL('szel'));
const PRB=id=>PR.find(p=>p[0]===id);
// ---------- hang ----------
let AC=null;const snd=(f,d,t,v,f2)=>{try{if(window.SET&&SET.mute)return;AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=t||'sine';o.frequency.value=f;if(f2)o.frequency.exponentialRampToValueAtTime(f2,AC.currentTime+d);g.gain.value=v||.08;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}};
const SFX={click:()=>snd(660,.06,'square',.04),buy:()=>{snd(523,.12,'triangle');setTimeout(()=>snd(784,.18,'triangle'),90)},bub:()=>snd(300+Math.random()*400,.15,'sine',.05,900),cash:()=>{[880,1175,1568].forEach((f,i)=>setTimeout(()=>snd(f,.15,'triangle',.07),i*70))},siren:()=>{for(let i=0;i<6;i++)setTimeout(()=>snd(i%2?660:880,.22,'sawtooth',.05),i*230)},bad:()=>snd(200,.4,'sawtooth',.07,80),good:()=>{snd(700,.1,'sine');setTimeout(()=>snd(1050,.2,'sine'),80)}};
// ---------- stílus ----------
const css=document.createElement('style');css.textContent=`
#dl2{position:fixed;inset:0;z-index:9500;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 30% 20%,rgba(16,40,60,.88),rgba(3,6,14,.95));font-family:Segoe UI,system-ui,sans-serif;color:#e2e8f0;backdrop-filter:blur(6px)}
#dl2.on{display:flex}
#dl2 canvas.bg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#dl2 .win{position:relative;width:min(1180px,96vw);height:min(760px,94vh);display:flex;flex-direction:column;border-radius:20px;background:linear-gradient(160deg,rgba(15,23,42,.92),rgba(8,12,24,.94));border:1px solid rgba(103,232,249,.35);box-shadow:0 0 60px rgba(34,211,238,.18),inset 0 0 40px rgba(34,211,238,.05);overflow:hidden;animation:dl2in .35s cubic-bezier(.2,1.3,.4,1)}
@keyframes dl2in{from{transform:scale(.9);opacity:0}}
#dl2 .hd{display:flex;align-items:center;gap:14px;padding:14px 20px;background:linear-gradient(90deg,rgba(34,211,238,.14),rgba(167,139,250,.12));border-bottom:1px solid rgba(103,232,249,.2)}
#dl2 .hd h1{margin:0;font-size:24px;letter-spacing:2px;background:linear-gradient(90deg,#67e8f9,#c4b5fd,#f9a8d4);-webkit-background-clip:text;color:transparent;text-shadow:0 0 30px rgba(103,232,249,.3)}
#dl2 .pill{padding:6px 12px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);font-weight:700;font-size:14px;white-space:nowrap}
#dl2 .x{margin-left:auto;cursor:pointer;font-size:22px;width:38px;height:38px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff}
#dl2 .x:hover{background:#ef4444}
#dl2 .tabs{display:flex;gap:6px;padding:10px 20px 0}
#dl2 .tab{padding:9px 16px;border-radius:12px 12px 0 0;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-bottom:none;font-weight:700;color:#94a3b8;transition:.2s}
#dl2 .tab.a{background:rgba(34,211,238,.16);color:#a5f3fc;box-shadow:0 -3px 14px rgba(34,211,238,.25)}
#dl2 .bd{flex:1;overflow:auto;padding:18px 20px;border-top:1px solid rgba(103,232,249,.15)}
#dl2 .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}
#dl2 .c{position:relative;padding:14px;border-radius:16px;background:linear-gradient(160deg,rgba(30,41,59,.85),rgba(15,23,42,.85));border:1px solid rgba(148,163,184,.18);transition:transform .15s,box-shadow .2s}
#dl2 .c:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.35),0 0 0 1px rgba(103,232,249,.3)}
#dl2 .c.lock{opacity:.45;filter:grayscale(.7)}
#dl2 .b{cursor:pointer;border:none;border-radius:10px;padding:9px 14px;font-weight:800;color:#0b1220;background:linear-gradient(180deg,#67e8f9,#22d3ee);box-shadow:0 3px 0 #0e7490,0 0 14px rgba(34,211,238,.35);transition:.1s}
#dl2 .b:hover{filter:brightness(1.12)}#dl2 .b:active{transform:translateY(2px);box-shadow:0 1px 0 #0e7490}
#dl2 .b.g2{background:linear-gradient(180deg,#86efac,#22c55e);box-shadow:0 3px 0 #15803d,0 0 14px rgba(34,197,94,.35)}
#dl2 .b.r{background:linear-gradient(180deg,#fca5a5,#ef4444);box-shadow:0 3px 0 #991b1b;color:#fff}
#dl2 .b.p{background:linear-gradient(180deg,#e9d5ff,#a78bfa);box-shadow:0 3px 0 #6d28d9}
#dl2 .b:disabled{filter:grayscale(1) brightness(.6);cursor:not-allowed}
#dl2 .bar{height:12px;border-radius:8px;background:rgba(255,255,255,.07);overflow:hidden;margin:8px 0}
#dl2 .bar i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#22d3ee,#a78bfa,#f472b6);background-size:200% 100%;animation:dl2fl 2s linear infinite;transition:width .3s}
@keyframes dl2fl{to{background-position:-200% 0}}
#dl2 .flask{font-size:44px;display:inline-block;filter:drop-shadow(0 0 12px var(--c));animation:dl2bob 2.4s ease-in-out infinite}
#dl2 .run .flask{animation:dl2shake .5s ease-in-out infinite}
@keyframes dl2bob{50%{transform:translateY(-5px) rotate(-4deg)}}
@keyframes dl2shake{25%{transform:rotate(-8deg) scale(1.05)}75%{transform:rotate(8deg) scale(1.05)}}
#dl2 .dots{display:flex;gap:4px;margin-top:6px}#dl2 .dots i{width:16px;height:6px;border-radius:3px;background:rgba(255,255,255,.12)}#dl2 .dots i.on{background:#67e8f9;box-shadow:0 0 6px #67e8f9}
#dl2 .heat{width:220px}#dl2 .heat .bar i{background:linear-gradient(90deg,#22c55e,#facc15,#ef4444);animation:none}
#dl2 .modal{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:5}
#dl2 .mb{width:min(520px,92%);padding:22px;border-radius:18px;background:#0f172a;border:1px solid rgba(103,232,249,.4);text-align:center;box-shadow:0 0 40px rgba(34,211,238,.25)}
#dl2 .raid .mb{border-color:#ef4444;animation:dl2siren .5s steps(2) infinite}
@keyframes dl2siren{0%{box-shadow:0 0 50px rgba(239,68,68,.7)}100%{box-shadow:0 0 50px rgba(59,130,246,.7)}}
#dl2 .mg{position:relative;height:46px;border-radius:12px;background:rgba(255,255,255,.06);margin:16px 0;overflow:hidden}
#dl2 .mg .z{position:absolute;top:0;bottom:0;background:linear-gradient(90deg,rgba(34,197,94,.25),rgba(34,197,94,.6),rgba(34,197,94,.25));border-left:2px solid #22c55e;border-right:2px solid #22c55e}
#dl2 .mg .z2{position:absolute;top:0;bottom:0;background:rgba(250,204,21,.7)}
#dl2 .mg .n{position:absolute;top:-4px;bottom:-4px;width:5px;border-radius:3px;background:#fff;box-shadow:0 0 12px #fff}
#dl2 .fl{position:absolute;pointer-events:none;font-weight:900;font-size:22px;animation:dl2up 1.3s ease-out forwards;z-index:9}
@keyframes dl2up{to{transform:translateY(-70px);opacity:0}}
#dl2 small{color:#94a3b8}
#dl2 button.b{background:linear-gradient(180deg,#67e8f9,#22d3ee)!important;color:#0b1220!important;font-family:Segoe UI,system-ui,sans-serif!important;text-transform:none!important;width:auto!important;flex:none!important;font-size:14px!important;letter-spacing:0!important}
#dl2 button.b.g2{background:linear-gradient(180deg,#86efac,#22c55e)!important}#dl2 button.b.r{background:linear-gradient(180deg,#fca5a5,#ef4444)!important;color:#fff!important}#dl2 button.b.p{background:linear-gradient(180deg,#e9d5ff,#a78bfa)!important}#dl2 #dl2old{font-size:12px!important;background:rgba(255,255,255,.08)!important;color:#cbd5e1!important;box-shadow:none}
#dl2 .hd h1{white-space:nowrap}#dl2 .mb button.b{margin:4px}
#dl2Btn{position:fixed;left:14px;bottom:150px;z-index:60;padding:10px 14px;border-radius:14px;border:1px solid rgba(103,232,249,.5);background:linear-gradient(160deg,#0f172a,#164e63);color:#a5f3fc;font-weight:800;cursor:pointer;box-shadow:0 0 16px rgba(34,211,238,.35)}
@media(max-width:700px){#dl2 .hd{flex-wrap:wrap}#dl2 .heat{width:120px}}
`;document.head.appendChild(css);
// ---------- DOM ----------
const R=document.createElement('div');R.id='dl2';R.innerHTML='<canvas class="bg"></canvas><div class="win"><div class="hd"><h1>🧪 KÖZPÉNZ-LABOR</h1><span class="pill" id="dl2lv"></span><span class="pill" id="dl2ft"></span><div class="heat"><small>🚨 Hő (razzia-kockázat)</small><div class="bar"><i id="dl2h"></i></div></div><button class="x" title="Bezár (Esc)">✕</button></div><div class="tabs"></div><div class="bd"></div></div>';
document.body.appendChild(R);
const $=s=>R.querySelector(s);let TAB='prod';
$('.x').onclick=()=>close();
const TABS=[['prod','⚗️ Gyártósor'],['mach','🔧 Gépek'],['lab','🏗️ Labor-szint'],['stat','📊 Statisztika']];
// háttér-buborékok
const cv=$('canvas.bg'),cx=cv.getContext('2d');let BUB=[],raf=0;
function bg(){if(!R.classList.contains('on')){raf=0;return}raf=requestAnimationFrame(bg);const w=cv.width=innerWidth,h=cv.height=innerHeight;if(BUB.length<60)BUB.push({x:Math.random()*w,y:h+20,r:2+Math.random()*7,v:.4+Math.random()*1.2,c:['#67e8f9','#a78bfa','#f472b6','#facc15'][Math.random()*4|0]});cx.clearRect(0,0,w,h);BUB=BUB.filter(b=>{b.y-=b.v;b.x+=Math.sin(b.y/40)*.4;cx.globalAlpha=.35;cx.strokeStyle=b.c;cx.lineWidth=1.5;cx.beginPath();cx.arc(b.x,b.y,b.r,0,7);cx.stroke();return b.y>-20})}
function floatTxt(t,col,el){const r=(el||$('.win')).getBoundingClientRect(),f=document.createElement('div');f.className='fl';f.textContent=t;f.style.color=col||'#86efac';f.style.left=(r.left+r.width/2-40)+'px';f.style.top=(r.top+10)+'px';f.style.position='fixed';R.appendChild(f);setTimeout(()=>f.remove(),1300)}
function toast(t){try{if(window.say&&window.G)say(t)}catch(e){}floatTxt(t,'#fde68a')}
// ---------- logika ----------
function start(pid,qual){if(D.q.length>=slots())return;const p=PRB(pid);const dur=p[5]*tMul()*1000;D.q.push({p:pid,t0:Date.now(),dur,q:qual});D.heat=Math.min(100,D.heat+p[7]*hMul());D.pc[pid]=(D.pc[pid]||0)+1;sv();SFX.bub();draw();maybeRaid(.25)}
function value(b){const p=PRB(b.p);return p[4]*pMul()*(.5+b.q/100)}
function collect(i,auto){const b=D.q[i];if(!b||Date.now()-b.t0<b.dur)return;const v=Math.round(value(b));D.q.splice(i,1);addMoney(v);D.st.made++;D.st.earn+=v;D.st.best=Math.max(D.st.best,v);D.hist.push([Date.now(),v]);if(D.hist.length>40)D.hist.shift();sv();if(!auto){SFX.cash();floatTxt('+'+fmt(v))}}
function maybeRaid(scale){if(R.querySelector('.modal'))return;const ch=(D.heat/100)*(D.heat/100)*scale;if(Math.random()<ch)raid()}
function tick(){const now=Date.now();// hő lassan hűl
 D.heat=Math.max(0,D.heat-(.02*(1+mL('szel')*.3)));
 if(mL('rob')>0)D.q.forEach((b,i)=>{if(now-b.t0>=b.dur)collect(i,true)});
 if(R.classList.contains('on')){if(Math.random()<.004)maybeRaid(1);upd()}
}
setInterval(tick,500);
// ---------- razzia ----------
function raid(){SFX.siren();D.st.raids++;sv();const bribe=Math.round(8000*D.lv+D.heat*400);const M=document.createElement('div');M.className='modal raid';
 M.innerHTML='<div class="mb"><div style="font-size:54px">🚨🚔🚨</div><h2 style="margin:6px 0;color:#fca5a5">RAZZIA! A Kitalált Ügyosztály kopogtat!</h2><p>„Csak egy rutinellenőrzés a <b>Közpénz-por</b> ügyében…”<br><small>Hő: '+Math.round(D.heat)+'%</small></p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="b p" data-a="br">💼 „Tanácsadói díj” ('+fmt(bribe)+')</button><button class="b" data-a="hide">🫣 Elrejtés (minijáték)</button><button class="b r" data-a="run">🏃 Menekülés (50%)</button></div></div>';
 R.appendChild(M);
 M.querySelectorAll('button').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='br'){if(money()<bribe){floatTxt('Nincs elég Ft!','#fca5a5');SFX.bad();return}addMoney(-bribe);D.heat*=.3;D.st.esc++;M.remove();SFX.good();toast('💼 Az ügyet „lezárták”.');sv();draw()}
  else if(a==='run'){M.remove();if(Math.random()<.5){D.heat*=.5;D.st.esc++;SFX.good();toast('🏃 Megúsztad!')}else lose();sv();draw()}
  else hideGame(M)})}
function lose(){const n=D.q.length,fine=Math.round(Math.min(money()*.08,50000*D.lv));D.q=[];D.st.lost+=n;addMoney(-fine);D.heat=10;SFX.bad();toast('🚔 Lefoglalva: '+n+' adag, bírság '+fmt(fine));sv();draw()}
function hideGame(M){const mb=M.querySelector('.mb');let hits=0,need=3,left=6;mb.innerHTML='<h2>🫣 Dugd el a ládákat!</h2><p>Kattints a felvillanó 📦 ládákra – kell '+need+' találat, '+left+' esély.</p><div id="dl2hg" style="position:relative;height:220px;border-radius:12px;background:rgba(255,255,255,.05)"></div><p id="dl2hs"></p>';
 const A=mb.querySelector('#dl2hg'),Sx=mb.querySelector('#dl2hs');
 const next=()=>{Sx.textContent='Találat: '+hits+'/'+need+' · esély: '+left;if(hits>=need){M.remove();D.heat*=.4;D.st.esc++;SFX.good();toast('✅ Semmit nem találtak!');sv();draw();return}if(left<=0){M.remove();lose();return}left--;A.innerHTML='';const bx=document.createElement('div');bx.textContent='📦';bx.style.cssText='position:absolute;font-size:40px;cursor:pointer;left:'+(Math.random()*85)+'%;top:'+(Math.random()*70)+'%;transition:transform .1s';A.appendChild(bx);let ok=false;bx.onclick=()=>{ok=true;hits++;SFX.click();bx.style.transform='scale(0)';setTimeout(next,150)};setTimeout(()=>{if(!ok&&bx.isConnected){SFX.bad();next()}},Math.max(650,1100-D.lv*30))};next()}
// ---------- keverés minijáték (minőség) ----------
function mixGame(pid){const p=PRB(pid);const M=document.createElement('div');M.className='modal';let round=0,score=0,pos=0,dir=1,sp=1.1+D.lv*.08,raf2=0;
 const zw=Math.min(34,18+mL('par')*3);
 M.innerHTML='<div class="mb"><div class="flask" style="--c:'+p[3]+'">'+p[2]+'</div><h2 style="margin:6px 0">Keverés: '+p[1]+'</h2><p><small>Állítsd meg a mutatót a zöld sávban (Szóköz / kattintás). 3 kör. A sárga közép = tökéletes!</small></p><div class="mg"><div class="z"></div><div class="z2"></div><div class="n"></div></div><p id="dl2mr">Kör 1/3</p><button class="b g2">⏹ STOP</button> <button class="b" data-s>Kihagyás (60%)</button></div>';
 R.appendChild(M);const Z=M.querySelector('.z'),Z2=M.querySelector('.z2'),N=M.querySelector('.n'),T=M.querySelector('#dl2mr');let zc=50;
 const place=()=>{zc=15+Math.random()*70;Z.style.left=(zc-zw/2)+'%';Z.style.width=zw+'%';Z2.style.left=(zc-2)+'%';Z2.style.width='4%'};place();
 const loop=()=>{raf2=requestAnimationFrame(loop);pos+=dir*sp;if(pos>100||pos<0){dir*=-1;pos=Math.max(0,Math.min(100,pos))}N.style.left=pos+'%'};loop();
 const fin=q=>{cancelAnimationFrame(raf2);removeEventListener('keydown',kd,true);M.remove();start(pid,q);floatTxt('Minőség: '+q+'%',q>85?'#facc15':'#86efac')};
 const stop=()=>{const d=Math.abs(pos-zc);let s=d<=2?100:d<=zw/2?80-d:Math.max(10,40-d);s=Math.min(100,s+mL('par')*6);score+=s;round++;snd(s>=80?900:300,.15,'triangle');T.textContent=(d<=2?'🌟 TÖKÉLETES!':d<=zw/2?'👍 Jó!':'😬 Mellé…')+' · Kör '+Math.min(round+1,3)+'/3';if(round>=3)fin(Math.round(score/3));else{place();sp*=1.15}};
 const kd=e=>{if(e.code==='Space'){e.preventDefault();e.stopPropagation();stop()}};addEventListener('keydown',kd,true);
 M.querySelector('.g2').onclick=stop;M.querySelector('[data-s]').onclick=()=>fin(60)}
// ---------- rajzolás ----------
function head(){$('#dl2lv').textContent='🏗️ Labor Lv '+D.lv;$('#dl2ft').textContent='💰 '+fmt(money());const h=$('#dl2h');h.style.width=D.heat+'%'}
function upd(){head();D.q.forEach((b,i)=>{const e=R.querySelector('[data-qi="'+i+'"]');if(!e)return;const f=Math.min(1,(Date.now()-b.t0)/b.dur);e.querySelector('i').style.width=(f*100)+'%';const t=e.parentNode.querySelector('.tl');if(t)t.textContent=f>=1?'✅ KÉSZ!':Math.ceil((b.dur-(Date.now()-b.t0))/1000)+' mp';const c=e.closest('.c');if(f>=1&&c.classList.contains('run')){draw()}})}
function draw(){head();$('.tabs').innerHTML=TABS.map(t=>'<div class="tab'+(t[0]===TAB?' a':'')+'" data-t="'+t[0]+'">'+t[1]+'</div>').join('');R.querySelectorAll('.tab').forEach(e=>e.onclick=()=>{TAB=e.dataset.t;SFX.click();draw()});
 const B=$('.bd');let h='';
 if(TAB==='prod'){h+='<h3 style="margin:0 0 10px">⚗️ Gyártóhelyek ('+D.q.length+'/'+slots()+')</h3><div class="g">';
  for(let i=0;i<slots();i++){const b=D.q[i];if(b){const p=PRB(b.p),done=Date.now()-b.t0>=b.dur;h+='<div class="c'+(done?'':' run')+'" style="text-align:center"><div class="flask" style="--c:'+p[3]+'">'+p[2]+'</div><div><b>'+p[1]+'</b></div><small>Minőség '+b.q+'% · ~'+fmt(value(b))+'</small><div class="bar" data-qi="'+i+'"><i></i></div><div class="tl"></div>'+(done?'<button class="b g2" data-c="'+i+'">💰 Begyűjtés</button>':'')+'</div>'}
   else h+='<div class="c" style="text-align:center;border-style:dashed;opacity:.6"><div style="font-size:40px">⚪</div><small>Üres hely</small></div>'}
  h+='</div><h3 style="margin:18px 0 10px">📦 Termékek (mind kitalált)</h3><div class="g">';
  PR.forEach(p=>{const lk=D.lv<p[6];h+='<div class="c'+(lk?' lock':'')+'"><div style="display:flex;gap:10px;align-items:center"><span class="flask" style="--c:'+p[3]+';font-size:34px">'+p[2]+'</span><div><b style="color:'+p[3]+'">'+p[1]+'</b><br><small>'+fmt(p[4]*pMul())+' · '+Math.round(p[5]*tMul())+' mp · hő +'+Math.round(p[7]*hMul())+'</small></div></div><div style="margin-top:10px">'+(lk?'🔒 Labor Lv '+p[6]:'<button class="b" data-s="'+p[0]+'"'+(D.q.length>=slots()?' disabled':'')+'>🧪 Gyártás + keverés</button>')+'</div></div>'});h+='</div>'}
 if(TAB==='mach'){h+='<div class="g">';MC.forEach(m=>{const l=mL(m[0]),c=mCost(m[0],m[4]),mx=l>=5;h+='<div class="c"><div style="font-size:36px">'+m[2]+'</div><b>'+m[1]+'</b><br><small>'+m[3]+'</small><div class="dots">'+[0,1,2,3,4].map(k=>'<i class="'+(k<l?'on':'')+'"></i>').join('')+'</div><div style="margin-top:10px">'+(mx?'⭐ MAX':'<button class="b" data-m="'+m[0]+'"'+(money()<c?' disabled':'')+'>⬆️ '+fmt(c)+'</button>')+'</div></div>'});h+='</div>'}
 if(TAB==='lab'){const c=LVC(D.lv);h+='<div class="c" style="max-width:640px;margin:0 auto;text-align:center"><div style="font-size:60px">'+['🏚️','🏠','🏡','🏢','🏭','🏬','🏰','🛸','🌋','🏛️'][D.lv-1]+'</div><h2>Labor szint '+D.lv+'/10</h2><p><small>Minden szint: +5% ár, -2% gyártási idő, új termékek. A labor egy „innovációs kompetenciaközpont” papíron.</small></p><div class="dots" style="justify-content:center">'+Array.from({length:10},(_,k)=>'<i class="'+(k<D.lv?'on':'')+'"></i>').join('')+'</div><br>'+(D.lv>=10?'<b>👑 Maximális szint – „Nemzeti Kiválósági Labor”</b>':'<button class="b p" data-l'+(money()<c?' disabled':'')+'>🏗️ Fejlesztés: '+fmt(c)+'</button>')+'<p style="margin-top:14px"><button class="b" data-cool>🧯 Hűtés: hő -40% ('+fmt(3000*D.lv)+')</button></p></div>'}
 if(TAB==='stat'){const s=D.st;h+='<div class="g">'+[['📦 Legyártott adag',s.made],['💰 Összbevétel',fmt(s.earn)],['🏆 Legjobb adag',fmt(s.best)],['🚨 Razziák',s.raids],['😎 Megúszva',s.esc],['🚔 Lefoglalt adag',s.lost]].map(x=>'<div class="c"><small>'+x[0]+'</small><div style="font-size:24px;font-weight:900;color:#a5f3fc">'+x[1]+'</div></div>').join('')+'</div><div class="c" style="margin-top:14px"><b>📈 Utolsó eladások</b><canvas id="dl2ch" width="1080" height="220" style="width:100%;height:200px"></canvas></div>'}
 B.innerHTML=h;
 B.querySelectorAll('[data-c]').forEach(e=>e.onclick=()=>{collect(+e.dataset.c);draw()});
 B.querySelectorAll('[data-s]').forEach(e=>e.onclick=()=>{SFX.click();mixGame(e.dataset.s)});
 B.querySelectorAll('[data-m]').forEach(e=>e.onclick=()=>{const m=MC.find(x=>x[0]===e.dataset.m),c=mCost(m[0],m[4]);if(money()<c)return;addMoney(-c);D.m[m[0]]=mL(m[0])+1;sv();SFX.buy();floatTxt(m[2]+' fejlesztve!','#a5f3fc');draw()});
 const L=B.querySelector('[data-l]');if(L)L.onclick=()=>{const c=LVC(D.lv);if(money()<c||D.lv>=10)return;addMoney(-c);D.lv++;sv();SFX.buy();setTimeout(SFX.cash,200);floatTxt('🏗️ Labor Lv '+D.lv+'!','#c4b5fd');draw()};
 const Co=B.querySelector('[data-cool]');if(Co)Co.onclick=()=>{const c=3000*D.lv;if(money()<c){SFX.bad();return}addMoney(-c);D.heat*=.6;sv();SFX.good();draw()};
 const ch=B.querySelector('#dl2ch');if(ch){const g=ch.getContext('2d'),W=ch.width,H=ch.height,v=D.hist.map(x=>x[1]),mx=Math.max(1,...v);g.strokeStyle='rgba(255,255,255,.08)';for(let y=0;y<5;y++){g.beginPath();g.moveTo(0,y*H/4);g.lineTo(W,y*H/4);g.stroke()}
  if(!v.length){g.fillStyle='#94a3b8';g.font='20px Segoe UI';g.fillText('Még nincs eladás – indíts egy gyártást!',20,H/2)}
  const bw=W/Math.max(v.length,10);v.forEach((x,i)=>{const bh=(x/mx)*(H-20);const gr=g.createLinearGradient(0,H-bh,0,H);gr.addColorStop(0,'#a78bfa');gr.addColorStop(1,'#22d3ee');g.fillStyle=gr;g.fillRect(i*bw+3,H-bh,bw-6,bh)})}
 upd()}
function open(){R.classList.add('on');try{if(document.pointerLockElement)document.exitPointerLock()}catch(e){}draw();if(!raf)bg()}
function close(){R.classList.remove('on');R.querySelectorAll('.modal').forEach(m=>m.remove());try{const sp=document.getElementById('dp');if(window.sp3On&&sp3On()&&!(sp&&sp.style.display!=='none'&&sp.offsetParent))window.sp3Resume&&sp3Resume()}catch(e){}}
addEventListener('keydown',e=>{if(e.key==='Escape'&&R.classList.contains('on')&&!R.querySelector('.modal')){close();e.stopPropagation()}},true);
// lebegő gomb (lobby2 automatikusan besorolja)
const btn=document.createElement('button');btn.id='dl2Btn';btn.textContent='🧪 Közpénz-labor';btn.onclick=open;document.body.appendChild(btn);
setInterval(()=>{const lb=document.getElementById('lb');btn.style.display=lb&&lb.classList.contains('on')?'':'none'},1000);
// Sötét Program (11-09 egységesítés): EGY belépési pont – a Sötét Program 🧪 Labor fülén a „Közpénz-labor 2.0” kártya nyitja.
// A labor-fül/állomás már NEM ugrik át ide (a 3D keverés-minijáték a sotetmg3d.js-ben). Innen „⬅ Sötét Program” gomb visz vissza.
function hook(){if($('#dl2old')||!$('.hd'))return;const b=document.createElement('button');b.id='dl2old';b.className='b';b.style.cssText='margin-left:8px;font-size:12px;padding:6px 10px';b.textContent='⬅ Sötét Program';b.title='Vissza a Sötét Program Labor fülére';
 b.onclick=()=>{close();try{window.openSotetProgram&&openSotetProgram('lab')}catch(e){}};$('.hd').insertBefore(b,$('.x'))}
hook();setTimeout(hook,3000);
window._dl2={open,close,D,raid,give:n=>addMoney(n),reset:()=>{localStorage.removeItem(KEY);location.reload()}};
})();
