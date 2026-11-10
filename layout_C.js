// layout_C.js – lobby jobb oldal: zene-kártya (#lbPlayer), jackpot (#x14dJP), oldalsáv (#lbSide) ne fedjék egymást / a #k2dock-ot
(function(){
const st=document.createElement('style');st.id='layoutC';
st.textContent=`
body.lb2on #lbPlayer{top:var(--lC-pl,84px)!important;max-width:calc(100vw - 16px);box-sizing:border-box}
body.lb2on #x14dJP{top:var(--lC-jp,300px)!important}
@media (max-width:760px){
 body.lb2on #lbPlayer{right:8px!important;left:8px!important;width:auto!important;max-width:none;transform:none!important;padding:8px!important;overflow:hidden}
 body.lb2on #x14dJP{right:8px!important;width:calc(100vw - 16px)!important;font-size:10px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
}`;
document.head.appendChild(st);
const R=document.documentElement.style,$=i=>document.getElementById(i);
function fix(){
 if(!document.body.classList.contains('lb2on'))return;
 const pl=$('lbPlayer');if(!pl)return;
 let top=innerWidth<=760?parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lA-bottom'))||70:70;
 if(innerWidth<=760){ // telefonon teljes szélesség → a bal oldali kártyák (B) alá kerül
  for(const id of ['lb2bar','lbNews','bjCnt','x14eMotd']){const e=$(id);if(e&&e.offsetHeight&&getComputedStyle(e).display!=='none'){const b=e.getBoundingClientRect().bottom;if(b<innerHeight/2)top=Math.max(top,b)}}
 }
 const dk=$('k2dock');
 if(dk&&getComputedStyle(dk).display!=='none'){const r=dk.getBoundingClientRect();if(r.height&&r.left>innerWidth/2)top=Math.max(top,r.bottom)}
 // a kártyán transform (scale) is lehet → a tényleges eltérést visszakorrigáljuk
 const cur=parseFloat(R.getPropertyValue('--lC-pl'))||84;
 top=Math.round(top+8+cur-pl.getBoundingClientRect().top);
 if(R.getPropertyValue('--lC-pl')!==top+'px')R.setProperty('--lC-pl',top+'px');
 const jp=Math.round(pl.getBoundingClientRect().bottom+8)+'px';
 if(R.getPropertyValue('--lC-jp')!==jp)R.setProperty('--lC-jp',jp);
}
setInterval(fix,700);addEventListener('resize',fix);
})();
