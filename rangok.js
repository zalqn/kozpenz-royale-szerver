// rangok.js – 🏅 RANG-RENDSZER: Tag → VIP → VIP+ → Elit → Legenda → Mester → Örökös
// Csak játékbeli pénz (S.c Ft) / zseton (BR.zs) / fiókszint. Mentés: localStorage k3rang. Debug: _rang
(function(){
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const $i=id=>document.getElementById(id);
const fm=n=>Math.round(n).toLocaleString('hu-HU');
// [név, ikon, szín, Ft ár, zseton ár, szint (ingyen), meccspénz %, napi bónusz Ft, kozmetikum]
const R=[
 ['Tag','🙂','#94a3b8',0,0,1,0,0,'—'],
 ['VIP','⭐','#22c55e',60000,150,8,5,1500,'Zöld névszín'],
 ['VIP+','🌟','#06b6d4',180000,450,15,10,3500,'Türkiz névszín + csillogás'],
 ['Elit','💠','#3b82f6',450000,1100,28,15,7000,'Kék fénykeret a panelen'],
 ['Legenda','🔥','#f97316',1100000,2600,45,22,14000,'Lángoló név-aura'],
 ['Mester','👑','#eab308',2600000,6000,70,30,25000,'Arany korona-aura'],
 ['Örökös','🌌','#d946ef',6000000,14000,110,40,45000,'Szivárvány névszín']
];
let D=LS.g('k3rang',{r:0,day:'',bought:[],glow:1});
const save=()=>{LS.s('k3rang',D);sync()};
const today=()=>new Date().toISOString().slice(0,10);
const lv=()=>{try{return window.ACCXP?ACCXP.get().lv:1}catch(e){return 1}};
const hasS=()=>typeof S!=='undefined'&&S,hasB=()=>typeof BR!=='undefined'&&BR;const ft=()=>(hasS()&&S.c)||0, zs=()=>(hasB()&&BR.zs)||0;
const saveGame=()=>{try{hasS()&&localStorage.setItem('k3c',JSON.stringify(S.c))}catch(e){}try{window.st&&hasB()&&st.s('k3br',BR)}catch(e){}};
const toast=t=>{try{if(window.say)say(t);else if(window.gameChat)gameChat(t,'sys')}catch(e){}};
function sync(){try{if(window.ACC&&ACC.user&&!ACC.guest){ACC.user.rang=D.r}}catch(e){}}
// ---- fiókhoz kötés: szerver az irányadó (/api/rang/set ellenőrzi: sorban, Ft/zseton/szint) ----
const accOn=()=>window.ACC&&ACC.user&&!ACC.guest&&ACC.token?ACC:null;
async function srv(r,how,ft0,zs0){const a=accOn();if(!a)return{ok:true,rang:r,local:1};
 try{const q=await fetch('/api/rang/set',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({r,how,ft:ft0,zs:zs0,lv:lv()})});const j=await q.json();if(typeof j.rang==='number')a.user.rang=j.rang;return q.ok?j:{ok:false,error:j.error,rang:j.rang}}catch(e){return{ok:false,net:1,error:'Szerver nem érhető el'}}}
let who='';
async function login(){const a=accOn();if(!a)return;const sr=a.user.rang|0;
 if(D.r>sr){const j=await srv(D.r,'migr',ft(),zs());const v=typeof j.rang==='number'?j.rang:sr;if(D.r!==v){D.r=v;LS.s('k3rang',D);toast('🏅 Rang a fiókodból: ['+R[v][0]+']')}}
 else if(sr!==D.r){D.r=sr;LS.s('k3rang',D);toast('🏅 Rang betöltve a fiókodból: ['+R[sr][0]+']')}
 deco(true);autoLv()}
setInterval(()=>{const a=accOn(),n=a?a.user.name:'';if(n!==who){who=n;if(n)login()}},1000);
// szint-alapú automatikus rang
function autoLv(){const l=lv();let best=D.r;R.forEach((x,i)=>{if(l>=x[5]&&i>best)best=i});if(best>D.r){if(accOn()){if(autoLv.b)return;autoLv.b=1;srv(best,'lv',ft(),zs()).then(j=>{autoLv.b=0;if(j.ok&&j.rang>D.r){D.r=j.rang;save();toast('🏅 Új rang szint alapján: ['+R[D.r][0]+']')}});return}D.r=best;save();toast('🏅 Új rang szint alapján: ['+R[best][0]+']')}}
function buy(i,how){if(i<=D.r)return'Már megvan.';if(i!==D.r+1)return'Előbb az előző rangot szerezd meg!';const x=R[i];const f0=ft(),z0=zs();
 if(accOn()){if(buy.b)return'⏳ Folyamatban…';if(how==='ft'&&f0<x[3])return'Nincs elég Ft ('+fm(x[3])+' kell).';if(how==='zs'&&z0<x[4])return'Nincs elég zseton ('+fm(x[4])+' kell).';
  buy.b=1;srv(i,how,f0,z0).then(j=>{buy.b=0;if(j.ok&&j.rang>=i){if(how==='ft')S.c-=x[3];else BR.zs-=x[4];D.r=j.rang;save();saveGame();draw('🏅 Gratulálunk! Új rangod: ['+R[D.r][0]+'] (a fiókodhoz mentve)')}else draw('❌ '+(j.error||'Elutasítva'));deco(true)});return'⏳ Ellenőrzés a szerveren…'}
 if(how==='ft'){if(ft()<x[3])return'Nincs elég Ft ('+fm(x[3])+' kell).';S.c-=x[3]}
 else if(how==='zs'){if(zs()<x[4])return'Nincs elég zseton ('+fm(x[4])+' kell).';BR.zs-=x[4]}
 else return'?';D.r=i;save();saveGame();return'🏅 Gratulálunk! Új rangod: ['+x[0]+']'}
function daily(){const x=R[D.r];if(!x[7])return'A Tag rangnak nincs napi bónusza.';if(D.day===today())return'Ma már átvetted, gyere holnap!';
 D.day=today();if(hasS())S.c=(S.c||0)+x[7];save();saveGame();return'🎁 Napi rang-bónusz: +'+fm(x[7])+' Ft'}
// ---- meccspénz bónusz ----
{const oe=window.end;if(typeof oe==='function')window.end=function(){try{const g=typeof G!=='undefined'?G:null;const p=R[D.r][6];if(g&&!g.over&&!g._rkB&&p>0&&g.cash>0){g._rkB=1;g.cash*=1+p/100}}catch(e){}return oe.apply(this,arguments)}}
// ---- stílus ----
const css=document.createElement('style');css.textContent=`
.rkTag{display:inline-block;margin-right:4px;padding:0 5px;border-radius:5px;font:800 .85em Rajdhani,Arial;color:#fff;text-shadow:0 1px 2px #000;vertical-align:baseline;line-height:1.35;pointer-events:none}
.rkTag.g4{box-shadow:0 0 8px #f97316}.rkTag.g5{box-shadow:0 0 10px #eab308}.rkTag.g6{background:linear-gradient(90deg,#ef4444,#eab308,#22c55e,#3b82f6,#d946ef)!important;animation:rkH 3s linear infinite}
@keyframes rkH{to{filter:hue-rotate(360deg)}}
#rkBtn{background:linear-gradient(135deg,#422006,#a16207);border:1px solid #facc15;color:#fef08a;border-radius:12px;padding:7px 10px;font:800 14px Rajdhani,Arial;cursor:pointer;box-shadow:0 4px 14px #0008}
#rkP{position:fixed;inset:0;z-index:30;display:none;align-items:center;justify-content:center;background:#000b;font-family:Rajdhani,Arial;color:#e2e8f0}#rkP.on{display:flex}
#rkP .pn{width:min(980px,95vw);max-height:90vh;overflow:auto;padding:20px 22px;border-radius:20px;background:linear-gradient(160deg,#0b1022f5,#1a1033f5);border:2px solid var(--rc,#475569);box-shadow:0 0 40px var(--rc,#000),0 30px 80px #000}
#rkP h2{margin:0;font:30px 'Luckiest Guy',Impact;color:#facc15;letter-spacing:1px}#rkP .x{float:right;background:#334155;border:0;color:#fff;border-radius:10px;padding:6px 12px;font:800 16px Rajdhani;cursor:pointer}
#rkP .cur{display:flex;gap:16px;align-items:center;margin:12px 0;padding:12px;border-radius:14px;background:#ffffff0d}
#rkP .big{font-size:46px}#rkP .m{color:#94a3b8;font-size:14px}
#rkP .bar{height:8px;background:#1e293b;border-radius:6px;overflow:hidden;margin-top:6px;width:300px;max-width:60vw}#rkP .bar i{display:block;height:100%}
#rkP table{width:100%;border-collapse:collapse;font-size:15px;margin-top:8px}#rkP th,#rkP td{padding:7px 6px;text-align:center;border-bottom:1px solid #ffffff14}
#rkP th{color:#cbd5e1;font-size:13px;text-transform:uppercase}#rkP tr.me{background:#facc1522}#rkP tr.own td{opacity:.75}
#rkP button.b{padding:5px 9px;margin:2px;border-radius:8px;border:1px solid #ffffff33;background:#1e293b;color:#fff;font:700 13px Rajdhani;cursor:pointer}#rkP button.b:disabled{opacity:.35;cursor:default}
#rkP button.b:not(:disabled):hover{filter:brightness(1.4)}#rkP .msg{min-height:20px;margin-top:8px;color:#fde047;font-weight:700}
@media(max-width:640px){#rkP td,#rkP th{padding:4px 2px;font-size:12px}}`;document.head.appendChild(css);
function tagEl(i){const x=R[i],s=document.createElement('span');s.className='rkTag g'+i;s.dataset.rk=i;s.style.background=x[2];s.textContent='['+x[0]+']';return s}
// ---- panel ----
const P=document.createElement('div');P.id='rkP';P.innerHTML='<div class="pn"></div>';document.body.appendChild(P);
P.onclick=e=>{if(e.target===P)close()};
function close(){P.classList.remove('on');try{window.guiClose&&guiClose()}catch(e){}}
function open(){autoLv();draw();loadTop();P.classList.add('on');try{window.guiOpen&&guiOpen('')}catch(e){}}
function draw(m){const c=R[D.r],n=R[D.r+1],l=lv(),pn=P.querySelector('.pn');pn.style.setProperty('--rc',c[2]);
 let h='<button class="x" id="rkX">✕</button><h2>🏅 RANGOK</h2><div class="m">Rangot játékpénzzel (Ft), zsetonnal vagy fiókszinttel szerezhetsz – sorban, egymás után.</div>';
 h+='<div class="cur"><div class="big">'+c[1]+'</div><div><div style="font-size:22px;font-weight:800">Jelenlegi rangod: <span class="rkTag g'+D.r+'" style="background:'+c[2]+'">['+c[0]+']</span></div>';
 h+='<div class="m">Meccspénz +'+c[6]+'% · napi bónusz '+fm(c[7])+' Ft · '+c[8]+' · Fiókszint: Lv '+l+'</div>';
 if(n){const p=Math.min(100,l/n[5]*100);h+='<div class="m">Következő: '+n[1]+' '+n[0]+' – ingyen Lv '+n[5]+'-nél</div><div class="bar"><i style="width:'+p+'%;background:'+n[2]+'"></i></div>'}else h+='<div class="m">🌌 Elérted a legmagasabb rangot!</div>';
 h+='</div><div style="margin-left:auto"><button class="b" id="rkD" '+(c[7]&&D.day!==today()?'':'disabled')+'>🎁 Napi bónusz</button><br><label class="m"><input type="checkbox" id="rkG" '+(D.glow?'checked':'')+'> Rang-előtag a nevem előtt</label></div></div>';
 h+='<table><tr><th>Rang</th><th>Ft ár</th><th>Zseton</th><th>Ingyen szinttől</th><th>Meccspénz</th><th>Napi bónusz</th><th>Kozmetikum</th><th></th></tr>';
 R.forEach((x,i)=>{const own=i<=D.r,nx=i===D.r+1;h+='<tr class="'+(i===D.r?'me':own?'own':'')+'"><td style="text-align:left">'+x[1]+' <span class="rkTag g'+i+'" style="background:'+x[2]+'">['+x[0]+']</span></td><td>'+(x[3]?fm(x[3]):'–')+'</td><td>'+(x[4]?fm(x[4]):'–')+'</td><td>Lv '+x[5]+'</td><td>+'+x[6]+'%</td><td>'+(x[7]?fm(x[7]):'–')+'</td><td class="m">'+x[8]+'</td><td>'+
  (own?'✅':nx?'<button class="b" data-b="ft" data-i="'+i+'" '+(ft()>=x[3]?'':'disabled')+'>💰 Ft</button><button class="b" data-b="zs" data-i="'+i+'" '+(zs()>=x[4]?'':'disabled')+'>🪙 Zseton</button>':'🔒')+'</td></tr>'});
 h+='</table><div class="m" style="margin-top:6px">Egyenleg: '+fm(ft())+' Ft · '+fm(zs())+' zseton · Chat parancs: /rang, /rang napi, /rang lista</div><div class="msg">'+(m||'')+'</div><h3 style="margin:14px 0 4px;color:#facc15">🏆 Rang-ranglista (szerver)</h3><div id="rkTop" class="m">'+(TOP||'Betöltés…')+'</div>';
 pn.innerHTML=h;$i('rkX').onclick=close;$i('rkD').onclick=()=>draw(daily());$i('rkG').onchange=e=>{D.glow=e.target.checked?1:0;save();deco(true)};
 pn.querySelectorAll('button[data-b]').forEach(b=>b.onclick=()=>{draw(buy(+b.dataset.i,b.dataset.b));deco(true)})}
let TOP='';
async function loadTop(){try{const j=await(await fetch('/api/rang/top')).json();const nm=myName();
 TOP=j.list&&j.list.length?'<table><tr><th>#</th><th>Játékos</th><th>Rang</th><th>Szint</th></tr>'+j.list.map((u,k)=>'<tr'+(u.name===nm?' class="me"':'')+'><td>'+(['🥇','🥈','🥉'][k]||k+1+'.')+'</td><td style="text-align:left">'+String(u.avatar||'').replace(/[<&>]/g,'')+' '+String(u.name).replace(/[<&>]/g,'')+'</td><td><span class="rkTag g'+u.rang+'" style="background:'+R[u.rang][2]+'">'+R[u.rang][1]+' '+R[u.rang][0]+'</span></td><td>Lv '+(u.level|0)+'</td></tr>').join('')+'</table>':'Még senkinek nincs rangja – légy te az első!'}
 catch(e){TOP='⚠️ A ranglista csak szerverrel érhető el.'}const el=$i('rkTop');if(el)el.innerHTML=TOP}
addEventListener('keydown',e=>{if(e.key==='Escape'&&P.classList.contains('on')){e.stopPropagation();close()}},true);
// ---- lobby gomb (x14hub) ----
const inMatch=()=>{try{return typeof run!=='undefined'&&run}catch(e){return false}};
function btn(){let h=$i('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!$i('rkBtn')){const b=document.createElement('button');b.id='rkBtn';b.title='Rangok';b.onclick=open;h.insertBefore(b,h.firstChild)}
 const b=$i('rkBtn'),t=R[D.r][1]+' RANG: '+R[D.r][0];if(b.textContent!==t)b.textContent=t;b.style.display=inMatch()?'none':''}
// ---- név-előtag mindenhol, ahol a saját nevünk áll ----
const myName=()=>{try{return (window.ACC&&ACC.user&&ACC.user.name)||(window.ME&&ME.name)||(hasS()&&S.u&&S.u.name)||''}catch(e){return''}};
const SKIP=new Set(['SCRIPT','STYLE','INPUT','TEXTAREA','CANVAS','OPTION','BUTTON']);
function fix(el){const pv=el.previousSibling;const has=pv&&pv.nodeType===1&&pv.classList&&pv.classList.contains('rkTag');
 if(!D.glow||D.r===0){if(has)pv.remove();return}if(has&&+pv.dataset.rk===D.r)return;if(has)pv.remove();el.parentNode.insertBefore(tagEl(D.r),el)}
function deco(force){const nm=myName();if(!nm)return;
 if(force)document.querySelectorAll('.rkTag[data-rk]').forEach(t=>{if(!t.closest('#rkP'))t.remove()});
 const all=document.body.getElementsByTagName('*');for(let k=0;k<all.length;k++){const el=all[k];if(el.childElementCount||SKIP.has(el.tagName)||el.id==='lbName'||el.classList.contains('rkTag'))continue;
  const t=el.textContent.trim();if(t!==nm&&t!=='@'+nm)continue;if(el.closest('#rkP,#lbName'))continue;if(!el.parentNode)continue;
  if(el.offsetParent===null&&getComputedStyle(el).position!=='fixed')continue;fix(el)}}
// chat (T): a saját sorok elé
function chatObs(){const lg=document.querySelector('#gChat .log');if(!lg||lg._rk)return;lg._rk=1;new MutationObserver(ms=>{const nm=myName()||'Te';ms.forEach(m=>m.addedNodes.forEach(d=>{if(d.nodeType===1&&D.glow&&D.r>0&&d.textContent.startsWith(nm+': ')&&!d.querySelector('.rkTag'))d.insertBefore(tagEl(D.r),d.firstChild)}))}).observe(lg,{childList:true})}
// ---- chat parancs ----
{const oc=window.extraCmd;window.extraCmd=function(c){const p=String(c).trim().split(/\s+/),n=(p[0]||'').toLowerCase().replace(/^\//,'');
 if(n==='rang'){const s=(p[1]||'').toLowerCase();
  if(!s)return'🏅 Rangod: ['+R[D.r][0]+'] · +'+R[D.r][6]+'% meccspénz · /rang lista · /rang napi · /rang panel · /rang dev N';
  if(s==='lista')return R.map((x,i)=>(i===D.r?'▶':'')+x[1]+x[0]+' (Lv'+x[5]+')').join(' · ');
  if(s==='napi')return daily();
  if(s==='panel'){setTimeout(open,50);return'🏅 Rangpanel megnyitva'}
  if(s==='dev'){if(accOn())return'🛠️ Fiókkal a rangot a szerver kezeli (/rang dev csak vendégként)';const i=Math.max(0,Math.min(R.length-1,parseInt(p[2])||0));D.r=i;save();deco(true);return'🛠️ Rang beállítva: ['+R[i][0]+']'}
  if(s==='nulla'){if(accOn())return'🛠️ Fiókkal nem nullázható helyben';D.r=0;D.day='';save();deco(true);return'🛠️ Rang visszaállítva Tagra'}
  return'Ismeretlen: /rang lista|napi|panel|dev N'}
 return oc?oc.apply(this,arguments):null}}
setInterval(()=>{btn();chatObs();if(!inMatch()||P.classList.contains("on"))deco(false)},1500);
setTimeout(()=>{btn();autoLv();sync()},1200);
setInterval(autoLv,15000);
// ---- 3D: rang-előtag a névtáblán (meccs) – saját + botok (véletlen rang) ----
function plate(txt,col,ri){const c=document.createElement('canvas');c.width=512;c.height=72;const x=c.getContext('2d');x.font='bold 40px sans-serif';const w=Math.min(500,x.measureText(txt).width+40);
 if(ri===6){const g=x.createLinearGradient(256-w/2,0,256+w/2,0);['#ef4444','#eab308','#22c55e','#3b82f6','#d946ef'].forEach((q,k)=>g.addColorStop(k/4,q));x.fillStyle=g}else x.fillStyle=col;
 x.beginPath();x.roundRect?x.roundRect(256-w/2,6,w,60,16):x.rect(256-w/2,6,w,60);x.fill();x.fillStyle='#fff';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#000';x.shadowBlur=6;x.fillText(txt,256,38);
 const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));sp.scale.set(3.6,.5,1);sp.renderOrder=999;sp.userData.rk=1;return sp}
const BOTW=[50,22,12,8,5,2,1];const botR=()=>{let q=Math.random()*100;for(let i=0;i<BOTW.length;i++){q-=BOTW[i];if(q<0)return i}return 0};
function plates(){try{if(typeof G==='undefined'||!G||!inMatch()||typeof THREE==='undefined')return;
 if(G.pm&&!G.pm._rkP&&D.glow){G.pm._rkP=1;if(D.r>0){const x=R[D.r],s=plate(x[1]+' ['+x[0]+'] '+(myName()||'Te'),x[2],D.r);s.position.y=5.9;G.pm.add(s)}}
 (G.en||[]).forEach(e=>{if(!e||!e.m||e._rkP||e.dead)return;if(!e._x14&&!e.name)return;e._rkP=1;const ri=botR();if(!ri)return;const x=R[ri],s=plate(x[1]+' '+x[0],x[2],ri);s.scale.set(2.6,.36,1);s.position.y=5.55;e.m.add(s)})}catch(e){}}
setInterval(plates,1000);
// ---- 3D aura a lobby-karakter körül (additív gyűrű + részecskék, valódi fény nélkül) ----
const AU={g:null,r:-1,pts:null,ring:null,ring2:null,sd:null};
function auraBuild(L){if(AU.g){if(AU.g.parent)AU.g.parent.remove(AU.g);AU.g.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose()})}AU.g=null;AU.r=D.glow?D.r:0;if(AU.r<1)return;
 const col=new THREE.Color(R[D.r][2]),g=new THREE.Group(),add=THREE.AdditiveBlending;
 const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1.25,48),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.55,blending:add,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);AU.ring=ring;
 if(D.r>=3){const r2=new THREE.Mesh(new THREE.RingGeometry(1.35,1.45,48),ring.material.clone());r2.rotation.x=-Math.PI/2;r2.position.y=.05;g.add(r2);AU.ring2=r2}else AU.ring2=null;
 const n=10+D.r*10,pos=new Float32Array(n*3),sd=new Float32Array(n);for(let i=0;i<n;i++){const a=Math.random()*6.283,rr=.6+Math.random()*.7;pos[i*3]=Math.cos(a)*rr;pos[i*3+1]=Math.random()*3;pos[i*3+2]=Math.sin(a)*rr;sd[i]=a}
 const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(pos,3));AU.sd=sd;
 const pts=new THREE.Points(bg,new THREE.PointsMaterial({color:col,size:.09+D.r*.015,transparent:true,opacity:.85,blending:add,depthWrite:false}));g.add(pts);AU.pts=pts;
 L.sc.add(g);AU.g=g}
let auT=0;function auraTick(){requestAnimationFrame(auraTick);try{const L=window.LB3D,lb=$i('lb');if(!L||!L.sc||typeof THREE==='undefined')return;
 const on=lb&&lb.classList.contains('on')&&L.me;if(AU.r!==(D.glow?D.r:0)||(AU.g&&AU.g.parent!==L.sc))auraBuild(L);if(!AU.g)return;AU.g.visible=!!on;if(!on)return;
 auT+=.016;AU.g.position.set(L.me.position.x,L.me.position.y-.25,L.me.position.z);AU.ring.material.opacity=.35+.2*Math.sin(auT*3);AU.ring.rotation.z=auT*.6;if(AU.ring2){AU.ring2.rotation.z=-auT;AU.ring2.material.opacity=.3+.25*Math.sin(auT*2+1)}
 const p=AU.pts.geometry.attributes.position,a=p.array,sp=.012+D.r*.003;for(let i=0;i<a.length/3;i++){a[i*3+1]+=sp;AU.sd[i]+=.01;if(a[i*3+1]>3)a[i*3+1]=0;const rr=Math.hypot(a[i*3],a[i*3+2]);a[i*3]=Math.cos(AU.sd[i])*rr;a[i*3+2]=Math.sin(AU.sd[i])*rr}p.needsUpdate=true}catch(e){}}
requestAnimationFrame(auraTick);
window._rang={R,AU,plates,loadTop,get D(){return D},open,buy,daily,deco};
})();
