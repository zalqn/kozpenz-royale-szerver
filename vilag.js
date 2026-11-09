// ===== MENTSD MEG A VILÁGOT: teljesen új, nyitott világ – 9 táj, 18 küldetés, NPC-k, saját lények =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){console.error(e)}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const ON=()=>window.GAME_MODE==='stw';
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const H2=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
let W=null;window._STW=()=>W;

// ---------- világ alakja ----------
const ORIG=HU.map(p=>p.slice());
const WHU=(()=>{const P=[],N=80;for(let i=0;i<N;i++){const a=i/N*6.2832,k=1+.07*Math.sin(3*a+.4)+.05*Math.cos(5*a+1.1)+.03*Math.sin(7*a+2);P.push([Math.cos(a)*255*k,Math.sin(a)*255*k])}return P})();
function setHU(a){HU.length=0;a.forEach(p=>HU.push(p.slice()))}

// ---------- tájak ----------
const BI=[
 {id:'camp',n:'Menedék-völgy',e:'🏕️',x:0,z:0,c:0x5f9e45,fog:0x3a4470,fn:110,ff:340},
 {id:'tun',n:'Fagyos Tundra',e:'❄️',x:0,z:-165,c:0xe4edf6,fog:0xc4d4ec,fn:60,ff:230},
 {id:'vol',n:'Hamuföld',e:'🌋',x:165,z:0,c:0x3b2c27,fog:0x4a2418,fn:50,ff:220},
 {id:'mus',n:'Gombaerdő',e:'🍄',x:-170,z:0,c:0x4a3d72,fog:0x2b1850,fn:45,ff:200},
 {id:'des',n:'Napégette Romok',e:'🏜️',x:0,z:165,c:0xd9b46c,fog:0xd8a868,fn:80,ff:300},
 {id:'lak',n:'Kristálytó',e:'💎',x:118,z:118,c:0x6fae5c,fog:0x2f6a8a,fn:90,ff:320},
 {id:'swa',n:'Ködmocsár',e:'🐸',x:-118,z:118,c:0x46532f,fog:0x3c4a32,fn:18,ff:120},
 {id:'sky',n:'Szélfennsík',e:'🌬️',x:-118,z:-118,c:0x8cc56a,fog:0x6a8ccf,fn:110,ff:360},
 {id:'obs',n:'Csillagszirt',e:'🔭',x:118,z:-118,c:0x8b8f99,fog:0x2a2f5a,fn:80,ff:300}];
const BID={};BI.forEach(b=>BID[b.id]=b);
function biomeAt(x,z){if(Math.hypot(x,z)<58)return BI[0];let best=BI[1],bd=1e9;for(let i=1;i<BI.length;i++){const d=H2(x,z,BI[i].x,BI[i].z);if(d<bd){bd=d;best=BI[i]}}return best}

// ---------- segédek ----------
const MC={};const MS=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{})))};
const GL=(c,i)=>MS(c,{emissive:c,emissiveIntensity:i||1});
function mesh(geo,m,x,y,z,par){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;(par||scene).add(o);return o}
let RES=[];
function free(x,z,r){if(!hin(x,z)||!hin(x+r+3,z)||!hin(x-r-3,z)||!hin(x,z+r+3)||!hin(x,z-r-3))return false;return RES.every(o=>H2(x,z,o.x,o.z)>o.r+r)}
function resv(x,z,r){RES.push({x,z,r})}
function rpIn(cx,cz,r0,r1,rad,bid){for(let k=0;k<300;k++){const a=R()*6.283,r=rnd(r0,r1),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(bid&&biomeAt(x,z).id!==bid)continue;if(free(x,z,rad))return[x,z]}return null}
function plat(x,z,hw,hd,h){G.plat.push({x,z,hw,hd,h})}
function roundPlat(x,z,r,h){plat(x,z,r*.92,r*.38,h);plat(x,z,r*.38,r*.92,h);plat(x,z,r*.7,r*.7,h)}
function label(t,sz,y,par){const s=spr(t,sz,'x');s.position.y=y;s.material.depthTest=false;s.renderOrder=5;par.add(s);return s}
const M4=new THREE.Matrix4(),Q4=new THREE.Quaternion(),V3=new THREE.Vector3(),S3=new THREE.Vector3(),E3=new THREE.Euler();
function mtx(x,y,z,s,ry,sy,rx){E3.set(rx||0,ry||0,0);Q4.setFromEuler(E3);return new THREE.Matrix4().compose(V3.set(x,y,z).clone(),Q4.clone(),S3.set(s,sy||s,s).clone())}
function inst(geo,m,list,cols){if(!list.length)return null;const im=new THREE.InstancedMesh(geo,m,list.length);list.forEach((mx,i)=>{im.setMatrixAt(i,mx);if(cols)im.setColorAt(i,new THREE.Color(cols[i]))});im.castShadow=true;im.receiveShadow=true;if(cols&&im.instanceColor)im.instanceColor.needsUpdate=true;scene.add(im);return im}
const ZERO=new THREE.Matrix4().makeScale(0,0,0);

// ---------- statikus világ ----------
let NODES=[],LAVA=[],SW=[];const P={};
function buildWorld(){const g=G;g.arh=true;g.plat=[];g.yachts=[];g.kio=[];g.cities=[];RES=[];NODES=[];LAVA=[];SW=[];
 // ég
 scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius>=1000){o.material=new THREE.MeshBasicMaterial({map:skyCanvas(),side:THREE.BackSide,fog:false,toneMapped:false})}});
 scene.background=new THREE.Color(0x1a1f45);scene.fog=new THREE.Fog(0x3a4470,110,340);
 if(window.HEMI){HEMI.color.set(0xc7d6ff);HEMI.groundColor.set(0x3a2f4a);HEMI.intensity=.95}if(window.SUN){SUN.color.set(0xe6ecff);SUN.intensity=.85}
 // tenger
 const sea=new THREE.Mesh(new THREE.CircleGeometry(1500,64),new THREE.MeshStandardMaterial({color:0x173f78,emissive:0x0a1a3a,roughness:.2,metalness:.4}));sea.rotation.x=-Math.PI/2;sea.position.y=-1.6;scene.add(sea);
 // talaj – tájanként színezett
 const S=620,N=155,geo=new THREE.PlaneGeometry(S,S,N,N);geo.rotateX(-Math.PI/2);const pos=geo.attributes.position,col=new Float32Array(pos.count*3),c=new THREE.Color(),tc=new THREE.Color(),sand=new THREE.Color(0xdcc690);
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i);if(!hin(x,z)){pos.setY(i,-2.4);sand.toArray(col,i*3);continue}
  let sr=0,sg=0,sb=0,sw=0;BI.forEach(b=>{const d=H2(x,z,b.x,b.z)/(b.id==='camp'?.7:1);const w=1/Math.pow(d*d+400,2);tc.set(b.c);sr+=tc.r*w;sg+=tc.g*w;sb+=tc.b*w;sw+=w});
  const n=1+.07*Math.sin(x*.09)*Math.cos(z*.08)+.05*Math.sin((x+z)*.21)+.03*Math.sin(x*.5+z*.3);c.setRGB(sr/sw*n,sg/sw*n,sb/sw*n);
  if(!hin(x*1.03,z*1.03))c.lerp(sand,.6);c.toArray(col,i*3)}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();
 const gr=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true}));gr.receiveShadow=true;scene.add(gr);
 NPC.forEach(n=>resv(n.x,n.z,4));resv(-160,45,8);const disc=(x,z,r,m,y,L)=>{L=L||1;m=m.clone();m.polygonOffset=true;m.polygonOffsetFactor=-2*L;m.polygonOffsetUnits=-4*L;const d=new THREE.Mesh(new THREE.CircleGeometry(r,48),m);d.rotation.x=-Math.PI/2;d.position.set(x,(y||0)+.05*L,z);d.renderOrder=L;d.receiveShadow=true;scene.add(d);return d};

 // ===== TÁBOR =====
 resv(0,0,34);
 for(let i=0;i<9;i++){const a=i/9*6.283;mesh(new THREE.DodecahedronGeometry(.45,0),MS(0x6b7280),Math.cos(a)*1.7,.25,Math.sin(a)*1.7)}
 for(let i=0;i<4;i++){const l=mesh(new THREE.CylinderGeometry(.18,.18,2.4,8),MS(0x5b3a1e),0,.3,0);l.rotation.z=Math.PI/2;l.rotation.y=i*.8}
 G.col.push({x:0,z:0,r:1.6,h:1});
 const TC=[0xb91c1c,0x2563eb,0x15803d,0xca8a04,0x7c3aed,0xea580c];
 for(let i=0;i<6;i++){const a=i/6*6.283+.5,x=Math.cos(a)*16,z=Math.sin(a)*16;const t=mesh(new THREE.ConeGeometry(2.8,3.6,4),MS(TC[i]),x,1.8,z);t.rotation.y=a+.78;mesh(new THREE.BoxGeometry(.9,1.6,.1),MS(0x1f2937),x-Math.cos(a)*2,0.8,z-Math.sin(a)*2).rotation.y=-a+Math.PI/2;G.col.push({x,z,r:2.3,h:3.4})}
 for(let i=0;i<12;i++){const a=i/12*6.283,x=Math.cos(a)*27,z=Math.sin(a)*27;if(Math.abs(x)<9&&z<0)continue;mesh(new THREE.CylinderGeometry(.12,.15,3.2,6),MS(0x3f2a1a),x,1.6,z);mesh(new THREE.SphereGeometry(.35,10,8),GL(0xffc66b,2),x,3.3,z)}
 // műhely
 mesh(new THREE.BoxGeometry(3.4,1.1,1.8),MS(0x7c4a24),12,.55,4);mesh(new THREE.BoxGeometry(3.6,.16,2),MS(0x9ca3af,{metalness:.6}),12,1.18,4);mesh(new THREE.BoxGeometry(.9,.6,.5),MS(0x374151,{metalness:.7}),12.6,1.55,4);G.col.push({x:12,z:4,r:1.7,h:1.3});
 // küldetéstábla
 mesh(new THREE.BoxGeometry(.25,3,.25),MS(0x5b3a1e),-12.5,1.5,2);mesh(new THREE.BoxGeometry(.25,3,.25),MS(0x5b3a1e),-9.5,1.5,2);mesh(new THREE.BoxGeometry(3.6,2,.15),MS(0x92603a),-11,2.2,2);G.col.push({x:-11,z:2,r:1.6,h:3});
 sgn('📋 KÜLDETÉSTÁBLA (F)',-11,3.9,2,2.2);sgn('🛠️ MŰHELY',12,2.8,4,2);
 // Nagy Kapu
 [-6,6].forEach(dx=>{mesh(new THREE.BoxGeometry(2.2,11,2.2),MS(0x6b6f80),dx,5.5,-30);G.col.push({x:dx,z:-30,r:1.4,h:11})});mesh(new THREE.BoxGeometry(15,1.6,2.6),MS(0x575b6b),0,11.6,-30);
 for(let i=0;i<3;i++)mesh(new THREE.BoxGeometry(17-i*3,.5,9-i*2),MS(0x7b8091),0,.25+i*.5,-30);for(let i=0;i<3;i++)plat(0,-30,(17-i*3)/2,(9-i*2)/2,.5*(i+1));
 sgn('⛩️ A NAGY KAPU',0,13.4,-30,3);
 // ládák, hordók dísznek
 [[6,-10],[-7,-9],[18,-4],[-18,-3]].forEach(([x,z])=>{mesh(new THREE.BoxGeometry(1.2,1.2,1.2),MS(0x8b5a2b),x,.6,z);G.col.push({x,z,r:.9,h:1.2})});

 // ===== FAGYOS TUNDRA =====
 disc(40,-162,18,MS(0xbfe9ff,{roughness:.1,metalness:.3,emissive:0x3a6a8a,emissiveIntensity:.25}),0,1);resv(40,-162,18);
 // jég-zikkurat a lángkőhöz
 P.ice={x:-15,z:-172};resv(-15,-172,16);for(let i=0;i<9;i++){const hw=12-i*1.25,h=.6*(i+1);mesh(new THREE.BoxGeometry(hw*2,.6,hw*2),MS(i%2?0xd6ecff:0xbfe0ff,{roughness:.25,metalness:.2}),-15,h-.3,-172);plat(-15,-172,hw,hw,h)}P.ice.y=5.4;
 // jeti-barlang
 P.cave={x:-62,z:-148};resv(-62,-148,12);[[-4,0],[4,0],[0,-2]].forEach(([dx,dz],i)=>{const r=mesh(new THREE.DodecahedronGeometry(i===2?6:4,1),MS(0x9aa7b8),-62+dx,i===2?3:2.5,-148+dz);G.col.push({x:-62+dx,z:-148+dz,r:i===2?5:3.4,h:6})});
 mesh(new THREE.BoxGeometry(12,1.6,4),MS(0x8c99aa),-62,6.2,-147);
 // vadászkunyhó
 cabin(28,-128,0x5b3a1e);
 // jégtüskék
 {const L=[];for(let i=0;i<60;i++){const p=rpIn(0,-165,10,75,1.5,'tun');if(!p)continue;const s=rnd(.8,2.2);L.push(mtx(p[0],s*1.6,p[1],s,R()*6,s*2,(R()-.5)*.3));G.col.push({x:p[0],z:p[1],r:.9*s,h:3*s})}inst(new THREE.ConeGeometry(.7,1.6,5),MS(0xa5f3fc,{roughness:.1,metalness:.3,emissive:0x0e7490,emissiveIntensity:.35,transparent:true,opacity:.88}),L)}

 // ===== HAMUFÖLD / VULKÁN =====
 P.vol={x:160,z:0};resv(160,0,40);const VT=28;
 for(let i=0;i<VT;i++){const r=38-i*1.03,h=.6*(i+1);const m=mesh(new THREE.CylinderGeometry(r,r+.4,.6,28),MS(i>VT-4?0x4a2a20:(i%2?0x3d2f2a:0x352823)),160,h-.3,0);roundPlat(160,0,r,h)}
 P.volTop=.6*VT;disc(160,0,6.5,GL(0xff5a00,2.2),P.volTop,1);P.fire={x:160,z:-8.5,y:P.volTop};
 // lávatavak
 for(let i=0;i<10;i++){const p=rpIn(160,0,44,70,5,'vol');if(!p)continue;const r=rnd(3,6);disc(p[0],p[1],r,GL(0xff4d00,1.8),0,1);LAVA.push({x:p[0],z:p[1],r});resv(p[0],p[1],r)}
 // obszidián bálvány a lávamező közepén
 P.idol={x:146,z:62};resv(146,62,13);disc(146,62,10,GL(0xff3b00,2),0,1);LAVA.push({x:146,z:62,r:10});
 for(let i=0;i<7;i++){const t=i/6,x=146-11+t*11+(i%2?1.2:-1.2),z=62+(i%2?.9:-.9)*(1-t);const st=mesh(new THREE.CylinderGeometry(1.05,1.15,.5,8),MS(0x2b2b2b),x,.25,z);plat(x,z,.85,.85,.5)}
 mesh(new THREE.CylinderGeometry(1.3,1.5,.9,10),MS(0x1c1917),146,.45,62);plat(146,62,1.1,1.1,.9);
 cabin(118,28,0x3b2a20);
 // elszenesedett csonkok
 {const L=[];for(let i=0;i<55;i++){const p=rpIn(165,0,40,80,1.2,'vol');if(!p)continue;L.push(mtx(p[0],1.2,p[1],1,R()*6,rnd(.8,1.6)));G.col.push({x:p[0],z:p[1],r:.5,h:2.4})}inst(new THREE.CylinderGeometry(.25,.45,2.4,6),MS(0x1c1917),L)}

 // ===== GOMBAERDŐ =====
 P.mus={x:-182,z:4,caps:[]};resv(-182,4,18);
 for(let i=0;i<12;i++){const a=i*.5,rr=12-i*.35,x=-182+Math.cos(a)*rr,z=4+Math.sin(a)*rr,h=1.9+i*1.95,cr=i===11?4:3.1;
  mesh(new THREE.CylinderGeometry(.8,1.1,h,10),MS(0xf1e7d0),x,h/2,z);const cap=mesh(new THREE.SphereGeometry(cr,18,10,0,6.283,0,1.57),MS([0xa21caf,0x7c3aed,0xdb2777,0x0891b2][i%4],{side:THREE.DoubleSide,emissive:[0xa21caf,0x7c3aed,0xdb2777,0x0891b2][i%4],emissiveIntensity:.35}),x,h-.15,z);cap.scale.y=.5;
  G.col.push({x,z,r:1,h:h-.4});plat(x,z,cr*.72,cr*.72,h+.1);P.mus.caps.push({x,z,h:h+.1})}
 const lc=P.mus.caps[11];P.mush={x:lc.x,z:lc.z,y:lc.h};
 cabin(-140,26,0x6b21a8,true);

 // ===== NAPÉGETTE ROMOK =====
 P.pyr={x:0,z:160};resv(0,160,24);const PT=24;for(let i=0;i<PT;i++){const hw=20-i*.78,h=.6*(i+1);mesh(new THREE.BoxGeometry(hw*2,.6,hw*2),MS(i%2?0xd4a861:0xc99a52),0,h-.3,160);plat(0,160,hw,hw,h)}P.sand={x:0,z:160,y:.6*PT};
 P.obel={x:0,z:122};resv(0,122,3);mesh(new THREE.CylinderGeometry(.6,1.2,7,4),MS(0xb08a4f),0,3.5,122).rotation.y=.78;G.col.push({x:0,z:122,r:1.2,h:7});
 P.runes=[];[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([sx,sz],i)=>{const x=sx*24,z=160+sz*24;mesh(new THREE.BoxGeometry(1.6,3.6,.8),MS(0x9a7b4f),x,1.8,z).rotation.y=Math.atan2(-x,160-z);G.col.push({x,z,r:1.1,h:3.6});P.runes.push({x,z});resv(x,z,3)});
 {const L=[];for(let i=0;i<26;i++){const p=rpIn(0,165,20,70,1.5,'des');if(!p)continue;const h=rnd(2,7);L.push(mtx(p[0],h/2,p[1],1,R()*6,h));G.col.push({x:p[0],z:p[1],r:.9,h})}inst(new THREE.CylinderGeometry(.75,.85,1,10),MS(0xe2c48a),L)}
 {const L=[];for(let i=0;i<30;i++){const p=rpIn(0,165,15,80,4,'des');if(!p)continue;L.push(mtx(p[0],0,p[1],1,R()*6,1).multiply(new THREE.Matrix4().makeScale(rnd(4,9),rnd(1,2.2),rnd(3,6))))}inst(new THREE.SphereGeometry(1,14,8,0,6.283,0,1.57),MS(0xe4c27e),L)}
 cabin(30,128,0x92603a);

 // ===== KRISTÁLYTÓ =====
 P.lake={x:120,z:120,r:26};resv(120,120,27);disc(120,120,26,MS(0x2f8fd0,{roughness:.05,metalness:.5,emissive:0x0b3d66,emissiveIntensity:.5}),0,2);disc(120,120,29,MS(0xd8c690),0,1);
 for(let i=0;i<4;i++){const x=96+i*2.4,z=96+i*2.4;mesh(new THREE.BoxGeometry(2.6,.25,2.6),MS(0x8b5a2b),x,.5,z);plat(x,z,1.3,1.3,.6)}
 cabin(88,90,0x1e40af);

 // ===== KÖDMOCSÁR =====
 for(let i=0;i<12;i++){const p=rpIn(-118,118,8,55,4,'swa');if(!p)continue;const r=rnd(3,7);disc(p[0],p[1],r,MS(0x2d3b1f,{roughness:.1,metalness:.3,emissive:0x16210d,emissiveIntensity:.5}),0,1);resv(p[0],p[1],r);SW.push({x:p[0],z:p[1],r})}
 P.hut={x:-132,z:132};resv(-132,132,8);[[-2.5,-2.5],[2.5,-2.5],[2.5,2.5],[-2.5,2.5]].forEach(([dx,dz])=>{mesh(new THREE.CylinderGeometry(.2,.2,3.2,6),MS(0x3f2a1a),-132+dx,1.6,132+dz)});
 mesh(new THREE.BoxGeometry(6.4,.4,6.4),MS(0x4a3220),-132,3.3,132);mesh(new THREE.BoxGeometry(5,3.6,5),MS(0x3f4a2a),-132,5.3,132);mesh(new THREE.ConeGeometry(4.6,3.4,4),MS(0x2a1a10),-132,8.8,132).rotation.y=.78;G.col.push({x:-132,z:132,r:3.4,h:3})
 mesh(new THREE.CylinderGeometry(1.1,.8,1.2,14),MS(0x111111,{metalness:.6}),-124,.6,124);G.col.push({x:-124,z:124,r:1.1,h:1.2});

 // ===== SZÉLFENNSÍK =====
 P.fl={x:-128,z:-136,isl:[]};resv(-128,-136,16);
 for(let i=0;i<12;i++){const a=i*.5,rr=10.5-i*.25,x=-128+Math.cos(a)*rr,z=-136+Math.sin(a)*rr,h=1.9+i*2.05;
  mesh(new THREE.CylinderGeometry(3.1,3.1,.6,14),MS(0x6fbf4a),x,h-.3,z);mesh(new THREE.ConeGeometry(3,3.4,8),MS(0x7a6a58),x,h-2.3,z).rotation.x=Math.PI;plat(x,z,2.3,2.3,h);P.fl.isl.push({x,z,h})}
 const sh=P.fl.isl[11];P.shrine={x:sh.x,z:sh.z,y:sh.h};mesh(new THREE.BoxGeometry(.5,4,.5),MS(0xdc2626),sh.x-1.8,sh.h+2,sh.z);mesh(new THREE.BoxGeometry(.5,4,.5),MS(0xdc2626),sh.x+1.8,sh.h+2,sh.z);mesh(new THREE.BoxGeometry(5,.45,.7),MS(0x1f2937),sh.x,sh.h+4.2,sh.z);
 P.tower={x:-80,z:-150};resv(-80,-150,8);for(let i=0;i<8;i++){const a=i/8*6.283;mesh(new THREE.BoxGeometry(1.3,.7,1.3),MS(0x8a8a8a),-80+Math.cos(a)*4.5,.35,-150+Math.sin(a)*4.5)}
 P.mill={x:-152,z:-98};resv(-152,-98,5);mesh(new THREE.CylinderGeometry(2,3,10,10),MS(0xe7e5e4),-152,5,-98);mesh(new THREE.ConeGeometry(2.6,2.6,10),MS(0x7f1d1d),-152,11.3,-98);G.col.push({x:-152,z:-98,r:2.8,h:10});
 cabin(-98,-108,0xb91c1c,true);

 // ===== CSILLAGSZIRT =====
 P.dome={x:136,z:-132};resv(136,-132,10);mesh(new THREE.CylinderGeometry(8,8,6,24),MS(0xd1d5db),136,3,-132);mesh(new THREE.SphereGeometry(8,24,12,0,6.283,0,1.57),MS(0x9ca3af,{metalness:.6,roughness:.35}),136,6,-132);G.col.push({x:136,z:-132,r:8.3,h:12});
 {const L=[];for(let i=0;i<40;i++){const p=rpIn(118,-118,14,70,2,'obs');if(!p)continue;const s=rnd(1,2.6);L.push(mtx(p[0],s*3,p[1],s,R()*6,s*2.4));G.col.push({x:p[0],z:p[1],r:1.3*s,h:6*s})}inst(new THREE.ConeGeometry(1.4,2.6,6),MS(0x6b7280),L)}
 P.tele=[];for(let i=0;i<3;i++){const p=rpIn(118,-118,25,55,3,'obs');if(!p)continue;P.tele.push({x:p[0],z:p[1]});resv(p[0],p[1],3);[0,2.1,4.2].forEach(a=>{const l=mesh(new THREE.CylinderGeometry(.08,.08,2.6,5),MS(0x1f2937),p[0]+Math.cos(a)*.5,1.2,p[1]+Math.sin(a)*.5);l.rotation.z=Math.cos(a)*.3;l.rotation.x=Math.sin(a)*.3});const tb=mesh(new THREE.CylinderGeometry(.3,.45,3,12),MS(0xb45309,{metalness:.7,roughness:.3}),p[0],2.9,p[1]);tb.rotation.z=.9;G.col.push({x:p[0],z:p[1],r:.9,h:3})}
 cabin(112,-104,0x1e3a8a,true);

 // ===== fák, sziklák, kristályok (nyersanyag) =====
 const trunks=[],oak=[],oakC=[],pine=[],snow=[],shr=[],shrC=[],cac=[],dead=[];
 for(let i=0;i<1400&&NODES.length<820;i++){const x=rnd(-290,290),z=rnd(-290,290);if(!free(x,z,1.5))continue;const b=biomeAt(x,z);if(b.id==='camp'&&Math.hypot(x,z)<36)continue;if(b.id==='lak'&&H2(x,z,120,120)<31)continue;
  const s=rnd(.8,1.35),nd={t:'wood',x,z,r:2.8,left:3,cd:0,ref:[]};const add=(arr,m)=>{arr.push(m);nd.ref.push([arr,arr.length-1,m])};
  if(b.id==='camp'||b.id==='sky'||b.id==='lak'){if(R()<.35&&b.id!=='camp')continue;add(trunks,mtx(x,1.3*s,z,s,0,s));add(oak,mtx(x,3.6*s,z,1.9*s,R()*6,1.6*s));oakC.push(pick([0x3f8f3a,0x4ea04a,0x2f7a32,0x5aa84f,0x6bb34a]))}
  else if(b.id==='tun'||b.id==='obs'){add(trunks,mtx(x,1.3*s,z,s*.8,0,s));add(pine,mtx(x,3.8*s,z,1.6*s,R()*6,2*s));if(b.id==='tun')add(snow,mtx(x,5.3*s,z,1*s,R()*6,1*s))}
  else if(b.id==='mus'){add(shr,mtx(x,0,z,s*1.3,R()*6,s*rnd(1,1.8)));shrC.push(pick([0xc026d3,0x7c3aed,0x0ea5e9,0xf472b6,0x22d3ee]))}
  else if(b.id==='des'){if(R()<.6)continue;add(cac,mtx(x,1.6*s,z,s,R()*6,s))}
  else{add(dead,mtx(x,2*s,z,s,R()*6,s))}
  G.col.push({x,z,r:.6*s,h:4});NODES.push(nd)}
 const tag=(arr,im)=>{arr._im=im};
 tag(trunks,inst(new THREE.CylinderGeometry(.28,.38,2.6,7),MS(0x6b4423),trunks));tag(oak,inst(new THREE.IcosahedronGeometry(1,1),MS(0xffffff),oak,oakC));
 tag(pine,inst(new THREE.ConeGeometry(1,2.4,8),MS(0x1f5a3a),pine));tag(snow,inst(new THREE.ConeGeometry(.7,.9,8),MS(0xf8fafc),snow));
 {const sg=new THREE.CylinderGeometry(.35,.5,3,8);sg.translate(0,1.5,0);const cg=new THREE.SphereGeometry(1.6,14,8,0,6.283,0,1.57);cg.scale(1,.55,1);cg.translate(0,2.9,0);
  tag(shr,inst(sg,MS(0xf5efe0),shr));const sh2=shr.slice();tag(sh2,inst(cg,MS(0xffffff,{side:THREE.DoubleSide,emissive:0x5b21b6,emissiveIntensity:.45}),sh2,shrC));NODES.forEach(n=>n.ref.forEach(r=>{if(r[0]===shr)n.ref.push([sh2,r[1],r[2]])}))}
 tag(cac,inst(new THREE.CylinderGeometry(.4,.45,3.2,8),MS(0x3f7d3a),cac));tag(dead,inst(new THREE.CylinderGeometry(.12,.35,4,5),MS(0x3a2e24),dead));
 // sziklák
 {const L=[],C=[];for(let i=0;i<500&&L.length<150;i++){const x=rnd(-290,290),z=rnd(-290,290);if(!free(x,z,1.6))continue;const b=biomeAt(x,z);if(b.id==='camp'&&Math.hypot(x,z)<36)continue;const s=rnd(1,1.8);const m=mtx(x,s*.5,z,s,R()*6,s*.8,R());L.push(m);C.push({tun:0xb8d4ec,vol:0x26201d,des:0xcaa36b,mus:0x5b4a7a,swa:0x4b5534}[b.id]||0x9a958e);G.col.push({x,z,r:s*.9,h:s*1.2});NODES.push({t:'stone',x,z,r:s+1.9,left:3,cd:0,ref:[[L,L.length-1,m]]})}
  L._im=inst(new THREE.DodecahedronGeometry(1,0),MS(0xffffff),L,C)}
 // kristályok
 {const L=[],C=[];const spots=[['lak',120,120,30,60],['obs',118,-118,10,70],['mus',-170,0,10,70],['tun',0,-165,10,70]];for(let i=0;i<500&&L.length<56;i++){const sp2=pick(spots);const p=rpIn(sp2[1],sp2[2],sp2[3],sp2[4],1.2,sp2[0]);if(!p)continue;const s=rnd(.9,1.6);const m=mtx(p[0],s*1.1,p[1],s,R()*6,s*1.8,(R()-.5)*.4);L.push(m);C.push(pick([0x67e8f9,0xc084fc,0xf0abfc,0x5eead4]));NODES.push({t:'crystal',x:p[0],z:p[1],r:2.5,left:2,cd:0,ref:[[L,L.length-1,m]]})}
  L._im=inst(new THREE.OctahedronGeometry(.7,0),MS(0xffffff,{emissive:0x7dd3fc,emissiveIntensity:.8,roughness:.1,metalness:.2,transparent:true,opacity:.9}),L,C)}
 // virágok/fűcsomók
 {const L=[],C=[];for(let i=0;i<3400&&L.length<1500;i++){const x=rnd(-290,290),z=rnd(-290,290);if(!hin(x,z))continue;const b=biomeAt(x,z);if(!['camp','sky','lak','mus','swa'].includes(b.id))continue;L.push(mtx(x,.25,z,rnd(.6,1.2),R()*6,rnd(.6,1.3)));C.push(b.id==='mus'?pick([0x22d3ee,0xe879f9,0xa78bfa]):b.id==='swa'?0x556b2f:pick([0x4d9a3a,0x5fae44,0xfacc15,0xf472b6,0xffffff,0x60a5fa,0x4d9a3a,0x4d9a3a]))}
  const im=inst(new THREE.ConeGeometry(.18,.5,4),MS(0xffffff,{emissive:0x111111}),L,C);if(im){im.castShadow=false}}
}
function cabin(x,z,col,small){resv(x,z,6);const s=small?.8:1;mesh(new THREE.BoxGeometry(6*s,3.4*s,5*s),MS(0x7a5230),x,1.7*s,z);const r=mesh(new THREE.ConeGeometry(4.6*s,2.6*s,4),MS(col),x,4.7*s,z);r.rotation.y=.78;mesh(new THREE.BoxGeometry(1.2*s,2*s,.1),MS(0x2a1a10),x,1*s,z+2.52*s);G.col.push({x,z,r:3.2*s,h:3.4*s})}
function skyCanvas(){const c=document.createElement('canvas');c.width=2048;c.height=1024;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,0,1024);gr.addColorStop(0,'#05061a');gr.addColorStop(.32,'#131a4a');gr.addColorStop(.47,'#3b3a7a');gr.addColorStop(.5,'#7a5a9a');gr.addColorStop(.53,'#2a2f5a');gr.addColorStop(1,'#0a0c20');x.fillStyle=gr;x.fillRect(0,0,2048,1024);
 for(let i=0;i<900;i++){x.fillStyle='rgba(255,255,255,'+Math.random()*.9+')';const s=Math.random()<.05?2.4:1.1;x.fillRect(Math.random()*2048,Math.random()*470,s,s)}
 x.globalCompositeOperation='lighter';for(let b=0;b<3;b++){const y0=150+b*70;for(let i=0;i<2048;i+=3){const y=y0+Math.sin(i*.006+b*2)*40+Math.sin(i*.017)*12,h=60+Math.sin(i*.011+b)*30;const g2=x.createLinearGradient(0,y,0,y+h);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(.6,b===1?'rgba(168,85,247,.10)':'rgba(52,211,153,.12)');g2.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g2;x.fillRect(i,y,3,h)}}
 x.globalCompositeOperation='source-over';x.fillStyle='#fff8e0';x.shadowColor='#fff';x.shadowBlur=40;x.beginPath();x.arc(1500,260,38,0,6.283);x.fill();
 const t=new THREE.CanvasTexture(c);return t}

// ---------- lények ----------
const CR={
 arny:{base:'prop',hp:90,sp:4.4,mk(){const g=new THREE.Group();mesh(new THREE.SphereGeometry(.95,16,12),MS(0x0b0614,{emissive:0x2e1065,emissiveIntensity:.6}),0,1.3,0,g);const w=mesh(new THREE.ConeGeometry(.8,1.2,10),MS(0x0b0614,{emissive:0x2e1065,emissiveIntensity:.5}),0,.45,0,g);w.rotation.x=Math.PI;eyes(g,0xe879f9,1.45,.85);return g}},
 farkas:{base:'nav',hp:70,sp:7,mk(){const g=new THREE.Group(),m=MS(0xdbeafe);mesh(new THREE.BoxGeometry(.8,.8,1.8),m,0,1,0,g);mesh(new THREE.BoxGeometry(.6,.6,.8),m,0,1.35,1.1,g);[[-.3,.6],[.3,.6],[-.3,-.6],[.3,-.6]].forEach(([a,b])=>mesh(new THREE.BoxGeometry(.18,.7,.18),m,a,.35,b,g));mesh(new THREE.ConeGeometry(.12,.3,4),m,-.2,1.75,1,g);mesh(new THREE.ConeGeometry(.12,.3,4),m,.2,1.75,1,g);eyes(g,0x22d3ee,1.45,1.5,.16);return g}},
 lav:{base:'fact',hp:100,sp:3.6,mk(){const g=new THREE.Group();mesh(new THREE.DodecahedronGeometry(.9,1),MS(0x2a0a00,{emissive:0xff4d00,emissiveIntensity:1.2}),0,1.3,0,g);mesh(new THREE.ConeGeometry(.6,1.4,8),GL(0xffb020,2),0,2.4,0,g);eyes(g,0xfff3b0,1.4,.8);return g}},
 gomba:{base:'vegr',hp:100,sp:4.6,mk(){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(.4,.5,1.2,10),MS(0xf5efe0),0,.6,0,g);const c=mesh(new THREE.SphereGeometry(.95,14,8,0,6.283,0,1.57),MS(0xdb2777,{side:THREE.DoubleSide,emissive:0x9d174d,emissiveIntensity:.5}),0,1.15,0,g);c.scale.y=.7;eyes(g,0x111111,.85,.45,.1);return g}},
 skorp:{base:'vegr',hp:120,sp:5,mk(){const g=new THREE.Group(),m=MS(0x8b5a2b);mesh(new THREE.BoxGeometry(1.2,.5,1.6),m,0,.5,0,g);for(let i=0;i<4;i++){mesh(new THREE.SphereGeometry(.28-i*.03,8,6),m,0,.8+i*.45,-.9-i*.2+(i>2?.6:0),g)}mesh(new THREE.ConeGeometry(.15,.5,5),MS(0x1c1917),0,2.4,-.9,g);[-.6,.6].forEach(dx=>mesh(new THREE.BoxGeometry(.35,.25,.7),m,dx,.55,1.1,g));eyes(g,0xef4444,.8,.8,.1);return g}},
 bog:{base:'prop',hp:140,sp:3.4,mk(){const g=new THREE.Group(),m=MS(0x3f6212,{roughness:.4});mesh(new THREE.SphereGeometry(1.1,12,10),m,0,1.1,0,g);mesh(new THREE.SphereGeometry(.6,10,8),m,.6,1.9,.2,g);mesh(new THREE.SphereGeometry(.5,10,8),m,-.6,1.7,-.1,g);eyes(g,0xfacc15,1.6,1);return g}},
 yeti:{base:'gol',hp:1600,sp:3,boss:1,mk(){const g=new THREE.Group(),m=MS(0xf1f5f9);mesh(new THREE.BoxGeometry(2.6,3,1.8),m,0,2.6,0,g);mesh(new THREE.SphereGeometry(1,14,10),m,0,4.7,.2,g);[-1.6,1.6].forEach(dx=>{mesh(new THREE.BoxGeometry(.8,2.8,.8),m,dx,2.4,.2,g)});[-.6,.6].forEach(dx=>mesh(new THREE.BoxGeometry(.9,1.4,.9),m,dx,.7,0,g));mesh(new THREE.BoxGeometry(1,.4,.2),MS(0x1e293b),0,4.4,1.1,g);eyes(g,0x38bdf8,4.9,1.05,.14);return g}},
 kiraly:{base:'hyd',hp:4200,sp:2.8,boss:1,mk(){const g=new THREE.Group();mesh(new THREE.ConeGeometry(2.4,6,16),MS(0x0b0614,{emissive:0x3b0764,emissiveIntensity:.7}),0,3,0,g);mesh(new THREE.SphereGeometry(1.1,16,12),MS(0x0b0614,{emissive:0x4c1d95,emissiveIntensity:.8}),0,6.6,0,g);for(let i=0;i<7;i++){const a=i/7*6.283;mesh(new THREE.ConeGeometry(.2,.8,4),GL(0xfacc15,1.4),Math.cos(a)*.85,7.7,Math.sin(a)*.85,g)}eyes(g,0xf0abfc,6.7,1,.2);const ring=mesh(new THREE.TorusGeometry(3.2,.12,8,40),GL(0xa855f7,2),0,2.5,0,g);ring.rotation.x=Math.PI/2;g.userData.ring=ring;return g}}};
function eyes(g,c,y,z,s){[-1,1].forEach(k=>mesh(new THREE.SphereGeometry(s||.13,8,6),new THREE.MeshBasicMaterial({color:c}),k*(s?s*2.2:.32),y,z,g))}
const BCR={camp:'arny',tun:'farkas',vol:'lav',mus:'gomba',des:'skorp',swa:'bog',lak:'arny',sky:'arny',obs:'arny'};
const CRN={arny:'ÁRNYLÉNY',farkas:'JÉGFARKAS',lav:'LÁVASZELLEM',gomba:'GOMBAMANÓ',skorp:'HOMOKSKORPIÓ',bog:'MOCSÁRLÉNY',yeti:'A FEHÉR RÉM (JETI)',kiraly:'AZ ÁRNYKIRÁLY'};
Object.keys(CR).forEach(k=>{try{ET[k]=Object.assign({},ET[CR[k].base]);NM[k]=CRN[k]}catch(e){}});
function skin(e,type){const d=CR[type];scene.remove(e.m);e.m=d.mk();e.m.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(e.m);e._vg=type;e.t=type;e.ph=R()*6}
function spawnC(type,x,z){const d=CR[type];const e=sp(d.base,x,z);skin(e,type);e.hp=e.mhp=d.hp*(1+W.lvl*.12);e.sp=d.sp;if(d.boss){e.b=true;e.r=3}G.en.push(e);return e}
function spawnNear(cx,cz,r0,r1,type,n){for(let i=0;i<(n||1);i++){for(let k=0;k<40;k++){const a=R()*6.28,r=rnd(r0,r1),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;if(!hin(x,z)||Math.hypot(x,z)<40)continue;spawnC(type||BCR[biomeAt(x,z).id],x,z);break}}}

// ---------- NPC-k ----------
const NPC=[
 {id:'bolcs',n:'Bölcs Ilka',e:'🧙',c:0x7c3aed,x:-5,z:-14},{id:'kovacs',n:'Kovács Bendegúz',e:'🔨',c:0x92400e,x:12,z:8},{id:'futar',n:'Futár Dóri',e:'📦',c:0x0ea5e9,x:-14,z:7},
 {id:'halasz',n:'Halász Péter',e:'🎣',c:0x2563eb,x:94,z:96},{id:'boszi',n:'Mirtill boszorkány',e:'🧹',c:0x166534,x:-122,z:120},{id:'gombasz',n:'Gombász Nimród',e:'🍄',c:0xbe185d,x:-140,z:33},
 {id:'csill',n:'Csillagász Vince',e:'🔭',c:0x1e3a8a,x:112,z:-97},{id:'kincs',n:'Kincsvadász Zsiga',e:'🗺️',c:0xb45309,x:30,z:136},{id:'biro',n:'Versenybíró Tas',e:'🏁',c:0xdc2626,x:-98,z:-101},
 {id:'gerda',n:'Vadász Gerda',e:'🏹',c:0x64748b,x:28,z:-120},{id:'pasztor',n:'Pásztor Bori',e:'🐑',c:0x65a30d,x:-132,z:-84},{id:'remete',n:'Hamu-remete',e:'🔥',c:0x7f1d1d,x:118,z:37}];
const NP={};NPC.forEach(n=>NP[n.id]=n);
function npcSpawn(){NPC.forEach(n=>{const m=person(n.c,n.e,1);m.position.set(n.x,0,n.z);m.rotation.y=Math.atan2(-n.x,-n.z);scene.add(m);n.m=m;n.lb=label(n.n,1.7,4.7,m);n.mk=label('❗',2.4,6,m);G.col.push({x:n.x,z:n.z,r:.8,h:2.6})})}

// ---------- küldetések ----------
const RW=(zs,ftv,xp)=>({zs,ft:ftv,xp});
const QD=[
 {id:'main',npc:'bolcs',t:'Az Árnyék ébredése',main:1,rw:RW(500,8000,800),
  d:'Utazó, jókor jöttél! Az Árnykirály felébredt, és sűrű köd nyeli el a világot. Négy ősi lángkő őrzi még a fényt: a Fagyos Tundra jégtemplomán, a Hamuföld vulkánjának peremén, a Gombaerdő legmagasabb kalapján és a Napégette Romok piramisának csúcsán. Gyújtsd meg mind a négyet!',
  dn:'Mind a négy lángkő ég! Érzem, ahogy a köd megremeg. De az Árnykirály még nem adta fel...',turn:1,
  acc(q){q.b={ice:0,fire:0,mush:0,sand:0};const r=W.q.runes;if(r.st==='locked'){r.st='active';QM.runes.acc(r)}},
  goal(q){const k=Object.values(q.b).filter(Boolean).length;return'Lángkövek: '+k+'/4  '+(q.b.ice?'❄️✅':'❄️')+' '+(q.b.fire?'🔥✅':'🔥')+' '+(q.b.mush?'🍄✅':'🍄')+' '+(q.b.sand?'☀️✅':'☀️')},
  tgt(q){const L=[['ice',P.ice,'Jég-lángkő'],['fire',P.fire,'Tűz-lángkő'],['mush',P.mush,'Gomba-lángkő'],['sand',P.sand,'Nap-lángkő']].filter(a=>!q.b[a[0]]);if(!L.length)return null;L.sort((a,b)=>H2(G.x,G.z,a[1].x,a[1].z)-H2(G.x,G.z,b[1].x,b[1].z));const a=L[0];if(a[0]==='sand'&&!W.runeOK)return{x:P.obel.x,z:P.obel.z,n:'Rúna-obeliszk (a piramis zárva)'};return{x:a[1].x,z:a[1].z,n:a[2]}},
  holds(q){const r=[];[['ice',P.ice],['fire',P.fire],['mush',P.mush],['sand',P.sand]].forEach(([k,p])=>{if(q.b[k])return;if(k==='sand'&&!W.runeOK)return;if(Math.abs(G.y-p.y)>2.2)return;r.push({x:p.x,z:p.z,r:3.4,dur:4,l:'🔥 Lángkő meggyújtása…',fn(){q.b[k]=1;lightBeacon(k);if(Object.values(q.b).every(Boolean))ready(q)}})});return r}},
 {id:'final',npc:'bolcs',t:'A Nagy Kapu',main:1,req:['main'],rw:RW(2000,30000,2500),
  d:'A négy láng fénye a Nagy Kapuban gyűlik össze. Állj a Kapu elé, és tarts ki egy teljes percig, amíg a fény feltöltődik! Az Árnykirály mindent ellened küld majd – és a végén ő maga is eljön.',
  acc(q){q.t=0;q.w=3;q.boss=null},
  goal(q){return q.boss?'⚔️ Győzd le az Árnykirályt!':'Tarts ki a Kapunál: '+Math.floor(q.t)+'/60 mp'+(H2(G.x,G.z,0,-30)>24?' (gyere vissza!)':'')},
  tgt(q){return q.boss&&!q.boss.dead?{x:q.boss.x,z:q.boss.z,n:'Árnykirály'}:{x:0,z:-24,n:'A Nagy Kapu'}},
  tick(q,dt){if(q.boss){if(q.boss.dead){win(q)}return}if(H2(G.x,G.z,0,-30)<24)q.t+=dt;q.w-=dt;if(q.w<=0){q.w=7;spawnNear(0,-30,30,45,pick(['arny','arny','farkas','lav','gomba','bog']),2+Math.floor(q.t/20))}
   if(q.t>=60){q.boss=spawnC('kiraly',0,-58);say('👑 AZ ÁRNYKIRÁLY MEGÉRKEZETT!');W.portal.ring.material.color.set(0xa855f7)}}},
 {id:'scout',npc:'bolcs',t:'A világ felfedezése',rw:RW(300,4000,500),d:'A térképeink régiek. Járd be mind a kilenc tájat, és mesélj róluk! (M – térkép)',
  goal(){return'Felfedezett tájak: '+Object.keys(W.disc).length+'/9'},tgt(){const b=BI.filter(b=>!W.disc[b.id]).sort((a,b2)=>H2(G.x,G.z,a.x,a.z)-H2(G.x,G.z,b2.x,b2.z))[0];return b?{x:b.x,z:b.z,n:b.e+' '+b.n}:null},tick(q){if(Object.keys(W.disc).length>=9)done(q)}},
 {id:'hunt',npc:'bolcs',t:'Árnyvadász',rw:RW(220,3000,400),turn:1,d:'Az árnylények egyre többen vannak. Ritkíts közöttük: 12 lény legyőzése elég lesz, hogy fellélegezzünk.',dn:'Szép munka, vadász!',acc(q){q.k0=W.kills},
  goal(q){return'Legyőzött lények: '+Math.min(12,W.kills-q.k0)+'/12'},tick(q){if(W.kills-q.k0>=12)ready(q)}},
 {id:'gather',npc:'kovacs',t:'Nyersanyag a tábornak',rw:RW(120,1500,250),turn:1,d:'A tábornak fa és kő kell! Hozz 20 fát és 15 követ – tartsd nyomva az F-et a fáknál és a szikláknál.',dn:'Ez igen! Ebből lesz palánk is, kemence is.',
  acc(q){q.w0=W.got.wood;q.s0=W.got.stone},goal(q){return'🪵 '+Math.min(20,W.got.wood-q.w0)+'/20 · 🪨 '+Math.min(15,W.got.stone-q.s0)+'/15'},tick(q){if(W.got.wood-q.w0>=20&&W.got.stone-q.s0>=15)ready(q)}},
 {id:'tower',npc:'kovacs',t:'Az őrtorony újjáépítése',rw:RW(320,4500,550),d:'A Szélfennsíkon állt egykor egy őrtorony. Ha hozol 30 fát, 20 követ és 6 kristályt, újjáépítjük – a tetejéről az egész világot látni!',
  goal(q){return q.built?'Mássz fel a torony tetejére!':'Kell: 🪵 '+W.res.wood+'/30 · 🪨 '+W.res.stone+'/20 · 💎 '+W.res.crystal+'/6 → alapkő (F)'},tgt(){return{x:P.tower.x,z:P.tower.z,n:'Őrtorony'}},
  holds(q){if(q.built)return[];return[{x:P.tower.x,z:P.tower.z,r:6,dur:3,l:'🏗️ Építés…',ok:()=>W.res.wood>=30&&W.res.stone>=20&&W.res.crystal>=6,no:'Nincs elég nyersanyag!',fn(){W.res.wood-=30;W.res.stone-=20;W.res.crystal-=6;q.built=1;buildTower()}}]},
  tick(q){if(q.built&&G.y>14&&H2(G.x,G.z,P.tower.x,P.tower.z)<6){done(q);say('🗼 Micsoda kilátás! Az egész világ a lábad előtt.')}}},
 {id:'deliver',npc:'futar',t:'Sürgős csomag',rw:RW(220,3200,380),d:'Jaj, segíts! Ezt a csomagot 75 másodpercen belül el kell vinni Mirtill boszorkánynak a Ködmocsárba, különben megromlik a bájital-alapanyag!',
  acc(q){q.t=75},goal(q){return'📦 Vidd Mirtillnek: '+Math.ceil(q.t)+' mp'},tgt(){return{x:NP.boszi.x,z:NP.boszi.z,n:'Mirtill boszorkány'}},
  tick(q,dt){q.t-=dt;if(H2(G.x,G.z,NP.boszi.x,NP.boszi.z)<4){done(q);say('🧹 Mirtill: „Épp időben! Köszönöm!”')}else if(q.t<=0){fail(q,'⌛ Lejárt az idő – a csomag megromlott. Kérd újra Dóritól!')}}},
 {id:'fish',npc:'halasz',t:'Ezüstpikkely',rw:RW(160,2200,320),turn:1,d:'A Kristálytó halai varázslatosak! Fogj nekem hármat: állj a tó vizébe vagy a stégre, és tartsd nyomva az F-et.',dn:'Gyönyörű példányok! Ezt a horgot neked adom.',
  acc(q){q.n=0;q.dur=rnd(2,4)},goal(q){return'🐟 Kifogott hal: '+q.n+'/3'},tgt(){return{x:P.lake.x-12,z:P.lake.z-12,n:'Kristálytó'}},
  holds(q){if(H2(G.x,G.z,P.lake.x,P.lake.z)>P.lake.r+1)return[];return[{x:G.x,z:G.z,r:1,dur:q.dur,l:'🎣 Horgászás…',fn(){q.n++;q.dur=rnd(2,4.5);const f=pick(['Ködponty','Holdfényes pisztráng','Kristálykeszeg','Szivárványharcsa','Csillagsügér',R()<.15?'ARANYCSUKA (ritka!)':'Kékuszonyú dévér']);vtx('🐟 '+f+' – '+rnd(.4,6).toFixed(1)+' kg');if(q.n>=3)ready(q)}}]}},
 {id:'shroom',npc:'boszi',t:'Világító gombák',rw:RW(160,2200,320),turn:1,d:'A bájitalomhoz 8 világító gomba kell a Gombaerdőből. Kékesen derengenek, nem lehet nem észrevenni őket!',dn:'Ó, de szépen világítanak! Íme a jutalmad, és egy kis pajzsital.',
  acc(q){q.n=0;q.it=[];for(let i=0;i<8;i++){const p=rpIn(-170,0,8,60,1,'mus');if(!p)continue;const m=new THREE.Group();mesh(new THREE.CylinderGeometry(.12,.16,.6,8),GL(0xe0f2fe,.6),0,.3,0,m);mesh(new THREE.SphereGeometry(.4,10,6,0,6.283,0,1.57),GL(0x22d3ee,2),0,.55,0,m);m.position.set(p[0],0,p[1]);scene.add(m);q.it.push({x:p[0],z:p[1],m})}},
  goal(q){return'🍄 Világító gomba: '+q.n+'/8'},tgt(q){const a=q.it.filter(i=>!i.got).sort((a,b)=>H2(G.x,G.z,a.x,a.z)-H2(G.x,G.z,b.x,b.z))[0];return a?{x:a.x,z:a.z,n:'Világító gomba'}:null},
  tick(q){q.it.forEach(i=>{if(!i.got&&H2(G.x,G.z,i.x,i.z)<2){i.got=1;scene.remove(i.m);q.n++;vtx('🍄 +1 világító gomba');if(q.n>=q.it.length)ready(q)}})},rew(){G.inv.beer+=2}},
 {id:'fire',npc:'gombasz',t:'Szentjánosbogár-tánc',rw:RW(160,2200,320),turn:1,d:'Elszöktek a szentjánosbogaraim! Hat darabot kérlek, fogj vissza – ott cikáznak a gombák között. Csak érj hozzájuk!',dn:'Hazajöttek a kicsikéim! Köszönöm!',
  acc(q){q.n=0;q.f=[];for(let i=0;i<9;i++){const s=spr('✨',1.4);s.material.depthTest=true;scene.add(s);{const cx=-160+rnd(-18,18),cz=45+rnd(-14,14);q.f.push({s,cx,cz,x:cx,z:cz,ph:R()*6,sp:rnd(.4,.8)})}}},
  goal(q){return'✨ Szentjánosbogár: '+q.n+'/6'},tgt(q){const a=q.f.filter(i=>!i.got).sort((a,b)=>H2(G.x,G.z,a.x,a.z)-H2(G.x,G.z,b.x,b.z))[0];return a?{x:a.x,z:a.z,n:'Szentjánosbogár'}:null},
  tick(q){const t=G.t;q.f.forEach(f=>{if(f.got)return;f.x=f.cx+Math.sin(t*f.sp+f.ph)*9;f.z=f.cz+Math.cos(t*f.sp*1.3+f.ph)*7;f.y=1.4+Math.sin(t*2+f.ph)*.6;f.s.position.set(f.x,f.y,f.z);
   if(H2(G.x,G.z,f.x,f.z)<2.2&&G.y<3){f.got=1;scene.remove(f.s);q.n++;vtx('✨ Elkaptad!');if(q.n>=6){q.f.forEach(o=>scene.remove(o.s));ready(q)}}})}},
 {id:'tele',npc:'csill',t:'A csillagok üzenete',rw:RW(220,2800,380),turn:1,d:'Három távcsövem áll a sziklák között. Ha mindhármat beállítod (tartsd nyomva az F-et), kirajzolódik a Lángmadár csillagképe – ősi jel, hogy a fény visszatér!',dn:'Látod? Ott a Lángmadár! Jó jel ez, nagyon jó jel.',
  acc(q){q.on=[0,0,0]},goal(q){return'🔭 Beállított távcső: '+q.on.filter(Boolean).length+'/3'},tgt(q){const i=q.on.findIndex(v=>!v);return i<0||!P.tele[i]?null:{x:P.tele[i].x,z:P.tele[i].z,n:'Távcső '+(i+1)}},
  holds(q){return P.tele.map((p,i)=>q.on[i]?null:{x:p.x,z:p.z,r:3,dur:2.5,l:'🔭 Távcső beállítása…',fn(){q.on[i]=1;if(q.on.every(Boolean))ready(q)}}).filter(Boolean)},rew(){W.sky=1}},
 {id:'treasure',npc:'kincs',t:'Zsiga elveszett kincse',rw:RW(350,6500,550),d:'Nagyapám térképét három darabra téptem, és elszórtam a világban – fiatal voltam és buta. Keresd meg a darabokat, mindegyik a következő helyre mutat. A végén áss!',
  acc(q){q.s=0;const C=[['tun',-45,-195],['swa',-140,140],['obs',95,-160],['lak',158,92],['mus',-205,-30],['sky',-140,-140],['vol',195,-45]];q.pts=[];const c=C.slice().sort(()=>R()-.5);for(let i=0;i<3;i++)q.pts.push({x:c[i][1],z:c[i][2]});q.pts.push({x:40,z:192});mark(q)},
  goal(q){return q.s<3?'🗺️ Térképdarab: '+q.s+'/3':'⛏️ Áss a jelölt helyen!'},tgt(q){const p=q.pts[q.s];return{x:p.x,z:p.z,n:q.s<3?'Térképdarab '+(q.s+1):'Kincs helye'}},
  holds(q){const p=q.pts[q.s];return[{x:p.x,z:p.z,r:3,dur:q.s<3?1.5:4,l:q.s<3?'🗺️ Térképdarab felvétele…':'⛏️ Ásás…',fn(){scene.remove(q.mk);q.s++;if(q.s>3){G.own[3]=G.own[4]=true;for(let i=0;i<5;i++)G.res[i]=(G.res[i]||0)+WPN[i].res*2;vtx('💰 KINCS! Két legendás fegyver és rengeteg lőszer!');done(q)}else{vtx(q.s<3?'🗺️ Újabb darab! A térkép tovább mutat...':'🗺️ Megvan a teljes térkép! Irány a kincs!');mark(q)}}}]}},
 {id:'race',npc:'biro',t:'Szélfutam',rw:RW(260,3200,420),d:'Gyors vagy? Fuss végig mind a nyolc szélkapun 50 másodperc alatt! Az első kapu itt van mellettem.',
  acc(q){q.i=0;q.t=50;q.r=[];const c=[-100,-108];for(let i=0;i<8;i++){const a=i/8*6.283+.3,rr=26+(i%2)*8,x=c[0]+Math.cos(a)*rr,z=c[1]+Math.sin(a)*rr;const m=mesh(new THREE.TorusGeometry(3.4,.3,8,28),GL(0x38bdf8,1.6),x,3.6,z);m.rotation.y=a;q.r.push({x,z,m})}},
  goal(q){return'🏁 Kapu: '+q.i+'/8 · ⏱️ '+Math.ceil(q.t)+' mp'},tgt(q){const r=q.r[q.i];return r?{x:r.x,z:r.z,n:'Szélkapu '+(q.i+1)}:null},
  tick(q,dt){if(q.i>0)q.t-=dt;q.r.forEach((r,i)=>{r.m.material=i===q.i?GL(0xfacc15,2):i<q.i?GL(0x22c55e,.8):GL(0x38bdf8,1.2);r.m.rotation.z+=dt*(i===q.i?2:0)});const r=q.r[q.i];
   if(r&&H2(G.x,G.z,r.x,r.z)<4.2){q.i++;vtx('💨 Kapu '+q.i+'/8');if(q.i>=8){q.r.forEach(o=>scene.remove(o.m));done(q);say('🏁 Szélvész vagy! Szép futam!')}}
   if(q.t<=0){q.r.forEach(o=>scene.remove(o.m));fail(q,'⏱️ Lejárt az idő! Próbáld újra Tasnál.')}}},
 {id:'shrine',npc:'biro',t:'Az égi szentély',rw:RW(260,3200,420),d:'Látod azokat a lebegő szigeteket? A legfelsőn egy ősi szentély áll. Ugrálj fel rájuk (Space) – aki eléri a csúcsot, azt megáldja a szél!',
  goal(){return'⛩️ Érd el az égi szentélyt'},tgt(){return{x:P.shrine.x,z:P.shrine.z,n:'Égi szentély'}},tick(q){if(G.y>P.shrine.y-1&&H2(G.x,G.z,P.shrine.x,P.shrine.z)<3.5){done(q);G.sh=G.msh;say('🌬️ A szél megáldott! Pajzsod feltöltve.')}}},
 {id:'yeti',npc:'gerda',t:'A Fehér Rém',rw:RW(380,5500,650),turn:1,d:'Egy hatalmas jeti tanyázik a barlangban nyugatra. Elzavarta a vadakat, és két vadászt is megsebesített. Végezz vele!',dn:'Legyőzted?! Te aztán bátor vagy. Fogadd ezt el!',
  acc(q){q.e=spawnC('yeti',P.cave.x,P.cave.z+8)},goal(){return'🦍 Győzd le a jetit'},tgt(q){return q.e&&!q.e.dead?{x:q.e.x,z:q.e.z,n:'Jeti'}:null},tick(q){if(q.e&&q.e.dead)ready(q)}},
 {id:'explorer',npc:'gerda',t:'Eltűnt felfedező',rw:RW(260,3600,420),d:'Bence, a felfedező két napja ment ki a tundrára, és nem jött vissza. Keresd meg, és kísérd el a táborba, a tábortűzhöz!',
  acc(q){const p=rpIn(0,-170,20,60,2,'tun')||[30,-200];q.p={x:p[0],z:p[1]};q.m=person(0xf97316,'🧭',1);q.m.position.set(p[0],0,p[1]);scene.add(q.m);q.f=0},
  goal(q){return q.f?'🧭 Kísérd Bencét a tábortűzhöz':'🧭 Keresd meg Bencét a tundrán'},tgt(q){return q.f?{x:0,z:0,n:'Tábortűz'}:{x:q.p.x,z:q.p.z,n:'Bence'}},
  holds(q){return q.f?[]:[{x:q.p.x,z:q.p.z,r:3,dur:1.5,l:'🤝 Felsegítés…',fn(){q.f=1;vtx('🧭 Bence: „Hála az égnek! Menjünk, követlek!”')}}]},
  tick(q,dt){if(!q.f)return;const d=H2(G.x,G.z,q.p.x,q.p.z);if(d>3.5){const k=Math.min(1,(d-3)*dt*3/d);q.p.x+=(G.x-q.p.x)*k;q.p.z+=(G.z-q.p.z)*k}q.m.position.set(q.p.x,0,q.p.z);q.m.rotation.y=Math.atan2(G.x-q.p.x,G.z-q.p.z);
   if(Math.hypot(q.p.x,q.p.z)<10){scene.remove(q.m);done(q);say('🔥 Bence biztonságban van a tábortűznél!')}}},
 {id:'goat',npc:'pasztor',t:'Az aranykecske',rw:RW(220,2800,380),turn:1,d:'Megszökött az aranykecském! Gyors, mint a szél, de előbb-utóbb elfárad. Kapd el nekem – csak érj hozzá!',dn:'Aranyoskám! Köszönöm szépen, hogy elkaptad!',
  acc(q){q.p={x:-110,z:-75};q.sta=1;q.m=goatModel();q.m.position.set(q.p.x,0,q.p.z);scene.add(q.m)},goal(q){return q.c?'🐐 Vidd vissza a hírt Borinak':'🐐 Kapd el az aranykecskét'},tgt(q){return q.c?null:{x:q.p.x,z:q.p.z,n:'Aranykecske'}},
  tick(q,dt){if(q.c)return;const d=H2(G.x,G.z,q.p.x,q.p.z);if(d<15){const sp2=10.5*q.sta;q.sta=Math.max(.42,q.sta-dt*.035);let a=Math.atan2(q.p.z-G.z,q.p.x-G.x)+Math.sin(G.t*1.7)*.5;for(let k=0;k<8;k++){const nx=q.p.x+Math.cos(a)*sp2*dt,nz=q.p.z+Math.sin(a)*sp2*dt;if(hin(nx*1.05,nz*1.05)&&Math.hypot(nx,nz)>30){q.p.x=nx;q.p.z=nz;break}a+=.8}q.m.rotation.y=-a+Math.PI/2}else q.sta=Math.min(1,q.sta+dt*.02);
   q.m.position.set(q.p.x,Math.abs(Math.sin(G.t*9))*.3*(d<15?1:0),q.p.z);if(d<2.3){q.c=1;scene.remove(q.m);vtx('🐐 Elkaptad az aranykecskét!');ready(q)}}},
 {id:'idol',npc:'remete',t:'Az obszidián bálvány',rw:RW(280,3800,450),turn:1,d:'A lávamező közepén ott fekszik az obszidián bálvány. A kőoszlopokon át eljuthatsz hozzá – de a lávába ne lépj, mert éget! Hozd el nekem.',dn:'A bálvány! Évtizedek óta erre vártam. Köszönöm, utazó.',
  acc(q){q.g=0;q.m=mesh(new THREE.OctahedronGeometry(.6,0),MS(0x111111,{metalness:.9,roughness:.15,emissive:0x581c87,emissiveIntensity:.6}),P.idol.x,1.6,P.idol.z);q.m.scale.y=1.6},
  goal(q){return q.g?'🗿 Vidd vissza a remetének':'🗿 Szerezd meg a bálványt a lávamezőről'},tgt(q){return q.g?null:{x:P.idol.x,z:P.idol.z,n:'Obszidián bálvány'}},
  holds(q){return q.g?[]:[{x:P.idol.x,z:P.idol.z,r:2,dur:1.5,l:'🗿 Felvétel…',fn(){q.g=1;scene.remove(q.m);ready(q);vtx('🗿 Megvan a bálvány!')}}]},tick(q){if(q.m&&!q.g)q.m.rotation.y+=.02}},
 {id:'runes',npc:'kincs',t:'A piramis rúnái',main:1,rw:RW(200,2500,350),d:'A piramis lángköve le van zárva. A négy rúnakövet a helyes sorrendben kell megérinteni – a sorrendet az obeliszk mutatja, a piramis előtt.',
  acc(q){q.i=0},goal(q){return'🔣 Rúnák: '+q.i+'/4 (sorrend az obeliszken)'},tgt(q){return{x:P.obel.x,z:P.obel.z,n:'Obeliszk'}},
  holds(q){return P.runes.map((p,i)=>({x:p.x,z:p.z,r:3,dur:1,l:'🔣 Rúna érintése…',fn(){if(W.order[q.i]===i){q.i++;W.runeM[i].material=GL(0xfacc15,2);vtx('🔣 '+GLY[i]+' felizzott!');if(q.i>=4){W.runeOK=1;done(q);say('☀️ A piramis lángköve felszabadult!')}}else{q.i=0;W.runeM.forEach(m=>m.material=MS(0x3b2f1f));hurt(10,true);vtx('⚡ Rossz sorrend! A rúnák kialudtak.')}}}))}}];
const GLY=['ᚠ','ᚱ','ᛟ','ᛉ'];
const QM={};QD.forEach(q=>QM[q.id]=q);

function mark(q){if(q.mk)scene.remove(q.mk);const p=q.pts[q.s];const g=new THREE.Group();mesh(new THREE.DodecahedronGeometry(.7,0),MS(0x78716c),0,.4,0,g);const s=spr(q.s<3?'📜':'❌',2);s.position.y=2.2;g.add(s);g.position.set(p.x,0,p.z);scene.add(g);q.mk=g}
function goatModel(){const g=new THREE.Group(),m=MS(0xfacc15,{metalness:.8,roughness:.25,emissive:0x854d0e,emissiveIntensity:.3});mesh(new THREE.BoxGeometry(.7,.7,1.4),m,0,1,0,g);mesh(new THREE.BoxGeometry(.45,.5,.6),m,0,1.45,.85,g);[[-.25,.5],[.25,.5],[-.25,-.5],[.25,-.5]].forEach(([a,b])=>mesh(new THREE.BoxGeometry(.14,.7,.14),m,a,.35,b,g));[-.15,.15].forEach(a=>{const h=mesh(new THREE.ConeGeometry(.07,.5,5),MS(0xfef3c7),a,1.9,.75,g);h.rotation.x=-.5});const s=spr('✨',1.3);s.position.y=2.3;g.add(s);return g}

// ---------- küldetés-állapotok ----------
function qs(id){return W.q[id]}
function avail(id){const d=QM[id],s=W.q[id];return s.st==='locked'&&(!d.req||d.req.every(r=>W.q[r].st==='done'))}
function accept(id){const d=QM[id],s=W.q[id];s.st='active';try{d.acc&&d.acc(s)}catch(e){console.error(e)}W.track=id;say('📜 ÚJ KÜLDETÉS: '+d.t)}
function ready(s){if(s.st!=='active')return;const d=QM[s.id];if(d.turn){s.st='ready';say('✅ '+d.t+' – menj vissza: '+NP[d.npc].n)}else done(s)}
function done(s){if(s.st==='done')return;const d=QM[s.id];s.st='done';W.done++;const r=d.rw;window.BR.zs+=r.zs;try{st.s('k3br',window.BR)}catch(e){}S.c+=r.ft;try{save()}catch(e){}W.zs+=r.zs;W.ft+=r.ft;if(window.ACCXP)ACCXP.add(r.xp,'Küldetés');try{d.rew&&d.rew()}catch(e){}
 say('🏆 KÜLDETÉS TELJESÍTVE: '+d.t+'  (+'+r.zs+' 🪙 · +'+ft(r.ft)+' · +'+r.xp+' XP)');if(W.track===s.id)W.track=pickTrack()}
function fail(s,msg){s.st='locked';say(msg)}
function pickTrack(){const a=QD.find(d=>W.q[d.id].st==='active'||W.q[d.id].st==='ready');return a?a.id:null}
function win(s){if(W.won)return;W.won=1;done(s);say('🌅 AZ ÁRNYKIRÁLY ELBUKOTT! A VILÁG MEGMENEKÜLT!');W.sunrise=1;setTimeout(()=>{if(W&&G&&!G.over){W.ok=true;W.victory=true;G.cash=0;end(true)}},7000)}

// ---------- dinamikus elemek ----------
function lightBeacon(k){const b=W.beac[k];b.lit=1;b.fl.visible=true;b.beam.visible=true;b.cr.material=GL(b.c,2.5);spawnNear(b.x,b.z,14,24,BCR[biomeAt(b.x,b.z).id],3);say('🔥 '+b.n+' LÁNGRA KAPOTT! Őrzők támadnak!')}
function mkBeacon(k,p,c,n){const g=new THREE.Group();mesh(new THREE.CylinderGeometry(1.1,1.4,1,8),MS(0x4b5563),0,.5,0,g);const cr=mesh(new THREE.OctahedronGeometry(.8,0),MS(0x64748b),0,1.9,0,g);const fl=mesh(new THREE.ConeGeometry(.7,2.2,10),GL(c,2.4),0,3.4,0,g);fl.visible=false;
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,120,10,1,true),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.28,depthWrite:false,blending:THREE.AdditiveBlending}));beam.position.y=60;beam.visible=false;g.add(beam);
 g.position.set(p.x,p.y,p.z);scene.add(g);label(n+' (F)',1.8,5.5,g);G.col.push({x:p.x,z:p.z,r:1.2,h:p.y+1,y0:p.y-.1});return{k,x:p.x,z:p.z,y:p.y,c,n,g,cr,fl,beam,lit:0}}
function buildTower(){const t=P.tower,g=new THREE.Group();g.position.set(t.x,0,t.z);scene.add(g);mesh(new THREE.CylinderGeometry(2,2.3,15,12),MS(0x8a8178),0,7.5,0,g);G.col.push({x:t.x,z:t.z,r:2.2,h:14.4});
 for(let i=0;i<27;i++){const a=i*.42,x=Math.cos(a)*3.4,z=Math.sin(a)*3.4,h=.55*(i+1);mesh(new THREE.BoxGeometry(1.8,.3,1.8),MS(0x7c5a3a),x,h-.15,z,g).rotation.y=-a;plat(t.x+x,t.z+z,1.05,1.05,h)}
 const top=.55*27;mesh(new THREE.BoxGeometry(9,.4,9),MS(0x6b4a2a),0,top-.2,0,g);plat(t.x,t.z,4.5,4.5,top);[[-4,-4],[4,-4],[4,4],[-4,4]].forEach(([x,z])=>mesh(new THREE.BoxGeometry(.3,3,.3),MS(0x5b3a1e),x,top+1.5,z,g));const rf=mesh(new THREE.ConeGeometry(6.6,3,4),MS(0x991b1b),0,top+4.4,0,g);rf.rotation.y=.78;
 const fl=spr('🚩',3);fl.position.y=top+7;g.add(fl);say('🗼 Az őrtorony újra áll! Mássz fel a csigalépcsőn!')}

// ---------- HUD ----------
const css=document.createElement('style');css.textContent=`
#vgHud{position:absolute;right:12px;top:140px;width:300px;z-index:3;pointer-events:none;display:none;font-family:Rajdhani,Arial;color:#fff}
#vgHud .bx{background:#0b1022d9;border:1px solid #ffffff22;border-radius:12px;padding:8px 10px;margin-bottom:8px;backdrop-filter:blur(4px)}
#vgHud h4{margin:0 0 4px;font:15px 'Luckiest Guy',Impact;color:#c4b5fd;letter-spacing:.5px}
#vgQ .q{font-weight:700;font-size:14px;margin:4px 0;padding-left:6px;border-left:3px solid #64748b}#vgQ .q.tr{border-color:#facc15;background:#facc1514}#vgQ .q.rd{border-color:#4ade80}
#vgQ .q small{display:block;color:#cbd5e1;font-weight:600}#vgQ .q.rd small{color:#4ade80}
#vgRes{display:flex;gap:12px;font:17px 'Luckiest Guy',Impact}
#vgMini{display:block;width:276px;height:276px;border-radius:10px}
#vgTop{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:3;pointer-events:none;display:none;gap:10px;font-family:'Luckiest Guy',Impact;text-shadow:0 2px 0 #000;align-items:center}
#vgTop span{background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:5px 14px}
#vgWay{position:absolute;left:50%;top:126px;transform:translateX(-50%);z-index:3;pointer-events:none;display:none;font:700 17px Rajdhani;background:#0b1022cc;border:1px solid #facc1566;border-radius:20px;padding:4px 16px 4px 8px;align-items:center;gap:8px;color:#fde68a}
#vgWay b{display:inline-block;font-size:22px;transition:transform .1s;color:#facc15}
#vgHold{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);z-index:4;pointer-events:none;display:none;text-align:center;font:16px 'Luckiest Guy',Impact;text-shadow:0 2px 0 #000}
#vgHold i{display:block;margin:6px auto 0;width:64px;height:64px;border-radius:50%}
#vgHint{position:absolute;left:50%;bottom:150px;transform:translateX(-50%);z-index:3;pointer-events:none;display:none;font:700 18px Rajdhani;background:#000a;border-radius:10px;padding:6px 14px;color:#fff}
#vgBan{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);z-index:4;pointer-events:none;text-align:center;opacity:0;transition:opacity .8s;font-family:'Luckiest Guy',Impact;text-shadow:0 4px 0 #000,0 0 30px #000}
#vgBan b{display:block;font-size:64px;color:#fff}#vgBan small{font:700 20px Rajdhani;color:#fde68a;letter-spacing:3px}
.vgD{display:flex;gap:16px;text-align:left;align-items:flex-start;max-width:720px;margin:0 auto}.vgD .pt{font-size:70px;line-height:1;background:#1e293b;border-radius:18px;padding:10px}
.vgD p{font:600 18px Rajdhani;color:#e2e8f0;line-height:1.45;margin:6px 0}.vgQc{background:#0f172a;border:1px solid #334155;border-radius:12px;padding:10px 12px;margin:8px 0;text-align:left}
.vgQc b{font:18px 'Luckiest Guy',Impact;color:#fde68a}.vgQc small{display:block;color:#94a3b8;font:600 14px Rajdhani}`;document.head.appendChild(css);
const hud=document.createElement('div');hud.id='vgHud';hud.innerHTML='<div class="bx"><canvas id="vgMini" width="276" height="276"></canvas></div><div class="bx"><h4>📜 KÜLDETÉSEK · J = napló</h4><div id="vgQ"></div></div><div class="bx"><h4>🎒 NYERSANYAG</h4><div id="vgRes"></div></div>';
const top=document.createElement('div');top.id='vgTop';top.innerHTML='<span id="vgB"></span><span id="vgK" style="color:#fde68a"></span><span id="vgE" style="color:#f0abfc"></span>';
const way=document.createElement('div');way.id='vgWay';way.innerHTML='<b id="vgArr">⬆</b><span id="vgWt"></span>';
const hold=document.createElement('div');hold.id='vgHold';hold.innerHTML='<span id="vgHt"></span><i id="vgHr"></i>';
const hint=document.createElement('div');hint.id='vgHint';const ban=document.createElement('div');ban.id='vgBan';
setTimeout(()=>{const h=$('hud');[hud,top,way,hold,hint,ban].forEach(e=>h.appendChild(e))},0);
function banner(big,small){ban.innerHTML='<small>'+small+'</small><b>'+big+'</b>';ban.style.opacity=1;clearTimeout(ban._t);ban._t=setTimeout(()=>ban.style.opacity=0,2600)}
let VF=false;function vtx(t){VF=true;try{ftx(G.x,G.z,t,'')}finally{VF=false}say(t)}
function showHud(v){[hud].forEach(e=>e.style.display=v?'block':'none');top.style.display=v?'flex':'none';if(!v){way.style.display='none';hold.style.display='none';hint.style.display='none'}}

// minitérkép háttér
let MINI=null;function miniBg(){const c=document.createElement('canvas');c.width=c.height=276;const x=c.getContext('2d');x.fillStyle='#173f78';x.fillRect(0,0,276,276);const s=276/600,col=new THREE.Color();
 for(let i=0;i<138;i++)for(let j=0;j<138;j++){const wx=-300+i*600/138,wz=-300+j*600/138;if(!hin(wx,wz))continue;col.set(biomeAt(wx,wz).c);x.fillStyle='#'+col.getHexString();x.fillRect(i*2,j*2,2.2,2.2)}
 x.fillStyle='#2f8fd0';x.beginPath();x.arc((120+300)*s,(120+300)*s,26*s,0,6.283);x.fill();
 x.font='bold 15px sans-serif';x.textAlign='center';x.textBaseline='middle';BI.forEach(b=>x.fillText(b.e,(b.x+300)*s,(b.z+300)*s));MINI=c}
function drawMini(){const cv=$('vgMini');if(!cv)return;const x=cv.getContext('2d'),s=276/600,mx=v=>(v+300)*s;if(!MINI)miniBg();x.drawImage(MINI,0,0);
 x.font='bold 13px sans-serif';x.textAlign='center';x.textBaseline='middle';
 NPC.forEach(n=>{const st=npcState(n.id);if(!st)return;x.fillStyle=st==='❓'?'#4ade80':'#facc15';x.beginPath();x.arc(mx(n.x),mx(n.z),4.5,0,6.283);x.fill();x.fillStyle='#000';x.fillText(st==='❓'?'?':'!',mx(n.x),mx(n.z)+.5)});
 Object.values(W.beac).forEach(b=>{x.fillStyle=b.lit?'#'+new THREE.Color(b.c).getHexString():'#475569';x.fillRect(mx(b.x)-3,mx(b.z)-3,6,6)});
 const tg=W.tg;if(tg){x.strokeStyle='#facc15';x.lineWidth=2;x.beginPath();x.arc(mx(tg.x),mx(tg.z),7+Math.sin(G.t*5)*2,0,6.283);x.stroke()}
 x.fillStyle='#ef4444';G.en.forEach(e=>{if(!e.dead&&H2(e.x,e.z,G.x,G.z)<90)x.fillRect(mx(e.x)-1.5,mx(e.z)-1.5,3,3)});
 x.save();x.translate(mx(G.x),mx(G.z));x.rotate(G.ang+Math.PI/2);x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=1.5;x.beginPath();x.moveTo(0,-8);x.lineTo(5.5,6);x.lineTo(0,3);x.lineTo(-5.5,6);x.closePath();x.fill();x.stroke();x.restore()}
function npcState(id){let r=null;QD.forEach(d=>{if(d.npc!==id)return;const s=W.q[d.id];if(s.st==='ready')r='❓';else if(!r&&avail(d.id))r='❗'});return r}

// ---------- párbeszéd / napló ----------
function talk(id){const n=NP[id];let h='<div class="vgD"><div class="pt">'+n.e+'</div><div style="flex:1"><h1 class="f" style="font-size:30px;margin:0">'+n.n+'</h1>';let any=0;
 QD.forEach(d=>{if(d.npc!==id)return;const s=W.q[d.id];
  if(s.st==='ready'){any=1;h+='<div class="vgQc"><b>✅ '+d.t+'</b><p>'+(d.dn||'Köszönöm!')+'</p><small>Jutalom: '+d.rw.zs+' 🪙 · '+ft(d.rw.ft)+' · '+d.rw.xp+' XP</small>'+bB('🎁 JUTALOM ÁTVÉTELE',"vgQ('"+d.id+"','turn')",'c')+'</div>'}
  else if(avail(d.id)){any=1;h+='<div class="vgQc"><b>❗ '+d.t+'</b><p>'+d.d+'</p><small>Jutalom: '+d.rw.zs+' 🪙 · '+ft(d.rw.ft)+' · '+d.rw.xp+' XP</small>'+bB('✔ ELFOGADOM',"vgQ('"+d.id+"','acc')",'c')+'</div>'}
  else if(s.st==='active'){any=1;h+='<div class="vgQc"><b>⏳ '+d.t+'</b><small>'+safe(()=>d.goal(s))+'</small>'+bB('📍 KÖVETÉS',"vgQ('"+d.id+"','track')",'p')+'</div>'}});
 if(!any)h+='<p>'+pick(['Vigyázz magadra odakint, utazó!','A köd egyre sűrűbb... siess!','Ha segítség kell, tudod, hol találsz.','Szép napot – már amennyire a köd engedi.'])+'</p>';
 if(id==='kovacs')h+=bB('🛠️ MŰHELY','vgCraftUI()','p');if(id==='bolcs')h+=bB('🏠 HAZATÉRÉS (menet vége)','vgHome()','r');
 h+=bB('VISSZA','guiClose()','r')+'</div></div>';guiOpen(h)}
function safe(f){try{return f()}catch(e){return''}}
window.vgQ=(id,a)=>{const s=W.q[id];if(a==='acc'&&avail(id))accept(id);else if(a==='turn'&&s.st==='ready')done(s);else if(a==='track'){W.track=id;guiClose();return}try{sfx('buy')}catch(e){}talk(QM[id].npc)};
window.vgHome=()=>{guiClose();W.ok=true;G.cash=0;end(false)};
function journal(){let h='<h1 class="f" style="font-size:32px">📜 KÜLDETÉSNAPLÓ</h1><div style="color:#cbd5e1;margin-bottom:6px">Teljesítve: '+W.done+'/'+QD.length+' · '+W.zs+' 🪙 · '+ft(W.ft)+' · Felfedezve: '+Object.keys(W.disc).length+'/9 táj</div><div style="max-height:62vh;overflow:auto">';
 const grp=[['⏳ FOLYAMATBAN',d=>['active','ready'].includes(W.q[d.id].st)],['❗ ELÉRHETŐ',d=>avail(d.id)],['🔒 ZÁROLVA',d=>W.q[d.id].st==='locked'&&!avail(d.id)],['✅ KÉSZ',d=>W.q[d.id].st==='done']];
 grp.forEach(([t,f])=>{const L=QD.filter(f);if(!L.length)return;h+='<h3 class="f" style="text-align:left;color:#c4b5fd;margin:10px 4px 2px">'+t+'</h3>';L.forEach(d=>{const s=W.q[d.id],n=NP[d.npc];h+='<div class="vgQc"><b>'+(d.main?'⭐ ':'')+d.t+'</b><small>'+n.e+' '+n.n+' · '+biomeAt(n.x,n.z).n+'</small>'+(s.st==='active'?'<small style="color:#fde68a">'+safe(()=>d.goal(s))+'</small>':s.st==='ready'?'<small style="color:#4ade80">Menj vissza: '+n.n+'</small>':'')+(s.st!=='done'?bB(W.track===d.id?'📍 KÖVETVE':'📍 KÖVETÉS',"vgTrack('"+d.id+"')",W.track===d.id?'c':'p'):'')+'</div>'})});
 h+='</div>'+bB('VISSZA','guiClose()','r');guiOpen(h)}
window.vgTrack=id=>{W.track=id;journal()};
function bigMap(){guiOpen('<h1 class="f" style="font-size:30px">🗺️ A VILÁG TÉRKÉPE</h1><canvas id="vgBig" width="560" height="560" style="border-radius:14px;max-width:80vw;max-height:66vh"></canvas><div style="color:#cbd5e1;font:600 15px Rajdhani">❗ küldetés · ❓ leadás · ■ lángkő · ⭕ követett cél</div>'+bB('NAPLÓ (J)','vgJournal()','p')+bB('VISSZA','guiClose()','r'));
 setTimeout(()=>{const c=$('vgBig');if(!c)return;drawMini();const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage($('vgMini'),0,0,560,560);x.font='bold 14px Rajdhani';x.fillStyle='#fff';x.textAlign='center';BI.forEach(b=>{x.strokeStyle='#000';x.lineWidth=3;const px=(b.x+300)/600*560,pz=(b.z+300)/600*560+18;x.strokeText(b.n,px,pz);x.fillText(b.n,px,pz)})},30)}
window.vgJournal=journal;
function craftUI(){const R2=W.res;const rec=[['🔫 Lőszercsomag','+lőszer minden fegyverhez',{stone:6,crystal:1},()=>{for(let i=0;i<5;i++)G.res[i]=(G.res[i]||0)+WPN[i].res}],['❤️ Gyógycsomag','+1 medkit (Z)',{wood:6,stone:4},()=>{G.inv.hp++}],['🛡️ Pajzsital','+1 pajzsital (X)',{crystal:2,stone:4},()=>{G.inv.beer++}],
 ['🪵 Építőanyag','+60 építőelem',{wood:12},()=>{BR.mats=(BR.mats||0)+60}],['⚙️ Kristálypenge','+15% sebzés erre a menetre',{crystal:6,stone:10},()=>{W.dmgB*=1.15}],['💗 Életerő-amulett','+25 max életerő',{crystal:8,wood:10},()=>{G.mhp+=25;G.hp+=25}]];
 window._vgRec=rec;guiOpen('<h1 class="f" style="font-size:30px">🛠️ MŰHELY</h1><div style="color:#cbd5e1;margin-bottom:6px">🪵 '+R2.wood+' · 🪨 '+R2.stone+' · 💎 '+R2.crystal+'</div><div class="g">'+rec.map((r,i)=>{const ok=Object.entries(r[2]).every(([k,v])=>R2[k]>=v);return'<div class="it" style="cursor:default'+(ok?'':';opacity:.55')+'"><div class="f" style="font-size:18px">'+r[0]+'</div><small>'+r[1]+'</small><small style="color:#fde68a">Ár: '+Object.entries(r[2]).map(([k,v])=>({wood:'🪵',stone:'🪨',crystal:'💎'})[k]+' '+v).join(' · ')+'</small>'+bB('ELKÉSZÍT','vgCraft('+i+')',ok?'':'r')+'</div>'}).join('')+'</div>'+bB('VISSZA','vgTalk(\'kovacs\')','r'))}
window.vgCraftUI=craftUI;window.vgTalk=talk;
window.vgCraft=i=>{const r=window._vgRec[i],R2=W.res;if(!Object.entries(r[2]).every(([k,v])=>R2[k]>=v))return;Object.entries(r[2]).forEach(([k,v])=>R2[k]-=v);r[3]();try{sfx('buy')}catch(e){}craftUI()};

// ---------- billentyűk ----------
const KD={};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();KD[k]=true;if(!G||!G.stw||!W||!run||G.phase!=='play')return;
 if(k==='f'){const n=NPC.find(n=>H2(G.x,G.z,n.x,n.z)<3.8&&Math.abs(G.y)<2);if(n){talk(n.id);KD.f=false;return}if(H2(G.x,G.z,-11,2)<3.6){journal();KD.f=false;return}if(H2(G.x,G.z,12,4)<3.6){craftUI();KD.f=false}}
 if(k==='j'){journal()}
 if(k===' '&&!G.gl&&G.vy===0&&G.y>.05&&Math.abs(floorH(G)-G.y)<.08){G.vy=11}});
addEventListener('keyup',e=>{KD[e.key.toLowerCase()]=false});

// ---------- hangok/szövegek kiszűrése ebben a módban ----------
['spk','taunt'].forEach(n=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){if(G&&G.stw)return;return o.apply(this,arguments)}});
{const o=window.say;window.say=function(t){if(G&&G.stw&&typeof HURT!=='undefined'&&HURT.includes(t))return;return o.apply(this,arguments)}}
{const o=window.ftx;window.ftx=function(x,z,t){if(G&&G.stw&&!VF&&!(/^[-+]?\d/.test(String(t))&&!/Ft/.test(String(t))))return;return o.apply(this,arguments)}}
{const o=window.pk;window.pk=function(x,z,t){if(G&&G.stw&&!['coin','hp','beer','w2','w3','w4'].includes(t))return;return o.apply(this,arguments)}}
{const o=window.mapGui;if(typeof o==='function')window.mapGui=function(){if(G&&G.stw&&W)return bigMap();return o.apply(this,arguments)}}
{const o=window.moneyTick;if(typeof o==='function')window.moneyTick=function(){if(G&&G.stw&&W)return;return o.apply(this,arguments)}}
{const o=window.hunTick;if(typeof o==='function')window.hunTick=function(){if(G&&G.stw&&W)return;return o.apply(this,arguments)}}
{const o=window.spawnWave;window.spawnWave=function(){if(G&&G.stw)return;return o.apply(this,arguments)}}
{const o=window.buildHun;window.buildHun=function(ar){if(ON())return buildWorld();return o.apply(this,arguments)}}

// ---------- indítás ----------
WP('launch',()=>{setHU(ON()?WHU:ORIG);MINI=null},()=>{const g=G;if(!ON()){showHud(false);W=null;return}
 g.stw=true;g.sto=9999;g.nka=false;if(g.sm)g.sm.visible=false;showHud(true);
 W={res:{wood:0,stone:0,crystal:0},got:{wood:0,stone:0,crystal:0},q:{},done:0,zs:0,ft:0,kills:0,disc:{},bio:null,lvl:0,spawnT:20,holdT:0,holdN:null,dmgB:1,track:'main',runeOK:0,order:[0,1,2,3].sort(()=>R()-.5),beac:{}};
 QD.forEach(d=>W.q[d.id]={id:d.id,st:'locked'});
 npcSpawn();
 W.beac.ice=mkBeacon('ice',P.ice,0x38bdf8,'❄️ Jég-lángkő');W.beac.fire=mkBeacon('fire',P.fire,0xff6a00,'🔥 Tűz-lángkő');W.beac.mush=mkBeacon('mush',P.mush,0xd946ef,'🍄 Gomba-lángkő');W.beac.sand=mkBeacon('sand',P.sand,0xfacc15,'☀️ Nap-lángkő');
 // rúnák + obeliszk felirat
 W.runeM=P.runes.map((p,i)=>{const dl=Math.hypot(-p.x,160-p.z),m=mesh(new THREE.BoxGeometry(.9,.9,.1),MS(0x3b2f1f),p.x-p.x/dl*.47,2.6,p.z+(160-p.z)/dl*.47);m.lookAt(0,2.6,160);const s=spr(GLY[i],2.6);s.position.set(p.x,4.6,p.z);scene.add(s);return m});
 const ob=spr(W.order.map(i=>GLY[i]).join('  →  '),3.2,'x');ob.position.set(P.obel.x,8.6,P.obel.z);scene.add(ob);
 // tábortűz, kapu
 W.fire=mesh(new THREE.ConeGeometry(.9,2.2,10),GL(0xff7a1a,2.5),0,1.2,0);const fl=new THREE.PointLight(0xff8a3a,2.2,40);fl.position.set(0,3,0);scene.add(fl);W.fireL=fl;
 const ring=mesh(new THREE.TorusGeometry(5,.35,10,48),GL(0x64748b,.6),0,6,-30);const disk=new THREE.Mesh(new THREE.CircleGeometry(4.7,40),new THREE.MeshBasicMaterial({color:0x7c3aed,transparent:true,opacity:.0,side:THREE.DoubleSide,depthWrite:false}));disk.position.set(0,6,-30);scene.add(disk);W.portal={ring,disk};
 // szélmalom lapátok
 const bl=new THREE.Group();for(let i=0;i<4;i++){const b=mesh(new THREE.BoxGeometry(.5,6,.1),MS(0xf5f5f4),0,3,0);const p=new THREE.Group();p.add(b);p.rotation.z=i*Math.PI/2;bl.add(p)}bl.position.set(P.mill.x,9,P.mill.z+3.1);scene.add(bl);W.mill=bl;
 // parázs a vulkán felett
 {const pts=[];for(let i=0;i<300;i++)pts.push(new THREE.Vector3(160+rnd(-40,40),rnd(1,40),rnd(-40,40)));W.emb=new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts),new THREE.PointsMaterial({color:0xff8a3a,size:.5,transparent:true,opacity:.8}));scene.add(W.emb)}
 // ködfoltok a gombaerdőben (spórák)
 {const pts=[];for(let i=0;i<400;i++)pts.push(new THREE.Vector3(-170+rnd(-55,55),rnd(.5,12),rnd(-55,55)));W.spo=new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts),new THREE.PointsMaterial({color:0x7dd3fc,size:.35,transparent:true,opacity:.8}));scene.add(W.spo)}
 // követett cél fénycsóva
 W.wb=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,90,10,1,true),new THREE.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:.22,depthWrite:false,blending:THREE.AdditiveBlending}));W.wb.position.y=45;scene.add(W.wb);
 if(g.car)g.car.visible=false;g.x=rnd(-3,3);g.z=10;
 $('wv').textContent='🌍 MENTSD MEG A VILÁGOT';setTimeout(()=>{if(G===g&&g.phase==='drop')land()},300);
 setTimeout(()=>{if(G===g){banner('MENTSD MEG A VILÁGOT','AZ ÁRNYKIRÁLY ÉBRED');say('🧙 Beszélj Bölcs Ilkával a táborban (F)! · J = napló · M = térkép')}},1200)});
WP('land',null,()=>{if(G&&G.stw&&W){G.x=rnd(-3,3);G.z=10;G.y=Math.max(G.y,40);if(window.BR)BR.mats=Math.max(BR.mats||0,150)}});

// ---------- fő ciklus ----------
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!g.stw||!W||g.over)return;if(g.car)g.car.visible=false;if(g.phase!=='play')return;g.delay=1e9;g.cash=0;g.ringT=1e9;g.ring=0;g.en=g.en.filter(e=>!e.dead);g._dmgB=W.dmgB;
 const t=g.t;
 // táj, köd, felfedezés
 const b=biomeAt(g.x,g.z);if(W.bio!==b.id){W.bio=b.id;if(!W.disc[b.id]){W.disc[b.id]=1;banner(b.n,b.e+' ÚJ TÁJ FELFEDEZVE');if(window.ACCXP)ACCXP.add(60,'Felfedezés')}else banner(b.n,b.e)}
 const fc=new THREE.Color(W.sunrise?0xffc79a:b.fog);scene.fog.color.lerp(fc,Math.min(1,dt*.8));scene.background.lerp(fc,Math.min(1,dt*.8));const ff=W.sunrise?600:b.ff,fn=W.sunrise?200:b.fn;scene.fog.far+=(ff-scene.fog.far)*Math.min(1,dt*.7);scene.fog.near+=(fn-scene.fog.near)*Math.min(1,dt*.7);
 W.lvl=Object.values(W.beac).filter(x=>x.lit).length;
 // animációk
 W.fire.scale.set(1+Math.sin(t*13)*.08,1+Math.sin(t*9)*.15,1+Math.cos(t*11)*.08);W.fireL.intensity=2+Math.sin(t*17)*.3;
 W.portal.ring.rotation.z+=dt*(.2+W.lvl*.4);W.portal.ring.material=W.lvl?GL([0x64748b,0x38bdf8,0x22d3ee,0xa78bfa,0xfacc15][W.lvl],1+W.lvl*.4):W.portal.ring.material;W.portal.disk.material.opacity=W.lvl*.12+Math.sin(t*3)*.03*W.lvl;
 W.mill.rotation.z+=dt*.8;W.emb.position.y=(t*2)%6;W.spo.rotation.y=t*.02;
 Object.values(W.beac).forEach(bc=>{bc.cr.rotation.y+=dt*(bc.lit?2:.5);if(bc.lit){bc.fl.scale.set(1+Math.sin(t*12+bc.x)*.1,1+Math.sin(t*8+bc.z)*.2,1)}});
 NPC.forEach(n=>{const st=npcState(n.id);n.mk.visible=!!st;if(st){if(n.mk._s!==st){n.mk.material.map=spr(st,2.4,'x').material.map;n.mk._s=st}n.mk.position.y=6+Math.sin(t*3)*.25}const d=H2(g.x,g.z,n.x,n.z);n.lb.visible=d<45;if(d<12)n.m.rotation.y=Math.atan2(g.x-n.x,g.z-n.z)});
 // lények bőre, animáció
 g.en.forEach(e=>{if(!e._vg)skin(e,BCR[biomeAt(e.x,e.z).id]);const c=e.m.children;if(c[0])c[0].position.y+=Math.sin(t*6+e.ph)*.004;if(e.m.userData.ring)e.m.userData.ring.rotation.z+=dt*2});
 // ellenfelek érkezése
 W.spawnT-=dt;if(W.spawnT<=0){W.spawnT=rnd(14,22)-W.lvl*1.5;const inCamp=Math.hypot(g.x,g.z)<45;if(!inCamp&&g.en.length<12+W.lvl*2){const n=2+Math.floor(R()*2)+Math.floor(W.lvl/2);spawnNear(g.x,g.z,35,55,null,n)}}
 // láva, crater
 if(g.y<.35&&LAVA.some(l=>H2(g.x,g.z,l.x,l.z)<l.r)){hurt(22*dt,true);if(!W._lt||t-W._lt>1.2){W._lt=t;say('🔥 FORRÓ! Ez láva!')}}
 if(g.y>P.volTop-1.5&&H2(g.x,g.z,P.vol.x,P.vol.z)<6.5)hurt(30*dt,true);
 // küldetés-tick
 QD.forEach(d=>{const s=W.q[d.id];if(s.st==='active'&&d.tick){try{d.tick(s,dt)}catch(e){console.error(e)}}});
 // nyomva tartott F
 let tgt=null,td=1e9;const near=NPC.some(n=>H2(g.x,g.z,n.x,n.z)<3.8)||H2(g.x,g.z,-11,2)<3.6||H2(g.x,g.z,12,4)<3.6;
 const cands=[];QD.forEach(d=>{const s=W.q[d.id];if(s.st==='active'&&d.holds){try{(d.holds(s)||[]).forEach(h=>cands.push(h))}catch(e){}}});
 cands.forEach(h=>{const dd=H2(g.x,g.z,h.x,h.z);if(dd<h.r&&dd<td){td=dd;tgt=h}});
 if(!tgt)NODES.forEach(n=>{if(n.left<=0)return;const dd=H2(g.x,g.z,n.x,n.z);if(dd<n.r&&dd<td&&g.y<1){td=dd;tgt=n}});
 let hn='';if(near){const n=NPC.find(n=>H2(g.x,g.z,n.x,n.z)<3.8);hn=n?'F – Beszélgetés: '+n.e+' '+n.n:H2(g.x,g.z,-11,2)<3.6?'F – Küldetésnapló':'F – Műhely'}
 else if(tgt)hn='F nyomva tartása – '+(tgt.l?tgt.l.replace('…',''):({wood:'🪵 favágás',stone:'🪨 kőfejtés',crystal:'💎 kristálybányászat'})[tgt.t]);
 hint.style.display=hn?'block':'none';hint.textContent=hn;
 if(KD.f&&tgt&&!near&&!GUI.on){if(W.holdN!==tgt&&!(W.holdN&&tgt.l&&W.holdN.l===tgt.l&&W.holdN.x===tgt.x)){W.holdN=tgt;W.holdT=0}
  if(tgt.ok&&!tgt.ok()){hold.style.display='block';$('vgHt').textContent='⛔ '+tgt.no;$('vgHr').style.background='#0008'}
  else{W.holdT+=dt;const dur=tgt.dur||1.1,f=Math.min(1,W.holdT/dur);hold.style.display='block';$('vgHt').textContent=tgt.l||({wood:'🪵 Favágás…',stone:'🪨 Kőfejtés…',crystal:'💎 Bányászat…'})[tgt.t];$('vgHr').style.background='conic-gradient(#facc15 '+(f*360)+'deg,#0008 0)';
  if(f>=1){W.holdT=0;W.holdN=null;if(tgt.fn){try{tgt.fn()}catch(e){console.error(e)}}else{const amt={wood:5,stone:4,crystal:2}[tgt.t];W.res[tgt.t]+=amt;W.got[tgt.t]+=amt;VF=true;ftx(tgt.x,tgt.z,'+'+amt+' '+({wood:'🪵',stone:'🪨',crystal:'💎'})[tgt.t],'');VF=false;tgt.left--;if(tgt.left<=0){tgt.cd=50;tgt.ref.forEach(([arr,i])=>{arr._im.setMatrixAt(i,ZERO);arr._im.instanceMatrix.needsUpdate=true})}}}}}
 else{W.holdN=null;W.holdT=0;hold.style.display='none'}
 NODES.forEach(n=>{if(n.left<=0){n.cd-=dt;if(n.cd<=0){n.left=n.t==='crystal'?2:3;n.ref.forEach(([arr,i,m])=>{arr._im.setMatrixAt(i,m);arr._im.instanceMatrix.needsUpdate=true})}}});
 // követett cél
 if(W.track&&!['active','ready'].includes(W.q[W.track].st))W.track=pickTrack();let tg=null;
 if(W.track){const d=QM[W.track],s=W.q[W.track];if(s.st==='ready')tg={x:NP[d.npc].x,z:NP[d.npc].z,n:'Leadás: '+NP[d.npc].n};else if(d.tgt)tg=safe(()=>d.tgt(s))||null}
 else{const id=QD.find(d=>avail(d.id));if(id&&id.main)tg={x:NP[id.npc].x,z:NP[id.npc].z,n:'Új küldetés: '+NP[id.npc].n}}
 W.tg=tg;W.wb.visible=!!tg;if(tg){W.wb.position.x=tg.x;W.wb.position.z=tg.z;const dist=H2(g.x,g.z,tg.x,tg.z);way.style.display='flex';$('vgWt').textContent=tg.n+' · '+Math.round(dist)+' m';const rel=Math.atan2(tg.z-g.z,tg.x-g.x)-g.ang;$('vgArr').style.transform='rotate('+rel+'rad)'}else way.style.display='none';
 // HUD
 if(!W._hT||t-W._hT>.25){W._hT=t;
  $('vgRes').innerHTML='<span>🪵 '+W.res.wood+'</span><span>🪨 '+W.res.stone+'</span><span>💎 '+W.res.crystal+'</span>';
  const act=QD.filter(d=>['active','ready'].includes(W.q[d.id].st));$('vgQ').innerHTML=act.length?act.slice(0,5).map(d=>{const s=W.q[d.id];return'<div class="q'+(W.track===d.id?' tr':'')+(s.st==='ready'?' rd':'')+'">'+(d.main?'⭐ ':'')+d.t+'<small>'+(s.st==='ready'?'✅ Menj vissza: '+NP[d.npc].n:safe(()=>d.goal(s)))+'</small></div>'}).join(''):'<div class="q"><small>Keress ❗ jelű szereplőket!</small></div>';
  $('vgB').textContent=b.e+' '+b.n;$('vgK').textContent='📜 '+W.done+'/'+QD.length;$('vgE').textContent='🔥 '+W.lvl+'/4 · 👾 '+g.en.length;drawMini();
  $('al').textContent='ÉLETERŐ: '+Math.round(g.hp)+' · LÉNYEK: '+W.kills;$('wv').textContent='🌍 MENTSD MEG A VILÁGOT'}});
WP('kill',a=>a[0],(a,e)=>{if(W&&G&&G.stw&&e)W.kills++});
WP('end',null,a=>{showHud(false);const g=G;if(!g||!g.stw||!W)return;
 const rt=$('rt');if(rt){rt.innerHTML=W.victory?'🌅 A VILÁG MEGMENEKÜLT!':W.ok?'🏠 HAZATÉRTÉL':'💀 ELESTÉL';rt.style.color=W.victory||W.ok?'#4ade80':'var(--r)'}const rs=$('rs');if(rs)rs.textContent='Mentsd meg a világot';
 const rb=$('rb');if(rb)rb.innerHTML='<div style="font-size:17px;line-height:1.7">📜 Teljesített küldetések: <b>'+W.done+'/'+QD.length+'</b><br>🔥 Meggyújtott lángkövek: <b>'+W.lvl+'/4</b><br>🗺️ Felfedezett tájak: <b>'+Object.keys(W.disc).length+'/9</b><br>🪙 Zseton: <b>+'+W.zs+'</b> · 💵 <b>+'+ft(W.ft)+'</b><br>👾 Legyőzött lények: <b>'+W.kills+'</b></div>';
 if(window.ACCXP)ACCXP.add(W.kills*20+W.done*100,'Világmentés')});
})();
// felső doboz: a régi hullám/forint helyett a világ adatai
(function(){const o=window.hud;if(typeof o!=='function')return;window.hud=function(){const r=o.apply(this,arguments);try{const g=G,W=window._STW&&_STW();if(g&&g.stw&&W){const lv=(W.lvl||0);document.getElementById('wv').textContent='🌍 MENTSD MEG A VILÁGOT';document.getElementById('sco').textContent='🔥 '+lv+'/4 lángkő · 📜 '+W.done+' küldetés';document.getElementById('al').textContent='👾 LEGYŐZÖTT LÉNYEK: '+W.kills}}catch(e){}return r}})();
