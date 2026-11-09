// dockpremium.js – prémium kinézet + 75%-os méret a lobby dokk sávjainak (#soDock)
(function(){
const st=document.createElement('style');
st.textContent=`
#soDock{zoom:.75;flex-wrap:wrap;justify-content:center;max-width:min(1500px,96vw);gap:7px!important;padding:9px 11px!important;border-radius:20px!important;
 background:linear-gradient(180deg,#141a33f2,#070a18f2)!important;border:1px solid #fbbf2466!important;
 box-shadow:0 0 0 1px #00000088,0 10px 34px #000c,inset 0 1px 0 #ffffff22,0 0 26px #f59e0b22!important;backdrop-filter:blur(10px) saturate(1.3)!important}
#soDock::before{content:'';position:absolute;left:18px;right:18px;top:0;height:1px;background:linear-gradient(90deg,transparent,#fde68a,transparent);opacity:.8}
#soDock button{overflow:hidden;letter-spacing:.6px;padding:8px 12px!important;border-radius:12px!important;
 border:1px solid #ffffff1f!important;text-shadow:0 1px 2px #000a;
 box-shadow:inset 0 1px 0 #ffffff30,inset 0 -2px 0 #0006,0 3px 8px #0008;transition:transform .15s,box-shadow .15s,filter .15s}
#soDock button:not([style*="background"]):not(.hot):not(.gold){background:linear-gradient(180deg,#2b3550,#141b2e)!important}
#soDock button::after{content:'';position:absolute;top:0;left:-60%;width:40%;height:100%;
 background:linear-gradient(100deg,transparent,#ffffff40,transparent);transform:skewX(-20deg);transition:left .45s}
#soDock button:hover::after{left:130%}
#soDock button:hover{transform:translateY(-2px) scale(1.04)!important;filter:brightness(1.18)!important;
 border-color:#fde68a99!important;box-shadow:inset 0 1px 0 #ffffff40,0 0 14px #fbbf2466,0 6px 14px #000a!important}
#soDock button.hot{background:linear-gradient(180deg,#c084fc,#7c3aed 55%,#5b21b6)!important;border-color:#e9d5ff66!important;animation:dpPulse 2.6s infinite}
#soDock button.gold{background:linear-gradient(180deg,#fef3c7,#fbbf24 50%,#d97706)!important;color:#1c1300!important;text-shadow:none}
@keyframes dpPulse{0%,100%{box-shadow:inset 0 1px 0 #ffffff40,0 0 0 #a855f700}50%{box-shadow:inset 0 1px 0 #ffffff40,0 0 16px #a855f7aa}}
`;
document.head.appendChild(st);
})();
