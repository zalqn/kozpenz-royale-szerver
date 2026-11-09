// lobby2.js – LOBBY MEGÚJÍTÁS: egységes kategória-menü (proxy gombok), rendezett sávok, minden belefér.
// Az eredeti gombokat NEM mozgatja: lobbyban elrejti őket, a menü proxy-gombjai .click()-kel hívják őket.
(function(){
'use strict';
const $=id=>document.getElementById(id);
const CATS=[
 {k:'play',i:'🎮',n:'JÁTÉK'},
 {k:'com',i:'🤝',n:'KÖZÖSSÉG'},
 {k:'shop',i:'🎰',n:'BOLT & KASZINÓ'},
 {k:'cust',i:'🎨',n:'TESTRESZABÁS'},
 {k:'prog',i:'📈',n:'HALADÁS'},
 {k:'set',i:'⚙️',n:'BEÁLLÍTÁSOK'},
 {k:'etc',i:'✨',n:'EGYÉB'}
];
// kulcsszó → kategória (id + szöveg + title alapján, nagybetűsítve)
const RULES=[
 ['prog',/HALAD|RANG|KIHÍV|KÉPESSÉG|REJTETT|ACHIEV|TRÓFE|STATISZ|NAPLÓ/],
 ['set',/GRAFIK|KÉNYELEM|IRÁNYÍT|BEÁLL|HANG &|MEGJELEN/],
 ['cust',/STÍLUS|DIVAT|FÉNYEZ|SKIN|RUHA|KIT\b|KIT:/],
 ['shop',/KASZIN|PÓKER|KERÉK|PROMÓ|BOLT|TOJÁS|ÜST|LOTT|JACKPOT|CSERE/],
 ['com',/KÖZÖSS|TEAKERT|HÍREK|CSAPATFOT|BARÁT|ZENEG|SZÍNPAD|AJÁNDÉK|TÖRTÉNET|KLÁN|CHAT/],
 ['play',/SÖTÉT|EDZŐ|VILÁG|MÓD|ELLENFÉL|FEGYVER|MINIJÁT|OKTAT|VISSZAJÁT|SZERKESZT|JÁTÉK/]
];
// a menübe sorolt ismert önálló lebegő gombok
const SOLO=['x110k','x13cBtn','x13bEggBtn','x13dBtn'];
// ezeket soha ne sorolja be (elrendezés-elemek, HUD)
const KEEP=new Set(['lb2bar','lb2pan','gui','x14dJP','x70Vape','x60Ph','lbChat']);
const auto=new Set(); // ismeretlen, automatikusan besorolt elemek
const EXTRA=[]; // virtuális menüpontok (lobbyE.js): {ic,tx,c,fn,kw}

const css=document.createElement('style');css.id='lb2css';
css.textContent=`
body.lb2on #soDock,body.lb2on #x14hub,body.lb2on #x110k,body.lb2on #x13cBtn,body.lb2on #x13bEggBtn,body.lb2on #x13dBtn,body.lb2on #x70KitB,body.lb2on .lb2hid{display:none!important}
#lb2bar,#lb2pan{font-family:'Luckiest Guy',Impact,sans-serif;letter-spacing:.5px}
#lb2bar{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:9;display:none;gap:6px;padding:6px;border-radius:16px;
 background:linear-gradient(180deg,#0f172ae6,#0b1022e6);border:1px solid #ffffff24;box-shadow:0 10px 30px #0008,inset 0 1px 0 #ffffff1a;backdrop-filter:blur(6px);max-width:calc(100vw - 680px)}
body.lb2on #lb2bar{display:flex}
#lb2bar button{all:unset;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;padding:8px 13px;border-radius:11px;color:#e2e8f0;
 font-size:clamp(11px,.78vw,15px);text-shadow:0 2px 0 #0008;transition:background .15s,transform .15s,color .15s}
#lb2bar button:hover{background:#ffffff1f;transform:translateY(-2px)}
#lb2bar button.on{background:linear-gradient(180deg,#fde047,#facc15);color:#1a1300;text-shadow:none;box-shadow:0 4px 14px #facc1555}
#lb2bar button i{font-style:normal;font-size:.75em;opacity:.7}
#lb2q{display:flex;align-items:center}#lb2q input{all:unset;box-sizing:border-box;width:clamp(120px,11vw,210px);padding:7px 11px;border-radius:11px;background:#ffffff12;border:1px solid #ffffff22;color:#f1f5f9;font:600 clamp(11px,.8vw,15px) Rajdhani,Arial,sans-serif;letter-spacing:0}
#lb2q input:focus{border-color:#facc15;background:#ffffff1c}#lb2q input::placeholder{color:#94a3b8}
#lb2pan{position:fixed;top:124px;left:50%;transform:translateX(-50%) translateY(-8px);z-index:9;width:min(760px,calc(100vw - 680px));min-width:420px;
 max-height:calc(100vh - 260px);overflow:auto;padding:14px;border-radius:18px;background:linear-gradient(180deg,#111a33f2,#0b1022f2);
 border:1px solid #ffffff24;box-shadow:0 20px 50px #000a;opacity:0;pointer-events:none;transition:opacity .15s,transform .15s}
#lb2pan.on{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
#lb2pan h3{margin:0 0 10px;color:#fde047;font-size:18px;font-weight:normal;text-shadow:0 2px 0 #0008}
#lb2pan .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px}
#lb2pan .g button{all:unset;cursor:pointer;display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;color:#f1f5f9;font-size:14px;
 background:linear-gradient(180deg,#1e293b,#172033);border:1px solid #ffffff1a;transition:transform .12s,border-color .12s,background .12s;position:relative}
#lb2pan .g button:hover{transform:translateY(-2px);border-color:#facc15;background:linear-gradient(180deg,#26344d,#1b2740)}
#lb2pan .g button b{font-size:20px;font-weight:normal;width:26px;text-align:center;flex:none}
#lb2pan .g button span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#lb2pan .g button.dot::after{content:"";position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#f43f5e;box-shadow:0 0 6px #f43f5e}
/* felső sáv: mindig férjen ki */
body.lb2on #lbTop{gap:2px;padding:0 12px}
body.lb2on #lbTop .tab{font-size:clamp(10px,.82vw,16px)!important;padding:6px clamp(3px,.4vw,9px)!important;letter-spacing:.3px}
body.lb2on #lbLogo{font-size:clamp(14px,1.3vw,26px)!important;margin-right:6px;white-space:nowrap}
body.lb2on #lbRight{flex-shrink:0;transform-origin:right center}
body.lb2on #lbTop .dot::before{width:6px;height:6px;margin-right:4px}
/* jackpot: a menüsor alá jobbra, kicsiben */
body.lb2on #x14dJP{top:300px!important;bottom:auto!important;left:auto!important;right:24px!important;transform:none!important;width:300px;box-sizing:border-box;text-align:center}
/* bal oszlop: hír, bujkáló-számláló, nap üzenete */
body.lb2on #x14eMotd{left:24px!important;top:276px!important;transform:none!important;width:280px!important;max-width:280px!important;box-sizing:border-box;max-height:150px;overflow:auto}
/* jobb oszlop: zenelejátszó fent, jelvények alul */
body.lb2on #lbSide{right:24px!important}
@media (max-height:900px){
 body.lb2on #lbPlay{zoom:.8}
 body.lb2on #lbNews{zoom:.85}
 body.lb2on #bjCnt{top:210px!important}
 body.lb2on #x14eMotd{top:250px!important;max-height:120px}
 body.lb2on #lbPlayer{zoom:.85}
 body.lb2on #lbSide{zoom:.8}
 body.lb2on #x14dJP{top:262px!important}
}
@media (max-height:800px){ body.lb2on #x14eMotd{display:none!important} }
@media (max-width:1500px){
 #lb2bar{max-width:calc(100vw - 40px)}
 #lb2pan{width:min(700px,calc(100vw - 40px))}
 #lb2bar button i{display:none}
}
`;
document.head.appendChild(css);

const bar=document.createElement('div');bar.id='lb2bar';
const pan=document.createElement('div');pan.id='lb2pan';
document.body.appendChild(bar);document.body.appendChild(pan);
let cur=null,items=[];

function label(el){
 const t=(el.textContent||'').replace(/\s+/g,' ').trim();
 const ti=(el.getAttribute('title')||'').replace(/\s*\((F\d+|Home|End|Insert)\)/g,'').trim();
 const m=t.match(/^(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u);
 let ic=m?m[1]:'•',tx=m?t.slice(m[0].length):t;
 if(!/\p{L}{2}/u.test(tx))tx=ti||tx||el.id;
 if(tx===tx.toUpperCase()&&tx.length>2)tx=tx.charAt(0)+tx.slice(1).toLowerCase();
 return {ic,tx};
}
function catOf(el,tx){
 const s=((el.id||'')+' '+tx+' '+(el.textContent||'')+' '+(el.getAttribute('title')||'')).toUpperCase();
 for(const [k,re] of RULES)if(re.test(s))return k;
 return 'etc';
}
function sources(){
 const out=[];
 const add=el=>{if(el&&!out.includes(el))out.push(el)};
 const d=$('soDock');if(d)[...d.children].forEach(add);
 const h=$('x14hub');if(h)[...h.children].forEach(add);
 SOLO.forEach(id=>add($(id)));
 auto.forEach(add);
 return out.filter(el=>el.isConnected);
}
// ismeretlen lebegő gombok besorolása (csak lobbyban, csak body-szintű, kicsi, kattintható)
function scanUnknown(){
 for(const el of document.body.children){
  if(auto.has(el)||KEEP.has(el.id)||el.id&&SOLO.includes(el.id)||el.id==='soDock'||el.id==='x14hub'||el.id==='lb')continue;
  if(!(el.tagName==='BUTTON'||/(Btn|Hub)$/.test(el.id||'')))continue;
  const cs=getComputedStyle(el);if(cs.position!=='fixed'||cs.display==='none'||cs.visibility==='hidden')continue;
  const r=el.getBoundingClientRect();if(r.width<10||r.width>360||r.height>130)continue;
  auto.add(el);el.classList.add('lb2hid');
 }
}
function build(){
 items=sources().map(el=>{const l=label(el);return {el,...l,c:catOf(el,l.tx),dot:!!el.querySelector('i[id$="N"]:not([style*="none"]),.dot,.cnt:not([style*="none"])')}});
 EXTRA.forEach(x=>items.push({el:{click:x.fn,getAttribute:()=>x.tx,textContent:x.kw||''},ic:x.ic,tx:x.tx,c:x.c,dot:false}));
 const cnt={};items.forEach(it=>cnt[it.c]=(cnt[it.c]||0)+1);
 const sig=CATS.map(c=>c.k+(cnt[c.k]||0)).join();
 if(bar.dataset.sig!==sig){
  bar.dataset.sig=sig;bar.innerHTML='';
  CATS.forEach(c=>{if(!cnt[c.k])return;const b=document.createElement('button');b.dataset.k=c.k;b.innerHTML=c.i+' '+c.n+' <i>'+cnt[c.k]+'</i>';
   b.onclick=e=>{e.stopPropagation();open(cur===c.k?null:c.k)};bar.appendChild(b)});
  const sw=document.createElement('div');sw.id='lb2q';sw.innerHTML='<input id="lb2qi" placeholder="🔎 Írd be, mit keresel…" autocomplete="off" spellcheck="false">';bar.appendChild(sw);
  const qi=sw.querySelector('input');qi.value=q;qi.onclick=e=>e.stopPropagation();
  qi.oninput=()=>{q=qi.value;if(q.trim())open('_q');else open(null)};
  qi.onkeydown=e=>{e.stopPropagation();if(e.key==='Enter'){const b=pan.querySelector('.g button');if(b)b.click();qi.value='';q='';qi.blur()}if(e.key==='Escape'){qi.value='';q='';open(null);qi.blur()}if(e.key==='ArrowDown'){const b=pan.querySelector('.g button');if(b){e.preventDefault();b.focus()}}};
  qi.onkeyup=qi.onkeypress=e=>e.stopPropagation();
 }
 if(cur)fill();
}
const norm=s=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
let q='';
function fill(){
 const c=cur==='_q'?{i:'🔎',n:'KERESÉS: „'+q+'”'}:CATS.find(x=>x.k===cur);
 pan.innerHTML='<h3></h3><div class="g"></div>';pan.querySelector('h3').textContent=c.i+' '+c.n;
 const g=pan.querySelector('.g');
 const nq=norm(q).trim(),list=cur==='_q'?items.filter(it=>nq&&norm(it.tx+' '+(it.el.textContent||'')+' '+(it.el.getAttribute('title')||'')+' '+(CATS.find(x=>x.k===it.c)||{}).n).includes(nq)):items.filter(it=>it.c===cur);
 if(cur==='_q'&&nq)document.querySelectorAll('#lbTop .tab').forEach(t=>{const tx=(t.textContent||'').trim();if(tx&&norm(tx+' '+(t.dataset.t||'')).includes(nq)){const l=label(t);list.unshift({el:t,ic:l.ic==='•'?'📑':l.ic,tx:l.tx+' (fül)',c:'etc',dot:false})}});
 if(cur==='_q'&&!list.length)g.innerHTML='<div style="color:#94a3b8;font:600 14px Rajdhani,sans-serif;padding:6px">Nincs találat. Próbáld másképp (pl. „kaszinó”, „kutya”, „rang”).</div>';
 list.forEach(it=>{const b=document.createElement('button');b.className=it.dot?'dot':'';
  b.innerHTML='<b></b><span></span>';b.querySelector('b').textContent=it.ic;b.querySelector('span').textContent=it.tx;
  b.title=it.el.getAttribute('title')||it.tx;
  b.onclick=e=>{e.stopPropagation();open(null);try{it.el.click()}catch(er){console.error(er)}};g.appendChild(b)});
}
function open(k){
 cur=k;[...bar.children].forEach(b=>b.classList.toggle('on',b.dataset.k===k));
 if(k){fill();pan.classList.add('on')}else pan.classList.remove('on');
}
document.addEventListener('click',e=>{if(cur&&!pan.contains(e.target)&&!bar.contains(e.target))open(null)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&cur)open(null)},true);

function inLobby(){
 const lb=$('lb');if(!lb||!lb.classList.contains('on'))return false;
 const vs=$('vs2');if(vs&&vs.classList.contains('on'))return false;
 return true;
}
let was=null,tk=0;
setInterval(()=>{
 const on=inLobby();
 if(on!==was){document.body.classList.toggle('lb2on',on);if(!on)open(null);was=on}
 if(on){if(tk++%4===0)scanUnknown();build()}
},500);
window._lb2={build,open,items:()=>items,auto,EXTRA,CATS,add:x=>{if(!EXTRA.some(y=>y.tx===x.tx))EXTRA.push(x)}};
})();
