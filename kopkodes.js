// 💦 KÖPKÖDŐS MÓD – kis sziget, nincs fegyver, nincs építés: köpd le a többieket a vízbe!
// Saját renderer (mint sotet3d). Gomb: #kpBtn (lobby2 → Játék kategória), chat: /kopi. Mentés: k3kp. Debug: _kp
(function(){
'use strict';
const $=id=>document.getElementById(id);
const KEY='k3kp';
const ST=(()=>{try{return Object.assign({win:0,games:0,elim:0,hits:0,shots:0,falls:0,best:0,diff:1,bots:5,isl:'palma'},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return{win:0,games:0,elim:0,hits:0,shots:0,falls:0,best:0,diff:1,bots:5,isl:'palma'}}})();
const saveST=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const pay=n=>{try{if(window.S){S.c=(S.c||0)+n;try{save()}catch(e){}}}catch(e){}};
const ftf=n=>{try{return ftx(n)}catch(e){return n.toLocaleString('hu-HU')+' Ft'}};

const DIFF=[{n:'Könnyű',err:.22,react:.9,dodge:.15,charge:.25,mult:.7},{n:'Normál',err:.11,react:.55,dodge:.35,charge:.45,mult:1},{n:'Nehéz',err:.05,react:.3,dodge:.6,charge:.6,mult:1.5},{n:'Őrült',err:.02,react:.15,dodge:.85,charge:.75,mult:2.2}];
const ISL={
 palma:{n:'🌴 Pálmás-öböl',sand:0xf2d49b,water:0x1ea5c9,sky:0x8fd3ff,fog:0x9fdcff,fr:9,wind:0,desc:'Klasszikus homokpad.'},
 jeg:{n:'🧊 Jégtábla',sand:0xe6f4ff,water:0x1b4f7a,sky:0xcfe8ff,fog:0xdbeeff,fr:1.6,wind:0,desc:'Csúszik! Nehéz megállni.'},
 szel:{n:'🌬️ Szeles-szirt',sand:0xc9b38a,water:0x2a7f9e,sky:0x9fb8c9,fog:0xb3c4cf,fr:8,wind:1,desc:'Forgó szél tolja a köpéseket és a játékosokat.'},
 alkony:{n:'🌅 Alkony-zátony',sand:0xe0a46e,water:0x5b3f8f,sky:0xff9a6b,fog:0xf0a080,fr:9,wind:0,desc:'Zsugorodik a sziget, gyorsabban!'}
};
const NAMES=['Nyálas Nándor','Köpködő Kati','Csepp Csaba','Pötyi Piroska','Slejm Sanyi','Turmix Tibi','Zuhany Zsuzsa','Bugyborék Bence','Fröcsi Fanni','Hörpi Huba'];
const COLS=[0xef4444,0x3b82f6,0xf59e0b,0x10b981,0xa855f7,0xec4899,0x14b8a6,0xf97316];
const EMO=['😎','🤪','😤','🥸','🤠','😈','🐸','🦆','🤡','👽'];
const PU={chili:{e:'🌶️',n:'Csípős köpés',t:8,d:'×1,8 lökés, lángcsóva'},citrom:{e:'🍋',n:'Citromos szapora',t:8,d:'háromszoros tűzgyorsaság'},gumi:{e:'🍬',n:'Rágógumi',t:9,d:'a talált ellenfél lelassul'},kokusz:{e:'🥥',n:'Kókusztej',t:6,d:'teli nyál + pajzs'},fokhagyma:{e:'🧄',n:'Fokhagymás legyező',t:8,d:'3 köpés legyezőben'},buborek:{e:'🫧',n:'Buborékpáncél',t:7,d:'egy találatot elnyel'}};
const PUK=Object.keys(PU);
const TAUNT=['Ptyű! 💦','Gyere csak!','Nyálas vagy!','Úszni tudsz? 🏊','Haha!','Ez fájt? 😏'];

// ---------- hang ----------
let AC=null,MG=null;
function ac(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.gain.value=.45;MG.connect(AC.destination)}catch(e){}}if(AC&&AC.state==='suspended')AC.resume();return AC}
function noise(dur,f0,f1,q,vol,type){const a=ac();if(!a)return;const n=Math.floor(a.sampleRate*dur),b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type=type||'bandpass';f.Q.value=q||2;const t=a.currentTime;f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(40,f1),t+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(MG);s.start()}
function tone(f0,f1,dur,vol,type){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(MG);o.start();o.stop(t+dur)}
const SND={
 spit:(big,vol)=>{vol=vol==null?1:vol;noise(big?.22:.12,big?2200:3200,big?500:900,3,.5*vol);tone(big?260:420,big?90:160,big?.16:.09,.25*vol,'triangle')},
 splat:vol=>{vol=vol==null?1:vol;noise(.18,900,180,1.2,.6*vol,'lowpass');tone(140,60,.12,.3*vol)},
 splash:()=>{noise(.7,1800,200,.8,.7,'lowpass');noise(.4,4000,1500,1,.25)},
 pick:()=>{tone(660,990,.12,.25,'square');setTimeout(()=>tone(990,1320,.12,.2,'square'),90)},
 dash:()=>noise(.15,600,2400,1.5,.3),
 jump:()=>tone(300,600,.12,.15,'triangle'),
 bell:()=>{tone(880,880,.5,.25);tone(1320,1320,.4,.12)},
 win:()=>{[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,f,.25,.25,'square'),i*130))},
 lose:()=>{[392,330,262].forEach((f,i)=>setTimeout(()=>tone(f,f*.9,.3,.22,'sawtooth'),i*180))}
};

// ---------- jelenet ----------
function lockP(){try{const r=R.domElement.requestPointerLock();if(r&&r.catch)r.catch(()=>{})}catch(e){}}
let R,SC,CAM,SUN,WATER,WPOS,WBASE,ISLM,RIM,ON=false,PAUSE=false,raf=0,last=0;
let W=null; // állapot
const keys={};let mdown=false,yaw=0,pit=-.12,shake=0;

function texEmoji(e,size){const c=document.createElement('canvas');c.width=c.height=size||128;const x=c.getContext('2d');x.font=((size||128)*.78)+'px "Segoe UI Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,c.width/2,c.height/2+4);const t=new THREE.CanvasTexture(c);return t}
function texLabel(txt,col){const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.font='bold 42px system-ui';x.textAlign='center';x.textBaseline='middle';x.lineWidth=8;x.strokeStyle='rgba(0,0,0,.75)';x.strokeText(txt,256,48);x.fillStyle=col||'#fff';x.fillText(txt,256,48);return new THREE.CanvasTexture(c)}
function sandTex(base){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const col=new THREE.Color(base);x.fillStyle='#'+col.getHexString();x.fillRect(0,0,256,256);for(let i=0;i<5000;i++){const k=.82+Math.random()*.3;x.fillStyle='rgba('+(col.r*255*k|0)+','+(col.g*255*k|0)+','+(col.b*255*k|0)+',.6)';x.fillRect(Math.random()*256,Math.random()*256,2,2)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(5,5);return t}

function initR(){
 const w=document.createElement('div');w.id='kpw';w.style.cssText='position:fixed;inset:0;z-index:2147483000;display:none;background:#000;user-select:none;font-family:system-ui,sans-serif';
 w.innerHTML=`<style>
#kpw .pl{position:absolute;color:#fff;background:rgba(8,20,40,.72);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:8px 12px;z-index:3;backdrop-filter:blur(4px)}
#kpw button.k{font:700 15px system-ui;color:#fff;background:linear-gradient(180deg,#22c55e,#15803d);border:0;border-radius:10px;padding:10px 18px;cursor:pointer;margin:4px}
#kpw button.k.g{background:linear-gradient(180deg,#64748b,#334155)}
#kpw button.o{font:600 14px system-ui;color:#e2e8f0;background:#1e293b;border:2px solid #334155;border-radius:10px;padding:8px 12px;cursor:pointer;margin:3px}
#kpw button.o.on{border-color:#22d3ee;background:#0e3a4a;color:#fff}
#kpM,#kpEnd,#kpPause{position:absolute;inset:0;z-index:6;display:none;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(8,30,60,.55),rgba(2,6,23,.88))}
#kpw .box{background:linear-gradient(180deg,#0f2742,#0a1628);border:2px solid #22d3ee;border-radius:20px;padding:22px 28px;color:#fff;max-width:min(720px,94vw);max-height:92vh;overflow:auto;box-shadow:0 0 40px rgba(34,211,238,.35);text-align:center}
#kpw h1{margin:0 0 4px;font-size:34px;letter-spacing:1px;background:linear-gradient(90deg,#a7f3d0,#22d3ee,#a7f3d0);-webkit-background-clip:text;color:transparent}
#kpw .row{margin:10px 0}#kpw .lbl{font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
#kpCross{position:absolute;left:50%;top:46%;width:46px;height:46px;margin:-23px;z-index:3;pointer-events:none}
#kpBan{position:absolute;left:50%;top:28%;transform:translate(-50%,-50%);font:900 54px system-ui;color:#fff;text-shadow:0 4px 0 #0e7490,0 0 30px #22d3ee;z-index:4;pointer-events:none;opacity:0;transition:opacity .3s,transform .3s;white-space:nowrap}
#kpSlime{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .6s}
#kpFeed div{background:rgba(8,20,40,.75);padding:4px 10px;border-radius:8px;margin-bottom:4px;font:600 13px system-ui;animation:kpf .3s}
@keyframes kpf{from{transform:translateX(30px);opacity:0}}
#kpList .r{display:flex;align-items:center;gap:6px;font:600 13px system-ui;padding:2px 0}#kpList .r.out{opacity:.35;text-decoration:line-through}
#kpList i{display:inline-block;width:10px;height:10px;border-radius:50%}
</style>
<div id="kpSlime"></div>
<svg id="kpCross" viewBox="0 0 46 46"><circle cx="23" cy="23" r="3" fill="#fff"/><circle id="kpChg" cx="23" cy="23" r="18" fill="none" stroke="#a3e635" stroke-width="4" stroke-dasharray="113" stroke-dashoffset="113" transform="rotate(-90 23 23)" stroke-linecap="round"/></svg>
<div id="kpBan"></div>
<div class="pl" id="kpTop" style="top:12px;left:50%;transform:translateX(-50%);text-align:center;font:700 15px system-ui"></div>
<div class="pl" id="kpMe" style="left:14px;bottom:14px;min-width:230px"></div>
<div class="pl" id="kpList" style="right:14px;top:60px;min-width:190px"></div>
<div id="kpFeed" style="position:absolute;right:14px;top:12px;z-index:3;color:#fff;text-align:right"></div>
<div class="pl" id="kpHelp" style="bottom:14px;left:50%;transform:translateX(-50%);font:600 12px system-ui;color:#cbd5e1;white-space:nowrap">Kattints a célzáshoz · WASD mozgás · BAL KLIKK köpés (nyomva tartva: nagy köpés) · SZÓKÖZ ugrás · SHIFT kitérés · 1–4 beszólás · ESC szünet</div>
<button class="k g" id="kpX" style="position:absolute;top:10px;left:12px;z-index:5;padding:7px 12px">✖ Kilépés</button>
<div id="kpM"><div class="box"><h1>💦 KÖPKÖDŐS</h1><div style="color:#a5f3fc;margin-bottom:8px">Nincs fegyver, nincs építés. Köpd le a többieket a kis szigetről!<br><small style="color:#94a3b8">Minél nyálasabb valaki (%), annál messzebbre repül. Aki vízbe esik, életet veszít. 2 nyert kör = győzelem.</small></div>
<div class="row"><div class="lbl">Sziget</div><div id="kpIsl"></div><div id="kpIslD" style="font-size:12px;color:#94a3b8;margin-top:3px"></div></div>
<div class="row"><div class="lbl">Ellenfelek</div><div id="kpBots"></div></div>
<div class="row"><div class="lbl">Nehézség</div><div id="kpDiff"></div></div>
<div class="row" style="font-size:13px;color:#cbd5e1">${Object.values(PU).map(p=>p.e+' '+p.n).join(' · ')}</div>
<div class="row" id="kpStat" style="font-size:13px;color:#94a3b8"></div>
<button class="k" id="kpGo" style="font-size:20px;padding:12px 34px">▶ INDULÁS</button></div></div>
<div id="kpPause"><div class="box"><h1>⏸ Szünet</h1><button class="k" id="kpRes">▶ Folytatás</button><button class="k g" id="kpQuit">✖ Feladás</button></div></div>
<div id="kpEnd"><div class="box" id="kpEndB"></div></div>`;
 document.body.appendChild(w);
 R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
 R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';w.insertBefore(R.domElement,w.firstChild);
 CAM=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,400);
 R.domElement.addEventListener('mousedown',e=>{ac();if(!W||!W.live||PAUSE)return;if(document.pointerLockElement!==R.domElement){lockP();return}if(e.button===0)mdown=true;if(e.button===2)dash(W.me)});
 R.domElement.addEventListener('contextmenu',e=>e.preventDefault());
 addEventListener('mouseup',e=>{if(e.button===0&&mdown){mdown=false;if(ON&&W&&W.me)release(W.me)}});
 document.addEventListener('mousemove',e=>{if(!ON||document.pointerLockElement!==R.domElement)return;yaw-=e.movementX*.0024;pit=Math.max(-.7,Math.min(.45,pit-e.movementY*.0022))});
 document.addEventListener('pointerlockchange',()=>{if(ON&&W&&W.live&&!PAUSE&&document.pointerLockElement!==R.domElement&&!W.noPause)pause(true)});
 const kd=e=>{if(!ON)return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(e.type==='keydown'){keys[k]=1;if(k==='Escape'){if(W&&W.live)pause(!PAUSE)}else if(k===' ')jump(W&&W.me);else if(k==='Shift')dash(W&&W.me);else if('1234'.includes(k)&&W&&W.me)taunt(W.me,TAUNT[+k-1])}else keys[k]=0;e.stopImmediatePropagation();if(k!=='F5'&&k!=='F12')e.preventDefault()};
 addEventListener('keydown',kd,true);addEventListener('keyup',kd,true);addEventListener('keypress',e=>{if(ON){e.stopImmediatePropagation()}},true);
 addEventListener('resize',()=>{if(!R)return;R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix()});
 $('kpX').onclick=close;$('kpGo').onclick=()=>{ac();startMatch()};$('kpRes').onclick=()=>pause(false);$('kpQuit').onclick=()=>{pause(false);endMatch(false,true)};
}

function buildScene(){
 const I=ISL[ST.isl];
 SC=new THREE.Scene();SC.background=new THREE.Color(I.sky);SC.fog=new THREE.Fog(I.fog,40,150);
 SC.add(new THREE.HemisphereLight(0xffffff,0x6b5a3a,.5));
 SUN=new THREE.DirectionalLight(ST.isl==='alkony'?0xffc08a:0xffffff,.75);SUN.position.set(18,30,12);SUN.castShadow=true;SUN.shadow.mapSize.set(1024,1024);const sc=SUN.shadow.camera;sc.left=sc.bottom=-16;sc.right=sc.top=16;sc.near=1;sc.far=80;SC.add(SUN);
 // égbolt-gömb színátmenettel
 const sky=new THREE.Mesh(new THREE.SphereGeometry(180,24,12),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{a:{value:new THREE.Color(I.sky)},b:{value:new THREE.Color(ST.isl==='alkony'?0x3b2a6b:0x2563eb)}},vertexShader:'varying float h;void main(){h=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 a;uniform vec3 b;varying float h;void main(){gl_FragColor=vec4(mix(a,b,clamp(h*1.6,0.,1.)),1.);}'}));SC.add(sky);
 // nap korong
 const sunD=new THREE.Mesh(new THREE.CircleGeometry(8,24),new THREE.MeshBasicMaterial({color:ST.isl==='alkony'?0xffb347:0xfff6c8,fog:false}));sunD.position.set(90,ST.isl==='alkony'?18:70,-120);sunD.lookAt(0,0,0);SC.add(sunD);
 // víz
 const wg=new THREE.PlaneGeometry(320,320,70,70);wg.rotateX(-Math.PI/2);WPOS=wg.attributes.position;WBASE=Float32Array.from(WPOS.array);
 WATER=new THREE.Mesh(wg,new THREE.MeshPhongMaterial({color:I.water,shininess:90,specular:0xbfefff,transparent:true,opacity:.9,flatShading:true}));WATER.position.y=-.6;WATER.receiveShadow=true;SC.add(WATER);
 // sziget
 const sg=new THREE.CylinderGeometry(1,1.18,1,48,1);ISLM=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({map:sandTex(I.sand)}));ISLM.position.y=-.5;ISLM.receiveShadow=true;SC.add(ISLM);
 const under=new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.6,4,48,1,true),new THREE.MeshLambertMaterial({color:0x6b5536}));under.position.y=-3;ISLM.add(under);under.scale.set(1,1,1);
 RIM=new THREE.Mesh(new THREE.RingGeometry(.97,1,64),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,side:THREE.DoubleSide}));RIM.rotation.x=-Math.PI/2;RIM.position.y=.02;SC.add(RIM);
 // díszek: pálmák / jégtüskék / sziklák a víz szélén (távolabb, nem ütköznek)
 const deco=new THREE.Group();SC.add(deco);
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2+Math.random()*.3,r=26+Math.random()*30;const x=Math.cos(a)*r,z=Math.sin(a)*r;
  const isl=new THREE.Mesh(new THREE.CylinderGeometry(2+Math.random()*2,3+Math.random()*2,1.4,14),new THREE.MeshLambertMaterial({color:I.sand}));isl.position.set(x,-.5,z);deco.add(isl);
  if(ST.isl==='jeg'){const sp=new THREE.Mesh(new THREE.ConeGeometry(1,3+Math.random()*3,6),new THREE.MeshLambertMaterial({color:0xbfe6ff}));sp.position.set(x,1.5,z);deco.add(sp)}
  else palm(deco,x,0,z,.9+Math.random()*.5)}
 if(ST.isl!=='jeg'){palm(SC,0,0,0,0,true)}
 // sirályok
 W.gulls=[];for(let i=0;i<5;i++){const g=new THREE.Group();const wm=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});const l=new THREE.Mesh(new THREE.PlaneGeometry(.9,.25),wm),r=l.clone();l.position.x=-.45;r.position.x=.45;g.add(l,r);g.userData={l,r,a:Math.random()*6,rad:15+Math.random()*25,h:9+Math.random()*6,sp:.15+Math.random()*.2};SC.add(g);W.gulls.push(g)}
 // felhők
 for(let i=0;i<9;i++){const c=new THREE.Group();for(let j=0;j<4;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(2+Math.random()*2,8,6),new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.9}));s.position.set(j*2.6-4,Math.random(),Math.random()*2);c.add(s)}const a=Math.random()*6.28;c.position.set(Math.cos(a)*110,35+Math.random()*15,Math.sin(a)*110);SC.add(c)}
}
function palm(par,x,y,z,s,big){s=s||1;const g=new THREE.Group();const tr=new THREE.MeshLambertMaterial({color:0x8b5a2b}),lf=new THREE.MeshLambertMaterial({color:0x2f9e44,side:THREE.DoubleSide});
 if(big){return}// a középső pálma kimarad – ne takarja a harcot
 let px=0,py=0;for(let i=0;i<6;i++){const seg=new THREE.Mesh(new THREE.CylinderGeometry(.18*s,.24*s,.9*s,7),tr);px+=.08*s;py+=.85*s;seg.position.set(px,py,0);seg.rotation.z=-.08;g.add(seg)}
 for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(.7*s,3*s),lf);l.position.set(px,py+.3*s,0);l.rotation.set(-1.0,i/7*Math.PI*2,0,'YXZ');l.translateY(1.3*s);g.add(l)}
 const co=new THREE.Mesh(new THREE.SphereGeometry(.22*s,8,6),new THREE.MeshLambertMaterial({color:0x5b3a1a}));co.position.set(px+.2*s,py-.1,0);g.add(co);
 g.position.set(x,y,z);g.rotation.y=Math.random()*6;g.traverse(o=>{if(o.isMesh)o.castShadow=true});par.add(g)}

// ---------- karakterek ----------
function mkModel(col,em){let m;try{m=person(col,em,1)}catch(e){m=null}
 if(!m){m=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.35,1.1,10),new THREE.MeshLambertMaterial({color:col}));b.position.y=.75;const h=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),new THREE.MeshLambertMaterial({color:0xffd7b0}));h.position.y=1.55;m.add(b,h)}
 const bb=new THREE.Box3().setFromObject(m);const h=Math.max(.1,bb.max.y-bb.min.y);m.scale.multiplyScalar(1.75/h);m.position.y=-bb.min.y*1.75/h;
 const g=new THREE.Group();g.add(m);g.userData.limbs=[];m.traverse(o=>{if(o.isMesh)o.castShadow=true;if(o.userData&&o.userData.limb)g.userData.limbs.push(o)});
 // árnyék-folt
 const sh=new THREE.Mesh(new THREE.CircleGeometry(.45,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.28,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.03;g.userData.sh=sh;
 return g}
function mkP(name,col,em,bot,i,n){
 const g=mkModel(col,em);SC.add(g);SC.add(g.userData.sh);
 const lab=new THREE.Sprite(new THREE.SpriteMaterial({map:texLabel(name,'#'+new THREE.Color(col).getHexString()),depthTest:false,transparent:true}));lab.scale.set(2.6,.5,1);lab.position.y=2.35;lab.renderOrder=10;g.add(lab);
 const pct=new THREE.Sprite(new THREE.SpriteMaterial({map:texLabel('0%','#fff'),depthTest:false,transparent:true}));pct.scale.set(1.8,.34,1);pct.position.y=2.05;pct.renderOrder=10;g.add(pct);
 const bub=new THREE.Sprite(new THREE.SpriteMaterial({map:texLabel(''),depthTest:false,transparent:true}));bub.scale.set(3.2,.6,1);bub.position.y=2.8;bub.visible=false;bub.renderOrder=11;g.add(bub);
 const shield=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12),new THREE.MeshPhongMaterial({color:0x7dd3fc,transparent:true,opacity:.28,shininess:100,depthWrite:false}));shield.position.y=.9;shield.visible=false;g.add(shield);
 const a=i/n*Math.PI*2;
 return {g,lab,pctS:pct,bub,shield,name,col,em,bot,x:Math.cos(a)*W.R*.6,z:Math.sin(a)*W.R*.6,y:0,vx:0,vz:0,vy:0,face:a+Math.PI,pct:0,lives:2,alive:true,inv:0,stun:0,sal:100,cd:0,chg:0,charging:false,dashCd:0,pu:null,put:0,bubbleT:0,slow:0,walk:0,lastHit:null,lastHitT:0,elims:0,hits:0,shots:0,ground:true,falling:false,respawn:0,shownPct:-1,ai:{t:0,tgt:null,strafe:1,wantCharge:0,mx:0,mz:0},dl:0,roundWins:0}
}
function setPctLabel(p){const v=Math.round(p.pct);if(v===p.shownPct)return;p.shownPct=v;const c=v<50?'#fff':v<100?'#fde047':v<150?'#fb923c':'#ef4444';p.pctS.material.map.dispose();p.pctS.material.map=texLabel(v+'%',c);p.pctS.material.needsUpdate=true}
function taunt(p,t){if(!p||!p.alive)return;p.bub.material.map.dispose();p.bub.material.map=texLabel('💬 '+t,'#fef9c3');p.bub.material.needsUpdate=true;p.bub.visible=true;p.bubbleT=2.2}

// ---------- köpés ----------
const SPITS=[],PARTS=[],PUDDLES=[],PUS=[];
let GEO_S,MAT_S,MAT_C,MAT_F,GEO_P;
function mats(){GEO_S=new THREE.SphereGeometry(.16,10,8);MAT_S=new THREE.MeshPhongMaterial({color:0xb5f5a0,transparent:true,opacity:.85,shininess:120,specular:0xffffff});MAT_C=new THREE.MeshPhongMaterial({color:0x8be36c,transparent:true,opacity:.9,shininess:120,specular:0xffffff});MAT_F=new THREE.MeshBasicMaterial({color:0xff6a1a});GEO_P=new THREE.SphereGeometry(.07,6,5)}
function mouth(p){return new THREE.Vector3(p.x+Math.sin(p.face)*.35,p.y+1.5,p.z+Math.cos(p.face)*.35)}
function startCharge(p){if(!p.alive||p.cd>0||p.sal<8||p.stun>0)return;p.charging=true;p.chg=0}
function release(p){if(!p.charging){if(p===W.me)quick(p);return}p.charging=false;const c=p.chg;p.chg=0;if(c<.18){quick(p);return}fire(p,Math.min(1,c),null)}
function quick(p){if(!p.alive||p.stun>0)return;if(p.cd>0||p.sal<6)return;fire(p,0,null)}
function aimDir(p){if(p===W.me){const d=new THREE.Vector3(),o=new THREE.Vector3();CAM.getWorldDirection(d);o.copy(CAM.position).addScaledVector(d,30);return o.sub(mouth(p)).normalize()}return null}
function fire(p,c,dirOverride){
 const big=c>0;const cost=big?10+c*16:6;if(p.sal<cost*.6)return;p.sal=Math.max(0,p.sal-cost);
 const rapid=p.pu==='citrom';p.cd=big?.45:(rapid?.11:.32);
 const dir=dirOverride||aimDir(p)||new THREE.Vector3(Math.sin(p.face),0,Math.cos(p.face));
 const spd=big?20+c*10:24,pow=big?1.3+c*1.7:1;
 const fan=p.pu==='fokhagyma'?[-.16,0,.16]:[0];
 fan.forEach(off=>{const d=dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0),off);
  const m=new THREE.Mesh(GEO_S,big?MAT_C:MAT_S);const s=big?1.3+c*1.4:1;m.scale.set(s,s,s*1.6);m.position.copy(mouth(p));SC.add(m);
  SPITS.push({m,o:p,vx:d.x*spd,vy:d.y*spd+(big?1.2:.6),vz:d.z*spd,g:big?9:5,pow,life:2.2,big,r:.32*s,fire:p.pu==='chili',gum:p.pu==='gumi',trail:0})});
 p.shots++;if(p===W.me){ST.shots++;shake=Math.max(shake,big?.12:.04)}
 const dme=W.me?Math.hypot(p.x-W.me.x,p.z-W.me.z):0;SND.spit(big,p===W.me?1:Math.max(.08,1-dme/30));
 // köpés-animáció: fej előre
 p.spitAnim=.18}
function burst(x,y,z,col,n,sp){for(let i=0;i<n;i++){const m=new THREE.Mesh(GEO_P,new THREE.MeshBasicMaterial({color:col,transparent:true}));m.position.set(x,y,z);SC.add(m);PARTS.push({m,vx:(Math.random()-.5)*sp,vy:Math.random()*sp*.8,vz:(Math.random()-.5)*sp,l:.6+Math.random()*.5})}}
function puddle(x,z,s){if(Math.hypot(x,z)>W.R)return;const m=new THREE.Mesh(new THREE.CircleGeometry(.35*s,12),new THREE.MeshBasicMaterial({color:0x9be37a,transparent:true,opacity:.55,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.025+Math.random()*.005,z);SC.add(m);PUDDLES.push({m,l:7});if(PUDDLES.length>40){const o=PUDDLES.shift();SC.remove(o.m)}}
function hit(s,t){
 if(t.inv>0)return;
 if(t.pu==='buborek'){t.pu=null;t.put=0;burst(t.x,t.y+1,t.z,0x7dd3fc,18,6);SND.pick();feed(`🫧 ${t.name} buborékja kipukkadt`);return}
 const pow=s.pow*(s.fire?1.8:1)*(t.pu==='kokusz'?.5:1);
 const dmg=(s.big?7+s.pow*5:5)*(s.fire?1.4:1);t.pct=Math.min(300,t.pct+dmg);
 const sp=Math.hypot(s.vx,s.vz)||1;const kb=(3.2+t.pct*.075)*pow;
 t.vx+=s.vx/sp*kb;t.vz+=s.vz/sp*kb;t.vy=Math.max(t.vy,(1.6+t.pct*.02)*Math.min(1.6,pow));t.ground=false;
 t.stun=.18+Math.min(.5,t.pct*.002)*pow;t.lastHit=s.o;t.lastHitT=4;if(s.gum)t.slow=3;
 s.o.hits++;if(s.o===W.me){ST.hits++;hitmark()}
 burst(t.x,t.y+1.3,t.z,s.fire?0xff7a1a:0xa3f07a,s.big?22:10,s.big?7:4);
 const dme=Math.hypot(t.x-W.me.x,t.z-W.me.z);SND.splat(t===W.me?1:Math.max(.1,1-dme/25));
 if(t===W.me){slime(s.big?.85:.45);shake=Math.max(shake,s.big?.35:.15)}
 setPctLabel(t)}
let hmT=0;function hitmark(){const c=$('kpCross');c.style.transform='scale(1.35)';clearTimeout(hmT);hmT=setTimeout(()=>c.style.transform='',90)}
function slime(a){const s=$('kpSlime');let h='';for(let i=0;i<5;i++){const x=Math.random()*100,y=Math.random()*100,r=8+Math.random()*16;h+=`radial-gradient(circle at ${x}% ${y}%,rgba(160,240,110,.55) 0,rgba(160,240,110,.35) ${r*.5}%,transparent ${r}%),`}s.style.background=h.slice(0,-1);s.style.transition='none';s.style.opacity=a;requestAnimationFrame(()=>{s.style.transition='opacity 1.4s';s.style.opacity=0})}

// ---------- mozgás ----------
function jump(p){if(!p||!p.alive||!p.ground||p.stun>0||!W.live)return;p.vy=6.2;p.ground=false;if(p===W.me)SND.jump()}
function dash(p){if(!p||!p.alive||p.dashCd>0||p.stun>0||!W.live)return;let dx=0,dz=0;
 if(p===W.me){const f=(keys.w?1:0)-(keys.s?1:0),r=(keys.d?1:0)-(keys.a?1:0);dx=Math.sin(yaw)*f-Math.cos(yaw)*r*-1;dz=Math.cos(yaw)*f+Math.sin(yaw)*r*-1;
  // jobb = (−cos yaw, sin yaw) a kamera-irányhoz
  dx=Math.sin(yaw)*f-Math.cos(yaw)*r;dz=Math.cos(yaw)*f+Math.sin(yaw)*r;if(!dx&&!dz){dx=Math.sin(yaw);dz=Math.cos(yaw)}}
 else{dx=p.ai.mx;dz=p.ai.mz;if(!dx&&!dz){dx=Math.random()-.5;dz=Math.random()-.5}}
 const l=Math.hypot(dx,dz)||1;p.vx+=dx/l*9;p.vz+=dz/l*9;p.dashCd=1.6;p.inv=Math.max(p.inv,.18);if(p===W.me)SND.dash();burst(p.x,p.y+.3,p.z,0xfff1c1,8,3)}

// ---------- powerup ----------
function spawnPU(){if(PUS.length>=3)return;const k=PUK[Math.random()*PUK.length|0];const a=Math.random()*6.28,r=Math.random()*W.R*.75;
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:texEmoji(PU[k].e),transparent:true}));sp.scale.set(1.1,1.1,1);sp.position.set(Math.cos(a)*r,.9,Math.sin(a)*r);SC.add(sp);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.45,.6,24),new THREE.MeshBasicMaterial({color:0xfde047,transparent:true,opacity:.7,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(sp.position.x,.04,sp.position.z);SC.add(ring);
 PUS.push({k,sp,ring,t:0})}
function takePU(p,u){p.pu=u.k;p.put=PU[u.k].t;if(u.k==='kokusz'){p.sal=100;p.pct=Math.max(0,p.pct-15);setPctLabel(p)}
 SC.remove(u.sp);SC.remove(u.ring);PUS.splice(PUS.indexOf(u),1);burst(u.sp.position.x,1,u.sp.position.z,0xfde047,14,4);
 if(p===W.me){SND.pick();banner(PU[u.k].e+' '+PU[u.k].n,1.2,26)}else taunt(p,PU[u.k].e+'!')}

// ---------- AI ----------
function botThink(p,dt){
 const D=DIFF[ST.diff],ai=p.ai;ai.t-=dt;
 const al=W.P.filter(q=>q!==p&&q.alive&&!q.falling);
 if(ai.t<=0){ai.t=D.react*(.6+Math.random()*.8);
  // célpont: legközelebbi vagy aki a széléhez közel áll / nagy %
  let best=null,bs=1e9;for(const q of al){const d=Math.hypot(q.x-p.x,q.z-p.z);const sc=d-q.pct*.03-(Math.hypot(q.x,q.z)/W.R)*4+(q===W.me?-.4*ST.diff:0);if(sc<bs){bs=sc;best=q}}ai.tgt=best;
  if(Math.random()<.35)ai.strafe*=-1;ai.wantCharge=Math.random()<D.charge?.3+Math.random()*.7:0;
  // powerup ha közel
  ai.pu=null;for(const u of PUS){const d=Math.hypot(u.sp.position.x-p.x,u.sp.position.z-p.z);if(d<6&&Math.random()<.8){ai.pu=u;break}}
  if(Math.random()<.04)taunt(p,TAUNT[Math.random()*TAUNT.length|0])}
 const t=ai.tgt;let mx=0,mz=0;
 const rr=Math.hypot(p.x,p.z),edge=rr/W.R;
 if(ai.pu&&PUS.includes(ai.pu)){mx=ai.pu.sp.position.x-p.x;mz=ai.pu.sp.position.z-p.z}
 else if(t){const dx=t.x-p.x,dz=t.z-p.z,d=Math.hypot(dx,dz)||1;const want=ai.wantCharge?7:5;
  const fwd=d>want+1.5?1:d<want-1.5?-.6:0;mx=dx/d*fwd+(-dz/d)*ai.strafe*.7;mz=dz/d*fwd+(dx/d)*ai.strafe*.7;
  p.face=Math.atan2(dx,dz)}
 // szél elkerülése
 if(edge>.72){const k=(edge-.72)*6;mx-=p.x/rr*k;mz-=p.z/rr*k}
 // kitérés a felé jövő köpés elől
 for(const s of SPITS){if(s.o===p)continue;const dx=p.x-s.m.position.x,dz=p.z-s.m.position.z,d=Math.hypot(dx,dz);if(d<6&&d>.5){const sv=Math.hypot(s.vx,s.vz);const dot=(dx*s.vx+dz*s.vz)/(d*sv);if(dot>.93&&Math.random()<D.dodge*dt*6){if(Math.random()<.5)jump(p);else{ai.mx=-s.vz;ai.mz=s.vx;if(Math.random()<.5){ai.mx*=-1;ai.mz*=-1}dash(p)}}}}
 const ml=Math.hypot(mx,mz);ai.mx=ml?mx/ml:0;ai.mz=ml?mz/ml:0;
 // tüzelés
 if(t&&p.stun<=0){const d=Math.hypot(t.x-p.x,t.z-p.z);
  if(p.charging){p.chg+=dt*.9;if(p.chg>=ai.wantCharge||p.sal<12){p.charging=false;botShoot(p,t,Math.min(1,p.chg));p.chg=0}}
  else if(p.cd<=0&&d<16&&p.sal>15&&Math.random()<dt*(1.4+ST.diff*.8)){if(ai.wantCharge&&d>3)startCharge(p);else botShoot(p,t,0)}}
}
function botShoot(p,t,c){const big=c>0,spd=big?20+c*10:24,g=big?9:5;const m=mouth(p);
 const tx=t.x+t.vx*0,tz=t.z+t.vz*0;let d=Math.hypot(tx-m.x,tz-m.z);let tt=d/spd;
 const lx=t.x+t.vx*tt*.85,lz=t.z+t.vz*tt*.85;const e=DIFF[ST.diff].err;
 let dx=lx-m.x,dz=lz-m.z;d=Math.hypot(dx,dz)||1;tt=d/spd;const ang=Math.atan2(dx,dz)+(Math.random()-.5)*e*2.4;
 const vy=((t.y+1.2)-m.y)/tt+.5*g*tt-(big?1.2:.6);
 const dir=new THREE.Vector3(Math.sin(ang),vy/spd,Math.cos(ang));const hl=Math.hypot(dir.x,dir.z);// normalizálás úgy, hogy a vízszintes rész = 1
 dir.x/=hl;dir.z/=hl;const n=dir.length();dir.multiplyScalar(1/n);// így spd*dir: vízszintes kicsit kisebb – elfogadható
 p.face=ang;fire(p,c,dir)}

// ---------- kör / meccs ----------
function feed(t){const f=$('kpFeed');const d=document.createElement('div');d.innerHTML=t;f.prepend(d);setTimeout(()=>d.remove(),5000);while(f.children.length>5)f.lastChild.remove()}
let banT=0;function banner(t,dur,fs){const b=$('kpBan');b.textContent=t;b.style.fontSize=(fs||54)+'px';b.style.opacity=1;b.style.transform='translate(-50%,-50%) scale(1)';clearTimeout(banT);banT=setTimeout(()=>{b.style.opacity=0;b.style.transform='translate(-50%,-50%) scale(.85)'},(dur||1.5)*1000)}
function clearWorld(){[SPITS,PARTS,PUDDLES].forEach(a=>{a.forEach(o=>SC.remove(o.m));a.length=0});PUS.forEach(u=>{SC.remove(u.sp);SC.remove(u.ring)});PUS.length=0}
function startMatch(){
 $('kpM').style.display='none';$('kpEnd').style.display='none';
 if(SC){SC.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
 W={R:10,R0:10,round:0,live:false,P:[],gulls:[],t:0,windA:0,matchStart:performance.now()};
 buildScene();mats();
 const n=ST.bots+1;const myCol=0x22d3ee;const used=new Set();
 W.me=mkP((window.ACC&&ACC.user&&ACC.user.name)||(window.S&&S.name)||'Te',myCol,'😎',false,0,n);W.P.push(W.me);
 for(let i=1;i<n;i++){let nm;do{nm=NAMES[Math.random()*NAMES.length|0]}while(used.has(nm));used.add(nm);W.P.push(mkP(nm,COLS[(i-1)%COLS.length],EMO[(i+Math.random()*3|0)%EMO.length],true,i,n))}
 ST.games++;saveST();nextRound();
 try{lockP()}catch(e){}
}
function nextRound(){
 clearWorld();W.round++;W.R=W.R0*(W.P.length>6?1.2:1);W.Rbase=W.R;W.t=0;W.puT=4;W.live=false;W.order=[];
 const n=W.P.length;W.P.forEach((p,i)=>{const a=i/n*Math.PI*2;p.x=Math.cos(a)*W.R*.6;p.z=Math.sin(a)*W.R*.6;p.y=0;p.vx=p.vz=p.vy=0;p.face=Math.atan2(-p.x,-p.z);p.pct=0;p.lives=2;p.alive=true;p.falling=false;p.inv=0;p.stun=0;p.sal=100;p.pu=null;p.charging=false;p.chg=0;p.g.visible=true;p.g.userData.sh.visible=true;p.shownPct=-1;setPctLabel(p)});
 yaw=W.me.face;pit=-.12;
 let c=3;banner(`${W.round}. KÖR`,1,64);SND.bell();
 const tick=()=>{if(!ON||!W)return;if(c>0){setTimeout(()=>{banner(String(c),.7,90);tone(520,520,.12,.2,'square');c--;tick()},900)}else setTimeout(()=>{banner('KÖPJ! 💦',.9,80);tone(880,880,.3,.25,'square');W.live=true},900)};tick();
}
function eliminate(p){p.lives--;ST.falls+=p===W.me?1:0;
 const k=p.lastHitT>0&&p.lastHit&&p.lastHit!==p?p.lastHit:null;
 if(k){k.elims++;if(k===W.me){ST.elim++;banner('💦 LEKÖPVE!',1,44)}feed(`<b style="color:#${new THREE.Color(k.col).getHexString()}">${k.name}</b> 💦 → 🌊 <b style="color:#${new THREE.Color(p.col).getHexString()}">${p.name}</b>`);if(k.bot&&Math.random()<.5)taunt(k,TAUNT[Math.random()*TAUNT.length|0])}
 else feed(`🌊 <b>${p.name}</b> beleesett a vízbe`);
 SND.splash();splash(p.x,p.z);
 if(p.lives>0){p.respawn=2;p.g.visible=false;p.g.userData.sh.visible=false;p.alive=false;if(p===W.me)banner('🌊 Még 1 életed van!',1.4,36)}
 else{p.alive=false;p.g.visible=false;p.g.userData.sh.visible=false;W.order.push(p);if(p===W.me)banner('🌊 KIESTÉL',1.6,56)}
 saveST()}
function splash(x,z){for(let i=0;i<30;i++){const m=new THREE.Mesh(GEO_P,new THREE.MeshBasicMaterial({color:0xe0f7ff,transparent:true}));m.scale.setScalar(1.5+Math.random()*2);m.position.set(x,-.5,z);SC.add(m);const a=Math.random()*6.28,s=1+Math.random()*3;PARTS.push({m,vx:Math.cos(a)*s,vy:5+Math.random()*5,vz:Math.sin(a)*s,l:1+Math.random()*.6})}
 const r=new THREE.Mesh(new THREE.RingGeometry(.3,.5,24),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.set(x,-.45,z);SC.add(r);PARTS.push({m:r,ring:1,l:1.2,vx:0,vy:0,vz:0})}
function respawn(p){const a=Math.random()*6.28,r=Math.random()*W.R*.3;p.x=Math.cos(a)*r;p.z=Math.sin(a)*r;p.y=6;p.vx=p.vz=0;p.vy=0;p.alive=true;p.falling=false;p.inv=2;p.pct=0;p.sal=100;p.g.visible=true;p.g.userData.sh.visible=true;setPctLabel(p)}
function roundOver(){
 const al=W.P.filter(p=>p.alive||p.respawn>0);const w=al[0]||null;W.live=false;
 if(w){w.roundWins++;W.order.push(w)}
 const meWon=w===W.me;if(meWon){SND.win();pay(Math.round(1500*DIFF[ST.diff].mult))}else SND.lose();
 banner(w?(meWon?'🏆 KÖRT NYERTÉL!':`${w.name} nyerte a kört`):'Döntetlen',2.2,meWon?60:42);
 if(w&&w.bot)taunt(w,'Nyertem! 😝');
 const champ=W.P.find(p=>p.roundWins>=2);
 setTimeout(()=>{if(!ON||!W)return;if(champ)endMatch(champ===W.me);else nextRound()},2600)}
function endMatch(won,quit){
 if(!W)return;W.live=false;W.done=true;try{document.exitPointerLock()}catch(e){}
 const m=DIFF[ST.diff].mult;const el=W.me.elims;const acc=W.me.shots?Math.round(W.me.hits/W.me.shots*100):0;
 let pr=quit?0:Math.round((el*400+(won?5000:500))*m);if(pr)pay(pr);
 if(won){ST.win++;ST.best=Math.max(ST.best,el)}saveST();
 const rows=W.P.slice().sort((a,b)=>b.roundWins-a.roundWins||b.elims-a.elims).map((p,i)=>`<tr style="${p===W.me?'background:#0e3a4a':''}"><td>${i+1}.</td><td style="text-align:left"><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#${new THREE.Color(p.col).getHexString()}"></i> ${p.name}</td><td>${p.roundWins}</td><td>${p.elims}</td><td>${p.shots?Math.round(p.hits/p.shots*100):0}%</td></tr>`).join('');
 $('kpEndB').innerHTML=`<h1>${quit?'🏳️ Feladtad':won?'🏆 GYŐZTÉL!':'🌊 Vége a meccsnek'}</h1>
 <div style="font-size:15px;color:#a5f3fc;margin:6px 0 12px">${quit?'Nincs jutalom.':`Jutalom: <b style="color:#fde047">${ftf(pr)}</b> (${DIFF[ST.diff].n} ×${m})`}</div>
 <table style="width:100%;border-collapse:collapse;font-size:14px" cellpadding="5"><tr style="color:#94a3b8"><td></td><td style="text-align:left">Játékos</td><td>Kör</td><td>Leköpve</td><td>Pontosság</td></tr>${rows}</table>
 <div style="margin:12px 0;font-size:13px;color:#cbd5e1">Te: ${el} leköpés · ${W.me.shots} köpés · ${acc}% pontosság</div>
 <button class="k" id="kpAgain">🔁 Újra</button><button class="k g" id="kpMenu">⚙️ Beállítások</button><button class="k g" id="kpOut">✖ Kilépés</button>`;
 $('kpEnd').style.display='flex';$('kpAgain').onclick=startMatch;$('kpMenu').onclick=menu;$('kpOut').onclick=close;
 if(won)SND.win();
}
function pause(v){PAUSE=v;$('kpPause').style.display=v?'flex':'none';if(v){try{document.exitPointerLock()}catch(e){}}else{last=0;try{lockP()}catch(e){}}}

// ---------- fő ciklus ----------
const _v=new THREE.Vector3();
function loop(t){if(!ON)return;raf=requestAnimationFrame(loop);const dt=Math.min(.05,last?(t-last)/1000:.016);last=t;if(!PAUSE&&W&&W.P.length)step(dt,t/1000);if(W&&W.P.length){cam(dt);R.render(SC,CAM)}}
function step(dt,T){
 const I=ISL[ST.isl];
 // víz hullámzás
 const a=WPOS.array;for(let i=0;i<a.length;i+=3){const x=WBASE[i],z=WBASE[i+2];a[i+1]=Math.sin(x*.18+T*1.3)*.22+Math.cos(z*.21+T*1.1)*.18}WPOS.needsUpdate=true;
 W.gulls.forEach(g=>{const u=g.userData;u.a+=u.sp*dt;g.position.set(Math.cos(u.a)*u.rad,u.h+Math.sin(T+u.a)*.6,Math.sin(u.a)*u.rad);g.rotation.y=-u.a;const f=Math.sin(T*8+u.a)*.5;u.l.rotation.z=f;u.r.rotation.z=-f});
 // sziget zsugorodás
 if(W.live){W.t+=dt;const st=ST.isl==='alkony'?25:40,du=ST.isl==='alkony'?30:45;const k=Math.max(0,Math.min(1,(W.t-st)/du));const nr=W.Rbase*(1-k*.55);if(nr<W.R-.001&&W.R===W.Rbase)feed('⚠️ A sziget süllyed!');W.R=nr}
 ISLM.scale.set(W.R,1,W.R);RIM.scale.set(W.R,W.R,1);RIM.material.opacity=W.R<W.Rbase?.45+Math.sin(T*6)*.3:.35;RIM.material.color.setHex(W.R<W.Rbase?0xff5a5a:0xffffff);
 // szél
 let wx=0,wz=0;if(I.wind){W.windA+=dt*.15;const s=2.2+Math.sin(T*.4)*1.2;wx=Math.cos(W.windA)*s;wz=Math.sin(W.windA)*s}W.wx=wx;W.wz=wz;
 // powerup
 if(W.live){W.puT-=dt;if(W.puT<=0){spawnPU();W.puT=7+Math.random()*5}}
 PUS.slice().forEach(u=>{u.t+=dt;u.sp.position.y=.9+Math.sin(u.t*3)*.15;u.ring.rotation.z+=dt;if(Math.hypot(u.sp.position.x,u.sp.position.z)>W.R){SC.remove(u.sp);SC.remove(u.ring);PUS.splice(PUS.indexOf(u),1);return}for(const p of W.P)if(p.alive&&Math.hypot(p.x-u.sp.position.x,p.z-u.sp.position.z)<.9&&p.y<1.5){takePU(p,u);break}});
 // saját irányítás
 const me=W.me;
 if(me.alive&&W.live){me.face=yaw;if(mdown&&!me.charging&&me.cd<=0)startCharge(me);if(me.charging)me.chg=Math.min(1.2,me.chg+dt*.85)}
 // játékosok
 for(const p of W.P){
  if(!p.alive){if(p.respawn>0){p.respawn-=dt;if(p.respawn<=0&&W.live)respawn(p)}continue}
  p.cd=Math.max(0,p.cd-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.inv=Math.max(0,p.inv-dt);p.stun=Math.max(0,p.stun-dt);p.slow=Math.max(0,p.slow-dt);p.lastHitT=Math.max(0,p.lastHitT-dt);
  p.sal=Math.min(100,p.sal+dt*(p.pu==='kokusz'?40:14));
  if(p.pu){p.put-=dt;if(p.put<=0)p.pu=null}
  if(p.bubbleT>0){p.bubbleT-=dt;if(p.bubbleT<=0)p.bub.visible=false}
  let mx=0,mz=0;
  if(W.live){if(p.bot)botThink(p,dt),mx=p.ai.mx,mz=p.ai.mz;
   else{const f=(keys.w||keys.ArrowUp?1:0)-(keys.s||keys.ArrowDown?1:0),r=(keys.d||keys.ArrowRight?1:0)-(keys.a||keys.ArrowLeft?1:0);mx=Math.sin(yaw)*f-Math.cos(yaw)*r;mz=Math.cos(yaw)*f+Math.sin(yaw)*r;const l=Math.hypot(mx,mz);if(l){mx/=l;mz/=l}}}
  const spd=(p.charging?3.2:6)*(p.slow>0?.5:1);const ctl=p.stun>0?0:(p.ground?1:.35);
  const fr=p.ground?(p.stun>0?2.2:I.fr):.4;
  // gyorsítás a cél sebesség felé
  const ax=(mx*spd-p.vx),az=(mz*spd-p.vz);const acc=ctl*(ST.isl==='jeg'?2:12)*dt;
  if(mx||mz){p.vx+=ax*Math.min(1,acc);p.vz+=az*Math.min(1,acc)}
  else{const d=Math.max(0,1-fr*dt);p.vx*=d;p.vz*=d}
  if(p.stun>0){const d=Math.max(0,1-fr*dt*.6);p.vx*=d;p.vz*=d}
  p.vx+=wx*dt*.5;p.vz+=wz*dt*.5;
  p.x+=p.vx*dt;p.z+=p.vz*dt;
  // gravitáció / talaj
  const onIsl=Math.hypot(p.x,p.z)<W.R+.15;
  p.vy-=18*dt;p.y+=p.vy*dt;
  if(onIsl&&p.y<=0&&p.y>-.6){p.y=0;if(p.vy<0)p.vy=0;p.ground=true}else p.ground=false;
  if(!onIsl&&p.y<=0)p.falling=true;
  if(p.y<-1.6){eliminate(p);continue}
  // ütközés más játékossal (gyenge lökés)
  for(const q of W.P){if(q===p||!q.alive)continue;const dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz);if(d<.7&&d>.001&&Math.abs(p.y-q.y)<1.4){const o=(.7-d)/2;p.x+=dx/d*o;p.z+=dz/d*o;q.x-=dx/d*o;q.z-=dz/d*o}}
  // modell
  p.g.position.set(p.x,p.y,p.z);p.g.rotation.y=p.face;p.g.userData.sh.position.set(p.x,.03,p.z);p.g.userData.sh.visible=onIsl;p.g.userData.sh.scale.setScalar(Math.max(.3,1-p.y*.12));
  const hs=Math.hypot(p.vx,p.vz);p.walk+=hs*dt*2.2;const sw=p.ground?Math.sin(p.walk)*Math.min(.8,hs*.12):.5;
  for(const l of p.g.userData.limbs){const k=l.userData.limb;l.rotation.x=(k==='lleg'||k==='rarm'?1:-1)*sw}
  const ch=p.g.children[0];ch.rotation.x=p.charging?-.18-p.chg*.15:(p.spitAnim>0?.35:0)+(p.stun>0?-.4:0);if(p.spitAnim>0)p.spitAnim-=dt;
  ch.rotation.z=p.stun>0?Math.sin(T*30)*.15:0;
  p.shield.visible=p.pu==='buborek'||p.pu==='kokusz'||p.inv>.25;p.shield.material.color.setHex(p.pu==='kokusz'?0xfff7d6:0x7dd3fc);
  p.g.visible=!(p.inv>.25&&Math.sin(T*25)>.3)||p.pu;
  if(p.pu==='chili'&&Math.random()<dt*12)burst(p.x,p.y+1.6,p.z,0xff6a1a,1,1.2);
 }
 // köpések
 for(let i=SPITS.length-1;i>=0;i--){const s=SPITS[i];s.life-=dt;s.vy-=s.g*dt;s.vx+=wx*dt*.8;s.vz+=wz*dt*.8;s.m.position.x+=s.vx*dt;s.m.position.y+=s.vy*dt;s.m.position.z+=s.vz*dt;
  _v.set(s.vx,s.vy,s.vz);s.m.lookAt(_v.add(s.m.position));
  s.trail-=dt;if(s.trail<=0){s.trail=.03;burst(s.m.position.x,s.m.position.y,s.m.position.z,s.fire?0xff7a1a:0xd9fbc5,1,.4)}
  let gone=false;
  for(const p of W.P){if(p===s.o||!p.alive)continue;const dy=s.m.position.y-p.y;if(dy<0||dy>1.95)continue;if(Math.hypot(s.m.position.x-p.x,s.m.position.z-p.z)<.45+s.r){hit(s,p);gone=true;break}}
  if(!gone&&s.m.position.y<=.05){const onI=Math.hypot(s.m.position.x,s.m.position.z)<W.R;if(onI){puddle(s.m.position.x,s.m.position.z,s.big?1.6:1);burst(s.m.position.x,.1,s.m.position.z,0xa3f07a,5,2)}else if(s.m.position.y<-.4)burst(s.m.position.x,-.4,s.m.position.z,0xe0f7ff,4,2);if(onI||s.m.position.y<-.4)gone=true}
  if(gone||s.life<=0){SC.remove(s.m);SPITS.splice(i,1)}}
 for(let i=PARTS.length-1;i>=0;i--){const q=PARTS[i];q.l-=dt;if(q.ring){q.m.scale.addScalar(dt*5);q.m.material.opacity=q.l/1.2}else{q.vy-=14*dt;q.m.position.x+=q.vx*dt;q.m.position.y+=q.vy*dt;q.m.position.z+=q.vz*dt;q.m.material.opacity=Math.min(1,q.l*2)}if(q.l<=0){SC.remove(q.m);q.m.material.dispose();PARTS.splice(i,1)}}
 for(let i=PUDDLES.length-1;i>=0;i--){const q=PUDDLES[i];q.l-=dt;q.m.material.opacity=Math.min(.55,q.l*.2);if(q.l<=0||Math.hypot(q.m.position.x,q.m.position.z)>W.R){SC.remove(q.m);PUDDLES.splice(i,1)}}
 // kör vége?
 if(W.live){const left=W.P.filter(p=>p.lives>0&&(p.alive||p.respawn>0));if(left.length<=1)roundOver()}
 hud(T)}
function cam(dt){const me=W.me;const px=me.alive?me.x:CAM.position.x,pz=me.alive?me.z:CAM.position.z;
 if(me.alive||!W.spec){const back=5.2,up=2.6;const cx=me.x-Math.sin(yaw)*Math.cos(pit)*back+Math.cos(yaw)*.55,cz=me.z-Math.cos(yaw)*Math.cos(pit)*back-Math.sin(yaw)*.55,cy=me.y+1.6-Math.sin(pit)*back*.9+up*.3;
  if(me.alive){CAM.position.set(cx,Math.max(.4,cy),cz);_v.set(me.x+Math.sin(yaw)*10+Math.cos(yaw)*.55,me.y+1.5+Math.sin(pit)*10,me.z+Math.cos(yaw)*10-Math.sin(yaw)*.55);CAM.lookAt(_v)}
  else{// néző: körbe a sziget fölött
   const a=performance.now()/6000;CAM.position.set(Math.cos(a)*W.R*1.9,W.R*1.1,Math.sin(a)*W.R*1.9);CAM.lookAt(0,0,0)}}
 if(shake>0){CAM.position.x+=(Math.random()-.5)*shake;CAM.position.y+=(Math.random()-.5)*shake;shake=Math.max(0,shake-dt*1.6)}
 const fov=65+(me.charging?-me.chg*6:0);if(Math.abs(CAM.fov-fov)>.05){CAM.fov+=(fov-CAM.fov)*.2;CAM.updateProjectionMatrix()}}
let hudT=0;
function hud(T){if(T-hudT<.08)return;hudT=T;const me=W.me;
 $('kpTop').innerHTML=`${W.round}. kör · ${W.P.map(p=>`<span title="${p.name}" style="color:#${new THREE.Color(p.col).getHexString()}">${'●'.repeat(p.roundWins)+'○'.repeat(2-p.roundWins)}</span>`).join(' ')}${W.R<W.Rbase?' · <span style="color:#f87171">⚠️ süllyed</span>':''}${ISL[ST.isl].wind?` · 🌬️ ${'←↙↓↘→↗↑↖'[Math.round(((Math.atan2(W.wz,W.wx)+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8]}`:''}`;
 const pc=Math.round(me.pct),col=pc<50?'#fff':pc<100?'#fde047':pc<150?'#fb923c':'#ef4444';
 $('kpMe').innerHTML=`<div style="display:flex;align-items:flex-end;gap:12px"><div style="font:900 44px system-ui;color:${col};text-shadow:0 2px 0 #000;line-height:1">${pc}%</div><div style="font-size:20px">${'❤️'.repeat(Math.max(0,me.lives))}${'🖤'.repeat(Math.max(0,2-me.lives))}</div></div>
 <div style="font-size:11px;color:#94a3b8;margin-top:6px">NYÁL</div><div style="height:10px;background:#0f172a;border-radius:6px;overflow:hidden"><i style="display:block;height:100%;width:${me.sal}%;background:linear-gradient(90deg,#86efac,#22d3ee)"></i></div>
 <div style="font-size:12px;margin-top:5px;color:#cbd5e1">${me.pu?`${PU[me.pu].e} ${PU[me.pu].n} <b>${Math.ceil(me.put)} mp</b>`:'—'} · kitérés ${me.dashCd>0?Math.ceil(me.dashCd*10)/10+' mp':'✅'}</div>`;
 $('kpList').innerHTML=W.P.map(p=>`<div class="r ${p.lives<=0?'out':''}"><i style="background:#${new THREE.Color(p.col).getHexString()}"></i>${p===me?'<b>'+p.name+'</b>':p.name}<span style="margin-left:auto">${Math.round(p.pct)}% ${'♥'.repeat(Math.max(0,p.lives))}</span></div>`).join('');
 $('kpChg').setAttribute('stroke-dashoffset',113-113*Math.min(1,me.chg));$('kpChg').setAttribute('stroke',me.chg>=1?'#f43f5e':'#a3e635');
 $('kpCross').style.display=me.alive?'':'none';
 $('kpHelp').style.display=W.t<20&&W.round===1?'':'none'}

// ---------- menü / nyitás ----------
function opts(id,list,cur,set){const el=$(id);el.innerHTML='';list.forEach(([v,t])=>{const b=document.createElement('button');b.className='o'+(v===cur?' on':'');b.textContent=t;b.onclick=()=>{set(v);menu()};el.appendChild(b)})}
function menu(){$('kpEnd').style.display='none';$('kpM').style.display='flex';
 opts('kpIsl',Object.entries(ISL).map(([k,v])=>[k,v.n]),ST.isl,v=>{ST.isl=v;saveST()});$('kpIslD').textContent=ISL[ST.isl].desc;
 opts('kpBots',[[3,'3'],[5,'5'],[7,'7']],ST.bots,v=>{ST.bots=v;saveST()});
 opts('kpDiff',DIFF.map((d,i)=>[i,d.n+' ×'+d.mult]),ST.diff,v=>{ST.diff=v;saveST()});
 $('kpStat').textContent=`Meccsek: ${ST.games} · Győzelem: ${ST.win} · Leköpések: ${ST.elim} · Pontosság: ${ST.shots?Math.round(ST.hits/ST.shots*100):0}% · Legtöbb leköpés egy győztes meccsen: ${ST.best}`;
 // háttér: üres jelenet, hogy ne legyen fekete
 if(!W||!W.P.length){W={R:10,R0:10,P:[],gulls:[],t:0,windA:0,me:null};buildScene();mats();CAM.position.set(15,8,15);CAM.lookAt(0,0,0)}
}
function open(){if(ON)return;if(!window.THREE){alert('A 3D motor még töltődik.');return}
 try{if(window.G&&G.on){say&&say('Előbb fejezd be a meccset!');return}}catch(e){}
 if(!R)initR();ON=true;PAUSE=false;$('kpw').style.display='block';R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix();
 W=null;menu();last=0;raf=requestAnimationFrame(menuLoop)}
function menuLoop(t){if(!ON)return;if(W&&W.P.length){loop(t);return}raf=requestAnimationFrame(menuLoop);const T=t/1000;if(WPOS){const a=WPOS.array;for(let i=0;i<a.length;i+=3)a[i+1]=Math.sin(WBASE[i]*.18+T*1.3)*.22+Math.cos(WBASE[i+2]*.21+T*1.1)*.18;WPOS.needsUpdate=true}const a=T*.15;CAM.position.set(Math.cos(a)*18,7,Math.sin(a)*18);CAM.lookAt(0,0,0);R.render(SC,CAM)}
function close(){ON=false;cancelAnimationFrame(raf);try{document.exitPointerLock()}catch(e){}$('kpw').style.display='none';for(const k in keys)keys[k]=0;mdown=false;if(SC)clearWorld();W=null}

// ---------- belépési pontok ----------
const btn=document.createElement('button');btn.id='kpBtn';btn.textContent='💦 KÖPKÖDŐS MÓD';btn.title='Kis sziget, fegyver nélkül – köpd a vízbe a többieket!';
btn.style.cssText='position:fixed;left:14px;bottom:190px;z-index:50;font:800 14px system-ui;color:#fff;background:linear-gradient(180deg,#22d3ee,#0e7490);border:2px solid #a5f3fc;border-radius:12px;padding:9px 14px;cursor:pointer;box-shadow:0 0 16px rgba(34,211,238,.5);display:none';
btn.onclick=open;document.body.appendChild(btn);
setInterval(()=>{const lb=$('lb');const on=lb&&lb.classList.contains('on')&&!ON&&!document.body.classList.contains('lb2on');btn.style.display=on?'':'none'},1000);
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}_lb2.add({ic:'💦',hu:'Köpködős mód',tx:'Köpködős mód',c:'play',fn:open,kw:'kopkodes kopi sziget nyal mod'})})();
// chat parancs /kopi
try{const o=window.extraCmd;window.extraCmd=function(c){if(/^\/(kopi|kopkodes|köpi)\b/i.test(String(c||'').trim())){open();return '💦 Köpködős mód megnyitva'}return o?o.apply(this,arguments):null}}catch(e){}
window._kp={open,close,menu,ST,get W(){return W},start:startMatch,win:()=>{if(W)W.P.forEach(p=>{if(p.bot){p.lives=0;p.alive=false;p.g.visible=false}})}};
})();
