// ===== RÉSZLETES KARAKTERMODELLEK: ruha-, haj- és arctextúrák (rajzolt, kitalált arcok) =====
(function(){
const TX={};
function cv(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
const noise=(x,w,h,a,n)=>{for(let i=0;i<(n||w*h/6);i++){const v=Math.random()*a|0;x.fillStyle='rgba('+(Math.random()<.5?'255,255,255':'0,0,0')+','+(v/255)+')';x.fillRect(Math.random()*w,Math.random()*h,1,1)}};
// --- szövetek (szürkeárnyalatos, az anyagszín színezi) ---
const FAB={
 suit:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#c8c8c8';x.fillRect(0,0,w,h);for(let i=0;i<w;i+=2){x.fillStyle='rgba(255,255,255,'+(.04+Math.random()*.05)+')';x.fillRect(i,0,1,h)}for(let j=0;j<h;j+=2){x.fillStyle='rgba(0,0,0,'+(.03+Math.random()*.04)+')';x.fillRect(0,j,w,1)}x.strokeStyle='rgba(255,255,255,.08)';for(let i=0;i<w;i+=18){x.beginPath();x.moveTo(i,0);x.lineTo(i,h);x.stroke()}noise(x,w,h,30)}),
 knit:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#c8c8c8';x.fillRect(0,0,w,h);for(let j=0;j<h;j+=8)for(let i=0;i<w;i+=8){x.fillStyle='rgba(0,0,0,.10)';x.beginPath();x.ellipse(i+2,j+4,2.2,3.6,.5,0,7);x.ellipse(i+6,j+4,2.2,3.6,-.5,0,7);x.fill()}noise(x,w,h,40)}),
 denim:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#bcbcbc';x.fillRect(0,0,w,h);for(let i=-h;i<w;i+=3){x.strokeStyle='rgba(255,255,255,'+(.05+Math.random()*.08)+')';x.beginPath();x.moveTo(i,0);x.lineTo(i+h,h);x.stroke()}noise(x,w,h,50);x.strokeStyle='rgba(255,220,150,.5)';x.setLineDash([6,4]);x.lineWidth=2;x.beginPath();x.moveTo(w*.5,0);x.lineTo(w*.5,h);x.stroke()}),
 leather:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#b4b4b4';x.fillRect(0,0,w,h);for(let i=0;i<500;i++){x.strokeStyle='rgba(0,0,0,'+Math.random()*.12+')';x.beginPath();const a=Math.random()*w,b=Math.random()*h;x.moveTo(a,b);x.lineTo(a+Math.random()*14-7,b+Math.random()*14-7);x.stroke()}const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(0,0,0,.12)');x.fillStyle=g;x.fillRect(0,0,w,h)}),
 sport:()=>cv(256,256,(x,w,h)=>{x.fillStyle='#d0d0d0';x.fillRect(0,0,w,h);noise(x,w,h,25);x.fillStyle='rgba(255,255,255,.9)';x.fillRect(w*.08,0,10,h);x.fillRect(w*.08+16,0,10,h)}),
 skin:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#e8e8e8';x.fillRect(0,0,w,h);noise(x,w,h,14)}),
 hair:()=>cv(128,128,(x,w,h)=>{x.fillStyle='#b0b0b0';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.strokeStyle='rgba('+(Math.random()<.5?'255,255,255':'0,0,0')+','+Math.random()*.25+')';const a=Math.random()*w,b=Math.random()*h;x.beginPath();x.moveTo(a,b);x.lineTo(a+Math.random()*4-2,b+8+Math.random()*10);x.stroke()}}),
 sole:()=>cv(64,64,(x,w,h)=>{x.fillStyle='#ddd';x.fillRect(0,0,w,h);noise(x,w,h,40)}),
};
const PH={suit:['wool',2,2],knit:['fleece',1.5,1.5],denim:['denim',1.5,1.5],leather:['leather',1.5,1.5],sport:['jersey',2,2],hair:['fleece',.6,.6],sole:['rubber',2,2]};
const tex=k=>{if(TX[k])return TX[k];if(window.photoTex&&PH[k])return TX[k]=photoTex(PH[k][0]+'_gray.jpg',PH[k][1],PH[k][2]);return TX[k]=FAB[k]()};
const ntex=k=>window.photoTex&&PH[k]?photoTex(PH[k][0]+'_nor.jpg',PH[k][1],PH[k][2]):null;
const MS={};const mat=(k,c,o)=>{const key=k+'|'+c+'|'+(o?JSON.stringify(o):'');if(MS[key])return MS[key];const n=ntex(k),col=new THREE.Color(c);if(window.photoTex&&PH[k])col.multiplyScalar(1.22);return MS[key]=new THREE.MeshStandardMaterial(Object.assign({color:col,map:tex(k),roughness:k==='leather'?.45:.85,metalness:0},n?{normalMap:n}:{},o||{}))};
// --- rajzolt arc (kitalált, rajzfilmes) ---
const FACE={};
function faceTex(o){const key=JSON.stringify(o);if(FACE[key])return FACE[key];
 return FACE[key]=cv(256,256,(x,w,h)=>{x.fillStyle=o.skin;x.fillRect(0,0,w,h);noise(x,w,h,12,4000);
  const sh=x.createRadialGradient(128,140,40,128,140,150);sh.addColorStop(0,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(0,0,0,.18)');x.fillStyle=sh;x.fillRect(0,0,w,h);
  if(o.stubble){x.fillStyle='rgba(40,30,25,.22)';x.beginPath();x.ellipse(128,200,78,52,0,0,Math.PI);x.fill();noise(x,w,h,0)}
  if(o.beard){x.fillStyle=o.beard;x.beginPath();x.moveTo(40,150);x.quadraticCurveTo(128,290,216,150);x.lineTo(200,150);x.quadraticCurveTo(128,230,56,150);x.fill();x.beginPath();x.ellipse(128,182,34,10,0,0,7);x.fill()}
  // szemek
  [[86,118],[170,118]].forEach(([ex,ey])=>{x.fillStyle='#fff';x.beginPath();x.ellipse(ex,ey,20,13,0,0,7);x.fill();x.fillStyle=o.eye;x.beginPath();x.arc(ex+2,ey+1,9,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(ex+2,ey+1,4.5,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex+5,ey-3,2.5,0,7);x.fill();x.strokeStyle='rgba(60,30,20,.55)';x.lineWidth=2.5;x.beginPath();x.ellipse(ex,ey,20,13,0,Math.PI*1.05,Math.PI*1.95);x.stroke()});
  // szemöldök
  x.fillStyle=o.brow;x.lineCap='round';[[86,-1],[170,1]].forEach(([bx,s])=>{x.save();x.translate(bx,92);x.rotate(s*(o.browAng||.08));x.fillRect(-24,-5,48,o.browW||9);x.restore()});
  // orr
  x.strokeStyle='rgba(0,0,0,.22)';x.lineWidth=3;x.beginPath();x.moveTo(128,124);x.quadraticCurveTo(118,160,124,168);x.quadraticCurveTo(134,172,142,166);x.stroke();
  // pír
  x.fillStyle='rgba(230,90,90,.16)';x.beginPath();x.arc(70,160,18,0,7);x.arc(186,160,18,0,7);x.fill();
  // száj
  if(o.mustache){x.fillStyle=o.mustache;x.beginPath();x.ellipse(110,186,22,8,.15,0,7);x.ellipse(146,186,22,8,-.15,0,7);x.fill()}
  x.strokeStyle='#7a2b2b';x.lineWidth=5;x.beginPath();if(o.mouth==='grin'){x.fillStyle='#5a1a1a';x.moveTo(98,196);x.quadraticCurveTo(128,228,158,196);x.closePath();x.fill();x.fillStyle='#fff';x.fillRect(106,197,44,7)}else if(o.mouth==='smirk'){x.moveTo(104,202);x.quadraticCurveTo(132,210,156,194)}else{x.moveTo(100,198);x.quadraticCurveTo(128,218,156,198)}x.stroke();
  if(o.glasses){x.strokeStyle=o.glasses;x.lineWidth=6;x.beginPath();x.roundRect(60,100,54,38,10);x.roundRect(142,100,54,38,10);x.moveTo(114,116);x.lineTo(142,116);x.stroke();if(o.shades){x.fillStyle='rgba(10,10,20,.85)';x.beginPath();x.roundRect(60,100,54,38,10);x.roundRect(142,100,54,38,10);x.fill()}}})}
// --- építőelemek ---
const BOX=new THREE.BoxGeometry(1,1,1);
function P(g,m,w,h,d,x,y,z){const p=new THREE.Mesh(BOX,m);p.scale.set(w,h,d);p.position.set(x,y,z);p.castShadow=true;p.receiveShadow=true;g.add(p);return p}
function head(g,o,sc){const skin=mat('skin',o.skinC);const ft=faceTex(o.face);const fm=new THREE.MeshStandardMaterial({map:ft,roughness:.8});
 const hd=new THREE.Mesh(BOX,[skin,skin,skin,skin,fm,skin]);hd.scale.set(.62,.7,.6);hd.position.set(0,2.32,0);hd.castShadow=true;g.add(hd);
 P(g,skin,.16,.22,.12,-.33,2.3,0);P(g,skin,.16,.22,.12,.33,2.3,0);P(g,skin,.26,.16,.24,0,1.95,0);
 const hm=mat('hair',o.hairC);const H=o.hair;
 if(H==='side'){P(g,hm,.66,.16,.64,0,2.71,-.01);P(g,hm,.68,.3,.2,0,2.55,-.22);P(g,hm,.08,.34,.6,-.33,2.5,-.02);P(g,hm,.08,.34,.6,.33,2.5,-.02);P(g,hm,.5,.12,.2,.07,2.72,.24).rotation.z=-.12}
 else if(H==='quiff'){P(g,hm,.66,.14,.64,0,2.7,0);P(g,hm,.5,.24,.3,0,2.84,.16).rotation.x=-.35;P(g,hm,.08,.26,.56,-.33,2.52,-.03);P(g,hm,.08,.26,.56,.33,2.52,-.03)}
 else if(H==='receding'){P(g,hm,.66,.08,.4,0,2.69,-.12);P(g,hm,.08,.3,.5,-.33,2.45,-.06);P(g,hm,.08,.3,.5,.33,2.45,-.06);P(g,hm,.66,.3,.12,0,2.48,-.29)}
 else if(H==='bald'){}
 else if(H==='spiky'){for(let i=0;i<7;i++){const s=P(g,hm,.14,.34,.14,-.24+i*.08,2.82+Math.sin(i)*.04,(i%2?.1:-.1));s.rotation.z=(i-3)*.12}P(g,hm,.64,.1,.62,0,2.69,0)}
 else if(H==='beanie'){const bm=mat('knit',o.beanieC);P(g,bm,.7,.3,.68,0,2.76,0);P(g,bm,.74,.1,.72,0,2.62,0);P(g,bm,.18,.14,.18,0,2.98,0)}
 return hd}
function body(g,o){const legM=mat(o.legK||'suit',o.legC),topM=mat(o.topK||'suit',o.topC),shoe=mat('leather',o.shoeC||0x1a1a1a),sole=mat('sole',0xeeeeee);
 // lábak + cipő
 [-.2,.2].forEach(x=>{const L=new THREE.Group();L.position.set(x,.93,0);L.userData.limb=x<0?'lleg':'rleg';g.add(L);P(L,legM,.27,.86,.3,0,-.43,0);P(L,shoe,.3,.18,.44,0,-.84,.06);if(o.sneaker)P(L,sole,.31,.06,.45,0,-.91,.06)});
 // törzs
 P(g,topM,.8,1,.45,0,1.42,0);
 if(o.shirtC){P(g,mat('suit',o.shirtC),.26,.62,.02,0,1.62,.231);if(o.collar){P(g,mat('suit',o.shirtC),.14,.12,.1,-.12,1.92,.2).rotation.z=.5;P(g,mat('suit',o.shirtC),.14,.12,.1,.12,1.92,.2).rotation.z=-.5}}
 if(o.tie)P(g,mat('suit',o.tie),.11,.5,.02,0,1.58,.245);
 if(o.lapel){[-1,1].forEach(s=>{const l=P(g,mat(o.topK||'suit',o.lapel),.1,.62,.03,s*.17,1.63,.235);l.rotation.z=s*.32})}
 if(o.zip)P(g,mat('suit',0xdddddd),.03,.95,.02,0,1.42,.232);
 if(o.print){const pm=new THREE.MeshStandardMaterial({map:cv(128,128,(x)=>{x.clearRect(0,0,128,128);x.font='90px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(o.print,64,70)}),transparent:true});P(g,pm,.42,.42,.01,0,1.5,.232)}
 if(o.belt)P(g,mat('leather',0x2b1a10),.82,.08,.47,0,.95,0);
 // karok + kéz
 const skin=mat('skin',o.skinC);[-1,1].forEach(s=>{const A=new THREE.Group();A.position.set(s*.52,1.83,0);A.userData.limb=s<0?'larm':'rarm';g.add(A);P(A,topM,.22,.82,.26,0,-.41,0);P(A,o.cuffC?mat('suit',o.cuffC):topM,.23,.08,.27,0,-.8,0);P(A,skin,.19,.2,.2,0,-.93,0)});
 if(o.backpack)P(g,mat('leather',o.backpack),.6,.7,.22,0,1.45,-.33);
 if(o.scarf){P(g,mat('knit',o.scarf),.62,.16,.5,0,1.9,0);P(g,mat('knit',o.scarf),.16,.4,.06,.18,1.65,.25)}}
// --- a 6 karakter ---
const CHARS={
 '🎩':{c:0xf97316,skinC:0xf1c7a6,hair:'side',hairC:0xb9bcc0,topC:0x1b2a44,legC:0x1b2a44,lapel:0x15223a,shirtC:0xa9c8ea,collar:1,cuffC:0xa9c8ea,shoeC:0x111111,belt:1,face:{skin:'#f1c7a6',eye:'#4a6b8a',brow:'#8d9196',mouth:'smile',browW:10}},
 '☄️':{c:0x06b6d4,skinC:0xe9b892,hair:'quiff',hairC:0x3b2414,topK:'sport',topC:0x0e7490,legK:'denim',legC:0x2b4c7e,shirtC:0xf8fafc,zip:1,shoeC:0xf1f5f9,sneaker:1,face:{skin:'#e9b892',eye:'#5b3a1e',brow:'#3b2414',mouth:'grin',stubble:1,browAng:.15}},
 '🐕':{c:0x10b981,skinC:0xf3cfb3,hair:'beanie',hairC:0x6b4226,beanieC:0xef4444,topK:'knit',topC:0x16a34a,legK:'denim',legC:0x7c3aed,shoeC:0xfacc15,sneaker:1,print:'🐕',face:{skin:'#f3cfb3',eye:'#2f6b3a',brow:'#6b4226',mouth:'grin',glasses:'#ec4899'}},
 '🦇':{c:0x3b82f6,skinC:0xeec3a2,hair:'receding',hairC:0x9ca3af,topC:0x2d3340,legC:0x2d3340,lapel:0x232833,shirtC:0xf1f5f9,tie:0x1d4ed8,cuffC:0xf1f5f9,shoeC:0x3b2414,belt:1,face:{skin:'#eec3a2',eye:'#4b5563',brow:'#6b7280',mouth:'smirk',glasses:'#1f2937',mustache:'#6b7280',browAng:-.05}},
 '🛡️':{c:0xa16207,skinC:0xd9a27c,hair:'bald',hairC:0x222222,topK:'leather',topC:0x5a3418,legK:'denim',legC:0x3f3f46,shirtC:0x111111,zip:1,shoeC:0x1c1917,belt:1,backpack:0x3f2a1a,face:{skin:'#d9a27c',eye:'#3b2a1a',brow:'#2b1d14',mouth:'smirk',beard:'#2b1d14',browW:13,browAng:-.12}},
 '🦠':{c:0xa3e635,skinC:0xf0c8a8,hair:'spiky',hairC:0x65a30d,topK:'sport',topC:0x84cc16,legK:'sport',legC:0x3f6212,shirtC:0x1a2e05,zip:1,shoeC:0xffffff,sneaker:1,scarf:0x22c55e,face:{skin:'#f0c8a8',eye:'#3f6212',brow:'#365314',mouth:'grin',glasses:'#111',shades:1}},
};
function build(def,sc){const g=new THREE.Group(),inner=new THREE.Group();body(inner,def);head(inner,def,sc);inner.scale.setScalar(sc||1);g.add(inner);return g}
window.charModel=build;
// általános (bot / skin) karakterek is szebb modellt kapnak
const HAIRS=['side','quiff','receding','bald','spiky','beanie'],HC=[0x2b1a10,0x5b3a1e,0x9ca3af,0xe5c07b,0x111111,0x8b3a1a],SK=['#f1c7a6','#e9b892','#d9a27c','#c68b62','#8d5a3b','#f3d5c0'],EY=['#4a6b8a','#5b3a1e','#2f6b3a','#3b2a1a'];
function generic(col,em,sc){let h=0;const s=String(col)+em;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;const r=k=>((h>>>(k*3))%997)/997;
 const skin=SK[(r(1)*SK.length)|0],def={skinC:new THREE.Color(skin).getHex(),hair:HAIRS[(r(2)*HAIRS.length)|0],hairC:HC[(r(3)*HC.length)|0],beanieC:col,topC:col,legC:r(4)<.5?0x1f2937:0x334155,legK:r(4)<.5?'suit':'denim',lapel:r(5)<.5?new THREE.Color(col).multiplyScalar(.8).getHex():null,shirtC:0xf1f5f9,tie:r(6)<.5?0xdc2626:null,shoeC:0x111111,belt:1,
  face:{skin,eye:EY[(r(7)*EY.length)|0],brow:'#3b2a1a',mouth:['smile','grin','smirk'][(r(8)*3)|0],stubble:r(9)<.3,glasses:r(10)<.2?'#111':null}};
 const g=build(def,sc);if(em){const sp=spr(em,.8*(sc||1));sp.position.y=3.15*(sc||1);g.add(sp)}return g}
const _person=window.person;
window.person=function(col,em,sc){const d=CHARS[em];try{if(d&&col===d.c)return build(d,sc);return generic(col,em,sc)}catch(e){console.error('char',e);return _person.apply(this,arguments)}};
// régi idős-modell is legyen szép
window.personOld=function(col,em,sc){return window.person(col,em,sc)};
// lobby: Vezérnél petrolkék háttérfény
window.charBackLight=em=>em==='🎩'?0x0f5e6e:null;
})();
