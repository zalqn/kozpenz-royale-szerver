// jarmu4.js – AUTÓK 2.0 (11-15): részletes „Villám Motors” városi autó (ívelt karosszéria, üveg, belső, lámpák, féknyereg),
// kormányzott első kerekek, karosszéria-dőlés/bólintás, féklámpa + tolatólámpa, gumicsikorgás, fényezés-csillanás (PMREM env map
// minden járműre), részletes parkoló autók (extra80: 2 összevont geometria, InstancedMesh), új kamion (extra120). Debug: _jm4
(function(){'use strict';
const PI=Math.PI,GC={},geo=(k,f)=>GC[k]||(GC[k]=f());
// ---------- környezeti térkép (csillanás) ----------
let ENV=null;
function env(){if(ENV||typeof ren==='undefined'||!ren||!THREE.PMREMGenerator)return ENV;try{
 const s=new THREE.Scene(),g=new THREE.SphereGeometry(50,24,12),c=[],p=g.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i)/50,t=Math.max(0,y);const col=y>0?new THREE.Color(0x9cc8ff).lerp(new THREE.Color(0xffffff),1-t):new THREE.Color(0x3a3f47).lerp(new THREE.Color(0x111111),-y);c.push(col.r,col.g,col.b)}
 g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));s.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide})));
 [[0,40,0,30,1,30],[35,15,0,2,10,30],[-35,12,10,2,6,20]].forEach(b=>{const m=new THREE.Mesh(new THREE.BoxGeometry(b[3],b[4],b[5]),new THREE.MeshBasicMaterial({color:0xffffff}));m.position.set(b[0],b[1],b[2]);s.add(m)});
 const pm=new THREE.PMREMGenerator(ren);ENV=pm.fromScene(s,.04).texture;pm.dispose()}catch(e){ENV=null}return ENV}
function shine(root){const e=env();if(!e)return;root.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];ms.forEach(m=>{if(m&&m.isMeshStandardMaterial&&!m.envMap&&(!m.transparent||m.userData.j4glass)){m.envMap=e;m.envMapIntensity=m.metalness>.3?1:.45;m.needsUpdate=true}})})}
// ---------- anyagok (közösek) ----------
const MS=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c},o||{}));
const M={glass:MS(0x0b1220,{metalness:.9,roughness:.05,transparent:true,opacity:.55}),chrome:MS(0xe5e7eb,{metalness:1,roughness:.12}),
 black:MS(0x0a0a0a,{roughness:.6}),tire:MS(0x141414,{roughness:.92}),rim:MS(0xc7ccd4,{metalness:.95,roughness:.2}),inter:MS(0x27272a,{roughness:.85}),
 seat:MS(0x3f2a1e,{roughness:.7}),head:MS(0xffffff,{emissive:0xfff6d5,emissiveIntensity:1.2,roughness:.1}),cal:MS(0xdc2626,{roughness:.4}),
 plate:MS(0xf8fafc,{roughness:.5}),disc:MS(0x6b7280,{metalness:.8,roughness:.35}),amber:MS(0xf59e0b,{emissive:0xb45309,emissiveIntensity:.6})};
M.glass.userData.j4glass=1;
// ---------- karosszéria-profilok ----------
function ext(shape,w,bev){const g=new THREE.ExtrudeGeometry(shape,{depth:w,bevelEnabled:true,bevelThickness:bev,bevelSize:bev,bevelSegments:3,curveSegments:10});g.translate(0,0,-w/2);g.rotateY(-PI/2);g.computeVertexNormals();return g}
const bodyGeo=()=>geo('body',()=>{const s=new THREE.Shape();s.moveTo(-2.08,.3);s.lineTo(-1.78,.3);s.absarc(-1.3,.38,.47,PI,0,true);s.lineTo(.82,.3);s.absarc(1.3,.38,.47,PI,0,true);
 s.lineTo(2.02,.3);s.quadraticCurveTo(2.16,.32,2.13,.6);s.quadraticCurveTo(2.1,.84,1.86,.87);s.lineTo(.72,1);s.lineTo(-1.5,1.02);s.quadraticCurveTo(-2.04,1.02,-2.1,.8);s.quadraticCurveTo(-2.15,.42,-2.08,.3);return ext(s,1.76,.07)});
const cabGeo=()=>geo('cab',()=>{const s=new THREE.Shape();s.moveTo(.78,.98);s.quadraticCurveTo(.25,1.48,-.1,1.52);s.lineTo(-.85,1.52);s.quadraticCurveTo(-1.22,1.48,-1.52,1);s.lineTo(.78,.98);return ext(s,1.5,.05)});
const roofGeo=()=>geo('roof',()=>{const s=new THREE.Shape();s.moveTo(.05,1.5);s.lineTo(-.9,1.5);s.quadraticCurveTo(-1,1.54,-.95,1.565);s.lineTo(-.05,1.565);s.quadraticCurveTo(.12,1.55,.05,1.5);return ext(s,1.48,.04)});
const BX=(w,h,d)=>geo('b'+w+'_'+h+'_'+d,()=>new THREE.BoxGeometry(w,h,d));
const CY=(r1,r2,h,n)=>geo('c'+r1+'_'+r2+'_'+h+'_'+n,()=>{const g=new THREE.CylinderGeometry(r1,r2,h,n);g.rotateZ(PI/2);return g});
// részek: [geo, anyagkulcs ('P'=fényezés), x,y,z, rx,ry,rz]
function parts(){const P=[];const a=(g,m,x,y,z,rx,ry,rz)=>P.push([g,m,x,y||0,z||0,rx||0,ry||0,rz||0]);
 a(bodyGeo(),'P',0,0,0);a(cabGeo(),'glass',0,0,0);a(roofGeo(),'P',0,0,0);
 [-.74,.74].forEach(x=>{a(BX(.06,.5,.08),'P',x,1.24,-.4,0,0,x>0?-.18:.18)});// B-oszlop
 a(BX(1.5,.2,.08),'black',0,.55,2.17);for(let i=0;i<4;i++)a(BX(1.4,.025,.03),'chrome',0,.47+i*.055,2.2);// hűtőrács
 [-.62,.62].forEach(x=>{a(BX(.42,.13,.08),'head',x,.74,2.1);a(BX(.48,.17,.06),'chrome',x,.74,2.08);a(BX(.08,.06,.06),'amber',x*1.32,.72,2.05);
  a(BX(.44,.13,.06),'tail',x,.8,-2.14);a(BX(.12,.08,.04),'rev',x*.55,.8,-2.15);
  a(BX(.04,.12,.22),'P',x*1.47,1.06,.62);a(BX(.03,.09,.17),'glass',x*1.5,1.06,.6);// tükör
  a(BX(.03,.035,.16),'chrome',x*1.43,.86,.18);a(BX(.03,.035,.16),'chrome',x*1.43,.86,-.78)});// kilincs
 a(BX(1.98,.13,.1),'black',0,.33,2.13);a(BX(1.98,.13,.1),'black',0,.35,-2.12);// lökhárító
 a(BX(.52,.12,.02),'plate',0,.45,2.24);a(BX(.52,.12,.02),'plate',0,.56,-2.2);
 a(CY(.05,.05,.25,8),'chrome',.5,.3,-2.12,0,PI/2,0);
 a(BX(1.82,.03,3.2),'black',0,.62,0);// küszöb-csík
 [[-.38,.2],[.38,.2]].forEach(p=>{a(BX(.46,.1,.5),'seat',p[0],.78,p[1]-.35);a(BX(.46,.5,.12),'seat',p[0],1.02,p[1]-.62)});a(BX(1.3,.1,.5),'seat',0,.78,-1.05);a(BX(1.3,.45,.12),'seat',0,.98,-1.3);
 a(BX(1.5,.18,.35),'inter',0,.98,.55);a(geo('sw',()=>new THREE.TorusGeometry(.15,.02,6,16)),'black',-.38,1.03,.32,-.5,0,0);
 return P}
function mxOf(p){return new THREE.Matrix4().compose(new THREE.Vector3(p[2],p[3],p[4]),new THREE.Quaternion().setFromEuler(new THREE.Euler(p[5],p[6],p[7])),new THREE.Vector3(1,1,1))}
// anyagonként összevont karosszéria (közös minden autónak) → ~11 draw call / autó
const carGeos=()=>geo('cars',()=>{const by={};parts().forEach(p=>(by[p[1]]=by[p[1]]||[]).push([p[0],mxOf(p)]));const o={};for(const k in by)o[k]=merge(by[k]);return o});
// ---------- kerék ----------
const WR=.38,WW=.28;
const rimGeo=()=>geo('rimall',()=>{const l=[[CY(WR*.64,WR*.64,WW+.02,18),new THREE.Matrix4()],[CY(.07,.07,WW+.07,8),new THREE.Matrix4()]];for(let i=0;i<5;i++)l.push([BX(WW+.05,WR*1.18,.06),new THREE.Matrix4().makeRotationX(i*PI*2/5)]);return merge(l)});
function mkWheel(){const sp=new THREE.Group();sp.add(new THREE.Mesh(CY(WR,WR,WW,22),M.tire));sp.add(new THREE.Mesh(rimGeo(),M.rim));
 sp.userData.r=WR;return sp}
function wheelSet(g,front){const W=[],PV=[];[[-.86,1.3],[.86,1.3],[-.86,-1.3],[.86,-1.3]].forEach(p=>{const pv=new THREE.Group();pv.position.set(p[0],WR,p[1]);
 const d=new THREE.Mesh(CY(.24,.24,.03,16),M.disc);d.position.x=-Math.sign(p[0])*.06;pv.add(d);const c=new THREE.Mesh(BX(.07,.12,.18),M.cal);c.position.set(-Math.sign(p[0])*.05,.13,-.06);pv.add(c);
 const w=mkWheel();pv.add(w);g.add(pv);W.push(w);if(p[1]>0)PV.push(pv)});return{W,PV}}
// ---------- játékos-autó ----------
function buildCar(v){const keep=new Set([v.lb].concat(v.hl||[]));v.m.children.slice().forEach(o=>{if(!keep.has(o))v.m.remove(o)});
 const bd=new THREE.Group();v.m.add(bd);const tail=MS(0x7f1d1d,{emissive:0xff1a1a,emissiveIntensity:.5}),rev=MS(0xe5e7eb,{emissive:0xffffff,emissiveIntensity:0});
 v.paint.roughness=.28;v.paint.metalness=Math.max(v.paint.metalness,.45);
 const MM=Object.assign({P:v.paint,tail,rev},M);Object.entries(carGeos()).forEach(([k,g])=>{const m=new THREE.Mesh(g,MM[k]);if(k==='P')m.castShadow=true;bd.add(m)});
 const ws=wheelSet(v.m);v.wh=ws.W;v.j4={bd,pv:ws.PV,tail,rev,st:0,la:v.a,lsp:0,roll:0,pit:0}}
// ---------- hook ----------
const prevOn=window._x14hOnVeh;
window._x14hOnVeh=v=>{try{prevOn&&prevOn(v)}catch(e){}try{if(v.k==='car'&&!v.j4)buildCar(v);shine(v.m)}catch(e){console.error('jarmu4',e)}};
// ---------- gumicsikorgás ----------
let SQ=null;function squeal(x){try{if(!SQ){if(x<.05)return;const A=new (window.AudioContext||window.webkitAudioContext)(),b=A.createBuffer(1,A.sampleRate,A.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const s=A.createBufferSource();s.buffer=b;s.loop=true;const f=A.createBiquadFilter();f.type='bandpass';f.frequency.value=2300;f.Q.value=6;const g=A.createGain();g.gain.value=0;s.connect(f);f.connect(g);g.connect(A.destination);s.start();SQ={A,g}}
 SQ.g.gain.setTargetAtTime(Math.min(.06,x*.06),SQ.A.currentTime,.06)}catch(e){}}
// ---------- kamion ----------
function buildTruck(T){const t=T.m;t.children.slice().forEach(o=>{if(!o.isSprite)t.remove(o)});const g=new THREE.Group();g.rotation.y=PI/2;t.add(g);
 const red=MS(0xb91c1c,{metalness:.55,roughness:.3}),box=MS(0xe2e8f0,{metalness:.3,roughness:.5});
 const cs=new THREE.Shape();cs.moveTo(2.2,.7);cs.lineTo(4.3,.7);cs.lineTo(4.35,2.1);cs.quadraticCurveTo(4.25,3.1,3.6,3.3);cs.lineTo(2.2,3.3);cs.lineTo(2.2,.7);
 const cab=new THREE.Mesh(geo('tcab',()=>ext(cs,2.4,.1)),red);cab.castShadow=true;g.add(cab);
 const add=(gg,m,x,y,z,ry)=>{const o=new THREE.Mesh(gg,m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;g.add(o);return o};
 add(BX(2.1,.9,.06),M.glass,0,2.55,4.32).rotation.x=-.2;[-1.23,1.23].forEach(x=>{add(BX(.06,.7,1),M.glass,x,2.6,3.5);add(BX(.08,.5,.12),M.chrome,x*1.12,2.4,4.1);add(BX(.45,.22,.06),M.head,x*.75,1.1,4.38);add(CY(.07,.07,1.6,8),M.chrome,x*.9,3.6,2.3).rotation.z=PI/2});
 for(let i=0;i<6;i++)add(BX(1.4,.05,.05),M.chrome,0,1.3+i*.12,4.38);add(BX(2.5,.25,.2),M.chrome,0,.75,4.4);
 const tb=new THREE.Shape();tb.moveTo(-4.4,1);tb.lineTo(2,1);tb.lineTo(2,3.7);tb.lineTo(-4.4,3.7);tb.lineTo(-4.4,1);
 const tr=add(geo('ttr',()=>ext(tb,2.5,.04)),box,0,0,0);tr.castShadow=true;
 const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='#e2e8f0';x.fillRect(0,0,512,128);x.fillStyle='#b91c1c';x.fillRect(0,96,512,14);x.font='bold 64px sans-serif';x.fillStyle='#1e293b';x.textAlign='center';x.fillText('FUVAR-KFT',256,78);
 const tm=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),roughness:.5});[-1.3,1.3].forEach(xx=>{add(BX(.01,2.2,6),tm,xx,2.35,-1.2)});
 for(let i=0;i<9;i++)add(BX(2.6,.04,.04),M.chrome,0,1.05,-4.3+i*.78);
 const W=[];[[3.4],[-.9],[-1.9],[-3.3]].forEach(([z])=>[-1.05,1.05].forEach(xx=>{const w=new THREE.Group();w.add(new THREE.Mesh(CY(.55,.55,.4,20),M.tire));w.add(new THREE.Mesh(CY(.34,.34,.42,14),M.rim));for(let i=0;i<4;i++){const s=new THREE.Mesh(BX(.43,.6,.06),M.chrome);s.rotation.x=i*PI/4;w.add(s)}w.position.set(xx,.55,z);g.add(w);W.push(w)}));
 [-1,1].forEach(xx=>add(BX(.35,.15,.05),MS(0x7f1d1d,{emissive:0xff1a1a,emissiveIntensity:.7}),xx,1.2,-4.46));
 shine(t);T.j4={W,lx:T.x,lz:T.z}}
// ---------- parkoló autók (extra80 hívja) ----------
function merge(list){const pos=[],nor=[];list.forEach(([gg,mx])=>{const g=gg.index?gg.toNonIndexed():gg.clone();g.applyMatrix4(mx);pos.push(...g.attributes.position.array);nor.push(...g.attributes.normal.array)});
 const o=new THREE.BufferGeometry();o.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));o.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return o}
function parkGeo(){return geo('park',()=>{const paint=[],rest={};const mx=(x,y,z,rx,ry,rz)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)),new THREE.Vector3(1,1,1));
 parts().forEach(p=>{if(p[1]==='seat'||p[1]==='inter'||p[0]===GC.sw)return;const m=mx(p[2],p[3],p[4],p[5],p[6],p[7]);(p[1]==='P'?paint:(rest[p[1]]=rest[p[1]]||[])).push([p[0],m])});
 [[-.86,1.3],[.86,1.3],[-.86,-1.3],[.86,-1.3]].forEach(q=>{(rest.tire=rest.tire||[]).push([CY(WR,WR,WW,14),mx(q[0],WR,q[1],0,0,0)]);(rest.rim=rest.rim||[]).push([CY(WR*.64,WR*.64,WW+.02,12),mx(q[0],WR,q[1],0,0,0)])});
 // egy geometria vertex-színekkel a nem-fényezett részekre
 const COL={glass:0x0b1220,chrome:0xd1d5db,black:0x0a0a0a,head:0xfff8e1,amber:0xf59e0b,tail:0xb91c1c,rev:0xe5e7eb,plate:0xf8fafc,tire:0x141414,rim:0xc7ccd4};
 const gs=[],cols=[];Object.entries(rest).forEach(([k,l])=>{const g=merge(l);gs.push(g);const c=new THREE.Color(COL[k]||0x333333);for(let i=0;i<g.attributes.position.count;i++)cols.push(c.r,c.g,c.b)});
 const r=merge(gs.map(g=>[g,new THREE.Matrix4()]));r.setAttribute('color',new THREE.Float32BufferAttribute(cols,3));
 return{paint:merge(paint),rest:r,restMat:MS(0xffffff,{vertexColors:true,metalness:.6,roughness:.25,envMap:env(),envMapIntensity:.8}),env:env()}})}
// ---------- képkocka-hurok ----------
let lt=0;function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,(t-lt)/1000||0);lt=t;let X=null;try{X=window._x14h&&window._x14h()}catch(e){}
 let sq=0;if(X&&X.veh){const keys=(window._x14hApi&&window._x14hApi.keys())||{};X.veh.forEach(v=>{const j=v.j4;if(!j||v.dead)return;const me=X.drive===v;
  const st=me?((keys.a||keys.arrowleft)?1:0)-((keys.d||keys.arrowright)?1:0):0;j.st+=(st*.45-j.st)*Math.min(1,dt*10);j.pv.forEach(p=>p.rotation.y=j.st);
  const yaw=(v.a-j.la)/Math.max(dt,.001),acc=(v.sp-j.lsp)/Math.max(dt,.001);j.la=v.a;j.lsp=v.sp;
  j.roll+=(Math.max(-.07,Math.min(.07,yaw*v.sp*.004))-j.roll)*Math.min(1,dt*6);j.pit+=(Math.max(-.05,Math.min(.05,-acc*.0025))-j.pit)*Math.min(1,dt*6);
  j.bd.rotation.set(v.air?0:j.pit,0,v.air?0:j.roll);j.bd.position.y=v.air?-.04:Math.abs(j.roll)*.3;
  const brake=me&&(((keys.s||keys.arrowdown)&&v.sp>1)||((keys.w||keys.arrowup)&&v.sp<-1)||(keys.shift&&Math.abs(v.sp)>2));j.tail.emissiveIntensity=brake?2.6:.5;j.rev.emissiveIntensity=v.sp<-.5?1.5:0;
  if(me&&!v.air&&keys.shift&&Math.abs(v.sp)>10)sq=Math.min(1,Math.abs(v.sp)/30)})}
 squeal(sq);
 try{const T=window._x120&&window._x120().M&&window._x120().M.truck;if(T&&T.m&&!T.dead){if(!T.j4)buildTruck(T);const d=Math.hypot(T.x-T.j4.lx,T.z-T.j4.lz);T.j4.lx=T.x;T.j4.lz=T.z;T.j4.W.forEach(w=>w.rotation.x+=d/.55)}}catch(e){}}
requestAnimationFrame(loop);
window._jm4={parkGeo,buildCar,buildTruck,env,M};
})();
