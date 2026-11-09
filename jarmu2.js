// jarmu2.js – JÁRMŰVEK 2.0 (az extra140h.js-re épül, _x14hApi-n át):
// ⛳ golfkocsi, 🚜 traktor, 🛞 közbeszerzési úthenger, 🛸 lebegő lapát (új modellek + KIND),
// 🔧 jármű-HP → füst/tűz/robbanás (poolozott részecskék), 💡 hamis fényszóró éjjel (additív kúp),
// 🔊 motorhang WebAudio fordulatszám szerint, 🪀 felfüggesztés-billegés, 🌫️ por + 💦 csobbanás,
// 🤝 utas-ülés a bot-társnak (x13a ally), 🏁 GARÁZS a lobbyban (vásárlás Ft-ért, k3x14hveh) + /garazs hívás,
// 📦 járműládák a pályán (E = véletlen jármű). Debug: _jm2
(()=>{
if(!window._x14hApi){console.warn('jarmu2: nincs _x14hApi');return}
const A=window._x14hApi,K=A.KIND,MO=A.MODELS,STD=A.STD;
const RN=(a,b)=>a+Math.random()*(b-a);
const sayX=t=>{try{say(t)}catch(e){}};
const LS={g(k,d){try{const v=localStorage.getItem('k3x14h'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem('k3x14h'+k,JSON.stringify(v))}catch(e){}}};
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';

// =================== ÚJ JÁRMŰVEK ===================
Object.assign(K,{
 golf:{cab:1,n:'⛳ Közkert golfkocsi',max:22,acc:15,grip:4.2,seat:.8,fuel:1,ft:.02,hp:90,seats:2,near:3,exitD:2,lbY:2.9,spawn:[1,0],cmd:['golf','golfkocsi'],price:150000,noJump:1,d:'Csendes, takarékos, két ülés. A parkgondnokság büszkesége.'},
 traktor:{cab:1,n:'🚜 Szövetkezeti traktor',max:19,acc:11,grip:4.8,seat:1.6,fuel:1,ft:.06,hp:220,arm:.6,ram:8,seats:2,near:3.6,exitD:2.8,lbY:3.8,hitR:2.6,spawn:[1,0],cmd:['traktor'],price:300000,noJump:1,d:'Lassú, de mindenen átmegy. Erős ütközés, vastag gumik.'},
 henger:{cab:1,n:'🛞 Közbeszerzési úthenger',max:12,acc:7,grip:7,seat:2,fuel:1,ft:.08,hp:400,arm:.3,crush:60,near:3.9,exitD:3.2,lbY:4.2,hitR:2.9,spawn:[1,0],cmd:['henger','uthenger','úthenger'],price:600000,noJump:1,d:'Páncélozott, bármi elé kerül, kilapítja. Ára a háromszorosa.'},
 hover:{n:'🛸 Lebegő Lapát',max:30,acc:22,grip:1.6,seat:.55,fuel:0,hp:50,hover:1,near:2.4,lbY:1.6,spawn:[1,0],cmd:['hover','lebego','lebegő'],price:450000,d:'Kísérleti pályázati prototípus. Csúszik, ugrik, pörög.'}
});
K.car.cab=1;
const NEW=['golf','traktor','henger','hover'];
// közös geometriák/anyagok a modellekhez (egyszer jönnek létre)
const GEO={};const geo=(k,f)=>GEO[k]||(GEO[k]=f());
const MAT={dark:STD(0x111827,{roughness:.8}),steel:STD(0x94a3b8,{metalness:.8,roughness:.3}),glass:STD(0x1e293b,{metalness:.7,roughness:.1,transparent:true,opacity:.6}),
 white:new THREE.MeshBasicMaterial({color:0xfffbeb}),red:new THREE.MeshBasicMaterial({color:0xef4444}),seat:STD(0x7c2d12,{roughness:.7}),
 yel:STD(0xfacc15,{roughness:.5}),cyan:new THREE.MeshBasicMaterial({color:0x22d3ee,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false})};
const box=(g,w,h,d,m,x,y,z,rx)=>{const o=new THREE.Mesh(geo('b'+w+'_'+h+'_'+d,()=>new THREE.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;g.add(o);return o};
const cyl=(g,r,h,m,x,y,z,rz)=>{const o=new THREE.Mesh(geo('c'+r+'_'+h,()=>new THREE.CylinderGeometry(r,r,h,12)),m);o.position.set(x,y,z);if(rz)o.rotation.z=rz;g.add(o);return o};
const lights=(g,xs,y,z)=>xs.forEach(x=>box(g,.28,.14,.04,MAT.white,x,y,z));
const tails=(g,xs,y,z)=>xs.forEach(x=>box(g,.24,.1,.04,MAT.red,x,y,z));
const tagWheel=(m,r)=>{m.userData.r=r;return m};
MO.golf=(g,paint,acc,wh,wheel)=>{box(g,1.4,.35,2.6,paint,0,.55,0);box(g,1.3,.12,.9,acc,0,.78,.85);
 box(g,1.2,.35,.5,MAT.seat,0,.92,-.35);box(g,1.2,.55,.12,MAT.seat,0,1.2,-.62);
 [[-.6,.95],[.6,.95],[-.6,-.95],[.6,-.95]].forEach(p=>cyl(g,.04,1.3,MAT.steel,p[0],1.45,p[1]));
 box(g,1.5,.08,2.2,paint,0,2.1,0);box(g,1.2,.6,.04,MAT.glass,0,1.5,.98,-.15);
 box(g,.5,.5,.45,MAT.dark,0,1.05,-1.1);[-.12,0,.12].forEach(x=>cyl(g,.03,.9,MAT.steel,x,1.35,-1.1));// golftáska
 cyl(g,.15,.04,MAT.dark,0,1.25,.65,0).rotation.x=-1;lights(g,[-.45,.45],.65,1.31);tails(g,[-.5,.5],.6,-1.31);
 [[-.7,.85],[.7,.85],[-.7,-.85],[.7,-.85]].forEach(p=>wh.push(tagWheel(wheel(g,p[0],.26,p[1],.26,.2),.26)))};
MO.traktor=(g,paint,acc,wh,wheel)=>{box(g,1.1,.9,2,paint,0,1.15,.7);box(g,1.0,.12,2.0,MAT.dark,0,1.66,.7);
 for(let i=0;i<5;i++)box(g,1.12,.05,.06,MAT.dark,0,1.1,1.5-i*.18);// hűtőrács
 cyl(g,.07,1.2,MAT.dark,.35,2.2,1.2);box(g,1.6,.25,1.6,MAT.dark,0,1,-1);
 box(g,1.5,1.4,.06,MAT.glass,0,2.05,-.25);box(g,1.5,1.4,.06,MAT.glass,0,2.05,-1.75);box(g,.06,1.4,1.5,MAT.glass,-.75,2.05,-1);box(g,.06,1.4,1.5,MAT.glass,.75,2.05,-1);
 box(g,1.7,.1,1.8,paint,0,2.8,-1);box(g,.6,.15,.6,MAT.seat,0,1.35,-1.1);box(g,.9,.5,.1,acc,0,.6,1.75);
 lights(g,[-.35,.35],1.3,1.71);tails(g,[-.7,.7],1.1,-1.81);
 box(g,.3,.15,.3,MAT.yel,0,2.93,-1).userData.beacon=1;
 [[-.95,-1],[.95,-1]].forEach(p=>wh.push(tagWheel(wheel(g,p[0],.85,p[1],.85,.55),.85)));
 [[-.75,1.2],[.75,1.2]].forEach(p=>wh.push(tagWheel(wheel(g,p[0],.48,p[1],.48,.32),.48)))};
MO.henger=(g,paint,acc,wh,wheel)=>{// elöl nagy henger, hátul két kerék, kabin tetővel
 const dr=new THREE.Mesh(geo('drum',()=>new THREE.CylinderGeometry(.95,.95,2.2,20)),MAT.steel);dr.rotation.z=Math.PI/2;dr.position.set(0,.95,1.6);g.add(dr);dr.userData.r=.95;wh.push(dr);
 const sp=new THREE.Mesh(geo('drumsp',()=>new THREE.BoxGeometry(2.25,.12,1.7)),MAT.dark);dr.add(sp);
 box(g,2.4,.35,.9,paint,0,2.05,1.6);box(g,.3,1.1,.3,paint,-1.05,1.5,1.6);box(g,.3,1.1,.3,paint,1.05,1.5,1.6);
 box(g,1.9,1.1,2.4,paint,0,1.25,-.8);box(g,1.95,.12,2.45,acc,0,1.85,-.8);
 box(g,1.2,.5,.6,MAT.seat,0,2.15,-.9);box(g,.9,.08,.9,MAT.dark,0,2.35,-.25);
 [[-.8,-.15],[.8,-.15],[-.8,-1.6],[.8,-1.6]].forEach(p=>cyl(g,.05,1.6,MAT.dark,p[0],2.65,p[1]));
 box(g,2,.12,1.8,acc,0,3.45,-.9);box(g,.3,.15,.3,MAT.yel,.7,3.6,-.9).userData.beacon=1;
 for(let i=0;i<6;i++)box(g,.32,.06,.9,i%2?MAT.dark:MAT.yel,-.8+i*.32,.75,-2.02);// figyelmeztető csík
 lights(g,[-.7,.7],1.5,.41);tails(g,[-.7,.7],1.3,-2.02);
 [[-1.05,-1.2],[1.05,-1.2]].forEach(p=>wh.push(tagWheel(wheel(g,p[0],.7,p[1],.7,.4),.7)))};
MO.hover=(g,paint,acc)=>{box(g,.7,.1,1.9,paint,0,.2,0);box(g,.6,.02,1.7,acc,0,.26,0);
 const r=new THREE.Mesh(geo('hring',()=>new THREE.TorusGeometry(.32,.05,6,16)),MAT.cyan);r.rotation.x=Math.PI/2;
 [.6,-.6].forEach(z=>{const c=r.clone();c.position.set(0,.12,z);g.add(c);const d=new THREE.Mesh(geo('hdisc',()=>new THREE.CircleGeometry(.3,14)),MAT.cyan);d.rotation.x=Math.PI/2;d.position.set(0,.1,z);g.add(d)});
 box(g,.1,.1,.3,MAT.dark,-.36,.25,-.8);box(g,.1,.1,.3,MAT.dark,.36,.25,-.8)};

// =================== RÉSZECSKE-POOL ===================
const tex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const gr=x.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.5,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const PN=140,P=[];let pi=0,pScene=null;
for(let i=0;i<PN;i++){const m=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:0});const s=new THREE.Sprite(m);s.visible=false;P.push({s,m,life:0,max:1,vx:0,vy:0,vz:0,g0:1,g1:2,add:false})}
const PCOL={dust:0xa8906c,smoke:0x52525b,fire:0xf97316,spark:0xfde047,splash:0xbae6fd,blue:0x67e8f9};
function emit(t,x,y,z,vx,vy,vz,life,s0,s1){if(typeof scene==='undefined')return;if(pScene!==scene){pScene=scene;P.forEach(p=>scene.add(p.s))}
 const p=P[pi];pi=(pi+1)%PN;p.life=p.max=life;p.vx=vx;p.vy=vy;p.vz=vz;p.g0=s0;p.g1=s1;p.s.position.set(x,y,z);p.s.visible=true;p.m.color.setHex(PCOL[t]);
 const add=(t==='fire'||t==='spark'||t==='blue');if(p.add!==add){p.add=add;p.m.blending=add?THREE.AdditiveBlending:THREE.NormalBlending;p.m.needsUpdate=true}p.grav=t==='splash'?-12:t==='spark'?-6:0}
function stepP(dt){for(const p of P){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.s.visible=false;p.m.opacity=0;continue}const k=1-p.life/p.max;p.vy+=p.grav*dt;
 p.s.position.x+=p.vx*dt;p.s.position.y+=p.vy*dt;p.s.position.z+=p.vz*dt;p.s.scale.setScalar(p.g0+(p.g1-p.g0)*k);p.m.opacity=(1-k)*(p.add?.9:.6)}}
// robbanás-villanás + lökéshullám (egy-egy pooled mesh)
const flash=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),new THREE.MeshBasicMaterial({color:0xffa94d,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));flash.visible=false;
const ring=new THREE.Mesh(new THREE.RingGeometry(.8,1,32),new THREE.MeshBasicMaterial({color:0xfde68a,transparent:true,opacity:0,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.visible=false;
let boomT=0;
window._x14hBoomFx=v=>{if(flash.parent!==scene){scene.add(flash);scene.add(ring)}flash.position.set(v.x,v.y+1,v.z);ring.position.set(v.x,v.y+.1,v.z);flash.visible=ring.visible=true;boomT=.7;
 for(let i=0;i<26;i++){const a=RN(0,6.28),s=RN(2,9);emit(i%3?'fire':'spark',v.x,v.y+1,v.z,Math.cos(a)*s,RN(2,10),Math.sin(a)*s,RN(.5,1.1),1,3)}
 for(let i=0;i<14;i++)emit('smoke',v.x+RN(-1,1),v.y+1,v.z+RN(-1,1),RN(-1,1),RN(1.5,3.5),RN(-1,1),RN(1.5,2.6),1.5,5);
 // kiégett roncs
 try{v.paint.color.setHex(0x1c1917);v.acc.color.setHex(0x292524);v.lb.visible=false}catch(e){}
 try{noise(.6,.5)}catch(e){}try{if(typeof G!=='undefined'&&Math.hypot(G.x-v.x,G.z-v.z)<14)G.shake=Math.max(G.shake||0,.6)}catch(e){}};

// =================== HANG: motor ===================
let AC=null,EN=null;
function engine(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
 if(!EN){const o=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=600;g.gain.value=0;
  o.connect(f);o2.connect(f);f.connect(g);g.connect(AC.destination);o.start();o2.start();EN={o,o2,f,g}}return EN}catch(e){return null}}
function noise(d,vol){const a=AC||(AC=new (window.AudioContext||window.webkitAudioContext)());const n=a.sampleRate*d,b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
 const s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=900;s.buffer=b;g.gain.value=vol;s.connect(f);f.connect(g);g.connect(a.destination);s.start()}
const BASE={car:55,moto:85,board:0,golf:0,traktor:32,henger:26,hover:0};
let gear=0;
function engineStep(v,dt){const e=engine();if(!e)return;const t=AC.currentTime;
 if(!v||v.dead){e.g.gain.setTargetAtTime(0,t,.08);return}
 const k=K[v.k],r=Math.min(1,Math.abs(v.sp)/k.max);
 if(v.k==='golf'||v.k==='hover'){// elektromos zümmögés
  e.o.type='sine';e.o.frequency.setTargetAtTime(120+r*380,t,.05);e.o2.frequency.setTargetAtTime(240+r*760,t,.05);e.f.frequency.setTargetAtTime(1500,t,.1);e.g.gain.setTargetAtTime(.012+r*.02,t,.08);return}
 if(v.k==='board'){e.g.gain.setTargetAtTime(v.air?0:r*.02,t,.08);e.o.type='sawtooth';e.o.frequency.setTargetAtTime(40+r*30,t,.1);e.o2.frequency.setTargetAtTime(43,t,.1);e.f.frequency.setTargetAtTime(300,t,.1);return}
 // sebességfokozatok: fordulat 0..1 fokozatonként
 const gN=4,gp=r*gN,g=Math.min(gN-1,Math.floor(gp)),rpm=v.air?1:(gp-g)*.75+.25;if(g!==gear){gear=g}
 const b=BASE[v.k]||50,f=b*(1+rpm*2.2)*(1+g*.12);e.o.type='sawtooth';e.o.frequency.setTargetAtTime(f,t,.04);e.o2.frequency.setTargetAtTime(f*.503,t,.04);
 e.f.frequency.setTargetAtTime(400+rpm*1400,t,.05);e.g.gain.setTargetAtTime(.025+rpm*.03,t,.06)}

// =================== FÉNYSZÓRÓ (hamis) ===================
const coneGeo=(()=>{const g=new THREE.ConeGeometry(1.6,9,18,1,true);g.translate(0,-4.5,0);g.rotateX(-Math.PI/2);return g})();// csúcs az origóban, +z felé nyílik
const coneMat=new THREE.MeshBasicMaterial({color:0xfff3c4,transparent:true,opacity:.13,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
const poolGeo=new THREE.CircleGeometry(2.4,20);const poolMat=new THREE.MeshBasicMaterial({map:tex,color:0xfff1b8,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false});
const HL={car:[[-.6,.75,2],[.6,.75,2]],moto:[[0,1.05,.8]],golf:[[-.45,.65,1.3],[.45,.65,1.3]],traktor:[[-.35,1.3,1.7],[.35,1.3,1.7]],henger:[[-.7,1.5,.4],[.7,1.5,.4]],hover:[[0,.3,.95]]};
window._x14hOnVeh=v=>{const hl=HL[v.k];v.hl=[];if(hl){hl.forEach(p=>{const c=new THREE.Mesh(coneGeo,coneMat);c.position.set(p[0],p[1],p[2]);c.rotation.x=.12;c.visible=false;v.m.add(c);v.hl.push(c)});
  const pl=new THREE.Mesh(poolGeo,poolMat);pl.rotation.x=-Math.PI/2;pl.position.set(0,.05,hl[0][2]+5);pl.visible=false;v.m.add(pl);v.hl.push(pl)}
 v.beacons=[];v.m.traverse(o=>{if(o.userData&&o.userData.beacon)v.beacons.push(o)});v.bob=0;v.bv=0;v.lsp=0;v.lfx=0};
let nightC=0,nightV=false;
function isNight(){try{const m=window._x120&&window._x120().M;if(m&&m.night)return true}catch(e){}
 try{if(typeof scene!=='undefined'&&scene.background&&scene.background.isColor){const c=scene.background;return (c.r+c.g+c.b)/3<.18}}catch(e){}return false}

// =================== UTAS (bot-társ) ===================
let pass=null;
function allyObj(){try{const x=window._x13a;return x&&x.ally&&x.ally.m?x.ally:null}catch(e){return null}}

// =================== JÁRMŰLÁDÁK ===================
let CR=[],crG=null;
function mkCrate(x,z){const g=new THREE.Group();box(g,1.4,1,1.4,STD(0x92400e,{roughness:.8}),0,.5,0);box(g,1.44,.14,1.44,MAT.yel,0,.95,0);box(g,1.44,.14,1.44,MAT.yel,0,.08,0);
 const l=A.lbl('📦 [E] Járműláda','#fcd34d');l.position.y=2;g.add(l);g.position.set(x,0,z);scene.add(g);CR.push({x,z,m:g})}
function crateNear(){if(typeof G==='undefined')return null;return CR.find(c=>Math.hypot(c.x-G.x,c.z-G.z)<2.4)}
function openCrate(c){scene.remove(c.m);CR.splice(CR.indexOf(c),1);const pool=['car','car','moto','board','golf','golf','traktor','hover','henger'];const k=pool[Math.floor(Math.random()*pool.length)];
 const v=A.mkVeh(k,c.x,c.z,RN(0,6.28));v.fuel=1;for(let i=0;i<10;i++)emit('spark',c.x,1,c.z,RN(-3,3),RN(3,7),RN(-3,3),.8,.4,.8);A.tone(520,.15,'triangle',.08,1040);sayX('📦 A ládából: '+K[k].n+'! [E] beszállás')}
{const ox=window.x20near;window.x20near=function(){try{if(A.inMatch()&&A.normal()&&crateNear())return true}catch(e){}return ox?ox.apply(this,arguments):false}}
addEventListener('keydown',e=>{const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;if(!(e.key&&e.key.toLowerCase()==='e')||e.repeat)return;
 try{const X=window._x14h();if(!X||X.drive||!A.inMatch()||!A.normal()||G.phase!=='play')return;const c=crateNear();if(c){e.stopImmediatePropagation();openCrate(c)}}catch(er){}},true);

// =================== GARÁZS ===================
let VOWN=LS.g('veh',[]),callT=0;
const gcss=document.createElement('style');gcss.textContent=`#jm2G{position:fixed;inset:0;z-index:61;display:none;align-items:center;justify-content:center;background:rgba(2,6,23,.75);backdrop-filter:blur(4px)}
#jm2G .w{width:min(720px,95vw);max-height:88vh;overflow:auto;padding:20px;border-radius:20px;background:linear-gradient(160deg,#0f172a,#172554);border:1px solid rgba(56,189,248,.4);color:#f8fafc;font:14px system-ui}
#jm2G h2{margin:0 0 4px;color:#7dd3fc}#jm2G .gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:12px 0}
#jm2G .it{padding:10px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12)}#jm2G .it b{color:#fde047}#jm2G canvas{width:100%;height:110px;border-radius:10px;background:radial-gradient(#334155,#0f172a)}
#jm2G button{margin-top:6px;padding:7px 12px;border-radius:9px;border:0;font-weight:800;cursor:pointer}#jm2G .buy{background:#22c55e;color:#04120a}#jm2G .own{background:#334155;color:#cbd5e1}#jm2G .c{background:#fde047;color:#111}#jm2G small{color:#94a3b8}
#x14hHud{left:14px!important;bottom:200px!important;transform:none!important;min-width:220px!important}
#jm2Hp{position:fixed;left:50%;bottom:200px;transform:translateX(-50%);z-index:8;display:none;padding:5px 14px;border-radius:10px;background:rgba(127,29,29,.85);color:#fff;font:800 14px system-ui;pointer-events:none;animation:jm2p 1s infinite}@keyframes jm2p{50%{opacity:.5}}`;document.head.appendChild(gcss);
const GM=document.createElement('div');GM.id='jm2G';GM.innerHTML='<div class="w"></div>';document.body.appendChild(GM);GM.addEventListener('click',e=>{if(e.target===GM)closeG()});
const warn=document.createElement('div');warn.id='jm2Hp';warn.textContent='🔥 A jármű ég! Szállj ki (E)!';document.body.appendChild(warn);
// előnézet: saját kis renderer, egyszer létrehozva
let PR=null;
function prev(){if(PR)return PR;const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setSize(200,110);const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0x334155,1.1));const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(3,5,4);sc.add(dl);
 const cam=new THREE.PerspectiveCamera(35,200/110,.1,100);PR={r,sc,cam,g:{}};return PR}
function snap(k){const p=prev();let g=p.g[k];if(!g){g=new THREE.Group();const sk=A.skin(),paint=STD(sk.c),acc=STD(sk.a),wh=[];const wheel=(gg,x,y,z,r,w)=>{const m=new THREE.Mesh(geo('pw'+r+w,()=>new THREE.CylinderGeometry(r,r,w,12)),MAT.dark);m.rotation.z=Math.PI/2;m.position.set(x,y,z);gg.add(m);return m};MO[k](g,paint,acc,wh,wheel);p.g[k]=g}
 p.sc.children.filter(o=>o.isGroup).forEach(o=>p.sc.remove(o));p.sc.add(g);g.rotation.y=.7;const s=k==='hover'?3.2:k==='henger'?7.5:6;p.cam.position.set(s*.9,s*.55,s*.9);p.cam.lookAt(0,k==='hover'?.2:1,0);p.r.render(p.sc,p.cam);return p.r.domElement.toDataURL()}
function openG(){GM.style.display='flex';drawG()}function closeG(){GM.style.display='none'}
function drawG(){const w=GM.firstChild;w.innerHTML='<h2>🏁 Garázs</h2><small>Vegyél járművet, meccsben hívd elő: <b>/garazs</b> (90 mp-enként) vagy <b>/garazs traktor</b>. Egyenleged: <b style="color:#86efac">'+ft(S.c)+'</b></small><div class="gr">'+
 NEW.map(k=>{const o=K[k],own=VOWN.includes(k);let img='';try{img=snap(k)}catch(e){}return'<div class="it"><img src="'+img+'" style="width:100%;height:110px;object-fit:cover;border-radius:10px;background:radial-gradient(#334155,#0f172a)"><b>'+o.n+'</b><br><small>'+o.d+'</small><br><small>🏎️ '+Math.round(o.max*3.6)+' km/h · 🔧 '+o.hp+' HP'+(o.seats>1?' · 👥 2 ülés':'')+'</small><br>'+
  (own?'<button class="own" disabled>✔ A garázsodban</button>':'<button class="buy" data-k="'+k+'">Megveszem – '+ft(o.price)+'</button>')+'</div>'}).join('')+
 '</div><button class="c" id="jm2Paint">🎨 Fényezés (skinek)</button> <button class="c" id="jm2X">Bezár</button>';
 w.querySelector('#jm2X').onclick=closeG;w.querySelector('#jm2Paint').onclick=()=>{closeG();A.shop()};
 w.querySelectorAll('.buy').forEach(b=>b.onclick=()=>{const k=b.dataset.k,p=K[k].price;if(S.c<p){sayX('💸 Nincs elég pénzed: '+ft(p));return}S.c-=p;try{save()}catch(e){}VOWN.push(k);LS.s('veh',VOWN);A.tone(700,.15,'triangle',.08,1200);drawG()})}
let gbtn=null;
setInterval(()=>{const h=document.getElementById('x14hub');if(h&&!gbtn){gbtn=document.createElement('button');gbtn.className='x14hBtn';gbtn.id='jm2GBtn';gbtn.textContent='🏁 GARÁZS';gbtn.title='Járműgarázs';gbtn.onclick=openG;h.appendChild(gbtn)}
 if(gbtn)gbtn.style.display=A.inMatch()?'none':'';if(A.inMatch()&&GM.style.display==='flex')closeG()},600);
{const oc=window.extraCmd;window.extraCmd=function(c){const a=String(c).trim().split(/\s+/),n=a[0].toLowerCase();
 if(n==='garazs'||n==='garázs'){if(!A.inMatch()){openG();return'🏁 Garázs megnyitva'}if(!VOWN.length)return'🏁 Üres a garázsod – vegyél járművet a lobbyban!';
  const now=performance.now();if(now<callT)return'⏳ A garázs még '+Math.ceil((callT-now)/1000)+' mp-ig pihen.';let k=(a[1]||'').toLowerCase();k=NEW.find(q=>q===k||(K[q].cmd||[]).includes(k))||VOWN[VOWN.length-1];
  if(!VOWN.includes(k))return'🏁 Ez nincs a garázsodban.';callT=now+90000;const v=A.spawnFront(k);if(v)v.fuel=1;return'🏁 Megérkezett: '+K[k].n}
 if(n==='jarmulada'){if(!A.inMatch())return'Csak meccsben!';mkCrate(G.x+Math.cos(G.ang)*4,G.z+Math.sin(G.ang)*4);return'📦 Járműláda előtted'}
 return oc?oc.apply(this,arguments):undefined}}

// =================== FRISSÍTÉS ===================
let curX=null,lastDrive=null,hornK=0;
function hin2(x,z){try{return G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<56}catch(e){return true}}
const ou=window.update;
if(typeof ou==='function')window.update=function(){const r=ou.apply(this,arguments);try{tick(Math.min(.05,arguments[0]||.016))}catch(e){console.error('jarmu2',e)}return r};
function tick(dt){stepP(dt);
 if(boomT>0){boomT-=dt;const k=1-boomT/.7;flash.scale.setScalar(1+k*5);flash.material.opacity=Math.max(0,.9-k*1.3);ring.scale.setScalar(1+k*10);ring.material.opacity=Math.max(0,.8-k);if(boomT<=0)flash.visible=ring.visible=false}
 const X=window._x14h&&window._x14h();
 if(!X||!A.inMatch()){engineStep(null);warn.style.display='none';if(curX&&!X){CR.forEach(c=>{try{scene.remove(c.m)}catch(e){}});CR=[];curX=null}return}
 if(curX!==X){curX=X;CR.forEach(c=>{try{scene.remove(c.m)}catch(e){}});CR=[];pass=null;const n=G.arh?3:1;for(let i=0;i<n;i++){const p=A.landPt();mkCrate(p[0],p[1])}}
 // éjszaka-detektálás ritkán
 nightC-=dt;if(nightC<=0){nightC=1;nightV=isNight()}
 const t=X.t;
 X.veh.forEach(v=>{if(!v.hl)window._x14hOnVeh(v);
  const k=K[v.k],me=X.drive===v,on=nightV&&!v.dead&&(me||Math.abs(v.sp)>.5||X.drive===v);v.hl.forEach(h=>h.visible=on);
  v.beacons.forEach(b=>b.visible=Math.sin(t*8)>0||!me);
  // felfüggesztés: gyorsulás → bólintás, rugó
  const acc=(v.sp-v.lsp)/Math.max(dt,.001);v.lsp=v.sp;if(!v.air){v.bv+=(-v.bob*120-v.bv*10-acc*.004)*dt;v.bob+=v.bv*dt;v.bob=Math.max(-.12,Math.min(.12,v.bob))}else v.bob*=.9;
  if(!v.air&&v.m.rotation)v.m.rotation.x+=Math.max(-.06,Math.min(.06,-acc*.0025));
  // por / víz / hover-fény
  const sp=Math.abs(v.sp);v.lfx-=dt;
  if(v.lfx<=0&&!v.dead){v.lfx=.07;const bx=v.x-Math.sin(v.a)*1.4,bz=v.z-Math.cos(v.a)*1.4;
   if(k.hover&&sp>1)emit('blue',bx,v.y+.2,bz,0,.4,0,.35,.3,.7);
   else if(!v.air&&sp>6&&v.k!=='board'){emit('dust',bx+RN(-.5,.5),v.y+.2,bz,RN(-.5,.5),RN(.4,1.2),RN(-.5,.5),.7,.5,1.6+sp*.03);
    if(me&&KEYS().shift&&v.k==='car'){emit('smoke',bx,v.y+.2,bz,RN(-1,1),.8,RN(-1,1),.9,.8,2.2)}}
   if(sp>5&&!v.air){const fx=Math.sin(v.a),fz=Math.cos(v.a);if(!hin2(v.x+fx*3.5,v.z+fz*3.5)){for(let i=0;i<4;i++)emit('splash',v.x+fx*2.5,v.y+.3,v.z+fz*2.5,RN(-2,2)+fx*2,RN(3,6),RN(-2,2)+fz*2,.7,.4,.9)}}
   const hr=v.hp/(k.hp||100);if(hr<.5)emit('smoke',v.x,v.y+1.4,v.z+0,RN(-.3,.3),RN(1,2),RN(-.3,.3),1.4,.6,2.5);
   if(hr<.25){emit('fire',v.x+RN(-.3,.3),v.y+1.1,v.z+RN(-.3,.3),0,RN(1.5,3),0,.5,.5,1.2);v.hp-=(k.hp||100)*.0025}}// ég → kb. 3,5%/mp, ~7 mp múlva robban
 });
 const dv=X.drive;engineStep(dv,dt);
 warn.style.display=dv&&dv.hp/(K[dv.k].hp||100)<.25?'block':'none';
 // utas
 const al=allyObj();
 if(dv&&K[dv.k].seats>1&&al){if(!pass&&Math.hypot(al.x-dv.x,al.z-dv.z)<10){pass=al;sayX('🤝 A társad beült melléd!')}
  if(pass===al){const s=Math.cos(dv.a),c=-Math.sin(dv.a),ox=dv.k==='traktor'?0:.45;al.x=dv.x+s*ox;al.z=dv.z+c*ox;try{al.m.position.set(al.x,dv.y+(dv.k==='traktor'?1.1:.35),al.z);al.m.rotation.y=dv.a}catch(e){}}}
 else if(pass){try{pass.m.position.y=0}catch(e){}pass=null}
 chase(dv||other(),dt);airCol(dt);lastDrive=dv}
// más fájlok járművei (quad/csónak – extra10, jetski – extra70, repülő/heli – extra110): ugyanaz a kamera
function other(){try{const f=window._x110&&_x110().FLY;if(f)return{x:f.x,y:f.y,z:f.z,k:f.k,sp:f.v||0,ext:1,cab:1}}catch(e){}
 try{const w=window._x10W&&_x10W();if(w&&w.drive){const d=w.drive;return{x:d.x,y:d.y||0,z:d.z,k:d.k,sp:d.v||0,ext:1}}}catch(e){}
 try{const z=window._x70Z&&_x70Z();if(z&&z.drive){const d=z.drive;return{x:d.x,y:d.y||0,z:d.z,k:'jetski',sp:d.v||0,ext:1}}}catch(e){}return null}
// repülő/heli (extra110) ütközése a házakkal – a hegyeket ott a hillH kezeli
let airHitT=0;
function airCol(dt){let a=null;try{a=window._x110&&_x110().FLY}catch(e){}if(!a)return;airHitT-=dt;
 const o={x:a.x,z:a.z};try{pushOut(o,a.k==='plane'?2.2:2.6,a.y+.3)}catch(e){return}const d=Math.hypot(o.x-a.x,o.z-a.z);if(d<.01)return;
 a.x=o.x;a.z=o.z;a.m.position.x=a.x;a.m.position.z=a.z;G.x=a.x;G.z=a.z;
 if(airHitT<=0&&a.v>12){airHitT=1;try{hurt(Math.min(35,a.v*.6))}catch(e){}A.tone(90,.3,'sawtooth',.1);for(let i=0;i<8;i++)emit('spark',a.x,a.y+1,a.z,RN(-4,4),RN(1,5),RN(-4,4),.5,.3,.7);sayX('💥 Nekimentél egy épületnek!')}
 a.v*=.3}
// =================== ÜLDÖZŐ KAMERA vezetés közben ===================
let mouseT=0,camP=null;addEventListener('mousemove',e=>{if(Math.abs(e.movementX)>1)mouseT=performance.now()});
const CD={car:7.5,moto:5.5,board:5,golf:6.5,traktor:8.5,henger:10.5,hover:5.5,quad:6,boat:8,jetski:6,plane:13,heli:12};
function chase(v,dt){let c;try{c=cam}catch(e){return}if(!v||v.dead){if(camP&&lastDrive){try{G.pm.visible=!G.fp;G.gun.visible=!!G.fp}catch(e){}}camP=null;return}
 const hd=Math.PI/2-v.a;// jármű-irány G.ang-ként
 if(!v.ext&&performance.now()-mouseT>1500&&Math.abs(v.sp)>3){let d=hd-G.ang;d=Math.atan2(Math.sin(d),Math.cos(d));G.ang+=d*Math.min(1,dt*2.5)}
 const D=CD[v.k]||7,el=Math.max(-.1,Math.min(1.1,.32-(G.pit||0)*1.4)),cx=v.x,cz=v.z,cy=v.y+(v.ext?1:(K[v.k].seat||1));
 const tx=cx-Math.cos(G.ang)*D*Math.cos(el),ty=cy+1.5+Math.sin(el)*D,tz=cz-Math.sin(G.ang)*D*Math.cos(el);
 if(!camP)camP={x:tx,y:ty,z:tz};const k=Math.min(1,dt*8);camP.x+=(tx-camP.x)*k;camP.y+=(ty-camP.y)*k;camP.z+=(tz-camP.z)*k;
 c.position.set(camP.x,Math.max(camP.y,v.y+.8),camP.z);c.lookAt(cx+Math.cos(G.ang)*3,cy+.8,cz+Math.sin(G.ang)*3);
 try{G.gun.visible=false;G.pm.visible=!(v.ext?v.cab:K[v.k].cab)}catch(e){}}
function KEYS(){try{return A.keys()||{}}catch(e){return {}}}

window._jm2={K,emit,boom:v=>A.boom(v),crates:()=>CR,garage:openG,own:()=>VOWN,night:()=>nightV,give:k=>{if(!VOWN.includes(k)){VOWN.push(k);LS.s('veh',VOWN)}}};
})();
