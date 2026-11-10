// Sziget Aréna – 'domb' mód: 3D dobogó, korona a király felett, fénycsóva, következő hely előnézet, vita-szikrák, HUD.
(function(){window._kpMode=window._kpMode||{};
const I=()=>window._kpI,T3=()=>window.THREE;let D=null;
function mk(W,SC){const THREE=T3(),z=W.zone;if(!z)return;
 const add=o=>{SC.add(o);(W.modeObj=W.modeObj||[]).push(o);return o};
 const gold=new THREE.MeshStandardMaterial({color:0xfacc15,metalness:.8,roughness:.3,emissive:0x7a5a00,emissiveIntensity:.4});
 // alacsony dobogó (0.12 m – a fizika nem tud a magasságról, ezért marad lapos)
 const hill=add(new THREE.Group());
 const base=new THREE.Mesh(new THREE.CylinderGeometry(z.r,z.r+.25,.08,40),new THREE.MeshStandardMaterial({color:0x6b4f2a,roughness:.9}));base.position.y=.04;hill.add(base);
 const top=new THREE.Mesh(new THREE.CylinderGeometry(z.r*.6,z.r,.05,40),new THREE.MeshStandardMaterial({color:0x4ade80,roughness:.8}));top.position.y=.105;hill.add(top);
 for(let i=0;i<8;i++){const a=i/8*6.28,post=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.6,6),gold);post.position.set(Math.cos(a)*(z.r+.15),.3,Math.sin(a)*(z.r+.15));hill.add(post);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(.25,.16),new THREE.MeshBasicMaterial({color:i%2?0xef4444:0xffffff,side:THREE.DoubleSide}));fl.position.set(.13,.22,0);post.add(fl)}
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(z.r*.9,z.r,9,32,1,true),new THREE.MeshBasicMaterial({color:0xfde047,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));beam.position.y=4.5;hill.add(beam);
 // korona
 const crown=add(new THREE.Group());const band=new THREE.Mesh(new THREE.CylinderGeometry(.28,.25,.16,16,1,true),gold);band.material.side=THREE.DoubleSide;crown.add(band);
 for(let i=0;i<5;i++){const a=i/5*6.28,sp=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,6),gold);sp.position.set(Math.cos(a)*.26,.17,Math.sin(a)*.26);crown.add(sp);
  const gem=new THREE.Mesh(new THREE.SphereGeometry(.04,8,6),new THREE.MeshBasicMaterial({color:[0xef4444,0x3b82f6,0x22c55e,0xa855f7,0xf97316][i]}));gem.position.set(Math.cos(a)*.28,0,Math.sin(a)*.28);crown.add(gem)}
 crown.visible=false;
 // következő hely: szellemkör + nyíl
 const ghost=add(new THREE.Mesh(new THREE.RingGeometry(z.r-.15,z.r,40),new THREE.MeshBasicMaterial({color:0x60a5fa,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false})));ghost.rotation.x=-Math.PI/2;ghost.position.y=.03;
 const arrow=add(new THREE.Mesh(new THREE.ConeGeometry(.3,.9,4),new THREE.MeshBasicMaterial({color:0x60a5fa,transparent:true,opacity:0})));
 let hud=document.getElementById('kpDomb');if(!hud){hud=document.createElement('div');hud.id='kpDomb';hud.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:99999;pointer-events:none;font:700 14px system-ui;color:#fff;text-align:center;text-shadow:0 1px 3px #000;min-width:260px';(document.getElementById('kpw')||document.body).appendChild(hud)}
 hud.style.display='';
 D={hill,crown,ghost,arrow,beam,hud,king:null,lastT:z.t,nx:0,nz:0,spark:0,beep:3,reign:{},best:{n:'',t:0},cur:0,W};pick(W)}
function pick(W){const a=Math.random()*6.28,r=W.R*(.15+Math.random()*.3);D.nx=Math.cos(a)*r;D.nz=Math.sin(a)*r}
window._kpMode.domb={
 round(W,SC){D=null;mk(W,SC)},
 tick(dt,T,W){const z=W.zone,K=I();if(!z||!D||D.W!==W)return;
  if(z.t>D.lastT+1){z.x=D.nx;z.z=D.nz;pick(W);K.tone(400,900,.25,.15,'triangle');K.burst(z.x,.5,z.z,0x60a5fa,20,4);D.beep=3}// alap kód épp áthelyezte: a megjósolt helyre tesszük
  D.lastT=z.t;
  D.hill.position.set(z.x,0,z.z);z.m.position.y=.13;
  D.beam.material.opacity=.08+Math.sin(T*3)*.04;
  const inn=W.P.filter(p=>p.alive&&Math.hypot(p.x-z.x,p.z-z.z)<z.r&&p.y<1),k=inn.length===1?inn[0]:null;
  if(k!==D.king){if(D.king){const n=D.king.name;if((D.cur||0)>D.best.t)D.best={n,t:D.cur}}D.cur=0;
   if(k){K.tone(520,780,.18,.12,'square');if(k===W.me)K.feed('👑 Te vagy a domb királya!');}D.king=k}
  if(k){D.cur+=dt;D.reign[k.name]=(D.reign[k.name]||0)+dt;D.crown.visible=true;D.crown.position.set(k.x,(k.y||0)+1.95+Math.sin(T*4)*.08,k.z);D.crown.rotation.y+=dt*2;
   if(15-(k.sc||0)<3&&Math.floor((k.sc||0)*2)!==D.lt){D.lt=Math.floor((k.sc||0)*2);K.tone(880,880,.06,.08,'sine')}}else D.crown.visible=false;
  if(inn.length>1&&(D.spark-=dt)<0){D.spark=.15;const p=inn[Math.random()*inn.length|0];K.burst(p.x,.8,p.z,0xef4444,4,3);if(Math.random()<.2)K.noise(.08,2000,800,4,.05)}
  // előnézet az utolsó 4 mp-ben
  const pv=z.t<4?1-z.t/4:0;D.ghost.material.opacity=pv*.7;D.ghost.position.set(D.nx,.03,D.nz);D.ghost.scale.setScalar(1+Math.sin(T*8)*.04);
  D.arrow.material.opacity=pv;const dx=D.nx-z.x,dz=D.nz-z.z;D.arrow.position.set(z.x+dx*.5,1.2+Math.sin(T*6)*.15,z.z+dz*.5);D.arrow.rotation.set(0,0,0);D.arrow.rotation.z=-Math.PI/2;D.arrow.rotation.y=-Math.atan2(dz,dx);
  if(z.t<D.beep&&D.beep>0){K.tone(600,600,.08,.08,'sine');D.beep--}
  // botok: ha a zóna mindjárt odébb megy, előre indulnak az új helyre
  if(z.t<1.5)W.P.forEach(p=>{if(p!==W.me&&p.alive&&Math.random()<dt*2){p.x+=Math.sign(D.nx-p.x)*dt*.8;p.z+=Math.sign(D.nz-p.z)*dt*.8}})},
 hud(W){if(!D||!W.zone)return;const z=W.zone,inn=W.P.filter(p=>p.alive&&Math.hypot(p.x-z.x,p.z-z.z)<z.r&&p.y<1);
  const st=inn.length>1?'<span style="color:#f87171">⚔️ VITATOTT – senki nem kap pontot</span>':inn.length?`<span style="color:#fde047">👑 ${inn[0].name}</span>`:'<span style="color:#cbd5e1">Üres domb</span>';
  const bars=[...W.P].sort((a,b)=>(b.sc||0)-(a.sc||0)).slice(0,4).map(p=>`<div style="display:flex;gap:6px;align-items:center;margin:2px 0"><span style="width:70px;text-align:right;font-size:12px">${p.name}</span><div style="flex:1;height:8px;background:#0006;border-radius:4px;overflow:hidden"><div style="width:${Math.min(100,(p.sc||0)/15*100)}%;height:100%;background:#${new (T3().Color)(p.col).getHexString()}"></div></div></div>`).join('');
  const bs=D.cur>D.best.t&&D.king?{n:D.king.name,t:D.cur}:D.best;
  D.hud.innerHTML=`${st} · 🔄 ${Math.max(0,z.t).toFixed(0)} mp${bars}<div style="font-size:11px;opacity:.8">Leghosszabb uralom: ${bs.n||'–'} ${bs.t.toFixed(1)} mp</div>`;
  D.hud.style.display=W.live?'':'none'}};
// más módban rejtsük a HUD-ot
setInterval(()=>{const h=document.getElementById('kpDomb'),K=I();if(h&&K&&(K.ST.mode!=='domb'||!K.W||!K.W.live))h.style.display='none'},500);
})();
