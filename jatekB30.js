// jatekB30.js – B ügynök: napszak a royale-meccsben (sötétedés + hamis zseblámpa-kúp, csak DOM, nincs 3D fény)
(function(){
const ov=document.createElement('div');
ov.id='b30night';ov.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:5;display:none;mix-blend-mode:multiply';
document.body.appendChild(ov);
let t0=0,last=-1,on=localStorage.getItem('k3b30night')!=='0';
const LEN=240; // mp alatt nappal -> éjjel
function tick(){
  const g=(typeof G!=='undefined')?G:null,br=on&&g&&g.brMode&&g.ry&&g.ry.started!==false;
  if(!br){if(ov.style.display!=='none')ov.style.display='none';t0=0;last=-1;return}
  const now=performance.now()/1000;if(!t0)t0=now;
  const f=Math.min(1,(now-t0)/LEN),d=Math.round(f*20)/20; // 5%-os lépcsők -> ritka DOM-írás
  if(d===last)return;last=d;
  const a=(d*.82).toFixed(2),lamp=d>.55;
  ov.style.display=d>0?'block':'none';
  ov.style.background=lamp
   ?`radial-gradient(ellipse 22% 34% at 50% 58%,rgba(255,240,200,1) 0%,rgba(255,240,200,1) 35%,rgba(10,14,40,${a}) 100%),rgba(10,14,40,${a})`
   :`rgba(20,24,60,${a})`;
  if(lamp&&!ov._ann){ov._ann=1;try{ann('🔦 Leszállt az éj – a zseblámpa bekapcsolt')}catch(e){}}
  if(!lamp)ov._ann=0;
}
setInterval(tick,500);
window._b30={setOn:v=>{on=!!v;localStorage.setItem('k3b30night',on?'1':'0')},skip:()=>{t0-=LEN}};
})();
