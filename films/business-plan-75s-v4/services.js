/* Service choreography shares one baseline grid and the same six campaign assets.
   Typography layout/animation masks are handled independently by engine.js. */
(()=>{
const Q0=[930,260,850,478],QP=[1280,230,350,622];
const MAIN=[100,315,720,405];
const CUTS=[[860,315,430,242],[1330,315,430,242]];
const POSTERS=[[860,600,280,280],[1170,600,280,280],[1480,600,280,280]];
const ASSETS=[MAIN,...CUTS,...POSTERS];
const BOARD=[[960,332,248,150],[1245,332,248,150],[1530,332,248,150],[960,552,248,150],[1245,552,248,150],[1530,552,248,150]];
const ROWS=[[1010,315,760,118],[1010,471,760,118],[1010,627,760,118]];
// Each agreed task has one primary item and one matching companion: all six survive.
const PAIRS=[[0,3],[1,4],[5,2]];
const VALUE=[[100,480,660,371],[800,420,450,253],[1290,420,450,253],[800,713,285,285],[1128,713,285,285],[1456,713,285,285]];
function title(s,t,start){G.words(s,100,159,85,t,start,{maxWidth:1720,stagger:.045,speed:.30,fromX:65});}
function videoCard(r,t,i=0,captionAt=null){
 G.video(r,t,{index:i});G.stroke(r,G.C.white,1.5);
 if(captionAt!==null&&t>=captionAt)G.posterWords(r,t,captionAt);
}
function asset(r,i,t){if(i<3)videoCard(r,t,i,i===0?35.65:39.4);else{G.graphic(r,i-3);G.stroke(r,G.C.white,1.5);}}
function tickHead(x,y,w,t,start,end){
 const p=G.clamp((t-start)/(end-start)),xx=x+w*p;G.line(x,y,x+w,y,G.C.gray,1.5);G.line(xx,y-16,xx,y+135,G.C.lime,3);G.rect([xx-7,y-17,14,12],G.C.lime);
}
function quickTimeline(t){
 const C=G.C;G.rect([100,810,1720,155],C.panel);
 for(let i=0;i<25;i++){const x=125+i*69;G.line(x,825,x,i%4===0?843:834,C.gray,1);}
 const trim=G.p(t,26,26.5),snap=G.p(t,27,27.35),xs=[130,570,1025],ws=[418,435,590];
 ['First take','Selected cut','Final take'].forEach((s,i)=>{
  const x=xs[i]-(i===2?85*snap:0),w=ws[i]-(i===1?85*trim:0);
  G.rect([x,861,w,65],i===1?C.lime:C.white);G.text(s,x+20,903,24,C.black,{maxWidth:w-40,font:'Body'});
 });
 if(t>=26&&t<27.4){const xx=1005-85*trim;G.line(xx,851,xx,937,C.lime,5);G.line(xx-12,851,xx+12,851,C.lime,3);G.line(xx-12,937,xx+12,937,C.lime,3);G.cursor(xx+18,899,.8);}
 tickHead(130,849,1610,t,25,28);
}
function quick(t){
 const C=G.C,K=G.K.quick;title(K.name,t,25);
 const r=G.rmix(Q0,QP,G.p(t,28,28.75));videoCard(r,t,0,t>=28.25?28.25:null);
 if(t<28){
  G.words(K.video.replace(' video','\nvideo'),100,420,91,t,25.12,{maxWidth:760,stagger:.055,lineHeight:116,speed:.30,fromX:-80,punch:.10});quickTimeline(t);
 }else if(t<31){
  G.words(K.captions,100,392,88,t,28,{maxWidth:1060,stagger:.055,speed:.30,fromX:-100});
  G.words(K.ratio,100,597,78,t,28.45,{maxWidth:1080,stagger:.055,speed:.30});
  G.line(100,663,100+810*G.p(t,28.5,29),663,C.lime,4);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }else{
  G.words(K.revision,100,350,77,t,31,{maxWidth:1060,stagger:.05,speed:.30});
  const done=G.p(t,32.5,32.95),bubble=[100,414,940,152];G.rect(bubble,C.panel);G.stroke(bubble,C.gray,1.5);
  // Only the feedback transition is clipped. Its final line has measured room inside.
  G.mask(bubble,()=>{
   const up=-done*160;G.text(K.review,128,455+up,24,C.lime,{mono:true});
   G.text(K.feedback,128,518+up,41,C.white,{maxWidth:870,font:'Body'});
   G.check(148,654+up,35,C.lime);G.text(K.complete,198,666+up,40,C.white,{maxWidth:790});
  });
  G.cursor(G.mix(1030,895,G.p(t,32,32.5)),G.mix(589,521,G.p(t,32,32.5)),.8);
  G.price(K.price,100,777,t,31.5);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }
}
function campaign(t){
 const C=G.C,K=G.K.campaign;title(K.name,t,35);
 const big=[100,300,1050,590],establish=G.p(t,35,35.6),split=G.p(t,38,39),main=G.rmix(G.rmix(QP,big,establish),MAIN,split);
 videoCard(main,t,0,t>=35.65?35.65:null);
 if(t<38){
  G.words(K.main,1230,458,65,t,35.55,{maxWidth:590,stagger:.055,speed:.30});
  G.words(K.length,1230,565,62,t,35.95,{maxWidth:590,stagger:.055,speed:.30,color:C.lime});
 }
 if(t>=38){
  CUTS.forEach((target,i)=>{
   const start=38+i*.5;if(t<start)return;const p=G.p(t,start,start+.9),r=G.rmix(main,target,p);
   videoCard(r,t,p<.18?0:i+1,t>=39.4?39.4:null);
  });
  if(t<41)G.words(K.cutdowns,100,850,68,t,38,{maxWidth:1020,stagger:.05,speed:.30});
 }
 if(t>=41){
  POSTERS.forEach((target,i)=>{
   const start=41+i*.5;if(t<start)return;
   const origin=[MAIN[0]+MAIN[2]-110,MAIN[1]+MAIN[3]-110,110,110],r=G.rmix(origin,target,G.p(t,start,start+.45));
   G.graphic(r,i);G.stroke(r,C.white,1.5);
  });
  if(t<43)G.words(K.graphics,100,850,65,t,41,{maxWidth:970,stagger:.05,speed:.30});
 }
 if(t>=43){
  G.words(K.tagline,100,237,44,t,42.7,{maxWidth:1720,stagger:.025,speed:.28});
  G.price(K.price,100,853,t,43);
  G.text(K.main,100,766,30,C.white,{font:'Body'});
  G.text(K.cutdowns,860,283,28,C.white,{font:'Body'});
  G.text(K.graphics,860,953,28,C.white,{font:'Body'});
 }
}
function calendarBackdrop(t,out=1){
 const C=G.C,K=G.K.interface,en=G.p(t,46,47.1)*out;if(en<=0)return;
 G.mask([900,215,920*en,608],()=>{
  G.rect([900,215,920,608],C.panel);K.days.forEach((day,i)=>G.text(day,931+i*178,269,26,C.white,{maxWidth:160,font:'Body'}));
  for(let i=1;i<5;i++)G.line(900+i*184,289,900+i*184,823,'#45453E',1);
  for(let j=0;j<3;j++)G.line(900,289+j*178,1820,289+j*178,'#45453E',1);
 });
}
function plannedTiles(t){calendarBackdrop(t);ASSETS.forEach((old,i)=>asset(G.rmix(old,BOARD[i],G.p(t,46+i*.04,47.05+i*.04)),i,t));}
function queueTarget(i){
 let row=0,side=0;PAIRS.forEach((pair,j)=>{if(pair[0]===i){row=j;side=0;}if(pair[1]===i){row=j;side=1;}});
 const r=ROWS[row];return [r[0]+(side?r[2]-198:12),r[1]+12,94,94];
}
function queue(t,exit=0){
 const C=G.C,K=G.K.monthly,join=G.p(t,49,49.85);
 calendarBackdrop(t,1-G.p(t,49,49.7));
 ROWS.forEach((target,i)=>{
  const r=G.rmix(BOARD[i],target,join);if(exit<1){const panel=r.slice();panel[2]*=1-exit;G.rect(panel,C.panel);G.stroke(panel,C.gray,1.5);}
  if(t<49.4||exit>0)return;
  G.mask(r,()=>{
   G.words(K.tasks[i],r[0]+145,r[1]+51,34,t,49.4+i*.04,{maxWidth:Math.max(1,r[2]-360),font:'Body',speed:.27,stagger:.04});
   if(t>=49.65)G.text(K.allocations[i]+'h',r[0]+r[2]-28,r[1]+54,33,C.lime,{mono:true,align:'right'});
   const done=G.p(t,52+i*.18,52.55+i*.18);if(done>0)G.check(r[0]+r[2]-48,r[1]+91,24*done,C.lime);
  });
 });
 // Same six IDs, same preceding-frame geometry: no poster deletion at49seconds.
 ASSETS.forEach((_,i)=>asset(G.rmix(BOARD[i],queueTarget(i),G.p(t,49+(i%3)*.025,49.85+(i%3)*.025)),i,t));
}
function monthBar(t,y=863){
 const C=G.C,K=G.K.monthly,total=1720,fill=G.p(t,49.5,52.1);let x=100;
 G.text(K.allocated.replace('20 / 20',Math.round(fill*20)+' / 20'),100,y-37,30,C.white,{mono:true});G.rect([100,y,total,34],C.panel);
 K.allocations.forEach((hours,i)=>{const w=total*hours/20;G.mask([100,y,total*fill,34],()=>G.rect([x,y,w-5,34],i===1?C.white:C.lime));x+=w;});
 G.text('20h max',1820,y+80,29,C.white,{mono:true,align:'right'});
}
function monthly(t){
 const C=G.C,K=G.K.monthly;title(K.name,t,46);
 if(t<49){
  G.words(K.regular.replace(' support','\nsupport'),100,390,83,t,46.2,{maxWidth:770,stagger:.055,lineHeight:111,speed:.30,fromX:-75});plannedTiles(t);
 }else{
  queue(t);
  if(t<52){
   G.words(K.hours.replace(' / month','\n/ month'),100,380,76,t,49,{maxWidth:840,stagger:.05,lineHeight:108,speed:.30});
   G.words(K.work,100,640,46,t,49.65,{maxWidth:840,stagger:.045,speed:.30,color:C.lime});
  }else{
   G.words(K.agreed.replace(' in advance','\nin advance'),100,374,77,t,52,{maxWidth:840,stagger:.055,lineHeight:110,speed:.30});
   G.price(K.price,100,694,t,52);
  }
  monthBar(t,863);
 }
}
function value(t){
 const C=G.C,K=G.K,move=G.p(t,55,55.9),exit=G.p(t,55,55.35);
 // Rows collapse around their surviving thumbnails as the six assets move outward.
 if(exit<1)ROWS.forEach(r=>{G.rect([r[0],r[1],r[2]*(1-exit),r[3]],C.panel);});
 ASSETS.forEach((_,i)=>asset(G.rmix(queueTarget(i),VALUE[i],move),i,t));
 G.words(K.value[0],100,236,101,t,55,{maxWidth:1720,stagger:.06,speed:.30,punch:.08});
 G.words(K.value[1],100,363,101,t,56.6,{maxWidth:1720,stagger:.06,speed:.32,color:C.lime});
}
function document(r){
 const C=G.C;G.rect(r,C.white);G.mask(r,()=>{G.text(G.K.process[0],r[0]+35,r[1]+72,43,C.black,{maxWidth:r[2]-70});
  for(let i=0;i<4;i++)G.rect([r[0]+35,r[1]+115+i*39,(r[2]-70)*(i===3?.62:1),10],i===0?C.black:'#A5A59A');
  G.check(r[0]+r[2]-57,r[1]+r[3]-52,40,C.black);
 });
}
function process(t){
 const C=G.C,K=G.K,project=[1040,280,720,405],toProject=G.p(t,59,59.7);
 // Companion work exits in two short directional groups; it does not vanish at the cut.
 if(t<59.6){for(let i=1;i<6;i++){
  const old=VALUE[i],end=i<3?[2040+(i-1)*110,old[1],old[2],old[3]]:[old[0],1160+(i-3)*60,old[2],old[3]];
  asset(G.rmix(old,end,G.p(t,59+(i%3)*.025,59.42+(i%3)*.025)),i,t);
 }}
 const r=G.rmix(VALUE[0],project,toProject);videoCard(r,t,0,35.65);
 K.process.forEach((s,i)=>{const active=t>=59+i;G.text(s,100+i*600,166,66,active?C.white:'#57574F',{maxWidth:500});if(i<2)G.arrow(601+i*600,141,55,active?C.lime:'#57574F',0);});
 if(t<60){
  const doc=G.rmix([-720,480,660,371],[100,280,740,470],toProject);document(doc);
  G.words('Your brief',100,864,55,t,59.25,{maxWidth:760,speed:.30,stagger:.05});
 }else if(t<61){
  const b=[100,314,800,240];G.rect(b,C.panel);G.stroke(b,C.lime,1.5);
  G.words('Review',135,378,44,t,60,{maxWidth:720,color:C.lime,speed:.28});
  G.words('Tighter ending, please.',135,472,44,t,60.05,{maxWidth:720,speed:.28,stagger:.04,font:'Body'});
  G.cursor(G.mix(830,1540,G.p(t,60.25,60.7)),G.mix(581,657,G.p(t,60.25,60.7)),.9);
 }else{
  G.words('Revision complete',100,371,60,t,61,{maxWidth:840,speed:.30,stagger:.05});G.check(142,448,43*G.p(t,61,61.45),C.lime);
  G.words(K.interface.export,100,588,52,t,61.5,{maxWidth:840,color:C.lime,speed:.30});
  G.rect([100,635,780,38],C.panel);G.rect([100,635,780*G.p(t,61.5,62.5),38],C.lime);
  if(t>=62.5){G.check(142,749,42,C.lime);G.text(K.interface.completed,208,764,45,C.white,{maxWidth:660,font:'Body'});}
 }
 if(t>=59.7)G.stroke(project,C.lime,1.5);
}
window.drawServices=t=>{if(t<35)quick(t);else if(t<46)campaign(t);else if(t<55)monthly(t);else if(t<59)value(t);else process(t);};
})();
