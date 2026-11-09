// ===== EXTRA140C: 🎮 MÓDOK – 10 játékmód / mutátor a royale-motorra (F4). Debug: _x14c
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('x14c pre '+n,e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x14c '+n,e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>Math.round(+n||0).toLocaleString('hu-HU');
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const inMatch=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const tell=t=>{try{say(t)}catch(e){}};
const D2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const fh=(x,z)=>{try{return floorH({x,z,y:99})||0}catch(e){return 0}};
const alive=()=>G.en.filter(e=>!e.dead);
const mk=(t,s,x,z,y)=>{const o=spr(t,s);o.material.depthTest=true;o.position.set(x,y==null?fh(x,z)+s*.5:y,z);scene.add(o);return o};
const X={on:null,pend:LSg('k3x14cNext',''),t:0,sc:0,objs:[]};window._x14c=X;

const MODES={
 melee:{n:'✊ Csak közelharc',d:'Lőni nem lehet – kattintás = ütés (2,8 m). Közelharc-kiesés +600 Ft.',
  start(g){g._x14mel=0},sht(g){const t=alive().filter(e=>D2(e,g)<2.8).sort((a,b)=>D2(a,g)-D2(b,g))[0];if(g._x14mel>0)return;g._x14mel=.45;try{tn(180,'square',.06)}catch(e){}if(t){dmgE(t,t.b?90:55,false);ftx(t.x,t.z,'👊','')}},
  tick(g,dt){g._x14mel-=dt},kill(g){g.cash+=600}},
 sniper:{n:'🎯 Mesterlövész-párbaj',d:'Csak távcsöves puska, 1 töltény a tárban – de minden találat azonnal kiejt.',
  tick(g){g.own=g.own.map((v,i)=>i===2);g.wp=2;if(g.mag[2]>1)g.mag[2]=1;if((g.res[2]||0)<5)g.res[2]=25},one:true},
 size:{n:'🧌 Óriás / törpe',d:'Te óriás leszel (több HP, lassabb), az ellenfelek véletlenszerűen óriások vagy törpék.',
  start(g){g.pm.scale.setScalar(2);g.mhp*=1.6;g.hp=g.mhp},tick(g){g.en.forEach(e=>{if(e.m&&!e._x14s){e._x14s=1;const k=Math.random()<.5?.5:1.8;e.m.scale.setScalar(k);e.hp*=k;e.mhp*=k}})}},
 ctf:{n:'🚩 Zászlórablás',d:'3 kék bot-társ veled harcol. Hozd el a piros zászlót a kék bázisra! 3 pont = +15 000 Ft.',
  start(g){X.sc=0;X.home={x:g.x,z:g.z}},play(g){const a=RN(0,6.28);X.home={x:g.x,z:g.z};X.fl={x:g.x+Math.cos(a)*45,z:g.z+Math.sin(a)*45,c:false};X.hb=mk('🏳️‍🌈',3,X.home.x,X.home.z);X.hb.material.color.set(0x60a5fa);X.fo=mk('🚩',3,X.fl.x,X.fl.z);X.objs.push(X.hb,X.fo);
   X.al=[];for(let i=0;i<3;i++){const m=person(0x2563eb,'🔵',1);m.position.set(g.x+i*2,0,g.z+2);scene.add(m);X.objs.push(m);X.al.push({m,x:g.x+i*2,z:g.z+2,cd:1})}},
  tick(g,dt){if(!X.fl)return;const f=X.fl;if(!f.c&&D2(f,g)<2.5){f.c=true;tell('🚩 Nálad a zászló! Vidd a kék bázisra!')}if(f.c){X.fo.position.set(g.x,g.y+4,g.z);if(D2(X.home,g)<4){f.c=false;X.sc++;g.cash+=3000;tell('🏁 PONT! '+X.sc+'/3');if(X.sc>=3){g.cash+=15000;tell('🏆 ZÁSZLÓRABLÁS MEGNYERVE! +15 000 Ft');X.fl=null;return}const a=RN(0,6.28);f.x=g.x+Math.cos(a)*45;f.z=g.z+Math.sin(a)*45;X.fo.position.set(f.x,fh(f.x,f.z)+1.5,f.z)}}
   // bot-tolvaj: közeli ellenfél elveszi tőled
   if(f.c&&g.hurt>1.4&&Math.random()<.15){f.c=false;f.x=g.x;f.z=g.z;X.fo.position.set(f.x,fh(f.x,f.z)+1.5,f.z);tell('😱 Kiütötték tőled a zászlót!')}
   X.al.forEach((b,i)=>{const tx=g.x+Math.cos(i*2.1)*3,tz=g.z+Math.sin(i*2.1)*3,dx=tx-b.x,dz=tz-b.z,d=Math.hypot(dx,dz);if(d>1){b.x+=dx/d*Math.min(d,7*dt);b.z+=dz/d*Math.min(d,7*dt)}b.m.position.set(b.x,fh(b.x,b.z),b.z);b.cd-=dt;if(b.cd<=0){b.cd=1.2;const t=alive().filter(e=>D2(e,b)<22)[0];if(t){dmgE(t,14,false);ftx(t.x,t.z,'🔵','')}}})},
  hud(){return '🚩 '+X.sc+'/3'+(X.fl&&X.fl.c?' · NÁLAD A ZÁSZLÓ':'')}},
 koth:{n:'👑 Király a dombon',d:'Állj a sárga körben! Másodpercenként pont, ellenfél a körben = nincs pont. 100 pont = +12 000 Ft.',
  start(g){X.sc=0},play(g){X.hill={x:g.x+RN(-25,25),z:g.z+RN(-25,25)};const r=new THREE.Mesh(new THREE.RingGeometry(7.4,8,40),new THREE.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:.7,side:THREE.DoubleSide}));r.rotation.x=-Math.PI/2;r.position.set(X.hill.x,fh(X.hill.x,X.hill.z)+.15,X.hill.z);scene.add(r);X.objs.push(r,mk('👑',3,X.hill.x,X.hill.z,r.position.y+6))},
  tick(g,dt){if(!X.hill||X.sc>=100)return;if(D2(X.hill,g)<8&&!alive().some(e=>D2(X.hill,e)<8)){X.t+=dt;if(X.t>1){X.t=0;X.sc++;g.cash+=80;if(X.sc>=100){g.cash+=12000;tell('👑 TIÉD A DOMB! +12 000 Ft')}}}},
  hud(){return '👑 '+X.sc+'/100'+(X.hill?' · '+Math.round(D2(X.hill,G))+' m':'')}},
 gungame:{n:'🔁 Fegyverváltó',d:'Minden kiesés után új fegyvert kapsz. Végigérsz a soron = +10 000 Ft.',
  start(g){X.sc=0},tick(g){const L=X.gl||(X.gl=Array.from({length:Math.min(9,WPN.length)},(_,i)=>i).sort(()=>Math.random()-.5));const w=L[Math.min(X.sc,L.length-1)];g.own=g.own.map((v,i)=>i===w);if(!g.own[w])g.own[w]=true;g.wp=w;if((g.res[w]||0)<WPN[w].mag)g.res[w]=WPN[w].res},
  kill(g){X.sc++;const L=X.gl;if(X.sc===L.length){g.cash+=10000;tell('🏆 FEGYVERSOR TELJESÍTVE! +10 000 Ft')}else if(X.sc<L.length){const w=L[X.sc];g.mag[w]=WPN[w].mag;tell('🔁 Új fegyver: '+WPN[w].e+' '+WPN[w].n)}},
  hud(){return '🔁 '+Math.min(X.sc,(X.gl||[]).length)+'/'+(X.gl||[]).length}},
 zombie:{n:'🧟 Zombi-túlélés',d:'Hullámokban jönnek a zombik. Minden túlélt hullám +2000 Ft.',
  start(g){X.sc=0;X.t=8},tick(g,dt){X.t-=dt;if(X.t<=0){X.sc++;X.t=35;if(X.sc>1)g.cash+=2000;const n=Math.min(4+X.sc*2,16);if(alive().length<40)for(let i=0;i<n;i++){const a=RN(0,6.28),e=sp(X.sc%4===0&&i===0?'kord':'nyug',g.x+Math.cos(a)*30,g.z+Math.sin(a)*30);e.sp*=1.3;e.hp*=1+X.sc*.15;e.mhp=e.hp;e._x14z=1;g.en.push(e)}tell('🧟 '+X.sc+'. HULLÁM! ('+n+' zombi)')}},
  hud(){return '🧟 '+X.sc+'. hullám · köv: '+Math.ceil(X.t)+' mp'}},
 coins:{n:'🪙 Hamis-pénz vadászat',d:'90 mp alatt gyűjts minél több hamis érmét (érménként 400 Ft, arany 2000 Ft)!',
  start(g){X.sc=0},play(g){X.t=90;X.co=[];for(let i=0;i<30;i++){const a=RN(0,6.28),r=RN(6,45),x=g.x+Math.cos(a)*r,z=g.z+Math.sin(a)*r,gd=i%8===0;X.co.push({x,z,gd,s:mk(gd?'🌟':'🪙',1.4,x,z)})}X.co.forEach(c=>X.objs.push(c.s))},
  tick(g,dt){if(!X.co)return;if(X.t<=0)return;X.t-=dt;if(X.t<=0){tell('⏱️ Lejárt az idő! '+X.sc+' érme');X.co.forEach(c=>scene.remove(c.s));X.co=[];return}for(let i=X.co.length-1;i>=0;i--){const c=X.co[i];c.s.position.y=fh(c.x,c.z)+1+Math.sin(g.t*3+i)*.3;if(D2(c,g)<1.8){X.sc++;g.cash+=c.gd?2000:400;ftx(c.x,c.z,c.gd?'+2000':'+400','');try{tn(900,'sine',.05)}catch(e){}scene.remove(c.s);X.co.splice(i,1)}}},
  hud(){return '🪙 '+X.sc+' · '+Math.max(0,Math.ceil(X.t||0))+' mp'}},
 chick:{n:'🐔 Robbanó tyúkok',d:'A pályán kotkodácsoló tyúkok rohangálnak – aki a közelükbe ér, bumm! Tyúkkal kiejtett ellenfél +800 Ft.',
  play(g){X.ch=[]},tick(g,dt){if(!X.ch)return;if(X.ch.length<14&&Math.random()<dt*1.5){const a=RN(0,6.28),r=RN(8,40),x=g.x+Math.cos(a)*r,z=g.z+Math.sin(a)*r;X.ch.push({x,z,a:RN(0,6.28),f:-1,s:mk('🐔',1.6,x,z)})}
   for(let i=X.ch.length-1;i>=0;i--){const c=X.ch[i];if(c.f<0){c.a+=RN(-2,2)*dt;c.x+=Math.cos(c.a)*3*dt;c.z+=Math.sin(c.a)*3*dt;if(D2(c,g)<3||alive().some(e=>D2(c,e)<3)){c.f=.9;c.s.material.color.set(0xff5555)}}else{c.f-=dt;c.s.scale.setScalar(1.6+(.9-c.f)*1.5);if(c.f<=0){alive().forEach(e=>{if(D2(c,e)<6){e._x14ch=1;dmgE(e,120,true)}});if(D2(c,g)<6&&g.phase==='play')hurt(25);ftx(c.x,c.z,'💥 KOTKODÁCS!','');try{tn(70,'sawtooth',.3,.2)}catch(e){}scene.remove(c.s);X.ch.splice(i,1);continue}}c.s.position.set(c.x,fh(c.x,c.z)+.8+Math.abs(Math.sin(g.t*8+i))*.3,c.z)}},
  kill(g,e){if(e&&e._x14ch)g.cash+=800}}
};
const KEYS=Object.keys(MODES);
const daily=()=>{const d=new Date();return KEYS[(d.getFullYear()*372+d.getMonth()*31+d.getDate())%KEYS.length]};
const cur=()=>X.on&&MODES[X.on];

// --- launch / end csomagolás
function init(){X.g=G;X.on=null;X.objs=[];X.t=0;X.sc=0;X.fl=X.hill=X.co=X.ch=X.al=X.gl=null;X.played=false;X.dbl=false;
 if(!X.pend||G.stw||G.fk||(window.GAME_MODE&&window.GAME_MODE!=='royale'))return;
 X.dbl=X.pend==='daily';X.on=X.dbl?daily():X.pend;X.pend='';LSs('k3x14cNext','');const m=cur();if(!m){X.on=null;return}
 try{m.start&&m.start(G)}catch(e){console.error(e)}setTimeout(()=>tell('🎮 MÓD: '+m.n+(X.dbl?' · 📅 NAPI MÓD – DUPLA JUTALOM!':'')+' – '+m.d),2200)}
WP('launch',null,()=>{if(typeof G!=='undefined'&&G&&G!==X.g&&!G.over)init()});
WP('end',()=>{if(cur()&&X.dbl&&G&&!G.over)G.cash=(G.cash||0)*2},()=>{X.objs.forEach(o=>{try{scene.remove(o)}catch(e){}});X.objs=[];X.on=null;X.dbl=false;hud()});
WP('update',a=>{if(typeof G!=='undefined'&&G&&G!==X.g&&!G.over)init()},a=>{const m=cur();if(!m||!inMatch())return hud();const g=G,dt=Math.min(.1,a[0]||.016);
 if(g.phase==='play'&&!X.played){X.played=true;m.play&&m.play(g)}if(g.phase==='play')m.tick&&m.tick(g,dt);hud()});
WP('kill',null,a=>{const m=cur();if(m&&m.kill&&inMatch())m.kill(G,a[0])});
WP('dmgE',a=>{const m=cur();if(m&&m.one&&a[0])a[1]=Math.max(a[1],(a[0].hp||0)+1)});
// lövés: közelharc módban ütés
{const o=window.sht;if(typeof o==='function')window.sht=function(){const m=cur();if(m&&m.sht&&inMatch()){try{if(G.phase==='play')m.sht(G)}catch(e){console.error(e)}return}return o.apply(this,arguments)}}

// --- HUD
let hd=null,hubT=0;
function hud(){const m=cur();if(!hd){hd=document.createElement('div');hd.className='x14chud';document.body.appendChild(hd)}
 const t=m&&inMatch()?m.n+(X.dbl?' ×2':'')+(m.hud?' · '+m.hud():''):'';if(hd._t!==t){hd._t=t;hd.textContent=t;hd.style.display=t?'block':'none'}
 const now=performance.now();if(now-hubT>500){hubT=now;const h=$$('x14hub');if(h){const au=document.getElementById('auth');const d=(inMatch()||(au&&au.classList.contains('on')))?'none':'flex';if(h.style.display!==d)h.style.display=d}}}

// --- CSS + panel
const st=document.createElement('style');st.textContent=`
.x14chud{position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:8;padding:6px 16px;border-radius:999px;background:linear-gradient(90deg,#1e1b4bdd,#581c87dd);border:1px solid #c4b5fd88;color:#fff;font:700 15px system-ui;box-shadow:0 4px 18px #0007;pointer-events:none;display:none;letter-spacing:.3px}
.x14cbtn{padding:8px 12px;border-radius:12px;border:1px solid #e9d5ff66;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;font:800 13px system-ui;cursor:pointer;box-shadow:0 4px 14px #0006;letter-spacing:.5px}
.x14cbtn:hover{filter:brightness(1.15)}
#x14cP{position:fixed;inset:0;z-index:60;background:#0009;display:none;align-items:center;justify-content:center;font-family:system-ui}
#x14cP .w{width:min(760px,94vw);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#18122b,#2a1747);border:1px solid #a78bfa66;border-radius:18px;padding:18px;color:#fff;box-shadow:0 20px 60px #000a}
#x14cP h2{margin:0 0 4px;font-size:24px;background:linear-gradient(90deg,#fde68a,#f0abfc);-webkit-background-clip:text;color:transparent}
#x14cP .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;margin-top:12px}
#x14cP .c{background:#ffffff0d;border:1px solid #ffffff22;border-radius:14px;padding:10px;cursor:pointer;transition:transform .12s}
#x14cP .c:hover{transform:translateY(-2px);border-color:#f0abfc}
#x14cP .c.on{border-color:#facc15;box-shadow:0 0 0 2px #facc1555}
#x14cP .c b{display:block;font-size:15px;margin-bottom:4px}#x14cP .c span{font-size:12px;opacity:.75}
#x14cP .r{display:flex;gap:8px;justify-content:flex-end;margin-top:14px;flex-wrap:wrap}`;document.head.appendChild(st);
const P=document.createElement('div');P.id='x14cP';document.body.appendChild(P);
P.addEventListener('click',e=>{if(e.target===P)close()});
function card(k,n,d){return '<div class="c'+(X.pend===k?' on':'')+'" data-k="'+k+'"><b>'+n+'</b><span>'+d+'</span></div>'}
function render(){const dk=daily();P.innerHTML='<div class="w"><h2>🎮 JÁTÉKMÓDOK</h2><div style="font-size:13px;opacity:.75">Válassz módot a következő royale-meccsre. (F4)</div><div class="g">'+
 card('daily','📅 Napi mód: '+MODES[dk].n,'Ma: '+MODES[dk].d+' <b style="color:#facc15">DUPLA JUTALOM!</b>')+KEYS.map(k=>card(k,MODES[k].n,MODES[k].d)).join('')+
 '</div><div class="r"><button class="x14cbtn" style="background:#334155" data-a="clr">Normál meccs</button><button class="x14cbtn" style="background:#334155" data-a="x">Bezár</button><button class="x14cbtn" data-a="go">▶ INDÍTÁS</button></div></div>';
 P.querySelectorAll('.c').forEach(c=>c.onclick=()=>{X.pend=c.dataset.k;LSs('k3x14cNext',X.pend);render()});
 P.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='clr'){X.pend='';LSs('k3x14cNext','');render()}else if(a==='x')close();else{close();if(X.pend&&window.GAME_MODE&&window.GAME_MODE!=='royale'){window.GAME_MODE='royale';try{localStorage.setItem('ry_mode','royale')}catch(e){}}try{launch()}catch(e){console.error(e)}}})}
function open(){if(inMatch())return;render();P.style.display='flex'}function close(){P.style.display='none'}
X.open=open;X.modes=MODES;X.daily=daily;
addEventListener('keydown',e=>{if(e.key==='F4'){e.preventDefault();P.style.display==='flex'?close():open()}});
function mount(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!$$('x14cB')){const b=document.createElement('button');b.id='x14cB';b.className='x14cbtn';b.textContent='🎮 MÓDOK';b.title='Játékmódok (F4)';b.onclick=open;h.appendChild(b)}}
if(document.readyState==='loading')addEventListener('DOMContentLoaded',mount);else mount();
setInterval(hud,700);
})();
