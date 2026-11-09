// extra140a.js – FEGYVEREK & LÖVÉSZET II (x14a)
// ritkaság-bónusz+izzás, fejlesztő pad, számszeríj (mesterlövész-slot variáns, ívelt nyíl), robbanó hordók,
// lőszertípusok (Ű), mozgás-szórás célkereszt, fegyverdobás (Í), lövészet-statisztika, lőtér-kihívás (train), inspect (Ú). Panel: F2
(function(){
'use strict';
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.warn('x14a: nincs '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error('x14a '+n,e)}return r}};
const LS=(k,d)=>{try{const v=localStorage.getItem('k3x14a'+k);return v?JSON.parse(v):d}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem('k3x14a'+k,JSON.stringify(v))}catch(e){}};
const ok=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const RN=['KÖZÖNSÉGES','RITKA','EPIKUS','LEGENDÁS','MÍTIKUS'],RC=[0xb0b8c4,0x4ade80,0x60a5fa,0xc084fc,0xfbbf24],RH=['#b0b8c4','#4ade80','#60a5fa','#c084fc','#fbbf24'];
const RMUL=[1,1.1,1.2,1.32,1.45];
const AMMO=[{n:'Sima',e:'⚪',c:0xffffff,h:'#e5e7eb',d:'normál sebzés'},{n:'Páncéltörő',e:'🔷',c:0x38bdf8,h:'#38bdf8',d:'+1 átütés, −10% sebzés'},{n:'Gyújtó',e:'🔥',c:0xf97316,h:'#f97316',d:'3 mp égés, −15% sebzés'}];
const X={ammo:LS('Ammo',0)|0,st:{sh:0,hi:0,hs:0},life:LS('Life',{sh:0,hi:0,hs:0,m:0,best:0}),rec:LS('Rng',0),bar:[],pads:[],drops:[],rng:null,ins:0,mv:0,lx:0,lz:0};
window._x14a=X;X.near=()=>near;
const rar=i=>{const g=G;if(g.ry&&g.ry.rar)return Math.max(0,g.ry.rar[i]|0);return Math.max(0,(g._x14r||[])[i]|0)};
const setRar=(i,r)=>{const g=G;if(g.ry&&g.ry.rar)g.ry.rar[i]=r;else{g._x14r=g._x14r||[];g._x14r[i]=r}};
// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
.x14aBtn{display:flex;align-items:center;gap:6px;padding:7px 11px;border-radius:12px;border:1px solid #fbbf2477;background:linear-gradient(135deg,#1e1b4bdd,#581c87cc);color:#fde68a;font:700 13px Rajdhani,Arial;cursor:pointer;box-shadow:0 4px 18px #7c3aed55;backdrop-filter:blur(8px);transition:transform .15s}
.x14aBtn:hover{transform:translateX(-3px) scale(1.04);box-shadow:0 4px 24px #fbbf2466}
#x14aP{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.96);opacity:0;z-index:60;width:min(560px,92vw);max-height:86vh;overflow:auto;padding:18px 20px;border-radius:20px;background:linear-gradient(160deg,#0f0a1fee,#1e1033ee);border:1px solid #fbbf2455;box-shadow:0 20px 60px #000a,inset 0 0 40px #7c3aed22;backdrop-filter:blur(14px);color:#e9e3ff;font:500 14px Rajdhani,Arial;transition:.2s;display:none}
#x14aP.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
#x14aP h2{margin:0 0 10px;font-size:22px;background:linear-gradient(90deg,#fde68a,#fbbf24,#c084fc);-webkit-background-clip:text;color:transparent}
#x14aP h3{margin:12px 0 6px;color:#fbbf24;font-size:15px}
#x14aP .r{display:flex;gap:6px;flex-wrap:wrap}
#x14aP button{padding:6px 10px;border-radius:10px;border:1px solid #ffffff22;background:#ffffff10;color:#fff;font:700 13px Rajdhani,Arial;cursor:pointer}
#x14aP button.on{background:linear-gradient(135deg,#fbbf24,#a855f7);color:#160b2b;border-color:#fde68a}
#x14aP .k{display:inline-block;padding:0 6px;border-radius:5px;background:#fbbf2433;color:#fde68a;font-weight:700}
#x14aX{position:fixed;left:50%;top:50%;pointer-events:none;z-index:5;display:none}
#x14aX i{position:absolute;background:#fff;box-shadow:0 0 3px #000;border-radius:2px;transition:transform .06s linear}
#x14aTip{position:fixed;left:50%;top:64%;transform:translateX(-50%);z-index:6;pointer-events:none;font:700 16px Rajdhani,Arial;color:#fde68a;text-shadow:0 2px 4px #000;display:none;padding:6px 12px;border-radius:10px;background:#1e1033aa;border:1px solid #fbbf2455}
#x14aHud{position:fixed;right:14px;bottom:150px;z-index:5;pointer-events:none;font:700 13px Rajdhani,Arial;color:#fff;text-align:right;text-shadow:0 1px 3px #000;display:none}
#x14aHud b{padding:2px 7px;border-radius:7px;background:#0008;margin-left:4px}
#x14aRT{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:6;pointer-events:none;font:800 26px Rajdhani,Arial;color:#fde68a;text-shadow:0 0 12px #a855f7;display:none}
#x14aEnd{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:70;padding:14px 22px;border-radius:16px;background:linear-gradient(135deg,#1e1b4bf0,#3b0764f0);border:1px solid #fbbf2488;color:#fff;font:600 15px Rajdhani,Arial;box-shadow:0 10px 40px #000a;text-align:center;animation:x14aIn .4s}
@keyframes x14aIn{from{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%,0)}}
`;document.head.appendChild(css);
const el=(t,id,h)=>{const e=document.createElement(t);if(id)e.id=id;if(h)e.innerHTML=h;document.body.appendChild(e);return e};
const xh=el('div','x14aX');for(let i=0;i<4;i++)xh.appendChild(document.createElement('i'));
const tip=el('div','x14aTip'),hud=el('div','x14aHud'),rt=el('div','x14aRT');
// ---------- hub gomb + panel ----------
function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!document.getElementById('x14aB')){const b=document.createElement('div');b.id='x14aB';b.className='x14aBtn';b.innerHTML='🎯 Fegyverek';b.title='Fegyverek & lövészet (F2)';b.onclick=()=>panel(true);h.appendChild(b)}return h}
const P=el('div','x14aP');
function panel(on){if(on===undefined)on=!P.classList.contains('on');if(on){draw();P.style.display='block';requestAnimationFrame(()=>P.classList.add('on'));if(document.pointerLockElement)document.exitPointerLock()}else{P.classList.remove('on');setTimeout(()=>{if(!P.classList.contains('on'))P.style.display='none'},200)}}
function pct(a,b){return b?Math.round(100*Math.min(1,a/b)):0}
function draw(){const L=X.life,inM=ok(),tr=window.GAME_MODE==='train';
 P.innerHTML=`<h2>🎯 FEGYVEREK & LÖVÉSZET</h2>
 <h3>Lőszertípus <span class="k">Ű</span></h3><div class="r">${AMMO.map((a,i)=>`<button data-a="${i}" class="${X.ammo===i?'on':''}">${a.e} ${a.n}<br><small>${a.d}</small></button>`).join('')}</div>
 ${inM&&G.own&&G.own[2]?`<h3>Mesterlövész-slot</h3><div class="r"><button data-xb="0" class="${!G._x14xb?'on':''}">🎯 Mesterlövész</button><button data-xb="1" class="${G._x14xb?'on':''}">🏹 Számszeríj</button></div>`:''}
 <h3>🏹 Lőtér-kihívás (edzőpálya)</h3><div>Rekord: <b style="color:#fde68a">${X.rec?X.rec.toFixed(2)+' mp':'—'}</b> · 10 céltábla időre</div>
 ${inM&&tr?'<div class="r" style="margin-top:6px"><button data-rng="1">▶ Indítás</button></div>':'<small style="opacity:.7">Indítsd az edzőpályán (E a dobogónál vagy itt).</small>'}
 <h3>📊 Összesített lövészet</h3><div>Meccs: ${L.m} · Lövés: ${L.sh} · Találat: ${L.hi} · <b>Pontosság ${pct(L.hi,L.sh)}%</b> · <b>Fejlövés ${pct(L.hs,L.hi)}%</b> · Legjobb pontosság: ${L.best}%</div>
 ${inM?`<div style="margin-top:4px;opacity:.85">Ez a meccs: ${X.st.sh} lövés, ${pct(X.st.hi,X.st.sh)}% pontosság, ${pct(X.st.hs,X.st.hi)}% fejlövés</div>`:''}
 <h3>Billentyűk</h3><div><span class="k">F2</span> panel · <span class="k">Ű</span> lőszer váltás · <span class="k">Í</span> fegyver eldobása · <span class="k">Ú</span> fegyver-ellenőrzés · <span class="k">E</span> fejlesztő pad / felvétel / lőtér</div>
 <div style="margin-top:6px;opacity:.75;font-size:12px">Ritkaság: ${RN.map((n,i)=>`<b style="color:${RH[i]}">${n}</b>`).join(' · ')} – magasabb = több sebzés, kisebb szórás, gyorsabb töltés. Robbanó hordók: lődd meg őket, láncreakció!</div>
 <div class="r" style="justify-content:flex-end;margin-top:10px"><button data-c="1">Bezárás</button></div>`;
 P.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(b.dataset.a)setAmmo(+b.dataset.a);if(b.dataset.xb)setXB(b.dataset.xb==='1');if(b.dataset.rng){panel(false);startRange();return}if(b.dataset.c){panel(false);return}draw()})}
function setAmmo(i){X.ammo=i;SV('Ammo',i);if(ok())say(AMMO[i].e+' Lőszer: '+AMMO[i].n)}
// ---------- számszeríj (a mesterlövész-slot variánsa) ----------
let SN=null;const XB={e:'🏹',n:'KÖZMUNKA-SZÁMSZERÍJ',mag:1,res:20,rt:1.4,spr:0,spd:52,dmg:85,cd:.9,col:0x8b5a2b,pellets:1};
function setXB(on){const g=G;if(!g)return;g._x14xb=!!on;if(ok())say(on?'🏹 Számszeríj élesítve (ívelt nyíl!)':'🎯 Mesterlövész vissza')}
function syncXB(){if(typeof WPN==='undefined'||!WPN[2])return;if(!SN)SN=Object.assign({},WPN[2]);const want=!!(G&&G._x14xb&&run);const w=WPN[2];
 if(want&&!w._x14){Object.keys(SN).forEach(k=>delete w[k]);Object.assign(w,XB,{_x14:1});if(G.mag[2]>1)G.mag[2]=1}
 else if(!want&&w._x14){Object.keys(w).forEach(k=>delete w[k]);Object.assign(w,SN)}}
let XBM=null;function xbModel(){const g=new THREE.Group();g.name='x14xb';const wd=new THREE.MeshStandardMaterial({color:0x6b4a2b,roughness:.7}),mt=new THREE.MeshStandardMaterial({color:0x9ca3af,metalness:.8,roughness:.3});
 const st=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,1.1),wd);st.position.z=-.5;g.add(st);
 [-1,1].forEach(s=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.5,.05,.06),mt);l.position.set(s*.27,0,-1);l.rotation.y=s*.35;g.add(l)});
 const sg=new THREE.Mesh(new THREE.BoxGeometry(.9,.01,.01),new THREE.MeshBasicMaterial({color:0xeeeeee}));sg.position.set(0,0,-.88);g.add(sg);
 const ar=new THREE.Mesh(new THREE.BoxGeometry(.03,.03,.7),new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0x7c2d12}));ar.position.set(0,.08,-.75);g.add(ar);return g}
// ---------- anyagok ----------
const MAT={};const mat=(c,o)=>MAT[c+(o?'e':'')]||(MAT[c+(o?'e':'')]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.45,metalness:.3},o||{})));
const GEO={arrow:new THREE.BoxGeometry(.05,.05,.8),bul:new THREE.SphereGeometry(.22,6,5),bar:new THREE.CylinderGeometry(.5,.5,1.3,12),ring:new THREE.RingGeometry(.55,.8,24),beam:new THREE.CylinderGeometry(.16,.16,10,8,1,true),pad:new THREE.CylinderGeometry(1.6,1.8,.25,24),tg:new THREE.CylinderGeometry(.8,.8,.08,20),fx:new THREE.SphereGeometry(1,12,8)};
// ---------- lövés hook: ritkaság, mozgás-szórás, lőszer, nyíl, statisztika ----------
let sprSave=null;
WP('sht',()=>{const g=G;if(!g||typeof WPN==='undefined')return null;X.ins=0;const w=WPN[g.wp];if(!w)return null;sprSave=[w,w.spr];w.spr=effSpr(g.wp);return g.bl.length},(a,s0)=>{
 const g=G;if(sprSave){sprSave[0].spr=sprSave[1];sprSave=null}if(s0==null||g.bl.length<=s0)return;
 const nb=g.bl.slice(s0),r=rar(g.wp),am=X.ammo,xb=g.wp===2&&g._x14xb;X.st.sh+=nb.length;
 nb.forEach(b=>{if(!g.brMode)b.d*=RMUL[r];if(xb){scene.remove(b.m);b.m=new THREE.Mesh(GEO.arrow,mat(0xfbbf24,{emissive:0x7c2d12}));b.m.position.set(b.x,b.y,b.z);scene.add(b.m);b.x14g=1;b.l=3.5;b.vy+=2.2}
  else if(am&&!b.boom){scene.remove(b.m);b.m=new THREE.Mesh(GEO.bul,mat(AMMO[am].c,{emissive:AMMO[am].c,emissiveIntensity:.9}));b.m.scale.setScalar(1);b.m.position.set(b.x,b.y,b.z);scene.add(b.m)}
  if(am===1){b.pierce=(b.pierce||0)+1;b.d*=.9}else if(am===2){b.d*=.85;b.x14f=1}})});
function effSpr(i){const w=WPN[i];if(!w)return 0;const base=w.spr||0,mf=movF();return (base||(mf>1.05?.03:0))*(1-.08*rar(i))*mf}
function movF(){const g=G;return 1+Math.min(1,X.mv/9)*.9+((g.y||0)>.6?.5:0)}
WP('reload',()=>{const g=G;if(!g||typeof WPN==='undefined')return null;const w=WPN[g.wp];if(!w)return null;const o=w.rt;w.rt=o*(1-.06*rar(g.wp));return[w,o]},(a,s)=>{if(s)s[0].rt=s[1]});
// találat / fejlövés / égés
WP('dmgE',a=>{const g=G;if(!g||g._hb===undefined||g._hb===null)return 0;const e=a[0];X.st.hi++;if(g._hb>.45*Math.max(1,(e&&e.r)||1))X.st.hs++;if(X.ammo===2&&e)e._x14b=3;return 1});
// ---------- robbanás hook: hordó láncreakció ----------
WP('boom',a=>{const x=a[0],z=a[1];X.bar.forEach(b=>{if(!b.dead&&b.fuse<=0&&Math.hypot(b.x-x,b.z-z)<5.5)b.fuse=.18+Math.random()*.15})});
function blast(x,z,y){const m=new THREE.Mesh(GEO.fx,new THREE.MeshBasicMaterial({color:0xff9a1f,transparent:true,opacity:.85,depthWrite:false}));m.position.set(x,(y||.6),z);scene.add(m);X.fx.push({m,t:0})}
X.fx=[];
function explodeBar(b){b.dead=1;b.m.visible=false;blast(b.x,b.z);const g=G,d=Math.hypot(g.x-b.x,g.z-b.z);if(d<6&&(g.y||0)<3)try{hurt(Math.round(35*(1-d/6))+5)}catch(e){}try{ftx(b.x,b.z,'💥 HORDÓ!','')}catch(e){}boom(b.x,b.z,45)}
// ---------- spawn ----------
function clearAll(){X.bar.forEach(b=>scene.remove(b.m));X.pads.forEach(p=>scene.remove(p.m));X.drops.forEach(d=>scene.remove(d.m));X.fx.forEach(f=>scene.remove(f.m));if(X.rng){X.rng.objs.forEach(o=>scene.remove(o));X.rng=null}X.bar=[];X.pads=[];X.drops=[];X.fx=[];rt.style.display='none'}
function freeSpot(r){for(let k=0;k<400;k++){const x=rnd(-290,290),z=rnd(-165,165);if(typeof hin==='function'&&!hin(x,z))continue;if(window.mapFree&&!mapFree(x,z,r||1.5))continue;if(G.col&&G.col.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+r))continue;return[x,z]}return null}
function addBar(x,z){const m=new THREE.Group();const c=new THREE.Mesh(GEO.bar,mat(0xb91c1c));c.position.y=.65;m.add(c);const s=new THREE.Mesh(new THREE.CylinderGeometry(.51,.51,.18,12),mat(0xfacc15,{emissive:0x854d0e,emissiveIntensity:.6}));s.position.y=.8;m.add(s);m.position.set(x,0,z);scene.add(m);X.bar.push({x,z,m,hp:30,fuse:0,dead:0})}
function addPad(x,z){const m=new THREE.Group();const p=new THREE.Mesh(GEO.pad,mat(0x2e1065,{emissive:0x7c3aed,emissiveIntensity:.5,metalness:.7}));p.position.y=.12;m.add(p);
 const r=new THREE.Mesh(new THREE.RingGeometry(1.2,1.6,32),new THREE.MeshBasicMaterial({color:0xfbbf24,transparent:true,opacity:.7,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.y=.27;m.add(r);
 const bm=new THREE.Mesh(GEO.beam,new THREE.MeshBasicMaterial({color:0xc084fc,transparent:true,opacity:.18,depthWrite:false}));bm.position.y=5;m.add(bm);
 const an=new THREE.Mesh(new THREE.OctahedronGeometry(.45),mat(0xfbbf24,{emissive:0xfbbf24,emissiveIntensity:.8,metalness:.9}));an.position.y=1.8;m.add(an);m.userData.an=an;m.userData.r=r;
 m.position.set(x,0,z);scene.add(m);X.pads.push({x,z,m})}
function dropModel(wi,r,xb){const m=new THREE.Group(),col=RC[r];const b=new THREE.Mesh(new THREE.BoxGeometry(1.2,.24,.2),mat(0x2a2d33,{metalness:.7}));b.position.y=.5;m.add(b);
 const st=new THREE.Mesh(new THREE.BoxGeometry(1.22,.05,.22),mat(col,{emissive:col,emissiveIntensity:.9}));st.position.y=.64;m.add(st);
 if(xb){const l=new THREE.Mesh(new THREE.BoxGeometry(.08,.06,1),mat(0x9ca3af,{metalness:.8}));l.position.set(.5,.5,0);m.add(l)}
 const ring=new THREE.Mesh(GEO.ring,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;m.add(ring);m.userData.ring=ring;
 if(r>=1){const bm=new THREE.Mesh(GEO.beam,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.1+r*.05,depthWrite:false}));bm.position.y=5;m.add(bm)}return m}
function addDrop(x,z,wi,r,mag,res,xb){const m=dropModel(wi,r,xb);m.position.set(x,0,z);scene.add(m);X.drops.push({x,z,wi,r,mag,res,xb,m,t:0})}
WP('launch',null,()=>{clearAll();const g=G;if(!g)return;X.st={sh:0,hi:0,hs:0};X.done=0;g._x14xb=false;g._x14r=[];X.mv=0;X.lx=g.x;X.lz=g.z;
 if(window.GAME_MODE==='train'){for(let i=0;i<5;i++)addBar(-14+i*1.6,-14-(i%2));addPad(8,-6);addDrop(-6,-5,2,3,1,20,1);buildRange()}
 else if(g.brMode||!window.GAME_MODE||window.GAME_MODE==='royale'){const nb=g.brMode?26:10;for(let i=0;i<nb;i++){const s=freeSpot(1.2);if(!s)continue;addBar(s[0],s[1]);if(Math.random()<.45){const a=Math.random()*6;addBar(s[0]+Math.cos(a)*1.4,s[1]+Math.sin(a)*1.4)}}
  for(let i=0;i<(g.brMode?4:2);i++){const s=freeSpot(2.5);if(s)addPad(s[0],s[1])}
  for(let i=0;i<(g.brMode?5:2);i++){const s=freeSpot(1.5);if(s)addDrop(s[0],s[1],2,Math.floor(Math.random()*4),1,15,1)}}});
// ---------- lőtér ----------
function buildRange(){const objs=[];const st=new THREE.Mesh(new THREE.BoxGeometry(1.2,1,1.2),mat(0x3b0764,{emissive:0x7c3aed,emissiveIntensity:.4}));st.position.set(-4,.5,5);scene.add(st);objs.push(st);
 const sign=new THREE.Mesh(GEO.fx,mat(0xfbbf24,{emissive:0xfbbf24,emissiveIntensity:1}));sign.scale.setScalar(.25);sign.position.set(-4,1.3,5);scene.add(sign);objs.push(sign);
 X.rng={objs,st:{x:-4,z:5},on:0,t:0,n:0,tg:null}}
function tgtMesh(){const g=new THREE.Group();[[.8,0xffffff],[.6,0xdc2626],[.4,0xffffff],[.2,0xdc2626]].forEach(([r,c],i)=>{const d=new THREE.Mesh(new THREE.CylinderGeometry(r,r,.08+i*.01,20),mat(c,{emissive:c,emissiveIntensity:.25}));d.rotation.x=Math.PI/2;g.add(d)});const p=new THREE.Mesh(new THREE.BoxGeometry(.08,2,.08),mat(0x444444));p.position.y=-1;g.add(p);return g}
function nextT(){const R=X.rng;if(R.tg)scene.remove(R.tg.m);if(R.n>=10){const t=R.t;R.on=0;R.tg=null;rt.innerHTML='🏁 '+t.toFixed(2)+' mp';const nr=!X.rec||t<X.rec;if(nr){X.rec=t;SV('Rng',t)}try{say(nr?'🏆 ÚJ LŐTÉR-REKORD: '+t.toFixed(2)+' mp!':'🎯 Kész: '+t.toFixed(2)+' mp (rekord '+X.rec.toFixed(2)+')');sfx(nr?'win':'buy')}catch(e){}setTimeout(()=>{if(!X.rng||!X.rng.on)rt.style.display='none'},3500);return}
 const x=rnd(-14,14),z=rnd(-34,-22),y=rnd(1.4,3.2),m=tgtMesh();m.position.set(x,y,z);scene.add(m);R.tg={x,y,z,m};R.n++}
function startRange(){if(!ok()||window.GAME_MODE!=='train'||!X.rng)return say&&say('🏹 A lőtér csak az edzőpályán érhető el');const R=X.rng;R.on=1;R.t=0;R.n=0;rt.style.display='block';say('🏹 LŐTÉR: lődd le a 10 céltáblát minél gyorsabban!');nextT()}
X.hitT=()=>{const R=X.rng;if(R&&R.on&&R.tg){try{sfx('coin')}catch(e){}nextT()}};
// ---------- E kezelés ----------
let near=null;const padCost=r=>window.GAME_MODE==='train'?0:[1500,3000,5000,8000][r];
function nearObj(){const g=G;near=null;let bd=2.4;for(const d of X.drops){const k=Math.hypot(d.x-g.x,d.z-g.z);if(k<bd){bd=k;near={k:'d',o:d}}}
 for(const p of X.pads){const k=Math.hypot(p.x-g.x,p.z-g.z);if(k<2.6&&k<bd+1){bd=k;near={k:'p',o:p}}}
 if(X.rng&&!X.rng.on&&Math.hypot(X.rng.st.x-g.x,X.rng.st.z-g.z)<Math.min(2.4,bd))near={k:'r'};return near}
{const ox=window.x20near;window.x20near=function(){try{if(ok()&&near)return true}catch(e){}return ox?ox.apply(this,arguments):false}}
function useNear(){const g=G,n=near;if(!n)return;
 if(n.k==='r')return startRange();
 if(n.k==='p'){const wi=g.wp;if(!g.own[wi])return say('🔧 Előbb legyen fegyver a kezedben!');const r=rar(wi);if(r>=4)return say('✨ Ez már MÍTIKUS!');const cost=padCost(r);if((g.cash||0)<cost){try{sfx('click')}catch(e){}return say('💸 Kell '+cost+' Ft a fejlesztéshez')}
  g.cash-=cost;setRar(wi,r+1);try{sfx('win');ftx(g.x,g.z,'⬆️ '+RN[r+1]+' '+WPN[wi].n,'')}catch(e){}say('🔧 Fejlesztve: '+RN[r+1]+' (−'+cost+' Ft)');return}
 if(n.k==='d'){const d=n.o;if(g.own[d.wi]&&!(d.wi===2&&d.xb!==!!g._x14xb)&&rar(d.wi)>=d.r){g.res[d.wi]=(g.res[d.wi]||0)+(d.res||0)+(d.mag||0);say('🔫 Lőszert vettél fel')}
  else{g.own[d.wi]=true;setRar(d.wi,d.r);g.wp=d.wi;g.pickMode=false;if(d.wi===2)g._x14xb=!!d.xb;syncXB();g.mag[d.wi]=d.mag;g.res[d.wi]=(g.res[d.wi]||0)+(d.res||0);say('🎒 Felvetted: '+RN[d.r]+' '+(d.xb?'🏹 SZÁMSZERÍJ':WPN[d.wi].e+' '+WPN[d.wi].n))}
  try{sfx('buy')}catch(e){}scene.remove(d.m);X.drops.splice(X.drops.indexOf(d),1);near=null}}
function dropGun(){const g=G;if(g.phase!=='play'||!g.own[g.wp]||g.buildMode)return;const wi=g.wp,xb=wi===2&&g._x14xb,r=rar(wi);
 const x=g.x+Math.cos(g.ang)*1.8,z=g.z+Math.sin(g.ang)*1.8;addDrop(x,z,wi,r,g.mag[wi]|0,g.res[wi]|0,xb);
 g.own[wi]=false;g.mag[wi]=0;g.res[wi]=0;if(wi===2)g._x14xb=false;setRar(wi,0);if(g.ry&&g.ry.rar)g.ry.rar[wi]=-1;
 for(let i=0;i<WPN.length;i++)if(g.own[i]){g.wp=i;break}say('🫳 Eldobtad: '+(xb?'🏹 számszeríj':WPN[wi].n));try{sfx('click')}catch(e){}}
function inspect(){const g=G;if(!g.gun||g.phase!=='play')return;if(X.ins>0)return;X.ins=1.8;X.r0=[g.gun.rotation.x,g.gun.rotation.y,g.gun.rotation.z];const r=rar(g.wp);say('🔍 '+(g.own[g.wp]?RN[r]+' '+(WPN[g.wp].n):'Csákány'))}
addEventListener('keydown',e=>{const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
 if(e.key==='F2'){e.preventDefault();hub();panel();return}
 if(!ok())return;const k=(e.key||'').toLowerCase();
 if(k==='e'&&near&&!e.repeat&&G.phase==='play'){e.stopImmediatePropagation();e.preventDefault();useNear();return}
 if(k==='ű'){setAmmo((X.ammo+1)%3);return}if(k==='í'){dropGun();return}if(k==='ú'){inspect();return}},true);
// ---------- update ----------
let tick=0;
WP('update',null,a=>{const g=G,dt=Math.min(.1,a[0]||0);if(!g||g.over)return;syncXB();
 const dx=g.x-X.lx,dz=g.z-X.lz;X.lx=g.x;X.lz=g.z;const sp=dt>0?Math.min(30,Math.hypot(dx,dz)/dt):0;X.mv+=(sp-X.mv)*Math.min(1,dt*8);
 // nyíl gravitáció
 for(const b of g.bl){if(b.x14g){b.vy-=13*dt;b.m.rotation.set(0,0,0);b.m.lookAt(b.x+b.vx,b.y+b.vy,b.z+b.vz)}}
 // hordók
 for(const br of X.bar){if(br.dead)continue;if(br.fuse>0){br.fuse-=dt;br.m.scale.setScalar(1+Math.sin(g.t*60)*.05);if(br.fuse<=0)explodeBar(br);continue}
  for(const b of g.bl){if(b.l>0&&Math.abs(b.x-br.x)<.9&&Math.abs(b.z-br.z)<.9&&b.y<1.7){if(b.boom){br.fuse=.05;break}br.hp-=b.d;if(!b.pierce)b.l=0;if(br.hp<=0){br.fuse=.05;break}}}}
 for(let i=X.fx.length-1;i>=0;i--){const f=X.fx[i];f.t+=dt;f.m.scale.setScalar(1+f.t*14);f.m.material.opacity=Math.max(0,.85-f.t*2.4);if(f.t>.38){scene.remove(f.m);f.m.material.dispose();X.fx.splice(i,1)}}
 // pad + drop anim
 X.pads.forEach(p=>{p.m.userData.an.rotation.y+=dt*2;p.m.userData.an.position.y=1.8+Math.sin(g.t*2)*.2;p.m.userData.r.material.opacity=.45+Math.sin(g.t*3)*.25});
 X.drops.forEach(d=>{d.t+=dt;d.m.rotation.y+=dt;d.m.userData.ring.material.opacity=.35+Math.sin(g.t*3+d.x)*.25});
 // égés
 if((tick+=dt)>.5){tick=0;for(const e of g.en){if(e._x14b>0&&!e.dead){e._x14b-=.5;try{dmgE(e,4,false);ftx(e.x,e.z,'🔥4','')}catch(er){}}}
  // botok felveszik az eldobott fegyvert
  for(let i=X.drops.length-1;i>=0;i--){const d=X.drops[i];if(d.t<3)continue;const e=g.en.find(e=>!e.dead&&Math.hypot(e.x-d.x,e.z-d.z)<1.5);if(e){try{ftx(d.x,d.z,'🤖 felvette: '+RN[d.r],'')}catch(er){}e._x14gun=d.r;scene.remove(d.m);X.drops.splice(i,1)}}}
 // lőtér
 const R=X.rng;if(R&&R.on){R.t+=dt;rt.style.display='block';rt.innerHTML='🏹 '+R.t.toFixed(2)+' mp · '+(R.n-1)+'/10';const T=R.tg;if(T){for(const b of g.bl){if(b.l>0&&Math.hypot(b.x-T.x,b.y-T.y,b.z-T.z)<1){b.l=0;X.hitT();break}}}}
 // E-tipp
 if(g.phase==='play'){const n=nearObj();if(n){tip.style.display='block';tip.innerHTML=n.k==='r'?'[E] 🏹 Lőtér-kihívás indítása · rekord '+(X.rec?X.rec.toFixed(2)+' mp':'—'):n.k==='p'?(g.own[g.wp]?(rar(g.wp)>=4?'✨ MÍTIKUS – nincs több fejlesztés':'[E] 🔧 Fejlesztés → <b style="color:'+RH[rar(g.wp)+1]+'">'+RN[rar(g.wp)+1]+'</b> · '+(padCost(rar(g.wp))?padCost(rar(g.wp))+' Ft':'ingyen (edzés)')):'🔧 Fejlesztő pad – vegyél elő fegyvert'):'[E] <b style="color:'+RH[n.o.r]+'">'+RN[n.o.r]+'</b> '+(n.o.xb?'🏹 SZÁMSZERÍJ':WPN[n.o.wi].e+' '+WPN[n.o.wi].n)}else tip.style.display='none'}else{tip.style.display='none';near=null}
 // inspect
 if(X.ins>0&&g.gun){X.ins-=dt;const p=1-Math.max(0,X.ins)/1.8,r0=X.r0;const e=p<.5?p*2:1-(p-.5)*2;g.gun.rotation.set(r0[0]+Math.sin(p*Math.PI)*.35,r0[1]+Math.sin(p*Math.PI*2)*1.1,r0[2]+e*.9);if(X.ins<=0)g.gun.rotation.set(r0[0],r0[1],r0[2])}
 // számszeríj modell
 if(g.gun){if(!XBM||XBM.parent!==g.gun){XBM=XBM||xbModel();g.gun.add(XBM)}const on=g.wp===2&&g._x14xb&&g.own[2];XBM.visible=on;if(on)g.gun.children.forEach(c=>{if(c!==XBM&&c.name==='x60m')c.visible=false})}
 // célkereszt + hud
 const show=g.phase==='play'&&!g.buildMode&&g.own[g.wp];xh.style.display=show?'block':'none';
 if(show){const s=effSpr(g.wp),gap=6+Math.min(60,s*420);const L=xh.children;L[0].style.cssText=`width:2px;height:9px;left:-1px;top:${-gap-9}px`;L[1].style.cssText=`width:2px;height:9px;left:-1px;top:${gap}px`;L[2].style.cssText=`width:9px;height:2px;top:-1px;left:${-gap-9}px`;L[3].style.cssText=`width:9px;height:2px;top:-1px;left:${gap}px`;const c=RH[rar(g.wp)];for(const i of L)i.style.background=c}
 hud.style.display=g.phase==='play'?'block':'none';if(g.phase==='play'){const r=rar(g.wp),s=AMMO[X.ammo].e+' '+AMMO[X.ammo].n+'|'+r+'|'+(g.wp===2&&g._x14xb);if(hud._s!==s){hud._s=s;hud.innerHTML=`<b style="color:${AMMO[X.ammo].h}">${AMMO[X.ammo].e} ${AMMO[X.ammo].n}</b><b style="color:${RH[r]}">${RN[r]}</b>${g.wp===2&&g._x14xb?'<b>🏹</b>':''}`}}});
// ---------- meccs vége: statisztika ----------
WP('end',null,()=>{if(X.done)return;X.done=1;const s=X.st,L=X.life;clearAll();xh.style.display='none';tip.style.display='none';hud.style.display='none';syncXB();if(!s.sh)return;
 L.sh+=s.sh;L.hi+=s.hi;L.hs+=s.hs;L.m++;const ac=pct(s.hi,s.sh),hp=pct(s.hs,s.hi);const nb=ac>L.best&&s.sh>=10;if(nb)L.best=ac;SV('Life',L);
 const d=el('div','x14aEnd',`<div style="font-size:20px;font-weight:800;background:linear-gradient(90deg,#fde68a,#c084fc);-webkit-background-clip:text;color:transparent">🎯 LÖVÉSZET-STATISZTIKA</div>
 <div style="display:flex;gap:18px;justify-content:center;margin:8px 0"><div><b style="font-size:26px;color:#fde68a">${ac}%</b><br>pontosság</div><div><b style="font-size:26px;color:#c084fc">${hp}%</b><br>fejlövés</div><div><b style="font-size:26px">${s.sh}</b><br>lövés / ${s.hi} találat</div></div>${nb?'<div style="color:#4ade80">🏆 Új legjobb pontosság!</div>':''}<small style="opacity:.7">kattints a bezáráshoz</small>`);
 d.style.pointerEvents='auto';d.style.cursor='pointer';d.onclick=()=>d.remove();setTimeout(()=>d.remove(),9000)});
// ---------- hub láthatóság ----------
setInterval(()=>{const h=hub(),r=typeof run!=='undefined'&&run;h.style.display=r?'none':'flex';if(!r){xh.style.display='none';tip.style.display='none';hud.style.display='none'}},500);
})();
