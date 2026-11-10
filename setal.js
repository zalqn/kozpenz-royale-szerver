// ===== SÉTA MÓD (/setal) – kisétálás a lobbyból a Közpénz térre (lobby3d2), belépő boltok, Harcba-kapu =====
// Irányítás: WASD/nyilak, Shift futás, Szóköz ugrás, egér (pointer lock / húzás) forgat, E = belépés/pult/kijárat, Esc = menü.
// A meglévő lobby renderert (LB3D) használja; minden geometria/anyag egyszer épül, valódi fény nincs. Mentés: k3setal. Debug: window._setal
(function(){'use strict';
if(typeof window==='undefined')return;
const $=i=>document.getElementById(i);
const S={on:false,built:false,zone:'out',pos:{x:0,y:0,z:4},vy:0,yaw:0,pitch:.28,head:0,keys:{},paused:false,menu:false,near:null,saved:null,trans:0,walkT:0};
window._setal=S;
const LS={g:k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const lbOn=()=>{const l=$('lb');return !!(l&&l.classList.contains('on')&&window.LB3D&&LB3D.sc&&!(typeof run!=='undefined'&&run))};
const call=(f,nm)=>{try{const r=f();if(r===false)throw 0;return true}catch(e){showCap2('🔒 '+nm+' most zárva');return false}};
const clk=id=>()=>{const b=$(id);if(!b)throw 0;b.click()};

// ---------- BOLTOK ----------
// side: 'L' (bal utca, homlokzat +x felé), 'R' (jobb utca, -x felé), 'B' (meglévő épület hátul, a lobby3d2-ben)
const SHOPS=[
 {id:'cas',nm:'Aranyköd Kaszinó',ic:'🎰',side:'B',x:-17,z:39.6,fn:()=>x10cas(),wall:'#3b0d1a',floor:'carpet',fc:['#7f1d1d','#b45309'],acc:'#f59e0b',npc:[0x111827,'🤵','Krupié Kornél'],theme:'cas'},
 {id:'gar',nm:'Garázs',ic:'🚗',side:'B',x:18,z:39.6,fn:()=>_jm2.garage(),wall:'#374151',floor:'concrete',fc:['#4b5563','#6b7280'],acc:'#38bdf8',npc:[0x1d4ed8,'👨‍🔧','Csavar Csaba'],theme:'gar'},
 {id:'kp',nm:'Kaszinó+ Tőzsde',ic:'💹',side:'L',z:-14,fn:()=>_x14d.open(),wall:'#0f172a',floor:'tiles',fc:['#1e293b','#334155'],acc:'#22d3ee',npc:[0x0f766e,'🧑‍💼','Árfolyam Aladár'],theme:'kp',c1:'#0e7490',c2:'#67e8f9'},
 {id:'sot',nm:'Sötét Program',ic:'🕶️',side:'L',z:2,fn:()=>openSotetProgram(),wall:'#120a1f',floor:'concrete',fc:['#1c1427','#2a1f3a'],acc:'#a855f7',npc:[0x1f2937,'🕵️','Árnyék Ödön'],theme:'sot',c1:'#3b0764',c2:'#d8b4fe'},
 {id:'hiv',nm:'Közhivatal',ic:'🏛️',side:'L',z:16,fn:()=>_x160.open(),wall:'#e7e5e4',floor:'tiles',fc:['#d6d3d1','#a8a29e'],acc:'#2563eb',npc:[0x64748b,'👩‍💼','Ügyintéző Irma'],theme:'hiv',c1:'#1e3a8a',c2:'#dbeafe'},
 {id:'ruh',nm:'Divatkuckó',ic:'👕',side:'R',z:-14,fn:()=>openOutfit(),wall:'#fdf2f8',floor:'wood',fc:['#c08457','#a16207'],acc:'#ec4899',npc:[0xdb2777,'💁','Csipke Cecília'],theme:'ruh',c1:'#be185d',c2:'#fce7f3'},
 {id:'emo',nm:'Tánciskola',ic:'💃',side:'R',z:0,fn:()=>_emo.open(),wall:'#1e1b4b',floor:'disco',fc:['#4c1d95','#be185d'],acc:'#f472b6',npc:[0x7c3aed,'🕺','Ritmus Rezső'],theme:'emo',c1:'#6d28d9',c2:'#f5d0fe'},
 {id:'kut',nm:'Kutyakuckó',ic:'🐶',side:'R',z:12,fn:()=>openPets(),wall:'#fef3c7',floor:'wood',fc:['#d6a35c','#b7791f'],acc:'#f59e0b',npc:[0x16a34a,'🧑‍🌾','Gazdi Gizella'],theme:'kut',c1:'#b45309',c2:'#fef3c7'},
 {id:'hir',nm:'Hírfal & Közösség',ic:'📰',side:'R',z:28,fn:clk('soNews'),alt:{nm:'Közösség+',fn:()=>_k2.open()},wall:'#ecfeff',floor:'tiles',fc:['#cffafe','#a5f3fc'],acc:'#0891b2',npc:[0xea580c,'🧑‍🏫','Szerkesztő Szabolcs'],theme:'hir',c1:'#0e7490',c2:'#ecfeff'}
];
SHOPS.forEach(s=>{if(s.side==='L'){s.x=-37.6}else if(s.side==='R'){s.x=37.6}});
const LOBBY_PT={x:0,z:0},GATE={x:-27,z:-21};

// ---------- ÉPÍTÉS ----------
let G=null,cv,box,plane,cyl,sph;const BOXES=[],CIRC=[];const ROOMS={};let MAT={};
function cvTex(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
const lam=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const bas=(c,o)=>new THREE.MeshBasicMaterial(Object.assign({color:c},o||{}));
function signTex(txt,bg,fg,w,h,ic){return cvTex(w||1024,h||256,(x,W,H)=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,bg);g.addColorStop(1,'#000');x.fillStyle=g;x.fillRect(0,0,W,H);x.strokeStyle=fg;x.lineWidth=10;x.strokeRect(8,8,W-16,H-16);
 x.textAlign='center';x.textBaseline='middle';const s=(ic?ic+' ':'')+txt;const fs=Math.min(H*.6,W*1.5/Math.max(5,s.length));x.font='900 '+fs+'px Impact, Arial Black, Arial';x.shadowColor=fg;x.shadowBlur=24;x.fillStyle=fg;x.fillText(s,W/2,H/2+4)})}
const SPRC={};function sprite(e,s){
 const t=SPRC[e]||(SPRC[e]=cvTex(128,128,(x)=>{x.font='100px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,64,70)}));const o=new THREE.Sprite(new THREE.SpriteMaterial({map:t}));o.scale.set(s,s,s);return o}
function M(geo,mat,x,y,z,sx,sy,sz,par,ry){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(sx!=null)m.scale.set(sx,sy,sz);if(ry)m.rotation.y=ry;(par||G).add(m);return m}
// sok azonos alakú, színes tárgy egy InstancedMesh-ben
function inst(geo,list,par,mat){const im=new THREE.InstancedMesh(geo,mat||lam(0xffffff),list.length);const o=new THREE.Object3D(),c=new THREE.Color();
 list.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.rotation.set(0,p[6]||0,0);o.scale.set(p[3],p[4],p[5]);o.updateMatrix();im.setMatrixAt(i,o.matrix);im.setColorAt(i,c.set(p[7]||'#fff'))});
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;par.add(im);return im}

function facadeTex(s){return cvTex(1024,768,(x,W,H)=>{x.fillStyle=s.c1;x.fillRect(0,0,W,H);
 for(let y=0;y<H;y+=48){x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,y,W,3)} // téglasor
 // két kirakat + ajtó
 const win=(X,Y,w,h)=>{const g=x.createLinearGradient(X,Y,X+w,Y+h);g.addColorStop(0,'#fff8e1');g.addColorStop(1,s.c2);x.fillStyle=g;x.fillRect(X,Y,w,h);
  x.font='64px serif';x.textAlign='center';x.textBaseline='middle';const em=EMO[s.theme]||['🛍️'];for(let r=0;r<2;r++)for(let c=0;c<3;c++)x.fillText(em[(r*3+c)%em.length],X+w*(c+.5)/3,Y+h*(r+.5)/2+(r?6:0));
  x.fillStyle='rgba(255,255,255,.28)';x.beginPath();x.moveTo(X,Y);x.lineTo(X+w*.35,Y);x.lineTo(X,Y+h*.6);x.fill();x.strokeStyle='#1f2937';x.lineWidth=14;x.strokeRect(X,Y,w,h)};
 win(40,330,330,300);win(W-370,330,330,300);
 x.fillStyle='#111827';x.fillRect(W/2-120,300,240,468);const dg=x.createLinearGradient(0,320,0,H);dg.addColorStop(0,'#fde68a');dg.addColorStop(1,s.c2);x.fillStyle=dg;x.globalAlpha=.85;x.fillRect(W/2-100,320,200,448);x.globalAlpha=1;
 x.fillStyle='#1f2937';x.fillRect(W/2-6,320,12,448);x.fillStyle='#facc15';x.beginPath();x.arc(W/2+60,560,10,0,7);x.fill();
 x.fillStyle='#fff';x.font='700 30px Arial';x.textAlign='center';x.fillText('NYITVA',W/2,290);
 // felső emelet ablakai
 for(let i=0;i<4;i++){x.fillStyle='#0b1022';x.fillRect(60+i*240,60,160,150);x.fillStyle='rgba(253,230,138,.75)';x.fillRect(70+i*240,70,140,130);x.fillStyle='#1f2937';x.fillRect(136+i*240,70,8,130)}})}
const EMO={cas:['🎰','🃏','🎲','💰','♠️','🍒'],gar:['🚗','🏎️','🔧','🛞','⛽','🚙'],kp:['📈','💹','🏙️','💎','📊','🪙'],sot:['🕶️','📦','💼','🗝️','🌙','🎲'],hiv:['📜','🖋️','📎','🗂️','🏛️','⏳'],ruh:['👕','👗','🧢','👟','🕶️','👜'],emo:['💃','🕺','🎶','🪩','🎤','✨'],kut:['🐶','🦴','🎾','🐕','🥣','🧸'],hir:['📰','📌','🗞️','💬','📷','🤝']};

function buildOutside(){
 SHOPS.forEach(s=>{if(s.side==='B')return;const g=new THREE.Group();const fx=s.side==='L'?-39.3:39.3;g.position.set(fx,0,s.z);g.rotation.y=s.side==='L'?Math.PI/2:-Math.PI/2;G.add(g);
  const body=lam(s.c1);M(box,body,0,3.3,-2.2,9.2,6.6,4.4,g);
  const ft=facadeTex(s);M(plane,lam(0xffffff,{map:ft,emissive:0xffffff,emissiveMap:ft,emissiveIntensity:.35}),0,3.3,.01,9.2,6.6,1,g);
  M(box,lam(0x1f2937),0,6.75,-2.2,9.6,.3,4.8,g); // párkány
  const st=signTex(s.nm,s.c1,s.c2,1024,200,s.ic);M(plane,bas(0xffffff,{map:st,toneMapped:false}),0,4.75,.35,7.2,1.4,1,g);M(box,lam(0x111827),0,4.75,.2,7.5,1.6,.25,g);
  const aw=cvTex(256,64,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?s.acc:'#f8fafc';x.fillRect(i*32,0,32,h)}});const a=M(box,lam(0xffffff,{map:aw}),0,3.85,.9,8.6,.08,1.9,g);a.rotation.x=.3;
  [-3.9,3.9].forEach(px=>{M(cyl,lam(0x7c2d12),px,.35,.6,.45,.7,.45,g);const b=M(sph,lam(0x15803d),px,1,.6,.6,.6,.6,g)});
  const gl=sprite('✨',.01);gl.visible=false; // helyfoglaló
  const lp=M(plane,MAT.glow,0,1.6,.6,4,3.2,1,g);lp.userData.glow=1;
  BOXES.push(s.side==='L'?[-44,s.z-4.7,-39.2,s.z+4.7]:[39.2,s.z-4.7,44,s.z+4.7])});
 // lobby-pont: világító gyűrű + tábla
 const ring=M(new THREE.RingGeometry(1.3,1.7,40),bas(0x4ade80,{transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}),LOBBY_PT.x,.06,LOBBY_PT.z);ring.rotation.x=-Math.PI/2;S._ring=ring;
 const ls=signTex('VISSZA A LOBBYBA','#14532d','#bbf7d0',1024,180,'🏠');const lpo=M(plane,bas(0xffffff,{map:ls,toneMapped:false,side:THREE.DoubleSide}),LOBBY_PT.x,3.9,LOBBY_PT.z-1.6,3.4,.6,1);
 // Harcba-kapu
 {const g=new THREE.Group();g.position.set(GATE.x,0,GATE.z);g.rotation.y=Math.PI/2;G.add(g);const st=lam(0x334155),gold=lam(0xf59e0b,{emissive:0x5a3300});
  [-2.4,2.4].forEach(px=>{M(box,st,px,2.6,0,1,5.2,1,g);M(box,gold,px,5.35,0,1.2,.3,1.2,g);M(box,gold,px,.15,0,1.3,.3,1.3,g)});M(box,st,0,5.8,0,6,.9,1.1,g);
  const ht=signTex('HARCBA','#7f1d1d','#fecaca',1024,200,'⚔️');M(plane,bas(0xffffff,{map:ht,toneMapped:false,side:THREE.DoubleSide}),0,5.8,.58,5.6,.85,1,g);
  const pt=cvTex(128,256,(x,w,h)=>{const gr=x.createRadialGradient(w/2,h/2,4,w/2,h/2,h/2);gr.addColorStop(0,'rgba(255,240,200,1)');gr.addColorStop(.4,'rgba(255,90,60,.8)');gr.addColorStop(1,'rgba(120,0,60,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)});
  S._portal=M(plane,bas(0xffffff,{map:pt,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}),0,2.6,0,3.8,5.2,1,g);
  BOXES.push([GATE.x-.6,GATE.z-2.95,GATE.x+.6,GATE.z-1.85],[GATE.x-.6,GATE.z+1.85,GATE.x+.6,GATE.z+2.95])}
 // ütközők a lobby3d2/lobby tárgyaihoz
 CIRC.push([0,23,4.9]);
 for(let i=0;i<5;i++){BOXES.push([-22.65,-.5+i*6.2-1.8,-21.35,-.5+i*6.2+1.8],[-30.15,1.6+i*6.2-1.8,-28.85,1.6+i*6.2+1.8])}
 BOXES.push([20,-9.8,24,22.6],[27,-9.8,31,22.6],[-10.1,37.2,-5.9,39.2],[3.9,37.2,8.1,39.2],[-34.8,-8.1,-32.8,-3.9],[-34.8,21.9,-32.8,26.1],[32.8,27.9,34.8,32.1],
  [-15.5,-31.5,6.2,-19],[-13.6,-17.6,-.3,-13.9],[7,-18.2,14,-14.8]);
 [-22.3,-12.7,-18.8,-15.2].forEach(x=>CIRC.push([x,37.8,.45]));
}

function floorTex(k,c){return cvTex(256,256,(x,w,h)=>{x.fillStyle=c[0];x.fillRect(0,0,w,h);
 if(k==='tiles'||k==='disco'){for(let i=0;i<4;i++)for(let j=0;j<4;j++){if((i+j)%2){x.fillStyle=c[1];x.fillRect(i*64,j*64,64,64)}}x.strokeStyle='rgba(0,0,0,.2)';for(let i=0;i<=4;i++){x.strokeRect(i*64,0,0,h);x.strokeRect(0,i*64,w,0)}}
 else if(k==='wood'){for(let i=0;i<8;i++){x.fillStyle=i%2?c[1]:c[0];x.fillRect(0,i*32,w,32);x.fillStyle='rgba(0,0,0,.15)';x.fillRect((i*97)%w,i*32,3,32);x.fillRect(0,i*32+31,w,1)}}
 else if(k==='carpet'){x.strokeStyle=c[1];x.lineWidth=6;for(let i=0;i<4;i++)for(let j=0;j<4;j++){x.beginPath();x.arc(32+i*64,32+j*64,22,0,7);x.stroke();x.fillStyle=c[1];x.fillRect(28+i*64,28+j*64,8,8)}}
 else {for(let i=0;i<400;i++){x.fillStyle='rgba(0,0,0,'+(Math.random()*.08)+')';x.fillRect(Math.random()*w,Math.random()*h,3,3)}x.strokeStyle='rgba(0,0,0,.15)';x.strokeRect(0,0,w,h)}})}

const RW=7,RD=6,RH=5;
function buildRoom(s,i){const O=new THREE.Vector3(600+i*40,0,0);const g=new THREE.Group();g.position.copy(O);g.visible=false;g.userData.room=1;G.add(g);
 const R={s,g,O,boxes:[],pts:[]};
 const ft=floorTex(s.floor,s.fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(4,3);const f=M(plane,lam(0xffffff,{map:ft}),0,0,0,RW*2,RD*2,1,g);f.rotation.x=-Math.PI/2;
 const wm=lam(s.wall),dark=lam(0x1f2937);
 M(box,wm,0,RH/2,-RD-.15,RW*2+.6,RH,.3,g);M(box,wm,-RW-.15,RH/2,0,.3,RH,RD*2,g);M(box,wm,RW+.15,RH/2,0,.3,RH,RD*2,g);
 [-1,1].forEach(sx=>M(box,wm,sx*(RW+1.7)/2*1,RH/2,RD+.15,RW-1.7+.3,RH,.3,g));M(box,wm,0,RH-.6,RD+.15,3.4,1.2,.3,g);
 const c=M(plane,lam(0x111827),0,RH,0,RW*2,RD*2,1,g);c.rotation.x=Math.PI/2;
 M(box,dark,0,.1,-RD+.02,RW*2,.2,.1,g); // lábazat
 // mennyezeti lámpák (emisszív panelek)
 inst(box,[[-3.5,RH-.05,-2,2.4,.08,.8,0,'#fffbe6'],[3.5,RH-.05,-2,2.4,.08,.8,0,'#fffbe6'],[-3.5,RH-.05,3,2.4,.08,.8,0,'#fffbe6'],[3.5,RH-.05,3,2.4,.08,.8,0,'#fffbe6']],g,MAT.lampM);
 // kijárat
 const dt=cvTex(128,256,(x,w,h)=>{const gr=x.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#fde68a');gr.addColorStop(1,'#93c5fd');x.fillStyle=gr;x.fillRect(0,0,w,h);x.fillStyle='#1f2937';x.fillRect(w/2-3,0,6,h)});
 M(plane,bas(0xffffff,{map:dt}),0,1.9,RD-.02,3.2,3.8,1,g,Math.PI);
 const ex=signTex('KIJÁRAT','#14532d','#86efac',512,128);M(plane,bas(0xffffff,{map:ex,toneMapped:false}),0,4.1,RD-.05,1.8,.45,1,g,Math.PI);
 // falitábla a pult mögött
 const nt=signTex(s.nm,s.c1||'#111827',s.c2||s.acc,1024,200,s.ic);M(plane,bas(0xffffff,{map:nt,toneMapped:false}),0,3.6,-RD+.02,6.5,1.25,1,g);
 // pult + pultos
 const ctrM=lam(s.theme==='hiv'?0x78716c:s.theme==='sot'?0x111111:0x7c4a1e);M(box,ctrM,0,.55,-3.2,5.4,1.1,1,g);M(box,lam(s.acc),0,1.13,-3.2,5.6,.08,1.15,g);M(box,lam(0xffffff,{emissive:s.acc,emissiveIntensity:.5}),0,.55,-2.68,5.2,.12,.02,g);
 R.boxes.push([-2.8,-3.8,2.8,-2.6]);
 try{if(typeof person==='function'){const n=person(s.npc[0],s.npc[1],1.0);n.children.forEach(ch=>{if(ch.isSprite){ch.scale.multiplyScalar(.38);ch.position.y=2.85}});n.position.set(0,.3,-4.4);g.add(n);R.npc=n}}catch(e){}
 const tag=signTex(s.npc[2],'#0b1022','#fde68a',512,96);const tg=M(plane,bas(0xffffff,{map:tag,transparent:true,toneMapped:false}),0,2.95,-4.4,1.7,.32,1,g);
 // polcok a hátsó falon és az oldalfalakon + áruk
 const goods=[],shel=[];const em=EMO[s.theme];
 const shelf=(x,z,ry,w)=>{const cs=Math.cos(ry),sn=Math.sin(ry);const P=(lx,y,lz)=>[x+lx*cs+lz*sn,y,z-lx*sn+lz*cs];
  [[-w/2,0],[w/2,0]].forEach(([lx])=>{const p=P(lx,1.4,0);shel.push([p[0],1.4,p[2],.1,2.8,.6,ry,'#3f2a1c'])});
  for(let k=0;k<4;k++){const p=P(0,.3+k*.75,0);shel.push([p[0],p[1],p[2],w,.06,.6,ry,'#5b3b24'])}
  const pal=['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#14b8a6','#f8fafc'];
  for(let k=0;k<4;k++)for(let j=0;j<Math.floor(w/.45);j++){const lx=-w/2+.3+j*.45;const p=P(lx,.3+k*.75+.2,0);goods.push([p[0],p[1],p[2],.28,.34+((j*7+k*3)%3)*.06,.32,ry,pal[(j*3+k*5+i)%pal.length]])}
  const sp=sprite(em[(((i+Math.round(x+z))%em.length)+em.length)%em.length],.7);const p2=P(0,3.3,0);sp.position.set(p2[0],p2[1],p2[2]);g.add(sp)};
 shelf(-4.8,-5.55,0,3.2);shelf(4.8,-5.55,0,3.2);shelf(-6.65,-.5,Math.PI/2,4);shelf(6.65,-.5,-Math.PI/2,4);
 R.boxes.push([-6.5,-6,-3.1,-5.1],[3.1,-6,6.5,-5.1],[-7,-2.7,-6.2,1.7],[6.2,-2.7,7,1.7]);
 if(s.theme!=='gar'&&s.theme!=='sot')inst(box,shel,g,MAT.shelfM);else inst(box,shel.map(q=>(q[7]='#4b5563',q)),g,MAT.shelfM);
 inst(box,goods,g,MAT.goodsM);
 // szőnyeg a bejáratnál
 const rug=M(plane,lam(new THREE.Color(s.acc).multiplyScalar(.6).getHex()),0,.02,3.8,3,2.2,1,g);rug.rotation.x=-Math.PI/2;
 THEME[s.theme](g,R,s);
 R.exit={x:0,z:5,r:1.5};R.ctr={x:0,z:-1.9,r:1.6};if(s.alt)R.alt={x:5,z:3.2,r:1.5};
 ROOMS[s.id]=R;return R}

// témánként egyedi berendezés
const THEME={
 cas(g,R){const gm=lam(0x14532d),gold=lam(0xf59e0b,{emissive:0x4a2a00});
  for(let k=0;k<4;k++){const x=-5+k*0;const z=-1.5+k*1.6;M(box,lam(0x7f1d1d),-5,.9,z,1,1.8,.9,g);const scr=M(plane,MAT.slotM,-4.49,1.25,z,.7,.55,1,g,Math.PI/2);M(sph,gold,-5,1.95,z,.25,.25,.25,g)}
  R.boxes.push([-5.6,-2.1,-4.4,3.3]);
  const t=M(cyl,gm,3.4,.85,1.4,1.6,.12,1.6,g);M(cyl,lam(0x3f2a1c),3.4,.42,1.4,1.65,.8,1.65,g);const wh=M(cyl,lam(0x111827),3.4,.95,1.4,.6,.06,.6,g);S._wheel=wh;R.boxes.push([1.7,-.3,5.1,3.1]);
  const chips=[];for(let k=0;k<14;k++)chips.push([2.4+(k%5)*.5,.95,.9+Math.floor(k/5)*.4,.12,.03+(k%3)*.04,.12,0,['#ef4444','#22c55e','#3b82f6','#f8fafc'][k%4]]);inst(cyl,chips,g)},
 gar(g,R){const car=(x,z,c,ry)=>{const gg=new THREE.Group();gg.position.set(x,0,z);gg.rotation.y=ry;g.add(gg);M(box,lam(c),0,.6,0,1.9,.7,4,gg);M(box,MAT.glass,0,1.2,-.2,1.6,.55,2,gg);[[-.95,1.3],[.95,1.3],[-.95,-1.3],[.95,-1.3]].forEach(([a,b])=>{const w=M(cyl,lam(0x111111),a,.36,b,.7,.3,.7,gg);w.rotation.z=Math.PI/2})};
  car(-4,1.5,0xdc2626,.3);car(4,1.5,0x2563eb,-.3);R.boxes.push([-5.6,-.8,-2.4,3.8],[2.4,-.8,5.6,3.8]);
  const lift=lam(0xfacc15);M(box,lift,-4,.05,1.5,2.6,.1,4.4,g);M(box,lift,4,.05,1.5,2.6,.1,4.4,g);
  const tools=[];for(let k=0;k<10;k++)tools.push([-6.85,1.6+(k%3)*.5,-2.2+k*.42,.05,.4,.1,0,'#9ca3af']);inst(box,tools,g)},
 kp(g,R){const tk=cvTex(1024,128,(x,w,h)=>{x.fillStyle='#020617';x.fillRect(0,0,w,h);x.font='700 54px monospace';x.textBaseline='middle';const it=['TÉGLA +3.2%','KÖZCOIN -1.4%','BETON +0.8%','HÍDÉPÍT +5.1%','LUFI -2.2%'];let X=10;it.forEach((s,i)=>{x.fillStyle=s.includes('-')?'#f87171':'#4ade80';x.fillText(s,X,h/2);X+=s.length*31+40})});
  tk.wrapS=THREE.RepeatWrapping;S._ticker=tk;M(plane,bas(0xffffff,{map:tk,toneMapped:false}),0,2.55,-RD+.03,12,.6,1,g);
  const ch=cvTex(256,128,(x,w,h)=>{x.fillStyle='#0b1022';x.fillRect(0,0,w,h);x.strokeStyle='#22d3ee';x.lineWidth=5;x.beginPath();for(let i=0;i<=16;i++){const y=h*.8-i*4-Math.sin(i*1.3)*14;i?x.lineTo(i*16,y):x.moveTo(0,y)}x.stroke()});
  [-3,3].forEach(px=>{M(box,lam(0x334155),px,.75,1.2,2.2,.08,1.2,g);M(box,lam(0x1e293b),px,.37,1.2,.2,.74,.2,g);M(plane,bas(0xffffff,{map:ch}),px,1.25,.9,1,.55,1,g)});R.boxes.push([-4.2,.5,-1.8,1.9],[1.8,.5,4.2,1.9])},
 sot(g,R){const cr=[];for(let k=0;k<9;k++)cr.push([-5+(k%3)*1.05,.45+Math.floor(k/3)*.9,2.5,1,.88,1,(k*.2)%.4,'#78350f']);inst(box,cr,g,MAT.shelfM);R.boxes.push([-5.6,2,-2.4,3]);
  const nn=signTex('NEM LÁTTÁL','#3b0764','#e879f9',512,128);M(plane,bas(0xffffff,{map:nn,toneMapped:false,transparent:true}),6.83,3,2.5,2.4,.6,1,g,-Math.PI/2);
  M(box,lam(0x1f2937),4,.4,2.5,1.6,.8,1,g);M(box,lam(0x065f46),4,.82,2.5,.6,.05,.35,g);R.boxes.push([3.1,1.9,4.9,3.1])},
 hiv(g,R){const q=cvTex(256,128,(x,w,h)=>{x.fillStyle='#111';x.fillRect(0,0,w,h);x.fillStyle='#ef4444';x.font='900 80px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('A-047',w/2,h/2)});M(plane,bas(0xffffff,{map:q,toneMapped:false}),-5,3.2,-RD+.03,1.6,.8,1,g);
  const ch=[];for(let k=0;k<5;k++){ch.push([-4+k*2,.45,2.4,.6,.08,.6,0,'#1d4ed8']);ch.push([-4+k*2,.8,2.68,.6,.6,.06,0,'#1d4ed8'])}inst(box,ch,g);R.boxes.push([-4.5,2,4.5,3]);
  const pp=[];for(let k=0;k<8;k++)pp.push([-1.6+k*.45,1.2+(k%2)*.05,-3.2,.35,.04+(k%3)*.05,.45,0,'#f8fafc']);inst(box,pp,g);M(cyl,lam(0x7f1d1d),1.8,1.25,-3.1,.12,.2,.12,g)},
 ruh(g,R){const cl=[];[-3.5,3.5].forEach(px=>{M(cyl,lam(0x9ca3af),px,1.7,1.5,.05,3,.05,g).rotation.z=Math.PI/2;for(let k=0;k<7;k++)cl.push([px-1.3+k*.43,1.15,1.5,.35,1,.08,0,['#f472b6','#60a5fa','#facc15','#34d399','#f87171','#a78bfa','#fb923c'][k]])});inst(box,cl,g);
  [-1.6,1.6].forEach(px=>{try{const mn=person(px<0?0xf8fafc:0xfbcfe8,px<0?'🧍':'🧍‍♀️',.95);mn.position.set(px,.3,.4);mn.rotation.y=0;g.add(mn)}catch(e){}});R.boxes.push([-5,1.2,-2,1.8],[2,1.2,5,1.8],[-2,.0,-1.2,.8],[1.2,0,2,.8]);
  M(plane,MAT.glass,6.83,2.2,3.5,2,2.8,1,g,-Math.PI/2)},
 emo(g,R){const tiles=[];for(let a=0;a<5;a++)for(let b=0;b<4;b++)tiles.push([-2+a,.03,.2+b,.96,.04,.96,0,['#f472b6','#60a5fa','#facc15','#a78bfa'][(a+b)%4]]);S._disco=inst(box,tiles,g,MAT.discoM);
  const ball=M(sph,lam(0xe5e7eb,{emissive:0x666666}),0,4.2,1.6,.6,.6,.6,g);S._ball=ball;
  M(box,lam(0x111827),-5,.9,2.6,1,1.8,1,g);M(box,lam(0x111827),5,.9,2.6,1,1.8,1,g);R.boxes.push([-5.6,2,-4.4,3.2],[4.4,2,5.6,3.2])},
 kut(g,R){const bd=[];for(let k=0;k<3;k++)bd.push([-4+k*4,.12,2,1.4,.24,1,0,['#ef4444','#3b82f6','#22c55e'][k]]);inst(cyl,bd,g);
  const bl=[];for(let k=0;k<8;k++)bl.push([-5+k*1.3,.15,4.6-((k*3)%2),.3,.3,.3,0,['#facc15','#f97316','#22d3ee','#a3e635'][k%4]]);inst(sph,bl,g);
  try{if(typeof animal3d==='function'){[-4,4].forEach(px=>{const d=animal3d('dog',.8);d.position.set(px,.3,2);d.rotation.y=px<0?.6:-.6;g.add(d)})}}catch(e){}
  R.boxes.push([-4.8,1.4,-3.2,2.6],[3.2,1.4,4.8,2.6])},
 hir(g,R){const bt=cvTex(1024,512,(x,w,h)=>{x.fillStyle='#92400e';x.fillRect(0,0,w,h);x.fillStyle='#b45309';x.fillRect(16,16,w-32,h-32);
   const N=['Új kút a téren!','Heti verseny: fotó','Elveszett kutya: Bodri','Közgyűlés pénteken','Kampánylufi akció','Edzőpálya nyitva'];
   N.forEach((t,i)=>{const X=40+(i%3)*325,Y=40+Math.floor(i/3)*230;x.save();x.translate(X+140,Y+100);x.rotate((i%2?1:-1)*.04);x.fillStyle=['#fef9c3','#e0f2fe','#fce7f3'][i%3];x.fillRect(-140,-90,280,190);x.fillStyle='#111';x.font='700 30px Arial';x.textAlign='center';x.fillText(t,0,0,260);x.fillStyle='#dc2626';x.beginPath();x.arc(0,-78,9,0,7);x.fill();x.restore()})});
  M(plane,lam(0xffffff,{map:bt,emissive:0xffffff,emissiveMap:bt,emissiveIntensity:.25}),-6.83,2.3,1,6,3,1,g,Math.PI/2);
  M(box,lam(0x0e7490),5,.5,3.2,1.8,1,1,g);const kt=signTex('KÖZÖSSÉG+','#0e7490','#ecfeff',512,128,'🤝');M(plane,bas(0xffffff,{map:kt,toneMapped:false}),5,1.6,2.68,1.8,.45,1,g);R.boxes.push([4,2.6,6,3.8])}
};

function build(){if(S.built)return true;const L=window.LB3D;if(!L||!L.sc||typeof THREE==='undefined')return false;
 box=new THREE.BoxGeometry(1,1,1);plane=new THREE.PlaneGeometry(1,1);cyl=new THREE.CylinderGeometry(.5,.5,1,20);sph=new THREE.SphereGeometry(.5,16,12);
 const gt=cvTex(64,64,(x,w,h)=>{const g=x.createRadialGradient(w/2,h/2,2,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,230,160,.9)');g.addColorStop(1,'rgba(255,200,100,0)');x.fillStyle=g;x.fillRect(0,0,w,h)});
 const sl=cvTex(128,96,(x,w,h)=>{x.fillStyle='#111';x.fillRect(0,0,w,h);x.font='54px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🍒7🍋',w/2,h/2)});
 MAT={glow:bas(0xffffff,{map:gt,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}),lampM:lam(0xffffff,{emissive:0xfff3c4,emissiveIntensity:1}),shelfM:lam(0xffffff),goodsM:lam(0xffffff),
  slotM:bas(0xffffff,{map:sl,toneMapped:false}),glass:new THREE.MeshStandardMaterial({color:0x93c5fd,metalness:.6,roughness:.15,transparent:true,opacity:.6}),discoM:lam(0xffffff,{emissive:0x333333})};
 G=new THREE.Group();G.name='setal';G.visible=false;L.sc.add(G);
 buildOutside();SHOPS.forEach((s,i)=>buildRoom(s,i));S.built=true;return true}

// ---------- UI ----------
let UI={};
function ui(){if(UI.root)return;const st=document.createElement('style');st.textContent=`
#stlUI{position:fixed;inset:0;pointer-events:none;z-index:60;display:none;font-family:Rajdhani,Arial,sans-serif}
#stlUI.on{display:block}
#stlTop{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#0b1022d9;border:1px solid #ffffff26;border-radius:14px;padding:7px 18px;color:#fde68a;font:900 22px 'Luckiest Guy',Impact,Arial;letter-spacing:.5px;text-shadow:0 2px 0 #0008;white-space:nowrap}
#stlE{position:absolute;bottom:120px;left:50%;transform:translateX(-50%);background:#0b1022e6;border:2px solid #fde68a;border-radius:14px;padding:9px 18px;color:#fff;font:700 19px Rajdhani,Arial;display:none;white-space:nowrap}
#stlE b{display:inline-block;background:#fde68a;color:#0b1022;border-radius:6px;padding:0 8px;margin-right:8px;font-size:18px}
#stlMap{position:absolute;right:14px;bottom:14px;width:180px;height:180px;border-radius:14px;border:2px solid #ffffff33;background:#0b1022cc}
#stlHelp{position:absolute;left:14px;bottom:14px;background:#0b1022cc;border:1px solid #ffffff22;border-radius:12px;padding:8px 12px;color:#cbd5e1;font:600 14px Rajdhani,Arial;line-height:1.45}
#stlCap2{position:absolute;top:60px;left:50%;transform:translateX(-50%);background:#14532de6;color:#fff;border-radius:10px;padding:6px 14px;font:700 16px Rajdhani,Arial;display:none}
#stlFade{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .25s;z-index:61}
#stlMenu{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#0b1022f2;border:2px solid #fde68a55;border-radius:18px;padding:18px 22px;display:none;pointer-events:auto;min-width:280px;text-align:center}
#stlMenu h3{margin:0 0 10px;color:#fde68a;font:900 26px 'Luckiest Guy',Impact}
#stlMenu button{display:block;width:100%;margin:7px 0;padding:10px;border:0;border-radius:10px;font:800 18px Rajdhani,Arial;cursor:pointer;background:#1e293b;color:#e2e8f0}
#stlMenu button:hover{background:#334155}#stlMenu button.y{background:#fde68a;color:#0b1022}#stlMenu button.r{background:#b91c1c;color:#fff}
#stlBtn{position:fixed;left:14px;bottom:250px;z-index:30;border:2px solid #fde68a;background:#0b1022d9;color:#fde68a;border-radius:12px;padding:7px 12px;font:900 16px 'Luckiest Guy',Impact,Arial;cursor:pointer;display:none}
#stlBtn:hover{background:#1e293b}`;document.head.appendChild(st);
 const r=document.createElement('div');r.id='stlUI';r.innerHTML='<div id="stlTop">📍 Közpénz tér</div><div id="stlCap2"></div><div id="stlE"></div><canvas id="stlMap" width="180" height="180"></canvas><div id="stlHelp"><b style="color:#fde68a">🚶 SÉTA</b> · WASD mozgás · Shift futás · Szóköz ugrás<br>Egér: nézelődés (kattints a képre) · E: belépés · Esc: menü</div>'+
  '<div id="stlMenu"><h3>🚶 SÉTA</h3><button class="y" data-a="go">▶ Folytatás</button><button data-a="lobby">🏠 Vissza a lobbyba</button><button class="r" data-a="fight">⚔️ Harcba</button></div>';document.body.appendChild(r);
 const fd=document.createElement('div');fd.id='stlFade';document.body.appendChild(fd);
 const b=document.createElement('button');b.id='stlBtn';b.textContent='🚶 SÉTA';b.title='Kisétálás a Közpénz térre (/setal)';b.onclick=()=>toggle();document.body.appendChild(b);
 UI={root:r,top:$('stlTop'),e:$('stlE'),map:$('stlMap'),menu:$('stlMenu'),fade:fd,btn:b,cap2:$('stlCap2')};
 UI.menu.querySelectorAll('button').forEach(x=>x.onclick=()=>{const a=x.dataset.a;menu(false);if(a==='lobby')exit();if(a==='fight')fight()});
 setInterval(()=>{UI.btn.style.display=lbOn()&&!S.on&&!document.querySelector('#cs.on,#vs2.on,#pets.on,#outf.on,#gui.on')?'block':'none'},500)}
let c2T=0;function showCap2(t){if(!UI.cap2||!S.on){try{const tt=window.toast;if(typeof tt==='function')return tt(t)}catch(e){}return}UI.cap2.textContent=t;UI.cap2.style.display='block';clearTimeout(c2T);c2T=setTimeout(()=>UI.cap2.style.display='none',2600)}
function menu(on){S.menu=on;UI.menu.style.display=on?'block':'none';if(on){S.keys={};try{document.exitPointerLock()}catch(e){}}}

// minitérkép
let mapBg=null;const MX=x=>90+x*1.95,MZ=z=>90+(z-4)*1.95;
function drawMapBg(){mapBg=document.createElement('canvas');mapBg.width=mapBg.height=180;const x=mapBg.getContext('2d');
 x.fillStyle='#14532d';x.fillRect(0,0,180,180);x.fillStyle='#9ca3af';x.fillRect(MX(-40),MZ(-33),80*1.95,73*1.95);
 x.fillStyle='#374151';x.fillRect(MX(-39),MZ(-30),7*1.95,64*1.95);x.fillRect(MX(32),MZ(-30),7*1.95,64*1.95);x.fillRect(MX(-40),MZ(33),80*1.95,6*1.95);
 x.fillStyle='#1d4ed8';x.beginPath();x.arc(MX(0),MZ(23),4.5*1.95,0,7);x.fill();x.fillStyle='#64748b';x.fillRect(MX(-15.5),MZ(-31),21.7*1.95,12*1.95);
 x.font='15px serif';x.textAlign='center';x.textBaseline='middle';
 SHOPS.forEach(s=>{x.fillStyle=s.acc;x.fillRect(MX(s.x)-8,MZ(s.z)-8,16,16);x.fillText(s.ic,MX(s.x),MZ(s.z))});
 x.fillStyle='#4ade80';x.fillText('🏠',MX(0),MZ(0));x.fillText('⚔️',MX(GATE.x),MZ(GATE.z))}
function drawMap(){const c=UI.map.getContext('2d');if(S.zone!=='out'){c.fillStyle='#0b1022';c.fillRect(0,0,180,180);const s=ROOMS[S.zone].s;c.font='54px serif';c.textAlign='center';c.textBaseline='middle';c.fillText(s.ic,90,72);c.fillStyle='#fde68a';c.font='700 15px Rajdhani,Arial';c.fillText(s.nm,90,128,170);c.fillStyle='#94a3b8';c.fillText('E a pultnál · kijárat hátul',90,150,170);return}
 if(!mapBg)drawMapBg();c.drawImage(mapBg,0,0);const px=MX(S.pos.x),pz=MZ(S.pos.z);c.save();c.translate(px,pz);c.rotate(-S.head+Math.PI);c.fillStyle='#fde047';c.strokeStyle='#000';c.lineWidth=1.5;c.beginPath();c.moveTo(0,-7);c.lineTo(5,5);c.lineTo(0,2);c.lineTo(-5,5);c.closePath();c.fill();c.stroke();c.restore()}

// ---------- BELÉPÉS / KILÉPÉS ----------
const hidden=[];let savedL=null;
function hideUI(){hidden.length=0;const vis=e=>{if(!e||e===UI.root||e===UI.fade||e.tagName==='SCRIPT'||e.tagName==='STYLE'||e.tagName==='LINK')return false;const cs=getComputedStyle(e);return cs.display!=='none'&&cs.visibility!=='hidden'};
 [...document.body.children].forEach(e=>{if(e.id==='lb'||!vis(e))return;hidden.push([e,e.style.visibility]);e.style.visibility='hidden'});
 [...$('lb').children].forEach(e=>{if(e.id==='lbCv'||!vis(e))return;hidden.push([e,e.style.visibility]);e.style.visibility='hidden'})}
function showUI(){hidden.forEach(([e,v])=>{e.style.visibility=v});hidden.length=0}
function enter(){const L=window.LB3D;if(!lbOn())return '⚠ A séta csak a lobbyból indítható.';if(!build())return '⚠ A lobby 3D még nem töltött be.';ui();
 const C=window._x14e&&_x14e.cam;savedL={rotY:L.rotY,me:L.me&&{p:L.me.position.clone(),r:L.me.rotation.y},dog:L.dog&&{p:L.dog.position.clone(),r:L.dog.rotation.y},cam:{p:L.cam.position.clone(),q:L.cam.quaternion.clone()},C:C&&{yaw:C.yaw,pitch:C.pitch,zoom:C.zoom}};
 if(C){C.yaw=0;C.pitch=0;C.zoom=1;C.act=false}
 try{document.querySelectorAll('#lbChat.on').forEach(e=>e.classList.remove('on'))}catch(e){}
 const sv=LS.g('k3setal');S.zone='out';S.pos={x:0,y:0,z:4};S.yaw=Math.PI;S.head=0;
 if(sv&&typeof sv.x==='number'){if(sv.zone!=='out'&&ROOMS[sv.zone])S.zone=sv.zone;S.pos={x:sv.x,y:0,z:sv.z};S.yaw=sv.yaw||0;S.head=sv.head||0}
 S.on=true;S.paused=false;S.vy=0;S.keys={};G.visible=true;showZone();hideUI();UI.root.classList.add('on');document.body.classList.add('setalOn');
 const i=L.fx.indexOf(step);if(i>=0)L.fx.splice(i,1);L.fx.push(step);
 fadeIn();return '🚶 Séta mód – WASD, Shift, Szóköz, E, Esc. Vissza: /setal vagy a 🏠 pont.'}
function save(){if(!S.on)return;LS.s('k3setal',{zone:S.zone,x:+S.pos.x.toFixed(2),z:+S.pos.z.toFixed(2),yaw:+S.yaw.toFixed(3),head:+S.head.toFixed(3)})}
function exit(){if(!S.on)return;save();const L=window.LB3D;S.on=false;menu(false);try{document.exitPointerLock()}catch(e){}
 G.visible=false;Object.values(ROOMS).forEach(r=>r.g.visible=false);try{if(window._l3d&&_l3d.g)_l3d.g.visible=localStorage.getItem('k3lobby3d2')!=='0'}catch(e){}if(L&&L.sc.fog&&S._fog){L.sc.fog.near=S._fog[0];L.sc.fog.far=S._fog[1]}UI.root.classList.remove('on');document.body.classList.remove('setalOn');showUI();
 if(L&&savedL){L.rotY=savedL.rotY;if(L.me&&savedL.me){L.me.position.copy(savedL.me.p);L.me.rotation.y=savedL.me.r;const lb=limbsOf(L.me);['larm','rarm','lleg','rleg'].forEach(k=>{if(lb[k])lb[k].rotation.x=0})}
  if(L.dog&&savedL.dog){L.dog.position.copy(savedL.dog.p);L.dog.rotation.y=savedL.dog.r}L.cam.position.copy(savedL.cam.p);L.cam.quaternion.copy(savedL.cam.q);
  const C=window._x14e&&_x14e.cam;if(C&&savedL.C){C.yaw=savedL.C.yaw;C.pitch=savedL.C.pitch;C.zoom=savedL.C.zoom}}
 const i=L?L.fx.indexOf(step):-1;if(i>=0)L.fx.splice(i,1);return '🏠 Vissza a lobbyban.'}
function toggle(){return S.on?exit():enter()}
function fight(){exit();setTimeout(()=>{const b=$('lbGo');if(b)b.click()},150)}
function fadeIn(){UI.fade.style.opacity='1';setTimeout(()=>UI.fade.style.opacity='0',60)}
function trans(f){if(S.trans)return;S.trans=1;UI.fade.style.opacity='1';setTimeout(()=>{try{f()}catch(e){}S.trans=0;UI.fade.style.opacity='0'},260)}
function showZone(){// a kinti tér a szobában rejtve (olcsóbb); a lobby3d2 csoport is
 const out=S.zone==='out';G.children.forEach(c=>{if(!c.userData.room)c.visible=out});Object.values(ROOMS).forEach(r=>r.g.visible=r.s.id===S.zone);
 try{if(window._l3d&&_l3d.g)_l3d.g.visible=out&&(localStorage.getItem('k3lobby3d2')!=='0')}catch(e){}
 const L=window.LB3D;if(L&&L.sc.fog){if(!S._fog)S._fog=[L.sc.fog.near,L.sc.fog.far];L.sc.fog.near=out?S._fog[0]:60;L.sc.fog.far=out?S._fog[1]:200}}
function goRoom(id){const R=ROOMS[id];trans(()=>{S.zone=id;S.pos={x:0,y:0,z:4.2};S.head=Math.PI;S.yaw=0;S.pitch=.42;showZone();save()})}
function leaveRoom(){const s=ROOMS[S.zone].s;trans(()=>{S.zone='out';const o=outPt(s);S.pos={x:o.x,y:0,z:o.z};S.head=o.h;S.yaw=o.h+Math.PI;showZone();save()})}
function outPt(s){if(s.side==='L')return{x:-36.6,z:s.z,h:Math.PI/2};if(s.side==='R')return{x:36.6,z:s.z,h:-Math.PI/2};return{x:s.x,z:s.z-1.8,h:Math.PI}}
function useCounter(alt){const s=ROOMS[S.zone].s;S.paused=true;S.keys={};try{document.exitPointerLock()}catch(e){}
 const f=alt?s.alt.fn:s.fn;call(f,alt?s.alt.nm:s.nm);setTimeout(()=>{S.paused=false},400)}

// nyitott bolt-panel/overlay felismerése: nagy, látható, fix elem (nem a lobby és nem a séta UI) -> a séta billentyűi szünetelnek
function blocker(){const W=innerWidth*innerHeight;for(const e of document.body.children){if(e.id==='lb'||e.id==='stlUI'||e.id==='stlFade'||e.tagName==='SCRIPT'||e.tagName==='STYLE'||hidden.some(h=>h[0]===e))continue;
 const cs=getComputedStyle(e);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity<.05||cs.pointerEvents==='none')continue;const r=e.getBoundingClientRect();if(r.width*r.height>W*.25)return e.id||e.className||'panel'}return null}
// ---------- MOZGÁS ----------
function limbsOf(m){if(m.userData.limbs)return m.userData.limbs;const o={};m.traverse(c=>{if(c.userData&&c.userData.limb)o[c.userData.limb]=c});return m.userData.limbs=o}
function collide(p,r){const out=S.zone==='out';
 if(out){p.x=Math.max(-40.3,Math.min(40.3,p.x));p.z=Math.max(-33,Math.min(40.4,p.z))}else{p.x=Math.max(-RW+r,Math.min(RW-r,p.x));p.z=Math.max(-RD+r,Math.min(RD-r,p.z))}
 const list=out?BOXES:ROOMS[S.zone].boxes;
 for(const b of list){if(p.x>b[0]-r&&p.x<b[2]+r&&p.z>b[1]-r&&p.z<b[3]+r){const dl=p.x-(b[0]-r),dr=(b[2]+r)-p.x,dt=p.z-(b[1]-r),db=(b[3]+r)-p.z,m=Math.min(dl,dr,dt,db);
  if(m===dl)p.x=b[0]-r;else if(m===dr)p.x=b[2]+r;else if(m===dt)p.z=b[1]-r;else p.z=b[3]+r}}
 if(out)for(const c of CIRC){const dx=p.x-c[0],dz=p.z-c[1],d=Math.hypot(dx,dz),rr=c[2]+r;if(d<rr&&d>1e-4){p.x=c[0]+dx/d*rr;p.z=c[1]+dz/d*rr}}}
function nearest(){let best=null;const P=S.pos;const t=(o,r,label,act,ic)=>{const d=Math.hypot(P.x-o.x,P.z-o.z);if(d<r&&(!best||d<best.d))best={d,label,act,ic}};
 if(S.zone==='out'){SHOPS.forEach(s=>t(outPt(s),2.6,'Belépés: '+s.nm,()=>goRoom(s.id),s.ic));t(LOBBY_PT,1.9,'Vissza a lobbyba',()=>trans(()=>exit()),'🏠');t({x:GATE.x+1.3,z:GATE.z},2.6,'Harcba! (meccs indítása)',fight,'⚔️')}
 else{const R=ROOMS[S.zone];t(R.exit,R.exit.r,'Kilépés a térre',leaveRoom,'🚪');t(R.ctr,R.ctr.r,R.s.nm+' – '+R.s.npc[2],()=>useCounter(false),R.s.ic);if(R.alt)t(R.alt,R.alt.r,R.s.alt.nm,()=>useCounter(true),'🤝')}
 return best}
function locName(){if(S.zone!=='out'){const s=ROOMS[S.zone].s;return s.ic+' '+s.nm}let b=null,bd=1e9;SHOPS.forEach(s=>{const o=outPt(s),d=Math.hypot(S.pos.x-o.x,S.pos.z-o.z);if(d<bd){bd=d;b=s}});
 if(Math.hypot(S.pos.x,S.pos.z-23)<9)return '⛲ Közpénz tér – díszkút';if(Math.hypot(S.pos.x-GATE.x,S.pos.z-GATE.z)<6)return '⚔️ Harcba-kapu';if(Math.hypot(S.pos.x,S.pos.z)<5)return '🏠 Lobby-pont';
 if(bd<9)return '📍 '+b.ic+' '+b.nm+' előtt';if(S.pos.x<-19&&S.pos.x>-32&&S.pos.z>-4&&S.pos.z<33)return '🍎 Piac';if(S.pos.x>19&&S.pos.x<32&&S.pos.z<23)return '🅿️ Parkoló';if(S.pos.z>33)return '🛣️ Hátsó utca';return '📍 Közpénz tér'}

let lastT=0,saveT=0,uiT=0;const _v=typeof THREE!=='undefined'?new THREE.Vector3():null,_t=typeof THREE!=='undefined'?new THREE.Vector3():null;
function step(t){if(!S.on)return;const L=window.LB3D;if(!L||!L.me)return;if(!lbOn()){return}
 const dt=Math.min(.05,Math.max(.001,lastT?t-lastT:.016));lastT=t;if(t-(S._bT||0)>.3||t<(S._bT||0)){S._bT=t;const b=blocker();if(b&&!S.blk){S.keys={};try{document.exitPointerLock()}catch(e){}}S.blk=b}
 const K=S.keys,act=!S.paused&&!S.menu&&!S.trans&&!S.blk;
 let fx=0,fz=0;if(act){if(K.w||K.arrowup)fz+=1;if(K.s||K.arrowdown)fz-=1;if(K.a||K.arrowleft)fx-=1;if(K.d||K.arrowright)fx+=1}
 const run=K.shift,sp=(run?8.5:4.6);let moving=false;
 if(fx||fz){const n=Math.hypot(fx,fz);fx/=n;fz/=n;const sy=Math.sin(S.yaw),cy=Math.cos(S.yaw);// előre = a kamerától el
  const dx=-sy*fz+cy*fx,dz=-cy*fz-sy*fx;S.pos.x+=dx*sp*dt;S.pos.z+=dz*sp*dt;const th=Math.atan2(dx,dz);let d=th-S.head;d=Math.atan2(Math.sin(d),Math.cos(d));S.head+=d*Math.min(1,dt*12);moving=true}
 if(act&&K[' ']&&S.pos.y<=0.001){S.vy=6.2}S.vy-=18*dt;S.pos.y=Math.max(0,S.pos.y+S.vy*dt);if(S.pos.y===0&&S.vy<0)S.vy=0;
 collide(S.pos,.45);
 const R=S.zone==='out'?null:ROOMS[S.zone],ox=R?R.O.x:0,oz=R?R.O.z:0;
 const me=L.me;me.position.set(ox+S.pos.x,.3+S.pos.y,oz+S.pos.z);L.rotY=S.head;me.rotation.y=S.head;
 S.walkT+=moving?dt*(run?13:8.5):0;const sw=moving?Math.sin(S.walkT)*(run?.9:.6):0;const lb=limbsOf(me);
 if(lb.larm)lb.larm.rotation.x=sw;if(lb.rarm)lb.rarm.rotation.x=-sw;if(lb.lleg)lb.lleg.rotation.x=-sw*.8;if(lb.rleg)lb.rleg.rotation.x=sw*.8;
 if(moving&&S.pos.y===0)me.position.y+=Math.abs(Math.sin(S.walkT))*.06;
 // kutya követ
 const dog=L.dog;if(dog){const tx=me.position.x-Math.sin(S.head)*.5+Math.cos(S.head)*1.5,tz=me.position.z-Math.cos(S.head)*.5-Math.sin(S.head)*1.5;
  if(Math.hypot(dog.position.x-tx,dog.position.z-tz)>12){dog.position.x=tx;dog.position.z=tz}const ddx=tx-dog.position.x,ddz=tz-dog.position.z,dd=Math.hypot(ddx,ddz);
  if(dd>.15){const k=Math.min(1,dt*(dd>3?5:3));dog.position.x+=ddx*k;dog.position.z+=ddz*k;dog.rotation.y=Math.atan2(ddx,ddz)}dog.position.y=.3+(dd>.3?Math.abs(Math.sin(t*12))*.12:0)}
 // kamera (harmadik személy)
 const dist=R?4.3:6.2;_t.set(me.position.x,me.position.y+1.9,me.position.z);
 let cx=_t.x+Math.sin(S.yaw)*Math.cos(S.pitch)*dist,cz=_t.z+Math.cos(S.yaw)*Math.cos(S.pitch)*dist,cyy=_t.y+Math.sin(S.pitch)*dist;
 if(R){cx=Math.max(ox-RW+.35,Math.min(ox+RW-.35,cx));cz=Math.max(oz-RD+.35,Math.min(oz+RD-.35,cz));cyy=Math.min(RH-.3,cyy)}
 L.cam.position.set(cx,Math.max(.5,cyy),cz);L.cam.up.set(0,1,0);L.cam.lookAt(_t);
 // animációk (anyag-paraméter, nincs új objektum)
 if(S._portal)S._portal.material.opacity=.65+Math.sin(t*3)*.25;if(S._ring)S._ring.material.opacity=.45+Math.sin(t*4)*.25;
 if(R){if(S._wheel&&R.s.id==='cas')S._wheel.rotation.y=t*2;if(S._ticker&&R.s.id==='kp')S._ticker.offset.x=(t*.05)%1;if(S._ball&&R.s.id==='emo'){S._ball.rotation.y=t;MAT.discoM.emissive.setHSL((t*.2)%1,.6,.25)}if(R.npc)R.npc.rotation.y=Math.atan2(S.pos.x,S.pos.z+4.4)*.6}
 // UI
 S.near=nearest();if(t-uiT>.12){uiT=t;UI.e.style.display=S.near&&!S.menu&&!S.blk?'block':'none';if(S.near)UI.e.innerHTML='<b>E</b>'+S.near.ic+' '+S.near.label;const ln=locName();if(UI.top._t!==ln){UI.top._t=ln;UI.top.textContent=ln}drawMap()}
 if(t-saveT>2){saveT=t;save()}}

// ---------- BEMENET ----------
const typing=e=>{const a=document.activeElement;return a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable)};
addEventListener('keydown',e=>{if(!S.on||typing(e))return;const k=e.key.toLowerCase();
 if(k==='escape'){if(S.blk||blocker())return;if(!document.pointerLockElement){menu(!S.menu);e.preventDefault();e.stopImmediatePropagation()}return}
 if(S.menu)return;
 if(['w','a','s','d','shift',' ','arrowup','arrowdown','arrowleft','arrowright','e'].includes(k)){
  // ha egy bolt-panel nyitva van (pl. #gui), a billentyű ne mozgasson
  if(S.paused||S.blk)return;S.keys[k]=true;e.preventDefault();e.stopImmediatePropagation();if(k==='e'&&!e.repeat&&S.near)S.near.act()}},true);
addEventListener('keyup',e=>{if(!S.on)return;S.keys[e.key.toLowerCase()]=false},true);
addEventListener('blur',()=>{S.keys={}});
document.addEventListener('pointerlockchange',()=>{if(!S.on)return;if(!document.pointerLockElement&&!S.paused&&!S.trans&&!S.blk&&!blocker()&&S._wasLocked)menu(true);S._wasLocked=!!document.pointerLockElement});
let drag=null;
addEventListener('pointerdown',e=>{if(!S.on||S.menu)return;const cvv=$('lbCv');if(e.target!==cvv)return;S.paused=false;drag={x:e.clientX,y:e.clientY};
 try{const p=cvv.requestPointerLock&&cvv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(er){}e.stopImmediatePropagation()},true);
addEventListener('pointerup',()=>{drag=null},true);
addEventListener('mousemove',e=>{if(!S.on||S.menu)return;let mx=0,my=0;if(document.pointerLockElement){mx=e.movementX;my=e.movementY}else if(drag){mx=e.clientX-drag.x;my=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY}}else return;
 S.yaw-=mx*.0042;S.pitch=Math.max(-.15,Math.min(1.1,S.pitch+my*.0035))},true);
addEventListener('wheel',e=>{if(S.on)e.stopImmediatePropagation()},{capture:true,passive:true});

// ---------- PARANCS + MENÜPONT ----------
const isCmd=c=>/^\/?(setal|séta|seta)\s*$/i.test(String(c||'').trim());
const doCmd=()=>{const r=toggle();return r};
['extraCmd'].forEach(k=>{const o=window[k];window[k]=function(c){if(isCmd(c))return doCmd();return o?o.apply(this,arguments):null}});
// a dev.js az extraCmd-t hívja; ha később valaki újra becsomagolja, az is minket hív. Lobby chat: /setal elkapása Enter előtt
addEventListener('keydown',e=>{if(e.key!=='Enter'||!e.target||e.target.tagName!=='INPUT')return;const v=e.target.value;if(/^\/(setal|séta|seta)\s*$/i.test(v.trim())){e.target.value='';e.preventDefault();e.stopImmediatePropagation();try{e.target.blur()}catch(x){}const r=doCmd();showCap2(r)}},true);
(function addMenu(){if(window._lb2&&_lb2.add){_lb2.add({ic:'🚶',hu:'Séta a téren',tx:'Séta a téren',c:'play',fn:()=>{try{_lb2.open&&_lb2.open(null)}catch(e){}setTimeout(()=>showCap2(enter()),50)},kw:'seta setal tér bolt mászkálás kint'});return}setTimeout(addMenu,800)})();
(function waitUI(){if(document.body)ui();else setTimeout(waitUI,300)})();

Object.assign(S,{enter,exit,toggle,goRoom,leaveRoom,fight,rooms:ROOMS,shops:SHOPS,boxes:BOXES});
S.menuOn=on=>menu(on);S.blocker=blocker;S.tp=(x,z)=>{S.pos.x=x;S.pos.z=z};S.use=alt=>useCounter(alt);
})();
