// ===== INVENTORY (I): fegyverek ritkasággal, lőszer, gyógyítás, pajzs, nyersanyag – a játék közben fut tovább =====
(function(){
const css=document.createElement('style');css.textContent=`
#invP{position:fixed;inset:0;z-index:11;display:none;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#0b102299,#000c);font-family:Rajdhani,Arial;color:#fff}
#invP.on{display:flex}#invP .pn{width:min(920px,95vw);max-height:90vh;overflow:auto;padding:22px;border-radius:22px;background:#0b1022ee;backdrop-filter:blur(12px);border:1px solid #ffffff22;box-shadow:0 30px 90px #000;animation:invIn .16s ease-out}
@keyframes invIn{from{transform:scale(.96);opacity:0}to{transform:none;opacity:1}}
#invP h2{margin:0;font:30px 'Luckiest Guy',Impact;color:#ffd23f;display:flex;justify-content:space-between;align-items:center}#invP h2 small{font:700 14px Rajdhani,Arial;color:#94a3b8}
#invP h3{margin:16px 0 8px;font-size:16px;letter-spacing:1px;color:#94a3b8}
#invP .ws{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}
#invP .w{position:relative;padding:12px;border-radius:14px;background:#1e293b;border:2px solid #334155;cursor:pointer;transition:.12s;min-height:118px}
#invP .w:hover{transform:translateY(-2px);filter:brightness(1.15)}#invP .w.on{box-shadow:0 0 0 3px #ffd23f}#invP .w.no{opacity:.35;cursor:default;filter:grayscale(1)}
#invP .w .e{font-size:34px}#invP .w .n{font-weight:800;font-size:15px;line-height:1.1;margin:4px 0}#invP .w .r{font-size:12px;font-weight:800;letter-spacing:1px}#invP .w .a{font-size:14px;color:#cbd5e1}
#invP .w .k{position:absolute;top:8px;right:10px;font-weight:800;color:#64748b}
#invP .st{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
#invP .it{padding:12px;border-radius:14px;background:#1e293b;border:1px solid #334155;text-align:center}#invP .it b{display:block;font-size:26px}#invP .it span{font-size:22px;font-weight:800}#invP .it i{display:block;font-style:normal;color:#94a3b8;font-size:13px}
#invP .it button{margin-top:6px;padding:5px 12px;border:0;border-radius:8px;background:#16a34a;color:#fff;font:700 13px Rajdhani,Arial;cursor:pointer}#invP .it button:disabled{background:#334155;cursor:default}
#invP .bar{height:10px;border-radius:6px;background:#0f172a;overflow:hidden;margin-top:6px}#invP .bar div{height:100%}
#invP .ft{margin-top:14px;color:#64748b;font-size:13px;text-align:center}`;document.head.appendChild(css);
const P=document.createElement('div');P.id='invP';document.body.appendChild(P);
const RAR=()=>window._RAR||[{n:'',h:'#b0b8c4'}];
let on=false;
function render(){const g=G;if(!g)return;const R=RAR(),mats=window.BR?BR.mats|0:0;
 let h='<div class="pn"><h2>🎒 INVENTORY <small>I / Esc: bezár · a játék fut tovább</small></h2><h3>FEGYVEREK</h3><div class="ws">';
 h+='<div class="w'+(g.pickMode||!g.own[g.wp]?' on':'')+'" data-p="1"><span class="k">0</span><div class="e">⛏️</div><div class="n">CSÁKÁNY</div><div class="r" style="color:#ffd23f">ALAP</div><div class="a">Fa / épület kiütése</div></div>';
 WPN.forEach((w,i)=>{const own=g.own[i],r=own&&g.ry?R[Math.max(0,g.ry.rar[i]|0)]||R[0]:R[0];
  h+='<div class="w'+(own?'':' no')+(own&&!g.pickMode&&g.wp===i?' on':'')+'" data-w="'+i+'" style="'+(own?'border-color:'+r.h+';background:linear-gradient(160deg,'+r.h+'33,#1e293b 60%)':'')+'"><span class="k">'+(i+1)+'</span><div class="e">'+w.e+'</div><div class="n">'+w.n+'</div>'+(own?'<div class="r" style="color:'+r.h+'">'+r.n+'</div><div class="a">🔫 '+(g.mag[i]|0)+' / '+(g.res[i]|0)+' · ⚔️ '+w.dmg+(w.pellets>1?'×'+w.pellets:'')+'</div>':'<div class="a">Nincs nálad – keress ládát</div>')+'</div>'});
 h+='</div><h3>ÁLLAPOT ÉS KÉSZLET</h3><div class="st">';
 h+='<div class="it"><b>❤️</b><span>'+Math.round(g.hp)+'</span><i>Életerő / '+Math.round(g.mhp)+'</i><div class="bar"><div style="width:'+Math.max(0,g.hp/g.mhp*100)+'%;background:#22c55e"></div></div></div>';
 h+='<div class="it"><b>🛡️</b><span>'+Math.round(g.sh)+'</span><i>Pajzs / '+Math.round(g.msh||100)+'</i><div class="bar"><div style="width:'+Math.max(0,g.sh/(g.msh||100)*100)+'%;background:#38bdf8"></div></div></div>';
 h+='<div class="it"><b>🩹</b><span>'+g.inv.hp+'</span><i>Medkit (Z)</i><button data-u="0" '+(g.inv.hp?'':'disabled')+'>Használ</button></div>';
 h+='<div class="it"><b>🍺</b><span>'+g.inv.beer+'</span><i>Sör (X)</i><button data-u="1" '+(g.inv.beer?'':'disabled')+'>Használ</button></div>';
 h+='<div class="it"><b>🪵</b><span>'+mats+'</span><i>Nyersanyag (építés: B)</i></div>';
 h+='<div class="it"><b>💀</b><span>'+(g.kills|0)+'</span><i>Elimináció</i></div>';
 h+='</div><div class="ft">Kattints egy fegyverre a kézbe vételhez · Ládák: E nyomva 3 mp</div></div>';if(P._h!==h){P._h=h;P.innerHTML=h}}
function open(){if(!G||!run||!$('hud').classList.contains('on')||G.over)return;on=true;render();P.classList.add('on');if(document.pointerLockElement)document.exitPointerLock()}
function close(){if(!on)return;on=false;P.classList.remove('on');try{if(G&&G.fp&&run)ren.domElement.requestPointerLock()}catch(e){}}
window.invPanel={open,close,get isOpen(){return on}};
addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'))return;const k=e.key.toLowerCase();
 if(k==='i'){if(on)close();else open();e.preventDefault();e.stopImmediatePropagation()}else if(k==='escape'&&on){close();e.stopImmediatePropagation()}},true);
P.addEventListener('click',e=>{const g=G;if(e.target===P)return close();const u=e.target.closest('[data-u]');if(u){try{useI(+u.dataset.u)}catch(x){}render();return}
 const c=e.target.closest('.w');if(!c)return;if(c.dataset.p){g.pickMode=true}else{const i=+c.dataset.w;if(!g.own[i])return;g.pickMode=false;selW(i)}try{sfx('click')}catch(x){}render()});
let t=0;{const o=window.update;window.update=function(dt){const r=o.apply(this,arguments);if(on){t+=dt||0;if(t>.25){t=0;try{render()}catch(e){}}if(!G||G.over)close()}return r}}
// az Esc-menü ne nyíljon meg, amikor az inventory oldja fel az egeret
['end','quitMatch','launch'].forEach(n=>{const o=window[n];if(typeof o==='function')window[n]=function(){close();return o.apply(this,arguments)}});
})();
