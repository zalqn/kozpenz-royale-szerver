// extra110.js – hegymászó quad, ✈️ repülő + 🚁 helikopter (/repcsi /heli), 🎒 15 kit, 🔮 varázslatok, E-gomb ütközés javítás
(()=>{
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a);
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x110pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x110 '+n+': '+e)}return r}};
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5},o||{}));
function lbl(t){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(15,23,42,.8)';x.fillRect(0,0,256,64);x.fillStyle='#fde047';x.font='bold 28px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,128,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(4,1,1);return s}
const fwd=()=>[Math.cos(G.ang),Math.sin(G.ang)];
const onMap=(x,z)=>G.arh?hin(x,z):Math.hypot(x,z)<58;

// =================== HEGYEK (kúpok) – quad és gyalog is fel tud menni ===================
let HILLS=[],hillG=null;
function scanHills(){HILLS=[];hillG=G;scene.traverse(m=>{const gm=m.geometry;if(!m.isMesh||!gm||gm.type!=='ConeGeometry')return;const p=gm.parameters;if(p.radius<12||p.height<5)return;if(Math.abs(m.position.y-p.height/2)>1.6)return;
  HILLS.push({x:m.position.x,z:m.position.z,r:p.radius,b:m.position.y-p.height/2,h:p.height})});
 if(G.col)G.col=G.col.filter(c=>!HILLS.some(h=>Math.hypot(h.x-c.x,h.z-c.z)<1.5&&c.r>6))}
function hillH(x,z){let y=0;for(const h of HILLS){const d=Math.hypot(x-h.x,z-h.z);if(d<h.r){const v=h.b+h.h*(1-d/h.r);if(v>y)y=v}}return y}
window.hillH=hillH;
if(typeof floorH==='function'){const of=floorH;floorH=function(o){let h=of(o);if(HILLS.length){const c=hillH(o.x,o.z);if(c>h&&(o._onH||c<=(o.y||0)+4.5)){h=c;o._onH=1}else o._onH=0}return h}}

// =================== REPÜLŐ + HELIKOPTER ===================
let AIR=[],FLY=null,PARA=0;
function mkAir(k,x,z){const g=new THREE.Group();let rot=null;
 if(k==='plane'){const body=new THREE.Mesh(new THREE.BoxGeometry(5,1.1,1.1),STD(0xf1f5f9,{metalness:.3}));const nose=new THREE.Mesh(new THREE.ConeGeometry(.55,1.2,10),STD(0xdc2626));nose.rotation.z=-Math.PI/2;nose.position.x=3.1;
  const wing=new THREE.Mesh(new THREE.BoxGeometry(1.4,.12,8),STD(0x2563eb));wing.position.set(.3,.1,0);const tail=new THREE.Mesh(new THREE.BoxGeometry(.8,.1,2.6),STD(0x2563eb));tail.position.set(-2.3,.3,0);const fin=new THREE.Mesh(new THREE.BoxGeometry(.8,1.2,.1),STD(0xdc2626));fin.position.set(-2.3,.9,0);
  const cock=new THREE.Mesh(new THREE.BoxGeometry(1.2,.5,.8),new THREE.MeshStandardMaterial({color:0x93c5fd,transparent:true,opacity:.7}));cock.position.set(1.2,.75,0);
  rot=new THREE.Mesh(new THREE.BoxGeometry(.08,2.4,.2),STD(0x111827));rot.position.x=3.75;g.add(body,nose,wing,tail,fin,cock,rot);g.children.forEach(c=>c.position.y+=1.2)}
 else{const body=new THREE.Mesh(new THREE.SphereGeometry(1.3,14,10),STD(0x16a34a,{metalness:.3}));body.scale.set(1.5,1,1);const glass=new THREE.Mesh(new THREE.SphereGeometry(.9,12,8),new THREE.MeshStandardMaterial({color:0x93c5fd,transparent:true,opacity:.7}));glass.position.set(1.1,.25,0);
  const boom=new THREE.Mesh(new THREE.BoxGeometry(3.6,.35,.35),STD(0x15803d));boom.position.set(-2.8,.3,0);const tr=new THREE.Mesh(new THREE.BoxGeometry(.1,1.4,.12),STD(0x111827));tr.position.set(-4.5,.5,.25);
  const skid1=new THREE.Mesh(new THREE.BoxGeometry(3,.12,.12),STD(0x374151));skid1.position.set(0,-1.2,.8);const skid2=skid1.clone();skid2.position.z=-.8;
  rot=new THREE.Mesh(new THREE.BoxGeometry(7,.06,.3),STD(0x111827));rot.position.y=1.5;const rot2=rot.clone();rot2.rotation.y=Math.PI/2;rot.add(rot2);rot2.position.set(0,0,0);
  g.add(body,glass,boom,tr,skid1,skid2,rot);g.children.forEach(c=>c.position.y+=1.35)}
 const lb=lbl(k==='plane'?'✈️ REPÜLŐ [E]':'🚁 HELI [E]');lb.position.y=4.2;g.add(lb);g.position.set(x,hillH(x,z),z);scene.add(g);
 const a={k,x,z,y:hillH(x,z),a:Math.random()*6.28,v:0,vy:0,m:g,rot,lb,G};AIR.push(a);return a}
function clearAir(){AIR.forEach(a=>{try{scene.remove(a.m)}catch(e){}});AIR=[];FLY=null;PARA=0}
function spawnFront(k){const[fx,fz]=fwd();let x=G.x+fx*7,z=G.z+fz*7;if(!onMap(x,z)){x=G.x;z=G.z}const a=mkAir(k,x,z);a.a=G.ang;return a}
function randLand(){for(let i=0;i<80;i++){const x=G.arh?RN(-280,280):RN(-50,50),z=G.arh?RN(-160,160):RN(-40,30);if(onMap(x,z)&&hillH(x,z)<1)return[x,z]}return[G.x+5,G.z+5]}
function nearAir(){if(FLY)return null;let b=null,bd=5.5;AIR.forEach(a=>{const d=Math.hypot(a.x-G.x,a.z-G.z);if(d<bd&&Math.abs(a.y-G.y)<4){bd=d;b=a}});return b}
function enter(a){const W=window._x10W&&_x10W();if(W&&W.drive)return;FLY=a;a.lb.visible=false;a.a=G.ang;
 sayX(a.k==='plane'?'✈️ Beültél a repülőbe! W gáz (kell a lendület!), S fék, egérrel kormányzol, SPACE emelkedés, SHIFT süllyedés, E kiszállás (ejtőernyő)':'🚁 Beültél a helikopterbe! W/S előre-hátra, egérrel kormányzol, SPACE fel, SHIFT le, E kiszállás (ejtőernyő)')}
function leave(){const a=FLY;if(!a)return;FLY=null;a.lb.visible=true;const[fx,fz]=fwd();G.x=a.x-fz*2.5;G.z=a.z+fx*2.5;G.y=a.y+.5;G.vy=0;if(a.y-hillH(a.x,a.z)>3){PARA=1;sayX('🪂 Ejtőernyő nyitva!')}}
function airStep(dt){const k=typeof keys!=='undefined'?keys:{};
 AIR.forEach(a=>{if(a.rot){const sp=a===FLY||a.y>hillH(a.x,a.z)+.2?(a.k==='plane'?a.v*1.5+4:30):0;if(a.k==='plane')a.rot.rotation.x+=sp*dt;else a.rot.rotation.y+=sp*dt}
  if(a===FLY)return;const gy=hillH(a.x,a.z);if(a.y>gy){a.vy-=20*dt;a.y+=a.vy*dt;if(a.k==='plane'){a.x+=Math.cos(a.a)*a.v*dt;a.z+=Math.sin(a.a)*a.v*dt;a.v*=1-dt*.4}if(a.y<=gy){a.y=gy;a.vy=0;a.v=0}}
  a.m.position.set(a.x,a.y,a.z);a.m.rotation.set(0,-a.a,0)});
 const a=FLY;if(!a)return;const up=k[' ']?1:0,dn=k.shift?1:0,th=(k.w||k.arrowup?1:0)-(k.s||k.arrowdown?1:0);a.a=G.ang;const gy=hillH(a.x,a.z);
 if(a.k==='plane'){a.v+=th*(th>0?14:22)*dt;a.v*=1-dt*(th?0.05:.25);a.v=Math.max(0,Math.min(48,a.v));const lift=a.v>=14;
  if(lift)a.vy=(up-dn)*a.v*.45;else a.vy=a.y>gy?Math.max(a.vy-18*dt,-14):0;
  a.m.rotation.set(-(Math.atan2(a.vy,a.v||1))*0,-a.a,0);a.m.rotation.z=Math.atan2(a.vy,Math.max(a.v,1))*.8}
 else{const tv=th*28;a.v+=(tv-a.v)*Math.min(1,dt*1.6);a.vy+=((up-dn)*11-a.vy)*Math.min(1,dt*3);a.m.rotation.set(0,-a.a,-a.v*.008)}
 let nx=a.x+Math.cos(a.a)*a.v*dt,nz=a.z+Math.sin(a.a)*a.v*dt;const R=G.arh?470:70;const r=Math.hypot(nx,nz);if(r>R){nx*=R/r;nz*=R/r}
 a.x=nx;a.z=nz;a.y=Math.min(140,a.y+a.vy*dt);const g2=hillH(a.x,a.z);if(a.y<g2){if(a.k==='plane'&&a.vy<-10&&a.v>20){try{hurt(25)}catch(e){}sayX('💥 Kemény landolás!')}a.y=g2;if(a.vy<0)a.vy=0}
 a.m.position.set(a.x,a.y,a.z);G.x=a.x;G.z=a.z;G.y=a.y+1.2;G.vy=0;G.vx=G.vz=0;
 if(a.v>12&&a.y-g2<2.5)(G.en||[]).forEach(e=>{if(e.dead)return;if(Math.hypot(e.x-a.x,e.z-a.z)<3){if(!e._ram||performance.now()-e._ram>1000){e._ram=performance.now();dmgE(e,a.v*4,false)}}})}

// =================== KITEK ===================
const KITS=[
 {n:'Harcos',e:'⚔️',w:[1,0,5],hp:20,sh:20,d:'Kiegyensúlyozott. SCAR + shotgun + pisztoly',sp:'warcry'},
 {n:'Íjász',e:'🏹',w:[2,5],hp:0,sh:0,spd:1.1,d:'Gyors, távolsági. Mesterlövész + pisztoly',sp:'arrows'},
 {n:'Vadász',e:'🦌',w:[2,6],hp:10,sh:10,d:'Csapdát állít. Mesterlövész + SMG',sp:'trap'},
 {n:'Vaslovag',e:'🛡️',w:[0,5],hp:60,sh:60,spd:.9,d:'Páncélos, lassú. Shotgun + pisztoly',sp:'steel'},
 {n:'Orvlövész',e:'🎯',w:[2,8],hp:-10,sh:0,d:'Kritikus lövések. Mesterlövész + lézer',sp:'focus'},
 {n:'Berserker',e:'🪓',w:[0,7],hp:30,sh:0,d:'Dühroham. Shotgun + minigun',sp:'rage'},
 {n:'Mentő',e:'🚑',w:[6,5],hp:10,sh:30,d:'Gyógyít. SMG + pisztoly, +2 gyógycsomag',sp:'heal',inv:2},
 {n:'Nindzsa',e:'🥷',w:[6,5],hp:-10,sh:10,spd:1.25,d:'Villámgyors, árnyugrás. SMG + pisztoly',sp:'shadow'},
 {n:'Tank',e:'🪨',w:[7,0],hp:100,sh:50,spd:.8,d:'Óriási HP. Minigun + shotgun',sp:'quake'},
 {n:'Vámpír',e:'🧛',w:[8,6],hp:0,sh:0,d:'Életet szív. Lézer + SMG',sp:'drain'},
 {n:'Tűzmágus',e:'🔥',w:[8,5],hp:0,sh:10,d:'Meteort hív. Lézer + pisztoly, +30 mana',sp:'meteor',mana:30},
 {n:'Fagyvarázsló',e:'❄️',w:[8,5],hp:0,sh:10,d:'Jégvihar. Lézer + pisztoly, +30 mana',sp:'blizzard',mana:30},
 {n:'Robbantó',e:'💣',w:[3,0],hp:10,sh:10,d:'Robbanás. Rakétavető + shotgun',sp:'nuke'},
 {n:'Dobó',e:'🪃',w:[4,5],hp:0,sh:10,spd:1.1,d:'Tomahawkok. Szórólap-ágyú + pisztoly',sp:'axes'},
 {n:'Gladiátor',e:'🏛️',w:[1,0],hp:40,sh:20,d:'Közelharci pörgés. SCAR + shotgun',sp:'spin'}];
let KIT=0;try{KIT=Math.max(0,Math.min(14,+(localStorage.getItem('k3x110kit')||0)))}catch(e){}
const SP={ // varázslatok: [név, mana, cooldown]
 fire:['🔥 Tűzgolyó',25,1],ice:['🧊 Jéglándzsa',20,1],bolt:['⚡ Villám',30,2],heal:['💚 Gyógyítás',35,4],blink:['🌀 Teleport',30,3],shield:['🔰 Mágikus pajzs',40,8],
 warcry:['📣 Harci kiáltás',0,22],arrows:['🏹 Nyílzápor',0,14],trap:['🪤 Csapda',0,16],steel:['🛡️ Acélbőr',0,22],focus:['🎯 Fókusz',0,20],rage:['😡 Düh',0,22],
 healwave:['🚑 Gyógyhullám',0,20],shadow:['🥷 Árnyugrás',0,10],quake:['🌋 Földrengés',0,16],drain:['🧛 Életszívás',0,12],meteor:['☄️ Meteor',0,16],blizzard:['🌨️ Jégvihar',0,20],
 nuke:['💣 Nagy bumm',0,20],axes:['🪃 Tomahawkok',0,10],spin:['🌪️ Pörgés',0,14]};
const kitSp=()=>{const s=KITS[KIT].sp;return s==='heal'?'healwave':s};
const EXT={};const SLOTS=()=>[kitSp(),'fire','ice','bolt','heal','blink','shield',...(MAG.extra||[])];
let MAG={mana:100,max:100,sel:0,cd:{},buf:{},proj:[],fx:[]};

function applyKit(){const g=G,K=KITS[KIT];
 for(let i=0;i<g.own.length;i++)g.own[i]=false;K.w.forEach(i=>{g.own[i]=true;const w=WPN[i];if(w){g.mag[i]=w.mag;g.res[i]=w.res}});g.wp=K.w[0];
 g.mhp+=K.hp;g.hp=Math.max(1,g.hp+K.hp);g.msh+=K.sh;g.sh=Math.max(0,(g.sh||0)+K.sh);if(K.inv)g.inv.hp=(g.inv.hp||0)+K.inv;
 const xm=(window._x120mana?window._x120mana():0);MAG={mana:100+(K.mana||0)+xm,max:100+(K.mana||0)+xm,sel:0,cd:{},buf:{},proj:[],fx:[]};g._x110spd=K.spd||1;g._x110base=g._spdB||1;
 setTimeout(()=>sayX(K.e+' '+K.n+' kit! '+SP[kitSp()][0]+' – É: varázslat, Á: váltás'),1500)}

// sebzés-módosítók
WP('dmgE',a=>{const b=MAG.buf,now=performance.now();if(b.warcry>now)a[1]*=1.5;if(b.rage>now)a[1]*=1.6;if(b.focus>now)a[2]=true});
WP('hurt',a=>{const b=MAG.buf,now=performance.now();if(b.steel>now)a[0]*=.3;if(b.shadow>now)a[0]=0});

// lövedékek
function orb(col,r){const m=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),new THREE.MeshBasicMaterial({color:col}));scene.add(m);return m}
function shoot(o){const[fx,fz]=fwd();const a=(o.off||0)+G.ang;const p={x:G.x+Math.cos(a)*1.2,z:G.z+Math.sin(a)*1.2,y:G.y+1.4,vx:Math.cos(a)*(o.spd||40),vz:Math.sin(a)*(o.spd||40),t:o.life||1.4,m:orb(o.col,o.r||.35),hit:new Set(),...o};MAG.proj.push(p)}
function boom(x,z,r,dmg,col){(G.en||[]).forEach(e=>{if(!e.dead&&Math.hypot(e.x-x,e.z-z)<r)dmgE(e,dmg,false)});const m=orb(col||0xf97316,1);m.position.set(x,G.y+1,z);m.material.transparent=true;MAG.fx.push({m,t:.5,T:.5,s:r})}
function ring(col,r){const m=orb(col,1);m.position.set(G.x,G.y+1,G.z);m.material.transparent=true;MAG.fx.push({m,t:.6,T:.6,s:r})}
function freeze(e,t){e._frz=performance.now()+t*1000;e._fx=e.x;e._fz=e.z;try{ftx(e.x,e.z,'❄️','#93c5fd')}catch(er){}}
function enemiesNear(r){return(G.en||[]).filter(e=>!e.dead&&Math.hypot(e.x-G.x,e.z-G.z)<r)}
function aimed(range){const[fx,fz]=fwd();let b=null,bd=range;(G.en||[]).forEach(e=>{if(e.dead)return;const dx=e.x-G.x,dz=e.z-G.z,d=Math.hypot(dx,dz);if(d<bd&&(dx*fx+dz*fz)/(d||1)>.9){bd=d;b=e}});return b}
function beam(e,col){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(G.x,G.y+1.4,G.z),new THREE.Vector3(e.x,(e.y||0)+1.2,e.z)]);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:col}));scene.add(l);MAG.fx.push({m:l,t:.25,T:.25,s:0,line:1})}
function blinkTo(d){const[fx,fz]=fwd();for(let s=d;s>2;s-=2){const x=G.x+fx*s,z=G.z+fz*s;if(onMap(x,z)){G.x=x;G.z=z;G.y=Math.max(G.y,hillH(x,z));return true}}return false}

function cast(){if(!normal()||G.phase!=='play'||G.dead)return;const id=SLOTS()[MAG.sel],s=SP[id],now=performance.now();
 if((MAG.cd[id]||0)>now){sayX('⏳ '+s[0]+' még '+Math.ceil((MAG.cd[id]-now)/1000)+' mp');return}if(MAG.mana<s[1]){sayX('🔮 Kevés a mana!');return}
 MAG.mana-=s[1];MAG.cd[id]=now+s[2]*1000*(id===kitSp()&&window._x120cdm?window._x120cdm():1);const g=G,B=MAG.buf;
 switch(id){
  case'fire':shoot({col:0xf97316,dmg:45,boom:4});break;
  case'ice':shoot({col:0x93c5fd,dmg:30,frz:2.5,spd:50});break;
  case'bolt':{const e=aimed(45);if(!e){MAG.mana+=s[1];MAG.cd[id]=0;sayX('⚡ Nincs célpont előtted');return}beam(e,0xfde047);dmgE(e,60,false);break}
  case'heal':g.hp=Math.min(g.mhp,g.hp+40);ring(0x22c55e,3);break;
  case'blink':if(!blinkTo(12)){MAG.mana+=s[1];return}break;
  case'shield':g.sh=Math.min(g.msh,(g.sh||0)+50);ring(0x38bdf8,3);break;
  case'warcry':B.warcry=now+6000;ring(0xef4444,5);break;
  case'arrows':for(let i=-3;i<=3;i++)shoot({col:0xa16207,dmg:28,off:i*.09,r:.18,spd:60});break;
  case'trap':enemiesNear(9).forEach(e=>{freeze(e,3);dmgE(e,15,false)});ring(0x854d0e,9);break;
  case'steel':B.steel=now+5000;ring(0x94a3b8,3);break;
  case'focus':B.focus=now+5000;ring(0xfacc15,3);break;
  case'rage':B.rage=now+6000;g.hp=Math.max(1,g.hp-10);ring(0xdc2626,4);break;
  case'healwave':g.hp=Math.min(g.mhp,g.hp+80);g.sh=Math.min(g.msh,(g.sh||0)+30);ring(0x4ade80,6);break;
  case'shadow':B.shadow=now+1500;blinkTo(18);ring(0x1e1b4b,3);break;
  case'quake':enemiesNear(12).forEach(e=>{dmgE(e,30,false);const d=Math.hypot(e.x-g.x,e.z-g.z)||1;e.x+=(e.x-g.x)/d*4;e.z+=(e.z-g.z)/d*4});ring(0x92400e,12);break;
  case'drain':{const e=aimed(30);if(!e){MAG.cd[id]=0;sayX('🧛 Nincs célpont előtted');return}beam(e,0xbe123c);dmgE(e,50,false);g.hp=Math.min(g.mhp,g.hp+50);break}
  case'meteor':{const[fx,fz]=fwd();const x=g.x+fx*25,z=g.z+fz*25;const m=orb(0xff4500,1.4);m.position.set(x,40,z);MAG.proj.push({x,z,y:40,vx:0,vz:0,vy:-40,t:2,m,met:1,hit:new Set()});break}
  case'blizzard':enemiesNear(15).forEach(e=>{freeze(e,4);dmgE(e,20,false)});ring(0xe0f2fe,15);break;
  case'nuke':boom(g.x,g.z,9,70,0xfb923c);break;
  case'axes':for(let i=-1;i<=1;i++)shoot({col:0x78716c,dmg:40,off:i*.12,r:.3,spd:45,pierce:1});break;
  case'spin':B.spin=now+2000;break;
  default:if(EXT[id])EXT[id]()}
 sayX(s[0]+'!')}

function magStep(dt){const now=performance.now();MAG.mana=Math.min(MAG.max,MAG.mana+dt*8*(window._x120regen?window._x120regen():1));
 if(G._x110spd!==undefined){let m=G._x110spd;if(MAG.buf.rage>now)m*=1.5;G._spdB=m*(G._x110base||1)}
 (G.en||[]).forEach(e=>{if(e._frz>now){e.x=e._fx;e.z=e._fz}});
 if(MAG.buf.spin>now){MAG._st=(MAG._st||0)+dt;if(MAG._st>.3){MAG._st=0;enemiesNear(4.5).forEach(e=>dmgE(e,30,false));ring(0xfbbf24,4.5)}}
 for(let i=MAG.proj.length-1;i>=0;i--){const p=MAG.proj[i];p.t-=dt;p.x+=p.vx*dt;p.z+=p.vz*dt;if(p.vy)p.y+=p.vy*dt;p.m.position.set(p.x,p.y,p.z);let done=p.t<=0;
  if(p.met){if(p.y<=hillH(p.x,p.z)+.5){boom(p.x,p.z,7,90,0xff4500);done=true}}
  else for(const e of(G.en||[])){if(e.dead||p.hit.has(e))continue;if(Math.hypot(e.x-p.x,e.z-p.z)<1.2+(e.r||1)*.4){p.hit.add(e);if(p.boom){boom(p.x,p.z,p.boom,p.dmg,0xf97316)}else dmgE(e,p.dmg,false);if(p.frz&&!e.dead)freeze(e,p.frz);if(!p.pierce){done=true;break}}}
  if(done){scene.remove(p.m);MAG.proj.splice(i,1)}}
 for(let i=MAG.fx.length-1;i>=0;i--){const f=MAG.fx[i];f.t-=dt;if(!f.line){const k=1-f.t/f.T;f.m.scale.setScalar(.5+k*f.s);f.m.material.opacity=Math.max(0,f.t/f.T)*.6}if(f.t<=0){scene.remove(f.m);MAG.fx.splice(i,1)}}}

// =================== HUD + KIT-VÁLASZTÓ ===================
const css=document.createElement('style');css.textContent=`#x110h{position:fixed;right:14px;bottom:150px;z-index:40;background:rgba(15,23,42,.82);color:#fff;border:1px solid #6d28d9;border-radius:12px;padding:8px 10px;font:600 12px sans-serif;min-width:190px;display:none;pointer-events:none}
#x110h .bar{height:8px;background:#1e1b4b;border-radius:4px;overflow:hidden;margin:4px 0}#x110h .bar i{display:block;height:100%;background:linear-gradient(90deg,#7c3aed,#22d3ee)}
#x110h .sl{display:flex;gap:3px;margin-top:4px}#x110h .sl b{flex:1;text-align:center;font-size:15px;padding:2px 0;border-radius:6px;background:#312e81;opacity:.55}#x110h .sl b.on{opacity:1;outline:2px solid #facc15}
#x110k{position:fixed;left:14px;top:200px;z-index:60;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;border:0;border-radius:12px;padding:10px 14px;font:800 14px sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.4);display:none}
#x110p{position:fixed;inset:0;z-index:9000;background:rgba(2,6,23,.85);display:none;align-items:center;justify-content:center}#x110p>div{background:#0f172a;color:#fff;border:2px solid #7c3aed;border-radius:16px;padding:18px;max-width:900px;width:calc(100% - 32px);max-height:88vh;overflow:auto;font-family:sans-serif}
#x110p .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-top:10px}#x110p .c{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:9px;cursor:pointer;font-size:12px}#x110p .c:hover{border-color:#a78bfa}#x110p .c.on{border-color:#facc15;background:#312e81}
#x110p .c h4{margin:0 0 4px;font-size:15px}#x110p .x{float:right;background:#ef4444;color:#fff;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:800}`;document.head.appendChild(css);
const hud=document.createElement('div');hud.id='x110h';document.body.appendChild(hud);
const kb=document.createElement('button');kb.id='x110k';document.body.appendChild(kb);
const pn=document.createElement('div');pn.id='x110p';document.body.appendChild(pn);
function wname(i){const w=WPN[i];return w?w.e+' '+w.n:'?'}
function openKits(){pn.innerHTML='<div><button class="x" id="x110x">✖</button><h2 style="margin:0">🎒 Válassz kitet</h2><div style="opacity:.75;font-size:12px">A kit a következő meccstől érvényes. Minden kitnek saját képessége van, plusz 6 közös varázslat (É: elsütés, Á: váltás).</div><div class="g">'+
 KITS.map((k,i)=>'<div class="c'+(i===KIT?' on':'')+'" data-i="'+i+'"><h4>'+k.e+' '+k.n+'</h4><div>'+k.d+'</div><div style="margin-top:4px;color:#c4b5fd">'+SP[k.sp==='heal'?'healwave':k.sp][0]+'</div><div style="margin-top:4px;opacity:.7">HP '+(k.hp>=0?'+':'')+k.hp+' · pajzs +'+k.sh+(k.spd?' · seb. ×'+k.spd:'')+'</div><div style="margin-top:4px;opacity:.6;font-size:11px">'+k.w.map(wname).join('<br>')+'</div></div>').join('')+'</div></div>';
 pn.style.display='flex';$$('x110x').onclick=()=>pn.style.display='none';pn.querySelectorAll('.c').forEach(c=>c.onclick=()=>{KIT=+c.dataset.i;try{localStorage.setItem('k3x110kit',KIT)}catch(e){}openKits()})}
kb.onclick=openKits;
let _hk='';
function uiStep(){const hudOn=$$('hud')&&$$('hud').classList.contains('on');const loggedIn=!$$('ap')||$$('ap').style.display==='none';
 const mp=$$('lbPlayer');const pr=mp&&mp.offsetParent!==null?mp.getBoundingClientRect():null;
 const _vs=document.getElementById('vs2'),kd=(!hudOn&&!(_vs&&_vs.classList.contains('on'))&&!inMatch()&&pr&&pr.width>0)?'block':'none';if(kb.style.display!==kd)kb.style.display=kd;
 if(pr){let w=pr.width;const bl=[...document.querySelectorAll('body *')].find(x=>x.children.length<4&&/^BÉRLET/.test((x.textContent||'').trim())&&x.getBoundingClientRect().left>pr.left);const br=bl&&bl.getBoundingClientRect();if(br&&br.top<pr.bottom+70&&br.left>pr.left)w=Math.min(w,br.left-pr.left-10);
  const L=Math.round(pr.left)+'px',T=Math.round(pr.bottom+15)+'px',Wd=Math.round(w)+'px';if(kb.style.left!==L)kb.style.left=L;if(kb.style.top!==T)kb.style.top=T;if(kb.style.width!==Wd)kb.style.width=Wd}const kt='🎒 KIT: '+KITS[KIT].e+' '+KITS[KIT].n;if(kb.textContent!==kt)kb.textContent=kt;
 if(!normal()){if(hud.style.display!=='none')hud.style.display='none';return}
 const now=performance.now(),sl=SLOTS(),id=sl[MAG.sel],cd=Math.max(0,((MAG.cd[id]||0)-now)/1000);
 const h='<div>'+KITS[KIT].e+' '+KITS[KIT].n+' · 🔮 '+Math.floor(MAG.mana)+'/'+MAG.max+'</div><div class="bar"><i style="width:'+Math.round(MAG.mana/MAG.max*100)+'%"></i></div><div>'+SP[id][0]+(SP[id][1]?' ('+SP[id][1]+')':'')+(cd>0?' ⏳'+cd.toFixed(0):' ✅')+'</div><div class="sl">'+sl.map((s,i)=>'<b class="'+(i===MAG.sel?'on':'')+'">'+SP[s][0].split(' ')[0]+'</b>').join('')+'</div><div style="opacity:.6;font-size:10px;margin-top:3px">É varázsol · Á vált'+(FLY?' · ✈️ E kiszáll':'')+'</div>';
 if(h!==_hk){_hk=h;hud.innerHTML=h}if(hud.style.display!=='block')hud.style.display='block'}
setInterval(uiStep,150);addEventListener('resize',uiStep);

// =================== BILLENTYŰK ===================
addEventListener('keydown',e=>{if(typing(e)||!normal())return;
 if(e.code==='Semicolon'||e.key==='é'||e.key==='É'){e.preventDefault();cast();return}
 if(e.code==='Quote'||e.key==='á'||e.key==='Á'){e.preventDefault();MAG.sel=(MAG.sel+1)%SLOTS().length;return}
 if(e.key.toLowerCase()==='e'&&!e.repeat){if(FLY){e.stopImmediatePropagation();leave();return}const a=nearAir();if(a){e.stopImmediatePropagation();enter(a)}}},true);

// E-gomb: a közelharc ne süljön el, ha éppen más interakció van a közelben (ellátmány, ásás, jetski, urna, repülő)
{const ox=window.x20near;window.x20near=function(){try{const W=window._x10W&&_x10W();if(W&&W.drive)return false;if(ox&&ox())return true;const g=G;
 const Q=window._x50Q&&_x50Q();if(Q){if((Q.drops||[]).some(d=>d.landed&&!d.open&&Math.hypot(d.x-g.x,d.z-g.z)<3.2))return true;if(Q.dig&&!Q.dig.done&&Math.hypot(Q.dig.x-g.x,Q.dig.z-g.z)<3)return true}
 const Z=window._x70Z&&_x70Z();if(Z){if(Z.drive)return true;if((Z.jets||[]).some(j=>Math.hypot(j.x-g.x,j.z-g.z)<6))return true;if((Z.mons||[]).some(m=>!m.caught&&!m.busy&&Math.hypot(m.x-g.x,m.z-g.z)<5.5))return true}
 if(FLY||nearAir())return true}catch(e){}return false}}

// =================== HOOKOK ===================
WP('launch',null,()=>{clearAir();HILLS=[];hillG=null;
 setTimeout(()=>{if(!inMatch())return;try{scanHills()}catch(e){console.error(e)}if(normal()){applyKit();if(G.brMode||G.arh){const p1=randLand(),p2=randLand();mkAir('plane',p1[0],p1[1]);mkAir('heli',p2[0],p2[1])}}},900)});
WP('update',null,a=>{if(!inMatch())return;const dt=Math.min(.05,a[0]||.016);
 if(HILLS.length){const W=window._x10W&&_x10W();if(W&&W.veh)W.veh.forEach(v=>{if(v.k!=='quad')return;const y=hillH(v.x,v.z);v.m.position.y=y;
   if(W.drive===v){G.y=y+.8;const y2=hillH(v.x+Math.sin(v.a)*1.2,v.z+Math.cos(v.a)*1.2);v.m.rotation.x=-Math.atan2(y2-y,1.2)}})}
 if(AIR.length&&AIR[0].G!==G)clearAir();airStep(dt);
 if(PARA&&!FLY){const gy=hillH(G.x,G.z);if(G.y>gy+.3){if(G.vy<-5)G.vy=-5}else PARA=0}
 if(normal())magStep(dt)});
WP('end',()=>{FLY=null;PARA=0;G&&(G._x110spd=undefined)});

// =================== PARANCSOK ===================
{const oc=window.extraCmd;window.extraCmd=function(c){const n=String(c).trim().split(/\s+/)[0].toLowerCase();
 if(['repcsi','repulo','repülő','plane'].includes(n)){if(!inMatch())return'✈️ Csak meccsben!';spawnFront('plane');return'✈️ Megjött a repülő! Menj oda és nyomj E-t.'}
 if(['heli','helikopter'].includes(n)){if(!inMatch())return'🚁 Csak meccsben!';spawnFront('heli');return'🚁 Megjött a helikopter! Menj oda és nyomj E-t.'}
 if(n==='mana'){MAG.mana=MAG.max;MAG.cd={};return'🔮 Mana feltöltve, töltési idők nullázva.'}
 if(n==='kit'){const q=String(c).trim().split(/\s+/).slice(1).join(' ').toLowerCase();const i=KITS.findIndex(k=>k.n.toLowerCase()===q);if(i<0)return'🎒 Kitek: '+KITS.map(k=>k.n).join(', ');KIT=i;try{localStorage.setItem('k3x110kit',i)}catch(e){}if(normal())applyKit();return'🎒 Kit: '+KITS[i].e+' '+KITS[i].n}
 return oc?oc(c):null}}
window._x110=()=>({HILLS,AIR,FLY,MAG,KIT});
window._x110api={SP,EXT,KITS,kit:()=>KIT,mag:()=>MAG,addExtra(id){if(!MAG.extra)MAG.extra=[];if(!MAG.extra.includes(id))MAG.extra.push(id)},shoot,boom,ring,freeze,enemiesNear,aimed,beam,orb,fly:()=>FLY,spawnAir:spawnFront};
})();
