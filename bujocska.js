// ===== BÚJÓCSKA A LOBBYBAN: előbújik a tárgyak mögül – kapd el időben! (csak a lobbyban) =====
(function(){
const REWARD=20000;
const LINES=['Itt vagyok! …vagy mégsem? Nem kapsz el!','Kukucs! Túl lassú vagy, barátom!','Csak átutazóban vagyok, ne is figyelj rám!','Elnézést, épp egy fontos tárgyalásra sietek!','Ha elkapsz, meghívlak egy fagyira. De nem fogsz!',
 'Hoppá! Rossz bokor mögé bújtam.','Psszt! Senkinek se mondd, hogy itt jártam!','Napozni jöttem, nem bujkálni! …na jó, bujkálni.','Ez a pálma pont elég széles hozzám!','Egy, kettő, három… most látsz, most nem!','Fogadjunk, hogy nem vagy elég gyors!'];
const CAUGHT=['Jó, jó, elkaptál! Itt a 20 000 Ft, csak ne szólj senkinek!','Na tessék, lebuktam! Vidd a pénzt!','Ez gyors volt! Rendben, a tiéd a jutalom.','Hogy vetted észre?! Itt a borravaló.'];
const ESC=['Túl lassú! Bye-bye!','Hehe, nem kaptál el!','Már itt sem vagyok!'];
// rejtekhelyek: [x,z, előbújás iránya (x,z), magasság]
const SPOTS=[[-18.4,-17.2,1,0],[-13,-12.4,1,.4],[-11.6,-6.6,1,0],[13.4,-8.6,-1,0],[8.4,-18.6,-1,.3],[14.8,-17,1,0],[-25,-26.6,1,.2],[-15.6,-24,1,0],[6.4,-21.6,-1,.2],[-4.6,-11.4,1,0]];
const pick=a=>a[Math.random()*a.length|0];
let man=null,st={on:false,t:0,phase:'wait',wait:6,spot:null,base:null,dir:null,caught:false},bub=null,hot=null,ctr=null;
const css=document.createElement('style');css.textContent=`#bjBub{position:absolute;z-index:4;pointer-events:none;transform:translate(-50%,-100%);max-width:240px;background:#fff;color:#111;border:3px solid #ffd23f;border-radius:16px;padding:8px 12px;font:700 15px Rajdhani,Arial;box-shadow:0 8px 20px #0008;opacity:0;transition:opacity .2s}
#bjBub::after{content:"";position:absolute;left:50%;bottom:-12px;transform:translateX(-50%);border:10px solid transparent;border-top-color:#ffd23f;border-bottom:0}
#bjHot{position:absolute;z-index:4;width:90px;height:150px;transform:translate(-50%,-50%);cursor:crosshair;display:none;border-radius:30px}
#bjHot:hover{box-shadow:0 0 0 3px #ffd23faa,0 0 30px #ffd23f66}
#bjCnt{position:absolute;left:24px;top:232px;z-index:3;background:#0b1022d9;border:1px solid #ffffff22;border-radius:12px;padding:6px 12px;font:15px 'Luckiest Guy',Impact;color:#fde68a;pointer-events:none}
#bjWin{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(.5);z-index:6;pointer-events:none;font:56px 'Luckiest Guy',Impact;color:#facc15;text-shadow:0 5px 0 #7c2d12,0 0 30px #facc15;opacity:0;transition:all .3s;white-space:nowrap;text-align:center}`;document.head.appendChild(css);
function ensure(){const L=window.LB3D,lb=document.getElementById('lb');if(!L||man)return!!man;
 // rajzfilmes, kitalált figura (nem fotó)
 const def={c:0,skinC:0xf0c8a8,hair:'side',hairC:0x2b1a10,topC:0x0f0f14,legC:0x0f0f14,lapel:0x1a1a22,shirtC:0xffffff,collar:1,cuffC:0xffffff,shoeC:0x111111,belt:1,
  face:{skin:'#f0c8a8',eye:'#3b2a1a',brow:'#2b1a10',mouth:'grin',glasses:'#111',shades:1,stubble:1}};
 man=window.charModel?charModel(def,1):person(0x0f0f14,'',1);
 const chain=new THREE.Mesh(new THREE.TorusGeometry(.2,.035,6,18),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:1,roughness:.2}));chain.position.set(0,1.8,.24);chain.rotation.x=.3;man.add(chain);
 const lb2=spr('Matolcsy Ádám',2.4,'x');lb2.position.y=3.5;lb2.material.depthTest=false;man.add(lb2);
 man.visible=false;L.sc.add(man);
 bub=document.createElement('div');bub.id='bjBub';lb.appendChild(bub);hot=document.createElement('div');hot.id='bjHot';hot.title='Kapd el!';lb.appendChild(hot);
 ctr=document.createElement('div');ctr.id='bjCnt';lb.appendChild(ctr);updCnt();
 const win=document.createElement('div');win.id='bjWin';lb.appendChild(win);
 hot.onclick=()=>catchIt();
 let lastT=performance.now();L.fx.push(()=>{const n=performance.now();tick(Math.min(.25,(n-lastT)/1000));lastT=n});return true}
const store=()=>{try{return JSON.parse(localStorage.getItem('ry_bj'))||{c:0}}catch(e){return{c:0}}};
function updCnt(){if(ctr)ctr.textContent='🕵️ Elkapva: '+store().c+'x · Jutalom: 20 000 Ft'}
function say(t,ms){bub.textContent=t;bub.style.opacity=1;clearTimeout(say.T);say.T=setTimeout(()=>bub.style.opacity=0,ms||2200)}
function popOut(){const s=pick(SPOTS);st.spot=s;st.base=new THREE.Vector3(s[0],s[3]||0,s[1]);st.dir=new THREE.Vector3(s[2],0,0);st.phase='out';st.t=0;st.caught=false;
 man.visible=true;man.position.copy(st.base);man.rotation.y=s[2]>0?Math.PI/2.4:-Math.PI/2.4;say(pick(LINES),2600)}
function catchIt(){if(st.phase!=='out'&&st.phase!=='stay')return;st.caught=true;st.phase='in';st.t=0;
 try{S.c+=REWARD;save();}catch(e){}const d=store();d.c++;localStorage.setItem('ry_bj',JSON.stringify(d));updCnt();
 say(pick(CAUGHT),2600);const w=document.getElementById('bjWin');w.innerHTML='ELKAPTAD! 🎉<br><span style="font-size:40px;color:#a3e635">+20 000 Ft</span>';w.style.opacity=1;w.style.transform='translate(-50%,-50%) scale(1)';
 setTimeout(()=>{w.style.opacity=0;w.style.transform='translate(-50%,-50%) scale(.5)'},1800);try{sfx('win')}catch(e){}hot.style.display='none';
 if(window.ACCXP)ACCXP.add(50,'Bújócska')}
// ---- villanyoszlop a körözési plakáttal (rajzolt figura) ----
let pole=null,poleSaid=false;const POLE={x:-5.2,z:-12.5};
function mkPole(sc){const g=new THREE.Group();const wood=new THREE.MeshStandardMaterial({color:0x5b3a1e,roughness:.9});
 const p=new THREE.Mesh(new THREE.CylinderGeometry(.14,.18,7,10),wood);p.position.y=3.5;g.add(p);const cr=new THREE.Mesh(new THREE.BoxGeometry(2,.14,.14),wood);cr.position.y=6.4;g.add(cr);
 [-.8,.8].forEach(x=>{const i=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.18,8),new THREE.MeshStandardMaterial({color:0xe5e7eb}));i.position.set(x,6.55,0);g.add(i)});
 const lamp=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:0xfff3c4}));lamp.position.set(0,6.9,.25);g.add(lamp);
 const c=document.createElement('canvas');c.width=256;c.height=340;const x=c.getContext('2d');x.fillStyle='#f5f0e1';x.fillRect(0,0,256,340);x.strokeStyle='#7c2d12';x.lineWidth=6;x.strokeRect(6,6,244,328);
 x.fillStyle='#b91c1c';x.font='bold 34px Impact,Arial';x.textAlign='center';x.fillText('KÖRÖZÉS',128,46);
 x.fillStyle='#d6d3d1';x.fillRect(48,60,160,170);x.fillStyle='#f1c27d';x.beginPath();x.ellipse(128,150,48,60,0,0,7);x.fill();x.fillStyle='#e5e7eb';x.beginPath();x.ellipse(128,100,52,22,0,Math.PI,0);x.fill();
 x.fillStyle='#111';[108,148].forEach(ex=>{x.beginPath();x.arc(ex,140,5,0,7);x.fill()});x.strokeStyle='#111';x.lineWidth=3;x.beginPath();x.arc(128,170,16,.2,Math.PI-.2);x.stroke();x.fillStyle='#1e3a8a';x.fillRect(70,205,116,25);
 x.fillStyle='#111';x.font='bold 19px Arial';x.fillText('AKI MINDIG',128,262);x.fillText('ELŐUGRÁL',128,286);x.fillStyle='#15803d';x.font='bold 17px Arial';x.fillText('Jutalom: 20 000 Ft',128,318);
 const t=new THREE.CanvasTexture(c);const ps=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.6),new THREE.MeshStandardMaterial({map:t,roughness:.9}));ps.position.set(0,2.6,.2);g.add(ps);
 g.position.set(POLE.x,0,POLE.z);g.rotation.y=.15;g.traverse(o=>{if(o.isMesh)o.castShadow=true});sc.add(g);return g}
function tick(dt){if(!pole&&window.LB3D&&LB3D.sc){try{pole=mkPole(LB3D.sc)}catch(e){console.error(e)}}
 if(man&&man.visible&&st.phase!=='wait'){const d=Math.hypot(man.position.x-POLE.x,man.position.z-POLE.z);if(d<16&&!poleSaid){poleSaid=true;setTimeout(()=>{if(man&&man.visible)say(pick(['Hát ez én vagyok! Tudod, aki mindig előugrál!','Nézd, a plakáton! Hát ez én vagyok, aki mindig előugrál!','Ez a kép nem hízelgő… de igen, ez én vagyok!']),3200)},900)}}else poleSaid=false;
const L=window.LB3D,lb=document.getElementById('lb');if(!man||!lb.classList.contains('on')){if(man)man.visible=false;if(hot)hot.style.display='none';return}
 st.t+=dt;const P=L.cam,W=innerWidth,H=innerHeight;
 if(st.phase==='wait'){man.visible=false;hot.style.display='none';st.wait-=dt;if(st.wait<=0)popOut();return}
 const peek=st.phase==='out'?Math.min(1,st.t/.35):st.phase==='stay'?1:Math.max(0,1-st.t/.3);
 man.position.copy(st.base).addScaledVector(st.dir,peek*1.6);man.position.y=(st.base.y)+Math.abs(Math.sin(st.t*10))*.06;
 // integet a karjával
 man.traverse(c=>{if(c.userData&&c.userData.limb==='rarm')c.rotation.z=st.phase==='in'?0:(2.3+Math.sin(st.t*12)*.4)});
 if(st.phase==='out'&&st.t>.35){st.phase='stay';st.t=0}
 else if(st.phase==='stay'&&st.t>2.4){st.phase='in';st.t=0;if(!st.caught)say(pick(ESC),1500)}
 else if(st.phase==='in'&&st.t>.32){st.phase='wait';st.wait=15+Math.random()*20;man.visible=false}
 const v=man.position.clone();v.y+=4.7;v.project(P);const sx=(v.x+1)/2*W,sy=(1-v.y)/2*H;bub.style.left=sx+'px';bub.style.top=sy+'px';
 const c=man.position.clone();c.y+=1.6;c.project(P);hot.style.left=((c.x+1)/2*W)+'px';hot.style.top=((1-c.y)/2*H)+'px';hot.style.display=(st.phase==='stay'||st.phase==='out')&&!st.caught?'block':'none'}
// indítás, amikor a lobby 3D jelenete kész
(function wait(){if(!ensure())setTimeout(wait,500)})();
})();
