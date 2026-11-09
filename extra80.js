// ===== EXTRA80: kidolgozottabb pálya – városi terek (macskakő), lámpák, padok, bokrok, virágok, autók, kukák, sziklák, fűcsomók (fotótextúrával, InstancedMesh) =====
(function(){
const RN=(a,b)=>a+Math.random()*(b-a);
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x80 '+n+': '+e)}return r}};
const TM=(k,rx,ry,c)=>{try{if(typeof texMat==='function')return texMat(k,rx,ry,c)}catch(e){}return new THREE.MeshStandardMaterial({color:c||0x888888})};
let OBJ=[];const dummy=new THREE.Object3D();
function inst(geo,mat,list,shadow){if(!list.length)return;const im=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((t,i)=>{dummy.position.set(t[0],t[1],t[2]);dummy.rotation.set(t[4]||0,t[3]||0,0);const s=t[5]||1;dummy.scale.set(s*(t[6]||1),s*(t[7]||1),s*(t[8]||1));dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix)});im.instanceMatrix.needsUpdate=true;im.castShadow=!!shadow;im.receiveShadow=true;scene.add(im);OBJ.push(im);return im}
function free(x,z,r){if(!(G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<52))return false;for(const c of(G.col||[])){const cr=c.hw?Math.max(c.hw,c.hd):(c.r||1);if(Math.abs(c.x-x)<cr+r+2&&Math.abs(c.z-z)<cr+r+2&&Math.hypot(c.x-x,c.z-z)<cr+r+.5)return false}return true}
function build(){OBJ.forEach(o=>{if(o.parent)o.parent.remove(o)});OBJ=[];if(typeof G==='undefined'||!G||!G.arh||G.stw||G.fk)return;
 const cities=G.cities||[];const L={pole:[],bulb:[],bench:[],benchLeg:[],bush:[],flower:[],flowerBed:[],car:[],carTop:[],wheel:[],bin:[],rock:[],tuft:[],plaza:[],planter:[]};const carCols=[0xdc2626,0x2563eb,0xf8fafc,0x111827,0x16a34a,0xf59e0b,0x7c3aed];const carList=[];
 cities.forEach(c=>{// macskaköves tér
  L.plaza.push([c.x,.035,c.z,0,-Math.PI/2,1]);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+RN(-.1,.1),r=RN(11,15),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,.4))continue;L.pole.push([x,2.2,z]);L.bulb.push([x,4.55,z])}
  for(let i=0;i<6;i++){const a=Math.random()*6.28,r=RN(7,12),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,1))continue;const ry=-a+Math.PI/2;L.bench.push([x,.5,z,ry]);L.benchLeg.push([x,.25,z,ry])}
  for(let i=0;i<14;i++){const a=Math.random()*6.28,r=RN(9,22),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,.8))continue;const s=RN(.7,1.4);L.bush.push([x,.55*s,z,Math.random()*3,0,s])}
  for(let i=0;i<4;i++){const a=Math.random()*6.28,r=RN(6,10),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,1.2))continue;L.flowerBed.push([x,.2,z]);L.planter.push([x,.15,z]);for(let k=0;k<7;k++)L.flower.push([x+RN(-.8,.8),.5,z+RN(-.8,.8),0,0,RN(.8,1.2)])}
  for(let i=0;i<5;i++){const a=Math.random()*6.28,r=RN(16,26),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,2.2))continue;const ry=Math.random()*6.28;carList.push([x,z,ry,carCols[Math.floor(Math.random()*carCols.length)]]);G.col.push({x,z,r:1.6,h:1.5})}
  for(let i=0;i<4;i++){const a=Math.random()*6.28,r=RN(5,13),x=c.x+Math.cos(a)*r,z=c.z+Math.sin(a)*r;if(!free(x,z,.4))continue;L.bin.push([x,.45,z])}});
 // sziklák és fűcsomók a szigeten szétszórva
 for(let i=0;i<260;i++){const x=RN(-420,420),z=RN(-420,420);if(!free(x,z,1.5))continue;const s=RN(.6,2.4);L.rock.push([x,s*.35,z,Math.random()*6,Math.random()*.5,s,1,.7,1.2]);if(s>1.6)G.col.push({x,z,r:s*.8,h:s*.7})}
 for(let i=0;i<900;i++){const x=RN(-430,430),z=RN(-430,430);if(!(typeof hin==='function'&&hin(x,z)))continue;L.tuft.push([x,.3,z,Math.random()*6,0,RN(.6,1.3)])}
 // geometriák + fotóanyagok
 const plazaM=TM('cobble',6,6,0xd6d3d1);inst(new THREE.CircleGeometry(10,28),plazaM,L.plaza);
 inst(new THREE.CylinderGeometry(.09,.13,4.4,8),TM('metal',1,2,0x374151),L.pole,true);
 inst(new THREE.SphereGeometry(.32,10,8),new THREE.MeshStandardMaterial({color:0xfff2c4,emissive:0xffd27a,emissiveIntensity:1.2}),L.bulb);
 inst(new THREE.BoxGeometry(2,.12,.6),TM('wood',1,.4,0xb07a4a),L.bench,true);inst(new THREE.BoxGeometry(1.8,.5,.12),TM('metal',1,1,0x1f2937),L.benchLeg);
 inst(new THREE.IcosahedronGeometry(.75,1),TM('grass',1,1,0x3f7d2a),L.bush,true);
 inst(new THREE.CylinderGeometry(1,1,.3,14),TM('brick',1,.3,0xa16207),L.planter,true);inst(new THREE.CylinderGeometry(.92,.92,.08,14),TM('sand',1,1,0x3b2a1a),L.flowerBed);
 const fl=[0xf472b6,0xfacc15,0xef4444,0xa78bfa,0xffffff];fl.forEach((c,ci)=>inst(new THREE.SphereGeometry(.13,6,5),new THREE.MeshStandardMaterial({color:c,roughness:.6}),L.flower.filter((_,i)=>i%fl.length===ci)));
 inst(new THREE.CylinderGeometry(.32,.28,.9,10),TM('metal',1,1,0x166534),L.bin,true);
 inst(new THREE.DodecahedronGeometry(1,0),TM('rock',1,1,0x9ca3af),L.rock,true);
 inst(new THREE.ConeGeometry(.18,.6,4),new THREE.MeshStandardMaterial({color:0x4d7c0f,roughness:1}),L.tuft);
 // autók
 const bodyG=new THREE.BoxGeometry(2,.75,4),topG=new THREE.BoxGeometry(1.7,.6,2),wG=new THREE.CylinderGeometry(.38,.38,.3,12);const glassM=new THREE.MeshStandardMaterial({color:0x1e293b,metalness:.6,roughness:.1});
 const byCol={};carList.forEach(cr=>{(byCol[cr[3]]=byCol[cr[3]]||[]).push(cr)});
 Object.entries(byCol).forEach(([c,list])=>{inst(bodyG,new THREE.MeshStandardMaterial({color:+c,metalness:.55,roughness:.3}),list.map(l=>[l[0],.75,l[1],l[2]]),true)});
 inst(topG,glassM,carList.map(l=>[l[0],1.4,l[1],l[2]]));
 const wl=[];carList.forEach(l=>{const cs=Math.cos(l[2]),sn=Math.sin(l[2]);[[-1,1.3],[1,1.3],[-1,-1.3],[1,-1.3]].forEach(([dx,dz])=>{wl.push([l[0]+dx*cs+dz*sn,.38,l[1]-dx*sn+dz*cs,l[2],0,1])})});
 const wm=new THREE.InstancedMesh(wG,TM('asphalt',.3,.3,0x111111),wl.length);wl.forEach((t,i)=>{dummy.position.set(t[0],t[1],t[2]);dummy.rotation.set(0,t[3],Math.PI/2);dummy.scale.set(1,1,1);dummy.updateMatrix();wm.setMatrixAt(i,dummy.matrix)});scene.add(wm);OBJ.push(wm);
 console.log('extra80: pálya-részletek',Object.fromEntries(Object.entries(L).map(([k,v])=>[k,v.length])),'autók',carList.length)}
WP('launch',null,()=>{setTimeout(()=>{try{build()}catch(e){console.error('x80 build',e)}},1500)});
})();
