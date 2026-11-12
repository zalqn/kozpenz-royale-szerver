// ===== /alfredomode – bolgár mód: repkedő animációk + teljes felület bolgárra fordítva (újra beírva kikapcsol) =====
// Fordítás: beépített szótár + Google fordító (hu→bg), gyorsítótár localStorage k3alfTr. Offline: cirill átírás.
(function(){
const LS='k3alfTr';let TR={};try{TR=JSON.parse(localStorage.getItem(LS)||'{}')}catch(e){}
const DICT={'Játék':'Игра','JÁTÉK':'ИГРА','Bolt':'Магазин','Kaszinó':'Казино','Beállítások':'Настройки','Közösség':'Общност','Haladás':'Напредък','Egyéb':'Други','Bezár':'Затвори','Bezárás':'Затваряне','Vissza':'Назад','Igen':'Да','Nem':'Не','Mentés':'Запази','Belépés':'Вход','Regisztráció':'Регистрация','Jelszó':'Парола','Név':'Име','Barátok':'Приятели','Ranglista':'Класация','Profil':'Профил','Küldetések':'Мисии','Fegyverek':'Оръжия','Kilépés':'Изход','Indítás':'Старт','Győzelem':'Победа','Vereség':'Загуба','Pénz':'Пари','Szint':'Ниво','Kutya':'Куче','Zene':'Музика','Hang':'Звук','Grafika':'Графика','Telefon':'Телефон','Térkép':'Карта','Chat':'Чат'};
const LAT={a:'а',á:'а',b:'б',c:'ц',d:'д',e:'е',é:'е',f:'ф',g:'г',h:'х',i:'и',í:'и',j:'й',k:'к',l:'л',m:'м',n:'н',o:'о',ó:'о',ö:'ьо',ő:'ьо',p:'п',q:'к',r:'р',s:'ш',t:'т',u:'у',ú:'у',ü:'ю',ű:'ю',v:'в',w:'в',x:'кс',y:'и',z:'з'};
const DIG={cs:'ч',sz:'с',zs:'ж',gy:'дж',ny:'н',ty:'т',ly:'й'};
const translit=t=>t.replace(/cs|sz|zs|gy|ny|ty|ly|[a-zőűáéíóöúü]/gi,m=>{const l=m.toLowerCase(),r=DIG[l]||LAT[l]||m;return m[0]===m[0].toUpperCase()&&m[0]!==m[0].toLowerCase()?r[0].toUpperCase()+r.slice(1):r});
const HAS=/[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]{2}/;
const orig=new Map(); // text node → eredeti szöveg
const mine=new WeakMap(); // text node → amit mi írtunk bele
const oAttr=new Map(); // elem → {attr: eredeti}
let on=false,obs=null,queue=new Set(),busy=false;
const look=s=>{const k=s.trim();return DICT[k]||TR[k]};
function apply(n){const o=orig.get(n);if(o==null)return;if(hold||anim.has(n)){queue.add(o.trim());return}const k=o.trim(),t=look(o);const v=t?o.replace(k,t):!navigator.onLine?o.replace(k,translit(k)):null;if(!t)queue.add(k);if(v!=null&&n.nodeValue!==v){mine.set(n,v);n.nodeValue=v}}
function walk(root){if(!root)return;if(root.nodeType===3){take(root);return}if(root.nodeType!==1||/^(SCRIPT|STYLE|TEXTAREA|CANVAS|SVG)$/.test(root.tagName)||root.id==='alfFx')return;
 for(const a of ['placeholder','title']){const v=root.getAttribute&&root.getAttribute(a);if(v&&HAS.test(v)){let m=oAttr.get(root);if(!m)oAttr.set(root,m={});if(!(a in m))m[a]=v;const t=look(m[a]);if(t)root.setAttribute(a,t);else queue.add(m[a].trim())}}
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let x;const L=[];while(x=w.nextNode())L.push(x);L.forEach(take)}
function take(n){const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName))return;const v=n.nodeValue;if(mine.get(n)===v||anim.has(n))return;if(!HAS.test(v)){orig.delete(n);return}orig.set(n,v);apply(n)}
async function pump(){if(busy||!on||!queue.size||!navigator.onLine)return;busy=true;
 const batch=[];let len=0;for(const k of queue){if(TR[k]||DICT[k]){queue.delete(k);continue}if(len+k.length>1400)break;batch.push(k);len+=k.length+1}
 try{if(batch.length){const r=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=hu&tl=bg&dt=t&q='+encodeURIComponent(batch.join('\n')));const j=await r.json();
  const out=j[0].map(x=>x[0]).join('').split('\n');batch.forEach((k,i)=>{TR[k]=(out[i]||'').trim()||translit(k);queue.delete(k)});try{localStorage.setItem(LS,JSON.stringify(TR))}catch(e){}refresh()}}
 catch(e){batch.forEach(k=>{TR[k]=translit(k);queue.delete(k)});refresh()}
 busy=false;if(queue.size)setTimeout(pump,250)}
function refresh(){for(const n of orig.keys()){if(!n.isConnected){orig.delete(n);continue}apply(n)}for(const [el,m] of oAttr){if(!el.isConnected){oAttr.delete(el);continue}for(const a in m){const t=look(m[a]);if(t)el.setAttribute(a,t)}}}
function restore(){for(const [n,o] of orig)if(n.isConnected)n.nodeValue=o;for(const [el,m] of oAttr)for(const a in m)el.setAttribute(a,m[a]);orig.clear();oAttr.clear();queue.clear()}

// ---------- animációk ----------
const css=document.createElement('style');css.textContent=`
#alfFx{position:fixed;inset:0;z-index:2147482000;pointer-events:none}
#alfT{position:fixed;left:50%;top:38%;z-index:2147482001;pointer-events:none;transform:translate(-50%,-50%);font:clamp(40px,9vw,120px) 'Russo One','Luckiest Guy',Impact;letter-spacing:4px;white-space:nowrap;
 background:linear-gradient(180deg,#fff 0 33%,#16a34a 33% 66%,#dc2626 66%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:2px #0008;filter:drop-shadow(0 0 18px #fff8) drop-shadow(0 10px 30px #000);
 animation:alfIn 1.1s cubic-bezier(.2,1.6,.4,1) both,alfOut .8s ease-in 3.2s forwards}
#alfT i{display:block;font:700 clamp(16px,2.4vw,30px) Rajdhani,Arial;font-style:normal;text-align:center;color:#fff;-webkit-text-stroke:0;letter-spacing:8px;animation:alfWob 1s ease-in-out infinite alternate}
@keyframes alfIn{0%{transform:translate(-50%,-50%) scale(0) rotate(-25deg);opacity:0}100%{transform:translate(-50%,-50%) scale(1) rotate(0);opacity:1}}
@keyframes alfOut{to{transform:translate(-50%,-160%) scale(.6);opacity:0}}
@keyframes alfWob{from{transform:translateY(-4px)}to{transform:translateY(4px)}}
#alfB{position:fixed;right:12px;top:12px;z-index:2147482001;padding:6px 12px;border-radius:12px;font:800 14px Rajdhani,Arial;color:#fff;pointer-events:none;
 background:linear-gradient(90deg,#fff 0 33%,#16a34a 33% 66%,#dc2626 66%);text-shadow:0 1px 3px #000,0 0 2px #000;box-shadow:0 0 18px #16a34a88;animation:alfWob 1.2s ease-in-out infinite alternate}`;
document.head.appendChild(css);
const EMO=['🇧🇬','🌹','🍅','🧀','🎉','💃','🕺','✨','🎺','🥳','🌶️','🍷','⭐','🪗'],FLAG=['#ffffff','#16a34a','#dc2626'];
let cv,cx,P=[],raf=0,lastBurst=0,lastE=0;
function burst(x,y,n){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=3+Math.random()*7;P.push({k:'c',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-2,r:Math.random()*6.283,vr:(Math.random()-.5)*.4,c:FLAG[i%3],l:90+Math.random()*60,w:6+Math.random()*6})}}
function emoji(){const s=Math.random()<.5,W=innerWidth;P.push({k:'e',e:EMO[Math.random()*EMO.length|0],x:s?-60:W+60,y:innerHeight*(.15+Math.random()*.75),vx:(s?1:-1)*(2+Math.random()*4),vy:-1-Math.random()*2,ph:Math.random()*6,sz:28+Math.random()*44,r:0,vr:(Math.random()-.5)*.08,l:600})}
function frame(t){raf=requestAnimationFrame(frame);if(cv.width!==innerWidth||cv.height!==innerHeight){cv.width=innerWidth;cv.height=innerHeight}
 cx.clearRect(0,0,cv.width,cv.height);
 if(t-lastBurst>900){lastBurst=t;burst(Math.random()*cv.width,cv.height*(.1+Math.random()*.4),60)}
 if(t-lastE>350){lastE=t;emoji()}
 if(Math.random()<.025)P.push({k:'r',x:cv.width*(.1+Math.random()*.8),y:cv.height,vx:(Math.random()-.5)*2,vy:-11-Math.random()*5,r:0,vr:0,l:200});
 // hullámzó zászló-szalag alul
 for(let b=0;b<3;b++){cx.fillStyle=FLAG[b];cx.globalAlpha=.55;cx.beginPath();cx.moveTo(0,cv.height);for(let x=0;x<=cv.width;x+=20)cx.lineTo(x,cv.height-30+b*10+Math.sin(x/70+t/300+b)*8);cx.lineTo(cv.width,cv.height);cx.fill()}cx.globalAlpha=1;
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.l--;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
  if(p.k==='r'){p.vy+=.15;cx.fillStyle=FLAG[(t/80|0)%3];cx.beginPath();cx.arc(p.x,p.y,3,0,6.283);cx.fill();cx.globalAlpha=.4;cx.fillRect(p.x-1,p.y,2,24);cx.globalAlpha=1;if(p.vy>-1){burst(p.x,p.y,90);p.l=0}}
  else if(p.k==='c'){p.vy+=.18;p.vx*=.985;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.globalAlpha=Math.min(1,p.l/30);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.w/4,p.w,p.w/2*Math.abs(Math.sin(p.r*3)));cx.restore()}
  else{p.ph+=.08;p.y+=Math.sin(p.ph)*1.5;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r+Math.sin(p.ph)*.3);cx.font=p.sz+'px serif';cx.textAlign='center';cx.shadowColor='#fff';cx.shadowBlur=12;cx.fillText(p.e,0,0);cx.restore()}
  if(p.l<=0||p.x<-120||p.x>cv.width+120||p.y>cv.height+60)P.splice(i,1)}
 if(P.length>700)P.splice(0,P.length-700)}
function fxOn(){cv=document.createElement('canvas');cv.id='alfFx';document.body.appendChild(cv);cx=cv.getContext('2d');P=[];
 for(let i=0;i<5;i++)setTimeout(()=>burst(innerWidth*(.15+i*.18),innerHeight*.35,120),i*160);
 const T=document.createElement('div');T.id='alfT';T.innerHTML='АЛФРЕДО МОД<i>🇧🇬 ДОБРЕ ДОШЛИ 🇧🇬</i>';document.body.appendChild(T);setTimeout(()=>T.remove(),4200);
 const B=document.createElement('div');B.id='alfB';B.textContent='🇧🇬 АЛФРЕДО МОД';document.body.appendChild(B);raf=requestAnimationFrame(frame)}
function fxOff(){cancelAnimationFrame(raf);['alfFx','alfT','alfB'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()});P=[]}

// ---------- HOLO-HUD: végigpásztáz, ráközelít, backspace-szel kitörli, bolgárul visszagépeli ----------
{const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Russo+One&display=swap';document.head.appendChild(l)}
const hcss=document.createElement('style');hcss.textContent=`
html.alfBg body *:not(input):not(textarea):not(i.fa){font-family:'Russo One',Rajdhani,Arial,sans-serif!important;letter-spacing:.02em}
@keyframes alfJit{0%{transform:translate(0,0)}25%{transform:translate(-1px,1px)}50%{transform:translate(1px,0)}75%{transform:translate(0,-1px)}}
#alfFl{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147482600;pointer-events:none;background:radial-gradient(circle,#e0faff,#22d3ee55 60%,transparent);opacity:0;transition:opacity .35s}
#alfHud{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147482500;pointer-events:none}
#alfScan{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147482400;pointer-events:none;background:repeating-linear-gradient(0deg,#22d3ee12 0 2px,transparent 2px 4px),radial-gradient(ellipse at center,transparent 50%,#03263acc);animation:alfFl .1s steps(2) infinite}
@keyframes alfFl{50%{opacity:.82}}
.alfTyping{color:#e0faff!important;-webkit-text-fill-color:#e0faff!important;text-shadow:-2px 0 #ff2d6faa,2px 0 #00fff0aa,0 0 8px #22d3ee,0 0 22px #0891b2,0 0 40px #0e7490!important}
body.alfZ{transition:transform .6s cubic-bezier(.7,0,.2,1)!important}`;document.head.appendChild(hcss);
const anim=new WeakSet();let hold=false,runId=0,hc,hx,hraf=0;
const H={x:0,y:0,w:0,h:0,tx:0,ty:0,tw:0,th:0,show:0,boot:0,sweep:-1,lab:'',src:'',dst:'',i:0,n:0,t0:0,hex:[],prog:0,sp:[],waves:[],laser:0,cx:0,cy:0};
let AC=null;function blip(f,d){try{AC=AC||new (window.AudioContext||webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.value=.025;g.gain.exponentialRampToValueAtTime(.0001,AC.currentTime+(d||.04));o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+(d||.04))}catch(e){}}
const sl=ms=>new Promise(r=>setTimeout(r,ms));
function hudOn(){hc=document.createElement('canvas');hc.id='alfHud';const sc=document.createElement('div');sc.id='alfScan';
 document.documentElement.append(sc,hc);hx=hc.getContext('2d');H.t0=performance.now();hraf=requestAnimationFrame(hud)} // a body-n KÍVÜL, hogy a zoom ne nagyítsa
function hudOff(){cancelAnimationFrame(hraf);['alfHud','alfScan'].forEach(i=>{const e=document.getElementById(i);e&&e.remove()});unzoom()}
function hud(t){hraf=requestAnimationFrame(hud);const W=innerWidth,Hh=innerHeight;if(hc.width!==W||hc.height!==Hh){hc.width=W;hc.height=Hh}const c=hx,T=(t-H.t0)/1000;c.clearRect(0,0,W,Hh);
 const C='#22d3ee',C2='#a5f3fc';c.strokeStyle=C;c.fillStyle=C;c.lineWidth=1.5;c.shadowColor=C;c.shadowBlur=10;c.font='600 12px Russo One,monospace';
 // sarok-adatfolyamok
 if(Math.random()<.3){H.hex.unshift(Array.from({length:4},()=>(Math.random()*65535|0).toString(16).toUpperCase().padStart(4,'0')).join(' '));H.hex.length=Math.min(H.hex.length,9)}
 c.globalAlpha=.7;H.hex.forEach((s,i)=>{c.fillText(s,16,Hh-20-i*14);c.fillText('◢ '+s.split('').reverse().join(''),W-150,90+i*14)});c.globalAlpha=1;
 c.fillText('А.Л.Ф.Р.Е.Д.О. // ЕЗИКОВ ПРОТОКОЛ v9.1   hu ▸ bg',16,24);c.fillText('ЦЕЛИ: '+H.i+'/'+H.n+'   СИСТЕМА: '+(H.boot<1?'ЗАРЕЖДАНЕ':'АКТИВНА'),16,40);
 // reaktor-boot középen
 if(H.boot<1.15){const a=Math.min(1,(1.15-H.boot)*4),cx=W/2,cy=Hh/2;c.globalAlpha=a;for(let r=0;r<5;r++){c.beginPath();c.setLineDash([8+r*6,6+r*3]);c.lineDashOffset=T*(r%2?60:-90)*(r+1);c.lineWidth=2+(r===0?4:0);c.arc(cx,cy,40+r*34*Math.min(1,H.boot*1.6+.2),0,6.283);c.stroke()}c.setLineDash([]);
  c.beginPath();c.lineWidth=6;c.arc(cx,cy,150,-1.57,-1.57+6.283*Math.min(1,H.boot));c.stroke();
  c.font='700 20px Russo One,monospace';c.textAlign='center';c.fillText('ИНИЦИАЛИЗИРАНЕ '+Math.min(100,H.boot*100|0)+'%',cx,cy+190);c.font='800 28px Russo One,monospace';c.fillStyle=C2;c.fillText('АЛФРЕДО',cx,cy+10);c.textAlign='left';c.globalAlpha=1;c.lineWidth=1.5;c.fillStyle=C;c.font='600 12px Russo One,monospace'}
 // pásztázó vonal
 if(H.sweep>=0&&H.sweep<=1.05){const y=H.sweep*Hh,g=c.createLinearGradient(0,y-80,0,y);g.addColorStop(0,'#22d3ee00');g.addColorStop(1,'#22d3ee55');c.fillStyle=g;c.fillRect(0,y-80,W,80);c.fillStyle=C;c.fillRect(0,y,W,2)}
 // drótváz-földgömb (jobb alsó sarok), HU → BG pulzáló ív
 {const R=62,gx=W-R-22,gy=Hh-R-22,rot=T*.6;c.globalAlpha=.8;c.beginPath();c.arc(gx,gy,R,0,6.283);c.stroke();c.globalAlpha=.35;
  for(let m=0;m<8;m++){const a=rot+m*Math.PI/8,ww=Math.abs(Math.cos(a))*R;c.beginPath();c.ellipse(gx,gy,ww,R,0,0,6.283);c.stroke()}
  for(let p=-2;p<=2;p++){const y=gy+p*R/3,ww=Math.sqrt(R*R-(p*R/3)**2);c.beginPath();c.ellipse(gx,y,ww,ww*.18,0,0,6.283);c.stroke()}
  const pr=(lo,la)=>{const l=lo*Math.PI/180+rot,f=la*Math.PI/180;return [gx+R*Math.cos(f)*Math.sin(l),gy-R*Math.sin(f),Math.cos(l)]};
  const A=pr(19,47),B=pr(25,42.7);c.globalAlpha=1;if(A[2]>0&&B[2]>0){c.strokeStyle='#fca5a5';c.beginPath();c.moveTo(A[0],A[1]);c.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2-26,B[0],B[1]);c.stroke();
   const q=(T*1.2)%1,qx=(1-q)*(1-q)*A[0]+2*(1-q)*q*(A[0]+B[0])/2+q*q*B[0],qy=(1-q)*(1-q)*A[1]+2*(1-q)*q*((A[1]+B[1])/2-26)+q*q*B[1];c.fillStyle='#fff';c.beginPath();c.arc(qx,qy,3,0,6.283);c.fill();c.strokeStyle=C;c.fillStyle=C}
  c.fillText('HU ▸ BG  ЛИНК',gx-38,gy-R-8)}
 // lézer a bal felső mini-reaktorból a kurzorig
 {const ox=34,oy=70;c.lineWidth=2;c.beginPath();c.arc(ox,oy,12,T*5,T*5+4.5);c.stroke();c.beginPath();c.arc(ox,oy,5,0,6.283);c.fill();
  if(H.laser&&H.cx){c.save();c.shadowBlur=25;c.strokeStyle='#e0faff';c.lineWidth=2+Math.random()*2;c.beginPath();c.moveTo(ox,oy);c.lineTo(H.cx,H.cy);c.stroke();c.strokeStyle=C;c.lineWidth=8;c.globalAlpha=.25;c.stroke();c.restore();
   c.beginPath();c.arc(H.cx,H.cy,6+Math.random()*5,0,6.283);c.fillStyle='#fff';c.fill();c.fillStyle=C}}
 for(let i=H.sp.length-1;i>=0;i--){const p=H.sp[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.35;p.l--;c.globalAlpha=p.l/24;c.fillRect(p.x,p.y,3,3);if(p.l<=0)H.sp.splice(i,1)}c.globalAlpha=1;
 for(let i=H.waves.length-1;i>=0;i--){const w=H.waves[i];w.t+=.025;c.globalAlpha=Math.max(0,1-w.t);c.lineWidth=4*(1-w.t)+1;c.beginPath();c.arc(w.x,w.y,w.t*420,0,6.283);c.stroke();c.beginPath();c.arc(w.x,w.y,w.t*260,0,6.283);c.stroke();if(w.t>=1)H.waves.splice(i,1)}c.globalAlpha=1;c.lineWidth=1.5;
 // célkereszt
 const k=.16;H.x+=(H.tx-H.x)*k;H.y+=(H.ty-H.y)*k;H.w+=(H.tw-H.w)*k;H.h+=(H.th-H.h)*k;
 if(H.show>.01){c.globalAlpha=H.show;const p=10,x=H.x-p,y=H.y-p,w=H.w+2*p,h=H.h+2*p,L=Math.min(22,w/3,h/2),mx=x+w/2,my=y+h/2;c.lineWidth=2.5;
  [[x,y,1,1],[x+w,y,-1,1],[x,y+h,1,-1],[x+w,y+h,-1,-1]].forEach(([a,b,s1,s2])=>{c.beginPath();c.moveTo(a+s1*L,b);c.lineTo(a,b);c.lineTo(a,b+s2*L);c.stroke()});
  c.lineWidth=1;const R=Math.hypot(w,h)/2+18;c.setLineDash([4,10]);c.lineDashOffset=-T*40;c.beginPath();c.arc(mx,my,R,0,6.283);c.stroke();c.setLineDash([30,20,4,20]);c.lineDashOffset=T*70;c.beginPath();c.arc(mx,my,R+10,0,6.283);c.stroke();c.setLineDash([]);
  c.globalAlpha=H.show*.5;c.beginPath();c.moveTo(0,my);c.lineTo(mx-R-14,my);c.moveTo(mx+R+14,my);c.lineTo(W,my);c.moveTo(mx,0);c.lineTo(mx,my-R-14);c.stroke();c.globalAlpha=H.show;
  const bx=Math.min(W-290,Math.max(10,x+w+R/2)),by=Math.max(60,Math.min(Hh-110,y-20));c.fillStyle='#03263add';c.fillRect(bx,by,280,96);c.strokeRect(bx,by,280,96);c.fillStyle=C;
  c.fillText('ОБЕКТ '+String(H.i).padStart(2,'0')+'/'+String(H.n).padStart(2,'0')+'  ◆  '+H.lab,bx+10,by+18);c.fillStyle='#fca5a5';c.fillText('HU: '+H.src.slice(0,38),bx+10,by+40);c.fillStyle=C2;c.fillText('BG: '+H.dst.slice(0,38),bx+10,by+60);
  c.fillStyle=C;c.fillRect(bx+10,by+74,260*Math.min(1,H.prog||0),8);c.strokeRect(bx+10,by+74,260,8);c.globalAlpha=1}}
function zoomTo(r){const b=document.body,br=b.getBoundingClientRect(),s=Math.max(1.15,Math.min(2.1,innerWidth*.45/Math.max(60,r.width)));b.classList.add('alfZ');
 b.style.transformOrigin=(r.left+r.width/2-br.left)+'px '+(r.top+r.height/2-br.top)+'px';b.style.transform='perspective(1400px) rotateX('+(Math.random()*3-1.5).toFixed(1)+'deg) rotateY('+(Math.random()*4-2).toFixed(1)+'deg) scale('+s.toFixed(2)+')'}
function unzoom(){const b=document.body;b.style.transform='';setTimeout(()=>{if(!b.style.transform){b.classList.remove('alfZ');b.style.transformOrigin=''}},650)}
async function need(k){if(look(k))return look(k);queue.add(k);pump();for(let i=0;i<30&&!look(k);i++)await sl(100);return look(k)||translit(k)}
const setv=(n,v)=>{mine.set(n,v);n.nodeValue=v};
const GL='АБВГДЖЗИЙКЛМНПРСТФХЦЧШЩЪЮЯ#%&@01▓▒░';const gl=m=>{let o='';for(let i=0;i<m;i++)o+=GL[Math.random()*GL.length|0];return o};
function caret(n){try{const g=document.createRange();g.setStart(n,Math.max(0,n.nodeValue.length-1));g.setEnd(n,n.nodeValue.length);const b=g.getBoundingClientRect();if(b.width||b.height){H.cx=b.right;H.cy=b.top+b.height/2;for(let i=0;i<6;i++)H.sp.push({x:H.cx,y:H.cy,vx:(Math.random()-.5)*7,vy:(Math.random()-.8)*6,l:24})}}catch(e){}}
function say2(t){try{const v=speechSynthesis.getVoices().find(v=>/^bg/i.test(v.lang));if(!v)return;const u=new SpeechSynthesisUtterance(t);u.voice=v;u.lang='bg-BG';u.rate=1.05;u.pitch=.8;speechSynthesis.speak(u)}catch(e){}}
function boom(){const f=document.getElementById('alfFl')||document.documentElement.appendChild(Object.assign(document.createElement('div'),{id:'alfFl'}));f.style.opacity=.55;setTimeout(()=>f.style.opacity=0,90);H.waves.push({x:H.x+H.w/2,y:H.y+H.h/2,t:0});
 const d=document.documentElement;let k=0;const sh=setInterval(()=>{d.style.transform=++k<9?'translate('+((Math.random()-.5)*14)+'px,'+((Math.random()-.5)*10)+'px)':'';if(k>=9)clearInterval(sh)},30)}
async function retype(n,fast,id){const o=orig.get(n);if(o==null||!n.isConnected)return;const k=o.trim(),t=await need(k),a=o.indexOf(k),pre=o.slice(0,a),post=o.slice(a+k.length);
 anim.add(n);const p=n.parentElement;p&&p.classList.add('alfTyping');let cur=k;const st=fast?Math.max(1,Math.ceil(k.length/12)):1;
 while(cur.length&&id===runId){cur=cur.slice(0,-st);setv(n,pre+cur+'▌'+post);if(!fast){H.laser=1;caret(n);blip(220+Math.random()*80,.03);H.prog=(1-cur.length/k.length)/2}await sl(fast?22:Math.max(14,320/k.length))}
 const ts=fast?Math.max(1,Math.ceil(t.length/14)):1;
 for(let i=0;i<=t.length&&id===runId;i+=ts){setv(n,pre+t.slice(0,i)+(i<t.length?gl(Math.min(fast?2:4,t.length-i))+'▌':'')+post);if(!fast){caret(n);blip(700+Math.random()*500,.025);H.prog=.5+i/t.length/2;H.dst=t.slice(0,i)}await sl(fast?24:Math.max(22,700/t.length))}
 anim.delete(n);if(id===runId)setv(n,pre+t+post);p&&setTimeout(()=>p.classList.remove('alfTyping'),fast?300:900)}
const vis=n=>{const p=n.parentElement;if(!p||!n.isConnected)return null;const r=p.getBoundingClientRect(),cs=getComputedStyle(p);if(r.width<4||r.height<4||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth||cs.visibility==='hidden'||+cs.opacity<.1)return null;return r};
async function cinematic(){const id=++runId;hold=true;hudOn();
 for(let i=0;i<=40&&id===runId;i++){H.boot=i/40;if(i%4===0)blip(300+i*20,.06);await sl(45)}H.boot=1.2;blip(1200,.25);
 for(let i=0;i<=30&&id===runId;i++){H.sweep=i/30;await sl(28)}H.sweep=-1;
 const L=[...orig.keys()].map(n=>({n,r:vis(n)})).filter(o=>o.r);
 const sz=o=>parseFloat(getComputedStyle(o.n.parentElement).fontSize)*o.r.width;
 const big=L.filter(o=>{const l=orig.get(o.n).trim().length;return l>2&&l<40}).sort((a,b)=>sz(b)-sz(a)).slice(0,6).sort((a,b)=>a.r.top-b.r.top||a.r.left-b.r.left);
 H.n=big.length;big.forEach(o=>queue.add(orig.get(o.n).trim()));pump();
 for(let i=0;i<big.length&&id===runId;i++){const {n}=big[i];if(!n.isConnected)continue;zoomTo(n.parentElement.getBoundingClientRect());await sl(650);const r=n.parentElement.getBoundingClientRect();
  if(i===0)Object.assign(H,{x:innerWidth/2,y:innerHeight/2,w:0,h:0});Object.assign(H,{i:i+1,tx:r.left,ty:r.top,tw:r.width,th:r.height,show:1,lab:'ПРЕВОД',src:orig.get(n).trim(),dst:'',prog:0});blip(900,.08);await sl(350);
  await retype(n,false,id);H.laser=0;H.lab='ГОТОВО ✔';blip(1500,.12);blip(90,.4);boom();say2(look(orig.get(n).trim())||'');await sl(350)}
 H.show=0;unzoom();await sl(500);
 // a többi: egyszerre, gyors gépeléssel végigfut az egész felületen
 const rest=L.filter(o=>!big.includes(o));H.n=rest.length;H.i=0;for(const n of orig.keys())queue.add(orig.get(n).trim());pump();
 await Promise.all(rest.map((o,i)=>sl(Math.min(i*25,2500)).then(()=>{H.i=i+1;if(i%6===0)blip(500+Math.random()*900,.02);return retype(o.n,true,id)})));
 if(id!==runId)return;hold=false;refresh();await sl(400);hudOff();fxOn()}

function toggle(quiet){on=!on;try{localStorage.setItem('k3alf',on?'1':'')}catch(e){}
 if(on){document.documentElement.lang='bg';document.documentElement.classList.add('alfBg');walk(document.body);obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')take(m.target);else m.addedNodes.forEach(walk)}if(queue.size)pump()});
  obs.observe(document.body,{childList:true,subtree:true,characterData:true});pump();if(quiet===true)fxOn();else cinematic();return '🇧🇬 АЛФРЕДО МОД включен! (/alfredomode = изключване)'}
 runId++;hold=false;document.documentElement.classList.remove('alfBg');document.documentElement.style.transform='';try{speechSynthesis.cancel()}catch(e){}obs&&obs.disconnect();obs=null;hudOff();fxOff();document.querySelectorAll('.alfTyping').forEach(e=>e.classList.remove('alfTyping'));restore();document.documentElement.lang='hu';return '🇭🇺 Alfredo mód kikapcsolva.'}
const prev=window.extraCmd;
window.extraCmd=function(c){if(/^alfredomode$/i.test(String(c).trim()))return toggle();return prev?prev.apply(this,arguments):null};
window._alf={H,toggle,TR,translit,get on(){return on}};
try{if(localStorage.getItem('k3alf'))setTimeout(()=>toggle(true),1500)}catch(e){}
})();
