// extra130b.js – VILÁG & PÁLYA: kilátópontok, évszakos pálya, busz-ütközet, portyázás (raktárak), villámlás+szivárvány,
// vadállatok, lobby-évszakok, 10 rejtett easter-egg, körvonat, prémium égbolt. Prefix: x13b
(()=>{
const RN=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train','sotet'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x13b pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x13b '+n+': '+e)}return r}};
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const money=n=>{try{S.c+=n;save()}catch(e){}};
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const hH=(x,z)=>window.hillH?hillH(x,z):0;
const onMap=(x,z)=>G.arh?hin(x,z):Math.hypot(x,z)<58;
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7},o||{}));
let OBJ=[];const add=m=>{scene.add(m);OBJ.push(m);return m};
let seed=1;const SR=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
function lbl(t,col){const c=document.createElement('canvas');c.width=320;c.height=64;const x=c.getContext('2d');const gr=x.createLinearGradient(0,0,320,0);gr.addColorStop(0,'rgba(15,23,42,.9)');gr.addColorStop(1,'rgba(30,41,59,.9)');x.fillStyle=gr;x.fillRect(0,0,320,64);x.strokeStyle=col||'#fde047';x.lineWidth=3;x.strokeRect(2,2,316,60);x.fillStyle=col||'#fde047';x.font='bold 26px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,160,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(5,1,1);return s}
function landPt(minD,rng){rng=rng||Math.random;for(let i=0;i<200;i++){const x=G.arh?(rng()*560-280):(rng()*100-50),z=G.arh?(rng()*320-160):(rng()*68-38);if(onMap(x,z)&&hH(x,z)<.5&&(!minD||Math.hypot(x-G.x,z-G.z)>minD))return[x,z]}return[RN(-30,30),RN(-20,20)]}

// ---------- CSS + HUD ----------
const css=document.createElement('style');css.textContent=`
#x13bHud{position:fixed;left:50%;bottom:150px;transform:translateX(-50%);z-index:60;pointer-events:none;font:700 14px system-ui;color:#f8fafc;text-align:center;display:none}
#x13bHud .x13bBar{width:260px;height:12px;border-radius:8px;background:rgba(15,23,42,.75);border:1px solid rgba(253,224,71,.6);overflow:hidden;margin-top:6px;box-shadow:0 0 18px rgba(253,224,71,.25)}
#x13bHud .x13bBar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f59e0b,#fde047)}
#x13bFlash{position:fixed;inset:0;background:#e0f2fe;opacity:0;pointer-events:none;z-index:55;transition:opacity .08s}
#x13bPano{position:fixed;inset:0;pointer-events:none;z-index:56;display:none;box-shadow:inset 0 0 0 9vh #000;}
#x13bPano b{position:absolute;left:0;right:0;bottom:12vh;text-align:center;font:800 28px system-ui;color:#fde68a;letter-spacing:4px;text-shadow:0 2px 12px #000}
#x13bEggBtn{position:fixed;right:14px;bottom:86px;z-index:40;padding:8px 13px;border-radius:12px;border:1px solid rgba(253,224,71,.5);background:linear-gradient(135deg,rgba(30,27,75,.92),rgba(15,23,42,.92));color:#fde68a;font:700 13px system-ui;cursor:pointer;display:none;box-shadow:0 4px 18px rgba(0,0,0,.4)}
#x13bEggBtn:hover{filter:brightness(1.2)}
.x13bEggs{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:14px 0}
.x13bEggs div{padding:12px 6px;border-radius:12px;background:rgba(15,23,42,.7);border:1px solid #334155;text-align:center;font:600 12px system-ui;color:#94a3b8}
.x13bEggs div.ok{border-color:#fbbf24;color:#fde68a;background:linear-gradient(160deg,rgba(120,53,15,.5),rgba(15,23,42,.8))}
.x13bEggs div span{display:block;font-size:28px;margin-bottom:4px}`;document.head.appendChild(css);
const hud=document.createElement('div');hud.id='x13bHud';hud.innerHTML='<div id="x13bHudT"></div><div class="x13bBar"><i id="x13bHudB"></i></div>';
const flash=document.createElement('div');flash.id='x13bFlash';
const pano=document.createElement('div');pano.id='x13bPano';pano.innerHTML='<b>🔭 KILÁTÓPONT</b>';
const eggBtn=document.createElement('button');eggBtn.id='x13bEggBtn';eggBtn.textContent='🥚 Rejtett tárgyak';
addEventListener('DOMContentLoaded',()=>{});
function mountUI(){if(!document.body)return setTimeout(mountUI,200);[hud,flash,pano,eggBtn].forEach(e=>document.body.appendChild(e))}mountUI();
const hudShow=(t,p)=>{hud.style.display='block';document.getElementById('x13bHudT').textContent=t;document.getElementById('x13bHudB').style.width=Math.round(p*100)+'%'};
const hudHide=()=>{hud.style.display='none'};

// ---------- ÉVSZAK + NAPSZAK ----------
function season(){const o=localStorage.getItem('k3x13bSeason');if(['tel','tavasz','nyar','osz'].includes(o))return o;const m=new Date().getMonth()+1;return m===12||m<=2?'tel':m<=5?'tavasz':m<=8?'nyar':'osz'}
const SNAME={tel:'❄️ Tél',tavasz:'🌸 Tavasz',nyar:'☀️ Nyár',osz:'🍂 Ősz'};
function hourNow(){const o=parseFloat(localStorage.getItem('k3x13bHour'));if(!isNaN(o))return o;const d=new Date();return d.getHours()+d.getMinutes()/60}

// ---------- részecske-segéd (Points) ----------
function flakeTex(kind){const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');
 if(kind==='snow'||kind==='rain'){const g=x.createRadialGradient(16,16,0,16,16,15);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;if(kind==='rain'){x.fillStyle='rgba(186,230,253,.9)';x.fillRect(15,2,2,28)}else x.fillRect(0,0,32,32)}
 else if(kind==='leaf'){x.fillStyle='#ea580c';x.beginPath();x.ellipse(16,16,13,7,.6,0,7);x.fill();x.strokeStyle='#7c2d12';x.beginPath();x.moveTo(6,24);x.lineTo(26,8);x.stroke()}
 else{x.fillStyle='#f9a8d4';for(let i=0;i<5;i++){x.beginPath();x.ellipse(16+Math.cos(i*1.256)*7,16+Math.sin(i*1.256)*7,6,4,i*1.256,0,7);x.fill()}x.fillStyle='#fde047';x.beginPath();x.arc(16,16,3,0,7);x.fill()}
 return new THREE.CanvasTexture(c)}
function mkPts(n,kind,size,col,spread,hgt){const geo=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){p[i*3]=RN(-spread,spread);p[i*3+1]=RN(0,hgt);p[i*3+2]=RN(-spread,spread)}geo.setAttribute('position',new THREE.BufferAttribute(p,3));
 const m=new THREE.Points(geo,new THREE.PointsMaterial({size,map:flakeTex(kind),transparent:true,depthWrite:false,color:col||0xffffff,fog:true}));m.frustumCulled=false;m.userData={spread,hgt,kind};return m}
function stepPts(m,dt,cx,cz,fall,wind){const a=m.geometry.attributes.position,p=a.array,S2=m.userData.spread,H=m.userData.hgt,t=performance.now()/1000;for(let i=0;i<p.length;i+=3){p[i+1]-=fall*dt*(.7+(i%7)*.06);p[i]+=(wind+Math.sin(t+i)*.6)*dt;p[i+2]+=Math.cos(t*.7+i)*.4*dt;if(p[i+1]<0){p[i+1]=H;p[i]=RN(-S2,S2);p[i+2]=RN(-S2,S2)}if(p[i]>S2)p[i]-=2*S2;if(p[i]<-S2)p[i]+=2*S2}a.needsUpdate=true;m.position.set(cx,0,cz)}

// ---------- ÁLLAPOT ----------
let X=null;window._x13b=()=>X;
const EGG_DEF=[['🦆','Gumikacsa'],['🎺','Elveszett trombita'],['🧦','Fél pár zokni'],['🪀','Jojó'],['🗝️','Rozsdás kulcs'],['📼','VHS kazetta'],['🧸','Plüssmedve'],['🍄','Arany gomba'],['🛸','Mini ufó'],['🎩','Bűvészkalap']];
const eggsGot=()=>LS('k3x13bEggs',[]);

function cleanup(){OBJ.forEach(o=>{try{scene.remove(o)}catch(e){}});OBJ=[];if(X&&X.mats)X.mats.forEach(([m,c])=>{try{m.color.copy(c)}catch(e){}});X=null;hudHide();pano.style.display='none';flash.style.opacity=0}

// 2. évszakos pálya: zöld anyagok színezése
function applySeason(se){const mats=[],seen=new Set();const tint={osz:[[0xd97706,.55],[0xb91c1c,.25],[0xeab308,.2]],tel:[[0xe2e8f0,.7]],tavasz:[[0x86efac,.35],[0xf9a8d4,.12]],nyar:[[0x65a30d,.15]]}[se];
 scene.traverse(o=>{if(!o.isMesh||!o.material)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!m.color||seen.has(m)||m.isMeshBasicMaterial)return;seen.add(m);const c=m.color;if(c.g>c.r*1.12&&c.g>c.b*1.12&&c.g>.12){mats.push([m,c.clone()]);const tc=pick(tint);const k=tc[1]+(se==='tel'?0:Math.random()*.25);c.lerp(new THREE.Color(tc[0]),Math.min(.9,k))}})});
 return mats}

// 10. prémium égbolt
function skyColors(h){// [zenit, horizont, nap-erő, éjszaka 0..1]
 const K=[[0,'#030617','#0b1230',0,1],[5,'#050a24','#1e1b4b',0,1],[6,'#1e3a8a','#fb923c',.4,.4],[7.5,'#3b82f6','#fde68a',.8,0],[12,'#1d64c8','#bfe3ff',1,0],[17,'#2563eb','#fde68a',.85,0],[19,'#4c1d95','#f97316',.45,.2],[20.5,'#0f0a3a','#7c2d12',.1,.75],[22,'#040820','#111a3a',0,1],[24,'#030617','#0b1230',0,1]];
 let i=0;while(i<K.length-2&&K[i+1][0]<=h)i++;const a=K[i],b=K[i+1],t=Math.max(0,Math.min(1,(h-a[0])/(b[0]-a[0]||1)));
 const ca=new THREE.Color(a[1]).lerp(new THREE.Color(b[1]),t),cb=new THREE.Color(a[2]).lerp(new THREE.Color(b[2]),t);return[ca,cb,a[3]+(b[3]-a[3])*t,a[4]+(b[4]-a[4])*t]}
function buildSky(){const h=hourNow(),[zc,hc,sun,night]=skyColors(h);
 const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{zc:{value:zc},hc:{value:hc},sd:{value:new THREE.Vector3()},sp:{value:sun}},
  vertexShader:'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform vec3 zc;uniform vec3 hc;uniform vec3 sd;uniform float sp;varying vec3 vP;void main(){float y=max(vP.y,0.);vec3 c=mix(hc,zc,pow(y,.55));if(vP.y<0.)c=hc*.8;float s=max(dot(vP,normalize(sd)),0.);c+=vec3(1.,.8,.5)*(pow(s,600.)*3.+pow(s,8.)*.35)*sp;gl_FragColor=vec4(c,1.);}'});
 const sky=new THREE.Mesh(new THREE.SphereGeometry(1000,32,16),mat);sky.renderOrder=-10;add(sky);
 // nap iránya a napszak szerint
 const ang=(h-6)/12*Math.PI;mat.uniforms.sd.value.set(Math.cos(ang),Math.max(-.3,Math.sin(ang)),.35);
 // csillagok
 let stars=null;if(night>.05){const n=900,geo=new THREE.BufferGeometry(),p=new Float32Array(n*3);for(let i=0;i<n;i++){const th=Math.random()*6.283,ph=Math.acos(Math.random()*.95);p[i*3]=Math.sin(ph)*Math.cos(th)*950;p[i*3+1]=Math.cos(ph)*950;p[i*3+2]=Math.sin(ph)*Math.sin(th)*950}geo.setAttribute('position',new THREE.BufferAttribute(p,3));stars=new THREE.Points(geo,new THREE.PointsMaterial({size:2.2,sizeAttenuation:false,color:0xffffff,transparent:true,opacity:night,fog:false,depthWrite:false}));add(stars)}
 // felhők: egy InstancedMesh síkokkal
 const cc=document.createElement('canvas');cc.width=256;cc.height=128;const x=cc.getContext('2d');for(let i=0;i<14;i++){const g=x.createRadialGradient(40+i*13,64+RN(-18,18),0,40+i*13,64,RN(28,46));g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,256,128)}
 const cm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cc),transparent:true,depthWrite:false,fog:false,side:THREE.DoubleSide,color:new THREE.Color(1,1,1).lerp(hc,.35).multiplyScalar(night>.6?.25:1)});
 const N=26,cl=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,.5),cm,N),d=new THREE.Object3D();for(let i=0;i<N;i++){const a=Math.random()*6.283,r=RN(380,800);d.position.set(Math.cos(a)*r,RN(140,260),Math.sin(a)*r);d.lookAt(0,0,0);d.scale.setScalar(RN(160,300));d.updateMatrix();cl.setMatrixAt(i,d.matrix)}cl.frustumCulled=false;add(cl);
 try{if(scene.fog&&G.arh)scene.fog.color.copy(hc).lerp(new THREE.Color(scene.fog.color),.5)}catch(e){}
 return{mat,stars,cl,night}}

// 9. vonat
function buildTrain(){const RX=235,RZ=118,pts=[];for(let i=0;i<240;i++){const a=i/240*6.283;pts.push([Math.cos(a)*RX,Math.sin(a)*RZ])}
 const sl=new THREE.InstancedMesh(new THREE.BoxGeometry(.5,.2,3.2),STD(0x5b3a1e),240),rl=new THREE.InstancedMesh(new THREE.BoxGeometry(1,.18,.14),STD(0x9ca3af,{metalness:.8,roughness:.3}),480),d=new THREE.Object3D();
 pts.forEach(([x,z],i)=>{const a=i/240*6.283,tx=-Math.sin(a)*RX,tz=Math.cos(a)*RZ,yaw=Math.atan2(tx,tz),y=hH(x,z)+.1;d.position.set(x,y,z);d.rotation.set(0,yaw+Math.PI/2,0);d.scale.set(1,1,1);d.updateMatrix();sl.setMatrixAt(i,d.matrix);const L=Math.hypot(tx,tz)*6.283/240;[-1,1].forEach((s,k)=>{d.position.set(x+Math.cos(yaw)*s*1.1,y+.18,z-Math.sin(yaw)*s*1.1);d.rotation.set(0,yaw,0);d.scale.set(1,1,L*1.05);d.rotation.y=yaw;d.updateMatrix();rl.setMatrixAt(i*2+k,d.matrix)})});
 // a sín a szigeten kívül is látszik (híd) – egyszerű
 add(sl);add(rl);
 const cars=[];const cols=[0xb91c1c,0x1e3a8a,0x1e3a8a,0x1e3a8a];cols.forEach((c,i)=>{const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(2.8,2.4,7),STD(c,{metalness:.3,roughness:.45}));body.position.y=1.7;body.castShadow=true;g.add(body);const roof=new THREE.Mesh(new THREE.BoxGeometry(3,.25,7.2),STD(0x1f2937));roof.position.y=3.0;g.add(roof);const win=new THREE.Mesh(new THREE.BoxGeometry(2.9,.6,5.6),new THREE.MeshBasicMaterial({color:0xfde68a}));win.position.y=2.1;g.add(win);if(i===0){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.35,.45,1.2,8),STD(0x111827));ch.position.set(0,3.6,2.4);g.add(ch);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),new THREE.MeshBasicMaterial({color:0xfffbeb}));lamp.position.set(0,1.6,3.55);g.add(lamp)}add(g);cars.push(g)});
 const tag=lbl('🚂 Körvonat – ugorj fel!','#fca5a5');tag.position.y=5;cars[0].add(tag);
 return{RX,RZ,a:0,cars,top:3.15,prev:null}}
function trainPos(T,a){return[Math.cos(a)*T.RX,Math.sin(a)*T.RZ]}
function onTrain(T,x,z,y){for(const c of T.cars){const dx=x-c.position.x,dz=z-c.position.z,yaw=c.rotation.y,lx=dx*Math.cos(yaw)-dz*Math.sin(yaw),lz=dx*Math.sin(yaw)+dz*Math.cos(yaw);if(Math.abs(lx)<1.6&&Math.abs(lz)<3.7)return c}return null}

// 6. vadállatok
function mkAnimal(kind){const g=new THREE.Group(),deer=kind==='deer',col=deer?0x9a5b2e:0x3f2f24,m=STD(col,{roughness:.9});
 const body=new THREE.Mesh(new THREE.BoxGeometry(deer?.9:1,deer?.9:.85,deer?1.9:1.5),m);body.position.y=deer?1.35:.75;body.castShadow=true;g.add(body);
 const head=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.7),m);head.position.set(0,deer?2.05:.85,deer?1.15:.95);g.add(head);
 const legs=[];[[-.3,.7],[.3,.7],[-.3,-.7],[.3,-.7]].forEach(([x,z])=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.18,deer?.95:.45,.18),STD(0x2b1d14));l.position.set(x,deer?.47:.22,z*(deer?1:.75));g.add(l);legs.push(l)});
 if(deer){const am=STD(0xe7d7b7);[-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.CylinderGeometry(.04,.06,.7,5),am);a.position.set(s*.2,2.55,1.05);a.rotation.z=s*.5;g.add(a);const b=a.clone();b.position.set(s*.38,2.75,1.0);b.rotation.z=s*1.1;g.add(b)})}
 else{const tk=STD(0xf5f5f4);[-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.ConeGeometry(.05,.25,5),tk);t.position.set(s*.18,.75,1.32);t.rotation.x=-1.2;g.add(t)})}
 return{g,legs,kind,hp:deer?60:110,x:0,z:0,dir:Math.random()*6.283,t:0,flee:0,dead:0}}

// ---------- MECCS INDULÁS ----------
function setup(){cleanup();if(!normal())return;const g=G;seed=(g.arh?7331:4242)+(new Date().getDate());
 X={se:season(),t:0,pts:[],vaults:[],animals:[],eggs:[],lightT:RN(40,80),storm:0,rainbow:null,hold:0,holdV:null,pano:0,shake:0,mats:[]};
 X.mats=applySeason(X.se);
 X.sky=buildSky();
 // évszakos részecskék a játékos körül
 if(X.se==='tel'){X.fx=mkPts(700,'snow',.35,0xffffff,40,30);add(X.fx);X.fxFall=3}
 else if(X.se==='osz'){X.fx=mkPts(160,'leaf',.55,0xffffff,35,22);add(X.fx);X.fxFall=1.4}
 else if(X.se==='tavasz'){X.fx=mkPts(140,'petal',.45,0xffffff,35,20);add(X.fx);X.fxFall=.9}
 X.rain=mkPts(900,'rain',.5,0xbfdbfe,40,35);X.rain.visible=false;add(X.rain);
 sayX(SNAME[X.se]+' van a pályán!');
 // 1. kilátópontok – a legmagasabb pontok
 const cand=[];for(let i=0;i<500;i++){const x=g.arh?SR()*560-280:SR()*100-50,z=g.arh?SR()*320-160:SR()*68-38;if(onMap(x,z))cand.push([x,z,hH(x,z)])}cand.sort((a,b)=>b[2]-a[2]);
 const vp=[];for(const c of cand){if(vp.length>=(g.arh?4:2))break;if(vp.every(v=>Math.hypot(v[0]-c[0],v[1]-c[1])>60))vp.push(c)}
 vp.forEach(([x,z,h],i)=>{const grp=new THREE.Group();const post=new THREE.Mesh(new THREE.CylinderGeometry(.12,.15,3,8),STD(0x78350f));post.position.y=1.5;grp.add(post);const tel=new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,1,10),STD(0xd4af37,{metalness:.9,roughness:.25}));tel.rotation.x=1.2;tel.position.set(0,3.1,.2);grp.add(tel);const ring=new THREE.Mesh(new THREE.RingGeometry(2.2,2.6,40),new THREE.MeshBasicMaterial({color:0xfde047,transparent:true,opacity:.55,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.08;grp.add(ring);const s=lbl('🔭 Kilátópont – E','#fde047');s.position.y=4.6;grp.add(s);grp.position.set(x,h,z);add(grp);X.pts.push({x,z,h,grp,ring,used:0})});
 // 4. raktárak
 for(let i=0;i<(g.arh?6:3);i++){const [x,z]=landPt(25,SR),y=hH(x,z);const grp=new THREE.Group();const w=new THREE.Mesh(new THREE.BoxGeometry(6,4,5),STD(0x64748b,{metalness:.4,roughness:.5}));w.position.y=2;w.castShadow=true;grp.add(w);const roof=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,6,12,1,false,0,Math.PI),STD(0x334155,{metalness:.5}));roof.rotation.z=Math.PI/2;roof.rotation.y=Math.PI/2;roof.position.y=4;grp.add(roof);const door=new THREE.Mesh(new THREE.BoxGeometry(3,3,.15),STD(0xb45309));door.position.set(0,1.5,2.56);grp.add(door);const lock=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.25),STD(0xfacc15,{metalness:.9,roughness:.2}));lock.position.set(0,1.6,2.7);grp.add(lock);const s=lbl('🔒 Raktár – tartsd E','#fbbf24');s.position.y=6.4;grp.add(s);grp.position.set(x,y,z);grp.rotation.y=SR()*6.28;add(grp);const fx=x+Math.sin(grp.rotation.y)*3.3,fz=z+Math.cos(grp.rotation.y)*3.3;X.vaults.push({x:fx,z:fz,cx:x,cz:z,grp,door,lock,s,open:0});try{g.col&&g.col.push&&0}catch(e){}}
 // 6. vadállatok
 for(let i=0;i<(g.arh?10:4);i++){const a=mkAnimal(i%3===0?'boar':'deer');const [x,z]=landPt(20);a.x=x;a.z=z;a.g.position.set(x,hH(x,z),z);add(a.g);X.animals.push(a)}
 // 8. easter egg-ek (determinisztikus helyek pályánként)
 seed=g.arh?99173:5521;const got=eggsGot();EGG_DEF.forEach((e,i)=>{const [x,z]=landPt(0,SR);if(got.includes(i))return;const s=lbl(e[0],'#fde68a');const c=document.createElement('canvas');c.width=c.height=64;const cx=c.getContext('2d');cx.font='48px serif';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(e[0],32,36);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true}));sp.scale.set(.9,.9,1);sp.position.set(x,hH(x,z)+.7,z);add(sp);X.eggs.push({i,x,z,sp})});
 // 9. vonat – csak a nagy pályán
 if(g.arh)X.train=buildTrain();
}
WP('launch',null,()=>{try{setup()}catch(e){console.error('x13b setup',e)}});
WP('end',()=>{cleanup()});

// 3. busz-ütközet kiugráskor
WP('land',a=>{if(!X||!normal()||G.phase!=='drop')return;X._land=1},()=>{if(!X||!X._land)return;X._land=0;const g=G,ang=RN(0,6.283),f=RN(9,15);g.vx=(g.vx||0)+Math.cos(ang)*f;g.vz=(g.vz||0)+Math.sin(ang)*f;X.shake=.9;X.spin=RN(-2.5,2.5);
 sayX(pick(['💥 Lökdösődés a busz ajtajában!','💥 Valaki meglökött kiugráskor!','💥 Tülekedés a buszon – repülsz!']));try{sfx('hit')}catch(e){}
 try{(g.en||[]).forEach(e=>{if(Math.hypot(e.x-g.x,e.z-g.z)<25){const a=Math.atan2(e.z-g.z,e.x-g.x);e.x+=Math.cos(a)*RN(3,8);e.z+=Math.sin(a)*RN(3,8)}})}catch(e){}
 const st=new THREE.Group();for(let i=0;i<10;i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.25),new THREE.MeshBasicMaterial({color:pick([0xfde047,0xf97316,0xffffff])}));m.userData.v=new THREE.Vector3(RN(-6,6),RN(-2,6),RN(-6,6));st.add(m)}st.position.set(g.x,g.y,g.z);add(st);X.burst={o:st,t:1.2}});

// ---------- E interakció ----------
let eDown=false;
addEventListener('keydown',e=>{if(typing(e))return;if(e.key.toLowerCase()==='e')eDown=true;
 if(e.key==='Escape'&&X&&X.pano>0){X.pano=0}});
addEventListener('keyup',e=>{if(e.key.toLowerCase()==='e')eDown=false});
function nearE(){if(!X||!normal()||G.phase!=='play')return false;const g=G;
 for(const p of X.pts){if(!p.used&&Math.hypot(p.x-g.x,p.z-g.z)<4){p.used=1;X.pano=6;X.panoP=p;pano.style.display='block';const r=g.arh?650:300;money(r);sayX('🔭 Panoráma! +'+ft(r));p.ring.material.color.set(0x64748b);return true}}
 for(const v of X.vaults){if(!v.open&&Math.hypot(v.x-g.x,v.z-g.z)<3.2){X.holdV=v;X.hold=0;return true}}
 for(const k of X.eggs){if(!k.got&&Math.hypot(k.x-g.x,k.z-g.z)<2.5){k.got=1;scene.remove(k.sp);const got=eggsGot();if(!got.includes(k.i)){got.push(k.i);SV('k3x13bEggs',got)}money(300);sayX('🥚 Rejtett tárgy: '+EGG_DEF[k.i][0]+' '+EGG_DEF[k.i][1]+' ('+got.length+'/10) +300 Ft');if(got.length===10){money(10000);sayX('🏆 Mind a 10 rejtett tárgy megvan! +10 000 Ft')}try{sfx('buy')}catch(e){}return true}}
 for(const a of X.animals){if(a.dead===1&&Math.hypot(a.x-g.x,a.z-g.z)<3){a.dead=2;scene.remove(a.g);const r=a.kind==='deer'?900:1400;money(r);try{g.hp=Math.min(g.mhp,g.hp+25)}catch(e){}sayX((a.kind==='deer'?'🦌 Szarvas':'🐗 Vaddisznó')+' zsákmány: +'+ft(r)+' és +25 HP');return true}}
 if(X.train){const c=X.train.cars;for(const car of c){if(Math.hypot(car.position.x-g.x,car.position.z-g.z)<6&&g.y<2){g.y=hH(car.position.x,car.position.z)+X.train.top+.2;g.x=car.position.x;g.z=car.position.z;g.vy=0;sayX('🚂 Felpattantál a vonatra!');return true}}}
 return false}
{const o=window.x20near;window.x20near=function(){try{if(nearE())return true}catch(e){console.error('x13b near',e)}return o?o():false}}

// vonat tetején állás: floorH
{const of=window.floorH;if(typeof of==='function')window.floorH=function(o){const h=of.apply(this,arguments);try{if(X&&X.train&&o===G){const c=onTrain(X.train,o.x,o.z);if(c){const t=c.position.y+X.train.top;if(o.y>=t-1.2)return Math.max(h,t)}}}catch(e){}return h}}

// ---------- villám-hang ----------
let ac=null;function thunder(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();const n=ac.sampleRate*2.2,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=(l+(Math.random()*2-1)*.08)/1.02;d[i]=l*Math.pow(1-i/n,1.6)*4}const s=ac.createBufferSource();s.buffer=b;const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=420;const g=ac.createGain();g.gain.value=.5*(window.SET&&SET.vol!=null?SET.vol:1);s.connect(f).connect(g).connect(ac.destination);s.start()}catch(e){}}
function rainbow(){const c=document.createElement('canvas');c.width=8;c.height=128;const x=c.getContext('2d');const cols=['#ef4444','#f97316','#facc15','#22c55e','#3b82f6','#6366f1','#a855f7'];x.clearRect(0,0,8,128);cols.forEach((k,i)=>{x.fillStyle=k;x.fillRect(0,20+i*12,8,12)});
 const m=new THREE.Mesh(new THREE.TorusGeometry(260,26,6,48,Math.PI),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:0,depthWrite:false,fog:false,side:THREE.DoubleSide}));
 // csíkozás a cső mentén: uv.y használata (torus v = cső körül) – elég jó
 m.position.set(G.x+Math.cos(G.ang||0)*420,-40,G.z+Math.sin(G.ang||0)*420);m.lookAt(G.x,-40,G.z);add(m);return{m,t:28}}

// ---------- FRISSÍTÉS ----------
WP('update',null,a=>{if(!X)return;if(!inMatch()){return}const dt=Math.min(.1,a[0]||.016),g=G;X.t+=dt;
 // részecskék
 if(X.fx)stepPts(X.fx,dt,g.x,g.z,X.fxFall,X.se==='osz'?1.2:.4);
 // 5. időjárás
 X.lightT-=dt;if(X.storm<=0&&X.lightT<=0){X.storm=RN(30,45);sayX('⛈️ Vihar közeleg!');X.rain.visible=true;X.flT=2}
 if(X.storm>0){X.storm-=dt;stepPts(X.rain,dt,g.x,g.z,32,2);X.flT-=dt;if(X.flT<=0){X.flT=RN(4,9);flash.style.opacity=.75;setTimeout(()=>flash.style.opacity=.15,90);setTimeout(()=>flash.style.opacity=.6,170);setTimeout(()=>flash.style.opacity=0,300);try{if(window.HEMI){const i0=HEMI.intensity;HEMI.intensity=i0*2.4;setTimeout(()=>HEMI.intensity=i0,220)}}catch(e){}setTimeout(thunder,RN(200,900));
   if(Math.random()<.35){const ax=g.x+RN(-25,25),az=g.z+RN(-25,25);const bolt=new THREE.Mesh(new THREE.CylinderGeometry(.15,.4,80,5),new THREE.MeshBasicMaterial({color:0xe0f2fe}));bolt.position.set(ax,40+hH(ax,az),az);add(bolt);setTimeout(()=>{scene.remove(bolt)},180);if(Math.hypot(ax-g.x,az-g.z)<4){try{hurt(15)}catch(e){}sayX('⚡ Belédcsapott a villám!')}}}
  if(X.storm<=0){X.rain.visible=false;X.lightT=RN(90,150);X.rainbow=rainbow();sayX('🌈 Szivárvány az eső után!')}}
 if(X.rainbow){const r=X.rainbow;r.t-=dt;r.m.material.opacity=Math.min(.55,Math.min(28-r.t,r.t)*.12);if(r.t<=0){scene.remove(r.m);X.rainbow=null}}
 // 1. kilátópontok gyűrű-pulzus + panoráma
 X.pts.forEach(p=>{if(!p.used)p.ring.scale.setScalar(1+Math.sin(X.t*3)*.08)});
 if(X.pano>0){X.pano-=dt;const p=X.panoP,an=X.t*.35,R=g.arh?120:45;cam.position.set(p.x+Math.cos(an)*R,p.h+(g.arh?70:28),p.z+Math.sin(an)*R);cam.lookAt(p.x-Math.cos(an)*R*.5,p.h,p.z-Math.sin(an)*R*.5);if(X.pano<=0)pano.style.display='none'}
 // 4. raktár nyitás
 if(X.holdV){const v=X.holdV;if(!eDown||Math.hypot(v.x-g.x,v.z-g.z)>3.4){X.holdV=null;hudHide()}else{X.hold+=dt;hudShow('🔓 Feltörés… ('+Math.ceil(2.5-X.hold)+' mp)',X.hold/2.5);if(X.hold>=2.5){v.open=1;X.holdV=null;hudHide();v.lock.visible=false;v.door.position.y=3.6;v.door.scale.y=.3;v.s.visible=false;const r=Math.round(RN(800,2400)/50)*50;money(r);try{g.hp=Math.min(g.mhp,g.hp+20);g.sh=Math.min(g.msh,(g.sh||0)+25)}catch(e){}try{if(window.BR&&Math.random()<.3){BR.zs=(BR.zs||0)+1;sayX('🪙 +1 zseton')}}catch(e){}sayX('📦 Raktár kifosztva: +'+ft(r)+', +20 HP, +25 pajzs');try{sfx('buy')}catch(e){}}}}
 // 6. állatok
 X.animals.forEach(an=>{if(an.dead)return;an.t+=dt;const d=Math.hypot(an.x-g.x,an.z-g.z);if(d<9&&!an.flee)an.flee=3;let sp=1.2;if(an.flee>0){an.flee-=dt;an.dir=Math.atan2(an.z-g.z,an.x-g.x)+Math.sin(an.t)*.3;sp=an.kind==='deer'?8:6}else if(Math.random()<dt*.3)an.dir+=RN(-1.5,1.5);
  const nx=an.x+Math.cos(an.dir)*sp*dt,nz=an.z+Math.sin(an.dir)*sp*dt;if(onMap(nx,nz)&&hH(nx,nz)<3){an.x=nx;an.z=nz}else an.dir+=Math.PI*.7;
  an.g.position.set(an.x,hH(an.x,an.z),an.z);an.g.rotation.y=-an.dir+Math.PI/2;an.legs.forEach((l,i)=>l.rotation.x=Math.sin(an.t*sp*2+(i%2)*Math.PI)*.5);
  // lövedék-találat
  (g.bl||[]).forEach(b=>{if(b.l>0&&Math.abs(b.x-an.x)<1.2&&Math.abs(b.z-an.z)<1.2&&b.y<2.6){b.l=0;an.hp-=b.d||20;an.flee=4;try{ftx(an.x,an.z,'-'+Math.round(b.d||20),'')}catch(e){}if(an.hp<=0){an.dead=1;an.g.rotation.z=Math.PI/2;an.g.position.y+=.4;const s=lbl('🍖 Zsákmány – E','#fca5a5');s.position.y=2;an.g.add(s);sayX((an.kind==='deer'?'🦌':'🐗')+' Elejtve! Menj oda, E = zsákmány')}}})});
 // 8. tojások forgása
 X.eggs.forEach(k=>{if(!k.got)k.sp.position.y=hH(k.x,k.z)+.7+Math.sin(X.t*2+k.i)*.15});
 // 9. vonat
 if(X.train){const T=X.train,da=dt*.045;T.a+=da;T.cars.forEach((c,i)=>{const a=T.a-i*.034,[x,z]=trainPos(T,a),[x2,z2]=trainPos(T,a+.01);c.position.set(x,hH(x,z),z);c.rotation.y=Math.atan2(x2-x,z2-z)});
  const c=onTrain(T,g.x,g.z);if(c&&g.y>=c.position.y+T.top-.3){if(!T.prev||T.prev.c!==c){T.prev={c,x:c.position.x,z:c.position.z}}else{g.x+=c.position.x-T.prev.x;g.z+=c.position.z-T.prev.z;T.prev.x=c.position.x;T.prev.z=c.position.z}if(!T.on){T.on=1;sayX('🚂 A vonaton utazol!')}}else{T.prev=null;T.on=0}}
 // 3. kiugrási effekt
 if(X.shake>0){X.shake-=dt;cam.position.x+=RN(-.4,.4)*X.shake;cam.position.y+=RN(-.4,.4)*X.shake}
 if(X.burst){const b=X.burst;b.t-=dt;b.o.position.set(g.x,g.y+1,g.z);b.o.children.forEach(m=>{m.position.addScaledVector(m.userData.v,dt);m.rotation.x+=dt*5});if(b.t<=0){scene.remove(b.o);X.burst=null}}
 // égbolt kövesse a kamerát
 if(X.sky){X.sky.mat.uniforms&&0;OBJ[0]&&0}
 // E-tipp
 if(!X.holdV&&X.t%0.5<dt){let tip='';for(const v of X.vaults)if(!v.open&&Math.hypot(v.x-g.x,v.z-g.z)<3.2)tip='🔒 Tartsd lenyomva az E-t a feltöréshez';if(tip)hudShow(tip,0);else if(hud.style.display==='block')hudHide()}
});

// ---------- 8. gyűjtőlista ----------
function eggUI(){const got=eggsGot();const h='<h1 class="f" style="font-size:30px">🥚 REJTETT TÁRGYAK</h1><div style="color:#cbd5e1">A pályákon 10 különleges tárgy rejtőzik. Menj oda és nyomj E-t! ('+got.length+'/10)</div><div class="x13bEggs">'+EGG_DEF.map((e,i)=>got.includes(i)?'<div class="ok"><span>'+e[0]+'</span>'+e[1]+'</div>':'<div><span>❔</span>???</div>').join('')+'</div><div style="color:#fde68a;margin-bottom:10px">Mind a 10 = +10 000 Ft · Évszak most: '+SNAME[season()]+'</div><button class="bb" onclick="guiClose()">Bezár</button>';try{guiOpen(h)}catch(e){alert(got.length+'/10')}}
window.x13bEggUI=eggUI;eggBtn.onclick=eggUI;

// ---------- 7. lobby-évszakok ----------
let LBX=null,lastT=0;
function lobbyLoop(t){requestAnimationFrame(lobbyLoop);const L=window.LB3D,lb=document.getElementById('lb');const vis=lb&&lb.classList.contains('on')&&!(typeof run!=='undefined'&&run);eggBtn.style.display=vis?'block':'none';
 if(!L||!L.sc)return;if(!LBX||LBX.sc!==L.sc){const se=season(),kind=se==='tel'?'snow':se==='osz'?'leaf':se==='tavasz'?'petal':'petal';const p=mkPts(se==='tel'?500:se==='nyar'?40:160,kind,se==='tel'?.12:.2,se==='nyar'?0xfde68a:0xffffff,8,7);L.sc.add(p);LBX={sc:L.sc,p,se}}
 const dt=Math.min(.05,(t-lastT)/1000||.016);lastT=t;if(!vis)return;const c=L.cam;stepPts(LBX.p,dt,c?c.position.x*.0:0,0,LBX.se==='tel'?1:LBX.se==='nyar'?.15:.5,LBX.se==='osz'?.5:.15)}
requestAnimationFrame(lobbyLoop);

// debug
window._x13bDbg={storm:()=>{if(X)X.lightT=0},season:s=>{localStorage.setItem('k3x13bSeason',s)},hour:h=>localStorage.setItem('k3x13bHour',h),resetEggs:()=>SV('k3x13bEggs',[])};
})();
