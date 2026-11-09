// ===== KÖZÖSSÉG & LOBBY: 31 zenegép-szavazás · 32 barát-ajándék · 33 csapatfotó · 34 hírfal · 35 néző mód · 36 edzőpálya =====
(function(){
const $$=i=>document.getElementById(i);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=()=>window.KR,ACC=()=>window.KR?KR.acc():{},logged=()=>{const a=ACC();return a&&a.user&&!a.guest&&a.ws&&a.ws.readyState===1};
const inParty=()=>{const a=ACC();return a&&a.party&&(a.party.members||[]).length>1};
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const ago=t=>{const s=Math.round((Date.now()-t)/1000);return s<60?'most':s<3600?Math.floor(s/60)+' perce':s<86400?Math.floor(s/3600)+' órája':Math.floor(s/86400)+' napja'};
const css=document.createElement('style');css.textContent=`
#soDock{position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:9;display:none;gap:5px;padding:5px;border-radius:16px;background:#0b1022cc;border:1px solid #ffffff22;backdrop-filter:blur(6px);box-shadow:0 8px 24px #000a}
#soDock button{border:0;border-radius:10px;padding:7px 9px;font:13px 'Luckiest Guy',Impact;color:#fff;cursor:pointer;background:linear-gradient(#334155,#1e293b);position:relative;white-space:nowrap}
#soDock button:hover{filter:brightness(1.25);transform:translateY(-2px)}#soDock button.hot{background:linear-gradient(#a855f7,#6d28d9)}#soDock button.gold{background:linear-gradient(#fde68a,#f59e0b);color:#1c1300}
#soDock button i{position:absolute;top:-6px;right:-6px;background:#ef4444;border-radius:999px;font:700 11px Rajdhani;padding:1px 6px;font-style:normal}
#soVote{position:fixed;right:18px;top:120px;z-index:12;width:290px;background:#0b1022f2;border:2px solid #a855f7;border-radius:16px;padding:12px;color:#fff;font-family:Rajdhani;box-shadow:0 10px 30px #000;display:none}
#soVote h4{margin:0 0 6px;font:18px 'Luckiest Guy',Impact;color:#d8b4fe}#soVote button{display:flex;justify-content:space-between;width:100%;margin:4px 0;padding:8px 10px;border:1px solid #ffffff22;border-radius:10px;background:#1e1b4b;color:#fff;font:700 15px Rajdhani;cursor:pointer}#soVote button.me{border-color:#facc15;background:#3b2f00}
#soCd{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;font:160px 'Luckiest Guy',Impact;color:#fff;text-shadow:0 8px 0 #000,0 0 40px #000;pointer-events:none}
#soFl{position:fixed;inset:0;z-index:51;background:#fff;opacity:0;pointer-events:none;transition:opacity .4s}
#spOv{position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:30;display:none;align-items:center;gap:10px;padding:8px 14px;border-radius:14px;background:#000c;border:1px solid #ffffff33;color:#fff;font:700 16px Rajdhani}
#spOv b{color:#facc15}#spOv button{border:0;border-radius:9px;padding:7px 11px;font:15px 'Luckiest Guy',Impact;cursor:pointer}
#trHud{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:3;display:none;gap:8px;font:16px 'Luckiest Guy',Impact;pointer-events:none;text-shadow:0 2px 0 #000;color:#fff}#trHud span{background:#0b1022cc;border:1px solid #ffffff22;border-radius:10px;padding:5px 12px}
#trHelp{position:absolute;left:14px;top:130px;z-index:3;display:none;background:#0b1022cc;border:1px solid #ffffff22;border-radius:12px;padding:10px 12px;font:600 14px Rajdhani;color:#e2e8f0;pointer-events:none;line-height:1.5}`;document.head.appendChild(css);
// ---------- dokk ----------
const dock=document.createElement('div');dock.id='soDock';dock.innerHTML='<button class="hot" id="soCs">🫖 KÖZÖSSÉGI TÉR</button><button id="soTr">🎯 EDZŐPÁLYA</button><button id="soNews">📰 HÍREK</button><button id="soGift">🎁 AJÁNDÉK<i id="soGiftN" style="display:none"></i></button><button id="soPh">📸 CSAPATFOTÓ</button><button id="soJb">🗳️ ZENEGÉP</button><button class="gold" id="soWh">🎡 KERÉK</button>';document.body.appendChild(dock);
setInterval(()=>{const lb=$$('lb');const vis=lb&&lb.classList.contains('on')&&!(typeof run!=='undefined'&&run)&&!document.body.classList.contains('xph')&&!document.querySelector('#cs.on,#vs2.on,#pets.on,#outf.on');dock.style.display=vis?'flex':'none';const wb=$$('xWheelB');if(wb)wb.style.visibility='hidden'},500);
$$('soWh').onclick=()=>{const wb=$$('xWheelB');if(wb)wb.click()};
$$('soCs').onclick=()=>{if(window.openCommunity)openCommunity()};
// ---------- 34: hírfal ----------
$$('soNews').onclick=async()=>{if(!logged()){guiOpen('<h1 class="f" style="font-size:30px">📰 BARÁT-HÍREK</h1><div style="color:#cbd5e1;margin:10px">A hírfalhoz jelentkezz be – itt látod a barátaid friss eredményeit.</div>'+bB('VISSZA','guiClose()','r'));return}
 guiOpen('<h1 class="f" style="font-size:30px">📰 BARÁT-HÍREK</h1><div id="soNL" style="color:#cbd5e1">Betöltés…</div>'+bB('VISSZA','guiClose()','r'));
 try{const r=await K().api('/api/feed');const MN={royale:'Battle Royale',stw:'Mentsd meg a világot',flakon:'Flakonvadászat',train:'Edzőpálya'};
  $$('soNL').innerHTML=r.list.length?'<div style="max-height:56vh;overflow:auto;text-align:left">'+r.list.map(f=>'<div style="display:flex;gap:10px;align-items:center;padding:8px 10px;margin:5px 0;border-radius:12px;background:'+(f.win?'#3b2f0055':'#ffffff0a')+';border:1px solid '+(f.win?'#facc1566':'#ffffff14')+'"><span style="font-size:26px">'+(f.win?'🏆':f.k>=5?'🔥':'🎮')+'</span><div style="flex:1"><b style="color:#fde68a">'+esc(f.n)+'</b> '+(f.win?'<b style="color:#4ade80">NYERT</b> egy meccset':'lejátszott egy meccset')+(f.k?' · <b>'+f.k+'</b> kiesés':'')+'<br><small style="color:#94a3b8">'+(MN[f.mode]||'Meccs')+' · '+ago(f.t)+'</small></div></div>').join('')+'</div>':'Még nincs hír. Játssz egy meccset, vagy vegyél fel barátokat!'}catch(e){$$('soNL').textContent='Nem sikerült betölteni.'}};
// ---------- 32: barát-ajándék ----------
const GIFT=[['🪙 300 zseton','zs',300],['🪙 600 zseton','zs',600],['💵 15 000 Ft','ft',15000],['💵 40 000 Ft','ft',40000],['🪙 1 200 zseton','zs',1200]];
async function claim(){if(!logged())return;try{const r=await K().api('/api/gifts');window._soSent=r.sent||[];(r.list||[]).forEach(g=>{const p=GIFT[Math.random()*GIFT.length|0];if(p[1]==='zs'){BR.zs=(BR.zs|0)+p[2];try{st.s('k3br',BR)}catch(e){}}else{S.c=(S.c||0)+p[2];try{save()}catch(e){}}
 K().toast('🎁 <b>'+esc(g.from)+'</b> ajándékot küldött: <b>'+p[0]+'</b>');try{sfx('win')}catch(e){}})}catch(e){}}
setInterval(claim,60000);setTimeout(claim,6000);addEventListener('krws',e=>{const m=e.detail;if(m.t==='gift')claim();if(m.t==='hello')setTimeout(claim,1500)});
$$('soGift').onclick=async()=>{if(!logged()){guiOpen('<h1 class="f" style="font-size:30px">🎁 AJÁNDÉK</h1><div style="color:#cbd5e1;margin:10px">Ajándékot a barátaidnak küldhetsz – ehhez jelentkezz be.</div>'+bB('VISSZA','guiClose()','r'));return}
 await claim();const fr=(ACC().friends||ACC().user.friends||[]);const sent=window._soSent||[];
 guiOpen('<h1 class="f" style="font-size:30px">🎁 NAPI BARÁT-AJÁNDÉK</h1><div style="color:#cbd5e1;margin-bottom:8px">Minden barátodnak naponta 1 ingyen ajándékdobozt küldhetsz. A doboz tartalma meglepetés (zseton vagy forint) – neked nem kerül semmibe!</div><div style="max-height:52vh;overflow:auto">'+
  (fr.length?fr.map(n=>{const on=(ACC().online||[]).some(o=>o.name===n),done=sent.includes(n);return'<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;margin:5px 0;border-radius:12px;background:#ffffff0a"><span style="width:10px;height:10px;border-radius:50%;background:'+(on?'#22c55e':'#64748b')+'"></span><b style="flex:1;text-align:left">'+esc(n)+'</b>'+(done?'<span style="color:#4ade80;font-weight:700">✔ Ma elküldve</span>':bB('🎁 KÜLDÉS',"soSend('"+esc(n).replace(/'/g,'')+"')",'c'))+'</div>'}).join(''):'<div style="color:#94a3b8">Még nincs barátod. A chat panelen vehetsz fel barátokat.</div>')+'</div>'+bB('VISSZA','guiClose()','r'))};
window.soSend=async n=>{try{await K().api('/api/gift',{to:n});(window._soSent=window._soSent||[]).push(n);try{sfx('buy')}catch(e){}$$('soGift').click()}catch(e){alert(e.message||'Nem sikerült.')}};
// ---------- 31: zenegép-szavazás ----------
let VOTE=null;const vbox=document.createElement('div');vbox.id='soVote';document.body.appendChild(vbox);
$$('soJb').onclick=()=>{const L=window.LBM;if(!L||!L.songs){alert('A zenelejátszó még nem töltött be.');return}const S2=L.songs();
 if(inParty()){guiOpen('<h1 class="f" style="font-size:30px">🗳️ ZENEGÉP</h1><div style="color:#cbd5e1;margin:8px">A parti tagjai 15 másodpercig szavazhatnak 3 véletlen számra – a győztes szól mindenkinél.</div>'+bB('🗳️ SZAVAZÁS INDÍTÁSA','soVoteStart()','c')+bB('VISSZA','guiClose()','r'));return}
 guiOpen('<h1 class="f" style="font-size:30px">🎵 ZENEGÉP</h1><div style="color:#cbd5e1;margin-bottom:6px">Válaszd ki, mi szóljon! (Partiban a tagok szavaznak.)</div><div class="g">'+S2.map((s,i)=>'<div class="it" onclick="LBM.set('+i+');guiClose()" style="'+(L.cur===i?'outline:3px solid #facc15':'')+'"><div style="font-size:30px">'+s.e+'</div><b>'+esc(s.n)+'</b><small>'+esc(s.a)+'</small></div>').join('')+'</div>'+bB('VISSZA','guiClose()','r'))};
window.soVoteStart=()=>{guiClose();const n=LBM.songs().length,o=[];while(o.length<Math.min(3,n)){const i=Math.random()*n|0;if(!o.includes(i))o.push(i)}K().wsend({t:'prelay',d:{k:'jb_open',id:Date.now().toString(36),opts:o,dur:15000}})};
function voteUI(){if(!VOTE){vbox.style.display='none';return}const S2=LBM.songs(),left=Math.max(0,Math.ceil((VOTE.end-Date.now())/1000));const cnt=VOTE.opts.map(i=>Object.values(VOTE.votes).filter(v=>v===i).length);
 vbox.style.display='block';vbox.innerHTML='<h4>🗳️ ZENEGÉP-SZAVAZÁS · '+left+' mp</h4><div style="font-size:13px;color:#cbd5e1;margin-bottom:4px">Indította: '+esc(VOTE.by)+'</div>'+VOTE.opts.map((i,j)=>'<button class="'+(VOTE.votes[ACC().user.name]===i?'me':'')+'" onclick="soVote('+i+')"><span>'+S2[i].e+' '+esc(S2[i].n)+'</span><b>'+cnt[j]+' 🗳️</b></button>').join('')}
window.soVote=i=>{if(!VOTE)return;K().wsend({t:'prelay',d:{k:'jb_vote',id:VOTE.id,i}})};
setInterval(()=>{if(!VOTE)return;if(Date.now()>=VOTE.end){const cnt=VOTE.opts.map(i=>Object.values(VOTE.votes).filter(v=>v===i).length);let w=0;cnt.forEach((c,j)=>{if(c>cnt[w])w=j});const win=VOTE.opts[w];VOTE=null;voteUI();try{LBM.set(win);K().msg('party','🎵',' A szavazás győztese: '+LBM.songs()[win].n)}catch(e){}}else voteUI()},500);
// ---------- 33: csapatfotó ----------
const cd=document.createElement('div');cd.id='soCd';document.body.appendChild(cd);const fl=document.createElement('div');fl.id='soFl';document.body.appendChild(fl);
$$('soPh').onclick=()=>{if(inParty())K().wsend({t:'prelay',d:{k:'photo',at:Date.now()+3600}});else teamPhoto(Date.now()+3600)};
function teamPhoto(at){const L=window.LB3D;if(!L)return;guiClose&&(()=>{try{guiClose()}catch(e){}})();L.rotY=0;document.body.classList.add('xph');cd.style.display='flex';
 const t=setInterval(()=>{const s=Math.ceil((at-Date.now())/1000);if(s>0){cd.textContent=s}else{clearInterval(t);cd.style.display='none';try{(window.LB3D.me&&window.LB3D.me.userData)}catch(e){}
  L.r.render(L.sc,L.cam);const url=L.r.domElement.toDataURL('image/png');fl.style.transition='none';fl.style.opacity=1;setTimeout(()=>{fl.style.transition='opacity .5s';fl.style.opacity=0},40);try{sfx('magic')}catch(e){}
  setTimeout(()=>{document.body.classList.remove('xph');const nm=inParty()?(ACC().party.members||[]).map(m=>m.name).join(', '):(ACC().user?ACC().user.name:'');
   guiOpen('<h1 class="f" style="font-size:30px">📸 CSAPATFOTÓ</h1><img src="'+url+'" style="max-width:100%;max-height:56vh;border-radius:14px;border:3px solid #fff;box-shadow:0 10px 30px #000"><div style="color:#cbd5e1;margin:6px">'+esc(nm)+' · '+new Date().toLocaleString('hu-HU')+'</div><a download="csapatfoto_'+Date.now()+'.png" href="'+url+'" class="b c" style="display:inline-block;width:auto;margin:4px;padding:8px 14px;text-decoration:none">💾 MENTÉS</a>'+bB('VISSZA','guiClose()','r'))},500)}},100)}
addEventListener('krws',e=>{const m=e.detail;if(m.t!=='prelay'||!m.d)return;const d=m.d;
 if(d.k==='photo'&&!(typeof run!=='undefined'&&run))teamPhoto(Math.max(Date.now()+1500,Math.min(Date.now()+6000,+d.at||0)));
 if(d.k==='jb_open'&&Array.isArray(d.opts)){const _n=(window.LBM&&LBM.songs?LBM.songs().length:0),_o=d.opts.slice(0,3).map(x=>x|0).filter(x=>x>=0&&x<_n);if(!_o.length)return;VOTE={id:d.id,opts:_o,end:Date.now()+Math.min(20000,+d.dur||15000),votes:{},by:m.from};voteUI()}
 if(d.k==='jb_vote'&&VOTE&&d.id===VOTE.id&&VOTE.opts.includes(d.i|0)){VOTE.votes[m.from]=d.i|0;voteUI()}});
// ---------- 35: néző mód ----------
const sp=document.createElement('div');sp.id='spOv';document.body.appendChild(sp);let SP=null;
const aliveList=()=>{const g=G;return[...(g.allies||[]).filter(e=>!e.dead),...g.en.filter(e=>e.bot&&!e.dead)]};
const oEnd=window.end;
window.end=function(win){const g=typeof G!=='undefined'?G:null;
 if(g&&g.brMode&&!win&&!g.over&&!SP&&!g._noSpec&&g.hp<=0){const al=aliveList();if(al.length>=2){startSpec(al.length);return}}
 if(SP&&g&&!g._specEnding){/* néző módban a játék magától ne zárjon */return}
 return oEnd.apply(this,arguments)};
function startSpec(n){const g=G;SP={i:0,alive0:n,place:n+1};g.hp=g.mhp;g._spec=true;if(document.pointerLockElement)document.exitPointerLock();try{say('💀 KIESTÉL – #'+SP.place+'. hely · Néző mód: nézd a többieket!')}catch(e){}spUI()}
function spUI(){if(!SP){sp.style.display='none';return}const al=aliveList(),t=al[SP.i%Math.max(1,al.length)];sp.style.display='flex';
 sp.innerHTML='💀 #'+SP.place+'. hely · 👁️ NÉZŐ MÓD · Most nézed: <b>'+esc(t?(t.name||'Bot'):'—')+'</b> · Életben: <b>'+al.length+'</b><button style="background:#334155;color:#fff" onclick="spNext(-1)">◀</button><button style="background:#334155;color:#fff" onclick="spNext(1)">▶</button><button style="background:linear-gradient(#fde68a,#f59e0b)" onclick="spExit()">🏁 EREDMÉNY</button>'}
window.spNext=d=>{if(!SP)return;const n=aliveList().length||1;SP.i=(SP.i+d+n)%n;spUI()};
window.spExit=()=>{if(!SP)return;const g=G,now=aliveList().length,miss=SP.alive0-now;for(let k=0;k<miss;k++)g.en.push({bot:true,dead:false,x:9e3,z:9e3,hp:1,mhp:1,m:new THREE.Group(),t:'nav'});SP=null;sp.style.display='none';try{cam.children.forEach(c=>c.visible=true)}catch(e){}g._specEnding=true;g._spec=false;g.hp=0;oEnd(false)};
addEventListener('keydown',e=>{if(!SP)return;const k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')spNext(-1);if(k==='d'||k==='arrowright')spNext(1)},true);
{const oh=window.hurt;window.hurt=function(){if(typeof G!=='undefined'&&G&&G._spec)return;return oh.apply(this,arguments)}}
// ---------- 36: edzőpálya ----------
let TR=null,prevMode='royale';window._TR=()=>TR;
$$('soTr').onclick=()=>{if(inParty()){alert('Az edzőpályára csak egyedül mehetsz – lépj ki a partiból.');return}prevMode=window.GAME_MODE||'royale';window.GAME_MODE='train';$$('lbGo').click()};
const TRK='k3train';const best=()=>{try{return JSON.parse(localStorage.getItem(TRK)||'{}')}catch(e){return{}}};
const ORIGHU=HU.map(p=>p.slice());const SQ=[[-70,-70],[70,-70],[70,70],[-70,70]];
{const ob=window.buildHun;window.buildHun=function(ar){if(window.GAME_MODE!=='train')return ob.apply(this,arguments);HU.length=0;SQ.forEach(p=>HU.push(p.slice()));buildRange()}}
function tgtTex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');['#fff','#ef4444','#fff','#ef4444','#facc15'].forEach((col,i)=>{x.fillStyle=col;x.beginPath();x.arc(64,64,62-i*13,0,6.283);x.fill()});return new THREE.CanvasTexture(c)}
function buildRange(){const g=G;g.arh=true;g.plat=[];g.yachts=[];g.kio=[];g.cities=[];
 scene.background=new THREE.Color(0x87b6e8);scene.fog=new THREE.Fog(0x87b6e8,120,320);if(window.HEMI)HEMI.intensity=1.05;
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.MeshLambertMaterial({color:0x4d8f3a}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;scene.add(gr);
 const lane=new THREE.Mesh(new THREE.PlaneGeometry(40,60),new THREE.MeshLambertMaterial({color:0xc2a878}));lane.rotation.x=-Math.PI/2;lane.position.set(0,.02,-38);scene.add(lane);
 const wm=new THREE.MeshStandardMaterial({color:0x94a3b8,roughness:.8});[[0,-70,150,1],[0,70,150,1],[-70,0,1,150],[70,0,1,150]].forEach(([x,z,w,d])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,4,d),wm);m.position.set(x,2,z);scene.add(m)});
 for(let i=1;i<=5;i++){const s=sgn(i*10+' m',-21,1.2,-8-i*10,2.2)}sgn('🎯 EDZŐPÁLYA',0,7,-70,5);
 const tx=tgtTex(),T=[];for(let i=0;i<12;i++){const d=12+(i%4)*10+Math.random()*4,x=(i<4?-14:i<8?0:14)+(Math.random()-.5)*6,z=-d-6;const grp=new THREE.Group();const post=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,1.4,6),new THREE.MeshStandardMaterial({color:0x5b3a1e}));post.position.y=.7;
  const disc=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.12,24),[new THREE.MeshStandardMaterial({color:0xdddddd}),new THREE.MeshStandardMaterial({map:tx}),new THREE.MeshStandardMaterial({color:0xdddddd})]);disc.rotation.x=Math.PI/2;disc.position.y=2.2;grp.add(post,disc);grp.position.set(x,0,z);scene.add(grp);T.push({x,z,y:2.2,grp,disc,up:1,pop:1})}
 TR={T,mode:null,t:0,score:0,hits:0,shots:0,wl0:0,flash:0};g.train=true}
const trHud=document.createElement('div');trHud.id='trHud';const trHelp=document.createElement('div');trHelp.id='trHelp';
trHelp.innerHTML='<b style="color:#fde68a">🎯 EDZŐPÁLYA</b><br>Végtelen lőszer és építőanyag<br><b>F</b> – célzás-kihívás (45 mp)<br><b>J</b> – építés-kihívás (30 mp)<br><b>B</b> – építő mód<br><b>P</b> – menü / kilépés';
setTimeout(()=>{const h=$$('hud');if(h){h.appendChild(trHud);h.appendChild(trHelp)}},0);
{const ol=window.launch;window.launch=function(){const r=ol.apply(this,arguments);try{const g=G;if(window.GAME_MODE==='train'){g.stw=true;g.sto=9999;if(g.sm)g.sm.visible=false;if(g.car)g.car.visible=false;g.x=0;g.z=0;g.ang=-Math.PI/2;setTimeout(()=>{if(G===g&&g.phase==='drop'){land();g.x=0;g.z=0;g.y=0;g.vy=0;g.gl=false;if(g.gs)g.gs.visible=false}},200);trHud.style.display='flex';trHelp.style.display='block';$$('wv').textContent='🎯 EDZŐPÁLYA'}else{TR=null;trHud.style.display='none';trHelp.style.display='none'}}catch(e){console.error(e)}return r}}
{const os=window.spawnWave;window.spawnWave=function(){if(window.GAME_MODE==='train')return;return os.apply(this,arguments)}}
addEventListener('keydown',e=>{if(!TR||typeof run==='undefined'||!run||e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();
 if(k==='f'&&!TR.mode){TR.mode='aim';TR.t=45;TR.score=0;TR.hits=0;TR.shots=0;TR.T.forEach(t=>t.up=0);pop();say('🎯 CÉLZÁS-KIHÍVÁS! Lőj le minél több céltáblát 45 mp alatt!')}
 if(k==='j'&&!TR.mode){TR.mode='build';TR.t=30;TR.wl0=G.wl.length;say('🧱 ÉPÍTÉS-KIHÍVÁS! Építs minél többet 30 mp alatt! (B, majd kattintás)')}},true);
function pop(){const down=TR.T.filter(t=>!t.up);if(!down.length)return;const t=down[Math.random()*down.length|0];t.up=1;t.born=G.t}
{const ou=window.update;window.update=function(dt){const r=ou.apply(this,arguments);try{trTick(dt);spTick()}catch(e){console.error('social: '+e)}return r}}
function trTick(dt){if(!TR||typeof G==='undefined'||!G||!G.train)return;const g=G;g.delay=1e9;g.cash=0;g.ringT=1e9;for(let i=0;i<5;i++){if(g.res)g.res[i]=Math.max(g.res[i]||0,300)}if(window.BR)BR.mats=999;if(typeof mfT!=='undefined')mfT=99;
 TR.T.forEach(t=>{t.pop+=((t.up?1:0)-t.pop)*Math.min(1,dt*10);t.grp.scale.y=Math.max(.02,t.pop);t.grp.visible=t.pop>.03});
 (g.bl||[]).forEach(b=>{if(b.l<=0)return;for(const t of TR.T){if(!t.up)continue;if(Math.hypot(b.x-t.x,(b.y||1.5)-t.y,b.z-t.z)<1.05){b.l=0;hit(t);break}}});
 if(TR.mode){TR.t-=dt;if(TR.mode==='aim'&&!TR.T.some(t=>t.up))pop();if(TR.mode==='aim')TR.T.forEach(t=>{if(t.up&&t.born!=null&&g.t-t.born>2.6){t.up=0;pop()}});
  if(TR.t<=0){const B=best();let txt;if(TR.mode==='aim'){const s=TR.score;txt='🎯 Célzás vége: '+s+' pont ('+TR.hits+' találat)';if(!(B.aim>=s)){B.aim=s;txt+=' · 🏆 ÚJ REKORD!'}}else{const n=g.wl.length-TR.wl0;txt='🧱 Építés vége: '+n+' elem';if(!(B.build>=n)){B.build=n;txt+=' · 🏆 ÚJ REKORD!'}}localStorage.setItem(TRK,JSON.stringify(B));say(txt);try{sfx('win')}catch(e){}TR.mode=null;TR.T.forEach(t=>{t.up=1;t.born=null})}}
 const B=best();trHud.innerHTML=TR.mode==='aim'?'<span>⏱️ '+Math.ceil(TR.t)+' mp</span><span>🎯 '+TR.score+' pont</span><span>🏆 Rekord: '+(B.aim||0)+'</span>':TR.mode==='build'?'<span>⏱️ '+Math.ceil(TR.t)+' mp</span><span>🧱 '+(g.wl.length-TR.wl0)+' elem</span><span>🏆 Rekord: '+(B.build||0)+'</span>':'<span>🎯 EDZŐPÁLYA</span><span>Rekord célzás: '+(B.aim||0)+' · építés: '+(B.build||0)+'</span>';
 $$('wv').textContent='🎯 EDZŐPÁLYA'}
function hit(t){const d=Math.hypot(t.x-G.x,t.z-G.z),p=Math.round(10+d*1.5);try{sfx('crit')}catch(e){}try{ftx(t.x,t.z,TR.mode==='aim'?'+'+p:'🎯','')}catch(e){}if(TR.mode==='aim'){TR.score+=p;TR.hits++;t.up=0;pop()}else{t.up=0;setTimeout(()=>{if(TR)t.up=1},900)}}
function spTick(){if(!SP||typeof G==='undefined'||!G)return;const g=G;g.hp=g.mhp;g.x=0;g.z=440;g.y=0;g.vy=0;if(g.pm)g.pm.visible=false;if(g.gun)g.gun.visible=false;const al=aliveList();
 if(al.length<=1){spExit();return}const t=al[SP.i%al.length];if(!t)return;const a=(t._face!=null?-t._face+Math.PI/2:0);const back=Math.atan2(t.x-(SP.lx||t.x),t.z-(SP.lz||t.z));SP.lx=t.x;SP.lz=t.z;
 SP.ca=SP.ca==null?0:SP.ca+(((Math.atan2(t.x-cam.position.x,t.z-cam.position.z))-SP.ca));const D=10;const cx=t.x-Math.sin(g.t*.2)*D,cz=t.z-Math.cos(g.t*.2)*D;const tp=new THREE.Vector3(cx,6,cz);if(!SP.cp)SP.cp=tp.clone();SP.cp.lerp(tp,.12);cam.position.copy(SP.cp);cam.lookAt(t.x,1.6,t.z);cam.children.forEach(c=>c.visible=false);
 if(!SP._u||g.t-SP._u>1){SP._u=g.t;spUI()}}
{const oe=window.end;window.end=function(win){const g=typeof G!=='undefined'?G:null;const tr=window.GAME_MODE==='train';const r=oe.apply(this,arguments);try{if(tr){trHud.style.display='none';trHelp.style.display='none';window.GAME_MODE=prevMode||'royale';const rt=$$('rt');if(rt){rt.textContent='🎯 EDZÉS VÉGE';rt.style.color='#4ade80'}const B=best();const rb=$$('rb');if(rb)rb.innerHTML='<div style="font-size:18px;line-height:1.7">🏆 Rekord célzás: <b>'+(B.aim||0)+'</b> pont<br>🧱 Rekord építés: <b>'+(B.build||0)+'</b> elem</div>';TR=null}if(!SP)sp.style.display='none'}catch(e){}return r}}
})();
// edzőpálya: felső kijelző
(function(){const o=window.hud;if(typeof o!=='function')return;window.hud=function(){const r=o.apply(this,arguments);try{if(typeof G!=='undefined'&&G&&G.train){document.getElementById('wv').textContent='🎯 EDZŐPÁLYA';document.getElementById('sco').textContent='Végtelen lőszer · végtelen építőanyag';document.getElementById('al').textContent='F: célzás-kihívás · J: építés-kihívás'}}catch(e){}return r}})();
// edzőpálya: a régi pálya-frissítők itt nem futhatnak
['hunTick','moneyTick'].forEach(n=>{const o=window[n];if(typeof o!=='function')return;window[n]=function(){if(typeof G!=='undefined'&&G&&G.train)return;return o.apply(this,arguments)}});
