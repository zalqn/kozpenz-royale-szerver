// ===== KÖZPÉNZ ROYALE JÁTÉKMÓD: 25 játékos, utolsó túlélő nyer =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const NBOT=24;
const NAMES=['KisKöltségvetés','Strómann_99','TenderTigris','ÁFA_Áron','NKA_Noémi','PlakátPisti','KordonKati','OffshoreOszkár','MűfűMárton','RezsiRita','KiskapuKata','LobbiLaci','ParkolóPál','MegafonMaci','AlapítványAnna','KonzultációKrisztián','BrüsszelBéla','StadionSanyi','ÁrstopÁgi','PályázatPeti','HatáridőHajni','KenőpénzKálmán','ZsetonZsolt','UtalványUrsula','TanácsadóTibor','KampányKlári'];
const BCOL=[0xef4444,0x3b82f6,0x22c55e,0xeab308,0xa855f7,0xf97316,0x14b8a6,0xec4899,0x64748b,0x84cc16];
const BEMO=['😎','🤠','🥸','🤖','👽','🧛','🦊','🐸','🐼','🦁','🐯','🧟','🤡','👻'];
// Ritkaság (fegyverek)
const RAR=[{n:'KÖZÖNSÉGES',c:'#b0b8c4',m:1},{n:'RITKA',c:'#4ade80',m:1.12},{n:'EPIKUS',c:'#60a5fa',m:1.25},{n:'LEGENDÁS',c:'#c084fc',m:1.4},{n:'MÍTIKUS',c:'#fbbf24',m:1.6}];
const rollRar=()=>{const r=R();return r<.42?0:r<.7?1:r<.88?2:r<.97?3:4};
// Vihar-fázisok
const PH=[{w:40,to:280,s:30,d:2},{w:35,to:180,s:28,d:4},{w:30,to:105,s:24,d:7},{w:25,to:55,s:20,d:10},{w:18,to:22,s:16,d:14},{w:12,to:4,s:14,d:20}];

const ui=document.createElement('div');ui.id='rySt';ui.style.cssText='position:absolute;left:50%;top:86px;transform:translateX(-50%);z-index:3;pointer-events:none;display:none;gap:10px;font-family:"Luckiest Guy",Impact;text-shadow:0 2px 0 #000';
ui.innerHTML='<span id="ryAl" style="background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:4px 12px;color:#fff">👥 25</span><span id="ryKi" style="background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:4px 12px;color:#ffd23f">💀 0</span><span id="ryStorm" style="background:#2e1065cc;border:1px solid #a78bfa66;border-radius:10px;padding:4px 12px;color:#e9d5ff">🌀 —</span>';
$('hud').appendChild(ui);
const ann=t=>{if(G)say(t)};
const alive=()=>G?G.en.filter(e=>e.bot&&!e.dead).length+(G.allies||[]).filter(e=>!e.dead).length:0;
const TS=()=>({solo:1,duo:2,trio:3,squad:4})[window.GAME_TEAM||'solo']||1;

function mkBot(i){const g=G;let p;for(let k=0;k<80;k++){p=[rnd(-240,240),rnd(-140,140)];if(hin(p[0],p[1])&&Math.hypot(p[0]-g.x,p[1]-g.z)>35)break}
 const col=BCOL[i%BCOL.length],em=BEMO[i%BEMO.length],m=person(col,em,1);scene.add(m);const nm=NAMES[i%NAMES.length];const lb=spr(nm,2.2,'x');lb.position.y=4.6;m.add(lb);
 g.left++;g.tot++;
 return{t:'nav',bot:true,name:nm,x:p[0],z:p[1],m,hp:100,mhp:100,sh:50,msh:50,sp:rnd(5.5,7),r:1,cd:rnd(1,3),fz:1e9,b:false,dead:false,qT:0,slow:1,
  acc:rnd(.25,.55),dmg:rnd(7,11),rof:rnd(.55,1),st:'loot',goal:null,tgt:null,think:0,y:0,strafe:R()<.5?1:-1}}
function tracer(x1,y1,z1,x2,y2,z2,c){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1,y1,z1),new THREE.Vector3(x2,y2,z2)]);const l=new THREE.Line(geo,new THREE.LineBasicMaterial({color:c||0xfff1a8,transparent:true,opacity:.9}));scene.add(l);G.ef.push({k:'trc',t:.07,end:()=>{scene.remove(l);geo.dispose()}})}
function botDie(v,killer){const g=G;if(v.dead)return;v.dead=true;if(window.killBubble)killBubble(v.x,v.z,4.6,lastWords());v.hp=0;if(v.ally){scene.remove(v.m);say('💔 Csapattársad kiesett: '+v.name)}else g.left=Math.max(0,g.left-1);pk(v.x,v.z,'chest');g.pk[g.pk.length-1].ry=1;
 const kf=$('prKF');if(kf){const n=document.createElement('div');n.innerHTML=(killer?killer.name:'🌀 VIHAR')+' ➜ 💀 '+v.name;kf.prepend(n);while(kf.children.length>5)kf.lastChild.remove();setTimeout(()=>n.remove(),4100)}}
function hitBot(v,d,killer){if(v.dead)return;if(v.sh>0){const t=Math.min(v.sh,d);v.sh-=t;d-=t}v.hp-=d;if(v.hp<=0)botDie(v,killer)}

// ---------- Indítás ----------
WP('launch',null,()=>{const g=G;if((window.GAME_MODE||'royale')!=='royale'){ui.style.display='none';return}g.brMode=true;g.maxW=1;g.ry={ph:0,st:'wait',tm:PH[0].w,from:420,sto:420,started:false,kills:0,rar:[0,0,0,0,0]};g.sto=420;ui.style.display='flex'});
const _sw=window.spawnWave;window.spawnWave=function(){const g=G;if(g&&g.brMode){g.wave=Math.max(g.wave,1);return}return _sw.apply(this,arguments)};
WP('land',null,()=>{const g=G;if(!g||!g.brMode||g.ry.started)return;g.ry.started=true;const S=TS();g.allies=[];
 for(let i=0;i<S-1;i++){const a=mkBot(NBOT+i);g.left--;g.tot--;a.ally=true;a.team=0;a.name='🤝 '+a.name;a.x=g.x+rnd(-6,6);a.z=g.z+rnd(-6,6);if(!hin(a.x,a.z)){a.x*=.9;a.z*=.9}a.m.children.forEach(c=>{if(c.isSprite&&c.position.y>4){c.material=c.material.clone();c.material.color.setHex(0x4ade80)}});g.allies.push(a)}
 let lead=null;for(let i=0;i<NBOT-(S-1);i++){const b=mkBot(i);b.team=1+Math.floor(i/S);if(i%S===0)lead=b;else{b.x=lead.x+rnd(-5,5);b.z=lead.z+rnd(-5,5)}g.en.push(b)}ann('🪂 25 JÁTÉKOS A SZIGETEN! Az utolsó túlélő nyer!');spk('Huszonöt játékos a szigeten. Az utolsó túlélő nyer!')});

// ---------- Ritkasági fegyverek a ládákból ----------
WP('pickup',a=>a[0]&&a[0].t,(a,t)=>{const g=G;if(!g||!g.brMode||t!=='chest')return;const wi=pick([0,1,1,2,3,4,5,5,6,6,7,8]),r=rollRar(),cur=g.own[wi]?g.ry.rar[wi]:-1;
 if(r>cur){g.own[wi]=true;g.ry.rar[wi]=r;g.wp=wi;g.mag[wi]=WPN[wi].mag;g.res[wi]=(g.res[wi]||0)+WPN[wi].res;say('🎁 '+RAR[r].n+' '+WPN[wi].e+' '+WPN[wi].n+'!');sfx(r>=3?'win':'buy')}
 else{g.res[wi]=(g.res[wi]||0)+Math.round(WPN[wi].res*.5);say('🎁 Lőszer: '+WPN[wi].e+' +'+Math.round(WPN[wi].res*.5))}
 g.sh=Math.min(g.msh,g.sh+25)});
WP('kill',a=>a[0],(a,e)=>{const g=G;if(!g||!g.brMode||!e||!e.bot)return;g.ry.kills++;if(g.ry.kills%4===0){g.sh=Math.min(g.msh,g.sh+40);say('🔰 4 elimináció: +40 pajzs!')}});

// ---------- Fő ciklus ----------
WP('update',null,a=>{const g=G,dt=a[0];if(!g||!g.brMode||g.phase!=='play'||g.over)return;const ry=g.ry;
 // vihar-fázisok
 const P=PH[Math.min(ry.ph,PH.length-1)];ry.tm-=dt;
 if(ry.st==='wait'&&ry.tm<=0){ry.st='shrink';ry.tm=P.s;ry.from=ry.sto;ann('🌀 A VIHAR ZÁRUL! Menj a körbe!');sfx('wave')}
 else if(ry.st==='shrink'){const f=1-Math.max(0,ry.tm)/P.s;ry.sto=ry.from+(P.to-ry.from)*f;if(ry.tm<=0){ry.sto=P.to;if(ry.ph<PH.length-1){ry.ph++;ry.st='wait';ry.tm=PH[ry.ph].w}else ry.st='end'}}
 g.sto=ry.sto;g.sm.scale.set(g.sto,1,g.sto);
 if(Math.hypot(g.x,g.z)>g.sto)hurt(P.d*dt,true);
 const mm=Math.floor(Math.max(0,ry.tm)/60),ss=String(Math.floor(Math.max(0,ry.tm))%60).padStart(2,'0');
 $('ryStorm').textContent=ry.st==='wait'?'🌀 ZÁRUL: '+mm+':'+ss:ry.st==='shrink'?'🌀 SZŰKÜL! '+mm+':'+ss:'🌀 VÉGSŐ KÖR';
 const n=alive();$('ryAl').textContent='👥 '+(n+1);$('ryKi').textContent='💀 '+ry.kills;$('al').textContent='ÉLŐK: '+(n+1)+' · ELIM: '+g.kills;
 // botok
 const bots=g.en.filter(e=>e.bot&&!e.dead),allies=(g.allies||[]).filter(e=>!e.dead),every=[...bots,...allies];
 every.forEach(b=>{b.fz=1e9;b.think-=dt;b.cd-=dt;
  if(Math.hypot(b.x,b.z)>g.sto)hitBot(b,P.d*dt,null);if(b.dead)return;
  if(b.think<=0){b.think=rnd(.4,.9);let best=null,bd=32;const cands=[...every,{isP:1,x:g.x,z:g.z,team:0}];cands.forEach(o=>{if(o===b||(o.team||0)===(b.team||0))return;const d=Math.hypot(o.x-b.x,o.z-b.z);if(d<bd){bd=d;best=o}});b.tgt=best;
   if(Math.hypot(b.x,b.z)>g.sto-8)b.st='storm';else if(best)b.st='fight';else if(b.ally&&Math.hypot(g.x-b.x,g.z-b.z)>7){b.st='loot';b.goal=[g.x+rnd(-4,4),g.z+rnd(-4,4)]}else{b.st='loot';if(!b.goal||Math.hypot(b.goal[0]-b.x,b.goal[1]-b.z)<3){let gp;for(let k=0;k<20;k++){const an=R()*6.28,r=R()*Math.max(5,g.sto-10);gp=[Math.cos(an)*r,Math.sin(an)*r];if(hin(gp[0],gp[1]))break}b.goal=gp}}}
  let mx=0,mz=0,face=null;
  if(b.st==='storm'){const d=Math.hypot(b.x,b.z)||1;mx=-b.x/d;mz=-b.z/d}
  else if(b.st==='loot'&&b.goal){const dx=b.goal[0]-b.x,dz=b.goal[1]-b.z,d=Math.hypot(dx,dz)||1;mx=dx/d;mz=dz/d}
  else if(b.st==='fight'&&b.tgt){const t=b.tgt,dx=t.x-b.x,dz=t.z-b.z,d=Math.hypot(dx,dz)||1;face=Math.atan2(dz,dx);const want=b.hp<40?28:14;const fw=d>want+4?1:d<want-4?-1:0;mx=dx/d*fw-dz/d*.6*b.strafe;mz=dz/d*fw+dx/d*.6*b.strafe;if(R()<dt*.4)b.strafe*=-1;
   if(b.cd<=0&&d<38){b.cd=t.isP?b.rof:b.rof*1.6;const hy=1.6;if(t.isP){const er=(1-b.acc)*.35*(d/20);eFire(b,face+rnd(-er,er),34,b.dmg);sfx('shot',1)}else{const hitP=Math.max(.04,b.acc*.55-d/140);tracer(b.x,hy,b.z,t.x+rnd(-1,1),hy+rnd(-.5,.5),t.z+rnd(-1,1));if(R()<hitP)hitBot(t,b.dmg*rnd(.8,1.3),b)}}}
  const L=Math.hypot(mx,mz);if(L>0){const sp=b.sp*(b.st==='storm'?1.25:1);b.x+=mx/L*sp*dt;b.z+=mz/L*sp*dt}
  pushOut(b,b.r,0);if(!hin(b.x,b.z)){b.x*=.98;b.z*=.98}
  b._face=face!==null?face:(L>0?Math.atan2(mz,mx):b._face||0);if(b.ally&&b.m){b.m.position.set(b.x,0,b.z);b.m.rotation.y=-(b._face||0)+Math.PI/2}});
 // győzelem
 if(ry.started&&bots.length===0&&!g.over){ann('🏆 #1 GYŐZELEM! Te vagy az utolsó túlélő!');ry.started=false;ry.winT=1.4}
 if(ry.winT>0){ry.winT-=dt;if(ry.winT<=0&&!g.over){end(true);return}}
});
// botok forgatása (a fő kód a játékos felé fordítja őket)
WP('update',null,()=>{const g=G;if(!g||!g.brMode)return;g.en.forEach(e=>{if(e.bot&&!e.dead&&e.m)e.m.rotation.y=-(e._face||0)+Math.PI/2})});
// a játékos sebzése a botokon (pajzs + élet), a fő dmgE kezeli; a botokat ne fagyassza le a varázslat
WP('end',null,a=>{ui.style.display='none';const g=G;if(!g||!g.brMode)return;const rt=$('rt');if(!a[0]&&rt){rt.textContent='#'+(alive()+1)+' HELYEZÉS'}});
WP('go',null,a=>{if(a[0]==='menu')ui.style.display='none'});

WP('update',null,()=>{const g=G;if(!g||!g.brMode||!g.ry)return;$('wv').textContent='KÖZPÉNZ ROYALE · '+(g.ry.ph+1)+'. FÁZIS · ★PREMIUM★';
 let nb=null,nd=1e9;g.en.forEach(e=>{if(!e.bot||e.dead)return;const d=Math.hypot(e.x-g.x,e.z-g.z);if(d<nd){nd=d;nb=e}});
 $('ms').innerHTML=(nb?'🎯 '+nb.name+' · '+Math.round(nd)+' m<div class="bar"><i style="width:'+Math.max(0,nb.hp)+'%;background:#ff4d6d"></i></div><div class="bar"><i style="width:'+Math.max(0,nb.sh/nb.msh*100)+'%;background:#38e1ff"></i></div>':'🏆 Nincs több ellenfél!')+(g.mis?'<div style="margin-top:4px;color:#fde68a">📱 '+g.mis+'</div>':'')});
// Ritkaság-szín a lőszer-kijelzőn
WP('update',null,()=>{const g=G;if(!g||!g.brMode)return;const r=RAR[g.ry.rar[g.wp]||0];g._dmgB=r.m;const am=$('brAmmo');if(am&&!g.buildMode){const i=am.querySelector('i');if(i)i.style.color=r.c}});
})();
