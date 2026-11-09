// ===== ÁLLATOK: 10 kutyafajta + 100 kiegészítő (öltöztetés), saját fül a lobbyban =====
(function(){
const KEY='k3pets';const st0={breed:'vizsla',breeds:{vizsla:1},own:{},eq:{}};
let P;try{P=Object.assign({},st0,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){P=Object.assign({},st0)}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}};
const zs=()=>window.BR?BR.zs|0:0,payZ=n=>{BR.zs-=n;try{st.s('k3br',BR)}catch(e){}};
// ---------- FAJTÁK ----------
const BREEDS=[
 {id:'vizsla',n:'Magyar Vizsla',p:0,c:0xc0702f,c2:0xa85a22,nose:0x7a3b1b,sz:1,len:1.15,leg:1,ear:'flop',tail:'thin',desc:'Hűséges, gyors, igazi hazafi.'},
 {id:'puli',n:'Puli',p:400,c:0x18181b,c2:0x27272a,nose:0x111,sz:.85,len:.95,leg:.75,ear:'hide',tail:'curl',fur:'cord',desc:'Rasztás pásztor – sosem fésülködik.'},
 {id:'komondor',n:'Komondor',p:600,c:0xf5f0e6,c2:0xe7e0d0,nose:0x222,sz:1.25,len:1.1,leg:.85,ear:'hide',tail:'fluffy',fur:'cord',desc:'Gyapjúhegy, ami ugat.'},
 {id:'corgi',n:'Corgi',p:500,c:0xe08a3c,c2:0xffffff,nose:0x111,sz:.8,len:1.15,leg:.5,ear:'up',tail:'stub',belly:1,desc:'Királyi rövidláb.'},
 {id:'husky',n:'Husky',p:700,c:0x6b7280,c2:0xffffff,nose:0x111,sz:1.1,len:1.1,leg:1,ear:'up',tail:'curlFluffy',belly:1,mask:1,eye:0x60a5fa,desc:'Kék szemű drámakirály.'},
 {id:'tacsko',n:'Tacskó',p:350,c:0x7c2d12,c2:0x5a200c,nose:0x111,sz:.75,len:1.6,leg:.45,ear:'long',tail:'thin',desc:'Kolbászkutya, hosszú távra.'},
 {id:'labrador',n:'Arany Labrador',p:450,c:0xe9c46a,c2:0xdcb257,nose:0x3b2414,sz:1.1,len:1.15,leg:.95,ear:'flop',tail:'otter',desc:'Mindenkit szeret, főleg a kaját.'},
 {id:'dalmata',n:'Dalmata',p:650,c:0xffffff,c2:0x111111,nose:0x111,sz:1.05,len:1.15,leg:1.05,ear:'flop',tail:'thin',spots:1,desc:'101 pötty, 0 közpénz.'},
 {id:'shiba',n:'Shiba Inu',p:800,c:0xd97706,c2:0xfff7ed,nose:0x111,sz:.9,len:1,leg:.85,ear:'up',tail:'curl',belly:1,mask:1,desc:'Much wow. Very kutya.'},
 {id:'uszkar',n:'Királyi Uszkár',p:900,c:0xf9a8d4,c2:0xf472b6,nose:0x111,sz:1,len:1,leg:1.15,ear:'pom',tail:'pom',fur:'poodle',desc:'Szalonképes, rózsaszín luxus.'}];
const BY=Object.fromEntries(BREEDS.map(b=>[b.id,b]));
// ---------- KIEGÉSZÍTŐK (20 alap × 5 szín = 100) ----------
const COLS=[['Arany',0xfacc15],['Piros',0xef4444],['Kék',0x3b82f6],['Zöld',0x22c55e],['Fekete',0x111827]];
const BASES=[
 ['hat','cap','Baseball sapka',120],['hat','top','Cilinder',260],['hat','crown','Korona',600],['hat','beanie','Kötött sapka',90],['hat','cowboy','Cowboy kalap',220],['hat','party','Bulisüveg',80],['hat','helmet','Építő sisak',150],
 ['eyes','sun','Napszemüveg',140],['eyes','round','Kerek szemüveg',110],['eyes','visor','Cyber-vizor',320],
 ['neck','collar','Nyakörv',60],['neck','bow','Csokornyakkendő',100],['neck','chain','Aranylánc',450],['neck','scarf','Sál',130],
 ['feet','shoes','Cipő',200],['feet','boots','Bakancs',260],['feet','sneak','Sportcipő',300],
 ['back','vest','Mellény',180],['back','cape','Szuperhős-köpeny',380],['back','bag','Hátizsák',240]];
const ITEMS=[];BASES.forEach(([slot,base,name,price])=>COLS.forEach(([cn,c],i)=>ITEMS.push({id:base+'_'+i,slot,base,c,n:cn+' '+name,price:Math.round(price*(i===0?1.8:i===4?1.3:1)),rar:i===0?4:i===4?3:i%2?1:2})));
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i]));
const SLOTN={hat:'🎩 Fejfedő',eyes:'🕶️ Szemüveg',neck:'🎀 Nyak',feet:'👟 Cipő',back:'🦸 Hát'};
const RARC=['#b0b8c4','#4ade80','#60a5fa','#c084fc','#fbbf24'];
// ---------- 3D KUTYA ----------
let FUR=null;function furTex(){if(FUR)return FUR;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,128,128);
 for(let i=0;i<2600;i++){const v=200+Math.random()*55|0;x.strokeStyle='rgb('+v+','+v+','+v+')';x.lineWidth=1;const px=Math.random()*128,py=Math.random()*128;x.beginPath();x.moveTo(px,py);x.lineTo(px+(Math.random()-.5)*3,py+3+Math.random()*4);x.stroke()}
 FUR=new THREE.CanvasTexture(c);FUR.wrapS=FUR.wrapT=THREE.RepeatWrapping;FUR.repeat.set(2,2);return FUR}
const MC={};const mt=(c,o)=>{const k=c+JSON.stringify(o||{});if(MC[k])return MC[k];const base={color:c,roughness:.85,metalness:0};if(!o||(!o.metalness&&!o.emissive&&!o.transparent))base.map=furTex();return MC[k]=new THREE.MeshStandardMaterial(Object.assign(base,o||{}))};
function buildDog(bid,eq){const b=BY[bid]||BREEDS[0],g=new THREE.Group(),root=new THREE.Group();g.add(root);
 const Bx=(w,h,d,c,x,y,z,par,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c,o));m.position.set(x,y,z);(par||root).add(m);return m};
 const L=b.len,LG=.42*b.leg,bodyY=LG+.32;
 // test
 const body=Bx(.56,.5,.95*L,b.c,0,bodyY,0);if(b.belly)Bx(.5,.12,.8*L,b.c2,0,bodyY-.24,0);
 if(b.spots)for(let i=0;i<14;i++){const s=Bx(.1,.1,.1,b.c2,(Math.random()<.5?-1:1)*.285,bodyY+(Math.random()-.5)*.36,(Math.random()-.5)*.85*L);s.scale.set(.3,1,1)}
 if(b.fur==='cord'){for(let i=0;i<70;i++){const x=(Math.random()-.5)*.62,z=(Math.random()-.5)*1*L,len=.25+Math.random()*.35;Bx(.07,len,.07,i%3?b.c:b.c2,x,bodyY-.12-len/2+.25,z)}}
 if(b.fur==='poodle'){[[0,bodyY+.05,.3*L,.42],[0,bodyY+.05,-.3*L,.36]].forEach(([x,y,z,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,12,10),mt(b.c2,{roughness:1}));s.position.set(x,y,z);root.add(s)})}
 // lábak
 const legs=[];[[.18,.36*L],[-.18,.36*L],[.18,-.36*L],[-.18,-.36*L]].forEach(([x,z])=>{const lg=new THREE.Group();lg.position.set(x,LG,z);root.add(lg);Bx(.15,LG,.15,b.c,0,-LG/2,0,lg);Bx(.17,.08,.2,b.belly?b.c2:b.c,0,-LG+.04,.02,lg);
  if(b.fur==='poodle'){const p=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),mt(b.c2));p.position.y=-LG+.12;lg.add(p)}legs.push(lg)});
 // fej
 const head=new THREE.Group();head.position.set(0,bodyY+.33,.5*L+.12);root.add(head);
 Bx(.46,.42,.42,b.c,0,0,0,head);const snout=Bx(.26,.2,.26,b.mask?b.c2:b.c,0,-.08,.3,head);Bx(.11,.08,.06,b.nose,0,-.02,.44,head,{roughness:.3});Bx(.16,.04,.05,0x7f1d1d,0,-.17,.4,head);
 if(b.mask)Bx(.3,.16,.02,b.c2,0,-.04,.215,head);
 const eyeC=b.eye||0x1a1a1a;[-1,1].forEach(s=>{Bx(.1,.1,.03,0xffffff,s*.12,.07,.215,head);Bx(.06,.07,.03,eyeC,s*.12,.06,.225,head,{roughness:.2});Bx(.025,.025,.02,0xffffff,s*.12+.015,.08,.24,head)});
 if(b.fur==='cord')for(let i=0;i<22;i++){const len=.18+Math.random()*.25;Bx(.06,len,.06,i%3?b.c:b.c2,(Math.random()-.5)*.5,.2-len/2+.12,(Math.random()-.5)*.4+.05,head)}
 if(b.fur==='poodle'){const t=new THREE.Mesh(new THREE.SphereGeometry(.24,12,10),mt(b.c2,{roughness:1}));t.position.set(0,.26,0);head.add(t)}
 // fülek
 [-1,1].forEach(s=>{if(b.ear==='up'){const e=new THREE.Mesh(new THREE.ConeGeometry(.1,.24,4),mt(b.c));e.position.set(s*.15,.31,-.02);e.rotation.y=Math.PI/4;head.add(e);const ei=new THREE.Mesh(new THREE.ConeGeometry(.055,.15,4),mt(0xf9a8a8));ei.position.set(s*.15,.29,.02);ei.rotation.y=Math.PI/4;head.add(ei)}
  else if(b.ear==='flop'){const e=Bx(.08,.28,.18,b.c2,s*.26,-.03,-.02,head);e.rotation.z=s*.18}
  else if(b.ear==='long'){const e=Bx(.06,.4,.2,b.c2,s*.25,-.12,0,head);e.rotation.z=s*.1}
  else if(b.ear==='pom'){const e=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),mt(b.c2,{roughness:1}));e.position.set(s*.26,-.08,0);head.add(e)}});
 // farok
 const tail=new THREE.Group();tail.position.set(0,bodyY+.15,-.47*L);tail.userData.tail=true;g.add(tail);
 if(b.tail==='curl'||b.tail==='curlFluffy'){const t=new THREE.Mesh(new THREE.TorusGeometry(.13,b.tail==='curlFluffy'?.08:.05,8,14,Math.PI*1.5),mt(b.tail==='curlFluffy'?b.c2:b.c));t.rotation.y=Math.PI/2;t.position.y=.14;tail.add(t)}
 else if(b.tail==='stub')Bx(.12,.12,.1,b.c,0,0,-.04,tail);
 else if(b.tail==='pom'){Bx(.05,.3,.05,b.c,0,.15,-.05,tail).rotation.x=-.5;const p=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),mt(b.c2));p.position.set(0,.3,-.15);tail.add(p)}
 else{const t=Bx(b.tail==='otter'?.1:.06,.06,.45,b.tail==='fluffy'?b.c2:b.c,0,.12,-.2,tail);t.rotation.x=.6;if(b.tail==='fluffy')t.scale.set(2,2,1)}
 // kiegészítők
 const A={head,root,legs,bodyY,L};let items=null;if(eq==='ALL'){items={};ITEMS.forEach(it=>{const bef=new Set();g.traverse(o=>bef.add(o));try{acc(it,A,Bx)}catch(e){}const Ln=[];g.traverse(o=>{if(!bef.has(o))Ln.push(o)});items[it.id]=Ln.filter(o=>!Ln.includes(o.parent));items[it.id].forEach(o=>o.visible=false)})}else Object.values(eq||{}).forEach(id=>{const it=IT[id];if(it)try{acc(it,A,Bx)}catch(e){}});
 g.traverse(o=>{if(o.isMesh){o.castShadow=true}});g.scale.setScalar(b.sz);g.userData={legs,head,breed:b.id,items};return g}
function showEq(d,eq){const want=new Set(Object.values(eq||{}));Object.entries(d.userData.items||{}).forEach(([id,L])=>{const v=want.has(id);L.forEach(o=>o.visible=v)})}
const PV={},LBC={};function pvDog(bid){return PV[bid]||(PV[bid]=buildDog(bid,'ALL'))}
function acc(it,A,Bx){const c=it.c,h=A.head,gold={metalness:.9,roughness:.2};
 const C=(rt,rb,ht,col,x,y,z,par,o,seg)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,ht,seg||16),mt(col,o));m.position.set(x,y,z);par.add(m);return m};
 switch(it.base){
  case'cap':Bx(.48,.12,.44,c,0,.27,0,h);Bx(.4,.03,.22,c,0,.22,.3,h);Bx(.06,.04,.06,0xffffff,0,.34,0,h);break;
  case'top':C(.2,.2,.36,c,0,.42,0,h,{roughness:.4});C(.32,.32,.03,c,0,.24,0,h);C(.205,.205,.06,0xffffff,0,.29,0,h);break;
  case'crown':{C(.22,.22,.14,c,0,.3,0,h,gold);for(let i=0;i<5;i++){const a=i/5*Math.PI*2,s=new THREE.Mesh(new THREE.ConeGeometry(.05,.14,4),mt(c,gold));s.position.set(Math.cos(a)*.19,.43,Math.sin(a)*.19);h.add(s);const j=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),mt([0xef4444,0x3b82f6,0x22c55e][i%3],{metalness:.3,roughness:.1}));j.position.set(Math.cos(a)*.215,.3,Math.sin(a)*.215);h.add(j)}}break;
  case'beanie':{const s=new THREE.Mesh(new THREE.SphereGeometry(.25,14,10,0,Math.PI*2,0,Math.PI/2),mt(c,{roughness:1}));s.position.y=.2;h.add(s);C(.255,.255,.07,0xf8fafc,0,.21,0,h,{roughness:1});const p=new THREE.Mesh(new THREE.SphereGeometry(.07,8,6),mt(0xf8fafc,{roughness:1}));p.position.y=.46;h.add(p)}break;
  case'cowboy':C(.17,.2,.2,c,0,.33,0,h,{roughness:.8});{const r=C(.42,.42,.03,c,0,.23,0,h,{roughness:.8});r.scale.z=.8}C(.205,.205,.04,0x3f2a14,0,.25,0,h);break;
  case'party':{const k=new THREE.Mesh(new THREE.ConeGeometry(.13,.36,14),mt(c));k.position.set(.05,.4,0);k.rotation.z=-.15;h.add(k);const p=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),mt(0xffffff));p.position.set(.08,.6,0);h.add(p)}break;
  case'helmet':{const s=new THREE.Mesh(new THREE.SphereGeometry(.27,16,10,0,Math.PI*2,0,Math.PI/2),mt(c,{roughness:.3}));s.position.y=.18;h.add(s);Bx(.06,.05,.5,c,0,.43,0,h);C(.3,.3,.03,c,0,.19,.04,h)}break;
  case'sun':[-1,1].forEach(s=>Bx(.15,.1,.03,0x111111,s*.12,.07,.235,h,{roughness:.05,metalness:.6}));Bx(.46,.03,.03,c,0,.1,.235,h,gold);break;
  case'round':[-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.07,.015,6,16),mt(c,gold));r.position.set(s*.12,.07,.24);h.add(r)});Bx(.08,.015,.015,c,0,.08,.24,h,gold);break;
  case'visor':Bx(.48,.1,.04,c,0,.07,.235,h,{emissive:c,emissiveIntensity:.8,transparent:true,opacity:.85});break;
  case'collar':{const t=new THREE.Mesh(new THREE.TorusGeometry(.21,.04,8,18),mt(c));t.rotation.x=Math.PI/2;t.position.set(0,-.2,-.05);h.add(t);const tag=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.015,12),mt(0xfacc15,gold));tag.rotation.x=Math.PI/2;tag.position.set(0,-.27,.17);h.add(tag)}break;
  case'bow':Bx(.07,.07,.05,c,0,-.22,.2,h);[-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.ConeGeometry(.08,.14,4),mt(c));w.rotation.z=s*Math.PI/2;w.position.set(s*.09,-.22,.2);h.add(w)});break;
  case'chain':{const t=new THREE.Mesh(new THREE.TorusGeometry(.23,.025,6,22),mt(0xfacc15,gold));t.rotation.x=Math.PI/2.3;t.position.set(0,-.25,0);h.add(t);const m=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.02,6),mt(c,gold));m.rotation.x=Math.PI/2;m.position.set(0,-.36,.2);h.add(m)}break;
  case'scarf':{const t=new THREE.Mesh(new THREE.TorusGeometry(.22,.07,8,18),mt(c,{roughness:1}));t.rotation.x=Math.PI/2;t.position.set(0,-.22,-.05);h.add(t);Bx(.12,.3,.04,c,.1,-.35,.17,h,{roughness:1})}break;
  case'shoes':case'boots':case'sneak':A.legs.forEach(lg=>{const LG=-lg.children[0].geometry.parameters.height;const tall=it.base==='boots'?.2:.1;Bx(.2,tall,.26,c,0,LG+tall/2,.03,lg,{roughness:.5});
   if(it.base==='sneak'){Bx(.21,.04,.27,0xffffff,0,LG+.02,.03,lg);Bx(.02,.04,.12,0xffffff,.105,LG+.08,.04,lg)}if(it.base==='shoes')Bx(.21,.02,.1,0x111111,0,LG+.11,.1,lg)});break;
  case'vest':Bx(.6,.36,.62*A.L,c,0,A.bodyY+.04,.05,A.root,{roughness:.9});[0,1,2].forEach(i=>Bx(.03,.04,.02,0xfacc15,.305,A.bodyY+.1-i*.1,.2,A.root,gold));break;
  case'cape':{const cp=Bx(.66,.04,.95*A.L,c,0,A.bodyY+.27,-.1,A.root,{roughness:.6});cp.rotation.x=-.08;Bx(.68,.06,.06,0xfacc15,0,A.bodyY+.27,.36*A.L,A.root,gold)}break;
  case'bag':Bx(.4,.24,.32,c,0,A.bodyY+.36,-.05,A.root,{roughness:.8});Bx(.3,.12,.04,c,0,A.bodyY+.33,.13,A.root);Bx(.62,.04,.06,0x111827,0,A.bodyY+.2,.05,A.root);break}}
window.buildPetDog=()=>buildDog(P.breed,P.eq);
// ---------- lobby kutya csere ----------
let wagHooked=false;
function refreshLobby(){const L=window.LB3D;if(!L||!L.sc)return;const old=L.dog;if(old&&old.userData.pet&&old.userData.pet.userData.breed===P.breed&&old.userData.pet.userData.items){showEq(old.userData.pet,P.eq);return}let d=LBC[P.breed];if(!d){d=LBC[P.breed]=buildDog(P.breed,'ALL');d.scale.multiplyScalar(1.15);d.position.y=-.3}showEq(d,P.eq);
 const w=new THREE.Group();w.add(d);w.userData.pet=d;if(old){w.position.copy(old.position);w.rotation.copy(old.rotation);L.sc.remove(old)}else{w.position.set(2,.3,1.2);w.rotation.y=-2.2}L.sc.add(w);L.dog=w;
 if(!wagHooked&&L.fx){wagHooked=true;L.fx.push(t=>{const dd=L.dog&&L.dog.userData.pet;if(!dd)return;dd.children.forEach(c=>{if(c.userData.tail)c.rotation.y=Math.sin(t*10)*.5});dd.userData.head.rotation.y=Math.sin(t*.7)*.25})}}
let tries=0;const iv=setInterval(()=>{if(window.LB3D&&LB3D.sc){clearInterval(iv);refreshLobby()}else if(++tries>120)clearInterval(iv)},500);
// ---------- PANEL ----------
const css=document.createElement('style');css.textContent=`#pets{position:fixed;inset:0;z-index:11;display:none;font-family:Rajdhani,Arial;color:#fff;background:radial-gradient(1100px 600px at 30% 0%,#14532d 0%,#06140c 55%,#020604 100%)}
#pets.on{display:flex;flex-direction:column}#ptTop{display:flex;align-items:center;gap:12px;padding:12px 18px}#ptTop .t{font:30px 'Luckiest Guy',Impact;color:#86efac;text-shadow:0 3px 0 #000}
#ptBal{margin-left:auto;font:22px 'Luckiest Guy',Impact;color:#facc15;background:#0008;padding:6px 14px;border-radius:12px}#ptX{border:0;border-radius:10px;width:44px;height:44px;background:#ef4444;color:#fff;font-size:22px;cursor:pointer}
#ptBody{flex:1;display:grid;grid-template-columns:minmax(300px,40%) 1fr;gap:16px;padding:0 18px 18px;min-height:0}
#ptView{position:relative;border-radius:20px;background:radial-gradient(circle at 50% 70%,#1f6f43,#0b2a18);border:1px solid #ffffff1f;overflow:hidden;min-height:300px}#ptView canvas{width:100%!important;height:100%!important;display:block}
#ptName{position:absolute;left:16px;top:12px;font:28px 'Luckiest Guy',Impact;text-shadow:0 2px 0 #000}#ptDesc{position:absolute;left:16px;top:50px;color:#bbf7d0;font-weight:700}
#ptEq{position:absolute;left:12px;right:12px;bottom:12px;display:flex;gap:6px;flex-wrap:wrap}#ptEq span{padding:4px 9px;border-radius:9px;background:#0009;font-weight:700;font-size:13px;cursor:pointer}
#ptSide{display:flex;flex-direction:column;min-height:0}#ptTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}#ptTabs button{padding:8px 12px;border-radius:10px;border:1px solid #ffffff22;background:#0f2a1b;color:#fff;font:700 15px Rajdhani,Arial;cursor:pointer}#ptTabs button.on{background:#22c55e;color:#04220f}
#ptGrid{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;align-content:start;padding-right:4px}
.ptC{position:relative;padding:10px;border-radius:14px;background:#0b1f14;border:2px solid #1f3a2a;cursor:pointer;transition:.12s;min-height:108px}.ptC:hover{transform:translateY(-2px);filter:brightness(1.2)}.ptC.eq{box-shadow:0 0 0 3px #facc15}
.ptC .sw{width:100%;height:44px;border-radius:9px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:26px}.ptC b{display:block;font-size:14px;line-height:1.1}.ptC i{font-style:normal;font-size:13px;font-weight:800}
.ptC .tag{position:absolute;top:6px;right:8px;font-size:11px;font-weight:800;padding:2px 6px;border-radius:6px;background:#000a}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='pets';D.innerHTML='<div id="ptTop"><span class="t">🐕 ÁLLATOK</span><span style="color:#94a3b8;font-weight:700">10 kutyafajta · 100 kiegészítő · húzd a kutyát a forgatáshoz</span><span id="ptBal"></span><button id="ptX">✕</button></div><div id="ptBody"><div id="ptView"><div id="ptName"></div><div id="ptDesc"></div><div id="ptEq"></div></div><div id="ptSide"><div id="ptTabs"></div><div id="ptGrid"></div></div></div>';document.body.appendChild(D);
const $$=i=>document.getElementById(i);let tab='breeds',pr=null,ps,pc,pd=null,rotY=.6,drag=null,raf=0;
function initView(){if(pr)return;pr=new THREE.WebGLRenderer({antialias:true,alpha:true});pr.setPixelRatio(Math.min(2,devicePixelRatio));pr.shadowMap.enabled=true;$$('ptView').prepend(pr.domElement);
 ps=new THREE.Scene();pc=new THREE.PerspectiveCamera(35,1,.1,50);pc.position.set(0,1.7,5.6);pc.lookAt(0,.6,0);
 ps.add(new THREE.HemisphereLight(0xffffff,0x335533,.9));const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(2,4,3);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);ps.add(dl);const rim=new THREE.DirectionalLight(0x86efac,.6);rim.position.set(-3,2,-3);ps.add(rim);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(1.4,40),new THREE.MeshStandardMaterial({color:0x14532d,roughness:.9}));fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;ps.add(fl);
 const cv=pr.domElement;cv.addEventListener('pointerdown',e=>{drag=e.clientX});addEventListener('pointerup',()=>drag=null);addEventListener('pointermove',e=>{if(drag!=null){rotY+=(e.clientX-drag)*.01;drag=e.clientX}})}
function setPreview(bid,eq){const nd=pvDog(bid);if(pd!==nd){if(pd)ps.remove(pd);pd=nd;ps.add(pd)}showEq(pd,eq);const b=BY[bid];$$('ptName').textContent=b.n;$$('ptName').style.color='#'+b.c.toString(16).padStart(6,'0');$$('ptDesc').textContent=b.desc;
 $$('ptEq').innerHTML=Object.entries(P.eq).map(([s,id])=>IT[id]?'<span data-un="'+s+'">'+SLOTN[s].split(' ')[0]+' '+IT[id].n+' ✕</span>':'').join('')}
function loop(){if(!D.classList.contains('on'))return;raf=requestAnimationFrame(loop);const v=$$('ptView'),w=v.clientWidth,h=v.clientHeight;if(pr.domElement.width!==Math.round(w*pr.getPixelRatio())){pr.setSize(w,h,false);pc.aspect=w/h;pc.updateProjectionMatrix()}
 const t=performance.now()/1000;if(pd){pd.rotation.y=rotY+(drag==null?t*.3:0);pd.children.forEach(c=>{if(c.userData.tail)c.rotation.y=Math.sin(t*10)*.5});pd.userData.head.rotation.x=Math.sin(t*1.5)*.06}if(drag==null)rotY+=0;pr.render(ps,pc)}
const sw=c=>'#'+c.toString(16).padStart(6,'0');
const ICON={cap:'🧢',top:'🎩',crown:'👑',beanie:'🧶',cowboy:'🤠',party:'🥳',helmet:'⛑️',sun:'🕶️',round:'👓',visor:'🥽',collar:'⭕',bow:'🎀',chain:'📿',scarf:'🧣',shoes:'👞',boots:'🥾',sneak:'👟',vest:'🦺',cape:'🦸',bag:'🎒'};
function render(){$$('ptBal').textContent='🪙 '+zs().toLocaleString('hu-HU');
 $$('ptTabs').innerHTML=[['breeds','🐕 Fajták'],...Object.entries(SLOTN)].map(([k,n])=>'<button data-tab="'+k+'" class="'+(tab===k?'on':'')+'">'+n+(k==='breeds'?'':' ('+ITEMS.filter(i=>i.slot===k&&P.own[i.id]).length+'/'+ITEMS.filter(i=>i.slot===k).length+')')+'</button>').join('');
 let h='';if(tab==='breeds')BREEDS.forEach(b=>{const own=P.breeds[b.id];h+='<div class="ptC'+(P.breed===b.id?' eq':'')+'" data-b="'+b.id+'"><div class="sw" style="background:linear-gradient(135deg,'+sw(b.c)+','+sw(b.c2)+')">🐕</div><b>'+b.n+'</b><i style="color:'+(own?'#86efac':'#facc15')+'">'+(P.breed===b.id?'✔ KIVÁLASZTVA':own?'Kiválaszt':'🪙 '+b.p)+'</i></div>'});
 else ITEMS.filter(i=>i.slot===tab).forEach(it=>{const own=P.own[it.id],on=P.eq[it.slot]===it.id;h+='<div class="ptC'+(on?' eq':'')+'" data-i="'+it.id+'" style="border-color:'+RARC[it.rar]+'55"><span class="tag" style="color:'+RARC[it.rar]+'">'+['KÖZ','RITKA','EPIK','LEGEND','MÍTIKUS'][it.rar]+'</span><div class="sw" style="background:'+sw(it.c)+'33">'+ICON[it.base]+'</div><b>'+it.n+'</b><i style="color:'+(own?'#86efac':'#facc15')+'">'+(on?'✔ RAJTA':own?'Felad':'🪙 '+it.price)+'</i></div>'});
 $$('ptGrid').innerHTML=h}
let hoverT=null;
D.addEventListener('click',e=>{const t=e.target;if(t.id==='ptX'||t===D)return close();const tb=t.closest('[data-tab]');if(tb){tab=tb.dataset.tab;render();return}
 const un=t.closest('[data-un]');if(un){delete P.eq[un.dataset.un];save();setPreview(P.breed,P.eq);refreshLobby();render();return}
 const bc=t.closest('[data-b]');if(bc){const b=BY[bc.dataset.b];if(!P.breeds[b.id]){if(zs()<b.p){flash('Nincs elég zseton! (🪙 '+b.p+')');return}payZ(b.p);P.breeds[b.id]=1;try{sfx('win')}catch(x){}}P.breed=b.id;save();setPreview(P.breed,P.eq);refreshLobby();render();return}
 const ic=t.closest('[data-i]');if(ic){const it=IT[ic.dataset.i];if(!P.own[it.id]){if(zs()<it.price){flash('Nincs elég zseton! (🪙 '+it.price+')');return}payZ(it.price);P.own[it.id]=1;try{sfx('buy')}catch(x){}}
  if(P.eq[it.slot]===it.id)delete P.eq[it.slot];else P.eq[it.slot]=it.id;save();setPreview(P.breed,P.eq);refreshLobby();render()}});
// próba: rámutatva a kutyán látod
D.addEventListener('mouseover',e=>{const ic=e.target.closest&&e.target.closest('[data-i],[data-b]');if(!ic||!pd)return;clearTimeout(hoverT);if(ic.dataset.i){const it=IT[ic.dataset.i];const eq=Object.assign({},P.eq,{[it.slot]:it.id});setPreview(P.breed,eq)}else setPreview(ic.dataset.b,P.eq)});
D.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('[data-i],[data-b]')){clearTimeout(hoverT);hoverT=setTimeout(()=>setPreview(P.breed,P.eq),120)}});
function flash(m){const b=$$('ptBal');b.textContent=m;b.style.color='#f87171';setTimeout(()=>{b.style.color='';render()},1500)}
function close(){D.classList.remove('on');cancelAnimationFrame(raf)}
window.openPets=function(){if(!window.BR){alert('Előbb jelentkezz be!');return}D.classList.add('on');initView();setPreview(P.breed,P.eq);render();cancelAnimationFrame(raf);loop()};
addEventListener('keydown',e=>{if(e.key==='Escape'&&D.classList.contains('on')){close();e.stopImmediatePropagation()}},true);
window._PETS={BREEDS,ITEMS,P,refreshLobby,BY,save};
// ---------- LOBBY: a kutya a kamerába néz, forgatható, alatta prémium kapcsoló ----------
(function(){let dRot=0,dDrag=null,dDown=0,trick=0;
 const css2=document.createElement('style');css2.textContent=`#pfTog{position:fixed;z-index:9;transform:translate(-50%,0);display:none;align-items:center;gap:10px;padding:7px 10px 7px 14px;border-radius:999px;cursor:pointer;user-select:none;font:15px 'Luckiest Guy',Impact;letter-spacing:.5px;color:#fff7d6;
 background:linear-gradient(135deg,#3b2a05,#7a5a0c 45%,#3b2a05);border:2px solid #facc15;box-shadow:0 0 0 1px #000a,0 6px 20px #000a,0 0 18px #facc1555,inset 0 1px 0 #fff5;text-shadow:0 2px 0 #000}
#pfTog:hover{filter:brightness(1.15)}#pfTog .tr{position:relative;width:52px;height:26px;border-radius:999px;background:#1f1a0a;border:1px solid #facc1588;transition:.25s;box-shadow:inset 0 2px 6px #000}
#pfTog .kn{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#d4d4d8 60%,#71717a);box-shadow:0 2px 4px #000;transition:.25s}
#pfTog.on .tr{background:linear-gradient(90deg,#16a34a,#4ade80);border-color:#bbf7d0}#pfTog.on .kn{left:28px;background:radial-gradient(circle at 35% 30%,#fff,#fde68a 55%,#ca8a04)}
#pfTog .st{min-width:34px;color:#f87171}#pfTog.on .st{color:#4ade80}#pfTog .pr{font:700 11px Rajdhani;background:linear-gradient(90deg,#facc15,#f59e0b);color:#1c1300;border-radius:6px;padding:1px 6px;text-shadow:none}`;document.head.appendChild(css2);
 const tg=document.createElement('div');tg.id='pfTog';tg.innerHTML='🐕 HARCBA VISZEM<span class="tr"><span class="kn"></span></span><span class="st"></span>';document.body.appendChild(tg);
 const upd=()=>{tg.classList.toggle('on',!!P.fight);tg.querySelector('.st').textContent=(P.fight?'IGEN':'NEM')+' · Lv'+(Math.floor(Math.sqrt((P.dxp||0)/3))+1)};upd();
 tg.onclick=()=>{P.fight=!P.fight;save();upd();try{sfx('click')}catch(e){}};
 const on=id=>{const e=document.getElementById(id);return !!(e&&e.classList.contains('on'))};
 const ray=new THREE.Raycaster(),mp=new THREE.Vector2(),v=new THREE.Vector3();
 const iv=setInterval(()=>{const L=window.LB3D;if(!L||!L.r||!L.fx||!L.cam)return;clearInterval(iv);const cv=L.r.domElement;
  cv.addEventListener('pointerdown',e=>{if(!L.dog)return;const r=cv.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mp,L.cam);if(ray.intersectObject(L.dog,true).length){dDrag=e.clientX;dDown=e.clientX;cv.style.cursor='grabbing';e.stopImmediatePropagation()}},true);
  addEventListener('pointermove',e=>{if(dDrag!==null){dRot+=(e.clientX-dDrag)*.012;dDrag=e.clientX}});addEventListener('pointerup',e=>{if(dDrag!==null){if(Math.abs(e.clientX-dDown)<4)trick=performance.now();dDrag=null;cv.style.cursor=''}});
  L.fx.push(()=>{const w=L.dog;if(!w){if(tg.style.display!=='none')tg.style.display='none';return}
   const face=Math.atan2(L.cam.position.x-w.position.x,L.cam.position.z-w.position.z);const tk=Math.min(1,(performance.now()-trick)/900);const tr=trick&&tk<1?tk:0;w.rotation.y=face+dRot+tr*6.283;if(tr)w.position.y+=Math.sin(tr*Math.PI)*1.1;
   const vis=!(typeof run!=='undefined'&&run)&&on('lb')&&!on('pets')&&!on('outf')&&!on('gui');if(!vis){if(tg.style.display!=='none')tg.style.display='none';return}
   v.set(w.position.x,w.position.y,w.position.z).project(L.cam);const r=L.r.domElement.getBoundingClientRect();const _l=Math.round(r.left+(v.x+1)/2*r.width),_t=Math.round(r.top+(1-v.y)/2*r.height+14),_k=_l+','+_t;if(tg._k!==_k){tg._k=_k;tg.style.left=_l+'px';tg.style.top=_t+'px'}if(tg.style.display!=='flex')tg.style.display='flex'})},500)})();
const dogLv=()=>Math.floor(Math.sqrt((P.dxp||0)/3))+1;window._dogLv=dogLv;
// ---------- MECCS: a kutya veled jön és harcol ----------
(function(){const WP=(n,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{post(arguments)}catch(e){console.error('petfight '+n+': '+e)}return r}};
 let DG=null;
 WP('launch',()=>{DG=null;{const t=document.getElementById('pfTog');if(t)t.style.display='none'}const g=typeof G!=='undefined'?G:null;if(!g||!P.fight||typeof scene==='undefined')return;const m=buildDog(P.breed,P.eq);m.scale.multiplyScalar(1.25);m.visible=false;scene.add(m);DG={m,x:g.x,z:g.z,cd:0,tg:null,ph:0,bite:0,on:false}});
 WP('update',a=>{const g=typeof G!=='undefined'?G:null,dt=Math.min(.1,a[0]||.016);if(!DG||!g||g.over)return;const d=DG,m=d.m;
  if(!d.on){if(g.phase==='play'&&g.y<1.5){d.on=true;d.x=g.x-1.5;d.z=g.z-1.5;m.visible=true}else return}
  if(d.tg&&(d.tg.dead||d.tg.hp<=0||Math.hypot(d.tg.x-g.x,d.tg.z-g.z)>(d.force?50:22))){d.tg=null;d.force=0}
  if(!d.tg){let best=null,bd=14;const cx=d.stay?d.x:g.x,cz=d.stay?d.z:g.z;(g.en||[]).forEach(e=>{if(e.dead||e.hp<=0||e.ally)return;const dd=Math.hypot(e.x-cx,e.z-cz);if(dd<bd){bd=dd;best=e}});d.tg=best}
  let tx,tz,stop;if(d.tg){tx=d.tg.x;tz=d.tg.z;stop=1.4+(d.tg.r||1)}else if(d.stay){tx=d.x;tz=d.z;stop=1}else{const a2=g.ang+2.4;tx=g.x+Math.cos(a2)*2.6;tz=g.z+Math.sin(a2)*2.6;stop=.6}
  if(!d.stay&&Math.hypot(g.x-d.x,g.z-d.z)>45){d.x=g.x-2;d.z=g.z-2}
  const dx=tx-d.x,dz=tz-d.z,dist=Math.hypot(dx,dz);
  let moving=false;if(dist>stop){const sp=d.tg?13:(dist>8?12:7),st=Math.min(dist-stop,sp*dt);d.x+=dx/dist*st;d.z+=dz/dist*st;moving=st>.01}
  if(dist>.05)m.rotation.y=Math.atan2(dx,dz);
  d.cd-=dt;if(d.tg&&dist<=stop+.4&&d.cd<=0){d.cd=.7;d.bite=.25;const e=d.tg,dmg=Math.round(24*(1+.12*(dogLv()-1)));e.hp-=dmg;e.fl=.1;if(e.hp<=0&&!e.dead){e.dead=true;kill(e);d.tg=null;d.force=0;const l0=dogLv();P.dxp=(P.dxp||0)+1;save();if(dogLv()>l0)try{say('🐕 A kutyád szintet lépett! Szint '+dogLv()+' (harapás: '+Math.round(24*(1+.12*(dogLv()-1)))+')')}catch(x){}}}
  d.ph+=dt*(moving?16:3);d.bite=Math.max(0,d.bite-dt);(m.userData.legs||[]).forEach((lg,i)=>{lg.rotation.x=moving?Math.sin(d.ph+(i%2?Math.PI:0)+(i>1?Math.PI:0))*.7:0});
  if(m.userData.head)m.userData.head.rotation.x=d.bite>0?-.5:Math.sin(d.ph*.5)*.05;m.children.forEach(c=>{if(c.userData.tail)c.rotation.y=Math.sin(g.t*14)*.6});
  const near=Math.hypot(g.x-d.x,g.z-d.z)<3&&!g.gl&&g.y>0&&g.y<20;m.position.set(d.x,(moving?Math.abs(Math.sin(d.ph))*.12:0)+(near?g.y:0),d.z)});
 window._PETFIGHT=()=>DG})();

// ---------- ELŐTÖLTÉS: minden fajta + kiegészítő előre felépítve és a videókártyára feltöltve ----------
(function(){function warm(bid){initView();const d=pvDog(bid);const all=[].concat(...Object.values(d.userData.items));all.forEach(o=>o.visible=true);const had=pd;if(pd)ps.remove(pd);ps.add(d);const was=D.classList.contains('on');if(!was){D.style.visibility='hidden';D.classList.add('on')}try{const v=$('ptView'),w=v.clientWidth,h=v.clientHeight;if(w&&h){pr.setSize(w,h,false);pc.aspect=w/h;pc.updateProjectionMatrix()}pr.compile(ps,pc);pr.render(ps,pc)}catch(e){}if(!was){D.classList.remove('on');D.style.visibility=''}ps.remove(d);all.forEach(o=>o.visible=false);if(had)ps.add(had)}
 const order=[P.breed].concat(BREEDS.map(b=>b.id).filter(id=>id!==P.breed));let n=0;const idle=window.requestIdleCallback||(f=>setTimeout(f,60));
 function next(){if(!order.length)return;const bid=order.shift();try{warm(bid)}catch(e){console.error(e)}idle(next,{timeout:2000})}
 const iv=setInterval(()=>{n++;if((window.LB3D&&LB3D.sc)||n>30){clearInterval(iv);idle(next,{timeout:3000})}},800)})();
})();
