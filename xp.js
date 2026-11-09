// ===== FIÓKSZINT (XP) RENDSZER =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},s:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const MAXL=200,need=l=>500+l*150;
const TITLES=[[1,'Újonc'],[5,'Gyakornok'],[10,'Tanácsadó'],[20,'Államtitkár'],[35,'Miniszter'],[50,'Kancellár'],[75,'Oligarcha'],[100,'Közpénz-Legenda'],[150,'Nemzeti Ikon'],[200,'Az Örökkévaló']];
const titleOf=l=>{let t=TITLES[0][1];TITLES.forEach(x=>{if(l>=x[0])t=x[1]});return t};
let A=LS.g('ry_acc',{lv:1,xp:0,total:0});
const save=()=>LS.s('ry_acc',A);
let pendingUps=[],matchLog=[];
window.ACCXP={get:()=>({...A,need:need(A.lv),title:titleOf(A.lv)}),add};
function add(n,why){if(!n||A.lv>=MAXL)return;n=Math.round(n);A.xp+=n;A.total+=n;matchLog.push([why,n]);
 while(A.lv<MAXL&&A.xp>=need(A.lv)){A.xp-=need(A.lv);A.lv++;const z=50+A.lv*10+(A.lv%5===0?250:0);try{window.BR.zs+=z;st.s('k3br',window.BR)}catch(e){}pendingUps.push({lv:A.lv,z,title:A.lv%5===0||TITLES.some(t=>t[0]===A.lv)?titleOf(A.lv):null})}
 save();topUI();if(G&&run&&why){hudXP(n,why)}}
// ---------- forrásai ----------
WP('kill',a=>a[0],(a,e)=>{if(e)add(e.b?300:60,'Elimináció')});
WP('end',a=>{const g=G;if(!g)return null;let place=0;if(g.brMode)place=a[0]?1:(g.en.filter(e=>e.bot&&!e.dead).length+(g.allies||[]).filter(e=>!e.dead).length+1);return{win:!!a[0],place,stw:g.stw,wave:g.wave,t:g.t}},(a,s)=>{if(!s)return;
 add(Math.min(600,Math.round(s.t/60*40)),'Túlélési idő');
 if(s.place)add(Math.max(0,(26-s.place)*14),'Helyezés: #'+s.place);if(s.win&&!s.stw)add(800,'#1 GYŐZELEM');
 if(s.stw){add(s.wave*120,'Védett hullámok');if(s.win)add(1000,'A világ megmentve')}
 add(150,'Meccs befejezése');
 const rb=$('rb');if(rb){const tot=matchLog.reduce((x,y)=>x+y[1],0);rb.innerHTML+='<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ffffff22;text-align:left"><b class="f" style="color:#a3e635">⭐ FIÓK-XP: +'+tot.toLocaleString('hu-HU')+'</b><div style="font-size:13px;color:#cbd5e1;column-count:2">'+summarize().map(([w,n])=>w+': <b>+'+n+'</b>').join('<br>')+'</div><div class="bar" style="height:12px;margin-top:6px"><i style="width:'+Math.round(A.xp/need(A.lv)*100)+'%;background:linear-gradient(90deg,#84cc16,#facc15)"></i></div><small>SZINT '+A.lv+' · '+A.xp.toLocaleString('hu-HU')+' / '+need(A.lv).toLocaleString('hu-HU')+' XP · '+titleOf(A.lv)+'</small></div>'}});
function summarize(){const m=new Map();matchLog.forEach(([w,n])=>m.set(w,(m.get(w)||0)+n));return[...m]}
WP('launch',null,()=>{matchLog=[]});
if(window.qClaim)WP('qClaim',null,()=>add(300,'Küldetés'));
if(window.dailyClaim)WP('dailyClaim',null,()=>add(100,'Napi belépés'));
// ---------- meccsen: lebegő XP-jelzés ----------
const hx=document.createElement('div');hx.style.cssText='position:absolute;right:16px;top:190px;z-index:3;pointer-events:none;display:flex;flex-direction:column;align-items:flex-end;gap:3px;font:16px "Luckiest Guy",Impact;text-shadow:0 2px 0 #000';$('hud').appendChild(hx);
function hudXP(n,why){const d=document.createElement('div');d.style.cssText='color:#a3e635;transition:all .4s;opacity:1';d.textContent='+'+n+' XP · '+why;hx.prepend(d);setTimeout(()=>{d.style.opacity=0;d.style.transform='translateX(20px)'},1800);setTimeout(()=>d.remove(),2300);while(hx.children.length>4)hx.lastChild.remove()}
// ---------- lobby: szint a felső sávban ----------
const css=document.createElement('style');css.textContent=`#lbLvl{display:flex;align-items:center;gap:8px;cursor:pointer;background:#0b1022b3;border:1px solid #ffffff22;border-radius:14px;padding:4px 10px 4px 4px}
#lbLvl .ring{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:18px 'Luckiest Guy',Impact;color:#fff;position:relative}
#lbLvl .ring::after{content:"";position:absolute;inset:4px;border-radius:50%;background:#0b1022}#lbLvl .ring span{position:relative;z-index:1}
#lbLvl .tx{line-height:1.05;white-space:nowrap}@media (max-width:1750px){#lbLvl .tx small{display:none}}@media (max-width:1450px){#lbLvl .tx{display:none}}#lbLvl b{font:15px 'Luckiest Guy',Impact;color:#a3e635;display:block}#lbLvl small{font:700 12px Rajdhani;color:#cbd5e1}
#lvUp{position:fixed;inset:0;z-index:12;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#4c1d95cc,#000e 70%)}
#lvUp.on{display:flex}#lvUp .c{text-align:center;animation:lvPop .6s cubic-bezier(.2,1.6,.4,1)}
@keyframes lvPop{from{transform:scale(.3);opacity:0}to{transform:none;opacity:1}}
#lvUp .big{font:130px 'Luckiest Guy',Impact;line-height:1;background:linear-gradient(180deg,#fff,#facc15 50%,#f97316);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 8px 0 #7c2d12) drop-shadow(0 0 40px #facc15)}
#lvUp .t1{font:44px 'Luckiest Guy',Impact;color:#fff;letter-spacing:4px;text-shadow:0 4px 0 #000}
#lvUp .rays{position:absolute;width:900px;height:900px;background:repeating-conic-gradient(#facc1522 0 10deg,transparent 10deg 20deg);border-radius:50%;animation:lvSpin 12s linear infinite;mask-image:radial-gradient(circle,#000 30%,transparent 70%)}
@keyframes lvSpin{to{transform:rotate(360deg)}}
.cf{position:absolute;width:10px;height:16px;top:-20px;animation:cfFall linear forwards}@keyframes cfFall{to{transform:translateY(110vh) rotate(720deg)}}`;document.head.appendChild(css);
function topUI(){const r=document.getElementById('lbRight');if(!r)return;let el=document.getElementById('lbLvl');if(!el){el=document.createElement('div');el.id='lbLvl';el.title='Fiókszint';el.onclick=levelUI;r.insertBefore(el,r.firstChild)}
 const pct=Math.round(A.xp/need(A.lv)*100);el.innerHTML='<div class="ring" style="background:conic-gradient(#a3e635 '+pct*3.6+'deg,#334155 0)"><span>'+A.lv+'</span></div><div class="tx"><b>SZINT '+A.lv+'</b><small>'+titleOf(A.lv)+' · '+pct+'%</small></div>'}
function levelUI(){const pct=Math.round(A.xp/need(A.lv)*100);const next=[];for(let l=A.lv+1;l<=Math.min(MAXL,A.lv+6);l++)next.push(l);
 guiOpen('<h1 class="f" style="font-size:32px">⭐ FIÓKSZINT</h1><div style="font:90px Luckiest Guy,Impact;color:#a3e635;line-height:1">'+A.lv+'</div><div class="f" style="font-size:22px">'+titleOf(A.lv)+'</div><div class="bar" style="height:16px;margin:10px 0"><i style="width:'+pct+'%;background:linear-gradient(90deg,#84cc16,#facc15)"></i></div><div style="color:#cbd5e1">'+A.xp.toLocaleString('hu-HU')+' / '+need(A.lv).toLocaleString('hu-HU')+' XP · összesen '+A.total.toLocaleString('hu-HU')+' XP</div>'+
 '<h2 class="f" style="margin-top:12px">KÖVETKEZŐ JUTALMAK</h2><div class="g">'+next.map(l=>'<div class="it" style="cursor:default;text-align:center'+(l%5===0?';border-color:var(--y)!important':'')+'"><div class="f" style="font-size:20px">'+l+'. SZINT</div><div style="font-size:26px">'+(l%5===0?'💎':'🪙')+'</div><b style="color:var(--y)">+'+(50+l*10+(l%5===0?250:0))+' 🪙</b>'+(TITLES.some(t=>t[0]===l)?'<small>Új cím: '+titleOf(l)+'</small>':'')+'</div>').join('')+'</div>'+
 '<div style="color:#94a3b8;margin-top:8px;font-size:14px">XP: elimináció +60 · boss +300 · túlélés · helyezés · győzelem +800 · hullámok · küldetés +300 · napi belépés +100</div>'+bB('VISSZA','guiClose()','r'))}
// szintlépés-ünneplés a lobbyban
const LU=document.createElement('div');LU.id='lvUp';document.body.appendChild(LU);
function celebrate(){if(!pendingUps.length)return;const u=pendingUps.shift();LU.innerHTML='<div class="rays"></div><div class="c"><div class="t1">SZINTLÉPÉS!</div><div class="big">'+u.lv+'</div>'+(u.title?'<div class="t1" style="font-size:28px;color:#facc15">ÚJ CÍM: '+u.title+'</div>':'')+'<div class="t1" style="font-size:30px;color:#a3e635;margin-top:8px">+'+u.z+' 🪙</div><div style="margin-top:18px">'+bB('SZUPER!','lvClose()','')+'</div></div>';
 for(let i=0;i<70;i++){const c=document.createElement('i');c.className='cf';c.style.left=Math.random()*100+'vw';c.style.background=['#facc15','#f472b6','#38bdf8','#a3e635','#fb923c'][i%5];c.style.animationDuration=(1.6+Math.random()*2.2)+'s';c.style.animationDelay=Math.random()*.8+'s';LU.appendChild(c)}
 LU.classList.add('on');try{sfx('win')}catch(e){}}
window.lvClose=()=>{LU.classList.remove('on');setTimeout(celebrate,250);topUI()};
{const lb=document.getElementById('lb');if(lb)new MutationObserver(()=>{if(lb.classList.contains('on')){topUI();setTimeout(celebrate,600)}}).observe(lb,{attributes:true,attributeFilter:['class']})}
topUI();
// a szezonbérlet-jelvény felirata egyértelmű legyen
{const b=document.querySelector('#lbLv .ring small');if(b)b.textContent='BÉRLET'}
})();
