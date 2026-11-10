// layout_D.js – alsó sáv + mobil elrendezés: semmi ne fedjen át, semmi ne lógjon ki (csak CSS + pici JS)
(function(){if(window._lD)return;window._lD=1;
const st=document.createElement('style');st.id='layoutD';st.textContent=`
/* meccs: a tipp-sor csak a szöveg szélességét foglalja (ne takarja a minitérképet / lőszert) */
#hint{left:50%!important;right:auto!important;transform:translateX(-50%);width:max-content;max-width:min(56vw,760px)}
@media (max-width:600px){
 #lbBot{left:8px!important;right:8px!important;bottom:8px!important;justify-content:center}
 #lbPlay{left:12px!important;bottom:calc(70px/.8)!important}
 #lbSide{right:12px!important;bottom:calc(70px/.8)!important}
 /* bal oszlop a felső sáv (layout_A: --lA-bottom) alatt: hírek → Elkapva → +MEGHÍVÁS sor → kutya-kapcsoló, a JÁTÉK kártya fölött */
 body #lbNews{zoom:1!important;top:calc(var(--lA-bottom,93px) + 8px)!important;left:12px!important;scale:.64;transform-origin:0 0}
 /* zene-kártya + jackpot (layout_C) a jobb felére, a bal oszlop mellé, hogy a JÁTÉK kártya kiférjen */
 body.lb2on #lbPlayer{zoom:1!important;top:calc(var(--lA-bottom,93px) + 8px)!important;left:198px!important;right:auto!important;width:262px!important;scale:.7;transform-origin:0 0}
 body.lb2on #x14dJP{top:calc(var(--lA-bottom,93px) + 184px)!important;left:198px!important;width:auto!important}
 body.lb2on #bjCnt,body #bjCnt{top:calc(var(--lA-bottom,93px) + 101px)!important;left:12px!important;scale:.62;transform-origin:0 0}
 .lbPlus[data-ld]{top:calc(var(--lA-bottom,93px) + 130px)!important;transform:none!important;width:40px!important;height:40px!important;font-size:22px!important}
 .lbPlus[data-ld="0"]{left:12px!important}.lbPlus[data-ld="1"]{left:58px!important}.lbPlus[data-ld="2"]{left:104px!important}
 #pfTog{left:12px!important;top:calc(var(--lA-bottom,93px) + 176px)!important;bottom:auto!important;transform:none!important;scale:.6;transform-origin:0 0}
 /* meccs-HUD álló telefonon: alulról felfelé sorok, jobb szélen a mobil akciógomb-oszlop (#x12mob) szabadon */
 #mg{scale:.7;transform-origin:0 100%;max-width:none!important}
 #tb{scale:.85;transform-origin:100% 100%}
 #inv{left:50vw!important;right:auto!important;transform:translateX(-50%)!important;bottom:64px!important;scale:.55;transform-origin:50% 100%}
 #hint{bottom:96px!important;left:50vw!important;max-width:calc(100vw - 16px)}
 #x12mob{bottom:160px!important}
 #mm{left:8px!important;bottom:152px!important;top:auto!important;right:auto!important}
 #brAmmo{right:76px!important;bottom:152px!important;scale:.7;transform-origin:100% 100%}
 #k3CHud{left:124px!important;bottom:202px!important;transform:none!important}
 #xItems{right:76px!important;bottom:236px!important;scale:.7;transform-origin:100% 100%}
 [data-ld=urna]{left:124px!important;right:auto!important;bottom:268px!important;top:auto!important;scale:.7;transform-origin:0 100%}
 #x110h{right:76px!important;bottom:296px!important;scale:.85;transform-origin:100% 100%}
 #hud .row{flex-wrap:wrap}
 #rySt{top:270px!important;left:8px!important;right:auto!important;transform:none!important}
 #x12tut{top:330px!important}
 [data-ld=fps]{top:8px!important;right:8px!important;left:auto!important;scale:.8;transform-origin:100% 0}
}`;
document.head.appendChild(st);
// a +MEGHÍVÁS jelölőket a 3D vetítés mozgatja (inline left/top) → keskeny kijelzőn sorszámot kapnak, és a CSS fix sorba rakja őket
setInterval(()=>{document.querySelectorAll('.lbPlus').forEach((e,i)=>{if(e.dataset.ld!=String(i))e.dataset.ld=i});const u=[...document.querySelectorAll('body>div')].find(d=>!d.id&&/Urna:/.test(d.textContent));if(u)u.dataset.ld='urna';const f=[...document.querySelectorAll('body>div')].find(d=>!d.id&&/^\d+ FPS/.test(d.textContent));if(f)f.dataset.ld='fps'},700);
})();
