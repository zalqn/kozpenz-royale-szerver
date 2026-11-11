// ===== KRIPTO.JS: 🪙 KriptoTárca telefon-app – KözCoin + 4 kitalált coin, csak játékpénz =====
(function(){
const KEY='k3kripto';let W;try{W=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
W=Object.assign({h:{},log:[],stk:0,stkT:Date.now(),al:{}},W||{});
const sv=()=>{try{localStorage.setItem(KEY,JSON.stringify(W))}catch(e){}};
// árfolyam: determinisztikus (idő alapú) – minden játékosnál ugyanaz, szerver nélkül
const C=[
 {id:'KC',n:'KözCoin',e:'🪙',b:420,v:.35,f:[3.6e6,9e5,2.2e5]},
 {id:'PAL',n:'PálinkaCoin',e:'🍑',b:85,v:.55,f:[5e6,1.3e6,3e5]},
 {id:'PCT',n:'Pecsét Token',e:'🔏',b:1300,v:.25,f:[7e6,2e6,4e5]},
 {id:'LUF',n:'LufiCoin',e:'🎈',b:3,v:1.1,f:[2.5e6,6e5,1.5e5]},
 {id:'SFT',n:'StabilFt',e:'💶',b:1,v:0,f:[1,1,1]}];
const BY=Object.fromEntries(C.map(c=>[c.id,c]));
const px=(c,t)=>{t=t||Date.now();if(!c.v)return 1;let s=0;c.f.forEach((p,i)=>s+=Math.sin(t/p+i*1.7+c.b)*(1/(i+1)));return Math.max(.01,+(c.b*Math.exp(s*c.v*.6)).toFixed(c.b<10?3:1))};
const fmt=n=>Math.round(n).toLocaleString('hu-HU');
const hasS=()=>typeof S!=='undefined';
// KC egyenleg = az extra140d KözCoin-bánya egyenlege (egy közös tárca)
const bal=id=>id==='KC'&&window._x14d&&_x14d.D?+_x14d.D.coin||0:+W.h[id]||0;
const setBal=(id,v)=>{v=Math.max(0,+v.toFixed(6));if(id==='KC'&&window._x14d&&_x14d.D){_x14d.D.coin=v;try{localStorage.setItem('k3x14d',JSON.stringify(_x14d.D))}catch(e){}}else W.h[id]=v;sv()};
const log=t=>{W.log.unshift(new Date().toLocaleTimeString('hu-HU').slice(0,5)+' '+t);W.log.length=Math.min(W.log.length,40);sv()};
const toast=m=>{try{say(m)}catch(e){}};
const FEE=.01;
function trade(id,side,ft){ft=Math.floor(+ft||0);const c=BY[id];if(!c||!(ft>0))return toast('Érvénytelen összeg');const p=px(c);
 if(side==='buy'){if(!hasS()||S.c<ft)return toast('Nincs elég Ft!');S.c-=ft;setBal(id,bal(id)+ft*(1-FEE)/p);log('Vétel '+c.id+' '+fmt(ft)+' Ft @'+p)}
 else{const q=ft/p;if(bal(id)<q-1e-9)return toast('Nincs elég '+c.id+'!');setBal(id,bal(id)-q);S.c+=Math.floor(ft*(1-FEE));log('Eladás '+c.id+' '+fmt(ft)+' Ft @'+p)}
 try{window.save&&save()}catch(e){}rr()}
// piszkos Ft (Sötét Program) → kripto: 85%, +4 hő
function mix(id,ft){ft=Math.floor(+ft||0);let dp;try{dp=_dp()}catch(e){}if(!dp||!(ft>0))return;const D=dp.D;if((D.dirty||0)<ft)return toast('Nincs ennyi piszkos Ft!');D.dirty-=ft;setBal(id,bal(id)+ft*.85/px(BY[id]));try{dp.heat(4);dp.save()}catch(e){}log('🌀 Keverő: '+fmt(ft)+' piszkos Ft → '+id);rr()}
// StabilFt kamat: napi 0,5%
function stake(){const d=(Date.now()-W.stkT)/864e5;if(d>0&&W.h.SFT>0)W.h.SFT*=Math.pow(1.005,d);W.stkT=Date.now();sv()}
// ár-riasztás
setInterval(()=>{C.forEach(c=>{const a=W.al[c.id];if(!a)return;const p=px(c);if((a.dir>0&&p>=a.p)||(a.dir<0&&p<=a.p)){toast('📈 '+c.n+' elérte: '+p+' Ft');delete W.al[c.id];sv()}})},15000);
const tot=()=>C.reduce((s,c)=>s+bal(c.id)*px(c),0);
function spark(c){const t=Date.now(),pts=[];for(let i=59;i>=0;i--)pts.push(px(c,t-i*6e4));const mn=Math.min(...pts),mx=Math.max(...pts),r=mx-mn||1;
 return '<svg viewBox="0 0 120 30" width="120" height="30"><polyline fill="none" stroke="'+(pts[59]>=pts[0]?'#22c55e':'#ef4444')+'" stroke-width="1.5" points="'+pts.map((p,i)=>(i*2)+','+(28-(p-mn)/r*26).toFixed(1)).join(' ')+'"/></svg>'}
let SEL='KC';
function render(){stake();const c=BY[SEL],p=px(c),ch=(p/px(c,Date.now()-36e5)-1)*100;let dirty=0;try{dirty=_dp().D.dirty||0}catch(e){}
 return '<div style="font-size:13px"><div style="text-align:center;margin-bottom:6px">Össz-érték<br><b style="font-size:20px">'+fmt(tot())+' Ft</b><br><small>Cím: KZP-'+(W.addr=W.addr||Math.random().toString(36).slice(2,10).toUpperCase())+'</small></div>'+
 C.map(k=>'<div data-kc="'+k.id+'" style="display:flex;justify-content:space-between;align-items:center;padding:5px;border-radius:8px;cursor:pointer;background:'+(k.id===SEL?'#ffffff22':'transparent')+'"><span>'+k.e+' '+k.id+'</span><span>'+bal(k.id).toFixed(k.b<10?2:4)+'</span><span>'+px(k)+' Ft</span></div>').join('')+
 '<hr style="opacity:.2"><b>'+c.e+' '+c.n+'</b> '+p+' Ft <span style="color:'+(ch>=0?'#22c55e':'#ef4444')+'">'+(ch>=0?'+':'')+ch.toFixed(1)+'% / 1ó</span><br>'+spark(c)+
 '<div style="display:flex;gap:4px;margin:4px 0"><input id="krA" type="number" min="1" value="1000" style="width:80px"><button id="krB">Vesz</button><button id="krS">Elad</button></div><small>Díj 1% · '+(SEL==='SFT'?'StabilFt: napi 0,5% kamat':'')+'</small>'+
 '<div style="margin:4px 0"><button id="krAl">🔔 Riasztás ±10%</button>'+(dirty>0?' <button id="krM">🌀 Keverő (piszkos '+fmt(dirty)+')</button>':'')+'</div>'+
 '<details><summary>Napló</summary><div style="max-height:90px;overflow:auto;font-size:11px">'+(W.log.join('<br>')||'–')+'</div></details></div>'}
function after(v){v.querySelectorAll('[data-kc]').forEach(el=>el.onclick=()=>{SEL=el.dataset.kc;rr()});const A=()=>v.querySelector('#krA').value;
 v.querySelector('#krB').onclick=()=>trade(SEL,'buy',A());v.querySelector('#krS').onclick=()=>trade(SEL,'sell',A());
 v.querySelector('#krAl').onclick=()=>{const p=px(BY[SEL]);W.al[SEL]={p:+(p*1.1).toFixed(3),dir:1};sv();toast('🔔 Riasztás: '+SEL+' ≥ '+W.al[SEL].p)};
 const m=v.querySelector('#krM');if(m)m.onclick=()=>mix(SEL,A())}
const rr=()=>{try{window._x60render&&_x60render()}catch(e){}};
window._x60APPS=window._x60APPS||{};_x60APPS.kripto={e:'🪙',n:'KriptoTárca',bg:'linear-gradient(135deg,#f59e0b,#7c3aed)',render,after,live:false};
window._kr={W,C,px,bal,trade,mix,tot,render};
})();
