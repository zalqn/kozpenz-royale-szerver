// ===== FLAKONVADÁSZAT: önálló játékmód a szigeten (időre gyűjtés, visszaváltó automaták, versenytársak) =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const TIME=300,CAP=15,PRICE=50,NB=90,NRIV=0,HOLD=3;
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const ui=document.createElement('div');ui.style.cssText='position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:3;pointer-events:none;display:none;gap:10px;font-family:"Luckiest Guy",Impact;text-shadow:0 2px 0 #000';
ui.innerHTML='<span id="fmT" style="background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:5px 14px;color:#fff">⏱️ 4:00</span><span id="fmB" style="background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:5px 14px;color:#fde68a">🛍️ 0/15</span><span id="fmE" style="background:#064e3bcc;border:1px solid #4ade8066;border-radius:10px;padding:5px 14px;color:#a3e635">💵 0 Ft</span><span id="fmN" style="background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:5px 14px;color:#7dd3fc">♻️ —</span>';
$('hud').appendChild(ui);
// 3D modellek
const MATS={};const m=(c,o)=>MATS[c+JSON.stringify(o||{})]||(MATS[c+JSON.stringify(o||{})]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.25,metalness:.1},o||{})));
// részletes flakonok saját (kitalált) címkékkel
const LBL={};
function label(key,draw){if(LBL[key])return LBL[key];const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');draw(x,512,256);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return LBL[key]=t}
const LABELS={
 kosor:x=>{const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#14532d');g.addColorStop(.5,'#16a34a');g.addColorStop(1,'#14532d');x.fillStyle=g;x.fillRect(0,0,512,256);x.fillStyle='#facc15';x.fillRect(0,40,512,10);x.fillRect(0,206,512,10);
  [80,336].forEach(cx=>{x.fillStyle='#fef3c7';x.beginPath();x.ellipse(cx,128,74,58,0,0,7);x.fill();x.strokeStyle='#ca8a04';x.lineWidth=5;x.stroke();x.fillStyle='#14532d';x.font='bold 46px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText('KŐSÖR',cx,118);x.font='bold 18px Arial';x.fillText('VILÁGOS · 0,5 L',cx,156)});x.fillStyle='#fff';x.font='bold 14px Arial';x.fillText('Alc. 4,3% vol',208,230)},
 barna:x=>{x.fillStyle='#fef3c7';x.fillRect(0,0,512,256);x.fillStyle='#7c2d12';x.fillRect(0,0,512,22);x.fillRect(0,234,512,22);[90,346].forEach(cx=>{x.fillStyle='#b91c1c';x.font='bold 40px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText('Pusztai',cx,100);x.fillStyle='#7c2d12';x.font='italic 26px Georgia';x.fillText('Barna Sör',cx,142);x.font='14px Arial';x.fillText('0,5 L · alapítva 1896',cx,178)})},
 gyogy:x=>{x.fillStyle='#ea580c';x.fillRect(0,0,512,256);x.fillStyle='#fff7ed';x.fillRect(0,20,512,216);x.strokeStyle='#14532d';x.lineWidth=6;x.strokeRect(10,30,492,196);[110,366].forEach(cx=>{x.fillStyle='#14532d';x.beginPath();x.moveTo(cx,60);x.lineTo(cx-30,120);x.lineTo(cx+30,120);x.closePath();x.fill();x.beginPath();x.moveTo(cx,80);x.lineTo(cx-38,150);x.lineTo(cx+38,150);x.closePath();x.fill();x.fillRect(cx-5,150,10,14);
  x.fillStyle='#9a3412';x.font='bold 30px Georgia';x.textAlign='center';x.fillText('ERDEI GYÓGY',cx,195);x.font='14px Arial';x.fillStyle='#14532d';x.fillText('56 gyógynövény · 0,7 L',cx,216)})},
 viz:x=>{const g=x.createLinearGradient(0,0,512,0);g.addColorStop(0,'#0ea5e9');g.addColorStop(1,'#1d4ed8');x.fillStyle=g;x.fillRect(0,0,512,256);x.fillStyle='#fff';[100,356].forEach(cx=>{x.font='bold 40px Arial';x.textAlign='center';x.fillText('SZIGET',cx,110);x.font='22px Arial';x.fillText('ásványvíz · 1 L',cx,145);x.beginPath();x.moveTo(cx-60,175);x.quadraticCurveTo(cx-30,155,cx,175);x.quadraticCurveTo(cx+30,195,cx+60,175);x.lineWidth=5;x.strokeStyle='#bae6fd';x.stroke()})},
 udito:x=>{x.fillStyle='#166534';x.fillRect(0,0,512,256);x.fillStyle='#bef264';x.beginPath();for(let i=0;i<12;i++){x.moveTo(i*45,256);x.lineTo(i*45+30,0);x.lineTo(i*45+42,0);x.lineTo(i*45+12,256)}x.fill();[110,366].forEach(cx=>{x.fillStyle='#fff';x.strokeStyle='#14532d';x.lineWidth=8;x.font='bold 48px Arial Black, Arial';x.textAlign='center';x.strokeText('ZÖLD',cx,120);x.fillText('ZÖLD',cx,120);x.font='bold 26px Arial';x.strokeText('FRISS 2 L',cx,160);x.fillText('FRISS 2 L',cx,160)})},
 villam:x=>{x.fillStyle='#111111';x.fillRect(0,0,512,256);const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#3f3f46');g.addColorStop(.5,'#18181b');g.addColorStop(1,'#3f3f46');x.fillStyle=g;x.fillRect(0,0,512,256);
  x.fillStyle='#dc2626';x.fillRect(0,26,512,8);x.fillRect(0,222,512,8);[128,384].forEach(cx=>{x.save();x.translate(cx,128);x.rotate(-.08);x.fillStyle='#ef4444';x.shadowColor='#ef4444';x.shadowBlur=14;x.font='bold 64px Arial Black, Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('HÖLL',0,-8);x.shadowBlur=0;x.fillStyle='#e5e7eb';x.font='bold 16px Arial';x.fillText('ENERGY DRINK · 250 ml',0,40);x.restore()})}};
const LM={};const lmat=(k,o)=>LM[k]||(LM[k]=new THREE.MeshStandardMaterial(Object.assign({map:label(k,LABELS[k]),roughness:.35,metalness:.1},o||{})));
const gm=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.08,metalness:.15,transparent:true,opacity:.82},o||{}));
const GLASS_BROWN=gm(0x6b3410),GLASS_GREEN=gm(0x14532d,{opacity:.9}),PET_BLUE=gm(0xbfe6ff,{opacity:.55,roughness:.05}),PET_GREEN=gm(0x86efac,{opacity:.6}),CAP_GOLD=new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.9,roughness:.25}),
 CAP_BLUE=new THREE.MeshStandardMaterial({color:0x1d4ed8,roughness:.4}),CAP_GREEN=new THREE.MeshStandardMaterial({color:0x15803d,roughness:.4}),ALU=new THREE.MeshStandardMaterial({color:0xd1d5db,metalness:.95,roughness:.25});
function prof(pts){return new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),20)}
function bottle(){const g=new THREE.Group(),k=Math.random();let m;
 if(k<.24){// sörösdoboz 0,5 L (horpadt)
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,1.1,20,1,true),lmat('kosor',{metalness:.5,roughness:.3}));body.position.y=.6;const top=new THREE.Mesh(new THREE.CylinderGeometry(.29,.33,.08,20),ALU);top.position.y=1.19;const bot=new THREE.Mesh(new THREE.CylinderGeometry(.33,.29,.06,20),ALU);bot.position.y=.04;
  const tab=new THREE.Mesh(new THREE.BoxGeometry(.14,.02,.08),ALU);tab.position.set(.08,1.24,0);g.add(body,top,bot,tab);g.scale.set(1,Math.random()<.4?.8:1,1)}
 else if(k<.42){// barna sörösüveg 0,5 L
  const b=new THREE.Mesh(prof([[0,0],[.3,0],[.32,.05],[.32,.9],[.28,1.05],[.13,1.3],[.12,1.65],[.14,1.7],[0,1.7]]),GLASS_BROWN);const l=new THREE.Mesh(new THREE.CylinderGeometry(.325,.325,.42,20,1,true),lmat('barna'));l.position.y=.48;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.07,16),CAP_GOLD);c.position.y=1.72;g.add(b,l,c)}
 else if(k<.56){// gyógynövénylikőr 0,7 L
  const b=new THREE.Mesh(prof([[0,0],[.34,0],[.36,.05],[.36,1.05],[.3,1.2],[.12,1.35],[.11,1.65],[0,1.65]]),GLASS_GREEN);const l=new THREE.Mesh(new THREE.CylinderGeometry(.365,.365,.55,20,1,true),lmat('gyogy'));l.position.y=.6;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.22,16),new THREE.MeshStandardMaterial({color:0xea580c,roughness:.5}));c.position.y=1.74;g.add(b,l,c)}
 else if(k<.74){// ásványvíz PET 1 L
  const b=new THREE.Mesh(prof([[0,0],[.3,0],[.33,.1],[.31,.25],[.33,.4],[.33,1.05],[.24,1.3],[.12,1.5],[.11,1.62],[0,1.62]]),PET_BLUE);const l=new THREE.Mesh(new THREE.CylinderGeometry(.335,.335,.4,20,1,true),lmat('viz'));l.position.y=.75;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.13,16),CAP_BLUE);c.position.y=1.68;g.add(b,l,c)}
 else if(k<.88){// üdítő PET 2 L
  const b=new THREE.Mesh(prof([[0,0],[.38,0],[.43,.12],[.41,.3],[.43,.45],[.43,1.35],[.3,1.65],[.13,1.88],[.12,2],[0,2]]),PET_GREEN);const l=new THREE.Mesh(new THREE.CylinderGeometry(.435,.435,.5,20,1,true),lmat('udito'));l.position.y=.9;
  const c=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.14,16),CAP_GREEN);c.position.y=2.06;g.add(b,l,c)}
 else{// energiaital
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,1,20,1,true),lmat('villam',{metalness:.6,roughness:.25}));body.position.y=.55;const top=new THREE.Mesh(new THREE.CylinderGeometry(.22,.25,.07,20),ALU);top.position.y=1.08;g.add(body,top)}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.scale.multiplyScalar(1.25);return g}

function machine(){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(2.2,3.2,1.4),m(0x15803d,{roughness:.4}));body.position.y=1.6;const top=new THREE.Mesh(new THREE.BoxGeometry(2.4,.3,1.6),m(0x064e3b));top.position.y=3.35;
 const scr=new THREE.Mesh(new THREE.BoxGeometry(1.2,.6,.05),new THREE.MeshBasicMaterial({color:0x86efac}));scr.position.set(0,2.4,.72);const slot=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.1,20),new THREE.MeshBasicMaterial({color:0x111111}));slot.rotation.x=Math.PI/2;slot.position.set(0,1.5,.72);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.4,.06,8,24),new THREE.MeshBasicMaterial({color:0xa7f3d0}));ring.position.set(0,1.5,.74);g.add(body,top,scr,slot,ring);
 const lb=spr('♻️ VISSZAVÁLTÓ',3,'x');lb.position.y=4.6;lb.material.depthTest=false;g.add(lb);const beam=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,60,10,1,true),new THREE.MeshBasicMaterial({color:0x4ade80,transparent:true,opacity:.18,depthWrite:false}));beam.position.y=30;g.add(beam);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
let F=null;window._FK=()=>F;
['say','spk','ftx','taunt'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(){if(G&&G.fk)return;return o.apply(this,arguments)}});let eHeld=false;window._fkE=v=>{eHeld=v};addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e')eHeld=true});addEventListener('keyup',e=>{if(e.key.toLowerCase()==='e')eHeld=false});
const hr=document.createElement('div');hr.style.cssText='position:absolute;left:50%;top:60%;transform:translate(-50%,-50%);z-index:4;pointer-events:none;display:none;text-align:center;font:16px "Luckiest Guy",Impact;color:#fff;text-shadow:0 2px 0 #000';
const hrT=document.createElement('div'),hrR=document.createElement('i');hrR.style.cssText='display:block;margin:6px auto 0;width:64px;height:64px;border-radius:50%';hr.append(hrT,hrR);$('hud').appendChild(hr);
{const _w=window.wall;window.wall=function(){if(G&&G.fk)return;return _w.apply(this,arguments)}}
// a flakonos módban nincs fegyver: nincs lövés, újratöltés, építés, és a fegyveres kijelzők is eltűnnek
['sht','reload','toggleBuild','ulti'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(){if(G&&G.fk)return;return o.apply(this,arguments)}});
const fkHide=on=>['inv','brAmmo','prX','xh','tiltb','brRel','mg'].forEach(i=>{const e=document.getElementById(i);if(e)e.style.visibility=on?'hidden':''});
WP('update',null,()=>{const g=G;if(!g)return;if(g.fk){if(g.gun)g.gun.visible=false;g.buildMode=false;fkHide(true)}});
WP('launch',null,()=>fkHide(!!(G&&G.fk)));WP('end',null,()=>fkHide(false));
function spot(near,r){for(let k=0;k<60;k++){const x=near?near.x+rnd(-r,r):rnd(-280,280),z=near?near.z+rnd(-r,r):rnd(-160,160);if(hin(x,z)&&!G.col.some(c=>c.hw?Math.abs(x-c.x)<c.hw+1&&Math.abs(z-c.z)<c.hd+1:Math.hypot(x-c.x,z-c.z)<c.r+1))return{x,z}}return{x:0,z:30}}
function addBottle(near){const p=spot(near,near?40:0),b=bottle(),ly=Math.random()<.55;const piv=new THREE.Group();piv.add(b);if(ly){b.rotation.z=Math.PI/2;b.position.set(.7,.42,0)}piv.position.set(p.x,0,p.z);piv.rotation.y=Math.random()*6;scene.add(piv);F.bottles.push({m:piv,x:p.x,z:p.z,ph:Math.random()*6})}
WP('launch',null,()=>{const g=G;if(window.GAME_MODE!=='flakon'){ui.style.display='none';F=null;return}
 g.fk=true;g.nka=false;g.cash=0;g.sto=9999;g.maxW=99;if(g.sm)g.sm.visible=false;ui.style.display='flex';
 F={t:TIME,bag:0,earned:0,n:0,bottles:[],machines:[],riv:[],started:false};
 const placeM=(x,z)=>{const mm=machine();mm.position.set(x,0,z);scene.add(mm);g.col.push({x,z,r:1.4,h:3.4});F.machines.push({m:mm,x,z})};
 (g.cities||[]).slice().sort(()=>Math.random()-.5).slice(0,6).forEach(c=>placeM(c.x-4.5,c.z+4.5));
 [[8,36],[-22,40]].forEach(([x,z])=>{const p=spot({x,z},6);placeM(p.x,p.z)});
 if(!F.machines.length){const mm=machine();mm.position.set(4,0,36);scene.add(mm);F.machines.push({m:mm,x:4,z:36})}
 $('wv').textContent='♻️ FLAKONVADÁSZAT';say('♻️ FLAKONVADÁSZAT! Gyűjts flakonokat, és vidd őket a zöld visszaváltókhoz – darabja 50 Ft!')});
const _sw=window.spawnWave;window.spawnWave=function(){if(G&&G.fk)return;return _sw.apply(this,arguments)};
WP('land',null,()=>{const g=G;if(!g||!g.fk||!F||F.started)return;F.started=true;const near={x:g.x,z:g.z};for(let i=0;i<NB;i++)addBottle(i<35?near:null);
 for(let i=0;i<NRIV;i++){const p=spot(near,50),r=person([0x92400e,0x334155,0x7c3aed,0x0e7490,0xb91c1c][i],'🛍️',1);r.position.set(p.x,0,p.z);scene.add(r);const lb=spr(['Gyűjtő Gizi','Zsákos Zoli','Flakon Feri','Doboz Dóri','PET Pista'][i],2.2,'x');lb.position.y=4.2;r.add(lb);F.riv.push({m:r,x:p.x,z:p.z,tgt:null,sp:rnd(2.8,3.8),got:0})}
 say('🛍️ Egyedül vagy a szigeten – menj a flakonokhoz, és tartsd nyomva az E-t!')});
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!g.fk||!F||g.phase!=='play'||g.over)return;g.delay=1e9;g.cash=0;g.grants=[];g.en=g.en.filter(e=>!e.dead);
 F.t-=dt;const T=Math.max(0,F.t);$('fmT').textContent='⏱️ '+Math.floor(T/60)+':'+String(Math.floor(T%60)).padStart(2,'0');$('fmT').style.color=T<30?'#ff6b81':'#fff';
 // flakonok: lebegés + felvétel
 F.bottles.forEach(b=>{b.m.position.y=0;});
 // E nyomva tartása a legközelebbi flakonnál
 {let nb=null,nd=2.8;F.bottles.forEach(b=>{if(b.gone)return;const d=Math.hypot(b.x-g.x,b.z-g.z);if(d<nd){nd=d;nb=b}});
  const moving=Math.hypot(g.vx||0,g.vz||0)>1.2||g.y>.3||g.gl||Math.abs(g.vy||0)>.5;F.near=nb;
  if(nb&&eHeld&&!moving&&F.bag<CAP){if(F.hb!==nb){F.hb=nb;F.ht=0}F.ht+=dt;const f=Math.min(1,F.ht/HOLD);hr.style.display='block';hrT.textContent='';hrR.style.background='conic-gradient(#4ade80 '+(f*360)+'deg,#0008 0)';
   if(f>=1){nb.gone=true;scene.remove(nb.m);F.bag++;F.hb=null;F.ht=0;try{sfx('coin')}catch(e){}ftx(g.x,g.z,'🛍️ +1 flakon','')}}
  else{F.hb=null;F.ht=0;if(nb&&F.bag<CAP){hr.style.display='block';hrT.textContent='';hrR.style.background='conic-gradient(#4ade80 0deg,#0008 0)'}else{hr.style.display=(F.bag>=CAP&&nb)?'block':'none';if(F.bag>=CAP&&nb)hrT.textContent=''}}}
 if(F.bag>=CAP&&!F.fullWarn){F.fullWarn=true;say('🛍️ TELE A ZSÁK! Vidd a visszaváltóhoz!')}
 // versenytársak
 F.riv.forEach(r=>{if(!r.tgt||r.tgt.gone){let best=null,bd=1e9;F.bottles.forEach(b=>{if(b.gone)return;const d=Math.hypot(b.x-r.x,b.z-r.z);if(d<bd){bd=d;best=b}});r.tgt=best}
  if(r.tgt){const dx=r.tgt.x-r.x,dz=r.tgt.z-r.z,d=Math.hypot(dx,dz)||1;r.x+=dx/d*r.sp*dt;r.z+=dz/d*r.sp*dt;pushOut(r,.8,0);r.m.rotation.y=Math.atan2(dx,dz);if(d<1.6){r.tgt.gone=true;scene.remove(r.tgt.m);r.got++;if(Math.hypot(r.x-g.x,r.z-g.z)<25)ftx(r.x,r.z,'😈 Elhappolta!','');r.tgt=null}}
  r.m.position.set(r.x,Math.abs(Math.sin(g.t*9+r.sp))*.08,r.z)});
 F.bottles=F.bottles.filter(b=>!b.gone);g._fkSp=(g._fkSp||0)-dt;if(g._fkSp<=0&&F.bottles.length<NB*.7){g._fkSp=2;addBottle(null);addBottle({x:g.x,z:g.z})}
 // visszaváltók
 let nm=null,nd=1e9;F.machines.forEach(mc=>{const d=Math.hypot(mc.x-g.x,mc.z-g.z);if(d<nd){nd=d;nm=mc}mc.m.children[4].rotation.z+=dt*2});
 $('fmN').textContent='♻️ Legközelebbi automata: '+Math.round(nd)+' m';
 if(nm&&nd<4.2&&F.bag>0){g._fkFeed=(g._fkFeed||0)-dt;if(g._fkFeed<=0){g._fkFeed=.18;F.bag--;F.n++;F.earned+=PRICE;S.c+=PRICE;try{save()}catch(e){}ftx(nm.x,nm.z,'+50 Ft','');try{sfx('coin')}catch(e){}if(!F.bag){F.fullWarn=false;say('♻️ Visszaváltva! Eddig: '+ft(F.earned))}}}
 $('fmB').textContent='🛍️ '+F.bag+'/'+CAP;$('fmB').style.color=F.bag>=CAP?'#ff6b81':'#fde68a';$('fmE').textContent='💵 '+ft(F.earned);
 $('al').textContent='VISSZAVÁLTVA: '+F.n+' db';$('wv').textContent='♻️ FLAKONVADÁSZAT · EGYEDÜL';
 if(F.t<=0){say('⏱️ LEJÁRT AZ IDŐ!');g.cash=0;end(false)}});
WP('end',null,a=>{const g=G;ui.style.display='none';if(!g||!g.fk||!F)return;const won=F.n>=40;hr.style.display='none';
 const rt=$('rt');if(rt){rt.innerHTML=won?'♻️ FLAKONKIRÁLY!':'♻️ FLAKONVADÁSZAT VÉGE';rt.style.color=won?'var(--y)':'#a3e635'}const rs=$('rs');if(rs)rs.textContent='Lejárt a 4 perc – lássuk a zsákot!';
 const rb=$('rb');if(rb)rb.innerHTML='<div style="font-size:18px;line-height:1.7">♻️ Visszaváltott flakon: <b>'+F.n+' db</b><br>💵 Kereset: <b style="color:#a3e635">'+ft(F.earned)+'</b><br>🛍️ Zsákban maradt (elveszett): '+F.bag+' db<br>🏅 '+(won?'<b style="color:#facc15">Flakonkirály-szint! (40+ db)</b>':'Flakonkirály lesz belőled 40 darabtól!')+'</div>';
 if(window.ACCXP)ACCXP.add(F.n*12+(won?300:0),'Flakonvadászat');
 const s=JSON.parse(localStorage.getItem('ry_fk')||'{"n":0,"ft":0}');s.n+=F.n;s.ft+=F.earned;localStorage.setItem('ry_fk',JSON.stringify(s))});
})();
