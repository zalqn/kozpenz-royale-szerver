// hungarikum.js – „HUNGARIKUMOK HARCA” bővítés (HUNGARIKUM_OTLETEK.md 27 eleme). Csak paródia/kitalált nevek, csak játékbeli pénz.
// Becsomagolja: ulti, kill, dmgE, hurt, launch, update, x20near, extraCmd. Debug: window._hk
(function(){
if(typeof CH==='undefined'||typeof THREE==='undefined')return;
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('HK WP missing '+n);return}window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('hk '+n,e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('hk '+n,e)}return r}};
const Rn=Math.random,pk1=a=>a[Rn()*a.length|0],FAY=' – mielőtt a szerver ki fay.';
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const P=LS('k3hk',{fil:0,ren:0});
// ===== 1–13: KARAKTEREK (a meglévő CH listába) =====
// [id, név, emoji, szín, hp, pajzs, seb, képesség, leírás, cooldown, mém]
const HK=[
['hk1','A BETONKOLOSSZUS','🏟️',0x9ca3af,190,60,.9,'Betonstop','8 mp sérthetetlen (a kivitelező felvette az előleget, dolgozni nem fog)',30,'A fegyver-helyre túlárazott stadion épül 48 milliárdból'],
['hk2','CSABAI KOLBÁSZ, A MESTERLÖVÉSZ','🌭',0xb91c1c,110,90,1.15,'Csípős Füst','25 m-en belül 4 mp-re elvakít, a füstölt áru ára duplázódik',20,'Olyan csípős a közbeszerzési határidő, hogy átugrod a Dunát'],
['hk3','TOKAJI ASZÚ 6 PUTTONYOS','🍷',0xf59e0b,120,100,1.05,'Aranyló Likviditás','Teljes HP+pajzs, de a meccspénz 80%-a offshore számlára megy',35,'Mindenki örökös állami bérletet kap'],
['hk4','ERŐS PISTI & PIROS ARANYKA','🌶️',0xdc2626,150,70,1.1,'Kettős Nyomás','6 mp dupla sebzés; ha megsérülsz, a másik „drágul” (rövid sebzés-bónusz)',22,'Meglátják az uniós auditort a horizonton'],
['hk5','KÜRTŐSKALÁCS','🥯',0xd97706,120,80,1.3,'Spirális Menekülés','14 m-es spirál-ugrás előre + 1,5 mp sérthetetlenség',12,'Tekered ki magad a bajból fahéjas cukor álcája alatt'],
['hk6','PIKK SZALÁMI & UNIKUM-FÉLE GYOMORKESERŰ','🥓',0x7c2d12,160,90,1.0,'Nemzeti Gyomorrontás','35 m-en belül minden sima ellenfelet kiüt (boss: nagy sebzés)',90,'Eldől, hogy a gyomorrontás vagy a gyógyhatás viszi el a közpénzt'],
['hk7','A LOMBKORONASÉTÁNY (FÁK NÉLKÜL)','🪵',0x65a30d,110,90,1.2,'Teljes Transzparens Eltűnés','3 mp láthatatlan a NAV (és mindenki) elől',18,'Csak egy üres deszkán bámulsz a semmibe'],
['hk8','MAGYAR VIZSLA','🐕‍🦺',0xc2410c,115,80,1.35,'Pályázat-Szimat','Kiszagolja és megjelöli a legközelebbi milliárdos alapot',15,'Kiszagolja a föld alatt elásott uniós pályázatot'],
['hk9','MAKÓI HAGYMA','🧅',0xeab308,140,120,1.0,'Többrétegű Védelem','+50 pajzs réteg, a közeli ellenfelek sírva fakadnak',16,'Csak héjakat talál, és sírva fakad a rejtett költségektől'],
['hk10','BOCIKA & BAMBIKA (NOSZTALGIA)','🍫',0x8b5cf6,120,90,1.1,'Rendszerhiba','Leállítja a digitális pénztárgépeket – minden ellenfél 4 mp-re lefagy',28,'A szerver a 2000-es évek eleji parkon fut'],
['hk11','AZ ASZFALTCSÍK (KERÉKPÁRÚT A SEMMIBE)','🚲',0x475569,120,80,1.3,'Derékszögű Kanyar','90°-os oldalugrás, az üldözők összezavarodnak',12,'Belevezetsz egy árokba a búzatábla közepén'],
['hk12','A HÁJPCIPŐ (KICKSZI KRISTÓF DEDIKÁLT)','👟',0xf8fafc,110,80,1.25,'Hájpszórás','Vaku-villogás: 30 m-en belül mindenki 3 mp-re vak',18,'Annyira exkluzív, hogy a zóna is elkerüli'],
['hk13','MC ROZSDAGYÁR (CSEPELI RAPPER)','🎤',0x9333ea,140,80,1.1,'Rage Moshpit','Földrengés-lökéshullám: sebez és ellök 18 m-en belül',20,'Mire odajutsz, leégett a híd és a tömeg eltaposta a lootot']];
const HKM={};HK.forEach(h=>{const o={id:h[0],n:h[1],e:h[2],c:h[3],hp:h[4],sh:h[5],sp:h[6],hk:1,an:h[7],d:'HUNGARIKUM · Q: '+h[7]+' – '+h[8]};HKM[h[0]]={o,cd:h[9],meme:h[10],ad:h[8]};if(!CH.some(c=>c.id===h[0]))CH.push(o)});
const cur=()=>{try{return G&&G.f&&HKM[G.f.id]}catch(e){return null}};
const play=()=>typeof G!=='undefined'&&G&&!G.over&&G.phase==='play';
const near=r=>G.en.filter(e=>!e.dead&&Math.hypot(e.x-G.x,e.z-G.z)<r);
const fwd=()=>[Math.cos(G.ang),Math.sin(G.ang)];
const okXZ=(x,z)=>typeof HU==='undefined'||!G.arh||inHU(x,z);
function inHU(x,z){let c=false;for(let i=0,j=HU.length-1;i<HU.length;j=i++){const a=HU[i],b=HU[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c}return c}
const SAY=t=>{try{say(t)}catch(e){}},FT=(x,z,t)=>{try{ftx(x,z,t,'')}catch(e){}},SFX=n=>{try{sfx(n)}catch(e){}};
function flash(col,ms){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:9990;pointer-events:none;background:'+col+';opacity:.85;transition:opacity '+(ms/1000)+'s';document.body.appendChild(d);requestAnimationFrame(()=>requestAnimationFrame(()=>d.style.opacity=0));setTimeout(()=>d.remove(),ms+80)}
const ABI={
hk1:g=>{g.ef.push({k:'inv',t:8});SAY('🏟️ BETONSTOP! 8 mp sérthetetlen – az előleg megvan, a munka nincs.')},
hk2:g=>{near(25).forEach(e=>e.fz=4);flash('#7f1d1d',500);SAY('🌭 CSÍPŐS FÜST! A füstölt áru ára most duplája.')},
hk3:g=>{const l=Math.round((g.cash||0)*.8);g.cash-=l;g.hp=g.mhp;g.sh=g.msh;FT(g.x,g.z,'🍷 -'+l+' Ft offshore');SAY('🍷 ARANYLÓ LIKVIDITÁS! Mindenki felállt – a büdzsé 80%-a offshore-ba ment.')},
hk4:g=>{g.rage=Math.max(g.rage||0,6);SAY('🌶️ KETTŐS NYOMÁS! 6 mp dupla sebzés – infláció címén.')},
hk5:g=>{const [c,s]=fwd();let x=g.x,z=g.z;for(let i=0;i<14;i++){if(!okXZ(x+c,z+s))break;x+=c;z+=s}g.x=x;g.z=z;g.ef.push({k:'inv',t:1.5});SAY('🥯 SPIRÁLIS MENEKÜLÉS! Átszáguldottál a tűzfalon.')},
hk6:g=>{near(35).forEach(e=>{try{dmgE(e,e.b?300:e.hp+1,true)}catch(x){}});flash('#78350f',400);SAY('🥓 NEMZETI GYOMORRONTÁS! Egy mozdulat, az egész mezőny rosszul lett.')},
hk7:g=>{g.ef.push({k:'inv',t:3});near(60).forEach(e=>e.fz=3);if(g.pm)g.pm.visible=false;g.ef.push({k:'hkInvis',t:3,end:()=>{if(G.pm)G.pm.visible=true}});SAY('🪵 TELJES TRANSZPARENS ELTŰNÉS! 3 mp-ig nem látnak.')},
hk8:g=>{const a=Rn()*6.28;let x=g.x+Math.cos(a)*22,z=g.z+Math.sin(a)*22;if(!okXZ(x,z)){x=g.x;z=g.z}try{pk(x,z,'coin');pk(x+1.5,z,'frank')}catch(e){}beacon(x,z,'💰 MILLIÁRDOS ALAP',12);SAY('🐕‍🦺 PÁLYÁZAT-SZIMAT! Megjelölve: milliárdos alap '+Math.round(Math.hypot(x-g.x,z-g.z))+' m-re.')},
hk9:g=>{g.sh=Math.min(g.msh,(g.sh||0)+50);near(8).forEach(e=>{e.fz=1.5;FT(e.x,e.z,'😭')});SAY('🧅 TÖBBRÉTEGŰ VÉDELEM! '+pk1(['Új adótitok: a hagymaréteg is áfás.','Réteg alatt réteg: a beszámoló még üres.','Héj, héj, héj… és még egy tanácsadói díj.']))},
hk10:g=>{g.en.forEach(e=>{if(!e.dead)e.fz=4});SAY('🍫 RENDSZERHIBA! Leállt minden digitális pénztárgép – a mezőny lefagyott.')},
hk11:g=>{const [c,s]=fwd();let x=g.x,z=g.z;for(let i=0;i<12;i++){if(!okXZ(x-s,z+c))break;x-=s;z+=c}g.x=x;g.z=z;near(30).forEach(e=>e.fz=2.5);SAY('🚲 DERÉKSZÖGŰ KANYAR! Az út véget ért, az üldözők az árokban.')},
hk12:g=>{flash('#ffffff',350);near(30).forEach(e=>e.fz=3);SAY('👟 HÁJPSZÓRÁS! Vaku, vaku, vaku – dedikálva.')},
hk13:g=>{near(18).forEach(e=>{const d=Math.hypot(e.x-g.x,e.z-g.z)||1;const nx=e.x+(e.x-g.x)/d*8,nz=e.z+(e.z-g.z)/d*8;if(okXZ(nx,nz)){e.x=nx;e.z=nz}try{dmgE(e,90,false)}catch(x){}});flash('#581c87',300);SAY('🎤 RAGE MOSHPIT! A föld is pogózik.')}};
// Q: hungarikum-képesség (ha kész), különben az eredeti ulti
{const o=window.ulti;window.ulti=function(){const h=cur();if(h&&play()){const g=G;g.hkCd=g.hkCd||0;if(g.t>=g.hkCd){g.hkCd=g.t+h.cd;try{ABI[h.o.id](g)}catch(e){console.error('hk abi',e)}SFX('ult');return}}return o.apply(this,arguments)}}
// Erős Pisti passzív: sérüléskor a másik „drágul”
{const o=window.hurt;window.hurt=function(d,storm){try{const g=G;if(g&&storm&&g.hk&&(g.hk.shoe>g.t||inPoi('dohany')))return;if(g&&!storm&&cur()&&g.f.id==='hk4'&&!(g.hkPi>g.t)){g.hkPi=g.t+6;g.rage=Math.max(g.rage||0,1.5);FT(g.x,g.z,'🌶️ Piros Aranyka +20% infláció')}}catch(e){}return o.apply(this,arguments)}}
// propaganda-zene: védtelen ellenfél = dupla sebzés
{const o=window.dmgE;if(typeof o==='function')window.dmgE=function(e,d,ct){try{if(e&&e.hkV>G.t)d*=2}catch(x){}return o.call(this,e,d,ct)}}
// ===== 22: FILLÉR =====
WP('kill',null,()=>{P.fil+=500;SV('k3hk',P)});
function filler(){if(!play())return;if(P.fil<100){SAY('🪙 Nincs filléred. (Kiesésenként 500 fillér jár.)');return}P.fil-=100;SV('k3hk',P);const e=near(30).sort((a,b)=>Math.hypot(a.x-G.x,a.z-G.z)-Math.hypot(b.x-G.x,b.z-G.z))[0];if(e)FT(e.x,e.z,'😂 HAHA, 1 fillér!');SAY('🪙 INFLÁCIÓS POFON! '+(e?'Hozzávágtad – csak nevet rajta.':'Senki sincs a közelben, a fillér elgurult.'))}
// ===== 24: NEMZETI KÁRTYA (Í) =====
function kartya(){if(!play())return;const g=G;if(!g.hk||!g.hk.card){SAY('💳 Nincs Nemzeti Kártyád – adóellenőrzés folyamatban.');return}if(g.t<(g.hk.kcd||0)){SAY('💳 A nyomtatvány még nyomdában: '+Math.ceil(g.hk.kcd-g.t)+' mp');return}g.hk.kcd=g.t+15;const e=near(14)[0];if(!e){SAY('💳 Nincs kit lepapírozni a közelben.');return}e.fz=3;FT(e.x,e.z,'📄 B-27/C nyomtatvány kitöltése…');SAY('💳 BÜROKRATIKUS FAL! Az ellenfél 3 mp-ig ikszelget.')}
// ===== HELYSZÍNEK + JÁRMŰ + LÁDA (meccsenként felépítve) =====
const MATS={};const mt=(c,o)=>MATS[c+'|'+(o||1)]||(MATS[c+'|'+(o||1)]=new THREE.MeshLambertMaterial({color:c,transparent:(o||1)<1,opacity:o||1,emissive:o&&o<1?c:0,emissiveIntensity:.4}));
const GBX=new THREE.BoxGeometry(1,1,1),GCY=new THREE.CylinderGeometry(1,1,1,24,1,true),GCYS=new THREE.CylinderGeometry(1,1,1,24);
function box(par,c,sx,sy,sz,x,y,z,o){const m=new THREE.Mesh(GBX,mt(c,o));m.scale.set(sx,sy,sz);m.position.set(x,y,z);par.add(m);return m}
function lab(par,t,y,s){try{const l=spr(t,s||3,'bold 40px');l.position.y=y;par.add(l);return l}catch(e){}}
function beacon(x,z,t,life){try{const s=spr(t,3,'bold 40px');s.position.set(x,7,z);scene.add(s);G.ef.push({k:'hkB',t:life,end:()=>scene.remove(s)})}catch(e){}}
const POI=[ // [kulcs, felirat, sugár, építő]
['gyar','🔋 AKKUMULÁTOR-GIGAGYÁR (mérgező zóna)',12,g=>{box(g,0x334155,14,7,10,0,3.5,0);box(g,0x84cc16,22,.1,22,0,.06,0,.45);[[-5,6],[5,6]].forEach(p=>{const k=new THREE.Mesh(GCYS,mt(0x64748b));k.scale.set(1,12,1);k.position.set(p[0],6,p[1]-12);g.add(k)})}],
['abc','🛒 FILLÉRFALÓ ABC (E: lőszer + különadó)',4,g=>{box(g,0xdc2626,8,4,6,0,2,0);box(g,0xfef08a,8.2,.8,.2,0,3.4,3.05)}],
['magnes','🧲 HŰTŐMÁGNES DISZKONT (E: 300 Ft)',4,g=>{box(g,0x2563eb,8,4,6,0,2,0);box(g,0xffffff,8.2,.8,.2,0,3.4,3.05)}],
['arena','🏟️ BETONKOLOSSZUS ARÉNA – VIP PÁHOLY (E: 2000 Ft)',11,g=>{const r=new THREE.Mesh(GCY,mt(0xa8a29e));r.material.side=THREE.DoubleSide;r.scale.set(11,6,11);r.position.y=3;g.add(r);box(g,0xfacc15,4,.4,3,0,6.2,-10)}],
['dohany','🚬 NEMZETI FÜSTBÓDÉ – SAFEHOUSE (vihar nem sebez, E: drága lőszer)',4,g=>{box(g,0x1f2937,5,3.2,4,0,1.6,0);box(g,0x111827,5.1,1.2,4.1,0,2,0)}],
['major','🚜 HÉTPUSZTAI MAJOR (rakétabiztos „melléképület”, E: betörés)',14,g=>{for(let i=0;i<16;i++){const a=i/16*6.283;if(i===4)continue;box(g,0x78716c,5.6,3,.6,Math.cos(a)*14,1.5,Math.sin(a)*14).rotation.y=-a+Math.PI/2}box(g,0xe7e5e4,10,5,7,0,2.5,0);box(g,0x16a34a,3,2,4,6,1,9)}],
['rakpart','🌊 PESTI ALSÓRAKPART (eső után horgásztó)',10,g=>{box(g,0x57534e,20,.15,6,0,.08,0)}],
['csepel','🎤 ROZSDAMŰVEK – CSEPELI KONCERT-ZÓNA',14,g=>{box(g,0x7c2d12,12,1.2,6,0,.6,-6);box(g,0x44403c,1,8,1,-6,4,-8);box(g,0x44403c,1,8,1,6,4,-8);box(g,0x9a3412,13,1,1,0,8,-8)}],
['felujit','🏚️ FELÚJÍTANDÓ INTÉZMÉNY (E: 1000 Ft tervezési díj)',5,g=>{box(g,0x9ca3af,8,2,.5,0,1,-3);box(g,0x9ca3af,.5,2,6,-4,1,0);box(g,0x9ca3af,.5,1,6,4,.5,0)}],
['roller','🛴 ELEKTROMOS ROLLER (E: fel/le)',2,g=>{box(g,0x22c55e,.4,.1,1.4,0,.25,0);box(g,0x111827,.08,1.2,.08,0,.85,-.6)}],
['lada','🎁 LEGENDÁS LÁDA (E: Nemzeti Kártya kell)',2,g=>{box(g,0xa855f7,1.4,1,1,0,.5,0);box(g,0xfacc15,1.5,.15,1.05,0,.9,0)}]];
function inPoi(k){const h=G&&G.hk;if(!h)return false;const p=h.p.find(q=>q.k===k);return !!p&&Math.hypot(G.x-p.x,G.z-p.z)<p.r}
function build(){const g=G;if(!g||!scene)return;const R0=g.arh?120:30;g.hk={p:[],card:Rn()>.15,shoe:0,ride:null,flood:0,conc:0,prog:12,ev:[],vipCd:0};
 const list=POI.slice();list.push(POI[9],POI[10]);// 2 roller, 2 láda
 list.forEach((d,i)=>{let x=0,z=0;for(let t=0;t<30;t++){const a=i/list.length*6.283+Rn()*.4,r=R0*(.45+Rn()*.5);x=Math.cos(a)*r;z=Math.sin(a)*r;if(okXZ(x,z)&&Math.hypot(x,z-42)>12)break}
  const grp=new THREE.Group();grp.position.set(x,0,z);d[3](grp);const L=lab(grp,d[1],d[0]==='roller'||d[0]==='lada'?2.6:(d[0]==='gyar'?9:6.5),d[0]==='roller'||d[0]==='lada'?1.6:2.6);grp.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false}});scene.add(grp);g.hk.p.push({k:d[0],n:d[1],x,z,r:d[2],m:grp,open:0})});
 // események időzítése (meccsidő mp)
 const ev=[['konc',rr(70,110)],['mav',rr(120,170)],['arviz',rr(150,210)],['prop',rr(90,240)],['konz',rr(160,260)]];if(Rn()<.55)ev.push(['fay',rr(60,300)]);g.hk.ev=ev;
 if(!g.hk.card)setTimeout(()=>SAY('💳 Nincs Nemzeti Kártyád! Ládát nem nyithatsz, amíg nem találsz egyet (Hűtőmágnes Diszkont).'),4000)}
function rr(a,b){return a+Rn()*(b-a)}
// ===== 14: VÁLASZTÁSI HIMNUSZ (szintetizált, kitalált dallam) =====
let AC=null;function himnusz(len){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();const n=[67,67,69,71,71,69,67,64,62,62,64,67,67,64,64,0,67,67,69,71,72,71,69,67,64,62,64,67,64,62,60,0];const bt=.22,T=AC.currentTime+.05,N=Math.min(n.length,len||n.length);
 for(let i=0;i<N;i++){if(!n[i])continue;const o=AC.createOscillator(),gg=AC.createGain();o.type=i%2?'square':'triangle';o.frequency.value=440*Math.pow(2,(n[i]-69)/12);gg.gain.setValueAtTime(.0001,T+i*bt);gg.gain.exponentialRampToValueAtTime(.05,T+i*bt+.02);gg.gain.exponentialRampToValueAtTime(.0001,T+i*bt+bt*.95);o.connect(gg).connect(AC.destination);o.start(T+i*bt);o.stop(T+i*bt+bt)}
 for(let i=0;i<N;i+=2){const o=AC.createOscillator(),gg=AC.createGain();o.type='sine';o.frequency.value=[98,98,131,147][(i/8|0)%4];gg.gain.setValueAtTime(.06,T+i*bt);gg.gain.exponentialRampToValueAtTime(.0001,T+i*bt+.18);o.connect(gg).connect(AC.destination);o.start(T+i*bt);o.stop(T+i*bt+.2)}}catch(e){}}
// ===== ESEMÉNYEK =====
function fay(){const d=document.createElement('div');d.id='hkFay';d.innerHTML='<div>SZERVER KI FAY</div><small>túl sok közbeszerzés fut egyszerre… (vicc, a játék megy tovább)</small>';document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
const EV={
fay:()=>fay(),
konc:g=>{const p=g.hk.p.find(q=>q.k==='csepel');g.hk.conc=g.t+25;SAY('🎤 MC ROZSDAGYÁR INGYENKONCERT A ROZSDAMŰVEKNÉL! A tömeg eltaposta a lootot – siess, amíg tart!');beacon(p.x,p.z,'🎤 KONCERT',25);for(let i=0;i<4;i++)try{pk(p.x+rr(-8,8),p.z+rr(-8,8),pk1(['coin','chest','hp','frank']))}catch(e){}},
mav:g=>{g.en.forEach(e=>{if(!e.dead)e.fz=Math.max(e.fz||0,3)});g.stun=2;SAY('🚂 MÁV-KÉSÉS: falevél esett a sínre! Minden mozgás áll – várható késés: 420 perc (kétszer számlázva).')},
arviz:g=>{g.hk.flood=g.t+40;const p=g.hk.p.find(q=>q.k==='rakpart');p.w=p.w||(()=>{const m=box(scene,0x2563eb,24,.2,24,p.x,.12,p.z,.6);return m})();p.w.visible=true;p.r=12;SAY('🌧️ ESŐ UTÁN: a Pesti Alsórakpart halastóvá változott! A kerekesek elsüllyednek, a horgászbot legendás lootot hoz (E).')},
prop:g=>{himnusz(24);near(30).forEach(e=>{e.hkV=g.t+10;FT(e.x,e.z,'🎶 fülbemászó…')});SAY('📻 VÁLASZTÁSI HIMNUSZ! A hallgató ellenfelek 10 mp-ig védtelenek (dupla sebzés).')},
konz:g=>konz()};
// ===== 26: NEMZETI KONZULTÁCIÓ popup =====
const KQ=[['Ön szerint a lángos legyen-e stratégiai ágazat?',['Igen','Igen, de tejföllel','Nem (rossz gomb)']],['Mennyibe kerüljön egy stadion?',['48 milliárd','Amennyi van','Semennyibe (rossz gomb)']],['Ki a hibás, ha a szerver ki fay?',['Brüsszel','A falevél a sínen','A szerver (rossz gomb)']],['Támogatja-e, hogy a zóna is kérdőívet töltsön ki?',['Igen','Kétszer is','Inkább lövök (rossz gomb)']]];
function konz(){if(document.getElementById('hkKz')||!play())return;const g=G;if(document.pointerLockElement)document.exitPointerLock();const qs=KQ.slice().sort(()=>Rn()-.5).slice(0,3);let i=0,ok=0;const d=document.createElement('div');d.id='hkKz';document.body.appendChild(d);
 g.ef.push({k:'hkKz',t:60,u:()=>{if(!document.getElementById('hkKz'))return;g.en.forEach(e=>{if(!e.dead&&e.fz<.3)e.fz=.3});g.eb.forEach(b=>b.l=0)}});
 const show=()=>{if(i>=qs.length){d.remove();g.ef.forEach(x=>{if(x.k==='hkKz')x.t=0});SAY('📋 Köszönjük a kitöltést! '+(ok?'Jó válasz: +'+ok*500+' Ft':'')+' Az idő újra indul.');g.cash+=ok*500;return}const q=qs[i];d.innerHTML='<h3>📋 NEMZETI KONZULTÁCIÓ ('+(i+1)+'/3 – a 12 kérdéses változat rövidítve)</h3><p>'+q[0]+'</p>'+q[1].map((a,j)=>'<button data-j="'+j+'">'+a+'</button>').join('')+'<small>A kitöltés idejére az egész szerveren megáll az idő.</small>';
  d.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(+b.dataset.j===2){const l=Math.min(g.cash||0,2000);g.cash-=l;FT(g.x,g.z,'📋 -'+l+' Ft (rossz gomb)')}else ok++;i++;show()})};show();SAY('📋 NEMZETI KONZULTÁCIÓ! Kötelező kitölteni – közben mindenki ikszelget.')}
// ===== meccs-ciklus =====
WP('launch',null,()=>himnusz(8));// G később jön létre (betöltőképernyő), ezért a pálya-elemek az update-ben épülnek
let hudT=0,hudS='';
WP('update',null,a=>{if(typeof G==='undefined'||!G||G.over)return;if(!G.hk&&!G.fk&&((window.GAME_MODE||'royale')==='royale'||G.stw))try{build()}catch(e){console.error('hk build',e);G.hk={p:[],ev:[]}}if(!play()||!G.hk||!G.hk.ev)return;const g=G,h=g.hk,dt=Math.min(.1,a[0]||.016);
 for(let i=h.ev.length-1;i>=0;i--)if(g.t>=h.ev[i][1]){const k=h.ev[i][0];h.ev.splice(i,1);try{EV[k](g)}catch(e){console.error('hk ev '+k,e)}}
 h.p.forEach(p=>{const d=Math.hypot(g.x-p.x,g.z-p.z);
  if(p.k==='gyar'){if(d<p.r){g.hp-=2*dt}near(1e9).forEach(e=>{if(Math.hypot(e.x-p.x,e.z-p.z)<p.r)try{dmgE(e,20*dt,false)}catch(x){}})}
  if(p.k==='major'&&d<p.r)g.eb.forEach(b=>{if(b.l>0)b.l=0});
  if(p.k==='csepel'&&h.conc>g.t&&d<p.r&&Rn()<dt*1.5){g.vx+=rr(-14,14);g.vz+=rr(-14,14)}
  if(p.k==='rakpart'&&p.w&&h.flood<g.t&&p.w.visible){p.w.visible=false;p.r=10}});
 if(h.ride){const r=h.ride;g.x+=g.vx*dt*.9;g.z+=g.vz*dt*.9;g.ang+=rr(-.6,.6)*dt;if(!okXZ(g.x,g.z)||Rn()<dt*.06){h.ride=null;r.m.visible=true;r.x=g.x;r.z=g.z;r.m.position.set(g.x,0,g.z);g.vy=12;g.y=Math.max(g.y,.5);try{hurt(6)}catch(e){}SAY('🛴 Láthatatlan padkaszegély! Kirepültél – a fizika törvényei sajnálják.')}else if(inPoi('rakpart')&&h.flood>g.t){h.ride=null;r.m.visible=false;SAY('🛴 A roller elsüllyedt a rakparti halastóban. Blub.')}}
 hudT-=dt;if(hudT<=0){hudT=.25;const c=cur();const s=(c?'<b>Q</b> '+c.o.an+(g.t>=(g.hkCd||0)?' ✅':' ⏳'+Math.ceil(g.hkCd-g.t))+' · ':'')+'🪙 '+P.fil+' fillér <b>Ú</b> · 💳 '+(h.card?'Nemzeti Kártya <b>Í</b>':'nincs kártya')+(h.shoe>g.t?' · 👟 zóna-mentes '+Math.ceil(h.shoe-g.t):'')+(h.ride?' · 🛴 ROLLER':'')+nearTip();if(s!==hudS){hudS=s;hud.innerHTML=s}hud.style.display='block'}});
WP('end',null,()=>{hud.style.display='none';const n=document.getElementById('hkKz');if(n)n.remove();if(P.fil>=5000)setTimeout(()=>SAY('🪙 '+P.fil+' filléred van. Egy virtuális rágóra sem elég.'),1500)});
function nearP(){const g=G;if(!g||!g.hk)return null;let b=null,bd=1e9;g.hk.p.forEach(p=>{const d=Math.hypot(g.x-p.x,g.z-p.z),lim=Math.max(3,p.r*.6)+1;if(d<lim&&d<bd&&p.m.visible!==false){b=p;bd=d}});return b}
function nearTip(){const p=nearP();return p?'<br><b>E</b> '+p.n:''}
function useE(){const g=G,h=g.hk,p=nearP();if(h.ride){const r=h.ride;h.ride=null;r.m.visible=true;r.m.position.set(g.x,0,g.z);r.x=g.x;r.z=g.z;SAY('🛴 Leszálltál a rollerről.');return true}if(!p)return false;const pay=n=>{if((g.cash||0)<n){SAY('💸 Nincs elég meccspénzed ('+n+' Ft).');return false}g.cash-=n;return true};
 switch(p.k){
 case'abc':if(pay(1500)){g.res[g.wp]=(g.res[g.wp]|0)+30;SAY('🛒 Lőszer +30 – kasszazárás: a különadó a fegyveredet is sújtja (+30% ár).')}break;
 case'magnes':if(pay(300)){if(!h.card&&Rn()<.5){h.card=true;SAY('🧲 A hűtőmágnes mögött egy Nemzeti Kártya volt! 💳')}else SAY('🧲 '+pk1(['Balatoni hűtőmágnes','Hűtőmágnes: „Itt jártam, a pénz nem”','Kürtőskalács alakú hűtőmágnes','Hűtőmágnes, áfával'])+' – ennyi van.')}break;
 case'arena':if(g.t<h.vipCd){SAY('🏟️ A VIP páholy foglalt (évente kétszer van meccs): '+Math.ceil(h.vipCd-g.t)+' mp');break}if(pay(2000)){h.vipCd=g.t+45;g.ef.push({k:'inv',t:6});SAY('🏟️ VIP PÁHOLY! 6 mp sérthetetlen a felső szinten.')}break;
 case'dohany':if(pay(4000)){g.res[g.wp]=(g.res[g.wp]|0)+20;SAY('🚬 Monopol helyzet: 20 lőszer 4000 Ft-ért. A zóna itt nem zaklat.')}break;
 case'major':if(p.open>g.t){SAY('🚜 A 40 testőr és egy felháborodott traktoros még a kapuban áll: '+Math.ceil(p.open-g.t)+' mp');break}p.open=g.t+60;try{pk(p.x,p.z+3,'chest');pk(p.x+2,p.z+3,'frank')}catch(e){}SAY('🚜 Betörtél a Hétpusztai Majorba! A tulajdoni lap szerint ez csak egy melléképület.');break;
 case'rakpart':if(h.flood>g.t){if(p.open>g.t){SAY('🎣 Még nem kapnak: '+Math.ceil(p.open-g.t)+' mp');break}p.open=g.t+6;const t=pk1(['chest','chest','coin','hp','frank','beer']);try{pk(g.x+1,g.z+1,t)}catch(e){}SAY('🎣 Kifogtál valamit a Lánchíd alól! '+(t==='chest'?'LEGENDÁS LÁDA!':'Zsákmány: '+t))}else SAY('🌊 Alsórakpart – most száraz. Eső után horgászható.');break;
 case'csepel':SAY(h.conc>g.t?'🎤 MC Rozsdagyár: „Ki fay a szerver, de a basszus nem!”':'🎤 Rozsdaművek – a koncert még nem kezdődött (vagy már leégett a híd).');break;
 case'felujit':if(pay(1000)){h.prog+=rr(15,35);if(h.prog>=99){h.prog=12;SAY('🏚️ 99%… kiderült, hogy a tető hiányzik és a büdzsé tervezési díjra ment. Vissza 12%-ra. (Végtelen Alapozás)')}else SAY('🏚️ Felújítás: '+Math.round(h.prog)+'% – a fal soha nem készül el, de pénzt mindig lehet rá kérni.')}break;
 case'roller':h.ride=p;p.m.visible=false;SAY('🛴 Felpattantál az elektromos rollerre! Irányíthatatlan, de gyors.');break;
 case'lada':if(!h.card){g.cash=Math.max(0,(g.cash||0)-1000);SAY('🎁 A láda Nemzeti Kártyát kér! Nincs – adóellenőrzés: -1000 Ft.');break}p.m.visible=false;h.shoe=g.t+25;SAY('🎁 LEGENDÁS LÁDA: fegyver helyett dedikált Kickszi Kristóf HÁJPCIPŐ! 25 mp-ig a zóna is elkerül.');break}
 return true}
const hud=document.createElement('div');hud.id='hkHud';document.body.appendChild(hud);
const css=document.createElement('style');css.textContent='#hkHud{position:fixed;left:50%;transform:translateX(-50%);bottom:118px;z-index:40;display:none;background:#0b1022cc;color:#e2e8f0;font:600 12px system-ui;padding:5px 10px;border-radius:9px;border:1px solid #ffffff22;text-align:center;pointer-events:none;max-width:92vw}#hkHud b{color:#facc15}'
+'#hkFay{position:fixed;left:50%;top:14%;transform:translateX(-50%);z-index:99990;pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:2px;background:#0b1022e6;border:2px solid #ef4444;border-radius:12px;padding:6px 14px}#hkFay div{font:26px Impact,sans-serif;color:#fff;text-shadow:2px 0 #f00,-2px 0 #0ff;letter-spacing:2px}#hkFay small{color:#cbd5e1;font:14px system-ui;background:#000a;padding:3px 8px;border-radius:6px}@keyframes hkG{0%{transform:translate(3px,-2px);filter:hue-rotate(0)}100%{transform:translate(-3px,2px);filter:hue-rotate(90deg)}}'
+'#hkKz{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99980;width:min(440px,92vw);background:#f8fafc;color:#0f172a;border:4px solid #1d4ed8;border-radius:12px;padding:16px;font:15px system-ui;box-shadow:0 20px 60px #000c}#hkKz h3{margin:0 0 8px;color:#1d4ed8;font-size:16px}#hkKz button{display:block;width:100%;margin:6px 0;padding:9px;border:2px solid #1d4ed8;background:#fff;border-radius:8px;font:600 14px system-ui;cursor:pointer}#hkKz button:hover{background:#dbeafe}#hkKz small{color:#64748b}'
+'#hkBtn{position:fixed;right:300px;bottom:14px;z-index:30;display:none;padding:8px 12px;border-radius:12px;border:1px solid #ffffff33;background:linear-gradient(90deg,#b91c1c,#f8fafc 50%,#15803d);color:#111;font:800 13px system-ui;cursor:pointer;text-shadow:0 1px 0 #fff}'
+'#hkPan{position:fixed;inset:5vh 5vw;z-index:9000;display:none;overflow:auto;background:#0b1022f2;color:#e2e8f0;border:1px solid #ffffff22;border-radius:16px;padding:16px;font:13px system-ui}#hkPan .hkF,#hkBtn .hkF{display:inline-block;width:22px;height:14px;margin-right:8px;vertical-align:middle;background:linear-gradient(#ce2939 33%,#fff 33% 66%,#477050 66%);border-radius:2px}#hkPan h2{margin:0 0 8px;font:28px Impact,sans-serif;color:#facc15}#hkPan .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}#hkPan .c{background:#ffffff0d;border:1px solid #ffffff1a;border-radius:10px;padding:8px;cursor:pointer}#hkPan .c.on{border-color:#facc15;background:#facc1522}#hkPan .c i{display:block;color:#94a3b8;font-size:11px;margin-top:4px}#hkPan button{padding:7px 12px;border-radius:9px;border:0;background:#334155;color:#fff;font-weight:700;cursor:pointer;margin:4px 4px 4px 0}';
document.head.appendChild(css);
// ===== billentyűk: Q (ulti-csomagolón át), E, Ú, Í =====
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
window.addEventListener('keydown',e=>{if(typing(e)||!play())return;const k=(e.key||'').toLowerCase();if(k==='ú'){filler();e.preventDefault()}else if(k==='í'){kartya();e.preventDefault()}else if(k==='e'&&G.hk&&(G.hk.ride||nearP())){if(useE()){e.stopImmediatePropagation();e.preventDefault()}}},true);
{const o=window.x20near;window.x20near=function(){try{if(play()&&G.hk&&(G.hk.ride||nearP()))return true}catch(e){}return o?o.apply(this,arguments):false}}
// ===== 16: CENZÚRA SHIELD (chat) =====
const CENZ=/(drága|drágul|infláció|korrupció|lop|késik|nincs pénz|szegény|rossz a gazdaság|tej)/i;
window.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const t=e.target;if(!t||t.tagName!=='INPUT'||!t.closest||!t.closest('#gChat'))return;const v=t.value.trim();if(v&&v[0]!=='/'&&CENZ.test(v)){t.value='A magyar gazdaság szárnyal! 🚀 (moderálva)'}},true);
// ===== chat-parancsok =====
{const o=window.extraCmd;window.extraCmd=function(c){const n=String(c).trim().replace(/^\//,'').split(/\s+/)[0].toLowerCase();
 const need=()=>play()&&G.hk?null:'Ez csak royale-meccsben működik.';
 switch(n){case'hungarikum':case'hungarikumok':openPan();return'Hungarikumok Harca panel megnyitva.';
 case'szerverkifay':fay();return'💥 szerver ki fay (csak vicc)';
 case'himnusz':himnusz();return'📻 Választási Himnusz szól.';
 case'filler':case'fillér':filler();return'🪙 Fillér: '+P.fil;
 case'kartya':case'kártya':kartya();return'💳';
 case'konzultacio':case'konzultáció':return need()||(konz(),'📋');
 case'mav':case'máv':return need()||(EV.mav(G),'🚂');
 case'koncert':return need()||(EV.konc(G),'🎤');
 case'arviz':case'árvíz':return need()||(EV.arviz(G),'🌊');
 case'propaganda':return need()||(EV.prop(G),'📻');}
 return o?o.apply(this,arguments):null}}
// ===== LOBBY: gomb + panel (karakterválasztó, himnusz, lista) =====
const btn=document.createElement('button');btn.id='hkBtn';btn.textContent='🌶️ HUNGARIKUMOK HARCA';btn.onclick=()=>openPan();document.body.appendChild(btn);
const pan=document.createElement('div');pan.id='hkPan';document.body.appendChild(pan);
const MEMO=['🔋 Akkumulátor-gigagyár: mérgező zóna, ellenfél energiája fogy (te is sebződsz)','🛒 Fillérfaló ABC vs. 🧲 Hűtőmágnes Diszkont: lőszer különadóval / csak hűtőmágnes','🏟️ Betonkolosszus Aréna: VIP páholy = 6 mp sérthetetlenség','🚬 Nemzeti Füstbódé: safehouse, a vihar nem sebez, drága lőszer','🚜 Hétpusztai Major: bent az ellenséges lövedékek elakadnak','🌊 Pesti Alsórakpart: eső után horgásztó, a roller elsüllyed','🎤 Rozsdaművek koncert-esemény: loot + moshpit lökések','🏚️ Felújítandó intézmény: Végtelen Alapozás (sosem készül el)','🛴 Elektromos roller: gyors, cikázik, padkaszegély kidob','🎁 Legendás láda: Nemzeti Kártya kell → Hájpcipő (25 mp zóna-mentesség)','🪙 Fillér (Ú): hozzávágod – csak nevet rajta','💳 Nemzeti Kártya (Í): Bürokratikus Fal, 3 mp bénítás','📋 Nemzeti Konzultáció popup: megáll az idő, rossz gomb = mínusz pénz','🚂 MÁV-késés: falevél a sínen, minden mozgás áll','📻 Választási Himnusz: lobby-zene + meccsbeli esemény (10 mp védtelenség)','💬 Cenzúra Shield: a „drága a tej” chatből „a magyar gazdaság szárnyal” lesz','💥 SZERVER KI FAY: ritka képernyő-glitch (a játék fut tovább)'];
function openPan(){const sel=(typeof S!=='undefined'&&S.ch)?S.ch.id:'';pan.innerHTML='<h2><i class="hkF"></i>HUNGARIKUMOK HARCA</h2><div>A 4000 milliárdos fiktív stadion- és lombkoronasétány-komplexum. Válassz hungarikum-hőst (képesség: <b>Q</b>)! <button id="hkHim">📻 Választási Himnusz</button><button id="hkX">✕ Bezár</button></div><div class="g">'
 +HK.map(h=>'<div class="c'+(sel===h[0]?' on':'')+'" data-id="'+h[0]+'"><b>'+h[2]+' '+h[1]+'</b><br>HP '+h[4]+' · PAJZS '+h[5]+'<br>⚡ <b>'+h[7]+'</b>: '+h[8]+' ('+h[9]+' mp)<i>„'+h[10]+FAY+'”</i></div>').join('')+'</div><h3>A pályán és a meccsben</h3><div>'+MEMO.map(m=>'<div>• '+m+'</div>').join('')+'</div><div style="margin-top:6px;color:#94a3b8">Chat: /hungarikum /himnusz /szerverkifay /filler /kartya · meccsben: /konzultacio /mav /koncert /arviz /propaganda</div>';
 pan.style.display='block';pan.querySelector('#hkX').onclick=()=>pan.style.display='none';pan.querySelector('#hkHim').onclick=()=>himnusz();
 pan.querySelectorAll('.c').forEach(d=>d.onclick=()=>{const c=CH.find(x=>x.id===d.dataset.id);if(!c)return;S.ch=c;try{const n=document.getElementById('lbCn');if(n)n.innerHTML='<span style="font-size:20px">'+c.e+'</span> '+c.n+'<br><small style="color:#94a3b8">HP '+c.hp+' · PAJZS '+c.sh+'</small>';if(window.refreshAvatar)refreshAvatar()}catch(e){}try{saveAll()}catch(e){}openPan()})}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pan.style.display==='block')pan.style.display='none'});
setInterval(()=>{const lp=document.getElementById('lbPlay'),on=!!(lp&&lp.offsetParent);if(!play())hud.style.display='none';btn.style.display=on?'block':'none';if(!on&&play())pan.style.display='none'},1000);
// lobby-zene: a lobbyban egyszer, első kattintáskor (autoplay-szabály miatt) felcsendül a himnusz eleje
document.addEventListener('pointerdown',function f(){const lp=document.getElementById('lbPlay');if(lp&&lp.offsetParent){himnusz(16);document.removeEventListener('pointerdown',f)}},true);
window._hk={HK,P,fay,konz,himnusz,ev:EV,abi:ABI,build,near:nearP};
})();
