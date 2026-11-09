// ===== SZEKRÉNY – KIEGÉSZÍTŐK A KARAKTERRE: 8 hely, 28 alap × 5 szín = 140 tárgy, mind egyszerre felvehető =====
(function(){
const KEY='k3outfit';let O;try{O=Object.assign({own:{},eq:{}},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){O={own:{},eq:{}}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(O))}catch(e){}};
const zs=()=>window.BR?BR.zs|0:0,payZ=n=>{BR.zs-=n;try{st.s('k3br',BR)}catch(e){}};
const COLS=[['Arany',0xfacc15],['Rubin',0xdc2626],['Zafír',0x2563eb],['Smaragd',0x16a34a],['Ónix',0x18181b]];
const SLOTS={hat:'🎩 Fej',face:'😎 Arc',ear:'🎧 Fül',neck:'📿 Nyak',back:'🎒 Hát',hand:'✋ Kéz',feet:'👟 Láb',aura:'✨ Aura'};
const BASES=[
 ['hat','fedora','Fedora',240,'🎩'],['hat','snap','Snapback',150,'🧢'],['hat','viking','Viking sisak',420,'⛑️'],['hat','chef','Séfsapka',180,'👨‍🍳'],['hat','halo','Glória',520,'😇'],['hat','horns','Ördögszarv',380,'😈'],['hat','bunny','Nyuszifül',220,'🐰'],
 ['face','aviator','Pilótaszemüveg',260,'🕶️'],['face','monocle','Monokli',300,'🧐'],['face','stache','Bajusz',120,'🥸'],['face','ski','Síszemüveg',280,'🥽'],['face','bandana','Kendő',160,'🤠'],
 ['ear','phones','Fejhallgató',340,'🎧'],['ear','ring','Fülbevaló',200,'💎'],
 ['neck','medal','Érem',260,'🏅'],['neck','tie','Nyakkendő',140,'👔'],['neck','pearls','Gyöngysor',360,'📿'],
 ['back','jet','Jetpack',700,'🚀'],['back','wings','Angyalszárny',650,'🪽'],['back','guitar','Gitár',420,'🎸'],['back','sword','Kard',480,'⚔️'],
 ['hand','phone','Okostelefon',180,'📱'],['hand','coffee','Kávé',90,'☕'],['hand','bag','Pénzes zsák',500,'💰'],['hand','neon','Neonrúd',380,'🔦'],
 ['feet','kicks','Prémium sneaker',320,'👟'],['feet','gold','Aranycsizma',600,'🥾'],
 ['aura','aura','Aura-gyűrű',800,'✨']];
const ITEMS=[];BASES.forEach(([slot,base,name,price,ic])=>COLS.forEach(([cn,c],i)=>ITEMS.push({id:'o_'+base+'_'+i,slot,base,c,ic,n:cn+' '+name,price:Math.round(price*(i===0?1.8:i===4?1.3:1)),rar:i===0?4:i===4?3:i%2?1:2})));
const IT=Object.fromEntries(ITEMS.map(i=>[i.id,i]));const RARC=['#b0b8c4','#4ade80','#60a5fa','#c084fc','#fbbf24'];
// ---------- modellek ----------
const MC={};const mt=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5,metalness:.1},o||{})))};
const GOLD={metalness:.95,roughness:.2};
function limbs(model){const r={};model.traverse(o=>{if(o.userData&&o.userData.limb)r[o.userData.limb]=o});return r}
function inner(model){let f=null;model.traverse(o=>{if(!f&&o.userData&&o.userData.limb)f=o.parent});return f||model}
function make(it,model){const root=inner(model),lm=limbs(model),c=it.c,G=new THREE.Group();G.userData.outfit=1;root.add(G);
 const Bx=(w,h,d,col,x,y,z,par,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(col,o));m.position.set(x,y,z);(par||G).add(m);return m};
 const Cy=(rt,rb,h,col,x,y,z,par,o,s)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,s||18),mt(col,o));m.position.set(x,y,z);(par||G).add(m);return m};
 const Sp=(r,col,x,y,z,par,o)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,14,10),mt(col,o));m.position.set(x,y,z);(par||G).add(m);return m};
 const attach=(name,fn)=>{const g=new THREE.Group();g.userData.outfit=1;(lm[name]||root).add(g);fn(g)};
 switch(it.base){
  case'fedora':Cy(.3,.33,.28,c,0,2.86,0,G,{roughness:.8});{const b=Cy(.52,.52,.03,c,0,2.73,0,G,{roughness:.8});b.scale.z=.85}Cy(.335,.335,.07,0x111111,0,2.76,0);break;
  case'snap':Bx(.68,.2,.66,c,0,2.8,0);Bx(.6,.04,.32,c,0,2.71,.45);Bx(.08,.05,.08,0xffffff,0,2.92,0);Bx(.3,.1,.02,0xffffff,0,2.82,.335);break;
  case'viking':{const s=new THREE.Mesh(new THREE.SphereGeometry(.38,18,10,0,Math.PI*2,0,Math.PI/2),mt(0x9ca3af,GOLD));s.position.y=2.66;G.add(s);Cy(.385,.385,.08,c,0,2.68,0,G,GOLD);[-1,1].forEach(k=>{const h=new THREE.Mesh(new THREE.ConeGeometry(.08,.42,10),mt(0xfef3c7,{roughness:.6}));h.position.set(k*.42,2.9,0);h.rotation.z=-k*.9;G.add(h)})}break;
  case'chef':Cy(.33,.3,.2,0xffffff,0,2.78,0,G,{roughness:.9});Sp(.36,0xffffff,0,3.02,0,G,{roughness:.9}).scale.y=.7;Cy(.335,.335,.05,c,0,2.72,0);break;
  case'halo':{const t=new THREE.Mesh(new THREE.TorusGeometry(.3,.04,10,30),mt(c,{emissive:c,emissiveIntensity:1.2,metalness:.5}));t.rotation.x=Math.PI/2;t.position.y=3.08;G.add(t);G.userData.spin=t}break;
  case'horns':[-1,1].forEach(k=>{const h=new THREE.Mesh(new THREE.ConeGeometry(.07,.3,10),mt(c,{emissive:c,emissiveIntensity:.3}));h.position.set(k*.2,2.84,.05);h.rotation.z=-k*.35;G.add(h)});break;
  case'bunny':[-1,1].forEach(k=>{const e=Bx(.12,.55,.06,c,k*.14,3.05,0);e.rotation.z=-k*.12;Bx(.07,.4,.02,0xf9a8d4,k*.14,3.05,.035).rotation.z=-k*.12});break;
  case'aviator':[-1,1].forEach(k=>Bx(.2,.13,.03,c,k*.14,2.4,.315,G,{metalness:.8,roughness:.05}));Bx(.62,.025,.025,0xd4af37,0,2.46,.315,G,GOLD);break;
  case'monocle':{const r=new THREE.Mesh(new THREE.TorusGeometry(.08,.015,8,20),mt(c,GOLD));r.position.set(.14,2.4,.32);G.add(r);Bx(.01,.3,.01,c,.2,2.22,.32,G,GOLD)}break;
  case'stache':[-1,1].forEach(k=>{const m=Bx(.16,.05,.04,c,k*.08,2.2,.315);m.rotation.z=k*.25});break;
  case'ski':Bx(.6,.16,.04,c,0,2.42,.32,G,{metalness:.6,roughness:.05,emissive:c,emissiveIntensity:.25});Bx(.64,.05,.62,0x111111,0,2.42,0);break;
  case'bandana':Bx(.64,.22,.05,c,0,2.18,.31,G,{roughness:.9});{const t=new THREE.Mesh(new THREE.ConeGeometry(.2,.2,4),mt(c,{roughness:.9}));t.position.set(0,2.03,.3);t.rotation.set(Math.PI,Math.PI/4,0);G.add(t)}break;
  case'phones':{const t=new THREE.Mesh(new THREE.TorusGeometry(.36,.03,8,24,Math.PI),mt(c));t.position.y=2.42;G.add(t);[-1,1].forEach(k=>Cy(.12,.12,.08,c,k*.36,2.36,0,G).rotation.z=Math.PI/2)}break;
  case'ring':[-1,1].forEach(k=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.04,.012,6,14),mt(c,GOLD));r.position.set(k*.36,2.18,0);r.rotation.y=Math.PI/2;G.add(r)});break;
  case'medal':Bx(.06,.32,.02,0xdc2626,-.08,1.78,.235).rotation.z=.25;Bx(.06,.32,.02,0x2563eb,.08,1.78,.235).rotation.z=-.25;Cy(.1,.1,.03,c,0,1.6,.25,G,GOLD).rotation.x=Math.PI/2;break;
  case'tie':Bx(.12,.5,.02,c,0,1.6,.25);Bx(.14,.1,.03,c,0,1.86,.25);break;
  case'pearls':for(let i=0;i<14;i++){const a=Math.PI*(i/13);Sp(.04,c===0x18181b?0x111111:0xf8fafc,Math.cos(a)*.28,1.9-Math.sin(a)*.18,.22,G,{roughness:.15,metalness:.3})}break;
  case'jet':[-1,1].forEach(k=>{Cy(.13,.13,.6,c,k*.16,1.45,-.36,G,{metalness:.7,roughness:.3});const f=new THREE.Mesh(new THREE.ConeGeometry(.1,.3,10),new THREE.MeshBasicMaterial({color:0xff9a1f,transparent:true,opacity:.85}));f.position.set(k*.16,1,-.36);f.rotation.x=Math.PI;G.add(f);(G.userData.fl=G.userData.fl||[]).push(f)});Bx(.5,.3,.12,0x374151,0,1.5,-.27);break;
  case'wings':[-1,1].forEach(k=>{const w=new THREE.Group();w.position.set(k*.12,1.6,-.28);G.add(w);for(let i=0;i<5;i++){const f=Bx(.12,.5-i*.06,.04,i%2?0xffffff:c,k*(.15+i*.14),-.05-i*.03,0,w,{roughness:.8});f.rotation.z=k*(.3+i*.12)}(G.userData.wing=G.userData.wing||[]).push(w)});break;
  case'guitar':{const g=new THREE.Group();g.position.set(0,1.4,-.3);g.rotation.z=.6;G.add(g);const b=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.1,20),mt(c,{roughness:.3}));b.rotation.x=Math.PI/2;b.position.y=-.2;g.add(b);Bx(.08,.8,.06,0x5b3a1e,0,.35,0,g);Bx(.14,.16,.06,0x111111,0,.8,0,g)}break;
  case'sword':{const s=new THREE.Group();s.position.set(0,1.45,-.3);s.rotation.z=-.7;G.add(s);Bx(.07,1.1,.03,0xe5e7eb,0,.35,0,s,{metalness:1,roughness:.1});Bx(.3,.05,.06,c,0,-.22,0,s,GOLD);Bx(.06,.25,.06,0x3f2a14,0,-.37,0,s)}break;
  case'phone':attach('rarm',g=>{Bx(.12,.22,.02,0x111111,0,-.98,.14,g);Bx(.1,.19,.005,c,0,-.98,.152,g,{emissive:c,emissiveIntensity:.6})});break;
  case'coffee':attach('rarm',g=>{Cy(.07,.06,.18,c,0,-1,.14,g,{roughness:.8});Cy(.075,.075,.03,0xffffff,0,-.9,.14,g)});break;
  case'bag':attach('larm',g=>{Sp(.2,c===0x18181b?0x6b4a2b:0xa16207,0,-1.15,.05,g,{roughness:.9});Cy(.06,.08,.1,0x3f2a14,0,-.95,.05,g);const t=document.createElement('canvas');Bx(.12,.12,.01,0x16a34a,0,-1.15,.25,g)});break;
  case'neon':attach('rarm',g=>{Cy(.035,.035,1,c,0,-1,.25,g,{emissive:c,emissiveIntensity:2}).rotation.x=Math.PI/2;Cy(.045,.045,.2,0x111111,0,-1,.0,g).rotation.x=Math.PI/2});break;
  case'kicks':['lleg','rleg'].forEach(n=>attach(n,g=>{Bx(.32,.2,.47,c,0,-.84,.06,g,{roughness:.4});Bx(.33,.07,.48,0xffffff,0,-.93,.06,g);Bx(.02,.08,.18,0xffffff,.165,-.8,.06,g)}));break;
  case'gold':['lleg','rleg'].forEach(n=>attach(n,g=>{Bx(.32,.42,.46,c,0,-.74,.05,g,GOLD);Bx(.33,.06,.47,0x111111,0,-.93,.05,g)}));break;
  case'aura':{const t=new THREE.Mesh(new THREE.TorusGeometry(.7,.04,8,40),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.75}));t.rotation.x=Math.PI/2;t.position.y=.1;G.add(t);const t2=t.clone();t2.scale.setScalar(.75);t2.position.y=.9;G.add(t2);G.userData.aura=[t,t2]}break}
 G.traverse(o=>{if(o.isMesh)o.castShadow=true});return G}
function applyOutfit(model,eq){if(!model)return;const rm=[];model.traverse(o=>{if(o.userData&&o.userData.outfit)rm.push(o)});rm.forEach(o=>o.parent&&o.parent.remove(o));
 Object.values(eq||O.eq).forEach(id=>{const it=IT[id];if(it)try{make(it,model)}catch(e){console.error('outfit '+id+': '+e.stack)}});model.userData.outfitSig=JSON.stringify(eq||O.eq)}
function animate(model,t){if(!model)return;if(model.userData.animSig!==model.userData.outfitSig){model.userData.animSig=model.userData.outfitSig;const l=[];model.traverse(o=>{const u=o.userData;if(u&&u.outfit&&(u.spin||u.fl||u.wing||u.aura))l.push(o)});model.userData.anim=l}(model.userData.anim||[]).forEach(o=>{const u=o.userData;if(u.spin)u.spin.rotation.z=t;if(u.fl)u.fl.forEach((f,i)=>f.scale.set(1,.8+Math.sin(t*25+i)*.3,1));if(u.wing)u.wing.forEach((w,i)=>w.rotation.y=(i?-1:1)*Math.sin(t*3)*.25);if(u.aura)u.aura.forEach((a,i)=>{a.rotation.z=t*(i?-1.5:1);a.position.y=(i?.9:.1)+Math.sin(t*2+i)*.1})})}
window.applyOutfit=applyOutfit;
// lobby és játék: automatikusan felöltözteti a karaktered
setInterval(()=>{const sig=JSON.stringify(O.eq);const L=window.LB3D;if(L&&L.me&&L.me.userData.outfitSig!==sig)applyOutfit(L.me);if(window.G&&G.pm&&G.pm.userData.outfitSig!==sig)applyOutfit(G.pm)},400);
let t0=0;setTimeout(function loop(){requestAnimationFrame(loop);t0+=.016;const L=window.LB3D;if(L&&L.me)animate(L.me,t0);if(window.G&&G.pm)animate(G.pm,t0);if(D.classList.contains('on')&&pm)animate(pm,t0)},0);
// ---------- PANEL ----------
const css=document.createElement('style');css.textContent=`#outf{position:fixed;inset:0;z-index:13;display:none;font-family:Rajdhani,Arial;color:#fff;background:radial-gradient(1100px 600px at 30% 0%,#3b0764 0%,#12051f 55%,#05020a 100%)}
#outf.on{display:flex;flex-direction:column}#ofTop{display:flex;align-items:center;gap:12px;padding:12px 18px}#ofTop .t{font:30px 'Luckiest Guy',Impact;color:#e9d5ff;text-shadow:0 3px 0 #000}
#ofBal{margin-left:auto;font:22px 'Luckiest Guy',Impact;color:#facc15;background:#0008;padding:6px 14px;border-radius:12px}#ofTop button{border:0;border-radius:10px;height:44px;padding:0 14px;background:#334155;color:#fff;font:700 15px Rajdhani,Arial;cursor:pointer}#ofX{width:44px;background:#ef4444!important;font-size:22px!important}
#ofBody{flex:1;display:grid;grid-template-columns:minmax(300px,38%) 1fr;gap:16px;padding:0 18px 18px;min-height:0}
#ofView{position:relative;border-radius:20px;background:radial-gradient(circle at 50% 75%,#6d28d9,#1e0b3a);border:1px solid #ffffff1f;overflow:hidden;min-height:300px}#ofView canvas{width:100%!important;height:100%!important;display:block}
#ofEq{position:absolute;left:12px;right:12px;bottom:12px;display:flex;gap:6px;flex-wrap:wrap}#ofEq span{padding:4px 9px;border-radius:9px;background:#0009;font-weight:700;font-size:13px;cursor:pointer}
#ofSide{display:flex;flex-direction:column;min-height:0}#ofTabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}#ofTabs button{padding:8px 12px;border-radius:10px;border:1px solid #ffffff22;background:#1e1036;color:#fff;font:700 15px Rajdhani,Arial;cursor:pointer}#ofTabs button.on{background:#a855f7}
#ofGrid{flex:1;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;align-content:start;padding-right:4px}
.ofC{position:relative;padding:10px;border-radius:14px;background:#160a29;border:2px solid #2e1a4d;cursor:pointer;transition:.12s;min-height:108px}.ofC:hover{transform:translateY(-2px);filter:brightness(1.2)}.ofC.eq{box-shadow:0 0 0 3px #facc15}
.ofC .sw{width:100%;height:44px;border-radius:9px;margin-bottom:6px;display:flex;align-items:center;justify-content:center;font-size:26px}.ofC b{display:block;font-size:14px;line-height:1.1}.ofC i{font-style:normal;font-size:13px;font-weight:800}
.ofC .tag{position:absolute;top:6px;right:8px;font-size:11px;font-weight:800;padding:2px 6px;border-radius:6px;background:#000a}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='outf';D.innerHTML='<div id="ofTop"><span class="t">👕 SZEKRÉNY – KIEGÉSZÍTŐK</span><span style="color:#c4b5fd;font-weight:700">8 hely · 140 tárgy · mindet egyszerre viselheted</span><span id="ofBal"></span><button id="ofOff">🧺 Mindet levesz</button><button id="ofX">✕</button></div><div id="ofBody"><div id="ofView"><div id="ofEq"></div></div><div id="ofSide"><div id="ofTabs"></div><div id="ofGrid"></div></div></div>';document.body.appendChild(D);
const $$=i=>document.getElementById(i);let tab='hat',pr,ps,pc,pm=null,rotY=0,drag=null,raf=0,hovT=null;
function initView(){if(pr)return;pr=new THREE.WebGLRenderer({antialias:true,alpha:true});pr.setPixelRatio(Math.min(2,devicePixelRatio));$$('ofView').prepend(pr.domElement);
 ps=new THREE.Scene();pc=new THREE.PerspectiveCamera(32,1,.1,50);pc.position.set(0,1.9,7.2);pc.lookAt(0,1.45,0);ps.add(new THREE.HemisphereLight(0xffffff,0x553377,1));const d=new THREE.DirectionalLight(0xffffff,1.1);d.position.set(2,4,4);ps.add(d);const r=new THREE.DirectionalLight(0xc084fc,.7);r.position.set(-3,2,-3);ps.add(r);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(1.4,40),new THREE.MeshStandardMaterial({color:0x4c1d95,roughness:.8}));fl.rotation.x=-Math.PI/2;ps.add(fl);
 pr.domElement.addEventListener('pointerdown',e=>drag=e.clientX);addEventListener('pointerup',()=>drag=null);addEventListener('pointermove',e=>{if(drag!=null){rotY+=(e.clientX-drag)*.01;drag=e.clientX}})}
let FB=null;function srcModel(){const L=window.LB3D;if(L&&L.me)return L.me;if(!FB){try{FB=person(0xf97316,'🎩',1)}catch(e){FB=new THREE.Group()}}return FB}
const isO=o=>o.userData&&o.userData.outfit;
function buildPM(){const src=srcModel(),m=src.clone(true);m.position.set(0,0,0);m.rotation.set(0,0,0);m.children.filter(c=>c.isSprite).forEach(c=>m.remove(c));const rm=[];m.traverse(o=>{if(isO(o))rm.push(o)});rm.forEach(o=>o.parent&&o.parent.remove(o));
 m.scale.setScalar(1);m.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(m),hh=bb.max.y-bb.min.y||3,k=3/hh;const map={};
 ITEMS.forEach(it=>{const bef=new Set();m.traverse(o=>{if(isO(o))bef.add(o)});try{make(it,m)}catch(e){}const L=[];m.traverse(o=>{if(isO(o)&&!bef.has(o))L.push(o)});map[it.id]=L.filter(o=>!L.includes(o.parent));map[it.id].forEach(o=>o.visible=false)});
 m.scale.setScalar(k);m.position.y=-bb.min.y*k;m.userData.items=map;m.userData.src=src;return m}
function warm(){if(!pm)return;const all=[].concat(...Object.values(pm.userData.items));all.forEach(o=>o.visible=true);const was=D.classList.contains('on');if(!was){D.style.visibility='hidden';D.classList.add('on')}try{const v=$('ofView'),w=v.clientWidth,h=v.clientHeight;if(w&&h){pr.setSize(w,h,false);pc.aspect=w/h;pc.updateProjectionMatrix()}pr.compile(ps,pc);pr.render(ps,pc)}catch(e){}if(!was){D.classList.remove('on');D.style.visibility=''}all.forEach(o=>o.visible=false);preview(O.eq)}
function ensurePM(){if(!pm||pm.userData.src!==srcModel()){if(pm)ps.remove(pm);pm=buildPM();ps.add(pm);warm()}}
function preview(eq){ensurePM();const want=new Set(Object.values(eq||{}));Object.entries(pm.userData.items).forEach(([id,L])=>{const v=want.has(id);L.forEach(o=>o.visible=v)});pm.userData.outfitSig=JSON.stringify(eq);
 $$('ofEq').innerHTML=Object.entries(O.eq).map(([s,id])=>IT[id]?'<span data-un="'+s+'">'+IT[id].ic+' '+IT[id].n+' ✕</span>':'').join('')}
function loop(){if(!D.classList.contains('on'))return;raf=requestAnimationFrame(loop);const v=$$('ofView'),w=v.clientWidth,h=v.clientHeight;if(pr.domElement.width!==Math.round(w*pr.getPixelRatio())){pr.setSize(w,h,false);pc.aspect=w/h;pc.updateProjectionMatrix()}
 if(pm)pm.rotation.y=rotY+(drag==null?performance.now()/3000:0);pr.render(ps,pc)}
const sw=c=>'#'+c.toString(16).padStart(6,'0');
function render(){$$('ofBal').textContent='🪙 '+zs().toLocaleString('hu-HU');
 $$('ofTabs').innerHTML=Object.entries(SLOTS).map(([k,n])=>'<button data-tab="'+k+'" class="'+(tab===k?'on':'')+'">'+n+' ('+ITEMS.filter(i=>i.slot===k&&O.own[i.id]).length+'/'+ITEMS.filter(i=>i.slot===k).length+')'+(O.eq[k]?' ✔':'')+'</button>').join('');
 $$('ofGrid').innerHTML=ITEMS.filter(i=>i.slot===tab).map(it=>{const own=O.own[it.id],on=O.eq[it.slot]===it.id;return '<div class="ofC'+(on?' eq':'')+'" data-i="'+it.id+'" style="border-color:'+RARC[it.rar]+'55"><span class="tag" style="color:'+RARC[it.rar]+'">'+['KÖZ','RITKA','EPIK','LEGEND','MÍTIKUS'][it.rar]+'</span><div class="sw" style="background:'+sw(it.c)+'33">'+it.ic+'</div><b>'+it.n+'</b><i style="color:'+(own?'#86efac':'#facc15')+'">'+(on?'✔ RAJTAD':own?'Felvesz':'🪙 '+it.price)+'</i></div>'}).join('')}
function flash(m){const b=$$('ofBal');b.textContent=m;b.style.color='#f87171';setTimeout(()=>{b.style.color='';render()},1500)}
D.addEventListener('click',e=>{const t=e.target;if(t.id==='ofX')return close();if(t.id==='ofOff'){O.eq={};save();preview(O.eq);render();return}
 const tb=t.closest('[data-tab]');if(tb){tab=tb.dataset.tab;render();return}const un=t.closest('[data-un]');if(un){delete O.eq[un.dataset.un];save();preview(O.eq);render();return}
 const ic=t.closest('[data-i]');if(!ic)return;const it=IT[ic.dataset.i];if(!O.own[it.id]){if(zs()<it.price){flash('Nincs elég zseton! (🪙 '+it.price+')');return}payZ(it.price);O.own[it.id]=1;try{sfx('buy')}catch(x){}}
 if(O.eq[it.slot]===it.id)delete O.eq[it.slot];else O.eq[it.slot]=it.id;save();preview(O.eq);render()});
D.addEventListener('mouseover',e=>{const ic=e.target.closest&&e.target.closest('[data-i]');if(!ic)return;clearTimeout(hovT);const it=IT[ic.dataset.i];if(pm&&pm.userData.hov!==it.id){preview(Object.assign({},O.eq,{[it.slot]:it.id}));pm.userData.hov=it.id}});
D.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('[data-i]')){clearTimeout(hovT);hovT=setTimeout(()=>preview(O.eq),150)}});
function close(){D.classList.remove('on');cancelAnimationFrame(raf)}
window.openOutfit=function(){if(!window.BR){alert('Előbb jelentkezz be!');return}try{$('gui').classList.remove('on');GUI.on=false}catch(e){}D.classList.add('on');initView();preview(O.eq);render();cancelAnimationFrame(raf);loop()};
addEventListener('keydown',e=>{if(e.key==='Escape'&&D.classList.contains('on')){close();e.stopImmediatePropagation()}},true);
// a Szekrényben gomb a kiegészítőkhöz
{const o=window.brLocker;if(typeof o==='function')window.brLocker=function(){const r=o.apply(this,arguments);try{const g=$('gui');const h=g&&g.querySelector('h1');if(h&&!g.querySelector('#ofBtn')){const b=document.createElement('button');b.id='ofBtn';b.className='b f';b.style.cssText='display:block;margin:8px auto 12px;padding:12px 22px;font-size:20px;background:linear-gradient(90deg,#a855f7,#ec4899);color:#fff;border:0;border-radius:14px;cursor:pointer';b.textContent='👕 KIEGÉSZÍTŐK (140) – öltöztesd fel a karaktered!';b.onclick=()=>openOutfit();h.after(b)}}catch(e){}return r}}
window._OUTFIT={ITEMS,O};window._OUTFIT_PRE=()=>{initView();ensurePM()};
})();

// ---------- ELŐTÖLTÉS: betöltéskor mindent felépít, utána csak megjelenítés ----------
(function(){let n=0;const iv=setInterval(()=>{n++;const L=window.LB3D;if((L&&L.me)||n>30){clearInterval(iv);const go=()=>{try{const f=window._OUTFIT_PRE;f&&f()}catch(e){console.error(e)}};(window.requestIdleCallback||setTimeout)(go,{timeout:3000})}},700)})();
