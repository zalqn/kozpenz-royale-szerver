// sotetplus.js – 🕶️ Sötét Program+: bandatagok, rivális területfoglalás, ügyvéd-minijáték, elágazó történet (5 befejezés),
// élőbb 3D város (napszak, eső, NPC-párbeszéd, zene – sotet3d _sp3fx hook), 3D minijátékok (alku, zár, karaoke). Minden termék kitalált/szatirikus.
(function(){
const api=()=>{try{return window._dp&&window._dp()}catch(e){return null}};
const RI=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const f$=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const say=(t,w,n)=>{try{window._spv&&_spv.say(t,w,n)}catch(e){}};
function X(){const d=api();if(!d)return null;const D=d.D;if(!D.spx)D.spx={gang:[],own:[1,null,'riv',null,null,null,null,'riv'].map(v=>v===1?'me':v),fort:{},atk:{},ch:{},end:null,cand:null,cday:0,log:[]};
 const S=D.spx;S.own=S.own||[];S.fort=S.fort||{};S.atk=S.atk||{};S.ch=S.ch||{};S.gang=S.gang||[];S.log=S.log||[];return{d,D,S}}
const css=document.createElement('style');css.textContent=`
#spxM{position:fixed;inset:0;z-index:2147483500;background:rgba(3,2,10,.8);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;color:#fff}
#spxM .k{background:linear-gradient(160deg,#1e1b4b,#0f0a23);border:1px solid #7c3aed;border-radius:16px;padding:20px 24px;max-width:620px;width:92vw;max-height:88vh;overflow:auto;box-shadow:0 12px 40px #000}
#spxM h2{margin:0 0 8px;background:linear-gradient(90deg,#a78bfa,#f472b6);-webkit-background-clip:text;color:transparent}
#spxM p{line-height:1.5}#spxM button,.spxT button{background:#7c3aed;color:#fff;border:0;border-radius:9px;padding:8px 13px;font-weight:700;cursor:pointer;margin:3px}
#spxM button.s,.spxT button.s{background:#334155}#spxM button:disabled,.spxT button:disabled{opacity:.4;cursor:default}
#spxM .op{display:block;width:100%;text-align:left;background:#312e81;padding:10px 12px;margin:6px 0}#spxM .op:hover{background:#4c1d95}
.spxT h3{margin:14px 0 6px;color:#c4b5fd}.spxT .row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px}
.spxT .g{grid-template-columns:repeat(auto-fill,minmax(290px,1fr))!important}.spxT .mem{display:flex;gap:10px;align-items:center}.spxT .av{font-size:30px}.spxT .pill{display:inline-block;padding:2px 7px;border-radius:7px;background:#1e293b;font-size:11px;margin:1px}
.spxT select{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:7px;padding:4px}
.spxMap{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.spxMap .c{text-align:center;position:relative}.spxMap .me{border-color:#22c55e!important;box-shadow:inset 0 0 18px #22c55e44}.spxMap .riv{border-color:#ef4444!important;box-shadow:inset 0 0 18px #ef444444}
.spxBar{height:16px;background:#0f172a;border-radius:8px;overflow:hidden;margin:4px 0}.spxBar i{display:block;height:100%;transition:width 1.4s}
#spxG{position:fixed;inset:0;z-index:2147483400;background:#05030f;display:none;font-family:system-ui,sans-serif;color:#fff}
#spxG .hd{position:absolute;top:0;left:0;right:0;padding:10px 16px;background:linear-gradient(#000c,#0000);pointer-events:none}#spxG .hd b{font-size:20px}
#spxG .hud{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);background:rgba(8,5,20,.8);border:1px solid #7c3aed88;border-radius:12px;padding:8px 16px;font-weight:700;font-size:16px;text-align:center;pointer-events:none;min-width:320px}
#spxG .q{position:absolute;top:10px;right:14px;background:#ef4444;border:0;color:#fff;border-radius:8px;padding:6px 10px;font-weight:700;cursor:pointer}
#spxB{position:fixed;z-index:2147483000;pointer-events:none;background:#fff;color:#111;border-radius:12px;padding:6px 10px;font:600 13px system-ui;max-width:240px;transform:translate(-50%,-100%);box-shadow:0 4px 14px #0008;display:none}
#spxB:after{content:'';position:absolute;left:50%;bottom:-7px;border:7px solid transparent;border-top-color:#fff;border-bottom:0;margin-left:-7px}
#spxClk{position:fixed;top:62px;left:50%;transform:translateX(-50%);z-index:2147483000;background:rgba(8,5,20,.7);border:1px solid #7c3aed66;border-radius:10px;padding:3px 10px;font:700 13px system-ui;color:#e9d5ff;pointer-events:none;display:none}`;
document.head.appendChild(css);
function modal(html,wire){let m=document.getElementById('spxM');if(m)m.remove();m=document.createElement('div');m.id='spxM';m.innerHTML='<div class="k">'+html+'</div>';document.body.appendChild(m);try{document.exitPointerLock()}catch(e){}wire&&wire(m);return m}
function unmodal(){const m=document.getElementById('spxM');if(m)m.remove();resume()}
function resume(){try{const p=document.getElementById('dp');if(window.sp3On&&sp3On()&&!(p&&p.style.display==='flex')&&!document.getElementById('spxM'))window.sp3Resume&&sp3Resume()}catch(e){}}
const redraw=()=>{try{const p=document.getElementById('dp');if(p&&p.style.display==='flex'){if(myOn)render();else api().draw()}}catch(e){}};
// ============ 1) BANDATAGOK ============
const NAMES=[['Gyors Gyuri','🛵'],['Csendes Csilla','🧕'],['Bringás Bence','🚲'],['Kisrozsdás Karcsi','🧰'],['Okos Orsi','👓'],['Turbó Tamás','🏎️'],['Lassú Laci','🐢'],['Pletykás Panni','📣'],['Futár Feri','📦'],['Kockás Kinga','🎲']];
const TRAIT=[['gyors','+1 egység/nap'],['óvatos','−40% hő'],['dumás','+15% ár'],['szerencsés','kisebb lebukási esély']];
function cands(S,D){if(S.cday!==D.day||!S.cand){S.cday=D.day;const used=S.gang.map(g=>g.n);S.cand=NAMES.filter(n=>!used.includes(n[0])).sort(()=>Math.random()-.5).slice(0,3).map(n=>({n:n[0],e:n[1],tr:RI(0,3),c:RI(15,30)*100}))}return S.cand}
function hire(i){const x=X();if(!x)return;const{D,S,d}=x;const c=cands(S,D)[i];if(!c)return;if(S.gang.length>=4){d.toast('Legfeljebb 4 bandatag lehet.');return}if(D.cash<c.c){d.toast('Nincs elég sötét pénz.');return}
 D.cash-=c.c;S.gang.push({n:c.n,e:c.e,tr:c.tr,lv:1,xp:0,di:0,jail:0,tot:0});S.cand.splice(i,1);d.log('🕴️ Felvetted: '+c.n);say(c.n+' csatlakozott a bandához. Mostantól minden nap kiszállít helyetted.',null,'Narrátor');d.save();render()}
function prods(D,d){return Object.keys(D.inv).filter(k=>d.ITM[k]&&d.ITM[k].t==='pr'&&D.inv[k]>0).sort((a,b)=>d.ITM[b].p-d.ITM[a].p)}
function gangDay(x,rep){const{d,D,S}=x;let earn=0,units=0;S.gang.forEach(g=>{if(g.jail>0){g.jail--;rep.push(g.e+' '+g.n+': még '+(g.jail+1)+' napig a fogdában ül.');return}
  const wage=120*g.lv;if(D.cash<wage){rep.push(g.e+' '+g.n+' sztrájkol – nem kapott bért.');return}D.cash-=wage;
  let cap=g.lv+1+(g.tr===0?1:0);if(S.own[g.di]==='riv')cap=Math.ceil(cap/2);let sold=0,got=0;
  while(cap>0){const p=prods(D,d)[0];if(!p)break;const pr=d.ITM[p].p*d.DIS[g.di][2]*d.mul(g.di,p)*.8*(g.tr===2?1.15:1)*(1+(g.lv-1)*.05);D.inv[p]--;if(!D.inv[p])delete D.inv[p];got+=pr;sold++;cap--;try{d.satAdd(g.di,.5)}catch(e){}}
  if(sold){D.cash+=got;earn+=got;units+=sold;g.tot+=sold;D.stats.sold+=sold;D.stats.earned=(D.stats.earned||0)+got;d.heat(sold*1.5*(g.tr===1?.6:1)*(1-.08*(g.lv-1)));g.xp+=sold;
   const need=6*g.lv;if(g.xp>=need&&g.lv<5){g.xp-=need;g.lv++;rep.push('⬆️ '+g.n+' szintet lépett: '+g.lv+'. szint!')}}
  const risk=(D.heat>65?.12:.03)*(g.tr===3?.5:1);if(sold&&Math.random()<risk){g.jail=2;rep.push('🚔 '+g.n+' lebukott – 2 napig nem dolgozik.')}
  else rep.push(g.e+' '+g.n+' ('+d.DIS[g.di][0]+'): '+sold+' egység, '+f$(got)+' (bér: '+f$(wage)+')')});
 return{earn,units}}
// ============ 2) RIVÁLIS BANDA ============
const pow=(S,D,di)=>S.gang.filter(g=>g.di===di&&!g.jail).reduce((a,g)=>a+g.lv*14,0)+D.rep*.3+(S.fort[di]===D.day?35:0)+S.gang.length*4;
function rivalDay(x,rep){const{d,D,S}=x;const nb=[];for(let i=0;i<8;i++)if(S.own[i]!=='riv')nb.push(i);if(!nb.length){rep.push('🐺 Fecó bandája uralja az egész várost.');return}
 const t=nb.sort((a,b)=>(S.own[b]==='me')-(S.own[a]==='me')+Math.random()-.5)[0],rp=25+D.day*3+RI(0,30),mp=pow(S,D,t);
 if(S.own[t]==='me'){if(rp>mp){S.own[t]='riv';rep.push('⚔️ Fecó bandája ELFOGLALTA: '+d.DIS[t][1]+' '+d.DIS[t][0]+' ('+Math.round(mp)+' vs '+rp+')')}else rep.push('🛡️ Visszavertétek Fecót: '+d.DIS[t][0]+' ('+Math.round(mp)+' vs '+rp+')')}
 else{S.own[t]='riv';rep.push('🐺 Fecó bandája bevonult: '+d.DIS[t][0])}
 let inc=0;S.own.forEach((o,i)=>{if(o==='me')inc+=Math.round(450*d.DIS[i][2])});if(inc){D.cash+=inc;rep.push('🏷️ „Közterület-fenntartási hozzájárulás” a kerületeidből: +'+f$(inc))}
 const rc=S.own.filter(o=>o==='riv').length;if(rc>=5){d.heat(5);rep.push('😠 Fecó feljelentget: +5 hő')}}
function attack(di){const x=X();if(!x)return;const{d,D,S}=x;if(S.atk[di]===D.day){d.toast('Ma már harcoltál itt.');return}if(D.cash<1000){d.toast('Kell 1000 Ft a „mozgósításra”.');return}if(!d.useEnergy(20))return;
 D.cash-=1000;S.atk[di]=D.day;const mp=pow(S,D,di)+RI(10,40),rp=S.own[di]==='riv'?30+D.day*3+RI(0,30):RI(10,35),win=mp>rp;
 modal('<h2>⚔️ Csata: '+d.DIS[di][1]+' '+d.DIS[di][0]+'</h2><p>A bandád (zöld) és Fecó emberei (piros) tolakodnak a piactéren – plakátokkal, hangosbemondóval és egy rakás közbeszerzési szórólappal.</p><div>Te: <b>'+Math.round(mp)+'</b><div class="spxBar"><i id="spxB1" style="width:0;background:#22c55e"></i></div>Fecó: <b>'+rp+'</b><div class="spxBar"><i id="spxB2" style="width:0;background:#ef4444"></i></div></div><h3 id="spxRs" style="opacity:0;transition:opacity .5s">'+(win?'🏆 GYŐZELEM! A kerület a tiéd.':'💥 Vereség. Fecó emberei maradnak.')+'</h3><button data-ok>Rendben</button>',m=>{
  const mx=Math.max(mp,rp);setTimeout(()=>{m.querySelector('#spxB1').style.width=mp/mx*100+'%';m.querySelector('#spxB2').style.width=rp/mx*100+'%'},60);setTimeout(()=>{m.querySelector('#spxRs').style.opacity=1;tone(win?660:180,.3)},1500);m.querySelector('[data-ok]').onclick=()=>{unmodal();render()}});
 if(win){S.own[di]='me';D.rep+=2;d.log('⚔️ Elfoglaltad: '+d.DIS[di][0]);if(S.own.every(o=>o==='me')){D.cash+=20000;d.log('👑 Az egész város a tiéd! +20 000 Ft');say('Az egész város a tiéd, főnök. Fecó felmondott, és elment városi kertésznek.','csaba','Csaba')}}else{d.heat(4);d.log('⚔️ Vereség: '+d.DIS[di][0])}
 d.save()}
function fortify(di){const x=X();if(!x)return;const{d,D,S}=x;if(D.cash<1500){d.toast('Kell 1500 Ft.');return}D.cash-=1500;S.fort[di]=D.day;d.toast('🛡️ Megerősítve ma éjjelre: '+d.DIS[di][0]);d.save();render()}
// ============ 3) ÜGYVÉD-MINIJÁTÉK ============
const CASES=[['Az ügyész szerint a raktáradban 300 doboz „Kék bélyegzőtinta” volt.',['Az kérem irodaszer, a hivatal rendelte.','Nem tudom, ki tette oda.','Az a sógoromé.'],0],
['Tanú látta, hogy éjjel kettőkor csomagokat pakoltál.',['Éjszakai műszakos önkéntes vagyok.','Hivatalos leltár volt, itt a jegyzőkönyv.','Alvajárok.'],1],
['A számládon 2 millió Ft ismeretlen eredetű összeg van.',['Lottón nyertem.','Uniós pályázati „fejlesztési előleg”.','Nem az én számlám.'],1],
['A rendőrség szerint a lakókocsid illegális labor.',['Ez egy mobil kreatív műhely, van rá pályázatunk.','Kempingezni szoktam.','Kölcsönbe kaptam.'],0],
['Riporter Rozi cikke szerint te vagy a „Kiskapu Király”.',['Becsületsértés, beperelem!','A cikk szatíra, a bíró is olvasta.','Rozi a barátnőm.'],1],
['Az ügyész felmutat egy „Kacagó Kampánylufit”.',['Ez kampányeszköz, nem termék.','Ilyet még sosem láttam.','Az a bíróé.'],0]];
function lawyer(lost){const x=X();if(!x)return;const{d,D}=x;const cs=CASES.slice().sort(()=>Math.random()-.5).slice(0,3);let i=0,ok=0;
 say('Razzia volt. Nyugi, főnök, Ügyes Ödön vagyok. A bíróságon mindent visszaszerzünk, ha jól érvelünk.','odon','Ügyes Ödön');
 const step=()=>{if(i>=cs.length){const ref=Math.round(lost*ok*.2),fee=Math.round(ref*.1);D.cash+=ref-fee;D.heat=cl(D.heat-ok*6,0,100);d.log('⚖️ Bírósági ügy: '+ok+'/3 érv elfogadva, visszakaptál '+f$(ref-fee)+' (Ödön díja '+f$(fee)+')');d.save();
   const v=ok===3?'🏛️ FELMENTÉS! A bíró szerint „ez csak papírmunka”.':ok>=1?'⚖️ Részleges siker – a lefoglalt pénz egy része visszajár.':'🔨 Elmarasztalás. Ödön vállat von: „A kiskapu ma zárva volt.”';say(v,'odon','Ügyes Ödön');
   modal('<h2>⚖️ Ítélet</h2><p style="font-size:18px">'+v+'</p><p>Visszakapott pénz: <b>'+f$(ref-fee)+'</b> (Ödön díja: '+f$(fee)+')<br>Hő: −'+ok*6+'%</p><button data-ok>Vissza</button>',m=>m.querySelector('[data-ok]').onclick=()=>{unmodal();redraw()});return}
  const c=cs[i],ord=[0,1,2].sort(()=>Math.random()-.5);
  modal('<h2>⚖️ Bíróság – '+(i+1)+'/3. vád</h2><p>👨‍⚖️ <b>Ügyész:</b> '+c[0]+'</p><p>🧑‍💼 <b>Ödön súgja:</b> „Válassz okosan – a bíró a papírokat szereti.”</p>'+ord.map(j=>'<button class="op" data-a="'+j+'">'+c[1][j]+'</button>').join('')+'<p style="opacity:.7">Elvesztett összeg: '+f$(lost)+' · Elfogadott érvek: '+ok+'</p>',m=>{
   m.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const good=+b.dataset.a===c[2];if(good)ok++;tone(good?740:160,.25);b.style.background=good?'#16a34a':'#b91c1c';m.querySelectorAll('[data-a]').forEach(z=>z.disabled=true);setTimeout(()=>{i++;step()},900)})})};step()}
// ============ 4) ELÁGAZÓ TÖRTÉNET ============
const CHO={3:{w:'pista',t:'Pista hordója',q:'Pálinkás Pista részesedést kér a pince után.',a:[['l','Megkapja a felét – a szó szent.','rep+6, −800 Ft',D=>{D.rep+=6;D.cash-=800}],['g','Elviszed az egészet, Pista majd megérti.','+2000 Ft, +8 hő',D=>{D.cash+=2000;D.heat=cl(D.heat+8,0,100)}]]},
 6:{w:'rozi',t:'Rozi interjúja',q:'Riporter Rozi interjút kér. Mit csinálsz?',a:[['l','Elmondod, hogy csak „kreatív vállalkozó” vagy.','−15 hő, +5 hírnév',D=>{D.heat=cl(D.heat-15,0,100);D.rep+=5}],['g','Megveszed a lapot, ahol dolgozik.','−3000 Ft, −25 hő',D=>{D.cash-=3000;D.heat=cl(D.heat-25,0,100)}]]},
 9:{w:'odon',t:'A nagy kiskapu',q:'Ödön szerint a cég átírható a sógor nevére – vagy építhetsz belőle egy játszóteret.',a:[['g','Sógor-cég, adóparadicsom.','+6000 Ft, +10 hő',D=>{D.cash+=6000;D.heat=cl(D.heat+10,0,100)}],['l','Játszótér a Lakótelepen, névtáblával.','−4000 Ft, +15 hírnév',D=>{D.cash-=4000;D.rep+=15}]]}};
function choice(n){const x=X();if(!x)return;const c=CHO[n];say(c.q,c.w,'');
 modal('<h2>📖 Döntés: '+c.t+'</h2><p>'+c.q+'</p>'+c.a.map((o,j)=>'<button class="op" data-c="'+j+'"><b>'+o[1]+'</b><br><small>'+o[2]+'</small></button>').join('')+'<p style="opacity:.7">A döntéseid alakítják a történet befejezését.</p>',m=>m.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const o=c.a[+b.dataset.c],y=X();o[3](y.D);y.S.ch[n]=o[0];y.d.log('📖 Döntés ('+c.t+'): '+o[1]);y.d.save();unmodal();redraw()}))}
const ENDS={sziget:['🏝️ A sziget','Csabával eltűntök a saját szigeteteken. A kerületekben évekig suttogják a neveteket.'],
 szek:['🏛️ Közgyűlési szék','Pénz, kapcsolatok, nulla rivális: beülsz a közgyűlésbe. Az első rendeleted: a kiskapuk műemlékvédelme.'],
 csaba:['🎭 Csaba csele','Mindig a pénzt választottad – Csaba is. A szigetre egyedül repült, a te nevedre csak a számla maradt.'],
 jatszo:['🛝 A játszótér hőse','A lakótelepi gyerekek a te nevedet viselő csúszdán csúsznak. Tisztes nyugdíj, tiszta lelkiismeret – nagyjából.'],
 feco:['🐺 Fecó győz','Fekete Fecó bandája elfoglalta a várost. A sziget helyett egy faházban írod az emlékirataidat.']};
function ending(S,D){const g=Object.values(S.ch).filter(v=>v==='g').length,l=Object.values(S.ch).filter(v=>v==='l').length,rc=S.own.filter(o=>o==='riv').length;
 return rc>=5?'feco':g>=3?'csaba':l>=3?'jatszo':g>=2&&rc===0?'szek':'sziget'}
function showEnd(k){const e=ENDS[k];let got={};try{got=JSON.parse(localStorage.getItem('k3spEnd')||'{}')}catch(x){}got[k]=1;try{localStorage.setItem('k3spEnd',JSON.stringify(got))}catch(x){}
 say(e[1],'csaba','Befejezés');modal('<h2>🎬 BEFEJEZÉS: '+e[0]+'</h2><p style="font-size:17px">'+e[1]+'</p><p>Felfedezett befejezések: '+Object.keys(got).length+' / 5 – új mentéssel a többit is megnézheted.</p><button data-ok>Vége</button>',m=>m.querySelector('[data-ok]').onclick=()=>unmodal())}
// ============ 6) 3D MINIJÁTÉKOK ============
let GR=null,GON=false,graf=0,gst=null;const GW=()=>{let w=document.getElementById('spxG');if(!w){w=document.createElement('div');w.id='spxG';w.innerHTML='<div class="hd"><b></b><div></div></div><div class="hud"></div><button class="q">✖ Feladom</button>';document.body.appendChild(w)}return w};
const oSp=window.spmgOn;window.spmgOn=()=>GON||!!(oSp&&oSp());
const LT=(SC)=>{SC.add(new THREE.AmbientLight(0xffffff,.45));const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(3,6,5);SC.add(dl)};
const PLx=(c,i,dst)=>{const L=typeof _PL!=='undefined'?_PL:THREE.PointLight;return new L(c,i,dst)};
function g3(title,info,setup,cb){if(!window.THREE){cb(0);return}const w=GW();w.style.display='block';w.querySelector('.hd b').textContent=title;w.querySelector('.hd div').textContent=info;const hud=w.querySelector('.hud');
 if(!GR){GR=new THREE.WebGLRenderer({antialias:true});GR.setPixelRatio(Math.min(devicePixelRatio,1.5));w.insertBefore(GR.domElement,w.firstChild)}GR.setSize(innerWidth,innerHeight);
 const SC=new THREE.Scene(),CAM=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,100);LT(SC);GON=true;try{document.exitPointerLock()}catch(e){}
 let done=false,t=0,last=performance.now();const fin=s=>{if(done)return;done=true;GON=false;cancelAnimationFrame(graf);removeEventListener('keydown',kd,true);w.style.display='none';
  SC.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)[].concat(o.material).forEach(m=>{m.map&&m.map.dispose();m.dispose()})});setTimeout(()=>{cb(s);resume()},30)};
 const G=setup({SC,CAM,hud,fin,B:(x,y,z,c,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),new THREE.MeshLambertMaterial(Object.assign({color:c},o||{})));SC.add(m);return m}});
 const kd=e=>{if(e.key==='Escape'){fin(0)}else G.key&&G.key(e.key.toLowerCase());e.stopPropagation();e.preventDefault()};addEventListener('keydown',kd,true);
 GR.domElement.onmousemove=e=>G.move&&G.move(e.clientX/innerWidth,e.clientY/innerHeight);GR.domElement.onmousedown=()=>G.down&&G.down();w.querySelector('.q').onclick=()=>fin(0);
 const lp=n=>{if(done)return;graf=requestAnimationFrame(lp);const dt=Math.min(.05,(n-last)/1000);last=n;t+=dt;G.tick(dt,t);GR.render(SC,CAM)};graf=requestAnimationFrame(lp)}
// 🤝 Alku 3D – piaci stand, vevő türelme a színén és a mozgásán látszik
function haggle3(base,cb){g3('🤝 Alku – piaci stand','Egér balra-jobbra = ár, kattintás = ajánlat. Ha túl drága, a vevő rázza a fejét és fogy a türelme.',({SC,CAM,hud,fin,B})=>{
 SC.background=new THREE.Color(0x1a1033);CAM.position.set(0,2.2,5.2);CAM.lookAt(0,1.2,0);B(8,.1,6,0x3f3f46).position.y=-.05;const ct=B(3.4,1,1,0x92400e);ct.position.set(0,.5,1);B(3.6,.08,1.6,0xbe185d).position.set(0,2.6,.8);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.35,.42,1.3,14),new THREE.MeshLambertMaterial({color:0x0ea5e9}));body.position.set(0,1.1,-.4);SC.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.3,16,12),new THREE.MeshLambertMaterial({color:0xfcd34d}));head.position.set(0,2.05,-.4);SC.add(head);
 [-1,1].forEach(s=>{const e=B(.07,.07,.02,0x111111);e.position.set(s*.11,2.12,-.12);head.attach(e)});
 const coins=[];const cg=new THREE.CylinderGeometry(.16,.16,.05,16),cm=new THREE.MeshLambertMaterial({color:0xfacc15});for(let i=0;i<20;i++){const c=new THREE.Mesh(cg,cm);c.position.set(.9,1.03+i*.055,1.1);SC.add(c);coins.push(c)}
 const pl=PLx(0xf472b6,1.4,8);pl.position.set(0,2.4,2);SC.add(pl);
 let p=.5,pat=1,shake=0,tries=0;const lim=.55+Math.sin(base)*.2;
 return{move:x=>{p=cl((x-.15)/.7,0,1)},down:()=>{if(p<=lim+pat*.15){tone(880,.2);fin((0.6+p*.9)/1.5)}else{shake=.7;pat-=.25;tries++;tone(150,.2);if(pat<=0)fin(0)}},
  tick:(dt,t)=>{pat-=dt/12;if(pat<=0){fin(0);return}const n=Math.round(p*19)+1;coins.forEach((c,i)=>c.visible=i<n);
   head.material.color.setHSL(.13-.13*(1-pat),.9,.6);shake=Math.max(0,shake-dt);head.rotation.y=shake?Math.sin(t*30)*.5:Math.sin(t*1.3)*.15;body.position.y=1.1+Math.sin(t*(2+(1-pat)*6))*.03;
   hud.innerHTML='Ár: <b style="color:#fde68a">'+f$(base*(0.6+p*.9))+'</b> · Türelem: '+'❤️'.repeat(Math.ceil(pat*5))+(tries?' · „Ez túl sok!”':'')}}},cb)}
// 🔓 Zár 3D – forgó tű, arany rés, csapok emelkednek
function lock3(cb){g3('🔓 Zárfeltörés','Kattints / SPACE, amikor a tű az arany résnél jár! 5 csap, 25 mp.',({SC,CAM,hud,fin,B})=>{
 SC.background=new THREE.Color(0x0b0b14);CAM.position.set(0,0,6);CAM.lookAt(0,0,0);
 const face=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,.4,48),new THREE.MeshLambertMaterial({color:0x475569}));face.rotation.x=Math.PI/2;SC.add(face);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.7,.12,8,64),new THREE.MeshLambertMaterial({color:0x334155}));ring.position.z=.25;SC.add(ring);
 const gapM=new THREE.Mesh(new THREE.TorusGeometry(1.7,.16,8,16,.44),new THREE.MeshBasicMaterial({color:0xfacc15}));gapM.position.z=.28;SC.add(gapM);
 const piv=new THREE.Group();piv.position.z=.4;SC.add(piv);const nd=B(1.9,.08,.08,0xffffff);nd.position.x=.95;piv.add(nd);
 const pins=[];for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.5,12),new THREE.MeshLambertMaterial({color:0x475569}));m.position.set(-1+i*.5,2.45,0);SC.add(m);pins.push(m)}
 const pl=PLx(0xfacc15,.35,10);pl.position.set(0,1,4);SC.add(pl);
 let n=0,ang=0,gap=Math.random()*6.28,spd=2;const hit=()=>{const dd=Math.abs(((ang-gap)%6.283+9.42)%6.283-3.14);if(dd<.24){pins[n].material.color.setHex(0x22c55e);n++;tone(500+n*120,.15);spd=-(Math.sign(spd)*(2+n*.7));gap=Math.random()*6.28;if(n>=5)fin(1)}else{tone(120,.3);fin(n/5)}};
 return{down:hit,key:k=>{if(k===' ')hit()},tick:(dt,t)=>{ang+=spd*dt;piv.rotation.z=ang;gapM.rotation.z=gap-.22;pins.forEach((p,i)=>p.position.y+=((i<n?2.85:2.45)-p.position.y)*dt*8);hud.textContent='Csapok: '+n+'/5 · '+Math.max(0,25-t).toFixed(0)+' mp';if(t>25)fin(n/5)}}},cb)}
// 🎤 Karaoke 3D – színpad, közönség, ütemre SPACE
const SONGS=[['Köz','pénz','ből','ra','kok','pa','lo','tát,','ki','ska','pun','kon','át','me','gyek','át!'],['Pá','lyá','zat','ra','ír','tam','egy','dalt,','min','den','ki','a','ján','dé','kot','kapt!'],['Bé','lyeg','ző','tin','ta','kék','e','ge,','e','zen','szól','a','nó','tánk','e','ge!']];
function karaoke3(cb){const L=pick(SONGS);g3('🎤 Afterparti karaoke – „Közpénz-blues”','SPACE vagy kattintás, amikor a szótag a vonalhoz ér! Minden pontos ütem hírnevet ér.',({SC,CAM,hud,fin,B})=>{
 SC.background=new THREE.Color(0x12051f);CAM.position.set(0,3,8);CAM.lookAt(0,1.4,0);B(9,.4,4,0x1e1b4b).position.set(0,.2,-1);
 const st=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,1.6,8),new THREE.MeshLambertMaterial({color:0x9ca3af}));st.position.set(0,1.2,0);SC.add(st);const mic=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),new THREE.MeshLambertMaterial({color:0x111827}));mic.position.set(0,2.05,0);SC.add(mic);
 const singer=new THREE.Mesh(new THREE.CylinderGeometry(.3,.35,1.2,12),new THREE.MeshLambertMaterial({color:0xdb2777}));singer.position.set(0,1,-.6);SC.add(singer);
 const crowd=[];const cg=new THREE.BoxGeometry(.4,.8,.4);for(let i=0;i<14;i++){const m=new THREE.Mesh(cg,new THREE.MeshLambertMaterial({color:new THREE.Color().setHSL(Math.random(),.6,.5)}));m.position.set(-4+i*.62,.4,3+(i%2)*.8);SC.add(m);crowd.push(m)}
 const lights=[0xf472b6,0x22d3ee,0xfacc15].map((c,i)=>{const l=PLx(c,1.5,9);l.position.set(-3+i*3,3.5,1);SC.add(l);return l});
 const beat=.55,tot=L.length;let idx=0,hits=0,score=0;const T0=1.5;
 const check=t=>{const k=Math.round((t-T0)/beat);if(k<0||k>=tot)return;const off=Math.abs(t-T0-k*beat);if(k>=idx&&off<.16){hits++;idx=k+1;tone(440+(k%4)*110,.12);singer.scale.y=1.15}else tone(110,.1)};
 let tt=0;return{down:()=>check(tt),key:k=>{if(k===' ')check(tt)},tick:(dt,t)=>{tt=t;const k=Math.floor((t-T0)/beat);if(k>idx&&k<=tot)idx=Math.max(idx,k);
  singer.scale.y+=(1-singer.scale.y)*dt*6;crowd.forEach((c,i)=>c.position.y=.4+Math.abs(Math.sin(t*5.7+i))*(.1+hits/tot*.4));lights.forEach((l,i)=>l.intensity=1+Math.sin(t*4+i*2));
  let s='';for(let j=-1;j<5;j++){const q=Math.floor((t-T0)/beat)+j;if(q>=0&&q<tot){const ph=(t-T0)/beat-q;s+='<span style="display:inline-block;width:70px;color:'+(j===0&&ph<.3?'#facc15':j<0?'#64748b':'#fff')+';font-size:'+(j===0?24:16)+'px">'+L[q]+'</span>'}}
  hud.innerHTML=(t<T0?'Készülj… ':'')+s+'<br><small>Találat: '+hits+'/'+tot+'</small>';if(t>T0+tot*beat+.8)fin(hits/tot)}}},cb)}
function karaokeRun(){const x=X();if(!x)return;if(!x.d.useEnergy(10))return;karaoke3(s=>{const y=X();const r=Math.round(s*8);y.D.rep+=r;y.D.cash+=Math.round(s*900);y.d.log('🎤 Karaoke: '+Math.round(s*100)+'% · +'+r+' hírnév');y.d.toast('🎤 '+Math.round(s*100)+'% – +'+r+' hírnév, +'+f$(s*900));y.d.save();redraw()})}
// régi 2D alku/zár csere (k3spmg2d='1' = régi 2D)
function patchMG(){const d=api();if(!d||!d.MG||d.MG._spx)return!!(d&&d.MG&&d.MG._spx);const M=d.MG,oh=M.haggle,ol=M.lock;M._spx=1;
 M.haggle=(b,cb)=>{if(localStorage.getItem('k3spmg2d')==='1')return oh(b,cb);haggle3(b,cb)};M.lock=cb=>{if(localStorage.getItem('k3spmg2d')==='1')return ol(cb);lock3(cb)};M.karaoke=karaoke3;return true}
// ============ PANEL-FÜL ============
let myOn=false;
function render(){const x=X(),r=document.getElementById('dp');if(!x||!r)return;const M=r.querySelector('#dpmain');if(!M)return;const{d,D,S}=x;myOn=true;
 r.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.id==='spxNav'));const sub=r.querySelector('nav.sub');if(sub)sub.style.display='none';
 const C=cands(S,D),got=(()=>{try{return JSON.parse(localStorage.getItem('k3spEnd')||'{}')}catch(e){return{}}})();
 M.innerHTML='<div class="spxT"><div class="say">🧥 <b>Csavaros Csaba:</b> „Egyedül nem megy, főnök. Kell egy banda – és meg kell védeni a kerületeinket Fecótól.”</div>'+
 '<h3>🕴️ Bandatagok ('+S.gang.length+'/4) – minden alváskor automatikusan kiszállítanak</h3><div class="g">'+(S.gang.length?S.gang.map((g,i)=>'<div class="c mem"><span class="av">'+g.e+'</span><div><b>'+g.n+'</b> · '+g.lv+'. szint<br><span class="pill">'+TRAIT[g.tr][0]+': '+TRAIT[g.tr][1]+'</span><span class="pill">XP '+g.xp+'/'+6*g.lv+'</span><span class="pill">bér '+f$(120*g.lv)+'/nap</span><span class="pill">eddig '+g.tot+' egység</span>'+(g.jail?'<span class="pill" style="background:#7f1d1d">🚔 fogda '+g.jail+' nap</span>':'')+'<br>Kerület: <select data-di="'+i+'">'+d.DIS.map((z,j)=>'<option value="'+j+'"'+(j===g.di?' selected':'')+'>'+z[1]+' '+z[0]+(S.own[j]==='riv'?' (Fecó)':S.own[j]==='me'?' (tiéd)':'')+'</option>').join('')+'</select> <button class="s" data-fire="'+i+'">Elbocsát</button></div></div>').join(''):'<div class="c">Még nincs bandatagod.</div>')+'</div>'+
 '<h3>📋 Jelentkezők ma</h3><div class="g">'+C.map((c,i)=>'<div class="c"><span class="av">'+c.e+'</span> <b>'+c.n+'</b><br><span class="pill">'+TRAIT[c.tr][0]+': '+TRAIT[c.tr][1]+'</span><br><button data-h="'+i+'"'+(S.gang.length>=4||D.cash<c.c?' disabled':'')+'>Felvétel – '+f$(c.c)+'</button></div>').join('')+'</div>'+
 '<h3>🗺️ Területek – Fecó bandája minden éjjel támad</h3><div class="spxMap">'+d.DIS.map((z,i)=>{const o=S.own[i];return'<div class="c '+(o||'')+'"><div style="font-size:26px">'+z[1]+'</div><b>'+z[0]+'</b><br><small>'+(o==='me'?'✅ A tiéd · +'+f$(450*z[2])+'/nap':o==='riv'?'🐺 Fecó bandája':'⚪ Szabad')+'</small><br><small>Erőd itt: '+Math.round(pow(S,D,i))+'</small><br>'+(o==='me'?'<button class="s" data-f="'+i+'"'+(S.fort[i]===D.day?' disabled':'')+'>🛡️ Erősítés 1500</button>':'<button data-a="'+i+'"'+(S.atk[i]===D.day?' disabled':'')+'>⚔️ Támadás (1000, ⚡20)</button>')+'</div>'}).join('')+'</div>'+
 '<h3>🎤 Szórakozás</h3><div class="row"><button data-k>🎤 Karaoke 3D (⚡10)</button><button class="s" data-lk>🔓 Zár-gyakorlás 3D</button><button class="s" data-hg>🤝 Alku-gyakorlás 3D</button></div>'+
 '<h3>📖 Döntéseid és befejezések</h3><div class="c">'+Object.keys(CHO).map(n=>'<div>'+CHO[n].t+': <b>'+(S.ch[n]==='g'?'💰 kapzsi':S.ch[n]==='l'?'🤝 tisztességes':'– még előtted')+'</b></div>').join('')+'<div style="margin-top:6px">Befejezések: '+Object.keys(ENDS).map(k=>'<span class="pill">'+(got[k]?ENDS[k][0]:'🔒 ???')+'</span>').join('')+'</div></div>'+
 '<h3>🌆 3D város</h3><div class="row"><button class="s" data-mu>'+(CFG.mus?'🎵 Zene: BE':'🔇 Zene: KI')+'</button><button class="s" data-rn>'+(CFG.rain?'🌧️ Eső: automatikus':'☀️ Eső: KI')+'</button></div>'+
 '<h3>📰 Utolsó éjszakai jelentés</h3><div class="c">'+(S.log.length?S.log.join('<br>'):'Még nem volt éjszaka a banda óta.')+'</div></div>';
 M.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>hire(+b.dataset.h));M.querySelectorAll('[data-fire]').forEach(b=>b.onclick=()=>{S.gang.splice(+b.dataset.fire,1);d.save();render()});
 M.querySelectorAll('select[data-di]').forEach(s=>s.onchange=()=>{S.gang[+s.dataset.di].di=+s.value;d.save();render()});M.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>attack(+b.dataset.a));M.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>fortify(+b.dataset.f));
 M.querySelector('[data-k]').onclick=karaokeRun;M.querySelector('[data-lk]').onclick=()=>lock3(s=>{api().toast('🔓 Gyakorlás: '+Math.round(s*100)+'%')});M.querySelector('[data-hg]').onclick=()=>haggle3(3,s=>{api().toast(s>0?'🤝 Alku sikerült!':'🙅 A vevő otthagyott.')});
 M.querySelector('[data-mu]').onclick=()=>{CFG.mus=!CFG.mus;svC();if(!CFG.mus)musStop();render()};M.querySelector('[data-rn]').onclick=()=>{CFG.rain=!CFG.rain;svC();render()}}
function navHook(){const r=document.getElementById('dp');if(!r||r.style.display!=='flex')return;const nav=r.querySelector('nav');if(!nav)return;
 if(!nav.querySelector('#spxNav')){const b=document.createElement('button');b.id='spxNav';b.textContent='🕴️ Banda';b.onclick=e=>{e.stopPropagation();render()};nav.insertBefore(b,nav.children[2]||null);
  nav.parentNode.querySelectorAll('nav button').forEach(z=>{if(z!==b)z.addEventListener('click',()=>{myOn=false},true)});if(myOn)render()}}
// ============ NAPI ÉS ESEMÉNYFIGYELŐ ============
let askT=0,lastDay=null,lastBust=null,lastCash=0,lastSq=null;
setInterval(()=>{const x=X();if(!x)return;const{d,D,S}=x;patchMG();navHook();
 if(lastDay===null){lastDay=D.day;lastBust=D.stats.bust;lastCash=D.cash;lastSq=D.sq;return}
 if(D.stats.bust>lastBust){const lost=Math.max(0,lastCash-D.cash);lastBust=D.stats.bust;setTimeout(()=>lawyer(Math.max(lost,500)),600)}
 if(D.day>lastDay){lastDay=D.day;const rep=[];gangDay(x,rep);rivalDay(x,rep);S.log=rep.slice(0,12);d.save();if(S.gang.length||rep.length)modal('<h2>🌙 Éjszakai jelentés – '+D.day+'. nap</h2><p>'+rep.join('<br>')+'</p><button data-ok>Rendben</button>',m=>m.querySelector('[data-ok]').onclick=()=>{unmodal();redraw()})}
 if(D.sq>=d.STORY.length&&!S.end){S.end=ending(S,D);d.save();setTimeout(()=>showEnd(S.end),2600)}
 if(CHO[D.sq]&&!S.ch[D.sq]&&!document.getElementById('spxM')&&document.getElementById('dp')&&document.getElementById('dp').style.display==='flex'&&performance.now()>askT){askT=performance.now()+60000;choice(D.sq)}
 lastCash=D.cash},700);
// ============ 5) ÉLŐBB 3D VÁROS ============
let CFG={mus:true,rain:true};try{Object.assign(CFG,JSON.parse(localStorage.getItem('k3spx')||'{}'))}catch(e){}const svC=()=>{try{localStorage.setItem('k3spx',JSON.stringify(CFG))}catch(e){}};
let AC=null;const ac=()=>{try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume()}catch(e){}return AC};
function tone(f,d){const a=ac();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.08,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
let musT=0,musI=0,rainSrc=null,rainG=null;const SCALE=[220,261.6,293.7,329.6,392,440];
function musTick(dt,night){if(!CFG.mus)return;musT-=dt;if(musT>0)return;musT=.42;const a=ac();if(!a)return;try{const f=SCALE[[0,2,4,2,3,1,5,4][musI++%8]]*(night?.5:1),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,a.currentTime);g.gain.linearRampToValueAtTime(.025,a.currentTime+.05);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.9);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.95)}catch(e){}}
function musStop(){}
function rainSnd(on){const a=ac();if(!a)return;try{if(on&&!rainSrc){const b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1;rainSrc=a.createBufferSource();rainSrc.buffer=b;rainSrc.loop=true;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=1200;rainG=a.createGain();rainG.gain.value=.03;rainSrc.connect(f).connect(rainG).connect(a.destination);rainSrc.start()}
 else if(!on&&rainSrc){rainSrc.stop();rainSrc=null}}catch(e){}}
const LINES=['„Hallotta? Megint új szökőkút épül, pedig a régi se működik.”','„A sógorom cége nyerte a járdafelújítást. Meg a járdabontást is.”','„Ilyen kék tintát még a postán se láttam!”','„Állítólag Fecó emberei a Kikötőben szórólapoznak.”','„Esik? Biztos az is pályázati pénzből.”','„Láttam a kampánylufit, egész nap kacagtam.”','„Riporter Rozi megint itt szimatolt.”','„Szilárd felügyelő ma morcos – vigyázz a hővel!”','„Ez a város éjjel él igazán, nappal csak tervezik.”'];
let RAIN=null,rpos=null,rainOn=false,bub=null,bubT=0,bubP=null,lastFx=0,clk=null;const cN=new THREE.Color(0x0b1026),cD=new THREE.Color(0x6b8fc7),cS=new THREE.Color(0x7c3a5a),cT=new THREE.Color(),v3=new THREE.Vector3();
window._sp3fx=(dt,o)=>{lastFx=performance.now();const D=(api()||{}).D;if(!clk){clk=document.createElement('div');clk.id='spxClk';document.body.appendChild(clk);bub=document.createElement('div');bub.id='spxB';document.body.appendChild(bub)}
 const tod=((o.clock/300)+.85)%1,sun=Math.max(0,Math.sin(tod*Math.PI*2)),hh=Math.floor(tod*24),mm=Math.floor(tod*1440%60);
 const wantRain=CFG.rain&&D&&((D.day*7+Math.floor(o.clock/150))%4===0);
 if(!o.INSIDE){const k=rainOn?.6:1;if(o.HEMI)o.HEMI.intensity=(.3+.55*sun)*k;if(o.MOON)o.MOON.intensity=(.35+.5*sun)*k;
  cT.copy(cN).lerp(sun<.25?cS:cD,Math.min(1,sun*2.2));if(rainOn)cT.multiplyScalar(.7);if(o.SC.background&&o.SC.background.isColor)o.SC.background.copy(cT);o.SC.fog.color.copy(cT);
  if(!RAIN){const N=1400,g=new THREE.BufferGeometry();rpos=new Float32Array(N*3);for(let i=0;i<N;i++){rpos[i*3]=Math.random()*60-30;rpos[i*3+1]=Math.random()*25;rpos[i*3+2]=Math.random()*60-30}g.setAttribute('position',new THREE.BufferAttribute(rpos,3));
   RAIN=new THREE.Points(g,new THREE.PointsMaterial({color:0x9ecbff,size:.09,transparent:true,opacity:.7}));RAIN.frustumCulled=false}
  if(RAIN.parent!==o.SC)o.SC.add(RAIN);rainOn=wantRain;RAIN.visible=rainOn;
  if(rainOn){const cx=o.INCAR?o.car.x:o.px,cz=o.INCAR?o.car.z:o.pz;RAIN.position.set(cx,0,cz);for(let i=1;i<rpos.length;i+=3){rpos[i]-=dt*22;if(rpos[i]<0)rpos[i]+=25}RAIN.geometry.attributes.position.needsUpdate=true}
  rainSnd(rainOn);musTick(dt,sun<.2);
  // NPC-párbeszéd: a legközelebbi járókelő megszólal
  bubT-=dt;const L=window._sp3life;if(L&&L.peds&&!o.INCAR){if(bubT<=0){let best=null,bd=3.2;L.peds.forEach(p=>{const x=p.ax==='x'?p.t:p.line,z=p.ax==='x'?p.line:p.t,dd=Math.hypot(x-o.px,z-o.pz);if(dd<bd){bd=dd;best=p}});
    if(best){bubP=best;bubT=6;bub.textContent=pick(LINES);bub.style.display='block';tone(520,.08)}else{bubP=null;bub.style.display='none'}}
   if(bubP&&bubT>2){const x=bubP.ax==='x'?bubP.t:bubP.line,z=bubP.ax==='x'?bubP.line:bubP.t;v3.set(x,2.3,z).project(o.CAM);if(v3.z<1){bub.style.left=(v3.x*.5+.5)*innerWidth+'px';bub.style.top=(-v3.y*.5+.5)*innerHeight+'px';bub.style.display='block'}else bub.style.display='none'}else if(bubT<=2)bub.style.display='none'}
  clk.style.display='block';clk.textContent=(sun>.15?'☀️':sun>0?'🌅':'🌙')+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+(rainOn?' · 🌧️ eső':'')}
 else{if(RAIN)RAIN.visible=false;rainSnd(false);clk.style.display='none';if(bub)bub.style.display='none'}};
setInterval(()=>{if(performance.now()-lastFx>600){if(clk)clk.style.display='none';if(bub)bub.style.display='none';if(rainSrc)rainSnd(false)}},500);
window._spx={X,hire,attack,fortify,lawyer,choice,showEnd,ending,haggle3,lock3,karaoke3,render,gangDay:()=>{const x=X(),r=[];gangDay(x,r);rivalDay(x,r);return r},CFG};
})();
