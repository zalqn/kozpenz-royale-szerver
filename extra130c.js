// extra130c.js – TESTRESZABÁS & ÁLLATOK (x13c): ejtőernyő-skinek, nyomvonal, névkártya, aura, ruhaszín (HSL),
// bemutató-póz, második háziállat, etetés/kedv, ritka fajták tojásból, kutya-emote-ok (B = gyorsmenü a lobbyban)
(function(){
'use strict';
const KEY='k3x13c';
const D0={chute:'',chutes:{},trail:'',trails:{},card:{col:'#facc15',icon:'👑',frame:'arany',title:'Közpénz-bajnok'},aura:1,hsl:{on:0,h:0,s:0,l:0},pose:'laza',
 pet2:null,eggs:0,care:{dog:{h:80,m:80},p2:{h:80,m:80},t:Date.now(),day:'',pt:0}};
let ST;try{ST=Object.assign({},D0,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){ST=Object.assign({},D0)}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const gG=()=>{try{return G}catch(e){return null}},gRun=()=>{try{return run}catch(e){return false}},gSc=()=>{try{return scene}catch(e){return null}},hasS=()=>{try{return !!S}catch(e){return false}};
const ft=()=>hasS()?S.c:0;
const pay=n=>{if(!hasS()||S.c<n){toast('Nincs elég pénz! ('+n.toLocaleString('hu')+' Ft)');return false}S.c-=n;try{save()}catch(e){}return true};
const earn=n=>{if(!hasS())return;S.c+=n;try{save()}catch(e){}};
const lv=()=>(hasS()&&S.lv)||1;
const inLobby=()=>{const l=document.getElementById('lb');return l&&l.classList.contains('on')&&window.LB3D&&LB3D.sc&&!document.querySelector('#cs.on')};

// ---------- ADATOK ----------
const CHUTES=[
 {id:'',n:'Alap ernyő',p:0,c:['#ffffff']},
 {id:'tri',n:'Trikolór',p:1500,c:['#dc2626','#ffffff','#16a34a']},
 {id:'zebra',n:'Zebra',p:2000,c:['#111111','#f5f5f5']},
 {id:'naple',n:'Naplemente',p:3000,c:['#f97316','#facc15','#ec4899']},
 {id:'ocean',n:'Óceán',p:3000,c:['#0ea5e9','#1e3a8a','#22d3ee']},
 {id:'erdo',n:'Erdei terep',p:3500,c:['#365314','#4d7c0f','#78350f']},
 {id:'cukor',n:'Vattacukor',p:4000,c:['#f9a8d4','#c4b5fd','#a5f3fc']},
 {id:'arany',n:'Aranybánya',p:8000,c:['#facc15','#b45309'],gl:1},
 {id:'ejfel',n:'Éjféli neon',p:10000,c:['#0f172a','#a855f7','#22d3ee'],gl:1}];
const TRAILS=[
 {id:'',n:'Nincs',p:0},
 {id:'szikra',n:'Szikra',p:800,f:i=>[1,.6+Math.random()*.4,.1]},
 {id:'csillag',n:'Aranycsillag',p:1500,f:i=>[1,.85,.3]},
 {id:'sziv',n:'Szívecskék',p:1500,f:i=>[1,.3,.55]},
 {id:'bubor',n:'Buborék',p:1200,f:i=>[.5,.9,1]},
 {id:'fust',n:'Füst',p:600,f:i=>{const g=.55+Math.random()*.3;return[g,g,g]}},
 {id:'szivar',n:'Szivárvány',p:3000,f:i=>{const c=new THREE.Color().setHSL((performance.now()/1500+i*.03)%1,1,.6);return[c.r,c.g,c.b]}}];
const ICONS=['👑','🐶','🐱','🦜','🔥','⚡','💎','🌟','🎯','🛡️','🍀','🎩'];
const FRAMES={arany:'linear-gradient(135deg,#fde68a,#b45309,#fde68a)',ezust:'linear-gradient(135deg,#f1f5f9,#64748b,#f1f5f9)',neon:'linear-gradient(135deg,#22d3ee,#a855f7,#ec4899)',smaragd:'linear-gradient(135deg,#6ee7b7,#065f46,#6ee7b7)',tuz:'linear-gradient(135deg,#fde047,#dc2626,#7c2d12)'};
const POSES={laza:{n:'Laza',p:null},gyoztes:{n:'Győztes',p:{la:[0,-2.6],ra:[0,2.6]}},karba:{n:'Karba tett',p:{la:[-1.4,-.9],ra:[-1.4,.9]}},szalut:{n:'Szalutál',p:{ra:[-2.3,.7]}},hos:{n:'Hősi',p:{la:[0,-.9],ra:[-3,0],ll:[0,-.2],rl:[0,.2]}}};
const AURAS=[{lv:5,n:'Bronz',c:0xd97706},{lv:15,n:'Ezüst',c:0xcbd5e1},{lv:30,n:'Arany',c:0xfacc15},{lv:50,n:'Kozmikus',c:0xa855f7}];
const VARS={norm:{n:'Normál'},arany:{n:'Aranyszőrű ✨'},kris:{n:'Kristály 💎'}};

// ---------- CSS + UI ----------
const css=document.createElement('style');css.textContent=`
#x13cBtn{position:fixed;right:14px;top:58%;z-index:9;width:58px;height:58px;border-radius:18px;border:1px solid #ffffff40;cursor:pointer;font-size:28px;
 background:linear-gradient(145deg,#7c3aed,#db2777);box-shadow:0 8px 24px #0008,inset 0 1px 0 #fff6;display:none;transition:transform .15s}
#x13cBtn:hover{transform:scale(1.08) rotate(-4deg)}#x13cBtn small{position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);font:700 10px Rajdhani,Arial;color:#fff;text-shadow:0 1px 2px #000;white-space:nowrap}
#x13c{position:fixed;inset:0;z-index:30;display:none;align-items:center;justify-content:center;background:#05030ccc;backdrop-filter:blur(6px);font-family:Rajdhani,Arial;color:#fff}
#x13c.on{display:flex}#x13c .bx{width:min(920px,94vw);height:min(640px,90vh);display:flex;flex-direction:column;border-radius:22px;overflow:hidden;
 background:linear-gradient(160deg,#1e1033,#0b0716 60%);border:1px solid #ffffff22;box-shadow:0 30px 80px #000c,inset 0 1px 0 #ffffff22}
#x13c .hd{display:flex;align-items:center;gap:12px;padding:14px 18px;background:linear-gradient(90deg,#7c3aed55,#db277744)}
#x13c .hd b{font:28px 'Luckiest Guy',Impact;letter-spacing:1px;text-shadow:0 3px 0 #000}#x13c .hd .ft{margin-left:auto;font:700 18px Rajdhani;color:#facc15;background:#0007;padding:5px 12px;border-radius:10px}
#x13c .hd .x{border:0;width:40px;height:40px;border-radius:10px;background:#ef4444;color:#fff;font-size:20px;cursor:pointer}
#x13c .tb{display:flex;gap:6px;flex-wrap:wrap;padding:10px 18px;border-bottom:1px solid #ffffff14}
#x13c .tb button{padding:7px 12px;border-radius:10px;border:1px solid #ffffff22;background:#ffffff0d;color:#fff;font:700 14px Rajdhani;cursor:pointer}
#x13c .tb button.on{background:linear-gradient(90deg,#a855f7,#ec4899);border-color:transparent}
#x13c .bd{flex:1;overflow:auto;padding:16px 18px}#x13c .gr{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
#x13c .cd{border-radius:14px;padding:12px;background:#ffffff0a;border:1px solid #ffffff1a;cursor:pointer;text-align:center;transition:.15s}
#x13c .cd:hover{background:#ffffff16;transform:translateY(-2px)}#x13c .cd.on{border-color:#facc15;box-shadow:0 0 0 2px #facc1555}
#x13c .cd .sw{height:46px;border-radius:24px 24px 6px 6px;margin-bottom:8px}#x13c .cd b{display:block;font-size:16px}#x13c .cd i{font-style:normal;color:#facc15;font-size:13px}
#x13c .row{display:flex;align-items:center;gap:10px;margin:8px 0}#x13c .row label{width:110px;font-weight:700;color:#d8b4fe}
#x13c input[type=range]{flex:1;accent-color:#ec4899}#x13c input[type=text]{flex:1;padding:8px;border-radius:9px;border:1px solid #ffffff33;background:#0006;color:#fff;font:700 15px Rajdhani}
#x13c .bt{padding:9px 16px;border-radius:11px;border:0;background:linear-gradient(90deg,#a855f7,#ec4899);color:#fff;font:700 15px Rajdhani;cursor:pointer;margin:4px}
#x13c .bt.g{background:#ffffff1a}#x13c .meter{height:12px;border-radius:7px;background:#0007;overflow:hidden;flex:1}#x13c .meter div{height:100%;border-radius:7px}
#x13c .ic{font-size:24px;padding:6px 8px;border-radius:10px;cursor:pointer;border:1px solid transparent}#x13c .ic.on{border-color:#facc15;background:#facc1522}
#x13c .note{color:#c4b5fd;font-size:14px;margin:6px 0 12px}
#x13cCard{position:fixed;z-index:12;pointer-events:none;transform:translate(-50%,-100%);display:none;padding:2px;border-radius:14px}
#x13cCard .in{display:flex;align-items:center;gap:8px;padding:5px 12px 5px 6px;border-radius:12px;background:linear-gradient(180deg,#140b24f0,#0b0716f0)}
#x13cCard .em{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}
#x13cCard .t{font:700 13px Rajdhani,Arial;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap}
#x13cBub{position:fixed;z-index:12;pointer-events:none;transform:translate(-50%,-100%);display:none;background:#fff;color:#111;font:700 16px Rajdhani,Arial;padding:6px 12px;border-radius:14px;box-shadow:0 6px 16px #0007}
#x13cBub:after{content:'';position:absolute;left:50%;bottom:-8px;margin-left:-8px;border:8px solid transparent;border-top-color:#fff;border-bottom:0}
#x13cQm{position:fixed;z-index:31;display:none;gap:8px;left:50%;bottom:120px;transform:translateX(-50%);padding:10px;border-radius:18px;background:#140b24ee;border:1px solid #ffffff2a;box-shadow:0 14px 40px #000a}
#x13cQm.on{display:flex}#x13cQm button{width:78px;height:70px;border-radius:14px;border:1px solid #ffffff22;background:#ffffff10;color:#fff;font:700 13px Rajdhani;cursor:pointer}
#x13cQm button span{display:block;font-size:26px}#x13cQm button:hover{background:#a855f744}
#x13cT{position:fixed;left:50%;top:14%;transform:translateX(-50%);z-index:40;padding:10px 18px;border-radius:12px;background:#140b24f2;border:1px solid #a855f7;color:#fff;font:700 16px Rajdhani,Arial;display:none}`;
document.head.appendChild(css);
const mk=(h)=>{const d=document.createElement('div');d.innerHTML=h;return d.firstElementChild};
const btn=mk('<button id="x13cBtn" title="Testreszabás & Állatok">🎨<small>STÍLUS</small></button>');document.body.appendChild(btn);
const P=mk('<div id="x13c"><div class="bx"><div class="hd"><b>🎨 STÍLUS & ÁLLATOK</b><span class="ft"></span><button class="x">✕</button></div><div class="tb"></div><div class="bd"></div></div></div>');document.body.appendChild(P);
const CARD=mk('<div id="x13cCard"><div class="in"><div class="em"></div><div class="t"></div></div></div>');document.body.appendChild(CARD);
const BUB=mk('<div id="x13cBub"></div>');document.body.appendChild(BUB);
const QM=mk('<div id="x13cQm"><button data-e="ul"><span>🐕</span>Ül</button><button data-e="pacsi"><span>🐾</span>Pacsi</button><button data-e="ugat"><span>💬</span>Ugat</button><button data-e="pet2"><span>🐾</span>Kis kedvenc</button><button data-e="x"><span>✕</span>Bezár</button></div>');document.body.appendChild(QM);
const T=mk('<div id="x13cT"></div>');document.body.appendChild(T);let tT=0;
function toast(s){T.textContent=s;T.style.display='block';clearTimeout(tT);tT=setTimeout(()=>T.style.display='none',2200)}

const TABS=[['chute','🪂 Ejtőernyő'],['trail','✨ Nyomvonal'],['card','🏷️ Névkártya'],['aura','🌀 Aura'],['szin','🎨 Ruhaszín'],['poz','🕺 Póz'],['allat','🐾 Állatok'],['tojas','🥚 Tojás']];
let tab='chute';
const tb=P.querySelector('.tb'),bd=P.querySelector('.bd');
tb.innerHTML=TABS.map(t=>`<button data-t="${t[0]}">${t[1]}</button>`).join('');
function open(){if(!window.BR&&!hasS()){alert('Előbb jelentkezz be!');return}decay();P.classList.add('on');render()}
btn.onclick=open;P.querySelector('.x').onclick=()=>P.classList.remove('on');
P.addEventListener('click',e=>{if(e.target===P)P.classList.remove('on')});
const grad=c=>c.length>1?`linear-gradient(90deg,${c.map((x,i)=>x+' '+(i*100/c.length)+'%,'+x+' '+((i+1)*100/c.length)+'%').join(',')})`:c[0];
const m2=(v,c)=>`<div class="meter"><div style="width:${Math.max(0,Math.min(100,v))}%;background:${c}"></div></div>`;

function render(){
 P.querySelector('.ft').textContent='💰 '+ft().toLocaleString('hu')+' Ft';
 tb.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
 let h='';
 if(tab==='chute'){h='<div class="note">Az ernyő a meccs elején, ugráskor nyílik ki. Vásárlás játékpénzért.</div><div class="gr">'+CHUTES.map(c=>{const own=!c.p||ST.chutes[c.id];return`<div class="cd ${ST.chute===c.id?'on':''}" data-chute="${c.id}"><div class="sw" style="background:${grad(c.c)}${c.gl?';box-shadow:0 0 14px '+c.c[0]:''}"></div><b>${c.n}</b><i>${own?(ST.chute===c.id?'✔ Felszerelve':'Felszerel'):c.p.toLocaleString('hu')+' Ft'}</i></div>`}).join('')+'</div>'}
 else if(tab==='trail'){h='<div class="note">Részecske-nyomvonal ugráskor, ernyőzéskor és futáskor.</div><div class="gr">'+TRAILS.map(t=>{const own=!t.p||ST.trails[t.id];const col=t.f?t.f(0):[.3,.3,.3];return`<div class="cd ${ST.trail===t.id?'on':''}" data-trail="${t.id}"><div class="sw" style="border-radius:24px;background:${t.id==='szivar'?'linear-gradient(90deg,red,orange,yellow,lime,cyan,violet)':`radial-gradient(circle,rgb(${col.map(x=>x*255|0)}) 0 20%,transparent 60%)`}"></div><b>${t.n}</b><i>${own?(ST.trail===t.id?'✔ Aktív':'Bekapcsol'):t.p.toLocaleString('hu')+' Ft'}</i></div>`}).join('')+'</div>'}
 else if(tab==='card'){const c=ST.card;h=`<div class="note">A kártya a lobby-karakter neve fölött lebeg.</div>
  <div class="row"><label>Felirat</label><input type="text" id="x13cTi" maxlength="22" value="${c.title.replace(/"/g,'&quot;')}"></div>
  <div class="row"><label>Szín</label><input type="color" id="x13cCo" value="${c.col}"></div>
  <div class="row"><label>Embléma</label><div>${ICONS.map(i=>`<span class="ic ${c.icon===i?'on':''}" data-ic="${i}">${i}</span>`).join('')}</div></div>
  <div class="row"><label>Keret</label><div>${Object.keys(FRAMES).map(k=>`<button class="bt ${c.frame===k?'':'g'}" data-fr="${k}">${k}</button>`).join('')}</div></div>
  <div class="row"><label>Előnézet</label><div id="x13cPv"></div></div>`}
 else if(tab==='aura'){h=`<div class="note">Animált aura a lobby-karakter körül. A szinted (${lv()}.) alapján nyílnak.</div><div class="gr">`+AURAS.map((a,i)=>`<div class="cd ${ST.aura===i+1?'on':''}" data-aura="${i+1}"><div class="sw" style="border-radius:50%;width:46px;margin:0 auto 8px;box-shadow:0 0 18px #${a.c.toString(16).padStart(6,'0')};border:3px solid #${a.c.toString(16).padStart(6,'0')}"></div><b>${a.n}</b><i>${lv()>=a.lv?(ST.aura===i+1?'✔ Aktív':'Bekapcsol'):'🔒 '+a.lv+'. szint'}</i></div>`).join('')+`<div class="cd ${!ST.aura?'on':''}" data-aura="0"><div class="sw" style="background:#0005"></div><b>Kikapcsolva</b><i>&nbsp;</i></div></div>`}
 else if(tab==='szin'){const s=ST.hsl;h=`<div class="note">A ruházat színét a lobby karakteren azonnal látod (előnézet).</div>
  <div class="row"><label>Bekapcsolva</label><input type="checkbox" id="x13cOn" ${s.on?'checked':''}></div>
  <div class="row"><label>Árnyalat</label><input type="range" min="0" max="360" value="${s.h}" data-hsl="h"></div>
  <div class="row"><label>Telítettség</label><input type="range" min="-100" max="100" value="${s.s}" data-hsl="s"></div>
  <div class="row"><label>Világosság</label><input type="range" min="-50" max="50" value="${s.l}" data-hsl="l"></div>
  <div class="row"><label>Minta</label><div id="x13cSw" style="width:80px;height:40px;border-radius:10px;border:1px solid #fff4"></div><button class="bt g" id="x13cRs">Visszaállít</button></div>`}
 else if(tab==='poz'){h='<div class="note">A bemutató-póz a lobbyban látszik (tánc után visszaáll).</div><div class="gr">'+Object.keys(POSES).map(k=>`<div class="cd ${ST.pose===k?'on':''}" data-pose="${k}"><div style="font-size:34px">${({laza:'🧍',gyoztes:'🙌',karba:'🙅',szalut:'🫡',hos:'🦸'})[k]}</div><b>${POSES[k].n}</b></div>`).join('')+'</div>'}
 else if(tab==='allat'){decay();const c=ST.care,p2=ST.pet2;const pr=(k,nm)=>`<div class="cd" style="cursor:default;text-align:left"><b>${nm}</b>
   <div class="row"><label>🍖 Jóllakottság</label>${m2(c[k].h,'linear-gradient(90deg,#f97316,#facc15)')}</div>
   <div class="row"><label>💖 Kedv</label>${m2(c[k].m,'linear-gradient(90deg,#ec4899,#a855f7)')}</div>
   <button class="bt" data-feed="${k}">Etetés (150 Ft)</button><button class="bt g" data-pat="${k}">Simogatás</button><button class="bt g" data-play="${k}">Játék (300 Ft)</button></div>`;
  h=`<div class="note">Tartsd mindkét mutatót 80% fölött → napi gondozói jutalom: 1500 Ft. (B = kutya gyorsmenü a lobbyban)</div><div class="gr" style="grid-template-columns:1fr 1fr">`+pr('dog','🐶 Kutya')+(p2?pr('p2',(p2.type==='cat'?'🐱 Macska':'🦜 Papagáj')+' · '+VARS[p2.var].n):`<div class="cd" style="cursor:default"><b>Második háziállat</b><div class="note">Válassz egyet (2500 Ft)</div><button class="bt" data-adopt="cat">🐱 Macska</button><button class="bt" data-adopt="parrot">🦜 Papagáj</button></div>`)+`</div>
  <div style="margin-top:10px"><button class="bt" id="x13cRw">🎁 Napi gondozói jutalom</button>${p2?'<button class="bt g" id="x13cSwp">Fajta csere (macska ⇄ papagáj)</button>':''}</div>
  <div class="note">Kutya-emote-ok: <button class="bt g" data-emo="ul">🐕 Ül</button><button class="bt g" data-emo="pacsi">🐾 Pacsi</button><button class="bt g" data-emo="ugat">💬 Ugat</button></div>`}
 else if(tab==='tojas'){const p2=ST.pet2;h=`<div class="note">Keltess tojást a második háziállatodnak! Esélyek: ✨ Aranyszőrű 8%, 💎 Kristály 3%, a többi normál. Egy tojás 2000 Ft.</div>
  <div style="text-align:center;font-size:90px;margin:10px 0" id="x13cEgg">🥚</div><div style="text-align:center">${p2?`Jelenlegi: <b>${VARS[p2.var].n}</b>`:'Előbb fogadj örökbe egy második állatot az Állatok fülön!'}<br><button class="bt" id="x13cHat" ${p2?'':'disabled'}>🥚 Tojás keltetése (2000 Ft)</button></div>
  <div class="note" style="text-align:center">Keltetett tojások: ${ST.eggs}</div>`}
 bd.innerHTML=h;
 if(tab==='card')cardPrev();if(tab==='szin')swUpd();
}
tb.onclick=e=>{const b=e.target.closest('[data-t]');if(b){tab=b.dataset.t;render()}};
bd.addEventListener('click',e=>{const t=e.target;let x;
 if(x=t.closest('[data-chute]')){const c=CHUTES.find(c=>c.id===x.dataset.chute);if(c.p&&!ST.chutes[c.id]){if(!pay(c.p))return;ST.chutes[c.id]=1;toast('🪂 Megvetted: '+c.n)}ST.chute=c.id;sv();render()}
 else if(x=t.closest('[data-trail]')){const c=TRAILS.find(c=>c.id===x.dataset.trail);if(c.p&&!ST.trails[c.id]){if(!pay(c.p))return;ST.trails[c.id]=1;toast('✨ Megvetted: '+c.n)}ST.trail=c.id;sv();render()}
 else if(x=t.closest('[data-ic]')){ST.card.icon=x.dataset.ic;sv();render()}
 else if(x=t.closest('[data-fr]')){ST.card.frame=x.dataset.fr;sv();render()}
 else if(x=t.closest('[data-aura]')){const i=+x.dataset.aura;if(i&&lv()<AURAS[i-1].lv){toast('🔒 '+AURAS[i-1].lv+'. szinttől');return}ST.aura=i;sv();render()}
 else if(x=t.closest('[data-pose]')){ST.pose=x.dataset.pose;sv();render()}
 else if(t.id==='x13cRs'){ST.hsl={on:0,h:0,s:0,l:0};sv();render()}
 else if(x=t.closest('[data-adopt]')){if(!pay(2500))return;ST.pet2={type:x.dataset.adopt,var:'norm'};sv();buildPet2();toast('🐾 Új családtag!');render()}
 else if(t.id==='x13cSwp'){ST.pet2.type=ST.pet2.type==='cat'?'parrot':'cat';sv();buildPet2();render()}
 else if(x=t.closest('[data-feed]')){if(!pay(150))return;const c=ST.care[x.dataset.feed];c.h=Math.min(100,c.h+35);c.m=Math.min(100,c.m+5);sv();bubble(x.dataset.feed,'Nyamm! 🍖');render()}
 else if(x=t.closest('[data-pat]')){const n=Date.now();if(n-(ST.care.pt||0)<15000){toast('Várj kicsit a következő simogatással!');return}ST.care.pt=n;const c=ST.care[x.dataset.pat];c.m=Math.min(100,c.m+15);sv();bubble(x.dataset.pat,'💖');render()}
 else if(x=t.closest('[data-play]')){if(!pay(300))return;const c=ST.care[x.dataset.play];c.m=Math.min(100,c.m+35);c.h=Math.max(0,c.h-5);sv();if(x.dataset.play==='dog')emote('ugat');else bubble('p2','Juhé! 🎾');render()}
 else if(t.id==='x13cRw'){const d=new Date().toDateString(),c=ST.care;if(ST.care.day===d){toast('Ma már megkaptad, holnap újra!');return}
  const ok=c.dog.h>=80&&c.dog.m>=80&&(!ST.pet2||(c.p2.h>=80&&c.p2.m>=80));if(!ok){toast('Előbb gondozd az állataidat 80% fölé!');return}c.day=d;sv();earn(1500);toast('🎁 Gondozói jutalom: +1500 Ft');render()}
 else if(x=t.closest('[data-emo]')){emote(x.dataset.emo);P.classList.remove('on')}
 else if(t.id==='x13cHat')hatch();
});
bd.addEventListener('input',e=>{const t=e.target;
 if(t.id==='x13cTi'){ST.card.title=t.value.slice(0,22);sv();cardPrev()}
 else if(t.id==='x13cCo'){ST.card.col=t.value;sv();cardPrev()}
 else if(t.dataset.hsl){ST.hsl[t.dataset.hsl]=+t.value;ST.hsl.on=1;const cb=document.getElementById('x13cOn');if(cb)cb.checked=true;sv();swUpd()}
 else if(t.id==='x13cOn'){ST.hsl.on=t.checked?1:0;sv();swUpd()}});
function cardHTML(){const c=ST.card;return`<div style="display:inline-block;padding:2px;border-radius:14px;background:${FRAMES[c.frame]||FRAMES.arany}"><div class="in" style="display:flex;align-items:center;gap:8px;padding:5px 12px 5px 6px;border-radius:12px;background:linear-gradient(180deg,#140b24f0,#0b0716f0)"><div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:${c.col}">${c.icon}</div><div style="font:700 13px Rajdhani;text-transform:uppercase;color:${c.col}">${esc(c.title)}</div></div></div>`}
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[m]);
function cardPrev(){const p=document.getElementById('x13cPv');if(p)p.innerHTML=cardHTML();CARD.style.background=FRAMES[ST.card.frame]||FRAMES.arany;CARD.querySelector('.em').style.background=ST.card.col;CARD.querySelector('.em').textContent=ST.card.icon;const t=CARD.querySelector('.t');t.textContent=ST.card.title;t.style.color=ST.card.col}
function swUpd(){const s=ST.hsl,e=document.getElementById('x13cSw');if(e)e.style.background=`hsl(${s.h},${Math.max(0,60+s.s*.4)}%,${50+s.l}%)`;tintDirty=true}
cardPrev();

// ---------- GONDOZÁS ----------
function decay(){const c=ST.care,n=Date.now(),hr=Math.min(72,(n-(c.t||n))/3.6e6);if(hr<=0)return;['dog','p2'].forEach(k=>{c[k].h=Math.max(0,c[k].h-hr*6);c[k].m=Math.max(0,c[k].m-hr*4)});c.t=n;sv()}
setInterval(decay,60000);
function hatch(){if(!ST.pet2)return;if(!pay(2000))return;const e=document.getElementById('x13cEgg');let k=0;const iv=setInterval(()=>{if(e)e.style.transform='rotate('+(k%2?-14:14)+'deg)';if(++k>8){clearInterval(iv);
 const r=Math.random(),v=r<.03?'kris':r<.11?'arany':'norm';ST.eggs++;if(v!=='norm'||ST.pet2.var==='norm')ST.pet2.var=v;sv();buildPet2();
 if(e){e.style.transform='';e.textContent=v==='kris'?'💎':v==='arany'?'✨':'🐣'}toast(v==='kris'?'💎 KRISTÁLY fajta! Ritka szerencse!':v==='arany'?'✨ ARANYSZŐRŰ fajta!':'🐣 Normál fajta – próbáld újra!');setTimeout(render,1200)}},140)}

// ---------- LOBBY 3D ----------
const V=window.THREE?new THREE.Vector3():null;
let auraG=null,auraI=-1,pet2G=null,pet2Key='',tintDirty=true,tintMe=null,emo=null,bubT=0,bubWho='dog',fxHooked=false;
function proj(o,y){const L=LB3D;V.copy(o).y+=y;V.project(L.cam);return[(V.x+1)/2*innerWidth,(1-V.y)/2*innerHeight,V.z]}
function buildAura(){const L=LB3D;if(auraG){L.sc.remove(auraG);auraG.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose()});auraG=null}auraI=ST.aura;
 const a=AURAS[ST.aura-1];if(!a||lv()<a.lv)return;const g=new THREE.Group();
 const rm=new THREE.MeshBasicMaterial({color:a.c,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 const r1=new THREE.Mesh(new THREE.RingGeometry(.9,1.05,48),rm);r1.rotation.x=-Math.PI/2;r1.position.y=.34;g.add(r1);
 const r2=new THREE.Mesh(new THREE.TorusGeometry(.75,.03,6,40),rm.clone());r2.rotation.x=Math.PI/2;g.add(r2);g.userData.r2=r2;g.userData.r1=r1;
 const n=ST.aura*14,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:a.c,size:.09,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(pts);g.userData.pts=pts;g.userData.n=n;
 L.sc.add(g);auraG=g}
function stepAura(t){if(auraI!==ST.aura)buildAura();if(!auraG)return;const me=LB3D.me;if(me)auraG.position.set(me.position.x,0,me.position.z);
 const u=auraG.userData;u.r1.material.opacity=.45+Math.sin(t*3)*.2;u.r1.scale.setScalar(1+Math.sin(t*2)*.05);u.r2.position.y=.4+((t*.6)%1)*2.6;u.r2.material.opacity=.7*(1-((t*.6)%1));
 const p=u.pts.geometry.attributes.position.array;for(let i=0;i<u.n;i++){const a=i/u.n*Math.PI*2*3+t*(1.2+(i%3)*.3),h=((t*.35+i*.137)%1);p[i*3]=Math.cos(a)*(.7+.15*Math.sin(i));p[i*3+1]=.35+h*3;p[i*3+2]=Math.sin(a)*(.7+.15*Math.sin(i))}u.pts.geometry.attributes.position.needsUpdate=true}
function petMat(col,v){if(v==='arany')return new THREE.MeshStandardMaterial({color:0xfacc15,metalness:.85,roughness:.25,emissive:0x5a3a00,emissiveIntensity:.5});
 if(v==='kris')return new THREE.MeshStandardMaterial({color:0x7dd3fc,metalness:.2,roughness:.05,transparent:true,opacity:.75,emissive:0x0e7490,emissiveIntensity:.8});
 return new THREE.MeshStandardMaterial({color:col,roughness:.8})}
function buildPet2(){if(!inLobby())return;const L=LB3D;if(pet2G){L.sc.remove(pet2G);pet2G=null}pet2Key=ST.pet2?ST.pet2.type+ST.pet2.var:'';if(!ST.pet2)return;
 const v=ST.pet2.var,g=new THREE.Group(),B=(w,h,d,m)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m),dk=new THREE.MeshStandardMaterial({color:0x111111}),parts={};
 if(ST.pet2.type==='cat'){const m=petMat(0xf59e0b,v),m2=v==='norm'?new THREE.MeshStandardMaterial({color:0xfde68a}):m;
  const body=B(.7,.36,.34,m);body.position.y=.38;const hd=new THREE.Group();hd.position.set(.42,.62,0);const h=B(.32,.3,.32,m);hd.add(h);
  [-.09,.09].forEach(z=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.07,.16,4),m);e.position.set(0,.2,z);hd.add(e);const ey=B(.03,.05,.05,v==='kris'?new THREE.MeshBasicMaterial({color:0xffffff}):new THREE.MeshBasicMaterial({color:0x22c55e}));ey.position.set(.165,.04,z*.8);hd.add(ey)});
  const sn=B(.06,.08,.14,m2);sn.position.set(.17,-.06,0);hd.add(sn);
  [[-.25,-.12],[-.25,.12],[.25,-.12],[.25,.12]].forEach(([x,z])=>{const l=B(.1,.28,.1,m2);l.position.set(x,.14,z);g.add(l)});
  const tl=new THREE.Group();tl.position.set(-.35,.45,0);const tm=B(.07,.5,.07,m);tm.position.y=.25;tl.add(tm);tl.rotation.z=.5;g.add(body,hd,tl);parts.head=hd;parts.tail=tl}
 else{const m=petMat(0x16a34a,v),wm=v==='norm'?new THREE.MeshStandardMaterial({color:0x2563eb}):m,bm=v==='norm'?new THREE.MeshStandardMaterial({color:0xdc2626}):m;
  const perch=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,1.1,6),new THREE.MeshStandardMaterial({color:0x78350f}));perch.position.y=.55;g.add(perch);
  const bar=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.6,6),perch.material);bar.rotation.x=Math.PI/2;bar.position.y=1.1;g.add(bar);
  const bird=new THREE.Group();bird.position.y=1.32;const body=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),m);body.scale.set(1,1.35,1);bird.add(body);
  const hd=new THREE.Group();hd.position.y=.25;const h=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),bm);hd.add(h);const bk=new THREE.Mesh(new THREE.ConeGeometry(.04,.12,6),new THREE.MeshStandardMaterial({color:0xfde047}));bk.rotation.z=-Math.PI/2;bk.position.x=.14;hd.add(bk);
  [-.06,.06].forEach(z=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.022,6,4),dk);e.position.set(.08,.04,z*1.3);hd.add(e)});bird.add(hd);
  const wl=B(.22,.05,.16,wm),wr=wl.clone();wl.position.set(-.02,.0,.16);wr.position.set(-.02,0,-.16);bird.add(wl,wr);const tl=B(.28,.04,.1,wm);tl.position.set(-.2,-.2,0);tl.rotation.z=.7;bird.add(tl);
  g.add(bird);parts.head=hd;parts.bird=bird;parts.wl=wl;parts.wr=wr}
 if(v!=='norm'){const sp=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(new Float32Array(24*3).map(()=>(Math.random()-.5)*1.2+.0),3)),new THREE.PointsMaterial({color:v==='arany'?0xfde047:0x67e8f9,size:.06,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false}));sp.position.y=.7;g.add(sp);parts.sp=sp}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.position.set(-2.1,.3,1.3);g.rotation.y=-1;g.userData.p=parts;L.sc.add(g);pet2G=g}
function stepPet2(t){const k=ST.pet2?ST.pet2.type+ST.pet2.var:'';if(k!==pet2Key)buildPet2();if(!pet2G)return;const p=pet2G.userData.p,mood=ST.care.p2.m/100;
 if(p.tail)p.tail.rotation.x=Math.sin(t*(1+mood*3))*.5;p.head.rotation.y=Math.sin(t*.8)*.4;
 if(p.bird){p.bird.position.y=1.32+Math.abs(Math.sin(t*2))*.03*(1+mood);const f=Math.sin(t*4)>.85?Math.sin(t*40)*.6:0;p.wl.rotation.x=f;p.wr.rotation.x=-f}
 if(p.sp)p.sp.rotation.y=t*.8}
function applyTint(){const me=LB3D.me;if(!me)return;if(me!==tintMe){tintMe=me;tintDirty=true}if(!tintDirty)return;tintDirty=false;const s=ST.hsl,hsl={};
 me.traverse(o=>{if(!o.isMesh||!o.material||!o.material.color)return;const u=o.userData;if(!u.x13c){u.x13c=o.material.color.clone();o.material=o.material.clone()}
  o.material.color.copy(u.x13c);if(s.on&&!(o.userData.limb==='head')){o.material.color.getHSL(hsl);if(hsl.s<.08&&hsl.l>.85&&o.material.map){o.material.color.setHSL(s.h/360,Math.max(0,Math.min(1,.55+s.s/200)),Math.max(.3,Math.min(1,.8+s.l/100)))}else if(hsl.s>.08||Math.abs(hsl.l-.5)<.35){o.material.color.setHSL(((hsl.h+s.h/360)%1+1)%1,Math.max(0,Math.min(1,hsl.s+s.s/100)),Math.max(0,Math.min(1,hsl.l+s.l/100)))}}})}
function applyPose(){const ps=POSES[ST.pose];if(!ps||!ps.p)return;const me=LB3D.me;if(!me||me.userData._x13cDance)return;const L2={};me.traverse(c=>{if(c.userData&&c.userData.limb)L2[c.userData.limb]=c});
 ['la','ra','ll','rl'].forEach(k=>{const c=L2[{la:'larm',ra:'rarm',ll:'lleg',rl:'rleg'}[k]];if(!c)return;const v=ps.p[k]||[0,0];if(Math.abs(c.rotation.x-v[0]*.7)>.15||Math.abs(c.rotation.z+v[1]*.7)>.15){if(c.userData.x13cSet)poseHold=performance.now()+1200}if(performance.now()<poseHold){c.userData.x13cSet=0;return}c.rotation.x=v[0];c.rotation.z=-v[1];c.userData.x13cSet=1})}
let poseHold=0;
function emote(e){if(e==='x'){QM.classList.remove('on');return}QM.classList.remove('on');if(e==='pet2'){if(!ST.pet2){toast('Még nincs második állatod');return}bubble('p2',ST.pet2.type==='cat'?'Miaú! 😺':'Szép napot! 🦜');return}
 if(!inLobby()||!LB3D.dog){toast('A kutya a lobbyban van');return}emo={k:e,t:0};ST.care.dog.m=Math.min(100,ST.care.dog.m+2);sv();
 bubble('dog',e==='ugat'?'Vau! Vau! 🐕':e==='pacsi'?'Pacsi! 🐾':'*leül* 🐕');if(e==='ugat')bark()}
let AC=null;function bark(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();[0,.22].forEach(d=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';const t=AC.currentTime+d;o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(180,t+.12);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.15);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.16)})}catch(e){}}
function bubble(w,s){bubWho=w;BUB.textContent=s;bubT=2.4;BUB.style.display='block'}
function stepEmote(dt){const d=LB3D.dog;if(!d)return;const pet=d.userData.pet||d;
 if(emo){emo.t+=dt;const k=emo.k,a=Math.min(1,emo.t*4)*(emo.t>2.2?Math.max(0,1-(emo.t-2.2)*4):1);
  if(k==='ul'){pet.rotation.z=a*.45;pet.position.y=-.3-a*.08}
  else if(k==='pacsi'){pet.rotation.z=a*.3;if(pet.userData.head)pet.userData.head.rotation.z=a*.3+Math.sin(emo.t*10)*.1*a}
  else if(k==='ugat'){pet.position.y=-.3+Math.abs(Math.sin(emo.t*14))*.06*a;if(pet.userData.head)pet.userData.head.rotation.z=Math.sin(emo.t*14)*.15*a}
  if(emo.t>2.5){pet.rotation.z=0;pet.position.y=-.3;emo=null}}}
function stepBubble(dt){if(bubT<=0)return;bubT-=dt;if(bubT<=0||!inLobby()){BUB.style.display='none';bubT=0;return}const o=bubWho==='dog'?LB3D.dog:pet2G;if(!o){BUB.style.display='none';return}
 const[x,y]=proj(o.position,bubWho==='p2'&&ST.pet2&&ST.pet2.type==='parrot'?2:1.4);BUB.style.left=x+'px';BUB.style.top=y+'px'}
function stepCard(){const nm=document.getElementById('lbName');if(nm&&nm.style.visibility!=='hidden')nm.style.visibility='hidden';CARD.style.display='none';return;if(!nm||!nm.style.left||nm.offsetParent===null||P.classList.contains('on')){CARD.style.display='none';return}
 CARD.style.display='block';const l=nm.style.left,t=(parseFloat(nm.style.top)-nm.offsetHeight-4)+'px';if(CARD._l!==l+t){CARD._l=l+t;CARD.style.left=l;CARD.style.top=t}}
let lt=performance.now();
function lobbyTick(t){const n=performance.now(),dt=Math.min(.05,(n-lt)/1000);lt=n;
 try{stepAura(t);stepPet2(t);applyTint();applyPose();stepEmote(dt);stepBubble(dt);stepCard()}catch(e){if(!lobbyTick.e){lobbyTick.e=1;console.warn('x13c',e)}}}
setInterval(()=>{const on=inLobby();btn.style.display=on?'block':'none';if(!on){CARD.style.display='none';QM.classList.remove('on')}
 if(on&&!fxHooked&&LB3D.fx){fxHooked=true;LB3D.fx.push(lobbyTick)}},500);
addEventListener('keydown',e=>{if(e.code!=='KeyB'||e.repeat||!inLobby())return;const a=document.activeElement;if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'||a.isContentEditable))return;QM.classList.toggle('on')});
QM.addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(b)emote(b.dataset.e)});

// ---------- MECCS: EJTŐERNYŐ + NYOMVONAL ----------
let canopy=null,canKey=null,trail=null,tIdx=0,lastP=null;
function buildCanopy(){const c=CHUTES.find(c=>c.id===ST.chute);canKey=ST.chute;if(canopy&&canopy.parent)canopy.parent.remove(canopy);canopy=null;if(!c||!c.id)return;
 const geo=new THREE.SphereGeometry(2.4,24,8,0,Math.PI*2,0,Math.PI*.42),cols=c.c.map(x=>new THREE.Color(x)),pos=geo.attributes.position,col=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const a=Math.atan2(pos.getZ(i),pos.getX(i)),k=Math.floor(((a+Math.PI)/(Math.PI*2))*12)%cols.length,cc=cols[k];col[i*3]=cc.r;col[i*3+1]=cc.g;col[i*3+2]=cc.b}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.MeshStandardMaterial({vertexColors:true,side:THREE.DoubleSide,roughness:.6,emissive:c.gl?cols[0]:0x000000,emissiveIntensity:c.gl?.35:0});
 const g=new THREE.Group(),dome=new THREE.Mesh(geo,m);dome.scale.y=.55;g.add(dome);
 const lg=new THREE.BufferGeometry(),lp=[];for(let i=0;i<8;i++){const a=i/8*Math.PI*2;lp.push(Math.cos(a)*2.1,.55,Math.sin(a)*2.1,0,-2.6,0)}lg.setAttribute('position',new THREE.Float32BufferAttribute(lp,3));
 g.add(new THREE.LineSegments(lg,new THREE.LineBasicMaterial({color:0xe5e7eb,transparent:true,opacity:.7})));g.position.y=5.2;canopy=g}
const TN=90;
function ensureTrail(){if(trail&&trail.parent===gSc())return;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(TN*3).fill(-9999),3));geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(TN*3),3));
 trail=new THREE.Points(geo,new THREE.PointsMaterial({size:.35,vertexColors:true,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false}));trail.frustumCulled=false;trail.userData.life=new Float32Array(TN);trail.userData.vel=new Float32Array(TN*3);gSc().add(trail)}
function matchTick(dt){const g=gG();if(!g||!g.pm||!gSc())return;
 // ejtőernyő
 if(canKey!==ST.chute)buildCanopy();
 if(canopy){if(canopy.parent!==g.pm){g.pm.add(canopy)}canopy.visible=!!g.gl;if(g.gs&&g.gl)g.gs.visible=false;if(g.gl)canopy.rotation.z=Math.sin(performance.now()/600)*.06}
 // nyomvonal
 const tr=TRAILS.find(t=>t.id===ST.trail);if(!tr||!tr.f){if(trail)trail.visible=false;return}ensureTrail();trail.visible=true;
 const p=g.pm.position;let sp=0;if(lastP){sp=Math.hypot(p.x-lastP.x,p.z-lastP.z)/Math.max(dt,.001)}else lastP=new THREE.Vector3();const air=Math.abs(p.y-lastP.y)>.02||g.gl;lastP.copy(p);
 const P2=trail.geometry.attributes.position.array,C=trail.geometry.attributes.color.array,L=trail.userData.life,VV=trail.userData.vel;
 const emit=air?2:sp>6?1:0;for(let e=0;e<emit;e++){const i=tIdx=(tIdx+1)%TN,c=tr.f(i);P2[i*3]=p.x+(Math.random()-.5)*.6;P2[i*3+1]=p.y+(g.gl?2:.6)+Math.random()*.6;P2[i*3+2]=p.z+(Math.random()-.5)*.6;
  C[i*3]=c[0];C[i*3+1]=c[1];C[i*3+2]=c[2];L[i]=1;VV[i*3]=(Math.random()-.5)*.6;VV[i*3+1]=tr.id==='bubor'||tr.id==='fust'?.8:-.3;VV[i*3+2]=(Math.random()-.5)*.6}
 for(let i=0;i<TN;i++){if(L[i]<=0)continue;L[i]-=dt*1.2;if(L[i]<=0){P2[i*3+1]=-9999;continue}P2[i*3]+=VV[i*3]*dt;P2[i*3+1]+=VV[i*3+1]*dt;P2[i*3+2]+=VV[i*3+2]*dt;const f=1-dt*1.5;C[i*3]*=f;C[i*3+1]*=f;C[i*3+2]*=f}
 trail.geometry.attributes.position.needsUpdate=true;trail.geometry.attributes.color.needsUpdate=true}
let mt=performance.now();
(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.05,(n-mt)/1000);mt=n;if(!gRun()||!gG()||inLobby())return;try{matchTick(dt)}catch(e){if(!loop.e){loop.e=1;console.warn('x13c match',e)}}})();

// ---------- DEBUG ----------
window._x13c={ST,open,emote,hatch,buildPet2,matchTick,CHUTES,TRAILS,state:()=>({aura:!!auraG,pet2:!!pet2G,canopy:!!canopy,trail:!!trail})};
})();
