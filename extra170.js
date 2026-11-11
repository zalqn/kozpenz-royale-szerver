// ===== EXTRA170: 🐕 kutya-képességek + kutyaélet (energia), 🔊 ölés-hangpaletta =====
(function(){
const KEY='k3x170';let D;try{D=Object.assign({en:100,snd:0,t:0},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){D={en:100,snd:0,t:0}}
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}};
const toast=m=>{try{say(m)}catch(e){}};
// energia: óránként +5 magától visszatölt (max 100)
const regen=()=>{const now=Date.now(),h=(now-(D.t||now))/36e5;D.en=Math.min(100,D.en+Math.floor(h*5));if(h>=.2||!D.t)D.t=now;sv()};regen();
const breed=()=>{try{return _PETS.BY[_PETS.P.breed]}catch(e){return null}};
const active=()=>breed()&&D.en>=20&&typeof G!=='undefined'&&G&&!G.over;
// képességek fajta-méret szerint: nagy = őrzés (−8% sebzés), kicsi = szimat gyakrabban, mind: hozás (öléskor 20% → +300 Ft)
if(typeof hurt==='function'){const oH=hurt;window.hurt=hurt=function(d,storm){if(!storm&&active()&&breed().sz>=1.1)d*=.92;return oH.call(this,d,storm)}}
// hangpaletta
const SND=[['Alap',null],['Csengő',[880,1320],'sine'],['Retró',[220,440,660],'square'],['Basszus',[90,60],'sawtooth'],['Pénztárgép',[1500,2200,1800],'triangle']];
let AC;const play=i=>{const s=SND[i];if(!s||!s[1])return;try{AC=AC||new AudioContext();s[1].forEach((f,j)=>{const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+j*.07;o.type=s[2];o.frequency.value=f;g.gain.setValueAtTime(.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.16)})}catch(e){}};
if(typeof kill==='function'){const oK=kill;window.kill=kill=function(e){const r=oK.apply(this,arguments);try{play(D.snd);if(active()&&Math.random()<.2){S.c+=300;toast('🐕 '+breed().n+' hozott 300 Ft-ot!')}}catch(x){}return r}}
// szimat: meccsben 12 mp-enként (kicsi kutya 8 mp) jelzi a legközelebbi ellenfelet
let sn=0;setInterval(()=>{if(!active()||G.phase!=='play'||!G.en||!G.en.length)return;sn+=1;if(sn*4<(breed().sz<.9?8:12))return;sn=0;let b=null,bd=1e9;G.en.forEach(e=>{const d=Math.hypot(e.x-G.x,e.z-G.z);if(d<bd){bd=d;b=e}});if(b&&bd<80){const a=Math.atan2(b.z-G.z,b.x-G.x)*180/Math.PI;toast('👃 Szimat: ellenfél '+Math.round(bd)+' m-re ('+['K','DK','D','DNy','Ny','ÉNy','É','ÉK'][((Math.round(a/45)%8)+8)%8]+')')}},4000);
// meccs vége: −15 energia
if(typeof window.end==='function'){const oE=window.end;window.end=function(){const was=typeof G!=='undefined'&&G&&!G.over;const r=oE.apply(this,arguments);if(was&&breed()){D.en=Math.max(0,D.en-15);sv();if(D.en<20)toast('😴 A kutyád kifáradt – etesd meg (Kutyaélet menü)!')}return r}}
// panel
function open(){regen();const b=breed();const w=document.createElement('div');w.id='x170';w.style.cssText='position:fixed;inset:0;z-index:99990;background:#000a;display:flex;align-items:center;justify-content:center;font:16px sans-serif;color:#fff';
w.innerHTML='<div style="background:#1e1b4b;border:2px solid #facc15;border-radius:14px;padding:20px;width:min(420px,92vw)"><h2 style="margin:0 0 10px">🐕 Kutyaélet & hangok</h2>'+(b?'<div>'+b.n+' – energia: <b>'+D.en+'</b>/100</div><div style="background:#333;height:10px;border-radius:5px;margin:6px 0"><div style="height:10px;border-radius:5px;background:#22c55e;width:'+D.en+'%"></div></div><div style="font-size:13px;opacity:.8">Képességek (20+ energiánál): 🦴 hozás öléskor, 👃 szimat'+(b.sz>=1.1?', 🛡️ őrzés −8% sebzés':'')+(b.sz<.9?' (gyorsabb szimat)':'')+'. Meccsenként −15, óránként +5.</div><button id="x170f" style="margin:8px 0;padding:8px 14px">🍖 Etetés: +50 energia (500 Ft)</button>':'<div>Nincs kutyád.</div>')+'<h3 style="margin:12px 0 6px">🔊 Ölés-hang</h3><div id="x170s"></div><button id="x170x" style="margin-top:12px;padding:8px 14px">Bezár</button></div>';
document.body.appendChild(w);const box=w.querySelector('#x170s');SND.forEach((s,i)=>{const bt=document.createElement('button');bt.textContent=(D.snd===i?'✅ ':'')+s[0];bt.style.cssText='margin:3px;padding:6px 10px';bt.onclick=()=>{D.snd=i;sv();play(i);w.remove();open()};box.appendChild(bt)});
const f=w.querySelector('#x170f');if(f)f.onclick=()=>{if(D.en>=100)return toast('Már tele van!');if(S.c<500)return toast('Nincs elég Ft!');S.c-=500;try{save()}catch(e){}D.en=Math.min(100,D.en+50);sv();w.remove();open()};
w.querySelector('#x170x').onclick=()=>w.remove()}
window._x170={D,open,play,active};
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}_lb2.add({ic:'🐕',hu:'Kutyaélet & hangok',tx:'Kutyaélet & hangok',c:'cust',fn:open,kw:'kutya energia etetes kepesseg hang olesHang paletta'})})();
})();
