// ===== 3D ÁLLATOK + kiesési szövegbuborék =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const BM={};const bm=c=>BM[c]||(BM[c]=window.grayMat?grayMat('fleece',c,.35,.35,{roughness:.95}):new THREE.MeshStandardMaterial({color:c,roughness:.85,metalness:0}));
const BOX=new THREE.BoxGeometry(1,1,1);
function part(g,c,w,h,d,x,y,z,rx){const m=new THREE.Mesh(BOX,bm(c));m.scale.set(w,h,d);m.position.set(x,y,z);if(rx)m.rotation.x=rx;m.castShadow=true;g.add(m);return m}
// Állatmodellek (x = előre)
const A={
 cow:g=>{part(g,0xf5f5f4,2.2,1.1,1,0,1.5,0);part(g,0x1c1917,.7,.6,1.02,-.3,1.7,0);part(g,0x1c1917,.5,.5,1.02,.6,1.3,.0);part(g,0xf5f5f4,.8,.7,.7,1.4,1.9,0);part(g,0xf9a8d4,.35,.35,.6,1.85,1.75,0);part(g,0xe7e5e4,.12,.3,.12,1.35,2.35,.25);part(g,0xe7e5e4,.12,.3,.12,1.35,2.35,-.25);part(g,0xf9a8d4,.4,.2,.4,-.1,.95,0);legs(g,0xf5f5f4,.9,.35,1)},
 bison:g=>{part(g,0x4a2c17,2.4,1.4,1.3,0,1.7,0);part(g,0x2b1a0e,1.2,1.7,1.5,.7,1.9,0);part(g,0x2b1a0e,.8,.8,.8,1.6,1.6,0);part(g,0xd6d3d1,.12,.35,.12,1.7,2.15,.4);part(g,0xd6d3d1,.12,.35,.12,1.7,2.15,-.4);part(g,0x2b1a0e,.4,.5,.6,1.9,1.2,0);legs(g,0x2b1a0e,1,.4,1.2)},
 pig:g=>{part(g,0xf9a8d4,1.5,.9,.9,0,1,0);part(g,0xf9a8d4,.7,.7,.7,.95,1.15,0);part(g,0xec4899,.25,.3,.4,1.35,1.05,0);part(g,0xf472b6,.15,.25,.2,.95,1.6,.22);part(g,0xf472b6,.15,.25,.2,.95,1.6,-.22);legs(g,0xf9a8d4,.55,.25,.6)},
 sheep:g=>{part(g,0xfafaf9,1.5,1.1,1.1,0,1.2,0);part(g,0x292524,.55,.6,.55,.95,1.35,0);part(g,0xfafaf9,.7,.35,.75,.75,1.75,0);legs(g,0x292524,.6,.22,.7)},
 chicken:g=>{part(g,0xffffff,.6,.6,.5,0,.75,0);part(g,0xffffff,.35,.45,.35,.3,1.2,0);part(g,0xf59e0b,.2,.1,.15,.53,1.2,0);part(g,0xef4444,.15,.2,.1,.3,1.5,0);part(g,0xf59e0b,.06,.4,.06,0,.25,.12);part(g,0xf59e0b,.06,.4,.06,0,.25,-.12)},
 dog:g=>{const B=0x9a5520,D=0x3a210e,W=0xe8ddcc,K=0x111111;
  part(g,B,1.15,.55,.55,0,.98,0);part(g,D,.9,.12,.5,-.05,1.27,0);part(g,W,.4,.4,.5,.42,.86,0);
  part(g,B,.5,.5,.52,.78,1.32,0);part(g,W,.3,.26,.36,1.08,1.2,0);part(g,K,.1,.1,.14,1.24,1.27,0);part(g,0xd94a6a,.14,.04,.12,1.16,1.08,0);
  [.13,-.13].forEach(z=>{part(g,0xffffff,.04,.14,.13,1.04,1.43,z);part(g,0x2a1608,.05,.11,.09,1.055,1.42,z);part(g,K,.055,.06,.05,1.065,1.42,z);part(g,0xffffff,.03,.03,.03,1.075,1.45,z+.025);part(g,D,.04,.04,.15,1.04,1.53,z)});
  const e1=part(g,D,.12,.32,.22,.68,1.6,.22);e1.rotation.x=.35;const e2=part(g,D,.12,.32,.22,.68,1.6,-.22);e2.rotation.x=-.35;
  part(g,0xdc2626,.1,.12,.56,.5,1.12,0);part(g,0xfacc15,.06,.1,.08,.56,1.02,0);
  const t=part(g,B,.45,.1,.1,-.75,1.25,0);t.rotation.z=-.7;t.userData.tail=1;part(g,W,.14,.1,.11,-.92,1.42,0);
  [[.4,.22],[.4,-.22],[-.4,.22],[-.4,-.22]].forEach(([x,z])=>{const l=part(g,B,.16,.55,.16,x,.42,z);l.userData.leg=1;part(g,W,.18,.1,.2,x+.02,.05,z)})},
 horse:g=>{part(g,0x7c4a26,2.2,1,.9,0,2,0);part(g,0x7c4a26,.6,1.3,.6,1.15,2.6,0,-.4);part(g,0x7c4a26,.9,.45,.5,1.6,3.15,0);part(g,0x1c1917,1.1,.3,.15,.95,2.9,0,-.4);part(g,0x1c1917,.15,1,.15,-1.15,1.8,0);legs(g,0x5a3418,1.5,.25,.8)},
};
function legs(g,c,h,t,sp){[[sp,.32],[sp,-.32],[-sp,.32],[-sp,-.32]].forEach(([x,z])=>{const l=part(g,c,t,h,t,x*.85,h/2,z);l.userData.leg=1})}
window.animal3d=function(kind,scale){const g=new THREE.Group();(A[kind]||A.cow)(g);g.scale.setScalar(scale||1);g.userData.kind=kind;return g};
// Állatfejek a botoknak (az emoji helyett)
const HEAD={'🦊':[0xf97316,0xffffff,'ears'],'🐸':[0x4ade80,0x16a34a,'eyes'],'🐼':[0xffffff,0x111111,'round'],'🦁':[0xeab308,0xa16207,'mane'],'🐯':[0xf59e0b,0x111111,'ears'],'🐶':[0xc2864a,0x3f2a1a,'flop'],'🐷':[0xf9a8d4,0xec4899,'round']};
window.animalHead=function(em){const h=HEAD[em];if(!h)return null;const g=new THREE.Group();const[c1,c2,k]=h;
 if(k==='mane')part(g,c2,1.15,1.15,.5,0,0,-.1);
 part(g,c1,.8,.75,.75,0,0,0);part(g,0x111111,.12,.12,.05,-.18,.08,.39);part(g,0x111111,.12,.12,.05,.18,.08,.39);part(g,c2,.3,.22,.25,0,-.15,.45);
 if(k==='ears'||k==='mane'){part(g,c1,.22,.3,.12,-.28,.45,0);part(g,c1,.22,.3,.12,.28,.45,0)}
 if(k==='round'){part(g,c2,.25,.25,.12,-.32,.4,0);part(g,c2,.25,.25,.12,.32,.4,0)}
 if(k==='flop'){part(g,c2,.18,.45,.3,-.48,.0,0);part(g,c2,.18,.45,.3,.48,.0,0)}
 if(k==='eyes'){part(g,0xffffff,.25,.25,.25,-.22,.42,.15);part(g,0xffffff,.25,.25,.25,.22,.42,.15);part(g,0x111111,.1,.1,.05,-.22,.45,.29);part(g,0x111111,.1,.1,.05,.22,.45,.29)}
 return g};
// Csordák a pályán + egyszerű legelés/séta
const HERDS=[['bison',230,100,8],['cow',-220,40,6],['sheep',-110,-60,7],['pig',175,-55,5],['chicken',55,-85,6],['horse',-190,-80,4],['cow',110,140,5],['sheep',260,-20,6],['horse',-60,150,4],['bison',-260,-20,5],['pig',20,-150,4],['cow',140,-130,5]];
WP('launch',null,()=>{const g=G;if(!g||!g.arh)return;g.animals=[];
 // a régi emoji-bölények eltávolítása
 const rm=[];scene.children.forEach(o=>{if(o.isSprite&&o.material&&o.material.map&&o.userData.emo)rm.push(o)});rm.forEach(o=>scene.remove(o));
 HERDS.forEach(([k,cx,cz,n])=>{for(let i=0;i<n;i++){const x=cx+rnd(-14,14),z=cz+rnd(-10,10);if(!hin(x,z))continue;const a=animal3d(k,k==='chicken'?1:1.1);a.position.set(x,0,z);scene.add(a);g.animals.push({m:a,x,z,a:R()*6.28,t:R()*5,hx:cx,hz:cz,sp:k==='chicken'?1.6:k==='horse'?1.4:.8})}})});
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!g.animals)return;g.animals.forEach(n=>{n.t-=dt;if(n.t<=0){n.t=rnd(2,6);n.walk=R()<.6;n.a+=rnd(-1.5,1.5);if(Math.hypot(n.x-n.hx,n.z-n.hz)>16)n.a=Math.atan2(n.hz-n.z,n.hx-n.x)}
 const pd=Math.hypot(g.x-n.x,g.z-n.z);let sp=n.walk?n.sp:0;if(pd<6){n.a=Math.atan2(n.z-g.z,n.x-g.x);sp=n.sp*3}
 if(sp>0){const nx=n.x+Math.cos(n.a)*sp*dt,nz=n.z+Math.sin(n.a)*sp*dt;if(hin(nx,nz)){n.x=nx;n.z=nz}else n.a+=Math.PI}
 n.m.position.set(n.x,sp>0?Math.abs(Math.sin(g.t*8))*.08:0,n.z);n.m.rotation.y=-n.a;n.m.children.forEach(c=>{if(c.userData.leg)c.rotation.z=sp>0?Math.sin(g.t*9+c.position.z*9)*.4:0})})});
// bot-fejek: emoji helyett 3D állatfej
WP('person',null,(a,_,grp)=>{const em=a[1],h=window.animalHead(em);if(!h||!grp)return;const sc=a[2]||1;grp.children.slice().forEach(c=>{if(c.isSprite)grp.remove(c)});h.scale.setScalar(sc);h.position.set(0,2.4*sc,0);grp.add(h)});

// ---------- Kiesési szövegbuborék a kiesett feje fölött ----------
const LAST=['Ezt nem így beszéltük meg!','Brüsszel tehet róla!','Majd a fellebbezésben...','Csak egy kis átcsoportosítás volt!','Ezt még megbánod!','Lejárt a mandátumom...','Hol a kenőpénzem?!','Panaszt teszek az OLAF-nál!','Pedig benne voltam a keretben...','A pályázat még fut!','Ez lejárató kampány!','Visszatérek a következő ciklusban!','Ez nem fair, kordont kértem!','Anyuuu, küldj krumplit!','Kiszivárgott a hangfelvétel...','Nem volt benne az ÁFA!'];
function bubbleTex(text){const c=document.createElement('canvas'),x=c.getContext('2d');x.font='bold 40px Rajdhani, Arial';const words=text.split(' '),lines=[];let cur='';words.forEach(w=>{const t=cur?cur+' '+w:w;if(x.measureText(t).width>520&&cur){lines.push(cur);cur=w}else cur=t});lines.push(cur);
 const W=Math.min(600,Math.max(...lines.map(l=>x.measureText(l).width))+60),H=lines.length*48+50;c.width=W;c.height=H+26;x.font='bold 40px Rajdhani, Arial';
 x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.roundRect(6,10,W-12,H-8,26);x.fill();
 x.fillStyle='#ffffff';x.strokeStyle='#ffd23f';x.lineWidth=6;x.beginPath();x.roundRect(4,4,W-12,H-12,24);x.fill();x.stroke();
 x.beginPath();x.moveTo(W/2-18,H-10);x.lineTo(W/2,H+20);x.lineTo(W/2+18,H-10);x.closePath();x.fill();x.stroke();x.fillRect(W/2-15,H-16,30,8);
 x.fillStyle='#111827';x.textAlign='center';x.textBaseline='middle';lines.forEach((l,i)=>x.fillText(l,W/2-4,26+i*48+18));
 const t=new THREE.CanvasTexture(c);return{t,a:W/(H+26)}}
window.lastWords=()=>pick(LAST);
window.killBubble=function(x,z,y,text){const g=G;if(!g||!scene)return;const{t,a}=bubbleTex(text);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));const h=1.6;s.scale.set(h*a,h,1);s.position.set(x,y,z);s.renderOrder=999;scene.add(s);
 let life=3.2;g.ef.push({k:'bub',t:life,u:dt=>{life-=dt;s.position.y+=dt*.35;s.material.opacity=Math.min(1,life/.6)},end:()=>{scene.remove(s);t.dispose()}})};
WP('kill',a=>{const e=a[0];return e?{x:e.x,z:e.z,y:(e.y||0)+(e.b?7:4.6)}:null},(a,p)=>{if(!p)return;window.killBubble(p.x,p.z,p.y,pick(LAST))});
// a középső szöveg helyett a buborék beszél
WP('taunt',null,()=>{const k=$('kp');if(k)k.style.opacity=0});
})();
