// ===== VÁLTÓ: játékbeli Ft ⇄ zseton (csak játékon belüli pénz) =====
(function(){
const RATE=100,BACK=80; // 100 Ft = 1 zseton · 1 zseton = 80 Ft (váltási díj)
const fmt=n=>Math.floor(n).toLocaleString('hu-HU');
const css=document.createElement('style');css.textContent=`#vlt{position:fixed;inset:0;z-index:11;display:none;align-items:center;justify-content:center;font-family:Rajdhani,Arial;color:#fff;background:radial-gradient(900px 500px at 50% 0%,#3b2a07 0%,#120d03 60%,#050402 100%)}
#vlt.on{display:flex}#vlt .pn{width:min(620px,94vw);padding:24px;border-radius:24px;background:#1a1408e6;border:1px solid #facc1555;box-shadow:0 30px 90px #000,inset 0 1px 0 #ffffff14}
#vlt .hd{display:flex;align-items:center;gap:10px}#vlt .hd b{font:32px 'Luckiest Guy',Impact;color:#facc15;text-shadow:0 3px 0 #000}#vlt .hd button{margin-left:auto;border:0;border-radius:10px;width:42px;height:42px;background:#ef4444;color:#fff;font-size:20px;cursor:pointer}
#vlt .bal{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}#vlt .bal div{padding:12px;border-radius:14px;background:#0008;border:1px solid #ffffff1a;text-align:center}#vlt .bal i{display:block;font-style:normal;color:#a8a29e;font-weight:700}#vlt .bal span{font:26px 'Luckiest Guy',Impact}
#vlt .md{display:flex;gap:8px;margin-bottom:12px}#vlt .md button{flex:1;padding:11px;border-radius:12px;border:2px solid #57534e;background:#292524;color:#fff;font:700 16px Rajdhani,Arial;cursor:pointer}#vlt .md button.on{border-color:#facc15;background:#422006;color:#fde047}
#vlt input[type=range]{width:100%;accent-color:#facc15}#vlt .q{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}#vlt .q button{flex:1;padding:8px;border-radius:10px;border:1px solid #57534e;background:#1c1917;color:#fff;font:700 14px Rajdhani,Arial;cursor:pointer}
#vlt .res{padding:14px;border-radius:14px;background:#0009;text-align:center;font-weight:700;font-size:18px}#vlt .res b{color:#fde047;font:28px 'Luckiest Guy',Impact}
#vlt .go{width:100%;margin-top:14px;padding:14px;border:0;border-radius:14px;background:linear-gradient(90deg,#facc15,#f59e0b);color:#1a1200;font:24px 'Luckiest Guy',Impact;cursor:pointer}#vlt .go:disabled{filter:grayscale(1);opacity:.5;cursor:default}
#vlt .nt{margin-top:10px;color:#a8a29e;font-size:13px;text-align:center}#vlt .ok{color:#4ade80;text-align:center;font-weight:800;min-height:22px;margin-top:8px}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='vlt';D.innerHTML=`<div class="pn"><div class="hd"><b>💱 VÁLTÓ</b><span style="color:#a8a29e;font-weight:700">Forint ⇄ zseton</span><button id="vltX">✕</button></div>
<div class="bal"><div><i>💰 Forint</i><span id="vFt" style="color:#a3e635"></span></div><div><i>🪙 Zseton</i><span id="vZs" style="color:#facc15"></span></div></div>
<div class="md"><button data-m="ft2zs" class="on">Ft → Zseton</button><button data-m="zs2ft">Zseton → Ft</button></div>
<input type="range" id="vAm" min="0" max="0" step="1" value="0"><div class="q"><button data-q=".1">10%</button><button data-q=".25">25%</button><button data-q=".5">50%</button><button data-q="1">MAX</button></div>
<div class="res" id="vRes"></div><button class="go" id="vGo">VÁLTÁS</button><div class="ok" id="vOk"></div>
<div class="nt">Árfolyam: ${RATE} Ft = 1 zseton · visszaváltás: 1 zseton = ${BACK} Ft · csak játékbeli pénz</div></div>`;document.body.appendChild(D);
let mode='ft2zs';const $$=i=>document.getElementById(i);
const ftB=()=>(typeof S!=='undefined'&&S)?S.c|0:0,zsB=()=>window.BR?BR.zs|0:0;
function upd(){$$('vFt').textContent=fmt(ftB())+' Ft';$$('vZs').textContent=fmt(zsB());const am=$$('vAm');
 if(mode==='ft2zs'){am.max=Math.floor(ftB()/RATE);}else am.max=zsB();if(+am.value>+am.max)am.value=am.max;const v=+am.value;
 $$('vRes').innerHTML=mode==='ft2zs'?fmt(v*RATE)+' Ft → <b>'+fmt(v)+' 🪙</b>':fmt(v)+' 🪙 → <b>'+fmt(v*BACK)+' Ft</b>';$$('vGo').disabled=v<=0}
D.addEventListener('click',e=>{const t=e.target;try{if(t.tagName==='BUTTON')sfx('click')}catch(x){}
 if(t.id==='vltX'||t===D)return close();if(t.dataset.m){mode=t.dataset.m;D.querySelectorAll('.md button').forEach(b=>b.classList.toggle('on',b===t));$$('vAm').value=0;$$('vOk').textContent='';upd()}
 if(t.dataset.q){const am=$$('vAm');am.value=Math.floor(am.max*+t.dataset.q);upd()}
 if(t.id==='vGo'){const v=+$$('vAm').value;if(v<=0)return;if(mode==='ft2zs'){if(ftB()<v*RATE)return;S.c-=v*RATE;BR.zs=(BR.zs||0)+v;$$('vOk').textContent='✅ +'+fmt(v)+' zseton'}else{if(zsB()<v)return;BR.zs-=v;S.c+=v*BACK;$$('vOk').textContent='✅ +'+fmt(v*BACK)+' Ft'}
  try{save()}catch(x){}try{st.s('k3br',window.BR)}catch(x){}try{sfx('coin')}catch(x){}$$('vAm').value=0;upd();try{if(window.lbRefresh)lbRefresh()}catch(x){}}});
$$('vAm').oninput=upd;
function close(){D.classList.remove('on')}
window.openValto=function(){if(!window.BR){alert('Előbb jelentkezz be!');return}D.classList.add('on');upd()};
addEventListener('keydown',e=>{if(e.key==='Escape'&&D.classList.contains('on')){close();e.stopImmediatePropagation()}},true);
})();
