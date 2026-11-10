// jatekB35.js – B ügynök: 🃏 PÓKER-VERSENY (Texas Hold'em, 6 fős Sit&Go botokkal, emelkedő vakok) + 🏅 heti díj
// Csak játékbeli pénz. Nevezés Ft-ban; helyezési díj azonnal, a heti legjobb helyezésért hétfőn extra díj. Kulcs: k3b35
(function(){
const LS=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=n=>Math.round(n).toLocaleString('hu-HU')+' Ft',SS=()=>typeof S!=='undefined'?S:null;
const pay=n=>{const s=SS();if(!s||!n)return;s.c=(s.c||0)+n;try{save()}catch(e){}if(n>0)try{window._k2&&_k2.earn&&_k2.earn('casino',n,0)}catch(e){}};
const week=d=>{d=new Date(d||Date.now());const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+'-H'+Math.ceil(((t-y)/864e5+1)/7)};
let ST=LS('k3b35',{wk:week(),best:0,played:0,wins:0,claimed:{},hist:[]});
const FEE0=5000,FEEf=()=>{try{return window._b36?_b36.P('verseny',FEE0):FEE0}catch(e){return FEE0}},PRIZE=[30000,12000,3000],WEEKP={1:60000,2:25000,3:10000};
const BL=[[25,50],[50,100],[75,150],[100,200],[150,300],[200,400],[300,600],[500,1000],[800,1600]];
const BOTN=['Blöff Bálint','Zseton Zsófi','Kártyás Kornél','All-in Aliz','Vakos Vince','Flop Flóra','River Rezső','Pikk Piroska'];
// ---------- lapok + kiértékelés ----------
const SU=['♠','♥','♦','♣'],RK='23456789TJQKA';
const deck=()=>{const d=[];for(let s=0;s<4;s++)for(let r=0;r<13;r++)d.push(r*4+s);for(let i=d.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[d[i],d[j]]=[d[j],d[i]]}return d};
const cr=c=>c>>2,cs=c=>c&3,cName=c=>(RK[cr(c)]==='T'?'10':RK[cr(c)])+SU[cs(c)];
function ev5(cs5){const r=cs5.map(cr).sort((a,b)=>b-a),fl=cs5.every(c=>cs(c)===cs(cs5[0]));const cnt={};r.forEach(x=>cnt[x]=(cnt[x]||0)+1);
 const g=Object.entries(cnt).map(([k,v])=>[v,+k]).sort((a,b)=>b[0]-a[0]||b[1]-a[1]);const u=[...new Set(r)];let st=-1;
 if(u.length===5){if(u[0]-u[4]===4)st=u[0];else if(u[0]===12&&u[1]===3)st=3}
 let cat,k;if(st>=0&&fl){cat=8;k=[st]}else if(g[0][0]===4){cat=7;k=[g[0][1],g[1][1]]}else if(g[0][0]===3&&g[1][0]===2){cat=6;k=[g[0][1],g[1][1]]}else if(fl){cat=5;k=r}else if(st>=0){cat=4;k=[st]}else if(g[0][0]===3){cat=3;k=g.map(x=>x[1])}else if(g[0][0]===2&&g[1][0]===2){cat=2;k=g.map(x=>x[1])}else if(g[0][0]===2){cat=1;k=g.map(x=>x[1])}else{cat=0;k=r}
 while(k.length<5)k=k.concat([0]);return k.slice(0,5).reduce((a,x)=>a*15+x,cat)}
function best(cards){let b=-1;const n=cards.length;for(let a=0;a<n;a++)for(let c=a+1;c<n;c++){const f=cards.filter((_,i)=>i!==a&&i!==c);if(f.length===5){const v=ev5(f);if(v>b)b=v}}if(n===5)b=ev5(cards);return b}
const CATN=['Magas lap','Pár','Két pár','Drill','Sor','Flöss','Full','Póker','Színsor'];
const P5=Math.pow(15,5),catOf=v=>Math.floor(v/P5);
function catName(cards){return CATN[catOf(best(cards))]||''}
// ---------- verseny-állapot ----------
let T=null;
function newT(){const me=(typeof ACC!=='undefined'&&ACC&&ACC.user&&ACC.user.name)||(SS()&&SS().name)||'Te';const bn=BOTN.slice().sort(()=>Math.random()-.5);
 T={pl:[{n:me,me:1,st:3000,out:0}].concat([0,1,2,3,4].map(i=>({n:bn[i],st:3000,out:0,agg:.3+Math.random()*.5}))),btn:0,lvl:0,hands:0,order:[],log:[]};newHand()}
const alive=()=>T.pl.filter(p=>!p.out);
function newHand(){if(!T||T.done)return;const A=alive();if(A.length<=1||T.pl[0].out)return finish();T.hands++;if(T.hands%6===0&&T.lvl<BL.length-1){T.lvl++;T.log.unshift('⬆️ Vakemelés: '+BL[T.lvl][0]+'/'+BL[T.lvl][1])}
 do{T.btn=(T.btn+1)%T.pl.length}while(T.pl[T.btn].out);
 const d=deck();T.d=d;T.board=[];T.pot=0;T.street=0;T.pl.forEach(p=>{p.h=p.out?null:[d.pop(),d.pop()];p.bet=0;p.fold=!!p.out;p.ai=false;p.acted=false});
 const nx=i=>{do{i=(i+1)%T.pl.length}while(T.pl[i].out);return i};const sb=A.length===2?T.btn:nx(T.btn),bb=nx(sb);post(sb,BL[T.lvl][0]);post(bb,BL[T.lvl][1]);T.cur=nx(bb);T.max=BL[T.lvl][1];T.minR=BL[T.lvl][1];T.res='';step()}
function post(i,v){const p=T.pl[i];v=Math.min(v,p.st);p.st-=v;p.bet+=v;T.pot+=v;if(!p.st)p.ai=true}
const inHand=()=>T.pl.filter(p=>!p.fold);
function act(i,a,amt){const p=T.pl[i],call=T.max-p.bet;p.acted=true;
 if(a==='fold'){p.fold=true;T.log.unshift(p.n+': dob')}
 else if(a==='call'){post(i,call);T.log.unshift(p.n+': '+(call?'megad '+call:'passz'))}
 else{const to=Math.max(T.max+T.minR,Math.min(amt,p.st+p.bet));const add=to-p.bet;T.minR=Math.max(T.minR,to-T.max);post(i,add);if(p.bet>T.max){T.max=p.bet;T.pl.forEach((q,j)=>{if(j!==i&&!q.fold&&!q.ai)q.acted=false})}T.log.unshift(p.n+': '+(p.ai?'ALL-IN '+p.bet:'emel '+p.bet))}
 T.log=T.log.slice(0,8);next()}
function next(){if(inHand().length===1)return showdown();const need=T.pl.filter(p=>!p.fold&&!p.ai&&(!p.acted||p.bet<T.max));
 if(!need.length){return street()}let i=T.cur;for(let k=0;k<T.pl.length;k++){i=(i+1)%T.pl.length;const p=T.pl[i];if(!p.fold&&!p.ai&&(!p.acted||p.bet<T.max)){T.cur=i;return step()}}street()}
function street(){T.pl.forEach(p=>{p.bet=0;p.acted=false});T.max=0;T.minR=BL[T.lvl][1];T.street++;
 if(T.street===1)T.board.push(T.d.pop(),T.d.pop(),T.d.pop());else if(T.street<=3)T.board.push(T.d.pop());else return showdown();
 const act0=T.pl.filter(p=>!p.fold&&!p.ai);if(act0.length<=1){render();return setTimeout(street,700)}
 let i=T.btn;do{i=(i+1)%T.pl.length}while(T.pl[i].fold||T.pl[i].ai);T.cur=i;step()}
function showdown(){while(T.board.length<5&&inHand().length>1)T.board.push(T.d.pop());const H=inHand();let w;
 if(H.length===1)w=[H[0]];else{const sc=H.map(p=>[p,best(p.h.concat(T.board))]);const m=Math.max(...sc.map(x=>x[1]));w=sc.filter(x=>x[1]===m).map(x=>x[0])}
 const sh=Math.floor(T.pot/w.length);w.forEach(p=>p.st+=sh);T.res='🏆 '+w.map(p=>p.n).join(', ')+' viszi: '+T.pot+(H.length>1?' ('+catName(w[0].h.concat(T.board))+')':'');T.showAll=H.length>1;T.pot=0;
 T.pl.forEach(p=>{if(!p.out&&p.st<=0){p.out=1;T.order.unshift(p.n)}});T.cur=-1;render();const TT=T;setTimeout(()=>{if(T!==TT)return;T.showAll=false;newHand()},2600)}
function step(){render();const p=T.pl[T.cur];if(!p||p.me)return;setTimeout(()=>{if(T)botAct(T.cur)},450+Math.random()*350)}
function botAct(i){if(!T||T.done||T.cur!==i)return;const p=T.pl[i];if(!p||p.fold)return;const call=T.max-p.bet,cards=p.h.concat(T.board);let s;
 if(!T.board.length){const a=cr(p.h[0]),b=cr(p.h[1]);s=(Math.max(a,b)+Math.min(a,b)*.5)/18+(a===b?.35+a/40:0)+(cs(p.h[0])===cs(p.h[1])?.06:0)}else{s=.2+catOf(best(cards))*.17}
 s+=(Math.random()-.5)*.25+p.agg*.08;const po=call/(T.pot+call||1);
 if(s>.78&&Math.random()<p.agg+.2)return act(i,'raise',T.max+Math.max(T.minR,Math.round(T.pot*(.5+Math.random()*.5))));
 if(call===0)return act(i,s>.6&&Math.random()<p.agg?'raise':'call',T.max+T.minR);
 if(s>po+.25||call<=BL[T.lvl][1]&&s>.35)return act(i,'call');return act(i,'fold')}
function finish(){if(!T||T.done)return;const me=T.pl[0];let place;if(!me.out){place=1;T.order.unshift(me.n)}else place=alive().length+1;
 const pr=PRIZE[place-1]||0;pay(pr);ST.played++;if(place===1)ST.wins++;const wk=week();if(ST.wk!==wk){ST.wk=wk;ST.best=0}if(!ST.best||place<ST.best)ST.best=place;ST.hist.unshift({wk,place,t:Date.now()});ST.hist=ST.hist.slice(0,30);SV('k3b35',ST);
 T.res='🏁 Verseny vége: '+place+'. hely'+(pr?' · díj: '+fmt(pr):'');T.done=true;render()}
function weekly(){const wk=week(),last=ST.hist.filter(h=>h.wk!==wk);const byW={};last.forEach(h=>{byW[h.wk]=Math.min(byW[h.wk]||9,h.place)});let got=0;
 for(const w in byW){if(ST.claimed[w])continue;ST.claimed[w]=1;const p=WEEKP[byW[w]]||0;if(p){pay(p);got+=p}}SV('k3b35',ST);return got}
// ---------- UI ----------
const pan=document.createElement('div');pan.id='b35pan';pan.style.cssText='position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;background:#000c;font:14px system-ui;color:#e2e8f0';document.body.appendChild(pan);
const btn='background:#1e293b;color:#fff;border:2px solid #334155;border-radius:9px;padding:7px 12px;margin:3px;cursor:pointer;font:600 14px system-ui';
const card=(c,hid)=>'<span style="display:inline-block;width:34px;height:48px;line-height:48px;text-align:center;border-radius:6px;margin:1px;font:700 15px system-ui;'+(hid?'background:repeating-linear-gradient(45deg,#7c3aed,#7c3aed 4px,#5b21b6 4px,#5b21b6 8px)':'background:#fff;color:'+(cs(c)===1||cs(c)===2?'#dc2626':'#111'))+'">'+(hid?'':cName(c))+'</span>';
function open(){const g=weekly();pan.style.display='flex';if(g)setTimeout(()=>{try{say('🏅 Heti póker-díj: +'+fmt(g))}catch(e){}},200);render()}
function render(){if(pan.style.display==='none')return;let h='<div style="background:#064e3b;border:3px solid #a16207;border-radius:16px;padding:14px;max-width:760px;width:calc(100% - 32px);max-height:94vh;overflow:auto">';
 h+='<h2 style="margin:0 0 6px">🃏 Póker-verseny <small style="font-size:12px;color:#fde68a">Sit&Go · 6 fő · vakemelés 6 leosztásonként</small></h2>';
 if(!T||T.done){h+='<p>Nevezési díj: <b>'+fmt(FEEf())+'</b> · Díjak: 1. '+fmt(PRIZE[0])+', 2. '+fmt(PRIZE[1])+', 3. '+fmt(PRIZE[2])+'.<br>🏅 <b>Heti díj</b> (a hét legjobb helyezésedért, a következő héten jár): 1. hely '+fmt(WEEKP[1])+' · 2. '+fmt(WEEKP[2])+' · 3. '+fmt(WEEKP[3])+'</p><p>E heti legjobb: <b>'+(ST.wk===week()&&ST.best?ST.best+'. hely':'—')+'</b> · Versenyek: '+ST.played+' · Győzelem: '+ST.wins+'</p>'+(T&&T.done?'<p style="color:#fde68a;font-weight:700">'+T.res+'</p>':'')+'<button id="b35go" style="'+btn+';background:#16a34a">▶ NEVEZÉS ('+fmt(FEEf())+')</button>'}
 else{const me=T.pl[0],call=T.max-me.bet,my=T.cur===0;
  h+='<div style="font-size:12px;color:#fde68a">Vak: '+BL[T.lvl][0]+'/'+BL[T.lvl][1]+' · '+T.hands+'. leosztás · Kassza: <b>'+T.pot+'</b></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px;margin:8px 0">'+
  T.pl.map((p,i)=>'<div style="background:'+(i===T.cur?'#065f46':'#022c22')+';border:2px solid '+(i===T.cur?'#facc15':'#14532d')+';border-radius:10px;padding:6px;opacity:'+(p.out||p.fold?.45:1)+'"><b>'+(i===T.btn?'🔘 ':'')+p.n+'</b><br>'+(p.out?'💀 kiesett':'🪙 '+p.st+(p.bet?' · tét '+p.bet:'')+(p.ai?' · ALL-IN':''))+'<br>'+(p.h?(p.me||T.showAll&&!p.fold?p.h.map(c=>card(c)).join(''):p.h.map(c=>card(c,1)).join('')):'')+'</div>').join('')+'</div>';
  h+='<div style="text-align:center;min-height:52px">'+T.board.map(c=>card(c)).join('')+'</div><div style="text-align:center;color:#fde68a;font-weight:700;min-height:20px">'+(T.res||(me.h&&!me.fold?'Kezed: '+catName(me.h.concat(T.board)):''))+'</div>';
  if(my&&!me.fold&&!me.out){const mr=T.max+T.minR;h+='<div style="text-align:center"><button data-a="fold" style="'+btn+'">Dobás</button><button data-a="call" style="'+btn+'">'+(call?'Megadás '+Math.min(call,me.st):'Passz')+'</button><input id="b35r" type="range" min="'+Math.min(mr,me.st+me.bet)+'" max="'+(me.st+me.bet)+'" value="'+Math.min(mr,me.st+me.bet)+'" style="vertical-align:middle"><button data-a="raise" style="'+btn+';background:#b45309">Emelés <span id="b35rv">'+Math.min(mr,me.st+me.bet)+'</span></button><button data-a="allin" style="'+btn+';background:#b91c1c">ALL-IN</button></div>'}
  h+='<div style="font-size:12px;color:#a7f3d0;margin-top:6px">'+T.log.join(' · ')+'</div>'}
 h+='<div><button id="b35x" style="'+btn+'">✖ Bezár'+(T&&!T.done?' (feladás)':'')+'</button></div></div>';pan.innerHTML=h;
 const q=s=>pan.querySelector(s);q('#b35x').onclick=()=>{if(T&&!T.done){if(!confirm('Feladod a versenyt? A nevezési díj elveszik.'))return;T.pl[0].out=1;T.order.unshift(T.pl[0].n);T.pl.filter(p=>!p.out).forEach(p=>T.order.unshift(p.n));finish()}pan.style.display='none'};
 const go=q('#b35go');if(go)go.onclick=()=>{const s=SS();const FEE=FEEf();if(!s||(s.c||0)<FEE){try{say('Nincs elég pénzed a nevezéshez')}catch(e){}return}s.c-=FEE;try{save()}catch(e){}newT()};
 const rg=q('#b35r');if(rg)rg.oninput=()=>{q('#b35rv').textContent=rg.value};
 pan.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(T.cur!==0)return;const a=b.dataset.a;if(a==='allin')act(0,'raise',T.pl[0].st+T.pl[0].bet);else if(a==='raise')act(0,'raise',+rg.value);else act(0,a)})}
(function reg(){if(!window._lb2||!_lb2.add){setTimeout(reg,500);return}_lb2.add({ic:'🃏',hu:'Póker-verseny',tx:'Póker-verseny',c:'shop',fn:open,kw:'poker verseny holdem vak heti dij kaszino'})})();
window._b35={open,T:()=>T,ST:()=>ST,best,ev5,weekly,newT,act,week};
})();
