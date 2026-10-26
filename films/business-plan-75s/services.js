/* Continuous service chapters. All live type, paths and interface shapes remain editable.
   Package copy and scope are centralized in config.js. */
(()=>{
const Q0=[930,260,850,478],QP=[1280,230,350,622];
const MAIN=[100,315,720,405],CUTS=[[860,315,430,242],[1330,315,430,242]],POSTERS=[[860,600,280,280],[1170,600,280,280],[1480,600,280,280]];
const ASSETS=[MAIN,...CUTS,...POSTERS];
const BOARD=[[960,332,248,150],[1245,332,248,150],[1530,332,248,150],[960,552,248,150],[1245,552,248,150],[1530,552,248,150]];
const VALUE=[[100,480,660,371],[800,420,450,253],[1290,420,450,253],[800,713,285,285],[1128,713,285,285],[1456,713,285,285]];
function title(s,t,start){G.words(s,100,159,85,t,start,{maxWidth:1720,stagger:.065,speed:.4,fromX:80});}
function videoCard(r,t,i=0,caption=false){G.video(r,t,{index:i});G.stroke(r,G.C.white,2);if(caption)G.posterWords(r,t,28.25);}
function asset(r,i,t){if(i<3)videoCard(r,t,i);else{G.graphic(r,i-3);G.stroke(r,G.C.white,2);}}
function tickHead(x,y,w,t,start,end){const p=G.clamp((t-start)/(end-start));G.line(x,y,x+w,y,G.C.gray,2);let xx=x+w*p;G.line(xx,y-16,xx,y+135,G.C.lime,3);G.rect([xx-8,y-18,16,13],G.C.lime);}
function quickTimeline(t){const C=G.C,r=[100,810,1720,155];G.rect(r,C.panel);for(let i=0;i<25;i++){let x=125+i*69;G.line(x,825,x,i%4===0?845:835,C.gray,1)}
 const trim=G.p(t,26,26.5),snap=G.p(t,27,27.4),xs=[130,570,1025],ws=[418,435,590];
 for(let i=0;i<3;i++){let x=xs[i]-(i===2?85*snap:0),w=ws[i]-(i===1?85*trim:0);G.rect([x,861,w,65],i===1?C.lime:C.white);G.text(['First take','Selected cut','Final take'][i],x+20,903,24,C.black,{maxWidth:w-40});}
 if(t>=26&&t<27.4){let xx=1005-85*trim;G.line(xx,851,xx,937,C.lime,6);G.cursor(xx+18,899,.8);}
 tickHead(130,849,1610,t,25,28);
}
function quick(t){const C=G.C,K=G.K.quick;title(K.name,t,25);
 const r=G.rmix(Q0,QP,G.p(t,28,28.8));videoCard(r,t,0,t>=28.25);
 if(t<28){G.words('One 15–30s\nvideo',100,420,91,t,25.25,{maxWidth:760,stagger:.08,lineHeight:108,fromX:-90,punch:.14});quickTimeline(t);}
 else if(t<31){G.words(K.captions,100,392,88,t,28,{maxWidth:1060,stagger:.08,fromX:-130});G.words(K.ratio,100,597,78,t,28.5,{maxWidth:1080,stagger:.08});
  const p=G.p(t,28.5,29);G.line(100,663,100+810*p,663,C.lime,5);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }else{G.words(K.revision,100,350,77,t,31,{maxWidth:1060,stagger:.06});
  const done=G.p(t,32.5,33),bubble=[100,414,940,152];G.rect(bubble,C.panel);G.stroke(bubble,C.gray,1);
  G.mask(bubble,()=>{const up=-done*160;G.text(K.review,128,455+up,24,C.lime,{mono:true});G.text(K.feedback,128,518+up,41,C.white,{maxWidth:870});G.check(148,654+up,39,C.lime);G.text(K.complete,198,666+up,40,C.white,{maxWidth:790});});
  G.cursor(G.mix(1030,895,G.p(t,32,32.5)),G.mix(589,521,G.p(t,32,32.5)),.8);
  G.price(K.price,100,777,t,31.5);G.text('9:16',1455,925,30,C.lime,{mono:true,align:'center'});
 }
}
function campaign(t){const C=G.C,K=G.K.campaign;title(K.name,t,35);
 const establish=G.p(t,35,35.65),split=G.p(t,38,39),big=[100,300,1050,590];
 let main=G.rmix(G.rmix(QP,big,establish),MAIN,split);
 videoCard(main,t,0,t>=35.6); // A single source object expands directly from Quick Edit.
 if(t<38){G.words(K.main,1230,458,65,t,35.6,{maxWidth:590,stagger:.08});G.words(K.length,1230,565,62,t,36,{maxWidth:590,stagger:.08,color:C.lime});}
 if(t>=38){
  CUTS.forEach((target,i)=>{if(t<38+i*.5)return;const p=G.p(t,38+i*.5,39+i*.5),r=G.rmix(main,target,p);videoCard(r,t,p<.18?0:i+1,t>=39.4);});
  if(t<41)G.words(K.cutdowns,100,850,68,t,38,{maxWidth:1020,stagger:.07});
 }
 if(t>=41){POSTERS.forEach((target,i)=>{const en=G.p(t,41+i*.5,41.5+i*.5),origin=[MAIN[0]+MAIN[2]-110,MAIN[1]+MAIN[3]-110,110,110],r=G.rmix(origin,target,en);G.graphic(r,i);G.stroke(r,C.white,2);});
  if(t<43)G.words(K.graphics,100,850,65,t,41,{maxWidth:970,stagger:.06});
 }
 if(t>=43){G.words(K.tagline,100,253,44,t,42.75,{maxWidth:1720,stagger:.035});G.price(K.price,100,853,t,43);
  G.text(K.main,100,765,30,C.white);G.text(K.cutdowns,860,285,28,C.white);G.text(K.graphics,860,953,28,C.white);
 }
}
function calendarBackdrop(t){const C=G.C,K=G.K.interface;const en=G.p(t,46,47.15);G.mask([900,215,920*en,608],()=>{G.rect([900,215,920,608],C.panel);K.days.forEach((day,i)=>G.text(day,931+i*178,269,26,C.white,{maxWidth:160}));for(let i=1;i<5;i++)G.line(900+i*184,289,900+i*184,823,'#45453E',1);for(let j=0;j<3;j++)G.line(900,289+j*178,1820,289+j*178,'#45453E',1);});}
function plannedTiles(t){const C=G.C;calendarBackdrop(t);ASSETS.forEach((old,i)=>{const p=G.p(t,46+i*.05,47.15+i*.05),r=G.rmix(old,BOARD[i],p);asset(r,i,t);});}
function monthBar(t,y=863){const C=G.C,K=G.K.monthly;let x=100;const total=1720,fill=G.p(t,49.5,52.1);G.text(K.allocated.replace('20 / 20',Math.round(fill*20)+' / 20'),100,y-37,30,C.white,{mono:true});G.rect([100,y,total,34],C.panel);K.allocations.forEach((hours,i)=>{const width=total*hours/20;G.mask([100,y,total*fill,34],()=>G.rect([x,y,width-5,34],i===1?C.white:C.lime));x+=width;});G.text('20h max',1820,y+80,29,C.white,{mono:true,align:'right'});}
function monthly(t){const C=G.C,K=G.K.monthly;title(K.name,t,46);
 if(t<49){G.words('Regular content\nsupport',100,390,83,t,46.25,{maxWidth:770,stagger:.08,lineHeight:103,fromX:-90});plannedTiles(t);}
 else{
  const toQueue=G.p(t,49,49.7);const rows=K.tasks.map((s,i)=>[1010,315+i*156,760,118]);
  // Deliverable tiles pair up into three agreed work queues rather than disappearing.
  for(let i=0;i<3;i++){const from=BOARD[i],r=G.rmix(from,rows[i],toQueue);G.rect(r,C.panel);G.stroke(r,C.gray,1);const thumb=[r[0]+10,r[1]+10,r[3]-20,r[3]-20];if(i<2)G.video(thumb,t,{index:i});else G.graphic(thumb,1);G.text(K.tasks[i],r[0]+145,r[1]+51,35,C.white,{maxWidth:r[2]-260});G.text(K.allocations[i]+'h',r[0]+r[2]-28,r[1]+54,34,C.lime,{mono:true,align:'right'});const done=G.p(t,52+i*.18,52.6+i*.18);if(done>0){G.check(r[0]+r[2]-50,r[1]+91,25*done,C.lime);}}
  if(t<52){G.words('Up to 20 hours\n/ month',100,380,76,t,49,{maxWidth:840,stagger:.07,lineHeight:101});G.words(K.work,100,640,46,t,49.7,{maxWidth:840,stagger:.06,color:C.lime});}
  else{G.words('Tasks agreed\nin advance',100,374,77,t,52,{maxWidth:840,stagger:.08,lineHeight:101});G.price(K.price,100,694,t,52);}
  monthBar(t,863);
 }
}
function value(t){const C=G.C,K=G.K;const stage=G.p(t,55,55.9);
 // Monthly tasks flow out into a unified body of work. Geometry retains the queue origins.
 ASSETS.forEach((old,i)=>{const source=i<3?[1010,315+i*156,760,118]:[1010+(i-3)*230,650,210,118];let r=G.rmix(source,VALUE[i],stage);r[1]+=Math.sin((t-55)*.7+i)*3*stage;asset(r,i,t);});
 G.words(K.value[0],100,236,101,t,55,{maxWidth:1720,stagger:.09,punch:.12});G.words(K.value[1],100,363,101,t,56.75,{maxWidth:1720,stagger:.09,color:C.lime});
}
function document(r,t){const C=G.C;G.rect(r,C.white);G.text(G.K.process[0],r[0]+35,r[1]+72,43,C.black,{maxWidth:r[2]-70});for(let i=0;i<4;i++)G.rect([r[0]+35,r[1]+115+i*39,(r[2]-70)*(i===3?.62:1),10],i===0?C.black:'#A5A59A');G.check(r[0]+r[2]-57,r[1]+r[3]-52,42,C.black);}
function process(t){const C=G.C,K=G.K;const itemOrigin=VALUE[0],project=[1040,280,720,405];
 // The same main-video object leaves the body of work and enters a concrete project flow.
 const toProject=G.p(t,59,59.7),r=G.rmix(itemOrigin,project,toProject);videoCard(r,t,0,t>=60.8);
 const flow=['Brief','Review','Deliver'];flow.forEach((s,i)=>{const active=t>=59+i;G.text(K.process[i],100+i*600,166,66,active?C.white:'#57574F',{maxWidth:500});if(i<2)G.arrow(601+i*600,141,55,active?C.lime:'#57574F',0);});
 if(t<60){const doc=G.rmix([100,480,660,371],[100,280,740,470],toProject);document(doc,t);G.words('Your brief',100,864,55,t,59,{maxWidth:760});}
 else if(t<61){const b=[100,314,800,240];G.rect(b,C.panel);G.stroke(b,C.lime,2);G.words('Review',135,378,44,t,60,{maxWidth:720,color:C.lime});G.words('Tighter ending, please.',135,472,44,t,60.1,{maxWidth:720});G.cursor(G.mix(830,1540,G.p(t,60.25,60.7)),G.mix(581,657,G.p(t,60.25,60.7)),.9);}
 else{const correct=G.p(t,61,61.5);G.words('Revision complete',100,371,60,t,61,{maxWidth:840});G.check(142,448,45*correct,C.lime);G.words(K.interface.export,100,588,52,t,61.5,{maxWidth:840,color:C.lime});const p=G.p(t,61.5,62.5);G.rect([100,635,780,38],C.panel);G.rect([100,635,780*p,38],C.lime);if(t>=62.5){G.check(142,749,46,C.lime);G.text(K.interface.completed,208,764,45,C.white,{maxWidth:660});}}
 if(t>=59.7){G.stroke(project,C.lime,2);}
}
window.drawServices=t=>{if(t<35)quick(t);else if(t<46)campaign(t);else if(t<55)monthly(t);else if(t<59)value(t);else process(t);};
})();
