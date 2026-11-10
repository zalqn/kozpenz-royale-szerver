// jatekB31.js – B ügynök: 🪤 építhető csapdák (tüske/ragacs/riasztó) + 🗝️ titkos szoba kincsvadász-nyomokkal (royale)
(function(){
const gG=()=>(typeof G!=='undefined')?G:null,inBR=()=>{const g=gG();return g&&g.brMode&&g.phase==='play'&&!g.over};
// ---------- CSAPDÁK ----------
const TT=[{k:'tuske',ic:'📌',n:'Tüske',c:0x9ca3af,ct:3},{k:'ragacs',ic:'🟢',n:'Ragacs',c:0x65a30d,ct:2},{k:'riaszto',ic:'🚨',n:'Riasztó',c:0xef4444,ct:2}];
const MAXT=12;let pool=null,geo=null,mats=null,traps=[],inv={tuske:0,ragacs:0,riaszto:0},lastScene=null;
function mkPool(){if(!geo){geo=new THREE.CylinderGeometry(1.2,1.4,.18,10);mats=TT.map(t=>new THREE.MeshBasicMaterial({color:t.c,transparent:true,opacity:.75}))}
 pool=[];for(let i=0;i<MAXT;i++){const m=new THREE.Mesh(geo,mats[0]);m.visible=false;m.position.y=.1;scene.add(m);pool.push(m)}lastScene=scene}
const bar=document.createElement('div');bar.id='b31tr';bar.style.cssText='position:absolute;right:10px;bottom:170px;z-index:4;display:none;flex-direction:column;gap:4px;font:600 13px sans-serif';
TT.forEach((t,i)=>{const b=document.createElement('button');b.style.cssText='background:#0b1022dd;color:#fff;border:1px solid #ffffff33;border-radius:9px;padding:5px 9px;cursor:pointer';b.onclick=e=>{e.stopPropagation();place(i)};b.id='b31t'+i;bar.appendChild(b)});
(document.getElementById('hud')||document.body).appendChild(bar);
function upd(){TT.forEach((t,i)=>{document.getElementById('b31t'+i).textContent=t.ic+' '+t.n+' ×'+inv[t.k]})}
function place(i){const g=gG(),t=TT[i];if(!inBR())return;if(inv[t.k]<=0){say('🪤 Nincs '+t.n+' csapdád – ládákból és kiesett ellenfelekből kapsz');return}
 if(!pool||lastScene!==scene)mkPool();let m=pool.find(p=>!p.visible);if(!m){const o=traps.shift();m=o.m}
 inv[t.k]--;m.material=mats[i];m.position.set(g.x,.1,g.z);m.visible=true;traps.push({k:t.k,m,x:g.x,z:g.z,cd:0,life:90});upd();sfx('buy');say('🪤 '+t.ic+' '+t.n+' lerakva')}
function reset(){traps=[];inv={tuske:1,ragacs:1,riaszto:1};pool=null;upd()}
WP2('launch',()=>{reset();const g=gG();bar.style.display=g&&g.brMode?'flex':'none';rReset()});
WP2('end',()=>{bar.style.display='none';traps.forEach(t=>t.m.visible=false);traps=[]});
WP2('go',a=>{if(a[0]==='menu')bar.style.display='none'});
WP2('pickup',a=>{const g=gG();if(!g||!g.brMode||!a[0]||a[0].t!=='chest')return;if(Math.random()<.45){const t=TT[Math.floor(Math.random()*3)];inv[t.k]++;upd();setTimeout(()=>say('🪤 +1 '+t.ic+' '+t.n+' csapda'),400)}});
let tAcc=0;
WP2('update',a=>{if(!inBR())return;const g=gG(),dt=a[0];tAcc+=dt;
 for(let i=traps.length-1;i>=0;i--){const t=traps[i];t.life-=dt;t.cd-=dt;if(t.life<=0){t.m.visible=false;traps.splice(i,1);continue}
  for(const b of g.en){if(!b.bot||b.dead)continue;if(Math.abs(b.x-t.x)>2||Math.abs(b.z-t.z)>2)continue;
   if(t.k==='tuske'){if(window._ryAPI)_ryAPI.hitBot(b,35*dt,{name:'📌 Tüskecsapda'});}
   else if(t.k==='ragacs'){b._slowT=2.5}
   else if(t.k==='riaszto'&&t.cd<=0){t.cd=6;say('🚨 Riasztó: '+b.name+' a csapdádnál! ('+Math.round(Math.hypot(b.x-g.x,b.z-g.z))+' m)');sfx('wave')}}}
 // ragacs: a lassítás a pozíció visszahúzásával (nem írjuk felül a bot sebességét tartósan)
 for(const b of g.en){if(!b.bot||b.dead)continue;if(b._slowT>0){b._slowT-=dt;if(b._px!==undefined){b.x=b._px+(b.x-b._px)*.35;b.z=b._pz+(b.z-b._pz)*.35}}b._px=b.x;b._pz=b.z}
 rTick(g,dt)});
// ---------- TITKOS SZOBA ----------
const CL=[{x:-150,z:70,t:'„Ahol a leghosszabb árnyék fekszik, ott keress tovább keletre…”'},{x:-40,z:-110,t:'„A régi kút felé fordulj, és számolj száz lépést dél felé…”'},{x:120,z:-20,t:'„A kő alatt nem kincs van – hanem ajtó. Nézz a sziget szélére!”'}];
const ROOM={x:195,z:95};let R=null,rk=0,rLast=null;
function rReset(){rk=0;R=null}
function rBuild(){const g=gG();R={cl:[],door:null,open:false,got:false};CL.forEach((c,i)=>{let x=c.x,z=c.z;for(let k=0;k<20&&!hin(x,z);k++){x*=.9;z*=.9}const s=spr('❔',2.2);s.position.set(x,2.4,z);s.visible=i===0;scene.add(s);R.cl.push({s,x,z})});
 let x=ROOM.x,z=ROOM.z;for(let k=0;k<30&&!hin(x,z);k++){x*=.92;z*=.92}const gr=new THREE.Group();const rock=new THREE.Mesh(boxG(6,4,6),mat('conc',0x6b7280));rock.position.y=2;gr.add(rock);const lb=spr('🗝️',2);lb.position.y=5.2;lb.visible=false;gr.add(lb);gr.position.set(x,0,z);scene.add(gr);R.door={gr,lb,x,z};rLast=scene}
function rTick(g,dt){if(!g.ry||!g.ry.started)return;if(!R||rLast!==scene)rBuild();if(R.got)return;
 const c=R.cl[rk];if(c){c.s.visible=true;if(Math.hypot(g.x-c.x,g.z-c.z)<4){c.s.visible=false;rk++;sfx('buy');say('📜 '+(rk)+'/3 nyom: '+CL[rk-1].t);if(rk>=3){R.door.lb.visible=true;say('🗝️ Megvan mind a 3 nyom! Keresd a sziget szélén a megjelölt sziklát!')}}}
 else if(Math.hypot(g.x-R.door.x,g.z-R.door.z)<5.5){R.got=true;R.door.lb.visible=false;R.door.gr.children[0].visible=false;const p=2;for(let i=0;i<3;i++)pk(R.door.x+i*p-p,R.door.z,'chest');const ft=25000;S.c+=ft;try{save()}catch(e){}
  TT.forEach(t=>inv[t.k]+=2);upd();sfx('win');say('🏛️ TITKOS SZOBA! 3 kincsesláda + '+ft.toLocaleString('hu-HU')+' Ft + 6 csapda');try{localStorage.setItem('k3b31vault',String(+(localStorage.getItem('k3b31vault')||0)+1))}catch(e){}}}
function WP2(n,post){const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{post(arguments)}catch(e){console.warn('b31 '+n,e)}return r}}
window._b31={inv:()=>inv,traps:()=>traps,place,clue:()=>rk,room:()=>R&&{x:R.door.x,z:R.door.z,got:R.got},clues:()=>R&&R.cl.map(c=>[c.x,c.z])};
})();
