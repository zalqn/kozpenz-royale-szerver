// ===== SOTET100.JS: 🧠 ALVILÁG+ – a 100 ötletes lista a Sötét Programhoz (kitalált, játékbeli) =====
// Az eladásokat (D.stats.sold/earned + D.log[0]) és a napváltást (D.day) figyeli, a sotetprogram.js-hez nem nyúl.
(function(){
const api=()=>{try{return _dp()}catch(e){return null}};
const R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const FN=['Bence','Réka','Laci','Zsófi','Tomi','Kata','Gergő','Panni','Feri','Nóri','Ödön','Lili','Marci','Vera','Pisti','Dóri'];
const LN=['Kósza','Szeles','Morcos','Vidám','Csendes','Pörgős','Álmos','Fürge'];
const PREF={q:'⭐ minőség',p:'💲 olcsó ár',s:'⚡ gyorsaság'};
const BG={csal:['👨‍👩‍👧 Családi vállalkozó','+15% vevői hűség'],egy:['🎓 Kémia szakos','+10% minőség hígításnál'],utc:['🧢 Utcagyerek','−10% hő eladáskor'],uzl:['💼 Volt üzletember','+8% nagyker ár']};
const SK={targy:['🗣️ Tárgyalás','+2% eladási ár / szint'],lopo:['🥷 Lopakodás','−3% hő / szint'],fut:['🏃 Futás','+4% menekülés / szint'],vez:['🚗 Vezetés','−1 energia fuvarnál / szint'],meggy:['🎭 Meggyőzés','+3% hűség / szint']};
const UNITS=[[0,'🚶 Járőr'],[30,'🕵️ Civil nyomozó'],[50,'🚁 Drónos egység'],[70,'🧪 Kábszeres osztag'],[88,'🛡️ Bevetési egység']];
const TR={gy:['🚶 Gyalog',0,0],bi:['🚲 Bicikli',-2,.02],au:['🚗 Autó',-4,.06],bkv:['🚋 Villamos',-3,-.02]};
const SIDE=[['📦 Vidd el a csomagot a Kikötőbe',1800,8],['🧾 Hamisíts számlát a pályázathoz',1400,4],['🐕 Keresd meg Ödön elszökött kutyáját',900,1],['🎂 Szállíts tortát a Villanegyedbe (tényleg torta)',700,0],['📸 Fotózd le a rivális raktárát',2200,10],['🎤 Énekelj a karaokén a banda előtt',600,0]];
const RIV=[['🐺','Fekete Fecó'],['🦊','Rozsdás Rudi'],['🐍','Sima Sanyi']];
let X=null;
function st(){const d=api();if(!d)return null;const D=d.D;if(!D.x1)D.x1={};const x=D.x1;
 const def={v:1,px:d.DIS.map(()=>1),inf:1,news:[],cust:[],loan:0,loanD:0,cred:[],sus:d.DIS.map(()=>0),cam:d.DIS.map(()=>Math.random()<.25),safe:{},drop:0,tr:'gy',sk:{targy:0,lopo:0,fut:0,vez:0,meggy:0},skp:0,xp:0,str:0,bg:null,mor:0,und:0,rel:{},side:[],path:null,day:D.day,sold:D.stats.sold,earned:D.stats.earned,hist:[],notif:[],cap:60,rot:0,tut:0,slot:0,rivp:RIV.map(()=>R(.85,1.15))};
 for(const k in def)if(x[k]===undefined)x[k]=def[k];if(!x.cust.length)x.cust=genCust(10);if(!x.side.length)x.side=genSide();return{d,D,x}}
function genCust(n){const a=[];for(let i=0;i<n;i++)a.push(newCust());return a}
function newCust(vip){return{n:pick(FN)+' '+pick(LN),e:pick(['🧑','👩','👨','🧔','👵','🧑‍🎤','🧑‍💼']),pr:pick(['q','p','s']),loy:RI(10,40),mood:RI(50,90),vip:vip||Math.random()<.12,inf:Math.random()<.1,known:false,story:0,owe:0,last:0}}
function genSide(){return[0,1,2].map(()=>{const s=pick(SIDE);return{t:s[0],r:s[1]*R(.8,1.3)|0,h:s[2],done:0}})}
const note=(x,t)=>{x.notif.unshift(t);x.notif.length=Math.min(x.notif.length,30);try{api().toast(t)}catch(e){}};
const lvSk=(x,k)=>x.sk[k]||0;
// ---------- ELADÁS-FIGYELŐ: utólagos árkorrekció (dinamikus ár, minőség, skill, közlekedés, kamera, besúgó) ----------
function onSale(s,dSold,dEarn){const{d,D,x}=s;const L=D.log[0]||'';const di=Math.max(0,d.DIS.findIndex(z=>L.includes(z[0])));
 let f=x.px[di]*x.inf*(1+lvSk(x,'targy')*.02)*(x.path==='nagy'?1.05:x.path==='kicsi'?.92:1)*(x.bg==='uzl'?1.02:1);
 const adj=Math.round(dEarn*(f-1));if(adj){D.dirty=Math.max(0,(D.dirty||0)+adj)}
 x.px[di]=cl(x.px[di]-dSold*.015,.55,1.8);// kínálat → ár csökken
 let h=TR[x.tr][2]+(x.cam[di]?.04:0)-lvSk(x,'lopo')*.03-(x.bg==='utc'?.1:0)-(x.path==='kicsi'?.15:0);x.sus[di]=cl(x.sus[di]+dSold*3,0,100);
 if(h)d.heat(Math.max(-3,h*dSold*4));
 x.xp+=dSold;while(x.xp>=10){x.xp-=10;x.skp++;note(x,'🎓 Új képességpont!')}x.und+=dSold*.5;x.str=cl(x.str+dSold*1.5+D.heat/40,0,100);
 const c=pick(x.cust);if(c){c.loy=cl(c.loy+3,0,100);c.last=D.day}
 x.hist.push({t:D.day,e:dEarn+adj});if(x.hist.length>60)x.hist.shift()}
// ---------- NAPVÁLTÁS ----------
function onDay(s){const{d,D,x}=s;const N=[];
 x.inf=+(x.inf*(1+R(-.004,.012))).toFixed(4);
 const season=[1.1,1,.95,1.15][Math.floor(((new Date().getMonth()+1)%12)/3)];
 x.px=x.px.map((p,i)=>cl(p+(1-p)*.3+R(-.08,.08)+(season-1)*.2-(x.rivp[i%3]<1?.03:0),.55,1.8));
 x.rivp=x.rivp.map(v=>cl(v+R(-.06,.06),.75,1.25));
 if(Math.random()<.5){const i=RI(0,d.DIS.length-1),up=Math.random()<.5;x.px[i]=cl(x.px[i]*(up?1.25:.8),.55,1.8);N.push((up?'📈 ':'📉 ')+d.DIS[i][0]+': '+(up?'nagy a kereslet (fesztivál)':'túlkínálat – Rudi dömpingel'))}
 x.sus=x.sus.map(v=>Math.max(0,v-8));x.str=Math.max(0,x.str-10);
 // hitelek
 if(x.loan>0){x.loan=Math.round(x.loan*1.05);x.loanD++;if(x.loanD>7){const t=Math.min(x.loan,D.dirty||0);D.dirty-=t;x.loan-=t;D.en=Math.max(0,D.en-30);N.push('💢 A behajtó meglátogatott: −'+fmt(t)+', −30 energia');x.loanD=4}}
 x.cred=x.cred.filter(c=>{if(--c.d>0)return true;if(Math.random()<.75){D.dirty+=c.a;N.push('✅ '+c.n+' megadta a tartozást: +'+fmt(c.a))}else N.push('❌ '+c.n+' nem fizetett ('+fmt(c.a)+')');return false});
 // vevők
 x.cust.forEach(c=>{c.mood=cl(c.mood+(D.day-c.last>2?-12:4),0,100);if(c.mood<15&&Math.random()<.5){c.gone=1}});
 const gone=x.cust.filter(c=>c.gone).length;x.cust=x.cust.filter(c=>!c.gone);if(gone)N.push('🚪 '+gone+' vevő más dílerhez ment');
 const ref=x.cust.filter(c=>c.loy>70).length;if(ref&&Math.random()<.5&&x.cust.length<18){x.cust.push(newCust());N.push('🤝 Ajánlás: új vevő jött')}
 if(Math.random()<.15&&x.cust.length<18){x.cust.push(newCust(true));N.push('💎 Új VIP ügyfél!')}
 // razzia-előrejelzés (kapcsolat a rendőrségen)
 if((x.rel.zsaru||0)>=30&&D.heat>45)N.push('📞 Tipp a belsőstől: holnap razzia lehet – csökkentsd a hőt!');
 // romlás + lopás a raktárból
 const sh=x.safe.raktar?0:.04;Object.keys(D.inv).forEach(k=>{const p=d.ITM[k];if(p&&p.t==='pr'&&D.inv[k]>0&&Math.random()<sh){D.inv[k]--;N.push('🐀 Elromlott/eltűnt 1× '+p.n)}});
 // rivális lépés + média
 const r=pick(RIV);if(Math.random()<.35)N.push(r[0]+' '+r[1]+' '+pick(['árcsökkentést hirdetett','új futárokat vett fel','elvesztett egy raktárt','beszólt rólad a piacon']));
 if(D.stats.sold>40&&Math.random()<.3)N.push('📰 Közpénz Napló: „Rejtélyes kék tinta árasztja el a várost”');
 x.side=genSide();x.mor=cl(x.mor,-100,100);
 // börtön: ha a buktak száma nőtt, rövid „cella” – pénz helyett energia
 x.news=N.concat(x.news).slice(0,25);N.forEach(t=>note(x,t))}
function tick(){const s=st();if(!s)return;const{D,x}=s;X=s;
 if(D.stats.sold>x.sold){onSale(s,D.stats.sold-x.sold,D.stats.earned-x.earned)}x.sold=D.stats.sold;x.earned=D.stats.earned;
 if(D.day>x.day){for(let i=x.day;i<D.day&&i<x.day+5;i++)onDay(s);x.day=D.day}
 if(x.str>=90&&!x._sw){x._sw=1;note(x,'😰 Túl sok a stressz! Menj buliba vagy pihenj.')}else if(x.str<70)x._sw=0;
 s.d.save()}
setInterval(tick,1500);
// ---------- AKCIÓK ----------
function serve(i){const s=st();const{d,D,x}=s;const c=x.cust[i];if(!c)return;
 const prods=Object.keys(D.inv).filter(k=>d.ITM[k]&&d.ITM[k].t==='pr'&&D.inv[k]>0);if(!prods.length)return d.toast('Nincs eladható terméked!');
 if(!d.useEnergy(Math.max(3,8-lvSk(x,'vez'))))return;
 const pid=prods.sort((a,b)=>(c.pr==='q'?(D.inv[b+'_q']||50)-(D.inv[a+'_q']||50):c.pr==='p'?d.ITM[a].p-d.ITM[b].p:0))[0],q=(D.inv[pid+'_q']||50)/100;
 let price=d.ITM[pid].p*(c.vip?2.2:1.2)*(.6+q*.8)*(1+c.loy/200)*(1+lvSk(x,'targy')*.02)*x.inf;
 if(c.pr==='q'&&q<.4){c.mood-=25;c.loy-=10;price*=.5;note(x,'😠 '+c.n+' panaszkodott a minőségre – visszatérítettél felet')}
 if(c.pr==='s')price*=x.tr==='au'||x.tr==='bi'?1.15:.9;
 d.addI(pid,-1);D.dirty+=Math.round(price);D.stats.sold++;D.stats.earned+=Math.round(price);x.sold++;x.earned+=Math.round(price);
 c.loy=cl(c.loy+5+lvSk(x,'meggy')*3*(x.bg==='csal'?1.15:1),0,100);c.mood=cl(c.mood+10,0,100);c.last=D.day;c.story++;
 if(c.inf){d.heat(12);x.sus.forEach((v,j)=>x.sus[j]=v+5);if(c.story>=2&&!c.known){c.known=1;note(x,'🕵️ '+c.n+' BESÚGÓ! Lebukott – kerüld!')}else note(x,'🤨 '+c.n+' furcsán sok kérdést tett fel…')}
 else d.heat(.6);d.log('🤝 '+c.n+' vett 1× '+d.ITM[pid].n+': '+fmt(price));if(c.story===3)note(x,'📖 '+c.n+' elmesélte az élettörténetét – hűsége nő');x.xp++;d.save();render()}
function credit(i){const s=st();const{d,D,x}=s;const c=x.cust[i];const pid=Object.keys(D.inv).find(k=>d.ITM[k]&&d.ITM[k].t==='pr'&&D.inv[k]>0);if(!pid)return d.toast('Nincs termék!');
 d.addI(pid,-1);const a=Math.round(d.ITM[pid].p*1.6*x.inf);x.cred.push({n:c.n,a,d:3});note(x,'📒 Hitelre adtál '+c.n+'-nak: '+fmt(a)+' (3 nap)');d.save();render()}
function bulk(){const s=st();const{d,D,x}=s;let t=0,n=0;Object.keys(D.inv).forEach(k=>{const p=d.ITM[k];if(p&&p.t==='pr'&&D.inv[k]>0){const q=(D.inv[k+'_q']||50)/100;t+=D.inv[k]*p.p*.7*(.6+q*.8)*(x.bg==='uzl'?1.08:1);n+=D.inv[k];D.inv[k]=0}});
 if(!n)return d.toast('Üres a raktár.');D.dirty+=Math.round(t);d.heat(n*.8);d.log('🏭 Nagyker: '+n+' egység – '+fmt(t));note(x,'🏭 Nagyker eladás: +'+fmt(t));d.save();render()}
function dilute(){const s=st();const{d,D,x}=s;let n=0;Object.keys(D.inv).forEach(k=>{const p=d.ITM[k];if(p&&p.t==='pr'&&D.inv[k]>0){const add=Math.ceil(D.inv[k]*.5);D.inv[k]+=add;n+=add;D.inv[k+'_q']=Math.max(5,Math.round((D.inv[k+'_q']||50)*(x.bg==='egy'?.83:.75)))}});
 if(!n)return d.toast('Nincs mit hígítani.');x.mor-=5;note(x,'🧂 Hígítottál: +'+n+' egység, rosszabb minőség');d.save();render()}
function loan(a){const s=st();const{d,D,x}=s;if(x.loan>0)return d.toast('Előbb fizesd vissza a régit!');x.loan=a;x.loanD=0;D.dirty+=a;note(x,'💰 Uzsorahitel: +'+fmt(a)+' (napi 5%)');d.save();render()}
function repay(){const s=st();const{d,D,x}=s;const t=Math.min(x.loan,D.cash);D.cash-=t;x.loan-=t;if(!x.loan)x.loanD=0;note(x,'✅ Visszafizetve: '+fmt(t));d.save();render()}
function bribe(){const s=st();const{d,D,x}=s;const c=Math.round(800+D.heat*60);if(D.cash<c)return d.toast('Kevés a pénz a kenőpénzhez.');D.cash-=c;d.heat(-Math.min(D.heat,25));x.rel.zsaru=(x.rel.zsaru||0)+10;x.mor-=8;note(x,'🤫 Kenőpénz: −'+fmt(c)+', −25 hő');d.save();render()}
function snitch(){const s=st();const{d,D,x}=s;if(x._sn===D.day)return d.toast('Ma már beszéltél a nyomozóval.');x._sn=D.day;d.heat(-20);x.und=Math.max(0,x.und-25);x.mor-=10;note(x,'🐀 Feladtad Rudi raktárát: −20 hő, de az alvilág hírneve csökkent');d.save();render()}
function buySafe(k,c){const s=st();const{d,D,x}=s;if(x.safe[k])return;if(D.cash<c)return d.toast('Nincs elég pénz!');D.cash-=c;x.safe[k]=1;note(x,'🏠 Megvetted: '+k);d.save();render()}
function dropIn(a){const s=st();const{d,D,x}=s;a=Math.min(a,D.dirty||0);if(!(a>0))return;D.dirty-=a;x.drop+=a;note(x,'🕳️ Drop-pontba rejtve: '+fmt(a)+' (razzia nem viszi)');d.save();render()}
function dropOut(){const s=st();const{d,D,x}=s;D.dirty+=x.drop;note(x,'🕳️ Kivetted: '+fmt(x.drop));x.drop=0;d.save();render()}
function smuggle(){const s=st();const{d,D,x}=s;if(D.cash<5000)return d.toast('5000 Ft kell a csempészútra.');if(!d.useEnergy(25))return;D.cash-=5000;
 if(Math.random()<.22+D.heat/300-lvSk(x,'fut')*.04){d.heat(15);note(x,'🚧 A határon elkaptak – a szállítmány elveszett, +15 hő')}else{const raw=d.IT.filter(i=>i.t==='raw'||i.t==='ing'||i.t==='a');const n=RI(8,14);for(let i=0;i<n;i++){const it=pick(raw.length?raw:d.IT);d.addI(it.id,1)}note(x,'🚚 Csempészút sikeres: +'+n+' alapanyag olcsón')}d.save();render()}
function doSide(i){const s=st();const{d,D,x}=s;const q=x.side[i];if(!q||q.done)return;if(!d.useEnergy(15))return;q.done=1;D.dirty+=q.r;if(q.h)d.heat(q.h);x.und+=3;note(x,'✅ Mellékküldetés kész: +'+fmt(q.r));d.save();render()}
function party(){const s=st();const{d,D,x}=s;if(D.cash<1500)return d.toast('1500 Ft kell.');D.cash-=1500;x.str=Math.max(0,x.str-40);D.en=Math.min(150,D.en+10);note(x,'🪩 Kiengedtél: −40 stressz');d.save();render()}
function skill(k){const s=st();const{x}=s;if(x.skp<1||x.sk[k]>=5)return;x.skp--;x.sk[k]++;s.d.save();render()}
function setBg(k){const s=st();if(s.x.bg)return;s.x.bg=k;s.d.save();render()}
function setPath(k){const s=st();s.x.path=k;s.d.save();render()}
function setTr(k){const s=st();s.x.tr=k;s.d.save();render()}
function relUp(k,c){const s=st();const{d,D,x}=s;if(D.cash<c)return d.toast('Nincs elég pénz.');D.cash-=c;x.rel[k]=(x.rel[k]||0)+15;note(x,'🎁 Ajándék → '+k);d.save();render()}
// mentési helyek (3) a k3dp-ről
function slot(i,save){const s=st();const key='k3dp_slot'+i;if(save){try{localStorage.setItem(key,JSON.stringify(s.D));note(s.x,'💾 Mentve: '+(i+1)+'. hely')}catch(e){}}else{const v=localStorage.getItem(key);if(!v)return s.d.toast('Üres hely');if(!confirm('Betöltöd a(z) '+(i+1)+'. mentést? A jelenlegi Sötét Program állás felülíródik.'))return;localStorage.setItem('k3dp',v);location.reload()}}
// ---------- PANEL ----------
let TAB='piac',myOn=false;
const unit=h=>UNITS.filter(u=>h>=u[0]).pop()[1];
function chart(x){const h=x.hist.slice(-30);if(!h.length)return '<small>Még nincs adat.</small>';const m=Math.max(...h.map(v=>v.e),1);return '<svg viewBox="0 0 300 60" width="100%" height="60">'+h.map((v,i)=>'<rect x="'+(i*10)+'" y="'+(60-v.e/m*56)+'" width="8" height="'+(v.e/m*56)+'" fill="#facc15"/>').join('')+'</svg>'}
function render(){const s=st(),r=document.getElementById('dp');if(!s||!r)return;const M=r.querySelector('#dpmain');if(!M)return;const{d,D,x}=s;myOn=true;
 r.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.id==='x1Nav'));const sub=r.querySelector('nav.sub');if(sub)sub.style.display='none';
 const tabs=[['piac','💹 Piac'],['vevo','🧑‍🤝‍🧑 Vevők'],['zsaru','🚓 Rendőrség'],['ter','🏠 Terület'],['karr','🎓 Karrier'],['log','🚚 Logisztika'],['tort','📖 Történet'],['stat','📊 Stat & mentés']];
 let h='<div class="spxT x1T"><div class="row" style="flex-wrap:wrap">'+tabs.map(t=>'<button class="'+(TAB===t[0]?'':'s')+'" data-x1t="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>'+
 '<div class="c" style="margin:6px 0">💵 Piszkos: <b>'+fmt(D.dirty||0)+'</b> · 🔥 Hő: <b>'+Math.round(D.heat)+'</b> ('+unit(D.heat)+') · 😰 Stressz: <b>'+Math.round(x.str)+'</b> · 🕶️ Alvilági hírnév: <b>'+Math.round(x.und)+'</b> · ⚖️ Moralitás: <b>'+x.mor+'</b></div>';
 if(TAB==='piac')h+='<h3>💹 Kerületi árindex (kereslet/kínálat, szezon, rivális dömping) · infláció ×'+x.inf.toFixed(3)+'</h3><div class="g">'+d.DIS.map((z,i)=>'<div class="c">'+z[1]+' <b>'+z[0]+'</b><br>×'+x.px[i].toFixed(2)+' '+(x.px[i]>1.1?'📈':x.px[i]<.9?'📉':'➖')+(x.cam[i]?'<br><span class="pill">📹 kamerás zóna</span>':'')+'</div>').join('')+'</div>'+
  '<h3>🐺 Rivális dílerek árszintje</h3><div class="row">'+RIV.map((v,i)=>'<span class="pill">'+v[0]+' '+v[1]+': ×'+x.rivp[i].toFixed(2)+'</span>').join('')+'</div>'+
  '<h3>🏭 Nagyker / 🧂 hígítás / 💰 hitel</h3><div class="row"><button data-a="bulk">🏭 Teljes raktár nagykerbe (70%)</button><button class="s" data-a="dil">🧂 Hígítás (+50% mennyiség, −25% minőség)</button></div>'+
  '<div class="row">'+(x.loan>0?'<span class="pill">Tartozás: '+fmt(x.loan)+' · '+x.loanD+'. nap (7 után behajtó)</span><button data-a="repay">Visszafizetés</button>':'<button class="s" data-l="10000">Uzsora 10 000</button><button class="s" data-l="50000">Uzsora 50 000</button>')+'</div>'+
  '<h3>📰 Feketepiaci hírek</h3><div class="c">'+(x.news.slice(0,8).join('<br>')||'–')+'</div>';
 if(TAB==='vevo')h+='<h3>🧑‍🤝‍🧑 Vevőid ('+x.cust.length+') – hűség, hangulat, preferencia</h3><div class="g">'+x.cust.map((c,i)=>'<div class="c">'+c.e+' <b>'+c.n+'</b>'+(c.vip?' 💎':'')+(c.known?' 🕵️':'')+'<br><span class="pill">'+PREF[c.pr]+'</span><span class="pill">❤️ '+c.loy+'</span><span class="pill">'+(c.mood>60?'🙂':c.mood>30?'😐':'😠')+' '+c.mood+'</span><br><button data-sv="'+i+'">Kiszolgál</button> <button class="s" data-cr="'+i+'">Hitelre</button></div>').join('')+'</div><small>Hűséges vevő ajánl új vevőt; a sokáig kiszolgálatlan vevő elmegy; a besúgók közöttük vannak…</small>'+
  '<h3>📒 Kintlévőségek</h3><div class="c">'+(x.cred.map(c=>c.n+': '+fmt(c.a)+' ('+c.d+' nap)').join('<br>')||'–')+'</div>';
 if(TAB==='zsaru')h+='<h3>🚓 Most rád figyel: '+unit(D.heat)+'</h3><div class="g">'+d.DIS.map((z,i)=>'<div class="c">'+z[1]+' '+z[0]+'<br>Gyanú: <b>'+Math.round(x.sus[i])+'</b>'+(x.sus[i]>60?' ⚠️ no-go':'')+'</div>').join('')+'</div>'+
  '<div class="row"><button data-a="bribe">🤫 Kenőpénz (−25 hő)</button><button class="s" data-a="snitch">🐀 Tanúvallomás a rivális ellen</button></div><small>Belső kapcsolat a rendőrségen: '+(x.rel.zsaru||0)+' (30+ → razzia-előrejelzés)</small>';
 if(TAB==='ter')h+='<h3>🏠 Biztonságos házak & raktárak</h3><div class="row"><button '+(x.safe.lakas?'disabled':'')+' data-sf="lakas" data-c="20000">🏚️ Rejtekhely 20 000</button><button '+(x.safe.raktar?'disabled':'')+' data-sf="raktar" data-c="45000">🏭 Hűtött raktár 45 000 (nincs romlás)</button><button '+(x.safe.villa?'disabled':'')+' data-sf="villa" data-c="150000">🏰 Villa 150 000</button></div>'+
  '<h3>🕳️ Drop-pont: '+fmt(x.drop)+'</h3><div class="row"><button class="s" data-dp="5000">+5000 elrejt</button><button class="s" data-dp="999999999">Mindet elrejt</button><button class="s" data-a="dout">Kivesz</button></div>'+
  '<h3>🚦 Közlekedés</h3><div class="row">'+Object.keys(TR).map(k=>'<button class="'+(x.tr===k?'':'s')+'" data-tr="'+k+'">'+TR[k][0]+'</button>').join('')+'</div><small>Autó: gyors vevőknek jobb, de feltűnőbb. Villamos: a legkevésbé feltűnő.</small>';
 if(TAB==='karr')h+='<h3>🎓 Képességek ('+x.skp+' pont, XP '+x.xp+'/10)</h3><div class="g">'+Object.keys(SK).map(k=>'<div class="c"><b>'+SK[k][0]+'</b> '+x.sk[k]+'/5<br><small>'+SK[k][1]+'</small><br><button '+(x.skp<1||x.sk[k]>=5?'disabled':'')+' data-sk="'+k+'">+1</button></div>').join('')+'</div>'+
  '<h3>🧬 Háttér '+(x.bg?'(végleges)':'(egyszer választható)')+'</h3><div class="row">'+Object.keys(BG).map(k=>'<button class="'+(x.bg===k?'':'s')+'" '+(x.bg?'disabled':'')+' data-bg="'+k+'">'+BG[k][0]+' – '+BG[k][1]+'</button>').join('')+'</div>'+
  '<h3>🛣️ Karrierút</h3><div class="row"><button class="'+(x.path==='kicsi'?'':'s')+'" data-p="kicsi">🤫 Alacsony profil (−15% hő, −8% ár)</button><button class="'+(x.path==='nagy'?'':'s')+'" data-p="nagy">🏙️ Nagybani (+5% ár)</button></div>'+
  '<h3>❤️ Kapcsolatok</h3><div class="row">'+[['csaba','🧥 Csaba'],['rozi','📰 Riporter Rozi'],['zsaru','👮 Belső ember']].map(r=>'<button class="s" data-rl="'+r[0]+'">'+r[1]+': '+(x.rel[r[0]]||0)+' (ajándék 2000)</button>').join('')+'</div>'+
  '<h3>😰 Stressz '+Math.round(x.str)+'/100</h3><button data-a="party">🪩 Kikapcsolódás (1500)</button>';
 if(TAB==='log')h+='<h3>🚚 Logisztika</h3><div class="c">Raktár: '+Object.keys(D.inv).filter(k=>d.ITM[k]&&d.ITM[k].t==='pr').reduce((a,k)=>a+(D.inv[k]||0),0)+' késztermék · tárolás: '+(x.safe.raktar?'❄️ hűtött (nincs romlás)':'🐀 sima (napi 4% romlás/lopás esély)')+'</div>'+
  '<div class="row"><button data-a="smug">🚚 Csempészút a határon (5000, ⚡25)</button></div><small>Futárokat a 🕴️ Banda fülön tudsz felvenni (automatikus kiszállítás).</small>';
 if(TAB==='tort')h+='<h3>📋 Mai mellékküldetések</h3><div class="g">'+x.side.map((q,i)=>'<div class="c">'+q.t+'<br><span class="pill">+'+fmt(q.r)+'</span>'+(q.h?'<span class="pill">+'+q.h+' hő</span>':'')+'<br><button '+(q.done?'disabled':'')+' data-sd="'+i+'">'+(q.done?'✅ Kész':'Indulás (⚡15)')+'</button></div>').join('')+'</div><small>A fő történet a 🎯 Küldetések fülön van (11 fejezet, 5 befejezés).</small>'+
  '<h3>🗞️ Média és értesítések</h3><div class="c" style="max-height:160px;overflow:auto">'+(x.notif.join('<br>')||'–')+'</div>';
 if(TAB==='stat')h+='<h3>📊 Bevétel eladásonként (utolsó 30)</h3><div class="c">'+chart(x)+'</div><div class="c">Eladva: '+D.stats.sold+' · bevétel: '+fmt(D.stats.earned)+' · buktak: '+D.stats.bust+' · nap: '+D.day+'</div>'+
  '<h3>💾 Mentési helyek</h3><div class="row">'+[0,1,2].map(i=>'<button class="s" data-sv1="'+i+'">Mentés '+(i+1)+'</button><button class="s" data-ld="'+i+'">Betölt '+(i+1)+'</button>').join('')+'</div>'+
  (x.tut<1?'<div class="c">💡 Tipp: a vevőid a 🧑‍🤝‍🧑 fülön várnak. A hűséges vevő többet fizet és új vevőt hoz. Figyelj a besúgókra!</div>':'');
 M.innerHTML=h+'</div>';x.tut=1;
 const on=(sel,f)=>M.querySelectorAll(sel).forEach(b=>b.onclick=()=>f(b.dataset));
 on('[data-x1t]',z=>{TAB=z.x1t;render()});on('[data-sv]',z=>serve(+z.sv));on('[data-cr]',z=>credit(+z.cr));on('[data-l]',z=>loan(+z.l));on('[data-sf]',z=>buySafe(z.sf,+z.c));on('[data-dp]',z=>dropIn(+z.dp));
 on('[data-tr]',z=>setTr(z.tr));on('[data-sk]',z=>skill(z.sk));on('[data-bg]',z=>setBg(z.bg));on('[data-p]',z=>setPath(z.p));on('[data-rl]',z=>relUp(z.rl,2000));on('[data-sd]',z=>doSide(+z.sd));
 on('[data-sv1]',z=>slot(+z.sv1,true));on('[data-ld]',z=>slot(+z.ld,false));
 const A={bulk,dil:dilute,repay,bribe,snitch,dout:dropOut,party,smug:smuggle};on('[data-a]',z=>A[z.a]&&A[z.a]())}
function navHook(){const r=document.getElementById('dp');if(!r||r.style.display!=='flex')return;const nav=r.querySelector('nav');if(!nav)return;
 if(!nav.querySelector('#x1Nav')){const b=document.createElement('button');b.id='x1Nav';b.textContent='🧠 Alvilág+';b.onclick=e=>{e.stopPropagation();render()};nav.appendChild(b);
  nav.querySelectorAll('button').forEach(z=>{if(z!==b)z.addEventListener('click',()=>{myOn=false},true)});if(myOn)render()}
 else if(myOn&&!r.querySelector('#dpmain .x1T'))render()}
setInterval(navHook,700);
// razzia: a drop-pont és a rejtekhely véd (a bust utáni piszkos-pénz veszteség részleges visszaadása)
let lastBust=null;setInterval(()=>{const s=st();if(!s)return;const b=s.D.stats.bust;if(lastBust!==null&&b>lastBust&&(s.x.safe.lakas||s.x.safe.villa)){const back=Math.round((s.D.dirty||0)*(s.x.safe.villa?.5:.25));s.D.dirty+=back;note(s.x,'🏠 A rejtekhely megmentett '+fmt(back)+'-ot')}lastBust=b},1500);
window._x1={st,render,serve,bulk,dilute,loan,repay,bribe,snitch,smuggle,onDay:()=>onDay(st()),tick};
})();
