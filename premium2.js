// ===== 10 PRÉMIUM FUNKCIÓ =====
// 1 Napi küldetések · 2 Napi belépési jutalom · 3 Rangsor (RP + rangok) · 4 Ellátmány-ledobás · 5 Jelölő (ping)
// 6 Sebzés-irány jelző · 7 Fotómód (K) · 8 Lobbyzene · 9 Sorozat-bónuszok · 10 Részletes meccs-összefoglaló
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},s:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const zs=n=>{window.BR.zs+=n;try{st.s('k3br',window.BR)}catch(e){}};
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const lbOn=()=>document.getElementById('lb')&&document.getElementById('lb').classList.contains('on');
const refreshLobby=()=>{if(lbOn()&&window.showLobby)showLobby()};

// ============ 1) NAPI KÜLDETÉSEK ============
const QPOOL=[['kill','Szerezz {n} eliminációt',[5,8,12],150],['chest','Nyiss ki {n} ládát',[3,5,8],120],['build','Rakj le {n} építőelemet',[10,20,30],120],['top10','Végezz a legjobb 10 között {n}x',[1,2,3],200],
 ['play','Játssz le {n} meccset',[2,3,4],100],['dmg','Okozz összesen {n} sebzést',[1000,2500,4000],160],['stw','Teljesíts {n} küldetést a Mentsd meg a világot módban',[2,3,5],180],['dance','Táncolj {n}x a lobbyban',[3,5],60],['ping','Jelölj meg {n} helyet (középső egérgomb)',[3,5],60]];
function quests(){let q=LS.g('ry_q',null);if(!q||q.date!==today()){let h=0;for(const c of today())h=(h*31+c.charCodeAt(0))>>>0;const pool=QPOOL.slice(),list=[];for(let i=0;i<3;i++){const k=(h>>>(i*5))%pool.length,d=pool.splice(k,1)[0],goal=d[2][(h>>>(i*3+2))%d[2].length];list.push({id:d[0],t:d[1].replace('{n}',goal.toLocaleString('hu-HU')),goal,prog:0,claimed:false,r:d[3]})}q={date:today(),list};LS.s('ry_q',q)}return q}
function qAdd(id,n){const q=quests();let ch=false;q.list.forEach(x=>{if(x.id===id&&x.prog<x.goal){x.prog=Math.min(x.goal,x.prog+(n||1));ch=true;if(x.prog>=x.goal&&G&&run)say('✅ KÜLDETÉS TELJESÍTVE: '+x.t)}});if(ch)LS.s('ry_q',q)}
window.questsUI=function(){const q=quests(),now=new Date(),mid=new Date(now);mid.setHours(24,0,0,0);const left=Math.floor((mid-now)/60000);
 guiOpen('<h1 class="f" style="font-size:30px">📋 NAPI KÜLDETÉSEK</h1><div style="color:#cbd5e1;margin-bottom:8px">Új küldetések: '+Math.floor(left/60)+' óra '+left%60+' perc múlva</div>'+q.list.map((x,i)=>{const pct=Math.round(x.prog/x.goal*100),done=x.prog>=x.goal;
  return '<div class="it" style="cursor:default;margin:8px 0;text-align:left"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><b style="font-size:17px">'+x.t+'</b><span class="f" style="color:var(--y);white-space:nowrap">+'+x.r+' 🪙</span></div><div class="bar" style="margin:6px 0"><i style="width:'+pct+'%;background:'+(done?'#4ade80':'#38e1ff')+'"></i></div><div style="display:flex;justify-content:space-between;align-items:center"><small>'+x.prog.toLocaleString('hu-HU')+' / '+x.goal.toLocaleString('hu-HU')+'</small>'+(x.claimed?'<b style="color:#4ade80">✔ ÁTVÉVE</b>':done?bB('ÁTVESZ','qClaim('+i+')'):'')+'</div></div>'}).join('')+bB('VISSZA','guiClose()','r'))};
window.qClaim=i=>{const q=quests(),x=q.list[i];if(!x||x.claimed||x.prog<x.goal)return;x.claimed=true;LS.s('ry_q',q);zs(x.r);try{sfx('win')}catch(e){}questsUI()};

// ============ 2) NAPI BELÉPÉSI JUTALOM ============
const DAILY=[100,150,200,250,300,400,1000];
function dailyCheck(){const d=LS.g('ry_daily',{last:null,streak:0,claimedDay:null});const t=today();if(d.claimedDay===t)return;
 const y=new Date();y.setDate(y.getDate()-1);const yest=y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();const streak=d.claimedDay===yest?(d.streak%7)+1:1;
 setTimeout(()=>{if(!lbOn()||GUI.on)return;guiOpen('<h1 class="f" style="font-size:32px">🎁 NAPI BELÉPÉSI JUTALOM</h1><div style="color:#cbd5e1;margin-bottom:10px">'+streak+'. nap a sorozatban – gyere vissza holnap is!</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">'+DAILY.map((v,i)=>'<div class="it" style="cursor:default;text-align:center;padding:8px 2px;'+(i+1===streak?'border-color:var(--y)!important;box-shadow:0 0 18px #ffd23f88':i+1<streak?'opacity:.5':'')+'"><div class="f" style="font-size:14px">'+(i+1)+'. NAP</div><div style="font-size:'+(i===6?34:26)+'px">'+(i===6?'💎':'🪙')+'</div><div class="f" style="color:var(--y)">'+v+'</div>'+(i+1<streak?'<small>✔</small>':'')+'</div>').join('')+'</div>'+bB('ÁTVESZEM: +'+DAILY[streak-1]+' 🪙','dailyClaim('+streak+')')) },900)}
window.dailyClaim=s=>{const d=LS.g('ry_daily',{});if(d.claimedDay===today())return guiClose();LS.s('ry_daily',{claimedDay:today(),streak:s});zs(DAILY[s-1]);try{sfx('win')}catch(e){}guiClose();refreshLobby()};

// ============ 3) RANGSOR ============
const RANKS=[[0,'BRONZ','🥉','#cd7f32'],[300,'EZÜST','🥈','#cbd5e1'],[700,'ARANY','🥇','#facc15'],[1200,'PLATINA','💠','#67e8f9'],[1800,'GYÉMÁNT','💎','#60a5fa'],[2600,'ELIT','🔥','#f472b6'],[3500,'BAJNOK','👑','#ffd23f']];
const rp=()=>LS.g('ry_rp',0),rankOf=v=>{let r=RANKS[0];RANKS.forEach(x=>{if(v>=x[0])r=x});return r};
function rankBadge(){const side=document.getElementById('lbSide');if(!side)return;let b=document.getElementById('lbRank');if(!b){b=document.createElement('div');b.id='lbRank';b.className='lbBadge';b.title='Rangsor';b.onclick=rankUI;side.prepend(b)}const v=rp(),r=rankOf(v);b.innerHTML='<div class="ring" style="font-size:30px">'+r[2]+'<small style="color:'+r[3]+'">'+r[1]+'</small></div>'}
function rankUI(){const v=rp(),r=rankOf(v),nx=RANKS.find(x=>x[0]>v);guiOpen('<h1 class="f" style="font-size:30px">🏅 RANGSOR</h1><div style="font-size:64px">'+r[2]+'</div><div class="f" style="font-size:30px;color:'+r[3]+'">'+r[1]+'</div><div style="color:#cbd5e1;margin:6px">'+v+' RP'+(nx?' · következő: '+nx[1]+' ('+nx[0]+' RP)':' · CSÚCSRANG!')+'</div>'+(nx?'<div class="bar" style="height:14px"><i style="width:'+Math.round((v-r[0])/(nx[0]-r[0])*100)+'%;background:'+r[3]+'"></i></div>':'')+
 '<div class="g" style="margin-top:12px">'+RANKS.map(x=>'<div class="it" style="cursor:default;text-align:center;'+(x===r?'border-color:'+x[3]+'!important':'opacity:.7')+'"><div style="font-size:28px">'+x[2]+'</div><b style="color:'+x[3]+'">'+x[1]+'</b><small>'+x[0]+' RP</small></div>').join('')+'</div><div style="color:#94a3b8;margin-top:8px">RP-t a Battle Royale helyezésed és eliminációid adnak.</div>'+bB('VISSZA','guiClose()','r'))}

// ============ 10) MECCS-STATISZTIKA gyűjtés ============
let MS=null;const msReset=()=>{MS={shots:0,hits:0,dmg:0,taken:0,t0:performance.now(),best:0,multi:0,lastK:0,streak:0}};msReset();
WP('launch',null,()=>{msReset();drops=[];pings.forEach(p=>scene.remove(p.s));pings=[];if(window.AX&&AX.on){}});
WP('sht',a=>G&&G.cd<=0&&G.reloading<=0&&!G.buildMode&&(G.mag[G.wp]||0)>0&&G.phase==='play',(a,f)=>{if(f)MS.shots++});
WP('dmgE',a=>a[0]?a[0].hp+(a[0].sh||0):null,(a,b)=>{const e=a[0];if(!e||b===null)return;const l=b-(e.hp+(e.sh||0));if(l>0){MS.hits++;MS.dmg+=l;qAdd('dmg',Math.round(l))}});
WP('hurt',a=>G?G.hp+G.sh:0,(a,b)=>{if(!G)return;const l=b-(G.hp+G.sh);if(l>0)MS.taken+=l;if(!a[1]&&l>0)dmgDir()});

// ============ 9) SOROZAT-BÓNUSZOK ============
const MULTI=['','','DUPLA ELIMINÁCIÓ!','TRIPLA ELIMINÁCIÓ!','NÉGYES ELIMINÁCIÓ!','MEGÁLLÍTHATATLAN!'],STREAK={5:['ÁLLAMOSÍTÁS! 5 elimináció egy életből',100],10:['KÉTHARMAD! 10 elimináció egy életből',250],15:['ALKOTMÁNYOZÓ TÖBBSÉG! 15 elimináció',500]};
const banner=document.createElement('div');banner.style.cssText='position:absolute;left:50%;top:30%;transform:translate(-50%,-50%) scale(.6);z-index:4;pointer-events:none;font:clamp(28px,5vw,58px) "Luckiest Guy",Impact;color:#fff;text-shadow:0 4px 0 #000,0 0 30px #ff4d6d;opacity:0;transition:all .25s;white-space:nowrap';document.getElementById('hud').appendChild(banner);
let bT=null;const showBanner=(t,c)=>{banner.textContent=t;banner.style.color=c||'#fff';banner.style.opacity=1;banner.style.transform='translate(-50%,-50%) scale(1)';clearTimeout(bT);bT=setTimeout(()=>{banner.style.opacity=0;banner.style.transform='translate(-50%,-50%) scale(.6)'},1800)};
WP('kill',a=>a[0],(a,e)=>{if(!G||!e)return;const now=performance.now();MS.multi=now-MS.lastK<4500?MS.multi+1:1;MS.lastK=now;MS.streak++;MS.best=Math.max(MS.best,MS.multi);qAdd('kill');
 if(MS.multi>=2){showBanner('🔥 '+MULTI[Math.min(5,MS.multi)],'#ffd23f');try{sfx('ult')}catch(x){}zs(10*MS.multi)}
 const s=STREAK[MS.streak];if(s){showBanner('👑 '+s[0],'#ff4d6d');zs(s[1]);G.sh=G.msh;say('🎁 Sorozat-jutalom: +'+s[1]+' 🪙 és teli pajzs!')}});

// ============ 4) ELLÁTMÁNY-LEDOBÁS (Battle Royale) ============
let drops=[];
function spawnDrop(){const g=G;let x,z;for(let k=0;k<40;k++){const a=R()*6.28,r=R()*g.sto*.6;x=Math.cos(a)*r;z=Math.sin(a)*r;if(hin(x,z))break}
 const grp=new THREE.Group();const crate=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.2,2.2),mat('wood',0x8b5a2b));crate.castShadow=true;grp.add(crate);
 const band=new THREE.Mesh(new THREE.BoxGeometry(2.3,.4,2.3),new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x2563eb,emissiveIntensity:1}));grp.add(band);
 const bal=spr('🎈',5);bal.position.y=4.6;grp.add(bal);grp.position.set(x,70,z);scene.add(grp);
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,140,10,1,true),new THREE.MeshBasicMaterial({color:0x60a5fa,transparent:true,opacity:.25,depthWrite:false}));beam.position.set(x,70,z);scene.add(beam);
 drops.push({grp,beam,x,z,y:70});say('📦 ELLÁTMÁNY-LEDOBÁS! Mítikus fegyver vár a kék fénynél!');try{sfx('drop')}catch(e){}}
WP('update',null,a=>{const g=G,dt=a[0];if(!g||g.phase!=='play'||g.over)return;
 if(g.brMode){g._dropT=(g._dropT===undefined?45:g._dropT)-dt;if(g._dropT<=0){g._dropT=55;spawnDrop()}}
 drops.forEach(d=>{if(d.done)return;d.y=Math.max(1.1,d.y-6*dt);d.grp.position.y=d.y;d.grp.rotation.y+=dt*.5;if(d.y<=1.1){d.done=true;d.grp.children[2].visible=false;if(g.brMode&&window._addChest){_addChest(d.x,d.z,true);d.p={};return}pk(d.x,d.z,'chest');const p=g.pk[g.pk.length-1];p.l=99999;p.sup=true;p.s.scale.multiplyScalar(1.6);d.p=p}});
 drops=drops.filter(d=>{if(d.p&&!g.pk.includes(d.p)){scene.remove(d.grp);scene.remove(d.beam);return false}return true});
 // ping-ek frissítése
 pings=pings.filter(p=>{p.t-=dt;if(p.t<=0){scene.remove(p.s);return false}return true});
 // sebzés-irány halványítás
 dirEls.forEach(d=>{d.t-=dt;d.el.style.opacity=Math.max(0,d.t/1.2)})});
WP('pickup',a=>a[0],(a,p)=>{const g=G;if(!g||!p)return;if(p.t==='chest')qAdd('chest');if(p.sup&&g.ry){const wi=pick([1,2,3]);g.own[wi]=true;g.ry.rar[wi]=4;g.wp=wi;g.mag[wi]=WPN[wi].mag;g.res[wi]=(g.res[wi]||0)+WPN[wi].res*2;showBanner('📦 MÍTIKUS '+WPN[wi].n+'!','#fbbf24');try{sfx('win')}catch(e){}}});

// ============ 5) JELÖLŐ (PING) – középső egérgomb ============
let pings=[];
addEventListener('mousedown',e=>{if(e.button!==1||!G||!run||G.phase!=='play')return;e.preventDefault();const p=aimPoint(G);const s=spr('📍 '+Math.round(Math.hypot(p.x-G.x,p.z-G.z))+' m',2.2,'x');s.material.depthTest=false;s.renderOrder=998;s.position.set(p.x,Math.max(2.5,p.y+2),p.z);scene.add(s);pings.push({s,t:9});if(pings.length>3)scene.remove(pings.shift().s);try{sfx('click')}catch(x){}qAdd('ping')});
addEventListener('auxclick',e=>{if(e.button===1&&G&&run)e.preventDefault()});

// ============ 6) SEBZÉS-IRÁNY JELZŐ ============
const dirEls=[];{for(let i=0;i<4;i++){const el=document.createElement('div');el.style.cssText='position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:3;opacity:0';el.innerHTML='<div style="position:absolute;left:-60px;top:-190px;width:120px;height:46px;background:radial-gradient(ellipse at 50% 100%,#ff2a4dcc,#ff2a4d00 70%);clip-path:polygon(50% 0,100% 100%,0 100%)"></div>';document.getElementById('hud').appendChild(el);dirEls.push({el,t:0})}}
let dirI=0;
function dmgDir(){const g=G;let sx=null,sz=null,bd=3;g.eb.forEach(b=>{const d=Math.hypot(b.x-g.x,b.z-g.z);if(d<bd){bd=d;sx=g.x-b.vx;sz=g.z-b.vz}});
 if(sx===null){let nd=40;g.en.forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-g.x,e.z-g.z);if(d<nd){nd=d;sx=e.x;sz=e.z}})}if(sx===null)return;
 const rel=Math.atan2(sz-g.z,sx-g.x)-g.ang;const d=dirEls[dirI++%4];d.t=1.2;d.el.style.transform='rotate('+rel+'rad)';d.el.style.opacity=1}

// ============ 7) FOTÓMÓD – K ============
addEventListener('keydown',e=>{if(e.key.toLowerCase()!=='k'||!G||!run||!ren)return;const hud=document.getElementById('hud');hud.style.visibility='hidden';ren.render(scene,cam);let url;try{url=ren.domElement.toDataURL('image/png')}catch(x){}hud.style.visibility='';
 if(!url)return;const a=document.createElement('a');a.href=url;a.download='kozpenz_royale_'+new Date().toISOString().replace(/[:.]/g,'-')+'.png';document.body.appendChild(a);a.click();a.remove();const f=document.getElementById('fl');if(f){f.style.transition='none';f.style.opacity=.8;setTimeout(()=>{f.style.transition='opacity .6s';f.style.opacity=0},40)}say('📸 Kép elmentve a Letöltések mappába!')});

// ============ 8) LOBBYZENE ============
let musicOn=LS.g('ry_music',true);
function lobbyMusic(){if(!window.LBM)return;if(musicOn)LBM.start();else LBM.stop()}
{const bot=document.getElementById('lbBot');if(bot){const b=document.createElement('button');b.id='lbMus';b.title='Lobbyzene be/ki';b.textContent=musicOn?'🎵':'🔇';b.onclick=()=>{musicOn=!(window.LBM&&LBM.on);LS.s('ry_music',musicOn);b.textContent=musicOn?'🎵':'🔇';lobbyMusic()};bot.prepend(b)}
 // a böngésző csak felhasználói kattintás után enged hangot
 }

// ============ LOBBY-integráció ============
{const top=document.getElementById('lbTop');if(top){const t=document.createElement('span');t.className='tab dot';t.textContent='KÜLDETÉSEK';t.onclick=questsUI;const ref=top.querySelector('[data-t=casino]');top.insertBefore(t,ref)}}
{const lbEl=document.getElementById('lb');let was=false;const onShow=()=>{rankBadge();dailyCheck()};new MutationObserver(()=>{const on=lbEl.classList.contains('on');if(on&&!was)onShow();was=on}).observe(lbEl,{attributes:true,attributeFilter:['class']});if(lbEl.classList.contains('on')){was=true;onShow()}}
if(window.lbDance)WP('lbDance',null,()=>qAdd('dance'));
if(window.brPlace){const _bp=window.brPlace;window.brPlace=function(){const n=G?G.wl.length:0;const r=_bp.apply(this,arguments);if(G&&G.wl.length>n)qAdd('build');return r}}

// ============ VÉGE: RP + összefoglaló ============
WP('end',a=>{const g=G;if(!g)return null;let place=1;if(!a[0]){place=g.brMode?(g.en.filter(e=>e.bot&&!e.dead).length+(g.allies||[]).filter(e=>!e.dead).length+1):0}return{place,win:!!a[0],kills:g.kills,stw:g.stw,wave:g.wave,br:g.brMode}},(a,s)=>{if(!s)return;
 let rpG=0;if(s.br){rpG=(s.win?120:Math.max(-25,60-s.place*4))+s.kills*10;LS.s('ry_rp',Math.max(0,rp()+rpG));if(s.place<=10)qAdd('top10')}
 qAdd('play');if(s.stw)qAdd('stw',(window._STW&&_STW())?_STW().done:0);
 const sec=Math.round((performance.now()-MS.t0)/1000),acc=MS.shots?Math.round(MS.hits/MS.shots*100):0;
 const rb=document.getElementById('rb');if(rb)rb.innerHTML+='<div style="margin-top:8px;padding-top:8px;border-top:1px solid #ffffff22;display:grid;grid-template-columns:1fr 1fr;gap:4px;text-align:left;font-size:15px">'+
  '<span>🎯 Pontosság: <b>'+acc+'%</b></span><span>💥 Okozott sebzés: <b>'+Math.round(MS.dmg)+'</b></span><span>🩸 Kapott sebzés: <b>'+Math.round(MS.taken)+'</b></span><span>⏱️ Idő: <b>'+Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+'</b></span>'+
  '<span>🔥 Legjobb sorozat: <b>'+MS.best+'x</b></span><span>🔫 Lövések: <b>'+MS.shots+'</b></span>'+(s.br?'<span style="grid-column:1/3">🏅 Rangsor: <b style="color:'+(rpG>=0?'#4ade80':'#ff6b81')+'">'+(rpG>=0?'+':'')+rpG+' RP</b> · '+rankOf(rp())[2]+' '+rankOf(rp())[1]+' ('+rp()+' RP)</span>':'')+'</div>'});
})();
