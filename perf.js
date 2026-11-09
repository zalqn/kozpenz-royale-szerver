// ===== OPTIMALIZÁLÁS (semmit nem vesz ki): statikus lobby-tárgyak összevonása, ritkább árnyékfrissítés =====
(function(){
// ---------- geometria-összevonás (anyagonként) ----------
function mergeStatic(root,exclude){root.updateMatrixWorld(true);const groups=new Map();const cand=[];
 const isEx=o=>{for(let p=o;p;p=p.parent){if(exclude.has(p)||!p.visible)return true}return false};
 root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||Array.isArray(o.material)||!o.geometry||!o.geometry.attributes.position)return;if(o.userData.noMerge||isEx(o))return;cand.push(o)});
 return cand}
function doMerge(scene,meshes){const by=new Map();meshes.forEach(m=>{const g=m.geometry,key=m.material.uuid+'|'+(g.attributes.uv?1:0)+(g.attributes.normal?1:0)+'|'+(m.castShadow?1:0)+(m.receiveShadow?1:0);if(!by.has(key))by.set(key,[]);by.get(key).push(m)});
 let removed=0,added=0;by.forEach(list=>{if(list.length<3)return;let total=0;const parts=list.map(m=>{let g=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();g.applyMatrix4(m.matrixWorld);total+=g.attributes.position.count;return g});
  if(total>400000)return;const hasUV=!!parts[0].attributes.uv,hasN=!!parts[0].attributes.normal;const pos=new Float32Array(total*3),nor=hasN?new Float32Array(total*3):null,uv=hasUV?new Float32Array(total*2):null;let o=0;
  parts.forEach(g=>{const n=g.attributes.position.count;pos.set(g.attributes.position.array.subarray(0,n*3),o*3);if(nor)nor.set(g.attributes.normal.array.subarray(0,n*3),o*3);if(uv&&g.attributes.uv)uv.set(g.attributes.uv.array.subarray(0,n*2),o*2);o+=n;g.dispose()});
  const mg=new THREE.BufferGeometry();mg.setAttribute('position',new THREE.BufferAttribute(pos,3));if(nor)mg.setAttribute('normal',new THREE.BufferAttribute(nor,3));if(uv)mg.setAttribute('uv',new THREE.BufferAttribute(uv,2));mg.computeBoundingSphere();
  const mm=new THREE.Mesh(mg,list[0].material);mm.castShadow=list[0].castShadow;mm.receiveShadow=list[0].receiveShadow;mm.userData.merged=1;mm.matrixAutoUpdate=false;scene.add(mm);added++;
  list.forEach(m=>{m.visible=false;m.userData.mergedAway=1;removed++})});return [removed,added]}
// mozgás-figyelés: amit pár másodperc alatt az animáció elmozdít, az nem statikus
function lobbyOptimize(){const L=window.LB3D;if(!L||!L.sc||L._opt)return;L._opt=1;const ex=new Set([L.me,L.dog,...(L.peds||[]).map(p=>p.g||p.m||p.grp||p).filter(Boolean)]);
 const c=mergeStatic(L.sc,ex);const snap=new Map();c.forEach(m=>snap.set(m,m.matrixWorld.clone()));
 setTimeout(()=>{L.sc.updateMatrixWorld(true);const still=c.filter(m=>m.parent&&m.visible&&!isExNow(m)&&m.matrixWorld.equals(snap.get(m)));function isExNow(o){for(let p=o;p;p=p.parent){if(p===L.me||p===L.dog||!p.visible)return true}return false}
  const[r,a]=doMerge(L.sc,still);console.log('[perf] lobby: '+r+' statikus tárgy → '+a+' összevont rajzolás')},3500)}
let iv=setInterval(()=>{const L=window.LB3D,lb=document.getElementById('lb');if(L&&L.sc&&lb&&lb.classList.contains('on')){clearInterval(iv);setTimeout(lobbyOptimize,2500)}},500);
// ---------- árnyék: nem minden képkockában számoljuk újra ----------
function throttleShadows(r,every){if(!r||r._shT)return;r._shT=1;r.shadowMap.autoUpdate=false;let f=0;const o=r.render.bind(r);r.render=function(s,c){if(r.shadowMap.enabled&&(f++%every===0))r.shadowMap.needsUpdate=true;return o(s,c)}}
setInterval(()=>{if(window.ren)throttleShadows(ren,2);if(window.LB3D&&LB3D.r)throttleShadows(LB3D.r,3)},1000);
// ---------- játék: messzi apró tárgyak ne vessenek árnyékot (a látvány közel ugyanaz) ----------
let lastSh=0;setInterval(()=>{const g=window.G;if(!g||!window.scene||!run)return;const now=performance.now();if(now-lastSh<1500)return;lastSh=now;
 if(!g._shList){g._shList=[];scene.traverse(o=>{if(o.isMesh&&o.castShadow&&!o.isInstancedMesh){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();const s=o.geometry.boundingSphere.radius*Math.max(o.scale.x,o.scale.y,o.scale.z);if(s<3&&!o.parent?.isCamera)g._shList.push(o)}})}
 const v=new THREE.Vector3();g._shList.forEach(o=>{if(!o.parent){return}o.getWorldPosition(v);const d=Math.hypot(v.x-g.x,v.z-g.z);o.castShadow=d<70})},500);
})();
// ===== HUD-ŐR: ugyanazt a szöveget nem írjuk újra a DOM-ba (a tartalom és a kinézet ugyanaz, csak a felesleges újratördelés marad el) =====
(function(){
const IDS=['mg','brAmmo','wv','al','ms','sco','ryStorm','ryAl','ryKi'];
const pH=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'),pT=Object.getOwnPropertyDescriptor(Node.prototype,'textContent');
function guard(el){if(!el||el._guard)return;el._guard=1;
 Object.defineProperty(el,'innerHTML',{configurable:true,get(){return pH.get.call(this)},set(v){v=String(v);if(this._gk==='h'+v)return;this._gk='h'+v;pH.set.call(this,v)}});
 Object.defineProperty(el,'textContent',{configurable:true,get(){return pT.get.call(this)},set(v){v=String(v);if(this._gk==='t'+v)return;this._gk='t'+v;pT.set.call(this,v)}});}
function scan(){IDS.forEach(id=>guard(document.getElementById(id)))}
scan();setInterval(scan,2000);
})();
