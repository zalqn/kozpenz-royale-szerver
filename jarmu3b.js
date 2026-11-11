// jarmu3b.js – 13 különleges jármű (víz / lég / extrém). jarmu2 garázsában vehető (_jm2.addShop), adminnak ingyen + /parancsok.
// Saját vezetés-logika (nem az extra140h vehStep-je), mert víz/levegő kell. Debug: _jm3b
(()=>{
if(!window._x14hApi||!window._jm2){console.warn('jarmu3b: hiányzik _x14hApi/_jm2');return}
const A=window._x14hApi,J=window._jm2,K=A.KIND,MO=A.MODELS,STD=A.STD;
const sayX=t=>{try{say(t)}catch(e){}};const RN=(a,b)=>a+Math.random()*(b-a);
const M=1e6;
// mode: water | amph | ground | air | drone | ferry
const DEF={
 kampcs:{n:'🚤 Kampány-motorcsónak',d:'Plakátot húz, szórólapot szór – a botok lelassulnak',max:26,acc:14,mode:'water',seat:.7,price:60*M,cmd:'csonak2'},
 matrac:{n:'🛟 Gumimatrac',d:'Lassú, de stílusos lebegés',max:6,acc:4,mode:'water',seat:.35,price:25*M,cmd:'matrac'},
 hattyu:{n:'🦢 Hattyús vízibicikli',d:'Tekerős hattyú, két ülés',max:7,acc:4,mode:'water',seat:.8,price:30*M,cmd:'hattyu'},
 komp:{n:'⛴️ Komp',d:'Menetrend szerint jár a két part között',max:9,acc:3,mode:'ferry',seat:1.1,price:120*M,cmd:'komp',near:6},
 ballon:{n:'🎈 Hőlégballon',d:'Lassan emelkedik, kilátás a pályára',max:5,acc:2,mode:'air',seat:.6,price:90*M,cmd:'ballon',lift:3,idle:.7,top:70,minV:0},
 siklo:{n:'🪂 Motoros siklóernyő',d:'Hosszú siklás, közben lőhetsz',max:15,acc:6,mode:'air',seat:.9,price:75*M,cmd:'siklo',lift:3,idle:-1.1,top:60,minV:7,fuel:1,ft:.05},
 permet:{n:'🛩️ Permetező kisrepülő',d:'F: füstcsík → ködfal (lassít)',max:36,acc:10,mode:'air',seat:1,price:150*M,cmd:'permet',lift:7,idle:0,top:90,minV:14,fuel:1,ft:.03},
 jetpack:{n:'🧑‍🚀 Jetpack',d:'Rövid repülés – figyelj az üzemanyagra',max:11,acc:12,mode:'air',seat:0,price:110*M,cmd:'jetpack',lift:9,idle:-9,top:45,minV:0,fuel:1,ft:.22,jet:1},
 dron:{n:'🛸 Felderítő drón',d:'Távirányítás, F: jelölés · a karaktered áll',max:14,acc:14,mode:'drone',seat:0,price:45*M,cmd:'dron',lift:6,idle:0,top:50,minV:0},
 kad:{n:'🛁 Motoros fürdőkád',d:'Szárazon és vízen is megy',max:16,acc:9,mode:'amph',seat:.6,price:55*M,cmd:'kad'},
 szek:{n:'🪑 Rakétás irodaszék',d:'Shift: rakéta-boost',max:13,acc:12,mode:'ground',seat:.75,price:35*M,cmd:'szek'},
 pult:{n:'🗄️ Mozgó hivatali pult',d:'Elgázolt bot = Ft + pecsét',max:15,acc:9,mode:'ground',seat:1,price:80*M,cmd:'pult'},
 dino:{n:'🦖 Mecha-dínó',d:'Taposással sebez',max:9,acc:5,mode:'ground',seat:4.6,price:200*M,cmd:'dino',near:4}};
const KEYS3=Object.keys(DEF);
KEYS3.forEach(k=>{K[k]=Object.assign({hp:100,seats:k==='hattyu'||k==='komp'?2:1},DEF[k]);delete K[k].cmd});// cmd ne menjen a 140h nyílt parancsaiba

// =================== MODELLEK (közös anyag/geo) ===================
const GEO={},geo=(k,f)=>GEO[k]||(GEO[k]=f());
const MT={dark:STD(0x111827,{roughness:.8}),steel:STD(0x94a3b8,{metalness:.7,roughness:.35}),white:STD(0xf8fafc),wood:STD(0x92400e,{roughness:.8}),
 glass:STD(0x1e293b,{metalness:.7,roughness:.1,transparent:true,opacity:.6}),orange:STD(0xf97316),red:STD(0xdc2626),yel:STD(0xfacc15),green:STD(0x15803d),pink:STD(0xf9a8d4)};
const box=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(geo('b'+w+h+d,()=>new THREE.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);g.add(o);return o};
const cyl=(g,r,h,m,x,y,z,rx,rz)=>{const o=new THREE.Mesh(geo('c'+r+h,()=>new THREE.CylinderGeometry(r,r,h,10)),m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;if(rz)o.rotation.z=rz;g.add(o);return o};
const sph=(g,r,m,x,y,z)=>{const o=new THREE.Mesh(geo('s'+r,()=>new THREE.SphereGeometry(r,14,10)),m);o.position.set(x,y,z);g.add(o);return o};
const banTex=(()=>{const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='#fef3c7';x.fillRect(0,0,256,64);x.fillStyle='#b91c1c';x.font='bold 30px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('SZAVAZZ RÁNK!',128,33);return new THREE.CanvasTexture(c)})();
const banMat=new THREE.MeshBasicMaterial({map:banTex,side:THREE.DoubleSide});
MO.kampcs=(g,p,a)=>{box(g,1.7,.5,4,p,0,.3,0);box(g,1.2,.4,1.2,p,0,.5,1.9);box(g,1.5,.5,.06,MT.glass,0,.85,.6);box(g,.9,.4,.8,MT.dark,0,.75,-.5);
 box(g,.4,.7,.4,MT.dark,0,.5,-2.15);const b=new THREE.Mesh(geo('ban',()=>new THREE.PlaneGeometry(3.6,.9)),banMat);b.position.set(0,1.6,-8);b.userData.ban=1;g.add(b);
 cyl(g,.02,5.4,MT.white,0,1.25,-5,Math.PI/2+.12)};
MO.matrac=(g,p,a)=>{box(g,1.1,.25,2.2,p,0,.15,0);box(g,1,.3,.45,a,0,.32,-.85);for(let i=0;i<4;i++)box(g,1.12,.05,.06,a,0,.29,-.4+i*.35)};
MO.hattyu=(g,p,a)=>{box(g,1.6,.6,2.2,MT.white,0,.35,0);box(g,1.3,.2,1,MT.seat||a,0,.75,-.3);cyl(g,.16,1.5,MT.white,0,1.35,1.05,-.35);sph(g,.25,MT.white,0,2.05,1.3);
 const bk=cyl(g,.06,.35,MT.orange,0,2,1.6,Math.PI/2);bk.scale.set(1,1,.6);box(g,.2,.7,.9,MT.white,-.85,.65,-.3);box(g,.2,.7,.9,MT.white,.85,.65,-.3)};
MO.komp=(g,p,a)=>{box(g,6,.7,12,MT.steel,0,.35,0);box(g,6.1,.2,12.1,p,0,.75,0);box(g,2.2,2.2,3,MT.white,-1.6,1.9,1);box(g,2.3,.15,3.1,a,-1.6,3.05,1);box(g,2.1,.6,.05,MT.glass,-1.6,2.4,2.53);
 [-3,3].forEach(x=>box(g,.08,.6,12,MT.yel,x,1.15,0));box(g,5.8,.12,1.4,MT.steel,0,.6,6.6);box(g,5.8,.12,1.4,MT.steel,0,.6,-6.6)};
MO.ballon=(g,p,a)=>{box(g,1.3,1,1.3,MT.wood,0,.5,0);const e=sph(g,3,p,0,6.6,0);e.scale.set(1,1.2,1);sph(g,3.05,a,0,6.6,0).scale.set(.35,1.21,1.01);
 cyl(g,.3,.4,MT.orange,0,2.6,0);[[-.6,-.6],[.6,-.6],[-.6,.6],[.6,.6]].forEach(q=>cyl(g,.02,2.6,MT.dark,q[0],2.1,q[1]))};
MO.siklo=(g,p,a)=>{const w=box(g,7,.12,1.6,p,0,5,0);w.rotation.z=0;box(g,2.2,.13,1.62,a,0,5.05,0);[-3,-1.2,1.2,3].forEach(x=>{const l=cyl(g,.01,4.2,MT.dark,x*.5,3,0,0,x*.06)});
 box(g,.6,.15,.6,MT.dark,0,.5,-.1);const r=new THREE.Mesh(geo('tor1',()=>new THREE.TorusGeometry(.75,.05,6,18)),MT.steel);r.position.set(0,1.1,-.6);g.add(r);box(g,1.3,.08,.08,MT.dark,0,1.1,-.62).userData.prop=1};
MO.permet=(g,p,a)=>{box(g,.9,.9,5,p,0,1.3,0);box(g,8,.12,1.4,p,0,1.85,.3);box(g,2.6,.1,.8,a,0,1.5,-2.3);box(g,.1,1,.8,a,0,2,-2.3);box(g,.8,.5,1,MT.glass,0,1.9,.9);
 box(g,1.6,.1,.1,MT.dark,0,1.3,2.55).userData.prop=1;box(g,7,.06,.06,MT.steel,0,1.65,-.2);[[-1.2,.8],[1.2,.8],[0,-2]].forEach(q=>cyl(g,.2,.15,MT.dark,q[0],.25,q[1],0,Math.PI/2))};
MO.jetpack=(g,p,a)=>{[-.17,.17].forEach(x=>{cyl(g,.15,.7,p,x,1.3,-.35);cyl(g,.1,.15,MT.dark,x,.9,-.35)});box(g,.5,.5,.12,a,0,1.35,-.22)};
MO.dron=(g,p,a)=>{box(g,.5,.14,.5,p,0,.3,0);[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(q=>{box(g,.06,.05,.6,MT.dark,q[0]*.3,.3,q[1]*.3).rotation.y=q[0]*q[1]*.78;
 const r=new THREE.Mesh(geo('rot',()=>new THREE.CylinderGeometry(.22,.22,.02,12)),MT.glass);r.position.set(q[0]*.45,.36,q[1]*.45);g.add(r)});sph(g,.07,MT.red,0,.22,.25)};
MO.kad=(g,p,a)=>{box(g,1.3,.7,2.3,MT.white,0,.55,0);box(g,1.05,.1,2,STD(0x7dd3fc),0,.88,0);[[-.5,.95],[.5,.95],[-.5,-.95],[.5,-.95]].forEach(q=>sph(g,.13,MT.yel,q[0],.15,q[1]));
 box(g,.35,.6,.3,p,0,.7,-1.3);cyl(g,.04,.45,MT.steel,0,1.1,.95);sph(g,.12,MT.yel,.3,1,.6)};
MO.szek=(g,p,a)=>{box(g,.7,.15,.7,p,0,.65,0);box(g,.7,.8,.12,p,0,1.1,-.35);cyl(g,.05,.45,MT.steel,0,.37,0);for(let i=0;i<5;i++){const o=box(g,.06,.05,.45,MT.dark,0,.12,0);o.rotation.y=i*1.256;o.position.set(Math.sin(i*1.256)*.2,.12,Math.cos(i*1.256)*.2)}
 [-.22,.22].forEach(x=>{cyl(g,.1,.55,MT.red,x,1,-.5,Math.PI/2);cyl(g,.07,.1,MT.dark,x,1,-.8,Math.PI/2)})};
MO.pult=(g,p,a)=>{box(g,2.4,1.1,1,MT.wood,0,.75,.3);box(g,2.5,.08,1.1,a,0,1.34,.3);box(g,.5,.4,.08,MT.dark,-.6,1.6,.2);box(g,.35,.06,.25,MT.white,.5,1.39,.3);
 box(g,.15,.25,.15,MT.red,.8,1.48,.4);box(g,.6,.5,.6,MT.dark,0,.6,-.5);cyl(g,.02,1.4,MT.steel,1.1,2,.6);box(g,.5,.3,.02,MT.green,1.35,2.5,.6);[[-1,.7],[1,.7],[-1,-.1],[1,-.1]].forEach(q=>sph(g,.13,MT.dark,q[0],.13,q[1]))};
MO.dino=(g,p,a)=>{box(g,1.8,1.7,3.2,p,0,3.6,0);box(g,1.3,1.1,1.6,p,0,4.9,2.2);box(g,1.2,.3,1.3,a,0,4.3,2.5);box(g,.9,.8,2.6,p,0,3.4,-2.6);box(g,.3,.2,.3,MT.red,.4,5.3,2.9);box(g,.3,.2,.3,MT.red,-.4,5.3,2.9);
 [-.65,.65].forEach(x=>{const l=box(g,.55,2.7,.7,MT.steel,x,1.4,0);l.userData.leg=x});box(g,.3,.9,.3,MT.steel,.9,3.2,1.4);box(g,.3,.9,.3,MT.steel,-.9,3.2,1.4);box(g,.8,.3,.8,MT.dark,0,4.5,-.3)};

// =================== ÁLLAPOT ===================
const S3={V:[],drive:null,T:0,G:null,fog:[],mk:[],adm:false,callT:0,bst:0,bcd:0,sprayOn:0};
const PCACHE={};const paintM=c=>PCACHE[c]||(PCACHE[c]=STD(c,{metalness:.3}));
const wat=(x,z)=>{try{return !!G.arh&&!hin(x,z)&&Math.hypot(x,z)<520}catch(e){return false}};
const land=(x,z)=>{try{return G.arh?hin(x,z):Math.hypot(x,z)<56}catch(e){return true}};
const fH=(x,z,y)=>{try{return floorH({x,z,y:y==null?50:y})}catch(e){return 0}};
const KC={};addEventListener('keydown',e=>{KC[e.code]=1},true);addEventListener('keyup',e=>{KC[e.code]=0},true);addEventListener('blur',()=>{for(const k in KC)KC[k]=0});
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};

function mk(k,x,z,a){const g=new THREE.Group(),sk=A.skin();MO[k](g,paintM(sk.c),paintM(sk.a),[],()=>{});scene.add(g);
 const d=DEF[k],v={k,m:g,x,z,a:a||0,sp:0,vy:0,fuel:1,y:d.mode==='water'||d.mode==='ferry'?0:fH(x,z),lb:A.lbl(d.n),t:0,stT:0};
 v.lb.position.y=d.mode==='air'&&k!=='jetpack'?(k==='ballon'?11:6):(d.seat||1)+2;g.add(v.lb);
 g.traverse(o=>{if(o.userData.prop)v.prop=o;if(o.userData.ban)v.ban=o;if(o.userData.leg)(v.legs=v.legs||[]).push(o)});
 if(k==='komp'){v.A=[x,z];v.B=ferryB(x,z,v.a);v.ph=0;v.wait=6}
 S3.V.push(v);place(v);return v}
function ferryB(x,z,a){const fx=Math.sin(a),fz=Math.cos(a);let wasW=false;for(let d=4;d<320;d+=3){const px=x+fx*d,pz=z+fz*d;if(wat(px,pz))wasW=true;else if(wasW)return[x+fx*(d-6),z+fz*(d-6)]}return[x+fx*60,z+fz*60]}
function spawn(k){if(!A.inMatch()||typeof G==='undefined')return null;const fx=Math.cos(G.ang),fz=Math.sin(G.ang);let x=G.x+fx*5,z=G.z+fz*5;
 const wm=DEF[k].mode==='water'||DEF[k].mode==='ferry';
 if(wm&&G.arh&&!wat(x,z)){let best=null;for(let r=4;r<90&&!best;r+=3)for(let q=0;q<6.28;q+=.3){const px=G.x+Math.cos(q)*r,pz=G.z+Math.sin(q)*r;if(wat(px,pz)&&wat(px+Math.cos(q)*6,pz+Math.sin(q)*6)){best=[px+Math.cos(q)*4,pz+Math.sin(q)*4,q];break}}
  if(best){x=best[0];z=best[1];return mk(k,x,z,Math.PI/2-best[2])}}
 return mk(k,x,z,Math.atan2(fx,fz))}
function clear(){if(S3.drive)leave(1);S3.V.forEach(v=>{try{scene.remove(v.m)}catch(e){}});S3.V=[];S3.fog.forEach(f=>{try{scene.remove(f.m)}catch(e){}});S3.fog=[];S3.mk.forEach(m=>{try{scene.remove(m.s)}catch(e){}});S3.mk=[]}
function place(v){const d=DEF[v.k],T=S3.T;let y=v.y;if(d.mode==='water'||d.mode==='ferry'||(d.mode==='amph'&&wat(v.x,v.z)))y=v.y+Math.sin(T*2.5+v.x)*.08;
 v.m.position.set(v.x,y,v.z);v.m.rotation.set(d.mode==='air'&&v.k!=='ballon'?-Math.max(-.3,Math.min(.3,v.vy*.04)):0,v.a,d.mode==='water'?Math.sin(T*2)*.04:0,'YXZ')}

// =================== BE/KI ===================
function near(){let b=null,bd=1e9;S3.V.forEach(v=>{const d=Math.hypot(v.x-G.x,v.z-G.z),dy=Math.abs((v.y||0)-G.y);if(d<(DEF[v.k].near||3)&&dy<6&&d<bd){bd=d;b=v}});return b}
function enter(v){S3.drive=v;v.lb.visible=false;v.sp=0;v.vy=0;if(DEF[v.k].mode==='drone'){v.home={x:G.x,y:G.y,z:G.z}}
 const d=DEF[v.k],h={water:'W/S gáz, A/D kormány',amph:'W/S gáz, A/D kormány',ground:'W/S gáz, A/D kormány'+(v.k==='szek'?', Shift boost':''),air:'W/S gáz, A/D fordul, Szóköz fel, C le'+(v.k==='permet'?', F permet':''),drone:'WASD, Szóköz/C magasság, F jelölés',ferry:'a komp magától jár'}[d.mode];
 sayX(d.n+' – '+h+', E kiszállás');try{A.tone(400,.1,'triangle',.06,700)}catch(e){}}
function leave(force){const v=S3.drive;if(!v)return true;const d=DEF[v.k];
 if(d.mode==='drone'){S3.drive=null;v.lb.visible=true;return true}
 let x=v.x,z=v.z;if((d.mode==='water'||d.mode==='ferry'||d.mode==='amph')&&wat(v.x,v.z)){let ok=null;for(let r=2;r<14&&!ok;r+=1.5)for(let q=0;q<6.28;q+=.4){const px=v.x+Math.cos(q)*r,pz=v.z+Math.sin(q)*r;if(land(px,pz)){ok=[px,pz];break}}
  if(!ok&&!force&&v.k!=='komp'){sayX('🌊 Itt nem tudsz kiszállni, menj közelebb a parthoz!');return false}if(ok){x=ok[0];z=ok[1]}}
 else{x=v.x+Math.cos(v.a)*1.8;z=v.z-Math.sin(v.a)*1.8;const o={x,z};try{pushOut(o,.5,v.y+.5)}catch(e){}x=o.x;z=o.z}
 S3.drive=null;v.lb.visible=true;v.sp=0;try{G.x=x;G.z=z;G.y=Math.max(fH(x,z,v.y+1),d.mode==='air'?v.y:0);G.vx=G.vz=G.vy=0;G.pm.visible=!G.fp}catch(e){}return true}
addEventListener('keydown',e=>{if(typing(e)||!A.normal()||typeof G==='undefined'||G.phase!=='play')return;
 if(e.key&&e.key.toLowerCase()==='e'&&!e.repeat){if(S3.drive){e.stopImmediatePropagation();leave();return}const v=near();if(v){e.stopImmediatePropagation();enter(v)}}
 if(e.code==='KeyF'&&S3.drive){if(S3.drive.k==='permet'){S3.sprayOn^=1;sayX(S3.sprayOn?'🌫️ Permet BE – ködfal húzása':'🌫️ Permet KI')}else if(S3.drive.k==='dron')mark()}},true);
{const ox=window.x20near;window.x20near=function(){try{if(A.inMatch()&&(S3.drive||near()))return true}catch(e){}return ox?ox.apply(this,arguments):false}}

// =================== EFFEKTEK ===================
const fogTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(230,230,230,.9)');g.addColorStop(1,'rgba(230,230,230,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const fogMat=new THREE.SpriteMaterial({map:fogTex,transparent:true,opacity:.75,depthWrite:false});
function fogAdd(x,y,z){if(S3.fog.length>=40){const f=S3.fog.shift();scene.remove(f.m)}const m=new THREE.Sprite(fogMat);m.scale.setScalar(7);m.position.set(x,y,z);scene.add(m);S3.fog.push({m,x,z,life:14})}
function slowAround(x,z,r,t){(G.en||[]).forEach(e=>{if(!e.dead&&Math.hypot(e.x-x,e.z-z)<r)e._j3s=Math.max(e._j3s||0,S3.T+t)})}
function tag(e,txt,col,t){const s=A.lbl(txt,col);s.position.set(e.x,(e.y||0)+3,e.z);scene.add(s);S3.mk.push({e,s,t:S3.T+t})}
function mark(){const v=S3.drive;let b=null,bd=26;(G.en||[]).forEach(e=>{if(e.dead||e._j3m>S3.T)return;const d=Math.hypot(e.x-v.x,e.z-v.z);if(d<bd){bd=d;b=e}});
 if(!b){sayX('🛸 Nincs bot a drón közelében (26 m)');return}b._j3m=S3.T+12;tag(b,'🎯 JELÖLVE','#f87171',12);sayX('🎯 Bot megjelölve 12 mp-re!');try{A.tone(900,.08,'square',.05)}catch(e){}}
function hitE(e,d){try{dmgE(e,d,false)}catch(er){}}

// =================== VEZETÉS ===================
function step(v,dt,me){const d=DEF[v.k];v.t+=dt;const kk=me?(A.keys()||{}):{};
 const th=me?((kk.w||kk.arrowup)?1:0)-((kk.s||kk.arrowdown)?1:0):0,st=me?((kk.a||kk.arrowleft)?1:0)-((kk.d||kk.arrowright)?1:0):0;
 const up=me&&(KC.Space?1:0)-(KC.KeyC?1:0);
 if(d.mode==='ferry'){// menetrend: A→B, várakozás, B→A
  if(v.wait>0)v.wait-=dt;else{const tg=v.ph?v.A:v.B,dx=tg[0]-v.x,dz=tg[1]-v.z,L=Math.hypot(dx,dz);v.sp=Math.min(d.max,v.sp+dt*2);if(L<1){v.ph^=1;v.wait=8;v.sp=0;if(me)sayX('⛴️ Kikötöttünk – 8 mp múlva indulunk tovább.')}
   else{v.a+=Math.atan2(Math.sin(Math.atan2(dx,dz)-v.a),Math.cos(Math.atan2(dx,dz)-v.a))*Math.min(1,dt*2);v.x+=Math.sin(v.a)*v.sp*dt;v.z+=Math.cos(v.a)*v.sp*dt}}
  place(v);return}
 if(d.mode==='air'||d.mode==='drone'){
  let mx=d.max;if(d.fuel&&v.fuel<=0)mx=d.minV*.6;
  v.sp+=th*d.acc*dt;v.sp*=1-dt*(th?.1:.4);v.sp=Math.max(me?d.minV*(v.y-fH(v.x,v.z,v.y)>1.5?1:0):0,Math.min(mx,v.sp));
  v.a+=st*dt*(v.k==='ballon'?.6:1.5);
  const gh=fH(v.x,v.z,v.y);let vy=me?(up>0&&(!d.fuel||v.fuel>0)?d.lift:up<0?-d.lift:d.idle):(v.y>gh+.1?-6:0);
  if(d.jet&&!(up>0&&v.fuel>0))vy=v.y>gh+.05?Math.max(-12,v.vy-9*dt):0;
  if(v.k==='siklo'&&me&&v.sp<d.minV*.8&&v.y>gh+1)vy-=2;
  v.vy=vy;v.y=Math.min(d.top,v.y+vy*dt);if(v.y<gh){v.y=gh;v.vy=0;if(d.mode==='air'&&!d.jet)v.sp*=1-dt*3}
  if(d.fuel&&me){if(up>0||(v.k!=='jetpack'&&v.sp>1))v.fuel=Math.max(0,v.fuel-d.ft*dt);else if(d.jet&&v.y<=gh+.05)v.fuel=Math.min(1,v.fuel+dt*.08)}
  if(d.mode==='drone'&&v.home&&Math.hypot(v.x-v.home.x,v.z-v.home.z)>80){v.sp=-2;if(!v.rw||v.rw<S3.T){v.rw=S3.T+2;sayX('📡 Hatótáv vége (80 m)!')}}
  const nx=v.x+Math.sin(v.a)*v.sp*dt,nz=v.z+Math.cos(v.a)*v.sp*dt;if(Math.hypot(nx,nz)<540){v.x=nx;v.z=nz}
  if(v.prop)v.prop.rotation.z+=dt*(10+v.sp*2);
  if(me&&v.k==='permet'&&S3.sprayOn){v.stT-=dt;if(v.stT<=0){v.stT=.22;fogAdd(v.x-Math.sin(v.a)*4,Math.max(gh+2,v.y-1),v.z-Math.cos(v.a)*4)}}
  if(me&&d.jet&&up>0&&v.fuel>0&&Math.random()<.5)J.emit('fire',v.x,v.y+.9,v.z,RN(-.3,.3),-4,RN(-.3,.3),.35,.3,.7);
  if(v.k==='ballon'&&me&&up>0&&Math.random()<.2)J.emit('fire',v.x,v.y+2.6,v.z,0,2,0,.3,.3,.8);
  place(v);return}
 // föld / víz
 let mx=d.max;const onW=wat(v.x,v.z);
 if(d.mode==='water'&&!onW)mx=d.max*.3;// parton/szárazon csak csúszik
 if(v.k==='szek'){S3.bcd-=dt;if(me&&KC.ShiftLeft&&S3.bcd<=0){S3.bst=2;S3.bcd=5;sayX('🚀 BOOST!');try{A.tone(200,.4,'sawtooth',.07,900)}catch(e){}}if(S3.bst>0){S3.bst-=dt;mx*=2.3;v.sp=Math.max(v.sp,d.max*1.6);if(Math.random()<.7)J.emit('fire',v.x-Math.sin(v.a)*.8,v.y+1,v.z-Math.cos(v.a)*.8,0,.5,0,.3,.3,.8)}}
 v.sp+=th*(th*v.sp<0?d.acc*2:d.acc)*dt;v.sp*=1-dt*(th?.3:1);v.sp=Math.max(-4,Math.min(mx,v.sp));
 v.a+=st*dt*1.8*Math.sign(v.sp||1)*Math.min(1,Math.abs(v.sp)/4);
 const nx=v.x+Math.sin(v.a)*v.sp*dt,nz=v.z+Math.cos(v.a)*v.sp*dt,nw=wat(nx,nz);
 const ok=d.mode==='ground'?!nw&&land(nx,nz):d.mode==='water'?(nw||!onW):Math.hypot(nx,nz)<520;
 if(ok){v.x=nx;v.z=nz}else v.sp*=-.3;
 if(!nw){const o={x:v.x,z:v.z};try{pushOut(o,v.k==='dino'?1.4:.8,v.y+.5)}catch(e){}if(Math.hypot(o.x-v.x,o.z-v.z)>.01)v.sp*=.5;v.x=o.x;v.z=o.z}
 v.y=nw?0:fH(v.x,v.z,v.y+1);
 const sp=Math.abs(v.sp);
 if(nw&&sp>4&&Math.random()<.3)J.emit('splash',v.x-Math.sin(v.a)*1.5,.2,v.z-Math.cos(v.a)*1.5,RN(-1,1),RN(1,3),RN(-1,1),.6,.3,.8);
 if(me&&v.k==='kampcs'&&sp>4){v.stT-=dt;if(v.stT<=0){v.stT=.4;const bx=v.x-Math.sin(v.a)*8,bz=v.z-Math.cos(v.a)*8;for(let i=0;i<3;i++)J.emit('spark',bx,1.6,bz,RN(-3,3),RN(1,3),RN(-3,3),1.5,.3,.5);slowAround(bx,bz,9,3)}}
 if(v.ban)v.ban.rotation.y=Math.sin(S3.T*3)*.15;
 if(v.legs)v.legs.forEach(l=>l.rotation.x=Math.sin(v.t*5)*Math.min(.6,sp*.08)*Math.sign(l.userData.leg));
 if(me&&v.k==='dino'&&sp>1.5){v.stT-=dt;if(v.stT<=0){v.stT=.7;try{A.tone(55,.25,'sawtooth',.09)}catch(e){}for(let i=0;i<5;i++)J.emit('dust',v.x+RN(-2,2),v.y+.2,v.z+RN(-2,2),RN(-2,2),1,RN(-2,2),.7,.6,1.8);
  (G.en||[]).forEach(e=>{if(!e.dead&&Math.hypot(e.x-v.x,e.z-v.z)<4.5)hitE(e,35)})}}
 if(me&&v.k==='pult'&&sp>3)(G.en||[]).forEach(e=>{if(e.dead||(e._j3p||0)>S3.T||Math.hypot(e.x-v.x,e.z-v.z)>2.2)return;e._j3p=S3.T+1.2;hitE(e,30+sp*2);
  const ft=e.dead?150000:40000;try{S.c+=ft;save()}catch(er){}tag(e,'🟥 IKTATVA +'+J.ft(ft),'#fca5a5',2);try{A.tone(160,.12,'square',.08)}catch(er){}});
 if(me&&(v.k==='kad'||v.k==='szek')&&sp>6)(G.en||[]).forEach(e=>{if(e.dead||(e._j3p||0)>S3.T||Math.hypot(e.x-v.x,e.z-v.z)>1.8)return;e._j3p=S3.T+1;hitE(e,sp*2)});
 place(v)}

// =================== FRISSÍTÉS ===================
const hud=document.createElement('div');hud.id='jm3bHud';hud.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:8;display:none;min-width:240px;padding:8px 14px;border-radius:14px;background:rgba(15,23,42,.88);border:1px solid rgba(250,204,21,.35);color:#f8fafc;font:600 13px system-ui,sans-serif;text-align:center;pointer-events:none';document.body.appendChild(hud);
let lastH='';function drawHud(){const v=S3.drive;let t='';if(v){const d=DEF[v.k];t='<div>'+d.n+'</div><div style="font:800 22px system-ui;color:#fde047">'+Math.round(Math.abs(v.sp)*3.6)+' km/h'+(d.mode==='air'||d.mode==='drone'?' · ↥ '+Math.round(v.y)+' m':'')+'</div>'+
 (d.fuel?'<small>⛽ '+Math.round(v.fuel*100)+'%</small><br>':'')+(v.k==='komp'?'<small>'+(v.wait>0?'⏳ Indulás '+Math.ceil(v.wait)+' mp':'⛴️ Úton a túlpartra')+'</small><br>':'')+'<small>'+d.d+' · E: kiszállás</small>'}
 else{const n=typeof G!=='undefined'&&G&&A.inMatch()&&near();if(n)t='<b>[E]</b> '+DEF[n.k].n}
 if(t!==lastH){lastH=t;hud.innerHTML=t;hud.style.display=t?'block':'none'}}
function camStep(dt){const v=S3.drive;if(!v)return;let c;try{c=cam}catch(e){return}const d=DEF[v.k];
 const D={komp:16,ballon:14,dino:12,permet:13,siklo:9,dron:4.5,jetpack:5}[v.k]||6.5,H={ballon:5,dino:4,komp:6}[v.k]||2.5;
 const tx=v.x-Math.sin(v.a)*D,tz=v.z-Math.cos(v.a)*D,ty=v.y+(d.seat||0)+H;S3.cp=S3.cp||{x:tx,y:ty,z:tz};const k=Math.min(1,dt*6);
 S3.cp.x+=(tx-S3.cp.x)*k;S3.cp.y+=(ty-S3.cp.y)*k;S3.cp.z+=(tz-S3.cp.z)*k;c.position.set(S3.cp.x,S3.cp.y,S3.cp.z);c.lookAt(v.x+Math.sin(v.a)*4,v.y+(d.seat||0)+1,v.z+Math.cos(v.a)*4)}
function tick(dt){S3.T+=dt;
 if(typeof G==='undefined'||!G||!A.inMatch()){if(S3.V.length)clear();S3.G=null;if(lastH){lastH='';hud.style.display='none'}return}
 if(S3.G!==G){clear();S3.G=G}
 if(!A.normal())return;
 // lassítás (szórólap / köd): a bot mozgásának csak 35%-a marad
 (G.en||[]).forEach(e=>{if(e.dead)return;if(e._j3s>S3.T&&e._j3x!=null){e.x=e._j3x+(e.x-e._j3x)*.35;e.z=e._j3z+(e.z-e._j3z)*.35}e._j3x=e.x;e._j3z=e.z});
 for(let i=S3.fog.length-1;i>=0;i--){const f=S3.fog[i];f.life-=dt;f.m.material.opacity=.75;if(f.life<=0){scene.remove(f.m);S3.fog.splice(i,1)}else if(i%4===(Math.floor(S3.T*10)%4))slowAround(f.x,f.z,4,.6)}
 for(let i=S3.mk.length-1;i>=0;i--){const m=S3.mk[i];if(m.t<S3.T||m.e.dead&&m.s.position.y>20){scene.remove(m.s);S3.mk.splice(i,1)}else m.s.position.set(m.e.x,(m.e.y||0)+3+(m.t-S3.T<2?(2-(m.t-S3.T)):0),m.e.z)}
 const dv=S3.drive;S3.V.forEach(v=>step(v,dt,v===dv));
 if(dv){const d=DEF[dv.k];if(d.mode==='drone'){const h=dv.home;G.x=h.x;G.z=h.z;G.vx=G.vz=0}
  else{G.x=dv.x;G.z=dv.z;G.y=dv.y+d.seat;G.vx=G.vz=G.vy=0;G.ang=Math.PI/2-dv.a}
  try{G.gun.visible=false}catch(e){}camStep(dt)}else S3.cp=null;
 drawHud()}
const ou=window.update;
if(typeof ou==='function')window.update=function(){const r=ou.apply(this,arguments);try{tick(Math.min(.05,arguments[0]||.016))}catch(e){console.error('jarmu3b',e)}return r};
else console.warn('jarmu3b: nincs window.update');

// =================== GARÁZS (jarmu2 addShop) ===================
J.addShop(w=>{const gr=w.querySelector('.gr');if(!gr)return;const own=J.own();
 gr.insertAdjacentHTML('beforeend','<div style="grid-column:1/-1;color:#fde047;font-weight:800;margin-top:6px">🌊✈️ Különleges járművek</div>'+KEYS3.map(k=>{const o=K[k];let img='';try{img=J.snap(k)}catch(e){}
  return'<div class="it"><img src="'+img+'" style="width:100%;height:110px;object-fit:cover;border-radius:10px;background:radial-gradient(#334155,#0f172a)"><b>'+o.n+'</b><br><small>'+o.d+'</small><br><small>🏎️ '+Math.round(o.max*3.6)+' km/h · '+({water:'🌊 víz',amph:'🌊+🛣️',ground:'🛣️ szárazföld',air:'✈️ lég',drone:'📡 táv',ferry:'⛴️ komp'})[o.mode]+'</small><br>'+
  (own.includes(k)?'<button class="own" disabled>✔ A garázsodban</button>':'<button class="buy" data-k="'+k+'">Megveszem – '+J.ft(o.price)+'</button>')+'</div>'}).join(''))});
// a /garazs és a 140h spawnFront a mi fajtáinkat a saját rendszerünkkel hozza
{const of=A.spawnFront;A.spawnFront=function(k){return DEF[k]?spawn(k):of.apply(this,arguments)}}

// =================== ADMIN ===================
const tok=()=>(window.ACC&&ACC.token)||localStorage.getItem('ry_token')||'';let lastTok=null;
async function admCheck(){const t=tok();if(t===lastTok)return;lastTok=t;S3.adm=false;if(!t)return;
 try{const r=await fetch('/api/admin/me',{headers:{Authorization:'Bearer '+t}});if(r.status!==200)return;const j=await r.json().catch(()=>({}));if(j&&j.admin===false)return;S3.adm=true;KEYS3.forEach(k=>J.give(k));try{J.redraw()}catch(e){}}catch(e){}}
setTimeout(admCheck,1500);setInterval(admCheck,15000);
{const oc=window.extraCmd;window.extraCmd=function(c){const a=String(c).trim().replace(/^\//,'').split(/\s+/),n=a[0].toLowerCase();
 const k=KEYS3.find(q=>DEF[q].cmd===n);
 if(k){if(!S3.adm)return oc?oc.apply(this,arguments):undefined;if(!A.inMatch())return'🚤 Csak meccsben!';spawn(k);return'✅ '+DEF[k].n+' előtted ([E])'}
 if((n==='garazs'||n==='garázs')&&a[1]&&A.inMatch()){const g=KEYS3.find(q=>q===a[1].toLowerCase()||DEF[q].cmd===a[1].toLowerCase());if(g){if(!J.own().includes(g))return'🏁 Ez nincs a garázsodban.';
  const now=performance.now();if(now<S3.callT)return'⏳ A garázs még '+Math.ceil((S3.callT-now)/1000)+' mp-ig pihen.';S3.callT=now+90000;spawn(g);return'🏁 Megérkezett: '+DEF[g].n}}
 return oc?oc.apply(this,arguments):undefined}}

window._jm3b=()=>S3;window._jm3bApi={spawn,enter,leave,DEF,clear};
})();
