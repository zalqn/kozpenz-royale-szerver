// ===== AUTHPLUS: feldobott belépő / regisztráló képernyő =====
(function(){
const au=document.getElementById('auth');if(!au)return;
const $=id=>document.getElementById(id);
const css=document.createElement('style');css.textContent=`
#auth{background:#05060f!important;overflow:hidden}
body:has(#auth.on) #x14hub{display:none!important}
#apCv{position:absolute;inset:0;width:100%;height:100%}
#apGlow{position:absolute;inset:-20%;background:radial-gradient(700px 500px at 25% 30%,#7c3aed55,transparent 60%),radial-gradient(800px 600px at 80% 75%,#0ea5e955,transparent 60%),radial-gradient(500px 400px at 60% 10%,#ffd23f33,transparent 60%);animation:apHue 14s ease-in-out infinite alternate;pointer-events:none}
@keyframes apHue{to{transform:translate(4%,-3%) scale(1.08);filter:hue-rotate(40deg)}}
#apWrap{position:relative;display:flex;gap:28px;align-items:stretch;max-width:1100px;width:94vw;max-height:94vh}
#apInfo{flex:1.15;display:flex;flex-direction:column;gap:14px;color:#e2e8f0;min-width:0}
#apInfo .lg{font:clamp(48px,6vw,84px) 'Luckiest Guy',Impact;line-height:.9;background:linear-gradient(180deg,#fff6c9,#ffd23f 45%,#ff9f1c);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 #5a2a00) drop-shadow(0 0 30px #ffb70355);animation:apBob 4s ease-in-out infinite}
@keyframes apBob{50%{transform:translateY(-6px) rotate(-1deg)}}
#apInfo .tag{font:700 20px Rajdhani;color:#fbbf24;letter-spacing:1px}
.apCard{background:#0e1430b3;backdrop-filter:blur(12px);border:1px solid #ffffff1f;border-radius:18px;padding:14px 16px}
#apModes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
#apModes .m{background:linear-gradient(160deg,#1e293b,#0f172a);border:1px solid #ffffff14;border-radius:14px;padding:12px;transition:.2s}
#apModes .m:hover{transform:translateY(-4px);border-color:#ffd23f88;box-shadow:0 10px 30px #ffd23f22}
#apModes .m b{display:block;font:18px 'Luckiest Guy',Impact;color:#fff;margin:4px 0}#apModes .m i{font-size:30px;font-style:normal}
#apModes .m small{color:#94a3b8;font:600 13px Rajdhani}
#apStats{display:flex;gap:10px}#apStats .st{flex:1;text-align:center}
#apStats .st b{display:block;font:30px 'Luckiest Guy',Impact;color:#ffd23f}#apStats .st small{color:#94a3b8;font:700 13px Rajdhani;text-transform:uppercase}
#apTip{font:600 17px Rajdhani;min-height:44px;transition:opacity .4s}#apTip:before{content:'💡 TIPP  ';color:#ffd23f;font-weight:800}
#apTop h4{margin:0 0 6px;font:18px 'Luckiest Guy',Impact;color:#ffd23f}
#apTop .r{display:flex;gap:8px;font:700 15px Rajdhani;padding:3px 0;border-bottom:1px solid #ffffff0d}#apTop .r span:nth-child(2){flex:1}#apTop .r em{color:#94a3b8;font-style:normal}
#auth .box{flex:.85;width:auto!important;max-width:440px;position:relative;padding:30px 28px!important;text-align:left!important;overflow:visible;border:1px solid #ffd23f44!important;box-shadow:0 30px 90px #000c,0 0 0 1px #ffffff10 inset,0 0 60px #7c3aed33!important}
#auth .box:before{content:'';position:absolute;inset:-2px;border-radius:26px;padding:2px;background:conic-gradient(from var(--a,0deg),#ffd23f,#7c3aed,#0ea5e9,#ffd23f);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:apSpin 6s linear infinite;pointer-events:none;opacity:.7}
@property --a{syntax:'<angle>';inherits:false;initial-value:0deg}@keyframes apSpin{to{--a:360deg}}
#auth .box .lg{display:none}
#apHead{display:flex;align-items:center;gap:12px}#apHead .av{width:58px;height:58px;border-radius:16px;background:linear-gradient(160deg,#ffd23f,#ff9f1c);display:flex;align-items:center;justify-content:center;font-size:34px;box-shadow:0 6px 0 #a35f00;transition:.3s}
#apHead h3{margin:0;font:28px 'Luckiest Guy',Impact;color:#fff}#apHead p{margin:0;color:#94a3b8;font:600 15px Rajdhani}
#apSrv{display:inline-flex;align-items:center;gap:6px;font:700 13px Rajdhani;color:#94a3b8;margin-top:4px}#apSrv i{width:9px;height:9px;border-radius:50%;background:#64748b}#apSrv.ok i{background:#22c55e;box-shadow:0 0 10px #22c55e;animation:apPulse 1.6s infinite}#apSrv.bad i{background:#ef4444}
@keyframes apPulse{50%{opacity:.4}}
.apF{position:relative;margin:10px 0 2px}.apF>span.ic{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:18px;pointer-events:none}
#auth .apF input{margin:0!important;padding-left:42px!important;padding-right:44px!important;transition:.2s}
#auth .apF input:focus{outline:0!important;border-color:#ffd23f!important;box-shadow:0 0 0 3px #ffd23f33}
.apF input.good{border-color:#22c55e!important}.apF input.bad{border-color:#ef4444!important}
.apEye{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:none;font-size:18px;cursor:pointer;opacity:.75}.apEye:hover{opacity:1}
.apHint{font:600 13px Rajdhani;color:#94a3b8;min-height:18px;padding-left:4px}.apHint.g{color:#4ade80}.apHint.b{color:#f87171}
#apStr{height:6px;border-radius:4px;background:#1e293b;overflow:hidden;margin:4px 0 0}#apStr i{display:block;height:100%;width:0;transition:.3s}
#apRow{display:flex;justify-content:space-between;align-items:center;margin:8px 0;font:600 14px Rajdhani;color:#cbd5e1}
#apRow label,#apTerms{display:flex;gap:6px;align-items:center;cursor:pointer}#auth #apRow input,#auth #apTerms input{width:auto;margin:0;accent-color:#ffd23f}
#apTerms{font:600 14px Rajdhani;color:#cbd5e1;margin:6px 0;display:none}
#apAvs{display:none;gap:6px;flex-wrap:wrap;margin:8px 0}#apAvs button{width:40px;height:40px;border-radius:10px;border:2px solid transparent;background:#1e293b;font-size:22px;cursor:pointer;transition:.15s}#apAvs button:hover{transform:scale(1.12)}#apAvs button.on{border-color:#ffd23f;background:#3b2f00}
#apCaps{display:none;color:#fbbf24;font:700 13px Rajdhani}
#auth .go{position:relative;overflow:hidden;transition:transform .1s}#auth .go:active{transform:translateY(3px);box-shadow:0 2px 0 #a39400}
#auth .go:after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;background:linear-gradient(90deg,transparent,#fff8,transparent);transform:skewX(-20deg);animation:apShine 3s infinite}
@keyframes apShine{0%,60%{left:-60%}100%{left:130%}}
#auth .go.load{color:transparent;pointer-events:none}#auth .go.load:before{content:'';position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-12px;border:3px solid #0b1022;border-top-color:transparent;border-radius:50%;animation:apRot .7s linear infinite}
@keyframes apRot{to{transform:rotate(360deg)}}
#auth .box.shake{animation:apShake .45s}@keyframes apShake{20%,60%{transform:translateX(-10px)}40%,80%{transform:translateX(10px)}}
#auth .box.win{animation:apWin .6s forwards}@keyframes apWin{to{transform:scale(1.06);opacity:0;filter:brightness(2)}}
#apOr{display:flex;align-items:center;gap:10px;color:#64748b;font:700 13px Rajdhani;margin:14px 0 4px}#apOr:before,#apOr:after{content:'';flex:1;height:1px;background:#334155}
#auth .gu{display:block;width:100%;text-align:center;padding:11px!important;margin-top:6px!important;border:1px solid #334155!important;border-radius:12px;text-decoration:none!important;color:#e2e8f0!important;background:#0f172a!important;transition:.2s}#auth .gu:hover{border-color:#94a3b8!important;background:#1e293b!important}
#apVer{position:absolute;right:16px;bottom:10px;color:#475569;font:700 12px Rajdhani}
#apTick{position:absolute;left:0;right:0;top:0;height:30px;background:#000a;border-bottom:1px solid #ffd23f33;overflow:hidden;white-space:nowrap;font:700 15px Rajdhani;color:#fde68a;line-height:30px}
#apTick span{display:inline-block;padding-left:100%;animation:apTk 45s linear infinite}@keyframes apTk{to{transform:translateX(-100%)}}
@media (max-width:900px){#apInfo{display:none}#auth .box{flex:1}}
@media (max-height:760px){#apTop{display:none}}
`;document.head.appendChild(css);

// --- háttér ---
const glow=document.createElement('div');glow.id='apGlow';
const cv=document.createElement('canvas');cv.id='apCv';
const tick=document.createElement('div');tick.id='apTick';
tick.innerHTML='<span>📰 FRISS HÍREK: Rekordösszeg tűnt el a kampánybuszból &nbsp;•&nbsp; 💸 A KÖZPÉNZ-FOGDA ismét telt házzal üzemel &nbsp;•&nbsp; 🐕 A Puli lett a szezon legnépszerűbb állata &nbsp;•&nbsp; 🛥️ Újabb óriásjacht horgonyzott le a lobby mellett &nbsp;•&nbsp; 🏆 Győzz, és a tiéd lehet a teljes közpénz (játékpénz) &nbsp;•&nbsp; 🎰 VÁLTÓ: 100 Ft = 1 zseton &nbsp;•&nbsp; 🪂 A busz végén mindenki kiszáll – ez sajnos nem választás kérdése</span>';
au.prepend(cv,glow);au.appendChild(tick);

const box=au.querySelector('.box');
const wrap=document.createElement('div');wrap.id='apWrap';
const info=document.createElement('div');info.id='apInfo';
info.innerHTML=`<div class="lg">KÖZPÉNZ<br>ROYALE</div><div class="tag">25 JÁTÉKOS · 1 SZIGET · A KÖZPÉNZ NEM VÉSZ EL, CSAK ÁTALAKUL</div>
<div id="apModes"><div class="m"><i>🪂</i><b>BATTLE ROYALE</b><small>Solo, duó, trió, squad. Szűkülő vihar, 100 láda.</small></div>
<div class="m"><i>🏝️</i><b>MENTSD MEG A SZIGETET</b><small>Farmolás, műhely, küldetések, evakuálás.</small></div>
<div class="m"><i>🧴</i><b>FLAKONVADÁSZAT</b><small>Gyűjtsd a flakonokat, váltsd forintra.</small></div></div>
<div class="apCard" id="apStats"><div class="st"><b id="apSU">–</b><small>Regisztrált</small></div><div class="st"><b id="apSO">–</b><small>Online most</small></div><div class="st"><b>140+</b><small>Kiegészítő</small></div><div class="st"><b>10</b><small>Kutyafajta</small></div></div>
<div class="apCard" id="apTip"></div>
<div class="apCard" id="apTop"><h4>🏆 RANGLISTA – TOP 5</h4><div id="apTopL" style="color:#94a3b8;font:600 14px Rajdhani">Betöltés...</div></div>`;
au.insertBefore(wrap,box);wrap.append(info,box);
const ver=document.createElement('div');ver.id='apVer';ver.textContent='KÖZPÉNZ ROYALE · Final v1.1';au.appendChild(ver);

// --- űrlap átépítése (meglévő elemek, handlerek megmaradnak) ---
const head=document.createElement('div');head.id='apHead';
head.innerHTML='<div class="av" id="apAv">😎</div><div><h3 id="apH">ÜDV ÚJRA!</h3><p id="apP">Lépj be, a közpénz már vár.</p><div id="apSrv"><i></i><span>Szerver ellenőrzése...</span></div></div>';
box.insertBefore(head,box.querySelector('.tb'));
function field(inp,ic,hintId,eye){const f=document.createElement('div');f.className='apF';inp.parentNode.insertBefore(f,inp);f.innerHTML='<span class="ic">'+ic+'</span>';f.appendChild(inp);
 if(eye){const b=document.createElement('button');b.type='button';b.className='apEye';b.textContent='👁️';b.title='Jelszó mutatása';b.onclick=()=>{inp.type=inp.type==='password'?'text':'password';b.textContent=inp.type==='password'?'👁️':'🙈'};f.appendChild(b)}
 const h=document.createElement('div');h.className='apHint';h.id=hintId;f.after(h);return f}
const N=$('auN'),P=$('auP'),P2=$('auP2');
field(N,'👤','apHN');const fP=field(P,'🔒','apHP',true);const fP2=field(P2,'🔁','apHP2',true);
P2.style.display='block';fP2.style.display='none';$('apHP2').style.display='none';
const str=document.createElement('div');str.id='apStr';str.innerHTML='<i></i>';str.style.display='none';$('apHP').before(str);
const caps=document.createElement('div');caps.id='apCaps';caps.textContent='⇪ A Caps Lock be van kapcsolva!';$('apHP').after(caps);
const avs=document.createElement('div');avs.id='apAvs';const AV=['😎','🤑','🦊','🐸','🤖','👑','🐷','🦁','🥷','🧙'];
avs.innerHTML=AV.map((a,i)=>'<button type="button" class="'+(i?'':'on')+'">'+a+'</button>').join('');
const terms=document.createElement('label');terms.id='apTerms';terms.innerHTML='<input type="checkbox" id="apT"> Tudomásul veszem, hogy a közpénz itt csak játékpénz. 😉';
const row=document.createElement('div');row.id='apRow';row.innerHTML='<label><input type="checkbox" id="apRem" checked> Emlékezz a nevemre</label><label style="margin-left:10px"><input type="checkbox" id="apRemP"> Jelszó mentése (böngésző)</label><span id="apCnt"></span>';
const go=$('auGo');go.before(avs,terms,row);
const or=document.createElement('div');or.id='apOr';or.textContent='VAGY';$('auG').before(or);$('auG').textContent='🎮 Játék vendégként (offline)';

let avSel=localStorage.getItem('ap_av')||'😎';
avs.querySelectorAll('button').forEach(b=>{b.classList.toggle('on',b.textContent===avSel);b.onclick=()=>{avSel=b.textContent;avs.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));$('apAv').textContent=avSel;$('apAv').animate([{transform:'scale(1.4) rotate(-10deg)'},{transform:'none'}],{duration:350})}});
const last=localStorage.getItem('ap_name');if(last){N.value=last;setTimeout(()=>P.focus(),300)}
{const pw=localStorage.getItem('ap_pw');localStorage.removeItem('ap_pw');const fill=v=>{P.value=v;$('apRemP').checked=true;setTimeout(()=>{try{checkPass()}catch(e){}go.focus()},350)};if(pw){try{fill(decodeURIComponent(escape(atob(pw))));if(window.PasswordCredential&&N.value)navigator.credentials.store(new PasswordCredential({id:N.value.trim(),password:P.value})).catch(()=>{})}catch(e){}}else if(window.PasswordCredential&&navigator.credentials){navigator.credentials.get({password:true,mediation:'optional'}).then(c=>{if(c&&c.password){if(!N.value)N.value=c.id;fill(c.password)}}).catch(()=>{})}}

// --- módváltás ---
let mode='login';
function setMode(m){mode=m;const r=m==='reg';
 fP2.style.display=r?'block':'none';$('apHP2').style.display=r?'block':'none';str.style.display=r?'block':'none';avs.style.display=r?'flex':'none';terms.style.display=r?'flex':'none';
 $('apH').textContent=r?'ÚJ FIÓK':'ÜDV ÚJRA!';$('apP').textContent=r?'Pár másodperc, és máris osztozhatsz a közpénzen.':'Lépj be, a közpénz már vár.';
 $('apAv').textContent=r?avSel:'😎';P.autocomplete=r?'new-password':'current-password';checkName();checkPass();box.animate([{opacity:.6,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:250})}
au.querySelectorAll('.tb button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.m)));
// lobby.js elrejtené a P2-t: mindig a wrapper dönt
new MutationObserver(()=>{if(P2.style.display!=='block')P2.style.display='block'}).observe(P2,{attributes:true,attributeFilter:['style']});

// --- élő ellenőrzés ---
const NRE=/^[A-Za-z0-9_áéíóöőúüűÁÉÍÓÖŐÚÜŰ]{3,16}$/;let nt=0;
function hint(id,t,c){const h=$(id);h.textContent=t;h.className='apHint'+(c?' '+c:'')}
function checkName(){const v=N.value.trim();N.classList.remove('good','bad');$('apCnt').textContent=v.length+'/16';
 if(!v){hint('apHN','');return}
 if(!NRE.test(v)){N.classList.add('bad');hint('apHN','3–16 karakter: betű, szám, _','b');return}
 if(mode!=='reg'){hint('apHN','');return}
 clearTimeout(nt);hint('apHN','Ellenőrzés...');nt=setTimeout(async()=>{try{const r=await(await fetch('/api/check?name='+encodeURIComponent(v))).json();if(N.value.trim()!==v)return;
  if(r.free){N.classList.add('good');hint('apHN','✓ Szabad név!','g')}else{N.classList.add('bad');hint('apHN','✗ Ez a név már foglalt.','b')}}catch(e){hint('apHN','')}},350)}
function score(p){let s=0;if(p.length>=6)s++;if(p.length>=10)s++;if(/[A-ZÁÉÍÓÖŐÚÜŰ]/.test(p)&&/[a-záéíóöőúüű]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ]/.test(p))s++;return p.length<6?0:s}
function checkPass(){const p=P.value;if(mode!=='reg'){hint('apHP','');P.classList.remove('good','bad');return}
 const s=score(p),L=[['Túl rövid (min. 6)','#ef4444'],['Gyenge','#f97316'],['Elmegy','#eab308'],['Jó','#84cc16'],['Erős','#22c55e'],['Páncélszekrény 🔐','#10b981']][s];
 const bar=str.firstChild;bar.style.width=(p?Math.max(8,s/5*100):0)+'%';bar.style.background=L[1];hint('apHP',p?'Jelszó: '+L[0]:'',s?'':'b');
 P.classList.toggle('good',s>=3);P.classList.toggle('bad',!!p&&s===0);
 const q=P2.value;P2.classList.remove('good','bad');if(q){const ok=q===p;P2.classList.add(ok?'good':'bad');hint('apHP2',ok?'✓ Egyezik':'✗ Nem egyezik',ok?'g':'b')}else hint('apHP2','')}
N.addEventListener('input',checkName);P.addEventListener('input',checkPass);P2.addEventListener('input',checkPass);
[P,P2].forEach(i=>i.addEventListener('keyup',e=>{caps.style.display=e.getModifierState&&e.getModifierState('CapsLock')?'block':'none'}));

// --- küldés: előellenőrzés + animáció, aztán az eredeti handler ---
const orig=go.onclick;
function shake(){box.classList.remove('shake');void box.offsetWidth;box.classList.add('shake')}
go.onclick=async()=>{
 if(mode==='reg'&&!$('apT').checked){$('auE').textContent='Pipáld be a feltételt!';shake();return}
 if(localStorage)$('apRem').checked?localStorage.setItem('ap_name',N.value.trim()):localStorage.removeItem('ap_name');
 if(mode==='reg')localStorage.setItem('ap_av',avSel);
 localStorage.removeItem('ap_pw');if($('apRemP').checked){$('apRem').checked=true;localStorage.setItem('ap_name',N.value.trim());try{if(window.PasswordCredential)navigator.credentials.store(new PasswordCredential({id:N.value.trim(),password:P.value})).catch(()=>{})}catch(e){}}
 go.classList.add('load');try{await orig()}finally{go.classList.remove('load')}
 if($('auE').textContent)shake()};
// Enter: lobby.js a doAuth-ot hívja közvetlenül, ezt itt kapjuk el előbb
[N,P,P2].forEach(i=>i.addEventListener('keydown',e=>{if(e.key==='Enter'){e.stopImmediatePropagation();e.preventDefault();go.onclick()}},true));
// sikeres belépés: villanás
new MutationObserver(()=>{if(!au.classList.contains('on'))box.classList.remove('win','shake')}).observe(au,{attributes:true,attributeFilter:['class']});

// --- szerver, statisztika, ranglista ---
async function stats(){const s=$('apSrv');try{const r=await(await fetch('/api/stats')).json();s.className='ok';s.lastChild.textContent='Szerver online';$('apSU').textContent=r.users;$('apSO').textContent=r.online}
 catch(e){s.className='bad';s.lastChild.textContent='Szerver nem elérhető – csak vendég mód'}}
async function top(){try{const r=await(await fetch('/api/leaderboard')).json();const M=['🥇','🥈','🥉','4.','5.'];
 $('apTopL').innerHTML=r.list.length?r.list.slice(0,5).map((u,i)=>'<div class="r"><span>'+M[i]+'</span><span>'+String(u.name).replace(/[<>&]/g,'')+'</span><em>🏆 '+(u.stats.wins|0)+' · 💀 '+(u.stats.kills|0)+'</em></div>').join(''):'Még senki – légy te az első!'}catch(e){$('apTopL').textContent='Offline'}}
stats();top();setInterval(()=>{if(au.classList.contains('on'))stats()},15000);

// --- tippek ---
const TIPS=['Tartsd nyomva az E-t 3 mp-ig a ládák kinyitásához.','A csákány a 0-s slotban van – fákból és házakból nyersanyag lesz.','B gombbal építhetsz falat, rámpát, padlót.','Jobb klikk mesterlövész-puskával = 4x nagyítás.','1% esély, hogy TE vezeted a kampánybuszt!','Az I gomb megnyitja az inventoryt.','A VÁLTÓ-ban 100 Ft = 1 zseton.','Esésből sebzést kapsz – vigyázz a tetőkön!','A kék légi ellátmányban mítikus fegyver lapul.','A kutyád a lobbyban is ott áll melletted.'];
let ti=Math.random()*TIPS.length|0;const tip=$('apTip');function nextTip(){tip.style.opacity=0;setTimeout(()=>{tip.textContent=TIPS[ti++%TIPS.length];tip.style.opacity=1},400)}nextTip();setInterval(nextTip,6000);

// --- részecskék: hulló pénz és érmék ---
const cx=cv.getContext('2d');let W,H,parts=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight}rs();addEventListener('resize',rs);
const SYM=['💵','🪙','💶','💰','🪙'];
for(let i=0;i<46;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,v:.4+Math.random()*1.2,s:16+Math.random()*22,r:Math.random()*6,vr:(Math.random()-.5)*.03,w:Math.random()*6,c:SYM[i%SYM.length],a:.25+Math.random()*.5});
let mx=0,my=0;au.addEventListener('mousemove',e=>{mx=e.clientX/W-.5;my=e.clientY/H-.5;info.style.transform='translate('+(-mx*10)+'px,'+(-my*8)+'px)'});
function loop(){requestAnimationFrame(loop);if(!au.classList.contains('on'))return;cx.clearRect(0,0,W,H);const t=performance.now()/1000;
 for(const p of parts){p.y+=p.v;p.r+=p.vr;if(p.y>H+40){p.y=-40;p.x=Math.random()*W}
  cx.save();cx.globalAlpha=p.a;cx.translate(p.x+Math.sin(t+p.w)*20+mx*p.s*2,p.y+my*p.s);cx.rotate(p.r);cx.font=p.s+'px serif';cx.fillText(p.c,-p.s/2,p.s/2);cx.restore()}}
loop();
setMode('login');
})();
