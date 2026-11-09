// ===== VALÓDI FOTÓTEXTÚRÁK (Poly Haven, CC0) =====
(function(){
if(!location.protocol.startsWith('http'))return; // file:// alatt a böngésző tiltja a képtextúrákat – marad a generált
const WP=(n,pre,post)=>{const o=window[n];if(typeof o!=='function'){console.error('WP missing '+n);return}window[n]=function(){let st;try{st=pre?pre(arguments):0}catch(e){}const r=o.apply(this,arguments);try{post&&post(arguments,st,r)}catch(e){console.error(n+': '+(e&&e.stack))}return r}};
const LD=new THREE.TextureLoader(),BASE={};
function base(name){if(BASE[name])return BASE[name];const mk=f=>{const w={clones:[],img:null};w.t=LD.load('tex_opt/'+f,t=>{w.img=t.image;w.clones.forEach(q=>{q.image=w.img;q.needsUpdate=true})});return w};return BASE[name]={map:mk(name+'_diff.jpg'),nrm:mk(name+'_nor.jpg')}}
// játékbeli anyagfajta -> fotótextúra, méretarány, érdesség, fémesség, árnyalás erőssége
const KIND={grass:['grass2',1.1,.95,0,.8],roof:['roof',1.6,.8,0,.3],pool:['pool',1.5,.15,.1,.2],fa1:['fa1',1,.35,.25,.08],fa2:['fa2',1,.35,.2,.08],fa3:['fa3',1,.6,.05,.08],fa4:['fa4',1,.4,.2,.08],fa5:['fa5',1,.45,.15,.08],fa6:['fa6',1,.25,.4,.08],stone:['stone',1,.9,0,.25],darkwood:['darkwood',1.4,.6,0,.3],rock:['rock',1,.95,0,.25],cobble:['cobble',1.4,.9,0,.3],facade:['facade',1.2,.6,.05,.35],conc:['conc',1.4,.85,0,.45],brick:['brick',2.6,.9,0,.25],wood:['wood',2,.7,0,.35],metal:['metal',2.2,.5,.15,.45],asphalt:['asphalt',1.2,.92,0,.3],tile:['tile',1.6,.3,.05,.3],plaster:['plaster',1.2,.9,0,.4],bark:['bark',1,.9,0,.2],sand:['sand',1,.95,0,.2]};
const MC={};const W=new THREE.Color(0xffffff);
window.texMat=function(kind,rx,ry,tint){const K=KIND[kind];const key=kind+'|'+rx+'|'+ry+'|'+tint;if(MC[key])return MC[key];const b=base(K[0]);
 const cl=w=>{const q=new THREE.Texture(w.img||undefined);q.wrapS=q.wrapT=THREE.RepeatWrapping;q.anisotropy=8;q.repeat.set(rx*K[1],ry*K[1]);if(w.img)q.needsUpdate=true;else w.clones.push(q);return q};
 const col=new THREE.Color(tint===undefined?0xffffff:tint).lerp(W,1-K[4]);
 return MC[key]=new THREE.MeshStandardMaterial({color:col,map:cl(b.map),normalMap:cl(b.nrm),normalScale:new THREE.Vector2(1,1),roughness:K[2],metalness:K[3]})};

// --- kidolgozott, generált homlokzatok (üveg + irodaablakok) ---
const PROC={};
function procTex(kind){if(PROC[kind])return PROC[kind];const S=512,c=document.createElement('canvas');c.width=c.height=S;const x=c.getContext('2d');
 if(kind==='water'){const g=x.createLinearGradient(0,0,S,S);g.addColorStop(0,'#37b6d8');g.addColorStop(1,'#1a6fa8');x.fillStyle=g;x.fillRect(0,0,S,S);for(let i=0;i<260;i++){const a=Math.random()*S,b=Math.random()*S,w=10+Math.random()*40;x.strokeStyle='rgba(255,255,255,'+(.08+Math.random()*.22)+')';x.lineWidth=1+Math.random()*2;x.beginPath();x.moveTo(a,b);x.quadraticCurveTo(a+w/2,b-4,a+w,b);x.stroke()}}
 else if(kind==='glass'){const g=x.createLinearGradient(0,0,0,S);g.addColorStop(0,'#9fc3e6');g.addColorStop(.5,'#4f7fb3');g.addColorStop(1,'#2b4c78');x.fillStyle=g;x.fillRect(0,0,S,S);
  for(let i=0;i<6;i++){const rg=x.createLinearGradient(0,0,S,S);rg.addColorStop(0,'rgba(255,255,255,0)');rg.addColorStop(.5,'rgba(255,255,255,'+(.05+Math.random()*.12)+')');rg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=rg;x.fillRect(i*S/6,0,S/6,S)}
  x.fillStyle='#1d2a3a';for(let i=0;i<=4;i++)x.fillRect(i*S/4-3,0,6,S);for(let j=0;j<=8;j++)x.fillRect(0,j*S/8-2,S,4)}
 else{x.fillStyle='#232a38';x.fillRect(0,0,S,S);const cols=6,rows=8,cw=S/cols,rh=S/rows;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const r=Math.random(),lit=r<.55,col=lit?(Math.random()<.7?'#ffd98a':'#bfe3ff'):'#0d1520';const gx=i*cw+8,gy=j*rh+10,w=cw-16,h=rh-20;
   x.fillStyle=col;x.fillRect(gx,gy,w,h);if(lit){const g2=x.createLinearGradient(gx,gy,gx,gy+h);g2.addColorStop(0,'rgba(255,255,255,.25)');g2.addColorStop(1,'rgba(0,0,0,.25)');x.fillStyle=g2;x.fillRect(gx,gy,w,h);if(Math.random()<.4){x.fillStyle='rgba(60,40,20,.35)';x.fillRect(gx,gy+h*.6,w,h*.4)}}
   x.strokeStyle='#4a5568';x.lineWidth=3;x.strokeRect(gx,gy,w,h);x.beginPath();x.moveTo(gx+w/2,gy);x.lineTo(gx+w/2,gy+h);x.stroke()}
  x.fillStyle='rgba(255,255,255,.06)';for(let j=0;j<rows;j++)x.fillRect(0,j*rh+rh-6,S,4)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return PROC[kind]=t}
const PM={};
function procMat(kind,c){const key=kind+'|'+c;if(PM[key])return PM[key];const t=procTex(kind);
 return PM[key]=kind==='water'?new THREE.MeshStandardMaterial({color:0xffffff,map:t,roughness:.08,metalness:.2,emissive:0x0b4d6e,emissiveIntensity:.5}):kind==='glass'?new THREE.MeshStandardMaterial({color:new THREE.Color(c).lerp(W,.55),map:t,roughness:.15,metalness:.35,emissive:0x0a1a2e,emissiveIntensity:.6})
  :new THREE.MeshStandardMaterial({color:0xffffff,map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.55,roughness:.7})}

// --- szürkeárnyalatos fotótextúrák (színezhető anyagokhoz: ruha, bunda, festett felület) ---
const GT={};
window.photoTex=function(file,rx,ry){const key=file+'|'+rx+'|'+ry;if(GT[key])return GT[key];const w=GT['@'+file]||(GT['@'+file]=(()=>{const o={clones:[],img:null};LD.load('tex_opt/'+file,t=>{o.img=t.image;o.clones.forEach(q=>{q.image=o.img;q.needsUpdate=true})});return o})());
 const q=new THREE.Texture(w.img||undefined);q.wrapS=q.wrapT=THREE.RepeatWrapping;q.anisotropy=8;q.repeat.set(rx||1,ry||1);if(w.img)q.needsUpdate=true;else w.clones.push(q);return GT[key]=q};
const GM={};
window.grayMat=function(name,c,rx,ry,o){const key=name+'|'+c+'|'+rx+'|'+ry+'|'+JSON.stringify(o||{});if(GM[key])return GM[key];
 return GM[key]=new THREE.MeshStandardMaterial(Object.assign({color:new THREE.Color(c).multiplyScalar(1.22),map:photoTex(name+'_gray.jpg',rx,ry),normalMap:photoTex(name+'_nor.jpg',rx,ry),roughness:.85,metalness:0},o||{}))};
['wool','fleece','jersey','fur','rubber','painted','carpet','denim','leather'].forEach(n=>{photoTex(n+'_gray.jpg',1,1);photoTex(n+'_nor.jpg',1,1)});
const _mat=window.mat;
window.mat=function(k,c){const p=String(k).split('@'),kd=p[0];if(kd==='glass'||kd==='neonwin'||kd==='water')return procMat(kd,c);if(kd==='gen'||kd==='carpet'||kd==='suit'||kd==='face'){let rx=1,ry=1;if(p[1]){const r=p[1].split(',');rx=+r[0];ry=+r[1]}return grayMat(kd==='carpet'?'carpet':'painted',c,rx,ry)}if(!KIND[kd])return _mat(k,c);let rx=1,ry=1;if(p[1]){const r=p[1].split(',');rx=+r[0];ry=+r[1]}return texMat(kd,rx,ry,c)};
// égbolt: valódi naplementés panoráma
const SKY=LD.load('tex_opt/sky_game.jpg');
window.skyTex=function(){return SKY};
WP('launch',null,()=>{if(!scene)return;const hz=new THREE.Color(0xa9a2bd);scene.background=hz;if(scene.fog){scene.fog.color.copy(hz)}
 scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius>=1000){o.rotation.y=-.6}});
 if(window.SUN){SUN.color.setHex(0xffe0b8);SUN.intensity=1.5}if(window.HEMI){HEMI.color.setHex(0xd8dcff);HEMI.groundColor.setHex(0x6b5a48);HEMI.intensity=.85}});
WP('update',null,a=>{const t=PROC.water;if(t){t.offset.x+=a[0]*.03;t.offset.y+=a[0]*.015}});
})();
