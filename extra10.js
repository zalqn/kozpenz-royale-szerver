// ===== EXTRA10: zipline+mozgó platform · quad+csónak · fejlövés+színes sebzés · kill-cam+ping · közelharc+csúszás
// póker+nyerőgép (veszteséghatár, napi ingyen pörgetés) · napi kihívások+achievementek · barlang+titkos szoba aranyládával
// gyors újrakezdés+meccsösszegző térkép · billentyű-átállítás+kontroller
(function(){
const SH_=(e,h)=>{if(e._h!==h){e._h=h;e.innerHTML=h}},SD_=(e,d)=>{if(e.style.display!==d)e.style.display=d},ST_=(e,t)=>{if(e._t!==t){e._t=t;e.textContent=t}};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x10pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x10 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a);
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const LS=(k,d)=>{try{return Object.assign(d,JSON.parse(localStorage.getItem(k)||'{}'))}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};
const saveAll=()=>{try{save()}catch(e){}try{st.s('k3br',BR)}catch(e){}};

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
.x10n{position:fixed;z-index:6;pointer-events:none;font:900 20px 'Luckiest Guy',Impact,sans-serif;text-shadow:0 2px 0 #000,0 0 6px #000;transform:translate(-50%,-50%);transition:transform .7s ease-out,opacity .7s}
#x10P{position:fixed;left:50%;top:62%;transform:translateX(-50%);z-index:6;background:#000b;color:#fff;font:700 16px Rajdhani,sans-serif;padding:5px 12px;border-radius:10px;display:none;pointer-events:none}
#x10P b{color:#facc15}
.x10ping{position:fixed;z-index:6;pointer-events:none;transform:translate(-50%,-100%);font:700 13px Rajdhani,sans-serif;color:#fff;text-align:center;text-shadow:0 1px 2px #000}
.x10ping i{display:block;font-style:normal;font-size:24px}
#x10M{position:fixed;inset:0;z-index:60;background:#000a;display:none;align-items:center;justify-content:center}
#x10M>div{background:linear-gradient(160deg,#141a35,#0b1022);border:1px solid #ffffff2a;border-radius:18px;padding:18px 22px;color:#fff;font:600 16px Rajdhani,sans-serif;max-width:720px;width:92vw;max-height:88vh;overflow:auto;box-shadow:0 20px 60px #000}
#x10M h2{margin:0 0 8px;font:26px 'Luckiest Guy',Impact;color:#fde68a}
#x10M button{display:inline-block;width:auto;border:0;border-radius:10px;padding:7px 12px;margin:3px;font:700 15px Rajdhani,sans-serif;cursor:pointer;background:#334155;color:#fff}
#x10M button.y{background:linear-gradient(135deg,#fde68a,#f59e0b);color:#1c1300}#x10M button.g{background:#16a34a}#x10M button:disabled{opacity:.4;cursor:default}
.x10card{display:inline-flex;width:74px;height:104px;margin:5px;border-radius:9px;background:#fff;color:#111;font:900 28px Georgia,serif;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;border:3px solid transparent;position:relative}
.x10card.r{color:#dc2626}.x10card.h{border-color:#facc15;box-shadow:0 0 14px #facc15}.x10card.h:after{content:'TART';position:absolute;bottom:-20px;font:700 12px Rajdhani;color:#facc15}
.x10reel{display:inline-block;width:90px;height:90px;margin:6px;border-radius:14px;background:#0008;border:2px solid #facc1566;font-size:56px;line-height:90px;text-align:center}
.x10row{display:flex;justify-content:space-between;align-items:center;padding:6px 8px;margin:4px 0;background:#ffffff0d;border-radius:10px}
.x10bar{height:7px;background:#ffffff22;border-radius:4px;overflow:hidden;margin-top:3px}.x10bar i{display:block;height:100%;background:#4ade80}
#x10Map{display:block;margin:10px auto 4px;border-radius:12px;background:#0c4a6e;max-width:100%}
#x10Kc{display:block;margin:8px auto;border-radius:12px;max-width:100%;border:2px solid #ef4444}
#x10Toast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:61;background:linear-gradient(135deg,#fde68a,#f59e0b);color:#1c1300;font:22px 'Luckiest Guy',Impact;padding:10px 22px;border-radius:14px;display:none;box-shadow:0 8px 30px #000a}`;
document.head.appendChild(css);
const prompt=document.createElement('div');prompt.id='x10P';document.body.appendChild(prompt);
const modal=document.createElement('div');modal.id='x10M';modal.innerHTML='<div id="x10MB"></div>';document.body.appendChild(modal);
modal.addEventListener('mousedown',e=>{if(e.target===modal)closeM()});
const toastEl=document.createElement('div');toastEl.id='x10Toast';document.body.appendChild(toastEl);let toastT=0;
function toast(t){toastEl.textContent=t;toastEl.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>toastEl.style.display='none',2600)}
function openM(h){$$('x10MB').innerHTML=h;modal.style.display='flex';if(document.pointerLockElement)document.exitPointerLock()}
function closeM(){modal.style.display='none';if(SLOT.spin)SLOT.spin=false}
window.x10close=closeM;

// =====================================================================
// 7) NAPI KIHÍVÁSOK + ACHIEVEMENTEK
// =====================================================================
const CH=LS('k3x10ch',{day:'',list:[],tot:{},ach:{}});
const POOL=[['kill','Ejts ki 15 ellenfelet',15],['hs','Szerezz 5 fejlövést',5],['melee','Ejts ki 2 ellenfelet közelharcban',2],['win','Nyerj meg 1 meccset',1],['zip','Csússz le 2× zipline-on',2],['ram','Gázolj el 1 ellenfelet járművel',1],['chest','Nyiss ki egy aranyládát',1],['ping','Pingelj 5×',5],['match','Játssz 3 meccset',3],['poker','Nyerj egy pókerkört',1],['slot','Pörgess 5× a nyerőgépen',5],['slide','Csússz 5×',5]];
const ACH=[['hs1','Első fejlövés','hs',1],['hs25','Mesterlövész (25 fejlövés)','hs',25],['k100','Százas lista (100 kiesés)','kill',100],['m10','Serpenyőmester (10 közelharc)','melee',10],['w5','Ötszörös győztes','win',5],['c3','Kincsvadász (3 aranyláda)','chest',3],['z10','Kötéltáncos (10 zipline)','zip',10],['r5','Úthenger (5 gázolás)','ram',5],['p4','Póker-ász (póker / négyes)','poker4',1],['j7','Főnyeremény (777)','jack',1]];
function chDay(){const d=today();if(CH.day===d&&CH.list.length)return;let s=0;for(const c of d)s=(s*31+c.charCodeAt(0))>>>0;const idx=[...POOL.keys()];const pick3=[];while(pick3.length<3){s=(s*1103515245+12345)>>>0;const i=idx.splice(s%idx.length,1)[0];pick3.push(i)}
 CH.day=d;CH.list=pick3.map(i=>({k:POOL[i][0],n:POOL[i][1],goal:POOL[i][2],p:0,done:false,cl:false}));SV('k3x10ch',CH)}
chDay();
function stat(k,n){n=n||1;chDay();CH.tot[k]=(CH.tot[k]||0)+n;CH.list.forEach(c=>{if(c.k===k&&!c.done){c.p=Math.min(c.goal,c.p+n);if(c.p>=c.goal){c.done=true;toast('✅ Kihívás kész: '+c.n);try{sfx('drop')}catch(e){}}}});
 ACH.forEach(([id,n,kk,g])=>{if(!CH.ach[id]&&kk===k&&CH.tot[k]>=g){CH.ach[id]=today();try{S.c+=20000;BR.zs+=100}catch(e){}saveAll();toast('🏆 '+n+' (+20 000 Ft, +100 zseton)')}});SV('k3x10ch',CH)}
window.x10stat=stat;
window.x10claim=i=>{const c=CH.list[i];if(!c||!c.done||c.cl)return;c.cl=true;try{S.c+=25000;BR.zs+=150}catch(e){}saveAll();SV('k3x10ch',CH);toast('🎁 +25 000 Ft, +150 zseton');showCh()};
function showCh(){chDay();const f=n=>(+n).toLocaleString('hu-HU');
 openM('<h2>🏅 NAPI KIHÍVÁSOK</h2><div style="opacity:.7;font-size:13px">Éjfélkor újak jönnek · jutalom: 25 000 Ft + 150 zseton</div>'+CH.list.map((c,i)=>'<div class="x10row"><div style="flex:1">'+(c.done?'✅ ':'⬜ ')+c.n+'<div class="x10bar"><i style="width:'+(c.p/c.goal*100)+'%"></i></div><small>'+c.p+'/'+c.goal+'</small></div>'+(c.cl?'<span style="opacity:.6">átvéve</span>':'<button class="'+(c.done?'y':'')+'" '+(c.done?'':'disabled')+' onclick="x10claim('+i+')">ÁTVESZ</button>')+'</div>').join('')+
 '<h2 style="margin-top:14px">🏆 ACHIEVEMENTEK ('+Object.keys(CH.ach).length+'/'+ACH.length+')</h2>'+ACH.map(([id,n,k,g])=>'<div class="x10row" style="opacity:'+(CH.ach[id]?1:.55)+'"><span>'+(CH.ach[id]?'🏆':'🔒')+' '+n+'</span><small>'+(CH.ach[id]?CH.ach[id]:Math.min(g,CH.tot[k]||0)+'/'+g)+'</small></div>').join('')+
 '<div style="text-align:right;margin-top:10px"><button onclick="x10close()">BEZÁR</button></div>')}
window.x10ch=showCh;

// =====================================================================
// 6) PÓKER + NYERŐGÉP (zseton), veszteséghatár, napi ingyen pörgetés
// =====================================================================
const LIM=LS('k3x10lim',{day:'',lost:0,lim:3000,free:''});
function limDay(){if(LIM.day!==today()){LIM.day=today();LIM.lost=0;SV('k3x10lim',LIM)}}
function canBet(b){limDay();if(typeof BR==='undefined')return'Nincs zseton-rendszer';if(BR.zs<b)return'Nincs elég zseton!';if(LIM.lim>0&&LIM.lost+b>LIM.lim)return'⛔ Elérted a napi veszteséghatárt ('+LIM.lim+' zseton). Holnap folytathatod!';return''}
function bet(b){BR.zs-=b;LIM.lost+=b;SV('k3x10lim',LIM);saveAll()}
function pay(w){if(w>0){BR.zs+=w;LIM.lost=Math.max(-1e9,LIM.lost-w);SV('k3x10lim',LIM);saveAll()}}
window.x10lim=v=>{LIM.lim=v;SV('k3x10lim',LIM);casMenu()};
function casMenu(){limDay();const left=LIM.lim>0?Math.max(0,LIM.lim-LIM.lost):'∞';
 openM('<h2>🎰 EXTRA KASZINÓ</h2><div>Zseton: <b style="color:#facc15">'+BR.zs+'</b> · mai nettó veszteség: <b>'+Math.max(0,LIM.lost)+'</b> · még tehető: <b>'+left+'</b></div><div style="opacity:.7;font-size:13px">Csak játékbeli zsetonnal. Valódi pénz nincs benne.</div>'+
 '<div style="display:flex;gap:10px;margin:14px 0"><button class="y" style="flex:1;padding:18px;font-size:20px" onclick="x10poker()">🃏 PÓKER<br><small>Jolly Joker nélkül, „Bubi vagy jobb”</small></button><button class="y" style="flex:1;padding:18px;font-size:20px" onclick="x10slot()">🍒 NYERŐGÉP<br><small>'+(LIM.free===today()?'a mai ingyen pörgetés elhasználva':'🎁 VAN MAI INGYEN PÖRGETÉS!')+'</small></button></div>'+
 '<b>⛔ Napi veszteséghatár:</b> '+[[1000,'1000'],[3000,'3000'],[10000,'10 000'],[0,'nincs']].map(([v,l])=>'<button class="'+(LIM.lim===v?'g':'')+'" onclick="x10lim('+v+')">'+l+'</button>').join('')+
 '<div style="text-align:right;margin-top:10px"><button onclick="x10close()">BEZÁR</button></div>')}
window.x10cas=casMenu;
// --- póker (video póker) ---
const SU=['♠','♥','♦','♣'],RK=['2','3','4','5','6','7','8','9','10','B','D','K','A'];
const PK={bet:50,hand:[],hold:[],deck:[],st:'bet',res:''};
const PAY=[['Royal flöss',250],['Színsor',50],['Póker',25],['Full',9],['Flöss',6],['Sor',4],['Drill',3],['Két pár',2],['Bubi vagy jobb pár',1]];
function evalH(h){const r=h.map(c=>c.r).sort((a,b)=>a-b),s=h.map(c=>c.s);const fl=s.every(x=>x===s[0]);const cnt={};r.forEach(x=>cnt[x]=(cnt[x]||0)+1);const v=Object.values(cnt).sort((a,b)=>b-a);
 const uniq=new Set(r).size===5;let str=uniq&&r[4]-r[0]===4;if(uniq&&r.join()==='0,1,2,3,12')str=true;
 if(str&&fl&&r[0]===8)return 0;if(str&&fl)return 1;if(v[0]===4)return 2;if(v[0]===3&&v[1]===2)return 3;if(fl)return 4;if(str)return 5;if(v[0]===3)return 6;if(v[0]===2&&v[1]===2)return 7;
 if(v[0]===2){const p=+Object.keys(cnt).find(k=>cnt[k]===2);if(p>=9)return 8}return -1}
function newDeck(){const d=[];for(let s=0;s<4;s++)for(let r=0;r<13;r++)d.push({r,s});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d}
function pkDraw(){const c=PK.hand.map((x,i)=>'<div class="x10card '+(x.s===1||x.s===2?'r':'')+(PK.hold[i]?' h':'')+'" onclick="x10hold('+i+')">'+RK[x.r]+'<span>'+SU[x.s]+'</span></div>').join('');
 openM('<h2>🃏 PÓKER</h2><div>Zseton: <b style="color:#facc15">'+BR.zs+'</b> · tét: '+[10,50,100,250].map(b=>'<button class="'+(PK.bet===b?'g':'')+'" '+(PK.st==='hold'?'disabled':'')+' onclick="x10pbet('+b+')">'+b+'</button>').join('')+'</div>'+
 '<div style="text-align:center;margin:14px 0 26px;min-height:120px">'+(c||'<div style="opacity:.6;padding:40px">Nyomd meg az OSZTÁS gombot!</div>')+'</div>'+
 '<div style="text-align:center;font-size:20px;min-height:26px;color:#fde68a">'+PK.res+'</div>'+
 '<div style="text-align:center">'+(PK.st==='hold'?'<button class="y" style="font-size:20px;padding:10px 30px" onclick="x10pgo()">CSERE ('+PK.hold.filter(Boolean).length+' tartva)</button>':'<button class="y" style="font-size:20px;padding:10px 30px" onclick="x10pgo()">OSZTÁS ('+PK.bet+')</button>')+'</div>'+
 '<div style="font-size:13px;opacity:.75;margin-top:10px;columns:2">'+PAY.map(([n,m])=>n+': ×'+m).join('<br>')+'</div>'+
 '<div style="text-align:right;margin-top:8px"><button onclick="x10cas()">◀ VISSZA</button></div>')}
window.x10poker=()=>{PK.st=PK.st==='hold'?'hold':'bet';pkDraw()};
window.x10pbet=b=>{PK.bet=b;pkDraw()};
window.x10hold=i=>{if(PK.st!=='hold')return;PK.hold[i]=!PK.hold[i];pkDraw()};
window.x10pgo=()=>{if(PK.st!=='hold'){const e=canBet(PK.bet);if(e){PK.res=e;pkDraw();return}bet(PK.bet);PK.deck=newDeck();PK.hand=PK.deck.splice(0,5);PK.hold=[0,0,0,0,0];PK.st='hold';const v=evalH(PK.hand);PK.res=v>=0?'Már most: '+PAY[v][0]+' — tartsd meg!':'Válaszd ki, mit tartasz meg!';pkDraw();return}
 PK.hand=PK.hand.map((c,i)=>PK.hold[i]?c:PK.deck.shift());PK.hold=[0,0,0,0,0];PK.st='bet';const v=evalH(PK.hand);
 if(v>=0){const w=PK.bet*PAY[v][1];pay(w);PK.res='🎉 '+PAY[v][0]+'! +'+w+' zseton';stat('poker');if(v<=2)stat('poker4')}else PK.res='Semmi. Próbáld újra!';pkDraw()};
// --- nyerőgép ---
const SY=['🍒','🍋','🔔','⭐','💎','7️⃣'],SW=[30,25,18,13,8,4],SM={'🍒':5,'🍋':8,'🔔':12,'⭐':20,'💎':40,'7️⃣':100};
const SLOT={bet:50,r:['🍒','⭐','7️⃣'],res:'',spin:false};
const rollSym=()=>{let t=Math.random()*SW.reduce((a,b)=>a+b),i=0;while(t>SW[i]){t-=SW[i];i++}return SY[i]};
function slDraw(){const free=LIM.free!==today();
 openM('<h2>🍒 NYERŐGÉP</h2><div>Zseton: <b style="color:#facc15">'+BR.zs+'</b> · tét: '+[10,50,100,250].map(b=>'<button class="'+(SLOT.bet===b?'g':'')+'" onclick="x10sbet('+b+')">'+b+'</button>').join('')+'</div>'+
 '<div style="text-align:center;margin:16px 0">'+SLOT.r.map((s,i)=>'<span class="x10reel" id="x10r'+i+'">'+s+'</span>').join('')+'</div>'+
 '<div id="x10sres" style="text-align:center;font-size:20px;min-height:26px;color:#fde68a">'+SLOT.res+'</div><div style="text-align:center">'+
 '<button class="y" id="x10spinB" style="font-size:22px;padding:10px 34px" onclick="x10spin(false)">PÖRGETÉS ('+SLOT.bet+')</button>'+(free?'<button class="g" style="font-size:18px;padding:10px 20px" onclick="x10spin(true)">🎁 INGYEN PÖRGETÉS</button>':'')+'</div>'+
 '<div style="font-size:13px;opacity:.75;margin-top:10px">3 egyforma: '+SY.map(s=>s+'×'+SM[s]).join(' · ')+' · 2 egyforma: ×1,5 · bármely 🍒: ×0,5</div>'+
 '<div style="text-align:right;margin-top:8px"><button onclick="x10cas()">◀ VISSZA</button></div>')}
window.x10slot=slDraw;window.x10sbet=b=>{if(!SLOT.spin){SLOT.bet=b;slDraw()}};
window.x10spin=free=>{if(SLOT.spin)return;const b=free?50:SLOT.bet;if(free){if(LIM.free===today())return;LIM.free=today();SV('k3x10lim',LIM)}else{const e=canBet(b);if(e){SLOT.res=e;slDraw();return}bet(b)}
 SLOT.spin=true;const fin=[rollSym(),rollSym(),rollSym()];let t=0;const B=$$('x10spinB');if(B)B.disabled=true;
 const iv=setInterval(()=>{t++;for(let i=0;i<3;i++){const el=$$('x10r'+i);if(!el){clearInterval(iv);SLOT.spin=false;return}el.textContent=t<8+i*5?SY[Math.floor(Math.random()*6)]:fin[i]}try{tn(300+t*20,'square',.03,.04)}catch(e){}
  if(t>=18){clearInterval(iv);SLOT.spin=false;SLOT.r=fin;let m=0;if(fin[0]===fin[1]&&fin[1]===fin[2])m=SM[fin[0]];else if(fin[0]===fin[1]||fin[1]===fin[2]||fin[0]===fin[2])m=1.5;else if(fin.includes('🍒'))m=.5;
   const w=Math.round(b*m);pay(w);SLOT.res=w>0?'🎉 +'+w+' zseton':'Nem nyert.';if(m>=100){stat('jack');toast('7️⃣7️⃣7️⃣ FŐNYEREMÉNY!')}stat('slot');slDraw()}},70)};
window._x10k={LIM,canBet,bet,pay,SLOT,SY,SM,rollSym,slDraw,stat,today,SV,toast,PK};

// =====================================================================
// 10) BILLENTYŰ-ÁTÁLLÍTÁS + KONTROLLER
// =====================================================================
const KB=LS('k3x10kb',{});// cél -> fizikai
const ACTS=[['w','Előre'],['a','Balra'],['s','Hátra'],['d','Jobbra'],[' ','Ugrás'],['r','Újratöltés'],['b','Építés'],['q','Ulti'],['e','Interakció / közelharc'],['j','Csúszás'],['h','Gránát'],['n','Ugrópárna'],['y','Gyógyzóna'],['c','Dash'],['v','Nézetváltás'],['z','1. tárgy'],['x','2. tárgy']];
const kn=k=>k===' '?'SZÓKÖZ':k.length===1?k.toUpperCase():k;
function fire(type,key){const ev=new KeyboardEvent(type,{key,bubbles:true,cancelable:true});ev._x10=1;document.dispatchEvent(ev)}
function tr(e,type){if(e._x10||typing(e)||waitKey)return;const p=e.key.toLowerCase();const tgt=Object.keys(KB).find(t=>KB[t]===p&&t!==p);
 if(tgt){e.stopImmediatePropagation();e.preventDefault();fire(type,tgt);return}if(KB[p]&&KB[p]!==p){e.stopImmediatePropagation();e.preventDefault()}}
addEventListener('keydown',e=>tr(e,'keydown'),true);addEventListener('keyup',e=>tr(e,'keyup'),true);
let waitKey=null;
function kbDraw(){openM('<h2>⌨️ IRÁNYÍTÁS</h2><div style="opacity:.7;font-size:13px">Kattints egy gombra, majd nyomd meg az új billentyűt (Esc = mégse).</div>'+ACTS.map(([t,n])=>'<div class="x10row"><span>'+n+'</span><button class="'+(waitKey===t?'y':'')+'" onclick="x10kb(\''+(t===' '?'_':t)+'\')">'+(waitKey===t?'nyomj egy gombot…':kn(KB[t]||t))+'</button></div>').join('')+
 '<h2 style="margin-top:12px">🎮 KONTROLLER</h2><div style="font-size:14px;opacity:.85">Bal kar: mozgás · jobb kar: nézelődés · RT: lövés · A: ugrás · B: csúszás · X: újratöltés · Y: interakció/közelharc · LB/RB: fegyverváltás · LT: ping · Start: szünet · Back: térkép<br>Állapot: <b id="x10gp">'+(gpName()||'nincs csatlakoztatva (nyomj meg egy gombot rajta)')+'</b></div>'+
 '<div style="text-align:right;margin-top:10px"><button onclick="x10kbReset()">ALAPÉRTELMEZETT</button><button onclick="x10close()">BEZÁR</button></div>')}
window.x10kbOpen=kbDraw;window.x10kb=t=>{waitKey=t==='_'?' ':t;kbDraw()};window.x10kbReset=()=>{Object.keys(KB).forEach(k=>delete KB[k]);SV('k3x10kb',KB);kbDraw()};
addEventListener('keydown',e=>{if(!waitKey)return;e.preventDefault();e.stopImmediatePropagation();const k=e.key.toLowerCase();if(k!=='escape'){const used=Object.keys(KB).find(t=>KB[t]===k);if(used)delete KB[used];if(k===waitKey)delete KB[waitKey];else KB[waitKey]=k;SV('k3x10kb',KB)}waitKey=null;kbDraw()},true);
// kontroller
const gpName=()=>{const g=[...(navigator.getGamepads?navigator.getGamepads():[])].find(x=>x);return g?g.id.slice(0,40):''};
const GPP={};let gpStick=false;
function gpPoll(dt){const pads=navigator.getGamepads?navigator.getGamepads():[];const p=[...pads].find(x=>x);if(!p){if(gpStick){stick.x=stick.y=0;gpStick=false}return}
 const dz=v=>Math.abs(v)<.18?0:v,B=i=>p.buttons[i]&&(p.buttons[i].pressed||p.buttons[i].value>.5);
 const edge=(i,fn,up)=>{const b=B(i);if(b&&!GPP[i])fn();if(!b&&GPP[i]&&up)up();GPP[i]=b};
 if(modal.style.display==='flex'){edge(1,closeM);return}
 if(!inMatch())return;
 const lx=dz(p.axes[0]),ly=dz(p.axes[1]);if(lx||ly){stick.x=lx;stick.y=ly;gpStick=true}else if(gpStick){stick.x=stick.y=0;gpStick=false}
 const rx=dz(p.axes[2]||0),ry=dz(p.axes[3]||0);if(rx||ry){const sn=(typeof SET!=='undefined'&&SET.sens?SET.sens:1);G.ang+=rx*2.6*dt*sn;G.pit=Math.max(-1.5,Math.min(1.5,(G.pit||0)-ry*1.9*dt*sn))}
 if(typeof ms!=='undefined'){const t=B(7);if(t!==GPP.rt){ms.on=t;GPP.rt=t}}
 edge(0,()=>fire('keydown',' '),()=>fire('keyup',' '));edge(1,()=>fire('keydown','j'),()=>fire('keyup','j'));edge(2,()=>fire('keydown','r'),()=>fire('keyup','r'));edge(3,()=>fire('keydown','e'),()=>fire('keyup','e'));
 const sw=d=>{let i=G.wp;for(let n=0;n<5;n++){i=(i+(d>0?1:4))%5;if(G.own[i]){G.wp=i;break}}};edge(4,()=>sw(-1));edge(5,()=>sw(1));edge(6,doPing);edge(9,()=>fire('keydown','p'));edge(8,()=>fire('keydown','m'))}
let lastT=performance.now();(function loop(){const n=performance.now(),dt=Math.min(.1,(n-lastT)/1000);lastT=n;try{gpPoll(dt)}catch(e){}requestAnimationFrame(loop)})();
addEventListener('gamepadconnected',e=>{toast('🎮 Kontroller csatlakoztatva');const s=$$('x10gp');if(s)s.textContent=e.gamepad.id.slice(0,40)});

// lobby gombok a dokkba
function dockBtns(){const d=$$('soDock');if(!d||$$('x10cB'))return!!d;
 [['x10cB','🎰 PÓKER / NYERŐGÉP',casMenu],['x10hB','🏅 KIHÍVÁSOK',showCh],['x10kB','⌨️ IRÁNYÍTÁS',kbDraw]].forEach(([id,t,f])=>{const b=document.createElement('button');b.id=id;b.textContent=t;b.onclick=f;d.appendChild(b)});return true}
const di=setInterval(()=>{if(dockBtns())clearInterval(di)},800);

// =====================================================================
// MECCS: világ-elemek (zipline, mozgó platform, quad, csónak, barlang+titkos szoba)
// =====================================================================
let W=null;// meccs állapot
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.7},o||{}));
function okPt(x,z){if(G.arh)return typeof hin==='function'&&hin(x,z)&&hin(x+6,z)&&hin(x-6,z)&&hin(x,z+6)&&hin(x,z-6);return Math.hypot(x,z)<50&&z>-44}
function rp(minD){const R=G.arh?400:48;for(let i=0;i<400;i++){const x=RN(-R,R),z=RN(-R,R);if(!okPt(x,z))continue;if(minD&&Math.hypot(x-G.x,z-G.z)<minD)continue;return[x,z]}return[RN(-20,20),RN(-20,20)]}
function shore(){if(!G.arh)return null;for(let k=0;k<200;k++){const a=Math.random()*Math.PI*2;let x=Math.cos(a)*30,z=Math.sin(a)*30;if(!hin(x,z))continue;for(let d=30;d<470;d+=3){const nx=Math.cos(a)*d,nz=Math.sin(a)*d;if(!hin(nx,nz)){return[Math.cos(a)*(d+4),Math.sin(a)*(d+4),a]}}}return null}
function add(o){scene.add(o);W.objs.push(o);return o}
function buildWorld(){const g=G;W={objs:[],zips:[],plats:[],veh:[],cave:null,pings:[],nums:[],trail:[],kills:[],zip:null,drive:null,slide:0,mcd:0,lastHit:null,t:0,ramCd:new Map()};
 if(!normal())return;
 // zipline-ok
 const nz=g.arh?4:2;for(let i=0;i<nz;i++){const[a,b]=rp();const L=g.arh?RN(40,80):RN(22,34),an=Math.random()*Math.PI*2;let bx=a+Math.cos(an)*L,bz=b+Math.sin(an)*L;if(!okPt(bx,bz)){bx=a-Math.cos(an)*L;bz=b-Math.sin(an)*L;if(!okPt(bx,bz))continue}
  const P=(x,z,h)=>{const p=add(new THREE.Mesh(new THREE.CylinderGeometry(.25,.32,h,8),STD(0x78350f)));p.position.set(x,h/2,z);const top=add(new THREE.Mesh(new THREE.BoxGeometry(1.4,.25,.25),STD(0xf59e0b,{metalness:.5})));top.position.set(x,h,z);return p};
  const h1=10,h2=4.5;P(a,b,h1);P(bx,bz,h2);const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(a,h1-.2,b),new THREE.Vector3(bx,h2-.2,bz)]);add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x111111})));
  const st=add(new THREE.Mesh(new THREE.BoxGeometry(3,1,3),STD(0x92400e)));st.position.set(a,.5,b);// lépcsőfok-jelző
  const sg=spr('🪢 ZIPLINE [E]',2.2,'x');sg.position.set(a,h1+1.6,b);add(sg);
  W.zips.push({a:{x:a,y:h1-.2,z:b},b:{x:bx,y:h2-.2,z:bz},L:Math.hypot(bx-a,bz-b)})}
 // mozgó platformok
 const np=g.arh?4:2;for(let i=0;i<np;i++){const[x,z]=rp();const m=add(new THREE.Mesh(new THREE.BoxGeometry(5,.5,5),STD(0x0ea5e9,{metalness:.4,emissive:0x082f49})));const vert=i%2===0;
  const p={x,z,hw:2.5,hd:2.5,h:1,x0:x,z0:z,vert,ph:Math.random()*6,m,an:Math.random()*Math.PI*2};m.position.set(x,1,z);(g.plat=g.plat||[]).push(p);W.plats.push(p)}
 // járművek
 const nq=g.arh?3:1;for(let i=0;i<nq;i++){const[x,z]=rp(8);W.veh.push(mkVeh('quad',x,z,Math.random()*6))}
 const sh=shore();if(sh)W.veh.push(mkVeh('boat',sh[0],sh[1],sh[2]+Math.PI/2));
 // barlang + titkos szoba
 const[cx,cz]=rp(25);const cg=new THREE.Group();cg.position.set(cx,0,cz);const rock=STD(0x57534e,{flatShading:true,roughness:1});
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2;if(a>Math.PI*1.38&&a<Math.PI*1.62)continue;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(RN(2.4,3.2)),rock);r.position.set(Math.cos(a)*7,RN(1.5,2.5),Math.sin(a)*7);r.rotation.set(RN(0,3),RN(0,3),0);cg.add(r)}
 const roof=new THREE.Mesh(new THREE.SphereGeometry(8.5,14,8,0,Math.PI*2,0,Math.PI/2.2),STD(0x44403c,{flatShading:true,side:THREE.DoubleSide,roughness:1}));roof.scale.y=.6;roof.position.y=1.2;cg.add(roof);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(7,16),STD(0x292524));fl.rotation.x=-Math.PI/2;fl.position.y=.03;cg.add(fl);
 const crys=new THREE.Mesh(new THREE.OctahedronGeometry(.6),new THREE.MeshBasicMaterial({color:0x67e8f9}));crys.position.set(2.5,.8,1);cg.add(crys);
 // titkos fal (szétüthető) mögötte aranyláda
 const wall=new THREE.Mesh(new THREE.BoxGeometry(4,4,.8),STD(0x6b6259,{flatShading:true}));wall.position.set(0,2,-3.2);cg.add(wall);
 const chest=new THREE.Group();const cb=new THREE.Mesh(new THREE.BoxGeometry(1.6,.9,1),STD(0xfacc15,{metalness:.8,roughness:.25,emissive:0x5a3e00}));cb.position.y=.45;const lid=new THREE.Mesh(new THREE.BoxGeometry(1.65,.35,1.05),STD(0xeab308,{metalness:.8,roughness:.25,emissive:0x5a3e00}));lid.position.y=1.05;chest.add(cb,lid);chest.position.set(0,0,-5.2);cg.add(chest);
 const lb=spr('🕳️ BARLANG',2.6,'x');lb.position.set(0,7,0);cg.add(lb);
 add(cg);const ent=[cx+Math.cos(Math.PI*1.5)*7,cz+Math.sin(Math.PI*1.5)*7];
 W.cave={x:cx,z:cz,wall,wHp:3,chest,lid,open:false,crys};
 sayX('🗺️ Új a pályán: zipline-ok, mozgó platformok, quad'+(sh?', motorcsónak':'')+' és egy titokzatos barlang!')}
function mkVeh(k,x,z,a){const g=new THREE.Group();
 if(k==='quad'){const b=new THREE.Mesh(new THREE.BoxGeometry(1.4,.6,2.4),STD(0xdc2626,{metalness:.4,roughness:.4}));b.position.y=.9;const s=new THREE.Mesh(new THREE.BoxGeometry(.8,.3,.9),STD(0x111827));s.position.set(0,1.3,-.2);const hb=new THREE.Mesh(new THREE.BoxGeometry(1.4,.12,.12),STD(0x9ca3af,{metalness:.8}));hb.position.set(0,1.5,.9);g.add(b,s,hb);
  [[-.8,1],[.8,1],[-.8,-.9],[.8,-.9]].forEach(([wx,wz])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.4,12),STD(0x1f2937));w.rotation.z=Math.PI/2;w.position.set(wx,.45,wz);g.add(w)})}
 else{const b=new THREE.Mesh(new THREE.BoxGeometry(1.8,.7,4),STD(0xf8fafc,{roughness:.4}));b.position.y=.35;const s=new THREE.Mesh(new THREE.BoxGeometry(1.8,.12,1.4),STD(0x2563eb));s.position.set(0,.76,1.6);const ws=new THREE.Mesh(new THREE.BoxGeometry(1.4,.5,.08),new THREE.MeshStandardMaterial({color:0x93c5fd,transparent:true,opacity:.6}));ws.position.set(0,1,.4);g.add(b,s,ws)}
 const lb=spr(k==='quad'?'🏍️ QUAD [E]':'🚤 CSÓNAK [E]',1.8,'x');lb.position.y=3;g.add(lb);g.position.set(x,0,z);g.rotation.y=a;add(g);return{k,x,z,a,v:0,m:g,lb}}

// ---------- interakció ----------
function nearest(){const g=G;if(!W)return null;let best=null,bd=1e9;const ck=(d,o)=>{if(d<bd){bd=d;best=o}};
 if(W.drive)return{k:'exit'};
 W.veh.forEach(v=>{const d=Math.hypot(v.x-g.x,v.z-g.z);if(d<(v.k==='boat'?6:3.2))ck(d,{k:'veh',v})});
 W.zips.forEach(z=>{const d=Math.hypot(z.a.x-g.x,z.a.z-g.z);if(d<3.4&&!W.zip)ck(d,{k:'zip',z})});
 const c=W.cave;if(c&&c.wHp<=0&&!c.open){const wx=c.x,wz=c.z-5.2;const d=Math.hypot(wx-g.x,wz-g.z);if(d<3)ck(d,{k:'chest'})}
 return best}
function interact(){if(!normal()||!W)return;if(window.x20near&&window.x20near())return;const n=nearest();
 if(!n){melee();return}
 if(n.k==='exit'){exitVeh();return}
 if(n.k==='veh'){W.drive=n.v;n.v.lb.visible=false;n.v.v=0;sayX(n.v.k==='quad'?'🏍️ Felültél a quadra! W/S gáz-fék, A/D kormány, E kiszállás':'🚤 Beültél a csónakba! W/S gáz-fék, A/D kormány, E kiszállás a parton');try{sfx('jump')}catch(e){}return}
 if(n.k==='zip'){W.zip={z:n.z,t:0};stat('zip');try{sfx('jump')}catch(e){}sayX('🪢 Wiiii! (SZÓKÖZ: leugrás)');return}
 if(n.k==='chest')openChest()}
function exitVeh(){const v=W.drive,g=G;if(!v)return;if(v.k==='boat'){let ok=null;for(let r=3;r<12&&!ok;r+=1.5)for(let a=0;a<6.28;a+=.4){const x=v.x+Math.cos(a)*r,z=v.z+Math.sin(a)*r;if(hin(x,z)){ok=[x,z];break}}if(!ok){sayX('🌊 Itt nem tudsz kiszállni, menj közelebb a parthoz!');return}g.x=ok[0];g.z=ok[1]}
 else{g.x=v.x+Math.cos(v.a)*1.8;g.z=v.z-Math.sin(v.a)*1.8}
 g.y=0;g.vy=0;W.drive=null;v.v=0;v.lb.visible=true}
function openChest(){const c=W.cave,g=G;c.open=true;c.lid.rotation.x=-1.1;c.lid.position.z=-.45;c.lid.position.y=1.3;
 g.cash+=8000;g.hp=g.mhp;g.sh=g.msh;g.ul=100;try{g.res=g.res.map((r,i)=>r+(WPN[i]?WPN[i].mag*2:20))}catch(e){}
 for(let i=0;i<WPN.length;i++)if(!g.own[i]){g.own[i]=true;g.mag[i]=WPN[i].mag;g.res[i]=(g.res[i]||0)+WPN[i].res;sayX('🏆 ARANYLÁDA! '+WPN[i].e+' '+WPN[i].n+' + teljes élet/pajzs + ulti + 8000 Ft');break}
 if(WPN.every((_,i)=>g.own[i]))sayX('🏆 ARANYLÁDA! Teljes élet/pajzs, ulti, lőszer + 8000 Ft');try{ftx(c.x,c.z-5,'+8000 💰','');sfx('drop')}catch(e){}stat('chest')}

// ---------- 5) közelharc + csúszás ----------
function melee(){const g=G;if(!W||W.mcd>0||g.phase!=='play')return;W.mcd=.55;try{tn(180,'square',.08,.12)}catch(e){}
 const fx=Math.cos(g.ang),fz=Math.sin(g.ang);let hit=0;
 g.en.forEach(e=>{if(e.dead)return;const dx=e.x-g.x,dz=e.z-g.z,d=Math.hypot(dx,dz);if(d>3.4+(e.r||1)*.5)return;if((dx*fx+dz*fz)/(d||1)<.35)return;W.lastHit={melee:true,t:performance.now()};dmgE(e,g.slide>0?95:65,false);e.x+=fx*1.5;e.z+=fz*1.5;hit++});
 const c=W.cave;if(c&&c.wHp>0){const wx=c.x,wz=c.z-3.2;if(Math.hypot(wx-g.x,wz-g.z)<3.4){c.wHp--;c.wall.position.y-=.6;c.wall.rotation.z+=.15;try{sfx('wall')}catch(e){}
  if(c.wHp<=0){c.wall.visible=false;sayX('🔓 TITKOS SZOBA! Egy aranyláda van mögötte! [E]')}else sayX('🧱 Ez a fal kong... Üsd még '+c.wHp+'×!');hit++}}
 swing();if(hit)try{sfx('hit')}catch(e){}}
let swingEl=null;function swing(){if(!swingEl){swingEl=document.createElement('div');swingEl.style.cssText='position:fixed;right:22%;bottom:12%;font-size:110px;z-index:4;pointer-events:none;transition:transform .12s;transform:rotate(30deg)';swingEl.textContent='🍳';document.body.appendChild(swingEl)}
 swingEl.style.display='block';swingEl.style.transform='rotate(-60deg) translate(-60px,-30px)';setTimeout(()=>{swingEl.style.transform='rotate(30deg)'},130);setTimeout(()=>{swingEl.style.display='none'},380)}
function slide(){const g=G;if(!W||!normal()||g.phase!=='play'||W.slide>0||W.drive||W.zip)return;if(g.y>.3+(floorH({x:g.x,z:g.z,y:g.y})))return;
 const sp=Math.hypot(g.vx,g.vz);if(sp<5){sayX('🛝 Futás (Shift) közben tudsz csúszni!');return}W.slide=.75;g.slide=.75;const k=16/sp;g.vx*=k;g.vz*=k;try{sfx('jump')}catch(e){}stat('slide')}

// ---------- 4) ping ----------
function doPing(){if(!normal()||!W)return;const g=G;const d={x:Math.cos(g.ang)*Math.cos(g.pit||0),y:Math.sin(g.pit||0),z:Math.sin(g.ang)*Math.cos(g.pit||0)};const ey=g.y+1.7;
 let best=null,bs=.985;g.en.forEach(e=>{if(e.dead)return;const vx=e.x-g.x,vy=enemyY(e)-ey,vz=e.z-g.z,L=Math.hypot(vx,vy,vz);const c=(vx*d.x+vy*d.y+vz*d.z)/L;if(L<200&&c>bs){bs=c;best=e}});
 let p;if(best)p={e:best,t:7,k:'en'};else{let tt=d.y<-.02?ey/-d.y:60;tt=Math.min(tt,120);p={x:g.x+d.x*tt,z:g.z+d.z*tt,y:0,t:8,k:'pt'}}
 const el=document.createElement('div');el.className='x10ping';el.innerHTML='<i>'+(p.k==='en'?'🔴':'📍')+'</i><span></span>';document.body.appendChild(el);p.el=el;W.pings.push(p);if(W.pings.length>4){const o=W.pings.shift();o.el.remove()}
 try{tn(p.k==='en'?900:700,'sine',.12,.08)}catch(e){}sayX(p.k==='en'?'🔴 Ellenfél megjelölve!':'📍 Pingelve!');stat('ping');
 try{if(typeof wsend==='function'&&G.brMode)wsend({t:'x10ping',x:p.e?p.e.x:p.x,z:p.e?p.e.z:p.z})}catch(e){}}
addEventListener('mousedown',e=>{if(e.button===1&&inMatch()){e.preventDefault();doPing()}},true);
addEventListener('auxclick',e=>{if(e.button===1)e.preventDefault()});

// ---------- billentyűk ----------
addEventListener('keydown',e=>{if(typing(e)||!inMatch()||!normal())return;const k=e.key.toLowerCase();
 if(k==='e'&&!e.repeat)interact();if(k==='j'&&!e.repeat)slide();
 if(k===' '&&W&&W.zip){W.zip=null;G.vy=4}});

// ---------- 3) fejlövés + színes sebzésszámok ----------
const _v=new THREE.Vector3();
function scr(x,y,z){_v.set(x,y,z).project(cam);if(_v.z>1)return null;return[(_v.x+1)/2*innerWidth,(1-_v.y)/2*innerHeight]}
function num(x,y,z,t,col,big){if(!W)return;const el=document.createElement('div');el.className='x10n';el.textContent=t;el.style.color=col;if(big)el.style.fontSize='28px';document.body.appendChild(el);W.nums.push({el,x:x+RN(-.4,.4),y,z:z+RN(-.4,.4),t:0});if(W.nums.length>30){const o=W.nums.shift();o.el.remove()}}
let pre=null;
WP('dmgE',a=>{const e=a[0];if(!e)return;let hs=false;if(G&&G._hb!==undefined&&G._hb!==null){hs=G._hb>.45*Math.max(1,(e.r||1));G._hb=null;if(hs)a[1]*=1.6}pre={e,hp:e.hp,hs,raw:a[1],ct:a[2]}},
 a=>{if(!pre||pre.e!==a[0])return;const e=a[0],dmg=pre.hp-Math.max(e.hp,e.dead?-1e9:e.hp);const d=Math.round(pre.hp-e.hp);if(d<1){pre=null;return}const crit=d>pre.raw*1.5;
  const col=pre.hs?'#facc15':crit?'#fb923c':(W&&W.lastHit&&performance.now()-W.lastHit.t<50&&W.lastHit.melee)?'#f472b6':'#ffffff';
  const ey=(typeof enemyY==='function'?enemyY(e):1.5)+1;num(e.x,ey,e.z,(pre.hs?'🎯 ':'')+d,col,pre.hs||crit);
  if(pre.hs){stat('hs');try{tn(1200,'sine',.06,.08)}catch(er){}}
  if(e.dead&&W){W.killFlags={hs:pre.hs,melee:W.lastHit&&W.lastHit.melee&&performance.now()-W.lastHit.t<50,ram:W.lastHit&&W.lastHit.ram&&performance.now()-W.lastHit.t<50}}pre=null});
WP('kill',null,a=>{const e=a[0];if(!W)return;stat('kill');W.kills.push([e.x,e.z]);const f=W.killFlags||{};if(f.melee)stat('melee');if(f.ram)stat('ram');W.killFlags=null});
WP('hurt',a=>{if(!W||!G||a[1])return;W.lastAtk=null;let bd=1e9;(G.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-G.x,e.z-G.z);if(d<bd){bd=d;W.lastAtk=e}})});

// ---------- launch / update / end ----------
WP('launch',null,()=>{try{if(W)W.objs.forEach(o=>o.parent&&o.parent.remove(o))}catch(e){}try{if(W){W.pings.forEach(p=>p.el.remove());W.nums.forEach(n=>n.el.remove())}}catch(e){}W=null;
 if(typeof G!=='undefined'&&G){G._hb=null;try{buildWorld()}catch(e){console.error('x10 world',e);W=W||{objs:[],zips:[],plats:[],veh:[],pings:[],nums:[],trail:[],kills:[],ramCd:new Map()}}stat('match')}});
WP('update',null,a=>{if(typeof G==='undefined'||!G||G.over||!W)return;const g=G,dt=Math.min(.1,a[0]||.016);W.t+=dt;W.mcd=Math.max(0,(W.mcd||0)-dt);
 if(g.phase==='play'&&(!W.trail.length||W.t-W.tt>.6)){W.trail.push([g.x,g.z]);W.tt=W.t}
 // csúszás
 if(W.slide>0){W.slide-=dt;g.slide=W.slide;const k=Math.max(.7,1-dt*1.2);if(W.slide>0){}if(W.slide<=0){g.slide=0}}
 // mozgó platformok
 W.plats.forEach(p=>{const ox=p.x,oz=p.z,oh=p.h;p.ph+=dt*.6;if(p.vert){p.h=1+(Math.sin(p.ph)+1)*4}else{p.x=p.x0+Math.cos(p.an)*Math.sin(p.ph)*8;p.z=p.z0+Math.sin(p.an)*Math.sin(p.ph)*8;p.h=3}
  p.m.position.set(p.x,p.h-.25,p.z);if(Math.abs(g.x-ox)<p.hw&&Math.abs(g.z-oz)<p.hd&&Math.abs(g.y-oh)<.3){g.x+=p.x-ox;g.z+=p.z-oz;if(p.h>oh)g.y=p.h}});
 // zipline
 if(W.zip){const z=W.zip,A=z.z.a,B=z.z.b;z.t+=dt*16/z.z.L;const t=Math.min(1,z.t);g.x=A.x+(B.x-A.x)*t;g.z=A.z+(B.z-A.z)*t;g.y=A.y+(B.y-A.y)*t-2;g.vy=0;g.vx=g.vz=0;if(t>=1){W.zip=null;g.vy=2}}
 // jármű
 const v=W.drive;if(v){const th=((keys.w||keys.arrowup)?1:0)-((keys.s||keys.arrowdown)?1:0),st=((keys.a||keys.arrowleft)?1:0)-((keys.d||keys.arrowright)?1:0);const max=v.k==='quad'?26:30;
  v.v+=th*(th*v.v<0?40:18)*dt;v.v*=1-dt*(th?0.3:1.1);v.v=Math.max(-8,Math.min(max,v.v));v.a+=st*dt*1.9*Math.sign(v.v||1)*Math.min(1,Math.abs(v.v)/6);
  const nx=v.x+Math.sin(v.a)*v.v*dt,nz=v.z+Math.cos(v.a)*v.v*dt;let ok;
  if(v.k==='quad')ok=g.arh?hin(nx,nz):Math.hypot(nx,nz)<58;else ok=!hin(nx,nz)&&Math.hypot(nx,nz)<520;
  if(ok){v.x=nx;v.z=nz}else{v.v*=-.3}
  if(v.k==='quad'){const o={x:v.x,z:v.z};try{pushOut(o,1.2,.5)}catch(e){}if(Math.hypot(o.x-v.x,o.z-v.z)>.01){v.v*=.5}v.x=o.x;v.z=o.z}
  v.m.position.set(v.x,v.k==='boat'?Math.sin(W.t*3)*.12:0,v.z);v.m.rotation.y=v.a;if(v.k==='boat')v.m.rotation.z=Math.sin(W.t*2)*.05;
  g.x=v.x;g.z=v.z;g.y=v.k==='boat'?.4:.8;g.vx=g.vz=0;g.vy=0;
  if(Math.abs(v.v)>9)g.en.forEach(e=>{if(e.dead)return;if(Math.hypot(e.x-v.x,e.z-v.z)<2.4+(e.r||1)*.4){const lt=W.ramCd.get(e)||0;if(W.t-lt<1)return;W.ramCd.set(e,W.t);W.lastHit={ram:true,t:performance.now()};dmgE(e,Math.abs(v.v)*5,false);e.x+=Math.sin(v.a)*3;e.z+=Math.cos(v.a)*3;try{sfx('hit')}catch(er){}}})}
 // barlang kristály
 if(W.cave)W.cave.crys.rotation.y+=dt*2;
 // interakció-felirat
 if(normal()){const n=nearest();let t='';if(n){t=n.k==='exit'?'<b>[E]</b> Kiszállás':n.k==='veh'?'<b>[E]</b> '+(n.v.k==='quad'?'Quadra ülés':'Csónakba ülés'):n.k==='zip'?'<b>[E]</b> Zipline':n.k==='chest'?'<b>[E]</b> Aranyláda kinyitása':''}SH_(prompt,t);SD_(prompt,t?'block':'none')}else SD_(prompt,'none');
 // sebzésszámok
 W.nums=W.nums.filter(n=>{n.t+=dt;n.y+=dt*1.6;const p=scr(n.x,n.y,n.z);if(!p||n.t>1){n.el.remove();return false}n.el.style.left=p[0]+'px';n.el.style.top=p[1]+'px';n.el.style.opacity=Math.min(1,(1-n.t)*2.5);return true});
 // pingek
 W.pings=W.pings.filter(p=>{p.t-=dt;if(p.k==='en'&&p.e.dead)p.t=0;if(p.t<=0){p.el.remove();return false}const x=p.e?p.e.x:p.x,z=p.e?p.e.z:p.z,y=p.e?enemyY(p.e)+2.2:1.5;const s=scr(x,y,z);if(!s){p.el.style.display='none';return true}
  p.el.style.display='block';p.el.style.left=Math.max(20,Math.min(innerWidth-20,s[0]))+'px';p.el.style.top=Math.max(30,Math.min(innerHeight-10,s[1]))+'px';p.el.lastChild.textContent=Math.round(Math.hypot(x-g.x,z-g.z))+' m';return true})});
// a csúszás közben a játék sebességét megtartjuk
WP('update',a=>{if(W&&W.slide>0&&G){G._spdB=1.9}else if(G&&G._spdB===1.9)G._spdB=1});

// ---------- 4) kill-cam + 9) összegző térkép + gyors újrakezdés ----------
WP('end',a=>{if(!W||!G||G.over)return;W.endPos=[G.x,G.z];W.win=!!a[0];
 if(!a[0]&&typeof cam!=='undefined'&&typeof ren!=='undefined'){try{let k=W.lastAtk&&!W.lastAtk.dead?W.lastAtk:null;if(!k){let bd=1e9;G.en.forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-G.x,e.z-G.z);if(d<bd){bd=d;k=e}})}
  if(k){const p0=cam.position.clone(),q0=cam.quaternion.clone(),f0=cam.fov;const dx=G.x-k.x,dz=G.z-k.z,L=Math.hypot(dx,dz)||1;cam.position.set(k.x-dx/L*3,enemyY(k)+2.2,k.z-dz/L*3);cam.fov=55;cam.updateProjectionMatrix();cam.lookAt(G.x,G.y+1.2,G.z);ren.render(scene,cam);
   const c=document.createElement('canvas');c.width=420;c.height=236;c.getContext('2d').drawImage(ren.domElement,0,0,c.width,c.height);W.kc={url:c.toDataURL('image/jpeg',.8),who:((typeof ET!=='undefined'&&ET[k.t]&&ET[k.t].e)||'')+' '+(k.t||'ellenfél'),dist:Math.round(L),hp:Math.max(0,Math.round(k.hp))};
   cam.position.copy(p0);cam.quaternion.copy(q0);cam.fov=f0;cam.updateProjectionMatrix()}}catch(e){console.error('killcam',e)}}},
 a=>{if(!W)return;if(a[0])stat('win');prompt.style.display='none';W.zip=null;W.drive=null;W.pings.forEach(p=>p.el.remove());W.pings=[];W.nums.forEach(n=>n.el.remove());W.nums=[];
  W.sumReady=true;injectSum()});function injectSum(){if(!W||!W.sumReady)return;const rb=$('rb'),res=$('res');if(!rb||!res||!res.classList.contains('on')||$('x10Map'))return;const box=document.createElement('div');box.style.cssText='margin-top:10px';let h='';
  if(W.kc)h+='<div style="color:#fca5a5;font:700 16px Rajdhani">🎥 KILL-CAM — kiejtett: <b>'+W.kc.who+'</b> · '+W.kc.dist+' m-ről · maradt élete: '+W.kc.hp+'</div><img id="x10Kc" src="'+W.kc.url+'" width="420" height="236">';
  h+='<div style="font:700 16px Rajdhani;color:#93c5fd;margin-top:6px">🗺️ A MECCSED: <span style="color:#fde68a">— útvonal</span> · <span style="color:#f87171">✖ kiesések</span> · '+(W.win?'🏆 győzelem':'💀 halál')+'</div><canvas id="x10Map" width="300" height="300"></canvas>'+
   '<button id="x10Qr" class="b" style="margin-top:8px;background:linear-gradient(135deg,#4ade80,#16a34a);color:#052e16">⚡ GYORS ÚJRAKEZDÉS [ENTER]</button>';
  box.innerHTML=h;rb.appendChild(box);drawMap($('x10Map'));const qb=$('x10Qr');if(qb)qb.onclick=quick}
setInterval(injectSum,400);
function drawMap(c){if(!c)return;const x=c.getContext('2d'),S_=300;let mnx,mxx,mnz,mxz;
 if(G.arh&&typeof HU!=='undefined'){mnx=Math.min(...HU.map(p=>p[0]));mxx=Math.max(...HU.map(p=>p[0]));mnz=Math.min(...HU.map(p=>p[1]));mxz=Math.max(...HU.map(p=>p[1]))}else{mnx=mnz=-62;mxx=mxz=62}
 const sc=(S_-20)/Math.max(mxx-mnx,mxz-mnz),P=(px,pz)=>[10+(px-mnx)*sc,10+(pz-mnz)*sc];
 x.fillStyle='#0c4a6e';x.fillRect(0,0,S_,S_);x.fillStyle='#3f6212';x.strokeStyle='#fde68a55';x.lineWidth=2;x.beginPath();
 if(G.arh&&typeof HU!=='undefined'){HU.forEach((p,i)=>{const[a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b)});x.closePath()}else{const[a,b]=P(0,0);x.arc(a,b,60*sc,0,7)}x.fill();x.stroke();
 if(W.cave){const[a,b]=P(W.cave.x,W.cave.z);x.font='16px serif';x.fillText('🕳️',a-8,b+6)}
 x.strokeStyle='#fde68a';x.lineWidth=2.5;x.beginPath();W.trail.forEach((p,i)=>{const[a,b]=P(p[0],p[1]);i?x.lineTo(a,b):x.moveTo(a,b)});x.stroke();
 if(W.trail[0]){const[a,b]=P(...W.trail[0]);x.fillStyle='#4ade80';x.beginPath();x.arc(a,b,5,0,7);x.fill()}
 x.strokeStyle='#f87171';x.lineWidth=2.5;W.kills.forEach(p=>{const[a,b]=P(p[0],p[1]);x.beginPath();x.moveTo(a-4,b-4);x.lineTo(a+4,b+4);x.moveTo(a+4,b-4);x.lineTo(a-4,b+4);x.stroke()});
 if(W.endPos){const[a,b]=P(...W.endPos);x.font='18px serif';x.fillText(W.win?'🏆':'💀',a-9,b+6)}}
function quick(){const r=$$('res');if(r)r.classList.remove('on');try{if(typeof GUI!=='undefined')GUI.on=false}catch(e){}
 try{if(typeof go==='function')go('menu')}catch(e){}setTimeout(()=>{const b=document.getElementById('lbGo');if(b)b.click();else launch()},250)}
window.x10quick=quick;
addEventListener('keydown',e=>{if(e.key==='Enter'&&!typing(e)){const r=$$('res');if(r&&r.classList.contains('on')&&$$('x10Qr')){e.preventDefault();quick()}}});
window._x10W=()=>W;console.log('extra10 betöltve');
})();
