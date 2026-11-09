// ===== BATTLE ROYALE: csákány (fák/épületek kiütése → nyersanyag) + mesterlövész-távcső =====
(function(){
// ---------- kiütés ----------
let hcd=0,inst=null;
function instances(){if(inst)return inst;inst=[];const m4=new THREE.Matrix4(),p=new THREE.Vector3();scene.traverse(o=>{if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);p.setFromMatrixPosition(m4);inst.push({o,i,x:p.x,z:p.z})}}});return inst}
function vanish(c){const zero=new THREE.Matrix4().makeScale(0,0,0),rr=Math.max(.6,c.r*1.15);
 instances().forEach(it=>{if(Math.hypot(it.x-c.x,it.z-c.z)<rr){it.o.setMatrixAt(it.i,zero);it.o.instanceMatrix.needsUpdate=true}});
 const v=new THREE.Vector3(),hide=[];scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.visible)return;if(o.geometry){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();const s=o.geometry.boundingSphere.radius*Math.max(o.scale.x,o.scale.y,o.scale.z);if(s>c.r*2.2+4)return}o.getWorldPosition(v);if(Math.hypot(v.x-c.x,v.z-c.z)<rr&&v.y<(c.h||6)+3)hide.push(o)});
 hide.forEach(o=>o.visible=false)}
function chunks(x,y,z,col){for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,.25),new THREE.MeshStandardMaterial({color:col}));m.position.set(x,y,z);scene.add(m);const vx=rnd(-4,4),vy=rnd(3,7),vz=rnd(-4,4);let t=0;const f=()=>{t+=.016;m.position.x+=vx*.016;m.position.z+=vz*.016;m.position.y+=(vy-t*18)*.016;m.rotation.x+=.2;if(t<.9)requestAnimationFrame(f);else scene.remove(m)};f()}}
window._HARV=function(){const g=G;if(!g||!g.brMode||g.phase!=='play'||hcd>0)return;if(g.gl||g.fly||g.y-floorH(g)>.4){if(!g._airMsg||g.t-g._airMsg>2){g._airMsg=g.t;say('🪂 Levegőben nem tudsz ütni!')}return}hcd=.42;
 const fx=Math.cos(g.ang),fz=Math.sin(g.ang);let best=null,bd=1e9;
 (g.col||[]).forEach(c=>{if(c.tmpW||c.tmp||c.r>14)return;const dx=c.x-g.x,dz=c.z-g.z,along=dx*fx+dz*fz,perp=Math.abs(dx*fz-dz*fx),d=Math.hypot(dx,dz);const rr=c.hw?Math.max(c.hw,c.hd):c.r;let hitD;if(d<rr+.6)hitD=0;else{if(along<0||perp>rr+.5)return;hitD=along-Math.sqrt(Math.max(0,(rr+.5)**2-perp*perp))}if(hitD>3.2)return;if(hitD<bd){bd=hitD;best=c}});
 try{sfx('hit')}catch(e){}g.swing=.25;
 if(!best){return}
 const tree=best.r<1.2;if(best.hp==null)best.hp=tree?75:Math.round(140+best.r*25);best.hp-=25;
 const gain=tree?6:9;if(window.BR)BR.mats=Math.min(999,(BR.mats||0)+gain);
 ftx(best.x,best.z,'+'+gain+(tree?' 🪵':' 🧱'),'');chunks(g.x+fx*1.2,1.4,g.z+fz*1.2,tree?0x8b5a2b:0x9ca3af);
 if(best.hp<=0){vanish(best);g.col=g.col.filter(c=>c!==best);if(window.BR)BR.mats=Math.min(999,BR.mats+(tree?15:30));try{sfx('explode')}catch(e){}say(tree?'🌳 Fa kidöntve! +15 🪵':'🏚️ Épület lerombolva! +30 🧱')}};
// C = csákány elővétele fegyver helyett (fegyverrel is lehessen gyűjteni)
addEventListener('keydown',e=>{if(!G||!G.brMode||!run)return;const k=e.key.toLowerCase();if(k==='c'){G.pickMode=!G.pickMode;say(G.pickMode?'⛏️ Csákány elővéve (klikk: ütés · C: vissza a fegyverhez)':'🔫 Fegyver elővéve');setScope(false)}else if(k==='0'){G.pickMode=true;setScope(false)}else if('12345'.includes(k)&&G.pickMode)G.pickMode=false});
addEventListener('wheel',()=>{if(G&&G.brMode&&G.pickMode)G.pickMode=false});
{const o=window.sht;window.sht=function(){const g=G;if(g&&g.brMode&&g.pickMode){window._HARV();return}return o.apply(this,arguments)}}
// ---------- távcső ----------
const sc=document.createElement('div');sc.id='scopeO';sc.style.cssText='position:fixed;inset:0;display:none;z-index:5;pointer-events:none;background:radial-gradient(circle at 50% 50%,transparent 0 31vmin,#000 31.3vmin)';
sc.innerHTML='<svg viewBox="-100 -100 200 200" style="position:absolute;left:50%;top:50%;width:62vmin;height:62vmin;transform:translate(-50%,-50%)"><circle r="99" fill="none" stroke="#111" stroke-width="3"/><line x1="-99" y1="0" x2="-6" y2="0" stroke="#000" stroke-width="1"/><line x1="6" y1="0" x2="99" y2="0" stroke="#000" stroke-width="1"/><line x1="0" y1="-99" x2="0" y2="-6" stroke="#000" stroke-width="1"/><line x1="0" y1="6" x2="0" y2="99" stroke="#000" stroke-width="1"/><line x1="-99" y1="0" x2="-60" y2="0" stroke="#000" stroke-width="4"/><line x1="60" y1="0" x2="99" y2="0" stroke="#000" stroke-width="4"/><line x1="0" y1="60" x2="0" y2="99" stroke="#000" stroke-width="4"/>'+[15,30,45].map(y=>'<line x1="-5" y1="'+y+'" x2="5" y2="'+y+'" stroke="#000" stroke-width="1"/>').join('')+'<circle r="1.4" fill="#ef4444"/></svg><div style="position:absolute;left:50%;bottom:16vh;transform:translateX(-50%);color:#fff;font:700 15px Rajdhani,Arial;text-shadow:0 1px 3px #000">🎯 4x · jobb klikk: kilépés</div>';
document.body.appendChild(sc);
let scoped=false;function setScope(v){scoped=!!v;sc.style.display=scoped?'block':'none';const ch=document.getElementById('prX');if(ch)ch.style.visibility=scoped?'hidden':''}
window._scope=()=>scoped;
const canScope=()=>G&&run&&G.fp&&G.wp===2&&G.own[2]&&!G.pickMode&&!G.buildMode&&G.phase==='play'&&!G.reloading;
addEventListener('contextmenu',e=>{if(G&&run)e.preventDefault()});
addEventListener('mousedown',e=>{if(e.button===2&&G&&run){if(scoped)setScope(false);else if(canScope()){setScope(true);try{tn(1400,'square',.03)}catch(x){}}else if(G.wp===2&&!G.fp)say('🎯 Távcsőhöz válts első személyű nézetre (V)')}});
// távcsőben lassabb célzás: a fő egérkezelő után korrigálunk
document.addEventListener('mousemove',e=>{if(scoped&&G&&document.pointerLockElement){G.ang-=e.movementX*.0025*SET.sens*.75;G.pit=Math.max(-1.5,Math.min(1.5,G.pit+e.movementY*.002*SET.sens*.75))}});
const WPf=(n,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{post(arguments)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
WPf('update',a=>{const g=G,dt=a[0];hcd=Math.max(0,hcd-dt);if(!g)return;if(scoped&&!canScope())setScope(false);
 const tf=scoped?SET.fov/4:SET.fov;if(Math.abs(cam.fov-tf)>.05){cam.fov+=(tf-cam.fov)*Math.min(1,dt*18);cam.updateProjectionMatrix()}
 if(g.gun){if(scoped)g.gun.visible=false;else if(g.brMode&&g.pickMode)g.gun.visible=false}
 if(g.brMode&&(g.pickMode||!g.own[g.wp])){const am=document.getElementById('brAmmo');if(am&&!g.buildMode)am.innerHTML='<b style="font-size:26px">⛏️ '+(window.BR?BR.mats:0)+'</b><i>Csákány – klikk: fa/épület kiütése · C: fegyver'+(g.own[g.wp]?'':' (nincs)')+'</i>'}});
['launch','end'].forEach(n=>WPf(n,()=>{setScope(false);inst=null}));

// ---------- csákány modell a kézben ----------
let pax=null;function mkPax(){const g=new THREE.Group();const h=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,.9,8),new THREE.MeshStandardMaterial({color:0x6b4423,roughness:.8}));g.add(h);
 const wrap=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.22,8),new THREE.MeshStandardMaterial({color:0x1f2937,roughness:.9}));wrap.position.y=-.3;g.add(wrap);
 const hm=new THREE.MeshStandardMaterial({color:0x9ca3af,metalness:.9,roughness:.3});const head=new THREE.Mesh(new THREE.BoxGeometry(.1,.12,.16),hm);head.position.y=.42;g.add(head);
 [-1,1].forEach(d=>{const sp=new THREE.Mesh(new THREE.ConeGeometry(.05,.42,8),hm);sp.rotation.x=d*Math.PI/2;sp.position.set(0,.42,d*.27);sp.rotation.z=0;g.add(sp)});
 const gl=new THREE.Mesh(new THREE.BoxGeometry(.11,.04,.17),new THREE.MeshStandardMaterial({color:0xffd23f,emissive:0xffa500,emissiveIntensity:.6}));gl.position.y=.5;g.add(gl);
 g.scale.setScalar(.5);g.position.set(.34,-.3,-.62);g.rotation.set(.35,.2,-.25);return g}
// ---------- 0-s slot a hotbaron ----------
const css=document.createElement('style');css.textContent='#slP.on{outline:2px solid #ffd23f}';document.head.appendChild(css);
WPf('invUI',()=>{const g=G;if(!g)return;const sl=document.querySelector('.sl');if(!sl)return;const par=sl.parentNode;let p=document.getElementById('slP');
 if(!g.brMode){if(p)p.remove();return}if(!p||p.parentNode!==par){if(p)p.remove();p=document.createElement('div');p.id='slP';p.className='sl';p.innerHTML='<b>0</b>⛏️';p.onclick=()=>{G.pickMode=true};par.insertBefore(p,par.firstChild)}
 const on=g.pickMode||!g.own[g.wp];p.classList.toggle('on',on);par.querySelectorAll('.sl').forEach(e=>{if(e!==p&&on)e.classList.remove('on')})});
// ---------- tetőre szállás: az épületek teteje járható ----------
{const o=window.floorH;window.floorH=function(q){let h=o(q);if(q===G&&G&&G.brMode){for(const c of G.col){if(!c.h||c.tmpW||c.tmp||c.r<1.2||c.h>60)continue;if(c.h>q.y+.65||c.h<=h)continue;
 const inside=c.hw?(()=>{const[lx,lz]=boxLocal(c,q.x,q.z);return Math.abs(lx)<c.hw&&Math.abs(lz)<c.hd})():Math.hypot(q.x-c.x,q.z-c.z)<c.r*.92;if(inside){h=c.h;q.sp=null}}}return h}}
// ---------- esési sebzés ----------
let pvy=0,pgl=false,py=0;
WPf('update',()=>{const g=G;if(!g||!g.brMode||g.phase!=='play'||g.over)return;
 if(pvy<-17&&!pgl&&g.vy===0&&g.y<py){const d=Math.round((-pvy-17)*5.5);if(d>0){const inv=g.ef.find(x=>x.k==='inv');if(inv&&inv.t>9000){}else{const sh=g.sh;g.sh=0;hurt(d);g.sh=sh}ftx(g.x,g.z,'-'+d+' 💥 ESÉS','');try{sfx('hit')}catch(e){}g.shake=Math.max(g.shake||0,.5)}}
 pvy=g.vy;pgl=!!g.gl;py=g.y;
 // csákány megjelenítése + suhintás
 if(!pax){pax=mkPax();cam.add(pax)}if(pax.parent!==cam)cam.add(pax);const show=g.fp&&(g.pickMode||!g.own[g.wp])&&!g.buildMode;pax.visible=show;if(!g._tpPax||g._tpPax.parent!==g.pm){g._tpPax=mkPax();g._tpPax.scale.setScalar(1.1);g._tpPax.position.set(.75,1.15,-.25);g.pm.add(g._tpPax)}const tsh=!g.fp&&(g.pickMode||!g.own[g.wp])&&!g.buildMode;g._tpPax.visible=tsh;if(tsh){const sw2=Math.max(0,g.swing||0),k2=sw2>0?Math.sin((1-sw2/.25)*Math.PI):0;g._tpPax.rotation.set(-.6-k2*1.6,0,-.2)}
 if(show){const sw=Math.max(0,g.swing||0);g.swing=Math.max(0,sw-1/60);const k=Math.sin((1-sw/.25)*Math.PI)*(sw>0?1:0);pax.rotation.set(.35-k*1.4,.2,-.25-k*.3);pax.position.set(.34-k*.08,-.3+k*.04,-.62-k*.1)}
 try{invUI()}catch(e){}});
['launch'].forEach(n=>WPf(n,()=>{pax=null;pvy=0}));
// meccs vége csak egyszer fusson (duplán megjelenő eredménypanel ellen)
{const o=window.end;window.end=function(){if(G&&G._endDone)return;if(G)G._endDone=1;return o.apply(this,arguments)}}
})();
