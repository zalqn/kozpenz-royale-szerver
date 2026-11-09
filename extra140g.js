// extra140g.js – ✨ GRAFIKA & HANG (F10): izzás, por/lábnyom, víz-csillogás, becsapódás-nyomok, rázás-intenzitás,
// térbeli hang, talajfüggő lépés, dinamikus zene, menü-elmosás, előbeállítások. Mentés: k3x14g. Debug: _x14g
(function(){
'use strict';
const LS='k3x14g';
const DEF={halo:0,dust:1,water:1,decal:1,shake:2,spat:1,estep:0,gstep:1,music:1,blur:0,preset:'kozepes'};
let C=Object.assign({},DEF);try{Object.assign(C,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(C))}catch(e){}};
const X=window._x14g={C,fps:0,calls:0};
const ok=()=>typeof THREE!=='undefined'&&typeof scene!=='undefined'&&scene;
const inPlay=()=>typeof G!=='undefined'&&G&&(G.phase==='play'||G.phase==='drop');
const inLobby=()=>{const l=document.getElementById('lb');return !!(l&&l.classList.contains('on'))};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.warn('x14g',n,e)}return r}};
const actx=()=>typeof ac!=='undefined'&&ac&&typeof AX!=='undefined'&&AX.mg?ac:null;

// ---------- közös textúrák ----------
function radTex(inner,outer){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,inner);g.addColorStop(.35,'rgba(255,255,255,.35)');g.addColorStop(1,outer);x.fillStyle=g;x.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);return t}
let HT=null,DT=null,PT=null;
function texs(){if(HT)return;HT=radTex('rgba(255,255,255,1)','rgba(255,255,255,0)');
 const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,30);g.addColorStop(0,'rgba(10,10,12,.95)');g.addColorStop(.3,'rgba(25,22,20,.8)');g.addColorStop(.6,'rgba(40,36,32,.35)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
 x.strokeStyle='rgba(20,18,16,.6)';x.lineWidth=1.5;for(let i=0;i<7;i++){const a=i/7*6.283+.3;x.beginPath();x.moveTo(32+Math.cos(a)*8,32+Math.sin(a)*8);x.lineTo(32+Math.cos(a)*(18+i%3*5),32+Math.sin(a)*(18+i%3*5));x.stroke()}
 DT=new THREE.CanvasTexture(c);
 const p=document.createElement('canvas');p.width=p.height=32;const y=p.getContext('2d');const h=y.createRadialGradient(16,16,0,16,16,16);h.addColorStop(0,'rgba(210,195,170,.75)');h.addColorStop(1,'rgba(210,195,170,0)');y.fillStyle=h;y.fillRect(0,0,32,32);PT=new THREE.CanvasTexture(p)}

// ---------- 1. izzás (additív sprite halo a hamis fényekre) ----------
let halos=[];
function haloBuild(){haloClear();if(!C.halo||!ok())return;texs();const L=[];scene.traverse(o=>{if(o.isFakeLight&&L.length<70)L.push(o)});
 L.forEach(o=>{const b=o.children[0];const col=b&&b.material&&b.material.color?b.material.color:new THREE.Color(0xffffff);const m=new THREE.SpriteMaterial({map:HT,color:col,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:.55,fog:true});const s=new THREE.Sprite(m);const k=3.2+Math.min(3,(o.intensity||1)*1.3);s.scale.set(k,k,1);s.renderOrder=5;o.add(s);halos.push({s,o,k,ph:Math.random()*6})})}
function haloClear(){halos.forEach(h=>{h.o.remove(h.s);h.s.material.dispose()});halos=[]}

// ---------- 2. por/lábnyom ----------
const DU=[];let duI=0,duT=0,fpI=0;const FP=[];
function dustInit(){if(DU.length||!ok())return;texs();for(let i=0;i<18;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:PT,transparent:true,depthWrite:false,opacity:0}));s.visible=false;DU.push({s,l:0,vy:0})}
 const fg=new THREE.PlaneGeometry(.32,.55);fg.rotateX(-Math.PI/2);for(let i=0;i<16;i++){const m=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:0x1c1917,transparent:true,opacity:0,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-6}));m.visible=false;FP.push({m,l:0})}}
function dustAttach(){DU.forEach(d=>{if(d.s.parent!==scene)scene.add(d.s)});FP.forEach(f=>{if(f.m.parent!==scene)scene.add(f.m)})}
function dustTick(dt){const g=G;if(C.dust&&g.phase==='play'&&g.y<.15){const sp=Math.hypot(g.vx||0,g.vz||0);if(sp>4){duT-=dt*sp/8;if(duT<=0){duT=.17;const d=DU[duI++%DU.length];d.s.position.set(g.x+(Math.random()-.5)*.6,.25,g.z+(Math.random()-.5)*.6);d.l=1;d.vy=.6+Math.random()*.5;d.s.visible=true;
   if(groundAt(g.x,g.z)!=='water'){const f=FP[fpI++%FP.length],a=Math.atan2(g.vx,g.vz),sd=(fpI%2?.18:-.18);f.m.position.set(g.x+Math.cos(a)*sd,.03,g.z-Math.sin(a)*sd);f.m.rotation.y=a;f.l=1;f.m.visible=true}}}}
 for(const d of DU){if(d.l<=0)continue;d.l-=dt*1.4;d.s.position.y+=d.vy*dt;const k=.5+(1-d.l)*1.3;d.s.scale.set(k,k,1);d.s.material.opacity=Math.max(0,d.l)*.5;if(d.l<=0)d.s.visible=false}
 for(const f of FP){if(f.l<=0)continue;f.l-=dt*.22;f.m.material.opacity=Math.max(0,f.l)*.35;if(f.l<=0)f.m.visible=false}}

// ---------- 3. víz-csillogás ----------
let wT=0;function waterTick(dt){if(!C.water||typeof MC==='undefined')return;wT+=dt;for(const k in MC){if(k.indexOf('water')!==0)continue;const m=MC[k];if(m.map){m.map.offset.x=wT*.035;m.map.offset.y=Math.sin(wT*.6)*.04}if(m.emissive){if(m.userData.x14e==null)m.userData.x14e=m.emissiveIntensity||0;m.emissiveIntensity=m.userData.x14e+.12+Math.sin(wT*2.3)*.08}}}

// ---------- 4. becsapódás-nyomok ----------
const DC=[];let dcI=0,prevB=new Set();
function decalInit(){if(DC.length||!ok())return;texs();const geo=new THREE.PlaneGeometry(.55,.55);for(let i=0;i<40;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:DT,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}));m.visible=false;DC.push({m,l:0})}}
function placeDecal(b){if(!G.col)return;for(const c of G.col){if(!c.hw||b.y>c.h||(c.y0&&b.y<c.y0))continue;const dx=b.x-c.x,dz=b.z-c.z;if(Math.abs(dx)>c.hw+.6||Math.abs(dz)>c.hd+.6)continue;
  const px=(Math.abs(dx)-c.hw)/c.hw,pz=(Math.abs(dz)-c.hd)/c.hd;const d=DC[dcI++%DC.length];if(d.m.parent!==scene)scene.add(d.m);
  if(px>pz){d.m.position.set(c.x+Math.sign(dx)*(c.hw+.02),b.y,b.z);d.m.rotation.set(0,Math.sign(dx)*Math.PI/2,0)}else{d.m.position.set(b.x,b.y,c.z+Math.sign(dz)*(c.hd+.02));d.m.rotation.set(0,dz>0?0:Math.PI,0)}
  d.m.rotation.z=Math.random()*6.28;d.m.visible=true;d.l=1;d.m.material.opacity=.9;return}}
function decalTick(dt){if(!C.decal||!G.bl)return;const now=new Set(G.bl);for(const b of prevB){if(!now.has(b)&&b.l>0.05&&b.y>.2)placeDecal(b)}prevB=now;
 for(const d of DC){if(d.l<=0)continue;d.l-=dt/18;if(d.l<.3)d.m.material.opacity=d.l*3;if(d.l<=0)d.m.visible=false}}

// ---------- 5. rázás-intenzitás ----------
const SHK=[0,.5,1,1.6];let base=null,myShk=0,lastHp=null;
function camPatch(){if(typeof cam==='undefined'||!cam||cam.position._x14)return;const p=cam.position,o=p.set.bind(p);p.set=function(x,y,z){base={x,y,z};return o(x,y,z)};p._x14=1}
function shakeTick(dt){const k=SHK[C.shake]!=null?SHK[C.shake]:1,g=G;if(lastHp!=null&&g.hp<lastHp-.5)myShk=Math.min(.6,myShk+(lastHp-g.hp)*.015);lastHp=g.hp;
 if(base&&k!==1&&g.fp){const dx=cam.position.x-base.x,dy=cam.position.y-base.y;if(Math.abs(dx)<.6&&Math.abs(dy)<.6){cam.position.x=base.x+dx*Math.min(k,1);cam.position.y=base.y+dy*Math.min(k,1)}}
 if(k>0&&myShk>0&&!g.fp){myShk=Math.max(0,myShk-dt*1.8);const s=myShk*k*(k>1?1.4:1);cam.position.x+=(Math.random()-.5)*s;cam.position.y+=(Math.random()-.5)*s}else if(k>1&&myShk>0&&g.fp){myShk=Math.max(0,myShk-dt*1.8);cam.position.x+=(Math.random()-.5)*myShk*.4;cam.position.y+=(Math.random()-.5)*myShk*.4}
 base=null}

// ---------- 6. térbeli hang ----------
let nb=null;function noiseBuf(a){if(nb)return nb;if(AX.nb)return nb=AX.nb;const n=a.sampleRate;nb=a.createBuffer(1,n,n);const d=nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return nb}
let lisT=0;function listener(){const a=actx();if(!a||!cam)return;const L=a.listener,p=cam.position,f=new THREE.Vector3(0,0,-1).applyQuaternion(cam.quaternion);
 if(L.positionX){L.positionX.value=p.x;L.positionY.value=p.y;L.positionZ.value=p.z;L.forwardX.value=f.x;L.forwardY.value=f.y;L.forwardZ.value=f.z;L.upX.value=0;L.upY.value=1;L.upZ.value=0}else{L.setPosition(p.x,p.y,p.z);L.setOrientation(f.x,f.y,f.z,0,1,0)}}
let live=0;
function p3(x,y,z,kind,g){const a=actx();if(!a||live>10)return;const t=a.currentTime,pn=a.createPanner();pn.panningModel='HRTF';pn.distanceModel='inverse';pn.refDistance=4;pn.maxDistance=120;pn.rolloffFactor=1.2;
 if(pn.positionX){pn.positionX.value=x;pn.positionY.value=y;pn.positionZ.value=z}else pn.setPosition(x,y,z);pn.connect(AX.mg);live++;
 const s=a.createBufferSource();s.buffer=noiseBuf(a);const f=a.createBiquadFilter(),n=a.createGain();let d;
 if(kind==='shot'){d=.12;f.type='bandpass';f.frequency.setValueAtTime(2600,t);f.frequency.exponentialRampToValueAtTime(500,t+d);n.gain.setValueAtTime(.4*g,t);const o=a.createOscillator(),og=a.createGain();o.type='sawtooth';o.frequency.setValueAtTime(380,t);o.frequency.exponentialRampToValueAtTime(110,t+d);og.gain.setValueAtTime(.05*g,t);og.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(og);og.connect(pn);o.start(t);o.stop(t+d+.02)}
 else{d=.06;f.type='lowpass';f.frequency.setValueAtTime(600,t);f.frequency.exponentialRampToValueAtTime(150,t+d);n.gain.setValueAtTime(.12*g,t)}
 n.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(n);n.connect(pn);s.start(t,Math.random()*.5);s.stop(t+d+.02);s.onended=()=>{live--;try{pn.disconnect()}catch(e){}}}
X.p3=p3;
let eStepT=0;function eStepTick(dt){if(!C.estep||!G.en)return;eStepT-=dt;if(eStepT>0)return;eStepT=.2;let n=0;for(const e of G.en){if(!e||e.hp<=0||e.dead)continue;const dx=e.x-G.x,dz=e.z-G.z;if(dx*dx+dz*dz>400)continue;e._x14s=(e._x14s||0)+1;if(e._x14s%2)p3(e.x,.2,e.z,'step',.8);if(++n>=3)break}}

// ---------- 7. talajfüggő lépés ----------
const KIND={grass:'fu',grass2:'fu',water:'viz',cobble:'ko',conc:'ko',asphalt:'ko',tile:'ko',stone:'ko',brick:'ko',marble:'ko',wood:'fa',darkwood:'fa',sand:'homok'};
let flats=null,mapK=null;
function buildFlats(){flats=[];mapK=new Map();if(typeof MC!=='undefined')for(const k in MC){const m=MC[k];if(m&&m.map)mapK.set(m.map,k.split('|')[0].split('@')[0])}
 if(!ok())return;scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.material&&o.material.map&&!o.isInstancedMesh){const p=o.geometry.parameters;if(p&&p.height!=null&&p.height<.35&&p.width>1.5){flats.push({x:o.position.x,z:o.position.z,hw:p.width/2*(o.scale.x||1),hd:(p.depth||0)/2*(o.scale.z||1),y:o.position.y,k:mapK.get(o.material.map)||''})}}})}
function groundAt(x,z){if(!flats)return'fu';let best=null;for(const f of flats){if(Math.abs(x-f.x)<f.hw&&Math.abs(z-f.z)<f.hd&&(!best||f.y>best.y))best=f}
 if(best)return KIND[best.k.replace(/_.*/,'')]||'ko';if(typeof HU!=='undefined'&&Array.isArray(HU)&&HU.length>2&&typeof G!=='undefined'&&G.big){let c=false;for(let i=0,j=HU.length-1;i<HU.length;j=i++){const a=HU[i],b=HU[j],ax=a.x!=null?a.x:a[0],az=a.z!=null?a.z:a[1],bx_=b.x!=null?b.x:b[0],bz=b.z!=null?b.z:b[1];if((az>z)!==(bz>z)&&x<(bx_-ax)*(z-az)/(bz-az)+ax)c=!c}if(!c)return'viz'}return'fu'}
X.groundAt=groundAt;
function gStep(v){const a=actx();if(!a)return false;const k=groundAt(G.x,G.z),t=a.currentTime,s=a.createBufferSource();s.buffer=noiseBuf(a);const f=a.createBiquadFilter(),n=a.createGain();let d=.06,g=.11+(v%2)*.03;
 if(k==='fu'){f.type='bandpass';f.frequency.value=2200+(v%3)*300;f.Q.value=.7;d=.09;g*=.8}else if(k==='viz'){f.type='bandpass';f.frequency.setValueAtTime(900,t);f.frequency.exponentialRampToValueAtTime(2400,t+.12);f.Q.value=3;d=.16;g*=1.2}else if(k==='fa'){f.type='lowpass';f.frequency.value=900;const o=a.createOscillator(),og=a.createGain();o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(90,t+.07);og.gain.setValueAtTime(.08,t);og.gain.exponentialRampToValueAtTime(.0001,t+.08);o.connect(og);og.connect(AX.mg);o.start(t);o.stop(t+.1)}else if(k==='homok'){f.type='lowpass';f.frequency.value=1400;d=.1;g*=.7}else{f.type='highpass';f.frequency.value=1800+(v%3)*200;d=.04;g*=1.1}
 n.gain.setValueAtTime(g,t);n.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f);f.connect(n);n.connect(AX.mg);s.start(t,Math.random()*.5);s.stop(t+d+.02);return true}
if(typeof window.sfx==='function'){const os=window.sfx;window.sfx=function(n,v){if(n==='step'&&C.gstep&&typeof G!=='undefined'&&G){try{if(aInit()&&gStep(v||0))return}catch(e){}}return os.apply(this,arguments)}}

// ---------- 8. dinamikus zene ----------
let heat=0,mBase=null,mMood=null,beatT=0,beatN=0;
function bump(v){heat=Math.min(1,heat+v)}
function musicTick(dt){if(typeof ABPM==='undefined'||typeof AX==='undefined')return;heat=Math.max(0,heat-dt*.12);const md=AX.mood;
 if(mMood!==md){if(mMood&&mBase!=null&&ABPM[mMood]===X._set)ABPM[mMood]=mBase;mMood=md;mBase=ABPM[md]}
 if(ABPM[md]!==X._set)mBase=ABPM[md];
 if(!C.music||!AX.on){if(X._set!=null&&ABPM[md]===X._set){ABPM[md]=mBase;X._set=null}return}
 const want=Math.round(mBase*(1+.2*heat));ABPM[md]=want;X._set=want;
 const a=actx();if(!a||heat<.45||!AX.mus)return;beatT-=dt;if(beatT>0)return;beatT=60/want/2;beatN++;const t=a.currentTime+.02;
 const o=a.createOscillator(),n=a.createGain();o.type='sawtooth';o.frequency.setValueAtTime(beatN%4===0?55:41.2,t);const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=300+heat*500;n.gain.setValueAtTime(.12*heat,t);n.gain.exponentialRampToValueAtTime(.0001,t+beatT*.9);o.connect(f);f.connect(n);n.connect(AX.mus);o.start(t);o.stop(t+beatT);
 if(heat>.75&&beatN%2){const s=a.createBufferSource();s.buffer=noiseBuf(a);const hf=a.createBiquadFilter(),hg=a.createGain();hf.type='highpass';hf.frequency.value=8000;hg.gain.setValueAtTime(.06,t);hg.gain.exponentialRampToValueAtTime(.0001,t+.04);s.connect(hf);hf.connect(hg);hg.connect(AX.mus);s.start(t);s.stop(t+.06)}}
X.heat=()=>heat;X.bump=bump;

// ---------- 9. menü-elmosás ----------
const st=document.createElement('style');st.textContent=`
.x14gblur{backdrop-filter:blur(6px) saturate(1.15);-webkit-backdrop-filter:blur(6px) saturate(1.15)}
#x14gbtn{padding:8px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:linear-gradient(135deg,rgba(30,27,75,.85),rgba(76,29,149,.85));color:#f5f3ff;font:700 12px system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.35);letter-spacing:.5px}
#x14gbtn:hover{filter:brightness(1.2)}
#x14gp{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:rgba(5,6,15,.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:system-ui,sans-serif}
#x14gp .bx{width:min(520px,94vw);max-height:90vh;overflow:auto;background:linear-gradient(160deg,#151335,#0b0b1e);border:1px solid rgba(167,139,250,.35);border-radius:18px;padding:18px 20px;color:#e9e7ff;box-shadow:0 20px 60px rgba(0,0,0,.6)}
#x14gp h2{margin:0 0 4px;font-size:20px;background:linear-gradient(90deg,#c4b5fd,#f0abfc);-webkit-background-clip:text;color:transparent}
#x14gp .sub{font-size:12px;opacity:.65;margin-bottom:12px}
#x14gp .pr{display:flex;gap:6px;margin-bottom:12px}#x14gp .pr button{flex:1;padding:8px 4px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff;font-weight:700;cursor:pointer}
#x14gp .pr button.on{background:linear-gradient(135deg,#7c3aed,#db2777);border-color:transparent}
#x14gp .row{display:flex;align-items:center;justify-content:space-between;padding:7px 4px;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
#x14gp .row small{display:block;opacity:.55;font-size:11px}
#x14gp .tg{width:42px;height:22px;border-radius:11px;background:#3f3f5a;position:relative;cursor:pointer;flex:none}#x14gp .tg.on{background:#8b5cf6}#x14gp .tg:after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.15s}#x14gp .tg.on:after{left:23px}
#x14gp select{background:#1f1d45;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:3px 6px}
#x14gp .ft{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;opacity:.8}
#x14gp .cl{padding:7px 16px;border-radius:10px;border:0;background:#8b5cf6;color:#fff;font-weight:700;cursor:pointer}`;
document.head.appendChild(st);
let blurT=0;const blurred=new Set();
function blurTick(){if(!C.blur){if(blurred.size){blurred.forEach(e=>e.classList.remove('x14gblur'));blurred.clear()}return}
 for(const e of document.body.children){if(e.id==='x14gp'||e.tagName==='CANVAS'||e.tagName==='SCRIPT')continue;if(e.offsetWidth<innerWidth*.7||e.offsetHeight<innerHeight*.7){if(blurred.has(e)){e.classList.remove('x14gblur');blurred.delete(e)}continue}
  const cs=getComputedStyle(e);if(cs.position!=='fixed'&&cs.position!=='absolute')continue;const bg=cs.backgroundColor;const m=bg.match(/rgba\([^)]*,\s*([\d.]+)\)/);const want=!inPlay()||!!(typeof GUI!=='undefined'&&GUI.on);
  if(m&&+m[1]>0.05&&+m[1]<.95&&want&&e.id!=='lb'){if(!blurred.has(e)){e.classList.add('x14gblur');blurred.add(e)}}else if(blurred.has(e)){e.classList.remove('x14gblur');blurred.delete(e)}}}

// ---------- 10. előbeállítások ----------
const PRE={
 alacsony:{halo:0,dust:0,water:0,decal:0,spat:0,estep:0,gstep:1,music:0,blur:0,shake:1,pr:.75},
 kozepes:{halo:0,dust:1,water:1,decal:1,spat:1,estep:0,gstep:1,music:1,blur:0,shake:2,pr:1},
 magas:{halo:1,dust:1,water:1,decal:1,spat:1,estep:1,gstep:1,music:1,blur:0,shake:2,pr:1},
 ultra:{halo:1,dust:1,water:1,decal:1,spat:1,estep:1,gstep:1,music:1,blur:1,shake:2,pr:1.5}};
const PN={alacsony:'Alacsony',kozepes:'Közepes',magas:'Magas',ultra:'Ultra'};
function applyPreset(n){const p=PRE[n];if(!p)return;Object.keys(p).forEach(k=>{if(k!=='pr')C[k]=p[k]});C.preset=n;
 if(typeof ren!=='undefined'&&ren){try{ren.setPixelRatio(Math.min(p.pr,devicePixelRatio||1))}catch(e){}try{if(typeof rs==='function')rs()}catch(e){}}
 save();refresh();if(inPlay())haloBuild();else haloClear()}
X.preset=applyPreset;

// ---------- panel ----------
const ROWS=[['halo','🌟 Izzás fényforrásokon','additív halo – közepes költség'],['dust','👣 Por és lábnyom futáskor','olcsó, 34 elem pool'],['water','🌊 Víz-csillogás','textúra-eltolás, szinte ingyenes'],['decal','🎯 Becsapódás-nyomok','max. 40 matrica'],['spat','🔊 Térbeli hang (ellenséges lövés)','PannerNode HRTF'],['estep','🦶 Ellenfelek lépései (3D)','extra hangcsomópontok'],['gstep','🌱 Talajfüggő lépéshang','fű / kő / víz / fa / homok'],['music','🎵 Dinamikus harci zene','harcban gyorsul + basszus'],['blur','🌫️ Menü-elmosás','CSS backdrop, GPU-igényes']];
let P=null;
function panel(){if(P)return P;P=document.createElement('div');P.id='x14gp';P.innerHTML=`<div class="bx"><h2>✨ GRAFIKA & HANG</h2><div class="sub">Egy kattintásos előbeállítás vagy egyenkénti kapcsolók · F10</div>
 <div class="pr">${Object.keys(PN).map(k=>`<button data-p="${k}">${PN[k]}</button>`).join('')}</div>
 ${ROWS.map(r=>`<div class="row"><div>${r[1]}<small>${r[2]}</small></div><div class="tg" data-k="${r[0]}"></div></div>`).join('')}
 <div class="row"><div>📳 Képernyőrázás<small>lövés / sebződés / robbanás</small></div><select id="x14gsh"><option value="0">Ki</option><option value="1">Enyhe</option><option value="2">Normál</option><option value="3">Erős</option></select></div>
 <div class="ft"><span id="x14gfps">FPS: –</span><button class="cl">Bezár</button></div></div>`;
 document.body.appendChild(P);
 P.addEventListener('click',e=>{const t=e.target;if(t===P||t.classList.contains('cl')){P.style.display='none';return}if(t.dataset.p)applyPreset(t.dataset.p);if(t.dataset.k){C[t.dataset.k]=C[t.dataset.k]?0:1;C.preset='egyeni';save();refresh();if(t.dataset.k==='halo'){C.halo&&inPlay()?haloBuild():haloClear()}}});
 P.querySelector('#x14gsh').onchange=e=>{C.shake=+e.target.value;save()};refresh();return P}
function refresh(){if(!P)return;P.querySelectorAll('.tg').forEach(t=>t.classList.toggle('on',!!C[t.dataset.k]));P.querySelectorAll('.pr button').forEach(b=>b.classList.toggle('on',b.dataset.p===C.preset));P.querySelector('#x14gsh').value=C.shake}
function toggle(){const p=panel();p.style.display=p.style.display==='flex'?'none':'flex';refresh()}
X.open=toggle;
addEventListener('keydown',e=>{if(e.key==='F10'){e.preventDefault();toggle()}},true);
function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!document.getElementById('x14gbtn')){const b=document.createElement('button');b.id='x14gbtn';b.textContent='✨ GRAFIKA';b.title='Grafika & hang (F10)';b.onclick=toggle;h.appendChild(b)}}
setInterval(()=>{hub();const b=document.getElementById('x14gbtn');if(b)b.style.display=inPlay()?'none':'';if(++blurT%2===0)blurTick()},500);

// ---------- horgok ----------
WP('eFire',null,a=>{const e=a[0];if(!e||typeof G==='undefined')return;const dx=e.x-G.x,dz=e.z-G.z,d2=dx*dx+dz*dz;if(d2<3600)bump(.06);if(C.spat&&d2<10000)p3(e.x,1.5,e.z,'shot',1)});
WP('sht',()=>G.bl.length,(a,s0)=>{if(G.bl.length>s0)bump(.04)});
WP('hurt',null,()=>bump(.12));
WP('boom',null,()=>{myShk=Math.min(.8,myShk+.35);bump(.15)});
WP('launch',null,()=>{flats=null;prevB=new Set();lastHp=null;myShk=0;heat=0;haloClear();DU.length=0;FP.length=0;DC.length=0;setTimeout(()=>{try{buildFlats();if(C.halo)haloBuild();dustInit();decalInit();dustAttach()}catch(e){console.warn('x14g',e)}},1500)});
let fT=0,fN=0;
WP('update',()=>{camPatch()},a=>{const dt=Math.min(.1,a[0]||.016);fN++;fT+=dt;if(fT>=1){X.fps=Math.round(fN/fT);fN=0;fT=0;if(typeof ren!=='undefined'&&ren)X.calls=ren.info.render.calls;const f=document.getElementById('x14gfps');if(f)f.textContent='FPS: '+X.fps+' · rajzolás: '+X.calls+' · halo: '+halos.length}
 if(!inPlay())return;if(!flats)buildFlats();
 if(DU.length&&(DU[0].s.parent!==scene))dustAttach();
 try{dustTick(dt)}catch(e){}try{waterTick(dt)}catch(e){}try{decalTick(dt)}catch(e){}try{shakeTick(dt)}catch(e){}
 if(C.spat||C.estep){if((lisT+=dt)>.05){lisT=0;try{listener()}catch(e){}}}try{eStepTick(dt)}catch(e){}
 for(const h of halos){h.ph+=dt*2;const k=h.k*(1+Math.sin(h.ph)*.06);h.s.scale.set(k,k,1)}});
WP('update',null,a=>{try{musicTick(Math.min(.1,a[0]||.016))}catch(e){}});
})();
