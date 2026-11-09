// ===== KÖZÖSSÉGI TÉR – 🫖 TEAKERT: lazulás, beszélgetés, teafőzés, ülés a tűz körül, push-to-talk (V) =====
(function(){
const $$=i=>document.getElementById(i);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=()=>window.KR,ACC=()=>window.KR?KR.acc():{},logged=()=>{const a=ACC();return a&&a.user&&!a.guest&&a.ws&&a.ws.readyState===1};
const myName=()=>{const a=ACC();return a&&a.user?a.user.name:'Vendég'};
// ---------- felület ----------
const css=document.createElement('style');css.textContent=`
#cs{position:fixed;inset:0;z-index:12;display:none;background:#0b1026;font-family:Rajdhani,Arial;color:#fff;user-select:none}#cs.on{display:block}
#csCv{position:absolute;inset:0;width:100%;height:100%;display:block}
#csTop{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:10px;padding:10px 16px;background:linear-gradient(#000b,#0000);pointer-events:none}
#csTop .t{font:28px 'Luckiest Guy',Impact;color:#fde68a;text-shadow:0 3px 0 #000}#csTop .c{background:#0009;border:1px solid #ffffff22;border-radius:999px;padding:5px 12px;font-weight:700}
#csX{margin-left:auto;pointer-events:auto;border:0;border-radius:10px;padding:9px 14px;background:#ef4444;color:#fff;font:16px 'Luckiest Guy',Impact;cursor:pointer}
#csHelp{position:absolute;left:14px;top:64px;background:#0009;border:1px solid #ffffff1f;border-radius:12px;padding:10px 12px;font:600 14px Rajdhani;line-height:1.55;color:#e2e8f0;max-width:250px}
#csHelp b{color:#fde68a}#csLog{position:absolute;left:14px;bottom:70px;width:360px;max-height:200px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:3px;font:600 15px Rajdhani;pointer-events:none}
#csLog div{background:#0008;border-radius:8px;padding:3px 8px;text-shadow:0 1px 0 #000}#csLog b{color:#fde68a}
#csIn{position:absolute;left:14px;bottom:16px;width:420px;display:flex;gap:6px}#csIn input{flex:1;padding:10px 12px;border-radius:12px;border:1px solid #ffffff33;background:#000a;color:#fff;font:600 16px Rajdhani;outline:none}#csIn input:focus{border-color:#fde68a}
#csIn button{border:0;border-radius:12px;padding:0 14px;background:#f59e0b;color:#1c1300;font:16px 'Luckiest Guy',Impact;cursor:pointer}
#csHint{position:absolute;left:50%;bottom:90px;transform:translateX(-50%);background:#000a;border-radius:10px;padding:7px 14px;font:700 17px Rajdhani;display:none}
#csMic{position:absolute;right:16px;bottom:16px;display:flex;align-items:center;gap:8px;background:#0009;border:2px solid #ffffff33;border-radius:999px;padding:8px 14px;font:700 15px Rajdhani}
#csMic.on{border-color:#ef4444;background:#7f1d1dcc;animation:csP 1s infinite}@keyframes csP{50%{box-shadow:0 0 0 8px #ef444433}}
#csBar{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);display:none;text-align:center;font:18px 'Luckiest Guy',Impact;text-shadow:0 2px 0 #000}#csBar i{display:block;margin:6px auto 0;width:64px;height:64px;border-radius:50%}
#csTags{position:absolute;inset:0;pointer-events:none;overflow:hidden}.csTag{position:absolute;transform:translate(-50%,-100%);text-align:center;white-space:nowrap}
.csTag .n{font:700 14px Rajdhani;background:#0009;border-radius:8px;padding:1px 8px;display:inline-block}.csTag .n.npc{color:#a5f3fc}.csTag .n.me{color:#fde68a}
.csTag .b{display:block;max-width:240px;white-space:normal;margin:0 auto 4px;background:#fff;color:#111;border-radius:12px;padding:5px 10px;font:700 14px Rajdhani;box-shadow:0 3px 10px #0008;position:relative}
.csTag .b:after{content:'';position:absolute;left:50%;bottom:-6px;margin-left:-6px;border:6px solid transparent;border-top-color:#fff;border-bottom:0}.csTag .v{font-size:20px;display:block}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='cs';D.innerHTML='<canvas id="csCv"></canvas><div id="csTags"></div><div id="csTop"><span class="t">🫖 TEAKERT</span><span class="c" id="csCnt"></span><span class="c">közösségi tér · pihenj, beszélgess, főzz egy teát</span><button id="csX">↩ VISSZA A LOBBYBA</button></div>'+
 '<div id="csHelp"><b>WASD</b> séta · <b>egér húzás</b> kamera · <b>görgő</b> zoom<br><b>E</b> leülés / felállás / teafőzés<br><b>Q</b> kortyolás 🍵 · <b>E a tónál</b> horgászás 🎣 · <b>1</b> integetés · <b>2</b> tánc<br><b>Enter</b> chat · <b>V nyomva</b> push-to-talk 🎙️<br><b>Esc</b> vissza a lobbyba</div>'+
 '<div id="csLog"></div><div id="csIn"><input id="csInp" maxlength="160" placeholder="Írj valamit… (Enter)"><button id="csSend">KÜLD</button></div><div id="csHint"></div><div id="csBar"><span id="csBt"></span><i id="csBr"></i></div><div id="csMic">🎙️ <span id="csMicT">V – nyomd és beszélj</span></div>';document.body.appendChild(D);
// ---------- jelenet ----------
let R=null,SC,CAM,built=false,raf=0,last=0;const P={},SEATS=[],COL=[],TAGS={};let ME=null,fireL=null,flames=[],steam=[],hammock=null,station={x:7,z:-5};
const MS=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{}));
function mesh(g,m,x,y,z,par){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);(par||SC).add(o);return o}
function build(){built=true;R=new THREE.WebGLRenderer({canvas:$$('csCv'),antialias:true});R.setPixelRatio(Math.min(1.5,devicePixelRatio||1));R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.outputEncoding=THREE.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
 SC=new THREE.Scene();CAM=new THREE.PerspectiveCamera(55,1,.1,400);const AN=Math.min(8,R.capabilities.getMaxAnisotropy());
 const TL=new THREE.TextureLoader(),TC={};const tx=(n,rx,ry,nor)=>{const k=n+rx+ry+nor;if(TC[k])return TC[k];const t=TL.load('tex_opt/'+n+(nor?'_nor':'_diff')+'.jpg');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry||rx);t.anisotropy=AN;if(!nor)t.encoding=THREE.sRGBEncoding;return TC[k]=t};
 const PB=(n,rx,ry,o)=>new THREE.MeshStandardMaterial(Object.assign({map:tx(n,rx,ry),normalMap:tx(n,rx,ry,1),roughness:.85},o||{}));
 const cvT=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=AN;return t};
 const GLOW=cvT(128,128,(x,w)=>{const g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128)});GLOW.encoding=THREE.LinearEncoding;
 const glow=(c,s,x,y,z,o,par)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:c,transparent:true,opacity:o==null?.9:o,blending:THREE.AdditiveBlending,depthWrite:false}));sp.scale.set(s,s,1);sp.position.set(x,y,z);(par||SC).add(sp);return sp};
 const shadowAll=(o,c,r)=>{o.traverse(m=>{if(m.isMesh){m.castShadow=c!==false;m.receiveShadow=r!==false}})};
 const ANI=[];
 // ---------- ég ----------
 const sky=cvT(1024,512,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#02030c');g.addColorStop(.35,'#0b1440');g.addColorStop(.47,'#2b2363');g.addColorStop(.5,'#6b3d7a');g.addColorStop(.53,'#1a1636');g.addColorStop(1,'#05060e');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<1600;i++){const y=Math.random()*h*.48,s=Math.random()<.03?1.8:.8;x.fillStyle='rgba(255,255,'+(220+Math.random()*35|0)+','+(.3+Math.random()*.7)+')';x.fillRect(Math.random()*w,y,s,s)}
  x.globalCompositeOperation='lighter';for(let b=0;b<2;b++)for(let i=0;i<w;i+=2){const y=110+b*45+Math.sin(i*.012+b*2)*28+Math.sin(i*.031)*8,hh=70+Math.sin(i*.02+b)*25;const gg=x.createLinearGradient(0,y,0,y+hh);gg.addColorStop(0,'rgba(0,0,0,0)');gg.addColorStop(.7,b?'rgba(168,85,247,.09)':'rgba(45,212,191,.11)');gg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gg;x.fillRect(i,y,2,hh)}});
 SC.add(new THREE.Mesh(new THREE.SphereGeometry(200,48,24),new THREE.MeshBasicMaterial({map:sky,side:THREE.BackSide,fog:false,toneMapped:false})));
 const moonP=new THREE.Vector3(-70,95,-120);const moon=new THREE.Mesh(new THREE.SphereGeometry(7,32,16),new THREE.MeshBasicMaterial({color:0xfff6dc,fog:false,toneMapped:false}));moon.position.copy(moonP);SC.add(moon);glow(0xbfd4ff,70,moonP.x,moonP.y,moonP.z,.55).material.fog=false;
 SC.background=new THREE.Color(0x0b1026);SC.fog=new THREE.FogExp2(0x141a3d,.022);
 // ---------- fények ----------
 SC.add(new THREE.HemisphereLight(0x7f95ff,0x3a2414,.5));const ml=new THREE.DirectionalLight(0xc4d4ff,.75);ml.position.set(-14,26,-18);ml.castShadow=true;ml.shadow.mapSize.set(2048,2048);const sc2=ml.shadow.camera;sc2.left=sc2.bottom=-20;sc2.right=sc2.top=20;sc2.near=1;sc2.far=80;ml.shadow.bias=-.0004;ml.shadow.normalBias=.02;SC.add(ml);
 fireL=new THREE.PointLight(0xff8a3a,2.6,30,1.5);fireL.position.set(0,1.4,0);SC.add(fireL);
 const pavL=new THREE.PointLight(0xffb070,1.1,12,1.8);pavL.position.set(7,3.4,-5);SC.add(pavL);
 // ---------- talaj ----------
 const gr=new THREE.Mesh(new THREE.CircleGeometry(90,64),PB('grass2',40,40,{roughness:1,color:0x6f8f6a}));gr.rotation.x=-Math.PI/2;gr.position.y=-.02;gr.receiveShadow=true;SC.add(gr);
 {const N=2600,blade=new THREE.ConeGeometry(.05,.5,3);blade.translate(0,.25,0);const im=new THREE.InstancedMesh(blade,new THREE.MeshStandardMaterial({color:0x4f7a3a,roughness:1}),N);const M=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();let n=0;
  for(let i=0;i<N*3&&n<N;i++){const a=Math.random()*6.283,r=15.6+Math.random()*16;const x=Math.cos(a)*r,z=Math.sin(a)*r;e.set((Math.random()-.5)*.4,Math.random()*6,(Math.random()-.5)*.4);q.setFromEuler(e);const s=.6+Math.random()*1.1;M.compose(new THREE.Vector3(x,0,z),q,new THREE.Vector3(s,s,s));im.setMatrixAt(n++,M)}im.count=n;SC.add(im)}
 {const fl=[0xf9a8d4,0xfde68a,0xffffff,0xc4b5fd,0x93c5fd];const g=new THREE.SphereGeometry(.07,6,5);for(let i=0;i<140;i++){const a=Math.random()*6.283,r=15.8+Math.random()*10,m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:fl[i%5],emissive:fl[i%5],emissiveIntensity:.25}));m.position.set(Math.cos(a)*r,.35,Math.sin(a)*r);SC.add(m)}}
 // ---------- fapadló ----------
 const deck=new THREE.Mesh(new THREE.CylinderGeometry(15,15.25,.32,64),[PB('wood',2,2,{roughness:.8,color:0xc9a27a}),PB('wood',6,6,{roughness:.75,color:0xd8b48a}),PB('wood',6,6)]);deck.receiveShadow=true;deck.castShadow=true;SC.add(deck);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(15.1,.14,8,96),PB('darkwood',20,1));rim.rotation.x=Math.PI/2;rim.position.y=.16;SC.add(rim);
 for(let i=0;i<4;i++){const st=new THREE.Mesh(new THREE.BoxGeometry(3,.16,.9),PB('wood',1,.4));st.position.set(0,.08-i*.0,15.6+i*.0);if(i)continue;st.receiveShadow=true;SC.add(st)}
 // ---------- középső szőnyeg (mandala) ----------
 const mand=cvT(1024,1024,(x,w)=>{x.fillStyle='#5b1a1a';x.fillRect(0,0,w,w);x.translate(512,512);const C=['#b45309','#f59e0b','#7c2d12','#fde68a','#9a3412','#b91c1c'];for(let r=480;r>40;r-=36){x.fillStyle=C[(r/36|0)%C.length];x.beginPath();x.arc(0,0,r,0,6.283);x.fill();x.fillStyle=C[((r/36|0)+2)%C.length];const n=Math.max(8,r/18|0);for(let k=0;k<n;k++){x.save();x.rotate(k/n*6.283);x.beginPath();x.ellipse(r-14,0,10,6,0,0,6.283);x.fill();x.restore()}}
  x.strokeStyle='#fde68a';x.lineWidth=3;for(let k=0;k<16;k++){x.save();x.rotate(k/16*6.283);x.beginPath();x.moveTo(60,0);x.quadraticCurveTo(250,60,470,0);x.stroke();x.restore()}});
 const rug=new THREE.Mesh(new THREE.CircleGeometry(5.2,64),new THREE.MeshStandardMaterial({map:mand,roughness:1,normalMap:tx('carpet',6,6,1)}));rug.rotation.x=-Math.PI/2;rug.position.y=.165;rug.receiveShadow=true;SC.add(rug);
 // ---------- tűzrakóhely ----------
 const rockM=PB('stone',1,1,{color:0x8d939c,roughness:.95,flatShading:true});for(let i=0;i<14;i++){const a=i/14*6.283,r=new THREE.Mesh(new THREE.DodecahedronGeometry(.34,0),rockM);r.position.set(Math.cos(a)*1.3,.36,Math.sin(a)*1.3);r.scale.set(1.1,.75,1);r.rotation.set(Math.random(),Math.random(),Math.random());r.castShadow=r.receiveShadow=true;SC.add(r)}
 const ash=new THREE.Mesh(new THREE.CircleGeometry(1.1,24),new THREE.MeshStandardMaterial({color:0x1a1210,roughness:1,emissive:0x3a0d00,emissiveIntensity:.6}));ash.rotation.x=-Math.PI/2;ash.position.y=.18;SC.add(ash);
 const barkM=PB('bark',1,2,{color:0x8a6a50});for(let i=0;i<5;i++){const l=new THREE.Mesh(new THREE.CylinderGeometry(.11,.14,1.5,10),barkM);l.position.set(Math.cos(i*1.26)*.25,.42,Math.sin(i*1.26)*.25);l.rotation.z=1.15;l.rotation.y=i*1.26;l.castShadow=true;SC.add(l)}
 const FLM=cvT(64,128,(x)=>{const g=x.createRadialGradient(32,96,2,32,80,60);g.addColorStop(0,'rgba(255,255,220,1)');g.addColorStop(.3,'rgba(255,190,60,.95)');g.addColorStop(.65,'rgba(255,80,20,.6)');g.addColorStop(1,'rgba(120,20,0,0)');x.fillStyle=g;x.beginPath();x.moveTo(32,0);x.bezierCurveTo(70,60,60,128,32,128);x.bezierCurveTo(4,128,-6,60,32,0);x.fill()});FLM.encoding=THREE.LinearEncoding;
 for(let i=0;i<7;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:FLM,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,color:[0xffffff,0xffd08a,0xff9a3a][i%3]}));const a=i/7*6.283,rr=i?.3:0;s.position.set(Math.cos(a)*rr,.95+(i?0:.15),Math.sin(a)*rr);s.scale.set(i?.7:1,i?1.3:1.9,1);s.userData.b=s.scale.clone();SC.add(s);flames.push(s)}
 glow(0xff7a1a,5.5,0,1.1,0,.55);COL.push({x:0,z:0,r:1.75});
 const EMB=[];{const g=new THREE.SphereGeometry(.035,4,3),m=new THREE.MeshBasicMaterial({color:0xffb347});for(let i=0;i<40;i++){const e=new THREE.Mesh(g,m);e.userData={t:Math.random()*3,x:(Math.random()-.5)*.6,z:(Math.random()-.5)*.6,v:.7+Math.random()*.8};SC.add(e);EMB.push(e)}}
 const SMK=[];{const sm=cvT(64,64,(x)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(140,140,150,.5)');g.addColorStop(1,'rgba(140,140,150,0)');x.fillStyle=g;x.fillRect(0,0,64,64)});for(let i=0;i<10;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:sm,transparent:true,depthWrite:false,opacity:.3}));s.userData={t:i*.4};SC.add(s);SMK.push(s)}}
 // ---------- párnák ----------
 const PC=[0xf472b6,0xa78bfa,0x38bdf8,0x4ade80,0xfbbf24,0xf87171];for(let i=0;i<6;i++){const a=i/6*6.283+Math.PI/6,x=Math.cos(a)*3.3,z=Math.sin(a)*3.3;const c=new THREE.Mesh(new THREE.CylinderGeometry(.62,.66,.32,24),PB('fleece',1,1,{color:PC[i],roughness:1,emissive:PC[i],emissiveIntensity:.18}));c.position.set(x,.33,z);c.castShadow=c.receiveShadow=true;SC.add(c);
  const tf=new THREE.Mesh(new THREE.TorusGeometry(.6,.05,6,24),new THREE.MeshStandardMaterial({color:0xfde68a,roughness:.6}));tf.rotation.x=Math.PI/2;tf.position.set(x,.49,z);SC.add(tf);SEATS.push({x,z,y:.48,ry:Math.atan2(-x,-z),k:'párna'});COL.push({x,z,r:.45})}
 // ---------- padok ----------
 const dw=PB('darkwood',1,1,{color:0xa0784e});[[0,-9,0],[2,9,Math.PI]].forEach(([x,z,ry])=>{const b=new THREE.Group();b.position.set(x,0,z);b.rotation.y=ry;SC.add(b);
  for(let k=0;k<3;k++){const sl=new THREE.Mesh(new THREE.BoxGeometry(3.4,.1,.24),dw);sl.position.set(0,.78,-.28+k*.28);b.add(sl)}for(let k=0;k<3;k++){const sl=new THREE.Mesh(new THREE.BoxGeometry(3.4,.18,.07),dw);sl.position.set(0,1.05+k*.24,-.42);sl.rotation.x=-.15;b.add(sl)}
  [-1.5,1.5].forEach(dx=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.12,.75,.8),dw);l.position.set(dx,.4,0);b.add(l);const ar=new THREE.Mesh(new THREE.BoxGeometry(.12,.08,.85),dw);ar.position.set(dx,1.02,0);b.add(ar)});shadowAll(b);
  [-.8,.8].forEach(dx=>SEATS.push({x:x+(ry?-dx:dx),z,y:.85,ry,k:'pad'}));COL.push({x,z,r:1.7})});
 // ---------- függőágy ----------
 [[-10.4,-6],[-5.6,-6]].forEach(([x,z])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.15,.18,3,10),PB('bark',1,2));p.position.set(x,1.5,z);p.castShadow=true;SC.add(p);COL.push({x,z,r:.35})});
 const stripe=cvT(256,64,(x,w,h)=>{const C=['#f59e0b','#fef3c7','#ef4444','#fef3c7','#0ea5e9','#fef3c7'];for(let i=0;i<12;i++){x.fillStyle=C[i%C.length];x.fillRect(i*w/12,0,w/12,h)}});stripe.wrapS=THREE.RepeatWrapping;
 hammock=new THREE.Group();hammock.position.set(-8,1.95,-6);SC.add(hammock);const hm=new THREE.Mesh(new THREE.CylinderGeometry(.78,.78,4.2,24,1,true,Math.PI*.15,Math.PI*.7),new THREE.MeshStandardMaterial({map:stripe,side:THREE.DoubleSide,roughness:1}));hm.rotation.z=Math.PI/2;hm.rotation.x=Math.PI;hm.position.y=-.2;hm.castShadow=true;hammock.add(hm);
 SEATS.push({x:-8,z:-6,y:1.05,ry:0,k:'függőágy',ham:1});
 // ---------- teaház (pavilon) ----------
 const pv=new THREE.Group();pv.position.set(7,0,-5);SC.add(pv);[[-2,-1.6],[2,-1.6],[-2,1.6],[2,1.6]].forEach(([x,z])=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,3.4,10),new THREE.MeshStandardMaterial({color:0x7f1d1d,roughness:.5}));c.position.set(x,1.7,z);pv.add(c)});
 const roofM=PB('roof',4,2,{color:0x57534e,side:THREE.DoubleSide,transparent:true});const rf=new THREE.Mesh(new THREE.ConeGeometry(3.9,1.6,4,1,true),roofM);rf.rotation.y=Math.PI/4;rf.position.y=4.1;rf.scale.set(1.15,1,.95);pv.add(rf);const rf2=new THREE.Mesh(new THREE.ConeGeometry(1.4,1,4),roofM);rf2.rotation.y=Math.PI/4;rf2.position.y=5.2;pv.add(rf2);
 const tip=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),new THREE.MeshStandardMaterial({color:0xd4af37,metalness:.9,roughness:.25}));tip.position.y=5.8;pv.add(tip);
 const cnt=new THREE.Mesh(new THREE.BoxGeometry(3,1.05,1.2),PB('darkwood',2,1,{color:0x9a6b45}));cnt.position.set(0,.68,0);pv.add(cnt);const top=new THREE.Mesh(new THREE.BoxGeometry(3.2,.1,1.4),PB('wood',2,1,{color:0xe5c9a0}));top.position.set(0,1.25,0);pv.add(top);
 const stv=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,.16,20),new THREE.MeshStandardMaterial({color:0x1f2937,emissive:0xff4d00,emissiveIntensity:.8,metalness:.6}));stv.position.set(-.7,1.38,0);pv.add(stv);glow(0xff5a1a,.9,-.7,1.42,0,.6,pv);
 const cop=new THREE.MeshStandardMaterial({color:0xb87333,metalness:.95,roughness:.28});const kt=new THREE.Mesh(new THREE.SphereGeometry(.32,24,16),cop);kt.position.set(-.7,1.74,0);kt.scale.y=.85;pv.add(kt);const sp=new THREE.Mesh(new THREE.CylinderGeometry(.04,.07,.42,10),cop);sp.position.set(-.38,1.82,0);sp.rotation.z=-1;pv.add(sp);const hd=new THREE.Mesh(new THREE.TorusGeometry(.2,.03,6,16,Math.PI),cop);hd.position.set(-.7,2,0);pv.add(hd);
 const cer=c=>new THREE.MeshStandardMaterial({color:c,roughness:.25,metalness:.05});[[.2,0xf8fafc],[.55,0xbfdbfe],[.9,0xfecaca],[1.25,0xd9f99d]].forEach(([x,c])=>{const cu=new THREE.Mesh(new THREE.CylinderGeometry(.09,.07,.15,16),cer(c));cu.position.set(x,1.38,.35);pv.add(cu)});
 const tp=new THREE.Mesh(new THREE.SphereGeometry(.24,20,14),cer(0x14532d));tp.position.set(.8,1.5,-.25);tp.scale.y=.8;pv.add(tp);const tl=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),cer(0x14532d));tl.position.set(.8,1.7,-.25);pv.add(tl);
 shadowAll(pv);rf.receiveShadow=false;
 const LAN=[];const lanT=cvT(64,128,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#7f1d1d');g.addColorStop(.5,'#ef4444');g.addColorStop(1,'#7f1d1d');x.fillStyle=g;x.fillRect(0,0,w,h);x.strokeStyle='#450a0a';x.lineWidth=3;for(let y=16;y<h;y+=18){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}x.fillStyle='#fde68a';x.font='bold 34px serif';x.textAlign='center';x.fillText('茶',32,76)});
 [[-2,-1.6],[2,-1.6],[-2,1.6],[2,1.6]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,3.05,z);pv.add(g);const l=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.5,16),new THREE.MeshStandardMaterial({map:lanT,emissive:0xff6a3a,emissiveMap:lanT,emissiveIntensity:1.3}));l.position.y=-.3;g.add(l);glow(0xff6a3a,1.6,0,-.3,0,.7,g);LAN.push(g)});
 const sg=spr('🍵 TEAHÁZ (E)',2.2,'x');sg.position.set(7,6.6,-5);SC.add(sg);COL.push({x:7,z:-5,r:1.7});
 // macskakő út a teaházig
 const cob=PB('cobble',1,1,{color:0xb8b2a8});for(let i=0;i<9;i++){const t=i/8,x=1.8+t*4.6,z=-1.4-t*2.4,s=new THREE.Mesh(new THREE.CylinderGeometry(.42,.46,.06,10),cob);s.position.set(x+(i%2?.2:-.2),.19,z);s.receiveShadow=true;SC.add(s)}
 // ---------- koi-tó ----------
 const wn=tx('pool',2,2,1);const water=new THREE.Mesh(new THREE.CircleGeometry(2.85,48),new THREE.MeshStandardMaterial({color:0x1b5f8a,roughness:.06,metalness:.35,normalMap:wn,normalScale:new THREE.Vector2(.6,.6),transparent:true,opacity:.92,envMapIntensity:1}));water.rotation.x=-Math.PI/2;water.position.set(-6,.2,7);SC.add(water);
 const bed=new THREE.Mesh(new THREE.CircleGeometry(2.85,48),new THREE.MeshStandardMaterial({color:0x0b2a3a,roughness:1}));bed.rotation.x=-Math.PI/2;bed.position.set(-6,.1,7);SC.add(bed);glow(0x38bdf8,6,-6,.3,7,.18);
 for(let i=0;i<22;i++){const a=i/22*6.283,r=new THREE.Mesh(new THREE.DodecahedronGeometry(.32+Math.random()*.12,0),rockM);r.position.set(-6+Math.cos(a)*3.05,.28,7+Math.sin(a)*3.05);r.scale.set(1.2,.7,1);r.rotation.set(Math.random(),Math.random(),Math.random());r.castShadow=r.receiveShadow=true;SC.add(r)}
 [[-5.2,6.4],[-6.8,7.8],[-5.8,8.4],[-7.2,6.2]].forEach(([x,z],i)=>{const l=new THREE.Mesh(new THREE.CircleGeometry(.36,16,.3,5.6),new THREE.MeshStandardMaterial({color:0x3f8f3a,roughness:.6,side:THREE.DoubleSide}));l.rotation.x=-Math.PI/2;l.position.set(x,.215,z);SC.add(l);
  if(i%2===0){const fl=new THREE.Group();fl.position.set(x+.08,.24,z);SC.add(fl);for(let k=0;k<7;k++){const p=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),new THREE.MeshStandardMaterial({color:0xfbcfe8,emissive:0xf472b6,emissiveIntensity:.35}));p.scale.set(.6,1.4,.5);p.position.set(Math.cos(k/7*6.283)*.08,.07,Math.sin(k/7*6.283)*.08);p.rotation.set(Math.sin(k)*.6,0,Math.cos(k/7*6.283)*.6);fl.add(p)}glow(0xf9a8d4,.6,0,.1,0,.4,fl)}});
 COL.push({x:-6,z:7,r:3.3});
 window._koi=[0,1,2,3,4].map(i=>{const g=new THREE.Group();const C=[0xf97316,0xffffff,0xfacc15,0xef4444,0xf8fafc][i];const b=new THREE.Mesh(new THREE.SphereGeometry(.13,12,8),new THREE.MeshStandardMaterial({color:C,roughness:.3}));b.scale.set(.75,.55,1.9);g.add(b);
  const tl=new THREE.Mesh(new THREE.ConeGeometry(.1,.22,4),new THREE.MeshStandardMaterial({color:C,roughness:.3,transparent:true,opacity:.85}));tl.rotation.x=-Math.PI/2;tl.position.z=-.32;tl.scale.x=.3;g.add(tl);if(i%2){const sp=new THREE.Mesh(new THREE.SphereGeometry(.06,8,6),new THREE.MeshStandardMaterial({color:0xdc2626}));sp.position.set(0,.05,.06);g.add(sp)}
  g.position.set(-6,.14,7);SC.add(g);return{m:g,ph:i*1.25}});
 // kőlámpás (tōrō)
 {const t=new THREE.Group();t.position.set(-9.6,0,9.4);SC.add(t);const sm=PB('stone',1,1,{color:0xa8a29e});[[.5,.3,.15],[.18,.9,.75],[.42,.38,1.38],[.6,.18,1.75],[.12,.3,2]].forEach(([r,h,y],i)=>{const m=new THREE.Mesh(i===2?new THREE.BoxGeometry(r*1.6,h,r*1.6):new THREE.CylinderGeometry(r*(i===3?.4:1),r,h,i===3?4:10),sm);m.position.y=y;if(i===3)m.rotation.y=Math.PI/4;t.add(m)});
  glow(0xffcf7a,1.4,0,1.38,0,.85,t);shadowAll(t);COL.push({x:-9.6,z:9.4,r:.6})}
 // ---------- cseresznyefák ----------
 const PET=[];[[11.5,3],[-11.8,-1.5],[5,12],[-3,-12.5],[11,-9]].forEach(([x,z],k)=>{const g=new THREE.Group();g.position.set(x,0,z);SC.add(g);const tr=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,3.4,10),PB('bark',1,2));tr.position.y=1.7;tr.rotation.z=(k%2?.08:-.08);g.add(tr);
  [[0,4,0,1.6],[1,3.7,.4,1.2],[-1,3.8,-.3,1.25],[.3,4.6,-.5,1.1],[-.5,4.4,.8,1],[.9,4.3,-.9,.9]].forEach(([a,b,c,s],j)=>{const f=new THREE.Mesh(new THREE.IcosahedronGeometry(s,1),new THREE.MeshStandardMaterial({color:j%2?0xf9a8d4:0xfbcfe8,roughness:.9,emissive:0xf472b6,emissiveIntensity:.12,flatShading:true}));f.position.set(a,b,c);g.add(f)});shadowAll(g);COL.push({x,z,r:.6});
  for(let i=0;i<14;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(.08,.06),new THREE.MeshBasicMaterial({color:0xfbcfe8,side:THREE.DoubleSide,transparent:true,opacity:.9}));p.userData={cx:x,cz:z,t:Math.random()*8,ph:Math.random()*6};SC.add(p);PET.push(p)}});
 // ---------- bambuszkerítés + lámpások + fényfüzér ----------
 {const N=180,g=new THREE.CylinderGeometry(.07,.08,1.6,7);g.translate(0,.8,0);const im=new THREE.InstancedMesh(g,new THREE.MeshStandardMaterial({color:0x8fa04a,roughness:.7}),N);const M=new THREE.Matrix4();let n=0;
  for(let i=0;i<N;i++){const a=i/N*6.283;if(Math.abs(Math.atan2(Math.sin(a-Math.PI/2),Math.cos(a-Math.PI/2)))<.14)continue;const r=15.45,h=.8+Math.sin(i*1.7)*.15;M.compose(new THREE.Vector3(Math.cos(a)*r,.12,Math.sin(a)*r),new THREE.Quaternion(),new THREE.Vector3(1,h,1));im.setMatrixAt(n++,M)}im.count=n;im.castShadow=true;SC.add(im)}
 const posts=[];for(let i=0;i<10;i++){const a=i/10*6.283+.31,x=Math.cos(a)*14.2,z=Math.sin(a)*14.2;const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,3.4,8),PB('darkwood',1,2));p.position.set(x,1.7,z);p.castShadow=true;SC.add(p);posts.push([x,z]);
  const ln=new THREE.Group();ln.position.set(x,3.1,z);SC.add(ln);const pl=new THREE.Mesh(new THREE.SphereGeometry(.24,14,10),new THREE.MeshStandardMaterial({color:0xfff1d6,emissive:[0xffc070,0xff9ad5,0x9ad8ff][i%3],emissiveIntensity:1.4}));pl.scale.y=1.25;ln.add(pl);glow([0xffb050,0xff7ac8,0x7ac8ff][i%3],1.8,0,0,0,.75,ln);LAN.push(ln)}
 {const BC=[0xfde68a,0xf472b6,0x67e8f9,0x86efac,0xfca5a5];const bg=new THREE.SphereGeometry(.06,6,5);for(let i=0;i<10;i++){const [x1,z1]=posts[i],[x2,z2]=posts[(i+1)%10];for(let k=1;k<12;k++){const t=k/12,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t,y=3.25-Math.sin(t*Math.PI)*.55;const c=BC[(i*11+k)%5];const b=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:c}));b.position.set(x,y,z);SC.add(b);glow(c,.45,x,y,z,.55)}}}
 // ---------- szentjánosbogarak ----------
 const FF=[];for(let i=0;i<55;i++){const s=glow(0xd9f99d,.35,0,0,0,.9);s.userData={a:Math.random()*6.283,r:5+Math.random()*16,h:.5+Math.random()*2.5,sp:.05+Math.random()*.12,ph:Math.random()*6};FF.push(s)}
 // ---------- üdvözlő tábla ----------
 {const bd=new THREE.Group();bd.position.set(0,0,-13.2);SC.add(bd);[-1.6,1.6].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,2.4,8),PB('darkwood',1,1));p.position.set(x,1.2,0);bd.add(p)});
  const bt=cvT(512,160,(x,w,h)=>{x.fillStyle='#3b2412';x.fillRect(0,0,w,h);x.strokeStyle='#d4a373';x.lineWidth=8;x.strokeRect(6,6,w-12,h-12);x.fillStyle='#fde68a';x.font='bold 54px serif';x.textAlign='center';x.fillText('🫖 TEAKERT',w/2,72);x.font='26px serif';x.fillStyle='#f5deb3';x.fillText('Pihenj · beszélgess · főzz egy teát',w/2,122)});
  const pn=new THREE.Mesh(new THREE.BoxGeometry(3.6,1.1,.1),[PB('darkwood',1,1),PB('darkwood',1,1),PB('darkwood',1,1),PB('darkwood',1,1),new THREE.MeshStandardMaterial({map:bt,roughness:.8}),PB('darkwood',1,1)]);pn.position.y=2.1;bd.add(pn);shadowAll(bd)}
 // ---------- animációk ----------
 window._csAnim=(t,dt)=>{wn.offset.x=t*.02;wn.offset.y=t*.013;
  flames.forEach((f,i)=>{const b=f.userData.b;if(b)f.scale.set(b.x*(1+Math.sin(t*9+i)*.12),b.y*(1+Math.sin(t*13+i*2)*.22),1)});
  EMB.forEach(e=>{const u=e.userData;u.t+=dt*u.v;if(u.t>3){u.t=0;u.x=(Math.random()-.5)*.6;u.z=(Math.random()-.5)*.6}e.position.set(u.x+Math.sin(u.t*3+u.v)*.25*u.t,.9+u.t*1.3,u.z+Math.cos(u.t*2)*.2*u.t);e.scale.setScalar(Math.max(.05,1-u.t/3))});
  SMK.forEach(s=>{const u=s.userData;u.t+=dt*.5;if(u.t>4)u.t=0;s.position.set(Math.sin(u.t*1.3)*.3,2+u.t*1.6,Math.cos(u.t)*.3);s.scale.setScalar(.8+u.t*1.2);s.material.opacity=.32*(1-u.t/4)});
  FF.forEach(s=>{const u=s.userData;u.a+=dt*u.sp;s.position.set(Math.cos(u.a)*u.r,u.h+Math.sin(t*1.5+u.ph)*.4,Math.sin(u.a)*u.r);s.material.opacity=.45+Math.sin(t*4+u.ph)*.45});
  PET.forEach(p=>{const u=p.userData;u.t+=dt*.35;if(u.t>8)u.t=0;p.position.set(u.cx+Math.sin(u.t*1.2+u.ph)*1.6+u.t*.35,4.6-u.t*.58,u.cz+Math.cos(u.t+u.ph)*1.2);p.rotation.set(t*2+u.ph,t*1.3,u.ph)});
  LAN.forEach((l,i)=>{l.rotation.z=Math.sin(t*1.1+i)*.05;l.rotation.x=Math.cos(t*.9+i)*.04});
  pavL.intensity=1+Math.sin(t*3)*.08;{const d=Math.hypot(CAM.position.x-7,CAM.position.z+5),o=d<4.5?.18:d<7?.18+(d-4.5)/2.5*.82:1;roofM.opacity=o;roofM.depthWrite=o>.99}moon.lookAt(CAM.position)};
 addEventListener('resize',fit);fit()}
function fit(){if(!R)return;const w=innerWidth,h=innerHeight;R.setSize(w,h,false);CAM.aspect=w/h;CAM.updateProjectionMatrix()}
// ---------- szereplők ----------
function mkAvatar(id,name,av,col,npc){const c=typeof col==='string'?parseInt(col.replace('#',''),16):col;const m=person(c||0xffd23f,av||'😎',1);m.children.filter(x=>x.isSprite).forEach(s=>m.remove(s));SC.add(m);m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});const rg=rig(m);
 const cup=new THREE.Group();const cm=new THREE.Mesh(new THREE.CylinderGeometry(.1,.08,.18,12),MS(0xffffff));const tea=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.02,12),MS(0x92400e));tea.position.y=.08;cup.add(cm,tea);cup.position.set(0,-.86,.14);cup.visible=false;rg.ap[1].add(cup);
 const rod=new THREE.Group();const rs=new THREE.Mesh(new THREE.CylinderGeometry(.025,.035,2.4,6),MS(0x5b3a1e));rs.position.set(0,1.1,0);rod.add(rs);const tip=new THREE.Object3D();tip.position.set(0,2.3,0);rod.add(tip);rod.position.set(0,-.86,.1);rod.rotation.x=.9;rod.visible=false;rg.ap[1].add(rod);
 const p={id,name,av,col,npc,m,cup,cupBody:cm,teaM:tea,rod,tip,lp:rg.lp,ap:rg.ap,fish:null,x:0,z:0,ry:0,tx:0,tz:0,try:0,sit:-1,cupN:'',bub:'',bubT:0,talk:false,wave:0,dance:0,mv:false};P[id]=p;
 const t=document.createElement('div');t.className='csTag';$$('csTags').appendChild(t);TAGS[id]=t;return p}
function rig(m){const lb={};m.traverse(o=>{if(o.userData&&o.userData.limb)lb[o.userData.limb]=o});if(lb.lleg&&lb.rleg&&lb.larm&&lb.rarm)return{lp:[lb.lleg,lb.rleg],ap:[lb.larm,lb.rarm]};
 const ch=m.children.slice(),lp=[],ap=[];[0,1].forEach(k=>{const leg=ch[k],pv=new THREE.Group();pv.position.set(leg.position.x,.9,0);m.add(pv);pv.add(leg);leg.position.set(0,-.45,0);lp.push(pv)});
 [[4,6],[5,7]].forEach(([a,h])=>{const arm=ch[a],hand=ch[h],pv=new THREE.Group();pv.position.set(arm.position.x,1.8,0);m.add(pv);pv.add(arm,hand);arm.position.set(0,-.4,0);hand.position.set(0,-.85,0);ap.push(pv)});return{lp,ap}}
function applyCup(p,v,mine){if(!v){p.cupN='';p.cup.visible=false;return}if(String(v).includes('|')&&window.teaInfo){const q=String(v).split('|');const info=teaInfo(q[0],q[1]==='1',+q[2],q[3]==='1');p.cupN=info.name;p.teaM.material=new THREE.MeshStandardMaterial({map:teaTopTex(info),roughness:.15,metalness:.1});p.cupBody.material=new THREE.MeshStandardMaterial({color:parseInt(info.mugCol.slice(1),16),roughness:.3})}else p.cupN=v;p.cup.visible=true;if(!mine)say(p,'🍵 '+p.cupN+' kész!',3)}
function rmAvatar(id){const p=P[id];if(!p)return;SC.remove(p.m);if(TAGS[id]){TAGS[id].remove();delete TAGS[id]}delete P[id]}
function say(p,t,sec){p.bub=t;p.bubT=sec||6}
function log(n,t,col){const l=$$('csLog');const d=document.createElement('div');d.innerHTML=(n?'<b'+(col?' style="color:'+col+'"':'')+'>'+esc(n)+':</b> ':'')+esc(t);l.appendChild(d);while(l.children.length>8)l.firstChild.remove();setTimeout(()=>{d.style.transition='opacity 1s';d.style.opacity=.35},12000)}
const NPC=[['npc1','Teás Tünde','🍵','#f472b6',0],['npc2','Hesszelő Huba','😌','#38bdf8',10],['npc3','Gitáros Gergő','🎸','#a3e635',3]];
const LINES=['Ez a mentás tea valami csodás. 🍃','Ki nyert ma meccset?','Imádom ezt a tábortüzet. 🔥','Valaki főzzön még egy kannával!','Hallottátok a VSport tegnapi eredményeit?','Csak lazán, ma nincs sietség. 😌','A kutyám ma szintet lépett! 🐕','Na, ki jön egy körre a Battle Royale-ba?','Nézzétek, milyen szépek ma a csillagok. ✨','A koi-halak is pihennek már.','Melyik a kedvenc teátok?','Most jöttem az edzőpályáról, fáj a karom. 😅'];
const FLAV=['Mentás','Kamilla','Gyümölcs','Matcha','Earl Grey','Jázmin','Rooibos','Gyömbéres'];
// ---------- megnyitás / bezárás ----------
let open=false;
window.openCommunity=()=>{if(!window.THREE||typeof person!=='function')return;if(!built)build();open=true;D.classList.add('on');fit();
 if(!ME){const a=ACC(),u=a&&a.user;ME=mkAvatar('me',myName(),(u&&u.avatar)||($$('lbAv')&&$$('lbAv').firstChild?$$('lbAv').firstChild.textContent:'😎'),(u&&u.color)||'#ffd23f');ME.me=true}
 ME.x=ME.tx=Math.random()*2-1;ME.z=ME.tz=6;ME.ry=Math.PI;ME.sit=-1;
 if(logged())K().wsend({t:'cs_join',x:ME.x,z:ME.z,ry:ME.ry,av:ME.av,col:ME.col,sit:-1,cup:''});
 log('','👋 Üdv a Teakertben! Ülj le a tűz mellé (E), vagy főzz egy teát a pultnál.');if(!logged())log('','ℹ️ Vendégként a többi játékost nem látod – jelentkezz be a közös térhez és a hanghoz.');
 last=performance.now();cancelAnimationFrame(raf);loop()};
function close(){open=false;D.classList.remove('on');cancelAnimationFrame(raf);if(logged())K().wsend({t:'cs_leave'});Object.keys(P).forEach(id=>{if(!P[id].npc&&id!=='me')rmAvatar(id)});stopRec(true)}
$$('csX').onclick=close;
// ---------- hálózat ----------
let lastSend=0;function sendPos(force){if(!logged())return;const n=performance.now();if(!force&&n-lastSend<120)return;lastSend=n;K().wsend({t:'cs_pos',x:+ME.x.toFixed(2),z:+ME.z.toFixed(2),ry:+ME.ry.toFixed(2),mv:ME.mv})}
const act=(a,v)=>{if(logged())K().wsend({t:'cs_act',a,v})};
function upsert(o){if(!o||!o.name||o.name===myName())return null;let p=P['u_'+o.name];if(!p)p=mkAvatar('u_'+o.name,o.name,o.av,o.col,false);p.x=p.tx=o.x||0;p.z=p.tz=o.z||0;p.ry=p.try=o.ry||0;if(o.sit>=0)sitP(p,o.sit);if(o.cup){p.cupN=o.cup;p.cup.visible=true}return p}
addEventListener('krws',e=>{const m=e.detail;if(!open||!built||!m.t||!m.t.startsWith('cs_'))return;
 if(m.t==='cs_list')m.list.forEach(upsert);
 else if(m.t==='cs_join'){const p=upsert(m.p);if(p){log('','✨ '+p.name+' megérkezett a Teakertbe.');say(p,'👋 Sziasztok!',4)}}
 else if(m.t==='cs_leave'){const p=P['u_'+m.name];if(p){log('','👋 '+p.name+' elment.');rmAvatar('u_'+m.name)}}
 else{const p=P['u_'+m.name];if(!p)return;
  if(m.t==='cs_pos'){p.tx=m.x;p.tz=m.z;p.try=m.ry;p.mv=m.mv;if(p.sit>=0&&m.mv)standP(p)}
  else if(m.t==='cs_chat'){say(p,m.text);log(p.name,m.text,'#a5f3fc')}
  else if(m.t==='cs_act'){const a=m.a;if(a==='sit')sitP(p,+m.v);else if(a==='stand')standP(p);else if(a==='cup'){applyCup(p,m.v,false)}else if(a==='sip'){say(p,'☕ *kortyol*',2.5);p.sip=1}else if(a==='wave'){p.wave=2.2;say(p,'👋',2)}else if(a==='fish'){if(m.v==='1')startFish(p,false);else stopFish(p)}else if(a==='catch'){say(p,'🐟 '+m.v,4);log(p.name,'kifogott egy: '+m.v,'#a5f3fc');stopFish(p)}else if(a==='dance'){p.dance=4}else if(a==='talk'){p.talk=m.v==='1'}}
  if(m.t==='cs_voice'){try{const au=new Audio(m.d);p.talk=true;au.onended=()=>p.talk=false;au.onerror=()=>p.talk=false;au.play().catch(()=>p.talk=false)}catch(e){}}}});
// ---------- ülés ----------
const seatTaken=i=>Object.values(P).some(p=>p.sit===i);
function sitP(p,i){const s=SEATS[i];if(!s)return;stopFish(p);p.sit=i;p.x=p.tx=s.x;p.z=p.tz=s.z;p.ry=p.try=s.ry}
function standP(p){p.sit=-1}
// ---------- vezérlés ----------
const KD={};let camYaw=Math.PI,camDist=8,drag=null,brew=0;
const typing=()=>document.activeElement===$$('csInp');
addEventListener('keydown',e=>{if(!open)return;const k=e.key.toLowerCase();
 if(typing()){if(k==='enter'){sendChat();e.preventDefault()}else if(k==='escape'){$$('csInp').blur()}e.stopImmediatePropagation();return}
 if(k==='escape'){close();e.stopImmediatePropagation();e.preventDefault();return}
 if(k==='enter'||k==='t'){$$('csInp').focus();e.preventDefault();e.stopImmediatePropagation();return}
 KD[k]=true;if(!e.repeat){if(k==='e')interact();else if(k==='q')sip();else if(k==='1'){ME.wave=2.2;say(ME,'👋',2);act('wave','1')}else if(k==='2'){ME.dance=4;act('dance','1')}else if(k==='v')startRec()}
 e.stopImmediatePropagation()},true);
addEventListener('keyup',e=>{if(!open)return;const k=e.key.toLowerCase();KD[k]=false;if(k==='v')stopRec();e.stopImmediatePropagation()},true);
$$('csCv').addEventListener('pointerdown',e=>{drag=e.clientX;$$('csInp').blur()});addEventListener('pointerup',()=>drag=null);addEventListener('pointermove',e=>{if(open&&drag!==null){camYaw-=(e.clientX-drag)*.008;drag=e.clientX}});
$$('csCv').addEventListener('wheel',e=>{camDist=Math.max(3.5,Math.min(14,camDist+e.deltaY*.01));e.preventDefault()},{passive:false});
$$('csSend').onclick=sendChat;
function sendChat(){const i=$$('csInp'),t=i.value.trim();if(!t){i.blur();return}i.value='';say(ME,t);log(myName(),t,'#fde68a');if(logged())K().wsend({t:'cs_chat',text:t});i.blur()}
const POND={x:-6,z:7,r:2.8};const nearPond=p=>{const d=Math.hypot(p.x-POND.x,p.z-POND.z);return d>POND.r-.2&&d<POND.r+1.6};
function interact(){if(ME.fish){reel();return}if(ME.sit>=0){standP(ME);act('stand','');return}
 if(Math.hypot(ME.x-station.x,ME.z-station.z)<2.6){if(ME.cupN){hint('Már van teád – kortyolj bele (Q)!');return}if(window.openTeaMaker){KD.w=KD.a=KD.s=KD.d=false;openTeaMaker(r=>{const v=r.key+'|'+(r.lemon?1:0)+'|'+r.mug+'|'+(r.honey?1:0);applyCup(ME,v,true);ME.sips=0;say(ME,'🍵 Kész a '+r.name+'! ('+r.q+'% ⭐)',3.5);log(myName(),'főzött egy '+r.name+'-t ('+r.q+'%)','#fde68a');act('cup',v);try{sfx('magic')}catch(e){}})}else brew=3;return}
 let best=-1,bd=1.8;SEATS.forEach((s,i)=>{const d=Math.hypot(ME.x-s.x,ME.z-s.z);if(d<bd&&!seatTaken(i)){bd=d;best=i}});if(best>=0){sitP(ME,best);act('sit',best);return}
 if(nearPond(ME)){startFish(ME,true);return}
 if(ME.cupN)sip();else hint('Menj egy párnához, padhoz, a függőágyhoz, a teapulthoz – vagy horgássz a tónál!')}
const FISH=[['Arany koi',1,.6,2.4,40],['Fehér koi',1,.5,2,40],['Pöttyös koi',1,.5,2.2,40],['Ezüst keszeg',1,.2,.9,0],['Holdfény-ponty',2,1,4.5,120],['Szivárvány-pisztráng',2,.6,2.8,120],['Csillagpikkelyes harcsa',3,3,9,400],['Bölcs öreg teknős',3,4,12,400],['Elveszett csizma 🥾',0,.4,.6,0],['Üzenet egy palackban 📜',0,.2,.3,25]];
const FK='k3fish';const FJ=(()=>{try{return JSON.parse(localStorage.getItem(FK)||'{}')}catch(e){return{}}})();
function startFish(p,mine){stopFish(p);p.sit=-1;const a=Math.atan2(p.z-POND.z,p.x-POND.x)+Math.PI+(Math.random()-.5)*.8,r=Math.random()*1.4+.4;const bx=POND.x+Math.cos(a)*r,bz=POND.z+Math.sin(a)*r;
 const bob=new THREE.Group();const b1=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),MS(0xef4444));const b2=new THREE.Mesh(new THREE.SphereGeometry(.091,10,8,0,6.283,0,1.4),MS(0xffffff));b2.rotation.x=Math.PI;b1.add(b2);bob.add(b1);bob.position.set(bx,.26,bz);SC.add(bob);
 const lg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);const line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xe5e7eb}));SC.add(line);
 p.fish={bob,line,bx,bz,t:0,wait:3+Math.random()*6,bite:0,mine};p.rod.visible=true;p.ry=p.try=Math.atan2(bx-p.x,bz-p.z);if(mine){act('fish','1');say(p,'🎣 Bedobtam…',2);hint('🎣 Várj a kapásra… utána tartsd középen a halat a csíkon (E nyomva tartva)!')}}
function stopFish(p){if(!p||!p.fish)return;SC.remove(p.fish.bob);SC.remove(p.fish.line);p.fish=null;p.rod.visible=false;if(p.me)fishUI(null)}
function fishTick(p,dt,t){const f=p.fish;if(!f)return;f.t+=dt;if(p.me&&(p.mv||p.sit>=0)){stopFish(p);act('fish','0');return}
 p.tip.getWorldPosition(V);const pos=f.line.geometry.attributes.position;pos.setXYZ(0,V.x,V.y,V.z);pos.setXYZ(1,f.bob.position.x,f.bob.position.y+.05,f.bob.position.z);pos.needsUpdate=true;
 if(!p.me){f.bob.position.y=.26+Math.sin(t*3)*.02;return}
 const g=f.game;
 if(g){// --- csíkos minijáték: a jelzőt középen kell tartani ---
  const hold=!!(KD.e||KD[' ']);g.pullT-=dt;if(g.pullT<=0){g.pullT=.35+Math.random()*.7;g.pull=(Math.random()*2-1)*1.7*g.diff}
  g.vel+=((hold?2.9:-2.4)+g.pull)*dt;g.vel*=Math.pow(.25,dt);g.pos+=g.vel*dt;if(g.pos<0){g.pos=0;g.vel=0}if(g.pos>1){g.pos=1;g.vel=0}
  const inZ=Math.abs(g.pos-.5)<g.zone/2;g.prog+=(inZ?.3:-.2*g.diff)*dt;f.bob.position.y=.12+Math.sin(t*(inZ?18:34))*.05;
  fishUI(g,inZ);if(g.prog>=1){fishUI(null);land(f.fz)}else if(g.prog<=0){fishUI(null);say(p,'💨 Elszökött…',2);hint('Elszökött – próbáld újra (E a tó partján)!');stopFish(p);act('fish','0')}}
 else{f.bob.position.y=.26+Math.sin(t*3)*.02;if(f.t>=f.wait){const roll=Math.random(),pool=FISH.filter(x=>roll<.04?x[1]===3:roll<.22?x[1]===2:roll<.32?x[1]===0:x[1]===1);f.fz=pool[Math.random()*pool.length|0];const r=f.fz[1];
  f.game={pos:.5,vel:0,prog:.3,pull:0,pullT:0,diff:r===3?1.55:r===2?1.25:1,zone:r===3?.18:r===2?.22:.26};say(p,'❗ KAPÁS!',1.3);try{sfx('hit')}catch(e){}}}}
const fui=document.createElement('div');fui.id='csFish';fui.innerHTML='<div class="h">🎣 TARTSD KÖZÉPEN!</div><div class="tr"><i class="z"></i><b class="k">🐟</b></div><div class="pg"><i></i></div><div class="s">E (vagy Space) nyomva = jobbra · elengedve = balra</div>';D.appendChild(fui);
{const st=document.createElement('style');st.textContent=`#csFish{position:absolute;left:50%;top:62%;transform:translateX(-50%);width:440px;display:none;background:#0b1022e6;border:2px solid #38bdf8;border-radius:16px;padding:12px 16px;text-align:center;box-shadow:0 10px 30px #000}
#csFish .h{font:20px 'Luckiest Guy',Impact;color:#7dd3fc;margin-bottom:8px}#csFish .tr{position:relative;height:34px;border-radius:17px;background:linear-gradient(90deg,#7f1d1d,#1e293b 30%,#1e293b 70%,#7f1d1d);overflow:hidden;border:1px solid #ffffff33}
#csFish .z{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);background:#22c55e88;border-left:2px solid #4ade80;border-right:2px solid #4ade80}
#csFish .k{position:absolute;top:50%;font-size:26px;transform:translate(-50%,-50%);transition:none;filter:drop-shadow(0 2px 2px #000)}#csFish.in .tr{box-shadow:0 0 14px #4ade80}
#csFish .pg{height:10px;border-radius:5px;background:#1e293b;margin-top:10px;overflow:hidden}#csFish .pg i{display:block;height:100%;width:30%;background:linear-gradient(90deg,#facc15,#4ade80)}#csFish .s{font:600 13px Rajdhani;color:#94a3b8;margin-top:6px}`;document.head.appendChild(st)}
function fishUI(g,inZ){if(!g){fui.style.display='none';return}fui.style.display='block';fui.classList.toggle('in',!!inZ);fui.querySelector('.z').style.width=(g.zone*100)+'%';fui.querySelector('.k').style.left=(4+g.pos*92)+'%';fui.querySelector('.pg i').style.width=Math.max(0,Math.min(100,g.prog*100))+'%'}
function reel(){const f=ME.fish;if(!f)return;if(!f.game)say(ME,'🎣 Még nincs kapás… várj, amíg megmerül az úszó!',1.8)}
function land(fz){const w=+(fz[2]+Math.random()*(fz[3]-fz[2])).toFixed(2);
 const rec=FJ[fz[0]]||{n:0,best:0};rec.n++;const nb=w>rec.best;rec.best=Math.max(rec.best,w);FJ[fz[0]]=rec;try{localStorage.setItem(FK,JSON.stringify(FJ))}catch(e){}
 const txt='🐟 '+fz[0]+(fz[1]?' – '+w.toLocaleString('hu-HU')+' kg':'')+(fz[1]===3?' ✨ RITKA!':'')+(nb&&fz[1]?' 🏆 új egyéni rekord!':'');say(ME,txt,4);log(myName(),txt,'#fde68a');act('catch',fz[0]+(fz[1]?' ('+w+' kg)':''));
 if(fz[4]&&window.BR){BR.zs=(BR.zs|0)+fz[4];try{st.s('k3br',BR)}catch(e){}hint('+'+fz[4]+' 🪙 zseton a fogásért!')}try{sfx(fz[1]===3?'win':'coin')}catch(e){}stopFish(ME);
 const tot=Object.values(FJ).reduce((a,b)=>a+b.n,0);if(tot%5===0)log('','📖 Horgásznapló: '+tot+' fogás · '+Object.keys(FJ).length+'/'+FISH.length+' fajta')}
function sip(){if(!ME.cupN){hint('Nincs teád – főzz egyet a teapultnál (E)!');return}ME.sip=1;ME.sips=(ME.sips||0)+1;say(ME,'☕ *kortyol* – '+ME.cupN+' tea',2.5);act('sip','1');try{sfx('coin')}catch(e){}if(ME.sips>=6){ME.sips=0;ME.cupN='';ME.cup.visible=false;act('cup','');hint('🍵 Elfogyott a tea – főzz egy újat!')}}
let hintT=0;function hint(t){const h=$$('csHint');h.textContent=t;h.style.display='block';hintT=2.5}
// ---------- push-to-talk ----------
let rec=null,chunks=[],stream=null,recT=0,micBusy=false;
async function startRec(){if(rec||micBusy)return;micBusy=true;try{if(!stream)stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true}})}catch(e){micBusy=false;hint('🎙️ Nincs mikrofon-engedély.');return}
 micBusy=false;if(!KD.v)return;const mt=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/webm'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t))||'';
 try{rec=new MediaRecorder(stream,mt?{mimeType:mt,audioBitsPerSecond:24000}:{})}catch(e){hint('🎙️ A böngésző nem támogatja a hangfelvételt.');return}chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 rec.onstop=()=>{const b=new Blob(chunks,{type:rec&&rec.mimeType||'audio/webm'});rec=null;if(b.size<800)return;const fr=new FileReader();fr.onload=()=>{const d=fr.result;if(logged()){if(d.length<370000)K().wsend({t:'cs_voice',d});else hint('🎙️ Túl hosszú üzenet.')}else{const a=new Audio(d);ME.talk=true;a.onended=()=>ME.talk=false;a.play().catch(()=>ME.talk=false);hint('🔁 Vendégként csak te hallod vissza – bejelentkezve mindenki hallja.')}};fr.readAsDataURL(b)};
 rec.start();recT=12;ME.talk=true;act('talk','1');$$('csMic').classList.add('on');$$('csMicT').textContent='ADÁS… (engedd el a V-t)'}
function stopRec(silent){if(rec&&rec.state==='recording'){rec.stop();act('talk','0')}ME&&(ME.talk=false);$$('csMic').classList.remove('on');$$('csMicT').textContent='V – nyomd és beszélj'}
// ---------- ciklus ----------
const V=new THREE.Vector3();
function loop(){if(!open)return;raf=requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.05,(n-last)/1000);last=n;const t=n/1000;
 // saját mozgás
 let mx=0,mz=0;if(KD.w)mz-=1;if(KD.s)mz+=1;if(KD.a)mx-=1;if(KD.d)mx+=1;ME.mv=false;
 if((mx||mz)&&brew<=0){if(ME.sit>=0){standP(ME);act('stand','')}const a=camYaw,fx=-Math.sin(a),fz=-Math.cos(a),rx=Math.cos(a),rz=-Math.sin(a);let vx=fx*-mz+rx*mx,vz=fz*-mz+rz*mx;const l=Math.hypot(vx,vz);vx/=l;vz/=l;
  let nx=ME.x+vx*4.6*dt,nz=ME.z+vz*4.6*dt;if(Math.hypot(nx,nz)>14.2){const k=14.2/Math.hypot(nx,nz);nx*=k;nz*=k}for(const c of COL){const d=Math.hypot(nx-c.x,nz-c.z);if(d<c.r+.35){const k=(c.r+.35)/d;nx=c.x+(nx-c.x)*k;nz=c.z+(nz-c.z)*k}}
  ME.x=ME.tx=nx;ME.z=ME.tz=nz;ME.ry=ME.try=Math.atan2(vx,vz);ME.mv=true;sendPos()}else if(ME._wasMv)sendPos(true);ME._wasMv=ME.mv;
 // teafőzés
 const bar=$$('csBar');if(brew>0){brew-=dt;bar.style.display='block';$$('csBt').textContent='🫖 Teafőzés…';$$('csBr').style.background='conic-gradient(#f59e0b '+((1-brew/3)*360)+'deg,#0008 0)';if(Math.random()<.4)puff(6.45,2.05,-5);
  if(brew<=0){bar.style.display='none';ME.cupN=FLAV[Math.random()*FLAV.length|0];ME.cup.visible=true;ME.sips=0;say(ME,'🍵 Kész a '+ME.cupN+' tea!',3);act('cup',ME.cupN);try{sfx('magic')}catch(e){}}}else bar.style.display='none';
 // tűz, függőágy, halak, gőz
 if(window._csAnim)_csAnim(t,dt);fireL.intensity=2.2+Math.sin(t*17)*.25+Math.sin(t*7)*.15;
 hammock.rotation.x=Math.sin(t*1.2)*.12;(window._koi||[]).forEach(k=>{const a=t*.5+k.ph;k.m.position.set(-6+Math.cos(a)*1.6,.22,7+Math.sin(a)*1.6);k.m.rotation.y=-a});
 for(let i=steam.length-1;i>=0;i--){const s=steam[i];s.t+=dt;s.m.position.y+=dt*.6;s.m.material.opacity=Math.max(0,.5-s.t*.25);s.m.scale.setScalar(1+s.t);if(s.t>2){SC.remove(s.m);steam.splice(i,1)}}
 // szereplők
 Object.values(P).forEach(p=>{if(!p.me){p.x+=(p.tx-p.x)*Math.min(1,dt*8);p.z+=(p.tz-p.z)*Math.min(1,dt*8);let d=p.try-p.ry;d=Math.atan2(Math.sin(d),Math.cos(d));p.ry+=d*Math.min(1,dt*8)}
  const s=p.sit>=0?SEATS[p.sit]:null;let y=s?s.y-.9:0;if(s&&s.ham)y+=Math.sin(t*1.2)*.12;const walking=p.me?p.mv:(Math.hypot(p.tx-p.x,p.tz-p.z)>.05||p.mv);
  p.wph=(p.wph||0)+dt*(walking&&!s?9:0);const sw=walking&&!s?Math.sin(p.wph):0;let tl=0,tr=0,al=0,ar=0;
  if(s){tl=tr=-1.55;al=ar=-.55}else if(walking){tl=sw*.6;tr=-sw*.6;al=-sw*.5;ar=sw*.5;y+=Math.abs(Math.cos(p.wph))*.07}else{const br=Math.sin(t*1.6+(p.ph0||(p.ph0=Math.random()*6)))*.03;al=br;ar=-br}
  if(p.fish){ar=-1.1;al=-.3}if(p.cup.visible&&!p.fish&&!walking)ar=Math.min(ar,-.6);if(p.sip>0)ar=-1.9;
  const k2=Math.min(1,dt*14);p.lp[0].rotation.x+=(tl-p.lp[0].rotation.x)*k2;p.lp[1].rotation.x+=(tr-p.lp[1].rotation.x)*k2;p.ap[0].rotation.x+=(al-p.ap[0].rotation.x)*k2;p.ap[1].rotation.x+=(ar-p.ap[1].rotation.x)*k2;
  if(p.dance>0){p.dance-=dt;y+=Math.abs(Math.sin(t*8))*.35;p.m.rotation.y=p.ry+t*6}else p.m.rotation.y=p.ry;
  if(p.wave>0){p.wave-=dt;p.ap[1].rotation.x=0;p.ap[1].rotation.z=2.7+Math.sin(t*14)*.35}else p.ap[1].rotation.z+=(0-p.ap[1].rotation.z)*Math.min(1,dt*10);
  if(p.sip>0)p.sip-=dt*1.4;fishTick(p,dt,t);if(p.cup.visible&&Math.random()<dt*1.2){p.cup.getWorldPosition(V);puff(V.x,V.y+.15,V.z,.5)}
  p.m.position.set(p.x,y,p.z);if(p.bubT>0)p.bubT-=dt;
  if(p.npc){p.nextL-=dt;if(p.nextL<=0){p.nextL=14+Math.random()*22;if(Math.random()<.35){p.sip=1;say(p,'☕ *kortyol*',2.5)}else{const l=LINES[Math.random()*LINES.length|0];say(p,l);log(p.name,l,'#a5f3fc')}}}});
 // kamera
 const tgt=V.set(ME.x,(ME.sit>=0?1.4:1.8),ME.z);const cx=ME.x+Math.sin(camYaw)*camDist,cz=ME.z+Math.cos(camYaw)*camDist;CAM.position.lerp(new THREE.Vector3(cx,2.6+camDist*.35,cz),Math.min(1,dt*6));CAM.lookAt(ME.x,(ME.sit>=0?1.2:1.6),ME.z);
 // tippek
 if(hintT>0){hintT-=dt;if(hintT<=0)$$('csHint').style.display='none'}else{let h='';if(ME.sit>=0)h='E – felállás · Q – kortyolás';else if(Math.hypot(ME.x-station.x,ME.z-station.z)<2.6)h=ME.cupN?'Van már teád – Q: kortyolás':'E – teafőzés 🫖';else{const i=SEATS.findIndex((s,i)=>Math.hypot(ME.x-s.x,ME.z-s.z)<1.8&&!seatTaken(i));if(i>=0)h='E – leülés ('+SEATS[i].k+')'}if(!h&&ME.fish)h=ME.fish.game?'':'🎣 Várj a kapásra… (mozgással abbahagyod)';else if(!h&&nearPond(ME))h='E – horgászás 🎣';const el=$('csHint');el.textContent=h;el.style.display=h?'block':'none'}
 R.render(SC,CAM);tagsUI();if(!loop._c||t-loop._c>1){loop._c=t;$$('csCnt').textContent='👥 '+Object.values(P).filter(p=>!p.npc).length+' játékos a Teakertben'}}
function puff(x,y,z,s){const m=new THREE.Mesh(new THREE.SphereGeometry(.08*(s||1),6,5),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.5,depthWrite:false}));m.position.set(x,y,z);SC.add(m);steam.push({m,t:0})}
function tagsUI(){const W=innerWidth,H=innerHeight;Object.values(P).forEach(p=>{const el=TAGS[p.id];if(!el)return;V.set(p.x,p.m.position.y+3.05,p.z).project(CAM);const vis=V.z<1&&Math.abs(V.x)<1.1&&Math.abs(V.y)<1.1;if(!vis){if(el.style.display!=='none')el.style.display='none';return}
 const html=(p.talk?'<span class="v">🔊</span>':'')+(p.bubT>0?'<span class="b">'+esc(p.bub)+'</span>':'')+'<span class="n'+(p.npc?' npc':'')+(p.me?' me':'')+'">'+(p.npc?'🤖 ':'')+esc(p.name)+(p.cupN&&p.cup.visible?' 🍵':'')+'</span>';if(el._h!==html){el._h=html;el.innerHTML=html}
 const k=Math.round((V.x+1)/2*W)+','+Math.round((1-V.y)/2*H);if(el._k!==k){el._k=k;const q=k.split(',');el.style.left=q[0]+'px';el.style.top=q[1]+'px'}if(el.style.display!=='block')el.style.display='block'})}
window._CS={P,get ME(){return ME},SEATS,close};
})();
