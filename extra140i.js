// extra140i.js – 🫖 TEAKERT BŐVÍTÉS: padok/székek, kertészkedés, teaház-bolt, tábortűz-szikrák, ritka halak + verseny,
// csónakázás, madarak/pillangók/szentjánosbogarak, fotófal, teakóstoló, napszak + lampionok. Prefix: x14i
(function(){
const LS=(k,d)=>{try{const v=localStorage.getItem('k3x14i'+k);return v?JSON.parse(v):d}catch(e){return d}};
const LW=(k,v)=>{try{localStorage.setItem('k3x14i'+k,JSON.stringify(v))}catch(e){}};
const money=()=>(window.S&&typeof S.c==='number')?S.c:(typeof S!=='undefined'?S.c:0);
function pay(n){try{if(S.c<n)return false;S.c-=n;save();return true}catch(e){return false}}
function gain(n){try{S.c+=n;save()}catch(e){}}
const fm=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const snd=n=>{try{sfx(n)}catch(e){}};
const isOpen=()=>{const d=document.getElementById('cs');return !!(d&&d.classList.contains('on'))};
const CS=()=>window._CS;const ME=()=>CS()&&CS().ME;
const acc=()=>window.KR?KR.acc():{};
const online=()=>{const a=acc();return a&&a.user&&!a.guest&&a.ws&&a.ws.readyState===1};
const myName=()=>{const a=acc();return a&&a.user?a.user.name:'Vendég'};
const act=v=>{if(online())try{KR.wsend({t:'cs_act',a:'x14i',v:String(v).slice(0,24)})}catch(e){}};
function hint(t){const h=document.getElementById('csHint');if(!h)return;h.textContent=t;h.style.display='block';clearTimeout(hint._t);hint._t=setTimeout(()=>h.style.display='none',2600)}
function logL(t){const l=document.getElementById('csLog');if(!l)return;const d=document.createElement('div');d.innerHTML='<b style="color:#86efac">🌿</b> '+t;l.appendChild(d);while(l.children.length>8)l.firstChild.remove()}
function bubble(p,t,s){if(p){p.bub=t;p.bubT=s||3}}

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
#x14iBar{position:absolute;right:16px;top:58px;display:flex;flex-direction:column;gap:4px;z-index:3}
#x14iBar button,.x14iBtn{border:1px solid #fde68a55;border-radius:12px;padding:4px 11px;background:linear-gradient(135deg,#1e293bee,#0f172aee);color:#fde68a;font:700 15px Rajdhani,Arial;cursor:pointer;text-align:left;box-shadow:0 4px 14px #0007;transition:transform .12s}
#x14iBar button:hover,.x14iBtn:hover{transform:translateX(-3px);border-color:#fde68a}
#x14iClock{background:#0009;border-radius:12px;padding:6px 12px;font:700 15px Rajdhani;color:#e2e8f0;text-align:center;border:1px solid #ffffff22}
.x14iM{position:absolute;inset:0;background:#000a;display:flex;align-items:center;justify-content:center;z-index:20;font-family:Rajdhani,Arial}
.x14iP{width:min(560px,92vw);max-height:84vh;overflow:auto;background:linear-gradient(160deg,#1c1917,#292524 60%,#14532d);border:2px solid #fde68a88;border-radius:20px;padding:18px 20px;color:#fff;box-shadow:0 20px 60px #000c}
.x14iP h2{margin:0 0 8px;font:28px 'Luckiest Guy',Impact;color:#fde68a;text-shadow:0 3px 0 #000;letter-spacing:1px}
.x14iP .sub{color:#d6d3d1;font-weight:600;margin-bottom:10px}
.x14iG{display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px}
.x14iI{background:#0006;border:1px solid #ffffff22;border-radius:14px;padding:10px;text-align:center}
.x14iI .e{font-size:34px}.x14iI .n{font-weight:700;color:#fef3c7}.x14iI small{color:#a8a29e;display:block;margin:2px 0 6px}
.x14iI button,.x14iP .act{border:0;border-radius:10px;padding:6px 12px;background:#f59e0b;color:#1c1300;font:15px 'Luckiest Guy',Impact;cursor:pointer}
.x14iI button:disabled{background:#57534e;color:#a8a29e;cursor:default}
.x14iP .x{float:right;background:#ef4444;color:#fff;border:0;border-radius:10px;padding:5px 10px;font:15px 'Luckiest Guy',Impact;cursor:pointer}
.x14iP table{width:100%;border-collapse:collapse}.x14iP td{padding:4px 6px;border-bottom:1px solid #ffffff14}
#x14iFlash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:19;transition:opacity .5s}
#x14iCd{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);font:90px 'Luckiest Guy',Impact;color:#fde68a;text-shadow:0 6px 0 #000;z-index:19;pointer-events:none}
#x14iTour{position:absolute;left:50%;top:60px;transform:translateX(-50%);background:linear-gradient(90deg,#0e7490ee,#155e75ee);border:1px solid #67e8f9;border-radius:14px;padding:6px 16px;font:700 16px Rajdhani;display:none;z-index:3}
`;document.head.appendChild(css);

// ---------- állapot ----------
const st={deco:LS('Deco',[]),bed:LS('Bed',[null,null,null]),lb:LS('LB',[]),rare:LS('Rare',{}),photos:LS('Photos',[]),taste:LS('Taste',{w:0,n:0}),hour:null};
const saveAll=()=>{LW('Deco',st.deco);LW('Bed',st.bed);LW('LB',st.lb);LW('Rare',st.rare);LW('Photos',st.photos);LW('Taste',st.taste)};
let SC=null,RR=null,CC=null,T=0,inited=false;
const G={};// meshes
const MS=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o||{}));
function add(o,x,y,z){o.position.set(x,y,z);SC.add(o);o.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true}});return o}
function glowTex(){if(G.gt)return G.gt;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.3,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return G.gt=new THREE.CanvasTexture(c)}
function glow(c,s,o){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:c,transparent:true,opacity:o||.8,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(s,s,1);return sp}
const near=(x,z,r)=>{const m=ME();return m&&Math.hypot(m.x-x,m.z-z)<r};

// ---------- 1. padok / székek + 4. tábortűz-rönkök ----------
const SPOTS={bed:{x:5,z:-11.6},photo:{x:12.3,z:-4.6},taste:{x:8.6,z:5.6},dock:{x:-2.6,z:6.2}};
function buildSeats(){const SE=CS().SEATS;const wood=MS(0x8b5a2b),wood2=MS(0x5b3a1e);
 // nyugágyak (adirondack) – a közép felé néznek
 [[9.6,-.6],[9.4,1.6],[-12.2,3.6]].forEach(([x,z])=>{const ry=Math.atan2(-x,-z);const g=new THREE.Group();
  for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.9,.06,.14),wood);s.position.set(0,.5,-.3+i*.16);g.add(s)}
  for(let i=0;i<5;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.15,.9,.05),wood);s.position.set(-.34+i*.17,.95,-.5);s.rotation.x=-.35;g.add(s)}
  [-.5,.5].forEach(dx=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.14,.05,.85),wood2);a.position.set(dx,.75,-.05);g.add(a);[-.35,.3].forEach(dz=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.07,.75,.07),wood2);l.position.set(dx,.37,dz);g.add(l)})});
  const cu=new THREE.Mesh(new THREE.BoxGeometry(.82,.1,.6),MS(0x0ea5e9,{roughness:1}));cu.position.set(0,.57,0);g.add(cu);
  g.rotation.y=ry+Math.PI;add(g,x,0,z);SE.push({x,z,y:.62,ry,k:'nyugágy'})});
 // rönkpadok a tábortűz körül
 [0,Math.PI].forEach(a=>{const x=Math.cos(a)*2.35,z=Math.sin(a)*2.35;const l=new THREE.Mesh(new THREE.CylinderGeometry(.28,.3,1.3,12),MS(0x6b4423,{roughness:1}));l.rotation.z=Math.PI/2;const g=new THREE.Group();g.add(l);const ring=new THREE.Mesh(new THREE.CircleGeometry(.27,12),MS(0xd6b07a));ring.position.x=.66;ring.rotation.y=Math.PI/2;g.add(ring);g.rotation.y=a+Math.PI/2;add(g,x,.28,z);SE.push({x,z,y:.55,ry:Math.atan2(-x,-z),k:'rönkpad a tűznél'})});
}

// ---------- 4. tábortűz-szikrák ----------
const SPK=[];function buildSparks(){const g=new THREE.SphereGeometry(.03,4,3);for(let i=0;i<60;i++){const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true}));m.visible=false;SC.add(m);SPK.push({m,t:9,v:new THREE.Vector3()})}}
let crackT=0;function sparkTick(dt){crackT-=dt;if(crackT<=0){crackT=.6+Math.random()*2.2;// pattanás
  const n=4+Math.random()*10|0;let k=0;for(const s of SPK){if(s.t<1.6)continue;s.t=0;s.m.visible=true;s.m.position.set((Math.random()-.5)*.4,.9,(Math.random()-.5)*.4);s.v.set((Math.random()-.5)*2.4,2+Math.random()*2.5,(Math.random()-.5)*2.4);if(++k>=n)break}
  if(near(0,0,9))crackle()}
 for(const s of SPK){if(!s.m.visible)continue;s.t+=dt;s.v.y-=2.2*dt;s.m.position.addScaledVector(s.v,dt);s.m.material.opacity=Math.max(0,1-s.t/1.5);if(s.t>1.5||s.m.position.y<.2)s.m.visible=false}}
let AC=null;function crackle(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const d=.05+Math.random()*.06,b=AC.createBuffer(1,AC.sampleRate*d,AC.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,3);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type='highpass';f.frequency.value=1200;const g=AC.createGain();g.gain.value=.08+Math.random()*.08;s.connect(f);f.connect(g);g.connect(AC.destination);s.start()}catch(e){}}

// ---------- 2. kertészkedés ----------
const PL=[{k:'tulip',n:'Tulipán',e:'🌷',c:0xef4444,cost:800,t:90,pay:2600},{k:'sun',n:'Napraforgó',e:'🌻',c:0xfacc15,cost:1500,t:150,pay:5200},{k:'rose',n:'Rózsa',e:'🌹',c:0xbe123c,cost:3000,t:240,pay:11000},{k:'mint',n:'Tea-menta',e:'🌿',c:0x4ade80,cost:600,t:60,pay:1900},{k:'lotus',n:'Holdlótusz',e:'🪷',c:0xf0abfc,cost:6000,t:420,pay:24000}];
const PLk=k=>PL.find(p=>p.k===k);
function buildBed(){const {x,z}=SPOTS.bed;const g=new THREE.Group();const fr=MS(0x78350f);
 const soil=new THREE.Mesh(new THREE.BoxGeometry(3.6,.25,1.2),MS(0x3f2a1a,{roughness:1}));soil.position.y=.2;g.add(soil);
 [[0,.2,.65,3.8,.35,.1],[0,.2,-.65,3.8,.35,.1],[1.9,.2,0,.1,.35,1.3],[-1.9,.2,0,.1,.35,1.3]].forEach(a=>{const b=new THREE.Mesh(new THREE.BoxGeometry(a[3],a[4],a[5]),fr);b.position.set(a[0],a[1],a[2]);g.add(b)});
 const sg=new THREE.Mesh(new THREE.BoxGeometry(1.1,.5,.06),MS(0xfef3c7));sg.position.set(0,.75,-.8);g.add(sg);
 g.rotation.y=Math.atan2(-x,-z)+Math.PI;add(g,x,0,z);G.bed=g;G.plants=[null,null,null];
 // öntözőkanna
 const can=new THREE.Mesh(new THREE.CylinderGeometry(.14,.16,.3,12),MS(0x16a34a,{metalness:.4,roughness:.4}));can.position.set(2.2,.15,.2);g.add(can)}
function plantMesh(i){const g=G.bed;if(G.plants[i]){g.remove(G.plants[i]);G.plants[i]=null}const b=st.bed[i];if(!b)return;const p=PLk(b.k);const pr=growth(b);
 const m=new THREE.Group();const s=.25+pr*.75;const stem=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.8,6),MS(0x15803d));stem.position.y=.4;m.add(stem);
 for(let j=0;j<2;j++){const lf=new THREE.Mesh(new THREE.SphereGeometry(.12,6,4),MS(0x22c55e));lf.scale.set(1.4,.3,.6);lf.position.set(j?.12:-.12,.3,0);m.add(lf)}
 if(pr>=.5){const fl=new THREE.Mesh(new THREE.IcosahedronGeometry(pr>=1?.2:.12,0),MS(p.c,{emissive:p.c,emissiveIntensity:pr>=1?.45:.1}));fl.position.y=.85;m.add(fl);if(pr>=1){const gl=glow(p.c,.9,.5);gl.position.y=.85;m.add(gl);m.userData.ripe=1}}
 m.scale.setScalar(s);m.position.set(-1.15+i*1.15,.32,0);g.add(m);G.plants[i]=m}
function growth(b){if(!b)return 0;const p=PLk(b.k);const eff=(Date.now()-b.at)/1000*(b.w?1.6:1);return Math.min(1,eff/p.t)}
let bedRefresh=0;function bedTick(dt){bedRefresh-=dt;if(bedRefresh>0)return;bedRefresh=2;for(let i=0;i<3;i++){const g=G.plants[i];const pr=growth(st.bed[i]);const k=pr>=1?2:pr>=.5?1:0;if(!g&&st.bed[i]||g&&g.userData.st!==k){plantMesh(i);if(G.plants[i])G.plants[i].userData.st=k}if(G.plants[i]&&pr>=1)G.plants[i].rotation.y+=.3}}
function openGarden(){const rows=st.bed.map((b,i)=>{if(!b)return `<div class="x14iI"><div class="e">🟫</div><div class="n">${i+1}. ágyás – üres</div><small>Válassz magot:</small>${PL.map(p=>`<button data-pl="${i}|${p.k}" style="margin:2px">${p.e} ${fm(p.cost)}</button>`).join('')}</div>`;
  const p=PLk(b.k),pr=growth(b),left=Math.max(0,Math.ceil(p.t*(1-pr)/(b.w?1.6:1)));
  return `<div class="x14iI"><div class="e">${pr>=1?p.e:pr>=.5?'🌱':'🌰'}</div><div class="n">${p.n} – ${Math.round(pr*100)}%</div><small>${pr>=1?'Szüretelhető! '+fm(p.pay):'Még ~'+left+' mp'}${b.w?' · 💧 öntözve':''}</small>${pr>=1?`<button data-hv="${i}">🧺 SZÜRET</button>`:`<button data-wt="${i}" ${b.w?'disabled':''}>💧 ÖNTÖZÉS</button>`}</div>`}).join('');
 modal(`<h2>🌷 VIRÁGÁGYÁSOD</h2><div class="sub">Ültess, öntözz (×1,6 gyorsabb), aztán szüretelj – a virágot a teaház felvásárolja.</div><div class="x14iG">${rows}</div>`,el=>{
  el.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{const [i,k]=b.dataset.pl.split('|');const p=PLk(k);if(!pay(p.cost)){hint('Nincs elég pénzed!');return}st.bed[+i]={k,at:Date.now(),w:0};saveAll();plantMesh(+i);snd('coin');bubble(ME(),'🌱 Elültettem: '+p.n,3);act('plant|'+p.e);openGarden()});
  el.querySelectorAll('[data-wt]').forEach(b=>b.onclick=()=>{const i=+b.dataset.wt,bb=st.bed[i];const pr=growth(bb);bb.w=1;bb.at=Date.now()-pr*PLk(bb.k).t*1000/1.6;saveAll();snd('magic');bubble(ME(),'💧 *öntöz*',2);droplets();openGarden()});
  el.querySelectorAll('[data-hv]').forEach(b=>b.onclick=()=>{const i=+b.dataset.hv,p=PLk(st.bed[i].k);st.bed[i]=null;saveAll();plantMesh(i);const bonus=decoBonus();const v=Math.round(p.pay*(1+bonus));gain(v);snd('win');bubble(ME(),'🧺 '+p.e+' szüret! +'+fm(v),3.5);logL('Szüret: '+p.n+' → <b>'+fm(v)+'</b>'+(bonus?' (dekor-bónusz +'+Math.round(bonus*100)+'%)':''));act('harv|'+p.e);openGarden()})})}
function droplets(){const {x,z}=SPOTS.bed;for(let i=0;i<20;i++){const s=SPK.find(q=>!q.m.visible);if(!s)break;s.t=.5;s.m.visible=true;s.m.material.color.set(0x7dd3fc);s.m.position.set(x+(Math.random()-.5)*3,1.4,z+(Math.random()-.5));s.v.set(0,-1,0);setTimeout(()=>s.m.material.color.set(0xffd27a),1100)}}

// ---------- 3. teaház-bolt: dekoráció ----------
const DECO=[{k:'gnome',n:'Kerti törpe',e:'🧙',cost:15000,b:.03},{k:'fount',n:'Kőszökőkút',e:'⛲',cost:60000,b:.08},{k:'arch',n:'Virágív',e:'🌸',cost:40000,b:.06},{k:'chime',n:'Szélcsengő',e:'🎐',cost:20000,b:.03},{k:'bonsai',n:'Bonszai',e:'🌳',cost:35000,b:.05},{k:'buddha',n:'Kőoroszlán',e:'🦁',cost:90000,b:.1},{k:'torii',n:'Kapu-ív',e:'⛩️',cost:150000,b:.12},{k:'lamp',n:'Arany lampionfa',e:'🏮',cost:50000,b:.06}];
const DSLOT=[[-13,5.5],[12.8,6.6],[-1.2,13.2],[-13.2,-8.4],[6.8,-13.1],[13.5,-1.8],[-7,-12.6],[2.2,-13.6]];
const decoBonus=()=>st.deco.reduce((a,k)=>a+((DECO.find(d=>d.k===k)||{}).b||0),0);
function decoMesh(k){const g=new THREE.Group();const stone=MS(0x9ca3af),gold=MS(0xfbbf24,{metalness:.7,roughness:.3});
 if(k==='gnome'){const b=new THREE.Mesh(new THREE.ConeGeometry(.3,.6,12),MS(0x2563eb));b.position.y=.3;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),MS(0xfcd9b6));h.position.y=.7;g.add(h);const c=new THREE.Mesh(new THREE.ConeGeometry(.2,.45,12),MS(0xdc2626));c.position.y=1;g.add(c);const bd=new THREE.Mesh(new THREE.ConeGeometry(.14,.3,10),MS(0xf8fafc));bd.rotation.x=Math.PI;bd.position.set(0,.55,.12);g.add(bd)}
 else if(k==='fount'){const b=new THREE.Mesh(new THREE.CylinderGeometry(.9,1,.4,20),stone);b.position.y=.2;g.add(b);const w=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.05,20),MS(0x38bdf8,{transparent:true,opacity:.75,roughness:.1}));w.position.y=.38;g.add(w);const c=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1,10),stone);c.position.y=.8;g.add(c);const t=new THREE.Mesh(new THREE.CylinderGeometry(.4,.2,.18,16),stone);t.position.y=1.3;g.add(t);g.userData.fount=1}
 else if(k==='arch'){const a=new THREE.Mesh(new THREE.TorusGeometry(1.1,.08,8,24,Math.PI),MS(0x166534));a.position.y=1.1;g.add(a);[-1.1,1.1].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1.1,8),MS(0x166534));p.position.set(x,.55,0);g.add(p)});for(let i=0;i<14;i++){const a2=i/13*Math.PI,f=new THREE.Mesh(new THREE.SphereGeometry(.11,6,5),MS([0xf9a8d4,0xfde68a,0xffffff][i%3],{emissive:0xf472b6,emissiveIntensity:.15}));f.position.set(Math.cos(a2)*1.1,1.1+Math.sin(a2)*1.1,0);g.add(f)}}
 else if(k==='chime'){const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,2.2,6),MS(0x78350f));p.position.y=1.1;g.add(p);const arm=new THREE.Mesh(new THREE.BoxGeometry(.6,.04,.04),MS(0x78350f));arm.position.set(.3,2.15,0);g.add(arm);g.userData.tubes=[];for(let i=0;i<5;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.3+i*.06,6),gold);t.geometry.translate(0,-(.15+i*.03),0);t.position.set(.1+i*.1,2.1,0);g.add(t);g.userData.tubes.push(t)}}
 else if(k==='bonsai'){const pot=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.5),MS(0x7c2d12));pot.position.y=.15;g.add(pot);const tr=new THREE.Mesh(new THREE.CylinderGeometry(.05,.09,.6,6),MS(0x57361e));tr.position.y=.55;tr.rotation.z=.4;g.add(tr);[[-.1,.85,0,.3],[.25,.75,.1,.22],[-.3,.7,-.05,.2]].forEach(a=>{const f=new THREE.Mesh(new THREE.IcosahedronGeometry(a[3],0),MS(0x15803d));f.position.set(a[0],a[1],a[2]);f.scale.y=.6;g.add(f)})}
 else if(k==='buddha'){const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.5,.7),stone);b.position.y=.25;g.add(b);const bo=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),stone);bo.scale.set(1,1.1,1.3);bo.position.y=.8;g.add(bo);const hd=new THREE.Mesh(new THREE.SphereGeometry(.26,12,10),stone);hd.position.set(0,1.2,.25);g.add(hd);const mn=new THREE.Mesh(new THREE.TorusGeometry(.26,.08,6,16),stone);mn.position.set(0,1.2,.2);g.add(mn)}
 else if(k==='torii'){const red=MS(0xdc2626,{roughness:.5});[-1,1].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.11,.13,2.6,10),red);p.position.set(x,1.3,0);g.add(p)});const t1=new THREE.Mesh(new THREE.BoxGeometry(2.9,.18,.3),MS(0x1c1917));t1.position.y=2.7;g.add(t1);const t2=new THREE.Mesh(new THREE.BoxGeometry(2.4,.12,.2),red);t2.position.y=2.25;g.add(t2)}
 else if(k==='lamp'){const tr=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,2.2,8),MS(0x57361e));tr.position.y=1.1;g.add(tr);for(let i=0;i<6;i++){const a=i/6*6.283,l=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),MS(0xf59e0b,{emissive:0xf59e0b,emissiveIntensity:.9}));l.position.set(Math.cos(a)*.5,1.8+Math.sin(i)*.2,Math.sin(a)*.5);g.add(l);const gl=glow(0xffb347,.7,.7);gl.position.copy(l.position);g.add(gl)}}
 return g}
G.deco={};function placeDeco(){st.deco.forEach((k,i)=>{if(G.deco[k]||!DSLOT[i])return;const [x,z]=DSLOT[i];const m=decoMesh(k);m.rotation.y=Math.atan2(-x,-z);add(m,x,0,z);G.deco[k]=m})}
function openShop(){const items=DECO.map(d=>{const own=st.deco.includes(d.k);return `<div class="x14iI"><div class="e">${d.e}</div><div class="n">${d.n}</div><small>+${Math.round(d.b*100)}% szüret- és kóstolóbónusz</small><button data-bd="${d.k}" ${own||money()<d.cost?'disabled':''}>${own?'✔ A KERTBEN':fm(d.cost)}</button></div>`}).join('');
 modal(`<h2>🏮 TEAHÁZ-BOLT</h2><div class="sub">Dekoráció a saját kertedbe · pénzed: <b style="color:#fde68a">${fm(money())}</b> · bónusz most: +${Math.round(decoBonus()*100)}%</div><div class="x14iG">${items}</div>`,el=>{
  el.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>{const d=DECO.find(q=>q.k===b.dataset.bd);if(st.deco.includes(d.k)||!pay(d.cost))return;st.deco.push(d.k);saveAll();placeDeco();snd('win');logL('Új dekoráció a kertben: '+d.e+' '+d.n);act('deco|'+d.e);openShop()})})}

// ---------- 5. ritka halak + horgászverseny ----------
const RARE=[['Jáde sárkányhal',3,6,18],['Aranyuszonyú császárhal',3,4,14],['Ködfátyol-angolna',2,2,7],['Holdkő-pisztráng',2,1.5,6],['Lampionhal 🏮',3,.8,3],['Kristálykoi 💎',3,2,8]];
let lastBub='',tour=null;
function catchWatch(){const m=ME();if(!m)return;const b=m.bub||'';if(b===lastBub)return;lastBub=b;if(!b.startsWith('🐟 '))return;
 let name=b.slice(2).split(' – ')[0].trim(),kg=0;const mm=b.match(/–\s*([\d\s.,]+)\s*kg/);if(mm)kg=parseFloat(mm[1].replace(/\s/g,'').replace(',','.'))||0;
 // ritka hal esély (lampionok éjjel növelik)
 if(Math.random()<(isNight()?.16:.1)){const r=RARE[Math.random()*RARE.length|0];kg=+(r[2]+Math.random()*(r[3]-r[2])).toFixed(2);name=r[0];const rec=st.rare[name]||{n:0,best:0};rec.n++;rec.best=Math.max(rec.best,kg);st.rare[name]=rec;
  const v=Math.round(kg*1800*(1+decoBonus()));gain(v);setTimeout(()=>{bubble(m,'✨ RITKA FOGÁS: '+name+' – '+kg.toLocaleString('hu-HU')+' kg!',4.5);lastBub=m.bub;logL('<b style="color:#f0abfc">RITKA hal:</b> '+name+' ('+kg+' kg) +'+fm(v));act('rare|'+name.slice(0,18))},50);snd('win')}
 if(tour&&kg>0){tour.tot+=kg;tour.n++;tour.best=Math.max(tour.best,kg)}saveAll()}
function startTour(){if(tour){hint('Már fut egy verseny!');return}tour={t:180,tot:0,n:0,best:0};const el=document.getElementById('x14iTour');el.style.display='block';hint('🏆 Horgászverseny indul! 3 perc – a legnagyobb össztömeg nyer.');logL('Horgászverseny indult – 3 perc!');act('tour');snd('magic')}
function tourTick(dt){if(!tour)return;tour.t-=dt;const el=document.getElementById('x14iTour');el.textContent='🏆 HORGÁSZVERSENY · '+Math.ceil(tour.t)+' mp · '+tour.n+' hal · '+tour.tot.toFixed(2)+' kg';
 if(tour.t<=0){el.style.display='none';const r={n:myName(),kg:+tour.tot.toFixed(2),c:tour.n,best:tour.best,d:new Date().toLocaleDateString('hu-HU')};st.lb.push(r);st.lb.sort((a,b)=>b.kg-a.kg);st.lb=st.lb.slice(0,10);const pos=st.lb.indexOf(r)+1;const prize=Math.round(r.kg*900);if(prize)gain(prize);saveAll();tour=null;logL('Verseny vége: '+r.kg+' kg, helyezés: '+(pos||'-')+'. · +'+fm(prize));openLB(pos)}}
function openLB(pos){const bots=[{n:'Öreg Halász Béla',kg:14.2},{n:'Csalis Kati',kg:9.6},{n:'Horog Hugó',kg:6.1}];const all=st.lb.concat(bots.map(b=>Object.assign({bot:1,c:'–',d:'–'},b))).sort((a,b)=>b.kg-a.kg).slice(0,12);
 const rare=Object.keys(st.rare).length?Object.entries(st.rare).map(([k,v])=>`<tr><td>✨ ${k}</td><td>${v.n}×</td><td>${v.best} kg</td></tr>`).join(''):'<tr><td colspan=3 style="color:#a8a29e">Még nincs ritka fogásod – éjjel (lampionfénynél) gyakrabban jönnek!</td></tr>';
 modal(`<h2>🎣 HORGÁSZ-RANGLISTA</h2><div class="sub">${pos?'A helyezésed: <b style="color:#fde68a">'+pos+'.</b> · ':''}Helyi ranglista – 3 perces versenyek össztömege</div>
 <table>${all.map((r,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||i+1+'.'}</td><td>${r.bot?'🤖 ':''}${r.n}</td><td>${r.c} hal</td><td><b>${r.kg} kg</b></td><td style="color:#a8a29e">${r.d}</td></tr>`).join('')}</table>
 <h2 style="font-size:20px;margin-top:12px">✨ RITKA HALAK (${Object.keys(st.rare).length}/${RARE.length})</h2><table>${rare}</table><div style="text-align:center;margin-top:10px"><button class="act" id="x14iTS">🏆 VERSENY INDÍTÁSA (3 perc)</button></div>`,el=>{el.querySelector('#x14iTS').onclick=()=>{closeModal();startTour()}})}

// ---------- 6. csónak ----------
const POND={x:-6,z:7,r:2.45};let boat=null;G.oboats={};
function boatMesh(){const g=new THREE.Group();const hull=new THREE.Mesh(new THREE.SphereGeometry(.7,16,8,0,Math.PI*2,Math.PI/2,Math.PI/2),MS(0xb45309,{side:THREE.DoubleSide}));hull.scale.set(.75,.5,1.5);hull.position.y=.32;g.add(hull);const rim=new THREE.Mesh(new THREE.TorusGeometry(.7,.05,6,20),MS(0x78350f));rim.scale.set(.75,1.5,1);rim.rotation.x=Math.PI/2;rim.position.y=.32;g.add(rim);const seat=new THREE.Mesh(new THREE.BoxGeometry(.9,.05,.25),MS(0x92400e));seat.position.y=.3;g.add(seat);
 [-1,1].forEach(s=>{const o=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,1.2),MS(0x78350f));o.position.set(s*.6,.38,0);o.rotation.y=s*.5;g.add(o);g.userData['o'+s]=o});return g}
function buildDock(){const {x,z}=SPOTS.dock;const g=new THREE.Group();const pl=new THREE.Mesh(new THREE.BoxGeometry(1.4,.12,1.8),MS(0x92400e));pl.position.y=.12;g.add(pl);[[-.6,-.8],[.6,-.8],[-.6,.8],[.6,.8]].forEach(([a,b])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.6,6),MS(0x57361e));p.position.set(a,.2,b);g.add(p)});g.rotation.y=Math.atan2(POND.x-x,POND.z-z);add(g,x,0,z);
 G.pboat=boatMesh();add(G.pboat,POND.x+2.1,0,POND.z-.6)}
function toggleBoat(){const m=ME();if(!m)return;if(boat){boat=null;m.x=m.tx=SPOTS.dock.x+.6;m.z=m.tz=SPOTS.dock.z-.4;G.pboat.position.set(POND.x+2.1,0,POND.z-.6);hint('⚓ Kikötöttél.');act('boat|0');return}
 if(!near(SPOTS.dock.x,SPOTS.dock.z,2.6)&&!near(POND.x,POND.z,4.4)){hint('Menj a stéghez a tó mellett! 🚣');return}boat={x:POND.x+1.6,z:POND.z-.4,ry:m.ry,ph:0};m.sit=-1;hint('🚣 Evezz WASD-vel · B / gomb: kikötés');act('boat|1');snd('magic')}
function boatTick(dt,t){const m=ME();if(G.pboat&&!boat){G.pboat.position.y=Math.sin(t*1.3)*.03;G.pboat.rotation.z=Math.sin(t)*.04}
 if(!boat||!m)return;if(m.mv){boat.ry=m.ry;boat.x+=Math.sin(boat.ry)*2.2*dt;boat.z+=Math.cos(boat.ry)*2.2*dt;boat.ph+=dt*6}
 const d=Math.hypot(boat.x-POND.x,boat.z-POND.z);if(d>POND.r-.6){const k=(POND.r-.6)/d;boat.x=POND.x+(boat.x-POND.x)*k;boat.z=POND.z+(boat.z-POND.z)*k}
 m.x=m.tx=boat.x;m.z=m.tz=boat.z;m.ry=boat.ry;m.mv=false;m.sit=-1;G.pboat.position.set(boat.x,Math.sin(t*1.5)*.03-.05,boat.z);G.pboat.rotation.y=boat.ry;G.pboat.rotation.z=Math.sin(t*1.2)*.05;
 [-1,1].forEach(s=>{const o=G.pboat.userData['o'+s];o.rotation.x=Math.sin(boat.ph)*.5});if(online()){boatTick._s=(boatTick._s||0)+dt;if(boatTick._s>.05){boatTick._s=0;try{KR.wsend({t:'cs_pos',x:+boat.x.toFixed(2),z:+boat.z.toFixed(2),ry:+boat.ry.toFixed(2),mv:false})}catch(e){}}}}
function otherBoats(t){const P=CS().P;Object.keys(G.oboats).forEach(n=>{const p=P['u_'+n],b=G.oboats[n];if(!p){SC.remove(b);delete G.oboats[n];return}b.position.set(p.x,Math.sin(t*1.5)*.03-.05,p.z);b.rotation.y=p.ry;p.m.position.y=.1})}

// ---------- 7. madarak, pillangók, szentjánosbogarak ----------
const AMB=[];function buildAmbient(){const wingG=new THREE.PlaneGeometry(.18,.14);wingG.translate(.09,0,0);
 for(let i=0;i<10;i++){const g=new THREE.Group();const c=[0xf472b6,0xfacc15,0x60a5fa,0xffffff,0xfb923c][i%5];const mt=new THREE.MeshStandardMaterial({color:c,side:THREE.DoubleSide,emissive:c,emissiveIntensity:.25});const l=new THREE.Mesh(wingG,mt),r=new THREE.Mesh(wingG,mt);r.scale.x=-1;g.add(l,r);g.rotation.x=-Math.PI/2.4;SC.add(g);AMB.push({k:'b',g,l,r,cx:(Math.random()-.5)*20,cz:(Math.random()-.5)*20,ph:Math.random()*9})}
 const bwG=new THREE.PlaneGeometry(.5,.16);bwG.translate(.25,0,0);for(let i=0;i<6;i++){const g=new THREE.Group();const mt=new THREE.MeshStandardMaterial({color:0x334155,side:THREE.DoubleSide});const body=new THREE.Mesh(new THREE.SphereGeometry(.1,6,5),mt);body.scale.z=2;const l=new THREE.Mesh(bwG,mt),r=new THREE.Mesh(bwG,mt);r.scale.x=-1;l.rotation.x=r.rotation.x=-Math.PI/2;g.add(body,l,r);SC.add(g);AMB.push({k:'v',g,l,r,rad:9+Math.random()*12,h:9+Math.random()*6,sp:.15+Math.random()*.12,ph:Math.random()*6})}
 for(let i=0;i<30;i++){const s=glow(0xd9f99d,.35,.9);SC.add(s);AMB.push({k:'f',g:s,cx:(Math.random()-.5)*26,cz:(Math.random()-.5)*26,ph:Math.random()*9})}}
function ambTick(t,night){for(const a of AMB){if(a.k==='b'){a.g.visible=!night||a.ph<3;const x=a.cx+Math.sin(t*.4+a.ph)*3+Math.sin(t*1.3+a.ph)*.6,z=a.cz+Math.cos(t*.33+a.ph)*3;a.g.position.set(x,.9+Math.sin(t*2+a.ph)*.35,z);a.g.rotation.z=t*.4+a.ph;const f=Math.sin(t*16+a.ph)*1.1;a.l.rotation.y=f;a.r.rotation.y=-f}
 else if(a.k==='v'){const an=t*a.sp+a.ph;a.g.position.set(Math.cos(an)*a.rad,a.h+Math.sin(t+a.ph)*.6,Math.sin(an)*a.rad);a.g.rotation.y=-an;const f=Math.sin(t*7+a.ph)*.6;a.l.rotation.z=f;a.r.rotation.z=-f}
 else{a.g.visible=night;if(night){a.g.position.set(a.cx+Math.sin(t*.3+a.ph)*1.5,.6+Math.sin(t*.8+a.ph)*.5+1,a.cz+Math.cos(t*.25+a.ph)*1.5);a.g.material.opacity=.4+.5*Math.max(0,Math.sin(t*2.2+a.ph))}}}}

// ---------- 8. fotófal ----------
function buildPhoto(){const {x,z}=SPOTS.photo;const g=new THREE.Group();const c=document.createElement('canvas');c.width=512;c.height=320;const q=c.getContext('2d');const gr=q.createLinearGradient(0,0,512,320);gr.addColorStop(0,'#fb7185');gr.addColorStop(.5,'#f59e0b');gr.addColorStop(1,'#14532d');q.fillStyle=gr;q.fillRect(0,0,512,320);q.font='bold 46px Impact';q.textAlign='center';q.fillStyle='#fff';q.shadowColor='#000';q.shadowBlur=8;q.fillText('🫖 TEAKERT',256,120);q.font='bold 28px Arial';q.fillText('csoportkép-pont · mosolyogj!',256,180);for(let i=0;i<40;i++){q.fillStyle='rgba(255,255,255,.5)';q.beginPath();q.arc(Math.random()*512,Math.random()*320,Math.random()*4,0,7);q.fill()}
 const tex=new THREE.CanvasTexture(c);tex.encoding=THREE.sRGBEncoding;const w=new THREE.Mesh(new THREE.BoxGeometry(4,2.5,.15),[MS(0x44403c),MS(0x44403c),MS(0x44403c),MS(0x44403c),new THREE.MeshStandardMaterial({map:tex,roughness:.6}),MS(0x44403c)]);w.position.y=1.7;g.add(w);
 [-2,2].forEach(dx=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,3,8),MS(0x1c1917));p.position.set(dx,1.5,-.1);g.add(p)});
 const tri=new THREE.Group();[0,2.1,4.2].forEach(a=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.3,5),MS(0x111827));l.position.set(Math.sin(a)*.25,.6,Math.cos(a)*.25);l.rotation.set(Math.cos(a)*.2,0,-Math.sin(a)*.2);tri.add(l)});const cam=new THREE.Mesh(new THREE.BoxGeometry(.35,.22,.2),MS(0x111827,{metalness:.5}));cam.position.y=1.3;tri.add(cam);const ln=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.12,12),MS(0x60a5fa,{metalness:.8,roughness:.2}));ln.rotation.x=Math.PI/2;ln.position.set(0,1.3,-.14);tri.add(ln);tri.position.set(0,0,4.2);tri.rotation.y=Math.PI;g.add(tri);
 g.rotation.y=Math.atan2(-x,-z);add(g,x,0,z);G.photo=g}
let shooting=0;function takePhoto(){if(shooting)return;if(!RR){hint('A kamera még bemelegszik…');return}shooting=1;act('photo');const cd=document.createElement('div');cd.id='x14iCd';document.getElementById('cs').appendChild(cd);let n=3;const m=ME();
 Object.values(CS().P).forEach(p=>{if(Math.hypot(p.x-m.x,p.z-m.z)<7){p.wave=3.5;bubble(p,'😁 Csíííz!',3)}});
 const step=()=>{cd.textContent=n||'📸';if(n--<=0){requestAnimationFrame(()=>{try{RR.render(SC,CC);const src=RR.domElement;const c=document.createElement('canvas');c.width=640;c.height=Math.round(640*src.height/src.width);const q=c.getContext('2d');q.drawImage(src,0,0,c.width,c.height);q.fillStyle='#000a';q.fillRect(0,c.height-34,c.width,34);q.fillStyle='#fde68a';q.font='bold 18px Arial';q.fillText('🫖 Teakert · '+new Date().toLocaleString('hu-HU')+' · '+Object.values(CS().P).filter(p=>Math.hypot(p.x-m.x,p.z-m.z)<7).length+' fő',12,c.height-11);
   st.photos.unshift(c.toDataURL('image/jpeg',.7));st.photos=st.photos.slice(0,6);saveAll()}catch(e){}const f=document.createElement('div');f.id='x14iFlash';document.getElementById('cs').appendChild(f);f.style.opacity=1;setTimeout(()=>f.style.opacity=0,60);setTimeout(()=>f.remove(),700);cd.remove();shooting=0;snd('coin');logL('Csoportkép elmentve a fotófalra 📸');gain(500)});return}setTimeout(step,800)};step()}
function openPhotos(){modal(`<h2>📸 FOTÓFAL</h2><div class="sub">Állj a fotófal elé a barátaiddal és nyomj E-t (vagy a gombot) – 3, 2, 1, csíz! (max 6 kép)</div><div style="text-align:center;margin-bottom:10px"><button class="act" id="x14iSnap">📸 CSOPORTKÉP MOST</button></div><div class="x14iG">${st.photos.map((p,i)=>`<div class="x14iI"><img src="${p}" style="width:100%;border-radius:8px"><a download="teakert_${i+1}.jpg" href="${p}" style="color:#fde68a;font-weight:700">⬇ letöltés</a></div>`).join('')||'<div style="color:#a8a29e">Még nincs fotód.</div>'}</div>`,el=>{el.querySelector('#x14iSnap').onclick=()=>{closeModal();takePhoto()}})}

// ---------- 9. teakóstoló ----------
const TEAS=[{n:'Zöld tea',e:'🍵',t:['füves','friss','enyhén kesernyés']},{n:'Fekete tea',e:'🫖',t:['maláta','erős','csersavas']},{n:'Jázmin tea',e:'🌼',t:['virágos','édeskés','illatos']},{n:'Menta tea',e:'🌿',t:['hűsítő','mentolos','friss']},{n:'Kamilla',e:'🌾',t:['mézes','almás','nyugtató']},{n:'Gyümölcstea',e:'🍓',t:['bogyós','savanykás','gyümölcsös']},{n:'Füstös tea',e:'🔥',t:['füstös','fenyős','tábortűz']},{n:'Oolong',e:'🍑',t:['barackos','krémes','pörkölt']},{n:'Gyömbéres tea',e:'🫚',t:['csípős','citrusos','melengető']},{n:'Matcha',e:'🟩',t:['umami','tejszínes','füves']}];
let tasting=null;function openTaste(){const pool=TEAS.slice().sort(()=>Math.random()-.5);tasting={r:0,ok:0,q:pool.slice(0,5)};tasteRound()}
function tasteRound(){const T0=tasting;if(T0.r>=5){const pr=Math.round(T0.ok*1200*(1+decoBonus()));gain(pr);st.taste.n++;st.taste.w=Math.max(st.taste.w,T0.ok);saveAll();snd(T0.ok>=4?'win':'coin');logL('Teakóstoló: '+T0.ok+'/5 → '+fm(pr));act('taste|'+T0.ok);
  modal(`<h2>🍵 KÓSTOLÓ VÉGE</h2><div class="sub" style="font-size:20px">Eredmény: <b style="color:#fde68a">${T0.ok}/5</b> · nyeremény ${fm(pr)}</div><div>${T0.ok===5?'🏅 Teamester! Az orrod aranyat ér.':T0.ok>=3?'👍 Szép munka, gyakorlott ínyenc vagy.':'🙂 Kóstolj még – a jázmin és a kamilla könnyen összekeverhető!'}</div><div style="color:#a8a29e;margin-top:6px">Legjobb: ${st.taste.w}/5 · kóstolások: ${st.taste.n}</div><div style="text-align:center;margin-top:10px"><button class="act" id="x14iAg">🔁 ÚJRA</button></div>`,el=>el.querySelector('#x14iAg').onclick=openTaste);bubble(ME(),'🍵 Kóstoló: '+T0.ok+'/5',3);return}
 const tea=T0.q[T0.r];const opts=[tea].concat(TEAS.filter(x=>x!==tea).sort(()=>Math.random()-.5).slice(0,3)).sort(()=>Math.random()-.5);
 const notes=tea.t.slice().sort(()=>Math.random()-.5);
 modal(`<h2>🍵 TEAKÓSTOLÓ · ${T0.r+1}/5</h2><div class="sub">Belekortyolsz a csészébe… Milyen ízeket érzel?</div><div style="text-align:center;font-size:54px;margin:4px 0" id="x14iCup">☕</div><div style="text-align:center;font:700 22px Rajdhani;color:#fef3c7;margin-bottom:10px">„${notes[0]}” · „${notes[1]}”<span id="x14iN3" style="opacity:.0"> · „${notes[2]}”</span></div><div class="x14iG">${opts.map((o,i)=>`<div class="x14iI"><div class="e">${o.e}</div><button data-tg="${i}">${o.n}</button></div>`).join('')}</div><div style="text-align:center;margin-top:8px"><button class="act" id="x14iHn" style="background:#64748b;color:#fff">👃 Még egy korty (tipp – csak fél pont)</button> <span style="color:#a8a29e">pont: ${T0.ok}</span></div>`,el=>{let hinted=0;
  el.querySelector('#x14iHn').onclick=()=>{hinted=1;el.querySelector('#x14iN3').style.opacity=1};
  el.querySelectorAll('[data-tg]').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.tg];const good=o===tea;if(good)T0.ok+=hinted?.5:1;b.style.background=good?'#22c55e':'#ef4444';if(!good)el.querySelectorAll('[data-tg]').forEach(x=>{if(opts[+x.dataset.tg]===tea)x.style.background='#22c55e'});snd(good?'coin':'hurt');el.querySelector('#x14iCup').textContent=good?'😋':'😖';T0.r++;setTimeout(tasteRound,900)})})}
function buildTaste(){const {x,z}=SPOTS.taste;const g=new THREE.Group();const top=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.08,24),MS(0x7c2d12,{roughness:.5}));top.position.y=.8;g.add(top);const leg=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,.8,8),MS(0x451a03));leg.position.y=.4;g.add(leg);
 const cols=[0x65a30d,0x7c2d12,0xfde047,0x10b981,0xfacc15];for(let i=0;i<5;i++){const a=i/5*6.283;const cup=new THREE.Mesh(new THREE.CylinderGeometry(.08,.06,.1,10),MS(0xf8fafc,{roughness:.3}));cup.position.set(Math.cos(a)*.5,.89,Math.sin(a)*.5);g.add(cup);const t=new THREE.Mesh(new THREE.CircleGeometry(.07,10),MS(cols[i]));t.rotation.x=-Math.PI/2;t.position.set(Math.cos(a)*.5,.935,Math.sin(a)*.5);g.add(t)}
 const sg=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.04),MS(0x14532d));sg.position.set(0,1.25,0);g.add(sg);add(g,x,0,z)}

// ---------- 10. napszak + lampionok ----------
let hourOv=null;const hourNow=()=>{if(hourOv!=null)return hourOv;const d=new Date();return d.getHours()+d.getMinutes()/60};
const isNight=()=>{const h=hourNow();return h>=19.5||h<6};
const LAMP=[];function buildLanterns(){const C=[0xef4444,0xf59e0b,0xf472b6,0xfde047,0xfb923c];const N=26;const line=[];for(let i=0;i<N;i++){const a=i/N*6.283,r=12.4;const x=Math.cos(a)*r,z=Math.sin(a)*r,y=3.3+Math.sin(i*1.7)*.15;line.push(new THREE.Vector3(x,y+.25,z));
  const c=C[i%5];const m=new THREE.Mesh(new THREE.SphereGeometry(.24,12,10),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0,roughness:.6,transparent:true,opacity:.92}));m.scale.y=1.25;const cap=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.06,8),MS(0x1c1917));cap.position.y=.32;m.add(cap);m.position.set(x,y,z);SC.add(m);const gl=glow(c,1.4,0);gl.position.copy(m.position);SC.add(gl);LAMP.push({m,gl,ph:i})}
 line.push(line[0].clone());SC.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(line),new THREE.LineBasicMaterial({color:0x111111})));
 // nappali ég-kupola + napfény
 const c=document.createElement('canvas');c.width=8;c.height=256;const q=c.getContext('2d');const g=q.createLinearGradient(0,0,0,256);g.addColorStop(0,'#3b82f6');g.addColorStop(.45,'#93c5fd');g.addColorStop(.5,'#fde7c7');g.addColorStop(1,'#e2e8f0');q.fillStyle=g;q.fillRect(0,0,8,256);const tx=new THREE.CanvasTexture(c);
 G.day=new THREE.Mesh(new THREE.SphereGeometry(190,32,16),new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide,transparent:true,opacity:0,fog:false,depthWrite:false,toneMapped:false}));SC.add(G.day);
 G.sun=new THREE.DirectionalLight(0xfff1d6,0);G.sun.position.set(20,30,10);SC.add(G.sun);G.amb=new THREE.HemisphereLight(0xdbeafe,0x6b8e4e,0);SC.add(G.amb);
 G.fog0=SC.fog?SC.fog.color.clone():null;G.fogD=SC.fog?SC.fog.density:0;}
function moodTick(t){const h=hourNow();// nappaliság 0..1 (napkelte 6-8, napnyugta 18-20)
 let d=h<6?0:h<8?(h-6)/2:h<18?1:h<20?1-(h-18)/2:0;const dusk=Math.max(0,1-Math.abs(h-19)/1.5)+Math.max(0,1-Math.abs(h-6.5)/1.2);
 G.day.material.opacity=d*.92;G.day.material.color.setRGB(1,1-dusk*.25,1-dusk*.45);G.sun.intensity=d*1.1;G.sun.color.setRGB(1,1-dusk*.3,1-dusk*.55);G.amb.intensity=d*.55;
 if(SC.fog&&G.fog0){SC.fog.color.copy(G.fog0).lerp(new THREE.Color(dusk>.3?0xf0b089:0xcfe3f5),d*.85);SC.fog.density=G.fogD*(1-d*.5)}
 const ln=1-d;LAMP.forEach(l=>{const fl=.85+Math.sin(t*3+l.ph)*.08+Math.sin(t*7.3+l.ph)*.05;l.m.material.emissiveIntensity=ln*1.4*fl;l.gl.material.opacity=ln*.75*fl;l.m.position.y+=Math.sin(t*1.1+l.ph)*.0015});
 const ck=document.getElementById('x14iClock');if(ck&&(!moodTick._c||t-moodTick._c>1)){moodTick._c=t;const hh=Math.floor(h),mm=Math.floor((h-hh)*60);ck.innerHTML=(d>.6?'☀️ Nappal':d>.05?(h<12?'🌅 Hajnal':'🌇 Alkony'):'🌙 Éjszaka · lampionok')+' · '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+(hourOv!=null?' (kézi)':'')}}
function cycleHour(){const L=[null,8,13,19,23];const i=L.indexOf(hourOv);hourOv=L[(i+1)%L.length];hint(hourOv==null?'🕰️ Valós idő':'🕰️ Napszak: '+hourOv+':00');}

// ---------- modal ----------
let MD=null;function modal(html,fn){closeModal();MD=document.createElement('div');MD.className='x14iM';MD.innerHTML='<div class="x14iP"><button class="x">✕</button>'+html+'</div>';(document.getElementById('cs')||document.body).appendChild(MD);MD.querySelector('.x').onclick=closeModal;MD.onclick=e=>{if(e.target===MD)closeModal()};MD.onpointerdown=e=>e.stopPropagation();if(fn)fn(MD)}
function closeModal(){if(MD){MD.remove();MD=null}}

// ---------- UI a Teakertben ----------
function buildUI(){const cs=document.getElementById('cs');const b=document.createElement('div');b.id='x14iBar';
 b.innerHTML='<div id="x14iClock">🕰️</div><button data-a="g">🌷 Virágágyás</button><button data-a="s">🏮 Teaház-bolt</button><button data-a="t">🍵 Teakóstoló</button><button data-a="f">🎣 Ranglista / verseny</button><button data-a="b">🚣 Csónak (B)</button><button data-a="p">📸 Fotófal</button><button data-a="h">🌗 Napszak</button>';
 b.onclick=e=>{const a=e.target.dataset&&e.target.dataset.a;if(!a)return;({g:openGarden,s:openShop,t:openTaste,f:()=>openLB(0),b:toggleBoat,p:openPhotos,h:cycleHour})[a]()};b.onpointerdown=e=>e.stopPropagation();cs.appendChild(b);
 const tr=document.createElement('div');tr.id='x14iTour';cs.appendChild(tr);
 const help=document.getElementById('csHelp');if(help)help.insertAdjacentHTML('beforeend','<br><b style="color:#86efac">E</b> ágyás/kóstoló/fotófal/bolt · <b style="color:#86efac">B</b> csónak · <b style="color:#86efac">Home</b> bővítés-menü')}
// a Teakert elnyeli a keydown-t → keypress-t figyelünk (nem állítja meg)
addEventListener('keypress',e=>{if(!isOpen()||!inited)return;if(document.activeElement&&document.activeElement.id==='csInp')return;const k=e.key.toLowerCase();
 if(k==='b'){toggleBoat();return}
 if(k==='e'){if(MD)return;if(near(SPOTS.bed.x,SPOTS.bed.z,2.6))openGarden();else if(near(SPOTS.photo.x,SPOTS.photo.z,4.8))takePhoto();else if(near(SPOTS.taste.x,SPOTS.taste.z,2.2))openTaste();else{const i=st.deco.findIndex((k2,j)=>DSLOT[j]&&near(DSLOT[j][0],DSLOT[j][1],2));if(i>=0)openShop()}}},true);
addEventListener('keydown',e=>{if(e.key!=='Home')return;if(isOpen()&&inited){if(MD)closeModal();else openMenu();e.preventDefault();return}if(!isOpen()&&window.openCommunity){openCommunity();e.preventDefault()}});
function openMenu(){modal(`<h2>🌿 TEAKERT-BŐVÍTÉS</h2><div class="sub">Minden, ami új a kertben:</div><div class="x14iG">${[['g','🌷','Virágágyás'],['s','🏮','Teaház-bolt'],['t','🍵','Teakóstoló'],['f','🎣','Horgászverseny'],['b','🚣','Csónakázás'],['p','📸','Fotófal'],['h','🌗','Napszak']].map(a=>`<div class="x14iI"><div class="e">${a[1]}</div><button data-m="${a[0]}">${a[2]}</button></div>`).join('')}</div><div style="color:#a8a29e;margin-top:8px">Új ülőhelyek: 3 nyugágy + 2 rönkpad a tábortűznél (E). Éjjel lampionok, szentjánosbogarak és több ritka hal.</div>`,el=>el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{const a=b.dataset.m;closeModal();({g:openGarden,s:openShop,t:openTaste,f:()=>openLB(0),b:toggleBoat,p:openPhotos,h:cycleHour})[a]()}))}
// tájékoztató tippek a közelben
let tipT=0;function tipTick(dt){tipT-=dt;if(tipT>0)return;tipT=.5;const h=document.getElementById('csHint');if(!h||h.style.display==='block')return;let s='';
 if(near(SPOTS.bed.x,SPOTS.bed.z,2.6))s='E – virágágyás 🌷';else if(near(SPOTS.photo.x,SPOTS.photo.z,4.8))s='E – csoportkép 📸';else if(near(SPOTS.taste.x,SPOTS.taste.z,2.2))s='E – teakóstoló 🍵';else if(!boat&&near(SPOTS.dock.x,SPOTS.dock.z,2.2))s='B – beszállás a csónakba 🚣';
 if(s){hint(s);clearTimeout(hint._t);hint._t=setTimeout(()=>h.style.display='none',700)}}

// ---------- többjátékos: cs_act a:'x14i' ----------
let hookedWs=null;function hookWs(){const a=acc();if(!a||!a.ws||a.ws===hookedWs)return;hookedWs=a.ws;a.ws.addEventListener('message',ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}if(!m||m.t!=='cs_act'||m.a!=='x14i'||!inited)return;const p=CS().P['u_'+m.name];if(!p)return;const [k,v]=String(m.v).split('|');
 if(k==='boat'){if(v==='1'&&!G.oboats[m.name]){G.oboats[m.name]=add(boatMesh(),p.x,0,p.z)}else if(v==='0'&&G.oboats[m.name]){SC.remove(G.oboats[m.name]);delete G.oboats[m.name]}}
 else if(k==='plant')bubble(p,'🌱 ültetett: '+v,3);else if(k==='harv')bubble(p,'🧺 szüret '+v,3);else if(k==='deco')bubble(p,'🏮 új dekor: '+v,3);
 else if(k==='rare'){bubble(p,'✨ RITKA: '+v,4);logL('<b>'+p.name+'</b> ritka halat fogott: '+v)}else if(k==='tour')logL('<b>'+p.name+'</b> horgászversenyt indított!');
 else if(k==='photo'){p.wave=3;bubble(p,'📸 Csoportkép! Gyere a fotófalhoz!',3);if(near(p.x,p.z,7)){const me=ME();me.wave=3.2;bubble(me,'😁 Csíz!',2.5)}}
 else if(k==='taste')bubble(p,'🍵 kóstoló: '+v+'/5',3)})}

// ---------- init + frame-hook ----------
function init(){const m=ME();if(!m||!m.m||!m.m.parent)return;SC=m.m.parent;inited=true;
 SC.onBeforeRender=(r,s,c)=>{RR=r;CC=c};
 buildSeats();buildSparks();buildBed();for(let i=0;i<3;i++)plantMesh(i);placeDeco();buildDock();buildAmbient();buildPhoto();buildTaste();buildLanterns();buildUI();
 const orig=window._csAnim;window._csAnim=function(t,dt){if(orig)orig(t,dt);try{frame(t,dt)}catch(e){if(!frame._e){frame._e=1;console.warn('x14i',e)}}};
 window._x14i={st,G,SPOTS,openGarden,openShop,openTaste,openLB,toggleBoat,takePhoto,openPhotos,cycleHour,setHour:h=>hourOv=h,get boat(){return boat},get tour(){return tour}}}
function frame(t,dt){const night=isNight();sparkTick(dt);bedTick(dt);catchWatch();tourTick(dt);boatTick(dt,t);otherBoats(t);ambTick(t,night);moodTick(t);tipTick(dt);
 Object.values(G.deco).forEach(d=>{if(d.userData.tubes)d.userData.tubes.forEach((tb,i)=>tb.rotation.z=Math.sin(t*2+i)*.15);if(d.userData.fount&&Math.random()<.3){const s=SPK.find(q=>!q.m.visible);if(s){s.t=.6;s.m.visible=true;s.m.material.color.set(0xbae6fd);d.getWorldPosition(s.m.position);s.m.position.y=1.45;s.v.set((Math.random()-.5)*.8,1.2,(Math.random()-.5)*.8);setTimeout(()=>s.m.material.color.set(0xffd27a),900)}}})}
setInterval(()=>{if(isOpen()){if(!inited)init();hookWs()}else if(inited){if(boat){boat=null}closeModal()}},400);
// lobby: közös doboz gomb
function lobbyBtn(){if(document.getElementById('x14iHub'))return;let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 const b=document.createElement('button');b.id='x14iHub';b.className='x14iBtn';b.title='Teakert – kert, csónak, kóstoló (Home)';b.textContent='🌿 Teakert+';b.onclick=()=>{if(window.openCommunity)openCommunity()};h.appendChild(b)}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',lobbyBtn);else lobbyBtn();
})();
