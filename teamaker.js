// ===== TEAFŐZŐ MINIJÁTÉK: bögre a polcról → forralás → öntés → filter → cukor/citrom/méz → kavarás =====
(function(){
const $$=i=>document.getElementById(i);
// név, kulcs, főzött szín, ideális hő (tól-ig), ázási idő (mp), leírás, ikon
const TEAS=[['Mentás tea','mint','#6f9a2e',90,100,5,'Friss, hűsítő borsmenta.','🌿'],['Kamillatea','cham','#d8b03e',90,100,5,'Lágy, nyugtató virágtea.','🌼'],['Gyümölcstea','fruit','#b01f3c',95,100,6,'Erdei gyümölcsök, mélyvörös.','🍓'],
 ['Matcha','matcha','#79b23c',70,80,2,'Japán zöldtea-por – NE forrald túl!','🍵'],['Earl Grey','earl','#7a3810',90,98,4,'Fekete tea bergamottal.','🫖'],['Jázmintea','jasmine','#cdb75a',75,85,3,'Illatos zöld tea jázminnal.','🌸'],
 ['Rooibos','rooibos','#b5431c',95,100,6,'Dél-afrikai vörös tea, édeskés.','🍂'],['Gyömbéres tea','ginger','#c88a2b',95,100,5,'Csípős, melengető gyömbér.','🫚']];
const MUGS=[['#f8fafc','pötty'],['#ef4444','csík'],['#38bdf8','sima'],['#facc15','szív'],['#22c55e','virág'],['#a855f7','csillag']];
window.TEA_TYPES=TEAS;window.TEA_MUGS=MUGS;window._TM=()=>S;
const TK={};TEAS.forEach(t=>TK[t[1]]=t);
const hex=(h,a)=>{const n=parseInt(h.slice(1),16);return'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+(a==null?1:a)+')'};
const mix=(a,b,k)=>{const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);const c=i=>Math.round((A>>i&255)*(1-k)+(B>>i&255)*k);return'#'+((c(16)<<16)|(c(8)<<8)|c(0)).toString(16).padStart(6,'0')};
// ---------- tea-textúra (felülnézet) – a 3D bögrében is ezt használjuk ----------
function drawTeaTop(x,cx,cy,r,info,t){const col=info.col||'#92400e';const g=x.createRadialGradient(cx-r*.25,cy-r*.25,r*.1,cx,cy,r);g.addColorStop(0,mix(col,'#ffffff',.18));g.addColorStop(.6,col);g.addColorStop(1,mix(col,'#000000',.45));
 x.save();x.beginPath();x.arc(cx,cy,r,0,6.283);x.clip();x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);
 x.globalAlpha=.18;x.strokeStyle='#fff';x.lineWidth=r*.05;for(let k=0;k<3;k++){x.beginPath();x.arc(cx,cy,r*(.3+k*.2),(t||0)*.6+k,(t||0)*.6+k+2.2);x.stroke()}x.globalAlpha=1;
 if(info.key==='matcha'){x.fillStyle='rgba(220,240,180,.55)';for(let i=0;i<70;i++){const a=Math.random()*6.283,d=Math.random()*r*.85;x.beginPath();x.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,r*(.02+Math.random()*.05),0,6.283);x.fill()}}
 if(info.key==='mint'){x.fillStyle='#3f8f2f';[[-.3,-.1],[.25,.2]].forEach(([a,b])=>{x.save();x.translate(cx+a*r,cy+b*r);x.rotate(a*3);x.beginPath();x.ellipse(0,0,r*.16,r*.08,0,0,6.283);x.fill();x.restore()})}
 if(info.honey){x.fillStyle='rgba(255,200,60,.35)';x.beginPath();x.arc(cx+r*.2,cy-r*.15,r*.22,0,6.283);x.fill()}
 if(info.lemon){x.save();x.translate(cx+r*.15,cy+r*.1);x.fillStyle='#fde047';x.beginPath();x.arc(0,0,r*.32,0,6.283);x.fill();x.fillStyle='#fef9c3';x.beginPath();x.arc(0,0,r*.26,0,6.283);x.fill();x.strokeStyle='#facc15';x.lineWidth=r*.025;for(let k=0;k<8;k++){x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(k/8*6.283)*r*.26,Math.sin(k/8*6.283)*r*.26);x.stroke()}x.restore()}
 x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(cx-r*.42,cy-r*.42,r*.18,r*.07,-.8,0,6.283);x.fill();x.restore();
 x.strokeStyle=mix(col,'#000000',.6);x.lineWidth=Math.max(1,r*.04);x.beginPath();x.arc(cx,cy,r,0,6.283);x.stroke()}
const TT={};window.teaTopTex=info=>{const k=info.key+'|'+(info.lemon?1:0)+'|'+(info.honey?1:0);if(TT[k])return TT[k];const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=info.col;x.fillRect(0,0,256,256);drawTeaTop(x,128,128,126,info,0);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return TT[k]=t};
window.teaInfo=(key,lemon,mug,honey)=>{const d=TK[key]||TEAS[0];return{key:d[1],name:d[0],col:d[2],lemon:!!lemon,honey:!!honey,mug:mug|0,mugCol:(MUGS[mug|0]||MUGS[0])[0]}};
// ---------- felület ----------
const css=document.createElement('style');css.textContent=`#tm{position:fixed;inset:0;z-index:30;display:none;align-items:center;justify-content:center;background:#000b;font-family:Rajdhani,Arial;color:#fff}#tm.on{display:flex}
#tmBox{display:flex;gap:14px;background:linear-gradient(#2a1a10,#160d07);border:2px solid #d4a373;border-radius:22px;padding:14px;box-shadow:0 20px 60px #000}
#tmCv{border-radius:14px;display:block;cursor:pointer;background:#1a110a}
#tmSide{width:300px;display:flex;flex-direction:column;gap:8px}#tmSide h2{margin:0;font:26px 'Luckiest Guy',Impact;color:#fde68a}
#tmSteps{display:flex;flex-direction:column;gap:3px;font:700 14px Rajdhani}#tmSteps div{padding:4px 8px;border-radius:8px;background:#ffffff0a;color:#a8a29e}#tmSteps div.on{background:#f59e0b33;color:#fde68a;border-left:3px solid #f59e0b}#tmSteps div.ok{color:#86efac}
#tmInfo{background:#0007;border-radius:12px;padding:10px;font:600 15px Rajdhani;line-height:1.45;min-height:90px}#tmInfo b{color:#fde68a}
.tmB{border:0;border-radius:12px;padding:11px 14px;font:18px 'Luckiest Guy',Impact;cursor:pointer;color:#1c1300;background:linear-gradient(#fde68a,#f59e0b);box-shadow:0 4px 0 #92400e;user-select:none}.tmB:active{transform:translateY(3px);box-shadow:0 1px 0 #92400e}.tmB.hot{background:linear-gradient(#fca5a5,#ef4444);color:#fff;box-shadow:0 4px 0 #7f1d1d}.tmB.g{background:linear-gradient(#86efac,#22c55e);box-shadow:0 4px 0 #14532d}.tmB:disabled{filter:grayscale(1);opacity:.5}
.tmX{background:#334155;color:#fff;box-shadow:0 4px 0 #0f172a}
#tmTeas{display:grid;grid-template-columns:1fr 1fr;gap:6px}#tmTeas button{border:1px solid #ffffff22;border-radius:12px;padding:7px;background:#ffffff0d;color:#fff;font:700 14px Rajdhani;cursor:pointer;text-align:left}#tmTeas button:hover{background:#ffffff22}#tmTeas button i{display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:5px;vertical-align:-1px}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='tm';D.innerHTML='<div id="tmBox"><canvas id="tmCv" width="760" height="520"></canvas><div id="tmSide"><h2>🫖 TEAFŐZÉS</h2><div id="tmSteps"></div><div id="tmInfo"></div><div id="tmCtl" style="display:flex;flex-direction:column;gap:6px"></div><button class="tmB tmX" id="tmQuit">✕ MÉGSE (Esc)</button></div></div>';document.body.appendChild(D);
const cv=$$('tmCv'),x=cv.getContext('2d');
const STEPS=['🍃 Tea kiválasztása','☕ Bögre a polcról','🔥 Víz felforralása','🫗 Kiöntés a bögrébe','⏱️ Filter beáztatása','🍋 Cukor · citrom · méz','🥄 Kavarás','✨ Kész!'];
let S=null,raf=0,cb=null,hold=false,mx=0,my=0;
window.openTeaMaker=f=>{cb=f;S={step:0,tea:null,mug:-1,temp:22,lvl:0,steep:0,bag:false,sugar:0,lemon:false,honey:false,stir:0,lastA:null,sc:{},t0:performance.now(),drops:[],steam:[],mugAnim:0};window._tmOpen=true;D.classList.add('on');ui();cancelAnimationFrame(raf);loop()};
function close(res){D.classList.remove('on');window._tmOpen=false;cancelAnimationFrame(raf);hold=false;const f=cb;cb=null;if(res&&f)f(res)}
$$('tmQuit').onclick=()=>close(null);
addEventListener('keydown',e=>{if(!window._tmOpen)return;if(e.key==='Escape')close(null);if(e.key===' '){hold=true;e.preventDefault()}e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{if(!window._tmOpen)return;if(e.key===' ')hold=false;e.stopImmediatePropagation()},true);
const go=n=>{S.step=n;S.ts=performance.now();ui();try{sfx('click')}catch(e){}};
function ui(){$$('tmSteps').innerHTML=STEPS.map((s,i)=>'<div class="'+(i===S.step?'on':i<S.step?'ok':'')+'">'+(i<S.step?'✔ ':'')+s+'</div>').join('');const T=S.tea,I=$$('tmInfo'),C=$$('tmCtl');
 const holdBtn=(lbl,cls)=>'<button class="tmB '+(cls||'hot')+'" id="tmHold">'+lbl+'</button>';
 if(S.step===0){I.innerHTML='Milyen teát főzöl? 🍃';C.innerHTML='<div id="tmTeas">'+TEAS.map((t,i)=>'<button data-t="'+i+'"><i style="background:'+t[2]+'"></i>'+t[7]+' '+t[0]+'</button>').join('')+'</div>';C.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{S.tea=TEAS[+b.dataset.t];go(1)})}
 else if(S.step===1){I.innerHTML='<b>'+T[7]+' '+T[0]+'</b><br>'+T[6]+'<br><br>👆 Kattints egy <b>bögrére</b> a polcon!';C.innerHTML=''}
 else if(S.step===2){I.innerHTML='Tartsd nyomva a <b>🔥 MELEGÍTÉS</b> gombot (vagy a Space-t)!<br>Ideális hőfok: <b>'+T[3]+'–'+T[4]+' °C</b>'+(T[1]==='matcha'?'<br>⚠️ A matcha nem szereti a forró vizet!':'')+'<br>Ha jó, nyomd a <b>KÉSZ</b>-t.';C.innerHTML=holdBtn('🔥 MELEGÍTÉS (nyomva tartva)')+'<button class="tmB g" id="tmOk">✔ KÉSZ</button>'}
 else if(S.step===3){I.innerHTML='Tartsd nyomva az <b>🫗 ÖNTÉS</b>-t, és állj meg a <b>zöld jelölésnél</b>!<br>Ne öntsd túl! 😅';C.innerHTML=holdBtn('🫗 ÖNTÉS (nyomva tartva)','')+'<button class="tmB g" id="tmOk">✔ KÉSZ</button>'}
 else if(S.step===4){I.innerHTML='A filter ázik… figyeld a színét!<br>Ideális ázás: <b>'+T[5]+' mp</b><br>Akkor vedd ki, amikor a csík a zöld részen van.';C.innerHTML='<button class="tmB g" id="tmOk">🍵 FILTER KIVÉTELE</button>'}
 else if(S.step===5){I.innerHTML='Ízesítsd! Kattints a pulton:<br>🧊 <b>cukor</b> (max 4) · 🍋 <b>citrom</b> · 🍯 <b>méz</b><br><br>Cukor: <b>'+S.sugar+'</b> · Citrom: <b>'+(S.lemon?'igen':'nem')+'</b> · Méz: <b>'+(S.honey?'igen':'nem')+'</b>';C.innerHTML='<button class="tmB g" id="tmOk">➜ TOVÁBB A KAVARÁSHOZ</button>'}
 else if(S.step===6){I.innerHTML='🥄 Kavard meg! Tartsd lenyomva az egeret a bögre fölött, és <b>körözz</b> vele 3-szor!';C.innerHTML=''}
 else if(S.step===7){const q=quality();S.q=q;const st='⭐'.repeat(Math.max(1,Math.round(q/20)));I.innerHTML='<b style="font-size:20px">'+T[7]+' '+T[0]+'</b><br>'+(S.sugar?S.sugar+' cukor · ':'cukor nélkül · ')+(S.lemon?'citrommal · ':'')+(S.honey?'mézzel · ':'')+'<br>Minőség: <b>'+q+'%</b> '+st+'<br><small>'+verdict(q)+'</small>';C.innerHTML='<button class="tmB g" id="tmOk">☕ KÉZBE VESZEM</button>'}
 const h=$$('tmHold');if(h){const on=e=>{hold=true;e.preventDefault()},off=()=>hold=false;h.addEventListener('pointerdown',on);h.addEventListener('pointerup',off);h.addEventListener('pointerleave',off)}
 const ok=$$('tmOk');if(ok)ok.onclick=()=>{if(S.step===2){S.sc.temp=tempScore();go(3)}else if(S.step===3){if(S.lvl<.05)return;S.sc.pour=pourScore();S.bag=true;S.steep=0;go(4)}else if(S.step===4){S.sc.steep=steepScore();S.bag=false;go(5)}else if(S.step===5)go(6);else if(S.step===7){const T2=S.tea;close(Object.assign(window.teaInfo(T2[1],S.lemon,S.mug,S.honey),{sugar:S.sugar,q:S.q}))}}}
const tempScore=()=>{const T=S.tea,t=S.temp;return t>=T[3]&&t<=T[4]?1:Math.max(0,1-Math.min(Math.abs(t-T[3]),Math.abs(t-T[4]))/25)};
const pourScore=()=>S.lvl>.95?.3:S.lvl>=.74&&S.lvl<=.88?1:Math.max(0,1-Math.abs(S.lvl-.81)*3);
const steepScore=()=>{const id=S.tea[5],d=Math.abs(S.steep-id)/id;return Math.max(0,1-d)};
const quality=()=>Math.round((S.sc.temp*.3+S.sc.pour*.25+S.sc.steep*.3+.15)*100);
const verdict=q=>q>=90?'Mesteri tea! A teaház büszke rád. 🏆':q>=70?'Nagyon finom lett! 😋':q>=45?'Iható… legközelebb még jobb lesz.':'Hmm… ezt inkább a koi-halak kapják. 🐟';
// ---------- egér ----------
const pos=e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)*cv.width/r.width;my=(e.clientY-r.top)*cv.height/r.height};
let mdown=false;cv.addEventListener('pointermove',e=>{pos(e);if(S&&S.step===6&&mdown){const a=Math.atan2(my-MUGY,mx-MUGX);if(S.lastA!=null){let d=a-S.lastA;d=Math.atan2(Math.sin(d),Math.cos(d));S.stir+=Math.abs(d)}S.lastA=a;if(S.stir>=6.283*3){S.stir=6.283*3;go(7)}}});
cv.addEventListener('pointerdown',e=>{pos(e);mdown=true;if(!S)return;
 if(S.step===1){MUGS.forEach((m,i)=>{const [sx,sy]=shelfPos(i);if(mx>sx-30&&mx<sx+34&&my>sy-38&&my<sy+12){S.mug=i;S.mugAnim=0;setTimeout(()=>go(2),650);try{sfx('drop')}catch(er){}}})}
 if(S.step===5){if(hit(SUGAR)&&S.sugar<4){S.sugar++;S.drops.push({x:MUGX+(Math.random()-.5)*20,y:MUGY-120,vy:0,k:'s'});try{sfx('coin')}catch(er){}ui()}
  if(hit(LEMON)&&!S.lemon){S.lemon=true;for(let k=0;k<6;k++)S.drops.push({x:MUGX+(Math.random()-.5)*16,y:MUGY-110-k*6,vy:0,k:'l'});try{sfx('magic')}catch(er){}ui()}
  if(hit(HONEY)&&!S.honey){S.honey=true;S.honeyT=1.2;try{sfx('magic')}catch(er){}ui()}}
 if(S.step===6){S.lastA=Math.atan2(my-MUGY,mx-MUGX)}});
addEventListener('pointerup',()=>{mdown=false;hold=false});
const hit=r=>mx>r[0]&&mx<r[0]+r[2]&&my>r[1]&&my<r[1]+r[3];
// ---------- jelenet ----------
const MUGX=360,MUGY=380,SUGAR=[505,330,70,70],LEMON=[590,345,64,56],HONEY=[665,320,60,80];
const shelfPos=i=>[70+i*56,118];
function mugShape(cx,cy,w,h,col,pat,fill,info,t){// oldalnézet
 x.save();x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(cx,cy+4,w*.6,8,0,0,6.283);x.fill();
 x.lineWidth=w*.13;x.strokeStyle=col;x.beginPath();x.arc(cx+w*.55,cy-h*.5,h*.26,-1.3,1.3);x.stroke();
 const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,mix(col,'#000000',.25));g.addColorStop(.35,mix(col,'#ffffff',.25));g.addColorStop(1,mix(col,'#000000',.35));
 x.fillStyle=g;x.beginPath();x.moveTo(cx-w/2,cy-h);x.lineTo(cx+w/2,cy-h);x.lineTo(cx+w*.45,cy);x.quadraticCurveTo(cx,cy+6,cx-w*.45,cy);x.closePath();x.fill();
 x.save();x.clip();const pc=mix(col,col==='#f8fafc'?'#ef4444':'#ffffff',.85);x.fillStyle=pc;x.globalAlpha=.9;
 if(pat==='pötty')for(let i=0;i<14;i++){x.beginPath();x.arc(cx-w/2+((i*37)%w),cy-h+((i*53)%h),w*.05,0,6.283);x.fill()}
 if(pat==='csík')for(let i=0;i<4;i++)x.fillRect(cx-w/2,cy-h+h*.18+i*h*.22,w,h*.07);
 if(pat==='szív'){x.font=(w*.4)+'px serif';x.textAlign='center';x.fillText('❤',cx,cy-h*.35)}if(pat==='virág'){x.font=(w*.38)+'px serif';x.textAlign='center';x.fillText('✿',cx,cy-h*.33)}if(pat==='csillag'){x.font=(w*.38)+'px serif';x.textAlign='center';x.fillText('★',cx,cy-h*.33)}
 x.restore();x.fillStyle=mix(col,'#000000',.55);x.beginPath();x.ellipse(cx,cy-h,w/2,h*.09,0,0,6.283);x.fill();
 if(fill>0){const lw=w/2-3,ly=cy-h+h*(1-fill)*.92;x.save();x.beginPath();x.ellipse(cx,cy-h,lw,h*.085,0,0,6.283);x.clip();x.restore();
  const top=cy-h+(1-fill)*h*.6;x.fillStyle=info.col;x.beginPath();x.ellipse(cx,cy-h,lw,h*.08,0,0,6.283);x.fill();if(info.lemon){x.fillStyle='#fde047';x.beginPath();x.ellipse(cx+lw*.2,cy-h,lw*.3,h*.04,0,0,6.283);x.fill()}x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.ellipse(cx-lw*.35,cy-h-1,lw*.25,h*.02,0,0,6.283);x.fill()}
 x.restore()}
function scene(t,dt){const W=cv.width,H=cv.height;
 // fal + ablak
 let g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5b3a22');g.addColorStop(1,'#3a2415');x.fillStyle=g;x.fillRect(0,0,W,H);x.strokeStyle='rgba(0,0,0,.25)';x.lineWidth=2;for(let i=0;i<W;i+=48){x.beginPath();x.moveTo(i,0);x.lineTo(i,H*.62);x.stroke()}
 x.fillStyle='#0b1440';x.fillRect(470,30,240,170);const sg=x.createRadialGradient(650,70,4,650,70,40);sg.addColorStop(0,'#fff6dc');sg.addColorStop(.4,'#fde68a55');sg.addColorStop(1,'#0000');x.fillStyle=sg;x.fillRect(470,30,240,170);for(let i=0;i<25;i++){x.fillStyle='rgba(255,255,255,'+(.4+Math.sin(t*2+i)*.3)+')';x.fillRect(480+(i*67)%220,40+(i*41)%140,2,2)}
 x.strokeStyle='#7f1d1d';x.lineWidth=10;x.strokeRect(470,30,240,170);x.lineWidth=5;x.beginPath();x.moveTo(590,30);x.lineTo(590,200);x.moveTo(470,115);x.lineTo(710,115);x.stroke();
 // lámpás
 x.fillStyle='#ef4444';x.beginPath();x.ellipse(400,70,26,34,0,0,6.283);x.fill();const lg=x.createRadialGradient(400,70,5,400,70,90);lg.addColorStop(0,'rgba(255,150,80,.35)');lg.addColorStop(1,'rgba(255,150,80,0)');x.fillStyle=lg;x.fillRect(300,0,200,170);x.fillStyle='#fde68a';x.font='bold 22px serif';x.textAlign='center';x.fillText('茶',400,78);
 // polc + bögrék
 x.fillStyle='#7c4a24';x.fillRect(30,124,350,14);x.fillStyle='#4a2c15';x.fillRect(30,138,350,6);
 MUGS.forEach((m,i)=>{if(i===S.mug&&S.step>=1)return;const [sx,sy]=shelfPos(i);const hov=S.step===1&&mx>sx-30&&mx<sx+34&&my>sy-38&&my<sy+12;mugShape(sx,sy+(hov?-4:0),46,46,m[0],m[1],0);if(hov){x.strokeStyle='#fde68a';x.lineWidth=2;x.strokeRect(sx-30,sy-44,64,52)}});
 // pult
 g=x.createLinearGradient(0,H*.62,0,H);g.addColorStop(0,'#c08a5a');g.addColorStop(.08,'#9a6b45');g.addColorStop(1,'#5b3a22');x.fillStyle=g;x.fillRect(0,H*.62,W,H*.38);x.strokeStyle='rgba(0,0,0,.18)';for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,H*.66+i*30);x.lineTo(W,H*.66+i*30+((i%2)?6:-4));x.stroke()}
 // tűzhely + kanna
 x.fillStyle='#1f2937';x.fillRect(90,345,170,26);const hot=Math.min(1,(S.temp-22)/78);x.fillStyle='rgba(255,'+(90-hot*50|0)+',20,'+(.25+hot*.75)+')';x.beginPath();x.ellipse(175,345,62,10,0,0,6.283);x.fill();
 const kx=175,ky=300;x.fillStyle='#b87333';x.beginPath();x.ellipse(kx,ky,62,46,0,0,6.283);x.fill();x.fillStyle='#d4955a';x.beginPath();x.ellipse(kx-18,ky-14,22,12,-.4,0,6.283);x.fill();x.fillStyle='#8a5526';x.beginPath();x.moveTo(kx+50,ky-6);x.lineTo(kx+98,ky-38);x.lineTo(kx+102,ky-30);x.lineTo(kx+56,ky+10);x.fill();
 x.fillStyle='#8a5526';x.fillRect(kx-20,ky-58,40,12);x.strokeStyle='#3f2a14';x.lineWidth=7;x.beginPath();x.arc(kx,ky-50,40,Math.PI*1.1,Math.PI*1.9);x.stroke();
 if(S.temp>85&&S.step>=2&&S.step<=3&&Math.random()<.5)S.steam.push({x:kx+100,y:ky-38,t:0});
 // hőmérő
 if(S.step>=2&&S.step<=3){const T=S.tea,bx=40,by=170,bh=190;x.fillStyle='#0008';x.fillRect(bx-8,by-10,36,bh+40);x.fillStyle='#e5e7eb';x.fillRect(bx,by,20,bh);const yy=v=>by+bh-(v-20)/80*bh;x.fillStyle='#22c55e88';x.fillRect(bx,yy(T[4]),20,yy(T[3])-yy(T[4]));x.fillStyle='#ef4444';x.fillRect(bx+4,yy(S.temp),12,by+bh-yy(S.temp));x.beginPath();x.arc(bx+10,by+bh+12,13,0,6.283);x.fill();
  x.fillStyle='#fff';x.font='bold 16px Rajdhani';x.textAlign='left';x.fillText(Math.round(S.temp)+'°C',bx+28,yy(S.temp)+5)}
 // bögre a pulton
 if(S.mug>=0){const m=MUGS[S.mug];S.mugAnim=Math.min(1,S.mugAnim+dt*2.2);const [sx,sy]=shelfPos(S.mug);const k=1-Math.pow(1-S.mugAnim,3);const cx=sx+(MUGX-sx)*k,cy=sy+(MUGY-sy)*k-Math.sin(k*Math.PI)*60,sz=46+(120-46)*k;
  const strength=S.step>=4?Math.min(1.3,S.steep/S.tea[5]):0;const info={col:mix('#cfe8f5',S.tea[2],Math.min(1,strength)),lemon:S.lemon,key:S.tea[1]};if(strength>1)info.col=mix(S.tea[2],'#1a0d05',(strength-1)*1.5);
  mugShape(cx,cy,sz,sz*.95,m[0],m[1],S.lvl,info,t);
  if(S.step>=3&&S.lvl>0){x.save();x.translate(cx,cy-sz*.95);x.scale(1,.17);drawTeaTop(x,0,0,sz/2-4,Object.assign({},info,{honey:S.honey}),t);x.restore()}
  if(S.step>=5){const info2=Object.assign({},info,{honey:S.honey});const px=600,py=250,pr=S.step===7?70:52;x.fillStyle='#0008';x.beginPath();x.arc(px,py,pr+12,0,6.283);x.fill();x.fillStyle=m[0];x.beginPath();x.arc(px,py,pr+8,0,6.283);x.fill();drawTeaTop(x,px,py,pr,info2,t);x.fillStyle='#fde68a';x.font='bold 14px Rajdhani';x.textAlign='center';x.fillText('felülnézet',px,py-pr-16)}
  if(S.step===3){x.strokeStyle='#22c55e';x.lineWidth=3;x.setLineDash([6,4]);const l1=cy-sz*.95*(.74),l2=cy-sz*.95*(.88);x.beginPath();x.moveTo(cx+sz*.62,l1);x.lineTo(cx+sz*.85,l1);x.moveTo(cx+sz*.62,l2);x.lineTo(cx+sz*.85,l2);x.stroke();x.setLineDash([]);
   x.fillStyle='#fff';x.font='bold 15px Rajdhani';x.fillText('◀ ide',cx+sz*.88,(l1+l2)/2+5);const fl=cy-sz*.95*S.lvl;x.fillStyle='#38bdf8';x.fillRect(cx+sz*.62,fl-2,18,4)}
  if(S.bag){x.strokeStyle='#e5e7eb';x.lineWidth=2;x.beginPath();x.moveTo(cx+10,cy-sz*.95-50);x.lineTo(cx+sz*.3,cy-sz*.95+10);x.stroke();x.fillStyle='#fef3c7';x.fillRect(cx-6,cy-sz*.95-72,32,24);x.fillStyle=S.tea[2];x.font='bold 13px Rajdhani';x.fillText(S.tea[7],cx+2,cy-sz*.95-55)}
  if(S.step===6||S.step===7){const a=S.step===6&&mdown?Math.atan2(my-MUGY,mx-MUGX):t*2;x.strokeStyle='#d4d4d8';x.lineWidth=6;x.beginPath();x.moveTo(cx+Math.cos(a)*sz*.18,cy-sz*.95+Math.sin(a)*8);x.lineTo(cx+sz*.5,cy-sz*1.6);x.stroke();
   if(S.step===6){const p=S.stir/(6.283*3);x.strokeStyle='#fde68a';x.lineWidth=8;x.beginPath();x.arc(cx,cy-sz*.5,sz*.95,-Math.PI/2,-Math.PI/2+p*6.283);x.stroke();x.fillStyle='#fff';x.font='bold 18px Rajdhani';x.textAlign='center';x.fillText('🥄 '+Math.floor(p*3)+'/3 kör',cx,cy+38)}}
  if(S.step===4){const id=S.tea[5],bw=300,bx=210,by=470;x.fillStyle='#0009';x.fillRect(bx-6,by-6,bw+12,28);const mx2=Math.min(1,S.steep/(id*2));x.fillStyle='#ef444455';x.fillRect(bx,by,bw,16);x.fillStyle='#22c55e';x.fillRect(bx+bw*(id*.8/(id*2)),by,bw*(id*.4/(id*2)),16);x.fillStyle='#fde68a';x.fillRect(bx+bw*mx2-2,by-4,4,24);x.fillStyle='#fff';x.font='bold 14px Rajdhani';x.textAlign='left';x.fillText('Ázás: '+S.steep.toFixed(1)+' mp',bx,by-10)}}
 // ízesítők
 if(S.step===5||S.step>5){const hv=r=>S.step===5&&hit(r);x.fillStyle=hv(SUGAR)?'#ffffffee':'#ffffffaa';x.fillRect(SUGAR[0]+8,SUGAR[1]+18,54,50);x.fillStyle='#e5e7eb';for(let i=0;i<4;i++)x.fillRect(SUGAR[0]+14+(i%2)*22,SUGAR[1]+30+(i>>1)*18,16,14);x.fillStyle='#fff';x.font='bold 13px Rajdhani';x.textAlign='center';x.fillText('CUKOR',SUGAR[0]+35,SUGAR[1]+14);
  x.fillStyle=hv(LEMON)?'#fef08a':'#fde047';x.beginPath();x.ellipse(LEMON[0]+32,LEMON[1]+30,30,22,0,0,6.283);x.fill();x.fillStyle='#fff';x.fillText('CITROM',LEMON[0]+32,LEMON[1]-2);
  x.fillStyle=hv(HONEY)?'#fbbf24':'#d97706';x.beginPath();x.moveTo(HONEY[0]+12,HONEY[1]+26);x.lineTo(HONEY[0]+48,HONEY[1]+26);x.lineTo(HONEY[0]+54,HONEY[1]+78);x.lineTo(HONEY[0]+6,HONEY[1]+78);x.fill();x.fillStyle='#78350f';x.fillRect(HONEY[0]+14,HONEY[1]+16,32,10);x.fillStyle='#fff';x.fillText('MÉZ',HONEY[0]+30,HONEY[1]+10)}
 // csepp/kocka anim
 S.drops=S.drops.filter(d=>{d.vy+=600*dt;d.y+=d.vy*dt;x.fillStyle=d.k==='s'?'#fff':'#fde047';if(d.k==='s')x.fillRect(d.x-7,d.y-7,14,14);else{x.beginPath();x.arc(d.x,d.y,4,0,6.283);x.fill()}return d.y<MUGY-90});
 if(S.honeyT>0){S.honeyT-=dt;x.strokeStyle='#f59e0b';x.lineWidth=5;x.beginPath();x.moveTo(MUGX+10,MUGY-260);x.lineTo(MUGX+10,MUGY-110);x.stroke()}
 // öntés sugár
 if(S.step===3&&hold){x.strokeStyle='rgba(180,220,255,.8)';x.lineWidth=6;x.beginPath();x.moveTo(MUGX-4,MUGY-240);x.quadraticCurveTo(MUGX+4,MUGY-190,MUGX,MUGY-115);x.stroke();x.fillStyle='#b87333';x.save();x.translate(MUGX-60,MUGY-258);x.rotate(.5);x.beginPath();x.ellipse(0,0,46,34,0,0,6.283);x.fill();x.restore()}
 // gőz
 S.steam=S.steam.filter(p=>{p.t+=dt;p.y-=40*dt;p.x+=Math.sin(p.t*3)*.6;x.fillStyle='rgba(255,255,255,'+Math.max(0,.35-p.t*.18)+')';x.beginPath();x.arc(p.x,p.y,6+p.t*8,0,6.283);x.fill();return p.t<2});
 if(S.step>=4&&Math.random()<.25)S.steam.push({x:MUGX+(Math.random()-.5)*40,y:MUGY-125,t:0});
 if(S.step===7){x.fillStyle='rgba(253,230,138,'+(.15+Math.sin(t*3)*.08)+')';x.beginPath();x.arc(MUGX,MUGY-60,150,0,6.283);x.fill()}}
let last=0;function loop(){raf=requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.05,(n-last)/1000||.016);last=n;const t=n/1000;if(!S)return;
 if(S.step===2){S.temp+=hold?24*dt:-3*dt;S.temp=Math.max(22,Math.min(100,S.temp))}
 if(S.step===3&&hold){S.lvl+=.32*dt;if(S.lvl>1){S.lvl=1}}
 if(S.step===4){S.steep+=dt}
 scene(t,dt)}
})();
