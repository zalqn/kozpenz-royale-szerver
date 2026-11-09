// ===== VSPORT 2.0: folyamatos virtuális bajnokság · 20 meccs/forduló · 3 bajnokság · 30+ piac · egyenként / kötés / rendszer · élő közvetítés · kiszállás · tabella =====
// Csak játékbeli forinttal (S.c). Valódi pénz nincs.
(function(){
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ft=n=>Math.round(n).toLocaleString('hu-HU')+' Ft';
const bal=()=>Math.round(S.c||0),pay=d=>{S.c=(S.c||0)+d;try{save()}catch(e){}};
const R=Math.random,poi=l=>{let L=Math.exp(-l),k=0,p=1;do{k++;p*=R()}while(p>L);return k-1};
const TM=[['Közpénz FC','KFC','#facc15'],['Felcsúti Kisvasutasok','FKV','#16a34a'],['Kordon United','KOR','#ef4444'],['NKA Athletic','NKA','#a855f7'],['Árstop SE','ÁRS','#0ea5e9'],['Rezsi Rangers','REZ','#f97316'],
 ['Offshore Utd','OFF','#14b8a6'],['Pályázat Spurs','PÁL','#64748b'],['Strómann City','STR','#3b82f6'],['Konzultáció Kickers','KON','#eab308'],['Balatoni Jachtok','JAC','#06b6d4'],['Lombkorona FC','LOM','#22c55e'],
 ['Alapítványi Aranycsapat','ALA','#d97706'],['Tao-támogatás FC','TAO','#e11d48'],['Stadionépítők SC','STA','#7c3aed'],['Kegyenc Kőbányászok','KEG','#78716c']];
const BASE=[86,82,74,71,66,69,78,63,72,60,76,58,80,68,75,62];
const LGN=['🏛️ Közpénz Liga','🏗️ Tender Kupa','📺 Médiaholding Liga'];TM.forEach(t=>t[3]=0);
[['Közbeszerzés Kings','KBK','#f59e0b',84],['Túlárazás SC','TÚL','#dc2626',79],['Kiemelt Beruházók','KIB','#2563eb',76],['Vasúti Felújítók','VAS','#475569',70],['Konzorcium FC','KZM','#9333ea',73],['Sürgősségi Eljárás','SÜR','#ea580c',65],
 ['Generálkivitelező Utd','GEN','#0d9488',77],['Alvállalkozók SE','ALV','#a16207',61],['Pótmunka Rovers','PÓT','#be123c',67],['Határidő-csúszás FC','HAT','#64748b',59],['Üvegzseb Athletic','ÜVE','#38bdf8',63],['Kamu Cégek SC','KAM','#57534e',69]].forEach(t=>{TM.push([t[0],t[1],t[2],1]);BASE.push(t[3])});
[['Propaganda Pumas','PRO','#f97316',83],['Plakát Patriots','PLA','#e11d48',78],['Közmédia Hírnökök','KMH','#1d4ed8',75],['Megyei Lapok FC','MEG','#65a30d',64],['Hírcentrum FC','HÍR','#7c3aed',72],['Tényfeltáró Törpék','TÉN','#14b8a6',60],
 ['Kormányinfó Rangers','KIF','#facc15',80],['Kampány Kommandó','KMP','#b91c1c',71],['Óriásplakát City','ÓRI','#0ea5e9',68],['Rádió Rezsicsökkentők','RÁD','#f472b6',62],['Online Trollok','TRO','#4b5563',66],['Sajtószoba SE','SAJ','#a3a3a3',58]].forEach(t=>{TM.push([t[0],t[1],t[2],2]);BASE.push(t[3])});
// ---------- mentett állapot ----------
const KEY='vs2';let DB;try{DB=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){DB=null}
if(!DB||!DB.tab)DB={str:BASE.slice(),tab:TM.map(()=>({p:0,w:0,d:0,l:0,gf:0,ga:0,form:[]})),slips:[],hist:[],st:{bets:0,stake:0,won:0,best:0,wins:0},season:1,rno:0};
while(DB.str.length<TM.length)DB.str.push(BASE[DB.str.length]);while(DB.tab.length<TM.length)DB.tab.push({p:0,w:0,d:0,l:0,gf:0,ga:0,form:[]});
// újratöltéskor a félbemaradt fogadások tétjét visszaadjuk
if(DB.slips.length){let back=0;DB.slips.forEach(s=>{back+=s.stake;DB.hist.unshift(Object.assign(s,{status:'refund',win:s.stake,at:Date.now()}))});DB.slips=[];if(back)setTimeout(()=>{pay(back)},1500)}
const store=()=>{try{DB.hist=DB.hist.slice(0,60);localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}};
// ---------- piacok ----------
const GRP=[['⚽ Végeredmény',['1','X','2']],['🤝 Dupla esély',['1X','12','X2']],['🥅 Gólok száma',['O15','U15','O25','U25','O35','U35']],['🔁 Mindkét csapat szerez gólt',['GG','NG']],['⏱️ Félidő eredménye',['H1','HX','H2']],
 ['🏠 Hazai gólok',['HO05','HO15']],['✈️ Vendég gólok',['AO05','AO15']],['🎯 Pontos eredmény',null]];
const CSK=[];for(let h=0;h<4;h++)for(let a=0;a<4;a++)CSK.push('CS'+h+a);CSK.push('CSO');
const LB={'1':'Hazai','X':'Döntetlen','2':'Vendég','1X':'1X','12':'12','X2':'X2','O15':'1,5 felett','U15':'1,5 alatt','O25':'2,5 felett','U25':'2,5 alatt','O35':'3,5 felett','U35':'3,5 alatt','GG':'Igen','NG':'Nem','H1':'Hazai','HX':'Döntetlen','H2':'Vendég','HO05':'0,5 felett','HO15':'1,5 felett','AO05':'0,5 felett','AO15':'1,5 felett','CSO':'Egyéb'};
const lbl=k=>k.startsWith('CS')&&k!=='CSO'?k[2]+':'+k[3]:LB[k];
const SHORT={'1':'1','X':'X','2':'2'};
function win(k,s){const h=s.h,a=s.a,t=h+a;switch(k){case'1':return h>a;case'X':return h===a;case'2':return a>h;case'1X':return h>=a;case'12':return h!==a;case'X2':return a>=h;
 case'O15':return t>1;case'U15':return t<2;case'O25':return t>2;case'U25':return t<3;case'O35':return t>3;case'U35':return t<4;case'GG':return h>0&&a>0;case'NG':return!(h>0&&a>0);
 case'H1':return s.hh>s.ha;case'HX':return s.hh===s.ha;case'H2':return s.ha>s.hh;case'HO05':return h>0;case'HO15':return h>1;case'AO05':return a>0;case'AO15':return a>1;case'CSO':return h>3||a>3}
 return h===+k[2]&&a===+k[3]}
// ---------- fordulók ----------
const LIVE=45000,PAUSE=6000,FIRST=30000;let OPEN=null,CUR=null;
function lam(hi,ai){const sh=DB.str[hi],sa=DB.str[ai];return[Math.max(.3,1.3+(sh-sa)/28+.18),Math.max(.25,1.08+(sa-sh)/28)]}
const ALLK=[];GRP.forEach(g=>(g[1]||CSK).forEach(k=>ALLK.push(k)));
function odds(x){const cnt={},N=2500,lh=x.lh,la=x.la;for(let n=0;n<N;n++){const hh=poi(lh*.45),ha=poi(la*.45),s={hh,ha,h:hh+poi(lh*.55),a:ha+poi(la*.55)};for(const k of ALLK)if(win(k,s))cnt[k]=(cnt[k]||0)+1}
 const o={};for(const k of ALLK){const p=(cnt[k]||1)/N;o[k]=Math.min(250,Math.max(1.02,+(0.92/p).toFixed(2)))}x.o=o}
function mkRound(kick){DB.rno++;const ms=[];
 LGN.forEach((_,lg)=>{const idx=TM.map((t,i)=>t[3]===lg?i:-1).filter(i=>i>=0).sort(()=>R()-.5);for(let i=0;i+1<idx.length;i+=2){const h=idx[i],a=idx[i+1],[lh,la]=lam(h,a);ms.push({h,a,lg,lh,la,o:null,st:{h:0,a:0,hh:0,ha:0},ev:[],mom:.5,done:false})}});
 const r={id:DB.rno,no:DB.rno,ms,state:'open',kick,t0:0,min:0};let q=0;(function step(){if(q>=ms.length){if(on())render(true);return}odds(ms[q++]);setTimeout(step,15)})();return r}
OPEN=mkRound(Date.now()+FIRST);
function kickoff(){CUR=OPEN;CUR.state='live';CUR.t0=Date.now();CUR.min=0;OPEN=mkRound(CUR.t0+LIVE+PAUSE);if(on())render(true)}
function simMinute(r,m){r.ms.forEach((x,i)=>{const att=R();x.mom+=(att-.5)*.18;x.mom=Math.max(.15,Math.min(.85,x.mom));
 const ph=x.lh/90*(.7+x.mom*.6),pa=x.la/90*(1.3-x.mom*.6);
 if(R()<ph){x.st.h++;if(m<=45)x.st.hh++;x.ev.push({m,t:'⚽',s:'h'});feed('⚽ '+m+"' GÓL! "+TM[x.h][0]+' ('+x.st.h+':'+x.st.a+')',x,i)}
 if(R()<pa){x.st.a++;if(m<=45)x.st.ha++;x.ev.push({m,t:'⚽',s:'a'});feed('⚽ '+m+"' GÓL! "+TM[x.a][0]+' ('+x.st.h+':'+x.st.a+')',x,i)}
 if(R()<.022)x.ev.push({m,t:'🟨',s:R()<.5?'h':'a'});if(R()<.0025){const s=R()<.5?'h':'a';x.ev.push({m,t:'🟥',s});if(s==='h')x.lh*=.75;else x.la*=.75;feed('🟥 '+m+"' Kiállítás: "+TM[s==='h'?x.h:x.a][0],x,i)}
 if(R()<.006)x.ev.push({m,t:'🥅',s:R()<.5?'h':'a'})});if(m===45)feed('⏸️ Félidő a '+CUR.no+'. fordulóban')}
let FEED=[];function feed(t,x,i){FEED.unshift({t,at:Date.now(),i});FEED=FEED.slice(0,40);if(x&&t.startsWith('⚽')){if(mineIn(i))try{sfx('coin')}catch(e){};if(feat===i)goalFlash=1}}
function mineIn(i){return DB.slips.some(s=>s.rid===CUR.id&&s.picks.some(p=>p.m===i))}
function finish(){const r=CUR;r.state='done';r.ms.forEach(x=>{x.done=true;const T=DB.tab,h=T[x.h],a=T[x.a];h.p++;a.p++;h.gf+=x.st.h;h.ga+=x.st.a;a.gf+=x.st.a;a.ga+=x.st.h;
  const res=x.st.h>x.st.a?['W','L']:x.st.h<x.st.a?['L','W']:['D','D'];[[h,res[0]],[a,res[1]]].forEach(([t,f])=>{t[f==='W'?'w':f==='D'?'d':'l']++;t.form.unshift(f);t.form=t.form.slice(0,5)});
  DB.str[x.h]=Math.max(52,Math.min(92,DB.str[x.h]+(res[0]==='W'?.6:res[0]==='L'?-.6:0)+(R()-.5)*.8));DB.str[x.a]=Math.max(52,Math.min(92,DB.str[x.a]+(res[1]==='W'?.6:res[1]==='L'?-.6:0)+(R()-.5)*.8))});
 if(DB.tab[0].p>=30){DB.season++;DB.tab=TM.map(()=>({p:0,w:0,d:0,l:0,gf:0,ga:0,form:[]}));feed('🏆 Új szezon kezdődik: '+DB.season+'. szezon!')}
 settle(r);store();if(on())render(true)}
function settle(r){let tot=0,nw=0;const done=[];DB.slips.forEach(s=>{if(s.rid!==r.id)return;done.push(s);s.picks.forEach(p=>p.ok=win(p.k,r.ms[p.m].st));let w=0;
  if(s.mode==='sys'){s.combos.forEach(c=>{if(c.every(j=>s.picks[j].ok))w+=s.per*c.reduce((x,j)=>x*s.picks[j].o,1)})}else if(s.picks.every(p=>p.ok))w=s.stake*s.odds*(s.boost||1);
  w=Math.round(w);s.win=w;s.status=w>0?'won':'lost';s.at=Date.now();if(w>0){pay(w);tot+=w;nw++;DB.st.won+=w;DB.st.wins++;DB.st.best=Math.max(DB.st.best,w)}DB.hist.unshift(s)});
 DB.slips=DB.slips.filter(s=>s.rid!==r.id);if(done.length){toast(tot>0?'🎉 NYERTÉL! '+nw+'/'+done.length+' szelvény · +'+ft(tot):'❌ Ebben a fordulóban egyik szelvényed sem nyert.',tot>0);try{sfx(tot>0?'win':'lose')}catch(e){}if(tot>0&&window.ACCXP)ACCXP.add(Math.min(300,40+nw*30),'VSport nyeremény')}}
// ---------- fő időzítő (a panel bezárva is fut) ----------
setInterval(()=>{if(typeof run!=='undefined'&&run){OPEN.kick+=250;if(CUR&&CUR.state==='live')CUR.t0+=250;return}const now=Date.now();if(CUR&&CUR.state==='live'){const m=Math.min(90,Math.floor((now-CUR.t0)/LIVE*90));while(CUR.min<m){CUR.min++;simMinute(CUR,CUR.min)}if(m>=90&&now-CUR.t0>=LIVE)finish()}
 if(now>=OPEN.kick&&(!CUR||CUR.state==='done'))kickoff();if(on())tickUI()},250);
// ---------- kiszállás (cash-out) ----------
function pLive(p,x){if(x.done)return win(p.k,x.st)?1:0;let ok=0;const N=500,left=90-CUR.min;for(let n=0;n<N;n++){const s={h:x.st.h,a:x.st.a,hh:x.st.hh,ha:x.st.ha};const l1=Math.max(0,45-CUR.min),l2=left-l1;const g1=poi(x.lh*l1/90),g2=poi(x.la*l1/90);s.hh+=g1;s.ha+=g2;s.h+=g1+poi(x.lh*l2/90);s.a+=g2+poi(x.la*l2/90);if(win(p.k,s))ok++}return ok/N}
function coVal(s){if(!CUR||s.rid!==CUR.id||CUR.state!=='live'||CUR.min>=88)return 0;const P=s.picks.map(p=>pLive(p,CUR.ms[p.m]));let v=0;
 if(s.mode==='sys')s.combos.forEach(c=>{v+=s.per*c.reduce((x,j)=>x*s.picks[j].o*P[j],1)});else v=s.stake*s.odds*(s.boost||1)*P.reduce((x,y)=>x*y,1);return Math.round(v*.9)}
window.vsCash=id=>{const s=DB.slips.find(x=>x.id===id);if(!s)return;const v=(s._cvT&&Date.now()-s._cvT<2500)?s._cv:coVal(s);if(v<=0)return;pay(v);s.status='cashed';s.win=v;s.at=Date.now();DB.st.won+=v;DB.hist.unshift(s);DB.slips=DB.slips.filter(x=>x!==s);store();try{sfx('buy')}catch(e){}toast('💰 Kiszálltál: +'+ft(v),true);render(true)};
// ---------- szelvény ----------
let lgF=-1,SLIP=[],mode='combo',stake=1000,sysK=2,tab='bet',open1=-1,feat=0,goalFlash=0;
const boostOf=n=>n>=3?Math.min(1.5,1+.05*(n-2)):1;
function combos(n,k){const r=[];const f=(s,c)=>{if(c.length===k){r.push(c.slice());return}for(let i=s;i<n;i++){c.push(i);f(i+1,c);c.pop()}};f(0,[]);return r}
function slipCalc(){const n=SLIP.length,dup=new Set(SLIP.map(p=>p.m)).size!==n;let need=0,maxW=0,odds=1,boost=1,cs=null;
 if(mode==='single'){need=stake*n;maxW=SLIP.reduce((x,p)=>x+stake*p.o,0)}
 else if(mode==='combo'){odds=SLIP.reduce((x,p)=>x*p.o,1);boost=boostOf(n);need=n?stake:0;maxW=n?stake*odds*boost:0}
 else{const k=Math.min(sysK,Math.max(2,n-1));cs=n>=3?combos(n,k):[];need=stake*cs.length;maxW=cs.reduce((x,c)=>x+stake*c.reduce((y,j)=>y*SLIP[j].o,1),0)}
 return{n,dup,need,maxW,odds,boost,cs}}
window.vsPick=(i,k)=>{const x=OPEN.ms[i];const ex=SLIP.findIndex(p=>p.m===i&&p.k===k);if(ex>=0)SLIP.splice(ex,1);else{if(SLIP.length>=12){toast('Legfeljebb 12 tipp lehet egy szelvényen.');return}SLIP.push({m:i,k,o:x.o[k],mt:TM[x.h][1]+' – '+TM[x.a][1],t:lbl(k),g:grpOf(k)})}try{sfx('click')}catch(e){}render(true)};
const grpOf=k=>(GRP.find(g=>(g[1]||CSK).includes(k))||['?'])[0].replace(/^\S+\s/,'');
window.vsDel=j=>{SLIP.splice(j,1);render(true)};window.vsClear=()=>{SLIP=[];render(true)};
window.vsMode=m=>{mode=m;render(true)};window.vsStake=v=>{stake=Math.max(100,Math.round(v)||100);render(true)};window.vsSys=k=>{sysK=k;render(true)};
window.vsTab=t=>{tab=t;render(true)};window.vsLg=l=>{lgF=l;render(true)};window.vsOpen=i=>{open1=open1===i?-1:i;render(true)};window.vsFeat=i=>{feat=i;render(true)};
window.vsLucky=()=>{SLIP=[];const n=3+(R()*3|0),idx=OPEN.ms.map((x,i)=>x.o?i:-1).filter(i=>i>=0).sort(()=>R()-.5).slice(0,n);idx.forEach(i=>{const ks=['1','X','2','O25','U25','GG','1X','X2'],k=ks[R()*ks.length|0];const x=OPEN.ms[i];SLIP.push({m:i,k,o:x.o[k],mt:TM[x.h][1]+' – '+TM[x.a][1],t:lbl(k),g:grpOf(k)})});mode='combo';render(true)};
window.vsPlace=()=>{const c=slipCalc();if(!c.n)return;if(c.dup&&mode!=='single'){toast('Kötésben / rendszerben egy meccsről csak egy tipp lehet!');return}if(mode==='sys'&&c.n<3){toast('Rendszerhez legalább 3 tipp kell.');return}
 if(c.need>bal()){toast('Nincs elég forintod! ('+ft(c.need)+')');return}if(Date.now()>OPEN.kick-1000){toast('A forduló már indul – várd meg a következőt!');return}
 pay(-c.need);const base={rid:OPEN.id,rno:OPEN.no,at:Date.now(),status:'open'};const nid=()=>Date.now().toString(36)+(R()*1e6|0).toString(36);
 if(mode==='single')SLIP.forEach(p=>DB.slips.push(Object.assign({id:nid(),mode:'single',picks:[Object.assign({},p)],stake,odds:p.o},base)));
 else if(mode==='combo')DB.slips.push(Object.assign({id:nid(),mode:'combo',picks:SLIP.map(p=>Object.assign({},p)),stake,odds:c.odds,boost:c.boost},base));
 else DB.slips.push(Object.assign({id:nid(),mode:'sys',k:Math.min(sysK,c.n-1),picks:SLIP.map(p=>Object.assign({},p)),per:stake,stake:c.need,combos:c.cs,odds:c.maxW/c.need},base));
 DB.st.bets++;DB.st.stake+=c.need;store();try{sfx('buy')}catch(e){}toast('✅ Szelvény leadva: '+ft(c.need)+(mode==='single'&&c.n>1?' ('+c.n+' fogadás)':''),true);SLIP=[];render(true)};
// ---------- megjelenés ----------
const css=document.createElement('style');css.textContent=`
#vs2{position:fixed;inset:0;z-index:2147483000;display:none;font-family:Rajdhani,Arial;color:#fff;background:radial-gradient(1200px 700px at 20% -10%,#14532d 0%,#06140d 50%,#020604 100%)}
#vs2.on{display:flex;flex-direction:column}
#v2Top{display:flex;align-items:center;gap:12px;padding:10px 18px;background:linear-gradient(#000c,#0000);flex-wrap:wrap}
#v2Top .lg{font:32px 'Luckiest Guy',Impact;background:linear-gradient(180deg,#bbf7d0,#22c55e);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #052e16)}
#v2Top .lg small{font:700 13px Rajdhani;color:#86efac;-webkit-text-fill-color:#86efac;margin-left:6px}
.v2chip{padding:6px 12px;border-radius:999px;background:#0009;border:1px solid #ffffff22;font:700 15px Rajdhani;display:flex;gap:6px;align-items:center}
.v2chip.live{border-color:#ef4444;color:#fecaca}.v2chip.live b{width:9px;height:9px;border-radius:50%;background:#ef4444;animation:v2p 1s infinite}@keyframes v2p{50%{opacity:.3}}
#v2Bal{margin-left:auto;font:22px 'Luckiest Guy',Impact;color:#a3e635;background:#0009;padding:6px 14px;border-radius:12px;border:1px solid #4ade8055}
#v2X{border:0;border-radius:10px;width:44px;height:44px;background:#ef4444;color:#fff;font-size:22px;cursor:pointer}
#v2Tabs{display:flex;gap:6px;padding:0 18px 8px}#v2Tabs button{border:1px solid #ffffff1c;border-radius:10px;padding:8px 14px;background:#0b1f17;color:#d1fae5;font:700 16px Rajdhani;cursor:pointer;position:relative}
#v2Tabs button.on{background:linear-gradient(#4ade80,#16a34a);color:#04210f;border-color:#86efac}#v2Tabs button i{position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border-radius:999px;font:700 11px Rajdhani;padding:1px 6px;font-style:normal}
#v2Body{flex:1;display:grid;grid-template-columns:1fr 360px;gap:14px;padding:0 18px 16px;min-height:0}
#v2Main{overflow:auto;min-height:0;padding-right:4px}#v2Side{overflow:auto;min-height:0}
.v2M{background:#0b1f17d9;border:1px solid #ffffff14;border-radius:14px;padding:10px 12px;margin-bottom:8px}
.v2Row{display:grid;grid-template-columns:1fr 64px 1fr repeat(3,62px) 8px repeat(3,62px) 44px;gap:5px;align-items:center}
.v2T{font-weight:800;font-size:16px;display:flex;align-items:center;gap:6px;min-width:0}.v2T span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v2T i{width:12px;height:12px;border-radius:3px;flex:none}
.v2F{display:flex;gap:2px;margin-top:2px}.v2F b{width:13px;height:13px;border-radius:3px;font:700 9px Rajdhani;display:flex;align-items:center;justify-content:center;color:#000}
.v2S{text-align:center;font:22px 'Luckiest Guy',Impact;line-height:1}.v2S small{display:block;font:700 11px Rajdhani;color:#4ade80}
.v2O{border:0;border-radius:8px;padding:5px 0;background:#1e293b;color:#fff;cursor:pointer;font:800 15px Rajdhani;line-height:1.05;transition:.1s}.v2O small{display:block;font-size:10.5px;color:#94a3b8;font-weight:700}
.v2O:hover{background:#334155}.v2O.sel{background:linear-gradient(#86efac,#22c55e);color:#04210f}.v2O.sel small{color:#065f46}
.v2More{border:1px solid #ffffff22;border-radius:8px;background:#0f172a;color:#86efac;font:800 13px Rajdhani;cursor:pointer;padding:6px 0}
.v2Mk{margin-top:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:8px}.v2Mk .g{background:#06140d;border-radius:10px;padding:8px}.v2Mk .g h5{margin:0 0 6px;font:700 13px Rajdhani;color:#86efac}
.v2Mk .g div{display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:4px}
.v2H{display:flex;justify-content:space-between;align-items:center;margin:2px 0 8px;font:700 14px Rajdhani;color:#86efac}
#v2Slip{background:linear-gradient(#0f2a1c,#08170f);border:1px solid #4ade8055;border-radius:16px;padding:12px;box-shadow:0 10px 30px #000a}
#v2Slip h3{margin:0;font:22px 'Luckiest Guy',Impact;color:#4ade80;display:flex;justify-content:space-between;align-items:center}#v2Slip h3 button{font:700 12px Rajdhani;background:#334155;color:#fff;border:0;border-radius:6px;padding:3px 8px;cursor:pointer}
.v2Seg{display:flex;background:#020617;border-radius:10px;padding:3px;margin:8px 0}.v2Seg button{flex:1;border:0;border-radius:8px;padding:7px 0;background:none;color:#94a3b8;font:800 14px Rajdhani;cursor:pointer}.v2Seg button.on{background:#facc15;color:#1c1300}
.v2Pk{display:flex;gap:8px;align-items:center;background:#0b1f17;border-radius:10px;padding:7px 8px;margin-bottom:5px;font-size:14px}.v2Pk div{flex:1;min-width:0}.v2Pk small{display:block;color:#94a3b8;font-size:12px}.v2Pk b.o{color:#facc15;font-size:16px}
.v2Pk button{border:0;background:#7f1d1d;color:#fff;border-radius:6px;width:24px;height:24px;cursor:pointer}
.v2Ch{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.v2Ch button{border:0;border-radius:8px;padding:6px 9px;background:#1e293b;color:#fff;font:800 13px Rajdhani;cursor:pointer}.v2Ch button.on{background:#facc15;color:#111}
.v2Ln{display:flex;justify-content:space-between;font-size:14px;padding:4px 0;border-bottom:1px solid #ffffff10}
#v2Go{width:100%;margin-top:10px;padding:13px;border:0;border-radius:12px;background:linear-gradient(#86efac,#16a34a);color:#04210f;font:22px 'Luckiest Guy',Impact;cursor:pointer;box-shadow:0 4px 0 #14532d}#v2Go:disabled{filter:grayscale(1);opacity:.55;cursor:default}
.v2Btn{border:0;border-radius:10px;padding:8px 12px;font:800 14px Rajdhani;cursor:pointer;background:#1e293b;color:#fff}
.v2Lv{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:8px}
.v2Lc{background:#0b1f17d9;border:1px solid #ffffff14;border-radius:12px;padding:8px 10px;cursor:pointer}.v2Lc.ft{border-color:#facc15}.v2Lc .r{display:flex;justify-content:space-between;align-items:center;font-weight:800}
.v2Lc .ev{font-size:12px;color:#94a3b8;margin-top:4px;min-height:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v2Lc.mine{box-shadow:inset 3px 0 0 #4ade80}
.v2Bar{height:6px;border-radius:4px;background:#1e293b;overflow:hidden;margin-top:5px;display:flex}.v2Bar i{display:block;height:100%}
#v2Pitch{width:100%;height:220px;border-radius:14px;display:block;margin-bottom:8px;background:#166534}
.v2Feed div{font-size:14px;padding:4px 0;border-bottom:1px solid #ffffff0d}
.v2Sl{background:#0b1f17d9;border:1px solid #ffffff14;border-radius:12px;padding:10px;margin-bottom:8px}.v2Sl .hd{display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px}
.v2Sl .p{display:flex;justify-content:space-between;font-size:13px;padding:2px 0}.v2Sl .p.ok{color:#4ade80}.v2Sl .p.no{color:#f87171}
.v2Tb{width:100%;border-collapse:collapse;font-size:15px}.v2Tb th{color:#86efac;text-align:center;padding:6px;font-size:13px}.v2Tb td{text-align:center;padding:6px;border-top:1px solid #ffffff10}.v2Tb td.n{text-align:left;font-weight:800}.v2Tb tr:nth-child(2) td{background:#facc1512}
.v2St{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}.v2St div{background:#0b1f17d9;border-radius:14px;padding:14px;text-align:center}.v2St b{display:block;font:28px 'Luckiest Guy',Impact;color:#facc15}.v2St small{color:#94a3b8;font-weight:700}
#v2Toast{position:absolute;left:50%;top:70px;transform:translateX(-50%);background:#0b1f17;border:2px solid #4ade80;border-radius:14px;padding:10px 18px;font:800 18px Rajdhani;opacity:0;transition:.3s;pointer-events:none;z-index:2;box-shadow:0 10px 30px #000}
#v2Toast.bad{border-color:#ef4444}#v2Toast.on{opacity:1}
@media (max-width:1100px){#v2Body{grid-template-columns:1fr}.v2Row{grid-template-columns:1fr 54px 1fr repeat(3,52px) 44px}.v2Row .ou{display:none}}`;document.head.appendChild(css);
const D=document.createElement('div');D.id='vs2';D.innerHTML='<div id="v2Top"><span class="lg">⚽ VSPORT<small>2.0 · virtuális bajnokság · csak játékbeli Ft</small></span><span class="v2chip" id="v2Live"></span><span class="v2chip" id="v2Next"></span><span id="v2Bal"></span><button id="v2X" title="Bezárás (Esc)">✕</button></div><div id="v2Tabs"></div><div id="v2Body"><div id="v2Main"></div><div id="v2Side"></div></div><div id="v2Toast"></div>';document.body.appendChild(D);
const $$=i=>document.getElementById(i);const on=()=>D.classList.contains('on');
$$('v2X').onclick=()=>D.classList.remove('on');addEventListener('keydown',e=>{if(e.key==='Escape'&&on()){D.classList.remove('on');e.stopImmediatePropagation()}},true);
let tT=0;function toast(t,good){const e=$$('v2Toast');e.textContent=t;e.className=(good===false?'bad ':'')+'on';clearTimeout(tT);tT=setTimeout(()=>e.className='',3200)}
window.openVSport=()=>{D.classList.add('on');render(true)};
const fmtT=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const formH=t=>'<div class="v2F">'+DB.tab[t].form.slice(0,5).map(f=>'<b style="background:'+(f==='W'?'#4ade80':f==='D'?'#facc15':'#f87171')+'">'+(f==='W'?'GY':f==='D'?'D':'V')+'</b>').join('')+'</div>';
const team=(t,right)=>'<div class="v2T" style="'+(right?'justify-content:flex-end;text-align:right':'')+'">'+(right?'':'<i style="background:'+TM[t][2]+'"></i>')+'<div style="min-width:0"><span>'+esc(TM[t][0])+'</span>'+formH(t)+'</div>'+(right?'<i style="background:'+TM[t][2]+'"></i>':'')+'</div>';
const sel=(i,k)=>SLIP.some(p=>p.m===i&&p.k===k);
const ob=(i,k,x,cls)=>'<button class="v2O'+(sel(i,k)?' sel':'')+(cls?' '+cls:'')+'" onclick="vsPick('+i+',\''+k+'\')"><small>'+(SHORT[k]||lbl(k))+'</small>'+x.o[k].toFixed(2)+'</button>';
function render(full){if(!on())return;$$('v2Bal').textContent='💵 '+ft(bal());
 const nOpen=DB.slips.length;$$('v2Tabs').innerHTML=[['bet','🏟️ Fogadás'],['live','📺 Élő'],['my','🎫 Szelvényeim'+(nOpen?'<i>'+nOpen+'</i>':'')],['tab','📊 Tabella'],['st','🏆 Statisztika']].map(([k,n])=>'<button class="'+(tab===k?'on':'')+'" onclick="vsTab(\''+k+'\')">'+n+'</button>').join('');
 const M=$$('v2Main');
 if(tab==='bet'){M.innerHTML='<div class="v2H"><span>🗓️ '+OPEN.no+'. forduló · '+DB.season+'. szezon · '+OPEN.ms.length+' meccs · 3 bajnokság</span><span>Kezdés: <b id="v2Cd" style="color:#facc15"></b> · <button class="v2Btn" onclick="vsLucky()">🎲 Szerencse-szelvény</button></span></div>'+
  '<div class="v2Ch" style="margin-bottom:8px">'+[-1,0,1,2].map(l=>'<button class="'+(lgF===l?'on':'')+'" onclick="vsLg('+l+')">'+(l<0?'🌍 Mind ('+OPEN.ms.length+')':LGN[l]+' ('+OPEN.ms.filter(x=>x.lg===l).length+')')+'</button>').join('')+'</div>'+OPEN.ms.map((x,i)=>(lgF>=0&&x.lg!==lgF)?'':((i===0||OPEN.ms[i-1].lg!==x.lg)?'<div class="v2H" style="margin-top:10px"><span style="font-size:17px;color:#fde68a">'+LGN[x.lg]+'</span></div>':'')+(!x.o?'<div class="v2M" style="color:#94a3b8">⏳ '+esc(TM[x.h][0])+' – '+esc(TM[x.a][0])+': szorzók számolása…</div>':'<div class="v2M"><div class="v2Row">'+team(x.h)+'<div class="v2S" style="font-size:15px;color:#94a3b8">VS<small>'+Math.round(DB.str[x.h])+' – '+Math.round(DB.str[x.a])+'</small></div>'+team(x.a,1)+ob(i,'1',x)+ob(i,'X',x)+ob(i,'2',x)+'<span></span>'+ob(i,'O25',x,'ou')+ob(i,'U25',x,'ou')+ob(i,'GG',x,'ou')+'<button class="v2More" onclick="vsOpen('+i+')">'+(open1===i?'▲':'+'+(CSK.length+20))+'</button></div>'+
   (open1===i?'<div class="v2Mk">'+GRP.map(([g,ks])=>'<div class="g"'+(ks?'':' style="grid-column:1/-1"')+'><h5>'+g+'</h5><div>'+(ks||CSK).map(k=>ob(i,k,x)).join('')+'</div></div>').join('')+'</div>':'')+'</div>')).join('')}
 else if(tab==='live'){if(!CUR||full||!$$('v2Pitch')){M.innerHTML=CUR?'<div class="v2Ch" style="margin-bottom:8px">'+[-1,0,1,2].map(l=>'<button class="'+(lgF===l?'on':'')+'" onclick="vsLg('+l+')">'+(l<0?'🌍 Mind':LGN[l])+'</button>').join('')+'</div><canvas id="v2Pitch" width="900" height="220"></canvas><div class="v2H"><span id="v2FeatT"></span><span>Kattints egy meccsre a kiemeléshez</span></div><div class="v2Lv" id="v2Lv"></div><div class="v2M v2Feed" id="v2Feed" style="margin-top:8px"></div>':'<div class="v2M" style="text-align:center;padding:40px;font-size:18px">⏳ Még nem indult forduló. Az első kezdés: <b id="v2Cd" style="color:#facc15"></b><br><br>Addig is adj le egy szelvényt a 🏟️ Fogadás fülön!</div>'}liveUI()}
 else if(tab==='my'){const card=(s,live)=>{const v=live?coVal(s):0;if(live){s._cv=v;s._cvT=Date.now()}const r=CUR&&s.rid===CUR.id?CUR:null;return'<div class="v2Sl"><div class="hd"><span>'+({single:'📄 Egyszeres',combo:'🔗 Kötés',sys:'🧮 Rendszer '+s.k+'/'+s.picks.length}[s.mode])+' · '+s.rno+'. forduló</span><span style="color:'+({won:'#4ade80',lost:'#f87171',cashed:'#facc15',refund:'#94a3b8'}[s.status]||'#fde68a')+'">'+({open:'⏳ FOLYAMATBAN',won:'✅ NYERT +'+ft(s.win),lost:'❌ VESZTETT',cashed:'💰 KISZÁLLT +'+ft(s.win),refund:'↩️ VISSZATÉRÍTVE'}[s.status])+'</span></div>'+
  s.picks.map(p=>{let c='',st='';if(p.ok!==undefined)c=p.ok?'ok':'no';else if(r&&r.state!=='open'){const x=r.ms[p.m];st=' ('+x.st.h+':'+x.st.a+' '+r.min+"')";c=win(p.k,x.st)?'ok':''}return'<div class="p '+c+'"><span>'+esc(p.mt)+st+' · '+esc(p.g)+': <b>'+esc(p.t)+'</b></span><b>'+p.o.toFixed(2)+'</b></div>'}).join('')+
  '<div class="v2Ln"><span>Tét: '+ft(s.stake)+(s.boost>1?' · 🚀 +'+Math.round((s.boost-1)*100)+'% bónusz':'')+'</span><span>'+(s.mode==='sys'?'Max.: ':'Szorzó: ')+(s.mode==='sys'?ft(s.combos.reduce((x,c)=>x+s.per*c.reduce((y,j)=>y*s.picks[j].o,1),0)):(s.odds*(s.boost||1)).toFixed(2))+'</span></div>'+
  (live&&v>0?'<button class="v2Btn" style="width:100%;margin-top:6px;background:linear-gradient(#fde68a,#f59e0b);color:#1c1300" onclick="vsCash(\''+s.id+'\')">💰 KISZÁLLÁS MOST: '+ft(v)+'</button>':'')+'</div>'};
  M.innerHTML='<div class="v2H"><span>⏳ Folyamatban lévő szelvények ('+DB.slips.length+')</span></div>'+(DB.slips.length?DB.slips.map(s=>card(s,true)).join(''):'<div class="v2M" style="color:#94a3b8">Nincs nyitott szelvényed.</div>')+'<div class="v2H" style="margin-top:12px"><span>📜 Lezárt szelvények</span></div>'+(DB.hist.length?DB.hist.slice(0,25).map(s=>card(s,false)).join(''):'<div class="v2M" style="color:#94a3b8">Még nincs lezárt szelvényed.</div>')}
 else if(tab==='tab'){const tl=lgF<0?0:lgF;const rows=DB.tab.map((t,i)=>({i,...t,pt:t.w*3+t.d,gd:t.gf-t.ga})).filter(r=>TM[r.i][3]===tl).sort((a,b)=>b.pt-a.pt||b.gd-a.gd||b.gf-a.gf);
  M.innerHTML='<div class="v2Ch" style="margin-bottom:8px">'+[0,1,2].map(l=>'<button class="'+(tl===l?'on':'')+'" onclick="vsLg('+l+')">'+LGN[l]+'</button>').join('')+'</div><div class="v2H"><span>📊 '+LGN[tl]+' · '+DB.season+'. szezon ('+(DB.tab[0].p)+'/30 forduló)</span></div><div class="v2M"><table class="v2Tb"><tr><th>#</th><th style="text-align:left">Csapat</th><th>M</th><th>GY</th><th>D</th><th>V</th><th>LG</th><th>KG</th><th>GK</th><th>PONT</th><th>Forma</th><th>Erő</th></tr>'+
  rows.map((r,n)=>'<tr><td>'+(n+1)+'</td><td class="n"><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+TM[r.i][2]+'"></i> '+esc(TM[r.i][0])+'</td><td>'+r.p+'</td><td>'+r.w+'</td><td>'+r.d+'</td><td>'+r.l+'</td><td>'+r.gf+'</td><td>'+r.ga+'</td><td>'+(r.gd>0?'+':'')+r.gd+'</td><td><b style="color:#facc15">'+r.pt+'</b></td><td>'+formH(r.i).replace('v2F"','v2F" style="justify-content:center"')+'</td><td>'+Math.round(DB.str[r.i])+'</td></tr>').join('')+'</table></div>'}
 else{const s=DB.st,pr=s.won-s.stake;M.innerHTML='<div class="v2H"><span>🏆 A te VSport-statisztikád</span></div><div class="v2St"><div><b>'+s.bets+'</b><small>Leadott szelvény</small></div><div><b>'+ft(s.stake)+'</b><small>Összes tét</small></div><div><b>'+ft(s.won)+'</b><small>Összes nyeremény</small></div><div><b style="color:'+(pr>=0?'#4ade80':'#f87171')+'">'+(pr>=0?'+':'')+ft(pr)+'</b><small>Egyenleg</small></div><div><b>'+ft(s.best)+'</b><small>Legnagyobb nyeremény</small></div><div><b>'+(s.bets?Math.round(s.wins/s.bets*100):0)+'%</b><small>Nyerési arány</small></div></div><div class="v2M" style="margin-top:12px;color:#94a3b8;font-size:14px">ℹ️ A VSport csak játékbeli forinttal működik. A szorzók a csapatok erejéből és formájából számolódnak, a meccsek véletlenszerűek – a ház mindig nyer egy kicsit (8%).</div>'}
 sideUI();tickUI()}
function sideUI(){const c=slipCalc(),n=c.n,S2=$$('v2Side');
 S2.innerHTML='<div id="v2Slip"><h3>🎫 SZELVÉNY <span>'+(n?'<button onclick="vsClear()">🗑️ Törlés</button>':'')+'</span></h3><div class="v2Seg"><button class="'+(mode==='single'?'on':'')+'" onclick="vsMode(\'single\')">📄 Egyenként</button><button class="'+(mode==='combo'?'on':'')+'" onclick="vsMode(\'combo\')">🔗 Kötés</button><button class="'+(mode==='sys'?'on':'')+'" onclick="vsMode(\'sys\')">🧮 Rendszer</button></div>'+
 '<div style="font-size:12px;color:#94a3b8;margin-bottom:6px">'+({single:'Minden tipp külön fogadás – amelyik bejön, azt kifizetjük.',combo:'Minden tippnek be kell jönnie, a szorzók összeszorzódnak. 3 tipptől 🚀 kötésbónusz (tippenként +5%, max. +50%)!',sys:'Biztonsági háló: a tippekből minden '+Math.min(sysK,Math.max(2,n-1))+'-es kombináció külön kötés. Nem kell mindennek bejönnie!'})[mode]+'</div>'+
 (n?SLIP.map((p,j)=>'<div class="v2Pk"><div><small>'+esc(p.mt)+' · '+esc(p.g)+'</small>'+esc(p.t)+'</div><b class="o">'+p.o.toFixed(2)+'</b><button onclick="vsDel('+j+')">✕</button></div>').join(''):'<div style="color:#94a3b8;padding:14px 4px;text-align:center">👆 Kattints a szorzókra!<br>Akár 12 meccsre is fogadhatsz egy szelvényen, 3 bajnokságból.</div>')+
 (mode==='sys'&&n>=3?'<div style="font-size:13px;color:#cbd5e1">Rendszer:</div><div class="v2Ch">'+[...Array(n-2).keys()].map(q=>q+2).map(k=>'<button class="'+(Math.min(sysK,n-1)===k?'on':'')+'" onclick="vsSys('+k+')">'+k+'/'+n+' ('+combos(n,k).length+' db)</button>').join('')+'</div>':'')+
 (c.dup&&mode!=='single'?'<div style="color:#f87171;font-weight:700;font-size:13px">⚠️ Egy meccsről több tipp van – kötéshez/rendszerhez meccsenként csak egy lehet.</div>':'')+
 '<div style="font-size:13px;color:#cbd5e1;margin-top:6px">'+(mode==='combo'?'Tét:':mode==='sys'?'Tét kombinációnként:':'Tét tippenként:')+'</div><div class="v2Ch">'+[200,1000,5000,20000,100000].map(v=>'<button class="'+(v===stake?'on':'')+'" onclick="vsStake('+v+')">'+(v>=1000?v/1000+'e':v)+'</button>').join('')+'<button onclick="vsStake(Math.floor(S.c/Math.max(1,'+(mode==='combo'?1:mode==='sys'?(c.cs?c.cs.length:1)||1:n||1)+')))">MAX</button></div>'+
 '<input id="v2Inp" type="number" min="100" step="100" value="'+stake+'" style="width:100%;padding:8px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;font:700 16px Rajdhani" onchange="vsStake(this.value)">'+
 (mode==='combo'?'<div class="v2Ln"><span>Összesített szorzó</span><b>'+c.odds.toFixed(2)+'</b></div>'+(c.boost>1?'<div class="v2Ln"><span>🚀 Kötésbónusz</span><b style="color:#4ade80">+'+Math.round((c.boost-1)*100)+'%</b></div>':''):'')+
 '<div class="v2Ln"><span>Fizetendő'+(mode!=='combo'&&n?' ('+(mode==='sys'?(c.cs||[]).length:n)+' fogadás)':'')+'</span><b>'+ft(c.need)+'</b></div><div class="v2Ln"><span>'+(mode==='combo'?'Lehetséges nyeremény':'Max. nyeremény')+'</span><b style="color:#facc15;font-size:18px">'+ft(c.maxW)+'</b></div>'+
 '<button id="v2Go" onclick="vsPlace()" '+(n&&c.need<=bal()&&!(c.dup&&mode!=='single')&&!(mode==='sys'&&n<3)?'':'disabled')+'>'+(c.need>bal()?'NINCS ELÉG FORINT':'✔ FOGADÁS LEADÁSA')+'</button><div style="text-align:center;font-size:12px;color:#94a3b8;margin-top:6px">A '+OPEN.no+'. fordulóra · kezdés: <b id="v2Cd2"></b></div></div>'}
function liveUI(){if(!CUR)return;const r=CUR;
 const lv=$$('v2Lv');if(lv)lv.innerHTML=r.ms.map((x,i)=>{if(lgF>=0&&x.lg!==lgF)return'';const last=x.ev.filter(e=>e.t!=='🟨').slice(-2).map(e=>e.t+' '+e.m+"' "+TM[e.s==='h'?x.h:x.a][1]).join(' · ');return'<div class="v2Lc'+(feat===i?' ft':'')+(mineIn(i)?' mine':'')+'" onclick="vsFeat('+i+')"><div class="r"><span style="color:'+TM[x.h][2]+'">'+TM[x.h][1]+'</span><span style="font:20px \'Luckiest Guy\',Impact">'+x.st.h+' : '+x.st.a+'</span><span style="color:'+TM[x.a][2]+'">'+TM[x.a][1]+'</span></div><div style="text-align:center;font:700 12px Rajdhani;color:'+(r.state==='done'?'#94a3b8':'#4ade80')+'">'+(r.state==='done'?'VÉGE':r.min===45?'FÉLIDŐ':r.min+"'")+'</div><div class="v2Bar"><i style="width:'+x.mom*100+'%;background:'+TM[x.h][2]+'"></i><i style="flex:1;background:'+TM[x.a][2]+'"></i></div><div class="ev">'+(last||'&nbsp;')+'</div></div>'}).join('');
 const fd=$$('v2Feed');if(fd)fd.innerHTML='<b style="color:#86efac">📣 Élő események</b>'+(FEED.length?FEED.slice(0,12).map(f=>'<div>'+esc(f.t)+'</div>').join(''):'<div style="color:#94a3b8">Hamarosan...</div>');
 const x=r.ms[feat],ft2=$$('v2FeatT');if(ft2)ft2.innerHTML='⭐ Kiemelt: <b>'+esc(TM[x.h][0])+' '+x.st.h+' : '+x.st.a+' '+esc(TM[x.a][0])+'</b>'}
// élő pálya-animáció
let ball={x:.5,y:.5,vx:0,vy:0},flashT=0;
function drawPitch(){const c=$$('v2Pitch');if(!c||!CUR)return;const g=c.getContext('2d'),W=c.width,H=c.height,x=CUR.ms[feat];
 for(let i=0;i<10;i++){g.fillStyle=i%2?'#15803d':'#16a34a';g.fillRect(i*W/10,0,W/10,H)}g.strokeStyle='#ffffffcc';g.lineWidth=2;g.strokeRect(10,10,W-20,H-20);g.beginPath();g.moveTo(W/2,10);g.lineTo(W/2,H-10);g.stroke();g.beginPath();g.arc(W/2,H/2,36,0,6.283);g.stroke();
 [[10,1],[W-10,-1]].forEach(([gx,s])=>{g.strokeRect(s>0?gx:gx-110,H/2-55,110,110);g.strokeRect(s>0?gx:gx-40,H/2-25,40,50)});
 if(CUR.state==='live'){const tx=x.mom>.5?.82:.18;ball.vx+=(tx-ball.x)*.002+(R()-.5)*.012;ball.vy+=(R()-.5)*.02+(.5-ball.y)*.003;ball.vx*=.92;ball.vy*=.92;ball.x=Math.max(.04,Math.min(.96,ball.x+ball.vx));ball.y=Math.max(.08,Math.min(.92,ball.y+ball.vy))}
 const pl=(cx,cy,col)=>{g.fillStyle=col;g.beginPath();g.arc(cx,cy,7,0,6.283);g.fill();g.strokeStyle='#000a';g.stroke()};
 for(let k=0;k<5;k++){pl(W*(.15+k*.09+(ball.x-.5)*.25),H*(.2+((k*37)%60)/100),TM[x.h][2]);pl(W*(.85-k*.09+(ball.x-.5)*.25),H*(.2+((k*53)%60)/100),TM[x.a][2])}
 g.fillStyle='#fff';g.beginPath();g.arc(ball.x*W,ball.y*H,5,0,6.283);g.fill();
 g.fillStyle='#000a';g.fillRect(W/2-150,6,300,34);g.font='bold 20px Rajdhani';g.textAlign='center';g.fillStyle='#fff';g.fillText(TM[x.h][1]+'  '+x.st.h+' : '+x.st.a+'  '+TM[x.a][1]+'   '+(CUR.state==='done'?'VÉGE':CUR.min+"'"),W/2,30);
 if(goalFlash){flashT=1.2;goalFlash=0;ball={x:.5,y:.5,vx:0,vy:0}}if(flashT>0){flashT-=.03;g.globalAlpha=Math.min(1,flashT);g.font='bold 64px Impact';g.fillStyle='#facc15';g.strokeStyle='#000';g.lineWidth=6;g.strokeText('GÓÓÓL!',W/2,H/2+20);g.fillText('GÓÓÓL!',W/2,H/2+20);g.globalAlpha=1}}
(function anim(){requestAnimationFrame(anim);if(on()&&tab==='live')drawPitch()})();
let lastFull=0;
function tickUI(){const now=Date.now();$$('v2Bal').textContent='💵 '+ft(bal());
 const lv=$$('v2Live');if(CUR&&CUR.state==='live'){lv.className='v2chip live';lv.innerHTML='<b></b> ÉLŐ · '+CUR.no+'. forduló · '+(CUR.min===45?'FÉLIDŐ':CUR.min+"'")}else if(CUR&&CUR.state==='done'){lv.className='v2chip';lv.innerHTML='🏁 '+CUR.no+'. forduló vége'}else{lv.className='v2chip';lv.innerHTML='⏳ Hamarosan kezdünk'}
 $$('v2Next').innerHTML='🗓️ '+OPEN.no+'. forduló kezdése: <b style="color:#facc15">'+fmtT(OPEN.kick-now)+'</b>';['v2Cd','v2Cd2'].forEach(i=>{const e=$$(i);if(e)e.textContent=fmtT(OPEN.kick-now)});
 if(tab==='live')liveUI();if(tab==='my'&&now-lastFull>1000&&DB.slips.length){lastFull=now;const sc=$$('v2Main').scrollTop;render();$$('v2Main').scrollTop=sc}}
// lobby/régi hivatkozások
window._VS2={DB,TM,get OPEN(){return OPEN},get CUR(){return CUR}};
})();
