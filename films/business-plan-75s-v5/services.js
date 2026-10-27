/* V5: one six-asset campaign travels through edit, expansion, planning and export.
   Model geometry and interior copy have independent, frame-based lifetimes. */
(()=>{
const Q0=[930,260,850,478],QP=[1280,230,350,622],MAIN=[100,315,720,405];
const CUTS=[[860,315,430,242],[1330,315,430,242]],POSTERS=[[860,600,280,280],[1170,600,280,280],[1480,600,280,280]],ASSETS=[MAIN,...CUTS,...POSTERS];
const BOARD=[[960,332,248,150],[1245,332,248,150],[1530,332,248,150],[960,552,248,150],[1245,552,248,150],[1530,552,248,150]],ROWS=[[1010,315,760,118],[1010,471,760,118],[1010,627,760,118]],PAIRS=[[0,3],[1,4],[5,2]];
const VALUE=[[100,480,660,371],[800,420,450,253],[1290,420,450,253],[800,713,285,285],[1128,713,285,285],[1456,713,285,285]];
function title(s,t,start){G.words(s,100,159,85,t,start,{maxWidth:1720,stagger:.045,speed:.30,fromX:65});}
const fade=(t,start)=>G.retire(t,start).alpha;
function videoCard(r,t,i=0,captionAt=null,alpha=1){G.video(r,t,{index:i});G.stroke(r,G.C.white,1.5);if(captionAt!==null&&t>=captionAt&&alpha>0)G.posterWords(r,t,captionAt,{alpha});}
function asset(r,i,t,alpha=1){if(i<3)videoCard(r,t,i,i===0?35.65:39.4,alpha);else{G.graphic(r,i-3,{textAlpha:alpha});G.stroke(r,G.C.white,1.5);}}
function tickHead(x,y,w,t,start,end,h=135){const p=G.clamp((t-start)/(end-start)),xx=x+w*p;G.line(x,y,x+w,y,G.C.gray,1.5);G.line(xx,y-16,xx,y+h,G.C.lime,3);G.rect([xx-7,y-17,14,12],G.C.lime);}
function quickTimeline(t){
 const C=G.C,retire=G.retire(t,27.6),fold=G.p(t,retire.collapseAt,28.15),bed=G.rmix([100,810,1720,155],[1280,868,350,7],fold);
 G.panel(bed,{fill:C.panel,depth:5*(1-fold),stroke:C.gray});
 if(fold<1){for(let i=0;i<25;i++){const x=G.mix(125+i*69,1290+i*13,fold);G.line(x,G.mix(825,870,fold),x,G.mix(i%4===0?843:834,872,fold),C.gray,1);}}
 const trim=G.p(t,26,26.5),snap=G.p(t,27,27.35),xs=[130,570,1025],ws=[418,435,590];
 ['First take','Selected cut','Final take'].forEach((s,i)=>{const x=xs[i]-(i===2?85*snap:0),w=ws[i]-(i===1?85*trim:0),r=G.rmix([x,861,w,65],[1285+i*114,869,105,5],fold);G.rect(r,i===1?C.lime:C.white);G.layer(retire.alpha,()=>G.text(s,x+20,903,24,C.black,{maxWidth:w-40,font:'Body'}),'quick-timeline-copy');});
 if(t>=26&&t<27.4){const xx=1005-85*trim;G.blade(xx,845,100,G.p(t,26,26.22));G.cursor(xx+18,899,.8);}
 if(fold<1)tickHead(G.mix(130,1285,fold),G.mix(849,870,fold),1610*(1-fold),t,25,28,135*(1-fold));
}
function quick(t){
 const C=G.C,K=G.K.quick;title(K.name,t,25);
 const r=G.rmix(Q0,QP,G.p(t,28,28.75)),captionAlpha=t<34.7?1:fade(t,34.7);videoCard(r,t,0,t>=28.9?28.9:null,captionAlpha);G.cropMarks(r,t,25.2);
 if(t<28.15)quickTimeline(t);
 if(t<28){
  G.words(K.video.replace(' video','\nvideo'),100,420,91,t,25.12,{maxWidth:760,stagger:.055,lineHeight:116,speed:.30,fromX:-80,punch:.10});
  if(t>=26.7&&t<27.6){const q=G.p(t,26.7,27.1);G.line(955,733,955+800*q,733,C.lime,3);G.check(1735,695,27*G.p(t,27.1,27.4),C.lime);}
 }else if(t<31){
  G.words(K.captions,100,392,88,t,28,{maxWidth:1060,stagger:.055,speed:.30,fromX:-100});G.words(K.ratio,100,597,78,t,28.45,{maxWidth:1080,stagger:.055,speed:.30});
  // Caption components travel on a short rail, then lock beneath the chosen portrait.
  const assembly=G.p(t,28.15,28.85);[0,1,2].forEach(i=>{const rr=G.rmix([1020-i*130,741,110,20],[1310+i*93,831,80,11],assembly);G.rect(rr,i===1?C.white:C.lime);});
  G.line(100,663,100+810*G.p(t,28.5,29),663,C.lime,4);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }else{
  G.words(K.revision,100,350,77,t,31,{maxWidth:1060,stagger:.05,speed:.30});
  const retire=G.retire(t,32.35),fold=G.p(t,retire.collapseAt,32.95),bubble=G.rmix([100,414,940,152],[100,414,940,125],fold);G.panel(bubble,{fill:C.panel,stroke:C.gray,depth:5});
  G.layer(retire.alpha,()=>{G.text(K.review,128,455,24,C.lime,{mono:true});G.text(K.feedback,128,518,41,C.white,{maxWidth:870,font:'Body'});},'quick-feedback');
  if(t>=33){G.check(147,474,35*G.p(t,33,33.2),C.lime);G.words(K.complete,198,491,40,t,33,{maxWidth:790,speed:.25});}
  G.cursor(G.mix(1030,895,G.p(t,32,32.5)),G.mix(589,521,G.p(t,32,32.5)),.8);G.price(K.price,100,777,t,31.5);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }
}
function campaignCaption(t){if(t<37.7)return 1;if(t<38)return fade(t,37.7);if(t<39.5)return 0;return t<45.7?G.p(t,39.5,39.7):fade(t,45.7);}
function campaign(t){
 const C=G.C,K=G.K.campaign;title(K.name,t,35);
 const big=[100,300,1050,590],establish=G.p(t,35,35.6),split=G.p(t,38,39),main=G.rmix(G.rmix(QP,big,establish),MAIN,split),alpha=campaignCaption(t);
 videoCard(main,t,0,t>=35.65?35.65:null,alpha);G.cropMarks(main,t,35.6);
 if(t<38){G.words(K.main,1230,458,65,t,35.55,{maxWidth:590,stagger:.055,speed:.30});G.words(K.length,1230,565,62,t,35.95,{maxWidth:590,stagger:.055,speed:.30,color:C.lime});}
 if(t>=38){
  CUTS.forEach((target,i)=>{const start=38+i*.5;if(t<start)return;const p=G.p(t,start,start+.9),r=G.rmix(main,target,p);G.hinge(r,(1-p)*.48,()=>videoCard(r,t,p<.18?0:i+1,t>=39.4?39.4:null,p>=1?alpha:0));if(p<1)G.line(main[0]+main[2],main[1]+main[3]*.5,r[0],r[1]+r[3]*.5,C.lime,2);});
  if(t<41)G.words(K.cutdowns,100,850,68,t,38,{maxWidth:1020,stagger:.05,speed:.30});
  if(t<39.45){const x=G.mix(817,1340,G.p(t,38,39.4));G.blade(x,292,280,G.p(t,38,38.25));}
 }
 if(t>=41){
  POSTERS.forEach((target,i)=>{const start=41+i*.5;if(t<start)return;const origin=[MAIN[0]+MAIN[2]-110,MAIN[1]+MAIN[3]-110,110,110],p=G.p(t,start,start+.45),r=G.rmix(origin,target,p);G.hinge(r,(1-p)*1.05,()=>{G.graphic(r,i,{textAlpha:p>=1?alpha:0});G.stroke(r,C.white,1.5);});if(p<1)G.line(MAIN[0]+MAIN[2],MAIN[1]+MAIN[3],r[0],r[1],C.lime,2);});
  if(t<43)G.words(K.graphics,100,850,65,t,41,{maxWidth:970,stagger:.05,speed:.30});
 }
 if(t>=43){G.words(K.tagline,100,237,44,t,42.7,{maxWidth:1720,stagger:.025,speed:.28});G.price(K.price,100,853,t,43);G.text(K.main,100,766,30,C.white,{font:'Body'});G.text(K.cutdowns,860,283,28,C.white,{font:'Body'});G.text(K.graphics,860,953,28,C.white,{font:'Body'});}
}
function calendarBackdrop(t){
 const C=G.C,K=G.K.interface,en=G.p(t,46,47.1),retire=G.retire(t,48.65),fold=G.p(t,retire.collapseAt,49.7);if(en<=0||fold>=1)return;
 const opened=G.rmix([900,215,920,8],[900,215,920,608],en),r=G.rmix(opened,[1008,315,3,430],fold);G.panel(r,{fill:C.panel,depth:5*(1-fold),stroke:C.gray});
 for(let i=1;i<5;i++)G.line(r[0]+i*r[2]/5,r[1]+74*en*(1-fold),r[0]+i*r[2]/5,r[1]+r[3],C.gray,1);
 for(let j=0;j<3;j++)G.line(r[0],r[1]+(74+j*178)*en*(1-fold),r[0]+r[2],r[1]+(74+j*178)*en*(1-fold),C.gray,1);
 if(t>=47.1)G.layer(retire.alpha,()=>K.days.forEach((day,i)=>G.text(day,931+i*178,269,26,C.white,{maxWidth:160,font:'Body'})),'calendar-copy');
}
function plannedTiles(t){calendarBackdrop(t);ASSETS.forEach((old,i)=>{const start=46+i*.04,end=46.5+i*.04,p=G.p(t,start,end),r=G.rmix(old,BOARD[i],p);asset(r,i,t,0);if(p>=1)G.rect([r[0],r[1]+r[3]+9,r[2]*G.p(t,end,end+.25),4],i<3?G.C.lime:G.C.white);});}
function queueTarget(i){let row=0,side=0;PAIRS.forEach((pair,j)=>{if(pair[0]===i){row=j;side=0;}if(pair[1]===i){row=j;side=1;}});const r=ROWS[row];return[r[0]+(side?r[2]-198:12),r[1]+12,94,94];}
function queue(t){
 const C=G.C,K=G.K.monthly,join=G.p(t,49,49.85),retire=G.retire(t,54.7);calendarBackdrop(t);
 ROWS.forEach((target,i)=>{const r=G.rmix(BOARD[i],target,join);G.panel(r,{fill:C.panel,depth:5,stroke:C.gray});if(t<49.9)return;
  G.layer(retire.alpha,()=>{G.words(K.tasks[i],r[0]+145,r[1]+51,34,t,49.9+i*.04,{maxWidth:r[2]-360,font:'Body',speed:.27,stagger:.04});G.text(K.allocations[i]+'h',r[0]+r[2]-28,r[1]+54,33,C.lime,{mono:true,align:'right'});},'monthly-row-copy');
  const done=G.p(t,52+i*.18,52.55+i*.18);if(done>0)G.check(r[0]+r[2]-48,r[1]+91,24*done,C.lime);
 });
 ASSETS.forEach((_,i)=>{const target=queueTarget(i),start=49+(i%3)*.025,end=49.85+(i%3)*.025,p=G.p(t,start,end),origin=BOARD[i],r=G.rmix(origin,target,p);asset(r,i,t,0);if(p>0&&p<1)G.track([[origin[0]+origin[2]/2,origin[1]+origin[3]/2],[target[0]+47,origin[1]+origin[3]/2],[target[0]+47,target[1]+47]],p);});
}
function monthBar(t,y=863){
 const C=G.C,K=G.K.monthly,total=1720,fill=G.p(t,49.5,52.1);let x=100;G.text(K.allocated.replace('20 / 20',Math.round(fill*20)+' / 20'),100,y-37,30,C.white,{mono:true});G.rect([100,y,total,34],C.panel);
 K.allocations.forEach((hours,i)=>{const w=total*hours/20;G.mask([100,y,total*fill,34],()=>G.rect([x,y,w-5,34],i===1?C.white:C.lime));x+=w;});G.text('20h max',1820,y+80,29,C.white,{mono:true,align:'right'});
}
function monthly(t){
 const C=G.C,K=G.K.monthly;title(K.name,t,46);
 if(t<49){G.words(K.regular.replace(' support','\nsupport'),100,390,83,t,46.55,{maxWidth:770,stagger:.055,lineHeight:111,speed:.30,fromX:-75});plannedTiles(t);}
 else{queue(t);if(t<52){G.words(K.hours.replace(' / month','\n/ month'),100,380,76,t,49,{maxWidth:840,stagger:.05,lineHeight:108,speed:.30});G.words(K.work,100,640,46,t,49.65,{maxWidth:840,stagger:.045,speed:.30,color:C.lime});}else{G.words(K.agreed.replace(' in advance','\nin advance'),100,374,77,t,52,{maxWidth:840,stagger:.055,lineHeight:110,speed:.30});G.price(K.price,100,694,t,52);}monthBar(t,863);}
}
function value(t){
 const C=G.C,K=G.K,move=G.p(t,55,55.9),exit=G.p(t,55,55.35);if(exit<1)ROWS.forEach(r=>G.panel([r[0],r[1],r[2]*(1-exit),r[3]],{fill:C.panel,depth:5*(1-exit),stroke:C.gray}));
 const alpha=t<56?0:t<58.7?G.p(t,56,56.2):fade(t,58.7);ASSETS.forEach((_,i)=>asset(G.rmix(queueTarget(i),VALUE[i],move),i,t,alpha));
 G.words(K.value[0],100,236,101,t,55,{maxWidth:1720,stagger:.06,speed:.30,punch:.08});G.words(K.value[1],100,363,101,t,56.6,{maxWidth:1720,stagger:.06,speed:.32,color:C.lime});
}
function document(r){const C=G.C;G.paper(r,{open:1});G.text(G.K.process[0],r[0]+35,r[1]+72,43,C.black,{maxWidth:r[2]-70});for(let i=0;i<4;i++)G.rect([r[0]+35,r[1]+115+i*39,(r[2]-70)*(i===3?.62:1),10],i===0?C.black:'#A5A59A');G.check(r[0]+r[2]-57,r[1]+r[3]-52,40,C.black);}
function process(t){
 const C=G.C,K=G.K,project=[1040,280,720,405],toProject=G.p(t,59,59.7);
 if(t<59.6)for(let i=1;i<6;i++){const old=VALUE[i],end=i<3?[2040+(i-1)*110,old[1],old[2],old[3]]:[old[0],1160+(i-3)*60,old[2],old[3]];asset(G.rmix(old,end,G.p(t,59+(i%3)*.025,59.42+(i%3)*.025)),i,t,0);}
 const r=G.rmix(VALUE[0],project,toProject);videoCard(r,t,0,t>=59.8?59.8:null,t<62.7?1:fade(t,62.7));
 K.process.forEach((s,i)=>{const active=t>=59+i;G.text(s,100+i*600,166,66,active?C.white:'#57574F',{maxWidth:500});if(i<2)G.arrow(601+i*600,141,55,active?C.lime:'#57574F',0);});
 if(t<60){const doc=G.rmix([-720,480,660,371],[100,280,740,470],toProject);document(doc);G.words('Your brief',100,864,55,t,59.25,{maxWidth:760,speed:.30,stagger:.05});}
 else if(t<61){const b=[100,314,800,240];G.panel(b,{fill:C.panel,stroke:C.lime,depth:7});G.words('Review',135,378,44,t,60,{maxWidth:720,color:C.lime,speed:.28});G.words('Tighter ending, please.',135,472,44,t,60.05,{maxWidth:720,speed:.28,stagger:.04,font:'Body'});G.cursor(G.mix(830,1540,G.p(t,60.25,60.7)),G.mix(581,657,G.p(t,60.25,60.7)),.9);}
 else{G.words('Revision complete',100,371,60,t,61,{maxWidth:840,speed:.30,stagger:.05});G.check(142,448,43*G.p(t,61,61.45),C.lime);G.words(K.interface.export,100,588,52,t,61.5,{maxWidth:840,color:C.lime,speed:.30});G.panel([100,635,780,38],{fill:C.panel,depth:5,stroke:C.gray});G.rect([100,635,780*G.p(t,61.5,62.5),38],C.lime);if(t>=62.5){G.check(142,749,42,C.lime);G.text(K.interface.completed,208,764,45,C.white,{maxWidth:660,font:'Body'});}}
 if(t>=59.7)G.stroke(project,C.lime,1.5);
}
window.drawServices=t=>{if(t<35)quick(t);else if(t<46)campaign(t);else if(t<55)monthly(t);else if(t<59)value(t);else process(t);};
})();
