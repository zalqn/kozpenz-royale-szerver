// ===== /alfredomode v5 – bolgár mód: filmszerű holo-show + teljes felület hu→bg (újra beírva kikapcsol) =====
// Fordítás: szótár + Google gtx (hu→bg), cache k3alfTr (számok nélküli kulcsok, max 1500); hiba/offline → cirill átírás (nem mentjük).
// Show 7/8-os „ruchenitsa” ütemre (2+2+3, nyolcad 0,17 s), kép és hang egy órából: mag-gyújtás → cím-dekódolás → pásztázás →
// célpontok (kamera-zoom, lézer) → kaszkád-hullám → tűzijáték + rózsaszirmok → a holo-mag a sarokba dokkol.
// Lobbyban teljes; meccsben/máshol rövid, zoom nélküli; prefers-reduced-motion: visszafogott. Dokkolva CSS-sprite embléma
// (a 3D mag előre renderelt képkockái): nincs RAF, WebGL, hang. Kikapcsoláskor minden leáll, a magyar szöveg visszaáll. Debug: _alf
(function(){
'use strict';
const D=document,DE=D.documentElement,RMQ=matchMedia('(prefers-reduced-motion: reduce)');
let on=false,hold=false,obs=null,prevLang='hu';
const rep=(s,a,b)=>{const i=s.indexOf(a);return i<0?s:s.slice(0,i)+b+s.slice(i+a.length)}; // String.replace a „$&”-t értelmezné

// ---------- FORDÍTÓ ----------
const LS='k3alfTr',MAXTR=1500;let TR={};try{TR=JSON.parse(localStorage.getItem(LS)||'{}')||{}}catch(e){}
const TMP=Object.create(null),FAIL=new Set(),SOLO=new Set();
const DICT={'Játék':'Игра','JÁTÉK':'ИГРА','Bolt':'Магазин','Kaszinó':'Казино','Beállítások':'Настройки','Közösség':'Общност','Haladás':'Напредък','Egyéb':'Други','Bezár':'Затвори','Bezárás':'Затваряне','Vissza':'Назад','Igen':'Да','Nem':'Не','Mentés':'Запази','Belépés':'Вход','Regisztráció':'Регистрация','Jelszó':'Парола','Név':'Име','Barátok':'Приятели','Ranglista':'Класация','Profil':'Профил','Küldetések':'Мисии','Fegyverek':'Оръжия','Kilépés':'Изход','Indítás':'Старт','Győzelem':'Победа','Vereség':'Загуба','Pénz':'Пари','Szint':'Ниво','Kutya':'Куче','Zene':'Музика','Hang':'Звук','Grafika':'Графика','Telefon':'Телефон','Térkép':'Карта','Chat':'Чат'};
const LAT={a:'а',á:'а',b:'б',c:'ц',d:'д',e:'е',é:'е',f:'ф',g:'г',h:'х',i:'и',í:'и',j:'й',k:'к',l:'л',m:'м',n:'н',o:'о',ó:'о',ö:'ьо',ő:'ьо',p:'п',q:'к',r:'р',s:'ш',t:'т',u:'у',ú:'у',ü:'ю',ű:'ю',v:'в',w:'в',x:'кс',y:'и',z:'з'};
const DIG={cs:'ч',sz:'с',zs:'ж',gy:'дж',ny:'н',ty:'т',ly:'й'};
const translit=t=>t.replace(/cs|sz|zs|gy|ny|ty|ly|[a-zőűáéíóöúü]/gi,m=>{const l=m.toLowerCase(),r=DIG[l]||LAT[l]||m;return m[0]===m[0].toUpperCase()&&m[0]!==m[0].toLowerCase()?r[0].toUpperCase()+r.slice(1):r});
const HAS=/[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]{2}/,NUM=/(\d[\d\s.,:×x%+\/-]*\d|\d)/; // számsorokat nem fordítunk → a számlálók nem szemetelik a cache-t
const one=k=>DICT[k]||TR[k]||TMP[k];
const keys=k=>/\d/.test(k)?k.split(NUM).filter((q,i)=>!(i%2)&&HAS.test(q)).map(q=>q.trim()):[k];
function look(o){const k=o.trim();if(!k)return o;const r=one(k);if(r)return rep(o,k,r);if(!/\d/.test(k))return null;
 const p=k.split(NUM);for(let i=0;i<p.length;i+=2){const q=p[i].trim();if(!q||!HAS.test(q))continue;const t=one(q);if(!t)return null;p[i]=rep(p[i],q,t)}return rep(o,k,p.join(''))}
const Q=new Set();let busy=false,pT=0,svT=0,back=0;
function want(o){for(const k of keys(o.trim()))if(k&&!one(k)&&!FAIL.has(k))Q.add(k);if(Q.size&&!pT&&!busy)pT=setTimeout(pump,60)}
async function pump(){pT=0;if(busy||!on||!Q.size)return;
 if(!navigator.onLine||Date.now()<back){for(const k of Q)TMP[k]=translit(k);Q.clear();refresh();return}
 const B=[];let len=0;
 for(const k of [...Q]){if(DICT[k]||TR[k]){Q.delete(k);continue}
  if(k.length>1500){TMP[k]=translit(k);Q.delete(k);continue} // shortcut: 1500 karakternél hosszabb szöveg csak átírást kap
  if(B.length&&(SOLO.has(k)||SOLO.has(B[0])||len+k.length>1500))break;B.push(k);len+=k.length+1}
 B.forEach(k=>Q.delete(k));if(!B.length)return;busy=true;
 try{const r=await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=hu&tl=bg&dt=t&q='+encodeURIComponent(B.join('\n')));if(!r.ok)throw new Error(r.status);
  const j=await r.json(),out=j[0].map(x=>x[0]).join('').split('\n');
  if(B.length===1)TR[B[0]]=out.join(' ').trim()||translit(B[0]);
  else if(out.length===B.length)B.forEach((k,i)=>{TR[k]=out[i].trim()||translit(k)});
  else B.forEach(k=>{SOLO.add(k);Q.add(k)}); // elcsúszott sorok → egyenként újra
  save()}
 catch(e){B.forEach(k=>{FAIL.add(k);TMP[k]=translit(k)});back=Date.now()+30000}
 busy=false;if(on){refresh();if(Q.size&&!pT)pT=setTimeout(pump,120)}}
function save(){clearTimeout(svT);svT=setTimeout(()=>{const ks=Object.keys(TR);if(ks.length>MAXTR)ks.slice(0,ks.length-Math.round(MAXTR*.85)).forEach(k=>delete TR[k]);
 try{localStorage.setItem(LS,JSON.stringify(TR))}catch(e){Object.keys(TR).slice(0,ks.length>>1).forEach(k=>delete TR[k]);try{localStorage.setItem(LS,JSON.stringify(TR))}catch(x){}}},1500)}
// szöveg-csomópontok: eredeti (WeakMap) + WeakRef-lista, hogy a lecsatolt, később visszatett elemek is visszaálljanak
const WR=window.WeakRef?n=>new WeakRef(n):n=>({deref:()=>n});
let OR=new WeakMap(),MINE=new WeakMap(),AOR=new WeakMap(),AMINE=new WeakMap(),regN=0;
const REFS=new Set(),AREFS=new Set(),AN=new Map(),AT=['placeholder','title'];
const SKT=/^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT|CODE|PRE)$/,SKE=/^(SCRIPT|STYLE|NOSCRIPT|svg|IFRAME|CODE|PRE)$/;
const setv=(n,v)=>{if(n.nodeValue!==v){MINE.set(n,v);n.nodeValue=v}};
function take(n){const p=n.parentNode;if(!p||SKT.test(p.nodeName))return;const v=n.nodeValue;if(MINE.get(n)===v)return;AN.delete(n);
 if(!HAS.test(v)||/\/alfredomode/i.test(v)){OR.delete(n);return}
 if(!OR.has(n)){REFS.add(WR(n));if(++regN>3000)prune()}OR.set(n,v);apply(n)}
function prune(){regN=0;for(const r of REFS){const n=r.deref();if(!n||!OR.has(n))REFS.delete(r)}for(const r of AREFS)if(!r.deref())AREFS.delete(r)}
function apply(n){const o=OR.get(n);if(o==null||AN.has(n))return;if(hold){want(o);return}const t=look(o);if(t!=null){setv(n,t);return}want(o);if(!navigator.onLine)setv(n,rep(o,o.trim(),translit(o.trim())))}
function attrs(el){let m=AOR.get(el),w=AMINE.get(el);for(const a of AT){const v=el.getAttribute(a);if(!v)continue;
 if(!m){AOR.set(el,m={});AMINE.set(el,w={});AREFS.add(WR(el))}const o=w[a]===v?m[a]:(m[a]=v);if(!HAS.test(o))continue;
 const t=hold?null:look(o);if(t==null){want(o);continue}if(t!==v){w[a]=t;el.setAttribute(a,t)}}}
function walk(root){if(!root)return;if(root.nodeType===3){take(root);return}if(root.nodeType!==1||SKE.test(root.nodeName))return;
 const w=D.createTreeWalker(root,5,{acceptNode:x=>x.nodeType===1&&SKE.test(x.nodeName)?2:1}),T=[],E=[];let x=root;
 do{if(x.nodeType===3)T.push(x);else if(x.hasAttribute('title')||x.hasAttribute('placeholder'))E.push(x)}while((x=w.nextNode()));T.forEach(take);E.forEach(attrs)}
function refresh(){for(const r of REFS){const n=r.deref();if(!n){REFS.delete(r);continue}if(n.isConnected)apply(n)}for(const r of AREFS){const el=r.deref();if(!el){AREFS.delete(r);continue}if(el.isConnected)attrs(el)}}
function restore(){for(const r of REFS){const n=r.deref();if(n&&OR.has(n)&&MINE.get(n)===n.nodeValue)n.nodeValue=OR.get(n)}
 for(const r of AREFS){const el=r.deref(),m=el&&AOR.get(el),w=el&&AMINE.get(el);if(m)for(const a in m)if(w[a]!=null&&el.getAttribute(a)===w[a])el.setAttribute(a,m[a])}
 REFS.clear();AREFS.clear();AN.clear();Q.clear();OR=new WeakMap();MINE=new WeakMap();AOR=new WeakMap();AMINE=new WeakMap()}
function observe(){obs=new MutationObserver(ms=>{if(!on)return;for(const m of ms){if(m.type==='characterData')take(m.target);else if(m.type==='attributes')attrs(m.target);else m.addedNodes.forEach(walk)}});
 obs.observe(D.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:AT})}

// ---------- SEGÉDEK, STÍLUS ----------
const clamp=(x,a,b)=>x<a?a:x>b?b:x,lerp=(a,b,t)=>a+(b-a)*t,eo=t=>1-Math.pow(1-clamp(t,0,1),3),eio=t=>(t=clamp(t,0,1))<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const mk=(tag,id,cls,par)=>{const e=D.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;(par||DE).appendChild(e);return e};
const GLY='АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЬЮЯ01',gl=m=>{let s='';for(let i=0;i<m;i++)s+=GLY[Math.random()*30|0];return s};
const CY='#22d3ee',CY2='#a5f3fc',FL=['#ffffff','#00966E','#D62612'],FLC=[[1,1,1],[0,.59,.43],[.84,.15,.07]]; // hivatalos BG zászlószínek
const lobbyOn=()=>!!D.querySelector('#lb.on'),pad2=n=>String(n).padStart(2,'0'),clip=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
let cssOk=false;
function css(){if(cssOk)return;cssOk=true;
 const l=mk('link',null,null,D.head);l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Exo+2:wght@300;600;800&family=Russo+One&display=swap';
 mk('style','alfCss',null,D.head).textContent=`
html.alfBg body *:not(input):not(textarea):not(i.fa){font-family:'Russo One',Rajdhani,Arial,sans-serif!important;letter-spacing:-.03em!important}
body.alfCam{will-change:transform;transform-origin:0 0}
.alfL{position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none}
#alfVig{z-index:2147482300;opacity:0;transition:opacity 1s ease;background:radial-gradient(ellipse 72% 66% at 50% 45%,rgba(2,10,18,.12),rgba(2,8,14,.88)),repeating-linear-gradient(0deg,rgba(103,232,249,.04) 0 1px,transparent 1px 3px)}
#alfVig.alfOn{opacity:1}#alfVig.alfLt.alfOn{opacity:.45}
#alfGL{z-index:2147482400;transition:opacity .5s ease}#alfHud{z-index:2147482500}
#alfTitle{position:fixed;left:50%;top:42%;z-index:2147482600;pointer-events:none;text-align:center;white-space:nowrap;opacity:0;filter:blur(14px);transform:translate(-50%,-50%) scale(1.08);transition:transform .9s cubic-bezier(.7,0,.2,1),opacity .6s ease,filter .6s ease}
#alfTitle.alfIn{opacity:1;filter:none;transform:translate(-50%,-50%)}
#alfTitle.alfHd{transform:translate(-50%,calc(-50% - 42vh + 62px)) scale(.34)}
#alfTitle.alfLt{top:27%}#alfTitle.alfLt.alfIn{transform:translate(-50%,-50%) scale(.62)}
#alfTitle.alfOut{opacity:0;filter:blur(10px);transform:translate(-50%,-62%) scale(.92)}#alfTitle.alfLt.alfOut{transform:translate(-50%,-62%) scale(.56)}#alfTitle.alfHide{opacity:0}
#alfTitle .alfK{font:300 clamp(10px,1.2vw,15px) 'Exo 2',sans-serif;letter-spacing:.6em;color:#cffafe;text-shadow:0 0 14px #22d3ee;margin-bottom:.9em}
#alfTitle .alfTt{font:400 clamp(46px,10vw,150px)/1.05 'Russo One',Impact,sans-serif;letter-spacing:.06em;padding:0 .12em;background:linear-gradient(180deg,#fff 0 37%,#00966E 37% 67%,#D62612 67%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 1px #fff) drop-shadow(0 0 22px rgba(34,211,238,.55)) drop-shadow(0 10px 28px rgba(0,0,0,.85))}
#alfTitle .alfTt b{display:inline-block;font-weight:400;text-align:center}
#alfTitle .alfTt b.alfX{-webkit-text-fill-color:#67e8f9;opacity:.8}
#alfTitle .alfS{display:block;margin-top:.7em;font:600 clamp(12px,1.55vw,22px) 'Exo 2',sans-serif;color:#fff;letter-spacing:1.5em;opacity:0;text-shadow:0 0 16px #22d3ee,0 2px 8px #000;transition:letter-spacing 1.2s cubic-bezier(.2,.9,.2,1),opacity .8s}
#alfTitle .alfS.alfIn{letter-spacing:.42em;opacity:1}
.alfF{display:inline-block;width:1.5em;height:1em;vertical-align:-.12em;margin:0 .7em;border-radius:2px;background:linear-gradient(#fff 0 33.4%,#00966E 0 66.7%,#D62612 0);box-shadow:0 0 12px rgba(255,255,255,.4)}
#alfDock{position:fixed;z-index:9;pointer-events:none;opacity:0;transform:scale(.55);transition:opacity .45s ease,transform .7s cubic-bezier(.2,1.5,.4,1),left .8s cubic-bezier(.7,0,.2,1),top .8s cubic-bezier(.7,0,.2,1)}
#alfDock.alfOn{opacity:1;transform:none}
#alfDock::before{content:'';position:absolute;inset:-24%;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.3),rgba(34,211,238,.09) 44%,transparent 68%);animation:alfBr 2.4s ease-in-out infinite alternate}
#alfDock i,#alfDock .alfSp{position:absolute;border-radius:50%}
#alfDock .alfR1{inset:0;background:conic-gradient(#fff 0 31%,transparent 0 33.3%,#00966E 0 64.6%,transparent 0 66.6%,#D62612 0 97.9%,transparent 0);-webkit-mask:radial-gradient(closest-side,transparent 87%,#000 89% 96%,transparent 98%);mask:radial-gradient(closest-side,transparent 87%,#000 89% 96%,transparent 98%);animation:alfRot 12s linear infinite}
#alfDock .alfR2{inset:-9%;border:1px dashed rgba(103,232,249,.5);animation:alfRot 20s linear infinite reverse}
#alfDock .alfSp{inset:9%;overflow:hidden}
#alfDock .alfSp canvas{position:absolute;left:0;top:0;height:100%;width:2400%;animation:alfSpr 2s steps(24) infinite}
#alfDock .alfLb{position:absolute;left:50%;top:100%;transform:translate(-50%,3px);font:800 9px 'Exo 2',sans-serif;letter-spacing:.32em;color:#cffafe;text-shadow:0 0 8px #22d3ee,0 1px 2px #000;white-space:nowrap}
@keyframes alfRot{to{transform:rotate(360deg)}}@keyframes alfSpr{to{transform:translateX(-100%)}}@keyframes alfBr{from{opacity:.55;transform:scale(.92)}to{opacity:1;transform:scale(1.06)}}
@media (prefers-reduced-motion:reduce){#alfDock *,#alfDock::before{animation:none!important}#alfTitle,#alfTitle .alfS{transition:opacity .6s!important;filter:none!important}}`}

// ---------- 3D HOLO-MAG (three.js r128) – egyedi shaderek, előszorzott „over” keverés: fényes = ragyog, sötét háttérre is ----------
const OUTA='gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));';
const VP=`attribute vec3 aC;attribute float aS,aR;uniform float uT,uPS,uG,uOp,uPulse,uK;varying vec3 vC;varying float vA;
void main(){vec3 p=position*mix(1.+4.*aR,1.,uG);vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;float sc=length(modelMatrix[0].xyz);
float tw=.7+.3*sin(uT*3.+aR*40.);gl_PointSize=max(1.3,aS*.01*sc*uPS/-mv.z)*tw*(1.+uPulse*.6);vC=aC;vA=uOp*uK*clamp(uG*1.4-.3*aR,0.,1.);}`;
const FP=`varying vec3 vC;varying float vA;void main(){vec2 d=gl_PointCoord-.5;float a=exp(-dot(d,d)*20.)*vA;if(a<.004)discard;vec3 c=vC*a;${OUTA}}`;
const VL=`uniform float uG;void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position*mix(2.4,1.,uG),1.);}`;
const FLN=`uniform vec3 uC;uniform float uOp,uK,uG,uPulse;void main(){vec3 c=uC*uOp*uK*uG*(1.+uPulse*.5);${OUTA}}`;
const VH=`varying vec2 vU;void main(){vU=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const FH=`varying vec2 vU;uniform vec3 uC;uniform float uOp,uG,uPulse;void main(){float r=dot(vU,vU)*4.;vec3 c=uC*(exp(-r*16.)*1.15+exp(-r*3.4)*.32)*(1.+uPulse*.9)*uOp*uG;${OUTA}}`;
const BLEND=T3=>({transparent:true,depthWrite:false,depthTest:false,blending:T3.CustomBlending,blendSrc:T3.OneFactor,blendDst:T3.OneMinusSrcAlphaFactor});
const mkU=()=>({uT:{value:0},uPS:{value:1000},uPR:{value:1},uG:{value:0},uOp:{value:1},uPulse:{value:0}});
const rnd=n=>Array.from({length:n},()=>Math.random()),rep3=(v,n)=>{const a=[];for(let i=0;i<n;i++)a.push(v[0],v[1],v[2]);return a};
function PT(T3,u,p,c,sz,rd,kU){const g=new T3.BufferGeometry();g.setAttribute('position',new T3.Float32BufferAttribute(p,3));g.setAttribute('aC',new T3.Float32BufferAttribute(c,3));g.setAttribute('aS',new T3.Float32BufferAttribute(sz,1));g.setAttribute('aR',new T3.Float32BufferAttribute(rd,1));
 const m=new T3.Points(g,new T3.ShaderMaterial(Object.assign({uniforms:{uT:u.uT,uPS:u.uPS,uG:u.uG,uOp:u.uOp,uPulse:u.uPulse,uK:kU||{value:1}},vertexShader:VP,fragmentShader:FP},BLEND(T3))));m.frustumCulled=false;return m}
function coreBuild(T3,u){const core=new T3.Group(),spin=new T3.Group(),inner=new T3.Group(),rings=new T3.Group();core.add(rings,spin);spin.add(inner);spin.rotation.x=.32;
 const ax=-Math.atan(1/1.6180339),ico=new T3.IcosahedronGeometry(1.25,1),ic2=new T3.IcosahedronGeometry(.62,0);ico.rotateZ(ax);ic2.rotateZ(ax); // csúcs-tengely = Y → 72°-onként azonos kép (hurkolható sprite)
 const LM=(col,k)=>new T3.ShaderMaterial(Object.assign({uniforms:{uC:{value:new T3.Color(col)},uK:{value:k},uG:u.uG,uOp:u.uOp,uPulse:u.uPulse},vertexShader:VL,fragmentShader:FLN},BLEND(T3)));
 const add=(p,o)=>{o.frustumCulled=false;p.add(o);return o};
 add(spin,new T3.LineSegments(new T3.EdgesGeometry(ico),LM(0x67e8f9,.85)));add(inner,new T3.LineSegments(new T3.EdgesGeometry(ic2),LM(0xffffff,1)));
 const pa=ico.attributes.position,seen=new Set(),nv=[];for(let i=0;i<pa.count;i++){const v=[pa.getX(i),pa.getY(i),pa.getZ(i)],k=v.map(x=>Math.round(x*1e3)).join();if(!seen.has(k)){seen.add(k);nv.push(...v)}}
 const nn=nv.length/3;add(spin,PT(T3,u,nv,rep3([.75,.97,1],nn),Array(nn).fill(9),rnd(nn)));
 [[1.72,[1,1,1],120,.5,1.25,.2],[2.02,[.1,.86,.56],140,-.38,1.05,1.1],[2.32,[1,.32,.22],160,.3,.85,2.3]].forEach(([R,col,n,sp,tx,ty])=>{
  const g=new T3.Group();g.rotation.set(tx,ty,0);const p=[];for(let i=0;i<n;i++){const a=i/n*6.2832;p.push(Math.cos(a)*R,Math.sin(a)*R,0)}
  const m=add(g,PT(T3,u,p,rep3(col,n),Array(n).fill(4.5),rnd(n)));m.rotation.z=Math.random()*6.28;g.userData={n,sp,k:2,z0:m.rotation.z};rings.add(g)});
 const N=1400,dp=[],dc=[],ds=[];for(let i=0;i<N;i++){const a=Math.random()*6.2832,rr=1.9+Math.pow(Math.random(),.8)*2.7,h=(Math.random()-.5)*.6*Math.max(0,1-(rr-1.9)/2.7),q=Math.random();
  dp.push(Math.cos(a)*rr,h,Math.sin(a)*rr);dc.push(...(q<.5?[.45,.9,1]:q<.7?[1,1,1]:q<.85?[.1,.86,.56]:[1,.32,.22]));ds.push(2+Math.random()*4)}
 const diskK={value:1},disk=add(core,PT(T3,u,dp,dc,ds,rnd(N),diskK));disk.rotation.x=.22;
 const halo=add(core,new T3.Mesh(new T3.PlaneGeometry(5.4,5.4),new T3.ShaderMaterial(Object.assign({uniforms:{uC:{value:new T3.Color(.7,.95,1)},uG:u.uG,uOp:u.uOp,uPulse:u.uPulse},vertexShader:VH,fragmentShader:FH},BLEND(T3)))));halo.renderOrder=-1;
 return {core,spin,inner,rings,disk,diskK}}
// hurok-póz (f∈[0,1)): minden mozgás periodikus → 24 képkockás varratmentes sprite
function poseLoop(c,u,f){const a=f*Math.PI*2;c.spin.rotation.y=a/5;c.inner.rotation.set(0,-2*a/5,0);c.rings.children.forEach(r=>{r.children[0].rotation.z=r.userData.z0+a*r.userData.k/r.userData.n});
 c.disk.visible=false;u.uT.value=a/3;u.uG.value=1;u.uOp.value=1;u.uPulse.value=.18+.18*Math.sin(a);c.core.position.set(0,0,0);c.core.scale.setScalar(1)}
const AT_Z=5.2,AT_R=AT_Z*Math.tan(20*Math.PI/180); // sprite-kamera: ekkora sugár fér a képkockába
function atlasSolo(css){const T3=window.THREE;if(!T3)return null;const fp=Math.round(css*Math.min(2,devicePixelRatio||1)),cv=D.createElement('canvas');cv.width=cv.height=fp;let r;
 try{r=new T3.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true})}catch(e){return null}
 try{r.setPixelRatio(1);r.setSize(fp,fp,false);r.setClearColor(0,0);const u=mkU(),c=coreBuild(T3,u),sc=new T3.Scene(),cam=new T3.PerspectiveCamera(40,1,.1,100);sc.add(c.core);cam.position.z=AT_Z;u.uPS.value=fp/(2*AT_R/AT_Z);
  const A=D.createElement('canvas');A.width=fp*24;A.height=fp;const x=A.getContext('2d');
  for(let f=0;f<24;f++){poseLoop(c,u,f/24);r.clear();r.render(sc,cam);x.drawImage(cv,f*fp,0)}sc.traverse(dispose);return A}
 catch(e){console.warn('alf atlas',e);return null}finally{r.dispose();r.forceContextLoss()}}
const dispose=o=>{o.geometry&&o.geometry.dispose();o.material&&o.material.dispose()};
// képernyő-réteg (ortho, px): cirill adateső (GPU-n számolva) + konfetti/szikra/rózsaszirom (zárt alakú fizika a shaderben)
const VR=`attribute vec3 aR;uniform float uT,uPR,uH,uFs,uI;varying float vA,vG,vH;
void main(){float j=position.y,L=uH+30.*uFs,hd=mod(aR.y+aR.x*uT,L)-2.*uFs;gl_Position=projectionMatrix*modelViewMatrix*vec4(position.x,hd-j*uFs,0.,1.);gl_PointSize=uFs*uPR;
vH=j<.5?1.:0.;vA=uI*(j<.5?1.:(1.-j/14.)*.55);vG=floor(fract(sin(aR.z*12.9898+floor(uT*(j<.5?11.:2.5)+aR.z)*78.233+j*37.719)*43758.5453)*32.);}`;
const FR=`uniform sampler2D uTex;varying float vA,vG,vH;void main(){if(vA<.01)discard;vec2 q=gl_PointCoord;vec2 uv=vec2((mod(vG,8.)+q.x)/8.,1.-(floor(vG/8.)+q.y)/4.);
float a=texture2D(uTex,uv).a*vA;if(a<.01)discard;vec3 c=mix(vec3(.13,.83,.93),vec3(.92,1.,1.),vH)*a;${OUTA}}`;
const VQ=`attribute vec3 aV,aL,aC;uniform float uT,uPR;varying vec3 vC;varying float vA,vR,vK;
void main(){float k=position.z,t=uT-aV.z;if(t<0.||t>aL.x){gl_Position=vec4(9.,9.,9.,1.);gl_PointSize=0.;return;}
float dr=k<.5?1.5:(k<1.5?2.4:1.2),gv=k<.5?300.:(k<1.5?160.:110.),e=exp(-dr*t);
vec2 p=position.xy+aV.xy*(1.-e)/dr+vec2(0.,gv)*(t-(1.-e)/dr)/dr;if(k>1.5)p.x+=sin(t*1.9+aL.y*9.)*26.;
gl_Position=projectionMatrix*modelViewMatrix*vec4(p,0.,1.);vA=(1.-smoothstep(aL.x*.65,aL.x,t))*smoothstep(0.,.05,t);
gl_PointSize=aL.z*uPR*((k>.5&&k<1.5)?1.-.5*t/aL.x:1.);vR=aL.y*t*6.+aL.y*20.;vK=k;vC=aC;}`;
const FQ=`varying vec3 vC;varying float vA,vR,vK;void main(){vec2 d=gl_PointCoord-.5;
if(vK>.5&&vK<1.5){float a=exp(-dot(d,d)*30.)*vA;vec3 c=vC*a*1.4;gl_FragColor=vec4(c,max(c.r,max(c.g,c.b))*.6);return;}
float cs=cos(vR),sn=sin(vR);vec2 q=vec2(cs*d.x-sn*d.y,sn*d.x+cs*d.y);
if(vK<.5){float h=.04+.2*abs(cos(vR*.7));if(abs(q.x)>.42||abs(q.y)>h)discard;gl_FragColor=vec4(vC*(.72+.28*cos(vR*.7))*vA,vA);return;}
float e=q.x*q.x/.16+q.y*q.y/.05;if(e>1.)discard;gl_FragColor=vec4(vC*(1.-.35*e)*vA,vA);}`;
function glBuild(s){const T3=window.THREE;if(!T3)return null;const cv=mk('canvas','alfGL','alfL');let r;
 try{r=new T3.WebGLRenderer({canvas:cv,alpha:true,antialias:false,powerPreference:'high-performance'})}catch(e){cv.remove();return null}
 const pr=Math.min(devicePixelRatio||1,1);/* lágy ragyogás: MSAA és hi-DPI felbontás nem kell, a kitöltés a drága */r.setPixelRatio(pr);r.setClearColor(0,0);r.autoClear=false;
 const u=mkU(),c=coreBuild(T3,u),g={T3,r,cv,pr,u,c,dead:false,N:3000,pi:0,dirty:false};u.uPR.value=pr;
 g.sc3=new T3.Scene();g.sc3.add(c.core);g.cam3=new T3.PerspectiveCamera(40,1,.1,100);g.cam3.position.z=10;g.camA=new T3.PerspectiveCamera(40,1,.1,100);g.camA.position.z=AT_Z;
 g.sc2=new T3.Scene();g.cam2=new T3.OrthographicCamera(0,1,0,1,-10,10);
 const gc=D.createElement('canvas');gc.width=256;gc.height=128;const tex=g.tex=new T3.CanvasTexture(gc);tex.minFilter=T3.LinearFilter;tex.generateMipmaps=false;
 const glyphs=()=>{const x=gc.getContext('2d');x.clearRect(0,0,256,128);x.fillStyle='#fff';x.font='26px "Russo One",monospace';x.textAlign='center';x.textBaseline='middle';for(let i=0;i<32;i++)x.fillText(GLY[i],(i%8)*32+16,(i>>3)*32+17);tex.needsUpdate=true};glyphs();
 try{D.fonts.load('26px "Russo One"','АЖЯ').then(()=>{if(!g.dead)glyphs()},()=>{})}catch(e){}
 const fs=s.small?13:16,cols=Math.ceil(s.W/fs)+1,rp=[],ra=[];for(let i=0;i<cols;i++){const sp=70+Math.random()*190,of=Math.random()*s.H*2,sd=Math.random()*100;for(let j=0;j<14;j++){rp.push(i*fs+fs/2,j,0);ra.push(sp,of,sd)}}
 const rg=new T3.BufferGeometry();rg.setAttribute('position',new T3.Float32BufferAttribute(rp,3));rg.setAttribute('aR',new T3.Float32BufferAttribute(ra,3));
 g.rainI={value:0};g.rainH={value:s.H};g.rain=new T3.Points(rg,new T3.ShaderMaterial(Object.assign({uniforms:{uT:u.uT,uPR:u.uPR,uH:g.rainH,uFs:{value:fs},uI:g.rainI,uTex:{value:tex}},vertexShader:VR,fragmentShader:FR},BLEND(T3))));g.rain.frustumCulled=false;g.sc2.add(g.rain);
 const N=g.N;g.pp=new Float32Array(N*3);g.pv=new Float32Array(N*3);g.pl=new Float32Array(N*3);g.pc=new Float32Array(N*3);for(let i=0;i<N;i++)g.pv[i*3+2]=-99;
 g.pg=new T3.BufferGeometry();[['position',g.pp],['aV',g.pv],['aL',g.pl],['aC',g.pc]].forEach(([n,a])=>g.pg.setAttribute(n,new T3.BufferAttribute(a,3).setUsage(T3.DynamicDrawUsage)));
 const parts=new T3.Points(g.pg,new T3.ShaderMaterial(Object.assign({uniforms:{uT:u.uT,uPR:u.uPR},vertexShader:VQ,fragmentShader:FQ},BLEND(T3))));parts.frustumCulled=false;g.sc2.add(parts);
 glSize(g,s.W,s.H);return g}
function glSize(g,W,H){g.r.setSize(W,H,false);g.W=W;g.H=H;g.cam3.aspect=W/H;g.cam3.updateProjectionMatrix();g.cam2.right=W;g.cam2.bottom=H;g.cam2.updateProjectionMatrix();g.rainH.value=H;
 g.k=2*10*Math.tan(20*Math.PI/180)/H; /* világ-egység / px a z=0 síkon */ g.sc0=Math.min(1,.5*W*g.k/2.5);g.u.uPR.value=g.pr;g.u.uPS.value=H*g.pr/(2*Math.tan(20*Math.PI/180))}
function glFree(g){g.dead=true;try{g.sc3.traverse(dispose);g.sc2.traverse(dispose);g.tex.dispose();g.r.dispose();g.r.forceContextLoss()}catch(e){}g.cv.remove()}
// egy sprite-képkocka a fő vászon sarkába, onnan 2D-be másolva (a főkép utána felülírja)
function atlasStep(g,f){const c=g.c,u=g.u,r=g.r,A=g.atl,fp=A.height,cs=(fp+.5)/g.pr;
 const sv=[c.spin.rotation.y,c.inner.rotation.clone(),c.rings.children.map(x=>x.children[0].rotation.z),u.uT.value,u.uG.value,u.uOp.value,u.uPulse.value,c.core.position.clone(),c.core.scale.x,u.uPS.value];
 poseLoop(c,u,f/24);u.uPS.value=fp/(2*AT_R/AT_Z);r.setViewport(0,0,cs,cs);r.setScissor(0,0,cs,cs);r.setScissorTest(true);r.clear();r.render(g.sc3,g.camA);r.setScissorTest(false);
 A.getContext('2d').drawImage(g.cv,0,g.cv.height-fp,fp,fp,f*fp,0,fp,fp);
 c.spin.rotation.y=sv[0];c.inner.rotation.copy(sv[1]);c.rings.children.forEach((x,i)=>x.children[0].rotation.z=sv[2][i]);u.uT.value=sv[3];u.uG.value=sv[4];u.uOp.value=sv[5];u.uPulse.value=sv[6];c.core.position.copy(sv[7]);c.core.scale.setScalar(sv[8]);u.uPS.value=sv[9];c.disk.visible=true}
function spawn(s,x,y,vx,vy,k,life,spin,size,col){const g=s.gl;if(!g)return;const i=g.pi*3;g.pi=(g.pi+1)%g.N;
 g.pp[i]=x;g.pp[i+1]=y;g.pp[i+2]=k;g.pv[i]=vx;g.pv[i+1]=vy;g.pv[i+2]=s.T;g.pl[i]=life;g.pl[i+1]=spin;g.pl[i+2]=size;g.pc[i]=col[0];g.pc[i+1]=col[1];g.pc[i+2]=col[2];g.dirty=true;if(s.T+life>s.pEnd)s.pEnd=s.T+life}
function spark(s,x,y,n,v,col){if(!s.gl||s.rm)return;for(let i=0;i<n;i++){const a=Math.random()*6.283,w=v*(.35+Math.random()*.65);spawn(s,x,y,Math.cos(a)*w,Math.sin(a)*w-v*.2,1,.35+Math.random()*.45,0,4+Math.random()*4,col||(i%3?[.55,.93,1]:[1,1,1]))}}
function burst(s,x,y){const C=[[1,1,1],[.1,.86,.56],[1,.32,.22],[1,.84,.42]],a0=C[Math.random()*4|0],a1=C[Math.random()*4|0],n=s.mode==='full'?110:70;
 for(let i=0;i<n;i++){const a=Math.random()*6.283,v=(i%2?300:190)+Math.random()*260;spawn(s,x,y,Math.cos(a)*v,Math.sin(a)*v,1,1.1+Math.random()*.7,0,6+Math.random()*5,i%3?a0:a1)}
 spawn(s,x,y,0,0,1,.3,0,96,[1,1,1]);s.waves.push({x,y,t:s.T,R:150});s.fl=Math.max(s.fl,.05);sfx(s,'pop')}
function cannons(s){const k=s.H/800,n=s.mode==='full'?210:110;for(const side of [0,1])for(let i=0;i<n;i++)
 spawn(s,side?s.W+8:-8,s.H+8,(side?-1:1)*(380+Math.random()*820)*k,-(900+Math.random()*900)*k,0,4.2+Math.random()*2,(Math.random()-.5)*5,9+Math.random()*7,FLC[i%3])}
const ROSE=[[.96,.25,.37],[.98,.44,.52],[.88,.11,.28],[.99,.64,.69]];

// ---------- HANG: 7/8 ruchenitsa, előre ütemezve az AudioContext órájára ----------
const E=.17,BAR=7*E,mf=m=>440*Math.pow(2,(m-69)/12);
const MEL=[69,70,69,67,66,67,69, 70,69,67,66,63,66,62, 74,72,70,69,70,72,74, 72,70,69,67,66,63,62]; // D frígiai domináns (balkáni skála)
function audioStart(s){let ac;try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
 const A={ac,s,c0:ac.currentTime+.1,st:0,iv:0,dead:false};
 try{if(ac.state==='suspended')ac.resume().catch(()=>{});
  const cp=ac.createDynamicsCompressor();cp.threshold.value=-16;cp.knee.value=10;cp.ratio.value=3.5;cp.connect(ac.destination);A.cp=cp;
  const out=A.out=ac.createGain();out.gain.value=s.rm?.32:.5;out.connect(cp);
  const L=Math.round(ac.sampleRate*1.7),ir=ac.createBuffer(2,L,ac.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3.2)}
  A.rev=ac.createConvolver();A.rev.buffer=ir;const rg=ac.createGain();rg.gain.value=.3;A.rev.connect(rg);rg.connect(out);
  A.nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const nd=A.nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  const P=s.P,c0=A.c0,tI=c0+P.ign*BAR,tE=c0+P.end*BAR;
  // gajda-szerű bordó-drón (D + A), szűrő nyílik a gyújtásig
  const dg=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(170,c0);lp.frequency.exponentialRampToValueAtTime(900,tI);
  dg.gain.setValueAtTime(.0001,c0);dg.gain.exponentialRampToValueAtTime(.15,tI);dg.gain.setValueAtTime(.15,tE);dg.gain.exponentialRampToValueAtTime(.0001,tE+2.2);
  [[73.42,'sawtooth',.33],[73.9,'sawtooth',.33],[110,'sawtooth',.28],[146.83,'triangle',.25]].forEach(([f,ty,v])=>{const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(lp);o.start(c0);o.stop(tE+2.3)});
  lp.connect(dg);dg.connect(out);
  if(!s.rm){const ns=ac.createBufferSource(),bp=ac.createBiquadFilter(),ng=ac.createGain();ns.buffer=A.nb;ns.loop=true;bp.type='bandpass';bp.Q.value=1.4;bp.frequency.setValueAtTime(300,c0);bp.frequency.exponentialRampToValueAtTime(5200,tI);
   ng.gain.setValueAtTime(.0001,c0);ng.gain.exponentialRampToValueAtTime(.13,tI-.03);ng.gain.linearRampToValueAtTime(0,tI);ns.connect(bp);bp.connect(ng);ng.connect(out);ns.start(c0);ns.stop(tI+.05)}
  A.iv=setInterval(()=>sched(A),35);sched(A)}catch(e){console.warn('alf audio',e)}
 return A}
function audioStop(A){if(!A||A.dead)return;A.dead=true;clearInterval(A.iv);const ac=A.ac;
 try{const t=ac.currentTime,g=A.out.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+.25)}catch(e){}setTimeout(()=>{try{ac.close()}catch(e){}},400)}
function sched(A){if(A.dead)return;const ac=A.ac,last=Math.round(A.s.P.land*7);
 while(A.st<=last){const t=A.c0+A.st*E;if(t>ac.currentTime+.2)return;if(t>ac.currentTime-.05)try{play(A,A.st,t)}catch(e){if(!A.err){A.err=1;console.warn('alf zene',e)}}A.st++}clearInterval(A.iv)}
function tone(A,t,f,d,v,ty,send,cut){const ac=A.ac,o=ac.createOscillator(),g=ac.createGain();o.type=ty||'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 let n=o;if(cut){const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(cut,t);lp.frequency.exponentialRampToValueAtTime(Math.max(90,cut*.2),t+d);o.connect(lp);n=lp}
 n.connect(g);g.connect(A.out);if(send)g.connect(send);o.start(t);o.stop(t+d+.03)}
function noise(A,t,d,v,ty,f,q){const ac=A.ac,s=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();s.buffer=A.nb;s.loop=d>.5;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(g);g.connect(A.out);s.start(t,Math.random()*.4);s.stop(t+d+.03)}
function kick(A,t,v){const ac=A.ac,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(43,t+.12);g.gain.setValueAtTime(v*.95,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g);g.connect(A.out);o.start(t);o.stop(t+.32)}
function boom(A,t,big){kick(A,t,1.1);noise(A,t,big?2.2:1.5,.4,'highpass',2600,.5);const ac=A.ac,o=ac.createOscillator(),g=ac.createGain();o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(30,t+1);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);o.connect(g);g.connect(A.out);o.start(t);o.stop(t+1.15)}
function lead(A,t,f,d){const ac=A.ac,g=ac.createGain(),lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(3800,t);lp.frequency.exponentialRampToValueAtTime(1200,t+d);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.085,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 for(const [ty,df,v] of [['square',0,.55],['triangle',7,1],['sawtooth',-6,.32]]){const o=ac.createOscillator(),og=ac.createGain();o.type=ty;o.frequency.value=f;o.detune.value=df;og.gain.value=v;o.connect(og);og.connect(lp);o.start(t);o.stop(t+d+.03)}
 lp.connect(g);g.connect(A.out);g.connect(A.rev)}
function chord(A,t){const ac=A.ac;[50,57,62,66,69,74].forEach((m,i)=>{const o=ac.createOscillator(),g=ac.createGain(),lp=ac.createBiquadFilter();o.type='sawtooth';o.frequency.value=mf(m);o.detune.value=i%2?6:-6;lp.type='lowpass';lp.frequency.setValueAtTime(2600,t);lp.frequency.exponentialRampToValueAtTime(500,t+3.2);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+3.4);o.connect(lp);lp.connect(g);g.connect(A.out);g.connect(A.rev);o.start(t);o.stop(t+3.5)});boom(A,t,true)}
function play(A,st,t){const s=A.s,P=s.P,pos=st%7,ign=Math.round(P.ign*7),end=Math.round(P.end*7),fin=P.fin>=0?Math.round(P.fin*7):-9;
 if(st===Math.round(P.land*7)){[[1174.66,.09],[2349.3,.04],[3520,.025]].forEach(([f,v])=>tone(A,t,f,1.8,v,'sine',A.rev));return} // dokkolás: csengő
 if(st>end)return;if(st===end){chord(A,t);return}
 if(st<ign){if(!s.rm&&pos!==1&&pos!==3&&pos!==5)tone(A,t,380*Math.pow(2,st/ign*1.6),.06,.045,'square',null,2600);return} // boot-tikk
 if(st===ign||st===fin)boom(A,t,st===fin);
 if(P.scan>=0&&st===Math.round(P.scan*7)){const ac=A.ac,sr=ac.createBufferSource(),fl=ac.createBiquadFilter(),g=ac.createGain();sr.buffer=A.nb;sr.loop=true;fl.type='bandpass';fl.Q.value=2;fl.frequency.setValueAtTime(400,t);fl.frequency.exponentialRampToValueAtTime(6000,t+BAR);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.14,t+BAR*.7);g.gain.exponentialRampToValueAtTime(.0001,t+BAR);sr.connect(fl);fl.connect(g);g.connect(A.out);sr.start(t);sr.stop(t+BAR+.05)}
 if(st>ign&&st<=ign+7&&!s.rm)tone(A,t,1046.5*Math.pow(2,(st-ign)/12),.09,.05,'square',A.rev,4000); // cím-betűk zárása
 const acc=pos===0?1:pos===2||pos===4?.7:.4;
 if(!s.rm){if(pos===0||pos===4)kick(A,t,pos?.75:1);if(pos===2)noise(A,t,.14,.28,'bandpass',1800,.8);noise(A,t,.04,.085*acc,'highpass',8000,.7)}
 const root=[38,38,43,45][Math.floor((st-ign)/7)&3];
 if(pos===0||pos===2||pos===4)tone(A,t,mf(pos===2?root+12:pos===4?root+7:root),pos===4?.4:.25,.2,'sawtooth',null,1100);
 const ms=Math.round((P.n?P.tg:P.casc)*7);if(st>=ms&&!s.rm){const m=MEL[(st-ms)%28];lead(A,t,mf(m+(fin>0&&st>=fin?12:0)),pos===4||pos===6?.3:.2)}}
function sfx(s,k){const A=s.a;if(!A||A.dead)return;const t=A.ac.currentTime+.005;
 try{if(k==='type')tone(A,t,1700+Math.random()*900,.035,.035,'square',null,5000);else if(k==='del')tone(A,t,380+Math.random()*60,.04,.05,'triangle');
 else if(k==='tag')tone(A,t,2400+Math.random()*1200,.02,.015,'sine');else if(k==='lock'){tone(A,t,880,.12,.06,'square',null,3000);tone(A,t+.06,1320,.16,.05,'square',null,3000)}
 else if(k==='done'){tone(A,t,1567.98,.4,.06,'sine',A.rev);tone(A,t,2349.3,.5,.035,'sine',A.rev)}
 else if(k==='pop'){noise(A,t,.5,.32,'bandpass',900,.7);for(let i=0;i<6;i++)noise(A,t+.08+Math.random()*.45,.04,.1,'highpass',4000+Math.random()*3000,.7)}}catch(e){if(!A.err){A.err=1;console.warn('alf sfx',e)}}}
function speak(t){try{const ss=speechSynthesis;if(!t||ss.speaking)return;const v=ss.getVoices().find(v=>/^bg/i.test(v.lang));if(!v)return;const u=new SpeechSynthesisUtterance(t);u.voice=v;u.lang=v.lang;u.rate=1;u.pitch=.95;ss.speak(u)}catch(e){}}

// ---------- SHOW ----------
let S=null;
function visNodes(){const out=[],W=innerWidth,H=innerHeight;for(const r of REFS){const n=r.deref();if(!n||!n.isConnected||!OR.has(n))continue;const p=n.parentElement;if(!p)continue;const q=p.getBoundingClientRect();
 if(q.width<4||q.height<4||q.bottom<0||q.top>H||q.right<0||q.left>W)continue;out.push({n,p,q})}return out}
function tgPick(n){const V=visNodes().filter(v=>{const k=OR.get(v.n).trim();if(k.length<3||k.length>38||v.p.closest('#gChat'))return false;const cs=getComputedStyle(v.p);v.fs=parseFloat(cs.fontSize)||12;return cs.visibility!=='hidden'&&+cs.opacity>.2});
 V.forEach(v=>v.sc=v.fs*v.fs*Math.min(v.q.width,400));V.sort((a,b)=>b.sc-a.sc);const out=[];
 for(const v of V){if(out.length>=n)break;if(out.some(o=>o.p===v.p||Math.abs(o.q.top-v.q.top)<50&&Math.abs(o.q.left-v.q.left)<180))continue;out.push(v)}
 return out.sort((a,b)=>a.q.top-b.q.top||a.q.left-b.q.left)}
function startShow(){
 const W=innerWidth,H=innerHeight,small=W<700||H<500,rm=RMQ.matches,mode=rm?'rm':lobbyOn()?'full':'lite';
 const targets=mode==='full'?tgPick(small?3:4):[],n=targets.length;
 const P=mode==='full'?{ign:2,scan:4,tg:5,n,casc:5+2*n,fin:7+2*n,end:9+2*n}:mode==='lite'?{ign:1,scan:-1,tg:-1,n:0,casc:2,fin:4,end:5.5}:{ign:.5,scan:-1,tg:-1,n:0,casc:1.4,fin:-1,end:3};
 P.land=P.end+(rm?.3:1);
 const s=S={mode,P,W,H,small,rm,targets,dead:false,T:0,ci:0,raf:0,tx:-1,cam:{x:0,y:0,s:1,a:null},shk:0,fl:0,waves:[],tags:[],scan:[],tagT:0,tgt:null,cc:null,rk:[],pet:0,pEnd:0,caret:null,ret:null,dockP:null,atF:-1,cx:W/2,cy:H*.42,cr:100,endAt:0,lastCam:''};
 s.dpr=Math.min(2,devicePixelRatio||1);s.vig=mk('div','alfVig','alfL'+(mode==='lite'?' alfLt':''));s.hud=mk('canvas','alfHud','alfL');s.hx=s.hud.getContext('2d');hudSize(s);
 s.gl=glBuild(s);s.ti=titleBuild(s);s.a=audioStart(s);
 const ac=s.a&&s.a.ac;s.p0=performance.now()+(ac?(s.a.c0-ac.currentTime+(ac.outputLatency||ac.baseLatency||0))*1000:60);
 s.cues=cueList(s);addEventListener('resize',onResize);if(mode==='full')D.body.classList.add('alfCam');
 s.vig.offsetWidth;s.vig.classList.add('alfOn');s.raf=requestAnimationFrame(tick)}
function cueList(s){const P=s.P,C=[],at=(b,f)=>C.push([b,f]);
 at(P.ign,()=>{titleIn(s);if(!s.rm)hit(s,1)});at(P.ign+1,()=>s.ti.s.classList.add('alfIn'));
 if(P.scan>=0)at(P.scan,()=>{s.ti.el.classList.add(s.small?'alfHide':'alfHd');s.scan=visNodes().slice(0,320)});
 for(let i=0;i<P.n;i++)at(P.tg+2*i,()=>tgStart(s,i));
 if(P.n)at(P.casc-.45,()=>camGo(s,0,0,1,.42*BAR));
 at(P.casc,()=>{DE.classList.add('alfBg');if(s.mode==='full')s.ti.el.classList.add('alfHide');if(s.rm){hold=false;refresh()}else cascStart(s)});
 at(P.casc+(s.rm?.1:1.8),()=>{hold=false;refresh()});
 if(P.fin>=0)at(P.fin,()=>finale(s));
 at(P.fin>=0?P.fin+.1:P.casc+.3,()=>{s.atF=0;s.dockP=slot()});
 at(P.end,()=>{s.ti.el.classList.add('alfOut');s.vig.classList.remove('alfOn')});
 at(P.land,()=>land(s));
 return C.sort((a,b)=>a[0]-b[0])}
function tick(now){const s=S;if(!s||s.dead)return;s.raf=requestAnimationFrame(tick);
 const T=Math.max(0,(now-s.p0)/1000),dt=clamp(T-s.T,0,.05),b=T/BAR;s.T=T;s.fc=(s.fc||0)+1;
 if(!s.q&&T>1.2){s.q=s.fc/T;if(s.q<30&&s.gl&&s.gl.pr>.7){s.gl.pr=.7;s.gl.r.setPixelRatio(.7);glSize(s.gl,s.W,s.H)}}
 while(s.ci<s.cues.length&&b>=s.cues[s.ci][0])s.cues[s.ci++][1]();
 camera(s);titleFrame(s,T,b);tgText(s,T,b);if(T-s.tx>=.05){s.tx=T;if(s.cc)ccText(s,T)}
 hud(s,T,b,dt);glFrame(s,T,b,dt);if(s.endAt&&T>=s.endAt)cleanup(s)}
function onResize(){const s=S;if(!s)return;s.W=innerWidth;s.H=innerHeight;s.small=s.W<700||s.H<500;hudSize(s);if(s.gl)glSize(s.gl,s.W,s.H)}
function hudSize(s){s.hud.width=Math.round(s.W*s.dpr);s.hud.height=Math.round(s.H*s.dpr)}
function cleanup(s){if(!s||s.dead)return;s.dead=true;cancelAnimationFrame(s.raf);audioStop(s.a);removeEventListener('resize',onResize);
 if(s.gl)glFree(s.gl);[s.vig,s.hud,s.ti&&s.ti.el].forEach(e=>e&&e.remove());const b=D.body;b.style.transform='';b.classList.remove('alfCam');
 if(s.tgt)AN.delete(s.tgt.n);if(s.cc)s.cc.L.forEach(x=>{if(AN.get(x.n)===x.tok)AN.delete(x.n)});try{speechSynthesis.cancel()}catch(e){}
 if(S===s)S=null;if(on){hold=false;DE.classList.add('alfBg');refresh()}}
// --- kamera: a body eltolása+nagyítása (szélek sosem látszanak), rázás ---
function camGo(s,x,y,z,d){const c=s.cam;c.a={x0:c.x,y0:c.y,s0:c.s,x1:x,y1:y,s1:z,t0:s.T,d}}
function camera(s){if(s.mode!=='full')return;const c=s.cam;if(c.a){const p=eio((s.T-c.a.t0)/c.a.d);c.x=lerp(c.a.x0,c.a.x1,p);c.y=lerp(c.a.y0,c.a.y1,p);c.s=lerp(c.a.s0,c.a.s1,p);if(p>=1)c.a=null}
 s.shk*=.86;const sh=s.shk>.3,sx=sh?(Math.random()-.5)*s.shk:0,sy=sh?(Math.random()-.5)*s.shk*.7:0,z=c.s+(sh?s.shk*.0015:0);
 const v=(z!==1||c.x||c.y||sh)?`translate3d(${(c.x+sx-(z-c.s)*s.W/2).toFixed(1)}px,${(c.y+sy-(z-c.s)*s.H/2).toFixed(1)}px,0) scale(${z.toFixed(4)})`:'';
 if(v!==s.lastCam){s.lastCam=v;D.body.style.transform=v}}
function hit(s,k){s.fl=Math.max(s.fl,(s.mode==='full'?.42:.16)*k);if(s.mode==='full')s.shk=Math.max(s.shk,15*k);if(s.gl)s.gl.u.uPulse.value=1;s.waves.push({x:s.cx,y:s.cy,t:s.T,R:Math.hypot(s.W,s.H)*.55})}
// --- cím ---
function titleBuild(s){const el=mk('div','alfTitle',s.mode==='lite'?'alfLt':'');el.innerHTML='<div class="alfK">ЕЗИКОВ ПРОТОКОЛ <span class="alfF"></span> HU ▸ BG</div><div class="alfTt"></div><div class="alfS"><i class="alfF"></i>МОД<i class="alfF"></i></div>';
 const L=[...'АЛФРЕДО'].map(ch=>{const b=mk('b',null,null,el.children[1]);b.textContent=ch;return {el:b,ch,lk:s.rm}});return {el,s:el.children[2],L,on:false,ts:0}}
function titleIn(s){const ti=s.ti;ti.on=true;ti.L.forEach(x=>{x.el.style.width=x.el.offsetWidth+'px'});if(!s.rm)ti.L.forEach(x=>{x.el.className='alfX';x.el.textContent=gl(1)});ti.el.classList.add('alfIn')}
function titleFrame(s,T,b){const ti=s.ti;if(!ti.on)return;const scr=T-ti.ts>.045;if(scr)ti.ts=T;
 ti.L.forEach((x,i)=>{if(x.lk)return;if(b>=s.P.ign+(i+1)/7){x.lk=1;x.el.className='';x.el.textContent=x.ch;const r=x.el.getBoundingClientRect();spark(s,r.left+r.width/2,r.top+r.height/2,14,260)}else if(scr)x.el.textContent=gl(1)})}
// --- célpontok: zoom, zárolás, törlés, bolgár begépelés lézerrel ---
function tgStart(s,i){const v=s.targets[i];if(!v||!v.n.isConnected||!OR.has(v.n))return;const c=s.cam,r=v.p.getBoundingClientRect();
 const lx=(r.left-c.x)/c.s,ly=(r.top-c.y)/c.s,lw=r.width/c.s,lh=r.height/c.s,z=clamp(s.W*.3/Math.max(40,lw),1.25,s.small?1.6:1.85);
 camGo(s,clamp(s.W*.5-z*(lx+lw/2),s.W*(1-z),0),clamp(s.H*.46-z*(ly+lh/2),s.H*(1-z),0),z,.42*BAR);
 const o=OR.get(v.n),k=o.trim(),a=o.indexOf(k),tok={};if(s.tgt)AN.delete(s.tgt.n);
 s.tgt={i,n:v.n,p:v.p,k,pre:o.slice(0,a),post:o.slice(a+k.length),t0:s.P.tg+2*i,tok,lab:'ПРИЦЕЛВАНЕ',dst:'',prog:0,tr:null,lt:0};AN.set(v.n,tok);want(o)}
function caretAt(s,n,i){try{const r=D.createRange();r.setStart(n,i);r.setEnd(n,i+1);const q=r.getBoundingClientRect();if(q.width||q.height)s.caret={x:q.left+q.width/2,y:q.top+q.height/2}}catch(e){}}
function tgText(s,T,b){const t=s.tgt;if(!t||t.end)return;const n=t.n,e=(b-t.t0)*7;
 if(AN.get(n)!==t.tok||!n.isConnected){t.end=1;t.las=0;t.lab='ПРОПУСНАТ';return}
 if(e>=2&&!t.lk){t.lk=1;t.lab='ЗАКЛЮЧЕН';sfx(s,'lock');const q=t.p.getBoundingClientRect();s.waves.push({x:q.left+q.width/2,y:q.top+q.height/2,t:T,R:90})}
 if(!t.tr)t.tr=look(t.k);let v=null;
 if(e>=3&&e<6){t.las=1;t.lab='ИЗТРИВАНЕ';const rem=Math.max(0,Math.round(t.k.length*(1-(e-3)/2.6)));if(rem!==t.rem){if(t.rem!=null)sfx(s,'del');t.rem=rem;v=t.k.slice(0,rem)+'▌';t.prog=(1-rem/t.k.length)*.5}}
 else if(e>=6&&e<11){t.las=1;t.lab='ПРЕВОД';const tr=t.tr||(e>=9?(t.tr=translit(t.k)):null);
  if(tr){const sh=Math.min(tr.length,Math.floor(tr.length*(e-6)/4.2));if(sh!==t.sh||T-t.lt>.05){t.lt=T;if(sh!==t.sh){t.sh=sh;sfx(s,'type');if(s.caret)spark(s,s.caret.x,s.caret.y,5,220)}v=tr.slice(0,sh)+gl(Math.min(2,tr.length-sh))+'▌';t.dst=tr.slice(0,sh);t.prog=.5+.5*sh/tr.length}}
  else if(T-t.lt>.05){t.lt=T;v=gl(3)+'▌'}}
 else if(e>=11){t.end=1;t.las=0;const tr=t.tr||translit(t.k);AN.delete(n);setv(n,t.pre+tr+t.post);t.dst=tr;t.prog=1;t.lab='ГОТОВО ✔';sfx(s,'done');speak(tr);
  const q=t.p.getBoundingClientRect(),x=q.left+q.width/2,y=q.top+q.height/2;s.waves.push({x,y,t:T,R:170});spark(s,x,y,26,420);return}
 if(v!=null){setv(n,t.pre+v+t.post);caretAt(s,n,(t.pre+v).length-1)}}
// --- kaszkád: a magból induló hullám mentén minden látható szöveg dekódolódik ---
function cascStart(s){const L=[];let md=1;
 for(const v of visNodes()){if(AN.has(v.n))continue;const o=OR.get(v.n),k=o.trim();if(!k)continue;const q=v.q,dx=Math.max(q.left-s.cx,0,s.cx-q.right),dy=Math.max(q.top-s.cy,0,s.cy-q.bottom),d=Math.hypot(dx,dy),a=o.indexOf(k);
  L.push({n:v.n,k,pre:o.slice(0,a),post:o.slice(a+k.length),d,px:clamp(s.cx,q.left,q.right),py:clamp(s.cy,q.top,q.bottom),tok:{}});if(d>md)md=d}
 L.sort((a,b)=>a.d-b.d);L.length=Math.min(L.length,450);
 L.forEach(x=>{x.st=s.T+x.d/md*BAR;x.du=(.36+Math.random()*.2)*BAR;AN.set(x.n,x.tok)});s.cc={L,md,cx:s.cx,cy:s.cy,b0:s.T/BAR}}
function ccText(s,T){for(const x of s.cc.L){if(x.done||T<x.st)continue;if(AN.get(x.n)!==x.tok){x.done=1;continue}
 if(!x.go){x.go=1;spark(s,x.px,x.py,2,150)}const p=(T-x.st)/x.du;if(!x.tr)x.tr=look(x.k);
 if(p>=1&&(x.tr||p>2.4)){x.done=1;AN.delete(x.n);setv(x.n,x.pre+(x.tr||translit(x.k))+x.post);continue}
 const t=x.tr,q=Math.min(1,p);let v;if(t){const L=Math.round(lerp(x.k.length,t.length,q)),c=Math.floor(t.length*eo(q));v=t.slice(0,c)+gl(Math.max(0,L-c))}else v=gl(x.k.length);setv(x.n,x.pre+v+x.post)}}
// --- finálé + dokkolás ---
function finale(s){hit(s,.8);s.ti.el.classList.remove('alfHd','alfHide');s.ti.s.innerHTML='<i class="alfF"></i>ДОБРЕ ДОШЛИ!<i class="alfF"></i>';speak('Добре дошли!');if(s.rm)return;cannons(s);
 const P=s.P,beats=s.mode==='full'?[4,7,9,11,14,16,18]:[4,7,9,11];
 beats.forEach((e,i)=>{const t1=(P.fin+e/7)*BAR;s.rk.push({t0:t1-.42,t1,x0:s.W*(.15+Math.random()*.7),y0:s.H+10,bx:s.W*(.14+.72*((i*.37+.2)%1)),by:s.H*(.14+Math.random()*.28)})})}
function pose(s,b){const P=s.P,W=s.W,H=s.H,lt=s.mode==='lite',mix=(a,c,q)=>({x:lerp(a.x,c.x,q),y:lerp(a.y,c.y,q),s:lerp(a.s,c.s,q)});
 const C={x:W/2,y:H*(lt?.27:.42),s:lt?.55:1},M={x:W/2,y:H*(lt?.3:.46),s:lt?.6:.85},SD={x:W*(s.small?.8:.84),y:H*.72,s:.42};let p=C;
 if(P.n){if(b>=P.tg)p=mix(C,SD,eio((b-P.tg)/.5));if(b>=P.casc-.5)p=mix(SD,M,eio((b-P.casc+.5)/.5))}else if(b>=P.casc)p=mix(C,M,eio((b-P.casc)/.5));
 const d=s.dockP;if(d&&b>=P.end&&s.gl){const q=eio((b-P.end)/(P.land-P.end)),g=s.gl,ds=.41*d.d*g.k/(AT_R*g.sc0),tx=d.x+d.d/2,ty=d.y+d.d/2,cx=(p.x+tx)/2,cy=Math.min(p.y,ty)-H*.22;
  p={x:(1-q)*(1-q)*p.x+2*(1-q)*q*cx+q*q*tx,y:(1-q)*(1-q)*p.y+2*(1-q)*q*cy+q*q*ty,s:lerp(p.s,ds,q)}}
 return p}
function land(s){const g=s.gl;if(g&&g.atl)while(s.atF>=0&&s.atF<24)atlasStep(g,s.atF++);dockOn(g&&s.atF>=24?g.atl:null,s.dockP);s.endAt=Math.max(s.T+.7,s.pEnd+.05)}
// --- HUD (2D vászon, árnyék-blur nélkül: dupla vonás = ragyogás) ---
function glow(c,col,lw){const a=c.globalAlpha;c.strokeStyle=col;c.lineWidth=lw*4;c.globalAlpha=a*.16;c.stroke();c.lineWidth=lw;c.globalAlpha=a;c.stroke()}
function brk(c,x,y,w,h,L,col,lw){c.beginPath();c.moveTo(x,y+L);c.lineTo(x,y);c.lineTo(x+L,y);c.moveTo(x+w-L,y);c.lineTo(x+w,y);c.lineTo(x+w,y+L);c.moveTo(x,y+h-L);c.lineTo(x,y+h);c.lineTo(x+L,y+h);c.moveTo(x+w-L,y+h);c.lineTo(x+w,y+h);c.lineTo(x+w,y+h-L);glow(c,col,lw)}
const phase=(s,b)=>{const P=s.P;return b<P.ign?'ЗАПАЛВАНЕ НА ЯДРОТО':P.scan>=0&&b<P.scan?'ИДЕНТИФИКАЦИЯ':P.n&&b<P.tg?'СКАНИРАНЕ НА ИНТЕРФЕЙСА':P.n&&b<P.casc?'ПРЕВОД  '+pad2((s.tgt?s.tgt.i:0)+1)+' / '+pad2(P.n):b<P.casc?'ИДЕНТИФИКАЦИЯ':P.fin<0||b<P.fin?'КАСКАДНО ПРЕНАПИСВАНЕ':b<P.end?'ДОБРЕ ДОШЛИ':'СКАЧВАНЕ'};
function hud(s,T,b,dt){const c=s.hx,W=s.W,H=s.H,P=s.P;c.setTransform(s.dpr,0,0,s.dpr,0,0);c.clearRect(0,0,W,H);
 const A=clamp(b/.5,0,1)*(1-clamp((b-P.end)/.5,0,1)),m=s.small?10:18;c.lineCap='round';c.textBaseline='top';
 if(A>0){const L=(s.small?26:46)*eo(b/.6);c.globalAlpha=A;c.beginPath();c.moveTo(m,m+L);c.lineTo(m,m);c.lineTo(m+L,m);c.moveTo(W-m-L,m);c.lineTo(W-m,m);c.lineTo(W-m,m+L);c.moveTo(m,H-m-L);c.lineTo(m,H-m);c.lineTo(m+L,H-m);c.moveTo(W-m-L,H-m);c.lineTo(W-m,H-m);c.lineTo(W-m,H-m-L);glow(c,CY,1.5);
  if(s.mode!=='lite'){const x0=m+12,y0=m+10,pw=s.small?110:190,pg=clamp(b/P.end,0,1);c.globalAlpha=A*.6;c.fillStyle='#02121c';c.fillRect(x0-8,y0-6,pw+(s.small?70:96),52);c.globalAlpha=A;c.font='600 11px "Exo 2","Russo One",sans-serif';c.fillStyle=CY2;c.fillText(s.small?'А.Л.Ф.Р.Е.Д.О. v5':'А.Л.Ф.Р.Е.Д.О.  //  ЕЗИКОВ ПРОТОКОЛ v5',x0,y0);
   c.font='800 13px "Exo 2","Russo One",sans-serif';c.fillStyle='#fff';c.fillText(phase(s,b),x0,y0+16);c.globalAlpha=A*.3;c.fillStyle=CY;c.fillRect(x0,y0+37,pw,3);c.globalAlpha=A;
   for(let i=0;i<3;i++){c.fillStyle=FL[i];c.fillRect(x0+pw*pg*i/3,y0+37,pw*pg/3,3)}c.font='600 10px "Exo 2",sans-serif';c.fillStyle=CY2;c.fillText('HU ▸ BG  '+Math.round(pg*100)+'%',x0+pw+10,y0+33)}}
 // gyújtás: töltődő gyűrű a mag körül
 if(b<P.ign+.4&&!s.rm){const a=A*(1-clamp((b-P.ign)/.4,0,1)),pr=clamp(b/P.ign,0,1),R=s.cr*1.55+14;c.globalAlpha=a;c.beginPath();c.arc(s.cx,s.cy,R,-1.5708,-1.5708+6.2832*eo(pr));glow(c,'#fff',2.5);
  c.setLineDash([2,8]);c.lineDashOffset=-T*30;c.beginPath();c.arc(s.cx,s.cy,R+11,0,6.2832);glow(c,CY,1);c.setLineDash([]);
  for(let i=0;i<48;i++){const q=i/48*6.2832,on2=i/48<pr;c.globalAlpha=a*(on2?.9:.25);c.beginPath();c.moveTo(s.cx+Math.cos(q)*(R-6),s.cy+Math.sin(q)*(R-6));c.lineTo(s.cx+Math.cos(q)*(R-12),s.cy+Math.sin(q)*(R-12));c.strokeStyle=CY;c.lineWidth=1.5;c.stroke()}
  c.globalAlpha=a;c.font='800 12px "Exo 2","Russo One",sans-serif';c.textAlign='center';c.fillStyle=CY2;c.fillText('ЯДРО  '+Math.round(pr*100)+'%',s.cx,s.cy+R+18);c.textAlign='left'}
 // pásztázás + címkék
 if(P.scan>=0&&b>=P.scan&&b<P.scan+1.05){const y=eio(b-P.scan)*H,g=c.createLinearGradient(0,y-90,0,y);g.addColorStop(0,'rgba(34,211,238,0)');g.addColorStop(1,'rgba(34,211,238,.2)');c.globalAlpha=A;c.fillStyle=g;c.fillRect(0,y-90,W,90);c.beginPath();c.moveTo(0,y);c.lineTo(W,y);glow(c,'#e0faff',1.5);
  for(const v of s.scan)if(!v.tg&&v.q.top<=y){v.tg=1;s.tags.push({q:v.q,t:T});if(T-s.tagT>.06){s.tagT=T;sfx(s,'tag')}}}
 for(let i=s.tags.length-1;i>=0;i--){const t=s.tags[i],a=1-(T-t.t)/.8;if(a<=0){s.tags.splice(i,1);continue}c.globalAlpha=A*a;brk(c,t.q.left-3,t.q.top-3,t.q.width+6,t.q.height+6,6,CY,1)}
 // célkereszt + infódoboz + lézer
 const tg=s.tgt;if(tg&&tg.p.isConnected&&(b-tg.t0)*7<14){const q=tg.p.getBoundingClientRect(),R=s.ret||(s.ret={x:s.cx,y:s.cy,w:0,h:0}),f=1-Math.exp(-dt*13),e=(b-tg.t0)*7;
  R.x+=(q.left-R.x)*f;R.y+=(q.top-R.y)*f;R.w+=(q.width-R.w)*f;R.h+=(q.height-R.h)*f;const al=A*clamp(e/1.2,0,1)*(1-clamp((e-12.6)/1.2,0,1));
  const x=R.x-10,y=R.y-10,w=R.w+20,h=R.h+20,mx=x+w/2,my=y+h/2,rr=Math.hypot(w,h)/2+14;c.globalAlpha=al;brk(c,x,y,w,h,Math.min(20,w/3,h/2),tg.lk?'#fff':CY,2);
  c.setLineDash([3,9]);c.lineDashOffset=-T*40;c.beginPath();c.arc(mx,my,rr,0,6.2832);glow(c,CY,1);c.setLineDash([24,14,4,14]);c.lineDashOffset=T*60;c.beginPath();c.arc(mx,my,rr+8,0,6.2832);glow(c,CY,1);c.setLineDash([]);
  c.globalAlpha=al*.3;c.beginPath();c.moveTo(0,my);c.lineTo(mx-rr-12,my);c.moveTo(mx+rr+12,my);c.lineTo(W,my);c.moveTo(mx,0);c.lineTo(mx,my-rr-12);c.strokeStyle=CY;c.lineWidth=1;c.stroke();c.globalAlpha=al;
  const bw=s.small?200:290,bh=86;let bx=x+w+rr*.5,by=clamp(y-6,m+64,H-bh-m);if(bx+bw>W-m){bx=x-rr*.5-bw;if(bx<m){bx=clamp(mx-bw/2,m,W-bw-m);by=y+h+rr*.35+bh<H-m?y+h+rr*.35:Math.max(m+64,y-rr*.35-bh)}}
  c.fillStyle='rgba(3,18,30,.86)';c.fillRect(bx,by,bw,bh);c.strokeStyle=CY;c.lineWidth=1;c.strokeRect(bx+.5,by+.5,bw-1,bh-1);for(let i=0;i<3;i++){c.fillStyle=FL[i];c.fillRect(bx,by+i*bh/3,3,bh/3)}
  c.font='800 11px "Exo 2","Russo One",sans-serif';c.fillStyle=CY2;c.fillText('ЦЕЛ '+pad2(tg.i+1)+' / '+pad2(P.n)+'   ◆   '+tg.lab,bx+12,by+10);
  c.font='600 12px "Exo 2","Russo One",sans-serif';c.fillStyle='#fca5a5';c.fillText('HU  '+clip(tg.k,s.small?22:32),bx+12,by+29);c.fillStyle='#fff';c.fillText('BG  '+clip(tg.dst,s.small?22:32),bx+12,by+47);
  const pw=bw-24;c.fillStyle='rgba(34,211,238,.22)';c.fillRect(bx+12,by+68,pw,5);for(let i=0;i<3;i++){c.fillStyle=FL[i];c.fillRect(bx+12+pw*tg.prog*i/3,by+68,pw*tg.prog/3,5)}
  if(tg.las&&s.caret&&!s.rm){const x1=s.caret.x+(Math.random()-.5)*3,y1=s.caret.y+(Math.random()-.5)*3;c.globalCompositeOperation='lighter';c.globalAlpha=A;c.beginPath();c.moveTo(s.cx,s.cy);c.lineTo(x1,y1);
   c.strokeStyle='rgba(34,211,238,.25)';c.lineWidth=10;c.stroke();c.strokeStyle='rgba(165,243,252,.8)';c.lineWidth=3;c.stroke();c.strokeStyle='#fff';c.lineWidth=1.2;c.stroke();
   const g=c.createRadialGradient(x1,y1,0,x1,y1,18);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba(34,211,238,.5)');g.addColorStop(1,'rgba(34,211,238,0)');c.fillStyle=g;c.fillRect(x1-18,y1-18,36,36);c.globalCompositeOperation='source-over'}}
 // kaszkád-hullám
 if(s.cc&&!s.rm){const p=(b-s.cc.b0)/1;if(p<1.25){const r=Math.max(1,s.cc.md*Math.min(p,1.2));c.globalAlpha=A*(1-clamp((p-.85)/.35,0,1));c.beginPath();c.arc(s.cc.cx,s.cc.cy,r,0,6.2832);glow(c,'#e0faff',2);c.globalAlpha*=.4;c.beginPath();c.arc(s.cc.cx,s.cc.cy,r*.93,0,6.2832);glow(c,CY,1)}}
 // lökéshullámok, villanás
 for(let i=s.waves.length-1;i>=0;i--){const w=s.waves[i],p=(T-w.t)/.8;if(p>=1||s.rm){s.waves.splice(i,1);continue}const r=w.R*eo(p);c.globalAlpha=(1-p)*.9;c.beginPath();c.arc(w.x,w.y,r,0,6.2832);glow(c,'#e0faff',3*(1-p)+.8);c.globalAlpha*=.5;c.beginPath();c.arc(w.x,w.y,r*.7,0,6.2832);glow(c,CY,1)}
 if(s.fl>.005&&!s.rm){c.globalAlpha=s.fl;c.fillStyle='#e6fbff';c.fillRect(0,0,W,H)}s.fl*=Math.exp(-dt*7);c.globalAlpha=1}
// --- WebGL képkocka ---
function glFrame(s,T,b,dt){const p=pose(s,b),g=s.gl;s.cx=p.x;s.cy=p.y;if(!g){s.cr=Math.min(s.W,s.H)*.17*p.s;return}
 const u=g.u,P=s.P,rm=s.rm;s.cr=1.25*g.sc0*p.s/g.k;u.uT.value=T;
 u.uG.value=rm?1:eo(b/P.ign);u.uOp.value=rm?clamp(b/.6,0,1)*(1-clamp((b-P.end)/.3,0,1)):1-clamp((b-P.land)/.3,0,1);
 const ep=(b*7)%7,since=ep<2?ep:ep<4?ep-2:ep-4,beat=b>=P.ign&&b<P.end&&!rm?.45*Math.exp(-since*2.2):0;u.uPulse.value=Math.max(u.uPulse.value*Math.exp(-dt*5),beat);
 const c=g.c,sp=rm?0:1;c.core.position.set((p.x-s.W/2)*g.k,-(p.y-s.H/2)*g.k,0);c.core.scale.setScalar(g.sc0*p.s);
 c.spin.rotation.y+=dt*.55*sp*(1+u.uPulse.value);c.inner.rotation.y-=dt*1.3*sp;c.inner.rotation.x+=dt*.4*sp;c.rings.children.forEach(r=>{r.children[0].rotation.z+=dt*r.userData.sp*sp});c.disk.rotation.y+=dt*.22*sp;
 c.diskK.value=1-clamp((b-P.end)/.6,0,1);
 const rt=rm?0:P.scan>=0&&b>=P.scan&&b<P.tg?.55:P.n&&b>=P.tg&&b<P.casc?.15:b>=P.casc&&b<P.casc+2?(s.mode==='lite'?.4:.6)*(1-clamp(b-P.casc-1,0,1)):0;
 g.rainI.value+=(rt-g.rainI.value)*Math.min(1,dt*4);g.rain.visible=g.rainI.value>.01;
 for(const r of s.rk){if(r.done||T<r.t0)continue;const q=clamp((T-r.t0)/(r.t1-r.t0),0,1),e=eo(q),x=lerp(r.x0,r.bx,e),y=lerp(r.y0,r.by,e);
  if(q<1){spawn(s,x,y,(Math.random()-.5)*40,30+Math.random()*40,1,.32,0,5,[1,.85,.5]);spawn(s,x,y,0,0,1,.12,0,9,[1,1,1])}else{r.done=1;burst(s,r.bx,r.by)}}
 if(!rm&&P.fin>=0&&b>=P.fin&&b<P.fin+2){s.pet+=dt*(s.mode==='full'?60:30);for(;s.pet>=1;s.pet--)spawn(s,Math.random()*s.W,-20-Math.random()*60,(Math.random()-.5)*60,30+Math.random()*50,2,5+Math.random()*1.5,(Math.random()-.5)*1.4,13+Math.random()*7,ROSE[Math.random()*4|0])}
 if(g.dirty){g.dirty=false;for(const k of ['position','aV','aL','aC'])g.pg.attributes[k].needsUpdate=true}
 if(s.atF>=0&&s.atF<24){if(!g.atl){g.atl=D.createElement('canvas');const fp=Math.round(Math.max(48,s.dockP?s.dockP.d*.82:70)*Math.min(2,devicePixelRatio||1));g.atl.width=fp*24;g.atl.height=fp}atlasStep(g,s.atF++)}
 g.r.setViewport(0,0,s.W,s.H);g.r.clear();if(u.uOp.value>0)g.r.render(g.sc3,g.cam3);g.r.render(g.sc2,g.cam2)}

// ---------- DOKKOLT EMBLÉMA: csak CSS-animáció (kompozitor), 0 RAF ----------
let DK=null;
const solid=(e,s)=>/^(IMG|CANVAS|svg|BUTTON|INPUT|VIDEO|SELECT)$/.test(e.nodeName)||!(s.backgroundColor==='transparent'||/,\s*0\)$/.test(s.backgroundColor))||s.backgroundImage!=='none'||parseFloat(s.borderTopWidth)>0&&s.borderTopStyle!=='none'||s.boxShadow!=='none'||!e.childElementCount&&/\S/.test(e.textContent);
// szabad hely keresése a látható felület-elemek között (jobb/bal szél, több magasság)
function slot(){const W=innerWidth,H=innerHeight,sm=W<700,d=sm?56:Math.round(clamp(H*.095,66,100)),m=sm?8:16;
 const C=[[1,.40],[1,.30],[0,.45],[1,.52],[0,.34],[1,.2],[0,.56],[1,.62]].map(([r,f])=>({x:r?W-d-m:m,y:Math.round(clamp(H*f-d/2,m,H-d-m-16))})),hit=C.map(()=>0),all=D.body.getElementsByTagName('*');
 for(let i=0;i<all.length;i++){const e=all[i],r=e.getBoundingClientRect();if(r.width<6||r.height<6||r.width*r.height>W*H*.35)continue;let st=null;
  for(let j=0;j<C.length;j++){const c=C[j],ox=Math.min(r.right,c.x+d+8)-Math.max(r.left,c.x-8),oy=Math.min(r.bottom,c.y+d+20)-Math.max(r.top,c.y-8);if(ox<=0||oy<=0)continue;
   st=st||getComputedStyle(e);if(st.visibility==='hidden'||+st.opacity<.05||!solid(e,st))break;hit[j]+=ox*oy}}
 let b=hit.findIndex(h=>!h);if(b<0)b=hit.indexOf(Math.min(...hit));return {x:C[b].x,y:C[b].y,d}}
const ctxKey=()=>(lobbyOn()?1:0)+'|'+innerWidth+'|'+innerHeight;
function dockOn(atl,p){dockOff();p=p||slot();const el=mk('div','alfDock');el.style.cssText='left:'+p.x+'px;top:'+p.y+'px;width:'+p.d+'px;height:'+p.d+'px';
 el.innerHTML='<i class="alfR2"></i><i class="alfR1"></i><div class="alfSp"></div>'+(p.d>60?'<div class="alfLb">АЛФРЕДО</div>':'');const sp=el.querySelector('.alfSp');
 DK={el,key:ctxKey(),d:p.d,iv:setInterval(()=>{if(D.hidden||!DK)return;const k=ctxKey();if(k===DK.key)return;DK.key=k;const q=slot();el.style.left=q.x+'px';el.style.top=q.y+'px';if(q.d!==DK.d){DK.d=q.d;el.style.width=el.style.height=q.d+'px'}},2500),tm:0};
 if(atl)sp.appendChild(atl);else DK.tm=setTimeout(()=>{if(!DK||DK.el!==el)return;const a=atlasSolo(Math.round(p.d*.82));if(a)sp.appendChild(a)},900);
 el.offsetWidth;el.classList.add('alfOn')}
function dockOff(){if(!DK)return;clearInterval(DK.iv);clearTimeout(DK.tm);DK.el.remove();DK=null}

// ---------- KI/BE ----------
function toggle(quiet){
 if(!on){on=true;try{localStorage.setItem('k3alf','1')}catch(e){}css();prevLang=DE.lang||'hu';for(const k in TMP)delete TMP[k];FAIL.clear();back=0;DE.lang='bg';const show=quiet!==true;hold=show;if(!show)DE.classList.add('alfBg');
  walk(D.body);observe();try{speechSynthesis.getVoices()}catch(e){}
  if(show)startShow();else dockOn(null);
  return 'АЛФРЕДО МОД: ВКЛЮЧЕН ✦ (/alfredomode = изключване)'}
 on=false;try{localStorage.removeItem('k3alf')}catch(e){}
 if(S)cleanup(S);dockOff();hold=false;if(obs){obs.disconnect();obs=null}restore();clearTimeout(pT);pT=0;
 DE.classList.remove('alfBg');DE.lang=prevLang;try{speechSynthesis.cancel()}catch(e){}
 return 'Alfredo mód kikapcsolva.'}
const prev=window.extraCmd;
window.extraCmd=function(c){if(/^alfredomode$/i.test(String(c).trim()))return toggle();return prev?prev.apply(this,arguments):null};
window._alf={toggle,TR,translit,look,keys,slot,get on(){return on},get S(){return S},get dock(){return DK}};
try{if(localStorage.getItem('k3alf'))setTimeout(()=>{if(!on)toggle(true)},1500)}catch(e){}
})();
