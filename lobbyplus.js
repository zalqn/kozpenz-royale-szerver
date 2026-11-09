// ===== LOBBY EXTRÁK: óriás jacht, közpénzzel lobogó tábortűz, börtön a furgon mögött (kiabáló rab) =====
(function(){
function build(L){const sc=L.sc,fx=L.fx;const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.4,metalness:.2},o||{}));
 const B=(w,h,d,m,x,y,z,par)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;(par||sc).add(b);return b};
 // ---------- ÓRIÁS JACHT (bal hátul, a vízen) ----------
 {const y=new THREE.Group();const white=M(0xf8fafc,{roughness:.25}),navy=M(0x0f172a,{roughness:.3,metalness:.5}),glass=M(0x0b2540,{roughness:.05,metalness:.9}),gold=M(0xd4af37,{metalness:.9,roughness:.2}),teak=M(0xa16207,{roughness:.7});
  // hajótest: hosszú, hegyes orr (extrudált profil)
  const sh=new THREE.Shape();sh.moveTo(-22,0);sh.lineTo(16,0);sh.quadraticCurveTo(24,0,30,3.2);sh.lineTo(-23,3.2);sh.lineTo(-22,0);
  const hull=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:9,bevelEnabled:true,bevelSize:.4,bevelThickness:.4,bevelSegments:2}),white);hull.position.set(0,-.6,-4.5);y.add(hull);
  const stripe=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:9.06,bevelEnabled:false}),navy);stripe.scale.set(1.002,.18,1);stripe.position.set(0,1.6,-4.53);y.add(stripe);
  B(44,.25,8.4,teak,2,2.75,0,y);
  // emeletek
  [[34,2.6,7.4,0,4.2],[26,2.4,6.4,-2,6.7],[17,2.2,5.4,-4,9]].forEach(([w,h,d,x,yy],i)=>{B(w,h,d,white,x,yy,0,y);B(w+.1,h*.45,d+.1,glass,x+.5,yy+.1,0,y);B(w+.6,.18,d+.6,white,x,yy+h/2+.08,0,y);
   for(let k=0;k<Math.floor(w/1.6);k++)[-1,1].forEach(s=>B(.08,.8,.08,M(0xd1d5db,{metalness:1}),x-w/2+.8+k*1.6,yy+h/2+.5,s*(d/2+.25),y))});
  // radar, árboc, kémény
  B(.3,4,.3,white,-5,12.2,0,y);const rad=B(2.6,.15,.4,white,-5,13.6,0,y);B(3,.6,1.6,navy,-8,10.4,0,y);
  const heli=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.2,24),M(0x334155));heli.position.set(-15,5.6,0);y.add(heli);const H=document.createElement('canvas');H.width=128;H.height=128;const hx=H.getContext('2d');hx.fillStyle='#334155';hx.fillRect(0,0,128,128);hx.strokeStyle='#facc15';hx.lineWidth=8;hx.beginPath();hx.arc(64,64,54,0,7);hx.stroke();hx.fillStyle='#fff';hx.font='bold 70px Arial';hx.textAlign='center';hx.textBaseline='middle';hx.fillText('H',64,68);
  const hp=new THREE.Mesh(new THREE.CircleGeometry(2.9,24),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(H)}));hp.rotation.x=-Math.PI/2;hp.position.set(-15,5.72,0);y.add(hp);
  // név a hajótesten
  const nc=document.createElement('canvas');nc.width=1024;nc.height=128;const nx=nc.getContext('2d');nx.fillStyle='#d4af37';nx.font='bold 84px Georgia';nx.textAlign='center';nx.textBaseline='middle';nx.fillText('M/Y KÖZPÉNZ  ·  OFFSHORE',512,64);
  const nm=new THREE.Mesh(new THREE.PlaneGeometry(22,2.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(nc),transparent:true}));nm.position.set(4,1.3,4.98);y.add(nm);
  // fények az ablakokban
  for(let i=0;i<26;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(.9,.5),new THREE.MeshBasicMaterial({color:i%5?0xffe2a8:0x7dd3fc}));l.position.set(-14+i*1.2,4.3,3.75);y.add(l)}
  // jakuzzi a fedélzeten + pénz-zászló
  const jac=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,.5,20),M(0x38bdf8,{emissive:0x0ea5e9,emissiveIntensity:.5,transparent:true,opacity:.85}));jac.position.set(14,3.1,0);y.add(jac);
  B(.12,5,.12,white,-20,5.4,0,y);const flag=B(2.4,1.4,.05,M(0x16a34a,{side:THREE.DoubleSide}),-18.8,7.2,0,y);
  y.position.set(-40,0,-70);y.rotation.y=.55;y.scale.setScalar(1.15);y.traverse(o=>{if(o.isMesh)o.receiveShadow=true});sc.add(y);
  fx.push(t=>{y.position.y=Math.sin(t*.6)*.25;y.rotation.z=Math.sin(t*.5)*.012;rad.rotation.y=t*1.5;flag.rotation.y=Math.sin(t*3)*.25})}
 // ---------- KÖZPÉNZ-TŰZ: bankjegyek lobognak a lángokban ----------
 {const FX=-6.2,FZ=-8;const notes=[];const nc=document.createElement('canvas');nc.width=128;nc.height=64;const x=nc.getContext('2d');x.fillStyle='#16a34a';x.fillRect(0,0,128,64);x.fillStyle='#bbf7d0';x.fillRect(6,6,116,52);x.fillStyle='#15803d';x.font='bold 30px Georgia';x.textAlign='center';x.textBaseline='middle';x.fillText('20 000',64,26);x.font='bold 13px Arial';x.fillText('KÖZPÉNZ',64,48);
  const nmat=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(nc),side:THREE.DoubleSide,transparent:true});
  for(let i=0;i<16;i++){const n=new THREE.Mesh(new THREE.PlaneGeometry(.42,.21),nmat.clone());n.userData={ph:Math.random(),sp:.35+Math.random()*.35,r:.15+Math.random()*.3,a:Math.random()*6};sc.add(n);notes.push(n)}
  // pénzkupac a tűzben + zöld lángnyelv
  for(let i=0;i<6;i++){const s=B(.42,.06,.21,new THREE.MeshStandardMaterial({color:0x22c55e,emissive:0x14532d,emissiveIntensity:.6}),FX+(Math.random()-.5)*.5,.3+i*.05,FZ+(Math.random()-.5)*.5);s.rotation.y=Math.random()*3}
  const gf=new THREE.Mesh(new THREE.ConeGeometry(.18,.9,8),new THREE.MeshBasicMaterial({color:0x4ade80,transparent:true,opacity:.6}));gf.position.set(FX,.75,FZ);sc.add(gf);
  fx.push(t=>{notes.forEach(n=>{const u=n.userData,k=((t*u.sp+u.ph)%1);n.position.set(FX+Math.cos(u.a+t*2)*u.r*(1+k),.4+k*3.2,FZ+Math.sin(u.a+t*2)*u.r*(1+k));n.rotation.set(t*3+u.a,t*2,t*1.5);n.material.opacity=k<.7?1:1-(k-.7)/.3;
   const c=k<.4?1:Math.max(.25,1-(k-.4)*1.5);n.material.color.setRGB(1,c,c*.7)});gf.scale.set(1+Math.sin(t*13)*.15,1+Math.sin(t*9)*.25,1);gf.rotation.y=t*3})}
 // ---------- BÖRTÖN a furgon mögött + kiabáló rab ----------
 {const J=new THREE.Group();const conc=M(0x9ca3af,{roughness:.9}),dark=M(0x374151,{roughness:.8}),bar=M(0x1f2937,{metalness:.9,roughness:.3});
  B(9,5,6,conc,0,2.5,0,J);B(9.4,.4,6.4,dark,0,5.2,0,J);
  // rácsos ablak elöl (cellanyílás) – benne áll a rab
  B(3.2,2.6,.3,M(0x111827),1.5,2.1,3.02,J);for(let i=0;i<8;i++)B(.08,2.6,.08,bar,.1+i*.4,2.1,3.2,J);B(3.3,.1,.1,bar,1.5,3.4,3.2,J);B(3.3,.1,.1,bar,1.5,.8,3.2,J);
  // őrtorony
  B(1.6,7,1.6,conc,-3.8,3.5,-2,J);B(2.4,1.4,2.4,dark,-3.8,7.6,-2,J);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.25,10,8),new THREE.MeshBasicMaterial({color:0xfff7c2}));lamp.position.set(-3.8,8.5,-2);J.add(lamp);
  // szögesdrót-kerítés
  for(let i=0;i<6;i++){B(.1,2.4,.1,bar,-4.5+i*1.8,1.2,4.6,J)}const wire=new THREE.Mesh(new THREE.TorusGeometry(.25,.02,4,10),bar);for(let i=0;i<20;i++){const w=wire.clone();w.position.set(-4.5+i*.47,2.3,4.6);w.rotation.y=Math.PI/2;J.add(w)}
  // tábla
  const sc2=document.createElement('canvas');sc2.width=512;sc2.height=128;const sx=sc2.getContext('2d');sx.fillStyle='#1f2937';sx.fillRect(0,0,512,128);sx.fillStyle='#facc15';sx.font='bold 54px Impact,Arial';sx.textAlign='center';sx.textBaseline='middle';sx.fillText('KÖZPÉNZ-FOGDA',256,64);
  const sign=new THREE.Mesh(new THREE.PlaneGeometry(5,1.25),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc2)}));sign.position.set(-.5,4.4,3.03);J.add(sign);
  // a rab (narancs overál) a rács mögött
  const man=null;let prisoner=null;
  if(!man){prisoner=new THREE.Group();const o=M(0xf97316);B(.7,1,.4,o,0,1.3,0,prisoner);B(.5,.5,.5,M(0xf1c27d),0,2.1,0,prisoner);B(.55,.16,.55,M(0x3f2a14),0,2.38,0,prisoner);B(.08,.08,.02,M(0x111111),-.12,2.15,.26,prisoner);B(.08,.08,.02,M(0x111111),.12,2.15,.26,prisoner);B(.22,.1,.02,M(0x7f1d1d),0,1.98,.26,prisoner);B(.72,.08,.42,M(0x111111),0,1.6,0,prisoner);B(.72,.08,.42,M(0x111111),0,1.2,0,prisoner);[-1,1].forEach(s=>{B(.2,.8,.25,o,s*.2,.45,0,prisoner);B(.18,.7,.2,o,s*.45,1.4,.15,prisoner)})}else prisoner=man;
  prisoner.position.set(1.5,0,2.4);J.add(prisoner);
  J.position.set(15,0,-25);J.rotation.y=-.15;J.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});sc.add(J);
  // beszédbuborék (HTML), a rab feje fölé vetítve
  const bub=document.createElement('div');bub.style.cssText='position:fixed;z-index:3;pointer-events:none;max-width:240px;padding:8px 12px;border-radius:14px;background:#fff;color:#111;font:800 14px Rajdhani,Arial;box-shadow:0 6px 18px #0007;transform:translate(-50%,-100%);opacity:0;transition:opacity .3s;text-align:center';
  bub.innerHTML='';const tail=document.createElement('div');document.body.appendChild(bub);
  const LINES=['Megint beraktak! Pedig csak szállítani jöttem!','Engedjetek ki, a furgon parkolójegye lejár!','Ez egy félreértés! Én csak a SZÁLLÍTÓ vagyok!','Ki zárta be a kaput?! Ez nem volt a szerződésben!','Hozzatok egy reszelőt… vagy legalább egy pogácsát!',
   'Hé, Vezér! Szólj már egy jó szót az érdekemben!','Ez a cella kisebb, mint a raktér!','Holnap úgyis kint vagyok… mint mindig!','Csak egy telefont kérek! A furgonom egyedül van!','Itt még wifi sincs! Ez embertelen!','Megint én fizetem a rezsit itt bent is?!'];
  let next=2,show=0,li=0;const v=new THREE.Vector3();
  fx.push(t=>{prisoner.position.x=1.5+Math.sin(t*.8)*.5;prisoner.rotation.y=Math.sin(t*1.7)*.3;
   const lb=document.getElementById('lb');const vis=lb&&lb.classList.contains('on')&&!document.querySelector('#vs.on,#vs2.on,#vlt.on,#pets.on,#outf.on');
   if(t>next){li=(li+1+Math.floor(Math.random()*3))%LINES.length;bub.textContent='🗯️ '+LINES[li];show=t+4.2;next=t+7+Math.random()*4}
   prisoner.updateMatrixWorld();v.set(0,2.9,0).applyMatrix4(prisoner.matrixWorld).project(L.cam);const onS=v.z<1&&Math.abs(v.x)<1&&Math.abs(v.y)<1;
   const _o=(vis&&onS&&t<show)?'1':'0';if(_o==='1'){const _k=Math.round((v.x+1)/2*innerWidth)+','+Math.round((1-v.y)/2*innerHeight);if(bub._k!==_k){bub._k=_k;const p=_k.split(',');bub.style.left=p[0]+'px';bub.style.top=p[1]+'px'}}if(bub.style.opacity!==_o)bub.style.opacity=_o})}
}
let done=false;const iv=setInterval(()=>{const L=window.LB3D;if(!done&&L&&L.sc&&L.fx&&L.cam){done=true;clearInterval(iv);try{build(L)}catch(e){console.error('lobbyplus: '+e.stack)}}},400);
})();
