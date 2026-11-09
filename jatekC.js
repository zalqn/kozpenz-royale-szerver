// ===== JATEKC: 🏜️ JÁTÉKMENET C – 2. sziget (sivatag/tél), szezonok, esemény-meccsek, építés-beállítás + kőbánya,
// boss-fázisok, gyógy/páncél-eszközök, ritkaság-fénycsík + HUD-keret, gyakorló botok. Lobby: x14hub gomb „JÁTÉKMENET” / F1. Debug: _k3C
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){console.error('k3C pre '+n,e)}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('k3C '+n,e)}return r}};
const $$=i=>document.getElementById(i),RN=(a,b)=>a+Math.random()*(b-a),fmt=n=>Math.round(+n||0).toLocaleString('hu-HU');
const LSg=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const tell=t=>{try{say(t)}catch(e){}};
const inM=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;
const D2=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const SET=Object.assign({map:'hun',build:true,tBots:3,tDiff:'norm',tBoss:false,ev:null},LSg('k3CSet',{}));
const saveSet=()=>LSs('k3CSet',SET);
const C=window._k3C={SET,objs:[],rocks:[],boss:null,inv:{band:0,aid:0,mix:0},arm:0,armT:0,use:null};

// ---------- 17. SZEZONOK ----------
const EPOCH=Date.UTC(2026,0,5),SLEN=56*864e5;
const THEMES=[{n:'Délibáb-pályázat',e:'🏜️',c:'#f59e0b'},{n:'Jégkorszak-hivatal',e:'❄️',c:'#7dd3fc'},{n:'Neon-közbeszerzés',e:'🌃',c:'#e879f9'},{n:'Kalóz-költségvetés',e:'🏴‍☠️',c:'#f87171'},{n:'Űr-támogatás',e:'🚀',c:'#a5b4fc'},{n:'Dzsungel-projekt',e:'🌴',c:'#4ade80'}];
const EMB=[['📜','Kezdő pecsét'],['🪙','Szezon-érme'],['🏅','Bronz plakett'],['🎖️','Ezüst plakett'],['💎','Gyémánt pecsét'],['👑','Szezon-korona']];
function season(now){now=now||Date.now();const n=Math.floor((now-EPOCH)/SLEN),st=EPOCH+n*SLEN,th=THEMES[((n%6)+6)%6];return{n:n+1,id:'s'+(n+1),th,start:st,end:st+SLEN,week:Math.floor((now-st)/(7*864e5))+1,left:Math.ceil((st+SLEN-now)/864e5)}}
function sData(){const s=season();let d=LSg('k3CSeason',null);if(!d||d.id!==s.id){const old=d;d={id:s.id,pts:0,cl:[],eq:old&&old.eq||null,own:old&&old.own||[]}}return d}
const TIERS=[];for(let i=1;i<=10;i++)TIERS.push({p:i*150,r:i%2===0?{emb:(i/2-1)}:{ft:i*2500}});
// emblémák szezononként: tulajdon kulcs = szezon-id + index
function claim(i){const d=sData(),t=TIERS[i],s=season();if(d.pts<t.p||d.cl.includes(i))return;d.cl.push(i);if(t.r.ft){try{S.c+=t.r.ft;save()}catch(e){}tell('🎁 Szezonjutalom: +'+fmt(t.r.ft)+' Ft')}else{const k=s.id+':'+t.r.emb;if(!d.own.includes(k))d.own.push(k);d.eq=k;tell('🎁 Új embléma: '+s.th.e+EMB[t.r.emb][0]+' '+EMB[t.r.emb][1])}LSs('k3CSeason',d)}
function embTxt(k){if(!k)return '';const [sid,i]=k.split(':');const n=+sid.slice(1)-1,th=THEMES[((n%6)+6)%6];return th.e+EMB[+i][0]}
function addPts(p,why){const d=sData();d.pts+=p;LSs('k3CSeason',d);return p}

// ---------- 18. ESEMÉNY-MECCSEK ----------
const day=()=>{const d=new Date();return d.getFullYear()*372+d.getMonth()*31+d.getDate()};
const RULES={
 legend:{n:'💜 Csak legendás zsákmány',d:'Minden fegyvered legalább LEGENDÁS ritkaságú.',tick(g){if(g.ry&&g.ry.rar)g.ry.rar=g.ry.rar.map((r,i)=>g.own[i]?Math.max(r,3):r)}},
 half:{n:'💔 Üvegágyú',d:'Fél életerő, de dupla sebzés.',start(g){g.mhp=Math.round(g.mhp/2);g.hp=Math.min(g.hp,g.mhp);g._dmgB=(g._dmgB||1)*2}},
 rush:{n:'🌪️ Gyorsvihar',d:'A biztonságos zóna kétszer olyan gyorsan szűkül.',tick(g,dt){if(g.ry&&g.ry.tm>0)g.ry.tm-=dt}},
 rich:{n:'💰 Pénzeső-meccs',d:'Minden kiesés +800 Ft extra.',kill(g){g.cash+=800}},
 heal:{n:'🩹 Gyógyító-fesztivál',d:'Kezdéskor 3 kötszer + 1 elsősegély-csomag, ládákban több gyógyszer.',start(){C.inv.band+=3;C.inv.aid+=1}}
};
const RK=Object.keys(RULES);
function events(){const d=day(),w=Math.floor(d/7),MK=window._x14c?Object.keys(window._x14c.modes):[];const WE=['lava','gold','lowg','fog'];
 return[{id:'d'+d,kind:'Napi',mode:MK.length?MK[d%MK.length]:'',wev:'',rule:RK[d%RK.length],mult:1.5,sp:60},
        {id:'w'+w,kind:'Heti',mode:MK.length?MK[(w*3+1)%MK.length]:'',wev:WE[w%4],rule:RK[(w+2)%RK.length],mult:2.5,sp:150}]}
function startEvent(i){const e=events()[i];SET.ev={id:e.id,rule:e.rule,mult:e.mult,sp:e.sp,wev:e.wev,kind:e.kind};saveSet();
 if(window._x14c&&e.mode){window._x14c.pend=e.mode;LSs('k3x14cNext',e.mode)}if(e.wev)localStorage.setItem('x20ev',e.wev);
 window.GAME_MODE='royale';closeP();const b=$$('lbGo');if(b)b.click()}

// ---------- 16. MÁSODIK SZIGET (téma) ----------
let SANDT=null,SNOWT=null;
function noiseTex(a,b){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=a;x.fillRect(0,0,256,256);for(let i=0;i<5000;i++){x.fillStyle=Math.random()<.5?b:a;x.globalAlpha=Math.random()*.35;x.fillRect(Math.random()*256,Math.random()*256,2,2)}x.globalAlpha=.25;x.strokeStyle=b;for(let i=0;i<14;i++){x.beginPath();const y=Math.random()*256;x.moveTo(0,y);for(let k=0;k<=256;k+=16)x.lineTo(k,y+Math.sin(k*.05+i)*6);x.stroke()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.06,.06);return t}
const TH={
 siv:{n:'🏜️ Délibáb-sivatag',d:'Homokdűnék, kaktuszok, vörös sziklatornyok, forró napfény.',sky:0xf0c987,fogN:140,fogF:380,ground:0xe2bf7e,tex:()=>SANDT||(SANDT=noiseTex('#e6c486','#b8894a')),sea:0x1fa3a0,sun:0xffe0a8},
 tel:{n:'❄️ Fagyos-fennsík',d:'Hóval borított táj, jeges fenyők, kék jégsziklák, hóesés.',sky:0xcfe3f2,fogN:90,fogF:320,ground:0xf1f6fb,tex:()=>SNOWT||(SNOWT=noiseTex('#f4f8fc','#c9d8e6')),sea:0x5b8fb5,sun:0xe6f0ff}
};
const isGreen=c=>c&&c.g>.25&&c.g>c.r*1.15&&c.g>c.b*1.1;
function themeScene(){const T=TH[SET.map];if(!T||typeof scene==='undefined'||!scene)return;const g=G;C.theme=SET.map;
 scene.background=new THREE.Color(T.sky);if(scene.fog){scene.fog.color.setHex(T.sky);scene.fog.near=T.fogN;scene.fog.far=T.fogF}
 const tx=T.tex(),cache=new Map();let n=0;
 const fix=m=>{if(!m||!m.color||!isGreen(m.color))return m;if(cache.has(m))return cache.get(m);const c=m.clone();c.color.setHex(T.ground);if(c.map)c.map=tx;if(c.emissive)c.emissive.setHex(0);cache.set(m,c);n++;return c};
 scene.traverse(o=>{if(!o.isMesh||o.userData.k3C)return;if(Array.isArray(o.material))o.material=o.material.map(fix);else o.material=fix(o.material);
  const m=Array.isArray(o.material)?o.material[0]:o.material;if(m&&m.color&&o.geometry&&o.geometry.type==='CircleGeometry'&&m.color.b>m.color.r)o.material=Object.assign(m.clone(),{}),o.material.color.setHex(T.sea)});
 scene.traverse(o=>{if(o.isDirectionalLight)o.color.setHex(T.sun)});
 decor(T);if(!C._tn)C._tn=n}
function inside(x,z){try{return hin(x,z)}catch(e){return Math.hypot(x,z)<100}}
function scat(n,f){const out=[];let k=0;while(out.length<n&&k++<n*30){const x=RN(-260,260),z=RN(-260,260);if(!inside(x,z))continue;if(Math.hypot(x-(G.x||0),z-(G.z||0))<6)continue;out.push([x,z])}return out}
function inst(geo,mat,pts,fn){const m=new THREE.InstancedMesh(geo,mat,pts.length),o=new THREE.Object3D();pts.forEach((p,i)=>{o.position.set(p[0],0,p[1]);o.rotation.set(0,Math.random()*6.28,0);o.scale.setScalar(1);fn&&fn(o,i,p);o.updateMatrix();m.setMatrixAt(i,o.matrix)});m.userData.k3C=1;m.castShadow=false;m.receiveShadow=false;m.frustumCulled=false;scene.add(m);C.objs.push(m);return m}
function decor(T){const L=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
 if(SET.map==='siv'){const P=scat(170);const s=[];
  inst(new THREE.CylinderGeometry(.35,.42,3,7),L(0x3f7d3a),P,(o,i)=>{s[i]=RN(.7,1.5);o.scale.setScalar(s[i]);o.position.y=1.5*s[i]});
  const arms=[];P.forEach((p,i)=>{if(i%2===0)arms.push([p[0]+.55*s[i],p[1],s[i]])});
  inst(new THREE.CylinderGeometry(.22,.25,1.3,6),L(0x3f7d3a),arms.map(a=>[a[0],a[1]]),(o,i)=>{const k=arms[i][2];o.scale.setScalar(k);o.rotation.set(0,0,0);o.position.y=2*k});
  const R=scat(28);C.rocks=R.map(p=>({x:p[0],z:p[1],h:3,n:3,col:0xb45a32}));
  inst(new THREE.CylinderGeometry(2.2,3,1,6),L(0xb45a32,0x2a0e04),R,(o,i)=>{const h=RN(4,9);o.scale.set(1,h,1);o.position.y=h/2;C.rocks[i].h=h});
  inst(new THREE.ConeGeometry(4,1.2,9),L(0xd9b06c),scat(60),(o)=>{o.scale.set(RN(1,2.4),RN(.8,1.6),RN(1,2.4));o.position.y=.5});
  inst(new THREE.IcosahedronGeometry(.6,0),new THREE.MeshLambertMaterial({color:0x8a6a3a,wireframe:true}),scat(40),(o)=>{o.position.y=.6});
 }else{const P=scat(220);
  inst(new THREE.ConeGeometry(1.6,4.5,7),L(0x2f5d50),P,(o,i)=>{const k=RN(.7,1.6);o.scale.setScalar(k);o.position.y=2.6*k});
  inst(new THREE.ConeGeometry(1.1,1.4,7),L(0xffffff,0x334455),P,(o,i)=>{o.scale.setScalar(1);o.position.y=4.3});
  const R=scat(28);C.rocks=R.map(p=>({x:p[0],z:p[1],h:3,n:3,col:0x7dd3fc}));
  inst(new THREE.DodecahedronGeometry(2.4,0),new THREE.MeshLambertMaterial({color:0x9bd3f0,emissive:0x12324a,transparent:true,opacity:.85}),R,(o,i)=>{const h=RN(1,1.8);o.scale.set(h,h*1.3,h);o.position.y=h;C.rocks[i].h=h*2.4});
  // hóesés: 1 Points, kamera körül
  const N=1400,a=new Float32Array(N*3);for(let i=0;i<N;i++){a[i*3]=RN(-60,60);a[i*3+1]=RN(0,40);a[i*3+2]=RN(-60,60)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(a,3));
  const pt=new THREE.Points(geo,new THREE.PointsMaterial({color:0xffffff,size:.25,transparent:true,opacity:.85,depthWrite:false}));pt.userData.k3C=1;pt.frustumCulled=false;scene.add(pt);C.snow=pt;C.objs.push(pt)}
 // kő-jelölő a sziklákon (építőanyag): hamis fény = additív gyűrű
 C.rocks.forEach(r=>{const m=new THREE.Mesh(new THREE.RingGeometry(3.1,3.5,20),new THREE.MeshBasicMaterial({color:0xfde68a,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.set(r.x,.1,r.z);m.userData.k3C=1;scene.add(m);r.ring=m;C.objs.push(m)})}

// ---------- 21. GYÓGY / PÁNCÉL ----------
const ITEMS={band:{n:'🩹 Kötszer',t:2,u:g=>{g.hp=Math.min(Math.max(g.hp,Math.min(g.mhp*.75,g.hp+15)),g.mhp)},ok:g=>g.hp<g.mhp*.75},
 aid:{n:'🧰 Elsősegély-csomag',t:5,u:g=>{g.hp=g.mhp},ok:g=>g.hp<g.mhp},
 mix:{n:'🧃 Kevert ital',t:3,u:g=>{g.hp=Math.min(g.mhp,g.hp+25);g.sh=Math.min(g.msh,g.sh+25)},ok:g=>g.hp<g.mhp||g.sh<g.msh}};
const ARM=[null,{n:'🦺 Könnyű mellény',r:.12,d:120,c:'#b0b8c4'},{n:'🥋 Taktikai mellény',r:.22,d:180,c:'#60a5fa'},{n:'🛡️ Nehéz páncél',r:.33,d:260,c:'#c084fc'}];
const GI={band:'🩹',aid:'🧰',mix:'🧃',a1:'🦺',a2:'🥋',a3:'🛡️'};
function gItem(t,x,z){if(typeof scene==='undefined'||!scene)return;const s=spr(GI[t],1.4);s.position.set(x,1.1,z);s.userData.k3C=1;scene.add(s);C.gr.push({t,x,z,s})}
function take(it){if(it.t[0]==='a'){const lv=+it.t[1];if(lv<C.arm&&C.armT>0){tell('Már jobb páncélod van');return false}C.arm=lv;C.armT=ARM[lv].d;tell(ARM[lv].n+' felvéve (−'+Math.round(ARM[lv].r*100)+'% sebzés)')}else{C.inv[it.t]++;tell(ITEMS[it.t].n+' +1 (Backspace = használat)')}try{sfx('buy')}catch(e){}return true}
function useBest(){const g=G;if(!inM()||C.use)return;const k=['aid','mix','band'].find(k=>C.inv[k]>0&&ITEMS[k].ok(g))||(['band','mix','aid'].find(k=>C.inv[k]>0));if(!k){tell('Nincs gyógyító eszközöd');return}if(!ITEMS[k].ok(g)){tell('Most nincs rá szükség');return}C.use={k,t:ITEMS[k].t,T:ITEMS[k].t};tell('⏳ '+ITEMS[k].n+' használata…')}

// ---------- 20. BOSS FÁZISOK ----------
const PH=[{n:'I. fázis – Tárgyalás',c:'#facc15'},{n:'II. fázis – Költségvetés-vihar',c:'#fb923c'},{n:'III. fázis – Végső elszámolás',c:'#ef4444'}];
function bossTick(g,dt){let b=C.boss;if(!b||b.dead||!g.en.includes(b)){b=C.boss=g.en.find(e=>e._boss&&!e.dead)||null;if(b){b._ph=0;b._pt=2;b._mhp=b.mhp||b.hp;b._sum=0}}
 const bar=$$('k3CBoss');if(!b){if(bar)bar.style.display='none';return}
 const r=Math.max(0,b.hp/b._mhp),ph=r>.66?0:r>.33?1:2;if(ph!==b._ph){b._ph=ph;tell('👔 BOSS: '+PH[ph].n+'!');try{sfx('crit')}catch(e){}if(ph===1)b.sp=(b.sp||4)*1.25;if(ph===2){b.sp*=1.2;try{b.m.traverse(o=>{if(o.isMesh&&o.material&&o.material.emissive){o.material=o.material.clone();o.material.emissive.setHex(0x550000)}})}catch(e){}}}
 b._pt-=dt;const a=Math.atan2(g.z-b.z,g.x-b.x),dist=D2(b,g);
 if(b._pt<=0&&dist<70){if(ph===0){for(let i=-1;i<=1;i++)eFire(b,a+i*.18,24,9);b._pt=2.2}
  else if(ph===1){const n=12,o=RN(0,6.28);for(let i=0;i<n;i++)eFire(b,o+i*6.283/n,16,8);b._pt=2.6}
  else{b._burst=(b._burst||0)+1;eFire(b,a+RN(-.05,.05),34,10);b._pt=b._burst%6===0?1.4:.18;if(!b._sum&&r<.25){b._sum=1;for(let i=0;i<3;i++){try{const e=sp('nav',b.x+RN(-5,5),b.z+RN(-5,5));g.en.push(e)}catch(er){}}tell('👔 A boss erősítést hívott!')}}}
 if(!bar)return;bar.style.display='block';bar.querySelector('b').textContent=(b.name||b.nm||'BOSS')+' · '+PH[ph].n;const f=bar.querySelector('i');f.style.width=(r*100)+'%';f.style.background=PH[ph].c}

// ---------- 23. GYAKORLÓ BOTOK ----------
const DF={easy:{n:'Könnyű',c:'#4ade80',hp:.7,sp:.8,dmg:.5},norm:{n:'Normál',c:'#60a5fa',hp:1,sp:1,dmg:1},hard:{n:'Nehéz',c:'#f59e0b',hp:1.4,sp:1.15,dmg:1.4},mad:{n:'Őrült',c:'#ef4444',hp:2,sp:1.3,dmg:2}};
function trBot(g,boss){const D=DF[SET.tDiff]||DF.norm,a=RN(0,6.28),R=RN(25,50);let e;try{e=sp(boss?'fact':'nav',Math.cos(a)*R,Math.sin(a)*R)}catch(er){return}e.hp*=D.hp*(boss?8:1);e.mhp=e.hp;e.sp*=D.sp;e._k3Ct=1;if(boss){e._boss=1;e.name=e.nm='👔 GYAKORLÓ BOSS';try{e.m.scale.multiplyScalar(2)}catch(er){}}g.en.push(e);return e}
function trTick(g,dt){if(!g.train||!C.tr)return;const mine=g.en.filter(e=>e._k3Ct&&!e.dead);
 if(mine.filter(e=>!e._boss).length<SET.tBots){C.tr.t-=dt;if(C.tr.t<=0){C.tr.t=3;trBot(g,false)}}
 if(SET.tBoss&&!mine.some(e=>e._boss)){C.tr.bt=(C.tr.bt||0)-dt;if(C.tr.bt<=0){C.tr.bt=8;trBot(g,true);tell('👔 Gyakorló boss megjelent!')}}
 if(g.hp<=1){g.hp=g.mhp;g.sh=g.msh;tell('💫 Edzőpályán nem esel ki – feltöltve')}}

// ---------- 22. RITKASÁG ----------
const RC=['#b0b8c4','#4ade80','#60a5fa','#c084fc','#fbbf24'];
function rarTick(t){const D=window._DROPS?window._DROPS():[];for(const d of D){if(d.t!=='weapon'||!d.m)continue;if(!d._k3){d._k3=1;const c=(window._RAR&&_RAR[d.rar]?_RAR[d.rar].c:0xffffff),h=4+d.rar*3;
  const beam=new THREE.Mesh(new THREE.CylinderGeometry(.07,.32,h,8,1,true),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false}));beam.position.y=h/2;beam.userData.k3C=1;d.m.add(beam);
  const disc=new THREE.Mesh(new THREE.CircleGeometry(1.1+d.rar*.15,20),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false}));disc.rotation.x=-Math.PI/2;disc.position.y=.03;d.m.add(disc);d._b=beam;d._d=disc}
  const p=.5+.5*Math.sin(t*3+d.ph);d._b.material.opacity=.2+.25*p;d._d.scale.setScalar(.9+.2*p)}}
function hudFrame(g){const am=$$('brAmmo');if(!am)return;const r=g.own&&g.own[g.wp]&&g.ry&&g.ry.rar?g.ry.rar[g.wp]:-1,c=r>=0?RC[r]:'';if(am._k3c===c)return;am._k3c=c;am.style.boxShadow=c?'0 0 0 3px '+c+', 0 0 18px '+c:'';am.style.borderRadius=c?'12px':''}

// ---------- HUD ----------
const hudEl=document.createElement('div');hudEl.id='k3CHud';
const css=document.createElement('style');css.textContent=`#k3CHud{position:fixed;left:50%;bottom:118px;transform:translateX(-50%);display:none;gap:8px;z-index:30;font:600 13px system-ui;color:#fff;pointer-events:none}
#k3CHud span{background:rgba(15,23,42,.72);padding:4px 9px;border-radius:9px;border:1px solid rgba(255,255,255,.15)}
#k3CBoss{position:fixed;top:118px;left:50%;transform:translateX(-50%);width:min(560px,80vw);display:none;z-index:31;pointer-events:none;font:800 14px system-ui;color:#fff;text-align:center;text-shadow:0 1px 3px #000}
#k3CBoss div{height:14px;background:rgba(0,0,0,.6);border:2px solid #fff3;border-radius:8px;overflow:hidden;margin-top:4px}#k3CBoss i{display:block;height:100%;transition:width .2s}
#k3CUse{position:fixed;left:50%;top:58%;transform:translateX(-50%);width:200px;height:8px;background:#0008;border-radius:5px;display:none;z-index:31}#k3CUse i{display:block;height:100%;background:#4ade80;border-radius:5px}
#k3CP{position:fixed;inset:0;background:rgba(2,6,23,.72);z-index:99;display:none;align-items:center;justify-content:center;font:14px system-ui;color:#e2e8f0}
#k3CP button{all:unset;box-sizing:border-box;display:inline-block}
#k3CP .k3w{background:linear-gradient(160deg,#1e293b,#0f172a);border:1px solid #f59e0b55;border-radius:16px;padding:18px 20px;width:min(860px,94vw);max-height:88vh;overflow:auto;box-shadow:0 20px 60px #000a}
#k3CP h2{margin:0 0 8px;color:#fbbf24}#k3CP h3{margin:14px 0 6px;color:#fde68a;font-size:15px}
#k3CP .tabs button,#k3CP button.b{background:#334155;color:#fff;border:0;border-radius:9px;padding:7px 12px;margin:2px;cursor:pointer;font-weight:700}
#k3CP .tabs button.on,#k3CP button.b.on{background:#f59e0b;color:#111}#k3CP .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}
#k3CP .c{background:#0b1222;border:1px solid #ffffff1a;border-radius:11px;padding:10px}#k3CP button.x{float:right;background:#ef4444}
#k3CP .bar{height:12px;background:#0006;border-radius:7px;overflow:hidden}#k3CP .bar i{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#fde68a)}
#k3CP .tier{display:flex;align-items:center;gap:6px;justify-content:space-between}`;
document.head.appendChild(css);
const boss=document.createElement('div');boss.id='k3CBoss';boss.innerHTML='<b></b><div><i></i></div>';
const useB=document.createElement('div');useB.id='k3CUse';useB.innerHTML='<i></i>';
setTimeout(()=>{(document.body).append(hudEl,boss,useB)},0);

// ---------- MECCS-HOOKOK ----------
WP('launch',null,()=>{const g=G;C.objs=[];C.rocks=[];C.gr=[];C.boss=null;C.inv={band:0,aid:0,mix:0};C.arm=0;C.armT=0;C.use=null;C.tr=null;C.theme=null;C.ev=null;C.t=0;
 const mode=window.GAME_MODE||'royale';
 if(mode==='royale'&&SET.map!=='hun'){themeScene();setTimeout(()=>{if(G===g&&C.theme){/* később épített elemekre is */const T=TH[SET.map];scene.traverse(o=>{if(o.isMesh&&!o.userData.k3C&&o.material&&!Array.isArray(o.material)&&isGreen(o.material.color)){o.material=o.material.clone();o.material.color.setHex(T.ground);if(o.material.map)o.material.map=T.tex()}})}},2500)}
 if(mode==='royale'){const n=g.brMode?45:20;scat(n).forEach((p,i)=>gItem(['band','band','mix','aid','a1','a1','a2','a3'][i%8],p[0],p[1]))}
 if(mode==='royale'&&SET.ev){const e=SET.ev;C.ev=e;SET.ev=null;saveSet();const R=RULES[e.rule];try{R.start&&R.start(g)}catch(er){}setTimeout(()=>tell('🎪 '+e.kind+' ESEMÉNY-MECCS: '+R.n+' – '+R.d+' (×'+e.mult+' jutalom)'),1500)}
 if(g.train){C.tr={t:1};setTimeout(()=>tell('🤖 Gyakorló botok: '+SET.tBots+' db · '+DF[SET.tDiff].n+(SET.tBoss?' · boss is':'')),1200)}
 if(!SET.build&&mode==='royale')g._k3noB=1;
 const d=sData();if(d.eq&&g.pm){try{const s=spr(embTxt(d.eq),1.6);s.position.y=6.6;s.userData.k3C=1;g.pm.add(s)}catch(e){}}
 hudEl.style.display='flex'});
WP('kill',null,a=>{const g=G;if(!g)return;const e=a[0];if(C.ev&&RULES[C.ev.rule].kill)RULES[C.ev.rule].kill(g);
 if(e&&!g.train&&Math.random()<.22)gItem(['band','mix','aid','a1','a2'][Math.random()*5|0],e.x+RN(-1,1),e.z+RN(-1,1))});
WP('hurt',a=>{if(!G)return;let d=a[0];if(G.train&&C.tr){d*=(DF[SET.tDiff]||DF.norm).dmg}if(C.arm&&C.armT>0&&!a[1]){const A=ARM[C.arm],cut=d*A.r;C.armT-=cut*2;d-=cut;if(C.armT<=0){C.arm=0;tell('💥 A páncélod eltört!')}}if(G.train&&C.tr&&G.hp+G.sh-d<=2){G.hp=G.mhp;G.sh=G.msh;d=0;tell('💫 Edzőpályán nem esel ki – feltöltve')}a[0]=d});
WP('end',a=>{const g=G;if(!g||g._k3Cend)return;g._k3Cend=1;if(localStorage.getItem('x20ev')&&C.ev)localStorage.removeItem('x20ev');
 if((window.GAME_MODE||'royale')==='train')return;let p=10+(g.kills||0)*8+(a[0]?60:0);if(C.ev){p+=C.ev.sp;const bonus=Math.round((g.cash||0)*(C.ev.mult-1));g.cash=(g.cash||0)+bonus;C.ev.done=1;const ed=LSg('k3CEvDone',{});ed[C.ev.id]=1;LSs('k3CEvDone',ed)}
 addPts(p);setTimeout(()=>tell('⭐ +'+p+' szezonpont'),300)});
WP('update',null,a=>{const g=G;if(!g||!inM())return;const dt=a[0];C.t+=dt;
 if(C.ev){const R=RULES[C.ev.rule];try{R.tick&&R.tick(g,dt)}catch(e){}}
 if(g._k3noB){if(g.buildMode)g.buildMode=false}
 for(let i=C.gr.length-1;i>=0;i--){const it=C.gr[i];it.s.position.y=1.1+Math.sin(C.t*2.5+i)*.15;if(Math.hypot(it.x-g.x,it.z-g.z)<1.8&&(g.y||0)<3){if(take(it)){scene.remove(it.s);C.gr.splice(i,1)}}}
 if(C.use){C.use.t-=dt;useB.style.display='block';useB.firstChild.style.width=(100-C.use.t/C.use.T*100)+'%';if(g.hurt>1.45){C.use=null;tell('❌ Megszakítva (sebzés)')}else if(C.use.t<=0){const k=C.use.k;C.inv[k]--;ITEMS[k].u(g);tell('✔️ '+ITEMS[k].n);C.use=null}}else useB.style.display='none';
 if(C.snow){C.snow.position.set(g.x,0,g.z);const p=C.snow.geometry.attributes.position;for(let i=1;i<p.array.length;i+=3){p.array[i]-=dt*3;if(p.array[i]<0)p.array[i]=40}p.needsUpdate=true}
 C.rocks.forEach(r=>{if(r.ring)r.ring.visible=r.n>0});
 bossTick(g,dt);trTick(g,dt);rarTick(C.t);hudFrame(g);
 if(!C._hT||C.t-C._hT>.25){C._hT=C.t;let h='';const iv=C.inv;h+='<span>🩹'+iv.band+' 🧃'+iv.mix+' 🧰'+iv.aid+' <small>[⌫]</small></span>';if(C.arm)h+='<span style="border-color:'+ARM[C.arm].c+'">'+ARM[C.arm].n.split(' ')[0]+' '+Math.round(Math.max(0,C.armT))+'</span>';if(C.ev)h+='<span>🎪 '+RULES[C.ev.rule].n+'</span>';if(C.theme)h+='<span>'+TH[C.theme].n+'</span>';if(g.train&&C.tr)h+='<span style="color:'+DF[SET.tDiff].c+'">🤖 '+DF[SET.tDiff].n+'</span>';if(hudEl._h!==h){hudEl._h=h;hudEl.innerHTML=h}}});
// építés kikapcsolva → wall/brPlace tiltás
['wall','brPlace'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(){if(G&&G._k3noB){tell('🧱 Az építés ki van kapcsolva (JÁTÉKMENET panel)');return}return o.apply(this,arguments)}});
// kőbánya: E a szikla mellett → építőanyag
const nearRock=()=>G&&C.rocks.find(r=>r.n>0&&D2(r,G)<4.2);
{const ox=window.x20near;window.x20near=function(){try{if(inM()&&nearRock())return true}catch(e){}return ox?ox.apply(this,arguments):false}}
addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;
 if(e.code==='F1'){e.preventDefault();if(!inM()){if(P.style.display==='flex')closeP();else openP()}return}
 if(!inM())return;
 if(e.code==='Backspace'){e.preventDefault();useBest()}
 if(e.code==='KeyE'){const r=nearRock();if(r){r.n--;const v=SET.map==='tel'?25:30;if(window.BR)BR.mats=(BR.mats||0)+v;ftx(r.x,r.z,'+'+v+' 🪨 kő','');try{sfx('click')}catch(er){}}}},true);
// fénycsík kikapcsolás végén
WP('end',null,()=>{hudEl.style.display='none';boss.style.display='none';useB.style.display='none'});

// ---------- PANEL ----------
const P=document.createElement('div');P.id='k3CP';setTimeout(()=>document.body.appendChild(P),0);let tab=LSg('k3CTab','map');
function openP(){draw();P.style.display='flex'}function closeP(){P.style.display='none'}
function draw(){const s=season(),d=sData(),ed=LSg('k3CEvDone',{});let h='<div class="k3w"><button class="b x" data-x>✕</button><h2>🏝️ JÁTÉKMENET</h2><div class="tabs">'+[['map','🗺️ Sziget'],['sea','⭐ Szezon'],['ev','🎪 Események'],['tr','🤖 Gyakorlás'],['opt','🧱 Beállítások']].map(t=>'<button data-t="'+t[0]+'" class="'+(tab===t[0]?'on':'')+'">'+t[1]+'</button>').join('')+'</div>';
 if(tab==='map'){h+='<h3>Válassz szigetet a következő royale-meccshez</h3><div class="g">'+[['hun','🇭🇺 Közpénz-sziget','Az eredeti, zöld sziget városokkal.']].concat(Object.keys(TH).map(k=>[k,TH[k].n,TH[k].d])).map(m=>'<div class="c"><b>'+m[1]+'</b><div style="opacity:.75;font-size:12px;margin:4px 0 8px">'+m[2]+'</div><button class="b '+(SET.map===m[0]?'on':'')+'" data-m="'+m[0]+'">'+(SET.map===m[0]?'✔ Kiválasztva':'Kiválaszt')+'</button></div>').join('')+'</div><div style="opacity:.6;font-size:12px;margin-top:8px">A téma a royale-módra vonatkozik. A dísztárgyak InstancedMesh-ek, valódi fény nincs (gyors). A jelölt sziklák mellett E = kő → építőanyag.</div>'}
 if(tab==='sea'){const tier=TIERS.filter(t=>d.pts>=t.p).length;h+='<h3 style="color:'+s.th.c+'">'+s.th.e+' '+s.n+'. szezon: '+s.th.n+'</h3><div>'+s.week+'. hét / 8 · még '+s.left+' nap · '+d.pts+' szezonpont · '+tier+'/10 fokozat</div><div class="bar" style="margin:8px 0"><i style="width:'+Math.min(100,d.pts/1500*100)+'%"></i></div><div class="g">'+
  TIERS.map((t,i)=>{const got=d.cl.includes(i),can=d.pts>=t.p&&!got;const r=t.r.ft?'💵 '+fmt(t.r.ft)+' Ft':s.th.e+EMB[t.r.emb][0]+' '+EMB[t.r.emb][1]+' (embléma)';return '<div class="c tier"><span><b>'+(i+1)+'.</b> '+r+'<br><small style="opacity:.6">'+t.p+' pont</small></span>'+(got?'✔':can?'<button class="b on" data-cl="'+i+'">Átvesz</button>':'🔒')+'</div>'}).join('')+'</div>';
  h+='<h3>Emblémáid (a fejed fölött meccsben)</h3><div>'+(d.own.length?d.own.map(k=>'<button class="b '+(d.eq===k?'on':'')+'" data-eq="'+k+'">'+embTxt(k)+'</button>').join(''):'<i style="opacity:.6">Még nincs – gyűjts szezonpontot!</i>')+(d.eq?' <button class="b" data-eq="">Levesz</button>':'')+'</div><div style="opacity:.6;font-size:12px;margin-top:6px">Pont: 10/meccs + 8/kiesés + 60 győzelem + esemény-bónusz. 8 hetente új szezon, új téma és emblémák.</div>'}
 if(tab==='ev'){h+='<h3>Esemény-meccsek</h3><div class="g">'+events().map((e,i)=>{const R=RULES[e.rule],M=window._x14c&&_x14c.modes[e.mode];return '<div class="c"><b>'+(i?'📆 HETI':'📅 NAPI')+' ESEMÉNY</b><div style="font-size:12px;margin:6px 0;line-height:1.5">🎮 Mód: '+(M?M.n:'–')+'<br>📜 Szabály: '+R.n+' – '+R.d+(e.wev?'<br>🌍 Világesemény: '+e.wev:'')+'<br>🏆 Jutalom: ×'+e.mult+' meccspénz, +'+e.sp+' szezonpont</div>'+(ed[e.id]?'<div style="color:#4ade80">✔ Ma/ezen a héten már teljesítve (újra játszható, pont nélkül is)</div>':'')+'<button class="b on" data-ev="'+i+'">▶ Indítás</button></div>'}).join('')+'</div>'}
 if(tab==='tr'){h+='<h3>Gyakorló mód botok ellen (Edzőpálya)</h3><div>Botok száma: '+[0,1,3,5,8].map(n=>'<button class="b '+(SET.tBots===n?'on':'')+'" data-bn="'+n+'">'+n+'</button>').join('')+'</div><div style="margin-top:6px">Nehézség: '+Object.keys(DF).map(k=>'<button class="b '+(SET.tDiff===k?'on':'')+'" style="'+(SET.tDiff===k?'':'color:'+DF[k].c)+'" data-df="'+k+'">'+DF[k].n+'</button>').join('')+'</div><div style="margin-top:6px"><button class="b '+(SET.tBoss?'on':'')+'" data-tb>👔 Boss-gyakorlás: '+(SET.tBoss?'BE':'KI')+'</button></div><div style="margin-top:10px"><button class="b on" data-go>▶ Edzőpálya indítása</button></div><div style="opacity:.6;font-size:12px;margin-top:6px">A botok elesés után 3 mp múlva újraéledek. Edzőpályán nem esel ki. A royale botjainak nehézsége az 🤖 ELLENFÉL-AI panelen (F3) állítható.</div>'}
 if(tab==='opt'){h+='<h3>Építés a royale-ban</h3><button class="b '+(SET.build?'on':'')+'" data-bd>🧱 Építés: '+(SET.build?'BEKAPCSOLVA':'KIKAPCSOLVA')+'</button><div style="opacity:.7;font-size:12px;margin-top:6px">Fal/rámpa/padló: B = építő mód (a meglévő rendszer). Nyersanyag: fák/épületek csákánnyal, ÚJ: jelölt sziklák E-vel (3× / szikla). Kikapcsolva csak lövöldözés.</div><h3>Gyógyító- és páncéleszközök</h3><div style="font-size:13px;line-height:1.6">🩹 Kötszer (2 mp, +15 HP, max 75%) · 🧃 Kevert ital (3 mp, +25 HP +25 pajzs) · 🧰 Elsősegély (5 mp, teljes HP)<br>🦺 Könnyű mellény −12% · 🥋 Taktikai −22% · 🛡️ Nehéz páncél −33% (kopik)<br><b>Backspace</b> = legjobb gyógyító használata (sebzés megszakítja). Kis/nagy pajzsital a ládákban továbbra is.</div><h3>Ritkaság</h3><div style="font-size:13px">A földön lévő fegyvereken ritkaság-színű fénycsík + talajfény, a lőszer-kijelzőn ritkaság-keret.</div><h3>Boss</h3><div style="font-size:13px">A FŐTANÁCSADÓ boss 3 fázisú: célzott sorozat → körkörös lövedékgyűrű → dühöngő gyorstüzelés + erősítés. Életcsík felül.</div>'}
 P.innerHTML=h+'</div>';
 P.querySelector('[data-x]').onclick=closeP;P.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;LSs('k3CTab',tab);draw()});
 const on=(sel,f)=>P.querySelectorAll(sel).forEach(b=>b.onclick=()=>{f(b);saveSet();draw()});
 on('[data-m]',b=>SET.map=b.dataset.m);on('[data-bn]',b=>SET.tBots=+b.dataset.bn);on('[data-df]',b=>SET.tDiff=b.dataset.df);on('[data-tb]',()=>SET.tBoss=!SET.tBoss);on('[data-bd]',()=>SET.build=!SET.build);
 on('[data-cl]',b=>claim(+b.dataset.cl));on('[data-eq]',b=>{const d=sData();d.eq=b.dataset.eq||null;LSs('k3CSeason',d)});
 P.querySelectorAll('[data-ev]').forEach(b=>b.onclick=()=>startEvent(+b.dataset.ev));
 const go=P.querySelector('[data-go]');if(go)go.onclick=()=>{closeP();const t=$$('soTr');if(t)t.click()}}
C.open=openP;C.useBest=useBest;C.season=season;C.events=events;C.addPts=addPts;C.spawnBoss=()=>{const e=G&&G.en.find(e=>!e.dead);if(e){e._boss=1;e.hp*=6;e.mhp=e.hp;e.name='👔 TESZT BOSS'}return !!e};C.give=()=>{C.inv={band:3,aid:2,mix:2}};
// lobby gomb (x14hub → lobby2 automatikusan besorolja: „JÁTÉK” kulcsszó)
function hub(){const h=$$('x14hub');if(!h||$$('k3CBtn'))return;const b=document.createElement('button');b.id='k3CBtn';b.style.cssText='background:linear-gradient(90deg,#b45309,#f59e0b);color:#fff;border:1px solid #fde68a;border-radius:10px;padding:6px 12px;font:800 12px system-ui;cursor:pointer';b.title='JÁTÉKMENET: sziget, szezon, esemény-meccsek (F1)';b.textContent='🏝️ JÁTÉKMENET';b.onclick=openP;h.appendChild(b)}
setInterval(hub,1500);setTimeout(hub,900);
})();
