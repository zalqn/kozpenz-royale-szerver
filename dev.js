// ===== JÁTÉKON BELÜLI CHAT (T) + PARANCSOK: /999 (te vezeted a buszt), /developer, /fly, /additem · ritka sofőr-esély =====
(function(){
const WPf=(n,post,pre)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const css=document.createElement('style');css.textContent=`
#gChat{position:fixed;left:14px;bottom:150px;width:min(420px,60vw);z-index:8;font:600 15px Rajdhani,Arial;color:#fff;pointer-events:none}
#gChat .log div{margin-top:3px;padding:3px 9px;border-radius:8px;background:#0008;text-shadow:0 1px 2px #000;width:fit-content;max-width:100%;transition:opacity .6s}
#gChat .log div.sys{color:#fde047}#gChat .log div.dev{color:#4ade80}
#gChat input{display:none;margin-top:6px;width:100%;box-sizing:border-box;padding:9px 12px;border-radius:10px;border:2px solid #ffd23f;background:#0b1022ee;color:#fff;font:600 16px Rajdhani,Arial;outline:none;pointer-events:auto}
#gChat.on input{display:block}#gChat.on .log div{opacity:1!important}
#addP{position:fixed;inset:0;z-index:12;display:none;align-items:center;justify-content:center;background:#000a;font-family:Rajdhani,Arial;color:#fff}#addP.on{display:flex}
#addP .pn{width:min(860px,94vw);max-height:86vh;overflow:auto;padding:20px;border-radius:20px;background:#0b1022f2;border:1px solid #ffffff22;box-shadow:0 30px 80px #000}
#addP h2{margin:0 0 10px;font:28px 'Luckiest Guy',Impact;color:#4ade80}#addP h3{margin:14px 0 6px;font-size:17px;color:#cbd5e1}
#addP .gr{display:flex;flex-wrap:wrap;gap:6px}#addP button{padding:8px 11px;border-radius:10px;border:1px solid #ffffff22;background:#1e293b;color:#fff;font:700 14px Rajdhani,Arial;cursor:pointer}#addP button:hover{filter:brightness(1.3);transform:translateY(-1px)}
#busDrv{position:fixed;left:50%;top:16%;transform:translateX(-50%);z-index:7;display:none;padding:10px 18px;border-radius:14px;background:linear-gradient(90deg,#f59e0b,#ef4444);font:22px 'Luckiest Guy',Impact;color:#fff;text-shadow:0 2px 3px #0008;box-shadow:0 8px 30px #000a;pointer-events:none;text-align:center}
#busDrv i{display:block;font:700 14px Rajdhani,Arial;font-style:normal}`;document.head.appendChild(css);
const C=document.createElement('div');C.id='gChat';C.innerHTML='<div class="log"></div><input maxlength="120" placeholder="Írj üzenetet… (Enter: küldés · Esc: bezár · /help)">';document.body.appendChild(C);
const log=C.querySelector('.log'),inp=C.querySelector('input');
function msg(t,cls){const d=document.createElement('div');if(cls)d.className=cls;d.textContent=t;log.appendChild(d);while(log.children.length>8)log.firstChild.remove();setTimeout(()=>{d.style.opacity=0},9000)}
window.gameChat=msg;
const me=()=>{try{return (window.ME&&ME.name)||(window.S&&S.u&&S.u.name)||'Te'}catch(e){return 'Te'}};
let chatOn=false;
function openChat(pref){if(!G||!run)return;chatOn=true;C.classList.add('on');inp.value=pref||'';for(const k in keys)keys[k]=false;if(document.pointerLockElement)document.exitPointerLock();inp.focus();setTimeout(()=>inp.focus(),0)}
function closeChat(){if(!chatOn)return;chatOn=false;C.classList.remove('on');inp.blur();for(const k in keys)keys[k]=false;try{if(G&&G.fp&&!(window.escMenu&&escMenu.isOpen))ren.domElement.requestPointerLock()}catch(e){}}
window.gameChatOpen=openChat;
addEventListener('keydown',e=>{if(chatOn||!G||!run||!$('hud').classList.contains('on')||G.over)return;if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 const k=e.key.toLowerCase();if(k==='t'||k==='/'){e.preventDefault();e.stopImmediatePropagation();openChat(k==='/'?'/':'')}},true);
inp.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();closeChat();return}if(e.key==='Enter'){const v=inp.value.trim();closeChat();if(v)send(v)}});
inp.addEventListener('keyup',e=>e.stopPropagation());
const BOTREP=['gg','na ezt figyeld','ki hozta a buszt?','van valakinél pajzs?','LOL','ne lőj, barát vagyok 🙏','minden közpénz az enyém','elmegyek panaszkodni Brüsszelbe'];
function send(v){if(v[0]==='/'){cmd(v.slice(1).trim());return}msg(me()+': '+v);if(Math.random()<.45)setTimeout(()=>{const b=G&&G.en&&G.en.length?pick(G.en):null;msg(((b&&(b.name||b.nm))||'Bot')+': '+pick(BOTREP))},900+Math.random()*1500)}
window.gameCmd=send;
// ---------- parancsok ----------
let DEV=false;
function cmd(c){{const zr=window.zalqnCheat&&zalqnCheat(c);if(zr!==null&&zr!==undefined){msg(zr,'dev');return}}{const xr=window.extraCmd&&extraCmd(c);if(xr!==null&&xr!==undefined){msg(xr,'dev');return}}const n=c.split(/\s+/)[0].toLowerCase();const g=G;
 if(n==='999'){if(!g.brMode){msg('🚌 A buszt csak Battle Royale-ban vezetheted.','sys');return}if(g.phase==='drop')becomeDriver('parancs');else{msg('🚌 A következő meccsen te vezeted a buszt!','sys');window._nextDriver=1}return}
 if(n==='developer'||n==='dev'){DEV=!DEV;msg(DEV?'🛠️ Fejlesztői mód BE · /fly · /additem · /heal':'🛠️ Fejlesztői mód KI','dev');if(!DEV)g.fly=false;return}
 if(n==='help'||n==='parancsok'){msg('Parancsok: /999 · /developer · /fps · /god · /spawn [db] · /tp x z · /time nap|éj · /weather eső|tiszta · /reset igen · /zalqntoken · /zalqnft · /repcsi · /heli · /auto · /robogo · /deszka · /kit név · /mana'+(DEV?' · /fly · /additem · /heal':''),'sys');return}
 if(!DEV){msg('⛔ Ismeretlen parancs vagy nincs jogod. (/developer)','sys');return}
 if(n==='fly'){g.fly=!g.fly;if(g.fly){g.gl=false;if(g.gs)g.gs.visible=false;g._flyY=Math.max(g.y,2)}msg(g.fly?'🕊️ Repülés BE · Space: fel · Shift: le · WASD: irány':'🕊️ Repülés KI','dev');return}
 if(n==='additem'||n==='items'){openAdd();return}
 if(n==='heal'){g.hp=g.mhp;g.sh=g.msh;msg('❤️ Feltöltve','dev');return}
 msg('⛔ Ismeretlen parancs: /'+n,'sys')}
// ---------- /fly ----------
WPf('update',a=>{const g=G,dt=a[0];if(!g)return;if(g.fly){if(g.phase!=='play'){g.fly=false;return}const up=(keys[' ']?1:0)-(keys['shift']?1:0);g._flyY=Math.max(0,Math.min(160,(g._flyY==null?g.y:g._flyY)+up*16*dt));g.y=g._flyY;g.vy=0;g.gl=false}else g._flyY=null});
// ---------- /additem panel ----------
const P=document.createElement('div');P.id='addP';document.body.appendChild(P);
function openAdd(){const R=window._RAR||[{n:'',h:'#fff'}];let h='<div class="pn"><h2>🛠️ TÁRGYAK HOZZÁADÁSA</h2>';
 WPN.forEach((w,i)=>{h+='<h3>'+w.e+' '+w.n+'</h3><div class="gr">'+R.map((r,j)=>'<button data-t="weapon" data-w="'+i+'" data-r="'+j+'" style="border-color:'+r.h+';color:'+r.h+'">'+r.n+'</button>').join('')+'<button data-t="ammo1" data-w="'+i+'">🔫 +lőszer</button></div>'});
 h+='<h3>🎒 Egyéb</h3><div class="gr">'+[['ammo','🔫 Lőszer (mind)'],['medkit','❤️ Medkit'],['shieldS','🛡️ Kis pajzs +25'],['shieldB','🛡️ Nagy pajzs +50'],['beer','🍺 Sör'],['mats','🪵 Nyersanyag +60'],['mats500','🪵 Nyersanyag +500'],['heal','💖 Teljes gyógyítás'],['all','⭐ MINDEN (mítikus fegyverek + max)']].map(([t,l])=>'<button data-t="'+t+'">'+l+'</button>').join('')+'</div>';
 h+='<div style="margin-top:16px;text-align:right"><button data-t="close" style="background:#7f1d1d">✖ BEZÁR (Esc)</button></div></div>';P.innerHTML=h;P.classList.add('on');if(document.pointerLockElement)document.exitPointerLock()}
const ap=(t,w,r)=>{if(window._lootApply)_lootApply(t,w,r)};
P.addEventListener('click',e=>{const b=e.target.closest('button');if(!b){if(e.target===P)closeAdd();return}const t=b.dataset.t,w=+b.dataset.w,r=+b.dataset.r,g=G;try{sfx('click')}catch(x){}
 if(t==='close')return closeAdd();
 if(t==='weapon'){if(g.ry)g.ry.rar[w]=-1;g.own[w]=false;ap('weapon',w,r);g.pickMode=false}
 else if(t==='ammo1'){g.res[w]=(g.res[w]||0)+WPN[w].res}
 else if(t==='mats500'){if(window.BR)BR.mats=Math.min(999,(BR.mats||0)+500)}
 else if(t==='heal'){g.hp=g.mhp;g.sh=g.msh}
 else if(t==='all'){for(let i=0;i<5;i++){if(g.ry)g.ry.rar[i]=-1;g.own[i]=false;ap('weapon',i,4);g.res[i]=WPN[i].res*3}g.inv.hp+=5;g.inv.beer+=5;g.hp=g.mhp;g.sh=g.msh;g.pickMode=false;if(window.BR)BR.mats=999}
 else ap(t);
 msg('✅ Hozzáadva: '+b.textContent+(t==='weapon'||t==='ammo1'?' – '+WPN[w].n:''),'dev')});
function closeAdd(){if(!P.classList.contains('on'))return;P.classList.remove('on');try{if(G&&G.fp)ren.domElement.requestPointerLock()}catch(e){}}
window.addPanel={open:openAdd,close:closeAdd};
addEventListener('keydown',e=>{if(e.key==='Escape'&&P.classList.contains('on')){closeAdd();e.stopImmediatePropagation()}},true);
// ---------- buszsofőr ----------
const D=document.createElement('div');D.id='busDrv';document.body.appendChild(D);
function becomeDriver(why){const g=G;if(!g||!g.bus||g.phase!=='drop')return;g.busDriver=true;D.style.display='block';D.innerHTML='🚌 TE VEZETED A BUSZT!<i>A / D: kormányzás · W / S: gyorsítás / lassítás · Space: kiugrás</i>';
 msg(why==='parancs'?'🚌 Átvetted a kormányt!':'🍀 SZERENCSE! (1%) Te lettél a buszsofőr!','sys');try{sfx('win')}catch(e){}}
WPf('launch',()=>{const g=G;D.style.display='none';closeAdd();if(!g)return;g.fly=false;g.busDriver=false;g.bSpd=1;if(g.brMode&&g.bus&&(window._nextDriver||Math.random()<.01)){window._nextDriver=0;setTimeout(()=>becomeDriver('esely'),400)}});
// kormányzás: az útvonal oldalirányú eltolása + sebesség
WPf('update',null,a=>{const g=G,dt=a[0];if(!g||!g.busDriver||g.phase!=='drop'||!g.bus)return;const b=g.bus,L=Math.hypot(b.ex-b.sx,b.ez-b.sz)||1,px=-(b.ez-b.sz)/L,pz=(b.ex-b.sx)/L;
 const st=(keys['d']?1:0)-(keys['a']?1:0);if(st){const m=st*22*dt;b.sx+=px*m;b.ex+=px*m;b.sz+=pz*m;b.ez+=pz*m}
 const sp=(keys['w']?1:0)-(keys['s']?1:0);g.bSpd=Math.max(.5,Math.min(1.8,(g.bSpd||1)+sp*dt*.8));g.t+=(g.bSpd-1)*dt;
 if(g.car)g.car.rotation.z=-st*.12});
WPf('land',()=>{const g=G;if(g&&g.busDriver){g.busDriver=false;D.style.display='none';msg('🚌 Kiugrottál – a busz robotpilótára vált.','sys')}});
['end','quitMatch'].forEach(n=>WPf(n,()=>{closeChat();closeAdd();D.style.display='none'}));
})();
// ---------- PÉNZ-CHEATEK (saját teszteléshez): /zalqntoken összeg · /zalqnft összeg ----------
window.zalqnCheat=function(c){const p=String(c||'').trim().replace(/^\//,'').split(/\s+/),n=(p[0]||'').toLowerCase();if(n!=='zalqntoken'&&n!=='zalqnft')return null;
 const a=Math.round(Number(String(p[1]||'').replace(/[^\d-]/g,'')));if(!isFinite(a)||!p[1])return'⚠️ Használat: /'+n+' összeg (pl. /'+n+' 50000)';
 const fmt=v=>Math.round(v).toLocaleString('hu-HU');
 if(n==='zalqntoken'){if(!window.BR)return'⚠️ Előbb jelentkezz be!';BR.zs=Math.max(0,(BR.zs|0)+a);try{st.s('k3br',BR)}catch(e){}return'🪙 +'+fmt(a)+' zseton · összesen: '+fmt(BR.zs)}
 S.c=Math.max(0,(S.c||0)+a);try{save()}catch(e){}return'💵 +'+fmt(a)+' Ft · összesen: '+fmt(S.c)+' Ft'};
// lobby chat: a parancsot helyben kezeljük, nem megy ki a szerverre
(function(){const iv=setInterval(()=>{const box=document.getElementById('lbIn');if(!box)return;clearInterval(iv);const inp=box.querySelector('input'),btn=box.querySelector('button');
 const run=e=>{const r=window.zalqnCheat(inp.value);if(r===null)return;e.preventDefault();e.stopImmediatePropagation();inp.value='';const m=document.getElementById('lbMsgs');if(m){const d=document.createElement('div');d.style.cssText='color:#facc15;font-weight:700;padding:4px 8px';d.textContent=r;m.appendChild(d);m.scrollTop=m.scrollHeight}};
 inp.addEventListener('keydown',e=>{if(e.key==='Enter')run(e)},true);btn.addEventListener('click',run,true)},500)})();
