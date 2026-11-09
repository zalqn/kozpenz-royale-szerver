// kozossegD.js – D Claude: 🏆 heti nyerőgép-bajnokság, 🎯 kaszinó-küldetések, 📊 gazdaság (luxusadó, figyelő),
// 🎁 ajándékbolt zsetonért, 🧘 felelős játék, ⚔️ klánháború, 📸 szerveres Közgram, 🎟️ promó-stat, 🗺️ pályamegosztás.
// Szerver: server/mod_D.js (/api/d/*). Mentés: k3D* kulcsok. Debug: _kD
(function(){
const $=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Math.round(+n||0).toLocaleString('hu-HU');
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:Object.assign(Array.isArray(d)?[]:{},d,v)}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const acc=()=>window.ACC&&ACC.user&&!ACC.guest&&ACC.token?ACC:null;
const zs=()=>{try{return BR.zs|0}catch(e){return 0}},ft=()=>{try{return S.c||0}catch(e){return 0}};
const saveAll=()=>{try{window.save&&window.save()}catch(e){}try{window.st&&window.BR&&st.s('k3br',BR)}catch(e){}};
const give=(z,f)=>{try{if(z)BR.zs+=z;if(f)S.c+=f}catch(e){}saveAll()};
const toast=t=>{let el=$('#kdT');if(!el){el=document.createElement('div');el.id='kdT';document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3200)};
async function api(p,b){const a=acc();const h={'Content-Type':'application/json'};if(a)h.Authorization='Bearer '+a.token;
 const r=await fetch('/api/d/'+p,b?{method:'POST',headers:h,body:JSON.stringify(b)}:{headers:h});let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw new Error(j.error||'Szerverhiba');return j}

// ---------- stílus (kaszino3: arany szegély, lila-fekete posztó) ----------
const css=document.createElement('style');css.textContent=`
#kdM{position:fixed;inset:0;background:#000a;z-index:100060;display:none;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,sans-serif}#kdM.on{display:flex}
#kdP{width:min(900px,95vw);max-height:90vh;overflow:auto;background:radial-gradient(ellipse at top,#2a1748,#0c0a18 70%);border:2px solid #c9a64a;border-radius:18px;box-shadow:0 0 40px #c9a64a55,inset 0 0 30px #0008;color:#f3ecd6;padding:16px 18px}
#kdP h2{margin:0 0 8px;color:#facc15;letter-spacing:1px;text-shadow:0 0 12px #facc1588;font-size:22px}
#kdP .tb{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}#kdP .tb button,.kdB{background:linear-gradient(#3b2a12,#1f150a);color:#facc15;border:1px solid #c9a64a;border-radius:9px;padding:6px 10px;cursor:pointer;font-weight:700;font-size:13px}
#kdP .tb button.on,.kdB.y{background:linear-gradient(#facc15,#b8860b);color:#1a1000}.kdB:disabled{opacity:.45;cursor:default}
#kdP .cd{background:#ffffff0d;border:1px solid #c9a64a55;border-radius:12px;padding:10px;margin:6px 0}#kdP table{width:100%;border-collapse:collapse;font-size:13px}#kdP td,#kdP th{padding:4px 6px;border-bottom:1px solid #ffffff14;text-align:left}#kdP th{color:#facc15}
#kdP .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}#kdP .bar{height:9px;background:#0006;border-radius:5px;overflow:hidden}#kdP .bar i{display:block;height:100%;background:linear-gradient(90deg,#facc15,#f97316)}
#kdP input,#kdP textarea,#kdP select{background:#0008;color:#fff;border:1px solid #c9a64a88;border-radius:8px;padding:6px}#kdP small{opacity:.7}#kdP .x{float:right;cursor:pointer;font-size:22px;color:#facc15}
#kdP .post img{max-width:100%;max-height:340px;border-radius:10px;display:block;margin:6px 0}
#kdBtn{position:fixed;left:12px;bottom:150px;z-index:9000;background:linear-gradient(#facc15,#b8860b);color:#1a1000;border:2px solid #fff6;border-radius:12px;padding:8px 12px;font-weight:800;cursor:pointer;box-shadow:0 0 14px #facc1566}
#kdT{position:fixed;left:50%;top:70px;transform:translateX(-50%);background:#1a1430;border:1px solid #c9a64a;color:#facc15;padding:9px 16px;border-radius:10px;z-index:100080;font-weight:700;display:none}#kdT.on{display:block}
#kdBrk{position:fixed;inset:0;background:#000c;z-index:100090;display:none;align-items:center;justify-content:center}#kdBrk.on{display:flex}#kdBrk>div{background:#10261a;border:2px solid #4ade80;border-radius:18px;padding:22px;color:#eafff0;max-width:420px;text-align:center;font-family:system-ui}
#kdCas{margin:8px 0;padding:8px;border:1px solid #c9a64a88;border-radius:12px;background:#0006;display:flex;flex-wrap:wrap;gap:6px;align-items:center;color:#f3ecd6;font-size:13px}`;
document.head.appendChild(css);
const M=document.createElement('div');M.id='kdM';M.innerHTML='<div id="kdP"></div>';document.body.appendChild(M);M.onclick=e=>{if(e.target===M)close()};
const P=$('#kdP');let tab='slot';
const TABS=[['slot','🏆 Bajnokság'],['quest','🎯 Küldetések'],['shop','🎁 Ajándékbolt'],['resp','🧘 Felelős játék'],['eco','📊 Gazdaság'],['war','⚔️ Klánháború'],['gram','📸 Közgram'],['promo','🎟️ Promó-stat'],['maps','🗺️ Pályák']];
function open(t){if(t)tab=t;M.classList.add('on');if(document.pointerLockElement)document.exitPointerLock();render()}
function close(){M.classList.remove('on')}
function render(){P.innerHTML='<span class="x" onclick="_kD.close()">✕</span><h2>🏆 VERSENYEK & KÖZÖSSÉG</h2><div class="tb">'+TABS.map(([k,n])=>'<button class="'+(k===tab?'on':'')+'" onclick="_kD.open(\''+k+'\')">'+n+'</button>').join('')+'</div><div id="kdC">Betöltés…</div>';
 const c=$('#kdC');const f=V[tab];Promise.resolve(f(c)).catch(e=>{c.innerHTML='<div class="cd">⚠️ '+esc(e.message)+(acc()?'':' – a szerveres funkciókhoz jelentkezz be.')+'</div>'})}
const needAcc=()=>{if(!acc())throw new Error('Ehhez be kell jelentkezned (vendégként nem érhető el).')};

// =================== 25 + 27: nyerőgép-figyelés, küldetések ===================
const QPOOL=[['spin','Pörgess 20-at a nyerőgépen',20,150,5000],['slotw','Nyerj 6 pörgetést a nyerőgépen',6,200,8000],['bj','Nyerj 3 blackjacket',3,300,12000],['mult','Érj el legalább ×5 szorzót a nyerőgépen',1,250,10000],
 ['zsw','Nyerj összesen 1000 zsetont a nyerőgépen',1000,250,10000],['pk','Játssz 4 videópóker-leosztást',4,150,6000],['time','Tölts 10 percet a kaszinóban',600,100,4000],['bjp','Játssz 6 blackjack-leosztást',6,150,6000]];
let Q=LS('k3Dq',{day:'',q:[]});
function qInit(){if(Q.day===today())return;let s=0;for(const ch of today())s=(s*31+ch.charCodeAt(0))>>>0;const ids=QPOOL.map((x,i)=>i);const pick=[];while(pick.length<3){s=(s*1103515245+12345)>>>0;const i=ids.splice(s%ids.length,1)[0];pick.push(QPOOL[i][0])}
 Q={day:today(),q:pick.map(id=>({id,p:0,cl:false}))};SV('k3Dq',Q)}
function qAdd(id,n){qInit();let ch=false;Q.q.forEach(x=>{const d=QPOOL.find(p=>p[0]===x.id);if(x.id===id&&x.p<d[2]){x.p=Math.min(d[2],x.p+n);ch=true;if(x.p>=d[2])toast('🎯 Küldetés teljesítve: '+d[1]+' – vedd át a jutalmat!')}});if(ch)SV('k3Dq',Q)}
const SLOTREP=LS('k3Dslot',{best:0,mult:0,wk:''});
let pend=null;
function slotDone(p){const win=Math.max(0,zs()-p.z0+(p.free?0:p.b));const mult=p.b?win/p.b:0;qAdd('spin',1);if(win>0){qAdd('slotw',1);qAdd('zsw',win)}if(mult>=5)qAdd('mult',1);
 if(win>SLOTREP.best){SLOTREP.best=win;SV('k3Dslot',SLOTREP)}if(mult>SLOTREP.mult){SLOTREP.mult=Math.round(mult*10)/10;SV('k3Dslot',SLOTREP)}
 if(acc()&&!p.free&&win>0)api('slot/rep',{bet:p.b,win}).catch(()=>{});}
function hookSlot(){const o=window.x10spin;if(!o||o._kD)return;const w=function(free){const K=window._x10k;if(pend){clearTimeout(pend.tm);slotDone(pend);pend=null}
  const z0=zs(),b=free?50:(K&&K.SLOT.bet)||0;const r=o.apply(this,arguments);if(zs()===z0&&!(K&&K.SLOT.spin))return r; // nem indult el (pl. veszteséghatár)
  const p={z0,b,free:!!free};pend=p;const chk=()=>{if(pend!==p)return;if(K&&K.SLOT.spin){p.tm=setTimeout(chk,400);return}if(p.last!==zs()){p.last=zs();p.tm=setTimeout(chk,1200);return}slotDone(p);pend=null};p.tm=setTimeout(chk,1500);return r};
 w._kD=1;window.x10spin=w}
function hookPoker(){const o=window.x10pgo;if(!o||o._kD)return;const w=function(){const K=window._x10k;const was=K&&K.PK.st;const r=o.apply(this,arguments);if(K&&was!=='hold'&&K.PK.st==='hold')qAdd('pk',1);return r};w._kD=1;window.x10pgo=w}
let bjLast='';
function bjWatch(){const c=$('#x14dC');if(!c||!$('#x14dM.on'))return;const t=c.textContent;let k='';if(/BLACKJACK!|Nyertél!/.test(t))k='w';else if(/Vesztettél|Döntetlen/.test(t))k='l';else if(/LAPOT/.test(t))k='p';
 if(k!==bjLast){if((k==='w'||k==='l')&&bjLast==='p'){qAdd('bjp',1);if(k==='w')qAdd('bj',1)}else if(k==='w'&&bjLast===''){} bjLast=k}}

// =================== 30: felelős játék ===================
let PL=LS('k3Dplay',{day:'',sec:0,ses:0,every:30,last:0,breaks:0});
const casOpen=()=>{const a=$('#x10M');return (a&&getComputedStyle(a).display!=='none'&&/x10|k3|Tét|TÉT|zseton/i.test(($('#x10MB')||{}).textContent||''))||!!$('#x14dM.on')||!!document.querySelector('[id^=k3roul].on,#k3rM.on')};
function playTick(){if(PL.day!==today()){PL.day=today();PL.sec=0;PL.ses=0;PL.breaks=0}
 if(document.hidden||!casOpen()){if(PL.ses&&Date.now()-PL.last>5*60e3)PL.ses=0;return}
 PL.sec++;PL.ses++;PL.last=Date.now();if(PL.sec%60===0){qAdd('time',60);SV('k3Dplay',PL)}
 if(PL.every>0&&PL.ses>0&&PL.ses%(PL.every*60)===0)brk()}
function lim(){return LS('k3x10lim',{day:'',lost:0,lim:3000})}
function brk(){let b=$('#kdBrk');if(!b){b=document.createElement('div');b.id='kdBrk';document.body.appendChild(b)}const L=lim();
 b.innerHTML='<div><div style="font-size:42px">🧘</div><h2 style="margin:6px 0;color:#4ade80">Ideje egy kis szünetnek?</h2><p>Már <b>'+Math.round(PL.ses/60)+' perce</b> játszol egyhuzamban a kaszinóban (ma összesen '+Math.round(PL.sec/60)+' perc).</p><p>Mai mérleg: <b>'+(L.day===today()?(L.lost>0?'−':'+')+fmt(Math.abs(L.lost)):'0')+'</b> zseton · veszteséghatár: '+fmt(L.lim)+'</p><p><small>Ez csak játékpénz – de a pihenés valódi. 🙂</small></p><button class="kdB y" id="kdBk1">☕ Szünetet tartok</button> <button class="kdB" id="kdBk2">Folytatom</button></div>';
 b.classList.add('on');b.querySelector('#kdBk1').onclick=()=>{b.classList.remove('on');PL.ses=0;PL.breaks++;SV('k3Dplay',PL);try{window.x10close&&x10close()}catch(e){}const d=$('#x14dM');d&&d.classList.remove('on');toast('☕ Jó pihenést!')};b.querySelector('#kdBk2').onclick=()=>b.classList.remove('on')}
function respSummary(){const L=lim(),lost=L.day===today()?L.lost:0;return '⏱️ Ma '+Math.round(PL.sec/60)+' perc · '+(lost>0?'📉 −':'📈 +')+fmt(Math.abs(lost))+' zs · határ '+fmt(L.lim)+' ('+Math.max(0,Math.round((L.lim-Math.max(0,lost))))+' maradt)'}

// =================== 28: gazdaság – figyelő + óvatos luxusadó ===================
let TX=LS('k3Dtax',{day:'',log:[]});
const TAXF=c=>{const a=Math.max(0,Math.min(c,1e9)-1e8)*0.002,b=Math.max(0,c-1e9)*0.005;return Math.floor(a+b)}; // 100M felett 0,2%/nap, 1 mrd felett 0,5%/nap
function taxTick(){if(TX.day===today())return;TX.day=today();const c=ft(),t=TAXF(c);if(t>0){try{S.c-=t}catch(e){}saveAll();TX.log.unshift({d:today(),c,t});TX.log=TX.log.slice(0,14);setTimeout(()=>toast('🏛️ Luxusadó: −'+fmt(t)+' Ft (100 M Ft feletti rész után)'),4000)}SV('k3Dtax',TX)}
let ecoT=0;function ecoRep(){if(!acc()||Date.now()-ecoT<5*60e3)return;ecoT=Date.now();api('eco',{ft:ft(),zs:zs()}).catch(()=>{})}

// =================== 29: ajándékbolt ===================
const TITLES=[['szerencse','🍀 Szerencsefi',400],['vip','💎 Kaszinó-törzsvendég',1500],['cet','🐋 Bálna',5000],['kir','👑 Zsetonkirály',12000]];
const LUX=[['szobor','🗿 Arany szobor (luxus)',25e6],['jacht','🛥️ Közpénz-jacht (luxus)',120e6],['palota','🏰 Kastély (luxus)',600e6]];
let SH=LS('k3Dshop',{own:{},title:''});
function buyZs(n,f){if(zs()<n)return toast('Nincs elég zsetonod.');BR.zs-=n;saveAll();f();SV('k3Dshop',SH);render()}

// =================== nézetek ===================
const V={};
V.slot=async c=>{const j=await api('slot/top');const t=(L,k,s)=>'<table><tr><th>#</th><th>Játékos</th><th>'+s+'</th><th>Pörg.</th></tr>'+(L.length?L.map((x,i)=>'<tr><td>'+(i+1)+'.</td><td>'+esc(x.n)+'</td><td><b>'+(k==='win'?fmt(x.win)+' zs':'×'+x.mult)+'</b></td><td>'+x.spins+'</td></tr>').join(''):'<tr><td colspan=4><small>Még nincs nevező ezen a héten.</small></td></tr>')+'</table>';
 const left=j.ends-Date.now();
 c.innerHTML='<div class="cd">🎰 <b>Heti nyerőgép-bajnokság</b> – minden nyerő pörgetésed automatikusan nevez (bejelentkezve). A hét végén a <b>legnagyobb nyeremény</b> szerinti sorrend kap jutalmat. Vége: <b>'+Math.floor(left/864e5)+' nap '+Math.floor(left%864e5/36e5)+' óra</b> múlva.<br><small>Jutalmak: '+j.rw.map((r,i)=>(i+1)+'. '+fmt(r[0])+' zs + '+fmt(r[1])+' Ft').join(' · ')+' · minden más nevező 50 zs</small></div>'+
 (j.prize&&!j.prize.cl?'<div class="cd" style="border-color:#4ade80">🎁 A '+esc(j.prize.wk)+' heti bajnokságon <b>'+j.prize.place+'.</b> lettél! <button class="kdB y" onclick="_kD.slotClaim()">Jutalom átvétele ('+fmt(j.prize.zs)+' zs + '+fmt(j.prize.ft)+' Ft)</button></div>':'')+
 '<div class="cd">Te ezen a héten: '+(j.me?'<b>'+fmt(j.me.win)+' zs</b> legjobb · ×'+j.me.mult+' · '+j.me.spins+' nyerő pörgetés':'<small>még nem neveztél</small>')+' · helyi rekord: '+fmt(SLOTREP.best)+' zs / ×'+SLOTREP.mult+'</div>'+
 '<div class="g" style="grid-template-columns:1fr 1fr"><div class="cd"><b>💰 Legnagyobb nyeremény</b>'+t(j.win,'win','Nyeremény')+'</div><div class="cd"><b>✖️ Legnagyobb szorzó</b>'+t(j.mult,'mult','Szorzó')+'</div></div>'+
 (j.last?'<div class="cd"><b>Múlt heti dobogó ('+esc(j.last.wk)+')</b>: '+j.last.top.slice(0,3).map((x,i)=>['🥇','🥈','🥉'][i]+' '+esc(x.n)+' ('+fmt(x.win)+')').join(' · ')+'</div>':'')+'<button class="kdB y" onclick="_kD.casino()">🎰 Irány a nyerőgép</button>'};
V.quest=c=>{qInit();c.innerHTML='<div class="cd">🎯 <b>Napi kaszinó-küldetések</b> – minden nap 3 új (éjfélkor cserélődnek).</div>'+Q.q.map((x,i)=>{const d=QPOOL.find(p=>p[0]===x.id),done=x.p>=d[2];const pv=d[0]==='time'?Math.floor(x.p/60)+'/'+(d[2]/60)+' perc':fmt(x.p)+'/'+fmt(d[2]);
 return '<div class="cd"><b>'+(done?'✅':'⬜')+' '+d[1]+'</b> <small>– jutalom: '+d[3]+' zs + '+fmt(d[4])+' Ft</small><div class="bar" style="margin:6px 0"><i style="width:'+Math.round(x.p/d[2]*100)+'%"></i></div>'+pv+' '+(x.cl?'<b style="color:#4ade80">átvéve</b>':done?'<button class="kdB y" onclick="_kD.qClaim('+i+')">Átveszem</button>':'')+'</div>'}).join('')+'<button class="kdB" onclick="_kD.casino()">🎰 Kaszinó</button> <button class="kdB" onclick="_kD.bj()">🃏 Blackjack</button>'};
V.shop=c=>{const X=window._x13c;const own=X?X.ST:{chutes:{},trails:{}};const it=[];
 if(X){X.CHUTES.filter(x=>x.p).forEach(x=>it.push({k:'c:'+x.id,n:'🪂 '+x.n+' ejtőernyő',z:Math.ceil(x.p/40),has:!!(own.chutes||{})[x.id],f:()=>{X.ST.chutes=X.ST.chutes||{};X.ST.chutes[x.id]=true;SV('k3x13c',X.ST)}}));X.TRAILS.filter(x=>x.p).forEach(x=>it.push({k:'t:'+x.id,n:'✨ '+x.n+' nyomvonal',z:Math.ceil(x.p/40),has:!!(own.trails||{})[x.id],f:()=>{X.ST.trails=X.ST.trails||{};X.ST.trails[x.id]=true;SV('k3x13c',X.ST)}}))}
 TITLES.forEach(([id,n,z])=>it.push({k:'ti:'+id,n:'🏷️ Cím: '+n,z,has:!!SH.own[id],f:()=>{SH.own[id]=1;SH.title=n}}));
 c.innerHTML='<div class="cd">🎁 <b>Ajándékbolt</b> – kozmetikumok zsetonért (a Stílus & Állatok skinjeit itt zsetonért is megkaphatod). Egyenleg: <b>'+fmt(zs())+' zs</b> · '+fmt(ft())+' Ft. Aktív cím: <b>'+esc(SH.title||'nincs')+'</b></div><div class="g">'+
 it.map((x,i)=>'<div class="cd"><b>'+esc(x.n)+'</b><br>'+(x.has?(x.k.startsWith('ti:')?'<button class="kdB" onclick="_kD.title(\''+esc(x.n.slice(7))+'\')">Viselem</button>':'<small>✅ megvan – a 🎨 Stílus menüben választható</small>'):'<button class="kdB y" onclick="_kD.buy('+i+')">'+fmt(x.z)+' zs</button>')+'</div>').join('')+'</div>'+
 '<div class="cd"><b>💸 Luxuscikkek (pénznyelő, csak dicsőség)</b><div class="g">'+LUX.map(([id,n,p])=>'<div class="cd"><b>'+n+'</b><br>'+(SH.own[id]?'✅ a tiéd':'<button class="kdB y" onclick="_kD.lux(\''+id+'\')">'+fmt(p)+' Ft</button>')+'</div>').join('')+'</div></div>';V._it=it};
V.resp=c=>{const L=lim();c.innerHTML='<div class="cd">🧘 <b>Felelős játék</b><br>'+respSummary()+'<br>Mai szünetek: '+PL.breaks+' · jelenlegi ülés: '+Math.round(PL.ses/60)+' perc</div><div class="cd">Szünet-emlékeztető: <select id="kdEv">'+[[15,'15 percenként'],[30,'30 percenként'],[60,'60 percenként'],[0,'kikapcsolva']].map(([v,n])=>'<option value="'+v+'"'+(PL.every===v?' selected':'')+'>'+n+'</option>').join('')+'</select> <button class="kdB" onclick="_kD.brk()">Próba</button></div>'+
 '<div class="cd">Napi veszteséghatár (zseton): <b>'+fmt(L.lim)+'</b> – a kaszinó főmenüjében állítható. Ma: '+(L.day===today()?fmt(L.lost):0)+' veszteség.<div class="bar" style="margin-top:6px"><i style="width:'+Math.min(100,Math.max(0,(L.day===today()?L.lost:0)/L.lim*100))+'%"></i></div></div><div class="cd"><small>A kaszinóban csak játékbeli zseton és Ft forog, valódi pénzt nem lehet nyerni vagy befizetni.</small></div>';
 $('#kdEv').onchange=e=>{PL.every=+e.target.value;SV('k3Dplay',PL)}};
V.eco=async c=>{const tx=TAXF(ft());let h='<div class="cd">🏛️ <b>Luxusadó</b> (óvatos, naponta 1×): 100 M Ft alatt <b>nincs</b>; 100 M – 1 mrd Ft rész után 0,2%/nap, 1 mrd feletti rész után 0,5%/nap. Te holnap: <b>'+(tx?'−'+fmt(tx)+' Ft':'0 Ft')+'</b> (egyenleg '+fmt(ft())+' Ft).'+(TX.log.length?'<br><small>Napló: '+TX.log.slice(0,5).map(x=>x.d+': −'+fmt(x.t)).join(' · ')+'</small>':'')+'<br><small>Pénznyelők: luxuscikkek az Ajándékboltban, rangok, ingatlanok.</small></div>';
 try{const j=await api('eco');h+='<div class="cd">📊 <b>Szerveres inflációfigyelő</b> ('+j.n+' aktív fiók, 30 nap)<br>Összes Ft: <b>'+fmt(j.ft)+'</b> · összes zseton: <b>'+fmt(j.zs)+'</b> · medián: '+fmt(j.med)+' Ft · legnagyobb: '+fmt(j.max)+' Ft · 100 M felett: '+j.rich+' fő<canvas id="kdEc" width="820" height="160" style="width:100%;margin-top:6px;background:#0005;border-radius:8px"></canvas></div>';c.innerHTML=h;
  const cv=$('#kdEc'),x=cv.getContext('2d'),H=j.hist||[],mx=Math.max(1,...H.map(p=>p.ft));x.strokeStyle='#facc15';x.lineWidth=3;x.beginPath();H.forEach((p,i)=>{const X=20+i*(780/Math.max(1,H.length-1)),Y=145-p.ft/mx*125;i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke();x.fillStyle='#f3ecd6';x.font='12px sans-serif';x.fillText('Összes Ft napi alakulása (max '+fmt(mx)+')',20,14)}
 catch(e){c.innerHTML=h+'<div class="cd"><small>Szerveres statisztika: '+esc(e.message)+'</small></div>'}};
V.war=async c=>{const j=await api('war');const d=t=>new Date(t).toLocaleString('hu-HU',{weekday:'long',hour:'2-digit',minute:'2-digit'});
 c.innerHTML='<div class="cd">⚔️ <b>Hétvégi klánháború</b> – szombat 0:00-tól vasárnap éjfélig minden klántag meccse pontot ér: <b>1 pont/kiesés, +10 győzelem</b>. A győztes klán tagjai 500 zs + 50 000 Ft jutalmat kapnak.<br>'+(j.live?'🔥 <b>ÉLŐ!</b> Vége: '+d(j.next):'Következő csata: <b>'+d(j.next)+'</b>')+(j.mine?' · a klánod: <b>'+esc(j.mine)+'</b>':' · <small>még nem vagy klánban (⭐ Közösség → Klánok)</small>')+'</div>'+
 (j.res?'<div class="cd">🏆 Múlt hétvége győztese: <b>['+esc(j.res.tag)+']</b> '+fmt(j.res.p)+' ponttal'+(j.canCl?' <button class="kdB y" onclick="_kD.warClaim()">Jutalom átvétele</button>':'')+'</div>':'')+
 '<div class="cd"><b>'+(j.live?'Állás most':'Legutóbbi csata')+'</b><table><tr><th>#</th><th>Klán</th><th>Pont</th><th>Meccs</th><th>Legjobb tag</th></tr>'+(j.list.length?j.list.map((x,i)=>'<tr><td>'+(i+1)+'.</td><td>'+esc(x.emb)+' ['+esc(x.tag)+'] '+esc(x.name)+'</td><td><b>'+fmt(x.p)+'</b></td><td>'+x.m+'</td><td>'+(x.best?esc(x.best[0])+' ('+x.best[1]+')':'')+'</td></tr>').join(''):'<tr><td colspan=5><small>Nincs még pont.</small></td></tr>')+'</table></div>'};
V.gram=async c=>{const j=await api('gram');const IG=window._x60IG;const my=(IG&&IG.posts||[]).filter(p=>p.src);
 c.innerHTML='<div class="cd">📸 <b>Közgram – szerveres</b> (mindenki látja). Moderálás: kép max ~140 KB (automatikusan kicsinyítjük), csúnya szavak tiltva, 3 jelentés = elrejtés.'+(acc()?'<br><textarea id="kdGt" maxlength="200" rows="2" style="width:100%" placeholder="Mit szeretnél megosztani?"></textarea><br>Kép: <select id="kdGi"><option value="">(nincs)</option>'+my.map((p,i)=>'<option value="'+i+'">'+esc((p.cap||p.txt||'Szelfi '+(i+1))).slice(0,30)+'</option>').join('')+'</select> vagy <input type="file" id="kdGf" accept="image/*"> <button class="kdB y" onclick="_kD.post()">Posztolás</button>':'<br><small>Posztolni bejelentkezve lehet.</small>')+'</div>'+
 (j.list.length?j.list.map(p=>'<div class="cd post"><b>'+esc(p.av)+' '+esc(p.n)+'</b> <small>'+new Date(p.t).toLocaleString('hu-HU')+'</small>'+(p.txt?'<div>'+esc(p.txt)+'</div>':'')+(p.img?'<img src="'+esc(p.img)+'">':'')+
 '<button class="kdB'+(p.liked?' y':'')+'" onclick="_kD.g(\'like\','+p.id+')">❤️ '+p.likes+'</button> '+(p.mine?'<button class="kdB" onclick="_kD.g(\'del\','+p.id+')">🗑️</button>':'<button class="kdB" onclick="_kD.g(\'rep\','+p.id+')" title="Jelentés">🚩</button>')+
 '<div style="margin-top:4px">'+p.com.map(m=>'<div><b>'+esc(m.n)+':</b> '+esc(m.t)+'</div>').join('')+'</div>'+(acc()?'<input id="kdGc'+p.id+'" maxlength="120" placeholder="Hozzászólás…" style="width:70%"> <button class="kdB" onclick="_kD.com('+p.id+')">💬</button>':'')+'</div>').join(''):'<div class="cd"><small>Még nincs poszt. Legyél az első!</small></div>')};
V.promo=async c=>{needAcc();const j=await api('promo');c.innerHTML='<div class="cd">🎟️ <b>Alkotói kódok statisztikája</b> – összes beváltás a szerveren: <b>'+fmt(j.total)+'</b>. Saját kódot a 🎟️ Promó menüben hozhatsz létre.</div>'+
 (j.mine.length?j.mine.map(m=>{const mx=Math.max(1,...m.per);return '<div class="cd"><b>'+esc(m.code)+'</b> – '+m.uses+' beváltás ('+m.uniq+' különböző játékos)<div style="display:flex;align-items:flex-end;gap:3px;height:50px;margin:6px 0">'+m.per.map((v,i)=>'<div title="'+(13-i)+' napja: '+v+'" style="flex:1;background:#facc15;height:'+Math.max(2,v/mx*48)+'px;border-radius:2px"></div>').join('')+'</div><small>utolsó 14 nap · legutóbb: '+(m.who.slice(0,10).map(w=>esc(w.n)+' ('+new Date(w.t).toLocaleDateString('hu-HU')+')').join(', ')||'senki')+'</small></div>'}).join(''):'<div class="cd"><small>Még nincs saját kódod.</small></div>')+
 '<div class="cd"><b>🔥 Legnépszerűbb kódok</b><table><tr><th>Kód</th><th>Készítő</th><th>Beváltás</th></tr>'+j.top.map(t=>'<tr><td>'+esc(t.code)+'</td><td>'+esc(t.by)+'</td><td>'+t.uses+'</td></tr>').join('')+'</table></div>'};
const ICO=['🧱','📦','🟫','🌲','🎁'];let mapS='top';
const prev=cells=>{let s='<div style="display:grid;grid-template-columns:repeat(16,1fr);background:#14532d;border-radius:6px;width:160px;height:160px;font-size:8px;line-height:10px;text-align:center">';for(let b=0;b<16;b++)for(let a=0;a<16;a++){const v=cells[a+','+b];s+='<span>'+(v!=null?ICO[v]||'':'')+'</span>'}return s+'</div>'};
V.maps=async c=>{const j=await api('maps'+'?s='+mapS);const mine=LS('k3x120map',{cells:{}});
 c.innerHTML='<div class="cd">🗺️ <b>Pályamegosztás</b> – a 🗺️ sziget-szerkesztőben (extra120) készített pályádat feltöltheted, mások pályáit letöltheted és értékelheted.'+(acc()?'<br>Saját pályád: '+Object.keys(mine.cells||{}).length+' elem · név: <input id="kdMn" maxlength="30" placeholder="Pálya neve"> <button class="kdB y" onclick="_kD.mapUp()">📤 Feltöltés</button>':'<br><small>Feltölteni és értékelni bejelentkezve lehet.</small>')+'</div>'+
 '<div>Rendezés: '+[['top','⭐ legjobb'],['new','🆕 új'],['dl','📥 letöltött']].map(([k,n])=>'<button class="kdB'+(k===mapS?' y':'')+'" onclick="_kD.mapS(\''+k+'\')">'+n+'</button>').join(' ')+'</div><div class="g" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">'+
 (j.list.length?j.list.map(m=>'<div class="cd" style="display:flex;gap:8px">'+prev(m.cells)+'<div><b>'+esc(m.name)+'</b><br><small>'+esc(m.n)+' · '+m.cnt+' elem · 📥 '+m.dl+'</small><br>⭐ '+m.avg+' ('+m.votes+')<br>'+(m.mine?'<button class="kdB" onclick="_kD.mapX(\'del\','+m.id+')">🗑️</button>':[1,2,3,4,5].map(s=>'<span style="cursor:pointer;color:'+(s<=m.my?'#facc15':'#777')+'" onclick="_kD.mapX(\'rate\','+m.id+','+s+')">★</span>').join(''))+'<br><button class="kdB y" onclick="_kD.mapX(\'dl\','+m.id+')">📥 Letöltés</button></div></div>').join(''):'<div class="cd"><small>Még nincs feltöltött pálya.</small></div>')+'</div>'};

// =================== műveletek ===================
const wrap=f=>async(...a)=>{try{await f(...a)}catch(e){toast('⚠️ '+e.message)}};
function shrink(src){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>{let q=.8,s=Math.min(1,640/Math.max(im.width,im.height));const cv=document.createElement('canvas');let d;
 for(let k=0;k<8;k++){cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);d=cv.toDataURL('image/jpeg',q);if(d.length<180000)return res(d);q=Math.max(.4,q-.1);s*=.8}rej(new Error('A kép túl nagy.'))};im.onerror=()=>rej(new Error('Nem kép.'));im.src=src})}
window._kD={open,close,render,brk,V,
 casino:()=>{close();try{x10cas()}catch(e){}},bj:()=>{close();try{_x14d.open?_x14d.open('bj'):($('#x14dM').classList.add('on'))}catch(e){}},
 slotClaim:wrap(async()=>{const j=await api('slot/claim',{});give(j.zs,j.ft);toast('🏆 '+j.place+'. hely: +'+fmt(j.zs)+' zs, +'+fmt(j.ft)+' Ft');render()}),
 qClaim:i=>{const x=Q.q[i],d=x&&QPOOL.find(p=>p[0]===x.id);if(!d||x.cl||x.p<d[2])return;x.cl=true;SV('k3Dq',Q);give(d[3],d[4]);toast('🎯 +'+d[3]+' zs, +'+fmt(d[4])+' Ft');render()},
 buy:i=>{const x=V._it[i];if(x&&!x.has)buyZs(x.z,x.f)},title:n=>{SH.title=n;SV('k3Dshop',SH);render()},
 lux:id=>{const x=LUX.find(l=>l[0]===id);if(!x||SH.own[id])return;if(ft()<x[2])return toast('Nincs elég Ft.');if(!confirm(x[1]+' – '+fmt(x[2])+' Ft. Biztos?'))return;S.c-=x[2];saveAll();SH.own[id]=1;SV('k3Dshop',SH);toast('💸 '+x[1]+' a tiéd!');render()},
 warClaim:wrap(async()=>{const j=await api('war/claim',{});give(j.zs,j.ft);toast('⚔️ Klánjutalom: +'+j.zs+' zs, +'+fmt(j.ft)+' Ft');render()}),
 post:wrap(async()=>{needAcc();const txt=$('#kdGt').value.trim();let img='';const f=$('#kdGf').files[0],si=$('#kdGi').value;
  if(f){img=await shrink(await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)}))}else if(si!==''){img=await shrink(window._x60IG.posts.filter(p=>p.src)[+si].src)}
  await api('gram/post',{txt,img});toast('📸 Posztolva!');render()}),
 g:wrap(async(a,id)=>{if(a==='rep'&&!confirm('Jelented ezt a posztot?'))return;if(a==='del'&&!confirm('Törlöd?'))return;await api('gram/'+a,{id});render()}),
 com:wrap(async id=>{const v=$('#kdGc'+id).value.trim();if(!v)return;await api('gram/com',{id,txt:v});render()}),
 mapS:s=>{mapS=s;render()},
 mapUp:wrap(async()=>{needAcc();const m=LS('k3x120map',{cells:{}});await api('maps/up',{name:$('#kdMn').value,cells:m.cells});toast('🗺️ Feltöltve!');render()}),
 mapX:wrap(async(a,id,s)=>{if(a==='del'&&!confirm('Törlöd a pályát?'))return;if(a==='dl'&&!confirm('A letöltött pálya felülírja a saját szerkesztett pályádat. Mehet?'))return;const j=await api('maps/'+a,{id,s});
  if(a==='dl'){const m=LS('k3x120map',{cells:{},on:false});m.cells=j.cells;m.on=true;SV('k3x120map',m);toast('📥 Letöltve – a következő BR-meccsen ez a sziget épül meg (a szerkesztő újratöltés után mutatja).')}render()}),
 dbg:()=>({Q,PL,TX,SH,SLOTREP,pend,casOpen:casOpen()}),qAdd,taxF:TAXF};

// =================== lobby gomb, kaszinó-sáv, telefon-app ===================
const btn=document.createElement('button');btn.id='kdBtn';btn.textContent='🏆 Versenyek';btn.onclick=()=>open();document.body.appendChild(btn);
function inLobby(){const l=$('#lb');return !!(l&&l.classList.contains('on'))}
function casBar(){const mb=$('#x10MB');if(!mb||$('#kdCas')||!casOpen())return;if(!/veszteséghatár|Veszteséghatár/i.test(mb.textContent))return;const d=document.createElement('div');d.id='kdCas';
 d.innerHTML='<span id="kdCs">'+respSummary()+'</span><span style="flex:1"></span><button class="kdB" onclick="_kD.open(\'slot\')">🏆 Heti bajnokság</button><button class="kdB" onclick="_kD.open(\'quest\')">🎯 Küldetések</button><button class="kdB" onclick="_kD.open(\'shop\')">🎁 Ajándékbolt</button><button class="kdB" onclick="_kD.open(\'resp\')">🧘 Felelős játék</button>';mb.prepend(d)}
setInterval(()=>{hookSlot();hookPoker();bjWatch();playTick();casBar();const s=$('#kdCs');if(s&&PL.sec%5===0)s.textContent=respSummary();btn.style.display=inLobby()?'':'none'},1000);
setInterval(()=>{taxTick();ecoRep()},20000);setTimeout(()=>{taxTick();ecoRep()},8000);
window._x60APPS=window._x60APPS||{};_x60APPS.kdgram={e:'🌐',n:'Közgram+',bg:'linear-gradient(45deg,#facc15,#db2777)',render:()=>'<p>A szerveres Közgram: posztok, lájkok, kommentek mindenkivel.</p><button onclick="_kD.open(\'gram\')" style="padding:10px;border-radius:10px;font-weight:700">Megnyitás</button>'};
})();
