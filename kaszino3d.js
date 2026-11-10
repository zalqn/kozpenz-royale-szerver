// kaszino3d.js – 3D nézet minden kaszinójátékhoz. CSAK MEGJELENÍTÉS: a DOM-ot olvassa, pénzhez/logikához nem nyúl.
// Egy közös WebGLRenderer, csak nyitott kaszinóablak alatt renderel. WebGL hiba esetén nincs 3D, a régi 2D marad.
// Debug: _k3d (st(), off())
(()=>{const T=window.THREE;if(!T)return;
let rs=7;const rnd=()=>(rs=rs*16807%2147483647)/2147483647; // saját PRNG: a 3D ne fogyassza a játék Math.random-ját
const css=document.createElement('style');css.textContent='.k3d3{position:relative;width:100%;height:clamp(110px,24vh,210px);margin:6px 0 8px;border-radius:14px;overflow:hidden;background:radial-gradient(ellipse at 50% 25%,#2b1c48,#07040f 75%);border:1px solid #c9a64a66;box-shadow:inset 0 0 30px #000a;flex:0 0 auto}.k3d3 canvas{display:block;width:100%!important;height:100%!important}.k3d3 b{position:absolute;right:8px;top:6px;font:700 10px system-ui;color:#facc15aa;letter-spacing:1px;pointer-events:none}@media (max-width:480px){.k3d3{height:clamp(96px,17vh,150px)}}';document.head.appendChild(css);
let R=null,dead=false,cur=null,raf=0,last=0,iv=0;const wrap=document.createElement('div');wrap.className='k3d3';wrap.innerHTML='<b>3D</b>';
function rend(){if(R||dead)return R;try{R=new T.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio||1,1.5));R.setClearColor(0,0);wrap.appendChild(R.domElement);
 R.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();dead=true;stop()})}catch(e){dead=true;R=null}return R}
const vis=e=>e&&e.isConnected&&e.getClientRects().length>0;
// ---- melyik játék látszik ----
function find(){const wh=document.getElementById('xWh');if(vis(wh))return{type:'wheel',root:wh.parentNode,before:wh};
 for(const sel of ['#x10MB','#x14dP','#csn','#x20MB.k3lot']){const r=document.querySelector(sel);if(!vis(r))continue;const q=x=>r.querySelector(x);let t=null;
  if(q('.x10reel'))t='slot';else if(q('#k3rt,#rBoard'))t='roul';else if(q('#k4crc'))t='crash';else if(q('.k4kg'))t='keno';
  else if(q('.x14dDi,[onclick*="_x14d.dN"]'))t='dice';else if(q('#x14dHC'))t='horse';
  else if(q('.x10card,.x14dC,.pcard,#k4bp,#bTable,[onclick*="bjN"],[onclick*="x10p"]'))t='cards';
  else if(q('#x14dSU'))t='scr';else if(sel==='#x20MB.k3lot')t='lotto';else if(q('.k3grid')||sel!=='#x10MB')t='deco';
  if(!t)return null;const body=sel==='#csn'?q('#csnBody'):null;return{type:t,root:r,body}}return null}
function place(f){if(wrap.isConnected&&f.root.contains(wrap))return;
 if(f.before)f.before.parentNode.insertBefore(wrap,f.before);else if(f.body)f.body.insertBefore(wrap,f.body.firstChild);
 else{const h=f.root.querySelector('h2,h1');if(h)h.parentNode.insertBefore(wrap,h.nextSibling);else f.root.insertBefore(wrap,f.root.firstChild)}}
// ---- segédek ----
function disp(o){o.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material)[].concat(m.material).forEach(x=>{for(const k in x){const v=x[k];if(v&&v.isTexture)v.dispose()}x.dispose()})})}
function ctex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;return t}
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.55,metalness:.1},o||{}));
function base(p,l){const s=new T.Scene(),c=new T.PerspectiveCamera(38,2,.1,300);c.position.set(...p);c.lookAt(...l);c.userData.l=new T.Vector3(...l);
 s.add(new T.HemisphereLight(0xfff1d0,0x24123a,.85));const d=new T.DirectionalLight(0xffffff,.75);d.position.set(3,9,6);s.add(d);return{s,c}}
function felt(s,w,d,col){const g=new T.Group();const f=new T.Mesh(new T.BoxGeometry(w,.1,d),M(col||0x0f6b3a,{roughness:.95}));g.add(f);
 const rim=M(0x5b3412,{roughness:.4});[[0,d/2],[0,-d/2]].forEach(([x,z])=>{const b=new T.Mesh(new T.BoxGeometry(w+.4,.22,.2),rim);b.position.set(x,.06,z);g.add(b)});
 [[w/2,0],[-w/2,0]].forEach(([x,z])=>{const b=new T.Mesh(new T.BoxGeometry(.2,.22,d),rim);b.position.set(x,.06,z);g.add(b)});g.position.y=-.05;s.add(g);return g}
const CHC=[0xef4444,0x3b82f6,0x22c55e,0x111827,0xa855f7,0xfacc15];
function chips(s,x,z,n,ci){const g=new T.Group(),geo=new T.CylinderGeometry(.22,.22,.055,24);for(let i=0;i<n;i++){const m=new T.Mesh(geo,M(CHC[(ci+i)%6],{metalness:.2}));m.position.set((rnd()-.5)*.02,.03+i*.058,(rnd()-.5)*.02);g.add(m)}g.position.set(x,0,z);s.add(g);return g}
const ease=u=>1-Math.pow(1-Math.min(1,Math.max(0,u)),3);
// ---- RULETT (kaszino3 + közös mb2_rl + casino.js) ----
const ORD=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26],RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function sRoul(){const{s,c}=base([0,4.6,3.4],[0,0,.1]);const wh=new T.Group();s.add(wh);
 const bowl=new T.Mesh(new T.CylinderGeometry(2.55,2.35,.5,64,1,true),M(0x6b3a16,{side:T.DoubleSide,roughness:.35}));bowl.position.y=.05;s.add(bowl);
 const track=new T.Mesh(new T.RingGeometry(1.9,2.4,64),M(0x3a2010,{side:T.DoubleSide}));track.rotation.x=-Math.PI/2;track.position.y=.12;s.add(track);
 const fret=new T.BoxGeometry(.02,.1,.42),fm=M(0xe9c46a,{metalness:.8,roughness:.25}),pg=new T.BoxGeometry(.3,.04,.42);
 const mats={r:M(0xb3121f),k:M(0x141414),z:M(0x0f8a4c)};
 ORD.forEach((n,i)=>{const a=i/37*Math.PI*2,p=new T.Group();p.rotation.y=-a;wh.add(p);
  const m=new T.Mesh(pg,n===0?mats.z:RED.has(n)?mats.r:mats.k);m.position.set(1.55,0,0);m.rotation.y=Math.PI/2;p.add(m);
  const f=new T.Mesh(fret,fm);f.position.set(1.55,.05,0);f.rotation.y=Math.PI/2;f.position.applyAxisAngle(new T.Vector3(0,1,0),Math.PI/37);f.rotation.y+=Math.PI/37;p.add(f);
  const lt=ctex(64,64,(x)=>{x.fillStyle='#fff';x.font='bold 40px Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(n,32,34)});
  const lab=new T.Mesh(new T.PlaneGeometry(.26,.26),new T.MeshBasicMaterial({map:lt,transparent:true}));lab.rotation.x=-Math.PI/2;lab.rotation.z=-Math.PI/2;lab.position.set(1.86,.035,0);p.add(lab)});
 const disc=new T.Mesh(new T.CylinderGeometry(1.86,1.86,.06,64),M(0x2a1608));disc.position.y=-.04;wh.add(disc);
 const cone=new T.Mesh(new T.ConeGeometry(.6,.45,32),M(0xc9a64a,{metalness:.85,roughness:.25}));cone.position.y=.2;wh.add(cone);
 for(let k=0;k<4;k++){const a=new T.Mesh(new T.CylinderGeometry(.04,.04,1.1,8),fm);a.rotation.z=Math.PI/2;a.rotation.y=k*Math.PI/4;a.position.y=.45;wh.add(a)}
 const ball=new T.Mesh(new T.SphereGeometry(.09,16,12),M(0xffffff,{roughness:.15,metalness:.1}));s.add(ball);
 const st={mode:'idle',rel:0,r:1.62,wr:0,sig:'',t0:0,n:null};const pa=n=>ORD.indexOf(n)/37*Math.PI*2;
 const onClk=e=>{if(e.target.closest&&e.target.closest('#k3rS,#rSpin'))setTimeout(()=>{if(st.mode!=='land'){st.mode='spin';st.t0=performance.now()}},0)};document.addEventListener('click',onClk,true);
 return{s,c,off:()=>document.removeEventListener('click',onClk,true),upd(dt,f,now){const h=f.root.querySelector('#k3rh,#rHist');const sp=h?h.querySelectorAll('span'):[];
  const sig=sp.length+':'+(sp.length?sp[sp.length-1].textContent:'');if(st.sig==='')st.sig=sig,st.n=sp.length?+sp[sp.length-1].textContent:null;
  else if(sig!==st.sig){st.sig=sig;st.n=+sp[sp.length-1].textContent;const d=((pa(st.n)-st.rel)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)+Math.PI*4;st.mode='land';st.t0=now;st.r0=st.mode==='spin'?2.15:st.r;st.a0=st.rel;st.d=d;st.r0=2.15}
  if(st.mode==='spin'&&now-st.t0>14000)st.mode='idle';
  const ws=st.mode==='idle'?.35:st.mode==='spin'?2.6:2.6-1.8*ease((now-st.t0)/1800);st.wr+=ws*dt;wh.rotation.y=st.wr;
  let y=.1;if(st.mode==='spin'){st.rel+=10*dt;st.r=2.15;y=.2}else if(st.mode==='land'){const u=(now-st.t0)/1800;st.rel=st.a0+st.d*ease(u);st.r=2.15-(2.15-1.62)*ease(u*1.3);y=.1+Math.abs(Math.sin(u*14))*.12*(1-Math.min(1,u));if(u>=1)st.mode='idle'}
  else if(st.n!=null)st.rel=pa(st.n),st.r=1.62;ball.visible=st.mode!=='idle'||st.n!=null;const A=st.rel-st.wr;ball.position.set(Math.cos(A)*st.r,y,Math.sin(A)*st.r)}}}
// ---- NYERŐGÉP (3D hengerek) ----
const SY=['🍒','🍋','🔔','⭐','💎','7️⃣'];
function symIdx(t){t=(t||'').trim();let i=SY.indexOf(t);if(i<0)i=SY.findIndex(s=>t&&s.codePointAt(0)===t.codePointAt(0));return i}
function readReel(el){const cs=el.querySelectorAll('.k2st i');if(!cs.length)return el.textContent.trim();const r=el.getBoundingClientRect(),cy=r.top+r.height/2;let b=null,bd=1e9;
 cs.forEach(x=>{const q=x.getBoundingClientRect(),d=Math.abs(q.top+q.height/2-cy);if(d<bd){bd=d;b=x}});return b?b.textContent.trim():''}
function sSlot(){const{s,c}=base([0,.5,5.2],[0,.1,0]);const tx=SY.map(e=>ctex(128,128,(x)=>{x.fillStyle='#fffdf5';x.fillRect(0,0,128,128);x.font='84px "Segoe UI Emoji","Noto Color Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,64,70)}));
 const pm=tx.map(t=>new T.MeshStandardMaterial({map:t,roughness:.5}));const cab=new T.Mesh(new T.BoxGeometry(4.6,2.6,.6),M(0x4c1d95,{metalness:.4,roughness:.3}));cab.position.z=-1.1;s.add(cab);
 const top=new T.Mesh(new T.BoxGeometry(4.8,.35,.8),M(0xfacc15,{metalness:.8,roughness:.2,emissive:0x5a3a00}));top.position.set(0,1.45,-.9);s.add(top);
 const lev=new T.Group(),stick=new T.Mesh(new T.CylinderGeometry(.05,.05,1.2,8),M(0xcccccc,{metalness:.9}));stick.position.y=.6;lev.add(stick);const knob=new T.Mesh(new T.SphereGeometry(.16,16,12),M(0xdc2626));knob.position.y=1.2;lev.add(knob);lev.position.set(2.7,-.2,-.7);s.add(lev);
 const bulbs=[];for(let i=0;i<14;i++){const b=new T.Mesh(new T.SphereGeometry(.06,8,6),new T.MeshBasicMaterial({color:0xfde047}));b.position.set(-2.2+i*4.4/13,1.2,-.75);s.add(b);bulbs.push(b)}
 let reels=[],cnt=-1;const N=12,pg=new T.PlaneGeometry(1,.52);
 function build(els){reels.forEach(r=>s.remove(r.g));reels=[];const rs=els.map(e=>e.getBoundingClientRect());const xs=[...new Set(rs.map(r=>Math.round(r.left)))].sort((a,b)=>a-b),ys=[...new Set(rs.map(r=>Math.round(r.top)))].sort((a,b)=>a-b);
  const sc=Math.min(1,3.3/xs.length),vs=ys.length>1?1/ys.length:1;
  els.forEach((el,i)=>{const g=new T.Group();for(let k=0;k<N;k++){const pv=new T.Group();pv.rotation.x=k/N*Math.PI*2;const p=new T.Mesh(pg,pm[k%6]);p.position.z=1;pv.add(p);g.add(pv)}
   const xi=xs.indexOf(Math.round(rs[i].left)),yi=ys.indexOf(Math.round(rs[i].top));g.scale.set(sc,vs,vs);g.position.set((xi-(xs.length-1)/2)*1.1*sc,ys.length>1?((ys.length-1)/2-yi)*1.05*vs:0,0);s.add(g);
   reels.push({g,el,rot:0,sym:'',lc:0,mv:false,tg:null})});cnt=els.length}
 return{s,c,off:()=>{pm.forEach(m=>{m.map.dispose();m.dispose()});pg.dispose()},upd(dt,f,now){const els=[...f.root.querySelectorAll('.x10reel')];if(els.length!==cnt||els.some((e,i)=>reels[i].el!==e))build(els);let any=false;
  reels.forEach(r=>{const t=readReel(r.el);if(t!==r.sym){if(r.sym!=='')r.mv=true,r.lc=now;r.sym=t;if(!r.mv)r.tg=null}
   if(r.mv&&now-r.lc>350){r.mv=false;r.tg=null}
   if(r.mv){r.rot+=13*dt;any=true}else{const i=symIdx(r.sym);if(i>=0){if(r.tg==null){let tg=-i/N*Math.PI*2;const P=Math.PI*2/ (N/6);tg+=Math.ceil((r.rot-tg)/P)*P;r.tg=tg}r.rot+=(r.tg-r.rot)*Math.min(1,dt*12)}}
   r.g.rotation.x=r.rot});
  lev.rotation.x+=((any?.9:0)-lev.rotation.x)*Math.min(1,dt*8);bulbs.forEach((b,i)=>b.material.color.setHex(((now/(any?90:400)|0)+i)%3?0xfde047:0xf97316))}}}
// ---- KÁRTYÁK (videópóker, blackjack ×2, baccarat) ----
function sCards(){const{s,c}=base([0,4.4,3.3],[0,0,.25]);felt(s,7,4.2);const back=ctex(128,180,(x)=>{x.fillStyle='#fff';x.fillRect(0,0,128,180);x.fillStyle='#9f1239';x.fillRect(8,8,112,164);x.strokeStyle='#fde68a';x.lineWidth=3;for(let i=-180;i<180;i+=16){x.beginPath();x.moveTo(i,0);x.lineTo(i+180,180);x.stroke()}});
 const edge=M(0xf3f0e6),bm=new T.MeshStandardMaterial({map:back,roughness:.6}),cache={},geo=new T.BoxGeometry(.72,.016,1.02);
 const face=k=>cache[k]||(cache[k]=new T.MeshStandardMaterial({roughness:.6,map:ctex(128,180,(x)=>{const[r,su]=k.split('|'),red=su==='♥'||su==='♦';x.fillStyle='#fffdf7';x.fillRect(0,0,128,180);x.fillStyle=red?'#c81e1e':'#111';
  x.font='bold 34px Arial';x.textAlign='left';x.fillText(r,10,38);x.font='26px Arial';x.fillText(su,12,66);x.textAlign='center';x.font='78px Arial';x.fillText(su,64,128)})}));
 const shoe=new T.Mesh(new T.BoxGeometry(.9,.5,1.2),M(0x3b2310));shoe.position.set(3,.25,-1.4);s.add(shoe);chips(s,-2.9,1.2,6,0);chips(s,-2.4,1.4,4,2);chips(s,2.8,1.3,5,4);
 let cards={},sig='';
 return{s,c,off:()=>{Object.values(cache).forEach(m=>{m.map.dispose();m.dispose()});bm.dispose();back.dispose();geo.dispose();edge.dispose()},upd(dt,f,now){const els=[...f.root.querySelectorAll('.x10card,.x14dC,.pcard')].filter(vis);const ss=els.map(e=>e.className+e.textContent).join(';');
  if(ss!==sig){sig=ss;const groups=[];els.forEach(e=>{if(!groups.includes(e.parentNode))groups.push(e.parentNode)});const seen={};
   els.forEach(e=>{const gi=groups.indexOf(e.parentNode),sib=els.filter(x=>x.parentNode===e.parentNode),ci=sib.indexOf(e),key=gi+':'+ci;seen[key]=1;
    const tl=e.querySelector('.tl'),t=(tl||e).textContent.replace(/\s+/g,''),m=t.match(/[♠♥♦♣]/),hid=e.classList.contains('back')||(e.classList.contains('x14dC')&&e.classList.contains('h'))||!m;
    const fk=m?t.slice(0,m.index)+'|'+m[0]:'';let o=cards[key];
    if(!o){const mesh=new T.Mesh(geo,[edge,edge,edge,bm,edge,edge]);mesh.position.copy(shoe.position);mesh.rotation.z=Math.PI;s.add(mesh);o=cards[key]={mesh,t0:now,from:shoe.position.clone(),fk:'',up:false};}
    if(fk!==o.fk||hid===o.up){if(!hid){o.mesh.material[2]=face(fk);if(o.up&&o.fk!==fk)o.ft=now}o.fk=fk;o.up=!hid}
    const G=groups.length;o.to=new T.Vector3((ci-(sib.length-1)/2)*.86,.02+(e.classList.contains('x10card')&&e.classList.contains('h')?.12:0),(gi-(G-1)/2)*(G>2?1.15:1.5)-(e.classList.contains('x10card')&&e.classList.contains('h')?.2:0));
    if(!o.from.equals(o.mesh.position)&&o.t0!==now){o.from=o.mesh.position.clone();o.t0=now}});
   for(const k in cards)if(!seen[k]){s.remove(cards[k].mesh);delete cards[k]}}
  for(const k in cards){const o=cards[k],u=ease((now-o.t0)/420);o.mesh.position.lerpVectors(o.from,o.to,u);o.mesh.position.y+=Math.sin(Math.min(1,(now-o.t0)/420)*Math.PI)*.5;
   const tr=o.up?0:Math.PI;o.mesh.rotation.z+=(tr-o.mesh.rotation.z)*Math.min(1,dt*9)}}}}
// ---- CRASH (3D rakéta) ----
function sCrash(){const{s,c}=base([-1,1.5,6],[0,1,0]);const sp=new Float32Array(900);for(let i=0;i<900;i++)sp[i]=(rnd()-.5)*(i%3===1?80:60)+(i%3===1?30:0);
 const sg=new T.BufferGeometry();sg.setAttribute('position',new T.BufferAttribute(sp,3));s.add(new T.Points(sg,new T.PointsMaterial({color:0xffffff,size:.08})));
 const grid=new T.GridHelper(40,40,0x7c3aed,0x2e1065);s.add(grid);
 const rk=new T.Group();const body=new T.Mesh(new T.CylinderGeometry(.18,.22,.9,16),M(0xe5e7eb,{metalness:.6,roughness:.3}));rk.add(body);const nose=new T.Mesh(new T.ConeGeometry(.18,.4,16),M(0xdc2626));nose.position.y=.65;rk.add(nose);
 for(let i=0;i<3;i++){const fn=new T.Mesh(new T.BoxGeometry(.04,.3,.3),M(0xdc2626));const a=i/3*Math.PI*2;fn.position.set(Math.cos(a)*.22,-.35,Math.sin(a)*.22);fn.rotation.y=-a;rk.add(fn)}
 const fl=new T.Mesh(new T.ConeGeometry(.15,.6,12),new T.MeshBasicMaterial({color:0xf97316,transparent:true,opacity:.85,blending:T.AdditiveBlending}));fl.rotation.x=Math.PI;fl.position.y=-.75;rk.add(fl);rk.rotation.z=-.5;s.add(rk);
 const LP=new Float32Array(1200*3),lg=new T.BufferGeometry();lg.setAttribute('position',new T.BufferAttribute(LP,3));lg.setDrawRange(0,0);const line=new T.Line(lg,new T.LineBasicMaterial({color:0x4ade80}));s.add(line);
 const PN=120,pp=new Float32Array(PN*3),pv=[],pgeo=new T.BufferGeometry();pgeo.setAttribute('position',new T.BufferAttribute(pp,3));const boom=new T.Points(pgeo,new T.PointsMaterial({color:0xfbbf24,size:.16,transparent:true,blending:T.AdditiveBlending}));boom.visible=false;s.add(boom);
 const st={run:false,t:0,m:1,n:0,hs:null,bt:0};const tgt=new T.Vector3();
 return{s,c,upd(dt,f,now){const btn=f.root.querySelector('#k4crb'),msg=f.root.querySelector('#k4msg'),h=f.root.querySelector('#k4crh');const run=!!btn&&/KISZÁLL/i.test(btn.textContent);
  const hs=h?h.children.length+':'+h.textContent.slice(-8):'';if(st.hs===null)st.hs=hs;
  if(run&&!st.run){st.t=0;st.m=1;st.n=0;rk.visible=true;boom.visible=false;st.fly=true}st.run=run;
  const mm=msg&&msg.textContent.match(/×\s*([0-9]+[.,][0-9]+)/);if(run&&mm)st.m=Math.max(st.m,parseFloat(mm[1].replace(',','.')));else if(st.fly&&!run)st.m*=1+dt*.08;
  if(hs!==st.hs){st.hs=hs;if(st.fly){st.fly=false;rk.visible=false;boom.visible=true;st.bt=now;pv.length=0;for(let i=0;i<PN;i++){pp[i*3]=rk.position.x;pp[i*3+1]=rk.position.y;pp[i*3+2]=0;const a=rnd()*6.28,b=rnd()*3.14,v=1+rnd()*3;pv.push([Math.cos(a)*Math.sin(b)*v,Math.cos(b)*v,Math.sin(a)*Math.sin(b)*v])}}}
  if(st.fly){st.t+=dt;const x=Math.min(st.t*.5,6),y=Math.log(st.m)*3;rk.position.set(x,y+.3,0);rk.rotation.z=-.5-Math.min(.6,y*.1)+.5;if(st.n<1200&&(st.n===0||st.t*10>st.n)){LP[st.n*3]=x;LP[st.n*3+1]=y+.3;LP[st.n*3+2]=0;st.n++;lg.attributes.position.needsUpdate=true;lg.setDrawRange(0,st.n)}
   fl.scale.set(1,.8+rnd()*.6,1)}else if(!boom.visible){rk.position.set(0,.3,0);rk.rotation.z=0;rk.visible=true}
  if(boom.visible){const u=(now-st.bt)/1000;for(let i=0;i<PN;i++){pp[i*3]+=pv[i][0]*dt;pp[i*3+1]+=pv[i][1]*dt;pp[i*3+2]+=pv[i][2]*dt;pv[i][1]-=3*dt}pgeo.attributes.position.needsUpdate=true;boom.material.opacity=Math.max(0,1-u/1.6);if(u>2){boom.visible=false;lg.setDrawRange(0,0);st.n=0}}
  tgt.set(rk.position.x*.7,rk.position.y*.8+.6,0);c.userData.l.lerp(tgt,Math.min(1,dt*3));c.position.set(c.userData.l.x-1,c.userData.l.y+.6,6);c.lookAt(c.userData.l)}}}
// ---- KENÓ / LOTTÓ golyók ----
function ballTex(n,col){return ctex(128,64,(x)=>{x.fillStyle=col;x.fillRect(0,0,128,64);x.fillStyle='#fff';[32,96].forEach(cx=>{x.beginPath();x.arc(cx,32,20,0,7);x.fill()});x.fillStyle='#111';x.font='bold 22px Arial';x.textAlign='center';x.textBaseline='middle';[32,96].forEach(cx=>x.fillText(n,cx,33))})}
function globe(s,y){const g=new T.Group();const gl=new T.Mesh(new T.SphereGeometry(1,24,16),new T.MeshStandardMaterial({color:0x93c5fd,transparent:true,opacity:.18,roughness:.05,metalness:.3}));g.add(gl);
 const bg=new T.SphereGeometry(.16,12,10);for(let i=0;i<14;i++){const b=new T.Mesh(bg,M(CHC[i%6]));b.userData.p=[rnd()*6,rnd()*6,.4+rnd()*.4];g.add(b)}const st=new T.Mesh(new T.CylinderGeometry(.3,.5,.5,16),M(0xc9a64a,{metalness:.8}));st.position.y=-1.15;g.add(st);g.position.y=y;s.add(g);
 g.userData.tick=(t,fast)=>{g.children.forEach((b,i)=>{const p=b.userData.p;if(!p)return;const k=t*(fast?3:.8);b.position.set(Math.sin(p[0]+k*1.3)*p[2],Math.cos(p[1]+k*1.7)*p[2]*.9,Math.sin(p[1]+k)*p[2])})};return g}
function sKeno(){const{s,c}=base([0,3.6,4.6],[0,.3,0]);felt(s,7.4,3.4,0x2e1065);const gl=globe(s,1.3);gl.position.x=-2.7;gl.scale.setScalar(.75);const balls={},bg=new T.SphereGeometry(.26,20,14);let sig='';
 return{s,c,upd(dt,f,now){const d=[...f.root.querySelectorAll('.k4kg button.d')];const ss=d.map(b=>b.textContent+(b.classList.contains('p')?'p':'')).join(',');
  if(ss!==sig){sig=ss;const seen={};d.forEach((b,j)=>{const n=b.textContent.trim(),hit=b.classList.contains('p');seen[n]=1;let o=balls[n];
   if(!o){const m=new T.Mesh(bg,new T.MeshStandardMaterial({map:ballTex(n,hit?'#16a34a':'#f59e0b'),roughness:.3,emissive:hit?0x14532d:0}));m.position.set(-2.7,2.2,0);s.add(m);o=balls[n]={m,v:new T.Vector3((rnd()-.5)*2,0,0)}}
   o.to=new T.Vector3(-1.1+(j%8)*.6,.26,-.9+(j/8|0)*.6)});for(const n in balls)if(!seen[n]){s.remove(balls[n].m);balls[n].m.material.map.dispose();balls[n].m.material.dispose();delete balls[n]}}
  gl.userData.tick(now/1000,d.length>0&&d.length<20);for(const n in balls){const o=balls[n],p=o.m.position;o.v.y-=9*dt;p.y+=o.v.y*dt;if(p.y<.26){p.y=.26;o.v.y=Math.abs(o.v.y)>.5?-o.v.y*.45:0}p.x+=(o.to.x-p.x)*Math.min(1,dt*4);p.z+=(o.to.z-p.z)*Math.min(1,dt*4);o.m.rotation.x+=dt*(Math.abs(o.to.x-p.x)*3)}}}}
// ---- KOCKAPÓKER ----
function sDice(){const{s,c}=base([0,3.4,3.6],[0,0,0]);felt(s,6.4,3.2);const pip=v=>ctex(96,96,(x)=>{x.fillStyle='#f8f4e8';x.fillRect(0,0,96,96);x.fillStyle=v===1?'#b91c1c':'#111';
  const P={1:[[48,48]],2:[[24,24],[72,72]],3:[[24,24],[48,48],[72,72]],4:[[24,24],[72,24],[24,72],[72,72]],5:[[24,24],[72,24],[48,48],[24,72],[72,72]],6:[[24,22],[72,22],[24,48],[72,48],[24,74],[72,74]]}[v];P.forEach(([a,b])=>{x.beginPath();x.arc(a,b,v===1?14:9,0,7);x.fill()})});
 const fm=[3,4,1,6,2,5].map(v=>new T.MeshStandardMaterial({map:pip(v),roughness:.35}));const OR={1:[0,0,0],6:[Math.PI,0,0],2:[-Math.PI/2,0,0],5:[Math.PI/2,0,0],3:[0,0,Math.PI/2],4:[0,0,-Math.PI/2]};
 const geo=new T.BoxGeometry(.6,.6,.6),dice=[];for(let i=0;i<5;i++){const g=new T.Group(),m=new T.Mesh(geo,fm);g.add(m);g.position.set((i-2)*.95,.3,0);s.add(g);dice.push({g,m,v:0,t0:-1e9,k:false,ry:rnd()*6})}
 const glow=new T.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:.5});const rings=dice.map(d=>{const r=new T.Mesh(new T.RingGeometry(.42,.5,24),glow);r.rotation.x=-Math.PI/2;r.position.set(d.g.position.x,.01,0);s.add(r);return r});
 return{s,c,upd(dt,f,now){const els=[...f.root.querySelectorAll('.x14dDi')];dice.forEach((d,i)=>{const e=els[i];const v=e?'⚀⚁⚂⚃⚄⚅'.indexOf(e.textContent.trim())+1:0;const roll=e&&e.classList.contains('roll');d.k=!!e&&e.classList.contains('k');
  if(v!==d.v||roll&&now-d.t0>700){if(v!==d.v||roll){d.t0=now;d.ry=rnd()*6}d.v=v}const u=(now-d.t0)/650,o=OR[d.v||1];
  if(u<1){d.m.rotation.set(o[0]+(1-ease(u))*9,o[1]+(1-ease(u))*7,o[2]+(1-ease(u))*5);d.g.position.y=.3+Math.abs(Math.sin(u*Math.PI*2))*(1-u)*.9}else{d.m.rotation.set(o[0],o[1],o[2]);d.g.position.y=.3+(d.k?.08:0)}
  d.g.rotation.y=d.ry*.15;rings[i].visible=d.k})}}}
// ---- LÓVERSENY ----
function sHorse(){const{s,c}=base([-3,3.2,5],[-2,0,0]);const tr=new T.Mesh(new T.BoxGeometry(16,.1,4.4),M(0x14532d,{roughness:1}));tr.position.set(2,-.05,0);s.add(tr);
 const lm=new T.MeshBasicMaterial({color:0xffffff});for(let i=0;i<7;i++){const l=new T.Mesh(new T.BoxGeometry(16,.01,.03),lm);l.position.set(2,.01,-2.1+i*.7);s.add(l)}
 const fin=new T.Mesh(new T.BoxGeometry(.15,.02,4.4),new T.MeshBasicMaterial({color:0xfde047}));fin.position.set(8,.02,0);s.add(fin);let hs=[],sig='';const st={run:false,win:-1};
 function build(lb){hs.forEach(h=>s.remove(h.g));hs=lb.map((l,i)=>{const col=new T.Color((l.querySelector('b')||{}).style?.color||'#888');const g=new T.Group(),mm=M(col),dk=M(0x3b2310);
  const body=new T.Mesh(new T.BoxGeometry(.7,.28,.22),dk);body.position.y=.55;g.add(body);const nk=new T.Mesh(new T.BoxGeometry(.18,.4,.16),dk);nk.position.set(.38,.75,0);nk.rotation.z=-.5;g.add(nk);
  const hd=new T.Mesh(new T.BoxGeometry(.3,.14,.14),dk);hd.position.set(.55,.92,0);g.add(hd);const jk=new T.Mesh(new T.SphereGeometry(.13,10,8),mm);jk.position.set(0,.82,0);g.add(jk);const sad=new T.Mesh(new T.BoxGeometry(.3,.05,.26),mm);sad.position.set(0,.7,0);g.add(sad);
  const legs=[];[[.25,.08],[.25,-.08],[-.25,.08],[-.25,-.08]].forEach(([x,z])=>{const p=new T.Group();p.position.set(x,.42,z);const lg=new T.Mesh(new T.BoxGeometry(.06,.42,.06),dk);lg.position.y=-.21;p.add(lg);g.add(p);legs.push(p)});
  g.position.set(-5.5,0,-1.75+i*.7);s.add(g);return{g,legs,p:0,name:l.textContent.replace(/[■()0-9.,×\s]+$/,'').replace('■','').trim()}})}
 return{s,c,upd(dt,f,now){const lb=[...f.root.querySelectorAll('label')].filter(l=>l.querySelector('input[name=x14dh]'));if(lb.length!==hs.length)build(lb);
  const btn=f.root.querySelector('#x14dHG'),run=!!btn&&btn.disabled,msg=(f.root.querySelector('#x14dHM')||{}).textContent||'';
  if(run&&!st.run){hs.forEach(h=>h.p=0);st.win=-1;st.t0=now}if(!run&&st.run)st.win=hs.findIndex(h=>h.name&&msg.includes(h.name));st.run=run;
  hs.forEach((h,i)=>{const go=run&&now-st.t0>1800;if(go)h.p=Math.min(.95,h.p+dt*(.06+rnd()*.06));if(!run&&st.win===i)h.p+=(1-h.p)*Math.min(1,dt*3);
   h.g.position.x=-5.5+h.p*13.5;const sw=go||(!run&&st.win===i&&h.p<.99)?Math.sin(now/70+i)*.7:0;h.legs.forEach((l,k)=>l.rotation.z=k%2?sw:-sw);h.g.position.y=go?Math.abs(Math.sin(now/70+i))*.06:0});
  const lead=hs.reduce((a,h)=>Math.max(a,h.g.position.x),-5.5);c.userData.l.x+=(lead-c.userData.l.x)*Math.min(1,dt*2);c.position.set(c.userData.l.x-1,3.2,5);c.lookAt(c.userData.l)}}}
// ---- DÍSZ: kaszinó-menü, kaparós, lottó, tőzsde/VIP fülek ----
function sDeco(kind){const{s,c}=base([0,2.6,5.4],[0,.6,0]);felt(s,8,3.4,kind==='lotto'?0x2e1065:0x0f6b3a);let g=null;
 if(kind==='lotto')g=globe(s,1.15);
 else if(kind==='scr'){g=new T.Mesh(new T.BoxGeometry(2.2,1.4,.04),[M(0xc9a64a),M(0xc9a64a),M(0xc9a64a),M(0xc9a64a),new T.MeshStandardMaterial({map:ctex(256,160,(x)=>{const gr=x.createLinearGradient(0,0,256,160);gr.addColorStop(0,'#d1d5db');gr.addColorStop(.5,'#f9fafb');gr.addColorStop(1,'#9ca3af');x.fillStyle=gr;x.fillRect(0,0,256,160);x.fillStyle='#7c2d12';x.font='bold 26px Arial';x.textAlign='center';x.fillText('KAPARD LE!',128,90)}),metalness:.6,roughness:.3}),M(0x7c2d12)]);g.position.y=1;s.add(g)}
 else{const w=new T.Mesh(new T.CylinderGeometry(.9,.9,.12,37),M(0x7f1d1d));w.position.set(0,.1,0);s.add(w);g=w}
 const st=[chips(s,-2.6,.6,7,0),chips(s,-1.9,.9,4,2),chips(s,2.2,.7,6,4),chips(s,2.9,.4,3,1)];
 const cg=new T.CylinderGeometry(.22,.22,.04,24),cm=M(0xfacc15,{metalness:.9,roughness:.2}),coins=[];for(let i=0;i<8;i++){const m=new T.Mesh(cg,cm);m.rotation.x=Math.PI/2;s.add(m);coins.push(m)}
 return{s,c,upd(dt,f,now){const t=now/1000;if(kind==='lotto')g.userData.tick(t,false);else if(kind==='scr'){g.rotation.y=Math.sin(t*.8)*.4;g.rotation.x=-.2}else g.rotation.y+=dt*.8;
  coins.forEach((m,i)=>{const a=t*.6+i/8*6.28;m.position.set(Math.cos(a)*3,1.2+Math.sin(t*1.5+i)*.3,Math.sin(a)*1.2-.3);m.rotation.z=t*3+i});st.forEach((x,i)=>x.rotation.y=t*.3*(i%2?1:-1))}}}
// ---- NAPI KERÉK: a meglévő 2D kerék-vászon textúraként egy 3D korongon (pontosan együtt forog) ----
function sWheel(){const{s,c}=base([0,1.2,4.2],[0,.2,0]);let tx=null,cv=null;const disc=new T.Mesh(new T.CircleGeometry(1.5,64),new T.MeshBasicMaterial({color:0xffffff}));disc.position.z=.07;
 const g=new T.Group();g.add(disc);const rim=new T.Mesh(new T.TorusGeometry(1.52,.08,12,64),M(0xc9a64a,{metalness:.85,roughness:.25}));g.add(rim);const back=new T.Mesh(new T.CylinderGeometry(1.55,1.55,.12,64),M(0x3b2310));back.rotation.x=Math.PI/2;g.add(back);
 const bl=[];for(let i=0;i<24;i++){const b=new T.Mesh(new T.SphereGeometry(.05,8,6),new T.MeshBasicMaterial({color:0xfde047}));const a=i/24*6.28;b.position.set(Math.cos(a)*1.52,Math.sin(a)*1.52,.1);g.add(b);bl.push(b)}
 const ptr=new T.Mesh(new T.ConeGeometry(.12,.3,12),M(0xdc2626));ptr.rotation.z=Math.PI;ptr.position.set(0,1.75,.15);g.add(ptr);g.rotation.x=-.25;s.add(g);
 const stand=new T.Mesh(new T.BoxGeometry(.3,1.6,.3),M(0x3b2310));stand.position.set(0,-1.2,-.1);s.add(stand);
 return{s,c,upd(dt,f,now){const w=document.getElementById('xWh');if(w&&w!==cv){cv=w;if(tx)tx.dispose();tx=new T.CanvasTexture(w);disc.material.map=tx;disc.material.needsUpdate=true}if(tx)tx.needsUpdate=true;
  g.rotation.y=Math.sin(now/1500)*.25;bl.forEach((b,i)=>b.material.color.setHex(((now/200|0)+i)%2?0xfde047:0xf97316))}}}
const MK={roul:sRoul,slot:sSlot,cards:sCards,crash:sCrash,keno:sKeno,dice:sDice,horse:sHorse,wheel:sWheel,scr:()=>sDeco('scr'),lotto:()=>sDeco('lotto'),deco:()=>sDeco('deco')};
// ---- vezérlés ----
function drop(){if(!cur)return;try{cur.off&&cur.off()}catch(e){}disp(cur.s);cur=null}
function stop(){cancelAnimationFrame(raf);raf=0;drop();if(wrap.parentNode)wrap.parentNode.removeChild(wrap);if(!iv)iv=setInterval(check,400)}
function frame(now){raf=0;const f=find();if(!f||dead){stop();return}
 if(!cur||cur.type!==f.type){drop();try{cur=MK[f.type]();cur.type=f.type}catch(e){console.warn('k3d',e);dead=true;stop();return}}
 place(f);const w=wrap.clientWidth,h=wrap.clientHeight;if(w&&h&&(w!==cur.w||h!==cur.h)){cur.w=w;cur.h=h;R.setSize(w,h,false);cur.c.aspect=w/h;cur.c.fov=w/h<1.6?50:38;cur.c.updateProjectionMatrix()}
 const dt=Math.min(.05,(now-(last||now))/1000);last=now;try{cur.upd(dt,f,now)}catch(e){console.warn('k3d upd',e)}R.render(cur.s,cur.c);raf=requestAnimationFrame(frame)}
function check(){if(raf||dead)return;const f=find();if(!f)return;if(!rend())return;clearInterval(iv);iv=0;last=0;raf=requestAnimationFrame(frame)}
iv=setInterval(check,400);
window._k3d={st:()=>({type:cur&&cur.type,running:!!raf,dead,calls:R&&R.info.render.calls,geo:R&&R.info.memory.geometries,tex:R&&R.info.memory.textures}),off:()=>{dead=true;stop()},on:()=>{dead=false;check()},find};
})();
