// ===== LOBBY ZENEMOTOR: 3 generált zeneszám, valós idejű keverés, lejátszó + vizualizáció =====
(function(){
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},s:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const mtof=m=>440*Math.pow(2,(m-69)/12);
// ---------- dalok ----------
// akkordok: MIDI hangok ütemenként; dob-minták 16 lépésre (x=ütés, o=nyitott cin)
const SONGS=[
 {n:'Trópusi Ház',a:'Közpénz-Sziget',e:'🌴',bpm:108,swing:.12,
  chords:[[57,61,64,68],[54,57,61,64],[50,54,57,61],[52,56,59,63]],root:[45,42,38,40],scale:[0,2,4,7,9],key:61,
  kick:'x...x...x...x...',clap:'....x.......x...',hat:'..x...x...x...x.',ohat:'......o.......o.',shk:'x.xxx.xxx.xxx.xx',
  bass:'x..x..x.x..x..x.',lead:'marimba',pad:'saw',cut:1700,crackle:0},
 {n:'Lo-fi Éjszaka',a:'Hold a villa felett',e:'🌙',bpm:82,swing:.22,
  chords:[[50,53,57,60,64],[55,59,62,65],[48,52,55,59,62],[45,48,52,55]],root:[38,43,36,33],scale:[0,3,5,7,10],key:62,
  kick:'x......x..x.....',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',ohat:'................',shk:'................',
  bass:'x.......x..x....',lead:'keys',pad:'warm',cut:900,crackle:1},
 {n:'Szintipop Royale',a:'Neon a parton',e:'🕹️',bpm:118,swing:0,
  chords:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]],root:[45,41,36,43],scale:[0,2,4,7,9],key:69,
  kick:'x...x...x...x...',clap:'....x.......x...',hat:'x.x.x.x.x.x.x.x.',ohat:'..o...o...o...o.',shk:'................',
  bass:'xxxxxxxxxxxxxxxx',lead:'square',pad:'saw',cut:2600,crackle:0},
];
let ctx=null,M=null,state={on:false,song:LS.g('ry_song',0),vol:LS.g('ry_vol',.7),step:0,bar:0,next:0,timer:null,seed:1},melody=[];
function rng(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
function makeMelody(song){const r=rng(song.key*97+state.seed),m=[];let deg=2;for(let i=0;i<32;i++){if(r()<.42){m.push(null);continue}deg=Math.max(0,Math.min(9,deg+Math.round((r()-.5)*3)));const oct=Math.floor(deg/5),sc=song.scale[deg%5];m.push({n:song.key+sc+oct*12-12,len:r()<.25?2:1})}return m}
function init(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();
 const master=ctx.createGain();master.gain.value=state.vol;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.2;
 const an=ctx.createAnalyser();an.fftSize=64;master.connect(comp);comp.connect(an);an.connect(ctx.destination);
 // visszhang (generált impulzusválasz)
 const len=ctx.sampleRate*2.6,imp=ctx.createBuffer(2,len,ctx.sampleRate);for(let c=0;c<2;c++){const d=imp.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
 const rev=ctx.createConvolver();rev.buffer=imp;const revG=ctx.createGain();revG.gain.value=.32;rev.connect(revG);revG.connect(master);
 // késleltetés (3/16)
 const dl=ctx.createDelay(1),fb=ctx.createGain(),dlG=ctx.createGain();fb.gain.value=.34;dlG.gain.value=.22;dl.connect(fb);fb.connect(dl);dl.connect(dlG);dlG.connect(master);
 // busok: a "lélegző" (sidechain) bus a pad+basszusnak
 const duck=ctx.createGain();duck.connect(master);duck.connect(rev);
 const noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);{const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
 M={master,an,rev,dl,duck,noise,crackleG:null}}
// ---------- hangszerek ----------
const env=(g,t,a,peak,dec,sus,rel,end)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(sus,t+a,dec);g.gain.setTargetAtTime(0,end,rel)};
function osc(type,f,t,end,dest,det){const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(det)o.detune.value=det;o.connect(dest);o.start(t);o.stop(end+1.5);return o}
function kick(t){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(155,t);o.frequency.exponentialRampToValueAtTime(42,t+.13);g.gain.setValueAtTime(1.15,t);g.gain.exponentialRampToValueAtTime(.001,t+.42);o.connect(g);g.connect(M.master);o.start(t);o.stop(t+.45);
 const d=M.duck.gain;d.cancelScheduledValues(t);d.setValueAtTime(.25,t);d.linearRampToValueAtTime(1,t+.24)}
function nz(t,dur,type,f,q,gain,dest){const s=ctx.createBufferSource();s.buffer=M.noise;const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;const g=ctx.createGain();g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(fl);fl.connect(g);g.connect(dest||M.master);s.start(t,Math.random()*.5);s.stop(t+dur+.05);return g}
function clap(t){[0,.012,.024].forEach(o=>nz(t+o,.16,'bandpass',1500,1.2,.55));const g=nz(t,.35,'bandpass',1800,.8,.18,M.rev)}
const hat=(t,open)=>nz(t,open?.28:.05,'highpass',8000,.7,open?.18:.14);
const shaker=t=>nz(t,.06,'bandpass',6500,2,.07);
function bass(t,m,dur,song){const g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(song.lead==='square'?900:520,t);f.frequency.exponentialRampToValueAtTime(180,t+dur);f.Q.value=4;
 osc('sawtooth',mtof(m),t,t+dur,f);osc('sine',mtof(m-12),t,t+dur,g);f.connect(g);g.connect(M.duck);env(g,t,.008,.42,.12,.28,.05,t+dur)}
function pad(t,notes,dur,song){const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(song.cut*.6,t);f.frequency.linearRampToValueAtTime(song.cut,t+dur*.6);f.Q.value=1.5;const g=ctx.createGain();f.connect(g);g.connect(M.duck);
 notes.forEach(n=>{[-9,9].forEach(dt=>osc(song.pad==='warm'?'triangle':'sawtooth',mtof(n),t,t+dur,f,dt))});env(g,t,song.pad==='warm'?.4:.25,.075,.6,.055,.5,t+dur)}
function lead(t,m,dur,song){const g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=song.lead==='keys'?1800:4200;f.connect(g);g.connect(M.master);g.connect(M.dl);g.connect(M.rev);
 if(song.lead==='marimba'){osc('sine',mtof(m),t,t+.6,f);osc('sine',mtof(m)*4.01,t,t+.15,f);env(g,t,.003,.32,.09,0,.05,t+.5)}
 else if(song.lead==='keys'){osc('triangle',mtof(m),t,t+dur,f);osc('sine',mtof(m+12),t,t+dur,f,4);env(g,t,.01,.22,.3,.08,.25,t+dur)}
 else{osc('square',mtof(m),t,t+dur,f,-6);osc('square',mtof(m),t,t+dur,f,6);env(g,t,.005,.11,.15,.05,.08,t+dur)}}
function crackle(on){if(!M)return;if(M.crackleG){M.crackleG.gain.setTargetAtTime(0,ctx.currentTime,.2);const old=M.crackleG;setTimeout(()=>{try{old.src.stop()}catch(e){}},800);M.crackleG=null}
 if(!on)return;const len=ctx.sampleRate*2,b=ctx.createBuffer(1,len,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()<.0007?(Math.random()*2-1)*.9:0)+(Math.random()*2-1)*.012;
 const s=ctx.createBufferSource();s.buffer=b;s.loop=true;const g=ctx.createGain();g.gain.value=0;g.gain.setTargetAtTime(.35,ctx.currentTime,.5);s.connect(g);g.connect(M.master);s.start();g.src=s;M.crackleG=g}
// ---------- ütemező ----------
function schedule(){const song=SONGS[state.song],sp=60/song.bpm/4;
 while(state.next<ctx.currentTime+.12){const s=state.step%16,bar=state.bar,t=state.next+(s%2?song.swing*sp:0);
  const sec=bar%32,intro=sec<4,build=sec>=4&&sec<8,brk=sec>=24&&sec<28,full=!intro&&!brk;const ch=song.chords[bar%song.chords.length],rt=song.root[bar%song.root.length];
  if(s===0)pad(t,ch,sp*16,song);
  if((full||build)&&song.kick[s]==='x')kick(t);
  if(full&&song.clap[s]==='x')clap(t);
  if(!intro&&song.hat[s]==='x')hat(t,false);if(full&&song.ohat[s]==='o')hat(t,true);if(full&&song.shk[s]==='x')shaker(t);
  if(!intro&&!brk&&song.bass[s]==='x')bass(t,rt+(song.lead==='square'&&s%4===2?12:0),sp*(song.lead==='square'?.9:1.8),song);
  if(full&&sec>=8){const mi=(sec%2)*16+s,nn=melody[mi];if(nn&&s%2===0)lead(t,nn.n,sp*2*nn.len,song)}
  if(build&&sec===7&&s>=8)nz(t,sp,'highpass',2000+s*400,1,.04*(s-7));
  state.next+=sp;state.step++;if(state.step%16===0){state.bar++;if(state.bar%32===0){state.seed++;melody=makeMelody(song)}}}}
function start(){init();if(ctx.state==='suspended')ctx.resume();if(state.on)return;state.on=true;state.step=0;state.bar=0;state.next=ctx.currentTime+.08;melody=makeMelody(SONGS[state.song]);
 M.master.gain.cancelScheduledValues(ctx.currentTime);M.master.gain.setValueAtTime(0,ctx.currentTime);M.master.gain.linearRampToValueAtTime(state.vol,ctx.currentTime+1.5);crackle(SONGS[state.song].crackle);
 state.timer=setInterval(schedule,25);ui();}
function stop(){if(!state.on)return;state.on=false;clearInterval(state.timer);if(M){M.master.gain.setTargetAtTime(0,ctx.currentTime,.25);crackle(false)}ui()}
function setSong(i){state.song=(i+SONGS.length)%SONGS.length;LS.s('ry_song',state.song);if(state.on){stop();setTimeout(start,450)}else ui()}
window.LBM={songs:()=>SONGS.map(x=>({n:x.n,e:x.e,a:x.a})),set:i=>{setSong(i);if(!state.on)start()},get cur(){return state.song},start,stop,next:()=>setSong(state.song+1),prev:()=>setSong(state.song-1),get on(){return state.on}};
// ---------- lejátszó-panel a lobbyban ----------
const css=document.createElement('style');css.textContent=`#lbPlayer{position:absolute;right:24px;top:84px;width:300px;padding:12px 14px;border-radius:18px;background:#0b1022d9;backdrop-filter:blur(12px);border:1px solid #ffffff22;box-shadow:0 16px 40px #0009;display:flex;flex-direction:column;gap:8px;z-index:3}
#lbPlayer .row{display:flex;align-items:center;gap:10px}#lbPlayer .art{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:30px;background:linear-gradient(135deg,#7c3aed,#db2777);box-shadow:0 6px 16px #0008}
#lbPlayer .art.spin{animation:lbspin 6s linear infinite}@keyframes lbspin{to{transform:rotate(360deg)}}
#lbPlayer b{display:block;font:20px 'Luckiest Guy',Impact;line-height:1.05}#lbPlayer small{color:#94a3b8;font-weight:700}
#lbPlayer button{width:38px;height:38px;border:0;border-radius:50%;background:#1e293b;color:#fff;font-size:16px;cursor:pointer}#lbPlayer button.pp{width:46px;height:46px;background:#ffd23f;color:#0b1022;font-size:20px}
#lbPlayer input{flex:1;accent-color:#ffd23f}#lbViz{width:100%;height:34px}`;document.head.appendChild(css);
const P=document.createElement('div');P.id='lbPlayer';P.innerHTML=`<div class="row"><div class="art" id="lbArt">🌴</div><div style="flex:1;min-width:0"><b id="lbSn"></b><small id="lbSa"></small></div></div><canvas id="lbViz" width="272" height="34"></canvas><div class="row"><button id="lbPrev" title="Előző">⏮</button><button id="lbPP" class="pp" title="Lejátszás / szünet">▶</button><button id="lbNext" title="Következő">⏭</button><span style="font-size:16px">🔊</span><input id="lbVol" type="range" min="0" max="100"></div>`;
const host=document.getElementById('lb');if(host)host.appendChild(P);
const $p=s=>P.querySelector(s);$p('#lbVol').value=Math.round(state.vol*100);
$p('#lbPP').onclick=()=>{state.on?stop():start();LS.s('ry_music',state.on)};$p('#lbNext').onclick=()=>window.LBM.next();$p('#lbPrev').onclick=()=>window.LBM.prev();
$p('#lbVol').oninput=e=>{state.vol=e.target.value/100;LS.s('ry_vol',state.vol);if(M&&state.on)M.master.gain.setTargetAtTime(state.vol,ctx.currentTime,.05)};
function ui(){const s=SONGS[state.song];$p('#lbSn').textContent=s.n;$p('#lbSa').textContent=s.a+' · '+s.bpm+' BPM';$p('#lbArt').textContent=s.e;$p('#lbArt').classList.toggle('spin',state.on);$p('#lbPP').textContent=state.on?'⏸':'▶';const mb=document.getElementById('lbMus');if(mb)mb.textContent=state.on?'🎵':'🔇'}
ui();
// vizualizáció
const vz=$p('#lbViz').getContext('2d'),buf=new Uint8Array(32);
(function draw(){requestAnimationFrame(draw);if(!host||!host.classList.contains('on'))return;vz.clearRect(0,0,272,34);if(!M||!state.on){vz.fillStyle='#ffffff22';for(let i=0;i<24;i++)vz.fillRect(i*11.3,30,8,3);return}
 M.an.getByteFrequencyData(buf);for(let i=0;i<24;i++){const v=buf[i+1]/255,h=Math.max(3,v*32);const g=vz.createLinearGradient(0,34-h,0,34);g.addColorStop(0,'#ffd23f');g.addColorStop(1,'#ff4d6d');vz.fillStyle=g;vz.fillRect(i*11.3,34-h,8,h)}})();
// lobby ↔ meccs: a meccsen a lobbyzene elhallgat, visszatéréskor folytatódik
const wantOn=()=>LS.g('ry_music',true);
if(host)new MutationObserver(()=>{if(host.classList.contains('on')){if(wantOn()&&ctx)start()}else stop()}).observe(host,{attributes:true,attributeFilter:['class']});
document.addEventListener('pointerdown',function f(){if(host&&host.classList.contains('on')&&wantOn())start();document.removeEventListener('pointerdown',f)});
})();
