// extra140f.js – MENTSD MEG A VILÁGOT II: 2. fejezet, napi küldetés, bázisépítés, kísérők, páncél, képességfa,
// horgász-enciklopédia, világesemények, főellenség, küldetésnapló. Prefix: x14f. Billentyű: F9. Mentés: k3x14f
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('x14f WP missing '+n);return}window[n]=function(){let s;try{s=pre?pre(arguments):0}catch(e){console.error(e)}const r=o.apply(this,arguments);try{post&&post(arguments,s,r)}catch(e){console.error('x14f '+n,e)}return r}};
const K='k3x14f',$=id=>document.getElementById(id),R=Math.random;
const ld=()=>{try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return{}}};
const D=Object.assign({ch:0,cp:0,sp:0,sk:{},helm:0,vest:0,comp:{},kills:0,log:[],daily:{},fishC:{},evN:0,built:0,boss:0},ld());
const sv=()=>{try{localStorage.setItem(K,JSON.stringify(D))}catch(e){}};
const STW=()=>!!(typeof G!=='undefined'&&G&&G.stw&&window._STW&&_STW());
const PLAY=()=>STW()&&!G.over&&G.phase==='play';
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const sayx=t=>{try{say(t)}catch(e){}};
const log=(t,ic)=>{D.log.unshift({t,ic:ic||'📜',d:Date.now()});D.log=D.log.slice(0,60);sv()};
const pay=(zs,f)=>{try{BR.zs=(BR.zs|0)+zs;st.s('k3br',BR)}catch(e){}try{S.c+=f;save()}catch(e){}};
const BIO={camp:'Tábor',tun:'Fagyos Tundra',vol:'Hamuföld',mus:'Gombaerdő',des:'Napégette Romok',swa:'Mocsár',lak:'Tóvidék',sky:'Égi szigetek',obs:'Obszidián-síkság'};

// ---------- CSS ----------
const css=document.createElement('style');css.textContent=`
.x14f{font-family:Rajdhani,sans-serif;color:#e2e8f0;text-align:left;min-width:min(860px,88vw)}
.x14f h1{font:800 32px Rajdhani;margin:0 0 4px;background:linear-gradient(90deg,#fde68a,#f59e0b,#fb7185);-webkit-background-clip:text;color:transparent}
.x14fTabs{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 12px}
.x14fTabs button{background:rgba(30,41,59,.85);border:1px solid #475569;color:#cbd5e1;border-radius:10px;padding:6px 11px;font:700 14px Rajdhani;cursor:pointer}
.x14fTabs button.on{background:linear-gradient(135deg,#f59e0b,#b45309);color:#111;border-color:#fde68a;box-shadow:0 0 14px #f59e0b88}
.x14fBox{max-height:58vh;overflow:auto;padding-right:6px}
.x14fC{background:linear-gradient(145deg,rgba(30,27,75,.75),rgba(15,23,42,.85));border:1px solid #6366f155;border-radius:14px;padding:10px 14px;margin:0 0 8px}
.x14fC.done{border-color:#22c55e88}.x14fC.cur{border-color:#fbbf24;box-shadow:0 0 16px #f59e0b44}.x14fC.lock{opacity:.45}
.x14fC b{font-size:18px;color:#fde68a}.x14fC p{margin:4px 0;color:#cbd5e1;font-size:15px}
.x14fG{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
.x14fBar{height:8px;background:#1e293b;border-radius:6px;overflow:hidden;margin-top:4px}.x14fBar i{display:block;height:100%;background:linear-gradient(90deg,#f59e0b,#fde047)}
.x14fBtn{background:linear-gradient(135deg,#f59e0b,#d97706);border:0;border-radius:9px;padding:5px 12px;font:800 14px Rajdhani;color:#111;cursor:pointer;margin-top:6px}
.x14fBtn[disabled]{filter:grayscale(1);opacity:.5;cursor:default}
#x14fHud{position:fixed;right:14px;top:150px;z-index:8;width:250px;background:linear-gradient(145deg,rgba(15,23,42,.88),rgba(49,10,60,.8));border:1px solid #f59e0b77;border-radius:12px;padding:8px 11px;font:600 14px Rajdhani;color:#e2e8f0;display:none;pointer-events:none}
#x14fHud b{color:#fde68a}
#x14fBoss{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:9;width:min(560px,80vw);display:none;text-align:center;font:800 18px Rajdhani;color:#fecaca;text-shadow:0 0 8px #000}
#x14fBoss .bb{height:16px;border:2px solid #fca5a5;border-radius:9px;background:#1f0a0a;overflow:hidden;margin-top:3px}#x14fBoss .bb i{display:block;height:100%;background:linear-gradient(90deg,#7f1d1d,#ef4444,#f97316);transition:width .2s}
#x14fEv{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:9;font:800 34px Rajdhani;color:#fde68a;text-shadow:0 0 18px #f97316,0 2px 4px #000;opacity:0;transition:opacity .5s;pointer-events:none;text-align:center}
#x14hub .x14fHb{background:linear-gradient(135deg,#1e1b4b,#7c2d12);border:1px solid #f59e0b;color:#fde68a;border-radius:12px;padding:7px 10px;font:800 14px Rajdhani;cursor:pointer;box-shadow:0 4px 14px #0008}`;
document.head.appendChild(css);
const hudEl=document.createElement('div');hudEl.id='x14fHud';document.body.appendChild(hudEl);
const bossEl=document.createElement('div');bossEl.id='x14fBoss';bossEl.innerHTML='<span id="x14fBn">👑 A HAMVAK URA</span><div class="bb"><i id="x14fBi" style="width:100%"></i></div>';document.body.appendChild(bossEl);
const evEl=document.createElement('div');evEl.id='x14fEv';document.body.appendChild(evEl);
const evBan=(t)=>{evEl.innerHTML=t;evEl.style.opacity=1;clearTimeout(evEl._t);evEl._t=setTimeout(()=>evEl.style.opacity=0,3200)};

// ---------- 2. FEJEZET ----------
const CH=[
 {t:'A hamu suttogása',ty:'bio',v:'vol',n:1,rw:[300,6000],s:'A Bölcs álmában hamu hullott a csillagokból. Bár az Árnykirály elbukott, a Hamuföld mélyén valami új parázs izzik. Járj utána!',o:'Juss el a Hamuföldre'},
 {t:'Tisztogatás',ty:'kill',n:15,rw:[350,7000],s:'A vulkán körül megzavarodott lények kóborolnak – mintha valaki hívná őket. Tisztítsd meg az utakat!',o:'Győzz le 15 lényt'},
 {t:'Védvonal',ty:'build',n:4,rw:[400,8000],s:'Ha jön a vihar, a tábornak falak kellenek. Rakj le falakat vagy csapdákat a rácsra (F9 → Bázis).',o:'Építs 4 falat/csapdát'},
 {t:'Szövetségesek',ty:'comp',n:1,rw:[400,8000],s:'Egyedül senki sem győz. Két vándor harcos keres munkát a táborban – toborozz legalább egyet!',o:'Toborozz 1 kísérőt'},
 {t:'Kovácsolt bizalom',ty:'armor',n:1,rw:[450,9000],s:'A kovács szerint a hamu átéget minden ruhát. Szerezz sisakot vagy mellényt!',o:'Vegyél páncélt (F9 → Páncél)'},
 {t:'Mocsári jelek',ty:'biokill',v:'swa',n:10,rw:[500,10000],s:'A mocsár iszapjában izzó rúnák jelentek meg. Az őrzőik nem hagyják, hogy közel menj.',o:'Győzz le 10 lényt a Mocsárban'},
 {t:'Hullócsillag',ty:'event',v:'meteor',n:1,rw:[550,11000],s:'Az égbolt megreped – parázskövek zuhannak a földre. Éld túl a becsapódást, és nézd meg, mit hoz!',o:'Éld túl egy meteorzáport'},
 {t:'Éjféli ostrom',ty:'event',v:'night',n:1,rw:[600,12000],s:'A hold elsötétül. Ma éjjel a lények egyszerre rontanak a táborra. Tartsd ki hajnalig!',o:'Éld túl az éjszakai rohamot'},
 {t:'Az obszidián kapu',ty:'bio',v:'obs',n:1,rw:[650,13000],s:'A rúnák egy irányba mutatnak: az Obszidián-síkság fekete kapujához. Ott vár a hamu forrása.',o:'Juss el az Obszidián-síkságra'},
 {t:'A Hamvak Ura',ty:'boss',n:1,rw:[1500,40000],s:'Az Árnykirály tüzéből született a Hamvak Ura. Ha legyőzöd, a világ végleg fellélegzik.',o:'Győzd le a Hamvak Urát'}];
const cur=()=>D.ch<CH.length?CH[D.ch]:null;
function chProg(n){const c=cur();if(!c)return;D.cp=Math.min(c.n,D.cp+(n||1));if(D.cp>=c.n)chDone();sv()}
function chDone(){const c=cur();if(!c)return;pay(c.rw[0],c.rw[1]);D.sp++;log('2. fejezet – '+c.t+' teljesítve (+'+c.rw[0]+' 🪙, +'+ft(c.rw[1])+', +1 képességpont)','✅');
 evBan('✅ '+c.t+'<br><small style="font-size:18px">+'+c.rw[0]+' 🪙 · +'+ft(c.rw[1])+' · +1 ⭐</small>');try{sfx('win')}catch(e){}
 D.ch++;D.cp=0;sv();const n=cur();if(n){log('Új küldetés: '+n.t,'📜');setTimeout(()=>{sayx('📜 2. FEJEZET: '+n.t);startObj()},3500)}else{log('A 2. fejezet véget ért – a világ fellélegzett!','🌅');setTimeout(()=>evBan('🌅 A 2. FEJEZET VÉGE<br><small style="font-size:18px">A Hamvak Ura elbukott!</small>'),3600)}}
function startObj(){const c=cur();if(!c||!PLAY())return;if(c.ty==='event')EV.start(c.v,true);if(c.ty==='boss'&&!BOSS.e)BOSS.spawn();if(c.ty==='comp'&&Object.keys(D.comp).length)chProg(1);if(c.ty==='armor'&&(D.helm||D.vest))chProg(1)}

// ---------- NAPI ----------
const DQ=[['kill',30,'Győzz le 30 lényt'],['build',6,'Rakj le 6 bázis-elemet'],['event',2,'Élj túl 2 világeseményt'],['allyk',8,'Kísérőid győzzenek le 8 lényt'],['bio',4,'Fedezz fel / járj be 4 tájat']];
const today=()=>new Date().toISOString().slice(0,10);
function daily(){const d=today();if(D.daily.day!==d){let h=0;for(const c of d)h=(h*31+c.charCodeAt(0))>>>0;D.daily={day:d,i:h%DQ.length,p:0,ok:0,bios:{}};sv()}return D.daily}
function dProg(ty,n,bio){const q=daily();if(q.ok||DQ[q.i][0]!==ty)return;if(ty==='bio'){if(q.bios[bio])return;q.bios[bio]=1}q.p+=n||1;if(q.p>=DQ[q.i][1]){q.ok=1;pay(400,10000);D.sp++;log('Napi küldetés kész: '+DQ[q.i][2]+' (+400 🪙, +10 000 Ft, +1 ⭐)','📅');evBan('📅 NAPI KÜLDETÉS KÉSZ!<br><small style="font-size:18px">+400 🪙 · +1 ⭐</small>')}sv()}

// ---------- KÉPESSÉGFA ----------
const SK=[['dmg','⚔️ Hamupenge','+8% sebzés / szint'],['hp','❤️ Edzett test','+15 max. életerő / szint'],['reg','🌿 Gyógyulás','+0,6 HP/mp regeneráció / szint'],['arm','🛡️ Vasbőr','+4% sebzéscsökkentés / szint'],['ally','🤝 Vezér','+25% kísérő-sebzés / szint'],['trap','🪤 Csapdamester','+35% csapdasebzés, -20% építési ár / szint']];
const sk=k=>D.sk[k]|0;
window.x14fSk=k=>{if(D.sp<1||sk(k)>=3)return;D.sp--;D.sk[k]=sk(k)+1;log('Képesség fejlesztve: '+SK.find(s=>s[0]===k)[1]+' '+D.sk[k]+'. szint','⭐');sv();try{sfx('buy')}catch(e){}panel('sk')};

// ---------- PÁNCÉL ----------
const HELM=[['–',0,0],['🪖 Bőrsisak',5,3000],['⛑️ Acélsisak',10,9000],['💠 Kristálysisak',15,20000]];
const VEST=[['–',0,0],['🦺 Bőrmellény',8,4000],['🛡️ Láncing',16,12000],['🔷 Hamuvért',24,26000]];
const armRed=()=>Math.min(.6,(HELM[D.helm][1]+VEST[D.vest][1]+sk('arm')*4)/100);
window.x14fBuy=w=>{const T=w==='h'?HELM:VEST,k=w==='h'?'helm':'vest',n=D[k]+1;if(n>=T.length||S.c<T[n][2])return;S.c-=T[n][2];try{save()}catch(e){}D[k]=n;log('Páncél: '+T[n][0]+' megvéve','🛡️');sv();try{sfx('buy')}catch(e){}const c=cur();if(c&&c.ty==='armor'&&PLAY())chProg(1);panel('arm')};
{const o=window.hurt;if(typeof o==='function')window.hurt=function(d,storm){if(G&&G.stw&&!storm&&typeof d==='number')d*=1-armRed();return o.call(this,d,storm)}}

// ---------- KÍSÉRŐK ----------
const CT={ij:{n:'Íjász Örs',e:'🏹',c:0x15803d,rng:20,dmg:22,cd:.9,cost:600,d:'Távolról lő, gyors és pontos.'},pa:{n:'Pajzsos Bendegúz',e:'🛡️',c:0x1e3a8a,rng:3.4,dmg:45,cd:1.2,cost:800,d:'Közelharcos, magára vonja a lényeket.'}};
let ALLY=[];
window.x14fRec=k=>{const t=CT[k];if(D.comp[k]||(BR.zs|0)<t.cost)return;BR.zs-=t.cost;try{st.s('k3br',BR)}catch(e){}D.comp[k]=1;log('Kísérő toborozva: '+t.n,'🤝');sv();try{sfx('buy')}catch(e){}if(PLAY()){spawnAlly(k);const c=cur();if(c&&c.ty==='comp')chProg(1)}panel('comp')};
function spawnAlly(k){const t=CT[k];let m;try{m=person(t.c,t.e,1)}catch(e){m=new THREE.Mesh(new THREE.BoxGeometry(.8,1.8,.8),new THREE.MeshStandardMaterial({color:t.c}))}
 const a={k,t,m,x:G.x+(k==='ij'?-3:3),z:G.z-2,cd:0,ph:R()*6};m.position.set(a.x,0,a.z);scene.add(m);ALLY.push(a)}
function hitEn(e,d,src){if(!e||e.dead)return;e.hp-=d;try{ftx(e.x,e.z,'-'+Math.round(d),'')}catch(er){}if(e.hp<=0&&!e.dead){e.dead=true;if(src==='ally')dProg('allyk',1);try{kill(e)}catch(er){}}}
function tracer(ax,az,bx,bz,col){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(ax,1.6,az),new THREE.Vector3(bx,1.3,bz)]);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:col}));scene.add(l);setTimeout(()=>{scene.remove(l);g.dispose()},120)}
function allyTick(dt){ALLY.forEach((a,i)=>{const t=a.t;let tg=null,bd=1e9;for(const e of G.en){if(e.dead)continue;const d=Math.hypot(e.x-a.x,e.z-a.z);if(d<bd&&Math.hypot(e.x-G.x,e.z-G.z)<30){bd=d;tg=e}}
 let tx=G.x+Math.cos(i*3+1)*3,tz=G.z+Math.sin(i*3+1)*3;if(tg&&(t.rng<5||bd>t.rng)){tx=tg.x;tz=tg.z}
 const dx=tx-a.x,dz=tz-a.z,dd=Math.hypot(dx,dz);if(dd>(tg?t.rng*.8:1.5)){const s=Math.min(dd,(dd>25?14:7)*dt);a.x+=dx/dd*s;a.z+=dz/dd*s}
 if(dd>60){a.x=G.x-2;a.z=G.z-2}
 a.m.position.set(a.x,0,a.z);const look=tg||{x:G.x,z:G.z};a.m.rotation.y=Math.atan2(look.x-a.x,look.z-a.z);
 a.cd-=dt;if(tg&&bd<=t.rng&&a.cd<=0){a.cd=t.cd;hitEn(tg,t.dmg*(1+sk('ally')*.25)*(1+(_STW().lvl||0)*.1),'ally');if(t.rng>5)tracer(a.x,a.z,tg.x,tg.z,0x86efac);else{tg.x+=(tg.x-a.x)/Math.max(bd,.1)*.6;tg.z+=(tg.z-a.z)/Math.max(bd,.1)*.6}}})}

// ---------- BÁZISÉPÍTÉS ----------
const GRID=4;let BASE=[];
const PCS={fal:{n:'🧱 Fafal',c:{wood:3},hp:400},kofal:{n:'🪨 Kőfal',c:{stone:4},hp:900},tus:{n:'🪤 Tüskecsapda',c:{wood:2,stone:2},trap:30},tuz:{n:'🔥 Tűzcsapda',c:{crystal:1,stone:3},trap:55}};
const pcost=p=>{const o={};Object.entries(p.c).forEach(([k,v])=>o[k]=Math.max(1,Math.round(v*(1-sk('trap')*.2))));return o};
window.x14fPlace=k=>{if(!PLAY())return;const W=_STW(),p=PCS[k],c=pcost(p);if(!Object.entries(c).every(([r,v])=>(W.res[r]|0)>=v)){sayx('❌ Nincs elég nyersanyag!');return}
 const fx=Math.cos(G.ang||0),fz=Math.sin(G.ang||0);
 const gx=Math.round((G.x+fx*4)/GRID)*GRID,gz=Math.round((G.z+fz*4)/GRID)*GRID;if(BASE.some(b=>b.x===gx&&b.z===gz)){sayx('❌ Ez a rácsmező foglalt!');return}
 Object.entries(c).forEach(([r,v])=>W.res[r]-=v);let m;
 if(p.trap){m=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(3.6,.15,3.6),new THREE.MeshStandardMaterial({color:k==='tuz'?0x7c2d12:0x44403c}));base.position.y=.08;m.add(base);
  for(let i=0;i<9;i++){const s=new THREE.Mesh(new THREE.ConeGeometry(.18,.7,6),new THREE.MeshStandardMaterial({color:k==='tuz'?0xf97316:0x9ca3af,emissive:k==='tuz'?0xea580c:0,emissiveIntensity:.8}));s.position.set((i%3-1)*1.1,.45,((i/3|0)-1)*1.1);m.add(s)}}
 else{m=new THREE.Mesh(new THREE.BoxGeometry(GRID,3,.6),new THREE.MeshStandardMaterial({color:k==='kofal'?0x78716c:0x92400e,roughness:.9}));m.position.y=1.5;if(Math.abs(fx)>Math.abs(fz))m.rotation.y=Math.PI/2;m.castShadow=true}
 m.position.x=gx;m.position.z=gz;scene.add(m);const b={k,p,m,x:gx,z:gz,hp:p.hp||1,cd:0};
 if(!p.trap){b.col={x:gx,z:gz,r:2,h:3};G.col.push(b.col)}BASE.push(b);D.built++;sv();sayx('🏗️ '+p.n+' lerakva ('+gx+', '+gz+')');try{sfx('buy')}catch(e){}
 dProg('build',1);const ch=cur();if(ch&&ch.ty==='build')chProg(1)};
function baseTick(dt){for(const b of BASE){if(b.p.trap){b.cd-=dt;if(b.cd>0)continue;let hit=0;for(const e of G.en)if(!e.dead&&Math.abs(e.x-b.x)<2.1&&Math.abs(e.z-b.z)<2.1){hitEn(e,b.p.trap*(1+sk('trap')*.35),'trap');e.slow=.5;hit=1}if(hit)b.cd=1}
 else{for(const e of G.en){if(e.dead)continue;const d=Math.hypot(e.x-b.x,e.z-b.z);if(d<2.4){const k=(2.4-d)/Math.max(d,.1);e.x+=(e.x-b.x)*k*.5;e.z+=(e.z-b.z)*k*.5;b.hp-=dt*15}}
  if(b.hp<=0){scene.remove(b.m);G.col=G.col.filter(c=>c!==b.col);b.dead=1;sayx('💥 Egy fal leomlott!')}}}BASE=BASE.filter(b=>!b.dead)}

// ---------- VILÁGESEMÉNYEK ----------
const EV={t:70+R()*60,on:null,
 start(k,forced){if(this.on)return;const W=_STW();if(k==='meteor'){this.on={k,t:16,n:0,fall:[]};evBan('☄️ METEORZÁPOR!<br><small style="font-size:18px">Kerüld a vörös köröket!</small>')}
  else{this.on={k,t:45,sp:0};evBan('🌑 ÉJSZAKAI ROHAM!<br><small style="font-size:18px">Éld túl 45 másodpercig!</small>');for(let i=0;i<8;i++)this.spawn()}
  log('Világesemény: '+(k==='meteor'?'meteorzápor':'éjszakai roham'),'🌠');try{sfx('alarm')}catch(e){}},
 spawn(){const a=R()*6.283,r=22+R()*10,x=G.x+Math.cos(a)*r,z=G.z+Math.sin(a)*r;if(!inHU(x,z))return;try{const e=sp(R()<.5?'prop':'nav',x,z);const L=_STW().lvl||0;e.hp=e.mhp=110*(1+L*.15);e.m.traverse(o=>{if(o.isMesh&&o.material&&o.material.color){o.material=o.material.clone();o.material.color.multiplyScalar(.35);if(o.material.emissive){o.material.emissive.setHex(0x3b0764);o.material.emissiveIntensity=.6}}});G.en.push(e)}catch(er){}},
 tick(dt){const o=this.on;if(!o){this.t-=dt;if(this.t<=0){this.t=110+R()*80;this.start(R()<.5?'meteor':'night')}return}o.t-=dt;
  if(o.k==='meteor'){o.n-=dt;if(o.n<=0&&o.t>2){o.n=1.1;const x=G.x+(R()-.5)*30,z=G.z+(R()-.5)*30;const ring=new THREE.Mesh(new THREE.RingGeometry(5,6,32),new THREE.MeshBasicMaterial({color:0xef4444,transparent:true,opacity:.75,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(x,.15,z);scene.add(ring);
    const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2,0),new THREE.MeshStandardMaterial({color:0x431407,emissive:0xf97316,emissiveIntensity:1.5}));rock.position.set(x+20,60,z);scene.add(rock);o.fall.push({x,z,ring,rock,t:2.4})}
   o.fall.forEach(f=>{f.t-=dt;const k=Math.max(0,f.t/2.4);f.rock.position.set(f.x+20*k,60*k+.6,f.z);f.ring.material.opacity=.4+.4*Math.sin(f.t*20);
    if(f.t<=0&&!f.x_){f.x_=1;scene.remove(f.ring);setTimeout(()=>scene.remove(f.rock),2500);if(Math.hypot(G.x-f.x,G.z-f.z)<6)hurt(25);for(const e of G.en)if(!e.dead&&Math.hypot(e.x-f.x,e.z-f.z)<6)hitEn(e,120,'ev');try{_STW().res.crystal++;ftx(f.x,f.z,'+1 💎','')}catch(er){}try{tn(70,'sawtooth',.3,.2)}catch(er){}}});o.fall=o.fall.filter(f=>!f.x_)}
  else{o.sp-=dt;if(o.sp<=0){o.sp=5;this.spawn();this.spawn()}const dk=new THREE.Color(0x05030f);scene.fog.color.lerp(dk,.6);if(scene.background&&scene.background.lerp)scene.background.lerp(dk,.6);scene.fog.far=Math.min(scene.fog.far,140)}
  if(o.t<=0){const k=o.k;this.on=null;D.evN++;sv();pay(150,3000);evBan((k==='meteor'?'☄️ A ZÁPOR VÉGET ÉRT':'🌅 HAJNALODIK!')+'<br><small style="font-size:18px">+150 🪙 · +3000 Ft</small>');dProg('event',1);const c=cur();if(c&&c.ty==='event'&&c.v===k)chProg(1)}},
 clear(){if(this.on&&this.on.fall)this.on.fall.forEach(f=>{scene.remove(f.ring);scene.remove(f.rock)});this.on=null;this.t=70+R()*60}};
function inHU(x,z){let c=false;for(let i=0,j=HU.length-1;i<HU.length;j=i++){const a=HU[i],b=HU[j];if((a[1]>z)!==(b[1]>z)&&x<(b[0]-a[0])*(z-a[1])/(b[1]-a[1])+a[0])c=!c}return c}

// ---------- FŐELLENSÉG ----------
const BOSS={e:null,
 spawn(){let x=G.x+18,z=G.z+18;for(let k=0;k<20&&!inHU(x,z);k++){const a=R()*6.28;x=G.x+Math.cos(a)*15;z=G.z+Math.sin(a)*15}
  const e=sp('hyd',x,z);scene.remove(e.m);const g=new THREE.Group(),mt=new THREE.MeshStandardMaterial({color:0x1c0a00,emissive:0xff3d00,emissiveIntensity:.9,roughness:.5});
  const body=new THREE.Mesh(new THREE.DodecahedronGeometry(2.4,1),mt);body.position.y=3;g.add(body);const head=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,0),mt);head.position.y=6;g.add(head);
  for(let i=0;i<5;i++){const h=new THREE.Mesh(new THREE.ConeGeometry(.3,1.6,6),new THREE.MeshStandardMaterial({color:0xfde047,emissive:0xf59e0b,emissiveIntensity:1.2}));h.position.set(Math.cos(i*1.26)*.9,7.3,Math.sin(i*1.26)*.9);g.add(h)}
  [-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.9,3.5,.9),mt);a.position.set(s*2.9,3.4,0);a.rotation.z=s*.4;g.add(a);const ey=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:0xfffbeb}));ey.position.set(s*.45,6.1,1.1);g.add(ey)});
  e.m=g;scene.add(g);const L=_STW().lvl||0;e.hp=e.mhp=7000*(1+L*.1);e.sp=2.6;e.b=true;e.r=3.2;e.x14fB=1;G.en.push(e);this.e=e;this.st=6;bossEl.style.display='block';
  evBan('👑 A HAMVAK URA MEGÉRKEZETT!');log('Főellenség-harc: A Hamvak Ura','👑');try{sfx('alarm')}catch(er){}},
 tick(dt){const e=this.e;if(!e)return;if(e.dead||!G.en.includes(e)&&e.hp>0===false){this.e=null;bossEl.style.display='none';return}
  $('x14fBi').style.width=Math.max(0,e.hp/e.mhp*100)+'%';$('x14fBn').textContent='👑 A HAMVAK URA – '+Math.max(0,Math.round(e.hp)).toLocaleString('hu-HU')+' HP'+(e.hp<e.mhp*.5?' · 🔥 DÜH':'');
  if(e.m)e.m.rotation.y+=dt*.6;this.st-=dt;if(this.st<=0){this.st=e.hp<e.mhp*.5?4:6.5;const d=Math.hypot(G.x-e.x,G.z-e.z);
   if(R()<.5){evBan('🔥 HAMUHULLÁM!');if(d<12)hurt(30);for(const b of BASE)if(!b.p.trap&&Math.hypot(b.x-e.x,b.z-e.z)<12)b.hp-=300}
   else{evBan('💀 Hamuszolgák!');for(let i=0;i<3;i++)EV.spawn()}}}};
WP('kill',null,a=>{const e=a[0];if(!STW()||!e)return;D.kills++;if(D.kills%30===0){D.sp++;sayx('⭐ +1 képességpont (30 legyőzött lény)')}dProg('kill',1);const c=cur(),W=_STW();
 if(c&&(c.ty==='kill'||(c.ty==='biokill'&&W.bio===c.v)))chProg(1);
 if(e.x14fB){BOSS.e=null;bossEl.style.display='none';D.boss++;evBan('👑 A HAMVAK URA ELBUKOTT!');if(c&&c.ty==='boss')chProg(1)}sv()});

// ---------- MECCS-ÉLETCIKLUS ----------
let lastBio=null,regT=0;
WP('launch',null,()=>{ALLY=[];BASE=[];BOSS.e=null;EV.clear();bossEl.style.display='none';if(!STW())return;const W=_STW();
 W.dmgB=(W.dmgB||1)*(1+sk('dmg')*.08);G.mhp+=sk('hp')*15;G.hp=G.mhp;Object.keys(D.comp).forEach(spawnAlly);daily();
 setTimeout(()=>{if(!PLAY())return;const c=cur();if(c){sayx('📜 2. FEJEZET: '+c.t+' – F9: napló');startObj()}},6000)});
WP('update',null,a=>{const dt=a[0];if(!PLAY()){hudEl.style.display='none';return}const W=_STW();
 if(W.bio!==lastBio){lastBio=W.bio;dProg('bio',1,W.bio);const c=cur();if(c&&c.ty==='bio'&&W.bio===c.v)chProg(1)}
 if(sk('reg')){regT+=dt;if(regT>1){regT=0;G.hp=Math.min(G.mhp,G.hp+sk('reg')*.6)}}
 try{allyTick(dt)}catch(e){console.error(e)}try{baseTick(dt)}catch(e){console.error(e)}try{EV.tick(dt)}catch(e){console.error(e)}try{BOSS.tick(dt)}catch(e){console.error(e)}
 if((hudEl._t=(hudEl._t||0)+dt)>.3){hudEl._t=0;const c=cur(),q=daily();const h='<b>🌋 2. FEJEZET '+(c?(D.ch+1)+'/10':'✔')+'</b><br>'+(c?c.t+'<br><small>'+c.o+' – '+D.cp+'/'+c.n+'</small>':'Minden küldetés kész!')+'<br><b>📅 Napi:</b> <small>'+DQ[q.i][2]+' '+(q.ok?'✅':q.p+'/'+DQ[q.i][1])+'</small>'+(EV.on?'<br><b style="color:#fca5a5">'+(EV.on.k==='meteor'?'☄️ Meteorzápor':'🌑 Éjszakai roham')+' '+Math.ceil(EV.on.t)+' mp</b>':'')+'<br><small style="color:#94a3b8">🛡️ '+Math.round(armRed()*100)+'% · F9 menü</small>';if(hudEl._h!==h){hudEl._h=h;hudEl.innerHTML=h}hudEl.style.display='block'}});
WP('end',null,()=>{hudEl.style.display='none';bossEl.style.display='none';EV.clear();ALLY.forEach(a=>scene.remove(a.m));ALLY=[];BASE=[];BOSS.e=null});

// ---------- PANEL ----------
const FISH=[['Arany koi',1],['Fehér koi',1],['Pöttyös koi',1],['Ezüst keszeg',1],['Holdfény-ponty',2],['Szivárvány-pisztráng',2],['Csillagpikkelyes harcsa',3],['Bölcs öreg teknős',3],['Elveszett csizma 🥾',0],['Üzenet egy palackban 📜',0]];
const RAR=['🗑️ Kacat','⚪ Gyakori','🔵 Ritka','🟣 Legendás'];
window.x14fFish=n=>{const FJ=(()=>{try{return JSON.parse(localStorage.getItem('k3fish')||'{}')}catch(e){return{}}})();if(!FJ[n]||D.fishC[n])return;D.fishC[n]=1;const f=FISH.find(x=>x[0]===n);const zs=[20,60,150,400][f[1]];pay(zs,0);log('Enciklopédia: '+n+' felvéve (+'+zs+' 🪙)','🐟');
 if(FISH.every(x=>D.fishC[x[0]])&&!D.fishAll){D.fishAll=1;pay(2000,50000);D.sp+=2;log('A horgász-enciklopédia teljes! (+2000 🪙, +2 ⭐)','🏆')}sv();panel('fish')};
const TABS=[['ch','🌋 2. fejezet'],['day','📅 Napi'],['base','🏗️ Bázis'],['comp','🤝 Kísérők'],['arm','🛡️ Páncél'],['sk','⭐ Képességfa'],['fish','🐟 Enciklopédia'],['log','📖 Napló & történet']];
function panel(tab){tab=tab||panel.last||'ch';panel.last=tab;let h='<div class="x14f"><h1>🌍 MENTSD MEG A VILÁGOT · II. FEJEZET</h1><div style="color:#94a3b8;font-size:14px">⭐ Képességpont: <b style="color:#fde68a">'+D.sp+'</b> · 🪙 '+(BR.zs|0)+' · '+ft(S.c)+(STW()?' · 🪵 '+_STW().res.wood+' 🪨 '+_STW().res.stone+' 💎 '+_STW().res.crystal:'')+'</div><div class="x14fTabs">'+TABS.map(t=>'<button class="'+(t[0]===tab?'on':'')+'" onclick="x14fPanel(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div><div class="x14fBox">';
 const btn=(t,f,ok)=>'<button class="x14fBtn" '+(ok?'':'disabled ')+'onclick="'+f+'">'+t+'</button>';
 if(tab==='ch')h+=CH.map((c,i)=>'<div class="x14fC '+(i<D.ch?'done':i===D.ch?'cur':'lock')+'"><b>'+(i<D.ch?'✅':i===D.ch?'▶️':'🔒')+' '+(i+1)+'. '+c.t+'</b><p>'+(i<=D.ch?c.s:'???')+'</p><small style="color:#fbbf24">🎯 '+c.o+(i===D.ch?' – '+D.cp+'/'+c.n:'')+' · Jutalom: '+c.rw[0]+' 🪙 + '+ft(c.rw[1])+' + 1 ⭐</small>'+(i===D.ch?'<div class="x14fBar"><i style="width:'+(D.cp/c.n*100)+'%"></i></div>':'')+'</div>').join('')+(D.ch>=CH.length?'<div class="x14fC done"><b>🌅 A fejezet véget ért!</b><p>A Hamvak Ura legyőzve ('+D.boss+'×).</p>'+(STW()?btn('👑 ÚJRA A HAMVAK URA ELLEN','x14fBossAgain()',!BOSS.e):'')+'</div>':'');
 if(tab==='day'){const q=daily(),d=DQ[q.i];h+='<div class="x14fC cur"><b>📅 Mai küldetés ('+q.day+')</b><p>'+d[2]+'</p><div class="x14fBar"><i style="width:'+Math.min(100,q.p/d[1]*100)+'%"></i></div><small>'+(q.ok?'✅ Teljesítve – holnap új jön!':q.p+'/'+d[1]+' · Jutalom: 400 🪙 + 10 000 Ft + 1 ⭐')+'</small></div>'}
 if(tab==='base'){h+='<p style="color:#cbd5e1">A darab a 4 m-es rácson előtted kerül le. A falak megállítják a lényeket, a csapdák sebeznek. '+(STW()?'':'<b>Csak a Mentsd meg a világot meccsben építhetsz.</b>')+'</p><div class="x14fG">'+Object.entries(PCS).map(([k,p])=>{const c=pcost(p);return'<div class="x14fC"><b>'+p.n+'</b><p>'+(p.trap?'Sebzés: '+Math.round(p.trap*(1+sk('trap')*.35))+'/mp':'Szívósság: '+p.hp)+'</p><small>Ár: '+Object.entries(c).map(([r,v])=>({wood:'🪵',stone:'🪨',crystal:'💎'})[r]+' '+v).join(' · ')+'</small><br>'+btn('LERAK','x14fPlace(\''+k+'\');guiClose()',PLAY())+'</div>'}).join('')+'</div><p style="color:#94a3b8">Eddig lerakva: '+D.built+' · Most a pályán: '+BASE.length+'</p>'}
 if(tab==='comp')h+='<div class="x14fG">'+Object.entries(CT).map(([k,t])=>'<div class="x14fC '+(D.comp[k]?'done':'')+'"><b>'+t.e+' '+t.n+'</b><p>'+t.d+'</p><small>Sebzés: '+Math.round(t.dmg*(1+sk('ally')*.25))+' · Hatótáv: '+t.rng+' m</small><br>'+(D.comp[k]?'<small style="color:#86efac">✅ A csapatod tagja – minden meccsen veled harcol</small>':btn('TOBOROZ – '+t.cost+' 🪙','x14fRec(\''+k+'\')',(BR.zs|0)>=t.cost))+'</div>').join('')+'</div>';
 if(tab==='arm'){const row=(T,cur,w,ic)=>'<div class="x14fC"><b>'+ic+' Jelenleg: '+T[cur][0]+' ('+T[cur][1]+'%)</b><p>'+T.slice(1).map((x,i)=>(i+1<=cur?'✅ ':'▫️ ')+x[0]+' – '+x[1]+'% · '+ft(x[2])).join('<br>')+'</p>'+(cur+1<T.length?btn('FEJLESZT – '+ft(T[cur+1][2]),'x14fBuy(\''+w+'\')',S.c>=T[cur+1][2]):'<small style="color:#86efac">Maximális szint</small>')+'</div>';
  h+='<div class="x14fG">'+row(HELM,D.helm,'h','⛑️')+row(VEST,D.vest,'v','🦺')+'</div><div class="x14fC cur"><b>🛡️ Teljes sebzéscsökkentés: '+Math.round(armRed()*100)+'%</b><p>Sisak + mellény + Vasbőr képesség (max. 60%). Csak a Mentsd meg a világot módban hat.</p></div>'}
 if(tab==='sk')h+='<p style="color:#cbd5e1">Pontot kapsz: fejezet-küldetés, napi küldetés, minden 30. legyőzött lény. Külön a royale képességfától.</p><div class="x14fG">'+SK.map(s=>'<div class="x14fC '+(sk(s[0])>=3?'done':'')+'"><b>'+s[1]+'</b><p>'+s[2]+'</p><div style="font-size:20px">'+[0,1,2].map(i=>i<sk(s[0])?'🟡':'⚫').join(' ')+'</div>'+btn(sk(s[0])>=3?'MAX':'FEJLESZT (1 ⭐)','x14fSk(\''+s[0]+'\')',D.sp>0&&sk(s[0])<3)+'</div>').join('')+'</div>';
 if(tab==='fish'){const FJ=(()=>{try{return JSON.parse(localStorage.getItem('k3fish')||'{}')}catch(e){return{}}})();const got=FISH.filter(f=>FJ[f[0]]).length;
  h+='<p style="color:#cbd5e1">A Teakert tavában fogott halak ('+got+'/'+FISH.length+'). Új fajért zseton jár, a teljes gyűjteményért +2 ⭐!</p><div class="x14fBar"><i style="width:'+got/FISH.length*100+'%"></i></div><div class="x14fG" style="margin-top:8px">'+FISH.map(f=>{const r=FJ[f[0]];return'<div class="x14fC '+(r?'done':'lock')+'"><b>'+(r?'🐟 '+f[0]:'❔ ???')+'</b><p>'+RAR[f[1]]+(r?'<br>Fogva: '+r.n+'× · Rekord: '+(r.best||0).toLocaleString('hu-HU')+' kg':'<br>Még nem fogtad ki')+'</p>'+(r&&!D.fishC[f[0]]?btn('FELJEGYEZ – '+[20,60,150,400][f[1]]+' 🪙','x14fFish(\''+f[0].replace(/'/g,"\\'")+'\')',1):r?'<small style="color:#86efac">📖 Feljegyezve</small>':'')+'</div>'}).join('')+'</div>'}
 if(tab==='log'){const W=STW()?_STW():null;
  h+='<div class="x14fC cur"><b>📚 A történet eddig</b><p><b style="color:#a5b4fc">I. fejezet – Az Árnyék ébredése.</b> Az Árnykirály ködbe borította a világot; négy lángkő meggyújtásával és a toronyban vívott csatával tért vissza a fény.'+(W?' (Ebben a menetben: '+W.done+' küldetés, '+W.lvl+'/4 lángkő, '+W.kills+' lény.)':'')+'</p><p><b style="color:#fdba74">II. fejezet – A Hamvak Ura.</b> '+(D.ch>=CH.length?'A Hamvak Ura elbukott – a hamu eloszlott, a világ fellélegzett.':'Haladás: '+D.ch+'/10. '+(cur()?'Most: '+cur().s:''))+'</p><div class="x14fBar"><i style="width:'+D.ch*10+'%"></i></div></div>';
  h+='<div class="x14fC"><b>📊 Összesítés</b><p>Legyőzött lények: '+D.kills+' · Túlélt események: '+D.evN+' · Épített elemek: '+D.built+' · Főellenség-győzelem: '+D.boss+' · Kísérők: '+Object.keys(D.comp).length+'/2</p></div><div class="x14fC"><b>📖 Küldetésnapló</b>'+(D.log.length?D.log.map(l=>'<p>'+l.ic+' <small style="color:#94a3b8">'+new Date(l.d).toLocaleString('hu-HU',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})+'</small> '+l.t+'</p>').join(''):'<p>Még üres – kezdj egy Mentsd meg a világot menetet!</p>')+'</div>'}
 h+='</div>'+bB('BEZÁR (F9)','guiClose()','r')+'</div>';guiOpen(h);panel.on=1}
window.x14fPanel=panel;window.x14fBossAgain=()=>{guiClose();if(PLAY()&&!BOSS.e)BOSS.spawn()};
addEventListener('keydown',e=>{if(e.key!=='F9')return;e.preventDefault();const a=document.activeElement;if(a&&/INPUT|TEXTAREA/.test(a.tagName))return;if(typeof GUI!=='undefined'&&GUI.on&&panel.on&&$('guic').querySelector('.x14f')){guiClose();panel.on=0}else panel()});

// ---------- LOBBY GOMB ----------
function hub(){let h=document.getElementById('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 if(!$('x14fB')){const b=document.createElement('button');b.id='x14fB';b.className='x14fHb';b.textContent='🌋 VILÁG II';b.title='Mentsd meg a világot – 2. fejezet (F9)';b.onclick=()=>panel();h.appendChild(b)}}
hub();setInterval(()=>{const b=$('x14fB');if(!b)return hub();const m=!!(typeof G!=='undefined'&&G&&!G.over&&typeof run!=='undefined'&&run);b.style.display=m?'none':''},700);
window._x14f={D,CH,EV,BOSS,panel,get ALLY(){return ALLY},get BASE(){return BASE},next:()=>chDone()};
})();
