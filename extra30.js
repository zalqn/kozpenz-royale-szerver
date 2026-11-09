// ===== EXTRA30: légicsapás · fegyverkiegészítők · bátorság-bónusz · utolsó kör · FPS-korlát · színvak mód =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x30pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x30 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),fmt=n=>(+n||0).toLocaleString('hu-HU');
const sayX=t=>{try{say(t)}catch(e){}};
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const OPT=Object.assign({fps:0,cb:'off'},(()=>{try{return JSON.parse(localStorage.getItem('k3x30'))||{}}catch(e){return{}}})());
const saveO=()=>{try{localStorage.setItem('k3x30',JSON.stringify(OPT))}catch(e){}};

// ---------- FPS-korlát ----------
const rAF=window.requestAnimationFrame.bind(window);const LF=new WeakMap();
window.requestAnimationFrame=function(cb){if(!OPT.fps||typeof cb!=='function')return rAF(cb);return rAF(function loop(t){const min=1000/OPT.fps-1,l=LF.get(cb)||0;if(t-l<min)return rAF(loop);LF.set(cb,t);cb(t)})};

// ---------- színvak mód (SVG szűrők) ----------
const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('style','position:absolute;width:0;height:0');
const MX={prot:'0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0',deut:'0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0',trit:'0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0'};
svg.innerHTML=Object.entries(MX).map(([k,v])=>'<filter id="x30'+k+'"><feColorMatrix type="matrix" values="'+v+'"/></filter>').join('');document.body.appendChild(svg);
function applyCb(){document.documentElement.style.filter=OPT.cb==='off'?'':'url(#x30'+OPT.cb+')'}applyCb();
window.x30set=(k,v)=>{OPT[k]=v;saveO();applyCb();showOpt()};
function showOpt(){const b=(k,v,l)=>'<button class="'+(OPT[k]===v?'g':'')+'" onclick="x30set(\''+k+'\','+JSON.stringify(v).replace(/"/g,'&quot;')+')">'+l+'</button>';
 $$('x20MB').innerHTML='<h2>⚙️ MEGJELENÍTÉS</h2><h3>🎞️ FPS-korlát</h3><div style="font-size:13px;opacity:.7">Gyengébb gépen, laptopon akkus módban kevesebbet melegszik.</div>'+b('fps',0,'Nincs')+b('fps',30,'30')+b('fps',60,'60')+b('fps',120,'120')+
 '<h3>🎨 Színvak mód</h3><div style="font-size:13px;opacity:.7">Az egész kép színeit igazítja a látásodhoz.</div>'+b('cb','off','Ki')+b('cb','prot','Protanópia (vörös)')+b('cb','deut','Deuteranópia (zöld)')+b('cb','trit','Tritanópia (kék)')+
 '<div style="text-align:right;margin-top:10px"><button onclick="x20hub()">◀ VISSZA</button><button onclick="x20close()">BEZÁR</button></div>';$$('x20M').style.display='flex'}
window.x30opt=showOpt;
const oh=window.x20hub;if(typeof oh==='function'){window.x20hub=function(){oh();const g=document.querySelector('#x20MB div[style*="grid"]');if(g){const bt=document.createElement('button');bt.className='y';bt.style.cssText='padding:16px;font-size:18px';bt.textContent='⚙️ MEGJELENÍTÉS';bt.onclick=showOpt;g.appendChild(bt)}};
 const bi=setInterval(()=>{const b=$$('x20B');if(!b)return;clearInterval(bi);b.onclick=window.x20hub},1200)}

// ---------- meccs-állapot ----------
let Z=null;let magBak=null;
function restoreMag(){if(magBak&&typeof WPN!=='undefined'){magBak.forEach((m,i)=>{if(WPN[i])WPN[i].mag=m});magBak=null}}
WP('launch',()=>{restoreMag()},()=>{Z={dmg:1,mag:false,strike:0,strikes:[],last:false,brave:0}});
WP('end',null,()=>{restoreMag();if(Z){Z.strikes.forEach(s=>{try{scene.remove(s.m)}catch(e){}});Z.strikes=[]}const b=$$('x30Last');if(b)b.style.display='none'});

// ---------- vándorárus bővítése ----------
const EXTRA=[['✈️ Légicsapás (B-gomb helyett: [U]… nem! → nyomd meg a [7]-et)',6000,()=>{Z.strike++;sayX('✈️ Légicsapás megvéve! Célozz, és nyomd meg az Ö gombot!')}],
 ['🎯 Stabilizátor (+20% sebzés)',5000,()=>{if(Z.dmg>1){G.cash+=5000;sayX('Már van stabilizátorod.');return}Z.dmg=1.2;sayX('🎯 Stabilizátor felszerelve: +20% sebzés!')}],
 ['📦 Bővített tár (+50% tárméret)',4000,()=>{if(Z.mag){G.cash+=4000;sayX('Már van bővített tárad.');return}Z.mag=true;magBak=WPN.map(w=>w.mag);WPN.forEach((w,i)=>{w.mag=Math.ceil(w.mag*1.5);G.mag[i]=Math.min(w.mag,(G.mag[i]||0)+Math.ceil(w.mag/3))});sayX('📦 Bővített tár: +50% lőszer tárankként!')}]];
EXTRA[0][0]='✈️ Légicsapás ([Ö] gomb)';
const ob=window.x20buy;
window.x20buy=function(i){if(i<100)return ob(i);const s=EXTRA[i-100];if(!s||!Z||G.cash<s[1])return;G.cash-=s[1];try{s[2]()}catch(e){console.error(e)}try{sfx('drop')}catch(e){}if(window.x20near)window.x20near()};
// a bolt-ablakhoz hozzáfűzzük a sorokat
new MutationObserver(()=>{const mb=$$('x20MB');if(!mb||!Z)return;const h=mb.querySelector('h2');if(!h||!/VÁNDORÁRUS/.test(h.textContent)||mb.querySelector('.x30r'))return;
 const close=[...mb.querySelectorAll('button')].pop();const wrap=document.createElement('div');
 wrap.innerHTML='<h3>🔧 KIEGÉSZÍTŐK ÉS KÜLÖNLEGES</h3>'+EXTRA.map((s,i)=>'<div class="x20row x30r"><span>'+s[0]+(i===0&&Z.strike?' <b style="color:#86efac">(nálad: '+Z.strike+')</b>':i===1&&Z.dmg>1?' <b style="color:#86efac">✔</b>':i===2&&Z.mag?' <b style="color:#86efac">✔</b>':'')+'</span><button class="'+(G.cash>=s[1]?'y':'')+'" '+(G.cash>=s[1]?'':'disabled')+' onclick="x20buy('+(100+i)+')">'+fmt(s[1])+' Ft</button></div>').join('');
 if(close&&close.parentNode)close.parentNode.before(wrap);else mb.appendChild(wrap)}).observe(document.body,{childList:true,subtree:true});

// ---------- sebzés-szorzó + bátorság-bónusz ----------
WP('dmgE',a=>{if(Z&&Z.dmg>1&&!a[3])a[1]*=Z.dmg});
WP('kill',null,a=>{if(!Z||!normal())return;const g=G;
 if(g.hp>0&&g.hp<g.mhp*.25){g.cash+=1500;Z.brave++;try{ftx(g.x,g.z,'🦁 BÁTORSÁG +1500','')}catch(e){}if(Z.brave===1)sayX('🦁 BÁTORSÁG-BÓNUSZ! Alacsony élettel is kiejtetted! +1500 Ft')}
 if(Z.last){g.cash+=1000;try{ftx(a[0].x,a[0].z,'⚡ UTOLSÓ KÖR +1000','')}catch(e){}}});

// ---------- légicsapás ----------
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='ö'||!normal()||!Z)return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 if(Z.strike<=0){sayX('✈️ Nincs légicsapásod. A vándorárusnál vehetsz!');return}const g=G;const p=g.pit||0;let d=p<-.03?Math.min(120,(g.y+1.7)/-Math.sin(p)):45;
 const x=g.x+Math.cos(g.ang)*d*Math.cos(p),z=g.z+Math.sin(g.ang)*d*Math.cos(p);Z.strike--;
 const m=new THREE.Mesh(new THREE.RingGeometry(7.2,8,40),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.85,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.15,z);scene.add(m);
 Z.strikes.push({x,z,t:3,m,n:0});sayX('✈️ LÉGICSAPÁS ÚTON! 3 másodperc… húzódj félre!');try{tn(600,'sawtooth',.4,.08)}catch(er){}});
WP('update',null,a=>{if(!Z||typeof G==='undefined'||!G||G.over)return;const g=G,dt=Math.min(.1,a[0]||.016);
 Z.strikes=Z.strikes.filter(s=>{s.t-=dt;s.m.material.opacity=.5+Math.sin(s.t*20)*.35;
  if(s.t<=0&&s.n<6){s.n++;s.t=.18;const bx=s.x+(Math.random()-.5)*9,bz=s.z+(Math.random()-.5)*9;
   const f=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:0xff8a1f,transparent:true,opacity:.9}));f.position.set(bx,1,bz);scene.add(f);let ft=0;g.ef.push({k:'x30b',t:.6,u:dd=>{ft+=dd;f.scale.setScalar(1+ft*9);f.material.opacity=Math.max(0,.9-ft*1.6);if(ft>.55)scene.remove(f)}});
   try{sfx('rocket')}catch(e){}g.en.forEach(e=>{if(!e.dead&&Math.hypot(e.x-bx,e.z-bz)<5)try{dmgE(e,110,false)}catch(er){}});if(Math.hypot(g.x-bx,g.z-bz)<4)hurt(15)}
  if(s.n>=6&&s.t<=0){scene.remove(s.m);return false}return true});
 // utolsó kör
 if(!Z.last&&normal()&&g.phase==='play'&&g.t>30){const alive=(g.en||[]).filter(e=>!e.dead).length;if(alive>0&&alive<=4){Z.last=true;let b=$$('x30Last');if(!b){b=document.createElement('div');b.id='x30Last';b.style.cssText='position:fixed;left:50%;top:150px;transform:translateX(-50%);z-index:5;background:linear-gradient(90deg,#7f1d1dcc,#dc2626cc);color:#fff;font:20px "Luckiest Guy",Impact;padding:6px 18px;border-radius:999px;pointer-events:none;animation:x30p 1s infinite';document.body.appendChild(b);const st=document.createElement('style');st.textContent='@keyframes x30p{50%{transform:translateX(-50%) scale(1.06)}}';document.head.appendChild(st)}
  b.textContent='⚡ UTOLSÓ KÖR! Minden kiesés +1000 Ft';b.style.display='block';sayX('⚡ UTOLSÓ KÖR! Már csak '+alive+' ellenfél maradt!');setTimeout(()=>{b.style.display='none'},8000)}}});
console.log('extra30 betöltve');
})();
