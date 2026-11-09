// felhomentes.js – ☁️ EGYSÉGES FELHŐMENTÉS: az összes játékmentés (S, BR, k3*, vs2*, ry_* … localStorage) a fiókhoz kötve.
// Belépéskor letölt (ha a szerveren újabb → visszaállít + egyszer újratölt), változáskor 20 mp-es debounce-szal + oldalbezáráskor feltölt.
// Vendég mód: csak helyi. Szerver: GET/POST /api/save (max 2 MB, server/saves/<név>.json). Debug: _cloud
(function(){
const SKIP=new Set(['ry_token','ap_name','ap_pw','ap_av','k3rang']); // a rang külön, szerver által ellenőrzött mező
const SKIP_RE=/^(cs_|_cloud|debug|x20ev$)/;
const KEY_MAX=400000, TOTAL_MAX=1900000;
const META='_cloudT_'; // helyi időbélyeg fióknevenként
const C={st:'—',last:0,hash:'',busy:false,dirty:false};window._cloud=C;
const acc=()=>window.ACC&&ACC.user&&!ACC.guest&&ACC.token?ACC:null;
const flush=()=>{try{if(typeof save==='function')save()}catch(e){}try{if(typeof BR!=='undefined'&&BR&&typeof st!=='undefined')st.s('k3br',BR)}catch(e){}};
function collect(){const d={},list=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||SKIP.has(k)||SKIP_RE.test(k))continue;const v=localStorage.getItem(k);if(v==null||v.length>KEY_MAX)continue;list.push([k,v])}
 list.sort((a,b)=>a[1].length-b[1].length);let tot=0;for(const [k,v] of list){if(tot+v.length+k.length>TOTAL_MAX)break;tot+=v.length+k.length;d[k]=v}return d}
function hash(d){let h=0;const s=Object.keys(d).sort().map(k=>k+'='+d[k]).join('\u0001');for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return h+':'+s.length}
async function up(force){const a=acc();if(!a||C.busy||!C.ready)return;flush();const d=collect(),h=hash(d);if(!force&&h===C.hash)return;C.busy=true;
 try{const r=await fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({d})});const j=await r.json();
  if(r.ok){C.hash=h;C.last=j.t;localStorage.setItem(META+a.user.name.toLowerCase(),String(j.t));C.st='☁️ Mentve '+new Date(j.t).toLocaleTimeString('hu-HU')}else C.st='⚠️ '+(j.error||'Mentési hiba')}catch(e){C.st='⚠️ Szerver nem érhető el'}C.busy=false}
function beacon(){const a=acc();if(!a||!C.ready)return;flush();const d=collect(),h=hash(d);if(h===C.hash)return;const body=JSON.stringify({d});
 try{if(body.length<60000&&navigator.sendBeacon){navigator.sendBeacon('/api/save?tk='+encodeURIComponent(a.token),new Blob([body],{type:'application/json'}));C.hash=h;localStorage.setItem(META+a.user.name.toLowerCase(),String(Date.now()))}else fetch('/api/save',{method:'POST',keepalive:body.length<60000,headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body})}catch(e){}}
async function down(){const a=acc();if(!a)return;const nm=a.user.name.toLowerCase();C.st='☁️ Letöltés…';
 try{const r=await fetch('/api/save',{headers:{Authorization:'Bearer '+a.token}});const j=await r.json();if(!r.ok)throw 0;
  const loc=+localStorage.getItem(META+nm)||0;
  if(j.d&&j.t>loc){ // szerver újabb → visszaállítás
   const g=sessionStorage.getItem('_cloudR');if(g===nm+':'+j.t){C.ready=true;return}
   Object.keys(j.d).forEach(k=>{if(!SKIP.has(k))try{localStorage.setItem(k,j.d[k])}catch(e){}});localStorage.setItem(META+nm,String(j.t));
   sessionStorage.setItem('_cloudR',nm+':'+j.t);C.st='☁️ Mentés visszaállítva';try{window.say&&say('☁️ Felhőmentés betöltve – újratöltés…')}catch(e){}
   setTimeout(()=>location.reload(),400);return}
  C.ready=true;C.hash=j.d?hash(j.d):'';C.st=j.d?'☁️ Szinkronban':'☁️ Első feltöltés…';if(!j.d||j.t<loc)up(true)}
 catch(e){C.st='⚠️ Felhő nem elérhető (helyi mentés)';C.ready=true}}
// belépés figyelése (lobby.js-hez nem nyúlunk)
let who='';setInterval(()=>{const a=acc(),n=a?a.user.name:'';if(n!==who){who=n;C.ready=false;C.hash='';if(n)down();else C.st=window.ACC&&ACC.guest?'💾 Vendég: csak helyi mentés':'—'}},1000);
setInterval(()=>up(false),20000);
addEventListener('pagehide',beacon);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')beacon()});
C.up=up;C.down=down;C.collect=collect;
})();
