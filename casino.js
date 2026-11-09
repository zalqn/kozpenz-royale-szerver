// ===== KASZINÓ: RULETT + BLACKJACK (csak játékbeli zsetonnal) =====
(function(){
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const B=()=>window.BR,saveB=()=>{try{st.s('k3br',window.BR)}catch(e){}};
const fmtZ=n=>Math.round(n).toLocaleString('hu-HU')+' 🪙';
const css=document.createElement('style');css.textContent=`
#csn{position:fixed;inset:0;z-index:11;display:none;font-family:Rajdhani,Arial;color:#fff;background:radial-gradient(1200px 700px at 50% 0%,#3a1d0e 0%,#120a06 55%,#060403 100%)}
#csn.on{display:flex;flex-direction:column}
#csnTop{display:flex;align-items:center;gap:10px;padding:12px 18px;background:linear-gradient(#000a,#0000)}
#csnTop .t{font:30px 'Luckiest Guy',Impact;background:linear-gradient(180deg,#fff2c2,#e8b04a 50%,#9a5a12);-webkit-background-clip:text;background-clip:text;color:transparent;margin-right:12px}
#csnTop button.tab{border:0;border-radius:10px;padding:8px 18px;font:20px 'Luckiest Guy',Impact;background:#ffffff14;color:#f5e6c8;cursor:pointer}#csnTop button.tab.on{background:#e8b04a;color:#2a1405}
#csnBal{margin-left:auto;font:24px 'Luckiest Guy',Impact;color:#ffd23f;background:#0008;padding:6px 14px;border-radius:12px;border:1px solid #e8b04a55}
#csnX{border:0;border-radius:10px;width:44px;height:44px;background:#ef4444;color:#fff;font-size:22px;cursor:pointer}
#csnBody{flex:1;display:flex;align-items:center;justify-content:center;gap:28px;padding:10px 20px;overflow:auto}
.chips{display:flex;gap:10px;justify-content:center;margin:10px 0}
.chip{width:56px;height:56px;border-radius:50%;border:5px dashed #fff;display:flex;align-items:center;justify-content:center;font:16px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 4px 0 #0008,inset 0 0 0 4px #0003;transition:.12s}
.chip.on{transform:translateY(-6px) scale(1.08);box-shadow:0 0 0 3px #ffd23f,0 10px 20px #000a}
.cbtn{border:0;border-radius:12px;padding:12px 22px;font:22px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 5px 0 #0008;margin:4px}
.cbtn:disabled{filter:grayscale(1) brightness(.6);cursor:default}
#rBoard{display:grid;grid-template-columns:52px repeat(12,46px) 52px;grid-template-rows:repeat(3,46px) 40px 40px;gap:3px;background:#0b5d3a;padding:10px;border-radius:14px;border:6px solid #6b3f12;box-shadow:inset 0 0 40px #0008,0 20px 50px #000a}
#rBoard div{display:flex;align-items:center;justify-content:center;font:20px 'Luckiest Guy',Impact;border:1px solid #ffffff55;border-radius:4px;cursor:pointer;position:relative;user-select:none;text-shadow:0 2px 0 #000}
#rBoard div:hover{outline:2px solid #ffd23f;z-index:2}
#rBoard .r{background:#b3121f}#rBoard .k{background:#141414}#rBoard .z{background:#0f8a4c}#rBoard .o{background:#0b5d3a;font-size:15px}
#rBoard i{position:absolute;right:-6px;top:-6px;min-width:24px;height:24px;border-radius:50%;background:#ffd23f;color:#2a1405;font:12px 'Luckiest Guy',Impact;display:flex;align-items:center;justify-content:center;border:2px dashed #fff;font-style:normal;box-shadow:0 2px 4px #000}
#rHist{display:flex;gap:4px;justify-content:center;margin-top:8px;flex-wrap:wrap}#rHist span{width:30px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;font:15px 'Luckiest Guy',Impact}
#rMsg,#bMsg{min-height:34px;font:26px 'Luckiest Guy',Impact;color:#ffd23f;text-align:center;text-shadow:0 3px 0 #000}
#bTable{width:min(900px,92vw);min-height:470px;border-radius:0 0 300px 300px;background:radial-gradient(ellipse at 50% 0%,#17844f,#0b5d3a 60%,#063d26);border:10px solid #6b3f12;border-top:0;box-shadow:inset 0 0 60px #000a,0 30px 60px #000c;position:relative;padding:20px 30px 40px;text-align:center}
#bTable .arc{position:absolute;left:50%;top:205px;transform:translateX(-50%);color:#f3d27a;font:700 15px Rajdhani;letter-spacing:3px;opacity:.85;white-space:nowrap}
.hand{display:flex;justify-content:center;gap:-20px;min-height:132px;margin:8px 0}
.pcard{width:86px;height:122px;border-radius:9px;background:#fff;color:#111;box-shadow:0 6px 14px #0009;margin:0 -12px;position:relative;font:700 22px Georgia,serif;animation:deal .35s ease-out}
.pcard.red{color:#c1121f}.pcard .tl{position:absolute;left:7px;top:5px;line-height:.95;text-align:center}.pcard .br{position:absolute;right:7px;bottom:5px;transform:rotate(180deg);line-height:.95;text-align:center}.pcard .mid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:46px}
.pcard.back{background:repeating-linear-gradient(45deg,#7f1d1d 0 8px,#991b1b 8px 16px);border:4px solid #fff}
@keyframes deal{from{transform:translate(220px,-220px) rotate(25deg);opacity:0}to{transform:none;opacity:1}}
.score{display:inline-block;background:#0009;border-radius:10px;padding:2px 10px;font:18px 'Luckiest Guy',Impact;margin:2px}
`;document.head.appendChild(css);
const D=document.createElement('div');D.id='csn';D.innerHTML=`<div id="csnTop"><span class="t">🎰 KÖZPÉNZ KASZINÓ</span><button class="tab on" data-g="r">🎡 RULETT</button><button class="tab" data-g="b">🃏 BLACKJACK</button><span id="csnBal"></span><button id="csnX" title="Bezárás (Esc)">✕</button></div><div id="csnBody"></div>`;document.body.appendChild(D);
const $c=s=>D.querySelector(s);const bal=()=>{$c('#csnBal').textContent=fmtZ(B().zs)};
let game='r';D.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{if(spinning||(bj&&bj.phase==='play'))return;game=t.dataset.g;D.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x===t));render()});
$c('#csnX').onclick=()=>{if(spinning)return;D.classList.remove('on')};addEventListener('keydown',e=>{if(e.key==='Escape'&&D.classList.contains('on')&&!spinning)D.classList.remove('on')});
window.openCasino=g=>{if(g)game=g;D.classList.add('on');D.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.dataset.g===game));render()};
function render(){bal();if(game==='r')roulette();else blackjack()}
const CHIPV=[10,50,100,500,1000],CHIPC=['#e5e7eb','#2563eb','#16a34a','#111827','#a855f7'];let chipI=1;
const chipsHtml=()=>'<div class="chips">'+CHIPV.map((v,i)=>'<div class="chip'+(i===chipI?' on':'')+'" data-i="'+i+'" style="background:'+CHIPC[i]+';color:'+(i===0?'#111':'#fff')+'">'+v+'</div>').join('')+'</div>';
const bindChips=()=>D.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{chipI=+c.dataset.i;D.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===c))});

// ================= RULETT =================
const ORDER=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const colOf=n=>n===0?'z':RED.has(n)?'r':'k';
let bets={},spinning=false,hist=[],wheelA=0,ballA=0;
function betWins(k,n){if(k==='n'+n)return 36;if(n===0)return 0;const m={red:RED.has(n),black:!RED.has(n),even:n%2===0,odd:n%2===1,low:n<=18,high:n>=19};if(k in m)return m[k]?2:0;
 if(k.startsWith('d'))return Math.ceil(n/12)===+k[1]?3:0;if(k.startsWith('c'))return((n-1)%3)+1===+k[1]?3:0;return 0}
function roulette(){const body=$c('#csnBody');body.innerHTML=`<div style="text-align:center"><canvas id="rWheel" width="440" height="440" style="width:400px;height:400px;filter:drop-shadow(0 25px 40px #000c)"></canvas><div id="rMsg">Tedd meg a téted!</div><div id="rHist"></div></div>
 <div style="text-align:center"><div id="rBoard"></div>${chipsHtml()}<div><button class="cbtn" id="rSpin" style="background:linear-gradient(#ffe066,#e8b04a);color:#2a1405">🎡 PÖRGETÉS</button><button class="cbtn" id="rClr" style="background:#334155;color:#fff">TÖRLÉS</button><button class="cbtn" id="rDbl" style="background:#7c3aed;color:#fff">×2</button></div><div style="margin-top:6px;color:#f3d27a;font-weight:700">Tét összesen: <span id="rTot">0</span> 🪙 · Szám: 35:1 · Tucat/oszlop: 2:1 · Szín/páros/fél: 1:1</div></div>`;
 const bd=$c('#rBoard');const cell=(k,txt,cls,st)=>{const d=document.createElement('div');d.className=cls;d.textContent=txt;d.dataset.k=k;if(st)d.style.cssText=st;d.onclick=()=>place(k);d.oncontextmenu=e=>{e.preventDefault();delete bets[k];upd()};bd.appendChild(d)};
 cell('n0','0','z','grid-row:1/4;grid-column:1');for(let c=0;c<12;c++)for(let r=0;r<3;r++){const n=c*3+(3-r);cell('n'+n,n,colOf(n),'grid-row:'+(r+1)+';grid-column:'+(c+2))}
 ['c3','c2','c1'].forEach((k,r)=>cell(k,'2:1','o','grid-row:'+(r+1)+';grid-column:14'));
 [['d1','1. TUCAT'],['d2','2. TUCAT'],['d3','3. TUCAT']].forEach(([k,t],i)=>cell(k,t,'o','grid-row:4;grid-column:'+(2+i*4)+'/span 4'));
 [['low','1-18'],['even','PÁROS'],['red','◆','r'],['black','◆','k'],['odd','PÁRATLAN'],['high','19-36']].forEach(([k,t,c],i)=>cell(k,t,c||'o','grid-row:5;grid-column:'+(2+i*2)+'/span 2'));
 bindChips();$c('#rSpin').onclick=spin;$c('#rClr').onclick=()=>{if(!spinning){bets={};upd()}};$c('#rDbl').onclick=()=>{if(spinning)return;const tot=Object.values(bets).reduce((a,b)=>a+b,0);if(tot*2>B().zs){msg('Nincs elég zseton a duplázáshoz!');return}for(const k in bets)bets[k]*=2;upd()};
 upd();drawWheel();histR()}
const msg=t=>{const m=$c('#rMsg');if(m)m.textContent=t};
function place(k){if(spinning)return;const v=CHIPV[chipI],tot=Object.values(bets).reduce((a,b)=>a+b,0);if(tot+v>B().zs){msg('Nincs elég zseton!');return}bets[k]=(bets[k]||0)+v;upd();try{sfx('coin')}catch(e){}}
function upd(){D.querySelectorAll('#rBoard div').forEach(d=>{const v=bets[d.dataset.k];let i=d.querySelector('i');if(v){if(!i){i=document.createElement('i');d.appendChild(i)}i.textContent=v>=1000?(v/1000)+'k':v}else if(i)i.remove()});const t=$c('#rTot');if(t)t.textContent=Object.values(bets).reduce((a,b)=>a+b,0);bal()}
function histR(){const h=$c('#rHist');if(h)h.innerHTML=hist.slice(-14).map(n=>'<span style="background:'+({z:'#0f8a4c',r:'#b3121f',k:'#141414'})[colOf(n)]+'">'+n+'</span>').join('')}
function drawWheel(){const c=$c('#rWheel');if(!c)return;const x=c.getContext('2d'),C=220,N=37,step=Math.PI*2/N;x.clearRect(0,0,440,440);
 // fa / bronz perem
 let g=x.createRadialGradient(C,C,150,C,C,218);g.addColorStop(0,'#3b200b');g.addColorStop(.55,'#8a5520');g.addColorStop(.8,'#c98a3e');g.addColorStop(1,'#5a3412');x.fillStyle=g;x.beginPath();x.arc(C,C,218,0,7);x.fill();
 x.save();x.translate(C,C);x.rotate(wheelA);
 for(let i=0;i<N;i++){const n=ORDER[i],a0=i*step-Math.PI/2-step/2;x.beginPath();x.moveTo(0,0);x.arc(0,0,180,a0,a0+step);x.closePath();x.fillStyle=({z:'#0f8a4c',r:'#b3121f',k:'#161616'})[colOf(n)];x.fill();x.strokeStyle='#d9a441';x.lineWidth=1.5;x.stroke();
  x.save();x.rotate(a0+step/2+Math.PI/2);x.fillStyle='#fff';x.font='bold 17px Georgia';x.textAlign='center';x.fillText(n,0,-158);x.restore()}
 g=x.createRadialGradient(0,0,10,0,0,128);g.addColorStop(0,'#e8c27a');g.addColorStop(.5,'#9a6424');g.addColorStop(1,'#4a2a0e');x.fillStyle=g;x.beginPath();x.arc(0,0,128,0,7);x.fill();
 x.strokeStyle='#e8c27a';x.lineWidth=4;x.beginPath();x.arc(0,0,140,0,7);x.stroke();
 for(let i=0;i<4;i++){x.save();x.rotate(i*Math.PI/2);x.fillStyle='#f3d27a';x.fillRect(-5,-110,10,90);x.beginPath();x.arc(0,-112,10,0,7);x.fill();x.restore()}
 g=x.createRadialGradient(-8,-8,2,0,0,30);g.addColorStop(0,'#fff6d6');g.addColorStop(1,'#a8741f');x.fillStyle=g;x.beginPath();x.arc(0,0,28,0,7);x.fill();x.restore();
 // golyó
 const br=spinning?196-Math.min(1,spinT/3.2)*30:166;x.fillStyle='#fff';x.shadowColor='#000';x.shadowBlur=8;x.beginPath();x.arc(C+Math.cos(ballA-Math.PI/2)*br,C+Math.sin(ballA-Math.PI/2)*br,8,0,7);x.fill();x.shadowBlur=0}
let spinT=0;
function spin(){if(spinning)return;const tot=Object.values(bets).reduce((a,b)=>a+b,0);if(!tot){msg('Előbb tegyél tétet a táblára!');return}if(tot>B().zs){msg('Nincs elég zseton!');return}
 B().zs-=tot;saveB();bal();spinning=true;msg('Nincs több tét!');try{sfx('wave')}catch(e){}
 const win=ORDER[Math.floor(Math.random()*37)],idx=ORDER.indexOf(win),step=Math.PI*2/37;
 const w0=wheelA,b0=ballA,dur=5.2,wEnd=w0+Math.PI*2*3+Math.random()*Math.PI*2;
 // a golyó végső szöge = a nyerő zseb szöge a forgó keréken
 const ballEnd=wEnd+idx*step-Math.PI*2*7;let t0=performance.now();
 const ease=t=>1-Math.pow(1-t,3);
 (function fr(now){const t=Math.min(1,(now-t0)/1000/dur);spinT=t*dur;wheelA=w0+(wEnd-w0)*ease(t);ballA=b0+(ballEnd-b0)*ease(Math.min(1,t*1.04));drawWheel();if(t<1)requestAnimationFrame(fr);else done()})(t0);
 function done(){spinning=false;hist.push(win);let pay=0;for(const k in bets)pay+=bets[k]*betWins(k,win);B().zs+=pay;saveB();
  msg(win+' '+({z:'ZÖLD',r:'PIROS',k:'FEKETE'})[colOf(win)]+(pay?' · NYEREMÉNY: +'+fmtZ(pay):' · Most nem nyert...'));try{sfx(pay?'win':'lose')}catch(e){}histR();upd()}}

// ================= BLACKJACK =================
let bj=null,bet=0,shoe=[];
const SU=['♠','♥','♦','♣'],RK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
function newShoe(){shoe=[];for(let d=0;d<6;d++)for(const s of SU)for(const r of RK)shoe.push({r,s});for(let i=shoe.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[shoe[i],shoe[j]]=[shoe[j],shoe[i]]}}
const draw=()=>{if(shoe.length<52)newShoe();return shoe.pop()};
function val(h){let v=0,a=0;h.forEach(c=>{if(c.r==='A'){a++;v+=11}else v+=['J','Q','K'].includes(c.r)?10:+c.r});while(v>21&&a){v-=10;a--}return v}
const isBJ=h=>h.length===2&&val(h)===21;
const cardHtml=(c,hid)=>hid?'<div class="pcard back"></div>':'<div class="pcard'+(c.s==='♥'||c.s==='♦'?' red':'')+'"><div class="tl">'+c.r+'<br>'+c.s+'</div><div class="mid">'+c.s+'</div><div class="br">'+c.r+'<br>'+c.s+'</div></div>';
function blackjack(){const body=$c('#csnBody');body.innerHTML=`<div style="text-align:center"><div id="bTable"><div style="font:16px 'Luckiest Guy',Impact;color:#f3d27a;letter-spacing:2px">OSZTÓ <span id="bDs" class="score"></span></div><div class="hand" id="bD"></div><div class="arc">✦ A BLACKJACK 3:2-T FIZET · AZ OSZTÓ 17-NÉL MEGÁLL ✦</div><div style="height:46px"></div><div class="hand" id="bP"></div><div style="font:16px 'Luckiest Guy',Impact;color:#f3d27a;letter-spacing:2px">TE <span id="bPs" class="score"></span> · TÉT: <span id="bBet">0</span> 🪙</div></div>
 <div id="bMsg">Válassz zsetont és tegyél tétet!</div>${chipsHtml()}<div id="bBtns"></div></div>`;bindChips();if(!bj)bj={phase:'bet',p:[],d:[]};drawBJ()}
function btns(){const b=$c('#bBtns');if(!b)return;if(bj.phase==='play')b.innerHTML='<button class="cbtn" style="background:#16a34a;color:#fff" onclick="bjHit()">LAP</button><button class="cbtn" style="background:#dc2626;color:#fff" onclick="bjStand()">MEGÁLLOK</button><button class="cbtn" style="background:#7c3aed;color:#fff" onclick="bjDouble()" '+(bj.p.length===2&&B().zs>=bet?'':'disabled')+'>DUPLÁZÁS</button>';
 else b.innerHTML='<button class="cbtn" style="background:linear-gradient(#ffe066,#e8b04a);color:#2a1405" onclick="bjAdd()">+ TÉT</button><button class="cbtn" style="background:#334155;color:#fff" onclick="bjClr()">TÖRLÉS</button><button class="cbtn" style="background:linear-gradient(#4ade80,#16a34a);color:#04210f" onclick="bjDeal()" '+(bet?'':'disabled')+'>OSZTÁS</button>'}
function drawBJ(){const hide=bj.phase==='play';$c('#bD').innerHTML=bj.d.map((c,i)=>cardHtml(c,hide&&i===1)).join('');$c('#bP').innerHTML=bj.p.map(c=>cardHtml(c)).join('');
 $c('#bDs').textContent=bj.d.length?(hide?val([bj.d[0]]):val(bj.d)):'';$c('#bPs').textContent=bj.p.length?val(bj.p):'';$c('#bBet').textContent=bet;btns();bal()}
const bmsg=t=>{const m=$c('#bMsg');if(m)m.textContent=t};
window.bjAdd=()=>{if(bj.phase==='play')return;const v=CHIPV[chipI];if(bet+v>B().zs){bmsg('Nincs elég zseton!');return}bet+=v;if(bj.phase==='done'){bj={phase:'bet',p:[],d:[]}}try{sfx('coin')}catch(e){}drawBJ()};
window.bjClr=()=>{if(bj.phase!=='play'){bet=0;drawBJ()}};
window.bjDeal=()=>{if(!bet||bet>B().zs)return;B().zs-=bet;saveB();bj={phase:'play',p:[draw(),draw()],d:[draw(),draw()]};bmsg('Lapot kérsz vagy megállsz?');drawBJ();
 if(isBJ(bj.p)||isBJ(bj.d))setTimeout(finish,500)};
window.bjHit=()=>{if(bj.phase!=='play')return;bj.p.push(draw());drawBJ();if(val(bj.p)>21)setTimeout(finish,400);else if(val(bj.p)===21)setTimeout(bjStand,400)};
window.bjDouble=()=>{if(bj.phase!=='play'||bj.p.length!==2||B().zs<bet)return;B().zs-=bet;bet*=2;saveB();bj.p.push(draw());drawBJ();setTimeout(finish,500)};
window.bjStand=()=>{if(bj.phase==='play')finish()};
function finish(){bj.phase='dealer';const pv=val(bj.p);const step=()=>{drawBJ();if(pv<=21&&!isBJ(bj.p)&&val(bj.d)<17){bj.d.push(draw());setTimeout(step,550)}else settle()};step()}
function settle(){const pv=val(bj.p),dv=val(bj.d);let pay=0,t;
 if(isBJ(bj.p)&&!isBJ(bj.d)){pay=bet*2.5;t='BLACKJACK! +'+fmtZ(pay)}else if(pv>21){t='Besokalltál ('+pv+')... vesztettél.'}else if(isBJ(bj.d)&&!isBJ(bj.p)){t='Az osztónak blackjackje van.'}
 else if(dv>21||pv>dv){pay=bet*2;t='NYERTÉL! +'+fmtZ(pay)+' ('+pv+' vs '+dv+')'}else if(pv===dv){pay=bet;t='Döntetlen – a tét visszajár.'}else t='Az osztó nyert ('+dv+' vs '+pv+').';
 B().zs+=pay;saveB();bj.phase='done';drawBJ();bmsg(t);try{sfx(pay>bet?'win':pay?'coin':'lose')}catch(e){}if(bet>B().zs)bet=0}
newShoe();
})();
