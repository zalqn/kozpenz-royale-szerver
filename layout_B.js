// layout_B.js – lobby BAL oldal: a SÉTA / Versenyek / Közpénz-labor lebegő gombok a JÁTÉK-kártya (#lbPlay) alá csúsztak
// és egymásra (kdBtn+dl2Btn ugyanott, bottom:150px). Itt a bal oszlop szabad sávjába (hírek/Elkapva/MOTD alá,
// #lbPlay fölé) rendezzük őket sorfolytonosan. Lobbyn kívül visszaadjuk az eredeti stílust.
(function(){
 const IDS=['stlBtn','kdBtn','dl2Btn'],GAP=8,X0=14;
 const vis=e=>e&&e.offsetParent!==null&&getComputedStyle(e).display!=='none';
 function tick(){
  const lb=document.querySelector('#lb.on'),play=document.getElementById('lbPlay');
  const btns=IDS.map(i=>document.getElementById(i)).filter(Boolean);
  if(!lb||!vis(play)){btns.forEach(b=>{if(b.dataset.lb){b.style.top=b.style.left=b.style.bottom='';delete b.dataset.lb}});return}
  const pr=play.getBoundingClientRect();
  // a bal oszlop felső elemei alá kezdünk
  let y=0;['lbNews','bjCnt','x14eMotd'].forEach(i=>{const e=document.getElementById(i);if(vis(e)){const r=e.getBoundingClientRect();if(r.left<pr.right)y=Math.max(y,r.bottom)}});
  y+=GAP;const maxX=Math.max(pr.right,X0+260);let x=X0,rowH=0;
  btns.filter(vis).forEach(b=>{
   const w=b.offsetWidth,h=b.offsetHeight;
   if(x>X0&&x+w>maxX){x=X0;y+=rowH+GAP;rowH=0}
   b.dataset.lb=1;b.style.left=x+'px';b.style.top=y+'px';b.style.bottom='auto';
   x+=w+GAP;rowH=Math.max(rowH,h);
  });
  // shortcut: ha nincs elég hely #lbPlay fölött (nagyon alacsony ablak), a gombok rálóghatnak – akkor a kártya mellé kéne tenni
 }
 setInterval(tick,700);addEventListener('resize',tick);tick();
})();
