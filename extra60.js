// ===== EXTRA60: 4 új fegyver · részletes, fotószerű textúrás fegyvermodellek · üres slotok · új okostelefon (U) a minitérkép mellett =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x60pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x60 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),fmt=n=>(+n||0).toLocaleString('hu-HU'),RN=(a,b)=>a+Math.random()*(b-a);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};

// =====================================================================
// ÚJ FEGYVEREK (5–8. index → 6–9 gomb)
// =====================================================================
if(typeof WPN!=='undefined'&&WPN.length===5){WPN.push(
 {e:'🔫',n:'HIVATALI PISZTOLY',mag:12,res:60,rt:1,spr:.02,spd:50,dmg:24,cd:.28,col:0xfacc15,pellets:1},
 {e:'⚡',n:'UNIÓS SMG',mag:40,res:160,rt:1.3,spr:.06,spd:46,dmg:9,cd:.065,col:0x60a5fa,pellets:1},
 {e:'🌀',n:'KORDON-MINIGUN',mag:150,res:300,rt:3,spr:.09,spd:48,dmg:8,cd:.035,col:0xfb923c,pellets:1},
 {e:'✨',n:'PECSÉT-LÉZER',mag:20,res:80,rt:1.6,spr:0,spd:140,dmg:34,cd:.22,col:0x22d3ee,pellets:1,pierce:1})}
addEventListener('keydown',e=>{if(typeof G==='undefined'||!G||typeof run==='undefined'||!run||G.over)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 if('6789'.includes(e.key)&&e.key.length===1){const i=+e.key-1;if(G.own[i]&&!G.buildMode){G.wp=i;G.pickMode=false}}});
// görgő: mind a 9 fegyveren végigmegy
addEventListener('wheel',e=>{if(typeof G==='undefined'||!G||typeof run==='undefined'||!run||G.over)return;e.stopImmediatePropagation();const N=WPN.length;let i=G.wp;for(let n=0;n<N;n++){i=(i+(e.deltaY>0?1:N-1))%N;if(G.own[i]){G.wp=i;G.pickMode=false;break}}},true);
WP('launch',null,()=>{try{const g=G;for(let i=5;i<WPN.length;i++){if(g.own[i]===undefined)g.own[i]=false;if(g.mag[i]===undefined)g.mag[i]=0;if(g.res[i]===undefined)g.res[i]=0;if(g.ry&&g.ry.rar&&g.ry.rar[i]===undefined)g.ry.rar[i]=0}}catch(e){}});

// =====================================================================
// ÜRES SLOTOK: ami nincs nálad, az üres keret
// =====================================================================
const css=document.createElement('style');css.textContent=`
#inv .sl.x60e{background:#0b102266!important;border:2px dashed #ffffff22!important;color:transparent}
#inv .sl.x60e b{color:#ffffff55}
#inv{flex-wrap:nowrap}
`;document.head.appendChild(css);
WP('invUI',null,()=>{const inv=$$('inv');if(!inv||typeof G==='undefined'||!G)return;const sl=[...inv.querySelectorAll('.sl')].filter(x=>x.id!=='slP');
 sl.forEach((el,i)=>{if(i>=WPN.length){const isZ=i===WPN.length,c=isZ?G.inv.hp:G.inv.beer;if(!c){if(!el.classList.contains('x60e')){el.classList.add('x60e');el.innerHTML='<b>'+(isZ?'Z':'X')+'</b>'}}return}
  if(!G.own[i]){if(!el.classList.contains('x60e')){el.classList.add('x60e');el.innerHTML='<b>'+(i+1)+'</b>'}}})});

// =====================================================================
// FOTÓSZERŰ, GENERÁLT TEXTÚRÁK
// =====================================================================
const TX={};
function cnv(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function noise(x,w,h,a,base){const d=x.getImageData(0,0,w,h),p=d.data;for(let i=0;i<p.length;i+=4){const n=(Math.random()-.5)*a;p[i]+=n;p[i+1]+=n;p[i+2]+=n}x.putImageData(d,0,0)}
function tex(k){if(TX[k])return TX[k];let t;
 if(k==='metal')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#4b5563';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.strokeStyle='rgba('+(Math.random()<.5?'255,255,255':'0,0,0')+','+RN(.02,.08)+')';const y=Math.random()*h;x.beginPath();x.moveTo(0,y);x.lineTo(w,y+RN(-2,2));x.stroke()}noise(x,w,h,26);for(let i=0;i<14;i++){x.strokeStyle='rgba(255,255,255,.18)';x.beginPath();const sx=Math.random()*w,sy=Math.random()*h;x.moveTo(sx,sy);x.lineTo(sx+RN(-30,30),sy+RN(-6,6));x.stroke()}});
 else if(k==='dark')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#1f2228';x.fillRect(0,0,w,h);for(let i=0;i<5000;i++){x.fillStyle='rgba(255,255,255,'+RN(0,.05)+')';x.fillRect(Math.random()*w,Math.random()*h,1.5,1.5)}noise(x,w,h,14)});
 else if(k==='poly')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#2a2d33';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){x.fillStyle='rgba(0,0,0,'+RN(0,.25)+')';x.beginPath();x.arc(Math.random()*w,Math.random()*h,RN(.5,1.6),0,7);x.fill()}noise(x,w,h,10)});
 else if(k==='tan')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#a08463';x.fillRect(0,0,w,h);for(let i=0;i<7000;i++){x.fillStyle='rgba(60,40,20,'+RN(0,.2)+')';x.beginPath();x.arc(Math.random()*w,Math.random()*h,RN(.5,1.5),0,7);x.fill()}noise(x,w,h,12)});
 else if(k==='wood')t=cnv(256,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,'#6b3a1c');g.addColorStop(.5,'#8a4f27');g.addColorStop(1,'#5c3117');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){x.strokeStyle='rgba(40,18,6,'+RN(.15,.5)+')';x.lineWidth=RN(.5,3);x.beginPath();let px=Math.random()*w;x.moveTo(px,0);for(let y=0;y<h;y+=16){px+=RN(-3,3)+Math.sin(y/40+i)*1.5;x.lineTo(px,y)}x.stroke()}
  for(let i=0;i<4;i++){x.strokeStyle='rgba(30,12,4,.5)';x.lineWidth=2;const cx=Math.random()*w,cy=Math.random()*h;for(let r=3;r<18;r+=3){x.beginPath();x.ellipse(cx,cy,r*.6,r*1.8,0,0,7);x.stroke()}}noise(x,w,h,16)});
 else if(k==='camo')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#4d5a3a';x.fillRect(0,0,w,h);['#6b7a4b','#2f3a24','#8b7d5a','#3b4a2c'].forEach(c=>{for(let i=0;i<22;i++){x.fillStyle=c;x.beginPath();const cx=Math.random()*w,cy=Math.random()*h;x.moveTo(cx,cy);for(let a=0;a<7;a+=.6)x.lineTo(cx+Math.cos(a)*RN(8,26),cy+Math.sin(a)*RN(8,26));x.fill()}});noise(x,w,h,14)});
 else if(k==='olive')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#4b5320';x.fillRect(0,0,w,h);for(let i=0;i<400;i++){x.strokeStyle='rgba(0,0,0,'+RN(.03,.12)+')';const y=Math.random()*h;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}noise(x,w,h,20);x.fillStyle='rgba(255,255,255,.75)';x.font='bold 22px monospace';x.fillText('REZSI-77',20,140)});
 else if(k==='gold')t=cnv(128,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#fde68a');g.addColorStop(.5,'#ca8a04');g.addColorStop(1,'#fbbf24');x.fillStyle=g;x.fillRect(0,0,w,h);noise(x,w,h,18)});
 else if(k==='white')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#e5e7eb';x.fillRect(0,0,w,h);x.strokeStyle='rgba(0,0,0,.12)';for(let i=0;i<w;i+=32){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}noise(x,w,h,10)});
 else if(k==='paper')t=cnv(256,256,(x,w,h)=>{x.fillStyle='#fef9c3';x.fillRect(0,0,w,h);x.fillStyle='#1f2937';for(let y=10;y<h;y+=12)x.fillRect(10,y,RN(80,230),4);x.fillStyle='#dc2626';x.font='bold 30px sans-serif';x.fillText('SZAVAZZ!',30,60);noise(x,w,h,12)});
 else if(k==='grip')t=cnv(64,64,(x,w,h)=>{x.fillStyle='#18181b';x.fillRect(0,0,w,h);x.strokeStyle='#3f3f46';for(let i=-w;i<w*2;i+=5){x.beginPath();x.moveTo(i,0);x.lineTo(i+h,h);x.stroke();x.beginPath();x.moveTo(i,h);x.lineTo(i+h,0);x.stroke()}});
 TX[k]=t;return t}
const MAT={};function mat0(k){const base={camo:{metalness:0,roughness:.9}}[k]||{};return new THREE.MeshStandardMaterial(Object.assign({map:tex(k)},base))}
function mat(k,o){const key=k+JSON.stringify(o||{});if(MAT[key])return MAT[key];if(typeof window.texMat==='function'&&!o){const PH={metal:()=>texMat('metal',.6,.6,0xb6bcc6),dark:()=>texMat('metal',.6,.6,0x3f4552),wood:()=>texMat('darkwood',.5,.5),poly:()=>grayMat('rubber',0x2a2d33,1,1,{roughness:.8}),tan:()=>grayMat('painted',0xa08463,1,1,{roughness:.8}),olive:()=>grayMat('painted',0x56602a,1,1,{roughness:.7}),white:()=>grayMat('painted',0xe8eaee,1,1,{roughness:.45}),grip:()=>grayMat('rubber',0x18181b,2,2,{roughness:1}),camo:()=>{const m=mat0('camo');return m}};if(PH[k]){try{return MAT[key]=PH[k]()}catch(e){}}}const base={metal:{metalness:.85,roughness:.35},dark:{metalness:.6,roughness:.45},poly:{metalness:.05,roughness:.8},tan:{metalness:.05,roughness:.85},wood:{metalness:0,roughness:.6},camo:{metalness:0,roughness:.9},olive:{metalness:.2,roughness:.7},gold:{metalness:1,roughness:.25},white:{metalness:.1,roughness:.4},paper:{metalness:0,roughness:.9},grip:{metalness:0,roughness:1}}[k]||{};
 return MAT[key]=new THREE.MeshStandardMaterial(Object.assign({map:tex(k)},base,o||{}))}
const glow=c=>new THREE.MeshBasicMaterial({color:c});

// =====================================================================
// RÉSZLETES FEGYVERMODELLEK (a cső vége = -0.9 - bl/2, ugyanott indul a lövedék)
// =====================================================================
const BL=[.8,1.1,1.9,1.4,.7,.6,.9,1.2,1.3];
function B(g,m,w,h,d,x,y,z,rx){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;g.add(o);return o}
function C(g,m,r1,r2,len,x,y,z,seg){const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,len,seg||16),m);o.rotation.x=Math.PI/2;o.position.set(x,y,z);g.add(o);return o}
function tipZ(i){return-.9-BL[i]/2}
function build(i){const g=new THREE.Group();g.name='x60m';const tz=tipZ(i);
 const M=mat('metal'),D=mat('dark'),P=mat('poly'),Wd=mat('wood'),Gr=mat('grip');
 if(i===0){// shotgun: fa tusa, pumpás előagy, cső + csőtár
  B(g,D,.22,.26,.9,0,0,.05);C(g,M,.055,.055,(-.35)-tz,0,.05,(tz+(-.35))/2);C(g,D,.045,.045,(-.35)-tz-.15,0,-.07,(tz+.15+(-.35))/2);
  const fe=B(g,Wd,.2,.16,.45,0,-.05,tz+.55);fe.name='pump';B(g,Wd,.18,.3,.55,0,-.12,.62).rotation.x=-.18;B(g,Gr,.12,.28,.16,0,-.24,.28).rotation.x=.4;C(g,glow(0xfacc15),.012,.012,.04,0,.12,tz+.06,8)}
 else if(i===1){// SCAR: homokszín tok, sín, ívelt tár, irányzék, tus
  B(g,mat('tan'),.22,.24,1.05,0,0,0);B(g,D,.1,.04,.95,0,.14,0);for(let k=0;k<10;k++)B(g,M,.12,.02,.03,0,.165,-.45+k*.1);
  C(g,D,.035,.035,(-.52)-tz,0,.03,(tz-.52)/2);C(g,D,.06,.05,.12,0,.03,tz+.06);const mg=B(g,P,.11,.36,.18,0,-.28,-.12);mg.rotation.x=.25;
  B(g,Gr,.1,.26,.14,0,-.22,.22).rotation.x=.35;B(g,mat('tan'),.16,.22,.42,0,-.04,.72);B(g,D,.06,.1,.12,0,.22,.25);B(g,glow(0xef4444),.02,.02,.02,0,.27,.25)}
 else if(i===2){// mesterlövész: terepszínes tus, hosszú cső, távcső lencsékkel, zár
  B(g,mat('camo'),.2,.24,1.1,0,-.02,.15);C(g,M,.035,.04,(-.45)-tz,0,.04,(tz-.45)/2);C(g,D,.06,.06,.16,0,.04,tz+.08);
  const sc=C(g,D,.085,.085,.75,0,.24,-.05,20);C(g,D,.1,.085,.12,0,.24,-.47,20);C(g,D,.1,.085,.12,0,.24,.36,20);
  const lens=new THREE.Mesh(new THREE.CircleGeometry(.09,20),new THREE.MeshStandardMaterial({color:0x60a5fa,metalness:.9,roughness:.05,emissive:0x0c2a4a}));lens.position.set(0,.24,-.535);lens.rotation.y=Math.PI;g.add(lens);
  B(g,M,.03,.12,.03,0,.14,-.2);B(g,M,.03,.12,.03,0,.14,.2);C(g,M,.025,.025,.15,.12,.06,.2).rotation.set(0,0,Math.PI/2);B(g,Gr,.1,.26,.14,0,-.22,.3).rotation.x=.35}
 else if(i===3){// rakétavető: olajzöld cső feliratozva, rakétafej, fogantyúk
  C(g,mat('olive'),.17,.17,1.5-(-tz-.9)+.4,0,.05,(tz+.75)/2,20);C(g,D,.19,.19,.08,0,.05,tz+.04,20);C(g,D,.19,.19,.08,0,.05,.7,20);
  const rk=new THREE.Mesh(new THREE.ConeGeometry(.13,.3,16),new THREE.MeshStandardMaterial({color:0xdc2626,metalness:.4,roughness:.4}));rk.rotation.x=-Math.PI/2;rk.position.set(0,.05,tz+.05);g.add(rk);
  B(g,Gr,.1,.3,.14,0,-.24,.05).rotation.x=.3;B(g,Gr,.1,.26,.12,0,-.22,-.35).rotation.x=.3;B(g,D,.05,.14,.2,.16,.2,-.1)}
 else if(i===4){// szórólap-ágyú: dob papírtekercssel, tölcsér
  B(g,mat('white'),.26,.26,.9,0,0,.05);C(g,mat('paper'),.2,.2,.24,0,.2,.1,20).rotation.set(0,0,Math.PI/2);
  const fun=new THREE.Mesh(new THREE.CylinderGeometry(.16,.06,(-.4)-tz,16,1,true),new THREE.MeshStandardMaterial({color:0xef4444,side:THREE.DoubleSide,metalness:.3,roughness:.4}));fun.rotation.x=-Math.PI/2;fun.position.set(0,.02,(tz-.4)/2);g.add(fun);
  B(g,Gr,.12,.28,.15,0,-.24,.3).rotation.x=.35;B(g,mat('gold'),.27,.04,.06,0,.13,-.3)}
 else if(i===5){// pisztoly: szán, csőtorkolat, markolat
  B(g,M,.16,.16,.65,0,.06,tz+.33);B(g,D,.15,.1,.5,0,-.06,tz+.38);for(let k=0;k<6;k++)B(g,D,.165,.12,.015,0,.07,tz+.5+k*.04);
  const gp=B(g,Gr,.13,.42,.2,0,-.28,tz+.6);gp.rotation.x=.22;B(g,glow(0xfacc15),.02,.02,.02,0,.15,tz+.05);B(g,M,.04,.04,.12,0,-.13,tz+.32)}
 else if(i===6){// SMG: kompakt kék tok, hosszú egyenes tár, behajtott tus
  B(g,mat('dark',{color:0x93c5fd}),.2,.24,.85,0,0,-.05);C(g,D,.04,.04,(-.47)-tz,0,.02,(tz-.47)/2);C(g,D,.065,.065,.18,0,.02,tz+.09);
  B(g,P,.1,.5,.14,0,-.34,-.18);B(g,Gr,.1,.26,.14,0,-.22,.2).rotation.x=.35;B(g,M,.03,.03,.5,.08,-.02,.55);B(g,M,.03,.03,.5,-.08,-.02,.55);B(g,M,.2,.12,.03,0,-.02,.8);B(g,D,.08,.08,.2,0,.17,-.05)}
 else if(i===7){// minigun: forgó csőköteg, motorház, fogantyú
  B(g,mat('dark',{color:0xfdba74}),.34,.34,.7,0,0,.2);const rot=new THREE.Group();rot.name='spin';rot.position.set(0,0,(tz+.1-.15)/2);
  const L=(-.15)-(tz);for(let k=0;k<6;k++){const a=k/6*Math.PI*2;const b=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,L,10),M);b.rotation.x=Math.PI/2;b.position.set(Math.cos(a)*.1,Math.sin(a)*.1,0);rot.add(b)}
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.13,.025,8,20),D);ring.position.z=-L/2+.05;rot.add(ring);const ring2=ring.clone();ring2.position.z=0;rot.add(ring2);g.add(rot);
  B(g,Gr,.1,.3,.14,0,-.3,.25).rotation.x=.3;B(g,M,.06,.28,.06,0,.25,.15);B(g,mat('olive'),.18,.24,.32,.26,-.08,.2)}
 else{// pecsét-lézer: fehér, világító csík, energiacella
  B(g,mat('white'),.2,.24,1,0,0,0);C(g,mat('white'),.06,.05,(-.5)-tz,0,.02,(tz-.5)/2);
  B(g,glow(0x22d3ee),.21,.03,.9,0,.05,0);C(g,glow(0x67e8f9),.03,.03,.04,0,.02,tz+.02,10);const cell=C(g,glow(0x22d3ee),.06,.06,.22,0,-.16,-.2,12);cell.name='cell';
  B(g,Gr,.1,.26,.14,0,-.22,.25).rotation.x=.35;B(g,mat('white'),.15,.2,.35,0,-.02,.65);B(g,D,.07,.09,.16,0,.18,-.1)}
 g.traverse(o=>{o.castShadow=false;o.receiveShadow=false});return g}
const MODELS={};let curI=-1;
function applyModel(){if(typeof G==='undefined'||!G||!G.gun)return;const g=G.gun,i=G.wp|0;if(!WPN[i])return;
 if(!MODELS[i])MODELS[i]=build(i);
 if(curI!==i||MODELS[i].parent!==g){Object.values(MODELS).forEach(m=>{if(m.parent)m.parent.remove(m)});g.add(MODELS[i]);curI=i}
 g.children.forEach(c=>{if(c.name!=='x60m')c.visible=false});MODELS[i].visible=true;
 // skin (extra20) a részletes modellre is – csak fegyver- vagy skinváltáskor
 const M=MODELS[i];if(!M._c){M._c={meshes:[],spin:M.getObjectByName('spin'),pump:M.getObjectByName('pump'),cell:M.getObjectByName('cell')};M.traverse(o=>{if(o.isMesh&&o.material&&o.material.map)M._c.meshes.push(o)})}
 const SK=window._x20SK,SKS=window._x20SKINS;const s=SK&&SKS?SKS.find(x=>x[0]===SK.cur):null;const sk=(s&&s[2])?SK.cur+'|'+s[2]:'';
 if(M._sk!==sk){M._sk=sk;M._c.meshes.forEach(o=>{if(!o.userData.base)o.userData.base=o.material;
  if(sk){if(!o.userData.sk||o.userData.skc!==s[2]){o.userData.sk=o.userData.base.clone();o.userData.sk.color=new THREE.Color(s[2]);o.userData.skc=s[2];if(SK.cur==='arany'||SK.cur==='gyemant'){o.userData.sk.metalness=.9;o.userData.sk.roughness=.25}}o.material=o.userData.sk}else o.material=o.userData.base})}
 const t=performance.now()/1000;const spin=M._c.spin;if(spin)spin.rotation.z+=(typeof ms!=='undefined'&&ms.on?.6:.03);
 const pump=M._c.pump;if(pump){const k=Math.max(0,(G.cd||0));pump.position.z=tipZ(0)+.55+(k>.2?Math.min(.15,(k-.2)*.6):0)}
 const cell=M._c.cell;if(cell)cell.material.color.setHSL(.52,1,.5+Math.sin(t*6)*.15)}
WP('update',null,()=>{try{applyModel()}catch(e){}});
WP('launch',null,()=>{curI=-1;Object.keys(MODELS).forEach(k=>delete MODELS[k])});

// =====================================================================
// OKOSTELEFON (U): a minitérkép mellett, appokkal
// =====================================================================
const pcss=document.createElement('style');pcss.textContent=`
#x60Ph{position:fixed;left:132px;bottom:56px;width:250px;height:470px;z-index:9;border-radius:34px;background:#0a0a0f;padding:10px;box-shadow:0 0 0 2px #3f3f46,0 0 0 5px #18181b,0 20px 50px #000c,inset 0 0 0 1px #ffffff14;display:none;font:600 14px Rajdhani,sans-serif;color:#fff;transform-origin:bottom left;animation:x60in .25s ease-out}
@keyframes x60in{from{transform:translateY(40px) scale(.9);opacity:0}}
#x60Ph .scr{position:relative;width:100%;height:100%;border-radius:26px;overflow:hidden;background:linear-gradient(160deg,#312e81,#0f172a 55%,#831843)}
#x60Ph .notch{position:absolute;left:50%;top:6px;transform:translateX(-50%);width:70px;height:18px;border-radius:12px;background:#000;z-index:3}
#x60Ph .sb{display:flex;justify-content:space-between;padding:6px 16px 0;font-size:12px;opacity:.9;height:20px}
#x60Ph .apps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px 6px;padding:24px 12px}
#x60Ph .ap{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;font-size:11px;position:relative}
#x60Ph .ap i{width:52px;height:52px;border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:27px;font-style:normal;box-shadow:0 4px 10px #0007}
#x60Ph .ap em{position:absolute;right:6px;top:-4px;background:#ef4444;border-radius:9px;padding:0 5px;font-size:11px;font-style:normal}
#x60Ph .bar{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:90px;height:4px;border-radius:2px;background:#fff9;cursor:pointer}
#x60Ph .hd{display:flex;align-items:center;gap:6px;padding:8px 12px;font-size:16px;border-bottom:1px solid #ffffff1a;background:#0006}
#x60Ph .hd b{cursor:pointer;font-size:18px}
#x60Ph .bd{height:calc(100% - 92px);overflow-y:auto;overflow-x:hidden;padding:8px 10px}
#x60Ph .it{display:flex;gap:8px;align-items:center;padding:7px;border-radius:12px;background:#ffffff10;margin-bottom:6px;cursor:pointer}
#x60Ph .it span{font-size:22px}#x60Ph .it small{display:block;opacity:.7;font-size:11px}
#x60Ph .post{background:#000;border-radius:10px;margin-bottom:10px;overflow:hidden}
#x60Ph .post .u{padding:6px 8px;font-size:13px;display:flex;align-items:center;gap:6px}#x60Ph .post .u i{width:22px;height:22px;border-radius:50%;background:linear-gradient(45deg,#f59e0b,#db2777);display:inline-flex;align-items:center;justify-content:center;font-style:normal;font-size:13px}
#x60Ph .post .im{height:140px;display:flex;align-items:center;justify-content:center;font-size:64px;background-size:cover;background-position:center}
#x60Ph .post .ac{padding:5px 8px;font-size:12px}#x60Ph .post .ac b{cursor:pointer;margin-right:8px;font-size:16px}
#x60Ph .q{padding:7px;border-radius:12px;background:#ffffff10;margin-bottom:6px}#x60Ph .q .pb{height:5px;background:#ffffff22;border-radius:3px;overflow:hidden;margin-top:4px}#x60Ph .q .pb i{display:block;height:100%;background:#4ade80}
#x60Ph button{border:0;border-radius:10px;padding:7px 10px;font:700 13px Rajdhani;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#db2777);color:#fff;width:100%;margin:4px 0}
#x60Ph .msg{padding:5px 8px;border-radius:12px 12px 12px 3px;background:#ffffff14;margin-bottom:5px;font-size:12px}`;document.head.appendChild(pcss);
const ph=document.createElement('div');ph.id='x60Ph';ph.innerHTML='<div class="scr"><div class="notch"></div><div class="sb"><span id="x60T">12:00</span><span>📶 🔋 <b id="x60Bt">87</b>%</span></div><div id="x60V"></div><div class="bar" onclick="x60home()"></div></div>';document.body.appendChild(ph);
ph.addEventListener('mousedown',e=>e.stopPropagation());ph.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
let PH={open:false,app:'home'};const IG=Object.assign({fol:120,posts:[]},LSg('k3x60ig',{}));const igSave=()=>{IG.posts=IG.posts.slice(0,20);LSs('k3x60ig',IG)};
const MSG=[];
const FAKE=[['📸','kozpenz_hirek'],['🐕','vizsla_mama'],['💼','lobbista_lali'],['🎤','tenyfeltaro_tibi'],['🏛️','hivatal_hu'],['🍳','rantotthus_rajongo']];
const feed=[];function pushFeed(icon,user,img,txt,likes){feed.unshift({icon,user,img,txt,likes:likes||Math.floor(RN(5,400)),t:Date.now(),liked:false});if(feed.length>30)feed.pop();PH.badge=(PH.badge||0)+1;if(PH.open&&PH.app==='ig')render()}
// üzenetek a say()-ből
WP('say',a=>{const t=String(a[0]||'');if(!t)return;MSG.unshift({t,at:new Date().toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'})});if(MSG.length>40)MSG.pop();if(PH.open&&PH.app==='msg')render()});
// események → Közgram posztok
WP('kill',null,a=>{const e=a[0];if(Math.random()<.35){const f=FAKE[Math.floor(Math.random()*FAKE.length)];pushFeed(f[0],f[1],(e&&e.m?'💥':'🔥'),['Valaki épp kiejtett egy '+(e&&e.t||'ellenfelet')+'-t a szigeten! 😱','Élőben: újabb kiesés a Közpénz-szigeten! #royale','Ez komoly volt… '+((typeof G!=='undefined'&&G)?G.kills:0)+' kiesésnél jár a sztárjátékos! 🔥'][Math.floor(Math.random()*3)])}});
WP('launch',null,()=>{feed.length=0;MSG.length=0;PH.badge=0;closePh();pushFeed('🏛️','hivatal_hu','🏝️','Elindult az új meccs a Közpénz-szigeten! Sok szerencsét mindenkinek! 🍀',900);pushFeed('📸','kozpenz_hirek','🚌','A busz épp a sziget fölött repül. Ki ugrik elsőnek? 🪂')});
WP('end',null,()=>closePh());
function closePh(){PH.open=false;ph.style.display='none'}
function app(id){PH.app=id;if(id==='ig')PH.badge=0;render()}
window.x60app=app;window._x60PH=PH;window._x60render=()=>render();window._x60push=(i,u,img,t,l)=>pushFeed(i,u,img,t,l);window._x60IG=IG;window._x60igSave=igSave;window.x60home=()=>{PH.app='home';render()};
function quests(){const out=[];try{const ch=LSg('k3x10ch',{list:[]});(ch.list||[]).forEach(c=>out.push({n:'📅 '+c.n,p:c.p,g:c.goal,done:c.done}))}catch(e){}
 try{const Q=window._x50Q&&_x50Q();if(Q){out.push({n:'🗺️ Kincsvadász-térkép darabjai',p:Math.min(3,Q.got||0),g:3,done:!!(Q.dig&&Q.dig.done)});if(Q.drops)out.push({n:'🚁 Ellátmány-ládák kinyitva',p:Q.drops.filter(d=>d.open).length,g:Math.max(1,Q.drops.length),done:Q.drops.length>0&&Q.drops.every(d=>d.open)})}}catch(e){}
 try{const alb=LSg('k3x50alb',{});out.push({n:'📸 Turista-album',p:Object.keys(alb).length,g:12,done:Object.keys(alb).length>=12})}catch(e){}
 try{if(typeof G!=='undefined'&&G){out.push({n:'💀 Kiesések ebben a meccsben (10)',p:Math.min(10,G.kills|0),g:10,done:(G.kills|0)>=10});out.push({n:'💰 Gyűjts 20 000 Ft meccspénzt',p:Math.min(20000,Math.floor(G.cash)),g:20000,done:G.cash>=20000})}}catch(e){}return out}
function render(){const v=$$('x60V');if(!v)return;const g=typeof G!=='undefined'?G:null;
 const hd=(t)=>'<div class="hd"><b onclick="x60home()">‹</b> '+t+'</div>';
 if(PH.app==='home'){const qs=quests().filter(q=>!q.done).length;
  v.innerHTML='<div style="text-align:center;margin-top:16px;font:44px \'Luckiest Guy\',Impact;letter-spacing:1px" id="x60Clk"></div><div style="text-align:center;font-size:12px;opacity:.8">'+new Date().toLocaleDateString('hu-HU',{weekday:'long',month:'long',day:'numeric'})+'</div><div class="apps">'+
  [['call','📞','Hívások','#16a34a',(g&&g.ring>0)?'!':''],['ig','📸','Közgram','linear-gradient(45deg,#f59e0b,#db2777,#7c3aed)',PH.badge||''],['quest','🎯','Küldetések','#ea580c',qs||''],['msg','💬','Üzenetek','#2563eb',''],['stat','📊','Statisztika','#0f766e',''],['shop','🛒','Gyorsbolt','#ca8a04',''],...Object.entries(window._x60APPS||{}).filter(([,a])=>!a.hide).map(([id,a])=>[id,a.e,a.n,a.bg,(a.badge&&a.badge())||''])].map(([id,e,n,bg,b])=>'<div class="ap" onclick="x60app(\''+id+'\')"><i style="background:'+bg+'">'+e+'</i>'+n+(b?'<em>'+b+'</em>':'')+'</div>').join('')+'</div>';tick();return}
 if(window._x60APPS&&_x60APPS[PH.app]){v.innerHTML=hd(_x60APPS[PH.app].e+' '+_x60APPS[PH.app].n)+'<div class="bd">'+_x60APPS[PH.app].render()+'</div>';try{_x60APPS[PH.app].after&&_x60APPS[PH.app].after(v)}catch(e){}return}
 if(PH.app==='call'){let h=hd('📞 Hívások');h+='<div class="bd">';if(g&&g.ring>0)h+='<div class="it" style="background:#16a34a55" onclick="act(\'ans\');x60app(\'call\')"><span>☄️</span><div><b>BEJÖVŐ HÍVÁS</b><small>Ellenzéki Üstökös · felveszed?</small></div></div>';
  (typeof CTS!=='undefined'?CTS:[]).forEach(c=>h+='<div class="it" onclick="act(\''+c.a+'\');x60app(\'call\')"><span>'+c.e+'</span><div>'+c.n+'<small>'+c.d+'</small></div></div>');v.innerHTML=h+'</div>';return}
 if(PH.app==='ig'){let h=hd('📸 Közgram · <small>'+fmt(IG.fol)+' követő</small>')+'<div class="bd"><button onclick="x60selfie()">📷 SZELFI POSZTOLÁSA</button>';
  const all=[...IG.posts.map(p=>Object.assign({mine:true},p)),...feed].sort((a,b)=>b.t-a.t);
  h+=all.map((p,i)=>'<div class="post"><div class="u"><i>'+esc(p.icon||'😎')+'</i><b>'+esc(p.user)+'</b>'+(p.mine?' <small style="opacity:.6">(te)</small>':'')+'</div><div class="im" style="'+(p.src?'background-image:url('+p.src+')':'background:linear-gradient(135deg,#1e293b,#334155)')+'">'+(p.src?'':esc(p.img||'📸'))+'</div><div class="ac"><b onclick="x60like('+(p.mine?'\'m'+IG.posts.indexOf(IG.posts.find(x=>x.t===p.t))+'\'':'\'f'+feed.indexOf(p)+'\'')+')">'+(p.liked?'❤️':'🤍')+'</b>💬 ↗️<br><b style="font-size:12px">'+fmt(p.likes)+' kedvelés</b> '+esc(p.txt)+'</div></div>').join('');v.innerHTML=h+'</div>';return}
 if(PH.app==='quest'){const qs=quests();v.innerHTML=hd('🎯 Küldetések')+'<div class="bd">'+(qs.map(q=>'<div class="q">'+(q.done?'✅ ':'')+esc(q.n)+'<div class="pb"><i style="width:'+Math.min(100,q.p/q.g*100)+'%"></i></div><small style="opacity:.7">'+fmt(q.p)+' / '+fmt(q.g)+'</small></div>').join('')||'<div style="opacity:.6">Nincs aktív küldetés.</div>')+'</div>';return}
 if(PH.app==='msg'){v.innerHTML=hd('💬 Üzenetek')+'<div class="bd">'+(MSG.map(m=>'<div class="msg">'+esc(m.t)+'<small style="opacity:.5;margin-left:6px">'+m.at+'</small></div>').join('')||'<div style="opacity:.6">Még nincs üzenet.</div>')+'</div>';return}
 if(PH.app==='stat'){const al=g?(g.en||[]).filter(e=>!e.dead).length:0;v.innerHTML=hd('📊 Statisztika')+'<div class="bd">'+[['💀','Kiesések',g?g.kills:0],['💰','Meccspénz',g?fmt(Math.floor(g.cash))+' Ft':0],['❤️','Élet',g?Math.round(g.hp)+' / '+g.mhp:0],['🛡️','Pajzs',g?Math.round(g.sh):0],['👥','Életben lévő ellenfelek',al],['⏱️','Idő',g?Math.floor(g.t/60)+':'+String(Math.floor(g.t%60)).padStart(2,'0'):0],['🔫','Fegyverek',g?WPN.filter((_,i)=>g.own[i]).map(w=>w.e).join(' ')||'—':'—']].map(([e,n,x])=>'<div class="it"><span>'+e+'</span><div>'+n+'<small style="font-size:14px;opacity:1"><b>'+x+'</b></small></div></div>').join('')+'</div>';return}
 if(PH.app==='shop'){const items=[['🛡️','Pajzs +40',1200,g=>{g.sh=Math.min(g.msh,g.sh+40)}],['💊','Medkit',1000,g=>{g.inv.hp=(g.inv.hp||0)+1}],['🍺','Sör',600,g=>{g.inv.beer=(g.inv.beer||0)+1}],['🔫','Lőszer a fegyveredhez',700,g=>{g.res[g.wp]=(g.res[g.wp]||0)+WPN[g.wp].mag*2}]];window._x60items=items;
  v.innerHTML=hd('🛒 Gyorsbolt (házhoz szállítás)')+'<div class="bd"><div style="font-size:12px;opacity:.75;margin-bottom:6px">Meccspénzed: <b>'+fmt(Math.floor(g?g.cash:0))+' Ft</b> · drón szállítja ki 🚁</div>'+items.map((it,i)=>'<div class="it" onclick="x60buy('+i+')"><span>'+it[0]+'</span><div>'+it[1]+'<small>'+fmt(it[2])+' Ft</small></div></div>').join('')+'</div>';return}}
window.x60buy=i=>{const g=G,it=(window._x60items||[])[i];if(!g||!it)return;if(g.cash<it[2]){try{say('Nincs elég közpénzed!')}catch(e){}return}g.cash-=it[2];it[3](g);try{sfx('buy')}catch(e){}try{say('🚁 Kiszállítva: '+it[1])}catch(e){}render()};
window.x60like=k=>{const p=k[0]==='m'?IG.posts[+k.slice(1)]:feed[+k.slice(1)];if(!p)return;p.liked=!p.liked;p.likes+=p.liked?1:-1;if(k[0]==='m')igSave();render()};
window.x60selfie=()=>{let src='';try{if(typeof ren!=='undefined'&&typeof scene!=='undefined'&&typeof cam!=='undefined'){ren.render(scene,cam);const c=document.createElement('canvas');c.width=320;c.height=200;c.getContext('2d').drawImage(ren.domElement,0,0,320,200);src=c.toDataURL('image/jpeg',.6)}}catch(e){}
 const g=typeof G!=='undefined'?G:null;const txt=['Itt vagyok a szigeten! 🏝️ #kozpenzroyale',(g?g.kills:0)+' kiesés és még csak most kezdtem 😎','Ki jön velem? 🔥','Napi szelfi a csatatérről 📸'][Math.floor(Math.random()*4)];
 const p={icon:'😎',user:((window.KR&&KR.acc&&KR.acc().user)||{}).name||'te',src,txt,likes:0,t:Date.now(),liked:false};IG.posts.unshift(p);igSave();render();
 let n=0;const iv=setInterval(()=>{n++;const add=Math.floor(RN(3,25)*(1+IG.fol/800));p.likes+=add;if(n%3===0){IG.fol+=Math.floor(RN(1,8));}igSave();if(PH.open&&PH.app==='ig')render();if(n>=12){clearInterval(iv);const pay=Math.min(3000,p.likes*5);try{if(G&&!G.over){G.cash+=pay;say('📸 A posztod '+fmt(p.likes)+' kedvelést kapott! +'+fmt(pay)+' Ft szponzori pénz')}}catch(e){}}},1500)};
function tick(){const t=$$('x60T'),c=$$('x60Clk'),now=new Date().toLocaleTimeString('hu-HU',{hour:'2-digit',minute:'2-digit'});if(t)t.textContent=now;if(c)c.textContent=now;const b=$$('x60Bt');if(b)b.textContent=Math.max(5,100-Math.floor(((typeof G!=='undefined'&&G&&G.t)||0)/12))}
setInterval(()=>{if(PH.open){tick();if(PH.app==='stat'||PH.app==='quest'||(PH.app==='home')||(window._x60APPS&&_x60APPS[PH.app]&&_x60APPS[PH.app].live))render()}},2000);
// a régi telefon helyett ez nyílik meg
window.phone=function(){if(typeof G==='undefined'||!G||G.phase!=='play')return;PH.open=!PH.open;G.phOpen=false;try{$$('ph').classList.remove('on')}catch(e){}
 if(PH.open){ph.style.display='block';ph.style.animation='none';void ph.offsetWidth;ph.style.animation='';if(document.pointerLockElement)document.exitPointerLock();render()}else ph.style.display='none'};
console.log('extra60 betöltve');
})();
// ===== kicsi, valósághű torkolattűz (a régi nagy textúrás gömb helyett) =====
(function(){let geo=null;const MF={};
const POOL=[];let pi=0;
window.muzzleFlash=function(x,y,z){try{if(!geo)geo=new THREE.SphereGeometry(1,8,6);const col=(typeof G!=='undefined'&&G&&WPN[G.wp]&&WPN[G.wp].col)||0xffe566;
 if(POOL.length<12)POOL.push(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending})));const m=POOL[pi=(pi+1)%POOL.length],mt=m.material;mt.color.setHex(col);mt.opacity=.85;if(m.parent)m.parent.remove(m);m.scale.setScalar(.07+Math.random()*.03);m.position.set(x,y,z);scene.add(m);
 G.ef.push({k:'flash',m,t:.05,u:()=>{mt.opacity*=.6}})}catch(e){}};})();
