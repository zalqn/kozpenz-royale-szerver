// ===== PRÉMIUM KINÉZET: felület, égbolt, fények, harci visszajelzés =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};

// ---------- 1) FELÜLET (CSS) ----------
const css=document.createElement('style');css.textContent=`
:root{--c:#38e1ff;--y:#ffd23f;--p:#a78bfa;--r:#ff4d6d;--g:#2ee59d;--glass:rgba(14,18,34,.62);--edge:rgba(255,255,255,.14)}
body{font-family:Rajdhani}.s{justify-content:flex-start!important}.s>.card{margin:auto}
body{font-family:Rajdhani,Arial,sans-serif;letter-spacing:.3px}
.s{background:radial-gradient(1200px 700px at 15% 10%,#3b1d6e 0%,transparent 60%),radial-gradient(1000px 800px at 90% 90%,#0b4f6c 0%,transparent 55%),linear-gradient(160deg,#070914,#0d1024 55%,#050611)!important}
.s::before{content:"";position:fixed;inset:-20%;background:conic-gradient(from 0deg at 50% 50%,#ff4d6d22,#38e1ff22,#ffd23f22,#a78bfa22,#ff4d6d22);filter:blur(80px);animation:prSpin 28s linear infinite;pointer-events:none}
.s::after{content:"";position:absolute;inset:0;background-image:radial-gradient(#ffffff12 1px,transparent 1px);background-size:26px 26px;mask-image:linear-gradient(transparent,#000 30%,#000 70%,transparent);pointer-events:none}
@keyframes prSpin{to{transform:rotate(360deg)}}
.card{position:relative;z-index:1;background:var(--glass)!important;backdrop-filter:blur(18px) saturate(140%);-webkit-backdrop-filter:blur(18px) saturate(140%);border:1px solid var(--edge)!important;border-radius:24px!important;box-shadow:0 30px 80px #0009,inset 0 1px 0 #ffffff22,0 0 0 1px #ffd23f22!important;animation:prIn .45s cubic-bezier(.2,.9,.3,1.2)}
@keyframes prIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
h1{background:linear-gradient(180deg,#fff6c9,#ffd23f 45%,#ff9f1c);-webkit-background-clip:text;background-clip:text;color:transparent!important;text-shadow:none!important;filter:drop-shadow(0 4px 0 #0008) drop-shadow(0 0 22px #ffb70366);letter-spacing:1px}
h2{color:#9eeaff!important;text-shadow:0 0 18px #38e1ff55}
.b{position:relative;overflow:hidden;border:0!important;border-radius:14px!important;background:linear-gradient(180deg,#ffe066,#ffb703 55%,#fb8500)!important;box-shadow:0 6px 0 #9a4a00,0 10px 24px #ffb70355,inset 0 1px 0 #fff8!important;transition:transform .12s,box-shadow .12s,filter .12s;color:#1a1200!important}
.b:hover{transform:translateY(-2px);filter:brightness(1.08);box-shadow:0 8px 0 #9a4a00,0 14px 30px #ffb70377,inset 0 1px 0 #fff8!important}
.b:active{transform:translateY(4px)!important;box-shadow:0 2px 0 #9a4a00!important}
.b::after{content:"";position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(100deg,transparent,#ffffff66,transparent);transform:skewX(-20deg);transition:left .5s}
.b:hover::after{left:120%}
.b.c{background:linear-gradient(180deg,#7df9ff,#22c3e6 55%,#0e8fb3)!important;box-shadow:0 6px 0 #075a72,0 10px 24px #22c3e655,inset 0 1px 0 #fff8!important;color:#001a22!important}
.b.p{background:linear-gradient(180deg,#c4b5fd,#8b5cf6 55%,#6d28d9)!important;box-shadow:0 6px 0 #3b1a80,0 10px 24px #8b5cf655,inset 0 1px 0 #fff6!important;color:#fff!important}
.b.r{background:linear-gradient(180deg,#ff8fa3,#ff4d6d 55%,#c9184a)!important;box-shadow:0 5px 0 #7a0f2e,inset 0 1px 0 #fff6!important;color:#fff!important}
.b:disabled{filter:grayscale(.8) brightness(.7)}
.it{background:linear-gradient(160deg,#1b2140cc,#0c1022cc)!important;border:1px solid #ffffff1c!important;border-radius:16px!important;transition:transform .15s,box-shadow .15s,border-color .15s}
.it:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 30px #0008,0 0 0 1px #38e1ff66;border-color:#38e1ff88!important}
.it.sel{border-color:var(--y)!important;box-shadow:0 0 0 2px var(--y),0 0 30px #ffd23f55!important}
#hud .pan{background:linear-gradient(160deg,#0e1430d9,#070a18d9)!important;backdrop-filter:blur(10px);border:1px solid #ffffff22!important;border-radius:14px!important;box-shadow:0 10px 30px #0007,inset 0 1px 0 #ffffff1a}
.bar{height:12px!important;border-radius:8px!important;background:#ffffff14!important;box-shadow:inset 0 1px 3px #000a;position:relative}
.bar i{border-radius:8px;transition:width .25s cubic-bezier(.2,.8,.2,1);box-shadow:0 0 12px currentColor;position:relative}
.bar i::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#ffffff55,transparent 60%);border-radius:8px}
#sb{background:linear-gradient(90deg,#1e90ff,#38e1ff)!important;color:#38e1ff}#hb{background:linear-gradient(90deg,#16c172,#2ee59d)!important;color:#2ee59d}#ub{background:linear-gradient(90deg,#ff9f1c,#ffd23f)!important;color:#ffd23f}
#ann{font-size:clamp(20px,4vw,38px)!important;background:linear-gradient(180deg,#fff,#ffd23f);-webkit-background-clip:text;background-clip:text;color:transparent!important;filter:drop-shadow(0 3px 0 #000) drop-shadow(0 0 18px #ffb70388)}
.sl{background:linear-gradient(160deg,#141a35e6,#0a0d1de6)!important;border:1px solid #ffffff26!important;border-radius:12px!important;box-shadow:0 6px 16px #0008;transition:transform .12s}
.sl.on{border-color:var(--y)!important;box-shadow:0 0 0 2px var(--y),0 0 18px #ffd23f88!important;transform:translateY(-4px) scale(1.06)}
#mm{box-shadow:0 0 0 3px #0008,0 0 24px #38e1ff55;border:2px solid #38e1ffaa!important}
#xh{display:none!important}
#prX{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:3}
#prX i{position:absolute;background:#fff;box-shadow:0 0 3px #000,0 0 6px #000a;border-radius:2px}
#prX i:nth-child(1),#prX i:nth-child(2){width:2px;height:9px;left:-1px}#prX i:nth-child(3),#prX i:nth-child(4){height:2px;width:9px;top:-1px}
#prX b{position:absolute;left:-2px;top:-2px;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 4px #000}
#prKF{position:absolute;right:12px;top:150px;display:flex;flex-direction:column;gap:5px;align-items:flex-end;pointer-events:none;z-index:3}
#prKF div{background:linear-gradient(90deg,#0000,#0b1022dd 25%);padding:4px 12px 4px 30px;border-radius:8px;font:700 14px Rajdhani;color:#fff;animation:prKF 4s forwards;border-right:3px solid var(--y)}
@keyframes prKF{0%{opacity:0;transform:translateX(30px)}8%{opacity:1;transform:none}85%{opacity:1}100%{opacity:0}}
.prDN{position:absolute;pointer-events:none;font-family:'Luckiest Guy',Impact;z-index:3;transform:translate(-50%,-50%);text-shadow:0 2px 0 #000,0 0 10px #000a;white-space:nowrap}
#prLow{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:0;background:radial-gradient(ellipse at center,transparent 58%,#ff003355 82%,#ff0033aa 100%);animation:prPulse 1s infinite}
@keyframes prPulse{50%{filter:brightness(1.6)}}
#prVig{position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 55%,#0008 100%)}
#prLogo{font-family:'Luckiest Guy',Impact;font-size:clamp(34px,8vw,74px);line-height:.95;margin:2px 0 4px;background:linear-gradient(180deg,#fffbe0,#ffd23f 40%,#ff7b00);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 #5a2a00) drop-shadow(0 0 30px #ffb70399);animation:prFloat 3s ease-in-out infinite}
#prLogo small{display:block;font-size:.34em;letter-spacing:6px;background:linear-gradient(90deg,#38e1ff,#a78bfa,#ff4d6d);-webkit-background-clip:text;background-clip:text;filter:none}
@keyframes prFloat{50%{transform:translateY(-6px)}}
`;document.head.appendChild(css);

// Menü logó
{const h=document.querySelector('#menu h1'),h2=document.querySelector('#menu h2');if(h){const d=document.createElement('div');d.id='prLogo';d.innerHTML='KÖZPÉNZ ROYALE<small>MAGYARORSZÁG KFT. · 1. SZEZON</small>';h.replaceWith(d)}if(h2)h2.textContent='KÖZPÉNZ-SZIGET · ÉPÍTS · LŐJ · NYERJ';const tip=[...document.querySelectorAll('#menu .card > div')].find(d=>/WASD/.test(d.textContent));if(tip){tip.style.cssText='color:#94a3b8;margin-top:8px;font-size:12px;opacity:.8';tip.innerHTML='WASD mozgás · egér célzás · katt lövés · R újratöltés · B építés · 1/2/3 elem · H tánc · Q ulti · P szünet'}}

// HUD elemek
const hud=$('hud');
const X=document.createElement('div');X.id='prX';X.innerHTML='<i></i><i></i><i></i><i></i><b></b>';hud.appendChild(X);
const KF=document.createElement('div');KF.id='prKF';hud.appendChild(KF);
const LOW=document.createElement('div');LOW.id='prLow';hud.appendChild(LOW);
const VIG=document.createElement('div');VIG.id='prVig';hud.insertBefore(VIG,hud.firstChild);
const DN=[];

// ---------- 2) ÉGBOLT, FÉNYEK, TENGER ----------
window.skyTex=function(){const cv=document.createElement('canvas');cv.width=1024;cv.height=512;const x=cv.getContext('2d'),g=x.createLinearGradient(0,0,0,512);
 g.addColorStop(0,'#0b1e4a');g.addColorStop(.22,'#24418f');g.addColorStop(.38,'#6c5fb4');g.addColorStop(.46,'#e2799b');g.addColorStop(.5,'#ffb36b');g.addColorStop(.53,'#ffd9a0');g.addColorStop(.56,'#8fb6c9');g.addColorStop(1,'#203848');x.fillStyle=g;x.fillRect(0,0,1024,512);
 const sx=760,sy=246,rg=x.createRadialGradient(sx,sy,4,sx,sy,170);rg.addColorStop(0,'#fffbe8');rg.addColorStop(.07,'#ffe7a8');rg.addColorStop(.25,'#ffb36b88');rg.addColorStop(1,'#ffb36b00');x.fillStyle=rg;x.fillRect(0,0,1024,512);
 for(let i=0;i<34;i++){const cx=Math.random()*1024,cy=120+Math.random()*120,w=60+Math.random()*160;const cg=x.createRadialGradient(cx,cy,2,cx,cy,w);cg.addColorStop(0,'rgba(255,214,190,.35)');cg.addColorStop(1,'rgba(255,214,190,0)');x.fillStyle=cg;x.beginPath();x.ellipse(cx,cy,w,w*.22,0,0,6.3);x.fill()}
 for(let i=0;i<160;i++){x.fillStyle='rgba(255,255,255,'+(Math.random()*.7)+')';x.fillRect(Math.random()*1024,Math.random()*150,1.4,1.4)}
 return new THREE.CanvasTexture(cv)};
WP('launch',null,()=>{if(!scene)return;const hz=new THREE.Color(0xc7a993);scene.background=hz;if(scene.fog){scene.fog.color.copy(hz);scene.fog.near=150;scene.fog.far=430}
 if(window.HEMI){HEMI.color.setHex(0xcfe0ff);HEMI.groundColor.setHex(0x5a4a3a);HEMI.intensity=.9}
 if(window.SUN){SUN.color.setHex(0xffd9a8);SUN.intensity=1.35}
 if(ren){ren.toneMappingExposure=1.08}
 scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CircleGeometry'&&o.geometry.parameters.radius>=800){o.material=new THREE.MeshStandardMaterial({color:0x1b8aa6,emissive:0x0a3d52,roughness:.18,metalness:.35});G._sea=o}});
});
// enyhe tenger-hullámzás (olcsó: csak szín és magasság)
WP('update',null,a=>{const g=G;if(!g||!g._sea)return;const t=g.t;g._sea.position.y=-2.6+Math.sin(t*.8)*.12;g._sea.material.emissiveIntensity=.85+Math.sin(t*1.7)*.15});

// ---------- 3) HARCI VISSZAJELZÉS ----------
let spread=0,shake=0,lastHp=null;
const proj=new THREE.Vector3();
function dmgNum(x,y,z,v,crit){const d=document.createElement('div');d.className='prDN';d.textContent=Math.round(v);d.style.fontSize=(crit?30:22)+'px';d.style.color=crit?'#ffd23f':'#ffffff';hud.appendChild(d);DN.push({d,x,y,z,t:0,vx:(Math.random()-.5)*1.2})}
WP('dmgE',a=>{const e=a[0];return e?{hp:e.hp,sh:e.sh||0}:null},(a,st)=>{const e=a[0];if(!e||!st||!G)return;const lost=(st.hp-e.hp)+(st.sh-(e.sh||0));if(lost>.5)dmgNum(e.x,(e.y||0)+3.4*Math.max(1,e.r*.8),e.z,lost,a[2]||lost>=60)});
WP('sht',a=>G&&G.cd<=0&&G.reloading<=0&&!G.buildMode&&(G.mag[G.wp]||0)>0,(a,fired)=>{if(fired){spread=Math.min(22,spread+(G.wp===2?14:G.wp===0?12:5));shake=Math.min(.35,shake+(G.wp===3?.3:G.wp===0?.16:.06))}});
WP('kill',null,a=>{const e=a[0];if(!e||!G)return;const n=document.createElement('div');n.innerHTML=(G.f?G.f.e:'🎯')+' <b style="color:#ffd23f">TE</b> ➜ 💀 '+(NM[e.t]||'ELLENFÉL')+(e.b?' <b style="color:#ff4d6d">BOSS</b>':'');KF.prepend(n);while(KF.children.length>5)KF.lastChild.remove();setTimeout(()=>n.remove(),4100)});
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!cam)return;
 // célkereszt szórás
 const mv=Math.hypot(g.vx||0,g.vz||0);spread=Math.max(0,spread-dt*40);const s=6+spread+Math.min(10,mv*.8)+(g.y>.3?8:0);
 X.style.display=g.fp&&g.phase==='play'&&!g.buildMode?'block':'none';const L=X.children;L[0].style.top=(-s-9)+'px';L[1].style.top=s+'px';L[2].style.left=(-s-9)+'px';L[3].style.left=s+'px';
 // kamera-rázkódás
 if(lastHp!==null&&g.hp<lastHp-.5)shake=Math.min(.5,shake+(lastHp-g.hp)*.02);lastHp=g.hp;
 if(shake>0&&g.fp){shake=Math.max(0,shake-dt*1.6);cam.position.x+=(Math.random()-.5)*shake;cam.position.y+=(Math.random()-.5)*shake;cam.rotation.z+=(Math.random()-.5)*shake*.05}
 // alacsony életerő
 LOW.style.opacity=g.hp>0&&g.hp<g.mhp*.3?Math.min(.8,.35+(.3-g.hp/g.mhp)*2):0;
 // sebzésszámok
 const W=innerWidth,H=innerHeight;for(let i=DN.length-1;i>=0;i--){const n=DN[i];n.t+=dt;n.y+=dt*2.2;n.x+=n.vx*dt;proj.set(n.x,n.y,n.z).project(cam);if(n.t>.9||proj.z>1){n.d.remove();DN.splice(i,1);continue}n.d.style.left=((proj.x+1)/2*W)+'px';n.d.style.top=((1-proj.y)/2*H)+'px';n.d.style.opacity=String(1-Math.max(0,n.t-.5)/.4);n.d.style.transform='translate(-50%,-50%) scale('+(n.t<.08?1.5-n.t*6:1)+')'}});
WP('launch',null,()=>{lastHp=null;shake=0;spread=0;DN.splice(0).forEach(n=>n.d.remove());KF.innerHTML=''});
WP('end',null,()=>{DN.splice(0).forEach(n=>n.d.remove());LOW.style.opacity=0});
})();
