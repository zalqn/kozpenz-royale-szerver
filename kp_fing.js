// Sziget Aréna – 💨 Fingdobálós mód: budi-dekor, babkonzerv (turbó), orrcsipesz (védelem), szálló bűzfelhők, Bűzmérő HUD, kör végi statisztika
(function(){
window._kpMode=window._kpMode||{};
const I=()=>window._kpI;
let F=null; // kör-állapot
const CLOUD_T=4.5,ITEMS=[{k:'bab',e:'🥫',n:'Babkonzerv',t:8},{k:'csip',e:'📎',n:'Orrcsipesz',t:9}];
function MO(o){const W=I().W;I().SC.add(o);(W.modeObj=W.modeObj||[]).push(o);return o}
function sprite(e,s){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:I().texEmoji(e),transparent:true}));m.scale.set(s,s,1);return m}
function budi(x,z){ // fa budi holdacskával
 const g=new THREE.Group(),wd=new THREE.MeshLambertMaterial({color:0x8b5a2b}),rf=new THREE.MeshLambertMaterial({color:0x5b3a1a});
 const b=new THREE.Mesh(new THREE.BoxGeometry(1,1.9,1),wd);b.position.y=.95;b.castShadow=true;g.add(b);
 const r=new THREE.Mesh(new THREE.ConeGeometry(.85,.6,4),rf);r.position.y=2.2;r.rotation.y=Math.PI/4;g.add(r);
 const mo=sprite('🌙',.4);mo.position.set(0,1.5,.52);g.add(mo);
 g.position.set(x,0,z);g.rotation.y=Math.atan2(-x,-z);return MO(g)}
function stats(){const W=I().W;if(!F||!W.P.length)return;const best=W.P.reduce((a,p)=>(F.st.get(p)||0)>(F.st.get(a)||0)?p:a,W.P[0]);const n=F.st.get(best)||0;
 if(n)I().feed(`🏆 Legbüdösebb: <b>${best.name}</b> – ${n} szájtalálat · felhők: ${F.clouds_n} · 🥫 ${F.beans}`)}
window._kpMode.fing={
 round(W,SC){
  stats();
  F={clouds:[],items:[],st:new Map(),itT:3,clouds_n:0,beans:0,coughT:0};
  const R=W.R;budi(R*.28,R*.12);budi(-R*.2,-R*.3); // középen: a kezdőkörön (R*.6) nem takarja a kamerát
  for(let i=0;i<5;i++){const a=i*1.3+.4,d=R*(.35+.4*((i*37%10)/10));const c=MO(sprite('🥬',.7));c.position.set(Math.cos(a)*d,.35,Math.sin(a)*d)}
  // HUD
  let h=document.getElementById('kpFingH');if(!h){h=document.createElement('div');h.id='kpFingH';h.style.cssText='position:absolute;left:12px;bottom:175px;z-index:9;padding:6px 10px;border-radius:10px;background:rgba(40,45,10,.65);color:#ecfccb;font:600 13px system-ui;pointer-events:none;min-width:150px';(document.getElementById('kpTop')?.parentNode||document.body).appendChild(h)}
  h.style.display='';
 },
 tick(dt,T,W){
  if(!F)return;const K=I(),me=W.me;
  // tárgyak spawn
  F.itT-=dt;if(W.live&&F.itT<=0&&F.items.length<2){F.itT=7+Math.random()*5;const it=ITEMS[Math.random()<.6?0:1],a=Math.random()*6.28,d=Math.random()*W.R*.6;const m=MO(sprite(it.e,.9));m.position.set(Math.cos(a)*d,.6,Math.sin(a)*d);F.items.push({m,it})}
  for(let i=F.items.length-1;i>=0;i--){const o=F.items[i];o.m.position.y=.6+Math.sin(T*3+i)*.15;
   const p=W.P.find(p=>p.alive&&Math.hypot(p.x-o.m.position.x,p.z-o.m.position.z)<.8);
   if(p){p['f_'+o.it.k]=o.it.t;K.SC.remove(o.m);F.items.splice(i,1);K.burst(o.m.position.x,.8,o.m.position.z,o.it.k==='bab'?0xd97706:0x93c5fd,14,4);if(o.it.k==='bab')F.beans++;
    K.feed(`${o.it.e} ${p.name}: ${o.it.n}!`);if(p===me){K.banner(o.it.e+' '+o.it.n.toUpperCase(),.8,36);K.tone(300,700,.25,.2,'square')}continue}
   // botok a közeli tárgy felé
   for(const b of W.P)if(b.bot&&b.alive&&!b.stun){const dx=o.m.position.x-b.x,dz=o.m.position.z-b.z,d=Math.hypot(dx,dz);if(d<4&&d>.1){b.vx+=dx/d*6*dt;b.vz+=dz/d*6*dt}}}
  // időzítők
  for(const p of W.P){if(p.f_bab>0)p.f_bab-=dt;if(p.f_csip>0)p.f_csip-=dt}
  // felhők: sodródnak, aki benne áll köhög és nő a %-a
  F.coughT-=dt;
  for(let i=F.clouds.length-1;i>=0;i--){const c=F.clouds[i];c.t-=dt;c.m.position.x+=Math.cos(W.windA||0)*.4*dt;c.m.position.z+=Math.sin(W.windA||0)*.4*dt;
   const s=c.r*(1+Math.sin(T*4+i)*.08);c.m.scale.set(s,s*.6,s);c.m.material.opacity=Math.min(.45,c.t*.2);
   if(c.t<=0){K.SC.remove(c.m);c.m.material.dispose();F.clouds.splice(i,1);continue}
   for(const p of W.P){if(!p.alive||p===c.o||p.f_csip>0)continue;if(Math.hypot(p.x-c.m.position.x,p.z-c.m.position.z)<c.r){p.pct=Math.min(300,p.pct+6*dt);p.vx*=1-1.5*dt;p.vz*=1-1.5*dt;p.lastHit=c.o;p.lastHitT=2;
    if(p===me&&F.coughT<=0){F.coughT=.9;K.noise(.15,900,400,2,.15,'bandpass');K.shake=Math.max(K.shake,.06)}
    else if(p.bot&&Math.random()<dt*.4)K.taunt(p,['Khö-khö! 😷','Levegőt!','Ki volt az?! 🤢'][Math.random()*3|0])}}}
 },
 hit(s,t){
  if(!F)return;const K=I();
  if(t.f_csip>0&&Math.random()<.5){K.burst(t.x,t.y+1.6,t.z,0x93c5fd,10,3);if(s.o===K.W.me)K.banner('📎 ORRCSIPESZ!',.6,30);return false}
  F.st.set(s.o,(F.st.get(s.o)||0)+1);
  if(s.o.f_bab>0)s.pow*=1.4; // babos turbó
  const r=(s.big?1.8:1.1)*(s.o.f_bab>0?1.4:1);
  const m=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),new THREE.MeshLambertMaterial({color:0x9bb83a,transparent:true,opacity:.45,depthWrite:false}));
  m.position.set(t.x,t.y+1,t.z);MO(m);F.clouds.push({m,r,t:CLOUD_T,o:s.o});F.clouds_n++;
  if(F.clouds.length>10){const c=F.clouds.shift();K.SC.remove(c.m)}
  K.tone(70+Math.random()*40,40,.4,.25,'sawtooth');
 },
 hud(W){const h=document.getElementById('kpFingH');if(!h||!F||!W.me)return;const me=W.me,n=F.st.get(me)||0,top=Math.max(1,...W.P.map(p=>F.st.get(p)||0));
  h.innerHTML=`💨 BŰZMÉRŐ: ${n} szájtalálat<div style="height:6px;background:#3f3f1a;border-radius:3px;margin:3px 0"><div style="height:6px;width:${n/top*100}%;background:#a3e635;border-radius:3px"></div></div>${me.f_bab>0?'🥫 turbó '+me.f_bab.toFixed(0)+'s ':''}${me.f_csip>0?'📎 csipesz '+me.f_csip.toFixed(0)+'s':''}`}
};
// más módban rejtsük a HUD-ot
setInterval(()=>{const h=document.getElementById('kpFingH');if(h&&window._kpI&&(_kpI.MD()!=='fing'||!_kpI.W||!_kpI.W.live&&!_kpI.W.P.length))h.style.display='none';if(h&&window._kpI&&_kpI.MD()!=='fing')F=null},1000);
const M=I&&window._kpI&&_kpI.MODES.fing;if(M)M.d='Csak a SZÁJBA dobott fing számít! A találat bűzfelhőt hagy 🤢 · 🥫 babkonzerv = turbó · 📎 orrcsipesz = védelem';
})();
