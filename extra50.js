// ===== EXTRA50: kutyatrükkök · hangerő-keverő + lejátszási lista · kutyakiállítás · kincsvadász-térkép · ellátmány-ledobás
// mesterségi szint · mód-szavazás (parti) · turista-album · bank kamattal · gyűjthető kártyák
(function(){
const SH_=(e,h)=>{if(e._h!==h){e._h=h;e.innerHTML=h}},SD_=(e,d)=>{if(e.style.display!==d)e.style.display=d},ST_=(e,t)=>{if(e._t!==t){e._t=t;e.textContent=t}};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x50pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x50 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>(+n||0).toLocaleString('hu-HU');
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tok=()=>localStorage.getItem('ry_token')||'';
const api=(p,b)=>fetch('/api/x50/'+p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:b?JSON.stringify(b):undefined}).then(r=>r.json()).catch(()=>({error:'Nem érem el a szervert.'}));
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const saveAll=()=>{try{save()}catch(e){}try{st.s('k3br',BR)}catch(e){}};
const sayX=t=>{try{say(t)}catch(e){}};
function openM(h,back){$$('x20MB').innerHTML=h+'<div style="text-align:right;margin-top:10px">'+(back!==false?'<button onclick="x20hub()">◀ VISSZA</button>':'')+'<button onclick="x20close()">BEZÁR</button></div>';$$('x20M').style.display='flex';if(document.pointerLockElement)document.exitPointerLock()}
function toast(t){const T=$$('x20Toast');if(!T)return;T.innerHTML=t;T.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>T.style.display='none',3400)}
const css=document.createElement('style');css.textContent=`
.x50cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
.x50c{border-radius:10px;padding:6px 4px;text-align:center;background:#ffffff0d;border:2px solid #ffffff22;font-size:12px;position:relative;min-height:96px}
.x50c b{display:block;font-size:30px;margin:2px 0}.x50c.r1{border-color:#60a5fa}.x50c.r2{border-color:#c084fc;box-shadow:0 0 10px #c084fc66}.x50c.no{opacity:.25;filter:grayscale(1)}
.x50c i{position:absolute;right:4px;top:2px;font-style:normal;font-weight:800;color:#fde68a}
.x50alb{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.x50alb div{border-radius:10px;padding:8px;text-align:center;background:#ffffff0d;font-size:13px}.x50alb div.ok{background:#16a34a44}.x50alb b{display:block;font-size:26px}
#x50Hud{position:fixed;left:14px;top:120px;z-index:4;background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:4px 10px;font:700 14px Rajdhani;color:#fde68a;display:none;pointer-events:none}
#x50P{position:fixed;left:50%;top:66%;transform:translateX(-50%);z-index:6;background:#000b;color:#fff;font:700 16px Rajdhani;padding:5px 12px;border-radius:10px;display:none;pointer-events:none}#x50P b{color:#facc15}`;document.head.appendChild(css);
const hud=document.createElement('div');hud.id='x50Hud';document.body.appendChild(hud);
const pr=document.createElement('div');pr.id='x50P';document.body.appendChild(pr);

// =====================================================================
// 1) KUTYATRÜKKÖK (előnézet a kutyáddal)
// =====================================================================
const TRICKS=[['pacsi','🐾 Pacsi'],['hemper','🔄 Hempergés'],['ugat','🗣️ Ugatás'],['ul','🪑 Ül'],['porog','🌀 Pörgés'],['ugrik','⬆️ Ugrás']];
let dogR=null;
function showDog(){openM('<h2>🐕 KUTYATRÜKKÖK</h2><div style="opacity:.75;font-size:14px">Tanítsd meg a kutyádnak a trükköket! Válassz egyet, és nézd meg.</div><div id="x50dv" style="text-align:center"></div><div style="text-align:center">'+TRICKS.map(([k,n])=>'<button class="y" onclick="x50trick(\''+k+'\')">'+n+'</button>').join('')+'</div>');setTimeout(dogStage,30)}
function dogStage(){const box=$$('x50dv');if(!box||typeof THREE==='undefined')return;if(dogR){dogR.stop=true}
 const cv=document.createElement('canvas');cv.width=460;cv.height=280;cv.style.cssText='border-radius:14px;margin:8px auto;display:block;max-width:100%';box.appendChild(cv);
 const rn=new THREE.WebGLRenderer({canvas:cv,antialias:true}),sc=new THREE.Scene();sc.background=new THREE.Color(0x14532d);sc.add(new THREE.HemisphereLight(0xffffff,0x335533,1.1));const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(3,6,4);sc.add(dl);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(5,32),new THREE.MeshStandardMaterial({color:0x22c55e}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 let dog;try{dog=window.buildPetDog()}catch(e){dog=new THREE.Mesh(new THREE.BoxGeometry(1,.7,1.6),new THREE.MeshStandardMaterial({color:0xc0702f}))}const piv=new THREE.Group();piv.add(dog);sc.add(piv);
 const cm=new THREE.PerspectiveCamera(42,460/280,.1,50);cm.position.set(2.6,1.8,3.2);cm.lookAt(0,.6,0);
 const bub=document.createElement('div');bub.style.cssText='position:relative;top:-250px;font:28px "Luckiest Guy",Impact;color:#fde68a;text-shadow:0 2px 0 #000;height:0;opacity:0;transition:opacity .2s';box.appendChild(bub);
 const R={stop:false,trick:null,t:0,rn};dogR=R;let last=performance.now();
 (function f(){if(R.stop||!document.body.contains(cv)){try{rn.dispose()}catch(e){}return}const n=performance.now(),dt=(n-last)/1000;last=n;R.t+=dt;const k=R.trick,t=R.t;
  piv.position.set(0,0,0);piv.rotation.set(0,Math.sin(n/1500)*.4,0);dog.rotation.set(0,0,0);dog.position.y=0;
  if(k==='pacsi'&&t<2){piv.rotation.x=-Math.min(.5,t*2)+(t>1.5?(t-1.5)*1:0);dog.position.y=Math.sin(t*12)*.03}
  if(k==='hemper'&&t<1.6){piv.rotation.z=t/1.6*Math.PI*2;piv.position.y=Math.sin(t/1.6*Math.PI)*.3}
  if(k==='ugat'&&t<1.6){piv.scale.setScalar(1+Math.abs(Math.sin(t*14))*.06);piv.rotation.x=-Math.abs(Math.sin(t*14))*.12}else piv.scale.setScalar(1);
  if(k==='ul'&&t<2.4){piv.rotation.x=-Math.min(.45,t*1.5);piv.position.y=-Math.min(.12,t*.4)}
  if(k==='porog'&&t<1.5){piv.rotation.y=t/1.5*Math.PI*4}
  if(k==='ugrik'&&t<1){piv.position.y=Math.sin(t*Math.PI)*1.2;piv.rotation.x=Math.sin(t*Math.PI*2)*.3}
  rn.render(sc,cm);requestAnimationFrame(f)})();
 R.bub=bub}
window.x50dog=showDog;
window.x50trick=k=>{if(!dogR)return;dogR.trick=k;dogR.t=0;const b=dogR.bub;const T={pacsi:'Pacsi! 🐾',hemper:'Hempereg! 🔄',ugat:'VAU! VAU!',ul:'Ül! 🪑',porog:'Pörög! 🌀',ugrik:'Hopp! ⬆️'};
 if(b){b.textContent=T[k];b.style.opacity=1;setTimeout(()=>b.style.opacity=0,1400)}try{if(k==='ugat'){tn(420,'square',.08,.12);setTimeout(()=>tn(380,'square',.08,.12),260)}else tn(900,'sine',.1,.06)}catch(e){}};

// =====================================================================
// 2) HANGERŐ-KEVERŐ + LEJÁTSZÁSI LISTA
// =====================================================================
const SND=Object.assign({master:1,sfx:null,mus:null,list:[],every:150},LSg('k3x50snd',{}));
function applySnd(){try{if(SND.sfx===null)SND.sfx=SET.sfx;if(SND.mus===null)SND.mus=SET.music;SET.sfx=+(SND.sfx*SND.master).toFixed(3);SET.music=+(SND.mus*SND.master).toFixed(3);saveSet();if(typeof AX!=='undefined'&&AX.mg)AX.mg.gain.value=SET.sfx}catch(e){}}
setTimeout(()=>{if(SND.sfx!==null)applySnd()},2000);
window.x50vol=(k,v)=>{SND[k]=v/100;LSs('k3x50snd',SND);applySnd();const l=$$('x50v_'+k);if(l)l.textContent=v+'%'};
window.x50voice=()=>{try{SET.voice=!SET.voice;saveSet()}catch(e){}showSnd()};
window.x50pl=i=>{const j=SND.list.indexOf(i);if(j>=0)SND.list.splice(j,1);else SND.list.push(i);LSs('k3x50snd',SND);showSnd()};
window.x50every=v=>{SND.every=v;LSs('k3x50snd',SND);showSnd()};
function showSnd(){try{if(SND.sfx===null)SND.sfx=SET.sfx;if(SND.mus===null)SND.mus=SET.music}catch(e){SND.sfx=SND.sfx||.6;SND.mus=SND.mus||.5}
 const sl=(k,n)=>'<div class="x20row"><span style="width:170px">'+n+'</span><input type="range" min="0" max="100" value="'+Math.round((SND[k]||0)*100)+'" style="flex:1" oninput="x50vol(\''+k+'\',this.value)"><b id="x50v_'+k+'" style="width:50px;text-align:right">'+Math.round((SND[k]||0)*100)+'%</b></div>';
 const songs=window.LBM?LBM.songs():[];
 openM('<h2>🎵 HANG ÉS ZENE</h2><h3>🎚️ Hangerő-keverő</h3>'+sl('master','🔊 Fő hangerő')+sl('sfx','💥 Effektek (lövés, robbanás)')+sl('mus','🎼 Meccs-zene')+
 '<div class="x20row"><span>🗣️ Bemondó (felolvasás)</span><button class="'+((typeof SET!=='undefined'&&SET.voice)?'g':'')+'" onclick="x50voice()">'+((typeof SET!=='undefined'&&SET.voice)?'BE':'KI')+'</button></div><div style="font-size:13px;opacity:.7">A lobbyzene hangerejét a jobb oldali lejátszón állíthatod.</div>'+
 '<h3>📃 Lobby lejátszási lista</h3><div style="font-size:13px;opacity:.7">Pipáld be a kedvenceidet: a lobbyban sorban váltják egymást. Ha üres, marad a mostani dal.</div>'+songs.map((s,i)=>'<button class="'+(SND.list.includes(i)?'g':'')+'" onclick="x50pl('+i+')">'+(SND.list.includes(i)?'✔ ':'')+esc(s.e||'🎵')+' '+esc(s.n)+'</button>').join('')+
 '<div style="margin-top:6px">Váltás: '+[[90,'1,5 perc'],[150,'2,5 perc'],[240,'4 perc']].map(([v,l])=>'<button class="'+(SND.every===v?'y':'')+'" onclick="x50every('+v+')">'+l+'</button>').join('')+'</div>')}
window.x50snd=showSnd;
let plT=0,plI=0;setInterval(()=>{if(!window.LBM||!LBM.on||!SND.list.length||inMatch())return;plT+=5;if(plT>=SND.every){plT=0;plI=(plI+1)%SND.list.length;try{LBM.set(SND.list[plI])}catch(e){}}},5000);

// =====================================================================
// 3) KUTYAKIÁLLÍTÁS
// =====================================================================
async function showShow(msg){const r=await api('show');if(r.wins&&r.wins.length)r.wins.forEach(w=>{BR.zs=(BR.zs|0)+w.prize;saveAll();toast('🏆 Kutyakiállítás ('+esc(w.week)+'): '+w.place+'. hely! +'+fmt(w.prize)+' 🪙')});
 const P=(window._PETS&&_PETS.P)||{};const B=(window._PETS&&_PETS.BREEDS)||[];const bn=id=>(B.find(b=>b.id===id)||{}).n||id;
 openM('<h2>🏟️ KUTYAKIÁLLÍTÁS</h2><div style="opacity:.8;font-size:14px">Nevezd be a kutyádat, és szavazz a legszebbre! Hetente egy szavazatod van. A hét végén az első 3 helyezett jutalmat kap: <b>3000 / 1500 / 800 🪙</b>.</div>'+(msg?'<div style="color:#fca5a5;margin:6px 0">'+esc(msg)+'</div>':'')+
 (r.error?'<div style="color:#fca5a5">'+esc(r.error)+'</div>':'<div class="x20row"><span>Te kutyád: <b>'+esc(P.name||'Kutyus')+'</b> ('+esc(bn(P.breed))+', '+((window._dogLv&&_dogLv())||1)+'. szint)</span><button class="y" onclick="x50enter()">'+(r.mine?'NEVEZÉS FRISSÍTÉSE':'NEVEZÉS')+'</button></div>'+
 '<h3>🐾 E heti nevezések '+(r.voted?'(már szavaztál)':'')+'</h3>'+((r.list||[]).map((e,i)=>'<div class="x20row"><span>'+(i<3?['🥇','🥈','🥉'][i]:(i+1)+'.')+' <b>'+esc(e.dog)+'</b> · '+esc(bn(e.breed))+' · gazdi: '+esc(e.n)+(e.eq&&e.eq.length?' <small style="opacity:.7">('+e.eq.length+' kiegészítő)</small>':'')+'</span><span><b>'+e.v+'</b> ❤️ '+(r.voted||e.n===((KRa().user||{}).name)?'':'<button class="g" onclick="x50vote(\''+esc(e.n)+'\')">SZAVAZOK</button>')+'</span></div>').join('')||'<div style="opacity:.6">Még senki nem nevezett. Légy te az első!</div>')+
 (r.last?'<h3>🏆 Múlt heti győztesek</h3>'+r.last.top.map((e,i)=>'<div>'+['🥇','🥈','🥉'][i]+' '+esc(e.dog)+' ('+esc(e.n)+'): '+e.v+' szavazat</div>').join(''):'')))}
window.x50show=showShow;
window.x50enter=async()=>{const P=(window._PETS&&_PETS.P)||{};const eq=Object.values(P.eq||{}).filter(Boolean);const r=await api('show/enter',{dog:P.name||'Kutyus',breed:P.breed||'',eq,lv:(window._dogLv&&_dogLv())||1});showShow(r.error)};
window.x50vote=async n=>{const r=await api('show/vote',{n});showShow(r.error)};

// =====================================================================
// 6) MESTERSÉGI SZINT (fegyverenként)
// =====================================================================
const MS=LSg('k3x50m',{});
const mlv=k=>Math.min(10,Math.floor((MS[k]||0)/10));
function showMast(){const W=typeof WPN!=='undefined'?WPN:[];
 openM('<h2>🎖️ FEGYVER-MESTERSÉG</h2><div style="opacity:.75;font-size:14px">Minden 10. kiesés egy fegyverrel +1 mesterségi szint (legfeljebb 10). Minden szintért jutalom jár, a 10. szinten pedig a <b>🎖️ Mester</b> fegyverskin.</div>'+
 W.map((w,i)=>{const k=MS[i]||0,l=mlv(i);return'<div class="x20row"><span style="flex:1">'+w.e+' <b>'+esc(w.n)+'</b><div class="x10bar" style="height:7px;background:#ffffff22;border-radius:4px;overflow:hidden;margin-top:3px"><i style="display:block;height:100%;width:'+(l>=10?100:(k%10)*10)+'%;background:#facc15"></i></div></span><span style="width:170px;text-align:right">'+'⭐'.repeat(Math.min(5,Math.ceil(l/2)))+' <b>'+l+'. szint</b><br><small>'+k+' kiesés</small></span></div>'}).join(''))}
window.x50mast=showMast;
function mastKill(){if(typeof G==='undefined'||!G||typeof WPN==='undefined')return;const i=G.wp|0;if(!WPN[i])return;const before=mlv(i);MS[i]=(MS[i]||0)+1;LSs('k3x50m',MS);const after=mlv(i);
 if(after>before){try{S.c+=after*2000;BR.zs+=after*20}catch(e){}saveAll();sayX('🎖️ '+WPN[i].n+': '+after+'. MESTERSÉGI SZINT! (+'+fmt(after*2000)+' Ft)');
  if(after===10){const SK=window._x20SK,SKS=window._x20SKINS;if(SK&&SKS){if(!SKS.find(s=>s[0]==='mester'))SKS.push(['mester','🎖️ Mester (10. mesterségi szint)',0x1f2937,-1]);SK.own.mester=1;window._x20skSave&&_x20skSave();toast('🎖️ Megszerezted a MESTER fegyverskint!')}}}}
setTimeout(()=>{const SK=window._x20SK,SKS=window._x20SKINS;if(SK&&SKS&&SK.own&&SK.own.mester&&!SKS.find(s=>s[0]==='mester'))SKS.push(['mester','🎖️ Mester (10. mesterségi szint)',0x1f2937,-1])},500);

// =====================================================================
// 7) MÓD-SZAVAZÁS (partiban mindenki szavaz, egyedül azonnal választ)
// =====================================================================
const MODES=[['royale','','⚔️ Battle Royale'],['royale','shotgun','💥 Csak shotgun'],['royale','lowg','🪐 Alacsony gravitáció'],['royale','speed','⚡ Turbó (gyors futás)'],['flakon','','🧴 Flakonvadászat']];
let VOTE=null;
const KRa=()=>{try{return window.KR?KR.acc():{}}catch(e){return{}}};
const party=()=>{const a=KRa();return a&&a.party&&(a.party.members||[]).length>1?a.party:null};
function applyMode(i){const m=MODES[i];if(!m)return;window.GAME_MODE=m[0];try{localStorage.setItem('ry_mode',m[0])}catch(e){}LSs('x50mut',m[1]||'');toast('🗳️ Következő meccs: '+m[2])}
function showVote(){const p=party();if(VOTE&&VOTE.end>Date.now()){voteUI();return}
 openM('<h2>🗳️ MÓD-SZAVAZÁS</h2><div style="opacity:.8;font-size:14px">'+(p?'Partiban vagy ('+p.members.length+' fő): indíts szavazást, mindenki 15 másodpercig szavazhat, és a többség dönt.':'Egyedül vagy: válaszd ki, milyen legyen a következő meccsed! (Partiban szavazás lesz belőle.)')+'</div>'+
 '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'+MODES.map((m,i)=>'<button class="y" style="padding:14px;font-size:17px" onclick="'+(p?'x50vstart()':'x50vpick('+i+')')+'">'+m[2]+'</button>').join('')+'</div>'+(p?'':'<div style="margin-top:6px;font-size:13px;opacity:.7">Aktív mutátor: <b>'+(MODES.find(m=>m[1]&&m[1]===LSg('x50mut',''))||['','','nincs'])[2]+'</b></div>'))}
window.x50vote2=showVote;
window.x50vpick=i=>{applyMode(i);showVote()};
window.x50vstart=()=>{try{KR.wsend({t:'prelay',d:{k:'x50v_open',id:Date.now().toString(36),dur:15000}})}catch(e){toast('Nem sikerült elindítani.')}};
window.x50vcast=i=>{if(!VOTE)return;VOTE.my=i;try{KR.wsend({t:'prelay',d:{k:'x50v_vote',id:VOTE.id,i}})}catch(e){}voteUI()};
function voteUI(){if(!VOTE)return;const left=Math.max(0,Math.ceil((VOTE.end-Date.now())/1000));const cnt=MODES.map((_,i)=>Object.values(VOTE.votes).filter(v=>v===i).length);
 openM('<h2>🗳️ MÓD-SZAVAZÁS · '+left+' mp</h2><div style="opacity:.8">Indította: '+esc(VOTE.by)+'</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">'+MODES.map((m,i)=>'<button class="'+(VOTE.my===i?'g':'y')+'" style="padding:14px;font-size:17px" onclick="x50vcast('+i+')">'+m[2]+' <b>('+cnt[i]+')</b></button>').join('')+'</div>',false)}
addEventListener('krws',e=>{const m=e.detail;if(!m||m.t!=='prelay'||!m.d)return;const d=m.d;
 if(d.k==='x50v_open'){VOTE={id:d.id,end:Date.now()+15000,votes:{},by:m.from,my:null};if(!inMatch())voteUI();
  const me=(KRa().user||{}).name;if(m.from===me)setTimeout(()=>{if(!VOTE||VOTE.id!==d.id)return;const c=MODES.map((_,i)=>Object.values(VOTE.votes).filter(v=>v===i).length);let best=0;c.forEach((v,i)=>{if(v>c[best])best=i});try{KR.wsend({t:'prelay',d:{k:'x50v_res',id:d.id,i:best}})}catch(er){}},15500);
  const iv=setInterval(()=>{if(!VOTE||VOTE.id!==d.id||Date.now()>VOTE.end){clearInterval(iv);return}if($$('x20M').style.display==='flex'&&/MÓD-SZAVAZÁS/.test(($$('x20MB').querySelector('h2')||{}).textContent||''))voteUI()},1000)}
 if(d.k==='x50v_vote'&&VOTE&&VOTE.id===d.id){VOTE.votes[m.from]=d.i|0;if($$('x20M').style.display==='flex'&&/MÓD-SZAVAZÁS ·/.test(($$('x20MB').querySelector('h2')||{}).textContent||''))voteUI()}
 if(d.k==='x50v_res'&&VOTE&&VOTE.id===d.id){applyMode(d.i|0);VOTE=null;if($$('x20M').style.display==='flex'&&/MÓD-SZAVAZÁS/.test(($$('x20MB').querySelector('h2')||{}).textContent||''))showVote()}});

// =====================================================================
// 9) BANK KAMATTAL
// =====================================================================
const BANK=LSg('k3x50bank',{dep:[]});const DAY=864e5,LOCK=3*DAY;
const val=d=>Math.round(d.a*Math.pow(1.02,Math.floor((Date.now()-d.t)/DAY)));
function showBank(msg){const tot=BANK.dep.reduce((s,d)=>s+val(d),0);
 openM('<h2>🏦 KÖZPÉNZ BANK</h2><div style="opacity:.8;font-size:14px">Tedd be a forintjaidat: <b>naponta 2% kamat</b> (kamatos kamattal), de a betétet <b>3 napig</b> nem veheted ki. Csak játékpénz.</div>'+(msg?'<div style="color:#fde68a;margin:6px 0">'+msg+'</div>':'')+
 '<div class="x20row"><span>Pénztárcád: <b style="color:#facc15">'+fmt(S.c)+' Ft</b></span><span>Bankban: <b style="color:#86efac">'+fmt(tot)+' Ft</b></span></div>'+
 '<div>Betét: '+[10000,50000,100000,500000].map(v=>'<button class="y" '+(S.c>=v?'':'disabled')+' onclick="x50dep('+v+')">'+fmt(v)+'</button>').join('')+'<button class="y" '+(S.c>=1000?'':'disabled')+' onclick="x50dep(-1)">MINDET</button></div>'+
 '<h3>Betéteid</h3>'+(BANK.dep.map((d,i)=>{const left=d.t+LOCK-Date.now();return'<div class="x20row"><span>'+new Date(d.t).toLocaleDateString('hu-HU')+': '+fmt(d.a)+' → <b>'+fmt(val(d))+' Ft</b></span>'+(left>0?'<small>🔒 még '+Math.ceil(left/36e5)+' óra</small>':'<button class="g" onclick="x50wd('+i+')">KIVESZEM</button>')+'</div>'}).join('')||'<div style="opacity:.6">Még nincs betéted.</div>'))}
window.x50bank=showBank;
window.x50dep=v=>{if(v<0)v=Math.floor(S.c);if(v<1||S.c<v)return;S.c-=v;BANK.dep.push({a:v,t:Date.now()});LSs('k3x50bank',BANK);saveAll();showBank('✅ Betéve: '+fmt(v)+' Ft')};
window.x50wd=i=>{const d=BANK.dep[i];if(!d||Date.now()-d.t<LOCK)return;const v=val(d);S.c+=v;BANK.dep.splice(i,1);LSs('k3x50bank',BANK);saveAll();showBank('💰 Kivéve: '+fmt(v)+' Ft (kamat: +'+fmt(v-d.a)+' Ft)')};

// =====================================================================
// 10) GYŰJTHETŐ KÁRTYÁK
// =====================================================================
function cardDefs(){const C=[];const et=typeof ET!=='undefined'?Object.entries(ET).slice(0,8):[];et.forEach(([k,d],i)=>C.push({id:'e_'+k,s:0,e:d.e||'👤',n:k.toUpperCase(),r:d.boss?2:d.mini?1:0}));
 const W=typeof WPN!=='undefined'?WPN:[];W.forEach((w,i)=>C.push({id:'w_'+i,s:1,e:w.e,n:w.n,r:i>=3?2:i>=1?1:0}));[['💣','GRÁNÁT',0],['🟦','UGRÓPÁRNA',0],['💚','GYÓGYZÓNA',1]].forEach(([e,n,r],i)=>C.push({id:'w_x'+i,s:1,e,n,r}));
 const B=(window._PETS&&_PETS.BREEDS)||[];B.slice(0,8).forEach((b,i)=>C.push({id:'d_'+b.id,s:2,e:'🐕',n:b.n,r:b.p>=1500?2:b.p>=500?1:0}));return C}
const SER=['👤 Ellenfelek','🔫 Fegyverek','🐕 Kutyák'];
const CD=LSg('k3x50cards',{own:{},done:{}});const cSave=()=>LSs('k3x50cards',CD);
function pack(n){const C=cardDefs();if(!C.length)return[];const got=[];for(let i=0;i<n;i++){const r=Math.random();const rar=r<.08?2:r<.33?1:0;const pool=C.filter(c=>c.r===rar);const c=(pool.length?pool:C)[Math.floor(Math.random()*(pool.length||C.length))];CD.own[c.id]=(CD.own[c.id]||0)+1;got.push(c)}cSave();checkSeries();return got}
function checkSeries(){const C=cardDefs();SER.forEach((s,i)=>{const all=C.filter(c=>c.s===i);if(all.length&&!CD.done[i]&&all.every(c=>CD.own[c.id]>0)){CD.done[i]=1;cSave();try{S.c+=25000;BR.zs+=500}catch(e){}saveAll();toast('🃏 Teljes sorozat: '+s+'! +25 000 Ft, +500 🪙')}})}
function showCards(msg){const C=cardDefs();const tot=C.filter(c=>CD.own[c.id]>0).length;
 openM('<h2>🃏 GYŰJTHETŐ KÁRTYÁK ('+tot+'/'+C.length+')</h2><div style="opacity:.8;font-size:14px">Meccsek után kártyacsomag jár (győzelemnél mindig, egyébként 35% eséllyel). Egy teljes sorozat jutalma: <b>25 000 Ft + 500 🪙</b>. A duplákat elküldheted a barátaidnak!</div>'+(msg?'<div style="color:#fde68a;margin:6px 0">'+msg+'</div>':'')+
 SER.map((s,i)=>'<h3>'+s+(CD.done[i]?' ✅':'')+'</h3><div class="x50cards">'+C.filter(c=>c.s===i).map(c=>{const n=CD.own[c.id]||0;return'<div class="x50c r'+c.r+(n?'':' no')+'">'+(n>1?'<i>×'+n+'</i>':'')+'<b>'+esc(c.e)+'</b>'+esc(c.n)+'<br><small>'+['közönséges','ritka','epikus'][c.r]+'</small>'+(n>1?'<br><button style="padding:2px 6px;font-size:12px" onclick="x50send(\''+c.id+'\')">KÜLDÉS</button>':'')+'</div>'}).join('')+'</div>').join('')+
 '<div style="margin-top:8px"><button class="b" onclick="x50inbox()">📥 BEÉRKEZETT KÁRTYÁK</button></div>')}
window.x50cards=showCards;
window.x50send=async id=>{const to=prompt('Kinek küldöd? (játékosnév)');if(!to)return;if(!(CD.own[id]>1)){showCards('Csak duplát küldhetsz.');return}
 const r=await api('card/send',{to:to.trim(),card:id});if(r.error){showCards('❌ '+esc(r.error));return}CD.own[id]--;cSave();showCards('✅ Elküldve neki: '+esc(to))};
window.x50inbox=async()=>{const r=await api('card/inbox');if(r.error){showCards('❌ '+esc(r.error));return}const C=cardDefs();(r.list||[]).forEach(x=>{CD.own[x.c]=(CD.own[x.c]||0)+1});cSave();checkSeries();
 showCards((r.list||[]).length?'📥 '+(r.list||[]).map(x=>{const c=C.find(y=>y.id===x.c);return(c?c.e+' '+esc(c.n):x.c)+' ('+esc(x.from)+')'}).join(', '):'Nincs új kártya.')};
setInterval(async()=>{if(!tok()||inMatch())return;const r=await api('card/inbox');if(r.list&&r.list.length){r.list.forEach(x=>{CD.own[x.c]=(CD.own[x.c]||0)+1});cSave();checkSeries();toast('🃏 '+r.list.length+' kártyát kaptál ('+esc(r.list.map(x=>x.from).join(', '))+')!')}},90000);

// =====================================================================
// 8) TURISTA-ALBUM
// =====================================================================
const LM=[['⛲','Közpénz-szökőkút'],['🗽','Pályázati Szobor'],['🏛️','Kormányinfó Csarnok'],['🎡','Óriáskerék'],['🗼','Rezsi-torony'],['🏰','Stadion-vár'],['⛩️','Barátság-kapu'],['🗿','Sziget-fej'],['🚂','Kisvasút-emlékmű'],['🌉','Lombkorona-híd'],['🛕','Alapítvány-templom'],['⚓','Jacht-horgony']];
const ALB=LSg('k3x50alb',{});window._x50ALB=ALB;window._x50LM=LM;
function showAlb(){const n=Object.keys(ALB).length;openM('<h2>📸 TURISTA-ALBUM ('+n+'/12)</h2><div style="opacity:.8;font-size:14px">A Battle Royale szigeten 12 nevezetesség van, mindegyik fölött 📸 jel lebeg. Állj elé 60 méteren belül, nézz rá, és nyomd meg az <b>O</b> gombot (fotómód)! Teljes album: <b>50 000 Ft + 1000 🪙</b>.</div><div class="x50alb" style="margin-top:8px">'+LM.map(([e,nm],i)=>'<div class="'+(ALB[i]?'ok':'')+'"><b>'+(ALB[i]?e:'❔')+'</b>'+(ALB[i]?esc(nm)+'<br><small>'+ALB[i]+'</small>':'???')+'</div>').join('')+'</div>')}
window.x50alb=showAlb;

// =====================================================================
// MECCS: kincsvadász-térkép, ellátmány-ledobás, nevezetességek, mutátorok
// =====================================================================
let Q=null;
function rp(near,minD,maxD){const R=G.arh?400:48;for(let i=0;i<500;i++){let x,z;if(near){const a=Math.random()*6.28,d=RN(minD,maxD);x=G.x+Math.cos(a)*d;z=G.z+Math.sin(a)*d}else{x=RN(-R,R);z=RN(-R,R)}if(G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<50&&z>-44)return[x,z]}return[G.x+5,G.z+5]}
function srnd(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function lmPos(i){const r=srnd(1000+i*7919+(G.arh?1:0));const R=G.arh?400:46;for(let k=0;k<400;k++){const x=(r()*2-1)*R,z=(r()*2-1)*R;if(G.arh?(typeof hin==='function'&&hin(x,z)):Math.hypot(x,z)<46&&z>-44)return[x,z]}return[0,0]}
function add(o){scene.add(o);Q.objs.push(o);return o}
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o||{}));
WP('launch',null,()=>{try{if(Q)Q.objs.forEach(o=>o.parent&&o.parent.remove(o))}catch(e){}Q={objs:[],maps:[],got:0,dig:null,drops:[],nextDrop:60,lms:[],mut:'',t:0};hud.style.display='none';pr.style.display='none';
 const mut=LSg('x50mut','');if(mut){LSs('x50mut','');Q.mut=mut}
 setTimeout(()=>{if(!normal()||!Q)return;
  // kincsvadász-térkép darabjai
  for(let i=0;i<3;i++){const[x,z]=rp();const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,1.1,10),STD(0xfde68a,{emissive:0x6b4f00}));p.rotation.z=Math.PI/2;g.add(p);const lb=spr('🗺️',1.6,'x');lb.position.y=1.4;g.add(lb);
   const beam=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,30,8,1,true),new THREE.MeshBasicMaterial({color:0xfde68a,transparent:true,opacity:.18,depthWrite:false}));beam.position.y=15;g.add(beam);g.position.set(x,1,z);add(g);Q.maps.push({x,z,g,on:true})}
  // nevezetességek
  LM.forEach(([e,nm],i)=>{const[x,z]=lmPos(i);const g=new THREE.Group();const base=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.6,1.2,8),STD(0x9ca3af));base.position.y=.6;g.add(base);
   const col=new THREE.Mesh(new THREE.BoxGeometry(1.4,4.5,1.4),STD([0xfacc15,0x60a5fa,0xf472b6,0x34d399][i%4],{metalness:.5,roughness:.3}));col.position.y=3.4;g.add(col);
   const top=new THREE.Mesh(new THREE.OctahedronGeometry(1),STD(0xffffff,{emissive:0x444444}));top.position.y=6.4;g.add(top);
   const lb=spr((ALB[i]?'✅ ':'📸 ')+nm,2.4,'x');lb.position.y=8.4;g.add(lb);g.position.set(x,0,z);add(g);Q.lms.push({i,x,z,top})});
  if(Q.mut==='shotgun')sayX('💥 MUTÁTOR: Csak shotgun!');if(Q.mut==='lowg'){G.gv=11;sayX('🪐 MUTÁTOR: Alacsony gravitáció!')}if(Q.mut==='speed')sayX('⚡ MUTÁTOR: Turbó!');
  sayX('🗺️ 3 térképdarab rejtőzik a szigeten: gyűjtsd össze, és megtalálod az elásott kincset!')},4500)});
function openDrop(d){const g=G;d.open=true;d.lid.rotation.x=-1.2;d.lid.position.z=-.5;d.lid.position.y=1.5;scene.remove(d.smoke);
 const n=WPN.map((_,i)=>i).filter(i=>i>0&&!g.own[i]);let msg;if(n.length){const i=n[Math.floor(Math.random()*n.length)];g.own[i]=true;g.mag[i]=WPN[i].mag;g.res[i]=(g.res[i]||0)+WPN[i].res*2;g.wp=i;msg=WPN[i].e+' '+WPN[i].n}else{g.res=g.res.map((r,i)=>r+(WPN[i]?WPN[i].mag*3:20));msg='rengeteg lőszer'}
 g.sh=g.msh;g.cash+=3000;sayX('🚁 ELLÁTMÁNY: '+msg+' + teljes pajzs + 3000 Ft!');try{sfx('drop')}catch(e){}}
function dig(){const g=G;Q.dig.done=true;scene.remove(Q.dig.m);const rw=Math.random();let txt;if(rw<.5){g.cash+=15000;txt='15 000 Ft'}else if(rw<.8){try{BR.zs+=400;saveAll()}catch(e){}g.cash+=5000;txt='400 🪙 + 5000 Ft'}else{try{S.c+=50000;saveAll()}catch(e){}txt='50 000 Ft a számládra'}
 g.ul=100;sayX('💎 KINCS! '+txt+' + ulti feltöltve!');try{ftx(g.x,g.z,'💎 KINCS!','');sfx('drop')}catch(e){}hud.style.display='none'}
// E-gomb lánc (extra10 → x20near)
const oNear=window.x20near;window.x20near=function(){if(Q&&normal()){const g=G;
  const d=Q.drops.find(d=>d.landed&&!d.open&&Math.hypot(d.x-g.x,d.z-g.z)<3.2);if(d){openDrop(d);return true}
  if(Q.dig&&!Q.dig.done&&Math.hypot(Q.dig.x-g.x,Q.dig.z-g.z)<3){Q.dig.hits=(Q.dig.hits||0)+1;try{sfx('wall')}catch(e){}if(Q.dig.hits>=3)dig();else sayX('⛏️ Ásás… ('+Q.dig.hits+'/3)');return true}}
 return oNear?oNear():false};
WP('update',a=>{if(Q&&Q.mut==='speed'&&typeof G!=='undefined'&&G)G._spdB=Math.max(G._spdB||1,1.4)},a=>{if(!Q||typeof G==='undefined'||!G||G.over)return;const g=G,dt=Math.min(.1,a[0]||.016);Q.t+=dt;
 if(Q.mut==='shotgun'){g.own=[true,false,false,false,false];if(g.wp!==0)g.wp=0;if((g.res[0]||0)<12)g.res[0]=30}
 if(!normal())return;
 // térképdarabok
 Q.maps.forEach(m=>{if(!m.on)return;m.g.rotation.y+=dt*2;if(Math.hypot(m.x-g.x,m.z-g.z)<2.6&&g.y<3){m.on=false;scene.remove(m.g);Q.got++;try{sfx('drop')}catch(e){}
  if(Q.got<3)sayX('🗺️ Térképdarab: '+Q.got+'/3');else{const[x,z]=rp();const X_=new THREE.Group();const b1=new THREE.Mesh(new THREE.BoxGeometry(4,.15,.6),new THREE.MeshBasicMaterial({color:0xdc2626}));b1.rotation.y=Math.PI/4;const b2=b1.clone();b2.rotation.y=-Math.PI/4;X_.add(b1,b2);
   const beam=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,60,8,1,true),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.22,depthWrite:false}));beam.position.y=30;X_.add(beam);X_.position.set(x,.1,z);add(X_);Q.dig={x,z,m:X_};sayX('🗺️ TELJES TÉRKÉP! Keresd a piros X-et, és áss (E) 3×!')}}});
 if(Q.got>0&&!(Q.dig&&Q.dig.done)){SD_(hud,'block');ST_(hud,Q.dig?'💎 Kincs: '+Math.round(Math.hypot(Q.dig.x-g.x,Q.dig.z-g.z))+' m → piros X':'🗺️ Térkép: '+Q.got+'/3')}
 // ellátmány-ledobás
 if(g.phase==='play'&&Q.t>Q.nextDrop){Q.nextDrop=Q.t+120;const[x,z]=rp(true,25,G.arh?90:35);const grp=new THREE.Group();const box=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.2,1.4),STD(0x1d4ed8,{metalness:.4}));box.position.y=.6;const lid=new THREE.Mesh(new THREE.BoxGeometry(1.85,.3,1.45),STD(0xfacc15,{metalness:.5}));lid.position.y=1.35;grp.add(box,lid);
  const chute=new THREE.Mesh(new THREE.SphereGeometry(3,14,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0xef4444,side:THREE.DoubleSide}));chute.position.y=6;grp.add(chute);const lb=spr('🚁 ELLÁTMÁNY [E]',2.2,'x');lb.position.y=3;grp.add(lb);grp.position.set(x,60,z);add(grp);
  const smoke=new THREE.Mesh(new THREE.CylinderGeometry(.6,2.2,40,10,1,true),new THREE.MeshBasicMaterial({color:0xf472b6,transparent:true,opacity:.25,depthWrite:false}));smoke.position.set(x,20,z);add(smoke);
  Q.drops.push({x,z,y:60,grp,lid,chute,smoke,landed:false,open:false});sayX('🚁 ELLÁTMÁNY-LEDOBÁS! Kövesd a rózsaszín füstöt ('+Math.round(Math.hypot(x-g.x,z-g.z))+' m)!');try{tn(500,'sawtooth',.5,.06)}catch(e){}}
 Q.drops.forEach(d=>{if(!d.landed){d.y=Math.max(0,d.y-dt*5);d.grp.position.y=d.y;d.grp.rotation.y+=dt*.5;if(d.y<=0){d.landed=true;d.chute.visible=false}}});
 let near='';const dn=Q.drops.find(d=>d.landed&&!d.open&&Math.hypot(d.x-g.x,d.z-g.z)<3.2);if(dn)near='<b>[E]</b> Ellátmány kinyitása';else if(Q.dig&&!Q.dig.done&&Math.hypot(Q.dig.x-g.x,Q.dig.z-g.z)<3)near='<b>[E]</b> Ásás ('+(Q.dig.hits||0)+'/3)';SH_(pr,near);SD_(pr,near?'block':'none');
 Q.lms.forEach(l=>{l.top.rotation.y+=dt})});
// fotó a nevezetességekről (O gomb)
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='o'||!Q||!normal())return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;const g=G;const fx=Math.cos(g.ang),fz=Math.sin(g.ang);let got=[];
 Q.lms.forEach(l=>{if(ALB[l.i])return;const dx=l.x-g.x,dz=l.z-g.z,d=Math.hypot(dx,dz);if(d>60)return;if((dx*fx+dz*fz)/(d||1)<.8)return;ALB[l.i]=new Date().toLocaleDateString('hu-HU');got.push(LM[l.i])});
 if(got.length){LSs('k3x50alb',ALB);got.forEach(x=>sayX('📸 Új album-kép: '+x[0]+' '+x[1]+'! ('+Object.keys(ALB).length+'/12)'));try{S.c+=2000*got.length;saveAll()}catch(er){}
  if(Object.keys(ALB).length===12&&!LSg('k3x50albDone',0)){LSs('k3x50albDone',1);try{S.c+=50000;BR.zs+=1000;saveAll()}catch(er){}toast('📸 TELJES TURISTA-ALBUM! +50 000 Ft, +1000 🪙')}}});
// meccs vége: mesterség (kill), kártyacsomag
WP('kill',null,()=>{if(normal())mastKill()});
WP('end',null,a=>{hud.style.display='none';pr.style.display='none';if(!Q)return;try{if(G)G.gv=undefined}catch(e){}
 if(!(typeof G!=='undefined'&&G&&!G.stw&&!G.fk))return;if(!a[0]&&Math.random()>.35)return;const got=pack(3);if(!got.length)return;
 setTimeout(()=>{const rb=$$('rb');if(!rb)return;const d=document.createElement('div');d.style.cssText='margin-top:8px;padding:8px;border-radius:12px;background:linear-gradient(135deg,#4c1d95,#7c3aed)';d.innerHTML='🃏 <b>KÁRTYACSOMAG!</b><br>'+got.map(c=>'<span style="display:inline-block;margin:4px;padding:4px 8px;border-radius:8px;background:#0006;border:2px solid '+['#ffffff44','#60a5fa','#c084fc'][c.r]+'">'+c.e+' '+esc(c.n)+'</span>').join('');rb.appendChild(d)},900)});

// =====================================================================
// KÖZÖSSÉG-HUB bővítése
// =====================================================================
const oh=window.x20hub;if(typeof oh==='function'){window.x20hub=function(){oh();const g=document.querySelector('#x20MB div[style*="grid"]');if(!g)return;
  [['🐕 KUTYATRÜKKÖK',showDog],['🏟️ KUTYAKIÁLLÍTÁS',()=>showShow()],['🎵 HANG ÉS ZENE',showSnd],['🎖️ MESTERSÉG',showMast],['🗳️ MÓD-SZAVAZÁS',showVote],['📸 TURISTA-ALBUM',showAlb],['🏦 BANK',()=>showBank()],['🃏 KÁRTYÁK',()=>showCards()]].forEach(([t,f])=>{const b=document.createElement('button');b.className='y';b.style.cssText='padding:16px;font-size:18px';b.textContent=t;b.onclick=f;g.appendChild(b)})};
 const bi=setInterval(()=>{const b=$$('x20B');if(!b)return;clearInterval(bi);b.onclick=window.x20hub},1400)}
window._x50Q=()=>Q;
console.log('extra50 betöltve');
})();
