// Sziget ArĂ©na â€“ 'lufi' mĂłd: dekor-lufik, hĂ©liumpalack (lufi-pĂłtlĂˇs), tĂĽske-csapda, bot-viselkedĂ©s, pukk-effektek, HUD, meccs-stat.
(function(){
window._kpMode=window._kpMode||{};
const I=()=>window._kpI;
let objs=[],picks=[],deco=[],stat={},hudEl=null,nextPick=0,lastMine=3;
const add=m=>{I().SC.add(m);objs.push(m);return m};
function clean(){objs.forEach(m=>{m.parent&&m.parent.remove(m);m.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&(o.material.map&&o.material.map.dispose(),o.material.dispose())})});objs=[];picks=[];deco=[];if(hudEl)hudEl.style.display='none'}
function popSnd(big){const k=I();k.noise(.09,3000,800,2,.35,'highpass');k.tone(big?500:900,big?80:200,.12,.18,'triangle')}
function spawnPick(W){const a=Math.random()*6.28,r=Math.random()*W.R*.6,k=I();
 const g=new THREE.Group();const can=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.7,12),new THREE.MeshPhongMaterial({color:0x22d3ee,shininess:120}));can.position.y=.35;g.add(can);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:k.texEmoji('đźŽ',96),depthTest:false}));sp.scale.set(.8,.8,1);sp.position.y=1.2;g.add(sp);
 g.position.set(Math.cos(a)*r,0,Math.sin(a)*r);add(g);picks.push({g,x:g.position.x,z:g.position.z,t:14})}
window._kpMode.lufi={
 round(W,SC){clean();const k=I();stat={};W.P.forEach(p=>stat[p.name]={pop:0,lost:0,refill:0});nextPick=W.t+6;lastMine=3;
  // dekor: lebegĹ‘ lufi-fĂĽrtĂ¶k a sziget peremĂ©n + Ă­v a kĂ¶zepĂ©n
  const cols=[0xef4444,0xfacc15,0x3b82f6,0xec4899,0x10b981,0xa855f7];
  for(let i=0;i<10;i++){const a=i/10*6.28,g=new THREE.Group();
   for(let j=0;j<4;j++){const b=new THREE.Mesh(new THREE.SphereGeometry(.35,10,8),new THREE.MeshPhongMaterial({color:cols[(i+j)%6],shininess:90}));b.scale.y=1.2;b.position.set((j%2-.5)*.5,4+j*.35,(j>>1)*.4);g.add(b)}
   const str=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,4,3),new THREE.MeshBasicMaterial({color:0xffffff}));str.position.y=2;g.add(str);
   g.position.set(Math.cos(a)*W.R*.95,0,Math.sin(a)*W.R*.95);add(g);deco.push({g,ph:i})}
  // tĂĽskĂ©s kaktuszok: aki hozzĂˇĂ©r, elveszĂ­t egy lufit
  W._lufiSpk=[];for(let i=0;i<3;i++){const a=i*2.09+.5,r=W.R*.45,c=new THREE.Mesh(new THREE.ConeGeometry(.35,1.1,8),new THREE.MeshPhongMaterial({color:0x15803d}));c.position.set(Math.cos(a)*r,.55,Math.sin(a)*r);add(c);W._lufiSpk.push({x:c.position.x,z:c.position.z,m:c})}
  k.feed('đźŽ HĂ©liumpalack = +1 lufi Â· đźŚµ kaktusz = PUKK!')},
 hit(s,t){if(!t.alive||t.pu==='buborek')return;const k=I(),W=k.W;
  if(stat[s.o.name])stat[s.o.name].pop++;if(stat[t.name])stat[t.name].lost++;
  popSnd(t.lives<=1);k.burst(t.x,t.y+3.2,t.z,0xffffff,8,4);
  if(t.lives<=1)k.feed(`đź’Ą ${s.o.name} kipukkasztotta ${t.name} utolsĂł lufijĂˇt!`);
  else if(s.o===W.me)k.banner('đźŽ PUKK!',.5,34)},
 tick(dt,T,W){const k=I();
  deco.forEach(d=>{d.g.position.y=Math.sin(T*1.3+d.ph)*.25;d.g.rotation.y=Math.sin(T*.5+d.ph)*.3});
  if(W.t>nextPick&&picks.length<2){spawnPick(W);nextPick=W.t+10+Math.random()*6}
  for(let i=picks.length-1;i>=0;i--){const pk=picks[i];pk.t-=dt;pk.g.position.y=Math.sin(T*3)*.15;pk.g.rotation.y+=dt*2;
   const p=W.P.find(p=>p.alive&&p.lives<3&&Math.hypot(p.x-pk.x,p.z-pk.z)<1.1);
   if(p||pk.t<=0){pk.g.parent.remove(pk.g);picks.splice(i,1);if(p){p.lives++;stat[p.name]&&stat[p.name].refill++;k.tone(300,1200,.35,.15,'sine');k.burst(pk.x,2.5,pk.z,0x22d3ee,16,4);k.feed(`đźŽ ${p.name} Ăşj lufit fĂşjt!`);if(p===W.me)k.banner('đźŽ +1 LUFI',.8,36)}}}
  (W._lufiSpk||[]).forEach(c=>W.P.forEach(p=>{if(!p.alive||p.inv>0||(p._spk||0)>T)return;if(Math.hypot(p.x-c.x,p.z-c.z)<.75&&p.y<1){p._spk=T+2.5;
   if(stat[p.name])stat[p.name].lost++;popSnd(p.lives<=1);k.burst(p.x,3,p.z,0x15803d,14,5);p.vx+=(p.x-c.x)*8;p.vz+=(p.z-c.z)*8;
   if(--p.lives<=0){p.lives=1;k.feed(`đźŚµ ${p.name} a kaktuszba futott!`);k.eliminate(p)}else if(p===W.me){k.banner('đźŚµ AU!',.6,36)}}}));
  // botok: kevĂ©s lufival a hĂ©liumpalack felĂ© hĂşznak
  W.P.forEach(p=>{if(!p.bot||!p.alive||p.lives>=3||!picks.length)return;const pk=picks[0],dx=pk.x-p.x,dz=pk.z-p.z,d=Math.hypot(dx,dz)||1;p.vx+=dx/d*dt*6;p.vz+=dz/d*dt*6});
  // utolsĂł lufi: lĂĽktetĂ©s + figyelmeztetĂ©s
  W.P.forEach(p=>{if(p.balG)p.balG.scale.setScalar(p.lives===1?1+Math.sin(T*10)*.08:1)});
  if(W.me&&W.me.lives===1&&lastMine>1){k.banner('âš ď¸Ź UTOLSĂ“ LUFI!',1,40);k.tone(220,180,.3,.12,'square')}lastMine=W.me?W.me.lives:3;
  if(!W.live&&!W._lufiEnd){W._lufiEnd=1;const b=Object.entries(stat).sort((a,b)=>b[1].pop-a[1].pop)[0];if(b&&b[1].pop)k.feed(`đźŹ† LegtĂ¶bb pukk: ${b[0]} (${b[1].pop}) Â· ` +Object.entries(stat).map(([n,s])=>`${n}: ${s.pop}đźŽ/${s.refill}â™»ď¸Ź`).join(', '))}
  if(W.live)W._lufiEnd=0},
 hud(W){if(!hudEl){hudEl=document.createElement('div');hudEl.style.cssText='position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:99999;font:700 18px sans-serif;color:#fff;text-shadow:0 2px 4px #000;pointer-events:none';(document.getElementById('kpw')||document.body).appendChild(hudEl)}
  hudEl.style.display='';const m=W.me,s=m&&stat[m.name]||{pop:0};hudEl.textContent=m?'đźŽ'.repeat(Math.max(0,m.lives))+'Â·'.repeat(Math.max(0,3-m.lives))+`  pukk: ${s.pop}`:''}
};
// mĂˇs mĂłdra vĂˇltĂˇskor takarĂ­tĂˇs
setInterval(()=>{const k=I();if(k&&objs.length&&k.ST.mode!=='lufi')clean()},1000);
})();
