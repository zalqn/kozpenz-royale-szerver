// perf2.js (11-15) – texq.js után, minden renderer előtt.
// 1) GPU-alvás: a nem fő WebGLRenderer-ek (Sötét Program, Teakert, kaszinó-3D, minijátékok, előnézetek) 30 mp tétlenség után
//    elengedik a GL-kontextust (forceContextLoss → a VRAM felszabadul); a következő render() visszahozza (1-2 üres képkocka, a jelenet megmarad).
//    A meccs (ren) és a lobby (LB3D.r) renderere kimarad. Debug: _P2.st()
// 2) Gyenge gép (deviceMemory ≤4 vagy ≤4 mag, vagy localStorage p2low=1; p2low=0 kikapcsolja): antialias ki, pixelarány ≤1,
//    PCF árnyék a puha helyett, textúra ≤512 px, anizotrópia ≤2.
// 3) Meccsindításkor ren.compile(scene,cam): a shaderek betöltéskor fordulnak, nem az első lövésnél/effektnél.
// Kikapcsolás: localStorage p2off=1.
(function(){let ov=null,off=null;try{ov=localStorage.getItem('p2low');off=localStorage.getItem('p2off')}catch(e){}
if(!window.THREE||off==='1')return; // p2off=1: az egész modul kikapcsolva (mérés/hibakeresés)
const LOW=ov==='1'||(ov!=='0'&&((navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4));
const RS=[],IDLE=30000;
const WR=THREE.WebGLRenderer;
THREE.WebGLRenderer=function(o){if(LOW)o=Object.assign({},o,{antialias:false});const r=new WR(o);RS.push(new WeakRef(r));try{r.__p2src=(new Error().stack.split('\n')[2]||'').replace(/.*\//,'').replace(/\)$/,'')}catch(e){}r.__p2t=performance.now();
 const sp=r.setPixelRatio;r.setPixelRatio=function(v){return sp.call(this,LOW?Math.min(1,v):v)};
 if(LOW){const ga=r.capabilities.getMaxAnisotropy;r.capabilities.getMaxAnisotropy=()=>Math.min(2,ga())}
 const rd=r.render;r.render=function(s,c){r.__p2t=performance.now();if(r.domElement.isConnected)r.__p2c=1;if(r.__p2s){wake(r);return}
  if(LOW&&r.shadowMap.type===THREE.PCFSoftShadowMap)r.shadowMap.type=THREE.PCFShadowMap;
  if(r===MR()){const g=typeof G!=='undefined'?G:null;if(g&&g!==r.__p2g){r.__p2g=g;precompile(r,s,c)}}
  return rd.call(this,s,c)};
 return r};
THREE.WebGLRenderer.prototype=WR.prototype;
const MR=()=>typeof ren!=='undefined'?ren:null;
const core=r=>r===MR()||(window.LB3D&&LB3D.r===r);
function sleep(r){if(r.__p2s||core(r)||!r.__p2c)return;r.__p2s=1;try{r.forceContextLoss()}catch(e){r.__p2s=0}}
function wake(r){if(r.__p2w)return;r.__p2w=1;r.domElement.addEventListener('webglcontextrestored',()=>{r.__p2s=0;r.__p2w=0},{once:true});try{r.forceContextRestore()}catch(e){r.__p2s=0;r.__p2w=0}}
setInterval(()=>{const n=performance.now();for(const w of RS){const r=w.deref();if(r&&!r.__p2s&&n-r.__p2t>IDLE)sleep(r)}},5000);
// kis textúra gyenge gépen: fotók ≤512 px (a TextureLoader is az ImageLoader-t használja), a többit (eljárásos canvasok) a three.js
// maga kicsinyíti 1024-re, ha a GPU max textúraméretét 1024-nek látja
if(LOW){[window.WebGLRenderingContext,window.WebGL2RenderingContext].forEach(C=>{if(!C)return;const gp=C.prototype.getParameter;C.prototype.getParameter=function(p){const v=gp.call(this,p);return p===0x0D33?Math.min(1024,v):v}});
 const cw=console.warn;console.warn=function(m){if(typeof m==='string'&&m.startsWith('THREE.WebGLRenderer: Texture has been resized'))return;return cw.apply(console,arguments)};const IL=THREE.ImageLoader.prototype.load;THREE.ImageLoader.prototype.load=function(u,ok,pr,er){return IL.call(this,u,ok&&(img=>{const M=512,w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;
 if(w>M||h>M){try{const k=M/Math.max(w,h),c=document.createElement('canvas');c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));c.getContext('2d').drawImage(img,0,0,c.width,c.height);img=c}catch(e){}}ok(img)}),pr,er)}}
// shader-előfordítás: meccsenként (új G) az első képkocka előtt a TELJES jelenet (rejtett pool-ok, effektek is) lefordul,
// így nem az első lövésnél/robbanásnál akad. A launch-ot nem csomagolja (WP-sorrend érintetlen).
function precompile(r,s,c){try{const t=performance.now();r.compile(s,c);window._P2.compileMs=Math.round(performance.now()-t)}catch(e){}}
window._P2={LOW,sleep,wake,st:()=>RS.map(w=>w.deref()).filter(Boolean).map(r=>({src:r.__p2src,cv:r.domElement.id||r.domElement.className||'-',on:r.domElement.isConnected,slept:!!r.__p2s,core:core(r),idle:Math.round((performance.now()-r.__p2t)/1000),geo:r.info.memory.geometries,tex:r.info.memory.textures}))};
})();
