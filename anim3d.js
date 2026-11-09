// ===== 🎞️ 3D ANIMÁCIÓK (anim3d.js) =====
// Meccs: saját karakter + ellenfelek végtag-animációja (futás-lengés, dőlés, ugrás-guggolás, landolás),
// kiesés-animáció (ragdoll-szerű eldőlés + süllyedés), láda-nyitás fénycsóva (pool), győzelmi kamera-körbeforgás.
// Lobby: tétlen légzés/nézelődés/óranézés, kutya fejbillentés + ugrándozás.
// Ki/be: localStorage k3anim3d ('0' = KI), Grafika panelben kapcsoló, chat nélkül: _a3d.set(false). Debug: window._a3d
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
let ON=true;try{ON=localStorage.getItem('k3anim3d')!=='0'}catch(e){}
const A={get on(){return ON},set(v){ON=!!v;try{localStorage.setItem('k3anim3d',ON?'1':'0')}catch(e){}if(!ON)resetAll();syncBtn()},stats:{dying:0,beams:0,orbit:0,chars:0}};
window._a3d=A;
const lerp=(a,b,k)=>a+(b-a)*k;
function limbs(m){if(!m)return null;const u=m.userData;if(u._a3L!==undefined)return u._a3L;const o={};let n=0;m.traverse(c=>{if(c.userData&&c.userData.limb&&!o[c.userData.limb]){o[c.userData.limb]=c;n++}});
 // a belső csoport (a végtagok szülője) – ezt döntjük/nyomjuk össze, így a játék által írt m.position/rotation érintetlen
 const inner=n?(o.lleg||o.larm).parent:null;u._a3L=n?{l:o,in:inner!==m?inner:null,ph:Math.random()*6,sw:0,lean:0,sq:1,lt:0,lx:null,lz:null,air:0}:null;return u._a3L}

// ---------- karakter-póz (futás / ugrás / landolás) ----------
function charStep(m,st,dt,x,y,z,vy,grounded){const L=st.l;let sp=0;if(st.lx!==null){sp=Math.hypot(x-st.lx,z-st.lz)/Math.max(dt,1e-3);if(sp>40)sp=0}st.lx=x;st.lz=z;
 st.sw=lerp(st.sw,Math.min(1,sp/7),Math.min(1,dt*8));st.ph+=dt*(4+sp*1.1);
 const s=Math.sin(st.ph),k=st.sw;let ll=s*.8*k,rl=-s*.8*k,la=-s*.65*k,ra=s*.65*k,lz=0,rz=0;
 if(!grounded){st.air+=dt;const t=vy>0?-.9:-.35;ll=lerp(ll,t,.8);rl=lerp(rl,t*.4,.8);la=-2.4+Math.sin(st.air*9)*.25;ra=-2.4-Math.sin(st.air*9)*.25;lz=.35;rz=.35}
 else{if(st.air>.35)st.sq=.72;st.air=0}
 st.sq=lerp(st.sq,1,Math.min(1,dt*7));
 const idle=(1-k)*(grounded?1:0),br=Math.sin(performance.now()*.002+st.ph*.1)*.04*idle;
 const f=Math.min(1,dt*14);
 if(L.lleg)L.lleg.rotation.x=lerp(L.lleg.rotation.x,ll,f);if(L.rleg)L.rleg.rotation.x=lerp(L.rleg.rotation.x,rl,f);
 if(L.larm){L.larm.rotation.x=lerp(L.larm.rotation.x,la+br,f);L.larm.rotation.z=lerp(L.larm.rotation.z,-lz-br*.5,f)}
 if(L.rarm){L.rarm.rotation.x=lerp(L.rarm.rotation.x,ra+br,f);L.rarm.rotation.z=lerp(L.rarm.rotation.z,rz+br*.5,f)}
 if(st.in){st.lean=lerp(st.lean,k*.18*(grounded?1:.3),f);st.in.rotation.x=st.lean;st.in.scale.y=st.sq*(1+br*.5);st.in.scale.x=st.in.scale.z=1+(1-st.sq)*.5;st.in.position.y=grounded?Math.abs(s)*.06*k:0}}
function resetChar(m){const st=m&&m.userData._a3L;if(!st)return;['lleg','rleg','larm','rarm'].forEach(n=>{const c=st.l[n];if(c){c.rotation.x=0;c.rotation.z=0}});if(st.in){st.in.rotation.x=0;st.in.scale.set(1,1,1);st.in.position.y=0}}

// ---------- kiesés-animáció ----------
const DY=[];// {m,t,dir,side,x,y,z,ry}
function startDeath(e){if(!e||!e.m||e.m.userData._a3D)return;if(DY.length>14){const o=DY.shift();finishDeath(o)}const g=G;e.m.userData._a3D=1;
 const dx=e.x-(g?g.x:0),dz=e.z-(g?g.z:0);DY.push({m:e.m,t:0,ry:e.m.rotation.y,x:e.x,z:e.z,y:e.m.position.y,sd:Math.random()<.5?-1:1,away:Math.atan2(dx,dz)});A.stats.dying=DY.length}
function finishDeath(d){try{if(d.m.parent)d.m.parent.remove(d.m);resetChar(d.m);d.m.rotation.set(0,d.ry,0);d.m.scale.set(1,1,1)}catch(e){}}
function deathStep(dt){for(let i=DY.length-1;i>=0;i--){const d=DY[i],m=d.m;d.t+=dt;const t=d.t;
 if(!m.parent&&t<1.8&&typeof scene!=='undefined')scene.add(m);// a játék kiveszi a jelenetből – visszatesszük a dőlés idejére
 const st=limbs(m);const fall=Math.min(1,t/.55),e=1-Math.pow(1-fall,3),b=fall>=1?Math.sin(Math.min(1,(t-.55)/.25)*Math.PI)*.09:0;
 m.position.set(d.x,d.y-(t>1.1?(t-1.1)*1.6:0),d.z);
 m.rotation.set(0,0,0);m.rotation.y=d.away;m.rotateX((e*1.5-b));m.rotateZ(d.sd*e*.25);
 if(st){const L=st.l;const fl=Math.sin(t*14)*Math.max(0,.6-t)*.8;if(L.larm){L.larm.rotation.x=-2.2*e+fl;L.larm.rotation.z=-.8*e}if(L.rarm){L.rarm.rotation.x=-2.0*e-fl;L.rarm.rotation.z=.9*e}if(L.lleg)L.lleg.rotation.x=.4*e;if(L.rleg)L.rleg.rotation.x=-.2*e}
 if(t>1.1){const s=Math.max(.01,1-(t-1.1)/.7);m.scale.set(1,s,1)}
 if(t>=1.8){finishDeath(d);DY.splice(i,1)}}A.stats.dying=DY.length}

// ---------- láda fénycsóva (pool, megosztott anyag/geometria) ----------
let BP=null;const BEAMS=[];
function beamPool(){if(BP)return BP;const cyl=new THREE.CylinderBufferGeometry(.35,.9,14,12,1,true);cyl.translate(0,7,0);const ring=new THREE.RingBufferGeometry(.6,1.1,24);ring.rotateX(-Math.PI/2);
 const sp=new THREE.SphereBufferGeometry(.09,5,4);BP=[];for(let i=0;i<4;i++){const gr=new THREE.Group();const mb=new THREE.MeshBasicMaterial({color:0xffd75a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 const mr=mb.clone();const ms=mb.clone();const c=new THREE.Mesh(cyl,mb),r=new THREE.Mesh(ring,mr);r.position.y=.05;gr.add(c,r);const sparks=[];for(let j=0;j<10;j++){const s=new THREE.Mesh(sp,ms);s.userData.a=j/10*Math.PI*2;s.userData.v=2+Math.random()*3;gr.add(s);sparks.push(s)}
 gr.visible=false;gr.userData={c,r,mb,mr,ms,sparks,t:-1};BP.push(gr)}return BP}
const RCOL=[0xd8dee9,0x4ade80,0x60a5fa,0xc084fc,0xffd23f,0xff7a1a];
function beam(x,y,z,col){const P=beamPool();const b=P.find(p=>p.userData.t<0)||P[0];const u=b.userData;u.t=0;b.position.set(x,y,z);[u.mb,u.mr,u.ms].forEach(m=>m.color.setHex(col||0xffd75a));if(b.parent!==scene)scene.add(b);b.visible=true;A.stats.beams++}
function beamStep(dt){if(!BP)return;BP.forEach(b=>{const u=b.userData;if(u.t<0)return;u.t+=dt;const t=u.t,T=2.4;if(t>=T||!G){u.t=-1;b.visible=false;if(b.parent)b.parent.remove(b);return}
 const a=t<.25?t/.25:Math.max(0,1-(t-.25)/(T-.25));u.mb.opacity=a*.55;u.mr.opacity=a*.8;u.ms.opacity=a;u.c.scale.set(1+Math.sin(t*12)*.05,Math.min(1,t*4),1+Math.sin(t*12)*.05);u.c.rotation.y+=dt*2;
 const rs=1+t*2.5;u.r.scale.set(rs,1,rs);u.sparks.forEach(s=>{const q=s.userData;const h=(t*q.v)%5;s.position.set(Math.cos(q.a+t*3)*(.5+h*.15),h+.3,Math.sin(q.a+t*3)*(.5+h*.15))})})}
function chestScan(){if(!window._LOOT)return;let L;try{L=_LOOT()}catch(e){return}if(!L)return;for(let i=0;i<L.length;i++){const c=L[i];if(c&&c.t==='chest'&&c.open&&!c._a3b){c._a3b=1;const p=c.m&&c.m.position;beam(p?p.x:c.x,p?p.y:0,p?p.z:c.z,c.sup?0x60a5fa:0xffd75a)}}}

// ---------- győzelmi kamera ----------
let ORB=null;
function orbitStart(){const g=G;if(!g||typeof cam==='undefined'||typeof ren==='undefined'||typeof scene==='undefined')return;const c=cam;ORB={g,t:0,r0:Math.hypot(c.position.x-g.x,c.position.z-g.z)||8,a0:Math.atan2(c.position.x-g.x,c.position.z-g.z),y0:c.position.y,last:performance.now(),pos:c.position.clone(),q:c.quaternion.clone()};A.stats.orbit++;
 const st=g.pm&&limbs(g.pm);requestAnimationFrame(orbitLoop)}
function orbitLoop(now){const o=ORB;if(!o)return;if(run||G!==o.g||!ON){ORB=null;return}const dt=Math.min(.1,(now-o.last)/1000);o.last=now;o.t+=dt;const t=o.t,g=o.g;
 const e=Math.min(1,t/1.2),ee=e*e*(3-2*e),R=lerp(o.r0,7,ee),a=o.a0+t*.6,ty=g.y+1.6;
 cam.position.set(g.x+Math.sin(a)*R,lerp(o.y0,g.y+3.2,ee)+Math.sin(t*.8)*.4,g.z+Math.cos(a)*R);cam.lookAt(g.x,ty,g.z);
 if(g.gun&&g.gun.visible){g.gun.visible=false;o.gun=g.gun}if(g.pm){g.pm.visible=true;const st=limbs(g.pm);if(st){const L=st.l,w=Math.sin(t*9);if(L.rarm){L.rarm.rotation.x=-2.8;L.rarm.rotation.z=-.3+w*.35}if(L.larm){L.larm.rotation.x=-2.8;L.larm.rotation.z=.3-w*.35}if(st.in)st.in.position.y=Math.abs(Math.sin(t*5))*.35}}
 try{ren.render(scene,cam)}catch(err){ORB=null;return}
 if(t<9)requestAnimationFrame(orbitLoop);else{ORB=null;if(o.gun)o.gun.visible=true}}

// ---------- meccs-hurok ----------
let lastPm=null;
function matchStep(dt){const g=G;if(!g||!ON)return;
 if(g.pm&&g.pm.visible!==false){const st=limbs(g.pm);if(st){const gh=window.floorH?floorH(g):0;charStep(g.pm,st,dt,g.x,g.y,g.z,g.vy||0,!(g.y>gh+.05||g.vy>0));lastPm=g.pm}}
 let n=0;const en=g.en||[];for(let i=0;i<en.length;i++){const e=en[i];if(!e||e.dead||!e.m||e.m.userData._a3D)continue;const dx=e.x-g.x,dz=e.z-g.z;if(dx*dx+dz*dz>3600)continue;const st=limbs(e.m);if(!st)continue;charStep(e.m,st,dt,e.x,0,e.z,0,true);n++}
 A.stats.chars=n;deathStep(dt);beamStep(dt);if(((g.t*10)|0)%3===0)chestScan()}
function resetAll(){DY.splice(0).forEach(finishDeath);if(BP)BP.forEach(b=>{b.userData.t=-1;b.visible=false;if(b.parent)b.parent.remove(b)});if(lastPm)resetChar(lastPm);try{(G&&G.en||[]).forEach(e=>e.m&&resetChar(e.m))}catch(e){}ORB=null}

WP('update',null,a=>{try{matchStep(Math.min(.05,a[0]||0))}catch(e){console.error('anim3d',e)}});
WP('kill',a=>{if(ON)try{startDeath(a[0])}catch(e){}});
WP('end',a=>{if(ON&&a[0])setTimeout(()=>{if(!run)orbitStart()},60)});
WP('launch',()=>{DY.splice(0).forEach(finishDeath);ORB=null});

// ---------- lobby: tétlen + kutya ----------
const LS={off:{la:0,ra:0,laz:0,raz:0,dy:0,dr:0},watch:0,next:8,look:0,hop:0,hopNext:5};let hooked=null,lastT=0;
function lobbyFx(t){const L=window.LB3D;if(!L)return;const dt=Math.min(.05,Math.max(0,t-lastT||0));lastT=t;const o=LS.off;
 const me=L.me,st=me&&limbs(me);
 if(st){const l=st.l;// előző eltolás le
  if(l.larm){l.larm.rotation.x-=o.la;l.larm.rotation.z-=o.laz}if(l.rarm){l.rarm.rotation.x-=o.ra;l.rarm.rotation.z-=o.raz}
  o.la=o.ra=o.laz=o.raz=0;
  const busy=me.userData._x13cDance||(l.rarm&&Math.abs(l.rarm.rotation.x)>.5)||(l.larm&&Math.abs(l.larm.rotation.x)>.5);
  if(ON&&!busy){const br=Math.sin(t*1.9);o.laz=.05+br*.03;o.raz=-.05-br*.03;
   LS.next-=dt;if(false&&LS.next<=0&&!LS.watch){LS.watch=2.6;LS.next=10+Math.random()*8}
   if(LS.watch>0){LS.watch=Math.max(0,LS.watch-dt);const w=Math.sin(Math.min(1,(2.6-LS.watch)/.4,LS.watch/.4)*Math.PI/2);o.la=-1.35*w;o.laz=.9*w}// órára néz (kikapcsolva: bal kéz akadt)
   if(st.in)st.in.scale.y=1+br*.012}
  if(l.larm){l.larm.rotation.x+=o.la;l.larm.rotation.z+=o.laz}if(l.rarm){l.rarm.rotation.x+=o.ra;l.rarm.rotation.z+=o.raz}}
 const d=L.dog;if(d){d.rotation.y-=o.dr;o.dr=0;if(ON){o.dr=Math.sin(t*.7)*.25+Math.sin(t*2.3)*.06;LS.hopNext-=dt;if(LS.hopNext<=0&&LS.hop<=0){LS.hop=.9;LS.hopNext=6+Math.random()*6}
  if(LS.hop>0){LS.hop-=dt;d.position.y+=Math.max(0,Math.sin((.9-LS.hop)/.45*Math.PI))*.35;o.dr+=Math.sin((.9-LS.hop)*7)*.4}}d.rotation.y+=o.dr}}
setInterval(()=>{const L=window.LB3D;if(L&&L.fx&&hooked!==L){hooked=L;L.fx.push(t=>{try{lobbyFx(t)}catch(e){}})}},1000);

// ---------- kapcsoló a Grafika panelben (#x14g…) + localStorage ----------
function syncBtn(){const b=document.getElementById('a3dTg');if(b)b.textContent='🎞️ 3D animációk: '+(ON?'BE':'KI')}
setInterval(()=>{if(document.getElementById('a3dTg'))return;const gui=document.getElementById('gui');if(!gui||!gui.classList.contains('on'))return;if(!/GRAFIKA/i.test(gui.textContent||''))return;
 const box=gui.querySelector('.gb,.box,div')||gui;const b=document.createElement('button');b.id='a3dTg';b.className='b';b.style.cssText='margin:8px auto;display:block;padding:8px 16px';b.onclick=()=>A.set(!ON);box.appendChild(b);syncBtn()},700);
A.beam=(c)=>{const g=G;if(g)beam(g.x+2,g.y,g.z,c)};A.die=()=>{const e=G&&G.en&&G.en.find(e=>!e.dead);if(e){e.hp=0}return e};A.orbit=orbitStart;A.DY=DY;
})();
