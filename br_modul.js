// ===== ZALQN ROYALE: tárgybolt, szekrény, szezonbérlet, táncok =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const RAR={k:{n:'KÖZÖNSÉGES',c:'#9ca3af',bg:'linear-gradient(#6b7280,#374151)'},r:{n:'RITKA',c:'#38bdf8',bg:'linear-gradient(#0ea5e9,#1e3a8a)'},e:{n:'EPIKUS',c:'#c084fc',bg:'linear-gradient(#a855f7,#4c1d95)'},l:{n:'LEGENDÁS',c:'#fb923c',bg:'linear-gradient(#f97316,#7c2d12)'},m:{n:'MÍTIKUS',c:'#facc15',bg:'linear-gradient(#facc15,#854d0e)'}};
const PRICE={k:200,r:500,e:900,l:1500,m:2200};
const TYP={skin:'KINÉZET',back:'HÁTTÁSKA',glide:'SIKLÓ',emote:'TÁNC',trail:'NYOMVONAL'};
// Saját tárgyak (eredeti, a játék humorához illő)
const COS=[
 {id:'s_def',t:'skin',n:'Alap Öltöny',e:'🕴️',r:'k',c:0x1f2937,free:1},
 {id:'s_gold',t:'skin',n:'Aranyozott Tanácsadó',e:'🤑',r:'l',c:0xd4af37},
 {id:'s_neon',t:'skin',n:'Neon Pályázatíró',e:'😎',r:'e',c:0x22d3ee},
 {id:'s_kom',t:'skin',n:'Kommandós Könyvelő',e:'🥷',r:'e',c:0x111827},
 {id:'s_tur',t:'skin',n:'Balatoni Turista',e:'🩳',r:'r',c:0xf472b6},
 {id:'s_mav',t:'skin',n:'Késő Kalauz',e:'🚂',r:'r',c:0x2563eb},
 {id:'s_krum',t:'skin',n:'Krumpli Lovag',e:'🥔',r:'m',c:0xa16207},
 {id:'s_zold',t:'skin',n:'Zöld Kordonos',e:'🚧',r:'k',c:0x16a34a},
 {id:'s_pira',t:'skin',n:'Offshore Kalóz',e:'🏴‍☠️',r:'l',c:0x7f1d1d},
 {id:'s_robo',t:'skin',n:'Ügyfélkapu-Robot',e:'🤖',r:'e',c:0x94a3b8},
 {id:'s_nagy',t:'skin',n:'Piacos Nagyi',e:'👵',r:'r',c:0x7c3aed},
 {id:'s_kir',t:'skin',n:'Közpénz-Király',e:'👑',r:'m',c:0xfacc15,bp:1},
 {id:'b_none',t:'back',n:'Nincs',e:'',r:'k',free:1},
 {id:'b_akta',t:'back',n:'Titkos Aktatáska',e:'💼',r:'r'},
 {id:'b_krumpl',t:'back',n:'Krumpliszsák',e:'🥔',r:'k'},
 {id:'b_penz',t:'back',n:'Pénzeszsák',e:'💰',r:'e'},
 {id:'b_hal',t:'back',n:'Balatoni Keszeg',e:'🐟',r:'r'},
 {id:'b_rak',t:'back',n:'Rakéta-Hátizsák',e:'🚀',r:'l'},
 {id:'b_kor',t:'back',n:'Arany Korona',e:'👑',r:'m',bp:1},
 {id:'g_def',t:'glide',n:'Ejtőernyő',e:'🪂',r:'k',free:1},
 {id:'g_heli',t:'glide',n:'Magánhelikopter',e:'🚁',r:'l'},
 {id:'g_ufo',t:'glide',n:'Kétfarkú UFO',e:'🛸',r:'e'},
 {id:'g_luf',t:'glide',n:'Kampánylufi',e:'🎈',r:'r'},
 {id:'g_sz',t:'glide',n:'Szőnyeg-Repülő',e:'🧞',r:'l',bp:1},
 {id:'e_tap',t:'emote',n:'Taps a Sajtónak',e:'👏',r:'k',free:1,say:'Köszönöm, köszönöm!'},
 {id:'e_tanc',t:'emote',n:'Lakodalmas Tánc',e:'💃',r:'r',say:'Húzzad csak, húzzad!'},
 {id:'e_penz',t:'emote',n:'Pénzszórás',e:'💸',r:'e',say:'Jut is, marad is!'},
 {id:'e_flex',t:'emote',n:'Kétharmados Flex',e:'💪',r:'l',say:'Ezt nevezem többségnek!'},
 {id:'e_kacs',t:'emote',n:'Kacsintás a Kamerába',e:'😉',r:'r',say:'Ezt vágjátok ki!'},
 {id:'e_ugr',t:'emote',n:'Győzelmi Ugrálás',e:'🕺',r:'m',bp:1,say:'Közpénz-király vagyok!'},
 {id:'t_none',t:'trail',n:'Nincs',e:'',r:'k',free:1},
 {id:'t_penz',t:'trail',n:'Bankjegy-csík',e:'💶',r:'e'},
 {id:'t_csil',t:'trail',n:'Csillámpor',e:'✨',r:'r'},
 {id:'t_tuz',t:'trail',n:'Lángnyelv',e:'🔥',r:'l',bp:1},
];
const byId=id=>COS.find(c=>c.id===id);window.BRCOS=COS;
// Mentett állapot
const B=Object.assign({zs:1500,own:{},eq:{skin:'s_def',back:'b_none',glide:'g_def',emote:'e_tap',trail:'t_none'},bpx:0,bpPrem:false,claimed:{}},st.g('k3br',{}));
COS.forEach(c=>{if(c.free)B.own[c.id]=1});
const bsave=()=>st.s('k3br',B);bsave();
const zfmt=n=>Math.round(n).toLocaleString('hu-HU')+' 🪙';
window.BR=B;
// --- Napi bolt (dátum alapján forgó kínálat) ---
function seeded(seed){let x=seed>>>0||1;return()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296}}
function shopToday(){const d=new Date(),seed=d.getFullYear()*1000+d.getMonth()*40+d.getDate(),r=seeded(seed),pool=COS.filter(c=>!c.free&&!c.bp),a=pool.slice();for(let i=a.length-1;i>0;i--){const j=(r()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}
 const feat=a.filter(c=>c.r==='l'||c.r==='e').slice(0,3),daily=a.filter(c=>!feat.includes(c)).slice(0,6);return{feat,daily}}
function untilMidnight(){const n=new Date(),m=new Date(n);m.setHours(24,0,0,0);const s=Math.floor((m-n)/1000);return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function card(c,act){const R_=RAR[c.r],own=B.own[c.id],eq=B.eq[c.t]===c.id;
 return '<div class="it" style="background:'+R_.bg+';border-color:'+R_.c+';text-align:center;cursor:pointer" onclick="'+act+'"><div style="font-size:46px;line-height:1.2">'+(c.e||'🚫')+'</div><div class="f" style="font-size:16px">'+c.n+'</div><small style="color:#fff;opacity:.85">'+TYP[c.t]+' · '+R_.n+'</small>'+
 (act.startsWith('brBuy')?'<div class="f" style="margin-top:6px;color:'+(own?'#86efac':'#fde68a')+'">'+(own?'✔ MEGVAN':zfmt(PRICE[c.r]))+'</div>':'<div class="f" style="margin-top:6px;color:#fde68a">'+(eq?'✔ FELSZERELVE':'FELSZEREL')+'</div>')+'</div>'}
window.brShop=function(msg){const s=shopToday();guiOpen('<h1 class="f" style="font-size:32px">🛒 TÁRGYBOLT</h1><div class="f" style="color:var(--y)">'+(msg||'')+'</div><div style="display:flex;justify-content:space-between;margin:6px 0"><span class="f">ZSETON: <span style="color:var(--y)">'+zfmt(B.zs)+'</span></span><span style="color:#cbd5e1">Új kínálat: <b id="brCd">'+untilMidnight()+'</b></span></div>'+
 '<h2 class="f" style="text-align:left">⭐ KIEMELT</h2><div class="g">'+s.feat.map(c=>card(c,"brBuy('"+c.id+"')")).join('')+'</div><h2 class="f" style="text-align:left;margin-top:12px">📅 NAPI</h2><div class="g">'+s.daily.map(c=>card(c,"brBuy('"+c.id+"')")).join('')+'</div>'+
 bB('🪙 ZSETON VÁLTÁS: 50 000 Ft → 500 🪙','brConv()','c')+bB('VISSZA','guiClose()','r'));clearInterval(window._brT);window._brT=setInterval(()=>{const e=$('brCd');if(e)e.textContent=untilMidnight();else clearInterval(window._brT)},1000)}
window.brBuy=function(id){const c=byId(id);if(!c)return;if(B.own[id]){brShop('Ez már a tiéd! A szekrényben felszerelheted.');return}const p=PRICE[c.r];if(B.zs<p){brShop('Nincs elég zseton! Játssz, teljesíts szinteket, vagy válts Ft-ot.');return}B.zs-=p;B.own[id]=1;B.eq[c.t]=id;bsave();sfx('buy');brShop('✅ Megvetted és felszerelted: '+c.n+'!')}
window.brConv=function(){if(S.c<50000){brShop('Nincs 50 000 Ft-od a menüs egyenlegen!');return}S.c-=50000;save();B.zs+=500;bsave();sfx('coin');brShop('+500 zseton!')}
// --- Szekrény ---
window.brLocker=function(tab){tab=tab||'skin';const L=COS.filter(c=>c.t===tab&&B.own[c.id]),cur=byId(B.eq[tab]);
 guiOpen('<h1 class="f" style="font-size:32px">🎒 SZEKRÉNY</h1><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+Object.keys(TYP).map(k=>'<button class="b '+(k===tab?'':'p')+' f" style="width:auto;display:inline-block;padding:8px 12px;font-size:14px" onclick="brLocker(\''+k+'\')">'+TYP[k]+' '+(byId(B.eq[k])||{}).e+'</button>').join('')+'</div>'+
 '<div style="margin:8px;color:#cbd5e1">Felszerelve: <b style="color:var(--y)">'+(cur?cur.e+' '+cur.n:'—')+'</b> · '+L.length+'/'+COS.filter(c=>c.t===tab).length+' megszerezve</div><div class="g">'+L.map(c=>card(c,"brEq('"+c.id+"')")).join('')+'</div>'+(tab==='emote'?'<div style="color:#cbd5e1;margin-top:6px">Meccs közben: <b>H</b> = tánc</div>':'')+bB('VISSZA','guiClose()','r'))}
window.brEq=function(id){const c=byId(id);if(!c||!B.own[id])return;B.eq[c.t]=id;bsave();sfx('click');brLocker(c.t)}
// --- Szezonbérlet ---
const BPN=40,BPX=1000;
const BPR=[];for(let i=1;i<=BPN;i++){let fr=null,pr=null;if(i%5===0)fr={zs:150};else if(i%2===0)fr={zs:50};
 const bpc=COS.filter(c=>c.bp);if(i===10)pr={item:'b_kor'};else if(i===20)pr={item:'g_sz'};else if(i===30)pr={item:'t_tuz'};else if(i===35)pr={item:'e_ugr'};else if(i===BPN)pr={item:'s_kir'};else pr={zs:i%3===0?200:100};BPR.push({fr,pr})}
const tier=()=>Math.min(BPN,Math.floor(B.bpx/BPX));
const rwTxt=r=>!r?'—':r.zs?r.zs+' 🪙':(byId(r.item).e+' '+byId(r.item).n);
window.brBP=function(msg){const t=tier(),pct=Math.round((B.bpx%BPX)/BPX*100);
 let h='<h1 class="f" style="font-size:32px">🎟️ SZEZONBÉRLET – 1. SZEZON: KÖZPÉNZ-SZIGET</h1><div class="f" style="color:var(--y)">'+(msg||'')+'</div><div class="f">SZINT '+t+'/'+BPN+' · ZSETON: <span style="color:var(--y)">'+zfmt(B.zs)+'</span></div><div class="bar" style="height:14px;margin:6px 0"><i style="background:var(--y);width:'+(t>=BPN?100:pct)+'%"></i></div><div style="color:#cbd5e1;font-size:13px">Szintenként '+BPX+' BP-XP · elimináció +40 · hullám +150 · győzelem +1500 · meccs +200</div>'+
 (B.bpPrem?'<div class="f" style="color:#86efac;margin:6px">✔ PRÉMIUM SÁV AKTÍV</div>':bB('⭐ PRÉMIUM SÁV FELOLDÁSA – 950 🪙','brPrem()','c'))+'<div style="max-height:46vh;overflow-y:auto;margin-top:6px">';
 for(let i=1;i<=BPN;i++){const r=BPR[i-1],ok=t>=i,cf=B.claimed['f'+i],cp=B.claimed['p'+i];
  h+='<div style="display:grid;grid-template-columns:60px 1fr 1fr;gap:6px;align-items:center;margin:4px 0;opacity:'+(ok?1:.5)+'"><div class="f" style="font-size:18px;color:'+(ok?'var(--y)':'#94a3b8')+'">'+i+'</div>'+
  '<div class="it" style="cursor:'+(ok&&r.fr&&!cf?'pointer':'default')+'" '+(ok&&r.fr&&!cf?'onclick="brClaim('+i+',0)"':'')+'><small style="margin:0">INGYENES</small>'+rwTxt(r.fr)+(cf?' ✔':ok&&r.fr?' <b style="color:var(--y)">ÁTVESZ</b>':'')+'</div>'+
  '<div class="it" style="border-color:var(--y);cursor:'+(ok&&B.bpPrem&&!cp?'pointer':'default')+'" '+(ok&&B.bpPrem&&!cp?'onclick="brClaim('+i+',1)"':'')+'><small style="margin:0;color:var(--y)">PRÉMIUM</small>'+rwTxt(r.pr)+(cp?' ✔':ok&&B.bpPrem?' <b style="color:var(--y)">ÁTVESZ</b>':'')+'</div></div>'}
 guiOpen(h+'</div>'+bB('VISSZA','guiClose()','r'))}
window.brPrem=function(){if(B.bpPrem)return;if(B.zs<950){brBP('Nincs elég zseton a prémium sávhoz!');return}B.zs-=950;B.bpPrem=true;bsave();sfx('win');brBP('⭐ Prémium sáv feloldva!')}
window.brClaim=function(i,p){const k=(p?'p':'f')+i,r=BPR[i-1][p?'pr':'fr'];if(!r||B.claimed[k]||tier()<i||(p&&!B.bpPrem))return;B.claimed[k]=1;if(r.zs)B.zs+=r.zs;if(r.item){B.own[r.item]=1}bsave();sfx('buy');brBP('Átvetted: '+rwTxt(r)+'!')}
function bpAdd(n,why){const t0=tier();B.bpx+=n;bsave();const t1=tier();if(t1>t0&&G){say('🎟️ SZEZONBÉRLET SZINTLÉPÉS! '+t1+'. szint – vedd át a jutalmat a menüben!');sfx('win')}}
// --- Játékba építés ---
function applyCos(){const g=G;if(!g)return;const sk=byId(B.eq.skin)||byId('s_def'),bk=byId(B.eq.back);
 const old=g.pm,np=person(sk.id==='s_def'?g.f.c:sk.c,sk.id==='s_def'?g.f.e:sk.e,1);np.position.copy(old.position);np.rotation.copy(old.rotation);scene.remove(old);scene.add(np);g.pm=np;
 if(bk&&bk.e){const s=spr(bk.e,1.5);s.material.depthTest=true;s.position.set(0,1.6,-.55);np.add(s)}
 g.trailT=0}
WP('launch',null,()=>{applyCos();bpAdd(0)});
WP('land',null,()=>{const g=G,gl=byId(B.eq.glide);if(g&&g.gs&&gl&&gl.e!=='🪂'){g.pm.remove(g.gs);g.gs=spr(gl.e,3.5);g.gs.position.y=5;g.pm.add(g.gs)}});
WP('kill',null,a=>{if(!G)return;B.zs+=a[0]&&a[0].b?25:3;bpAdd(a[0]&&a[0].b?300:40)});
WP('end',null,a=>{const win=!!a[0];B.zs+=win?250:40;bpAdd(200+(win?1500:0)+(G?G.wave*150:0));
 const rt=$('rt');if(win){rt.innerHTML='#1 GYŐZELEM!<br><span style="font-size:.55em">KÖZPÉNZ-KIRÁLY LETTÉL</span>'}else{const pl=Math.max(2,Math.min(100,(G&&G.en?G.en.filter(e=>!e.dead).length:0)+2+Math.floor(R()*8)));rt.textContent='#'+pl+' HELYEZÉS'}
 const rb=$('rb');if(rb)rb.innerHTML+='<br>🪙 Zseton: +'+(win?250:40)+' · 🎟️ Szezonbérlet: '+tier()+'. szint'});
// tánc
let emT=0,emS=null;
window.brEmote=function(){const g=G;if(!g||g.phase!=='play'||emT>0)return;const e=byId(B.eq.emote)||byId('e_tap');emT=3;emS=spr(e.e,2.6);emS.position.y=5.2;g.pm.add(emS);say(e.e+' '+e.say);spk(e.say);sfx('magic');if(e.id==='e_penz'){for(let i=0;i<6;i++)ftx(g.x+rnd(-3,3),g.z+rnd(-3,3),'💸','')}}
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h'&&run&&G)brEmote()});
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!g.pm)return;
 if(emT>0){emT-=dt;g.pm.rotation.y=-g.ang+(3-emT)*9;g.pm.position.y=Math.abs(Math.sin(emT*8))*.6+(g.y||0);if(emT<=0&&emS){g.pm.remove(emS);emS=null}}
 const tr=byId(B.eq.trail);if(tr&&tr.e&&g.phase==='play'&&Math.hypot(g.vx||0,g.vz||0)>2){g.trailT=(g.trailT||0)-dt;if(g.trailT<=0){g.trailT=.12;const s=spr(tr.e,.9);s.material.depthTest=true;s.position.set(g.x,.6+(g.y||0),g.z);scene.add(s);g.ef.push({k:'trail',t:.9,u:d=>{s.position.y+=d*.8;s.material.opacity=Math.max(0,s.material.opacity-d*1.1)},end:()=>scene.remove(s)})}}});
// menü-gombok és zseton-kijelző
const card0=document.querySelector('#menu .card');if(card0){const box=document.createElement('div');box.style.cssText='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:6px 0';
 box.innerHTML='<button class="b f" style="background:linear-gradient(#f472b6,#be185d);border-color:#831843;color:#fff" onclick="brShop()">🛒 TÁRGYBOLT</button><button class="b c f" onclick="brLocker()">🎒 SZEKRÉNY</button><button class="b f" style="background:linear-gradient(#facc15,#ca8a04)" onclick="brBP()">🎟️ SZEZONBÉRLET</button>';
 const first=card0.querySelector('button');first.after(box);const z=document.createElement('div');z.className='f';z.style.cssText='color:var(--y);margin:4px';z.id='brZs';card0.appendChild(z)}
WP('go',null,a=>{if(a[0]==='menu'){const z=$('brZs');if(z)z.textContent='ZSETON: '+zfmt(B.zs)+' · SZEZONBÉRLET: '+tier()+'/'+BPN+'. szint · H = tánc'}});

// --- FPS-kijelző + automatikus felbontás ---
{const fd=document.createElement('div');fd.style.cssText='position:absolute;right:8px;top:62px;z-index:3;font:700 12px monospace;color:#a3e635;background:#000a;padding:2px 6px;border-radius:6px;pointer-events:none';document.body.appendChild(fd);
 let fr=0,t0=performance.now(),scale=1,low=0,high=0;
 (function tick(now){requestAnimationFrame(tick);fr++;if(now-t0<1000)return;const fps=Math.round(fr*1000/(now-t0));fr=0;t0=now;
  const on=typeof run!=='undefined'&&run&&ren;fd.style.display=on?'block':'none';if(!on)return;fd.textContent=fps+' FPS · '+Math.round(scale*100)+'%';
  if(fps<45){low++;high=0}else if(fps>58){high++;low=0}else{low=high=0}
  if(low>=2&&scale>.5){scale=Math.max(.5,scale-.15);ren.setPixelRatio(scale*Math.min(1,devicePixelRatio));rs();low=0}
  if(high>=5&&scale<1){scale=Math.min(1,scale+.1);ren.setPixelRatio(scale*Math.min(1,devicePixelRatio));rs();high=0}})(performance.now())}
// --- ÉPÍTÉS: rácsra illesztett fal / rámpa / padló, előnézettel, emeletekkel ---
{const CELL=4,LH=3,DIRS=[[1,0],[0,1],[-1,0],[0,-1]];let ghost=null,gType=-1,bcd=0;
 B.mats=B.mats||0;
 const plan=()=>{const g=G,t=g.buildType|0,a=g.ang,di=((Math.round(a/(Math.PI/2))%4)+4)%4,[dx,dz]=DIRS[di],pcx=Math.floor(g.x/CELL)*CELL+CELL/2,pcz=Math.floor(g.z/CELL)*CELL+CELL/2;
  let L=Math.max(0,Math.round((g.y-.2)/LH));if((g.pit||0)>.35&&t!==1)L++;
  if(t===0)return{t,x:pcx+dx*CELL/2,z:pcz+dz*CELL/2,y:L*LH,rot:di%2?0:Math.PI/2,di};
  const x=pcx+dx*CELL,z=pcz+dz*CELL;return{t,x,z,y:L*LH,di,dx,dz}};
 const mkGhost=t=>{if(ghost)scene.remove(ghost);const geo=t===0?new THREE.BoxGeometry(CELL,LH,.25):t===2?new THREE.BoxGeometry(CELL,.25,CELL):new THREE.BoxGeometry(CELL,.25,Math.hypot(CELL,LH));ghost=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x38bdf8,transparent:true,opacity:.38,depthWrite:false}));const e=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:0x7dd3fc}));ghost.add(e);scene.add(ghost);gType=t};
 const pose=(m,p)=>{if(p.t===0){m.position.set(p.x,p.y+LH/2,p.z);m.rotation.set(0,p.rot,0)}else if(p.t===2){m.position.set(p.x,p.y+.12,p.z);m.rotation.set(0,0,0)}else{m.position.set(p.x,p.y+LH/2,p.z);m.rotation.set(0,0,0);m.rotation.y=-Math.atan2(p.dz,p.dx)+Math.PI/2;m.rotateX(-Math.atan2(LH,CELL))}};
 const occupied=p=>G.wl.some(w=>w.bp&&w.bp.t===p.t&&Math.abs(w.bp.x-p.x)<.1&&Math.abs(w.bp.z-p.z)<.1&&Math.abs(w.bp.y-p.y)<.1&&(p.t!==1||w.bp.di===p.di));
 window.brPlace=function(){const g=G;if(!g||!g.buildMode||g.phase!=='play'||bcd>0)return;const p=plan();if(occupied(p))return;if(B.mats<10&&!g.freeBuild){say('🪵 Nincs elég nyersanyag! (elimináció, ládák)');bcd=.4;return}if(!g.freeBuild)B.mats-=10;bcd=.12;
  const col=p.t===0?0xc4a574:p.t===1?0x8b7355:0x94a3b8,k=p.t===0?'wood@1.5,1':p.t===1?'wood@1,1.5':'conc@2,2';
  const geo=p.t===0?boxG(CELL,LH,.25):p.t===2?boxG(CELL,.25,CELL):boxG(CELL,.25,Math.hypot(CELL,LH));const m=M(geo,col,k);pose(m,p);scene.add(m);
  const w={m,x:p.x,z:p.z,y0:p.y,hp:p.t===0?300:200,mhp:p.t===0?300:200,kind:'piece',bp:p,cols:[],pls:[]};
  if(p.t===0){const ax=p.di%2?1:0,az=p.di%2?0:1;for(const o of[-1.4,0,1.4]){const c={x:p.x+ax*o,z:p.z+az*o,r:.75,h:p.y+LH,y0:p.y>0?p.y:0,tmpW:1};g.col.push(c);w.cols.push(c)}}
  else if(p.t===2){const pl={x:p.x,z:p.z,hw:CELL/2,hd:CELL/2,h:p.y+.25};g.plat.push(pl);w.pls.push(pl)}
  else{const N=8;for(let i=0;i<N;i++){const f=(i+.5)/N,pl={x:p.x-p.dx*CELL/2+p.dx*CELL*f,z:p.z-p.dz*CELL/2+p.dz*CELL*f,hw:p.dx?CELL/N/2+.05:CELL/2,hd:p.dz?CELL/N/2+.05:CELL/2,h:p.y+LH*(i+1)/N};g.plat.push(pl);w.pls.push(pl)}}
  g.wl.push(w);sfx('wall');bsave()};
 window.wall=function(){const g=G;if(!g||g.phase!=='play')return;if(!g.buildMode){toggleBuild();return}brPlace()};
 WP('launch',null,()=>{if(ghost){ghost=null;gType=-1}B.mats=Math.max(B.mats,150)});
 WP('kill',null,()=>{B.mats=Math.min(999,B.mats+25)});
 WP('pickup',null,a=>{if(a[0]&&a[0].t==='chest')B.mats=Math.min(999,B.mats+40)});
 WP('update',null,a=>{const g=G;if(!g)return;bcd=Math.max(0,bcd-a[0]);const on=g.buildMode&&g.phase==='play';if(!on){if(ghost)ghost.visible=false;return}const p=plan();if(gType!==p.t)mkGhost(p.t);ghost.visible=true;pose(ghost,p);ghost.material.color.setHex(occupied(p)||B.mats<10?0xef4444:0x38bdf8)});}

// fal-szerkesztés (G): ajtót vág a legközelebbi saját falba
{const old=window.editBuild;window.editBuild=function(){const g=G;if(!g||g.phase!=='play')return;let best=null,bd=6;g.wl.forEach(w=>{if(!w.bp||w.bp.t!==0||w.edited)return;const d=Math.hypot(w.x-g.x,w.z-g.z);if(d<bd){bd=d;best=w}});
 if(!best)return old();best.edited=true;const mid=best.cols[1];g.col=g.col.filter(c=>c!==mid);best.cols.splice(1,1);
 const hole=M(boxG(1.4,2.2,.3),0x0f172a,'gen');hole.position.set(best.x,best.y0+1.1,best.z);hole.rotation.copy(best.m.rotation);scene.add(hole);const om=best.m,grp=new THREE.Group();scene.remove(om);grp.add(om,hole);om.position.sub(new THREE.Vector3());scene.add(grp);best.m=grp;sfx('click');say('🚪 Ajtó kivágva!')}}
// --- Újratöltés-kör, találatjelző, lőszer és nyersanyag kijelző ---
{const css=document.createElement('style');css.textContent='#brRel{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px;border-radius:50%;pointer-events:none;display:none;z-index:3}#brHit{position:absolute;left:50%;top:50%;width:26px;height:26px;margin:-13px;pointer-events:none;opacity:0;z-index:3;transition:opacity .15s}#brHit:before,#brHit:after{content:"";position:absolute;left:12px;top:-2px;width:2px;height:30px;background:#fff;box-shadow:0 0 4px #f00}#brHit:before{transform:rotate(45deg)}#brHit:after{transform:rotate(-45deg)}#brAmmo{position:absolute;right:12px;bottom:76px;z-index:3;text-align:right;font-family:"Luckiest Guy",Impact;text-shadow:0 3px 0 #000;pointer-events:none}#brAmmo b{font-size:40px;color:#fff}#brAmmo span{font-size:20px;color:#cbd5e1}#brAmmo i{display:block;font-style:normal;font-size:16px;color:#fbbf24}';document.head.appendChild(css);
 const hud=$('hud');const rel=document.createElement('div');rel.id='brRel';hud.appendChild(rel);const hit=document.createElement('div');hit.id='brHit';hud.appendChild(hit);const am=document.createElement('div');am.id='brAmmo';hud.appendChild(am);let hitT=0;
 WP('dmgE',null,()=>{hitT=.12;hit.style.opacity=1;sfx('hit',2)});
 WP('reload',null,()=>{if(G&&G.reloading>0)sfx('ability')});
 WP('update',null,a=>{const g=G;if(!g)return;hitT-=a[0];if(hitT<=0)hit.style.opacity=0;
  const w=WPN[g.wp];if(g.reloading>0){const f=1-g.reloading/w.rt;rel.style.display='block';rel.style.background='conic-gradient(#facc15 '+(f*360)+'deg,#0008 0)';rel.style.webkitMask=rel.style.mask='radial-gradient(circle,transparent 20px,#000 21px)';g.gun.rotation.x=-Math.sin(f*Math.PI)*.9}else{rel.style.display='none';g.gun.rotation.x*=.7}
  if(!(g.reloading>0)&&(g.mag[g.wp]||0)===0&&(g.res[g.wp]||0)>0&&g.phase==='play')reload();
  am.innerHTML=g.buildMode?'<b>🪵 '+B.mats+'</b><i>ÉPÍTÉS: '+BUILD_NAMES[g.buildType|0]+' · KATT = lerak</i>':'<b>'+(g.mag[g.wp]||0)+'</b><span> / '+(g.res[g.wp]||0)+'</span><i>'+w.e+' '+w.n+' · 🪵 '+B.mats+'</i>'});}
go('menu');
})();
