// ===== EXTRA CSOMAG (1. kör a 100 ötletből) =====
// gránát (H) · ugrópárna (N) · gyógyzóna (Y) · időjárás · napszak · grafikai beállítások · célkereszt · távcső-érzékenység
// FPS-overlay · fejlesztői parancsok · fotómód (O) · napi szerencsekerék · chat-emojik · kutyaparancsok (K/L)
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('extra '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i);const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
const gOK=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&G.phase==='play'&&!G.over;
// ---------- beállítások ----------
const XK='k3extra';const X=Object.assign({shadows:true,res:1,xhCol:'#ffffff',xhSize:18,xhShape:'kor',scope:.6,weather:true},(()=>{try{return JSON.parse(localStorage.getItem(XK)||'{}')}catch(e){return{}}})());
const saveX=()=>{try{localStorage.setItem(XK,JSON.stringify(X))}catch(e){}};
function applyGfx(){const rs=[];if(typeof ren!=='undefined'&&ren)rs.push([ren,typeof scene!=='undefined'?scene:null]);if(window.LB3D&&LB3D.r)rs.push([LB3D.r,LB3D.sc]);
 rs.forEach(([r,sc])=>{const pr=Math.max(.4,Math.min(1,devicePixelRatio||1))*X.res;if(Math.abs(r.getPixelRatio()-pr)>.01){r.setPixelRatio(pr);const c=r.domElement;r.setSize(c.clientWidth||innerWidth,c.clientHeight||innerHeight,false)}
  if(r.shadowMap.enabled!==X.shadows){r.shadowMap.enabled=X.shadows;if(sc)sc.traverse(o=>{if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.needsUpdate=true)}})}})}
function applyXh(){const x=$$('xh');if(!x)return;const s=X.xhSize,c=X.xhCol;x.style.width=x.style.height=s+'px';x.style.margin=(-s/2)+'px';
 if(X.xhShape==='pont'){x.style.border='0';x.style.borderRadius='50%';x.style.background=c;x.style.width=x.style.height=Math.max(4,s/4)+'px';x.style.margin=(-Math.max(4,s/4)/2)+'px'}
 else if(X.xhShape==='kereszt'){x.style.border='0';x.style.borderRadius='0';x.style.background='linear-gradient('+c+','+c+') center/2px 100% no-repeat,linear-gradient('+c+','+c+') center/100% 2px no-repeat'}
 else{x.style.border='2px solid '+c;x.style.borderRadius='50%';x.style.background='none'}}
setTimeout(()=>{applyXh();applyGfx()},1500);
window.xSet=(k,v)=>{X[k]=v;saveX();applyGfx();applyXh();const e=$$('xSetBox');if(e)e.outerHTML=setBox()};
function setBox(){const ch=(k,v,l)=>'<button class="b '+(X[k]===v?'':'p')+'" style="display:inline-block;width:auto;margin:3px;padding:6px 10px;font-size:14px" onclick="xSet(\''+k+'\','+JSON.stringify(v).replace(/"/g,'&quot;')+')">'+l+'</button>';
 return'<div id="xSetBox" style="text-align:left;margin-top:10px;border-top:1px solid #ffffff22;padding-top:8px"><b style="color:#fde68a">🖥️ GRAFIKA</b><br>Árnyékok: '+ch('shadows',true,'BE')+ch('shadows',false,'KI')+'<br>Felbontás: '+[[.5,'50%'],[.75,'75%'],[1,'100%']].map(([v,l])=>ch('res',v,l)).join('')+
 '<br><b style="color:#fde68a">🎯 CÉLKERESZT</b><br>Forma: '+ch('xhShape','kor','⭕ Kör')+ch('xhShape','pont','• Pont')+ch('xhShape','kereszt','✚ Kereszt')+'<br>Szín: '+['#ffffff','#4ade80','#facc15','#f472b6','#22d3ee','#ef4444'].map(c=>'<button onclick="xSet(\'xhCol\',\''+c+'\')" style="width:28px;height:28px;margin:3px;border-radius:8px;border:'+(X.xhCol===c?'3px solid #fff':'1px solid #0008')+';background:'+c+';cursor:pointer"></button>').join('')+
 '<br>Méret: '+[12,18,26].map(v=>ch('xhSize',v,v===12?'Kicsi':v===18?'Közepes':'Nagy')).join('')+'<br><b style="color:#fde68a">🔭 TÁVCSŐ-ÉRZÉKENYSÉG</b> (a sima érzékenységhez képest)<br>'+[[.35,'35%'],[.6,'60%'],[.8,'80%'],[1,'100%']].map(([v,l])=>ch('scope',v,l)).join('')+
 '<br><b style="color:#fde68a">🌦️ IDŐJÁRÁS</b> a meccseken: '+ch('weather',true,'BE')+ch('weather',false,'KI')+'</div>'}
WP('setUI',null,()=>{const g=$$('gui');if(!g)return;const h=[...g.querySelectorAll('h1')].find(x=>x.textContent.includes('BEÁLLÍTÁSOK'));if(!h)return;const box=document.createElement('div');box.innerHTML=setBox();const bt=[...h.parentNode.querySelectorAll('button')].pop();if(bt&&bt.parentNode)bt.parentNode.insertBefore(box.firstChild,bt);else h.parentNode.appendChild(box.firstChild)});
// távcső: külön érzékenység (a zoomolt FOV-ból ismerjük fel)
let scBase=null;function scopeSens(){if(typeof cam==='undefined'||!cam||typeof SET==='undefined')return;const sc=cam.fov<SET.fov*.6;if(sc&&scBase===null){scBase=SET.sens;SET.sens=scBase*X.scope}else if(!sc&&scBase!==null){SET.sens=scBase;scBase=null}}
// ---------- meccs-tárgyak ----------
let IT=null,TRAPS=[],NADE=[],FXS=[];
WP('launch',null,()=>{IT={gr:3,pad:2,heal:1,stay:false};TRAPS=[];NADE=[];FXS=[];hudBox();startWeather();scBase=null;applyGfx();applyXh()});
const css=document.createElement('style');css.textContent=`#xItems{position:absolute;right:14px;bottom:160px;z-index:3;display:flex;gap:6px;pointer-events:none;font:700 14px Rajdhani}
#xItems span{background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:4px 9px}#xItems b{color:#facc15}
#xFlash{position:fixed;inset:0;background:#e0f2fe;opacity:0;pointer-events:none;z-index:2;transition:opacity .15s}
#xFps{position:fixed;left:8px;top:96px;z-index:30;background:#000c;color:#4ade80;font:12px monospace;padding:6px 8px;border-radius:8px;white-space:pre;display:none;pointer-events:none}
#xPhoto{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:40;background:#000c;color:#fff;font:700 16px Rajdhani;padding:8px 16px;border-radius:12px;display:none}
.xph #hud>*:not(canvas),.xph #lb>*:not(#lbCv),.xph #pfTog,.xph #xItems{visibility:hidden!important}
#xWheelB{position:fixed;right:420px;bottom:24px;z-index:9;border:0;border-radius:14px;padding:10px 16px;font:18px 'Luckiest Guy',Impact;color:#1c1300;background:linear-gradient(135deg,#fde68a,#f59e0b);box-shadow:0 0 18px #facc1588,0 4px 0 #92400e;cursor:pointer;display:none;animation:xPul 1.6s infinite}
#xWheelB.used{animation:none;filter:grayscale(.8);opacity:.7}@keyframes xPul{50%{transform:scale(1.06)}}
#xEmo{display:flex;gap:2px;flex-wrap:wrap;padding:4px 8px}#xEmo button{border:0;background:#ffffff12;border-radius:8px;font-size:18px;padding:2px 6px;cursor:pointer}#xEmo button:hover{background:#ffffff30}`;document.head.appendChild(css);
const flash=document.createElement('div');flash.id='xFlash';document.body.appendChild(flash);
function hudBox(){let b=$$('xItems');if(!b){b=document.createElement('div');b.id='xItems';const h=$$('hud');if(h)h.appendChild(b)}updItems()}
function updItems(){const b=$$('xItems');if(!b||!IT)return;const dog=window._PETFIGHT&&_PETFIGHT();b.innerHTML='<span>💣 <b>'+IT.gr+'</b> [H]</span><span>🟦 <b>'+IT.pad+'</b> [N]</span><span>💚 <b>'+IT.heal+'</b> [Y]</span>'+(dog?'<span>🐕 '+(IT.stay?'MARAD':'KÖVET')+' [K] · TÁMAD [L]</span>':'')}
const MB=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.9,depthWrite:false});
function aimDir(){const p=G.pit||0;return{x:Math.cos(G.ang)*Math.cos(p),y:Math.sin(p),z:Math.sin(G.ang)*Math.cos(p)}}
function throwNade(){if(!IT||IT.gr<=0){say('💣 Nincs több gránátod!');return}IT.gr--;const d=aimDir(),m=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshStandardMaterial({color:0x365314,roughness:.5,metalness:.4}));
 const n={m,x:G.x+d.x*1.2,y:G.y+2,z:G.z+d.z*1.2,vx:d.x*19,vy:d.y*19+6,vz:d.z*19,t:2.2};m.position.set(n.x,n.y,n.z);scene.add(m);NADE.push(n);try{sfx('drop')}catch(e){}updItems()}
function boom(x,y,z){const s=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),MB(0xff8a1f));s.position.set(x,y+.5,z);scene.add(s);FXS.push({m:s,t:0,k:'boom'});const s2=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),MB(0x52525b));s2.position.set(x,y+.8,z);scene.add(s2);FXS.push({m:s2,t:-.1,k:'smoke'});
 try{sfx('rocket')}catch(e){}let hit=0;(G.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-x,e.z-z);if(d<6.5){hit++;try{dmgE(e,140*(1-d/7.5))}catch(er){}}});const pd=Math.hypot(G.x-x,G.z-z);if(pd<3&&Math.abs(G.y-y)<3)hurt(18);if(hit)say('💥 Gránát: '+hit+' találat!')}
function placePad(){if(!IT||IT.pad<=0){say('🟦 Nincs több ugrópárnád!');return}IT.pad--;const x=G.x+Math.cos(G.ang)*2.5,z=G.z+Math.sin(G.ang)*2.5,y=floorH({x,z,y:G.y+1});const g=new THREE.Group();
 const b=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.4,.25,20),new THREE.MeshStandardMaterial({color:0x1e3a8a,metalness:.5,roughness:.4}));b.position.y=.12;const t=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.05,.06,20),new THREE.MeshBasicMaterial({color:0x38bdf8}));t.position.y=.27;g.add(b,t);g.position.set(x,y,z);scene.add(g);TRAPS.push({k:'pad',x,z,y,g,top:t,cd:0});try{sfx('wall')}catch(e){}updItems()}
function placeHeal(){if(!IT||IT.heal<=0){say('💚 Nincs több gyógyzónád!');return}IT.heal--;const x=G.x,z=G.z,y=G.y;const r=new THREE.Mesh(new THREE.CylinderGeometry(4,4,.08,40,1,true),MB(0x22c55e));r.position.set(x,y+.05,z);r.material.opacity=.5;r.material.side=THREE.DoubleSide;
 const col=new THREE.Mesh(new THREE.CylinderGeometry(4,4,3,40,1,true),new THREE.MeshBasicMaterial({color:0x4ade80,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));col.position.set(x,y+1.5,z);scene.add(r,col);TRAPS.push({k:'heal',x,z,y,ms:[r,col],t:12});try{sfx('magic')}catch(e){}say('💚 Gyógyzóna: 12 mp, 4 m sugarú');updItems()}
// ---------- időjárás ----------
let RAIN=null,lightT=0,weatherOn=false;
function startWeather(){RAIN=null;weatherOn=X.weather&&Math.random()<.35;if(weatherOn)makeRain()}
function makeRain(){const N=2600,pos=new Float32Array(N*3);for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*80;pos[i*3+1]=Math.random()*40;pos[i*3+2]=(Math.random()-.5)*80}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));RAIN=new THREE.Points(geo,new THREE.PointsMaterial({color:0xa5c8ff,size:.12,transparent:true,opacity:.7,depthWrite:false}));RAIN.frustumCulled=false;scene.add(RAIN);lightT=6+Math.random()*10}
function stopRain(){if(RAIN){scene.remove(RAIN);RAIN=null}weatherOn=false}
// ---------- fő ciklus ----------
WP('update',null,a=>{if(typeof G==='undefined'||!G||G.over)return;const dt=Math.min(.1,a[0]||.016);scopeSens();
 for(let i=NADE.length-1;i>=0;i--){const n=NADE[i];n.vy-=24*dt;n.x+=n.vx*dt;n.y+=n.vy*dt;n.z+=n.vz*dt;const fh=floorH({x:n.x,z:n.z,y:n.y});if(n.y<fh+.2){n.y=fh+.2;n.vy*=-.35;n.vx*=.6;n.vz*=.6}n.t-=dt;n.m.position.set(n.x,n.y,n.z);n.m.rotation.x+=dt*8;if(n.t<=0){scene.remove(n.m);boom(n.x,n.y,n.z);NADE.splice(i,1)}}
 for(let i=FXS.length-1;i>=0;i--){const f=FXS[i];f.t+=dt;if(f.t<0)continue;const k=f.k==='boom'?f.t/.45:f.t/1.6;f.m.scale.setScalar(f.k==='boom'?1+k*6:2+k*4);f.m.material.opacity=Math.max(0,(f.k==='boom'?.95:.5)*(1-k));if(f.k==='smoke')f.m.position.y+=dt*1.5;if(k>=1){scene.remove(f.m);FXS.splice(i,1)}}
 for(let i=TRAPS.length-1;i>=0;i--){const t=TRAPS[i];if(t.k==='pad'){t.cd-=dt;t.top.material.color.setHSL(.55,1,.55+Math.sin(G.t*6)*.1);if(t.cd<=0&&Math.hypot(G.x-t.x,G.z-t.z)<1.4&&G.y<=t.y+.6&&G.vy<=0){G.vy=17;t.cd=.6;try{sfx('jump')}catch(e){}}}
  else if(t.k==='heal'){t.t-=dt;t.ms[1].rotation.y+=dt;if(Math.hypot(G.x-t.x,G.z-t.z)<4&&G.hp>0)G.hp=Math.min(G.mhp,G.hp+10*dt);if(t.t<=0){t.ms.forEach(m=>scene.remove(m));TRAPS.splice(i,1)}}}
 if(RAIN&&typeof cam!=='undefined'){RAIN.position.set(cam.position.x,cam.position.y-15,cam.position.z);const p=RAIN.geometry.attributes.position,ar=p.array;for(let i=1;i<ar.length;i+=3){ar[i]-=dt*28;if(ar[i]<0)ar[i]+=40}p.needsUpdate=true;
  lightT-=dt;if(lightT<=0){lightT=8+Math.random()*14;flash.style.opacity=.55;setTimeout(()=>flash.style.opacity=0,120);setTimeout(()=>{flash.style.opacity=.35;setTimeout(()=>flash.style.opacity=0,90)},260)}}
 if(G.god){G.hp=G.mhp;G.sh=G.msh}fpsTick()});
WP('end',null,()=>{stopRain();flash.style.opacity=0});
// ---------- billentyűk ----------
addEventListener('keydown',e=>{if(typing(e))return;const k=e.key.toLowerCase();
 if(k==='o')return; // régi fotómód kivezetve (A, 11-08) – az O-t az extra90 kezeli
 if(k==='enter'&&document.body.classList.contains('xph')){snap();e.preventDefault();return}
 if(!gOK()||(typeof GUI!=='undefined'&&GUI.on))return;
 if(k==='h')throwNade();else if(k==='n')placePad();else if(k==='y')placeHeal();
 else if(k==='k'){const d=window._PETFIGHT&&_PETFIGHT();if(d){IT.stay=!IT.stay;d.stay=IT.stay;say(IT.stay?'🐕 Marad!':'🐕 Követ!');updItems()}}
 else if(k==='l'){const d=window._PETFIGHT&&_PETFIGHT();if(!d)return;const dir=aimDir();let best=null,bs=-1;(G.en||[]).forEach(en=>{if(en.dead)return;const dx=en.x-G.x,dz=en.z-G.z,dd=Math.hypot(dx,dz);if(dd>45)return;const dot=(dx*dir.x+dz*dir.z)/(dd||1);if(dot>.85&&dot>bs){bs=dot;best=en}});if(best){d.tg=best;d.force=1;say('🐕 Támadj!')}else say('🐕 Nincs ellenfél a célkereszt irányában.')}},true);
// ---------- fotómód ----------
const ph=document.createElement('div');ph.id='xPhoto';ph.textContent='📸 FOTÓMÓD · Enter: kép mentése · O: kilépés';document.body.appendChild(ph);
function photo(on){document.body.classList.toggle('xph',on);ph.style.display=on?'block':'none'}
function snap(){let r=null,sc=null,c=null;const lb=$$('lb');if(lb&&lb.classList.contains('on')&&window.LB3D){r=LB3D.r;sc=LB3D.sc;c=LB3D.cam}else if(typeof ren!=='undefined'&&ren){r=ren;sc=scene;c=cam}if(!r)return;
 r.render(sc,c);const url=r.domElement.toDataURL('image/png');const a=document.createElement('a');a.href=url;a.download='kozpenz_royale_'+new Date().toISOString().replace(/[:.]/g,'-')+'.png';a.click();ph.textContent='✅ Kép mentve! · Enter: újabb · O: kilépés';setTimeout(()=>ph.textContent='📸 FOTÓMÓD · Enter: kép mentése · O: kilépés',1800)}
// ---------- FPS-overlay ----------
const fp=document.createElement('div');fp.id='xFps';document.body.appendChild(fp);let fpsOn=false,fN=0,fT=performance.now(),fV=0;
function fpsTick(){if(!fpsOn)return;fN++;const n=performance.now();if(n-fT>=500){fV=Math.round(fN*1000/(n-fT));fN=0;fT=n;const r=(typeof ren!=='undefined'&&ren&&run)?ren:(window.LB3D&&LB3D.r);const i=r?r.info:null;const mem=performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576)+' MB':'?';
 fp.textContent='FPS: '+fV+'\nRajzolás: '+(i?i.render.calls:'?')+'\nHáromszög: '+(i?i.render.triangles.toLocaleString('hu-HU'):'?')+'\nGeometria: '+(i?i.memory.geometries:'?')+' · Textúra: '+(i?i.memory.textures:'?')+'\nJS memória: '+mem+'\nFelbontás: '+Math.round(X.res*100)+'% · Árnyék: '+(X.shadows?'BE':'KI')}}
(function lobbyFps(){requestAnimationFrame(lobbyFps);if(fpsOn&&!(typeof run!=='undefined'&&run))fpsTick()})();
// ---------- fejlesztői parancsok ----------
const BI={menedék:[0,10],tábor:[0,10],tundra:[0,-150],hamuföld:[130,0],vulkán:[130,0],gombaerdő:[-150,10],romok:[0,135],piramis:[0,135],tó:[95,95],kristálytó:[95,95],mocsár:[-110,110],szélfennsík:[-100,-100],csillagszirt:[105,-100]};
window.extraCmd=function(c){const p=String(c).trim().split(/\s+/),n=(p[0]||'').toLowerCase().replace(/^\//,'');const g=typeof G!=='undefined'?G:null;
 if(n==='fps'){fpsOn=!fpsOn;fp.style.display=fpsOn?'block':'none';return'📊 FPS-kijelző '+(fpsOn?'BE':'KI')}
 if(n==='reset'){if(p[1]!=='igen')return'⚠️ Ez MINDEN mentést töröl (pénz, tárgyak, beállítások)! Megerősítés: /reset igen';localStorage.clear();setTimeout(()=>location.reload(),600);return'🧹 Minden mentés törölve, újratöltés…'}
 if(!g||!run)return['spawn','tp','god','time','weather','idojaras','ido'].includes(n)?'⚠️ Ez a parancs csak meccs közben működik.':null;
 if(n==='god'){g.god=!g.god;return'🛡️ Sérthetetlenség '+(g.god?'BE':'KI')}
 if(n==='spawn'){const k=Math.max(1,Math.min(20,parseInt(p[1])||3));for(let i=0;i<k;i++){const a=g.ang+(Math.random()-.5)*.8,d=14+Math.random()*8,x=g.x+Math.cos(a)*d,z=g.z+Math.sin(a)*d;if(!hin(x,z))continue;g.en.push(sp(p[2]&&ET[p[2]]?p[2]:'prop',x,z))}return'👾 '+k+' ellenfél lerakva'}
 if(n==='tp'){if(p.length>=3&&!isNaN(+p[1])){g.x=+p[1];g.z=+p[2];g.y=0;return'🌀 Teleport: '+p[1]+', '+p[2]}const b=BI[(p[1]||'').toLowerCase()];if(b&&g.stw){g.x=b[0];g.z=b[1];g.y=0;return'🌀 Teleport: '+p[1]}return'Használat: /tp x z'+(g.stw?' vagy /tp tundra|hamuföld|gombaerdő|romok|tó|mocsár|szélfennsík|csillagszirt|tábor':'')}
 if(n==='time'||n==='ido'){const night=/^(éj|ej|night|éjszaka)/.test(p[1]||'');if(window.HEMI)HEMI.intensity=night?.35:1.1;if(window.SUN)SUN.intensity=night?.25:1.3;if(scene.background&&scene.background.set)scene.background.set(night?0x070a1a:0x87b6e8);return night?'🌙 Éjszaka':'☀️ Nappal'}
 if(n==='weather'||n==='idojaras'){if(/^(es|eső|rain)/.test(p[1]||'')){stopRain();makeRain();weatherOn=true;return'🌧️ Eső'}stopRain();return'☀️ Tiszta idő'}
 return null};
// ---------- napi szerencsekerék (lobby) ----------
const PR=[['🪙 200 zseton','zs',200],['💵 10 000 Ft','ft',10000],['🪙 500 zseton','zs',500],['💵 25 000 Ft','ft',25000],['🪙 1 000 zseton','zs',1000],['💵 5 000 Ft','ft',5000],['💎 5 000 zseton','zs',5000],['💵 100 000 Ft','ft',100000]];
const PW=[24,20,18,14,9,10,2,3];const today=()=>new Date().toISOString().slice(0,10);
const wb=document.createElement('button');wb.id='xWheelB';wb.textContent='🎡 NAPI KERÉK';document.body.appendChild(wb);
setInterval(()=>{const lb=$$('lb');const vis=lb&&lb.classList.contains('on')&&!(typeof run!=='undefined'&&run)&&!document.body.classList.contains('xph');wb.style.display=vis?'block':'none';wb.classList.toggle('used',localStorage.getItem('k3wheel')===today())},700);
wb.onclick=()=>{const used=localStorage.getItem('k3wheel')===today();guiOpen('<h1 class="f" style="font-size:32px">🎡 NAPI SZERENCSEKERÉK</h1><div style="color:#cbd5e1">Naponta egyszer ingyen pörgethetsz – csak játékbeli jutalmak.</div><canvas id="xWh" width="380" height="380" style="margin:10px auto;display:block"></canvas><div id="xWhR" class="f" style="font-size:24px;min-height:32px;color:#facc15"></div>'+(used?'<div style="color:#f87171;font-weight:700">Ma már pörgettél – gyere vissza holnap!</div>':bB('🎡 PÖRGETÉS!','xSpin()','c'))+bB('VISSZA','guiClose()','r'));setTimeout(()=>drawWheel(0),20)};
function drawWheel(a){const c=$$('xWh');if(!c)return;const x=c.getContext('2d'),R2=180,cx=190,cy=190,n=PR.length,cols=['#f59e0b','#22c55e','#3b82f6','#ec4899','#a855f7','#14b8a6','#ef4444','#eab308'];x.clearRect(0,0,380,380);
 for(let i=0;i<n;i++){const a0=a+i/n*6.283,a1=a+(i+1)/n*6.283;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R2,a0,a1);x.closePath();x.fillStyle=cols[i];x.fill();x.strokeStyle='#0008';x.lineWidth=2;x.stroke();
  x.save();x.translate(cx,cy);x.rotate((a0+a1)/2);x.textAlign='right';x.fillStyle='#fff';x.font='bold 15px Rajdhani';x.shadowColor='#000';x.shadowBlur=4;x.fillText(PR[i][0],R2-10,5);x.restore()}
 x.beginPath();x.arc(cx,cy,26,0,6.283);x.fillStyle='#111827';x.fill();x.fillStyle='#facc15';x.font='bold 22px sans-serif';x.textAlign='center';x.fillText('★',cx,cy+8);
 x.beginPath();x.moveTo(cx+R2-6,cy);x.lineTo(cx+R2+12,cy-12);x.lineTo(cx+R2+12,cy+12);x.closePath();x.fillStyle='#fff';x.fill();x.strokeStyle='#000';x.stroke()}
window.xSpin=()=>{if(localStorage.getItem('k3wheel')===today())return;localStorage.setItem('k3wheel',today());const btn=[...$$('gui').querySelectorAll('button')].find(b=>b.textContent.includes('PÖRGETÉS'));if(btn)btn.disabled=true;
 const tot=PW.reduce((a,b)=>a+b,0);let r=Math.random()*tot,w=0;while(r>=PW[w]){r-=PW[w];w++}const n=PR.length,target=6.283*6-(w+.5)/n*6.283;const t0=performance.now(),D=4200;
 (function sp(){const k=Math.min(1,(performance.now()-t0)/D),e=1-Math.pow(1-k,4);drawWheel(target*e);if(k<1){requestAnimationFrame(sp);try{if(Math.random()<.25)sfx('step')}catch(x){}return}
  const p=PR[w];if(p[1]==='zs'){BR.zs=(BR.zs|0)+p[2];try{st.s('k3br',BR)}catch(x){}}else{S.c=(S.c||0)+p[2];try{save()}catch(x){}}const rr=$$('xWhR');if(rr)rr.textContent='🎉 NYEREMÉNY: '+p[0];try{sfx('win')}catch(x){}})()};
// ---------- chat-emojik (lobby) ----------
(function(){const iv=setInterval(()=>{const box=$$('lbIn');if(!box)return;clearInterval(iv);const e=document.createElement('div');e.id='xEmo';e.innerHTML=['😂','👍','🔥','💰','😎','😭','🎉','🐕','⚽','🙏','👀','💀'].map(x=>'<button type="button">'+x+'</button>').join('');box.parentNode.insertBefore(e,box);
 e.onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const i=box.querySelector('input');i.value+=b.textContent;i.focus()}},600)})();
})();
