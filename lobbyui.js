/* 11-15 LOBBY UI 2 – egységes üveg-design + új elrendezés (a 3D pályához nem nyúl). Csak ≥761px széles képernyőn, a mobil-elrendezés marad. */
(function(){
const css=`
@media (min-width:761px){
 :root{--lu-bg:rgba(14,16,30,.72);--lu-bd:rgba(255,255,255,.12);--lu-r:18px;--lu-acc:#ffd23f;--lu-sh:0 10px 30px rgba(0,0,0,.35)}
 #lbNews,#lbPlay,#lbPlayer,#lb2bar,#bjCnt,#x14dJP,#lbSide>*,#lbBot>*,#pfTog{zoom:1!important;
  background:var(--lu-bg)!important;border:1px solid var(--lu-bd)!important;border-radius:var(--lu-r)!important;
  box-shadow:var(--lu-sh)!important;backdrop-filter:blur(14px) saturate(1.3)!important;-webkit-backdrop-filter:blur(14px) saturate(1.3)!important}
 /* bal oszlop: hírek → elkapva → játék kártya, egy függőleges sorban, 280 px */
 #lbNews{left:20px!important;top:72px!important;width:280px!important;right:auto!important}
 #bjCnt{left:20px!important;top:224px!important;width:280px!important;box-sizing:border-box;right:auto!important;margin-top:14px!important}
 #lbPlay{left:20px!important;bottom:20px!important;top:auto!important;width:280px!important;right:auto!important}
 #lbPlay button:last-of-type,#lbPlay .play,#lbPlay [id*=Go]{border-radius:14px!important}
 /* kategóriasáv: vékony, középre igazított pirulasor a fülsor alatt */
 #lb2bar{top:66px!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;
  width:auto!important;max-width:calc(100vw - 660px)!important;padding:6px 10px!important;border-radius:999px!important;
  flex-wrap:wrap!important;justify-content:center!important;gap:4px!important}
 /* jobb oszlop: zene → jackpot → oldalgombok, 280 px, a bal oszlop tükörképe */
 #lbPlayer{right:20px!important;left:auto!important;top:72px!important;width:280px!important;box-sizing:border-box!important;overflow:hidden!important}
 #x14dJP{right:20px!important;left:auto!important;top:252px!important;width:280px!important;border-radius:999px!important}
 #lbSide{right:20px!important;left:auto!important;top:auto!important;width:auto!important;
  flex-direction:row!important;gap:8px!important;align-items:flex-end!important}
 html body.lb2on #lb2bar,html body.lb2on #lbSide{display:flex!important}
 #lbSide>*{margin:0!important;zoom:.85!important}
 #lbSide{zoom:1!important;bottom:92px!important}
 #lbBot{right:20px!important;bottom:20px!important;left:auto!important;gap:8px!important}
 /* chat: feljebb, a CHAT/TÁNC gombsor fölött ér véget, lebegő panelként */
 #lbChat{z-index:61!important;top:56px!important;bottom:96px!important;right:20px!important;border-radius:var(--lu-r)!important;border:1px solid var(--lu-bd)!important;overflow:hidden!important}
 html body:has(#lbChat.on) #x14dJP,html body:has(#lbChat.on) #k2dock{visibility:hidden!important}
 #lbChat:not(.on){transform:translateX(calc(100% + 40px))!important}
 /* kutya-kapcsoló: középen alul, a karakter alatt */
 #pfTog{left:50%!important;transform:translateX(-50%)!important;bottom:20px!important;top:auto!important;border-radius:999px!important}
}
/* alacsony képernyőn a jobb oszlop összébb húzódik */
@media (min-width:761px) and (max-height:680px){
 #lbPlayer{top:66px!important} #lbSide{bottom:76px!important}
 #bjCnt,#lbNews{display:none!important}
}
/* keskenyebb ablakban a kutya-kapcsoló ne lógjon rá a jobb alsó gombsorra */
@media (min-width:761px) and (max-width:1180px){
 #pfTog{bottom:84px!important}
}`;
// a layout_A–D/lobby2 body.lb2on …!important szabályainál erősebb kell: html body előtag
const s=document.createElement('style');s.id='lobbyui2';s.textContent=css.replace(/(^|[,{}]\s*)#/g,'$1html body #');
(document.head||document.documentElement).appendChild(s);
})();
