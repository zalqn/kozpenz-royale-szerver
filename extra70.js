// ===== EXTRA70: prémium HUD + városnév-táblák · vape (Ó) · jetski · piráják · Közszörnyek (50 db, urnával fogható) · Konyhapárbaj (Teakert, 2 játékos) =====
(function(){
const SH_=(e,h)=>{if(e._h!==h){e._h=h;e.innerHTML=h}},SD_=(e,d)=>{if(e.style.display!==d)e.style.display=d},ST_=(e,t)=>{if(e._t!==t){e._t=t;e.textContent=t}};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x70pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x70 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>(+n||0).toLocaleString('hu-HU');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};const saveAll=()=>{try{save()}catch(e){}try{st.s('k3br',BR)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};

// =====================================================================
// PRÉMIUM BAL FELSŐ PANEL
// =====================================================================
const css=document.createElement('style');css.textContent=`
#hud .row>.pan:first-child{background:linear-gradient(135deg,#1e1b4bee,#0b1022ee 60%,#3b0764ee)!important;border:1px solid #facc1566!important;border-radius:18px!important;box-shadow:0 0 0 1px #00000088,0 8px 30px #000a,inset 0 1px 0 #ffffff22,0 0 24px #a855f733!important;padding:10px 14px 10px 64px!important;position:relative;min-width:300px}
#hud .row>.pan:first-child::before{content:'';position:absolute;left:10px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fde68a,#f59e0b 55%,#92400e);box-shadow:0 0 0 2px #fde68a,0 0 14px #f59e0b}
#x70Av{position:absolute;left:10px;top:50%;transform:translateY(-50%);width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:24px;z-index:1;pointer-events:none}
#hud .row>.pan:first-child #pn{font:20px 'Luckiest Guy',Impact!important;background:linear-gradient(90deg,#fde68a,#fff,#fbbf24);-webkit-background-clip:text;background-clip:text;color:transparent!important;letter-spacing:.5px;filter:drop-shadow(0 2px 0 #0008)}
#hud .row>.pan:first-child .bar{height:12px!important;border-radius:8px!important;background:#00000088!important;box-shadow:inset 0 1px 3px #000;position:relative;margin-top:5px!important;overflow:hidden}
#hud .row>.pan:first-child .bar i{border-radius:8px;box-shadow:inset 0 2px 0 #ffffff55;position:relative}
#hud .row>.pan:first-child .bar i::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,#ffffff44,transparent);animation:x70sh 2.4s infinite}
@keyframes x70sh{from{transform:translateX(-100%)}to{transform:translateX(200%)}}
.x70bl{position:absolute;right:6px;top:-1px;font:800 10px Rajdhani;color:#fff;text-shadow:0 1px 2px #000;z-index:2}
#x70Vape{position:fixed;inset:0;pointer-events:none;z-index:3}
.x70puff{position:absolute;border-radius:50%;filter:blur(8px);pointer-events:none}
#x70Kit{position:fixed;inset:0;z-index:62;background:#000b;display:none;align-items:center;justify-content:center}
#x70Kit>div{width:min(620px,94vw);background:linear-gradient(160deg,#422006,#1c1917);border:2px solid #f59e0b88;border-radius:20px;padding:18px;color:#fff;font:600 16px Rajdhani;box-shadow:0 20px 60px #000}
#x70Kit h2{margin:0 0 6px;font:28px 'Luckiest Guy',Impact;color:#fde68a}
#x70Kit button{display:inline-block;width:auto;border:0;border-radius:12px;padding:10px 16px;margin:4px;font:800 17px Rajdhani;cursor:pointer;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#1c1300}
#x70Kit .mt{height:26px;border-radius:13px;background:#0008;position:relative;overflow:hidden;margin:8px 0}
#x70Kit .mt i{position:absolute;top:0;bottom:0;left:0;border-radius:13px}
#x70KB{position:fixed;right:18px;bottom:130px;z-index:51;display:none}
#x70KB button{border:0;border-radius:14px;padding:10px 16px;font:20px 'Luckiest Guy',Impact;cursor:pointer;background:linear-gradient(135deg,#fde68a,#f97316);color:#3b1600;box-shadow:0 6px 0 #9a3412,0 0 20px #f9731688}
.x70dex{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:7px}.x70dex div{border-radius:12px;padding:6px 4px;text-align:center;background:#ffffff0d;font-size:12px;border:2px solid #ffffff1a}.x70dex div b{display:block;font-size:30px}.x70dex .no{opacity:.3;filter:grayscale(1)}
.x70dex .r1{border-color:#60a5fa}.x70dex .r2{border-color:#c084fc}.x70dex .r3{border-color:#fbbf24;box-shadow:0 0 10px #fbbf2466}`;document.head.appendChild(css);
const LB_=[];let hudDone=false;function hudFix(){if(hudDone)return;const p=document.querySelector('#hud .row>.pan:first-child');if(!p)return;if(p._x70){hudDone=true;return}p._x70=1;const av=document.createElement('div');av.id='x70Av';av.textContent='😎';p.appendChild(av);
 p.querySelectorAll('.bar').forEach((b,i)=>{const l=document.createElement('span');l.className='x70bl';l.id='x70bl'+i;b.appendChild(l)})}
WP('update',null,()=>{if(typeof G==='undefined'||!G)return;hudFix();const g=G;const a=$$('x70Av');if(a&&g.f&&g.f.e&&a.textContent!==g.f.e)a.textContent=g.f.e;
 const l0=LB_[0]||(LB_[0]=$$('x70bl0')),l1=LB_[1]||(LB_[1]=$$('x70bl1')),l2=LB_[2]||(LB_[2]=$$('x70bl2'));if(l0)ST_(l0,'🛡️ '+Math.max(0,Math.round(g.sh))+' / '+g.msh);if(l1)ST_(l1,'❤️ '+Math.max(0,Math.round(g.hp))+' / '+g.mhp);if(l2)ST_(l2,'⚡ ULTI '+Math.round(g.ul)+'%')});

// =====================================================================
// PRÉMIUM VÁROSNÉV-TÁBLÁK (sgn felülírása)
// =====================================================================
const SGC={};
window.sgn=function(t,x,y,z,s){try{const key=t+'|'+s;let T=SGC[key];if(!T){const c=document.createElement('canvas');const x2=c.getContext('2d');x2.font='bold 64px "Luckiest Guy",Impact,sans-serif';const w=Math.ceil(x2.measureText(t).width)+150;c.width=Math.min(2048,w);c.height=128;const cx=c.getContext('2d');
  const r=56,W=c.width,H=c.height;cx.beginPath();cx.moveTo(r,6);cx.lineTo(W-r,6);cx.quadraticCurveTo(W-6,6,W-6,r);cx.lineTo(W-6,H-r);cx.quadraticCurveTo(W-6,H-6,W-r,H-6);cx.lineTo(r,H-6);cx.quadraticCurveTo(6,H-6,6,H-r);cx.lineTo(6,r);cx.quadraticCurveTo(6,6,r,6);cx.closePath();
  const bg=cx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'rgba(30,27,75,.92)');bg.addColorStop(1,'rgba(10,10,25,.92)');cx.fillStyle=bg;cx.fill();cx.lineWidth=6;const bd=cx.createLinearGradient(0,0,W,0);bd.addColorStop(0,'#fde68a');bd.addColorStop(.5,'#f59e0b');bd.addColorStop(1,'#fde68a');cx.strokeStyle=bd;cx.stroke();
  cx.font='bold 46px sans-serif';cx.textBaseline='middle';cx.fillText('🏛️',26,H/2+3);
  cx.font='bold 60px "Luckiest Guy",Impact,sans-serif';cx.textAlign='center';cx.lineWidth=10;cx.strokeStyle='rgba(0,0,0,.7)';cx.strokeText(t,W/2+30,H/2+4);const tg=cx.createLinearGradient(0,20,0,H-20);tg.addColorStop(0,'#fff7d6');tg.addColorStop(1,'#fbbf24');cx.fillStyle=tg;cx.fillText(t,W/2+30,H/2+4);
  T=SGC[key]=new THREE.CanvasTexture(c);T.anisotropy=4;T._w=c.width}
 const m=new THREE.SpriteMaterial({map:T,transparent:true,depthTest:true,depthWrite:false});const p=new THREE.Sprite(m);const h=s*.9;p.scale.set(h*T._w/128,h,1);p.position.set(x,y,z);scene.add(p);return p}catch(e){console.error('sgn',e)}};

// =====================================================================
// VAPE (Ó gomb vagy a telefonról)
// =====================================================================
const FLV=[['🍓 Eper',[244,114,182]],['🍉 Görögdinnye',[248,113,113]],['🫐 Áfonya',[129,140,248]],['🥭 Mangó',[251,191,36]],['🌿 Menta',[110,231,183]],['🍬 Vattacukor',[216,180,254]]];let flv=0;
const vapeL=document.createElement('div');vapeL.id='x70Vape';document.body.appendChild(vapeL);let vapeCd=0;
function vape(){if(!inMatch()||performance.now()<vapeCd)return;vapeCd=performance.now()+1600;const f=FLV[flv];flv=(flv+1)%FLV.length;
 for(let i=0;i<14;i++){const p=document.createElement('div');p.className='x70puff';const s=RN(60,160);p.style.cssText+='width:'+s+'px;height:'+s+'px;left:'+(innerWidth*.5+RN(-60,60))+'px;top:'+(innerHeight*.72)+'px;background:rgba('+f[1].join(',')+','+RN(.25,.45)+');opacity:0;transition:all '+RN(1.6,2.6)+'s ease-out';vapeL.appendChild(p);
  requestAnimationFrame(()=>{p.style.opacity=1;p.style.transform='translate('+RN(-260,260)+'px,'+RN(-420,-180)+'px) scale('+RN(1.5,3)+')';setTimeout(()=>{p.style.opacity=0},700)});setTimeout(()=>p.remove(),2800)}
 try{tn(180,'sawtooth',.6,.02)}catch(e){}sayX('💨 *vapel* · íz: '+f[0]);
 // 3D felhő is (a többiek / harmadik nézet felé)
 try{const g=G;for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),new THREE.MeshBasicMaterial({color:new THREE.Color('rgb('+f[1].join(',')+')'),transparent:true,opacity:.45,depthWrite:false}));m.position.set(g.x+Math.cos(g.ang)*1.2,g.y+1.9,g.z+Math.sin(g.ang)*1.2);scene.add(m);let t=0;const vx=RN(-.6,.6),vz=RN(-.6,.6);g.ef.push({k:'vape',t:2.2,m,u:dt=>{t+=dt;m.position.x+=vx*dt;m.position.z+=vz*dt;m.position.y+=dt*.8;m.scale.setScalar(1+t*1.6);m.material.opacity=Math.max(0,.45-t*.2)}})}}catch(e){}}
window.x70vape=vape;
addEventListener('keydown',e=>{if(typing(e))return;if(e.key.toLowerCase()==='ó')vape()});

// =====================================================================
// KÖZSZÖRNYEK: 50 kitalált, politikus-paródia lény (nem valós személyek)
// =====================================================================
const MON=[
['📜','Pályázmó',0,0x60a5fa],['🧾','Számlakukac',0,0x34d399],['🪧','Plakátor',0,0xf87171],['🎤','Szónokló',0,0xfbbf24],['📎','Iratcsipesz',0,0x94a3b8],['🗳️','Urnagolyó',0,0xa78bfa],['💼','Aktatáska-Atka',0,0x78350f],['📢','Hangszórány',0,0xf472b6],['🧑‍💼','Kisfőnöcske',0,0x64748b],['🏷️','Árcédulás',0,0x22d3ee],
['📰','Hírlapocska',0,0xe5e7eb],['🖊️','Aláíró Tollas',0,0x1e40af],['☕','Kávészünetes',0,0x92400e],['📋','Jegyzőkönyvér',0,0xcbd5e1],['🪑','Székfoglaló',0,0xa16207],['🧮','Költségvetés-Kobold',1,0x16a34a],['💸','Pénzeső-Pelikán',1,0x22c55e],['🏗️','Beruházó Borz',1,0xf59e0b],['🚧','Kordonix',1,0xf97316],['🛥️','Jachtos Jaguár',1,0x0ea5e9],
['🏟️','Stadionyúl',1,0x84cc16],['🚂','Kisvasút-Vakond',1,0x7c3aed],['🧳','Kiküldetés-Kenguru',1,0xd97706],['📊','Közvélemény-Kutyusz',1,0x06b6d4],['🪙','Érmeszárnyú',1,0xeab308],['🧱','Kerítés-Krokodil',1,0x9ca3af],['📺','Tévéző Teknős',1,0x3b82f6],['🎭','Kampány-Kaméleon',1,0xec4899],['🗞️','Propaganda-Papagáj',1,0xef4444],['🏦','Bankár Borjú',1,0x1d4ed8],
['🌉','Hídavató Hód',2,0x14b8a6],['🏰','Kastélyfoglaló Kakadu',2,0xc084fc],['🛩️','Magángépes Mókus',2,0x38bdf8],['🍷','Bankettes Bagoly',2,0x9f1239],['🎩','Cilinderes Csúszómászó',2,0x111827],['🗝️','Kiskapunyitó Kecske',2,0xfacc15],['📈','Tenderhegy-Tigris',2,0xf97316],['🏝️','Offshore-Orka',2,0x0284c7],['🧥','Bundás Bizottság',2,0x7c2d12],['⚖️','Mérlegelő Medve',2,0x6b7280],
['🔔','Csengős Szavazó',2,0xfde047],['🎪','Rendezvény-Rozmár',2,0xdb2777],['🧨','Botrány-Bölény',2,0xb91c1c],['🛰️','Megfigyelő Majom',2,0x475569],['👑','Közpénz-Király',3,0xfbbf24],['🐉','Költségvetési Sárkány',3,0x16a34a],['🌋','Rezsi-Főnix',3,0xf97316],['💎','Gyémánt Lobbista',3,0x93c5fd],['🦄','Választási Egyszarvú',3,0xf0abfc],['🌌','Örökös Mandátum',3,0x6366f1]];
const RAR=[['közönséges',.75,'#b0b8c4'],['ritka',.5,'#60a5fa'],['epikus',.3,'#c084fc'],['legendás',.15,'#fbbf24']];
const DEX=LSg('k3x70dex',{});const dexSave=()=>LSs('k3x70dex',DEX);window._x70DEX=DEX;window._x70MON=MON;
function showDex(){const n=Object.keys(DEX).length;const h='<h2>📕 KÖZDEX ('+n+'/50)</h2><div style="opacity:.8;font-size:14px">A Battle Royale szigeten Közszörnyek kóborolnak. Menj oda hozzájuk (5 m), és nyomd meg az <b>E</b>-t: urnát dobsz rájuk! Meccsenként 10 urnád van. Minden befogott Közszörny +500 Ft, újnál +50 🪙. Teljes Közdex: 200 000 Ft + 5000 🪙.</div><div class="x70dex" style="margin-top:8px">'+
 MON.map((m,i)=>'<div class="r'+m[2]+(DEX[i]?'':' no')+'"><b>'+(DEX[i]?m[0]:'❔')+'</b>'+(DEX[i]?esc(m[1])+'<br><small style="color:'+RAR[m[2]][2]+'">'+RAR[m[2]][0]+'</small>'+(DEX[i]>1?' ×'+DEX[i]:''):'#'+(i+1))+'</div>').join('')+'</div>';
 const B=$$('x20MB');if(!B)return;B.innerHTML=h+'<div style="text-align:right;margin-top:10px"><button onclick="x20hub()">◀ VISSZA</button><button onclick="x20close()">BEZÁR</button></div>';$$('x20M').style.display='flex'}
window.x70dex=showDex;
function monModel(m){const g=new THREE.Group();const col=m[3];const body=new THREE.Mesh(new THREE.SphereGeometry(.9,18,14),new THREE.MeshStandardMaterial({color:col,roughness:.45,metalness:.1}));body.scale.set(1,1.15,1);body.position.y=1.1;g.add(body);
 const belly=new THREE.Mesh(new THREE.SphereGeometry(.62,16,12),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.6}));belly.scale.set(1,1.1,.5);belly.position.set(0,1,.55);g.add(belly);
 const tie=new THREE.Mesh(new THREE.ConeGeometry(.14,.55,4),new THREE.MeshStandardMaterial({color:0xdc2626}));tie.rotation.x=Math.PI;tie.position.set(0,1.25,.85);g.add(tie);
 [-.3,.3].forEach(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10),new THREE.MeshStandardMaterial({color:0xffffff}));e.position.set(x,1.7,.68);g.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),new THREE.MeshBasicMaterial({color:0x111111}));p.position.set(x,1.7,.83);g.add(p)});
 [-.45,.45].forEach(x=>{const f=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshStandardMaterial({color:col}));f.scale.set(1,.6,1.4);f.position.set(x,.2,.2);g.add(f)});
 if(m[2]>=2){const cr=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,.3,8),new THREE.MeshStandardMaterial({color:0xfacc15,metalness:.9,roughness:.2,emissive:0x553300}));cr.position.y=2.3;g.add(cr)}
 const lb=spr(m[0]+' '+m[1],1.1,'x');lb.position.y=2.9;g.add(lb);
 if(m[2]===3){const aura=new THREE.Mesh(new THREE.SphereGeometry(1.6,16,12),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.18,depthWrite:false}));aura.position.y=1.2;g.add(aura)}
 return g}

// =====================================================================
// MECCS: jetski, piráják, Közszörnyek
// =====================================================================
let Z=null;let SPG_=null;
function landPt(){const R=G.arh?400:48;for(let i=0;i<500;i++){const x=RN(-R,R),z=RN(-R,R);if(G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<50&&z>-44)return[x,z]}return[0,0]}
function shore(){if(!G.arh)return null;for(let k=0;k<300;k++){const a=Math.random()*6.283;let x=Math.cos(a)*20,z=Math.sin(a)*20;if(!hin(x,z))continue;for(let d=20;d<470;d+=3){const nx=Math.cos(a)*d,nz=Math.sin(a)*d;if(!hin(nx,nz))return[Math.cos(a)*(d+5),Math.sin(a)*(d+5),a]}}return null}
function addO(o){scene.add(o);Z.objs.push(o);return o}
function jetski(x,z,a){const g=new THREE.Group();const hull=new THREE.Mesh(new THREE.BoxGeometry(1.1,.5,2.6),new THREE.MeshStandardMaterial({color:0xfacc15,roughness:.35,metalness:.2}));hull.position.y=.25;
 const nose=new THREE.Mesh(new THREE.ConeGeometry(.55,1,4),new THREE.MeshStandardMaterial({color:0xfacc15,roughness:.35}));nose.rotation.x=Math.PI/2;nose.rotation.y=Math.PI/4;nose.position.set(0,.25,1.75);
 const seat=new THREE.Mesh(new THREE.BoxGeometry(.6,.25,1.1),new THREE.MeshStandardMaterial({color:0x111827}));seat.position.set(0,.6,-.3);const bar=new THREE.Mesh(new THREE.BoxGeometry(.9,.08,.08),new THREE.MeshStandardMaterial({color:0x9ca3af,metalness:.8}));bar.position.set(0,1,.5);
 const stripe=new THREE.Mesh(new THREE.BoxGeometry(1.12,.12,2.2),new THREE.MeshStandardMaterial({color:0x1d4ed8}));stripe.position.y=.35;g.add(hull,nose,seat,bar,stripe);
 const lb=spr('🚤 JETSKI [E]',1.8,'x');lb.position.y=2.4;g.add(lb);g.position.set(x,0,z);g.rotation.y=a;addO(g);return{x,z,a,v:0,m:g,lb}}
function fish(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.SphereGeometry(.35,10,8),new THREE.MeshStandardMaterial({color:0x6b7280,metalness:.6,roughness:.3}));b.scale.set(.6,1,1.6);g.add(b);
 const belly=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),new THREE.MeshStandardMaterial({color:0xdc2626}));belly.scale.set(.55,.7,1.3);belly.position.y=-.12;g.add(belly);
 const t=new THREE.Mesh(new THREE.ConeGeometry(.25,.4,4),new THREE.MeshStandardMaterial({color:0x4b5563}));t.rotation.x=-Math.PI/2;t.position.z=-.65;g.add(t);
 const jaw=new THREE.Mesh(new THREE.BoxGeometry(.3,.08,.2),new THREE.MeshBasicMaterial({color:0xffffff}));jaw.position.set(0,-.05,.5);g.add(jaw);return g}
WP('launch',null,()=>{try{if(Z)Z.objs.forEach(o=>o.parent&&o.parent.remove(o))}catch(e){}Z={objs:[],jets:[],drive:null,pir:[],mons:[],urn:10,t:0,bite:0,throws:[]};
 setTimeout(()=>{if(!normal()||!Z)return;
  for(let i=0;i<(G.arh?3:0);i++){const s=shore();if(s)Z.jets.push(jetski(s[0],s[1],s[2]+Math.PI/2))}
  // piráják: rajok a part mentén
  for(let k=0;k<(G.arh?7:0);k++){const s=shore();if(!s)continue;const sx=s[0]+Math.cos(s[2])*10,sz=s[1]+Math.sin(s[2])*10;for(let i=0;i<5;i++){const f=fish();f.position.set(sx,-.3,sz);addO(f);Z.pir.push({m:f,cx:sx,cz:sz,a:Math.random()*6.28,r:RN(2,6),sp:RN(1,2.2),jump:0,ph:Math.random()*6})}}
  // Közszörnyek
  const n=G.arh?12:5;for(let i=0;i<n;i++){const r=Math.random();const rar=r<.04?3:r<.16?2:r<.45?1:0;const pool=MON.map((m,j)=>j).filter(j=>MON[j][2]===rar);const id=pool[Math.floor(Math.random()*pool.length)];const[x,z]=landPt();const m=monModel(MON[id]);m.position.set(x,0,z);addO(m);Z.mons.push({id,m,x,z,a:Math.random()*6.28,t:0,caught:false})}
  sayX('📕 Közszörnyek kóborolnak a szigeten! Menj oda és nyomd meg az E-t: urnát dobsz rájuk (10 urnád van)!'+(G.arh?' 🚤 A parton jetskik várnak, de vigyázz: PIRÁJÁK a vízben!':''))},4000)});
function tryCatch(mo){if(Z.urn<=0){sayX('🗳️ Elfogytak az urnáid!');return}Z.urn--;const m=MON[mo.id];const g=G;
 const urn=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(.6,.7,.6),new THREE.MeshStandardMaterial({color:0xf8fafc,metalness:.2}));const top=new THREE.Mesh(new THREE.BoxGeometry(.66,.1,.66),new THREE.MeshStandardMaterial({color:0xdc2626}));top.position.y=.38;const sl=new THREE.Mesh(new THREE.BoxGeometry(.3,.02,.06),new THREE.MeshBasicMaterial({color:0x111111}));sl.position.y=.44;urn.add(b,top,sl);
 urn.position.set(g.x,g.y+1.6,g.z);scene.add(urn);mo.busy=true;let t=0;const sx=g.x,sz=g.z,sy=g.y+1.6;const ok=Math.random()<RAR[m[2]][1];
 g.ef.push({k:'urn',t:3.2,m:urn,u:dt=>{t+=dt;if(t<.6){const k=t/.6;urn.position.set(sx+(mo.x-sx)*k,sy+(1-sy)*k+Math.sin(k*Math.PI)*3,sz+(mo.z-sz)*k);urn.rotation.x+=dt*12}
  else if(t<.8){mo.m.scale.setScalar(Math.max(.01,1-(t-.6)*5));urn.position.set(mo.x,.35,mo.z);urn.rotation.set(0,0,0)}
  else if(t<2.6){urn.rotation.z=Math.sin(t*16)*.35*(Math.floor((t-.8)/.6)%2?1:.4)}
  else if(!mo.done){mo.done=true;mo.busy=false;if(ok){mo.caught=true;scene.remove(mo.m);const isNew=!DEX[mo.id];DEX[mo.id]=(DEX[mo.id]||0)+1;dexSave();g.cash+=500;if(isNew){try{BR.zs+=50;saveAll()}catch(e){}}
    sayX('🎉 BEFOGTAD: '+m[0]+' '+m[1]+' ('+RAR[m[2]][0]+')!'+(isNew?' ÚJ a Közdexben! ('+Object.keys(DEX).length+'/50)':''));try{sfx('win')}catch(e){}
    if(Object.keys(DEX).length===50&&!LSg('k3x70dexDone',0)){LSs('k3x70dexDone',1);try{S.c+=200000;BR.zs+=5000;saveAll()}catch(e){}sayX('🏆 TELJES KÖZDEX! +200 000 Ft, +5000 🪙')}}
   else{mo.m.scale.setScalar(1);mo.a+=Math.PI;sayX('💨 '+m[1]+' kiszabadult az urnából! (urnák: '+Z.urn+')');try{sfx('click')}catch(e){}}}}});
 try{tn(600,'triangle',.2,.08)}catch(e){}}
// E-lánc
const oNear=window.x20near;window.x20near=function(){if(Z&&normal()){const g=G;
  if(Z.drive){exitJet();return true}
  const j=Z.jets.find(j=>Math.hypot(j.x-g.x,j.z-g.z)<6);if(j){Z.drive=j;j.lb.visible=false;j.v=0;sayX('🚤 Jetski! W/S gáz, A/D kormány, E kiszállás a parton. Ne lassíts le a piráják között!');return true}
  const mo=Z.mons.find(m=>!m.caught&&!m.busy&&Math.hypot(m.x-g.x,m.z-g.z)<5.5);if(mo){tryCatch(mo);return true}}
 return oNear?oNear():false};
function exitJet(){const v=Z.drive,g=G;let ok=null;for(let r=3;r<14&&!ok;r+=1.5)for(let a=0;a<6.28;a+=.35){const x=v.x+Math.cos(a)*r,z=v.z+Math.sin(a)*r;if(hin(x,z)){ok=[x,z];break}}if(!ok){sayX('🌊 Itt nem tudsz kiszállni: menj közelebb a parthoz!');return}g.x=ok[0];g.z=ok[1];g.y=0;Z.drive=null;v.v=0;v.lb.visible=true}
const pr=document.createElement('div');pr.style.cssText='position:fixed;left:50%;top:70%;transform:translateX(-50%);z-index:6;background:#000b;color:#fff;font:700 16px Rajdhani;padding:5px 12px;border-radius:10px;display:none;pointer-events:none';document.body.appendChild(pr);
const uHud=document.createElement('div');uHud.style.cssText='position:fixed;right:14px;bottom:205px;z-index:4;background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:4px 10px;font:700 14px Rajdhani;color:#fff;display:none;pointer-events:none';document.body.appendChild(uHud);
WP('update',null,a=>{if(!Z||typeof G==='undefined'||!G||G.over)return;const g=G,dt=Math.min(.1,a[0]||.016);Z.t+=dt;if(!normal()){SD_(pr,'none');SD_(uHud,'none');return}
 SD_(uHud,Z.mons.length?'block':'none');SH_(uHud,'🗳️ Urna: <b style="color:#facc15">'+Z.urn+'</b> · 📕 '+Object.keys(DEX).length+'/50 · 💨 [Ó]');
 // jetski vezetés
 const v=Z.drive;if(v){const th=((keys.w||keys.arrowup)?1:0)-((keys.s||keys.arrowdown)?1:0),st=((keys.a||keys.arrowleft)?1:0)-((keys.d||keys.arrowright)?1:0);
  v.v+=th*22*dt;v.v*=1-dt*(th?.25:.9);v.v=Math.max(-6,Math.min(38,v.v));v.a+=st*dt*2.2*Math.min(1,Math.abs(v.v)/5)*Math.sign(v.v||1);
  const nx=v.x+Math.sin(v.a)*v.v*dt,nz=v.z+Math.cos(v.a)*v.v*dt;if(!hin(nx,nz)&&Math.hypot(nx,nz)<520){v.x=nx;v.z=nz}else v.v*=-.3;
  v.m.position.set(v.x,Math.sin(Z.t*5)*.15+Math.min(.5,Math.abs(v.v)/80),v.z);v.m.rotation.set(-Math.min(.25,v.v/120),v.a,st*.25*Math.min(1,v.v/15));g.x=v.x;g.z=v.z;g.y=.6;g.vx=g.vz=g.vy=0;
  if(Math.abs(v.v)>14&&Math.random()<.4){const sp=new THREE.Mesh(SPG_||(SPG_=new THREE.SphereGeometry(.25,6,5)),new THREE.MeshBasicMaterial({color:0xe0f2fe,transparent:true,opacity:.8}));sp.position.set(v.x-Math.sin(v.a)*1.5,.2,v.z-Math.cos(v.a)*1.5);scene.add(sp);let t=0;g.ef.push({k:'spl',t:.6,m:sp,u:d=>{t+=d;sp.position.y+=d*2;sp.material.opacity=Math.max(0,.8-t*1.4)}})}}
 // piráják
 let near=0;Z.pir.forEach(p=>{p.ph+=dt;p.a+=dt*p.sp/p.r;let tx=p.cx+Math.cos(p.a)*p.r,tz=p.cz+Math.sin(p.a)*p.r;
  const inW=Z.drive||false;const d=Math.hypot(g.x-p.cx,g.z-p.cz);if(inW&&d<18){tx=g.x+Math.cos(p.a*3)*1.5;tz=g.z+Math.sin(p.a*3)*1.5;if(Math.hypot(g.x-p.m.position.x,g.z-p.m.position.z)<3)near++}
  p.m.position.x+=(tx-p.m.position.x)*Math.min(1,dt*3);p.m.position.z+=(tz-p.m.position.z)*Math.min(1,dt*3);p.m.rotation.y=Math.atan2(tx-p.m.position.x,tz-p.m.position.z);
  if(p.jump<=0&&Math.random()<dt*.15)p.jump=1;if(p.jump>0){p.jump-=dt*1.6;p.m.position.y=.02+Math.sin((1-p.jump)*Math.PI)*1.4;p.m.rotation.x=-Math.cos((1-p.jump)*Math.PI)*.8}else{p.m.position.y=.02+Math.sin(p.ph*4)*.05;p.m.rotation.x=0}});
 if(near&&Z.drive&&Math.abs(Z.drive.v)<6){Z.bite-=dt;if(Z.bite<=0){Z.bite=.7;hurt(4*near,true);sayX('🐟 PIRÁJÁK HARAPNAK! Gyorsíts!');try{tn(220,'square',.06,.1)}catch(e){}}}
 // Közszörnyek kóborlása
 Z.mons.forEach(mo=>{if(mo.caught||mo.busy)return;mo.t+=dt;if(Math.random()<dt*.3)mo.a+=RN(-1.5,1.5);const nx=mo.x+Math.cos(mo.a)*dt*1.4,nz=mo.z+Math.sin(mo.a)*dt*1.4;const ok=G.arh?hin(nx,nz):Math.hypot(nx,nz)<50;if(ok){mo.x=nx;mo.z=nz}else mo.a+=Math.PI;
  mo.m.position.set(mo.x,Math.abs(Math.sin(mo.t*5))*.25,mo.z);mo.m.rotation.y=-mo.a+Math.PI/2});
 // felirat
 let t='';if(Z.drive)t='<b>[E]</b> Kiszállás (a parton)';else{const j=Z.jets.find(j=>Math.hypot(j.x-g.x,j.z-g.z)<6);const mo=Z.mons.find(m=>!m.caught&&!m.busy&&Math.hypot(m.x-g.x,m.z-g.z)<5.5);if(j)t='<b>[E]</b> Jetskire ülés';else if(mo)t='<b>[E]</b> Urnadobás: '+MON[mo.id][0]+' '+MON[mo.id][1]+' ('+Math.round(RAR[MON[mo.id][2]][1]*100)+'% esély)'}
 SH_(pr,t);SD_(pr,t?'block':'none')});
WP('end',null,()=>{pr.style.display='none';uHud.style.display='none';if(Z)Z.drive=null});

// =====================================================================
// KONYHAPÁRBAJ a Teakertben (2 játékos): rántott hús + kolbásztöltés
// =====================================================================
const kit=document.createElement('div');kit.id='x70Kit';kit.innerHTML='<div id="x70KitB"></div>';document.body.appendChild(kit);
const kb=document.createElement('div');kb.id='x70KB';kb.innerHTML='<button>🍳 KONYHAPÁRBAJ</button>';document.body.appendChild(kb);kb.onclick=()=>kOpen();
const me=()=>{try{return(window._CS&&_CS.ME&&(_CS.ME.name||_CS.ME.n))||((KR.acc().user)||{}).name}catch(e){return''}};
const csAct=(a,v)=>{try{KR.wsend({t:'cs_act',a,v})}catch(e){}};
let KD={st:'idle',opp:null,my:0,op:null,opP:0};
setInterval(()=>{const on=!!document.querySelector('#cs.on')&&!inMatch();kb.style.display=on?'block':'none';if(!on&&KD.st!=='idle'&&KD.st!=='done'){/* elhagyta a teret */}},700);
function kShow(h){$$('x70KitB').innerHTML=h;kit.style.display='flex'}
function kClose(){kit.style.display='none';if(KD.st!=='play')KD.st='idle'}
window.x70kclose=kClose;
function players(){try{return Object.keys(_CS.P||{}).map(k=>{const p=_CS.P[k];return(p&&(p.name||p.n))||k}).filter(n=>n&&n!==me())}catch(e){return[]}}
function kOpen(){const pl=players();kShow('<h2>🍳 KONYHAPÁRBAJ</h2><div style="opacity:.85">Két szakács, két feladat: <b>🥩 rántotthús-sütés</b> (panírozás + sütés aranybarnára) és <b>🌭 kolbásztöltés</b> (töltsd meg, de ne pukkanjon ki!). A nagyobb pontszám nyer: <b>+300 🪙</b>, a vesztes +50 🪙.</div>'+
 '<h3 style="color:#fde68a;margin:10px 0 4px">Kit hívsz ki? (Teakert)</h3>'+(pl.length?pl.map(n=>'<button onclick="x70kinv(\''+esc(n)+'\')">⚔️ '+esc(n)+'</button>').join(''):'<div style="opacity:.7">Most nincs más a Teakertben. A párbajhoz 2 játékos kell: hívj be egy barátot!</div>')+
 '<div style="text-align:right;margin-top:10px"><button style="background:#44403c;color:#fff" onclick="x70kclose()">BEZÁR</button></div>')}
window.x70kinv=n=>{KD={st:'wait',opp:n,my:0,op:null,opP:0,host:true};csAct('mg','inv|'+n.slice(0,18));kShow('<h2>🍳 KIHÍVÁS ELKÜLDVE</h2><div>Várunk rá: <b>'+esc(n)+'</b>…</div><div style="text-align:right"><button style="background:#44403c;color:#fff" onclick="x70kclose()">MÉGSE</button></div>')};
window.x70kacc=()=>{if(KD.st!=='invited')return;csAct('mg','acc|'+KD.opp.slice(0,18));KD.st='ready';kShow('<h2>🍳 ELFOGADVA</h2><div>Mindjárt indul…</div>')};
addEventListener('krws',e=>{const m=e.detail;if(!m||m.t!=='cs_act'||m.a!=='mg')return;const v=String(m.v||''),[k,arg]=[v.split('|')[0],v.split('|').slice(1).join('|')];const from=m.name;
 if(k==='inv'&&arg===me().slice(0,18)&&KD.st!=='play'){KD={st:'invited',opp:from,my:0,op:null,opP:0};kShow('<h2>🍳 KIHÍVÁS!</h2><div><b>'+esc(from)+'</b> konyhapárbajra hív!</div><button onclick="x70kacc()">✅ ELFOGADOM</button><button style="background:#44403c;color:#fff" onclick="x70kclose()">❌ NEM</button>')}
 else if(k==='acc'&&KD.st==='wait'&&from===KD.opp&&arg===me().slice(0,18)){csAct('mg','go|'+from.slice(0,18));startDuel()}
 else if(k==='go'&&KD.st==='ready'&&from===KD.opp&&arg===me().slice(0,18))startDuel()
 else if(k==='pr'&&from===KD.opp){KD.opP=+arg||0;const el=$$('x70op');if(el)el.style.width=Math.min(100,KD.opP)+'%'}
 else if(k==='sc'&&from===KD.opp){KD.op=+arg||0;fin()}});
// --- a játék ---
let G2=null;
function startDuel(){KD.st='play';KD.my=0;KD.op=null;let c=3;const cd=()=>{kShow('<h2>🍳 '+esc(me())+' vs '+esc(KD.opp)+'</h2><div style="font:80px \'Luckiest Guy\',Impact;text-align:center;color:#fde68a">'+(c||'RAJT!')+'</div>');if(c-->0)setTimeout(cd,1000);else setTimeout(stage1,600)};cd()}
function oppBar(){return'<div style="font-size:13px;opacity:.8">Ellenfél ('+esc(KD.opp)+') haladása:</div><div class="mt" style="height:10px"><i id="x70op" style="width:'+Math.min(100,KD.opP)+'%;background:#f87171"></i></div>'}
function prog(p){csAct('mg','pr|'+Math.round(p))}
// 1. szakasz: panírozás (helyes sorrend: liszt → tojás → morzsa), 2 szelet, majd sütés
function stage1(){G2={slice:0,step:0,t0:performance.now(),pts:0,errs:0};panir()}
function panir(){const ord=['🌾 LISZT','🥚 TOJÁS','🍞 MORZSA'];const sh=[0,1,2].sort(()=>Math.random()-.5);
 kShow('<h2>🥩 1/3 · PANÍROZÁS ('+(G2.slice+1)+'. szelet)</h2><div>Kattints a helyes sorrendben: <b>liszt → tojás → morzsa</b>! Hibánként −20 pont.</div><div style="font-size:60px;text-align:center;margin:8px">🥩'+['','🌾','🥚','🍞'].slice(1,G2.step+1).join('')+'</div><div style="text-align:center">'+sh.map(i=>'<button onclick="x70pan('+i+')">'+ord[i]+'</button>').join('')+'</div>'+oppBar())}
window.x70pan=i=>{if(!G2)return;if(i===G2.step){G2.step++;G2.pts+=40;try{tn(700+G2.step*120,'sine',.08,.06)}catch(e){}if(G2.step===3){G2.step=0;fry()}else panir()}else{G2.pts-=20;G2.errs++;try{tn(160,'square',.15,.08)}catch(e){}panir()}prog((G2.slice*2+G2.step/3)/8*100)};
function fry(){let v=0,dir=1,done=false;const sp=RN(28,42);
 kShow('<h2>🍳 2/3 · SÜTÉS ('+(G2.slice+1)+'. szelet)</h2><div>Vedd ki, amikor <b style="color:#fbbf24">ARANYBARNA</b>! (a zöld sáv)</div><div class="mt"><i style="left:58%;width:16%;background:#16a34a88"></i><i id="x70fr" style="width:4px;background:#fff;left:0"></i></div><div style="font-size:70px;text-align:center" id="x70ms">🥩</div><div style="text-align:center"><button id="x70out">🍽️ KIVESZEM!</button></div>'+oppBar());
 const st=performance.now();const iv=setInterval(()=>{if(done||!$$('x70fr')){clearInterval(iv);return}v=Math.min(100,(performance.now()-st)/1000*sp);$$('x70fr').style.left=v+'%';const e=$$('x70ms');if(e){e.style.filter='sepia('+v/100+') saturate('+(1+v/60)+') brightness('+(1.2-v/150)+')'}if(v>=100){take()}},30);
 const take=()=>{if(done)return;done=true;clearInterval(iv);let p;if(v>=58&&v<=74)p=200-Math.abs(66-v)*6;else if(v<58)p=Math.max(0,v*1.2);else p=Math.max(0,120-(v-74)*6);G2.pts+=Math.round(p);
  const msg=v>=58&&v<=74?'🤩 Tökéletes aranybarna! +'+Math.round(p):v<58?'😕 Még nyers… +'+Math.round(p):'🔥 Odaégett! +'+Math.round(p);kShow('<h2>🍳 '+msg+'</h2>'+oppBar());G2.slice++;prog(G2.slice/2*50);setTimeout(()=>{if(G2.slice<2)panir();else stage2()},1300)};
 $$('x70out').onclick=take}
// 3. szakasz: kolbásztöltés (nyomva tartás, nyomásfigyelés)
function stage2(){let fill=0,pr=0,hold=false,done=false,bursts=0;const st=performance.now(),lim=18;
 kShow('<h2>🌭 3/3 · KOLBÁSZTÖLTÉS</h2><div>Tartsd lenyomva a gombot (vagy a SZÓKÖZT) a töltéshez! Ha a <b style="color:#ef4444">nyomás</b> túl nagy, kipukkad a bél. Idő: <b id="x70tm">18</b> mp</div>'+
 '<div>Töltöttség</div><div class="mt"><i id="x70fl" style="background:linear-gradient(90deg,#b45309,#dc2626);width:0"></i></div><div>Nyomás</div><div class="mt"><i style="left:80%;width:20%;background:#ef444455"></i><i id="x70pr" style="background:#facc15;width:0"></i></div>'+
 '<div style="font-size:60px;text-align:center" id="x70ss">🌭</div><div style="text-align:center"><button id="x70crk" style="font-size:22px;padding:14px 30px">⚙️ TEKERD!</button></div>'+oppBar());
 const b=$$('x70crk');const on=()=>hold=true,off=()=>hold=false;b.onmousedown=on;b.onmouseup=off;b.onmouseleave=off;b.ontouchstart=on;b.ontouchend=off;
 const kd=e=>{if(e.code==='Space'){e.preventDefault();hold=true}},ku=e=>{if(e.code==='Space')hold=false};addEventListener('keydown',kd);addEventListener('keyup',ku);
 const iv=setInterval(()=>{if(done)return;const t=(performance.now()-st)/1000;if(hold){pr+=2.6+Math.random()*1.4;fill+=pr>40?.9:.5}else pr=Math.max(0,pr-4.5);
  if(pr>=100){bursts++;fill=Math.max(0,fill-25);pr=0;hold=false;const s=$$('x70ss');if(s){s.textContent='💥';setTimeout(()=>{if($$('x70ss'))$$('x70ss').textContent='🌭'},500)}try{tn(120,'sawtooth',.3,.12)}catch(e){}}
  fill=Math.min(100,fill);const f=$$('x70fl'),p=$$('x70pr'),tm=$$('x70tm');if(f)f.style.width=fill+'%';if(p){p.style.width=pr+'%';p.style.background=pr>80?'#ef4444':'#facc15'}if(tm)tm.textContent=Math.max(0,Math.ceil(lim-t));
  if(Math.random()<.1)prog(50+fill/2);
  if(fill>=100||t>=lim){done=true;clearInterval(iv);removeEventListener('keydown',kd);removeEventListener('keyup',ku);const sp=Math.round(fill*3+(fill>=100?(lim-t)*20:0)-bursts*40);G2.pts+=Math.max(0,sp);
   KD.my=Math.max(0,Math.round(G2.pts));csAct('mg','sc|'+KD.my);prog(100);kShow('<h2>🌭 '+(fill>=100?'Kész a kolbász!':'Lejárt az idő!')+'</h2><div style="font-size:22px">A te pontszámod: <b style="color:#fde68a">'+KD.my+'</b></div><div id="x70wait">Várjuk '+esc(KD.opp)+' eredményét…</div>');KD.st='sent';fin()}},50)}
function fin(){if(KD.st!=='sent'||KD.op===null)return;KD.st='done';const w=KD.my>KD.op,dr=KD.my===KD.op;try{BR.zs+=w?300:50;saveAll()}catch(e){}
 kShow('<h2>'+(w?'🏆 GYŐZTÉL!':dr?'🤝 DÖNTETLEN!':'😢 VESZTETTÉL')+'</h2><div style="font-size:20px">'+esc(me())+': <b>'+KD.my+'</b> · '+esc(KD.opp)+': <b>'+KD.op+'</b></div><div>'+(w?'+300 🪙':'+50 🪙')+'</div><div style="text-align:right"><button onclick="x70kinv(\''+esc(KD.opp)+'\')">🔁 VISSZAVÁGÓ</button><button style="background:#44403c;color:#fff" onclick="x70kclose()">BEZÁR</button></div>')}

// Közösség-hub: Közdex gomb
const oh=window.x20hub;if(typeof oh==='function'){window.x20hub=function(){oh();const g=document.querySelector('#x20MB div[style*="grid"]');if(!g)return;const b=document.createElement('button');b.className='y';b.style.cssText='padding:16px;font-size:18px';b.textContent='📕 KÖZDEX ('+Object.keys(DEX).length+'/50)';b.onclick=showDex;g.appendChild(b)};
 const bi=setInterval(()=>{const b=$$('x20B');if(!b)return;clearInterval(bi);b.onclick=window.x20hub},1600)}
// telefon: vape gomb a gyorsboltban
window._x70Z=()=>Z;window._x70KD=()=>KD;
console.log('extra70 betöltve');
})();
