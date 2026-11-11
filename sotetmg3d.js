// sotetmg3d.js – 🕶️ SÖTÉT PROGRAM 3D MINIJÁTÉKOK (7 db, saját three.js jelenet, VALÓDI fény = _PL)
// Minden kitalált és szatirikus („közpénz”-téma): nincs valódi anyag, recept vagy lépés – a főzés absztrakt (színek, hőfok, ritmus).
// 🧪 Keverés-labor · 🍑 Pálinkaüst · 📦 Csomagolósor · 🚗 Sürgős fuvar · 🔦 Razzia-menekülés · 🔏 Pecsételő iroda · 🎧 DJ-pult
// Pénz: minden jutalom Ft (sötét pénz, a Sötét Program pénztárcája). Ft = a fő játék pénze – pénzmosással váltható.
// Bekötés: a sotetprogram.js MG-minijátékait (főzés, buli, menekülés) 3D-re cseréli; a menüben „🎮 3D műszak” fül. Debug: _spmg
(()=>{
'use strict';
const $$=i=>document.getElementById(i);
const cl=(v,a,b)=>Math.max(a,Math.min(b,v)),RN=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(RN(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const DP=()=>window._dp&&_dp();
const PLc=()=>(typeof _PL!=='undefined'?_PL:THREE.PointLight);
let R=null,CAM=null,ON=false,PLAY=false,raf=0,last=0,K={},cur=null,S=null,GEO=null,chain=false,lastSc=.5,hudT=0;
const MC={};
const M=(c,o)=>{const k=c+'|'+(o?JSON.stringify(o):'');return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o||{})))};
const EMI=(c,i)=>M(c,{emissive:c,emissiveIntensity:i||1});
function geo(){if(GEO)return GEO;GEO={b:new THREE.BoxGeometry(1,1,1),s:new THREE.SphereGeometry(1,18,12),c:new THREE.CylinderGeometry(1,1,1,22),p:new THREE.PlaneGeometry(1,1),cn:new THREE.ConeGeometry(1,1,20)};return GEO}
function mk(g,m,x,y,z,sx,sy,sz,par){const o=new THREE.Mesh(geo()[g],m);o.position.set(x||0,y||0,z||0);o.scale.set(sx||1,sy==null?(sx||1):sy,sz==null?(sx||1):sz);(par).add(o);return o}
function ctex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t}
const SECT={};function sector(r,half){const k=r+'_'+half;if(SECT[k])return SECT[k];const g=new THREE.CircleGeometry(r,22,-Math.PI/2-half,half*2);g.rotateX(-Math.PI/2);return SECT[k]=g}
let AC=null;function beep(f,d,tp,v){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=tp||'square';o.frequency.value=f;g.gain.value=v||.05;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.1));o.stop(AC.currentTime+(d||.1)+.02)}catch(e){}}
function room(sc,wall,floor,fog){sc.background=new THREE.Color(fog);sc.fog=new THREE.Fog(fog,14,46);sc.add(new THREE.HemisphereLight(0xc7d2fe,0x1e1b4b,.55));
 mk('p',M(floor,{roughness:.9}),0,0,0,60,60,1,sc).rotation.x=-Math.PI/2;const w=mk('p',M(wall,{roughness:.95}),0,6,-6,60,12,1,sc);return w}
function sign(sc,txt,bg,fg,x,y,z,w,h){const t=ctex(512,128,(x2,W,H)=>{x2.fillStyle=bg;x2.fillRect(0,0,W,H);x2.strokeStyle=fg;x2.lineWidth=8;x2.strokeRect(4,4,W-8,H-8);x2.fillStyle=fg;x2.font='900 54px system-ui';x2.textAlign='center';x2.textBaseline='middle';x2.fillText(txt,W/2,H/2+3)});
 const m=new THREE.Mesh(geo().p,new THREE.MeshStandardMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.7}));m.position.set(x,y,z);m.scale.set(w,h,1);sc.add(m);return m}
// hőmérő (közös): üvegcső + töltés + zöld sáv
function thermo(sc,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);sc.add(g);mk('c',M(0xe2e8f0,{transparent:true,opacity:.25}),0,1,0,.13,2,.13,g);const f=mk('c',EMI(0xef4444,.8),0,0,0,.09,1,.09,g);mk('s',EMI(0xef4444,.8),0,-.05,0,.2,.2,.2,g);
 const z0=mk('b',M(0x22c55e,{transparent:true,opacity:.55,emissive:0x22c55e,emissiveIntensity:.6}),.2,1,0,.08,.4,.08,g);return{g,f,z0,set(v,lo,hi){f.scale.y=Math.max(.02,v/100*2);f.position.y=f.scale.y/2;z0.position.y=(lo+hi)/200*2;z0.scale.y=(hi-lo)/100*2}}}

// ===================== ADAT / GAZDASÁG =====================
const GI={mix:{n:'🧪 Keverés-labor',base:700},pal:{n:'🍑 Pálinkaüst',base:650},pack:{n:'📦 Csomagolósor',base:600},drive:{n:'🚗 Sürgős fuvar',base:900},hide:{n:'🔦 Razzia-menekülés',base:800},stamp:{n:'🔏 Pecsételő iroda',base:600},dj:{n:'🎧 DJ-pult',base:500}};
const REC=k=>{const D=DP().D;D.mg3=D.mg3||{};return D.mg3[k]=D.mg3[k]||{lv:1,best:0,n:0,earn:0}};
const rk=()=>{try{return DP().rank()}catch(e){return 0}};
const rewardOf=(k,sc,lv)=>Math.round(GI[k].base*sc*(1+.25*(lv-1))*(1+rk()*.05));

// ===================== OVERLAY =====================
function ui(){if($$('smg'))return;const css=document.createElement('style');css.textContent=`
#smg{position:fixed;inset:0;z-index:9650;background:#000;display:none;font-family:system-ui,sans-serif;color:#e2e8f0}
#smg canvas.r{position:absolute;inset:0;width:100%;height:100%}
#smg .pl{position:absolute;z-index:2;background:rgba(15,10,35,.8);border:1px solid rgba(167,139,250,.5);border-radius:12px;backdrop-filter:blur(6px)}
#smgTop{top:10px;left:50%;transform:translateX(-50%);padding:7px 14px;font:800 14px system-ui;display:flex;gap:12px;align-items:center;white-space:nowrap;max-width:calc(100% - 24px);overflow:hidden}
#smgTop b{color:#f0abfc}#smgInfo{top:56px;left:50%;transform:translateX(-50%);padding:6px 12px;font:700 13px system-ui;display:none;text-align:center;max-width:calc(100% - 24px)}
#smgHelp{bottom:12px;left:50%;transform:translateX(-50%);padding:6px 12px;font:600 13px system-ui;color:#cbd5e1;text-align:center;max-width:calc(100% - 24px)}
#smgX{position:absolute;top:10px;right:12px;z-index:3;background:#ef4444;color:#fff;border:0;border-radius:9px;padding:8px 12px;font-weight:800;cursor:pointer}
#smgG{right:18px;top:50%;transform:translateY(-50%);width:34px;height:240px;padding:0;display:none;overflow:hidden}
#smgG i{position:absolute;left:0;right:0;background:#22c55e66;border-top:2px solid #22c55e;border-bottom:2px solid #22c55e}#smgG u{position:absolute;left:-2px;right:-2px;height:4px;background:#f43f5e;box-shadow:0 0 8px #f43f5e}
#smgG s{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font:800 11px system-ui;text-decoration:none;white-space:nowrap}
#smgMM{left:12px;bottom:12px;width:170px;height:170px;display:none;padding:0}
#smgMsg{position:absolute;top:34%;left:50%;transform:translate(-50%,-50%);z-index:3;font:900 34px system-ui;text-shadow:0 3px 12px #000;pointer-events:none;opacity:0;transition:opacity .25s;text-align:center}
#smgCard{position:absolute;inset:0;z-index:4;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.6);backdrop-filter:blur(4px)}
#smgCard>div{width:min(560px,calc(100% - 32px));max-height:86vh;overflow:auto;background:linear-gradient(160deg,rgba(46,16,101,.95),rgba(15,23,42,.97));border:2px solid #a78bfa;border-radius:18px;padding:18px 20px;box-shadow:0 20px 60px #000c,0 0 40px #7c3aed55;font-size:14px;line-height:1.5}
#smgCard h2{margin:0 0 6px;font-size:24px;background:linear-gradient(90deg,#f0abfc,#67e8f9);-webkit-background-clip:text;color:transparent}
#smgCard .kb{background:#0f172a;border:1px solid #334155;border-radius:10px;padding:8px 10px;margin:8px 0}#smgCard .rw{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
#smgCard button{background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;border:0;border-radius:10px;padding:9px 16px;font-weight:800;cursor:pointer;font-size:14px}#smgCard button.g{background:#475569}
#smgCard .big{font:900 44px system-ui;text-align:center;margin:6px 0}
@media(max-width:700px){#smgTop{font-size:11px;gap:6px}#smgMM{width:120px;height:120px}#smgG{height:160px}}`;document.head.appendChild(css);
 const w=document.createElement('div');w.id='smg';w.innerHTML='<div id="smgTop" class="pl"></div><div id="smgInfo" class="pl"></div><div id="smgHelp" class="pl"></div><button id="smgX">✕ Kilépés (Esc)</button><div id="smgG" class="pl"><i></i><u></u><s></s></div><canvas id="smgMM" class="pl" width="170" height="170"></canvas><div id="smgMsg"></div><div id="smgCard"><div></div></div>';
 document.body.appendChild(w);$$('smgX').onclick=()=>abort();w.addEventListener('mousedown',e=>{if(PLAY&&cur&&cur.click&&e.target.tagName==='CANVAS')cur.click(S,e)})}
function msg(t,c){const m=$$('smgMsg');m.innerHTML=t;m.style.color=c||'#fff';m.style.opacity=1;clearTimeout(m._t);m._t=setTimeout(()=>m.style.opacity=0,700)}
function card(html){const c=$$('smgCard');c.firstChild.innerHTML=html;c.style.display='flex'}
const cardOff=()=>{$$('smgCard').style.display='none'};
const cardOn=()=>$$('smgCard').style.display==='flex';

// ===================== FUTTATÁS =====================
let OPT=null;
function run(key,opt){const g=GAMES[key];if(!g){opt&&opt.cb&&opt.cb(.5);return}ui();OPT=Object.assign({mode:'job'},opt||{});cur=g;
 if(!R){R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.25));R.outputEncoding=THREE.sRGBEncoding;R.domElement.className='r';$$('smg').insertBefore(R.domElement,$$('smg').firstChild);
  CAM=new THREE.PerspectiveCamera(60,1,.05,300);addEventListener('resize',()=>{if(ON)size()})}
 if(!g.sc){g.sc=new THREE.Scene();g.build(g.sc)}
 try{document.exitPointerLock()}catch(e){}ON=true;PLAY=false;K={};$$('smg').style.display='block';size();
 const rec=REC(key),lv=rec.lv;S=mkState(key,lv);g.reset(S);hudOff();
 const md=OPT.mode;const why=md==='cook'?'<b>Főzés:</b> az eredményed adja a termék <b>minőségét</b> (és így az eladási árát).':md==='escape'?'<b>Menekülés!</b> 40% alatt elkapnak (razzia: elviszik a termékek és a Ft 40%-át).':md==='party'?'<b>Afterparti:</b> az eredmény hírnevet ad.':'<b>Műszak:</b> jutalom Ft-ben (max. kb. '+DP().f$(rewardOf(key,1,lv))+'), ⚡ 10 energia.';
 card('<h2>'+g.n+'</h2><div>'+g.d+'</div><div class="kb">🎮 <b>Irányítás:</b> '+g.h+'</div><div>'+why+'</div><div style="margin-top:6px;opacity:.85">📈 Nehézség: <b>'+lv+'. szint</b> (70% felett nő) · 🏆 rekord: '+Math.round(rec.best*100)+'% · játszva: '+rec.n+'×</div><div class="rw"><button id="smgGo">▶ Indítás (Enter)</button><button class="g" id="smgNo">'+(md==='job'?'✕ Mégse (Esc)':'⏭ Kihagyom (Esc)')+'</button></div>');
 $$('smgGo').onclick=start;$$('smgNo').onclick=()=>abort(true);last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}
function start(){if(!ON||PLAY)return;if(OPT.mode==='job'){const dp=DP();if(!dp.useEnergy(10)){msg('😴 Nincs elég energia','#fca5a5');return}}cardOff();PLAY=true;S.t=0;$$('smgHelp').innerHTML='🎮 '+cur.h;beep(660,.08,'triangle');}
function size(){R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix()}
function mkState(key,lv){return{key,lv,t:0,lim:30,cur:0,info:'',g:null,mm:null,done:false,fin:s=>finish(s)}}
function hudOff(){$$('smgG').style.display='none';$$('smgMM').style.display='none';$$('smgInfo').style.display='none';$$('smgHelp').innerHTML='🎮 '+cur.h}
function hud(){const s=S,g=cur;const left=Math.max(0,s.lim-s.t);const top='<b>'+g.n+'</b><span>⏱️ '+left.toFixed(0)+' mp</span><span>🎯 '+Math.round(cl(s.cur,0,1)*100)+'%</span><span>📈 '+s.lv+'. szint</span><span>💰 '+DP().f$(DP().D.cash)+'</span>';
 const T=$$('smgTop');if(T._h!==top){T._h=top;T.innerHTML=top}const I=$$('smgInfo');if(I._h!==s.info){I._h=s.info;I.innerHTML=s.info;I.style.display=s.info?'block':'none'}
 const G=$$('smgG');if(s.g){G.style.display='block';G.children[0].style.bottom=s.g.lo+'%';G.children[0].style.height=(s.g.hi-s.g.lo)+'%';G.children[1].style.bottom=cl(s.g.v,0,100)+'%';G.children[2].textContent=s.g.l||''}else G.style.display='none';
 const mm=$$('smgMM');if(s.mm){mm.style.display='block';s.mm(mm.getContext('2d'),170)}else mm.style.display='none'}
function loop(t){if(!ON)return;raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-(last||t))/1000);last=t;
 if(PLAY&&!S.done){S.t+=dt;try{cur.up(S,dt,K)}catch(e){console.warn('spmg',e);finish(S.cur)}if(S.t>=S.lim&&!S.done)finish(cur.timeout?cur.timeout(S):S.cur)}else if(cur.idle)cur.idle(S,dt);
 hudT-=dt;if(hudT<=0){hudT=.1;hud()}R.render(cur.sc,CAM)}
function finish(sc){if(S.done)return;S.done=true;PLAY=false;sc=cl(sc||0,0,1);const key=S.key,rec=REC(key),dp=DP(),D=dp.D,md=OPT.mode;
 rec.n++;const nb=sc>rec.best;if(nb)rec.best=sc;const lv0=rec.lv;if(sc>=.7&&rec.lv<10)rec.lv++;let rw='';
 if(md==='job'){const c=rewardOf(key,sc,lv0);D.cash+=c;rec.earn+=c;D.stats.earned+=c;rw='💰 +'+dp.f$(c);
  if(key==='dj'){const r=Math.round(sc*8);D.rep+=r;rw+=' · ⭐ +'+r}if(key==='hide')dp.heat(-Math.round(sc*12));if(key==='drive')dp.heat(3);if(key==='mix'||key==='pal')dp.heat(2);
  dp.log('🎮 3D műszak – '+GI[key].n+': '+Math.round(sc*100)+'% → '+dp.f$(c))}
 else if(md==='cook')rw='🧪 Minőségre ható eredmény';else if(md==='escape')rw=sc>=.4?'😎 Leráztad őket!':'🚔 Elkaptak…';else if(md==='party')rw='⭐ Hírnév a buliból';
 dp.save();beep(sc>=.7?880:sc>=.4?520:220,.25,'triangle',.07);
 card('<h2>'+GI[key].n+' – vége</h2><div class="big">'+Math.round(sc*100)+'%</div><div style="text-align:center;font-weight:800">'+rw+(nb?' · 🏆 Új rekord!':'')+(rec.lv>lv0?' · 📈 Szint: '+rec.lv:'')+'</div>'+(S.sum?'<div class="kb">'+S.sum+'</div>':'')+'<div class="rw" style="justify-content:center">'+(md==='job'?'<button id="smgAg">↻ Újra</button>':'')+'<button class="'+(md==='job'?'g':'')+'" id="smgOk">✔ Tovább (Enter)</button></div>');
 const cb=OPT.cb;let fired=false;const close=()=>{if(fired)return;fired=true;off();if(cb){chain=true;lastSc=sc;try{cb(sc)}finally{chain=false;window._dpBr=null}}else{try{dp.draw()}catch(e){}}};
 $$('smgOk').onclick=close;if($$('smgAg'))$$('smgAg').onclick=()=>{fired=true;run(key,{mode:'job'})}}
function off(){ON=false;PLAY=false;cancelAnimationFrame(raf);cardOff();const w=$$('smg');if(w)w.style.display='none';if(!(window.sotetPanelOpen&&sotetPanelOpen())){try{window.sp3Resume&&sp3On&&sp3On()&&sp3Resume()}catch(e){}}}
function abort(fromCard){if(!ON)return;if(PLAY&&!S.done){finish(S.cur*.6);return}if(S&&S.done){$$('smgOk')&&$$('smgOk').click();return}
 // indítás előtt: munka → nincs következmény; főzés/menekülés → gyenge eredmény
 const md=OPT.mode,cb=OPT.cb;off();if(md!=='job'&&cb){const sc=md==='escape'?.3:.35;chain=true;lastSc=sc;try{cb(sc)}finally{chain=false;window._dpBr=null}}}
addEventListener('keydown',e=>{if(!ON)return;const k=e.key.toLowerCase();e.stopImmediatePropagation();if([' ','arrowup','arrowdown','arrowleft','arrowright','tab'].includes(k))e.preventDefault();
 if(k==='escape'){abort();return}if(cardOn()){if(k==='enter'||k===' '){if(S.done)$$('smgOk')&&$$('smgOk').click();else start()}return}
 if(!PLAY)return;K[k]=true;if(!e.repeat&&cur.key)cur.key(S,k)},true);
addEventListener('keyup',e=>{if(!ON)return;e.stopImmediatePropagation();K[e.key.toLowerCase()]=false},true);
addEventListener('blur',()=>{K={}});

// ===================== A JÁTÉKOK =====================
const GAMES={};
// ---------- 1) KEVERÉS-LABOR ----------
GAMES.mix={n:GI.mix.n,d:'Ferkó laborpultja. A monitor mutatja a <b>célszínt</b> – keverd ki a lombikban a három kitalált „közpénz-esszenciából” (piros Kamu-kivonat, zöld Zöldhatár-szirup, kék Hivatali kék), és közben tartsd a hőt a <b>zöld sávban</b>. 3 célszín, minél gyorsabban.',
 h:'<b>1 / 2 / 3</b> csepp (piros / zöld / kék) · <b>SPACE</b> nyomva = melegítés · <b>X</b> lombik kiürítése',
 build(sc){room(sc,0x1e293b,0x334155,0x0b1026);const P=PLc();const L=new P(0xdbeafe,1.4,14);L.position.set(0,4,2);sc.add(L);
  mk('b',M(0xe5e7eb,{metalness:.2,roughness:.4}),0,.45,0,7,.9,2.4,sc);mk('b',M(0x0f172a),0,.92,0,7.05,.06,2.45,sc);
  this.flask=mk('c',M(0xe0f2fe,{transparent:true,opacity:.22,roughness:.05}),0,1.75,0,.62,1.5,.62,sc);
  this.liq=mk('c',new THREE.MeshStandardMaterial({color:0x888888,emissive:0x222222,roughness:.2}),0,1.05,0,.56,.1,.56,sc);
  mk('c',M(0x475569,{metalness:.7}),0,.98,0,.45,.12,.45,sc);this.fl=mk('cn',EMI(0xfb923c,2),0,1.0,0,.18,.3,.18,sc);this.fl.visible=false;
  this.FL=new P(0xff7a1a,0,6,2);this.FL.position.set(0,1.1,.4);sc.add(this.FL);
  this.bot=[0xef4444,0x22c55e,0x3b82f6].map((c,i)=>{const g=new THREE.Group();g.position.set(-2.6+i*1.1+(i?0:0),.95,-.3);if(i===2)g.position.x=2.2;sc.add(g);mk('c',M(c,{transparent:true,opacity:.85,roughness:.1}),0,.45,0,.22,.9,.22,g);mk('c',M(0x111827),0,.98,0,.09,.18,.09,g);
   const lab=sign(sc,'['+(i+1)+']',['#7f1d1d','#14532d','#1e3a8a'][i],'#fff',0,0,0,.6,.24);g.add(lab);lab.position.set(0,.45,.25);return g});
  this.th=thermo(sc,3.1,.95,-.2);
  this.mc=document.createElement('canvas');this.mc.width=256;this.mc.height=128;this.mt=new THREE.CanvasTexture(this.mc);const mon=new THREE.Mesh(geo().p,new THREE.MeshBasicMaterial({map:this.mt}));mon.position.set(0,3.1,-1.15);mon.scale.set(2.4,1.2,1);sc.add(mon);mk('b',M(0x111827),0,3.1,-1.2,2.6,1.4,.06,sc);
  this.dr=[];for(let i=0;i<8;i++){const d=mk('s',new THREE.MeshStandardMaterial({color:0xffffff}),0,0,0,.07,.1,.07,sc);d.visible=false;this.dr.push({m:d,v:0,on:false})}},
 reset(s){s.lim=60;s.c=[0,0,0];s.T=40;s.n=0;s.parts=[];s.zw=Math.max(12,28-s.lv*1.7);s.tl=Math.max(9,17-s.lv*.8);this.nt(s);this.dr.forEach(d=>{d.on=false;d.m.visible=false});this.paint(s);
  CAM.position.set(0,2.7,4.4);CAM.lookAt(0,1.5,0)},
 nt(s){let t;do{t=[RI(0,3),RI(0,3),RI(0,3)]}while(t[0]+t[1]+t[2]<(s.lv>2?3:2)||(s.lv>3&&t.filter(x=>x>0).length<2));s.tg=t;s.tt=0;s.zin=0;s.zc=RN(30,70);s.c=[0,0,0];
  const x=this.mc.getContext('2d'),c=this.col(t);x.fillStyle='#020617';x.fillRect(0,0,256,128);x.fillStyle='#67e8f9';x.font='bold 20px monospace';x.fillText('CÉLSZÍN #'+(s.n+1),10,26);x.fillStyle='rgb('+c.map(v=>Math.round(v*255))+')';x.fillRect(150,12,94,104);x.fillStyle='#94a3b8';x.font='14px monospace';x.fillText('KÖZPÉNZ-',10,70);x.fillText('ESSZENCIA',10,90);x.fillText('v'+s.lv+'.0',10,112);this.mt.needsUpdate=true},
 col(c){const m=Math.max(1,...c);return c.map(v=>v/m)},
 match(a,b){const n=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l)};const A=n(a),B=n(b);if(!a[0]&&!a[1]&&!a[2])return 0;return cl(1-Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2])/1.2,0,1)},
 paint(s){const c=this.col(s.c),tot=s.c[0]+s.c[1]+s.c[2];this.liq.material.color.setRGB(.15+c[0]*.85,.15+c[1]*.85,.15+c[2]*.85);this.liq.material.emissive.setRGB(c[0]*.25,c[1]*.25,c[2]*.25);this.liq.scale.y=Math.max(.05,tot*.12);this.liq.position.y=1.02+this.liq.scale.y/2},
 key(s,k){const i=['1','2','3'].indexOf(k);if(i>=0){const d=this.dr.find(x=>!x.on);if(d){d.on=true;d.i=i;d.v=0;d.m.visible=true;d.m.material.color.setHex([0xef4444,0x22c55e,0x3b82f6][i]);const b=this.bot[i];d.m.position.set(b.position.x*.35,3,0);b.rotation.z=i===2?.6:-.6;b.userData.t=.3}beep(500+i*120,.05,'sine')}
  if(k==='x'){s.c=[0,0,0];this.paint(s);msg('🫗 Kiürítve','#93c5fd')}},
 up(s,dt,K){const heat=K[' '];s.T+=dt*(heat?28:-11)+Math.sin(s.t*1.7)*dt*(3+s.lv);s.T=cl(s.T,0,100);if(s.T>=99){s.T=55;s.c=[0,0,0];this.paint(s);msg('💥 Kifutott!','#fca5a5');beep(120,.3,'sawtooth')}
  const lo=s.zc-s.zw/2,hi=s.zc+s.zw/2,inz=s.T>=lo&&s.T<=hi;s.zc=cl(s.zc+Math.sin(s.t*.5)*dt*s.lv*1.5,s.zw/2+5,95-s.zw/2);
  s.tt+=dt;if(inz)s.zin+=dt;this.fl.visible=heat;this.fl.scale.y=.3+Math.random()*.15;this.FL.intensity=heat?2.2+Math.random()*.6:0;this.th.set(s.T,lo,hi);s.g={v:s.T,lo,hi,l:'🌡️ hő'};
  this.bot.forEach(b=>{if(b.userData.t>0){b.userData.t-=dt;if(b.userData.t<=0)b.rotation.z=0}});
  this.dr.forEach(d=>{if(!d.on)return;d.v+=dt*12;d.m.position.x*=1-dt*6;d.m.position.y-=d.v*dt;if(d.m.position.y<this.liq.position.y+this.liq.scale.y/2){d.on=false;d.m.visible=false;s.c[d.i]++;if(s.c[0]+s.c[1]+s.c[2]>12){s.c=[0,0,0];msg('🌊 Túlcsordult!','#fca5a5')}this.paint(s)}});
  const m=this.match(s.c,s.tg),zf=s.zin/Math.max(.1,s.tt);s.cur=(s.parts.reduce((a,b)=>a+b,0)+m*.6+zf*.4)/3;
  const sw=c=>'<span style="display:inline-block;width:18px;height:14px;border-radius:4px;vertical-align:middle;background:rgb('+this.col(c).map(v=>Math.round(40+v*215))+')"></span>';
  s.info='Cél '+sw(s.tg)+' · Lombik '+sw(s.c)+' · egyezés <b>'+Math.round(m*100)+'%</b> · hő a sávban <b>'+Math.round(zf*100)+'%</b> · '+(s.n+1)+'/3 · ⏳ '+Math.max(0,s.tl-s.tt).toFixed(0)+' mp';
  if(m>=.985||s.tt>=s.tl){const sp=m>=.985?cl((s.tl-s.tt)/s.tl,0,1)*.15:0;s.parts.push(cl(m*.55+zf*.35+sp+(m>=.985?.1:0),0,1));msg(m>=.985?'✅ Tökéletes szín!':'⌛ Lejárt','#86efac');beep(m>=.985?880:300,.15,'triangle');s.n++;if(s.n>=3){s.sum='Célszínek: '+s.parts.map(p=>Math.round(p*100)+'%').join(' · ');s.fin(s.parts.reduce((a,b)=>a+b,0)/3);return}this.nt(s);this.paint(s)}},
 timeout(s){return(s.parts.reduce((a,b)=>a+b,0))/3}};

// ---------- 2) PÁLINKAÜST ----------
GAMES.pal={n:GI.pal.n,d:'Pálinkás Pista rézüstje a pincében. Fűtsd az üstöt úgy, hogy a mutató a <b>zöld sávban</b> maradjon – csak akkor csöpög. A párlat három része színről ismerhető fel: <b>Eleje</b> (halványkék), <b>Szíve</b> (arany), <b>Vége</b> (zavaros barna). Mindegyiket a saját poharába gyűjtsd: váltásnál nyomd meg az <b>E</b>-t! (Kitalált, rajzfilmes folyamat.)',
 h:'<b>SPACE</b> nyomva = fűtés · <b>E</b> következő pohár (Eleje → Szíve → Vége)',
 build(sc){room(sc,0x7c2d12,0x44403c,0x1c0f0a);const P=PLc();const L=new P(0xffd59a,1.3,14);L.position.set(0,4,2.5);sc.add(L);
  mk('b',M(0x78350f,{roughness:.8}),0,.35,0,7,.7,2.6,sc);const cu=M(0xb87333,{metalness:.85,roughness:.3});
  mk('s',cu,-1.4,1.55,0,1,.85,1,sc);mk('c',cu,-1.4,2.55,0,.22,.9,.22,sc);mk('s',cu,-1.4,3.05,0,.32,.32,.32,sc);
  const pipe=mk('c',cu,-.2,2.7,0,.08,2.6,.08,sc);pipe.rotation.z=Math.PI/2.5;mk('c',M(0x92400e,{roughness:.7}),1.1,1.4,0,.55,1.4,.55,sc);mk('c',M(0x57534e,{metalness:.6}),1.1,2.12,0,.57,.06,.57,sc);
  mk('c',cu,1.9,1.1,0,.05,.5,.05,sc).rotation.z=Math.PI/2;
  this.fl=mk('cn',EMI(0xf97316,2),-1.4,.8,0,.5,.5,.5,sc);this.FL=new P(0xff6a00,0,7,2);this.FL.position.set(-1.4,.9,.8);sc.add(this.FL);
  this.gl=[];for(let i=0;i<3;i++){const g=new THREE.Group();sc.add(g);mk('c',M(0xe0f2fe,{transparent:true,opacity:.25,roughness:.05}),0,.3,0,.2,.6,.2,g);const f=mk('c',M([0x93c5fd,0xfbbf24,0x78716c][i],{roughness:.2}),0,0,0,.17,.01,.17,g);
   const lb=sign(sc,['ELEJE','SZÍVE','VÉGE'][i],['#1e3a8a','#78350f','#44403c'][i],'#fff',0,0,0,.6,.15);g.add(lb);lb.position.set(0,.8,0);this.gl.push({g,f,v:0})}
  this.dm=[0x93c5fd,0xfbbf24,0x78716c].map(c=>EMI(c,.6));this.dr=[];for(let i=0;i<10;i++){const d=mk('s',this.dm[0],2.15,1,0,.05,.07,.05,sc);d.visible=false;this.dr.push({m:d,on:false})}
  this.th=thermo(sc,-3,.75,.3);this.dt=0},
 reset(s){s.lim=55;s.T=30;s.prod=0;s.gi=0;s.good=0;s.bad=0;s.zw=Math.max(14,30-s.lv*1.6);s.zc=55;s.gust=0;this.gl.forEach((g,i)=>{g.v=0;g.f.scale.y=.01;g.g.position.set(2.15+i*.8,.7,0)});this.place(s);this.dr.forEach(d=>{d.on=false;d.m.visible=false});
  CAM.position.set(.6,2.5,5.2);CAM.lookAt(.6,1.2,0)},
 place(s){this.gl.forEach((g,i)=>{g.tx=2.15+(i-s.gi)*.8})},
 key(s,k){if(k==='e'&&s.gi<2){s.gi++;this.place(s);beep(700,.06,'sine');msg(['','🥃 Szíve-pohár','🫙 Vége-pohár'][s.gi],'#fde68a')}},
 up(s,dt,K){const heat=K[' '];if(s.lv>2&&Math.random()<dt*.15*s.lv/3){s.gust=1.2;msg('🌬️ Huzat a pincében!','#93c5fd')}s.gust=Math.max(0,s.gust-dt);
  s.T+=dt*(heat?22:-9)-s.gust*dt*14;s.T=cl(s.T,0,100);s.zc=55+Math.sin(s.t*.4)*s.lv*1.8;const lo=s.zc-s.zw/2,hi=s.zc+s.zw/2,inz=s.T>=lo&&s.T<=hi,over=s.T>hi;
  this.fl.visible=heat;this.fl.scale.set(.45,.5+Math.random()*.2,.45);this.FL.intensity=heat?2.5+Math.random():0.15;this.th.set(s.T,lo,hi);s.g={v:s.T,lo,hi,l:'🔥 üst'};
  const ph=s.prod<18?0:s.prod<78?1:2;const rate=inz?3.4:over?2:0;
  if(rate>0&&s.prod<100){const add=rate*dt;s.prod=Math.min(100,s.prod+add);const ok=s.gi===ph;const q=over?.4:1;if(ok)s.good+=add*q;else s.bad+=add;const G=this.gl[s.gi];G.v+=add;G.f.scale.y=Math.min(.55,G.v/60);G.f.position.y=G.f.scale.y/2+.02;
   this.dt-=dt;if(this.dt<=0){this.dt=.18-rate*.02;const d=this.dr.find(x=>!x.on);if(d){d.on=true;d.m.visible=true;d.m.material=this.dm[ph];d.m.position.set(2.15,1.05,0)}}}
  this.dr.forEach(d=>{if(!d.on)return;d.m.position.y-=dt*2.4;if(d.m.position.y<.8){d.on=false;d.m.visible=false}});
  this.gl.forEach(g=>{g.g.position.x+=(g.tx-g.g.position.x)*Math.min(1,dt*8)});
  s.cur=s.good/100;s.info='Most csöpög: <b style="color:'+['#93c5fd','#fbbf24','#a8a29e'][ph]+'">'+['ELEJE','SZÍVE','VÉGE'][ph]+'</b> · pohár: <b>'+['Eleje','Szíve','Vége'][s.gi]+'</b> · kész: '+Math.round(s.prod)+'%'+(over?' · <b style="color:#f87171">túl forró – kozmás!</b>':inz?'':' · <i>nem csöpög</i>');
  if(s.prod>=100){s.sum='Jó pohárba ment: '+Math.round(s.good)+'% · rossz pohárba: '+Math.round(s.bad)+'%';s.fin(s.good/100)}},
 timeout(s){s.sum='Nem lett kész a párlat ('+Math.round(s.prod)+'%).';return s.good/100*.9}};

// ---------- 3) CSOMAGOLÓSOR ----------
const PC=[[0xf97316,'🍑 Pálinka'],[0xe2e8f0,'📄 Pályázat'],[0xa855f7,'🧪 Csodapor']];
GAMES.pack={n:GI.pack.n,d:'A futószalagon jönnek a kitalált termékek dobozai. A végén a <b>váltó</b> a kiválasztott sávba tolja őket: a doboz színe = a gyűjtőláda színe. A <b>fekete, villogó doboz</b> Szigorú Szilárd nyomkövetője – a váltó előtt dobd le a szalagról!',
 h:'<b>↑ / ↓</b> (W / S) vagy <b>1 / 2 / 3</b> sávválasztás · <b>SPACE</b> nyomkövető ledobása',
 build(sc){room(sc,0x1f2937,0x374151,0x0b1026);const P=PLc();const L=new P(0xffffff,1.2,20);L.position.set(0,6,3);sc.add(L);
  this.bt=ctex(64,64,(x)=>{x.fillStyle='#1f2937';x.fillRect(0,0,64,64);x.fillStyle='#4b5563';x.fillRect(0,0,64,10);x.fillRect(0,32,64,10)});this.bt.wrapS=this.bt.wrapT=THREE.RepeatWrapping;this.bt.repeat.set(1,10);
  const belt=new THREE.Mesh(geo().p,new THREE.MeshStandardMaterial({map:this.bt,roughness:.8}));belt.scale.set(1.3,9,1);belt.rotation.set(-Math.PI/2,0,Math.PI/2);belt.position.set(-2.3,.92,0);sc.add(belt);
  mk('b',M(0x6b7280,{metalness:.6}),-2.3,.6,0,9.2,.6,1.6,sc);
  this.bins=PC.map((p,i)=>{const z=(i-1)*1.8;const ch=mk('b',M(0x4b5563,{metalness:.5}),4.2,.55,z,4,.2,1.3,sc);ch.rotation.z=-.15;const b=mk('b',M(p[0],{roughness:.5}),6.6,.5,z,1.3,1,1.5,sc);
   const l=sign(sc,(i+1)+'',['#7c2d12','#334155','#581c87'][i],'#fff',6.6,1.3,z+.8,.5,.25);return b});
  this.arm=mk('b',M(0xfacc15,{metalness:.4}),2.2,1.2,0,.15,.15,1.6,sc);this.FX=new P(0x22c55e,0,8,2);this.FX.position.set(5.5,2.5,0);sc.add(this.FX);
  this.bx=[];for(let i=0;i<14;i++){const g=new THREE.Group();sc.add(g);const b=mk('b',M(0xffffff),0,0,0,.7,.6,.7,g);const led=mk('s',EMI(0xff0000,3),0,.36,0,.08,.08,.08,g);g.visible=false;this.bx.push({g,b,led,on:false})}},
 reset(s){s.lim=40;s.lane=1;s.ok=0;s.bad=0;s.tot=0;s.sp=1.7+s.lv*.22;s.gap=Math.max(.75,1.7-s.lv*.09);s.nx=.5;this.bx.forEach(b=>{b.on=false;b.g.visible=false});this.arm.rotation.y=0;CAM.position.set(-.5,5.6,6.6);CAM.lookAt(1.2,.6,0)},
 key(s,k){if(k==='arrowup'||k==='w')s.lane=Math.max(0,s.lane-1);if(k==='arrowdown'||k==='s')s.lane=Math.min(2,s.lane+1);const n=['1','2','3'].indexOf(k);if(n>=0)s.lane=n;
  if(k===' '){const t=this.bx.filter(b=>b.on&&b.st===0&&b.tr&&b.g.position.x>-3&&b.g.position.x<2.2).sort((a,b)=>b.g.position.x-a.g.position.x)[0];if(t){t.st=2;t.vy=3;s.ok++;msg('🗑️ Nyomkövető kidobva!','#86efac');beep(900,.08,'sine')}
   else{const w=this.bx.find(b=>b.on&&b.st===0&&b.g.position.x>-3&&b.g.position.x<2.2);if(w){w.st=2;w.vy=3;s.bad++;msg('❌ Az áru volt!','#fca5a5');beep(150,.15,'sawtooth')}}}},
 up(s,dt){this.bt.offset.y-=dt*s.sp/9*10;this.arm.rotation.y+=((s.lane-1)*-.5-this.arm.rotation.y)*Math.min(1,dt*12);this.FX.intensity=Math.max(0,this.FX.intensity-dt*4);
  s.nx-=dt;if(s.nx<=0&&s.t<s.lim-2.5){s.nx=s.gap*RN(.8,1.25);const b=this.bx.find(x=>!x.on);if(b){b.on=true;b.st=0;b.tr=Math.random()<.12+s.lv*.012;b.c=RI(0,2);b.b.material=b.tr?M(0x111111,{metalness:.4}):M(PC[b.c][0],{roughness:.55});b.led.visible=b.tr;b.g.visible=true;b.g.position.set(-6.6,1.25,0);b.g.rotation.set(0,0,0);s.tot++}}
  this.bx.forEach(b=>{if(!b.on)return;const p=b.g.position;if(b.tr)b.led.material.emissiveIntensity=Math.sin(s.t*12)>0?4:.3;
   if(b.st===0){p.x+=s.sp*dt;if(p.x>=2.2){b.st=1;b.ln=s.lane;if(b.tr){s.bad+=1.5;msg('🚨 Nyomkövető a ládában!','#f87171');beep(200,.3,'sawtooth');try{DP().heat(3)}catch(e){}this.flash(0xff0000)}else if(b.ln===b.c){s.ok++;this.flash(0x22c55e);beep(760,.05,'triangle')}else{s.bad++;msg('❌ Rossz láda','#fca5a5');this.flash(0xff3b30)}}}
   else if(b.st===1){const tz=(b.ln-1)*1.8;p.x+=s.sp*1.2*dt;p.z+=(tz-p.z)*Math.min(1,dt*5);p.y=1.25-(p.x-2.2)*.15;if(p.x>6.3){b.on=false;b.g.visible=false}}
   else{p.z+=dt*4;p.y+=b.vy*dt;b.vy-=dt*14;b.g.rotation.x+=dt*6;if(p.y<-1){b.on=false;b.g.visible=false}}});
  const done=s.ok+s.bad;s.cur=done?cl((s.ok-s.bad*.5)/Math.max(1,s.tot),0,1):0;s.info='Váltó: <b>'+['⬆ 1 '+PC[0][1],'● 2 '+PC[1][1],'⬇ 3 '+PC[2][1]][s.lane]+'</b> · ✅ '+s.ok+' · ❌ '+Math.round(s.bad*10)/10+' · tempó ×'+s.sp.toFixed(1)},
 flash(c){this.FX.color.setHex(c);this.FX.intensity=3},
 timeout(s){s.sum='Dobozok: '+s.tot+' · jó: '+s.ok+' · hiba: '+s.bad;return cl((s.ok-s.bad*.5)/Math.max(1,s.tot),0,1)}};

// ---------- 4) SÜRGŐS FUVAR (város, rendőr-kerülés) ----------
const BLK=[];for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++)BLK.push([i*20,j*20]);
const blkHit=(x,z,r)=>{if(Math.abs(x)>54-r||Math.abs(z)>54-r)return true;for(const b of BLK)if(Math.abs(x-b[0])<6+r&&Math.abs(z-b[1])<6+r)return true;return false};
GAMES.drive={n:GI.drive.n,d:'Éjszakai város, sürgős fuvar. Vezess a <b>zöld fényoszlophoz</b> – minden leadás után jön a következő cím. A 🚓 járőrök előtt piros <b>látómező</b> van: ha benne maradsz, nő a gyanú, és ha betelik, elkapnak. A bal alsó minitérkép segít.',
 h:'<b>W/S</b> gáz/fék · <b>A/D</b> kormány · <b>SHIFT</b> turbó · minitérkép bal lent',
 build(sc){sc.background=new THREE.Color(0x070b1d);sc.fog=new THREE.Fog(0x070b1d,30,95);sc.add(new THREE.HemisphereLight(0x93c5fd,0x1e1b4b,.7));const mo=new THREE.DirectionalLight(0xbfdbfe,.5);mo.position.set(-30,60,20);sc.add(mo);
  mk('p',M(0x1f2937,{roughness:.95}),0,0,0,140,140,1,sc).rotation.x=-Math.PI/2;
  const wt=ctex(64,128,(x)=>{x.fillStyle='#111827';x.fillRect(0,0,64,128);for(let r=0;r<8;r++)for(let c=0;c<4;c++){x.fillStyle=Math.random()<.45?'#fde68a':'#1e293b';x.fillRect(4+c*15,6+r*15,9,9)}});wt.wrapS=wt.wrapT=THREE.RepeatWrapping;
  const bm=new THREE.MeshStandardMaterial({map:wt,emissive:0xffffff,emissiveMap:wt,emissiveIntensity:.55,roughness:.8});let sd=7;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  BLK.forEach(([x,z])=>{const h=4+rnd()*12;mk('b',M(0x4b5563),x,.15,z,13,.3,13,sc);const b=mk('b',bm,x,h/2,z,11,h,11,sc)});
  [-50,-30,-10,10,30,50].forEach(v=>{mk('b',M(0xfacc15),v,.02,0,.2,.02,104,sc);mk('b',M(0xfacc15),0,.02,v,104,.02,.2,sc)});
  const car=new THREE.Group();sc.add(car);mk('b',M(0xfde047,{metalness:.5,roughness:.35}),0,.6,0,1.8,.6,3.6,car);mk('b',M(0x1e293b,{metalness:.3,roughness:.2}),0,1.1,-.2,1.6,.5,1.8,car);
  [[-.9,1.2],[.9,1.2],[-.9,-1.2],[.9,-1.2]].forEach(([x,z])=>{const w=mk('c',M(0x111827),x,.35,z,.35,.3,.35,car);w.rotation.z=Math.PI/2});mk('b',EMI(0xfef9c3,2),0,.6,1.82,1.4,.15,.05,car);
  const P=PLc();this.hl=new P(0xfff7d6,1.6,16,2);this.hl.position.set(0,1,4);car.add(this.hl);this.car=car;
  this.tg=new THREE.Group();sc.add(this.tg);mk('c',new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.35,depthWrite:false}),0,15,0,1.6,30,1.6,this.tg);this.ring=mk('c',new THREE.MeshBasicMaterial({color:0x86efac,transparent:true,opacity:.6}),0,.05,0,3.2,.08,3.2,this.tg);
  this.TL=new P(0x22c55e,2.5,14,2);this.TL.position.y=2;this.tg.add(this.TL);
  this.cops=[];for(let i=0;i<5;i++){const g=new THREE.Group();sc.add(g);mk('b',M(0xf8fafc,{metalness:.4}),0,.6,0,1.8,.6,3.6,g);mk('b',M(0x1e3a8a),0,1.05,-.2,1.6,.45,1.7,g);const r=mk('b',EMI(0xff0000,3),-.35,1.35,-.2,.5,.15,.25,g),b=mk('b',EMI(0x2563eb,3),.35,1.35,-.2,.5,.15,.25,g);
   const cone=new THREE.Mesh(sector(14,.45),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.22,depthWrite:false}));cone.position.y=.06;g.add(cone);const L=new P(0xff0000,0,12,2);L.position.y=2.2;g.add(L);this.cops.push({g,r,b,L,cone})}},
 reset(s){const esc=OPT.mode==='escape';s.esc=esc;s.lim=esc?40:Math.max(60,80-s.lv*2);s.need=esc?1:3+Math.floor(s.lv/4);s.dl=0;s.want=0;s.c={x:0,z:-10,h:0,v:0};const nc=Math.min(5,(esc?3:2)+Math.floor(s.lv/3));
  this.cops.forEach((c,i)=>{c.on=i<nc;c.g.visible=c.on;if(!c.on){c.L.intensity=0;return}const lp=[10,30][i%2]*(i%3===2?-1:1);c.loop=Math.abs(lp);c.p=Math.random();c.sp=(esc?.05:.035)+s.lv*.003;c.dir=i%2?1:-1});
  this.newT(s);CAM.position.set(0,5,-20);CAM.lookAt(0,0,-10)},
 newT(s){let x,z;do{x=pick([-30,-10,10,30,-50,50]);z=pick([-40,-20,0,20,40]);if(Math.random()<.5){const t=x;x=z;z=t}}while(Math.hypot(x-s.c.x,z-s.c.z)<35||blkHit(x,z,1));s.tx=x;s.tz=z;this.tg.position.set(x,0,z)},
 up(s,dt,K){const c=s.c,mx=(K.shift?26:18)+s.lv*.4;if(K.w||K.arrowup)c.v+=dt*mx*.9;else if(K.s||K.arrowdown)c.v-=dt*mx*(c.v>0?1.7:.6);else c.v*=1-dt*1.1;c.v=cl(c.v,-mx*.4,mx);
  const st=(K.a||K.arrowleft?1:0)-(K.d||K.arrowright?1:0);c.h+=st*dt*2*cl(c.v/7,-1,1);const nx=c.x+Math.sin(c.h)*c.v*dt,nz=c.z+Math.cos(c.h)*c.v*dt;if(blkHit(nx,nz,1.4)){if(Math.abs(c.v)>8)beep(90,.15,'sawtooth');c.v*=-.3}else{c.x=nx;c.z=nz}
  this.car.position.set(c.x,0,c.z);this.car.rotation.y=c.h;CAM.position.lerp(V1.set(c.x-Math.sin(c.h)*9,4.4,c.z-Math.cos(c.h)*9),Math.min(1,dt*4));CAM.lookAt(c.x,1.2,c.z);
  this.ring.scale.set(3.2+Math.sin(s.t*5)*.3,.08,3.2+Math.sin(s.t*5)*.3);
  if(Math.hypot(c.x-s.tx,c.z-s.tz)<4){s.dl++;beep(990,.12,'triangle');msg(s.esc?'🏠 Rejtekhely!':'📦 Leszállítva! '+s.dl+'/'+s.need,'#86efac');if(s.dl>=s.need){s.sum='Leszállítva: '+s.dl+'/'+s.need+' · maradt idő: '+Math.round(s.lim-s.t)+' mp';s.fin(cl(.7+.3*(s.lim-s.t)/s.lim-s.want*.2,0,1));return}this.newT(s)}
  let seen=false;const f=Math.floor(s.t*6)%2;this.cops.forEach(cp=>{if(!cp.on)return;cp.p=(cp.p+cp.dir*cp.sp*dt+1)%1;const r=cp.loop,q=cp.p*4,sg=Math.floor(q),fr=q-sg,C=[[-r,-r],[r,-r],[r,r],[-r,r]],a=C[sg],b=C[(sg+1)%4];
   const x=a[0]+(b[0]-a[0])*fr,z=a[1]+(b[1]-a[1])*fr,h=Math.atan2((b[0]-a[0])*cp.dir,(b[1]-a[1])*cp.dir);cp.g.position.set(x,0,z);cp.g.rotation.y=h;cp.r.material.emissiveIntensity=f?4:.2;cp.b.material.emissiveIntensity=f?.2:4;cp.L.color.setHex(f?0xff1e1e:0x2563eb);cp.L.intensity=2;
   const dx=c.x-x,dz=c.z-z,d=Math.hypot(dx,dz);if(d<3.2)seen=2;else if(d<14&&(dx*Math.sin(h)+dz*Math.cos(h))/d>Math.cos(.45))seen=seen||1});
  s.want=cl(s.want+(seen?dt*(seen===2?1.2:.45+s.lv*.04):-dt*.15),0,1);if(s.want>=1){s.sum='🚔 Elkaptak! Leszállítva: '+s.dl+'/'+s.need;msg('🚔 ELKAPTAK!','#f87171');s.fin(s.dl/s.need*.35);return}
  s.cur=s.dl/s.need*.7;s.g={v:s.want*100,lo:0,hi:0,l:'🚨 gyanú'};s.info=(s.esc?'🏠 Juss el a zöld fényoszlophoz (rejtekhely)!':'📦 Leszállítás '+s.dl+'/'+s.need)+' · távolság <b>'+Math.round(Math.hypot(c.x-s.tx,c.z-s.tz))+' m</b> · ⚡ '+Math.round(Math.abs(c.v)*3.6)+' km/h'+(seen?' · <b style="color:#f87171">LÁTNAK!</b>':'');
  s.mm=s.mm||((x,W)=>{const S2=W/112,T=v=>(v+56)*S2;x.fillStyle='#0b1026';x.fillRect(0,0,W,W);x.fillStyle='#334155';BLK.forEach(b=>x.fillRect(T(b[0]-6),T(b[1]-6),12*S2,12*S2));x.fillStyle='#22c55e';x.beginPath();x.arc(T(S.tx),T(S.tz),5,0,7);x.fill();
   GAMES.drive.cops.forEach(cp=>{if(!cp.on)return;x.fillStyle=Math.floor(S.t*6)%2?'#ef4444':'#3b82f6';x.beginPath();x.arc(T(cp.g.position.x),T(cp.g.position.z),4,0,7);x.fill()});
   x.save();x.translate(T(S.c.x),T(S.c.z));x.rotate(-S.c.h+Math.PI);x.fillStyle='#fde047';x.beginPath();x.moveTo(0,-7);x.lineTo(5,6);x.lineTo(-5,6);x.fill();x.restore()})},
 timeout(s){s.sum='⌛ Lejárt az idő. Leszállítva: '+s.dl+'/'+s.need;return s.dl/s.need*.6}};
const V1=new THREE.Vector3();

// ---------- 5) RAZZIA-MENEKÜLÉS (lopakodás) ----------
const CR=[[-8,-3,2,2],[-3,2,3,1.6],[3,-4,1.6,3],[8,1,2.4,2],[-10,5,2,2],[0,-8,4,1.4],[11,-7,1.6,1.6],[-6,-9,1.6,2.4],[5,7,2,1.6],[-1,5,1.4,1.4]];
const crHit=(x,z,r)=>{if(Math.abs(x)>15-r||Math.abs(z)>11-r)return true;for(const c of CR)if(Math.abs(x-c[0])<c[2]/2+r&&Math.abs(z-c[1])<c[3]/2+r)return true;return false};
const los=(ax,az,bx,bz)=>{for(let i=1;i<10;i++){const t=i/10,x=ax+(bx-ax)*t,z=az+(bz-az)*t;for(const c of CR)if(Math.abs(x-c[0])<c[2]/2&&Math.abs(z-c[1])<c[3]/2)return false}return true};
GAMES.hide={n:GI.hide.n,d:'Razzia a telepen! Szedd össze a <b>3 sárga iratcsomagot</b> (a „közpénz-könyvelés”), majd fuss a <b>zöld furgonhoz</b>. A rendőrök zseblámpájának fénykúpját kerüld – a ládák mögött nem látnak. Lopakodva lassabb vagy, de kisebb távolságból vesznek észre.',
 h:'<b>WASD</b> / nyilak mozgás · <b>SHIFT</b> nyomva = lopakodás',
 build(sc){sc.background=new THREE.Color(0x05070f);sc.fog=new THREE.Fog(0x05070f,18,48);sc.add(new THREE.HemisphereLight(0x64748b,0x0f172a,.45));
  mk('p',M(0x292524,{roughness:.95}),0,0,0,34,26,1,sc).rotation.x=-Math.PI/2;[[0,-11.5,32,.6],[0,11.5,32,.6],[-15.5,0,.6,23],[15.5,0,.6,23]].forEach(w=>mk('b',M(0x44403c),w[0],1,w[1],w[2],2,w[3],sc));
  const cm=M(0x92400e,{roughness:.8});CR.forEach(c=>mk('b',cm,c[0],.8,c[1],c[2],1.6,c[3],sc));const P=PLc();
  this.pl=new THREE.Group();sc.add(this.pl);mk('c',M(0x7c3aed),0,.75,0,.32,1.1,.32,this.pl);mk('s',M(0xf1c27d),0,1.5,0,.25,.25,.25,this.pl);mk('b',M(0x111827),0,1.55,.2,.3,.08,.08,this.pl);
  this.pL=new P(0xa78bfa,.6,5,2);this.pL.position.y=2;this.pl.add(this.pL);
  this.doc=[];for(let i=0;i<3;i++){const d=mk('b',EMI(0xfacc15,1.2),0,.6,0,.5,.12,.4,sc);this.doc.push(d)}
  this.van=new THREE.Group();sc.add(this.van);mk('b',M(0x16a34a,{metalness:.3}),0,1,0,2.2,1.6,3.8,this.van);this.vL=new P(0x22c55e,2,8,2);this.vL.position.y=2.5;this.van.add(this.vL);
  this.cops=[];for(let i=0;i<4;i++){const g=new THREE.Group();sc.add(g);mk('c',M(0x1e3a8a),0,.75,0,.33,1.1,.33,g);mk('s',M(0xf1c27d),0,1.5,0,.24,.24,.24,g);mk('c',M(0x0f172a),0,1.72,0,.26,.1,.26,g);
   const cone=new THREE.Mesh(sector(7,.5),new THREE.MeshBasicMaterial({color:0xfef08a,transparent:true,opacity:.18,depthWrite:false}));cone.position.y=.05;g.add(cone);
   const sp=new THREE.SpotLight(0xfff7cc,0,10,.5,.4,1.2);sp.position.set(0,1.4,.3);g.add(sp);const tg=new THREE.Object3D();tg.position.set(0,0,5);g.add(tg);sp.target=tg;this.cops.push({g,sp,cone})}},
 reset(s){s.lim=Math.max(45,70-s.lv*2);s.p={x:-13,z:9};s.got=0;s.det=0;const esc=OPT.mode==='escape';
  const DS=[[-12,-8],[12,-9],[13,8],[-13,-1],[0,0],[6,-1],[-4,9]].sort(()=>Math.random()-.5);this.doc.forEach((d,i)=>{d.visible=true;d.position.set(DS[i][0],.6,DS[i][1])});this.van.position.set(13,0,9.5);this.van.rotation.y=Math.PI/2;
  const PATH=[[[-12,-6],[12,-6]],[[12,4],[-12,4]],[[-6,-10],[-6,10]],[[6,10],[6,-10]]];const n=Math.min(4,2+Math.floor(s.lv/3)+(esc?1:0));
  this.cops.forEach((c,i)=>{c.on=i<n;c.g.visible=c.on;c.sp.intensity=c.on?3:0;c.path=PATH[i];c.u=Math.random();c.d=1;c.sp2=.07+s.lv*.006;c.look=0});
  CAM.position.set(-13,15,19);CAM.lookAt(-13,0,9)},
 up(s,dt,K){const sn=K.shift;const v=(sn?2.4:4.6)*dt;let mx=0,mz=0;if(K.w||K.arrowup)mz-=1;if(K.s||K.arrowdown)mz+=1;if(K.a||K.arrowleft)mx-=1;if(K.d||K.arrowright)mx+=1;const l=Math.hypot(mx,mz)||1;
  const p=s.p;const nx=p.x+mx/l*v,nz=p.z+mz/l*v;if(!crHit(nx,p.z,.35))p.x=nx;if(!crHit(p.x,nz,.35))p.z=nz;this.pl.position.set(p.x,sn?-.25:0,p.z);if(mx||mz)this.pl.rotation.y=Math.atan2(mx,mz);
  CAM.position.lerp(V1.set(p.x*.7,15,p.z*.5+12),Math.min(1,dt*3));CAM.lookAt(p.x*.85,0,p.z*.8);
  this.doc.forEach(d=>{if(!d.visible)return;d.rotation.y+=dt*2;d.position.y=.6+Math.sin(s.t*3)*.1;if(Math.hypot(d.position.x-p.x,d.position.z-p.z)<.9){d.visible=false;s.got++;beep(880,.08,'sine');msg('📁 Iratcsomag '+s.got+'/3','#fde68a')}});
  this.vL.intensity=s.got>=3?2.5+Math.sin(s.t*6):0.3;
  let seen=0;this.cops.forEach(c=>{if(!c.on)return;const[a,b]=c.path;c.u+=c.d*c.sp2*dt;if(c.u>1||c.u<0){c.d*=-1;c.u=cl(c.u,0,1)}const x=a[0]+(b[0]-a[0])*c.u,z=a[1]+(b[1]-a[1])*c.u;
   const h=Math.atan2((b[0]-a[0])*c.d,(b[1]-a[1])*c.d)+Math.sin(s.t*1.3+c.u*9)*.5;c.g.position.set(x,0,z);c.g.rotation.y=h;
   const dx=p.x-x,dz=p.z-z,d=Math.hypot(dx,dz),rng=sn?4.6:7;if(d<1.2)seen=2;else if(d<rng&&(dx*Math.sin(h)+dz*Math.cos(h))/d>Math.cos(.5)&&los(x,z,p.x,p.z))seen=Math.max(seen,1)});
  s.det=cl(s.det+(seen?dt*(seen===2?2:.7+s.lv*.05):-dt*.2),0,1);s.g={v:s.det*100,lo:0,hi:0,l:'👁️ észlelés'};
  if(s.det>=1){msg('🚔 ELKAPTAK!','#f87171');s.sum='Iratcsomag: '+s.got+'/3';s.fin(.1+s.got*.08);return}
  if(s.got>=3&&Math.hypot(p.x-13,p.z-9.5)<2.4){s.sum='Megúsztad! Maradt idő: '+Math.round(s.lim-s.t)+' mp';s.fin(cl(.62+.38*(s.lim-s.t)/s.lim-s.det*.15,0,1));return}
  s.cur=s.got/3*.5;s.info='📁 '+s.got+'/3 iratcsomag'+(s.got>=3?' · <b style="color:#86efac">Irány a zöld furgon!</b>':'')+(sn?' · 🤫 lopakodsz':'')+(seen?' · <b style="color:#f87171">LÁTNAK!</b>':'')},
 timeout(s){s.sum='⌛ Lejárt az idő – körbezártak.';return .15+s.got*.08}};

// ---------- 6) PECSÉTELŐ IRODA ----------
const DOCV=[['PÁLYÁZAT','Minden rendben ✔',1],['TÁMOGATÁSI KÉRELEM','Aláírva, iktatva ✔',1],['KÖZBESZERZÉS','Három ajánlat ✔',1],['SZALAGÁTVÁGÁS','Költségvetés ✔',1],['PÁLYÁZAT','Hiányzó aláírás ✘',0],['KÖZBESZERZÉS','Sógor cége az egyetlen ✘',0],['SZÁMLA','„Tanulmány” 0 oldal ✘',0],['KÉRELEM','Rozi lefotózta ✘',0]];
GAMES.stamp={n:GI.stamp.n,d:'Tender Tibi irodája. Az asztalon csúsznak az iratok: ha <b>zöld kerete</b> van (rendben), <b>pecsételd le</b>, amikor a pecsét alatt van; ha <b>piros</b> (gyanús), <b>zúzd le</b>. Ami elcsúszik, az elveszett pénz. Egyre gyorsabb!',
 h:'<b>SPACE</b> pecsét (jóváhagyás) · <b>A</b> / <b>←</b> iratmegsemmisítő',
 build(sc){room(sc,0x3f3a35,0x57534e,0x120d0a);const P=PLc();this.L=new P(0xffd59a,1.6,10,2);this.L.position.set(1.5,3.2,.5);sc.add(this.L);
  mk('b',M(0x7c4a1e,{roughness:.6}),0,.45,0,9,.9,2.8,sc);mk('c',M(0x111827,{metalness:.6}),2.4,1.4,-.9,.06,1,.06,sc);mk('cn',M(0x15803d,{metalness:.3}),2.4,2,-.9,.35,.3,.35,sc);
  this.sh=mk('b',M(0x374151,{metalness:.6}),-4,.9,-.6,1.2,1,1,sc);sign(sc,'ZÚZÓ','#7f1d1d','#fff',-4,1.6,-.05,.9,.25);mk('b',M(0x166534),3.9,.98,.6,1.2,.08,1.2,sc);sign(sc,'JÓVÁHAGYVA','#14532d','#fff',3.9,1.25,1.25,1.1,.22);
  this.st=new THREE.Group();sc.add(this.st);mk('c',M(0x991b1b,{metalness:.2}),0,0,0,.42,.25,.42,this.st);mk('c',M(0x78350f),0,.45,0,.09,.7,.09,this.st);mk('s',M(0x78350f),0,.85,0,.18,.18,.18,this.st);
  mk('b',new THREE.MeshBasicMaterial({color:0xfde047,transparent:true,opacity:.25}),0,.91,0,1.5,.01,2,sc);
  this.tx=DOCV.map(v=>ctex(256,320,(x,W,H)=>{x.fillStyle='#fef9c3';x.fillRect(0,0,W,H);x.strokeStyle=v[2]?'#16a34a':'#dc2626';x.lineWidth=14;x.strokeRect(7,7,W-14,H-14);x.fillStyle='#111';x.font='900 22px system-ui';x.textAlign='center';x.fillText(v[0],W/2,50);
   x.fillStyle='#9ca3af';for(let i=0;i<8;i++)x.fillRect(30,80+i*20,W-60-(i*13)%60,6);x.fillStyle=v[2]?'#15803d':'#b91c1c';x.font='800 19px system-ui';x.fillText(v[1],W/2,275)}));
  this.ink=ctex(128,128,(x)=>{x.strokeStyle='#dc2626';x.lineWidth=8;x.beginPath();x.arc(64,64,52,0,7);x.stroke();x.fillStyle='#dc2626';x.font='900 22px system-ui';x.textAlign='center';x.fillText('OK ✔',64,72)});
  this.dc=[];for(let i=0;i<7;i++){const g=new THREE.Group();sc.add(g);const p=new THREE.Mesh(geo().p,new THREE.MeshStandardMaterial({map:this.tx[0],roughness:.9}));p.scale.set(1.2,1.5,1);p.rotation.x=-Math.PI/2;g.add(p);
   const ik=new THREE.Mesh(geo().p,new THREE.MeshBasicMaterial({map:this.ink,transparent:true,depthWrite:false}));ik.scale.set(.7,.7,1);ik.rotation.x=-Math.PI/2;ik.position.y=.01;g.add(ik);g.visible=false;this.dc.push({g,p,ik,on:false})}},
 reset(s){s.lim=35;s.pts=0;s.max=0;s.sp=1.3+s.lv*.18;s.gap=Math.max(.65,1.5-s.lv*.08);s.nx=.3;s.sa=0;this.dc.forEach(d=>{d.on=false;d.g.visible=false});this.st.position.set(0,2.1,0);CAM.position.set(0,4,3.6);CAM.lookAt(0,.8,-.1)},
 inZ(){return this.dc.filter(d=>d.on&&d.st===0&&Math.abs(d.g.position.x)<.8).sort((a,b)=>Math.abs(a.g.position.x)-Math.abs(b.g.position.x))[0]},
 key(s,k){if(k===' '){s.sa=.25;const d=this.inZ();beep(140,.08,'square',.08);if(!d){s.pts-=.25;return}d.ik.visible=true;d.st=1;if(d.ok){s.pts+=1;msg('✔ Jóváhagyva','#86efac')}else{s.pts-=1;msg('📸 Gyanús iratot pecsételtél!','#f87171');try{DP().heat(2)}catch(e){}}}
  if(k==='a'||k==='arrowleft'){const d=this.inZ();if(!d)return;d.st=2;if(!d.ok){s.pts+=1;msg('🗑️ Ledarálva','#86efac');beep(260,.1,'sawtooth')}else{s.pts-=.5;msg('😬 Jó papírt zúztál','#fca5a5')}}},
 up(s,dt){s.nx-=dt;if(s.nx<=0&&s.t<s.lim-3){s.nx=s.gap*RN(.85,1.3);const d=this.dc.find(x=>!x.on);if(d){const v=RI(0,7);d.ok=DOCV[v][2]===1;d.p.material.map=this.tx[v];d.on=true;d.st=0;d.ik.visible=false;d.g.visible=true;d.g.position.set(-4.6,.92,0);d.g.rotation.set(0,RN(-.15,.15),0);s.max++}}
  s.sa=Math.max(0,s.sa-dt);this.st.position.y=.95+(s.sa>0?Math.abs(s.sa-.125)*8*.15:1.15);
  this.dc.forEach(d=>{if(!d.on)return;const p=d.g.position;if(d.st===0){p.x+=s.sp*dt;if(p.x>4.6){d.on=false;d.g.visible=false;if(d.ok){s.pts-=.5;msg('💸 Elcsúszott egy jó irat','#fde68a')}}}
   else if(d.st===1){p.x+=(3.9-p.x)*Math.min(1,dt*5);p.z+=(.6-p.z)*Math.min(1,dt*5);p.y=.95;if(Math.abs(p.x-3.9)<.05){d.on=false;d.g.visible=false}}
   else{p.x+=(-4-p.x)*Math.min(1,dt*5);p.z+=(-.6-p.z)*Math.min(1,dt*5);p.y+=dt*.6;if(p.x<-3.9){d.on=false;d.g.visible=false}}});
  s.cur=cl(s.pts/Math.max(1,s.max),0,1);s.info='Pont: <b>'+s.pts.toFixed(1)+'</b> / '+s.max+' irat · tempó ×'+s.sp.toFixed(1)},
 timeout(s){s.sum='Iratok: '+s.max+' · pont: '+s.pts.toFixed(1);return cl(s.pts/Math.max(1,s.max),0,1)}};

// ---------- 7) DJ-PULT (ritmusjáték) ----------
const LC=[0xef4444,0x22c55e,0x3b82f6,0xfacc15];
GAMES.dj={n:GI.dj.n,d:'Bulis Benő afterpartiján te vagy a DJ! A négy sávon érkező hangjegyeket akkor üsd le, amikor a <b>fénycsíkra</b> érnek. A kombó felpörgeti a tömeget és a fényeket.',
 h:'<b>D F J K</b> (vagy ← ↓ ↑ →) a négy sáv',
 build(sc){sc.background=new THREE.Color(0x0a0014);sc.fog=new THREE.Fog(0x0a0014,10,40);sc.add(new THREE.HemisphereLight(0x7c3aed,0x0a0014,.45));mk('p',M(0x120a1f,{roughness:.4,metalness:.4}),0,0,0,60,60,1,sc).rotation.x=-Math.PI/2;
  mk('b',M(0x1f2937,{metalness:.5}),0,.5,2.6,4.4,1,1.2,sc);const lab=ctex(128,128,(x)=>{x.fillStyle='#111';x.fillRect(0,0,128,128);x.fillStyle='#db2777';x.beginPath();x.arc(64,64,30,0,7);x.fill();x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='center';x.fillText('Ft REC',64,70)});
  this.tt=[-1.2,1.2].map(x=>{const t=new THREE.Mesh(geo().c,new THREE.MeshStandardMaterial({map:lab,roughness:.3}));t.scale.set(.7,.05,.7);t.position.set(x,1.03,2.6);sc.add(t);return t});
  const P=PLc();this.L=[0xdb2777,0x22d3ee,0xa3e635].map((c,i)=>{const l=new P(c,1,22,2);l.position.set((i-1)*5,4,-4);sc.add(l);return l});
  this.lanes=LC.map((c,i)=>{const l=mk('b',M(c,{transparent:true,opacity:.18,emissive:c,emissiveIntensity:.25}),(i-1.5)*.9,1.02,-6,.82,.02,16,sc);return l});
  this.hit=mk('b',EMI(0xffffff,1.5),0,1.05,1.2,3.7,.04,.12,sc);['D','F','J','K'].forEach((t,i)=>{const g2=sign(sc,t,'#1e1b4b',['#ef4444','#22c55e','#3b82f6','#facc15'][i],(i-1.5)*.9,1.1,1.75,.6,.3);g2.rotation.x=-1.1});
  this.nt=[];for(let i=0;i<30;i++){const n=mk('b',EMI(0xffffff,1.6),0,1.15,0,.75,.18,.38,sc);n.visible=false;this.nt.push({m:n,on:false})}
  this.cr=[];for(let i=0;i<36;i++){const g=new THREE.Group();const x=(i%9-4)*1.6+RN(-.3,.3),z=-12-Math.floor(i/9)*1.7;g.position.set(x,0,z);sc.add(g);mk('c',M(pick([0xef4444,0x22c55e,0x3b82f6,0xeab308,0xa855f7,0xf97316])),0,.8,0,.3,1.2,.3,g);mk('s',M(0xf1c27d),0,1.6,0,.22,.22,.22,g);this.cr.push(g)}},
 reset(s){s.lim=36;s.bpm=96+s.lv*9;s.spd=7+s.lv*.6;s.ch=[];let t=1.6;const be=60/s.bpm;while(t<s.lim-1.5){const ln=RI(0,3);s.ch.push({t,ln});if(s.lv>=4&&Math.random()<.15+s.lv*.02){let l2;do{l2=RI(0,3)}while(l2===ln);s.ch.push({t,ln:l2})}t+=be*(Math.random()<.25+s.lv*.03?.5:1)}
  s.ci=0;s.per=0;s.good=0;s.miss=0;s.combo=0;s.max=0;s.pulse=0;this.nt.forEach(n=>{n.on=false;n.m.visible=false});CAM.position.set(0,3.4,5.4);CAM.lookAt(0,1.2,-5)},
 key(s,k){const ln={d:0,f:1,j:2,k:3,arrowleft:0,arrowdown:1,arrowup:2,arrowright:3}[k];if(ln==null)return;let best=null,bd=9;this.nt.forEach(n=>{if(n.on&&n.ln===ln){const d=Math.abs(n.m.position.z-1.2);if(d<bd){bd=d;best=n}}});
  this.lanes[ln].material.emissiveIntensity=1.2;if(best&&bd<1){best.on=false;best.m.visible=false;if(bd<.45){s.per++;msg('PERFECT','#f0abfc')}else{s.good++;msg('JÓ','#93c5fd')}s.combo++;s.max=Math.max(s.max,s.combo);s.pulse=1;beep([392,440,523,587][ln],.08,'triangle',.05)}else{s.combo=0;beep(110,.06,'sawtooth',.03)}},
 up(s,dt){const lead=(1.2+14)/s.spd;while(s.ci<s.ch.length&&s.ch[s.ci].t-lead<=s.t){const c=s.ch[s.ci++];const n=this.nt.find(x=>!x.on);if(n){n.on=true;n.ln=c.ln;n.m.visible=true;n.m.material=EMI(LC[c.ln],1.8);n.m.position.set((c.ln-1.5)*.9,1.15,1.2-(c.t-s.t)*s.spd)}}
  this.nt.forEach(n=>{if(!n.on)return;n.m.position.z+=s.spd*dt;if(n.m.position.z>2.3){n.on=false;n.m.visible=false;s.miss++;s.combo=0}});
  this.lanes.forEach(l=>l.material.emissiveIntensity=Math.max(.25,l.material.emissiveIntensity-dt*4));s.pulse=Math.max(0,s.pulse-dt*3);
  const be=s.t*s.bpm/60*Math.PI*2,hype=Math.min(1,s.combo/20);this.tt.forEach(t=>t.rotation.y+=dt*4);
  this.L.forEach((l,i)=>{l.intensity=1+s.pulse*3+hype*2*Math.max(0,Math.sin(be+i*2));l.position.x=(i-1)*5+Math.sin(s.t*.8+i)*3});
  this.cr.forEach((g,i)=>{g.position.y=Math.max(0,Math.sin(be+i))*(.08+hype*.35);g.rotation.y=Math.sin(s.t+i)*.3});
  const tot=Math.max(1,s.per+s.good+s.miss);s.cur=(s.per+s.good*.6)/Math.max(1,s.ch.length);s.info='🔥 Kombó <b>'+s.combo+'</b> · Perfect '+s.per+' · Jó '+s.good+' · Mellé '+s.miss+' · '+s.bpm+' BPM'},
 timeout(s){s.sum='Perfect: '+s.per+' · Jó: '+s.good+' · Mellé: '+s.miss+' · max kombó: '+s.max;return cl((s.per+s.good*.6)/Math.max(1,s.ch.length),0,1)}};

// ===================== BEKÖTÉS A SÖTÉT PROGRAMBA =====================
const use3d=()=>{try{return localStorage.getItem('k3spmg2d')!=='1'}catch(e){return true}};
const BRMAP={lab:'mix',pal:'pal',pal2:'stamp'};
function hook(){const dp=DP();if(!dp||!dp.MG||dp.MG._3d)return!!(dp&&dp.MG&&dp.MG._3d);const MG=dp.MG;MG._3d=1;
 ['heat','stir','stop','simon','filter','scale','ferment','cut','pour','label','type','stamp','match','count'].forEach(k=>{const o=MG[k];MG[k]=cb=>{if(chain){cb(lastSc);return}const br=window._dpBr;if(!br||!use3d()||!BRMAP[br])return o(cb);run(BRMAP[br],{mode:'cook',cb})}});
 const od=MG.dance;MG.dance=cb=>{if(chain){cb(lastSc);return}if(!use3d())return od(cb);run('dj',{mode:'party',cb})};
 ['chase','alley','hide'].forEach(k=>{const o=MG[k];MG[k]=cb=>{if(chain){cb(lastSc);return}if(!use3d())return o(cb);run(k==='chase'?'drive':'hide',{mode:'escape',cb})}});
 return true}
const hi=setInterval(()=>{if(hook())clearInterval(hi)},700);
// a „🎮 3D műszak” fül tartalma (sotetprogram.js draw hívja)
function renderTab(el){const dp=DP(),D=dp.D;el.innerHTML='<div class="say">🎮 <b>3D műszak</b>: minden minijáték saját 3D jelenetben fut. Műszakként ⚡ 10 energiáért <b>Ft-t</b> fizetnek (a Sötét Program pénze; <b>Ft</b> csak pénzmosással lesz belőle). 70% felett nő a nehézség – és vele a jutalom is. A főzés, a buli és a menekülés is ezeket használja.</div><div class="g">'+
 Object.keys(GI).map(k=>{const r=REC(k);return'<div class="c"><div style="font-size:15px"><b>'+GI[k].n+'</b></div><small>'+GAMES[k].d.replace(/<[^>]+>/g,'').slice(0,120)+'…</small><br>📈 '+r.lv+'. szint · 🏆 '+Math.round(r.best*100)+'% · 💰 '+dp.f$(r.earn)+'<br><small>Max. jutalom most: '+dp.f$(rewardOf(k,1,r.lv))+'</small><br><button class="bt" data-mg3="'+k+'">▶ Műszak</button></div>'}).join('')+
 '</div><p><label style="cursor:pointer"><input type="checkbox" id="mg3old" '+(use3d()?'':'checked')+'> Régi 2D minijátékok a főzéshez/bulihoz (gyenge gépre)</label></p>';
 el.querySelectorAll('[data-mg3]').forEach(b=>b.onclick=()=>run(b.dataset.mg3,{mode:'job'}));const c=el.querySelector('#mg3old');if(c)c.onchange=()=>{try{localStorage.setItem('k3spmg2d',c.checked?'1':'0')}catch(e){}}}
function statCard(el){const dp=DP();const d=document.createElement('div');d.innerHTML='<h3>🎮 3D műszakok</h3><div class="g">'+Object.keys(GI).map(k=>{const r=REC(k);return'<div class="c"><b>'+GI[k].n+'</b><br>📈 '+r.lv+'. szint · 🏆 '+Math.round(r.best*100)+'%<br>▶ '+r.n+'× · 💰 '+dp.f$(r.earn)+'</div>'}).join('')+'</div>';el.appendChild(d)}
window.spmgOn=()=>ON;
window._spmg={run,renderTab,statCard,GAMES,GI,REC,state:()=>S,fin:s=>S&&PLAY&&finish(s),start};
})();
