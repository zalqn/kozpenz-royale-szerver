// ===== EXTRA20: barát-profil · klánok · rangsorolt ranglista · heti világesemény · kutyaverseny · 30 napos naptár
// fegyverskinek + győzelmi tánc · visszajátszás · vándorárus a meccsben · lottó (napi sorsolás 20:00)
(function(){
const SH_=(e,h)=>{if(e._h!==h){e._h=h;e.innerHTML=h}},SD_=(e,d)=>{if(e.style.display!==d)e.style.display=d},ST_=(e,t)=>{if(e._t!==t){e._t=t;e.textContent=t}};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x20pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x20 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>(+n||0).toLocaleString('hu-HU');
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const tok=()=>localStorage.getItem('ry_token')||'';
const api=(p,b)=>fetch('/api/x20/'+p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:b?JSON.stringify(b):undefined}).then(r=>r.json()).catch(()=>({error:'Nem érem el a szervert.'}));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const saveAll=()=>{try{save()}catch(e){}try{st.s('k3br',BR)}catch(e){}};
const sayX=t=>{try{say(t)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};

// ---------- közös modal ----------
const css=document.createElement('style');css.textContent=`
#x20M{position:fixed;inset:0;z-index:60;background:#000a;display:none;align-items:center;justify-content:center}
#x20M>div{background:linear-gradient(160deg,#10243a,#0b1022);border:1px solid #38bdf855;border-radius:18px;padding:18px 22px;color:#fff;font:600 16px Rajdhani,sans-serif;width:min(760px,94vw);max-height:90vh;overflow:auto;box-shadow:0 20px 60px #000}
#x20M h2{margin:0 0 8px;font:26px 'Luckiest Guy',Impact;color:#7dd3fc}
#x20M h3{margin:12px 0 4px;font:18px 'Luckiest Guy',Impact;color:#fde68a}
#x20M button{display:inline-block;width:auto;position:static;border:0;border-radius:10px;padding:7px 13px;margin:3px;font:700 15px Rajdhani,sans-serif;cursor:pointer;background:#334155;color:#fff}
#x20M button.y{background:linear-gradient(135deg,#fde68a,#f59e0b);color:#1c1300}#x20M button.g{background:#16a34a}#x20M button.b{background:#0284c7}#x20M button:disabled{opacity:.4;cursor:default}
#x20M input{padding:8px 10px;border-radius:9px;border:2px solid #38bdf866;background:#0008;color:#fff;font:700 16px Rajdhani;outline:none;margin:3px}
.x20row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:6px 10px;margin:4px 0;background:#ffffff0d;border-radius:10px}
.x20tbl{width:100%;border-collapse:collapse;margin-top:6px}.x20tbl td{padding:5px 8px;border-bottom:1px solid #ffffff15}.x20tbl td:nth-child(2),.x20tbl td:nth-child(3){text-align:center;font-weight:800}.x20tbl .w{color:#4ade80}
.x20grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.x20day{border-radius:10px;padding:6px 2px;text-align:center;background:#ffffff0d;font-size:13px}.x20day b{display:block;font-size:20px}
.x20day.ok{background:#16a34a55}.x20day.now{outline:2px solid #facc15;background:#facc1533}.x20day.big{background:linear-gradient(135deg,#7c3aed,#db2777)}
.x20num{width:40px;height:40px;margin:3px;border-radius:50%!important;padding:0!important}.x20num.on{background:#facc15!important;color:#1c1300!important}
#x20track{position:relative;background:repeating-linear-gradient(90deg,#166534 0 40px,#15803d 40px 80px);border-radius:12px;padding:6px 0;margin:8px 0;overflow:hidden}
#x20track .ln{position:relative;height:42px;border-bottom:1px dashed #ffffff33}#x20track .dg{position:absolute;left:0;top:2px;font-size:34px;transform:scaleX(-1);transition:left .1s linear}
#x20track .fin{position:absolute;right:30px;top:0;bottom:0;width:6px;background:repeating-linear-gradient(#fff 0 8px,#000 8px 16px)}
#x20Shop{position:fixed;left:50%;top:62%;transform:translateX(-50%);z-index:6;background:#000b;color:#fff;font:700 16px Rajdhani;padding:5px 12px;border-radius:10px;display:none;pointer-events:none}#x20Shop b{color:#facc15}
#x20Ev{position:fixed;left:50%;top:120px;transform:translateX(-50%);z-index:5;background:linear-gradient(90deg,#7c2d12cc,#b45309cc);color:#fff;font:700 15px Rajdhani;padding:4px 14px;border-radius:999px;display:none;pointer-events:none}
#x20Toast{position:fixed;left:50%;top:26%;transform:translateX(-50%);z-index:62;background:linear-gradient(135deg,#7dd3fc,#0284c7);color:#fff;font:20px 'Luckiest Guy',Impact;padding:10px 22px;border-radius:14px;display:none;box-shadow:0 8px 30px #000a;text-align:center}`;
document.head.appendChild(css);
const M=document.createElement('div');M.id='x20M';M.innerHTML='<div id="x20MB"></div>';document.body.appendChild(M);M.addEventListener('mousedown',e=>{if(e.target===M)closeM()});
const T=document.createElement('div');T.id='x20Toast';document.body.appendChild(T);let tT=0;
function toast(t){T.innerHTML=t;T.style.display='block';clearTimeout(tT);tT=setTimeout(()=>T.style.display='none',3200)}
function openM(h){$$('x20MB').innerHTML=h+'<div style="text-align:right;margin-top:10px"><button onclick="x20close()">BEZÁR</button></div>';M.style.display='flex';if(document.pointerLockElement)document.exitPointerLock()}
function closeM(){M.style.display='none';RACE.on=false}
window.x20close=closeM;
M.addEventListener('keydown',e=>e.stopPropagation());

// =====================================================================
// 3) RANGSOR szinkron + ranglista · 1) PROFIL összehasonlítás
// =====================================================================
const RANKS=[[0,'BRONZ','🥉'],[300,'EZÜST','🥈'],[700,'ARANY','🥇'],[1200,'PLATINA','💠'],[1800,'GYÉMÁNT','💎'],[2600,'ELIT','🔥'],[3500,'LEGENDA','👑']];
const rankOf=v=>{let r=RANKS[0];RANKS.forEach(x=>{if(v>=x[0])r=x});return r};
function myStats(){const ch=LSg('k3x10ch',{tot:{},ach:{}});return{rp:LSg('ry_rp',0)|0,hs:ch.tot.hs||0,melee:ch.tot.melee||0,ach:Object.keys(ch.ach||{}).length,skin:SK.cur}}
async function sync(){if(!tok())return;await api('sync',myStats())}
setTimeout(sync,6000);setInterval(sync,60000);
async function showRank(){const r=await api('ranked');const me=myStats(),mr=rankOf(me.rp);
 openM('<h2>🏅 RANGSOROLT RANGLISTA</h2><div class="x20row"><span>A te rangod: <b>'+mr[2]+' '+mr[1]+'</b></span><b>'+me.rp+' RP</b></div><div style="font-size:13px;opacity:.7">RP-t a Battle Royale helyezésed és a kieséseid adnak. Rangok: '+RANKS.map(x=>x[2]+' '+x[1]+' ('+x[0]+')').join(' · ')+'</div>'+
 (r.error?'<div style="color:#fca5a5">'+esc(r.error)+'</div>':(r.list||[]).map((x,i)=>{const k=rankOf(x.rp);return'<div class="x20row"><span><b style="display:inline-block;width:28px">'+(i<3?['🥇','🥈','🥉'][i]:(i+1)+'.')+'</b>'+esc(x.av)+' <a href="#" onclick="x20prof(\''+esc(x.n)+'\');return false" style="color:#7dd3fc">'+esc(x.n)+'</a>'+(x.clan?' <small style="color:#fde68a">['+esc(x.clan)+']</small>':'')+'</span><span>'+k[2]+' '+k[1]+' · <b>'+x.rp+'</b> RP</span></div>'}).join('')||'<div style="opacity:.6">Még üres a lista. Játssz Battle Royale-t!</div>'))}
window.x20rank=showRank;
async function showProf(name){if(!name){let fr=[];try{fr=(window.ACC&&ACC.user&&ACC.user.friends)||[]}catch(e){}
  openM('<h2>👥 JÁTÉKOS-PROFIL</h2><div>Név: <input id="x20pn" placeholder="játékos neve"><button class="b" onclick="x20prof(document.getElementById(\'x20pn\').value)">KERESÉS</button></div><h3>Barátaid</h3>'+(fr.length?fr.map(n=>'<button onclick="x20prof(\''+esc(n)+'\')">'+esc(n)+'</button>').join(''):'<div style="opacity:.6">Még nincs barátod, de név alapján bárkit megnézhetsz.</div>')+'<h3>Ranglista</h3><button class="y" onclick="x20rank()">🏅 RANGSOROLT RANGLISTA</button>');return}
 const r=await api('profile?name='+encodeURIComponent(name));if(r.error){openM('<h2>👥 PROFIL</h2><div style="color:#fca5a5">'+esc(r.error)+'</div><button onclick="x20prof()">◀ VISSZA</button>');return}
 const p=r.p,m=r.me;try{const s=myStats();m.x20=Object.assign({},m.x20,s)}catch(e){}
 const row=(l,a,b)=>{a=+a||0;b=+b||0;return'<tr><td>'+l+'</td><td class="'+(a>b?'w':'')+'">'+fmt(a)+'</td><td class="'+(b>a?'w':'')+'">'+fmt(b)+'</td></tr>'};
 const kd=x=>x.stats&&x.stats.games?(x.stats.kills/x.stats.games).toFixed(1):'0';
 const rk=x=>{const k=rankOf((x.x20||{}).rp||0);return k[2]+' '+k[1]};
 openM('<h2>👥 '+esc(p.avatar)+' '+esc(p.name)+(p.clan?' <span style="color:#fde68a;font-size:18px">'+esc(p.clan.emb)+' ['+esc(p.clan.tag)+']</span>':'')+'</h2><div style="opacity:.75;font-size:14px">Regisztrált: '+new Date(p.created||Date.now()).toLocaleDateString('hu-HU')+' · '+rk(p)+'</div>'+
 '<table class="x20tbl"><tr><td></td><td><b style="color:#7dd3fc">'+esc(p.name)+'</b></td><td><b style="color:#fde68a">TE ('+esc(m.name)+')</b></td></tr>'+
 row('🎚️ Szint',p.level,m.level)+row('🎮 Meccsek',p.stats.games,m.stats.games)+row('🏆 Győzelmek',p.stats.wins,m.stats.wins)+row('💀 Kiesések',p.stats.kills,m.stats.kills)+
 '<tr><td>⚔️ Kiesés / meccs</td><td>'+kd(p)+'</td><td>'+kd(m)+'</td></tr>'+row('🎯 Fejlövések',(p.x20||{}).hs,(m.x20||{}).hs)+row('🍳 Közelharc-kiesések',(p.x20||{}).melee,(m.x20||{}).melee)+row('🏅 Rangpont (RP)',(p.x20||{}).rp,(m.x20||{}).rp)+row('🏆 Achievementek',(p.x20||{}).ach,(m.x20||{}).ach)+
 '</table><div style="margin-top:8px"><button onclick="x20prof()">◀ VISSZA</button></div>')}
window.x20prof=showProf;

// =====================================================================
// 2) KLÁNOK
// =====================================================================
const EMB=['🛡️','🐺','🦅','🐉','💰','👑','🔥','⚡','🍳','🥔','🐕','🏛️'];let embSel='🛡️';let clanIv=0;
async function showClan(msg){clearInterval(clanIv);const r=await api('clan');if(r.error){openM('<h2>🛡️ KLÁNOK</h2><div style="color:#fca5a5">'+esc(r.error)+'</div>');return}
 const all=await api('clans');const top=(all.list||[]).slice(0,10);
 const board='<h3>🏆 HETI KLÁN-RANGLISTA (7 nap kiesései)</h3>'+(top.map((c,i)=>'<div class="x20row"><span>'+(i+1)+'. '+esc(c.emb)+' <b>['+esc(c.tag)+']</b> '+esc(c.name)+' <small>('+c.cnt+' fő)</small></span><span><b>'+c.wk+'</b> kiesés'+(!r.clan?' <button class="b" onclick="x20cj(\''+esc(c.tag)+'\')">BELÉPÉS</button>':'')+'</span></div>').join('')||'<div style="opacity:.6">Még nincs klán. Alapítsd meg az elsőt!</div>');
 const m=msg?'<div style="color:#fca5a5;margin:4px 0">'+esc(msg)+'</div>':'';
 if(!r.clan){openM('<h2>🛡️ KLÁNOK</h2>'+m+'<h3>Klán alapítása</h3><div>Név: <input id="x20cn" maxlength="24" placeholder="pl. Krumpli Brigád"> Rövidítés: <input id="x20ct" maxlength="5" style="width:80px;text-transform:uppercase" placeholder="KRB"></div><div>Embléma: '+EMB.map(e=>'<button class="'+(e===embSel?'y':'')+'" onclick="x20emb(\''+e+'\')">'+e+'</button>').join('')+'</div><button class="y" onclick="x20cc()">ALAPÍTÁS</button>'+board);return}
 const c=r.clan;openM('<h2>'+esc(c.emb)+' ['+esc(c.tag)+'] '+esc(c.name)+'</h2>'+m+'<div style="opacity:.75">Vezető: '+esc(c.owner)+' · '+c.members.length+'/20 tag · heti kiesések: <b>'+c.wk+'</b></div>'+
  '<div style="display:flex;gap:12px;flex-wrap:wrap"><div style="flex:1;min-width:220px"><h3>Tagok</h3>'+c.mem.sort((a,b)=>b.k-a.k).map(x=>'<div class="x20row"><span>'+esc(x.av)+' <a href="#" style="color:#7dd3fc" onclick="x20prof(\''+esc(x.n)+'\');return false">'+esc(x.n)+'</a>'+(x.n===c.owner?' 👑':'')+'</span><small>'+x.k+' kiesés/hét</small></div>').join('')+'</div>'+
  '<div style="flex:1.4;min-width:260px"><h3>💬 Klánchat</h3><div id="x20cc" style="height:220px;overflow:auto;background:#0006;border-radius:10px;padding:6px 8px;font-size:15px">'+c.chat.slice(-50).map(x=>'<div><b style="color:'+(x.n==='📢'?'#fde68a':'#7dd3fc')+'">'+esc(x.n)+':</b> '+esc(x.m)+'</div>').join('')+'</div><input id="x20ci" maxlength="160" style="width:70%" placeholder="Üzenet a klánnak..."><button class="b" onclick="x20cs()">KÜLD</button></div></div>'+board+
  '<button style="background:#7f1d1d" onclick="if(confirm(\'Biztos kilépsz a klánból?\'))x20cl()">KILÉPÉS A KLÁNBÓL</button>');
 const cc=$$('x20cc');if(cc)cc.scrollTop=1e6;const ci=$$('x20ci');if(ci){ci.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')window.x20cs()}}
 clanIv=setInterval(async()=>{if(M.style.display!=='flex'||!$$('x20cc')){clearInterval(clanIv);return}const q=await api('clan');if(q.clan){const el=$$('x20cc');const atB=el.scrollTop+el.clientHeight>=el.scrollHeight-5;el.innerHTML=q.clan.chat.slice(-50).map(x=>'<div><b style="color:'+(x.n==='📢'?'#fde68a':'#7dd3fc')+'">'+esc(x.n)+':</b> '+esc(x.m)+'</div>').join('');if(atB)el.scrollTop=1e6}},4000)}
window.x20clan=showClan;window.x20emb=e=>{embSel=e;const n=$$('x20cn').value,t=$$('x20ct').value;showClan().then(()=>{if($$('x20cn')){$$('x20cn').value=n;$$('x20ct').value=t}})};
window.x20cc=async()=>{const r=await api('clan/create',{name:$$('x20cn').value,tag:$$('x20ct').value,emb:embSel});showClan(r.error)};
window.x20cj=async t=>{const r=await api('clan/join',{tag:t});showClan(r.error)};
window.x20cl=async()=>{await api('clan/leave',{});showClan()};
window.x20cs=async()=>{const i=$$('x20ci');if(!i||!i.value.trim())return;const v=i.value;i.value='';const r=await api('clan/chat',{m:v});if(r.error)toast(esc(r.error));const q=await api('clan');if(q.clan&&$$('x20cc')){$$('x20cc').innerHTML=q.clan.chat.slice(-50).map(x=>'<div><b style="color:'+(x.n==='📢'?'#fde68a':'#7dd3fc')+'">'+esc(x.n)+':</b> '+esc(x.m)+'</div>').join('');$$('x20cc').scrollTop=1e6}};

// =====================================================================
// 6) 30 NAPOS NAPTÁR  ·  7) FEGYVERSKINEK + GYŐZELMI TÁNC
// =====================================================================
const SKINS=[['def','Alap',null,0],['arany','Arany',0xfacc15,2500],['lang','Láng',0xf97316,2000],['neon','Neon',0x22d3ee,2000],['rozsa','Rózsaszín',0xf472b6,1500],['dzsungel','Dzsungel',0x15803d,1500],['gyemant','💎 Gyémánt (csak naptárból)',0x93c5fd,-1]];
const DANCES=[['tap','Tapsolás',0],['ugral','Ugrálás',0],['robot','Robottánc',800],['penzeso','Pénzszórás',1200],['forgo','Pörgés',1000]];
const SK=Object.assign({cur:'def',own:{def:1},dance:'tap',dOwn:{tap:1,ugral:1}},LSg('k3x20sk',{}));const skSave=()=>LSs('k3x20sk',SK);window._x20SK=SK;window._x20SKINS=SKINS;window._x20skSave=skSave;
const CAL=Object.assign({last:'',day:0},LSg('k3x20cal',{}));
const CALRW=d=>d===30?{k:'skin',v:'gyemant',t:'💎 Gyémánt fegyverskin (exkluzív!)'}:d%10===0?{k:'zs',v:1000,t:'1000 🪙'}:d%7===0?{k:'ft',v:50000,t:'50 000 Ft'}:d%5===0?{k:'zs',v:400,t:'400 🪙'}:d%2===0?{k:'ft',v:10000+d*500,t:fmt(10000+d*500)+' Ft'}:{k:'zs',v:100+d*10,t:(100+d*10)+' 🪙'};
const dstr=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function calState(){const t=dstr(new Date()),y=dstr(new Date(Date.now()-864e5));if(CAL.last===t)return{can:false,next:CAL.day};if(CAL.last!==y&&CAL.day>0&&CAL.last){/* kihagyott nap: nem nullázzuk, csak megy tovább */}return{can:true,next:CAL.day>=30?1:CAL.day+1}}
function showCal(){const s=calState();const cur=s.can?s.next:CAL.day;
 openM('<h2>📅 30 NAPOS BELÉPÉSI NAPTÁR</h2><div style="opacity:.75;font-size:14px">Minden nap, amikor belépsz, átvehetsz egy jutalmat. A 30. napon exkluzív 💎 Gyémánt fegyverskin jár!</div><div class="x20grid" style="margin-top:8px">'+
 Array.from({length:30},(_,i)=>{const d=i+1,r=CALRW(d);const done=d<=CAL.day&&!(s.can&&CAL.day>=30);return'<div class="x20day '+(done?'ok ':'')+(d===cur&&s.can?'now ':'')+(d===30?'big':'')+'">'+d+'. nap<b>'+(done?'✅':r.k==='skin'?'💎':r.k==='zs'?'🪙':'💰')+'</b>'+r.t+'</div>'}).join('')+'</div><div style="text-align:center;margin-top:10px">'+
 (s.can?'<button class="y" style="font-size:20px;padding:10px 30px" onclick="x20calc()">ÁTVESZEM: '+CALRW(s.next).t+'</button>':'<b style="color:#86efac">✅ Mára átvetted. Gyere vissza holnap!</b>')+'</div>')}
window.x20cal=showCal;
window.x20calc=()=>{const s=calState();if(!s.can)return;CAL.day=s.next;CAL.last=dstr(new Date());LSs('k3x20cal',CAL);const r=CALRW(CAL.day);
 if(r.k==='ft'){try{S.c+=r.v}catch(e){}}else if(r.k==='zs'){try{BR.zs=(BR.zs|0)+r.v}catch(e){}}else{SK.own[r.v]=1;SK.cur=r.v;skSave()}saveAll();toast('📅 '+CAL.day+'. nap: '+r.t);showCal()};
function showSkin(){const zs=typeof BR!=='undefined'?BR.zs:0;
 openM('<h2>🔫 FEGYVERSKINEK</h2><div>Zseton: <b style="color:#facc15">'+fmt(zs)+'</b></div>'+SKINS.map(([id,n,c,p])=>'<div class="x20row"><span><span style="display:inline-block;width:22px;height:22px;border-radius:6px;vertical-align:middle;background:'+(c?'#'+c.toString(16).padStart(6,'0'):'#555')+'"></span> '+n+'</span>'+(SK.own[id]?(SK.cur===id?'<b style="color:#86efac">✔ HASZNÁLATBAN</b>':'<button class="g" onclick="x20sk(\''+id+'\')">FELVESZ</button>'):p<0?'<small>🔒 különleges jutalom</small>':'<button class="y" onclick="x20skb(\''+id+'\')">'+p+' 🪙</button>')+'</div>').join('')+
 '<h3>🕺 GYŐZELMI TÁNC</h3><div style="font-size:13px;opacity:.7">Győzelem után a kamera körbejár, a karaktered pedig eljárja.</div>'+DANCES.map(([id,n,p])=>'<div class="x20row"><span>'+n+'</span>'+(SK.dOwn[id]?(SK.dance===id?'<b style="color:#86efac">✔ KIVÁLASZTVA</b>':'<button class="g" onclick="x20dn(\''+id+'\')">KIVÁLASZT</button>'):'<button class="y" onclick="x20dnb(\''+id+'\')">'+p+' 🪙</button>')+'</div>').join('')+
 '<button class="b" onclick="x20dance(true)">▶ TÁNC ELŐNÉZET</button>')}
window.x20skin=showSkin;
window.x20sk=id=>{SK.cur=id;skSave();showSkin()};window.x20dn=id=>{SK.dance=id;skSave();showSkin()};
window.x20skb=id=>{const s=SKINS.find(x=>x[0]===id);if(!s||BR.zs<s[3]){toast('Nincs elég zseton!');return}BR.zs-=s[3];SK.own[id]=1;SK.cur=id;skSave();saveAll();showSkin()};
window.x20dnb=id=>{const s=DANCES.find(x=>x[0]===id);if(!s||BR.zs<s[2]){toast('Nincs elég zseton!');return}BR.zs-=s[2];SK.dOwn[id]=1;SK.dance=id;skSave();saveAll();showSkin()};
// skin alkalmazása a fegyverre
function applySkin(){if(typeof G==='undefined'||!G||!G.gun)return;const s=SKINS.find(x=>x[0]===SK.cur),on=s&&s[2];
 G.gun.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material)||!o.material.color)return;const m=o.material;
  if(on){if(!o.userData.x20o)o.userData.x20o={c:m.color.getHex(),e:m.emissive?m.emissive.getHex():0,mt:m.metalness};m.color.setHex(s[2]);if(m.emissive)m.emissive.setHex(SK.cur==='neon'||SK.cur==='gyemant'||SK.cur==='lang'?s[2]&0x3f3f3f:0);if(SK.cur==='arany'||SK.cur==='gyemant')m.metalness=.8}
  else if(o.userData.x20o){m.color.setHex(o.userData.x20o.c);if(m.emissive)m.emissive.setHex(o.userData.x20o.e);if(o.userData.x20o.mt!==undefined)m.metalness=o.userData.x20o.mt;delete o.userData.x20o}})}
// győzelmi tánc (kameraforgatás saját rendereléssel)
function danceRun(preview,done){if(typeof THREE==='undefined')return done&&done();let sc,cm,rn,own=false;
 if(preview||typeof scene==='undefined'||typeof ren==='undefined'||!ren){own=true;sc=new THREE.Scene();sc.background=new THREE.Color(0x1e1b4b);sc.add(new THREE.HemisphereLight(0xffffff,0x334155,1.1));const fl=new THREE.Mesh(new THREE.CircleGeometry(4,32),new THREE.MeshStandardMaterial({color:0x312e81}));fl.rotation.x=-Math.PI/2;sc.add(fl);
  const cv=document.createElement('canvas');cv.width=460;cv.height=300;cv.style.cssText='display:block;margin:8px auto;border-radius:14px';const box=$$('x20dp')||$$('x20MB');if(box)box.appendChild(cv);rn=new THREE.WebGLRenderer({canvas:cv,antialias:true});cm=new THREE.PerspectiveCamera(50,460/300,.1,100)}
 else{sc=scene;rn=ren;cm=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,2000)}
 const px=own?0:G.x,pz=own?0:G.z,py=own?0:(G.y||0);let m;try{m=person(0xfacc15,'',1)}catch(e){m=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial({color:0xfacc15}))}
 m.position.set(px,py,pz);sc.add(m);const L={};m.traverse(o=>{if(o.userData&&o.userData.limb)L[o.userData.limb]=o});
 const money=[];const t0=performance.now();const D=SK.dance;
 (function f(){const t=(performance.now()-t0)/1000;if(t>(preview?6:3.6)||(preview&&M.style.display!=='flex')){sc.remove(m);money.forEach(x=>sc.remove(x));if(own){try{rn.dispose()}catch(e){}}done&&done();return}
  const a=t*1.1;cm.position.set(px+Math.cos(a)*6,py+2.6,pz+Math.sin(a)*6);cm.lookAt(px,py+1.3,pz);
  const s=Math.sin(t*8);m.rotation.y=D==='forgo'?t*9:-a+Math.PI/2;m.position.y=py+(D==='ugral'?Math.abs(Math.sin(t*6))*1.2:0);
  if(L.larm){L.larm.rotation.x=D==='robot'?(s>0?-1.5:0):D==='tap'?-1.2:0;L.larm.rotation.z=D==='robot'?0:D==='tap'?-(.6+Math.abs(s)*.9):-(2.5+s*.5)}if(L.rarm){L.rarm.rotation.x=D==='robot'?(s>0?0:-1.5):D==='tap'?-1.2:0;L.rarm.rotation.z=D==='robot'?0:D==='tap'?(.6+Math.abs(s)*.9):(2.5-s*.5)}
  if(L.lleg)L.lleg.rotation.x=D==='robot'?0:s*.5;if(L.rleg)L.rleg.rotation.x=D==='robot'?0:-s*.5;
  if(D==='penzeso'&&Math.random()<.3){const b=new THREE.Mesh(new THREE.PlaneGeometry(.4,.2),new THREE.MeshBasicMaterial({color:0x22c55e,side:THREE.DoubleSide}));b.position.set(px+RN(-2,2),py+4,pz+RN(-2,2));sc.add(b);money.push(b)}
  money.forEach(b=>{b.position.y-=.05;b.rotation.x+=.2;b.rotation.z+=.1});
  rn.render(sc,cm);requestAnimationFrame(f)})()}
window.x20dance=p=>{if(p){openM('<h2>🕺 TÁNC ELŐNÉZET</h2><div id="x20dp"></div><button onclick="x20skin()">◀ VISSZA</button>');setTimeout(()=>danceRun(true),50)}};

// =====================================================================
// 5) KUTYAVERSENY (zsetonos fogadás, lobby)
// =====================================================================
const DOGS=[['Bundás','🐕',2.2],['Villám','🐩',3],['Pörkölt','🦮',4],['Morzsa','🐕‍🦺',5],['Herceg','🐶',7]];
const RACE={on:false,bet:100,pick:0};
function showRace(res){openM('<h2>🐕 KUTYAVERSENY</h2><div>Zseton: <b style="color:#facc15">'+fmt(BR.zs)+'</b> · tét: '+[50,100,250,500].map(b=>'<button class="'+(RACE.bet===b?'g':'')+'" onclick="x20rb('+b+')">'+b+'</button>').join('')+'</div>'+
 '<div id="x20track">'+DOGS.map((d,i)=>'<div class="ln"><span class="dg" id="x20d'+i+'">'+d[1]+'</span><span style="position:absolute;left:46px;top:12px;font-size:13px;opacity:.85">'+d[0]+' (×'+d[2]+')</span></div>').join('')+'<div class="fin"></div></div>'+
 '<div>Melyik kutyára fogadsz? '+DOGS.map((d,i)=>'<button class="'+(RACE.pick===i?'y':'')+'" onclick="x20rp('+i+')">'+d[1]+' '+d[0]+'</button>').join('')+'</div>'+
 '<div id="x20rr" style="min-height:26px;font-size:19px;color:#fde68a;text-align:center">'+(res||'')+'</div><div style="text-align:center"><button class="y" id="x20rgo" style="font-size:20px;padding:10px 30px" onclick="x20race()">🏁 RAJT! ('+RACE.bet+' 🪙)</button></div>')}
window.x20races=showRace;window.x20rb=b=>{if(!RACE.on){RACE.bet=b;showRace()}};window.x20rp=i=>{if(!RACE.on){RACE.pick=i;showRace()}};
window.x20race=()=>{if(RACE.on)return;{const K=window._x10k,er=K?K.canBet(RACE.bet):(BR.zs<RACE.bet?'Nincs elég zseton!':'');if(er){showRace(er);return}if(K)K.LIM.lost+=RACE.bet,K.SV('k3x10lim',K.LIM)}BR.zs-=RACE.bet;saveAll();RACE.on=true;$$('x20rgo').disabled=true;
 const W=$$('x20track').clientWidth-80;const pos=DOGS.map(()=>0);// esély: kisebb szorzó = gyorsabb átlag
 const base=DOGS.map(d=>1/d[2]);const tot=base.reduce((a,b)=>a+b);
 const iv=setInterval(()=>{if(!RACE.on||!$$('x20d0')){clearInterval(iv);RACE.on=false;return}let win=-1;
  DOGS.forEach((d,i)=>{pos[i]+=RN(0,9)+base[i]/tot*14+(Math.random()<.04?RN(10,25):0);if(pos[i]>=W&&win<0)win=i;$$('x20d'+i).style.left=Math.min(W,pos[i])+'px'});
  if(win>=0){clearInterval(iv);RACE.on=false;const d=DOGS[win];let r='🏁 '+d[1]+' '+d[0]+' nyert! ';if(win===RACE.pick){const w=Math.round(RACE.bet*d[2]);BR.zs+=w;saveAll();r+='🎉 +'+w+' 🪙';try{sfx('drop')}catch(e){}}else r+='Most nem jött be.';const rr=$$('x20rr');if(rr)rr.innerHTML=r;const b=$$('x20rgo');if(b)b.disabled=false}},90)};

// =====================================================================
// 10) LOTTÓ
// =====================================================================
let LT=[];
async function showLotto(msg){const r=await api('lotto');if(r.wins&&r.wins.length)r.wins.forEach(w=>{BR.zs=(BR.zs|0)+w.prize;saveAll();toast('🎰 LOTTÓ ('+w.day+'): '+w.h+' találat! +'+fmt(w.prize)+' 🪙')});
 const last=r.last?'<div class="x20row"><span>Legutóbbi húzás ('+esc(r.last.day)+'): <b style="color:#facc15">'+r.last.nums.join(' · ')+'</b></span><small>'+r.last.cnt+' szelvény · '+r.last.winners.length+' nyertes</small></div>'+(r.last.winners.slice(0,8).map(w=>'<div style="font-size:14px">🏆 '+esc(w.n)+': '+w.h+' találat, +'+fmt(w.prize)+' 🪙</div>').join('')):'<div style="opacity:.6">Még nem volt húzás.</div>';
 openM('<h2>🎰 NAPI LOTTÓ</h2><div style="opacity:.8;font-size:14px">Válassz 5 számot 1–30 között. Szelvény: <b>100 🪙</b>, naponta legfeljebb 5. <b>Sorsolás minden este 20:00-kor</b> a szerveren, az összes játékos szelvényéből.<br>Nyeremény: 5 találat 50 000 · 4 találat 2 500 · 3 találat 300 · 2 találat 30 zseton</div>'+
 (msg?'<div style="color:#fca5a5;margin-top:6px">'+esc(msg)+'</div>':'')+
 (r.drawn?'<div style="margin:8px 0;color:#86efac">A mai sorsolás lement. Holnap reggeltől vehetsz új szelvényt.</div>':'<div style="margin:8px 0">'+Array.from({length:30},(_,i)=>'<button class="x20num '+(LT.includes(i+1)?'on':'')+'" onclick="x20ln('+(i+1)+')">'+(i+1)+'</button>').join('')+'</div><button onclick="x20lr()">🎲 VÉLETLEN</button><button class="y" '+(LT.length===5?'':'disabled')+' onclick="x20lb()">SZELVÉNY VÉTELE (100 🪙)</button>')+
 '<h3>Mai szelvényeid ('+(r.mine||[]).length+'/5) · ma összesen '+(r.pool||0)+' szelvény</h3>'+((r.mine||[]).map(t=>'<div class="x20row">🎟️ '+t.join(' · ')+'</div>').join('')||'<div style="opacity:.6">Még nincs.</div>')+'<h3>Eredmények</h3>'+last)}
window.x20lotto=showLotto;
window.x20ln=n=>{const i=LT.indexOf(n);if(i>=0)LT.splice(i,1);else if(LT.length<5)LT.push(n);showLotto()};
window.x20lr=()=>{LT=[];while(LT.length<5){const n=1+Math.floor(Math.random()*30);if(!LT.includes(n))LT.push(n)}showLotto()};
window.x20lb=async()=>{if(BR.zs<100){showLotto('Nincs elég zseton!');return}BR.zs-=100;const r=await api('lotto/buy',{nums:LT});if(r.error){BR.zs+=100;showLotto(r.error);return}saveAll();LT=[];toast('🎟️ Szelvény megvéve! Sorsolás 20:00-kor.');showLotto()};
// nyeremény-ellenőrzés a lobbyban
setInterval(async()=>{if(!tok()||inMatch())return;const r=await api('lotto');if(r.wins&&r.wins.length)r.wins.forEach(w=>{BR.zs=(BR.zs|0)+w.prize;saveAll();toast('🎰 LOTTÓ ('+esc(w.day)+'): '+w.h+' találat!<br>+'+fmt(w.prize)+' 🪙')})},120000);

// =====================================================================
// LOBBY: egy gomb, ami mindent megnyit
// =====================================================================
function hub(){const c=calState();openM('<h2>⭐ KÖZÖSSÉG ÉS JUTALMAK</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px">'+
 [['👥 PROFILOK','x20prof()'],['🛡️ KLÁNOK','x20clan()'],['🏅 RANGSOROLT LISTA','x20rank()'],['📅 30 NAPOS NAPTÁR'+(c.can?' 🔴':''),'x20cal()'],['🔫 SKINEK ÉS TÁNC','x20skin()'],['🐕 KUTYAVERSENY','x20races()'],['🎰 LOTTÓ','x20lotto()'],['🎬 VISSZAJÁTSZÁS','x20replay()']].map(([t,f])=>'<button class="y" style="padding:16px;font-size:18px" onclick="'+f+'">'+t+'</button>').join('')+'</div>'+
 '<div style="margin-top:8px;font-size:14px;opacity:.8">🌋 E heti világesemény: <b>'+EV().n+'</b>: '+EV().d+'</div>')}
window.x20hub=hub;
const di=setInterval(()=>{const d=$$('soDock');if(!d)return;clearInterval(di);if($$('x20B'))return;const b=document.createElement('button');b.id='x20B';b.className='hot';b.onclick=hub;d.appendChild(b);
 const upd=()=>{b.textContent='⭐ KÖZÖSSÉG'+(calState().can?' 🔴':'')};upd();setInterval(upd,30000)},800);

// =====================================================================
// 4) HETI VILÁGESEMÉNY · 9) VÁNDORÁRUS · 8) VISSZAJÁTSZÁS · tánc győzelemkor
// =====================================================================
const EVS=[{k:'lava',n:'🌋 Vulkánkitörés',d:'lávatócsák jelennek meg, sebeznek téged és az ellenfeleket is'},{k:'gold',n:'💰 Aranyeső',d:'aranyérmék potyognak az égből, szedd fel őket'},{k:'lowg',n:'🪐 Alacsony gravitáció',d:'nagyokat ugrasz, és lassan esel'},{k:'fog',n:'🌫️ Ködös hét',d:'sűrű köd, közelharcra fel!'}];
const EV=()=>{const f=localStorage.getItem('x20ev');if(f){const e=EVS.find(x=>x.k===f);if(e)return e}const d=new Date(),y=new Date(d.getFullYear(),0,1),w=Math.floor(((d-y)/864e5+y.getDay())/7);return EVS[w%EVS.length]};
const evEl=document.createElement('div');evEl.id='x20Ev';document.body.appendChild(evEl);
const shopEl=document.createElement('div');shopEl.id='x20Shop';document.body.appendChild(shopEl);
let X=null;
function rp(){const R=G.arh?400:48;for(let i=0;i<400;i++){const x=RN(-R,R),z=RN(-R,R);if(G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<50&&z>-44)return[x,z]}return[0,0]}
function add(o){scene.add(o);X.objs.push(o);return o}
WP('launch',null,()=>{try{if(X)X.objs.forEach(o=>o.parent&&o.parent.remove(o))}catch(e){}X={objs:[],lava:[],gold:[],t:0,rec:[],vend:null,ev:null,gt:0,fogOld:null};if(typeof G==='undefined'||!G)return;
 setTimeout(()=>{if(!normal()||!X)return;const e=EV();X.ev=e.k;evEl.textContent=e.n+': '+e.d;evEl.style.display='block';setTimeout(()=>evEl.style.display='none',9000);sayX('🌍 HETI ESEMÉNY: '+e.n+'!');
  if(e.k==='lava'){const n=G.arh?14:5;for(let i=0;i<n;i++){const[x,z]=rp();const r=G.arh?RN(4,8):RN(2.5,4);const m=add(new THREE.Mesh(new THREE.CircleGeometry(r,24),new THREE.MeshBasicMaterial({color:0xff4d00})));m.rotation.x=-Math.PI/2;m.position.set(x,.06,z);
   const g=add(new THREE.Mesh(new THREE.CircleGeometry(r*1.25,24),new THREE.MeshBasicMaterial({color:0x7c2d12,transparent:true,opacity:.7})));g.rotation.x=-Math.PI/2;g.position.set(x,.04,z);X.lava.push({x,z,r,m})}}
  if(e.k==='lowg')G.gv=11;
  if(e.k==='fog'&&scene.fog===null){X.fogOld='none';scene.fog=new THREE.Fog(0x9ca3af,8,G.arh?70:45)}else if(e.k==='fog'&&scene.fog){X.fogOld={n:scene.fog.near,f:scene.fog.far,c:scene.fog.color.getHex()};scene.fog.near=8;scene.fog.far=G.arh?70:45;scene.fog.color.setHex(0x9ca3af)}
  // vándorárus
  const[vx,vz]=rp();let m;try{m=person(0x7c3aed,'🧔',1)}catch(er){m=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial({color:0x7c3aed}))}m.position.set(vx,0,vz);add(m);
  const st=add(new THREE.Mesh(new THREE.BoxGeometry(3.2,1,1.4),new THREE.MeshStandardMaterial({color:0x92400e})));st.position.set(vx,.5,vz+1.6);
  const aw=add(new THREE.Mesh(new THREE.BoxGeometry(3.6,.15,2),new THREE.MeshStandardMaterial({color:0xdc2626})));aw.position.set(vx,3,vz+1.2);
  const lb=spr('🛒 VÁNDORÁRUS [E]',2.4,'x');lb.position.set(vx,4.4,vz);add(lb);X.vend={x:vx,z:vz,m};sayX('🛒 Egy vándorárus járja a szigetet: fegyver, pajzs, lőszer meccspénzért!')},3500)});
// vándorárus bolt
const SHOP=[['🛡️ Pajzs +50',1500,g=>{g.sh=Math.min(g.msh,g.sh+50)}],['❤️ Élet +60',1500,g=>{g.hp=Math.min(g.mhp,g.hp+60)}],['💊 Medkit',1200,g=>{g.inv.hp=(g.inv.hp||0)+1}],['🔫 Lőszer (mindenhez)',1000,g=>{g.res=g.res.map((r,i)=>r+(WPN[i]?WPN[i].mag*2:10))}],['⚡ Ulti töltés +50%',2500,g=>{g.ul=Math.min(100,g.ul+50)}],['🎁 Véletlen fegyver',4000,g=>{const n=WPN.map((_,i)=>i).filter(i=>i>0&&!g.own[i]);if(!n.length){g.cash+=4000;sayX('Már minden fegyvered megvan, visszakaptad a pénzt.');return}const i=n[Math.floor(Math.random()*n.length)];g.own[i]=true;g.mag[i]=WPN[i].mag;g.res[i]=(g.res[i]||0)+WPN[i].res;g.wp=i;sayX('🎁 '+WPN[i].e+' '+WPN[i].n+'!')}]];
function shop(){const g=G;openM('<h2>🛒 VÁNDORÁRUS</h2><div>Meccspénzed: <b style="color:#facc15">'+fmt(Math.floor(g.cash))+' Ft</b> · A játék közben is fut, siess!</div>'+SHOP.map((s,i)=>'<div class="x20row"><span>'+s[0]+'</span><button class="'+(g.cash>=s[1]?'y':'')+'" '+(g.cash>=s[1]?'':'disabled')+' onclick="x20buy('+i+')">'+fmt(s[1])+' Ft</button></div>').join(''))}
window.x20buy=i=>{const g=G,s=SHOP[i];if(!g||g.cash<s[1])return;g.cash-=s[1];try{s[2](g)}catch(e){}try{sfx('drop')}catch(e){}shop()};
window.x20near=()=>{if(!X||!X.vend||!normal())return false;if(Math.hypot(X.vend.x-G.x,X.vend.z-G.z)<4){shop();return true}return false};
WP('update',null,a=>{if(typeof G==='undefined'||!G||G.over||!X)return;const g=G,dt=Math.min(.1,a[0]||.016);X.t+=dt;applySkin();
 // visszajátszás rögzítése
 if(g.phase==='play'&&X.t-(X.rt||0)>.33){X.rt=X.t;X.rec.push({p:[+g.x.toFixed(1),+g.z.toFixed(1)],e:(g.en||[]).filter(e=>!e.dead).slice(0,60).map(e=>[+e.x.toFixed(1),+e.z.toFixed(1)]),k:g.kills,hp:Math.round(g.hp)});if(X.rec.length>3600)X.rec.shift()}
 // láva
 X.lava.forEach(l=>{l.m.material.color.setHSL(.04+Math.sin(X.t*3+l.x)*.02,1,.5);if(Math.hypot(g.x-l.x,g.z-l.z)<l.r&&g.y<.6)hurt(22*dt,true);g.en.forEach(e=>{if(!e.dead&&Math.hypot(e.x-l.x,e.z-l.z)<l.r){try{dmgE(e,30*dt,false)}catch(er){}}})});
 // aranyeső
 if(X.ev==='gold'&&g.phase==='play'){X.gt-=dt;if(X.gt<=0&&X.gold.length<25){X.gt=1.2;const a=Math.random()*6.28,r=RN(4,25);const x=g.x+Math.cos(a)*r,z=g.z+Math.sin(a)*r;const m=add(new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.12,16),new THREE.MeshStandardMaterial({color:0xfacc15,metalness:.9,roughness:.2,emissive:0x5a3e00})));m.rotation.x=Math.PI/2;m.position.set(x,18,z);X.gold.push({m,x,z,y:18})}
  X.gold=X.gold.filter(c=>{c.y=Math.max(.7,c.y-dt*9);c.m.position.y=c.y;c.m.rotation.z+=dt*4;if(Math.hypot(c.x-g.x,c.z-g.z)<1.6&&c.y<3){g.cash+=600;try{ftx(c.x,c.z,'+600 💰','');tn(1300,'sine',.06,.06)}catch(e){}scene.remove(c.m);return false}return true})}
 // árus felirat
 if(X.vend&&normal()){const d=Math.hypot(X.vend.x-g.x,X.vend.z-g.z);X.vend.m.rotation.y=Math.atan2(g.x-X.vend.x,g.z-X.vend.z);SH_(shopEl,'<b>[E]</b> Vásárlás a vándorárusnál');SD_(shopEl,d<4?'block':'none')}else SD_(shopEl,'none')});
// meccs vége: gravitáció/köd vissza, győzelmi tánc, visszajátszás mentése
let LASTREC=null;
WP('end',a=>{if(!X||!G||G.over)return;LASTREC={rec:X.rec.slice(),arh:!!G.arh,win:!!a[0],lava:X.lava.map(l=>[l.x,l.z,l.r])};X.danceWin=!!a[0]&&normal()},
 ()=>{if(!X)return;shopEl.style.display='none';evEl.style.display='none';try{if(G)G.gv=undefined}catch(e){}
  if(X.fogOld){try{if(X.fogOld==='none')scene.fog=null;else{scene.fog.near=X.fogOld.n;scene.fog.far=X.fogOld.f;scene.fog.color.setHex(X.fogOld.c)}}catch(e){}X.fogOld=null}
  if(X.danceWin){X.danceWin=false;const r=$$('res');if(r){r.style.visibility='hidden';danceRun(false,()=>{r.style.visibility=''})}}
  setTimeout(()=>{const rb=$$('rb');if(rb&&!$$('x20rpB')&&LASTREC&&LASTREC.rec.length>3){const b=document.createElement('button');b.id='x20rpB';b.className='b';b.style.cssText='margin-top:8px;background:linear-gradient(135deg,#7dd3fc,#0284c7);color:#fff';b.textContent='🎬 VISSZAJÁTSZÁS';b.onclick=()=>window.x20replay();rb.appendChild(b)}},1500)});
setInterval(()=>{const r=$$('res'),rb=$$('rb');if(r&&rb&&r.classList.contains('on')&&!$$('x20rpB')&&LASTREC&&LASTREC.rec.length>3){const b=document.createElement('button');b.id='x20rpB';b.className='b';b.style.cssText='margin-top:8px;background:linear-gradient(135deg,#7dd3fc,#0284c7);color:#fff';b.textContent='🎬 VISSZAJÁTSZÁS';b.onclick=()=>window.x20replay();rb.appendChild(b)}},700);
// visszajátszás-lejátszó
window.x20replay=()=>{if(!LASTREC||LASTREC.rec.length<4){openM('<h2>🎬 VISSZAJÁTSZÁS</h2><div style="opacity:.7">Még nincs felvett meccs. Játssz egyet, utána itt visszanézheted!</div>');return}
 const R=LASTREC;openM('<h2>🎬 VISSZAJÁTSZÁS (utolsó meccs)</h2><canvas id="x20rc" width="520" height="520" style="display:block;margin:0 auto;border-radius:12px;max-width:100%;background:#0c4a6e"></canvas><div style="display:flex;align-items:center;gap:8px;margin-top:6px"><button class="y" id="x20pp">⏸</button><input type="range" id="x20rs" min="0" max="'+(R.rec.length-1)+'" value="0" style="flex:1"><select id="x20sp" style="background:#0008;color:#fff;border-radius:8px;padding:5px"><option value="1">1×</option><option value="2">2×</option><option value="4" selected>4×</option><option value="8">8×</option></select><span id="x20rt" style="min-width:150px;text-align:right"></span></div><div style="font-size:13px;opacity:.7;margin-top:4px">🟡 te · 🔴 ellenfelek · 🟧 láva · a sárga vonal az útvonalad</div>');
 const c=$$('x20rc'),x=c.getContext('2d'),S_=520;let mnx,mxx,mnz,mxz;if(R.arh&&typeof HU!=='undefined'){mnx=Math.min(...HU.map(p=>p[0]));mxx=Math.max(...HU.map(p=>p[0]));mnz=Math.min(...HU.map(p=>p[1]));mxz=Math.max(...HU.map(p=>p[1]))}else{mnx=mnz=-62;mxx=mxz=62}
 const sc=(S_-20)/Math.max(mxx-mnx,mxz-mnz),P=(px,pz)=>[10+(px-mnx)*sc,10+(pz-mnz)*sc];
 const bg=document.createElement('canvas');bg.width=bg.height=S_;const b=bg.getContext('2d');b.fillStyle='#0c4a6e';b.fillRect(0,0,S_,S_);b.fillStyle='#3f6212';b.beginPath();if(R.arh&&typeof HU!=='undefined'){HU.forEach((p,i)=>{const[a,q]=P(p[0],p[1]);i?b.lineTo(a,q):b.moveTo(a,q)});b.closePath()}else{const[a,q]=P(0,0);b.arc(a,q,60*sc,0,7)}b.fill();
 b.fillStyle='#f97316aa';R.lava.forEach(l=>{const[a,q]=P(l[0],l[1]);b.beginPath();b.arc(a,q,l[2]*sc,0,7);b.fill()});
 let i=0,play=true,acc=0,last=performance.now();const sl=$$('x20rs'),pp=$$('x20pp'),sp=$$('x20sp'),rt=$$('x20rt');sl.oninput=()=>{i=+sl.value};pp.onclick=()=>{play=!play;pp.textContent=play?'⏸':'▶';if(play&&i>=R.rec.length-1)i=0};
 (function f(){if(!$$('x20rc'))return;const n=performance.now();if(play){acc+=(n-last)/1000*(+sp.value)*3;while(acc>=1){acc--;if(i<R.rec.length-1)i++;else{play=false;pp.textContent='▶'}}}last=n;
  x.drawImage(bg,0,0);const fr=R.rec[i];x.strokeStyle='#fde68a';x.lineWidth=2;x.beginPath();for(let j=0;j<=i;j++){const[a,q]=P(...R.rec[j].p);j?x.lineTo(a,q):x.moveTo(a,q)}x.stroke();
  x.fillStyle='#ef4444';fr.e.forEach(e=>{const[a,q]=P(e[0],e[1]);x.beginPath();x.arc(a,q,3.5,0,7);x.fill()});
  const[a,q]=P(...fr.p);x.fillStyle='#facc15';x.strokeStyle='#000';x.lineWidth=2;x.beginPath();x.arc(a,q,6,0,7);x.fill();x.stroke();
  sl.value=i;const sec=Math.round(i/3);rt.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+' · 💀 '+fr.k+' · ❤️ '+Math.max(0,fr.hp);
  requestAnimationFrame(f)})()};
window._x20X=()=>X;console.log('extra20 betöltve');
})();
