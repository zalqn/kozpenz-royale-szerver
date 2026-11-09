// extra140b.js – ELLENFÉL-AI & BOTOK (x14b): nehézség, személyiség, fedezék, rajok, névtáblák, hallás, gyógyulás+láda, beszólások, bajnok bot, bot-statisztika. F3 = panel
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('x14b WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){console.error('x14b pre '+n,e)}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error('x14b '+n+': '+(e&&e.stack))}return r}};
const LS={g:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const rr=(a,b)=>a+Math.random()*(b-a),pk1=a=>a[Math.floor(Math.random()*a.length)];
const DIFF={easy:{n:'Könnyű',c:'#4ade80',acc:.6,dmg:.6,rof:1.5,hp:.8,sp:.9},norm:{n:'Normál',c:'#60a5fa',acc:1,dmg:1,rof:1,hp:1,sp:1},hard:{n:'Nehéz',c:'#f59e0b',acc:1.3,dmg:1.25,rof:.8,hp:1.25,sp:1.08},mad:{n:'Őrült',c:'#ef4444',acc:1.6,dmg:1.5,rof:.6,hp:1.5,sp:1.18}};
const PERS={rush:{n:'Rohamozó',e:'⚔️'},snip:{n:'Mesterlövész',e:'🎯'},hide:{n:'Bujkáló',e:'🫣'},loot:{n:'Gyűjtögető',e:'🎒'}};
const RAR=[{n:'Közönséges',c:'#cbd5e1'},{n:'Ritka',c:'#4ade80'},{n:'Epikus',c:'#60a5fa'},{n:'Legendás',c:'#c084fc'},{n:'Mítikus',c:'#fbbf24'}];
const N1=['Kockás','Szuszogó','Pörkölt','Lajhár','Turbó','Kukori','Bundás','Csiga','Gombóc','Bajusz','Pocak','Rozsdás','Sajtos','Fürge','Álmos','Csipkés','Lekváros','Pogácsa','Zizi','Morcos'];
const N2=['Bandi','Hörcsög','Ödön','Kapitány','Mókus','Dodó','Bácsi','Gizi','Tücsök','Pityu','Ninja','Lord','Gombász','Kalapos','Rozi','Torta','Professzor','Vakond','Herceg','Kifli'];
const LINES={idle:['Valaki látta a zoknim?','Ma csak nézelődöm.','Itt jó a wifi!','Hol a büfé?','Ez a sziget kisebb volt a térképen.','Anyukám azt mondta, ügyes vagyok.'],fight:['Ne lőj, csak fényképezek!','Ez csak karcolás!','Hé, vigyázz a frizurámra!','Bemelegítettem, most jövök!','Ezt még megbánod... talán.','Pff, lőtávolon kívül vagy!'],hurt:['Jaj! Fedezékbe!','Ez fájt a lelkemnek!','Kérek egy szünetet!','Ki dobta ezt?!'],heal:['Egy kis tapasz és kész.','Vitaminok, gyertek!'],loot:['Ó, egy láda! Az enyém!','Csillogó cucc!'],hear:['Mi volt ez?','Hallottam valamit!','Arra lőnek!'],champ:['Én vagyok a BAJNOK!','Kérsz autogramot?','Térdre, kezdők!']};
const ST=LS.g('k3x14bSet',{diff:'norm',bub:true,sq:true});
const save=()=>LS.s('k3x14bSet',ST);
const css=document.createElement('style');css.textContent=`
.x14bBtn{padding:8px 12px;border-radius:12px;border:1px solid #fbbf2466;background:linear-gradient(135deg,#1e1b4b,#4338ca);color:#fde68a;font:800 13px system-ui;letter-spacing:.5px;cursor:pointer;box-shadow:0 6px 18px #0008,inset 0 1px 0 #ffffff22;transition:transform .15s}
.x14bBtn:hover{filter:brightness(1.15)}
#x14bP{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:60;width:min(560px,94vw);max-height:86vh;overflow:auto;background:linear-gradient(160deg,#111827f2,#1e1b4bf2);border:1px solid #fbbf2455;border-radius:18px;color:#e5e7eb;font:14px system-ui,sans-serif;padding:18px 20px;box-shadow:0 20px 60px #000c;display:none}
#x14bP h2{margin:0 0 4px;font:22px "Luckiest Guy",Impact,sans-serif;color:#fde68a;letter-spacing:1px}
#x14bP .sub{opacity:.7;font-size:12px;margin-bottom:12px}
#x14bP .row{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
#x14bP .ch{flex:1;min-width:90px;padding:10px;border-radius:12px;border:1px solid #ffffff22;background:#0b1022;cursor:pointer;text-align:center;font-weight:700}
#x14bP .ch.on{border-color:var(--c);box-shadow:0 0 0 2px var(--c) inset;color:var(--c)}
#x14bP table{width:100%;border-collapse:collapse;font-size:13px}#x14bP td,#x14bP th{padding:4px 6px;border-bottom:1px solid #ffffff14;text-align:left}
#x14bP .x{position:absolute;right:12px;top:10px;background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
#x14bP label{display:block;margin:4px 0;cursor:pointer}
#x14bEnd{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:70;background:#0b1022ee;border:1px solid #fbbf2466;border-radius:14px;padding:10px 16px;color:#fde68a;font:600 14px system-ui;box-shadow:0 10px 30px #000a;cursor:pointer;max-width:92vw}`;
document.head.appendChild(css);

// ---- névtábla sprite (ritkasági szín) ----
function tag(txt,col,sub){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle='rgba(8,12,30,.72)';const w=500;x.beginPath();x.roundRect?x.roundRect(6,10,w,sub?108:80,22):x.rect(6,10,w,80);x.fill();x.lineWidth=5;x.strokeStyle=col;x.stroke();x.textAlign='center';x.textBaseline='middle';x.font='bold 44px sans-serif';x.fillStyle=col;x.fillText(txt,256,50);if(sub){x.font='bold 26px sans-serif';x.fillStyle='#e5e7eb';x.fillText(sub,256,96)}const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(4.4,1.1,1);return s}
function bubble(b,txt){if(!ST.bub||!b.m)return;const X=b._x14;if(X.bs){b.m.remove(X.bs);X.bs.material.map.dispose();X.bs.material.dispose()}const c=document.createElement('canvas');c.width=512;c.height=96;const x=c.getContext('2d');x.font='bold 30px sans-serif';const w=Math.min(500,x.measureText(txt).width+40);x.fillStyle='#fffbeb';x.beginPath();x.roundRect?x.roundRect(256-w/2,6,w,70,24):x.rect(256-w/2,6,w,70);x.fill();x.beginPath();x.moveTo(240,74);x.lineTo(256,94);x.lineTo(272,74);x.fill();x.fillStyle='#111827';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,256,42);const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(5,.95,1);s.position.y=6.3;b.m.add(s);X.bs=s;X.bt=3}
function talk(b,k){const W=window._x14b;if(W.bubT>0||!b._x14)return;W.bubT=rr(2.5,4.5);bubble(b,pk1(b._x14.ch&&R2()?LINES.champ:LINES[k]))}
const R2=()=>Math.random()<.5;

// ---- állapot ----
const W=window._x14b={bubT:0,ch:null,stats:{},last:LS.g('k3x14bLast',null),shotN:0};
function init(b,i){const g=G,D=DIFF[ST.diff]||DIFF.norm;const keys=Object.keys(PERS);const p=keys[i%4];
 const rar=Math.random();const ri=rar<.4?0:rar<.7?1:rar<.88?2:rar<.97?3:4;
 const nm=pk1(N1)+pk1(N2)+(Math.random()<.4?Math.floor(rr(1,99)):'');
 const X=b._x14={p,ri,nm,hp0:b.hp+(b.sh||0),cov:0,heal:rr(4,8),hear:0,dmg:0,k:0,ch:false};
 b.acc=Math.min(.95,b.acc*D.acc);b.dmg*=D.dmg;b.rof*=D.rof;b.mhp*=D.hp;b.hp=b.mhp;b.sp*=D.sp;
 if(p==='rush'){b.sp*=1.2;b.rof*=.85;b.acc*=.85}else if(p==='snip'){b.acc=Math.min(.97,b.acc*1.35);b.dmg*=1.4;b.rof*=1.5}else if(p==='hide'){b.sp*=.9}else{b.sp*=1.05}
 b.name=nm;
 if(b.m){b.m.children.forEach(c=>{if(c.isSprite&&c.position.y>4&&c.position.y<5)c.visible=false});const s=tag(nm,RAR[ri].c,PERS[p].e+' '+PERS[p].n+' · '+RAR[ri].n);s.position.y=4.8;b.m.add(s);X.lb=s}
 W.stats[nm]={nm,p,ri,dmg:0,k:0,ch:false,dead:false};X.hp0=b.hp+(b.sh||0)}
function mkChamp(b){const X=b._x14;X.ch=true;W.ch=b;W.stats[X.nm].ch=true;b.mhp*=2.5;b.hp=b.mhp;b.sh=(b.sh||0)+100;b.msh=(b.msh||50)+100;b.acc=Math.min(.97,b.acc*1.2);b.dmg*=1.3;X.hp0=b.hp+b.sh;
 if(b.m){b.m.scale.multiplyScalar(1.3);if(X.lb)b.m.remove(X.lb);const s=tag('👑 '+X.nm,'#fbbf24','BAJNOK · nagy jutalom');s.position.y=4.8;b.m.add(s);X.lb=s;
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4,.12,6,24),new THREE.MeshBasicMaterial({color:0xfbbf24}));ring.rotation.x=Math.PI/2;ring.position.y=.15;b.m.add(ring)}
 say('👑 Egy BAJNOK bot is a szigeten van: '+X.nm+'! Kiesése +25 000 Ft')}

// squad (solo módban 2-3 fős rajok)
function squads(bots){if(!ST.sq||(window.GAME_TEAM||'solo')!=='solo')return;let i=0,t=100;while(i<bots.length){const n=Math.random()<.5?2:3,lead=bots[i];for(let k=0;k<n&&i<bots.length;k++,i++){const b=bots[i];b.team=t;b._x14.lead=lead;if(k){b.x=lead.x+rr(-5,5);b.z=lead.z+rr(-5,5)}}t++}}

WP('launch',null,()=>{W.ch=null;W.stats={};W.started=false;W.bubT=3;const e=document.getElementById('x14bEnd');if(e)e.remove();hub()});

// lövés-hallás: a játékos lövedékeinek száma
WP('update',()=>{const g=G;return g&&g.bl?g.bl.length:0},(a,n0)=>{const g=G,dt=a[0];if(!g||!g.brMode||g.phase!=='play'||g.over)return;
 const bots=g.en.filter(e=>e.bot);if(!bots.length)return;
 if(!W.started){W.started=true;bots.forEach((b,i)=>init(b,i));squads(bots.filter(b=>!b.dead));const c=pk1(bots);if(c)mkChamp(c)}
 W.bubT-=dt;const shot=g.bl&&g.bl.length>n0;
 bots.forEach(b=>{const X=b._x14;if(!X)return;
  if(X.bt>0){X.bt-=dt;if(X.bt<=0&&X.bs){b.m.remove(X.bs);X.bs.material.map.dispose();X.bs.material.dispose();X.bs=null}}
  if(b.dead){const s=W.stats[X.nm];if(s&&!s.dead){s.dead=true;s.t=g.t}return}
  const tot=b.hp+(b.sh||0),dP=Math.hypot(g.x-b.x,g.z-b.z);
  // 3. fedezék sebződéskor
  if(tot<X.hp0-3){X.cov=X.p==='rush'?.8:X.p==='hide'?3.2:2;X.from=b.tgt||{x:g.x,z:g.z};if(Math.random()<.35)talk(b,'hurt')}X.hp0=tot;
  let mx=0,mz=0;const sp=b.sp*dt;
  if(X.cov>0){X.cov-=dt;const f=X.from,dx=b.x-f.x,dz=b.z-f.z,d=Math.hypot(dx,dz)||1;// hátra + oldalra, a legközelebbi akadály mögé (pushOut csúsztat)
   mx+=dx/d*.9-dz/d*.5*(b.strafe||1);mz+=dz/d*.9+dx/d*.5*(b.strafe||1)}
  else if(b.st==='fight'&&b.tgt){const t=b.tgt,dx=t.x-b.x,dz=t.z-b.z,d=Math.hypot(dx,dz)||1;
   if(X.p==='rush'&&d>6){mx+=dx/d*.8;mz+=dz/d*.8}
   else if(X.p==='snip'&&d<26){mx-=dx/d*.9;mz-=dz/d*.9}
   else if(X.p==='hide'&&b.hp<b.mhp*.7){mx-=dx/d*.7;mz-=dz/d*.7}}
  else if(b.st==='loot'){
   // 6. hang
   if(shot&&dP<70&&X.p!=='hide'){X.hear=4;if(Math.random()<.3)talk(b,'hear')}
   if(X.hear>0){X.hear-=dt;b.goal=[g.x+rr(-6,6),g.z+rr(-6,6)];b._face=Math.atan2(g.z-b.z,g.x-b.x)}
   // 7. láda
   else{let best=null,bd=X.p==='loot'?60:25;g.pk.forEach(p=>{if(p.t!=='chest'||p.l<=0)return;const d=Math.hypot(p.x-b.x,p.z-b.z);if(d<bd){bd=d;best=p}});
    if(best){b.goal=[best.x,best.z];if(bd<2){best.l=0;b.sh=Math.min(b.msh||50,(b.sh||0)+25);b.dmg*=1.05;if(Math.random()<.5)talk(b,'loot');ftx(b.x,b.z,'🎁','')}}
    else if(X.lead&&X.lead!==b&&!X.lead.dead){const lx=X.lead.x-b.x,lz=X.lead.z-b.z,ld=Math.hypot(lx,lz);if(ld>6)b.goal=[X.lead.x+rr(-3,3),X.lead.z+rr(-3,3)]}
    else if(X.p==='hide'&&Math.random()<dt*.5)b.goal=[b.x+rr(-3,3),b.z+rr(-3,3)]}
   if(Math.random()<dt*.04)talk(b,'idle')}
  if(b.st==='fight'&&Math.random()<dt*.05)talk(b,'fight');
  // gyógyulás
  X.heal-=dt;if(X.heal<=0){X.heal=X.p==='loot'?5:8;if(b.hp<b.mhp*.6&&b.st!=='fight'){b.hp=Math.min(b.mhp,b.hp+b.mhp*.3);X.hp0=b.hp+(b.sh||0);ftx(b.x,b.z,'🩹 +HP','');if(Math.random()<.5)talk(b,'heal')}}
  const L=Math.hypot(mx,mz);if(L>0){b.x+=mx/L*sp;b.z+=mz/L*sp;if(typeof pushOut==='function')pushOut(b,b.r,0);if(typeof hin==='function'&&!hin(b.x,b.z)){b.x*=.98;b.z*=.98}}
 })});

// bot-találat a játékoson: legközelebbi bot-lövedék forrása
WP('eFire',null,a=>{const e=a[0],g=G;if(e&&e.bot&&g&&g.eb.length)g.eb[g.eb.length-1].x14=e});
WP('hurt',a=>{const g=G;return g?g.hp+g.sh:0},(a,h0)=>{const g=G;if(!g||!g.brMode||a[1])return;const lost=h0-(g.hp+g.sh);if(lost<=0)return;let src=null,bd=4;g.eb.forEach(b=>{if(!b.x14)return;const d=Math.hypot(b.x-g.x,b.z-g.z);if(d<bd){bd=d;src=b.x14}});if(!src)g.en.forEach(e=>{if(e.bot&&!e.dead&&e._x14){const d=Math.hypot(e.x-g.x,e.z-g.z);if(d<bd+1){bd=d;src=e}}});if(src&&src._x14){const s=W.stats[src._x14.nm];if(s)s.dmg+=lost}});
// bot-bot kiesések a kill-feedből
const mo=new MutationObserver(ms=>{ms.forEach(m=>m.addedNodes.forEach(n=>{const t=(n.textContent||'').split(' ➜ ')[0].trim();const s=W.stats[t];if(s)s.k++}))});
setTimeout(()=>{const kf=document.getElementById('prKF');if(kf)mo.observe(kf,{childList:true})},1500);
// 9. bajnok jutalom
WP('kill',null,a=>{const e=a[0];if(e&&e===W.ch&&e._x14){W.ch=null;S.c+=25000;if(typeof BR!=='undefined'&&BR)BR.zs=(BR.zs||0)+50;say('👑 LEGYŐZTED A BAJNOKOT! +25 000 Ft · +50 zseton');ftx(e.x,e.z,'👑 +25 000 Ft','')}});

// 10. statisztika a meccs végén
WP('end',null,()=>{const arr=Object.values(W.stats);if(!arr.length)return;arr.forEach(s=>s.sc=s.dmg+s.k*60+(s.ch?25:0));arr.sort((a,b)=>b.sc-a.sc);W.last=arr.slice(0,10);LS.s('k3x14bLast',W.last);W.stats={};
 const top=W.last[0];const d=document.createElement('div');d.id='x14bEnd';d.innerHTML='☠️ Legveszélyesebb bot: <b style="color:'+RAR[top.ri].c+'">'+(top.ch?'👑 ':'')+top.nm+'</b> ('+PERS[top.p].n+') · '+Math.round(top.dmg)+' sebzés rád · '+top.k+' kiesés · <u>részletek (F3)</u>';d.onclick=()=>{d.remove();openP()};document.body.appendChild(d);setTimeout(()=>d.remove(),15000)});

// ---- panel ----
const P=document.createElement('div');P.id='x14bP';document.body.appendChild(P);
function draw(){let h='<button class="x" id="x14bX">✕</button><h2>🤖 ELLENFÉL-AI</h2><div class="sub">Közpénz Royale botjainak beállítása · F3</div><b>Nehézség</b><div class="row">';
 for(const k in DIFF)h+='<div class="ch'+(ST.diff===k?' on':'')+'" style="--c:'+DIFF[k].c+'" data-d="'+k+'">'+DIFF[k].n+'</div>';
 h+='</div><label><input type="checkbox" id="x14bB"'+(ST.bub?' checked':'')+'> 💬 Beszólások (chatbuborék)</label><label><input type="checkbox" id="x14bS"'+(ST.sq?' checked':'')+'> 👥 Bot-rajok egyéni módban (2–3 fő)</label>';
 h+='<div class="sub" style="margin-top:8px">Személyiségek: ⚔️ Rohamozó · 🎯 Mesterlövész · 🫣 Bujkáló · 🎒 Gyűjtögető. Sebzéskor fedezékbe húzódnak, lövés hallatán odanéznek, gyógyulnak, ládát nyitnak. Meccsenként 1 👑 bajnok (+25 000 Ft).</div>';
 h+='<b>Legutóbbi meccs – legveszélyesebb botok</b>';
 if(W.last&&W.last.length){h+='<table><tr><th>#</th><th>Név</th><th>Típus</th><th>Sebzés rád</th><th>Kiesés</th></tr>';W.last.forEach((s,i)=>h+='<tr><td>'+(i+1)+'</td><td style="color:'+RAR[s.ri].c+'">'+(s.ch?'👑 ':'')+s.nm+'</td><td>'+PERS[s.p].e+' '+PERS[s.p].n+'</td><td>'+Math.round(s.dmg)+'</td><td>'+s.k+'</td></tr>');h+='</table>'}else h+='<div class="sub">Még nincs adat – játssz egy Royale meccset!</div>';
 P.innerHTML=h;P.querySelector('#x14bX').onclick=closeP;P.querySelectorAll('[data-d]').forEach(e=>e.onclick=()=>{ST.diff=e.dataset.d;save();draw()});
 P.querySelector('#x14bB').onchange=e=>{ST.bub=e.target.checked;save()};P.querySelector('#x14bS').onchange=e=>{ST.sq=e.target.checked;save()}}
function openP(){draw();P.style.display='block'}function closeP(){P.style.display='none'}
W.open=openP;
addEventListener('keydown',e=>{if(e.code==='F3'){e.preventDefault();if(P.style.display==='block')closeP();else if(!(typeof run!=='undefined'&&run))openP()}});
function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!document.getElementById('x14bBtn')){const b=document.createElement('button');b.id='x14bBtn';b.className='x14cbtn x14bBtn';b.title='Ellenfél-AI (F3) – '+DIFF[ST.diff].n;b.textContent='🤖 ELLENFÉL-AI';b.onclick=openP;h.appendChild(b)}return h}
setTimeout(hub,800);
setInterval(()=>{const h=document.getElementById('x14hub');if(h)h.style.display=(typeof run!=='undefined'&&run)?'none':'flex';if((typeof run!=='undefined'&&run)&&P.style.display==='block')closeP()},500);
})();
