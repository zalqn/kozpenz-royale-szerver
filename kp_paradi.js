// Sziget Aréna – 'paradi' mód kiegészítés: csapatszínű térfelek, zászlók, középvonal (nem léphető át), paradicsom-foltok, fedezékkereső botok, csapat-HUD + statok
(function(){
const M=window._kpMode=window._kpMode||{};const I=()=>window._kpI;
let st=null,hudEl=null;const SPL=[];
function clearSplats(W){SPL.forEach(o=>o.parent&&o.parent.remove(o));SPL.length=0;}
M.paradi={
 round(W,SC){const T=THREE,mo=o=>{SC.add(o);W.modeObj.push(o);return o};clearSplats(W);
  if(!st||W.round===1)st={hits:[0,0]};
  [0,1].forEach(k=>{const col=k?0x3b82f6:0xef4444,sg=k?1:-1;
   const h=mo(new T.Mesh(new T.CircleGeometry(W.R*.98,40,k?Math.PI:0,Math.PI),new T.MeshBasicMaterial({color:col,transparent:true,opacity:.16,depthWrite:false})));h.rotation.x=-Math.PI/2;h.position.y=.04;
   // zászló a bázison
   const pole=mo(new T.Mesh(new T.CylinderGeometry(.06,.06,3.2,6),new T.MeshLambertMaterial({color:0xdddddd})));pole.position.set(-W.R*.6,1.6,sg*W.R*.55);
   const fl=mo(new T.Mesh(new T.PlaneGeometry(1.2,.75),new T.MeshLambertMaterial({color:col,side:T.DoubleSide})));fl.position.set(-W.R*.6+.62,2.8,sg*W.R*.55);fl.userData.flag=1;
   const base=mo(new T.Mesh(new T.RingGeometry(1.2,1.5,24),new T.MeshBasicMaterial({color:col,transparent:true,opacity:.5,side:T.DoubleSide})));base.rotation.x=-Math.PI/2;base.position.set(-W.R*.6,.06,sg*W.R*.55);});
  const ln=mo(new T.Mesh(new T.PlaneGeometry(W.R*2,.18),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7})));ln.rotation.x=-Math.PI/2;ln.position.y=.05;
  if(W.round>1)I().feed(`🍅 Állás: 🔴 ${W.P.find(p=>!p.team)?.roundWins||0} – ${W.P.find(p=>p.team)?.roundWins||0} 🔵`)},
 hit(s,t){if(t.inv>0||!s.o||s.o.team===t.team)return;const k=s.o.team?1:0;st.hits[k]++;
  if(t.pu!=='buborek'){// folt a játékoson + a földön
   const g=new THREE.Mesh(new THREE.SphereGeometry(.16,6,4),new THREE.MeshLambertMaterial({color:0xdc2626}));g.scale.set(1,.45,1);g.position.set((Math.random()-.5)*.7,.8+Math.random()*.9,(Math.random()-.5)*.7);
   const own=SPL.filter(o=>o.parent===t.g);if(own.length>=7){t.g.remove(own[0]);SPL.splice(SPL.indexOf(own[0]),1)}t.g.add(g);SPL.push(g);
   const W=I().W,d=new THREE.Mesh(new THREE.CircleGeometry(.3+Math.random()*.3,9),new THREE.MeshBasicMaterial({color:0xb91c1c,transparent:true,opacity:.8,depthWrite:false}));d.rotation.x=-Math.PI/2;d.position.set(t.x+(Math.random()-.5),.07,t.z+(Math.random()-.5));I().SC.add(d);W.modeObj.push(d);
   I().tone(220,90,.12,.18,'sawtooth');I().noise(.15,1200,300,1,.2)}},
 tick(dt,T,W){const R=I();
  for(const o of W.modeObj)if(o.userData.flag){o.rotation.y=Math.sin(W.t*3+o.position.z)*.35}
  for(const p of W.P){if(!p.alive)continue;const sg=p.team?1:-1;
   if(p.z*sg<.4)p.z=sg*.4;// középvonal: saját térfélen maradsz
   if(p.bot&&p.ai&&p.ground){// sérülten fedezékbe húzódik (láda mögé az ellenfél felől)
    if(p.pct>55){let b=null,bd=1e9;for(const c of R.CRATES){if(c.z*sg<-.1)continue;const cz=c.z+sg*(c.w/2+.8),d=Math.hypot(c.x-p.x,cz-p.z);if(d<bd){bd=d;b={x:c.x,z:cz}}}
     if(b&&bd>.4){p.x+=(b.x-p.x)/bd*dt*2.2;p.z+=(b.z-p.z)/bd*dt*2.2}}
    else if(Math.random()<dt*.25)p.ai.strafe*=-1}}},// flankolás: oldalváltás
 hud(W){if(!st)return;if(!hudEl){hudEl=document.createElement('div');hudEl.id='kpParHud';hudEl.style.cssText='position:fixed;top:58px;left:50%;transform:translateX(-50%);z-index:2147483000;font:700 15px system-ui;color:#fff;background:rgba(0,0,0,.55);padding:5px 14px;border-radius:12px;pointer-events:none;white-space:nowrap';(document.getElementById('kpList')?.parentNode||document.body).appendChild(hudEl)}
  const a=k=>W.P.filter(p=>(p.team?1:0)===k&&p.lives>0).length,w=k=>W.P.find(p=>(p.team?1:0)===k)?.roundWins||0;
  hudEl.innerHTML=`<span style="color:#f87171">🔴 ${w(0)}</span> <small>(${a(0)} él · ${st.hits[0]}🍅)</small> &nbsp;–&nbsp; <small>(${st.hits[1]}🍅 · ${a(1)} él)</small> <span style="color:#60a5fa">${w(1)} 🔵</span>`;hudEl.style.display='';hudEl._t=Date.now()}};
setInterval(()=>{if(I()&&I().ST.mode!=="paradi")clearSplats();if(hudEl&&(Date.now()-hudEl._t>2500))hudEl.style.display='none'},400);
})();
