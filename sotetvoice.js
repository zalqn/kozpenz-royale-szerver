// sotetvoice.js – 🕶️ Sötét Program: hangalámondás (Web Speech hu-HU) + feliratsáv + első belépéses bevezető + fejléc-javítás 1366 px-re
(function(){
const LS='k3spvo',IN='k3spintro';
let C;try{C=JSON.parse(localStorage.getItem(LS)||'null')}catch(e){}C=C||{v:1,s:1};
const sv=()=>{try{localStorage.setItem(LS,JSON.stringify(C))}catch(e){}};
const css=document.createElement('style');css.textContent=`
#dp header{flex-wrap:nowrap!important;gap:8px!important;padding:8px 12px!important}
#dp header h1{white-space:nowrap;flex:none}
#dp header .st{flex-wrap:nowrap!important;gap:5px!important;overflow:hidden;min-width:0;flex:1 1 auto}
#dp header .st span{white-space:nowrap;flex:none}
#dp header .bt{white-space:nowrap;flex:none}
@media (max-width:1600px){#dp header h1{font-size:17px!important}#dp header .st{font-size:11.5px!important}#dp header .st span{padding:3px 6px!important}#dp header .st small{display:none}#dp header .bt{padding:6px 9px!important;font-size:12px}}
#spvSub{position:fixed;left:50%;bottom:64px;transform:translateX(-50%);max-width:min(860px,92vw);z-index:2147483600;background:rgba(8,5,20,.88);border:1px solid rgba(167,139,250,.5);border-radius:12px;padding:10px 16px;color:#fff;font:600 16px/1.4 system-ui,sans-serif;text-align:center;box-shadow:0 8px 30px #000a;opacity:0;transition:opacity .3s;pointer-events:none}
#spvSub.on{opacity:1}#spvSub b{color:#c4b5fd;margin-right:6px}
#spvTg{flex:none}
#spvIn{position:fixed;inset:0;z-index:2147483601;background:rgba(3,2,10,.78);display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif}
#spvIn .k{background:linear-gradient(160deg,#1e1b4b,#0f0a23);border:1px solid #7c3aed;border-radius:16px;padding:22px 26px;max-width:520px;color:#fff;box-shadow:0 12px 40px #000}
#spvIn h2{margin:0 0 8px;background:linear-gradient(90deg,#a78bfa,#f472b6);-webkit-background-clip:text;color:transparent}
#spvIn p{font-size:15px;line-height:1.5;min-height:66px}#spvIn .r{display:flex;gap:8px;justify-content:flex-end;align-items:center}
#spvIn button{background:#7c3aed;color:#fff;border:0;border-radius:9px;padding:8px 14px;font-weight:700;cursor:pointer}#spvIn button.s{background:#334155}
#spvIn .d{margin-right:auto;opacity:.7;font-size:13px}`;
document.head.appendChild(css);
const sub=document.createElement('div');sub.id='spvSub';document.body.appendChild(sub);
// hang: magyar hang kell, különben csak felirat
let HU=null;const pick=()=>{try{const v=speechSynthesis.getVoices();HU=v.find(x=>/^hu/i.test(x.lang))||null}catch(e){HU=null}};
if(window.speechSynthesis){pick();speechSynthesis.onvoiceschanged=pick}
const PIT={ferko:.8,csaba:1,pista:.7,tibi:1.2,beno:1.3,rozi:1.5,kornel:.9,feco:.6,odon:1.1,zsaru:.75};
const clean=t=>String(t).replace(/<[^>]+>/g,'').replace(/[\u{1F000}-\u{1FFFF}☀-➿️Ft]/gu,'').replace(/\s+/g,' ').trim();
let q=[],busy=false,tm=0;
function next(){clearTimeout(tm);const it=q.shift();if(!it){busy=false;sub.classList.remove('on');return}busy=true;
 if(C.s){sub.innerHTML=(it.n?'<b>'+it.n+':</b>':'')+clean(it.t);sub.classList.add('on')}
 const dur=Math.max(2500,clean(it.t).length*65);
 if(C.v&&HU&&window.speechSynthesis){try{const u=new SpeechSynthesisUtterance(clean(it.t));u.voice=HU;u.lang='hu-HU';u.rate=1.02;u.pitch=PIT[it.w]||1;let done=0;const f=()=>{if(done)return;done=1;tm=setTimeout(next,250)};u.onend=f;u.onerror=f;speechSynthesis.speak(u);tm=setTimeout(f,dur+6000);return}catch(e){}}
 tm=setTimeout(next,dur)}
function say(t,w,n){if(!C.v&&!C.s)return;q.push({t,w,n});if(!busy)next()}
function stop(){q=[];clearTimeout(tm);try{speechSynthesis.cancel()}catch(e){}busy=false;sub.classList.remove('on')}
const api=()=>{try{return window._dp&&window._dp()}catch(e){return null}};
function chap(i){const d=api();if(!d)return;const s=d.STORY[i];if(!s){if(window._spx)return;say('Csaba és te eltűntök a szigeten. A kerületek még sokáig suttogják a nevedet. Vége – de a sötét program sosem alszik.','csaba','Narrátor');return}
 const c=d.CH[s.w]||{};say(s.t.replace(/^\d+\.\s*/,'')+'. fejezet.',null,'Narrátor');say(s.x,s.w,c.n||'')}
// fejléc-gomb + felolvasás gomb a fejezetkártyán
function deco(){const r=document.getElementById('dp');if(!r||r.style.display!=='flex')return;const h=r.querySelector('header');
 if(h&&!h.querySelector('#spvTg')){const b=document.createElement('button');b.className='bt';b.id='spvTg';const lb=()=>b.textContent=(C.v?'🔊':'🔇')+(C.s?' 💬':'');lb();
  b.title='Narrátor: kattintás = hang ki/be, Shift+kattintás = felirat ki/be'+(HU?'':' (nincs magyar hang a böngészőben – csak felirat)');
  b.onclick=e=>{if(e.shiftKey)C.s=C.s?0:1;else{C.v=C.v?0:1;if(!C.v)try{speechSynthesis.cancel()}catch(x){}}sv();lb()};const x=h.querySelector('#dpsl');h.insertBefore(b,x||null)}
 const sq=r.querySelector('.c.sq');if(sq&&!sq.querySelector('[data-spv]')){const b=document.createElement('button');b.className='bt';b.dataset.spv=1;b.textContent='🎙️ Felolvasás';b.style.marginLeft='6px';b.onclick=()=>{stop();const d=api();d&&chap(d.D.sq)};const t=sq.querySelector('[data-sq]');t?t.after(b):sq.appendChild(b)}}
const STEPS=[['Csaba','Üdv a Sötét Programban, főnök! Itt a közpénzből lesz a birodalom – persze csak papíron. Én vagyok Csaba, a jobbkezed.'],
['Csaba','A Laborban színekkel, hőfokkal és ritmussal főzöl kitalált, szatirikus termékeket. Minél pontosabb vagy, annál jobb a minőség.'],
['Csaba','A Kerületekben eladod az árut. Figyeld a 🔥 hőt: ha túl magas, jön a razzia. Az alvás új napot hoz és hűti a kedélyeket.'],
['Csaba','A Küldetések fülön követheted a történetet. A 🔊 gombbal kapcsolhatod a narrátort, Shifttel a feliratot. Hajrá!']];
function intro(){if(document.getElementById('spvIn'))return;let i=0;const o=document.createElement('div');o.id='spvIn';document.body.appendChild(o);
 const end=()=>{stop();o.remove();try{localStorage.setItem(IN,'1')}catch(e){}const d=api();d&&chap(d.D.sq)};
 const sh=()=>{const s=STEPS[i];o.innerHTML='<div class="k"><h2>🕶️ Bevezető</h2><p><b>'+s[0]+':</b> '+s[1]+'</p><div class="r"><span class="d">'+(i+1)+' / '+STEPS.length+'</span><button class="s" data-k>Kihagyás</button><button data-n>'+(i<STEPS.length-1?'Tovább ▶':'Kezdjük!')+'</button></div></div>';
  o.querySelector('[data-k]').onclick=end;o.querySelector('[data-n]').onclick=()=>{i++;i<STEPS.length?sh():end()};stop();if(C.v&&HU)say(s[1],'csaba','')};sh()}
let last=null,wasOpen=false;
setInterval(()=>{const r=document.getElementById('dp'),op=!!(r&&r.style.display==='flex');
 if(op){deco();const d=api();if(d){if(!wasOpen){let seen=null;try{seen=localStorage.getItem(IN)}catch(e){}if(!seen)intro()}
  if(last!==null&&d.D.sq>last)chap(d.D.sq);last=d.D.sq}}
 else if(wasOpen)stop();wasOpen=op},400);
window._spv={say,stop,chap,intro,cfg:C,hu:()=>!!HU};
})();
