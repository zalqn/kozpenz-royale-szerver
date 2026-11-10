// Sziget Aréna – 'viz' mód: világítótorony/kőoszlopok/stégek, lebegő roncsok, vízszint-HUD, emelkedő víz hang, elárasztás-csobbanás, kör-statisztika
(function(){window._kpMode=window._kpMode||{};
const I=()=>window._kpI;let deco=[],bob=[],beam=null,hud=null,flooded=new Set(),wasLive=false,st=new Map(),sndT=0,warned=0;
function MO(o){const W=I().W;I().SC.add(o);W.modeObj.push(o);deco.push(o);return o}
const M=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
function cyl(r1,r2,h,n,m,x,y,z){const c=MO(new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,n),m));c.position.set(x,y,z);c.castShadow=c.receiveShadow=true;return c}
function box(w,h,d,m,x,y,z){const c=MO(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m));c.position.set(x,y,z);c.castShadow=c.receiveShadow=true;return c}
function lighthouse(t){const wh=M(0xf8fafc),rd=M(0xdc2626),n=5,sh=t.h/n;
 for(let i=0;i<n;i++){const k0=1-i/n*.12,k1=1-(i+1)/n*.12;cyl(t.r*k1,t.r*k0,sh,24,i%2?rd:wh,t.x,sh*i+sh/2,t.z)}
 cyl(t.r*1.08,t.r*1.08,.08,24,M(0x334155),t.x,t.h+.04,t.z);// a tető maga a járófelület
 const g=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.4,10),new THREE.MeshBasicMaterial({color:0xfde047}));g.position.set(t.x,t.h+.28,t.z);MO(g);
 beam=MO(new THREE.Mesh(new THREE.ConeGeometry(.9,7,16,1,true),new THREE.MeshBasicMaterial({color:0xfef9c3,transparent:true,opacity:.18,side:THREE.DoubleSide,depthWrite:false})));
 beam.geometry.translate(0,-3.5,0);beam.geometry.rotateZ(Math.PI/2);beam.position.set(t.x,t.h+.3,t.z)}
function pillar(t){const st=M(0x8b8f99,{flatShading:true}),dk=M(0x6b7280,{flatShading:true}),k=Math.max(2,Math.round(t.h/.8));
 for(let i=0;i<k;i++){const h=t.h/k,c=cyl(t.r*(.97+Math.random()*.05),t.r*(1+Math.random()*.06),h,9,i%2?st:dk,t.x,h*i+h/2,t.z);c.rotation.y=Math.random()*3}
 cyl(t.r*1.03,t.r*1.03,.07,9,M(0x4d7c0f,{flatShading:true}),t.x,t.h+.035,t.z)}
function pier(t){const wd=M(0x92400e),lt=M(0xb45309);
 for(let i=-2;i<=2;i++){const w=Math.sqrt(Math.max(.1,t.r*t.r-(i*t.r*.38)**2))*2;box(w,.1,t.r*.34,i%2?wd:lt,t.x,t.h-.05,t.z+i*t.r*.38)}
 for(const a of [.8,2.4,3.9,5.5])cyl(.09,.11,t.h+.6,8,wd,t.x+Math.cos(a)*t.r*.85,(t.h+.6)/2-.3,t.z+Math.sin(a)*t.r*.85)}
function floaters(){const W=I().W,ring=M(0xf97316),wh=M(0xffffff),wd=M(0x78350f);
 for(let i=0;i<9;i++){const a=i/9*6.28+.3,r=4+Math.random()*(W.R-3),o=new THREE.Group();
  if(i%3===0){for(let j=0;j<4;j++){const s=new THREE.Mesh(new THREE.TorusGeometry(.32,.1,6,10,Math.PI/2),j%2?ring:wh);s.rotation.z=j*Math.PI/2;o.add(s)}o.rotation.x=-Math.PI/2}
  else{const b=new THREE.Mesh(new THREE.BoxGeometry(.9,.12,.3),wd);o.add(b);if(i%3===2){const c=new THREE.Mesh(new THREE.BoxGeometry(.35,.35,.35),M(0xa16207));c.position.y=.2;o.add(c)}}
  o.position.set(Math.cos(a)*r,-.55,Math.sin(a)*r);MO(o);bob.push({o,ph:Math.random()*6,a,r,sp:(Math.random()-.5)*.08,ry:Math.random()*3})}}
function mkHud(){if(hud)return;const top=document.getElementById('kpTop');if(!top)return;hud=document.createElement('div');hud.className='pl';hud.id='kpVizH';
 hud.style.cssText='top:52px;left:50%;transform:translateX(-50%);font:700 13px system-ui;text-align:center;min-width:220px';top.parentNode.appendChild(hud);
 setInterval(()=>{if(hud&&I()&&I().MD()!=='viz')hud.style.display='none'},500)}
window._kpMode.viz={
 round(W,SC){deco=[];bob=[];beam=null;flooded.clear();st.clear();warned=0;wasLive=false;
  W.modeObj.forEach(o=>o.visible=false);// a mag tornyai: fizika marad, látvány a miénk
  for(const t of I().TOW)(t.h>=4?lighthouse:t.h<=1?pier:pillar)(t);
  floaters();mkHud();W.P.forEach(p=>st.set(p,{top:0,surv:0}))},
 tick(dt,T,W){const K=I(),wl=W.wl||0,wy=wl-.6;
  if(beam)beam.rotation.y+=dt*1.2;
  for(const b of bob){b.a+=b.sp*dt;b.o.position.set(Math.cos(b.a)*b.r,wy+.05+Math.sin(T*2+b.ph)*.06,Math.sin(b.a)*b.r);b.o.rotation.y=b.ry+Math.sin(T+b.ph)*.3}
  if(W.live){
   if(W.t>5&&W.t<8&&warned<1){warned=1;K.banner('🌊 JÖN A VÍZ!',1,48);K.tone(300,180,.5,.15,'sawtooth')}
   if(W.t>8&&wl<3.6&&(sndT-=dt)<0){sndT=2.2;K.noise(1.2,300,900,1.5,.05,'lowpass')}
   for(const t of K.TOW)if(!flooded.has(t)&&wl>t.h){flooded.add(t);K.splash(t.x,t.z);K.SND.splash&&K.SND.splash();K.feed(`🌊 Elárasztva egy ${t.h<=1?'stég':t.h>=4?'világítótorony':'kőoszlop'}!`);K.shake=Math.max(K.shake||0,.25)}
   W.P.forEach(p=>{const s=st.get(p);if(!s||!p.alive)return;s.surv+=dt;s.top=Math.max(s.top,p.y)});
  }
  if(wasLive&&!W.live){let c=null,v=null;st.forEach((s,p)=>{if(!c||s.top>st.get(c).top)c=p;if(!v||s.surv>st.get(v).surv)v=p});
   if(c)K.feed(`🧗 Legmagasabbra jutott: <b>${c.name}</b> (${st.get(c).top.toFixed(1)} m)`);if(v)K.feed(`⏱️ Legtovább bírta: <b>${v.name}</b> (${st.get(v).surv.toFixed(0)} mp)`)}
  wasLive=W.live},
 hud(W){if(!hud)return;hud.style.display='';const wl=W.wl||0,me=W.me;let h;
  if(W.t<8)h=`🌊 Víz emelkedik: <b>${Math.max(0,8-W.t).toFixed(1)} mp</b> múlva`;
  else{const gap=me&&me.alive?me.y-wl:0,col=gap<.6?'#f87171':gap<1.4?'#fbbf24':'#86efac';
   h=`🌊 Vízszint <b>${wl.toFixed(2)} m</b> / 3.60 · ${me&&me.alive?`<span style="color:${col}">alattad ${gap.toFixed(1)} m</span>`:'—'}<div style="height:5px;background:#0f172a;border-radius:3px;margin-top:4px"><div style="height:100%;width:${(wl/3.6*100).toFixed(0)}%;background:#38bdf8;border-radius:3px"></div></div>`}
  hud.innerHTML=h}
};})();
