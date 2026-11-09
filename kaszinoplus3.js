// kaszinoplus3.js – 🌐 KASZINÓ+ PIAC (az extra140d Kaszinó+ ablakának „🌐 PIAC+” füle). Szerver: server/mod_cplus.js (/api/cp/*).
// Minden a FIÓKHOZ kötve (SQLite cp_* táblák): telkek a kis térképen, portfólió (részvény + KözCoin szerveres árfolyammal),
// garázs (jarmu2 járművek), piaci + célzott ajánlatok, aukciók, tranzakciós napló, napi hírek, bérleti díj, VIP, ranglista.
// Pénz: a felhőmentés Ft/zseton egyenlege (művelet előtt feltöltjük), a változást a válasz/WS 'cp_eco' alapján helyben is alkalmazzuk.
// Vendég: nincs piac (csak a helyi Kaszinó+ játékok). Csak játékbeli pénz, kitalált nevek. Debug: _cp3
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s);
const fmt=n=>Math.round(+n||0).toLocaleString('hu-HU');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const acc=()=>window.ACC&&ACC.user&&!ACC.guest&&ACC.token?ACC:null;
const ST={s:null,tab:'map',sel:null,top:null,log:null,busy:false,el:null,hov:null,iv:0,err:''};
const KN={stock:'📈 Részvény',coin:'💠 KözCoin',veh:'🚗 Jármű',parcel:'🏠 Telek',zs:'🪙 Zseton',ft:'💵 Ft',skin:'🎁 Tárgy'};
const VEHN={golf:'⛳ Közkert golfkocsi',traktor:'🚜 Szövetkezeti traktor',henger:'🛞 Közbeszerzési úthenger',hover:'🛸 Lebegő Lapát'};

const css=document.createElement('style');css.textContent=`
#cp3{font-family:system-ui,sans-serif}
#cp3 small,#cp3 .cp3R b,#cp3 td,#cp3 i{font-family:system-ui,sans-serif!important;text-transform:none!important;letter-spacing:0!important}#cp3 small{font-size:12px!important;font-weight:500}
#cp3 .cp3T{display:flex;flex-wrap:wrap;gap:5px;margin:0 0 10px}
#cp3 .cp3T button{background:#ffffff0c;border:1px solid #c9a64a55;color:#f3ecd6;border-radius:16px;padding:5px 11px;cursor:pointer;font:700 13px Rajdhani,system-ui,sans-serif}
#cp3 .cp3T button.on{background:linear-gradient(#a78bfa,#6d28d9);border-color:#c4b5fd;color:#fff;box-shadow:0 0 10px #a78bfa66}
#cp3 .cp3G{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px}
@media(max-width:760px){#cp3 .cp3G{grid-template-columns:1fr}}
#cp3 .cp3Box{background:linear-gradient(160deg,#ffffff0b,#ffffff04);border:1px solid #c9a64a44;border-radius:14px;padding:10px 12px;margin-bottom:10px}
#cp3 h4{margin:0 0 6px;color:#facc15;font:800 15px Rajdhani,system-ui,sans-serif;letter-spacing:.5px}
#cp3 canvas.map{width:100%;aspect-ratio:3/2;border-radius:12px;border:1px solid #c9a64a88;background:#0b1a12;cursor:pointer;display:block}
#cp3 .cp3Leg{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;opacity:.85;margin-top:6px}#cp3 .cp3Leg i{display:inline-block;width:11px;height:11px;border-radius:3px;vertical-align:-1px;margin-right:4px}
#cp3 .cp3R{display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #ffffff12;font-size:13px}
#cp3 .cp3R .f{flex:1;min-width:0}#cp3 .cp3R small{opacity:.65}
#cp3 input,#cp3 select{background:#0d0a1c;border:1px solid #c9a64a77;color:#f3ecd6;border-radius:8px;padding:5px 7px;font:13px system-ui;max-width:100%}
#cp3 .cp3F{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0}
#cp3 .up{color:#4ade80}#cp3 .dn{color:#f87171}
#cp3 .cp3News{overflow:hidden;white-space:nowrap;background:#000a;border:1px solid #c9a64a55;border-radius:10px;padding:5px 0;margin-bottom:10px;font-size:13px}
#cp3 .cp3News span{display:inline-block;padding-left:100%;animation:cp3tk 45s linear infinite}
@keyframes cp3tk{to{transform:translateX(-100%)}}
#cp3 .cp3Msg{padding:7px 10px;border-radius:10px;margin-bottom:8px;font-weight:700}
#cp3 .cp3Msg.e{background:#7f1d1d99;border:1px solid #ef4444}#cp3 .cp3Msg.o{background:#14532d99;border:1px solid #22c55e}
#cp3 .tag{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:700;background:#4c1d95;color:#ddd6fe;margin-left:4px}
#cp3 .tag.me{background:#713f12;color:#fde68a}#cp3 .tag.t{background:#1e3a8a;color:#bfdbfe}
#cp3 .cp3Big{font:800 22px Rajdhani,system-ui;color:#fde68a}
#cp3 table{width:100%;border-collapse:collapse;font-size:13px}#cp3 td,#cp3 th{padding:5px 6px;border-bottom:1px solid #ffffff10;text-align:left}#cp3 th{opacity:.6;font-size:11px;text-transform:uppercase}
#cp3Tip{position:fixed;z-index:95;pointer-events:none;background:#120c22f0;border:1px solid #facc15;border-radius:8px;padding:5px 9px;color:#fde68a;font:600 12px system-ui;display:none;max-width:240px}
#cp3Toast{position:fixed;left:50%;bottom:130px;transform:translateX(-50%);z-index:96;background:#1a1430;border:1px solid #a78bfa;border-radius:12px;padding:9px 16px;color:#ede9fe;font:600 14px system-ui;display:none;box-shadow:0 6px 24px #000a}
`;document.head.appendChild(css);
const tip=document.createElement('div');tip.id='cp3Tip';document.body.appendChild(tip);
function toast(t){let d=$('#cp3Toast');if(!d){d=document.createElement('div');d.id='cp3Toast';document.body.appendChild(d)}d.textContent=t;d.style.display='block';clearTimeout(d._t);d._t=setTimeout(()=>d.style.display='none',3500)}

// ---------- API ----------
async function api(p,b){const a=acc();if(!a)throw new Error('Csak bejelentkezve.');
 const r=await fetch(p,{method:b?'POST':'GET',headers:Object.assign({Authorization:'Bearer '+a.token},b?{'Content-Type':'application/json'}:{}),body:b?JSON.stringify(b):undefined});
 let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function flush(){const C=window._cloud;if(!C||!C.up)return;for(let i=0;i<20&&C.busy;i++)await wait(150);try{await C.up(true)}catch(e){}}
// helyi alkalmazás (a szerver már átírta a felhőmentést)
// sorszám-lista (k3cpSeq): melyik szerveres változást alkalmaztuk már helyben → egy tétel sosem duplázódik, és a szerver a hiányzót pótolja
function seqL(){try{const a=JSON.parse(localStorage.getItem('k3cpSeq')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function applyD(r,why){let ch=false;const seqs=(r.seqs||[]).concat(r.seq?[r.seq]:[]);if(seqs.length){const L=seqL();if(seqs.every(x=>L.includes(x)))return;seqs.forEach(x=>{if(!L.includes(x))L.push(x)});localStorage.setItem('k3cpSeq',JSON.stringify(L.slice(-300)))}
 try{if(r.ft||r.dft){const d=r.dft!=null?r.dft:r.ft;if(d&&typeof S!=='undefined'&&S){S.c=Math.max(0,(S.c||0)+d);try{save()}catch(e){localStorage.setItem('k3c',JSON.stringify(S.c))}ch=true}}}catch(e){}
 try{const dz=r.dzs!=null?r.dzs:r.zs;const add=r.add||[],rem=r.rem||[];if((dz||add.length||rem.length)&&typeof BR!=='undefined'&&BR){BR.zs=Math.max(0,(BR.zs|0)+(dz||0));BR.own=BR.own||{};add.forEach(k=>BR.own[k]=1);rem.forEach(k=>{delete BR.own[k];if(BR.eq)for(const s in BR.eq)if(BR.eq[s]===k)delete BR.eq[s]});localStorage.setItem('k3br',JSON.stringify(BR));ch=true}}catch(e){}
 try{const own=window._jm2&&_jm2.own();if(own){if(r.veh&&!own.includes(r.veh))own.push(r.veh);localStorage.setItem('k3x14hveh',JSON.stringify(own))}}catch(e){}
 if(ch){try{window._cloud&&setTimeout(()=>_cloud.up(true),300)}catch(e){}}}
async function act(b,confirmTxt){if(ST.busy)return null;if(confirmTxt&&!confirm(confirmTxt))return null;ST.busy=true;
 try{await flush();const r=await api('/api/cp/act',b);applyD(r);if(r.msg){toast(r.msg);ST.err='o:'+r.msg}await load();return r}
 catch(e){ST.err='e:'+e.message;toast('⛔ '+e.message);draw();return null}finally{ST.busy=false}}
async function load(){if(!acc())return;try{ST.s=await api('/api/cp/state');{const L=seqL();(ST.s.pend||[]).forEach(p=>{if(!L.includes(p.s)){applyD({seq:p.s,dft:p.ft,dzs:p.zs,add:p.add,rem:p.rem});toast('🌐 Kaszinó+ piac: '+(p.ft?(p.ft>0?'+':'')+fmt(p.ft)+' Ft ':'')+(p.zs?(p.zs>0?'+':'')+fmt(p.zs)+' zs':''))}})}syncVeh();await migr()}catch(e){ST.err='e:'+e.message}draw()}

// ---------- garázs-szinkron (jarmu2) ----------
function myVeh(){const o={};((ST.s&&ST.s.hold)||[]).forEach(h=>{if(h.kind==='veh'&&h.qty>=1)o[h.item]=h.qty});return o}
function syncVeh(){if(!ST.s||!(ST.s.migr&1))return;try{const own=window._jm2&&_jm2.own();if(!own)return;const v=Object.keys(myVeh());const same=own.length===v.length&&v.every(k=>own.includes(k));if(same)return;own.splice(0,own.length,...v);localStorage.setItem('k3x14hveh',JSON.stringify(own))}catch(e){}}
let migring=false;async function migr(){if(!ST.s||(ST.s.migr&1)||migring)return;migring=true;try{const own=(window._jm2&&_jm2.own())||[];const r=await api('/api/cp/act',{a:'migr',veh:own.slice()});if(r.msg)toast(r.msg);ST.s=await api('/api/cp/state');syncVeh()}catch(e){}migring=false}
// a jarmu2 garázs „Megveszem” gombja belépve a szerveren vásárol (fiókhoz kötve)
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#jm2G .buy');if(!b||!acc())return;e.preventDefault();e.stopImmediatePropagation();
 const k=b.dataset.k;b.disabled=true;act({a:'veh_buy',k}).then(r=>{try{if(r&&window._jm2)_jm2.garage()}catch(er){}b.disabled=false})},true);

// ---------- WS: a másik fél jóváírásai ----------
let hooked=null;setInterval(()=>{const ws=window.ACC&&ACC.ws;if(!ws||ws===hooked)return;hooked=ws;
 ws.addEventListener('message',ev=>{let m;try{if(typeof ev.data!=='string'||ev.data.indexOf('"cp_')<0)return;m=JSON.parse(ev.data)}catch(e){return}
  if(m.t==='cp_eco'){applyD(m);toast((m.why||'Kaszinó+ piac')+(m.ft?' · '+(m.ft>0?'+':'')+fmt(m.ft)+' Ft':'')+(m.zs?' · '+(m.zs>0?'+':'')+fmt(m.zs)+' zs':''));if(isOn())load()}
  if(m.t==='cp_upd'&&isOn())load();
  if(m.t==='cp_note')toast(m.text)})},1500);
// belépés után egyszer: migráció + jármű-szinkron (akkor is, ha a panelt nem nyitják meg)
let who='';setInterval(()=>{const a=acc(),n=a?a.user.name:'';if(n!==who){who=n;ST.s=null;if(n)setTimeout(load,2500)}},2000);

// ---------- nézetek ----------
const isOn=()=>!!(ST.el&&document.body.contains(ST.el)&&$('#x14dM.on'));
const TABS=[['map','🗺️ Térkép'],['port','📈 Portfólió'],['mkt','🏷️ Piac'],['auc','🔨 Aukciók'],['gar','🏁 Járműpiac'],['top','🏆 Ranglista'],['log','📜 Napló'],['vip','👑 VIP']];
function render(c){ST.el=c;clearInterval(ST.iv);
 if(!acc()){c.innerHTML='<div id="cp3"><div class="cp3Box" style="text-align:center;padding:26px"><div style="font-size:40px">🔒</div><h4>A PIAC+ csak bejelentkezve érhető el</h4><div style="opacity:.8">Vendégként a Kaszinó+ játékai helyben működnek, de a kereskedés, aukció, telektérkép és ranglista a fiókodhoz kötött – lépj be vagy regisztrálj!</div></div></div>';return}
 c.innerHTML='<div id="cp3"></div>';['keydown','keyup','keypress'].forEach(ev=>c.addEventListener(ev,e=>{if(e.key!=='Escape'&&/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))e.stopPropagation()}));
 draw();load();ST.iv=setInterval(()=>{if(!isOn()){clearInterval(ST.iv);return}if(!ST.busy&&!document.activeElement.closest?.('#cp3 .cp3F'))load()},12000)}
function draw(){const c=ST.el&&$('#cp3',ST.el);if(!c)return;const s=ST.s;
 let h='<div class="cp3T">'+TABS.map(([k,n])=>'<button data-t="'+k+'" class="'+(k===ST.tab?'on':'')+'">'+n+'</button>').join('')+'<button data-r="1" title="Frissítés">🔄</button></div>';
 if(ST.err){const o=ST.err[0]==='o';h+='<div class="cp3Msg '+(o?'o':'e')+'">'+(o?'':'⛔ ')+esc(ST.err.slice(2))+'</div>';ST.err=''}
 if(!s){c.innerHTML=h+'<i style="opacity:.7">Betöltés a szerverről…</i>';bindT(c);return}
 h+='<div class="cp3News"><span>'+s.news.items.map(n=>n.ic+' '+esc(n.text)).join(' &nbsp; • &nbsp; ')+'</span></div>';
 h+=({map:vMap,port:vPort,mkt:vMkt,auc:vAuc,gar:vGar,top:vTop,log:vLog,vip:vVip})[ST.tab](s);
 c.innerHTML=h;bindT(c);if(ST.tab==='map')mapInit(c);if(ST.tab==='port')spark(c);bindForms(c)}
function bindT(c){c.querySelectorAll('.cp3T button').forEach(b=>b.onclick=()=>{if(b.dataset.r){load();return}ST.tab=b.dataset.t;draw();if(ST.tab==='top')loadTop();if(ST.tab==='log')loadLog()})}
async function loadTop(){try{ST.top=await api('/api/cp/top')}catch(e){ST.err='e:'+e.message}draw()}
async function loadLog(){try{ST.log=(await api('/api/cp/log')).log}catch(e){ST.err='e:'+e.message}draw()}
const hq=(k,i)=>{const h=((ST.s&&ST.s.hold)||[]).find(x=>x.kind===k&&x.item===i);return h?h.qty:0};
const mk=k=>(ST.s.markets||[]).find(m=>m.k===k);
const itemName=(kind,item)=>kind==='veh'?(VEHN[item]||item):kind==='parcel'?((ST.s.parcels.find(p=>p.id===item)||{}).name||item)+' ('+((ST.s.dist[(ST.s.parcels.find(p=>p.id===item)||{}).d]||{}).n||'')+')':kind==='stock'||kind==='coin'?((mk(item)||{}).name||item):kind==='zs'?'Zseton':kind==='ft'?'Forint':item;
const qtyTxt=(kind,q)=>kind==='parcel'||kind==='veh'||kind==='skin'?'':(kind==='coin'?(+q).toFixed(3):fmt(q))+' × ';
const curT=c=>c==='zs'?'zs':'Ft';

// ---- 1) TÉRKÉP ----
function ownCol(o){if(!o)return'#2f5d3f';if(o===ST.s.me)return'#facc15';let h=0;for(const ch of o)h=(h*31+ch.charCodeAt(0))|0;return'hsl('+(Math.abs(h)%360)+',55%,52%)'}
function lots(){const s=ST.s,L=[];s.dist.forEach((d,di)=>{const ps=s.parcels.filter(p=>p.d===di),lw=(d.w-16)/3,lh=(d.h-30)/2;ps.forEach((p,i)=>L.push({p,x:d.x+8+(i%3)*lw,y:d.y+24+Math.floor(i/3)*lh,w:lw-5,h:lh-5}))});return L}
function vMap(s){const mine=s.parcels.filter(p=>p.owner===s.me);const sel=s.parcels.find(p=>p.id===ST.sel);
 let side='<div class="cp3Box"><h4>🏠 Telkeid</h4><div>Telek: <b>'+mine.length+'</b> · bérleti díj: <b>'+fmt(s.rentDay)+' Ft/nap</b></div><div>Beszedhető most: <span class="cp3Big">'+fmt(s.rentDue)+' Ft</span></div><div class="cp3F"><button class="x14dB y" data-a="rent" '+(s.rentDue>0?'':'disabled')+'>💰 BÉRLETI DÍJ BESZEDÉSE</button></div><small style="opacity:.6">Max. 48 óra halmozódik. A napi hír egy kerületben ±% bérleti díjat ad.</small></div>';
 if(sel){const d=s.dist[sel.d],me=sel.owner===s.me;side+='<div class="cp3Box"><h4>'+esc(sel.name)+' <small style="color:#c4b5fd">· '+esc(d.n)+'</small></h4>'+
  '<div>Érték: <b>'+fmt(sel.val)+' Ft</b> · szint: <b>'+s.plv[sel.lv]+'</b></div><div>Bérleti díj: <b>'+fmt(sel.rentDay)+' Ft/nap</b></div>'+
  '<div>Tulajdonos: <b style="color:'+ownCol(sel.owner)+'">'+(sel.owner?esc(sel.owner)+(me?' (te)':''):'szabad – a városé')+'</b>'+(sel.lock?' <span class="tag">🏷️ piacon</span>':'')+'</div>'+
  (me&&sel.due?'<div>Beszedhető: '+fmt(sel.due)+' Ft</div>':'')+'<div class="cp3F">'+
  (!sel.owner?'<button class="x14dB y" data-a="parcel_buy" data-id="'+sel.id+'">🏠 MEGVESZEM – '+fmt(sel.val)+' Ft</button>':'')+
  (me&&!sel.lock?(sel.lv<3?'<button class="x14dB" data-a="parcel_up" data-id="'+sel.id+'">🔨 FEJLESZT ('+fmt(sel.up)+')</button>':'')+'<button class="x14dB" data-a="parcel_sell" data-id="'+sel.id+'" data-c="Eladod a városnak 75%-on ('+fmt(sel.val*0.75)+' Ft)?">🏚️ VÁROSNAK (75%)</button><button class="x14dB" data-go="sellp" data-id="'+sel.id+'">🏷️ PIACRA / AUKCIÓRA</button>':'')+
  (sel.owner&&!me?'<button class="x14dB" data-go="ask" data-u="'+esc(sel.owner)+'">🤝 Ajánlatot küldök neki</button>':'')+'</div></div>'}
 else side+='<div class="cp3Box" style="opacity:.8">👆 Kattints egy telekre a térképen az adatlapjáért.</div>';
 return '<div class="cp3G"><div><canvas class="map" width="1200" height="800"></canvas><div class="cp3Leg"><span><i style="background:#facc15"></i>Saját</span><span><i style="background:#2f5d3f"></i>Szabad</span><span><i style="background:hsl(200,55%,52%)"></i>Más játékosé (színe a névből)</span><span>🏷️ = piacon</span></div></div><div>'+side+'</div></div>'}
function mapInit(c){const cv=$('canvas.map',c);if(!cv)return;const x=cv.getContext('2d');const L=lots();
 const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*600,(e.clientY-r.top)/r.height*400]};
 const hit=e=>{const[a,b]=pos(e);return L.find(l=>a>=l.x&&a<=l.x+l.w&&b>=l.y&&b<=l.y+l.h)};
 function paint(){x.setTransform(2,0,0,2,0,0);x.clearRect(0,0,600,400);
  const g=x.createLinearGradient(0,0,600,400);g.addColorStop(0,'#0c2418');g.addColorStop(1,'#081510');x.fillStyle=g;x.fillRect(0,0,600,400);
  x.strokeStyle='#ffffff14';x.lineWidth=6;x.beginPath();x.moveTo(200,0);x.lineTo(200,270);x.moveTo(400,0);x.lineTo(400,270);x.moveTo(0,140);x.lineTo(600,140);x.moveTo(0,270);x.lineTo(600,270);x.moveTo(300,270);x.lineTo(300,400);x.stroke();
  x.strokeStyle='#3b82f655';x.lineWidth=10;x.beginPath();x.moveTo(0,395);x.bezierCurveTo(200,380,380,402,600,388);x.stroke();
  const nw=ST.s.news.rent||{};
  ST.s.dist.forEach((d,i)=>{x.fillStyle='#ffffff08';x.strokeStyle=nw[i]>0?'#4ade80':nw[i]<0?'#f87171':'#c9a64a66';x.lineWidth=nw[i]?2:1;x.beginPath();x.roundRect?x.roundRect(d.x,d.y,d.w,d.h,10):x.rect(d.x,d.y,d.w,d.h);x.fill();x.stroke();
   x.fillStyle='#fde68a';x.font='700 11px system-ui';x.fillText(d.n+(nw[i]?(nw[i]>0?'  ▲':'  ▼')+Math.round(nw[i]*100)+'%':''),d.x+7,d.y+15)});
  L.forEach(l=>{const p=l.p;x.fillStyle=ownCol(p.owner);x.globalAlpha=p.owner?.92:.75;x.fillRect(l.x,l.y,l.w,l.h);x.globalAlpha=1;
   for(let k=0;k<p.lv;k++){x.fillStyle='#fff';x.fillRect(l.x+4+k*7,l.y+4,5,5)}
   if(p.lock){x.fillStyle='#000a';x.fillRect(l.x+l.w-16,l.y+2,14,14);x.font='10px system-ui';x.fillText('🏷️',l.x+l.w-15,l.y+13)}
   if(p.id===ST.sel||l===ST.hov){x.strokeStyle=p.id===ST.sel?'#fff':'#ffffffaa';x.lineWidth=p.id===ST.sel?3:1.5;x.strokeRect(l.x-1,l.y-1,l.w+2,l.h+2)}
   x.fillStyle=p.owner===ST.s.me?'#3b2600':'#ffffffcc';x.font='600 8.5px system-ui';x.fillText(p.name.length>12?p.name.slice(0,11)+'…':p.name,l.x+3,l.y+l.h-5)})}
 paint();
 cv.onmousemove=e=>{const l=hit(e);if(l!==ST.hov){ST.hov=l;paint()}if(l){const p=l.p;tip.innerHTML='<b>'+esc(p.name)+'</b><br>'+fmt(p.val)+' Ft · '+fmt(p.rentDay)+' Ft/nap<br>'+(p.owner?'👤 '+esc(p.owner):'🟢 szabad');tip.style.display='block';tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+10)+'px'}else tip.style.display='none'};
 cv.onmouseleave=()=>{ST.hov=null;tip.style.display='none';paint()};
 cv.onclick=e=>{const l=hit(e);tip.style.display='none';if(l){ST.sel=l.p.id;draw()}}}

// ---- 2) PORTFÓLIÓ ----
function vPort(s){let tot=0;const loc=(window._x14d&&_x14d.D)||null;
 const rows=s.markets.map(m=>{const kind=m.k==='KC'?'coin':'stock',q=hq(kind,m.k),h=m.hist,ch=h.length>1?(m.price/h[0]-1)*100:0;tot+=q*m.price;
  const lq=loc?(m.k==='KC'?Math.floor((loc.coin||0)*1000)/1000:(loc.stocks&&loc.stocks[m.k])||0):0;
  return '<div class="cp3R"><div class="f"><b>'+(m.k==='KC'?'💠 ':'')+esc(m.name)+'</b> <small>'+m.k+'</small><br><small>Árfolyam: <b>'+fmt(m.price)+' Ft</b> <span class="'+(ch>=0?'up':'dn')+'">'+(ch>=0?'▲':'▼')+Math.abs(ch).toFixed(1)+'%</span> · nálad: <b>'+(kind==='coin'?q.toFixed(3):fmt(q))+'</b> ('+fmt(q*m.price)+' Ft)</small>'+(lq>0?'<br><small>Helyi (offline) tőzsdén: '+lq+' <button class="x14dB" style="padding:2px 7px" data-a="deposit" data-item="'+m.k+'" data-q="'+lq+'">📥 befizetés a fiókba</button></small>':'')+'</div>'+
   '<canvas class="sp" data-k="'+m.k+'" width="180" height="44" style="width:90px;height:22px"></canvas>'+
   '<input type="number" min="'+(kind==='coin'?'0.001':'1')+'" step="'+(kind==='coin'?'0.001':'1')+'" value="1" style="width:70px" id="cp3q_'+m.k+'"><button class="x14dB y" data-a="trade" data-act="buy" data-item="'+m.k+'">VESZ</button><button class="x14dB" data-a="trade" data-act="sell" data-item="'+m.k+'" '+(q>0?'':'disabled')+'>ELAD</button></div>'}).join('');
 return '<div class="cp3Box"><h4>📈 Szerveres tőzsde – portfólió (a fiókodhoz kötve)</h4><div>Portfólió értéke: <span class="cp3Big">'+fmt(tot)+' Ft</span> <small style="opacity:.6">· árfolyam percenként frissül, a napi hírek mozgatják · 0,5% tranzakciós díj</small></div></div><div class="cp3Box">'+rows+'</div>'}
function spark(c){c.querySelectorAll('canvas.sp').forEach(cv=>{const m=mk(cv.dataset.k);if(!m)return;const h=m.hist,x=cv.getContext('2d'),mn=Math.min(...h),mx=Math.max(...h);x.strokeStyle=h[h.length-1]>=h[0]?'#4ade80':'#f87171';x.lineWidth=2;x.beginPath();h.forEach((v,i)=>{const X=i/(Math.max(1,h.length-1))*178+1,Y=42-((v-mn)/((mx-mn)||1))*40;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke()})}

// ---- 3) PIAC ----
function sellForm(pre){const s=ST.s;pre=pre||{};
 const opts=[];s.hold.forEach(h=>{if(h.qty>0)opts.push([h.kind,h.item,(h.kind==='veh'?VEHN[h.item]:KN[h.kind]+' '+h.item)+' ('+(h.kind==='coin'?h.qty.toFixed(3):h.qty)+')'])});
 s.parcels.filter(p=>p.owner===s.me&&!p.lock).forEach(p=>opts.push(['parcel',p.id,'🏠 '+p.name+' ('+s.dist[p.d].n+')']));
 opts.push(['zs','','🪙 Zseton']);opts.push(['ft','','💵 Ft (zsetonért)']);
 try{Object.keys((BR&&BR.own)||{}).filter(k=>BR.own[k]).slice(0,40).forEach(k=>opts.push(['skin',k,'🎁 '+k]))}catch(e){}
 return '<div class="cp3Box cp3F" id="cp3Sell"><h4 style="width:100%">🏷️ Eladás / csere – az áru letétbe kerül, amíg el nem kel vagy vissza nem vonod</h4>'+
  '<select id="cp3It">'+opts.map(o=>'<option value="'+o[0]+'|'+esc(o[1])+'"'+(pre.kind===o[0]&&pre.item===o[1]?' selected':'')+'>'+esc(o[2])+'</option>').join('')+'</select>'+
  'Menny.: <input id="cp3Q" type="number" min="0.001" step="any" value="1" style="width:80px"> Ár: <input id="cp3P" type="number" min="1" value="'+(pre.price||1000)+'" style="width:110px">'+
  '<select id="cp3C"><option value="ft">Ft</option><option value="zs">zseton</option></select> Címzett (opcionális): <input id="cp3To" placeholder="játékosnév" value="'+esc(pre.to||'')+'" style="width:120px">'+
  '<button class="x14dB y" data-f="offer">🏷️ PIACRA</button> <span style="opacity:.6">vagy aukció:</span><select id="cp3Min"><option value="2">2 perc</option><option value="10">10 perc</option><option value="60" selected>1 óra</option><option value="1440">24 óra</option></select><button class="x14dB" data-f="auct">🔨 AUKCIÓ</button>'+
  '<small style="width:100%;opacity:.6">Piaci díj (eladótól): '+Math.round(s.vip.fee*100)+'% ('+s.vip.n+' VIP) · max '+s.vip.maxOff+' nyitott ajánlat. Telekből, járműből, tárgyból 1 db.</small></div>'}
function offRow(o,me){const mine=o.seller===me;return '<div class="cp3R"><div class="f"><b>'+qtyTxt(o.kind,o.qty)+esc(itemName(o.kind,o.item))+'</b> <small>'+KN[o.kind]+'</small>'+(o.target?'<span class="tag t">🤝 '+(o.target===me?'neked':'→ '+esc(o.target))+'</span>':'')+(mine?'<span class="tag me">saját</span>':'')+'<br><small>Eladó: '+esc(o.seller)+' · #'+o.id+' · '+new Date(o.t).toLocaleString('hu-HU')+'</small></div><b class="cp3Big" style="font-size:17px">'+fmt(o.price)+' '+curT(o.cur)+'</b>'+
 (mine?'<button class="x14dB" data-a="offer_cancel" data-id="'+o.id+'">↩️ VISSZAVON</button>':'<button class="x14dB y" data-a="offer_buy" data-id="'+o.id+'" data-c="Megveszed: '+esc(qtyTxt(o.kind,o.qty)+itemName(o.kind,o.item))+' – '+fmt(o.price)+' '+curT(o.cur)+'?">💳 MEGVESZEM</button>')+'</div>'}
let fK='all';
function vMkt(s){const L=s.offers.filter(o=>fK==='all'||o.kind===fK||(fK==='me'&&(o.seller===s.me||o.target===s.me)));
 return sellForm(ST.pre)+'<div class="cp3Box"><div class="cp3F"><h4 style="margin:0">🛒 Nyitott ajánlatok ('+s.offers.length+')</h4><select id="cp3Flt">'+[['all','Mind'],['me','Saját / nekem szóló']].concat(Object.entries(KN)).map(([k,n])=>'<option value="'+k+'"'+(k===fK?' selected':'')+'>'+n+'</option>').join('')+'</select></div>'+(L.map(o=>offRow(o,s.me)).join('')||'<i style="opacity:.6">Nincs ilyen ajánlat. Tegyél fel egyet!</i>')+'</div>'}

// ---- 4) AUKCIÓK ----
function left(ms){ms=Math.max(0,ms);const m=Math.floor(ms/60000),sec=Math.floor(ms/1000)%60;return m>=60?Math.floor(m/60)+' ó '+(m%60)+' p':m+':'+String(sec).padStart(2,'0')}
function vAuc(s){const now=s.now;
 const rows=s.auctions.map(a=>{const mine=a.seller===s.me,minB=a.top?a.top+Math.max(1,Math.ceil(a.top*.05)):a.start;return '<div class="cp3R"><div class="f"><b>'+qtyTxt(a.kind,a.qty)+esc(itemName(a.kind,a.item))+'</b> <small>'+KN[a.kind]+'</small>'+(mine?'<span class="tag me">saját</span>':'')+(a.topUser===s.me?'<span class="tag t">🥇 te vezetsz</span>':'')+'<br><small>Eladó: '+esc(a.seller)+' · #'+a.id+' · licitek: '+a.bids+' · ⏳ <b data-end="'+(a.ends-now+Date.now())+'">'+left(a.ends-now)+'</b></small></div>'+
  '<div style="text-align:right"><b class="cp3Big" style="font-size:17px">'+fmt(a.top||a.start)+' '+curT(a.cur)+'</b><br><small>'+(a.topUser?'vezet: '+esc(a.topUser):'kikiáltási ár')+'</small></div>'+
  (mine?(a.topUser?'':'<button class="x14dB" data-a="auct_cancel" data-id="'+a.id+'">↩️</button>'):'<input type="number" id="cp3B_'+a.id+'" value="'+minB+'" min="'+minB+'" style="width:100px"><button class="x14dB y" data-a="bid" data-id="'+a.id+'">🔨 LICIT</button>')+'</div>'}).join('');
 const rec=(s.aRecent||[]).map(a=>'<div class="cp3R"><div class="f"><small>#'+a.id+' '+esc(itemName(a.kind,a.item))+' – '+({sold:'✅ elkelt: '+fmt(a.top)+' '+curT(a.cur)+' ('+esc(a.topUser)+')',expired:'⌛ licit nélkül lejárt',cancel:'↩️ visszavonva',admin:'🛡️ admin törölte'}[a.status]||a.status)+'</small></div></div>').join('');
 return '<div class="cp3Box"><h4>🔨 Aukciósház</h4><small style="opacity:.65">A licit összege letétbe kerül; ha túllicitálnak, azonnal visszakapod. Az utolsó 30 mp-ben tett licit +30 mp-cel hosszabbít. Minimális emelés: 5%.</small></div><div class="cp3Box">'+(rows||'<i style="opacity:.6">Most nincs futó aukció. Indíts egyet a Piac fülön!</i>')+'</div>'+(rec?'<div class="cp3Box"><h4>Legutóbbi lezárt aukciók</h4>'+rec+'</div>':'')}
setInterval(()=>{if(!isOn())return;document.querySelectorAll('#cp3 [data-end]').forEach(b=>{const v=left(+b.dataset.end-Date.now());if(b.textContent!==v)b.textContent=v})},1000);

// ---- 5) JÁRMŰPIAC (garázs) ----
function vGar(s){const mv=myVeh();
 const cat=Object.entries(s.veh).map(([k,v])=>'<div class="cp3R"><div class="f"><b>'+esc(v[0])+'</b><br><small>Új ár: '+fmt(v[1])+' Ft · garázsodban: <b>'+(mv[k]||0)+'</b></small></div><button class="x14dB y" data-a="veh_buy" data-k="'+k+'" data-c="Megveszed újonnan: '+esc(v[0])+' – '+fmt(v[1])+' Ft?">🆕 ÚJ</button>'+(mv[k]?'<button class="x14dB" data-go="sellv" data-k="'+k+'">🏷️ ELADOM</button>':'')+'</div>').join('');
 const used=s.offers.filter(o=>o.kind==='veh').map(o=>offRow(o,s.me)).join('');
 return '<div class="cp3Box"><h4>🏁 Garázs – a fiókodhoz kötve</h4><small style="opacity:.65">Meccsben a <b>/garazs</b> paranccsal hívod elő. A lobby 🏁 GARÁZS gombja belépve már ide vásárol.</small>'+cat+'</div><div class="cp3Box"><h4>🚗 Használt járművek más játékosoktól</h4>'+(used||'<i style="opacity:.6">Most nincs eladó használt jármű.</i>')+'</div>'}

// ---- 6) RANGLISTA ----
function vTop(){const t=ST.top;if(!t)return'<i>Betöltés…</i>';
 const tb=(L,cols)=>'<table><tr><th>#</th>'+cols.map(c=>'<th>'+c[0]+'</th>').join('')+'</tr>'+L.map((r,i)=>'<tr'+(r.name===ST.s.me?' style="background:#facc1522"':'')+'><td>'+['🥇','🥈','🥉'][i]||(i+1)+'</td>'+cols.map(c=>'<td>'+c[1](r)+'</td>').join('')+'</tr>').join('')+'</table>';
 return '<div class="cp3G"><div class="cp3Box"><h4>💰 Leggazdagabbak (Ft + vagyon)</h4>'+tb(t.rich,[['Név',r=>esc(r.name)],['Össz.',r=>fmt(r.total)],['Vagyon',r=>fmt(r.assets)],['VIP',r=>r.vip]])+'</div><div class="cp3Box"><h4>🏠 Legtöbb telek</h4>'+tb(t.land,[['Név',r=>esc(r.name)],['Telek',r=>r.parcels]])+'</div></div><small style="opacity:.6">Percenként frissül.</small>'}

// ---- 7) NAPLÓ ----
const ACT={parcel_buy:'🏠 Telekvétel',parcel_up:'🔨 Fejlesztés',parcel_sell:'🏚️ Eladás a városnak',rent:'💰 Bérleti díj',vip_bonus:'👑 VIP-bónusz',buy:'📈 Tőzsdei vétel',sell:'📉 Tőzsdei eladás',veh_buy:'🏁 Új jármű',migr:'🏁 Garázs átvétel',deposit:'📥 Befizetés',offer:'🏷️ Ajánlat feltéve',offer_cancel:'↩️ Ajánlat visszavonva',buy_offer:'💳 Vásárlás a piacon',sold_offer:'✅ Eladva a piacon',auct:'🔨 Aukció indítva',auct_cancel:'↩️ Aukció visszavonva',bid:'🔨 Licit (letét)',bid_refund:'↩️ Licit visszatérítés',auct_sold:'✅ Aukción eladva',auct_won:'🥇 Aukció megnyerve',auct_exp:'⌛ Aukció lejárt',admin_cancel:'🛡️ Admin törölte'};
function vLog(){const L=ST.log;if(!L)return'<i>Betöltés…</i>';
 return '<div class="cp3Box"><h4>📜 Tranzakciós napló (utolsó 100)</h4><table><tr><th>Idő</th><th>Művelet</th><th>Tétel</th><th>Partner</th><th>Összeg</th></tr>'+L.map(r=>'<tr><td><small>'+new Date(r.t).toLocaleString('hu-HU')+'</small></td><td>'+(ACT[r.act]||esc(r.act))+'</td><td><small>'+(r.kind?esc(qtyTxt(r.kind,r.qty)+itemName(r.kind,r.item)):'')+' '+esc(r.info)+'</small></td><td>'+esc(r.other)+'</td><td class="'+(r.amt>0?'up':r.amt<0?'dn':'')+'">'+(r.amt?(r.amt>0?'+':'')+fmt(r.amt)+' '+curT(r.cur):'')+'</td></tr>').join('')+'</table>'+(L.length?'':'<i style="opacity:.6">Még nincs tranzakciód.</i>')+'</div>'}

// ---- 8) VIP ----
function vVip(s){const v=s.vip,nx=v.next;const pct=nx?Math.min(100,v.turn/nx*100):100;
 return '<div class="cp3Box"><h4>👑 Piac-VIP: <span style="color:#fde68a">'+v.n+'</span></h4><div>Forgalmad: <b>'+fmt(v.turn)+' Ft</b>'+(nx?' · következő szint: '+fmt(nx)+' Ft':' · MAX szint')+'</div><div style="height:10px;background:#ffffff14;border-radius:6px;margin:6px 0"><div style="height:100%;width:'+pct+'%;background:linear-gradient(90deg,#a78bfa,#facc15);border-radius:6px"></div></div>'+
  '<div class="cp3F"><button class="x14dB y" data-a="bonus" '+(s.bonusReady?'':'disabled')+'>🎁 NAPI VIP-BÓNUSZ'+(v.bonus?' (+'+fmt(v.bonus)+' Ft)':'')+'</button>'+(!s.bonusReady&&v.bonus?'<small>Ma már felvetted.</small>':'')+'</div></div>'+
  '<div class="cp3Box"><table><tr><th>Szint</th><th>Forgalom</th><th>Piaci díj</th><th>Max ajánlat</th><th>Napi bónusz</th><th>Bérleti díj</th></tr>'+s.vipTable.map((r,i)=>'<tr'+(i===v.i?' style="background:#facc1522"':'')+'><td>'+r[0]+'</td><td>'+fmt(r[1])+'</td><td>'+Math.round(r[2]*100)+'%</td><td>'+r[3]+'</td><td>'+(r[4]?fmt(r[4]):'–')+'</td><td>+'+Math.round(r[5]*100)+'%</td></tr>').join('')+'</table><small style="opacity:.6">Forgalom = minden vétel/eladás (telek, tőzsde, jármű, piac, aukció). A zseton 50 Ft-tal számít.</small></div>'}

// ---------- gombok ----------
function bindForms(c){
 c.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const d=b.dataset,a=d.a,o={a};
  if(d.id)o.id=d.id;if(d.k)o.k=d.k;
  if(a==='trade'){o.act=d.act;o.item=d.item;o.qty=+($('#cp3q_'+d.item,c)||{}).value||0}
  if(a==='deposit'){const q=prompt('Mennyit fizetsz be a fiókodba? (a helyi tőzsdéről levonódik)',d.q);if(q==null)return;o.item=d.item;o.qty=+q;
   act(o).then(r=>{if(!r)return;try{const D=_x14d.D;if(d.item==='KC')D.coin=Math.max(0,(D.coin||0)-o.qty);else D.stocks[d.item]=Math.max(0,(D.stocks[d.item]||0)-o.qty);localStorage.setItem('k3x14d',JSON.stringify(D))}catch(e){}draw()});return}
  if(a==='bid'){o.amt=+($('#cp3B_'+d.id,c)||{}).value||0}
  act(o,d.c||null)});
 c.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{const d=b.dataset;if(d.go==='sellp')ST.pre={kind:'parcel',item:d.id,price:(ST.s.parcels.find(p=>p.id===d.id)||{}).val};if(d.go==='sellv')ST.pre={kind:'veh',item:d.k,price:Math.round((ST.s.veh[d.k]||[0,0])[1]*.8)};if(d.go==='ask')ST.pre={to:d.u};ST.tab='mkt';draw()});
 const f=$('#cp3Flt',c);if(f)f.onchange=()=>{fK=f.value;draw()};
 c.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const[kind,item]=$('#cp3It',c).value.split('|');const o={kind,item,qty:+$('#cp3Q',c).value,cur:$('#cp3C',c).value};
  if(b.dataset.f==='offer'){o.a='offer';o.price=+$('#cp3P',c).value;o.target=$('#cp3To',c).value.trim()||undefined}else{o.a='auct';o.start=+$('#cp3P',c).value;o.min=+$('#cp3Min',c).value}
  act(o,(o.a==='offer'?'Piacra teszed':'Aukcióra bocsátod')+': '+qtyTxt(kind,o.qty)+itemName(kind,item)+' – '+fmt(o.price||o.start)+' '+curT(o.cur)+(o.target?' (csak '+o.target+' veheti meg)':'')+'?\nAz áru letétbe kerül.').then(r=>{if(r)ST.pre=null})});
}
window._cp3={render,load,get s(){return ST.s},act,applyD,tab:t=>{ST.tab=t;draw()},ST};
})();
