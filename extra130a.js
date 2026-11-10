// extra130a.js – HARC & JÁTÉKMENET (10 funkció)
// 1 fegyverkiegészítők (távcső/hangtompító/markolat: vándorárus + ládák) · 2 kihajolás [,] [.] (nyomva tartva)
// 3 újraélesztés: lent levő bot-társ (állj mellé 3 mp) + 💠 második esély totem · 4 túlmelegedés (minigun, lézer) HUD-csík
// 5 ricochet szikrával · 6 bunkerek · 7 rombolható fakerítés + fahíd · 8 bosszú-jelző · 9 dash: dupla W/A/S/D
// 10 sebzés-visszajelzés: vér-vignetta, találathang, animált hitmarker. Debug: _x13a()
(function(){
'use strict';
const X={att:{},totem:0,heat:0,oh:false,lean:0,lk:{},dashCd:0,lastTap:{},objs:[],gref:null,rev:null,ally:null,ven:null,venT:0,sparks:[],hmT:0,snd:0};
window._x13a=X;
const ATT={scope:{e:'🔭',n:'Távcső',d:'-45% szórás, +30% lövedéksebesség',p:3000},sil:{e:'🔇',n:'Hangtompító',d:'+10% sebzés, nincs torkolattűz',p:2500},grip:{e:'✊',n:'Markolat',d:'-30% szórás, +12% tűzgyorsaság',p:2500}};
const okG=()=>typeof G!=='undefined'&&G&&!G.over&&G.phase==='play'&&typeof run!=='undefined'&&run;

// ---------- CSS + HUD ----------
const st=document.createElement('style');st.textContent=`
#x13aV{position:fixed;inset:0;pointer-events:none;z-index:40;opacity:0;transition:opacity .35s;background:radial-gradient(ellipse at center,transparent 55%,rgba(150,0,20,.55) 85%,rgba(90,0,10,.85) 100%)}
#x13aH{position:fixed;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;pointer-events:none;z-index:41;opacity:0}
#x13aH i{position:absolute;left:50%;top:50%;width:3px;height:11px;margin:-5.5px 0 0 -1.5px;background:#fff;border-radius:2px;box-shadow:0 0 6px #fff8}
#x13aH.k i{background:#ef4444;box-shadow:0 0 8px #f00}#x13aH.c i{background:#facc15;box-shadow:0 0 8px #fb0}
#x13aH.on{animation:x13aHm .28s ease-out}
@keyframes x13aHm{0%{opacity:1;transform:scale(.6) rotate(45deg)}40%{opacity:1;transform:scale(1.25) rotate(45deg)}100%{opacity:0;transform:scale(1) rotate(45deg)}}
#x13aP{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);z-index:30;pointer-events:none;display:flex;gap:8px;align-items:center;font:600 13px system-ui;color:#fff}
#x13aP .x13ab{background:linear-gradient(135deg,#1e1b4bcc,#3b0764aa);backdrop-filter:blur(8px);border:1px solid #facc1555;border-radius:12px;padding:5px 10px;box-shadow:0 4px 18px #0006}
#x13aHt{width:150px;height:9px;border-radius:6px;background:#0008;overflow:hidden;display:inline-block;vertical-align:middle;margin-left:6px;border:1px solid #fff3}
#x13aHt b{display:block;height:100%;width:0;background:linear-gradient(90deg,#facc15,#f97316,#ef4444);transition:width .1s}
#x13aHt.oh b{animation:x13aBl .3s infinite alternate}@keyframes x13aBl{to{opacity:.35}}
#x13aR{position:fixed;top:120px;right:18px;z-index:30;pointer-events:none;font:700 14px system-ui;color:#fff;background:linear-gradient(135deg,#7f1d1dcc,#4c0519cc);border:1px solid #f8717188;border-radius:12px;padding:7px 12px;backdrop-filter:blur(8px);display:none;box-shadow:0 0 16px #ef444455}
#x13aR span{display:inline-block;transition:transform .15s}
#x13aRv{position:fixed;left:50%;top:62%;transform:translateX(-50%);z-index:30;pointer-events:none;font:700 15px system-ui;color:#fff;background:linear-gradient(135deg,#065f46cc,#3b0764cc);border:1px solid #6ee7b788;border-radius:12px;padding:8px 14px;display:none;text-align:center}
#x13aRv u{display:block;height:6px;margin-top:5px;border-radius:4px;background:linear-gradient(90deg,#34d399,#a78bfa);width:0;text-decoration:none}
.x13arow{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #ffffff14}
`;document.head.appendChild(st);
const mk=(id,h)=>{const d=document.createElement('div');d.id=id;if(h)d.innerHTML=h;document.body.appendChild(d);return d};
const V=mk('x13aV'),HM=mk('x13aH','<i style="transform:rotate(0) translateY(-11px)"></i><i style="transform:rotate(90deg) translateY(-11px)"></i><i style="transform:rotate(180deg) translateY(-11px)"></i><i style="transform:rotate(270deg) translateY(-11px)"></i>');
const P=mk('x13aP'),RV=mk('x13aR'),RVV=mk('x13aRv');
let pSig='';
function drawPanel(){const g=G;const hw=g.wp===7||g.wp===8;const a=Object.keys(X.att).filter(k=>X.att[k]).map(k=>ATT[k].e).join(' ');
 const sig=a+'|'+X.totem+'|'+hw+'|'+(X.dashCd>0?1:0)+'|'+X.oh;
 if(sig!==pSig){pSig=sig;P.innerHTML=(a?'<div class="x13ab">'+a+'</div>':'')+(X.totem?'<div class="x13ab">💠 x'+X.totem+'</div>':'')+(hw?'<div class="x13ab">🔥 Hő<span id="x13aHt"'+(X.oh?' class="oh"':'')+'><b></b></span></div>':'')+'<div class="x13ab" style="opacity:'+(X.dashCd>0?.4:1)+'">💨 Dash</div>'}
 if(hw){const b=document.querySelector('#x13aHt b');if(b)b.style.width=Math.round(X.heat*100)+'%'}}

// ---------- hang ----------
let AC=null;function beep(f,t,v,ty){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),gn=AC.createGain();o.type=ty||'triangle';o.frequency.value=f;gn.gain.setValueAtTime(v||.08,AC.currentTime);gn.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+t);o.connect(gn);gn.connect(AC.destination);o.start();o.stop(AC.currentTime+t)}catch(e){}}

// ---------- 10: hitmarker + vignetta ----------
function hit(kind){const now=performance.now();HM.className='';void HM.offsetWidth;HM.className='on'+(kind?' '+kind:'');
 if(now-X.snd>45){X.snd=now;if(kind==='k'){beep(1200,.12,.1,'square');beep(700,.2,.07)}else beep(kind==='c'?1500:1900,.05,.05,'square')}}
if(typeof window.dmgE==='function'){const o=window.dmgE;window.dmgE=function(e,d,ct){const was=e&&e.dead;const r=o.apply(this,arguments);try{if(!X.noHm&&e&&!was&&d>0&&okG())hit(e.dead?'k':ct?'c':'')}catch(er){}return r}}
let vig=0;

// ---------- 8: bosszú (forrás jelölése) ----------
if(typeof window.eFire==='function'){const o=window.eFire;window.eFire=function(e){const n=G.eb.length;const r=o.apply(this,arguments);for(let i=n;i<G.eb.length;i++)G.eb[i].x13s=e;return r}}
let rev=null,revSpr=null,revBon=0;
function setRev(e){if(!e||e.dead||rev===e)return;rev=e;if(!revSpr&&typeof spr==='function'){revSpr=spr('🎯 BOSSZÚ',2.2,'x');}if(revSpr){if(revSpr.parent)revSpr.parent.remove(revSpr);revSpr.position.set(0,6.4,0);if(e.m)e.m.add(revSpr)}}

// ---------- 3: totem + hurt csomagoló ----------
if(typeof window.hurt==='function'){const o=window.hurt;window.hurt=function(d,storm){const g=G;const h0=g?g.hp+g.sh:0;const r=o.apply(this,arguments);try{if(!g)return r;const lost=h0-(g.hp+g.sh);
 if(lost>0&&!storm){vig=Math.min(1,vig+.25+lost/60);
  let src=null,bd=1.8;g.eb.forEach(b=>{if(b.x13s&&b.l>0){const q=Math.hypot(b.x-g.x,b.z-g.z);if(q<bd){bd=q;src=b.x13s}}});
  if(!src){let md=5;g.en.forEach(e=>{if(!e.dead){const q=Math.hypot(e.x-g.x,e.z-g.z);if(q<md){md=q;src=e}}})}if(src)setRev(src)}
 if(g.hp<=0&&X.totem>0){X.totem--;g.hp=Math.round(g.mhp*.5);g.ef.push({k:'inv',t:3});try{say('💠 MÁSODIK ESÉLY! A totem visszahozott – 3 mp sérthetetlenség!');ftx(g.x,g.z,'💠 ÚJRAÉLEDTÉL','')}catch(e){}beep(520,.5,.1,'sine');beep(780,.6,.08,'sine')}
 }catch(er){}return r}}

// ---------- 1 + 4: sht csomagoló (kiegészítők, hő) ----------
if(typeof window.sht==='function'){const o=window.sht;window.sht=function(){const g=G;if(!g||!WPN[g.wp])return o.apply(this,arguments);const hw=g.wp===7||g.wp===8;
 if(hw&&X.oh){if(g.cd<=0){g.cd=.25;beep(160,.08,.04,'sawtooth')}return}
 const w=WPN[g.wp],bk=[w.spr,w.spd,w.dmg,w.cd],a=X.att;
 if(a.scope){w.spr=(w.spr||0)*.55;w.spd*=1.3}if(a.grip){w.spr=(w.spr||0)*.7;w.cd=(w.cd||.2)/1.12}if(a.sil)w.dmg*=1.1;
 const n=g.bl.length;let r;try{r=o.apply(this,arguments)}finally{w.spr=bk[0];w.spd=bk[1];w.dmg=bk[2];w.cd=bk[3]}
 if(g.bl.length>n&&hw){X.heat=Math.min(1,X.heat+(g.wp===7?.012:.11));if(X.heat>=1){X.oh=true;try{say('🔥 TÚLMELEGEDETT! Várj, amíg lehűl!')}catch(e){}beep(220,.4,.08,'sawtooth')}}
 return r}}
if(typeof window.muzzleFlash==='function'){const o=window.muzzleFlash;window.muzzleFlash=function(){if(X.att.sil&&okG())return;return o.apply(this,arguments)}}

// ---------- vándorárus sorok ----------
const SHOP=[['scope'],['sil'],['grip'],['totem']];
const ob=window.x20buy;
if(ob){window.x20buy=function(i){if(i<200||i>=300)return ob.apply(this,arguments);const k=SHOP[i-200][0],g=G;if(!g)return;const price=k==='totem'?5000:ATT[k].p;
 if(k!=='totem'&&X.att[k]){try{say('Már van '+ATT[k].n.toLowerCase()+' a fegyvereden.')}catch(e){}return}if(g.cash<price)return;g.cash-=price;
 if(k==='totem'){X.totem++;say('💠 Második esély totem megvéve! Ha elesnél, visszahoz.')}else{X.att[k]=1;say(ATT[k].e+' '+ATT[k].n+' felszerelve: '+ATT[k].d)}try{sfx('drop')}catch(e){}if(window.x20near)window.x20near()}}
new MutationObserver(()=>{const mb=document.getElementById('x20MB');if(!mb)return;const h=mb.querySelector('h2');if(!h||!/VÁNDORÁRUS/.test(h.textContent)||mb.querySelector('.x13arow'))return;const g=G;if(!g)return;
 const wrap=document.createElement('div');wrap.innerHTML='<h3 style="background:linear-gradient(90deg,#facc15,#c084fc);-webkit-background-clip:text;color:transparent">🔧 FEGYVERKIEGÉSZÍTŐK</h3>'+SHOP.map((s,i)=>{const k=s[0],t=k==='totem'?{e:'💠',n:'Második esély totem',d:'elesés helyett újraéledsz 50% élettel',p:5000}:ATT[k],own=k!=='totem'&&X.att[k];
  return '<div class="x20row x13arow"><span>'+t.e+' <b>'+t.n+'</b> <small style="color:#cbd5e1">'+t.d+'</small>'+(own?' <b style="color:#86efac">✔</b>':k==='totem'&&X.totem?' <b style="color:#86efac">(x'+X.totem+')</b>':'')+'</span><button class="'+(g.cash>=t.p&&!own?'y':'')+'" '+(g.cash>=t.p&&!own?'':'disabled')+' onclick="x20buy('+(200+i)+')">'+fmt(t.p)+' Ft</button></div>'}).join('');
 const close=[...mb.querySelectorAll('button')].pop();if(close&&close.parentNode)close.parentNode.before(wrap);else mb.appendChild(wrap)}).observe(document.body,{childList:true,subtree:true});

// ---------- 2 + 9: billentyűk ----------
addEventListener('keydown',e=>{if(!okG())return;const k=(e.key||'').toLowerCase();if(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
 if(k===','||k==='.'){X.lk[k]=1;return}
 if(e.repeat||!'wasd'.includes(k)||k.length!==1)return;const now=performance.now();
 if(now-(X.lastTap[k]||0)<260&&X.dashCd<=0)dash(k);X.lastTap[k]=now});
addEventListener('keyup',e=>{const k=(e.key||'').toLowerCase();if(k===','||k==='.')X.lk[k]=0});
function dash(k){const g=G;let vx=k==='d'?1:k==='a'?-1:0,vz=k==='s'?1:k==='w'?-1:0;if(g.fp){const sx=vx,sz=vz,c=Math.cos(g.ang),s=Math.sin(g.ang);vx=-sz*c-sx*s;vz=-sz*s+sx*c}
 X.dash={vx,vz,t:.18};X.dashCd=2.5;X.lastTap={};g.ef.push({k:'inv',t:.25});beep(300,.15,.06,'sawtooth');beep(600,.1,.04)}

// ---------- pálya: bunkerek, kerítések, hidak ----------
const MATS={};function mat(c,o){const k=c+'_'+(o||1);if(!MATS[k]){MATS[k]=new THREE.MeshLambertMaterial({color:c});if(o){MATS[k].transparent=true;MATS[k].opacity=o}}return MATS[k]}
const BOX=new THREE.BoxGeometry(1,1,1);
function box(w,h,d,x,y,z,c,ry){const m=new THREE.Mesh(BOX,mat(c));m.scale.set(w,h,d);m.position.set(x,y,z);m.rotation.y=ry||0;m.castShadow=true;m.receiveShadow=true;scene.add(m);X.objs.push(m);return m}
function free(x,z,r){const g=G;if(g.arh?!hin(x,z):Math.hypot(x,z)>52)return false;if(Math.hypot(x-g.x,z-g.z)<12)return false;return !g.col.some(c=>Math.hypot(c.x-x,c.z-z)<r+(c.hw?Math.max(c.hw,c.hd):c.r||1))}
function spot(r){const g=G,R=g.arh?380:48;for(let i=0;i<60;i++){const x=(Math.random()*2-1)*R,z=(Math.random()*2-1)*R;if(free(x,z,r))return[x,z]}return null}
function bunker(x,z){const g=G,W=7,D=6,H=2.9,T=.5,cC=0x6b7280,cD=0x4b5563;
 const wall=(w,d,px,pz)=>{const m=box(w,H,d,px,H/2,pz,cC);const c={x:px,z:pz,hw:w/2,hd:d/2,h:H,m};g.col.push(c)};
 wall(W,T,x,z-D/2);wall(T,D,x-W/2,z);wall(T,D,x+W/2,z);wall(2.5,T,x-W/2+1.25,z+D/2);wall(2.5,T,x+W/2-1.25,z+D/2);
 const roof=box(W+.6,.4,D+.6,x,H+.2,z,cD);g.col.push({x,z,hw:W/2+.3,hd:D/2+.3,h:H+.4,y0:H,m:roof});
 box(1.2,.5,.6,x-1.5,.25,z-1.8,0x92400e);box(1.2,.5,.6,x+1.5,.25,z-1.8,0x92400e);// ládák
 const l=spr('🛖 BUNKER',2,'x');l.position.set(x,H+1.4,z);scene.add(l);X.objs.push(l)}
function fence(x,z,ry,n){const g=G;for(let i=0;i<n;i++){const px=x+Math.cos(ry)*i*3.1,pz=z-Math.sin(ry)*i*3.1;if(g.arh&&!hin(px,pz))continue;
 const m=box(3,1.8,.25,px,.9,pz,0xa16207,ry);const c={x:px,z:pz,hw:1.5,hd:.2,h:1.8,m};g.col.push(c);g.wl.push({m,x:px,z:pz,hp:120,mhp:120,kind:'x13a',cols:[c]})}}
function bridge(x,z){const g=G,cols=[],pls=[],grp=[];const H=[.4,.8,1.2,1.2,1.2,.8,.4];H.forEach((h,i)=>{const pz=z+(i-3)*1.6;const m=box(2.6,h,1.6,x,h/2,pz,i%2?0x854d0e:0x78350f);grp.push(m);const pl={x,z:pz,hw:1.3,hd:.8,h};g.plat.push(pl);pls.push(pl)});
 box(.15,1,11.2,x-1.3,1.7,z,0x713f12);box(.15,1,11.2,x+1.3,1.7,z,0x713f12);
 const l=spr('🌉 FAHÍD',1.6,'x');l.position.set(x,3.4,z);scene.add(l);X.objs.push(l);
 const grpM=new THREE.Group();scene.add(grpM);X.objs.push(grpM);
 // rombolható: a középső deszkát lőve a teljes híd összedől
 g.wl.push({m:grpM,x,z,hp:200,mhp:200,kind:'x13a',pls,cols:[],x13b:grp})}
function buildMap(){const g=G;if(!g.col)return;g.plat=g.plat||[];
 const nb=g.arh?8:3,nf=g.arh?10:4,nh=g.arh?4:2;
 for(let i=0;i<nb;i++){const p=spot(6);if(p)bunker(p[0],p[1])}
 for(let i=0;i<nf;i++){const p=spot(5);if(p)fence(p[0],p[1],Math.random()*Math.PI,3+(Math.random()*3|0))}
 for(let i=0;i<nh;i++){const p=spot(6);if(p)bridge(p[0],p[1])}}
function clearMap(){X.objs.forEach(m=>{if(m.parent)m.parent.remove(m)});X.objs=[];if(X.ally&&X.ally.m.parent)X.ally.m.parent.remove(X.ally.m);X.ally=null;if(X.rev&&X.rev.m.parent)X.rev.m.parent.remove(X.rev.m);X.rev=null}

// ---------- 3: lent levő bot-társ ----------
function bot(){const grp=new THREE.Group();const c1=0x7c3aed,c2=0xfacc15;
 const b=new THREE.Mesh(BOX,mat(c1));b.scale.set(.9,1.2,.5);b.position.y=1.4;grp.add(b);const h=new THREE.Mesh(BOX,mat(0xfcd34d));h.scale.set(.55,.55,.55);h.position.y=2.35;grp.add(h);
 [-.25,.25].forEach(x=>{const l=new THREE.Mesh(BOX,mat(0x1e1b4b));l.scale.set(.32,.8,.32);l.position.set(x,.4,0);grp.add(l)});const gun=new THREE.Mesh(BOX,mat(c2));gun.scale.set(.15,.15,.8);gun.position.set(.45,1.4,.4);grp.add(gun);return grp}
function spawnRev(){const p=spot(3);if(!p)return;const m=bot();m.rotation.z=Math.PI/2;m.position.set(p[0],.3,p[1]);scene.add(m);const l=spr('🆘 LENT VAN – állj mellé!',2,'x');l.position.set(0,0,0);l.position.set(p[0],3,p[1]);scene.add(l);X.objs.push(l);
 X.rev={m,x:p[0],z:p[1],pr:0,l};}
const tr=[];function tracer(a,b){const geo=new THREE.BufferGeometry().setFromPoints([a,b]);const L=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xfacc15}));scene.add(L);tr.push({L,t:.08})}

// ---------- 5: ricochet ----------
const SPG=new THREE.SphereGeometry(.07,4,3);
function sparks(x,y,z){for(let i=0;i<6;i++){if(X.sparks.length>60)break;const m=new THREE.Mesh(SPG,mat(i%2?0xfde047:0xfb923c));m.position.set(x,y,z);scene.add(m);X.sparks.push({m,vx:(Math.random()-.5)*8,vy:Math.random()*5,vz:(Math.random()-.5)*8,t:.35})}}
function colAt(x,y,z){const p={x,y,z};let f=null;G.col.some(c=>{if(!(c.h>1.6&&y<c.h&&!(c.y0&&y<c.y0)))return false;if(c.hw){if(Math.abs(x-c.x)>c.hw+c.hd||Math.abs(z-c.z)>c.hw+c.hd)return false;const[lx,lz]=boxLocal(c,x,z);if(Math.abs(lx)<c.hw&&Math.abs(lz)<c.hd){f=c;return true}return false}if(Math.hypot(x-c.x,z-c.z)<c.r){f=c;return true}return false});return f}
function ricochet(dt){const g=G;if(g.bl.length>80)return;for(const b of g.bl){if(b.x13r||b.boom||b.l<=0)continue;const nx=b.x+b.vx*dt,nz=b.z+b.vz*dt,ny=b.y+(b.vy||0)*dt;const c=colAt(nx,ny,nz);if(!c||g.wl.some(w=>w.cols&&w.cols.includes(c)))continue;b.x13r=1;
 if(Math.random()>.45)continue;let nX,nZ;if(c.hw){const a=c.m?c.m.rotation.y:0,cs=Math.cos(a),sn=Math.sin(a);const[lx,lz]=boxLocal(c,b.x,b.z);const ux=Math.abs(lx)/c.hw>Math.abs(lz)/c.hd;const ln=ux?[Math.sign(lx),0]:[0,Math.sign(lz)];nX=ln[0]*cs+ln[1]*sn;nZ=-ln[0]*sn+ln[1]*cs}else{const d=Math.hypot(b.x-c.x,b.z-c.z)||1;nX=(b.x-c.x)/d;nZ=(b.z-c.z)/d}
 const dot=b.vx*nX+b.vz*nZ;if(dot>=0)continue;b.vx-=2*dot*nX;b.vz-=2*dot*nZ;b.vx*=.75;b.vz*=.75;b.d*=.6;b.l=Math.min(b.l,.6);sparks(b.x,b.y,b.z);beep(2600+Math.random()*800,.06,.025,'sine')}}

// ---------- update csomagoló ----------
const oU=window.update;
window.update=function(dt){const g=typeof G!=='undefined'?G:null;
 if(g&&g!==X.gref){X.gref=g;clearMap();X.att={};X.heat=0;X.oh=false;X.built=false;rev=null;revBon=0;X.dashCd=0}
 let chests=null;
 if(g&&g.phase==='play'&&!g.over){const d=Math.min(.1,dt||.016);
  if(!X.built){X.built=true;try{buildMap();spawnRev()}catch(e){console.error('x13a map',e)}}
  try{ricochet(d)}catch(e){}
  if(g.pk){chests=g.pk.filter(p=>p.t==='chest'&&p.l>0&&Math.hypot(p.x-g.x,p.z-g.z)<4)}
 }
 const r=oU.apply(this,arguments);
 if(!g||g.over||g.phase!=='play'){V.style.opacity=0;RV.style.display='none';RVV.style.display='none';P.style.display='none';return r}
 try{tick(Math.min(.1,dt||.016),chests)}catch(e){console.error('x13a',e)}return r};

function tick(d,chests){const g=G;P.style.display='flex';
 // láda → kiegészítő
 if(chests)chests.forEach(p=>{if(p.l<=0&&Math.random()<.5){const n=Object.keys(ATT).filter(k=>!X.att[k]);if(n.length){const k=n[Math.random()*n.length|0];X.att[k]=1;say('🎁 '+ATT[k].e+' '+ATT[k].n+' a ládában! '+ATT[k].d)}}});
 // hő
 const firing=g.cd>0&&(g.wp===7||g.wp===8);X.heat=Math.max(0,X.heat-d*(X.oh?.35:firing?.08:.3));if(X.oh&&X.heat<=.05){X.oh=false;try{say('❄️ Lehűlt, mehet!')}catch(e){}}
 // dash
 X.dashCd=Math.max(0,X.dashCd-d);if(X.dash){const D=X.dash;const ox=g.x,oz=g.z;g.x+=D.vx*40*d;g.z+=D.vz*40*d;if(g.arh&&!hin(g.x,g.z)){g.x=ox;g.z=oz}try{pushOut(g,.9,g.y)}catch(e){}D.t-=d;if(D.t<=0)X.dash=null}
 // kihajolás
 const tl=(X.lk['.']?1:0)-(X.lk[',']?1:0);X.lean+=(tl-X.lean)*Math.min(1,d*12);
 if(g.fp&&Math.abs(X.lean)>.01){const sx=-Math.sin(g.ang),sz=Math.cos(g.ang);let off=X.lean*.9;const tx=g.x+sx*off*1.4,tz=g.z+sz*off*1.4;if(colAt(tx,g.y+2.6,tz))off*=.25;cam.position.x+=sx*off;cam.position.z+=sz*off;cam.position.y-=Math.abs(off)*.15;cam.rotateZ(-X.lean*.22)}
 // vignetta
 vig=Math.max(0,vig-d*.9);const low=g.hp<g.mhp*.3?.35+Math.sin(g.t*6)*.12:0;const vo=Math.max(vig,low);if(Math.abs(vo-(X.vo||0))>.02){X.vo=vo;V.style.opacity=vo.toFixed(2)}
 // bosszú
 if(rev&&rev.dead){if(revSpr&&revSpr.parent)revSpr.parent.remove(revSpr);g.cash+=500;revBon++;try{say('🎯 BOSSZÚ BETELJESEDETT! +500 Ft');ftx(rev.x,rev.z,'🎯 BOSSZÚ +500','')}catch(e){}rev=null}
 if(rev){const dx=rev.x-g.x,dz=rev.z-g.z,dist=Math.hypot(dx,dz)|0;const rel=Math.atan2(dz,dx)-g.ang;const s='🎯 BOSSZÚ: '+(rev.n||'támadód')+' · '+dist+' m';if(RV._s!==s){RV._s=s;RV.innerHTML=s+' <span>➤</span>'}const sp=RV.querySelector('span');if(sp)sp.style.transform='rotate('+(g.fp?rel*180/Math.PI-90:Math.atan2(dz,dx)*180/Math.PI)+'deg)';RV.style.display='block'}else RV.style.display='none';
 // újraélesztés
 if(X.rev){const R=X.rev,dd=Math.hypot(R.x-g.x,R.z-g.z);if(dd<3){R.pr+=d/3;RVV.style.display='block';RVV.innerHTML='🩹 Újraélesztés... <u style="width:'+Math.round(R.pr*100)+'%"></u>';if(R.pr>=1){R.m.rotation.z=0;R.m.position.y=0;if(R.l.parent)R.l.parent.remove(R.l);X.ally={m:R.m,x:R.x,z:R.z,cd:0};X.rev=null;RVV.style.display='none';say('🤝 Felélesztetted a társadat! Mostantól veled harcol.');beep(660,.3,.08,'sine');beep(990,.4,.06,'sine')}}else{R.pr=Math.max(0,R.pr-d*.5);RVV.style.display='none'}}
 if(X.ally){const A=X.ally,dx=g.x-A.x,dz=g.z-A.z,dd=Math.hypot(dx,dz);if(dd>30){A.x=g.x-2;A.z=g.z-2}else if(dd>3.5){A.x+=dx/dd*8*d;A.z+=dz/dd*8*d}A.m.position.set(A.x,g.y>2&&dd<5?g.y:0,A.z);A.cd-=d;
  let t=null,bd=26;g.en.forEach(e=>{if(!e.dead){const q=Math.hypot(e.x-A.x,e.z-A.z);if(q<bd){bd=q;t=e}}});if(t){A.m.rotation.y=Math.atan2(t.x-A.x,t.z-A.z);if(A.cd<=0){A.cd=.7;X.noHm=1;try{dmgE(t,14,false)}catch(e){}X.noHm=0;tracer(new THREE.Vector3(A.x,1.5,A.z),new THREE.Vector3(t.x,1.5,t.z))}}else A.m.rotation.y=Math.atan2(dx,dz)}
 for(let i=tr.length-1;i>=0;i--){tr[i].t-=d;if(tr[i].t<=0){scene.remove(tr[i].L);tr[i].L.geometry.dispose();tr.splice(i,1)}}
 // szikrák
 for(let i=X.sparks.length-1;i>=0;i--){const s=X.sparks[i];s.t-=d;s.vy-=20*d;s.m.position.x+=s.vx*d;s.m.position.y+=s.vy*d;s.m.position.z+=s.vz*d;if(s.t<=0){scene.remove(s.m);X.sparks.splice(i,1)}}
 // összedőlt híd darabjai
 g.wl.forEach(w=>{if(w.x13b&&w.hp<=0&&!w.x13d){w.x13d=1;w.x13b.forEach(m=>{if(m.parent)m.parent.remove(m)});sparks(w.x,1,w.z);try{ftx(w.x,w.z,'🌉 A HÍD ÖSSZEDŐLT!','')}catch(e){}}});
 drawPanel()}
X.dbg={buildMap,spawnRev,spot,free};window._x13aT=()=>({att:X.att,totem:X.totem,heat:X.heat,oh:X.oh,objs:X.objs.length,rev:!!X.rev,ally:!!X.ally,revenge:!!rev,dashCd:X.dashCd});
})();
// meccs vége: HUD elrejtése
(function(){const o=window.end;if(typeof o!=='function')return;window.end=function(){try{['x13aP','x13aR','x13aRv'].forEach(i=>{const d=document.getElementById(i);if(d)d.style.display='none'});document.getElementById('x13aV').style.opacity=0}catch(e){}return o.apply(this,arguments)}})();
