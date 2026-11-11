// jarmu3a.js – JÁRMŰVEK 3A: 12 új földi jármű (_x14hApi + _jm2 mintájára). F = különleges képesség vezetés közben.
// Garázs: _jm2.addShop kártyák (k3x14hveh3a), adminnak (/api/admin/me) minden ingyen megvan. Spawn: /kotro /gokart … (csak admin).
// Debug: _jm3a
(()=>{
if(!window._x14hApi||!window._jm2){console.warn('jarmu3a: nincs _x14hApi/_jm2');return}
const A=window._x14hApi,K=A.KIND,MO=A.MODELS,STD=A.STD,J=window._jm2;
const RN=(a,b)=>a+Math.random()*(b-a),sayX=t=>{try{say(t)}catch(e){}},ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const addFt=n=>{try{S.c+=n;save()}catch(e){}};
// ---------- KIND ----------
const M=1e6;
const NK={
 kotro:{cab:1,n:'🏗️ Önkormányzati kotrógép',max:13,acc:7,grip:6,seat:1.9,fuel:1,ft:.07,hp:380,arm:.35,ram:7,near:3.8,exitD:3,lbY:4.4,hitR:2.8,noJump:1,camD:10,cmd:['kotro','kotró','kotrogep'],price:95*M,d:'F: a lapát felkapja a ládát/botot, falat bont.'},
 gokart:{n:'🏎️ Pályázati gokart',max:42,acc:30,grip:5,seat:.3,fuel:1,ft:.03,hp:60,near:2.4,exitD:1.6,lbY:1.4,noJump:1,camD:5,cmd:['gokart'],price:25*M,d:'Alacsony, gyors. Shift+kormány: drift, elengedve turbó.'},
 bicikli:{n:'🚲 Közbringa',max:16,acc:3,grip:5,seat:.9,fuel:0,hp:35,quiet:1,near:2.2,exitD:1.4,lbY:2,noJump:1,camD:5,cmd:['bicikli','bringa'],price:26*M,d:'Csendes. Nyomkodd a W-t (tekerés), úgy gyorsul.'},
 pizza:{n:'🍕 Pizzafutár-robogó',max:36,acc:22,grip:5,seat:.75,fuel:1,ft:.03,hp:65,near:2.4,exitD:1.6,lbY:2,noJump:1,cmd:['pizza','pizzarobogo'],price:30*M,d:'F: gyógycsomagot rak le (12 mp).'},
 busz:{cab:1,n:'🚌 Csuklós BKV-szerű busz',max:20,acc:8,grip:3,seat:2,fuel:1,ft:.09,hp:320,arm:.5,ram:6,seats:5,near:6,exitD:2.6,lbY:4.2,hitR:3,noJump:1,camD:14,cmd:['busz','csuklos'],price:70*M,d:'Sok ülés (a bot-társ is beül), kanyarban kileng.'},
 kormany:{cab:1,n:'🚨 Kormányzati kisautó',max:38,acc:24,grip:3.6,seat:.55,fuel:1,ft:.05,hp:130,near:3.2,exitD:2,lbY:2.6,noJump:1,cmd:['kormany','kormányautó','sziréna'],price:120*M,d:'F: sziréna – 4 mp-re elriasztja a botokat (10 mp töltés).'},
 kocsi:{n:'🛒 Bevásárlókocsi',max:18,acc:9,grip:2.2,seat:.6,fuel:0,hp:30,near:2.2,exitD:1.4,lbY:1.8,noJump:1,camD:5,cmd:['kocsi','bevasarlokocsi'],price:25*M,d:'Lejtőn magától gurul. Túl gyorsan kanyarodva kiborulsz.'},
 funyiro:{n:'🌱 Fűnyíró traktor',max:12,acc:8,grip:5,seat:.8,fuel:1,ft:.03,hp:90,near:2.6,exitD:1.8,lbY:2.2,noJump:1,camD:6,cmd:['funyiro','fűnyíró'],price:40*M,d:'Nyírás közben néha Ft-ot találsz a fűben.'},
 beton:{cab:1,n:'🧱 Betonkeverő',max:17,acc:7,grip:4,seat:1.8,fuel:1,ft:.08,hp:350,arm:.4,ram:7,near:4.4,exitD:2.6,lbY:4.4,hitR:2.8,noJump:1,camD:12,cmd:['beton','betonkevero','betonkeverő'],price:110*M,d:'F: betonfalat önt maga mögé (1,2 mp).'},
 hajtany:{n:'🛤️ Hajtány',max:15,acc:.5,grip:8,seat:.9,fuel:0,hp:80,near:2.6,exitD:2,lbY:2,noJump:1,camD:6,cmd:['hajtany','hajtány'],price:50*M,d:'A körvonat sínjén megy (nagy térkép). Nyomkodd a W-t: pumpálás.'},
 monster:{cab:1,n:'🛻 Monster truck',max:30,acc:18,grip:3.4,seat:2.2,fuel:1,ft:.08,hp:300,arm:.5,ram:9,near:3.8,exitD:2.8,lbY:4.4,hitR:2.6,camD:11,cmd:['monster','monstertruck'],price:150*M,d:'Átgázol a kisautókon, szóköz: nagy ugrás.'},
 lovas:{n:'🐴 Lovaskocsi',max:15,acc:7,grip:4.5,seat:1.4,fuel:0,hp:120,seats:2,near:3.4,exitD:2,lbY:3,noJump:1,camD:9,cmd:['lovas','lovaskocsi'],price:35*M,d:'Nem fogy benzin. Patkódobogás.'}};
Object.assign(K,NK);const KEYS=Object.keys(NK);
// ---------- közös geometria/anyag ----------
const GEO={},geo=(k,f)=>GEO[k]||(GEO[k]=f());
const MAT={dark:STD(0x111827,{roughness:.8}),steel:STD(0x94a3b8,{metalness:.8,roughness:.3}),glass:STD(0x1e293b,{metalness:.7,roughness:.1,transparent:true,opacity:.6}),
 yel:STD(0xfacc15),org:STD(0xf97316),conc:STD(0x9ca3af,{roughness:.95}),wood:STD(0x8b5a2b,{roughness:.85}),brown:STD(0x6b4423,{roughness:.8}),grass:STD(0x22c55e),wh:STD(0xf1f5f9),
 white:new THREE.MeshBasicMaterial({color:0xfffbeb}),red:new THREE.MeshBasicMaterial({color:0xef4444}),blue:new THREE.MeshBasicMaterial({color:0x3b82f6})};
const box=(g,w,h,d,m,x,y,z,rx)=>{const o=new THREE.Mesh(geo('b'+w+'_'+h+'_'+d,()=>new THREE.BoxGeometry(w,h,d)),m);o.position.set(x,y,z);if(rx)o.rotation.x=rx;g.add(o);return o};
const cyl=(g,r,h,m,x,y,z,rz,rx)=>{const o=new THREE.Mesh(geo('c'+r+'_'+h,()=>new THREE.CylinderGeometry(r,r,h,12)),m);o.position.set(x,y,z);if(rz)o.rotation.z=rz;if(rx)o.rotation.x=rx;g.add(o);return o};
const W=(wh,wheel,g,ps,y,r,w)=>ps.forEach(p=>{const m=wheel(g,p[0],y,p[1],r,w);m.userData.r=r;wh.push(m)});
const lt=(g,xs,y,z)=>{xs.forEach(x=>box(g,.26,.14,.04,MAT.white,x,y,z));xs.forEach(x=>box(g,.24,.1,.04,MAT.red,x,y,-z))};
MO.kotro=(g,p,a,wh,wheel)=>{box(g,2,.5,3.2,MAT.dark,0,.6,0);box(g,1.8,1,2,p,0,1.35,-.4);box(g,1.3,1.3,1.2,MAT.glass,.2,2.5,-.2);box(g,1.4,.1,1.3,p,.2,3.2,-.2);
 const arm=new THREE.Group();arm.position.set(-.3,1.8,.8);box(arm,.3,.3,2.4,MAT.yel,0,0,1.1,-.5);const sh=new THREE.Group();sh.position.set(0,-1,2.2);box(sh,2.2,.9,.12,MAT.steel,0,0,.3);box(sh,2.2,.12,.8,MAT.steel,0,-.45,0);arm.add(sh);g.add(arm);g.userData.shovel=arm;
 W(wh,wheel,g,[[-1,1.1],[1,1.1],[-1,-1.1],[1,-1.1]],.5,.5,.4);lt(g,[-.6,.6],1.4,1.62)};
MO.gokart=(g,p,a,wh,wheel)=>{box(g,1.2,.15,2,p,0,.22,0);box(g,.5,.3,.5,MAT.dark,0,.45,-.3);box(g,1.3,.12,.3,a,0,.3,1.05);box(g,1.1,.2,.2,a,0,.55,-1);cyl(g,.15,.04,MAT.dark,0,.62,.45,0,-1);
 W(wh,wheel,g,[[-.65,.7],[.65,.7]],.2,.2,.2);W(wh,wheel,g,[[-.7,-.7],[.7,-.7]],.24,.24,.28)};
MO.bicikli=(g,p,a,wh,wheel)=>{box(g,.08,.08,1.1,p,0,.75,0,-.3);box(g,.08,.6,.08,p,0,.75,-.25);box(g,.25,.07,.35,MAT.dark,0,1.08,-.3);box(g,.6,.05,.05,MAT.steel,0,1.15,.55);box(g,.06,.6,.06,MAT.steel,0,.85,.5);
 W(wh,wheel,g,[[0,.6],[0,-.55]],.35,.35,.05)};
MO.pizza=(g,p,a,wh,wheel)=>{box(g,.45,.45,1.4,p,0,.6,0);box(g,.4,.14,.6,MAT.dark,0,.9,-.2);box(g,.5,.7,.2,p,0,.85,.6,-.25);box(g,.7,.06,.06,a,0,1.25,.65);
 box(g,.7,.5,.7,MAT.org,0,1.25,-.7);box(g,.72,.08,.72,MAT.wh,0,1.52,-.7);W(wh,wheel,g,[[0,.65],[0,-.6]],.3,.3,.14)};
MO.busz=(g,p,a,wh,wheel)=>{[[0,2.8],[0,-3.2]].forEach(q=>{box(g,2.4,2.4,5.6,p,0,1.7,q[1]);box(g,2.45,.8,5,MAT.glass,0,2.2,q[1]);box(g,2.4,.12,5.6,MAT.wh,0,2.95,q[1])});
 box(g,2.2,2.2,.6,MAT.dark,0,1.7,-.2);lt(g,[-.8,.8],1,5.62);W(wh,wheel,g,[[-1.2,4.4],[1.2,4.4],[-1.2,1.2],[1.2,1.2],[-1.2,-4.6],[1.2,-4.6]],.5,.5,.35)};
MO.kormany=(g,p,a,wh,wheel)=>{box(g,1.7,.5,3.6,MAT.dark,0,.6,0);box(g,1.5,.5,1.8,MAT.glass,0,1.1,-.2);box(g,1.55,.08,1.6,MAT.dark,0,1.38,-.25);
 const r=box(g,.4,.15,.25,MAT.red,-.25,1.5,-.2),b=box(g,.4,.15,.25,MAT.blue,.25,1.5,-.2);r.userData.sir=1;b.userData.sir=2;lt(g,[-.55,.55],.7,1.82);
 W(wh,wheel,g,[[-.85,1.15],[.85,1.15],[-.85,-1.15],[.85,-1.15]],.34,.34,.26)};
MO.kocsi=(g,p,a,wh,wheel)=>{box(g,.9,.05,1.2,MAT.steel,0,.55,0);box(g,.9,.6,.05,MAT.steel,0,.85,.6);box(g,.9,.6,.05,MAT.steel,0,.85,-.6);box(g,.05,.6,1.2,MAT.steel,-.45,.85,0);box(g,.05,.6,1.2,MAT.steel,.45,.85,0);
 box(g,.9,.06,.06,p,0,1.25,-.75);[[-.4,.5],[.4,.5],[-.4,-.5],[.4,-.5]].forEach(q=>box(g,.04,.45,.04,MAT.steel,q[0],.32,q[1]));W(wh,wheel,g,[[-.4,.5],[.4,.5],[-.4,-.5],[.4,-.5]],.09,.09,.06)};
MO.funyiro=(g,p,a,wh,wheel)=>{box(g,1.1,.4,1.8,MAT.grass,0,.55,.1);box(g,1,.35,.8,MAT.grass,0,.85,.6);box(g,.6,.15,.5,MAT.dark,0,.85,-.4);box(g,.6,.5,.1,MAT.dark,0,1.1,-.65);box(g,1.4,.15,1,MAT.dark,0,.25,.1);
 cyl(g,.15,.04,MAT.dark,0,1.15,.15,0,-1);W(wh,wheel,g,[[-.6,.7],[.6,.7]],.22,.22,.18);W(wh,wheel,g,[[-.65,-.55],[.65,-.55]],.35,.35,.3)};
MO.beton=(g,p,a,wh,wheel)=>{box(g,2.2,.4,5.6,MAT.dark,0,.8,0);box(g,2.2,1.6,1.6,p,0,1.8,2);box(g,2,.8,1.2,MAT.glass,0,2.2,2.3);
 const d=new THREE.Mesh(geo('bdrum',()=>new THREE.CylinderGeometry(.9,1.25,3.2,14)),MAT.org);d.rotation.x=Math.PI/2-.15;d.position.set(0,2.2,-1.2);g.add(d);g.userData.drum=d;
 lt(g,[-.8,.8],1.2,2.82);W(wh,wheel,g,[[-1.1,2],[1.1,2],[-1.1,-1.2],[1.1,-1.2],[-1.1,-2.3],[1.1,-2.3]],.55,.55,.4)};
MO.hajtany=(g,p,a,wh,wheel)=>{box(g,1.8,.15,2.4,MAT.wood,0,.55,0);box(g,.12,1,.12,MAT.steel,0,1.1,0);const l=box(g,1.6,.08,.08,MAT.steel,0,1.6,0);g.userData.lever=l;
 W(wh,wheel,g,[[-.75,.8],[.75,.8],[-.75,-.8],[.75,-.8]],.3,.3,.12)};
MO.monster=(g,p,a,wh,wheel)=>{box(g,2.3,.9,4,p,0,2,0);box(g,2,.8,1.8,MAT.glass,0,2.85,-.3);box(g,2.05,.1,1.7,p,0,3.3,-.3);box(g,2.6,.3,3,MAT.dark,0,1.3,0);lt(g,[-.7,.7],2.1,2.02);
 W(wh,wheel,g,[[-1.4,1.4],[1.4,1.4],[-1.4,-1.4],[1.4,-1.4]],1.05,1.05,.9)};
MO.lovas=(g,p,a,wh,wheel)=>{box(g,1.6,.5,2.2,MAT.wood,0,1,-.8);box(g,1.4,.2,.6,MAT.brown,0,1.45,-1.1);box(g,.08,.08,2,MAT.wood,-.35,.9,1.2);box(g,.08,.08,2,MAT.wood,.35,.9,1.2);
 const h=new THREE.Group();h.position.set(0,0,2);box(h,.6,.7,1.6,MAT.brown,0,1.4,0);box(h,.35,.8,.35,MAT.brown,0,2,.8,-.6);box(h,.3,.35,.6,MAT.brown,0,2.3,1.15);
 [[-.2,.6],[.2,.6],[-.2,-.6],[.2,-.6]].forEach(q=>box(h,.14,1,.14,MAT.brown,q[0],.55,q[1]));g.add(h);g.userData.horse=h;
 W(wh,wheel,g,[[-.85,-.8],[.85,-.8]],.6,.6,.12)};
// ---------- tulajdon + admin ----------
const LS={g(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let OWN=LS.g('k3x14hveh3a',[]),ADM=false,admTok=null;
const own=k=>ADM||OWN.includes(k);
const tok=()=>(window.ACC&&ACC.token)||localStorage.getItem('ry_token')||'';
async function chkAdm(){const t=tok();if(!t||(window.ACC&&ACC.guest)){ADM=false;admTok=null;return}if(t===admTok)return;admTok=t;
 try{const r=await fetch('/api/admin/me',{headers:{Authorization:'Bearer '+t}});let j={};try{j=await r.json()}catch(e){}ADM=r.ok&&j.admin!==false}catch(e){ADM=false}J.redraw()}
setInterval(chkAdm,3000);setTimeout(chkAdm,900);
// ---------- garázs-kártyák ----------
J.addShop(w=>{const d=document.createElement('div');d.innerHTML='<h2 style="margin-top:10px">🏗️ Különleges járművek'+(ADM?' <small style="color:#86efac">(admin: mind ingyen)</small>':'')+'</h2><small>Meccsben: <b>/garazs kotro</b> (90 mp-enként). F = különleges képesség.</small><div class="gr">'+
 KEYS.map(k=>{const o=K[k];let img='';try{img=J.snap(k)}catch(e){}return'<div class="it"><img src="'+img+'" style="width:100%;height:110px;object-fit:cover;border-radius:10px"><b>'+o.n+'</b><br><small>'+o.d+'</small><br><small>🏎️ '+Math.round(o.max*3.6)+' km/h · 🔧 '+o.hp+' HP</small><br>'+
  (own(k)?'<button class="own" disabled>✔ A garázsodban</button>':'<button class="buy3" style="background:#22c55e;color:#04120a" data-k="'+k+'">Megveszem – '+ft(o.price)+'</button>')+'</div>'}).join('')+'</div>';
 w.insertBefore(d,w.querySelector('#jm2Paint'));
 d.querySelectorAll('.buy3').forEach(b=>b.onclick=()=>{const k=b.dataset.k,p=K[k].price;if(!(S.c>=p)){sayX('💸 Nincs elég pénzed: '+ft(p));return}S.c-=p;try{save()}catch(e){}OWN.push(k);LS.s('k3x14hveh3a',OWN);A.tone(700,.15,'triangle',.08,1200);J.redraw()})});
// ---------- parancsok ----------
const find=s=>KEYS.find(k=>k===s||K[k].cmd.includes(s));
let callT=0;
function spawn(k){const v=A.spawnFront(k);if(!v)return null;v.fuel=1;if(k==='hajtany')toRail(v,true);return v}
{const oc=window.extraCmd;window.extraCmd=function(c){const a=String(c).trim().replace(/^\//,'').split(/\s+/),n=(a[0]||'').toLowerCase();
 if((n==='garazs'||n==='garázs')&&a[1]){const k=find(a[1].toLowerCase());if(k){if(!A.inMatch())return'Csak meccsben!';if(!own(k))return'🏁 Ez nincs a garázsodban.';
  const now=performance.now();if(now<callT&&!ADM)return'⏳ A garázs még '+Math.ceil((callT-now)/1000)+' mp-ig pihen.';callT=now+90000;spawn(k);return'🏁 Megérkezett: '+K[k].n}}
 const k=find(n);if(k){if(!ADM)return'⛔ Ez fejlesztői parancs – csak admin használhatja.';if(!A.inMatch())return'Csak meccsben!';spawn(k);return K[k].n+' előtted'}
 return oc?oc.apply(this,arguments):undefined}}
// ---------- képességek (F) ----------
const fT={},ST={};
const X=()=>window._x14h&&window._x14h(),drv=()=>{const x=X();return x&&x.drive&&NK[x.drive.k]?x.drive:null};
addEventListener('keydown',e=>{const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;const v=drv();if(!v||e.repeat)return;
 if(e.code==='KeyW'&&(v.k==='bicikli'||v.k==='hajtany')){v.sp=Math.min(K[v.k].max,Math.max(0,v.sp)+(v.k==='bicikli'?2.2:2.6));if(v.m.userData.lever)v.m.userData.lever.rotation.z=v.m.userData.lever.rotation.z>0?-.4:.4}
 if(e.code==='KeyF'){e.stopImmediatePropagation();e.preventDefault();ability(v)}},true);
const fwd=v=>[Math.sin(v.a),Math.cos(v.a)];
function ability(v){const now=performance.now();if(now<(fT[v.k]||0)){sayX("⏳ Még "+Math.ceil((fT[v.k]-now)/1000)+' mp');return}const[fx,fz]=fwd(v);
 if(v.k==='kotro'){fT[v.k]=now+1500;const sx=v.x+fx*3.5,sz=v.z+fz*3.5;let n=0;const sh=v.m.userData.shovel;if(sh){sh.rotation.x=-.6;setTimeout(()=>sh.rotation.x=0,500)}
  (G.en||[]).forEach(e=>{if(!e.dead&&Math.hypot(e.x-sx,e.z-sz)<3.5){n++;try{dmgE(e,80,false)}catch(er){}e.x+=fx*6;e.z+=fz*6}});
  (G.wl||[]).forEach(w=>{if(w.hp>0&&Math.hypot(w.x-sx,w.z-sz)<3.5){w.hp=0;n++}});
  const cr=J.crates();for(let i=cr.length-1;i>=0;i--){const c=cr[i];if(Math.hypot(c.x-sx,c.z-sz)<3.5){try{scene.remove(c.m)}catch(er){}cr.splice(i,1);n++;addFt(250000);sayX('🏗️ Felkaptad a ládát: +'+ft(250000))}}
  for(let i=0;i<8;i++)J.emit('dust',sx,.5,sz,RN(-2,2),RN(1,3),RN(-2,2),.8,.6,1.8);sayX(n?'🏗️ Lapát: '+n+' találat!':'🏗️ A lapát üresen jött vissza.')}
 else if(v.k==='pizza'){fT[v.k]=now+12000;try{pk(v.x-fx*2,v.z-fz*2,'hp')}catch(er){}sayX('🍕 Gyógycsomag lerakva!')}
 else if(v.k==='kormany'){fT[v.k]=now+10000;ST.sir=4;let n=0;(G.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-v.x,e.z-v.z);if(d<28){n++;e.fz=Math.max(e.fz||0,4);const k=6/Math.max(d,1);e.x+=(e.x-v.x)*k;e.z+=(e.z-v.z)*k}});
  A.tone(700,.4,'sawtooth',.06,1000);setTimeout(()=>A.tone(1000,.4,'sawtooth',.06,700),400);sayX('🚨 SZIRÉNA! '+n+' bot megriadt.')}
 else if(v.k==='beton'){fT[v.k]=now+1200;wall(v.x-fx*4.5,v.z-fz*4.5,v.a)}
 else sayX('Ennek a járműnek nincs F-képessége.')}
// betonfal G.wl-be (br_modul brPlace mintája: oszlop-ütközők + hp, a játék magától bontja hp<=0-nál)
function wall(x,z,a){if(!G.wl||!G.col)return;const m=new THREE.Mesh(geo('bwall',()=>new THREE.BoxGeometry(4,2.6,.4)),MAT.conc);m.position.set(x,floorH({x,z,y:0})+1.3,z);m.rotation.y=a;scene.add(m);
 const w={m,x,z,y0:0,hp:500,mhp:500,kind:'piece',cols:[],pls:[]},ax=Math.cos(a),az=-Math.sin(a);for(const o of[-1.4,0,1.4]){const c={x:x+ax*o,z:z+az*o,r:.75,h:2.6,y0:0,tmpW:1};G.col.push(c);w.cols.push(c)}G.wl.push(w);
 for(let i=0;i<6;i++)J.emit('dust',x,1,z,RN(-1,1),RN(1,2),RN(-1,1),.8,.6,1.6);sayX('🧱 Betonfal kiöntve!')}
// hajtány: a körvonat ellipszis-sínjére illeszt (extra130b X.train, csak a nagy térképen)
function rail(){try{const x=window._x13b&&_x13b();return x&&x.train}catch(e){return null}}
function toRail(v,init){const T=rail();if(!T)return false;const t=Math.atan2(v.z/T.RZ,v.x/T.RX),x=Math.cos(t)*T.RX,z=Math.sin(t)*T.RZ,tx=-Math.sin(t)*T.RX,tz=Math.cos(t)*T.RZ;
 let a=Math.atan2(tx,tz);if(Math.cos(a-v.a)<0)a+=Math.PI;v.x=x;v.z=z;v.a=a;v.vx=Math.sin(a)*v.sp;v.vz=Math.cos(a)*v.sp;if(init){v.y=floorH({x,z,y:50});v.m.position.set(x,v.y,z)}else v.m.position.x=x,v.m.position.z=z;v.m.rotation.y=a;return true}
// ---------- frissítés ----------
let gkC=0,gkSh=false,boostT=0,mowT=0,trT=0;
const ou=window.update;if(typeof ou==='function')window.update=function(){const r=ou.apply(this,arguments);try{tick(Math.min(.05,arguments[0]||.016))}catch(e){console.error('jarmu3a',e)}return r};
function tick(dt){const x=X();if(!x||!A.inMatch())return;const t=x.t,ky=A.keys()||{},st=(ky.a?1:0)-(ky.d?1:0);
 x.veh.forEach(v=>{if(!NK[v.k]||v.dead)return;const me=x.drive===v,ud=v.m.userData;
  if(v.k==='kormany')v.m.traverse(o=>{if(o.userData.sir)o.visible=(ST.sir>0||me)?((Math.sin(t*14)>0)===(o.userData.sir===1)):false});
  if(ud.drum)ud.drum.rotation.y+=dt*2;
  if(ud.horse&&Math.abs(v.sp)>.5){ud.horse.position.y=Math.abs(Math.sin(t*9))*.12;if(me&&Math.sin(t*9)*Math.sin((t-dt)*9)<0)A.tone(180,.05,'triangle',.04)}
  if(v.k==='busz'&&!v.air)v.m.rotation.z=(v.m.rotation.z||0)*.9+(me?-st*Math.min(1,Math.abs(v.sp)/15)*.08:0);
  if(v.k==='hajtany'&&rail())toRail(v,false);
  if(v.k==='kocsi'&&!v.air){const e=.8,h0=floorH({x:v.x,z:v.z,y:v.y+1}),hx=floorH({x:v.x+e,z:v.z,y:v.y+1})-h0,hz=floorH({x:v.x,z:v.z+e,y:v.y+1})-h0;// lejtő → gurul
   if(Math.abs(hx)<1&&Math.abs(hz)<1&&(Math.abs(hx)>.04||Math.abs(hz)>.04)){const gx=-hx*14*dt,gz=-hz*14*dt;v.sp+=(gx*Math.sin(v.a)+gz*Math.cos(v.a));if(!me){v.x+=v.sp*Math.sin(v.a)*dt;v.z+=v.sp*Math.cos(v.a)*dt;v.y=floorH({x:v.x,z:v.z,y:v.y+.5});v.m.position.set(v.x,v.y,v.z);v.sp*=1-dt*.5}}
   if(me&&Math.abs(v.sp)>12&&Math.abs(st)){A.leave();G.vy=8;G.x+=Math.cos(v.a)*1.5;G.z-=Math.sin(v.a)*1.5;v.sp=0;v.m.rotation.z=1.4;try{hurt(6)}catch(e){}sayX('🛒 Kiborultál a kocsiból! (ragdoll)')}}
  if(!me)return;
  if(v.k==='gokart'){const sh=!!ky.shift;if(sh&&Math.abs(st)&&Math.abs(v.sp)>10){K.gokart.grip=1.2;gkC=Math.min(3,gkC+dt);if(Math.random()<.4)J.emit('smoke',v.x,.2,v.z,RN(-1,1),.6,RN(-1,1),.7,.5,1.5)}else K.gokart.grip=5;
   if(gkSh&&!sh&&gkC>.6){boostT=1.5;v.sp+=gkC*6;sayX('🔥 Drift-turbó!')}if(!sh)gkC=0;gkSh=sh;boostT-=dt;K.gokart.max=boostT>0?55:42}
  if(v.k==='funyiro'&&Math.abs(v.sp)>2){mowT-=dt;if(Math.random()<.3)J.emit('dust',v.x,.2,v.z,RN(-1,1),RN(.5,1.5),RN(-1,1),.5,.3,.8);if(mowT<=0){mowT=1.5;if(Math.random()<.35){const n=Math.round(RN(5,60))*1000;addFt(n);try{ftx(v.x,v.z,'🌱 +'+ft(n),'')}catch(e){}}}}
  if(v.k==='monster'){if(v.air&&!v._pa&&v.vy>3)v.vy=15;v._pa=v.air;// a szóköz-ugrást megnöveli
   x.veh.forEach(o=>{if(o!==v&&!o.dead&&(K[o.k].hp||100)<=150&&Math.hypot(o.x-v.x,o.z-v.z)<3){o.hp=0;A.boom(o);sayX('🛻 Átgázoltál rajta!')}})}});
 if(ST.sir>0)ST.sir-=dt}
window._jm3a={K:NK,own:()=>OWN.slice(),adm:()=>ADM,spawn,wall,ability};
})();
