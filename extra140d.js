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
// A közös LIM objektumot (extra10 _x10k.LIM) használjuk, hogy a két modul ne írja felül egymás mentését.
function LIMo(){const k=window._x10k;if(k&&k.LIM)return k.LIM;try{const l=JSON.parse(localStorage.getItem('k3x10lim'));if(l)return l}catch(e){}return{day:'',lost:0,lim:3000,free:''}}
function limSave(L){try{localStorage.setItem('k3x10lim',JSON.stringify(L))}catch(e){}}
function lim(){const L=LIMo();return typeof L.lim==='number'?L.lim:3000}
function limDay(){const L=LIMo();if(L.day!==today()){L.day=today();L.lost=0;limSave(L)}D.lost=L.lost;return L}
function limLeft(){const L=limDay();return L.lim>0?Math.max(0,L.lim-Math.max(0,L.lost)):Infinity}
function canBet(b){const L=limDay();if(typeof BR==='undefined'||!BR)return'Nincs zseton-rendszer';if(!(b>0))return'Érvénytelen tét';if(zs()<b)return'Nincs elég zseton!';
 if(L.lim>0&&L.lost+b>L.lim)return'⛔ Napi veszteséghatár ('+fmt(L.lim)+' zseton) elérve. Holnap folytathatod!';return''}
function bet(b){const L=limDay();BR.zs-=b;L.lost+=b;limSave(L);D.lost=L.lost;D.turn+=b;D.jp+=Math.ceil(b*0.05)+5;log(0,b);saveAll();jpBar();chipFx(b,false)}
function pay(w){if(w>0){try{window._k2&&_k2.earn&&_k2.earn('casino',0,w)}catch(e){}const L=limDay();BR.zs+=w;L.lost=Math.max(-1e9,L.lost-w);limSave(L);D.lost=L.lost;log(w,0);saveAll();chipFx(w,true)}}
function tryJP(chance){if(R()<chance){const w=Math.floor(D.jp/10);pay(w);D.jpWins++;D.jp=50000;save();toast('💎 JACKPOT! +'+fmt(w)+' zseton');jpBar();jpBoom(w);return w}return 0}
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
.x14dNote{opacity:.6;font-size:12px;margin:-4px 0 8px}
.x14dT button{font-family:Rajdhani,system-ui,sans-serif;font-size:14px;border-radius:20px!important;box-shadow:0 3px 0 #0b0614,inset 0 1px 0 #ffffff30}
.x14dT button.on{background:linear-gradient(#fde047,#f59e0b 60%,#b45309)!important;color:#3b1d00!important;box-shadow:0 3px 0 #78350f,0 0 12px #facc1566}
.x14dChip{position:fixed;z-index:80;width:22px;height:22px;border-radius:50%;pointer-events:none;border:3px dashed #fff;box-shadow:0 0 0 2px var(--c),0 3px 6px #000a;background:var(--c);transition:transform .7s cubic-bezier(.3,.7,.3,1),opacity .7s}
#x14dBoom{position:fixed;inset:0;z-index:90;pointer-events:none}
.x14dTick{overflow:hidden;white-space:nowrap;background:linear-gradient(#0b0614,#1a0d2b);border:1px solid #c9a64a77;border-radius:20px;padding:4px 0;margin-bottom:8px;font:700 13px Rajdhani,system-ui}
.x14dTick div{display:inline-block;padding-left:100%;animation:x14dTk 40s linear infinite}
@keyframes x14dTk{to{transform:translateX(-100%)}}
.x14dNews{font-size:12px;margin-top:8px;background:#ffffff08;border-radius:10px;padding:6px 9px;max-height:110px;overflow:auto}
.x14dNews div{padding:2px 0;border-bottom:1px solid #ffffff10}
.x14dLv{display:inline-block;width:9px;height:9px;border-radius:2px;margin-left:2px;background:#ffffff22}.x14dLv.on{background:#facc15;box-shadow:0 0 5px #facc15}
.x14dHub{background:linear-gradient(135deg,#3b0764,#a16207);color:#fde68a;border:1px solid #facc15;border-radius:12px;padding:8px 10px;font:700 12px system-ui;cursor:pointer;box-shadow:0 0 12px #facc1555}
`;document.head.appendChild(css);
const M=document.createElement('div');M.id='x14dM';M.innerHTML='<div id="x14dP"></div>';document.body.appendChild(M);
M.addEventListener('mousedown',e=>{if(e.target===M)close()});
const P=M.firstChild;
const jpEl=document.createElement('div');jpEl.id='x14dJP';document.body.appendChild(jpEl);
const toEl=document.createElement('div');toEl.id='x14dTo';document.body.appendChild(toEl);
let toT=0;function toast(s){toEl.textContent=s;toEl.style.display='block';clearTimeout(toT);toT=setTimeout(()=>toEl.style.display='none',2600)}
// zsetonfolyam: tétkor az egyenlegsávtól az asztalra, nyereménykor vissza
const CHC=['#2563eb','#16a34a','#dc2626','#9333ea','#ea580c','#ca8a04'];
function chipFx(n,win){try{if(!M.classList.contains('on'))return;const z=document.getElementById('x14dZs'),tb=P.querySelector('.x14dTb,#x14dHC,#x14dSU,canvas')||P;if(!z)return;
 const a=z.getBoundingClientRect(),b=tb.getBoundingClientRect(),cnt=Math.max(3,Math.min(14,Math.round(Math.log10(n+1)*4)));
 const from=win?[b.left+b.width/2,b.top+b.height/2]:[a.left+a.width/2,a.top+a.height/2],to=win?[a.left+a.width/2,a.top+a.height/2]:[b.left+b.width/2,b.top+b.height/2];
 for(let i=0;i<cnt;i++){const c=document.createElement('div');c.className='x14dChip';c.style.setProperty('--c',CHC[i%6]);c.style.left=(from[0]-11+(R()-.5)*40)+'px';c.style.top=(from[1]-11+(R()-.5)*20)+'px';document.body.appendChild(c);
  setTimeout(()=>{c.style.transform='translate('+(to[0]-from[0]+(R()-.5)*30)+'px,'+(to[1]-from[1]+(R()-.5)*16)+'px) rotate('+(R()*720)+'deg)';c.style.opacity='.15'},30+i*45);setTimeout(()=>c.remove(),900+i*45)}
 if(win){z.animate([{transform:'scale(1)'},{transform:'scale(1.35)',color:'#4ade80'},{transform:'scale(1)'}],{duration:700,delay:600})}}catch(e){}}
// jackpot-robbanás: teljes képernyős canvas, lökéshullám + érmeeső + felirat
function jpBoom(w){const cv=document.createElement('canvas');cv.id='x14dBoom';cv.width=innerWidth;cv.height=innerHeight;document.body.appendChild(cv);const x=cv.getContext('2d'),W=cv.width,H=cv.height,cx=W/2,cy=H/2;
 const ps=[];for(let i=0;i<260;i++){const a=R()*7,v=4+R()*14;ps.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-4,r:5+R()*7,s:R()*7,c:R()<.75?'#facc15':R()<.5?'#e879f9':'#a5f3fc'})}
 const t0=performance.now();(function fr(){const t=(performance.now()-t0)/1000;x.clearRect(0,0,W,H);
  if(t<0.25){x.fillStyle='rgba(255,250,200,'+(1-t*4)+')';x.fillRect(0,0,W,H)}
  for(let k=0;k<3;k++){const rr=(t-k*0.15)*900;if(rr>0){x.strokeStyle='rgba(250,204,21,'+Math.max(0,1-rr/900)+')';x.lineWidth=14-k*4;x.beginPath();x.arc(cx,cy,rr,0,7);x.stroke()}}
  for(let k=0;k<24;k++){const a=k/24*6.283+t;x.strokeStyle='rgba(253,224,71,'+Math.max(0,.5-t*.15)+')';x.lineWidth=6;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*W,cy+Math.sin(a)*W);x.stroke()}
  ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.35;p.vx*=0.99;p.s+=0.2;x.save();x.translate(p.x,p.y);x.scale(Math.abs(Math.cos(p.s)),1);x.fillStyle=p.c;x.beginPath();x.arc(0,0,p.r,0,7);x.fill();x.strokeStyle='#b45309';x.lineWidth=2;x.stroke();x.restore()});
  const sc=Math.min(1,t*3)*(1+Math.sin(t*10)*0.04);x.save();x.translate(cx,cy);x.scale(sc,sc);x.textAlign='center';x.font='bold 84px Impact,system-ui';x.lineWidth=10;x.strokeStyle='#7c2d12';x.strokeText('💎 JACKPOT!',0,0);x.fillStyle='#fde047';x.fillText('💎 JACKPOT!',0,0);
  x.font='bold 40px Impact,system-ui';x.strokeText('+'+fmt(w)+' zseton',0,60);x.fillStyle='#fff';x.fillText('+'+fmt(w)+' zseton',0,60);x.restore();
  if(t<3.2)requestAnimationFrame(fr);else cv.remove()})()}
function jpBar(){jpEl.textContent='💎 JACKPOT: '+fmt(D.jp)+' zseton';const v=document.getElementById('x14dJv');if(v)v.textContent=fmt(D.jp)}
let tab='bj',timers=[];
function clr(){timers.forEach(t=>{clearInterval(t);clearTimeout(t)});timers=[]}
const TABS=[['bj','🃏 Blackjack'],['dice','🎲 Kockapóker'],['scr','🪙 Kaparós'],['horse','🏇 Lóverseny'],['stock','📈 Tőzsde'],['coin','⛏️ KözCoin'],['prop','🏠 Ingatlan'],['vip','👑 VIP'],['fin','📊 Kimutatás'],['cp3','🌐 PIAC+ (online)']];
function open(t){if(t)tab=t;tickEco();M.classList.add('on');try{window.guiOpen&&guiOpen('')}catch(e){}render()}
function close(){clr();M.classList.remove('on');try{window.guiClose&&guiClose()}catch(e){}}
function head(){const v=VIP[vip()];const LL=limLeft();
 return '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px"><h2>🎰 KASZINÓ+ & GAZDASÁG</h2><button class="x14dB" onclick="_x14d.close()">✕ BEZÁR</button></div>'+
 '<div class="k3bal x14dBal"><span class="ft">💵 Ft: <b data-x14="ft">'+fmt(ft())+'</b></span><span>🪙 Zseton: <b data-x14="zs" id="x14dZs">'+fmt(zs())+'</b></span><span class="lim">⛔ ma még tehető: <b data-x14="lim">'+(LL===Infinity?'∞':fmt(LL))+'</b></span><span>👑 VIP: <b style="color:'+v[3]+'">'+v[0]+'</b></span><span>💎 Jackpot: <b id="x14dJv">'+fmt(D.jp)+'</b></span></div><div class="x14dNote">Csak játékbeli pénz. Valódi pénz semmilyen formában nincs benne.</div>'+
 '<div class="x14dT">'+TABS.map(([k,n])=>'<button class="'+(k===tab?'on':'')+'" onclick="_x14d.open(\''+k+'\')">'+n+'</button>').join('')+'</div>';}
function render(){clr();P.innerHTML=head()+'<div id="x14dC"></div>';const c=P.querySelector('#x14dC');if(tab==='cp3'){if(window._cp3)_cp3.render(c);else c.textContent='A PIAC+ modul (kaszinoplus3.js) nem töltődött be.';return}({bj,dice,scr,horse,stock,coin,prop,vipT,fin})[tab==='vip'?'vipT':tab](c)}
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
function bjH(){if(!B||B.done)return;B.p.push(B.dk.pop());if(val(B.p)>21)bjEnd('lose');else render()}
function bjD(){if(!B||B.done||B.p.length!==2)return;const e=canBet(B.b);if(e)return toast(e);bet(B.b);B.b*=2;B.p.push(B.dk.pop());if(val(B.p)>21)bjEnd('lose');else bjS()}
function bjS(){if(!B||B.done)return;B.done=true;B.msg='Osztó húz…';render();const step=()=>{if(val(B.d)<17){B.d.push(B.dk.pop());render();timers.push(setTimeout(step,550))}else{const p=val(B.p),d=val(B.d);bjEnd(d>21||p>d?'win':p===d?'push':'lose')}};timers.push(setTimeout(step,550))}
function bjEnd(r){if(B.paid)return;B.paid=true;B.done=true;let w=0;if(r==='bj')w=Math.floor(B.b*2.5);else if(r==='win')w=B.b*2;else if(r==='push')w=B.b;
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
function dR(){if(!DC||DC.left<=0)return;DC.left--;dRoll();if(DC.left<=0)dF();else render()}
function dF(){if(!DC||DC.fin)return;DC.fin=1;DC.left=0;const[n,m]=dRank(DC.v);let w=m?cash(DC.b*m):0;if(m>=30)tryJP(0.3);DC.msg=n+(w?' – +'+fmt(w)+' zseton':' – nincs nyeremény');render()}
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
// lóverseny-rajz: mozgó korlát, porfelhő, vágta-animáció, vezető kiemelése, célfotó-villanás
const HDUST=[];
function hDraw(pos,t,fin){const cv=document.getElementById('x14dHC');if(!cv)return;const x=cv.getContext('2d');t=t||0;
 const sky=x.createLinearGradient(0,0,0,30);sky.addColorStop(0,'#1e3a8a');sky.addColorStop(1,'#60a5fa');x.fillStyle=sky;x.fillRect(0,0,800,22);
 // lelátó (mozgó tömeg)
 for(let i=0;i<80;i++){x.fillStyle=['#f87171','#fde047','#93c5fd','#f9fafb','#a78bfa'][i%5];x.fillRect(((i*10-t*0.06)%800+800)%800,8+Math.sin(t*0.01+i)*2*(t?1:0),6,8)}
 for(let i=0;i<6;i++){x.fillStyle=i%2?'#15803d':'#166534';x.fillRect(0,22+i*45,800,45);
  x.fillStyle='#ffffff10';for(let s2=0;s2<8;s2++)x.fillRect(((s2*110-t*0.3)%880+880)%880-40,22+i*45,40,45)}
 // korlát
 x.fillStyle='#f8fafc';x.fillRect(0,20,800,3);x.fillRect(0,290,800,3);for(let k=0;k<20;k++){const fx=((k*44-t*0.3)%880+880)%880-40;x.fillRect(fx,14,3,9);x.fillRect(fx,286,3,10)}
 // cél (sakktábla) és rajt
 for(let k=0;k<27;k++){x.fillStyle=k%2?'#111':'#fff';x.fillRect(742,22+k*10,6,10);x.fillStyle=k%2?'#fff':'#111';x.fillRect(748,22+k*10,6,10)}x.fillStyle='#fff';x.fillRect(40,22,2,268);
 const lead=pos.indexOf(Math.max(...pos));
 HS.forEach((h,i)=>{const px=40+pos[i]*700,py=44+i*45,ph=t*0.045+i*1.7,run=t&&pos[i]<1,b=run?Math.abs(Math.sin(ph))*-5:0;
  if(run&&R()<0.5)HDUST.push({x:px-22,y:py+16,vx:-1-R()*2,vy:-R()*1.2,l:1});
  x.fillStyle='#0004';x.beginPath();x.ellipse(px,py+19,22,4,0,0,7);x.fill();
  // lábak (vágta)
  x.strokeStyle='#3f2a14';x.lineWidth=3;x.lineCap='round';const l1=run?Math.sin(ph*2)*9:0,l2=run?Math.sin(ph*2+Math.PI)*9:0;
  x.beginPath();x.moveTo(px-12,py+4+b);x.lineTo(px-14-l1,py+18);x.moveTo(px-7,py+4+b);x.lineTo(px-9-l2,py+18);x.moveTo(px+11,py+4+b);x.lineTo(px+13+l2,py+18);x.moveTo(px+15,py+4+b);x.lineTo(px+17+l1,py+18);x.stroke();
  // test, nyak, fej, farok
  x.fillStyle='#7c4a1e';x.beginPath();x.ellipse(px,py+b,21,10,0,0,7);x.fill();
  x.beginPath();x.moveTo(px+12,py-4+b);x.lineTo(px+22,py-16+b);x.lineTo(px+28,py-12+b);x.lineTo(px+18,py+2+b);x.fill();
  x.beginPath();x.ellipse(px+28,py-15+b,9,5,0.4,0,7);x.fill();
  x.strokeStyle='#2b1a0b';x.lineWidth=4;x.beginPath();x.moveTo(px-20,py-3+b);x.quadraticCurveTo(px-30,py-6+b+Math.sin(ph)*4,px-32,py+6+b);x.stroke();
  // zsoké színes mezben
  x.fillStyle=h[1];x.fillRect(px-4,py-20+b,10,12);x.beginPath();x.arc(px+1,py-24+b,5,0,7);x.fill();
  x.fillStyle='#fff';x.font='bold 11px system-ui';x.fillText((i+1)+'',px-3,py+4+b);
  if(t&&i===lead){x.fillStyle='#facc15';x.font='14px system-ui';x.fillText('👑',px-6,py-30+b)}});
 for(let k=HDUST.length-1;k>=0;k--){const d=HDUST[k];d.x+=d.vx;d.y+=d.vy;d.l-=0.04;if(d.l<=0){HDUST.splice(k,1);continue}x.fillStyle='rgba(214,190,140,'+(d.l*0.5)+')';x.beginPath();x.arc(d.x,d.y,3+(1-d.l)*6,0,7);x.fill()}
 if(fin){x.fillStyle='rgba(255,255,255,'+fin+')';x.fillRect(0,0,800,300)}}
function hGo(){if(HR)return;const b=gv('x14dhb'),e=canBet(b);if(e)return toast(e);const pick=+document.querySelector('input[name=x14dh]:checked').value;bet(b);
 const st=HS.map(h=>1/h[2]);const sum=st.reduce((a,b)=>a+b);let r=R()*sum,win=0;for(let i=0;i<6;i++){r-=st[i];if(r<=0){win=i;break}}
 const pos=HS.map(()=>0),sp=HS.map((h,i)=>i===win?1:0.86+R()*0.1);HR=1;document.getElementById('x14dHG').disabled=true;let t=0,lt=performance.now();
 let cd=3;
 const iv=setInterval(()=>{const nw=performance.now(),k=Math.min(10,(nw-lt)/16);lt=nw;if(cd>0){cd-=k*16/600;hDraw(pos,0);const cv=document.getElementById('x14dHC');if(cv){const x=cv.getContext('2d');x.fillStyle='#000a';x.fillRect(0,0,800,300);x.fillStyle='#fde047';x.font='bold 110px Impact,system-ui';x.textAlign='center';x.fillText(cd>0?Math.ceil(cd):'RAJT!',400,190);x.textAlign='left'}return}t+=16*k;let done=false;for(let i=0;i<6;i++){pos[i]=Math.min(1,pos[i]+0.0042*k*sp[i]*(0.6+R()*0.8));if(i===win&&pos[i]>=1)done=true}
  if(!done)for(let i=0;i<6;i++)if(i!==win)pos[i]=Math.min(0.985,pos[i]);
  hDraw(pos,t);if(done){clearInterval(iv);HR=null;let fl=1;const fv=setInterval(()=>{fl-=0.12;hDraw(pos,t,Math.max(0,fl));if(fl<=0)clearInterval(fv)},40);timers.push(fv);const m=document.getElementById('x14dHM');let w=0;if(pick===win)w=cash(Math.floor(b*HS[win][2]));if(win===5&&pick===5)tryJP(0.1);
   m.textContent='🏁 Győztes: '+HS[win][0]+(w?' – +'+fmt(w)+' zseton!':' – a tiéd most nem nyert.');document.getElementById('x14dHG').disabled=false}},16);timers.push(iv);
 timers.push({});}
// timers törléskor HR is reset
const _clr=clr;clr=function(){_clr();HR=null};

// 5) TŐZSDE (kitalált cégek, Ft)
const CO=[['PSZT','Pusztai Szél Energia',1200,0.03],['GULY','Gulyás Gépgyár',800,0.02],['DUNA','Dunakavics Logisztika',2500,0.025],['TOKJ','Tokaji Arany Borház',1800,0.04],['KZTR','Köztér Robotika',4000,0.06],['LANG','Lángos Lánc',350,0.05],['PAPU','Paprikás Űrtechnika',6000,0.08]];
// tőzsdei hírek (kitalált események): [kód, szöveg, hatás]
const NEWS=[['PSZT','Új szélpark épül a Hortobágy szélén',0.12],['PSZT','Szélcsend egész héten – esik a termelés',-0.10],['GULY','Rekordrendelés kondérokra külföldről',0.10],['GULY','Gyártósor-leállás: elfogyott a paprika',-0.09],
 ['DUNA','Alacsony vízállás, uszályok vesztegelnek',-0.12],['DUNA','Új konténerkikötő nyílt',0.11],['TOKJ','Aszús évjárat – kiváló a termés',0.14],['TOKJ','Jégeső verte el a dűlőket',-0.13],
 ['KZTR','Bemutatták a járőrrobot 2.0-t',0.16],['KZTR','A robotok összevesztek a galambokkal – visszahívás',-0.15],['LANG','Fokhagymás tejföl-forradalom: sorban állnak',0.15],['LANG','Drágult az olaj, drágul a lángos',-0.10],
 ['PAPU','Sikeres próbaindítás: a paprika eljutott a sztratoszféráig',0.22],['PAPU','A rakéta helyett a fűszer robbant',-0.20]];
function tickEco(){const now=Date.now();if(!D.lastTick)D.lastTick=now;
 CO.forEach(c=>{if(!D.hist[c[0]])D.hist[c[0]]=[c[2]];});
 let n=Math.min(200,Math.floor((now-D.lastTick)/30000));// 30 mp-enként egy ármozgás
 if(n>0){D.lastTick+=n*30000;while(n--)CO.forEach(c=>{const h=D.hist[c[0]];let p=h[h.length-1];p=Math.max(10,p*(1+(R()-0.49)*c[3]*2+(c[2]-p)/c[2]*0.01));h.push(Math.round(p));if(h.length>60)h.shift()});
  if(R()<0.05)newsEv()}
 // bánya
 if(!D.mineT)D.mineT=now;const mh=(now-D.mineT)/3600000;if(mh>0){D.coin+=D.miners*D.minerLv*2*Math.min(mh,24);D.mineT=now}
 // ingatlan bérleti díj naponta
 if(D.rentDay!==today()){const r=rentSum();if(D.rentDay&&r>0&&typeof S!=='undefined'){addFt(r);setTimeout(()=>toast('🏠 Bérleti díj: +'+fmt(r)+' Ft'),800)}D.rentDay=today()}
 save()}
function newsEv(){const n=NEWS[R()*NEWS.length|0],h=D.hist[n[0]];if(!h)return;const p=Math.max(10,Math.round(h[h.length-1]*(1+n[2])));h.push(p);if(h.length>60)h.shift();
 (D.news||(D.news=[])).unshift([new Date().toTimeString().slice(0,5),n[0],n[1],n[2]]);D.news.length=Math.min(D.news.length,8)}
const price=k=>{const h=D.hist[k];return h[h.length-1]};
function stock(c){let h='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
 CO.forEach(co=>{const k=co[0],p=price(k),hh=D.hist[k],ch=hh.length>1?(p/hh[0]-1)*100:0,own=D.stocks[k]||0;
  h+='<div style="background:#ffffff0a;border-radius:10px;padding:8px"><b>'+k+'</b> <span style="opacity:.7;font-size:12px">'+co[1]+'</span><div style="font-size:18px">'+fmt(p)+' Ft <span style="color:'+(ch>=0?'#4ade80':'#f87171')+';font-size:13px">'+(ch>=0?'▲':'▼')+ch.toFixed(1)+'%</span></div><canvas data-k="'+k+'" width="360" height="70" style="width:100%"></canvas><div style="font-size:12px">Birtokolt: '+own+' db</div>'+
  '<button class="x14dB" onclick="_x14d.sB(\''+k+'\',1)">Vesz 1</button> <button class="x14dB" onclick="_x14d.sB(\''+k+'\',10)">Vesz 10</button> <button class="x14dB" '+(own?'':'disabled')+' onclick="_x14d.sS(\''+k+'\',1)">Elad 1</button> <button class="x14dB" '+(own?'':'disabled')+' onclick="_x14d.sS(\''+k+'\','+own+')">Mind</button></div>'});
 const tk=CO.map(co=>{const hh=D.hist[co[0]],p=price(co[0]),q=hh.length>1?hh[hh.length-2]:p;return '<span style="margin:0 14px;color:'+(p>=q?'#4ade80':'#f87171')+'">'+co[0]+' '+fmt(p)+' '+(p>=q?'▲':'▼')+'</span>'}).join('')+(D.news||[]).slice(0,3).map(n=>'<span style="margin:0 14px;color:#fde68a">📰 '+n[1]+': '+n[2]+'</span>').join('');
 c.innerHTML='<div class="x14dTick"><div>'+tk+'</div></div><div style="opacity:.7;font-size:12px;margin-bottom:6px">Kitalált cégek, 30 mp-enként mozgó árfolyam (offline is), néha hírek mozgatják. Ft-ban kereskedsz. A pulzáló pont az élő (becsült) ár.</div>'+h+'</div>'+
  '<div class="x14dNews"><b>📰 Tőzsdei hírek</b>'+((D.news||[]).length?D.news.map(n=>'<div>'+n[0]+' · <b>'+n[1]+'</b> – '+n[2]+' <span style="color:'+(n[3]>0?'#4ade80':'#f87171')+'">'+(n[3]>0?'+':'')+Math.round(n[3]*100)+'%</span></div>').join(''):'<div style="opacity:.6">Még nincs hír. Nézz vissza később!</div>')+'</div>';
 // élő grafikon-animáció: a vonal kirajzolódik, az utolsó pont „lélegzik” és apró becsült ingadozást mutat
 const cvs=[...c.querySelectorAll('canvas[data-k]')],t0=performance.now(),jit={};
 const drawSt=()=>{const tt=performance.now()-t0,grow=Math.min(1,tt/900);cvs.forEach(cv=>{if(!cv.isConnected)return;const k=cv.dataset.k,d=D.hist[k],x=cv.getContext('2d');
  jit[k]=(jit[k]||0)*0.9+(R()-0.5)*0.004;const live=d[d.length-1]*(1+jit[k]);const all=d.concat([live]),mn=Math.min(...all),mx=Math.max(...all),rg=Math.max(1,mx-mn);
  x.clearRect(0,0,360,70);x.strokeStyle='#ffffff10';x.lineWidth=1;for(let g=1;g<4;g++){x.beginPath();x.moveTo(0,g*17.5);x.lineTo(360,g*17.5);x.stroke()}
  const up=live>=d[0],col=up?'#4ade80':'#f87171',n=all.length-1,lim=Math.max(1,Math.floor(n*grow));
  const pt=i=>[i/Math.max(1,n)*350,65-(all[i]-mn)/rg*58];
  const gr=x.createLinearGradient(0,0,0,70);gr.addColorStop(0,col+'55');gr.addColorStop(1,col+'00');
  x.beginPath();x.moveTo(0,70);for(let i=0;i<=lim;i++){const[a,b]=pt(i);x.lineTo(a,b)}x.lineTo(pt(lim)[0],70);x.closePath();x.fillStyle=gr;x.fill();
  x.beginPath();for(let i=0;i<=lim;i++){const[a,b]=pt(i);i?x.lineTo(a,b):x.moveTo(a,b)}x.strokeStyle=col;x.lineWidth=2;x.stroke();
  if(grow>=1){const[a,b]=pt(n),r=3+Math.abs(Math.sin(tt/300))*4;x.beginPath();x.arc(a,b,r,0,7);x.fillStyle=col+'66';x.fill();x.beginPath();x.arc(a,b,3,0,7);x.fillStyle='#fff';x.fill()}})};
 timers.push(setInterval(drawSt,60));drawSt();
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
// ingatlan-fejlesztés: szintenként +25% bérleti díj az adott típus minden egységére (max 3. szint)
const PLV=['Alap','Felújított','Okosotthon','Luxus'];
const plv=k=>((D.plv||(D.plv={}))[k]|0);
const rentOf=p=>Math.round(p[3]*(1+0.25*plv(p[0])));
const upCost=p=>Math.round(p[2]*0.3*(plv(p[0])+1));
const rentSum=()=>PR.reduce((s,p)=>s+(D.props[p[0]]||0)*rentOf(p),0);
function prop(c){c.innerHTML='<div style="opacity:.75;font-size:13px">Napi bérleti díj automatikusan jóváírva az első napi megnyitáskor. Összesen: <b style="color:#86efac">'+fmt(rentSum())+' Ft/nap</b></div>'+
 PR.map(p=>{const n=D.props[p[0]]||0,lv=plv(p[0]);return '<div class="x14dR"><div style="flex:1"><b>'+p[1]+'</b> <span style="font-size:11px;color:#fde68a">'+PLV[lv]+' '+[1,2,3].map(i=>'<span class="x14dLv'+(i<=lv?' on':'')+'"></span>').join('')+'</span><div style="font-size:12px;opacity:.7">Ár: '+fmt(p[2])+' Ft · bérleti díj: '+fmt(rentOf(p))+' Ft/nap · megtérülés: '+Math.round(p[2]/rentOf(p))+' nap</div></div><b>'+n+' db</b><button class="x14dB y" onclick="_x14d.pB(\''+p[0]+'\')">VESZ</button><button class="x14dB" '+(n&&lv<3?'':'disabled')+' title="+25% bérleti díj az összes ilyen ingatlanra" onclick="_x14d.pU(\''+p[0]+'\')">🔨 FEJLESZT'+(lv<3?' ('+fmt(upCost(p)*Math.max(1,n))+')':' MAX')+'</button><button class="x14dB" '+(n?'':'disabled')+' onclick="_x14d.pS(\''+p[0]+'\')">ELAD (80%)</button></div>'}).join('')+
 '<div class="x14dNote" style="margin-top:8px">🔨 Fejlesztés: Alap → Felújított → Okosotthon → Luxus, szintenként +25% bérleti díj. Ára darabszámmal arányos. Ha minden egységet eladsz, a szint elvész.</div>'}
function pU(k){const p=PR.find(x=>x[0]===k),n=D.props[k]||0;if(!n||plv(k)>=3)return;const c=upCost(p)*n;if(ft()<c)return toast('Nincs elég Ft!');addFt(-c);D.plv[k]=plv(k)+1;save();toast('🔨 '+p[1]+' → '+PLV[D.plv[k]]);render()}
function pB(k){const p=PR.find(x=>x[0]===k);if(ft()<p[2])return toast('Nincs elég Ft!');addFt(-p[2]);D.props[k]=(D.props[k]||0)+1;save();render()}
function pS(k){const p=PR.find(x=>x[0]===k);if(!D.props[k])return;D.props[k]--;if(!D.props[k]&&D.plv)D.plv[k]=0;addFt(Math.floor(p[2]*0.8));render()}

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
// saját egyenlegsáv-frissítés (a kaszino3 ft()-je a window.S-t nézi, ami itt let-változó)
setInterval(()=>{if(!M.classList.contains('on'))return;const LL=limLeft();P.querySelectorAll('[data-x14]').forEach(b=>{const k=b.dataset.x14,v=k==='ft'?fmt(ft()):k==='zs'?fmt(zs()):(LL===Infinity?'∞':fmt(LL));if(b.textContent!==v)b.textContent=v})},400);
addEventListener('keydown',e=>{if(e.code==='F6'){e.preventDefault();M.classList.contains('on')?close():(inLobby()&&open())}else if(e.code==='Escape'&&M.classList.contains('on'))close()},true);
setInterval(()=>{try{tickEco()}catch(e){}},30000);
jpBar();
window._x14d={open,close,bjN,bjH,bjS,bjD,dN,dR,dF,dK,sN,hGo,sB,sS,cM,cU,cS,pB,pS,pU,vC,jpBoom:w=>jpBoom(w||12345),chipFx:(n,w)=>chipFx(n||100,!!w),D,dbg:()=>({zs:zs(),ft:ft(),vip:VIP[vip()][0],jp:D.jp,lost:D.lost})};
})();
