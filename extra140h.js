// extra140h.js – MOZGÁS & JÁRMŰVEK: 🚗 autó (duda, drift), 🛵 robogó, 🛹 gördeszka trükkökkel, 🧗 falmászás/párkány, 🚀 rakétacipő (dupla ugrás),
// 🪽 szárnyruha (Insert magasból), 🎯 katapult, ⛽ benzinkút + üzemanyag, 🎨 járműskinek (lobby gomb), 🏁 ugrató rámpák + trükkpont.
// Billentyű: Insert (duda vezetés közben / szárnyruha zuhanáskor / súgó). E = be/ki, tankolás, láda. Debug: _x14h()
(()=>{
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a);
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train','sotet'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x14hpre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x14h '+n+': '+e)}return r}};
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.45,metalness:.25},o||{}));
const LS={g(k,d){try{const v=localStorage.getItem('k3x14h'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem('k3x14h'+k,JSON.stringify(v))}catch(e){}}};
const addFt=n=>{try{S.c+=n;if(typeof save==='function')save()}catch(e){}};
const fwd=()=>[Math.cos(G.ang),Math.sin(G.ang)];
const onMap=(x,z)=>G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<56;

// =================== SKINEK ===================
const SKINS=[
 {id:'gyari',n:'Gyári piros',c:0xdc2626,a:0x111827,p:0},
 {id:'ej',n:'Éjfekete',c:0x0f172a,a:0xf59e0b,p:50000},
 {id:'jeg',n:'Jégkék',c:0x7dd3fc,a:0xffffff,p:80000},
 {id:'mereg',n:'Mérgező zöld',c:0x84cc16,a:0x14532d,p:120000},
 {id:'lang',n:'Narancs láng',c:0xf97316,a:0xfde047,p:150000},
 {id:'lila',n:'Királylila',c:0x7c3aed,a:0xe9d5ff,p:200000},
 {id:'arany',n:'Arany',c:0xeab308,a:0x78350f,p:400000,m:.9},
 {id:'szivarvany',n:'Szivárvány (élő)',c:0xff0000,a:0xffffff,p:750000,rb:1}];
let OWN=LS.g('own',['gyari']),SKIN=LS.g('skin','gyari');
const skin=()=>SKINS.find(s=>s.id===SKIN)||SKINS[0];

// =================== HANG ===================
let AC=null;const ac=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();return AC}catch(e){return null}};
function tone(f,d,type,vol,f2){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type||'square';o.frequency.value=f;if(f2)o.frequency.linearRampToValueAtTime(f2,a.currentTime+d);g.gain.value=vol||.08;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}
const horn=k=>{if(k==='car'){tone(392,.45,'sawtooth',.07);tone(494,.45,'sawtooth',.06)}else if(k==='moto'){tone(660,.25,'square',.06);setTimeout(()=>tone(660,.25,'square',.06),280)}else tone(880,.12,'triangle',.08)};

// =================== ÁLLAPOT ===================
let X=null; // meccs-állapot
const KIND={car:{n:'🚗 Városi Villám',max:34,acc:20,grip:3.2,seat:.55,fuel:1,ft:.05},moto:{n:'🛵 Zümi robogó',max:40,acc:26,grip:5.5,seat:.75,fuel:1,ft:.035},board:{n:'🛹 Gördeszka',max:20,acc:14,grip:3,seat:.2,fuel:0}};
function lbl(t,col){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(15,23,42,.82)';x.fillRect(0,0,256,64);x.fillStyle=col||'#fde047';x.font='bold 26px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(3.6,.9,1);return s}
function wheel(g,x,y,z,r,w){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,12),STD(0x111111,{roughness:.9,metalness:0}));m.rotation.z=Math.PI/2;m.position.set(x,y,z);g.add(m);const h=new THREE.Mesh(new THREE.CylinderGeometry(r*.5,r*.5,w+.02,8),STD(0xcbd5e1,{metalness:.8}));h.rotation.z=Math.PI/2;h.position.set(x,y,z);g.add(h);return m}
function mkVeh(k,x,z,a){const g=new THREE.Group(),sk=skin(),paint=STD(sk.c,{metalness:sk.m||.35}),acc=STD(sk.a),wh=[];
 if(k==='car'){const b=new THREE.Mesh(new THREE.BoxGeometry(1.9,.55,4),paint);b.position.y=.65;g.add(b);
  const hood=new THREE.Mesh(new THREE.BoxGeometry(1.86,.18,1.2),paint);hood.position.set(0,.98,1.25);hood.rotation.x=-.12;g.add(hood);
  const cab=new THREE.Mesh(new THREE.BoxGeometry(1.65,.55,1.9),STD(0x1e293b,{metalness:.7,roughness:.15,transparent:true,opacity:.85}));cab.position.set(0,1.18,-.25);g.add(cab);
  const roof=new THREE.Mesh(new THREE.BoxGeometry(1.7,.08,1.7),paint);roof.position.set(0,1.48,-.3);g.add(roof);
  const sp=new THREE.Mesh(new THREE.BoxGeometry(1.8,.08,.35),acc);sp.position.set(0,1.15,-1.95);g.add(sp);
  const st=new THREE.Mesh(new THREE.BoxGeometry(1.9,.12,.12),acc);st.position.set(0,.5,0);st.scale.z=33;g.add(st);
  [[-.6,2.01],[.6,2.01]].forEach(p=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.4,.14,.04),new THREE.MeshBasicMaterial({color:0xfffbeb}));l.position.set(p[0],.75,p[1]);g.add(l)});
  [[-.6,-2.01],[.6,-2.01]].forEach(p=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.4,.12,.04),new THREE.MeshBasicMaterial({color:0xef4444}));l.position.set(p[0],.75,p[1]);g.add(l)});
  [[-.95,1.3],[.95,1.3],[-.95,-1.3],[.95,-1.3]].forEach(p=>wh.push(wheel(g,p[0],.38,p[1],.38,.3)))}
 else if(k==='moto'){const b=new THREE.Mesh(new THREE.BoxGeometry(.45,.45,1.5),paint);b.position.y=.6;g.add(b);
  const seat=new THREE.Mesh(new THREE.BoxGeometry(.4,.14,.7),STD(0x111827));seat.position.set(0,.9,-.25);g.add(seat);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(.5,.7,.2),paint);fr.position.set(0,.85,.65);fr.rotation.x=-.25;g.add(fr);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.8,6),acc);bar.rotation.z=Math.PI/2;bar.position.set(0,1.25,.7);g.add(bar);
  const l=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),new THREE.MeshBasicMaterial({color:0xfffbeb}));l.position.set(0,1.05,.8);g.add(l);
  wh.push(wheel(g,0,.32,.75,.32,.14));wh.push(wheel(g,0,.32,-.7,.32,.16))}
 else{const d=new THREE.Mesh(new THREE.BoxGeometry(.55,.06,1.6),paint);d.position.y=.16;g.add(d);
  const gt=new THREE.Mesh(new THREE.BoxGeometry(.5,.01,1.5),acc);gt.position.y=.195;g.add(gt);
  [.55,-.55].forEach(zz=>{const tr=new THREE.Mesh(new THREE.BoxGeometry(.4,.04,.08),STD(0x94a3b8,{metalness:.8}));tr.position.set(0,.1,zz);g.add(tr);[-.17,.17].forEach(xx=>wh.push(wheel(g,xx,.06,zz,.06,.06)))})}
 const lb=lbl(k==='car'?'🚗 [E] Autó':k==='moto'?'🛵 [E] Robogó':'🛹 [E] Deszka');lb.position.y=k==='board'?1.2:2.4;g.add(lb);
 g.position.set(x,0,z);g.rotation.y=a;scene.add(g);
 const v={k,x,z,a,y:0,vy:0,vx:0,vz:0,sp:0,air:0,spin:0,flip:0,at:0,fuel:k==='board'?1:RN(.55,1),m:g,lb,paint,acc,wh,pgy:0};X.veh.push(v);return v}
function skinAll(){if(!X)return;const s=skin();X.veh.forEach(v=>{v.paint.color.setHex(s.c);v.paint.metalness=s.m||.35;v.acc.color.setHex(s.a)})}

// rámpa: lejtő a (dx,dz) irányba; magasság a hossz mentén lineárisan nő
function mkRamp(x,z,a){const L=7,W=4,H=2.3,g=new THREE.Group();const ang=Math.atan2(H,L),len=Math.hypot(L,H);
 const top=new THREE.Mesh(new THREE.BoxGeometry(W,.2,len),STD(0xf59e0b,{metalness:.1}));top.rotation.x=-ang;top.position.set(0,H/2,0);g.add(top);
 for(let i=0;i<4;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(W*.98,.02,.5),STD(0x111827));s.rotation.x=-ang;s.position.set(0,H/2+.11,-len/2+len*(i+.5)/4);g.add(s)}
 const back=new THREE.Mesh(new THREE.BoxGeometry(W,H,.25),STD(0x78716c));back.position.set(0,H/2,L/2);g.add(back);
 g.position.set(x,0,z);g.rotation.y=a;scene.add(g);X.ramps.push({x,z,a,L,W,H,m:g,cs:Math.cos(a),sn:Math.sin(a)})}
function rampH(x,z){let h=0;if(!X)return 0;for(const r of X.ramps){const dx=x-r.x,dz=z-r.z;if(Math.abs(dx)>6||Math.abs(dz)>6)continue;
  const lx=dx*r.cs-dz*r.sn,lz=dx*r.sn+dz*r.cs;if(Math.abs(lx)<r.W/2&&lz>-r.L/2&&lz<r.L/2){const v=r.H*(lz+r.L/2)/r.L;if(v>h)h=v}}return h}
function mkPump(x,z){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(2.6,.2,1.6),STD(0x334155));base.position.y=.1;g.add(base);
 const b=new THREE.Mesh(new THREE.BoxGeometry(.8,1.8,.6),STD(0x16a34a));b.position.y=1.1;g.add(b);
 const sc=new THREE.Mesh(new THREE.BoxGeometry(.6,.35,.02),new THREE.MeshBasicMaterial({color:0x86efac}));sc.position.set(0,1.6,.31);g.add(sc);
 const roof=new THREE.Mesh(new THREE.BoxGeometry(5,.2,4),STD(0xf8fafc));roof.position.y=3.6;g.add(roof);
 [[-2.2,-1.7],[2.2,-1.7],[-2.2,1.7],[2.2,1.7]].forEach(p=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,3.5,6),STD(0x94a3b8));c.position.set(p[0],1.75,p[1]);g.add(c)});
 const l=lbl('⛽ Benzinkút','#86efac');l.position.y=4.3;g.add(l);g.position.set(x,0,z);scene.add(g);X.pumps.push({x,z,m:g})}
function mkCat(x,z){const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.7,.4,16),STD(0x57534e));base.position.y=.2;g.add(base);
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,.1,16),new THREE.MeshStandardMaterial({color:0xef4444,emissive:0x7f1d1d}));pad.position.y=.45;g.add(pad);
 const arm=new THREE.Group();const beam=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,3),STD(0x92400e));beam.position.z=-1.5;arm.add(beam);arm.position.set(0,.6,0);g.add(arm);
 [-1.2,1.2].forEach(xx=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.25,1.6,.25),STD(0x78350f));p.position.set(xx,.8,-.2);g.add(p)});
 const l=lbl('🎯 Katapult','#fca5a5');l.position.y=2.8;g.add(l);g.position.set(x,0,z);scene.add(g);X.cats.push({x,z,m:g,arm,cd:0,ph:0})}
function mkChest(x,z){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.1,.7,.8),new THREE.MeshStandardMaterial({color:0x22d3ee,emissive:0x0e7490,metalness:.6,roughness:.3}));b.position.y=.35;g.add(b);
 const lid=new THREE.Mesh(new THREE.BoxGeometry(1.15,.18,.85),new THREE.MeshStandardMaterial({color:0xf0abfc,emissive:0x86198f}));lid.position.y=.78;g.add(lid);
 const l=lbl('🚀 Ritka láda','#67e8f9');l.position.y=1.8;g.add(l);g.position.set(x,0,z);scene.add(g);X.chests.push({x,z,m:g,open:0})}

function bounds(){if(!G.arh)return[-50,50,-50,50];let a=1e9,b=-1e9,c=1e9,d=-1e9;try{HU.forEach(p=>{const x=p[0]!==undefined?p[0]:p.x,z=p[1]!==undefined?p[1]:p.z;a=Math.min(a,x);b=Math.max(b,x);c=Math.min(c,z);d=Math.max(d,z)})}catch(e){}return a<b?[a,b,c,d]:[-200,200,-200,200]}
function landPt(){const B=bounds();for(let i=0;i<300;i++){const x=RN(B[0],B[1]),z=RN(B[2],B[3]);if(!onMap(x,z)||!onMap(x+5,z)||!onMap(x-5,z)||!onMap(x,z+5)||!onMap(x,z-5))continue;const o={x,z};try{pushOut(o,3,.5)}catch(e){}if(Math.hypot(o.x-x,o.z-z)>.01)continue;if(typeof hillH==='function'&&hillH(x,z)>.3)continue;return[x,z]}return[RN(-20,20),RN(-20,20)]}
function clearAll(){if(!X)return;[...X.veh,...X.ramps,...X.pumps,...X.cats,...X.chests].forEach(o=>{try{scene.remove(o.m)}catch(e){}});if(X.wing)try{scene.remove(X.wingM)}catch(e){}X=null}
function setup(){clearAll();X={G,veh:[],ramps:[],pumps:[],cats:[],chests:[],drive:null,boots:0,dj:0,wing:0,wingM:null,fly:null,climb:0,cst:3,roofs:[],refuel:0,trick:0,best:LS.g('best',0),t:0};
 const big=!!G.arh,n=(a,b)=>big?a:b;
 for(let i=0;i<n(3,1);i++){let p=landPt();mkVeh('car',p[0],p[1],RN(0,6.28))}
 for(let i=0;i<n(3,1);i++){let p=landPt();mkVeh('moto',p[0],p[1],RN(0,6.28))}
 for(let i=0;i<n(3,1);i++){let p=landPt();mkVeh('board',p[0],p[1],RN(0,6.28))}
 for(let i=0;i<n(7,2);i++){let p=landPt();mkRamp(p[0],p[1],RN(0,6.28))}
 for(let i=0;i<n(3,1);i++){let p=landPt();mkPump(p[0],p[1])}
 for(let i=0;i<n(4,1);i++){let p=landPt();mkCat(p[0],p[1])}
 if(Math.random()<(big?.6:.35)){let p=landPt();mkChest(p[0],p[1])}}
function spawnFront(k){if(!X)setup();const[fx,fz]=fwd(),x=G.x+fx*5,z=G.z+fz*5,a=Math.atan2(fx,fz);
 if(k==='ramp')mkRamp(x+fx*4,z+fz*4,a);else if(k==='pump')mkPump(x,z);else if(k==='cat')mkCat(x,z);else if(k==='chest')mkChest(x,z);else mkVeh(k,x,z,a)}

// floorH: rámpák + megmászott tetők
let ROOF=[];
if(typeof floorH==='function'){const of=floorH;floorH=function(o){let h=of(o);try{if(X){const r=rampH(o.x,o.z);if(r>h&&r<=(o.y||0)+1.3)h=r}
 if(o===G&&ROOF.length)for(const c of ROOF){if(c.h<=h||c.h>(o.y||0)+.7)continue;const[lx,lz]=boxLocal(c,o.x,o.z);if(Math.abs(lx)<c.hw+.2&&Math.abs(lz)<c.hd+.2)h=c.h}}catch(e){}return h}}

// =================== HUD ===================
const css=document.createElement('style');css.textContent=`
#x14hHud{position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:8;display:none;min-width:250px;padding:9px 14px;border-radius:14px;background:linear-gradient(135deg,rgba(15,23,42,.88),rgba(30,41,59,.82));border:1px solid rgba(250,204,21,.35);box-shadow:0 8px 28px rgba(0,0,0,.45);color:#f8fafc;font:600 13px system-ui,sans-serif;text-align:center;pointer-events:none}
#x14hHud .sp{font:800 26px system-ui;color:#fde047;letter-spacing:1px}#x14hHud .bar{height:7px;border-radius:5px;background:#334155;overflow:hidden;margin-top:5px}#x14hHud .bar i{display:block;height:100%;background:linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)}
#x14hP{position:fixed;left:50%;top:62%;transform:translateX(-50%);z-index:8;display:none;padding:6px 14px;border-radius:10px;background:rgba(15,23,42,.85);color:#fff;font:600 14px system-ui;border:1px solid rgba(255,255,255,.15);pointer-events:none}
#x14hP b{color:#fde047}#x14hTr{position:fixed;left:50%;top:30%;transform:translateX(-50%);z-index:8;font:900 34px system-ui;color:#fde047;text-shadow:0 3px 12px #000,0 0 22px rgba(250,204,21,.6);pointer-events:none;opacity:0;transition:opacity .3s}
.x14hBtn{width:46px;height:46px;border-radius:14px;border:1px solid rgba(250,204,21,.45);background:linear-gradient(145deg,#1e293b,#0f172a);color:#fff;font-size:22px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4)}.x14hBtn:hover{transform:scale(1.08)}
#x14hM{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.72);backdrop-filter:blur(4px)}
#x14hM .w{width:min(560px,94vw);max-height:86vh;overflow:auto;padding:20px;border-radius:20px;background:linear-gradient(160deg,#0f172a,#1e1b4b);border:1px solid rgba(250,204,21,.35);color:#f8fafc;font:14px system-ui}
#x14hM h2{margin:0 0 4px;color:#fde047}#x14hM .gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:12px 0}
#x14hM .it{padding:10px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);text-align:center;cursor:pointer}#x14hM .it.on{border-color:#fde047;box-shadow:0 0 14px rgba(250,204,21,.35)}
#x14hM .sw{height:34px;border-radius:9px;margin-bottom:6px}#x14hM button.c{margin-top:8px;padding:8px 18px;border-radius:10px;border:0;background:#fde047;color:#111;font-weight:800;cursor:pointer}
#x14hM small{color:#94a3b8}`;document.head.appendChild(css);
const hud=document.createElement('div');hud.id='x14hHud';document.body.appendChild(hud);
const pr=document.createElement('div');pr.id='x14hP';document.body.appendChild(pr);
const tr=document.createElement('div');tr.id='x14hTr';document.body.appendChild(tr);
let trT=0;function trick(t){tr.innerHTML=t;tr.style.opacity=1;clearTimeout(trT);trT=setTimeout(()=>tr.style.opacity=0,1800)}
let lastH='',lastP='';
function setP(t){if(t!==lastP){lastP=t;pr.innerHTML=t;pr.style.display=t?'block':'none'}}
function drawHud(){let t='';if(X&&X.drive){const v=X.drive,K=KIND[v.k];t='<div>'+K.n+'</div><div class="sp">'+Math.round(Math.abs(v.sp)*3.6)+' km/h</div>'+(K.fuel?'<div class="bar"><i style="width:'+Math.round(v.fuel*100)+'%"></i></div><small>⛽ '+Math.round(v.fuel*100)+'%'+(X.refuel?' – tankolás…':'')+'</small>':'<small>Szóköz: ollie · levegőben A/D pörgés, W/S szaltó</small>')+'<br><small>Insert: duda · E: kiszállás · 🏆 trükk-rekord: '+X.best+'</small>'}
 else if(X&&(X.boots||X.wing)){t=(X.boots?'🚀 Rakétacipő'+(X.dj?' (elhasználva)':' – dupla ugrás kész'):'')+(X.wing?' 🪽 Szárnyruha – siklás':'')}
 if(t!==lastH){lastH=t;hud.innerHTML=t;hud.style.display=t?'block':'none'}}

// =================== LOBBY GOMB + SKIN BOLT ===================
const modal=document.createElement('div');modal.id='x14hM';modal.innerHTML='<div class="w"></div>';document.body.appendChild(modal);
modal.addEventListener('click',e=>{if(e.target===modal)modal.style.display='none'});
function shop(){const w=modal.firstChild;const ft=n=>n.toLocaleString('hu-HU')+' Ft';
 w.innerHTML='<h2>🎨 Járműfényező</h2><small>Az autó, a robogó és a deszka színe. Egyenleged: <b style="color:#86efac">'+ft(Math.round(S.c))+'</b></small><div class="gr">'+SKINS.map(s=>{const own=OWN.includes(s.id);
  const bg=s.rb?'linear-gradient(90deg,#ef4444,#f59e0b,#84cc16,#06b6d4,#8b5cf6)':'linear-gradient(135deg,#'+s.c.toString(16).padStart(6,'0')+' 60%,#'+s.a.toString(16).padStart(6,'0')+')';
  return'<div class="it'+(SKIN===s.id?' on':'')+'" data-id="'+s.id+'"><div class="sw" style="background:'+bg+'"></div><b>'+s.n+'</b><br><small>'+(SKIN===s.id?'✔ Felszerelve':own?'Megvan – kattints':ft(s.p))+'</small></div>'}).join('')+
  '</div><small>🚗 E: beszállás · ⛽ benzinkútnál E: tankolás · 🏁 rámpán trükk = Ft · 🎯 katapult · 🚀 ritka láda: rakétacipő · 🪽 Insert zuhanás közben · 🧗 szóköz falnál: mászás</small><br><button class="c">Bezár</button>';
 w.querySelector('.c').onclick=()=>modal.style.display='none';
 w.querySelectorAll('.it').forEach(el=>el.onclick=()=>{const s=SKINS.find(q=>q.id===el.dataset.id);if(!OWN.includes(s.id)){if(S.c<s.p){sayX('💸 Nincs elég pénzed: '+ft(s.p));return}addFt(-s.p);OWN.push(s.id);LS.s('own',OWN)}SKIN=s.id;LS.s('skin',SKIN);skinAll();try{tone(700,.15,'triangle',.08,1200)}catch(e){}shop()})}
let btn=null;
function ui(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!btn){btn=document.createElement('button');btn.className='x14hBtn';btn.textContent='🚗';btn.title='Járműfényező (Insert)';btn.onclick=shop;h.appendChild(btn)}
 const show=!inMatch();btn.style.display=show?'':'none';if(!show){if(modal.style.display==='flex')modal.style.display='none'}else{hud.style.display='none';lastH='';setP('')}}
setInterval(ui,500);
const _shopOpen=()=>{modal.style.display='flex';shop()};btn&&(btn.onclick=_shopOpen);setTimeout(()=>{if(btn)btn.onclick=_shopOpen},0);

// =================== JÁRMŰ BE/KI ===================
function nearVeh(){if(!X)return null;let b=null,bd=1e9;X.veh.forEach(v=>{const d=Math.hypot(v.x-G.x,v.z-G.z);if(d<(v.k==='car'?3.4:2.4)&&d<bd&&!v.air){bd=d;b=v}});return b}
function nearPump(){return X&&X.pumps.find(p=>Math.hypot(p.x-G.x,p.z-G.z)<4.5)}
function nearChest(){return X&&X.chests.find(c=>!c.open&&Math.hypot(c.x-G.x,c.z-G.z)<2.6)}
function enter(v){X.drive=v;v.lb.visible=false;v.sp=0;v.vx=v.vz=0;X.wing=0;X.fly=null;horn('board');sayX(KIND[v.k].n+' – W/S gáz/fék, A/D kormány, Insert duda, E kiszállás')}
function leave(){const v=X.drive;if(!v)return;const sx=Math.cos(v.a),sz=-Math.sin(v.a);let x=v.x+sx*2,z=v.z+sz*2;if(!onMap(x,z)){x=v.x-sx*2;z=v.z-sz*2}
 G.x=x;G.z=z;G.y=floorH({x,z,y:v.y+.5});G.vy=0;G.vx=G.vz=0;X.drive=null;X.refuel=0;v.lb.visible=true;v.sp=0;v.vx=v.vz=0}
function openChest(c){c.open=1;X.boots=1;X.dj=0;scene.remove(c.m);tone(520,.2,'triangle',.08,1040);setTimeout(()=>tone(780,.3,'triangle',.08,1560),180);sayX('🚀 RAKÉTACIPŐ! Ugrás a levegőben még egyszer (szóköz).')}

{const ox=window.x20near;window.x20near=function(){try{if(X&&normal()&&(X.drive||nearVeh()||nearChest()||nearPump()))return true}catch(e){}return ox?ox.apply(this,arguments):false}}

const K14={};function KEYS(){try{return keys||{}}catch(e){return {}}}
addEventListener('keyup',e=>{K14[e.code]=0},true);
addEventListener('keydown',e=>{if(typing(e))return;K14[e.code]=1;
 if(e.code==='Insert'){e.preventDefault();if(!inMatch()){_shopOpen();return}if(!X||!normal())return;
  if(X.drive){horn(X.drive.k);return}
  const gh=floorH({x:G.x,z:G.z,y:G.y});if(G.phase==='play'&&!X.wing&&G.y-gh>9){X.wing=1;wingOn();sayX('🪽 Szárnyruha kinyitva! Irányíts egérrel, Insert: becsuk.')}
  else if(X.wing){X.wing=0;wingOff()}else sayX('🪽 Szárnyruhához ugorj magasról (katapult, hegy, tető) és nyomj Insertet!');return}
 if(!X||!normal()||G.phase!=='play')return;
 if(e.key&&e.key.toLowerCase()==='e'&&!e.repeat){
  if(X.drive){const p=nearPump();if(p&&KIND[X.drive.k].fuel&&!X.refuel&&X.drive.fuel<.99){X.refuel=1;sayX('⛽ Tankolás… (E még egyszer: kiszállás)');e.stopImmediatePropagation();return}
   e.stopImmediatePropagation();leave();return}
  const c=nearChest();if(c){e.stopImmediatePropagation();openChest(c);return}
  const v=nearVeh();if(v){e.stopImmediatePropagation();enter(v);return}}
 if(e.code==='Space'&&X.drive){e.stopImmediatePropagation();e.preventDefault();const v=X.drive;if(!v.air&&v.k!=='car'){v.air=1;v.vy=v.k==='board'?8:6;v.spin=v.flip=v.at=0;tone(300,.08,'triangle',.06)}}},true);

// dupla ugrás + falmászás indítása
WP('jump',a=>{if(!X||!normal()||G.phase!=='play'||X.drive)return;const gh=floorH({x:G.x,z:G.z,y:G.y});
 if(X.boots&&!X.dj&&G.y>gh+.35){X.dj=1;G.vy=13;tone(200,.3,'sawtooth',.06,700);boostFx()}});
function boostFx(){const m=new THREE.Mesh(new THREE.RingGeometry(.3,.9,16),new THREE.MeshBasicMaterial({color:0x67e8f9,transparent:true,opacity:.8,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(G.x,G.y,G.z);scene.add(m);
 let t=0;const iv=setInterval(()=>{t+=.05;m.scale.setScalar(1+t*4);m.material.opacity=.8-t*1.6;if(t>.5){clearInterval(iv);scene.remove(m)}},40)}
function wingOn(){if(X.wingM)scene.remove(X.wingM);const s=new THREE.Shape();s.moveTo(0,.6);s.lineTo(1.6,-.4);s.lineTo(0,-.1);s.lineTo(-1.6,-.4);s.closePath();
 X.wingM=new THREE.Mesh(new THREE.ShapeGeometry(s),new THREE.MeshStandardMaterial({color:skin().c,side:THREE.DoubleSide,emissive:0x111111}));scene.add(X.wingM);tone(180,.4,'sawtooth',.05,90)}
function wingOff(){if(X&&X.wingM){scene.remove(X.wingM);X.wingM=null}}
function wallNear(){let best=null;(G.col||[]).forEach(c=>{if(!c.hw||c.h>14||c.h<G.y+.8)return;if(Math.abs(G.x-c.x)>c.hw+c.hd+3||Math.abs(G.z-c.z)>c.hw+c.hd+3)return;const[lx,lz]=boxLocal(c,G.x,G.z);const ex=Math.abs(lx)-c.hw,ez=Math.abs(lz)-c.hd;if(Math.max(ex,ez)<1.1&&Math.max(ex,ez)>-.3){if(!best||c.h<best.h)best=c}});return best}

// =================== FRISSÍTÉS ===================
function vehStep(v,dt,me){const K=KIND[v.k];const keys=KEYS();
 let th=0,st=0;if(me){th=((keys.w||keys.arrowup)?1:0)-((keys.s||keys.arrowdown)?1:0);st=((keys.a||keys.arrowleft)?1:0)-((keys.d||keys.arrowright)?1:0)}
 if(K.fuel&&v.fuel<=0&&th>0)th=0;
 if(!v.air){v.sp+=th*(th*v.sp<0?K.acc*2:K.acc)*dt;v.sp*=1-dt*(th?.25:(v.k==='board'?.5:1));if(me&&keys.shift&&v.k==='car')v.sp*=1-dt*2.5;
  v.sp=Math.max(-8,Math.min(K.max*(G._x14hBoost||1),v.sp));v.a+=st*dt*(v.k==='moto'?2.3:2)*Math.sign(v.sp||1)*Math.min(1,Math.abs(v.sp)/5);
  const hx=Math.sin(v.a)*v.sp,hz=Math.cos(v.a)*v.sp,gr=Math.min(1,K.grip*dt*(me&&keys.shift&&v.k==='car'?.25:1));v.vx+=(hx-v.vx)*gr;v.vz+=(hz-v.vz)*gr;
  if(K.fuel&&me)v.fuel=Math.max(0,v.fuel-Math.abs(v.sp)*K.ft*dt/30)}
 else{if(me&&v.k!=='car'){v.spin+=st*dt*7;v.flip+=th*dt*6}else if(v.k==='car'&&me){v.spin+=st*dt*3}v.at+=dt}
 const nx=v.x+v.vx*dt,nz=v.z+v.vz*dt;if(onMap(nx,nz)){v.x=nx;v.z=nz}else{v.sp*=-.3;v.vx*=-.3;v.vz*=-.3}
 const o={x:v.x,z:v.z};try{pushOut(o,v.k==='car'?1.4:.6,v.y+.5)}catch(e){}if(Math.hypot(o.x-v.x,o.z-v.z)>.01){if(Math.abs(v.sp)>14&&me){try{hurt(Math.abs(v.sp)*.6)}catch(e){}tone(90,.25,'sawtooth',.1)}v.sp*=.4;v.vx*=.4;v.vz*=.4}v.x=o.x;v.z=o.z;
 const gy=floorH({x:v.x,z:v.z,y:v.y});
 if(!v.air){if(gy<v.y-.4&&Math.abs(v.sp)>4){v.air=1;v.vy=Math.max(0,v.rvy||0)*1.25+(v.rvy>1?2.5:0);v.spin=v.flip=v.at=0}else{v.rvy=(gy-v.y)/Math.max(dt,.001);v.y=gy}}
 if(v.air){v.vy-=22*dt;v.y+=v.vy*dt;if(v.y<=gy){v.y=gy;land(v,me)}}
 const pitch=v.air?-v.flip:-Math.atan2((v.rvy||0)*dt,Math.max(.01,Math.abs(v.sp)*dt))*Math.sign(v.sp||1)*.9;
 v.m.position.set(v.x,v.y,v.z);v.m.rotation.set(v.air?pitch:Math.max(-.4,Math.min(.4,pitch)),v.a+(v.air?v.spin:0),v.k==='moto'&&!v.air?-st*Math.min(.35,Math.abs(v.sp)/60):0,'YXZ');
 v.wh.forEach(w=>w.rotation.x+=v.sp*dt*2);
 if(me){G.x=v.x;G.z=v.z;G.y=v.y+K.seat;G.vx=G.vz=0;G.vy=0;
  if(Math.abs(v.sp)>10&&G.en)G.en.forEach(e=>{if(e.dead||!(Math.hypot(e.x-v.x,e.z-v.z)<2.2+(e.r||1)*.4))return;if((e._x14hT||0)>X.t)return;e._x14hT=X.t+1;try{dmgE(e,Math.abs(v.sp)*(v.k==='car'?5:3),false)}catch(er){}e.x+=v.vx*.12;e.z+=v.vz*.12})}}
function land(v,me){v.air=0;v.vy=0;const fr=((v.flip%(Math.PI*2))+Math.PI*2)%(Math.PI*2),bad=fr>.9&&fr<Math.PI*2-.9;
 const spins=Math.floor(Math.abs(v.spin)/(Math.PI*.95)),flips=Math.round(Math.abs(v.flip)/(Math.PI*2));
 if(me&&v.at>.35){if(bad){v.sp*=.2;v.vx*=.2;v.vz*=.2;trick('💥 Bukta!');try{hurt(8)}catch(e){}tone(80,.3,'sawtooth',.1)}
  else{const pts=Math.round(v.at*120)+spins*180+flips*500+(v.k==='board'?100:0);const nm=[];if(spins)nm.push((spins*180)+'°');if(flips)nm.push(flips>1?flips+'× szaltó':'szaltó');if(!nm.length)nm.push(v.at>1.2?'Nagy ugrás':'Ugrás');
   X.trick+=pts;if(pts>X.best){X.best=pts;LS.s('best',pts)}addFt(pts*3);trick('🏁 '+nm.join(' + ')+'<br><span style="font-size:20px">+'+pts+' pont · +'+(pts*3).toLocaleString('hu-HU')+' Ft</span>');tone(500,.12,'triangle',.08,900)}}
 v.spin=v.flip=0;v.a+=0}

WP('launch',null,()=>{clearAll();ROOF=[];setTimeout(()=>{if(inMatch()&&normal())try{setup()}catch(e){console.error('x14h setup',e)}},1200)});
WP('end',()=>{if(X&&X.drive)try{leave()}catch(e){}wingOff();clearAll();ROOF=[];hud.style.display='none';lastH='';setP('')});
WP('update',null,a=>{if(!inMatch()||!X)return;if(X.G!==G){clearAll();return}if(!normal())return;const dt=Math.min(.05,a[0]||.016);X.t+=dt;
 const sk=skin();if(sk.rb){X.veh.forEach(v=>v.paint.color.setHSL((X.t*.15)%1,.85,.55))}
 X.veh.forEach(v=>{if(v===X.drive)vehStep(v,dt,1);else if(v.air||Math.abs(v.sp)>.05){vehStep(v,dt,0);v.sp*=1-dt*2}});
 // tankolás
 if(X.drive&&X.refuel){const p=nearPump();if(!p||Math.abs(X.drive.sp)>3)X.refuel=0;else{X.drive.fuel=Math.min(1,X.drive.fuel+dt*.25);X.drive.sp*=.9;if(X.drive.fuel>=1){X.refuel=0;sayX('⛽ Tele a tank!');tone(880,.15,'triangle',.07)}}}
 X.chests.forEach(c=>{if(!c.open)c.m.rotation.y+=dt*1.5});
 const gh=floorH({x:G.x,z:G.z,y:G.y}),air=G.y>gh+.3;
 if(!air)X.dj=0;
 if(!X.drive&&G.phase==='play'){
  // katapult
  X.cats.forEach(c=>{c.cd-=dt;if(c.ph>0){c.ph-=dt;c.arm.rotation.x=-Math.sin(Math.min(1,c.ph*2)*Math.PI)*1.2}
   if(c.cd<=0&&!air&&Math.hypot(c.x-G.x,c.z-G.z)<1.3){c.cd=3;c.ph=.5;const[fx,fz]=fwd();G.vy=30;X.fly={vx:fx*20,vz:fz*20,g:.4};tone(140,.5,'sawtooth',.08,600);sayX('🎯 KILŐVE! Nyomj Insertet a szárnyruhához!')}});
  // repülő lendület (katapult / szárnyruha)
  if(X.wing){const[fx,fz]=fwd();X.fly={vx:fx*24,vz:fz*24};if(G.vy<-4.5)G.vy=-4.5;if(!X.wingM)wingOn();X.wingM.position.set(G.x,G.y+1.1,G.z);X.wingM.rotation.set(-Math.PI/2,0,Math.PI/2-G.ang,'YXZ');X.wingM.rotation.set(-Math.PI/2+.15,0,0);X.wingM.rotation.y=Math.PI/2-G.ang;
   if(G.y-gh<1.6){X.wing=0;wingOff();X.fly=null}}
  if(X.fly){X.fly.g=(X.fly.g||0)-dt;if(!air&&!X.wing&&X.fly.g<=0)X.fly=null;else{const nx=G.x+X.fly.vx*dt,nz=G.z+X.fly.vz*dt;if(onMap(nx,nz)){G.x=nx;G.z=nz}else X.fly=null;if(X.fly&&!X.wing){X.fly.vx*=1-dt*.3;X.fly.vz*=1-dt*.3}}}
  // falmászás: szóköz nyomva fal mellett a levegőben
  if((K14.Space||KEYS()[' '])&&!X.wing){const c=wallNear();if(c&&(air||X.climb>0||KEYS().w)&&X.cst>0){X.climb=.2;X.cst-=dt;G.vy=Math.max(G.vy,4.5);
    if(G.y>c.h-1.3){if(!ROOF.includes(c))ROOF.push(c);const[lx,lz]=boxLocal(c,G.x,G.z);const k=.7,qx=Math.max(-c.hw*k,Math.min(c.hw*k,lx)),qz=Math.max(-c.hd*k,Math.min(c.hd*k,lz));
     G.x=c.x+qx*c.cs+qz*c.sn;G.z=c.z-qx*c.sn+qz*c.cs;G.y=c.h;G.vy=0;X.climb=0;tone(400,.1,'triangle',.06,600);sayX('🧗 Felhúzódtál a párkányra!')}}else X.climb=0}
  else X.climb=Math.max(0,X.climb-dt);if(!air)X.cst=3;}
 // súgó
 let p='';if(X.drive){const pm=nearPump();if(pm&&KIND[X.drive.k].fuel&&!X.refuel&&X.drive.fuel<.99)p='<b>[E]</b> Tankolás ⛽';else if(KIND[X.drive.k].fuel&&X.drive.fuel<=0)p='⛽ Kifogyott a benzin! Keress benzinkutat (zöld kút).'}
 else if(G.phase==='play'){const c=nearChest(),v=nearVeh();if(c)p='<b>[E]</b> Ritka láda kinyitása 🚀';else if(v)p='<b>[E]</b> '+KIND[v.k].n+(KIND[v.k].fuel?' ⛽'+Math.round(v.fuel*100)+'%':'');else if(!X.wing&&air&&G.y-gh>9&&G.vy<0)p='<b>[Insert]</b> Szárnyruha 🪽';else if(air&&!X.climb&&wallNear()&&X.cst>0)p='<b>[Szóköz nyomva]</b> Falmászás 🧗'}
 setP(p);drawHud()});

// =================== PARANCSOK ===================
{const oc=window.extraCmd;window.extraCmd=function(c){const n=String(c).trim().split(/\s+/)[0].toLowerCase();
 const M={auto:'car',motor:'moto',robogo:'moto',deszka:'board',rampa:'ramp',katapult:'cat',kut:'pump',benzinkut:'pump',lada:'chest'};
 if(M[n]){if(!inMatch())return'🚗 Csak meccsben!';spawnFront(M[n]);return'✅ Lerakva előtted: '+n}
 if(['auto','autó','car'].includes(n)||['robogo','robogó','moto'].includes(n)||['deszka','gordeszka','gördeszka','board'].includes(n)){if(!inMatch())return'Csak meccsben!';const k=/^(auto|autó|car)$/.test(n)?'car':/^(robog|moto)/.test(n)?'moto':'board';spawnFront(k);return k==='car'?'🚗 Autó előtted ([E] beszáll)':k==='moto'?'🛵 Robogó előtted ([E] felül)':'🛹 Gördeszka előtted ([E] rááll)'}if(n==='cipo'){if(!inMatch()||!X)return'Csak meccsben!';X.boots=1;X.dj=0;return'🚀 Rakétacipő felvéve.'}
 return oc?oc.apply(this,arguments):undefined}}
window._x14h=()=>X;window._x14hApi={wallNear,spawnFront,setup,skins:SKINS,shop:_shopOpen};
})();
