// Sziget Aréna – 'szappan' mód: 3D ring (kötelek, oszlopok, habos padló), szappanfoltok, hab-mérő + SZUPER LÖKÉS, kötél-visszapattanás, bot-taktika, HUD, statisztika.
(function(){
window._kpMode=window._kpMode||{};
const I=()=>window._kpI;let OBJ=[],SL=[],BUB=[],hud=null,st=null;
function add(o){I().SC.add(o);OBJ.push(o);return o}
function clean(){const SC=I().SC;OBJ.forEach(o=>{SC.remove(o);o.traverse(c=>{if(c.geometry)c.geometry.dispose();if(c.material)c.material.dispose()})});OBJ=[];SL=[];BUB=[];if(hud)hud.style.display='none'}
function slick(R){const m=add(new THREE.Mesh(new THREE.CircleGeometry(.9+Math.random()*.6,20),new THREE.MeshBasicMaterial({color:0xe0f2fe,transparent:true,opacity:.6,depthWrite:false})));m.rotation.x=-Math.PI/2;const a=Math.random()*6.28,r=Math.random()*R*.7;m.position.set(Math.cos(a)*r,.04,Math.sin(a)*r);SL.push({m,r:m.geometry.parameters.radius,t:10+Math.random()*6});}
function round(W){clean();const R=W.R;
 const ring=add(new THREE.Group());ring.userData.ring=1;
 const fl=new THREE.Mesh(new THREE.CircleGeometry(1,48),new THREE.MeshPhongMaterial({color:0xbfe9ff,transparent:true,opacity:.35,shininess:120,depthWrite:false}));fl.rotation.x=-Math.PI/2;fl.position.y=.03;ring.add(fl);
 const pm=new THREE.MeshPhongMaterial({color:0xf472b6,shininess:80});
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2,po=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,1.4,8),pm);po.position.set(Math.cos(a)*.96,.7,Math.sin(a)*.96);po.scale.set(1/R,1,1/R);po.userData.post=1;ring.add(po)}
 [0.45,0.8,1.15].forEach((h,k)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.96,.012,6,64),new THREE.MeshPhongMaterial({color:[0xffffff,0x38bdf8,0xffffff][k]}));t.rotation.x=Math.PI/2;t.position.y=h;t.userData.rope=1;ring.add(t)});
 W._szR=ring;for(let i=0;i<5;i++)slick(R);
 for(let i=0;i<14;i++){const b=add(new THREE.Mesh(new THREE.SphereGeometry(.12+Math.random()*.18,10,8),new THREE.MeshPhongMaterial({color:0xe0f7ff,transparent:true,opacity:.45,shininess:150})));BUB.push({m:b,a:Math.random()*6.28,r:R*(1.1+Math.random()*.5),h:1+Math.random()*3,s:.2+Math.random()*.4})}
 W.P.forEach(p=>{p.foam=0;p._h=p.hits||0;p.ropeT=0;p.bash=p.bash||0;p.sup=p.sup||0});
 st=st&&st.W===W?st:{W,best:0};
 if(!hud){hud=document.createElement('div');hud.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:99999;font:700 14px system-ui;color:#fff;text-shadow:0 1px 3px #000;text-align:center;pointer-events:none';(document.getElementById('kpw')||document.body).appendChild(hud)}
 hud.style.display='';I().feed('🧼 Szappanfoltokon gyorsabban csúszol · 3 lökés = <b>SZUPER LÖKÉS</b> · a kötél egyszer visszadob, ha csak megcsúsztál')}
function tick(dt,T,W){const K=I();if(!W._szR)return;const R=W.R;
 W._szR.scale.set(R,1,R);W._szR.children.forEach(c=>{if(c.userData.post)c.scale.set(1/R,1,1/R);if(c.userData.rope)c.material.color.setHex(R<W.Rbase&&c.position.y===.8?(Math.sin(T*6)>0?0xef4444:0x38bdf8):c.position.y===.8?0x38bdf8:0xffffff)});
 BUB.forEach(b=>{b.a+=dt*b.s;b.m.position.set(Math.cos(b.a)*b.r,b.h+Math.sin(T*b.s*3+b.a)*.4,Math.sin(b.a)*b.r)});
 for(let i=SL.length-1;i>=0;i--){const s=SL[i];s.t-=dt;s.m.material.opacity=Math.min(.6,s.t*.3);if(s.t<=0||Math.hypot(s.m.position.x,s.m.position.z)>R){K.SC.remove(s.m);s.m.geometry.dispose();s.m.material.dispose();OBJ.splice(OBJ.indexOf(s.m),1);SL.splice(i,1)}}
 if(SL.length<5&&Math.random()<dt*.5)slick(R);
 if(!W.live)return;
 for(const p of W.P){if(!p.alive)continue;
  if((p.hits||0)>p._h){p.bash+=p.hits-p._h;p._h=p.hits;p.foam=Math.min(3,p.foam+1);if(p.foam===3&&p===W.me){K.banner('🫧 SZUPER LÖKÉS KÉSZ!',1,36);K.tone(600,1200,.25,.15,'triangle')}else K.tone(300,180,.1,.12,'square')}
  const sp=Math.hypot(p.vx,p.vz);
  if(p.ground!==false&&p.y<.3)for(const s of SL)if(Math.hypot(p.x-s.m.position.x,p.z-s.m.position.z)<s.r&&sp>1&&sp<11){p.vx*=1+dt*1.6;p.vz*=1+dt*1.6;if(Math.random()<dt*10)K.burst(p.x,.15,p.z,0xffffff,1,1.5);break}
  if(sp>5&&Math.random()<dt*6)K.burst(p.x,.2,p.z,0xe0f7ff,1,1);
  // szuper lökés: teli hab + dash közben nagyobb hatótáv és erő
  if(p.foam>=3&&p.dashT>0)for(const q of W.P){if(q===p||!q.alive||q.inv>0)continue;const dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz);if(d<1.4&&d>.001){q.pct=Math.min(300,q.pct+18);const kb=12+q.pct*.08;q.vx=dx/d*kb;q.vz=dz/d*kb;q.vy=4;q.ground=false;q.stun=.6;q.lastHit=p;q.lastHitT=4;q.inv=.3;p.dashT=0;p.foam=0;p.sup++;K.setPctLabel(q);K.burst(q.x,q.y+1,q.z,0xbfe9ff,40,8);K.noise(.4,2000,300,1,.3);K.tone(200,60,.35,.3,'sawtooth');if(p===W.me||q===W.me)K.shake=.4;K.feed(`🫧 <b>${p.name}</b> SZUPER LÖKÉS → <b>${q.name}</b>`);break}}
  // kötél: önhibás megcsúszásnál egyszer visszadob körönként
  p.ropeT-=dt;const r=Math.hypot(p.x,p.z),out=(p.vx*p.x+p.vz*p.z)/(r||1);
  if(r>R*.9&&out>2&&!(p.lastHitT>0)&&p.ropeT<=0&&!p.ropeUsed){p.vx-=p.x/r*out*1.7;p.vz-=p.z/r*out*1.7;p.ropeT=1;p.ropeUsed=1;K.tone(140,320,.2,.2,'triangle');K.burst(p.x,.8,p.z,0xffffff,10,3);if(p===W.me)K.banner('🪢 A kötél megmentett!',.8,30)}
  // bot: szélről vissza középre, teli habbal célzottan
  if(p.bot&&r>R*.82&&p.dashT<=0)p.vx-=p.x/r*dt*6,p.vz-=p.z/r*dt*6;
  if(p.bot&&p.foam>=3&&p.dashCd<=0&&Math.random()<dt*2){const t=W.P.find(q=>q!==p&&q.alive&&Math.hypot(q.x-p.x,q.z-p.z)<2.6);if(t){p.face=Math.atan2(t.x-p.x,t.z-p.z);const ai=p.ai;if(ai){ai.mx=t.x-p.x;ai.mz=t.z-p.z}K.dash(p)}}
 }
 const me=W.me,top=W.P.reduce((a,b)=>(b.bash||0)>(a.bash||0)?b:a);
 st.best=Math.max(st.best,me.bash||0);
 hud.innerHTML=`🫧 Hab: ${'●'.repeat(me.foam||0)}${'○'.repeat(3-(me.foam||0))}${me.foam>=3?' <span style="color:#7dd3fc">SZUPER!</span>':''} · 🪢 kötél: ${me.ropeUsed?'✖':'✔'}<br><small>Lökéseid: ${me.bash||0} (szuper: ${me.sup||0}) · Lökőkirály: ${top.name} (${top.bash||0})</small>`}
window._kpMode.szappan={round(W){round(W);W.P.forEach(p=>p.ropeUsed=0)},tick,hud(){},cleanup:clean};
// másik módba váltáskor takarítás
setInterval(()=>{const k=window._kpI;if(OBJ.length&&k&&(!k.W||k.MD()!=='szappan'))clean()},1000);
})();
