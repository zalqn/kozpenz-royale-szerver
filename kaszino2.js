// kaszino2.js – 🎰 KASZINÓ ANIMÁCIÓK (prémium arany/neon stílus) + /444 parancs
// Csak játékbeli zseton/Ft. A közös napi veszteséghatár (k3x10lim) érvényben marad (a tét az eredeti canBet/bet-en megy át).
// - Nyerőgép: valódi tárcsapörgés (virtuális szalag, függőleges SVG mozgás-elmosás), egyenkénti megállás rugózással,
//   „feszültség” a 3. tárcsán, nyerővonal-villanás. /444 → a következő pörgetés garantált 3×7️⃣ (tét ×100).
// - BIG WIN → MEGA WIN → EPIC WIN képernyő: canvas érmeeső/konfetti/szikra (pool, egy rAF-ciklus, csak ha kell),
//   felszámoló számláló, villanás, rázkódás, WebAudio szintetizált csilingelés/fanfár. Kattintás/Space/Esc = átugrás.
// - Kis WIN felirat + szikrák, vesztésnél finom rázás + halk hang.
// - Póker (extra10), blackjack/kockapóker/kaparós/lóverseny (extra140d), napi kerék (extra100) animációi.
// Mentés: k3x160force (élesített /444), k3x160set (hang be/ki). Debug: _k2.big(5000,50), _k2.small(200), _k2.arm()
(function(){
'use strict';
const LSG=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const SET=Object.assign({snd:true},LSG('k3x160set',{}));
const fmt=n=>Math.round(n).toLocaleString('hu-HU');
const $=id=>document.getElementById(id);
const now=()=>performance.now();
const parseAmt=s=>{const m=String(s).match(/\+\s*([\d\s  .]+)/);return m?+m[1].replace(/[^\d]/g,''):0};

// =====================================================================
// HANG (WebAudio, szintetizált)
// =====================================================================
let AC=null,MG=null;
// a k3x50snd keverő (master × sfx) hangereje
function mixVol(){try{const m=JSON.parse(localStorage.getItem('k3x50snd')||'{}');const ma=typeof m.master==='number'?m.master:1,sf=typeof m.sfx==='number'?m.sfx:1;return Math.max(0,Math.min(1.5,ma*sf))}catch(e){return 1}}
function ac(){if(!SET.snd)return null;try{if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.32;
 const cp=AC.createDynamicsCompressor();cp.threshold.value=-14;cp.ratio.value=6;MG.connect(cp);cp.connect(AC.destination)}
 if(AC.state==='suspended')AC.resume();MG.gain.value=.32*mixVol();return AC}catch(e){return null}}
function tone(f,type,dur,vol,when,f2,att){const a=ac();if(!a)return;const t=a.currentTime+(when||0),o=a.createOscillator(),g=a.createGain();
 o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.2,t+(att||.008));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
 o.connect(g);g.connect(MG);o.start(t);o.stop(t+dur+.05)}
let NB=null;function noise(dur,vol,when,fq,q,type){const a=ac();if(!a)return;if(!NB){NB=a.createBuffer(1,a.sampleRate,a.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 const t=a.currentTime+(when||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NB;f.type=type||'bandpass';f.frequency.value=fq||2000;f.Q.value=q||1;
 g.gain.setValueAtTime(vol||.2,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(MG);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
const SND={
 tick(p){tone(1400+(p||0),'square',.025,.035)},
 thud(i){tone(160-i*12,'sine',.18,.35,0,55);noise(.06,.18,0,900,1.2)},
 chime(w){const n=[1318.5,1760,2093,2637];for(let i=0;i<4;i++){tone(n[i],'sine',.5,.12,(w||0)+i*.06);tone(n[i]*2.01,'sine',.25,.03,(w||0)+i*.06)}},
 coin(){const f=2200+Math.random()*900;tone(f,'sine',.22,.07);tone(f*1.5,'sine',.15,.03,.03)},
 count(p){tone(900+p*900,'triangle',.05,.05)},
 fan(lv){const base=[261.6,329.6,392,523.3,659.3,784][0]*Math.pow(2,(lv||0)*2/12),seq=[0,4,7,12,7,12,16];
  seq.forEach((s,i)=>{const f=base*Math.pow(2,s/12),w=i*.11,d=i===seq.length-1?1.1:.16;tone(f,'sawtooth',d,.09,w);tone(f,'square',d,.04,w);tone(f/2,'triangle',d,.1,w)});
  noise(.9,.06,.66,6000,.6,'highpass')},
 slam(){[130.8,164.8,196,261.6,329.6,392].forEach((f,i)=>{tone(f,'sawtooth',1.6,.07,i*.012);tone(f*2,'sine',1.4,.05)});tone(65,'sine',.8,.4,0,40);noise(1.2,.1,0,5000,.5,'highpass')},
 lose(){tone(392,'sine',.22,.08);tone(311,'sine',.35,.08,.16)},
 swish(){noise(.12,.12,0,3500,.8)},
 rattle(){for(let i=0;i<7;i++)noise(.04,.12,i*.05+Math.random()*.03,1800+Math.random()*1600,2)},
 scratch(){noise(.07,.05,0,4500,1.5)},
 riser(d){const a=ac();if(!a)return;tone(220,'sawtooth',d,.05,0,880,d*.8)},
 small(){[784,988,1175,1568].forEach((f,i)=>{tone(f,'square',.12,.05,i*.07);tone(f,'sine',.3,.08,i*.07)})}
};

// =====================================================================
// CSS
// =====================================================================
const css=document.createElement('style');css.textContent=`
#k2fx{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99995}
#k2bg{position:fixed;inset:0;z-index:99990;display:none;background:radial-gradient(ellipse at center,#1d0f3acc 0%,#07030fee 70%);opacity:0;transition:opacity .35s;overflow:hidden;cursor:pointer}
#k2bg.on{display:block}#k2bg.vis{opacity:1}
#k2bg .ray{position:absolute;left:50%;top:46%;width:240vmax;height:240vmax;margin:-120vmax 0 0 -120vmax;background:repeating-conic-gradient(from 0deg,#facc1522 0 7deg,transparent 7deg 18deg);animation:k2spinR 14s linear infinite;mask-image:radial-gradient(circle,#000 0,transparent 45%);-webkit-mask-image:radial-gradient(circle,#000 0,transparent 45%)}
#k2bg.t1 .ray{background:repeating-conic-gradient(from 0deg,#e879f933 0 7deg,transparent 7deg 18deg);animation-duration:9s}
#k2bg.t2 .ray{background:repeating-conic-gradient(from 0deg,#22d3ee33 0 6deg,#a855f722 6deg 12deg,transparent 12deg 18deg);animation-duration:6s}
@keyframes k2spinR{to{transform:rotate(360deg)}}
#k2tx{position:fixed;inset:0;z-index:99998;display:none;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;font-family:'Luckiest Guy',Impact,sans-serif;text-align:center}
#k2tx.on{display:flex}
#k2tt{font-size:clamp(64px,13vw,180px);line-height:1;letter-spacing:4px;background:linear-gradient(100deg,#fff7c2 0%,#facc15 25%,#b45309 45%,#fde68a 55%,#facc15 75%,#fff7c2 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;
 filter:drop-shadow(0 6px 0 #7c2d12) drop-shadow(0 0 28px #facc15aa);animation:k2shine 1.6s linear infinite,k2pulse .9s ease-in-out infinite;transform-origin:center}
#k2tt.t1{background-image:linear-gradient(100deg,#fff 0%,#f0abfc 22%,#c026d3 45%,#fde68a 55%,#e879f9 78%,#fff 100%);filter:drop-shadow(0 6px 0 #4a044e) drop-shadow(0 0 34px #e879f9cc)}
#k2tt.t2{background-image:linear-gradient(100deg,#fff 0%,#67e8f9 18%,#a855f7 36%,#facc15 52%,#f472b6 70%,#22d3ee 86%,#fff 100%);filter:drop-shadow(0 7px 0 #1e1b4b) drop-shadow(0 0 40px #22d3eecc)}
#k2tt.pop{animation:k2pop .55s cubic-bezier(.2,1.6,.4,1) both,k2shine 1.6s linear infinite}
@keyframes k2shine{to{background-position:-250% 0}}
@keyframes k2pulse{50%{transform:scale(1.06)}}
@keyframes k2pop{0%{transform:scale(.1) rotate(-8deg);opacity:0}60%{transform:scale(1.25) rotate(2deg);opacity:1}100%{transform:scale(1)}}
#k2am{margin-top:18px;font-size:clamp(40px,7vw,96px);color:#fff;letter-spacing:2px;text-shadow:0 0 18px #facc15,0 4px 0 #92400e,0 0 2px #000;font-variant-numeric:tabular-nums}
#k2am small{font-size:.45em;color:#fde68a;margin-left:10px}
#k2am.slam{animation:k2slam .5s cubic-bezier(.2,1.8,.4,1)}
@keyframes k2slam{0%{transform:scale(1.6)}100%{transform:scale(1)}}
#k2hint{margin-top:26px;font:700 16px Rajdhani,system-ui,sans-serif;color:#fde68acc;letter-spacing:2px;animation:k2blink 1.2s ease-in-out infinite}
@keyframes k2blink{50%{opacity:.35}}
#k2fl{position:fixed;inset:0;z-index:99997;background:#fff;opacity:0;pointer-events:none}
#k2fl.go{animation:k2flash .45s ease-out}
@keyframes k2flash{0%{opacity:.85}100%{opacity:0}}
.k2shake{animation:k2sh .5s cubic-bezier(.36,.07,.19,.97)}
@keyframes k2sh{10%,90%{transform:translate(-2px,1px)}20%,80%{transform:translate(4px,-2px)}30%,50%,70%{transform:translate(-7px,3px) rotate(-.4deg)}40%,60%{transform:translate(7px,-3px) rotate(.4deg)}}
.k2lose{animation:k2ls .45s ease}
@keyframes k2ls{20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
#k2vig{position:fixed;inset:0;z-index:99989;pointer-events:none;opacity:0;box-shadow:inset 0 0 120px 30px #dc262666}
#k2vig.go{animation:k2vg .8s ease-out}
@keyframes k2vg{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
.k2win{position:fixed;z-index:99996;pointer-events:none;transform:translate(-50%,-50%);font-family:'Luckiest Guy',Impact,sans-serif;text-align:center;animation:k2wf 1.7s cubic-bezier(.2,.9,.3,1) forwards;white-space:nowrap}
.k2win b{display:block;font-size:54px;background:linear-gradient(100deg,#fff7c2,#facc15 40%,#f59e0b 60%,#fff7c2);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #7c2d12) drop-shadow(0 0 14px #facc15aa);animation:k2shine 1s linear infinite}
.k2win i{display:block;font-style:normal;font-size:30px;color:#fff;text-shadow:0 0 10px #facc15,0 2px 0 #92400e}
.k2win.l b{font-size:38px}
@keyframes k2wf{0%{transform:translate(-50%,-30%) scale(.2);opacity:0}18%{transform:translate(-50%,-50%) scale(1.15);opacity:1}30%{transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{transform:translate(-50%,-110%) scale(.95);opacity:0}}
/* ---- nyerőgép ---- */
.k2reels{position:relative;display:table!important;margin:16px auto!important;padding:16px 18px;border-radius:22px;background:linear-gradient(160deg,#2a1450,#120824);border:3px solid #c9a64a;box-shadow:0 0 0 3px #1a0d33,0 0 26px #facc1555,inset 0 0 30px #000a}
.k2reels:before{content:'';position:absolute;inset:-9px;border-radius:28px;pointer-events:none;background:radial-gradient(circle,#fde68a 0 2.5px,transparent 3.5px) 0 0/18px 18px;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:5px;animation:k2bulb 1s steps(2) infinite;opacity:.9}
@keyframes k2bulb{50%{background-position:9px 9px;filter:hue-rotate(-25deg) brightness(1.3)}}
.k2reels.hot:before{animation-duration:.25s}
.x10reel{position:relative;overflow:hidden;width:96px!important;height:104px!important;line-height:104px!important;vertical-align:middle;border-radius:12px!important;background:linear-gradient(180deg,#b9b19c 0%,#fffdf5 26%,#fffdf5 74%,#b9b19c 100%)!important;border:3px solid #e9c46a!important;box-shadow:inset 0 0 14px #0006,0 0 0 2px #5b3a0a,0 4px 10px #000a;color:#111;transition:box-shadow .2s}
.x10reel:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,#0008 0%,transparent 28%,transparent 62%,#fff3 68%,transparent 75%,#0008 100%);border-radius:9px}
.x10reel .k2st{position:absolute;inset:0}
.x10reel .k2st i{position:absolute;left:0;right:0;top:0;height:100%;font-style:normal;text-align:center;will-change:transform}
.x10reel .k2st.b1{filter:url(#k2mb1)}.x10reel .k2st.b2{filter:url(#k2mb2)}
.x10reel.k2land{animation:k2land .32s ease-out}
@keyframes k2land{0%{transform:scaleY(.94) translateY(3px)}60%{transform:scaleY(1.03)}100%{transform:none}}
.x10reel.k2sus{box-shadow:inset 0 0 14px #0006,0 0 0 2px #5b3a0a,0 0 26px 6px #f472b6;animation:k2susp .3s ease-in-out infinite alternate}
@keyframes k2susp{to{box-shadow:inset 0 0 14px #0006,0 0 0 2px #5b3a0a,0 0 38px 12px #facc15}}
.x10reel.k2hit{box-shadow:inset 0 0 14px #0006,0 0 0 2px #5b3a0a,0 0 26px 8px #facc15;animation:k2hit .5s ease-in-out 3}
@keyframes k2hit{50%{transform:scale(1.08);filter:brightness(1.25)}}
.k2line{position:absolute;left:6px;right:6px;top:50%;height:5px;margin-top:-2px;border-radius:3px;background:linear-gradient(90deg,transparent,#fde68a,#fff,#fde68a,transparent);box-shadow:0 0 14px 4px #facc15;opacity:0;pointer-events:none;z-index:2}
.k2line.on{animation:k2lf .3s ease-in-out 6 alternate}
@keyframes k2lf{from{opacity:0;transform:scaleX(.6)}to{opacity:1;transform:scaleX(1)}}
#x10spinB{position:relative;overflow:hidden;box-shadow:0 0 18px #f59e0b88;transition:transform .12s}
#x10spinB:not(:disabled):hover{transform:translateY(-2px) scale(1.03)}
#x10spinB:after,.x14dB.y:after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#fff8,transparent);transform:skewX(-20deg);animation:k2sweep 2.8s ease-in-out infinite;pointer-events:none}
.x14dB.y{position:relative;overflow:hidden}
@keyframes k2sweep{0%,60%{left:-60%}100%{left:130%}}
.k2cmd{display:flex;gap:6px;justify-content:center;align-items:center;margin-top:8px;font:600 13px Rajdhani,sans-serif;opacity:.85}
.k2cmd input{width:150px;background:#0b0618;border:1px solid #c9a64a88;color:#fde68a;border-radius:8px;padding:5px 8px;font:700 14px Rajdhani,monospace}
.k2arm{display:inline-block;margin-left:8px;padding:2px 9px;border-radius:10px;background:linear-gradient(90deg,#7e22ce,#db2777);color:#fff;font:700 12px system-ui;box-shadow:0 0 12px #db2777;animation:k2blink 1s infinite}
/* ---- kártyák (póker + blackjack) ---- */
.x10card.k2deal,.x14dC.k2deal{animation:k2deal .5s cubic-bezier(.2,.8,.3,1.15) both!important}
@keyframes k2deal{0%{transform:translate(260px,-200px) rotate(-35deg) rotateY(90deg) scale(.7);opacity:0}55%{transform:translate(0,-6px) rotate(3deg) rotateY(90deg) scale(1);opacity:1}100%{transform:none;opacity:1}}
.x10card.k2flip,.x14dC.k2flip{animation:k2flip .45s ease-out both!important}
@keyframes k2flip{0%{transform:rotateY(90deg) scale(1.1)}60%{transform:rotateY(-12deg) scale(1.08)}100%{transform:none}}
.x14dC.k2old{animation:none!important}
.x14dC,.x10card{box-shadow:0 3px 8px #0008,inset 0 0 0 2px #fff,inset 0 0 0 3px #d4af3755!important;backface-visibility:hidden}
.x10card.k2glow,.x14dC.k2glow{box-shadow:0 0 18px 4px #facc15,inset 0 0 0 2px #fff!important}
/* ---- kocka ---- */
.x14dDi{transition:border-color .2s,box-shadow .2s}
.x14dDi.k{box-shadow:0 0 14px #facc15}
.x14dDi.roll{animation:k2tumble .75s cubic-bezier(.25,.7,.35,1.2) both!important}
@keyframes k2tumble{0%{transform:translate(var(--dx,40px),-70px) rotate(0) scale(.6);opacity:.2}35%{transform:translate(calc(var(--dx,40px)*.4),6px) rotate(var(--r1,280deg)) scale(1.05);opacity:1}55%{transform:translate(calc(var(--dx,40px)*.15),-14px) rotate(var(--r2,360deg))}75%{transform:translate(0,2px) rotate(var(--r3,350deg)) scaleY(.92)}100%{transform:rotate(360deg)}}
/* ---- kaparós ---- */
.k2glint{position:absolute;inset:0;border-radius:12px;pointer-events:none;overflow:hidden}
.k2glint:before{content:'';position:absolute;top:-50%;left:-80%;width:45%;height:200%;background:linear-gradient(100deg,transparent,#ffffffaa,transparent);transform:rotate(18deg);animation:k2gl 2.4s ease-in-out infinite}
.k2glint i{position:absolute;width:10px;height:10px;font-style:normal;background:radial-gradient(circle,#fff 0,#fff0 60%);animation:k2tw 1.6s ease-in-out infinite}
@keyframes k2gl{0%,30%{left:-80%}100%{left:140%}}
@keyframes k2tw{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1.6);opacity:1}}
/* ---- kerék ---- */
#xWh{border-radius:50%;box-shadow:0 0 0 6px #5b3a0a,0 0 0 9px #facc15,0 0 30px 8px #facc1566}
#xWh.k2sp{animation:k2wg .5s ease-in-out infinite alternate}
@keyframes k2wg{to{box-shadow:0 0 0 6px #5b3a0a,0 0 0 9px #fde68a,0 0 46px 14px #f59e0bbb}}
`;document.head.appendChild(css);
// függőleges mozgás-elmosás SVG szűrők
const svgNS='http://www.w3.org/2000/svg',sv=document.createElementNS(svgNS,'svg');sv.setAttribute('width','0');sv.setAttribute('height','0');sv.style.position='absolute';
sv.innerHTML='<filter id="k2mb1" x="0" y="-50%" width="100%" height="200%"><feGaussianBlur stdDeviation="0 3"/></filter><filter id="k2mb2" x="0" y="-50%" width="100%" height="200%"><feGaussianBlur stdDeviation="0 9"/></filter>';
document.body.appendChild(sv);

// =====================================================================
// RÉSZECSKE-RENDSZER (canvas, pool, egyetlen rAF – csak ha fut valami)
// =====================================================================
const cv=document.createElement('canvas');cv.id='k2fx';document.body.appendChild(cv);const cx=cv.getContext('2d');
let W=0,H=0,DPR=1;function rs(){DPR=Math.min(1.5,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR|0;cv.height=H*DPR|0}rs();addEventListener('resize',rs);
function sprite(sz,fn){const c=document.createElement('canvas');c.width=c.height=sz;fn(c.getContext('2d'),sz);return c}
const COIN=sprite(64,(x,s)=>{const g=x.createRadialGradient(24,22,4,32,32,30);g.addColorStop(0,'#fff7c2');g.addColorStop(.45,'#facc15');g.addColorStop(1,'#a16207');
 x.fillStyle=g;x.beginPath();x.arc(32,32,30,0,7);x.fill();x.lineWidth=4;x.strokeStyle='#854d0e';x.stroke();x.beginPath();x.arc(32,32,22,0,7);x.lineWidth=2;x.strokeStyle='#fde68a';x.stroke();
 x.fillStyle='#92400e';x.font='bold 26px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('Ft',32,34)});
const COINB=sprite(64,(x)=>{x.fillStyle='#a16207';x.beginPath();x.arc(32,32,30,0,7);x.fill();x.lineWidth=4;x.strokeStyle='#713f12';x.stroke()});
const GLOW=sprite(64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fffbe6');g.addColorStop(.25,'#fde68acc');g.addColorStop(1,'#f59e0b00');x.fillStyle=g;x.fillRect(0,0,64,64)});
const CONF=['#facc15','#f472b6','#22d3ee','#a855f7','#4ade80','#fb923c','#ffffff'];
const N=1100,P=[];for(let i=0;i<N;i++)P.push({a:false});let live=0;
function emit(o){for(let i=0;i<N;i++){const p=P[i];if(!p.a){Object.assign(p,{a:true,x:0,y:0,vx:0,vy:0,g:900,t:0,life:2,s:1,rot:0,vr:0,fl:0,vf:0,c:'#fff',k:0,drag:0},o);live++;return p}}return null}
const EM=[];// folyamatos kibocsátók: {fn,until}
let raf=0,lt=0;
function loop(){const t=now(),dt=Math.min(.05,(t-lt)/1000||.016);lt=t;
 for(let i=EM.length-1;i>=0;i--){const e=EM[i];if(t>e.until){EM.splice(i,1);continue}e.acc=(e.acc||0)+dt*e.rate;while(e.acc>=1){e.acc--;e.fn()}}
 cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);
 if(BW.on&&BW.x)X4.draw(dt,t);
 for(let i=0;i<N;i++){const p=P[i];if(!p.a)continue;p.t+=dt;if(p.t>=p.life){p.a=false;live--;continue}
  if(p.drag){const d=Math.pow(1-p.drag,dt*60);p.vx*=d;p.vy*=d}
  if(p.k===7){p.ang+=p.w*dt*(1+300/Math.max(40,p.rad));p.rad=Math.max(5,p.rad+p.rv*dt);p.x=W/2+Math.cos(p.ang)*p.rad;p.y=H*.45+Math.sin(p.ang)*p.rad*.62;p.rot+=p.vr*dt;p.fl+=p.vf*dt}
  else{p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;p.fl+=p.vf*dt;if(p.k===6)p.vx+=Math.sin(p.t*4+p.rot)*60*dt}
  const al=Math.min(1,(p.life-p.t)*2.5);if(p.y>H+60&&p.vy>0){p.a=false;live--;continue}
  if(p.k===6||p.k===7)drawNote(p,al);
  else if(p.k===0){// érme (forgó)
   const c=Math.cos(p.fl),sc=p.s*DPR;cx.globalAlpha=al;cx.globalCompositeOperation='source-over';cx.setTransform(sc*Math.abs(c)+.04*sc,0,0,sc,p.x*DPR,p.y*DPR);cx.drawImage(c>0?COIN:COINB,-32,-32)}
  else if(p.k===1){// konfetti
   const c=Math.cos(p.rot),s=Math.sin(p.rot),sy=Math.cos(p.fl);cx.globalAlpha=al;cx.globalCompositeOperation='source-over';cx.setTransform(c*DPR,s*DPR,-s*sy*DPR,c*sy*DPR,p.x*DPR,p.y*DPR);cx.fillStyle=p.c;cx.fillRect(-5*p.s,-3*p.s,10*p.s,6*p.s)}
  else{// szikra / por (additív)
   const sc=p.s*DPR*(p.k===2?(1-p.t/p.life*.6):1);cx.globalAlpha=al*(p.k===3?.6:1);cx.globalCompositeOperation=p.k===2?'lighter':'source-over';cx.setTransform(sc,0,0,sc,p.x*DPR,p.y*DPR);
   if(p.k===2)cx.drawImage(GLOW,-32,-32);else{cx.fillStyle=p.c;cx.fillRect(-3,-3,6,6)}}}
 drawBolts(dt);cx.globalAlpha=1;cx.globalCompositeOperation='source-over';
 if(live>0||EM.length||BW.on||BOLTS.length)raf=requestAnimationFrame(loop);else{raf=0;cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height)}}
function kick(){if(!raf){lt=now();raf=requestAnimationFrame(loop)}}
const R=Math.random,rr=(a,b)=>a+R()*(b-a);
function coinP(x,y,vx,vy,s){return emit({k:0,x,y,vx,vy,g:1100,life:rr(2.2,3.4),s:s||rr(.35,.6),fl:R()*6,vf:rr(6,16)})}
function confP(x,y,vx,vy){return emit({k:1,x,y,vx,vy,g:260,drag:.02,life:rr(2.5,4),s:rr(.8,1.4),rot:R()*6,vr:rr(-8,8),fl:R()*6,vf:rr(4,12),c:CONF[R()*CONF.length|0]})}
function spark(x,y,sp,s){const a=R()*6.283,v=rr(.3,1)*(sp||400);return emit({k:2,x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:120,drag:.05,life:rr(.4,.9),s:s||rr(.25,.6)})}
function burst(x,y,n,sp){for(let i=0;i<n;i++)spark(x,y,sp);kick()}
function coinBurst(x,y,n,sp){for(let i=0;i<n;i++){const a=rr(-2.6,-.55),v=rr(.4,1)*(sp||700);coinP(x,y,Math.cos(a)*v,Math.sin(a)*v)}kick()}

// =====================================================================
// BIG / MEGA / EPIC WIN képernyő
// =====================================================================
const TIERS=[['BIG WIN',10],['MEGA WIN',25],['EPIC WIN',50]];
const bg=document.createElement('div');bg.id='k2bg';bg.innerHTML='<div class="ray"></div>';document.body.appendChild(bg);
const tx=document.createElement('div');tx.id='k2tx';tx.innerHTML='<div id="k2tt">BIG WIN</div><div id="k2am">0</div><div id="k2hint">KATTINTS A KIHAGYÁSHOZ</div>';document.body.appendChild(tx);
const fl=document.createElement('div');fl.id='k2fl';document.body.appendChild(fl);
const vig=document.createElement('div');vig.id='k2vig';document.body.appendChild(vig);
const TT=tx.querySelector('#k2tt'),AM=tx.querySelector('#k2am'),HN=tx.querySelector('#k2hint');
function flash(){fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go')}
function shake(el){if(!el)return;el.classList.remove('k2shake');void el.offsetWidth;el.classList.add('k2shake');setTimeout(()=>el.classList.remove('k2shake'),520)}
const BW={on:false};
function tierOf(m){let t=-1;TIERS.forEach((x,i)=>{if(m>=x[1])t=i});return t}
function setTier(i,first){TT.textContent=TIERS[i][0];TT.className='';void TT.offsetWidth;TT.className=(i?'t'+i+' ':'')+'pop';bg.className='on vis'+(i?' t'+i:'');
 flash();shake(TT.parentNode);if(!BW.x)SND.fan(i);const cxm=W/2,cym=H*.42;burst(cxm,cym,first?60:90,i?900:650);coinBurst(cxm,cym+40,first?18:30,900+i*200);
 for(let k=0;k<(i?70:40);k++)confP(cxm+rr(-60,60),cym,rr(-600,600),rr(-900,-300));
 setTimeout(()=>{if(TT.classList.contains('pop'))TT.classList.remove('pop')},600);
 // folyamatos eső: felülről érmék + konfetti, alulról szökőkút
 EM.length=0;const until=now()+60000;
 EM.push({rate:10+i*10,until,fn:()=>coinP(rr(0,W),-40,rr(-60,60),rr(50,250),rr(.3,.55))});
 EM.push({rate:8+i*10,until,fn:()=>confP(rr(0,W),-20,rr(-80,80),rr(40,160))});
 EM.push({rate:6+i*6,until,fn:()=>{const s=R()<.5?-1:1;coinP(W/2+s*W*.3,H+30,-s*rr(80,320),rr(-1300,-900))}});
 if(BW.src)EM.push({rate:22+i*14,until,fn:()=>coinP(BW.src[0]+rr(-40,40),BW.src[1],rr(-320,320),rr(-1250,-800),rr(.3,.5))});
 if(i)EM.push({rate:12*i,until,fn:()=>spark(rr(W*.2,W*.8),rr(H*.25,H*.6),200,rr(.3,.8))})}
function bigWin(amt,betV,cur,x4){if(BW.on)endBig(true);amt=Math.round(amt);betV=Math.max(1,betV||1);const m=amt/betV,ft=Math.max(0,tierOf(m));
 // időszakok: minden elért szint kap egy szakaszt (felszámolás a következő küszöbig)
 const marks=[];for(let i=0;i<=ft;i++)marks.push(i<ft?TIERS[i+1][1]*betV:amt);
 BW.id=(BW.id||0)+1;Object.assign(BW,{on:true,amt,bet:betV,cur:cur||'zseton',ft,tier:0,marks,seg:0,segT:now(),segD:ft?1900:2600,from:0,val:0,done:false,lastC:0,closeT:0,cb:null,x:!!x4});
 if(x4){BW.segD=X4.total()/marks.length;X4.start()}
 AM.innerHTML='0<small>'+BW.cur+'</small>';HN.textContent='KATTINTS A KIHAGYÁSHOZ';
 bg.className='on';tx.className='on';requestAnimationFrame(()=>bg.classList.add('vis'));setTier(0,true);kick();
 return new Promise(res=>BW.cb=res)}
function bwTick(id){if(!BW.on||id!==BW.id)return;const t=now();
 if(!BW.done){const u=Math.min(1,(t-BW.segT)/BW.segD),last=BW.seg===BW.marks.length-1,e=last?1-Math.pow(1-u,3):u*u*(3-2*u);
  BW.val=BW.from+(BW.marks[BW.seg]-BW.from)*e;AM.firstChild.nodeValue=fmt(BW.val);
  if(t-BW.lastC>(BW.x?140:70)){BW.lastC=t;if(!BW.x)SND.count(BW.val/BW.amt);if(R()<.5)SND.coin()}
  if(u>=1){if(last)finishBig();else{BW.from=BW.marks[BW.seg];BW.seg++;BW.segT=t;BW.tier=BW.seg;setTier(BW.seg);if(BW.seg===BW.marks.length-1&&!BW.x)BW.segD=2600}}}
 else if(t>BW.closeT)endBig();
 requestAnimationFrame(()=>bwTick(id))}
function finishBig(){BW.done=true;BW.val=BW.amt;AM.firstChild.nodeValue=fmt(BW.amt);AM.classList.remove('slam');void AM.offsetWidth;AM.classList.add('slam');
 if(BW.tier!==BW.ft){BW.tier=BW.ft;setTier(BW.ft)}SND.slam();flash();shake(tx);coinBurst(W/2,H*.55,40,1200);burst(W/2,H*.5,80,1000);
 if(BW.x)X4.fin(now()<X4.x0+X4.total()-250);HN.textContent='KATTINTS A FOLYTATÁSHOZ';BW.closeT=now()+(BW.x?4500:3200);EM.forEach(e=>e.until=now()+2200)}
function endBig(instant){if(!BW.on)return;BW.on=false;if(BW.x)X4.stop();EM.length=0;bg.classList.remove('vis');tx.className='';setTimeout(()=>{if(!BW.on)bg.className=''},instant?0:350);const cb=BW.cb;BW.cb=null;cb&&cb()}
function skip(){if(!BW.on)return;if(!BW.done){finishBig()}else endBig()}
bg.addEventListener('mousedown',e=>{e.stopPropagation();e.preventDefault();skip()});
addEventListener('keydown',e=>{if(BW.on&&(e.code==='Space'||e.code==='Escape'||e.code==='Enter')){e.preventDefault();e.stopImmediatePropagation();skip()}},true);
// a bwTick a bigWin indulásakor
const _bw=bigWin;function bigWinR(a,b,c,x){const p=_bw(a,b,c,x);const id=BW.id;requestAnimationFrame(()=>bwTick(id));return p}

// =====================================================================
// /444 EXTRA: saját zene (156 BPM, build-up → drop → fanfár), bankjegy-vihar, örvény, lézerek, „KÖZPÉNZ!” ütemre
// =====================================================================
const X4={BPM:156,BT:60/156,BEATS:24,on:false,bi:-1,fla:0,col:0,bus:null};
const css4=document.createElement('style');css4.textContent=`
#k2kp{position:fixed;left:0;right:0;top:6%;z-index:99998;display:none;justify-content:center;gap:4.6vw;pointer-events:none;font-family:'Luckiest Guy',Impact,sans-serif;font-size:clamp(22px,4.7vw,96px);letter-spacing:2px;perspective:600px}
#k2kp.on{display:flex}
#k2kp span{display:inline-block;color:#fde047;transition:transform .09s ease-out;text-shadow:0 1px 0 #f59e0b,0 2px 0 #ea580c,0 3px 0 #c2410c,0 4px 0 #9a3412,0 5px 0 #7c2d12,0 6px 0 #7c2d12,0 8px 0 #431407,0 12px 18px #000c,0 0 34px var(--n,#f0abfc)}
#k2kp span.h{transform:scale(1.32) rotateX(18deg) translateY(-6px);color:#fff}
#k2kp.c1 span{--n:#22d3ee}#k2kp.c2 span{--n:#a3e635}#k2kp.c3 span{--n:#f472b6}
#k2kp.in{animation:k2kpin .5s cubic-bezier(.2,1.7,.4,1)}
@keyframes k2kpin{0%{transform:scale(3);opacity:0}100%{transform:none;opacity:1}}
#k2tx.k2bump #k2tt{transform:scale(1.1)}
#k2bg.k2x .ray{animation-duration:3s}
#k2bg.k2bt{filter:brightness(1.6) saturate(1.4)}
#k2bg{transition:opacity .35s,filter .12s}
#k2tx.k2drop{animation:k2sh .5s cubic-bezier(.36,.07,.19,.97) 2}
`;document.head.appendChild(css4);
const KP=document.createElement('div');KP.id='k2kp';KP.innerHTML='<span>KÖZPÉNZ!</span><span>KÖZPÉNZ!</span><span>KÖZPÉNZ!</span>';document.body.appendChild(KP);
// bankjegy-sprite (kitalált, csak „Ft” és dísz)
function noteSpr(back){return sprite(128,(x)=>{x.translate(4,36);const w=120,h=56;const g=x.createLinearGradient(0,0,w,h);
 g.addColorStop(0,back?'#5b21b6':'#16a34a');g.addColorStop(.5,back?'#7c3aed':'#4ade80');g.addColorStop(1,back?'#4c1d95':'#15803d');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.strokeStyle='#fef3c7';x.lineWidth=2;x.strokeRect(4,4,w-8,h-8);x.fillStyle='#fef3c7aa';x.beginPath();x.arc(back?w/2:30,h/2,15,0,7);x.fill();
 x.fillStyle='#14532d';x.font='bold 13px Georgia,serif';x.textAlign='center';x.fillText(back?'KP':'★',back?w/2:30,h/2+5);
 if(!back){x.fillStyle='#fefce8';x.font='bold 17px Georgia,serif';x.fillText('20 000',84,26);x.font='bold 13px Georgia,serif';x.fillText('Ft',84,44)}})}
const NOTE=noteSpr(false),NOTEB=noteSpr(true);
function noteP(x,y,vx,vy,o){return emit(Object.assign({k:6,x,y,vx,vy,g:260,drag:.035,life:rr(2.6,4.2),s:rr(.45,.85),rot:R()*6,vr:rr(-5,5),fl:R()*6,vf:rr(3,9)},o||{}))}
function noteBoom(x,y,n,sp){for(let i=0;i<n;i++){const a=R()*6.283,v=rr(.35,1)*sp;noteP(x,y,Math.cos(a)*v,Math.sin(a)*v-200)}for(let i=0;i<n/2;i++){const a=R()*6.283,v=rr(.3,1)*sp;coinP(x,y,Math.cos(a)*v,Math.sin(a)*v-300)}burst(x,y,40,sp);kick()}
function vortexP(){const r=rr(Math.max(W,H)*.45,Math.max(W,H)*.7),v=rr(220,420);return emit({k:7,ang:R()*6.283,rad:r,w:rr(2.2,3.6),rv:-v,life:r/v*.95,s:rr(.35,.7),rot:R()*6,vr:rr(-6,6),fl:R()*6,vf:rr(4,10),g:0})}
function drawNote(p,al){const s=p.s*DPR,c=Math.cos(p.rot),sn=Math.sin(p.rot),fy=Math.cos(p.fl);cx.globalAlpha=al;cx.globalCompositeOperation='source-over';
 const ay=Math.max(.06,Math.abs(fy));cx.setTransform(c*s,sn*s,-sn*s*ay,c*s*ay,p.x*DPR,p.y*DPR);cx.drawImage(fy>0?NOTE:NOTEB,-64,-64)}
// --- zene (minden hang a saját buszra, így leállítható) ---
function x4o(t,f,type,dur,vol,f2){const a=AC,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.006);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(X4.bus);o.start(t);o.stop(t+dur+.03)}
function x4n(t,dur,vol,fq,type,q,f2){const a=AC;if(!NB)noise(.01,.0001);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=NB;f.type=type||'bandpass';f.frequency.setValueAtTime(fq,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+dur);f.Q.value=q||1;
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(X4.bus);s.start(t,R()*.4);s.stop(t+dur+.02)}
const kik=(t,v)=>{x4o(t,160,'sine',.28,v||.9,42);x4n(t,.02,.25,3000,'highpass')};
const snare=(t,v)=>{x4n(t,.16,v||.35,1900,'bandpass',.8);x4o(t,210,'triangle',.08,(v||.35)*.6,140)};
const hat=(t,v)=>x4n(t,.04,v||.12,9000,'highpass');
const crash=t=>{x4n(t,1.6,.3,6000,'highpass',.5);x4o(t,90,'sine',1.2,.5,30)};
const PROG=[[110,[440,523.3,659.3]],[87.3,[349.2,440,523.3]],[130.8,[523.3,659.3,784]],[98,[392,493.9,587.3]]];
function x4music(){const a=ac();if(!a)return;X4.bus=a.createGain();X4.bus.gain.value=.85;X4.bus.connect(MG);const B=X4.BT,t0=a.currentTime+.05;X4.t0=t0;
 // BUILD-UP: 8 ütem – erősödő lábdob, gyorsuló pergő, emelkedő szinti
 for(let i=0;i<8;i++){kik(t0+i*B,.35+i*.07);hat(t0+i*B+B/2,.08)}
 for(let i=0;i<16;i++)snare(t0+4*B+i*B/4,.08+i*.018);for(let i=0;i<8;i++)snare(t0+7*B+i*B/8,.3);
 x4o(t0,180,'sawtooth',8*B,.07,1500);x4n(t0,8*B,.12,400,'bandpass',2,9000);
 for(let i=0;i<32;i++){const c=PROG[(i>>3)%4][1];x4o(t0+i*B/4,c[i%3]*(i<16?1:2),'square',.09,.035+i*.002)}
 // DROP: 16 ütem – lábdob, pergő 2/4, lábcin, basszus, szintifutam
 const d=t0+8*B;crash(d);x4o(d,55,'sine',1.6,.7,28);
 for(let i=0;i<16;i++){const t=d+i*B,ch=PROG[(i>>2)%4];kik(t);hat(t+B/2,.16);hat(t+B/4,.06);hat(t+3*B/4,.06);if(i%2)snare(t,.4);
  x4o(t+B/2,ch[0],'sawtooth',B*.45,.2);x4o(t+B/2,ch[0]/2,'sine',B*.45,.3);x4o(t,ch[0]/2,'sine',B*.3,.25);
  for(let k=0;k<4;k++){const n=ch[1][(i*4+k)%3]*(k%2?2:1);x4o(t+k*B/4,n,'square',.1,.05);x4o(t+k*B/4,n*1.005,'sawtooth',.1,.03)}}
 crash(d+8*B);for(let i=0;i<8;i++)snare(d+15*B+i*B/8,.32);
 // FANFÁR a végén
 const f=d+16*B;crash(f);[[0,440],[.13,440],[.26,440],[.39,554.4],[.62,659.3],[.85,880]].forEach(([o,n],i)=>{const dur=i===5?1.6:.12;[1,1.5,2].forEach((m,j)=>{x4o(f+o,n*m*(j===1?1:1),j?'square':'sawtooth',dur,j?.05:.11)});x4o(f+o,n/2,'triangle',dur,.12)});
 kik(f);kik(f+.85);x4o(f+.85,110,'sine',1.6,.5,55)}
function x4stop(fade){const b=X4.bus;if(!b||!AC)return;X4.bus=null;try{b.gain.cancelScheduledValues(AC.currentTime);b.gain.setValueAtTime(b.gain.value,AC.currentTime);b.gain.linearRampToValueAtTime(0,AC.currentTime+(fade||.25));setTimeout(()=>{try{b.disconnect()}catch(e){}},(fade||.25)*1000+120)}catch(e){}}
// --- vezérlés ---
X4.start=function(){X4.on=true;X4.bi=-1;X4.fla=0;X4.x0=now()+50;x4music();bg.classList.add('k2x');KP.className='';
 const until=now()+60000;EM.push({rate:18,until,fn:()=>noteP(rr(0,W),-50,rr(-80,80),rr(40,200))})};
X4.total=()=>X4.BEATS*X4.BT*1000;
X4.onBeat=function(i){const drop=i>=8;X4.fla=drop?.22:.06+i*.012;X4.col=(X4.col+1)%4;
 bg.classList.add('k2bt');setTimeout(()=>bg.classList.remove('k2bt'),110);
 if(KP.classList.contains('on')){const sp=KP.children;for(let k=0;k<3;k++)sp[k].classList.toggle('h',k===i%3);KP.className='on c'+X4.col}
 tx.classList.add('k2bump');setTimeout(()=>tx.classList.remove('k2bump'),110);
 if(i===8){// DROP
  KP.className='on in';shake(tx);tx.classList.add('k2drop');setTimeout(()=>tx.classList.remove('k2drop'),1000);flash();
  noteBoom(W/2,H/2,70,1500);[[0,H],[W,H],[0,0],[W,0]].forEach(([x,y])=>noteBoom(x,y,18,1200));
  EM.push({rate:40,until:now()+60000,fn:()=>{const s=R()<.5;noteP(s?-40:W+40,rr(H*.2,H*.9),(s?1:-1)*rr(500,900),rr(-700,-200))}})}
 if(drop&&i%2===0&&i!==8){const e=[[rr(0,W),H+20],[-20,rr(0,H)],[W+20,rr(0,H)],[rr(W*.2,W*.8),rr(H*.2,H*.6)]][R()*4|0];noteBoom(e[0],e[1],26,1100)}
 if(i===16){EM.push({rate:55,until:now()+60000,fn:vortexP});noteBoom(W/2,H*.45,60,1700);shake(tx)}};
const LCOL=['#f0abfc','#22d3ee','#a3e635','#facc15'];
X4.draw=function(dt,t){if(!X4.on)return;const e=(t-X4.x0)/1000,bi=Math.floor(e/X4.BT);if(bi!==X4.bi&&bi>=0&&bi<=X4.BEATS){X4.bi=bi;X4.onBeat(bi)}
 cx.setTransform(DPR,0,0,DPR,0,0);cx.globalCompositeOperation='lighter';
 // fényszórók (alulról söprő kúpok)
 for(let k=0;k<4;k++){const ox=W*(k+.5)/4,oy=H+20,a=-Math.PI/2+Math.sin(e*1.3+k*1.7)*.55,len=H*1.3,sp=.13;
  const g=cx.createLinearGradient(ox,oy,ox+Math.cos(a)*len,oy+Math.sin(a)*len);g.addColorStop(0,LCOL[(k+X4.col)%4]+'55');g.addColorStop(1,LCOL[(k+X4.col)%4]+'00');cx.fillStyle=g;cx.globalAlpha=.9;
  cx.beginPath();cx.moveTo(ox,oy);cx.lineTo(ox+Math.cos(a-sp)*len,oy+Math.sin(a-sp)*len);cx.lineTo(ox+Math.cos(a+sp)*len,oy+Math.sin(a+sp)*len);cx.fill()}
 // lézerek (a drop után), ütemre villannak
 if(bi>=8){const ph=1-((e/X4.BT)%1);cx.lineWidth=2.2;for(let k=0;k<10;k++){const s=k<5?0:1,ox=s?W+10:-10,oy=H*.08,a=(s?Math.PI:0)+(s?-1:1)*(.15+((Math.sin(e*2.1+k*.7)+1)/2)*1.1);
  cx.strokeStyle=LCOL[(k+X4.col)%4];cx.globalAlpha=.25+.6*ph;cx.beginPath();cx.moveTo(ox,oy);cx.lineTo(ox+Math.cos(a)*W*1.4,oy+Math.sin(a)*W*1.4);cx.stroke()}}
 // ütem-villanás
 if(X4.fla>0){cx.globalAlpha=X4.fla;cx.fillStyle=LCOL[X4.col];cx.fillRect(0,0,W,H);X4.fla=Math.max(0,X4.fla-dt*1.3)}
 cx.globalAlpha=1;cx.globalCompositeOperation='source-over'};
X4.fin=function(skipped){if(skipped){x4stop(.15);SND.fan(2);SND.slam()}KP.className='on in';noteBoom(W/2,H*.55,80,1800);
 for(let k=0;k<4;k++)setTimeout(()=>noteBoom(rr(W*.15,W*.85),rr(H*.2,H*.7),30,1200),250+k*250)};
X4.stop=function(){X4.on=false;x4stop(.4);KP.className='';bg.classList.remove('k2x','k2bt')};

// ---- kis WIN + vesztés ----
function center(el){if(!el||!el.getBoundingClientRect)return[W/2,H/2];const r=el.getBoundingClientRect();if(!r.width)return[W/2,H/2];return[r.left+r.width/2,r.top+r.height/2]}
function smallWin(amt,el,betV,cur,lab,sub){const[x,y]=center(el),m=betV?amt/betV:1;const d=document.createElement('div');d.className='k2win'+(m<=1.01?' l':'');
 d.innerHTML='<b>'+(lab||(m<=1.01?'VISSZA':m>=4?'SUPER WIN':'WIN'))+'</b><i>'+(sub||('+'+fmt(amt)+' '+(cur||'zseton')))+'</i>';if(lab)d.classList.remove('l');d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1800);
 if(m>1.01){SND.small();burst(x,y,m>=4?60:34,520);coinBurst(x,y,m>=4?16:8,600);for(let i=0;i<(m>=4?30:14);i++)confP(x,y,rr(-350,350),rr(-650,-200))}else SND.chime()}
function loseFx(el){SND.lose();if(el){el.classList.remove('k2lose');void el.offsetWidth;el.classList.add('k2lose');setTimeout(()=>el.classList.remove('k2lose'),480)}
 vig.classList.remove('go');void vig.offsetWidth;vig.classList.add('go')}
function result(w,betV,el,cur){if(w<=0)return loseFx(el);const m=w/Math.max(1,betV||w);if(m>=TIERS[0][1])return bigWinR(w,betV,cur);smallWin(w,el,betV,cur)}

// =====================================================================
// /444 – garantált BIG WIN a következő nyerőgép-pörgetésre
// =====================================================================
const armed=()=>!!LSG('k3x160force',false);
function arm(){LSS('k3x160force',true);updArm();return'🎰 /444 élesítve: a következő NYERŐGÉP-pörgetés garantált BIG WIN (3×7️⃣ = tét ×100, játékbeli zseton). A napi veszteséghatár érvényes.'}
function updArm(){const e=$('k2armI');if(e)e.style.display=armed()?'':'none'}
const is444=c=>/^\/?444$/.test(String(c||'').trim());
{const oz=window.zalqnCheat;window.zalqnCheat=function(c){if(is444(c))return arm();return oz?oz.apply(this,arguments):null}}

// =====================================================================
// NYERŐGÉP – új pörgetés (az extra10 belső állapotát használja: window._x10k)
// =====================================================================
// ---- nyerőgép 2.0: kar, fényfüzér, parallaxis, szorzólétra, bónuszkör, combo, szimbólum-animációk ----
const css2=document.createElement('style');css2.textContent=`
.k2reels{overflow:visible}
.k2reels.idle:before{animation-duration:1.6s}
.k2reels.win:before{animation:k2bulbW .18s steps(2) infinite}
.k2reels.bon{border-color:#e879f9;box-shadow:0 0 0 3px #1a0d33,0 0 34px #e879f9aa,inset 0 0 30px #000a}
.k2reels.bon:before{filter:hue-rotate(260deg) brightness(1.3)}
@keyframes k2bulbW{0%{background-position:0 0;filter:hue-rotate(0) brightness(1.5)}50%{background-position:9px 9px;filter:hue-rotate(180deg) brightness(1.8)}}
.k2par{position:absolute;inset:0;border-radius:19px;overflow:hidden;z-index:-1;pointer-events:none;background:radial-gradient(ellipse at 50% 120%,#7e22ce55,transparent 60%),linear-gradient(160deg,#2a1450,#120824)}
.k2par i{position:absolute;inset:-30px;transition:transform .25s ease-out;background:radial-gradient(circle,#fde68acc 0 1px,transparent 1.6px) 0 0/37px 41px,radial-gradient(circle,#f0abfc99 0 1.2px,transparent 2px) 13px 7px/53px 47px}
.k2par i+i{background:radial-gradient(circle,#ffffffee 0 1.6px,transparent 2.4px) 5px 9px/71px 67px;opacity:.7}
.x10reel:before{content:'';position:absolute;top:0;left:-70%;width:45%;height:100%;z-index:3;pointer-events:none;background:linear-gradient(100deg,transparent,#ffffff77,transparent);transform:skewX(-18deg);animation:k2sweep 4.5s ease-in-out infinite}
#x10r1:before{animation-delay:.25s}#x10r2:before{animation-delay:.5s}
.k2lev{position:absolute;right:-50px;top:18px;width:34px;height:120px;cursor:pointer;z-index:4}
.k2lev .base{position:absolute;left:4px;bottom:-6px;width:26px;height:30px;border-radius:8px;background:linear-gradient(90deg,#78350f,#facc15,#78350f);box-shadow:0 3px 8px #000a}
.k2lev .arm{position:absolute;left:14px;bottom:14px;width:6px;height:96px;border-radius:3px;background:linear-gradient(90deg,#9ca3af,#f3f4f6,#6b7280);transform-origin:50% 100%;transition:transform .12s}
.k2lev .arm b{position:absolute;left:-11px;top:-24px;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fecaca,#dc2626 55%,#7f1d1d);box-shadow:0 0 12px #f87171aa}
.k2lev:hover .arm b{box-shadow:0 0 20px #fca5a5}
.k2lev.pull .arm{animation:k2pull .55s cubic-bezier(.3,.1,.3,1.4)}
@keyframes k2pull{0%{transform:none}35%{transform:scaleY(-.55) }55%{transform:scaleY(-.5)}100%{transform:none}}
.k2lad{position:absolute;left:-56px;top:6px;bottom:6px;width:42px;display:flex;flex-direction:column-reverse;justify-content:space-between;z-index:4}
.k2lad span{display:block;text-align:center;font:900 14px 'Luckiest Guy',Impact;color:#ffffff44;border:1px solid #ffffff22;border-radius:8px;padding:3px 0;background:#0006;transition:all .3s}
.k2lad span.on{color:#1a0d33;background:linear-gradient(#fde68a,#f59e0b);border-color:#fff;box-shadow:0 0 14px #facc15;transform:scale(1.15)}
.k2lad.dim{opacity:.35}
.k2combo{position:absolute;right:10px;top:-16px;z-index:5;padding:2px 10px;border-radius:12px;font:900 15px 'Luckiest Guy',Impact;color:#fff;background:linear-gradient(90deg,#db2777,#f59e0b);box-shadow:0 0 14px #f472b6;animation:k2pop .45s cubic-bezier(.2,1.6,.4,1)}
.k2bonB{display:block!important;position:relative;z-index:3;text-align:center;margin:0 auto 8px;width:max-content;max-width:96%;padding:4px 20px;border-radius:999px;border:2px solid #facc15;background:linear-gradient(180deg,#3b1060,#1a0b2e);color:#fde047;text-shadow:0 0 8px #f0abfc,0 2px 0 #7c2d12;font:900 20px 'Luckiest Guy',Impact;letter-spacing:1px;animation:k2bonP 1s ease-in-out infinite alternate}@keyframes k2bonP{from{box-shadow:0 0 8px #f0abfc66}to{box-shadow:0 0 24px #facc15,0 0 40px #f0abfc88}}
.k2h2{animation:k2ip 2.2s ease-in-out infinite;display:inline-block}
@keyframes k2ip{50%{transform:scale(1.04);text-shadow:0 0 16px #f472b6,0 0 4px #fff}}
#x10spinB.k2idle{animation:k2bt 1.8s ease-in-out infinite}
@keyframes k2bt{50%{box-shadow:0 0 28px #facc15,0 0 6px #fff}}
.x10reel.k2sus{animation:k2susp .3s ease-in-out infinite alternate,k2rum .07s linear infinite}
@keyframes k2rum{25%{transform:translate(1.5px,-1px)}75%{transform:translate(-1.5px,1px)}}
.k2sym{display:inline-block}
.k2a0{animation:k2jump .5s cubic-bezier(.3,1.6,.5,1) 3}
@keyframes k2jump{40%{transform:translateY(-22px) scale(1.15,.9)}70%{transform:translateY(0) scale(.9,1.12)}}
.k2a1{animation:k2spinY .7s ease-in-out 2}
@keyframes k2spinY{to{transform:rotateY(360deg) scale(1.1)}}
.k2a2{animation:k2swing .35s ease-in-out 5 alternate;transform-origin:50% 10%}
@keyframes k2swing{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}
.k2a3{animation:k2star 1s linear 2;filter:drop-shadow(0 0 10px #facc15)}
@keyframes k2star{50%{transform:rotate(180deg) scale(1.35)}to{transform:rotate(360deg)}}
.k2a4{animation:k2elec .09s steps(2) 18;filter:drop-shadow(0 0 8px #67e8f9) drop-shadow(0 0 2px #fff)}
@keyframes k2elec{0%{transform:translate(-2px,1px) scale(1.12);filter:drop-shadow(0 0 14px #67e8f9) brightness(1.8)}100%{transform:translate(2px,-1px) scale(1.05)}}
.k2a5{animation:k2fire .25s ease-in-out 8 alternate;filter:drop-shadow(0 -6px 10px #f97316) drop-shadow(0 0 4px #fde047)}
@keyframes k2fire{to{transform:scale(1.2) translateY(-4px);filter:drop-shadow(0 -10px 18px #ef4444) drop-shadow(0 0 6px #fde047)}}
.k2pz{position:fixed;z-index:99996;pointer-events:none;transform:translate(-50%,-50%);font:900 20px 'Luckiest Guy',Impact;color:#fde68a;text-shadow:0 0 10px #facc15,0 2px 0 #92400e;animation:k2pz 1.4s ease-out forwards}
@keyframes k2pz{0%{opacity:0;transform:translate(-50%,-20%) scale(.5)}20%{opacity:1;transform:translate(-50%,-60%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-260%) scale(1)}}
.k2mul{position:fixed;z-index:99996;pointer-events:none;transform:translate(-50%,-50%);font:900 110px 'Luckiest Guy',Impact;background:linear-gradient(#fff,#facc15 45%,#ea580c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 5px 0 #7c2d12) drop-shadow(0 0 30px #f97316);animation:k2mul 1.5s cubic-bezier(.2,1.4,.4,1) forwards}
@keyframes k2mul{0%{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}25%{transform:translate(-50%,-50%) scale(.9) rotate(4deg);opacity:1}40%{transform:translate(-50%,-50%) scale(1.1)}80%{opacity:1}100%{transform:translate(-50%,-90%) scale(.8);opacity:0}}
#x10M>div.k2zoom{transition:transform .6s cubic-bezier(.2,.9,.3,1.2);transform:scale(1.12)}
#x10M>div{transition:transform .4s ease}
#k2in{position:fixed;inset:0;z-index:99998;display:none;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:radial-gradient(circle,#4a044ecc,#0b0418f2 70%);font-family:'Luckiest Guy',Impact,sans-serif;text-align:center}
#k2in.on{display:flex}
#k2in .t{font-size:clamp(56px,11vw,150px);background:linear-gradient(100deg,#fff,#f0abfc 25%,#facc15 50%,#67e8f9 75%,#fff);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 #3b0764) drop-shadow(0 0 30px #e879f9);animation:k2pop .7s cubic-bezier(.2,1.6,.4,1) both,k2shine 1.5s linear infinite}
#k2in .s{margin-top:14px;font-size:clamp(20px,3vw,34px);color:#fff;text-shadow:0 0 14px #e879f9;animation:k2pop .7s .35s cubic-bezier(.2,1.6,.4,1) both}
#k2in .c{margin-top:22px;display:flex;gap:14px}
#k2in .c b{font-size:44px;display:inline-block;animation:k2pop .5s cubic-bezier(.2,1.6,.4,1) both,k2jump .6s ease-in-out infinite}
.k2nm{color:#93c5fd}`;document.head.appendChild(css2);
const LAD=[1,2,3,5,10],SYA={'🍒':0,'🍋':1,'🔔':2,'⭐':3,'💎':4,'7️⃣':5};
const BON={left:0,lad:0,bet:50};let COMBO=0,autoT=0;
SND.lever=()=>{tone(90,'sine',.25,.3,0,60);noise(.18,.15,0,700,1.5);tone(1800,'square',.03,.04,.2)};
SND.drum=()=>{noise(.05,.16,0,180+Math.random()*80,1.2,'lowpass');tone(70,'sine',.06,.1)};
SND.bass=()=>{tone(55,'sine',.7,.5,0,35);noise(.3,.15,0,300,1,'lowpass')};
SND.near=()=>{[523,494,466,440].forEach((f,i)=>tone(f,'triangle',.22,.08,i*.13))};
SND.bonus=()=>{[523,659,784,1047,1319,1568,2093].forEach((f,i)=>{tone(f,'square',.15,.05,i*.07);tone(f,'sine',.4,.07,i*.07)});SND.fan(2)};
SND.zap=()=>{for(let i=0;i<4;i++)noise(.06,.18,i*.07,5000+Math.random()*3000,3)};
SND.fire=()=>{noise(1,.1,0,900,.6,'lowpass');noise(.6,.05,.2,2500,.8)};
// villámok a canvasra (a fő ciklus rajzolja)
const BOLTS=[];
function bolt(x1,y1,x2,y2,life,col){const pts=[[x1,y1]],n=12;for(let i=1;i<n;i++){const u=i/n;pts.push([x1+(x2-x1)*u+rr(-10,10),y1+(y2-y1)*u+rr(-16,16)])}pts.push([x2,y2]);BOLTS.push({pts,t:0,life:life||.35,c:col||'#a5f3fc'});kick()}
function drawBolts(dt){if(!BOLTS.length)return;cx.setTransform(DPR,0,0,DPR,0,0);cx.globalCompositeOperation='lighter';
 for(let i=BOLTS.length-1;i>=0;i--){const b=BOLTS[i];b.t+=dt;if(b.t>b.life){BOLTS.splice(i,1);continue}const a=1-b.t/b.life;
  [[8,b.c,.25],[3,b.c,.7],[1.2,'#fff',1]].forEach(([w,c,o])=>{cx.globalAlpha=a*o;cx.strokeStyle=c;cx.lineWidth=w;cx.beginPath();b.pts.forEach((p,j)=>j?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.stroke()})}
 cx.globalAlpha=1;cx.globalCompositeOperation='source-over'}
function flame(x,y){return emit({k:2,x:x+rr(-22,22),y:y+rr(0,20),vx:rr(-30,30),vy:rr(-260,-140),g:-60,life:rr(.4,.8),s:rr(.4,.8)})}
function floatTxt(cls,html,x,y,ms){const d=document.createElement('div');d.className=cls;d.innerHTML=html;d.style.left=x+'px';d.style.top=y+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),ms||1500);return d}
function intro(t,sub,icons){return new Promise(res=>{let el=$('k2in');if(!el){el=document.createElement('div');el.id='k2in';document.body.appendChild(el)}
 el.innerHTML='<div class="t">'+t+'</div><div class="s">'+sub+'</div><div class="c">'+(icons||[]).map((c,i)=>'<b style="animation-delay:'+(.5+i*.12)+'s,'+(i*.1)+'s">'+c+'</b>').join('')+'</div>';el.className='on';SND.bonus();flash();burst(W/2,H/2,120,1000);
 for(let i=0;i<80;i++)confP(W/2,H*.45,rr(-700,700),rr(-1000,-300));kick();let done=false;const fin=()=>{if(done)return;done=true;el.className='';res()};el.onmousedown=e=>{e.stopPropagation();fin()};setTimeout(fin,2600)})}
function slotDecor(){const r0=$('x10r0');if(!r0)return;const box=r0.parentNode;
 if(!box.classList.contains('k2reels')){box.classList.add('k2reels','idle');const l=document.createElement('div');l.className='k2line';box.appendChild(l);
  const pa=document.createElement('div');pa.className='k2par';pa.innerHTML='<i></i><i></i>';box.insertBefore(pa,box.firstChild);
  const lv=document.createElement('div');lv.className='k2lev';lv.title='Húzd meg! (Szóköz)';lv.innerHTML='<div class="base"></div><div class="arm"><b></b></div>';lv.onmousedown=e=>{e.stopPropagation();pull()};box.appendChild(lv);
  const ld=document.createElement('div');ld.className='k2lad dim';ld.innerHTML=LAD.map(m=>'<span>×'+m+'</span>').join('');box.appendChild(ld)}
 const ld=box.querySelector('.k2lad');if(ld){ld.classList.toggle('dim',!BON.left);[...ld.children].forEach((s,i)=>s.classList.toggle('on',!!BON.left&&i===BON.lad))}
 box.classList.toggle('bon',!!BON.left);
 let cb=box.querySelector('.k2combo');if(COMBO>=2){if(!cb){cb=document.createElement('div');cb.className='k2combo';box.appendChild(cb)}const ct='🔥 COMBO ×'+COMBO;if(cb.textContent!==ct)cb.textContent=ct}else if(cb)cb.remove();
 let bb=document.querySelector('#x10MB .k2bonB');if(BON.left){if(!bb){bb=document.createElement('div');bb.className='k2bonB';box.parentNode.insertBefore(bb,box)}const bt='🎁 FREE SPINS: '+BON.left+' · SZORZÓ ×'+LAD[BON.lad];if(bb.textContent!==bt)bb.textContent=bt}else if(bb)bb.remove();
 const h2=document.querySelector('#x10MB h2');if(h2&&/NYERŐGÉP/.test(h2.textContent))h2.classList.add('k2h2');
 const sb=$('x10spinB');if(sb){if(BON.left){const tt='🎁 BÓNUSZ PÖRGETÉS ('+BON.left+')';if(sb.textContent!==tt)sb.textContent=tt}sb.classList.toggle('k2idle',!window._x10k.SLOT.spin)}
 if(sb&&!$('k2armI')){const s=document.createElement('span');s.id='k2armI';s.className='k2arm';s.textContent='⚡ /444 AKTÍV';sb.parentNode.appendChild(s);updArm()}
 if(sb&&!document.querySelector('#x10MB .k2cmd')){const c=document.createElement('div');c.className='k2cmd';c.innerHTML='<span>⌨️ parancs:</span><input id="k2ci" maxlength="24" placeholder="pl. /444"><button type="button" id="k2cb">OK</button><span id="k2cr"></span>';
  const pr=sb.parentNode;pr.parentNode.insertBefore(c,pr.nextSibling);const inp=c.querySelector('input'),go=()=>{const v=inp.value.trim();inp.value='';const o=c.querySelector('#k2cr');
   if(is444(v)){arm();o.textContent='✅ élesítve!';o.style.color='#4ade80'}else if(v){let r=null;try{r=window.zalqnCheat&&zalqnCheat(v)}catch(e){}if(r==null)try{r=window.extraCmd&&extraCmd(v)}catch(e){}o.textContent=r!=null?String(r).slice(0,60):'❓ ismeretlen parancs';o.style.color='#fde68a'}};
  inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();go()}});inp.addEventListener('keyup',e=>e.stopPropagation());inp.addEventListener('keypress',e=>e.stopPropagation());c.querySelector('button').onclick=go}}
function pull(){const K=window._x10k;if(!K||K.SLOT.spin||BW.on)return;const lv=document.querySelector('#x10MB .k2lev');if(lv){lv.classList.remove('pull');void lv.offsetWidth;lv.classList.add('pull')}SND.lever();setTimeout(()=>spinSlot(false),230)}
// parallaxis + szóköz
addEventListener('mousemove',e=>{const pa=document.querySelector('#x10MB .k2par');if(!pa)return;const dx=(e.clientX/W-.5),dy=(e.clientY/H-.5);pa.children[0].style.transform='translate('+(dx*-14)+'px,'+(dy*-10)+'px)';pa.children[1].style.transform='translate('+(dx*-30)+'px,'+(dy*-22)+'px)'},{passive:true});
addEventListener('keydown',e=>{if(e.code!=='Space'||BW.on||($('k2in')&&$('k2in').classList.contains('on')))return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 const m=$('x10M');if(!m||m.style.display==='none'||!$('x10r0'))return;e.preventDefault();e.stopImmediatePropagation();pull()},true);
const easeBack=u=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)};const BACKV=4.70158;
function spinSlot(free){const K=window._x10k;if(!K)return;const S=K.SLOT,L=K.LIM;if(S.spin)return;clearTimeout(autoT);
 const bonus=BON.left>0;let b=free?50:S.bet;
 if(bonus){b=BON.bet;BON.left--}
 else if(free){if(L.free===K.today())return;L.free=K.today();K.SV('k3x10lim',L)}else{const e=K.canBet(b);if(e){S.res=e;K.slDraw();slotDecor();loseFx(document.querySelector('#x10M>div'));return}K.bet(b)}
 const forced=armed();if(forced){LSS('k3x160force',false);updArm()}
 const fin=forced?['7️⃣','7️⃣','7️⃣']:[K.rollSym(),K.rollSym(),K.rollSym()];
 S.spin=true;S.res='';const B=$('x10spinB');if(B){B.disabled=true;B.classList.remove('k2idle')}const rs=$('x10sres');if(rs)rs.textContent='';slotDecor();
 const box=$('x10r0')&&$('x10r0').parentNode;if(box){box.classList.remove('idle','win');box.classList.add('hot')}ac();
 const near=fin[0]===fin[1];const t0=now(),stops=[650,1100,near?2700:1550];const reels=[];
 // near-miss: a 3. tárcsán a hiányzó szimbólum épp a nyerővonal fölött áll meg
 const nearSym=near&&fin[2]!==fin[0]&&SYA[fin[0]]>=3?fin[0]:null;
 for(let i=0;i<3;i++){const el=$('x10r'+i),h=(el&&el.clientHeight)||104,seq=[];for(let k=0;k<24;k++)seq.push(K.SY[R()*K.SY.length|0]);
  const st={el,h,seq,pos:0,v:0,ph:0,K:-1,fin:fin[i],cells:[],strip:null,idx:-1,from:0,dist:0,dur:0,ts:0,cur:(S.r&&S.r[i])||seq[0],ns:i===2?nearSym:null};
  if(el){el.textContent='';el.classList.remove('k2hit','k2land','k2sus');const strip=document.createElement('div');strip.className='k2st';for(let c=0;c<2;c++){const ii=document.createElement('i');ii.appendChild(document.createTextNode(''));ii.style.lineHeight=h+'px';strip.appendChild(ii);st.cells.push(ii)}el.appendChild(strip);st.strip=strip}
  reels.push(st)}
 const sym=(st,k)=>k===st.K?st.fin:(st.ns&&k===st.K+1)?st.ns:k===0?st.cur:st.seq[k%24];
 const VMAX=reels[0].h*.03;let lastTick=0,susp=false,lastDrum=0;
 function frame(){const t=now(),el=t-t0;let alive=0;
  reels.forEach((st,i)=>{if(st.ph===3)return;alive++;let blur=0;
   if(st.ph===0){let vt=VMAX*Math.min(1,el/260);if(susp&&i===2)vt=VMAX*.42;st.v+=(vt-st.v)*Math.min(1,(t-(st.lt||t))/180);if(el<260)st.v=vt;st.pos+=st.v*Math.min(50,t-(st.lt||t));st.lt=t;blur=st.v;
    if(el>=stops[i]){st.K=Math.floor(st.pos/st.h)+3;st.from=st.pos;st.dist=st.K*st.h-st.pos;st.dur=st.dist*BACKV/Math.max(.2,st.v);st.ts=t;st.ph=2}}
   else if(st.ph===2){const u=Math.min(1,(t-st.ts)/st.dur);st.pos=st.from+st.dist*easeBack(u);blur=st.v*Math.max(0,1-u*2.2);
    if(u>=1){st.pos=st.K*st.h;st.ph=3;SND.thud(i);if(st.el){st.el.classList.remove('k2sus');st.el.classList.remove('k2land');void st.el.offsetWidth;st.el.classList.add('k2land')}
     const[x,y]=center(st.el);burst(x,y+st.h*.45,10,160)}}
   const ant=el<170?-12*Math.sin(Math.PI*el/170):0,p=st.pos+ant,k=Math.floor(p/st.h),off=p-k*st.h;
   if(st.cells.length){if(k!==st.idx){st.idx=k;st.cells[0].firstChild.nodeValue=sym(st,k);st.cells[1].firstChild.nodeValue=sym(st,k+1);if(t-lastTick>45){lastTick=t;SND.tick(i*120)}}
    st.cells[0].style.transform='translateY('+off.toFixed(1)+'px)';st.cells[1].style.transform='translateY('+(off-st.h).toFixed(1)+'px)';
    const bc=blur>st.h*.018?'k2st b2':blur>st.h*.006?'k2st b1':'k2st';if(st.strip.className!==bc)st.strip.className=bc}});
  // anticipáció: az utolsó tárcsa lassul, remeg, dobpergés
  if(near&&!susp&&reels[1].ph===3&&reels[2].ph!==3){susp=true;if(reels[2].el)reels[2].el.classList.add('k2sus');SND.riser(1.5)}
  if(susp&&reels[2].ph!==3&&t-lastDrum>75){lastDrum=t;SND.drum();if(reels[2].el&&R()<.4){const[x,y]=center(reels[2].el);spark(x+rr(-50,50),y+rr(-55,55),120,.4);kick()}}
  if(alive)requestAnimationFrame(frame);else done()}
 requestAnimationFrame(frame);
 function done(){let m=0;if(fin[0]===fin[1]&&fin[1]===fin[2])m=K.SM[fin[0]];else if(fin[0]===fin[1]||fin[1]===fin[2]||fin[0]===fin[2])m=.5;else if(fin.includes('🍒'))m=.5;
  // szorzó: bónuszban a létra, egyébként ritka ×2/×5 robbanás
  let mul=1;if(bonus)mul=LAD[BON.lad];else if(m>0&&m<100){const r=R();mul=r<.01?5:r<.05?2:1}
  const w=Math.round(b*m*mul);K.pay(w);S.spin=false;S.r=fin;
  const trig=!bonus&&fin.every(s=>s==='⭐');if(trig){BON.left=5;BON.lad=0;BON.bet=b}
  if(bonus&&w>0)BON.lad=Math.min(LAD.length-1,BON.lad+1);if(!BON.left&&!trig)BON.lad=0;
  COMBO=w>b||(bonus&&w>0)?COMBO+1:0;
  S.res=w>0?'🎉 +'+fmt(w)+' zseton'+(mul>1?' (×'+mul+')':''):(nearSym?'Majdnem! 😬':'Nem nyert.');if(m>=100)K.stat('jack');K.stat('slot');
  const open=!!$('x10r0');if(open){K.slDraw();slotDecor()}
  const hit=[0,1,2].filter(i=>m>=1.5?fin.filter(s=>s===fin[i]).length>=2:(m>0&&fin[i]==='🍒'));
  const panel=document.querySelector('#x10M>div'),box=open&&$('x10r0').parentNode;
  if(box){box.classList.remove('hot');box.classList.add(w>0?'win':'idle');setTimeout(()=>{box.classList.remove('win');box.classList.add('idle')},2600)}
  if(open&&w>0){const ln=box.querySelector('.k2line');const big=m>=20||mul>1;
   if(ln&&m>=1.5){ln.classList.remove('on');void ln.offsetWidth;ln.classList.add('on')}
   const pts=hit.map(i=>center($('x10r'+i)));
   if(big&&pts.length>1){SND.zap();for(let k=0;k<5;k++)setTimeout(()=>{for(let j=0;j<pts.length-1;j++)bolt(pts[j][0],pts[j][1],pts[j+1][0],pts[j+1][1],.3,m>=40?'#f0abfc':'#a5f3fc')},k*140)}
   else if(pts.length>1){const a=pts[0],z=pts[pts.length-1];EM.push({rate:90,until:now()+700,fn:()=>{const u=R();emit({k:2,x:a[0]+(z[0]-a[0])*u,y:a[1]+rr(-3,3),vx:rr(-20,20),vy:rr(-40,40),g:0,life:rr(.3,.6),s:rr(.25,.45)})}});kick()}
   hit.forEach((i,j)=>{const e=$('x10r'+i);if(!e)return;e.classList.add('k2hit');const sy=fin[i],a=SYA[sy];e.innerHTML='<span class="k2sym k2a'+(m<1.5?0:a)+'">'+sy+'</span>';
    const[x,y]=center(e);if(a===5&&m>=1.5){EM.push({rate:60,until:now()+1600,fn:()=>flame(x,y+20)});if(j===0)SND.fire()}
    if(a===4&&m>=1.5){for(let k=0;k<6;k++)setTimeout(()=>bolt(x+rr(-45,45),y-55,x+rr(-20,20),y+rr(-10,30),.18,'#67e8f9'),k*110);if(j===0)SND.zap()}
    setTimeout(()=>floatTxt('k2pz','+'+fmt(w/hit.length),x,y-30),200+j*150)})}
  if(mul>1&&w>0&&open){setTimeout(()=>{const[x,y]=center($('x10r1'));floatTxt('k2mul','×'+mul,x,y,1500);SND.bass();burst(x,y,90,900);coinBurst(x,y,14,800)},450)}
  if(open&&!w&&nearSym){const[x,y]=center($('x10r2'));setTimeout(()=>{floatTxt('k2pz k2nm','MAJDNEM!',x,y-40,1400);SND.near()},150)}
  if(COMBO>=2&&open){const[x,y]=center(box);setTimeout(()=>{floatTxt('k2pz','🔥 COMBO ×'+COMBO,x,y-90,1400);SND.chime(.1)},500)}
  const isBig=w/Math.max(1,b)>=TIERS[0][1];
  const after=()=>{if(trig&&$('x10r0'))return intro('FREE SPINS','5 ingyen pörgetés · szorzólétra ×1 → ×10',['⭐','⭐','⭐']).then(()=>{slotDecor();autoT=setTimeout(()=>$('x10r0')&&pull(),700)});
   if(BON.left&&$('x10r0'))autoT=setTimeout(()=>{if($('x10r0')&&!BW.on)pull()},1300);else if(bonus&&!BON.left&&$('x10r0'))intro('BÓNUSZ VÉGE','Szép volt! Vissza a géphez.',['🎰'])};
  if(isBig&&panel&&open){// kamera-zoom + érme-szökőkút a gép tetejéről, aztán a nagy képernyő
   panel.classList.add('k2zoom');SND.bass();const r=box.getBoundingClientRect();BW.src=[r.left+r.width/2,r.top+8];
   EM.push({rate:70,until:now()+900,fn:()=>coinP(BW.src[0]+rr(-30,30),BW.src[1],rr(-260,260),rr(-1100,-700),rr(.3,.5))});kick();
   setTimeout(()=>{const p=bigWinR(w,b,null,forced);p.then(()=>{panel.classList.remove('k2zoom');BW.src=null;after()})},900)}
  else{setTimeout(()=>{const p=result(w,b,open?$('x10r1'):panel);(p&&p.then?p:Promise.resolve()).then(()=>{BW.src=null;after()})},120)}}}
// a kattintás a meglévő window.x10spin-en megy át (onclick="x10spin(false)")
window.x10spin=spinSlot;


// =====================================================================
// MEGFIGYELŐK – póker (extra10), extra140d játékok
// =====================================================================
let pkPrev=[],pkRes='',pkSt='bet';
function onX10(){const K=window._x10k;slotDecor();
 const cards=[...document.querySelectorAll('#x10MB .x10card')];
 if(cards.length){const cur=cards.map(c=>c.textContent);const fresh=K.PK.st==='hold'&&(pkSt!=='hold'||!pkPrev.length);
  let n=0;cards.forEach((c,i)=>{if(fresh){c.classList.add('k2deal');c.style.animationDelay=(i*.09)+'s';n++}else if(cur[i]!==pkPrev[i]){c.classList.add('k2flip');c.style.animationDelay=(n*.08)+'s';n++}});
  if(n)for(let i=0;i<Math.min(n,5);i++)setTimeout(SND.swish,i*85);pkPrev=cur}else pkPrev=[];if(K)pkSt=K.PK.st;
 if(K&&K.PK.res!==pkRes){pkRes=K.PK.res;if(cards.length&&K.PK.st==='bet'){const w=parseAmt(pkRes);if(/^🎉/.test(pkRes)){cards.forEach(c=>c.classList.add('k2glow'));setTimeout(()=>result(w,K.PK.bet,cards[2]),300)}else if(/^Semmi/.test(pkRes))loseFx(document.querySelector('#x10M>div'))}}}
let lastBet=50;const seen={};
function txtChanged(key,el){const t=el?el.textContent:'';if(seen[key]===t)return null;seen[key]=t;return t}
let bjPrev={d:[],p:[]};
function cardsOf(row){return row?[...row.querySelectorAll('.x14dC')]:[]}
function bjAnim(tb){const dr=tb.children[1],pr=tb.children[3];const D=cardsOf(dr),Pp=cardsOf(pr);
 const id=c=>c.classList.contains('h')?'#':c.textContent;const dI=D.map(id),pI=Pp.map(id);
 const newRound=!bjPrev.p.length||pI.length<bjPrev.p.length||pI[0]!==bjPrev.p[0]||pI[1]!==bjPrev.p[1];let sw=0;
 const doRow=(arr,ids,prev,isD)=>arr.forEach((c,i)=>{if(newRound){c.classList.add('k2deal');c.style.animationDelay=((i*2+(isD?1:0))*.16)+'s';sw++}
  else if(i<prev.length&&prev[i]==='#'&&ids[i]!=='#'){c.classList.add('k2flip');sw++}else if(i<prev.length&&prev[i]===ids[i])c.classList.add('k2old');else{c.classList.add('k2deal');sw++}});
 doRow(Pp,pI,bjPrev.p,false);doRow(D,dI,bjPrev.d,true);for(let i=0;i<Math.min(sw,4);i++)setTimeout(SND.swish,i*160);bjPrev={d:dI,p:pI}}
function onX14(){const P=$('x14dP');if(!P)return;const tb=P.querySelector('.x14dTb');
 // blackjack
 if(tb&&tb.children.length===5&&/^Osztó/.test(tb.children[0].textContent)){if(!tb._k2){tb._k2=1;bjAnim(tb)}const t=txtChanged('bj',tb.children[2]);
  if(t){const w=parseAmt(t);if(/BLACKJACK|Nyertél/.test(t))setTimeout(()=>{tb.querySelectorAll('.x14dC').forEach((c,i)=>{if(tb.children[3].contains(c))c.classList.add('k2glow')});result(w,lastBet,tb.children[2])},250);else if(/Vesztettél/.test(t))setTimeout(()=>loseFx(tb),200);else if(/Döntetlen/.test(t))SND.chime()}}
 else if(tb)bjPrev={d:[],p:[]};
 // kockapóker
 const di=[...P.querySelectorAll('.x14dDi.roll')].filter(d=>!d._k2);if(di.length){di.forEach((d,i)=>{d._k2=1;d.style.setProperty('--dx',rr(-90,90)+'px');d.style.setProperty('--r1',rr(200,420)+'deg');d.style.setProperty('--r2',rr(330,400)+'deg');d.style.setProperty('--r3',rr(350,370)+'deg');d.style.animationDelay=(i*.06)+'s'});SND.rattle()}
 if(tb&&tb.querySelector('.x14dDi')){const t=txtChanged('dice',tb.children[2]);if(t&&/ – /.test(t)){const w=parseAmt(t);setTimeout(()=>w>0?result(w,lastBet,tb.children[1]):loseFx(tb),250)}}
 // kaparós
 const su=$('x14dSU'),sc=$('x14dSC'),sm=$('x14dSM');
 if(sc&&!sc._k2){sc._k2=1;const g=document.createElement('div');g.className='k2glint';g.style.display='none';
  for(let i=0;i<7;i++){const s=document.createElement('i');s.style.left=rr(5,92)+'%';s.style.top=rr(8,88)+'%';s.style.animationDelay=rr(0,1.6)+'s';g.appendChild(s)}sc.parentNode.appendChild(g);
  let ls=0;const dust=e=>{if(!(e.buttons&1)&&!e.touches)return;const p=e.touches?e.touches[0]:e;const t=now();if(t-ls>60){ls=t;SND.scratch()}
   for(let i=0;i<2;i++)emit({k:3,x:p.clientX,y:p.clientY,vx:rr(-90,90),vy:rr(-160,-40),g:700,life:rr(.4,.8),c:R()<.5?'#9ca3af':'#d1d5db'});kick()};
  sc.addEventListener('mousemove',dust);sc.addEventListener('touchmove',dust,{passive:true})}
 if(su&&sm){const g=su.parentNode.querySelector('.k2glint');const active=su.children.length&&!sm.textContent;if(g)g.style.display=active?'':'none';
  const t=txtChanged('scr',sm);if(t){const w=parseAmt(t);if(w>0){[...su.children].forEach(c=>{if(t.includes(c.textContent))c.style.cssText='animation:k2hit .5s ease-in-out 3;text-shadow:0 0 18px #facc15'});result(w,100,su)}else loseFx(su.parentNode)}}
 else seen.scr=undefined;
 // lóverseny
 const hm=$('x14dHM');if(hm){const t=txtChanged('horse',hm);if(t){const w=parseAmt(t);w>0?result(w,lastBet,$('x14dHC')):loseFx($('x14dHC'))}}else seen.horse=undefined}
// a tét elkapása (a játékok onclick="_x14d.xxx()"-et hívnak)
(function wrap14(){const X=window._x14d;if(!X)return setTimeout(wrap14,500);const gb=id=>{const e=$(id);return e?+e.value||50:50};
 const w=(k,f)=>{const o=X[k];if(typeof o==='function'&&!o._k2){X[k]=function(){try{f()}catch(e){}ac();return o.apply(this,arguments)};X[k]._k2=1}};
 w('bjN',()=>{lastBet=gb('x14dbb');bjPrev={d:[],p:[]};seen.bj=undefined});w('bjD',()=>{lastBet*=2});w('dN',()=>{lastBet=gb('x14ddb');seen.dice=undefined});
 w('sN',()=>{lastBet=100;seen.scr=''});w('hGo',()=>{lastBet=gb('x14dhb');seen.horse=''});
 const P=$('x14dP');if(P)new MutationObserver(()=>{try{onX14()}catch(e){}}).observe(P,{childList:true,subtree:true,characterData:true})})();
(function obs10(){const M=$('x10MB');if(!M)return setTimeout(obs10,500);new MutationObserver(()=>{try{onX10()}catch(e){}}).observe(M,{childList:true,subtree:true})})();

// =====================================================================
// NAPI KERÉK (extra100) – kattogás a lassuláshoz igazítva, fény, nyeremény-animáció
// =====================================================================
(function wrapWheel(){const o=window.xSpin;if(typeof o!=='function')return setTimeout(wrapWheel,600);if(o._k2)return;
 window.xSpin=function(){const c=$('xWh'),ok=c&&!c.classList.contains('k2sp');const r=o.apply(this,arguments);if(!ok)return r;ac();c.classList.add('k2sp');
  // extra100: 4200 ms, e=1-(1-k)^4, ~6 fordulat → a szegmenshatár-átlépések becslése (8 cikk)
  const t0=now(),D=4200,tot=6.283*5.6,seg=6.283/8;let li=0;const res=$('xWhR');
  (function tk(){const k=Math.min(1,(now()-t0)/D),e=1-Math.pow(1-k,4),i=Math.floor(tot*e/seg);if(i!==li){li=i;SND.tick(600*(1-k))}
   if(k<1)return requestAnimationFrame(tk);c.classList.remove('k2sp');SND.thud(0);
   setTimeout(()=>{const t=res&&res.textContent||'';if(!t)return;const big=/\d{4,}|\d+\s\d{3}/.test(t);smallWin(0,c,0,'',big?'NAGY NYEREMÉNY':'WIN',t.replace(/^🎉\s*NYEREMÉNY:\s*/,''));SND.small();const[x,y]=center(c);burst(x,y,big?80:40,600);coinBurst(x,y,big?24:10,700)},60)})();
  return r};window.xSpin._k2=1})();

window._k2={result,smallWin,loseFx,SND,pull,flash,burst,coinBurst,ac,BON,big444:(a,b)=>bigWinR(a||5000,b||50,null,true),big:(a,b)=>bigWinR(a||5000,b||50),small:(a,b)=>smallWin(a||100,null,b||50),lose:()=>loseFx(document.querySelector('#x10M>div')),arm,armed,skip,live:()=>live,snd:v=>{SET.snd=!!v;LSS('k3x160set',SET)}};
})();
