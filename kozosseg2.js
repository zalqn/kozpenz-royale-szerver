// kozosseg2.js – (A, 11-09) 🤝 KÖZÖSSÉG+ : levelezés (offline is), heti közös esemény-sáv, meghívó-jutalom, kreatív verseny,
// e-mail a fiókhoz + elfelejtett jelszó (?reset=token), ajándékok átvétele (szerver által jóváírt Ft/zseton),
// mobil-optimalizálás (könnyített grafika, nagyobb gombok, fekvő mód figyelmeztetés), teljesítmény-napló (alacsony FPS → szerver).
// Szerver: server/mod_kozos.js (/api/k2/*, /api/reset/*). Debug: _k2
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const acc=()=>window.ACC&&ACC.user&&!ACC.guest&&ACC.token?ACC:null;
const fmt=n=>Math.round(+n||0).toLocaleString('hu-HU');
async function api(p,b){const a=acc();const r=await fetch(p,{method:b?'POST':'GET',headers:Object.assign(a?{Authorization:'Bearer '+a.token}:{},b?{'Content-Type':'application/json'}:{}),body:b?JSON.stringify(b):undefined});let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j}
const say=t=>{try{window.say?say(t):console.log(t)}catch(e){}};
const K={st:null};window._k2=K;

const css=document.createElement('style');css.textContent=`
#k2dock{position:fixed;right:14px;top:64px;z-index:60;display:none;gap:6px}
#k2dock button{all:unset;cursor:pointer;position:relative;padding:7px 11px;border-radius:12px;background:#0f172acc;border:1px solid #ffffff2a;color:#f1f5f9;font:700 14px Rajdhani,Arial,sans-serif;backdrop-filter:blur(6px)}
#k2dock button:hover{background:#1e293b}
#k2dock b{position:absolute;top:-6px;right:-6px;min-width:18px;height:18px;border-radius:9px;background:#ef4444;color:#fff;font:700 11px/18px Arial;text-align:center;padding:0 4px;display:none}
#k2ev{position:fixed;left:50%;top:8px;transform:translateX(-50%);z-index:59;display:none;width:min(420px,70vw);padding:5px 10px;border-radius:12px;background:#0f172acc;border:1px solid #ffd23f55;color:#fde68a;font:700 12px Rajdhani,Arial,sans-serif;cursor:pointer;text-align:center}
#k2ev i{display:block;height:6px;border-radius:3px;background:#ffffff22;margin-top:3px;overflow:hidden}#k2ev i s{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#fde047)}
#k2p{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;background:#0009}
#k2p.on{display:flex}
#k2p .w{width:min(760px,94vw);max-height:88vh;display:flex;flex-direction:column;border-radius:18px;background:#0f172a;border:1px solid #ffffff22;color:#e2e8f0;font:14px Rajdhani,Arial,sans-serif;box-shadow:0 20px 60px #000a}
#k2p header{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #ffffff15}#k2p header h2{margin:0;font-size:20px;color:#ffd23f;flex:1}
#k2p nav{display:flex;gap:6px;padding:8px 12px;flex-wrap:wrap}#k2p nav button,#k2p .b{all:unset;cursor:pointer;padding:6px 12px;border-radius:10px;background:#ffffff12;color:#e2e8f0;font-weight:700}
#k2p nav button.on{background:#ffd23f;color:#111}#k2p .b:hover{background:#ffffff25}#k2p .b.g{background:#16a34a}#k2p .b.r{background:#b91c1c}
#k2p main{padding:12px 16px;overflow:auto}#k2p input,#k2p textarea{box-sizing:border-box;width:100%;padding:8px;border-radius:10px;border:1px solid #ffffff2a;background:#1e293b;color:#fff;font:14px Arial;margin:4px 0}
#k2p .m{padding:8px 10px;border-radius:10px;background:#ffffff0c;margin:6px 0}#k2p .m.u{border-left:3px solid #ffd23f}#k2p .m small{color:#94a3b8}
#k2p .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}#k2p .grid .m img{width:100%;border-radius:8px;display:block}
#k2rst{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#000b}
#k2rst div{background:#0f172a;color:#e2e8f0;padding:20px;border-radius:16px;width:min(360px,90vw);font:15px Arial;border:1px solid #ffd23f55}
#k2rst input{box-sizing:border-box;width:100%;padding:9px;margin:6px 0;border-radius:9px;border:1px solid #fff3;background:#1e293b;color:#fff}
#k2rst button{padding:8px 14px;border:0;border-radius:9px;background:#ffd23f;font-weight:700;cursor:pointer;margin-right:6px}
#k2forgot{display:block;margin:6px auto 0;color:#93c5fd;font:13px Arial;cursor:pointer;text-align:center;text-decoration:underline}
body.k2mob button,body.k2mob .btn{min-height:40px}body.k2mob #k2dock button{padding:10px 14px;font-size:16px}
#k2land{position:fixed;inset:0;z-index:99998;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:#020617f2;color:#fde68a;font:700 20px Rajdhani,Arial,sans-serif;text-align:center}
#k2land span{font-size:54px;animation:k2rot 1.6s ease-in-out infinite}@keyframes k2rot{50%{transform:rotate(90deg)}}
#k2land button{all:unset;cursor:pointer;padding:8px 14px;border-radius:10px;background:#ffffff1a;font-size:14px;color:#e2e8f0}
`;document.head.appendChild(css);

// ---------------- dokk + esemény-sáv (csak lobbyban, belépve) ----------------
const dock=document.createElement('div');dock.id='k2dock';dock.innerHTML='<button id="k2mailB" title="Levelek">✉️<b id="k2mailN"></b></button><button id="k2comB" title="Közösség+ (meghívó, verseny, ajándék)">🤝<b id="k2giftN"></b></button>';
document.body.appendChild(dock);
const evb=document.createElement('div');evb.id='k2ev';document.body.appendChild(evb);
$('k2mailB').onclick=()=>open('mail');$('k2comB').onclick=()=>open(K.st&&K.st.gifts.length?'gift':'ev');evb.onclick=()=>open('ev');
const inLobby=()=>{const lb=$('lb');if(!lb||!lb.classList.contains('on'))return false;const vs=$('vs2');return !(vs&&vs.classList.contains('on'))};
function badge(id,n){const b=$(id);if(!b)return;b.textContent=n>99?'99+':n;b.style.display=n?'block':'none'}
async function refresh(){if(!acc())return;try{K.st=await api('/api/k2/state');badge('k2mailN',K.st.unread);badge('k2giftN',K.st.gifts.length);
 const e=K.st.ev;evb.innerHTML=esc(e.title)+' — '+fmt(e.cur)+' / '+fmt(e.goal)+(e.done?' ✅':'')+(e.mine?' · te: '+fmt(e.mine):'')+'<i><s style="width:'+Math.min(100,e.cur/e.goal*100)+'%"></s></i>'}catch(e){}}
setInterval(()=>{const on=!!acc()&&inLobby()&&!document.querySelector('#k2p.on');dock.style.display=on?'flex':'none';evb.style.display=on&&K.st?'block':'none'},700);
let who='';setInterval(()=>{const a=acc(),n=a?a.user.name:'';if(n!==who){who=n;K.st=null;if(n)refresh()}},1500);
setInterval(refresh,45000);

// ---------------- panel ----------------
const P=document.createElement('div');P.id='k2p';P.innerHTML='<div class="w"><header><h2>🤝 KÖZÖSSÉG+</h2><button class="b" id="k2x">✖</button></header><nav>'+
 [['mail','✉️ Levelek'],['ev','🎯 Heti esemény'],['ct','🏅 Kreatív verseny'],['inv','🎁 Meghívó'],['gift','🎀 Ajándékok'],['acc','👤 Fiók / e-mail']].map(([k,l])=>'<button data-k="'+k+'">'+l+'</button>').join('')+'</nav><main></main></div>';
document.body.appendChild(P);
['keydown','keyup','keypress'].forEach(ev=>P.addEventListener(ev,e=>{if(e.key==='Escape'&&ev==='keydown'){close();}e.stopPropagation()}));
$('k2x').onclick=close;P.onclick=e=>{if(e.target===P)close()};
P.querySelector('nav').onclick=e=>{const b=e.target.closest('button');if(b)go(b.dataset.k)};
const M=P.querySelector('main');
function open(k){if(!acc()){say('🤝 A Közösség+ funkciókhoz jelentkezz be!');return}P.classList.add('on');try{document.pointerLockElement&&document.exitPointerLock()}catch(e){}go(k||'mail')}
function close(){P.classList.remove('on');refresh()}
async function go(k){P.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));M.innerHTML='<i>Betöltés…</i>';M.onclick=null;
 try{await TAB[k]()}catch(e){M.innerHTML='<p>⛔ '+esc(e.message)+'</p>'}}
const TAB={
 async mail(){const r=await api('/api/k2/mail');
  M.innerHTML='<div class="m"><b>Új levél</b> <small>(offline játékosnak is – belépéskor látja)</small><input id="k2to" placeholder="Címzett neve" maxlength="16"><textarea id="k2tx" rows="3" maxlength="500" placeholder="Üzenet (max 500 karakter)"></textarea><button class="b g" data-a="send">📨 Küldés</button> <button class="b" data-a="all">✔ Mind olvasott</button></div>'+
  (r.list.length?r.list.map(m=>'<div class="m'+(m.rd?'':' u')+'"><b>'+esc(m.from_n)+'</b> <small>'+new Date(m.t).toLocaleString('hu-HU')+'</small><div style="white-space:pre-wrap;margin:4px 0">'+esc(m.txt)+'</div>'+(m.from_n[0]!=='★'?'<button class="b" data-a="re" data-n="'+esc(m.from_n)+'">↩ Válasz</button> ':'')+(m.rd?'':'<button class="b" data-a="rd" data-id="'+m.id+'">✔ Olvasott</button> ')+'<button class="b r" data-a="del" data-id="'+m.id+'">🗑</button></div>').join(''):'<p><i>Nincs leveled.</i></p>');
  M.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
   try{if(a==='send'){await api('/api/k2/mail/send',{to:$('k2to').value.trim(),txt:$('k2tx').value});say('📨 Levél elküldve');}
    else if(a==='re'){$('k2to').value=b.dataset.n;$('k2tx').focus();return}
    else if(a==='rd')await api('/api/k2/mail/read',{id:+b.dataset.id});else if(a==='all')await api('/api/k2/mail/read',{id:0});else if(a==='del')await api('/api/k2/mail/del',{id:+b.dataset.id});
    refresh();go('mail')}catch(er){say('⛔ '+er.message)}}},
 async ev(){await refresh();const e=K.st.ev;M.innerHTML='<div class="m"><h3 style="margin:0 0 6px;color:#ffd23f">'+esc(e.title)+'</h3>A szerver számolja az összes játékos eredményét (bejelentkezett meccsek).<div id="k2ev2" style="margin:10px 0"><div style="height:16px;border-radius:8px;background:#ffffff1a;overflow:hidden"><div style="height:100%;width:'+Math.min(100,e.cur/e.goal*100)+'%;background:linear-gradient(90deg,#f59e0b,#fde047)"></div></div></div><b>'+fmt(e.cur)+' / '+fmt(e.goal)+'</b> · a te hozzájárulásod: <b>'+fmt(e.mine)+'</b><br>Jutalom teljesítéskor minden résztvevőnek: <b>250 000 Ft + 300 zseton</b>.<br><small>Vége: '+new Date(e.ends).toLocaleString('hu-HU')+'</small>'+(e.done?'<p>✅ <b>Teljesítve!</b> A jutalmat az Ajándékok fülön veheted át.</p>':'')+'</div>'},
 async ct(){const r=await api('/api/k2/contest');
  M.innerHTML='<div class="m">🏅 <b>Heti kreatív verseny</b> – nevezz egy saját Közgram-fotóddal vagy megosztott pályáddal, és szavazz (hetente 3 szavazat). A győztes: <b>500 000 Ft + 500 zseton</b>. Vége: '+new Date(r.ends).toLocaleString('hu-HU')+(r.last?'<br>Előző győztes: <b>'+esc(r.last.n)+'</b> – '+esc(r.last.title)+' ('+r.last.v+' szavazat)':'')+
  '<br>Nevezés: <select id="k2ce" style="padding:6px;border-radius:8px;background:#1e293b;color:#fff;border:1px solid #fff3">'+r.mine.gram.map(x=>'<option value="gram:'+x.id+'">📸 '+esc(x.title||'Fotó')+'</option>').join('')+r.mine.map.map(x=>'<option value="map:'+x.id+'">🗺️ '+esc(x.title)+'</option>').join('')+'</select> <button class="b g" data-a="enter">Nevezek</button>'+(r.mine.gram.length+r.mine.map.length?'':' <small>(előbb posztolj fotót a Közgramra vagy oszd meg egy pályádat)</small>')+'<br><small>Hátralévő szavazat: '+r.votesLeft+'</small></div><div class="grid">'+
  (r.ent.length?r.ent.map(x=>'<div class="m">'+(x.img?'<img src="'+esc(x.img)+'" alt="">':'<div style="height:90px;display:flex;align-items:center;justify-content:center;font-size:40px">🗺️</div>')+'<b>'+esc(x.title)+'</b><br><small>'+esc(x.n)+(x.kind==='map'?' · '+x.cells+' elem':'')+'</small><br>'+(x.mine?'<small>a te nevezésed</small> · ':'<button class="b'+(x.my?' g':'')+'" data-a="vote" data-k="'+x.kind+'" data-id="'+x.id+'">'+(x.my?'✔ Szavaztál':'👍 Szavazok')+'</button> ')+'<b>'+x.v+'</b> 👍</div>').join(''):'<p><i>Még nincs nevezés a héten.</i></p>')+'</div>';
  M.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;try{if(b.dataset.a==='enter'){const v=($('k2ce')||{}).value;if(!v)return;const [kind,id]=v.split(':');await api('/api/k2/contest/enter',{kind,id:+id});say('🏅 Nevezés elküldve')}else await api('/api/k2/contest/vote',{kind:b.dataset.k,id:+b.dataset.id});go('ct')}catch(er){say('⛔ '+er.message)}}},
 async inv(){await refresh();const i=K.st.invite;M.innerHTML='<div class="m">🎁 <b>Barát-meghívó</b><br>A meghívókódod: <b style="font-size:20px;color:#ffd23f">'+esc(i.code)+'</b> <button class="b" data-a="cp">📋 Másolás</button><br>Ha egy új játékos (az első 7 napjában) beváltja: ő <b>100 000 Ft + 100 zseton</b>, te <b>150 000 Ft + 150 zseton</b> jutalmat kapsz. Eddig beváltották: <b>'+i.count+'</b> / 20</div>'+
  '<div class="m">'+(i.used?'✅ Már beváltottad <b>'+esc(i.used)+'</b> meghívóját (fiókonként egyszer).':'Kaptál meghívókódot? <input id="k2ic" placeholder="Meghívó neve" maxlength="16"><button class="b g" data-a="use">Beváltás</button>')+'</div>';
  M.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='cp'){try{await navigator.clipboard.writeText(i.code);say('📋 Kód másolva')}catch(er){}return}
   try{await api('/api/k2/invite',{code:$('k2ic').value.trim()});say('🎁 Meghívó beváltva – vedd át az ajándékot!');go('gift')}catch(er){say('⛔ '+er.message)}}},
 async gift(){await refresh();const g=K.st.gifts;M.innerHTML=g.length?g.map(x=>'<div class="m">🎀 <b>'+esc(x.why)+'</b><br>'+(x.ft?fmt(x.ft)+' Ft ':'')+(x.zs?'· '+fmt(x.zs)+' zseton':'')+'<br><button class="b g" data-id="'+x.id+'">Átveszem</button></div>').join(''):'<p><i>Nincs átvehető ajándék.</i></p>';
  M.onclick=async e=>{const b=e.target.closest('[data-id]');if(!b)return;b.disabled=true;try{const r=await api('/api/k2/claim',{id:b.dataset.id});credit(r.ft,r.zs);say('🎀 Jóváírva: '+fmt(r.ft)+' Ft, '+fmt(r.zs)+' zseton');go('gift')}catch(er){say('⛔ '+er.message)}}},
 async acc(){await refresh();M.innerHTML='<div class="m">👤 <b>'+esc(acc().user.name)+'</b><br>E-mail cím (nem kötelező – csak a jelszó-visszaállításhoz használjuk, más nem látja):<input id="k2em" type="email" maxlength="120" value="'+esc(K.st.email)+'" placeholder="pelda@mail.hu"><button class="b g" data-a="em">💾 Mentés</button> <button class="b r" data-a="rm">Törlés</button></div>';
  M.onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;try{await api('/api/k2/email',{email:b.dataset.a==='rm'?'':$('k2em').value.trim()});say('💾 E-mail mentve');go('acc')}catch(er){say('⛔ '+er.message)}}}
};
// szerver által engedélyezett jóváírás (a felhőmentés pénz-őre ezt már elfogadja)
function credit(ft,zs){try{if(ft&&typeof S!=='undefined'){S.c+=ft;typeof save==='function'&&save()}}catch(e){}
 try{if(zs&&typeof BR!=='undefined'&&BR){BR.zs=(BR.zs||0)+zs;typeof st!=='undefined'&&st.s('k3br',BR)}}catch(e){}
 try{window._cloud&&_cloud.up&&setTimeout(()=>_cloud.up(true),500)}catch(e){}}
// kaszinó/meccs-eredmény jelzés hook (más modulok hívhatják): a szerver korláttal engedélyezi a növekedést
K.earn=(src,ft,zs)=>acc()?api('/api/k2/earn',{src,ft,zs}).catch(()=>null):Promise.resolve(null);
K.open=open;K.refresh=refresh;

// lobby2 gyűjtőmenübe
const addLb=()=>{if(window._lb2&&_lb2.add){_lb2.add({ic:'🤝',tx:'Közösség+',c:'com',fn:()=>open('ev'),kw:'levél meghívó verseny esemény ajándék'});_lb2.add({ic:'✉️',tx:'Levelek',c:'com',fn:()=>open('mail'),kw:'posta üzenet'});return true}};
if(!addLb()){const t=setInterval(()=>{if(addLb())clearInterval(t)},1000);setTimeout(()=>clearInterval(t),20000)}

// ---------------- jelszó-visszaállítás ----------------
function rstDialog(tok){const d=document.createElement('div');d.id='k2rst';d.innerHTML='<div><h3 style="margin-top:0;color:#ffd23f">🔑 Új jelszó</h3><input id="k2p1" type="password" placeholder="Új jelszó (min. 6)" autocomplete="new-password"><input id="k2p2" type="password" placeholder="Még egyszer" autocomplete="new-password"><p id="k2pm" style="min-height:18px;color:#fca5a5"></p><button id="k2pok">Mentés</button><button id="k2pno" style="background:#334155;color:#fff">Mégse</button></div>';
 document.body.appendChild(d);d.addEventListener('keydown',e=>e.stopPropagation());
 const end=()=>{d.remove();history.replaceState(null,'',location.pathname)};$('k2pno').onclick=end;
 $('k2pok').onclick=async()=>{const a=$('k2p1').value,b=$('k2p2').value;if(a!==b){$('k2pm').textContent='A két jelszó nem egyezik.';return}
  try{const r=await api('/api/reset/do',{token:tok,pass:a});d.firstChild.innerHTML='<h3 style="color:#86efac">✅ Kész!</h3><p>Új jelszó beállítva ('+esc(r.name)+'). Most már beléphetsz.</p><button id="k2pno2">OK</button>';$('k2pno2').onclick=end}catch(e){$('k2pm').textContent=e.message}}}
const rt=new URLSearchParams(location.search).get('reset');if(rt&&/^[0-9a-f]{40}$/.test(rt))setTimeout(()=>rstDialog(rt),800);
K.rstDialog=rstDialog;
setInterval(()=>{const au=$('auth');if(!au||$('k2forgot'))return;const box=au.querySelector('.box')||au;const a=document.createElement('a');a.id='k2forgot';a.textContent='Elfelejtett jelszó?';box.appendChild(a);
 a.onclick=async()=>{const n=prompt('Fióknév, amihez új jelszót kérsz:');if(!n)return;try{const r=await api('/api/reset/req',{name:n.trim()});alert(r.msg)}catch(e){alert('⛔ '+e.message)}}},1500);

// ---------------- 27. mobil ----------------
const MOB=matchMedia('(pointer:coarse)').matches&&navigator.maxTouchPoints>0&&Math.min(screen.width,screen.height)<900;K.mob=MOB;
if(MOB){document.body.classList.add('k2mob');
 try{if(!localStorage.getItem('k2mobInit')){const x=JSON.parse(localStorage.getItem('k3extra')||'{}');x.shadows=false;x.res=Math.min(x.res||1,.7);localStorage.setItem('k3extra',JSON.stringify(x));localStorage.setItem('k2mobInit','1');
  try{if(typeof ren!=='undefined'&&ren){ren.shadowMap.enabled=false;ren.setPixelRatio(.7*Math.min(1,devicePixelRatio))}}catch(e){}say('📱 Mobil: könnyített grafika bekapcsolva (Beállításokban visszaállítható)')}}catch(e){}
 const L=document.createElement('div');L.id='k2land';L.innerHTML='<span>📱</span>Fordítsd el a telefont fekvő módba!<button>Így is jó</button>';document.body.appendChild(L);let skip=false;L.querySelector('button').onclick=()=>{skip=true;L.style.display='none'};
 const chk=()=>{L.style.display=!skip&&innerHeight>innerWidth?'flex':'none'};addEventListener('resize',chk);addEventListener('orientationchange',chk);setTimeout(chk,1000)}

// ---------------- 29. teljesítmény-napló ----------------
(function(){let fr=0,t0=performance.now(),low=0,sent=false;
 function gpu(){try{const c=document.createElement('canvas'),g=c.getContext('webgl');if(!g)return 'nincs WebGL';const e=g.getExtension('WEBGL_debug_renderer_info');const r=e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER);const l=g.getExtension('WEBGL_lose_context');l&&l.loseContext();return String(r)}catch(e){return '?'}}
 function loop(t){fr++;if(t-t0>=5000){const fps=fr*1000/(t-t0);fr=0;t0=t;const vis=document.visibilityState==='visible';const play=typeof run!=='undefined'&&run||inLobby();
   if(vis&&play&&fps<24)low++;else low=Math.max(0,low-1);K.fps=Math.round(fps);
   if(low>=3&&!sent){sent=true;const b={fps:Math.round(fps),gpu:gpu(),res:innerWidth+'x'+innerHeight,dpr:devicePixelRatio,mob:MOB,ua:navigator.userAgent,mode:window.GAME_MODE||(inLobby()?'lobby':'?'),mem:navigator.deviceMemory||0,cores:navigator.hardwareConcurrency||0};K.perfSent=b;
    fetch('/api/k2/perf',{method:'POST',headers:Object.assign({'Content-Type':'application/json'},acc()?{Authorization:'Bearer '+acc().token}:{}),body:JSON.stringify(b)}).catch(()=>{})}}
  requestAnimationFrame(loop)}
 requestAnimationFrame(loop)})();
})();
