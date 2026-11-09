// ===== FEGYVER KÜLÖN RÉTEGBEN: nem lóg bele a falba, a lövedék látványosan a cső végéből indul =====
(function(){
let ov=null,hold=null;
function setup(){ov=new THREE.Scene();hold=new THREE.Group();hold.matrixAutoUpdate=false;ov.add(hold);
 ov.add(new THREE.HemisphereLight(0xffffff,0x667788,1.5));const d=new THREE.DirectionalLight(0xffffff,1.4);d.position.set(2,4,3);ov.add(d)}
function hook(){if(!window.ren||ren._vm)return;ren._vm=1;const o=ren.render.bind(ren);
 ren.render=function(sc,c){const g=window.G;if(sc!==scene||c!==cam||!g||!g.fp)return o(sc,c);
  if(!ov)setup();const items=cam.children.filter(x=>x.visible&&(x===g.gun||x.userData.vm||x.isGroup));if(!items.length)return o(sc,c);
  items.forEach(x=>cam.remove(x));o(sc,c);
  cam.updateMatrixWorld();hold.matrix.copy(cam.matrixWorld);hold.matrixWorldNeedsUpdate=true;items.forEach(x=>hold.add(x));
  const ac=ren.autoClear;ren.autoClear=false;ren.clearDepth();o(ov,c);ren.autoClear=ac;
  items.forEach(x=>cam.add(x))}}
hook();addEventListener('load',hook);setInterval(hook,1000);
})();
// lövedék: kicsi, világító nyomjelző (nem nagy textúrázott gömb a kamera előtt)
(function(){const MT={};const o=window.sht;if(typeof o!=='function')return;window.sht=function(){const g=G,n0=g&&g.bl?g.bl.length:0;const r=o.apply(this,arguments);try{if(g&&g.bl){const col=(WPN[g.wp]&&WPN[g.wp].col)||0xffee88;const m=MT[col]||(MT[col]=new THREE.MeshBasicMaterial({color:col}));
 for(let i=n0;i<g.bl.length;i++){const b=g.bl[i];if(b.m&&!b._tr){b._tr=1;b.m.material=m;b.m.scale.setScalar(b.boom?.1:.03);b.m.castShadow=false}}}}catch(e){}return r}})();
// nyomjelző csík: mindig a csőtorkolattól indul, így látszik, hogy onnan jön a lövedék
(function(){const TR=[];let geo=null;const MT={};
 const o=window.sht;if(typeof o!=='function')return;
 window.sht=function(){const g=G,n0=g&&g.bl?g.bl.length:0;const r=o.apply(this,arguments);try{if(g&&g.bl&&g.bl.length>n0){if(!geo){geo=new THREE.CylinderGeometry(1,1,1,6,1,true);geo.translate(0,.5,0);geo.rotateX(Math.PI/2)}
  const col=(WPN[g.wp]&&WPN[g.wp].col)||0xffee88;const m=MT[col]||(MT[col]=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending}));
  for(let i=n0;i<g.bl.length;i++){const b=g.bl[i];const t=new THREE.Mesh(geo,m);t.frustumCulled=false;scene.add(t);TR.push({t,b,ox:b.x,oy:b.y,oz:b.z,age:0})}}}catch(e){}return r};
 const v1=new THREE.Vector3(),v2=new THREE.Vector3();
 const u=window.update;if(typeof u!=='function')return;window.update=function(dt){const r=u.apply(this,arguments);try{for(let i=TR.length-1;i>=0;i--){const q=TR[i];q.age+=dt||.016;q.n=(q.n||0)+1;const b=q.b;
  if(!b.m||!b.m.parent||q.age>.35||!G){scene.remove(q.t);TR.splice(i,1);continue}
  v2.set(b.x,b.y,b.z);v1.set(q.ox,q.oy,q.oz);const full=v1.distanceTo(v2);const L=(q.n<=4||q.age<.08)?full:Math.min(full,5);if(L<.05){q.t.visible=false;continue}q.t.visible=true;
  v1.subVectors(v2,v1).normalize();const s=v2.clone().addScaledVector(v1,-L);q.t.position.copy(s);q.t.lookAt(v2);const w=b.boom?.05:.011;q.t.scale.set(w,w,L)}}catch(e){}return r}})();
