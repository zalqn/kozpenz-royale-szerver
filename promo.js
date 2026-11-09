// ===== PROMÓCIÓS KÓDOK: beváltás, saját kód létrehozása, jutalom a kód készítőjének =====
(function(){
const $$=i=>document.getElementById(i);
const tok=()=>localStorage.getItem('ry_token')||'';
const api=(p,b)=>fetch(p,{method:b?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+tok()},body:b?JSON.stringify(b):undefined}).then(r=>r.json()).catch(()=>({error:'Nem érem el a szervert.'}));
const fmt=n=>(+n).toLocaleString('hu-HU');
const css=document.createElement('style');css.textContent=`
#prM{position:fixed;inset:0;z-index:60;background:#000a;display:none;align-items:center;justify-content:center}
#prM>div{background:linear-gradient(160deg,#1a1440,#0b1022);border:1px solid #a78bfa55;border-radius:18px;padding:18px 22px;color:#fff;font:600 16px Rajdhani,sans-serif;width:min(560px,92vw);max-height:88vh;overflow:auto;box-shadow:0 20px 60px #000}
#prM h2{margin:0 0 6px;font:26px 'Luckiest Guy',Impact;color:#c4b5fd}
#prM input{width:100%;box-sizing:border-box;padding:11px 12px;border-radius:10px;border:2px solid #a78bfa66;background:#0008;color:#fff;font:700 20px Rajdhani;letter-spacing:2px;text-transform:uppercase;outline:none}
#prM input:focus{border-color:#c4b5fd}
#prM button{display:inline-block;width:auto;border:0;border-radius:10px;padding:9px 16px;margin:6px 4px 0 0;font:700 16px Rajdhani,sans-serif;cursor:pointer;background:#334155;color:#fff}
#prM button.y{background:linear-gradient(135deg,#c4b5fd,#7c3aed);color:#fff}
#prMsg{min-height:24px;margin-top:8px;font-size:17px}
.prRow{display:flex;justify-content:space-between;padding:6px 10px;margin:4px 0;background:#ffffff0d;border-radius:10px}
#prPop{position:fixed;left:50%;top:40%;transform:translate(-50%,-50%) scale(.6);z-index:70;background:radial-gradient(circle,#4c1d95,#1e1b4b);border:3px solid #fde68a;border-radius:22px;padding:24px 34px;color:#fff;text-align:center;font:700 18px Rajdhani;opacity:0;pointer-events:none;transition:all .35s cubic-bezier(.3,1.6,.5,1);box-shadow:0 0 60px #a78bfa}
#prPop.on{opacity:1;transform:translate(-50%,-50%) scale(1)}#prPop b{display:block;font:44px 'Luckiest Guy',Impact;color:#fde68a;margin:6px 0}`;
document.head.appendChild(css);
const M=document.createElement('div');M.id='prM';M.innerHTML='<div id="prMB"></div>';document.body.appendChild(M);M.addEventListener('mousedown',e=>{if(e.target===M)close()});
const pop=document.createElement('div');pop.id='prPop';document.body.appendChild(pop);let popT=0;
function close(){M.style.display='none'}
// jutalom jóváírása (Ft = S.c, token = BR.zs zseton, kiegészítő = BR.own)
function apply(rw){let txt='',big='';
 if(rw.k==='ft'){try{S.c+=rw.n;save()}catch(e){}big='+'+fmt(rw.n)+' Ft';txt='💰 Pénz'}
 else if(rw.k==='zs'){try{BR.zs=(BR.zs|0)+rw.n;st.s('k3br',BR)}catch(e){}big='+'+fmt(rw.n)+' 🪙';txt='Token (zseton)'}
 else{const all=(window.BRCOS||[]).filter(c=>c.id&&!/_def$|_none$/.test(c.id)&&!(BR.own||{})[c.id]);
  if(all.length){const c=all[Math.floor(Math.random()*all.length)];BR.own=BR.own||{};BR.own[c.id]=1;try{st.s('k3br',BR)}catch(e){}big=(c.e||'🎁')+' '+c.n;txt='Új kiegészítő'}
  else{BR.zs=(BR.zs|0)+500;try{st.s('k3br',BR)}catch(e){}big='+500 🪙';txt='Minden kiegészítőd megvan, ezért token'}}
 return{txt,big}}
function show(title,r){pop.innerHTML=title+'<b>'+r.big+'</b>'+r.txt;pop.classList.add('on');clearTimeout(popT);popT=setTimeout(()=>pop.classList.remove('on'),3200);try{sfx('drop')}catch(e){}}
async function draw(msg){const me=tok()?await api('/api/promo/mine'):{error:'login'};if(me.pend&&me.pend.length)grant(me.pend);
 $$('prMB').innerHTML='<h2>🎟️ PROMÓCIÓS KÓD</h2><div style="opacity:.75;font-size:14px">Írd be a kódot, és véletlenszerű jutalmat kapsz: pénzt, tokent vagy kiegészítőt.</div>'+
 '<input id="prIn" maxlength="16" placeholder="PL. ZALQN111" autocomplete="off"><div><button class="y" id="prGo">BEVÁLTÁS</button></div><div id="prMsg">'+(msg||'')+'</div>'+
 '<h2 style="margin-top:14px">✨ SAJÁT KÓD</h2><div style="opacity:.75;font-size:14px">Hozz létre kódot, és oszd meg! Ha valaki beváltja, <b>te is kapsz</b> egy véletlenszerű jutalmat. (4–16 betű/szám, legfeljebb 5 kód)</div>'+
 '<input id="prNew" maxlength="16" placeholder="SAJÁT KÓDOD" autocomplete="off"><div><button class="y" id="prMk">LÉTREHOZÁS</button></div>'+
 (me.error==='login'||(me.error&&!me.list)?'<div style="color:#fca5a5;margin-top:8px">'+(me.error==='login'?'Saját kódhoz be kell jelentkezned.':me.error)+'</div>':
  (me.list||[]).map(c=>'<div class="prRow"><b style="letter-spacing:2px">'+c.code.toUpperCase()+'</b><span>'+c.uses+'× beváltva'+(c.last.length?' · '+c.last.join(', '):'')+'</span></div>').join('')||'<div style="opacity:.6;margin-top:6px">Még nincs saját kódod.</div>')+
 '<div style="text-align:right;margin-top:10px"><button id="prClose">BEZÁR</button></div>';
 const inp=$$('prIn');inp.focus();inp.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')redeem()};$$('prNew').onkeydown=e=>{e.stopPropagation();if(e.key==='Enter')create()};
 $$('prGo').onclick=redeem;$$('prMk').onclick=create;$$('prClose').onclick=close}
async function redeem(){const code=$$('prIn').value.trim();if(!code)return;if(!tok()){$$('prMsg').innerHTML='<span style="color:#fca5a5">Előbb jelentkezz be!</span>';return}
 const r=await api('/api/promo/redeem',{code});if(r.error){$$('prMsg').innerHTML='<span style="color:#fca5a5">❌ '+r.error+'</span>';return}
 const a=apply(r.rw);show('🎉 KÓD BEVÁLTVA!',a);draw('<span style="color:#86efac">✅ '+a.big+' ('+a.txt+')'+(r.by?' · a kód készítője, '+r.by+' is kapott jutalmat!':'')+'</span>')}
async function create(){const code=$$('prNew').value.trim();const r=await api('/api/promo/create',{code});
 draw(r.error?'<span style="color:#fca5a5">❌ '+r.error+'</span>':'<span style="color:#86efac">✅ Kész: <b>'+r.code.toUpperCase()+'</b>, oszd meg a barátaiddal!</span>')}
function grant(list){list.forEach((p,i)=>setTimeout(()=>{const a=apply(p.rw);show('🎟️ '+p.from+' beváltotta a kódodat ('+p.code.toUpperCase()+')!',a)},i*3500))}
function open(){M.style.display='flex';if(document.pointerLockElement)document.exitPointerLock();draw()}
window.promoOpen=open;
// készítői jutalmak: belépés után és időnként
async function poll(){if(!tok()||(typeof run!=='undefined'&&run))return;const r=await api('/api/promo/mine');if(r.pend&&r.pend.length)grant(r.pend)}
setTimeout(poll,5000);setInterval(poll,45000);
// lobby gomb
const di=setInterval(()=>{const d=$$('soDock');if(!d)return;clearInterval(di);if($$('prB'))return;const b=document.createElement('button');b.id='prB';b.className='hot';b.textContent='🎟️ PROMÓCIÓS KÓD';b.onclick=open;d.appendChild(b)},800);
})();
