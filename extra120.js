// extra120.js – 25 új funkció: fegyveres járművek, varázskönyvek, kit-szintek, varázsital-üst, snowboard, nemezis, kamion, főellenség,
// rejtekhely, újraélesztő totem, éjszakai meccs, vulkán, metró, bázisfoglalás, pályaszerkesztő, barátlista, minijátékok, divatbemutató,
// kisállat-tojás, szezonális történet, csere, képességfa, oktató, mobil gombok, visszajátszás-szerkesztő
(()=>{
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const normal=()=>inMatch()&&!G.stw&&!G.fk&&!['stw','flakon','train'].includes(window.GAME_MODE);
const sayX=t=>{try{say(t)}catch(e){}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x120pre '+n+': '+e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x120 '+n+': '+e)}return r}};
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const money=n=>{try{S.c+=n;save()}catch(e){}};
const canPay=n=>{try{if(S.c<n)return false;S.c-=n;save();return true}catch(e){return false}};
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const STD=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6},o||{}));
const A=()=>window._x110api;
const hH=(x,z)=>window.hillH?hillH(x,z):0;
const onMap=(x,z)=>G.arh?hin(x,z):Math.hypot(x,z)<58;
function lbl(t,col){const c=document.createElement('canvas');c.width=320;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(15,23,42,.82)';x.fillRect(0,0,320,64);x.fillStyle=col||'#fde047';x.font='bold 26px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,160,33);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));s.scale.set(5,1,1);return s}
function randLand(minD){for(let i=0;i<120;i++){const x=G.arh?RN(-280,280):RN(-50,50),z=G.arh?RN(-160,160):RN(-38,30);if(onMap(x,z)&&hH(x,z)<.5&&(!minD||Math.hypot(x-G.x,z-G.z)>minD))return[x,z]}return[RN(-30,30),RN(-20,20)]}
let OBJ=[];const add=m=>{scene.add(m);OBJ.push(m);return m};
const near=(o,r)=>Math.hypot(o.x-G.x,o.z-G.z)<r;

// ---------- közös UI ----------
const css=document.createElement('style');css.textContent=`.x12m{position:fixed;inset:0;z-index:9100;background:rgba(2,6,23,.86);display:flex;align-items:center;justify-content:center;font-family:sans-serif}
.x12m>div{background:#0f172a;color:#fff;border:2px solid #0ea5e9;border-radius:16px;padding:16px;max-width:860px;width:calc(100% - 32px);max-height:88vh;overflow:auto}
.x12m h2{margin:0 0 8px}.x12m .x{float:right;background:#ef4444;color:#fff;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;font-weight:800}
.x12m button.b{background:#0ea5e9;color:#fff;border:0;border-radius:8px;padding:7px 11px;margin:3px;cursor:pointer;font-weight:700}.x12m button.b:disabled{opacity:.4}
.x12m .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px}.x12m .c{background:#1e293b;border-radius:10px;padding:9px;font-size:13px}
.x12m input,.x12m textarea{background:#1e293b;color:#fff;border:1px solid #334155;border-radius:6px;padding:6px}
#x12hud{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:40;color:#fff;font:700 13px sans-serif;text-shadow:0 1px 3px #000;pointer-events:none;text-align:center}
#x12tut{position:fixed;left:14px;top:120px;z-index:41;background:rgba(15,23,42,.88);color:#fff;border:2px solid #22c55e;border-radius:12px;padding:10px;font:600 13px sans-serif;display:none;max-width:260px}
#x12mob{position:fixed;right:12px;bottom:110px;z-index:45;display:none;flex-direction:column;gap:8px}#x12mob button{width:62px;height:62px;border-radius:50%;border:2px solid #fff6;background:rgba(15,23,42,.6);color:#fff;font-size:24px}`;document.head.appendChild(css);
function modal(html){const m=document.createElement('div');m.className='x12m';m.innerHTML='<div><button class="x">✖</button>'+html+'</div>';document.body.appendChild(m);m.querySelector('.x').onclick=()=>m.remove();m.addEventListener('keydown',e=>e.stopPropagation());return m}
const hud=document.createElement('div');hud.id='x12hud';document.body.appendChild(hud);

// =====================================================================
// 3 + 22: KIT-SZINTEK és KÉPESSÉGFA
let KXP=LS('k3x120kxp',{});let TREE=LS('k3x120tree',{hp:0,spd:0,dmg:0,mana:0,regen:0});
const klv=i=>Math.min(10,1+Math.floor((KXP[i]||0)/300));
const totLv=()=>Object.keys(KXP).reduce((s,k)=>s+klv(+k)-1,0);
const ptsFree=()=>totLv()+Math.floor((LS('k3x120wins',0))/1)-Object.values(TREE).reduce((a,b)=>a+b,0);
window._x120cdm=()=>{const l=klv(A()?A().kit():0);return l>=5?.7:1};
window._x120mana=()=>TREE.mana*15;window._x120regen=()=>1+TREE.regen*.15;
const TN={hp:['❤️ Max HP +10',5],spd:['👟 Sebesség +4%',5],dmg:['💥 Sebzés +5%',5],mana:['🔮 Max mana +15',5],regen:['♻️ Mana-visszatöltés +15%',5]};
function treeUI(){const m=modal('<h2>🌳 Képességfa</h2><div>Szabad pont: <b id="x12tp"></b> (kit-szintenként és győzelmenként 1 pont)</div><div class="g" id="x12tg" style="margin-top:8px"></div><div style="margin-top:10px"><b>Kit-szintek</b> (5. szint: képesség 30%-kal gyorsabban töltődik, 10. szint: ★ mester + 20% sebzés)<div id="x12kl" class="g" style="margin-top:6px"></div></div>');
 const draw=()=>{m.querySelector('#x12tp').textContent=ptsFree();m.querySelector('#x12tg').innerHTML=Object.keys(TN).map(k=>'<div class="c">'+TN[k][0]+'<br><b>'+TREE[k]+'/'+TN[k][1]+'</b><br><button class="b" data-k="'+k+'" '+(ptsFree()<1||TREE[k]>=TN[k][1]?'disabled':'')+'>+1</button></div>').join('');
  m.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{TREE[b.dataset.k]++;SV('k3x120tree',TREE);draw()});
  const K=A()?A().KITS:[];m.querySelector('#x12kl').innerHTML=K.map((k,i)=>'<div class="c">'+k.e+' '+k.n+(klv(i)>=10?' ★':'')+'<br>'+klv(i)+'. szint · '+(KXP[i]||0)+' XP</div>').join('')};draw()}

// =====================================================================
// 4: VARÁZSITAL-ÜST
let POT=LS('k3x120pot',{mana:0,speed:0,invis:0});const PD={mana:['🔵 Mana-ital','teljes mana',800],speed:['🟢 Sebesség-ital','+40% seb. 10 mp',1000],invis:['🟣 Láthatatlanság','10 mp nem sebződsz, nem látnak',2500]};
function potUI(){const m=modal('<h2>🧪 Varázsital-üst</h2><div>Főzz italt, és vidd a meccsbe! Meccsben az <b>Ő</b> gombbal iszol (sorban: mana → sebesség → láthatatlanság).</div><div class="g" id="x12pg" style="margin-top:8px"></div>');
 const draw=()=>{m.querySelector('#x12pg').innerHTML=Object.keys(PD).map(k=>'<div class="c"><b>'+PD[k][0]+'</b><br>'+PD[k][1]+'<br>Készleten: <b>'+POT[k]+'</b><br><button class="b" data-k="'+k+'">Főzés: '+ft(PD[k][2])+'</button></div>').join('');
  m.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;if(!canPay(PD[k][2])){b.textContent='Nincs elég pénz!';return}POT[k]++;SV('k3x120pot',POT);draw()})};draw()}
let BUF={};
function drink(){const k=['mana','speed','invis'].find(k=>POT[k]>0);if(!k){sayX('🧪 Nincs italod – főzz az üstnél a lobbyban!');return}POT[k]--;SV('k3x120pot',POT);const now=performance.now();
 if(k==='mana'){const M=A()&&A().mag();if(M)M.mana=M.max}else if(k==='speed')BUF.speed=now+10000;else BUF.invis=now+10000;sayX('🧪 '+PD[k][0]+' elfogyasztva!');story('potion')}

// =====================================================================
// 19: KISÁLLAT-TOJÁS
const PETS=[['🐣','Csibi','+10 HP','hp'],['🦊','Rozsdás','+5% sebesség','spd'],['🦉','Bagolyka','+25% mana-töltés','mana'],['🐢','Teknőc','+15 pajzs','sh'],['🐉','Sárkányka','+8% sebzés','dmg'],['🐙','Polip','+1 gyógycsomag','inv']];
let PET=LS('k3x120pet',{list:[],act:-1});
function eggUI(){const m=modal('<h2>🥚 Kisállat-tojások</h2><div>Egy tojás 3000 Ft. Ami kikel, az követ a meccsben, és apró bónuszt ad.</div><button class="b" id="x12eb">🥚 Tojás vásárlása (3000 Ft)</button><div id="x12ea" style="font-size:60px;text-align:center;height:80px"></div><div class="g" id="x12eg"></div>');
 const draw=()=>{m.querySelector('#x12eg').innerHTML=PET.list.map((p,i)=>{const d=PETS[p];return'<div class="c" style="'+(PET.act===i?'outline:2px solid #facc15':'')+'"><span style="font-size:28px">'+d[0]+'</span> <b>'+d[1]+'</b><br>'+d[2]+'<br><button class="b" data-i="'+i+'">'+(PET.act===i?'✅ Aktív':'Kiválaszt')+'</button></div>'}).join('')||'<div class="c">Még nincs kisállatod.</div>';
  m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{PET.act=+b.dataset.i;SV('k3x120pet',PET);draw()})};draw();
 m.querySelector('#x12eb').onclick=()=>{if(!canPay(3000)){m.querySelector('#x12ea').textContent='💸';return}const a=m.querySelector('#x12ea');let n=0;const iv=setInterval(()=>{a.textContent=n%2?'🥚':'🐣';a.style.transform='rotate('+(n%2?-15:15)+'deg)';if(++n>8){clearInterval(iv);a.style.transform='';const p=Math.floor(Math.random()*PETS.length);PET.list.push(p);if(PET.act<0)PET.act=PET.list.length-1;SV('k3x120pet',PET);a.textContent=PETS[p][0];draw()}},180)}}
const petB=()=>PET.act>=0&&PET.list[PET.act]!==undefined?PETS[PET.list[PET.act]][3]:null;
let petM=null;

// =====================================================================
// 20: SZEZONÁLIS TÖRTÉNET
const week=()=>{const d=new Date();const o=new Date(d.getFullYear(),0,1);return d.getFullYear()+'-'+Math.ceil(((d-o)/864e5+o.getDay()+1)/7)};
const ST=[['kill',10,'🕵️ 1. fejezet: Kérdezd ki a gyanúsítottakat – ejts ki 10 ellenfelet'],['chest',5,'📦 2. fejezet: Keresd meg a bizonyítékokat – nyiss ki 5 ládát (vagy kamiont)'],['air',1,'🚁 3. fejezet: Kövesd a gyanúsítottat a levegőben – repülj helikopterrel vagy repülővel'],['spell',15,'🔮 4. fejezet: Fejtsd meg a titkosírást – varázsolj 15-ször'],['base',2,'🚩 5. fejezet: Foglald el a rejtekhelyeket – foglalj el 2 bázist'],['potion',2,'🧪 6. fejezet: Igazságszérum – igyál meg 2 varázsitalt'],['win',1,'🏆 Finálé: Leplezd le a „Nagy Tanácsadót” – nyerj meg egy meccset']];
let STO=LS('k3x120story',{w:'',i:0,n:0});if(STO.w!==week())STO={w:week(),i:0,n:0};
function story(t,n){if(STO.i>=ST.length||ST[STO.i][0]!==t)return;STO.n+=n||1;if(STO.n>=ST[STO.i][1]){STO.i++;STO.n=0;money(3000);sayX('📖 Fejezet teljesítve! +3000 Ft'+(STO.i>=ST.length?' · 🎉 A heti történet kész! +20 000 Ft bónusz':''));if(STO.i>=ST.length)money(20000)}SV('k3x120story',STO)}
function storyUI(){modal('<h2>📖 Heti történet: „A Kampánybusz Rejtélye”</h2><div style="opacity:.8">Valaki eltüntette a kampánybusz kasszáját. Göngyölítsd fel az ügyet egy hét alatt! (Kitalált történet.)</div><div style="margin-top:8px">'+ST.map((s,i)=>'<div class="c" style="margin:4px 0;'+(i<STO.i?'opacity:.55':'')+'">'+(i<STO.i?'✅ ':i===STO.i?'▶️ ':'🔒 ')+s[2]+(i===STO.i?' <b>('+STO.n+'/'+s[1]+')</b>':'')+'</div>').join('')+'</div>')}
window.x120story=story;

// =====================================================================
// 15: PÁLYASZERKESZTŐ
const ED_T=[['🧱','fal',0x9ca3af],['📦','láda',0x92400e],['🟫','emelvény',0x78716c],['🌲','fa',0x15803d],['🎁','kincs',0xfacc15]];
let MYMAP=LS('k3x120map',{cells:{},on:false});
function editorUI(){let tool=0;const m=modal('<h2>🗺️ Saját sziget-szerkesztő</h2><div>Kattints a rácsra! Ha be van kapcsolva, a következő BR-meccsen a pálya közepén megépül a te szigeted. (1 cella = 3 m)</div><div id="x12et" style="margin:6px 0"></div><canvas id="x12ec" width="480" height="480" style="background:#14532d;border-radius:8px;max-width:100%;cursor:crosshair"></canvas><div><label><input type="checkbox" id="x12eo"> Saját pálya bekapcsolva</label> <button class="b" id="x12ex">📤 Megosztó kód</button><button class="b" id="x12ei">📥 Kód betöltése</button><button class="b" id="x12ec2">🗑️ Törlés</button></div><textarea id="x12ek" style="width:100%;height:50px;margin-top:4px" placeholder="Ide jön / ide másold a megosztó kódot"></textarea>');
 const cv=m.querySelector('#x12ec'),cx=cv.getContext('2d'),N=16,S2=30;
 const draw=()=>{m.querySelector('#x12et').innerHTML=ED_T.map((t,i)=>'<button class="b" data-t="'+i+'" style="'+(i===tool?'background:#facc15;color:#000':'')+'">'+t[0]+' '+t[1]+'</button>').join('')+'<button class="b" data-t="-1" style="'+(tool<0?'background:#facc15;color:#000':'')+'">🧽 radír</button>';
  m.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tool=+b.dataset.t;draw()});cx.clearRect(0,0,480,480);cx.strokeStyle='#ffffff22';for(let i=0;i<=N;i++){cx.beginPath();cx.moveTo(i*S2,0);cx.lineTo(i*S2,480);cx.stroke();cx.beginPath();cx.moveTo(0,i*S2);cx.lineTo(480,i*S2);cx.stroke()}
  cx.font='22px sans-serif';cx.textAlign='center';cx.textBaseline='middle';Object.entries(MYMAP.cells).forEach(([k,t])=>{const[a,b]=k.split(',').map(Number);cx.fillText(ED_T[t][0],a*S2+15,b*S2+16)})};draw();
 cv.onclick=e=>{const r=cv.getBoundingClientRect(),a=Math.floor((e.clientX-r.left)/r.width*N),b=Math.floor((e.clientY-r.top)/r.height*N),k=a+','+b;if(tool<0)delete MYMAP.cells[k];else MYMAP.cells[k]=tool;SV('k3x120map',MYMAP);draw()};
 const on=m.querySelector('#x12eo');on.checked=MYMAP.on;on.onchange=()=>{MYMAP.on=on.checked;SV('k3x120map',MYMAP)};
 m.querySelector('#x12ex').onclick=()=>{m.querySelector('#x12ek').value='KR1:'+btoa(JSON.stringify(MYMAP.cells))};
 m.querySelector('#x12ei').onclick=()=>{try{const v=m.querySelector('#x12ek').value.trim().replace(/^KR1:/,'');MYMAP.cells=JSON.parse(atob(v));SV('k3x120map',MYMAP);draw()}catch(e){alert('Hibás kód')}};
 m.querySelector('#x12ec2').onclick=()=>{MYMAP.cells={};SV('k3x120map',MYMAP);draw()}}
function buildMyMap(){if(!MYMAP.on||!Object.keys(MYMAP.cells).length)return;const[ox,oz]=G.arh?randLand():[0,0];
 Object.entries(MYMAP.cells).forEach(([k,t])=>{const[a,b]=k.split(',').map(Number),x=ox+(a-8)*3,z=oz+(b-8)*3;const d=ED_T[t];
  if(t===3){const tr=add(new THREE.Mesh(new THREE.ConeGeometry(1.4,4,8),STD(d[2])));tr.position.set(x,2.5,z);const tk=add(new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,1),STD(0x5b3a1e)));tk.position.set(x,.5,z)}
  else if(t===4){try{pk(x,z,'chest')}catch(e){}}
  else{const h=t===0?3:t===1?1.4:.8;const mm=add(new THREE.Mesh(new THREE.BoxGeometry(3,h,3),STD(d[2])));mm.position.set(x,h/2,z);if(t===2)(G.plat=G.plat||[]).push({x,z,hw:1.5,hd:1.5,h});else(G.col=G.col||[]).push({x,z,r:1.6,h})}});
 const s=lbl('🗺️ SAJÁT SZIGET');s.position.set(ox,7,oz);add(s);sayX('🗺️ A saját szigeted megépült a pályán!')}

// =====================================================================
// 16: BARÁTLISTA + MEGHÍVÓ
let FR=LS('k3x120fr',[]);
const myName=()=>{try{return(S.u&&S.u.name)||localStorage.getItem('ap_name')||'Játékos'}catch(e){return'Játékos'}};
function friendsUI(){const m=modal('<h2>👥 Barátok</h2><div><input id="x12fn" placeholder="Barát neve"> <button class="b" id="x12fa">➕ Hozzáadás</button> <button class="b" id="x12fl">🔗 Meghívó link másolása</button></div><div id="x12fs" style="margin-top:8px"></div><div style="opacity:.6;font-size:12px;margin-top:6px">A meghívó link megnyitásakor a barátod üzenetet kap, hogy csatlakozzon a lobbydhoz.</div>');
 const draw=()=>{m.querySelector('#x12fs').innerHTML=FR.map((f,i)=>'<div class="c" style="margin:4px 0">👤 <b>'+f.replace(/</g,'&lt;')+'</b> <button class="b" data-x="'+i+'">✖</button></div>').join('')||'<div class="c">Még nincs barátod a listán.</div>';m.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{FR.splice(+b.dataset.x,1);SV('k3x120fr',FR);draw()})};draw();
 m.querySelector('#x12fa').onclick=()=>{const v=m.querySelector('#x12fn').value.trim().slice(0,20);if(v&&!FR.includes(v)){FR.push(v);SV('k3x120fr',FR);draw()}};
 m.querySelector('#x12fl').onclick=()=>{const u=location.origin+location.pathname+'?meghivo='+encodeURIComponent(myName());try{navigator.clipboard.writeText(u)}catch(e){}m.querySelector('#x12fl').textContent='✅ Kimásolva!'}}
{const q=new URLSearchParams(location.search).get('meghivo');if(q)setTimeout(()=>{const m=modal('<h2>💌 Meghívó</h2><div><b>'+q.replace(/</g,'&lt;')+'</b> meghívott a Közpénz Royale-ba!</div><button class="b" id="x12fy">➕ Felveszem barátnak</button>');m.querySelector('#x12fy').onclick=()=>{if(!FR.includes(q)){FR.push(q.slice(0,20));SV('k3x120fr',FR)}m.remove()}},3000)}

// =====================================================================
// 17: LOBBY-MINIJÁTÉKOK
let MG=LS('k3x120mg',{kosar:0,darts:0,celo:0});
function mgUI(){const m=modal('<h2>🎯 Lobby-minijátékok</h2><div class="g"><div class="c">🏀 <b>Kosárra dobás</b><br>Rekord: '+MG.kosar+'<br><button class="b" data-g="kosar">Játék</button></div><div class="c">🎯 <b>Darts</b><br>Rekord: '+MG.darts+'<br><button class="b" data-g="darts">Játék</button></div><div class="c">🔫 <b>Céllövölde</b><br>Rekord: '+MG.celo+'<br><button class="b" data-g="celo">Játék</button></div></div><canvas id="x12mc" width="600" height="340" style="width:100%;background:#0b1220;border-radius:10px;margin-top:8px;display:none"></canvas><div id="x12mi" style="text-align:center;font-weight:700"></div>');
 const cv=m.querySelector('#x12mc'),cx=cv.getContext('2d'),info=m.querySelector('#x12mi');let loop=null;
 const stop=(g,sc)=>{cancelAnimationFrame(loop);loop=null;cv.onclick=null;let t='Vége! Pontszám: '+sc;if(sc>MG[g]){MG[g]=sc;SV('k3x120mg',MG);t+=' · 🏆 ÚJ REKORD! +'+ft(sc*20);money(sc*20)}info.textContent=t};
 m.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{if(loop)cancelAnimationFrame(loop);cv.style.display='block';const g=b.dataset.g,t0=performance.now();let sc=0;
  if(g==='kosar'){let p=0,dir=1,shots=10,fly=null;info.textContent='Kattints, amikor a jelző a zöld sávban van! 10 dobás';
   cv.onclick=()=>{if(fly||shots<=0)return;shots--;fly={t:0,ok:Math.abs(p-.5)<.08,good:Math.abs(p-.5)<.16}};
   const f=()=>{cx.fillStyle='#0b1220';cx.fillRect(0,0,600,340);cx.fillStyle='#f97316';cx.fillRect(470,90,80,8);cx.strokeStyle='#fff';cx.strokeRect(540,40,10,60);p+=dir*.012;if(p>1||p<0)dir*=-1;
    cx.fillStyle='#334155';cx.fillRect(40,300,520,18);cx.fillStyle='#16a34a';cx.fillRect(40+520*.42,300,520*.16,18);cx.fillStyle='#22c55e';cx.fillRect(40+520*.46,300,520*.08,18);cx.fillStyle='#fff';cx.fillRect(40+520*p-3,294,6,30);
    if(fly){fly.t+=.025;const x=80+fly.t*430,y=250-Math.sin(fly.t*Math.PI)*220+(fly.ok?0:fly.good?fly.t*20:fly.t*80);cx.fillStyle='#ea580c';cx.beginPath();cx.arc(x,y,12,0,7);cx.fill();if(fly.t>=1){if(fly.ok)sc+=3;else if(fly.good)sc+=1;fly=null;if(shots<=0)return stop(g,sc)}}
    cx.fillStyle='#fff';cx.font='bold 18px sans-serif';cx.fillText('Pont: '+sc+'   Dobás: '+shots,20,30);loop=requestAnimationFrame(f)};f()}
  if(g==='darts'){let a=0,darts=5,hits=[];info.textContent='A célkereszt mozog – kattints, hogy dobj! 5 nyíl';
   cv.onclick=()=>{if(darts<=0)return;darts--;const x=300+Math.sin(a*1.3)*110,y=170+Math.cos(a*1.9)*90,d=Math.hypot(x-300,y-170);const p=d<12?50:d<40?25:d<70?15:d<100?5:0;sc+=p;hits.push([x,y]);if(darts<=0)setTimeout(()=>stop(g,sc),400)};
   const f=()=>{a+=.03;cx.fillStyle='#0b1220';cx.fillRect(0,0,600,340);[[100,'#1e293b'],[70,'#dc2626'],[40,'#f8fafc'],[12,'#16a34a']].forEach(([r,c])=>{cx.fillStyle=c;cx.beginPath();cx.arc(300,170,r,0,7);cx.fill()});
    hits.forEach(h=>{cx.fillStyle='#facc15';cx.beginPath();cx.arc(h[0],h[1],4,0,7);cx.fill()});const x=300+Math.sin(a*1.3)*110,y=170+Math.cos(a*1.9)*90;cx.strokeStyle='#22d3ee';cx.lineWidth=2;cx.beginPath();cx.arc(x,y,10,0,7);cx.moveTo(x-16,y);cx.lineTo(x+16,y);cx.moveTo(x,y-16);cx.lineTo(x,y+16);cx.stroke();
    cx.fillStyle='#fff';cx.font='bold 18px sans-serif';cx.fillText('Pont: '+sc+'   Nyíl: '+darts,20,30);if(loop!==false)loop=requestAnimationFrame(f)};f()}
  if(g==='celo'){let T=[];info.textContent='Lődd le a lehető legtöbb célt 20 mp alatt!';
   cv.onclick=e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*600,y=(e.clientY-r.top)/r.height*340;const i=T.findIndex(t=>Math.hypot(t.x-x,t.y-y)<t.r);if(i>=0){sc+=T[i].r<18?3:1;T.splice(i,1)}};
   const f=()=>{const el=(performance.now()-t0)/1000;if(el>20)return stop(g,sc);if(Math.random()<.04||T.length<2)T.push({x:RN(40,560),y:RN(50,310),r:pick([14,22,28]),t:0});T.forEach(t=>t.t++);T=T.filter(t=>t.t<110);
    cx.fillStyle='#0b1220';cx.fillRect(0,0,600,340);T.forEach(t=>{cx.fillStyle='#dc2626';cx.beginPath();cx.arc(t.x,t.y,t.r,0,7);cx.fill();cx.fillStyle='#fff';cx.beginPath();cx.arc(t.x,t.y,t.r*.45,0,7);cx.fill()});
    cx.fillStyle='#fff';cx.font='bold 18px sans-serif';cx.fillText('Pont: '+sc+'   Idő: '+Math.max(0,20-el).toFixed(1),20,30);loop=requestAnimationFrame(f)};f()}})}

// =====================================================================
// 18: DIVATBEMUTATÓ
function fashionUI(){const names=['Kifutó Kata','Szmokingos Szabolcs','Neon Nóra','Retró Rezső','Csillogó Csenge','Sportos Simon'];const sty=['🎩🕶️👔','👒👗👠','🧢🧥👟','🎀👘🥿','🪖🦺🥾','👑🧣🩰'];
 const my={n:myName()+' (te)',s:'⭐'+(typeof S!=='undefined'&&S.u&&S.u.nka?'💼':'🧥')+'👞',me:1};const ms=[my,...Array.from({length:4},(_,i)=>({n:names[(i+new Date().getDate())%6],s:sty[(i*2+new Date().getDate())%6]}))];
 const m=modal('<h2>👗 Divatbemutató</h2><div>Szavazz a legjobb szettre! (A saját magadra nem szavazhatsz.) A közönség is szavaz – ha te nyersz, 5000 Ft a jutalom.</div><div class="g" id="x12dg" style="margin-top:8px"></div><div id="x12dr" style="margin-top:8px;font-weight:700"></div>');
 m.querySelector('#x12dg').innerHTML=ms.map((x,i)=>'<div class="c" style="text-align:center"><div style="font-size:38px">'+x.s+'</div><b>'+x.n+'</b><br>'+(x.me?'<i>a te szetted</i>':'<button class="b" data-v="'+i+'">👍 Szavazok</button>')+'</div>').join('');
 m.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{const v=ms.map(()=>Math.floor(RN(3,20)));v[+b.dataset.v]+=1;v[0]+=Math.floor(RN(0,8));const w=v.indexOf(Math.max(...v));m.querySelectorAll('[data-v]').forEach(x=>x.disabled=true);
  m.querySelector('#x12dr').innerHTML='Eredmény: '+ms.map((x,i)=>x.n+': '+v[i]).join(' · ')+'<br>🏆 Győztes: '+ms[w].n+(w===0?' – +5000 Ft!':'');if(w===0)money(5000)})}

// =====================================================================
// 21: CSERE (vándor-kereskedőkkel)
function tradeUI(){const t=new Date().toDateString();let D=LS('k3x120trade',{d:'',done:[]});if(D.d!==t)D={d:t,done:[]};
 const OF=[['🧙 Merlin bácsi','3 db 🔵 mana-ital','1 db 🟣 láthatatlanság',()=>POT.mana>=3,()=>{POT.mana-=3;POT.invis++}],['🧚 Tündér Tímea','2000 Ft','2 db 🟢 sebesség-ital',()=>S.c>=2000,()=>{S.c-=2000;POT.speed+=2}],['🐲 Sárkányos Sári','1 kisállat (a legutolsó)','2 tojás ára: 6000 Ft',()=>PET.list.length>0,()=>{PET.list.pop();if(PET.act>=PET.list.length)PET.act=PET.list.length-1;S.c+=6000}],['🎩 Bűvész Béla','1 db 🟣 láthatatlanság','3500 Ft',()=>POT.invis>0,()=>{POT.invis--;S.c+=3500}]];
 const m=modal('<h2>🔄 Csere</h2><div>A vándor-kereskedők naponta egyszer cserélnek veled. Minden csere előtt megmutatjuk, mit adsz és mit kapsz.</div><div class="g" id="x12tg2" style="margin-top:8px"></div>');
 const draw=()=>{m.querySelector('#x12tg2').innerHTML=OF.map((o,i)=>'<div class="c"><b>'+o[0]+'</b><br>Adsz: '+o[1]+'<br>Kapsz: '+o[2]+'<br><button class="b" data-i="'+i+'" '+(D.done.includes(i)||!o[3]()?'disabled':'')+'>'+(D.done.includes(i)?'✅ Ma már cseréltél':'🔄 Csere')+'</button></div>').join('');
  m.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const o=OF[+b.dataset.i];if(!confirm('Biztosan cserélsz?\nAdsz: '+o[1]+'\nKapsz: '+o[2]))return;o[4]();D.done.push(+b.dataset.i);SV('k3x120trade',D);SV('k3x120pot',POT);SV('k3x120pet',PET);try{save()}catch(e){}draw()})};draw()}

// =====================================================================
// 23: OKTATÓ
let TUT=LS('k3x120tut',{done:false}),tutS=null;const tutEl=document.createElement('div');tutEl.id='x12tut';document.body.appendChild(tutEl);
const TS=[['🚶 Mozogj a WASD gombokkal',()=>Math.hypot(G.vx||0,G.vz||0)>2],['🔫 Lőj egyet (bal egérgomb)',()=>(G.bl||[]).length>0],['⤴ Ugorj (SPACE)',()=>G.y>.8&&!(_air())],['🔮 Varázsolj (É gomb)',()=>tutCast],['🎒 Nyisd meg a telefont (U)',()=>G.phOpen||!!document.querySelector('#x60ph[style*="block"]')],['🏍️ Szállj be egy járműbe (E) – vagy írd: /heli',()=>_air()||((window._x10W&&_x10W()||{}).drive)]];
let tutCast=false;const _air=()=>!!(A()&&A().fly());
function tutStart(){tutS={i:0};tutEl.style.display='block'}
function tutStep(){if(!tutS||!normal()){if(tutEl.style.display!=='none'&&!tutS)tutEl.style.display='none';return}let ok=false;try{ok=TS[tutS.i][1]()}catch(e){}if(ok){tutS.i++;money(200);if(tutS.i>=TS.length){tutS=null;TUT.done=true;SV('k3x120tut',TUT);tutEl.style.display='none';sayX('🎓 Oktató kész! +1000 Ft bónusz');money(1000);return}}
 const h='<b>🎓 OKTATÓ ('+(tutS.i+1)+'/'+TS.length+')</b><br>'+TS[tutS.i][0]+'<br><span style="opacity:.6;font-size:11px">Minden lépés +200 Ft</span>';if(tutEl._h!==h){tutEl._h=h;tutEl.innerHTML=h}}

// =====================================================================
// 25: VISSZAJÁTSZÁS-SZERKESZTŐ
let REC=[],recT=0,CLIPS=LS('k3x120clips',[]);
function recStep(dt){recT+=dt;if(recT<.1)return;recT=0;REC.push({p:[G.x,G.z],e:(G.en||[]).filter(e=>!e.dead).slice(0,40).map(e=>[e.x,e.z]),k:G.kills||0,hp:G.hp|0});if(REC.length>900)REC.shift()}
function replayUI(data,title){data=data||REC;if(!data.length){modal('<h2>🎬 Visszajátszás</h2><div>Még nincs felvétel. Játssz egy meccset!</div>');return}
 const m=modal('<h2>🎬 '+(title||'Utolsó meccs (max. 90 mp)')+'</h2><canvas id="x12rc" width="600" height="360" style="width:100%;background:#0b3d1f;border-radius:8px"></canvas><div><input type="range" id="x12rs" min="0" max="'+(data.length-1)+'" value="0" style="width:100%"></div><div>Sebesség: <button class="b" data-sp=".25">0.25×</button><button class="b" data-sp=".5">0.5×</button><button class="b" data-sp="1">1×</button><button class="b" data-sp="2">2×</button> | <button class="b" id="x12ra">✂️ Eleje itt</button><button class="b" id="x12rb">✂️ Vége itt</button><button class="b" id="x12rv">💾 Klip mentése</button></div><div id="x12rl" style="margin-top:6px"></div>');
 const cv=m.querySelector('#x12rc'),cx=cv.getContext('2d'),sl=m.querySelector('#x12rs');let sp=1,pos=0,A0=0,B0=data.length-1,raf;
 const draw=()=>{const f=data[Math.floor(pos)];if(!f)return;const cxp=f.p[0],czp=f.p[1],sc=4;cx.fillStyle='#0b3d1f';cx.fillRect(0,0,600,360);cx.fillStyle='#ef4444';f.e.forEach(e=>{const x=300+(e[0]-cxp)*sc,y=180+(e[1]-czp)*sc;if(x>0&&x<600&&y>0&&y<360){cx.beginPath();cx.arc(x,y,5,0,7);cx.fill()}});
  cx.fillStyle='#38bdf8';cx.beginPath();cx.arc(300,180,8,0,7);cx.fill();cx.fillStyle='#fff';cx.font='bold 15px sans-serif';cx.fillText('⏱ '+(pos/10).toFixed(1)+' mp · 💀 '+f.k+' · ❤️ '+f.hp+' · klip: '+(A0/10).toFixed(1)+'–'+(B0/10).toFixed(1)+' mp · '+sp+'×',12,22)};
 const loop=()=>{if(!document.body.contains(m))return;pos+=sp;if(pos>B0)pos=A0;sl.value=pos;draw();raf=setTimeout(loop,100)};loop();
 sl.oninput=()=>{pos=+sl.value;draw()};m.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>sp=+b.dataset.sp);
 m.querySelector('#x12ra').onclick=()=>{A0=Math.floor(pos);if(B0<A0)B0=data.length-1};m.querySelector('#x12rb').onclick=()=>{B0=Math.max(A0+1,Math.floor(pos))};
 m.querySelector('#x12rv').onclick=()=>{const clip=data.slice(A0,B0+1).filter((_,i)=>i%2===0);CLIPS.unshift({n:new Date().toLocaleString('hu-HU'),d:clip});CLIPS=CLIPS.slice(0,5);SV('k3x120clips',CLIPS);lst()};
 const lst=()=>{m.querySelector('#x12rl').innerHTML='<b>Mentett klipek:</b> '+(CLIPS.map((c,i)=>'<button class="b" data-c="'+i+'">🎞️ '+c.n+'</button>').join('')||'nincs');m.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{m.remove();const c=CLIPS[+b.dataset.c];replayUI(c.d.flatMap(x=>[x,x]),'Klip: '+c.n)})};lst()}

// =====================================================================
// LOBBY DOKK GOMBOK
function dock(){const d=$$('soDock');if(!d||$$('x12b0'))return!!d;
 [['🧪 ÜST',potUI],['🥚 TOJÁS',eggUI],['🌳 KÉPESSÉGFA',treeUI],['📖 TÖRTÉNET',storyUI],['🗺️ SZERKESZTŐ',editorUI],['👥 BARÁTOK',friendsUI],['🎯 MINIJÁTÉK',mgUI],['👗 DIVAT',fashionUI],['🔄 CSERE',tradeUI],['🎓 OKTATÓ',()=>{TUT.done=false;SV('k3x120tut',TUT);modal('<h2>🎓 Oktató</h2><div>A következő meccs elején a bal oldalon lépésről lépésre végigvezet az alapokon (mozgás, lövés, ugrás, varázslat, telefon, jármű). Minden lépés +200 Ft, a végén +1000 Ft.</div>')}],['🎬 VISSZAJÁTSZÁS',()=>replayUI()]].forEach(([t,f],i)=>{const b=document.createElement('button');b.id='x12b'+i;b.textContent=t;b.onclick=f;d.appendChild(b)});return true}
const di=setInterval(()=>{if(dock())clearInterval(di)},800);

// =====================================================================
// MECCS-OBJEKTUMOK
let M={};
function clearM(){OBJ.forEach(o=>{try{scene.remove(o)}catch(e){}});OBJ=[];M={};petM=null}
function setupMatch(){clearM();const g=G;M={books:[],hides:[],totems:[],flags:[],metro:[],truck:null,boss:null,nem:null,volc:null,lava:[],lavaT:30,night:false,hide:false,revive:false,board:false,trick:0,heliCd:0,firing:false,G:g};
 // 2: varázskönyvek
 const BK=[['chain','⛓️ Villámlánc',35,3],['hole','🕳️ Fekete lyuk',50,10],['wolf','🐺 Farkas-idézés',40,12],['meteor2','🌠 Csillageső',45,8]];
 const api=A();if(api){BK.forEach(b=>{api.SP[b[0]]=[b[1],b[2],b[3]]});
  api.EXT.chain=()=>{let last={x:G.x,z:G.z},hit=new Set();for(let i=0;i<4;i++){let b=null,bd=16;(G.en||[]).forEach(e=>{if(e.dead||hit.has(e))return;const d=Math.hypot(e.x-last.x,e.z-last.z);if(d<bd){bd=d;b=e}});if(!b)break;hit.add(b);api.beam(b,0x60a5fa);dmgE(b,40-i*6,false);last=b}story('spell')};
  api.EXT.hole=()=>{const[fx,fz]=[Math.cos(G.ang),Math.sin(G.ang)],x=G.x+fx*14,z=G.z+fz*14;const o=api.orb(0x1e1b4b,1.6);o.position.set(x,2,z);let t=0;const iv=setInterval(()=>{t+=.1;(G.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-x,e.z-z);if(d<12){e.x+=(x-e.x)*.12;e.z+=(z-e.z)*.12;if(d<3)dmgE(e,6,false)}});o.rotation.y+=.5;if(t>=3){clearInterval(iv);scene.remove(o)}},100);story('spell')};
  api.EXT.wolf=()=>{const w=lbl('🐺','#fff');w.scale.set(2,2,1);w.position.set(G.x,1.2,G.z);scene.add(w);let t=0;const iv=setInterval(()=>{t+=.1;let b=null,bd=40;(G.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-w.position.x,e.z-w.position.z);if(d<bd){bd=d;b=e}});if(b){const d=bd||1;w.position.x+=(b.x-w.position.x)/d*1.4;w.position.z+=(b.z-w.position.z)/d*1.4;if(d<2&&Math.random()<.3)dmgE(b,12,false)}if(t>=10||!inMatch()){clearInterval(iv);scene.remove(w)}},100);story('spell')};
  api.EXT.meteor2=()=>{for(let i=0;i<6;i++)setTimeout(()=>{if(!inMatch())return;const x=G.x+Math.cos(G.ang)*RN(8,25)+RN(-6,6),z=G.z+Math.sin(G.ang)*RN(8,25)+RN(-6,6);api.boom(x,z,5,45,0xfde68a)},i*250);story('spell')}}
 for(let i=0;i<(g.arh?8:3);i++){const[x,z]=randLand(),b=BK[i%BK.length];const s=lbl('📖 '+b[1]+' [E]','#c4b5fd');s.position.set(x,1.6,z);add(s);M.books.push({x,z,s,id:b[0],n:b[1]})}
 // 9: rejtekhelyek (bokor + kuka)
 for(let i=0;i<(g.arh?14:5);i++){const[x,z]=randLand(),bush=i%2===0;const m=add(bush?new THREE.Mesh(new THREE.SphereGeometry(1.4,10,8),STD(0x166534)):new THREE.Mesh(new THREE.CylinderGeometry(.8,.7,1.6,10),STD(0x475569,{metalness:.5})));m.position.set(x,bush?1:.8,z);M.hides.push({x,z,m,n:bush?'🌳 bokor':'🗑️ kuka'})}
 // 10: újraélesztő totem
 for(let i=0;i<(g.arh?3:1);i++){const[x,z]=randLand();const m=add(new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,2.6,8),STD(0xfacc15,{emissive:0x854d0e})));m.position.set(x,1.3,z);const s=lbl('🗿 TOTEM [E]');s.position.set(x,3.6,z);add(s);M.totems.push({x,z,m,s})}
 if(!g.arh)return;
 // 14: bázisok
 ['🚩 ALFA','🚩 BÉTA','🚩 GAMMA'].forEach(n=>{const[x,z]=randLand(30);const pole=add(new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,7),STD(0xe5e7eb)));pole.position.set(x,3.5,z);const fl=add(new THREE.Mesh(new THREE.BoxGeometry(2,1.2,.05),STD(0x94a3b8)));fl.position.set(x+1,6.2,z);const s=lbl(n+' BÁZIS');s.position.set(x,8.2,z);add(s);M.flags.push({x,z,fl,n,p:0,own:false,t:0})});
 // 13: metró
 const st=[randLand(),randLand(120),randLand(120)];st.forEach((p,i)=>{const m=add(new THREE.Mesh(new THREE.BoxGeometry(5,3,4),STD(0x1d4ed8)));m.position.set(p[0],1.5,p[1]);const s=lbl('🚇 METRÓ '+(i+1)+' [E]','#93c5fd');s.position.set(p[0],4.5,p[1]);add(s);M.metro.push({x:p[0],z:p[1]})});
 // 12: vulkán (a hillH is felveszi, mert az extra110 900 ms múlva szkennel)
 {const[x,z]=randLand(80);const v=add(new THREE.Mesh(new THREE.ConeGeometry(22,28,16),STD(0x44403c)));v.position.set(x,14,z);const lava=add(new THREE.Mesh(new THREE.CylinderGeometry(4,4,.6,16),new THREE.MeshBasicMaterial({color:0xff4500})));lava.position.set(x,27.6,z);const s=lbl('🌋 VULKÁN','#fb923c');s.position.set(x,33,z);add(s);M.volc={x,z}}
 // 7: kamion
 {const t=new THREE.Group();const c=new THREE.Mesh(new THREE.BoxGeometry(6,3,2.6),STD(0x334155,{metalness:.6}));c.position.y=2;const cab=new THREE.Mesh(new THREE.BoxGeometry(2,2.4,2.6),STD(0xb91c1c));cab.position.set(4,1.7,0);t.add(c,cab);const s=lbl('🚚 KAMION – lődd szét!','#fca5a5');s.position.y=5;t.add(s);add(t);const a=randLand(),b=randLand(150);M.truck={m:t,a,b,t:0,hp:600,mhp:600,x:a[0],z:a[1],dead:false}}
 // 6: nemezis
 const nem=LS('k3x120nem',null);if(nem)setTimeout(()=>{const e=(G.en||[]).find(e=>!e.dead);if(!e||!inMatch())return;e.name=e.nm='😈 '+nem;e._nem=1;const s=lbl('😈 NEMEZIS: '+nem,'#f87171');s.position.y=4;try{e.m.add(s)}catch(er){}M.nem=e;sayX('😈 A nemezised ('+nem+') is itt van! Ejtsd ki: +5000 Ft')},8000);
 // 11: éjszakai meccs
 if(Math.random()<.2||window._x12night){window._x12night=false;nightOn()}
 buildMyMap()}
function nightOn(){M.night=true;scene.traverse(o=>{if(o.isLight&&!o._x12){o._x12i=o.intensity;o.intensity*=o.isAmbientLight||o.isHemisphereLight?.25:.3}});if(scene.fog){scene.fog._c=scene.fog.color.getHex();scene.fog.color.setHex(0x020617)}scene._bg=scene.background;scene.background=new THREE.Color(0x020617);
 const sl=new THREE.SpotLight(0xfff7d6,2.2,60,.45,.5);sl._x12=1;const tg=new THREE.Object3D();scene.add(tg);sl.target=tg;scene.add(sl);M.lamp={sl,tg};OBJ.push(sl,tg);sayX('🌙 ÉJSZAKAI MECCS! A zseblámpád világít – vigyázz, a lövések elárulnak!')}
function nightOff(){scene.traverse(o=>{if(o._x12i!==undefined){o.intensity=o._x12i;delete o._x12i}});if(scene.fog&&scene.fog._c!==undefined)scene.fog.color.setHex(scene.fog._c);if(scene._bg!==undefined)scene.background=scene._bg}

// =====================================================================
// MECCS-CIKLUS
function matchStep(dt){const g=G,now=performance.now();if(!M.G||M.G!==g)return;
 // 1: járműfegyver
 const F=A()&&A().fly();M.heliCd-=dt;if(F&&M.firing&&M.heliCd<=0){const api=A();if(F.k==='heli'){M.heliCd=.12;api.shoot({col:0xfde047,dmg:14,r:.15,spd:70,life:1})}else{M.heliCd=1.4;const bx=F.x,bz=F.z,by=F.y;const o=api.orb(0x111827,.5);o.position.set(bx,by,bz);let vy=0,y=by;const iv=setInterval(()=>{vy-=30*.05;y+=vy*.05;o.position.y=y;if(y<=hH(bx,bz)){clearInterval(iv);scene.remove(o);api.boom(bx,bz,7,75,0xf97316);if(Math.hypot(G.x-bx,G.z-bz)<4&&!A().fly())try{hurt(30)}catch(e){}}},50)}}
 if(F)story('air');
 // kisállat
 const pb=petB();if(pb&&!petM){petM=lbl(PETS[PET.list[PET.act]][0],'#fff');petM.scale.set(1.5,1.5,1);add(petM)}if(petM){const tx=g.x-Math.cos(g.ang)*1.8+Math.sin(g.ang)*1.2,tz=g.z-Math.sin(g.ang)*1.8-Math.cos(g.ang)*1.2;petM.position.x+=(tx-petM.position.x)*Math.min(1,dt*5);petM.position.z+=(tz-petM.position.z)*Math.min(1,dt*5);petM.position.y=g.y+1.2+Math.sin(now/200)*.15}
 // sebesség (ital, képességfa, kisállat) – az extra110 _spdB-jére szorzunk
 const sm=(BUF.speed>now?1.4:1)*(1+TREE.spd*.04)*(pb==='spd'?1.05:1);if(sm!==1){g._spdB=(g._spdB||1)*sm;M._spdApplied=sm}
 // könyvek, totemek felvétele (automatikus, ha rajta állsz)
 M.books=M.books.filter(b=>{if(near(b,2.2)){A()&&A().addExtra(b.id);scene.remove(b.s);sayX('📖 Új varázslat: '+b.n+'! (Á gombbal válthatsz rá)');return false}return true});
 // kamion
 const T=M.truck;if(T&&!T.dead){T.t+=dt/60;if(T.t>1){T.t=0;const tmp=T.a;T.a=T.b;T.b=tmp}const x=T.a[0]+(T.b[0]-T.a[0])*T.t,z=T.a[1]+(T.b[1]-T.a[1])*T.t;T.m.rotation.y=-Math.atan2(T.b[1]-T.a[1],T.b[0]-T.a[0]);T.x=x;T.z=z;T.m.position.set(x,hH(x,z),z);
  (g.bl||[]).forEach(b=>{if(b._x12)return;const rr=3.5+Math.hypot(b.vx||0,b.vz||0)*dt;if(Math.hypot(b.x-x,b.z-z)<rr&&(b.y||1)<6){b._x12=1;T.hp-=b.d||10;b.l=0}});
  if(T.hp<=0){T.dead=true;scene.remove(T.m);for(let i=0;i<5;i++)try{pk(x+RN(-4,4),z+RN(-4,4),pick(['chest','hp','coin','w3','beer']))}catch(e){}money(2500);sayX('🚚💥 Szétlőtted a kamiont! Zsákmány + 2500 Ft');story('chest')}}
 // főellenség az utolsó körben
 if(!M.boss&&g.arh&&g.left>0&&g.left<=4){const e=(g.en||[]).filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z))[0];if(e){M.boss=e;e.hp*=6;e.mhp=(e.mhp||e.hp)*6;e._boss=1;e.name=e.nm='👔 FŐTANÁCSADÓ';try{e.m.scale.multiplyScalar(2);const s=lbl('👔 FŐTANÁCSADÓ (BOSS)','#fca5a5');s.position.y=3;e.m.add(s)}catch(er){}sayX('👔 Megjelent a FŐTANÁCSADÓ! Ő a boss – különleges zsákmányt dob!')}}
 if(M.boss&&M.boss.dead&&!M.bossDone){M.bossDone=1;try{pk(M.boss.x,M.boss.z,'chest');pk(M.boss.x+2,M.boss.z,'w3')}catch(e){}money(10000);sayX('👔💀 Legyőzted a Főtanácsadót! +10 000 Ft')}
 if(M.nem&&M.nem.dead&&!M.nemDone){M.nemDone=1;money(5000);SV('k3x120nem',null);sayX('😈 Bosszú kész! +5000 Ft')}
 // bázisok
 M.flags.forEach(f=>{if(f.own){f.t+=dt;if(f.t>30){f.t=0;try{g.res[g.wp]=(g.res[g.wp]||0)+30;g.hp=Math.min(g.mhp,g.hp+15)}catch(e){}money(500);sayX(f.n+' bázis ellátmányt küldött: lőszer, +15 HP, +500 Ft')}return}
  if(near(f,5)){f.p+=dt/8;if(f.p>=1){f.own=true;f.fl.material.color.setHex(0x22c55e);sayX(f.n+' bázis a tiéd! 30 mp-enként ellátmányt kapsz.');story('base')}}else f.p=Math.max(0,f.p-dt/16)});
 // vulkán
 if(M.volc){M.lavaT-=dt;if(M.lavaT<=0){M.lavaT=RN(45,70);sayX('🌋 KITÖR A VULKÁN! Lávabombák!');for(let i=0;i<10;i++)setTimeout(()=>{if(!inMatch()||!M.volc)return;const a=RN(0,6.28),r=RN(8,45),x=M.volc.x+Math.cos(a)*r,z=M.volc.z+Math.sin(a)*r;const api=A();if(api)api.boom(x,z,5,40,0xff4500);if(Math.hypot(G.x-x,G.z-z)<5)try{hurt(25)}catch(e){}},i*400)}}
 // éjszakai lámpa
 if(M.lamp){M.lamp.sl.position.set(g.x,g.y+2.2,g.z);M.lamp.tg.position.set(g.x+Math.cos(g.ang)*10,g.y+1+Math.sin(g.pit||0)*10,g.z+Math.sin(g.ang)*10)}
 // snowboard
 if(M.board){const h=hH(g.x,g.z);if(h<.3){M.board=false;sayX('🏂 Leértél! Trükkpont: '+M.trick+' → +'+ft(M.trick*50));money(M.trick*50)}else{const e=.8,gx=hH(g.x+e,g.z)-hH(g.x-e,g.z),gz=hH(g.x,g.z+e)-hH(g.x,g.z-e),gl=Math.hypot(gx,gz)||1;M.bv=Math.min(34,(M.bv||6)+dt*14);g.x-=gx/gl*M.bv*dt+Math.cos(g.ang)*0;g.z-=gz/gl*M.bv*dt;g.y=hH(g.x,g.z)}}
 // rejtőzés
 if(M.hide){const h=M.hide;g.x=h.x;g.z=h.z;g.vx=g.vz=0}
 // HUD
 let t=[];if(M.hide)t.push('🫥 Elbújtál ('+M.hide.n+') – E: kibújás');if(M.revive)t.push('🗿 Újraélesztő totem nálad');if(BUF.invis>now)t.push('🟣 Láthatatlan '+Math.ceil((BUF.invis-now)/1000)+' mp');if(BUF.speed>now)t.push('🟢 Gyors '+Math.ceil((BUF.speed-now)/1000)+' mp');
 if(M.board)t.push('🏂 Snowboard · SPACE trükk · '+M.trick+' pont');M.flags.forEach(f=>{if(!f.own&&f.p>0)t.push(f.n+' foglalás '+Math.round(f.p*100)+'%')});if(T&&!T.dead&&near(T,30))t.push('🚚 Kamion: '+Math.max(0,Math.round(T.hp))+'/'+T.mhp);
 const nb=nearThing();if(nb)t.push('[E] '+nb.t);if(hH(g.x,g.z)>12&&!M.board&&!F)t.push('[Ü] 🏂 Snowboard');
 const hs=t.join('<br>');if(hud._h!==hs){hud._h=hs;hud.innerHTML=hs}}
function nearThing(){if(!M.G)return null;if(M.hide)return{t:'Kibújás',f:()=>{M.hide=null}};
 for(const h of M.hides)if(near(h,2.4))return{t:'Elbújás: '+h.n,f:()=>{M.hide=h;sayX('🫥 Elbújtál! Nem sebződsz, de lőni sem tudsz.')}};
 for(const t of M.totems)if(near(t,2.6)&&!t.used)return{t:'Totem felvétele (1 újraélesztés)',f:()=>{t.used=true;scene.remove(t.m);scene.remove(t.s);M.revive=true;sayX('🗿 Újraélesztő totem! Ha kiesnél, egyszer visszahoz.')}};
 for(let i=0;i<M.metro.length;i++)if(near(M.metro[i],4))return{t:'Metró a következő állomásra',f:()=>{const n=M.metro[(i+1)%M.metro.length];const fl=$$('fl');if(fl){fl.style.transition='none';fl.style.opacity=1;setTimeout(()=>{fl.style.transition='opacity 1s';fl.style.opacity=0},300)}G.x=n.x+4;G.z=n.z;G.y=0;sayX('🚇 Megérkeztél: METRÓ '+((i+1)%M.metro.length+1))}};
 return null}

// sebzés / halál módosítók
WP('hurt',a=>{if(!M.G)return;const now=performance.now();if(M.hide||BUF.invis>now){a[0]=0;return}
 if(G.hp-(a[0]||0)<=0&&M.revive){M.revive=false;a[0]=0;G.hp=Math.round(G.mhp*.6);sayX('🗿 A totem visszahozott! (60% HP)');try{flash()}catch(e){}}});
WP('dmgE',a=>{const k=A()?A().kit():0;let m=1+TREE.dmg*.05;if(klv(k)>=10)m*=1.2;if(petB()==='dmg')m*=1.08;a[1]*=m});
WP('pickup',a=>{if(normal()&&a[0]&&a[0].t==='chest')story('chest')});
WP('kill',a=>{if(!normal())return;const k=A()?A().kit():0;KXP[k]=(KXP[k]||0)+25;SV('k3x120kxp',KXP);story('kill')});

// billentyűk + egér
addEventListener('keydown',e=>{if(typing(e)||!normal()||!M.G)return;const k=e.key.toLowerCase();
 if(k==='e'&&!e.repeat){const n=nearThing();if(n){e.stopImmediatePropagation();n.f()}return}
 if(e.code==='BracketLeft'||k==='ő'){e.preventDefault();drink();return}
 if(e.code==='Minus'||k==='ü'){if(hH(G.x,G.z)>12&&!M.board){M.board=true;M.trick=0;M.bv=6;sayX('🏂 Snowboard! Csússz le, SPACE-szel trükközz!')}else if(M.board){M.board=false}return}
 if(k===' '&&M.board&&!e.repeat){M.trick+=Math.floor(RN(1,4));sayX(pick(['🏂 360!','🏂 Indy grab!','🏂 Backflip!','🏂 Method!']))}
 if((e.code==='Semicolon'||k==='é')){tutCast=true;story('spell')}},true);
const blockShot=e=>{if(!M.G||!normal())return;if(M.hide){e.stopImmediatePropagation();return}if(A()&&A().fly()){M.firing=e.type==='mousedown'}};
addEventListener('mousedown',blockShot,true);addEventListener('mouseup',e=>{M.firing=false},true);


// =====================================================================
// 24: MOBIL GOMBOK
const mob=document.createElement('div');mob.id='x12mob';mob.innerHTML='<button id="x12m1">🔫</button><button id="x12m2">E</button><button id="x12m3">🔮</button><button id="x12m4">🔄</button>';document.body.appendChild(mob);
const key=(k,c)=>{dispatchEvent(new KeyboardEvent('keydown',{key:k,code:c||''}));setTimeout(()=>dispatchEvent(new KeyboardEvent('keyup',{key:k,code:c||''})),60)};
const fire=on=>{try{ms.on=on}catch(e){}if(A()&&A().fly()&&M)M.firing=on};
$$('x12m1').addEventListener('touchstart',e=>{e.preventDefault();fire(true)});$$('x12m1').addEventListener('touchend',e=>{e.preventDefault();fire(false)});
$$('x12m2').ontouchstart=e=>{e.preventDefault();key('e')};$$('x12m3').ontouchstart=e=>{e.preventDefault();key('é','Semicolon')};$$('x12m4').ontouchstart=e=>{e.preventDefault();key('r')};
const isTouch=()=>('ontouchstart' in window)||navigator.maxTouchPoints>0;

// =====================================================================
// HOOKOK
WP('launch',null,()=>{REC=[];BUF={};if(M.night)nightOff();clearM();setTimeout(()=>{if(!inMatch())return;if(normal()){try{setupMatch()}catch(e){console.error('x120 setup',e)}
 const g=G,pb=petB();g.mhp+=TREE.hp*10+(pb==='hp'?10:0);g.hp+=TREE.hp*10+(pb==='hp'?10:0);if(pb==='sh'){g.msh+=15;g.sh=(g.sh||0)+15}if(pb==='inv')g.inv.hp=(g.inv.hp||0)+1;
 if(!TUT.done)tutStart()}},700)});
WP('update',null,a=>{if(!inMatch())return;const dt=Math.min(.05,a[0]||.016);if(normal()){try{matchStep(dt)}catch(e){console.error('x120 step',e)}recStep(dt)}
 const md=isTouch()&&normal()?'flex':'none';if(mob.style.display!==md)mob.style.display=md});
setInterval(tutStep,300);
WP('end',a=>{if(!M.G)return;const won=a&&a[0];if(won){SV('k3x120wins',LS('k3x120wins',0)+1);story('win')}
 if(!won&&G&&G.dead!==false){const e=(G.en||[]).filter(e=>!e.dead).sort((p,q)=>Math.hypot(p.x-G.x,p.z-G.z)-Math.hypot(q.x-G.x,q.z-G.z))[0];if(e)SV('k3x120nem',(e.name||e.nm||'Ismeretlen').replace(/^😈 /,''))}
 const k=A()?A().kit():0;KXP[k]=(KXP[k]||0)+(won?150:40);SV('k3x120kxp',KXP);
 if(M.night)nightOff();M.hide=null;M.board=false;tutS=null;tutEl.style.display='none';hud.innerHTML='';hud._h=''});

// parancsok
{const oc=window.extraCmd;window.extraCmd=function(c){const n=String(c).trim().split(/\s+/)[0].toLowerCase();
 if(n==='ejszaka'||n==='éjszaka'){if(inMatch()&&M.G&&!M.night){nightOn();return'🌙 Éjszaka!'}window._x12night=true;return'🌙 A következő meccs éjszakai lesz.'}
 if(n==='kamion'){if(M.truck&&!M.truck.dead){G.x=M.truck.x+8;G.z=M.truck.z;return'🚚 A kamion mellé teleportáltál.'}return'🚚 Nincs kamion.'}
 if(n==='vulkan'||n==='vulkán'){if(M.volc){M.lavaT=0;return'🌋 Kitörés!'}return'🌋 Nincs vulkán ezen a pályán.'}
 if(n==='replay'||n==='visszajatszas'){replayUI();return'🎬'}
 return oc?oc(c):null}}
window._x120=()=>({M,TREE,KXP,POT,PET,STO,REC});
})();
