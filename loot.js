// ===== BATTLE ROYALE ZSÁKMÁNY: fegyver nélkül indulsz, 100 tárgy a földön + ládák =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const N=100;
const RAR=[{n:'KÖZÖNSÉGES',c:0xb0b8c4,h:'#b0b8c4'},{n:'RITKA',c:0x4ade80,h:'#4ade80'},{n:'EPIKUS',c:0x60a5fa,h:'#60a5fa'},{n:'LEGENDÁS',c:0xc084fc,h:'#c084fc'},{n:'MÍTIKUS',c:0xfbbf24,h:'#fbbf24'}];
const rollRar=()=>{const r=Math.random();return r<.38?0:r<.66?1:r<.86?2:r<.96?3:4};
// tárgytípusok: [típus, súly]
const TYPES=[['weapon',34],['ammo',20],['medkit',12],['shieldS',12],['shieldB',6],['beer',8],['mats',8]];
const pickType=()=>{let t=Math.random()*TYPES.reduce((a,b)=>a+b[1],0);for(const[k,w]of TYPES){if((t-=w)<=0)return k}return 'ammo'};
const MM={};const mm=(c,o)=>{const k=c+JSON.stringify(o||{});return MM[k]||(MM[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.4,metalness:.3},o||{})))};
function model(t,wi,rar){const g=new THREE.Group();const B=(w,h,d,c,x,y,z,o)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mm(c,o));m.position.set(x,y,z);g.add(m);return m};
 if(t==='weapon'){const col=RAR[rar].c;B(1.4,.28,.22,0x2a2d33,0,.55,0,{metalness:.7});B(.7,.06,.06,0x555b66,.95,.6,0,{metalness:.9});B(.35,.32,.2,0x6b4a2b,-.75,.5,0,{metalness:0,roughness:.7});B(.14,.34,.16,0x151515,-.1,.32,0);B(.12,.3,.18,0x2a2d33,.25,.3,0);
  B(1.42,.06,.24,col,0,.7,0,{emissive:col,emissiveIntensity:.8});g.userData.spin=1}
 else if(t==='ammo'){B(.8,.45,.5,0x3f6212,0,.25,0);B(.82,.08,.52,0xfacc15,0,.5,0);for(let i=0;i<3;i++)B(.08,.25,.08,0xd4af37,-.2+i*.2,.62,0,{metalness:.9})}
 else if(t==='medkit'){B(.8,.5,.5,0xf8fafc,0,.25,0);B(.12,.32,.52,0xdc2626,0,.28,0);B(.32,.12,.52,0xdc2626,0,.28,0);B(.3,.08,.08,0x9ca3af,0,.55,0)}
 else if(t==='shieldS'||t==='shieldB'){const big=t==='shieldB',s=big?1.3:.8;const b=new THREE.Mesh(new THREE.CylinderGeometry(.18*s,.24*s,.6*s,14),mm(0x38bdf8,{transparent:true,opacity:.8,emissive:0x0ea5e9,emissiveIntensity:.8,roughness:.1}));b.position.y=.3*s;g.add(b);const n=new THREE.Mesh(new THREE.CylinderGeometry(.08*s,.12*s,.2*s,12),mm(0xe5e7eb));n.position.y=.7*s;g.add(n)}
 else if(t==='beer'){const b=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,.6,12),mm(0x92400e,{transparent:true,opacity:.85,roughness:.1}));b.position.y=.3;g.add(b);const n=new THREE.Mesh(new THREE.CylinderGeometry(.07,.12,.25,10),b.material);n.position.y=.72;g.add(n)}
 else if(t==='mats'){for(let i=0;i<3;i++){const p=B(1.1,.12,.32,0x8b5a2b,0,.1+i*.13,(i-1)*.05);p.rotation.y=i*.25}}
 // fény a földön + fénycsóva (a ritkaság színével)
 const col=t==='weapon'?RAR[rar].c:t==='medkit'?0xef4444:t.startsWith('shield')?0x38bdf8:t==='ammo'?0xa3e635:0xfde68a;
 const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.8,24),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);
 if(t==='weapon'&&rar>=2){const beam=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,14,8,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.22,depthWrite:false}));beam.position.y=7;g.add(beam)}
 g.traverse(o=>{if(o.isMesh)o.castShadow=false});return g}
let L=[];
function label(t,wi,rar){return t==='weapon'?RAR[rar].n+' '+WPN[wi].e+' '+WPN[wi].n:({ammo:'🔫 Lőszer',medkit:'❤️ Medkit',shieldS:'🛡️ Kis pajzsital (+25)',shieldB:'🛡️ Nagy pajzsital (+50)',beer:'🍺 Sör',mats:'🪵 Építőanyag (+60)'})[t]}
function chestModel(){const g=new THREE.Group();const W=mm(0x7c4a1e,{metalness:0,roughness:.75}),Gd=mm(0xd4a017,{metalness:.9,roughness:.25});
 const base=new THREE.Mesh(new THREE.BoxGeometry(1.3,.7,.85),W);base.position.y=.35;g.add(base);
 [-.6,.6].forEach(x=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.08,.72,.88),Gd);b.position.set(x,.36,0);g.add(b)});
 const lid=new THREE.Group();lid.position.set(0,.7,-.42);const lm=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,1.3,14,1,false,0,Math.PI),W);lm.rotation.z=Math.PI/2;lm.position.z=.42;lid.add(lm);
 const lk=new THREE.Mesh(new THREE.BoxGeometry(.2,.26,.08),Gd);lk.position.set(0,-.02,.86);lid.add(lk);g.add(lid);g.userData.lid=lid;
 const glow=new THREE.PointLight(0xffd23f,1.2,7);glow.position.y=1.2;g.add(glow);g.userData.glow=glow;
 const ring=new THREE.Mesh(new THREE.RingGeometry(.9,1.15,28),new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);g.userData.ring=ring;
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
function spawnLoot(){const g=G;L.forEach(l=>scene.remove(l.m));L=[];let n=0;for(let k=0;k<3000&&n<N;k++){const x=rnd(-300,300),z=rnd(-170,170);if(!hin(x,z))continue;if(window.mapFree&&!mapFree(x,z,1.4))continue;if(g.col&&g.col.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+1.2))continue;if(L.some(l=>Math.hypot(l.x-x,l.z-z)<7))continue;
  const m=chestModel();m.position.set(x,0,z);m.rotation.y=Math.random()*6;scene.add(m);L.push({t:'chest',x,z,m,ph:Math.random()*6,open:0,ht:0});n++}
 return n}
window._LOOT=()=>L;window._lootApply=(t,wi,rar)=>apply({t,wi,rar,x:G.x,z:G.z});window._lootLabel=label;window._RAR=RAR;
window._addChest=(x,z,sup)=>{const m=chestModel();if(sup){m.scale.setScalar(1.4);if(m.userData.glow&&m.userData.glow.color)m.userData.glow.color.setHex(0x60a5fa)}m.position.set(x,0,z);scene.add(m);L.push({t:'chest',x,z,m,ph:0,open:0,ht:0,sup})};
function apply(l,q){const g=G;
 if(l.t==='weapon'){const cur=g.own[l.wi]?(g.ry?g.ry.rar[l.wi]:0):-1;if(l.rar>cur){g.own[l.wi]=true;if(g.ry)g.ry.rar[l.wi]=l.rar;g.wp=l.wi;g.mag[l.wi]=WPN[l.wi].mag;g.res[l.wi]=Math.max(g.res[l.wi]||0,Math.round(WPN[l.wi].res*.6))}else{g.res[l.wi]=(g.res[l.wi]||0)+Math.round(WPN[l.wi].res*.5)}}
 else if(l.t==='ammo'){for(let i=0;i<5;i++)if(g.own[i])g.res[i]=(g.res[i]||0)+Math.round(WPN[i].res*.5)}
 else if(l.t==='medkit')g.inv.hp++;else if(l.t==='beer')g.inv.beer++;
 else if(l.t==='shieldS')g.sh=Math.min(g.msh,g.sh+25);else if(l.t==='shieldB')g.sh=Math.min(g.msh,g.sh+50);
 else if(l.t==='mats'&&window.BR)BR.mats=(BR.mats||0)+60;
 try{sfx(l.t==='weapon'&&l.rar>=3?'win':'buy')}catch(e){}if(!q)ftx(l.x,l.z,label(l.t,l.wi,l.rar),'')}
// kinyitott láda: 3-4 tárgy kipattan és lassan forog a földön, amíg fel nem veszed (E)
let DROPS=[];window._DROPS=()=>DROPS;
function cashModel(){const g=new THREE.Group();for(let i=0;i<4;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(.7,.06,.35),mm(0x22c55e,{emissive:0x14532d,emissiveIntensity:.5,metalness:0}));b.position.set(0,.3+i*.07,0);b.rotation.y=i*.3;g.add(b)}
 const band=new THREE.Mesh(new THREE.BoxGeometry(.12,.32,.37),mm(0xfacc15,{metalness:.6}));band.position.y=.4;g.add(band);
 const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.8,24),new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;g.add(ring);return g}
function dropItem(c,t,wi,rar,k,n){const a=(c.m.rotation.y||0)+(k-(n-1)/2)*.75,r=1.9;const x=c.x+Math.sin(a)*r,z=c.z+Math.cos(a)*r;
 const m=t==='cash'?cashModel():model(t,wi,rar);m.position.set(c.x,.8,c.z);scene.add(m);const d={t,wi,rar,x,z,m,ph:Math.random()*6,fly:0,sx:c.x,sz:c.z,v:t==='cash'?Math.round(rnd(400,1500)):0};DROPS.push(d)}
function openChest(c){c.open=1;const it=[];
 it.push(['weapon',pick([0,1,1,2,3,4]),rollRar()]);if(c.sup)it.push(['weapon',pick([1,2,3]),4]);else if(Math.random()<.3)it.push(['weapon',pick([0,1,2,3,4]),rollRar()]);
 it.push(['ammo']);const ex=['medkit','shieldS','shieldB','beer','mats','ammo','cash','cash','shieldS','medkit'];const want=3+(Math.random()<.5?1:0)+(c.sup?1:0);while(it.length<want)it.push([pick(ex)]);
 it.forEach((x,k)=>dropItem(c,x[0],x[1],x[2],k,it.length));
 try{sfx('win')}catch(e){}if(c.m.userData.glow)c.m.userData.glow.intensity=0;c.m.userData.ring.visible=false}
function takeDrop(d){if(d.t==='cash'){G.cash+=d.v;ftx(d.x,d.z,'+'+d.v+' Ft közpénz','');try{sfx('coin')}catch(e){}}else apply({t:d.t,wi:d.wi,rar:d.rar,x:d.x,z:d.z});scene.remove(d.m);DROPS.splice(DROPS.indexOf(d),1)}
// ---------- indítás: fegyver nélkül ----------
WP('launch',null,()=>{const g=G;if(!g||!g.brMode){L.forEach(l=>scene.remove(l.m));L=[];return}g.own=[false,false,false,false,false];g.mag=[0,0,0,0,0];g.res=[0,0,0,0,0];g.wp=0;g.inv={hp:0,beer:0};g.sh=0;g.pickMode=false;DROPS.forEach(d=>scene.remove(d.m));DROPS=[];g.pk=(g.pk||[]).filter(p=>{if(['chest','w2','w3','w4','tasak'].includes(p.t)){scene.remove(p.s);return false}return true});if(window.BR)BR.mats=0;spawnLoot()});
WP('land',null,()=>{const g=G;if(g&&g.brMode&&!g._lootMsg){g._lootMsg=1;say('🎒 Fegyver nélkül landoltál! Keress zsákmányt (fénycsóvák) és ládákat!')}});
// fegyver nélkül nincs lövés
{const o=window.sht;window.sht=function(){const g=G;if(g&&g.brMode&&!g.own[g.wp]){if(!g._noGunT||g.t-g._noGunT>2){g._noGunT=g.t;say('🎁 Nincs fegyvered – nyiss ki egy ládát (E 3 mp)!')}if(window._HARV)_HARV();return}return o.apply(this,arguments)}}
// ---------- felvétel: rásétálsz (a földön) ----------
const hr=document.createElement('div');hr.style.cssText='position:fixed;left:50%;top:58%;transform:translateX(-50%);display:none;text-align:center;font:700 16px Rajdhani,Arial;color:#fff;text-shadow:0 2px 4px #000;z-index:6;pointer-events:none';hr.innerHTML='<div id="chT"></div><i id="chR" style="display:block;margin:6px auto 0;width:58px;height:58px;border-radius:50%"></i>';document.body.appendChild(hr);
let near=null;
WP('update',null,a=>{const g=G,dt=a[0];hr.style.display='none';near=null;if(!g||!g.brMode||!L.length||g.over)return;
 let nd=null,ndd=2.2;for(const d of DROPS){if(d.fly<1){d.fly=Math.min(1,d.fly+dt*2.2);const f=d.fly;d.m.position.set(d.sx+(d.x-d.sx)*f,.15+Math.sin(f*Math.PI)*1.4,d.sz+(d.z-d.sz)*f)}else d.m.position.y=.15+Math.sin(g.t*2+d.ph)*.08;d.m.rotation.y+=dt*.9;
  const dd=Math.hypot(d.x-g.x,d.z-g.z);if(dd<ndd&&d.fly>=1){ndd=dd;nd=d}}
 if(nd&&g.phase==='play'&&g.y<2){hr.style.display='block';$('chT').textContent='[E] '+(nd.t==='cash'?'💵 '+nd.v+' Ft közpénz':label(nd.t,nd.wi,nd.rar));$('chR').style.background='none';
  if(keys['e']&&!g._eHeld){g._eHeld=1;takeDrop(nd)}if(!keys['e'])g._eHeld=0;if(g.gun&&!g.own[g.wp])g.gun.visible=false;return}
 if(!keys['e'])g._eHeld=0;
 let bd=2.6;for(const c of L){const ud=c.m.userData;if(c.open){if(c.open<1.3){c.open+=dt*3;ud.lid.rotation.x=-Math.min(1.9,c.open*1.6)}continue}ud.ring.material.opacity=.35+Math.sin(g.t*3+c.ph)*.2;const d=Math.hypot(c.x-g.x,c.z-g.z);if(d<bd){bd=d;near=c}}
 if(near&&g.phase==='play'){hr.style.display='block';if(keys['e']&&!g._eHeld){near.ht+=dt;if(near.ht>=3){openChest(near);near.ht=0;near=null}}else near.ht=0;
  const f=near?Math.min(1,near.ht/3):1;$('chT').textContent=near?(near.ht>0?'🎁 Nyitás… '+(3-near.ht).toFixed(1)+' mp':'🎁 Tartsd nyomva az E-t (3 mp)'):'';$('chR').style.background='conic-gradient(#ffd23f '+(f*360)+'deg,#0008 0)'}
 L.forEach(c=>{if(c.ht&&c!==near)c.ht=0});
 if(g.gun&&!g.own[g.wp])g.gun.visible=false;const am=document.getElementById('brAmmo');if(am&&!g.own[g.wp]&&!g.buildMode)am.innerHTML='<b style="font-size:26px">⛏️</b><i>Csákány – üss fát/épületet (klikk) · ládák: E 3 mp</i>'});
// E a láda mellett ne építsen / ne rakjon falat
{const o=window.wall;if(typeof o==='function')window.wall=function(){if(G&&G.brMode&&(near||!G.buildMode))return;return o.apply(this,arguments)}}
// régi lebegő „láda” ajándékok helyett a valódi ládák
{const o=window.pk;if(typeof o==='function')window.pk=function(x,z,t){if(G&&G.brMode&&['chest','w2','w3','w4','tasak'].includes(t))return;return o.apply(this,arguments)}}
WP('end',null,()=>{DROPS.forEach(d=>scene.remove(d.m));DROPS=[];L.forEach(l=>scene.remove(l.m));L=[]});
})();
