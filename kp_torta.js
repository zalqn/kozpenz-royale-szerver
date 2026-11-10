// Sziget Aréna – 'torta' mód kiegészítés. Hookok: window._kpMode.torta = {round(W,SC), tick(dt,T,W), hit(s,t)->false=tiltás, hud(W)}; belső API: window._kpI
(function(){
const I=()=>window._kpI,MD=()=>I()&&I().MD();
let deco=[],creams=[],stat={thr:0,hit:0,perf:0},rdy=false,hudEl=null,splEl=null;
// közös geometriák/anyagok – soha nem dobjuk el őket
let G=null;function geo(){if(G)return G;G={
 crust:new THREE.CylinderGeometry(.42,.34,.16,18),cream:new THREE.SphereGeometry(.4,16,8,0,Math.PI*2,0,Math.PI/2),
 cherry:new THREE.SphereGeometry(.09,8,6),blob:new THREE.SphereGeometry(.22,10,8),
 mCr:new THREE.MeshLambertMaterial({color:0xd99a4e}),mCm:new THREE.MeshLambertMaterial({color:0xfffaf0}),
 mCh:new THREE.MeshLambertMaterial({color:0xe11d48}),mInv:new THREE.MeshBasicMaterial({visible:false})};return G}
function pie(){const g=geo(),p=new THREE.Group(),c=new THREE.Mesh(g.crust,g.mCr),k=new THREE.Mesh(g.cream,g.mCm),h=new THREE.Mesh(g.cherry,g.mCh);
 k.scale.y=.55;k.position.y=.08;h.position.y=.32;p.add(c,k,h);return p}
// a sárga gömb helyett igazi torta: a tick-ben felismerjük a friss lövedéket (nyújtott gömb), mert a _kpHook.spit-et a skin-modul felülírja
function dress(m){const G=geo();m.material=G.mInv;const t=pie();t.scale.z=1/1.6;t.rotation.x=-1.2;m.add(t);m.userData.pie=t;stat.thr++}
function clear(SC){deco.concat(creams.map(c=>c.m)).forEach(m=>{m.parent&&m.parent.remove(m)});deco=[];creams=[];if(splEl)splEl.style.opacity=0}
function splat(){if(!splEl){splEl=document.createElement('div');splEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:99999;opacity:0;transition:opacity 1.6s;background:radial-gradient(circle at 45% 50%,#fffaf0 0 18%,rgba(255,250,240,.85) 26%,transparent 40%),radial-gradient(circle at 70% 30%,#fff7e6 0 8%,transparent 14%),radial-gradient(circle at 25% 72%,#fff 0 7%,transparent 12%),radial-gradient(circle at 52% 52%,#e11d48 0 1.5%,transparent 2%)';(document.getElementById('kpw')||document.body).appendChild(splEl)}
 splEl.style.transition='none';splEl.style.opacity=1;void splEl.offsetWidth;splEl.style.transition='opacity 1.8s 0.7s';splEl.style.opacity=0}
window._kpMode=window._kpMode||{};
window._kpMode.torta={
 round(W,SC){clear(SC);stat={thr:0,hit:0,perf:0};const g=geo();
  // cukrászda-dekor: tortaállványok emeletes tortákkal a sziget peremén
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2+.4,r=W.R*.93,st=new THREE.Group();
   const leg=new THREE.Mesh(new THREE.CylinderGeometry(.06,.18,.7,8),new THREE.MeshLambertMaterial({color:0xe5e7eb}));leg.position.y=.35;
   const pl=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,.05,20),leg.material);pl.position.y=.72;st.add(leg,pl);
   [[.55,.35,0xf9a8d4],[.38,.3,0xfffaf0],[.22,.25,0x93c5fd]].reduce((y,[rr,h,c])=>{const t=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr,h,18),new THREE.MeshLambertMaterial({color:c}));t.position.y=y+h/2;st.add(t);return y+h},.75);
   const ch=new THREE.Mesh(g.cherry,g.mCh);ch.position.y=1.68;st.add(ch);st.position.set(Math.cos(a)*r,0,Math.sin(a)*r);SC.add(st);deco.push(st)}
  if(!hudEl){hudEl=document.createElement('div');hudEl.style.cssText='position:fixed;top:212px;right:12px;z-index:9999;font:700 14px system-ui;color:#fff;background:rgba(80,40,10,.65);padding:6px 10px;border-radius:10px;pointer-events:none';(document.getElementById('kpw')||document.body).appendChild(hudEl)}hudEl.style.display=''},
 tick(dt,T,W){
  const me=W.me;if(me&&me.charging&&me.chg>=1&&!rdy){rdy=true;I().tone(1320,60,.12,.2,'sine');I().banner('🥧 TELE!',.4,30)}if(me&&!me.charging)rdy=false;
  // repülő torták pörögnek
  for(const c of creams){c.l-=dt;if(c.l<=0&&c.m.parent)c.m.parent.remove(c.m)}creams=creams.filter(c=>c.l>0);
  I().SC.children.forEach(m=>{if(m.userData.pie)m.userData.pie.rotation.y+=dt*9;else if(m.isMesh&&m.geometry.type==='SphereGeometry'&&m.scale.x>1&&Math.abs(m.scale.z/m.scale.x-1.6)<.01)dress(m)})},
 hit(s,t){const W=I().W;stat.hit++;const perf=s.pow>=2.9;if(perf)stat.perf++;
  I().noise(.25,900,200,4,.5,'lowpass');I().tone(perf?140:220,perf?60:90,.25,.3,'square');
  I().burst(t.x,t.y+1.6,t.z,0xfffaf0,perf?40:16,perf?9:5);
  if(t===W.me)splat();else if(t.g){const b=new THREE.Mesh(geo().blob,geo().mCm);b.scale.set(1.2,.8,.6);b.position.set(0,1.7,.3);t.g.add(b);creams.push({m:b,l:3})}
  if(perf){I().shake=Math.max(I().shake,.4);I().feed('🥧 '+s.o.name+' telibe találta '+t.name+'-t!');if(t.bot&&Math.random()<.6)I().taunt(t,['Mmmpf! 🥧','Tejszín a szememben!','Ez meggyes volt?!'][Math.random()*3|0])}},
 hud(W){if(!hudEl)return;if(MD()!=='torta'){hudEl.style.display='none';return}hudEl.style.display='';hudEl.textContent=`🥧 ${stat.hit}/${stat.thr} talált · ⭐ ${stat.perf} telitalálat`}
};
// más módba váltáskor takarítás
setInterval(()=>{if(MD&&I()&&MD()!=='torta'&&(deco.length||creams.length||(hudEl&&hudEl.style.display!=='none'))){clear();if(hudEl)hudEl.style.display='none'}},1000);
})();
