// ===== ÚJ PÁLYA-GENERÁTOR: foglaltsági térkép (nincs egymásba csúszás) + kampánybusz =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
function hunLandmarks(ar){const g=G;g.arh=true;g.plat=[];g.yachts=[];
 const sh=new THREE.Shape();HU.forEach((p,i)=>i?sh.lineTo(p[0],-p[1]):sh.moveTo(p[0],-p[1]));
 const isl=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:4,bevelEnabled:false}),[mat('grass@.06,.06',0x4f9a3a),mat('rock@.12,.12',0x8a7a6a)]);isl.rotation.x=-Math.PI/2;isl.position.y=-4;isl.receiveShadow=true;scene.add(isl);
 const bs=new THREE.Shape();HU.forEach((p,i)=>i?bs.lineTo(p[0]*1.04,-p[1]*1.04):bs.moveTo(p[0]*1.04,-p[1]*1.04));const bm=new THREE.Mesh(new THREE.ExtrudeGeometry(bs,{depth:4,bevelEnabled:false}),mat('gen',0xe9d8a6));bm.rotation.x=-Math.PI/2;bm.position.y=-4.45;scene.add(bm);
 const sea=new THREE.Mesh(new THREE.CircleGeometry(1500,64),new THREE.MeshStandardMaterial({color:0x0e4f7a,emissive:0x06263d,roughness:.25,metalness:.3}));sea.rotation.x=-Math.PI/2;sea.position.y=-2.6;scene.add(sea);
 scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(HU.map(p=>new THREE.Vector3(p[0],.08,p[1]))),new THREE.LineBasicMaterial({color:0xfacc15})));
 const st=[];for(let i=0;i<220;i++)st.push(new THREE.Vector3(rnd(-1000,1000),rnd(60,800),rnd(-1000,1000)));scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(st),new THREE.PointsMaterial({color:0xffffff,size:3,fog:false})));
 const pad=(x,z,w,d,c,k,e)=>{const m=bx(w,.07,d,x,z,c,0,0,k);if(e){m.material=m.material.clone();m.material.emissive=new THREE.Color(c);m.material.emissiveIntensity=e}return m};
 const lt=(x,z,c,i)=>{const p=new THREE.PointLight(c,i||1.3,44);p.position.set(x,8,z);scene.add(p)};
 sgn('KÖZPÉNZ-SZIGET',0,32,-24,11);
 pad(-52,-8,26,22,0x14532d,'grass',.1);
 bx(20,.6,6,-52,-8,0xd4af37,0,9.5,'metal');g.plat.push({x:-52,z:-8,hw:10,hd:3,h:10.1});[[-61,-10],[-61,-6],[-43,-10],[-43,-6]].forEach(([x,z])=>cyl(.35,9.5,x,z,0xb8860b,1));
 for(let i=0;i<16;i++){const x=-27-.95*i,h=.62*(i+1);bx(.95,h,3,x,-8,0xcbd5e1,0,0,'metal');g.plat.push({x,z:-8,hw:.48,hd:1.5,h})}
 sgn('ARANYKILÁTÓ (BELÉPŐ: 0 FT, KÖZPÉNZBŐL)',-52,14,-8,4);lt(-52,-8,0xfacc15,1.6);
 pad(-30,10,21,8,0x06b6d4,'water',.35);sgn('KAVIÁR-LAGÚNA · MAGÁNSTRAND',-30,3.4,10,3.2);lt(-30,10,0x22d3ee,1.8);
 for(let i=0;i<4;i++){const x=-38+i*5.3,z=i%2?14.5:5.5;bx(5,1.5,2,x,z,0xffffff,1,0,'metal');bx(2,1,1.4,x,z,0x0ea5e9,0,1.5,'glass');sgn('🛥️',x,4,z,2);g.yachts.push({x,z})}
 pad(-12,1,4.8,50,0x1d4ed8,'water',.3);sgn('DUNA-CSATORNA',-12,3,-14,3);
 [-16,16].forEach(z=>{bx(6,.4,3,-12,z,0x78716c,0,.8,'conc');g.plat.push({x:-12,z,hw:3,hd:1.5,h:1.2})});
 pad(-4,-1.8,16,4.5,0xf8fafc,'tile',0);lt(-4,-9,0xa855f7,2);
 bx(18,6,8,-4,-9,0xf5f5f4,1,0,'conc');[-14.4,6.4].forEach(x=>cyl(1.2,13,x,-9,0xe7e5e4,1));
 const dm=M(GS,0x7c3aed,'glass');dm.scale.set(4.6,3.6,4.6);dm.position.set(-4,9,-9);scene.add(dm);
 const tr=new THREE.Mesh(new THREE.TorusGeometry(4.8,.16,8,40),new THREE.MeshBasicMaterial({color:0xfacc15}));tr.rotation.x=Math.PI/2;tr.position.set(-4,6.2,-9);scene.add(tr);
 sgn('KUPOLA-MINISZTÉRIUM (CSÚSZÓS LÉPCSŐ)',-4,16,-9,3.4);
 for(let i=0;i<10;i++){const a=i/10*6.283,x=-4+Math.cos(a)*14,z=-9+Math.sin(a)*14;if(!hin(x,z))continue;const b=bx(5,1.4,.2,x,z,0xef4444,1,0,'stripe');b.rotation.y=-a+1.57}
 bx(140,.12,.3,0,17.3,0xd1d5db,0,0,'metal');bx(140,.12,.3,0,18.7,0xd1d5db,0,0,'metal');for(let i=0;i<46;i++)bx(.3,.08,2.4,-69+i*3,18,0x44403c,0);sgn('REPTÉRI EXPRESSZ (30 mp)',22,3.2,15,3);
 g.akm=pad(38,-6,18,16,0x84cc16,'metal',.6);bx(12,8,6,42,-17,0x3f3f46,1,0,'metal');sgn('LÍTIUM-BÁNYA ☢️',42,10.5,-14,3.4);
 for(let i=0;i<3;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(3,5,6),mat('conc',0x78716c));c.position.set(28+i*6,2.5,-11);scene.add(c);g.col.push({x:28+i*6,z:-11,r:2.6,h:5});sgn('☁️',28+i*6,9,-11,5)}lt(38,-6,0x84cc16,1.8);
 bx(70,.5,.6,7,-12,0xd4af37,0,0,'metal');
 const kg=new THREE.Group();g.kv={x:-20,v:4,grp:kg,pl:[]};kg.position.x=-20;
 [[0,6,3,0xd4af37],[-7,5,2.4,0xfef3c7],[-13,5,2.4,0xfef3c7],[-19,5,2.4,0xfef3c7]].forEach(([off,w,h,c])=>{const m=M(GB,c,'metal');m.scale.set(w,h,3);m.position.set(off,h/2+.5,-12);kg.add(m);g.kv.pl.push({x:-20+off,z:-12,hw:w/2,hd:1.5,h:h+.5,off,mv:1})});scene.add(kg);g.plat.push(...g.kv.pl);sgn('ARANY EGYSÍN – ÜLJ FEL!',-10,7,-18,3.4);lt(0,-12,0xfacc15,1.2);
 {const cx=70,cz=30;pad(cx,cz,30,22,0x16a34a,'grass',.25);for(let i=0;i<18;i++){const a=i/18*6.283,x=cx+Math.cos(a)*19,z=cz+Math.sin(a)*14;if(i===4||i===13)continue;const b=bx(4.6,5,2.2,x,z,0xe5e7eb,1,0,'conc');b.rotation.y=-a+1.57}
  for(let i=0;i<4;i++){const a=i/4*6.283+.78;cyl(.4,16,cx+Math.cos(a)*22,cz+Math.sin(a)*17,0x9ca3af,1);const l=M(GS,0xfffbeb);l.scale.setScalar(.9);l.position.set(cx+Math.cos(a)*22,16.5,cz+Math.sin(a)*17);scene.add(l)}
  sgn('KÖZPÉNZ ARÉNA (4000 LAKOS, 40 000 SZÉK)',cx,14,cz,4);lt(cx,cz,0xffffff,2)}
 {const cx=-80,cz=30;const hill=new THREE.Mesh(new THREE.ConeGeometry(18,6,24),mat('grass',0x3f7d4a));hill.position.set(cx,3,cz);scene.add(hill);g.plat.push({x:cx,z:cz,hw:5,hd:5,h:5});
  for(let i=0;i<5;i++){const a=i/5*6.283,x=cx+Math.cos(a)*12,z=cz+Math.sin(a)*12;cyl(.35,18,x,z,0xf1f5f9,1);for(let b=0;b<3;b++){const bl=M(GB,0xffffff,'metal');bl.scale.set(.4,6,.15);bl.position.set(x,18+Math.cos(b*2.09)*3,z+Math.sin(b*2.09)*3+.5);bl.rotation.x=b*2.09;scene.add(bl)}}
  sgn('SZÉLKERÉK-DOMB (NEM FORGANAK)',cx,24,cz,4)}
}

// ---------- foglaltsági térkép: semmi sem kerülhet egymásba ----------
const OCC=[];
const reserveC=(x,z,r)=>OCC.push({x,z,r});
const reserveR=(x0,z0,x1,z1)=>OCC.push({x0:Math.min(x0,x1),z0:Math.min(z0,z1),x1:Math.max(x0,x1),z1:Math.max(z0,z1)});
function free(x,z,r){if(!hin(x,z))return false;for(let i=0;i<8;i++){const a=i/8*6.283;if(!hin(x+Math.cos(a)*r*1.05,z+Math.sin(a)*r*1.05))return false}
 for(const o of OCC){if(o.r!==undefined){if(Math.hypot(x-o.x,z-o.z)<o.r+r)return false}else{const qx=Math.max(o.x0,Math.min(o.x1,x)),qz=Math.max(o.z0,Math.min(o.z1,z));if(Math.hypot(x-qx,z-qz)<r)return false}}
 for(const c of G.col){if(c.hw){const[lx,lz]=boxLocal(c,x,z);const qx=Math.max(-c.hw,Math.min(c.hw,lx)),qz=Math.max(-c.hd,Math.min(c.hd,lz));if(Math.hypot(lx-qx,lz-qz)<r+.6)return false}else if(Math.hypot(x-c.x,z-c.z)<c.r+r+.6)return false}
 return true}
const claim=(x,z,r)=>reserveC(x,z,r);
function findFree(cx,cz,r,spread,tries){if(free(cx,cz,r))return[cx,cz];for(let k=0;k<(tries||40);k++){const a=Math.random()*6.283,d=(k+1)/(tries||40)*spread;const x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(free(x,z,r))return[x,z]}return null}
function reserveLandmarks(){
 reserveC(-52,-8,15);reserveR(-44,-10.5,-24,-5.5);reserveC(-30,10,12.5);reserveC(-4,-9,16);reserveC(38,-6,13);
 reserveR(-32,-15.5,44,-8.5);reserveR(-72,15.5,72,20.5);reserveR(-16,-27,-8,29);reserveC(70,30,25);reserveC(-80,30,19);
 reserveR(-25,-50,7,-22);reserveR(-54,48.5,-6,55.5);reserveC(-4,30,9);reserveC(0,42,9);reserveC(230,100,20);
 reserveC(8,36,4);reserveC(-22,40,4);reserveC(-4,-24,6)}
// ---------- városok, falvak, erdők, ládák – ütközésmentesen ----------
// valódi homlokzat-fotós épületek: oldalt ablakos homlokzat, felül tetőburkolat
const FAC=[['fa1',30],['fa2',26],['fa3',20],['fa4',21],['fa5',20],['fa3',18],['fa4',24]];
function towerB(w,h,d,x,z){const f=pick(FAC);let side,top;if(window.texMat){side=texMat(f[0],1,1,0xffffff);top=texMat('conc',1,1,0x55595f)}else{side=mat('neonwin',0x23284a);top=mat('conc',0x55595f)}
 const m=new THREE.Mesh(boxG(w,h,d,f[1]),[side,side,top,top,side,side]);m.position.set(x,h/2,z);m.castShadow=m.receiveShadow=true;scene.add(m);
 const cap=new THREE.Mesh(new THREE.BoxGeometry(w+.4,.5,d+.4),mat('metal',0x3a3f47));cap.position.set(x,h+.25,z);scene.add(cap);
 if(Math.random()<.5){const ac=new THREE.Mesh(new THREE.BoxGeometry(Math.min(3,w*.4),1.2,Math.min(2.4,d*.4)),mat('metal',0x9ca3af));ac.position.set(x+w*.18,h+1.1,z-d*.15);scene.add(ac)}
 G.col.push({x,z,r:Math.max(w,d)/2*.9,h,hw:w/2,hd:d/2,m});return m}
function bigMap2(){const g=G;g.kio=g.kio||[];g.cities=[];outerLandmarks();
 const kio=(x,z,t)=>{bx(2.2,1.2,2.2,x,z,0x334155,1,0,'metal');const s=spr(KT[t][0],2.4);s.material.depthTest=true;s.position.set(x,3,z);scene.add(s);g.kio.push({x,z,t})};
 const house=(x,z,rot)=>{const w=rnd(3.2,4.6),d=rnd(3.2,4.6),h=rnd(2.6,3.8),m=bx(w,h,d,x,z,pick([0xf5e6c8,0xd9e4f0,0xc9d6c0,0xf0d0c0]),1,0,'brick');m.castShadow=false;const r=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.75,1.8,4),mat('roof@2,1',pick([0x9a3412,0x1e3a8a,0x334155])));r.position.set(x,h+.9,z);r.rotation.y=Math.PI/4;r.castShadow=false;scene.add(r);claim(x,z,Math.max(w,d)*.62)};
 const CITIES=[[-230,-40,'ALAPÍTVÁNYVÁROS'],[-200,75,'KÖZBESZERZÉSFÖLDE'],[-165,-115,'ÁFAKIKÖTŐ'],[-105,110,'MŰFŰLIGET'],[-70,-100,'KONZULTÁCIÓHÁZA'],[-35,130,'PLAKÁTPART'],[40,-110,'STRÓMANNSZÁLLÁS'],[55,110,'REZSIVÖLGY'],[110,-80,'TANÁCSADÓFALVA'],[170,-35,'KIKÜLDETÉSVÁR'],[195,70,'TENDERHEGY'],[250,0,'OFFSHORE-ÖBÖL'],[150,130,'KISKAPUSZENT'],[-280,15,'NYUGATI VÁM'],[270,-75,'KELETI NYITÁS'],[0,-140,'HATÁRIDŐHOSSZABBÍTÁS'],[-10,160,'DÉLI MÓLÓ'],[215,-130,'LOBBIGRÁD'],
  [-120,-30,'KÉTHARMADFALVA'],[90,30,'ÁRFOLYAMHÁZA'],[-250,-110,'SZUVERENITÁSVÁR'],[260,95,'MILLIÁRDOS-ÖBÖL'],[-140,165,'PÁLYÁZATHEGY'],[120,-165,'TANÚSÍTVÁNYFALVA'],[-300,70,'VÁMKAPU'],[300,40,'KELETI KAPU']];
 CITIES.forEach(([x0,z0,name])=>{const c=findFree(x0,z0,9,22,50);if(!c)return;const[cx,cz]=c;
  // tér: arany placc + kioszkok + jelzés
  bx(13,.06,13,cx,cz,0xd6d0c4,0,0,'cobble');bx(3,.2,3,cx,cz,0xfacc15,0,0,'metal');kio(cx+3.5,cz+3.5,'taxi');kio(cx-3.5,cz-3.5,pick(['casino','gun','med']));sgn(name,cx,28,cz,5);pk(cx,cz,'chest');g.pk[g.pk.length-1].l=99999;
  const p=new THREE.PointLight(0xffd27a,1.2,38);p.position.set(cx,8,cz);scene.add(p);claim(cx,cz,6.5);g.cities.push({x:cx,z:cz,name});
  // épületek körben, egymástól távol
  let placed=0;for(let k=0;k<30&&placed<7;k++){const a=k/30*6.283*2.3+Math.random()*.4,r=rnd(10,17),w=rnd(5,9),d=rnd(5,9),x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,rad=Math.max(w,d)*.72+1.2;if(!free(x,z,rad))continue;
   towerB(w,rnd(10,30),d,x,z);claim(x,z,Math.max(w,d)*.72);placed++}});
 // falvak
 let vi=0;for(let k=0;k<220&&vi<55;k++){const x=rnd(-320,320),z=rnd(-180,180);if(!free(x,z,11))continue;let n=0;for(let j=0;j<6&&n<4;j++){const a=j/6*6.283+rnd(-.3,.3),r=rnd(5,9),hx=x+Math.cos(a)*r,hz=z+Math.sin(a)*r;if(free(hx,hz,3.2)){house(hx,hz);n++}}if(n){sgn(VN[vi%VN.length],x,7,z,2.6);claim(x,z,2.5);vi++}}
 // erdők – fák csak szabad helyre, egymástól is távol
 const T=[];const forest=(cx,cz,n,name)=>{let ok=0;for(let i=0;i<n*3&&ok<n;i++){const x=cx+rnd(-30,30),z=cz+rnd(-20,20);if(!free(x,z,1.4))continue;T.push([x,z,rnd(0,1)]);g.col.push({x,z,r:.7,h:3.2});claim(x,z,1);ok++}if(ok>5)sgn(name,cx,10,cz,3.4)};
 forest(-220,-100,110,'ÁTCSOPORTOSÍTOTT ERDŐ');forest(-270,90,80,'KIVÁGÁSRA VÁRÓ LIGET');forest(100,-140,100,'VADÁSZKASTÉLY-ERDŐ');forest(250,45,80,'MAGÁNERDŐ (BELÉPNI TILOS)');forest(-130,-150,80,'PAPÍRON ÜLTETETT ERDŐ');forest(190,-100,80,'TÉRFIGYELŐ-LIGET');forest(-60,120,70,'KÖZPARK-ERDŐ');forest(60,150,70,'KILÁTÁSTALAN ERDŐ');forest(-180,10,60,'FELCSÚTI LIGET');forest(150,10,60,'OFFSHORE-PÁLMÁS');
 if(T.length){const n=T.length,tr=new THREE.InstancedMesh(GC,mat('wood',0x5b3a1e),n),cr=new THREE.InstancedMesh(GS,mat('grass',0x166534),n),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new THREE.Vector3(),ps=new THREE.Vector3();T.forEach((t,i)=>{ps.set(t[0],1.6,t[1]);sc.set(.5,3.2,.5);m4.compose(ps,q,sc);tr.setMatrixAt(i,m4);const k=2.2+t[2];ps.set(t[0],4.8,t[1]);sc.set(k,k+1,k);m4.compose(ps,q,sc);cr.setMatrixAt(i,m4)});tr.castShadow=false;cr.castShadow=false;scene.add(tr,cr)}
 sgn('BÖLÉNY-PUSZTA',230,6,100,4);
 // ládák
 let ch=0;for(let k=0;k<500&&ch<70;k++){const x=rnd(-320,320),z=rnd(-180,180);if(!free(x,z,1.5))continue;pk(x,z,'chest');g.pk[g.pk.length-1].l=99999;claim(x,z,1.5);ch++}
 // díszletek: ládakupacok, betonelemek, part menti pálmák – csak szabad helyre
 for(let k=0,n=0;k<300&&n<30;k++){const x=rnd(-310,310),z=rnd(-175,175),s=rnd(1.5,2.6);if(!free(x,z,s))continue;bx(s,s,s,x,z,0x92400e,1,0,'wood');claim(x,z,s*.8);n++}
 for(let k=0,n=0;k<300&&n<24;k++){const x=rnd(-310,310),z=rnd(-175,175);if(!free(x,z,3))continue;const b=bx(5,1,.9,x,z,0x9ca3af,1,0,'conc');b.rotation.y=Math.random()*3;claim(x,z,2.8);n++}
 for(let i=0;i<140;i++){const j=i%HU.length,k=rnd(.84,.94),x=HU[j][0]*k,z=HU[j][1]*k;if(!free(x,z,1.6))continue;cyl(.25,5,x,z,0x8b5a2b);const l=new THREE.Mesh(new THREE.ConeGeometry(2.4,1.4,6),mat('grass',0x22c55e));l.position.set(x,5.4,z);scene.add(l);claim(x,z,1.6)}
}
// ---------- ÚJ NEVEZETESSÉGEK A KÜLSŐ GYŰRŰBEN ----------
function placeLM(tx,tz,r,spread,name){let p=findFree(tx,tz,r,spread||70,80);if(!p){for(let k=0;k<400&&!p;k++){const x=rnd(-300,300),z=rnd(-170,170);if(Math.hypot(x,z)>110&&free(x,z,r))p=[x,z]}}if(!p)return null;reserveC(p[0],p[1],r);return p}
const LMN=[];
function outerLandmarks(){const g=G;g.lmk=[];
 // 1) KÖZPÉNZ-HEGYSÉG: sziklás csúcsok hósipkával
 {const p=placeLM(245,-120,40,80);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'⛰️ HEGYSÉG'});if(p){const[cx,cz]=p;[[0,0,22,46],[-20,12,15,30],[19,9,16,34],[5,-19,13,24]].forEach(([dx,dz,r,h])=>{const x=cx+dx,z=cz+dz;const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,9),mat('rock@3,2',0x8a8178));m.position.set(x,h/2-.5,z);m.rotation.y=Math.random()*3;m.castShadow=m.receiveShadow=true;scene.add(m);
   const snow=new THREE.Mesh(new THREE.ConeGeometry(r*.32,h*.32,9),new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.6}));snow.position.set(x,h-h*.16-.4,z);snow.rotation.y=m.rotation.y;scene.add(snow);g.col.push({x,z,r:r*.82,h})});
  sgn('⛰️ KÖZPÉNZ-HEGYSÉG',cx,52,cz,6)}}
 // 2) CSÓNAKÁZÓ-TÓ stéggel és csónakokkal
 {const p=placeLM(-235,-60,38,70);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'🚣 TÓ'});if(p){const[cx,cz]=p;const sand=new THREE.Mesh(new THREE.CircleGeometry(36,40),mat('sand@6,6',0xe9d8a6));sand.rotation.x=-Math.PI/2;sand.position.set(cx,.03,cz);scene.add(sand);
  const w=new THREE.Mesh(new THREE.CircleGeometry(31,40),mat('water',0x1d8fb8));w.rotation.x=-Math.PI/2;w.position.set(cx,.09,cz);scene.add(w);
  for(let i=0;i<9;i++)bx(2.4,.3,2,cx+31+i*-2.3,cz,0x8b5a2b,0,.25,'wood');[[-1,0],[1,0]].forEach(([s])=>{for(let i=0;i<4;i++)cyl(.15,1.2,cx+30-i*5,cz+s*1.2,0x5b3a1e)});
  for(let i=0;i<4;i++){const a=i/4*6.28+.4,x=cx+Math.cos(a)*15,z=cz+Math.sin(a)*15;const b=new THREE.Mesh(new THREE.BoxGeometry(3.6,.6,1.4),mat('wood',[0xef4444,0xfacc15,0x22c55e,0x3b82f6][i]));b.position.set(x,.45,z);b.rotation.y=a;scene.add(b)}
  sgn('🚣 CSÓNAKÁZÓ-TÓ',cx,10,cz,4.5)}}
 // 3) REPÜLŐTÉR: kifutópálya, hangárok, irányítótorony, magángép
 {const p=placeLM(150,150,54,60);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'✈️ REPTÉR'});if(p){const[cx,cz]=p;bx(100,.08,16,cx,cz,0x2b2f36,0,0,'asphalt');for(let i=0;i<10;i++)bx(5,.04,.6,cx-45+i*10,cz,0xffffff,0,.12,'gen');
  [-40,-20].forEach(dx=>{bx(16,8,12,cx+dx,cz-22,0x94a3b8,1,0,'metal');bx(12,6,.3,cx+dx,cz-15.9,0x111827,0,0,'gen')});
  cyl(1.6,18,cx+30,cz-20,0xe5e7eb,1);bx(6,3,6,cx+30,cz-20,0x1e3a5f,0,18,'glass');
  const pl=new THREE.Group();const fm=new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.3,metalness:.3});const fus=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.2,18,16),fm);fus.rotation.z=Math.PI/2;fus.position.y=3;
  const nose=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,12),fm);nose.position.set(9,3,0);nose.scale.set(1.6,1,1);const wing=new THREE.Mesh(new THREE.BoxGeometry(4,.3,22),fm);wing.position.set(0,2.6,0);
  const tail=new THREE.Mesh(new THREE.BoxGeometry(3,4,.3),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.8,roughness:.2}));tail.position.set(-8,5.5,0);const stab=new THREE.Mesh(new THREE.BoxGeometry(2.4,.25,7),fm);stab.position.set(-8.4,3.6,0);
  const stripe=new THREE.Mesh(new THREE.CylinderGeometry(1.42,1.22,18.02,16,1,true),new THREE.MeshStandardMaterial({color:0x1d4ed8}));stripe.rotation.z=Math.PI/2;stripe.position.y=2.6;stripe.scale.set(1,1,.25);
  pl.add(fus,nose,wing,tail,stab,stripe);pl.position.set(cx+10,0,cz+20);pl.rotation.y=-.3;pl.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(pl);g.col.push({x:cx+10,z:cz+20,r:6,h:5});
  sgn('✈️ KÖZPÉNZ REPTÉR',cx,14,cz-8,5)}}
 // 4) VÁRROM tornyokkal
 {const p=placeLM(-200,120,30,60);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'🏰 VÁRROM'});if(p){const[cx,cz]=p;const S=20;const WL=S*2-7.2,HW=(S-3.6-2.5);[[0,-S,WL,1.6],[0,S,WL,1.6],[-S,0,1.6,WL],[S,0,1.6,WL]].forEach(([dx,dz,w,d],i)=>{if(i===1){bx(HW,7,d,cx-2.5-HW/2,cz+dz,0x9a948c,1,0,'stone');bx(HW,7,d,cx+2.5+HW/2,cz+dz,0x9a948c,1,0,'stone')}else bx(w,7,d,cx+dx,cz+dz,0x9a948c,1,0,'stone')});
  [[-S,-S],[S,-S],[-S,S],[S,S]].forEach(([dx,dz])=>{cyl(3.2,11,cx+dx,cz+dz,0x8a847c,1);const r=new THREE.Mesh(new THREE.ConeGeometry(3.8,4,10),mat('roof@2,1',0x7f1d1d));r.position.set(cx+dx,13,cz+dz);scene.add(r)});
  sgn('🏰 ÁLLAMI VÁRROM',cx,16,cz,4.5);pk(cx,cz,'chest');g.pk[g.pk.length-1].l=99999}}
 // 5) SZŐLŐHEGY sorokkal
 {const p=placeLM(-60,-160,26,60);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'🍇 SZŐLŐHEGY'});if(p){const[cx,cz]=p;for(let row=0;row<7;row++){const z=cz-15+row*5;for(let i=0;i<9;i++){const x=cx-18+i*4.5;cyl(.08,1.8,x,z,0x5b3a1e);const v=new THREE.Mesh(new THREE.BoxGeometry(3.6,1,1),mat('grass@1,.3',0x3f7d2a));v.position.set(x+2.25,1.3,z);scene.add(v)}}
  cyl(1.4,1.8,cx+22,cz,0x7c4a26,1);sgn('🍇 SZŐLŐHEGY',cx,7,cz-18,4)}}
 // 6) NAPELEMPARK
 {const p=placeLM(70,-165,28,60);if(p)(G.lmk=G.lmk||[]).push({x:p[0],z:p[1],name:'☀️ NAPELEMPARK'});if(p){const[cx,cz]=p;const pm=new THREE.MeshStandardMaterial({color:0x1e3a8a,roughness:.15,metalness:.6,emissive:0x0a1a3a,emissiveIntensity:.4});
  for(let r=0;r<5;r++)for(let i=0;i<6;i++){const x=cx-20+i*8,z=cz-14+r*7;cyl(.1,1.6,x,z,0x9ca3af);const pn=new THREE.Mesh(new THREE.BoxGeometry(6.5,.12,3.2),pm);pn.position.set(x,1.8,z);pn.rotation.x=-.45;scene.add(pn)}
  sgn('☀️ NAPELEMPARK (KÖZPÉNZBŐL)',cx,8,cz-16,4)}}
}

window.buildHun=function(ar){G.kio=[];G.cities=[];hunLandmarks(ar);OCC.length=0;reserveLandmarks();try{bubiBuild();farmBuild()}catch(e){console.error(e)}bigMap2()};
window.mapFree=free;
// a csőszájfék mindig a (fegyverenként eltérő hosszú) cső végén legyen
WP('update',null,()=>{const g=G;if(!g||!g.gun||!g.gun.userData.brake)return;const bl=g.gun.children[1]?g.gun.children[1].scale.y:1.1;g.gun.userData.brake.position.z=-.9-bl/2-.02});
// kidolgozott fegyvermodell + saját (nem közös) anyagok, hogy a fegyverváltás ne színezze át a pálya fém tárgyait
WP('launch',null,()=>{const g=G;if(!g||!g.gun)return;const gun=g.gun;gun.children.forEach(c=>{if(c.material)c.material=c.material.clone()});
 const metal=window.texMat?texMat('metal',.6,.6,0x2a2d33).clone():new THREE.MeshStandardMaterial({color:0x2a2d33,metalness:.8,roughness:.35});metal.metalness=.6;metal.roughness=.35;
 const wood=window.texMat?texMat('darkwood',.5,.5,0x7a4a26).clone():new THREE.MeshStandardMaterial({color:0x7a4a26,roughness:.6});
 const rub=new THREE.MeshStandardMaterial({color:0x151515,roughness:.9}),glass=new THREE.MeshStandardMaterial({color:0x3b82f6,roughness:.05,metalness:.9,emissive:0x0b2a5a,emissiveIntensity:.5});
 const P=(geo,m,x,y,z,rx)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;o.castShadow=false;gun.add(o);return o};
 P(new THREE.BoxGeometry(.2,.32,.55),wood,0,-.06,.62);                         // tus
 P(new THREE.BoxGeometry(.14,.34,.16),rub,0,-.3,.2,-.25);                      // markolat
 P(new THREE.BoxGeometry(.13,.36,.22),metal,0,-.32,-.12,.18);                  // tár
 P(new THREE.CylinderGeometry(.07,.07,.5,12),metal,0,.23,-.05,Math.PI/2);      // távcső
 P(new THREE.CylinderGeometry(.08,.08,.04,12),glass,0,.23,-.31,Math.PI/2);    // távcsőlencse
 P(new THREE.BoxGeometry(.06,.04,.9),metal,0,.15,-.2);                         // sín
 const brake=P(new THREE.CylinderGeometry(.06,.05,.14,10),metal,0,0,-1.5,Math.PI/2);gun.userData.brake=brake;       // csőszájfék
 P(new THREE.BoxGeometry(.16,.12,.5),wood,0,-.12,-.55);                         // előagy
});
// az égbolt-gömb ne lógjon túl a kamera látótávolságán (különben kettévágott kupola látszik)
WP('launch',null,()=>{if(!scene)return;scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius>=1000){o.scale.setScalar(.72);o.renderOrder=-1}});if(cam){cam.far=1200;cam.updateProjectionMatrix()}});
// a játékot megállító régi „rendkívüli ülés” kérdések kikapcsolva
window.incident=function(){};

// ---------- KAMPÁNYBUSZ: egyenesen átrepül a sziget felett, aztán elszáll ----------
function busModel(){const g=new THREE.Group();const paint=new THREE.MeshStandardMaterial({color:0x1d4ed8,roughness:.3,metalness:.4}),white=new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.3,metalness:.2}),
  glass=new THREE.MeshStandardMaterial({color:0x0f2235,roughness:.05,metalness:.9}),dark=new THREE.MeshStandardMaterial({color:0x111827,roughness:.5,metalness:.4}),gold=new THREE.MeshStandardMaterial({color:0xfacc15,metalness:.9,roughness:.2});
 const B=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;g.add(b);return b};
 const dc=document.createElement('canvas');dc.width=1024;dc.height=256;const x=dc.getContext('2d');x.fillStyle='#1d4ed8';x.fillRect(0,0,1024,256);x.fillStyle='#facc15';x.fillRect(0,180,1024,22);x.fillStyle='#fff';x.font='bold 96px Luckiest Guy, Impact, Arial Black';x.textAlign='center';x.textBaseline='middle';x.fillText('KAMPÁNYBUSZ',512,105);x.font='bold 34px Arial';x.fillText('★ KÖZPÉNZ ROYALE ★ UGRÁS: SPACE',512,226);
 const side=new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(dc),roughness:.35,metalness:.3});
 const body=new THREE.Mesh(new THREE.BoxGeometry(10,2.6,3),[paint,paint,white,dark,side,side]);body.position.y=1.6;body.castShadow=true;g.add(body);
 B(10,.9,3.05,0,3.1,0,white);for(let i=0;i<7;i++){[1.53,-1.53].forEach(z=>B(1.1,.7,.04,-4+i*1.35,3.1,z,glass))}B(.06,1.3,2.6,5.02,2.6,0,glass);
 B(10.2,.25,3.2,0,4.1,0,paint);[[3.5,1],[3.5,-1],[-3.5,1],[-3.5,-1]].forEach(([wx,wz])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.4,18),dark);w.rotation.x=Math.PI/2;w.position.set(wx,.35,wz*1.5);g.add(w)});
 const hl=new THREE.MeshBasicMaterial({color:0xfff6d6});[.9,-.9].forEach(z=>B(.06,.35,.5,5.04,1.4,z,hl));
 // oldalsó turbinák a repüléshez
 const fans=[];[[-2.5,2.6],[2.5,2.6],[-2.5,-2.6],[2.5,-2.6]].forEach(([fx,fz])=>{const arm=B(.25,.2,1.4,fx,3.2,fz*.75,dark);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.12,8,24),gold);ring.rotation.x=Math.PI/2;ring.position.set(fx,3.3,fz);g.add(ring);const rot=new THREE.Group();rot.position.set(fx,3.3,fz);[0,1,2].forEach(i=>{const bl=new THREE.Mesh(new THREE.BoxGeometry(1.9,.05,.3),dark);bl.rotation.y=i*Math.PI/3;rot.add(bl)});g.add(rot);fans.push(rot)});
 const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1),new THREE.MeshStandardMaterial({color:0xef4444,side:THREE.DoubleSide}));flag.position.set(-4.6,5.2,0);g.add(flag);B(.06,1.4,.06,-4.6,4.8,-.8,dark);
 g.userData.fans=fans;g.userData.flag=flag;return g}
WP('launch',null,()=>{const g=G;if(!g||!g.car)return;while(g.car.children.length)g.car.remove(g.car.children[0]);const bus=busModel();g.car.add(bus);
 const a=Math.random()*Math.PI*2,L=760;g.bus={sx:-Math.cos(a)*L/2,sz:-Math.sin(a)*L/2*.6,ex:Math.cos(a)*L/2,ez:Math.sin(a)*L/2*.6,ang:a,model:bus};
 const lb=spr('🚌 KAMPÁNYBUSZ · SPACE = UGRÁS',2.4,'x');lb.position.y=6.4;g.car.add(lb)});
// körbenézés a buszból: egérmozgatás (zárolt egérrel) vagy nyomva tartott gombbal húzás
WP('launch',null,()=>{const g=G;if(g&&g.bus){g.ang=Math.atan2(g.bus.ez-g.bus.sz,g.bus.ex-g.bus.sx);g.pit=0}});
addEventListener('mousemove',e=>{const g=G;if(!g||!run||g.phase!=='drop'||document.pointerLockElement||!(e.buttons&1))return;g.ang+=e.movementX*.006*(window.SET?SET.sens:1);g.pit=Math.max(-.6,Math.min(.6,(g.pit||0)-e.movementY*.004))});
window.busPos=function(g){const b=g.bus;if(!b){return false}const T=48,k=Math.min(1.25,g.t/T);const x=b.sx+(b.ex-b.sx)*k,z=b.sz+(b.ez-b.sz)*k;g.car.position.set(x,52+Math.sin(g.t*1.3)*.6,z);g.car.rotation.y=-Math.atan2(b.ez-b.sz,b.ex-b.sx);
 b.model.userData.fans.forEach((f,i)=>f.rotation.y=g.t*(i%2?18:-18));b.model.userData.flag.rotation.y=Math.sin(g.t*6)*.3;
 // automatikus kiugrás, mielőtt a busz elhagyná a szigetet
 const nk=Math.min(1.25,k+.03),nx=b.sx+(b.ex-b.sx)*nk,nz=b.sz+(b.ez-b.sz)*nk;if(g.phase==='drop'&&k>.3&&(k>=1||(hin(x,z)&&!hin(nx,nz))))land();
 g.car.visible=k<1.2;return true};

})();
