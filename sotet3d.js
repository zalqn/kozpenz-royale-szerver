// sotet3d.js – 🚐 Sötét Program 3D (v2): DUPLA lakókocsi (22 m) + teljesen új HI-TECH LABOR (9 megvehető, látható modul),
// kilépés a VÁROSBA: autós kiszállítás rendelésekre (O), térkép (M), 8 kerület vevőkkel, 🚓 járőrök, 🪴 virágcserepek (termesztés),
// 6 bolt (kiegészítők, kertészet, autókereskedés, labor-szaküzlet, vegyesbolt, büfé). Minden kitalált, rajzfilmes.
(()=>{
const $$=i=>document.getElementById(i);
let R=null,SC,CAM,ON=false,raf=0,yaw=Math.PI,pit=0,px=0,pz=1.5,K={},ST=[],near=null,last=0,clock=0,NPC=[],DISCO=null,PAUSE=false;
let INSIDE=true,INCAR=false,HEMI=null,MOON=null,CAR=null,CARm=null,car={x:16,z:8,h:0,v:0},POL=[],WANT=0,WCD=0,OFF=[],OFFt=0,OVL=null,BIGMAP=false,FX={},MODS={},POTS=[],DROPS=[],COL=[],mmT=0,potT=0;
window.sp3On=()=>ON;window.sp3Resume=()=>{PAUSE=false;lockP()};
const lockP=()=>{try{const r=R.domElement.requestPointerLock();r&&r.catch&&r.catch(()=>{})}catch(e){}};
const DP=()=>window._dp&&_dp();const DD=()=>{const d=DP().D;d.cargo=d.cargo||[];d.acc=d.acc||{};d.pots=d.pots||{};d.veh=d.veh||'berelt';d.lm=d.lm||{};return d};
const PL=(typeof _PL!=="undefined"?_PL:THREE.PointLight);const TL=new THREE.TextureLoader();const TC={};
const RN=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
function tex(n,rx,ry,col,o){const k=n+rx+ry+col+JSON.stringify(o||{});if(TC[k])return TC[k];const m=TL.load('tex_opt/'+n+'_diff.jpg');m.wrapS=m.wrapT=THREE.RepeatWrapping;m.anisotropy=8;m.repeat.set(rx||1,ry||1);let nm=null;try{nm=TL.load('tex_opt/'+n+'_nor.jpg');nm.wrapS=nm.wrapT=THREE.RepeatWrapping;nm.anisotropy=8;nm.repeat.set(rx||1,ry||1)}catch(e){}
 const M=new THREE.MeshStandardMaterial(Object.assign({map:m,normalMap:nm,color:col||0xffffff,roughness:.75},o||{}));TC[k]=M;return M}
const MB=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c},o||{}));const EM=(c,i)=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:i||1});
const box=(w,h,d,m,x,y,z,p)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;(p||SC).add(b);return b};
const cyl=(rt,rb,h,m,x,y,z,s,p)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,s||16),m);c.position.set(x,y,z);c.castShadow=true;(p||SC).add(c);return c};
const sph=(r,m,x,y,z,p)=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),m);s.position.set(x,y,z);(p||SC).add(s);return s};
function sprite(t,col,w){const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.fillStyle='rgba(15,23,42,.85)';x.beginPath();x.roundRect?x.roundRect(0,0,512,96,24):x.rect(0,0,512,96);x.fill();x.strokeStyle=col||'#fde047';x.lineWidth=4;x.stroke();x.fillStyle=col||'#fde047';x.font='bold 38px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(t,256,50);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(w||1.6,(w||1.6)*.19,1);s.renderOrder=9;s.userData.w=w||1.6;return s}
function sign(t,bg,fg,w,h){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,bg);g.addColorStop(1,'#0f172a');x.fillStyle=g;x.fillRect(0,0,512,128);x.strokeStyle=fg;x.lineWidth=6;x.strokeRect(4,4,504,120);x.fillStyle=fg;x.font='900 54px system-ui';x.textAlign='center';x.textBaseline='middle';x.shadowColor=fg;x.shadowBlur=18;x.fillText(t,256,66);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(c),emissive:0xffffff,emissiveMap:new THREE.CanvasTexture(c),emissiveIntensity:.9}))}
let AC=null;function beep(f,d,tp,v){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type=tp||'square';o.frequency.value=f;g.gain.value=v||.06;o.connect(g);g.connect(AC.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.2));o.stop(AC.currentTime+(d||.2))}catch(e){}}
function toast(t){try{DP().toast(t)}catch(e){}const el=$$('sp3n');if(el){el.innerHTML=t;el.style.opacity=1;clearTimeout(el._t);el._t=setTimeout(()=>el.style.opacity=0,3200)}}

// ===================== ADATOK =====================
const VEH={berelt:{n:'Bérelt Zsiga',e:'🚙',sp:13,cap:3,c:0x9ca3af,s:1},robogo:{n:'Robogó',e:'🛵',sp:15,cap:2,c:0xf97316,s:.55},gokart:{n:'Gokart',e:'🏎️',sp:20,cap:1,c:0xef4444,s:.6},auto:{n:'Rozsdás Lada',e:'🚗',sp:17,cap:4,c:0xa16207,s:1},motor:{n:'Motor',e:'🏍️',sp:24,cap:2,c:0x111827,s:.6},furgon:{n:'Furgon',e:'🚚',sp:14,cap:10,c:0xf8fafc,s:1.25},limo:{n:'Limuzin',e:'🚘',sp:22,cap:5,c:0x0f172a,s:1.3,rep:1}};
const ACB={a_pilota:{det:.25},a_maszk:{det:.45},a_sapka:{pay:.05},a_kalap:{pay:.12},a_lanc:{rep:3},a_sal:{rep:1},a_dzseki:{pay:.08},a_oltony:{pay:.18},a_sneaker:{run:.2},a_roller:{run:.4},a_hati:{cap:2},a_sport:{cap:5},a_ora:{time:40},a_kesz:{car:.12},a_tel:{ord:1},a_tel2:{ord:2,det:.15}};
const accB=()=>{const o={det:0,pay:0,rep:0,run:0,cap:0,time:0,car:0,ord:0};Object.values(DD().acc).forEach(id=>{const b=ACB[id];if(b)for(const k in b)o[k]+=b[k]});o.det=Math.min(o.det,.7);return o};
const veh=()=>{const d=DD();return VEH[d.veh]&&(d.veh==='berelt'||d.own[d.veh])?VEH[d.veh]:VEH.berelt};
const capTot=()=>2+accB().cap+veh().cap;const cargoN=()=>DD().cargo.reduce((s,c)=>s+c.n,0);
// kerületek leadási pontjai (DIS sorrendben)
const _V3=new THREE.Vector3();
const DROPPOS=[[-60,-26.5],[60,-26.5],[60,26.5],[-60,26.5],[-86.5,-60],[0,86.5],[86.5,60],[60,-86.5]];

// ===================== LABOR-KINÉZET (11-15) =====================
// Procedurális canvas-textúrák (egyszer készülnek, LT-cache), közös anyagok, InstancedMesh az ismétlődő kellékekre (üvegeszköz, lámpapanel, konzol).
// Minden felirat kitalált: nincs benne valódi anyag-, vegyszer-, személy- vagy márkanév. A sotetmg3d keverés-labor is ezt használja (window._sp3lab).
const LT={},_C=new THREE.Color();
function ct(k,w,h,fn,rep){if(LT[k])return LT[k];const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;if(rep){t.anisotropy=4;t.wrapS=t.wrapT=THREE.RepeatWrapping}return LT[k]=t}
const speck=(x,w,h,n,a,c0,c1)=>{for(let i=0;i<n;i++){const g=c0+Math.random()*(c1-c0)|0;x.fillStyle='rgba('+g+','+g+','+(g+5)+','+a+')';x.fillRect(Math.random()*w,Math.random()*h,1.6,1.6)}};
const rr=(x,a,b,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,w,h,r):x.rect(a,b,w,h)};
const TX={
 floor:()=>ct('floor',512,512,(x,w)=>{x.fillStyle='#a9b1ba';x.fillRect(0,0,w,w);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const v=219+(Math.random()*9|0);x.fillStyle='rgb('+v+','+(v+3)+','+(v+6)+')';x.fillRect(i*256+2,j*256+2,252,252)}speck(x,w,w,6000,.16,110,210)},1), // laborcsempe 2×2 (1,2 m)
 wall:()=>ct('wall',512,1024,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#f5f7f9');g.addColorStop(1,'#e8ecf0');x.fillStyle=g;x.fillRect(0,0,w,h);speck(x,w,h,3000,.05,150,200);const Y=m=>h*(1-m/2.7);
  x.fillStyle='#bfc7cf';x.fillRect(0,0,3,h);x.fillRect(0,Y(1.32),w,3);x.fillStyle='rgba(255,255,255,.9)';x.fillRect(3,0,2,h);x.fillRect(0,Y(1.32)+3,w,2);x.fillStyle='#0f766e';x.fillRect(0,Y(1.12),w,Y(1.05)-Y(1.12))},1), // laminált panel 1,2×2,7 m + vezetősáv
 ceil:()=>ct('ceil',512,512,(x,w)=>{x.fillStyle='#eef1f4';x.fillRect(0,0,w,w);speck(x,w,w,9000,.22,130,190);x.fillStyle='#cbd2da';[0,256].forEach(p=>{x.fillRect(p,0,7,w);x.fillRect(0,p,w,7)});x.fillStyle='rgba(0,0,0,.07)';[0,256].forEach(p=>{x.fillRect(p+7,0,2,w);x.fillRect(0,p+7,w,2)})},1), // álmennyezet-kazetta + T-rács
 brush:()=>ct('brush',256,256,(x,w)=>{x.fillStyle='#c9d0d7';x.fillRect(0,0,w,w);for(let i=0;i<1100;i++){const g=150+Math.random()*105|0;x.fillStyle='rgba('+g+','+g+','+(g+6)+',.22)';x.fillRect(Math.random()*w-60,Math.random()*w,30+Math.random()*160,1)}},1), // csiszolt acél
 door:()=>ct('door',512,256,(x,w,h)=>{x.fillStyle='#f1f3f5';x.fillRect(0,0,w,h);speck(x,w,h,1500,.05,150,200);[0,256].forEach(p=>{x.fillStyle='#8d97a2';x.fillRect(p,0,4,h);x.fillStyle='#fff';x.fillRect(p+4,0,2,h);const g=x.createLinearGradient(0,24,0,36);g.addColorStop(0,'#eef1f4');g.addColorStop(1,'#77828e');x.fillStyle=g;rr(x,p+68,24,120,12,6);x.fill()});x.fillStyle='#8d97a2';x.fillRect(0,0,w,3)},1), // szekrényajtók
 sub:()=>ct('sub',512,256,(x,w,h)=>{x.fillStyle='#c5ccd4';x.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let c=-1;c<8;c++){const o=c*64+(r%2?32:0),v=238+(Math.random()*12|0),g=x.createLinearGradient(0,r*32,0,r*32+32);g.addColorStop(0,'rgb('+v+','+(v+3)+','+(v+6)+')');g.addColorStop(1,'rgb('+(v-16)+','+(v-13)+','+(v-10)+')');x.fillStyle=g;x.fillRect(o+2,r*32+2,60,28)}},1), // falicsempe
 haz:()=>ct('haz',64,64,x=>{x.fillStyle='#facc15';x.fillRect(0,0,64,64);x.fillStyle='#111827';for(let i=-3;i<3;i++){x.beginPath();x.moveTo(i*32,64);x.lineTo(i*32+16,64);x.lineTo(i*32+80,0);x.lineTo(i*32+64,0);x.fill()}},1), // sárga-fekete csík
 led:()=>ct('led',256,128,(x,w,h)=>{x.fillStyle='#b9c1ca';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.fillRect(6,6,w-12,h-12);x.strokeStyle='rgba(190,205,225,.45)';x.lineWidth=1;for(let i=14;i<w-6;i+=9){x.beginPath();x.moveTo(i,7);x.lineTo(i,h-7);x.stroke()}for(let j=14;j<h-6;j+=9){x.beginPath();x.moveTo(7,j);x.lineTo(w-7,j);x.stroke()}}),
 sh:()=>ct('sh',64,64,x=>{x.filter='blur(6px)';x.fillStyle='#000';x.fillRect(13,13,38,38)}), // kontakt-árnyék
 duct:()=>ct('duct',128,128,(x,w)=>{x.fillStyle='#b8c0c8';x.fillRect(0,0,w,w);speck(x,w,w,900,.25,120,220);x.strokeStyle='rgba(70,80,92,.55)';x.lineWidth=3;for(let i=-1;i<3;i++){x.beginPath();x.moveTo(0,i*64+64);x.lineTo(w,i*64);x.stroke()}},1), // spirálkorcos légcsatorna
 grate:()=>ct('grate',64,64,x=>{x.fillStyle='#6b7280';x.fillRect(0,0,64,64);x.fillStyle='#1f2937';for(let i=6;i<60;i+=8)x.fillRect(6,i,52,4)}),
};
function labEnv(){if(LT.env)return LT.env;const f=k=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');if(k===1){x.fillStyle='#e6eaef';x.fillRect(0,0,64,64);x.fillStyle='#fff';x.fillRect(6,12,52,10);x.fillRect(6,42,52,10)}
 else if(k===2){x.fillStyle='#9aa2ab';x.fillRect(0,0,64,64)}else{const g=x.createLinearGradient(0,0,0,64);g.addColorStop(0,'#f7f9fb');g.addColorStop(.42,'#dfe4ea');g.addColorStop(.56,'#6b7480');g.addColorStop(.72,'#8f98a2');g.addColorStop(1,'#a4abb4');x.fillStyle=g;x.fillRect(0,0,64,64)}return c};
 const t=new THREE.CubeTexture([f(0),f(0),f(1),f(2),f(0),f(0)]);t.encoding=THREE.sRGBEncoding;t.needsUpdate=true;return LT.env=t} // hamis „labor” környezet a fém/üveg tükröződéshez (csak ezekre az anyagokra)
function LM(){if(LT.M)return LT.M;const e=labEnv(),S=o=>new THREE.MeshStandardMaterial(o);
 return LT.M={fl:S({map:TX.floor(),roughness:.3,envMap:e,envMapIntensity:.3}),wl:S({map:TX.wall(),roughness:.6}),ce:S({map:TX.ceil(),color:0xd9dee4,roughness:.95,emissive:0xffffff,emissiveMap:TX.ceil(),emissiveIntensity:.5}),
  st:S({map:TX.brush(),color:0xeef2f6,metalness:.65,roughness:.3,envMap:e}),sd:S({color:0xa7b0ba,metalness:.7,roughness:.35,envMap:e}),
  w:S({color:0xf3f5f7,roughness:.5}),dr:S({map:TX.door(),roughness:.45}),kk:S({color:0x4b5563,roughness:.7}),sb:S({map:TX.sub(),roughness:.18,envMap:e,envMapIntensity:.35}),
  dk:S({color:0x1f2937,roughness:.45,metalness:.25,envMap:e,envMapIntensity:.4}),lq:S({color:0xffffff,roughness:.15}),cap:S({color:0xffffff,roughness:.5}),
  gl:S({color:0xe8f6ff,transparent:true,opacity:.28,roughness:.04,metalness:.15,envMap:e,depthWrite:false,side:THREE.DoubleSide}),
  pane:S({color:0xdbeafe,transparent:true,opacity:.16,roughness:.04,metalness:.1,envMap:e,depthWrite:false}),
  led:new THREE.MeshBasicMaterial({map:TX.led()}),haz:S({map:TX.haz(),roughness:.6,polygonOffset:true,polygonOffsetFactor:-2}),
  sh:new THREE.MeshBasicMaterial({map:TX.sh(),transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),
  cu:S({color:0xc77b45,metalness:.85,roughness:.28,envMap:e}),rd:S({color:0xdc2626,roughness:.35,envMap:e,envMapIntensity:.5}),gr:S({color:0x16a34a,roughness:.4}),ye:S({color:0xfacc15,roughness:.4}),
  cb:S({color:0xd5dae0,metalness:.35,roughness:.4,envMap:e}),bl:new THREE.MeshBasicMaterial({color:0xffffff})}}
// doboz világ-léptékű UV-vel (tu/tv méter = 1 textúra-ismétlés) → egy közös anyag minden méretre
function bw(w,h,d,m,x,y,z,tu,tv,p){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv,F=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];tu=tu||1;tv=tv||tu;for(let i=0;i<24;i++){const f=F[i>>2];uv.setXY(i,uv.getX(i)*f[0]/tu,uv.getY(i)*f[1]/tv)}const b=new THREE.Mesh(g,m);b.position.set(x,y,z);(p||SC).add(b);return b}
// falhoz álló pult: zw = fal belső síkja, dir = +1 ha +z felé áll ki, -1 ha -z felé; h = munkalap teteje
function bench(x0,x1,zw,dir,h,p,sh){const M=LM(),L=x1-x0,cx=(x0+x1)/2;h=h||.94;bw(L,h-.16,.68,[M.w,M.w,M.w,M.w,M.dr,M.dr],cx,.12+(h-.16)/2,zw+dir*.34,1.2,h-.16,p);bw(L,.1,.6,M.kk,cx,.07,zw+dir*.3,1,1,p);bw(L+.02,.04,.76,M.st,cx,h-.02,zw+dir*.38,1,1,p);if(sh)sh.push([cx,zw+dir*.62,L+.15,.45])}
// vegyifülke: alsószekrény, sötét munkalap, oldalfalak, felső doboz, megvilágított belső, félig felhúzott üveg tolóablak, elszívócső
function hood(x,zw,dir,p,sh,cy){const M=LM(),W=1.3,D=.8,zc=zw+dir*D/2,ry=dir>0?0:Math.PI;cy=cy||2.6;
 bw(W,.78,D-.06,[M.w,M.w,M.w,M.w,M.dr,M.dr],x,.51,zc-dir*.03,1.2,.78,p);bw(W,.1,D-.12,M.kk,x,.07,zc-dir*.06,1,1,p);bw(W,.05,D,M.dk,x,.925,zc,1,1,p);
 bw(.06,1.4,D,M.w,x-W/2+.03,1.6,zc,1,1,p);bw(.06,1.4,D,M.w,x+W/2-.03,1.6,zc,1,1,p);bw(W,.42,D,M.w,x,2.11,zc,1,1,p);
 bw(W-.12,1.36,.02,LT.hb||(LT.hb=new THREE.MeshStandardMaterial({color:0xe2e8f0,emissive:0xf1f5f9,emissiveIntensity:.35,roughness:.6})),x,1.6,zw+dir*.03,1,1,p);bw(W-.14,.03,.05,M.bl,x,1.87,zc,1,1,p);
 bw(W-.1,.6,.012,M.gl,x,1.6,zw+dir*(D-.03),1,1,p);bw(W-.08,.04,.035,M.sd,x,1.3,zw+dir*(D-.02),1,1,p);
 cyl(.12,.12,cy-2.32,M.sd,x,(cy+2.32)/2,zw+dir*.63,16,p);plate(TXT('hood',512,128,'#0f4c55','#fff','VEGYIFÜLKE 1','900 64px system-ui'),.8,.2,p,x,2.17,zw+dir*(D+.004),ry,.35);
 bw(.12,.05,.01,LT.ok||(LT.ok=new THREE.MeshBasicMaterial({color:0x22c55e})),x+W/2-.14,1.98,zw+dir*(D+.004),1,1,p);if(sh)sh.push([x,zw+dir*.62,W+.15,.45])}
// üvegeszközök: G={fl,bk,bt,tt,cy,rack}: [x,y,z,folyadékszín,méret,forgás,kupakszín] → típusonként 1-1 InstancedMesh (folyadék + üveg + kupak)
function glassware(G,p){const M=LT.M||LM(),o=new THREE.Object3D(),V=a=>a.map(q=>new THREE.Vector2(q[0],q[1])),Cy=(a,b,h,s,open,y)=>new THREE.CylinderGeometry(a,b,h,s,1,open).translate(0,y,0);
 const GG=LT.GG||(LT.GG={fl:[new THREE.LatheGeometry(V([[0,.002],[.072,.002],[.078,.012],[.03,.13],[.023,.15],[.023,.2],[.028,.205]]),14),new THREE.LatheGeometry(V([[0,.006],[.068,.006],[.072,.014],[.045,.075],[0,.075]]),14)],
  bk:[Cy(.045,.043,.12,16,true,.06),Cy(.041,.039,.065,16,false,.036)],bt:[new THREE.LatheGeometry(V([[0,.002],[.04,.002],[.04,.11],[.024,.13],[.019,.135],[.019,.15]]),14),new THREE.LatheGeometry(V([[0,.006],[.036,.006],[.036,.108],[.022,.124],[0,.124]]),14)],
  tt:[Cy(.009,.009,.14,8,true,.07),Cy(.0075,.0075,.06,8,false,.032)],cy:[Cy(.022,.022,.27,12,true,.135),Cy(.019,.019,.13,12,false,.068)],cap:Cy(.022,.022,.03,12,false,.163),rack:new THREE.BoxGeometry(.2,.06,.07).translate(0,.03,0)});
 const mk=(geo,mat,L,col)=>{if(!L||!L.length)return;const m=new THREE.InstancedMesh(geo,mat,L.length);L.forEach((q,i)=>{o.position.set(q[0],q[1],q[2]);o.scale.setScalar(q[4]||1);o.rotation.set(0,q[5]||0,0);o.updateMatrix();m.setMatrixAt(i,o.matrix);if(col)m.setColorAt(i,_C.setHex(col(q)))});(p||SC).add(m)};
 const K=['fl','bk','bt','tt','cy'];K.forEach(k=>mk(GG[k][1],M.lq,G[k],q=>q[3]));mk(GG.cap,M.cap,G.bt,q=>q[6]||0x1e3a8a);mk(GG.rack,M.w,G.rack);K.forEach(k=>mk(GG[k][0],M.gl,G[k]))} // folyadék (átlátszatlan) előbb, üveg utána
const rackT=(G,x,y,z,cols)=>{G.rack.push([x,y,z]);for(let i=0;i<6;i++)G.tt.push([x-.075+i*.03,y+.012,z,cols[i%cols.length]])};
// ismétlődő elemek: InstancedMesh pozíció/forgatás/méret (+ opcionális szín)
function ib(geo,mat,L,p){const m=new THREE.InstancedMesh(geo,mat,L.length),o=new THREE.Object3D();L.forEach((q,i)=>{o.position.set(q[0],q[1],q[2]);o.rotation.set(0,q[3]||0,0);o.scale.set(q[4]||1,q[5]||q[4]||1,q[6]||q[4]||1);o.updateMatrix();m.setMatrixAt(i,o.matrix);if(q[7]!=null)m.setColorAt(i,_C.setHex(q[7]))});(p||SC).add(m);return m}
function leds(L,y,p){return ib(LT.ledG||(LT.ledG=new THREE.PlaneGeometry(1.2,.6).rotateX(Math.PI/2)),LM().led,L.map(([x,z])=>[x,y,z]),p)}
function decals(L,p){const m=ib(LT.shG||(LT.shG=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2)),LM().sh,L.map(([x,z,w,d])=>[x,.021,z,0,w,1,d]),p);m.renderOrder=1;return m}
// veszélycsík a padlón: szakaszok [x0,z0,x1,z1,(szélesség)] → egy összevont mesh, az u a hosszal arányos
function tape(segs,w,p){const P=[],U=[],I=[];segs.forEach(([a,b,c,d,ww],k)=>{const L=Math.hypot(c-a,d-b),s=(ww||w)/2,nx=-(d-b)/L*s,nz=(c-a)/L*s,u=L/.3;P.push(a+nx,.023,b+nz,a-nx,.023,b-nz,c+nx,.023,d+nz,c-nx,.023,d-nz);U.push(0,1,0,0,u,1,u,0);const o=k*4;I.push(o,o+2,o+1,o+1,o+2,o+3)});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();const m=new THREE.Mesh(g,LM().haz);(p||SC).add(m);return m}
const rect=(x0,z0,x1,z1,w)=>[[x0-w/2,z0,x1+w/2,z0],[x0-w/2,z1,x1+w/2,z1],[x0,z0+w/2,x0,z1-w/2],[x1,z0+w/2,x1,z1-w/2]];
// táblák, képernyők (saját canvas, cache-elve)
function plate(t,w,h,p,x,y,z,ry,em){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:t,roughness:.45,emissive:0xffffff,emissiveMap:t,emissiveIntensity:em==null?.15:em}));m.position.set(x,y,z);m.rotation.y=ry||0;(p||SC).add(m);return m}
function screen(t,w,h,x,y,z,dir,em,p){bw(w+.04,h+.04,.03,LM().dk,x,y,z,1,1,p);return plate(t,w,h,p,x,y,z+dir*.0165,dir>0?0:Math.PI,em==null?.85:em)}
const TXT=(k,w,h,bg,fg,t,f,sub)=>ct('tx_'+k,w,h,x=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.textAlign='center';x.textBaseline='middle';x.font=f;x.fillText(t,w/2,sub?h*.42:h/2+3,w-24);if(sub){x.font='700 '+Math.round(h*.11)+'px system-ui';x.fillText(sub,w/2,h*.83,w-24)}});
const SCR=(k,w,h,title,fn)=>ct('sc_'+k,w,h,x=>{x.fillStyle='#0b1220';x.fillRect(0,0,w,h);x.fillStyle='#0e7490';x.fillRect(0,0,w,40);x.fillStyle='#e0f2fe';x.font='800 24px system-ui';x.textBaseline='middle';x.fillText(title,14,21,w-28);fn(x,w,h)});
const ICO={disc:(x,c)=>{x.fillStyle=c;x.beginPath();x.arc(0,0,104,0,7);x.fill();x.fillStyle=x.strokeStyle='#fff'},sq:(x,c)=>{x.fillStyle=c;rr(x,-108,-108,216,216,18);x.fill();x.fillStyle=x.strokeStyle='#fff'},
 goggles:x=>{ICO.disc(x,'#1d5fd0');x.lineWidth=12;x.beginPath();x.moveTo(-88,-4);x.lineTo(88,-4);x.stroke();rr(x,-74,-34,66,58,20);x.fill();rr(x,8,-34,66,58,20);x.fill();x.fillStyle='#1d5fd0';rr(x,-62,-22,42,34,12);x.fill();rr(x,20,-22,42,34,12);x.fill()},
 glove:x=>{ICO.disc(x,'#1d5fd0');rr(x,-36,-8,72,74,18);x.fill();[[-34,-58],[-15,-72],[4,-72],[23,-60]].forEach(([a,b])=>{rr(x,a,b,15,74,8);x.fill()});x.save();x.translate(-34,16);x.rotate(-.75);rr(x,-8,-46,16,52,8);x.fill();x.restore();x.fillRect(-40,58,80,26)},
 coat:x=>{ICO.disc(x,'#1d5fd0');x.beginPath();[[-28,-72],[28,-72],[58,-44],[74,40],[54,46],[44,-4],[44,80],[-44,80],[-44,-4],[-54,46],[-74,40],[-58,-44]].forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.fill();x.strokeStyle='#1d5fd0';x.lineWidth=6;x.beginPath();x.moveTo(-16,-72);x.lineTo(0,-24);x.lineTo(16,-72);x.moveTo(0,-24);x.lineTo(0,78);x.stroke()},
 noentry:x=>{ICO.disc(x,'#dc2626');x.fillRect(-72,-18,144,36)},
 eye:x=>{ICO.sq(x,'#15803d');x.beginPath();x.moveTo(-74,34);x.quadraticCurveTo(0,-26,74,34);x.quadraticCurveTo(0,94,-74,34);x.fill();x.fillStyle='#15803d';x.beginPath();x.arc(0,36,22,0,7);x.fill();x.fillStyle='#fff';[-34,0,34].forEach(a=>{x.beginPath();x.moveTo(a,-84);x.quadraticCurveTo(a+18,-50,a,-40);x.quadraticCurveTo(a-18,-50,a,-84);x.fill()})},
 ext:x=>{ICO.sq(x,'#dc2626');rr(x,-30,-40,60,124,18);x.fill();x.fillRect(-12,-62,24,26);x.fillRect(-6,-76,44,12);x.lineWidth=9;x.beginPath();x.moveTo(36,-70);x.quadraticCurveTo(76,-36,52,14);x.stroke()},
 warn:x=>{x.fillStyle='#111827';x.beginPath();x.moveTo(0,-104);x.lineTo(112,92);x.lineTo(-112,92);x.closePath();x.fill();x.fillStyle='#facc15';x.beginPath();x.moveTo(0,-78);x.lineTo(90,79);x.lineTo(-90,79);x.closePath();x.fill();x.fillStyle='#111827';x.font='900 118px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText('!',0,22)},
 run:x=>{ICO.sq(x,'#15803d');x.lineCap=x.lineJoin='round';x.lineWidth=16;x.beginPath();x.arc(-18,-64,15,0,7);x.fill();x.beginPath();x.moveTo(-20,-40);x.lineTo(-30,18);x.lineTo(4,44);x.lineTo(-8,84);x.moveTo(-30,18);x.lineTo(-54,50);x.lineTo(-78,46);x.moveTo(-22,-30);x.lineTo(12,-10);x.lineTo(26,-32);x.moveTo(-22,-30);x.lineTo(-52,-6);x.stroke();x.lineWidth=9;x.strokeRect(46,-82,48,164)}};
// biztonsági tábla: piktogram balra, 2 sor szöveg jobbra
const sg=(k,ic,l1,l2,c2)=>ct('sg_'+k,512,256,(x,w,h)=>{x.fillStyle='#fff';x.fillRect(0,0,w,h);x.strokeStyle='#cbd5e1';x.lineWidth=8;x.strokeRect(4,4,w-8,h-8);x.save();x.translate(128,128);ICO[ic](x);x.restore();x.fillStyle='#0f172a';x.textBaseline='middle';x.font='900 44px system-ui';x.fillText(l1,252,98,240);x.font='800 36px system-ui';x.fillStyle=c2||'#0f172a';x.fillText(l2,252,162,240)});
const WB=(k,title,lines,fn)=>ct('wb_'+k,1024,512,(x,w,h)=>{x.fillStyle='#fbfcfd';x.fillRect(0,0,w,h);x.fillStyle='rgba(148,163,184,.09)';for(let i=0;i<7;i++){x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,130,40,Math.random()*3,0,7);x.fill()}
 x.fillStyle='#1e40af';x.font='italic 800 62px system-ui';x.textBaseline='alphabetic';x.fillText(title,40,82,w-80);x.font='italic 600 44px system-ui';lines.forEach((t,i)=>{x.fillStyle=t[1]||'#1e3a8a';x.fillText(t[0],56,158+i*76,fn?600:w-100)});if(fn)fn(x,w,h)});
const SIGNS={szem:()=>sg('szem','goggles','VÉDŐSZEMÜVEG','KÖTELEZŐ'),kesz:()=>sg('kesz','glove','VÉDŐKESZTYŰ','KÖTELEZŐ'),kop:()=>sg('kop','coat','LABORKÖPENY','KÖTELEZŐ'),
 eng:()=>sg('eng','noentry','BELÉPÉS CSAK','ENGEDÉLLYEL','#b91c1c'),moso:()=>sg('moso','eye','SZEMMOSÓ','VÉSZZUHANY','#15803d'),forro:()=>sg('forro','warn','VIGYÁZAT!','FORRÓ FELÜLET'),tuz:()=>sg('tuz','ext','TŰZOLTÓ-','KÉSZÜLÉK','#b91c1c'),
 lab2:()=>TXT('lab2',512,256,'#0f4c55','#fff','LABOR 2','900 116px system-ui','KÖZPÉNZ KUTATÓ KFT. · KÍSÉRLETI RÉSZLEG'),
 exit:()=>ct('sg_exit',512,256,(x,w,h)=>{x.fillStyle='#15803d';x.fillRect(0,0,w,h);x.save();x.translate(116,128);x.scale(.92,.92);ICO.run(x);x.restore();x.fillStyle='#fff';x.textBaseline='middle';x.font='900 70px system-ui';x.fillText('KIJÁRAT',228,104,270);x.font='900 70px system-ui';x.fillText('➜',360,192)})};
// a sotetmg3d keverés-labor jelenetét ugyanebbe a laborba öltözteti: zárt szoba (padló, falak, álmennyezet LED-panelekkel), hátsó pult polcokkal, fülke, táblák
function labDress(sc,cab){const M=LM(),e=labEnv(),Sm=o=>new THREE.MeshStandardMaterial(o),cl=(t,rx,ry)=>{const k=t.clone();k.needsUpdate=true;k.repeat.set(rx,ry);return k},
  pl=(w,h,m,x,y,z,rx,ry)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.rotation.set(rx||0,ry||0,0);sc.add(p);return p};
 pl(16.8,14.4,Sm({map:cl(TX.floor(),14,12),roughness:.3,envMap:e,envMapIntensity:.3}),0,.004,1.2,-Math.PI/2);const ct_=cl(TX.ceil(),14,12);pl(16.8,14.4,Sm({map:ct_,color:0xd9dee4,roughness:.95,emissive:0xffffff,emissiveMap:ct_,emissiveIntensity:.5}),0,4.2,1.2,Math.PI/2);
 pl(16.8,4.2,Sm({map:cl(TX.wall(),14,4.2/2.7),roughness:.6}),0,2.1,-5.98);const sw=Sm({map:cl(TX.wall(),12,4.2/2.7),roughness:.6});pl(14.4,4.2,sw,-8.4,2.1,1.2,0,Math.PI/2);pl(14.4,4.2,sw,8.4,2.1,1.2,0,-Math.PI/2);
 leds([-4.8,-2.4,0,2.4,4.8].flatMap(x=>[[x,-3.3],[x,-.9],[x,1.5]]),4.19,sc);bench(-8.3,8.3,-5.97,1,.94,sc);bw(16.6,.5,.02,M.sb,0,1.19,-5.96,1.2,.6,sc);hood(-5.9,-5.97,1,sc,null,4.2);
 const G={fl:[],bk:[],bt:[],tt:[],cy:[],rack:[]},LQ=[0x38bdf8,0xa3e635,0xf472b6,0xfbbf24,0xe2e8f0,0x818cf8];
 [1.55,1.9].forEach((y,j)=>{bw(9.4,.025,.28,M.st,2.4,y,-5.83,1,1,sc);for(let i=0;i<30;i++){const x=-2.0+i*.3;if(j)G.bt.push([x,y+.013,-5.83,LQ[i%6],1.3,0,[0x1e3a8a,0xdc2626,0xf8fafc][i%3]]);else G[['fl','bk','cy'][i%3]].push([x,y+.013,-5.83,LQ[(i*2)%6],1.3])}});
 [-3.6,4.2,6.2].forEach((x,i)=>rackT(G,x,.94,-5.55,LQ.slice(i)));G.fl.push([-4.4,.94,-5.6,0x38bdf8,1.4],[5.2,.94,-5.5,0xa3e635,1.4]);G.bk.push([-3.0,.94,-5.5,0xf472b6,1.4],[7.2,.94,-5.6,0xfbbf24,1.4]);glassware(G,sc);
 plate(SIGNS.lab2(),1.1,.55,sc,-3.4,2.75,-5.965);plate(SIGNS.szem(),.8,.4,sc,3.6,2.6,-5.965);plate(SIGNS.kesz(),.8,.4,sc,4.6,2.6,-5.965);
 (cab||[]).forEach(o=>{o.material=Sm({map:cl(TX.door(),o.scale.x/1.2,1),roughness:.45})})}
window._sp3lab={TX,LM,labEnv,bw,bench,hood,glassware,rackT,ib,leds,decals,tape,rect,plate,screen,SIGNS,dress:labDress};

// ===================== BELSŐ: DUPLA LAKÓKOCSI = LABOR 2 =====================
const BX=10.8,BZ=2.0;
function S(id,x,z,label,col,tab,act,scope,y,w){const sp=sprite(label,col,w);sp.position.set(x,y||2.05,z);SC.add(sp);const s={id,x,z,label,tab,act,sp,scope:scope||'in'};ST.push(s);return s}
function buildInterior(){
 const M=LM(),G={fl:[],bk:[],bt:[],tt:[],cy:[],rack:[]},SH=[],CB=[],LD=[],env=labEnv(),steel=M.st,dark=M.dk,Sm=o=>new THREE.MeshStandardMaterial(o);
 // valódi fény: 4 db _PL, árnyék nélkül (kontakt-árnyék = decal); a „lámpák” emisszív panelek
 const L1=new PL(0xf1f5ff,1.05,11);L1.position.set(-8,2.35,0);SC.add(L1);const L2=new PL(0xf1f5ff,1,11);L2.position.set(-3.5,2.35,0);SC.add(L2);
 const L3=new PL(0xf8fafc,1,11);L3.position.set(2.5,2.35,0);SC.add(L3);const L4=new PL(0xf8fafc,.95,11);L4.position.set(8,2.35,0);SC.add(L4);FX.labL=[L1,L2];
 // héj: epoxi-fényű laborcsempe (teteje y=.02, a telek betonja fölött), álmennyezet, laminált falpanel, rozsdamentes lábazat
 bw(22.8,.04,4.8,M.fl,0,0,0,1.2,1.2);bw(22.8,.1,4.8,M.ce,0,2.65,0,1.2,1.2);
 [-2.3,2.3].forEach(z=>{bw(22.3,2.7,.1,M.wl,.05,1.3,z,1.2,2.7);bw(22.2,.12,.02,steel,.05,.08,z*.976,1,1)});
 [-11.1,11.2].forEach(x=>{bw(.1,2.7,4.6,M.wl,x,1.3,0,1.2,2.7);bw(.02,.12,4.5,steel,x-Math.sign(x)*.06,.08,0,1,1)});
 // álmennyezet: 18 LED-panel a kazettarácsba illesztve (1 InstancedMesh), sprinklerek
 const LX=[-9.6,-7.2,-4.8,-2.4,0,2.4,4.8,7.2,9.6];leds(LX.flatMap(x=>[[x,-.9],[x,.9]]),2.594);
 ib(new THREE.CylinderGeometry(.025,.012,.04,8),Sm({color:0xe5e7eb,metalness:.8,roughness:.25,envMap:env}),LX.slice(1).map(x=>[x-1.2,2.58,0]));
 // gépészet: 3 cső az északi fal mentén (konzolokkal), spirálkorcos légcsatorna a déli oldalon (függesztők + befúvó rácsok)
 [[-2.12,.034,M.sd],[-1.98,.028,Sm({color:0x2563eb,roughness:.35,metalness:.3})],[-1.86,.022,Sm({color:0xeab308,roughness:.35,metalness:.3})]].forEach(([z,r,m])=>{cyl(r,r,22.1,m,.05,2.54,z,10).rotation.z=Math.PI/2});
 const BK=[];for(let x=-10.4;x<=10.6;x+=1.75)BK.push([x,2.565,-1.99]);ib(new THREE.BoxGeometry(.04,.05,.36),M.sd,BK);
 const dt=TX.duct();dt.repeat.set(2,26);cyl(.14,.14,22.1,Sm({map:dt,color:0xe2e8f0,metalness:.55,roughness:.4,envMap:env,envMapIntensity:.6}),.05,2.44,1.93,18).rotation.z=Math.PI/2;
 const DH=[];for(let x=-10;x<=10.5;x+=2.5)DH.push([x,2.59,1.93]);ib(new THREE.BoxGeometry(.03,.03,.3),M.sd,DH);
 ib(new THREE.BoxGeometry(.46,.16,.02),Sm({map:TX.grate(),roughness:.6}),[-8.4,-3.6,1.2,6,9.8].map(x=>[x,2.44,1.785]));
 // ===== LABOR (bal fél) =====
 bench(-10.6,-3.0,-2.25,1,.94,null,SH);bench(-10.6,-5.3,2.25,-1,.94,null,SH);
 bw(7.6,.5,.02,M.sb,-6.8,1.19,-2.24,1.2,.6);bw(4.65,.5,.02,M.sb,-8.275,1.19,2.24,1.2,.6); // falicsempe a pultok fölött
 // polcok üvegeszközökkel (a fülke-modul helye, x<-8.5, szabadon marad)
 [1.5,1.83].forEach(y=>bw(3.2,.025,.28,steel,-5.5,y,-2.11,1,1));ib(new THREE.BoxGeometry(.02,.1,.24),M.sd,[-6.95,-5.5,-4.05].flatMap(x=>[[x,1.445,-2.12],[x,1.775,-2.12]]));
 const LQ=[0x38bdf8,0xa3e635,0xf472b6,0xfbbf24,0xe2e8f0,0x818cf8,0x2dd4bf,0x92400e],CP=[0x1e3a8a,0xdc2626,0xf8fafc,0x111827,0xeab308,0x16a34a];
 for(let i=0;i<14;i++){const x=-6.95+i*.215;if(i===6)continue;G.bt.push([x,1.843,-2.1,i%3===1?0x92400e:LQ[i%8],1,i,CP[i%6]])}
 for(let i=0;i<11;i++){const x=-6.9+i*.27,t=['fl','bk','cy','fl','bk'][i%5];G[t].push([x,1.513,-2.1,LQ[(i*3)%8]])}
 // Ferkó munkahelye: mágneses keverő-főzőlap lombikkal, főzőpoharak, kémcső-állvány, reagens-üvegek
 bw(.22,.09,.26,M.w,-5.6,.985,-1.88);cyl(.09,.09,.008,dark,-5.6,1.034,-1.88,20);LD.push([-5.6,.985,-1.746,.03,.02,.005,0xef4444]);G.fl.push([-5.6,1.038,-1.88,0x38bdf8,1.15]);
 G.bk.push([-5.95,.94,-1.78,0xa3e635],[-5.22,.94,-1.74,0xf472b6],[-5.08,.94,-1.86,0xe2e8f0,1.3]);rackT(G,-6.3,.94,-2.0,[0x38bdf8,0x38bdf8,0xa3e635,0xf472b6,0xfbbf24,0xe2e8f0]);
 G.bt.push([-6.6,.94,-2.1,0x92400e,1.2,0,0x1e3a8a],[-6.75,.94,-2.08,0xe2e8f0,1.2,0,0xdc2626]);
 // centrifuga + műszak-tábla a falon
 bw(.46,.26,.42,M.w,-7.75,1.07,-1.92);cyl(.17,.17,.03,Sm({color:0xe5e7eb,roughness:.35}),-7.75,1.215,-1.94,24);bw(.36,.07,.01,dark,-7.75,1.0,-1.705);LD.push([-7.62,1.0,-1.698,.03,.02,.005,0x22c55e],[-7.86,1.0,-1.698,.06,.03,.005,0x22d3ee]);
 screen(SCR('shift',512,320,'MŰSZAKBEOSZTÁS · LABOR 2',(x)=>{const N=['Ferkó','Pista','Tibi','Benő','Csaba'],D=['H','K','Sz','Cs','P'];x.font='700 20px system-ui';x.fillStyle='#94a3b8';D.forEach((d,i)=>x.fillText(d,160+i*68,62));N.forEach((n,j)=>{x.fillStyle='#e2e8f0';x.fillText(n,16,98+j*46);D.forEach((d,i)=>{if((i+j*2)%3){x.fillStyle=['#0ea5e9','#22c55e','#f59e0b','#a855f7','#ef4444'][j];rr(x,146+i*68,82+j*46,54,28,6);x.fill()}})})}),.86,.54,-7.75,1.75,-2.225,1);
 // monitor (állvánnyal), mikroszkóp, mosogató csaptelep, papírtörlő-adagoló
 bw(.05,.25,.05,M.sd,-4.85,1.065,-2.13);bw(.2,.015,.15,M.sd,-4.85,.947,-2.09);screen(SCR('lab',512,320,'MINTA-ELEMZÉS · L2',(x,w,h)=>{x.strokeStyle='#1e3a5f';x.lineWidth=1;for(let i=70;i<h;i+=40){x.beginPath();x.moveTo(10,i);x.lineTo(w-10,i);x.stroke()}x.strokeStyle='#22d3ee';x.lineWidth=3;x.beginPath();for(let i=0;i<=40;i++){const X=14+i*(w-28)/40,Y=210-Math.sin(i*.45)*50-i*1.8;i?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke();x.fillStyle='#a3e635';for(let i=0;i<9;i++){const b=24+((i*37)%60);x.fillRect(24+i*26,h-16-b,16,b)}x.fillStyle='#e2e8f0';x.font='700 22px monospace';x.fillText('MINŐSÉG 94%',300,262);x.fillStyle='#86efac';x.fillText('● RENDBEN',300,294)}),.46,.28,-4.85,1.3,-2.1,1);
 bw(.18,.04,.24,M.w,-4.3,.96,-1.92);bw(.05,.32,.07,M.w,-4.3,1.14,-2.01);bw(.14,.015,.13,dark,-4.3,1.08,-1.88);bw(.08,.08,.17,M.w,-4.3,1.3,-1.92);cyl(.018,.014,.07,M.sd,-4.3,1.225,-1.87,10);const ep=cyl(.018,.018,.15,dark,-4.3,1.39,-1.86,10);ep.rotation.x=-.55;
 bw(.5,.006,.38,Sm({color:0x8b949e,metalness:.8,roughness:.25,envMap:env}),-3.55,.943,-1.9);cyl(.022,.022,.006,dark,-3.55,.947,-1.9,10);cyl(.015,.015,.35,M.sd,-3.55,1.115,-2.16,10);cyl(.012,.012,.22,M.sd,-3.55,1.29,-2.05,10).rotation.x=Math.PI/2;cyl(.012,.01,.05,M.sd,-3.55,1.265,-1.94,10);
 bw(.28,.36,.12,M.w,-3.55,1.66,-2.18);bw(.2,.02,.01,dark,-3.55,1.49,-2.12);
 // fülke-modul helye: kis eszközök (ha megveszik a fülkét, ezek benne lesznek)
 rackT(G,-9.95,.94,-1.95,[0xa3e635,0xfbbf24,0x38bdf8]);G.bt.push([-10.3,.94,-2.08,0x92400e,1,0,0x111827],[-10.15,.94,-2.1,0xe2e8f0,1,0,0x16a34a]);G.fl.push([-9.0,.94,-1.9,0x2dd4bf]);
 // déli pult (csomagoló): mérleg, címkenyomtató, dobozok, polc tárolódobozokkal; fehér tábla; fejlesztés-képernyő
 bw(.3,.05,.2,M.w,-9.9,.965,2.12);bw(.24,.01,.17,steel,-9.9,.995,2.12);bw(.22,.15,.2,dark,-7.2,1.015,2.13);LD.push([-7.2,1.04,2.028,.05,.02,.005,0x22c55e]);
 for(let i=0;i<5;i++)CB.push([-6.35+(i%3)*.2,.99+Math.floor(i/3)*.1,2.12,.18,.1,.16,0xf8fafc]);
 bw(3.4,.025,.3,steel,-8.7,1.62,2.1);ib(new THREE.BoxGeometry(.02,.1,.26),M.sd,[-10.2,-8.7,-7.2].map(x=>[x,1.565,2.11]));for(let i=0;i<8;i++)CB.push([-10.15+i*.42,1.72,2.1,.34,.17,.25,i%3?0x60a5fa:0x94a3b8]);
 bw(2.06,1.06,.025,M.sd,-4.9,1.7,2.22);plate(WB('lab','MŰSZAKTERV – LABOR 2',[['1. Kalibrálás ✔','#15803d'],['2. Mintavétel: 14:00'],['3. Közpénz-esszencia: 3 árnyalat'],['Ferkó szabálya: NE KÓSTOLD!','#b91c1c']],(x)=>{x.strokeStyle='#b91c1c';x.lineWidth=5;x.beginPath();x.moveTo(720,420);x.lineTo(720,200);x.moveTo(720,420);x.lineTo(980,420);x.stroke();x.beginPath();x.moveTo(730,400);[[780,360],[830,380],[880,300],[930,260],[975,215]].forEach(([a,b])=>x.lineTo(a,b));x.stroke()}),2.0,1.0,null,-4.9,1.7,2.206,Math.PI,.08);bw(.8,.03,.06,M.sd,-4.9,1.17,2.19);
 screen(SCR('up',512,256,'⚛️ LABOR-FEJLESZTÉS',(x,w)=>{for(let i=0;i<9;i++){x.strokeStyle='#22d3ee';x.lineWidth=2;rr(x,22+i*53,70,42,42,8);x.stroke()}x.fillStyle='#e0f2fe';x.font='700 24px system-ui';x.fillText('9 modul · beszerelés itt [E]',22,150);x.fillStyle='#164e63';x.fillRect(22,186,w-44,18)}),.7,.35,-2.45,1.55,2.225,-1);
 // vészzuhany + szemmosó (zöld), padlólefolyó, jelölt terület
 cyl(.025,.025,2.25,M.gr,-1.87,1.125,2.15,8);cyl(.02,.02,.42,M.gr,-1.87,2.22,1.94,8).rotation.x=Math.PI/2;cyl(.15,.06,.08,M.gr,-1.87,2.16,1.74,20);cyl(.006,.006,.5,M.sd,-1.87,1.88,1.74,6);bw(.18,.03,.03,M.ye,-1.87,1.62,1.74);
 const bowl=new THREE.Mesh(new THREE.SphereGeometry(.13,18,8,0,Math.PI*2,Math.PI/2,Math.PI/2),Sm({color:0x22c55e,roughness:.35,side:THREE.DoubleSide}));bowl.position.set(-1.87,1.02,1.95);SC.add(bowl);bw(.14,.04,.05,M.ye,-1.72,.98,1.97);
 plate(SIGNS.moso(),.3,.15,null,-1.62,1.62,2.244,Math.PI);
 // tűzoltó-készülék + táblák az északi falon
 cyl(.075,.075,.48,M.rd,-1.68,.44,-2.13,16);bw(.05,.07,.05,dark,-1.68,.71,-2.13);bw(.12,.1,.03,dark,-1.68,.55,-2.235);plate(SIGNS.tuz(),.3,.15,null,-1.68,1.1,-2.244);
 // üvegfal az ajtónyílással: keret, matt biztonsági sáv, táblák (a jobb fél felől olvashatók), LABOR 2 felirat
 const fr=Sm({color:0xf1f5f9,metalness:.3,roughness:.4,envMap:env}),mat=Sm({color:0xffffff,transparent:true,opacity:.55,roughness:.3,depthWrite:false});
 [-1.49,1.49].forEach(z=>{bw(.035,2.5,1.5,M.pane,-1.45,1.3,z,1,1);bw(.04,.1,1.5,mat,-1.45,1.12,z,1,1);bw(.08,.06,1.5,fr,-1.45,.05,z,1,1)});
 [-2.23,-.75,.75,2.23].forEach(z=>bw(.1,2.6,.07,fr,-1.45,1.3,z,1,1));bw(.1,.46,1.44,fr,-1.45,2.37,0,1,1);
 plate(SIGNS.lab2(),.84,.42,null,-1.395,2.37,0,Math.PI/2,.3);plate(SIGNS.szem(),.44,.22,null,-1.425,1.62,-1.5,Math.PI/2);plate(SIGNS.eng(),.44,.22,null,-1.425,1.36,-1.5,Math.PI/2);plate(SIGNS.kop(),.44,.22,null,-1.425,1.62,1.5,Math.PI/2);plate(SIGNS.kesz(),.44,.22,null,-1.425,1.36,1.5,Math.PI/2);
 // ===== JOBB FÉL: iroda-labor, desztilláló, tároló, vegyifülke, növénynevelő, pihenő, hűtő, kijárat =====
 // főhadiszállás: fehér tábla „A TERV”
 bw(1.86,.96,.025,M.sd,.6,1.6,-2.235);plate(WB('plan','A TERV:',[['1. főzz 🧪🍑📄 + termessz 🪴'],['2. rendelés (O) → autó (F)'],['3. ne bukj le 👮','#b91c1c'],['4. 🏝️ → 🚀']]),1.8,.9,null,.6,1.6,-2.221,0,.08);bw(.7,.03,.06,M.sd,.6,1.13,-2.2);
 // pályázatfőzde: íróasztal, monitor, billentyűzet, papírok, pecsételő, polc iratrendezőkkel
 bw(1.8,.04,.8,M.w,2.6,.76,-1.85);[1.72,3.48].forEach(x=>bw(.04,.74,.76,M.w,x,.37,-1.85));bw(1.72,.4,.02,M.w,2.6,.5,-2.2);
 bw(.05,.22,.05,M.sd,2.5,.89,-2.08);bw(.22,.015,.16,M.sd,2.5,.786,-2.05);screen(SCR('doc',512,320,'PÁLYÁZAT – 3. VÁLTOZAT',(x,w,h)=>{x.fillStyle='#f8fafc';x.fillRect(50,52,w-100,h-60);x.fillStyle='#94a3b8';for(let i=0;i<8;i++)x.fillRect(74,74+i*26,(w-170)*(.5+((i*7)%5)/10),10);x.save();x.translate(380,262);x.rotate(-.22);x.strokeStyle='#dc2626';x.lineWidth=5;x.strokeRect(-72,-24,144,48);x.fillStyle='#dc2626';x.font='900 30px system-ui';x.textAlign='center';x.fillText('SÜRGŐS',0,2);x.restore()}),.52,.32,2.5,1.15,-2.06,1);
 bw(.44,.02,.15,dark,2.5,.79,-1.68);CB.push([3.15,.795,-1.78,.3,.03,.4,0xf8fafc],[3.17,.825,-1.76,.28,.03,.38,0xfef9c3]);cyl(.03,.034,.06,M.rd,2.0,.81,-1.7,12);sph(.022,dark,2.0,.86,-1.7);
 bw(1.7,.025,.26,steel,2.6,1.55,-2.12);for(let i=0;i<14;i++)CB.push([1.95+i*.095,1.715,-2.12,.07,.3,.24,[0x1d4ed8,0xdc2626,0x16a34a,0x64748b,0xeab308][i%5]]);
 // tároló vitrin (raktár)
 bw(1.1,2.25,.6,M.cb,5.0,1.125,-1.95);plate(ct('cab',256,512,(x,w,h)=>{x.fillStyle='#4b5560';x.fillRect(0,0,w,h);for(let s=0;s<4;s++){const y=18+s*122;x.fillStyle='#a3acb6';x.fillRect(8,y+108,w-16,6);for(let i=0;i<5;i++){const bw_=26+((s*5+i)*7)%18,bh=36+((s*3+i)*13)%56;x.fillStyle=['#e5e7eb','#93c5fd','#fcd34d','#86efac','#f9a8d4','#cbd5e1'][(s+i)%6];x.fillRect(14+i*47,y+108-bh,bw_,bh);x.fillStyle='rgba(15,23,42,.5)';x.fillRect(17+i*47,y+118-bh,bw_-6,6)}}
  x.fillStyle='#d1d5db';x.fillRect(w/2-3,0,6,h);x.fillRect(0,0,w,8);x.fillRect(0,h-8,w,8);x.fillRect(0,0,8,h);x.fillRect(w-8,0,8,h);const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(.35,'rgba(255,255,255,0)');g.addColorStop(.6,'rgba(255,255,255,.1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,w,h)}),1.0,1.9,null,5.0,1.07,-1.645,0,.2);
 [4.95,5.05].forEach(x=>bw(.02,.3,.03,M.sd,x,1.15,-1.63));plate(TXT('raktar',512,128,'#334155','#fff','TÁROLÓ · B-2','900 62px system-ui'),.7,.17,null,5.0,2.12,-1.645,0,.3);SH.push([5.0,-1.6,1.25,.35]);
 // vegyifülke + benne eszközök + kijelölt terület előtte
 hood(6.3,-2.25,1,null,SH);G.fl.push([6.0,.95,-1.95,0xfbbf24]);G.bk.push([6.35,.95,-1.82,0x67e8f9,1.2]);rackT(G,6.68,.95,-2.02,[0xf472b6,0xe2e8f0]);
 // növénynevelő pult (a beltéri cserepek alatta), LED-fénycsík, falicsempe, felirat; tűzoltó-készülék
 bench(7.05,10.75,-2.25,1,.97,null,SH);bw(3.7,.5,.02,M.sb,8.9,1.22,-2.24,1.2,.6);bw(3.56,.05,.1,M.sd,8.9,1.76,-2.07);bw(3.5,.02,.07,M.bl,8.9,1.73,-2.06);[7.3,10.5].forEach(x=>bw(.03,.03,.18,M.sd,x,1.76,-2.16));
 plate(TXT('grow',512,128,'#14532d','#dcfce7','NÖVÉNYNEVELŐ · 22 °C','900 54px system-ui'),.9,.22,null,8.9,2.08,-2.244,0,.3);
 cyl(.075,.075,.48,M.rd,10.95,.44,-2.13,16);bw(.05,.07,.05,dark,10.95,.71,-2.13);plate(SIGNS.tuz(),.3,.15,null,10.95,1.1,-2.244);
 // desztilláló (pálinka): rézüst acél csepptálcán, gyűjtőtartály, kis pult üvegekkel, figyelmeztető tábla
 bw(1.0,.04,.9,steel,.15,.04,1.75);const copper=M.cu;cyl(.42,.5,.9,copper,0,.51,1.6);const dome=new THREE.Mesh(new THREE.SphereGeometry(.42,20,12,0,6.3,0,1.6),copper);dome.position.set(0,.96,1.6);SC.add(dome);
 const pipe=cyl(.04,.04,1.1,copper,.5,1.2,1.6,8);pipe.rotation.z=Math.PI/2.6;cyl(.25,.25,.6,steel,1.15,.32,1.85,20);cyl(.26,.26,.03,M.sd,1.15,.635,1.85,20);cyl(.02,.02,.12,M.sd,1.15,.16,1.58,8).rotation.x=Math.PI/2;
 bench(1.55,2.35,2.25,-1,.9,null,SH);[1.68,1.84,2.0].forEach((x,i)=>G.bt.push([x,.9,2.0,0xfbbf24,1.35,0,[0xdc2626,0x111827,0xeab308][i]]));G.cy.push([2.2,.9,1.9,0xfde68a]);
 plate(SIGNS.forro(),.36,.18,null,-.75,1.5,2.244,Math.PI);
 // ablakok: alumínium keret, félig leengedett reluxa
 const wm=new THREE.MeshBasicMaterial({map:ct('win',256,128,(x,w,h)=>{x.fillStyle='#0b1a3d';x.fillRect(0,0,w,h);for(let i=0;i<70;i++){x.fillStyle=Math.random()<.5?'#fde68a':'#93c5fd';x.fillRect(Math.random()*w,52+Math.random()*76,3,4)}for(let i=0;i<9;i++){x.fillStyle='#e5e7eb';x.fillRect(0,i*6,w,4);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,i*6+4,w,1)}})});
 [.5,4.5].forEach(x=>{bw(1.4,.8,.01,wm,x,1.65,2.243,1.4,.8);bw(1.5,.05,.06,fr,x,2.075,2.22);bw(1.5,.04,.14,fr,x,1.23,2.19);[-.725,.725].forEach(o=>bw(.05,.86,.06,fr,x+o,1.65,2.22))});
 // analizátor-gép (centrifuga/gép-dobozok mellé)
 bw(.8,1.25,.7,M.w,3.4,.645,1.88);bw(.62,.5,.01,dark,3.4,.95,1.527);plate(SCR('an',256,256,'ANALIZÁTOR',(x)=>{x.strokeStyle='#164e63';x.lineWidth=14;x.beginPath();x.arc(128,150,62,Math.PI*.75,Math.PI*2.25);x.stroke();x.strokeStyle='#22c55e';x.beginPath();x.arc(128,150,62,Math.PI*.75,Math.PI*1.9);x.stroke();x.fillStyle='#e2e8f0';x.font='800 34px system-ui';x.textAlign='center';x.fillText('78%',128,152);x.font='700 20px system-ui';x.fillStyle='#86efac';x.fillText('● FUT',128,228)}),.3,.3,null,3.25,1.0,1.521,Math.PI,.85);
 LD.push([3.4,1.23,1.525,.62,.02,.006,0x22c55e],[3.56,1.02,1.52,.04,.03,.006,0xfbbf24],[3.56,.94,1.52,.04,.03,.006,0x22d3ee]);cyl(.22,.22,.05,dark,3.4,1.295,1.88,24);for(let i=0;i<10;i++)G.tt.push([3.4+Math.cos(i*.628)*.16,1.3,1.88+Math.sin(i*.628)*.16,LQ[i%8]]);SH.push([3.4,1.85,.95,.85]);
 // afterparti: acél zsúrkocsi, hangfal, keverő, forgó jelzőfény (DISCO; a loop az FX.dl.color-t = a fény emisszív színét állítja, valódi fény nélkül)
 [.3,.86].forEach(y=>bw(.75,.03,.48,steel,6.3,y,1.85));[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>cyl(.015,.015,.86,M.sd,6.3+a*.35,.45,1.85+b*.21,6));
 bw(.26,.42,.26,dark,6.05,1.085,1.9);[1.0,1.2].forEach((y,i)=>cyl(i?.035:.08,i?.035:.08,.012,Sm({color:0x374151,roughness:.6}),6.05,y,1.765,16).rotation.x=Math.PI/2);bw(.3,.05,.22,dark,6.36,.9,1.85);
 for(let i=0;i<6;i++)LD.push([6.26+i*.04,.927,1.8,.02,.006,.02,[0x22d3ee,0xa3e635,0xf472b6][i%3]]);
 cyl(.06,.07,.04,dark,6.6,.895,1.85,16);DISCO=new THREE.Mesh(new THREE.SphereGeometry(.07,16,10,0,Math.PI*2,0,Math.PI/2),Sm({color:0x1f2937,emissive:0xf472b6,emissiveIntensity:2.2,roughness:.3}));DISCO.position.set(6.6,.915,1.85);SC.add(DISCO);FX.dl={color:DISCO.material.emissive};
 [6.0,6.15,6.45,6.6].forEach((x,i)=>G.bt.push([x,.315,1.85,LQ[(i*2+1)%8],1.2,0,CP[i]]));SH.push([6.3,1.85,.95,.7]);
 // pihenő priccs (alvás)
 bw(1.95,.05,.82,M.sd,8.4,.4,1.8);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>cyl(.02,.02,.38,M.sd,8.4+a*.93,.2,1.8+b*.37,6));bw(1.9,.13,.78,Sm({color:0x64748b,roughness:.9}),8.4,.49,1.8);bw(.42,.09,.5,M.w,7.68,.6,1.8);bw(.55,.07,.8,Sm({color:0x0f766e,roughness:.95}),9.0,.585,1.8);SH.push([8.4,1.8,2.2,1.0]);
 // laborhűtő (bolt): üvegajtó, megvilágított belső, kijelző
 bw(.8,1.9,.7,M.w,10.65,.97,1.75);plate(ct('fridge',256,512,(x,w,h)=>{x.fillStyle='#f1f5f9';x.fillRect(0,0,w,h);x.fillStyle='#dbeafe';x.fillRect(16,70,w-32,h-90);for(let s=0;s<4;s++){const y=90+s*100;x.fillStyle='#94a3b8';x.fillRect(16,y+80,w-32,4);for(let i=0;i<6;i++){x.fillStyle=['#38bdf8','#f472b6','#a3e635','#fbbf24','#e2e8f0','#818cf8'][(i+s)%6];x.fillRect(26+i*36,y+40,24,40);x.fillStyle='#475569';x.fillRect(26+i*36,y+34,24,7)}}
  x.fillStyle='#0f172a';rr(x,60,14,136,42,8);x.fill();x.fillStyle='#4ade80';x.font='800 30px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('+4 °C',128,36);const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(.4,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(16,70,w-32,h-90)}),.66,1.62,null,10.244,1.0,1.75,-Math.PI/2,.45);
 bw(.03,.5,.03,M.sd,10.235,1.15,1.46);SH.push([10.6,1.75,.95,.85]);
 // kijárat: fémajtó kémlelőablakkal, pánikkilincs, keret, világító KIJÁRAT tábla; köpenyek a fogason
 bw(.05,2.1,1.0,Sm({color:0xcfd5dc,metalness:.4,roughness:.45,envMap:env}),11.12,1.07,-.2);bw(.012,.55,.24,Sm({color:0x1e293b,roughness:.1,metalness:.3,envMap:env}),11.092,1.55,-.2);
 cyl(.022,.022,.75,M.sd,11.05,1.0,-.2,10).rotation.x=Math.PI/2;[-.52,.12].forEach(z=>bw(.07,.04,.04,M.sd,11.07,1.0,z));
 [-.735,.335].forEach(z=>bw(.07,2.2,.07,fr,11.12,1.1,z));bw(.07,.07,1.14,fr,11.12,2.165,-.2);bw(.06,.27,.52,dark,11.13,2.38,-.2);plate(SIGNS.exit(),.48,.24,null,11.098,2.38,-.2,-Math.PI/2,.9);
 CB.push([11.06,1.32,.62,.1,.95,.4,0xdfe5ec],[11.06,1.32,1.05,.1,.95,.4,0xbfdbfe],[11.03,1.74,.62,.1,.1,.22,0xc5ced8],[11.03,1.74,1.05,.1,.1,.22,0x93c5fd],[11.1,1.82,.62,.09,.02,.02,0x94a3b8],[11.1,1.82,1.05,.09,.02,.02,0x94a3b8]);plate(SIGNS.kop(),.36,.18,null,11.143,2.05,.84,-Math.PI/2);
 // padló: veszélycsíkok (küszöb, gép-terület, fülke előtt, vészzuhany), lefolyórácsok, kontakt-árnyékok
 tape([[-1.64,-.72,-1.64,.72,.16]].concat(rect(-8.5,-.95,-6.3,.95,.07),rect(5.62,-1.38,6.98,-.88,.07),rect(-2.3,1.08,-1.52,2.2,.07)),.07);
 const gm=Sm({map:TX.grate(),metalness:.5,roughness:.45});bw(.32,.006,.32,gm,-4.6,.023,.35);bw(.26,.006,.26,gm,-1.9,.023,1.62);
 // labor-székek (3 InstancedMesh)
 const STO=[[-6.9,-1.15],[-4.55,-1.2],[-9.3,1.2],[2.15,-1.2]];ib(new THREE.CylinderGeometry(.17,.17,.05,20),Sm({color:0x1e3a8a,roughness:.6}),STO.map(([x,z])=>[x,.62,z]));ib(new THREE.CylinderGeometry(.025,.025,.58,8),M.sd,STO.map(([x,z])=>[x,.31,z]));ib(new THREE.CylinderGeometry(.2,.22,.03,20),dark,STO.map(([x,z])=>[x,.035,z]));STO.forEach(([x,z])=>SH.push([x,z,.6,.6]));
 // összegyűjtött ismétlődő kellékek: üvegeszközök, színes dobozok/iratrendezők/köpenyek, jelző-LED-ek, kontakt-árnyékok
 glassware(G);ib(new THREE.BoxGeometry(1,1,1),M.cap,CB.map(([x,y,z,w,h,d,c])=>[x,y,z,0,w,h,d,c]));ib(new THREE.BoxGeometry(1,1,1),M.bl,LD.map(([x,y,z,w,h,d,c])=>[x,y,z,0,w,h,d,c]));decals(SH);
 // ===== LABOR-MODULOK (csak megvéve látszanak) =====
 const mod=id=>{const g=new THREE.Group();g.visible=false;SC.add(g);MODS[id]=g;return g};
 // UV neon
 {const g=mod('lm_neon');[[-6.2,2.55,-2.2,9.4,0xa855f7],[-6.2,2.55,2.2,9.4,0x22d3ee]].forEach(([x,y,z,w,c])=>box(w,.05,.05,EM(c,3),x,y,z,g));box(.05,.05,4.4,EM(0xf472b6,3),-11,2.55,0,g)}
 // buborékoló tartályok
 {const g=mod('lm_tank');FX.bub=[];[[-10.55,-.75,0x22d3ee],[-10.55,.05,0xa855f7],[-10.55,.85,0x84cc16]].forEach(([x,z,c])=>{cyl(.3,.3,1.9,new THREE.MeshPhysicalMaterial({color:0xffffff,transparent:true,opacity:.18,roughness:0}),x,.95,z,20,g);cyl(.26,.26,1.5,EM(c,.9),x,.8,z,20,g);cyl(.33,.33,.12,steel,x,1.95,z,20,g);cyl(.33,.33,.12,steel,x,.06,z,20,g);
  for(let i=0;i<6;i++){const b=sph(.035,EM(0xffffff,1.5),x+RN(-.15,.15),RN(.1,1.5),z+RN(-.15,.15),g);FX.bub.push(b)}})}
 // elszívófülke
 {const g=mod('lm_hood');box(1.8,.1,.9,steel,-9.4,2.3,-1.8,g);box(.06,1.3,.9,steel,-10.27,1.65,-1.8,g);box(.06,1.3,.9,steel,-8.53,1.65,-1.8,g);box(1.75,1.0,.03,new THREE.MeshPhysicalMaterial({color:0xbae6fd,transparent:true,opacity:.25}),-9.4,1.55,-1.37,g);cyl(.18,.18,.4,dark,-9.4,2.5,-1.8,16,g);
  FX.fan=box(.3,.02,.06,MB(0x94a3b8),-9.4,2.27,-1.8,g)}
 // monitorfal (animált grafikonok)
 {const g=mod('lm_mon');const c=document.createElement('canvas');c.width=512;c.height=128;FX.monC=c;FX.monT=new THREE.CanvasTexture(c);for(let i=0;i<4;i++){box(.82,.5,.04,dark,-6.9+i*.88,2.25,-2.2,g);const p=new THREE.Mesh(new THREE.PlaneGeometry(.76,.44),new THREE.MeshBasicMaterial({map:FX.monT}));p.material.map=FX.monT.clone();p.material.map.needsUpdate=true;p.material.map.repeat.set(.25,1);p.material.map.offset.set(i*.25,0);p.position.set(-6.9+i*.88,2.25,-2.17);g.add(p);(FX.monP=FX.monP||[]).push(p)}}
 // futószalag
 {const g=mod('lm_conv');box(4,.06,.5,MB(0x111827,{roughness:.9}),-8.4,1.05,1.75,g);[-10.35,-6.45].forEach(x=>{const r=cyl(.06,.06,.5,steel,x,1.05,1.75,10,g);r.rotation.x=Math.PI/2});FX.conv=[];for(let i=0;i<5;i++)FX.conv.push(box(.22,.16,.22,MB(0xd97706),-10.2+i*.8,1.16,1.75,g))}
 // robotkar
 {const g=mod('lm_robot');const base=cyl(.18,.22,.2,MB(0xf97316,{metalness:.5}),-5.8,1.08,1.75,16,g);const a1=new THREE.Group();a1.position.set(-5.8,1.18,1.75);g.add(a1);box(.1,.7,.1,MB(0xf97316,{metalness:.5}),0,.35,0,a1);const a2=new THREE.Group();a2.position.set(0,.7,0);a1.add(a2);box(.08,.08,.6,MB(0xe5e7eb,{metalness:.8}),0,0,-.3,a2);sph(.07,EM(0x22d3ee,2),0,0,-.62,a2);FX.arm=[a1,a2]}
 // desztillációs torony
 {const g=mod('lm_dist');const cu=MB(0xb87333,{metalness:.9,roughness:.25});cyl(.28,.32,2.3,cu,-3.0,1.15,1.85,20,g);for(let i=0;i<5;i++)cyl(.34,.34,.06,steel,-3.0,.4+i*.45,1.85,20,g);cyl(.1,.1,.45,new THREE.MeshPhysicalMaterial({color:0xfde68a,transparent:true,opacity:.5,emissive:0xfbbf24,emissiveIntensity:.8}),-3.0,1.3,1.53,12,g)}
 // plazma-reaktor (a labor közepén)
 {const g=mod('lm_reakt');cyl(.55,.65,.3,dark,-7.4,.15,0,24,g);FX.core=sph(.32,EM(0x60a5fa,2.5),-7.4,1.0,0,g);FX.rings=[];[0,1,2].forEach(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.5+i*.08,.025,8,40),EM([0x22d3ee,0xa855f7,0xf472b6][i],2));r.position.set(-7.4,1.0,0);g.add(r);FX.rings.push(r)});cyl(.04,.04,1.6,steel,-7.4,1.6,0,8,g);const rl=new PL(0x60a5fa,1.2,6);rl.position.set(-7.4,1.4,0);g.add(rl)}
 // páncélszekrény
 {const g=mod('lm_safe');box(.8,1,.6,MB(0x374151,{metalness:.9,roughness:.3}),-2.3,.5,-1.85,g);cyl(.12,.12,.05,MB(0xfacc15,{metalness:1}),-2.3,.6,-1.53,20,g).rotation.x=Math.PI/2}
 // ===== ÁLLOMÁSOK (helyük változatlan) =====
 S('lab',-5.6,-1.25,'🧪 HI-TECH LABOR [E]','#67e8f9','lab');
 S('labup',-2.4,1.0,'⚛️ LABOR-FEJLESZTÉS [E]','#c4b5fd',null,()=>shopUI('lm'));
 S('pal',.6,1.1,'🍑 PÁLINKAFŐZDE [E]','#fdba74','pal');
 S('pal2',2.6,-1.3,'📄 PÁLYÁZATFŐZDE [E]','#c4b5fd','pal2');
 S('home',.6,-1.6,'📋 FŐHADISZÁLLÁS [E]','#fde047','home');
 S('inv',5.0,-1.4,'🎒 RAKTÁR [E]','#fde68a','inv');
 S('party',6.2,1.35,'🕺 AFTERPARTI [E]','#f9a8d4','party');
 S('sleep',8.4,1.0,'🛏️ ALVÁS – ÚJ NAP [E]','#93c5fd',null,()=>{window.openSotetProgram('home');setTimeout(()=>{const b=$$('dpsl');b&&b.click()},50)});
 S('shop',10.2,1.2,'🛒 CSABA HŰTŐJE [E]','#86efac','shop');
 S('out',10.4,-.2,'🚪 KI A VÁROSBA [E]','#fca5a5',null,goOut);
 // NPC-k
 const npc=(k,col,em,x,z,ry,sc)=>{let m;try{m=person(col,em,1)}catch(e){m=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,1.4),MB(col))}m.scale.multiplyScalar(sc||.38);m.position.set(x,0,z);m.rotation.y=ry;SC.add(m);const n={k,m,x,z,ry};NPC.push(n);return n};
 npc('ferko',0xf8fafc,'👨‍🔬',-5.6,-.95,0);npc('pista',0x92400e,'🍑',.9,.9,Math.PI);npc('tibi',0x1e3a8a,'📎',2.6,-.75,0);npc('beno',0xdb2777,'🕺',6.6,1.4,Math.PI*.8);npc('csaba',0x111827,'🕴️',9.8,.5,-Math.PI/2);
 window._sp3npc=npc}

// ===================== KÜLSŐ: VÁROS =====================
function aabb(x0,z0,x1,z1){COL.push([Math.min(x0,x1),Math.min(z0,z1),Math.max(x0,x1),Math.max(z0,z1)])}
let SHOPP=[];
// eljárásos városi textúrák (LT-cache): homlokzat 12×12 m-es csempe (4 oszlop × 4 emelet, 2 változat), járdalap 2×2 m
function cityT(){if(LT.city)return LT.city;const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);return c},tx=(c,enc)=>{const t=new THREE.CanvasTexture(c);if(enc)t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t},R=Math.random;
 const noise=(x,w,h,a)=>{for(let i=0;i<w*h/30;i++){const v=R()*255|0;x.fillStyle='rgba('+v+','+v+','+v+','+a+')';x.fillRect(R()*w,R()*h,1+R()*2,1+R()*2)}};
 const fac=v=>{const C=128,lit=[];const col=cv(512,512,(x,w,h)=>{x.fillStyle='#d9d4cc';x.fillRect(0,0,w,h);noise(x,w,h,.12);for(let r=0;r<4;r++){x.fillStyle='rgba(0,0,0,.10)';x.fillRect(0,r*C+C-10,w,10);x.fillStyle='rgba(255,255,255,.18)';x.fillRect(0,r*C+C-12,w,2)}
   for(let r=0;r<4;r++)for(let k=0;k<4;k++){const X=k*C,Y=r*C,ww=v?100:64,hh=v?70:80,ox=X+(C-ww)/2,oy=Y+22;x.fillStyle='#8a8478';x.fillRect(ox-6,oy-6,ww+12,hh+14);const g=x.createLinearGradient(0,oy,0,oy+hh);g.addColorStop(0,'#5b7a99');g.addColorStop(1,'#1e2b3b');x.fillStyle=g;x.fillRect(ox,oy,ww,hh);x.fillStyle='#e7e2d8';x.fillRect(ox+ww/2-2,oy,4,hh);x.fillRect(ox,oy+hh*.35,ww,3);x.fillStyle='#b8b2a6';x.fillRect(ox-9,oy+hh+6,ww+18,6);
    if(v&&r<3){x.fillStyle='#3f3f46';x.fillRect(ox-10,oy+hh+10,ww+20,4);for(let i=0;i<=8;i++)x.fillRect(ox-10+i*(ww+20)/8,oy+hh-14,2,24)}lit.push([ox,oy,ww,hh,R()<.33])}});
  const em=cv(512,512,(x,w,h)=>{x.fillStyle='#000';x.fillRect(0,0,w,h);lit.forEach(([ox,oy,ww,hh,on])=>{if(!on)return;const g=x.createRadialGradient(ox+ww/2,oy+hh/2,4,ox+ww/2,oy+hh/2,ww*.7);g.addColorStop(0,R()<.3?'#bfe3ff':'#ffd58a');g.addColorStop(1,'#6b4a1a');x.fillStyle=g;x.fillRect(ox,oy,ww,hh)})});
  const bu=cv(512,512,(x,w,h)=>{x.fillStyle='#c8c8c8';x.fillRect(0,0,w,h);noise(x,w,h,.25);for(let r=0;r<4;r++){x.fillStyle='#909090';x.fillRect(0,r*C+C-10,w,10)}lit.forEach(([ox,oy,ww,hh])=>{x.fillStyle='#e8e8e8';x.fillRect(ox-6,oy-6,ww+12,hh+14);x.fillStyle='#202020';x.fillRect(ox,oy,ww,hh);x.fillStyle='#f0f0f0';x.fillRect(ox-9,oy+hh+6,ww+18,6)})});
  return{map:tx(col,1),em:tx(em,1),bump:tx(bu)}};
 const sw=cv(256,256,(x,w,h)=>{x.fillStyle='#b9b5ae';x.fillRect(0,0,w,h);for(let i=0;i<2;i++)for(let j=0;j<2;j++){const v=170+(R()*30|0);x.fillStyle='rgb('+v+','+(v-3)+','+(v-8)+')';x.fillRect(i*128+3,j*128+3,122,122)}noise(x,w,h,.3);x.fillStyle='rgba(40,40,40,.5)';x.fillRect(0,0,w,3);x.fillRect(0,0,3,h);x.fillRect(0,128,w,3);x.fillRect(128,0,3,h)});
 const swx=tx(sw,1),swz=swx.clone();swz.needsUpdate=true;swz.__tqP=swx;swx.repeat.set(135,1);swz.repeat.set(1,135);
 return LT.city={fac:[fac(0),fac(1)],sw:{x:swx,z:swz}}}
const FACM={};function facM(v,c){const k=v+'_'+c;if(FACM[k])return FACM[k];const F=cityT().fac[v];return FACM[k]=new THREE.MeshStandardMaterial({map:F.map,bumpMap:F.bump,bumpScale:.06,roughnessMap:F.bump,roughness:1,metalness:.05,color:c,emissive:0xffffff,emissiveMap:F.em,emissiveIntensity:.85})}
// boltok: [kulcs, név, emoji, háttér, szín, falszín, blokk x,z, negyed a,b] – a blokk utcai szélén, homlokzattal az út felé (f=b)
function buildShops(){const L=[['ac','🕶️ ÁRNYÉK BUTIK','🕶️','#7c3aed','#f0abfc',0x6d28d9,60,-60,-1,1],['sd','🌱 ZÖLD KÉZ KERTÉSZET','🌱','#166534','#86efac',0x15803d,-60,0,1,-1],['car','🚗 ROZSDÁS AUTÓKER','🚗','#9a3412','#fdba74',0xc2410c,60,60,-1,-1],['lm','⚛️ LABOR-SZAKÜZLET','⚛️','#0e7490','#67e8f9',0x0891b2,0,60,1,1],['shop','🛒 CSABA VEGYESBOLT','🛒','#854d0e','#fde047',0xa16207,-60,-60,-1,-1],['food','🍔 ÉJJELI BÜFÉ','🍔','#9f1239','#fda4af',0xbe123c,60,0,1,1]];
 const roof=MB(0x1f2937,{roughness:.9}),pole=MB(0x334155,{metalness:.7,roughness:.4}),glass=new THREE.MeshStandardMaterial({color:0x1e293b,emissive:0xfde68a,emissiveIntensity:.35,roughness:.08,metalness:.6}),door=EM(0x0f172a,.2);
 L.forEach(([k,n,e,bg,fg,c,bx,bz,a,b],i)=>{const f=b,sx=bx+a*12,sz=bz+b*17,G=new THREE.Group();G.position.set(sx,0,sz);G.rotation.y=f>0?0:Math.PI;SC.add(G);
  bw(12,6,10,tex('brick',1,1,c),0,3,0,2.4,2.4,G);bw(12.4,.35,10.4,roof,0,6.15,0,1,1,G);
  box(5.4,2.4,.05,glass,-2.6,1.5,5.03,G);box(1.6,2.5,.06,door,3,1.25,5.03,G);bw(6.2,.25,.3,roof,-2.6,.12,5.1,1,1,G);
  const aw=box(11.6,.12,1.6,EM(new THREE.Color(fg).getHex(),.35),0,3.35,5.7,G);aw.rotation.x=.25;
  const sg=sign(n,bg,fg,9,1.6);sg.position.set(0,4.6,5.08);G.add(sg);
  cyl(.12,.14,7,pole,5.4,3.5,7.2,8,G);[1,-1].forEach(s=>{const p=sign(n,bg,fg,3.6,.9);p.position.set(5.4+s*.05,7.4,7.2);p.rotation.y=s*Math.PI/2;G.add(p)});
  const wx=sx+(f>0?3:-3),wz=sz+f*6.6;S('shop_'+k,wx,wz,n+' [E]',fg,null,()=>k==='shop'?openPanel('shop'):k==='car'?carUI():shopUI(k),'out',3,2.6);
  aabb(sx-6.2,sz-5.2,sx+6.2,sz+5.2);const qx=sx+(f>0?5.4:-5.4),qz=sz+f*7.2;aabb(qx-.2,qz-.2,qx+.2,qz+.2);
  try{window._sp3npc('sk'+i,c,pick(['🧔','👩','👨‍🦲','👵','🧑‍🎤','🧑‍🍳']),sx+(f>0?4.3:-4.3),sz+f*5.9,0,.9)}catch(e){}
  SHOPP.push({k,n,e,fg,x:sx,z:sz,f,q:[bx,bz,a,b].join()})})}
function buildCity(){
 HEMI=new THREE.HemisphereLight(0x93c5fd,0x1e1b4b,.0);SC.add(HEMI);MOON=new THREE.DirectionalLight(0xbfdbfe,0);MOON.position.set(-60,120,40);SC.add(MOON);
 // csillagok
 const sg=new THREE.BufferGeometry(),sv=[];for(let i=0;i<900;i++){const a=Math.random()*6.28,b=Math.random()*1.2+.15,r=380;sv.push(Math.cos(a)*Math.cos(b)*r,Math.sin(b)*r,Math.sin(a)*Math.cos(b)*r)}sg.setAttribute('position',new THREE.Float32BufferAttribute(sv,3));SC.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.4,sizeAttenuation:false})));
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(320,320),tex('grass',60,60,0x4d7c3a));gr.rotation.x=-Math.PI/2;gr.position.y=-.03;gr.receiveShadow=true;SC.add(gr);
 // utak + járdák
 const aspX=tex('asphalt',54,2,0x5b6170,{roughness:.92}),aspZ=tex('asphalt',2,54,0x5b6170,{roughness:.92});if(window.TQ){TQ.antiTile(aspX);TQ.antiTile(aspZ);TQ.antiTile(gr.material)}
 const swT=cityT().sw,sideX=new THREE.MeshStandardMaterial({map:swT.x,bumpMap:swT.x,bumpScale:.02,roughness:.85,color:0xd6d3d1}),sideZ=new THREE.MeshStandardMaterial({map:swT.z,bumpMap:swT.z,bumpScale:.02,roughness:.85,color:0xd6d3d1}),curb=tex('conc',1,1,0xc8ccd2,{roughness:.8});
 const lineM=new THREE.MeshStandardMaterial({color:0xe5e7eb,roughness:.6});
 [-90,-30,30,90].forEach(v=>{box(270,.02,10,aspX,0,.01,v);box(10,.025,270,aspZ,v,.012,0);[-6,6].forEach(o=>{box(270,.08,2,sideX,0,.04,v+o);box(2,.085,270,sideZ,v+o,.042,0)});
  [-5.1,5.1].forEach(o=>{bw(270,.16,.22,curb,0,.08,v+o,1,1);bw(.22,.165,270,curb,v+o,.082,0,1,1)});[-4.4,4.4].forEach(o=>{box(270,.03,.15,lineM,0,.028,v+o);box(.15,.032,270,lineM,v+o,.03,0)})});
 {const Z=[];[-90,-30,30,90].forEach(a=>[-90,-30,30,90].forEach(b=>{for(let k=-4;k<=4;k++){[-8,8].forEach(o=>{Z.push([a+o,.036,b+k,0,1]);Z.push([a+k,.036,b+o,Math.PI/2,1])})}}));ib(new THREE.BoxGeometry(3,.03,.5),lineM,Z)}
 // útfelfestés
 const dash=new THREE.InstancedMesh(new THREE.BoxGeometry(3,.03,.25),new THREE.MeshBasicMaterial({color:0xf8fafc}),360);let di=0;const mt=new THREE.Matrix4();
 [-90,-30,30,90].forEach(v=>{for(let x=-130;x<130&&di<358;x+=8){mt.makeTranslation(x,.03,v);dash.setMatrixAt(di++,mt);mt.makeRotationY(Math.PI/2);mt.setPosition(v,.035,x);dash.setMatrixAt(di++,mt)}});dash.count=di;SC.add(dash);
 // lakókocsi-telek
 box(50,.03,50,tex('conc',14,14,0x6f7781),0,.0,0);
 // lakókocsi külső héj
 const shell=tex('metal',6,1,0xe5e7eb,{metalness:.5,roughness:.4});box(22.8,2.95,.12,shell,0,1.47,-2.42);box(22.8,2.95,.12,shell,0,1.47,2.42);box(.12,2.95,4.9,shell,-11.4,1.47,0);box(.12,2.95,4.9,shell,11.4,1.47,0);box(22.8,.12,4.9,shell,0,2.95,0);
 // (a régi „díszcsík” tömör lapként átment a belsőn – az volt a lila padló; kívülről a héj takarta, ezért törölve)
 [-8,-6.6,6.6,8].forEach(x=>{const w=cyl(.45,.45,.3,MB(0x111827),x,.1,2.5,18);w.rotation.x=Math.PI/2;const w2=cyl(.45,.45,.3,MB(0x111827),x,.1,-2.5,18);w2.rotation.x=Math.PI/2});
 box(.6,.2,1.2,tex('metal',1,1,0x475569),11.8,.1,-.2);const ss=sign('🕶️ SÖTÉT PROGRAM','#4c1d95','#f472b6',4,1);ss.position.set(0,2.2,2.5);SC.add(ss);const ss2=ss.clone();ss2.position.z=-2.5;ss2.rotation.y=Math.PI;SC.add(ss2);
 aabb(-11.5,-2.55,11.5,2.55);
 S('enter',12.4,-.2,'🚐 BE A LAKÓKOCSIBA [E]','#c4b5fd',goIn,null,'out',2.6,2.2);ST[ST.length-1].tab=null;ST[ST.length-1].act=goIn;
 // ===== BOLTOK: 6 kerületben, utcafronton, oszlopos táblával, a térképen jelölve (11-15 SÖTÉT VÁROS) =====
 buildShops();
 // ===== ÉPÜLETEK =====
 const blocks=[];[-60,0,60].forEach(bx=>[-60,0,60].forEach(bz=>{if(bx||bz)blocks.push([bx,bz,38])}));[-115,115].forEach(a=>[-115,-60,0,60,115].forEach(b=>{blocks.push([a,b,30]);if(Math.abs(b)!==115)blocks.push([b,a,30])}));
 const parks=['0,-60','-60,60'];const trees=[];
 const SKIP=new Set(SHOPP.map(q=>q.q));const roofM=tex('roof',1,1,0x6b6f76,{roughness:.95});
 blocks.forEach(([bx,bz,sz])=>{if(parks.includes(bx+','+bz)){box(48,.04,48,tex('grass2',8,8,0x3f6212),bx,.02,bz);for(let i=0;i<14;i++)trees.push([bx+RN(-20,20),bz+RN(-20,20)]);return}
  const half=sz===38?12:10;[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{if(SKIP.has([bx,bz,a,b].join()))return;const w=RN(14,20),d=RN(14,20),h=3*Math.round(RN(8,36)/3),x=bx+a*half,z=bz+b*half;
   const fm=facM(Math.floor(Math.random()*2),pick([0xffffff,0xfde68a,0xcbd5e1,0xfecaca,0xbfdbfe,0xd6c7b0]));
   bw(w,h,d,[fm,fm,roofM,roofM,fm,fm],x,h/2,z,12,12).receiveShadow=true;bw(w+.4,.6,d+.4,curb,x,h+.3,z,1,1);aabb(x-w/2,z-d/2,x+w/2,z+d/2);
   if(Math.random()<.35){const nn=sign(pick(['HOTEL','BÁR','PIZZA','GYÓGYSZER','NONSTOP','KLUB','MOZI','PÉKSÉG']),'#0f172a',pick(['#f472b6','#22d3ee','#a3e635','#facc15']),6,1.4);nn.position.set(x,Math.min(h-2,9),z+(z<bz?-1:1)*(d/2+.05)*-1*-1);nn.position.z=b<0?z+d/2+.05:z-d/2-.05;if(b>0)nn.rotation.y=Math.PI;SC.add(nn)}})});
 // fák a telken és parkokban
 for(let i=-20;i<=4;i+=8){trees.push([i,19]);}[[-22,-8],[-22,8],[22,-14],[22,14]].forEach(t=>trees.push(t));
 const tr=new THREE.InstancedMesh(new THREE.CylinderGeometry(.18,.32,2.6,8),tex('bark',1,2,0x8b6b4a),trees.length),cr=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.7,1),MB(0xffffff,{roughness:.9,flatShading:true}),trees.length*2);
 const _o=new THREE.Object3D(),_tc=new THREE.Color();trees.forEach(([x,z],i)=>{const k=RN(.8,1.25);_o.position.set(x,1.3*k,z);_o.rotation.set(0,RN(0,6),0);_o.scale.set(k,k,k);_o.updateMatrix();tr.setMatrixAt(i,_o.matrix);
  [[0,3.3,0,1],[RN(-.5,.5),4.5,RN(-.5,.5),.72]].forEach(([ox,oy,oz,s],j)=>{_o.position.set(x+ox*k,oy*k,z+oz*k);_o.scale.set(s*k*RN(.9,1.1),s*k*RN(.8,1),s*k*RN(.9,1.1));_o.updateMatrix();cr.setMatrixAt(i*2+j,_o.matrix);cr.setColorAt(i*2+j,_tc.setHSL(RN(.24,.33),RN(.45,.65),RN(.2,.3)))});aabb(x-.4,z-.4,x+.4,z+.4)});tr.castShadow=cr.castShadow=true;SC.add(tr);SC.add(cr);
 // utcai lámpák (instanced, valódi fény nélkül)
 const LP=[];[-90,-30,30,90].forEach(v=>{for(let x=-125;x<=125;x+=22){LP.push([x,v+7]);LP.push([v+7,x+11])}});
 const pole=new THREE.InstancedMesh(new THREE.CylinderGeometry(.08,.1,5,6),MB(0x1f2937,{metalness:.7}),LP.length),head=new THREE.InstancedMesh(new THREE.SphereGeometry(.35,10,8),FX.lampM=EM(0xfde68a,2.2),LP.length),pool=new THREE.InstancedMesh(new THREE.CircleGeometry(3.2,16),new THREE.MeshBasicMaterial({color:0xfde68a,transparent:true,opacity:.13,depthWrite:false}),LP.length);
 LP.forEach(([x,z],i)=>{mt.makeTranslation(x,2.5,z);pole.setMatrixAt(i,mt);mt.makeTranslation(x,5.1,z);head.setMatrixAt(i,mt);mt.makeRotationX(-Math.PI/2);mt.setPosition(x,.06,z);pool.setMatrixAt(i,mt)});SC.add(pole);SC.add(head);SC.add(pool);
 try{buildYard()}catch(e){console.warn('sp3 yard',e)}
 // ===== KERÜLETEK: vevők + leadási pont =====
 const DIS=DP().DIS;DROPPOS.forEach(([x,z],i)=>{const sp=sprite(DIS[i][1]+' '+DIS[i][0],'#fca5a5',3);sp.position.set(x,3.6,z);SC.add(sp);
  const beam=cyl(1.2,1.2,40,new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.22,depthWrite:false}),x,20,z,20);beam.visible=false;const ring=new THREE.Mesh(new THREE.TorusGeometry(2.2,.12,8,32),EM(0x22c55e,2));ring.rotation.x=Math.PI/2;ring.position.set(x,.2,z);ring.visible=false;SC.add(ring);
  let cm=null;try{cm=window._sp3npc('cust'+i,pick([0x0ea5e9,0xf59e0b,0x10b981,0xe11d48,0x6366f1]),pick(['🧑','🧔','👱','🧑‍🦱','🥷','🧑‍🎤']),x+1.6,z,0,.9)}catch(e){}
  DROPS.push({i,x,z,sp,beam,ring,cm});S('drop'+i,x,z,'📦 LEADÁS: '+DIS[i][0]+' [E]','#86efac',null,()=>deliver(i),'out',2.6,2.6)});
 // ===== VIRÁGCSEREPEK (Közkert a telken + városszerte) =====
 const potPos=[[-15,12],[-9,12],[-3,12],[3,12],[9,12],[15,12],[-36.5,-36.5],[36.5,-36.5],[36.5,36.5],[-36.5,36.5],[-83.5,-36.5],[83.5,36.5],[36.5,83.5],[-36.5,83.5],[83.5,-83.5],[-83.5,83.5]];
 const kk=sign('🪴 KÖZKERT','#14532d','#86efac',4,1);kk.position.set(0,2.2,13.2);kk.rotation.y=Math.PI;SC.add(kk);
 potPos.forEach(([x,z],i)=>mkPot('c'+i,x,0,z,1.4,'out'));
 [[7.4,-2.1],[8.0,-2.1],[8.6,-2.1],[9.2,-2.1],[9.8,-2.1],[10.4,-2.1]].forEach(([x,z],i)=>mkPot('in'+i,x,.97,z,.45,'in'));
 // ===== AUTÓ =====
 CAR=new THREE.Group();SC.add(CAR);rebuildCar();
 S('car',car.x,car.z,'🚗 BESZÁLLÁS [F]','#fde047',null,()=>toggleCar(),'out',2.6,2);FX.carS=ST[ST.length-1];
 // ===== JÁRŐRÖK =====
 [[30,0],[30,.5],[90,.25]].forEach(([r,p])=>{const g=makeCar(0xf8fafc,true);SC.add(g);POL.push({g,r,p,sp:.012+Math.random()*.004})})}
// ===== TELEK: kerítés, kapu, előtető, fényfüzér, kerti tárgyak (11-15) – InstancedMesh/megosztott anyag, 2 valódi _PL (bent 0 intenzitás) =====
function buildYard(){const wd=tex('wood',1,1,0xa47148),dw=tex('darkwood',1,1,0x8a6a4a),mtl=tex('metal',1,1,0x9ca3af,{metalness:.6,roughness:.45}),o=new THREE.Object3D();FX.yardL=[];
 const inst=(geo,mat,L,sh)=>{const m=new THREE.InstancedMesh(geo,mat,L.length);L.forEach((q,i)=>{o.position.set(q[0],q[1],q[2]);o.rotation.set(0,q[3]||0,0);o.scale.set(q[4]||1,q[5]||1,q[6]||1);o.updateMatrix();m.setMatrixAt(i,o.matrix)});m.castShadow=!!sh;m.receiveShadow=true;SC.add(m);return m};
 // léckerítés: oszlopok ~2 m-enként, 2 keresztléc, lécek; szakaszonként ütköző (kapu: x 8..20 délen, gyalogkapu nyugaton z -2..2)
 const E=23.4,segs=[[-E,E,8,E],[20,E,E,E],[-E,-20,-E,-2],[-E,2,-E,E],[E,-20,E,E]],posts=[],rails=[],picks=[];
 segs.forEach(([a,b,c,d])=>{const L=Math.hypot(c-a,d-b),ry=Math.atan2(d-b,c-a),n=Math.max(1,Math.round(L/2));
  for(let i=0;i<=n;i++){const t=i/n;posts.push([a+(c-a)*t,.75,b+(d-b)*t])}
  [.45,1.15].forEach(y=>rails.push([(a+c)/2,y,(b+d)/2,-ry,L]));
  const m=Math.round(L/.22);for(let i=0;i<m;i++){const t=(i+.5)/m;picks.push([a+(c-a)*t,.62,b+(d-b)*t,-ry,1,RN(.95,1.05)])}
  aabb(a-.18,b-.18,c+.18,d+.18)});
 inst(new THREE.BoxGeometry(.14,1.5,.14),dw,posts,1);inst(new THREE.BoxGeometry(1,.08,.05),wd,rails);inst(new THREE.BoxGeometry(.11,1.25,.025),MB(0xe7dcc8,{roughness:.85}),picks);
 // kapu: két téglaoszlop + lámpa + felirat
 [[8,E],[20,E]].forEach(([x,z])=>{box(.6,2.2,.6,tex('brick',1,2,0x9a5a44),x,1.1,z);box(.75,.12,.75,MB(0x334155),x,2.26,z);sph(.2,EM(0xffd59a,1.6),x,2.5,z);aabb(x-.32,z-.32,x+.32,z+.32)});
 const gs=sign('🚐 TELEK · 7-ES PARCELLA','#3f2a1a','#fbbf24',4.2,.9);gs.position.set(14,2.9,E+.05);SC.add(gs);const gs2=gs.clone();gs2.rotation.y=Math.PI;gs2.position.z=E-.05;SC.add(gs2);box(12.4,.12,.12,MB(0x1f2937,{metalness:.7}),14,2.4,E);
 const gl=new PL(0xffc27a,0,16,2);gl.position.set(14,2.2,E-1);gl.userData.i=1.1;SC.add(gl);FX.yardL.push(gl);
 // feljáró (kavics) a kaputól az autóig, kőlap-ösvény az ajtótól nyugatra a gyalogkapuig
 box(8,.02,15,tex('sand',3,6,0x9b8f7e),14,.025,15.5);box(4,.02,8,tex('sand',2,3,0x9b8f7e),16,.024,6);
 const pv=[];for(let x=-22;x<11.5;x+=1.15)pv.push([x,.03,(x<-11.6?0:3.4)+RN(-.15,.15),RN(0,.4),RN(.8,1),1,RN(.8,1)]);for(let z=2.6;z>.4;z-=1.1)pv.push([12.3,.03,z,RN(0,.4),.9,1,.9]);for(let z=3.4;z>-.1;z-=1.15)pv.push([-11.9,.03,z,RN(0,.4),.9,1,.9]);
 inst(new THREE.CylinderGeometry(.42,.45,.04,7),tex('stone',1,1,0xb8b2a6),pv);
 // előtető a lakókocsi déli oldalán (csíkos vászon) + oszlopok + fényfüzér
 const stripe=ct('awn',256,64,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=i%2?'#f5efe0':'#7c3aed';x.fillRect(i*w/8,0,w/8,h)}x.fillStyle='rgba(0,0,0,.18)';for(let i=0;i<w;i+=3)x.fillRect(i,0,1,h)},1);stripe.repeat.set(3,1);
 const aw=new THREE.Mesh(new THREE.PlaneGeometry(16,2.8),new THREE.MeshStandardMaterial({map:stripe,side:THREE.DoubleSide,roughness:.9}));aw.position.set(0,2.55,3.85);aw.rotation.x=-Math.PI/2+.22;aw.receiveShadow=true;SC.add(aw);
 [-7.8,0,7.8].forEach(x=>{cyl(.04,.04,2.25,mtl,x,1.12,5.15,8);aabb(x-.12,5.03,x+.12,5.27)});
 const bl=[];for(let i=0;i<=24;i++){const t=i/24;bl.push([-7.8+15.6*t,2.2-Math.sin(t*Math.PI*3)**2*.25,5.2])}
 const bm=new THREE.InstancedMesh(new THREE.SphereGeometry(.055,6,4),new THREE.MeshBasicMaterial({color:0xffffff}),bl.length);bl.forEach((q,i)=>{o.position.set(q[0],q[1],q[2]);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.updateMatrix();bm.setMatrixAt(i,o.matrix);bm.setColorAt(i,_C.setHex([0xfde68a,0xf472b6,0x67e8f9,0xa3e635][i%4]))});SC.add(bm);
 const al=new PL(0xffd9a0,0,13,2);al.position.set(0,2.1,4.4);al.userData.i=1.3;SC.add(al);FX.yardL.push(al);
 // kerti asztal + padok, grill
 box(2.2,.07,1,dw,-4,.78,7.6);[-1,1].forEach(s=>{box(.08,.75,.9,dw,-4+s*.95,.38,7.6);box(2.2,.06,.32,dw,-4,.45,7.6+s*.8);box(.06,.42,.3,dw,-4.9,.22,7.6+s*.8);box(.06,.42,.3,dw,-3.1,.22,7.6+s*.8)});aabb(-5.15,6.65,-2.85,8.55);
 cyl(.42,.32,.42,MB(0x111827,{metalness:.5,roughness:.5}),-.8,.85,7.4,14);[0,2.1,4.2].forEach(a=>{const l=cyl(.025,.025,.7,mtl,-.8+Math.cos(a)*.25,.33,7.4+Math.sin(a)*.25,5);l.rotation.z=Math.cos(a)*.3;l.rotation.x=-Math.sin(a)*.3});sph(.05,EM(0xf97316,2),-.8,1.07,7.4);aabb(-1.25,6.95,-.35,7.85);
 // generátor + kábel, gázpalackok, hordók, raklapok, kukák, postaláda, parabola
 box(1.4,.9,.8,MB(0xca8a04,{metalness:.4,roughness:.5}),-14,.45,4.4);box(1.2,.12,.6,MB(0x1f2937),-14,.95,4.4);aabb(-14.75,3.95,-13.25,4.85);
 SC.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-13.3,.2,4.4),new THREE.Vector3(-12.6,.03,3.6),new THREE.Vector3(-11.6,.05,2.9),new THREE.Vector3(-11.45,.6,2.4)]),16,.03,5),MB(0x111827)));
 inst(new THREE.CylinderGeometry(.16,.16,1.1,12),MB(0x2563eb,{metalness:.5,roughness:.4}),[[-12.3,.55,-3.1],[-12.7,.55,-3.3],[-12.4,.55,-3.6]]);aabb(-12.95,-3.85,-12.05,-2.85);
 inst(new THREE.CylinderGeometry(.3,.3,.9,14),tex('metal',1,1,0x7f1d1d,{metalness:.5,roughness:.6}),[[-19.5,.45,-9.6],[-18.6,.45,-9.9],[-19.2,.45,-10.8],[-19,1.36,-10.1]],1);aabb(-19.9,-11.2,-18.2,-9.2);
 inst(new THREE.BoxGeometry(1.2,.14,1),wd,[[-19,.07,-14],[-19,.21,-14,.1],[-19,.35,-14,-.05],[-17.6,.07,-14.4,.3]],1);aabb(-19.7,-14.9,-16.9,-13.4);
 [[20.4,-16.5,0x166534],[21.3,-16.5,0x334155]].forEach(([x,z,c])=>{box(.75,1.05,.75,MB(c,{roughness:.6}),x,.53,z);box(.8,.08,.8,MB(c),x,1.1,z)});aabb(19.9,-16.95,21.75,-16.05);
 cyl(.05,.05,1.1,mtl,6.6,.55,E-.5,6);box(.35,.28,.5,MB(0x991b1b,{metalness:.4}),6.6,1.2,E-.5);aabb(6.4,E-.75,6.8,E-.25);
 const dish=new THREE.Mesh(new THREE.SphereGeometry(.55,16,8,0,6.29,0,1.1),MB(0xe5e7eb,{side:THREE.DoubleSide,metalness:.3}));dish.position.set(-3,3.45,-1);dish.rotation.x=-1;SC.add(dish);cyl(.03,.03,.5,mtl,-3,3.15,-1,6);
 // bokrok a kerítés mentén + fűcsomók (alacsonyak, ütközés nélkül), tócsák
 const bu=[];for(let i=0;i<34;i++){const s=Math.floor(RN(0,3)),t=RN(-19,21);const q=s===0?[t,0,E-.9]:s===1?[-E+.9,0,t]:[E-.9,0,t];if((s===0&&q[0]>6.5&&q[0]<21.5)||(s===1&&Math.abs(t)<3))continue;const k=RN(.5,.85);bu.push([q[0],k*.6,q[2],RN(0,6),k,k*RN(.7,.9),k])}
 const bum=inst(new THREE.IcosahedronGeometry(1,1),MB(0xffffff,{roughness:.95,flatShading:true}),bu,1);bu.forEach((q,i)=>bum.setColorAt(i,_C.setHSL(RN(.25,.32),.5,RN(.17,.26))));
 const tu=[];for(let i=0;i<160;i++){const x=RN(-22.5,22.5),z=RN(-19,22.5);if(Math.abs(z)<3.2&&Math.abs(x)<12||(x>7&&x<21&&z>4))continue;for(let j=0;j<4;j++)tu.push([x+RN(-.15,.15),.14,z+RN(-.15,.15),RN(0,3),RN(.7,1.2),RN(.6,1.3),RN(.7,1.2)])}
 inst(new THREE.ConeGeometry(.05,.3,3),MB(0x3f6b2a,{roughness:1}),tu);
 inst(new THREE.CircleGeometry(1,20).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x5b6b80,metalness:.8,roughness:.06,transparent:true,opacity:.4,depthWrite:false}),[[15.2,.035,13.2,0,1.3,1,.8],[5,.033,15.5,0,.9,1,.6],[-9,.033,18,0,1.1,1,.7]]);
}
function makeCar(col,pol){const g=new THREE.Group();const bm=MB(col,{metalness:.6,roughness:.35});box(2,.7,4.2,bm,0,.65,0,g);box(1.7,.6,2.2,MB(pol?0x1e293b:0x0f172a,{metalness:.9,roughness:.1}),0,1.25,-.2,g);
 [[-.95,1.4],[.95,1.4],[-.95,-1.4],[.95,-1.4]].forEach(([x,z])=>{const w=cyl(.38,.38,.3,MB(0x111827),x,.38,z,14,g);w.rotation.z=Math.PI/2});box(.4,.18,.05,EM(0xfef9c3,2),-.6,.7,2.11,g);box(.4,.18,.05,EM(0xfef9c3,2),.6,.7,2.11,g);box(.4,.15,.05,EM(0xef4444,1.5),-.6,.7,-2.11,g);box(.4,.15,.05,EM(0xef4444,1.5),.6,.7,-2.11,g);
 if(pol){box(2.02,.25,1.2,MB(0x1d4ed8),0,.7,0,g);g.userData.r=box(.5,.15,.3,EM(0xef4444,3),-.35,1.62,-.2,g);g.userData.b=box(.5,.15,.3,EM(0x3b82f6,3),.35,1.62,-.2,g)}return g}
function rebuildCar(){while(CAR.children.length)CAR.remove(CAR.children[0]);const v=veh();const g=makeCar(v.c,false);g.scale.set(v.s,v.s<1?.9:v.s,v.s<1?.7:v.s);CAR.add(g);CAR.position.set(car.x,0,car.z);CAR.rotation.y=car.h}
// ===== CSEREPEK =====
function mkPot(key,x,y,z,s,scope){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);SC.add(g);cyl(.32,.22,.45,tex('conc',1,1,0xc2410c),0,.22,0,14,g);cyl(.3,.3,.04,MB(0x3f2a1a),0,.43,0,14,g);
 const pl=new THREE.Group();pl.position.y=.45;g.add(pl);cyl(.025,.03,.6,MB(0x15803d),0,.3,0,6,pl);const lf=[];for(let i=0;i<5;i++){const l=sph(.13,MB(0x22c55e),Math.cos(i*1.26)*.12,.35+i*.07,Math.sin(i*1.26)*.12,pl);l.scale.set(1,.5,1.6);l.rotation.y=i*1.26;lf.push(l)}const fr=sph(.11,EM(0xf472b6,.8),0,.72,0,pl);
 const rd=sprite('✅ KÉSZ!','#86efac',.9);rd.position.set(0,1.3,0);rd.visible=false;g.add(rd);
 const P={key,g,pl,lf,fr,rd,x,z,scope,s};POTS.push(P);const st=S('pot_'+key,x,z,'🪴 CSERÉP [E]','#86efac',null,()=>potUI(P),scope,y+(scope==='in'?.9:2.2),scope==='in'?1.1:1.8);st.pot=P;P.st=st}
const SEEDC={m_zfu:0x16a34a,m_gomba:0xfef3c7,m_menta:0x6ee7b7,m_tuz:0xef4444,m_kek:0x3b82f6,m_arany:0xfacc15,m_krist:0x22d3ee,m_fust:0x94a3b8,m_szilva:0x7c3aed,m_barack:0xfb923c,m_alma:0xdc2626,m_eper:0xf43f5e,m_malna:0xbe185d,m_cseresznye:0x991b1b,m_korte:0xa3e635,m_bodza:0xfef9c3};
function potState(P){const p=DD().pots[P.key];if(!p)return null;const left=p.end-Date.now();return{p,left,prog:cl(1-left/p.dur,0,1),ready:left<=0}}
function potVis(){const now=Date.now();POTS.forEach(P=>{const s=potState(P);if(!s){P.pl.visible=false;P.rd.visible=false;P.st.label='🪴 ÜRES CSERÉP [E]';return}P.pl.visible=true;const k=.15+s.prog*.85;P.pl.scale.setScalar(k);
 const c=SEEDC[s.p.s]||0xf472b6;P.fr.material.color.setHex(c);P.fr.material.emissive.setHex(c);P.fr.visible=s.prog>.6;P.rd.visible=s.ready;P.st.label=s.ready?'✅ SZÜRET [E]':'🌱 '+Math.ceil(s.left/1000)+' mp [E]'})}

// ===================== MÓDVÁLTÁS =====================
// bent: a köd 40 m-nél teljesen takar → a kamera is ott vág (a város nem rajzolódik a falak mögött); a kinti/benti NPC-k a másik oldalon rejtve
const inOut=()=>{CAM.far=INSIDE?40:500;CAM.updateProjectionMatrix();(FX.yardL||[]).forEach(l=>l.intensity=INSIDE?0:l.userData.i);NPC.forEach(n=>n.m.visible=(Math.abs(n.x)<=12&&Math.abs(n.z)<=3)===INSIDE)};
function goOut(){INSIDE=false;INCAR=false;px=13.2;pz=-.2;yaw=-Math.PI/2;pit=0;SC.fog.near=40;SC.fog.far=210;SC.fog.color.setHex(0x0b1026);HEMI.intensity=.55;MOON.intensity=.55;PAUSE=false;closeOvl();lockP();inOut();
 const t=$$('sp3t');if(t)t.innerHTML='🌃 VÁROS · WASD mozgás · SHIFT futás · <b>F</b> autó · <b>O</b> rendelések · <b>M</b> térkép · <b>E</b> interakció · <b>H</b> duda';$$('sp3mm').style.display='block';
 if(!DD()._cityIntro){DD()._cityIntro=1;toast('🕴️ <b>Csavaros Csaba:</b> „Nyomd meg az <b>O</b>-t, ott jönnek a rendelések. Az autó a telken áll – <b>F</b>-fel beszállsz!”')}}
function goIn(){if(INCAR)toggleCar();INSIDE=true;px=9.8;pz=-.2;yaw=Math.PI/2;pit=0;SC.fog.near=14;SC.fog.far=40;HEMI.intensity=0;MOON.intensity=0;closeOvl();lockP();inOut();
 const t=$$('sp3t');if(t)t.innerHTML='Kattints a nézelődéshez · WASD mozgás · SHIFT futás · E interakció · O rendelések · M térkép · F autó · ESC egér · 🟨 nyíl = következő cél';$$('sp3mm').style.display='none'}
window._sp3out=()=>{if(!ON)openSotet3D();setTimeout(goOut,60)};
function toggleCar(){if(INSIDE)return;if(INCAR){INCAR=false;const f=car.h;px=car.x+Math.cos(f)*2.2;pz=car.z-Math.sin(f)*2.2;if(hit(px,pz,.4)){px=car.x-Math.cos(f)*2.2;pz=car.z+Math.sin(f)*2.2}yaw=car.h+Math.PI;pit=0;car.v=0;toast('🚶 Kiszálltál');return}
 if(Math.hypot(px-car.x,pz-car.z)>4.5){toast('🚗 Menj közelebb az autóhoz!');return}INCAR=true;beep(220,.15,'sawtooth',.05);toast(veh().e+' <b>'+veh().n+'</b> · W gáz · S fék/hátra · A/D kormány · SHIFT turbó · F kiszállás')}
function hit(x,z,r){for(const b of COL)if(x+r>b[0]&&x-r<b[2]&&z+r>b[1]&&z-r<b[3])return true;return Math.abs(x)>132||Math.abs(z)>132}

// ===================== RENDELÉSEK / KISZÁLLÍTÁS =====================
function genOffer(){const d=DD(),dp=DP();const prods=dp.IT.filter(x=>x.t==='pr');const own=prods.filter(x=>d.inv[x.id]>0);const p=own.length&&Math.random()<.8?pick(own):pick(prods);const di=Math.floor(Math.random()*8);const DIS=dp.DIS[di];
 const n=Math.max(1,Math.min(1+Math.floor(Math.random()*(2+d.rep/40)),6));const[dx,dz]=DROPPOS[di];const dist=Math.hypot(dx,dz);const q=(d.inv[p.id+'_q']||55)/100;
 const pay=Math.round(p.p*DIS[2]*n*(.85+q*.6)*(1+d.rep/300)*1.25*(dp.mul?dp.mul(di,p.id):1));return{id:Math.random().toString(36).slice(2,7),di,pid:p.id,n,pay,tl:Math.round(45+dist/7+accB().time),exp:clock+150,who:pick(['Gizi néni','Rapper Robi','Diák Dani','Kapitány Karcsi','DJ Dóri','Mérnök Misi','Fesztivál Feri','Villa-Vilma','Taxis Tóni','Sportos Sanyi'])}}
function tickOffers(dt){OFFt-=dt;OFF=OFF.filter(o=>o.exp>clock);const mx=2+accB().ord;if(OFFt<=0&&OFF.length<mx){OFF.push(genOffer());OFFt=RN(14,26);if(!INSIDE||true){beep(880,.08,'sine',.05);setTimeout(()=>beep(1175,.1,'sine',.05),110)}const b=$$('sp3ob');if(b){b.textContent='📱 '+OFF.length+' új rendelés – O';b.style.display='block'}}
 const d=DD();d.cargo.forEach(c=>{c.left-=dt});const fail=d.cargo.filter(c=>c.left<=0);if(fail.length){fail.forEach(c=>{DP().addI(c.pid,c.n);d.rep=Math.max(0,d.rep-2);toast('⌛ Lejárt a rendelés ('+c.who+') – a cucc visszakerült, -2 hírnév')});d.cargo=d.cargo.filter(c=>c.left>0);DP().save()}}
function accept(id){const o=OFF.find(x=>x.id===id);if(!o)return;const d=DD(),dp=DP();if(!dp.has(o.pid,o.n)){toast('❌ Nincs elég: '+dp.ITM[o.pid].e+' '+dp.ITM[o.pid].n+' ('+(d.inv[o.pid]||0)+'/'+o.n+') – főzd meg előbb!');return}
 if(cargoN()+o.n>capTot()){toast('🎒 Nem fér el! Hely: '+cargoN()+'/'+capTot()+' – vegyél táskát vagy nagyobb kocsit.');return}
 dp.addI(o.pid,-o.n);d.cargo.push(Object.assign({},o,{left:o.tl}));OFF=OFF.filter(x=>x!==o);dp.save();toast('📦 Elfogadva! Vidd: '+dp.DIS[o.di][1]+' <b>'+dp.DIS[o.di][0]+'</b> – '+o.tl+' mp');ordUI()}
function deliver(di){const d=DD(),dp=DP();const cs=d.cargo.filter(c=>c.di===di);if(!cs.length){toast('🤷 '+dp.DIS[di][0]+': ide most nincs szállításod. Nyomd meg az O-t!');return}
 const a=accB();let tot=0,tip=0;cs.forEach(c=>{const sp=c.left/c.tl;const t=sp>.5?.25:sp>.25?.1:0;const p=Math.round(c.pay*(1+a.pay)*(1+t));tot+=p;tip+=Math.round(c.pay*t);d.stats.sold+=c.n;d.stats.earned+=p});
 d.cash+=tot;d.rep+=cs.length*(1+a.rep+(veh().rep||0));dp.heat(dp.DIS[di][3]/10*cs.length*(dp.hMul?dp.hMul(di):1));if(dp.satAdd)dp.satAdd(di,cs.reduce((a,c)=>a+c.n,0));d.cargo=d.cargo.filter(c=>c.di!==di);d.ord=(d.ord||0)+cs.length;
 dp.log('🚗 Kiszállítás – '+dp.DIS[di][0]+': '+cs.map(c=>c.n+'× '+dp.ITM[c.pid].n).join(', ')+' → '+dp.f$(tot));dp.save();beep(660,.1,'triangle',.07);setTimeout(()=>beep(990,.15,'triangle',.07),120);
 toast('💸 <b>+'+dp.f$(tot)+'</b>'+(tip?' (borravaló '+dp.f$(tip)+')':'')+' · '+cs[0].who+': „Köszi, főnök!”')}
function tickPolice(dt){const d=DD();POL.forEach(P=>{P.p=(P.p+P.sp*dt*(30/P.r))%1;const r=P.r,s=P.p*4,seg=Math.floor(s),f=s-seg;const C=[[-r,-r],[r,-r],[r,r],[-r,r]];const a=C[seg],b=C[(seg+1)%4];const x=a[0]+(b[0]-a[0])*f,z=a[1]+(b[1]-a[1])*f;P.g.position.set(x,0,z);P.g.rotation.y=Math.atan2(b[0]-a[0],b[1]-a[1]);const fl=Math.floor(clock*6)%2;P.g.userData.r.material.emissiveIntensity=fl?4:.2;P.g.userData.b.material.emissiveIntensity=fl?.2:4;P.x=x;P.z=z});
 if(INSIDE||WCD>0){WCD-=dt;WANT=Math.max(0,WANT-dt*.3);return}const me=INCAR?car:{x:px,z:pz};const a=accB();const rng=18*(1-a.det)*(1+d.heat/100);const nearP=POL.some(P=>Math.hypot(P.x-me.x,P.z-me.z)<rng);
 if(nearP&&d.cargo.length){WANT+=dt*(.22+d.heat/250)*(INCAR&&Math.abs(car.v)>veh().sp*.8?1.4:1)}else WANT=Math.max(0,WANT-dt*.12);
 if(WANT>=1){WANT=0;WCD=25;try{document.exitPointerLock()}catch(e){}toast('🚨 <b>MEGÁLLJ! RENDŐRSÉG!</b>');beep(500,.4,'sawtooth',.08);const g=INCAR?DP().MG.chase:DP().MG.alley;setTimeout(()=>g(sc=>{if(sc<.4){DP().bust();toast('🚔 Elkaptak! Razzia…');goIn()}else{DP().heat(-10);toast('😎 Leráztad a zsarukat!')}DP().save();lockP()}),400)}}

// ===================== ÉLŐ VÁROS (11-09): gyalogosok, forgalom, füst, razzia-jelenet, neon-villogás =====================
const LIFE={peds:[],cars:[],smoke:[],raid:null,neon:[],raidOn:false,raidMsg:0};
function smokeTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.5,'rgba(220,220,235,.35)');g.addColorStop(1,'rgba(200,200,220,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
function mkWalker(col){const g=new THREE.Group();const skin=MB(0xf1c27d),cm=MB(col,{roughness:.8}),pm=MB(pick([0x1f2937,0x334155,0x1e3a8a,0x3f3f46]));
 box(.42,.62,.24,cm,0,1.15,0,g);sph(.15,skin,0,1.62,0,g);const hair=sph(.155,MB(pick([0x1c1917,0x78350f,0xfacc15,0x9ca3af])),0,1.68,-.02,g);hair.scale.set(1,.6,1);
 const legs=[],arms=[];[-.11,.11].forEach(o=>{const lp=new THREE.Group();lp.position.set(o,.84,0);g.add(lp);box(.15,.8,.17,pm,0,-.4,0,lp);legs.push(lp);
  const ap=new THREE.Group();ap.position.set(o*2.4,1.42,0);g.add(ap);box(.1,.55,.12,cm,0,-.27,0,ap);arms.push(ap)});g.userData={legs,arms};SC.add(g);return g}
function buildLife(){const ROADS=[-90,-30,30,90];
 // 1) járókelők a járdákon (oda-vissza sétálnak, lábak/karok lengenek)
 for(let i=0;i<18;i++){let v,side,ax,t0,tr=0;do{v=pick(ROADS);side=pick([-6,6,-7.5,7.5]);ax=Math.random()<.5?'x':'z';t0=RN(-120,120)}while(tr++<60&&(ax==='x'?hit(t0,v+side,.5):hit(v+side,t0,.5)));const g=mkWalker(pick([0xef4444,0x22c55e,0x3b82f6,0xeab308,0xa855f7,0xf97316,0x14b8a6,0xe5e7eb]));
  const p={g,ax,line:v+side,t:t0,dir:pick([-1,1]),sp:RN(1.1,1.8),ph:Math.random()*6,stop:0};LIFE.peds.push(p)}
 // 2) civil forgalom az utakon (jobb oldali sáv, a végén visszafordul a másik sávba)
 for(let i=0;i<9;i++){const g=makeCar(pick([0xdc2626,0x2563eb,0xf8fafc,0x16a34a,0xf59e0b,0x0f172a,0x7c3aed]),false);SC.add(g);
  const hl=EM(0xfef9c3,2.5);[-.6,.6].forEach(o=>box(.35,.18,.05,hl,o,.75,2.12,g));
  LIFE.cars.push({g,ax:Math.random()<.5?'x':'z',road:pick(ROADS),t:RN(-120,120),dir:pick([-1,1]),sp:RN(9,14),v:0})}
 // 3) füst a lakókocsi kéményéből és a labor szellőzőjéből
 const st=smokeTex();box(.5,.9,.5,MB(0x374151,{metalness:.6}),-6,3.35,-1);box(.4,.5,.4,MB(0x475569,{metalness:.6}),4,3.15,1.2);
 [[-6,3.85,-1],[4,3.45,1.2]].forEach((src,si)=>{for(let i=0;i<14;i++){const m=new THREE.SpriteMaterial({map:st,transparent:true,depthWrite:false,opacity:0,color:si?0xe9d5ff:0xcbd5e1});const s=new THREE.Sprite(m);SC.add(s);LIFE.smoke.push({s,src,age:i/14*5,life:5})}});
 // 4) razzia-jelenet (magas hőnél): 2 rendőrautó a telek előtt, rendőrök, VALÓDI villogó fény + keresőfény
 const rg=new THREE.Group();rg.visible=false;SC.add(rg);const c1=makeCar(0xf8fafc,true);c1.position.set(18,0,-7);c1.rotation.y=-.6;rg.add(c1);const c2=makeCar(0xf8fafc,true);c2.position.set(19,0,7);c2.rotation.y=Math.PI+.5;rg.add(c2);
 const cops=[];[[15.5,-4.5],[16,4.2],[20.5,0]].forEach(([x,z])=>{const c=mkWalker(0x1e3a8a);SC.remove(c);c.position.set(x,0,z);c.rotation.y=-Math.PI/2;const cap=cyl(.17,.17,.08,MB(0x0f172a),0,1.78,0,10,c);rg.add(c);cops.push(c)});
 const L=new PL(0xff0000,0,26,2);L.position.set(18.5,3,0);SC.add(L);const spot=new THREE.SpotLight(0xffffff,0,60,.35,.5,1.5);spot.position.set(19,9,0);SC.add(spot);SC.add(spot.target);
 const tape=new THREE.Mesh(new THREE.PlaneGeometry(14,.35),new THREE.MeshBasicMaterial({color:0xfacc15,side:THREE.DoubleSide}));tape.position.set(14.5,1,0);tape.rotation.y=Math.PI/2;rg.add(tape);
 LIFE.raid={g:rg,L,spot,cops,cars:[c1,c2]};
 // 5) villogó neonok (a város reklámtáblái közül néhány)
 SC.traverse(o=>{if(o.isMesh&&o.material&&o.material.map&&o.material.map.image&&o.material.map.image.tagName==='CANVAS'&&o.material.emissive&&!(Math.abs(o.position.x)<11.3&&Math.abs(o.position.z)<2.36)&&Math.random()<.5)LIFE.neon.push({o,b:o.material.emissiveIntensity||1,ph:Math.random()*9})})}
function tickLife(dt){if(!LIFE.peds.length)return;const me=INCAR?car:{x:px,z:pz};
 LIFE.peds.forEach(p=>{const pp=p.ax==='x'?{x:p.t,z:p.line}:{x:p.line,z:p.t};const nearMe=Math.hypot(pp.x-me.x,pp.z-me.z)<1.4;const nearCar=INCAR&&Math.hypot(pp.x-car.x,pp.z-car.z)<4;
  if(nearCar){p.t-=p.dir*dt*4}else if(!nearMe){const nt=p.t+p.dir*p.sp*dt,np=p.ax==='x'?{x:nt+p.dir*.3,z:p.line}:{x:p.line,z:nt+p.dir*.3};
   const blk=(hit(np.x,np.z,.3)&&!hit(pp.x,pp.z,.3))||Math.hypot(np.x-car.x,np.z-car.z)<2.4&&Math.hypot(pp.x-car.x,pp.z-car.z)>=2.4;if(blk)p.dir*=-1;else p.t=nt}if(p.t>125||p.t<-125)p.dir*=-1;p.ph+=dt*p.sp*5*(nearMe?0:1);
  const g=p.g;if(p.ax==='x'){g.position.set(p.t,0,p.line);g.rotation.y=p.dir>0?Math.PI/2:-Math.PI/2}else{g.position.set(p.line,0,p.t);g.rotation.y=p.dir>0?0:Math.PI}
  const s=Math.sin(p.ph)*.6;g.userData.legs[0].rotation.x=s;g.userData.legs[1].rotation.x=-s;g.userData.arms[0].rotation.x=-s*.8;g.userData.arms[1].rotation.x=s*.8;g.position.y=Math.abs(Math.cos(p.ph))*.04;g.visible=!INSIDE});
 LIFE.cars.forEach(c=>{const lane=c.road+(c.dir>0?-2.5:2.5)*(c.ax==='x'?1:-1);const x=c.ax==='x'?c.t:lane,z=c.ax==='x'?lane:c.t;
  const ahead=c.ax==='x'?{x:x+c.dir*5,z}:{x,z:z+c.dir*5};c.x=x;c.z=z;
  if(hit(ahead.x,ahead.z,1)&&!hit(x,z,1)){c.dir*=-1;c.v=0}
  const block=Math.hypot(ahead.x-me.x,ahead.z-me.z)<3.2||(!INCAR&&Math.hypot(ahead.x-car.x,ahead.z-car.z)<3.4)||LIFE.cars.some(o=>o!==c&&o.x!=null&&Math.hypot(ahead.x-o.x,ahead.z-o.z)<3)||LIFE.peds.some(p=>p.g.position.distanceToSquared(_V3.set(ahead.x,0,ahead.z))<4);const tgt=block?0:c.sp;c.v+=(tgt-c.v)*Math.min(1,dt*(block?6:1.5));
  if(block&&!c.hk){c.hk=1;beep(330,.18,'square',.04)}if(!block)c.hk=0;c.t+=c.dir*c.v*dt;if(c.t>128||c.t<-128){c.dir*=-1;c.t=cl(c.t,-128,128)}
  c.g.position.set(x,0,z);c.g.rotation.y=c.ax==='x'?(c.dir>0?Math.PI/2:-Math.PI/2):(c.dir>0?0:Math.PI);c.g.visible=!INSIDE});
 LIFE.smoke.forEach(m=>{m.age+=dt;if(m.age>m.life)m.age-=m.life;const k=m.age/m.life;m.s.position.set(m.src[0]+Math.sin(m.age*1.3+m.src[2])*.3+k*1.5,m.src[1]+k*4.5,m.src[2]+k*.8);m.s.scale.setScalar(.5+k*2.4);m.s.material.opacity=INSIDE?0:(k<.15?k/.15:1-k)*.5});
 const d=DD(),R0=LIFE.raid;const want=d.heat>=70&&!INSIDE;if(want!==LIFE.raidOn){LIFE.raidOn=want;R0.g.visible=want;if(want&&clock-LIFE.raidMsg>60){LIFE.raidMsg=clock;toast('🚨 <b>Szigorú Szilárd:</b> „Tudom, hogy itt vagy!” – rendőrök a telek előtt. Csökkentsd a hőt (alvás, alibi, ügyvéd)!');beep(520,.3,'sawtooth',.06)}}
 if(want){const f=Math.floor(clock*5)%2;R0.L.color.setHex(f?0xff1e1e:0x2563eb);R0.L.intensity=3.2;R0.spot.intensity=2.2;R0.spot.target.position.set(Math.sin(clock*.7)*9,0,Math.cos(clock*.5)*5);
  R0.cars.forEach(c=>{c.userData.r.material.emissiveIntensity=f?4:.2;c.userData.b.material.emissiveIntensity=f?.2:4});R0.cops.forEach((c,i)=>{c.rotation.y=-Math.PI/2+Math.sin(clock*.8+i)*.6;c.userData.arms[0].rotation.x=-1.2+Math.sin(clock*3+i)*.3})}
 else{R0.L.intensity=0;R0.spot.intensity=0}
 LIFE.neon.forEach(n=>{const fl=Math.sin(clock*13+n.ph)>.93||Math.sin(clock*.7+n.ph)>.985;n.o.material.emissiveIntensity=fl?n.b*.15:n.b})}
window._sp3life=LIFE;

// ===================== OVERLAY-K (boltok, cserép, rendelések, térkép) =====================
function ovl(html){OVL=OVL||(()=>{const o=document.createElement('div');o.id='sp3o';o.style.cssText='position:absolute;inset:0;z-index:5;background:rgba(2,6,23,.72);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';$$('sp3').appendChild(o);o.addEventListener('click',e=>{if(e.target===o)closeOvl()});return o})();
 PAUSE=true;try{document.exitPointerLock()}catch(e){}OVL.style.display='flex';OVL.innerHTML='<div style="width:min(860px,94vw);max-height:84vh;overflow:auto;background:linear-gradient(160deg,#1e1b4b,#0f172a);border:2px solid #a78bfa;border-radius:18px;padding:16px 18px;color:#e2e8f0;font:14px system-ui;box-shadow:0 20px 60px #000c,0 0 40px #7c3aed55">'+html+'<div style="text-align:right;margin-top:10px"><button id="sp3oc" style="background:#ef4444;color:#fff;border:0;border-radius:10px;padding:8px 16px;font-weight:800;cursor:pointer">✕ Bezár (Esc)</button></div></div>';$$('sp3oc').onclick=closeOvl}
function closeOvl(){if(OVL&&OVL.style.display!=='none'){OVL.style.display='none';PAUSE=false;lockP()}}
const ovlOpen=()=>OVL&&OVL.style.display==='flex';
const CARD='background:#1e293bcc;border:1px solid #334155;border-radius:12px;padding:10px;font-size:13px';const BTN=(t,a,dis,c)=>'<button '+a+' '+(dis?'disabled':'')+' style="margin:4px 4px 0 0;background:'+(c||'linear-gradient(#8b5cf6,#6d28d9)')+';color:#fff;border:0;border-radius:9px;padding:6px 11px;font-weight:800;cursor:pointer;opacity:'+(dis?.4:1)+'">'+t+'</button>';
const head=(t,s)=>'<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px"><h2 style="margin:0;font-size:22px;background:linear-gradient(90deg,#f0abfc,#67e8f9);-webkit-background-clip:text;color:transparent">'+t+'</h2><span style="margin-left:auto;font-weight:800;background:#0f172a;padding:5px 10px;border-radius:9px">💰 '+DP().f$(DD().cash)+'</span></div>'+(s?'<div style="opacity:.8;margin-bottom:10px">'+s+'</div>':'');
function openPanel(t){PAUSE=true;try{document.exitPointerLock()}catch(e){}window.openSotetProgram(t)}
function shopUI(cat){const dp=DP(),d=DD();const T={ac:['🕶️ ÁRNYÉK BUTIK','Kiegészítők – helyenként egy viselhető. Bónuszt adnak a kiszállításhoz.'],sd:['🌱 ZÖLD KÉZ KERTÉSZET','Magok a cserepekbe. A lakókocsi párkánya biztonságos, a közkert gyorsabb (+25%), de feltűnőbb.'],lm:['⚛️ LABOR-SZAKÜZLET','A modulok megjelennek a 3D laborban, és végleges bónuszt adnak a laborfőzéshez.'],food:['🍔 ÉJJELI BÜFÉ','Energia és apró boostok – azonnal felhasználod.']}[cat];
 let items=cat==='food'?dp.IT.filter(x=>x.t==='bo'):dp.IT.filter(x=>x.t===cat);if(cat==='lm')items=items.concat(dp.IT.filter(x=>x.t==='eq'&&x.br==='lab'));
 const row=x=>{const own=cat==='lm'&&x.t==='lm'?d.lm[x.id]:cat==='ac'?d.inv[x.id]>0:false;const worn=cat==='ac'&&d.acc[x.s]===x.id;let b='';
  if(cat==='ac'){b=own?(worn?BTN('Levesz','data-un="'+x.s+'"',0,'#475569'):BTN('Felvesz','data-wr="'+x.id+'"',0,'linear-gradient(#22c55e,#15803d)')):BTN('Vétel','data-by="'+x.id+'"',d.cash<x.p)}
  else if(cat==='food')b=BTN('Vétel + fogyasztás','data-ea="'+x.id+'"',d.cash<x.p);
  else if(x.t==='lm')b=own?'<b style="color:#86efac">✔ BESZERELVE</b>':BTN('Beszerelés','data-by="'+x.id+'"',d.cash<x.p);
  else if(x.t==='eq'){const lock=x.lv>(d.lvl[x.br]||1)+1;b=d.inv[x.id]?'<b style="color:#86efac">✔ megvan</b>':BTN(lock?'🔒 '+(x.lv-1)+'. szint':'Vétel','data-by="'+x.id+'"',lock||d.cash<x.p)}
  else b=BTN('Vétel','data-by="'+x.id+'"',d.cash<x.p)+(x.tool?'':BTN('×5','data-b5="'+x.id+'"',d.cash<x.p*5,'#334155'));
  return'<div style="'+CARD+(worn?';border-color:#22c55e;box-shadow:0 0 12px #22c55e55':'')+'"><div style="font-size:28px">'+x.e+'</div><b>'+x.n+'</b><br>'+dp.f$(x.p)+(x.d?'<br><small style="opacity:.8">'+x.d+'</small>':'')+(cat==='sd'?'<br><small>Van: '+(d.inv[x.id]||0)+'</small>':'')+'<br>'+b+'</div>'};
 ovl(head(T[0],T[1])+(cat==='ac'?'<div style="'+CARD+';margin-bottom:10px">Viselve: '+(Object.entries(d.acc).map(([s,id])=>dp.ITM[id].e+' '+dp.ITM[id].n).join(' · ')||'semmi')+'</div>':'')+'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:9px">'+items.map(row).join('')+'</div>');
 const buy=(id,n)=>{const x=dp.ITM[id];const c=x.p*n;if(d.cash<c){toast('Nincs elég Ft!');return}d.cash-=c;if(x.t==='lm'){d.lm[id]=1;showMods();beep(440,.2,'triangle');toast('⚛️ '+x.n+' beszerelve a laborba!')}dp.addI(id,n);dp.log('🛒 '+n+'× '+x.e+' '+x.n);dp.save();shopUI(cat)};
 OVL.querySelectorAll('[data-by]').forEach(b=>b.onclick=()=>buy(b.dataset.by,1));OVL.querySelectorAll('[data-b5]').forEach(b=>b.onclick=()=>buy(b.dataset.b5,5));
 OVL.querySelectorAll('[data-wr]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.wr];d.acc[x.s]=x.id;dp.save();shopUI(cat)});OVL.querySelectorAll('[data-un]').forEach(b=>b.onclick=()=>{delete d.acc[b.dataset.un];dp.save();shopUI(cat)});
 OVL.querySelectorAll('[data-ea]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.ea];if(d.cash<x.p)return;d.cash-=x.p;dp.addI(x.id,1);dp.save();try{_dp().D===d&&useB(x.id)}catch(e){}shopUI(cat)})}
function useB(id){const dp=DP(),d=DD(),x=dp.ITM[id];dp.addI(id,-1);const t=x.d||'';if(/energia/.test(t))d.en=cl(d.en+parseInt(t.match(/\d+/)[0]),0,150);if(/-(\d+) hő/.test(t))dp.heat(-parseInt(t.match(/-(\d+) hő/)[1]));if(/\+(\d+) hírnév/.test(t))d.rep+=parseInt(t.match(/\+(\d+) hírnév/)[1]);if(id==='bonusz')d.purity=(d.purity||0)+3;dp.save();toast(x.e+' '+x.n+' – '+t)}
function carUI(){const dp=DP(),d=DD();ovl(head('🚗 ROZSDÁS AUTÓKERESKEDÉS','Nagyobb kocsi = több fér bele. Gyorsabb = nagyobb borravaló. A kiválasztott jármű áll a telken.')+'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:9px">'+Object.entries(VEH).map(([id,v])=>{const own=id==='berelt'||d.own[id];const sel=d.veh===id;const pr=id==='berelt'?0:dp.ITM[id].p;
  return'<div style="'+CARD+(sel?';border-color:#facc15;box-shadow:0 0 14px #facc1555':'')+'"><div style="font-size:30px">'+v.e+'</div><b>'+v.n+'</b><br>⚡ '+v.sp*6+' km/h · 📦 '+v.cap+' hely'+(v.rep?' · ⭐ +hírnév':'')+'<br>'+(own?(sel?'<b style="color:#facc15">★ KIVÁLASZTVA</b>':BTN('Kiválaszt','data-se="'+id+'"',0,'linear-gradient(#22c55e,#15803d)')):dp.f$(pr)+'<br>'+BTN('Vétel','data-bv="'+id+'"',d.cash<pr))+'</div>'}).join('')+'</div>');
 OVL.querySelectorAll('[data-se]').forEach(b=>b.onclick=()=>{d.veh=b.dataset.se;dp.save();rebuildCar();carUI()});OVL.querySelectorAll('[data-bv]').forEach(b=>b.onclick=()=>{const id=b.dataset.bv,x=dp.ITM[id];if(d.cash<x.p)return;d.cash-=x.p;d.own[id]=1;dp.addI(id,1);d.veh=id;dp.log('🚗 Vettél: '+x.n);dp.save();rebuildCar();beep(300,.3,'sawtooth');carUI()})}
function potUI(P){const dp=DP(),d=DD();const s=potState(P);
 if(P.scope==='in'&&+P.key.slice(2)>=2+Math.min(4,d.inv.cserep||0)){toast('🪴 Ez a hely még üres – vegyél virágcserepet a kertészetben!');return}
 if(s&&s.ready){const it=dp.ITM[s.p.s];const y=it.y+(s.p.tr?2:0);dp.addI(it.g,y);delete d.pots[P.key];if(P.scope==='out')dp.heat(1);dp.log('🌾 Szüret: '+y+'× '+dp.ITM[it.g].n);dp.save();beep(784,.12,'triangle');toast('🌾 Szüret: <b>'+y+'× '+dp.ITM[it.g].e+' '+dp.ITM[it.g].n+'</b>');potVis();return}
 if(s){const w=!s.p.w&&d.inv.locsolo;ovl(head('🌱 '+dp.ITM[s.p.s].n,'Növekszik: '+Math.round(s.prog*100)+'% · még '+Math.ceil(s.left/1000)+' mp')+'<div style="height:12px;background:#0f172a;border-radius:6px;overflow:hidden"><i style="display:block;height:100%;width:'+s.prog*100+'%;background:linear-gradient(90deg,#22c55e,#a3e635)"></i></div><br>'+(s.p.w?'💧 Már meglocsoltad.':w?BTN('🚿 Locsolás (-40% idő)','id="sp3wt"',0,'linear-gradient(#0ea5e9,#0369a1)'):'<i>Locsolókanna a kertészetben kapható.</i>'));
  const wt=$$('sp3wt');if(wt)wt.onclick=()=>{const rem=s.p.end-Date.now();s.p.end=Date.now()+rem*.6;s.p.w=1;dp.save();toast('💧 Meglocsolva!');closeOvl();potVis()};return}
 const seeds=dp.IT.filter(x=>x.t==='sd'&&!x.tool&&d.inv[x.id]>0);
 ovl(head('🪴 '+(P.scope==='in'?'Párkány-cserép (biztonságos)':'Közkerti cserép (+25% gyorsabb, kis hő)'),'Válassz magot! '+(d.inv.tragya?'💩 Csodatrágya lesz használva (+2 termés).':''))+(seeds.length?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:9px">'+seeds.map(x=>'<div style="'+CARD+'"><div style="font-size:26px">'+x.e+'</div><b>'+x.n+'</b><br>→ '+x.y+'× '+dp.ITM[x.g].e+' '+dp.ITM[x.g].n+'<br>⏱️ '+x.m+' perc'+(P.scope==='out'?' → '+(x.m*.75).toFixed(1):'')+'<br>Van: '+d.inv[x.id]+'<br>'+BTN('Ültetés','data-pl="'+x.id+'"',0,'linear-gradient(#22c55e,#15803d)')+'</div>').join('')+'</div>':'<div style="'+CARD+'">Nincs magod. 🌱 A <b>🌱 Zöld Kéz Kertészet</b> a nyugati kerületben van – nézd meg a térképen (M).</div>'));
 OVL.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{const x=dp.ITM[b.dataset.pl];dp.addI(x.id,-1);const dur=x.m*60000*(P.scope==='out'?.75:1);const tr=d.inv.tragya>0;if(tr)dp.addI('tragya',-1);d.pots[P.key]={s:x.id,end:Date.now()+dur,dur,w:0,tr:tr?1:0};if(P.scope==='out')dp.heat(2);dp.save();toast('🌱 Elültetve: '+x.n);closeOvl();potVis()})}
function ordUI(){const dp=DP(),d=DD();const ob=$$('sp3ob');if(ob)ob.style.display='none';
 ovl(head('📱 CSABA TELEFONJA – RENDELÉSEK','Hely: <b>'+cargoN()+'/'+capTot()+'</b> ('+veh().e+' '+veh().n+' + táska) · A gyors szállításért borravaló jár!')+
 '<h3 style="margin:6px 0">🚚 Úton lévő szállítások</h3>'+(d.cargo.length?d.cargo.map(c=>'<div style="'+CARD+';margin-bottom:6px;display:flex;gap:10px;align-items:center"><span style="font-size:24px">'+dp.ITM[c.pid].e+'</span><div><b>'+c.n+'× '+dp.ITM[c.pid].n+'</b> → '+dp.DIS[c.di][1]+' '+dp.DIS[c.di][0]+' ('+c.who+')<br>💰 '+dp.f$(c.pay)+' · ⏱️ <b style="color:'+(c.left<20?'#f87171':'#86efac')+'">'+Math.ceil(c.left)+' mp</b></div></div>').join(''):'<i>Nincs.</i>')+
 '<h3 style="margin:12px 0 6px">📨 Új ajánlatok</h3>'+(OFF.length?'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:9px">'+OFF.map(o=>{const ok=dp.has(o.pid,o.n);return'<div style="'+CARD+'"><b>'+o.who+'</b> · '+dp.DIS[o.di][1]+' '+dp.DIS[o.di][0]+(dp.evOf&&dp.evOf(o.di)&&(!dp.evOf(o.di).br||dp.evOf(o.di).br===dp.ITM[o.pid].br)?' <span style="font-size:11px;background:#7c3aed55;border-radius:99px;padding:1px 7px">'+dp.evOf(o.di).n+'</span>':'')+'<br><span style="font-size:22px">'+dp.ITM[o.pid].e+'</span> '+o.n+'× '+dp.ITM[o.pid].n+'<br>Van: <b style="color:'+(ok?'#86efac':'#f87171')+'">'+(d.inv[o.pid]||0)+'</b> · 💰 <b>'+dp.f$(o.pay)+'</b> · ⏱️ '+o.tl+' mp<br>'+BTN('✔ Elfogad','data-ac="'+o.id+'"',!ok)+BTN('✕','data-rj="'+o.id+'"',0,'#475569')+'</div>'}).join('')+'</div>':'<i>Most csend van… pár másodperc múlva jön új rendelés.</i>'));
 OVL.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>accept(b.dataset.ac));OVL.querySelectorAll('[data-rj]').forEach(b=>b.onclick=()=>{OFF=OFF.filter(o=>o.id!==b.dataset.rj);ordUI()})}
function showMods(){const L=DD().lm;for(const k in MODS)MODS[k].visible=!!L[k];if(FX.labL)FX.labL.forEach(l=>l.color.setHex(L.lm_neon?0xc4b5fd:0xf1f5ff))}

// ===================== TÉRKÉP =====================
function drawMap(cv,big){const x=cv.getContext('2d'),W=cv.width,sc=W/270,T=v=>(v+135)*sc;x.fillStyle='#0b1026';x.fillRect(0,0,W,W);x.fillStyle='#14532d55';x.fillRect(0,0,W,W);
 x.fillStyle='#475569';[-90,-30,30,90].forEach(v=>{x.fillRect(0,T(v)-5*sc,W,10*sc);x.fillRect(T(v)-5*sc,0,10*sc,W)});x.fillStyle='#1e293b';COL.forEach(b=>{if(b[2]-b[0]>2)x.fillRect(T(b[0]),T(b[1]),(b[2]-b[0])*sc,(b[3]-b[1])*sc)});
 x.fillStyle='#a78bfa';x.fillRect(T(-11.4),T(-2.5),22.8*sc,5*sc);SHOPP.forEach(q=>{x.fillStyle=q.fg;x.fillRect(T(q.x-6),T(q.z-5),12*sc,10*sc);x.font=(big?'18':'11')+'px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(q.e,T(q.x),T(q.z+q.f*(big?13:12)));if(big){x.fillStyle='#fff';x.font='bold 11px system-ui';x.fillText(q.n,T(q.x),T(q.z-q.f*10))}});x.textBaseline='alphabetic';
 const d=DD(),tg=new Set(d.cargo.map(c=>c.di));DROPPOS.forEach(([a,b],i)=>{x.fillStyle=tg.has(i)?'#22c55e':'#fca5a580';x.beginPath();x.arc(T(a),T(b),(tg.has(i)?6:3.5)*(big?1.6:1),0,7);x.fill();if(big){x.fillStyle='#fff';x.font='bold 12px system-ui';x.textAlign='center';x.fillText(DP().DIS[i][0],T(a),T(b)-12)}});
 POTS.forEach(P=>{if(P.scope!=='out')return;const s=potState(P);x.fillStyle=s?(s.ready?'#a3e635':'#15803d'):'#78716c';x.fillRect(T(P.x)-2,T(P.z)-2,4,4)});
 x.fillStyle='#e2e8f0';LIFE.peds.forEach(p=>{const g=p.g.position;x.fillRect(T(g.x)-1,T(g.z)-1,2,2)});x.fillStyle='#94a3b8';LIFE.cars.forEach(c=>{const g=c.g.position;x.fillRect(T(g.x)-2.5,T(g.z)-2.5,5,5)});
 if(GUIDE.t&&GUIDE.t.out){x.strokeStyle='#facc15';x.lineWidth=2;x.beginPath();x.arc(T(GUIDE.t.x),T(GUIDE.t.z),big?11:7,0,7);x.stroke()}
 POL.forEach(P=>{x.fillStyle=Math.floor(clock*6)%2?'#ef4444':'#3b82f6';x.beginPath();x.arc(T(P.x),T(P.z),big?6:4,0,7);x.fill()});
 x.fillStyle='#fde047';x.beginPath();x.arc(T(car.x),T(car.z),big?5:3,0,7);x.fill();
 const mx=INCAR?car.x:px,mz=INCAR?car.z:pz,h=INCAR?car.h:yaw+Math.PI;x.save();x.translate(T(mx),T(mz));x.rotate(-h+Math.PI);x.fillStyle='#fff';x.beginPath();x.moveTo(0,-8);x.lineTo(5,6);x.lineTo(-5,6);x.fill();x.restore();
 if(big){x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';x.fillText('🟢 leadás · 🔴🔵 rendőr · 🟡 autó · 🟣 lakókocsi · 🏪 boltok · ▪ cserép · ⚪ járókelő · ◽ forgalom · 🟨 cél',10,W-12)}}

// ===================== ÚTMUTATÓ (11-09): küldetés + célnyíl =====================
const HINT={lab:'főzés (3D keverés-minijáték)',labup:'labor-modulok vásárlása',pal:'pálinkafőzés (3D üst)',pal2:'pályázatírás (3D pecsételés)',home:'küldetések, statisztika, pénzmosás',inv:'raktár',party:'afterparti (3D DJ-pult)',shop:'Csaba hűtője – bolt',out:'ki a városba',enter:'vissza a lakókocsiba',car:'beszállás / kiszállás',pack:'csomagolás futószalagon – Ft',mg3:'minden 3D műszak egy helyen',futar:'sürgős fuvar időre – Ft'};
const GUIDE={t:null,txt:'',k:0};
const QST={0:'lab',2:'pal',3:'pal2',4:'party'};
function guide(){const dp=DP();if(!dp||!dp.STORY)return;const d=DD(),me=INCAR?car:{x:px,z:pz};let t=null,txt='';const st=id=>{const s=ST.find(z=>z.id===id);return s?{x:s.x,z:s.z,out:s.scope==='out',n:s.label.replace(/ \[[EF]\]/,'')}:null};
 if(d.cargo.length){if(INSIDE)t=st('out');else{let bd=1e9;d.cargo.forEach(c=>{const[a,b]=DROPPOS[c.di],dd=Math.hypot(a-me.x,b-me.z);if(dd<bd){bd=dd;t={x:a,z:b,out:true,n:'📦 '+dp.DIS[c.di][0]}}})}}
 const q=dp.STORY[d.sq];if(q){const[a,b]=q.g();const done=a>=b-1e-9;txt=(done?'✅ ':'🎯 ')+q.t+' · '+(Number.isInteger(a)?Math.min(a,b)+'/'+b:Math.round(a/b*100)+'%')+(done?' – jelentsd a Főhadiszálláson!':'');
  if(!t){const id=done?'home':QST[d.sq];if(id){t=st(id);if(t&&!t.out&&!INSIDE)t=st('enter')}else if(d.sq===1||d.sq===7){if(INSIDE)t=st('out');txt+=' · 📱 O = rendelések'}}}
 else txt='📖 A történet véget ért – szabad játék';GUIDE.t=t;GUIDE.txt=txt}
function guideDraw(){const a=$$('sp3ar'),t=GUIDE.t;if(!a)return;if(!t){if(a.style.display!=='none')a.style.display='none';return}
 const me=INCAR?car:{x:px,z:pz},dx=t.x-me.x,dz=t.z-me.z,dist=Math.hypot(dx,dz);let r,f;if(INCAR){r=-dx*Math.cos(car.h)+dz*Math.sin(car.h);f=dx*Math.sin(car.h)+dz*Math.cos(car.h)}else{r=dx*Math.cos(yaw)-dz*Math.sin(yaw);f=-dx*Math.sin(yaw)-dz*Math.cos(yaw)}
 const ang=Math.round(Math.atan2(r,f)*57.3/3)*3,h='<span style="display:inline-block;transform:rotate('+ang+'deg);color:#facc15;font-size:20px">⬆</span> '+t.n+' · <b>'+Math.round(dist)+' m</b>';if(a._h!==h){a._h=h;a.innerHTML=h}a.style.display='block'}

// ===================== FŐCIKLUS =====================
function stepNear(){near=null;let bd=INSIDE?1.6:(INCAR?5.5:3.2);const fx=-Math.sin(yaw),fz=-Math.cos(yaw);const mx=INCAR?car.x:px,mz=INCAR?car.z:pz;const sc=INSIDE?'in':'out';
 if(FX.carS){FX.carS.x=car.x;FX.carS.z=car.z;FX.carS.sp.position.set(car.x,2.6,car.z);FX.carS.sp.visible=!INCAR&&!INSIDE}
 ST.forEach(s=>{if(s.scope!==sc)return;if(INCAR&&!/^drop/.test(s.id))return;const dx=s.x-mx,dz=s.z-mz,d=Math.hypot(dx,dz);const dot=INCAR?1:(dx*fx+dz*fz)/(d||1);if(d<bd&&dot>.2){bd=d;near=s}});
 ST.forEach(s=>{const on=s===near,w=s.sp.userData.w||1.6;s.sp.material.opacity=on?1:.85;s.sp.scale.set(w*(on?1.15:1),w*.19*(on?1.15:1),1);if(s!==FX.carS)s.sp.visible=(s.scope==='in')===INSIDE}); // a kinti feliratok ne látszódjanak át a labor falán (és fordítva)
 const pr=$$('sp3p');const hn=near&&(HINT[near.id]||(/^drop/.test(near.id)?'rendelés leadása':/^shop_/.test(near.id)?'bolt':/^pot_/.test(near.id)?'ültetés / szüret':''));const h=near?'<b>['+(near.id==='car'?'F':'E')+']</b> '+near.label.replace(/ \[[EF]\]/,'')+(hn?' <span style="font-weight:500;opacity:.8;font-size:14px">– '+hn+'</span>':''):'';if(pr._h!==h){pr._h=h;pr.innerHTML=h;pr.style.display=h?'block':'none'}}
function interact(){if(!near)return;if(near.id==='car'){toggleCar();return}PAUSE=true;try{document.exitPointerLock()}catch(e){}if(near.act){PAUSE=false;near.act();return}window.openSotetProgram(near.tab)}
function loop(t){if(!ON)return;raf=requestAnimationFrame(loop);if(window.spmgOn&&spmgOn()){last=t;return}const dt=Math.min(.05,(t-(last||t))/1000);last=t;clock+=dt;const d=DD();if(window._sp3fx)try{window._sp3fx(dt,{SC,CAM,INSIDE,INCAR,HEMI,MOON,px,pz,car,clock,beep})}catch(e){}
 const busy=PAUSE||(window.sotetPanelOpen&&sotetPanelOpen())||($$('dpmg')&&$$('dpmg').style.display==='flex')||ovlOpen();
 if(!busy){const a=accB();
  if(INCAR){const v=veh(),mxs=v.sp*(1+a.car)*(K.shift?1.35:1);if(K.w||K.arrowup)car.v+=dt*mxs*.9;else if(K.s||K.arrowdown)car.v-=dt*mxs*(car.v>0?1.6:.6);else car.v*=1-dt*1.2;car.v=cl(car.v,-mxs*.4,mxs);
   const st=(K.a||K.arrowleft?1:0)-(K.d||K.arrowright?1:0);car.h+=st*dt*1.9*cl(car.v/8,-1,1);const nx=car.x+Math.sin(car.h)*car.v*dt,nz=car.z+Math.cos(car.h)*car.v*dt;
   if(hit(nx,nz,1.3)){if(Math.abs(car.v)>8)beep(90,.2,'sawtooth',.08);car.v*=-.3}else{car.x=nx;car.z=nz}CAR.position.set(car.x,0,car.z);CAR.rotation.y=car.h;
   const cx=car.x-Math.sin(car.h)*8,cz=car.z-Math.cos(car.h)*8;CAM.position.lerp(_V3.set(cx,3.6,cz),Math.min(1,dt*5));CAM.lookAt(car.x,1.2,car.z)}
  else{const run=K.shift?(INSIDE?3.6:5.6)*(1+a.run):(INSIDE?2.2:3.4);const sp=run*dt;let mx=0,mz=0;if(K.w||K.arrowup)mz-=1;if(K.s||K.arrowdown)mz+=1;if(K.a||K.arrowleft)mx-=1;if(K.d||K.arrowright)mx+=1;
   const c=Math.cos(yaw),s=Math.sin(yaw);const nx=px+(mx*c+mz*s)*sp,nz=pz+(-mx*s+mz*c)*sp;
   if(INSIDE){px=nx;pz=nz;NPC.forEach(n=>{if(Math.abs(n.x)>12||Math.abs(n.z)>3)return;const dx=px-n.x,dz=pz-n.z,dd=Math.hypot(dx,dz);if(dd<.45&&dd>0){px=n.x+dx/dd*.45;pz=n.z+dz/dd*.45}});px=cl(px,-BX,BX);pz=cl(pz,-BZ+.25,BZ-.25)}
   else{if(!hit(nx,pz,.35))px=nx;if(!hit(px,nz,.35))pz=nz}}}
 if(!INCAR){const bob=(K.w||K.s||K.a||K.d)&&!busy?Math.sin(clock*9)*.03:0;CAM.position.set(px,1.6+bob,pz);CAM.rotation.set(pit,yaw,0,'YXZ')}
 // animációk
 if(DISCO){DISCO.rotation.y+=dt*1.5;FX.dl.color.setHSL((clock*.2)%1,.8,.6)}
 if(FX.bub&&MODS.lm_tank.visible)FX.bub.forEach((b,i)=>{b.position.y+=dt*(.4+i%3*.15);if(b.position.y>1.5)b.position.y=.15});
 if(FX.fan&&MODS.lm_hood.visible)FX.fan.rotation.y+=dt*12;if(FX.conv&&MODS.lm_conv.visible)FX.conv.forEach(b=>{b.position.x+=dt*.5;if(b.position.x>-6.5)b.position.x=-10.3});
 if(FX.arm&&MODS.lm_robot.visible){FX.arm[0].rotation.y=Math.sin(clock*.9)*1.2;FX.arm[1].rotation.x=Math.sin(clock*1.7)*.6}
 if(FX.core&&MODS.lm_reakt.visible){FX.core.scale.setScalar(1+Math.sin(clock*4)*.08);FX.rings.forEach((r,i)=>{r.rotation.x=clock*(1+i*.4);r.rotation.y=clock*(.7+i*.3)})}
 if(FX.monC&&MODS.lm_mon.visible&&Math.floor(clock*3)!==FX._mt){FX._mt=Math.floor(clock*3);const x=FX.monC.getContext('2d');x.fillStyle='#020617';x.fillRect(0,0,512,128);for(let p=0;p<4;p++){x.strokeStyle=['#22d3ee','#a3e635','#f472b6','#facc15'][p];x.lineWidth=3;x.beginPath();for(let i=0;i<32;i++){const y=64+Math.sin(clock*2+i*.5+p)*30*Math.random();x.lineTo(p*128+i*4,y)}x.stroke();x.fillStyle='#fff';x.font='bold 14px monospace';x.fillText(['MINŐSÉG '+(90+Math.floor(Math.random()*9))+'%','HŐ '+(70+Math.floor(Math.random()*9))+'°C','NYOMÁS OK','Ft '+Math.round(d.cash)][p],p*128+6,18)}FX.monP.forEach(m=>m.material.map.needsUpdate=true)}
 NPC.forEach((n,i)=>{n.m.position.y=Math.abs(Math.sin(clock*2+i))*.02;const dx=px-n.x,dz=pz-n.z;if(Math.hypot(dx,dz)<(INSIDE?2.4:6))n.m.rotation.y=Math.atan2(dx,dz);else n.m.rotation.y=n.ry+Math.sin(clock*.5+i)*.3;if(n.k==='beno')n.m.rotation.z=Math.sin(clock*6)*.08});
 if(!INSIDE&&FX.lampM&&HEMI){const nt=cl((.75-HEMI.intensity)/.35,0,1);FX.lampM.emissiveIntensity=.3+1.9*nt;FX.yardL.forEach(l=>l.intensity=l.userData.i*(.25+.75*nt))}
 if(!busy){tickOffers(dt);tickPolice(dt)}
 const tg=new Set(d.cargo.map(c=>c.di));DROPS.forEach(D=>{const on=tg.has(D.i)&&!INSIDE;D.beam.visible=on;D.ring.visible=on;if(on){D.ring.scale.setScalar(1+Math.sin(clock*4)*.12);D.beam.material.opacity=.15+Math.sin(clock*3)*.08}});
 potT-=dt;if(potT<=0){potT=.5;potVis()}
 mmT-=dt;if(mmT<=0&&!INSIDE){mmT=.12;drawMap($$('sp3mm'),false);if(BIGMAP)drawMap($$('sp3bm'),true)}
 try{tickLife(busy?0:dt)}catch(e){}
 GUIDE.k-=dt;if(GUIDE.k<=0){GUIDE.k=.25;try{guide()}catch(e){}}guideDraw();stepNear();R.render(SC,CAM)}
function hud(){const dp=DP();if(!dp)return;const D=dp.D;const h='📅 '+D.day+'. nap · 💰 '+Math.round(D.cash).toLocaleString('hu-HU')+' Ft · ⚡ '+Math.round(D.en)+' · 🔥 '+Math.round(D.heat)+'% · '+(dp.rankTxt?dp.rankTxt(dp.rank()):'⭐ '+D.rep)+' · 📦 '+cargoN()+'/'+capTot()+' · '+veh().e;
 const q=$$('sp3q');if(q&&q._h!==GUIDE.txt){q._h=GUIDE.txt;q.textContent=GUIDE.txt;q.style.display=GUIDE.txt?'block':'none'}const e=$$('sp3h');if(e&&e._h!==h){e._h=h;e.textContent=h}
 const w=$$('sp3w');if(w){w.style.display=WANT>.02&&!INSIDE?'block':'none';w.firstChild.style.width=Math.round(WANT*100)+'%'}
 const c=$$('sp3c');if(c){const t=(D.cargo||[]).map(x=>dp.ITM[x.pid].e+' '+x.n+'× → '+dp.DIS[x.di][0]+' <b style="color:'+(x.left<20?'#f87171':'#86efac')+'">'+Math.ceil(x.left)+'s</b>').join('<br>');if(c._h!==t){c._h=t;c.innerHTML=t?'🚚 <b>SZÁLLÍTÁS</b><br>'+t:'';c.style.display=t?'block':'none'}}}
function openSotet3D(){if(ON)return;ON=true;const lb=$$('lb');if(lb)lb.classList.remove('on');
 let w=$$('sp3');if(!w){w=document.createElement('div');w.id='sp3';w.style.cssText='position:fixed;inset:0;z-index:9400;background:#000';
  const pill='position:absolute;z-index:2;color:#fff;font:700 14px system-ui;background:rgba(15,23,42,.82);border:1px solid #7c3aed;border-radius:12px;backdrop-filter:blur(6px)';
  w.innerHTML='<div id="sp3h" style="'+pill+';top:12px;left:50%;transform:translateX(-50%);padding:7px 14px"></div>'+
  '<div style="position:absolute;top:10px;left:12px;color:#fff;font:900 20px system-ui;z-index:2;text-shadow:0 2px 6px #000">🕶️ SÖTÉT PROGRAM <span style="font-size:12px;opacity:.7">· lakókocsi & város</span></div>'+
  '<button id="sp3x" style="position:absolute;top:10px;right:12px;z-index:3;background:#ef4444;color:#fff;border:0;border-radius:9px;padding:8px 12px;font-weight:800;cursor:pointer">⬅ Vissza a lobbyba</button>'+
  '<canvas id="sp3mm" width="180" height="180" style="'+pill+';top:52px;right:12px;display:none;border-radius:14px;border:2px solid #a78bfa"></canvas>'+
  '<div id="sp3c" style="'+pill+';top:242px;right:12px;padding:8px 10px;display:none;max-width:240px;font-size:12px"></div>'+
  '<div id="sp3ob" style="'+pill+';top:52px;left:12px;padding:8px 12px;display:none;background:linear-gradient(90deg,#16a34a,#15803d);cursor:pointer"></div>'+
  '<div id="sp3w" style="position:absolute;z-index:2;top:50px;left:50%;transform:translateX(-50%);width:260px;height:14px;background:#0f172acc;border:2px solid #ef4444;border-radius:8px;overflow:hidden;display:none"><i style="display:block;height:100%;width:0;background:linear-gradient(90deg,#ef4444,#3b82f6)"></i></div>'+
  '<div id="sp3q" style="'+pill+';top:96px;left:12px;padding:7px 12px;display:none;max-width:min(420px,60vw);font-size:13px;border-color:#facc15"></div>'+
  '<div id="sp3ar" style="'+pill+';top:84px;left:50%;transform:translateX(-50%);padding:5px 12px;display:none;font-size:13px;border-color:#facc15"></div>'+
  '<div id="sp3p" style="position:absolute;bottom:90px;left:50%;transform:translateX(-50%);color:#fff;font:700 18px system-ui;background:rgba(124,58,237,.88);padding:9px 16px;border-radius:12px;display:none;z-index:2"></div>'+
  '<div id="sp3n" style="position:absolute;bottom:140px;left:50%;transform:translateX(-50%);color:#fff;font:600 15px system-ui;background:rgba(15,23,42,.9);border:1px solid #f472b6;padding:9px 16px;border-radius:12px;z-index:3;opacity:0;transition:opacity .4s;pointer-events:none;max-width:80vw;text-align:center"></div>'+
  '<div style="position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px;border-radius:50%;background:#fff;opacity:.8;z-index:2"></div>'+
  '<div id="sp3bmw" style="position:absolute;inset:0;z-index:4;background:rgba(2,6,23,.75);display:none;align-items:center;justify-content:center"><canvas id="sp3bm" width="620" height="620" style="max-width:92vmin;max-height:92vmin;border:3px solid #a78bfa;border-radius:18px"></canvas></div>'+
  '<div id="sp3t" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);color:#cbd5e1;font:600 13px system-ui;background:rgba(15,23,42,.75);padding:6px 12px;border-radius:9px;z-index:2">Kattints a nézelődéshez · WASD mozgás · SHIFT futás · E interakció · O rendelések · M térkép · F autó · ESC egér · 🟨 nyíl = következő cél</div>';
  document.body.appendChild(w);$$('sp3x').onclick=closeSotet3D;$$('sp3ob').onclick=ordUI}
 w.style.display='block';if(!R){R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;R.outputEncoding=THREE.sRGBEncoding;w.insertBefore(R.domElement,w.firstChild);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  SC=new THREE.Scene();SC.background=new THREE.Color(0x0b1026);SC.fog=new THREE.Fog(0x0b1026,14,40);CAM=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,500);SC.add(new THREE.HemisphereLight(0xc7d2fe,0x3b2a1a,.5));
  buildInterior();buildCity();try{buildLife()}catch(e){console.warn("sp3 life",e)}
  const MGR=k=>()=>{if(window._spmg)_spmg.run(k,{mode:'job'});else toast('A 3D minijáték-modul nem töltődött be.')};
  S('pack',-8.4,1.25,'📦 CSOMAGOLÓSOR [E]','#fdba74',null,MGR('pack'));S('mg3',-8.6,-1.3,'🎮 MŰSZAK-TÁBLA [E]','#f0abfc','mg3');
  S('futar',14.5,5.5,'📞 FUTÁRKÖZPONT [E]','#fde047',null,MGR('drive'),'out',2.6,2.2);
  R.domElement.addEventListener('click',()=>{if(!PAUSE&&!ovlOpen())lockP()});
  document.addEventListener('mousemove',e=>{if(!ON||document.pointerLockElement!==R.domElement||INCAR)return;yaw-=e.movementX*.0025;pit=Math.max(-1.3,Math.min(1.3,pit-e.movementY*.0025))});
  addEventListener('resize',()=>{if(!R)return;R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix()})}
 const d=DD();if(d.veh!=='berelt'&&!d.own[d.veh])d.veh='berelt';rebuildCar();showMods();
 R.setSize(innerWidth,innerHeight);CAM.aspect=innerWidth/innerHeight;CAM.updateProjectionMatrix();goIn();px=6;pz=0;yaw=Math.PI/2;PAUSE=false;last=0;raf=requestAnimationFrame(loop);
 window._sp3hud=setInterval(hud,250);hud();setTimeout(()=>{if(!d._intro2){d._intro2=1;toast('👨‍🔬 <b>Profi Ferkó:</b> „Nézd, mekkora lett a kocsi! A labor balra van – a fejlesztéseket a lila táblánál veszed. A városba az ajtón át jutsz ki!”')}},700)}
function closeSotet3D(){ON=false;cancelAnimationFrame(raf);clearInterval(window._sp3hud);try{document.exitPointerLock()}catch(e){}closeOvl();const w=$$('sp3');if(w)w.style.display='none';const p=$$('dp');if(p)p.style.display='none';try{DP().save()}catch(e){}const lb=$$('lb');if(lb&&!lb.classList.contains('on')){if(window.showLobby)showLobby();else lb.classList.add('on')}}
window.openSotet3D=openSotet3D;window.closeSotet3D=closeSotet3D;
addEventListener('keydown',e=>{if(!ON)return;if(window.spmgOn&&spmgOn())return;if(window.sotetPanelOpen&&sotetPanelOpen())return;if($$('dpmg')&&$$('dpmg').style.display==='flex')return;const k=e.key.toLowerCase();e.stopImmediatePropagation();
 if(ovlOpen()){if(k==='escape'||(k==='o'&&OVL.innerHTML.includes('RENDELÉSEK')))closeOvl();return}
 if(BIGMAP&&(k==='m'||k==='escape')){BIGMAP=false;$$('sp3bmw').style.display='none';return}
 K[k]=true;if(e.repeat)return;if(k==='e')interact();else if(k==='f'&&!INSIDE)toggleCar();else if(k==='o')ordUI();else if(k==='m'&&!INSIDE){BIGMAP=true;$$('sp3bmw').style.display='flex';drawMap($$('sp3bm'),true)}else if(k==='h'&&INCAR){beep(392,.35,'square',.08);beep(466,.35,'square',.06)}if(k===' ')e.preventDefault()},true);
addEventListener('keyup',e=>{if(!ON)return;K[e.key.toLowerCase()]=false},true);
addEventListener('blur',()=>{K={}});
window._sp3tp=(x,z,y)=>{px=x;pz=z;yaw=y};window._sp3hit=hit;window._sp3=()=>({px,pz,yaw,INSIDE,INCAR,car,WANT,near:near&&near.id,OFF,ST:ST.map(s=>s.id),api:{goOut,goIn,toggleCar,accept,deliver,ordUI,shopUI,carUI,potUI:i=>potUI(POTS[i]),genOffer,POTS,DROPS,MODS}});
})();
