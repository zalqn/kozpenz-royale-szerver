// ===== LOBBY 3D 2.0 – sűrűn berendezett lobby-környezet (Közpénz tér) =====
// Ház mögött/előtt, bal és jobb oldalon: kút, kirakatos utca, neon KÖZPÉNZ, kaszinó-bejárat, garázs, parkoló, piac,
// fák, virágágyások, lámpák, padok, zászlók, járókelők, galambok, mozgó autók, városi sziluett + hegyek.
// Csak InstancedMesh/megosztott anyag, valódi fény nincs (emissive + additív pontok). Ki: localStorage k3lobby3d2='0'. Debug: window._l3d
(function(){'use strict';
if(typeof window==='undefined')return;
const ON=()=>{try{return localStorage.getItem('k3lobby3d2')!=='0'}catch(e){return true}};
const D={sc:null,g:null,fx:[],N:-1,mats:{},stats:{},hidden:[]};window._l3d=D;
let seed=7;const R=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646};const RR=(a,b)=>a+R()*(b-a);
const hourNow=()=>{try{const v=JSON.parse(localStorage.getItem('k3EHour'));if(typeof v==='number')return v}catch(e){}const d=new Date();return d.getHours()+d.getMinutes()/60};
const nightF=h=>h<5.5||h>20.5?1:h<7?(7-h)/1.5:h>19?(h-19)/1.5:0;

function build(L){const T=THREE,sc=L.sc;seed=7;
 if(D.g&&D.g.parent)D.g.parent.remove(D.g);
 const G=new T.Group();G.name='lobby3d2';D.g=G;D.sc=sc;D.fx=[];
 const o3=new T.Object3D(),col=new T.Color(),M4=T.Matrix4,_m=new T.Matrix4();
 // olcsó Lambert alapértelmezés; Standard csak fémes (arany, autó, üveg) anyagokra
 const MS=(c,o)=>{o=Object.assign({color:c},o||{});if(o.metalness>=.4)return new T.MeshStandardMaterial(Object.assign({roughness:.8},o));delete o.metalness;delete o.roughness;delete o.flatShading;return new T.MeshLambertMaterial(o)};
 const MB=(c,o)=>new T.MeshBasicMaterial(Object.assign({color:c},o||{}));
 const TM=(k,rx,ry,c)=>{try{if(typeof window.texMat==='function'){const m=window.texMat(k,rx,ry,c);if(m&&m.map)return new T.MeshLambertMaterial({map:m.map,color:m.color.clone()});return m}}catch(e){}return MS(c)};
 const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;return t};
 const mesh=(geo,mat,x,y,z,ry)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);if(ry)m.rotation.y=ry;G.add(m);return m};
 // ---- KIT: összetett tárgy sok példányban; parts: [geo,mat,[x,y,z],[rx,ry,rz],[sx,sy,sz],colors?]; places: [x,y,z,ry,s,ci]
 // azonos anyagú részek egy geometriába olvasztva -> kevesebb draw call
 const merge=geos=>{const out=new T.BufferGeometry(),A={position:[],normal:[],uv:[]};geos.forEach(g=>{const n=g.index?g.toNonIndexed():g;['position','normal','uv'].forEach(k=>{const at=n.attributes[k];if(at)A[k].push(at.array);else A[k].push(new Float32Array(n.attributes.position.count*(k==='uv'?2:3)))})});
  ['position','normal','uv'].forEach(k=>{const len=A[k].reduce((s,a)=>s+a.length,0),arr=new Float32Array(len);let o=0;A[k].forEach(a=>{arr.set(a,o);o+=a.length});out.setAttribute(k,new T.BufferAttribute(arr,k==='uv'?2:3))});return out};
 const kit=(parts,places)=>{const n=places.length;const grp=new Map();
  parts.forEach((p,pi)=>{const lm=new M4().compose(new T.Vector3(...(p[2]||[0,0,0])),new T.Quaternion().setFromEuler(new T.Euler(...(p[3]||[0,0,0]))),new T.Vector3(...(p[4]||[1,1,1])));
   const key=p[1].uuid+(p[5]?'|c'+pi:'');if(!grp.has(key))grp.set(key,{mat:p[1],cols:p[5],geos:[]});grp.get(key).geos.push(p[0].clone().applyMatrix4(lm))});
  const ms=[...grp.values()].map(g=>{const im=new T.InstancedMesh(g.geos.length>1?merge(g.geos):g.geos[0],g.mat,n);im.userData.lm=new M4();im.userData.cols=g.cols;G.add(im);return im});
  const k={ms,set(i,x,y,z,ry,s,ci){o3.position.set(x,y,z);o3.rotation.set(0,ry||0,0);o3.scale.setScalar(s||1);o3.updateMatrix();
    ms.forEach(im=>{_m.multiplyMatrices(o3.matrix,im.userData.lm);im.setMatrixAt(i,_m);const cs=im.userData.cols;if(cs&&ci!=null)im.setColorAt(i,col.set(cs[ci%cs.length]))})},
   upd(){ms.forEach(im=>{im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true})}};
  places.forEach((p,i)=>k.set(i,p[0],p[1]||0,p[2],p[3],p[4],p[5]==null?i:p[5]));k.upd();return k};
 const box=new T.BoxGeometry(1,1,1),cyl=new T.CylinderGeometry(.5,.5,1,12),sph=new T.SphereGeometry(.5,10,8),ico=new T.IcosahedronGeometry(1,1),cone=new T.ConeGeometry(.5,1,10);
 const plane=new T.PlaneGeometry(1,1);
 // ---- közös textúrák/anyagok
 const glowTex=cv(64,64,(x,w,h)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,240,200,.65)');g.addColorStop(1,'rgba(255,220,150,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});
 const winTex=cv(128,256,(x,w,h)=>{x.fillStyle='#262c3a';x.fillRect(0,0,w,h);for(let r=0;r<16;r++)for(let c=0;c<8;c++){const lit=R()<.55;x.fillStyle=lit?['#ffd98a','#ffe7b5','#9fd8ff','#ffc46b'][(R()*4)|0]:'#141a26';x.fillRect(c*16+3,r*16+4,10,9)}});
 winTex.wrapS=winTex.wrapT=T.RepeatWrapping;winTex.repeat.set(1,1.5);
 const winM=MS(0x8a92a6,{map:winTex,emissive:0xffffff,emissiveMap:winTex,emissiveIntensity:.6,roughness:.6});
 const farM=MS(0x3a4560,{map:winTex,emissive:0xffffff,emissiveMap:winTex,emissiveIntensity:.5,roughness:1});
 const stoneM=TM('stone',2,1,0xc9c1b4),cobM=TM('cobble',14,14,0xbdb4a6),asphM=MS(0x2b2f36,{roughness:.95}),grassM=TM('grass',60,60,0x4f7f45),curbM=MS(0xb9bcc2),darkM=MS(0x23262d,{metalness:.5,roughness:.5}),woodM=TM('darkwood',1,1,0x8a5a36),
  goldM=MS(0xffc83d,{metalness:.9,roughness:.25,emissive:0x5a3a00,emissiveIntensity:.5}),leafM=MS(0xffffff,{roughness:.9}),trunkM=MS(0x6b4a2b,{roughness:.95}),lampHeadM=MB(0xfff1c4),
  whiteM=MS(0xf1f1f1),glassM=MS(0x9fc8e8,{metalness:.6,roughness:.1,transparent:true,opacity:.55}),tireM=MS(0x15171b,{roughness:.9});
 D.mats={winM,farM,lampHeadM};
 // ---- talaj: nagy füves sík + tér + út + járda
 const gnd=mesh(new T.PlaneGeometry(330,215),grassM,0,-.05,62);gnd.rotation.x=-Math.PI/2;
 const plaza=mesh(new T.CircleGeometry(12,48),cobM,0,.025,23);plaza.rotation.x=-Math.PI/2;
 const walk=mesh(new T.PlaneGeometry(6,10),cobM,0,.02,14.5);walk.rotation.x=-Math.PI/2; // út a tértől a ház felé
 // burkolt tér a pódium előtt és két oldalt (a régi homok helyett)
 [[0,22.5,80,38],[-28,-8,24,24],[28,-8,24,24]].forEach(([x,z,w,d])=>{const m=mesh(new T.PlaneGeometry(w,d),cobM,x,.012,z);m.rotation.x=-Math.PI/2});
 // díszburkolat-mozaik a kamera előtt (laposan, a karaktert nem takarja)
 {const mt=cv(512,512,(x,w,h)=>{x.translate(256,256);const rg=x.createRadialGradient(0,0,10,0,0,256);rg.addColorStop(0,'#f5e6c8');rg.addColorStop(1,'#c9b896');x.fillStyle=rg;x.beginPath();x.arc(0,0,254,0,7);x.fill();
   for(let i=0;i<16;i++){x.rotate(Math.PI/8);x.fillStyle=i%2?'#b45309':'#1e3a8a';x.beginPath();x.moveTo(0,-60);x.lineTo(22,-200);x.lineTo(0,-246);x.lineTo(-22,-200);x.fill()}
   x.lineWidth=10;x.strokeStyle='#7c5a2a';x.beginPath();x.arc(0,0,248,0,7);x.stroke();x.beginPath();x.arc(0,0,64,0,7);x.fillStyle='#facc15';x.fill();x.stroke();
   x.fillStyle='#7a4a00';x.font='bold 60px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('Ft',0,4)});
  const mo=mesh(new T.CircleGeometry(4.6,48),MS(0xffffff,{map:mt,roughness:.6}),0,.035,8.6);mo.rotation.x=-Math.PI/2}
 const road=mesh(new T.PlaneGeometry(130,7),asphM,0,.03,36);road.rotation.x=-Math.PI/2;
 const sideRoadL=mesh(new T.PlaneGeometry(7,70),asphM,-36,.03,4);sideRoadL.rotation.x=-Math.PI/2;
 const sideRoadR=mesh(new T.PlaneGeometry(7,70),asphM,36,.03,4);sideRoadR.rotation.x=-Math.PI/2;
 const sw=mesh(new T.PlaneGeometry(130,3.2),cobM,0,.06,41);sw.rotation.x=-Math.PI/2;
 const swb=mesh(new T.PlaneGeometry(64,2.4),cobM,0,.06,31.3);swb.rotation.x=-Math.PI/2;
 // útfelfestés + zebra
 {const dash=[];for(let x=-62;x<=62;x+=4)dash.push([x,.04,36,0,1]);for(let z=-28;z<=36;z+=4){dash.push([-36,.04,z,Math.PI/2,1]);dash.push([36,.04,z,Math.PI/2,1])}
  kit([[plane,MB(0xe5e7eb),[0,0,0],[-Math.PI/2,0,0],[1.8,.18,1]]],dash);
  const zeb=[];for(let i=0;i<7;i++)zeb.push([-2.7+i*.9,.045,36,0,1]);kit([[plane,MB(0xf3f4f6),[0,0,0],[-Math.PI/2,0,0],[.55,6.4,1]]],zeb)}
 // ---- parkoló jobb oldalt (aszfalt + csíkok)
 const park=mesh(new T.PlaneGeometry(13,34),asphM,25.5,.035,6);park.rotation.x=-Math.PI/2;
 {const st=[];for(let z=-10;z<=22;z+=3.2){st.push([22,.045,z,0,1]);st.push([29,.045,z,0,1])}kit([[plane,MB(0xfde047),[0,0,0],[-Math.PI/2,0,0],[3.6,.12,1]]],st)}

 // ================= KIRAKATOS UTCA (ház mögött +z, bal -x, jobb +x) =================
 const SHOPS=[['KÖZBESZERZÉSI BOLT','#ef4444'],['ARANYKAPU ÉKSZER','#f59e0b'],['ZSETON PÉKSÉG','#22c55e'],['TENDER KÁVÉZÓ','#a855f7'],['PLAKÁT NYOMDA','#3b82f6'],['STADION SPORT','#14b8a6'],['MUTYI ÁRUHÁZ','#ec4899'],['KILOMÉTER-PÉNZ AUTÓ','#f97316'],['ALAPÍTVÁNYI VIRÁG','#84cc16'],['TANÁCSADÓ IRODA','#0ea5e9'],['KÖZPÉNZ BANK','#eab308'],['HAVERI PIZZA','#dc2626']];
 const shopTex=(off)=>cv(2048,256,(x,w,h)=>{const n=8,sw2=w/n;for(let i=0;i<n;i++){const [nm,c]=SHOPS[(i+off)%SHOPS.length],X0=i*sw2;
   x.fillStyle=['#e7dccb','#d9c7b0','#c9d2dc','#e5d5d0'][i%4];x.fillRect(X0,0,sw2,h);
   x.fillStyle='#1f2430';x.fillRect(X0+10,22,sw2-20,40);x.fillStyle=c;x.fillRect(X0+12,24,sw2-24,36);
   x.font='bold 24px Arial';x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.fillText(nm,X0+sw2/2,43,sw2-34);
   // ponyva
   for(let s=0;s<10;s++){x.fillStyle=s%2?c:'#f8fafc';x.beginPath();x.moveTo(X0+12+s*(sw2-24)/10,66);x.lineTo(X0+12+(s+1)*(sw2-24)/10,66);x.lineTo(X0+12+(s+1)*(sw2-24)/10,86);x.lineTo(X0+12+s*(sw2-24)/10,90);x.fill()}
   // kirakat
   const g=x.createLinearGradient(0,92,0,236);g.addColorStop(0,'#fff3c4');g.addColorStop(1,'#d9a35b');x.fillStyle=g;x.fillRect(X0+14,96,sw2-90,140);
   for(let k=0;k<6;k++){x.fillStyle=['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#111827'][(k+i)%6];const bx=X0+22+k*((sw2-110)/6);x.fillRect(bx,180-((k*37+i*13)%50),18,56+((k*37+i*13)%50))}
   x.strokeStyle='#2a2f3a';x.lineWidth=6;x.strokeRect(X0+14,96,sw2-90,140);x.beginPath();x.moveTo(X0+14+(sw2-90)/2,96);x.lineTo(X0+14+(sw2-90)/2,236);x.stroke();
   // ajtó
   x.fillStyle='#3a2a1e';x.fillRect(X0+sw2-68,110,52,146);x.fillStyle='#ffd98a';x.fillRect(X0+sw2-62,118,40,60);x.fillStyle='#fde047';x.fillRect(X0+sw2-28,180,6,6)}
   x.fillStyle='#8a8f98';x.fillRect(0,0,w,10)});
 const shopM=(off)=>{const t=shopTex(off);return MS(0xffffff,{map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.35,roughness:.7})};
 const shopMs=[shopM(0),shopM(4),shopM(8),shopM(2)];D.mats.shopMs=shopMs;
 // utcasor: x0..x1 hosszan, homlokzat síkja (fx,fz), irány (ry = homlokzat normálja)
 const upper=[],roofs=[];
 const street=(cx,cz,len,ry,mi)=>{const f=mesh(new T.PlaneGeometry(len,5),shopMs[mi],cx,2.5,cz,ry);
  const dx=Math.cos(ry),dz=-Math.sin(ry),nx=Math.sin(ry),nz=Math.cos(ry);// dx/dz: homlokzat iránya; n: kifelé
  // tömb a homlokzat mögött (földszint)
  const base=mesh(box,MS(0x9aa0aa),cx-nx*4.05,2.5,cz-nz*4.05,ry);base.scale.set(len,5,8);
  // felső szintek változó magassággal
  for(let s=-len/2+3;s<len/2;s+=6){const hgt=RR(5,15),x=cx+dx*s-nx*4,z=cz+dz*s-nz*4;upper.push([x,5+hgt/2,z,ry,1,[5.6,hgt,7.6]]);roofs.push([x,5+hgt+.25,z,ry,[5.9,.5,7.9]])}};
 street(0,41.5,96,Math.PI,0);          // ház mögött (a kamerától nézve hátul) – homlokzat -z felé néz
 street(-41.5,8,62,Math.PI/2,1);       // bal oldal – homlokzat +x felé
 street(41.5,8,62,-Math.PI/2,2);       // jobb oldal – homlokzat -x felé
 {const im=new T.InstancedMesh(box,winM,upper.length);upper.forEach((u,i)=>{o3.position.set(u[0],u[1],u[2]);o3.rotation.set(0,u[3],0);o3.scale.set(...u[5]);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});G.add(im);
  const rf=new T.InstancedMesh(box,MS(0x3b3f48),roofs.length);roofs.forEach((u,i)=>{o3.position.set(u[0],u[1],u[2]);o3.rotation.set(0,u[3],0);o3.scale.set(...u[4]);o3.updateMatrix();rf.setMatrixAt(i,o3.matrix)});G.add(rf)}
 // sarokházak (a három sor találkozásánál) + háttér-tömbök az utca mögött
 {const bl=[[-41.5,0,41.5,14,10],[41.5,0,41.5,16,10],[-41.5,0,-25,12,10],[41.5,0,-25,13,10]];
  for(let x=-48;x<=48;x+=8)bl.push([x,0,56,RR(14,30),7.5]);for(let z=-20;z<=40;z+=8){bl.push([-56,0,z,RR(12,26),7.5]);bl.push([56,0,z,RR(12,26),7.5])}
  const im=new T.InstancedMesh(box,winM,bl.length);bl.forEach((b,i)=>{o3.position.set(b[0],b[3]/2,b[2]);o3.rotation.set(0,0,0);o3.scale.set(b[4],b[3],b[4]);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});G.add(im)}

 // ================= NEON-TÁBLÁK =================
 const neon=(txt,c1,c2,w,h)=>{const t=cv(1024,256,(x,W,H)=>{x.textAlign='center';x.textBaseline='middle';const fs=Math.min(170,W*1.6/Math.max(4,txt.length));x.font='900 '+fs+'px Impact, Arial Black, Arial';
   x.shadowColor=c1;x.shadowBlur=40;x.lineWidth=10;x.strokeStyle=c1;x.strokeText(txt,W/2,H/2);x.shadowBlur=18;x.fillStyle=c2;x.fillText(txt,W/2,H/2)});
  return new T.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,side:T.DoubleSide})};
 const neonMs=[];
 const sign=(txt,c1,c2,w,h,x,y,z,ry,frame)=>{const m=neon(txt,c1,c2);neonMs.push(m);if(frame){const b=mesh(box,MS(0x15171d,{metalness:.6,roughness:.4}),x-Math.sin(ry)*.12,y,z-Math.cos(ry)*.12,ry);b.scale.set(w*.95,h*.62,.15)}const p=mesh(plane,m,x,y,z,ry);p.scale.set(w,h,1);return p};
 // nagy KÖZPÉNZ tetőfelirat a hátsó utcán, a kamerától hátra nézve középen
 const bigSign=sign('KÖZPÉNZ','#ff2bd6','#ffe4fb',22,5.5,0,23,44,Math.PI,true);
 kit([[box,darkM,[0,0,0],[0,0,0],[.25,14,.25]]],[[-8,13,45],[8,13,45],[0,13,45]]);
 sign('ROYALE','#22d3ee','#e0fbff',13,3.4,0,18.6,43.9,Math.PI,false);
 sign('PIAC','#facc15','#fffbe6',8,2.2,-40.6,7.6,8,Math.PI/2,true);
 sign('PARKOLÓ','#60a5fa','#eff6ff',9,2.2,40.6,7.6,-6,-Math.PI/2,true);
 sign('NONSTOP','#4ade80','#f0fdf4',8,2,40.6,7.6,20,-Math.PI/2,true);
 sign('PÁLYÁZAT','#fb7185','#fff1f2',9,2.2,-40.6,7.6,26,Math.PI/2,true);

 // ================= KASZINÓ-BEJÁRAT (hátul, bal) =================
 {const cx=-17,cz=39;
  const port=MS(0x1b1030,{metalness:.5,roughness:.35});
  mesh(box,port,cx,7.6,cz+.4,0).scale.set(12,1.2,4);           // előtető
  kit([[cyl,goldM,[0,0,0],[0,0,0],[.6,7,.6]]],[[cx-5.3,3.5,cz-1.2],[cx+5.3,3.5,cz-1.2],[cx-1.8,3.5,cz-1.2],[cx+1.8,3.5,cz-1.2]]);
  const carpet=mesh(plane,MS(0xb91c1c,{roughness:1}),cx,.07,cz-3.5,0);carpet.rotation.x=-Math.PI/2;carpet.scale.set(3.2,9,1);
  const door=mesh(plane,MS(0x2a0f12,{emissive:0xffb347,emissiveIntensity:.55}),cx,2.4,cz+1.95,Math.PI);door.scale.set(3.2,4.4,1);
  sign('ARANYKÖD KASZINÓ','#f59e0b','#fff7d6',12,2.6,cx,9.2,cz-1.7,Math.PI,false);
  // villogó izzósor az előtető peremén
  const bulbs=[];for(let i=0;i<24;i++)bulbs.push([cx-5.8+i*.5,7,cz-1.65]);for(let i=0;i<8;i++){bulbs.push([cx-6,7.2+i*0,cz-1.6+i*.5]);bulbs.push([cx+6,7.2,cz-1.6+i*.5])}
  const bk=kit([[sph,MB(0xffffff,{toneMapped:false}),[0,0,0],[0,0,0],[.22,.22,.22],['#ffd166','#ff4d6d']]],bulbs);
  D.fx.push(t=>{if(((t*4)|0)===D._bk)return;D._bk=(t*4)|0;const im=bk.ms[0];for(let i=0;i<bulbs.length;i++)im.setColorAt(i,col.set(((i+D._bk)%3)?'#ffd166':'#ff4d6d'));im.instanceColor.needsUpdate=true});
  // bársonykötél oszlopok
  kit([[cyl,goldM,[0,.5,0],[0,0,0],[.12,1,.12]],[sph,goldM,[0,1.05,0],[0,0,0],[.22,.22,.22]]],[[cx-2,0,cz-3],[cx-2,0,cz-5],[cx-2,0,cz-7],[cx+2,0,cz-3],[cx+2,0,cz-5],[cx+2,0,cz-7]])}
 // ================= GARÁZS (hátul, jobb) =================
 {const gx=18,gz=39;const gt=cv(256,256,(x,w,h)=>{x.fillStyle='#6b7280';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=16){x.fillStyle='#9ca3af';x.fillRect(0,y,w,11);x.fillStyle='#4b5563';x.fillRect(0,y+11,w,2)}x.fillStyle='#f59e0b';for(let i=0;i<8;i++){x.save();x.translate(i*36,h-24);x.rotate(-.6);x.fillRect(0,0,14,40);x.restore()}x.fillStyle='#111827';x.fillRect(0,h-26,w,4)});
  [-3.8,3.8].forEach(o=>{const d=mesh(plane,MS(0xffffff,{map:gt,metalness:.4,roughness:.5}),gx+o,2.3,gz+1.94,Math.PI);d.scale.set(6.6,4.4,1)});
  mesh(box,MS(0x1f2937),gx,4.9,gz+1.5,0).scale.set(15,.8,1);
  sign('GARÁZS','#38bdf8','#e0f2fe',8,2,gx,6.8,gz-.2,Math.PI,false);
  kit([[box,MS(0xfacc15),[0,.5,0],[0,0,0],[.25,1,.25]],[box,darkM,[0,1.02,0],[0,0,0],[.3,.06,.3]]],[[gx-7.6,0,gz-.6],[gx,0,gz-.6],[gx+7.6,0,gz-.6]])}

 // ================= DÍSZKÚT (a tér közepén, a háttal szemben) =================
 const FZ=23;{
  mesh(new T.CylinderGeometry(4.4,4.7,.7,40),stoneM,0,.35,FZ);
  const wt=cv(128,128,(x,w,h)=>{x.fillStyle='#1f6fb0';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.strokeStyle='rgba(190,235,255,'+RR(.15,.5)+')';x.lineWidth=2;x.beginPath();const cx=R()*w,cy=R()*h;x.arc(cx,cy,RR(4,16),0,RR(1,3));x.stroke()}});wt.wrapS=wt.wrapT=T.RepeatWrapping;wt.repeat.set(3,3);
  const wm=MS(0x7cc7ff,{map:wt,emissive:0x0a4a7a,emissiveIntensity:.8,roughness:.1,metalness:.3});
  const water=mesh(new T.CircleGeometry(4.1,40),wm,0,.62,FZ);water.rotation.x=-Math.PI/2;
  mesh(new T.CylinderGeometry(.55,.75,2.4,16),stoneM,0,1.6,FZ);
  mesh(new T.CylinderGeometry(2.1,1.2,.45,32),stoneM,0,2.85,FZ);
  const w2=mesh(new T.CircleGeometry(1.95,32),wm,0,3.08,FZ);w2.rotation.x=-Math.PI/2;
  mesh(new T.CylinderGeometry(.3,.4,1.3,12),stoneM,0,3.7,FZ);
  const coin=mesh(new T.CylinderGeometry(.9,.9,.22,32),goldM,0,5.1,FZ);coin.rotation.x=Math.PI/2;
  const ft=cv(128,128,(x)=>{x.fillStyle='#ffc83d';x.fillRect(0,0,128,128);x.fillStyle='#7a4a00';x.font='bold 70px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('Ft',64,68)});
  const coinFace=new T.Mesh(new T.CircleGeometry(.78,32),MS(0xffffff,{map:ft,metalness:.7,roughness:.3,emissive:0x5a3a00,emissiveIntensity:.4,side:T.DoubleSide}));coinFace.position.y=.12;coinFace.rotation.x=-Math.PI/2;coin.add(coinFace);
  const cf2=coinFace.clone();cf2.position.y=-.12;cf2.rotation.x=Math.PI/2;coin.add(cf2);
  // vízcsobogó: lefolyó függöny a felső tálból
  const ct=cv(64,128,(x,w,h)=>{for(let i=0;i<40;i++){x.fillStyle='rgba(200,240,255,'+RR(.2,.7)+')';x.fillRect(R()*w,R()*h,2,RR(10,40))}});ct.wrapS=ct.wrapT=T.RepeatWrapping;ct.repeat.set(6,1);
  const curtain=mesh(new T.CylinderGeometry(2.05,2.6,2.3,32,1,true),new T.MeshBasicMaterial({map:ct,transparent:true,opacity:.55,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide}),0,1.85,FZ);
  // szökőkút-sugarak: részecskék
  const N=360,pos=new Float32Array(N*3),P=[];for(let i=0;i<N;i++){P.push({t:R()*1.6,a:R()*6.283,v:RR(1.6,2.3),u:RR(4.6,5.6),ring:i%3===0});}
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));
  const pts=new T.Points(pg,new T.PointsMaterial({map:glowTex,color:0xbfe9ff,size:.32,transparent:true,opacity:.85,depthWrite:false,blending:T.AdditiveBlending}));pts.position.set(0,0,FZ);G.add(pts);pts.frustumCulled=false;
  D.fx.push((t,dt)=>{wt.offset.set(t*.03,t*.02);ct.offset.y=-t*1.4;coin.rotation.z=t*.8;
   for(let i=0;i<N;i++){const p=P[i];p.t+=dt;const T0=p.ring?1.1:1.6;if(p.t>T0)p.t-=T0;const k=p.t;
    if(p.ring){const r=2.5+k*1.2;pos[i*3]=Math.cos(p.a)*r;pos[i*3+1]=Math.max(.65,3.0+2.4*k-4.9*k*k*1.6);pos[i*3+2]=Math.sin(p.a)*r}
    else{const r=k*p.v*.55;pos[i*3]=Math.cos(p.a)*r;pos[i*3+1]=Math.max(3.1,5.4+p.u*k-4.9*k*k);pos[i*3+2]=Math.sin(p.a)*r}}
   pg.attributes.position.needsUpdate=true});
 }

 // ================= FÁK, BOKROK, VIRÁGÁGYÁSOK =================
 const LEAF=['#3f8f46','#2f7a3d','#4ea34f','#5a9a3a','#2e6b46'];
 const trees=[];
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2+.22;const x=Math.cos(a)*14.5,z=FZ+Math.sin(a)*10.5;if(z<FZ-2&&Math.abs(x)<12)continue;trees.push([x,0,z,R()*6,RR(.9,1.2)])}
 for(let x=-56;x<=56;x+=8){if(Math.abs(x+17)<7||Math.abs(x-18)<9)continue;trees.push([x,0,32.6,R()*6,RR(.85,1.1)])}
 for(let z=-24;z<=30;z+=7){trees.push([-31.8,0,z,R()*6,RR(.9,1.2)]);if(z<-12||z>24)trees.push([31.8,0,z,R()*6,RR(.9,1.2)])}
 [[-12,10],[-16,14],[13.5,10],[17,14],[-24,-22],[24,-20],[20,-26],[-28,-12],[-22,30],[22,30]].forEach(p=>trees.push([p[0],0,p[1],R()*6,RR(1,1.3)]));
 // távoli fasor a füvön
 for(let i=0;i<60;i++){const a=RR(-.2,Math.PI+.2),r=RR(62,80);const x=Math.cos(a)*r*1.2,z=Math.sin(a)*r+10;trees.push([x,0,z,R()*6,RR(1.3,2)])}
 kit([[cyl,trunkM,[0,1.2,0],[0,0,0],[.35,2.4,.35]],[ico,leafM,[0,3.2,0],[0,0,0],[1.6,1.5,1.6],LEAF],[ico,leafM,[.4,4.3,.2],[0,0,0],[1.1,1.1,1.1],LEAF.slice().reverse()]],trees.map((t,i)=>[t[0],0,t[2],t[3],t[4],i]));
 D.stats.trees=trees.length;
 // bokrok
 const bush=[];
 const addB=(x,z,n,sp)=>{for(let i=0;i<n;i++)bush.push([x+RR(-sp,sp),0,z+RR(-sp,sp),R()*6,RR(.5,.85)])};
 addB(-9.2,6.4,5,1.3);addB(9.4,5.6,5,1.3);addB(-11.8,8.8,4,1);addB(11.6,8.6,4,1);addB(-7,10.5,3,.8);addB(7.4,10.5,3,.8);
 for(let i=0;i<20;i++){const a=i/20*Math.PI*2;const x=Math.cos(a)*11.5,z=FZ+Math.sin(a)*11.5;if(z<14&&Math.abs(x)<4)continue;bush.push([x,0,z,R()*6,.6])}
 for(let z=-20;z<30;z+=2.6){bush.push([-27.5,0,z,R()*6,.65]);if(z>-6)bush.push([19.4,0,z,R()*6,.6])}
 kit([[ico,leafM,[0,.45,0],[0,0,0],[.9,.75,.9],['#2f6b3a','#3f7d45','#477f3a','#336b2c']]],bush);
 // virágágyások (kőkeret + színes virágok)
 const beds=[[-9,0,7.6,.3,1],[9.2,0,7,-.3,1],[0,0,FZ-12.6,0,1.2],[-6,0,FZ+12,0,1],[6,0,FZ+12,0,1],[-23,0,30,0,1],[23,0,30,0,1],[-26,0,-3,Math.PI/2,1],[26,0,26,0,1]];
 kit([[box,stoneM,[0,.22,0],[0,0,0],[4,.44,1.6]],[box,TM('dirt',1,1,0x4a3424),[0,.42,0],[0,0,0],[3.7,.1,1.3]]],beds);
 {const fl=[];beds.forEach(b=>{const c=Math.cos(b[3]),s=Math.sin(b[3]);for(let i=0;i<22;i++){const lx=RR(-1.75,1.75)*b[4],lz=RR(-.55,.55);fl.push([b[0]+lx*c+lz*s,.5,b[2]-lx*s+lz*c,0,RR(.8,1.3)])}});
  kit([[cyl,MS(0x2f6b3a),[0,.15,0],[0,0,0],[.04,.3,.04]],[sph,MS(0xffffff,{emissive:0x331122,emissiveIntensity:.3}),[0,.34,0],[0,0,0],[.2,.15,.2],['#f43f5e','#facc15','#a855f7','#fb923c','#f472b6','#ffffff','#60a5fa']]],fl)}
 // cserepes pálmák a kamera két oldalán (UI-gombok alá)
 kit([[cyl,MS(0xb45309,{roughness:.9}),[0,.45,0],[0,0,0],[1.1,.9,1.1]],[cone,MS(0x2f7a3d),[0,1.6,0],[0,0,0],[1.4,2.2,1.4]],[cone,MS(0x3f8f46),[0,2.4,0],[0,0,0],[1,1.6,1]]],[[-11.5,0,5.2],[11.8,0,4.2],[-7.6,0,12],[7.9,0,12]]);

 // ================= LÁMPÁK + PADOK + KUKÁK + OSZLOPOK =================
 const lamps=[];
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.31;const x=Math.cos(a)*12.6,z=FZ+Math.sin(a)*12.6;if(z<14&&Math.abs(x)<5)continue;lamps.push([x,0,z])}
 for(let x=-60;x<=60;x+=10)lamps.push([x,0,39.7]);for(let z=-26;z<=30;z+=8){lamps.push([-38.7,0,z]);lamps.push([38.7,0,z])}
 lamps.push([-7.2,0,8.6],[7.4,0,8.2],[-19,0,-2],[19,0,-4],[-30,0,-24],[30,0,-24]);
 kit([[cyl,darkM,[0,2,0],[0,0,0],[.14,4,.14]],[cyl,darkM,[0,.15,0],[0,0,0],[.4,.3,.4]],[sph,lampHeadM,[0,4.15,0],[0,0,0],[.5,.5,.5]],[cone,darkM,[0,4.55,0],[0,0,0],[.7,.35,.7]]],lamps);
 const glowG=new T.BufferGeometry();glowG.setAttribute('position',new T.Float32BufferAttribute(lamps.flatMap(l=>[l[0],4.15,l[2]]),3));
 const glowM=new T.PointsMaterial({map:glowTex,color:0xffd89a,size:3.2,transparent:true,opacity:.8,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});
 G.add(new T.Points(glowG,glowM));D.mats.glowM=glowM;
 // talajfolt a lámpák alatt (hamis fény)
 const poolM=new T.MeshBasicMaterial({map:glowTex,color:0xffc870,transparent:true,opacity:.35,depthWrite:false,blending:T.AdditiveBlending});D.mats.poolM=poolM;
 kit([[plane,poolM,[0,.08,0],[-Math.PI/2,0,0],[5,5,1]]],lamps);
 // padok
 const benches=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.4;const x=Math.cos(a)*8.2,z=FZ+Math.sin(a)*8.2;if(z<17&&Math.abs(x)<5)continue;benches.push([x,0,z,-a-Math.PI/2])}
 benches.push([-10.6,0,3.4,.6],[10.8,0,2.2,-.7],[-24,0,10,Math.PI/2],[-24,0,20,Math.PI/2],[-4,0,32.4,Math.PI],[4,0,32.4,Math.PI]);
 kit([[box,woodM,[0,.5,0],[0,0,0],[2,.12,.6]],[box,woodM,[0,.85,-.27],[-.15,0,0],[2,.5,.08]],[box,darkM,[-.85,.25,0],[0,0,0],[.1,.5,.55]],[box,darkM,[.85,.25,0],[0,0,0],[.1,.5,.55]]],benches);
 kit([[cyl,MS(0x1f7a4a,{metalness:.4}),[0,.5,0],[0,0,0],[.5,1,.5]],[cyl,darkM,[0,1.03,0],[0,0,0],[.56,.08,.56]]],[[-5.4,0,32.4],[5.4,0,32.4],[-12,0,39.8],[12,0,39.8],[-38.6,0,4],[38.6,0,12]]);
 {const bo=[];for(let x=-60;x<=60;x+=3)if(Math.abs(x+17)>3&&Math.abs(x)>4)bo.push([x,0,33.2]);kit([[cyl,MS(0x9ca3af,{metalness:.6,roughness:.3}),[0,.45,0],[0,0,0],[.2,.9,.2]],[sph,MS(0xf59e0b,{emissive:0x6b3a00}),[0,.92,0],[0,0,0],[.22,.1,.22]]],bo)}

 // ================= PIACI STANDOK (bal oldal) =================
 const STALL=['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899'];
 const stalls=[];for(let i=0;i<5;i++){stalls.push([-22,0,-.5+i*6.2,Math.PI/2,1,i]);stalls.push([-29.5,0,1.6+i*6.2,-Math.PI/2,1,i+3])}
 const awT=cv(128,64,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#ffffff':'#d8d8d8';x.fillRect(i*16,0,16,h)}x.fillStyle='rgba(0,0,0,.15)';x.fillRect(0,h-6,w,6)});
 kit([[box,woodM,[0,.55,0],[0,0,0],[3.4,1.1,1.2]],[box,MS(0xf5e6c8),[0,1.12,0],[0,0,0],[3.5,.06,1.3]],
  [cyl,darkM,[-1.6,1.35,-.55],[0,0,0],[.08,2.7,.08]],[cyl,darkM,[1.6,1.35,-.55],[0,0,0],[.08,2.7,.08]],[cyl,darkM,[-1.6,1.25,.55],[0,0,0],[.08,2.5,.08]],[cyl,darkM,[1.6,1.25,.55],[0,0,0],[.08,2.5,.08]],
  [box,MS(0xffffff,{map:awT,emissive:0x222222}),[0,2.75,.05],[.32,0,0],[3.8,.08,1.9],STALL]],stalls);
 {const fr=[];stalls.forEach(s=>{const c=Math.cos(s[3]),sn=Math.sin(s[3]);for(let i=0;i<14;i++){const lx=RR(-1.5,1.5),lz=RR(-.45,.45);fr.push([s[0]+lx*c+lz*sn,1.24,s[2]-lx*sn+lz*c,0,RR(.8,1.2)])}});
  kit([[sph,MS(0xffffff,{roughness:.5}),[0,0,0],[0,0,0],[.24,.22,.24],['#ef4444','#f97316','#facc15','#84cc16','#a855f7','#fde68a']]],fr);
  const cr=[];stalls.forEach(s=>{const c=Math.cos(s[3]),sn=Math.sin(s[3]);[-1.1,0,1.1].forEach(lx=>cr.push([s[0]+lx*c+1.1*sn,0,s[2]-lx*sn+1.1*c,s[3],1]))});
  kit([[box,TM('wood',1,1,0xb08050),[0,.25,0],[0,0,0],[.8,.5,.6]]],cr)}
 // fényfüzér a standok fölött
 {const lights=[];for(let z=-3;z<=30;z+=.9)lights.push([-25.8,3.4+Math.sin(z*.6)*.25,z]);
  const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lights.flat(),3));
  const lm=new T.PointsMaterial({map:glowTex,color:0xffe08a,size:.9,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});G.add(new T.Points(lg,lm));D.mats.strM=lm}

 // ================= AUTÓK: parkoló + mozgó forgalom =================
 const CARC=['#ef4444','#3b82f6','#f8fafc','#111827','#facc15','#22c55e','#a855f7','#f97316','#64748b','#0ea5e9'];
 const carParts=[[box,MS(0xffffff,{metalness:.55,roughness:.35}),[0,.65,0],[0,0,0],[1.9,.7,4.1],CARC],[box,glassM,[0,1.25,-.2],[0,0,0],[1.6,.55,2.1]],
  [cyl,tireM,[-.95,.38,1.3],[0,0,Math.PI/2],[.72,.3,.72]],[cyl,tireM,[.95,.38,1.3],[0,0,Math.PI/2],[.72,.3,.72]],[cyl,tireM,[-.95,.38,-1.3],[0,0,Math.PI/2],[.72,.3,.72]],[cyl,tireM,[.95,.38,-1.3],[0,0,Math.PI/2],[.72,.3,.72]],
  [box,MB(0xfff6d5,{toneMapped:false}),[0,.7,2.06],[0,0,0],[1.5,.16,.04]],[box,MB(0xff2a2a,{toneMapped:false}),[0,.75,-2.06],[0,0,0],[1.5,.14,.04]]];
 const parked=[];for(let z=-8.4;z<=21;z+=3.2){if(R()<.85)parked.push([22,0,z,-Math.PI/2+RR(-.05,.05)]);if(R()<.85)parked.push([29,0,z,Math.PI/2+RR(-.05,.05)])}
 parked.push([-8,0,38.2,Math.PI/2],[6,0,38.2,Math.PI/2],[-33.8,0,-6,0],[-33.8,0,24,0],[33.8,0,30,Math.PI]);
 const NMOV=6,cars=kit(carParts,parked.concat(new Array(NMOV).fill(0).map(()=>[0,-50,0])));D.stats.cars=parked.length+NMOV;
 const mov=[];for(let i=0;i<NMOV;i++)mov.push({lane:i%3,s:R()*1,v:RR(.035,.06)});
 // forgalom: hátsó út (két sáv) + bal/jobb mellékút
 const carPos=(m,t)=>{const u=(m.s+t*m.v)%1;if(m.lane===0)return [-62+u*124,34.4,Math.PI/2];if(m.lane===1)return [62-u*124,37.6,-Math.PI/2];return [m.s<.5?-37.6:37.6,-30+u*64,0]};
 D.fx.push(t=>{for(let i=0;i<NMOV;i++){const p=carPos(mov[i],t);cars.set(parked.length+i,p[0],0,p[1],p[2])}cars.upd()});

 // ================= ZÁSZLÓK =================
 const FL=['#ce2939','#ffffff','#477050','#facc15','#3b82f6','#a855f7'];const flagP=[];for(let i=0;i<8;i++)flagP.push([-15.75+i*4.5,0,30.2]);
 kit([[cyl,MS(0xd1d5db,{metalness:.7,roughness:.3}),[0,3.5,0],[0,0,0],[.1,7,.1]],[sph,goldM,[0,7.05,0],[0,0,0],[.22,.22,.22]]],flagP);
 const flagT=cv(64,64,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,64,64);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(0,21,64,22)});
 const flags=new T.InstancedMesh(new T.PlaneGeometry(1,1,6,1).translate(.5,0,0),MS(0xffffff,{map:flagT,side:T.DoubleSide,emissive:0x111111}),flagP.length);
 flagP.forEach((p,i)=>flags.setColorAt(i,col.set(FL[i%FL.length])));G.add(flags);
 D.fx.push(t=>{flagP.forEach((p,i)=>{o3.position.set(p[0]+.05,6.2,p[2]);o3.rotation.set(0,Math.sin(t*1.7+i)*.35+.4,Math.sin(t*3+i)*.05);o3.scale.set(2.2*(.93+Math.sin(t*5+i*1.3)*.07),1.35,1);o3.updateMatrix();flags.setMatrixAt(i,o3.matrix)});flags.instanceMatrix.needsUpdate=true});

 // ================= KIS SZÍNPAD a tér bal-hátsó részén (utcazenész) =================
 {const sx=-23,sz=36-12;mesh(new T.CylinderGeometry(3,3.2,.5,24),MS(0x312e81,{roughness:.6}),sx,.25,sz);
  const rim=mesh(new T.TorusGeometry(3.05,.06,6,40),MB(0xa78bfa,{toneMapped:false}),sx,.52,sz);rim.rotation.x=Math.PI/2;
  kit([[box,darkM,[0,.7,0],[0,0,0],[.9,1.4,.7]],[box,MB(0x111111),[0,.9,.36],[0,0,0],[.6,.6,.02]]],[[sx-2,.5,sz+1,-.4],[sx+2,.5,sz+1,.4]]);
  sign('ÉLŐ ZENE','#a78bfa','#f5f3ff',5,1.3,sx,4,sz+2.6,Math.PI,false)}

 // ================= JÁRÓKELŐK (instancolt, lépő lábakkal) =================
 const SK=['#f1c27d','#e0ac69','#c68642','#8d5524','#ffdbac'],SH=['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899','#14b8a6','#f8fafc','#334155','#eab308'],PN=['#1f2937','#334155','#1e3a8a','#3f3f46','#78350f'];
 const paths=[];
 for(let i=0;i<6;i++)paths.push({k:'c',cx:0,cz:FZ,r:RR(6.2,7.4),ph:R()*6.28,v:RR(.13,.2)*(i%2?1:-1)});   // kút körül
 for(let i=0;i<6;i++)paths.push({k:'x',z:i%2?40.3:41.8,x0:-58,x1:58,ph:R(),v:RR(.012,.02)*(i%2?1:-1)}); // hátsó járda
 for(let i=0;i<4;i++)paths.push({k:'z',x:-25.8+RR(-.5,.5),z0:-4,z1:30,ph:R(),v:RR(.018,.03)*(i%2?1:-1)});  // piac
 for(let i=0;i<3;i++)paths.push({k:'z',x:25.5,z0:-10,z1:24,ph:R(),v:RR(.02,.03)*(i%2?1:-1)});            // parkoló
 for(let i=0;i<2;i++)paths.push({k:'z',x:i?-39.6:39.6,z0:-26,z1:34,ph:R(),v:RR(.012,.02)});              // oldalsó járdák
 const NP=paths.length;
 const pAt=(p,t)=>{if(p.k==='c'){const a=p.ph+t*p.v;return [p.cx+Math.cos(a)*p.r,p.cz+Math.sin(a)*p.r]}
  const u=(p.ph+t*Math.abs(p.v))%2,w=u<1?u:2-u,dir=(u<1)===(p.v>0);if(p.k==='x'){const x=p.x0+(p.x1-p.x0)*(dir?w:1-w);return [x,p.z]}return [p.x,p.z0+(p.z1-p.z0)*(dir?w:1-w)]};
 const pp=new Array(NP).fill(0).map(()=>[0,0,0]);
 const torso=kit([[box,MS(0xffffff),[0,1.25,0],[0,0,0],[.55,.75,.32],SH]],pp),head=kit([[box,MS(0xffffff),[0,1.85,0],[0,0,0],[.38,.38,.38],SK]],pp),
  hair=kit([[box,MS(0xffffff),[0,2.07,-.02],[0,0,0],[.4,.12,.4],['#1f1300','#3b2a1a','#d4a017','#111111','#8b4513','#cbd5e1']]],pp);
 const legG=new T.BoxGeometry(.22,.85,.24).translate(0,-.42,0),armG=new T.BoxGeometry(.16,.7,.18).translate(0,-.35,0);
 const legs=new T.InstancedMesh(legG,MS(0xffffff),NP*2),arms=new T.InstancedMesh(armG,MS(0xffffff),NP*2);G.add(legs,arms);
 for(let i=0;i<NP;i++){legs.setColorAt(i*2,col.set(PN[i%5]));legs.setColorAt(i*2+1,col.set(PN[i%5]));arms.setColorAt(i*2,col.set(SH[i%SH.length]));arms.setColorAt(i*2+1,col.set(SH[i%SH.length]))}
 const pq=new T.Quaternion(),pe=new T.Euler(),pv=new T.Vector3(),one=new T.Vector3(1,1,1),lm=new M4(),pm=new M4();
 D.fx.push(t=>{for(let i=0;i<NP;i++){const p=paths[i],a=pAt(p,t),b=pAt(p,t+.05),ry=Math.atan2(b[0]-a[0],b[1]-a[1]),bob=Math.abs(Math.sin(t*7+i))*.05;
   torso.set(i,a[0],bob,a[1],ry,1,null);head.set(i,a[0],bob,a[1],ry,1,null);hair.set(i,a[0],bob,a[1],ry,1,null);
   const sw=Math.sin(t*7+i)*.5;pe.set(0,ry,0);pq.setFromEuler(pe);pm.compose(pv.set(a[0],bob,a[1]),pq,one);
   [-1,1].forEach((s,j)=>{lm.makeRotationX(sw*s);lm.setPosition(s*.14,.88,0);legs.setMatrixAt(i*2+j,_m.multiplyMatrices(pm,lm));lm.makeRotationX(-sw*s*.8);lm.setPosition(s*.36,1.58,0);arms.setMatrixAt(i*2+j,_m.multiplyMatrices(pm,lm))})}
  torso.upd();head.upd();hair.upd();legs.instanceMatrix.needsUpdate=arms.instanceMatrix.needsUpdate=true});
 D.stats.npc=NP;

 // ================= GALAMBOK (kút körül csipegetnek, időnként felröppennek) =================
 {const NB=18,B=[];for(let i=0;i<NB;i++){const a=R()*6.28,r=RR(5,10);B.push({x:Math.cos(a)*r,z:FZ+Math.sin(a)*r,ry:R()*6.28,fly:0,ph:R()*10,hx:0,hz:0})}
  const body=kit([[sph,MS(0x8b93a1),[0,.18,0],[0,0,0],[.22,.2,.36]]],B.map(b=>[b.x,0,b.z])),hd=kit([[sph,MS(0x6b7280),[0,.32,.15],[0,0,0],[.13,.13,.13]]],B.map(b=>[b.x,0,b.z])),
   wing=kit([[box,MS(0x9ca3af),[0,.25,-.02],[0,0,0],[.6,.03,.22]]],B.map(b=>[b.x,0,b.z]));
  D.fx.push((t,dt)=>{B.forEach((b,i)=>{let y=0,s=1,ws=.45;
    if(b.fly>0){b.fly-=dt;const k=1-b.fly/4;y=Math.sin(k*Math.PI)*6;b.x+=Math.sin(b.ry)*dt*3;b.z+=Math.cos(b.ry)*dt*3;ws=1+Math.sin(t*30)*.4;if(b.fly<=0){y=0;if(Math.hypot(b.x,b.z-FZ)>11||Math.hypot(b.x,b.z-FZ)<4.6){const a=R()*6.28,r=RR(5,10);b.x=Math.cos(a)*r;b.z=FZ+Math.sin(a)*r}}}
    else{if(R()<.0007)b.fly=4;const hop=((t+b.ph)%2.2)<.25;if(hop){b.x+=Math.sin(b.ry)*dt*.8;b.z+=Math.cos(b.ry)*dt*.8;y=Math.sin(((t+b.ph)%2.2)/.25*Math.PI)*.08}if(R()<.01)b.ry+=RR(-1,1)}
    body.set(i,b.x,y,b.z,b.ry,s,null);wing.set(i,b.x,y,b.z,b.ry,ws>.5?1:1,null);const peck=b.fly>0?0:Math.max(0,Math.sin(t*5+b.ph))*.08;hd.set(i,b.x,y-peck,b.z,b.ry,s,null)});
   body.upd();hd.upd();wing.upd();wing.ms[0].visible=true})}

 // ================= HÁTTÉR: városi sziluett + hegyek (360°) =================
 {const sky=[];for(let i=0;i<150;i++){const a=i/150*Math.PI*2;const sea=Math.sin(a)<-.45; // -z irány: tenger mögött messzebb
   const r=sea?RR(175,215):RR(85,125),x=Math.cos(a)*r,z=Math.sin(a)*r+(sea?0:15),h=sea?RR(10,40):RR(16,55),w=RR(6,13);sky.push([x,h/2-.5,z,-a,[w,h,w]])}
  const im=new T.InstancedMesh(box,farM,sky.length);sky.forEach((u,i)=>{o3.position.set(u[0],u[1],u[2]);o3.rotation.set(0,u[3],0);o3.scale.set(...u[4]);o3.updateMatrix();im.setMatrixAt(i,o3.matrix)});G.add(im);
  // néhány tornyos csúcs piros jelzőfénnyel
  const tips=sky.filter((s,i)=>s[4][1]>40).map(s=>[s[0],s[4][1]+.5,s[2]]);
  const tg=new T.BufferGeometry();tg.setAttribute('position',new T.Float32BufferAttribute(tips.flat(),3));const tm=new T.PointsMaterial({map:glowTex,color:0xff3b3b,size:4,transparent:true,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false,sizeAttenuation:true});G.add(new T.Points(tg,tm));
  D.fx.push(t=>{tm.opacity=.4+.6*Math.max(0,Math.sin(t*2.2))});
  const hills=[];for(let i=0;i<34;i++){const a=i/34*Math.PI*2,sea=Math.sin(a)<-.45,r=sea?RR(240,270):RR(150,185);hills.push([Math.cos(a)*r,0,Math.sin(a)*r,R()*6,[RR(40,70),RR(25,60),RR(40,70)]])}
  const hm=new T.InstancedMesh(new T.ConeGeometry(1,1,7).translate(0,.5,0),MS(0x2c3e50,{roughness:1,flatShading:true,emissive:0x0b1626,emissiveIntensity:.6}),hills.length);
  hills.forEach((u,i)=>{o3.position.set(u[0],-2,u[2]);o3.rotation.set(0,u[3],0);o3.scale.set(...u[4]);o3.updateMatrix();hm.setMatrixAt(i,o3.matrix)});G.add(hm);
  const snow=new T.InstancedMesh(new T.ConeGeometry(1,1,7).translate(0,.5,0),MS(0xe5edf7,{roughness:1,flatShading:true}),hills.length);
  hills.forEach((u,i)=>{const s=u[4];o3.position.set(u[0],-2+s[1]*.72,u[2]);o3.rotation.set(0,u[3],0);o3.scale.set(s[0]*.28,s[1]*.28,s[2]*.28);o3.updateMatrix();snow.setMatrixAt(i,o3.matrix)});G.add(snow)}
 // léghajó reklámmal az égen
 {const zt=neon('KÖZPÉNZ ROYALE','#22d3ee','#ffffff');const z=new T.Group();const bl=new T.Mesh(new T.SphereGeometry(1,20,12),MS(0xe5e7eb,{metalness:.3,roughness:.5}));bl.scale.set(7,2.2,2.2);z.add(bl);
  [-1,1].forEach(s=>{const p=new T.Mesh(plane,zt);p.scale.set(10,2.4,1);p.position.set(0,0,s*2.25);if(s<0)p.rotation.y=Math.PI;z.add(p)});
  const gond=new T.Mesh(box,darkM);gond.scale.set(2,.6,.8);gond.position.y=-2.4;z.add(gond);G.add(z);
  D.fx.push(t=>{const a=t*.025;z.position.set(Math.cos(a)*70,32+Math.sin(t*.3)*1.5,15+Math.sin(a)*60);z.rotation.y=-a})}

 // árnyék nélkül (teljesítmény)
 // statikus, azonos anyagú sima mesh-ek összeolvasztása (kevesebb draw call)
 {const by=new Map();G.children.slice().forEach(o=>{if(!o.isMesh||o.isInstancedMesh||o.children.length||o.userData.dyn)return;const k=o.material.uuid;if(!by.has(k))by.set(k,[]);by.get(k).push(o)});
  by.forEach(list=>{if(list.length<2)return;const geos=list.map(o=>{o.updateMatrix();return o.geometry.clone().applyMatrix4(o.matrix)});const m=new T.Mesh(merge(geos),list[0].material);list.forEach(o=>G.remove(o));G.add(m)});D.stats.merged=by.size}
 G.traverse(o=>{o.castShadow=false;o.receiveShadow=false;if(o.isInstancedMesh)o.frustumCulled=false});
 sc.add(G);
 // a lobby régi homok-körét kicsit sötétebbre/aszfaltosabbra nem kell cserélni; a régi elemek maradnak
 if(!L.fx.includes(step))L.fx.push(step);
 D.built=sc;D.stats.children=G.children.length;applyTime(true)}

let lastT=null;
function step(t){if(!D.g||D.sc!==(window.LB3D&&LB3D.sc))return;const on=ON();D.g.visible=on;if(!on)return;
 const dt=lastT==null?.016:Math.min(.1,Math.max(0,t-lastT));lastT=t;
 for(let i=0;i<D.fx.length;i++){try{D.fx[i](t,dt)}catch(e){}}
 applyTime(false)}
let lastA=0;
function applyTime(force){const n=performance.now();if(!force&&n-lastA<1000)return;lastA=n;const N=nightF(hourNow());if(!force&&Math.abs(N-D.N)<.01)return;D.N=N;const m=D.mats;if(!m.winM)return;
 m.winM.emissiveIntensity=.25+N*.75;m.farM.emissiveIntensity=.2+N*.7;(m.shopMs||[]).forEach(s=>s.emissiveIntensity=.2+N*.45);
 if(m.glowM)m.glowM.opacity=.25+N*.7;if(m.poolM)m.poolM.opacity=.08+N*.3;if(m.strM)m.strM.opacity=.4+N*.6;m.lampHeadM.color.setHex(N>.3?0xfff1c4:0xe5e7eb)}
D.rebuild=()=>{const L=window.LB3D;if(L&&L.sc){D.built=null;build(L)}};
D.set=on=>{try{localStorage.setItem('k3lobby3d2',on?'1':'0')}catch(e){}if(on&&!D.g)D.rebuild();if(D.g)D.g.visible=!!on};
setInterval(()=>{const L=window.LB3D;if(!L||!L.sc||!L.fx||typeof THREE==='undefined'||!ON())return;if(D.built===L.sc)return;try{build(L)}catch(e){console.warn('lobby3d2:',e)}},700);
})();
