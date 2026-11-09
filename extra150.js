// extra150.js – 1 🩹 újraélesztés E nyomva (x13a bot-társ) + a botok téged is felélesztenek · 2 🔄 fegyverváltás/újratöltés animáció
// 3 ⚽ VSport statisztika + menedzser mód (_VS2.DB/TM) · 4 🎡 kaszinó-statisztika + rulett hot/cold · 5 🐕 4 ritka kutyafajta + kutyaszettek (pets.js)
// Mentés: k3x150cs, k3x150vs, k3x150mgr, k3x150dog. Csak játékbeli pénz. Debug: _x150
(function(){
'use strict';
const $=id=>document.getElementById(id);
const LS={g:(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?d:v}catch(e){return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU');
const inMatch=()=>typeof G!=='undefined'&&G&&!G.over&&G.phase==='play';
const hasS=()=>typeof S!=='undefined'&&S;const cash=()=>Math.round((hasS()&&S.c)||0);
const pay=d=>{if(!hasS())return;S.c=(S.c||0)+d;try{save()}catch(e){}};
function toast(t){try{if(inMatch()&&typeof say==='function'){say(t);return}}catch(e){}let el=$('x150T');if(!el){el=document.createElement('div');el.id='x150T';document.body.appendChild(el)}el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2600)}
const X={ehold:false,dn:null,gun:null,dy:0,rx:0,rz:0,swT:0,lastWp:null,rl:0,gref:null};window._x150=X;

// ---------- CSS ----------
const st=document.createElement('style');st.textContent=`
#x150T{position:fixed;left:50%;top:80px;transform:translateX(-50%);z-index:100001;background:#111827ee;color:#fff;font:700 14px system-ui;padding:9px 16px;border-radius:12px;border:1px solid #facc1588;opacity:0;transition:opacity .25s;pointer-events:none}#x150T.on{opacity:1}
#x150D{position:fixed;left:50%;top:58%;transform:translateX(-50%);z-index:31;pointer-events:none;font:700 15px system-ui;color:#fff;background:linear-gradient(135deg,#7f1d1dcc,#3b0764cc);border:1px solid #f8717188;border-radius:12px;padding:8px 14px;display:none;text-align:center}
#x150D u{display:block;height:6px;margin-top:5px;border-radius:4px;background:linear-gradient(90deg,#f87171,#34d399);width:0;text-decoration:none}
#x150M{position:fixed;inset:0;z-index:99990;background:#000a;display:none;align-items:center;justify-content:center;font:14px system-ui;color:#e5e7eb}#x150M.on{display:flex}
#x150M .bx{width:min(880px,94vw);max-height:88vh;overflow:auto;background:linear-gradient(160deg,#0f172a,#1e1b4b);border:1px solid #6366f155;border-radius:16px;padding:16px 18px;box-shadow:0 20px 60px #000c}
#x150M h2{margin:0 0 10px;font:800 20px system-ui;color:#facc15;display:flex;justify-content:space-between;align-items:center}
#x150M .tb{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}#x150M .tb button,#x150M .b{background:#312e81;color:#fff;border:1px solid #6366f188;border-radius:9px;padding:6px 11px;cursor:pointer;font:700 13px system-ui}
#x150M .tb button.on{background:#facc15;color:#111}#x150M .b:disabled{opacity:.45;cursor:default}#x150M .b.g{background:#15803d}
#x150M table{width:100%;border-collapse:collapse;font-size:13px}#x150M td,#x150M th{padding:4px 6px;border-bottom:1px solid #ffffff12;text-align:left}#x150M tr.me{background:#facc1522}
#x150M .card{background:#ffffff0d;border:1px solid #ffffff1a;border-radius:12px;padding:10px;margin:6px 0}
#x150M .f{display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:5px;font:800 11px system-ui;margin-right:2px}
#x150M .fW{background:#16a34a}#x150M .fD{background:#64748b}#x150M .fL{background:#dc2626}
#x150M .num{display:inline-block;min-width:26px;padding:3px 5px;margin:2px;border-radius:6px;text-align:center;font-weight:800}
#x150M .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}
#x150M select{background:#1e293b;color:#fff;border:1px solid #475569;border-radius:8px;padding:5px}
`;document.head.appendChild(st);
const DN=document.createElement('div');DN.id='x150D';document.body.appendChild(DN);

// ================= 1: ÚJRAÉLESZTÉS =================
addEventListener('keydown',e=>{if(e.code==='KeyE'&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)))X.ehold=true},true);
addEventListener('keyup',e=>{if(e.code==='KeyE')X.ehold=false},true);
addEventListener('blur',()=>{X.ehold=false});
const A13=()=>window._x13a||null;
if(typeof window.hurt==='function'){const oH=window.hurt;window.hurt=function(d,storm){const r=oH.apply(this,arguments);try{const g=G,a=A13();
 if(g&&g.hp<=0&&!storm&&!g._x150used&&a&&a.ally){g._x150used=1;g.hp=1;g.sh=0;g._x150dn={t:3,x:g.x,z:g.z};g.ef.push({k:'inv',t:3.6});toast('🩹 LENT VAGY! A társad rohan felsegíteni…')}
 else if(g&&g._x150dn&&g.hp<1&&!storm)g.hp=1}catch(e){}return r}}

// ================= 2: FEGYVERANIMÁCIÓ (+1 update csomagoló) =================
function unAnim(){const o=X.gun;if(!o)return;o.position.y+=X.dy;o.rotation.x-=X.rx;o.rotation.z-=X.rz;X.dy=X.rx=X.rz=0;X.gun=null}
const oU=window.update;
window.update=function(dt){const g=typeof G!=='undefined'?G:null;const d=Math.min(.1,dt||.016);
 if(g!==X.gref){X.gref=g;X.lastWp=g?g.wp:null;X.swT=0;X.rl=0;DN.style.display='none'}
 unAnim();
 const r=oU.apply(this,arguments);
 if(!g||g.over||g.phase!=='play'){DN.style.display='none';return r}
 try{revive(g,d)}catch(e){console.error('x150 rev',e)}
 try{anim(g,d)}catch(e){}
 return r};
function revive(g,d){const a=A13();
 // a) te élesztesz: x13a 3 mp-es álló élesztését E-nyomvatartáshoz kötjük
 if(a&&a.rev){const R=a.rev,dd=Math.hypot(R.x-g.x,R.z-g.z);if(dd<3){const rv=$('x13aRv');
  if(!X.ehold){R.pr=Math.max(0,R.pr-d/3);if(rv){rv.style.display='block';rv.innerHTML='🩹 Tartsd nyomva az <b>E</b>-t a felélesztéshez <u style="width:'+Math.round(R.pr*100)+'%"></u>'}}
  else if(rv&&rv.style.display==='block'){rv.innerHTML='🩹 Újraélesztés (E)... <u style="width:'+Math.round(R.pr*100)+'%"></u>'}}}
 // b) téged élesztenek
 const D=g._x150dn;if(!D){DN.style.display='none';return}
 g.x=D.x;g.z=D.z;g.cd=Math.max(g.cd||0,.3);
 if(a&&a.ally){const A=a.ally,dx=g.x-A.x,dz=g.z-A.z,q=Math.hypot(dx,dz);if(q>1.6){A.x+=dx/q*10*d;A.z+=dz/q*10*d}}
 const near=a&&a.ally?Math.hypot(a.ally.x-g.x,a.ally.z-g.z)<2.2:true;
 if(near)D.t-=d;g.ef=g.ef.filter(x=>x.k!=='inv'||x.t>0);if(!g.ef.some(x=>x.k==='inv'))g.ef.push({k:'inv',t:.5});
 DN.style.display='block';DN.innerHTML=(near?'🤝 A társad felélesztett…':'🆘 LENT VAGY – a társad jön')+'<u style="width:'+Math.round((1-D.t/3)*100)+'%"></u>';
 if(D.t<=0){g._x150dn=null;g.hp=Math.round((g.mhp||100)*.4);DN.style.display='none';toast('💚 Felálltál! ('+g.hp+' HP) – a társad megmentett');try{sfx('buy')}catch(e){}}}
function anim(g,d){const gun=g.gun;if(!gun||!g.fp)return;
 if(g.wp!==X.lastWp){X.lastWp=g.wp;X.swT=.25}
 X.swT=Math.max(0,X.swT-d);X.rl+=((g.reloading>0?1:0)-X.rl)*Math.min(1,d*10);
 let dy=0;if(X.swT>0){const p=1-X.swT/.25;dy=(p<.5?p*2:(1-p)*2)*.35}
 X.gun=gun;X.dy=dy;X.rx=X.rl*.35;X.rz=X.rl*.55;gun.position.y-=dy;gun.rotation.x+=X.rx;gun.rotation.z+=X.rz}

// ================= 3: VSPORT STAT + MENEDZSER =================
const VS=()=>window._VS2&&window._VS2.DB&&window._VS2.TM?window._VS2:null;
const VH=LS.g('k3x150vs',{last:0,r:[]});// r: [{n:rno,s:season,k:[rang tömb csapatindexenként]}]
const MG=LS.g('k3x150mgr',{team:-1,lvl:0,pl:[],tr:-1,earn:0,rounds:0});
const pts=t=>t.w*3+t.d;
function ranks(){const V=VS();const DB=V.DB,TM=V.TM,out=[];for(let lg=0;lg<3;lg++){const ids=TM.map((t,i)=>i).filter(i=>(TM[i][3]|0)===lg);
 ids.sort((a,b)=>pts(DB.tab[b])-pts(DB.tab[a])||(DB.tab[b].gf-DB.tab[b].ga)-(DB.tab[a].gf-DB.tab[a].ga)||DB.tab[b].gf-DB.tab[a].gf);ids.forEach((id,k)=>out[id]=k+1)}return out}
function vsPoll(){const V=VS();if(!V)return;const C=V.CUR,DB=V.DB;if(!C||C.state!=='done'||VH.last===DB.rno)return;VH.last=DB.rno;
 VH.r.push({n:DB.rno,s:DB.season,k:ranks()});if(VH.r.length>40)VH.r.shift();LS.s('k3x150vs',VH);
 if(MG.team>=0){const m=C.ms&&C.ms.find(x=>x.h===MG.team||x.a===MG.team);if(m&&m.st){const me=m.h===MG.team?m.st.h:m.st.a,op=m.h===MG.team?m.st.a:m.st.h;
  const pr=me>op?8000+MG.lvl*1500:me===op?2500:0;MG.rounds++;MG.earn+=pr;if(pr)pay(pr);LS.s('k3x150mgr',MG);
  toast('⚽ Menedzser: '+V.TM[MG.team][0]+' '+me+'–'+op+(pr?' · +'+fmt(pr)+' Ft':''))}}}
setInterval(()=>{try{vsPoll()}catch(e){}},2000);
const PLAYERS=[['Ifjúsági tehetség',40000,1.2],['Rutinos középpályás',120000,2.5],['Gólvágó csatár',300000,4],['Sztárigazolás',700000,6.5]];
const NAMES=['Kovács B.','Szép Á.','Major L.','Fodor K.','Vadas P.','Bodnár I.','Lakatos Z.','Somogyi T.','Kerekes D.','Gál M.','Pintér R.','Hegyi O.'];
function vsHtml(sel){const V=VS();if(!V)return'<div class="card">A VSport még nem töltött be.</div>';const DB=V.DB,TM=V.TM;
 const t=sel==null?(MG.team>=0?MG.team:0):sel;const T=DB.tab[t],rk=ranks();
 let h='<div class="card">Csapat: <select id="x150vsSel">'+TM.map((x,i)=>'<option value="'+i+'"'+(i===t?' selected':'')+'>'+['🏛️','🏗️','📺'][x[3]|0]+' '+x[0]+'</option>').join('')+'</select></div>';
 h+='<div class="grid"><div class="card"><b style="color:'+TM[t][2]+'">'+TM[t][0]+'</b><br>Erősség: <b>'+Math.round(DB.str[t])+'</b> · Helyezés: <b>'+rk[t]+'.</b><br>Pont: '+pts(T)+' ('+T.w+'Gy '+T.d+'D '+T.l+'V)<br>Gólok: '+T.gf+' – '+T.ga+' (GK '+(T.gf-T.ga>0?'+':'')+(T.gf-T.ga)+')<br>Gól/meccs: '+(T.p?(T.gf/T.p).toFixed(2):'–')+'</div>';
 h+='<div class="card">Forma (utolsó):<br>'+((T.form||[]).slice(-8).map(f=>'<span class="f f'+f+'">'+({W:'GY',D:'D',L:'V'})[f]+'</span>').join('')||'még nincs meccs')+'</div></div>';
 h+='<div class="card">📈 Tabella-történet (helyezés fordulónként)<br><canvas id="x150vsC" width="800" height="160" style="width:100%;height:160px"></canvas></div>';
 // menedzser
 h+='<div class="card"><b>👔 MENEDZSER MÓD</b> · Pénzed: <b>'+fmt(cash())+' Ft</b><br>';
 if(MG.team<0)h+='Még nincs csapatod. <button class="b g" data-a="pick">Ezt a csapatot választom</button>';
 else{const mt=MG.team;h+='Csapatod: <b style="color:'+TM[mt][2]+'">'+TM[mt][0]+'</b> · erősség <b>'+Math.round(DB.str[mt])+'</b>/92 · edzői szint '+MG.lvl+' · fordulók: '+MG.rounds+' · meccspénz összesen: '+fmt(MG.earn)+' Ft'+(mt!==t?' <button class="b" data-a="pick">Csapatváltás erre</button>':'')+
  '<br><small>Győzelem: +'+fmt(8000+MG.lvl*1500)+' Ft, döntetlen: +2 500 Ft. Az erősség a szimulált meccsekre és az oddsokra hat.</small><div class="grid" style="margin-top:6px">'+
  PLAYERS.map((p,i)=>'<div class="card">🧍 '+p[0]+'<br>+'+p[2]+' erősség<br><button class="b g" data-a="buy" data-i="'+i+'"'+(cash()<p[1]||DB.str[mt]>=92?' disabled':'')+'>Igazolás: '+fmt(p[1])+' Ft</button></div>').join('')+
  '<div class="card">🏋️ Edzés (fordulónként 1×)<br>+0,8 erősség, +1 edzői szint<br><button class="b g" data-a="train"'+(MG.tr===DB.rno||cash()<25000?' disabled':'')+'>Edzés: 25 000 Ft</button></div></div>'+
  (MG.pl.length?'<small>Kerethez igazolva: '+MG.pl.slice(-8).join(', ')+'</small>':'')}
 return h+'</div>'}
function vsDraw(t){const c=$('x150vsC'),V=VS();if(!c||!V)return;const x=c.getContext('2d');x.clearRect(0,0,800,160);const n=V.TM.filter(q=>(q[3]|0)===(V.TM[t][3]|0)).length;
 const R=VH.r.slice(-30);x.strokeStyle='#ffffff22';for(let i=1;i<=n;i+=3){const y=10+(i-1)/(n-1)*140;x.beginPath();x.moveTo(30,y);x.lineTo(790,y);x.stroke();x.fillStyle='#94a3b8';x.font='11px system-ui';x.fillText(i+'.',4,y+4)}
 if(R.length<1){x.fillStyle='#94a3b8';x.fillText('Még nincs lezárt forduló – nézz vissza egy forduló után!',40,85);return}
 x.strokeStyle=V.TM[t][2];x.lineWidth=3;x.beginPath();R.forEach((r,i)=>{const px=30+(R.length===1?380:i/(R.length-1)*760),py=10+((r.k[t]||1)-1)/(n-1)*140;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
 R.forEach((r,i)=>{const px=30+(R.length===1?380:i/(R.length-1)*760),py=10+((r.k[t]||1)-1)/(n-1)*140;x.fillStyle='#fff';x.beginPath();x.arc(px,py,3,0,7);x.fill()})}
let vsSel=null;
function vsAct(a,i){const V=VS();if(!V)return;const DB=V.DB;
 if(a==='pick'){MG.team=vsSel==null?0:vsSel;toast('👔 Mostantól a(z) '+V.TM[MG.team][0]+' menedzsere vagy!')}
 if(a==='buy'){const p=PLAYERS[i];if(cash()<p[1])return;pay(-p[1]);DB.str[MG.team]=Math.min(92,DB.str[MG.team]+p[2]);MG.pl.push(NAMES[Math.random()*NAMES.length|0]+' ('+p[0]+')');toast('✍️ Igazolás kész! +'+p[2]+' erősség')}
 if(a==='train'){if(cash()<25000||MG.tr===DB.rno)return;pay(-25000);MG.tr=DB.rno;MG.lvl++;DB.str[MG.team]=Math.min(92,DB.str[MG.team]+.8);toast('🏋️ Edzés kész! Edzői szint: '+MG.lvl)}
 LS.s('k3x150mgr',MG);try{localStorage.setItem('vs2',JSON.stringify(DB))}catch(e){}render()}

// ================= 4: KASZINÓ-STATISZTIKA =================
const CS=LS.g('k3x150cs',{g:{},rh:[]});const saveCS=()=>LS.s('k3x150cs',CS);
const vis=el=>el&&el.offsetParent!==null&&getComputedStyle(el).display!=='none';
function curGame(){const c=$('csn');if(c&&c.classList.contains('on')){const t=c.querySelector('.tab.on');return t&&t.dataset.g==='b'?'🃏 Blackjack (kaszinó)':'🎡 Rulett'}
 const m=$('x14dM');if(m&&m.classList.contains('on')){const t=m.querySelector('.x14dTb.on,.on button,button.on');return '🎰 Kaszinó+ · '+(t?t.textContent.trim().slice(0,22):'egyéb')}
 const p=$('x10M');if(vis(p)){const h=p.querySelector('h2');return h?h.textContent.trim().slice(0,22):'🃏 Póker/nyerőgép'}return null}
let lz=null,lf=null,lMsg='';
setInterval(()=>{try{const z=Math.round((window.BR&&BR.zs)||0),f=cash();const gm=curGame();
 if(gm&&lz!=null){const dz=z-lz,df=f-lf;[['🪙',dz],['Ft',df]].forEach(([u,v])=>{if(!v)return;const k=gm+'|'+u,o=CS.g[k]||(CS.g[k]={w:0,l:0,n:0});if(v>0)o.w+=v;else{o.l-=v;o.n++}});if(dz||df)saveCS()}
 lz=z;lf=f;
 const rm=$('rMsg');if(rm){const t=rm.textContent;if(t!==lMsg){lMsg=t;const mm=/^(\d+) (ZÖLD|PIROS|FEKETE)/.exec(t);if(mm){CS.rh.push(+mm[1]);if(CS.rh.length>300)CS.rh.shift();saveCS()}}}}catch(e){}},300);
const RED=new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const numS=n=>'<span class="num" style="background:'+(n===0?'#0f8a4c':RED.has(n)?'#b3121f':'#141414')+'">'+n+'</span>';
function csHtml(){let h='<div class="card"><b>Játékonként</b> (a figyelés a játékablak nyitva tartásakor méri a tét/nyeremény mozgását)<table><tr><th>Játék</th><th>Nyert</th><th>Vesztett</th><th>Mérleg</th><th>Tétek</th></tr>';
 const ks=Object.keys(CS.g);if(!ks.length)h+='<tr><td colspan="5">Még nincs adat – játssz a kaszinóban!</td></tr>';
 ks.forEach(k=>{const[g,u]=k.split('|'),o=CS.g[k],b=o.w-o.l;h+='<tr><td>'+g+'</td><td style="color:#4ade80">+'+fmt(o.w)+' '+u+'</td><td style="color:#f87171">−'+fmt(o.l)+' '+u+'</td><td style="color:'+(b>=0?'#4ade80':'#f87171')+'">'+(b>=0?'+':'')+fmt(b)+' '+u+'</td><td>'+o.n+'</td></tr>'});
 h+='</table></div>';const R=CS.rh.slice(-200);
 if(R.length){const cnt=Array(37).fill(0);R.forEach(n=>cnt[n]++);const ord=cnt.map((c,n)=>[n,c]);const hot=ord.slice().sort((a,b)=>b[1]-a[1]).slice(0,6),cold=ord.slice().sort((a,b)=>a[1]-b[1]).slice(0,6);
  const red=R.filter(n=>RED.has(n)).length,zero=R.filter(n=>!n).length;
  h+='<div class="card"><b>🎡 Rulett</b> – utolsó '+R.length+' pörgetés<br>🔥 Hot: '+hot.map(([n,c])=>numS(n)+'<small>'+c+'×</small>').join(' ')+'<br>❄️ Cold: '+cold.map(([n,c])=>numS(n)+'<small>'+c+'×</small>').join(' ')+
   '<br>Piros '+Math.round(red/R.length*100)+'% · Fekete '+Math.round((R.length-red-zero)/R.length*100)+'% · Zöld '+Math.round(zero/R.length*100)+'%<br>Legutóbbiak: '+R.slice(-15).reverse().map(numS).join('')+'<br><small>Minden pörgetés független – a hot/cold csak érdekesség, nem jóslat.</small></div>'}
 else h+='<div class="card">🎡 Rulett: még nincs pörgetés rögzítve.</div>';
 const L=LS.g('k3x10lim',null);if(L)h+='<div class="card">🛑 Közös napi veszteséghatár: '+fmt(L.lost||0)+' / '+fmt(L.lim||0)+' (változatlanul érvényes minden kaszinójátékra)</div>';
 return h+'<button class="b" data-a="csreset">Statisztika törlése</button>'}

// ================= 5: RITKA KUTYÁK + SZETTEK =================
const RARE=[{id:'x150arany',n:'✨ Aranyszőrű Agár',p:0,c:0xf5c542,c2:0xfff1b8,nose:0x3b2414,sz:.95,len:1.4,leg:1.25,ear:'flop',tail:'thin',belly:1,desc:'Csillogó, villámgyors, ritka.'},
 {id:'x150kris',n:'💎 Kristály Kuvasz',p:0,c:0xdbeafe,c2:0xa5f3fc,nose:0x1e3a8a,sz:1.2,len:1.1,leg:1,ear:'flop',tail:'fluffy',eye:0x22d3ee,desc:'Jégkék bunda, hideg tekintet.'},
 {id:'x150lava',n:'🌋 Lávatacskó',p:0,c:0x7f1d1d,c2:0xf97316,nose:0x111,sz:.8,len:1.55,leg:.48,ear:'long',tail:'thin',spots:1,eye:0xfacc15,desc:'Forró kolbászkutya a vulkánból.'},
 {id:'x150csill',n:'🌌 Csillagpuli',p:0,c:0x312e81,c2:0xc4b5fd,nose:0x111,sz:.9,len:.95,leg:.75,ear:'hide',tail:'curl',fur:'cord',desc:'Rasztái közt csillagok ragyognak.'}];
const DG=LS.g('k3x150dog',{eggs:0});
function petsReg(){const P=window._PETS;if(!P||!P.BY)return null;RARE.forEach(b=>{if(!P.BY[b.id])P.BY[b.id]=b});return P}
setTimeout(petsReg,500);setInterval(petsReg,5000);
function giveRare(src){const P=petsReg();if(!P)return null;const left=RARE.filter(b=>!P.P.breeds[b.id]);if(!left.length)return null;const b=left[Math.random()*left.length|0];P.P.breeds[b.id]=1;try{P.save()}catch(e){}toast('🐕 RITKA KUTYA ('+src+'): '+b.n+'!');return b}
const SETS=[{n:'👑 Arany parádé',it:['cap_0','collar_0'],p:4500},{n:'❄️ Téli kendős',it:['beanie_2','scarf_2'],p:3000},{n:'🎉 Bulikutya',it:['party_1','bow_1'],p:2500},{n:'🤠 Cowboy kendővel',it:['cowboy_4','scarf_1'],p:3500},{n:'🖤 Éjféli',it:['top_4','chain_4'],p:6000}];
const ITN=id=>{const P=window._PETS;const i=P&&P.ITEMS.find(x=>x.id===id);return i?i.n:id};
function dogHtml(){const P=petsReg();if(!P)return'<div class="card">A kutyák (pets.js) még nem töltöttek be.</div>';
 let h='<div class="card">Ritka fajták: meccs végén 4% eséllyel, vagy 🥚 ritka tojásból (12% esély) szerezhetők. Pénzed: <b>'+fmt(cash())+' Ft</b> · nyitott tojások: '+DG.eggs+'<br><button class="b g" data-a="egg"'+(cash()<20000?' disabled':'')+'>🥚 Ritka tojás: 20 000 Ft</button></div><div class="grid">';
 RARE.forEach(b=>{const own=P.P.breeds[b.id],on=P.P.breed===b.id;h+='<div class="card"><b>'+b.n+'</b><br><small>'+b.desc+'</small><br>'+(own?(on?'✅ Aktív':'<button class="b g" data-a="use" data-i="'+b.id+'">Kiválaszt</button>'):'🔒 Még nincs meg')+'</div>'});
 h+='</div><div class="card"><b>🎀 Kutyaszettek</b> (nyakörv / kendő / sapka – a pets.js kiegészítőiből, egyben felveszi)</div><div class="grid">';
 SETS.forEach((s,i)=>{const own=s.it.every(id=>P.P.own[id]);h+='<div class="card"><b>'+s.n+'</b><br><small>'+s.it.map(ITN).join(' + ')+'</small><br><button class="b g" data-a="set" data-i="'+i+'"'+(!own&&cash()<s.p?' disabled':'')+'>'+(own?'Felvesz':'Megvesz: '+fmt(s.p)+' Ft')+'</button></div>'});
 return h+'</div>'}
function dogAct(a,i){const P=petsReg();if(!P)return;
 if(a==='egg'){if(cash()<20000)return;pay(-20000);DG.eggs++;LS.s('k3x150dog',DG);if(Math.random()<.12&&giveRare('tojás'));else{pay(6000);toast('🥚 Sima tojás volt… 6 000 Ft vigaszdíj')}}
 if(a==='use'){P.P.breed=i;try{P.save();P.refreshLobby()}catch(e){}toast('🐕 Aktív kutya: '+P.BY[i].n)}
 if(a==='set'){const s=SETS[i];const own=s.it.every(id=>P.P.own[id]);if(!own){if(cash()<s.p)return;pay(-s.p);s.it.forEach(id=>P.P.own[id]=1)}
  s.it.forEach(id=>{const it=P.ITEMS.find(x=>x.id===id);if(it)P.P.eq[it.slot]=id});try{P.save();P.refreshLobby()}catch(e){}toast('🎀 Szett felvéve: '+s.n)}
 render()}
if(typeof window.end==='function'){const oE=window.end;window.end=function(){const g=typeof G!=='undefined'?G:null,was=g&&!g.over;const r=oE.apply(this,arguments);try{if(was&&Math.random()<.04)setTimeout(()=>giveRare('meccs-esemény'),1500)}catch(e){}return r}}

// ================= PANEL + x14hub gombok =================
const M=document.createElement('div');M.id='x150M';M.innerHTML='<div class="bx"><h2><span id="x150Ti"></span><button class="b" data-a="close">✕</button></h2><div class="tb"><button data-t="vs">⚽ VSport stat & menedzser</button><button data-t="cs">🎡 Kaszinó-statisztika</button><button data-t="dog">🐕 Ritka kutyák & szettek</button></div><div id="x150B"></div></div>';document.body.appendChild(M);
let tab='vs';const TT={vs:'⚽ VSPORT STATISZTIKA',cs:'🎡 KASZINÓ-STATISZTIKA',dog:'🐕 RITKA KUTYÁK'};
function render(){$('x150Ti').textContent=TT[tab];M.querySelectorAll('.tb button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));const B=$('x150B');
 if(tab==='vs'){B.innerHTML=vsHtml(vsSel);const s=$('x150vsSel');if(s){vsSel=+s.value;s.onchange=()=>{vsSel=+s.value;render()};vsDraw(vsSel)}}
 else if(tab==='cs')B.innerHTML=csHtml();else B.innerHTML=dogHtml()}
M.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t){tab=t.dataset.t;render();return}const b=e.target.closest('[data-a]');if(!b){if(e.target===M)M.classList.remove('on');return}
 const a=b.dataset.a,i=b.dataset.i;if(a==='close')M.classList.remove('on');else if(a==='csreset'){CS.g={};CS.rh=[];saveCS();render()}else if(['pick','buy','train'].includes(a))vsAct(a,+i);else dogAct(a,isNaN(+i)?i:+i)});
addEventListener('keydown',e=>{if(e.key==='Escape'&&M.classList.contains('on'))M.classList.remove('on')});
function open(t){tab=t||tab;M.classList.add('on');render()}
const BTNS=[['x150vsBtn','⚽ VSPORT MENEDZSER','vs'],['x150csBtn','🎡 KASZINÓ STAT','cs'],['x150dogBtn','🐕 RITKA KUTYÁK','dog']];
function btn(){let h=$('x14hub');if(!h){h=document.createElement('div');h.id='x14hub';h.style.cssText='position:fixed;right:12px;top:50%;transform:translateY(-50%);z-index:9;display:flex;flex-direction:column;gap:6px';document.body.appendChild(h)}
 BTNS.forEach(([id,t,k])=>{let b=$(id);if(!b){b=document.createElement('button');b.id=id;b.textContent=t;b.onclick=()=>open(k);h.appendChild(b)}b.style.display=inMatch()?'none':''})}
setInterval(btn,700);
X.open=open;X.giveRare=giveRare;X.CS=CS;X.MG=MG;X.VH=VH;
})();
