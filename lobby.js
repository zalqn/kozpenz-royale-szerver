// ===== LOBBY: belépés/regisztráció, 3D lobby, parti, chat, barátok, karrier =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const ONLINE_OK=location.protocol.startsWith('http');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ACC={token:localStorage.getItem('ry_token')||'',user:null,guest:false,ws:null,online:[],party:{leader:null,members:[]},friends:[],chat:[],ch:'global',ready:false,unread:0};
window.ACC=ACC;
const api=async(p,b)=>{const r=await fetch(p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json',...(ACC.token?{Authorization:'Bearer '+ACC.token}:{})},body:b?JSON.stringify(b):undefined});const j=await r.json().catch(()=>({error:'Szerverhiba'}));if(!r.ok)throw new Error(j.error||'Hiba');return j};

// ---------------- CSS ----------------
const css=document.createElement('style');css.textContent=`
#lb{position:fixed;inset:0;z-index:8;display:none;font-family:Rajdhani,Arial;color:#fff;user-select:none}
#lb.on{display:block}
#lbCv{position:absolute;inset:0;width:100%;height:100%}
#lbTop{position:absolute;left:0;right:0;top:0;height:64px;display:flex;align-items:center;gap:4px;padding:0 18px;background:linear-gradient(#000c,#0000)}
#lbTop .tab{white-space:nowrap;padding:7px 9px!important;font:17px 'Luckiest Guy',Impact;letter-spacing:1px;padding:8px 16px;border-radius:10px;color:#e2e8f0;cursor:pointer;transition:.15s;text-shadow:0 2px 0 #0008}
#lbTop .tab:hover{background:#ffffff1a}#lbTop .tab.on{background:#fff;color:#0b1022;text-shadow:none}
#lbTop .dot::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffd23f;margin-right:6px;vertical-align:middle;box-shadow:0 0 8px #ffd23f}
#lbLogo{white-space:nowrap;font:26px 'Luckiest Guy',Impact;background:linear-gradient(180deg,#fff6c9,#ffd23f 45%,#ff9f1c);-webkit-background-clip:text;background-clip:text;color:transparent;margin-right:14px;filter:drop-shadow(0 2px 0 #5a2a00)}
#lbRight{margin-left:auto;display:flex;align-items:center;gap:14px}
#lbZs,#lbFt{font:19px 'Luckiest Guy',Impact;display:flex;align-items:center;gap:5px;background:#0b1022b3;border:1px solid #ffffff22;border-radius:12px;padding:6px 10px;white-space:nowrap}#lbFt{color:#a3e635}
#lbRight{gap:8px!important}
#lbAv{width:48px;height:48px;border-radius:12px;background:linear-gradient(160deg,#334155,#0f172a);display:flex;align-items:center;justify-content:center;font-size:28px;border:2px solid #ffffff44;position:relative;cursor:pointer}
#lbAv i{position:absolute;right:-3px;bottom:-3px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid #0b1022}
#lbAv i.off{background:#64748b}
#lbName{position:absolute;transform:translate(-50%,-100%);text-align:left;pointer-events:none;white-space:nowrap}
.lbTag{display:flex;align-items:center;gap:8px;filter:drop-shadow(0 2px 2px #000a)}
.lbTag .cr{font-size:22px}.lbTag b{font:22px Rajdhani;font-weight:700;color:#fff;display:block}.lbTag span{font-weight:700;font-size:17px}
#lbNews{position:absolute;left:24px;top:84px;width:280px;height:140px;border-radius:16px;overflow:hidden;cursor:pointer;box-shadow:0 14px 40px #0009;border:2px solid #ffffff22}
#lbNews .nw{position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;opacity:0;transition:opacity .6s}
#lbNews .nw.on{opacity:1}#lbNews h3{margin:0;font:22px 'Luckiest Guy',Impact;position:relative;text-shadow:0 3px 0 #000}#lbNews p{margin:4px 0 0;font-weight:700;color:#e2e8f0;font-size:14px;position:relative}
#lbNews .dots{position:absolute;left:16px;bottom:8px;display:flex;gap:5px}#lbNews .dots i{width:8px;height:8px;border-radius:5px;background:#fff6}#lbNews .dots i.on{width:22px;background:#fff}
#lbPlay{position:absolute;left:24px;bottom:28px;width:330px;padding:18px;border-radius:18px;background:#141826e6;backdrop-filter:blur(10px);box-shadow:0 20px 50px #000a;border:1px solid #ffffff1c}
#lbPlay h2{margin:0 0 12px;text-align:center;font:30px 'Luckiest Guy',Impact;color:#fff!important;text-shadow:0 3px 0 #000}
#lbMode{background:#e2e8f0;color:#0b1022;border-radius:12px;padding:8px;text-align:center;font:20px 'Luckiest Guy',Impact;cursor:pointer;line-height:1.05}
#lbMode small{display:block;font:700 15px Rajdhani}
#lbChar{display:flex;align-items:center;justify-content:space-between;margin:10px 0;background:#0b1022;border-radius:10px;padding:6px}
#lbChar button{width:34px;height:34px;border-radius:8px;border:0;background:#334155;color:#fff;font-size:18px;cursor:pointer}
#lbChar div{text-align:center;font-weight:700;font-size:15px;line-height:1.1}
#lbGo{width:100%;padding:16px;border:0;border-radius:14px;background:linear-gradient(180deg,#fff95e,#f5e100);color:#0b1022;font:42px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 6px 0 #a39400,0 10px 30px #f5e10055;transition:.12s}
#lbGo:hover{filter:brightness(1.08);transform:translateY(-2px)}#lbGo:active{transform:translateY(4px);box-shadow:0 2px 0 #a39400}
#lbGo.wait{background:linear-gradient(180deg,#94a3b8,#64748b);box-shadow:0 6px 0 #334155;font-size:26px}
#lbSide{position:absolute;right:24px;bottom:110px;display:flex;flex-direction:column;gap:12px}
.lbBadge{width:96px;height:96px;border-radius:16px;background:#141826d9;border:1px solid #ffffff22;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer}
.lbBadge .ring{width:66px;height:66px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;font:28px 'Luckiest Guy',Impact;line-height:.9}
.lbBadge .ring small{font:700 12px Rajdhani;color:#cbd5e1}
#lbBot{position:absolute;right:24px;bottom:28px;display:flex;gap:10px}
#lbBot button{padding:12px 24px;border:0;border-radius:30px;background:#e2e8f0e6;color:#0b1022;font:22px 'Luckiest Guy',Impact;cursor:pointer;position:relative}
#lbBot button:hover{background:#fff}#lbBot b.cnt{position:absolute;top:-6px;right:-4px;background:#ef4444;color:#fff;border-radius:10px;padding:0 7px;font:700 14px Rajdhani}
.lbPlus{position:absolute;transform:translate(-50%,-50%);width:54px;height:54px;border:3px solid #fff;border-radius:10px 10px 18px 18px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;cursor:pointer;background:#1e3a8a88;box-shadow:0 0 18px #38bdf888;transition:.15s}
.lbPlus:hover,.lbPlus.hov{transform:translate(-50%,-50%) scale(1.15);background:#2563ebdd;box-shadow:0 0 30px #38bdf8}
.lbPlus small{position:absolute;top:60px;left:50%;transform:translateX(-50%);font:14px 'Luckiest Guy',Impact;white-space:nowrap;opacity:0;transition:.15s;text-shadow:0 2px 0 #000}.lbPlus:hover small,.lbPlus.hov small{opacity:1}
.lbMate{position:absolute;transform:translate(-50%,-100%);text-align:center;pointer-events:none;font-weight:700;text-shadow:0 2px 3px #000}
#lbChat{position:absolute;z-index:5;right:0;top:64px;bottom:0;width:380px;background:#0b1022ee;backdrop-filter:blur(12px);border-left:1px solid #ffffff22;transform:translateX(100%);transition:transform .25s;display:flex;flex-direction:column}
#lbChat.on{transform:none}
#lbChat .hd{display:flex;gap:6px;padding:10px}#lbChat .hd button{flex:1;padding:8px;border:0;border-radius:8px;background:#1e293b;color:#cbd5e1;font:16px 'Luckiest Guy',Impact;cursor:pointer}#lbChat .hd button.on{background:#ffd23f;color:#0b1022}
#lbMsgs{flex:1;overflow-y:auto;padding:6px 12px;font-size:16px;line-height:1.35}
#lbMsgs div{margin:3px 0;word-wrap:break-word}#lbMsgs .sys{color:#94a3b8;font-style:italic}#lbMsgs .pt b{color:#4ade80}#lbMsgs .dm b{color:#f472b6}#lbMsgs b{color:#ffd23f}
#lbIn{display:flex;gap:6px;padding:10px;border-top:1px solid #ffffff1a}#lbIn input{flex:1;padding:10px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;font:600 16px Rajdhani}#lbIn button{padding:0 14px;border:0;border-radius:8px;background:#ffd23f;font:16px 'Luckiest Guy',Impact;cursor:pointer}
#lbUsers{max-height:40%;overflow-y:auto;border-top:1px solid #ffffff1a;padding:8px 12px}
#lbUsers .u{display:flex;align-items:center;gap:8px;padding:6px;border-radius:8px}#lbUsers .u:hover{background:#ffffff0d}
#lbUsers .u .av{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px}
#lbUsers .u .nm{flex:1;font-weight:700}#lbUsers .u small{display:block;color:#94a3b8;font-size:12px}
#lbUsers .u button{border:0;border-radius:6px;padding:4px 8px;background:#334155;color:#fff;cursor:pointer;font:700 13px Rajdhani}
#lbToast{position:absolute;left:50%;top:80px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;z-index:3}
#lbToast div{background:#141826f2;border:1px solid #ffd23f88;border-radius:12px;padding:10px 14px;font-weight:700;box-shadow:0 10px 30px #000a;display:flex;gap:10px;align-items:center}
#lbToast button{border:0;border-radius:8px;padding:6px 10px;font:15px 'Luckiest Guy',Impact;cursor:pointer}
#auth{position:fixed;inset:0;z-index:9;display:none;align-items:center;justify-content:center;background:radial-gradient(900px 600px at 30% 20%,#3b1d6e,transparent 60%),radial-gradient(900px 700px at 80% 90%,#0b4f6c,transparent 55%),#070914}
#auth.on{display:flex}
#auth .box{width:min(420px,92vw);padding:28px;border-radius:24px;background:#0e1430cc;backdrop-filter:blur(16px);border:1px solid #ffffff22;box-shadow:0 30px 80px #000b;text-align:center}
#auth .lg{font:46px 'Luckiest Guy',Impact;line-height:.95;background:linear-gradient(180deg,#fff6c9,#ffd23f 45%,#ff9f1c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #5a2a00)}
#auth .tb{display:flex;margin:18px 0 12px;background:#020617;border-radius:12px;padding:4px}#auth .tb button{flex:1;padding:10px;border:0;border-radius:9px;background:none;color:#94a3b8;font:18px 'Luckiest Guy',Impact;cursor:pointer}#auth .tb button.on{background:#ffd23f;color:#0b1022}
#auth input{width:100%;margin:6px 0;padding:13px;border-radius:10px;border:1px solid #334155;background:#020617;color:#fff;font:600 18px Rajdhani}
#auth input:focus{outline:2px solid #ffd23f}
#auth .go{width:100%;margin-top:10px;padding:14px;border:0;border-radius:12px;background:linear-gradient(180deg,#fff95e,#f5e100);font:24px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 5px 0 #a39400}
#auth .gu{margin-top:12px;background:none;border:0;color:#94a3b8;font:700 16px Rajdhani;cursor:pointer;text-decoration:underline}
#auth .err{color:#ff6b81;font-weight:700;min-height:22px;margin-top:6px}
@media (max-height:720px){#lbNews{display:none}}@media (max-width:1760px){#lbLogo{display:none}}@media (max-width:1100px){#lbTop .tab{font-size:16px;padding:6px 8px}#lbLogo{display:none}}
#auth .note{color:#fbbf24;font-size:14px;margin-top:10px}
`;document.head.appendChild(css);

// ---------------- DOM ----------------
const lb=document.createElement('div');lb.id='lb';lb.innerHTML=`
<canvas id="lbCv"></canvas>
<div id="lbTop"><span id="lbLogo">KÖZPÉNZ ROYALE</span>
 <span class="tab on" data-t="play">JÁTÉK</span><span class="tab" data-t="locker">SZEKRÉNY</span><span class="tab dot" data-t="shop">TÁRGYBOLT</span><span class="tab" data-t="bp">SZEZONBÉRLET</span><span class="tab dot" data-t="vsport">VSPORT</span><span class="tab dot" data-t="casino">KASZINÓ</span><span class="tab dot" data-t="valto">💱 VÁLTÓ</span><span class="tab dot" data-t="pets">🐕 ÁLLATOK</span><span class="tab dot" data-t="flakon">FLAKON</span><span class="tab" data-t="career">KARRIER</span><span class="tab" data-t="codex">KODEX</span><span class="tab" data-t="set">⚙</span>
 <div id="lbRight"><div id="lbZs" title="Zseton (bolt, kaszinó)">🪙 <span>0</span></div><div id="lbFt" title="Forint (VSport, flakon, bújócska, Közpénz shop)">💵 <span>0</span></div><div id="lbAv" title="Profil">😎<i></i></div></div></div>
<div id="lbNews"></div>
<div id="lbName"></div>
<div id="lbPlay"><h2>KÖZPÉNZ ROYALE</h2><div id="lbMode">SOLO<small>25 JÁTÉKOS · BOTOK</small></div>
 <div id="lbTeam" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:8px"></div><div id="lbChar"><button id="lbCp">◀</button><div id="lbCn"></div><button id="lbCx">▶</button></div>
 <button id="lbGo">JÁTÉK</button></div>
<div id="lbSide"><div class="lbBadge" id="lbLv" title="Szezonbérlet"><div class="ring"><small>SZINT</small><span>1</span></div></div><div class="lbBadge" id="lbTr" title="Trófeák"><div class="ring" style="font-size:34px">🏆</div></div></div>
<div id="lbBot"><button id="lbChatB">CHAT<b class="cnt" style="display:none">0</b></button><button id="lbEmo">💃 TÁNC</button></div>
<div id="lbChat"><div class="hd"><button data-c="global" class="on">GLOBÁLIS</button><button data-c="party">PARTI</button><button id="lbChatX" title="Bezárás (Esc)" style="flex:0 0 44px;background:#ef4444;color:#fff">✕</button></div><div id="lbMsgs"></div>
 <div id="lbIn"><input maxlength="200" placeholder="Írj üzenetet... (Enter)"><button>KÜLD</button></div><div id="lbUsers"></div></div>
<div id="lbToast"></div>`;
document.body.appendChild(lb);
const au=document.createElement('div');au.id='auth';au.innerHTML=`<div class="box"><div class="lg">KÖZPÉNZ<br>ROYALE</div>
 <div class="tb"><button class="on" data-m="login">BELÉPÉS</button><button data-m="reg">REGISZTRÁCIÓ</button></div>
 <input id="auN" placeholder="Felhasználónév" autocomplete="username" maxlength="16"><input id="auP" type="password" placeholder="Jelszó" autocomplete="current-password" maxlength="72"><input id="auP2" type="password" placeholder="Jelszó újra" style="display:none" maxlength="72">
 <button class="go" id="auGo">BELÉPÉS</button><div class="err" id="auE"></div><button class="gu" id="auG">Játék vendégként (offline)</button>
 <div class="note" id="auNote"></div></div>`;
document.body.appendChild(au);
const Q=s=>lb.querySelector(s);

// ---------------- Belépés / regisztráció ----------------
let mode='login';
au.querySelectorAll('.tb button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;au.querySelectorAll('.tb button').forEach(x=>x.classList.toggle('on',x===b));$('auP2').style.display=mode==='reg'?'block':'none';$('auGo').textContent=mode==='reg'?'FIÓK LÉTREHOZÁSA':'BELÉPÉS';$('auE').textContent=''});
async function doAuth(){const n=$('auN').value.trim(),p=$('auP').value;$('auE').textContent='';
 if(!ONLINE_OK){$('auE').textContent='A szerver nem fut. Indítsd el: INDITAS.bat';return}
 if(mode==='reg'&&p!==$('auP2').value){$('auE').textContent='A két jelszó nem egyezik.';return}
 try{const r=await api(mode==='reg'?'/api/register':'/api/login',{name:n,pass:p});ACC.token=r.token;localStorage.setItem('ry_token',r.token);ACC.user=r.user;ACC.guest=false;afterLogin()}catch(e){$('auE').textContent=e.message}}
$('auGo').onclick=doAuth;['auN','auP','auP2'].forEach(i=>$(i).addEventListener('keydown',e=>{if(e.key==='Enter')doAuth()}));
$('auG').onclick=()=>{ACC.guest=true;ACC.user={name:'Vendég'+(Math.random()*900+100|0),level:1,stats:{games:0,wins:0,kills:0},friends:[]};afterLogin()};
if(!ONLINE_OK)$('auNote').innerHTML='⚠️ A fájl közvetlenül van megnyitva, ezért nincs szerver.<br>Többjátékoshoz indítsd el az <b>INDITAS.bat</b>-ot, és nyisd meg a kiírt címet.';
function afterLogin(){au.classList.remove('on');showLobby();if(!ACC.guest)connectWS();addMsg('sys',null,ACC.guest?'Vendégként játszol – a chat és a parti belépés után érhető el.':'Üdv, '+ACC.user.name+'!')}
async function boot(){if(ONLINE_OK&&ACC.token){try{const r=await api('/api/me');ACC.user=r.user;afterLogin();return}catch(e){localStorage.removeItem('ry_token');ACC.token=''}}au.classList.add('on');$('menu').classList.remove('on')}

// ---------------- WebSocket ----------------
function connectWS(){if(ACC.ws)try{ACC.ws.close()}catch(e){}
 const ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws?token='+encodeURIComponent(ACC.token));ACC.ws=ws;
 ws.onmessage=ev=>{let m;try{m=JSON.parse(ev.data)}catch(e){return}try{window.dispatchEvent(new CustomEvent('krws',{detail:m}))}catch(e){}
  if(m.t==='hello'||m.t==='presence'){ACC.online=m.list;renderUsers()}
  else if(m.t==='chat'){addMsg(m.ch,m.from,m.text,m.to)}
  else if(m.t==='party'){ACC.party=m;const me=m.members.find(x=>x.name===ACC.user.name);ACC.ready=!!(me&&me.ready);updParty()}
  else if(m.t==='friends'){ACC.friends=m.list;ACC.user.friends=m.list;renderUsers()}
  else if(m.t==='invite'){toast('🎉 <b>'+esc(m.from)+'</b> meghívott a partijába!',[['ELFOGAD',()=>wsend({t:'accept',id:m.id}),'#ffd23f'],['NEM',null,'#334155']])}
  else if(m.t==='start'){if(G&&run)return;if(['stw','royale','flakon'].includes(m.mode)){window.GAME_MODE=m.mode}if(['solo','duo','trio','squad'].includes(m.team)){window.GAME_TEAM=m.team;teamUI()}updParty();toast('🚀 '+esc(m.by)+' elindította a meccset!');setTimeout(startMatch,700)}
  else if(m.t==='kicked'){addMsg('sys',null,m.error)}};
 ws.onclose=()=>{$('lbAv').querySelector('i').classList.add('off');if(ACC.token&&!ACC.guest)setTimeout(()=>{if(ACC.ws===ws)connectWS()},3000)};
 ws.onopen=()=>{$('lbAv').querySelector('i').classList.remove('off');wsend({t:'status',status:'lobby'})}}
const wsend=o=>{if(ACC.ws&&ACC.ws.readyState===1)ACC.ws.send(JSON.stringify(o))};window.KR={wsend:o=>wsend(o),acc:()=>ACC,api:(p,b)=>api(p,b),toast:(h,b)=>toast(h,b),msg:(c,f,t)=>addMsg(c,f,t)};

// ---------------- Chat ----------------
function addMsg(ch,from,text,to){ACC.chat.push({ch,from,text,to});if(ACC.chat.length>200)ACC.chat.shift();if(!$('lbChat').classList.contains('on')&&ch!=='sys'){ACC.unread++;const c=Q('#lbChatB .cnt');c.textContent=ACC.unread;c.style.display='block'}renderMsgs()}
function renderMsgs(){const box=$('lbMsgs');box.innerHTML='';ACC.chat.filter(m=>m.ch==='sys'||m.ch==='dm'||(ACC.ch==='party'?m.ch==='party':m.ch==='global')).forEach(m=>{const d=document.createElement('div');d.className=m.ch==='sys'?'sys':m.ch==='party'?'pt':m.ch==='dm'?'dm':'';
 if(m.from){const b=document.createElement('b');b.textContent=(m.ch==='dm'?'✉ '+m.from+(m.to?' → '+m.to:''):m.from)+': ';d.appendChild(b)}d.appendChild(document.createTextNode(m.text));box.appendChild(d)});box.scrollTop=1e9}
function sendChat(){const i=Q('#lbIn input'),t=i.value.trim();if(!t)return;if(ACC.guest){addMsg('sys',null,'A chathez jelentkezz be.');return}
 const dm=t.match(/^\/w\s+(\S+)\s+(.+)/);if(dm)wsend({t:'chat',ch:'dm',to:dm[1],text:dm[2]});else wsend({t:'chat',ch:ACC.ch,text:t});i.value=''}
Q('#lbIn button').onclick=sendChat;Q('#lbIn input').addEventListener('keydown',e=>{if(e.key==='Escape'){$('lbChat').classList.remove('on');e.target.blur();return}e.stopPropagation();if(e.key==='Enter')sendChat()});
$('lbChatX').onclick=e=>{e.stopPropagation();$('lbChat').classList.remove('on')};
addEventListener('keydown',e=>{if(e.key==='Escape'&&$('lbChat').classList.contains('on'))$('lbChat').classList.remove('on')});
Q('#lbChat .hd').querySelectorAll('button[data-c]').forEach(b=>b.onclick=()=>{ACC.ch=b.dataset.c;Q('#lbChat .hd').querySelectorAll('button[data-c]').forEach(x=>x.classList.toggle('on',x===b));renderMsgs()});
$('lbChatB').onclick=()=>{$('lbChat').classList.toggle('on');ACC.unread=0;Q('#lbChatB .cnt').style.display='none'};
function renderUsers(){const box=$('lbUsers');box.innerHTML='<div style="color:#94a3b8;font-weight:700;margin-bottom:4px">ONLINE ('+ACC.online.length+')</div>';
 ACC.online.forEach(u=>{const me=ACC.user&&u.name===ACC.user.name,fr=(ACC.friends||[]).includes(u.name);const d=document.createElement('div');d.className='u';
  d.innerHTML='<div class="av" style="background:'+esc(u.color)+'33">'+esc(u.avatar)+'</div><div class="nm"></div>';d.querySelector('.nm').textContent=u.name+(me?' (te)':'');const sm=document.createElement('small');sm.textContent='Szint '+u.level+' · '+({lobby:'lobbyban',match:'meccsen',menu:'menüben'}[u.status]||'');d.querySelector('.nm').appendChild(sm);
  if(!me){const inv=document.createElement('button');inv.textContent='➕ Parti';inv.onclick=()=>{wsend({t:'invite',name:u.name});toast('Meghívó elküldve: '+esc(u.name))};const f=document.createElement('button');f.textContent=fr?'★':'☆ Barát';f.title=fr?'Barát':'Barátnak jelölés';f.onclick=()=>wsend({t:'friend',name:u.name,remove:fr});const w=document.createElement('button');w.textContent='✉';w.onclick=()=>{const i=Q('#lbIn input');i.value='/w '+u.name+' ';i.focus()};d.append(inv,f,w)}box.appendChild(d)});
 const off=(ACC.friends||[]).filter(f=>!ACC.online.some(u=>u.name===f));if(off.length){const h=document.createElement('div');h.style.cssText='color:#94a3b8;font-weight:700;margin:8px 0 4px';h.textContent='BARÁTOK – OFFLINE';box.appendChild(h);off.forEach(f=>{const d=document.createElement('div');d.className='u';d.style.opacity=.5;d.textContent='💤 '+f;box.appendChild(d)})}}
function toast(html,btns){const t=document.createElement('div');t.innerHTML='<span>'+html+'</span>';(btns||[]).forEach(([l,fn,c])=>{const b=document.createElement('button');b.textContent=l;b.style.background=c;b.onclick=()=>{fn&&fn();t.remove()};t.appendChild(b)});$('lbToast').appendChild(t);setTimeout(()=>t.remove(),btns?15000:3500)}

// ---------------- Barátlista (a + helyekről) ----------------
window.friendsUI=function(){if(ACC.guest){guiOpen('<h1 class="f" style="font-size:30px">👥 BARÁTOK</h1><div style="color:#cbd5e1;margin:10px">A barátlistához és a partihoz jelentkezz be (INDITAS.bat → regisztráció).</div>'+bB('VISSZA','guiClose()','r'));return}
 const on=new Map(ACC.online.map(u=>[u.name,u])),fr=ACC.friends||[],others=ACC.online.filter(u=>u.name!==ACC.user.name&&!fr.includes(u.name));
 const row=(n,u,isF)=>'<div class="it" style="display:flex;align-items:center;gap:10px;cursor:default;margin:4px 0"><span style="font-size:26px">'+(u?esc(u.avatar):'💤')+'</span><div style="flex:1;text-align:left"><b>'+esc(n)+'</b><small>'+(u?'🟢 '+({lobby:'lobbyban',match:'meccsen',menu:'menüben'}[u.status]||'online')+' · Szint '+u.level:'⚫ offline')+'</small></div>'+(u?bB('➕ MEGHÍV',"wsInvite('"+esc(n)+"')",'c'):'')+(isF?'':bB('☆ BARÁT',"wsFriend('"+esc(n)+"')",'p'))+'</div>';
 guiOpen('<h1 class="f" style="font-size:30px">👥 BARÁTOK & MEGHÍVÁS</h1><div style="color:#cbd5e1;margin-bottom:6px">Parti: '+((ACC.party.members||[]).length||1)+'/4 · Mód: '+({solo:'SOLO',duo:'DUO',trio:'TRIÓ',squad:'SQUAD'})[window.GAME_TEAM||'solo']+'</div><div style="max-height:55vh;overflow-y:auto">'+
  '<h2 class="f" style="text-align:left">⭐ BARÁTOK ('+fr.length+')</h2>'+(fr.length?fr.map(n=>row(n,on.get(n),true)).join(''):'<div style="color:#94a3b8">Még nincs barátod – jelölj valakit lent!</div>')+
  '<h2 class="f" style="text-align:left;margin-top:10px">🟢 ONLINE JÁTÉKOSOK ('+others.length+')</h2>'+(others.length?others.map(u=>row(u.name,u,false)).join(''):'<div style="color:#94a3b8">Most senki más nincs online.</div>')+'</div>'+bB('VISSZA','guiClose()','r'))};
window.wsInvite=n=>{wsend({t:'invite',name:n});toast('Meghívó elküldve: '+esc(n))};window.wsFriend=n=>{wsend({t:'friend',name:n});setTimeout(()=>{if(GUI.on)friendsUI()},400)};
// ---------------- Hírek ----------------
const NEWS=[['1. SZEZON: KÖZPÉNZ-SZIGET','25 játékos, egy túlélő. Szűkülő vihar!','linear-gradient(135deg,#7c3aed,#db2777)','🏝️'],['ÚJ: ÉPÍTÉS','Fal, rámpa, padló – emeletekkel! (B)','linear-gradient(135deg,#0ea5e9,#1e3a8a)','🧱'],['RITKA FEGYVEREK','Közönségestől a mítikusig, a ládákban.','linear-gradient(135deg,#f59e0b,#b45309)','🎁'],['ÁLLATOK A SZIGETEN','Bölények, tehenek, lovak – ne lőj rájuk!','linear-gradient(135deg,#16a34a,#065f46)','🐄']];
{const n=$('lbNews');NEWS.forEach((x,i)=>{const d=document.createElement('div');d.className='nw'+(i?'':' on');d.style.background=x[2];d.innerHTML='<div style="position:absolute;right:12px;top:8px;font-size:52px;opacity:.95">'+x[3]+'</div><h3>'+x[0]+'</h3><p>'+x[1]+'</p>';n.appendChild(d)});const dots=document.createElement('div');dots.className='dots';dots.innerHTML=NEWS.map((_,i)=>'<i class="'+(i?'':'on')+'"></i>').join('');n.appendChild(dots);let k=0;const step=()=>{k=(k+1)%NEWS.length;n.querySelectorAll('.nw').forEach((s,i)=>s.classList.toggle('on',i===k));dots.querySelectorAll('i').forEach((s,i)=>s.classList.toggle('on',i===k))};setInterval(step,5000);n.onclick=step}

// ---------------- 3D lobby jelenet ----------------
let L=null,L_pool=null;const LFX=[];
function build3D(){const cv=$('lbCv');const r=new THREE.WebGLRenderer({canvas:cv,antialias:true});r.setPixelRatio(Math.min(1.5,devicePixelRatio));r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.15;r.shadowMap.enabled=true;
 const sc=new THREE.Scene();const sky=document.createElement('canvas');sky.width=16;sky.height=256;const sx=sky.getContext('2d'),gr=sx.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#040b24');gr.addColorStop(.5,'#123a7a');gr.addColorStop(.75,'#2b5fa8');gr.addColorStop(1,'#1a2f55');sx.fillStyle=gr;sx.fillRect(0,0,16,256);sc.background=new THREE.CanvasTexture(sky);sc.fog=new THREE.Fog(0x1a3566,30,90);
 const cam=new THREE.PerspectiveCamera(46,1,.1,300);cam.position.set(0,3.6,13.5);cam.lookAt(0,2.4,0);
 sc.add(new THREE.HemisphereLight(0x9cc8ff,0x1b2440,.75));const moonL=new THREE.DirectionalLight(0xbcd7ff,1.1);moonL.position.set(8,14,6);moonL.castShadow=true;moonL.shadow.mapSize.set(1024,1024);sc.add(moonL);
 const key=new THREE.SpotLight(0x8be9ff,1.1,30,.45,.7);key.position.set(0,12,6);key.target.position.set(0,0,0);sc.add(key,key.target);
 // hold
 const mc=document.createElement('canvas');mc.width=mc.height=256;const mx=mc.getContext('2d');const mg=mx.createRadialGradient(128,128,40,128,128,128);mg.addColorStop(0,'#f2f7ff');mg.addColorStop(.42,'#dbe7ff');mg.addColorStop(.48,'#9ec2ff66');mg.addColorStop(1,'#9ec2ff00');mx.fillStyle=mg;mx.fillRect(0,0,256,256);mx.fillStyle='#b8c8e888';[[100,110,14],[150,140,10],[130,90,7],[95,150,9]].forEach(([x,y,r])=>{mx.beginPath();mx.arc(x,y,r,0,7);mx.fill()});
 const moon=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(mc),fog:false}));moon.scale.set(16,16,1);moon.position.set(18,17,-40);sc.add(moon);
 const st=[];for(let i=0;i<400;i++)st.push(new THREE.Vector3((R()-.5)*200,R()*60+10,-50-R()*40));sc.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(st),new THREE.PointsMaterial({color:0xffffff,size:.35,fog:false})));
 // talaj, tenger, part
 const TM=window.texMat;const ground=new THREE.Mesh(new THREE.CircleGeometry(40,48),TM?TM('sand',10,10,0x8c8aa8):new THREE.MeshStandardMaterial({color:0x262c3d,roughness:.95}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;sc.add(ground);
 const sea=new THREE.Mesh(new THREE.PlaneGeometry(400,200),new THREE.MeshStandardMaterial({color:0x0b3a6e,emissive:0x061d3a,roughness:.15,metalness:.4}));sea.rotation.x=-Math.PI/2;sea.position.set(0,-.3,-60);sc.add(sea);
 // talapzatok
 const pedM=TM?TM('tile',1,1,0xe2e8f0):new THREE.MeshStandardMaterial({color:0x5b6b85,roughness:.4,metalness:.6});
 if(TM){const deck=new THREE.Mesh(new THREE.BoxGeometry(22,.18,9),TM('wood',5,2,0x8a6a4a));deck.position.set(1.8,.06,-1.4);deck.receiveShadow=true;sc.add(deck);[[-9.2,0],[12.8,0]].forEach(([x])=>{for(let i=0;i<5;i++){const post=new THREE.Mesh(new THREE.BoxGeometry(.18,1,.18),TM('wood',.2,1,0x6b4a2b));post.position.set(x,.55,-5.4+i*2.1);post.castShadow=true;sc.add(post)}const rail=new THREE.Mesh(new THREE.BoxGeometry(.14,.12,8.6),TM('wood',.2,3,0x6b4a2b));rail.position.set(x,1.05,-1.2);sc.add(rail)});
  const rock=(x,z,s)=>{const r2=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),TM('conc',1,1,0x6b6f80));r2.position.set(x,s*.45,z);r2.rotation.set(R(),R(),R());r2.castShadow=true;sc.add(r2)};rock(-13,2,1.4);rock(-11.5,3.5,.8);rock(14,1,1.7);rock(15.8,3,1);rock(11,-11,1.2)}const glowM=new THREE.MeshBasicMaterial({color:0x7df9ff});
 const SLOTS=[[0,0,0],[-4.2,-1.6,1],[4.2,-1.6,2],[7.6,-3.2,3]];const peds=SLOTS.map(([x,z,i])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.75,.3,40),pedM);p.position.set(x,.15,z);p.receiveShadow=true;sc.add(p);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.06,8,48),glowM);ring.rotation.x=Math.PI/2;ring.position.set(x,.31,z);ring.visible=i===0;sc.add(ring);const disk=new THREE.Mesh(new THREE.CircleGeometry(1.5,40),new THREE.MeshBasicMaterial({color:0xbaf6ff,transparent:true,opacity:i===0?.55:0}));disk.rotation.x=-Math.PI/2;disk.position.set(x,.31,z);sc.add(disk);return{x,z,ring,disk,av:null}});
 // pálmák
 // egyenes pálmák: kúpos törzs gyűrűkkel, íves levelek, kókuszdiók
 const palmLeaf=(()=>{const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d');x.clearRect(0,0,128,512);
 // tollas pálmalevél: középér + sok levélke
 for(let y=10;y<500;y+=7){const k=y/512,len=(1-Math.abs(k-.45)*1.6)*60,sway=Math.sin(y*.13)*3;[-1,1].forEach(s=>{const g=x.createLinearGradient(64,y,64+s*len,y+26);g.addColorStop(0,'#1f7a3f');g.addColorStop(.6,'#3fb36a');g.addColorStop(1,'#7bd389');x.fillStyle=g;x.beginPath();x.moveTo(64,y);x.quadraticCurveTo(64+s*len*.5,y+4+sway,64+s*len,y+24);x.quadraticCurveTo(64+s*len*.45,y+14,64,y+8);x.fill()})}
 x.strokeStyle='#5a7d2e';x.lineWidth=4;x.beginPath();x.moveTo(64,0);x.quadraticCurveTo(66,256,64,512);x.stroke();
 const t=new THREE.CanvasTexture(c);t.anisotropy=4;return new THREE.MeshStandardMaterial({map:t,transparent:true,alphaTest:.35,side:THREE.DoubleSide,roughness:.65,emissive:0x0a2a14,emissiveIntensity:.35})})();
 const palm=(x,z,h)=>{const g=new THREE.Group();const tm=TM?TM('bark',1,3,0xa98a6a):new THREE.MeshStandardMaterial({color:0x6b4a2b,roughness:.9});
  const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,h,12,1),tm);trunk.position.y=h/2;g.add(trunk);
  const ringM=new THREE.MeshStandardMaterial({color:0x5a4430,roughness:.95});for(let i=1;i<h/.7;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.38-.16*(i*.7/h),.04,6,14),ringM);r.rotation.x=Math.PI/2;r.position.y=i*.7;g.add(r)}
  for(let i=0;i<22;i++){const layer=i<12?0:1,n=layer?10:12,k=layer?i-12:i,a=k/n*Math.PI*2+layer*.3;const fr=new THREE.Group();fr.position.y=h+layer*.25;fr.rotation.y=a;const L=layer?4.2:5.6;const lf=new THREE.Mesh(new THREE.PlaneGeometry(layer?1.5:1.8,L),palmLeaf);lf.position.set(0,-.5-layer*.2,L*.45);lf.rotation.x=Math.PI/2+(layer?-.15:.45)+(k%2)*.18;lf.rotation.y=(k%3-1)*.12;fr.add(lf);g.add(fr)}
  const nut=new THREE.MeshStandardMaterial({color:0x4a2f17,roughness:.8});for(let i=0;i<4;i++){const n=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),nut);const a=i/4*Math.PI*2;n.position.set(Math.cos(a)*.3,h-.35,Math.sin(a)*.3);g.add(n)}
  g.position.set(x,0,z);g.traverse(o=>{if(o.isMesh)o.castShadow=true});sc.add(g)};
 palm(-12,-6,9);palm(-15,-12,11);palm(13,-8,10);palm(16,-14,12);palm(-19,-21,10);palm(8,-23,11);
 // ===== PRÉMIUM MODERN VILLA =====
 {const T=(k,rx,ry,c)=>TM?TM(k,rx,ry,c):new THREE.MeshStandardMaterial({color:c||0xdddddd});
  const B=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;sc.add(b);return b};
  const VX=-5,VZ=-24;
  const stone=T('stone',4,1,0xb8b0a4),plaster=T('plaster',4,1.5,0xf4f1ea),wood=T('darkwood',3,1.2,0x9a6a44),slab=T('conc',5,2,0x3a3f4a),marble=T('tile',3,1,0xf1f5f9),pool=T('pool',4,2,0xffffff),cob=T('cobble',2,6,0xcfc6b8);
  const room=(seed)=>{const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');
   let g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#5a3a22');g.addColorStop(.55,'#c98b4e');g.addColorStop(1,'#3a2414');x.fillStyle=g;x.fillRect(0,0,256,256);
   g=x.createRadialGradient(seed%2?70:180,70,5,seed%2?70:180,70,140);g.addColorStop(0,'rgba(255,225,160,.95)');g.addColorStop(1,'rgba(255,190,110,0)');x.fillStyle=g;x.fillRect(0,0,256,256);
   x.fillStyle='#2a1a10';x.fillRect(0,196,256,60);x.fillStyle='rgba(255,210,150,.25)';x.fillRect(0,196,256,4);
   if(seed%3!==1){x.fillStyle='#3b2a20';x.fillRect(40,150,150,46);x.fillRect(40,128,150,26);x.fillStyle='#6b4a36';x.fillRect(36,140,14,56);x.fillRect(180,140,14,56)}
   x.strokeStyle='#1d140d';x.lineWidth=4;x.beginPath();x.moveTo(seed%2?60:200,196);x.lineTo(seed%2?60:200,80);x.stroke();x.fillStyle='#ffe7b0';x.beginPath();x.moveTo((seed%2?60:200)-18,90);x.lineTo((seed%2?60:200)+18,90);x.lineTo((seed%2?60:200)+10,66);x.lineTo((seed%2?60:200)-10,66);x.fill();
   if(seed%2===0){x.fillStyle='#1a1410';x.fillRect(90,40,70,50);x.fillStyle='#b4552e';x.fillRect(96,46,58,38);x.fillStyle='#e8b04a';x.beginPath();x.arc(125,62,10,0,7);x.fill()}
   x.fillStyle='#2f5d34';x.beginPath();x.ellipse(seed%2?210:30,165,18,30,0,0,7);x.fill();x.fillStyle='#5a3a22';x.fillRect((seed%2?210:30)-9,185,18,12);
   x.fillStyle='rgba(240,230,210,.35)';x.fillRect(0,0,22,256);x.fillRect(234,0,22,256);
   const t=new THREE.CanvasTexture(c);return t};
  const glows=[0,1,2,3,4,5,6,7].map(i=>{const t=room(i);return new THREE.MeshStandardMaterial({map:t,color:0x8a6a50,emissive:0xffd9a0,emissiveMap:t,emissiveIntensity:.62,roughness:.15})});let gi=0;const glowM=()=>glows[gi++%glows.length];
  const glass=new THREE.MeshStandardMaterial({color:0x9fc8e8,transparent:true,opacity:.28,roughness:.05,metalness:.6,depthWrite:false});
  const frame=new THREE.MeshStandardMaterial({color:0x1f2328,roughness:.4,metalness:.7}),led=new THREE.MeshBasicMaterial({color:0x7df9ff});
  // kő lábazat + földszint
  B(20,.8,9,VX,.4,VZ,stone);B(18,3.6,7.5,VX,2.6,VZ,plaster);
  // földszinti panorámaablakok keretekkel
  for(let i=0;i<5;i++){const x=VX-7+i*3.1;B(2.6,2.6,.08,x,2.5,VZ+3.79,glowM());B(2.6,2.6,.02,x,2.5,VZ+3.84,glass);B(.12,2.8,.12,x-1.35,2.5,VZ+3.82,frame);B(2.8,.12,.12,x,1.15,VZ+3.82,frame);B(2.8,.12,.12,x,3.85,VZ+3.82,frame);B(.06,2.6,.1,x,2.5,VZ+3.83,frame)}
  B(.12,2.8,.12,VX-7+4*3.1+1.35,2.5,VZ+3.82,frame);
  // bejárati ajtó
  B(1.6,2.8,.12,VX+8.2,2.2,VZ+3.8,wood);B(.1,.6,.1,VX+7.6,2.2,VZ+3.9,new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.9,roughness:.2}));
  // közbenső födém LED-csíkkal
  B(21,.45,10,VX+.5,4.6,VZ+.4,slab);B(21,.06,.06,VX+.5,4.37,VZ+5.42,led);
  // fával burkolt, kiugró felső szint
  B(13,3.2,7,VX-2,6.45,VZ-.5,wood);
  for(let i=0;i<3;i++){const x=VX-6+i*4;B(3.4,2.2,.08,x,6.5,VZ+3.03,glowM());B(3.4,2.2,.02,x,6.5,VZ+3.08,glass);B(3.6,.12,.12,x,5.35,VZ+3.06,frame);B(3.6,.12,.12,x,7.65,VZ+3.06,frame);B(.12,2.4,.12,x-1.75,6.5,VZ+3.06,frame);B(.12,2.4,.12,x+1.75,6.5,VZ+3.06,frame)}
  // terasz üvegkorláttal a felső szinten
  B(7,1.1,.06,VX+7.6,5.4,VZ+4.9,glass);B(.06,1.1,4.6,VX+11.05,5.4,VZ+2.6,glass);B(7,.06,.08,VX+7.6,5.97,VZ+4.9,frame);
  // lebegő tetőlemez LED-del
  B(16,.4,9,VX-1.5,8.25,VZ-.2,slab);B(16,.06,.06,VX-1.5,8.03,VZ+4.32,led);
  // fali lámpák
  [-8,-2,4].forEach(x=>{B(.3,.5,.2,VX+x,3.6,VZ+3.95,frame);const l=new THREE.Mesh(new THREE.BoxGeometry(.2,.2,.05),new THREE.MeshBasicMaterial({color:0xffd27a}));l.position.set(VX+x,3.45,VZ+4.06);sc.add(l)});
  // végtelenített medence márvány szegéllyel
  B(14,.5,.6,VX-2,.25,VZ+6.2,marble);B(14,.5,.6,VX-2,.25,VZ+10.8,marble);B(.6,.5,5.2,VX-8.7,.25,VZ+8.5,marble);B(.6,.5,5.2,VX+4.7,.25,VZ+8.5,marble);
  const wtr=new THREE.Mesh(new THREE.PlaneGeometry(12.8,4),new THREE.MeshStandardMaterial({color:0x39c6e6,map:pool.map,emissive:0x0b6c8c,emissiveIntensity:.8,roughness:.05,metalness:.2,transparent:true,opacity:.92}));wtr.rotation.x=-Math.PI/2;wtr.position.set(VX-2,.4,VZ+8.5);sc.add(wtr);L_pool=wtr;
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(12.8,4),new THREE.MeshBasicMaterial({color:0x7df9ff,transparent:true,opacity:.12}));pl.rotation.x=-Math.PI/2;pl.position.set(VX-2,.42,VZ+8.5);sc.add(pl);
  // napozóágyak
  [[-6.5],[-3.5]].forEach(([x])=>{B(1.1,.25,2.4,VX+x+7.5,.55,VZ+8.8,T('darkwood',1,1,0xb07a4a));B(1,.12,2.2,VX+x+7.5,.74,VZ+8.8,new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.9}))});
  // macskaköves út a villához
  B(3,.06,9,VX+8.2,.03,VZ+8.6,cob);
  // meleg fény a villa elől
  const vl=new (typeof _PL!=='undefined'?_PL:THREE.PointLight)(0xffc070,1.4,22,1.6);vl.position.set(VX,3,VZ+6);sc.add(vl);
 }
 // ===== LOBBY-TÁRGYAK =====
 {const TT=(k,rx,ry,c)=>TM?TM(k,rx,ry,c):new THREE.MeshStandardMaterial({color:c||0x888888});const PLc=typeof _PL!=='undefined'?_PL:THREE.PointLight;
  const add=(m,x,y,z)=>{m.position.set(x,y,z);m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});sc.add(m);return m};
  const bx=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  // tűzrakóhely kövekkel és lobogó tűzzel
  {const g=new THREE.Group();for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=new THREE.Mesh(new THREE.DodecahedronGeometry(.32,0),TT('stone',.3,.3,0x9a948c));r.position.set(Math.cos(a)*1,.2,Math.sin(a)*1);r.rotation.set(R(),R(),R());g.add(r)}
   const logM=TT('darkwood',.5,.2,0x6b4a2b);for(let i=0;i<3;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.3,8),logM);l.rotation.set(Math.PI/2,0,i*1.05);l.position.y=.18;g.add(l)}
   const flames=[];for(let i=0;i<3;i++){const f=new THREE.Mesh(new THREE.ConeGeometry(.28-i*.06,1-i*.2,8),new THREE.MeshBasicMaterial({color:[0xff6a00,0xffa500,0xffe066][i],transparent:true,opacity:.85-i*.1}));f.position.y=.6;g.add(f);flames.push(f)}
   const fl=new PLc(0xff8a30,2.2,12,1.8);fl.position.y=1.2;g.add(fl);add(g,-6.2,0,-8);LFX.push(t=>{flames.forEach((f,i)=>{f.scale.set(1+Math.sin(t*12+i)*.12,1+Math.sin(t*9+i*2)*.2,1+Math.cos(t*11+i)*.12);f.rotation.y=t*(1+i)});fl.intensity=2+Math.sin(t*17)*.4+Math.sin(t*7)*.3})}
  // kerti kanapék a tűz körül
  {const cush=new THREE.MeshStandardMaterial({color:0xf1ede4,roughness:.95}),frm=TT('darkwood',.6,.3,0x8a5a36);[[-8.9,-8.6,Math.PI/2+.2],[-4.0,-9.6,-Math.PI/2+.3]].forEach(([x,z,ry])=>{const g=new THREE.Group();const b=bx(2.6,.45,1,frm);b.position.y=.25;const c=bx(2.5,.22,.9,cush);c.position.y=.58;const bk=bx(2.6,.8,.2,frm);bk.position.set(0,.75,-.45);const bc=bx(2.4,.6,.15,cush);bc.position.set(0,.85,-.32);g.add(b,c,bk,bc);g.rotation.y=ry;add(g,x,0,z)})}
  // napernyő és nyugágyak a homokon
  {const g=new THREE.Group();const pole=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,3,8),new THREE.MeshStandardMaterial({color:0xe5e7eb,metalness:.6}));pole.position.y=1.5;
   const uc=document.createElement('canvas');uc.width=256;uc.height=16;const ux=uc.getContext('2d');for(let i=0;i<12;i++){ux.fillStyle=i%2?'#ffffff':'#ff4d6d';ux.fillRect(i*256/12,0,256/12+1,16)}
   const top=new THREE.Mesh(new THREE.ConeGeometry(1.8,.6,12,1,true),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(uc),side:THREE.DoubleSide,roughness:.8}));top.position.y=3;g.add(pole,top);add(g,3.6,0,-10.6)}
  {const towel=[0x38bdf8,0xfacc15];[[2.4,-9],[5.2,-8.8]].forEach(([x,z],i)=>{const g=new THREE.Group();const b=bx(.9,.15,2.2,TT('darkwood',.4,1,0xc89060));b.position.y=.35;const bk=bx(.9,.12,.9,TT('darkwood',.4,.4,0xc89060));bk.position.set(0,.65,-.95);bk.rotation.x=-.8;const tw=bx(.8,.04,2,new THREE.MeshStandardMaterial({color:towel[i],roughness:1}));tw.position.y=.45;g.add(b,bk,tw);[[-.4,.9],[.4,.9],[-.4,-.9],[.4,-.9]].forEach(([lx,lz])=>{const l=bx(.08,.3,.08,TT('darkwood',.1,.1,0x8a5a36));l.position.set(lx,.15,lz);g.add(l)});g.rotation.y=Math.PI-.2;add(g,x,0,z)})}
  // szörfdeszkák a pálmának támasztva
  {[0xf97316,0x22d3ee,0xa855f7].forEach((c,i)=>{const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(.32,2.2,4,10):new THREE.CylinderGeometry(.32,.32,2.6,10);const sb=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c,roughness:.3,metalness:.1}));sb.scale.z=.18;sb.rotation.z=.25+i*.08;sb.position.set(11.6+i*.55,1.45,-8.4);sb.castShadow=true;sc.add(sb)})}
  // fáklyák lánggal a terasz mentén
  [[-9.5,1.2],[-9.5,-4],[13.4,1.2],[13.4,-4]].forEach(([x,z])=>{const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,2.2,8),TT('bark',.2,1,0x8a6a4a));p.position.y=1.1;const cup=new THREE.Mesh(new THREE.CylinderGeometry(.16,.1,.3,8),new THREE.MeshStandardMaterial({color:0x3a2a1a}));cup.position.y=2.3;const f=new THREE.Mesh(new THREE.ConeGeometry(.12,.45,8),new THREE.MeshBasicMaterial({color:0xffa53a}));f.position.y=2.65;g.add(p,cup,f);add(g,x,0,z);LFX.push(t=>{f.scale.y=1+Math.sin(t*14+x)*.25;f.scale.x=f.scale.z=1+Math.cos(t*11+z)*.1})});
  // fényfüzér a pálmák között
  {const pts=[[-15,7.5,-12],[-11,6.2,-8],[-6,7,-6],[0,6.3,-6.5],[6,7,-6],[11,6.2,-7.5],[16,8,-14]].map(p=>new THREE.Vector3(...p));const cur=new THREE.CatmullRomCurve3(pts);sc.add(new THREE.Mesh(new THREE.TubeGeometry(cur,60,.02,4),new THREE.MeshBasicMaterial({color:0x222222})));
   const bulbs=[];const bc=[0xffd27a,0xff7ab0,0x7df9ff,0xa3e635];for(let i=0;i<=40;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),new THREE.MeshBasicMaterial({color:bc[i%4]}));b.position.copy(cur.getPoint(i/40));b.position.y-=.12;sc.add(b);bulbs.push(b)}
   LFX.push(t=>bulbs.forEach((b,i)=>{b.scale.setScalar(.8+(.6+.4*Math.sin(t*3+i*.7))*.4)}))}
  // neon KÖZPÉNZ ROYALE felirat a villán
  {const c=document.createElement('canvas');c.width=1024;c.height=180;const x=c.getContext('2d');x.font='bold 120px Luckiest Guy, Impact';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff3fa4';x.shadowBlur=30;x.fillStyle='#ffd1ec';x.fillText('KÖZPÉNZ ROYALE',512,95);x.shadowBlur=60;x.fillText('KÖZPÉNZ ROYALE',512,95);
   const nm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false});const n=new THREE.Mesh(new THREE.PlaneGeometry(10,1.76),nm);n.position.set(-6.5,9.4,-19.7);sc.add(n);LFX.push(t=>{nm.opacity=Math.sin(t*23)>-.97?(.88+Math.sin(t*2)*.08):.25})}
  // cserepes növények és lámpások a teraszon
  [[-8.8,-5.4],[12.4,-5.4],[-8.8,2.6],[12.4,2.6]].forEach(([x,z])=>{const g=new THREE.Group();const pot=new THREE.Mesh(new THREE.CylinderGeometry(.42,.32,.7,12),TT('conc',.4,.3,0xe8e2d8));pot.position.y=.45;g.add(pot);for(let i=0;i<7;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(.12,1.2,5),new THREE.MeshStandardMaterial({color:0x2f8f4e,roughness:.7}));l.position.set(Math.cos(i)*.15,1.25,Math.sin(i)*.15);l.rotation.set(Math.cos(i)*.5,0,Math.sin(i)*.5);g.add(l)}add(g,x,0,z)});
  [[-2.6,3.4],[5.4,3.4]].forEach(([x,z])=>{const g=new THREE.Group();const fm=new THREE.MeshStandardMaterial({color:0x1f2328,metalness:.7,roughness:.4});const bt=bx(.46,.08,.46,fm);bt.position.y=.2;const tp=bx(.5,.1,.5,fm);tp.position.y=.78;const hd=bx(.06,.18,.06,fm);hd.position.y=.92;g.add(bt,tp,hd);[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(([a,b])=>{const po=bx(.05,.55,.05,fm);po.position.set(a,.5,b);g.add(po)});const gl=bx(.34,.5,.34,new THREE.MeshBasicMaterial({color:0xffcf7a,transparent:true,opacity:.9}));gl.position.y=.49;g.add(gl);const ll=new PLc(0xffc070,.6,5,2);ll.position.y=.6;g.add(ll);add(g,x,0,z);LFX.push(t=>{gl.material.color.setHSL(.1,1,.6+Math.sin(t*5+x)*.06)})});
  // motorcsónak a vízen
  {const g=new THREE.Group();const hm=new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.3,metalness:.2});const hull=new THREE.Mesh(new THREE.BoxGeometry(6,1,2.2),hm);hull.position.y=.4;const nose=new THREE.Mesh(new THREE.ConeGeometry(1.1,2,4),hm);nose.rotation.z=-Math.PI/2;nose.rotation.x=Math.PI/4;nose.position.set(3.9,.4,0);nose.scale.set(1,1,.75);
   const stripe=new THREE.Mesh(new THREE.BoxGeometry(6.02,.18,2.22),new THREE.MeshStandardMaterial({color:0x2563eb}));stripe.position.y=.62;const cab=new THREE.Mesh(new THREE.BoxGeometry(1.8,.8,1.8),new THREE.MeshStandardMaterial({color:0x1e293b,metalness:.6,roughness:.15}));cab.position.set(.6,1.3,0);g.add(hull,nose,stripe,cab);g.position.set(26,-.1,-32);g.rotation.y=.4;sc.add(g);LFX.push(t=>{g.position.y=-.1+Math.sin(t*1.3)*.12;g.rotation.z=Math.sin(t*1.1)*.04})}
  // szentjánosbogarak
  {const n=60,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3),base=[];for(let i=0;i<n;i++)base.push([rnd(-18,18),rnd(.6,5),rnd(-16,6),R()*6]);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0xfff3a0,size:.12,transparent:true,opacity:.9}));sc.add(pts);
   LFX.push(t=>{for(let i=0;i<n;i++){const b=base[i];pos[i*3]=b[0]+Math.sin(t*.5+b[3])*.8;pos[i*3+1]=b[1]+Math.sin(t*.9+b[3]*2)*.4;pos[i*3+2]=b[2]+Math.cos(t*.4+b[3])*.8}geo.attributes.position.needsUpdate=true;pts.material.opacity=.6+Math.sin(t*2)*.3})}
 }
 // ===== BAL OLDAL: helikopter-leszállópálya, tiki bár, jakuzzi, sövény =====
 {const TT=(k,rx,ry,c)=>TM?TM(k,rx,ry,c):new THREE.MeshStandardMaterial({color:c||0x888888});const PLc=typeof _PL!=='undefined'?_PL:THREE.PointLight;
  const B=(w,h,d,x,y,z,m,g)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;(g||sc).add(b);return b};
  const C=(rt,rb,h,x,y,z,m,seg,g)=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||16),m);c.position.set(x,y,z);c.castShadow=c.receiveShadow=true;(g||sc).add(c);return c};
  const dark=new THREE.MeshStandardMaterial({color:0x1f2328,roughness:.4,metalness:.7}),white=new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.3,metalness:.3});
  // --- helikopter-leszállópálya ---
  {const HX=-25,HZ=-31;C(5.2,5.4,1.6,HX,.8,HZ,TT('conc',3,1,0x6b7280),40);
   const hc=document.createElement('canvas');hc.width=512;hc.height=512;const x=hc.getContext('2d');x.fillStyle='#2b2f36';x.fillRect(0,0,512,512);x.strokeStyle='#facc15';x.lineWidth=18;x.beginPath();x.arc(256,256,215,0,7);x.stroke();x.fillStyle='#fff';x.font='bold 300px Arial Black, Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('H',256,270);
   const top=new THREE.Mesh(new THREE.CircleGeometry(5.15,40),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(hc),roughness:.8}));top.rotation.x=-Math.PI/2;top.position.set(HX,1.62,HZ);sc.add(top);
   const lights=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,l=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshBasicMaterial({color:0x22c55e}));l.position.set(HX+Math.cos(a)*5.2,1.68,HZ+Math.sin(a)*5.2);sc.add(l);lights.push(l)}
   // helikopter
   const h=new THREE.Group();const body=new THREE.Mesh(new THREE.SphereGeometry(1.4,20,14),new THREE.MeshStandardMaterial({color:0x111827,roughness:.25,metalness:.6}));body.scale.set(1.6,1,1);body.position.y=1.5;h.add(body);
   const cock=new THREE.Mesh(new THREE.SphereGeometry(1.2,18,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x60a5fa,roughness:.05,metalness:.8,transparent:true,opacity:.75}));cock.rotation.z=-Math.PI/2;cock.position.set(.9,1.55,0);cock.scale.set(1,1.05,.95);h.add(cock);
   const stripe=new THREE.Mesh(new THREE.BoxGeometry(3.2,.18,2.25),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.9,roughness:.2}));stripe.position.y=1.5;h.add(stripe);
   const tail=new THREE.Mesh(new THREE.CylinderGeometry(.15,.35,4,10),body.material);tail.rotation.z=Math.PI/2;tail.position.set(-3.6,1.7,0);h.add(tail);
   const fin=B(.6,1.2,.08,-5.5,2.2,0,body.material,h);
   [-1,1].forEach(z=>{B(3.4,.1,.1,0,.25,z*.9,white,h);B(.08,.6,.08,.8,.55,z*.9,white,h);B(.08,.6,.08,-.8,.55,z*.9,white,h)});
   C(.12,.12,.6,0,2.75,0,dark,8,h);const rotor=new THREE.Group();rotor.position.y=3.05;h.add(rotor);[0,1].forEach(i=>{const bl=B(7.2,.05,.32,0,0,0,dark,rotor);bl.rotation.y=i*Math.PI/2});
   const trot=new THREE.Group();trot.position.set(-5.5,2.4,.12);h.add(trot);B(.06,1.6,.18,0,0,0,dark,trot);
   const beacon=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),new THREE.MeshBasicMaterial({color:0xff2a2a}));beacon.position.set(-5.5,2.9,0);h.add(beacon);
   h.scale.setScalar(1.4);h.position.set(-10,7.6,-25);h.rotation.y=.35;h.traverse(o=>{if(o.isMesh)o.castShadow=true});sc.add(h);
   LFX.push(t=>{h.position.y=7.6+Math.sin(t*.9)*.4;h.position.x=-10+Math.sin(t*.25)*1.5;h.rotation.z=Math.sin(t*.7)*.05;h.rotation.y=.35+Math.sin(t*.25)*.2;rotor.rotation.y=t*14;trot.rotation.z=t*4;beacon.material.color.setHex(Math.sin(t*5)>.6?0xff2a2a:0x330000);lights.forEach((l,i)=>l.material.color.setHex((Math.floor(t*6)%12)===i?0xffffff:0x22c55e))})}
  // --- tiki bár ---
  {const TX=-18,TZ=-15,g=new THREE.Group();const bam=TT('bark',.5,1.5,0xc49a64),thatch=new THREE.MeshStandardMaterial({color:0xc8a25a,roughness:1});
   B(4.4,1.2,1.1,0,.6,0,TT('darkwood',2,.6,0x8a5a36),g);B(4.6,.12,1.3,0,1.24,0,TT('tile',2,.4,0x1f2937),g);
   for(let i=0;i<9;i++){const c=C(.07,.07,1.15,-2.1+i*.52,.6,.58,bam,8,g)}
   [[-2.2,-.6],[2.2,-.6],[-2.2,1.6],[2.2,1.6]].forEach(([x,z])=>C(.12,.14,3.2,x,1.6,z,bam,8,g));
   const roof=new THREE.Mesh(new THREE.ConeGeometry(3.6,1.6,4,1),thatch);roof.rotation.y=Math.PI/4;roof.position.set(0,3.9,.5);roof.scale.set(1.15,1,.75);roof.castShadow=true;g.add(roof);
   for(let i=0;i<14;i++){const f=B(.06,.5,.06,-2.4+i*.37,2.95,-.75,thatch,g);f.rotation.x=.3}
   // polc üvegekkel
   B(3.6,.08,.3,0,1.9,1.45,TT('darkwood',1,.2,0x6b4a2b),g);const bc=[0x22c55e,0xef4444,0xf59e0b,0x60a5fa,0xa855f7,0xf1f5f9];for(let i=0;i<9;i++){C(.07,.08,.38,-1.6+i*.4,2.13,1.45,new THREE.MeshStandardMaterial({color:bc[i%6],transparent:true,opacity:.8,roughness:.05,metalness:.3}),8,g)}
   // koktélok a pulton
   [[-1.2,.2],[.3,-.1],[1.5,.25]].forEach(([x,z],i)=>{C(.12,.05,.25,x,1.43,z,new THREE.MeshStandardMaterial({color:[0xf472b6,0xfacc15,0x38bdf8][i],transparent:true,opacity:.85}),10,g);const u=new THREE.Mesh(new THREE.ConeGeometry(.16,.08,8),new THREE.MeshStandardMaterial({color:[0xef4444,0x22c55e,0xf97316][i]}));u.position.set(x+.05,1.62,z);g.add(u)});
   // bárszékek
   [-1.5,0,1.5].forEach(x=>{C(.3,.3,.08,x,1,-1.1,TT('darkwood',.3,.3,0x8a5a36),14,g);C(.05,.05,1,x,.5,-1.1,dark,8,g);C(.25,.28,.05,x,.03,-1.1,dark,12,g)});
   // neon "TIKI BÁR"
   const nc=document.createElement('canvas');nc.width=512;nc.height=128;const nx=nc.getContext('2d');nx.font='bold 84px Luckiest Guy, Impact';nx.textAlign='center';nx.textBaseline='middle';nx.shadowColor='#22d3ee';nx.shadowBlur=24;nx.fillStyle='#cffafe';nx.fillText('🌺 TIKI BÁR',256,68);nx.shadowBlur=40;nx.fillText('🌺 TIKI BÁR',256,68);
   const nm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(nc),transparent:true,depthWrite:false});const n=new THREE.Mesh(new THREE.PlaneGeometry(3.6,.9),nm);n.position.set(0,3.25,-.85);g.add(n);
   const bl=new PLc(0x22d3ee,1.4,9,1.8);bl.position.set(0,2.6,-1.4);g.add(bl);
   g.position.set(TX,0,TZ);g.rotation.y=.5;sc.add(g);LFX.push(t=>{nm.opacity=.85+Math.sin(t*3)*.12})}
  // --- jakuzzi gőzzel ---
  {const JX=-14.6,JZ=-9.6,g=new THREE.Group();const wood=TT('darkwood',2,.5,0x7a5232);
   const tub=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,.9,28,1,true),wood);tub.position.y=.45;g.add(tub);const rim=new THREE.Mesh(new THREE.TorusGeometry(1.7,.12,8,32),wood);rim.rotation.x=Math.PI/2;rim.position.y=.9;g.add(rim);
   const w=new THREE.Mesh(new THREE.CircleGeometry(1.62,28),new THREE.MeshStandardMaterial({color:0x5eead4,emissive:0x0e7490,emissiveIntensity:.9,roughness:.05,transparent:true,opacity:.9}));w.rotation.x=-Math.PI/2;w.position.y=.78;g.add(w);
   const jl=new PLc(0x2dd4bf,1.3,7,1.8);jl.position.y=1.1;g.add(jl);
   const steam=[];for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.12,depthWrite:false}));s.userData.o=R()*6;s.userData.r=R()*1.2;g.add(s);steam.push(s)}
   // törölközőtartó
   B(.08,1.2,.08,2.1,.6,-.6,dark,g);B(.08,1.2,.08,2.1,.6,.6,dark,g);B(.08,.06,1.3,2.1,1.15,0,dark,g);B(.04,.8,1.1,2.14,.8,0,new THREE.MeshStandardMaterial({color:0xfde68a,roughness:1}),g);
   g.position.set(JX,0,JZ);sc.add(g);
   LFX.push(t=>{steam.forEach(s=>{const k=((t*.35+s.userData.o)%1);s.position.set(Math.cos(s.userData.o)*s.userData.r,.9+k*2.4,Math.sin(s.userData.o)*s.userData.r);s.scale.setScalar(.6+k*1.4);s.material.opacity=.16*(1-k)});w.material.emissiveIntensity=.8+Math.sin(t*2)*.15})}
  // --- sövény kerti lámpákkal ---
  {const hedge=new THREE.MeshStandardMaterial({color:0x2f6b3a,roughness:1});const hm=TM?TM('grass',1.5,.5,0x3f7d45):hedge;
   for(let i=0;i<7;i++){const z=-6-i*3.4;B(1.1,1.3,3.3,-22.5,.65,z,hm);if(i%2===0){C(.06,.06,1,-21.6,.5,z,dark,8);const lp=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),new THREE.MeshBasicMaterial({color:0xfff1c4}));lp.position.set(-21.6,1.05,z);sc.add(lp)}}}
 }
 // ===== HANKÓ SZÁLLÍTÓ JÁRMŰ (furgon) =====
 {const g=new THREE.Group();const PLc=typeof _PL!=='undefined'?_PL:THREE.PointLight;
  const paint=new THREE.MeshStandardMaterial({color:0xf8fafc,roughness:.25,metalness:.35}),dark=new THREE.MeshStandardMaterial({color:0x111827,roughness:.5,metalness:.3}),
   glassM=new THREE.MeshStandardMaterial({color:0x0f2235,roughness:.05,metalness:.9}),chrome=new THREE.MeshStandardMaterial({color:0xd1d5db,roughness:.15,metalness:1}),
   tire=new THREE.MeshStandardMaterial({color:0x0b0b0b,roughness:.9}),stripe=new THREE.MeshStandardMaterial({color:0x2563eb,roughness:.3,metalness:.3});
  const B=(w,h,d,x,y,z,m)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=b.receiveShadow=true;g.add(b);return b};
  // felirat-textúra a raktér oldalára
  const decal=(()=>{const c=document.createElement('canvas');c.width=1024;c.height=420;const x=c.getContext('2d');
   const bg=x.createLinearGradient(0,0,1024,0);bg.addColorStop(0,'#ffffff');bg.addColorStop(1,'#eef2f7');x.fillStyle=bg;x.fillRect(0,0,1024,420);
   x.fillStyle='#1d4ed8';x.beginPath();x.moveTo(0,300);x.bezierCurveTo(300,250,600,380,1024,280);x.lineTo(1024,420);x.lineTo(0,420);x.fill();
   x.fillStyle='#facc15';x.beginPath();x.moveTo(0,330);x.bezierCurveTo(300,285,600,400,1024,310);x.lineTo(1024,322);x.bezierCurveTo(600,412,300,297,0,342);x.fill();
   x.fillStyle='#ef4444';x.beginPath();x.arc(120,140,78,0,7);x.fill();x.fillStyle='#fff';x.font='bold 90px Arial Black, Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('H',120,146);
   x.textAlign='left';x.fillStyle='#0b1f4d';x.font='bold 112px Luckiest Guy, Impact, Arial Black';x.fillText('HANKÓ',225,108);
   x.fillStyle='#1d4ed8';x.font='bold 64px Luckiest Guy, Impact, Arial Black';x.fillText('SZÁLLÍTÓ JÁRMŰ',228,200);
   x.fillStyle='#475569';x.font='bold 30px Arial';x.fillText('Gyors · Megbízható · Közpénzből  ☎ 06-1-HANKÓ',230,252);
   const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t})();
  const decalM=new THREE.MeshStandardMaterial({map:decal,roughness:.3,metalness:.2});
  // alváz, raktér, fülke
  B(7.4,.35,2.3,0,.75,0,dark);
  const box=new THREE.Mesh(new THREE.BoxGeometry(4.6,2.5,2.3),[paint,paint,paint,paint,decalM,decalM]);box.position.set(-1.25,2.2,0);box.castShadow=box.receiveShadow=true;g.add(box);
  // a hátsó oldalra is (tükrözve a +z/-z oldalon is olvasható)
  B(2.5,2,2.25,2.4,1.95,0,paint);B(1.3,1.2,2.25,3.55,1.5,0,paint);
  // szélvédő és oldalablakok
  const ws=B(.08,1.05,2.05,3.2,2.45,0,glassM);ws.rotation.z=-.42;[1.13,-1.13].forEach(z=>{B(1.5,.85,.04,2.35,2.45,z,glassM)});
  // lökhárítók, hűtőrács, lámpák
  B(.2,.4,2.4,4.25,.95,0,chrome);B(.06,.5,1.4,4.21,1.55,0,dark);for(let i=0;i<4;i++)B(.07,.04,1.3,4.24,1.38+i*.12,0,chrome);
  const hl=new THREE.MeshBasicMaterial({color:0xfff6d6});[.82,-.82].forEach(z=>{B(.06,.28,.42,4.22,1.62,z,hl)});
  const tl=new THREE.MeshBasicMaterial({color:0xff2a2a});[1,-1].forEach(z=>{B(.06,.5,.22,-3.57,1.4,z*.98,tl)});
  B(.2,.3,2.4,-3.65,.9,0,chrome);
  // hátsó ajtók
  B(.05,2.3,1.08,-3.57,2.2,.56,paint);B(.05,2.3,1.08,-3.57,2.2,-.56,paint);B(.08,.5,.06,-3.6,2.1,.08,chrome);B(.08,.5,.06,-3.6,2.1,-.08,chrome);
  // visszapillantók
  [1.25,-1.25].forEach(z=>{B(.12,.3,.18,2.95,2.4,z,dark)});
  // csíkok és oldalsó lépcső
  [1.16,-1.16].forEach(z=>{B(2.5,.12,.02,2.4,1.25,z,stripe)});
  // tetőn villogó fénycső
  B(1.2,.18,.5,2.3,3.04,0,dark);const lb1=B(.45,.15,.4,2.05,3.2,0,new THREE.MeshBasicMaterial({color:0xffa500})),lb2=B(.45,.15,.4,2.55,3.2,0,new THREE.MeshBasicMaterial({color:0xffa500}));
  // kerekek felnivel
  const wg=new THREE.CylinderGeometry(.55,.55,.38,24),rg=new THREE.CylinderGeometry(.32,.32,.4,16);
  [[2.7,1.08],[2.7,-1.08],[-2.3,1.08],[-2.3,-1.08]].forEach(([x,z])=>{const w=new THREE.Mesh(wg,tire);w.rotation.x=Math.PI/2;w.position.set(x,.55,z);w.castShadow=true;g.add(w);const r=new THREE.Mesh(rg,chrome);r.rotation.x=Math.PI/2;r.position.set(x,.55,z*1.02);g.add(r);
   for(let k=0;k<5;k++){const sp=new THREE.Mesh(new THREE.BoxGeometry(.08,.5,.06),chrome);sp.position.set(x,.55,z*1.05);sp.rotation.z=k/5*Math.PI;g.add(sp)}
   B(1.3,.12,.5,x,1.12,z*.98,dark)});
  // fényszórók fénye
  const hlL=new PLc(0xfff1c4,1.6,14,1.8);hlL.position.set(5.2,1.6,0);g.add(hlL);
  g.position.set(10.5,0,-16.5);g.rotation.y=-.08;sc.add(g);
  LFX.push(t=>{const on=Math.sin(t*8)>0;lb1.material.color.setHex(on?0xffd000:0x553300);lb2.material.color.setHex(on?0x553300:0xffd000)})}

 // kutya a játékos mellett
 const dog=animal3d?animal3d('dog',.9):null;if(dog){dog.position.set(2,.3,1.2);dog.rotation.y=-2.2;sc.add(dog)}
 const back=new (typeof _PL!=="undefined"?_PL:THREE.PointLight)(0x0f5e6e,0,14,1.5);back.position.set(0,3.2,-2.6);sc.add(back);
 L={r,sc,cam,peds,dog,me:null,rotY:0,drag:null,emoT:0,t:0,back,fx:LFX};window.LB3D=L;
 const ray=new THREE.Raycaster(),mp=new THREE.Vector2();
 const pedAt=e=>{const r2=cv.getBoundingClientRect();mp.set((e.clientX-r2.left)/r2.width*2-1,-(e.clientY-r2.top)/r2.height*2+1);ray.setFromCamera(mp,cam);let hit=null;peds.forEach((p,i)=>{if(i===0||p.mate)return;const o=ray.ray.origin,d=ray.ray.direction;for(let y=0;y<=2.6;y+=.4){const t=(y-o.y)/d.y;if(t<=0)continue;const x=o.x+d.x*t,z=o.z+d.z*t;if(Math.hypot(x-p.x,z-p.z)<1.7){hit=p;break}}});return hit};
 cv.addEventListener('pointermove',e=>{const h=pedAt(e);cv.style.cursor=h?'pointer':'';peds.forEach(p=>{p.hover=p===h})});
 cv.addEventListener('click',e=>{if(Math.abs((L.dragStart||e.clientX)-e.clientX)>5)return;const h=pedAt(e);if(h)friendsUI()});
 cv.addEventListener('pointerdown',e=>{L.drag=e.clientX;L.dragStart=e.clientX});addEventListener('pointerup',()=>L.drag=null);addEventListener('pointermove',e=>{if(L.drag!==null){L.rotY+=(e.clientX-L.drag)*.01;L.drag=e.clientX}});
 refreshAvatar()}
function avatarFor(c,em){const m=person(c,em,1.05);m.children.forEach(ch=>{if(ch.isSprite){ch.scale.multiplyScalar(.38);ch.position.y=2.95}});return m}
function refreshAvatar(){if(!L)return;if(L.me)L.sc.remove(L.me);const B=window.BR,COS=window.BRCOS||[],sk=B&&COS.find(c=>c.id===B.eq.skin),ch=S.ch||CH[0];const col=sk&&sk.id!=='s_def'?sk.c:ch.c,em=sk&&sk.id!=='s_def'?sk.e:ch.e;
 const m=avatarFor(col,em);const bk=B&&COS.find(c=>c.id===B.eq.back);if(bk&&bk.e){const s=spr(bk.e,1.5);s.material.depthTest=true;s.position.set(0,1.7,-.6);m.add(s)}m.traverse(o=>{if(o.isMesh)o.castShadow=true});m.position.set(0,.3,0);L.sc.add(m);L.me=m;const bl=window.charBackLight&&charBackLight(em);if(L.back){L.back.intensity=bl?3:0;if(bl)L.back.color.setHex(bl)}$('lbAv').firstChild.textContent=em}
function updParty(){if(!L)return;const others=(ACC.party.members||[]).filter(x=>x.name!==ACC.user.name);
 L.peds.forEach((p,i)=>{if(i===0)return;if(p.av){L.sc.remove(p.av);p.av=null}const o=others[i-1];p.ring.visible=!!o;p.disk.material.opacity=o?.35:0;if(o){const c=parseInt((o.color||'#ffd23f').slice(1),16);p.av=avatarFor(c,o.avatar||'😎');p.av.position.set(p.x,.3,p.z);p.av.rotation.y=-.25*Math.sign(p.x);L.sc.add(p.av);p.mate=o}else p.mate=null});
 const inP=(ACC.party.members||[]).length>1,sp=window.GAME_MODE==='sotet',fk=window.GAME_MODE==='flakon'||sp,stw=window.GAME_MODE==='stw'||fk;Q('#lbPlay h2').textContent=sp?'SÖTÉT PROGRAM':fk?'FLAKONVADÁSZAT':window.GAME_MODE==='stw'?'MENTSD MEG A VILÁGOT':'KÖZPÉNZ ROYALE';$('lbTeam').style.display=stw?'none':'grid';$('lbMode').innerHTML=(sp?'🕶️ SÖTÉT PROGRAM':fk?'♻️ FLAKONOZÁS':stw?'🌍 KALAND':'⚔️ BATTLE ROYALE')+' · '+(stw?(inP?'PARTI '+ACC.party.members.length+'/4':'SOLO'):({solo:'SOLO',duo:'DUO',trio:'TRIÓ',squad:'SQUAD'})[window.GAME_TEAM||'solo'])+(inP&&!stw?' · PARTI '+ACC.party.members.length+'/4':'')+'<small>'+(sp?'EGYEDÜL · LAKÓKOCSI · LABOR, FŐZDE, DÍLERKEDÉS · 300 TÁRGY':fk?'EGYEDÜL · 5 PERC · E = FELVÉTEL (3 MP) · 50 FT':stw?'NYITOTT VILÁG · 9 TÁJ · 18 KÜLDETÉS':'25 JÁTÉKOS · '+({solo:'EGYEDÜL',duo:'2 FŐS CSAPATOK',trio:'3 FŐS CSAPATOK',squad:'4 FŐS CSAPATOK'})[window.GAME_TEAM||'solo'])+' · kattints a váltáshoz</small>';
 const leader=!inP||ACC.party.leader===ACC.user.name,allReady=inP&&ACC.party.members.every(m=>m.ready||m.name===ACC.party.leader);
 const go=$('lbGo');go.classList.toggle('wait',inP&&!leader);go.textContent=inP&&!leader?(ACC.ready?'KÉSZ ✔':'KÉSZ VAGYOK?'):(inP&&!allReady?'JÁTÉK (nem mindenki kész)':'JÁTÉK');if(inP&&!allReady&&leader)go.style.fontSize='24px';else go.style.fontSize='';
 renderUsers()}
function draw3D(){if(!L||!lb.classList.contains('on'))return;requestAnimationFrame(draw3D);const W=innerWidth,H=innerHeight;if(L.r.domElement.width!==Math.floor(W*L.r.getPixelRatio())){L.r.setSize(W,H,false);L.cam.aspect=W/H;L.cam.updateProjectionMatrix()}
 const _n=performance.now(),_dt=Math.min(.05,Math.max(.001,((_n-(L._lt||_n))/1000)||1/60));L._lt=_n;L.t+=_dt;const t=L.t;if(L.me)danceStep(L.me,_dt,t);
 L.peds[0].disk.material.opacity=.4+Math.sin(t*3)*.15;L.peds.forEach((p,i)=>{if(i===0||p.mate)return;p.ring.visible=!!p.hover;p.disk.material.opacity=p.hover?.35+Math.sin(t*6)*.1:0});if(L.dog){L.dog.position.y=.3+Math.abs(Math.sin(t*5))*.05;L.dog.children.forEach(c=>{if(c.userData.tail)c.rotation.y=Math.sin(t*12)*.6})}
 if(L.fx)L.fx.forEach(f=>f(t));
 if(L_pool&&L_pool.material.map){L_pool.material.map.offset.x=Math.sin(t*.4)*.05;L_pool.material.emissiveIntensity=.7+Math.sin(t*1.3)*.15}
 if(!(L._cov||(L._cov=['vs2','pets','outf','cs'].map(i=>document.getElementById(i)).filter(Boolean))).some(e=>e.classList.contains('on')))L.r.render(L.sc,L.cam);
 // névcímke a játékos fölött, + jelek a szabad helyeken
 const pj=(x,y,z)=>{const v=new THREE.Vector3(x,y,z).project(L.cam);return[(v.x+1)/2*W,(1-v.y)/2*H]};
 const[nx,ny]=pj(0,3.55,0);const inP=(ACC.party.members||[]).length>1;const _nm=$('lbName');const _pos=Math.round(nx)+','+Math.round(ny);if(_nm._p!==_pos){_nm._p=_pos;_nm.style.left=Math.round(nx)+'px';_nm.style.top=Math.round(ny)+'px'}
 const _h='<div class="lbTag"><span class="cr">'+(inP&&ACC.party.leader===ACC.user.name?'👑':'⭐')+'</span><div><b>'+esc(ACC.user?ACC.user.name:'')+'</b><span style="color:'+(ACC.ready||!inP||ACC.party.leader===ACC.user.name?'#4ade80':'#ff6b81')+'">'+(inP?(ACC.ready||ACC.party.leader===ACC.user.name?'Kész':'Nem kész'):(ACC.guest?'Vendég':'Online'))+'</span></div></div>';if(_nm._h!==_h){_nm._h=_h;_nm.innerHTML=_h}
 L.peds.forEach((p,i)=>{if(i===0)return;const _sig=p.mate?'m|'+p.mate.name+'|'+p.mate.ready:'p';if(p._el&&p._el.isConnected&&p._sig===_sig){if(!p.mate&&p._hv!==!!p.hover){p._hv=!!p.hover;p._el.classList.toggle('hov',p._hv)}const[x,y]=pj(p.x,p.mate?3.55:1.6,p.z);const k=Math.round(x)+','+Math.round(y);if(p._k!==k){p._k=k;p._el.style.left=Math.round(x)+'px';p._el.style.top=Math.round(y)+'px'}return}if(p._el)p._el.remove();p._sig=_sig;p._k='';if(p.mate){const[x,y]=pj(p.x,3.55,p.z);const d=document.createElement('div');d.className='lbMate';p._el=d;d.style.left=x+'px';d.style.top=y+'px';d.innerHTML=esc(p.mate.name)+'<br><span style="color:'+(p.mate.ready?'#4ade80':'#ff6b81')+'">'+(p.mate.ready?'Kész':'Nem kész')+'</span>';lb.appendChild(d)}else{const[x,y]=pj(p.x,1.6,p.z);const d=document.createElement('div');p._el=d;d.className='lbPlus'+(p.hover?' hov':'');d.innerHTML='+<small>MEGHÍVÁS</small>';d.title='Barátlista / meghívás';d.onmouseenter=()=>{p.hover=true};d.onmouseleave=()=>{p.hover=false};d.style.left=x+'px';d.style.top=y+'px';d.onclick=()=>friendsUI();lb.appendChild(d)}})}

// ---------------- Lobby működés ----------------
let ci=0;const updChar=()=>{const c=CH[ci];S.ch=c;$('lbCn').innerHTML='<span style="font-size:20px">'+c.e+'</span> '+esc(c.n.replace(' ★PREMIUM★',''))+'<br><small style="color:#94a3b8">HP '+c.hp+' · PAJZS '+c.sh+'</small>';refreshAvatar()};
$('lbCp').onclick=()=>{ci=(ci+CH.length-1)%CH.length;updChar()};$('lbCx').onclick=()=>{ci=(ci+1)%CH.length;updChar()};
window.GAME_MODE=localStorage.getItem('ry_mode')||'royale';window.GAME_TEAM=localStorage.getItem('ry_team')||'solo';
function teamUI(){const T=[['solo','SOLO'],['duo','DUO'],['trio','TRIÓ'],['squad','SQUAD']];$('lbTeam').innerHTML=T.map(([k,n])=>'<button data-k="'+k+'" style="padding:7px 0;border:0;border-radius:8px;cursor:pointer;font:15px Luckiest Guy,Impact;'+(window.GAME_TEAM===k?'background:#ffd23f;color:#0b1022':'background:#1e293b;color:#cbd5e1')+'">'+n+'</button>').join('');
 $('lbTeam').querySelectorAll('button').forEach(b=>b.onclick=()=>{window.GAME_TEAM=b.dataset.k;localStorage.setItem('ry_team',b.dataset.k);teamUI();updParty();try{sfx('click')}catch(e){}})}
teamUI();
$('lbMode').onclick=()=>{window.GAME_MODE=({royale:'stw',stw:'flakon',flakon:'sotet',sotet:'royale'})[window.GAME_MODE]||'royale';localStorage.setItem('ry_mode',window.GAME_MODE);updParty();try{sfx('click')}catch(e){}};
function startMatch(){if(G&&run)return;lb.classList.remove('on');$('lbChat').classList.remove('on');launch();wsend({t:'status',status:'match'})}
$('lbGo').onclick=()=>{if(window.GAME_MODE==='sotet'){window.openSotet3D&&openSotet3D();return}const inP=(ACC.party.members||[]).length>1;if(inP&&ACC.party.leader!==ACC.user.name){ACC.ready=!ACC.ready;wsend({t:'ready',ready:ACC.ready});return}if(inP&&window.GAME_MODE!=='flakon')wsend({t:'start',mode:window.GAME_MODE,team:window.GAME_TEAM});if(inP&&window.GAME_MODE==='flakon')toast('♻️ A Flakonvadászat egyszemélyes – egyedül indulsz.');startMatch()};
// ---------- TÁNCOK ----------
const DANCES=[
 {n:'Lakodalmas',e:'💃',d:4,f:(t)=>({y:Math.abs(Math.sin(t*7))*.25,ry:Math.sin(t*3.5)*.5,la:[-2.6+Math.sin(t*7)*.5,.3],ra:[-2.6-Math.sin(t*7)*.5,-.3],ll:[Math.sin(t*7)*.4,0],rl:[-Math.sin(t*7)*.4,0]})},
 {n:'Integetés',e:'👋',d:3,f:(t)=>({ra:[-2.8,-.3+Math.sin(t*10)*.45],la:[0,.1],ry:.2})},
 {n:'Robot',e:'🤖',d:4,f:(t)=>{const k=Math.floor(t*3)%4;return{ry:[0,.6,0,-.6][k],la:[[-1.57,0],[0,0],[-1.57,.6],[0,0]][k],ra:[[0,0],[-1.57,0],[0,0],[-1.57,-.6]][k],y:k%2?.05:0}}},
 {n:'Csárdás',e:'🪗',d:4,f:(t)=>{const s=Math.sin(t*8);return{y:Math.abs(s)*.2,ll:[s>0?-1.1*s:0,0],rl:[s<0?1.1*s:0,0],la:[-.5,.5+Math.sin(t*16)*.2],ra:[-.5,-.5-Math.sin(t*16)*.2],ry:Math.sin(t*2)*.4}}},
 {n:'Kétharmados Flex',e:'💪',d:3,f:(t)=>({la:[-1.2,1.4],ra:[-1.2,-1.4],y:Math.sin(t*6)*.04,ry:Math.sin(t*1.5)*.6})},
 {n:'Terpesz-ugrás',e:'🤸',d:3,f:(t)=>{const o=(Math.sin(t*9)+1)/2;return{y:Math.abs(Math.sin(t*9))*.45,la:[0,o*2.6],ra:[0,-o*2.6],ll:[0,o*.4],rl:[0,-o*.4]}}},
 {n:'Pörgés',e:'🌀',d:3,f:(t)=>({ry:Math.min(1,t/3)*Math.PI*8,y:Math.abs(Math.sin(t*6))*.3,la:[0,1.4],ra:[0,-1.4]})},
 {n:'Taps a Sajtónak',e:'👏',d:3,f:(t)=>{const c=Math.sin(t*14)*.35;return{la:[-1.3,.6+c],ra:[-1.3,-.6-c],y:Math.abs(Math.sin(t*7))*.05}}},
 {n:'Hullám',e:'🌊',d:4,f:(t)=>({la:[Math.sin(t*5)*.6,1.5+Math.sin(t*5)*.5],ra:[Math.sin(t*5+1.6)*.6,-1.5-Math.sin(t*5+1.6)*.5],ry:Math.sin(t*2.5)*.3,y:Math.sin(t*5)*.05})},
];
window.LB_DANCES=DANCES;let cur=null,curT=0,lastD=0;
function limbs(m){if(m.userData.limbs)return m.userData.limbs;const o={};m.traverse(c=>{if(c.userData&&c.userData.limb)o[c.userData.limb]=c});return m.userData.limbs=o}
function danceStep(m,dt,t){const L2=limbs(m);let p={};if(cur){curT+=dt;p=cur.f(curT);if(curT>=cur.d){cur=null;p={};m.rotation.y-=Math.round((m.rotation.y-L.rotY)/(Math.PI*2))*Math.PI*2}}
 const set=(k,v)=>{const c=L2[k];if(!c)return;const tx=v?v[0]:0,tz=v?-v[1]:0;c.rotation.x+=(tx-c.rotation.x)*.3;c.rotation.z+=(tz-c.rotation.z)*.3};
 set('larm',p.la);set('rarm',p.ra);set('lleg',p.ll);set('rleg',p.rl);
 const ty=L.rotY+Math.sin(t*.6)*.12+(p.ry||0);m.rotation.y+=(ty-m.rotation.y)*(cur?.5:.12);const yy=.3+(p.y!==undefined?p.y:Math.sin(t*2)*.03);m.position.y+=(yy-m.position.y)*.5}
window.lbDance=i=>{cur=DANCES[i];curT=0;lastD=i;$('lbEmoPick').style.display='none';try{sfx('magic')}catch(e){}};
{const pk=document.createElement('div');pk.id='lbEmoPick';pk.style.cssText='position:absolute;right:24px;bottom:90px;display:none;grid-template-columns:repeat(3,96px);gap:8px;padding:12px;border-radius:18px;background:#0b1022ee;border:1px solid #ffffff2a;backdrop-filter:blur(10px);z-index:6;box-shadow:0 20px 50px #000a';
 pk.innerHTML=DANCES.map((d,i)=>'<button onclick="lbDance('+i+')" style="height:86px;border:0;border-radius:14px;background:linear-gradient(160deg,#1e293b,#0f172a);color:#fff;cursor:pointer;font:700 13px Rajdhani;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px"><span style="font-size:34px">'+d.e+'</span>'+d.n+'</button>').join('');lb.appendChild(pk)}
$('lbEmo').onclick=()=>{const pk=$('lbEmoPick');pk.style.display=pk.style.display==='grid'?'none':'grid'};
$('lbEmo').oncontextmenu=e=>{e.preventDefault();lbDance(lastD)};
$('lbLv').onclick=()=>brBP();$('lbTr').onclick=()=>troGui();
lb.querySelectorAll('#lbTop .tab').forEach(t=>t.onclick=()=>{const k=t.dataset.t;if(k==='locker')brLocker();else if(k==='shop')brShop();else if(k==='bp')brBP();else if(k==='career')career();else if(k==='casino')openCasino('r');else if(k==='vsport')openVSport();else if(k==='valto')openValto();else if(k==='pets')openPets();else if(k==='flakon')openFlakon();else if(k==='codex'){lb.classList.remove('on');go('cod')}else if(k==='set')setUI('menuBack')});
$('lbAv').onclick=()=>{const u=ACC.user;guiOpen('<h1 class="f" style="font-size:30px">👤 PROFIL</h1><div style="font-size:60px">'+esc($('lbAv').firstChild.textContent)+'</div><div class="f" style="font-size:26px">'+esc(u.name)+'</div><div style="color:#cbd5e1;margin:6px">'+(ACC.guest?'Vendég fiók (offline)':'Regisztrálva: '+new Date(u.created).toLocaleDateString('hu-HU'))+'</div>'+bB(ACC.guest?'🔑 BELÉPÉS / REGISZTRÁCIÓ':'🚪 KIJELENTKEZÉS','lbLogout()','r')+bB('VISSZA','guiClose()','c'))};
window.lbLogout=async function(){guiClose();try{if(!ACC.guest)await api('/api/logout',{})}catch(e){}localStorage.removeItem('ry_token');ACC.token='';if(ACC.ws){const w=ACC.ws;ACC.ws=null;w.close()}ACC.user=null;ACC.guest=false;ACC.party={leader:null,members:[]};lb.classList.remove('on');au.classList.add('on')};
async function career(){let lbList=[];try{if(ONLINE_OK)lbList=(await api('/api/leaderboard')).list}catch(e){}const u=ACC.user,s=u.stats||{};
 guiOpen('<h1 class="f" style="font-size:30px">📈 KARRIER</h1><div class="g" style="text-align:center"><div class="it"><div class="f" style="font-size:30px;color:var(--y)">'+(s.wins||0)+'</div><small>GYŐZELEM</small></div><div class="it"><div class="f" style="font-size:30px;color:var(--y)">'+(s.kills||0)+'</div><small>ELIMINÁCIÓ</small></div><div class="it"><div class="f" style="font-size:30px;color:var(--y)">'+(s.games||0)+'</div><small>MECCS</small></div><div class="it"><div class="f" style="font-size:30px;color:var(--y)">'+(u.level||1)+'</div><small>FIÓKSZINT</small></div></div>'+
 (lbList.length?'<h2 class="f" style="margin-top:14px">🏆 RANGLISTA</h2><div style="text-align:left;max-height:40vh;overflow-y:auto">'+lbList.map((x,i)=>'<div class="it" style="display:flex;justify-content:space-between;margin:4px 0;cursor:default"><span><b style="color:var(--y)">#'+(i+1)+'</b> '+esc(x.avatar)+' '+esc(x.name)+'</span><span>🏆 '+x.stats.wins+' · 💀 '+x.stats.kills+'</span></div>').join('')+'</div>':'<div style="color:#94a3b8;margin:10px">A ranglista szerverrel érhető el.</div>')+bB('🏅 TRÓFEÁK','troGui()','p')+bB('VISSZA','guiClose()','r'))}
function showLobby(){$('menu').classList.remove('on');lb.classList.add('on');if(!L)build3D();else refreshAvatar();updParty();Q('#lbZs span').textContent=Math.round((window.BR||{}).zs||0).toLocaleString('hu-HU');Q('#lbLv span').textContent=Math.min(40,Math.floor(((window.BR||{}).bpx||0)/1000));draw3D();wsend({t:'status',status:'lobby'})}
window.showLobby=showLobby;
// a régi főmenü helyett a lobby
WP('go',null,a=>{if(a[0]==='menu'&&ACC.user&&!(G&&run)&&!window._lbLaunching)showLobby()});
WP('guiClose',null,()=>{if(lb.classList.contains('on')){refreshAvatar();Q('#lbZs span').textContent=Math.round((window.BR||{}).zs||0).toLocaleString('hu-HU')}});
// meccs eredmény mentése a fiókba
WP('end',null,a=>{const g=G;if(!g)return;const kills=g.kills|0,win=!!a[0];if(ACC.user&&ACC.user.stats){ACC.user.stats.games++;ACC.user.stats.kills+=kills;if(win)ACC.user.stats.wins++}if(!ACC.guest&&ONLINE_OK)api('/api/match',{kills,win,mode:window.GAME_MODE||'royale'}).then(r=>ACC.user=r.user).catch(()=>{});wsend({t:'status',status:'lobby'})});
// a játékos neve a kill feedben
WP('kill',null,()=>{const k=$('prKF');if(k&&ACC.user){const f=k.firstChild;if(f&&f.innerHTML.includes('>TE<'))f.innerHTML=f.innerHTML.replace('>TE<','>'+esc(ACC.user.name)+'<')}});
// a GUI-k a lobby fölött jelenjenek meg
{const st2=document.createElement('style');st2.textContent='#gui{z-index:10!important}#cod{z-index:10!important}';document.head.appendChild(st2)}
WP('go',null,a=>{if(a[0]==='cod'){$('cod').querySelector('.b.r').onclick=()=>{$('cod').classList.remove('on');showLobby()}}});
WP('launch',a=>{window._lbLaunching=true;if(GUI.on){GUI.wasRun=false;GUI.on=false;$('gui').classList.remove('on')}const lu=document.getElementById('lvUp');if(lu)lu.classList.remove('on');['vs','fk','csn'].forEach(i=>{const e=document.getElementById(i);if(e)e.classList.remove('on')});lb.classList.remove('on');$('lbChat').classList.remove('on')},()=>{window._lbLaunching=false;lb.classList.remove('on')});
setInterval(()=>{if(!lb.classList.contains('on'))return;Q('#lbZs span').textContent=Math.round((window.BR||{}).zs||0).toLocaleString('hu-HU');Q('#lbFt span').textContent=Math.round(S.c||0).toLocaleString('hu-HU')},800);
updChar();boot();
})();
