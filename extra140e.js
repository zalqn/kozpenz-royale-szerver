// extra140e.js – 3D LOBBY & KÖZÖSSÉG (színpad, kamera, közös tánc, MOTD, kosárlabda, barát-csengő, profilkártya PNG, reakciók, spektrum, aktivitás)
(function(){
'use strict';
const X=window._x14e={};
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lbOn=()=>{const l=document.getElementById('lb');return !!(l&&l.classList.contains('on'))};
const L3=()=>window.LB3D&&LB3D.sc?LB3D:null;
const day=d=>{d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};

// ---------- 9) analizátor elkapása (a lobbymusic.js saját AnalyserNode-ja) ----------
try{const AC=window.AudioContext||window.webkitAudioContext;if(AC&&AC.prototype.createAnalyser){const o=AC.prototype.createAnalyser;AC.prototype.createAnalyser=function(){const a=o.apply(this,arguments);if(!X.an)X.an=a;return a}}}catch(e){}

// ---------- CSS ----------
const st=document.createElement('style');st.textContent=`
#x14eBtn{width:46px;height:46px;border-radius:14px;border:1px solid #ffd23f66;background:linear-gradient(150deg,#2b1d4e,#0f172a);color:#fff;font-size:22px;cursor:pointer;box-shadow:0 6px 18px #0008,inset 0 1px 0 #ffffff22;transition:transform .15s}
#x14eBtn:hover{transform:scale(1.08);border-color:#ffd23f}
.x14eP{position:fixed;right:70px;top:50%;transform:translateY(-50%);width:min(380px,92vw);max-height:86vh;overflow:auto;z-index:60;padding:16px;border-radius:20px;background:linear-gradient(165deg,#1a1336f2,#0b1022f2);border:1px solid #ffd23f44;box-shadow:0 20px 60px #000a;color:#e5e7eb;font:600 14px Rajdhani,Arial;backdrop-filter:blur(10px)}
.x14eP h2{margin:0 0 10px;font:22px 'Luckiest Guy',Impact;color:#ffd23f;letter-spacing:1px}
.x14eP h3{margin:12px 0 6px;font:16px 'Luckiest Guy',Impact;color:#fde68a}
.x14eB{border:0;border-radius:10px;padding:8px 10px;margin:3px;cursor:pointer;color:#111;font:700 13px Rajdhani,Arial;background:linear-gradient(180deg,#ffe066,#f59e0b);box-shadow:0 3px 0 #92400e}
.x14eB.g{background:linear-gradient(180deg,#334155,#1e293b);color:#fff;box-shadow:0 3px 0 #0b1022}
.x14eX{position:absolute;right:12px;top:10px;background:none;border:0;color:#fff;font-size:20px;cursor:pointer}
.x14eE{position:fixed;z-index:8;pointer-events:none;font-size:34px;animation:x14eUp 2.6s ease-out forwards;filter:drop-shadow(0 4px 6px #0008)}
@keyframes x14eUp{0%{opacity:0;transform:translate(-50%,0) scale(.4)}12%{opacity:1;transform:translate(-50%,-20px) scale(1.2)}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),-220px) scale(.9)}}
.x14eT{position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:70;padding:10px 18px;border-radius:14px;background:linear-gradient(90deg,#14532d,#166534);border:1px solid #4ade80;color:#fff;font:700 15px Rajdhani,Arial;box-shadow:0 10px 30px #0009;animation:x14eF 4s forwards}
@keyframes x14eF{0%{opacity:0;top:60px}10%,85%{opacity:1;top:84px}100%{opacity:0}}
#x14eMotd{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:61;width:min(420px,90vw);padding:18px 20px;border-radius:20px;background:linear-gradient(150deg,#3b1d60f5,#111827f5);border:1px solid #ffd23f88;color:#fff;font:600 15px Rajdhani,Arial;box-shadow:0 20px 60px #000b;text-align:center}
#x14eViz{position:fixed;left:50%;bottom:0;transform:translateX(-50%);width:min(900px,96vw);height:42px;z-index:3;pointer-events:none;opacity:.85}
#x14eGame{position:fixed;inset:0;z-index:80;background:#05060ccc;display:flex;align-items:center;justify-content:center}
#x14eGame canvas{border-radius:18px;border:1px solid #ffd23f55;box-shadow:0 20px 60px #000;max-width:96vw;max-height:90vh;touch-action:none}
.x14eHm{display:grid;grid-template-columns:34px repeat(24,1fr);gap:2px;font-size:10px}
.x14eHm i{display:block;height:13px;border-radius:3px;background:#1e293b}
`;document.head.appendChild(st);

function toast(t){const d=document.createElement('div');d.className='x14eT';d.innerHTML=t;document.body.appendChild(d);setTimeout(()=>d.remove(),4100)}
let AC=null;function chime(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();[0,.12,.24].forEach((d,i)=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=[784,988,1319][i];g.gain.setValueAtTime(0,AC.currentTime+d);g.gain.linearRampToValueAtTime(.12,AC.currentTime+d+.02);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d+.5);o.connect(g);g.connect(AC.destination);o.start(AC.currentTime+d);o.stop(AC.currentTime+d+.55)})}catch(e){}}

// ---------- hub gomb ----------
function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}return h}
const btn=document.createElement('button');btn.id='x14eBtn';btn.title='Lobby színpad & közösség (F7)';btn.textContent='🎪';btn.onclick=()=>panel();
function mountBtn(){const h=hub();if(btn.parentNode!==h)h.appendChild(btn)}
if(document.body)mountBtn();else addEventListener('DOMContentLoaded',mountBtn);

// ---------- 1) prémium színpad: reflektor-kúpok + por, VALÓDI fény nélkül (lobbyperf fénykorlát marad) ----------
let stage=null;
function buildStage(){const L=L3();if(!L||stage||typeof THREE==='undefined')return;const g=new THREE.Group();g.name='x14eStage';
 const ringM=new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.85,2.05,48),ringM);ring.rotation.x=-Math.PI/2;ring.position.y=.47;g.add(ring);
 const ring2=new THREE.Mesh(new THREE.RingGeometry(2.3,2.36,48),ringM.clone());ring2.rotation.x=-Math.PI/2;ring2.position.y=.46;g.add(ring2);
 const cones=[],cols=[0xff4d6d,0x60a5fa,0xffd23f,0xa78bfa];
 cols.forEach((c,i)=>{const m=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.09,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});
  const cg=new THREE.ConeGeometry(1.5,9,24,1,true);cg.translate(0,-4.5,0);const k=new THREE.Mesh(cg,m);const a=i/cols.length*Math.PI*2+.4;k.position.set(Math.cos(a)*4.5,9,Math.sin(a)*4.5-1);k.userData.a=a;g.add(k);cones.push(k)});
 const N=260,pos=new Float32Array(N*3),sp=new Float32Array(N);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*12;pos[i*3+1]=Math.random()*7;pos[i*3+2]=(Math.random()-.5)*10-1;sp[i]=.1+Math.random()*.3}
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xfff1c4,size:.06,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));g.add(dust);
 L.sc.add(g);stage={g,ring,ring2,cones,dust,pos,sp};
 L.fx.push(t=>{if(!stage)return;const lv=X.lvl||0;ring.material.opacity=.35+Math.sin(t*2.4)*.15+lv*.4;ring2.rotation.z=t*.3;ring2.material.opacity=.2+lv*.5;
  cones.forEach((k,i)=>{k.rotation.z=Math.sin(t*.7+i)*.35;k.rotation.x=Math.cos(t*.5+i*1.3)*.3;k.material.opacity=.06+lv*.12+Math.sin(t*1.5+i)*.02});
  if(((t*30)|0)%2===0){for(let i=0;i<N;i++){pos[i*3+1]+=sp[i]*.03;pos[i*3]+=Math.sin(t+i)*.004;if(pos[i*3+1]>7)pos[i*3+1]=0}pg.attributes.position.needsUpdate=true}
  camStep(t);danceTick(t)});
 setupCam(L)}

// ---------- 2) kamera: jobb egér / Shift+húzás = keringés, görgő = zoom, dupla klikk = alaphelyzet ----------
const CAM={yaw:0,pitch:0,zoom:1,base:null,tgt:null};
function setupCam(L){const cv=L.r.domElement;let d=null;
 cv.addEventListener('contextmenu',e=>e.preventDefault());
 cv.addEventListener('pointerdown',e=>{if(e.button===2||e.shiftKey){d=[e.clientX,e.clientY];e.stopPropagation()}},true);
 addEventListener('pointermove',e=>{if(!d)return;CAM.yaw-=(e.clientX-d[0])*.006;CAM.pitch=Math.max(-.35,Math.min(.6,CAM.pitch+(e.clientY-d[1])*.004));d=[e.clientX,e.clientY]});
 addEventListener('pointerup',()=>d=null);
 cv.addEventListener('wheel',e=>{if(!lbOn())return;CAM.zoom=Math.max(.55,Math.min(1.5,CAM.zoom*(e.deltaY>0?1.08:.93)));e.preventDefault()},{passive:false});
 cv.addEventListener('dblclick',()=>{CAM.yaw=CAM.pitch=0;CAM.zoom=1})}
const _v=typeof THREE!=='undefined'?new THREE.Vector3():null;
function camStep(){const L=L3();if(!L)return;const c=L.cam;
 if(!CAM.base){CAM.base=c.position.clone();const dir=new THREE.Vector3();c.getWorldDirection(dir);const s=Math.max(2,-CAM.base.dot(dir));CAM.tgt=CAM.base.clone().addScaledVector(dir,s)}
 if(!CAM.yaw&&!CAM.pitch&&CAM.zoom===1&&!CAM.act)return;CAM.act=!(CAM.yaw===0&&CAM.pitch===0&&CAM.zoom===1);
 _v.copy(CAM.base).sub(CAM.tgt);const r=_v.length()*CAM.zoom,y0=Math.atan2(_v.x,_v.z)+CAM.yaw,p0=Math.asin(Math.max(-.99,Math.min(.99,_v.y/_v.length())))+CAM.pitch;
 c.position.set(CAM.tgt.x+Math.sin(y0)*Math.cos(p0)*r,Math.max(.6,CAM.tgt.y+Math.sin(p0)*r),CAM.tgt.z+Math.cos(y0)*Math.cos(p0)*r);c.lookAt(CAM.tgt)}

// ---------- 3) közös tánc (party-avatárok + kitöltő botok + kutya) ----------
let DN=null;
function limbsOf(m){const o={};m.traverse(c=>{if(c.userData&&c.userData.limb)o[c.userData.limb]=c});return o}
function groupDance(){const L=L3();if(!L){toast('A lobby még töltődik…');return}if(DN)stopDance();
 const bots=[],list=[];const BOT=[[0xff4d6d,'🤖'],[0x60a5fa,'😎'],[0x4ade80,'🥳'],[0xa78bfa,'🦊']];let bi=0;
 L.peds.forEach((p,i)=>{if(i===0)return;if(p.av)list.push(p.av);else if(typeof person==='function'&&bi<4){try{const b=BOT[bi++],m=person(b[0],b[1],1.05);m.position.set(p.x,.3,p.z);m.rotation.y=Math.atan2(-p.x,4-p.z);L.sc.add(m);bots.push(m);list.push(m)}catch(e){}}});
 DN={t0:null,list:list.map((m,i)=>({m,lb:limbsOf(m),ph:i*.7,y:m.position.y})),bots,dog:L.dog,dy:L.dog?L.dog.position.y:0};
 try{if(window.lbDance&&window.LB_DANCES)lbDance(Math.floor(Math.random()*LB_DANCES.length))}catch(e){}
 X.lvl=.6;toast('🕺 Közös tánc! Mindenki beáll a színpadra!');react('🎉');setTimeout(stopDance,9000)}
function danceTick(t){if(!DN)return;if(DN.t0==null)DN.t0=t;const k=t-DN.t0;
 DN.list.forEach(o=>{const s=Math.sin(k*7+o.ph),c=Math.cos(k*7+o.ph);if(o.lb.larm)o.lb.larm.rotation.z=1.2+s*.8;if(o.lb.rarm)o.lb.rarm.rotation.z=-1.2+c*.8;if(o.lb.lleg)o.lb.lleg.rotation.x=s*.4;if(o.lb.rleg)o.lb.rleg.rotation.x=-s*.4;o.m.position.y=o.y+Math.abs(s)*.25;o.m.rotation.y+=.02});
 if(DN.dog){DN.dog.position.y=DN.dy+Math.abs(Math.sin(k*9))*.45;DN.dog.rotation.y+=.05}}
function stopDance(){if(!DN)return;const L=L3();DN.bots.forEach(b=>L&&L.sc.remove(b));DN.list.forEach(o=>{o.m.position.y=o.y;['larm','rarm','lleg','rleg'].forEach(n=>{if(o.lb[n])o.lb[n].rotation.set(0,0,0)})});if(DN.dog)DN.dog.position.y=DN.dy;DN=null;X.lvl=0}

// ---------- 4) MOTD ----------
const MOTD=['🌴 A sziget ma különösen napos – vigyél naptejet és pajzsot!','💰 Tipp: a boldog órában (19–20h) dupla a meccspénz.','🐶 A kutyád is szeret táncolni – próbáld ki a közös táncot!','🏀 Döntsd meg a kosárrekordodat a lobbyban!','🎯 Ma a fejlövések napja: célozz magasan!','🫖 A Teakertben mindig van friss tea és barátok.','🎵 Kapcsold be a lobby-zenét, és figyeld a spektrumot!','🗺️ Fedezz fel egy új nevezetességet ma a szigeten.','🤝 Hívj meg egy barátot – együtt több a zseton!','⭐ Minden nap egy új esély a győzelemre.'];
const motdToday=()=>{const d=new Date(),n=d.getFullYear()*400+d.getMonth()*31+d.getDate();return MOTD[n%MOTD.length]};
function showMotd(force){if(!force&&LS('k3x14eMotd','')===day())return;SV('k3x14eMotd',day());let m=document.getElementById('x14eMotd');if(m)m.remove();m=document.createElement('div');m.id='x14eMotd';
 m.innerHTML='<div style="font:13px Luckiest Guy,Impact;color:#fde68a;letter-spacing:2px">📢 A NAP ÜZENETE · '+day()+'</div><div style="margin:12px 0 14px;font-size:18px">'+esc(motdToday())+'</div><button class="x14eB">Rendben 👍</button>';
 m.querySelector('button').onclick=()=>m.remove();document.body.appendChild(m);setTimeout(()=>m.isConnected&&m.remove(),15000)}

// ---------- 5) kosárra dobás minijáték ----------
function ballGame(){if(document.getElementById('x14eGame'))return;const w=document.createElement('div');w.id='x14eGame';const cv=document.createElement('canvas');cv.width=520;cv.height=640;w.appendChild(cv);document.body.appendChild(w);
 const x=cv.getContext('2d');let best=LS('k3x14eBall',0),sc=0,time=30,ball=null,drag=null,hoop={x:260,y:180,vx:0},last=performance.now(),run=true,msg='Húzd és engedd el a labdát!';
 const reset=()=>{ball={x:260,y:560,vx:0,vy:0,fly:false,sc:false}};reset();
 const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*cv.width/r.width,(e.clientY-r.top)*cv.height/r.height]};
 cv.onpointerdown=e=>{if(!ball.fly&&time>0)drag=pt(e)};
 cv.onpointerup=e=>{if(!drag)return;const p=pt(e),dx=drag[0]-p[0],dy=drag[1]-p[1];drag=null;if(dy<20)return;ball.vx=dx*3.2;ball.vy=-Math.min(1100,dy*5.5);ball.fly=true};
 const close=()=>{run=false;w.remove();removeEventListener('keydown',kd,true)};const kd=e=>{if(e.key==='Escape'){close();e.stopPropagation()}};addEventListener('keydown',kd,true);
 w.onclick=e=>{if(e.target===w)close()};
 (function loop(n){if(!run)return;requestAnimationFrame(loop);n=n||performance.now();const dt=Math.min(.033,(n-last)/1000);last=n;
  if(time>0){time-=dt;if(sc>=5){hoop.vx=hoop.vx||120;hoop.x+=hoop.vx*dt;if(hoop.x<90||hoop.x>430)hoop.vx*=-1}if(time<=0){time=0;if(sc>best){best=sc;SV('k3x14eBall',best);msg='🏆 ÚJ REKORD: '+sc+'!'}else msg='Vége! '+sc+' kosár. Kattints az újrához.'}}
  else if(!ball.fly&&!drag){cv.onclick=()=>{if(time<=0){sc=0;time=30;hoop={x:260,y:180,vx:0};msg='Hajrá!';reset();cv.onclick=null}}}
  if(ball.fly){ball.vy+=1500*dt;const py=ball.y;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
   if(ball.vy>0&&py<hoop.y&&ball.y>=hoop.y&&Math.abs(ball.x-hoop.x)<34&&!ball.sc){ball.sc=true;sc++;msg=['Szép!','Zsír!','Bedobta!','Hálóóó!'][sc%4];try{sfx('coin')}catch(e){}}
   if(ball.vy>0&&Math.abs(ball.y-hoop.y)<10&&Math.abs(Math.abs(ball.x-hoop.x)-44)<12){ball.vx*=-.6;ball.vy*=-.4}
   if(ball.x<20||ball.x>500){ball.vx*=-.7;ball.x=Math.max(20,Math.min(500,ball.x))}
   if(ball.y>680)reset()}
  const g=x.createLinearGradient(0,0,0,640);g.addColorStop(0,'#1e1b4b');g.addColorStop(1,'#0b1022');x.fillStyle=g;x.fillRect(0,0,520,640);
  x.fillStyle='#ffffff10';for(let i=0;i<8;i++)x.fillRect(0,600-i*2,520,1);x.fillStyle='#7c2d12';x.fillRect(0,600,520,40);
  x.fillStyle='#e5e7eb';x.fillRect(hoop.x-60,hoop.y-110,120,80);x.strokeStyle='#ef4444';x.lineWidth=4;x.strokeRect(hoop.x-25,hoop.y-70,50,36);
  x.strokeStyle='#f97316';x.lineWidth=6;x.beginPath();x.moveTo(hoop.x-44,hoop.y);x.lineTo(hoop.x+44,hoop.y);x.stroke();
  x.strokeStyle='#ffffffaa';x.lineWidth=1.5;for(let i=-4;i<=4;i++){x.beginPath();x.moveTo(hoop.x+i*10,hoop.y);x.lineTo(hoop.x+i*6,hoop.y+40);x.stroke()}
  if(drag){x.setLineDash([6,6]);x.strokeStyle='#ffd23f';x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(ball.x*2-drag[0],ball.y);x.stroke();x.setLineDash([])}
  x.fillStyle='#f97316';x.beginPath();x.arc(ball.x,ball.y,20,0,7);x.fill();x.strokeStyle='#431407';x.lineWidth=2;x.beginPath();x.arc(ball.x,ball.y,20,0,7);x.moveTo(ball.x-20,ball.y);x.lineTo(ball.x+20,ball.y);x.moveTo(ball.x,ball.y-20);x.lineTo(ball.x,ball.y+20);x.stroke();
  x.fillStyle='#ffd23f';x.font='28px Luckiest Guy, Impact';x.textAlign='left';x.fillText('🏀 '+sc,20,44);x.textAlign='right';x.fillText('⏱ '+Math.ceil(time),500,44);
  x.textAlign='center';x.fillStyle='#fde68a';x.font='16px Rajdhani, Arial';x.fillText('Rekord: '+best+'  ·  Esc = kilépés',260,72);x.fillStyle='#fff';x.font='22px Luckiest Guy, Impact';x.fillText(msg,260,330)})()}

// ---------- 6) barát-csengő ----------
let seen=null;
function friends(){const a=(window.ACC&&ACC.friends)||[];return a.concat(LS('k3x120fr',[]))}
setInterval(()=>{const A=window.ACC;if(!A||!Array.isArray(A.online))return;const on=A.online.map(u=>u&&u.name).filter(Boolean),fr=friends();
 if(seen){on.forEach(n=>{if(!seen.has(n)&&fr.includes(n)&&LS('k3x14eBell',true)){toast('🔔 <b>'+esc(n)+'</b> online lett!');chime()}})}seen=new Set(on)},3000);

// ---------- 7) profilkártya PNG ----------
function profileCard(){const c=document.createElement('canvas');c.width=1000;c.height=560;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,1000,560);g.addColorStop(0,'#2b1d4e');g.addColorStop(1,'#0b1022');x.fillStyle=g;x.fillRect(0,0,1000,560);
 for(let i=0;i<40;i++){x.fillStyle='rgba(255,210,63,'+(Math.random()*.15)+')';x.beginPath();x.arc(Math.random()*1000,Math.random()*560,Math.random()*40,0,7);x.fill()}
 x.strokeStyle='#ffd23f';x.lineWidth=6;x.strokeRect(18,18,964,524);
 const nm=(window.ACC&&ACC.user&&ACC.user.name)||'Játékos',S0=window.S||{},log=LS('k3x20log',[]),ch=S0.ch||{};
 x.font='150px serif';x.textAlign='center';x.fillText(ch.e||'😎',190,300);
 x.textAlign='left';x.fillStyle='#ffd23f';x.font='64px Luckiest Guy, Impact';x.fillText(nm,360,150);
 x.fillStyle='#fde68a';x.font='28px Rajdhani, Arial';x.fillText('KÖZPÉNZ ROYALE · PROFILKÁRTYA',362,195);
 const wins=log.filter(l=>l&&(l.place===1||l.win||l.p===1)).length;
 const rows=[['💰 Közpénz',(Math.round(S0.c||0)).toLocaleString('hu-HU')+' Ft'],['🪙 Zseton',String((window.BR&&BR.zs)||0)],['🎮 Napló-meccsek',String(log.length)],['🏆 Győzelmek',String(wins)],['🏀 Kosárrekord',String(LS('k3x14eBall',0))]];
 x.font='32px Rajdhani, Arial';rows.forEach((r,i)=>{x.fillStyle='#cbd5e1';x.fillText(r[0],362,260+i*52);x.fillStyle='#fff';x.fillText(r[1],660,260+i*52)});
 x.fillStyle='#94a3b8';x.font='20px Rajdhani, Arial';x.fillText(day()+' · csak játékbeli pénz',362,530);
 c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='kozpenz_profil_'+nm.replace(/[^\wáéíóöőúüű-]/gi,'_')+'.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)},'image/png');toast('🖼️ Profilkártya letöltve!')}

// ---------- 8) lebegő emojik ----------
function react(e){const L=L3();let sx=innerWidth/2,sy=innerHeight*.45;
 if(L&&L.me){const v=new THREE.Vector3();L.me.getWorldPosition(v);v.y+=3.2;v.project(L.cam);sx=(v.x+1)/2*innerWidth;sy=(1-v.y)/2*innerHeight}
 for(let i=0;i<3;i++){const d=document.createElement('div');d.className='x14eE';d.textContent=e;d.style.left=(sx+(Math.random()-.5)*40)+'px';d.style.top=sy+'px';d.style.setProperty('--dx',((Math.random()-.5)*120)+'px');d.style.animationDelay=(i*.15)+'s';document.body.appendChild(d);setTimeout(()=>d.remove(),3000)}
 X.lvl=Math.max(X.lvl||0,.3);setTimeout(()=>{if(!DN)X.lvl=0},800)}
const EMO=['😂','🔥','👏','❤️','😮','💰','🎉','👑'];

// ---------- 9) spektrum-csík ----------
const viz=document.createElement('canvas');viz.id='x14eViz';viz.width=900;viz.height=42;viz.style.display='none';const vx=viz.getContext('2d');let vbuf=null;
function vizTick(){const ok=lbOn()&&X.an&&window.LBM&&LBM.on&&LS('k3x14eViz',true);if(!ok){if(viz.style.display!=='none')viz.style.display='none';return}
 if(!viz.isConnected)document.body.appendChild(viz);viz.style.display='';vbuf=vbuf||new Uint8Array(X.an.frequencyBinCount);X.an.getByteFrequencyData(vbuf);
 vx.clearRect(0,0,900,42);const n=Math.min(28,vbuf.length-1),bw=900/(n*2);let sum=0;
 for(let i=0;i<n;i++){const v=vbuf[i+1]/255;sum+=v;const h=Math.max(2,v*40);const gr=vx.createLinearGradient(0,42-h,0,42);gr.addColorStop(0,'#ffd23f');gr.addColorStop(1,'#a855f7');vx.fillStyle=gr;
  vx.fillRect(450+i*bw+1,42-h,bw-2,h);vx.fillRect(450-(i+1)*bw+1,42-h,bw-2,h)}
 if(!DN)X.lvl=Math.min(.5,sum/n*.8)}

// ---------- 10) aktivitás ----------
setInterval(()=>{if(document.hidden)return;const a=LS('k3x14eAct',{}),d=new Date(),k=day(d)+'|'+d.getHours();a[k]=(a[k]||0)+1;
 const lim=Date.now()-8*864e5;Object.keys(a).forEach(q=>{if(new Date(q.split('|')[0]).getTime()<lim)delete a[q]});SV('k3x14eAct',a)},60000);
function heatHTML(){const a=LS('k3x14eAct',{});let mx=1;Object.values(a).forEach(v=>mx=Math.max(mx,v));const NAP=['V','H','K','Sze','Cs','P','Szo'];let h='<div class="x14eHm"><span></span>';
 for(let i=0;i<24;i++)h+='<span style="text-align:center;color:#64748b">'+(i%6?'':i)+'</span>';
 for(let dd=6;dd>=0;dd--){const d=new Date(Date.now()-dd*864e5),k=day(d);h+='<span style="color:#cbd5e1">'+NAP[d.getDay()]+'</span>';
  for(let i=0;i<24;i++){const v=a[k+'|'+i]||0;h+='<i title="'+k+' '+i+'h: '+v+' perc" style="'+(v?'background:rgba(255,210,63,'+(.2+.8*v/mx)+')':'')+'"></i>'}}
 const tot=Object.values(a).reduce((s,v)=>s+v,0);return h+'</div><div style="margin-top:6px;color:#94a3b8">Az elmúlt 7 napban: <b style="color:#ffd23f">'+tot+' perc</b> a játékban</div>'}

// ---------- panel ----------
let P=null;
function panel(){if(P){P.remove();P=null;return}P=document.createElement('div');P.className='x14eP';
 P.innerHTML='<button class="x14eX">✖</button><h2>🎪 LOBBY SZÍNPAD</h2>'+
 '<h3>🕺 Közösség</h3><button class="x14eB" data-a="dance">🕺 Közös tánc</button><button class="x14eB" data-a="ball">🏀 Kosárra dobás</button><button class="x14eB" data-a="card">🖼️ Profilkártya PNG</button><button class="x14eB g" data-a="motd">📢 A nap üzenete</button>'+
 '<h3>😀 Reakciók</h3><div>'+EMO.map(e=>'<button class="x14eB g" data-e="'+e+'" style="font-size:20px;padding:4px 8px">'+e+'</button>').join('')+'</div>'+
 '<h3>🎥 Kamera</h3><div style="color:#94a3b8;font-size:13px">Jobb egér vagy Shift + húzás = körbeforgatás · görgő = zoom · dupla klikk = alaphelyzet · bal húzás = karakter forgatása</div><button class="x14eB g" data-a="cam">↺ Kamera alaphelyzet</button>'+
 '<h3>⚙️ Beállítások</h3><label><input type="checkbox" data-o="k3x14eBell"> 🔔 Csengő, ha egy barát online lesz</label><br><label><input type="checkbox" data-o="k3x14eViz"> 🎵 Zene-spektrum a képernyő alján</label>'+
 '<h3>👥 Ma ennyien játszottak</h3><div id="x14eSt" style="color:#cbd5e1">Betöltés…</div>'+
 '<h3>📅 Saját aktivitás (7 nap × 24 óra)</h3>'+heatHTML();
 document.body.appendChild(P);P.querySelector('.x14eX').onclick=panel;
 P.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>react(b.dataset.e));
 P.querySelectorAll('[data-o]').forEach(c=>{c.checked=LS(c.dataset.o,true);c.onchange=()=>SV(c.dataset.o,c.checked)});
 P.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;if(a==='dance')groupDance();if(a==='ball'){panel();ballGame()}if(a==='card')profileCard();if(a==='motd')showMotd(true);if(a==='cam'){CAM.yaw=CAM.pitch=0;CAM.zoom=1}});
 const on=(window.ACC&&ACC.online||[]).length,fo=(window.ACC&&ACC.online||[]).filter(u=>friends().includes(u.name)).length,mine=(LS('k3x20log',[])).filter(l=>l&&l.t&&day(new Date(l.t))===day()).length;
 fetch('/api/stats').then(r=>r.json()).then(s=>{const e=document.getElementById('x14eSt');if(e)e.innerHTML='🟢 Most online: <b style="color:#4ade80">'+(s.online||on)+'</b> · 👤 Regisztrált: <b>'+(s.users||'?')+'</b><br>🤝 Online barátaid: <b>'+fo+'</b> · 🎮 Ma te: <b>'+mine+'</b> meccs'}).catch(()=>{const e=document.getElementById('x14eSt');if(e)e.innerHTML='🟢 Lobbyban: <b>'+on+'</b> · 🎮 Ma te: <b>'+mine+'</b> meccs'})}

addEventListener('keydown',e=>{if(e.key!=='F7')return;const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;e.preventDefault();if(lbOn())panel()});

// ---------- lobby-figyelő ----------
let wasOn=false;
setInterval(()=>{const on=lbOn();mountBtn();btn.style.display=on?'':'none';if(!on&&P){P.remove();P=null}if(!on&&DN)stopDance();
 if(on){buildStage();if(!wasOn)setTimeout(()=>lbOn()&&showMotd(false),1500)}wasOn=on},1000);
(function vl(){requestAnimationFrame(vl);if(lbOn())vizTick();else if(viz.style.display!=='none')viz.style.display='none'})();
X.dance=groupDance;X.react=react;X.ball=ballGame;X.card=profileCard;X.motd=showMotd;X.panel=panel;X.cam=CAM;X.st=()=>stage;
})();
