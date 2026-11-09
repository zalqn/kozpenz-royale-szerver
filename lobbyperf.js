// ===== LOBBY OPTIMALIZÁLÁS: max. 3 pontfény (a többit kikapcsoljuk – a lámpák izzója továbbra is világít) =====
(function(){
function limit(){const L=window.LB3D;if(!L||!L.sc)return;const pts=[];L.sc.traverse(o=>{if(o.isPointLight&&o!==L.back)pts.push(o)});
 pts.sort((a,b)=>(b.intensity*(b.distance||30))-(a.intensity*(a.distance||30)));pts.forEach((l,i)=>{l.visible=i<2})}
[2500,6000,12000,20000].forEach(t=>setTimeout(limit,t));
window._lobbyLimit=limit;
})();
