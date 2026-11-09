// extra130d.js – HALADÁS & KÉNYELEM: prestige, prémium sáv, mentés export/import, hibajelentés,
// betöltési képernyő + minijáték, bemondó, heti küldetéssor, statisztika-grafikon, ajándékkód.
// Lebegő gomb a lobby bal oldalán (📈), billentyű: F8 panel. Debug: _x13d()
(function(){
'use strict';
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const $=id=>document.getElementById(id);
const fm=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const hasS=()=>typeof S!=='undefined'&&S;
const sv=()=>{try{if(typeof save==='function')save()}catch(e){}};
const addFt=v=>{if(!hasS())return false;S.c=Math.max(0,(S.c||0)+v);sv();return true};
const toast=(t,c)=>{const d=document.createElement('div');d.className='x13d-toast';d.style.borderColor=c||'#fbbf24';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3200)};

// ---------- 4. hibagyűjtés (minél korábban) ----------
const ERR=[];const pushE=s=>{ERR.push(new Date().toLocaleTimeString('hu-HU')+' '+s);if(ERR.length>150)ERR.shift()};
window.addEventListener('error',e=>pushE('[error] '+(e.message||'')+' @'+(e.filename||'').split('/').pop()+':'+(e.lineno||'')));
window.addEventListener('unhandledrejection',e=>pushE('[promise] '+String(e.reason&&e.reason.message||e.reason)));
{const oe=console.error,ow=console.warn;console.error=function(){try{pushE('[console.error] '+[].map.call(arguments,String).join(' '))}catch(e){}return oe.apply(console,arguments)};console.warn=function(){try{pushE('[console.warn] '+[].map.call(arguments,String).join(' '))}catch(e){}return ow.apply(console,arguments)}}

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
#x13dBtn{position:fixed;left:14px;top:38%;z-index:60;width:54px;height:54px;border-radius:16px;border:1px solid rgba(251,191,36,.55);background:linear-gradient(145deg,#1e1b4b,#0f172a);color:#fde68a;font-size:24px;cursor:pointer;box-shadow:0 6px 22px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.12);display:none;transition:transform .15s}
#x13dBtn:hover{transform:scale(1.08)}#x13dBtn small{position:absolute;bottom:-17px;left:0;right:0;font-size:10px;color:#fde68a;font-weight:700;text-shadow:0 1px 3px #000}
#x13dBtn .x13d-pb{position:absolute;top:-8px;right:-8px;font-size:11px;background:#7c3aed;color:#fff;border-radius:9px;padding:1px 6px;border:1px solid #c4b5fd}
.x13d-ov{position:fixed;inset:0;z-index:9000;background:rgba(3,6,20,.72);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,sans-serif}
.x13d-pn{width:min(920px,94vw);height:min(640px,90vh);display:flex;border-radius:20px;overflow:hidden;border:1px solid rgba(251,191,36,.35);background:linear-gradient(160deg,#111827,#0b1022 60%,#1a1035);box-shadow:0 30px 80px rgba(0,0,0,.6);color:#e5e7eb}
.x13d-side{width:200px;background:rgba(0,0,0,.28);padding:14px 8px;display:flex;flex-direction:column;gap:4px;overflow:auto}
.x13d-side h3{margin:2px 8px 10px;font-size:15px;letter-spacing:2px;color:#fbbf24}
.x13d-tab{text-align:left;border:0;background:transparent;color:#cbd5e1;padding:9px 11px;border-radius:10px;cursor:pointer;font-size:13px}
.x13d-tab:hover{background:rgba(255,255,255,.06)}.x13d-tab.on{background:linear-gradient(90deg,rgba(251,191,36,.25),rgba(251,191,36,.04));color:#fde68a;font-weight:700}
.x13d-main{flex:1;padding:20px 24px;overflow:auto;position:relative}.x13d-main h2{margin:0 0 6px;color:#fde68a;font-size:22px}
.x13d-x{position:absolute;right:14px;top:10px;background:none;border:0;color:#94a3b8;font-size:22px;cursor:pointer}
.x13d-b{border:1px solid rgba(251,191,36,.5);background:linear-gradient(180deg,#f59e0b,#b45309);color:#1c1007;font-weight:800;padding:8px 14px;border-radius:10px;cursor:pointer;margin:4px 4px 4px 0}
.x13d-b.g{background:linear-gradient(180deg,#334155,#1e293b);color:#e2e8f0;border-color:#475569}.x13d-b:disabled{opacity:.4;cursor:default}
.x13d-c{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:12px 14px;margin:10px 0}
.x13d-m{color:#94a3b8;font-size:13px}.x13d-in{width:100%;box-sizing:border-box;background:#0b1220;border:1px solid #334155;color:#e5e7eb;border-radius:9px;padding:8px;font-family:monospace}
.x13d-pass{display:grid;grid-template-columns:repeat(10,1fr);gap:6px}
.x13d-t{border-radius:10px;padding:6px 3px;text-align:center;font-size:11px;background:#0f172a;border:1px solid #1e293b;min-height:46px;cursor:default}
.x13d-t.ok{border-color:#22c55e;cursor:pointer;box-shadow:0 0 10px rgba(34,197,94,.35)}.x13d-t.got{opacity:.45}.x13d-t.p{background:linear-gradient(180deg,#2e1065,#0f172a);border-color:#6d28d9}
.x13d-t.lock{filter:grayscale(1);opacity:.5}
.x13d-week{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}.x13d-day{border-radius:12px;padding:10px 6px;text-align:center;background:#0f172a;border:1px solid #1e293b;font-size:12px}
.x13d-day.today{border-color:#fbbf24;box-shadow:0 0 14px rgba(251,191,36,.3)}.x13d-day.done{border-color:#22c55e}
.x13d-badge{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;font-size:26px;font-weight:900;background:conic-gradient(#fbbf24,#f472b6,#818cf8,#22d3ee,#fbbf24);color:#111;box-shadow:0 0 24px rgba(251,191,36,.45)}
.x13d-toast{position:fixed;left:50%;top:14%;transform:translateX(-50%);z-index:9500;background:rgba(10,12,30,.92);border:1px solid;border-radius:14px;padding:10px 18px;color:#fde68a;font:700 16px system-ui;box-shadow:0 10px 30px rgba(0,0,0,.5);animation:x13dIn .3s;pointer-events:none}
@keyframes x13dIn{from{opacity:0;transform:translate(-50%,-10px)}}
#x13dAnn{position:fixed;right:18px;top:120px;z-index:70;display:flex;flex-direction:column;gap:6px;pointer-events:none;align-items:flex-end}
#x13dAnn div{background:linear-gradient(90deg,rgba(124,58,237,.85),rgba(15,23,42,.85));color:#fff;font:700 14px system-ui;padding:7px 14px;border-radius:10px 2px 10px 10px;border-left:3px solid #fbbf24;animation:x13dIn .3s}
#x13dLoad{position:fixed;inset:0;z-index:9800;background:radial-gradient(ellipse at 50% 30%,#1e1b4b,#030712 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e5e7eb;font-family:system-ui;overflow:hidden;user-select:none}
#x13dLoad h1{font-size:44px;margin:0;letter-spacing:6px;background:linear-gradient(90deg,#fde68a,#f59e0b,#fde68a);-webkit-background-clip:text;color:transparent}
.x13d-bar{width:min(560px,80vw);height:14px;border-radius:9px;background:rgba(255,255,255,.08);overflow:hidden;margin:22px 0 10px;border:1px solid rgba(251,191,36,.3)}
.x13d-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#b45309,#fbbf24,#fff7d6,#fbbf24);background-size:200% 100%;animation:x13dSh 1.2s linear infinite;box-shadow:0 0 16px #fbbf24}
@keyframes x13dSh{to{background-position:-200% 0}}
.x13d-coin{position:absolute;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff7d6,#fbbf24 45%,#b45309);box-shadow:0 0 12px #fbbf24;cursor:pointer;display:flex;align-items:center;justify-content:center;font:900 15px system-ui;color:#78350f}
`;document.head.appendChild(css);

// ---------- állapot ----------
const K={pr:'k3x13dPrest',pass:'k3x13dPass',wk:'k3x13dWeek',ann:'k3x13dAnn',gift:'k3x13dGift',load:'k3x13dLoad'};
const PREST_LV=30;
const P=()=>LS.g(K.pass,{xp:0,prem:0,f:[],p:[]});
const PXP=t=>t*400; // ennyi XP kell az adott fokozathoz (kumulált)
const tierOf=xp=>Math.min(30,Math.floor(xp/400));
const passRew=(i,pr)=>pr?(i%5===0?60000*i/5:6000+i*1500):(i%5===0?15000*i/5:2000+i*500);
const PREM_COST=750000;

// ---------- 8. heti küldetések ----------
const WQ=[['Játssz 1 meccset','m',1],['Szerezz 5 kiesést','k',5],['Gyűjts 30 000 Ft-ot meccsben','c',30000],['Játssz 2 meccset','m',2],['Szerezz 12 kiesést','k',12],['Élj túl 3 percet egy meccsben','d',180],['Nyerj egy meccset','w',1]];
const WREW=[5000,8000,12000,18000,26000,38000,80000];
const dayN=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
function W(){let w=LS.g(K.wk,null);if(!w||dayN()-w.start>=7||dayN()<w.start)w={start:dayN(),prog:[0,0,0,0,0,0,0],got:[]};return w}
const wSave=w=>LS.s(K.wk,w);

// ---------- meccs-vége hook ----------
{const oe=window.end;if(typeof oe==='function')window.end=function(win){const g=typeof G!=='undefined'?G:null;const fresh=g&&!g.over&&!g._x13dE;let r;try{r=oe.apply(this,arguments)}finally{
 if(fresh){try{g._x13dE=1;const k=g.kills|0,c=Math.round(g.cash||0),d=Math.round(g.t||0);
 // sáv XP
 const p=P();const before=tierOf(p.xp);p.xp+=60+k*25+(win?300:0)+Math.min(150,Math.floor(d/4));LS.s(K.pass,p);const af=tierOf(p.xp);if(af>before)setTimeout(()=>toast('🎖️ Prémium sáv: '+af+'. fokozat elérve!'),1200);
 // heti
 const w=W();const i=Math.min(6,dayN()-w.start);const q=WQ[i];
 if(q[1]==='m')w.prog[i]+=1;else if(q[1]==='k')w.prog[i]+=k;else if(q[1]==='c')w.prog[i]=Math.max(w.prog[i],c);else if(q[1]==='d')w.prog[i]=Math.max(w.prog[i],d);else if(q[1]==='w'&&win)w.prog[i]+=1;
 wSave(w);
 annSay(win?'🏆 Győzelem! A közpénz a tiéd!':'📉 Vége a meccsnek – '+k+' kiesés.',1);
 }catch(e){}}}
 return r}}

// ---------- 7. bemondó ----------
const AN=()=>LS.g(K.ann,{on:1,voice:0});
let annBox=null,lastSpeak=0;
function annSay(t,force){const a=AN();if(!a.on)return;if(!annBox){annBox=document.createElement('div');annBox.id='x13dAnn';document.body.appendChild(annBox)}
 const d=document.createElement('div');d.textContent='🎙️ '+t;annBox.appendChild(d);while(annBox.children.length>3)annBox.firstChild.remove();setTimeout(()=>d.remove(),4200);
 if(a.voice&&window.speechSynthesis&&(force||performance.now()-lastSpeak>2500)){lastSpeak=performance.now();try{const u=new SpeechSynthesisUtterance(t.replace(/[^\p{L}\p{N} ,.!?–-]/gu,''));u.lang='hu-HU';u.rate=1.08;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}}
// állapotfigyelés (nem többszörös kiesés – azt a játék már bemondja)
let AS=null;
setInterval(()=>{try{const g=typeof G!=='undefined'?G:null;if(!g||g.over||(typeof run!=='undefined'&&!run)){AS=null;return}
 if(!AS||AS.g!==g){AS={g,first:0,l10:0,l3:0,hp:0,c:0,start:performance.now()};annSay('🚀 Indul a meccs! Sok sikert!');return}
 if(!AS.first&&(g.kills|0)>=1){AS.first=1;annSay('🩸 Első kiesés megvan!')}
 const left=g.left;if(typeof left==='number'){if(!AS.l10&&left<=10&&left>3){AS.l10=1;annSay('🔟 Már csak '+left+' ellenfél maradt!')}if(!AS.l3&&left<=3&&left>0){AS.l3=1;annSay('🔥 Döntő szakasz: '+left+' ellenfél!')}}
 if(g.mhp&&g.hp>0&&g.hp<g.mhp*.25){if(!AS.hp){AS.hp=1;annSay('⚠️ Kritikus életerő! Gyógyulj!')}}else if(g.hp>g.mhp*.5)AS.hp=0;
 const cs=Math.floor((g.cash||0)/100000);if(cs>AS.c){AS.c=cs;if(cs>0)annSay('💰 '+cs*100+' ezer Ft a zsebedben!')}
}catch(e){}},600);

// ---------- 5+6. betöltési képernyő + minijáték ----------
const TIPS=['Tipp: a prémium sáv XP-t minden meccs ad – a győzelem +300.','Tipp: F8 megnyitja a Haladás panelt.','Tipp: mentsd el a játékállást kóddal, mielőtt böngészőt váltasz!','Tipp: a heti küldetéssor 7. napja adja a legnagyobb jutalmat.','Tipp: ajándékkóddal játékpénzt küldhetsz egy barátodnak.','Tipp: '+PREST_LV+'. szinttől prestige-elhetsz – új jelvény, állandó bónusz.','Tipp: a betöltés alatt kattints az érmékre – minden érme +150 Ft!','Tipp: hiba van? Hibajelentés fül → letölthető txt.'];
let loading=false;
function showLoad(done){const cfg=LS.g(K.load,{on:1,mg:1});if(!cfg.on){done();return}
 loading=true;const L=document.createElement('div');L.id='x13dLoad';const pr=LS.g(K.pr,0);
 L.innerHTML='<h1>KÖZPÉNZ ROYALE</h1><div class="x13d-m" style="margin-top:6px">'+(pr?'✦ Prestige '+pr+' ✦':'Betöltés…')+'</div><div class="x13d-bar"><i></i></div><div id="x13dLp" style="font:700 13px monospace;color:#fbbf24">0%</div><div id="x13dTip" style="margin-top:18px;max-width:560px;text-align:center;color:#cbd5e1;min-height:40px"></div>'+(cfg.mg?'<div style="margin-top:6px;color:#a5b4fc;font-size:13px">🪙 Érmegyűjtő: <b id="x13dLc">0</b> érme</div>':'')+'<button class="x13d-b" id="x13dGo" style="margin-top:16px;display:none">▶ INDULÁS (Szóköz)</button>';
 document.body.appendChild(L);const bar=L.querySelector('i'),pc=$('x13dLp'),tip=$('x13dTip');let ti=Math.floor(Math.random()*TIPS.length);tip.textContent=TIPS[ti];
 let p=0,coins=0,fin=false,t0=performance.now();const dur=2600+Math.random()*900;
 const spawn=()=>{if(fin||!cfg.mg)return;const c=document.createElement('div');c.className='x13d-coin';c.textContent='Ft';c.style.left=(8+Math.random()*84)+'%';c.style.top=(8+Math.random()*80)+'%';c.onpointerdown=e=>{e.stopPropagation();coins++;$('x13dLc').textContent=coins;c.remove()};L.appendChild(c);setTimeout(()=>c.remove(),1300)};
 const si=setInterval(spawn,420),tt=setInterval(()=>{ti=(ti+1)%TIPS.length;tip.textContent=TIPS[ti]},2600);
 const finish=()=>{if(fin)return;fin=true;clearInterval(si);clearInterval(tt);document.removeEventListener('keydown',kd,true);if(coins){addFt(coins*150);setTimeout(()=>toast('🪙 '+coins+' érme → +'+fm(coins*150)),600)}L.style.transition='opacity .35s';L.style.opacity=0;setTimeout(()=>{L.remove();loading=false},350);done()};
 const kd=e=>{if(e.code==='Space'&&p>=100){e.preventDefault();e.stopPropagation();finish()}};document.addEventListener('keydown',kd,true);
 $('x13dGo').onclick=finish;
 (function step(){if(fin)return;p=Math.min(100,(performance.now()-t0)/dur*100);bar.style.width=p+'%';pc.textContent=Math.floor(p)+'%';if(p>=100){$('x13dGo').style.display='';pc.textContent='KÉSZ';setTimeout(()=>{if(!fin)finish()},cfg.mg?2500:300);return}requestAnimationFrame(step)})();
}
// a start gomb (#gb) kattintását elkapjuk – így a launch-csomagolók sorrendje érintetlen marad
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#gb');if(!b||b.disabled||loading||b._x13dPass)return;if(LS.g(K.load,{on:1}).on===0)return;e.stopImmediatePropagation();e.preventDefault();showLoad(()=>{b._x13dPass=1;try{b.click()}finally{b._x13dPass=0}})},true);

// ---------- 3. export/import ----------
function exportCode(){const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('k3'))o[k]=localStorage.getItem(k)}return 'KPR1.'+btoa(unescape(encodeURIComponent(JSON.stringify({v:1,t:Date.now(),d:o}))))}
function importCode(s){s=(s||'').trim();if(!s.startsWith('KPR1.'))throw Error('Ismeretlen formátum');const o=JSON.parse(decodeURIComponent(escape(atob(s.slice(5)))));if(!o||!o.d)throw Error('Üres mentés');let n=0;for(const k in o.d){if(k.startsWith('k3')){localStorage.setItem(k,o.d[k]);n++}}return n}
const dl=(name,txt)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};

// ---------- 10. ajándékkód ----------
const hsh=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h.toString(36).toUpperCase().slice(0,4).padStart(4,'0')};
const GS=()=>LS.g(K.gift,{used:[],mine:[]});
function makeGift(amt,msg){const id=Math.random().toString(36).slice(2,8).toUpperCase();const body=amt.toString(36).toUpperCase()+'-'+id;return 'AJ-'+body+'-'+hsh(body+'kpr')+(msg?'~'+encodeURIComponent(msg.slice(0,40)):'')}
function parseGift(c){c=(c||'').trim();const [core,m]=c.split('~');const p=core.toUpperCase().split('-');if(p.length!==4||p[0]!=='AJ')return null;const body=p[1]+'-'+p[2];if(hsh(body+'kpr')!==p[3])return null;return{amt:parseInt(p[1],36),id:p[2],msg:m?decodeURIComponent(m):'',key:core.toUpperCase()}}

// ---------- panel ----------
const TABS=[['prest','✦ Prestige'],['pass','🎖️ Prémium sáv'],['week','📅 Heti küldetések'],['stat','📊 Statisztika'],['gift','🎁 Ajándékozás'],['save','☁️ Mentés / betöltés'],['ann','🎙️ Bemondó & betöltés'],['bug','🐞 Hibajelentés']];
let ov=null,cur='prest';
function openP(t){if(t)cur=t;if(!ov){ov=document.createElement('div');ov.className='x13d-ov';ov.onclick=e=>{if(e.target===ov)closeP()};document.body.appendChild(ov)}
 ov.style.display='flex';ov.innerHTML='<div class="x13d-pn"><div class="x13d-side"><h3>HALADÁS</h3>'+TABS.map(t=>'<button class="x13d-tab'+(t[0]===cur?' on':'')+'" data-t="'+t[0]+'">'+t[1]+'</button>').join('')+'<div style="flex:1"></div><div class="x13d-m" style="padding:8px">Egyenleg:<br><b style="color:#fde68a">'+(hasS()?fm(S.c):'-')+'</b><br><br>F8 – panel</div></div><div class="x13d-main"><button class="x13d-x">✕</button><div id="x13dBody"></div></div></div>';
 ov.querySelectorAll('.x13d-tab').forEach(b=>b.onclick=()=>openP(b.dataset.t));ov.querySelector('.x13d-x').onclick=closeP;
 try{R[cur]($('x13dBody'))}catch(e){$('x13dBody').textContent='Hiba: '+e.message}}
function closeP(){if(ov){ov.style.display='none';ov.innerHTML=''}try{if(typeof go==='function'&&$('menu')&&$('menu').offsetParent)go('menu')}catch(e){}}
const R={
prest(b){const pr=LS.g(K.pr,0),lv=hasS()?S.lv:0;const ok=lv>=PREST_LV;
 b.innerHTML='<h2>✦ Prestige</h2><div class="x13d-m">'+PREST_LV+'. szint elérése után újrakezdheted a szintlépést. Minden prestige: állandó +5% meccspénz-bónusz, új jelvény és '+fm(100000)+' × prestige jutalom.</div><div class="x13d-c" style="display:flex;gap:18px;align-items:center"><div class="x13d-badge">'+(pr?'P'+pr:'–')+'</div><div><div style="font-size:18px;font-weight:800">Prestige '+pr+' / 10</div><div class="x13d-m">Jelenlegi szint: Lv '+lv+' · bónusz: +'+pr*5+'% meccspénz</div><div style="margin-top:8px;height:8px;width:280px;background:#1e293b;border-radius:6px;overflow:hidden"><div style="height:100%;width:'+Math.min(100,lv/PREST_LV*100)+'%;background:linear-gradient(90deg,#a78bfa,#fbbf24)"></div></div></div></div><button class="x13d-b" id="x13dPr" '+(ok&&pr<10?'':'disabled')+'>✦ PRESTIGE '+(pr+1)+' (szint → 1)</button>'+(ok?'':'<div class="x13d-m">Még '+(PREST_LV-lv)+' szint kell.</div>');
 const btn=$('x13dPr');if(btn)btn.onclick=()=>{if(!confirm('Biztosan újrakezded a szintet? (Lv → 1, XP → 0)'))return;const n=pr+1;LS.s(K.pr,n);S.lv=1;S.xp=0;addFt(100000*n);annSay('✦ Prestige '+n+'! Új jelvény megszerezve!',1);toast('✦ PRESTIGE '+n+' · +'+fm(100000*n));badge();openP()}},
pass(b){const p=P(),t=tierOf(p.xp);
 let h='<h2>🎖️ Prémium sáv</h2><div class="x13d-m">30 fokozat · meccsenként XP (kiesés +25, győzelem +300). Fokozat: <b style="color:#fde68a">'+t+'/30</b> · '+(p.xp%400)+'/400 XP</div><div style="height:10px;background:#1e293b;border-radius:6px;overflow:hidden;margin:8px 0"><div style="height:100%;width:'+(t>=30?100:(p.xp%400)/4)+'%;background:linear-gradient(90deg,#7c3aed,#fbbf24)"></div></div>';
 h+='<div class="x13d-c"><b>Ingyenes sor</b><div class="x13d-pass" style="margin-top:8px">';for(let i=1;i<=30;i++){const got=p.f.includes(i),ok=i<=t&&!got;h+='<div class="x13d-t'+(ok?' ok':'')+(got?' got':'')+'" data-f="'+i+'">'+i+'<br>'+(i%5?'🪙':'💰')+'<br>'+Math.round(passRew(i,0)/1000)+'e</div>'}
 h+='</div></div><div class="x13d-c"><b style="color:#c4b5fd">Prémium sor</b> '+(p.prem?'<span style="color:#22c55e">✔ feloldva</span>':'<button class="x13d-b" id="x13dPP" style="margin-left:8px">Feloldás: '+fm(PREM_COST)+'</button>')+'<div class="x13d-pass" style="margin-top:8px">';
 for(let i=1;i<=30;i++){const got=p.p.includes(i),ok=p.prem&&i<=t&&!got;h+='<div class="x13d-t p'+(ok?' ok':'')+(got?' got':'')+(p.prem?'':' lock')+'" data-p="'+i+'">'+i+'<br>'+(i%5?'💎':'👑')+'<br>'+Math.round(passRew(i,1)/1000)+'e</div>'}
 h+='</div></div><button class="x13d-b g" id="x13dAll">Összes elérhető begyűjtése</button>';b.innerHTML=h;
 const claim=(i,pr)=>{const q=P(),arr=pr?q.p:q.f;if(arr.includes(i)||i>tierOf(q.xp)||(pr&&!q.prem))return 0;arr.push(i);LS.s(K.pass,q);addFt(passRew(i,pr));return passRew(i,pr)};
 b.querySelectorAll('[data-f],[data-p]').forEach(d=>d.onclick=()=>{const v=claim(+(d.dataset.f||d.dataset.p),!!d.dataset.p);if(v){toast('🎖️ +'+fm(v));openP()}});
 $('x13dAll').onclick=()=>{let s=0;for(let i=1;i<=30;i++){s+=claim(i,0);s+=claim(i,1)}if(s)toast('🎖️ Begyűjtve: +'+fm(s));openP()};
 const pp=$('x13dPP');if(pp)pp.onclick=()=>{if(!hasS()||S.c<PREM_COST){toast('Nincs elég Ft!','#ef4444');return}addFt(-PREM_COST);const q=P();q.prem=1;LS.s(K.pass,q);toast('👑 Prémium sor feloldva!');openP()}},
week(b){const w=W();wSave(w);const today=Math.min(6,dayN()-w.start);
 let h='<h2>📅 Heti küldetéssor</h2><div class="x13d-m">7 nap, minden nap új küldetés, egyre nagyobb jutalommal. A lejárt napok elvesznek – a 7. nap után új hét indul.</div><div class="x13d-week" style="margin-top:14px">';
 WQ.forEach((q,i)=>{const done=w.prog[i]>=q[2],got=w.got.includes(i);h+='<div class="x13d-day'+(i===today?' today':'')+(done?' done':'')+'"><b>'+(i+1)+'. nap</b><div style="margin:6px 0;min-height:44px">'+q[0]+'</div><div class="x13d-m">'+Math.min(w.prog[i],q[2]).toLocaleString('hu-HU')+'/'+q[2].toLocaleString('hu-HU')+'</div><div style="color:#fde68a;font-weight:800;margin:4px 0">'+fm(WREW[i])+'</div>'+(got?'✔ átvéve':done?'<button class="x13d-b" data-w="'+i+'">Átvétel</button>':i<today?'<span style="color:#ef4444">lejárt</span>':i>today?'🔒':'folyamatban')+'</div>'});
 b.innerHTML=h+'</div>';b.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>{const w2=W(),i=+x.dataset.w;if(w2.got.includes(i)||w2.prog[i]<WQ[i][2])return;w2.got.push(i);wSave(w2);addFt(WREW[i]);toast('📅 +'+fm(WREW[i]));openP()})},
stat(b){const L=(LS.g('k3x20log',[])||[]).slice(0,20).reverse();
 b.innerHTML='<h2>📊 Statisztika</h2><div class="x13d-m">Utolsó '+L.length+' meccs (a meccsnapló alapján). Oszlop = kiesések, vonal = becsült helyezés (győzelem = 1.), arany pont = győzelem.</div><canvas id="x13dCv" width="820" height="320" style="width:100%;margin-top:10px;border-radius:12px;background:#0b1220"></canvas><div id="x13dSum" class="x13d-c"></div>';
 const cv=$('x13dCv'),c=cv.getContext('2d'),W0=cv.width,H0=cv.height,pad=40;
 if(!L.length){c.fillStyle='#94a3b8';c.font='16px system-ui';c.fillText('Még nincs lejátszott meccs a naplóban.',pad,H0/2);$('x13dSum').textContent='–';return}
 const mk=Math.max(5,...L.map(m=>m.k|0)),bw=(W0-pad*2)/L.length;
 c.strokeStyle='rgba(255,255,255,.08)';c.fillStyle='#64748b';c.font='11px system-ui';for(let i=0;i<=4;i++){const y=pad+(H0-pad*2)*i/4;c.beginPath();c.moveTo(pad,y);c.lineTo(W0-pad,y);c.stroke();c.fillText(Math.round(mk*(1-i/4)),8,y+4)}
 const place=m=>m.win?1:Math.max(2,Math.round(30-(m.k|0)*2-Math.min(10,(m.dur||0)/40)));
 L.forEach((m,i)=>{const h=(H0-pad*2)*(m.k|0)/mk,x=pad+i*bw+bw*.18;const gr=c.createLinearGradient(0,H0-pad-h,0,H0-pad);gr.addColorStop(0,'#fbbf24');gr.addColorStop(1,'#b45309');c.fillStyle=gr;c.fillRect(x,H0-pad-h,bw*.64,h);c.fillStyle='#94a3b8';c.fillText(i+1,x+bw*.2,H0-pad+14)});
 c.strokeStyle='#a78bfa';c.lineWidth=2.5;c.beginPath();L.forEach((m,i)=>{const x=pad+i*bw+bw/2,y=pad+(H0-pad*2)*(place(m)-1)/29;i?c.lineTo(x,y):c.moveTo(x,y)});c.stroke();
 L.forEach((m,i)=>{const x=pad+i*bw+bw/2,y=pad+(H0-pad*2)*(place(m)-1)/29;c.fillStyle=m.win?'#fde047':'#a78bfa';c.beginPath();c.arc(x,y,m.win?6:3.5,0,7);c.fill()});
 const tk=L.reduce((a,m)=>a+(m.k|0),0),wn=L.filter(m=>m.win).length;$('x13dSum').innerHTML='Össz kiesés: <b>'+tk+'</b> · átlag: <b>'+(tk/L.length).toFixed(1)+'</b> · győzelem: <b>'+wn+'</b> ('+Math.round(wn/L.length*100)+'%) · legtöbb kiesés: <b>'+Math.max(...L.map(m=>m.k|0))+'</b> · átlag pénz: <b>'+fm(L.reduce((a,m)=>a+(m.cash||0),0)/L.length)+'</b>'},
gift(b){const gs=GS();
 b.innerHTML='<h2>🎁 Ajándékozás</h2><div class="x13d-m">Küldj játékpénzt egy barátodnak! Az összeget levonjuk, és kapsz egy ajándékkódot – ezt add át neki. Minden kód egyszer váltható be.</div><div class="x13d-c"><b>Ajándékkód készítése</b><br><input class="x13d-in" id="x13dGa" type="number" min="1000" step="1000" value="10000" style="width:160px;margin:8px 8px 0 0"><input class="x13d-in" id="x13dGm" maxlength="40" placeholder="Üzenet (nem kötelező)" style="width:260px"><br><button class="x13d-b" id="x13dGc">Kód készítése</button><div id="x13dGo2" style="font:700 16px monospace;color:#fde68a;margin-top:6px;word-break:break-all"></div></div><div class="x13d-c"><b>Kód beváltása</b><input class="x13d-in" id="x13dGr" placeholder="AJ-XXXX-XXXXXX-XXXX" style="margin-top:8px"><button class="x13d-b" id="x13dGv">Beváltás</button></div><div class="x13d-c"><b>Saját kódjaid</b><div class="x13d-m">'+(gs.mine.slice(-6).reverse().map(m=>m.c.split('~')[0]+' – '+fm(m.a)).join('<br>')||'még nincs')+'</div></div>';
 $('x13dGc').onclick=()=>{const a=Math.floor(+$('x13dGa').value||0);if(a<1000||a>5000000){toast('1 000 – 5 000 000 Ft között!','#ef4444');return}if(!hasS()||S.c<a){toast('Nincs elég Ft!','#ef4444');return}addFt(-a);const code=makeGift(a,$('x13dGm').value.trim());const g=GS();g.mine.push({c:code,a,t:Date.now()});g.used.push(parseGift(code).key);LS.s(K.gift,g);$('x13dGo2').textContent=code;try{navigator.clipboard.writeText(code)}catch(e){}toast('🎁 Kód kész (vágólapra másolva)')};
 $('x13dGv').onclick=()=>{const p=parseGift($('x13dGr').value);if(!p){toast('Érvénytelen kód!','#ef4444');return}const g=GS();if(g.used.includes(p.key)){toast('Ezt a kódot már beváltották (vagy te készítetted).','#ef4444');return}g.used.push(p.key);LS.s(K.gift,g);addFt(p.amt);toast('🎁 +'+fm(p.amt)+(p.msg?' · „'+p.msg+'”':''));openP()}},
save(b){b.innerHTML='<h2>☁️ Mentés / betöltés</h2><div class="x13d-m">Az összes játékállás (minden k3* kulcs) egy kódba vagy fájlba. Másik gépen/böngészőben visszatölthető.</div><div class="x13d-c"><button class="x13d-b" id="x13dEx">Kód készítése</button><button class="x13d-b g" id="x13dEf">💾 Letöltés fájlba</button><textarea class="x13d-in" id="x13dEt" rows="5" readonly style="margin-top:8px"></textarea></div><div class="x13d-c"><b>Visszatöltés</b><textarea class="x13d-in" id="x13dIt" rows="4" placeholder="Illeszd be a KPR1.… kódot" style="margin-top:8px"></textarea><button class="x13d-b" id="x13dIm">Betöltés kódból</button><label class="x13d-b g">📂 Fájlból<input type="file" id="x13dIf" accept=".txt,.kpr" style="display:none"></label><div class="x13d-m">⚠ A betöltés felülírja a jelenlegi állást, utána az oldal újratölt.</div></div>';
 $('x13dEx').onclick=()=>{const c=exportCode();$('x13dEt').value=c;try{navigator.clipboard.writeText(c)}catch(e){}toast('☁️ Mentéskód kész ('+Math.round(c.length/1024)+' KB)')};
 $('x13dEf').onclick=()=>{sv();dl('kozpenz_mentes_'+new Date().toISOString().slice(0,10)+'.kpr',exportCode())};
 const doImp=s=>{try{if(!confirm('Felülírod a jelenlegi mentést?'))return;const n=importCode(s);toast('✔ '+n+' kulcs betöltve – újratöltés…','#22c55e');setTimeout(()=>location.reload(),900)}catch(e){toast('Hibás kód: '+e.message,'#ef4444')}};
 $('x13dIm').onclick=()=>doImp($('x13dIt').value);$('x13dIf').onchange=e=>{const f=e.target.files[0];if(f)f.text().then(doImp)}},
ann(b){const a=AN(),l=LS.g(K.load,{on:1,mg:1});const sw=(id,on,t)=>'<label style="display:block;margin:8px 0;cursor:pointer"><input type="checkbox" id="'+id+'" '+(on?'checked':'')+'> '+t+'</label>';
 b.innerHTML='<h2>🎙️ Bemondó & betöltés</h2><div class="x13d-c">'+sw('x13dA1',a.on,'Szöveges kommentátor (meccskezdés, első kiesés, 10/3 ellenfél, kritikus HP, pénz-mérföldkövek, meccsvége)')+sw('x13dA2',a.voice,'Hangos bemondás (böngésző beszédszintézis, magyar)')+'<button class="x13d-b g" id="x13dAt">Próba</button></div><div class="x13d-c">'+sw('x13dL1',l.on,'Prémium betöltési képernyő tippekkel')+sw('x13dL2',l.mg,'Érmegyűjtő minijáték a betöltés alatt (+150 Ft/érme)')+'<button class="x13d-b g" id="x13dLt">Előnézet</button></div>';
 const up=()=>{LS.s(K.ann,{on:+$('x13dA1').checked,voice:+$('x13dA2').checked});LS.s(K.load,{on:+$('x13dL1').checked,mg:+$('x13dL2').checked})};
 ['x13dA1','x13dA2','x13dL1','x13dL2'].forEach(i=>$(i).onchange=up);$('x13dAt').onclick=()=>annSay('Ez egy próba bemondás. Hajrá!',1);$('x13dLt').onclick=()=>{closeP();showLoad(()=>{})}},
bug(b){b.innerHTML='<h2>🐞 Hibajelentés</h2><div class="x13d-m">Írd le a hibát; a letöltött txt tartalmazza az eddig elkapott konzolhibákat ('+ERR.length+' db) és a rendszeradatokat. Nem küldünk el semmit automatikusan.</div><div class="x13d-c"><input class="x13d-in" id="x13dBt" placeholder="Rövid cím"><textarea class="x13d-in" id="x13dBd" rows="5" placeholder="Mi történt? Hogyan lehet előidézni?" style="margin-top:8px"></textarea><button class="x13d-b" id="x13dBg">⬇ Jelentés letöltése (.txt)</button></div><div class="x13d-c"><b>Elkapott hibák</b><pre style="max-height:180px;overflow:auto;font-size:11px;color:#fca5a5;white-space:pre-wrap">'+(ERR.slice(-30).join('\n').replace(/</g,'&lt;')||'nincs')+'</pre></div>';
 $('x13dBg').onclick=()=>{const t=['KÖZPÉNZ ROYALE – HIBAJELENTÉS','Idő: '+new Date().toLocaleString('hu-HU'),'Cím: '+$('x13dBt').value,'','Leírás:',$('x13dBd').value,'','Böngésző: '+navigator.userAgent,'Képernyő: '+innerWidth+'x'+innerHeight+' @'+devicePixelRatio,'Mód: '+(window.GAME_MODE||'royale')+' · Lv '+(hasS()?S.lv:'?'),'','Konzolhibák ('+ERR.length+'):'].concat(ERR).join('\r\n');dl('hibajelentes_'+Date.now()+'.txt',t);toast('🐞 Jelentés letöltve')}}
};

// ---------- 1. prestige bónusz + jelvény ----------
{const oe=window.end;if(typeof oe==='function')window.end=function(win){const g=typeof G!=='undefined'?G:null;const pr=LS.g(K.pr,0);if(g&&!g.over&&pr>0&&g.cash>0)g.cash*=1+pr*.05;return oe.apply(this,arguments)}}
function badge(){const pr=LS.g(K.pr,0),bt=$('x13dBtn');if(!bt)return;let s=bt.querySelector('.x13d-pb');if(pr){if(!s){s=document.createElement('span');s.className='x13d-pb';bt.appendChild(s)}s.textContent='P'+pr}else if(s)s.remove()}

// ---------- lebegő gomb ----------
const btn=document.createElement('button');btn.id='x13dBtn';btn.title='Haladás & kényelem (F8)';btn.innerHTML='📈<small>HALADÁS</small>';btn.onclick=()=>openP();document.body.appendChild(btn);badge();
setInterval(()=>{const m=$('menu');const vis=!!(m&&m.offsetParent!==null&&getComputedStyle(m).display!=='none')&&!(typeof run!=='undefined'&&run);const d=vis?'block':'none';if(btn.style.display!==d)btn.style.display=d},700);
document.addEventListener('keydown',e=>{if(e.code==='F8'){e.preventDefault();if(ov&&ov.style.display==='flex')closeP();else openP()}else if(e.code==='Escape'&&ov&&ov.style.display==='flex'){closeP()}});

window._x13d={openP,closeP,showLoad,exportCode,importCode,makeGift,parseGift,annSay,ERR,W,P};
})();
