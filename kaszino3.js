// kaszino3.js – 🎰 KÖZPÉNZ KASZINÓ: egységes prémium kaszinó-terem kinézet (a kaszino2.js után töltődik)
// - Kaszinó-főmenü (window.x10cas felülírva): játékkártyák canvas-előnézettel, egyenlegsáv, napi veszteséghatár
// - „KÖZPÉNZ GÉP” nyerőgép-test: neon fejléc, LED jackpot/egyenleg/tét/nyeremény, üveg-tükröződés, kifizetési tábla,
//   érmebedobó, tálca, 3D gombok (TÉT −/+, MAX TÉT, PÖRGETÉS, AUTO), króm kar
// - 🎡 RULETT (új, európai, 37 zseb): részletes kerék, golyó-animáció, posztó-tábla zsetonokkal. A tét a közös
//   extra10 canBet/bet/pay-en megy át → a napi veszteséghatár (k3x10lim) érvényes.
// - Valósághű lapok (sarok + középső szín, SVG-háttér – a DOM-szöveg nem változik, így a többi modul nem zavarodik),
//   posztó-asztalok fa/arany kerettel, zseton-stackek, kocka, kaparós keret, lottógolyók + húzás-animáció, bokeh háttér.
// Mentés: k3x160roul (rulett előzmények). Debug: _k3.lobby(), _k3.roul()
(function(){
'use strict';
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n||0).toLocaleString('hu-HU');
const K2=()=>window._k2||{};
const KX=()=>window._x10k;
const zs=()=>(window.BR&&BR.zs)|0, ft=()=>{try{return Math.floor((typeof S!=='undefined'&&S&&S.c)||0)}catch(e){return 0}};
const LSG=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const LSS=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const R=Math.random;

// =====================================================================
// CSS – egységes kaszinó-terem
// =====================================================================
const FELT="url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")";
const css=document.createElement('style');css.textContent=`
#x10M:before,#x14dM:before{content:'';position:absolute;inset:-15%;pointer-events:none;opacity:.55;
 background:radial-gradient(circle at 12% 20%,#facc1540 0 3%,transparent 7%),radial-gradient(circle at 80% 30%,#f472b630 0 4%,transparent 9%),radial-gradient(circle at 30% 80%,#22d3ee30 0 3%,transparent 8%),radial-gradient(circle at 70% 85%,#facc1530 0 5%,transparent 10%),radial-gradient(circle at 92% 70%,#a855f730 0 3%,transparent 7%),radial-gradient(circle at 50% 8%,#fde68a26 0 4%,transparent 9%);
 animation:k3bok 22s ease-in-out infinite alternate}
@keyframes k3bok{to{transform:translate(4%,-3%) scale(1.08)}}
#x10M>div,#x14dP,#x20MB.k3lot{position:relative;background:radial-gradient(ellipse at 50% -20%,#3b1d5e 0%,#160b28 55%,#0b0614 100%)!important;border:2px solid #c9a64a!important;
 box-shadow:0 0 0 1px #5b3a0a,0 0 0 5px #1a0d2b,0 0 0 6px #c9a64a66,0 24px 70px #000d,0 0 50px #facc1522!important;border-radius:20px!important;max-height:94vh!important}
#x10MB.k3wide{max-width:960px!important}
#x10M h2,#x14dP h2,#x20MB.k3lot h2{font-family:'Luckiest Guy',Impact,sans-serif!important;letter-spacing:1px;color:#fde047!important;text-shadow:0 1px 0 #f59e0b,0 2px 0 #b45309,0 3px 0 #7c2d12,0 0 18px #facc1566}
.k3bal{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:2px 0 10px;font:700 14px Rajdhani,system-ui,sans-serif}
.k3bal span{background:linear-gradient(#1f1236,#0f081c);border:1px solid #c9a64a77;border-radius:20px;padding:3px 12px;box-shadow:inset 0 1px 0 #ffffff14}
.k3bal b{color:#fde68a}.k3bal .ft b{color:#86efac}.k3bal .lim b{color:#fca5a5}
.k3back{float:right}
/* ---- lobby ---- */
.k3grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin:6px 0 10px}
.k3card{position:relative;border-radius:14px;overflow:hidden;cursor:pointer;background:#0b0614;border:1px solid #c9a64a88;box-shadow:0 6px 16px #000a;transition:transform .15s,box-shadow .15s;text-align:left}
.k3card:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 10px 24px #000c,0 0 18px #facc1566}
.k3card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
.k3card div{padding:6px 9px 8px;font:800 15px Rajdhani,system-ui;color:#fde68a}
.k3card small{display:block;font:600 11px system-ui;color:#cbd5e1;opacity:.8}
.k3card i{position:absolute;top:6px;right:6px;font:800 10px system-ui;font-style:normal;background:#dc2626;color:#fff;border-radius:8px;padding:2px 6px;box-shadow:0 0 10px #f87171}
.k3lim{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font:700 14px Rajdhani,sans-serif}
/* ---- 3D gombok ---- */
.k3btn{position:relative;border:0!important;border-radius:12px!important;padding:9px 14px!important;margin:3px!important;font:900 15px 'Luckiest Guy',Impact,sans-serif!important;letter-spacing:1px;cursor:pointer;color:#fff!important;
 background:linear-gradient(#4b5563,#1f2937)!important;box-shadow:0 5px 0 #0b0f17,0 7px 12px #000a,inset 0 1px 0 #ffffff40!important;transition:transform .06s,box-shadow .06s;text-shadow:0 1px 0 #000}
.k3btn:active,.k3btn.dn{transform:translateY(4px);box-shadow:0 1px 0 #0b0f17,0 2px 5px #000a,inset 0 1px 0 #ffffff30!important}
.k3btn.go{background:linear-gradient(#fde047,#f59e0b 60%,#b45309)!important;color:#3b1d00!important;text-shadow:0 1px 0 #fff8;box-shadow:0 6px 0 #78350f,0 8px 16px #000a,0 0 18px #f59e0b88,inset 0 1px 0 #fff!important;font-size:20px!important;padding:11px 26px!important}
.k3btn.go:active{box-shadow:0 1px 0 #78350f,0 2px 6px #000a!important}
.k3btn.red{background:linear-gradient(#f87171,#b91c1c)!important;box-shadow:0 5px 0 #7f1d1d,0 7px 12px #000a,inset 0 1px 0 #fff6!important}
.k3btn.grn{background:linear-gradient(#4ade80,#15803d)!important;box-shadow:0 5px 0 #14532d,0 7px 12px #000a,inset 0 1px 0 #fff6!important}
.k3btn.on{background:linear-gradient(#e879f9,#7e22ce)!important;box-shadow:0 5px 0 #3b0764,0 0 16px #e879f9,inset 0 1px 0 #fff6!important}
.k3btn:disabled{opacity:.45;cursor:default}
/* ---- KÖZPÉNZ GÉP ---- */
.k3mach{position:relative;margin:4px auto 6px;width:min(560px,100%);padding:12px 16px 14px;border-radius:30px 30px 20px 20px;
 background:linear-gradient(90deg,#3a2a0c 0%,#c9a64a 4%,#fff2b3 7%,#b8892a 11%,#5b3a0a 14%,#2a1450 15%,#3b1d6e 50%,#2a1450 85%,#5b3a0a 86%,#b8892a 89%,#fff2b3 93%,#c9a64a 96%,#3a2a0c 100%);
 box-shadow:0 18px 40px #000c,inset 0 2px 0 #fff6,inset 0 -6px 14px #0008}
.k3mach:before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(180deg,#ffffff22,transparent 30%,transparent 80%,#0005)}
.k3head{position:relative;margin:-4px auto 8px;width:86%;padding:6px 0 4px;border-radius:40px 40px 14px 14px;text-align:center;background:linear-gradient(#12051f,#2a0a3d);border:3px solid #c9a64a;box-shadow:inset 0 0 18px #000,0 0 22px #e879f966}
.k3head b{display:block;font:900 clamp(22px,3.2vw,34px) 'Luckiest Guy',Impact,sans-serif;letter-spacing:3px;color:#fff;text-shadow:0 0 6px #fff,0 0 14px #f0abfc,0 0 26px #e879f9,0 0 42px #c026d3;animation:k3neon 3s infinite}
.k3head small{font:700 10px Rajdhani,sans-serif;letter-spacing:3px;color:#fde68a99}
@keyframes k3neon{0%,18%,22%,60%,100%{opacity:1}20%,61%{opacity:.55}}
.k3leds{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:6px;margin-bottom:8px}
.k3led{background:#050208;border:2px solid #5b3a0a;border-radius:8px;padding:2px 6px 3px;box-shadow:inset 0 0 10px #000;text-align:right;overflow:hidden}
.k3led small{display:block;text-align:left;font:700 9px Rajdhani,sans-serif;letter-spacing:2px;color:#fde68a99}
.k3led b{position:relative;display:block;font:700 19px 'Courier New',monospace;color:#ff4d2e;text-shadow:0 0 6px #ff2d0a,0 0 12px #ff2d0a99;letter-spacing:1px;white-space:nowrap}
.k3led b:before{content:attr(data-g);position:absolute;right:0;color:#ff4d2e14;text-shadow:none}
.k3led.jp b{color:#facc15;text-shadow:0 0 6px #facc15,0 0 14px #f59e0b}.k3led.jp b:before{color:#facc1514}
.k3led.g b{color:#4ade80;text-shadow:0 0 6px #22c55e,0 0 12px #16a34a}.k3led.g b:before{color:#4ade8014}
.k3mach .k2reels{margin:0 auto 6px!important}
.k3glass{position:absolute;inset:14px 16px;border-radius:12px;pointer-events:none;z-index:3;background:linear-gradient(115deg,#ffffff30 0%,#ffffff08 22%,transparent 23%,transparent 58%,#ffffff12 60%,transparent 70%)}
.k3mach #x10sres{min-height:22px;margin:2px 0 4px;font:900 18px 'Luckiest Guy',Impact,sans-serif!important;letter-spacing:1px}
.k3ctl{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:2px;padding:8px;border-radius:14px;background:linear-gradient(#1a0d2b,#0b0614);border:2px solid #5b3a0a;box-shadow:inset 0 2px 10px #000}
.k3pay{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:8px;padding:6px;border-radius:12px;background:#0b0614cc;border:1px solid #c9a64a66}
.k3pay div{display:flex;align-items:center;justify-content:center;gap:4px;font:800 13px Rajdhani,sans-serif;color:#fde68a;background:linear-gradient(#24123f,#150a26);border-radius:8px;padding:2px 4px}
.k3pay em{font-style:normal;font-size:18px;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 2px 2px #000a)}
.k3slot{display:flex;align-items:center;justify-content:space-between;margin-top:8px;gap:10px}
.k3coin{width:46px;height:58px;border-radius:10px;background:linear-gradient(#c9a64a,#5b3a0a);box-shadow:inset 0 2px 0 #fff6,0 3px 6px #000a;display:flex;align-items:center;justify-content:center}
.k3coin:after{content:'';width:6px;height:34px;border-radius:3px;background:#000;box-shadow:inset 0 0 4px #000,0 0 6px #facc1588}
.k3tray{flex:1;height:30px;border-radius:0 0 26px 26px;background:linear-gradient(#0b0614,#2a1450 60%,#c9a64a 62%,#5b3a0a);box-shadow:inset 0 8px 12px #000;position:relative;overflow:hidden}
.k3tray i{position:absolute;bottom:4px;font-style:normal;font-size:14px;filter:drop-shadow(0 1px 1px #000)}
.x10reel .k2st i,.x10reel>span,.x10reel .k2sym{filter:drop-shadow(0 0 1px #000a) drop-shadow(0 3px 2px #0007)}
.x10reel:after{background:linear-gradient(180deg,#000b 0%,#0004 14%,transparent 32%,transparent 60%,#fff5 66%,transparent 74%,#0004 86%,#000b 100%)!important}
.k3mach .k2arm{display:none}
.k3auto{font:700 11px system-ui;color:#f0abfc}
/* ---- lapok ---- */
.x10card,.x14dC{color:transparent!important;font-size:0!important;background-color:#fffdf7!important;background-size:100% 100%!important;border-radius:8px!important;border:1px solid #d6d3c4!important}
.x14dC{width:64px!important;height:90px!important;line-height:90px!important}
.x10card{width:80px!important;height:112px!important}
.x14dC.h{background:repeating-linear-gradient(45deg,#7b1d1d 0 5px,#4c1010 5px 10px)!important;border:3px solid #fffdf7!important;box-shadow:inset 0 0 0 2px #c9a64a,0 3px 8px #0008!important}
.x10card.h{border:3px solid #facc15!important}
/* ---- asztalok ---- */
.x14dTb{background:${FELT},radial-gradient(ellipse at 50% 40%,#1c8a4c 0%,#0f5c31 55%,#083b20 100%)!important;border:10px solid transparent!important;
 border-image:linear-gradient(#7c4a1e,#3b200b) 1;border-radius:120px/80px!important;box-shadow:0 0 0 3px #c9a64a,0 0 0 13px #4a2a10,0 0 0 15px #c9a64a,0 18px 40px #000c,inset 0 0 40px #000a!important;position:relative;margin:8px 14px!important}
.x14dTb{border:0!important;outline:none}
.k3chips{position:absolute;right:8%;bottom:16%;display:flex;gap:10px;pointer-events:none}
.k3stack{position:relative;width:34px;height:40px}
.k3stack b{position:absolute;left:0;width:34px;height:12px;border-radius:50%;box-shadow:0 2px 0 #0006,inset 0 0 0 3px #fff3}
.k3chip{display:inline-block;width:30px;height:30px;border-radius:50%;vertical-align:middle;box-shadow:0 2px 4px #000a,inset 0 0 0 3px #fff8,inset 0 0 0 7px var(--c);background:repeating-conic-gradient(var(--c) 0 20deg,#fff 20deg 30deg);position:relative}
.k3chip:after{content:attr(data-v);position:absolute;inset:6px;border-radius:50%;background:var(--c);color:#fff;font:900 9px/18px system-ui;text-align:center;box-shadow:inset 0 0 0 1px #fff8}
.x14dDi{background:radial-gradient(circle at 30% 25%,#fff,#efe8d5 60%,#d6cdb3)!important;border-radius:11px!important;box-shadow:0 4px 0 #b5aa8a,0 6px 10px #000a,inset 0 -2px 4px #0002!important;color:#7f1d1d!important;font-size:38px!important}
.x14dDi.k{box-shadow:0 4px 0 #b5aa8a,0 0 16px 4px #facc15!important;border-color:#facc15!important}
div:has(> #x14dSC){padding:8px;border-radius:18px;background:linear-gradient(135deg,#fde68a,#b8892a 30%,#fff2b3 50%,#b8892a 70%,#fde68a);box-shadow:0 10px 26px #000b}
div:has(> #x14dSC):before{content:'★ KÖZPÉNZ SZERENCSE ★';display:block;font:900 15px 'Luckiest Guy',Impact;color:#5b3a0a;letter-spacing:2px;margin-bottom:6px;text-shadow:0 1px 0 #fff8}
#x14dSC,#x14dSU{top:auto!important}
div:has(> #x14dSC) .k2glint{inset:33px 8px 8px}
div:has(> #x14dSC) #x14dSC{left:8px!important;top:31px!important}
#x14dHC{border:6px solid #4a2a10;box-shadow:0 0 0 2px #c9a64a,0 12px 26px #000b}
#x14dP .x14dB{transition:transform .08s,box-shadow .08s;box-shadow:0 3px 0 #0b0614,inset 0 1px 0 #ffffff30}
#x14dP .x14dB:active{transform:translateY(2px);box-shadow:0 1px 0 #0b0614}
#x14dP canvas[data-k]{background:linear-gradient(#0b0614,#160b28);border-radius:8px;border:1px solid #c9a64a44}
#x14dP .x14dR{background:linear-gradient(90deg,#ffffff08,transparent);border-radius:10px}
/* ---- lottó ---- */
.x20num{width:38px!important;height:38px!important;border-radius:50%!important;padding:0!important;font:900 15px system-ui!important;color:#111!important;background:radial-gradient(circle at 35% 30%,#fff,#e5e7eb 55%,#9ca3af)!important;box-shadow:0 3px 6px #000a,inset 0 -3px 5px #0003!important}
.x20num.on{background:radial-gradient(circle at 35% 30%,#fff7c2,#facc15 55%,#b45309)!important;box-shadow:0 0 14px #facc15,0 3px 6px #000a!important}
.k3ball{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;margin:2px;border-radius:50%;font:900 16px system-ui;color:#111;box-shadow:0 4px 8px #000a,inset 0 -4px 6px #0003;animation:k3drop .7s cubic-bezier(.3,1.5,.5,1) both}
@keyframes k3drop{0%{transform:translateY(-90px) rotate(-200deg);opacity:0}100%{transform:none;opacity:1}}
/* ---- rulett ---- */
.k3rl{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;justify-content:center}
.k3rl canvas{width:300px;height:300px;border-radius:50%;box-shadow:0 14px 34px #000c,0 0 0 4px #c9a64a55}
.k3tab{padding:10px;border-radius:16px;background:${FELT},radial-gradient(ellipse,#1c8a4c,#0b4527);box-shadow:0 0 0 3px #c9a64a,0 0 0 10px #4a2a10,0 12px 30px #000b,inset 0 0 30px #0009}
.k3g{display:grid;grid-template-columns:34px repeat(12,32px) 34px;grid-template-rows:repeat(3,34px) 30px 30px;gap:2px}
.k3g div{position:relative;display:flex;align-items:center;justify-content:center;border:1px solid #ffffffaa;border-radius:4px;font:800 13px Rajdhani,system-ui;color:#fff;cursor:pointer;user-select:none;text-shadow:0 1px 0 #000}
.k3g div:hover{box-shadow:inset 0 0 0 99px #ffffff22}
.k3g .r{background:#b91c1c!important}.k3g .bk{background:#111827!important}.k3g .z{background:#15803d!important}
.k3g .o{font-size:12px}
.k3g .k3chip{position:absolute;width:22px;height:22px;z-index:2;pointer-events:none}
.k3g .k3chip:after{inset:4px;font-size:7px;line-height:14px}
.k3hist{display:flex;gap:3px;flex-wrap:wrap;margin:6px 0}
.k3hist span{width:24px;height:24px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font:800 11px system-ui;color:#fff;box-shadow:0 2px 4px #000a}
@media (max-height:820px){#x10MB{padding:10px 18px!important}#x10MB h2{font-size:22px!important;margin:0 0 2px!important}.k3bal{margin:0 0 6px;font-size:13px}.k3bal span{padding:1px 10px}
 .k3head{margin:-4px auto 5px;padding:3px 0 2px}.k3head b{font-size:22px}.k3head small{display:none}.k3leds{margin-bottom:5px}.k3led b{font-size:14px}.k3led small{font-size:8px}
 .k3mach{padding:8px 14px 8px}.k3mach .k2reels{padding:10px 14px!important}.x10reel{height:84px!important;line-height:84px!important;width:88px!important;font-size:48px!important}
 .k3mach #x10sres{font-size:15px!important;min-height:18px;margin:0 0 3px}.k3ctl{padding:5px}.k3btn{padding:7px 11px!important;font-size:13px!important}.k3btn.go{font-size:17px!important;padding:8px 20px!important}
 .k3pay{grid-template-columns:repeat(8,1fr);margin-top:5px;padding:4px}.k3pay div{font-size:11px;flex-direction:column;gap:0;padding:1px}.k3pay em{font-size:12px}
 .k3slot{margin-top:4px}.k3coin{display:none}.k3tray{height:18px}.k2cmd{margin-top:4px}.k3card img{aspect-ratio:2/1}.k3card div{padding:4px 8px 6px;font-size:14px}.k3grid{gap:8px}
 .k3rl canvas{width:260px;height:260px}.k3g{grid-template-columns:30px repeat(12,30px) 30px;grid-template-rows:repeat(3,30px) 26px 26px}}
`;document.head.appendChild(css);

// =====================================================================
// közös segédek
// =====================================================================
const CHIPC={10:'#2563eb',25:'#16a34a',50:'#dc2626',100:'#111827',250:'#9333ea',500:'#ea580c',1000:'#ca8a04'};
const chip=v=>'<span class="k3chip" data-v="'+(v>=1000?(v/1000)+'e':v)+'" style="--c:'+(CHIPC[v]||'#0891b2')+'"></span>';
function limLeft(){const K=KX();if(!K)return'∞';const L=K.LIM;return L.lim>0?fmt(Math.max(0,L.lim-Math.max(0,L.lost))):'∞'}
function balHTML(){return '<span class="ft">💵 Ft: <b data-k3="ft">'+fmt(ft())+'</b></span><span>🪙 Zseton: <b data-k3="zs">'+fmt(zs())+'</b></span><span class="lim">⛔ ma még tehető: <b data-k3="lim">'+limLeft()+'</b></span>'}
function balBar(host,before){if(!host||host.querySelector(':scope > .k3bal'))return;const d=document.createElement('div');d.className='k3bal';d.innerHTML=balHTML();host.insertBefore(d,before||host.firstChild)}
setInterval(()=>{document.querySelectorAll('[data-k3]').forEach(b=>{const k=b.dataset.k3,v=k==='ft'?fmt(ft()):k==='zs'?fmt(zs()):limLeft();if(b.textContent!==v)b.textContent=v});ledUpd()},400);
function openX(h,wide){const M=$('x10M'),B=$('x10MB');if(!M||!B)return;B.innerHTML=h;M.style.display='flex';B.classList.toggle('k3wide',!!wide);if(document.pointerLockElement)document.exitPointerLock()}

// =====================================================================
// valósághű lapok – SVG háttér (a szöveg rejtett, a DOM-szöveg nem változik)
// =====================================================================
const SVGC={};
function cardSVG(rank,suit){const k=rank+suit;if(SVGC[k])return SVGC[k];const red=suit==='♥'||suit==='♦',c=red?'#c81e1e':'#111';
 const face={J:'B',Q:'D',K:'K',B:'B',D:'D'}[rank];
 const mid=face?'<rect x="22" y="30" width="56" height="80" rx="6" fill="'+(red?'#fde2e2':'#e5e7eb')+'" stroke="'+c+'" stroke-width="1.5"/><text x="50" y="82" font-size="40" text-anchor="middle" fill="'+c+'" font-family="Georgia,serif" font-weight="bold">'+rank+'</text><text x="50" y="104" font-size="16" text-anchor="middle" fill="'+c+'">'+suit+'</text>'
  :'<text x="50" y="88" font-size="'+(rank==='A'?58:44)+'" text-anchor="middle" fill="'+c+'" font-family="Georgia,serif">'+suit+'</text>';
 const corner=(t)=>'<g '+t+'><text x="9" y="22" font-size="19" fill="'+c+'" font-family="Georgia,serif" font-weight="bold" text-anchor="middle" letter-spacing="-1">'+rank+'</text><text x="9" y="38" font-size="15" fill="'+c+'" text-anchor="middle">'+suit+'</text></g>';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3efe2"/></linearGradient></defs><rect x="1" y="1" width="98" height="138" rx="8" fill="url(#g)"/><rect x="5" y="5" width="90" height="130" rx="6" fill="none" stroke="#d4af37" stroke-opacity=".45"/>'+corner('transform="translate(4,0)"')+corner('transform="rotate(180 50 70) translate(4,0)"')+mid+'</svg>';
 return SVGC[k]='url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")'}
function skinCards(root){root.querySelectorAll('.x10card,.x14dC').forEach(c=>{if(c.classList.contains('h')&&c.classList.contains('x14dC'))return;const t=c.textContent.trim();if(!t||c._k3===t)return;
 const m=t.match(/^(10|[2-9AJQKBD])\s*([♠♥♦♣])$/);if(!m)return;c._k3=t;c.style.backgroundImage=cardSVG(m[1],m[2])})}

// =====================================================================
// KASZINÓ-FŐMENÜ (lobby) + előnézet-képek
// =====================================================================
const PREV={};
function prev(id,fn){if(PREV[id])return PREV[id];const c=document.createElement('canvas');c.width=320;c.height=180;const x=c.getContext('2d');
 const g=x.createRadialGradient(160,60,10,160,90,240);g.addColorStop(0,'#3b1d5e');g.addColorStop(1,'#0b0614');x.fillStyle=g;x.fillRect(0,0,320,180);
 for(let i=0;i<14;i++){x.fillStyle=['#facc1522','#f472b61c','#22d3ee1c'][i%3];x.beginPath();x.arc(R()*320,R()*180,6+R()*18,0,7);x.fill()}
 try{fn(x)}catch(e){}return PREV[id]=c.toDataURL('image/jpeg',.82)}
const felt=(x,r)=>{const g=x.createRadialGradient(160,90,10,160,90,200);g.addColorStop(0,'#1c8a4c');g.addColorStop(1,'#08391f');x.fillStyle=g;x.beginPath();x.ellipse(160,95,r||150,78,0,0,7);x.fill();x.lineWidth=8;x.strokeStyle='#4a2a10';x.stroke();x.lineWidth=2;x.strokeStyle='#c9a64a';x.stroke()};
const em=(x,s,X,Y,sz)=>{x.font=sz+'px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(s,X,Y)};
const pcard=(x,X,Y,r,s,rot)=>{x.save();x.translate(X,Y);x.rotate(rot||0);x.fillStyle='#000a';x.fillRect(-20,-27,44,62);x.fillStyle='#fffdf7';x.fillRect(-22,-30,44,62);x.fillStyle=/[♥♦]/.test(s)?'#c81e1e':'#111';x.font='bold 15px Georgia';x.textAlign='left';x.fillText(r,-19,-16);x.font='26px serif';x.textAlign='center';x.fillText(s,0,10);x.restore()};
const P={
 slot:x=>{x.fillStyle='#c9a64a';x.fillRect(70,30,180,120);x.fillStyle='#2a1450';x.fillRect(78,38,164,104);['7️⃣','7️⃣','7️⃣'].forEach((s,i)=>{x.fillStyle='#fffdf5';x.fillRect(86+i*52,58,46,64);em(x,s,109+i*52,90,34)});x.fillStyle='#f0abfc';x.font='bold 16px Impact';x.textAlign='center';x.fillText('KÖZPÉNZ GÉP',160,52)},
 poker:x=>{felt(x);[['A','♠'],['K','♠'],['D','♠'],['B','♠'],['10','♠']].forEach((c,i)=>pcard(x,92+i*34,92,c[0],c[1],(i-2)*.12))},
 roul:x=>{const cx=160,cy=90;for(let i=0;i<37;i++){x.fillStyle=i===0?'#15803d':i%2?'#b91c1c':'#111';x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,72,i/37*6.283,(i+1)/37*6.283);x.fill()}x.lineWidth=6;x.strokeStyle='#7c4a1e';x.beginPath();x.arc(cx,cy,74,0,7);x.stroke();x.fillStyle='#c9a64a';x.beginPath();x.arc(cx,cy,30,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(cx+52,cy-30,5,0,7);x.fill()},
 bj:x=>{felt(x);pcard(x,140,70,'A','♥',-.1);pcard(x,176,72,'K','♠',.1);x.fillStyle='#fde68a';x.font='bold 16px Impact';x.textAlign='center';x.fillText('BLACKJACK 3:2',160,140);[0,1,2,3].forEach(i=>{x.fillStyle='#dc2626';x.beginPath();x.ellipse(250,130-i*5,16,6,0,0,7);x.fill();x.strokeStyle='#fff';x.stroke()})},
 dice:x=>{felt(x);['⚄','⚂','⚅','⚀','⚃'].forEach((d,i)=>{x.save();x.translate(90+i*35,90);x.rotate((i-2)*.25);x.fillStyle='#f8f4e8';x.fillRect(-15,-15,30,30);x.fillStyle='#7f1d1d';x.font='30px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(d,0,2);x.restore()})},
 scr:x=>{const g=x.createLinearGradient(60,30,260,150);g.addColorStop(0,'#fde68a');g.addColorStop(.5,'#b8892a');g.addColorStop(1,'#fde68a');x.fillStyle=g;x.fillRect(60,30,200,120);x.fillStyle='#fef3c7';x.fillRect(70,48,180,94);['💎','🍀','💎','🔔','💎','⭐'].forEach((s,i)=>em(x,s,100+(i%3)*60,72+(i/3|0)*44,26));x.fillStyle='#9ca3afdd';x.beginPath();x.moveTo(170,48);x.lineTo(250,48);x.lineTo(250,142);x.lineTo(205,142);x.fill()},
 horse:x=>{x.fillStyle='#166534';x.fillRect(0,40,320,110);for(let i=0;i<4;i++){x.fillStyle=i%2?'#15803d':'#166534';x.fillRect(0,44+i*26,320,26)}x.fillStyle='#fff';x.fillRect(270,40,4,110);em(x,'🏇',120,70,30);em(x,'🏇',200,96,30);em(x,'🏇',160,122,30)},
 wheel:x=>{const c=['#f59e0b','#22c55e','#3b82f6','#ec4899','#a855f7','#14b8a6','#ef4444','#eab308'];for(let i=0;i<8;i++){x.fillStyle=c[i];x.beginPath();x.moveTo(160,90);x.arc(160,90,70,i/8*6.283,(i+1)/8*6.283);x.fill()}x.fillStyle='#111827';x.beginPath();x.arc(160,90,14,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.moveTo(236,90);x.lineTo(252,80);x.lineTo(252,100);x.fill()},
 lotto:x=>{[3,11,17,24,29].forEach((n,i)=>{const g=x.createRadialGradient(80+i*42-6,88-6,2,80+i*42,88,18);g.addColorStop(0,'#fff');g.addColorStop(1,['#facc15','#f472b6','#22d3ee','#4ade80','#fb923c'][i]);x.fillStyle=g;x.beginPath();x.arc(80+i*42,88,18,0,7);x.fill();x.fillStyle='#111';x.font='bold 14px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(n,80+i*42,89)})},
 stock:x=>{x.strokeStyle='#ffffff18';for(let i=0;i<6;i++){x.beginPath();x.moveTo(30,30+i*24);x.lineTo(290,30+i*24);x.stroke()}x.strokeStyle='#4ade80';x.lineWidth=3;x.beginPath();let y=130;for(let i=0;i<=26;i++){y=Math.max(40,Math.min(150,y+(R()-.6)*14));i?x.lineTo(30+i*10,y):x.moveTo(30,y)}x.stroke()},
 vip:x=>{em(x,'👑',160,80,64);x.fillStyle='#fde68a';x.font='bold 18px Impact';x.textAlign='center';x.fillText('VIP KLUB',160,150)}};
const GAMES=[['slot','🍒 Nyerőgép','KÖZPÉNZ GÉP · /444',()=>window.x10slot()],['roul','🎡 Rulett','európai, 37 zseb',()=>roul()],['poker','🃏 Videópóker','Bubi vagy jobb',()=>window.x10poker()],
 ['bj','🂡 Blackjack','osztó 17-nél megáll',()=>x14('bj')],['dice','🎲 Kockapóker','5 kocka, 2 újradobás',()=>x14('dice')],['scr','🪙 Kaparós','3 egyforma = nyer',()=>x14('scr')],
 ['horse','🏇 Lóverseny','6 ló, szorzók',()=>x14('horse')],['wheel','🎡 Napi kerék','naponta 1 ingyen',()=>{window.x10close&&x10close();const b=$('xWheelB');b&&b.onclick&&b.onclick()}],
 ['lotto','🎱 Lottó','sorsolás 20:00',()=>window.x20lotto&&x20lotto()],['stock','📈 Tőzsde','kitalált cégek, Ft',()=>x14('stock')],['vip','👑 VIP','szintek, napi ajándék',()=>x14('vip')]];
function x14(t){window.x10close&&x10close();window._x14d&&_x14d.open(t)}
function lobby(){const K=KX();const L=K?K.LIM:{lim:3000,free:''};const free=K&&L.free!==K.today(),wheel=localStorage.getItem('k3wheel')!==(K?K.today():'');
 openX('<h2>🎰 KÖZPÉNZ KASZINÓ</h2><div style="opacity:.7;font-size:12px;margin-top:-4px">Csak játékbeli Ft és zseton – valódi pénz semmilyen formában nincs benne.</div><div class="k3bal">'+balHTML()+'</div>'+
  '<div class="k3grid">'+GAMES.map(([id,n,s],i)=>'<div class="k3card" data-i="'+i+'"><img alt="" src="'+prev(id,P[id])+'"><div>'+n+'<small>'+s+'</small></div>'+((id==='slot'&&free)||(id==='wheel'&&wheel)?'<i>INGYEN</i>':'')+'</div>').join('')+'</div>'+
  '<div class="k3lim"><b>⛔ Napi veszteséghatár:</b> '+[[1000,'1000'],[3000,'3000'],[10000,'10 000'],[0,'nincs']].map(([v,l])=>'<button class="k3btn '+(L.lim===v?'grn':'')+'" data-lim="'+v+'">'+l+'</button>').join('')+
  '<span style="flex:1"></span><button class="k3btn red" data-close="1">BEZÁR</button></div>',true);
 const B=$('x10MB');B.querySelectorAll('.k3card').forEach(c=>c.onclick=()=>{try{K2().ac&&K2().ac()}catch(e){}GAMES[+c.dataset.i][3]()});
 B.querySelectorAll('[data-lim]').forEach(b=>b.onclick=()=>{const o=window.x10lim0||window.x10lim;try{o(+b.dataset.lim)}catch(e){}lobby()});B.querySelector('[data-close]').onclick=()=>window.x10close()}
{const o=window.x10cas;window.x10cas0=o;window.x10cas=lobby}
{const o=window.x10lim;if(o){window.x10lim0=o;window.x10lim=v=>{o(v);lobby()}}}

// =====================================================================
// KÖZPÉNZ GÉP – a nyerőgép DOM-ját géptestbe rendezi (minden slDraw után)
// =====================================================================
let AUTO=0,autoIv=0;const BETS=[10,50,100,250];
function jp(){try{return window._x14d&&_x14d.D?_x14d.D.jp:0}catch(e){return 0}}
const LEDV={};function led(id,v){const e=$(id);if(e&&e.textContent!==v){e.textContent=v;e.dataset.g='8'.repeat(Math.max(v.length,8))}}
function ledUpd(){if(!$('k3lJ'))return;const K=KX();led('k3lJ',fmt(jp()));led('k3lC',fmt(zs()));led('k3lB',String(K?(K2().BON&&K2().BON.left?K2().BON.bet:K.SLOT.bet):0));}
function machine(){const r0=$('x10r0'),B=$('x10MB');if(!r0||!B)return;const box=r0.parentNode;if(box._k3)return;box._k3=1;B.classList.add('k3wide');
 const K=KX(),S=K.SLOT,h2=B.querySelector('h2'),betRow=h2&&h2.nextElementSibling,sres=$('x10sres'),sb=$('x10spinB'),ctlRow=sb&&sb.parentNode;
 const payTxt=[...B.children].find(d=>/3 egyforma/.test(d.textContent));
 if(betRow)betRow.style.display='none';if(ctlRow)ctlRow.style.display='none';if(payTxt)payTxt.style.display='none';
 balBar(B,h2&&h2.nextSibling);
 const m=document.createElement('div');m.className='k3mach';
 const last=parseInt(String(S.res).replace(/[^\d]/g,''))||0,won=/🎉/.test(S.res);
 m.innerHTML='<div class="k3head"><b>KÖZPÉNZ GÉP</b><small>★ ★ ★ PRÉMIUM KASZINÓ ★ ★ ★</small></div>'+
  '<div class="k3leds"><div class="k3led jp"><small>💎 JACKPOT</small><b id="k3lJ"></b></div><div class="k3led"><small>ZSETON</small><b id="k3lC"></b></div><div class="k3led"><small>TÉT</small><b id="k3lB"></b></div><div class="k3led g"><small>NYEREMÉNY</small><b id="k3lW"></b></div></div>';
 box.parentNode.insertBefore(m,box);const bon=B.querySelector('.k2bonB');if(bon)m.appendChild(bon);m.appendChild(box);
 const gl=document.createElement('div');gl.className='k3glass';box.appendChild(gl);
 if(sres)m.appendChild(sres);
 const free=ctlRow&&[...ctlRow.querySelectorAll('button')].find(b=>/INGYEN/.test(b.textContent));const bonus=K2().BON&&K2().BON.left>0;
 const ctl=document.createElement('div');ctl.className='k3ctl';
 ctl.innerHTML='<button class="k3btn" data-a="m">TÉT −</button><button class="k3btn" data-a="p">TÉT +</button><button class="k3btn red" data-a="max">MAX TÉT</button>'+
  '<button class="k3btn go" data-a="spin">'+(bonus?'🎁 BÓNUSZ ('+K2().BON.left+')':'PÖRGETÉS')+'</button><button class="k3btn '+(AUTO?'on':'')+'" data-a="auto">AUTO'+(AUTO?' '+AUTO:'')+'</button>'+(free?'<button class="k3btn grn" data-a="free">🎁 INGYEN</button>':'')+
  (K2().armed&&K2().armed()?'<span class="k2arm" style="display:inline-block">⚡ /444</span>':'');
 m.appendChild(ctl);
 const pay=document.createElement('div');pay.className='k3pay';pay.innerHTML=K.SY.map(s=>'<div><em>'+s+s+s+'</em>×'+K.SM[s]+'</div>').reverse().join('')+'<div><em>⭐⭐⭐</em>+5 FREE</div><div>2 egyforma ×0,5<br>🍒 ×0,5</div>';m.appendChild(pay);
 const sl=document.createElement('div');sl.className='k3slot';sl.innerHTML='<div class="k3coin" title="érmebedobó"></div><div class="k3tray">'+(won?Array.from({length:Math.min(14,2+Math.round(Math.log2(last+1)))},(_,i)=>'<i style="left:'+(6+i*6.5)+'%">🪙</i>').join(''):'')+'</div><div class="k3coin" style="transform:scaleX(-1)"></div>';m.appendChild(sl);
 led('k3lW',won?fmt(last):'0');ledUpd();
 ctl.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=BETS.indexOf(S.bet);
  if(a==='m')window.x10sbet(BETS[Math.max(0,i-1)]);else if(a==='p')window.x10sbet(BETS[Math.min(3,i+1)]);else if(a==='max')window.x10sbet(250);
  else if(a==='spin'){K2().pull?K2().pull():window.x10spin(false)}else if(a==='free')window.x10spin(true);
  else if(a==='auto'){AUTO=AUTO?0:10;machineRefresh();if(AUTO)autoGo()}}}
function machineRefresh(){const b=document.querySelector('.k3ctl [data-a=auto]');if(b){b.textContent='AUTO'+(AUTO?' '+AUTO:'');b.classList.toggle('on',!!AUTO)}}
function autoGo(){clearInterval(autoIv);autoIv=setInterval(()=>{const K=KX();if(!AUTO||!$('x10r0')){AUTO=0;clearInterval(autoIv);return}
 if(K.SLOT.spin||(K2().BW&&K2().BW.on)||document.querySelector('#k2bg.on')||($('k2in')&&$('k2in').classList.contains('on')))return;
 if(/⛔|Nincs elég/.test(K.SLOT.res)){AUTO=0;machineRefresh();return}AUTO--;machineRefresh();K2().pull?K2().pull():window.x10spin(false);if(!AUTO)clearInterval(autoIv)},900)}

// =====================================================================
// 🎡 RULETT (európai)
// =====================================================================
const ORD=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const col=n=>n===0?'z':RED.has(n)?'r':'bk';
const RL={bets:{},chip:50,spin:false,wa:0,ba:0,br:0,hist:LSG('k3x160roul',[]),res:'',last:-1};
const OUT={red:['PIROS',n=>RED.has(n),2],black:['FEKETE',n=>n&&!RED.has(n),2],even:['PÁROS',n=>n&&n%2===0,2],odd:['PÁRATLAN',n=>n%2===1,2],low:['1–18',n=>n>=1&&n<=18,2],high:['19–36',n=>n>=19,2],
 d1:['1–12',n=>n>=1&&n<=12,3],d2:['13–24',n=>n>=13&&n<=24,3],d3:['25–36',n=>n>=25,3],c1:['2:1',n=>n&&n%3===1,3],c2:['2:1',n=>n&&n%3===2,3],c3:['2:1',n=>n&&n%3===0,3]};
function payOf(key,n){if(/^n\d+$/.test(key))return +key.slice(1)===n?36:0;const o=OUT[key];return o&&o[1](n)?o[2]:0}
const total=()=>Object.values(RL.bets).reduce((a,b)=>a+b,0);
function wheelDraw(){const c=$('k3rw');if(!c)return;const x=c.getContext('2d'),S=600,cx=300,cy=300;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,S,S);
 // fa perem
 let g=x.createRadialGradient(cx,cy,230,cx,cy,300);g.addColorStop(0,'#2a1406');g.addColorStop(.5,'#7c4a1e');g.addColorStop(.8,'#4a2a10');g.addColorStop(1,'#1a0d05');x.fillStyle=g;x.beginPath();x.arc(cx,cy,298,0,7);x.fill();
 x.lineWidth=4;x.strokeStyle='#c9a64a';x.beginPath();x.arc(cx,cy,262,0,7);x.stroke();
 // golyópálya
 g=x.createRadialGradient(cx,cy,200,cx,cy,260);g.addColorStop(0,'#3b2a1a');g.addColorStop(1,'#1a120a');x.fillStyle=g;x.beginPath();x.arc(cx,cy,260,0,7);x.fill();
 x.save();x.translate(cx,cy);x.rotate(RL.wa);const n=37,da=6.283/n;
 for(let i=0;i<n;i++){const v=ORD[i],a0=i*da-da/2-Math.PI/2;x.fillStyle=v===0?'#15803d':RED.has(v)?'#b91c1c':'#111827';x.beginPath();x.arc(0,0,222,a0,a0+da);x.arc(0,0,150,a0+da,a0,true);x.closePath();x.fill();
  x.strokeStyle='#e9c46a';x.lineWidth=2;x.beginPath();x.moveTo(Math.cos(a0)*150,Math.sin(a0)*150);x.lineTo(Math.cos(a0)*222,Math.sin(a0)*222);x.stroke();
  x.save();x.rotate(a0+da/2+Math.PI/2);x.fillStyle='#fff';x.font='bold 20px Georgia';x.textAlign='center';x.fillText(v,0,-196);x.restore()}
 x.lineWidth=3;x.strokeStyle='#e9c46a';x.beginPath();x.arc(0,0,222,0,7);x.stroke();x.beginPath();x.arc(0,0,176,0,7);x.lineWidth=1.5;x.stroke();x.beginPath();x.arc(0,0,150,0,7);x.lineWidth=3;x.stroke();
 // belső kúp + forgókereszt
 g=x.createRadialGradient(-30,-30,10,0,0,150);g.addColorStop(0,'#a0682f');g.addColorStop(.6,'#5b3412');g.addColorStop(1,'#2a1406');x.fillStyle=g;x.beginPath();x.arc(0,0,148,0,7);x.fill();
 for(let k=0;k<4;k++){x.save();x.rotate(k*Math.PI/2);g=x.createLinearGradient(0,-6,0,6);g.addColorStop(0,'#fff2b3');g.addColorStop(1,'#8a6514');x.fillStyle=g;x.fillRect(0,-5,110,10);x.beginPath();x.arc(112,0,11,0,7);x.fill();x.restore()}
 g=x.createRadialGradient(-8,-8,2,0,0,30);g.addColorStop(0,'#fff7c2');g.addColorStop(1,'#8a6514');x.fillStyle=g;x.beginPath();x.arc(0,0,28,0,7);x.fill();x.restore();
 // golyó
 const bx=cx+Math.cos(RL.ba)*RL.br,by=cy+Math.sin(RL.ba)*RL.br;x.fillStyle='#0007';x.beginPath();x.arc(bx+3,by+4,10,0,7);x.fill();g=x.createRadialGradient(bx-4,by-4,1,bx,by,10);g.addColorStop(0,'#fff');g.addColorStop(1,'#a3a3a3');x.fillStyle=g;x.beginPath();x.arc(bx,by,10,0,7);x.fill();
 // üveg-fény
 g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,'#ffffff1c');g.addColorStop(.4,'#ffffff00');x.fillStyle=g;x.beginPath();x.arc(cx,cy,298,0,7);x.fill()}
function cellHTML(key,cls,label,style){const v=RL.bets[key];return '<div class="'+cls+'" data-b="'+key+'" style="'+(style||'')+'">'+label+(v?chipTag(v):'')+'</div>'}
function chipTag(v){const cv=[1000,500,250,100,50,25,10].find(c=>v>=c)||10;return '<span class="k3chip" data-v="'+(v>=1000?Math.round(v/100)/10+'e':v)+'" style="--c:'+CHIPC[cv]+'"></span>'}
function tableHTML(){let h='<div class="k3g">'+cellHTML('n0','z','0','grid-row:1/4;grid-column:1');
 for(let c=0;c<12;c++)for(let r=0;r<3;r++){const n=c*3+(3-r);h+=cellHTML('n'+n,col(n),n,'grid-row:'+(r+1)+';grid-column:'+(c+2))}
 ['c3','c2','c1'].forEach((k,r)=>h+=cellHTML(k,'o','2:1','grid-row:'+(r+1)+';grid-column:14;background:#0b452766'));
 ['d1','d2','d3'].forEach((k,i)=>h+=cellHTML(k,'o',OUT[k][0],'grid-row:4;grid-column:'+(2+i*4)+'/'+(6+i*4)+';background:#0b452766'));
 ['low','even','red','black','odd','high'].forEach((k,i)=>h+=cellHTML(k,'o '+(k==='red'?'r':k==='black'?'bk':''),OUT[k][0],'grid-row:5;grid-column:'+(2+i*2)+'/'+(4+i*2)+(k==='red'||k==='black'?'':';background:#0b452766')));
 return h+'</div>'}
function roul(){openX('<h2>🎡 RULETT <span style="font-size:14px;opacity:.6">– európai, egy nullás</span></h2><div class="k3bal">'+balHTML()+'</div><div class="k3rl"><div style="text-align:center"><canvas id="k3rw" width="600" height="600"></canvas><div class="k3hist" id="k3rh"></div></div>'+
 '<div><div class="k3tab" id="k3rt">'+tableHTML()+'</div><div style="margin-top:10px;display:flex;flex-wrap:wrap;align-items:center;gap:6px">Zseton: '+[10,25,50,100,250].map(v=>'<span data-c="'+v+'" style="cursor:pointer;outline:'+(RL.chip===v?'3px solid #facc15':'none')+';border-radius:50%">'+chip(v)+'</span>').join('')+
 '<span style="flex:1"></span><span>Tét: <b id="k3rT" style="color:#fde68a">'+fmt(total())+'</b></span></div>'+
 '<div style="margin-top:8px"><button class="k3btn" id="k3rC">TÖRLÉS</button><button class="k3btn" id="k3rD">DUPLÁZ</button><button class="k3btn go" id="k3rS">'+(RL.mp?'TÉT LEADÁSA':'PÖRGETÉS')+'</button><button class="k3btn" id="k3rMp">'+(RL.mp?'🌐 KÖZÖS ASZTAL: BE':'🌐 Közös asztal')+'</button></div><div id="k3rMP" style="font-size:12px;color:#a5f3fc;min-height:16px">'+(RL.mp?mpLine():'')+'</div>'+
 '<div id="k3rM" style="min-height:24px;margin-top:6px;font:900 18px \'Luckiest Guy\',Impact;color:#fde68a">'+RL.res+'</div>'+
 '<div style="font-size:12px;opacity:.7">Szám 35:1 · tucat/oszlop 2:1 · piros/fekete/páros/páratlan/1–18/19–36 1:1</div></div></div>'+
 '<div style="text-align:right"><button class="k3btn" onclick="x10cas()">◀ KASZINÓ</button></div>',true);
 histDraw();if(!RL.spin){RL.br=240;RL.ba=-Math.PI/2}wheelDraw();const B=$('x10MB');
 B.querySelector('#k3rt').onclick=e=>{const c=e.target.closest('[data-b]');if(!c||RL.spin)return;const k=c.dataset.b;RL.bets[k]=(RL.bets[k]||0)+RL.chip;try{K2().SND.tick(600)}catch(x){}tblRefresh()};
 B.querySelector('#k3rt').oncontextmenu=e=>{const c=e.target.closest('[data-b]');if(!c||RL.spin)return;e.preventDefault();delete RL.bets[c.dataset.b];tblRefresh()};
 B.querySelectorAll('[data-c]').forEach(s=>s.onclick=()=>{RL.chip=+s.dataset.c;B.querySelectorAll('[data-c]').forEach(z=>z.style.outline=+z.dataset.c===RL.chip?'3px solid #facc15':'none')});
 $('k3rC').onclick=()=>{if(!RL.spin){RL.bets={};tblRefresh()}};$('k3rD').onclick=()=>{if(!RL.spin){for(const k in RL.bets)RL.bets[k]*=2;tblRefresh()}};$('k3rS').onclick=()=>rSpin();$('k3rMp').onclick=mpToggle}
function tblRefresh(){const t=$('k3rt');if(t)t.innerHTML=tableHTML();const e=$('k3rT');if(e)e.textContent=fmt(total())}
// ---- 🌐 TÖBBJÁTÉKOS RULETT (server/mod_B2: mb2_rl_*) – közös pörgetés, mindenki a saját tétjét fizeti/kapja ----
const MPK=()=>window.KR,mpOn=()=>{try{const a=MPK().acc();return a&&a.token&&!a.guest&&a.ws&&a.ws.readyState===1}catch(e){return false}};
RL.mp=false;RL.mpS=null;RL.mine=null;
function mpLine(){const s=RL.mpS;if(!s)return'Csatlakozás…';return(s.phase==='bet'?'⏳ Tétek: '+s.tm+' mp':'🎡 Pörgetés…')+' · Asztalnál: '+s.players.map(p=>p.n+(p.b?' ('+p.b+')':'')).join(', ')+(RL.mine?' · a téted: '+Object.values(RL.mine).reduce((a,b)=>a+b,0):'')}
function mpToggle(){if(!RL.mp&&!mpOn()){rMsg('A közös asztalhoz jelentkezz be!');return}RL.mp=!RL.mp;try{MPK().wsend({t:RL.mp?'mb2_rl_sit':'mb2_rl_leave'})}catch(e){}const b=$('k3rMp');if(b)b.textContent=RL.mp?'🌐 KÖZÖS ASZTAL: BE':'🌐 Közös asztal';const s=$('k3rS');if(s)s.textContent=RL.mp?'TÉT LEADÁSA':'PÖRGETÉS';const l=$('k3rMP');if(l)l.textContent=RL.mp?mpLine():''}
function mpBet(K,tb){if(RL.mine)return rMsg('Már leadtad a tétet – várd a pörgetést.');if(!RL.mpS||RL.mpS.phase!=='bet')return rMsg('Várd meg a következő kört!');const e=K.canBet(tb);if(e)return rMsg(e);K.bet(tb);RL.mine=Object.assign({},RL.bets);for(const k in RL.mine)try{MPK().wsend({t:'mb2_rl_bet',k,v:RL.mine[k]})}catch(x){}rMsg('✅ Tét leadva: '+tb+' zseton – közös pörgetés hamarosan');const l=$('k3rMP');if(l)l.textContent=mpLine()}
addEventListener('krws',ev=>{const m=ev.detail;if(!m||!RL.mp)return;if(m.t==='mb2_rl'){RL.mpS=m;const l=$('k3rMP');if(l)l.textContent=mpLine()}
 else if(m.t==='mb2_rl_spin'){if(RL.mine){RL.bets=RL.mine;RL.mine=null;rSpin(m.r,true)}else if($('k3rt')&&!RL.spin){const sv=RL.bets;RL.bets={};rSpin(m.r,true);RL.bets=sv}}});
function histDraw(){const h=$('k3rh');if(h)h.innerHTML=RL.hist.slice(-12).map(n=>'<span style="background:'+(n===0?'#15803d':RED.has(n)?'#b91c1c':'#111827')+'">'+n+'</span>').join('')}
function rMsg(t){RL.res=t;const m=$('k3rM');if(m)m.textContent=t}
function rSpin(forced,pre){const K=KX();if(RL.spin||!K)return;const tb=total();if(!tb){if(pre)return;return rMsg('Tegyél zsetont a táblára!')}
 if(!pre&&RL.mp){return mpBet(K,tb)}
 if(!pre){const e=K.canBet(tb);if(e){rMsg(e);K2().loseFx&&K2().loseFx($('k3rt'));return}K.bet(tb)}RL.spin=true;rMsg('Nincs több tét!');{const sb=$('k3rS');if(sb)sb.disabled=true}try{K2().ac()}catch(x){}
 const res=forced!=null?forced:ORD[R()*37|0],idx=ORD.indexOf(res),da=6.283/37,pocket=idx*da-Math.PI/2;// a zseb szöge a kerékhez képest
 const t0=performance.now(),D=6200,w0=RL.wa,wTurn=6.283*(2.2+R()*.6),rel0=RL.ba-RL.wa,relEnd=pocket+6.283*Math.round((rel0-pocket)/6.283)-6.283*7;let lastS=0,lastP=-1;
 (function fr(){const t=performance.now(),k=Math.min(1,(t-t0)/D),ew=1-Math.pow(1-k,3);RL.wa=w0+wTurn*ew;
  const kb=Math.min(1,k/.86),eb=1-Math.pow(1-kb,2.4);const rel=rel0+(relEnd-rel0)*eb;RL.ba=RL.wa+rel;
  RL.br=kb<.55?248:kb<1?248-(248-200)*Math.min(1,(kb-.55)/.4)+(kb>.7?Math.abs(Math.sin(kb*40))*14*(1-kb):0):200;
  wheelDraw();const p=Math.floor((RL.ba-RL.wa)/da);if(p!==lastP&&t-lastS>40&&kb<1){lastP=p;lastS=t;try{kb>.55?K2().SND.tick(300+R()*400):0}catch(x){}}
  if(k<1)return requestAnimationFrame(fr);RL.wa%=6.283;RL.ba=RL.wa+pocket;wheelDraw();
  let w=0;for(const kk in RL.bets)w+=RL.bets[kk]*payOf(kk,res);if(w>0)K.pay(w);RL.hist.push(res);RL.hist=RL.hist.slice(-30);LSS('k3x160roul',RL.hist);histDraw();RL.spin=false;
  const nm=res===0?'🟢 0':(RED.has(res)?'🔴 ':'⚫ ')+res;rMsg(nm+(w?' – NYERTÉL +'+fmt(w)+' zseton!':' – nem nyert.'));const s=$('k3rS');if(s)s.disabled=false;try{K2().SND.thud(0)}catch(x){}
  const cell=document.querySelector('[data-b="n'+res+'"]');if(cell){cell.style.boxShadow='0 0 0 3px #fff,0 0 18px 6px #facc15';cell.style.zIndex=3}
  try{K2().result(w,tb,$('k3rw'))}catch(x){}})()}

// =====================================================================
// megfigyelők: lapok, asztalok, zsetonok, lottó, Kaszinó+ fejléc
// =====================================================================
function onX10(){const B=$('x10MB');if(!B)return;skinCards(B);machine();
 const h2=B.querySelector('h2');const t=h2?h2.textContent:'';
 if(/PÓKER/.test(t)&&!B._k3p){B._k3p=1}
 if(h2&&!/KÖZPÉNZ KASZINÓ|RULETT/.test(t)&&!B.querySelector('.k3bal')&&/PÓKER|NYERŐGÉP|LOTTÓ/.test(t)){balBar(B,h2.nextSibling)}
 B.classList.toggle('k3wide',/NYERŐGÉP|RULETT|KÖZPÉNZ KASZINÓ/.test(t));
 if(/LOTTÓ/.test(t)){const bs=[...B.querySelectorAll('.x20row b')].find(b=>/·/.test(b.textContent)&&!b._k3);if(bs){bs._k3=1;const nums=bs.textContent.split('·').map(s=>s.trim()).filter(Boolean);
   bs.innerHTML=nums.map((n,i)=>'<span class="k3ball" style="animation-delay:'+(i*.35)+'s;background:radial-gradient(circle at 35% 30%,#fff,'+['#facc15','#f472b6','#22d3ee','#4ade80','#fb923c'][i%5]+' 60%)">'+n+'</span>').join('');
   nums.forEach((_,i)=>setTimeout(()=>{try{K2().SND.thud(1);K2().SND.chime()}catch(e){}},i*350+300))}}}
function onLotto(){const B=$('x20MB');if(!B)return;const h2=B.querySelector('h2'),lot=!!(h2&&/LOTTÓ/.test(h2.textContent));B.classList.toggle('k3lot',lot);if(!lot)return;
 if(!B.querySelector('.k3bal'))balBar(B,h2.nextSibling);
 const bs=[...B.querySelectorAll('.x20row b')].find(b=>/·/.test(b.textContent)&&!b._k3);if(bs){bs._k3=1;const nums=bs.textContent.split('·').map(s=>s.trim()).filter(Boolean);
  bs.innerHTML=nums.map((n,i)=>'<span class="k3ball" style="animation-delay:'+(i*.35)+'s;background:radial-gradient(circle at 35% 30%,#fff,'+['#facc15','#f472b6','#22d3ee','#4ade80','#fb923c'][i%5]+' 60%)">'+n+'</span>').join('');
  nums.forEach((_,i)=>setTimeout(()=>{try{K2().SND.thud(1);K2().SND.chime()}catch(e){}},i*350+300))}}
(function obsL(){const a=$('x20MB');if(!a)return setTimeout(obsL,700);new MutationObserver(()=>{try{onLotto()}catch(e){}}).observe(a,{childList:true,subtree:true})})();
function onX14(){const P=$('x14dP');if(!P)return;skinCards(P);
 const tb=P.querySelector('.x14dTb');if(tb&&!tb.querySelector('.k3chips')&&/Osztó|Nagypóker/.test(tb.textContent)){const s=document.createElement('div');s.className='k3chips';
  s.innerHTML=[['#dc2626',6],['#111827',4],['#16a34a',7]].map(([c,n])=>'<div class="k3stack">'+Array.from({length:n},(_,i)=>'<b style="bottom:'+(i*4)+'px;background:repeating-conic-gradient('+c+' 0 25deg,#fff 25deg 35deg)"></b>').join('')+'</div>').join('');tb.appendChild(s)}
 const h=P.querySelector('h2');if(h&&!P.querySelector('.k3back')){const b=document.createElement('button');b.className='x14dB k3back';b.textContent='◀ KASZINÓ';b.onclick=()=>{_x14d.close();lobby()};h.parentNode.insertBefore(b,h.nextSibling)}}
(function obs(){const a=$('x10MB'),b=$('x14dP');if(!a||!b)return setTimeout(obs,500);
 new MutationObserver(()=>{try{onX10()}catch(e){console.warn(e)}}).observe(a,{childList:true,subtree:true});
 new MutationObserver(()=>{try{onX14()}catch(e){console.warn(e)}}).observe(b,{childList:true,subtree:true})})();

window._k3={lobby,roul,RL,machine};window.k3casino=lobby;window.k3roul=roul;
})();
