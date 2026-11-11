// sotet3d.js – 🚐 Sötét Program 3D (v2): DUPLA lakókocsi (22 m) + teljesen új HI-TECH LABOR (9 megvehető, látható modul),
// kilépés a VÁROSBA: autós kiszállítás rendelésekre (O), térkép (M), 8 kerület vevőkkel, 🚓 járőrök, 🪴 virágcserepek (termesztés),
// 6 bolt (kiegészítők, kertészet, autókereskedés, labor-szaküzlet, vegyesbolt, büfé). Minden kitalált, rajzfilmes.
(()=>{
const $$=i=>document.getElementById(i);
let R=null,SC,CAM,ON=false,raf=0,yaw=Math.PI,pit=0,px=0,pz=1.5,K={},ST=[],near=null,last=0,clock=0,NPC=[],DISCO=null,PAUSE=false;
let INSIDE=true,INCAR=false,HEMI=null,MOON=null,CAR=null,CARm=null,car={x:16,z:8,h:0,v:0},POL=[],WANT=0,WCD=0,OFF=[],OFFt=0,OVL=null,BIGMAP=false,FX={},MODS={},POTS=[],DROPS=[],COL=[],mmT=0,potT=0;
window.sp3On=()=>ON;window.sp3Resume=()=>{PAUSE=false;lockP()};
const lockP=()=>{try{const r=R.domElement.requestPointerLock();r&&r.catch&&r.catch(()=>{})}catch(e){}};
const DP=()=>window._dp&&_dp();const DD=()=>{const d=DP().D;d.cargo=d.cargo||[];d.acc=d.acc||{};d.pots=d.pots||{};d.veh=d.veh||'berelt';d.lm=d.lm||{};return d};
const PL=(typeof _PL!=="undefined"?_PL:THREE.PointLight);const TL=new THREE.TextureLoader();const TC={};
const RN=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function tex(n,rx,ry,col,o){const k=n+rx+ry+col+JSON.stringify(o||{});if(TC[k])return TC[k];const m=TL.load('tex_opt/'+n+'_diff.jpg');m.wrapS=m.wrapT=THREE.RepeatWrapping;m.repeat.set(rx||1,ry||1);let nm=null;try{nm=TL.load('tex_opt/'+n+'_nor.jpg');nm.wrapS=nm.wrapT=THREE.RepeatWrapping;nm.repeat.set(rx||1,ry||1)}catch(e){}
 const M=new THREE.MeshStandardMaterial(Object.assign({map:m,normalMap:nm,color:col||0xffffff,roughness:.75},o||{}));TC[k]=M;return M}
const MB=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c},o||{}));const EM=(c,i)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i||1});
const box=(w,h,d,m,x,y,z,p)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;(p||SC).add(b);return b};
const cyl=(rt,rb,h,m,x,y,z,s,p)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,s||16),m);c.position.set(x,y,z);c.castShadow=true;(p||SC).add(c);return c};
const sph=(r,m,x,y,z,p)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),m);s.position.set(x,y,z);(p||SC).add(s);return s};
function sprite(t,col,w){const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.fillStyle='rgba(15,23,42,.85)';x.beginPath();x.roundRect?x.roundRect(0,0,512,96,24):x.rect(0,0,512,96);x.fill();x.strokeStyle=col||'#fde047';x.lineWidth=4;x.stroke();x.fillStyle=col||'#fde047';x.font='bold 38px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(t,256,50);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(w||1.6,(w||1.6)*.19,1);s.renderOrder=9;s.userData.w=w||1.6;return s}
function sign(t,bg,fg,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,bg);g.addColorStop(1,'#0f172a');x.fillStyle=g;x.fillRect(0,0,512,128);x.strokeStyle=fg;x.lineWidth=6;x.strokeRect(4,4,504,120);x.fillStyle=fg;x.font='900 54px system-ui';x.textAlign='center';x.textBaseline='middle';x.shadowColor=fg;x.shadowBlur=18;x.fillText(t,256,66);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),emissive:0xffffff,emissiveMap:new THREE.CanvasTexture(c),emissiveIntensity:.9}))}
let AC=null;function beep(f,d,tp,v){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=tp||'square';o.frequency.value=f;g.gain.value=v||.06;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.2));o.stop(AC.currentTime+(d||.2))}catch(e){}}
function toast(t){try{DP().toast(t)}catch(e){}const el=$$('sp3n');if(el){el.innerHTML=t;el.style.opacity=1;clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity=0,3200)}}

// ===================== ADATOK =====================
const VEH={berelt:{n:'Bérelt Zsiga',e:'🚙',sp:13,cap:3,c:0x9ca3af,s:1},robogo:{n:'Robogó',e:'🛵',sp:15,cap:2,c:0xf97316,s:.55},gokart:{n:'Gokart',e:'🏎️',sp:20,cap:1,c:0xef4444,s:.6},auto:{n:'Rozsdás Lada',e:'🚗',sp:17,cap:4,c:0xa16207,s:1},motor:{n:'Motor',e:'🏍️',sp:24,cap:2,c:0x111827,s:.6},furgon:{n:'Furgon',e:'🚚',sp:14,cap:10,c:0xf8fafc,s:1.25},limo:{n:'Limuzin',e:'🚘',sp:22,cap:5,c:0x0f172a,s:1.3,rep:1}};
const ACB={a_pilota:{det:.25},a_maszk:{det:.45},a_sapka:{pay:.05},a_kalap:{pay:.12},a_lanc:{rep:3},a_sal:{rep:1},a_dzseki:{pay:.08},a_oltony:{pay:.18},a_sneaker:{run:.2},a_roller:{run:.4},a_hati:{cap:2},a_sport:{cap:5},a_ora:{time:40},a_kesz:{car:.12},a_tel:{ord:1},a_tel2:{ord:2,det:.15}};
const accB=()=>{const o={det:0,pay:0,rep:0,run:0,cap:0,time:0,car:0,ord:0};Object.values(DD().acc).forEach(id=>{const b=ACB[id];if(b)for(const k in b)o[k]+=b[k]});o.det=Math.min(o.det,.7);return o};
const veh=()=>{const d=DD();return VEH[d.veh]&&(d.veh==='berelt'||d.own[d.veh])?VEH[d.veh]:VEH.berelt};
const capTot=()=>2+accB().cap+veh().cap;const cargoN=()=>DD().cargo.reduce((s,c)=>s+c.n,0);
// kerületek leadási pontjai (DIS sorrendben)
const _V3=new THREE.Vector3();
const DROPPOS=[[-60,-26.5],[60,-26.5],[60,26.5],[-60,26.5],[-86.5,-60],[0,86.5],[86.5,60],[60,-86.5]];

// ===================== BELSŐ: DUPLA LAKÓKOCSI =====================
const BX=10.8,BZ=2.0;
function S(id,x,z,label,col,tab,act,scope,y,w){const sp=sprite(label,col,w);sp.position.set(x,y||2.05,z);SC.add(sp);const s={id,x,z,label,tab,act,sp,scope:scope||'in'};ST.push(s);return s}
function buildInterior(){
 const L1=new PL(0xdbeafe,1.15,10);L1.position.set(-8,2.3,0);SC.add(L1);const L2=new PL(0xe0f2fe,1,10);L2.position.set(-3.5,2.3,0);SC.add(L2);
 const L3=new PL(0xffd59a,1,10);L3.position.set(2.5,2.3,0);L3.castShadow=true;SC.add(L3);const L4=new PL(0xffd59a,.9,9);L4.position.set(8,2.3,0);SC.add(L4);FX.labL=[L1,L2];
 // padló + plafon
 box(9.6,.1,4.6,tex('tile',6,3,0xf1f5f9,{roughness:.18,metalness:.1}),-6.2,-.05,0);box(12.6,.1,4.6,tex('wood',5,2,0xd6b38a),4.9,-.05,0);
 box(22.4,.1,4.6,tex('plaster',8,2,0xf1f5f9),0,2.65,0);
 // falak: labor fém panel, nappali festett
 const wl=tex('metal',4,1,0xcbd5e1,{metalness:.55,roughness:.35}),wall=tex('painted',5,1,0xe2e8f0);
 box(9.6,2.7,.1,wl,-6.2,1.3,-2.3);box(9.6,2.7,.1,wl,-6.2,1.3,2.3);box(.1,2.7,4.6,wl,-11.1,1.3,0);
 box(12.6,2.7,.1,wall,4.9,1.3,-2.3);box(12.6,2.7,.1,wall,4.9,1.3,2.3);box(.1,2.7,4.6,wall,11.2,1.3,0);
 const lam=tex('darkwood',4,1,0x8b5a2b);box(12.5,.8,.06,lam,4.9,.4,-2.24);box(12.5,.8,.06,lam,4.9,.4,2.24);
 // veszélycsík a labor padlóján
 const hz=document.createElement('canvas');hz.width=256;hz.height=32;const hg=hz.getContext('2d');for(let i=0;i<16;i++){hg.fillStyle=i%2?'#111827':'#facc15';hg.beginPath();hg.moveTo(i*16,32);hg.lineTo(i*16+16,0);hg.lineTo(i*16+32,0);hg.lineTo(i*16+16,32);hg.fill()}
 const hzt=new THREE.CanvasTexture(hz);hzt.wrapS=THREE.RepeatWrapping;hzt.repeat.set(2,1);const hzm=new THREE.MeshStandardMaterial({map:hzt});box(.3,.012,4.4,hzm,-1.6,.006,0);
 // üvegfal + ajtónyílás a labor és a nappali között
 const gl=new THREE.MeshPhysicalMaterial({color:0x93c5fd,transparent:true,opacity:.22,roughness:.05,metalness:.1});box(.05,2.6,1.55,gl,-1.45,1.3,-1.5);box(.05,2.6,1.55,gl,-1.45,1.3,1.5);
 box(.12,2.65,.08,MB(0x334155,{metalness:.8}),-1.45,1.32,-.72);box(.12,2.65,.08,MB(0x334155,{metalness:.8}),-1.45,1.32,.72);
 const ls=sign('☣ LABOR ☣','#7f1d1d','#facc15',1.4,.35);ls.position.set(-1.38,2.35,0);ls.rotation.y=Math.PI/2;SC.add(ls);
 // LED plafonpanelek
 [-9.5,-7,-4.5,-2.6].forEach(x=>box(1.4,.03,.9,EM(0xe0f2fe,1.2),x,2.6,0));
 // ===== ÚJ HI-TECH LABOR (alap) =====
 const steel=MB(0xe2e8f0,{metalness:.85,roughness:.22}),dark=MB(0x1f2937,{metalness:.6,roughness:.4});
 box(7.6,.08,.85,steel,-6.8,.95,-1.8);box(7.6,.9,.8,dark,-6.8,.46,-1.82);box(4.4,.08,.85,steel,-8.4,.95,1.8);box(4.4,.9,.8,dark,-8.4,.46,1.82);
 for(let i=0;i<6;i++)box(.9,.02,.5,MB(0x0ea5e9,{metalness:.2,roughness:.6}),-10+i*1.25,1.0,-1.8); // munkalap-szőnyegek
 const glass=c=>new THREE.MeshPhysicalMaterial({color:c,transparent:true,opacity:.6,roughness:.05,emissive:c,emissiveIntensity:.45});
 const cols=[0x22d3ee,0xa855f7,0x84cc16,0xf472b6,0xfacc15,0x38bdf8,0xf97316];
 for(let i=0;i<10;i++){const x=-10.2+i*.75,c=cols[i%7];const f=new THREE.Mesh(i%3===0?new THREE.SphereGeometry(.13,14,10):i%3===1?new THREE.ConeGeometry(.13,.3,14):new THREE.CylinderGeometry(.07,.07,.32,12),glass(c));f.position.set(x,1.13,-1.85);SC.add(f)}
 // polcok üvegekkel a hátsó falon
 [1.55,1.95].forEach(y=>{box(7.4,.04,.3,steel,-6.8,y,-2.1);for(let i=0;i<14;i++)cyl(.05,.06,.22,glass(cols[(i+Math.round(y*3))%7]),-10.3+i*.52,y+.13,-2.1,8)});
 // mosogató, köpenyfogas, tábla
 box(.7,.12,.6,steel,-3.6,.98,-1.8);cyl(.02,.02,.4,steel,-3.6,1.2,-2.0,8);
 cyl(.03,.03,1.8,dark,-2.0,.9,2.0,8);const coat=box(.45,1,.1,MB(0xf8fafc),-2.0,1.2,1.92);
 const wb=document.createElement('canvas');wb.width=512;wb.height=256;const w2=wb.getContext('2d');w2.fillStyle='#f8fafc';w2.fillRect(0,0,512,256);w2.fillStyle='#1e3a8a';w2.font='bold 26px system-ui';['🔷 + 🧊 → ✨ (hűtve!)','🌿 + 🌙 = 💚 MÁMOR?','Tisztaság cél: 99,1%','Ferkó szabálya: NE KÓSTOLD','🧪🧪🧪 ⚗️ → 💰'].forEach((t,i)=>w2.fillText(t,24,44+i*44));
 const wbm=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.1),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(wb)}));wbm.position.set(-5.2,1.6,2.24);wbm.rotation.y=Math.PI;SC.add(wbm);
 // ===== LABOR-MODULOK (csak megvéve látszanak) =====
 const mod=id=>{const g=new THREE.Group();g.visible=false;SC.add(g);MODS[id]=g;return g};
 // UV neon
 {const g=mod('lm_neon');[[-6.2,2.55,-2.2,9.4,0xa855f7],[-6.2,2.55,2.2,9.4,0x22d3ee]].forEach(([x,y,z,w,c])=>box(w,.05,.05,EM(c,3),x,y,z,g));box(.05,.05,4.4,EM(0xf472b6,3),-11,2.55,0,g)}
 // buborékoló tartályok
 {const g=mod('lm_tank');FX.bub=[];[[-10.55,-.75,0x22d3ee],[-10.55,.05,0xa855f7],[-10.55,.85,0x84cc16]].forEach(([x,z,c])=>{cyl(.3,.3,1.9,new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.18,roughness:0}),x,.95,z,20,g);cyl(.26,.26,1.5,EM(c,.9),x,.8,z,20,g);cyl(.33,.33,.12,steel,x,1.95,z,20,g);cyl(.33,.33,.12,steel,x,.06,z,20,g);
  for(let i=0;i<6;i++){const b=sph(.035,EM(0xffffff,1.5),x+RN(-.15,.15),RN(.1,1.5),z+RN(-.15,.15),g);FX.bub.push(b)}})}
 // elszívófülke
 {const g=mod('lm_hood');box(1.8,.1,.9,steel,-9.4,2.3,-1.8,g);box(.06,1.3,.9,steel,-10.27,1.65,-1.8,g);box(.06,1.3,.9,steel,-8.53,1.65,-1.8,g);box(1.75,1.0,.03,new THREE.MeshPhysicalMaterial({color:0xbae6fd,transparent:true,opacity:.25}),-9.4,1.55,-1.37,g);cyl(.18,.18,.4,dark,-9.4,2.5,-1.8,16,g);
  FX.fan=box(.3,.02,.06,MB(0x94a3b8),-9.4,2.27,-1.8,g)}
 // monitorfal (animált grafikonok)
 {const g=mod('lm_mon');const c=document.createElement('canvas');c.width=512;c.height=128;FX.monC=c;FX.monT=new THREE.CanvasTexture(c);for(let i=0;i<4;i++){box(.82,.5,.04,dark,-6.9+i*.88,2.25,-2.2,g);const p=new THREE.Mesh(new THREE.PlaneGeometry(.76,.44),new THREE.MeshBasicMaterial({map:FX.monT}));p.material.map=FX.monT.clone();p.material.map.needsUpdate=true;p.material.map.repeat.set(.25,1);p.material.map.offset.set(i*.25,0);p.position.set(-6.9+i*.88,2.25,-2.17);g.add(p);(FX.monP=FX.monP||[]).push(p)}}
 // futószalag
 {const g=mod('lm_conv');box(4,.06,.5,MB(0x111827,{roughness:.9}),-8.4,1.05,1.75,g);[-10.35,-6.45].forEach(x=>{const r=cyl(.06,.06,.5,steel,x,1.05,1.75,10,g);r.rotation.x=Math.PI/2});FX.conv=[];for(let i=0;i<5;i++)FX.conv.push(box(.22,.16,.22,MB(0xd97706),-10.2+i*.8,1.16,1.75,g))}
 // robotkar
 {const g=mod('lm_robot');const base=cyl(.18,.22,.2,MB(0xf97316,{metalness:.5}),-5.8,1.08,1.75,16,g);const a1=new THREE.Group();a1.position.set(-5.8,1.18,1.75);g.add(a1);box(.1,.7,.1,MB(0xf97316,{metalness:.5}),0,.35,0,a1);const a2=new THREE.Group();a2.position.set(0,.7,0);a1.add(a2);box(.08,.08,.6,MB(0xe5e7eb,{metalness:.8}),0,0,-.3,a2);sph(.07,EM(0x22d3ee,2),0,0,-.62,a2);FX.arm=[a1,a2]}
 // desztillációs torony
 {const g=mod('lm_dist');const cu=MB(0xb87333,{metalness:.9,roughness:.25});cyl(.28,.32,2.3,cu,-3.0,1.15,1.85,20,g);for(let i=0;i<5;i++)cyl(.34,.34,.06,steel,-3.0,.4+i*.45,1.85,20,g);cyl(.1,.1,.45,new THREE.MeshPhysicalMaterial({color:0xfde68a,transparent:true,opacity:.5,emissive:0xfbbf24,emissiveIntensity:.8}),-3.0,1.3,1.53,12,g)}
 // plazma-reaktor (a labor közepén)
 {const g=mod('lm_reakt');cyl(.55,.65,.3,dark,-7.4,.15,0,24,g);FX.core=sph(.32,EM(0x60a5fa,2.5),-7.4,1.0,0,g);FX.rings=[];[0,1,2].forEach(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.5+i*.08,.025,8,40),EM([0x22d3ee,0xa855f7,0xf472b6][i],2));r.position.set(-7.4,1.0,0);g.add(r);FX.rings.push(r)});cyl(.04,.04,1.6,steel,-7.4,1.6,0,8,g);const rl=new PL(0x60a5fa,1.2,6);rl.position.set(-7.4,1.4,0);g.add(rl)}
 // páncélszekrény
 {const g=mod('lm_safe');box(.8,1,.6,MB(0x374151,{metalness:.9,roughness:.3}),-2.3,.5,-1.85,g);cyl(.12,.12,.05,MB(0xfacc15,{metalness:1}),-2.3,.6,-1.53,20,g).rotation.x=Math.PI/2}
 // ===== NAPPALI (pálinka, pályázat, bolt, raktár, buli, ágy, tábla, cserepek, ajtó) =====
 const win=document.createElement('canvas');win.width=128;win.height=64;const wg=win.getContext('2d');wg.fillStyle='#0b1a3d';wg.fillRect(0,0,128,64);for(let i=0;i<40;i++){wg.fillStyle=Math.random()<.5?'#fde68a':'#93c5fd';wg.fillRect(Math.random()*128,20+Math.random()*44,3,4)}wg.fillStyle='#f8fafc';wg.beginPath();wg.arc(100,14,7,0,7);wg.fill();
 const wm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(win)});[0.5,4.5].forEach(x=>{box(1.4,.8,.04,wm,x,1.65,2.24);box(.35,.95,.05,tex('fleece',1,1,0x7c3aed),x-.85,1.65,2.2);box(.35,.95,.05,tex('fleece',1,1,0x7c3aed),x+.85,1.65,2.2)});
 box(3,.02,1.6,tex('carpet',2,1,0xb91c1c),4.5,.01,0);
 S('lab',-5.6,-1.25,'🧪 HI-TECH LABOR [E]','#67e8f9','lab');
 S('labup',-2.4,1.0,'⚛️ LABOR-FEJLESZTÉS [E]','#c4b5fd',null,()=>shopUI('lm'));
 // pálinkafőzde
 const copper=MB(0xb87333,{metalness:.9,roughness:.28});cyl(.42,.5,.9,copper,0,.45,1.6);const dome=new THREE.Mesh(new THREE.SphereGeometry(.42,20,12,0,6.3,0,1.6),copper);dome.position.set(0,.9,1.6);SC.add(dome);
 const pipe=cyl(.04,.04,1.1,copper,.5,1.15,1.6,8);pipe.rotation.z=Math.PI/2.6;cyl(.3,.3,.75,tex('darkwood',1,1,0x7c4a26),1.2,.38,1.8);[1.6,1.8,2.0].forEach(x=>cyl(.06,.07,.3,glass(0xfbbf24),x,.97,1.95,10));box(1,.06,.5,tex('wood',1,1),1.8,.8,1.95);
 S('pal',.6,1.1,'🍑 PÁLINKAFŐZDE [E]','#fdba74','pal');
 // pályázatfőzde
 box(1.8,.06,.8,tex('darkwood',1,1,0x5b3a1e),2.6,.78,-1.8);[[1.9,-1.8],[3.3,-1.8]].forEach(([x,z])=>box(.08,.75,.7,tex('metal',1,1,0x334155),x,.38,z));
 box(.5,.03,.35,MB(0x1f2937,{metalness:.6}),2.5,.82,-1.8);box(.5,.32,.02,new THREE.MeshBasicMaterial({color:0x38bdf8}),2.5,.98,-1.97);for(let i=0;i<6;i++)box(.3,.03,.4,MB(i%2?0xf8fafc:0xfef9c3),3.15,.83+i*.035,-1.75);box(.5,.5,.5,tex('leather',1,1,0x111827),2.6,.3,-1.1);
 S('pal2',2.6,-1.3,'📄 PÁLYÁZATFŐZDE [E]','#c4b5fd','pal2');
 // tábla
 const bc=document.createElement('canvas');bc.width=512;bc.height=256;const bg=bc.getContext('2d');bg.fillStyle='#14532d';bg.fillRect(0,0,512,256);bg.font='bold 34px system-ui';bg.fillStyle='#fff';bg.fillText('A TERV:',20,50);bg.font='24px system-ui';['1. főzz 🧪🍑📄 + termessz 🪴','2. rendelés (O) → autó (F)','3. ne bukj le 👮','4. 🏝️ → 🚀'].forEach((t,i)=>bg.fillText(t,30,95+i*40));
 const board=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.9),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(bc)}));board.position.set(.6,1.6,-2.23);SC.add(board);S('home',.6,-1.6,'📋 FŐHADISZÁLLÁS [E]','#fde047','home');
 // raktár szekrény
 box(1.1,2.2,.6,tex('fa3',1,2,0xa16207),5.0,1.1,-1.95);box(.03,.3,.03,MB(0xfacc15,{metalness:1}),5.0,1.1,-1.63);S('inv',5.0,-1.4,'🎒 RAKTÁR [E]','#fde68a','inv');
 // buli
 box(.55,1.1,.5,MB(0x111827,{roughness:.4}),6.4,.55,1.95);[.75,.35].forEach(y=>{const sp=cyl(.17,.17,.05,MB(0x374151),6.4,y,1.69,20);sp.rotation.x=Math.PI/2});
 DISCO=new THREE.Mesh(new THREE.SphereGeometry(.22,16,12),MB(0xe5e7eb,{metalness:.4,roughness:.2,emissive:0x6b21a8,emissiveIntensity:.5,flatShading:true}));DISCO.position.set(5.6,2.35,.6);SC.add(DISCO);const dl=new PL(0xf472b6,.8,6);dl.position.set(5.6,2.1,.6);SC.add(dl);FX.dl=dl;
 S('party',6.2,1.35,'🕺 AFTERPARTI [E]','#f9a8d4','party');
 // ágy
 box(1.9,.45,1.2,tex('wool',2,1,0x1e3a8a),8.4,.23,1.6);box(.5,.15,.9,tex('fleece',1,1,0xf8fafc),7.65,.52,1.6);
 S('sleep',8.4,1.0,'🛏️ ALVÁS – ÚJ NAP [E]','#93c5fd',null,()=>{window.openSotetProgram('home');setTimeout(()=>{const b=$$('dpsl');b&&b.click()},50)});
 // hűtő = bolt
 box(.8,1.9,.7,tex('metal',1,2,0xe5e7eb,{metalness:.5,roughness:.3}),10.65,.95,1.75);S('shop',10.2,1.2,'🛒 CSABA HŰTŐJE [E]','#86efac','shop');
 // ablakpárkány-polc a cserepeknek
 box(3.4,.05,.35,tex('wood',2,1,0xa16207),8.7,.95,-2.1);
 // ajtó
 box(.08,2.1,1,tex('metal',1,2,0x64748b,{metalness:.6}),11.15,1.05,-.2);box(.05,.05,.2,MB(0xfacc15,{metalness:1}),11.1,1,.15);
 S('out',10.4,-.2,'🚪 KI A VÁROSBA [E]','#fca5a5',null,goOut);
 // NPC-k
 const npc=(k,col,em,x,z,ry,sc)=>{let m;try{m=person(col,em,1)}catch(e){m=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,1.4),MB(col))}m.scale.multiplyScalar(sc||.38);m.position.set(x,0,z);m.rotation.y=ry;SC.add(m);const n={k,m,x,z,ry};NPC.push(n);return n};
 npc('ferko',0xf8fafc,'👨‍🔬',-5.6,-.95,0);npc('pista',0x92400e,'🍑',.9,.9,Math.PI);npc('tibi',0x1e3a8a,'📎',2.6,-.75,0);npc('beno',0xdb2777,'🕺',6.6,1.4,Math.PI*.8);npc('csaba',0x111827,'🕴️',9.8,.5,-Math.PI/2);
 window._sp3npc=npc}

// ===================== KÜLSŐ: VÁROS =====================
function aabb(x0,z0,x1,z1){COL.push([Math.min(x0,x1),Math.min(z0,z1),Math.max(x0,x1),Math.max(z0,z1)])}
function buildCity(){
 HEMI=new THREE.HemisphereLight(0x93c5fd,0x1e1b4b,.0);SC.add(HEMI);MOON=new THREE.DirectionalLight(0xbfdbfe,0);MOON.position.set(-60,120,40);SC.add(MOON);
 // csillagok
 const sg=new THREE.BufferGeometry(),sv=[];for(let i=0;i<900;i++){const a=Math.random()*6.28,b=Math.random()*1.2+.15,r=380;sv.push(Math.cos(a)*Math.cos(b)*r,Math.sin(b)*r,Math.sin(a)*Math.cos(b)*r)}sg.setAttribute('position',new THREE.Float32BufferAttribute(sv,3));SC.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.4,sizeAttenuation:false})));
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(320,320),tex('grass',60,60,0x4d7c3a));gr.rotation.x=-Math.PI/2;gr.position.y=-.03;gr.receiveShadow=true;SC.add(gr);
 // utak + járdák
 const asp=tex('asphalt',40,2,0x6b7280),side=tex('cobble',40,1,0x9ca3af);
 [-90,-30,30,90].forEach(v=>{box(270,.02,10,asp,0,.01,v);box(10,.025,270,asp,v,.012,0);[-6,6].forEach(o=>{box(270,.08,2,side,0,.04,v+o);box(2,.085,270,side,v+o,.042,0)})});
 // útfelfestés
 const dash=new THREE.InstancedMesh(new THREE.BoxGeometry(3,.03,.25),new THREE.MeshBasicMaterial({color:0xf8fafc}),360);let di=0;const mt=new THREE.Matrix4();
 [-90,-30,30,90].forEach(v=>{for(let x=-130;x<130&&di<358;x+=8){mt.makeTranslation(x,.03,v);dash.setMatrixAt(di++,mt);mt.makeRotationY(Math.PI/2);mt.setPosition(v,.035,x);dash.setMatrixAt(di++,mt)}});dash.count=di;SC.add(dash);
 // lakókocsi-telek
 box(50,.03,50,tex('conc',10,10,0x94a3b8),0,.0,0);
 // lakókocsi külső héj
 const shell=tex('metal',6,1,0xe5e7eb,{metalness:.5,roughness:.4});box(22.8,2.95,.12,shell,0,1.47,-2.42);box(22.8,2.95,.12,shell,0,1.47,2.42);box(.12,2.95,4.9,shell,-11.4,1.47,0);box(.12,2.95,4.9,shell,11.4,1.47,0);box(22.8,.12,4.9,shell,0,2.95,0);
 box(22.82,.35,4.92,EM(0x7c3aed,.6),0,.9,0).material=EM(0x7c3aed,.6);// díszcsík
 [-8,-6.6,6.6,8].forEach(x=>{const w=cyl(.45,.45,.3,MB(0x111827),x,.1,2.5,18);w.rotation.x=Math.PI/2;const w2=cyl(.45,.45,.3,MB(0x111827),x,.1,-2.5,18);w2.rotation.x=Math.PI/2});
 box(.6,.2,1.2,tex('metal',1,1,0x475569),11.8,.1,-.2);const ss=sign('🕶️ SÖTÉT PROGRAM','#4c1d95','#f472b6',4,1);ss.position.set(0,2.2,2.5);SC.add(ss);const ss2=ss.clone();ss2.position.z=-2.5;ss2.rotation.y=Math.PI;SC.add(ss2);
 aabb(-11.5,-2.55,11.5,2.55);
 S('enter',12.4,-.2,'🚐 BE A LAKÓKOCSIBA [E]','#c4b5fd',goIn,null,'out',2.6,2.2);ST[ST.length-1].tab=null;ST[ST.length-1].act=goIn;
 // ===== BOLTSOR (a lakókocsival szemben) =====
 const SHOPS=[['ac','🕶️ ÁRNYÉK BUTIK','#7c3aed','#f0abfc',0x6d28d9],['sd','🌱 ZÖLD KÉZ KERTÉSZET','#166534','#86efac',0x15803d],['car','🚗 ROZSDÁS AUTÓKER','#9a3412','#fdba74',0xc2410c],['lm','⚛️ LABOR-SZAKÜZLET','#0e7490','#67e8f9',0x0891b2],['shop','🛒 CSABA VEGYESBOLT','#854d0e','#fde047',0xa16207],['food','🍔 ÉJJELI BÜFÉ','#9f1239','#fda4af',0xbe123c]];
 SHOPS.forEach(([k,n,bg,fg,c],i)=>{const cx=-20+i*8;box(7.6,5.2,8,tex('brick',3,2,c),cx,2.6,-24.5);box(7.8,.3,8.2,MB(0x1f2937),cx,5.35,-24.5);
  const sg2=sign(n,bg,fg,6.6,1.3);sg2.position.set(cx,4.3,-20.45);SC.add(sg2);box(2.8,2.2,.05,EM(0xfef3c7,.7),cx-1.8,1.4,-20.45);box(1.4,2.4,.06,EM(0x0f172a,.2),cx+2,1.2,-20.45);
  const aw=box(7.4,.12,1.4,EM(new THREE.Color(fg).getHex(),.35),cx,3.35,-19.9);aw.rotation.x=.25;
  S('shop_'+k,cx+2,-18.4,n+' [E]',fg,null,()=>k==='shop'?openPanel('shop'):k==='car'?carUI():shopUI(k),'out',3,2.6);
  try{window._sp3npc('sk'+i,c,pick(['🧔','👩','👨‍🦲','👵','🧑‍🎤','🧑‍🍳']),cx+3.3,-19.6,0,.9)}catch(e){}});
 aabb(-24,-28.6,24,-20.4);
 // ===== ÉPÜLETEK =====
 const blocks=[];[-60,0,60].forEach(bx=>[-60,0,60].forEach(bz=>{if(bx||bz)blocks.push([bx,bz,38])}));[-115,115].forEach(a=>[-115,-60,0,60,115].forEach(b=>{blocks.push([a,b,30]);if(Math.abs(b)!==115)blocks.push([b,a,30])}));
 const parks=['0,-60','-60,60'];const trees=[];
 blocks.forEach(([bx,bz,sz])=>{if(parks.includes(bx+','+bz)){box(48,.04,48,tex('grass2',8,8,0x3f6212),bx,.02,bz);for(let i=0;i<14;i++)trees.push([bx+RN(-20,20),bz+RN(-20,20)]);return}
  const half=sz===38?12:10;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{const w=RN(14,20),d=RN(14,20),h=RN(8,36),x=bx+a*half,z=bz+b*half;
   const m=tex('facade',Math.max(1,Math.round(w/6)),Math.max(1,Math.round(h/6)),pick([0xffffff,0xfde68a,0xcbd5e1,0xfecaca,0xbfdbfe]),{emissive:0x332a10,emissiveIntensity:.6});m.emissiveMap=m.map;
   box(w,h,d,m,x,h/2,z);box(w+.4,.4,d+.4,MB(0x334155),x,h+.2,z);aabb(x-w/2,z-d/2,x+w/2,z+d/2);
   if(Math.random()<.35){const nn=sign(pick(['HOTEL','BÁR','PIZZA','GYÓGYSZER','NONSTOP','KLUB','MOZI','PÉKSÉG']),'#0f172a',pick(['#f472b6','#22d3ee','#a3e635','#facc15']),6,1.4);nn.position.set(x,Math.min(h-2,9),z+(z<bz?-1:1)*(d/2+.05)*-1*-1);nn.position.z=b<0?z+d/2+.05:z-d/2-.05;if(b>0)nn.rotation.y=Math.PI;SC.add(nn)}})});
 // fák a telken és parkokban
 for(let i=-20;i<=20;i+=8){trees.push([i,19]);}[[-22,-8],[-22,8],[22,-14],[22,14]].forEach(t=>trees.push(t));
 const tr=new THREE.InstancedMesh(new THREE.CylinderGeometry(.2,.3,2.2,8),MB(0x5b3a1e),trees.length),cr=new THREE.InstancedMesh(new THREE.ConeGeometry(1.6,4,10),MB(0x166534),trees.length);
 trees.forEach(([x,z],i)=>{mt.makeTranslation(x,1.1,z);tr.setMatrixAt(i,mt);mt.makeTranslation(x,4,z);cr.setMatrixAt(i,mt);aabb(x-.4,z-.4,x+.4,z+.4)});SC.add(tr);SC.add(cr);
 // utcai lámpák (instanced, valódi fény nélkül)
 const LP=[];[-90,-30,30,90].forEach(v=>{for(let x=-125;x<=125;x+=22){LP.push([x,v+7]);LP.push([v+7,x+11])}});
 const pole=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.1,5,6),MB(0x1f2937,{metalness:.7}),LP.length),head=new THREE.InstancedMesh(new THREE.SphereGeometry(.35,10,8),EM(0xfde68a,2.2),LP.length),pool=new THREE.InstancedMesh(new THREE.CircleGeometry(3.2,16),new THREE.MeshBasicMaterial({color:0xfde68a,transparent:true,opacity:.13,depthWrite:false}),LP.length);
 LP.forEach(([x,z],i)=>{mt.makeTranslation(x,2.5,z);pole.setMatrixAt(i,mt);mt.makeTranslation(x,5.1,z);head.setMatrixAt(i,mt);mt.makeRotationX(-Math.PI/2);mt.setPosition(x,.06,z);pool.setMatrixAt(i,mt)});SC.add(pole);SC.add(head);SC.add(pool);
 // ===== KERÜLETEK: vevők + leadási pont =====
 const DIS=DP().DIS;DROPPOS.forEach(([x,z],i)=>{const sp=sprite(DIS[i][1]+' '+DIS[i][0],'#fca5a5',3);sp.position.set(x,3.6,z);SC.add(sp);
  const beam=cyl(1.2,1.2,40,new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.22,depthWrite:false}),x,20,z,20);beam.visible=false;const ring=new THREE.Mesh(new THREE.TorusGeometry(2.2,.12,8,32),EM(0x22c55e,2));ring.rotation.x=Math.PI/2;ring.position.set(x,.2,z);ring.visible=false;SC.add(ring);
  let cm=null;try{cm=window._sp3npc('cust'+i,pick([0x0ea5e9,0xf59e0b,0x10b981,0xe11d48,0x6366f1]),pick(['🧑','🧔','👱','🧑‍🦱','🥷','🧑‍🎤']),x+1.6,z,0,.9)}catch(e){}
  DROPS.push({i,x,z,sp,beam,ring,cm});S('drop'+i,x,z,'📦 LEADÁS: '+DIS[i][0]+' [E]','#86efac',null,()=>deliver(i),'out',2.6,2.6)});
 // ===== VIRÁGCSEREPEK (Közkert a telken + városszerte) =====
 const potPos=[[-15,12],[-9,12],[-3,12],[3,12],[9,12],[15,12],[-36.5,-36.5],[36.5,-36.5],[36.5,36.5],[-36.5,36.5],[-83.5,-36.5],[83.5,36.5],[36.5,83.5],[-36.5,83.5],[83.5,-83.5],[-83.5,83.5]];
 const kk=sign('🪴 KÖZKERT','#14532d','#86efac',4,1);kk.position.set(0,2.2,13.2);kk.rotation.y=Math.PI;SC.add(kk);
 potPos.forEach(([x,z],i)=>mkPot('c'+i,x,0,z,1.4,'out'));
 [[7.4,-2.1],[8.0,-2.1],[8.6,-2.1],[9.2,-2.1],[9.8,-2.1],[10.4,-2.1]].forEach(([x,z],i)=>mkPot('in'+i,x,.97,z,.45,'in'));
 // ===== AUTÓ =====
 CAR=new THREE.Group();SC.add(CAR);rebuildCar();
 S('car',car.x,car.z,'🚗 BESZÁLLÁS [F]','#fde047',null,()=>toggleCar(),'out',2.6,2);FX.carS=ST[ST.length-1];
 // ===== JÁRŐRÖK =====
 [[30,0],[30,.5],[90,.25]].forEach(([r,p])=>{const g=makeCar(0xf8fafc,true);SC.add(g);POL.push({g,r,p,sp:.012+Math.random()*.004})})}
function makeCar(col,pol){const g=new THREE.Group();const bm=MB(col,{metalness:.6,roughness:.35});box(2,.7,4.2,bm,0,.65,0,g);box(1.7,.6,2.2,MB(pol?0x1e293b:0x0f172a,{metalness:.9,roughness:.1}),0,1.25,-.2,g);
 [[-.95,1.4],[.95,1.4],[-.95,-1.4],[.95,-1.4]].forEach(([x,z])=>{const w=cyl(.38,.38,.3,MB(0x111827),x,.38,z,14,g);w.rotation.z=Math.PI/2});box(.4,.18,.05,EM(0xfef9c3,2),-.6,.7,2.11,g);box(.4,.18,.05,EM(0xfef9c3,2),.6,.7,2.11,g);box(.4,.15,.05,EM(0xef4444,1.5),-.6,.7,-2.11,g);box(.4,.15,.05,EM(0xef4444,1.5),.6,.7,-2.11,g);
 if(pol){box(2.02,.25,1.2,MB(0x1d4ed8),0,.7,0,g);g.userData.r=box(.5,.15,.3,EM(0xef4444,3),-.35,1.62,-.2,g);g.userData.b=box(.5,.15,.3,EM(0x3b82f6,3),.35,1.62,-.2,g)}return g}
function rebuildCar(){while(CAR.children.length)CAR.remove(CAR.children[0]);const v=veh();const g=makeCar(v.c,false);g.scale.set(v.s,v.s<1?.9:v.s,v.s<1?.7:v.s);CAR.add(g);CAR.position.set(car.x,0,car.z);CAR.rotation.y=car.h}
// ===== CSEREPEK =====
function mkPot(key,x,y,z,s,scope){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);SC.add(g);cyl(.32,.22,.45,tex('conc',1,1,0xc2410c),0,.22,0,14,g);cyl(.3,.3,.04,MB(0x3f2a1a),0,.43,0,14,g);
 const pl=new THREE.Group();pl.position.y=.45;g.add(pl);cyl(.025,.03,.6,MB(0x15803d),0,.3,0,6,pl);const lf=[];for(let i=0;i<5;i++){const l=sph(.13,MB(0x22c55e),Math.cos(i*1.26)*.12,.35+i*.07,Math.sin(i*1.26)*.12,pl);l.scale.set(1,.5,1.6);l.rotation.y=i*1.26;lf.push(l)}const fr=sph(.11,EM(0xf472b6,.8),0,.72,0,pl);
 const rd=sprite('✅ KÉSZ!','#86efac',.9);rd.position.set(0,1.3,0);rd.visible=false;g.add(rd);
 const P={key,g,pl,lf,fr,rd,x,z,scope,s};POTS.push(P);const st=S('pot_'+key,x,z,'🪴 CSERÉP [E]','#86efac',null,()=>potUI(P),scope,y+(scope==='in'?.9:2.2),scope==='in'?1.1:1.8);st.pot=P;P.st=st}
const SEEDC={m_zfu:0x16a34a,m_gomba:0xfef3c7,m_menta:0x6ee7b7,m_tuz:0xef4444,m_kek:0x3b82f6,m_arany:0xfacc15,m_krist:0x22d3ee,m_fust:0x94a3b8,m_szilva:0x7c3aed,m_barack:0xfb923c,m_alma:0xdc2626,m_eper:0xf43f5e,m_malna:0xbe185d,m_cseresznye:0x991b1b,m_korte:0xa3e635,m_bodza:0xfef9c3};
function potState(P){const p=DD().pots[P.key];if(!p)return null;const left=p.end-Date.now();return{p,left,prog:cl(1-left/p.dur,0,1),ready:left<=0}}
function potVis(){const now=Date.now();POTS.forEach(P=>{const s=potState(P);if(!s){P.pl.visible=false;P.rd.visible=false;P.st.label='🪴 ÜRES CSERÉP [E]';return}P.pl.visible=true;const k=.15+s.prog*.85;P.pl.scale.setScalar(k);
 const c=SEEDC[s.p.s]||0xf472b6;P.fr.material.color.setHex(c);P.fr.material.emissive.setHex(c);P.fr.visible=s.prog>.6;P.rd.visible=s.ready;P.st.label=s.ready?'✅ SZÜRET [E]':'🌱 '+Math.ceil(s.left/1000)+' mp [E]'})}

// ===================== MÓDVÁLTÁS =====================
function goOut(){INSIDE=false;INCAR=false;px=13.2;pz=-.2;yaw=-Math.PI/2;pit=0;SC.fog.near=40;SC.fog.far=210;SC.fog.color.setHex(0x0b1026);HEMI.intensity=.55;MOON.intensity=.55;PAUSE=false;closeOvl();lockP();
 const t=$$('sp3t');if(t)t.innerHTML='🌃 VÁROS · WASD mozgás · SHIFT futás · <b>F</b> autó · <b>O</b> rendelések · <b>M</b> térkép · <b>E</b> interakció · <b>H</b> duda';$$('sp3mm').style.display='block';
 if(!DD()._cityIntro){DD()._cityIntro=1;toast('🕴️ <b>Csavaros Csaba:</b> „Nyomd meg az <b>O</b>-t, ott jönnek a rendelések. Az autó a telken áll – <b>F</b>-fel beszállsz!”')}}
function goIn(){if(INCAR)toggleCar();INSIDE=true;px=9.8;pz=-.2;yaw=Math.PI/2;pit=0;SC.fog.near=14;SC.fog.far=40;HEMI.intensity=0;MOON.intensity=0;closeOvl();lockP();
 const t=$$('sp3t');if(t)t.innerHTML='Kattints a nézelődéshez · WASD mozgás · SHIFT futás · E interakció · O rendelések · M térkép · F autó · ESC egér · 🟨 nyíl = következő cél';$$('sp3mm').style.display='none'}
window._sp3out=()=>{if(!ON)openSotet3D();setTimeout(goOut,60)};
function toggleCar(){if(INSIDE)return;if(INCAR){INCAR=false;const f=car.h;px=car.x+Math.cos(f)*2.2;pz=car.z-Math.sin(f)*2.2;if(hit(px,pz,.4)){px=car.x-Math.cos(f)*2.2;pz=car.z+Math.sin(f)*2.2}yaw=car.h+Math.PI;pit=0;car.v=0;toast('🚶 Kiszálltál');return}
 if(Math.hypot(px-car.x,pz-car.z)>4.5){toast('🚗 Menj közelebb az autóhoz!');return}INCAR=true;beep(220,.15,'sawtooth',.05);toast(veh().e+' <b>'+veh().n+'</b> · W gáz · S fék/hátra · A/D kormány · SHIFT turbó · F kiszállás')}
function hit(x,z,r){for(const b of COL)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;return Math.abs(x)>132||Math.abs(z)>132}

// ===================== RENDELÉSEK / KISZÁLLÍTÁS =====================
function genOffer(){const d=DD(),dp=DP();const prods=dp.IT.filter(x=>x.t==='pr');const own=prods.filter(x=>d.inv[x.id]>0);const p=own.length&&Math.random()<.8?pick(own):pick(prods);const di=Math.floor(Math.random()*8);const DIS=dp.DIS[di];
 const n=Math.max(1,Math.min(1+Math.floor(Math.random()*(2+d.rep/40)),6));const[dx,dz]=DROPPOS[di];const dist=Math.hypot(dx,dz);const q=(d.inv[p.id+'_q']||55)/100;
 const pay=Math.round(p.p*DIS[2]*n*(.85+q*.6)*(1+d.rep/300)*1.25*(dp.mul?dp.mul(di,p.id):1));return{id:Math.random().toString(36).slice(2,7),di,pid:p.id,n,pay,tl:Math.round(45+dist/7+accB().time),exp:clock+150,who:pick(['Gizi néni','Rapper Robi','Diák Dani','Kapitány Karcsi','DJ Dóri','Mérnök Misi','Fesztivál Feri','Villa-Vilma','Taxis Tóni','Sportos Sanyi'])}}
function tickOffers(dt){OFFt-=dt;OFF=OFF.filter(o=>o.exp>clock);const mx=2+accB().ord;if(OFFt<=0&&OFF.length<mx){OFF.push(genOffer());OFFt=RN(14,26);if(!INSIDE||true){beep(880,.08,'sine',.05);setTimeout(()=>beep(1175,.1,'sine',.05),110)}const b=$$('sp3ob');if(b){b.textContent='📱 '+OFF.length+' új rendelés – O';b.style.display='block'}}
 const d=DD();d.cargo.forEach(c=>{c.left-=dt});const fail=d.cargo.filter(c=>c.left<=0);if(fail.length){fail.forEach(c=>{DP().addI(c.pid,c.n);d.rep=Math.max(0,d.rep-2);toast('⌛ Lejárt a rendelés ('+c.who+') – a cucc visszakerült, -2 hírnév')});d.cargo=d.cargo.filter(c=>c.left>0);DP().save()}}
function accept(id){const o=OFF.find(x=>x.id===id);if(!o)return;const d=DD(),dp=DP();if(!dp.has(o.pid,o.n)){toast('❌ Nincs elég: '+dp.ITM[o.pid].e+' '+dp.ITM[o.pid].n+' ('+(d.inv[o.pid]||0)+'/'+o.n+') – főzd meg előbb!');return}
 if(cargoN()+o.n>capTot()){toast('🎒 Nem fér el! Hely: '+cargoN()+'/'+capTot()+' – vegyél táskát vagy nagyobb kocsit.');return}
 dp.addI(o.pid,-o.n);d.cargo.push(Object.assign({},o,{left:o.tl}));OFF=OFF.filter(x=>x!==o);dp.save();toast('📦 Elfogadva! Vidd: '+dp.DIS[o.di][1]+' <b>'+dp.DIS[o.di][0]+'</b> – '+o.tl+' mp');ordUI()}
function deliver(di){const d=DD(),dp=DP();const cs=d.cargo.filter(c=>c.di===di);if(!cs.length){toast('🤷 '+dp.DIS[di][0]+': ide most nincs szállításod. Nyomd meg az O-t!');return}
 const a=accB();let tot=0,tip=0;cs.forEach(c=>{const sp=c.left/c.tl;const t=sp>.5?.25:sp>.25?.1:0;const p=Math.round(c.pay*(1+a.pay)*(1+t));tot+=p;tip+=Math.round(c.pay*t);d.stats.sold+=c.n;d.stats.earned+=p});
 d.cash+=tot;d.rep+=cs.length*(1+a.rep+(veh().rep||0));dp.heat(dp.DIS[di][3]/10*cs.length*(dp.hMul?dp.hMul(di):1));if(dp.satAdd)dp.satAdd(di,cs.reduce((a,c)=>a+c.n,0));d.cargo=d.cargo.filter(c=>c.di!==di);d.ord=(d.ord||0)+cs.length;
 dp.log('🚗 Kiszállítás – '+dp.DIS[di][0]+': '+cs.map(c=>c.n+'× '+dp.ITM[c.pid].n).join(', ')+' → '+dp.f$(tot));dp.save();beep(660,.1,'triangle',.07);setTimeout(()=>beep(990,.15,'triangle',.07),120);
 toast('💸 <b>+'+dp.f$(tot)+'</b>'+(tip?' (borravaló '+dp.f$(tip)+')':'')+' · '+cs[0].who+': „Köszi, főnök!”')}
function tickPolice(dt){const d=DD();POL.forEach(P=>{P.p=(P.p+P.sp*dt*(30/P.r))%1;const r=P.r,s=P.p*4,seg=Math.floor(s),f=s-seg;const C=[[-r,-r],[r,-r],[r,r],[-r,r]];const a=C[seg],b=C[(seg+1)%4];const x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;P.g.position.set(x,0,z);P.g.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);const fl=Math.floor(clock*6)%2;P.g.userData.r.material.emissiveIntensity=fl?4:.2;P.g.userData.b.material.emissiveIntensity=fl?.2:4;P.x=x;P.z=z});
 if(INSIDE||WCD>0){WCD-=dt;WANT=Math.max(0,WANT-dt*.3);return}const me=INCAR?car:{x:px,z:pz};const a=accB();const rng=18*(1-a.det)*(1+d.heat/100);const nearP=POL.some(P=>Math.hypot(P.x-me.x,P.z-me.z)<rng);
 if(nearP&&d.cargo.length){WANT+=dt*(.22+d.heat/250)*(INCAR&&Math.abs(car.v)>veh().sp*.8?1.4:1)}else WANT=Math.max(0,WANT-dt*.12);
 if(WANT>=1){WANT=0;WCD=25;try{document.exitPointerLock()}catch(e){}toast('🚨 <b>MEGÁLLJ! RENDŐRSÉG!</b>');beep(500,.4,'sawtooth',.08);const g=INCAR?DP().MG.chase:DP().MG.alley;setTimeout(()=>g(sc=>{if(sc<.4){DP().bust();toast('🚔 Elkaptak! Razzia…');goIn()}else{DP().heat(-10);toast('😎 Leráztad a zsarukat!')}DP().save();lockP()}),400)}}

// ===================== ÉLŐ VÁROS (11-09): gyalogosok, forgalom, füst, razzia-jelenet, neon-villogás =====================
const LIFE={peds:[],cars:[],smoke:[],raid:null,neon:[],raidOn:false,raidMsg:0};
function smokeTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.5,'rgba(220,220,235,.35)');g.addColorStop(1,'rgba(200,200,220,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
function mkWalker(col){const g=new THREE.Group();const skin=MB(0xf1c27d),cm=MB(col,{roughness:.8}),pm=MB(pick([0x1f2937,0x334155,0x1e3a8a,0x3f3f46]));
 box(.42,.62,.24,cm,0,1.15,0,g);sph(.15,skin,0,1.62,0,g);const hair=sph(.155,MB(pick([0x1c1917,0x78350f,0xfacc15,0x9ca3af])),0,1.68,-.02,g);hair.scale.set(1,.6,1);
 const legs=[],arms=[];[-.11,.11].forEach(o=>{const lp=new THREE.Group();lp.position.set(o,.84,0);g.add(lp);box(.15,.8,.17,pm,0,-.4,0,lp);legs.push(lp);
  const ap=new THREE.Group();ap.position.set(o*2.4,1.42,0);g.add(ap);box(.1,.55,.12,cm,0,-.27,0,ap);arms.push(ap)});g.userData={legs,arms};SC.add(g);return g}
function buildLife(){const ROADS=[-90,-30,30,90];
 // 1) járókelők a járdákon (oda-vissza sétálnak, lábak/karok lengenek)
 for(let i=0;i<18;i++){let v,side,ax,t0,tr=0;do{v=pick(ROADS);side=pick([-6,6,-7.5,7.5]);ax=Math.random()<.5?'x':'z';t0=RN(-120,120)}while(tr++<60&&(ax==='x'?hit(t0,v+side,.5):hit(v+side,t0,.5)));const g=mkWalker(pick([0xef4444,0x22c55e,0x3b82f6,0xeab308,0xa855f7,0xf97316,0x14b8a6,0xe5e7eb]));
  const p={g,ax,line:v+side,t:t0,dir:pick([-1,1]),sp:RN(1.1,1.8),ph:Math.random()*6,stop:0};LIFE.peds.push(p)}
 // 2) civil forgalom az utakon (jobb oldali sáv, a végén visszafordul a másik sávba)
 for(let i=0;i<9;i++){const g=makeCar(pick([0xdc2626,0x2563eb,0xf8fafc,0x16a34a,0xf59e0b,0x0f172a,0x7c3aed]),false);SC.add(g);
  const hl=EM(0xfef9c3,2.5);[-.6,.6].forEach(o=>box(.35,.18,.05,hl,o,.75,2.12,g));
  LIFE.cars.push({g,ax:Math.random()<.5?'x':'z',road:pick(ROADS),t:RN(-120,120),dir:pick([-1,1]),sp:RN(9,14),v:0})}
 // 3) füst a lakókocsi kéményéből és a labor szellőzőjéből
 const st=smokeTex();box(.5,.9,.5,MB(0x374151,{metalness:.6}),-6,3.35,-1);box(.4,.5,.4,MB(0x475569,{metalness:.6}),4,3.15,1.2);
 [[-6,3.85,-1],[4,3.45,1.2]].forEach((src,si)=>{for(let i=0;i<14;i++){const m=new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,opacity:0,color:si?0xe9d5ff:0xcbd5e1});const s=new THREE.Sprite(m);SC.add(s);LIFE.smoke.push({s,src,age:i/14*5,life:5})}});
 // 4) razzia-jelenet (magas hőnél): 2 rendőrautó a telek előtt, rendőrök, VALÓDI villogó fény + keresőfény
 const rg=new THREE.Group();rg.visible=false;SC.add(rg);const c1=makeCar(0xf8fafc,true);c1.position.set(18,0,-7);c1.rotation.y=-.6;rg.add(c1);const c2=makeCar(0xf8fafc,true);c2.position.set(19,0,7);c2.rotation.y=Math.PI+.5;rg.add(c2);
 const cops=[];[[15.5,-4.5],[16,4.2],[20.5,0]].forEach(([x,z])=>{const c=mkWalker(0x1e3a8a);SC.remove(c);c.position.set(x,0,z);c.rotation.y=-Math.PI/2;const cap=cyl(.17,.17,.08,MB(0x0f172a),0,1.78,0,10,c);rg.add(c);cops.push(c)});
 const L=new PL(0xff0000,0,26,2);L.position.set(18.5,3,0);SC.add(L);const spot=new THREE.SpotLight(0xffffff,0,60,.35,.5,1.5);spot.position.set(19,9,0);SC.add(spot);SC.add(spot.target);
 const tape=new THREE.Mesh(new THREE.PlaneGeometry(14,.35),new THREE.MeshBasicMaterial({color:0xfacc15,side:THREE.DoubleSide}));tape.position.set(14.5,1,0);tape.rotation.y=Math.PI/2;rg.add(tape);
 LIFE.raid={g:rg,L,spot,cops,cars:[c1,c2]};
 // 5) villogó neonok (a város reklámtáblái közül néhány)
 SC.traverse(o=>{if(o.isMesh&&o.material&&o.material.map&&o.material.map.image&&o.material.map.image.tagName==='CANVAS'&&o.material.emissive&&Math.random()<.5)LIFE.neon.push({o,b:o.material.emissiveIntensity||1,ph:Math.random()*9})})}
function tickLife(dt){if(!LIFE.peds.length)return;const me=INCAR?car:{x:px,z:pz};
 LIFE.peds.forEach(p=>{const pp=p.ax==='x'?{x:p.t,z:p.line}:{x:p.line,z:p.t};const nearMe=Math.hypot(pp.x-me.x,pp.z-me.z)<1.4;const nearCar=INCAR&&Math.hypot(pp.x-car.x,pp.z-car.z)<4;
  if(nearCar){p.t-=p.dir*dt*4}else if(!nearMe){const nt=p.t+p.dir*p.sp*dt,np=p.ax==='x'?{x:nt+p.dir*.3,z:p.line}:{x:p.line,z:nt+p.dir*.3};
   const blk=(hit(np.x,np.z,.3)&&!hit(pp.x,pp.z,.3))||Math.hypot(np.x-car.x,np.z-car.z)<2.4&&Math.hypot(pp.x-car.x,pp.z-car.z)>=2.4;if(blk)p.dir*=-1;else p.t=nt}if(p.t>125||p.t<-125)p.dir*=-1;p.ph+=dt*p.sp*5*(nearMe?0:1);
  const g=p.g;if(p.ax==='x'){g.position.set(p.t,0,p.line);g.rotation.y=p.dir>0?Math.PI/2:-Math.PI/2}else{g.position.set(p.line,0,p.t);g.rotation.y=p.dir>0?0:Math.PI}
  const s=Math.sin(p.ph)*.6;g.userData.legs[0].rotation.x=s;g.userData.legs[1].rotation.x=-s;g.userData.arms[0].rotation.x=-s*.8;g.userData.arms[1].rotation.x=s*.8;g.position.y=Math.abs(Math.cos(p.ph))*.04;g.visible=!INSIDE});
 LIFE.cars.forEach(c=>{const lane=c.road+(c.dir>0?-2.5:2.5)*(c.ax==='x'?1:-1);const x=c.ax==='x'?c.t:lane,z=c.ax==='x'?lane:c.t;
  const ahead=c.ax==='x'?{x:x+c.dir*5,z}:{x,z:z+c.dir*5};c.x=x;c.z=z;
  if(hit(ahead.x,ahead.z,1)&&!hit(x,z,1)){c.dir*=-1;c.v=0}
  const block=Math.hypot(ahead.x-me.x,ahead.z-me.z)<3.2||(!INCAR&&Math.hypot(ahead.x-car.x,ahead.z-car.z)<3.4)||LIFE.cars.some(o=>o!==c&&o.x!=null&&Math.hypot(ahead.x-o.x,ahead.z-o.z)<3)||LIFE.peds.some(p=>p.g.position.distanceToSquared(_V3.set(ahead.x,0,ahead.z))<4);const tgt=block?0:c.sp;c.v+=(tgt-c.v)*Math.min(1,dt*(block?6:1.5));
  if(block&&!c.hk){c.hk=1;beep(330,.18,'square',.04)}if(!block)c.hk=0;c.t+=c.dir*c.v*dt;if(c.t>128||c.t<-128){c.dir*=-1;c.t=cl(c.t,-128,128)}
  c.g.position.set(x,0,z);c.g.rotation.y=c.ax==='x'?(c.dir>0?Math.PI/2:-Math.PI/2):(c.dir>0?0:Math.PI);c.g.visible=!INSIDE});
 LIFE.smoke.forEach(m=>{m.age+=dt;if(m.age>m.life)m.age-=m.life;const k=m.age/m.life;m.s.position.set(m.src[0]+Math.sin(m.age*1.3+m.src[2])*.3+k*1.5,m.src[1]+k*4.5,m.src[2]+k*.8);m.s.scale.setScalar(.5+k*2.4);m.s.material.opacity=INSIDE?0:(k<.15?k/.15:1-k)*.5});
 const d=DD(),R0=LIFE.raid;const want=d.heat>=70&&!INSIDE;if(want!==LIFE.raidOn){LIFE.raidOn=want;R0.g.visible=want;if(want&&clock-LIFE.raidMsg>60){LIFE.raidMsg=clock;toast('🚨 <b>Szigorú Szilárd:</b> „Tudom, hogy itt vagy!” – rendőrök a telek előtt. Csökkentsd a hőt (alvás, alibi, ügyvéd)!');beep(520,.3,'sawtooth',.06)}}
 if(want){const f=Math.floor(clock*5)%2;R0.L.color.setHex(f?0xff1e1e:0x2563eb);R0.L.intensity=3.2;R0.spot.intensity=2.2;R0.spot.target.position.set(Math.sin(clock*.7)*9,0,Math.cos(clock*.5)*5);
  R0.cars.forEach(c=>{c.userData.r.material.emissiveIntensity=f?4:.2;c.userData.b.material.emissiveIntensity=f?.2:4});R0.cops.forEach((c,i)=>{c.rotation.y=-Math.PI/2+Math.sin(clock*.8+i)*.6;c.userData.arms[0].rotation.x=-1.2+Math.sin(clock*3+i)*.3})}
 else{R0.L.intensity=0;R0.spot.intensity=0}
 LIFE.neon.forEach(n=>{const fl=Math.sin(clock*13+n.ph)>.93||Math.sin(clock*.7+n.ph)>.985;n.o.material.emissiveIntensity=fl?n.b*.15:n.b})}
window._sp3life=LIFE;

// ===================== OVERLAY-K (boltok, cserép, rendelések, térkép) =====================
function ovl(html){OVL=OVL||(()=>{const o=document.createElement('div');o.id='sp3o';o.style.cssText='position:absolute;inset:0;z-index:5;background:rgba(2,6,23,.72);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';$$('sp3').appendChild(o);o.addEventListener('click',e=>{if(e.target===o)closeOvl()});return o})();
 PAUSE=true;try{document.exitPointerLock()}catch(e){}OVL.style.display='flex';OVL.innerHTML='<div style="width:min(860px,94vw);max-height:84vh;overflow:auto;background:linear-gradient(160deg,#1e1b4b,#0f172a);border:2px solid #a78bfa;border-radius:18px;padding:16px 18px;color:#e2e8f0;font:14px system-ui;box-shadow:0 20px 60px #000c,0 0 40px #7c3aed55">'+html+'<div style="text-align:right;margin-top:10px"><button id="sp3oc" style="background:#ef4444;color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:800;cursor:pointer">✕ Bezár (Esc)</button></div></div>';$$('sp3oc').onclick=closeOvl}
function closeOvl(){if(OVL&&OVL.style.display!=='none'){OVL.style.display='none';PAUSE=false;lockP()}}
const ovlOpen=()=>OVL&&OVL.style.display==='flex';
const CARD='background:#1e293bcc;border:1px solid #334155;border-radius:12px;padding:10px;font-size:13px';const BTN=(t,a,dis,c)=>'<button '+a+' '+(dis?'disabled':'')+' style="margin:4px 4px 0 0;background:'+(c||'linear-gradient(#8b5cf6,#6d28d9)')+';color:#fff;border:0;border-radius:9px;padding:6px 11px;font-weight:800;cursor:pointer;opacity:'+(dis?.4:1)+'">'+t+'</button>';
const head=(t,s)=>'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="margin:0;font-size:22px;background:linear-gradient(90deg,#f0abfc,#67e8f9);-webkit-background-clip:text;color:transparent">'+t+'</h2><span style="margin-left:auto;font-weight:800;background:#0f172a;padding:5px 10px;border-radius:9px">💰 '+DP().f$(DD().cash)+'</span></div>'+(s?'<div style="opacity:.8;margin-bottom:10px">'+s+'</div>':'');
function openPanel(t){PAUSE=true;try{document.exitPointerLock()}catch(e){}window.openSotetProgram(t)}
function shopUI(cat){const dp=DP(),d=DD();const T={ac:['🕶️ ÁRNYÉK BUTIK','Kiegészítők – helyenként egy viselhető. Bónuszt adnak a kiszállításhoz.'],sd:['🌱 ZÖLD KÉZ KERTÉSZET','Magok a cserepekbe. A lakókocsi párkánya biztonságos, a közkert gyorsabb (+25%), de feltűnőbb.'],lm:['⚛️ LABOR-SZAKÜZLET','A modulok megjelennek a 3D laborban, és végleges bónuszt adnak a laborfőzéshez.'],food:['🍔 ÉJJELI BÜFÉ','Energia és apró boostok – azonnal felhasználod.']}[cat];
 let items=cat==='food'?dp.IT.filter(x=>x.t==='bo'):dp.IT.filter(x=>x.t===cat);if(cat==='lm')items=items.concat(dp.IT.filter(x=>x.t==='eq'&&x.br==='lab'));
 const row=x=>{const own=cat==='lm'&&x.t==='lm'?d.lm[x.id]:cat==='ac'?d.inv[x.id]>0:false;const worn=cat==='ac'&&d.acc[x.s]===x.id;let b='';
  if(cat==='ac'){b=own?(worn?BTN('Levesz','data-un="'+x.s+'"',0,'#475569'):BTN('Felvesz','data-wr="'+x.id+'"',0,'linear-gradient(#22c55e,#15803d)')):BTN('Vétel','data-by="'+x.id+'"',d.cash<x.p)}
  else if(cat==='food')b=BTN('Vétel + fogyasztás','data-ea="'+x.id+'"',d.cash<x.p);
  else if(x.t==='lm')b=own?'<b style="color:#86efac">✔ BESZERELVE</b>':BTN('Beszerelés','data-by="'+x.id+'"',d.cash<x.p);
  else if(x.t==='eq'){const lock=x.lv>(d.lvl[x.br]||1)+1;b=d.inv[x.id]?'<b style="color:#86efac">✔ megvan</b>':BTN(lock?'🔒 '+(x.lv-1)+'. szint':'Vétel','data-by="'+x.id+'"',lock||d.cash<x.p)}
  else b=BTN('Vétel','data-by="'+x.id+'"',d.cash<x.p)+(x.tool?'':BTN('×5','data-b5="'+x.id+'"',d.cash<x.p*5,'#334155'));
  return'<div style="'+CARD+(worn?';border-color:#22c55e;box-shadow:0 0 12px #22c55e55':'')+'"><div style="font-size:28px">'+x.e+'</div><b>'+x.n+'</b><br>'+dp.f$(x.p)+(x.d?'<br><small style="opacity:.8">'+x.d+'</small>':'')+(cat==='sd'?'<br><small>Van: '+(d.inv[x.id]||0)+'</small>':'')+'<br>'+b+'</div>'};
 ovl(head(T[0],T[1])+(cat==='ac'?'<div style="'+CARD+';margin-bottom:10px">Viselve: '+(Object.entries(d.acc).map(([s,id])=>dp.ITM[id].e+' '+dp.ITM[id].n).join(' · ')||'semmi')+'</div>':'')+'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:9px">'+items.map(row).join('')+'</div>');
 const buy=(id,n)=>{const x=dp.ITM[id];const c=x.p*n;if(d.cash<c){toast('Nincs elég Ft!');return}d.cash-=c;if(x.t==='lm'){d.lm[id]=1;showMods();beep(440,.2,'triangle');toast('⚛️ '+x.n+' beszerelve a laborba!')}dp.addI(id,n);dp.log('🛒 '+n+'× '+x.e+' '+x.n);dp.save();shopUI(cat)};
 OVL.querySelectorAll('[data-by]').forEach(b=>b.onclick=()=>buy(b.dataset.by,1));OVL.querySelectorAll('[data-b5]').forEach(b=>b.onclick=()=>buy(b.dataset.b5,5));
 OVL.querySelectorAll('[data-wr]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.wr];d.acc[x.s]=x.id;dp.save();shopUI(cat)});OVL.querySelectorAll('[data-un]').forEach(b=>b.onclick=()=>{delete d.acc[b.dataset.un];dp.save();shopUI(cat)});
 OVL.querySelectorAll('[data-ea]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.ea];if(d.cash<x.p)return;d.cash-=x.p;dp.addI(x.id,1);dp.save();try{_dp().D===d&&useB(x.id)}catch(e){}shopUI(cat)})}
function useB(id){const dp=DP(),d=DD(),x=dp.ITM[id];dp.addI(id,-1);const t=x.d||'';if(/energia/.test(t))d.en=cl(d.en+parseInt(t.match(/\d+/)[0]),0,150);if(/-(\d+) hő/.test(t))dp.heat(-parseInt(t.match(/-(\d+) hő/)[1]));if(/\+(\d+) hírnév/.test(t))d.rep+=parseInt(t.match(/\+(\d+) hírnév/)[1]);if(id==='bonusz')d.purity=(d.purity||0)+3;dp.save();toast(x.e+' '+x.n+' – '+t)}
function carUI(){const dp=DP(),d=DD();ovl(head('🚗 ROZSDÁS AUTÓKERESKEDÉS','Nagyobb kocsi = több fér bele. Gyorsabb = nagyobb borravaló. A kiválasztott jármű áll a telken.')+'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:9px">'+Object.entries(VEH).map(([id,v])=>{const own=id==='berelt'||d.own[id];const sel=d.veh===id;const pr=id==='berelt'?0:dp.ITM[id].p;
  return'<div style="'+CARD+(sel?';border-color:#facc15;box-shadow:0 0 14px #facc1555':'')+'"><div style="font-size:30px">'+v.e+'</div><b>'+v.n+'</b><br>⚡ '+v.sp*6+' km/h · 📦 '+v.cap+' hely'+(v.rep?' · ⭐ +hírnév':'')+'<br>'+(own?(sel?'<b style="color:#facc15">★ KIVÁLASZTVA</b>':BTN('Kiválaszt','data-se="'+id+'"',0,'linear-gradient(#22c55e,#15803d)')):dp.f$(pr)+'<br>'+BTN('Vétel','data-bv="'+id+'"',d.cash<pr))+'</div>'}).join('')+'</div>');
 OVL.querySelectorAll('[data-se]').forEach(b=>b.onclick=()=>{d.veh=b.dataset.se;dp.save();rebuildCar();carUI()});OVL.querySelectorAll('[data-bv]').forEach(b=>b.onclick=()=>{const id=b.dataset.bv,x=dp.ITM[id];if(d.cash<x.p)return;d.cash-=x.p;d.own[id]=1;dp.addI(id,1);d.veh=id;dp.log('🚗 Vettél: '+x.n);dp.save();rebuildCar();beep(300,.3,'sawtooth');carUI()})}
function potUI(P){const dp=DP(),d=DD();const s=potState(P);
 if(P.scope==='in'&&+P.key.slice(2)>=2+Math.min(4,d.inv.cserep||0)){toast('🪴 Ez a hely még üres – vegyél virágcserepet a kertészetben!');return}
 if(s&&s.ready){const it=dp.ITM[s.p.s];const y=it.y+(s.p.tr?2:0);dp.addI(it.g,y);delete d.pots[P.key];if(P.scope==='out')dp.heat(1);dp.log('🌾 Szüret: '+y+'× '+dp.ITM[it.g].n);dp.save();beep(784,.12,'triangle');toast('🌾 Szüret: <b>'+y+'× '+dp.ITM[it.g].e+' '+dp.ITM[it.g].n+'</b>');potVis();return}
 if(s){const w=!s.p.w&&d.inv.locsolo;ovl(head('🌱 '+dp.ITM[s.p.s].n,'Növekszik: '+Math.round(s.prog*100)+'% · még '+Math.ceil(s.left/1000)+' mp')+'<div style="height:12px;background:#0f172a;border-radius:6px;overflow:hidden"><i style="display:block;height:100%;width:'+s.prog*100+'%;background:linear-gradient(90deg,#22c55e,#a3e635)"></i></div><br>'+(s.p.w?'💧 Már meglocsoltad.':w?BTN('🚿 Locsolás (-40% idő)','id="sp3wt"',0,'linear-gradient(#0ea5e9,#0369a1)'):'<i>Locsolókanna a kertészetben kapható.</i>'));
  const wt=$$('sp3wt');if(wt)wt.onclick=()=>{const rem=s.p.end-Date.now();s.p.end=Date.now()+rem*.6;s.p.w=1;dp.save();toast('💧 Meglocsolva!');closeOvl();potVis()};return}
 const seeds=dp.IT.filter(x=>x.t==='sd'&&!x.tool&&d.inv[x.id]>0);
 ovl(head('🪴 '+(P.scope==='in'?'Párkány-cserép (biztonságos)':'Közkerti cserép (+25% gyorsabb, kis hő)'),'Válassz magot! '+(d.inv.tragya?'💩 Csodatrágya lesz használva (+2 termés).':''))+(seeds.length?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px">'+seeds.map(x=>'<div style="'+CARD+'"><div style="font-size:26px">'+x.e+'</div><b>'+x.n+'</b><br>→ '+x.y+'× '+dp.ITM[x.g].e+' '+dp.ITM[x.g].n+'<br>⏱️ '+x.m+' perc'+(P.scope==='out'?' → '+(x.m*.75).toFixed(1):'')+'<br>Van: '+d.inv[x.id]+'<br>'+BTN('Ültetés','data-pl="'+x.id+'"',0,'linear-gradient(#22c55e,#15803d)')+'</div>').join('')+'</div>':'<div style="'+CARD+'">Nincs magod. 🌱 A <b>Zöld Kéz Kertészet</b> a boltsorban van, a lakókocsival szemben.</div>'));
 OVL.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.pl];dp.addI(x.id,-1);const dur=x.m*60000*(P.scope==='out'?.75:1);const tr=d.inv.tragya>0;if(tr)dp.addI('tragya',-1);d.pots[P.key]={s:x.id,end:Date.now()+dur,dur,w:0,tr:tr?1:0};if(P.scope==='out')dp.heat(2);dp.save();toast('🌱 Elültetve: '+x.n);closeOvl();potVis()})}
function ordUI(){const dp=DP(),d=DD();const ob=$$('sp3ob');if(ob)ob.style.display='none';
 ovl(head('📱 CSABA TELEFONJA – RENDELÉSEK','Hely: <b>'+cargoN()+'/'+capTot()+'</b> ('+veh().e+' '+veh().n+' + táska) · A gyors szállításért borravaló jár!')+
 '<h3 style="margin:6px 0">🚚 Úton lévő szállítások</h3>'+(d.cargo.length?d.cargo.map(c=>'<div style="'+CARD+';margin-bottom:6px;display:flex;gap:10px;align-items:center"><span style="font-size:24px">'+dp.ITM[c.pid].e+'</span><div><b>'+c.n+'× '+dp.ITM[c.pid].n+'</b> → '+dp.DIS[c.di][1]+' '+dp.DIS[c.di][0]+' ('+c.who+')<br>💰 '+dp.f$(c.pay)+' · ⏱️ <b style="color:'+(c.left<20?'#f87171':'#86efac')+'">'+Math.ceil(c.left)+' mp</b></div></div>').join(''):'<i>Nincs.</i>')+
 '<h3 style="margin:12px 0 6px">📨 Új ajánlatok</h3>'+(OFF.length?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:9px">'+OFF.map(o=>{const ok=dp.has(o.pid,o.n);return'<div style="'+CARD+'"><b>'+o.who+'</b> · '+dp.DIS[o.di][1]+' '+dp.DIS[o.di][0]+(dp.evOf&&dp.evOf(o.di)&&(!dp.evOf(o.di).br||dp.evOf(o.di).br===dp.ITM[o.pid].br)?' <span style="font-size:11px;background:#7c3aed55;border-radius:99px;padding:1px 7px">'+dp.evOf(o.di).n+'</span>':'')+'<br><span style="font-size:22px">'+dp.ITM[o.pid].e+'</span> '+o.n+'× '+dp.ITM[o.pid].n+'<br>Van: <b style="color:'+(ok?'#86efac':'#f87171')+'">'+(d.inv[o.pid]||0)+'</b> · 💰 <b>'+dp.f$(o.pay)+'</b> · ⏱️ '+o.tl+' mp<br>'+BTN('✔ Elfogad','data-ac="'+o.id+'"',!ok)+BTN('✕','data-rj="'+o.id+'"',0,'#475569')+'</div>'}).join('')+'</div>':'<i>Most csend van… pár másodperc múlva jön új rendelés.</i>'));
 OVL.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>accept(b.dataset.ac));OVL.querySelectorAll('[data-rj]').forEach(b=>b.onclick=()=>{OFF=OFF.filter(o=>o.id!==b.dataset.rj);ordUI()})}
function showMods(){const L=DD().lm;for(const k in MODS)MODS[k].visible=!!L[k];if(FX.labL)FX.labL.forEach(l=>l.color.setHex(L.lm_neon?0xc4b5fd:0xdbeafe))}

// ===================== TÉRKÉP =====================
function drawMap(cv,big){const x=cv.getContext('2d'),W=cv.width,sc=W/270,T=v=>(v+135)*sc;x.fillStyle='#0b1026';x.fillRect(0,0,W,W);x.fillStyle='#14532d55';x.fillRect(0,0,W,W);
 x.fillStyle='#475569';[-90,-30,30,90].forEach(v=>{x.fillRect(0,T(v)-5*sc,W,10*sc);x.fillRect(T(v)-5*sc,0,10*sc,W)});x.fillStyle='#1e293b';COL.forEach(b=>{if(b[2]-b[0]>2)x.fillRect(T(b[0]),T(b[1]),(b[2]-b[0])*sc,(b[3]-b[1])*sc)});
 x.fillStyle='#a78bfa';x.fillRect(T(-11.4),T(-2.5),22.8*sc,5*sc);x.fillStyle='#f472b6';x.fillRect(T(-24),T(-28),48*sc,8*sc);
 const d=DD(),tg=new Set(d.cargo.map(c=>c.di));DROPPOS.forEach(([a,b],i)=>{x.fillStyle=tg.has(i)?'#22c55e':'#fca5a580';x.beginPath();x.arc(T(a),T(b),(tg.has(i)?6:3.5)*(big?1.6:1),0,7);x.fill();if(big){x.fillStyle='#fff';x.font='bold 12px system-ui';x.textAlign='center';x.fillText(DP().DIS[i][0],T(a),T(b)-12)}});
 POTS.forEach(P=>{if(P.scope!=='out')return;const s=potState(P);x.fillStyle=s?(s.ready?'#a3e635':'#15803d'):'#78716c';x.fillRect(T(P.x)-2,T(P.z)-2,4,4)});
 x.fillStyle='#e2e8f0';LIFE.peds.forEach(p=>{const g=p.g.position;x.fillRect(T(g.x)-1,T(g.z)-1,2,2)});x.fillStyle='#94a3b8';LIFE.cars.forEach(c=>{const g=c.g.position;x.fillRect(T(g.x)-2.5,T(g.z)-2.5,5,5)});
 if(GUIDE.t&&GUIDE.t.out){x.strokeStyle='#facc15';x.lineWidth=2;x.beginPath();x.arc(T(GUIDE.t.x),T(GUIDE.t.z),big?11:7,0,7);x.stroke()}
 POL.forEach(P=>{x.fillStyle=Math.floor(clock*6)%2?'#ef4444':'#3b82f6';x.beginPath();x.arc(T(P.x),T(P.z),big?6:4,0,7);x.fill()});
 x.fillStyle='#fde047';x.beginPath();x.arc(T(car.x),T(car.z),big?5:3,0,7);x.fill();
 const mx=INCAR?car.x:px,mz=INCAR?car.z:pz,h=INCAR?car.h:yaw+Math.PI;x.save();x.translate(T(mx),T(mz));x.rotate(-h+Math.PI);x.fillStyle='#fff';x.beginPath();x.moveTo(0,-8);x.lineTo(5,6);x.lineTo(-5,6);x.fill();x.restore();
 if(big){x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';x.fillText('🟢 leadás · 🔴🔵 rendőr · 🟡 autó · 🟣 lakókocsi · 🩷 boltsor · ▪ cserép · ⚪ járókelő · ◽ forgalom · 🟨 cél',10,W-12)}}

// ===================== ÚTMUTATÓ (11-09): küldetés + célnyíl =====================
const HINT={lab:'főzés (3D keverés-minijáték)',labup:'labor-modulok vásárlása',pal:'pálinkafőzés (3D üst)',pal2:'pályázatírás (3D pecsételés)',home:'küldetések, statisztika, pénzmosás',inv:'raktár',party:'afterparti (3D DJ-pult)',shop:'Csaba hűtője – bolt',out:'ki a városba',enter:'vissza a lakókocsiba',car:'beszállás / kiszállás',pack:'csomagolás futószalagon – Ft',mg3:'minden 3D műszak egy helyen',futar:'sürgős fuvar időre – Ft'};
const GUIDE={t:null,txt:'',k:0};
const QST={0:'lab',2:'pal',3:'pal2',4:'party'};
function guide(){const dp=DP();if(!dp||!dp.STORY)return;const d=DD(),me=INCAR?car:{x:px,z:pz};let t=null,txt='';const st=id=>{const s=ST.find(z=>z.id===id);return s?{x:s.x,z:s.z,out:s.scope==='out',n:s.label.replace(/ \[[EF]\]/,'')}:null};
 if(d.cargo.length){if(INSIDE)t=st('out');else{let bd=1e9;d.cargo.forEach(c=>{const[a,b]=DROPPOS[c.di],dd=Math.hypot(a-me.x,b-me.z);if(dd<bd){bd=dd;t={x:a,z:b,out:true,n:'📦 '+dp.DIS[c.di][0]}}})}}
 const q=dp.STORY[d.sq];if(q){const[a,b]=q.g();const done=a>=b-1e-9;txt=(done?'✅ ':'🎯 ')+q.t+' · '+(Number.isInteger(a)?Math.min(a,b)+'/'+b:Math.round(a/b*100)+'%')+(done?' – jelentsd a Főhadiszálláson!':'');
  if(!t){const id=done?'home':QST[d.sq];if(id){t=st(id);if(t&&!t.out&&!INSIDE)t=st('enter')}else if(d.sq===1||d.sq===7){if(INSIDE)t=st('out');txt+=' · 📱 O = rendelések'}}}
 else txt='📖 A történet véget ért – szabad játék';GUIDE.t=t;GUIDE.txt=txt}
function guideDraw(){const a=$$('sp3ar'),t=GUIDE.t;if(!a)return;if(!t){if(a.style.display!=='none')a.style.display='none';return}
 const me=INCAR?car:{x:px,z:pz},dx=t.x-me.x,dz=t.z-me.z,dist=Math.hypot(dx,dz);let r,f;if(INCAR){r=-dx*Math.cos(car.h)+dz*Math.sin(car.h);f=dx*Math.sin(car.h)+dz*Math.cos(car.h)}else{r=dx*Math.cos(yaw)-dz*Math.sin(yaw);f=-dx*Math.sin(yaw)-dz*Math.cos(yaw)}
 const ang=Math.round(Math.atan2(r,f)*57.3/3)*3,h='<span style="display:inline-block;transform:rotate('+ang+'deg);color:#facc15;font-size:20px">⬆</span> '+t.n+' · <b>'+Math.round(dist)+' m</b>';if(a._h!==h){a._h=h;a.innerHTML=h}a.style.display='block'}

// ===================== FŐCIKLUS =====================
function stepNear(){near=null;let bd=INSIDE?1.6:(INCAR?5.5:3.2);const fx=-Math.sin(yaw),fz=-Math.cos(yaw);const mx=INCAR?car.x:px,mz=INCAR?car.z:pz;const sc=INSIDE?'in':'out';
 if(FX.carS){FX.carS.x=car.x;FX.carS.z=car.z;FX.carS.sp.position.set(car.x,2.6,car.z);FX.carS.sp.visible=!INCAR&&!INSIDE}
 ST.forEach(s=>{if(s.scope!==sc)return;if(INCAR&&!/^drop/.test(s.id))return;const dx=s.x-mx,dz=s.z-mz,d=Math.hypot(dx,dz);const dot=INCAR?1:(dx*fx+dz*fz)/(d||1);if(d<bd&&dot>.2){bd=d;near=s}});
 ST.forEach(s=>{const on=s===near,w=s.sp.userData.w||1.6;s.sp.material.opacity=on?1:.6;s.sp.scale.set(w*(on?1.15:1),w*.19*(on?1.15:1),1);if(/^drop/.test(s.id))s.sp.visible=!INSIDE});
 const pr=$$('sp3p');const hn=near&&(HINT[near.id]||(/^drop/.test(near.id)?'rendelés leadása':/^shop_/.test(near.id)?'bolt':/^pot_/.test(near.id)?'ültetés / szüret':''));const h=near?'<b>['+(near.id==='car'?'F':'E')+']</b> '+near.label.replace(/ \[[EF]\]/,'')+(hn?' <span style="font-weight:500;opacity:.8;font-size:14px">– '+hn+'</span>':''):'';if(pr._h!==h){pr._h=h;pr.innerHTML=h;pr.style.display=h?'block':'none'}}
function interact(){if(!near)return;if(near.id==='car'){toggleCar();return}PAUSE=true;try{document.exitPointerLock()}catch(e){}if(near.act){PAUSE=false;near.act();return}window.openSotetProgram(near.tab)}
function loop(t){if(!ON)return;raf=requestAnimationFrame(loop);if(window.spmgOn&&spmgOn()){last=t;return}const dt=Math.min(.05,(t-(last||t))/1000);last=t;clock+=dt;const d=DD();if(window._sp3fx)try{window._sp3fx(dt,{SC,CAM,INSIDE,INCAR,HEMI,MOON,px,pz,car,clock,beep})}catch(e){}
 const busy=PAUSE||(window.sotetPanelOpen&&sotetPanelOpen())||($$('dpmg')&&$$('dpmg').style.display==='flex')||ovlOpen();
 if(!busy){const a=accB();
  if(INCAR){const v=veh(),mxs=v.sp*(1+a.car)*(K.shift?1.35:1);if(K.w||K.arrowup)car.v+=dt*mxs*.9;else if(K.s||K.arrowdown)car.v-=dt*mxs*(car.v>0?1.6:.6);else car.v*=1-dt*1.2;car.v=cl(car.v,-mxs*.4,mxs);
   const st=(K.a||K.arrowleft?1:0)-(K.d||K.arrowright?1:0);car.h+=st*dt*1.9*cl(car.v/8,-1,1);const nx=car.x+Math.sin(car.h)*car.v*dt,nz=car.z+Math.cos(car.h)*car.v*dt;
   if(hit(nx,nz,1.3)){if(Math.abs(car.v)>8)beep(90,.2,'sawtooth',.08);car.v*=-.3}else{car.x=nx;car.z=nz}CAR.position.set(car.x,0,car.z);CAR.rotation.y=car.h;
   const cx=car.x-Math.sin(car.h)*8,cz=car.z-Math.cos(car.h)*8;CAM.position.lerp(_V3.set(cx,3.6,cz),Math.min(1,dt*5));CAM.lookAt(car.x,1.2,car.z)}
  else{const run=K.shift?(INSIDE?3.6:5.6)*(1+a.run):(INSIDE?2.2:3.4);const sp=run*dt;let mx=0,mz=0;if(K.w||K.arrowup)mz-=1;if(K.s||K.arrowdown)mz+=1;if(K.a||K.arrowleft)mx-=1;if(K.d||K.arrowright)mx+=1;
   const c=Math.cos(yaw),s=Math.sin(yaw);const nx=px+(mx*c+mz*s)*sp,nz=pz+(-mx*s+mz*c)*sp;
   if(INSIDE){px=nx;pz=nz;NPC.forEach(n=>{if(Math.abs(n.x)>12||Math.abs(n.z)>3)return;const dx=px-n.x,dz=pz-n.z,dd=Math.hypot(dx,dz);if(dd<.45&&dd>0){px=n.x+dx/dd*.45;pz=n.z+dz/dd*.45}});px=cl(px,-BX,BX);pz=cl(pz,-BZ+.25,BZ-.25)}
   else{if(!hit(nx,pz,.35))px=nx;if(!hit(px,nz,.35))pz=nz}}}
 if(!INCAR){const bob=(K.w||K.s||K.a||K.d)&&!busy?Math.sin(clock*9)*.03:0;CAM.position.set(px,1.6+bob,pz);CAM.rotation.set(pit,yaw,0,'YXZ')}
 // animációk
 if(DISCO){DISCO.rotation.y+=dt*1.5;FX.dl.color.setHSL((clock*.2)%1,.8,.6)}
 if(FX.bub&&MODS.lm_tank.visible)FX.bub.forEach((b,i)=>{b.position.y+=dt*(.4+i%3*.15);if(b.position.y>1.5)b.position.y=.15});
 if(FX.fan&&MODS.lm_hood.visible)FX.fan.rotation.y+=dt*12;if(FX.conv&&MODS.lm_conv.visible)FX.conv.forEach(b=>{b.position.x+=dt*.5;if(b.position.x>-6.5)b.position.x=-10.3});
 if(FX.arm&&MODS.lm_robot.visible){FX.arm[0].rotation.y=Math.sin(clock*.9)*1.2;FX.arm[1].rotation.x=Math.sin(clock*1.7)*.6}
 if(FX.core&&MODS.lm_reakt.visible){FX.core.scale.setScalar(1+Math.sin(clock*4)*.08);FX.rings.forEach((r,i)=>{r.rotation.x=clock*(1+i*.4);r.rotation.y=clock*(.7+i*.3)})}
 if(FX.monC&&MODS.lm_mon.visible&&Math.floor(clock*3)!==FX._mt){FX._mt=Math.floor(clock*3);const x=FX.monC.getContext('2d');x.fillStyle='#020617';x.fillRect(0,0,512,128);for(let p=0;p<4;p++){x.strokeStyle=['#22d3ee','#a3e635','#f472b6','#facc15'][p];x.lineWidth=3;x.beginPath();for(let i=0;i<32;i++){const y=64+Math.sin(clock*2+i*.5+p)*30*Math.random();x.lineTo(p*128+i*4,y)}x.stroke();x.fillStyle='#fff';x.font='bold 14px monospace';x.fillText(['TISZT 99.'+Math.floor(Math.random()*9)+'%','HŐ '+(70+Math.floor(Math.random()*9))+'°C','NYOMÁS OK','Ft '+Math.round(d.cash)][p],p*128+6,18)}FX.monP.forEach(m=>m.material.map.needsUpdate=true)}
 NPC.forEach((n,i)=>{n.m.position.y=Math.abs(Math.sin(clock*2+i))*.02;const dx=px-n.x,dz=pz-n.z;if(Math.hypot(dx,dz)<(INSIDE?2.4:6))n.m.rotation.y=Math.atan2(dx,dz);else n.m.rotation.y=n.ry+Math.sin(clock*.5+i)*.3;if(n.k==='beno')n.m.rotation.z=Math.sin(clock*6)*.08});
 if(!busy){tickOffers(dt);tickPolice(dt)}
 const tg=new Set(d.cargo.map(c=>c.di));DROPS.forEach(D=>{const on=tg.has(D.i)&&!INSIDE;D.beam.visible=on;D.ring.visible=on;if(on){D.ring.scale.setScalar(1+Math.sin(clock*4)*.12);D.beam.material.opacity=.15+Math.sin(clock*3)*.08}});
 potT-=dt;if(potT<=0){potT=.5;potVis()}
 mmT-=dt;if(mmT<=0&&!INSIDE){mmT=.12;drawMap($$('sp3mm'),false);if(BIGMAP)drawMap($$('sp3bm'),true)}
 try{tickLife(busy?0:dt)}catch(e){}
 GUIDE.k-=dt;if(GUIDE.k<=0){GUIDE.k=.25;try{guide()}catch(e){}}guideDraw();stepNear();R.render(SC,CAM)}
function hud(){const dp=DP();if(!dp)return;const D=dp.D;const h='📅 '+D.day+'. nap · 💰 '+Math.round(D.cash).toLocaleString('hu-HU')+' Ft · ⚡ '+Math.round(D.en)+' · 🔥 '+Math.round(D.heat)+'% · '+(dp.rankTxt?dp.rankTxt(dp.rank()):'⭐ '+D.rep)+' · 📦 '+cargoN()+'/'+capTot()+' · '+veh().e;
 const q=$$('sp3q');if(q&&q._h!==GUIDE.txt){q._h=GUIDE.txt;q.textContent=GUIDE.txt;q.style.display=GUIDE.txt?'block':'none'}const e=$$('sp3h');if(e&&e._h!==h){e._h=h;e.textContent=h}
 const w=$$('sp3w');if(w){w.style.display=WANT>.02&&!INSIDE?'block':'none';w.firstChild.style.width=Math.round(WANT*100)+'%'}
 const c=$$('sp3c');if(c){const t=(D.cargo||[]).map(x=>dp.ITM[x.pid].e+' '+x.n+'× → '+dp.DIS[x.di][0]+' <b style="color:'+(x.left<20?'#f87171':'#86efac')+'">'+Math.ceil(x.left)+'s</b>').join('<br>');if(c._h!==t){c._h=t;c.innerHTML=t?'🚚 <b>SZÁLLÍTÁS</b><br>'+t:'';c.style.display=t?'block':'none'}}}
function openSotet3D(){if(ON)return;ON=true;const lb=$$('lb');if(lb)lb.classList.remove('on');
 let w=$$('sp3');if(!w){w=document.createElement('div');w.id='sp3';w.style.cssText='position:fixed;inset:0;z-index:9400;background:#000';
  const pill='position:absolute;z-index:2;color:#fff;font:700 14px system-ui;background:rgba(15,23,42,.82);border:1px solid #7c3aed;border-radius:12px;backdrop-filter:blur(6px)';
  w.innerHTML='<div id="sp3h" style="'+pill+';top:12px;left:50%;transform:translateX(-50%);padding:7px 14px"></div>'+
  '<div style="position:absolute;top:10px;left:12px;color:#fff;font:900 20px system-ui;z-index:2;text-shadow:0 2px 6px #000">🕶️ SÖTÉT PROGRAM <span style="font-size:12px;opacity:.7">· lakókocsi & város</span></div>'+
  '<button id="sp3x" style="position:absolute;top:10px;right:12px;z-index:3;background:#ef4444;color:#fff;border:0;border-radius:9px;padding:8px 12px;font-weight:800;cursor:pointer">⬅ Vissza a lobbyba</button>'+
  '<canvas id="sp3mm" width="180" height="180" style="'+pill+';top:52px;right:12px;display:none;border-radius:14px;border:2px solid #a78bfa"></canvas>'+
  '<div id="sp3c" style="'+pill+';top:242px;right:12px;padding:8px 10px;display:none;max-width:240px;font-size:12px"></div>'+
  '<div id="sp3ob" style="'+pill+';top:52px;left:12px;padding:8px 12px;display:none;background:linear-gradient(90deg,#16a34a,#15803d);cursor:pointer"></div>'+
  '<div id="sp3w" style="position:absolute;z-index:2;top:50px;left:50%;transform:translateX(-50%);width:260px;height:14px;background:#0f172acc;border:2px solid #ef4444;border-radius:8px;overflow:hidden;display:none"><i style="display:block;height:100%;width:0;background:linear-gradient(90deg,#ef4444,#3b82f6)"></i></div>'+
  '<div id="sp3q" style="'+pill+';top:96px;left:12px;padding:7px 12px;display:none;max-width:min(420px,60vw);font-size:13px;border-color:#facc15"></div>'+
  '<div id="sp3ar" style="'+pill+';top:84px;left:50%;transform:translateX(-50%);padding:5px 12px;display:none;font-size:13px;border-color:#facc15"></div>'+
  '<div id="sp3p" style="position:absolute;bottom:90px;left:50%;transform:translateX(-50%);color:#fff;font:700 18px system-ui;background:rgba(124,58,237,.88);padding:9px 16px;border-radius:12px;display:none;z-index:2"></div>'+
  '<div id="sp3n" style="position:absolute;bottom:140px;left:50%;transform:translateX(-50%);color:#fff;font:600 15px system-ui;background:rgba(15,23,42,.9);border:1px solid #f472b6;padding:9px 16px;border-radius:12px;z-index:3;opacity:0;transition:opacity .4s;pointer-events:none;max-width:80vw;text-align:center"></div>'+
  '<div style="position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff;opacity:.8;z-index:2"></div>'+
  '<div id="sp3bmw" style="position:absolute;inset:0;z-index:4;background:rgba(2,6,23,.75);display:none;align-items:center;justify-content:center"><canvas id="sp3bm" width="620" height="620" style="max-width:92vmin;max-height:92vmin;border:3px solid #a78bfa;border-radius:18px"></canvas></div>'+
  '<div id="sp3t" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);color:#cbd5e1;font:600 13px system-ui;background:rgba(15,23,42,.75);padding:6px 12px;border-radius:9px;z-index:2">Kattints a nézelődéshez · WASD mozgás · SHIFT futás · E interakció · O rendelések · M térkép · F autó · ESC egér · 🟨 nyíl = következő cél</div>';
  document.body.appendChild(w);$$('sp3x').onclick=closeSotet3D;$$('sp3ob').onclick=ordUI}
 w.style.display='block';if(!R){R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;R.outputEncoding=THREE.sRGBEncoding;w.insertBefore(R.domElement,w.firstChild);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  SC=new THREE.Scene();SC.background=new THREE.Color(0x0b1026);SC.fog=new THREE.Fog(0x0b1026,14,40);CAM=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,500);SC.add(new THREE.HemisphereLight(0xc7d2fe,0x3b2a1a,.5));
  buildInterior();buildCity();try{buildLife()}catch(e){console.warn("sp3 life",e)}
  const MGR=k=>()=>{if(window._spmg)_spmg.run(k,{mode:'job'});else toast('A 3D minijáték-modul nem töltődött be.')};
  S('pack',-8.4,1.25,'📦 CSOMAGOLÓSOR [E]','#fdba74',null,MGR('pack'));S('mg3',-8.6,-1.3,'🎮 MŰSZAK-TÁBLA [E]','#f0abfc','mg3');
  S('futar',14.5,5.5,'📞 FUTÁRKÖZPONT [E]','#fde047',null,MGR('drive'),'out',2.6,2.2);
  R.domElement.addEventListener('click',()=>{if(!PAUSE&&!ovlOpen())lockP()});
  document.addEventListener('mousemove',e=>{if(!ON||document.pointerLockElement!==R.domElement||INCAR)return;yaw-=e.movementX*.0025;pit=Math.max(-1.3,Math.min(1.3,pit-e.movementY*.0025))});
  addEventListener('resize',()=>{if(!R)return;R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix()})}
 const d=DD();if(d.veh!=='berelt'&&!d.own[d.veh])d.veh='berelt';rebuildCar();showMods();
 R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix();goIn();px=6;pz=0;yaw=Math.PI/2;PAUSE=false;last=0;raf=requestAnimationFrame(loop);
 window._sp3hud=setInterval(hud,250);hud();setTimeout(()=>{if(!d._intro2){d._intro2=1;toast('👨‍🔬 <b>Profi Ferkó:</b> „Nézd, mekkora lett a kocsi! A labor balra van – a fejlesztéseket a lila táblánál veszed. A városba az ajtón át jutsz ki!”')}},700)}
function closeSotet3D(){ON=false;cancelAnimationFrame(raf);clearInterval(window._sp3hud);try{document.exitPointerLock()}catch(e){}closeOvl();const w=$$('sp3');if(w)w.style.display='none';const p=$$('dp');if(p)p.style.display='none';try{DP().save()}catch(e){}const lb=$$('lb');if(lb)lb.classList.add('on')}
window.openSotet3D=openSotet3D;window.closeSotet3D=closeSotet3D;
addEventListener('keydown',e=>{if(!ON)return;if(window.spmgOn&&spmgOn())return;if(window.sotetPanelOpen&&sotetPanelOpen())return;if($$('dpmg')&&$$('dpmg').style.display==='flex')return;const k=e.key.toLowerCase();e.stopImmediatePropagation();
 if(ovlOpen()){if(k==='escape'||(k==='o'&&OVL.innerHTML.includes('RENDELÉSEK')))closeOvl();return}
 if(BIGMAP&&(k==='m'||k==='escape')){BIGMAP=false;$$('sp3bmw').style.display='none';return}
 K[k]=true;if(e.repeat)return;if(k==='e')interact();else if(k==='f'&&!INSIDE)toggleCar();else if(k==='o')ordUI();else if(k==='m'&&!INSIDE){BIGMAP=true;$$('sp3bmw').style.display='flex';drawMap($$('sp3bm'),true)}else if(k==='h'&&INCAR){beep(392,.35,'square',.08);beep(466,.35,'square',.06)}if(k===' ')e.preventDefault()},true);
addEventListener('keyup',e=>{if(!ON)return;K[e.key.toLowerCase()]=false},true);
addEventListener('blur',()=>{K={}});
window._sp3tp=(x,z,y)=>{px=x;pz=z;yaw=y};window._sp3hit=hit;window._sp3=()=>({px,pz,yaw,INSIDE,INCAR,car,WANT,near:near&&near.id,OFF,ST:ST.map(s=>s.id),api:{goOut,goIn,toggleCar,accept,deliver,ordUI,shopUI,carUI,potUI:i=>potUI(POTS[i]),genOffer,POTS,DROPS,MODS}});
})();
