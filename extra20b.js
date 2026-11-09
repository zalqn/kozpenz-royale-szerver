// ===== MECCSNAPLÓ + BOLDOG ÓRA (19:00–20:00 dupla meccspénz) =====
(function(){
const $$=i=>document.getElementById(i),fmt=n=>(+n||0).toLocaleString('hu-HU');
const LOG=(()=>{try{return JSON.parse(localStorage.getItem('k3x20log'))||[]}catch(e){return[]}})();
const happy=()=>new Date().getHours()===19;
const o=window.end;
if(typeof o==='function')window.end=function(win){const g=typeof G!=='undefined'?G:null;const pre=!!(g&&!g.over);let bonus=0;
 if(pre&&happy()&&g.cash>0&&!g.stw&&!g.fk){bonus=Math.round(g.cash);g.cash*=2}
 const r=o.apply(this,arguments);
 try{if(pre){LOG.unshift({t:Date.now(),win:!!win,k:g.kills|0,mode:window.GAME_MODE||'royale',dur:Math.round(g.t||0),cash:Math.round(g.cash||0)});if(LOG.length>20)LOG.length=20;localStorage.setItem('k3x20log',JSON.stringify(LOG));
  if(bonus){const rb=$$('rb');if(rb){const d=document.createElement('div');d.style.cssText='color:#fde68a;font-weight:800';d.textContent='🌅 BOLDOG ÓRA: dupla meccspénz! (+'+fmt(bonus)+' Ft)';rb.prepend(d)}}}}catch(e){console.error('naplo',e)}
 return r};
window.x20log=()=>{const ML={royale:'⚔️ Battle Royale',stw:'🌍 Mentsd meg',flakon:'🧴 Flakon',train:'🎯 Edzés'};
 const w=LOG.filter(x=>x.win).length,k=LOG.reduce((a,x)=>a+x.k,0);
 const h='<h2>📜 MECCSNAPLÓ (utolsó 20)</h2><div class="x20row"><span>Győzelmek: <b>'+w+'/'+LOG.length+'</b></span><span>Kiesések: <b>'+k+'</b> · átlag: <b>'+(LOG.length?(k/LOG.length).toFixed(1):0)+'</b></span></div>'+
 (LOG.map(x=>'<div class="x20row"><span>'+(x.win?'🏆':'💀')+' '+(ML[x.mode]||x.mode)+' <small style="opacity:.6">'+new Date(x.t).toLocaleString('hu-HU',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})+'</small></span><span>'+x.k+' kiesés · '+Math.floor(x.dur/60)+':'+String(x.dur%60).padStart(2,'0')+' · '+fmt(x.cash)+' Ft</span></div>').join('')||'<div style="opacity:.6">Még nincs lejátszott meccs.</div>')+
 '<div style="margin-top:6px;font-size:14px;opacity:.8">🌅 Boldog óra: minden este 19:00 és 20:00 között dupla meccspénz! '+(happy()?'<b style="color:#86efac">MOST AKTÍV!</b>':'')+'</div>';
 $$('x20MB').innerHTML=h+'<div style="text-align:right;margin-top:10px"><button onclick="x20hub()">◀ VISSZA</button><button onclick="x20close()">BEZÁR</button></div>';$$('x20M').style.display='flex'};
const oh=window.x20hub;
if(typeof oh==='function'){window.x20hub=function(){oh();const g=document.querySelector('#x20MB div[style*="grid"]');if(g){const b=document.createElement('button');b.className='y';b.style.cssText='padding:16px;font-size:18px';b.textContent='📜 MECCSNAPLÓ';b.onclick=window.x20log;g.appendChild(b);
  if(happy()){const d=document.createElement('div');d.style.cssText='margin-top:8px;color:#fde68a;font-weight:800';d.textContent='🌅 BOLDOG ÓRA VAN: dupla meccspénz 20:00-ig!';g.after(d)}}};
 const bi=setInterval(()=>{const b=$$('x20B');if(!b)return;clearInterval(bi);b.onclick=window.x20hub},1000)}
})();
