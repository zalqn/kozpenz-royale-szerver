// Sziget Aréna – 'csirke' mód kiegészítés. Hookok: window._kpMode.csirke = {round(W,SC), tick(dt,T,W), hit(s,t)->false=tiltás, hud(W)}; belső API: window._kpI
(function(){window._kpMode=window._kpMode||{};
const I=()=>window._kpI,L=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
let C=null;// C: 3D csirke + díszletek
function box(w,h,d,c){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L(c))}
function chicken(){const g=new THREE.Group(),b=new THREE.Group();g.add(b);
 const body=new THREE.Mesh(new THREE.SphereGeometry(.32,8,6),L(0xfafafa));body.scale.set(1,.85,1.25);body.position.y=.45;b.add(body);
 const tail=box(.12,.28,.12,0xeeeeee);tail.position.set(0,.62,-.36);tail.rotation.x=-.5;b.add(tail);
 const hd=new THREE.Group();hd.position.set(0,.78,.26);b.add(hd);
 hd.add(new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),L(0xffffff)));
 const bk=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,5),L(0xf59e0b));bk.rotation.x=Math.PI/2;bk.position.set(0,-.02,.2);hd.add(bk);
 for(let i=0;i<3;i++){const cm=box(.04,.1,.07,0xdc2626);cm.position.set(0,.17,.06-i*.07);hd.add(cm)}
 const wt=box(.04,.1,.05,0xdc2626);wt.position.set(0,-.12,.15);hd.add(wt);
 for(const s of[-1,1]){const e=new THREE.Mesh(new THREE.SphereGeometry(.03,5,4),L(0x111111));e.position.set(s*.13,.04,.1);hd.add(e)}
 const wg=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*.3,.5,0);const w=box(.05,.22,.4,0xe5e5e5);w.position.y=-.08;p.add(w);b.add(p);return p});
 const lg=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*.12,.25,0);const l=box(.04,.25,.04,0xf59e0b);l.position.y=-.12;p.add(l);const f=box(.12,.03,.14,0xf59e0b);f.position.set(0,-.25,.04);p.add(f);g.add(p);return p});
 g.userData={b,hd,wg,lg};return g}
function decor(W,SC,MO){const R=W.R||10;
 const coop=new THREE.Group();{const cb=box(1.6,1,1.2,0xb45309);cb.position.y=.5;coop.add(cb)}
 const rf=new THREE.Mesh(new THREE.ConeGeometry(1.25,.7,4),L(0x991b1b));rf.rotation.y=Math.PI/4;rf.position.y=1.35;rf.scale.z=.8;coop.add(rf);
 const dr=box(.4,.5,.05,0x3f2a14);dr.position.set(0,.3,.61);coop.add(dr);
 coop.position.set(0,0,-R*.78);coop.lookAt(0,0,0);MO(coop);
 const fp=new THREE.BoxGeometry(.1,.6,.1),fr=new THREE.BoxGeometry(.05,.06,1.05),fm=L(0xd6b98c);
 for(let i=0;i<28;i++){if(i>12&&i<16)continue;const a=i/28*6.283,x=Math.cos(a)*R*.92,z=Math.sin(a)*R*.92;
  const p=MO(new THREE.Mesh(fp,fm));p.position.set(x,.3,z);
  const r=MO(new THREE.Mesh(fr,fm));const a2=a+3.1416/28;r.position.set(Math.cos(a2)*R*.92,.42,Math.sin(a2)*R*.92);r.rotation.y=-a2;r.scale.z=R*.92*6.283/28/1.05}
 for(let i=0;i<4;i++){const a=.8+i*1.5,h=MO(new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.7,10),L(0xeab308)));h.rotation.z=Math.PI/2;h.rotation.y=a;h.position.set(Math.cos(a)*R*.6,.35,Math.sin(a)*R*.6)}
 const ring=MO(new THREE.Mesh(new THREE.RingGeometry(.55,.75,32,1,0,6.283),new THREE.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:.85,side:THREE.DoubleSide,depthTest:false})));
 ring.rotation.x=-Math.PI/2;ring.visible=false;
 const glow=MO(new THREE.PointLight(0xfacc15,0,4));
 return{ring,glow}}
function cluck(){const i=I();i.tone(900,600,.07,.12,'square');setTimeout(()=>i.tone(1100,500,.09,.1,'square'),90)}
window._kpMode.csirke={
 round(W,SC){const MO=o=>{SC.add(o);W.modeObj.push(o);return o};// W.modeObj-ot a mag takarítja kör elején
  const m=MO(chicken());const d=decor(W,SC,MO);C=Object.assign({m,last:null,ph:0,fl:0,ct:2,steal:{},ring:null},d);
  if(W.ck)W.ck.m.visible=false},
 tick(dt,T,W){const c=W.ck;if(!c||!C)return;const i=I(),u=C.m.userData;c.m.visible=false;
  if(c.holder!==C.last){const x=c.x,y=c.y,z=c.z;
   if(C.last&&!c.holder){i.burst(x,y,z,0xffffff,24,5);C.fl=1.2;cluck();}
   if(c.holder){i.burst(x,y,z,0xfacc15,12,3);cluck();const n=c.holder.name;C.steal[n]=(C.steal[n]||0)+1}
   C.last=c.holder}
  const h=c.holder,sp=Math.hypot(c.vx,c.vz);C.fl=Math.max(0,C.fl-dt);
  C.m.position.set(c.x,h?c.y-.4:c.y-.6,c.z);
  if(h)C.m.rotation.y=h.face||0;else if(sp>.1)C.m.rotation.y=Math.atan2(c.vx,c.vz);
  C.ph+=dt*(h?4:sp*5);const flap=h||C.fl>0;
  u.lg.forEach((l,k)=>l.rotation.x=h?.8:Math.sin(C.ph+k*3.14)*.7);
  u.wg.forEach((w,k)=>w.rotation.z=(k?-1:1)*(flap?.3+Math.abs(Math.sin(T*(h?14:22)))*1.1:.05));
  u.hd.rotation.x=Math.sin(T*(h?6:3))*.25;u.b.position.y=h?0:Math.abs(Math.sin(C.ph))*.06;
  if(C.fl>0&&Math.random()<dt*20)i.burst(c.x,c.y,c.z,0xffffff,2,2);
  if((C.ct-=dt)<=0){C.ct=3+Math.random()*4;if(!h||Math.random()<.5)cluck()}
  C.ring.visible=!!h;C.glow.intensity=h?1.4:0;
  if(h){const f=Math.min(1,(h.sc||0)/20);C.ring.position.set(h.x,(h.y||0)+.08,h.z);C.ring.geometry.dispose();C.ring.geometry=new THREE.RingGeometry(.55,.75,32,1,0,6.283*f);
   C.ring.material.color.setHex(f>.75?0xef4444:0xfacc15);C.glow.position.set(h.x,(h.y||0)+1.5,h.z)}}
};
})();
