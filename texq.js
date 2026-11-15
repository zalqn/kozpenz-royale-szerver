// texq.js – textúra-minőség (11-15). A three.min.js után töltődik, minden renderer előtt.
// 1) GPU-megosztás: a t.__tqP-vel jelölt Texture (ugyanaz a kép és mintavétel, csak a repeat/offset más) a „szülő” GL-textúráját köti be,
//    így egy fotó egyszer kerül a GPU-ra, akárhány méretarányos klónja van (r128: renderer.properties átirányítás; eltérés esetén marad a külön feltöltés).
// 2) TQ.antiTile(anyag): nagy talajokon az ismétlődés elrejtése – elforgatott, eltérő léptékű makró-minta + közép- és nagyléptékű világosság/szárazság-foltok (+2 textúraolvasás, ebből 1 a 1×1-es mip).
(function(){if(!window.THREE)return;
const same=(t,p)=>t.image===p.image&&t.version===p.version&&t.wrapS===p.wrapS&&t.wrapT===p.wrapT&&t.minFilter===p.minFilter&&t.magFilter===p.magFilter&&t.anisotropy===p.anisotropy&&t.format===p.format&&t.type===p.type&&t.encoding===p.encoding&&t.flipY===p.flipY&&t.generateMipmaps===p.generateMipmaps&&t.premultiplyAlpha===p.premultiplyAlpha&&t.unpackAlignment===p.unpackAlignment;
const WR=THREE.WebGLRenderer;
THREE.WebGLRenderer=function(o){const r=new WR(o),P=r.properties,g=P.get,rm=P.remove,k=t=>{const p=t&&t.__tqP;return p&&same(t,p)?p:t};P.get=t=>g(k(t));P.remove=t=>rm(k(t));return r};
THREE.WebGLRenderer.prototype=WR.prototype;
const NOISE='float tqH(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}\nfloat tqN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(tqH(i),tqH(i+vec2(1.,0.)),f.x),mix(tqH(i+vec2(0.,1.)),tqH(i+vec2(1.,1.)),f.x),f.y);}\n';
// finom minta + elforgatott ~4,3-szoros léptékű makró-minta az átlagszínhez (legkisebb mip) normálva → a közép-távolságban is van szerkezet, az átlagszín nem változik
const MAPF='#ifdef USE_MAP\n vec4 texelColor=texture2D(map,vUv);\n vec3 tqA=texture2D(map,vUv,12.).rgb;\n vec3 tqM=texture2D(map,mat2(.8,-.6,.6,.8)*vUv*.23+vec2(.37,.19)).rgb;\n texelColor.rgb*=mix(vec3(1.),tqM/max(tqA,vec3(.04)),.5);\n float tqv=tqN(vUv*.33+2.1)*.55+tqN(vUv*.045+5.3)*.45;\n texelColor.rgb*=(.8+.4*tqv)*mix(vec3(1.),vec3(1.1,1.05,.8),smoothstep(.5,.85,tqN(vUv*.11+11.7)));\n texelColor=mapTexelToLinear(texelColor);\n diffuseColor*=texelColor;\n#endif';
function atObc(s){s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\n'+NOISE).replace('#include <map_fragment>',MAPF)}
window.TQ={antiTile:m=>{if(m&&m.onBeforeCompile!==atObc){m.onBeforeCompile=atObc;m.needsUpdate=true}return m}};
})();
