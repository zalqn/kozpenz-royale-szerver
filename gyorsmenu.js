// gyorsmenu.js – (A, 11-09) ⌨️ Ctrl+K GYORSMENÜ: bármi megnyitható gépeléssel. Forrás: a lobby2 menüpontjai (_lb2.items()) + saját parancsok.
// ↑/↓ választás, Enter megnyit, Esc bezár. Debug: _gym
(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const CMD=[ // {ic,tx,kw,fn,ok?}
 {ic:'🤝',tx:'Közösség+',kw:'meghívó verseny esemény ajándék',fn:()=>window._k2&&_k2.open('ev')},
 {ic:'✉️',tx:'Levelek',kw:'posta üzenet mail',fn:()=>window._k2&&_k2.open('mail')},
 {ic:'🏅',tx:'Kreatív verseny',kw:'fotó pálya szavazás',fn:()=>window._k2&&_k2.open('ct')},
 {ic:'🎁',tx:'Barát-meghívó',kw:'invite kód',fn:()=>window._k2&&_k2.open('inv')},
 {ic:'👤',tx:'Fiók e-mail beállítása',kw:'jelszó email',fn:()=>window._k2&&_k2.open('acc')},
 {ic:'☁️',tx:'Felhőmentés most',kw:'mentés save cloud',fn:()=>{window._cloud&&_cloud.up&&_cloud.up(true);window.say&&say('☁️ Mentés…')}},
 {ic:'🖥️',tx:'Teljes képernyő',kw:'fullscreen',fn:()=>{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen().catch(()=>{})}},
 {ic:'🔄',tx:'Oldal újratöltése',kw:'reload frissítés',fn:()=>location.reload()},
 {ic:'🛡️',tx:'Admin panel',kw:'admin',fn:()=>window._adm&&_adm.open(),ok:()=>window._adm&&_adm.admin},
 {ic:'🧪',tx:'Developer panel',kw:'dev fejlesztő',fn:()=>window._adm&&_adm.dev(),ok:()=>window._adm&&_adm.admin}
];
const css=document.createElement('style');css.textContent=`
#gym{position:fixed;inset:0;z-index:99990;display:none;align-items:flex-start;justify-content:center;padding-top:12vh;background:#0007}
#gym.on{display:flex}#gym .w{width:min(560px,92vw);border-radius:16px;background:#0f172a;border:1px solid #ffd23f55;box-shadow:0 20px 60px #000a;overflow:hidden;font:15px Rajdhani,Arial,sans-serif;color:#e2e8f0}
#gym input{all:unset;box-sizing:border-box;width:100%;padding:14px 16px;font:600 18px Rajdhani,Arial,sans-serif;border-bottom:1px solid #ffffff1a}
#gym ul{list-style:none;margin:0;padding:6px;max-height:52vh;overflow:auto}#gym li{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;cursor:pointer}
#gym li.on{background:#ffd23f;color:#111}#gym li small{margin-left:auto;opacity:.6}#gym .h{padding:6px 14px;font-size:12px;color:#94a3b8;border-top:1px solid #ffffff12}`;
document.head.appendChild(css);
const G=document.createElement('div');G.id='gym';G.innerHTML='<div class="w"><input id="gymq" placeholder="Mit nyissak meg? (pl. bolt, kaszinó, levelek…)" autocomplete="off"><ul id="gyml"></ul><div class="h">↑↓ választ · Enter megnyit · Esc bezár · Ctrl+K</div></div>';
document.body.appendChild(G);
let list=[],sel=0;
function all(){const out=[];
 try{if(window._lb2){if(_lb2.build)try{_lb2.build()}catch(e){}(_lb2.items()||[]).forEach(it=>{if(it&&it.el&&it.tx)out.push({ic:it.ic||'•',tx:it.tx,kw:(it.el.textContent||'')+' '+(it.el.getAttribute&&it.el.getAttribute('title')||''),cat:'menü',fn:()=>{try{it.el.click()}catch(e){}}})})}}catch(e){}
 CMD.forEach(c=>{if(!c.ok||c.ok())out.push(Object.assign({cat:'parancs'},c))});
 const seen=new Set();return out.filter(x=>{const k=norm(x.tx);if(seen.has(k))return false;seen.add(k);return true})}
function score(x,q){if(!q)return 1;const t=norm(x.tx),k=norm(x.kw);if(t.startsWith(q))return 4;if(t.includes(q))return 3;if(k.includes(q))return 2;
 let i=0;for(const ch of t)if(ch===q[i])i++;return i===q.length?1:0}
function draw(){const q=norm($('gymq').value.trim());const src=G._all||[];list=src.map(x=>[score(x,q),x]).filter(a=>a[0]>0).sort((a,b)=>b[0]-a[0]).slice(0,40).map(a=>a[1]);sel=Math.min(sel,Math.max(0,list.length-1));
 $('gyml').innerHTML=list.length?list.map((x,i)=>'<li data-i="'+i+'"'+(i===sel?' class="on"':'')+'><span>'+esc(x.ic)+'</span>'+esc(x.tx)+'<small>'+x.cat+'</small></li>').join(''):'<li><i>Nincs találat</i></li>';
 const on=$('gyml').querySelector('.on');on&&on.scrollIntoView({block:'nearest'})}
function open(){G._all=all();G.classList.add('on');$('gymq').value='';sel=0;draw();try{document.pointerLockElement&&document.exitPointerLock()}catch(e){}setTimeout(()=>$('gymq').focus(),0)}
function close(){G.classList.remove('on')}
function run(i){const x=list[i];if(!x)return;close();setTimeout(()=>{try{x.fn()}catch(e){console.warn('gyorsmenü',e)}},30)}
$('gymq').addEventListener('input',()=>{sel=0;draw()});
G.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){close();e.preventDefault()}else if(e.key==='ArrowDown'){sel=Math.min(list.length-1,sel+1);draw();e.preventDefault()}else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);draw();e.preventDefault()}else if(e.key==='Enter'){run(sel);e.preventDefault()}});
['keyup','keypress'].forEach(ev=>G.addEventListener(ev,e=>e.stopPropagation()));
G.onclick=e=>{const li=e.target.closest('li[data-i]');if(li)run(+li.dataset.i);else if(e.target===G)close()};
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&!e.shiftKey&&!e.altKey&&(e.key==='k'||e.key==='K')){e.preventDefault();e.stopPropagation();G.classList.contains('on')?close():open()}},true);
window._gym={open,close,all,CMD};
})();
