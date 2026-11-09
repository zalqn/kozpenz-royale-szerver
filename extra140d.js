// extra140d.js – 🎰 KASZINÓ+ & GAZDASÁG (F6). Csak játékbeli pénz: zseton (BR.zs) és Ft (S.c).
// Blackjack, kockapóker, kaparós, lóverseny, részvénypiac, KözCoin bánya, ingatlanok, VIP, jackpot, kimutatás.
(function(){
'use strict';
const K='k3x14d';
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:Object.assign(Array.isArray(d)?[]:{},d,v)}catch(e){return d}};
const SVK=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
const D=LS(K,{turn:0,jp:50000,jpWins:0,lostDay:'',lost:0,stocks:{},hist:{},lastTick:0,miners:0,minerLv:1,coin:0,mineT:0,props:{},rentDay:'',fin:{},vipClaim:''});
const save=()=>SVK(K,D);
const saveAll=()=>{try{window.save&&window.save()}catch(e){}try{window.st&&BR&&st.s('k3br',BR)}catch(e){}save()};
const zs=()=>(typeof BR!=='undefined'&&BR)?BR.zs|0:0;
const ft=()=>(typeof S!=='undefined'&&S)?S.c|0:0;
const fmt=n=>Math.round(n).toLocaleString('hu-HU');
const R=Math.random;
// ---- pénzügyi napló ----
function log(inc,exp){const d=today();const f=D.fin[d]||(D.fin[d]={i:0,e:0});f.i+=inc||0;f.e+=exp||0;
 const ks=Object.keys(D.fin).sort();while(ks.length>30)delete D.fin[ks.shift()];}
function addFt(v){if(typeof S==='undefined')return;S.c=(S.c||0)+v;v>0?log(v,0):log(0,-v);saveAll()}
// ---- veszteséghatár (közös az extra10 kaszinóval: k3x10lim.lim) ----
function lim(){try{const l=JSON.parse(localStorage.getItem('k3x10lim'));return l&&typeof l.lim==='number'?l.lim:3000}catch(e){return 3000}}
function limDay(){if(D.lostDay!==today()){D.lostDay=today();D.lost=0;save()}}
function canBet(b){limDay();if(typeof BR==='undefined'||!BR)return'Nincs zseton-rendszer';if(!(b>0))return'Érvénytelen tét';if(zs()<b)return'Nincs elég zseton!';
 const L=lim();if(L>0&&D.lost+b>L)return'⛔ Napi veszteséghatár ('+fmt(L)+' zseton) elérve. Holnap folytathatod!';return''}
function bet(b){BR.zs-=b;D.lost+=b;D.turn+=b;D.jp+=Math.ceil(b*0.05)+5;log(0,b);saveAll();jpBar()}
function pay(w){if(w>0){BR.zs+=w;D.lost-=w;log(w,0);saveAll()}}
function tryJP(chance){if(R()<chance){const w=Math.floor(D.jp/10);BR.zs+=w;D.jpWins++;log(w,0);D.jp=50000;saveAll();toast('💎 JACKPOT! +'+fmt(w)+' zseton');jpBar();return w}return 0}
// ---- VIP ----
const VIP=[['Bronz',0,0,'#cd7f32'],['Ezüst',5000,0.02,'#c0c0c0'],['Arany',25000,0.04,'#facc15'],['Platina',100000,0.07,'#a5f3fc'],['Gyémánt',400000,0.10,'#e879f9']];
function vip(){let v=0;VIP.forEach((x,i)=>{if(D.turn>=x[1])v=i});return v}
function cash(w){if(w<=0)return 0;const b=Math.floor(w*VIP[vip()][2]);pay(w+b);return w+b}
// ---- UI ----
const css=document.createElement('style');css.textContent=`
#x14dM{position:fixed;inset:0;z-index:60;background:rgba(5,4,12,.78);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;font-family:system-ui,sans-serif}
#x14dM.on{display:flex}
#x14dP{width:min(860px,94vw);max-height:90vh;overflow:auto;background:linear-gradient(160deg,#1a1430,#0c0a18);border:1px solid #c9a64a;border-radius:18px;box-shadow:0 0 40px #c9a64a44;color:#f3ecd6;padding:18px}
#x14dP h2{margin:0 0 8px;color:#facc15;letter-spacing:1px}
.x14dT{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
.x14dT button,.x14dB{background:linear-gradient(#3a2f5c,#241c3d);color:#f3ecd6;border:1px solid #c9a64a88;border-radius:10px;padding:7px 11px;cursor:pointer;font-weight:600}
.x14dT button.on,.x14dB.y{background:linear-gradient(#f5d36a,#b8892a);color:#1a1200}
.x14dB:disabled{opacity:.4;cursor:default}
.x14dR{display:flex;align-items:center;gap:8px;padding:7px;border-bottom:1px solid #ffffff14}
.x14dTb{background:radial-gradient(#176b3a,#0b3a1f);border:6px solid #5a3a1a;border-radius:90px/60px;padding:16px;min-height:170px;text-align:center}
.x14dC{display:inline-block;width:52px;height:74px;margin:3px;border-radius:7px;background:#fff;color:#111;font:bold 20px serif;line-height:74px;box-shadow:0 3px 8px #0008;animation:x14dIn .35s ease-out}
.x14dC.r{color:#c81e1e}.x14dC.h{background:repeating-linear-gradient(45deg,#7b1d1d,#7b1d1d 5px,#4c1010 5px,#4c1010 10px);color:transparent}
@keyframes x14dIn{from{transform:translate(160px,-120px) rotate(40deg);opacity:0}to{transform:none;opacity:1}}
.x14dDi{display:inline-block;width:46px;height:46px;margin:4px;border-radius:9px;background:#f8f4e8;color:#111;font-size:32px;line-height:46px;cursor:pointer;border:3px solid transparent}
.x14dDi.k{border-color:#facc15}.x14dDi.roll{animation:x14dRl .4s}
@keyframes x14dRl{50%{transform:rotate(180deg) scale(.7)}}
#x14dJP{position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:9;background:linear-gradient(90deg,#3b0764,#7e22ce,#3b0764);border:1px solid #facc15;border-radius:20px;padding:3px 14px;color:#fde68a;font:700 13px system-ui;box-shadow:0 0 14px #a855f799;display:none;pointer-events:none}
#x14dTo{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);z-index:70;background:#1a1430;border:1px solid #facc15;border-radius:12px;padding:9px 16px;color:#fde68a;font:600 15px system-ui;display:none}
.x14dHub{background:linear-gradient(135deg,#3b0764,#a16207);color:#fde68a;border:1px solid #facc15;border-radius:12px;padding:8px 10px;font:700 12px system-ui;cursor:pointer;box-shadow:0 0 12px #facc1555}
`;document.head.appendChild(css);
const M=document.createElement('div');M.id='x14dM';M.innerHTML='<div id="x14dP"></div>';document.body.appendChild(M);
M.addEventListener('mousedown',e=>{if(e.target===M)close()});
const P=M.firstChild;
const jpEl=document.createElement('div');jpEl.id='x14dJP';document.body.appendChild(jpEl);
const toEl=document.createElement('div');toEl.id='x14dTo';document.body.appendChild(toEl);
let toT=0;function toast(s){toEl.textContent=s;toEl.style.display='block';clearTimeout(toT);toT=setTimeout(()=>toEl.style.display='none',2600)}
function jpBar(){jpEl.textContent='💎 JACKPOT: '+fmt(D.jp)+' zseton';}
let tab='bj',timers=[];
function clr(){timers.forEach(t=>{clearInterval(t);clearTimeout(t)});timers=[]}
const TABS=[['bj','🃏 Blackjack'],['dice','🎲 Kockapóker'],['scr','🪙 Kaparós'],['horse','🏇 Lóverseny'],['stock','📈 Tőzsde'],['coin','⛏️ KözCoin'],['prop','🏠 Ingatlan'],['vip','👑 VIP'],['fin','📊 Kimutatás']];
function open(t){if(t)tab=t;tickEco();M.classList.add('on');try{window.guiOpen&&guiOpen()}catch(e){}render()}
function close(){clr();M.classList.remove('on');try{window.guiClose&&guiClose()}catch(e){}}
function head(){const v=VIP[vip()];limDay();const L=lim();
 return '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px"><h2>🎰 KASZINÓ+ & GAZDASÁG</h2><button class="x14dB" onclick="_x14d.close()">✕ BEZÁR</button></div>'+
 '<div style="font-size:13px;margin-bottom:8px">Zseton: <b style="color:#facc15">'+fmt(zs())+'</b> · Ft: <b style="color:#86efac">'+fmt(ft())+'</b> · VIP: <b style="color:'+v[3]+'">'+v[0]+'</b> · Jackpot: <b>'+fmt(D.jp)+'</b> · ma még tehető: <b>'+(L>0?fmt(Math.max(0,L-D.lost)):'∞')+'</b><br><span style="opacity:.6">Csak játékbeli pénz. Valódi pénz semmilyen formában nincs benne.</span></div>'+
 '<div class="x14dT">'+TABS.map(([k,n])=>'<button class="'+(k===tab?'on':'')+'" onclick="_x14d.open(\''+k+'\')">'+n+'</button>').join('')+'</div>';}
function render(){clr();P.innerHTML=head()+'<div id="x14dC"></div>';const c=P.querySelector('#x14dC');({bj,dice,scr,horse,stock,coin,prop,vipT,fin})[tab==='vip'?'vipT':tab](c)}
function betSel(id,def){return 'Tét: <select id="'+id+'" class="x14dB">'+[10,25,50,100,250,500,1000].map(v=>'<option'+(v===def?' selected':'')+'>'+v+'</option>').join('')+'</select>'}
const gv=id=>+document.getElementById(id).value;

// 1) BLACKJACK
const SU=['♠','♥','♦','♣'],RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let B=null;
function deck(){const d=[];for(let n=0;n<6;n++)SU.forEach(s=>RK.forEach(r=>d.push({s,r})));for(let i=d.length-1;i>0;i--){const j=R()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}return d}
function val(h){let t=0,a=0;h.forEach(c=>{if(c.r==='A'){a++;t+=11}else t+=(['J','Q','K'].includes(c.r)?10:+c.r)});while(t>21&&a){t-=10;a--}return t}
const card=(c,hid)=>'<span class="x14dC'+(hid?' h':(c.s==='♥'||c.s==='♦'?' r':''))+'">'+(hid?'':c.r+c.s)+'</span>';
function bj(c){const live=B&&!B.done;
 c.innerHTML='<div class="x14dTb"><div>Osztó'+(B?' ('+(live?'?':val(B.d))+')':'')+'</div><div>'+(B?B.d.map((x,i)=>card(x,live&&i===1)).join(''):'')+'</div><div style="margin:8px;color:#fde68a;font-weight:700;min-height:20px">'+(B?B.msg:'Osztó 17-nél megáll · Blackjack 3:2')+'</div><div>'+(B?B.p.map(x=>card(x)).join(''):'')+'</div><div>Te'+(B?' ('+val(B.p)+')':'')+'</div></div>'+
 '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center">'+(live?'<button class="x14dB y" onclick="_x14d.bjH()">LAPOT</button><button class="x14dB y" onclick="_x14d.bjS()">MEGÁLLOK</button>'+(B.p.length===2&&zs()>=B.b?'<button class="x14dB" onclick="_x14d.bjD()">DUPLÁZ</button>':''):betSel('x14dbb',50)+' <button class="x14dB y" onclick="_x14d.bjN()">OSZTÁS</button>')+'</div>'}
function bjN(){const b=gv('x14dbb'),e=canBet(b);if(e)return toast(e);bet(b);const d=deck();B={b,dk:d,p:[d.pop(),d.pop()],d:[d.pop(),d.pop()],done:false,msg:''};
 if(val(B.p)===21){bjEnd(val(B.d)===21?'push':'bj')}else render()}
function bjH(){B.p.push(B.dk.pop());if(val(B.p)>21)bjEnd('lose');else render()}
function bjD(){const e=canBet(B.b);if(e)return toast(e);bet(B.b);B.b*=2;B.p.push(B.dk.pop());if(val(B.p)>21)bjEnd('lose');else bjS()}
function bjS(){B.done=true;B.msg='Osztó húz…';render();const step=()=>{if(val(B.d)<17){B.d.push(B.dk.pop());render();timers.push(setTimeout(step,550))}else{const p=val(B.p),d=val(B.d);bjEnd(d>21||p>d?'win':p===d?'push':'lose')}};timers.push(setTimeout(step,550))}
function bjEnd(r){B.done=true;let w=0;if(r==='bj')w=Math.floor(B.b*2.5);else if(r==='win')w=B.b*2;else if(r==='push')w=B.b;
 if(r==='push')pay(w);else w=cash(w);const j=r==='bj'?tryJP(0.02):0;
 B.msg={bj:'🂡 BLACKJACK! +'+fmt(w),win:'✅ Nyertél! +'+fmt(w),push:'🤝 Döntetlen – tét vissza',lose:'❌ Vesztettél'}[r]+(j?' · 💎 JACKPOT!':'');render()}

// 2) KOCKAPÓKER (5 kocka, 2 újradobás, tartás kattintással)
const PIP=['','⚀','⚁','⚂','⚃','⚄','⚅'];let DC=null;
function dRank(v){const c={};v.forEach(x=>c[x]=(c[x]||0)+1);const n=Object.values(c).sort((a,b)=>b-a),s=v.slice().sort().join('');
 if(n[0]===5)return['Nagypóker',30];if(n[0]===4)return['Póker',10];if(n[0]===3&&n[1]===2)return['Full',6];if(s==='12345'||s==='23456')return['Sor',5];if(n[0]===3)return['Drill',3];if(n[0]===2&&n[1]===2)return['Két pár',2];if(n[0]===2)return['Pár',0];return['Semmi',0]}
function dice(c){c.innerHTML='<div class="x14dTb"><div style="opacity:.8">Nagypóker 30× · Póker 10× · Full 6× · Sor 5× · Drill 3× · Két pár 2×</div><div style="margin:18px 0">'+(DC?DC.v.map((x,i)=>'<span class="x14dDi'+(DC.k[i]?' k':'')+(DC.an&&!DC.k[i]?' roll':'')+'" onclick="_x14d.dK('+i+')">'+PIP[x]+'</span>').join(''):'🎲🎲🎲🎲🎲')+'</div><div style="color:#fde68a;font-weight:700">'+(DC?DC.msg:'Kattints a kockára a tartáshoz')+'</div></div><div style="margin-top:10px">'+
 (DC&&DC.left>0?'<button class="x14dB y" onclick="_x14d.dR()">ÚJRADOBÁS ('+DC.left+')</button> <button class="x14dB" onclick="_x14d.dF()">KÉSZ</button>':betSel('x14ddb',50)+' <button class="x14dB y" onclick="_x14d.dN()">DOBÁS</button>')+'</div>';if(DC)DC.an=false}
function dRoll(){DC.v=DC.v.map((x,i)=>DC.k[i]?x:1+(R()*6|0));DC.an=true;DC.msg=dRank(DC.v)[0]}
function dN(){const b=gv('x14ddb'),e=canBet(b);if(e)return toast(e);bet(b);DC={b,v:[1,1,1,1,1],k:[0,0,0,0,0],left:2};dRoll();render()}
function dR(){DC.left--;dRoll();if(DC.left<=0)dF();else render()}
function dF(){DC.left=0;const[n,m]=dRank(DC.v);let w=m?cash(DC.b*m):0;if(m>=30)tryJP(0.3);DC.msg=n+(w?' – +'+fmt(w)+' zseton':' – nincs nyeremény');render()}
function dK(i){if(DC&&DC.left>0){DC.k[i]=!DC.k[i];render()}}

// 3) KAPARÓS (canvas kaparás)
function scr(c){c.innerHTML='<div style="text-align:center"><div>Szerencse-sorsjegy · 100 zseton · 3 azonos szimbólum = nyeremény</div><div style="position:relative;display:inline-block;margin:12px"><div id="x14dSU" style="width:320px;height:200px;display:grid;grid-template-columns:repeat(3,1fr);background:linear-gradient(#fef3c7,#fde68a);border-radius:12px;font-size:44px;align-items:center;color:#111"></div><canvas id="x14dSC" width="320" height="200" style="position:absolute;left:0;top:0;border-radius:12px;touch-action:none;cursor:crosshair"></canvas></div><div id="x14dSM" style="color:#fde68a;font-weight:700;min-height:22px"></div><button class="x14dB y" onclick="_x14d.sN()">ÚJ SORSJEGY (100)</button></div>'}
const SY=[['🍒',2],['🔔',5],['⭐',10],['💎',50],['🍋',1],['🍀',3]];
function sN(){const e=canBet(100);if(e)return toast(e);bet(100);
 let g=[];const r=R();let win=null;if(r<0.32){win=SY[[4,0,5,1,2,3][Math.min(5,Math.floor(Math.pow(R(),2.2)*6))]];}
 const pool=SY.filter(s=>s!==win);for(let i=0;i<9;i++)g.push(pool[R()*pool.length|0]);
 // max 2 egyforma vesztes szimbólum
 const cnt={};g=g.map(s=>{cnt[s[0]]=(cnt[s[0]]||0)+1;if(cnt[s[0]]>2){const alt=pool.find(p=>(cnt[p[0]]||0)<2);cnt[s[0]]--;cnt[alt[0]]=(cnt[alt[0]]||0)+1;return alt}return s});
 if(win){const pos=[0,1,2,3,4,5,6,7,8].sort(()=>R()-.5).slice(0,3);pos.forEach(p=>g[p]=win)}
 document.getElementById('x14dSU').innerHTML=g.map(s=>'<div>'+s[0]+'</div>').join('');
 const cv=document.getElementById('x14dSC'),x=cv.getContext('2d');x.globalCompositeOperation='source-over';
 const gr=x.createLinearGradient(0,0,320,200);gr.addColorStop(0,'#9ca3af');gr.addColorStop(.5,'#e5e7eb');gr.addColorStop(1,'#6b7280');x.fillStyle=gr;x.fillRect(0,0,320,200);
 x.fillStyle='#374151';x.font='bold 22px system-ui';x.textAlign='center';x.fillText('KAPARD LE!',160,108);x.globalCompositeOperation='destination-out';
 let down=false,paid=false;const m=document.getElementById('x14dSM');m.textContent='';
 const chk=()=>{if(paid)return;const d=x.getImageData(0,0,320,200).data;let t=0;for(let i=3;i<d.length;i+=64)if(d[i]<50)t++;if(t/(d.length/64)>0.6){paid=true;x.clearRect(0,0,320,200);
  if(win){const w=cash(100*win[1]);if(win[0]==='💎')tryJP(0.25);m.textContent='🎉 3× '+win[0]+' – +'+fmt(w)+' zseton!'}else m.textContent='Most nem nyert. Legközelebb!';P.querySelector('h2').nextSibling;}};
 const sc=e=>{if(!down)return;const r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;x.beginPath();x.arc((p.clientX-r.left)*320/r.width,(p.clientY-r.top)*200/r.height,16,0,7);x.fill();e.preventDefault()};
 cv.onmousedown=cv.ontouchstart=e=>{down=true;sc(e)};cv.onmousemove=cv.ontouchmove=sc;cv.onmouseup=cv.ontouchend=cv.onmouseleave=()=>{down=false;chk()};}

// 4) LÓVERSENY
const HS=[['Villám Vendel','#ef4444',2.5],['Paprika','#f97316',3],['Délibáb','#eab308',4],['Puszta Szele','#22c55e',5],['Szürke Ködös','#3b82f6',7],['Csillagszóró','#a855f7',10]];
let HR=null;
function horse(c){c.innerHTML='<canvas id="x14dHC" width="800" height="300" style="width:100%;background:#14532d;border-radius:12px"></canvas><div style="margin-top:8px">'+HS.map((h,i)=>'<label class="x14dB" style="display:inline-block;margin:2px"><input type="radio" name="x14dh" value="'+i+'"'+(i===0?' checked':'')+'> <b style="color:'+h[1]+'">■</b> '+h[0]+' ('+h[2]+'×)</label>').join('')+'</div><div style="margin-top:8px">'+betSel('x14dhb',50)+' <button class="x14dB y" id="x14dHG" onclick="_x14d.hGo()">RAJT!</button> <span id="x14dHM" style="color:#fde68a;font-weight:700"></span></div>';hDraw(HS.map(()=>0))}
function hDraw(pos,t){const cv=document.getElementById('x14dHC');if(!cv)return;const x=cv.getContext('2d');x.fillStyle='#166534';x.fillRect(0,0,800,300);
 for(let i=0;i<6;i++){x.fillStyle=i%2?'#15803d':'#166534';x.fillRect(0,20+i*45,800,45)}x.fillStyle='#fff';x.fillRect(740,20,6,270);x.fillRect(40,20,2,270);
 HS.forEach((h,i)=>{const px=40+pos[i]*700,py=42+i*45,b=Math.sin((t||0)*0.02+i)*3;x.fillStyle=h[1];x.beginPath();x.ellipse(px,py+b,20,9,0,0,7);x.fill();x.fillRect(px+12,py-12+b,7,14);x.beginPath();x.ellipse(px+22,py-12+b,8,5,0.3,0,7);x.fill();
  x.strokeStyle=h[1];x.lineWidth=3;const l=Math.sin((t||0)*0.05+i)*6;x.beginPath();x.moveTo(px-12,py+b);x.lineTo(px-12-l,py+18);x.moveTo(px+12,py+b);x.lineTo(px+12+l,py+18);x.stroke();
  x.fillStyle='#fff';x.font='bold 12px system-ui';x.fillText((i+1)+'',px-4,py+4+b)})}
function hGo(){if(HR)return;const b=gv('x14dhb'),e=canBet(b);if(e)return toast(e);const pick=+document.querySelector('input[name=x14dh]:checked').value;bet(b);
 const st=HS.map(h=>1/h[2]);const sum=st.reduce((a,b)=>a+b);let r=R()*sum,win=0;for(let i=0;i<6;i++){r-=st[i];if(r<=0){win=i;break}}
 const pos=HS.map(()=>0),sp=HS.map((h,i)=>i===win?1:0.86+R()*0.1);HR=1;document.getElementById('x14dHG').disabled=true;let t=0,lt=performance.now();
 const iv=setInterval(()=>{const nw=performance.now(),k=Math.min(10,(nw-lt)/16);lt=nw;t+=16*k;let done=false;for(let i=0;i<6;i++){pos[i]=Math.min(1,pos[i]+0.0042*k*sp[i]*(0.6+R()*0.8));if(i===win&&pos[i]>=1)done=true}
  if(!done)for(let i=0;i<6;i++)if(i!==win)pos[i]=Math.min(0.985,pos[i]);
  hDraw(pos,t);if(done){clearInterval(iv);HR=null;const m=document.getElementById('x14dHM');let w=0;if(pick===win)w=cash(Math.floor(b*HS[win][2]));if(win===5&&pick===5)tryJP(0.1);
   m.textContent='🏁 Győztes: '+HS[win][0]+(w?' – +'+fmt(w)+' zseton!':' – a tiéd most nem nyert.');document.getElementById('x14dHG').disabled=false}},16);timers.push(iv);
 timers.push({});}
// timers törléskor HR is reset
const _clr=clr;clr=function(){_clr();HR=null};

// 5) TŐZSDE (kitalált cégek, Ft)
const CO=[['PSZT','Pusztai Szél Energia',1200,0.03],['GULY','Gulyás Gépgyár',800,0.02],['DUNA','Dunakavics Logisztika',2500,0.025],['TOKJ','Tokaji Arany Borház',1800,0.04],['KZTR','Köztér Robotika',4000,0.06],['LANG','Lángos Lánc',350,0.05]];
function tickEco(){const now=Date.now();if(!D.lastTick)D.lastTick=now;
 CO.forEach(c=>{if(!D.hist[c[0]])D.hist[c[0]]=[c[2]];});
 let n=Math.min(200,Math.floor((now-D.lastTick)/30000));// 30 mp-enként egy ármozgás
 if(n>0){D.lastTick+=n*30000;while(n--)CO.forEach(c=>{const h=D.hist[c[0]];let p=h[h.length-1];p=Math.max(10,p*(1+(R()-0.49)*c[3]*2+(c[2]-p)/c[2]*0.01));h.push(Math.round(p));if(h.length>60)h.shift()})}
 // bánya
 if(!D.mineT)D.mineT=now;const mh=(now-D.mineT)/3600000;if(mh>0){D.coin+=D.miners*D.minerLv*2*Math.min(mh,24);D.mineT=now}
 // ingatlan bérleti díj naponta
 if(D.rentDay!==today()){const r=rentSum();if(D.rentDay&&r>0&&typeof S!=='undefined'){addFt(r);setTimeout(()=>toast('🏠 Bérleti díj: +'+fmt(r)+' Ft'),800)}D.rentDay=today()}
 save()}
const price=k=>{const h=D.hist[k];return h[h.length-1]};
function stock(c){let h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 CO.forEach(co=>{const k=co[0],p=price(k),hh=D.hist[k],ch=hh.length>1?(p/hh[0]-1)*100:0,own=D.stocks[k]||0;
  h+='<div style="background:#ffffff0a;border-radius:10px;padding:8px"><b>'+k+'</b> <span style="opacity:.7;font-size:12px">'+co[1]+'</span><div style="font-size:18px">'+fmt(p)+' Ft <span style="color:'+(ch>=0?'#4ade80':'#f87171')+';font-size:13px">'+(ch>=0?'▲':'▼')+ch.toFixed(1)+'%</span></div><canvas data-k="'+k+'" width="360" height="70" style="width:100%"></canvas><div style="font-size:12px">Birtokolt: '+own+' db</div>'+
  '<button class="x14dB" onclick="_x14d.sB(\''+k+'\',1)">Vesz 1</button> <button class="x14dB" onclick="_x14d.sB(\''+k+'\',10)">Vesz 10</button> <button class="x14dB" '+(own?'':'disabled')+' onclick="_x14d.sS(\''+k+'\',1)">Elad 1</button> <button class="x14dB" '+(own?'':'disabled')+' onclick="_x14d.sS(\''+k+'\','+own+')">Mind</button></div>'});
 c.innerHTML='<div style="opacity:.7;font-size:12px;margin-bottom:6px">Kitalált cégek, 30 mp-enként mozgó árfolyam (offline is). Ft-ban kereskedsz.</div>'+h+'</div>';
 c.querySelectorAll('canvas[data-k]').forEach(cv=>{const d=D.hist[cv.dataset.k],x=cv.getContext('2d'),mn=Math.min(...d),mx=Math.max(...d)||1;x.strokeStyle=d[d.length-1]>=d[0]?'#4ade80':'#f87171';x.lineWidth=2;x.beginPath();
  d.forEach((v,i)=>{const px=i/(Math.max(1,d.length-1))*360,py=65-(v-mn)/Math.max(1,mx-mn)*60;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()});
 timers.push(setInterval(()=>{const l=D.lastTick;tickEco();if(D.lastTick!==l)render()},5000))}
function sB(k,n){const c=price(k)*n;if(ft()<c)return toast('Nincs elég Ft!');addFt(-c);D.stocks[k]=(D.stocks[k]||0)+n;save();render()}
function sS(k,n){n=Math.min(n,D.stocks[k]||0);if(!n)return;addFt(price(k)*n);D.stocks[k]-=n;save();render()}

// 6) KÖZCOIN BÁNYA
const COINP=()=>Math.round(400+Math.sin(Date.now()/3.6e6)*120);// óránként hullámzó árfolyam (Ft/KC)
function coin(c){const rate=D.miners*D.minerLv*2,mc=Math.round(20000*Math.pow(1.35,D.miners)),uc=Math.round(50000*Math.pow(2,D.minerLv-1));
 c.innerHTML='<div class="x14dTb" style="border-radius:16px"><div style="font-size:42px">⛏️💠</div><div style="font-size:24px;color:#a5f3fc;font-weight:800" id="x14dKC">'+D.coin.toFixed(3)+' KC</div><div>Bányagépek: <b>'+D.miners+'</b> · szint: <b>'+D.minerLv+'</b> · '+rate+' KC/óra (offline max 24 óra)</div><div>Árfolyam: <b>'+COINP()+' Ft/KC</b> · érték: <b>'+fmt(D.coin*COINP())+' Ft</b></div><div style="opacity:.6;font-size:12px">A KözCoin teljesen kitalált játékbeli egység, csak játék-Ft-ra váltható.</div></div>'+
 '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><button class="x14dB y" onclick="_x14d.cM()">+1 gép ('+fmt(mc)+' Ft)</button><button class="x14dB" '+(D.miners?'':'disabled')+' onclick="_x14d.cU()">Szintlépés ('+fmt(uc)+' Ft)</button><button class="x14dB" '+(D.coin>=0.01?'':'disabled')+' onclick="_x14d.cS()">KC eladása</button></div>';
 timers.push(setInterval(()=>{tickEco();const e=document.getElementById('x14dKC');if(e)e.textContent=D.coin.toFixed(3)+' KC'},1000))}
function cM(){const p=Math.round(20000*Math.pow(1.35,D.miners));if(D.miners>=20)return toast('Max 20 gép');if(ft()<p)return toast('Nincs elég Ft!');tickEco();addFt(-p);D.miners++;save();render()}
function cU(){const p=Math.round(50000*Math.pow(2,D.minerLv-1));if(D.minerLv>=8)return toast('Max szint');if(ft()<p)return toast('Nincs elég Ft!');tickEco();addFt(-p);D.minerLv++;save();render()}
function cS(){tickEco();const v=Math.floor(D.coin*COINP());D.coin=0;addFt(v);toast('💠 +'+fmt(v)+' Ft');render()}

// 7) INGATLANOK
const PR=[['gars','🏢 Garzon (Kőbánya)',300000,6000],['lak','🏠 Panellakás (Újpest)',800000,17000],['uzl','🏪 Sarki üzlet',1500000,34000],['iroda','🏬 Irodaszint',4000000,95000],['villa','🏰 Balatoni villa',10000000,250000],['pl','🏗️ Bevásárlóközpont',30000000,800000]];
const rentSum=()=>PR.reduce((s,p)=>s+(D.props[p[0]]||0)*p[3],0);
function prop(c){c.innerHTML='<div style="opacity:.75;font-size:13px">Napi bérleti díj automatikusan jóváírva az első napi megnyitáskor. Összesen: <b style="color:#86efac">'+fmt(rentSum())+' Ft/nap</b></div>'+
 PR.map(p=>{const n=D.props[p[0]]||0;return '<div class="x14dR"><div style="flex:1"><b>'+p[1]+'</b><div style="font-size:12px;opacity:.7">Ár: '+fmt(p[2])+' Ft · bérleti díj: '+fmt(p[3])+' Ft/nap · megtérülés: '+Math.round(p[2]/p[3])+' nap</div></div><b>'+n+' db</b><button class="x14dB y" onclick="_x14d.pB(\''+p[0]+'\')">VESZ</button><button class="x14dB" '+(n?'':'disabled')+' onclick="_x14d.pS(\''+p[0]+'\')">ELAD (80%)</button></div>'}).join('')}
function pB(k){const p=PR.find(x=>x[0]===k);if(ft()<p[2])return toast('Nincs elég Ft!');addFt(-p[2]);D.props[k]=(D.props[k]||0)+1;save();render()}
function pS(k){const p=PR.find(x=>x[0]===k);if(!D.props[k])return;D.props[k]--;addFt(Math.floor(p[2]*0.8));render()}

// 8) VIP
function vipT(c){const v=vip(),nx=VIP[v+1];
 c.innerHTML=VIP.map((x,i)=>'<div class="x14dR" style="opacity:'+(i<=v?1:.5)+'"><b style="color:'+x[3]+';width:90px">'+(i===v?'▶ ':'')+x[0]+'</b><div style="flex:1;font-size:13px">Forgalom: '+fmt(x[1])+' zseton · nyereménybónusz +'+(x[2]*100)+'% · napi ajándék '+fmt(i*150)+' zseton</div></div>').join('')+
 '<div style="margin-top:10px">Forgalmad: <b>'+fmt(D.turn)+'</b> zseton'+(nx?' · következő ('+nx[0]+'): még '+fmt(nx[1]-D.turn):' · MAX szint!')+'</div><div style="height:10px;background:#ffffff14;border-radius:5px;margin:6px 0"><div style="height:100%;border-radius:5px;background:linear-gradient(90deg,#a16207,#facc15);width:'+(nx?Math.min(100,(D.turn-VIP[v][1])/(nx[1]-VIP[v][1])*100):100)+'%"></div></div>'+
 '<button class="x14dB y" '+(v&&D.vipClaim!==today()?'':'disabled')+' onclick="_x14d.vC()">🎁 Napi VIP ajándék</button> <span style="opacity:.6;font-size:12px">Jackpot nyeremények eddig: '+D.jpWins+'</span>'}
function vC(){const v=vip();if(!v||D.vipClaim===today())return;D.vipClaim=today();BR.zs+=v*150;log(v*150,0);saveAll();toast('👑 +'+v*150+' zseton');render()}

// 10) KIMUTATÁS
function fin(c){const days=[];for(let i=13;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);days.push([d,D.fin[d]||{i:0,e:0}])}
 const ti=days.reduce((s,d)=>s+d[1].i,0),te=days.reduce((s,d)=>s+d[1].e,0);
 const assets=CO.reduce((s,co)=>s+(D.stocks[co[0]]||0)*price(co[0]),0)+D.coin*COINP()+PR.reduce((s,p)=>s+(D.props[p[0]]||0)*p[2]*0.8,0);
 c.innerHTML='<div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:6px"><div>14 nap bevétel: <b style="color:#4ade80">'+fmt(ti)+'</b></div><div>kiadás: <b style="color:#f87171">'+fmt(te)+'</b></div><div>egyenleg: <b style="color:'+(ti-te>=0?'#4ade80':'#f87171')+'">'+fmt(ti-te)+'</b></div><div>vagyon (részvény+KC+ingatlan): <b>'+fmt(assets)+' Ft</b></div></div><canvas id="x14dFC" width="800" height="260" style="width:100%;background:#0006;border-radius:12px"></canvas><div style="opacity:.6;font-size:12px">Zseton és Ft vegyesen (játékbeli egységek) · zöld = bevétel, piros = kiadás</div>';
 const x=document.getElementById('x14dFC').getContext('2d'),mx=Math.max(1,...days.map(d=>Math.max(d[1].i,d[1].e)));x.font='11px system-ui';
 days.forEach(([d,f],i)=>{const bx=40+i*54;x.fillStyle='#4ade80';const hi=f.i/mx*200;x.fillRect(bx,230-hi,20,hi);x.fillStyle='#f87171';const he=f.e/mx*200;x.fillRect(bx+22,230-he,20,he);x.fillStyle='#ddd';x.fillText(d.slice(5),bx+2,248)});
 x.strokeStyle='#fff4';x.beginPath();x.moveTo(30,230);x.lineTo(790,230);x.stroke();x.fillStyle='#ddd';x.fillText(fmt(mx),2,30)}

// ---- hub gomb + F6 ----
const inLobby=()=>{const l=document.getElementById('lb');return !!(l&&l.classList.contains('on'))&&!(window.G&&G.on)};
let btn;function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!btn){btn=document.createElement('button');btn.className='x14dHub';btn.textContent='🎰 KASZINÓ+';btn.title='Kaszinó+ & gazdaság (F6)';btn.onclick=()=>open();h.appendChild(btn)}
 const lb=inLobby();btn.style.display=lb?'':'none';jpEl.style.display=lb||M.classList.contains('on')?'block':'none'}
setInterval(()=>{try{hub()}catch(e){}},700);
addEventListener('keydown',e=>{if(e.code==='F6'){e.preventDefault();M.classList.contains('on')?close():(inLobby()&&open())}else if(e.code==='Escape'&&M.classList.contains('on'))close()},true);
setInterval(()=>{try{tickEco()}catch(e){}},30000);
jpBar();
window._x14d={open,close,bjN,bjH,bjS,bjD,dN,dR,dF,dK,sN,hGo,sB,sS,cM,cU,cS,pB,pS,vC,D,dbg:()=>({zs:zs(),ft:ft(),vip:VIP[vip()][0],jp:D.jp,lost:D.lost})};
})();
