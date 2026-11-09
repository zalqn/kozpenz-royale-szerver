// lobbyE.js – LOBBY, KINÉZET, KÉNYELEM (E): panelek új stílusban, napszakos lobby-háttér, karakter-előnézet,
// profiloldal, rang-belépő animáció, valódi %-os betöltés, mobil finomítás, kontroller a menükben, angol nyelv,
// billentyű-profilok, súgó+GYIK, PWA. Mentés: k3E* kulcsok. Debug: _kE
(function(){
'use strict';
const $=id=>document.getElementById(id);
const LS={g:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fm=n=>Math.round(n||0).toLocaleString('hu-HU')+' Ft';
const toast=m=>{try{if(window.say)return say(m)}catch(e){}const t=document.createElement('div');t.className='kEtoast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2600)};
const inLobby=()=>{const lb=$('lb');if(!lb||!lb.classList.contains('on'))return false;const vs=$('vs2');return !(vs&&vs.classList.contains('on'))};
const inMatch=()=>{try{return !!(run&&G)}catch(e){return false}};
const SET=LS.g('k3ESet',{lang:'hu',bg:1,ent:1,load:1,gp:1});const saveSet=()=>LS.s('k3ESet',SET);

// ================= CSS =================
const css=document.createElement('style');css.id='kEcss';
css.textContent=`
:root{--kEbg1:#111a33f2;--kEbg2:#0b1022f2;--kEbd:#ffffff24;--kEy:#fde047}
.kEtoast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:99999;background:#0b1022ee;color:#fff;padding:10px 18px;border-radius:12px;border:1px solid #facc15;font:700 15px Rajdhani,Arial}
/* 31: régi panelek egységes lobby2-stílusban */
body.lb2on #lbNews{border-radius:18px!important;border:1px solid var(--kEbd)!important;box-shadow:0 20px 50px #000a,inset 0 1px 0 #ffffff1a!important}
body.lb2on #lbNews::after{content:var(--kEnews,"📰 HÍREK");position:absolute;top:10px;left:12px;font:13px 'Luckiest Guy',Impact;letter-spacing:.5px;color:#1a1300;background:linear-gradient(180deg,#fde047,#facc15);padding:3px 9px;border-radius:8px;z-index:2}
body.lb2on #lbNews h3{font-family:'Luckiest Guy',Impact!important;letter-spacing:.5px}
body.lb2on #lbPlay{background:linear-gradient(180deg,var(--kEbg1),var(--kEbg2))!important;border:1px solid var(--kEbd)!important;border-radius:18px!important;box-shadow:0 20px 50px #000a,inset 0 1px 0 #ffffff1a!important}
body.lb2on #lbPlay h2{color:var(--kEy)!important;letter-spacing:.5px;font-size:26px!important}

body.lb2on #lbChar{background:linear-gradient(180deg,#1e293b,#172033)!important;border:1px solid #ffffff1a;border-radius:12px!important}
body.lb2on #lbChar button{background:#ffffff14!important;border-radius:10px!important;transition:background .15s}
body.lb2on #lbChar button:hover{background:#facc15!important;color:#1a1300!important}
body.lb2on #lbGo{border-radius:14px!important;background:linear-gradient(180deg,#fde047,#facc15)!important;color:#1a1300!important;box-shadow:0 6px 18px #facc1555,inset 0 -4px 0 #0002!important;font-family:'Luckiest Guy',Impact!important;letter-spacing:1px}
body.lb2on #lbGo:hover{filter:brightness(1.08);transform:translateY(-1px)}
body.lb2on #lbPlayer{background:linear-gradient(180deg,var(--kEbg1),var(--kEbg2))!important;border:1px solid var(--kEbd)!important;border-radius:18px!important;box-shadow:0 20px 50px #000a,inset 0 1px 0 #ffffff1a!important}
body.lb2on #lbPlayer button{border-radius:10px!important}
body.lb2on #lbSide .lbBadge .ring{background:linear-gradient(180deg,#1e293b,#0b1022)!important;border:2px solid #facc15aa!important;box-shadow:0 10px 30px #0008,inset 0 1px 0 #ffffff22!important}
body.lb2on #lbSide .lbBadge:hover .ring{border-color:#fde047!important;transform:translateY(-2px)}
body.lb2on #lbSide .lbBadge .ring small{font-family:'Luckiest Guy',Impact;color:var(--kEy)}
/* közös ablak */
#kEm{position:fixed;inset:0;z-index:9990;display:none;align-items:center;justify-content:center;background:#020617b0;backdrop-filter:blur(4px)}
#kEm.on{display:flex}
#kEm .w{width:min(900px,calc(100vw - 32px));max-height:calc(100vh - 40px);display:flex;flex-direction:column;border-radius:18px;background:linear-gradient(180deg,var(--kEbg1),var(--kEbg2));border:1px solid var(--kEbd);box-shadow:0 30px 80px #000c;color:#e2e8f0;font:600 15px Rajdhani,Arial,sans-serif;overflow:hidden}
#kEm .hd{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid #ffffff14}
#kEm .hd h2{margin:0;flex:1;font:22px 'Luckiest Guy',Impact;letter-spacing:.5px;color:var(--kEy)!important;font-weight:normal;text-shadow:0 2px 0 #0008}
#kEm .bd{padding:14px 16px;overflow:auto}
#kEm button.kb{all:unset;cursor:pointer;padding:8px 13px;border-radius:11px;background:linear-gradient(180deg,#1e293b,#172033);border:1px solid #ffffff1a;color:#f1f5f9;font:15px 'Luckiest Guy',Impact;letter-spacing:.4px;transition:transform .12s,border-color .12s}
#kEm button.kb:hover,#kEm button.kb:focus{border-color:#facc15;transform:translateY(-1px)}
#kEm button.kb.y{background:linear-gradient(180deg,#fde047,#facc15);color:#1a1300}
#kEm button.x{background:#ef4444;color:#fff}
#kEm .tabs{display:flex;gap:6px;flex-wrap:wrap;padding:8px 16px 0}
#kEm .card{background:linear-gradient(180deg,#1e293b,#172033);border:1px solid #ffffff1a;border-radius:14px;padding:12px}
#kEm .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
#kEm .stat b{display:block;font:24px 'Luckiest Guy',Impact;color:#fff;font-weight:normal}#kEm .stat small{color:#94a3b8}
#kEm input[type=text],#kEm input[type=search],#kEm select{background:#0b1022;border:1px solid #ffffff2a;color:#f1f5f9;border-radius:10px;padding:8px 10px;font:600 15px Rajdhani,Arial}
#kEm .row{display:flex;align-items:center;gap:10px;margin:8px 0;flex-wrap:wrap}
#kEm .w{text-align:left}#kEm .row>span:first-child{min-width:200px;flex:1}
#kEm details{background:#0b1022;border:1px solid #ffffff14;border-radius:12px;margin:6px 0;padding:8px 12px}
#kEm details summary{cursor:pointer;font-weight:800;color:#f8fafc}
#kEm details p{margin:6px 0 2px;color:#cbd5e1}
#kEm mark{background:#facc15;color:#1a1300;border-radius:3px}
/* 38: kontroller fókusz */
.kEfoc{outline:3px solid #facc15!important;outline-offset:2px!important;box-shadow:0 0 0 6px #facc1544!important}
/* 36: betöltő */
#kELoad{position:fixed;inset:0;z-index:99990;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e2e8f0;font:700 15px Rajdhani,Arial;
 background:radial-gradient(circle at 50% 40%,#1e3a8a 0%,#0b1022 55%,#020617 100%);transition:opacity .35s}
#kELoad h1{margin:0;font:clamp(36px,5vw,72px) 'Luckiest Guy',Impact;color:#fde047;text-shadow:0 5px 0 #000,0 0 40px #facc1566;letter-spacing:2px;font-weight:normal}
#kELoad .bar{width:min(560px,80vw);height:16px;margin-top:22px;border-radius:10px;background:#0f172a;border:1px solid #ffffff2a;overflow:hidden}
#kELoad .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#22c55e,#fde047,#f97316);transition:width .15s}
#kELoad .pc{margin-top:8px;font:800 20px monospace;color:#fbbf24}
#kELoad .st{color:#94a3b8;font-size:13px;min-height:18px}
#kELoad button{width:auto!important;padding:12px 30px!important;display:inline-block}
#kELoad .tip{margin-top:18px;max-width:600px;text-align:center;color:#cbd5e1;min-height:42px;padding:0 16px}
#kELoad .coin{position:absolute;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff7b0,#facc15 50%,#b45309);color:#7c2d12;display:flex;align-items:center;justify-content:center;font:900 14px Arial;cursor:pointer;animation:kEcoin 1.3s ease-out forwards;box-shadow:0 0 18px #facc1588}
@keyframes kEcoin{0%{transform:scale(0)}20%{transform:scale(1.15)}100%{transform:scale(.9) translateY(-30px);opacity:0}}
/* 37: mobil */
#kEstick{position:fixed;z-index:44;width:130px;height:130px;margin:-65px 0 0 -65px;border-radius:50%;border:2px solid #ffffff55;background:#0f172a55;pointer-events:none;display:none}
#kEstick i{position:absolute;left:50%;top:50%;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:#facc15aa;box-shadow:0 0 14px #facc1588}
/* 33: előnézet */
#kEpv{width:100%;height:min(56vh,460px);border-radius:14px;background:radial-gradient(circle at 50% 40%,#25407a,#0b1022);cursor:grab;touch-action:none;display:block}
@media (max-height:800px){#kEm .bd{padding:10px 14px}#kEpv{height:46vh}}
`;
document.head.appendChild(css);

// ================= közös ablak =================
const M=document.createElement('div');M.id='kEm';M.innerHTML='<div class="w"><div class="hd"><h2></h2><button class="kb x" id="kEx">✕</button></div><div class="tabs"></div><div class="bd"></div></div>';document.body.appendChild(M);
let onClose=null;
function openM(title,html,tabs,close){M.querySelector('h2').textContent=title;M.querySelector('.bd').innerHTML=html;const tb=M.querySelector('.tabs');tb.innerHTML='';tb.style.display=tabs?'flex':'none';if(tabs)tabs.forEach(([n,fn,on])=>{const b=document.createElement('button');b.className='kb'+(on?' y':'');b.textContent=n;b.onclick=fn;tb.appendChild(b)});
 if(onClose&&onClose!==close){const f=onClose;onClose=null;try{f()}catch(e){}}onClose=close||null;M.classList.add('on');tr()}
function closeM(){M.classList.remove('on');if(onClose){const f=onClose;onClose=null;try{f()}catch(e){}}}
$('kEx').onclick=closeM;M.addEventListener('click',e=>{if(e.target===M)closeM()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&M.classList.contains('on')){e.stopImmediatePropagation();closeM()}},true);
['keydown','keyup','keypress'].forEach(t=>M.addEventListener(t,e=>{if(e.target.tagName==='INPUT')e.stopPropagation()}));

// ================= 32: animált lobby-háttér napszakkal =================
const SKY=[[0,'#020617','#0b1a3f','#16264d'],[5,'#1e1b4b','#7c3aed','#f97316'],[7,'#38bdf8','#7dd3fc','#fde68a'],[12,'#1d74d8','#60a5fa','#bfdbfe'],[17,'#1e3a8a','#f97316','#fbbf24'],[19,'#312e81','#be185d','#fb923c'],[21,'#040b24','#123a7a','#1a2f55'],[24,'#020617','#0b1a3f','#16264d']];
const hx=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t)),rgb=a=>'rgb('+a.join(',')+')';
function skyAt(h){for(let i=0;i<SKY.length-1;i++){const a=SKY[i],b=SKY[i+1];if(h>=a[0]&&h<b[0]){const t=(h-a[0])/(b[0]-a[0]);return [1,2,3].map(j=>mix(hx(a[j]),hx(b[j]),t))}}return [1,2,3].map(j=>hx(SKY[0][j]))}
const hourNow=()=>{const f=LS.g('k3EHour',null);if(typeof f==='number')return f;const d=new Date();return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600};
const BG={cv:null,tex:null,orig:null,fog:null,clouds:[],stars:[],last:0};
for(let i=0;i<6;i++)BG.clouds.push({x:Math.random(),y:.12+Math.random()*.3,w:.12+Math.random()*.16,v:.004+Math.random()*.008});
for(let i=0;i<110;i++)BG.stars.push({x:Math.random(),y:Math.random()*.6,r:Math.random()*1.4+.3,p:Math.random()*6});
function bgStep(t){const L=window.LB3D;if(!L||!L.sc)return;
 if(!SET.bg){if(BG.orig&&L.sc.background===BG.tex){L.sc.background=BG.orig;if(BG.fog&&L.sc.fog)L.sc.fog.color.copy(BG.fog)}return}
 if(!BG.cv){BG.cv=document.createElement('canvas');BG.cv.width=512;BG.cv.height=256;BG.tex=new THREE.CanvasTexture(BG.cv);BG.orig=L.sc.background;BG.fog=L.sc.fog?L.sc.fog.color.clone():null}
 if(L.sc.background!==BG.tex)L.sc.background=BG.tex;
 const n=performance.now();if(n-BG.last<120)return;BG.last=n;
 const h=hourNow(),[top,mid,bot]=skyAt(h),x=BG.cv.getContext('2d'),W=512,H=256,s=n/1000;
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,rgb(top));g.addColorStop(.6,rgb(mid));g.addColorStop(1,rgb(bot));x.fillStyle=g;x.fillRect(0,0,W,H);
 const night=h<5.5||h>20.5?1:h<7?(7-h)/1.5:h>19?(h-19)/1.5:0;
 if(night>0){BG.stars.forEach(st=>{x.globalAlpha=night*(.5+.5*Math.sin(s*2+st.p));x.fillStyle='#fff';x.fillRect(st.x*W,st.y*H,st.r,st.r)});x.globalAlpha=1}
 // nap / hold íve
 const day=h>=6&&h<=20,ph=day?(h-6)/14:((h+24-20)%24)/10,ax=W*(.1+.8*ph),ay=H*(.62-Math.sin(ph*Math.PI)*.5);
 const rg=x.createRadialGradient(ax,ay,2,ax,ay,day?46:30);rg.addColorStop(0,day?'#fffbe6':'#f1f5f9');rg.addColorStop(.25,day?'#fde047cc':'#e2e8f0aa');rg.addColorStop(1,'#0000');x.fillStyle=rg;x.beginPath();x.arc(ax,ay,day?46:30,0,7);x.fill();
 if(!day){x.fillStyle=rgb(top);x.beginPath();x.arc(ax+6,ay-3,9,0,7);x.fill()}
 // felhők
 BG.clouds.forEach(c=>{c.x=(c.x+c.v*.12)%1.3;const cx=(c.x-.15)*W,cy=c.y*H,w=c.w*W;x.fillStyle=night>.5?'rgba(148,163,184,.18)':'rgba(255,255,255,'+(.35+.25*(1-night))+')';
  for(let k=0;k<5;k++){x.beginPath();x.ellipse(cx+k*w/5,cy+Math.sin(k*1.7)*5,w/4,w/9,0,0,7);x.fill()}});
 BG.tex.needsUpdate=true;
 if(L.sc.fog){L.sc.fog.color.setRGB(bot[0]/255*.7,bot[1]/255*.7,bot[2]/255*.75)}
}

// ================= 35: rang szerinti belépő animáció =================
const ENT=[
 {n:'Tag',c:[0x94a3b8],k:'drop'},{n:'VIP',c:[0x22c55e,0xbbf7d0],k:'spark'},{n:'VIP+',c:[0x06b6d4,0xa5f3fc],k:'spiral'},
 {n:'Elit',c:[0x3b82f6,0xbfdbfe],k:'beam'},{n:'Legenda',c:[0xf97316,0xfde047,0xef4444],k:'fire'},
 {n:'Mester',c:[0xf97316,0xfde047,0xef4444,0xeab308],k:'fire2'},{n:'Örökös',c:[0xef4444,0xf97316,0xfde047,0x22c55e,0x3b82f6,0xd946ef],k:'rainbow'}];
let dotTex=null;
function dot(){if(dotTex)return dotTex;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.3,'#ffffffcc');g.addColorStop(1,'#fff0');x.fillStyle=g;x.fillRect(0,0,64,64);return dotTex=new THREE.CanvasTexture(c)}
const EA={on:false};
function rankIdx(){try{return Math.max(0,Math.min(6,window._rang?_rang.D.r|0:0))}catch(e){return 0}}
function entrance(force){const L=window.LB3D;if(!L||!L.me||!L.sc||(!SET.ent&&!force))return;if(EA.on)endEnt();
 const r=rankIdx(),E=ENT[r],ps=[],N=[24,40,50,60,90,130,140][r];
 for(let i=0;i<N;i++){const m=new THREE.SpriteMaterial({map:dot(),color:E.c[i%E.c.length],transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0});const s=new THREE.Sprite(m);s.scale.setScalar(.35);L.sc.add(s);ps.push({s,a:Math.random()*6.283,r:.4+Math.random()*1.3,y:Math.random()*3,v:1+Math.random()*2,d:Math.random()})}
 let beam=null;if(r>=3){const g=new THREE.CylinderGeometry(r>=5?1.3:.9,r>=5?1.6:1.1,14,24,1,true),m=new THREE.MeshBasicMaterial({color:E.c[0],transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide});beam=new THREE.Mesh(g,m);L.sc.add(beam)}
 let crown=null;if(r===5){const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.font='100px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('👑',64,70);crown=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false,opacity:0}));crown.scale.setScalar(1.1);L.sc.add(crown)}
 Object.assign(EA,{on:true,t0:L.t,r,E,ps,beam,crown,me:L.me,dur:r>=5?3.4:2.6});
 const lab=document.createElement('div');lab.id='kEentL';lab.style.cssText='position:fixed;left:50%;top:22%;transform:translateX(-50%);z-index:8;pointer-events:none;font:clamp(20px,2vw,34px) "Luckiest Guy",Impact;letter-spacing:1px;text-shadow:0 3px 0 #000,0 0 24px currentColor;transition:opacity .6s;opacity:0';
 let rc='#94a3b8';try{rc=_rang.R[r][2]}catch(e){}lab.style.color=rc;lab.textContent=(['🙂','⭐','🌟','💠','🔥','👑','🌌'][r])+' '+E.n.toUpperCase()+' ÉRKEZIK!';document.body.appendChild(lab);requestAnimationFrame(()=>lab.style.opacity=r?1:0);EA.lab=lab}
function endEnt(){const L=window.LB3D;if(!EA.on)return;EA.on=false;EA.ps.forEach(p=>{L.sc.remove(p.s);p.s.material.dispose()});if(EA.beam){L.sc.remove(EA.beam);EA.beam.geometry.dispose()}if(EA.crown)L.sc.remove(EA.crown);if(EA.me){EA.me.scale.setScalar(1);EA.me.position.y=.3}if(EA.lab){const l=EA.lab;l.style.opacity=0;setTimeout(()=>l.remove(),700)}}
function entStep(){if(!EA.on)return;const L=window.LB3D;if(!L||L.me!==EA.me){endEnt();return}const t=L.t-EA.t0,u=Math.min(1,t/EA.dur),me=EA.me,k=EA.E.k,r=EA.r,cx=me.position.x,cz=me.position.z;
 // avatar érkezése
 const a=Math.min(1,t/1.1),eo=1-Math.pow(1-a,3);
 if(k==='drop'||k==='spark'||k==='fire'){me.position.y=.3+(1-eo)*9;me.scale.setScalar(1)}
 else if(k==='spiral'||k==='rainbow'){me.scale.setScalar(Math.max(.01,eo));me.rotation.y+=(1-a)*.5;me.position.y=.3}
 else {me.scale.setScalar(Math.max(.01,eo));me.position.y=.3+(1-eo)*2}
 if(k==='fire2'){me.position.y=.3+(1-eo)*6}
 EA.ps.forEach((p,i)=>{const o=p.s.material;let x,y,z;
  if(k.startsWith('fire')){p.y=(p.y+p.v*.03)%3.2;const rr=p.r*(1-p.y/4);x=cx+Math.cos(p.a+t*2)*rr;z=cz+Math.sin(p.a+t*2)*rr;y=.2+p.y;o.opacity=(1-p.y/3.2)*(1-u*.8);p.s.scale.setScalar(.25+(1-p.y/3.2)*.5)}
  else if(k==='spiral'||k==='rainbow'){const aa=p.a+t*4+i*.1;const rr=(1.6-u)*p.r;x=cx+Math.cos(aa)*rr;z=cz+Math.sin(aa)*rr;y=.2+((p.y+t*1.5)%3);o.opacity=(1-u)*.9}
  else if(k==='beam'){x=cx+Math.cos(p.a)*p.r*.7;z=cz+Math.sin(p.a)*p.r*.7;y=((p.y+t*4)%6);o.opacity=(1-u)*.8}
  else {const aa=p.a;const rr=Math.min(1,t*1.5)*p.r*(k==='drop'?1.6:1.2);x=cx+Math.cos(aa)*rr;z=cz+Math.sin(aa)*rr;y=k==='drop'?.25+p.d*.3:.4+p.y*.7+Math.sin(t*5+i)*.1;o.opacity=t<1?0:(1-u)*(k==='drop'?.5:.9)}
  p.s.position.set(x,y,z)});
 if(EA.beam){EA.beam.position.set(cx,7,cz);EA.beam.material.opacity=Math.sin(u*Math.PI)*.35;EA.beam.rotation.y=t}
 if(EA.crown){EA.crown.position.set(cx,3.4+Math.sin(t*3)*.1,cz);EA.crown.material.opacity=Math.min(1,Math.max(0,t-1))*(1-Math.max(0,u-.8)*5)}
 if(u>=1)endEnt()}

// lobby belépés figyelése + per-frame hook
let wasL=false,hooked=null;
setInterval(()=>{const L=window.LB3D,on=inLobby();if(L&&L.fx&&hooked!==L){hooked=L;L.fx.push(()=>{try{bgStep()}catch(e){}try{entStep()}catch(e){}})}
 if(on&&!wasL)setTimeout(()=>entrance(),450);wasL=on},400);

// ================= 33: karakter-előnézet =================
let PV=null;
function curLook(){const B=window.BR,COS=window.BRCOS||[],sk=B&&B.eq&&COS.find(c=>c.id===B.eq.skin);let ch=null;try{ch=S.ch||CH[0]}catch(e){}const col=sk&&sk.id!=='s_def'?sk.c:(ch?ch.c:0xffd23f),em=sk&&sk.id!=='s_def'?sk.e:(ch?ch.e:'😎');return {col,em,n:sk&&sk.id!=='s_def'?sk.n:(ch&&ch.n)||''}}
function openPreview(){if(typeof THREE==='undefined'||typeof person!=='function'){toast('Az előnézet most nem elérhető.');return}
 openM(T('🧍 KARAKTER-ELŐNÉZET'),'<canvas id="kEpv"></canvas><div class="row" style="justify-content:center"><button class="kb" id="kEpL">⟲</button><button class="kb" id="kEpZo">－</button><button class="kb y" id="kEpA">⏯ '+T('FORGÁS')+'</button><button class="kb" id="kEpZi">＋</button><button class="kb" id="kEpR">⟳</button><button class="kb" id="kEpP">'+T('PÓZ')+'</button><button class="kb" id="kEpRe">'+T('ALAPHELYZET')+'</button></div><div style="text-align:center;color:#94a3b8;font-size:13px" id="kEpN"></div><div style="text-align:center;color:#94a3b8;font-size:13px">'+T('Húzd az egérrel/ujjal a forgatáshoz · görgő/csippentés = nagyítás')+'</div>',null,()=>{if(PV){PV.stop=true;try{PV.r.dispose()}catch(e){}PV=null}});
 const cv=$('kEpv'),r=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});r.setPixelRatio(Math.min(2,devicePixelRatio));const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);
 sc.add(new THREE.HemisphereLight(0xffffff,0x334466,1.05));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(3,6,5);sc.add(dl);const dl2=new THREE.DirectionalLight(0x88aaff,.45);dl2.position.set(-4,3,-4);sc.add(dl2);
 const fl=new THREE.Mesh(new THREE.CircleGeometry(1.6,40),new THREE.MeshBasicMaterial({color:0xfacc15,transparent:true,opacity:.25}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 const lk=curLook();let m;try{m=person(lk.col,lk.em,1.05)}catch(e){m=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial({color:lk.col}))}
 m.children.forEach(ch=>{if(ch.isSprite){ch.scale.multiplyScalar(.38);ch.position.y=2.95}});sc.add(m);$('kEpN').textContent=lk.n;
 PV={r,sc,cam,m,yaw:.5,pitch:.15,dist:6.5,auto:true,pose:0,stop:false};
 const rs=()=>{const w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};rs();
 let drag=null,pin=null;const P=new Map();
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);P.set(e.pointerId,{x:e.clientX,y:e.clientY});drag={x:e.clientX,y:e.clientY};PV.auto=false;cv.style.cursor='grabbing'};
 cv.onpointermove=e=>{if(!P.has(e.pointerId))return;P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size===2){const [a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pin)PV.dist=Math.max(2.6,Math.min(12,PV.dist*pin/d));pin=d;return}
  if(drag){PV.yaw-=(e.clientX-drag.x)*.01;PV.pitch=Math.max(-.3,Math.min(.9,PV.pitch+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY}}};
 cv.onpointerup=cv.onpointercancel=e=>{P.delete(e.pointerId);pin=null;if(!P.size)drag=null;cv.style.cursor='grab'};
 cv.onwheel=e=>{e.preventDefault();PV.dist=Math.max(2.6,Math.min(12,PV.dist*(e.deltaY>0?1.1:.9)))};
 $('kEpL').onclick=()=>{PV.yaw+=.6;PV.auto=false};$('kEpR').onclick=()=>{PV.yaw-=.6;PV.auto=false};$('kEpZi').onclick=()=>PV.dist=Math.max(2.6,PV.dist*.85);$('kEpZo').onclick=()=>PV.dist=Math.min(12,PV.dist*1.15);
 $('kEpA').onclick=()=>PV.auto=!PV.auto;$('kEpP').onclick=()=>PV.pose=(PV.pose+1)%3;$('kEpRe').onclick=()=>{PV.yaw=.5;PV.pitch=.15;PV.dist=6.5;PV.auto=true};
 let t=0,lt=performance.now();(function loop(){if(!PV||PV.stop)return;requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.05,(n-lt)/1000);lt=n;t+=dt;if(cv.clientWidth&&Math.abs(cv.width-cv.clientWidth*r.getPixelRatio())>2)rs();
  if(PV.auto)PV.yaw+=dt*.6;const ty=1.35;cam.position.set(Math.sin(PV.yaw)*Math.cos(PV.pitch)*PV.dist,ty+Math.sin(PV.pitch)*PV.dist,Math.cos(PV.yaw)*Math.cos(PV.pitch)*PV.dist);cam.lookAt(0,ty*(PV.dist<4?1.25:1),0);
  m.traverse(o=>{const l=o.userData&&o.userData.limb;if(!l)return;if(PV.pose===1){if(l==='larm'||l==='rarm')o.rotation.x=Math.sin(t*6+(l==='larm'?0:3))*.8;if(l==='lleg'||l==='rleg')o.rotation.x=Math.sin(t*6+(l==='lleg'?3:0))*.6}else if(PV.pose===2){if(l==='rarm')o.rotation.z=-2.6+Math.sin(t*8)*.3;else o.rotation.x=0}else{o.rotation.x=0;if(l==='rarm')o.rotation.z=0}});
  m.position.y=Math.sin(t*2)*.03;r.render(sc,cam)})()}
// előnézet-gomb a boltba és a karakterválasztóba
function addPvBtns(){[['shop','kEpvS'],['chars','kEpvC']].forEach(([id,bid])=>{const s=$(id);if(!s||$(bid))return;const hd=s.querySelector('.card .f');if(!hd)return;const b=document.createElement('button');b.id=bid;b.className='b';b.textContent='🧍 '+T('ELŐNÉZET');b.style.marginLeft='8px';b.onclick=e=>{e.stopPropagation();openPreview()};const back=hd.querySelector('button');if(back)back.before(b);else hd.appendChild(b)})}
setInterval(addPvBtns,1500);

// ================= 34: profiloldal =================
const WN=()=>{try{return WPN.map(w=>w.e+' '+w.n)}catch(e){return []}};
const WST=LS.g('k3EWpn',{});let wTick=0;
setInterval(()=>{if(!inMatch())return;try{const i=G.wp;if(typeof i==='number'){WST[i]=(WST[i]||0)+1;if(++wTick%15===0)LS.s('k3EWpn',WST)}}catch(e){}},1000);
function profile(){const u=(window.ACC&&ACC.user)||{},st=u.stats||{},log=LS.g('k3x20log',[]),ch=LS.g('k3x10ch',{}),ach=ch.ach||{},tot=ch.tot||{};
 let sc=0,lv=1,xp=0;try{sc=S.c;lv=S.lv;xp=S.xp}catch(e){}let zs=0;try{zs=BR.zs}catch(e){}
 const r=rankIdx();let R=['Tag','🙂','#94a3b8'];try{R=_rang.R[r]}catch(e){}const pr=LS.g('k3x13dPrest',0);
 const fav=Object.entries(WST).sort((a,b)=>b[1]-a[1]),names=WN(),favN=fav.length?(names[fav[0][0]]||'#'+fav[0][0]):T('még nincs adat');
 const wins=log.filter(x=>x.win).length,kills=log.reduce((a,x)=>a+(x.k|0),0),best=log.reduce((a,x)=>Math.max(a,x.cash|0),0);
 const games=Math.max(st.games|0,log.length),W=Math.max(st.wins|0,wins),K=Math.max(st.kills|0,kills);
 const stat=(v,n)=>'<div class="card stat"><b>'+v+'</b><small>'+n+'</small></div>';
 const badges=[];if(pr)badges.push('✦ Prestige '+pr);Object.keys(ach).forEach(id=>badges.push('🏆 '+id));if(LS.g('k3x120wins',0))badges.push('🏅 '+LS.g('k3x120wins',0)+' '+T('győzelem (x120)'));for(let i=1;i<=r;i++){try{badges.push(_rang.R[i][1]+' '+_rang.R[i][0])}catch(e){}}
 const wl=fav.slice(0,5).map(([i,n])=>{const tot2=fav.reduce((a,x)=>a+x[1],0);return '<div class="row" style="margin:4px 0"><span style="min-width:240px">'+esc(names[i]||'#'+i)+'</span><div style="flex:1;height:8px;background:#0b1022;border-radius:6px;overflow:hidden"><div style="height:100%;width:'+(n/tot2*100).toFixed(1)+'%;background:linear-gradient(90deg,#facc15,#f97316)"></div></div><small>'+Math.round(n/tot2*100)+'%</small></div>'}).join('');
 openM(T('👤 PROFILOM'),
 '<div class="card" style="display:flex;gap:16px;align-items:center;border-color:'+R[2]+'"><div style="font-size:56px;width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#0b1022;border:3px solid '+R[2]+';box-shadow:0 0 22px '+R[2]+'66">'+esc(u.avatar||curLook().em||'😎')+'</div><div style="flex:1"><div style="font:28px \'Luckiest Guy\',Impact;color:#fff">'+esc(u.name||'Vendég')+'</div><div style="color:'+R[2]+';font-weight:800">'+R[1]+' ['+esc(R[0])+'] · Lv '+lv+(pr?' · ✦P'+pr:'')+'</div><div style="color:#94a3b8">'+(window.ACC&&ACC.guest?T('Vendég fiók (helyi mentés)'):T('Fiók – felhőbe mentve'))+'</div></div><button class="kb" id="kEprPv">🧍 '+T('ELŐNÉZET')+'</button><button class="kb" id="kEprR">🏅 '+T('RANG')+'</button></div>'+
 '<div class="grid" style="margin-top:10px">'+stat(games,T('meccs'))+stat(W,T('győzelem'))+stat(games?Math.round(W/games*100)+'%':'–',T('győzelmi arány'))+stat(K,T('kiesés (ellenfél)'))+stat(games?(K/games).toFixed(1):'–',T('kiesés / meccs'))+stat(fm(best),T('legjobb meccspénz'))+stat(fm(sc),T('egyenleg'))+stat((zs|0).toLocaleString('hu-HU'),T('zseton'))+stat(xp|0,'XP')+stat((tot.hs|0)+' / '+(tot.melee|0),T('fejlövés / közelharc'))+'</div>'+
 '<div class="card" style="margin-top:10px"><b style="color:#fde047">🔫 '+T('KEDVENC FEGYVER')+':</b> '+esc(favN)+'<div style="margin-top:6px">'+(wl||'<small style="color:#94a3b8">'+T('Játssz egy meccset – a használt fegyvereket számoljuk.')+'</small>')+'</div></div>'+
 '<div class="card" style="margin-top:10px"><b style="color:#fde047">🎖️ '+T('JELVÉNYEK')+' ('+badges.length+')</b><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">'+(badges.map(b=>'<span style="padding:4px 10px;border-radius:999px;background:#0b1022;border:1px solid #ffffff22">'+esc(b)+'</span>').join('')||'<small style="color:#94a3b8">'+T('Még nincs jelvényed.')+'</small>')+'</div></div>'+
 '<div class="card" style="margin-top:10px"><b style="color:#fde047">📜 '+T('UTOLSÓ MECCSEK')+'</b><div style="margin-top:6px;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px">'+(log.slice(0,8).map(x=>'<div style="background:#0b1022;border-radius:10px;padding:6px 8px;border-left:4px solid '+(x.win?'#22c55e':'#ef4444')+'">'+(x.win?'🏆':'💀')+' '+esc(x.mode)+'<br><small>'+(x.k|0)+' kiesés · '+fm(x.cash)+'</small></div>').join('')||'<small style="color:#94a3b8">–</small>')+'</div></div>');
 $('kEprPv').onclick=openPreview;$('kEprR').onclick=()=>{closeM();try{_rang.open()}catch(e){}}}

// ================= 36: betöltőképernyő valódi százalékkal =================
const TEX=('asphalt bark brick carpet cobble conc darkwood denim fa1 fa2 fa3 fa4 fa5 fa6 facade fleece fur grass2 grass jersey leather metal painted plaster pool rock roof rubber sand stone tile wood wool').split(' ');
const GRAY=new Set('carpet denim fleece fur jersey leather painted rubber wool'.split(' '));
const TEXL=['sky_game.jpg'];TEX.forEach(n=>{TEXL.push(n+'_diff.jpg',n+'_nor.jpg');if(GRAY.has(n))TEXL.push(n+'_gray.jpg')});
const TIPS=['Tipp: a prémium sáv XP-t minden meccs ad – a győzelem +300.','Tipp: F8 megnyitja a Haladás panelt.','Tipp: mentsd el a játékállást kóddal, mielőtt böngészőt váltasz!','Tipp: a heti küldetéssor 7. napja adja a legnagyobb jutalmat.','Tipp: ajándékkóddal játékpénzt küldhetsz egy barátodnak.','Tipp: a betöltés alatt kattints az érmékre – minden érme +150 Ft!','Tipp: a lobby keresőjébe írd be, mit keresel (pl. „kutya”).','Tipp: F1 = Súgó és GYIK.','Tipp: a rangod szerint érkezel a lobbyba – a Mester tűzben!','Tipp: kontrollerrel a menükben is navigálhatsz (D-pad, A, B).','Tipp: a Profilomban látod a kedvenc fegyveredet.','Tipp: több billentyűkiosztást is elmenthetsz profilként.','Tip: switch the game to English in Settings → Language.'];
let loadDone=false,loadBusy=false;
function preload(onP){if(loadDone){onP(1,TEXL.length,TEXL.length,'');return Promise.resolve()}let n=0;const tot=TEXL.length;
 return Promise.all(TEXL.map(f=>fetch('tex_opt/'+f).then(r=>r.ok?r.blob():null).catch(()=>null).then(()=>{n++;onP(n/tot,n,tot,f)}))).then(()=>{loadDone=true})}
function showLoad(done){loadBusy=true;const quick=loadDone;const L=document.createElement('div');L.id='kELoad';const pr=LS.g('k3x13dPrest',0);
 L.innerHTML='<h1>KÖZPÉNZ ROYALE</h1><div style="color:#a5b4fc">'+(pr?'✦ Prestige '+pr+' ✦':T('Betöltés…'))+'</div><div class="bar"><i></i></div><div class="pc">0%</div><div class="st"></div><div class="tip"></div><div style="color:#a5b4fc;font-size:13px">🪙 '+T('Érmegyűjtő')+': <b class="cc">0</b></div><button class="b" style="margin-top:14px;display:none">▶ '+T('INDULÁS')+' (Space)</button>';
 document.body.appendChild(L);const bar=L.querySelector('.bar i'),pc=L.querySelector('.pc'),st=L.querySelector('.st'),tip=L.querySelector('.tip'),go=L.querySelector('button');
 let ti=Math.random()*TIPS.length|0;const sTip=()=>tip.textContent=T(TIPS[ti]);sTip();let coins=0,fin=false;
 const steps={tex:0,font:0,ready:0};const upd=()=>{const p=steps.tex*.85+steps.font*.1+steps.ready*.05;bar.style.width=(p*100).toFixed(1)+'%';pc.textContent=Math.floor(p*100)+'%';return p};
 const spawn=()=>{if(fin)return;const c=document.createElement('div');c.className='coin';c.textContent='Ft';c.style.left=(8+Math.random()*84)+'%';c.style.top=(10+Math.random()*75)+'%';c.onpointerdown=e=>{e.stopPropagation();coins++;L.querySelector('.cc').textContent=coins;c.remove()};L.appendChild(c);setTimeout(()=>c.remove(),1300)};
 const si=setInterval(spawn,450),tt=setInterval(()=>{ti=(ti+1)%TIPS.length;sTip()},2800);const t0=performance.now();
 const finish=()=>{if(fin)return;fin=true;clearInterval(si);clearInterval(tt);document.removeEventListener('keydown',kd,true);if(coins){try{S.c+=coins*150;if(window.saveGame)saveGame()}catch(e){}setTimeout(()=>toast('🪙 '+coins+' × 150 Ft = +'+fm(coins*150)),600)}L.style.opacity=0;setTimeout(()=>{L.remove();loadBusy=false},350);done()};
 const kd=e=>{if(e.code==='Space'&&go.style.display!=='none'){e.preventDefault();e.stopPropagation();finish()}};document.addEventListener('keydown',kd,true);go.onclick=finish;
 const fp=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();fp.then(()=>{steps.font=1;upd()});
 preload((f,n,tot,file)=>{steps.tex=f;st.textContent=T('Textúrák')+': '+n+' / '+tot+(file?' · '+file:'');upd()}).then(()=>fp).then(()=>{steps.ready=1;upd();st.textContent=T('Minden betöltve.');
  const wait=Math.max(0,(quick?500:900)-(performance.now()-t0));setTimeout(()=>{pc.textContent='100% · '+T('KÉSZ');go.style.display='';setTimeout(()=>{if(!fin)finish()},quick?600:2200)},wait)})}
// a régi (extra130d) #gb-betöltő helyett: window.launch csomagolása (lobby JÁTÉK, #gb, újrakezdés is)
window.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('#gb');if(!b||!SET.load)return;b._x13dPass=1;setTimeout(()=>{b._x13dPass=0},0)},true);
(function wrapLaunch(){const ol=window.launch;if(typeof ol!=='function'){setTimeout(wrapLaunch,500);return}
 window.launch=function(){const self=this,args=arguments;if(!SET.load||loadBusy||window._kEPass||inMatch())return ol.apply(self,args);
  showLoad(()=>{window._kEPass=1;try{return ol.apply(self,args)}finally{window._kEPass=0}})}})();

// ================= 37: mobil irányítás finomítása =================
const MOB=Object.assign({sens:1,size:1,op:.6,left:0,vib:1,stick:1},LS.g('k3EMob',{}));const saveMob=()=>{LS.s('k3EMob',MOB);applyMob()};
const isTouch=()=>('ontouchstart' in window)||navigator.maxTouchPoints>0;
const stk=document.createElement('div');stk.id='kEstick';stk.innerHTML='<i></i>';document.body.appendChild(stk);
function applyMob(){const m=$('x12mob');if(m){m.style.transform='scale('+MOB.size+')';m.style.transformOrigin=MOB.left?'left bottom':'right bottom';m.style.opacity=MOB.op;m.style.right=MOB.left?'auto':'12px';m.style.left=MOB.left?'12px':'auto';
 if(!m._kE){m._kE=1;m.addEventListener('touchstart',()=>{if(MOB.vib&&navigator.vibrate)try{navigator.vibrate(18)}catch(e){}},{passive:true})}}}
setInterval(applyMob,2000);
// érzékenység: a játék saját touch-nézelődéséhez (FP) hozzáadjuk a különbséget
const lk2={};addEventListener('touchstart',e=>{for(const t of e.changedTouches)lk2[t.identifier]={x:t.clientX,y:t.clientY}},{passive:true});
addEventListener('touchmove',e=>{if(!inMatch())return;let sid=null;try{sid=stick.id}catch(er){}for(const t of e.changedTouches){const p=lk2[t.identifier];lk2[t.identifier]={x:t.clientX,y:t.clientY};if(!p||t.identifier===sid)continue;
 try{if(G.fp&&MOB.sens!==1){const dx=t.clientX-p.x,dy=t.clientY-p.y,k=MOB.sens-1;G.ang+=dx*.005*k;G.pit=Math.max(-1.5,Math.min(1.5,(G.pit||0)-dy*.004*k))}}catch(er){}}},{passive:true});
addEventListener('touchend',e=>{for(const t of e.changedTouches)delete lk2[t.identifier]},{passive:true});
(function stickLoop(){requestAnimationFrame(stickLoop);let s=null;try{s=stick}catch(e){}const show=MOB.stick&&s&&s.id!==null&&inMatch();if(!show){if(stk.style.display!=='none')stk.style.display='none';return}
 stk.style.display='block';stk.style.left=s.ox+'px';stk.style.top=s.oy+'px';stk.firstChild.style.transform='translate('+(s.x*40)+'px,'+(s.y*40)+'px)'})();
function mobUI(){const rng=(id,n,mi,ma,st,v)=>'<div class="row"><span>'+T(n)+'</span><input type="range" id="'+id+'" min="'+mi+'" max="'+ma+'" step="'+st+'" value="'+v+'"><b id="'+id+'v">'+v+'</b></div>';
 const chk=(id,n,v)=>'<div class="row"><span>'+T(n)+'</span><input type="checkbox" id="'+id+'" '+(v?'checked':'')+'></div>';
 openM(T('📱 MOBIL IRÁNYÍTÁS'),'<div class="card">'+rng('kEmS','Nézelődés érzékenysége',.4,2.5,.1,MOB.sens)+rng('kEmZ','Gombméret',.7,1.6,.05,MOB.size)+rng('kEmO','Gombok átlátszósága',.2,1,.05,MOB.op)+chk('kEmL','Gombok a bal oldalon (balkezes)',MOB.left)+chk('kEmV','Rezgés gombnyomáskor',MOB.vib)+chk('kEmJ','Joystick-kijelzés (bal hüvelykujj)',MOB.stick)+
 '<div style="color:#94a3b8;font-size:13px;margin-top:6px">'+T('Bal képernyőfél: húzás = mozgás · jobb fél: húzás = célzás (FP nézetben) · TPS-ben a játék a legközelebbi ellenfélre céloz.')+' '+(isTouch()?'':T('(Ez az eszköz nem érintőképernyős – a beállítások mobilon lépnek életbe.)'))+'</div></div>');
 [['kEmS','sens'],['kEmZ','size'],['kEmO','op']].forEach(([id,k])=>{$(id).oninput=e=>{MOB[k]=+e.target.value;$(id+'v').textContent=MOB[k];saveMob()}});
 [['kEmL','left'],['kEmV','vib'],['kEmJ','stick']].forEach(([id,k])=>{$(id).onchange=e=>{MOB[k]=e.target.checked?1:0;saveMob()}})}

// ================= 38: kontroller a menükben =================
const GPP={};let gpFoc=null,gpRep=0,gpLast=0;
const visible=el=>{if(!el.isConnected)return false;const r=el.getBoundingClientRect();if(r.width<4||r.height<4||r.bottom<0||r.right<0||r.top>innerHeight||r.left>innerWidth)return false;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity<.05||cs.pointerEvents==='none')return false;const pt=document.elementFromPoint(Math.min(innerWidth-1,Math.max(0,r.left+r.width/2)),Math.min(innerHeight-1,Math.max(0,r.top+r.height/2)));return !!pt&&(el===pt||el.contains(pt)||pt.contains(el))};
function focusables(){const root=M.classList.contains('on')?M:document;return [...root.querySelectorAll('button,a[href],input,select,[onclick],.tab,.lbBadge,#lb2pan .g button')].filter(el=>!el.disabled&&visible(el))}
function setFoc(el){if(gpFoc)gpFoc.classList.remove('kEfoc');gpFoc=el;if(el){el.classList.add('kEfoc');try{el.focus({preventScroll:true})}catch(e){}el.scrollIntoView({block:'nearest',inline:'nearest'})}}
function moveFoc(dx,dy){const L=focusables();if(!L.length)return;if(!gpFoc||!L.includes(gpFoc)){setFoc(L[0]);return}const a=gpFoc.getBoundingClientRect(),ax=a.left+a.width/2,ay=a.top+a.height/2;let best=null,bs=1e9;
 L.forEach(el=>{if(el===gpFoc)return;const b=el.getBoundingClientRect(),bx=b.left+b.width/2,by=b.top+b.height/2,vx=bx-ax,vy=by-ay;const along=vx*dx+vy*dy;if(along<=4)return;const perp=Math.abs(vx*dy-vy*dx);const s=along+perp*2.2;if(s<bs){bs=s;best=el}});if(best)setFoc(best)}
function gpBack(){const c=[...document.querySelectorAll('button')].filter(b=>visible(b)&&/^(✕|×|X|VISSZA|BEZÁR|BACK|CLOSE|MÉGSE)\b/i.test((b.textContent||'').trim()));
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true}));if(M.classList.contains('on')){closeM();return}if(c.length)c[c.length-1].click()}
(function gpLoop(){requestAnimationFrame(gpLoop);if(!SET.gp||!navigator.getGamepads)return;const p=[...navigator.getGamepads()].find(x=>x);if(!p)return;
 const menu=!inMatch()||M.classList.contains('on');if(!menu){if(gpFoc)setFoc(null);return}
 const B=i=>p.buttons[i]&&(p.buttons[i].pressed||p.buttons[i].value>.5),ax=p.axes[0]||0,ay=p.axes[1]||0,n=performance.now();
 const dir=B(12)||ay<-.6?[0,-1]:B(13)||ay>.6?[0,1]:B(14)||ax<-.6?[-1,0]:B(15)||ax>.6?[1,0]:null;
 if(dir){if(!GPP.dir||n>gpRep){moveFoc(dir[0],dir[1]);gpRep=n+(GPP.dir?140:380)}GPP.dir=1}else GPP.dir=0;
 const edge=(i,fn)=>{const b=B(i);if(b&&!GPP[i])fn();GPP[i]=b};
 edge(0,()=>{if(gpFoc&&gpFoc.isConnected){if(gpFoc.tagName==='INPUT'&&gpFoc.type==='checkbox')gpFoc.click();else gpFoc.click()}else moveFoc(0,1)});
 edge(1,gpBack);edge(3,()=>{if(inLobby()){const q=$('lb2qi');if(q)q.focus()}});
 const ry=p.axes[3]||0;if(Math.abs(ry)>.3){const sc=gpFoc&&gpFoc.closest('.bd,#lb2pan')||M.querySelector('.bd');if(sc)sc.scrollTop+=ry*14}})();

// ================= 39: angol nyelv (szótár) =================
const EN={
'🎮 JÁTÉK':'🎮 PLAY','🤝 KÖZÖSSÉG':'🤝 COMMUNITY','🎰 BOLT & KASZINÓ':'🎰 SHOP & CASINO','🎨 TESTRESZABÁS':'🎨 CUSTOMIZE','📈 HALADÁS':'📈 PROGRESS','⚙️ BEÁLLÍTÁSOK':'⚙️ SETTINGS','✨ EGYÉB':'✨ OTHER','KÜLDETÉSEK':'QUESTS','📰 HÍREK':'📰 NEWS','TRIÓ':'TRIO','BÉRLET':'PASS','BRONZ':'BRONZE','EZÜST':'SILVER','ARANY':'GOLD','HARCBA VISZEM':'TAKE INTO BATTLE','Oktató':'Tutorial','Visszajátszás':'Replay','Szerkesztő':'Editor','Minijáték':'Minigames','Fegyverek':'Weapons','Játékmenet':'Gameplay','Világ ii':'World II','Kódok':'Codes','Rang':'Rank','Kihívások':'Challenges','Trófeák':'Trophies','Zene':'Music','Jelvények':'Badges',
'JÁTÉK':'PLAY','SZEKRÉNY':'LOCKER','TÁRGYBOLT':'ITEM SHOP','SZEZONBÉRLET':'BATTLE PASS','KASZINÓ':'CASINO','💱 VÁLTÓ':'💱 EXCHANGE','🐕 ÁLLATOK':'🐕 PETS','KARRIER':'CAREER','KODEX':'CODEX','FLAKON':'BOTTLES',
'KÖZÖSSÉG':'COMMUNITY','BOLT & KASZINÓ':'SHOP & CASINO','TESTRESZABÁS':'CUSTOMIZE','HALADÁS':'PROGRESS','BEÁLLÍTÁSOK':'SETTINGS','EGYÉB':'OTHER','🔎 Írd be, mit keresel…':'🔎 Type what you are looking for…',
'CHAT':'CHAT','💃 TÁNC':'💃 DANCE','GLOBÁLIS':'GLOBAL','PARTI':'PARTY','SZINT':'LEVEL','KÉSZ VAGYOK?':'READY?','KÉSZ ✔':'READY ✔','JÁTÉK (nem mindenki kész)':'PLAY (not everyone ready)',
'KÖZPÉNZ ROYALE':'PUBLIC MONEY ROYALE','MENTSD MEG A VILÁGOT':'SAVE THE WORLD','SÖTÉT PROGRAM':'DARK PROGRAM','FLAKONVADÁSZAT':'BOTTLE HUNT',
'🚗 MECCS INDÍTÁSA':'🚗 START MATCH','📜 100 POLITIKAI KODEX':'📜 100 POLITICAL CODEX','⚙️ BEÁLLÍTÁSOK':'⚙️ SETTINGS','🏆 TRÓFEÁK & STATISZTIKA':'🏆 TROPHIES & STATS','❓ IRÁNYÍTÁS':'❓ CONTROLS','💰 KÖZPÉNZ SHOP':'💰 PUBLIC MONEY SHOP',
'VÁLASSZ KARAKTERT':'CHOOSE A CHARACTER','VISSZA':'BACK','UGRÁS A KAMPÁNYBUSZRA!':'JUMP ON THE CAMPAIGN BUS!','KÖZPÉNZ SHOP':'PUBLIC MONEY SHOP','EGYENLEG:':'BALANCE:','BEZÁR':'CLOSE','MÉGSE':'CANCEL','MENTÉS':'SAVE','VÁSÁRLÁS':'BUY','MEGVESZEM':'BUY','FELSZERELÉS':'EQUIP','FELSZERELVE':'EQUIPPED',
'BELÉPÉS':'LOG IN','REGISZTRÁCIÓ':'SIGN UP','ÜDV ÚJRA!':'WELCOME BACK!','Lépj be, a közpénz már vár.':'Log in, the public money is waiting.','🎮 Játék vendégként (offline)':'🎮 Play as guest (offline)','VAGY':'OR',' Emlékezz a nevemre':' Remember my name',
'Betöltés…':'Loading…','Betöltés...':'Loading...','INDULÁS':'START','Érmegyűjtő':'Coin collector','Textúrák':'Textures','Minden betöltve.':'Everything loaded.','KÉSZ':'DONE',
'ÉLET':'HEALTH','PAJZS':'SHIELD','LŐSZER':'AMMO','KIESÉS':'ELIMINATIONS','ÉLŐ':'ALIVE','ZÓNA':'STORM','A ZÓNA ZSUGORODIK!':'THE STORM IS SHRINKING!','GYŐZELEM!':'VICTORY!','KIESTÉL':'ELIMINATED','ÚJRA':'AGAIN','MENÜ':'MENU','FOLYTATÁS':'RESUME','KILÉPÉS':'QUIT',
'🧍 KARAKTER-ELŐNÉZET':'🧍 CHARACTER PREVIEW','FORGÁS':'SPIN','PÓZ':'POSE','ALAPHELYZET':'RESET','ELŐNÉZET':'PREVIEW','Húzd az egérrel/ujjal a forgatáshoz · görgő/csippentés = nagyítás':'Drag with mouse/finger to rotate · wheel/pinch = zoom',
'👤 PROFILOM':'👤 MY PROFILE','RANG':'RANK','meccs':'matches','győzelem':'wins','győzelmi arány':'win rate','kiesés (ellenfél)':'eliminations','kiesés / meccs':'elims / match','legjobb meccspénz':'best match cash','egyenleg':'balance','zseton':'chips','fejlövés / közelharc':'headshots / melee',
'KEDVENC FEGYVER':'FAVOURITE WEAPON','még nincs adat':'no data yet','JELVÉNYEK':'BADGES','UTOLSÓ MECCSEK':'RECENT MATCHES','Még nincs jelvényed.':'No badges yet.','Játssz egy meccset – a használt fegyvereket számoljuk.':'Play a match – we count the weapons you use.','Vendég fiók (helyi mentés)':'Guest account (local save)','Fiók – felhőbe mentve':'Account – saved to cloud','győzelem (x120)':'wins (x120)',
'📱 MOBIL IRÁNYÍTÁS':'📱 MOBILE CONTROLS','Nézelődés érzékenysége':'Look sensitivity','Gombméret':'Button size','Gombok átlátszósága':'Button opacity','Gombok a bal oldalon (balkezes)':'Buttons on the left (left-handed)','Rezgés gombnyomáskor':'Vibrate on press','Joystick-kijelzés (bal hüvelykujj)':'Show joystick (left thumb)',
'❓ SÚGÓ & GYIK':'❓ HELP & FAQ','🌐 NYELV / LANGUAGE':'🌐 LANGUAGE','⌨️ BILLENTYŰ-PROFILOK':'⌨️ KEY PROFILES','🎮 KONTROLLER':'🎮 CONTROLLER','🧭 LOBBY+ BEÁLLÍTÁSOK':'🧭 LOBBY+ SETTINGS','📲 TELEPÍTÉS (PWA)':'📲 INSTALL (PWA)',
'Profilom':'My profile','Súgó & GYIK':'Help & FAQ','Nyelv / Language':'Language','Billentyű-profilok':'Key profiles','Mobil irányítás':'Mobile controls','Kontroller a menükben':'Controller in menus','Karakter-előnézet':'Character preview','Lobby+ beállítások':'Lobby+ settings','Telepítés (PWA)':'Install (PWA)',
'Nincs találat. Próbáld másképp (pl. „kaszinó”, „kutya”, „rang”).':'No results. Try something else (e.g. "casino", "dog", "rank").',
'Kaszinó':'Casino','Teakert':'Tea garden','Hírek':'News','Ajándék':'Gift','Csapatfotó':'Team photo','Zenegép':'Jukebox','Barátok':'Friends','Edzőpálya':'Training ground','Sötét program':'Dark program','Haladás':'Progress','Stílus & állatok':'Style & pets','Kényelem':'Comfort','Grafika & hang':'Graphics & sound','Módok':'Modes','Ellenfél-ai':'Enemy AI','Promóciós kód':'Promo code','Irányítás':'Controls','Napi kerék':'Daily wheel','Rejtett tárgyak':'Hidden items',
'Tipp: a prémium sáv XP-t minden meccs ad – a győzelem +300.':'Tip: every match gives battle-pass XP – a win gives +300.','Tipp: F8 megnyitja a Haladás panelt.':'Tip: F8 opens the Progress panel.','Tipp: mentsd el a játékállást kóddal, mielőtt böngészőt váltasz!':'Tip: export your save as a code before switching browsers!','Tipp: a heti küldetéssor 7. napja adja a legnagyobb jutalmat.':'Tip: day 7 of the weekly quests gives the biggest reward.','Tipp: ajándékkóddal játékpénzt küldhetsz egy barátodnak.':'Tip: send game money to a friend with a gift code.','Tipp: a betöltés alatt kattints az érmékre – minden érme +150 Ft!':'Tip: click the coins while loading – each coin is +150 Ft!','Tipp: a lobby keresőjébe írd be, mit keresel (pl. „kutya”).':'Tip: type into the lobby search what you need (e.g. "dog").','Tipp: F1 = Súgó és GYIK.':'Tip: F1 = Help & FAQ.','Tipp: a rangod szerint érkezel a lobbyba – a Mester tűzben!':'Tip: you enter the lobby according to your rank – a Master arrives in fire!','Tipp: kontrollerrel a menükben is navigálhatsz (D-pad, A, B).':'Tip: navigate menus with a controller (D-pad, A, B).','Tipp: a Profilomban látod a kedvenc fegyveredet.':'Tip: My profile shows your favourite weapon.','Tipp: több billentyűkiosztást is elmenthetsz profilként.':'Tip: you can save several key layouts as profiles.'
};
const WEN=[[/\bJÁTÉKOS\b/g,'PLAYERS'],[/\bBOTOK\b/g,'BOTS'],[/\bSZINT\b/g,'LEVEL'],[/\bKIESÉS\b/g,'ELIMS'],[/\bkiesés\b/g,'elims'],[/\bGYŐZELEM\b/g,'VICTORY'],[/\bEGYENLEG\b/g,'BALANCE'],[/\bREKORD\b/g,'RECORD'],[/\bSZINT\b/g,'LEVEL'],[/\bÉLŐ\b/g,'ALIVE']];
const ORIG=new WeakMap(),DONE=new Set();let lang=SET.lang||'hu';
function T(s){if(lang!=='en'||s==null)return s;if(EN[s]!=null)return EN[s];const tr2=s.trim();if(EN[tr2]!=null)return s.replace(tr2,EN[tr2]);return s}
function trNode(n){const v=n.nodeValue;if(!v||!v.trim())return;if(ORIG.has(n)&&v===n._kEen)return;const src=v;
 const t=src.trim();let out=null;if(EN[t]!=null)out=src.replace(t,EN[t]);else if(t.length<40&&/[A-ZÁÉÍÓÖŐÚÜŰ]{3}/.test(t)){let s2=src;WEN.forEach(([re,r])=>s2=s2.replace(re,r));if(s2!==src)out=s2}
 if(out!=null&&out!==v){ORIG.set(n,src);n.nodeValue=out;n._kEen=out;DONE.add(n)}}
function tr(){if(lang!=='en')return;const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentNode;return p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)?2:1}});let n,c=0;while((n=w.nextNode())&&c<6000){c++;trNode(n)}
 document.querySelectorAll('input[placeholder]').forEach(i=>{const p=i.getAttribute('placeholder');if(EN[p]){i.dataset.kEph=p;i.setAttribute('placeholder',EN[p])}});
 try{const t=document.title;if(!document._kEt)document._kEt=t;document.title='Public Money Royale'}catch(e){}}
function untr(){DONE.forEach(n=>{if(n.isConnected&&ORIG.has(n)&&n.nodeValue===n._kEen)n.nodeValue=ORIG.get(n)});DONE.clear();document.querySelectorAll('input[data-k-eph]').forEach(i=>i.setAttribute('placeholder',i.dataset.kEph));if(document._kEt)document.title=document._kEt}
function setLang(l){lang=SET.lang=l;saveSet();document.documentElement.style.setProperty('--kEnews',l==='en'?'"📰 NEWS"':'"📰 HÍREK"');document.documentElement.lang=l;if(l==='en')tr();else untr();try{window._lb2&&(_lb2.EXTRA.forEach(x=>x.tx=T(x.hu)),_lb2.build())}catch(e){}}
let trPend=false;new MutationObserver(()=>{if(lang!=='en'||trPend)return;trPend=true;setTimeout(()=>{trPend=false;tr()},500)}).observe(document.body,{childList:true,subtree:true,characterData:true});
function langUI(){openM(T('🌐 NYELV / LANGUAGE'),'<div class="grid"><button class="kb '+(lang==='hu'?'y':'')+'" id="kElHu" style="text-align:center;padding:18px">🇭🇺 MAGYAR</button><button class="kb '+(lang==='en'?'y':'')+'" id="kElEn" style="text-align:center;padding:18px">🇬🇧 ENGLISH</button></div><div style="color:#94a3b8;font-size:13px;margin-top:10px">'+(lang==='en'?'Dictionary based: the main lobby, menu and HUD texts are translated; some panels stay Hungarian.':'Szótár alapú fordítás: a lobby, a menük és a HUD fő szövegei angolul jelennek meg; egyes panelek magyarok maradnak.')+'</div>');
 $('kElHu').onclick=()=>{setLang('hu');langUI()};$('kElEn').onclick=()=>{setLang('en');langUI()}}

// ================= 40: billentyű-profilok =================
const KP=Object.assign({},LS.g('k3EKbProf',{}));let kpAct=LS.g('k3EKbAct','');
const presets={'Alap (WASD)':{}, 'ESDF (eltolt kéz)':{w:'e',a:'s',s:'d',d:'f',e:'w'},'Nyilak':{w:'arrowup',a:'arrowleft',s:'arrowdown',d:'arrowright'}};
function applyKb(map){try{if(typeof x10kbReset!=='function'||typeof x10kb!=='function')throw 0;x10kbReset();const one=([t,p])=>{if(!p||p===t)return;x10kb(t===' '?'_':t);window.dispatchEvent(new KeyboardEvent('keydown',{key:p,bubbles:true,cancelable:true}))};Object.entries(map).forEach(one);for(let k=0;k<2;k++){const got=LS.g('k3x10kb',{});Object.entries(map).filter(([t,p])=>p&&p!==t&&got[t]!==p).forEach(one)}if(window.x10close)x10close()}catch(e){LS.s('k3x10kb',map);toast('Mentve – újratöltés után lép életbe.')}}
function kbUI(){const cur=LS.g('k3x10kb',{}),desc=m=>Object.keys(m).length?Object.entries(m).map(([t,p])=>(t===' '?'␣':t.toUpperCase())+'→'+(p===' '?'␣':p.toUpperCase())).join(' '):'alap';
 const all=Object.assign({},...Object.keys(presets).map(k=>({['★ '+k]:presets[k]})),KP);
 openM(T('⌨️ BILLENTYŰ-PROFILOK'),'<div class="card"><b>Jelenlegi kiosztás:</b> <span style="color:#fde047">'+esc(desc(cur))+'</span>'+(kpAct?' <small>('+esc(kpAct)+')</small>':'')+'<div class="row"><input type="text" id="kEkn" maxlength="24" placeholder="Profil neve (pl. Lövöldözős)"><button class="kb y" id="kEks">💾 MENTÉS PROFILKÉNT</button><button class="kb" id="kEke">⌨️ ÁTÁLLÍTÁS…</button></div></div>'+
 '<div style="margin-top:10px">'+Object.entries(all).map(([n,m])=>'<div class="card row" style="margin:6px 0"><span style="min-width:180px"><b>'+esc(n)+'</b>'+(n===kpAct?' ✅':'')+'</span><small style="flex:1;color:#94a3b8">'+esc(desc(m))+'</small><button class="kb y" data-l="'+esc(n)+'">BETÖLT</button>'+(n.startsWith('★')?'':'<button class="kb x" data-d="'+esc(n)+'">🗑</button>')+'</div>').join('')+'</div><div style="color:#94a3b8;font-size:13px">Max. 8 saját profil. A betöltés az extra10 billentyű-átállítást írja át (k3x10kb).</div>');
 $('kEks').onclick=()=>{const n=$('kEkn').value.trim();if(!n)return toast('Adj nevet a profilnak!');if(!KP[n]&&Object.keys(KP).length>=8)return toast('Max. 8 profil.');KP[n]=LS.g('k3x10kb',{});LS.s('k3EKbProf',KP);kpAct=n;LS.s('k3EKbAct',n);kbUI()};
 $('kEke').onclick=()=>{closeM();if(window.x10kbOpen)x10kbOpen()};
 M.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{const n=b.dataset.l;applyKb(all[n]||{});kpAct=n;LS.s('k3EKbAct',n);toast('⌨️ '+n);kbUI()});
 M.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{delete KP[b.dataset.d];LS.s('k3EKbProf',KP);if(kpAct===b.dataset.d){kpAct='';LS.s('k3EKbAct','')}kbUI()})}

// ================= 41: súgó + GYIK =================
const HELP=[
['Alapok','Hogyan indítok meccset?','Lobby → JÁTÉK gomb (bal alsó panel). A mód a panel tetején vált: Royale → Mentsd meg a világot → Flakon → Sötét Program.'],
['Alapok','Mi a különbség a Ft és a zseton között?','A Ft (S.c) a meccspénz/VSport/flakon pénze, a zseton a bolt és a kaszinó pénze. Mindkettő CSAK játékbeli pénz.'],
['Alapok','Hogyan mentődik az állásom?','Belépve minden helyi mentés a fiókodhoz kerül (felhőmentés, 20 mp-enként). Vendégként csak a böngészőben marad. Kóddal exportálhatsz is (Haladás → F8).'],
['Lobby','Hol vannak a régi gombok?','A lobby felső kategória-sávjában (Játék, Közösség, Bolt & Kaszinó, Testreszabás, Haladás, Beállítások, Egyéb) – vagy írd be a keresőbe, mit keresel.'],
['Lobby','Mi a napszakos háttér?','A lobby égboltja a valós időt követi: hajnal, nappal, naplemente, csillagos éjszaka, úszó felhők. Kikapcsolható: Lobby+ beállítások.'],
['Lobby','Miért érkezik a karakterem tűzben?','A rangod szerinti belépő animáció: Tag = leesik, VIP = szikrák, VIP+ = spirál, Elit = fénysugár, Legenda = láng, Mester = tűzoszlop + korona, Örökös = szivárvány.'],
['Lobby','Hogyan nézem meg a karakterem közelről?','Karakter-előnézet: Testreszabás kategória, a Boltban/Karakterválasztóban a 🧍 ELŐNÉZET gomb. Húzás = forgatás, görgő/csippentés = nagyítás.'],
['Profil','Hol a statisztikám?','Haladás → 👤 Profilom: meccsek, győzelmek, kiesések, kedvenc fegyver, jelvények, rang, utolsó meccsek.'],
['Profil','Mik a rangok?','Tag → VIP → VIP+ → Elit → Legenda → Mester → Örökös. Ft-tal, zsetonnal vagy fiókszinttel szerezhető, +5–40% meccspénz és napi bónusz. Chat: /rang.'],
['Harc','Fegyverek és gombok','1–9 fegyverváltás, görgő, R újratöltés, Ű lőszertípus, Í fegyverdobás, Ú inspect, H gránát, E interakció/közelharc, J csúszás, dupla W/A/S/D = dash, [,]/[.] kihajolás.'],
['Harc','Járművek','Quad, csónak, jetski, repülő, heli, autó (Shift drift), robogó, gördeszka. E = be/ki. Parancsok: /repcsi /heli /auto /motor /deszka.'],
['Harc','Varázslatok és italok','É = varázslat, Á = váltás, Ő = ital az üstből. Varázskönyvek a meccsben.'],
['Harc','Újraélesztés','A lent levő bot-társ mellett tartsd nyomva az E-t 3 mp-ig. Téged is felsegíthet 1× meccsenként.'],
['Harc','Ellenfél-AI és módok','F3: bot-nehézség (könnyű–őrült). F4: 10 extra mód (közelharc, mesterlövész-párbaj, zászlórablás, zombi…).'],
['Világ','Mentsd meg a világot','Saját világ 19 + 10 küldetéssel (F9: 2. fejezet), bázisépítés, kísérők, Hamvak Ura boss.'],
['Világ','Teakert','🫖 közös 3D tér: horgászás, teafőzés, nyugágyak, virágágyás, csónak (B), Konyhapárbaj. Push-to-talk: V.'],
['Kaszinó','Kaszinó játékok','Nyerőgép, póker, blackjack, rulett, kockapóker, kaparós sorsjegy, lóverseny, tőzsde, lottó (20:00). Közös napi veszteséghatár véd. Csak zseton/Ft, valódi pénz nincs.'],
['Kaszinó','Promóciós kód','🎟️ a Bolt & Kaszinó kategóriában. Saját kódot is létrehozhatsz (max 5).'],
['Közösség','Klánok, barátok, ajándék','⭐ Közösség: profil-összehasonlítás, klán + chat, rangsor, naptár, ajándékkód, kutyakiállítás, kártyák.'],
['Közösség','Telefon','U = telefon: hívások, Közgram, küldetések, kamera (O fotómód), galéria, térkép, zseblámpa.'],
['Állatok','Kutyák és háziállatok','🐕 ÁLLATOK fül: kutyák, harcoló kutya (K/L), ritka kutyák tojásból, 2. állat (macska/papagáj), etetés, B = kutya-emote menü.'],
['Beállítások','Billentyűk átállítása','Beállítások → ⌨️ Billentyű-profilok: több kiosztás mentése és váltása (pl. ESDF, Nyilak).'],
['Beállítások','Kontroller','Meccsben: bal kar mozgás, jobb kar nézés, RT lövés, A ugrás, B csúszás, X újratöltés, Y interakció, LB/RB fegyver. Menükben: D-pad/bal kar = fókusz, A = kattintás, B = vissza, Y = kereső.'],
['Beállítások','Mobil irányítás','Bal fél húzás = mozgás, jobb fél = célzás. Mobil irányítás panel: érzékenység, gombméret, átlátszóság, balkezes elrendezés, rezgés, joystick-kijelzés.'],
['Beállítások','Grafika, FPS, hang','F10 Grafika & hang (Alacsony–Ultra), Megjelenítés (FPS-korlát, színvak mód), End = Kényelem (HUD méret, feliratok, érzékenység/FOV).'],
['Beállítások','Angol nyelv','Beállítások → 🌐 Nyelv / Language → ENGLISH. Szótár alapú: a fő lobby-, menü- és HUD-szövegek.'],
['Beállítások','Telepíthető a játék?','Igen (PWA): Egyéb → 📲 Telepítés. Offline is indul vendég módban (a már egyszer betöltött fájlokkal). A szerveres funkciók (chat, felhőmentés) offline nem mennek.'],
['Haladás','Haladás panel (F8)','Prestige Lv30-tól, prémium sáv 30 fokozat, heti küldetések, statisztika, export/import kód, hibajelentés.'],
['Haladás','Napi kihívások, achievementek','Napi 3 kihívás és trófeák (pl. 25 fejlövés, 100 kiesés). A teljesített trófeák a Profilomban jelvényként látszanak.'],
['Gyorsbillentyűk','F-gombok','F1 Súgó · F2 Fegyverek II · F3 AI · F4 Módok · F6 Kaszinó+ · F7 Színpad · F8 Haladás · F9 Világ II · F10 Grafika · End Kényelem · Home Teakert+ · Insert járműfényező · ? billentyű-súgó.'],
['Gyorsbillentyűk','Chat-parancsok','T = chat. /rang, /kit név, /fps, /time, /weather… (fejlesztői parancsok külön).'],
['Betöltés','Mit mutat a betöltőképernyő?','Valódi százalék: a pálya textúráinak letöltése (db/összes), betűtípusok, majd INDULÁS. Közben kattints az érmékre (+150 Ft/db). Kikapcsolható: Lobby+ beállítások.']
];
function helpUI(q){q=q||'';const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
 openM(T('❓ SÚGÓ & GYIK'),'<input type="search" id="kEhq" placeholder="🔎 Keresés a súgóban… (pl. kutya, kontroller, rang)" style="width:100%;box-sizing:border-box" value="'+esc(q)+'"><div id="kEhl" style="margin-top:8px"></div>');
 const draw=()=>{const v=norm($('kEhq').value.trim());const hl=s=>{if(!v)return esc(s);const ns=norm(s);let out='',i=0,j;while((j=ns.indexOf(v,i))>=0){out+=esc(s.slice(i,j))+'<mark>'+esc(s.slice(j,j+v.length))+'</mark>';i=j+v.length}return out+esc(s.slice(i))};
  const L=HELP.filter(h=>!v||norm(h.join(' ')).includes(v));let cat='';
  $('kEhl').innerHTML=L.length?L.map(h=>{const c=h[0]!==cat?'<h3 style="color:#fde047;margin:12px 0 4px;font:17px \'Luckiest Guy\',Impact;font-weight:normal">'+esc(h[0])+'</h3>':'';cat=h[0];return c+'<details'+(v?' open':'')+'><summary>'+hl(h[1])+'</summary><p>'+hl(h[2])+'</p></details>'}).join(''):'<div style="color:#94a3b8">Nincs találat.</div>'};
 $('kEhq').oninput=draw;draw();setTimeout(()=>$('kEhq').focus(),50)}
addEventListener('keydown',e=>{if(e.key==='F1'){e.preventDefault();if(M.classList.contains('on')&&M.querySelector('#kEhq'))closeM();else helpUI()}},true);

// ================= 47: PWA =================
function pwa(){try{if(!document.querySelector('link[rel=manifest]')){const l=document.createElement('link');l.rel='manifest';l.href='manifest.json';document.head.appendChild(l)}
 if(!document.querySelector('meta[name=theme-color]')){const m=document.createElement('meta');m.name='theme-color';m.content='#0b1022';document.head.appendChild(m)}
 if(!document.querySelector('link[rel=apple-touch-icon]')){const a=document.createElement('link');a.rel='apple-touch-icon';a.href='icon192.png';document.head.appendChild(a)}
 if('serviceWorker' in navigator&&/^(https:|http:\/\/(localhost|127\.0\.0\.1))/.test(location.href))navigator.serviceWorker.register('sw.js').then(r=>{const urls=[location.pathname,...[...document.scripts].map(s=>s.src).filter(Boolean)];(r.active||r.installing||r.waiting)&&(r.active||r.installing||r.waiting).postMessage({t:'pre',urls})}).catch(e=>console.warn('SW',e))}catch(e){}}
let deferred=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e});
function pwaUI(){const st=matchMedia('(display-mode: standalone)').matches;openM(T('📲 TELEPÍTÉS (PWA)'),'<div class="card"><p>A Közpénz Royale telepíthető alkalmazásként (asztali ikon, saját ablak). Offline is elindul <b>vendég módban</b> a már egyszer betöltött fájlokkal; a szerveres funkciók (belépés, chat, felhőmentés, ranglisták) csak online mennek.</p>'+
 '<p>Állapot: <b>'+(st?'✅ telepítve, alkalmazásként fut':navigator.serviceWorker&&navigator.serviceWorker.controller?'✅ offline gyorsítótár aktív':'⏳ gyorsítótár előkészítése…')+'</b></p><div class="row"><button class="kb y" id="kEpI">📲 TELEPÍTÉS</button><button class="kb" id="kEpC">🔄 OFFLINE FÁJLOK FRISSÍTÉSE</button></div><small style="color:#94a3b8">Ha a gomb nem működik: böngésző menü → „Alkalmazás telepítése”.</small></div>');
 $('kEpI').onclick=async()=>{if(!deferred)return toast('A böngésző most nem kínál telepítést (lehet, hogy már telepítve van).');deferred.prompt();await deferred.userChoice.catch(()=>0);deferred=null};
 $('kEpC').onclick=()=>{if(navigator.serviceWorker&&navigator.serviceWorker.controller){navigator.serviceWorker.controller.postMessage({t:'pre',urls:[location.pathname,...[...document.scripts].map(s=>s.src).filter(Boolean),...TEXL.map(f=>'tex_opt/'+f)]});toast('🔄 Offline fájlok frissítése elindult.')}else toast('A service worker még nem aktív – töltsd újra az oldalt.')}}
pwa();

// ================= Lobby+ beállítások =================
function setUI(){const chk=(k,n)=>'<div class="row"><span>'+n+'</span><input type="checkbox" data-k="'+k+'" '+(SET[k]?'checked':'')+'></div>';
 openM(T('🧭 LOBBY+ BEÁLLÍTÁSOK'),'<div class="card">'+chk('bg','🌗 Napszakos lobby-háttér (valós idő)')+'<div class="row"><span>Napszak kényszerítése (teszt)</span><select id="kEhr"><option value="">valós idő</option>'+[6,9,12,17,19,22,2].map(h=>'<option value="'+h+'" '+(LS.g('k3EHour',null)===h?'selected':'')+'>'+h+':00</option>').join('')+'</select></div>'+
 chk('ent','🔥 Rang szerinti belépő animáció')+'<div class="row"><span></span><button class="kb" id="kEent">▶ BELÉPŐ LEJÁTSZÁSA</button></div>'+chk('load','⏳ Új betöltőképernyő (valódi %)')+chk('gp','🎮 Kontroller a menükben')+'</div>');
 M.querySelectorAll('[data-k]').forEach(c=>c.onchange=()=>{SET[c.dataset.k]=c.checked?1:0;saveSet()});
 $('kEhr').onchange=e=>LS.s('k3EHour',e.target.value===''?null:+e.target.value);$('kEent').onclick=()=>{closeM();entrance(true)}}
function gpUI(){const p=navigator.getGamepads?[...navigator.getGamepads()].find(x=>x):null;openM(T('🎮 KONTROLLER'),'<div class="card"><p>Állapot: <b>'+(p?esc(p.id.slice(0,50)):'nincs csatlakoztatva (nyomj meg egy gombot rajta)')+'</b></p><p><b>Menükben:</b> D-pad / bal kar = fókusz mozgatása (sárga keret) · A = kattintás · B = vissza/bezár · Y = lobby-kereső · jobb kar = görgetés.</p><p><b>Meccsben:</b> bal kar mozgás · jobb kar nézés · RT lövés · A ugrás · B csúszás · X újratöltés · Y interakció · LB/RB fegyverváltás · LT ping · Start szünet · Back térkép.</p><div class="row"><span>Menü-navigáció</span><input type="checkbox" id="kEgp" '+(SET.gp?'checked':'')+'></div></div>');$('kEgp').onchange=e=>{SET.gp=e.target.checked?1:0;saveSet()}}

// ================= lobby2 menüpontok =================
const ITEMS=[['👤','Profilom','prog',profile,'profil statisztika kedvenc fegyver jelvény rang'],['🧍','Karakter-előnézet','cust',openPreview,'karakter forgatás nagyítás skin'],['❓','Súgó & GYIK','etc',()=>helpUI(),'súgó gyik help segítség f1'],
 ['🌐','Nyelv / Language','set',langUI,'nyelv angol english language'],['⌨️','Billentyű-profilok','set',kbUI,'billentyű kiosztás profil irányítás'],['📱','Mobil irányítás','set',mobUI,'mobil érintés touch célzás'],['🎮','Kontroller a menükben','set',gpUI,'kontroller gamepad'],
 ['🧭','Lobby+ beállítások','set',setUI,'háttér napszak belépő animáció betöltés'],['📲','Telepítés (PWA)','etc',pwaUI,'telepítés offline app pwa']];
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}ITEMS.forEach(([ic,hu,c,fn,kw])=>_lb2.add({ic,hu,tx:T(hu),c,fn,kw}))})();
if(lang==='en')setTimeout(()=>setLang('en'),800);

window._kE={openM,closeM,profile,openPreview,entrance,helpUI,langUI,kbUI,mobUI,gpUI,pwaUI,setUI,setLang,T,showLoad,SET,MOB,HELP,EN,get lang(){return lang}};
})();
