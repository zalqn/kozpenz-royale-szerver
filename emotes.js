// emotes.js – 50 EMOTE + emote-kerék (Ő / [ billentyű nyomva tartva) + gyűjtemény-panel előnézettel.
// Meccsben harmadik személyű kamera az emote idejére (mozgás/lövés megszakítja), lobbyban a lobby-karakter (LB3D.me) adja elő.
// Mentés: localStorage k3emote {own:{id:1}, fav:[8 id]}. Debug: window._emo.play(id), _emo.list
(function(){
'use strict';
if(typeof THREE==='undefined')return;
const $=id=>document.getElementById(id);
const S_=Math.sin,C_=Math.cos,AB=Math.abs,PI=Math.PI;
const sw=(t,f,p)=>S_(t*f+(p||0));            // szinusz
const pos=(t,f,p)=>AB(S_(t*f+(p||0)));        // pozitív szinusz (ugrálás)
const sq=(t,f)=>S_(t*f)>0?1:-1;               // négyszög (robot)
const ease=(t,a,b)=>Math.max(0,Math.min(1,(t-a)/(b-a)));
const sm=x=>x*x*(3-2*x);
// kulcskocka-interpoláció: K=[[t,érték],...] → lineáris + simított
const kf=(K,t)=>{if(t<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(t<=K[i][0]){const a=K[i-1],b=K[i],k=sm((t-a[0])/(b[0]-a[0]));return a[1]+(b[1]-a[1])*k}return K[K.length-1][1]};
// póz: la/ra=[x,z] karok (x<0 előre/fel; kifelé emelés: la z<0, ra z>0), ll/rl=[x,z] lábak, y/rx/ry/rz törzs
const CATS=[['all','✨ Mind'],['tanc','💃 Tánc'],['gesz','👋 Gesztus'],['vicc','🤪 Vicces'],['unn','🎉 Ünneplő'],['kozp','🏛️ Közpénzes']];
// [id, név, ikon, kategória, hossz(s), ár Ft (0=ingyenes), szint, póz-fv, kellékek, események [[periódus,fázis,hang/effekt]]]
const E=[];
const D=(id,n,ic,c,dur,pr,lv,f,pr2,ev)=>E.push({id,n,ic,c,dur,pr,lv:lv||0,f,props:pr2||[],ev:ev||[]});
// ---------- TÁNC ----------
D('hullam','Kormányhullám','🌊','tanc',5,0,0,t=>({la:[0,-1.3-.5*sw(t,6)],ra:[0,1.3+.5*sw(t,6,1.2)],y:.06*pos(t,6),rz:sw(t,3)*.08}));
D('csardas','Költségvetési csárdás','🪗','tanc',5,2500,0,t=>({la:[-.2,-.5],ra:[-.2,.5],ll:[S_(t*8)>0?-.7*pos(t,8):0,0],rl:[S_(t*8)<0?-.7*pos(t,8):0,0],y:.18*pos(t,8),ry:sw(t,2)*.6}),[],[[.393,0,'beat']]);
D('robot','Robotbürokrata','🤖','tanc',5,3000,0,t=>{const q=Math.floor(t*3)%4;return{la:[[0,-1.57,-1.57,0][q],0],ra:[[-1.57,0,0,-1.57][q],0],ry:[0,.4,0,-.4][q],y:.03*sq(t,9)}},[],[[.333,0,'tick']]);
D('porgo','Pörgő pályázat','🌀','tanc',4,0,0,t=>({la:[0,-1.5],ra:[0,1.5],ry:t*8,y:.1*pos(t,4),ll:[0,-.15],rl:[0,.15]}));
D('kotel','Ugrókötél-reform','🪢','tanc',5,2000,0,t=>({la:[-.5+.4*sw(t,14),-.4],ra:[-.5+.4*sw(t,14),.4],y:.45*pos(t,7),ll:[-.2*pos(t,7),0],rl:[-.2*pos(t,7),0]}));
D('diszko','Diszkó-dekrétum','🪩','tanc',5,4000,0,t=>{const u=S_(t*4)>0;return{la:[-.3,.4],ra:[u?-2.8:-.6,u?.5:-.2],rz:sw(t,4)*.12,y:.05*pos(t,8),ll:[0,-.1*pos(t,4)],rl:[0,.1*pos(t,4,1.5)]}},[],[[.785,0,'beat']]);
D('hivatal','Hullámzó hivatal','🎐','tanc',5,1500,0,t=>({rz:sw(t,3)*.28,la:[0,-.8-.7*sw(t,3)],ra:[0,.8-.7*sw(t,3)],ll:[0,-.15],rl:[0,.15]}));
D('kalimpa','Kalimpáló kampány','🙌','tanc',5,3500,0,t=>({la:[sw(t,9)*1.8-1,-.5-sw(t,7)*.6],ra:[sw(t,8,2)*1.8-1,.5+sw(t,6)*.6],ll:[sw(t,9)*.4,0],rl:[-sw(t,9)*.4,0],y:.1*pos(t,9)}));
D('keringo','Lassú keringő','💞','tanc',6,5000,5,t=>({la:[-1.3,.5],ra:[-1.1,-.2],ry:t*1.6,rz:sw(t,3.2)*.08,y:.06*pos(t,3.2),ll:[sw(t,3.2)*.35,0],rl:[-sw(t,3.2)*.35,0]}));
D('terd','Térdrogyasztó','🦵','tanc',5,2500,0,t=>({y:-.35*pos(t,5),ll:[-.6*pos(t,5),-.2],rl:[-.6*pos(t,5),.2],la:[-1.4*pos(t,5),-.2],ra:[-1.4*pos(t,5),.2],rx:.1*pos(t,5)}));
// ---------- GESZTUS ----------
D('integet','Integetés','👋','gesz',3.5,0,0,t=>({ra:[-.4,2.5+.4*sw(t,10)],la:[0,-.08],rz:sw(t,2)*.04}));
D('tiszteleg','Tisztelgés','🫡','gesz',3,0,0,t=>{const k=ease(t,0,.3)*(1-ease(t,2.6,3));return{ra:[-2.3*k,.9*k],rx:-.05*k,ll:[0,0],rl:[0,0]}});
D('hupfel','Hüvelykujj fel','👍','gesz',3,1500,0,t=>{const k=sm(ease(t,0,.3))*(1-ease(t,2.6,3));return{ra:[-1.5*k,.15*k+.05*sw(t,8)],rx:-.08*k,y:.04*pos(t,3)}});
D('vallrand','Vállrándítás','🤷','gesz',3,1500,0,t=>{const k=pos(t,PI*.8);return{la:[-.5,-.6*k-.1],ra:[-.5,.6*k+.1],y:.08*k,rz:sw(t,1.2)*.05}});
D('facepalm','Arctenyerelés','🤦','gesz',3.5,2000,0,t=>{const k=sm(ease(t,0,.4))*(1-ease(t,3,3.5));return{ra:[-2.7*k,-.55*k],rx:.25*k,ry:sw(t,3)*.08*k}});
D('gyere','Gyere ide','🫴','gesz',3.5,1500,0,t=>({ra:[-1.3+.35*sw(t,9),-.15],la:[0,-.1],rx:-.04}));
D('hajlas','Meghajlás','🙇','gesz',3.5,1500,0,t=>{const k=kf([[0,0],[.6,1],[2.4,1],[3.2,0]],t);return{rx:.75*k,ra:[-.6*k,-.4*k],la:[.3*k,0],y:-.05*k}});
D('csitt','Csitt!','🤫','gesz',3,1500,0,t=>{const k=sm(ease(t,0,.3));return{ra:[-2.85*k,-.5*k],rx:.06*k,la:[0,-.05]}},[],[[9,.4,'shh']]);
D('gondol','Gondolkodó','🤔','gesz',4,2000,0,t=>({ra:[-2.2,-.45],la:[-1,.65],ry:sw(t,1.4)*.15,rz:.05,ll:[0,0],rl:[-.15,0]}));
D('taps','Taps','👏','gesz',4,0,0,t=>{const s=pos(t,9);return{la:[-1.4,.15+.45*s],ra:[-1.4,-.15-.45*s],y:.02*s}},[],[[.349,0,'clap']]);
// ---------- VICCES ----------
D('csirke','Csirketánc','🐔','vicc',5,0,0,t=>({la:[.2,-.3-.6*pos(t,10)],ra:[.2,.3+.6*pos(t,10)],y:.1*pos(t,5),rx:.25+.1*sw(t,10),ll:[-.4*pos(t,5),0],rl:[-.4*pos(t,5,1.57),0]}),[],[[.628,0,'cluck']]);
D('zseles','Zselé-hivatalnok','🍮','vicc',4,2500,0,t=>({rz:sw(t,9)*.15,rx:C_(t*7)*.1,la:[sw(t,9)*.3,-.2],ra:[-sw(t,9)*.3,.2],y:-.05*pos(t,9)}));
D('fal','Láthatatlan fal','🧱','vicc',5,3000,0,t=>{const p=sw(t,2.5);return{la:[-1.6,.1+.15*p],ra:[-1.6,-.1+.15*p],ry:p*.25,rz:p*.06}});
D('csuszik','Csúszós parketta','🧼','vicc',4,3500,0,t=>({rx:.3*sw(t,5),rz:.2*sw(t,7),la:[-1.2*pos(t,5),-1.2],ra:[-1.2*pos(t,5,1),1.2],ll:[-.7*sw(t,5),0],rl:[.5*sw(t,5),0]}));
D('majom','Majomparádé','🐒','vicc',5,2500,0,t=>({la:[-2.6*pos(t,6),-.4],ra:[-2.6*pos(t,6,1.57),.4],y:.25*pos(t,6),rz:sw(t,6)*.15,ll:[0,-.3],rl:[0,.3]}),[],[[1.047,0,'boing']]);
D('spagetti','Spagettiláb','🍝','vicc',4,2000,0,t=>({ll:[sw(t,7)*.3,-.35*pos(t,5)],rl:[sw(t,7,2)*.3,.35*pos(t,5,1)],rz:sw(t,5)*.12,y:-.12*pos(t,5),la:[0,-.5],ra:[0,.5]}));
D('hasfajas','Ebéd utáni hasfájás','🤢','vicc',4,1500,0,t=>({rx:.45+.08*sw(t,6),la:[-1.1,.55],ra:[-1.1,-.55],y:-.1,rz:sw(t,6)*.05}));
D('alvo','Elalvó ügyintéző','😴','vicc',5,2000,0,t=>{const k=kf([[0,0],[1.4,1],[1.6,.1],[3,1],[3.2,.1],[5,1]],t);return{rx:.35*k,la:[0,-.03],ra:[0,.03],y:-.04*k}},[],[[1.6,1.5,'snore']]);
D('szelmalom','Szélmalom-beruházás','🌬️','vicc',4,3000,0,t=>({ra:[-t*10,.15],la:[-t*10+PI,-.15],rz:sw(t,5)*.06}));
D('pingvin','Pingvinséta','🐧','vicc',4,2000,0,t=>({la:[0,-.25],ra:[0,.25],rz:sw(t,6)*.22,ll:[0,-.1*pos(t,6)],rl:[0,.1*pos(t,6,1.57)],ry:sw(t,3)*.2}));
// ---------- ÜNNEPLŐ ----------
D('konfetti','Konfettieső','🎊','unn',5,0,0,t=>({la:[-2.9,-.3],ra:[-2.9,.3],y:.15*pos(t,5),ry:sw(t,2)*.3}),[],[[.12,0,'conf'],[1.2,0,'pop']]);
D('zaszlo','Zászlólengetés','🚩','unn',5,2500,0,t=>({la:[-2.7,-.4+.35*sw(t,6)],ra:[0,.15],rz:sw(t,6)*.06,y:.04*pos(t,6)}),['flag']);
D('ugras','Győzelmi ugrás','🦘','unn',4,0,0,t=>{const j=pos(t,4);return{y:.9*j,la:[-2.8*j,-.4],ra:[-2.8*j,.4],ll:[-.5*j,0],rl:[-.5*j,0]}},[],[[.785,.2,'boing']]);
D('bajnok','Bajnoki pörgés','🏆','unn',4,4000,3,t=>({ry:t*10,la:[-2.9,-.2],ra:[-2.9,.2],y:.3*pos(t,5)}),['cup'],[[.25,0,'conf']]);
D('ero','Erőpóz','💪','unn',3.5,2000,0,t=>{const k=sm(ease(t,0,.4));return{la:[-.2*k,-1.5*k],ra:[-.2*k,1.5*k],y:.03*pos(t,6),ll:[0,-.25*k],rl:[0,.25*k],rx:-.08*k}});
D('pezsgo','Pezsgőbontás','🍾','unn',5,5000,5,t=>({ra:[t<2?-1.2-.25*sw(t,25):-2.8,.2],la:[-1.2,-.1],rx:t<2?.05:-.1}),['bottle'],[[99,2,'pop'],[.08,0,'confD']]);
D('tuzijatek','Tűzijáték','🎆','unn',5,4500,0,t=>({ra:[-2.9,.3],la:[-.4,-.2],rx:-.15,ry:sw(t,1)*.3}),[],[[1,.3,'firew'],[1,.35,'conf']]);
D('terdcsusz','Térdcsúszás','🧎','unn',4,3500,0,t=>{const k=sm(ease(t,0,.5));return{y:-.55*k,rx:-.3*k,ll:[-1.2*k,0],rl:[1.1*k,0],la:[-2.8*k,-.6*k],ra:[-2.8*k,.6*k]}});
D('tapsfent','Fejfeletti taps','🙌','unn',4,1500,0,t=>{const s=pos(t,8);return{la:[-2.9,.1+.4*s],ra:[-2.9,-.1-.4*s],y:.08*pos(t,4)}},[],[[.393,0,'clap']]);
D('okol','Ökölpumpa','✊','unn',4,1500,0,t=>({ra:[-2.2-.6*pos(t,7),.2],la:[-.3,-.1],y:.08*pos(t,7)}),[],[[.449,0,'hey']]);
// ---------- KÖZPÉNZES (szatíra) ----------
D('szamol','Pénzszámolás','💵','kozp',5,0,0,t=>({la:[-1.2,.45],ra:[-1.1+.3*pos(t,10),-.35],rx:.12,ry:sw(t,1.5)*.05}),['wad'],[[.314,0,'bill'],[.628,0,'coin']]);
D('pecset','Pecsételés','🔏','kozp',5,0,0,t=>{const k=pos(t,PI*1.6);return{ra:[-1.6+.9*k,-.1],la:[-1,.3],rx:.15+.08*k,y:-.03*k}},['stamp'],[[.625,.25,'stamp']]);
D('szalag','Szalagátvágás','✂️','kozp',5,3000,0,t=>{const c=t>1.6&&t<2.2;return{ra:[-1.3,c?-.3:.25],la:[-1.2,-.3],rx:c?.15:0,y:t>2.2?.15*pos(t,6):0}},['scissors','ribbon'],[[99,1.9,'snip'],[99,2,'cut'],[.15,2.1,'confD']]);
D('kezfog','Kézfogás-integetés','🤝','kozp',5,2500,0,t=>({ra:[-1.4+.12*sw(t,14),-.1],la:[-.3,2.4+.4*sw(t,9)],ry:sw(t,1.3)*.3}),[],[[1.6,.2,'cam']]);
D('penzeso','Pénzeső','💸','kozp',5,6000,8,t=>({la:[-2.8,-.5-.2*sw(t,6)],ra:[-2.8,.5+.2*sw(t,6)],y:.08*pos(t,6),ry:sw(t,1.5)*.4}),[],[[.07,0,'billRain'],[.6,0,'coin']]);
D('alair','Aláírás','✍️','kozp',4,2000,0,t=>({ra:[-1.1+.08*S_(t*13),-.25+.1*C_(t*11)],la:[-.9,.3],rx:.25}),['pen'],[[.5,0,'scribble']]);
D('beszed','Pulpitusbeszéd','🎤','kozp',6,4000,0,t=>({ra:[-1.4-.6*pos(t,2.2),.3+.3*sw(t,3)],la:[-.9-.4*pos(t,1.7),-.2],rx:-.05+.05*sw(t,2.2),ry:sw(t,.9)*.35}),['mic'],[[.7,0,'blah']]);
D('plakat','Kampányplakát','🪧','kozp',5,3500,0,t=>({la:[-2.9,.15],ra:[-2.9,-.15],ry:sw(t,1.5)*.5,y:.05*pos(t,3)}),['sign']);
D('zsebre','Zsebre tesz','🤑','kozp',5,5000,10,t=>{const p=(t*1.2)%1;const k=p<.5?sm(p*2):sm(2-p*2);return{ra:[-1.1+.9*k,.25*k],ry:-.25*k,rx:.06,la:[-.3,-.1]}},['bill'],[[.833,.4,'coin']]);
D('alapko','Alapkőletétel','🧱','kozp',5,4500,0,t=>{const k=kf([[0,0],[1,1],[2.2,1],[3,0],[5,0]],t);return{y:-.5*k,rx:.45*k,ll:[-1*k,0],rl:[-.2*k,0],la:[-1.2*k,.2],ra:[-1.2*k,-.2]}},['brick'],[[99,2.2,'stamp'],[99,3.2,'clap'],[.2,3.2,'confD']]);
const BY={};E.forEach(e=>BY[e.id]=e);
const FREE=E.filter(e=>!e.pr&&!e.lv).map(e=>e.id);// 10 ingyenes

// ---------- mentés ----------
const ld=()=>{try{return JSON.parse(localStorage.getItem('k3emote')||'{}')||{}}catch(e){return{}}};
const SV=Object.assign({own:{},fav:['integet','taps','hullam','porgo','szamol','pecset','konfetti','ugras']},ld());
if(!Array.isArray(SV.fav)||SV.fav.length!==8)SV.fav=['integet','taps','hullam','porgo','szamol','pecset','konfetti','ugras'];
const save=()=>{try{localStorage.setItem('k3emote',JSON.stringify(SV))}catch(e){}};
const lv=()=>{try{return S.lv|0}catch(e){return 0}};
const owned=id=>{const e=BY[id];if(!e)return false;return !e.pr&&!e.lv||!!SV.own[id]||(e.lv&&!e.pr&&lv()>=e.lv)};
const money=()=>{try{return S.c|0}catch(e){return 0}};
function buy(id){const e=BY[id];if(!e||owned(id))return true;if(e.lv&&lv()<e.lv){toast('🔒 '+e.lv+'. szint szükséges!');return false}
 if(money()<e.pr){toast('💸 Nincs elég pénzed ('+fmt(e.pr)+')');return false}
 try{S.c-=e.pr;if(typeof window.save==='function')window.save();else localStorage.setItem('k3c',JSON.stringify(S.c))}catch(x){}
 SV.own[id]=1;save();snd('coin');toast('✅ Feloldva: '+e.ic+' '+e.n);return true}
const fmt=n=>(n|0).toLocaleString('hu-HU')+' Ft';

// ---------- hang (rövid WebAudio) ----------
let AC=null;const ac=()=>{try{if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}catch(e){return null}};
let VOL=.18;
function tone(f,d,type,v,f2,dl){const a=ac();if(!a)return;const t=a.currentTime+(dl||0),o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime((v||1)*VOL,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.02)}
function noise(d,v,hp,dl){const a=ac();if(!a)return;const n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=b;const f=a.createBiquadFilter();f.type='highpass';f.frequency.value=hp||800;const g=a.createGain();g.gain.value=(v||1)*VOL;s.connect(f);f.connect(g);g.connect(a.destination);s.start(a.currentTime+(dl||0))}
const SND={coin:()=>{tone(988,.08,'square',.5);tone(1319,.15,'square',.5,0,.07)},stamp:()=>{tone(120,.15,'sine',1.4,50);noise(.08,.8,300)},snip:()=>{noise(.05,.9,3000);noise(.05,.9,3000,.09)},
 pop:()=>{tone(400,.12,'sine',1,1400);noise(.06,.6,1500)},beat:()=>{tone(90,.12,'sine',1.2,45)},tick:()=>tone(1600,.03,'square',.4),clap:()=>noise(.07,1,1200),
 shh:()=>noise(.5,.4,2500),cluck:()=>{tone(700,.06,'square',.4,500);tone(900,.05,'square',.3,0,.08)},boing:()=>tone(180,.25,'sine',.9,520),snore:()=>tone(110,.6,'sawtooth',.25,80),
 hey:()=>tone(320,.12,'sawtooth',.4,420),bill:()=>noise(.04,.5,4000),cam:()=>{noise(.05,.8,2000);tone(2200,.04,'square',.2)},scribble:()=>noise(.3,.25,5000),
 blah:()=>{for(let i=0;i<3;i++)tone(200+Math.random()*120,.08,'triangle',.4,0,i*.1)},firew:()=>{tone(300,.5,'sine',.4,1500);noise(.4,.8,500,.5)},cut:()=>tone(660,.2,'triangle',.5,880)};
const snd=k=>{try{SND[k]&&SND[k]()}catch(e){}};

// ---------- kellékek (pool-ozva) ----------
const MAT={};const mm=(c,ds)=>MAT[c+(ds?'d':'')]||(MAT[c+(ds?'d':'')]=new THREE.MeshStandardMaterial({color:c,roughness:.6,side:ds?THREE.DoubleSide:THREE.FrontSide}));
const BXG=new THREE.BoxGeometry(1,1,1),PLG=new THREE.PlaneGeometry(1,1),CYG=new THREE.CylinderGeometry(1,1,1,12);
const bx=(g,geo,m,sx,sy,sz,x,y,z)=>{const p=new THREE.Mesh(geo,m);p.scale.set(sx,sy,sz);p.position.set(x,y,z);g.add(p);return p};
const MK={
 flag:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x8b5a2b),.04,2.2,.04,0,.5,0);bx(g,PLG,mm(0xce2939,1),.9,.2,1,.45,1.5,0);bx(g,PLG,mm(0xffffff,1),.9,.2,1,.45,1.3,0);bx(g,PLG,mm(0x477050,1),.9,.2,1,.45,1.1,0);return g},
 stamp:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x7c2d12),.08,.3,.08,0,.05,0);bx(g,BXG,mm(0x1e293b),.3,.12,.22,0,-.15,0);bx(g,BXG,mm(0xdc2626),.28,.03,.2,0,-.22,0);return g},
 scissors:()=>{const g=new THREE.Group();const a=bx(g,BXG,mm(0xd1d5db),.04,.04,.6,0,0,.25);a.rotation.y=.25;const b=bx(g,BXG,mm(0xd1d5db),.04,.04,.6,0,0,.25);b.rotation.y=-.25;bx(g,BXG,mm(0xef4444),.14,.06,.14,0,0,-.08);return g},
 ribbon:()=>{const g=new THREE.Group();bx(g,BXG,mm(0xdc2626),3,.12,.02,0,0,0);bx(g,CYG,mm(0x9ca3af),.04,1.6,.04,-1.5,-.8,0);bx(g,CYG,mm(0x9ca3af),.04,1.6,.04,1.5,-.8,0);g.userData.world=1;return g},
 wad:()=>{const g=new THREE.Group();bx(g,BXG,mm(0x16a34a),.32,.1,.18,0,0,.05);return g},
 bill:()=>{const g=new THREE.Group();bx(g,BXG,mm(0x22c55e),.3,.02,.16,0,0,.05);return g},
 cup:()=>{const g=new THREE.Group();bx(g,CYG,mm(0xfacc15),.16,.3,.16,0,.3,0);bx(g,CYG,mm(0xca8a04),.08,.15,.08,0,.1,0);return g},
 bottle:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x14532d),.09,.45,.09,0,.2,0);bx(g,CYG,mm(0xfacc15),.04,.15,.04,0,.5,0);return g},
 pen:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x1d4ed8),.02,.3,.02,0,0,.1).rotation.x=1.2;return g},
 mic:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x111827),.04,.3,.04,0,.1,0);bx(g,new THREE.SphereGeometry(1,10,8),mm(0x9ca3af),.08,.08,.08,0,.28,0);return g},
 sign:()=>{const g=new THREE.Group();bx(g,CYG,mm(0x8b5a2b),.03,1.4,.03,0,.6,0);const cv=document.createElement('canvas');cv.width=256;cv.height=128;const c=cv.getContext('2d');c.fillStyle='#fef3c7';c.fillRect(0,0,256,128);c.fillStyle='#b91c1c';c.font='bold 40px sans-serif';c.textAlign='center';c.fillText('SZAVAZZ',128,55);c.fillText('RÁM!',128,105);
  const t=new THREE.CanvasTexture(cv);bx(g,PLG,new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}),1.2,.6,1,0,1.5,.05);return g},
 brick:()=>{const g=new THREE.Group();bx(g,BXG,mm(0xb45309),.4,.2,.25,0,-.1,.1);return g}
};
const POOL={};const take=k=>{const p=POOL[k]||(POOL[k]=[]);return p.pop()||MK[k]()};const give=(k,o)=>{if(o.parent)o.parent.remove(o);(POOL[k]||(POOL[k]=[])).push(o)};
// részecskék: bankjegy, konfetti – pool
const PART=[];const PCOL=[0xef4444,0xfacc15,0x22c55e,0x3b82f6,0xec4899,0xffffff,0xa855f7];
function part(sc,kind,x,y,z){let p=PART.pop();if(!p){p=new THREE.Mesh(PLG,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));p.userData.v=new THREE.Vector3()}
 const bill=kind==='bill';p.material.color.setHex(bill?0x22c55e:PCOL[(Math.random()*PCOL.length)|0]);p.scale.set(bill?.32:.12,bill?.16:.12,1);p.position.set(x,y,z);p.rotation.set(Math.random()*6,Math.random()*6,0);
 const v=p.userData.v;v.set((Math.random()-.5)*(bill?1.5:4),bill?-.5:3+Math.random()*3,(Math.random()-.5)*(bill?1.5:4));p.userData.life=bill?3:2.2;p.userData.g=bill?.6:6;sc.add(p);return p}
function stepParts(list,dt){for(let i=list.length-1;i>=0;i--){const p=list[i],u=p.userData;u.life-=dt;u.v.y-=u.g*dt;if(u.g<1)u.v.y=Math.max(u.v.y,-1.2);p.position.addScaledVector(u.v,dt);p.rotation.x+=dt*5;p.rotation.z+=dt*3;
 if(u.life<=0){if(p.parent)p.parent.remove(p);PART.push(p);list.splice(i,1)}}}

// ---------- lejátszó ----------
function limbsOf(m){const o={};m.traverse(c=>{if(c.userData&&c.userData.limb&&!o[c.userData.limb])o[c.userData.limb]=c});const b=(o.lleg||o.larm);return{l:o,body:b&&b.parent!==m?b.parent:null}}
function reset(st){const L=st.l;['larm','rarm','lleg','rleg'].forEach(k=>{if(L[k])L[k].rotation.set(0,0,0)});if(st.body){st.body.rotation.set(0,0,0);st.body.position.y=0}}
function apply(st,P){const L=st.l,z=[0,0];const s=(o,v)=>{if(o){v=v||z;o.rotation.set(v[0]||0,0,v[1]||0)}};s(L.larm,P.la);s(L.rarm,P.ra);s(L.lleg,P.ll);s(L.rleg,P.rl);
 if(st.body){st.body.rotation.set(P.rx||0,P.ry||0,P.rz||0);st.body.position.y=P.y||0}}
const HANDP={flag:'larm',sign:'rarm',ribbon:null};
function Player(m,sc,def){const st=limbsOf(m);const h={m,sc,def,st,t:0,props:[],parts:[],last:{},done:false};
 def.props.forEach(k=>{const o=take(k);if(MK[k]&&k==='ribbon'){o.position.set(0,1.5,1.4);(st.body||m).add(o)}else{const arm=st.l[HANDP[k]||'rarm'];if(arm){o.position.set(0,-1.02,.08);o.rotation.set(/^(flag|sign|cup)$/.test(k)?PI:0,0,0);arm.add(o)}else m.add(o)}o.visible=true;h.props.push([k,o])});
 h.update=dt=>{if(h.done)return;h.t+=dt;const t=h.t,d=h.def;let P;try{P=d.f(t)||{}}catch(e){P={}}apply(st,P);
  // jelenetek/hangok: [periódus, fázis, kulcs]
  d.ev.forEach((e,i)=>{const per=e[0],ph=e[1];if(t<ph)return;const n=Math.floor((t-ph)/per);if(h.last[i]===n)return;h.last[i]=n;fire(h,e[2])});
  // szalag elvágása
  h.props.forEach(([k,o])=>{if(k==='ribbon'&&t>2){o.children[0].scale.x=Math.max(.01,3*(1-ease(t,2,2.4)))}});
  stepParts(h.parts,dt);if(t>=d.dur)h.stop()};
 h.stop=()=>{if(h.done)return;h.done=true;reset(st);h.props.forEach(([k,o])=>{if(k==='ribbon')o.children[0].scale.x=3;give(k,o)});h.props=[];h.parts.forEach(p=>{if(p.parent)p.parent.remove(p);PART.push(p)});h.parts=[]};
 return h}
const wp=new THREE.Vector3();
function fire(h,k){const m=h.m;m.getWorldPosition(wp);const sc=h.sc;if(!sc)return;
 if(k==='conf'||k==='confD'){const n=k==='conf'?3:14;for(let i=0;i<n;i++)h.parts.push(part(sc,'c',wp.x+(Math.random()-.5),wp.y+3,wp.z+(Math.random()-.5)));if(k==='confD'&&h.parts.length<60){}return}
 if(k==='bill'){const a=h.st.l.rarm;if(a){a.getWorldPosition(wp)}h.parts.push(part(sc,'bill',wp.x,wp.y,wp.z));snd('bill');return}
 if(k==='billRain'){for(let i=0;i<2;i++)h.parts.push(part(sc,'bill',wp.x+(Math.random()-.5)*4,wp.y+5+Math.random(),wp.z+(Math.random()-.5)*4));return}
 if(k==='firew'){snd('firew');for(let i=0;i<20;i++)h.parts.push(part(sc,'c',wp.x,wp.y+5,wp.z));return}
 if(h.parts.length>120)return;snd(k)}

// ---------- aktív emote (meccs / lobby) ----------
let CUR=null,mode=null,camA=0,gunWas=null;
const inLobby=()=>{const lb=$('lb');return !!(lb&&lb.classList.contains('on')&&window.LB3D&&LB3D.me)};
const inMatch=()=>{try{if(window._kp&&_kp.W)return false;return !!(typeof run!=='undefined'&&run&&typeof G!=='undefined'&&G&&G.phase==='play'&&G.pm)}catch(e){return false}};
let lastLT=0;
function play(id){const d=BY[id];if(!d){toast('Nincs ilyen emote: '+id);return false}if(!owned(id)){toast('🔒 Még nincs feloldva: '+d.n);return false}
 if(window._kp&&_kp.W){toast('Köpködős módban nincs emote.');return false}
 stop();ac();
 if(inMatch()){const g=G;try{const fh=window.floorH?floorH(g):0;if((g.y||0)>fh+.6||g.gl){toast('🪂 Emote csak a földön!');return false}}catch(e){}CUR=Player(g.pm,scene,d);mode='match';camA=0;gunWas=g.gun?g.gun.visible:null}
 else if(window.LB3D&&LB3D.me&&LB3D.sc){LB3D.me.userData._x13cDance=true;CUR=Player(LB3D.me,LB3D.sc,d);mode='lobby';lastLT=performance.now()}
 else{toast('Emote csak a lobbyban vagy meccs közben!');return false}
 label(d.ic+' '+d.n);return true}
function stop(){if(!CUR)return;const c=CUR;CUR=null;c.stop();if(mode==='lobby'&&c.m)c.m.userData._x13cDance=false;
 if(mode==='match'){try{if(G&&G.gun&&gunWas!==null)G.gun.visible=gunWas;if(G&&G.fp&&G.pm)G.pm.visible=false}catch(e){}}mode=null;label('')}
// meccs: az update után (anim3d után töltődik be) felülírjuk a pózt és a kamerát
(function hookU(){if(typeof window.update!=='function'){setTimeout(hookU,500);return}const o=window.update;window.update=function(dt){const r=o.apply(this,arguments);
 try{if(CUR&&mode==='match'){if(!inMatch()||G.pm!==CUR.m){stop();return r}const g=G;CUR.update(dt||.016);if(!CUR||CUR.done){stop();return r}
  g.pm.visible=true;if(g.gun)g.gun.visible=false;camA+=(dt||.016)*.35;const ry=g.pm.rotation.y+PI+camA,p=g.pm.position;
  cam.position.set(p.x+S_(ry)*6.5,p.y+2.6,p.z+C_(ry)*6.5);cam.lookAt(p.x,p.y+1.4,p.z)}}catch(e){console.error('emotes update',e);stop()}return r}})();
// lobby: saját RAF (a lobby fx-hurok nem mindig fut) – csak ha a lobby látszik
function lobbyTick(){if(!CUR||mode!=='lobby')return;const now=performance.now(),dt=Math.min(.05,(now-lastLT)/1000);lastLT=now;
 if(!inLobby()||LB3D.me!==CUR.m){stop();return}try{CUR.update(dt);if(CUR&&CUR.done)stop()}catch(e){console.error('emotes lobby',e);stop()}}
// a lobby draw3D-ciklusában (danceStep után, renderelés előtt) fut
let hookedL=null;setInterval(()=>{const L=window.LB3D;if(L&&L.fx&&hookedL!==L){hookedL=L;L.fx.push(()=>{try{lobbyTick()}catch(e){}})}},700);
// mozgás / lövés megszakítja
const MOVE=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft']);
addEventListener('keydown',e=>{if(CUR&&mode==='match'&&MOVE.has(e.code))stop()},true);
addEventListener('mousedown',e=>{if(CUR&&mode==='match'&&!WH.on&&!e.target.closest('#emoPan'))stop()},true);

// ---------- UI ----------
const css=document.createElement('style');css.textContent=`
#emoWh *{box-sizing:border-box;overflow:visible}#emoWh{position:fixed;inset:0;z-index:100050;display:none;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(2,6,23,.35),rgba(2,6,23,.7));font-family:system-ui,sans-serif;user-select:none}
#emoWh.on{display:flex}#emoWh .eR{position:relative;width:440px;height:440px;border-radius:50%;background:rgba(15,23,42,.82);border:3px solid rgba(250,204,21,.5);box-shadow:0 0 40px rgba(0,0,0,.6)}
#emoWh .eS{position:absolute;width:96px;height:96px;margin:-48px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e2e8f0;font-size:11px;font-weight:700;text-align:center;background:rgba(30,41,59,.9);border:2px solid #334155;cursor:pointer;transition:transform .1s}
#emoWh .eS b{font-size:34px;line-height:1.1}#emoWh .eS.eH{background:#facc15;color:#111;border-color:#fff;transform:scale(1.15)}#emoWh .eS.eL{opacity:.4}
#emoWh .eC{position:absolute;left:50%;top:50%;width:130px;height:130px;margin:-65px;border-radius:50%;background:#0f172a;border:2px solid #475569;color:#fde68a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:12px;text-align:center;cursor:pointer}
#emoWh .eC:hover{border-color:#facc15}#emoWh .eC i{font-style:normal;font-size:10px;color:#94a3b8;margin-top:4px}
#emoLbl{position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:9000;background:rgba(15,23,42,.8);color:#fde68a;padding:6px 14px;border-radius:12px;font:700 15px system-ui;display:none;pointer-events:none}
#emoToast{position:fixed;left:50%;top:90px;transform:translateX(-50%);z-index:100060;background:#0f172a;color:#fff;border:1px solid #facc15;padding:8px 16px;border-radius:10px;font:600 14px system-ui;display:none}
#emoPan{position:fixed;inset:0;z-index:100055;display:none;background:rgba(2,6,23,.78);font-family:system-ui,sans-serif;color:#e2e8f0}
#emoPan.on{display:flex;align-items:center;justify-content:center}#emoPan .w{width:min(1100px,96vw);height:min(680px,92vh);background:#0f172a;border:2px solid #334155;border-radius:18px;display:flex;flex-direction:column;overflow:hidden}
#emoPan .hd{display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid #1e293b;flex-wrap:wrap}#emoPan h2{margin:0 10px 0 0;font-size:20px;color:#facc15}
#emoPan input{flex:1;min-width:140px;padding:7px 10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff}
#emoPan .bt{padding:6px 10px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;cursor:pointer;font-weight:700;font-size:13px}#emoPan .bt.on{background:#facc15;color:#111}
#emoPan .bd{flex:1;display:flex;min-height:0}#emoPan .gr{flex:1;overflow:auto;padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px;align-content:start}
#emoPan .cd{background:#1e293b;border:2px solid #334155;border-radius:12px;padding:8px 4px;text-align:center;cursor:pointer;font-size:12px;position:relative}#emoPan .cd b{display:block;font-size:30px}
#emoPan .cd.sel{border-color:#facc15}#emoPan .cd.lk{opacity:.55}#emoPan .cd small{display:block;color:#94a3b8;margin-top:2px}#emoPan .cd .fv{position:absolute;right:5px;top:3px;color:#facc15}
#emoPan .pv{width:300px;border-left:1px solid #1e293b;padding:10px;display:flex;flex-direction:column;gap:8px;align-items:stretch;overflow:auto}#emoPan canvas{width:280px;height:260px;border-radius:12px;background:#1e1b4b}
#emoPan .sl{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}#emoPan .sl .es{padding:6px 2px;font-size:15px;text-align:center;border-radius:8px;border:1px solid #334155;background:#1e293b;cursor:pointer;font-weight:700}#emoPan .sl .es.on{background:#facc15;color:#111}
@media(max-width:760px){#emoPan .bd{flex-direction:column}#emoPan .pv{width:auto;border-left:0;border-top:1px solid #1e293b}#emoPan canvas{width:100%;height:180px}#emoWh .eR{transform:scale(.75)}}`;
document.head.appendChild(css);
const WHD=document.createElement('div');WHD.id='emoWh';document.body.appendChild(WHD);
const LBL=document.createElement('div');LBL.id='emoLbl';document.body.appendChild(LBL);
const TST=document.createElement('div');TST.id='emoToast';document.body.appendChild(TST);
let tT=0;function toast(s){TST.textContent=s;TST.style.display='block';clearTimeout(tT);tT=setTimeout(()=>TST.style.display='none',2200)}
function label(s){LBL.textContent=s;LBL.style.display=s?'block':'none'}
const WH={on:false,sel:-1,vx:0,vy:0};
function wheelHTML(){let h='<div class="eR">';SV.fav.forEach((id,i)=>{const e=BY[id],a=-PI/2+i*PI/4,x=220+C_(a)*160,y=220+S_(a)*160;
  h+='<div class="eS'+(e&&!owned(id)?' eL':'')+'" data-i="'+i+'" style="left:'+x+'px;top:'+y+'px"><b>'+(e?e.ic:'➕')+'</b>'+(i+1)+'. '+(e?e.n:'Üres')+'</div>'});
 h+='<div class="eC" data-all="1"><b style="font-size:26px">📚</b>Összes emote<i>[0] vagy kattintás<br>engedd el a választáshoz</i></div></div>';WHD.innerHTML=h;
 WHD.querySelectorAll('.eS').forEach(s=>{s.onmouseenter=()=>hi(+s.dataset.i);s.onclick=()=>{hi(+s.dataset.i);closeWheel(true)}});WHD.querySelector('.eC').onclick=()=>{closeWheel(false);openPan()}}
function hi(i){WH.sel=i;WHD.querySelectorAll('.eS').forEach(s=>s.classList.toggle('eH',+s.dataset.i===i))}
function canWheel(){return inMatch()||inLobby()}
function openWheel(){if(WH.on)return;if(!canWheel()){return}WH.on=true;WH.sel=-1;WH.vx=WH.vy=0;wheelHTML();WHD.classList.add('on')}
function closeWheel(go){if(!WH.on)return;WH.on=false;WHD.classList.remove('on');if(go&&WH.sel>=0){const id=SV.fav[WH.sel];if(id)play(id)}}
WHD.addEventListener('mousemove',e=>{if(document.pointerLockElement)return;const r=WHD.querySelector('.eR');if(!r)return;const b=r.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2);if(Math.hypot(dx,dy)<70*(b.width/440)){hi(-1);return}hi(dir(dx,dy))});
const dir=(dx,dy)=>((Math.round((Math.atan2(dy,dx)+PI/2)/(PI/4))%8)+8)%8;
addEventListener('mousemove',e=>{if(!WH.on||!document.pointerLockElement)return;WH.vx+=e.movementX;WH.vy+=e.movementY;const l=Math.hypot(WH.vx,WH.vy);if(l>140){WH.vx*=140/l;WH.vy*=140/l}if(l>30)hi(dir(WH.vx,WH.vy))},true);
const isKey=e=>e.code==='BracketLeft'||e.key==='ő'||e.key==='Ő';
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable)};
addEventListener('keydown',e=>{if(typing(e))return;if(isKey(e)){e.preventDefault();if(!e.repeat)openWheel();return}
 if(WH.on){if(/^Digit[1-8]$/.test(e.code)){hi(+e.code.slice(5)-1);closeWheel(true);e.preventDefault();e.stopPropagation()}else if(e.code==='Digit0'){closeWheel(false);openPan();e.preventDefault();e.stopPropagation()}else if(e.code==='Escape'){closeWheel(false)}}
 else if(PAN.on&&e.code==='Escape'){closePan();e.stopPropagation()}},true);
addEventListener('keyup',e=>{if(isKey(e)&&WH.on)closeWheel(true)},true);
addEventListener('blur',()=>{if(WH.on)closeWheel(false)});

// ---------- gyűjtemény-panel ----------
const PAN={on:false,cat:'all',q:'',sel:'integet'};const PD=document.createElement('div');PD.id='emoPan';document.body.appendChild(PD);
let PR=null;// előnézet: {rn,sc,cm,m,h,raf}
function openPan(){if(document.pointerLockElement)try{document.exitPointerLock()}catch(e){}PAN.on=true;PD.classList.add('on');renderPan();startPrev()}
function closePan(){PAN.on=false;PD.classList.remove('on');if(PR){cancelAnimationFrame(PR.raf);if(PR.h)PR.h.stop();PR.h=null}}
function list(){const q=PAN.q.trim().toLowerCase();return E.filter(e=>(PAN.cat==='all'||e.c===PAN.cat)&&(!q||(e.n+' '+e.id+' '+e.c).toLowerCase().includes(q)))}
function priceTxt(e){if(owned(e.id))return'✔ Megvan';if(e.lv&&!e.pr)return'🔒 '+e.lv+'. szint';return(e.lv?'🔒'+e.lv+'. szint · ':'')+fmt(e.pr)}
function renderPan(){const n=E.filter(e=>owned(e.id)).length;
 PD.innerHTML='<div class="w"><div class="hd"><h2>💃 EMOTE-OK <small style="color:#94a3b8;font-size:13px">'+n+'/'+E.length+'</small></h2>'+CATS.map(c=>'<button class="bt'+(PAN.cat===c[0]?' on':'')+'" data-c="'+c[0]+'">'+c[1]+'</button>').join('')+
 '<input id="emoQ" placeholder="🔎 Keresés…" value="'+PAN.q.replace(/"/g,'')+'"><span style="color:#facc15;font-weight:700">'+fmt(money())+'</span><button class="bt" data-x="1">✖</button></div><div class="bd"><div class="gr" id="emoGr"></div><div class="pv" id="emoPv"></div></div></div>';
 PD.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{PAN.cat=b.dataset.c;renderPan();startPrev()});PD.querySelector('[data-x]').onclick=closePan;
 const qi=$('emoQ');qi.addEventListener('keydown',e=>e.stopPropagation());qi.addEventListener('keyup',e=>e.stopPropagation());qi.oninput=()=>{PAN.q=qi.value;grid()};grid();side()}
function grid(){const g=$('emoGr');if(!g)return;const L=list();g.innerHTML=L.length?L.map(e=>'<div class="cd'+(owned(e.id)?'':' lk')+(PAN.sel===e.id?' sel':'')+'" data-id="'+e.id+'">'+(SV.fav.includes(e.id)?'<span class="fv">★'+(SV.fav.indexOf(e.id)+1)+'</span>':'')+'<b>'+e.ic+'</b>'+e.n+'<small>'+priceTxt(e)+'</small></div>').join(''):'<div style="opacity:.6">Nincs találat.</div>';
 g.querySelectorAll('.cd').forEach(c=>c.onclick=()=>{PAN.sel=c.dataset.id;grid();side();prevPlay()})}
function side(){const p=$('emoPv');if(!p)return;const e=BY[PAN.sel]||E[0];const ow=owned(e.id),cn=CATS.find(c=>c[0]===e.c);
 p.innerHTML='<div id="emoCv"></div><div style="font-size:18px;font-weight:800">'+e.ic+' '+e.n+'</div><div style="color:#94a3b8;font-size:12px">'+(cn?cn[1]:'')+' · '+e.dur+' mp'+(e.props.length?' · kellékkel':'')+'</div>'+
 (ow?'<button class="bt" id="emoPl" style="background:#16a34a">▶ ELŐADÁS ('+(inMatch()?'meccs':'lobby')+')</button>':'<button class="bt" id="emoBuy" style="background:#ca8a04;color:#111">🔓 FELOLDÁS · '+priceTxt(e)+'</button>')+
 '<div style="font-size:12px;color:#cbd5e1">Kedvenc hely a kerékben (Ő/[ nyomva tartva):</div><div class="sl">'+SV.fav.map((id,i)=>'<div class="es'+(id===e.id?' on':'')+'" data-s="'+i+'" title="'+(BY[id]?BY[id].n:'')+'">'+(i+1)+' '+(BY[id]?BY[id].ic:'·')+'</div>').join('')+'</div>'+
 '<div style="font-size:11px;color:#64748b">Alapból '+FREE.length+' ingyenes emote. Meccsben mozgás vagy lövés megszakítja.</div>';
 if(PR&&PR.cv)$('emoCv').appendChild(PR.cv);
 const pl=$('emoPl');if(pl)pl.onclick=()=>{const id=e.id;closePan();setTimeout(()=>play(id),60)};
 const by=$('emoBuy');if(by)by.onclick=()=>{if(buy(e.id)){renderPan();startPrev()}};
 p.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{if(!ow){toast('Előbb oldd fel!');return}const i=+b.dataset.s,j=SV.fav.indexOf(e.id);if(j>=0)SV.fav[j]=SV.fav[i];SV.fav[i]=e.id;save();grid();side()})}
function startPrev(){try{if(!PR){const cv=document.createElement('canvas');cv.width=560;cv.height=520;const rn=new THREE.WebGLRenderer({canvas:cv,antialias:true});
  const sc=new THREE.Scene();sc.background=new THREE.Color(0x1e1b4b);sc.add(new THREE.HemisphereLight(0xffffff,0x334155,1.1));const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(3,6,4);sc.add(dl);
  const fl=new THREE.Mesh(new THREE.CircleGeometry(3,32),new THREE.MeshStandardMaterial({color:0x312e81}));fl.rotation.x=-PI/2;sc.add(fl);
  const cm=new THREE.PerspectiveCamera(42,560/520,.1,100);cm.position.set(0,2.3,7.2);cm.lookAt(0,1.4,0);let m;try{m=person(0xfacc15,'',1)}catch(e){m=new THREE.Group()}sc.add(m);PR={cv,rn,sc,cm,m,h:null,raf:0,lt:0}}
 const c=$('emoCv');if(c&&PR.cv.parentNode!==c)c.appendChild(PR.cv);prevPlay();cancelAnimationFrame(PR.raf);PR.lt=performance.now();
 (function f(){if(!PAN.on)return;PR.raf=requestAnimationFrame(f);const n=performance.now(),dt=Math.min(.05,(n-PR.lt)/1000);PR.lt=n;if(PR.h){PR.h.update(dt);if(PR.h.done)prevPlay()}PR.rn.render(PR.sc,PR.cm)})()}catch(e){console.error('emote előnézet',e)}}
function prevPlay(){if(!PR)return;if(PR.h)PR.h.stop();const e=BY[PAN.sel]||E[0];PR.h=Player(PR.m,PR.sc,e)}

// ---------- lobby2 menüpont + debug ----------
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}_lb2.add({ic:'💃',hu:'Emote-ok',tx:'Emote-ok',c:'cust',fn:openPan,kw:'emote tanc gesztus kerek mozdulat'})})();
window._emo={play,stop,open:openPan,close:closePan,wheel:openWheel,closeWheel,get list(){return E.map(e=>e.id)},defs:E,save:SV,owned,buy,get cur(){return CUR?{id:CUR.def.id,mode,t:CUR.t}:null}};
})();
