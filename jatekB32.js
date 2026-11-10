// jatekB32.js – B ügynök: Köpködős mód bővítés: 🛠️ pályaszerkesztő, 🏆 8 fős kieséses bajnokság, ✨ köpés-skinek (kopkodes.js _kpHook)
(function(){
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const tell=t=>{try{say(t)}catch(e){}};const PR=(c,n)=>{try{return window._b36?_b36.P(c,n):n}catch(e){return n}};
let LAY=LS('k3b32lay',{use:false,size:1,obs:[],pads:[]}),SLOTS=LS('k3b32slots',[null,null,null]);
let SK=LS('k3b32skin',{own:['alap'],cur:'alap'});
let T=LS('k3b32tour',null);
const SIZES=[[.8,'Kicsi'],[1,'Normál'],[1.25,'Nagy']];
const RN=['Negyeddöntő','Elődöntő','Döntő','Bajnok'];
// ---------- skinek ----------
const SKINS=[{k:'alap',n:'💧 Alap',p:0},{k:'szivarvany',n:'🌈 Szivárvány',p:15000,c:0xff66cc,tc:t=>new THREE.Color().setHSL((t*.8)%1,1,.6).getHex()},
 {k:'arany',n:'🥇 Arany',p:40000,c:0xffd23f,tc:()=>0xffe680},{k:'csillam',n:'✨ Csillám',p:25000,c:0xc4b5fd,tc:()=>Math.random()<.5?0xffffff:0xa78bfa}];
const SMAT={};
function skinMat(sk){if(!SMAT[sk.k])SMAT[sk.k]=new THREE.MeshPhongMaterial({color:sk.c,transparent:true,opacity:.9,shininess:140,specular:0xffffff,emissive:sk.c,emissiveIntensity:.25});return SMAT[sk.k]}
// ---------- bajnokság ----------
const TNAMES=['Nyálas Nándor','Csepp Cecília','Pöttyös Pongrác','Hullám Hanna','Spriccelő Sebő','Buborék Boglárka','Locsoló Lőrinc','Párás Piroska','Fröccs Ferenc','Zuhany Zita'];
function tNew(){const nm=TNAMES.slice().sort(()=>Math.random()-.5).slice(0,7);const me=(typeof ACC!=='undefined'&&ACC&&ACC.user&&ACC.user.name)||(typeof S!=='undefined'&&S.name)||'Te';T={on:true,r:0,b:[[me,...nm]],me,out:false};SV('k3b32tour',T)}
function tOpp(){const cur=T.b[T.r],i=cur.indexOf(T.me);return cur[i^1]}
function pay(n){if(!n||typeof S==='undefined')return;S.c=(S.c||0)+n;try{save()}catch(e){}}
function tAdvance(won){const cur=T.b[T.r],nx=[];for(let i=0;i<cur.length;i+=2){const a=cur[i],b=cur[i+1];if(a===T.me||b===T.me)nx.push(won?T.me:(a===T.me?b:a));else nx.push(Math.random()<.5?a:b)}
 T.b.push(nx);T.r++;
 if(!won){T.on=false;T.out=true;const pr=[0,2000,10000][T.r-1]||0;pay(pr);tell('🏆 Kiestél: '+RN[T.r-1]+(pr?' – vigaszdíj '+fmt(pr):''))}
 else if(nx.length===1){T.on=false;pay(30000);tell('🏆 BAJNOK LETTÉL! +'+fmt(30000))}
 else tell('🏆 Továbbjutottál: '+RN[T.r]+'!');SV('k3b32tour',T)}
function bracketHTML(){if(!T)return'';
 return'<div style="display:flex;gap:8px;overflow-x:auto;font-size:12px;margin-top:6px">'+T.b.map((rd,ri)=>'<div style="min-width:100px"><b style="color:#fde047">'+RN[ri]+'</b>'+rd.map((n,i)=>'<div style="background:'+(n===T.me?'#0e3a4a':'#1e293b')+';border-radius:6px;padding:3px 6px;margin:2px 0'+(i%2===1?' 0 8px':'')+'">'+n+'</div>').join('')+'</div>').join('')+'</div>'}
// ---------- hookok ----------
let built=[],PADG=null,OBG=null,PADM=null,OBM=null;
window._kpHook={
 rmul:()=>LAY.use?LAY.size:1,
 nbots:()=>T&&T.on?1:_kp.ST.bots,
 names:()=>T&&T.on?[tOpp()]:null,
 build:(SC,W)=>{built=[];if(!LAY.use)return;const base=W.R0*LAY.size;
  if(!OBG){OBG=new THREE.CylinderGeometry(.8,.9,1.8,10);PADG=new THREE.CylinderGeometry(.8,.8,.15,14);OBM=new THREE.MeshLambertMaterial({color:0x8b7355});PADM=new THREE.MeshBasicMaterial({color:0xf472b6})}
  LAY.obs.forEach(o=>{const m=new THREE.Mesh(OBG,OBM);m.position.set(o[0]*base,.9,o[1]*base);m.castShadow=true;SC.add(m);built.push({t:'o',x:m.position.x,z:m.position.z})});
  LAY.pads.forEach(o=>{const m=new THREE.Mesh(PADG,PADM);m.position.set(o[0]*base,.08,o[1]*base);SC.add(m);built.push({t:'p',x:m.position.x,z:m.position.z})})},
 pstep:(p,dt,W)=>{if(!built.length)return;for(const b of built){const dx=p.x-b.x,dz=p.z-b.z,d=Math.hypot(dx,dz);
  if(b.t==='o'){if(d<1.25&&p.y<1.8){const k=(1.25-d)/(d||1);p.x+=dx*k;p.z+=dz*k;p.vx*=.6;p.vz*=.6}}
  else if(d<.85&&p.ground){p.vy=10.5;p.ground=false}}},
 spit:(s,p,W)=>{if(p!==W.me)return;const sk=SKINS.find(x=>x.k===SK.cur);if(!sk||!sk.c)return;s.m.material=skinMat(sk);s.tc=sk.tc},
 end:won=>{if(T&&T.on)tAdvance(won)},
 menu:el=>{el.innerHTML='<div class="lbl">Extrák</div><button class="o" id="b32ed">🛠️ Pályaszerkesztő'+(LAY.use?' (BE)':'')+'</button><button class="o" id="b32sk">✨ Köpés-skinek</button><button class="o" id="b32to">🏆 Új bajnokság (8 fő)</button>'+(T&&T.on?'<div style="font-size:12px;color:#a5f3fc">'+RN[T.r]+' – következő ellenfél: <b>'+tOpp()+'</b> (1v1) – nyomd az INDULÁS-t</div>':'')+(T?bracketHTML():'');
  el.querySelector('#b32ed').onclick=editor;el.querySelector('#b32sk').onclick=skins;el.querySelector('#b32to').onclick=()=>{if(T&&T.on&&!confirm('Új bajnokság? A mostani elveszik.'))return;tNew();_kp.menu()}}};
// ---------- panel ----------
const pan=document.createElement('div');pan.id='b32pan';pan.style.cssText='position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:#000a;font:14px system-ui;color:#e2e8f0';document.body.appendChild(pan);
const btn='background:#1e293b;color:#fff;border:2px solid #334155;border-radius:9px;padding:6px 11px;margin:3px;cursor:pointer';
const on=b=>b?';border-color:#38bdf8':'';
function box(h){pan.innerHTML='<div style="background:#0f172a;border:2px solid #38bdf8;border-radius:14px;padding:16px;max-width:560px;width:calc(100% - 32px);max-height:90vh;overflow:auto">'+h+'<div><button id="b32x" style="'+btn+'">✖ Bezár</button></div></div>';pan.style.display='flex';pan.querySelector('#b32x').onclick=()=>{pan.style.display='none';try{_kp.menu()}catch(e){}}}
function skins(){box('<h2>✨ Köpés-skinek</h2><div style="font-size:12px;color:#94a3b8">Egyenleg: '+fmt((typeof S!=='undefined'&&S.c)||0)+'</div>'+SKINS.map(s=>{const own=SK.own.includes(s.k);return'<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding:6px 0"><span>'+s.n+'</span><button data-k="'+s.k+'" style="'+btn+'">'+(SK.cur===s.k?'✔ Használatban':own?'Felveszem':fmt(PR('skin',s.p)))+'</button></div>'}).join(''));
 pan.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const s=SKINS.find(x=>x.k===b.dataset.k);if(!SK.own.includes(s.k)){{const pp=PR('skin',s.p);if(((typeof S!=='undefined'&&S.c)||0)<pp){tell('Nincs elég pénzed');return}pay(-pp)}SK.own.push(s.k);tell('✨ Megvetted: '+s.n)}SK.cur=s.k;SV('k3b32skin',SK);skins()})}
let tool='o';
function editor(){box('<h2>🛠️ Köpködős pályaszerkesztő</h2><div>Sziget mérete: '+SIZES.map((s,i)=>'<button data-sz="'+i+'" style="'+btn+on(LAY.size===s[0])+'">'+s[1]+'</button>').join('')+'</div><div>Eszköz: <button data-t="o" style="'+btn+on(tool==='o')+'">🪨 Akadály</button><button data-t="p" style="'+btn+on(tool==='p')+'">🟣 Ugrópárna</button><button data-t="d" style="'+btn+on(tool==='d')+'">🧽 Törlés</button></div><canvas id="b32cv" width="300" height="300" style="background:#0c4a6e;border-radius:10px;display:block;margin:8px auto;cursor:crosshair;max-width:100%"></canvas><div><label><input type="checkbox" id="b32use" '+(LAY.use?'checked':'')+'> Saját pálya használata a meccseken</label></div><div>Mentés/betöltés: '+[0,1,2].map(i=>'<button data-sv="'+i+'" style="'+btn+'">💾 '+(i+1)+'</button><button data-ld="'+i+'" style="'+btn+'"'+(SLOTS[i]?'':' disabled')+'>📂 '+(i+1)+'</button>').join('')+'<button id="b32clr" style="'+btn+'">🗑️ Ürít</button></div>');
 const cv=pan.querySelector('#b32cv'),x=cv.getContext('2d');
 const draw=()=>{x.clearRect(0,0,300,300);x.fillStyle='#e9d8a6';x.beginPath();x.arc(150,150,130*LAY.size/1.25,0,6.283);x.fill();const k=130*LAY.size/1.25;x.fillStyle='#8b7355';LAY.obs.forEach(o=>{x.beginPath();x.arc(150+o[0]*k,150+o[1]*k,9,0,6.283);x.fill()});x.fillStyle='#f472b6';LAY.pads.forEach(o=>{x.beginPath();x.arc(150+o[0]*k,150+o[1]*k,8,0,6.283);x.fill()})};draw();
 const sv=()=>SV('k3b32lay',LAY);
 cv.onclick=e=>{const r=cv.getBoundingClientRect(),k=130*LAY.size/1.25,px=((e.clientX-r.left)/r.width*300-150)/k,pz=((e.clientY-r.top)/r.height*300-150)/k;if(Math.hypot(px,pz)>.92)return;
  if(tool==='d'){['obs','pads'].forEach(n=>LAY[n]=LAY[n].filter(o=>Math.hypot(o[0]-px,o[1]-pz)>.09))}else{const a=tool==='o'?LAY.obs:LAY.pads;if(a.length>=12){tell('Max. 12 darab');return}a.push([+px.toFixed(3),+pz.toFixed(3)])}sv();draw()};
 pan.querySelectorAll('[data-sz]').forEach(b=>b.onclick=()=>{LAY.size=SIZES[+b.dataset.sz][0];sv();editor()});
 pan.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tool=b.dataset.t;editor()});
 pan.querySelector('#b32use').onchange=e=>{LAY.use=e.target.checked;sv()};
 pan.querySelectorAll('[data-sv]').forEach(b=>b.onclick=()=>{SLOTS[+b.dataset.sv]=JSON.parse(JSON.stringify(LAY));SV('k3b32slots',SLOTS);tell('💾 Pálya mentve: '+(+b.dataset.sv+1));editor()});
 pan.querySelectorAll('[data-ld]').forEach(b=>b.onclick=()=>{const s=SLOTS[+b.dataset.ld];if(s){LAY=JSON.parse(JSON.stringify(s));LAY.use=true;sv();editor()}});
 pan.querySelector('#b32clr').onclick=()=>{LAY.obs=[];LAY.pads=[];sv();draw()}}
window._b32={LAY:()=>LAY,setLay:l=>{LAY=l;SV('k3b32lay',LAY)},T:()=>T,SK:()=>SK,setSkin:k=>{SK.cur=k},tNew,tAdvance,editor,skins,built:()=>built};
})();
