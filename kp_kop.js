// Sziget Aréna – 'kop' mód kiegészítés. Hookok: window._kpMode.kop = {round(W,SC), tick(dt,T,W), hit(s,t)->false=tiltás, hud(W)}; belső API: window._kpI
// Tartalom: 3D díszlet (pálmák, sziklák, világítótorony), izzó perem-gyűrű, 🏆 Arany Köpőcsésze (3 szuperköpés), KO-számláló + KO-hírek, KO-tábla HUD.
(function(){
const M=window._kpMode=window._kpMode||{};const I=()=>window._kpI;
let props=[],ring=null,cup=null,cupT=8,ko={},wasAlive=new Map(),hudEl=null,firstKO=false;
function add(SC,m){SC.add(m);props.push(m);return m}
function clear(){const SC=I()&&I().SC;props.forEach(m=>{if(m.parent)m.parent.remove(m);m.traverse(o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose&&o.material.dispose()})});props=[];ring=cup=null}
function palm(SC,x,z,h){const g=new THREE.Group();const tr=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,h,6),new THREE.MeshLambertMaterial({color:0x8b5a2b}));tr.position.y=h/2;tr.rotation.z=.12;g.add(tr);
 for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.ConeGeometry(.25,1.8,4),new THREE.MeshLambertMaterial({color:0x2f9e44}));l.position.set(Math.cos(i)*0.7,h+.1,Math.sin(i)*0.7);l.rotation.set(Math.sin(i)*1.3,0,-Math.cos(i)*1.3);g.add(l)}
 g.position.set(x,0,z);return add(SC,g)}
M.kop=Object.assign(M.kop||{},{
 round(W,SC){clear();const R=W.R;ko=ko||{};if(W.round===1){ko={};firstKO=false}wasAlive=new Map();
  // perem-gyűrű: piros, ha valaki magas %-kal a szélen áll
  ring=add(SC,new THREE.Mesh(new THREE.TorusGeometry(R,.08,6,64),new THREE.MeshBasicMaterial({color:0xff3b3b,transparent:true,opacity:.25})));ring.rotation.x=Math.PI/2;ring.position.y=.08;
  for(let i=0;i<5;i++){const a=i*1.257+.3;palm(SC,Math.cos(a)*R*.86,Math.sin(a)*R*.86,2.4+Math.random())}
  for(let i=0;i<8;i++){const a=i*.785+.1;const r=add(SC,new THREE.Mesh(new THREE.DodecahedronGeometry(.35+Math.random()*.3),new THREE.MeshLambertMaterial({color:0x8a8f98})));r.position.set(Math.cos(a)*R*1.08,-.1,Math.sin(a)*R*1.08)}
  const lh=add(SC,new THREE.Group());const b=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,5,10),new THREE.MeshLambertMaterial({color:0xf1f5f9}));b.position.y=2.5;lh.add(b);
  const st=new THREE.Mesh(new THREE.CylinderGeometry(.82,.82,.6,10),new THREE.MeshLambertMaterial({color:0xdc2626}));st.position.y=3.2;lh.add(st);
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(.45,10,8),new THREE.MeshBasicMaterial({color:0xfff3a0}));lamp.position.y=5.4;lh.add(lamp);lh.userData.lamp=lamp;lh.position.set(R*1.35,-.5,-R*.5);lh.name='kopLH';
  cupT=8;
  if(!hudEl){hudEl=document.createElement('div');hudEl.id='kpKopKO';hudEl.style.cssText='position:fixed;left:16px;top:225px;z-index:99999;font:600 13px system-ui;color:#fff;background:rgba(10,20,40,.6);border:1px solid #38bdf8;border-radius:8px;padding:6px 10px;pointer-events:none;white-space:pre'}
  (document.getElementById('kpw')||document.body).appendChild(hudEl);
 },
 tick(dt,T,W){if(!W||!W.P)return;const k=I();
  // KO-detektálás
  W.P.forEach(p=>{const was=wasAlive.get(p);if(was&&!p.alive&&p.lastHit&&p.lastHit!==p){const n=p.lastHit.name;ko[n]=(ko[n]||0)+1;k.feed(`💦 <b>${n}</b> leköpte: ${p.name} (${Math.round(p.pct)}%)`);
    if(!firstKO){firstKO=true;k.banner('🩸 ELSŐ KIÜTÉS: '+n,1.2,36)}if(p.lastHit===W.me){k.tone(660,.08,.2,.2,'square');k.tone(990,.12,.2,.2,'square')}}
   wasAlive.set(p,p.alive)});
  // perem-figyelmeztetés
  if(ring){let d=0;W.P.forEach(p=>{if(p.alive&&p.pct>80)d=Math.max(d,Math.hypot(p.x,p.z)/W.R)});ring.material.opacity=.2+Math.max(0,d-.6)*1.5*(.6+.4*Math.sin(T*10))}
  const lh=props.find(m=>m.name==='kopLH');if(lh)lh.userData.lamp.material.color.setHSL(.14,1,.6+.3*Math.sin(T*3));
  // 🏆 Arany Köpőcsésze
  if(!cup){cupT-=dt;if(cupT<=0&&W.live){const a=Math.random()*6.28,r=Math.random()*W.R*.5;cup=add(k.SC,new THREE.Mesh(new THREE.CylinderGeometry(.45,.3,.6,12,1,true),new THREE.MeshLambertMaterial({color:0xfacc15,emissive:0x7a5a00,side:THREE.DoubleSide})));cup.position.set(Math.cos(a)*r,1,Math.sin(a)*r);k.feed('🏆 Megjelent az Arany Köpőcsésze!')}}
  else{cup.rotation.y+=dt*2;cup.position.y=1+.25*Math.sin(T*3);const p=W.P.find(p=>p.alive&&Math.hypot(p.x-cup.position.x,p.z-cup.position.z)<1.1&&p.y<2.5);
   if(p){p.kopGold=3;k.burst(cup.position.x,1,cup.position.z,0xfacc15,24,6);k.tone(520,.1,.25,.25,'triangle');k.tone(780,.15,.25,.25,'triangle');k.feed(`🏆 ${p.name}: 3 ARANYKÖPÉS!`);if(p===W.me)k.banner('🏆 ARANYKÖPÉS ×3',1,40);
    k.SC.remove(cup);cup.geometry.dispose();cup.material.dispose();props=props.filter(m=>m!==cup);cup=null;cupT=12+Math.random()*8}}
 },
 hit(s,t){if(s.o&&s.o.kopGold>0&&!s.kopG){s.kopG=1;s.pow*=1.7;s.o.kopGold--;const k=I();k.burst(t.x,t.y+1.3,t.z,0xfacc15,16,6);k.shake=Math.max(k.shake,.2)}},
 hud(W){if(!hudEl)return;const rows=Object.entries(ko).sort((a,b)=>b[1]-a[1]).slice(0,5);const g=W.me&&W.me.kopGold?`\n🏆 aranyköpés: ${W.me.kopGold}`:'';hudEl.textContent='💦 KIÜTÉSEK\n'+(rows.length?rows.map(([n,c])=>n+': '+c).join('\n'):'—')+g;hudEl.style.display=W.live?'':'none'}
});
// más módban rejtsük a HUD-ot és a díszletet
setInterval(()=>{const k=I();if(!k)return;if(k.ST.mode!=='kop'||!k.W||!k.W.live){if(hudEl)hudEl.style.display='none';if(k.ST.mode!=='kop'&&props.length)clear()}},500);
})();
