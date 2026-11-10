// layout_A.js – lobby felső sáv: a „Közös cél” (#k2ev) ne takarja a felső tab-sort (#lbTop);
// beköltözik a kategória-sáv (#lb2bar) aljára, a lenyíló panel (#lb2pan) mindig a sáv alá kerül.
(function(){
if(window._lA)return;window._lA=1;
const st=document.createElement('style');st.id='layoutA';
st.textContent=`
#lb2bar>#k2ev{position:static!important;transform:none!important;flex:0 0 100%;width:auto!important;box-sizing:border-box;margin:2px 0 0;z-index:auto}
@media (max-width:760px){
 body.lb2on #lbTop{z-index:12!important;flex-wrap:wrap!important;height:auto!important;row-gap:2px;padding:4px 8px!important;justify-content:center}
 body.lb2on #lbTop .tab{padding:4px 5px!important;font-size:11px!important}
 body.lb2on #lbRight{zoom:.7}
 #lb2bar>#k2dock{position:static!important;flex:0 0 auto}
 #lb2bar{max-width:calc(100vw - 16px)!important;width:calc(100vw - 16px);box-sizing:border-box;gap:2px!important;padding:4px!important}
 #lb2bar button{padding:5px 7px!important;font-size:11px!important}
 #lb2bar button i{display:none}
 #lb2q input{width:110px!important}
 #lb2pan{width:calc(100vw - 16px)!important;min-width:0!important;box-sizing:border-box}
}`;
document.head.appendChild(st);
function fit(){
 const bar=document.getElementById('lb2bar'),pan=document.getElementById('lb2pan'),ev=document.getElementById('k2ev');
 if(!bar)return;
 if(ev&&ev.parentElement!==bar)bar.appendChild(ev);
 const top=document.getElementById('lbTop'),dk=document.getElementById('k2dock'),ph=innerWidth<=760;
 // telefonon a posta/ajándék dokk is a sávba kerül, különben a sávra lógna
 if(dk&&ph&&dk.parentElement!==bar)bar.appendChild(dk);else if(dk&&!ph&&dk.parentElement===bar)document.body.appendChild(dk);
 bar.style.top=ph&&top?Math.round(top.getBoundingClientRect().bottom+6)+'px':'';
 const b=bar.getBoundingClientRect().bottom;
 if(b>0)document.documentElement.style.setProperty('--lA-bottom',Math.round(b)+'px'); // más rétegek ehhez igazodhatnak
 if(pan&&b>0){pan.style.top=Math.round(b+8)+'px';pan.style.maxHeight=Math.max(160,innerHeight-b-28)+'px'}
}
setInterval(fit,700);addEventListener('resize',fit);fit();
})();
