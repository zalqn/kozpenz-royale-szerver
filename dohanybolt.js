// ===== 🏪 FÜSTFELHŐ DOHÁNYBOLT (dohanybolt.js) – belépő bolt a séta módban + mászkáló NPC-k, beszélgetés (E), zsebtolvajlás (F) =====
// • A setal.js bolt-bővítését használja (_setal.shops/THEME/EMO): bal utca, z=28. Pultnál E = Bagó Bella eladó (kitalált termékek, Ft).
// • Kint 6 mászkáló NPC + bent 1 vásárló. E = párbeszéd választható válaszokkal (1–4 / katt). F mögülük (hátulról, közel) = zsebtolvaj-minijáték.
// • Lebukás: NPC kiabál, bírság, 3 perc kitiltás a boltból (bentről kidobnak). Zsebek 10 percenként újratöltődnek.
// • Mentés: localStorage k3dohanybolt (felhomentes.js a k3* kulcsokat viszi). Csak kitalált szereplők/márkák. Debug: window._dbt
(function(){'use strict';
if(typeof window==='undefined'||window._dbt)return;
const $=i=>document.getElementById(i),pick=a=>a[Math.random()*a.length|0];
const K='k3dohanybolt',BAN_MS=180000,REFILL_MS=600000;
const DEF={inv:{},stats:{talk:0,steal:0,caught:0,ft:0},ban:0,pk:{}};
let D;try{D=Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(localStorage.getItem(K))||{})}catch(e){D=JSON.parse(JSON.stringify(DEF))}
const persist=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const money=d=>{try{if(typeof S==='undefined')return 0;if(d)S.c=Math.max(0,S.c+d);try{save()}catch(e){}return S.c}catch(e){return 0}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';

// ---------- TERMÉKEK (kitalált) ----------
const PROD=[['kod','Ködfalvi Szűrős (doboz)',1890,'🚬'],['szel','Mentolos Szellő Slim',2150,'🌬️'],['bago','Bagó Bácsi sodródohány',2690,'🟤'],['pipa','Pipafüst Prémium pipadohány',3400,'🪈'],
 ['szivar','Tölgyesi Kézi Szivar',5900,'🟫'],['gyufa','Gyufa Gyuri gyufa',150,'🔥'],['ongy','Lángoló Laci öngyújtó',690,'🔥'],['papir','Selyempapír Sári',390,'🧻'],['rago','Rágó Rudi nikotinmentes rágó',490,'🍬'],['ujs','Közpénz Hírlap',350,'📰']];
// a CSV 200 tárgya (dohanybolt_targyak.js): [id,név,ár,ikon,kategória,ritkaság,leírás]
(window._DBT_ITEMS||[]).forEach(r=>PROD.push([r[0],r[1],r[5],r[6],r[2],r[3],r[4]]));
const PN=Object.fromEntries(PROD.map(p=>[p[0],p]));
// ---------- HATÁSOK: minden katalógus-tárgy 1 hatást kap (kulcsszó → típus, erősség = ritkaság 1–5) ----------
// Eszköz/Kiegészítő = passzív, amíg nálad van (típusonként a legerősebb számít); Fogyasztható/Alapanyag = „Használ” → 5 perc.
const EF={zona:['🤏 Ügyes ujjak','szélesebb zöld sáv a zsebtolvajlásnál',12],lassu:['🧘 Nyugodt kéz','lassabb jel a zsebtolvajlásnál',6],csend:['🫥 Szagtalan','az NPC-k kevésbé figyelnek rád',15],
 zsakmany:['💰 Nagy fogás','több Ft a zsebekből',10],birsag:['⚖️ Rendes polgár','kisebb bírság lebukáskor',10],kitiltas:['🚪 Visszafogadnak','rövidebb kitiltás',12],karizma:['😎 Karizma','kedvezmény a boltban',3]};
const TIER={'Nagyon gyakori':1,'Gyakori':2,'Ritka':3,'Nagyon ritka':4,'Legendás':5},BUFF_MS=300000;
const EMAP=[[/öngyújtó|gyufa|gyújtó|láng|tűzkő|kanóc|gyújtólencse/i,'karizma'],[/hamutartó|csikk|köpőcsésze/i,'birsag'],[/rágó|cukor|pasztilla|spray|parfüm|szájvíz|illat|gyertya|fertőtlenítő|törlőkendő|fogfehérítő|légtisztító|tapasz|mentolos tubák/i,'csend'],
 [/vízipipa|szén|fólia|diffúzor|hőszabályzó|szopóka/i,'kitiltas'],[/szivar|humidor|cédrus|higrométer|párásító/i,'zsakmany'],[/pipa|dohány|tubák|latakia/i,'lassu'],[/papír|szűrő|filter|sodró|töltő|tömő|kapszula|mérleg|kesztyű|szipka/i,'zona'],[/kabát|sapka|táska|tok|album|gyűrű/i,'zsakmany']];
const ECAT={'Eszköz':'zona','Fogyasztható':'csend','Alapanyag':'lassu','Kiegészítő':'karizma'};
PROD.forEach(p=>{if(!p[4])return;p[7]=(EMAP.find(([re])=>re.test(p[1]))||[0,ECAT[p[4]]||'zona'])[1];p[8]=TIER[p[5]]||1;p[9]=p[4]==='Eszköz'||p[4]==='Kiegészítő'});
if(!D.bf)D.bf={};
// a típus aktuális szintje: passzív tárgyak + futó buff közül a legnagyobb
function bonus(t){let b=0;for(const k in D.inv)if(D.inv[k]>0&&PN[k]&&PN[k][9]&&PN[k][7]===t)b=Math.max(b,PN[k][8]);const f=D.bf[t];if(f&&f.u>Date.now())b=Math.max(b,f.l);return b}
const pct=t=>bonus(t)*EF[t][2];
function useItem(id){const p=PN[id];if(!p||p[9]||!(D.inv[id]>0))return;D.inv[id]--;D.bf[p[7]]={u:Date.now()+BUFF_MS,l:Math.max(p[8],(D.bf[p[7]]&&D.bf[p[7]].u>Date.now())?D.bf[p[7]].l:0)};
 if(p[7]==='kitiltas'&&D.ban>Date.now())D.ban=Date.now()+(D.ban-Date.now())*(1-pct('kitiltas')/100);
 if(p[7]==='csend')NPC.forEach(n=>n.alert=0);persist();toast('✨ '+p[3]+' '+p[1]+' → '+EF[p[7]][0]+' +'+p[8]*EF[p[7]][2]+'% (5 perc)')}
const priceOf=p=>Math.round(p[2]*(1-Math.min(25,pct('karizma'))/100)/10)*10;
const addInv=(id,n)=>{D.inv[id]=(D.inv[id]||0)+(n||1);persist()};

// ---------- NPC-K (kitalált) ----------
// zseb: [Ft, tárgy-azonosítók]; diff: 0 könnyű .. 1 nehéz (zöld zóna mérete, éberség)
const NPCS=[
 {id:'feri',nm:'Füstös Feri',ic:'🧔',col:0x7c2d12,diff:.35,ft:[800,4200],items:['kod','gyufa','ujs'],
  hi:['Szevasz! Van tüzed? Nincs? Akkor minek jöttél?','Na, mi a helyzet, főnök? Én épp a harmincadik utolsó cigimet szívom.'],
  per:'morcos öreg dohányos',
  q:{hogy:['Hogy vagyok? Mint egy hamutartó hétfő reggel.','Jól, csak a tüdőm írt egy panaszlevelet.'],bolt:['A Füstfelhőben Bella mindent tud. Még azt is, amit nem kéne.','Ott hátul a bal utcán. Ha füstszagot érzel, jó helyen jársz.'],vicc:['Tudod, mi a különbség köztem és egy kémény között? A kéményt néha kitakarítják.','Leszoktam. Háromszor. Csak ma.']}},
 {id:'mari',nm:'Mentolos Mari',ic:'👵',col:0x0f766e,diff:.6,ft:[1500,7000],items:['szel','rago','papir'],
  hi:['Jaj, aranyoskám, nem láttad a szemüvegemet? Ja, rajtam van.','Csókolom! Vigyázz, a nagymamák mindent látnak.'],
  per:'éber, kedves nagymama',
  q:{hogy:['Remekül, ma már kétszer megetettem a galambokat. Ugyanazokat.','A derekam fáj, de a pletykák gyógyítanak.'],bolt:['Bellánál a mentolos a legjobb, de ne mondd el a doktornak!','Az a bolt régebben fodrászat volt. A füst maradt.'],vicc:['Én már akkor szívtam, amikor a te nagyapád még pelenkát.','Fiam, a zsebemben csak cukorka van. Meg a nyugdíjam. Meg a kés.']}},
 {id:'dodi',nm:'Dohány Dodi',ic:'🧑‍🎤',col:0x6d28d9,diff:.2,ft:[300,2500],items:['papir','ongy','bago'],
  hi:['Yo! Csak chillezek, tesó.','Héé, figyelj, akarsz hallani egy dalt a füstről? Nem? Kár.'],
  per:'szétszórt zenész',
  q:{hogy:['Fáradt vagyok. Tegnap egész éjjel próbáltunk. Aludni.','Kreatív válságban vagyok. Már két éve.'],bolt:['Bella néha ingyen ad gyufát. Ha szépen nézel.','Ott vettem az első öngyújtómat. Elvesztettem. Hármat.'],vicc:['A zenekarom neve: Füst Nélküli Tűz. Még nem léptünk fel.','Mit mond a cigaretta a hamutálnak? „Nélküled szétesnék.”']}},
 {id:'aladar',nm:'Adó Aladár',ic:'🧑‍💼',col:0x1e3a8a,diff:.8,ft:[5000,18000],items:['szivar','ongy','ujs'],
  hi:['Elnézést, sietek, könyvelési határidő van.','Jó napot. Kérem, maradjon két méterre a pénztárcámtól.'],
  per:'gyanakvó könyvelő',
  q:{hogy:['Hivatalosan: jól. Nem hivatalosan: ne kérdezzen.','A számlák egyeznek, tehát boldog vagyok.'],bolt:['A szivar luxusadóval együtt 5900. Kiszámoltam.','A Füstfelhő bevételei érdekes mintázatot mutatnak.'],vicc:['Egy könyvelő belép egy bárba. Kiszámolja, hogy nem éri meg.','Én soha nem viccelek. Az adóbevallásaim viszont…']}},
 {id:'zsuzsi',nm:'Zsebes Zsuzsi',ic:'💁',col:0xbe185d,diff:.95,ft:[2000,9000],items:['rago','szel','papir'],
  hi:['Szia, cica! Mit nézel a zsebemen?','Jaj, de ismerős vagy… nem te loptad el a pénztárcámat tavaly?'],
  per:'rafinált, maga is zsebtolvaj',
  q:{hogy:['Remekül. A te pénztárcád is jól van? Biztos?','Jól, ma már három turistával barátkoztam.'],bolt:['Bella megismer engem, oda nem megyek be.','A boltban kamerák vannak. Mondjuk úgy, tudom, hol.'],vicc:['Kezet fogunk? …Megvan még az órád?','Én nem lopok, csak ideiglenesen gondoskodom dolgokról.']}},
 {id:'bela',nm:'Bárgyú Béla',ic:'🧑‍🌾',col:0x15803d,diff:.1,ft:[200,1800],items:['gyufa','rago','ujs'],
  hi:['Szia! Te is a galambokat számolod? Én már négynél tartok.','Hello! Tudod, merre van a tér? Ja, itt vagyunk.'],
  per:'jóhiszemű, naiv falusi',
  q:{hogy:['Nagyon jól! Ma találtam egy követ, ami pont kő alakú.','Jól, csak elfelejtettem, miért jöttem be a városba.'],bolt:['Én csak újságot veszek, hogy legyen mit a fejemre tenni, ha esik.','Bella néni egyszer adott egy cukrot. Azóta barátok vagyunk.'],vicc:['Miért nem iszik a zsiráf kávét? …nem tudom, ezt kérdeztem tőled.','Az én zsebemben csak lyuk van. Egyszer kiesett belőle a lyuk is.']}},
 {id:'gizi',nm:'Gyufás Gizi',ic:'👩‍🦰',col:0xb45309,diff:.45,ft:[900,5200],items:['pipa','gyufa','szel'],room:1,
  hi:['Pszt, most választok. Ez komoly döntés.','Szia! A pipadohány illata olyan, mint a nagypapám… csak ő büdösebb volt.'],
  per:'törzsvásárló, fecsegő',
  q:{hogy:['Remekül, ma akciós a pipadohány! Vagyis nem, csak én hiszem.','Jól, Bella ma nem kiabált velem. Még.'],bolt:['Itt minden kitalált márka – a Ködfalvi a kedvencem, a ködért.','A pult alatt van a jó cucc. Mármint a rágó.'],vicc:['Két gyufa beszélget. Az egyik ideges lesz. Fellobban.','Leszoktam a dohányzásról, most már csak illatolok.']}}
];
// körút a téren (a piac, a kút és a standok kikerülve); az NPC-k sorban járják, felük visszafelé
const OUT_PTS=[[-8,4],[-14,-6],[-4,-8],[6,-4],[14,-8],[13,6],[12,18],[8,30],[-8,30],[-10,20],[-12,10],[0,12]];

// ---------- STÍLUS + UI ----------
const css=document.createElement('style');css.textContent=`
#dbtDlg{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);width:min(560px,94vw);z-index:9000;background:#140c08f2;border:2px solid #d4a017;border-radius:16px;padding:12px 16px;color:#fde68a;font:600 16px Rajdhani,Arial;box-shadow:0 10px 30px #000a;display:none}
#dbtDlg.on{display:block}#dbtDlg h4{margin:0 0 6px;font:20px 'Luckiest Guy',Impact;color:#fbbf24}#dbtDlg .tx{color:#fff;margin-bottom:10px;min-height:40px}
#dbtDlg .op{display:block;width:100%;text-align:left;margin:4px 0;padding:7px 10px;border-radius:10px;border:1px solid #d4a01766;background:#2a1a10;color:#fde68a;font:600 15px Rajdhani,Arial;cursor:pointer}
#dbtDlg .op:hover,#dbtDlg .op:focus{background:#4a2e18;outline:2px solid #fbbf24}
#dbtMg{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);width:min(440px,92vw);z-index:9001;background:#0b1022f2;border:2px solid #a855f7;border-radius:16px;padding:14px;color:#e9d5ff;font:600 16px Rajdhani,Arial;text-align:center;display:none}
#dbtMg.on{display:block}#dbtMg .bar{position:relative;height:28px;background:#1e1b4b;border-radius:14px;margin:12px 0;overflow:hidden}
#dbtMg .z{position:absolute;top:0;height:100%;background:#22c55e88}#dbtMg .n{position:absolute;top:-2px;width:6px;height:32px;background:#fff;border-radius:3px}
.dbtBub{position:fixed;z-index:8999;transform:translate(-50%,-100%);max-width:240px;background:#fff;color:#111;border:3px solid #d4a017;border-radius:14px;padding:6px 10px;font:700 14px Rajdhani,Arial;pointer-events:none;display:none}
.dbtBub.yell{border-color:#dc2626;background:#fee2e2;font-size:17px}
#dbtBk{position:fixed;inset:0;z-index:8998;background:transparent;display:none}
#dbtCat{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,94vw);height:min(620px,88vh);z-index:9001;background:#140c08f5;border:2px solid #d4a017;border-radius:16px;padding:12px;display:none;flex-direction:column;gap:8px;font:600 15px Rajdhani,Arial;color:#fde68a}
#dbtCat.on{display:flex}#dbtCat .hd{display:flex;align-items:center;gap:10px}#dbtCat .hd b{font:22px 'Luckiest Guy',Impact;color:#fbbf24;flex:1}
#dbtCat .x{background:#3a2414;color:#fde68a;border:1px solid #d4a01766;border-radius:8px;padding:4px 10px;cursor:pointer;font-size:16px}
#dbtCat .tb{display:flex;flex-wrap:wrap;gap:6px}#dbtCat .tb button{background:#2a1a10;color:#fde68a;border:1px solid #d4a01766;border-radius:999px;padding:4px 12px;cursor:pointer;font:600 14px Rajdhani,Arial}
#dbtCat .tb button.on{background:#fbbf24;color:#1a1008}#dbtCat .ef{font-size:12px;color:#86efac}#dbtCat .af{font-size:13px;color:#86efac}#dbtCat .us{background:#22c55e;margin-left:6px}
#dbtCat .q{background:#0d0805;color:#fff;border:1px solid #d4a01766;border-radius:8px;padding:6px 10px;font:600 15px Rajdhani,Arial}
#dbtCat .ls{flex:1;overflow:auto;display:flex;flex-direction:column;gap:6px;padding-right:4px}
#dbtCat .it{display:flex;align-items:center;gap:10px;background:#2a1a10;border-left:5px solid;border-radius:10px;padding:6px 10px}
#dbtCat .ic{font-size:26px;width:34px;text-align:center}#dbtCat .tx2{flex:1;min-width:0}#dbtCat .nm{color:#fff;font-weight:700}#dbtCat .rr{font-size:12px;font-weight:600}#dbtCat .ds{font-size:13px;color:#d6c7a1}
#dbtCat .by{background:#fbbf24;color:#1a1008;border:0;border-radius:8px;padding:6px 10px;font:700 14px Rajdhani,Arial;cursor:pointer;white-space:nowrap}#dbtCat .by:disabled{opacity:.4;cursor:not-allowed}
#dbtToast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:9002;background:#140c08f0;border:2px solid #d4a017;border-radius:12px;padding:8px 16px;color:#fde68a;font:700 18px Rajdhani,Arial;display:none;pointer-events:none}`;
document.head.appendChild(css);
let dlg,mg,toastEl,bk;
function ui(){if(dlg)return;bk=document.createElement('div');bk.id='dbtBk';document.body.appendChild(bk);dlg=document.createElement('div');dlg.id='dbtDlg';dlg.setAttribute('role','dialog');document.body.appendChild(dlg);
 mg=document.createElement('div');mg.id='dbtMg';document.body.appendChild(mg);toastEl=document.createElement('div');toastEl.id='dbtToast';document.body.appendChild(toastEl)}
function toast(t){ui();toastEl.textContent=t;toastEl.style.display='block';clearTimeout(toast.T);toast.T=setTimeout(()=>toastEl.style.display='none',2600)}
const ST=()=>window._setal;
// teljes képernyős átlátszó háttér: a setal blocker()-e így panelnek látja, és nem nyeli el az E/Esc/1-4 billentyűt
function pause(on){if(bk)bk.style.display=on?'block':'none';const s=ST();if(!s)return;s.paused=on;s.keys={};if(on)try{document.exitPointerLock()}catch(e){}}

// ---------- PÁRBESZÉD ----------
let cur=null; // {n, opts}
function show(title,text,opts){ui();cur={opts};dlg.innerHTML='<h4></h4><div class="tx"></div>';dlg.querySelector('h4').textContent=title;dlg.querySelector('.tx').textContent=text;
 opts.forEach((o,i)=>{const b=document.createElement('button');b.className='op';b.textContent=(i+1)+'. '+o[0];b.onclick=()=>choose(i);dlg.appendChild(b)});dlg.classList.add('on');pause(true)}
function closeDlg(){if(!dlg||!dlg.classList.contains('on'))return;dlg.classList.remove('on');cur=null;setTimeout(()=>pause(false),150)}
function choose(i){if(!cur||!cur.opts[i])return;const f=cur.opts[i][1];if(f)f();else closeDlg()}
function talk(n){D.stats.talk++;persist();n.mood=Math.min(3,(n.mood||0)+1);n.face=1;const d=n.d;
 const menu=t=>show(d.ic+' '+d.nm+' – '+d.per,t,[['Hogy van?',()=>menu(pick(d.q.hogy))],['Mit tud a Füstfelhő dohányboltról?',()=>menu(pick(d.q.bolt))],['Mondjon valami vicceset!',()=>menu(pick(d.q.vicc))],
  ['Mi van a zsebében? (szemtelen)',()=>{n.alert=Math.min(1,(n.alert||0)+.4);menu(pick(['Semmi közöd hozzá! Most már figyellek ám.','Na, na! Ilyet nem kérdezünk!','Mi ez, vámvizsgálat?']))}],['Viszlát!',null]]);
 menu(pick(d.hi))}
function seller(){const opts=[['🛒 Katalógus – mind a '+PROD.length+' termék',openCat]].concat(PROD.slice(0,6).map(p=>[p[3]+' '+p[1]+' – '+fmt(p[2]),()=>{if(money()<p[2]){show('🧕 Bagó Bella eladó','Ebből nem jön ki, aranyom. Előbb keress valamit… tisztességesen!',[['Rendben',null]]);return}
  money(-p[2]);addInv(p[0]);show('🧕 Bagó Bella eladó',pick(['Tessék! Blokkot kérsz? Úgyis eldobod.','Jó választás! Mondjuk mind az.','Parancsolj. Az egészségügyi figyelmeztetés ingyen jár hozzá.'])+' (+1 '+p[1]+')',[['Még nézelődöm',seller],['Köszönöm, viszlát!',null]])}]));
 opts.push(['🎒 Mi van nálam? ('+invTxt()+')',seller],['Viszlát!',null]);
 show('🧕 Bagó Bella eladó','Füstfelhő Dohánybolt, tessék! 18 év alatt csak rágó. A dohányzás súlyosan károsítja az egészséget – a pénztárcádat is.',opts)}
const invTxt=()=>{const k=Object.keys(D.inv).filter(k=>D.inv[k]>0&&PN[k]);if(!k.length)return 'üres';const t=k.slice(0,8).map(k=>PN[k][3]+'×'+D.inv[k]).join(' ');return k.length>8?t+' … (+'+(k.length-8)+' féle)':t};

// ---------- KATALÓGUS (200 tárgy) ----------
const RC={'Nagyon gyakori':'#9ca3af','Gyakori':'#4ade80','Ritka':'#60a5fa','Nagyon ritka':'#c084fc','Legendás':'#fbbf24'};
let cat,catF={k:'Mind',q:'',own:false};
function openCat(){closeDlg();ui();if(!cat){cat=document.createElement('div');cat.id='dbtCat';cat.setAttribute('role','dialog');cat.setAttribute('aria-label','Dohánybolt katalógus');document.body.appendChild(cat)}
 cat.innerHTML='<div class="hd"><b>🏪 Füstfelhő – Katalógus</b><span class="af"></span><span class="mn"></span><button class="x" aria-label="Bezárás">✕</button></div><div class="tb"></div><input class="q" placeholder="Keresés…" aria-label="Keresés"><div class="ls"></div>';
 const tb=cat.querySelector('.tb');['Mind','Eszköz','Fogyasztható','Alapanyag','Kiegészítő','🎒 Nálam'].forEach(k=>{const b=document.createElement('button');b.textContent=k;b.onclick=()=>{catF.own=k==='🎒 Nálam';catF.k=catF.own?'Mind':k;drawCat()};tb.appendChild(b)});
 const q=cat.querySelector('.q');q.value=catF.q;q.oninput=()=>{catF.q=q.value.toLowerCase();drawCat()};
 cat.querySelector('.x').onclick=closeCat;cat.classList.add('on');setTimeout(()=>pause(true),0);drawCat()}
function closeCat(){if(!cat||!cat.classList.contains('on'))return;cat.classList.remove('on');setTimeout(()=>pause(false),150)}
function drawCat(){if(!cat)return;cat.querySelector('.mn').textContent='💵 '+fmt(money());{const a=Object.keys(EF).filter(t=>bonus(t)).map(t=>EF[t][0].split(' ')[0]+'+'+pct(t)+'%');cat.querySelector('.af').textContent=a.length?'Aktív: '+a.join(' '):'Nincs aktív hatás'}
 cat.querySelectorAll('.tb button').forEach(b=>b.classList.toggle('on',catF.own?b.textContent==='🎒 Nálam':b.textContent===catF.k));
 const ls=cat.querySelector('.ls');ls.innerHTML='';
 const L=PROD.filter(p=>p[4]&&(catF.k==='Mind'||p[4]===catF.k)&&(!catF.own||D.inv[p[0]]>0)&&(!catF.q||(p[1]+' '+p[6]).toLowerCase().includes(catF.q)));
 if(!L.length){ls.textContent=catF.own?'Még nincs nálad semmi innen.':'Nincs találat.';return}
 L.forEach(p=>{const r=document.createElement('div');r.className='it';r.style.borderLeftColor=RC[p[5]]||'#888';
  r.innerHTML='<div class="ic"></div><div class="tx2"><div class="nm"></div><div class="ds"></div></div><button class="by"></button>';
  r.querySelector('.ic').textContent=p[3];r.querySelector('.nm').textContent=p[1]+(D.inv[p[0]]?'  ×'+D.inv[p[0]]:'');
  const rr=document.createElement('span');rr.className='rr';rr.style.color=RC[p[5]]||'#888';rr.textContent=' · '+p[5]+' · '+p[4];r.querySelector('.nm').appendChild(rr);
  r.querySelector('.ds').textContent=p[6];{const ef=document.createElement('div');ef.className='ef';ef.textContent='⚡ '+EF[p[7]][0]+' +'+p[8]*EF[p[7]][2]+'% – '+EF[p[7]][1]+(p[9]?' (passzív, amíg nálad van)':' (használva 5 perc)');r.querySelector('.tx2').appendChild(ef)}
  if(D.inv[p[0]]>0&&!p[9]){const u=document.createElement('button');u.className='by us';u.textContent='Használ';u.onclick=()=>{useItem(p[0]);drawCat()};r.appendChild(u)}const by=r.querySelector('.by');const pr=priceOf(p);by.textContent=fmt(pr);by.disabled=money()<pr;
  by.onclick=()=>{if(banLeft()>0){toast('🚫 Ki vagy tiltva a boltból!');return}if(money()<pr){toast('💸 Nincs elég pénzed.');return}money(-pr);addInv(p[0]);toast('🛍️ Megvetted: '+p[3]+' '+p[1]);drawCat()};
  ls.appendChild(r)})}

// ---------- ZSEBTOLVAJLÁS ----------
function pocket(n){const p=D.pk[n.d.id];if(p&&Date.now()-p.t<REFILL_MS)return p;
 const d=n.d,ft=Math.round((d.ft[0]+Math.random()*(d.ft[1]-d.ft[0]))/10)*10;return D.pk[d.id]={t:Date.now(),ft,items:d.items.filter(()=>Math.random()<.7)}}
function behind(n){const s=ST(),dx=s.pos.x-n.x,dz=s.pos.z-n.z,dd=Math.hypot(dx,dz);if(dd>1.7)return false;const fx=Math.sin(n.h),fz=Math.cos(n.h);return (dx*fx+dz*fz)/dd<-.35}
let MG=null;
function steal(n){if(MG||cur)return;const p=pocket(n);if(!p.ft&&!p.items.length){toast('🫥 '+n.d.nm+' zsebe üres – nemrég kiürítették.');return}
 if(n.face||!behind(n)){caught(n,'Látom ám, mit csinálsz!');return}
 ui();pause(true);const diff=Math.min(.95,n.d.diff+(n.alert||0)*.3*(1-pct('csend')/100)-(n.mood||0)*.05),w=Math.min(.6,Math.max(.08,.3-diff*.2)*(1+pct('zona')/100));
 MG={n,p,hits:0,x:0,v:(.9+diff*.9)*(1-Math.min(60,pct('lassu'))/100),z:0,w,last:performance.now()};newZone();
 mg.innerHTML='<b>🤏 Zsebtolvajlás: '+n.d.nm+'</b><div>Szóköz / kattintás, amikor a fehér jel a zöldben van! (3 sikeres kell)</div><div class="bar"><div class="z"></div><div class="n"></div></div><div class="h">0 / 3</div>';
 mg.onclick=hit;mg.classList.add('on');requestAnimationFrame(mgLoop)}
function newZone(){MG.z=.05+Math.random()*(.9-MG.w)}
function mgLoop(t){if(!MG)return;const dt=Math.min(.05,(t-MG.last)/1000);MG.last=t;MG.x+=MG.v*dt;if(MG.x>1){MG.x=1;MG.v=-MG.v}if(MG.x<0){MG.x=0;MG.v=-MG.v}
 const z=mg.querySelector('.z'),nn=mg.querySelector('.n');if(z){z.style.left=MG.z*100+'%';z.style.width=MG.w*100+'%';nn.style.left='calc('+MG.x*100+'% - 3px)'}requestAnimationFrame(mgLoop)}
function hit(){if(!MG)return;const ok=MG.x>=MG.z&&MG.x<=MG.z+MG.w;if(!ok){const n=MG.n;endMg();caught(n,pick(['TOLVAJ! Segítség!','Hé! A kezed a zsebemben?!','Rendőr! Itt egy zsebmetsző!']));return}
 MG.hits++;MG.v*=1.18;newZone();mg.querySelector('.h').textContent=MG.hits+' / 3';if(MG.hits>=3){const {n,p}=MG;endMg();
  const got=[];if(p.ft){p.ft=Math.round(p.ft*(1+pct('zsakmany')/100));money(p.ft);D.stats.ft+=p.ft;got.push(fmt(p.ft))}p.items.forEach(i=>{addInv(i);got.push(PN[i][3]+' '+PN[i][1])});p.ft=0;p.items=[];D.stats.steal++;persist();
  toast('🤏 Sikerült! Zsákmány: '+got.join(', '));bubble(n,pick(['Hm? Mintha könnyebb lennék…','Fura, valami huzatot érzek a zsebemnél.','La-la-la…']),2500)}}
function endMg(){MG=null;mg.classList.remove('on');setTimeout(()=>pause(false),150)}
function caught(n,line){const fine=Math.min(money(),Math.round((2500+n.d.diff*7500)*(1-Math.min(60,pct('birsag'))/100)));money(-fine);D.ban=Date.now()+BAN_MS*(1-Math.min(60,pct('kitiltas'))/100);D.stats.caught++;n.alert=1;persist();
 bubble(n,line,3500,1);try{sfx('hurt')}catch(e){}toast('🚨 Lebuktál! Bírság: '+fmt(fine)+' · '+Math.ceil(banLeft()/60)+' percig kitiltva a Füstfelhőből');
 const s=ST();if(s&&s.zone==='dbt')setTimeout(()=>{try{s.leaveRoom()}catch(e){}},900)}
const banLeft=()=>Math.max(0,Math.ceil((D.ban-Date.now())/1000));

// ---------- BOLT-BELSŐ (setal THEME) ----------
function cvT(w,h,f){const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=8;return t}
function packWall(){return cvT(1024,640,(x,W,H)=>{x.fillStyle='#2b1810';x.fillRect(0,0,W,H);const cols=['#7f1d1d','#1e3a8a','#14532d','#f8fafc','#a16207','#4c1d95','#0e7490','#9f1239'],nms=['KÖDFALVI','SZELLŐ','BAGÓ','TÖLGYES','FÜSTI','PARÁZS','HAMU','FELHŐ'];
 for(let r=0;r<5;r++){x.fillStyle='#5b3b24';x.fillRect(0,r*128+118,W,10);for(let c=0;c<12;c++){const i=(r*5+c*3)%8,X=8+c*84,Y=r*128+14;
  x.fillStyle=cols[i];x.fillRect(X,Y,72,104);x.fillStyle='rgba(255,255,255,.18)';x.fillRect(X,Y,72,10);x.fillStyle='#111';x.fillRect(X,Y+62,72,42);
  x.fillStyle='#fff';x.font='700 8px Arial';x.textAlign='center';x.fillText('A DOHÁNYZÁS',X+36,Y+76);x.fillText('ÁRT!',X+36,Y+88);
  x.fillStyle=i===3?'#111':'#fde68a';x.font='900 12px Impact,Arial';x.fillText(nms[i],X+36,Y+34)}}})}
function posterTex(){return cvT(256,384,(x,W,H)=>{x.fillStyle='#fef3c7';x.fillRect(0,0,W,H);x.strokeStyle='#7f1d1d';x.lineWidth=10;x.strokeRect(5,5,W-10,H-10);x.textAlign='center';
 x.fillStyle='#b91c1c';x.font='900 110px Impact,Arial';x.fillText('18+',W/2,150);x.fillStyle='#111';x.font='700 22px Arial';['Kiskorúnak','dohánytermék','nem adható!','','Zsebtolvajokat','kitiltjuk!'].forEach((l,i)=>x.fillText(l,W/2,210+i*28))})}
function newsTex(){return cvT(256,256,(x,W,H)=>{x.fillStyle='#e5e7eb';x.fillRect(0,0,W,H);x.fillStyle='#111';x.font='900 26px Impact';x.textAlign='center';x.fillText('KÖZPÉNZ HÍRLAP',W/2,34);
 x.font='700 15px Arial';['Rejtélyes zsebtolvaj','a Közpénz téren!','Bella: „Megismerem!”'].forEach((l,i)=>x.fillText(l,W/2,70+i*22));x.fillStyle='#9ca3af';for(let i=0;i<7;i++)x.fillRect(20,140+i*14,W-40,6)})}
function theme(g,R){const lam=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{})),B=new THREE.BoxGeometry(1,1,1),P=new THREE.PlaneGeometry(1,1);
 const M=(geo,mat,x,y,z,sx,sy,sz,ry)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);if(ry)m.rotation.y=ry;g.add(m);return m};
 // fa lambéria a falak alján
 const wood=cvT(256,256,(x,w,h)=>{for(let i=0;i<16;i++){x.fillStyle=i%2?'#6b3f22':'#5a341c';x.fillRect(i*16,0,16,h);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(i*16+15,0,1,h)}for(let k=0;k<60;k++){x.strokeStyle='rgba(30,15,5,.25)';x.beginPath();const X=Math.random()*w;x.moveTo(X,0);x.bezierCurveTo(X+6,h/3,X-6,h*2/3,X+3,h);x.stroke()}});
 wood.wrapS=THREE.RepeatWrapping;wood.repeat.set(6,1);const wm=lam(0xffffff,{map:wood});
 M(B,wm,0,.7,-5.99,13.9,1.4,.04);M(B,wm,-6.99,.7,0,.04,1.4,11.9);M(B,wm,6.99,.7,0,.04,1.4,11.9);
 // cigarettafal a pult mögött
 M(P,lam(0xffffff,{map:packWall(),emissive:0xffffff,emissiveMap:null,emissiveIntensity:0}),0,2.1,-5.96,3.2,2,1);
 // üvegvitrin a pulton szivarokkal
 M(B,new THREE.MeshLambertMaterial({color:0xbfdbfe,transparent:true,opacity:.28,depthWrite:false}),-1.3,1.38,-3.2,1.8,.45,.8);
 for(let i=0;i<8;i++)M(new THREE.CylinderGeometry(.03,.03,.5,8),lam(0x6b3f22),-2+i*.2,1.22,-3.2,1,1,1,Math.PI/2).rotation.z=Math.PI/2;
 M(B,lam(0x111827),1.6,1.35,-3.2,.6,.4,.4);M(B,lam(0x22c55e,{emissive:0x14532d}),1.6,1.42,-2.99,.4,.18,.01); // pénztárgép
 // humidor-szekrény + újságállvány + plakát
 M(B,lam(0x3b2216),-5.8,1.1,3.4,1.2,2.2,.9);M(B,new THREE.MeshLambertMaterial({color:0xfde68a,transparent:true,opacity:.25,depthWrite:false}),-5.8,1.2,3.86,1,1.8,.02);
 for(let r=0;r<3;r++)M(B,lam(0x7c4a1e),-5.8,.6+r*.6,3.5,1,.12,.5);R.boxes.push([-6.5,2.9,-5.1,3.9]);
 M(B,lam(0x374151),5.8,.6,3.4,1,1.2,.6);const nt=newsTex();for(let i=0;i<3;i++)M(P,lam(0xffffff,{map:nt}),5.5+i*.3,1.1+i*.05,3.71,.5,.6,1);R.boxes.push([5.2,3,6.4,3.8]);
 M(P,lam(0xffffff,{map:posterTex()}),-3.5,2.4,-5.96,1,1.5,1);M(P,lam(0xffffff,{map:posterTex()}),6.97,2.4,-3.2,1,1.5,1,-Math.PI/2);
 // füstszerű, áttetsző mennyezet-pára
 const fog=M(P,new THREE.MeshBasicMaterial({color:0xd6d3d1,transparent:true,opacity:.08,depthWrite:false}),0,4.6,0,13,11,1);fog.rotation.x=Math.PI/2;
 // bolti vásárló NPC
 NPC.filter(n=>n.d.room).forEach(n=>{n.m=mkNpc(n.d);g.add(n.m);n.x=-3;n.z=.4;n.h=Math.PI})}

// ---------- NPC 3D + MOZGÁS ----------
function nameTex(t){return cvT(512,96,(x,W,H)=>{x.fillStyle='rgba(11,16,34,.8)';x.fillRect(0,0,W,H);x.fillStyle='#fde68a';x.font='700 44px Rajdhani,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText(t,W/2,H/2)})}
function mkNpc(d){let m;try{m=person(d.col,d.ic,1.0);m.children.forEach(ch=>{if(ch.isSprite){ch.scale.multiplyScalar(.38);ch.position.y=2.85}})}catch(e){m=new THREE.Mesh(new THREE.BoxGeometry(.6,1.8,.4),new THREE.MeshLambertMaterial({color:d.col}))}
 const s=new THREE.Sprite(new THREE.SpriteMaterial({map:nameTex(d.nm),depthTest:false}));s.scale.set(1.6,.3,1);s.position.y=3.25;m.add(s);
 const L={};m.traverse(c=>{if(c.userData&&c.userData.limb)L[c.userData.limb]=c});m.userData.lim=L;return m}
const NPC=NPCS.map(d=>({d,m:null,x:0,z:0,h:0,tgt:null,wait:Math.random()*3,walk:0,face:0,mood:0,alert:0,bub:null,bubT:0}));
let outG=null,best=null;
function build(){ui();const L=window.LB3D;if(outG||!L||!L.sc||typeof THREE==='undefined')return;outG=new THREE.Group();outG.visible=false;L.sc.add(outG);
 NPC.filter(n=>!n.d.room).forEach((n,i)=>{n.m=mkNpc(n.d);outG.add(n.m);n.pi=(i*2)%OUT_PTS.length;n.dir=i%2?-1:1;const p=OUT_PTS[n.pi];n.x=p[0];n.z=p[1]});L.fx.push(tick)}
function bubble(n,t,ms,yell){if(!n.bub){n.bub=document.createElement('div');n.bub.className='dbtBub';document.body.appendChild(n.bub)}n.bub.textContent=n.d.ic+' '+t;n.bub.classList.toggle('yell',!!yell);n.bubT=performance.now()+(ms||2500)}
const _v=typeof THREE!=='undefined'?new THREE.Vector3():null;let lastT=0;
function tick(t){const s=ST(),dt=Math.min(.05,Math.max(0,t-(lastT||t)));lastT=t;const on=!!(s&&s.on),out=on&&s.zone==='out',inR=on&&s.zone==='dbt';if(outG)outG.visible=out;
 best=null;const L=window.LB3D;
 NPC.forEach(n=>{if(!n.m)return;const act=n.d.room?inR:out;
  if(act){const talking=cur&&cur.n===n;
   if(n.face){const dx=s.pos.x-n.x,dz=s.pos.z-n.z;n.h=Math.atan2(dx,dz);if(!dlg.classList.contains('on')&&!MG)n.face=Math.max(0,n.face-dt*.5)}
   else if(!n.d.room){if(!n.tgt||n.wait>0){n.wait-=dt;if(n.wait<=0||!n.tgt){if(n.wait<=0){n.pi=(n.pi+n.dir+OUT_PTS.length)%OUT_PTS.length;n.tgt=OUT_PTS[n.pi];n.wait=0}}}
    if(n.tgt&&n.wait<=0){const dx=n.tgt[0]-n.x,dz=n.tgt[1]-n.z,d=Math.hypot(dx,dz);if(d<.3){n.wait=Math.random()<.4?2+Math.random()*5:.01;n.tgt=null}else{const sp=1.3;n.x+=dx/d*sp*dt;n.z+=dz*sp*dt/d;let a=Math.atan2(dx,dz)-n.h;a=Math.atan2(Math.sin(a),Math.cos(a));n.h+=a*Math.min(1,dt*6);n.walk+=dt*7}}}
   else{n.h+=Math.sin(t*.3)*dt*.3}
   n.alert=Math.max(0,(n.alert||0)-dt*.01);
   const wk=n.tgt&&n.wait<=0&&!n.face,sw=wk?Math.sin(n.walk)*.6:0,lm=n.m.userData.lim;if(lm.larm)lm.larm.rotation.x=sw;if(lm.rarm)lm.rarm.rotation.x=-sw;if(lm.lleg)lm.lleg.rotation.x=-sw*.8;if(lm.rleg)lm.rleg.rotation.x=sw*.8;
   n.m.position.set(n.x,.3,n.z);n.m.rotation.y=n.h;
   const d=Math.hypot(s.pos.x-n.x,s.pos.z-n.z);if(d<2.2&&(!best||d<best.d))best={d,n};
   if(n.bub&&n.bubT>performance.now()&&L){n.m.getWorldPosition(_v);_v.y+=3.5;_v.project(L.cam);n.bub.style.display=_v.z<1?'block':'none';n.bub.style.left=(_v.x+1)/2*innerWidth+'px';n.bub.style.top=(1-_v.y)/2*innerHeight+'px'}else if(n.bub)n.bub.style.display='none';
  }else if(n.bub)n.bub.style.display='none'});
}

// ---------- SETAL BEKÖTÉS ----------
const SHOP={id:'dbt',nm:'Füstfelhő Dohánybolt',ic:'🏪',side:'L',z:28,fn:()=>seller(),wall:'#5c4033',floor:'wood',fc:['#7c4a1e','#6b3f22'],acc:'#d4a017',npc:[0x9f1239,'🧕','Bagó Bella eladó'],theme:'dbt',c1:'#4a2511',c2:'#fde68a'};
function hookNear(s){let real=null;Object.defineProperty(s,'near',{configurable:true,get(){
  if(real&&/Füstfelhő/.test(real.label)&&s.zone==='out'&&banLeft())return {d:real.d,ic:'⛔',label:'Kitiltva a Füstfelhőből még '+banLeft()+' mp',act:()=>toast('⛔ Bella kitiltott! Még '+banLeft()+' mp.')};
  if(best&&(!real||best.d<real.d+.4)){const n=best.n,bh=behind(n)&&!n.face;return {d:best.d,ic:n.d.ic,label:'Beszélgetés: '+n.d.nm+(bh?' · F = zsebtolvajlás 🤏':''),act:()=>{cur={n};talk(n)}}}
  return real},set(v){real=v}})}
(function reg(k){const s=window._setal;if(!s||!s.shops||!s.THEME){if((k|0)<40)setTimeout(()=>reg((k|0)+1),500);return}if(s.shops.some(x=>x.id==='dbt'))return;
 if(s.built){console.warn('dohanybolt: a séta már felépült – a bolt a következő betöltéstől lesz bent');return}
 s.THEME.dbt=theme;s.EMO.dbt=['🚬','🪈','🔥','📰','🍬','🟫'];s.shops.push(SHOP);hookNear(s)})();
// talk() után a cur-ba tegyük az NPC-t (a show felülírja) – a szem-kontaktushoz
const _show=show;show=function(a,b,c){const n=cur&&cur.n;_show(a,b,c);if(n)cur.n=n};
addEventListener('keydown',e=>{const s=ST();if(!s||!s.on)return;const a=document.activeElement;if(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA'))return;const k=e.key.toLowerCase();
 if(MG){if(k===' '||k==='e'){hit();e.preventDefault();e.stopImmediatePropagation()}else if(k==='escape'){const n=MG.n;endMg();caught(n,'Hova-hova, kis barátom?!');e.stopImmediatePropagation()}return}
 if(cat&&cat.classList.contains('on')){if(k==='escape'){closeCat();e.preventDefault();e.stopImmediatePropagation()}return}
 if(dlg&&dlg.classList.contains('on')){if(/^[1-9]$/.test(k)){choose(+k-1);e.preventDefault();e.stopImmediatePropagation()}else if(k==='escape'||k==='e'){closeDlg();e.preventDefault();e.stopImmediatePropagation()}return}
 if(k==='f'&&!e.repeat&&best&&!s.paused){steal(best.n);e.preventDefault();e.stopImmediatePropagation()}},true);
// meccs indításakor minden bezárul
{const ol=window.launch;if(typeof ol==='function')window.launch=function(){try{closeDlg();closeCat();if(MG)endMg()}catch(e){}return ol.apply(this,arguments)}}
setInterval(()=>{try{build()}catch(e){}},700);
window._dbt={D:()=>D,NPC,mg:()=>MG,talk:i=>talk(NPC[i]),steal:i=>steal(NPC[i]),seller,openCat,useItem,bonus,behind:i=>behind(NPC[i]),banLeft,reset:()=>{D=JSON.parse(JSON.stringify(DEF));persist()},
 test(){const n=NPC[5];console.assert(pocket(n).ft>=n.d.ft[0]-10,'pocket ft');const b=money();caught(n,'teszt');console.assert(money()<=b&&banLeft()>170,'caught');D.ban=0;persist();return 'ok'}};
})();
