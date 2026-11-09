// ===== EXTRA40: hangjelző (merről lőnek) · bemondó-mód (sorozatkiesések) · a nap akciója (skin/tánc fél áron) =====
(function(){
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){try{pre&&pre(arguments)}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,r)}catch(e){console.error('x40 '+n+': '+e)}return r}};
const $$=i=>document.getElementById(i);
const css=document.createElement('style');css.textContent=`
#x40Ind{position:fixed;left:50%;top:50%;width:0;height:0;z-index:4;pointer-events:none}
.x40a{position:absolute;left:-22px;top:-22px;width:44px;height:44px;transform-origin:22px 22px;transition:opacity .3s}
.x40a i{position:absolute;left:10px;top:-120px;width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:26px solid #ef4444;filter:drop-shadow(0 0 6px #ef4444)}
.x40a.s i{border-bottom-color:#fbbf24;filter:drop-shadow(0 0 6px #fbbf24)}
#x40Ann{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%) scale(.5);z-index:6;font:56px 'Luckiest Guy',Impact;color:#fde68a;text-shadow:0 4px 0 #b45309,0 0 30px #f59e0b;opacity:0;pointer-events:none;transition:all .25s cubic-bezier(.3,1.7,.5,1);white-space:nowrap}
#x40Ann.on{opacity:1;transform:translate(-50%,-50%) scale(1)}`;document.head.appendChild(css);
const ind=document.createElement('div');ind.id='x40Ind';document.body.appendChild(ind);
const ann=document.createElement('div');ann.id='x40Ann';document.body.appendChild(ann);let annT=0;
const normal=()=>typeof G!=='undefined'&&G&&typeof run!=='undefined'&&run&&!G.over;

// ---------- hangjelző ----------
let AR=[];
function arrow(sx,sz,kind){if(AR.length>6){const o=AR.shift();o.el.remove()}const el=document.createElement('div');el.className='x40a'+(kind==='s'?' s':'');el.innerHTML='<i></i>';ind.appendChild(el);AR.push({el,x:sx,z:sz,t:kind==='s'?1.2:1.8})}
WP('launch',null,()=>{AR.forEach(a=>a.el.remove());AR=[];KS={n:0,t:0}});
WP('update',null,a=>{if(!normal())return;const g=G,dt=Math.min(.1,a[0]||.016);
 (g.eb||[]).forEach(b=>{if(b._x40||b.vx===undefined)return;b._x40=1;if(Math.hypot(b.x-g.x,b.z-g.z)<55&&Math.hypot(b.x-g.x,b.z-g.z)>2.5){const near=AR.find(r=>Math.hypot(r.x-b.x,r.z-b.z)<4);if(near)near.t=1.8;else arrow(b.x,b.z,'b')}});
 AR=AR.filter(r=>{r.t-=dt;if(r.t<=0){r.el.remove();return false}const ang=Math.atan2(r.z-g.z,r.x-g.x)-g.ang;r.el.style.transform='rotate('+ang+'rad)';r.el.style.opacity=Math.min(1,r.t*1.5);return true})});
// sebződéskor is jelezzük a legközelebbi ellenfél irányát
WP('hurt',null,a=>{if(!normal()||a[1])return;const g=G;let best=null,bd=40;(g.en||[]).forEach(e=>{if(e.dead)return;const d=Math.hypot(e.x-g.x,e.z-g.z);if(d<bd){bd=d;best=e}});if(best&&!AR.some(r=>Math.hypot(r.x-best.x,r.z-best.z)<4))arrow(best.x,best.z,'s')});

// ---------- bemondó ----------
let KS={n:0,t:0};const NAMES=['','','DUPLA!','TRIPLA!','NÉGYES!','ŐRJÖNGÉS!','MEGÁLLÍTHATATLAN!','LEGENDÁS!'];
function announce(t){ann.textContent=t;ann.classList.add('on');clearTimeout(annT);annT=setTimeout(()=>ann.classList.remove('on'),1300);try{if(typeof spk==='function')spk(t.replace(/!/g,''))}catch(e){}try{tn(880,'triangle',.15,.1);setTimeout(()=>tn(1320,'triangle',.2,.1),120)}catch(e){}}
// ---------- a nap akciója (skinek / táncok 50%) ----------
function dealOf(){const d=new Date(),k=d.getFullYear()*400+d.getMonth()*31+d.getDate();const items=[['skin','arany'],['skin','lang'],['skin','neon'],['skin','rozsa'],['skin','dzsungel'],['dance','robot'],['dance','penzeso'],['dance','forgo']];return items[k%items.length]}
const PR={arany:2500,lang:2000,neon:2000,rozsa:1500,dzsungel:1500,robot:800,penzeso:1200,forgo:1000};
const NM={arany:'Arany skin',lang:'Láng skin',neon:'Neon skin',rozsa:'Rózsaszín skin',dzsungel:'Dzsungel skin',robot:'Robottánc',penzeso:'Pénzszórás tánc',forgo:'Pörgés tánc'};
const osk=window.x20skin;
if(typeof osk==='function'){window.x20skin=function(){osk();const[k,id]=dealOf();const SK=window._x20SK||{own:{},dOwn:{}};const own=k==='skin'?SK.own[id]:SK.dOwn[id];
  const mb=$$('x20MB');if(!mb)return;const h=mb.querySelector('h2');const box=document.createElement('div');box.style.cssText='margin:6px 0 10px;padding:10px;border-radius:12px;background:linear-gradient(90deg,#7c2d12,#b45309);display:flex;justify-content:space-between;align-items:center';
  box.innerHTML='<span>🏷️ <b>A NAP AKCIÓJA:</b> '+NM[id]+' <s style="opacity:.6">'+PR[id]+'</s> → <b style="color:#fde68a">'+Math.round(PR[id]/2)+' 🪙</b></span>'+(own?'<b style="color:#86efac">✔ MEGVAN</b>':'<button class="y" onclick="x40deal()">MEGVESZEM</button>');if(h)h.after(box)};
 window.x40deal=()=>{const[k,id]=dealOf(),p=Math.round(PR[id]/2);const SK=window._x20SK;if(!SK)return;if(typeof BR==='undefined'||BR.zs<p){alert('Nincs elég zseton!');return}
  if(k==='skin'){SK.own[id]=1;SK.cur=id}else{SK.dOwn[id]=1;SK.dance=id}window._x20skSave();BR.zs-=p;try{st.s('k3br',BR)}catch(e){}window.x20skin()}}
console.log('extra40 betöltve');
})();
