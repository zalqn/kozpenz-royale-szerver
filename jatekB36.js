// jatekB36.js – B ügynök: 📈 ritka INFLÁCIÓS esemény (kategóriánként változó árak, 3 napig) + 🛡️ BIZTOSÍTÁS jármű- és telek-kárra
// Árfüggvény a B-boltoknak: _b36.P(kat, alapár). Kulcsok: k3b36infl, k3b36ins. Csak játékbeli pénz.
(function(){
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft',SS=()=>typeof S!=='undefined'?S:null,tell=t=>{try{say(t)}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10),DAY=864e5;
const CAT={butor:'🛋️ Lakberendezés',ruha:'👕 Ruhák, keretek',skin:'✨ Skinek',verseny:'🃏 Nevezési díjak',biztositas:'🛡️ Biztosítás'};
// ---------- 18) INFLÁCIÓ ----------
let IN=LS('k3b36infl',{roll:'',until:0,m:{},name:''});
const NAMES=['Kiskapu-infláció','Kampányköltés-hullám','Árstop-utóhatás','Tenderdrágulás','Rezsi-sokk'];
function roll(force){const d=today();if(!force&&IN.roll===d)return;IN.roll=d;
 if(force||Math.random()<.12){IN.until=Date.now()+3*DAY;IN.name=NAMES[Math.random()*NAMES.length|0];IN.m={};Object.keys(CAT).forEach(k=>{IN.m[k]=+(.85+Math.random()*.5).toFixed(2)});
  setTimeout(()=>banner(),2500)}SV('k3b36infl',IN)}
const active=()=>IN.until>Date.now();
function P(cat,n){if(!active())return n;return Math.round(n*(IN.m[cat]||1)/50)*50||n}
function banner(){if(!active())return;const b=document.createElement('div');b.style.cssText='position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:100001;background:#7f1d1d;border:2px solid #fca5a5;color:#fff;border-radius:12px;padding:10px 16px;font:600 14px system-ui;max-width:calc(100% - 32px);box-shadow:0 8px 30px #000a;cursor:pointer';
 b.innerHTML='📈 <b>'+IN.name+'!</b> 3 napig változnak az árak: '+Object.entries(IN.m).map(([k,v])=>CAT[k]+' '+(v>=1?'+':'')+Math.round((v-1)*100)+'%').join(' · ')+' <small>(katt: bezár)</small>';b.onclick=()=>b.remove();document.body.appendChild(b);setTimeout(()=>b.remove(),15000)}
setTimeout(()=>roll(false),4000);
// ---------- 17) BIZTOSÍTÁS ----------
let INS=LS('k3b36ins',{veh:0,tel:0,claims:[],lastEv:0});
const PLAN={veh:{n:'🚗 Jármű-casco',base:4000,per:1500,cov:.9},tel:{n:'🏘️ Telek-/ingatlanbiztosítás',base:3000,per:1200,cov:.85}};
const own=()=>{let v=[],t=[];try{v=window._jm2?_jm2.own():[]}catch(e){}try{const s=window._cp3&&_cp3.s;if(s&&s.parcels)t=s.parcels.filter(p=>p.owner===s.me)}catch(e){}return{v,t}};
const premium=k=>{const o=own(),n=k==='veh'?o.v.length:o.t.length;return P('biztositas',PLAN[k].base+PLAN[k].per*Math.max(0,n-1))};
const insured=k=>INS[k]>Date.now();
function buy(k){const s=SS();const pr=premium(k);if(!s||(s.c||0)<pr){tell('Nincs elég pénzed ('+fmt(pr)+')');return false}s.c-=pr;try{save()}catch(e){}INS[k]=Math.max(Date.now(),INS[k])+7*DAY;SV('k3b36ins',INS);tell('🛡️ '+PLAN[k].n+' megkötve 7 napra ('+fmt(pr)+')');return true}
const EV={veh:[['🧊 Jégeső horpasztotta a kocsit',6000,14000],['🚧 Parkolási koccanás',3000,9000],['💥 Jármű-robbanás',15000,40000]],tel:[['💧 Csőtörés a telken',5000,16000],['🌪️ Viharkár a tetőn',8000,22000],['🔓 Betörés a raktárba',4000,12000]]};
function damage(k,force,evIdx){const o=own();const has=k==='veh'?o.v.length:o.t.length;if(!has&&!force)return null;const L=EV[k],e=L[evIdx!=null?evIdx:Math.random()*(L.length-1)|0];const cost=Math.round((e[1]+Math.random()*(e[2]-e[1]))/100)*100;
 const s=SS();let pay=cost,msg;if(insured(k)){pay=Math.round(cost*(1-PLAN[k].cov));msg=e[0]+': kár '+fmt(cost)+' – a biztosító fizet, önrész: '+fmt(pay)}else msg=e[0]+': kár '+fmt(cost)+' – nincs biztosításod!';
 if(s){s.c=Math.max(0,(s.c||0)-pay);try{save()}catch(er){}}INS.claims.unshift({t:Date.now(),k,n:e[0],cost,pay});INS.claims=INS.claims.slice(0,15);SV('k3b36ins',INS);tell('🛡️ '+msg);return{cost,pay}}
// ritka véletlen káresemény (játékidő alatt, max. 1 / 2 óra)
setInterval(()=>{if(document.hidden||Date.now()-INS.lastEv<2*36e5)return;if(Math.random()<.04){const k=Math.random()<.5?'veh':'tel';if(damage(k)){INS.lastEv=Date.now();SV('k3b36ins',INS)}}},60000);
// járműrobbanás a játékos közelében → jármű-kár
(function wrapBoom(){const o=window._x14hBoomFx;if(typeof o!=='function'){setTimeout(wrapBoom,1500);return}let last=0;window._x14hBoomFx=function(v){const r=o.apply(this,arguments);try{const g=typeof G!=='undefined'?G:null;if(g&&v&&Date.now()-last>60000&&Math.hypot((v.x||0)-g.x,(v.z||0)-g.z)<8&&own().v.length){last=Date.now();damage('veh',false,2)}}catch(e){}return r}})();
// ---------- UI ----------
const pan=document.createElement('div');pan.style.cssText='position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:#000b;font:14px system-ui;color:#e2e8f0';document.body.appendChild(pan);
const btn='background:#1e293b;color:#fff;border:2px solid #334155;border-radius:9px;padding:6px 11px;margin:3px;cursor:pointer';
function open(){const o=own();pan.style.display='flex';pan.innerHTML='<div style="background:#0f172a;border:2px solid #38bdf8;border-radius:14px;padding:16px;max-width:600px;width:calc(100% - 32px);max-height:90vh;overflow:auto"><h2>🛡️ Biztosító – Kiskapu Biztosító Zrt.</h2>'+
 Object.entries(PLAN).map(([k,p])=>'<div style="border:1px solid #334155;border-radius:10px;padding:8px;margin:6px 0"><b>'+p.n+'</b> – fedezet '+Math.round(p.cov*100)+'% · '+(k==='veh'?o.v.length+' jármű':o.t.length+' telek')+'<br>'+(insured(k)?'✅ Érvényes eddig: '+new Date(INS[k]).toLocaleString('hu-HU'):'❌ Nincs érvényes biztosítás')+'<br><button data-b="'+k+'" style="'+btn+'">'+(insured(k)?'Hosszabbítás':'Megkötés')+' 7 napra: '+fmt(premium(k))+'</button></div>').join('')+
 '<h3>📈 Árak</h3><div style="font-size:13px">'+(active()?'<b>'+IN.name+'</b> – vége: '+new Date(IN.until).toLocaleString('hu-HU')+'<br>'+Object.entries(IN.m).map(([k,v])=>CAT[k]+': '+(v>=1?'+':'')+Math.round((v-1)*100)+'%').join('<br>'):'Az árak most normálisak. (Ritka inflációs esemény bármikor jöhet.)')+'</div>'+
 '<h3>📋 Kárnapló</h3><div style="font-size:12px">'+(INS.claims.length?INS.claims.map(c=>new Date(c.t).toLocaleDateString('hu-HU')+' '+c.n+': '+fmt(c.cost)+' → fizetett: '+fmt(c.pay)).join('<br>'):'Még nem volt kár.')+'</div><button id="b36x" style="'+btn+'">✖ Bezár</button></div>';
 pan.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{if(buy(b.dataset.b))open()});pan.querySelector('#b36x').onclick=()=>pan.style.display='none'}
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}_lb2.add({ic:'🛡️',hu:'Biztosítás',tx:'Biztosítás',c:'shop',fn:open,kw:'biztositas kar jarmu telek inflacio ar'})})();
window._b36={P,roll:()=>roll(true),active,IN:()=>IN,INS:()=>INS,buy,damage,open,premium};
})();
