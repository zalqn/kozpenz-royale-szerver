// jatekB33.js – B ügynök: 🧑‍🎨 karakterszerkesztő (chars.js charModel), 🏠 lobby-lakás trófeákkal, 🏷️ névtábla-keret + animált embléma, 🐕 kutya-ruhák + kutyás emote-ok
// Minden adat localStorage-ben (k3b33*), így a felhőmentés a fiókhoz menti.
(function(){
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft',tell=t=>{try{say(t)}catch(e){}};
const money=()=>(typeof S!=='undefined'&&S.c)||0,spend=n=>{if(money()<n){tell('Nincs elég pénzed ('+fmt(n)+')');return false}S.c-=n;try{save()}catch(e){}return true};
const PR=(c,n)=>{try{return window._b36?_b36.P(c,n):n}catch(e){return n}};
const gG=()=>(typeof G!=='undefined')?G:null;
const hx=c=>'#'+new THREE.Color(c).getHexString(),xh=s=>parseInt(String(s).slice(1),16);
// ---------- közös panel + egy megosztott mini-renderer ----------
const pan=document.createElement('div');pan.id='b33pan';pan.style.cssText='position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:#000b;font:14px system-ui;color:#e2e8f0';document.body.appendChild(pan);
const btn='background:#1e293b;color:#fff;border:2px solid #334155;border-radius:9px;padding:5px 10px;margin:2px;cursor:pointer;font:13px system-ui';
let RR=null,CAMR=null,curScene=null,raf=0,spin=null;
function ensureR(){if(RR)return;RR=new THREE.WebGLRenderer({antialias:true,alpha:false});RR.setPixelRatio(1);RR.setSize(320,300);CAMR=new THREE.PerspectiveCamera(45,320/300,.1,100)}
function loopR(){if(pan.style.display==='none'||!curScene){raf=0;return}raf=requestAnimationFrame(loopR);if(spin)spin(performance.now()/1000);RR.render(curScene,CAMR)}
function show(h,scene,cam){pan.innerHTML='<div style="background:#0f172a;border:2px solid #a78bfa;border-radius:14px;padding:14px;max-width:720px;width:calc(100% - 32px);max-height:92vh;overflow:auto">'+h+'<div><button id="b33x" style="'+btn+'">✖ Bezár</button></div></div>';pan.style.display='flex';
 pan.querySelector('#b33x').onclick=close;const slot=pan.querySelector('#b33v');curScene=null;spin=null;if(slot&&scene){ensureR();slot.appendChild(RR.domElement);RR.domElement.style.cssText='width:100%;max-width:320px;height:auto;border-radius:10px;display:block';curScene=scene;if(cam)cam(CAMR);if(!raf)raf=requestAnimationFrame(loopR)}}
function close(){pan.style.display='none';curScene=null;spin=null}
function baseScene(bg){const s=new THREE.Scene();s.background=new THREE.Color(bg||0x1e1b4b);s.add(new THREE.HemisphereLight(0xffffff,0x444466,.9));const d=new THREE.DirectionalLight(0xffffff,.7);d.position.set(3,6,4);s.add(d);return s}
const sel=(id,opts,cur)=>'<select id="'+id+'" style="background:#1e293b;color:#fff;border:1px solid #475569;border-radius:6px;padding:3px;margin:2px">'+opts.map(([v,t])=>'<option value="'+v+'"'+(String(v)===String(cur)?' selected':'')+'>'+t+'</option>').join('')+'</select>';
const col=(id,v)=>'<input type="color" id="'+id+'" value="'+v+'" style="width:38px;height:24px;border:0;background:none;vertical-align:middle">';

// =============== 19) KARAKTERSZERKESZTŐ ===============
let CE=LS('k3b33char',{on:false,skin:'#f1c7a6',hair:'quiff',hairC:'#3b2414',top:'sport',topC:'#2563eb',leg:'denim',legC:'#1f2937',shoe:'#111111',eye:'#4a6b8a',mouth:'smile',extra:'',build:'atlag'});
const BUILDS={vekony:[.86,1.03,'Vékony'],atlag:[1,1,'Átlagos'],eros:[1.17,.98,'Erős'],magas:[.95,1.1,'Magas']};
function ceDef(){const f={skin:CE.skin,eye:CE.eye,brow:CE.hairC,mouth:CE.mouth};if(CE.extra==='szemuveg')f.glasses='#111';if(CE.extra==='napszemuveg'){f.glasses='#111';f.shades=1}if(CE.extra==='borosta')f.stubble=1;if(CE.extra==='szakall')f.beard=CE.hairC;if(CE.extra==='bajusz')f.mustache=CE.hairC;
 return{c:0,skinC:xh(CE.skin),hair:CE.hair,hairC:xh(CE.hairC),beanieC:xh(CE.topC),topK:CE.top,topC:xh(CE.topC),legK:CE.leg,legC:xh(CE.legC),shirtC:0xf1f5f9,shoeC:xh(CE.shoe),sneaker:CE.top==='sport'?1:0,zip:CE.top==='sport'?1:0,face:f}}
function ceBuild(sc){const g=window.charModel(ceDef(),sc);const b=BUILDS[CE.build]||BUILDS.atlag,inn=g.children[0];if(inn){inn.scale.x*=b[0];inn.scale.z*=b[0];inn.scale.y*=b[1]}return g}
(function wrapPerson(){const o=window.person;if(typeof o!=='function'||!window.charModel){setTimeout(wrapPerson,400);return}
 window.person=function(c,em,sc){try{const ch=typeof S!=='undefined'&&S.ch;if(CE.on&&ch&&c===ch.c&&em===ch.e&&!window._b33noCE)return ceBuild(sc)}catch(e){}return o.apply(this,arguments)}})();
let ceScene=null,ceModel=null;
function ceRefresh(){if(!ceScene)return;if(ceModel){ceScene.remove(ceModel);ceModel.traverse(o=>{if(o.geometry)o.geometry.dispose()})}try{ceModel=ceBuild(1)}catch(e){console.warn('b33 ce',e);return}ceScene.add(ceModel)}
function charEditor(){if(!ceScene){ceScene=baseScene(0x1e1b4b);const fl=new THREE.Mesh(new THREE.CircleGeometry(1.4,24),new THREE.MeshLambertMaterial({color:0x312e81}));fl.rotation.x=-Math.PI/2;ceScene.add(fl)}
 const H=[['side','Oldalválasztott'],['quiff','Bodorított'],['receding','Kopaszodó'],['bald','Kopasz'],['spiky','Tüskés'],['beanie','Sapkás']];
 show('<h2>🧑‍🎨 Karakterszerkesztő</h2><div style="display:flex;flex-wrap:wrap;gap:12px"><div id="b33v" style="flex:0 0 320px"></div><div style="flex:1;min-width:220px;line-height:2">'+
 '<label><input type="checkbox" id="ceOn" '+(CE.on?'checked':'')+'> Saját karakterem használata a meccseken</label><br>'+
 'Arc: '+col('ceSkin',CE.skin)+' bőr '+col('ceEye',CE.eye)+' szem '+sel('ceMouth',[['smile','Mosoly'],['grin','Vigyor'],['smirk','Félmosoly']],CE.mouth)+'<br>'+
 'Extra: '+sel('ceEx',[['','Nincs'],['szemuveg','Szemüveg'],['napszemuveg','Napszemüveg'],['borosta','Borosta'],['szakall','Szakáll'],['bajusz','Bajusz']],CE.extra)+'<br>'+
 'Haj: '+sel('ceHair',H,CE.hair)+col('ceHairC',CE.hairC)+'<br>'+
 'Felső: '+sel('ceTop',[['suit','Zakó'],['sport','Melegítő'],['knit','Kötött'],['leather','Bőrdzseki']],CE.top)+col('ceTopC',CE.topC)+'<br>'+
 'Nadrág: '+sel('ceLeg',[['suit','Szövet'],['denim','Farmer'],['sport','Melegítő']],CE.leg)+col('ceLegC',CE.legC)+' cipő '+col('ceShoe',CE.shoe)+'<br>'+
 'Testalkat: '+sel('ceBuild',Object.entries(BUILDS).map(([k,v])=>[k,v[2]]),CE.build)+'<br><button id="ceRnd" style="'+btn+'">🎲 Véletlen</button><div style="font-size:12px;color:#94a3b8">A kiválasztott karakterhelyre kerül (a következő meccstől). Fiókkal a felhőmentés menti.</div></div></div>',ceScene,c=>{c.position.set(0,2.2,5.6);c.lookAt(0,1.5,0)});
 spin=t=>{if(ceModel)ceModel.rotation.y=t*.6};ceRefresh();
 const map={ceSkin:'skin',ceEye:'eye',ceMouth:'mouth',ceEx:'extra',ceHair:'hair',ceHairC:'hairC',ceTop:'top',ceTopC:'topC',ceLeg:'leg',ceLegC:'legC',ceShoe:'shoe',ceBuild:'build'};
 Object.entries(map).forEach(([id,k])=>{const el=pan.querySelector('#'+id);el.oninput=el.onchange=()=>{CE[k]=el.value;SV('k3b33char',CE);ceRefresh()}});
 pan.querySelector('#ceOn').onchange=e=>{CE.on=e.target.checked;SV('k3b33char',CE)};
 pan.querySelector('#ceRnd').onclick=()=>{const r=a=>a[Math.random()*a.length|0],rc=()=>'#'+(Math.random()*0xffffff|0).toString(16).padStart(6,'0');Object.assign(CE,{skin:r(['#f1c7a6','#e9b892','#d9a27c','#c68b62','#8d5a3b']),hair:r(H)[0],hairC:r(['#2b1a10','#5b3a1e','#9ca3af','#e5c07b','#111111','#8b3a1a']),top:r(['suit','sport','knit','leather']),topC:rc(),legC:rc(),mouth:r(['smile','grin','smirk']),build:r(Object.keys(BUILDS))});SV('k3b33char',CE);charEditor()}}

// =============== 21) NÉVTÁBLA-KERET + ANIMÁLT EMBLÉMA ===============
let NP=LS('k3b33np',{frame:'nincs',emb:'',anim:'porog',own:['nincs']});
const FR={nincs:['Nincs',0],arany:['🥇 Arany',8000],neon:['💡 Neon',12000],tuskes:['🦔 Tüskés',10000],viragos:['🌸 Virágos',9000],pixel:['👾 Pixel',15000]};
const EMB=['','⭐','👑','🔥','💎','🐕','💦','🍀','⚡'];
function npCanvas(name,frame){const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');const W=512,H=128;
 const rr=(p,r)=>{x.beginPath();x.moveTo(p+r,p);x.arcTo(W-p,p,W-p,H-p,r);x.arcTo(W-p,H-p,p,H-p,r);x.arcTo(p,H-p,p,p,r);x.arcTo(p,p,W-p,p,r);x.closePath()};
 x.fillStyle='rgba(11,16,34,.82)';rr(10,30);x.fill();
 if(frame==='arany'){const g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'#b45309');g.addColorStop(.5,'#fde68a');g.addColorStop(1,'#b45309');x.strokeStyle=g;x.lineWidth=10;rr(10,30);x.stroke()}
 else if(frame==='neon'){x.shadowColor='#22d3ee';x.shadowBlur=22;x.strokeStyle='#67e8f9';x.lineWidth=6;rr(14,30);x.stroke();x.shadowBlur=0}
 else if(frame==='tuskes'){x.fillStyle='#e5e7eb';for(let i=0;i<14;i++){const px=30+i*33;x.beginPath();x.moveTo(px,12);x.lineTo(px+12,0);x.lineTo(px+24,12);x.fill();x.beginPath();x.moveTo(px,H-12);x.lineTo(px+12,H);x.lineTo(px+24,H-12);x.fill()}x.strokeStyle='#9ca3af';x.lineWidth=5;rr(12,30);x.stroke()}
 else if(frame==='viragos'){x.strokeStyle='#f9a8d4';x.lineWidth=5;rr(12,30);x.stroke();x.font='34px "Segoe UI Emoji",sans-serif';x.textBaseline='middle';['🌸','🌼','🌷'].forEach((e,i)=>{x.fillText(e,6,26+i*38);x.fillText(e,W-40,26+i*38)})}
 else if(frame==='pixel'){x.fillStyle='#a855f7';for(let i=0;i<W;i+=16){if((i/16)%2===0){x.fillRect(i,6,16,10);x.fillRect(i,H-16,16,10)}}for(let j=0;j<H;j+=16){if((j/16)%2===0){x.fillRect(6,j,10,16);x.fillRect(W-16,j,10,16)}}}
 x.fillStyle='#fff';x.font='bold 52px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillText(String(name).slice(0,16),W/2,H/2+2);return c}
let NPS=null;
function myName(){return(typeof ACC!=='undefined'&&ACC&&ACC.user&&ACC.user.name)||(typeof S!=='undefined'&&S.name)||'Játékos'}
function npAttach(){const g=gG();NPS=null;const t=new THREE.CanvasTexture(npCanvas(myName(),NP.frame));const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false}));s.scale.set(3.2,.8,1);s.position.y=4.3;g.pm.add(s);
 let e=null;if(NP.emb){e=spr(NP.emb,.9);e.position.set(0,5.15,0);g.pm.add(e)}NPS={s,e}}
function npTick(t){if(!NPS||!NPS.e)return;const e=NPS.e;if(NP.anim==='porog'){e.material.rotation=t*2}else if(NP.anim==='pulzal'){const k=.9+Math.sin(t*5)*.18;e.scale.set(k,k,1)}else e.position.y=5.15+Math.sin(t*3)*.15}
function plates(){const name=myName();show('<h2>🏷️ Névtábla-keret és embléma</h2><canvas id="npPv" width="512" height="128" style="width:100%;max-width:420px;display:block;margin:6px auto"></canvas><div id="npEm" style="text-align:center;font-size:34px;height:44px"></div><div>Keret: '+Object.entries(FR).map(([k,v])=>'<button data-f="'+k+'" style="'+btn+(NP.frame===k?';border-color:#a78bfa':'')+'">'+v[0]+(NP.own.includes(k)?'':' · '+fmt(PR('ruha',v[1])))+'</button>').join('')+'</div><div>Embléma (ingyenes): '+EMB.map(e=>'<button data-e="'+e+'" style="'+btn+(NP.emb===e?';border-color:#a78bfa':'')+'">'+(e||'—')+'</button>').join('')+'</div><div>Animáció: '+[['porog','🔄 Pörög'],['pulzal','💓 Pulzál'],['lebeg','🎈 Lebeg']].map(([k,t])=>'<button data-a="'+k+'" style="'+btn+(NP.anim===k?';border-color:#a78bfa':'')+'">'+t+'</button>').join('')+'</div><div style="font-size:12px;color:#94a3b8">A meccseken a karaktered feje fölött látszik. Egyenleg: '+fmt(money())+'</div>');
 const pv=pan.querySelector('#npPv').getContext('2d');pv.drawImage(npCanvas(name,NP.frame),0,0);const em=pan.querySelector('#npEm');em.textContent=NP.emb;let a=0;const an=()=>{if(pan.style.display==='none'||!pan.contains(em))return;a+=.05;em.style.transform=NP.anim==='porog'?'rotate('+(a*60%360)+'deg)':NP.anim==='pulzal'?'scale('+(1+Math.sin(a*5)*.15)+')':'translateY('+(Math.sin(a*3)*6)+'px)';requestAnimationFrame(an)};an();
 pan.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const k=b.dataset.f;if(!NP.own.includes(k)){if(!spend(PR('ruha',FR[k][1])))return;NP.own.push(k)}NP.frame=k;SV('k3b33np',NP);plates()});
 pan.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{NP.emb=b.dataset.e;SV('k3b33np',NP);plates()});
 pan.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{NP.anim=b.dataset.a;SV('k3b33np',NP);plates()})}

// =============== 22) KUTYA-RUHÁK + KUTYÁS EMOTE-OK ===============
let DC=LS('k3b33dog',{own:[],cur:''});
const DCL={pulover:['🧶 Kötött pulóver',6000,0xdc2626],esokabat:['🌧️ Esőkabát',7000,0xfacc15],kopeny:['🦸 Szuperhős köpeny',12000,0x2563eb],frakk:['🎩 Frakk',15000,0x111827],mikulas:['🎅 Ünnepi ruha',9000,0xb91c1c]};
let dogCos=null,dogEmo=null,dogBub=null;
function lobbyDog(){const L=window.LB3D;return L&&L.dog&&L.dog.userData.pet?L.dog:null}
function dogDress(){const w=lobbyDog();if(!w)return;const d=w.userData.pet;if(dogCos){dogCos.parent&&dogCos.parent.remove(dogCos);dogCos.traverse(o=>{if(o.geometry)o.geometry.dispose()});dogCos=null}if(!DC.cur)return;
 const box=new THREE.Box3().setFromObject(d),sz=new THREE.Vector3();box.getSize(sz);const s=w.scale.x||1;const c=DCL[DC.cur][2],m=new THREE.MeshLambertMaterial({color:c});
 const g=new THREE.Group();const L=Math.max(sz.x,sz.z)/s,Hh=sz.y/s;// a kutya lokális tengelyei: hossz a nagyobbik vízszintes
 const along=sz.x>sz.z?'x':'z';const body=new THREE.Mesh(new THREE.BoxGeometry(along==='x'?L*.5:Hh*.36,Hh*.26,along==='x'?Hh*.36:L*.5),m);body.position.y=Hh*.55;g.add(body);
 if(DC.cur==='kopeny'){const cp=new THREE.Mesh(new THREE.PlaneGeometry(along==='x'?L*.55:Hh*.42,Hh*.35),new THREE.MeshLambertMaterial({color:0xef4444,side:THREE.DoubleSide}));cp.rotation.x=-Math.PI/2;cp.position.y=Hh*.7;g.add(cp)}
 if(DC.cur==='mikulas'){const tr=new THREE.Mesh(new THREE.BoxGeometry(along==='x'?L*.52:Hh*.38,Hh*.06,along==='x'?Hh*.38:L*.52),new THREE.MeshLambertMaterial({color:0xffffff}));tr.position.y=Hh*.43;g.add(tr)}
 if(DC.cur==='frakk'){const bt=new THREE.Mesh(new THREE.BoxGeometry(Hh*.08,Hh*.08,Hh*.08),new THREE.MeshLambertMaterial({color:0xffffff}));bt.position.y=Hh*.7;g.add(bt)}
 const ctr=box.getCenter(new THREE.Vector3());d.worldToLocal(ctr);g.position.set(ctr.x,0,ctr.z);g.position.y+=d.position.y;d.parent.add(g);dogCos=g}
const DEMO={porog:['🌀 Pörgés',1.2],ugrik:['🦘 Ugrás',.9],ul:['🪑 Ül',1.6],pacsi:['🐾 Pacsi',1.4],ugat:['🗯️ Vau!',1.2],farok:['💗 Farokcsóválás',1.6]};
function dogEmote(k){const w=lobbyDog();if(!w){tell('A kutyád a lobbyban jelenik meg');return}if(!dogBub){dogBub=spr('🐾',.9);}if(dogBub.material.map)dogBub.material.map.dispose();const nb=spr(DEMO[k][0].split(' ')[0],.9);dogBub.material.map=nb.material.map;nb.material.dispose();dogBub.position.set(0,2.6,0);if(dogBub.parent!==w)w.add(dogBub);dogBub.visible=true;
 dogEmo={k,t:0,T:DEMO[k][1],ry:w.rotation.y,y:w.position.y};if(k==='ugat'){try{sfx('buy')}catch(e){}}}
function dogTick(dt){if(!dogEmo)return;const w=lobbyDog();if(!w){dogEmo=null;return}const e=dogEmo;e.t+=dt;const f=Math.min(1,e.t/e.T),d=w.userData.pet;
 if(e.k==='porog')w.rotation.y=e.ry+f*Math.PI*2;else if(e.k==='ugrik')w.position.y=e.y+Math.sin(f*Math.PI)*1.1;else if(e.k==='ul')d.rotation.x=f<.8?-.35:-.35*(1-(f-.8)/.2);else if(e.k==='pacsi'){d.rotation.z=Math.sin(f*Math.PI)*.25}else if(e.k==='ugat'){d.userData.head&&(d.userData.head.rotation.x=Math.sin(f*Math.PI*6)*.25)}else if(e.k==='farok'){w.position.x+=Math.sin(e.t*20)*.004}
 if(f>=1){w.rotation.y=e.ry;w.position.y=e.y;d.rotation.x=0;d.rotation.z=0;if(dogBub)dogBub.visible=false;dogEmo=null}}
function dogs(){show('<h2>🐕 Kutya-ruhák és kutyás emote-ok</h2><div>Ruhák (a lobby-kutyádon): <button data-c="" style="'+btn+(!DC.cur?';border-color:#a78bfa':'')+'">Nincs</button>'+Object.entries(DCL).map(([k,v])=>'<button data-c="'+k+'" style="'+btn+(DC.cur===k?';border-color:#a78bfa':'')+'">'+v[0]+(DC.own.includes(k)?'':' · '+fmt(PR('ruha',v[1])))+'</button>').join('')+'</div><div style="margin-top:8px">Emote-ok: '+Object.entries(DEMO).map(([k,v])=>'<button data-m="'+k+'" style="'+btn+'">'+v[0]+'</button>').join('')+'</div><div style="font-size:12px;color:#94a3b8">Egyenleg: '+fmt(money())+(lobbyDog()?'':' · (a lobby 3D nézetében látszik)')+'</div>');
 pan.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const k=b.dataset.c;if(k&&!DC.own.includes(k)){if(!spend(PR('ruha',DCL[k][1])))return;DC.own.push(k)}DC.cur=k;SV('k3b33dog',DC);dogDress();dogs()});
 pan.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>dogEmote(b.dataset.m))}
(function hookLobby(){const L=window.LB3D;if(!L||!L.fx||!L.dog){setTimeout(hookLobby,1000);return}dogDress();let last=0;L.fx.push(t=>{const dt=last?Math.min(.1,t-last):.016;last=t;dogTick(dt);if(dogCos&&L.dog&&dogCos.parent!==L.dog.userData.pet.parent)dogDress()})})();

// =============== 20) LAKÁS A LOBBYBAN ===============
let FL=LS('k3b33flat',{items:[],wall:'#c7b8a3',floor:'#8b5a2b'});
const FURN={kanape:['🛋️ Kanapé',8000],asztal:['🪵 Asztal',4000],lampa:['💡 Állólámpa',2500],polc:['🗄️ Trófeapolc',6000],noveny:['🪴 Növény',1500],szonyeg:['🟥 Szőnyeg',2000],tv:['📺 Tévé',9000],agy:['🛏️ Ágy',10000]};
let flScene=null,flGroup=null,flTool='kanape',flRot=0;
const FG={};function fgeo(k,f){return FG[k]||(FG[k]=f())}
const FM={};function fmat(c){return FM[c]||(FM[c]=new THREE.MeshLambertMaterial({color:c}))}
function trophies(){const t=[];try{const kp=window._kp&&_kp.ST;if(kp&&kp.win)t.push(['💦',kp.win+' köpködős győzelem']);const tr=JSON.parse(localStorage.getItem('k3b32tour')||'null');if(tr&&!tr.on&&tr.b[tr.b.length-1].length===1&&tr.b[tr.b.length-1][0]===tr.me)t.push(['🏆','Köpködős bajnok']);const v=+localStorage.getItem('k3b31vault')||0;if(v)t.push(['🗝️',v+'× titkos szoba']);if(typeof S!=='undefined'&&S.lv)t.push(['⭐',S.lv+'. szint']);if(typeof S!=='undefined'&&S.b)t.push(['💰','Legnagyobb nyeremény: '+fmt(S.b)])}catch(e){}if(!t.length)t.push(['🥉','Első lakás']);return t}
function mkFurn(it){const g=new THREE.Group(),k=it.k;const B=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(fgeo('b'+w+h+d,()=>new THREE.BoxGeometry(w,h,d)),fmat(c));m.position.set(x,y,z);g.add(m);return m};
 if(k==='kanape'){B(1.8,.45,.8,0x7c3aed,0,.25,0);B(1.8,.6,.2,0x6d28d9,0,.6,-.32);B(.2,.4,.8,0x6d28d9,-.85,.5,0);B(.2,.4,.8,0x6d28d9,.85,.5,0)}
 else if(k==='asztal'){B(1.2,.08,.7,0x92400e,0,.7,0);[[-.5,-.28],[.5,-.28],[-.5,.28],[.5,.28]].forEach(([x,z])=>B(.07,.7,.07,0x78350f,x,.35,z))}
 else if(k==='lampa'){B(.3,.05,.3,0x374151,0,.03,0);B(.05,1.5,.05,0x374151,0,.78,0);const s=new THREE.Mesh(fgeo('lmp',()=>new THREE.ConeGeometry(.3,.35,12,1,true)),new THREE.MeshBasicMaterial({color:0xfde68a,side:THREE.DoubleSide}));s.position.y=1.6;g.add(s)}
 else if(k==='polc'){B(1.6,1.6,.35,0x78350f,0,.8,0);[.45,.95,1.45].forEach(y=>B(1.5,.04,.32,0xa16207,0,y,.02));trophies().slice(0,6).forEach((t,i)=>{const s=spr(t[0],.42);s.position.set(-.5+(i%3)*.5,.7+Math.floor(i/3)*.5,.12);g.add(s)})}
 else if(k==='noveny'){B(.35,.35,.35,0xb45309,0,.18,0);const m=new THREE.Mesh(fgeo('nov',()=>new THREE.SphereGeometry(.38,10,8)),fmat(0x16a34a));m.position.y=.7;g.add(m)}
 else if(k==='szonyeg'){B(1.8,.02,1.2,0xb91c1c,0,.01,0)}
 else if(k==='tv'){B(1.2,.5,.4,0x1f2937,0,.25,0);B(1.3,.75,.06,0x111827,0,.9,0);const sc=new THREE.Mesh(fgeo('tvs',()=>new THREE.PlaneGeometry(1.2,.66)),new THREE.MeshBasicMaterial({color:0x38bdf8}));sc.position.set(0,.9,.035);g.add(sc)}
 else if(k==='agy'){B(1.2,.35,2,0x92400e,0,.2,0);B(1.1,.15,1.9,0xf1f5f9,0,.45,0);B(.9,.12,.35,0xffffff,0,.58,-.75)}
 g.position.set(it.x-2.5,0,it.z-2.5);g.rotation.y=(it.r||0)*Math.PI/2;return g}
function flRebuild(){if(flGroup){flScene.remove(flGroup)}flGroup=new THREE.Group();FL.items.forEach(it=>flGroup.add(mkFurn(it)));flScene.add(flGroup);
 flScene.userData.floor.material.color.set(FL.floor);flScene.userData.wall.forEach(w=>w.material.color.set(FL.wall))}
function flat(){if(!flScene){flScene=baseScene(0x0f172a);const fl=new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshLambertMaterial({color:FL.floor}));fl.rotation.x=-Math.PI/2;flScene.add(fl);
  const wm=new THREE.MeshLambertMaterial({color:FL.wall});const w1=new THREE.Mesh(new THREE.PlaneGeometry(6,3),wm);w1.position.set(0,1.5,-3);const w2=new THREE.Mesh(new THREE.PlaneGeometry(6,3),wm);w2.position.set(-3,1.5,0);w2.rotation.y=Math.PI/2;flScene.add(w1,w2);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9),new THREE.MeshBasicMaterial({color:0x7dd3fc}));win.position.set(.8,1.7,-2.99);flScene.add(win);flScene.userData={floor:fl,wall:[w1,w2]}}
 show('<h2>🏠 Lakásom</h2><div style="display:flex;flex-wrap:wrap;gap:12px"><div id="b33v" style="flex:0 0 320px"></div><div style="flex:1;min-width:220px"><div>Bútor: '+Object.entries(FURN).map(([k,v])=>'<button data-u="'+k+'" style="'+btn+(flTool===k?';border-color:#a78bfa':'')+'">'+v[0]+' '+fmt(PR('butor',v[1]))+'</button>').join('')+'<button data-u="del" style="'+btn+(flTool==='del'?';border-color:#a78bfa':'')+'">🧽 Eladás (50%)</button></div><div>Forgatás: <button id="flR" style="'+btn+'">↻ '+(flRot*90)+'°</button> Fal '+col('flW',FL.wall)+' Padló '+col('flF',FL.floor)+'</div><canvas id="flG" width="240" height="240" style="background:#1e293b;border-radius:8px;display:block;margin:6px 0;cursor:pointer;max-width:100%"></canvas><div style="font-size:12px;color:#94a3b8">Kattints a rácsra a lerakáshoz (6×6). Trófeák a polcon: '+trophies().map(t=>t[0]+' '+t[1]).join(', ')+'<br>Egyenleg: '+fmt(money())+'</div></div></div>',flScene,c=>{c.position.set(4.2,4.4,4.6);c.lookAt(-.4,.4,-.4)});
 flRebuild();const cv=pan.querySelector('#flG'),x=cv.getContext('2d');const ic=Object.fromEntries(Object.entries(FURN).map(([k,v])=>[k,v[0].split(' ')[0]]));
 const draw=()=>{x.clearRect(0,0,240,240);x.strokeStyle='#334155';for(let i=0;i<=6;i++){x.beginPath();x.moveTo(i*40,0);x.lineTo(i*40,240);x.stroke();x.beginPath();x.moveTo(0,i*40);x.lineTo(240,i*40);x.stroke()}x.font='24px "Segoe UI Emoji",sans-serif';x.textAlign='center';x.textBaseline='middle';FL.items.forEach(it=>x.fillText(ic[it.k],(it.x+.5)*40,(it.z+.5)*40))};draw();
 cv.onclick=e=>{const r=cv.getBoundingClientRect(),gx=Math.floor((e.clientX-r.left)/r.width*6),gz=Math.floor((e.clientY-r.top)/r.height*6);if(gx<0||gz<0||gx>5||gz>5)return;const i=FL.items.findIndex(it=>it.x===gx&&it.z===gz);
  if(flTool==='del'){if(i>=0){const it=FL.items.splice(i,1)[0];S.c+=Math.round((it.p||FURN[it.k][1])/2);try{save()}catch(er){}}}else{if(i>=0){tell('Ez a hely foglalt');return}if(FL.items.length>=24){tell('Max. 24 bútor');return}{const pp=PR('butor',FURN[flTool][1]);if(!spend(pp))return;FL.items.push({k:flTool,x:gx,z:gz,r:flRot,p:pp})}}
  SV('k3b33flat',FL);flRebuild();draw()};
 pan.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{flTool=b.dataset.u;flat()});
 pan.querySelector('#flR').onclick=()=>{flRot=(flRot+1)%4;flat()};
 pan.querySelector('#flW').oninput=e=>{FL.wall=e.target.value;SV('k3b33flat',FL);flScene.userData.wall.forEach(w=>w.material.color.set(FL.wall))};
 pan.querySelector('#flF').oninput=e=>{FL.floor=e.target.value;SV('k3b33flat',FL);flScene.userData.floor.material.color.set(FL.floor)}}

// ---------- meccs-hookok (névtábla) ----------
function WP2(n,post){const o=window[n];if(typeof o!=='function')return;window[n]=function(){const r=o.apply(this,arguments);try{post(arguments)}catch(e){console.warn('b33 '+n,e)}return r}}
let npKey='';WP2('launch',()=>{npKey=''});
let tt=0;WP2('update',a=>{const g=gG();if(!g||!g.pm||(NP.frame==='nincs'&&!NP.emb))return;const k=NP.frame+NP.emb+myName();
 if(k!==npKey){if(NPS){NPS.s.parent&&NPS.s.parent.remove(NPS.s);NPS.s.material.map.dispose();NPS.s.material.dispose();if(NPS.e)NPS.e.parent&&NPS.e.parent.remove(NPS.e)}npAttach();npKey=k}
 else if(NPS&&NPS.s.parent!==g.pm){g.pm.add(NPS.s);if(NPS.e)g.pm.add(NPS.e)}
 tt+=a[0]||.016;npTick(tt)});
// ---------- menüpontok ----------
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}
 _lb2.add({ic:'🧑‍🎨',hu:'Karakterszerkesztő',tx:'Karakterszerkesztő',c:'cust',fn:charEditor,kw:'karakter arc haj testalkat szin szerkeszto'});
 _lb2.add({ic:'🏠',hu:'Lakásom',tx:'Lakásom',c:'cust',fn:flat,kw:'lakas butor szoba trofea otthon'});
 _lb2.add({ic:'🏷️',hu:'Névtábla',tx:'Névtábla',c:'cust',fn:plates,kw:'nevtabla keret embléma emblema'});
 _lb2.add({ic:'🐕',hu:'Kutya-ruhák',tx:'Kutya-ruhák',c:'cust',fn:dogs,kw:'kutya ruha emote pet allat'})})();
window._b33={charEditor,flat,plates,dogs,CE:()=>CE,NP:()=>NP,FL:()=>FL,DC:()=>DC,dogEmote,ceBuild,npCanvas,close};
})();
