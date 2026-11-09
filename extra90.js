// ===== EXTRA90: ÚJ FOTÓMÓD (O / telefon Kamera) + telefon-appok: Kamera, Galéria, Térkép, Zseblámpa, Infó, Közdex, Beállítások · telefon-ikon a minitérkép mellett =====
(function(){
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>(+n||0).toLocaleString('hu-HU');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
// O letiltva: Sötét Program / 3D labor, droglabor2, teljes képernyős panelek alatt
const blockO=()=>{const v=id=>{const x=document.getElementById(id);return x&&getComputedStyle(x).display!=='none'};return v('sp3')||v('dp')||v('dl2')||v('dpmg')||['sotet','sp3','drog'].some(m=>String(window.GAME_MODE||'').includes(m))};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const sayX=t=>{try{say(t)}catch(e){}};

// =====================================================================
// FOTÓMÓD
// =====================================================================
const FIL=[['Normál','none'],['Fekete-fehér','grayscale(1) contrast(1.15)'],['Szépia','sepia(.85) contrast(1.05)'],['Vintage','sepia(.35) saturate(1.4) contrast(.9) brightness(1.05) hue-rotate(-10deg)'],['Hideg','saturate(1.1) hue-rotate(18deg) brightness(1.05)'],['Meleg','saturate(1.3) sepia(.25) brightness(1.05)'],['Neon','saturate(2.2) contrast(1.25) hue-rotate(-20deg)'],['Drámai','contrast(1.5) saturate(.8) brightness(.9)']];
const css=document.createElement('style');css.textContent=`
#xPhoto{display:none!important}
body.x90ph *{visibility:hidden!important}
body.x90ph canvas,body.x90ph #x90Cam,body.x90ph #x90Cam *{visibility:visible!important}
#x90Cam{position:fixed;inset:0;z-index:80;pointer-events:none;display:none}
#x90Cam .grid{position:absolute;inset:0;background:linear-gradient(#ffffff26 1px,transparent 1px) 0 0/100% 33.33%,linear-gradient(90deg,#ffffff26 1px,transparent 1px) 0 0/33.33% 100%;display:none}
#x90Cam .top{position:absolute;top:14px;left:50%;transform:translateX(-50%);background:#000a;color:#fff;font:700 15px Rajdhani;padding:6px 16px;border-radius:999px;pointer-events:auto;white-space:nowrap}
#x90Cam .bot{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);display:flex;gap:10px;align-items:center;pointer-events:auto}
#x90Cam .bot button{border:0;border-radius:999px;padding:9px 14px;font:800 14px Rajdhani;background:#000b;color:#fff;cursor:pointer;border:1px solid #ffffff33}
#x90Cam .bot button.on{background:#facc15;color:#1c1300}
#x90Shut{width:72px;height:72px;border-radius:50%!important;background:#fff!important;border:5px solid #000!important;box-shadow:0 0 0 3px #fff;padding:0!important}
#x90Flash{position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:81;transition:opacity .35s}
#x90Thumb{position:absolute;right:20px;bottom:24px;width:120px;border-radius:10px;border:3px solid #fff;box-shadow:0 6px 20px #000a;opacity:0;transition:all .4s}
#x90Btn{position:fixed;left:132px;bottom:58px;z-index:8;width:46px;height:74px;border-radius:12px;background:linear-gradient(160deg,#27272a,#09090b);border:2px solid #52525b;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;box-shadow:0 6px 16px #0009;transition:transform .2s}
#x90Btn:hover{transform:translateY(-4px)}#x90Btn em{position:absolute;top:-7px;right:-7px;background:#ef4444;color:#fff;font:800 11px Rajdhani;font-style:normal;border-radius:9px;padding:1px 6px;display:none}
#x90Btn small{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font:800 11px Rajdhani;color:#fff;text-shadow:0 1px 2px #000;white-space:nowrap}
#x90Btn.ring{animation:x90r .35s infinite}@keyframes x90r{0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}}
#x60Ph .apps{max-height:330px;overflow-y:auto;padding-top:14px!important;gap:12px 6px!important}
#x60Ph.right{left:auto!important;right:18px!important;bottom:200px!important}
.x90gal{display:grid;grid-template-columns:1fr 1fr;gap:6px}.x90gal img{width:100%;border-radius:8px;cursor:pointer;display:block}
.x90wp{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.x90wp div{height:54px;border-radius:10px;cursor:pointer;border:2px solid transparent}.x90wp div.on{border-color:#fff}
#x90Map{display:block;margin:0 auto;border-radius:12px;background:#0c4a6e}`;document.head.appendChild(css);
const camUI=document.createElement('div');camUI.id='x90Cam';camUI.innerHTML='<div class="grid"></div><div class="top" id="x90Hint"></div><img id="x90Thumb"><div class="bot"><button id="x90Fl">🎨 Szűrő: Normál</button><button id="x90Gr">▦ Rács</button><button id="x90Wm" class="on">🏷️ Vízjel</button><button id="x90Shut" title="Fotó (Szóköz / Enter)"></button><button id="x90Self">🤳 Szelfi</button><button id="x90Ex">✖ Kilépés (O)</button></div>';document.body.appendChild(camUI);
const fl=document.createElement('div');fl.id='x90Flash';document.body.appendChild(fl);
const CAM={on:false,fil:0,grid:false,wm:true,yaw:0,pit:-.15,pos:null,fov:60,drag:false,lx:0,ly:0,keys:{},lobby:false,selfie:false};
function rig(){if(CAM.lobby&&window.LB3D)return{r:LB3D.r,sc:LB3D.sc,c:LB3D.cam};if(typeof ren!=='undefined'&&ren&&typeof scene!=='undefined')return{r:ren,sc:scene,c:cam};return null}
function hint(){$$('x90Hint').innerHTML=(CAM.lobby?'📸 FOTÓMÓD (lobby)':'📸 FOTÓMÓD · a játék szünetel')+' · húzd az egeret: nézelődés · WASD: mozgás · Q/E: le/fel · görgő: zoom · Szóköz/Enter: fotó · O/Esc: kilépés'}
function enter(){CAM.lobby=!inMatch();const R=rig();if(!R)return;CAM.on=true;const c=R.c;CAM.pos=c.position.clone();CAM.fov0=c.fov;CAM.fov=c.fov;const d=new THREE.Vector3();c.getWorldDirection(d);CAM.yaw=Math.atan2(d.x,-d.z);CAM.pit=Math.asin(Math.max(-1,Math.min(1,d.y)));CAM.q0=c.quaternion.clone();
 if(!CAM.lobby&&G.gun){CAM.gunVis=G.gun.visible;G.gun.visible=false}CAM.hidC=[];c.children.forEach(o=>{if(o.visible&&!o.isLight){o.visible=false;CAM.hidC.push(o)}});CAM.hidCv=[];document.querySelectorAll('canvas').forEach(cv=>{if(cv!==R.r.domElement&&cv.style.visibility!=='hidden'){cv.style.setProperty('visibility','hidden','important');CAM.hidCv.push(cv)}});document.body.classList.add('x90ph');camUI.style.display='block';hint();if(document.pointerLockElement)document.exitPointerLock();
 try{const ph=$$('x60Ph');if(ph)ph.style.display='none';if(window._x60PH)_x60PH.open=false}catch(e){}applyFil();try{tn(1200,'sine',.05,.05)}catch(e){}}
function exit(){if(!CAM.on)return;CAM.on=false;document.body.classList.remove('x90ph');camUI.style.display='none';const R=rig();if(R){R.c.fov=CAM.fov0;R.c.updateProjectionMatrix();if(CAM.q0&&CAM.lobby){R.c.position.copy(CAM.pos0||R.c.position)}}if(!CAM.lobby&&typeof G!=='undefined'&&G&&G.gun)G.gun.visible=CAM.gunVis!==false;R&&R.r.domElement&&(R.r.domElement.style.filter='');
 try{Object.keys(keys).forEach(k=>keys[k]=false)}catch(e){}CAM.keys={};(CAM.hidC||[]).forEach(o=>o.visible=true);CAM.hidC=[];(CAM.hidCv||[]).forEach(cv=>cv.style.removeProperty('visibility'));CAM.hidCv=[];document.body.classList.remove('xph')}
function applyFil(){const R=rig();if(R)R.r.domElement.style.filter=FIL[CAM.fil][1]==='none'?'':FIL[CAM.fil][1];$$('x90Fl').textContent='🎨 Szűrő: '+FIL[CAM.fil][0]}
$$('x90Fl').onclick=()=>{CAM.fil=(CAM.fil+1)%FIL.length;applyFil()};
$$('x90Gr').onclick=()=>{CAM.grid=!CAM.grid;camUI.querySelector('.grid').style.display=CAM.grid?'block':'none';$$('x90Gr').classList.toggle('on',CAM.grid)};
$$('x90Wm').onclick=()=>{CAM.wm=!CAM.wm;$$('x90Wm').classList.toggle('on',CAM.wm)};
$$('x90Shut').onclick=()=>shot();$$('x90Ex').onclick=()=>exit();
$$('x90Self').onclick=()=>{if(CAM.lobby||typeof G==='undefined'||!G)return;CAM.selfie=!CAM.selfie;$$('x90Self').classList.toggle('on',CAM.selfie);if(CAM.selfie){CAM.pos.set(G.x-Math.cos(G.ang)*3.2,G.y+2.4,G.z-Math.sin(G.ang)*3.2);CAM.yaw=Math.atan2(G.x-CAM.pos.x,-(G.z-CAM.pos.z));CAM.pit=-.12;if(G.pm){G.pm.visible=true;CAM.pmRot=G.pm.rotation.y;G.pm.rotation.y=Math.atan2(CAM.pos.x-G.x,CAM.pos.z-G.z)}}else if(G.pm){if(CAM.pmRot!==undefined)G.pm.rotation.y=CAM.pmRot;if(G.fp)G.pm.visible=false}};
// egér + kerék
addEventListener('mousedown',e=>{if(!CAM.on||e.target.closest('#x90Cam .bot'))return;CAM.drag=true;CAM.lx=e.clientX;CAM.ly=e.clientY},true);
addEventListener('mouseup',()=>CAM.drag=false,true);
addEventListener('mousemove',e=>{if(!CAM.on||!CAM.drag)return;CAM.yaw+=(e.clientX-CAM.lx)*.005;CAM.pit=Math.max(-1.45,Math.min(1.45,CAM.pit-(e.clientY-CAM.ly)*.004));CAM.lx=e.clientX;CAM.ly=e.clientY},true);
addEventListener('wheel',e=>{if(!CAM.on)return;e.stopImmediatePropagation();e.preventDefault();CAM.fov=Math.max(15,Math.min(100,CAM.fov+(e.deltaY>0?4:-4)))},{capture:true,passive:false});
// billentyűk (elkapjuk, hogy a játék ne kapja meg)
addEventListener('keydown',e=>{if(typing(e))return;const k=e.key.toLowerCase();
 if(!CAM.on){if(k==='o'&&!e.repeat&&!blockO()){setTimeout(()=>{document.body.classList.remove('xph');const x=$$('xPhoto');if(x)x.style.display='none';enter()},0)}return}
 e.stopImmediatePropagation();e.preventDefault();if(k==='o'||k==='escape'){exit();return}if((k===' '||k==='enter')&&!e.repeat){shot();return}CAM.keys[k]=true},true);
addEventListener('keyup',e=>{if(!CAM.on)return;e.stopImmediatePropagation();CAM.keys[e.key.toLowerCase()]=false},true);
// kamera mozgatása + a játék szüneteltetése
const _upd=window.update;
if(typeof _upd==='function')window.update=function(dt){if(CAM.on&&!CAM.lobby){camStep(dt||.016);return}return _upd.apply(this,arguments)};
let lt=performance.now();(function lob(){const n=performance.now(),dt=Math.min(.05,(n-lt)/1000);lt=n;if(CAM.on&&CAM.lobby)camStep(dt);requestAnimationFrame(lob)})();
const _f=new THREE.Vector3(),_r=new THREE.Vector3();
function camStep(dt){const R=rig();if(!R||CAM.lobby)return;const c=R.c;const K=CAM.keys,sp=(K.shift?18:7)*dt;const f=_f.set(Math.sin(CAM.yaw)*Math.cos(CAM.pit),Math.sin(CAM.pit),-Math.cos(CAM.yaw)*Math.cos(CAM.pit)),r=_r.set(Math.cos(CAM.yaw),0,Math.sin(CAM.yaw));
 if(K.w)CAM.pos.addScaledVector(f,sp);if(K.s)CAM.pos.addScaledVector(f,-sp);if(K.d)CAM.pos.addScaledVector(r,sp);if(K.a)CAM.pos.addScaledVector(r,-sp);if(K.e)CAM.pos.y+=sp;if(K.q)CAM.pos.y=Math.max(.3,CAM.pos.y-sp);
 if(!CAM.lobby&&typeof G!=='undefined'&&G){const dx=CAM.pos.x-G.x,dz=CAM.pos.z-G.z,dd=Math.hypot(dx,dz);if(dd>40){CAM.pos.x=G.x+dx/dd*40;CAM.pos.z=G.z+dz/dd*40}}
 c.position.copy(CAM.pos);c.lookAt(CAM.pos.x+f.x,CAM.pos.y+f.y,CAM.pos.z+f.z);if(Math.abs(c.fov-CAM.fov)>.1){c.fov+=(CAM.fov-c.fov)*.3;c.updateProjectionMatrix()}}
// fotó készítése
const GAL=LSg('k3x90gal',[]);let lastFull=null;
function shot(){const R=rig();if(!R)return;try{window.x50AlbSnap&&x50AlbSnap()}catch(e){}const prevF=R.r.domElement.style.filter;R.r.domElement.style.filter='';R.r.render(R.sc,R.c);
 const W=1280,H=Math.round(1280*R.r.domElement.height/R.r.domElement.width);const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.filter=FIL[CAM.fil][1];x.drawImage(R.r.domElement,0,0,W,H);x.filter='none';R.r.domElement.style.filter=prevF;
 if(CAM.wm){const g=x.createLinearGradient(0,H-90,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=g;x.fillRect(0,H-90,W,90);x.font='bold 34px "Luckiest Guy",Impact,sans-serif';x.fillStyle='#fde68a';x.textBaseline='bottom';x.fillText('KÖZPÉNZ ROYALE',24,H-18);x.font='600 20px Rajdhani,sans-serif';x.fillStyle='#fff';x.textAlign='right';x.fillText('📸 '+new Date().toLocaleString('hu-HU')+(inMatch()?' · 💀 '+(G.kills|0):''),W-24,H-22)}
 lastFull=cv.toDataURL('image/jpeg',.9);const th=document.createElement('canvas');th.width=480;th.height=Math.round(480*H/W);th.getContext('2d').drawImage(cv,0,0,th.width,th.height);const small=th.toDataURL('image/jpeg',.72);
 GAL.unshift({src:small,t:Date.now(),f:FIL[CAM.fil][0]});while(GAL.length>12)GAL.pop();while(!LSs('k3x90gal',GAL)&&GAL.length>1)GAL.pop();
 fl.style.transition='none';fl.style.opacity=1;requestAnimationFrame(()=>{fl.style.transition='opacity .35s';fl.style.opacity=0});try{tn(2400,'square',.03,.05);setTimeout(()=>tn(1800,'square',.03,.04),60)}catch(e){}
 const t=$$('x90Thumb');t.src=small;t.style.opacity=1;t.style.transform='translateY(0)';setTimeout(()=>{t.style.opacity=0},1600);
 $$('x90Hint').innerHTML='✅ Fotó mentve a telefon Galériájába! ('+GAL.length+'/12) · <a href="#" id="x90Dl" style="color:#facc15">⬇ teljes méretű letöltés</a>';const dl=$$('x90Dl');if(dl)dl.onclick=e=>{e.preventDefault();dlImg(lastFull)};setTimeout(()=>{if(CAM.on)hint()},4000);
 album(R.c)}
function dlImg(src){const a=document.createElement('a');a.href=src;a.download='kozpenz_royale_'+new Date().toISOString().replace(/[:.]/g,'-')+'.jpg';document.body.appendChild(a);a.click();a.remove()}
function album(c){try{const Q=window._x50Q&&_x50Q(),ALB=window._x50ALB,LM=window._x50LM;if(!Q||!ALB||!LM)return;const d=new THREE.Vector3();c.getWorldDirection(d);const got=[];
 Q.lms.forEach(l=>{if(ALB[l.i])return;const dx=l.x-c.position.x,dz=l.z-c.position.z,dist=Math.hypot(dx,dz);if(dist>70)return;if((dx*d.x+dz*d.z)/(dist||1)/Math.hypot(d.x,d.z||1e-6)<.75)return;ALB[l.i]=new Date().toLocaleDateString('hu-HU');got.push(LM[l.i])});
 if(got.length){LSs('k3x50alb',ALB);try{S.c+=2000*got.length;save()}catch(e){}$$('x90Hint').innerHTML='📸 ÚJ ALBUM-KÉP: '+got.map(x=>x[0]+' '+x[1]).join(', ')+' ('+Object.keys(ALB).length+'/12) +'+fmt(2000*got.length)+' Ft'}}catch(e){}}
WP_('end',()=>exit());WP_('launch',()=>exit());
function WP_(n,post){const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{post(arguments)}catch(e){}return r}}

// =====================================================================
// TELEFON-APPOK
// =====================================================================
const APPS=window._x60APPS=window._x60APPS||{};const PSET=Object.assign({wp:0,side:'left',ring:true},LSg('k3x90ph',{}));const psave=()=>LSs('k3x90ph',PSET);
const WPS=['linear-gradient(160deg,#312e81,#0f172a 55%,#831843)','linear-gradient(160deg,#064e3b,#0f172a 60%,#14532d)','linear-gradient(160deg,#7c2d12,#1c1917 60%,#b45309)','linear-gradient(160deg,#0c4a6e,#020617 60%,#155e75)','linear-gradient(200deg,#f472b6,#7c3aed 50%,#1e1b4b)','radial-gradient(circle at 30% 20%,#fde68a,#ca8a04 30%,#1c1917 75%)'];
function applyPh(){const p=$$('x60Ph');if(!p)return;const s=p.querySelector('.scr');if(s)s.style.background=WPS[PSET.wp]||WPS[0];p.classList.toggle('right',PSET.side==='right');const b=$$('x90Btn');if(b){b.style.left=PSET.side==='right'?'auto':'132px';b.style.right=PSET.side==='right'?'18px':'auto';b.style.bottom=PSET.side==='right'?'200px':'58px'}}
setTimeout(applyPh,500);
// Kamera
APPS.cam={e:'📷',n:'Kamera',bg:'#18181b',render:()=>'<div style="text-align:center;padding:20px 6px"><div style="font-size:60px">📷</div><div style="margin:8px 0">Szabad kamera, szűrők és vízjel. A meccs közben a játék szünetel, amíg fotózol.</div><button onclick="x90cam()">📸 FOTÓMÓD INDÍTÁSA</button><div style="font-size:12px;opacity:.7;margin-top:8px">Gyorsgomb: <b>O</b></div></div>'};
window.x90cam=()=>enter();
// Galéria
APPS.gal={e:'🖼️',n:'Galéria',bg:'linear-gradient(135deg,#f59e0b,#ef4444,#8b5cf6)',badge:()=>'',render:()=>GAL.length?'<div class="x90gal">'+GAL.map((g,i)=>'<img src="'+g.src+'" onclick="x90view('+i+')">').join('')+'</div>':'<div style="opacity:.7;text-align:center;padding:30px 6px">Még nincs fotód.<br>Nyisd meg a 📷 Kamerát, vagy nyomd meg az <b>O</b>-t!</div>'};
window.x90view=i=>{const g=GAL[i];if(!g)return;window._x60PH.app='galv';APPS.galv.i=i;_x60render()};
APPS.galv={e:'🖼️',n:'Fotó',bg:'#000',hide:true,i:0,render:()=>{const g=GAL[APPS.galv.i];if(!g)return'';return'<img src="'+g.src+'" style="width:100%;border-radius:10px"><div style="font-size:12px;opacity:.7;margin:4px 0">'+new Date(g.t).toLocaleString('hu-HU')+' · '+esc(g.f)+'</div><button onclick="x90post('+APPS.galv.i+')">📸 POSZTOLÁS KÖZGRAMRA</button><button onclick="x90dl('+APPS.galv.i+')" style="background:#334155">⬇ LETÖLTÉS</button><button onclick="x90del('+APPS.galv.i+')" style="background:#7f1d1d">🗑️ TÖRLÉS</button><button onclick="x60app(\'gal\')" style="background:#334155">‹ VISSZA</button>'}};
window.x90post=i=>{const g=GAL[i];if(!g||!window._x60IG)return;const IG=_x60IG;const p={icon:'😎',user:((window.KR&&KR.acc&&KR.acc().user)||{}).name||'te',src:g.src,txt:['Friss fotó a szigetről 📸','Nézzétek ezt a kilátást! 😍','#kozpenzroyale #fotomod','Művészet. 🎨'][Math.floor(Math.random()*4)],likes:0,t:Date.now(),liked:false};IG.posts.unshift(p);_x60igSave();
 let n=0;const iv=setInterval(()=>{n++;p.likes+=Math.floor(RN(4,30)*(1+IG.fol/700));if(n%3===0)IG.fol+=Math.floor(RN(1,10));_x60igSave();if(_x60PH.open&&_x60PH.app==='ig')_x60render();if(n>=12){clearInterval(iv);if(inMatch()){const pay=Math.min(3000,p.likes*5);G.cash+=pay;sayX('📸 A fotód '+fmt(p.likes)+' kedvelést kapott! +'+fmt(pay)+' Ft')}}},1500);x60app('ig')};
window.x90dl=i=>{const g=GAL[i];if(g)dlImg(g.src)};window.x90del=i=>{GAL.splice(i,1);LSs('k3x90gal',GAL);x60app('gal')};
// Térkép
APPS.map={e:'🗺️',n:'Térkép',bg:'#0369a1',live:true,render:()=>'<canvas id="x90Map" width="206" height="206"></canvas><div style="font-size:11px;opacity:.8;margin-top:6px;line-height:1.5">🟡 te · 🛒 árus · 🚁 láda · 🗺️ térképdarab · ❌ kincs · 📕 Közszörny · 🚤 jetski · 🏛️ város</div>',after:()=>drawMap()};
function drawMap(){const c=$$('x90Map');if(!c||typeof G==='undefined'||!G)return;const x=c.getContext('2d'),S=206;let mnx,mxx,mnz,mxz;
 if(G.arh&&typeof HU!=='undefined'){mnx=Math.min(...HU.map(p=>p[0]));mxx=Math.max(...HU.map(p=>p[0]));mnz=Math.min(...HU.map(p=>p[1]));mxz=Math.max(...HU.map(p=>p[1]))}else{mnx=mnz=-62;mxx=mxz=62}
 const sc=(S-12)/Math.max(mxx-mnx,mxz-mnz),P=(px,pz)=>[6+(px-mnx)*sc,6+(pz-mnz)*sc];x.fillStyle='#0c4a6e';x.fillRect(0,0,S,S);x.fillStyle='#4d7c0f';x.beginPath();
 if(G.arh&&typeof HU!=='undefined'){HU.forEach((p,i)=>{const[a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b)});x.closePath()}else{const[a,b]=P(0,0);x.arc(a,b,60*sc,0,7)}x.fill();x.strokeStyle='#fde68a88';x.lineWidth=1.5;x.stroke();
 x.font='bold 7px sans-serif';x.textAlign='center';(G.cities||[]).forEach((c,i)=>{const[a,b]=P(c.x,c.z);x.fillStyle='#fff';x.fillRect(a-1.5,b-1.5,3,3);if(Math.hypot(c.x-G.x,c.z-G.z)<160){x.fillStyle='#ffffffdd';x.fillText(String(c.name).slice(0,14),a,b-4)}});
 const ic=(px,pz,e,s)=>{const[a,b]=P(px,pz);x.font=(s||12)+'px serif';x.fillText(e,a,b+4)};
 try{const X=window._x20X&&_x20X();if(X&&X.vend)ic(X.vend.x,X.vend.z,'🛒')}catch(e){}
 try{const Q=window._x50Q&&_x50Q();if(Q){Q.drops.forEach(d=>{if(!d.open)ic(d.x,d.z,'🚁')});Q.maps.forEach(m=>{if(m.on)ic(m.x,m.z,'🗺️',10)});if(Q.dig&&!Q.dig.done)ic(Q.dig.x,Q.dig.z,'❌')}}catch(e){}
 try{const Z=window._x70Z&&_x70Z();if(Z){Z.mons.forEach(m=>{if(!m.caught)ic(m.x,m.z,'📕',9)});Z.jets.forEach(j=>ic(j.x,j.z,'🚤',10))}}catch(e){}
 const[a,b]=P(G.x,G.z);x.save();x.translate(a,b);x.rotate(G.ang+Math.PI/2);x.fillStyle='#facc15';x.strokeStyle='#000';x.beginPath();x.moveTo(0,-8);x.lineTo(5,6);x.lineTo(0,3);x.lineTo(-5,6);x.closePath();x.fill();x.stroke();x.restore()}
// Zseblámpa
let torch=null;APPS.torch={e:'🔦',n:'Zseblámpa',bg:'#3f3f46',render:()=>'<div style="text-align:center;padding:24px 6px"><div style="font-size:70px;filter:'+(torch&&torch.visible?'drop-shadow(0 0 20px #fde68a)':'grayscale(1)')+'">🔦</div><button onclick="x90torch()">'+(torch&&torch.visible?'KIKAPCSOL':'BEKAPCSOL')+'</button><div style="font-size:12px;opacity:.7">Éjszaka és ködben hasznos!</div></div>'};
window.x90torch=()=>{if(typeof cam==='undefined')return;if(!torch){torch=new THREE.SpotLight(0xfff4d6,2.2,70,.42,.5,1.2);torch.position.set(.2,-.1,0);const t=new THREE.Object3D();t.position.set(0,0,-10);cam.add(t);torch.target=t;cam.add(torch);torch.visible=false}torch.visible=!torch.visible;try{tn(900,'square',.03,.05)}catch(e){}_x60render()};
// Infó (időjárás / esemény / meccs)
APPS.info={e:'🌦️',n:'Infó',bg:'#0ea5e9',live:true,render:()=>{const g=typeof G!=='undefined'?G:null;const ev=$$('x20Ev');const wv=$$('wv');const zr=[...document.querySelectorAll('#hud *')].find(e=>/ZÁRUL/.test(e.textContent)&&e.children.length===0);
 return'<div class="it"><span>🌋</span><div>Heti esemény<small>'+esc(ev&&ev.textContent?ev.textContent:'—')+'</small></div></div><div class="it"><span>🌀</span><div>Vihar<small>'+esc(zr?zr.textContent:'—')+'</small></div></div><div class="it"><span>🏝️</span><div>Fázis<small>'+esc(wv?wv.textContent:'—')+'</small></div></div><div class="it"><span>👥</span><div>Életben<small>'+(g?(g.en||[]).filter(e=>!e.dead).length+' ellenfél':'—')+'</small></div></div><div class="it"><span>🌅</span><div>Boldog óra (19–20h)<small>'+(new Date().getHours()===19?'AKTÍV: dupla meccspénz!':'nem aktív')+'</small></div></div>'}};
// Közdex gyorsnézet
APPS.dex={e:'📕',n:'Közdex',bg:'#b91c1c',render:()=>{const D=window._x70DEX||{},M=window._x70MON||[];const n=Object.keys(D).length;const Z=window._x70Z&&_x70Z();
 return'<div style="text-align:center;font:26px \'Luckiest Guy\',Impact">'+n+' / 50</div><div style="font-size:12px;opacity:.75;text-align:center;margin-bottom:6px">Urnák: '+(Z?Z.urn:0)+' · E = urnadobás</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">'+M.map((m,i)=>'<div title="'+esc(m[1])+'" style="text-align:center;font-size:20px;background:#ffffff10;border-radius:8px;padding:3px;opacity:'+(D[i]?1:.25)+'">'+(D[i]?m[0]:'❔')+'</div>').join('')+'</div>'}};
// Beállítások
APPS.set={e:'⚙️',n:'Beállítások',bg:'#52525b',render:()=>'<div style="margin-bottom:6px">🖼️ Háttérkép</div><div class="x90wp">'+WPS.map((w,i)=>'<div class="'+(PSET.wp===i?'on':'')+'" style="background:'+w+'" onclick="x90set(\'wp\','+i+')"></div>').join('')+'</div>'+
 '<div style="margin:10px 0 4px">📍 A telefon helye</div><button onclick="x90set(\'side\',\'left\')" style="'+(PSET.side==='left'?'':'background:#334155')+'">◀ BAL (térkép mellett)</button><button onclick="x90set(\'side\',\'right\')" style="'+(PSET.side==='right'?'':'background:#334155')+'">JOBB ▶</button>'+
 '<div style="margin:10px 0 4px">🔔 Csengőhang</div><button onclick="x90set(\'ring\','+(!PSET.ring)+')">'+(PSET.ring?'🔔 BE':'🔕 KI')+'</button>'};
window.x90set=(k,v)=>{PSET[k]=v;psave();applyPh();_x60render()};

// =====================================================================
// TELEFON-IKON a minitérkép mellett (zárt állapotban), értesítések, csörgés
// =====================================================================
const btn=document.createElement('div');btn.id='x90Btn';btn.innerHTML='📱<em id="x90Bd"></em><small>U</small>';document.body.appendChild(btn);btn.onclick=()=>{try{phone()}catch(e){}};
let ringT=0,phK='';setInterval(()=>{const on=inMatch()&&G.phase==='play'&&!CAM.on;const open=window._x60PH&&_x60PH.open;const dsp=on&&!open?'flex':'none';if(btn.style.display!==dsp)btn.style.display=dsp;const k=PSET.wp+'|'+PSET.side+'|'+(!!document.getElementById('x60Ph'));if(k!==phK){phK=k;applyPh()}
 const n=(window._x60PH&&_x60PH.badge)||0;const bd=$$('x90Bd');const ring=on&&G.ring>0;if(bd){const bdD=(n||ring)?'block':'none',bdT=String(ring?'📞':n);if(bd.style.display!==bdD)bd.style.display=bdD;if(bd.textContent!==bdT)bd.textContent=bdT}
 btn.classList.toggle('ring',!!ring&&!open);if(ring&&!open&&PSET.ring&&performance.now()-ringT>1400){ringT=performance.now();try{tn(880,'sine',.12,.06);setTimeout(()=>tn(660,'sine',.12,.06),160)}catch(e){}}},400);
console.log('extra90 betöltve');
})();
// a régi (extra100) fotómód kikapcsolása: az O gomb mostantól az új fotómódot nyitja
// (A, 11-08) a régi extra100 fotómód O-ja kivezetve, így az xph-törlő időzítő sem kell (a csapatfotó – social.js – így végig rejti a felületet)
