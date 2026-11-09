// ===== FLAKONOZÁS: gyűjts flakonokat, váltsd vissza az automatánál – darabja 50 Ft =====
(function(){
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const ITEMS=[{e:'🧴',n:'PET-palack',ok:1},{e:'🍾',n:'Üveg',ok:1},{e:'🥫',n:'Fémdoboz',ok:1},{e:'🧃',n:'Üdítős doboz',ok:1},{e:'🍺',n:'Sörösüveg',ok:1},{e:'🥤',n:'Pohár',ok:0},{e:'🍌',n:'Banánhéj',ok:0},{e:'📰',n:'Újság',ok:0}];
const css=document.createElement('style');css.textContent=`#fk{position:fixed;inset:0;z-index:11;display:none;font-family:Rajdhani,Arial;color:#fff;background:
 repeating-linear-gradient(90deg,#00000014 0 2px,transparent 2px 90px) 0 100%/100% 56% no-repeat,
 repeating-linear-gradient(0deg,#00000014 0 2px,transparent 2px 45px) 0 100%/100% 56% no-repeat,
 linear-gradient(180deg,#5eb3f6 0%,#a5d8ff 30%,#dbeafe 40%,#4d7c0f 40%,#65a30d 44%,#b8b2a7 44.2%,#a8a29e 100%)}
#fk .dec{position:absolute;pointer-events:none;filter:drop-shadow(0 8px 6px #0005)}
#fk.on{display:block}#fkTop{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:12px;padding:12px 18px;background:linear-gradient(#0009,#0000);z-index:3}
#fkTop .t{font:30px 'Luckiest Guy',Impact;color:#fff;text-shadow:0 3px 0 #000}#fkBal{margin-left:auto;font:22px 'Luckiest Guy',Impact;color:#a3e635;background:#0009;padding:6px 14px;border-radius:12px}
#fkX{border:0;border-radius:10px;width:44px;height:44px;background:#ef4444;color:#fff;font-size:22px;cursor:pointer}
#fkField{position:absolute;left:0;right:340px;top:70px;bottom:0;overflow:hidden}
.fkI{position:absolute;font-size:46px;cursor:pointer;transition:transform .12s;filter:drop-shadow(0 6px 4px #0006);user-select:none}.fkI:hover{transform:scale(1.2) rotate(-8deg)}
.fkI.fly{transition:all .55s cubic-bezier(.5,-.3,.6,1);pointer-events:none}
#fkM{position:absolute;right:30px;top:90px;width:280px;height:560px;border-radius:22px;background:linear-gradient(160deg,#16a34a,#065f46);box-shadow:0 30px 60px #0008,inset 0 2px 0 #fff4;border:4px solid #064e3b;text-align:center}
#fkM .scr{margin:18px;background:#022c22;border-radius:12px;padding:12px;font:24px 'Luckiest Guy',Impact;color:#86efac;box-shadow:inset 0 0 20px #000}
#fkM .slot{margin:10px auto;width:150px;height:110px;border-radius:60px 60px 14px 14px;background:radial-gradient(ellipse at 50% 30%,#111 0%,#000 70%);border:6px solid #a7f3d0;box-shadow:0 0 25px #4ade80aa}
#fkM .lg{font:26px 'Luckiest Guy',Impact;color:#fff;text-shadow:0 3px 0 #064e3b;margin-top:8px}
#fkBag{position:absolute;left:24px;bottom:24px;background:#0009;border-radius:16px;padding:10px 16px;font:20px 'Luckiest Guy',Impact;z-index:3}
#fkGo{display:block;width:240px;margin:16px auto 0;padding:14px;border:0;border-radius:14px;background:linear-gradient(#fde68a,#facc15);color:#3b2a05;font:24px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 5px 0 #a16207}#fkGo:disabled{filter:grayscale(1);opacity:.6}
#fkMsg{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);font:40px 'Luckiest Guy',Impact;color:#fff;text-shadow:0 4px 0 #000;pointer-events:none;opacity:0;transition:opacity .3s;z-index:4;text-align:center}
.fkPop{position:absolute;font:22px 'Luckiest Guy',Impact;color:#a3e635;text-shadow:0 2px 0 #000;pointer-events:none;animation:fkUp 1s forwards;z-index:4}@keyframes fkUp{to{transform:translateY(-60px);opacity:0}}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='fk';D.innerHTML=`<div id="fkTop"><span class="t">♻️ FLAKONOZÁS</span><span style="color:#0b1022;font-weight:700;background:#fff8;border-radius:8px;padding:3px 8px">Kattints a visszaváltható flakonokra, aztán dobd be őket! Darabja 50 Ft.</span><span id="fkBal"></span><button id="fkX" title="Bezárás (Esc)">✕</button></div>
<div class="dec" style="left:0;right:0;top:26%;height:14%;background:linear-gradient(180deg,transparent,#64748b55);clip-path:polygon(0 100%,0 40%,4% 40%,4% 10%,9% 10%,9% 50%,14% 50%,14% 0,20% 0,20% 35%,26% 35%,26% 15%,31% 15%,31% 55%,38% 55%,38% 5%,44% 5%,44% 45%,52% 45%,52% 20%,58% 20%,58% 60%,64% 60%,64% 8%,70% 8%,70% 40%,77% 40%,77% 25%,83% 25%,83% 55%,90% 55%,90% 12%,96% 12%,96% 45%,100% 45%,100% 100%)"></div>
<div class="dec" style="left:6%;top:9%;font-size:70px;opacity:.9">☁️</div><div class="dec" style="left:38%;top:5%;font-size:90px;opacity:.85">☁️</div><div class="dec" style="left:62%;top:12%;font-size:60px;opacity:.9">☁️</div>
<div class="dec" style="left:3%;top:24%;font-size:110px">🌳</div><div class="dec" style="left:26%;top:27%;font-size:90px">🌳</div><div class="dec" style="left:55%;top:25%;font-size:105px">🌳</div>
<div class="dec" style="left:14%;top:34%;font-size:64px">🪑</div><div class="dec" style="left:44%;top:35%;font-size:56px">🗑️</div><div class="dec" style="left:70%;top:33%;font-size:58px">🚲</div>
<div id="fkField"></div><div id="fkM"><div class="lg">♻️ VISSZAVÁLTÓ</div><div class="scr" id="fkScr">0 db · 0 Ft</div><div class="slot" id="fkSlot"></div><div style="font-weight:700;color:#d1fae5">PET · ÜVEG · FÉMDOBOZ</div><button id="fkGo">BEDOBÁS ▶</button><div style="margin-top:14px;font-weight:700;color:#bbf7d0" id="fkTot"></div></div>
<div id="fkBag">🛍️ Zsák: <span id="fkN">0</span> db</div><div id="fkMsg"></div>`;document.body.appendChild(D);
const Q=s=>D.querySelector(s);let bag=[],spawnT=null,feeding=false;
const store=()=>JSON.parse(localStorage.getItem('ry_fk')||'{"n":0,"ft":0}');
function bal(){Q('#fkBal').textContent='💵 '+ft(S.c);const s=store();Q('#fkTot').textContent='Összesen visszaváltva: '+s.n+' db · '+ft(s.ft);Q('#fkN').textContent=bag.length;Q('#fkGo').disabled=!bag.length||feeding}
function msg(t,c){const m=Q('#fkMsg');m.innerHTML=t;m.style.color=c||'#fff';m.style.opacity=1;clearTimeout(msg.T);msg.T=setTimeout(()=>m.style.opacity=0,1300)}
function spawn(){const f=Q('#fkField');if(!D.classList.contains('on'))return;if(f.children.length<12){const it=Math.random()<.78?ITEMS[Math.random()*5|0]:ITEMS[5+(Math.random()*3|0)];const d=document.createElement('div');d.className='fkI';d.textContent=it.e;d.title=it.n;
  const W=f.clientWidth,H=f.clientHeight;d.style.left=(30+Math.random()*(W-110))+'px';d.style.top=(H*.45+Math.random()*(H*.48))+'px';d.style.transform='rotate('+(Math.random()*60-30)+'deg)';
  d.onclick=()=>{if(!it.ok){msg('🚫 '+it.n+' – ez nem váltható vissza!','#fca5a5');d.remove();try{sfx('hurt')}catch(e){}return}bag.push(it);const r=d.getBoundingClientRect(),b=Q('#fkBag').getBoundingClientRect();d.classList.add('fly');d.style.position='fixed';d.style.left=r.left+'px';d.style.top=r.top+'px';document.body.appendChild(d);
   requestAnimationFrame(()=>{d.style.left=(b.left+20)+'px';d.style.top=(b.top-10)+'px';d.style.transform='scale(.3)';d.style.opacity=.2});setTimeout(()=>d.remove(),600);try{sfx('click')}catch(e){}bal()};
  f.appendChild(d);setTimeout(()=>{if(d.parentNode===f){d.style.opacity=0;setTimeout(()=>d.remove(),300)}},9000+Math.random()*5000)}}
Q('#fkGo').onclick=()=>{if(!bag.length||feeding)return;feeding=true;bal();let i=0,sum=0;const slot=Q('#fkSlot').getBoundingClientRect();
 const one=()=>{if(i>=bag.length){feeding=false;S.c+=sum;try{save()}catch(e){}const s=store();s.n+=bag.length;s.ft+=sum;localStorage.setItem('ry_fk',JSON.stringify(s));msg('💵 +'+ft(sum)+'<br><span style="font-size:24px">'+bag.length+' db visszaváltva</span>','#a3e635');try{sfx('win')}catch(e){}if(window.ACCXP)ACCXP.add(Math.min(200,bag.length*5),'Flakonozás');bag=[];bal();return}
  const it=bag[i++],d=document.createElement('div');d.className='fkI fly';d.textContent=it.e;d.style.position='fixed';d.style.left=(slot.left+slot.width/2-23)+'px';d.style.top=(slot.top-80)+'px';document.body.appendChild(d);
  requestAnimationFrame(()=>{d.style.top=(slot.top+30)+'px';d.style.transform='scale(.2)';d.style.opacity=0});setTimeout(()=>d.remove(),560);sum+=50;Q('#fkScr').textContent=i+' db · '+ft(sum);
  const p=document.createElement('div');p.className='fkPop';p.textContent='+50 Ft';p.style.left=(slot.right-30)+'px';p.style.top=(slot.top)+'px';p.style.position='fixed';document.body.appendChild(p);setTimeout(()=>p.remove(),1000);try{sfx('coin')}catch(e){}
  setTimeout(one,260)};one()};
Q('#fkX').onclick=close;addEventListener('keydown',e=>{if(e.key==='Escape'&&D.classList.contains('on'))close()});
function close(){D.classList.remove('on');clearInterval(spawnT)}
window.openFlakon=()=>{D.classList.add('on');Q('#fkScr').textContent='0 db · 0 Ft';bal();clearInterval(spawnT);for(let i=0;i<6;i++)spawn();spawnT=setInterval(spawn,900)};
})();
