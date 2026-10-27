/* V5: structural paper, swatch, film and export objects share a continuous path.
   Interior text has an explicit opacity lifetime. It is never squeezed or masked away. */
(()=>{
const B=[1040,280,720,405],Q=[930,260,850,478];
const WORK_VIDEO=[1030,330,740,416],WORK_GRAPHIC=[1460,755,245,245];
const MSG=[[1030,325,730,132],[1000,440,730,132],[1060,555,730,132],[1025,670,730,132]];
const BLOCKS=[[100,875,400,82],[520,875,400,82],[940,875,400,82],[1360,875,400,82]];
const INPUTS=[[100,315,500,360],[685,315,500,360],[1270,315,500,360]];
const SLOTS=[[100,805,530,105],[695,805,530,105],[1260,805,540,105]];
const frame=t=>Math.round(t*30);
function alphaLayer(a,fn,tag){if(a<=0)return;G.layer(a,fn,tag);}
function gate(t,start,fadeFrames=6,gap=2){const f=frame(t),s=Math.round(start*30),end=s+fadeFrames,collapse=end+gap;return{frame:f,alpha:f<s?1:f>=end?0:1-G.p(f,s,end),textVisible:f<end,fadeEndFrame:end,collapseFrame:collapse,collapseAt:collapse/30};}
function measured(s,size,mono=false){return G.measure(s,size,{mono});}
function brandLayout(x,y,size){return G.K.brandWords.map((word,i)=>({word,x:x+measured(i?G.K.brandWords.slice(0,i).join(' ')+' ':'',size).width,y,size,color:i===1?G.C.lime:G.C.white}));}
function wordmark(x,y,size){brandLayout(x,y,size).forEach(v=>G.text(v.word,v.x,v.y,v.size,v.color));}
function pureBadge(r,col){G.panel(r,{fill:col,depth:5,stroke:G.C.gray});}
function blankBrand(r,t,fold=0){
 const C=G.C;G.panel(r,{fill:C.panel,depth:8*(1-fold),stroke:C.gray});
 const inR=[r[0]+24,r[1]+25,r[2]-48,Math.max(14,r[3]*.44)];
 G.swatches(inR,{spread:G.p(t,19.6,20.15)*(1-fold),flip:G.p(t,20.05,20.55)});
 if(r[3]>130){
  const base=r[1]+r[3]-.24*r[3];G.line(r[0]+28,base,r[0]+r[2]-28,base,C.gray,1.5);
  [0,1,2].forEach(i=>G.rect([r[0]+r[2]*.61+i*r[2]*.09,base-r[3]*(.24-i*.035),r[2]*.045,r[3]*(.24-i*.035)],i===1?C.white:C.lime));
 }
}
function footageModel(r,t,fold=0){
 const C=G.C;G.panel(r,{fill:C.panel,depth:8*(1-fold),stroke:C.gray});
 const inset=Math.min(14,r[3]*.08),vr=[r[0]+inset,r[1]+inset,r[2]-inset*2,r[3]*(fold>.85?.72:.75)-inset];
 G.video(vr,t);G.cropMarks(vr,t,20.6);
 const strip=[r[0]+inset,r[1]+r[3]*.79,r[2]-inset*2,Math.max(13,r[3]*.17)];
 G.filmStrip(strip,t,{index:0});
}
function intro(t){
 const C=G.C,K=G.K,exit=G.p(t,5.6,6);G.c.save();G.c.translate(0,-exit*850);
 G.words(K.author,100,319,64,t,0,{maxWidth:1600,fromX:-160,stagger:.09,speed:.32});
 G.words(K.assignment,100,572,198,t,.5,{maxWidth:1720,fromX:130,stagger:.12,speed:.34,punch:.12});
 G.words(K.course,105,729,51,t,1.25,{maxWidth:1710,fromX:-100,stagger:.06,speed:.3});G.c.restore();
 // A single editorial rail is assembled, selected and trimmed before it becomes a message.
 if(t<6){
  G.panel([100,829,970,119],{fill:C.panel,depth:6,stroke:'#45453E'});
  const widths=[276,310,275],starts=[100,399,732];
  widths.forEach((w,i)=>{const en=G.p(t,.7+i*.22,1.05+i*.22),trim=i===1?G.p(t,4.8,5.25)*34:0;G.rect([starts[i]+16,859,(w-24-trim)*en,35],i===1?C.white:C.gray);});
  const head=116+915*G.p(t,1.8,4.7);G.line(head,841,head,930,C.lime,2.5);G.rect([head-6,838,12,10],C.lime);
  G.rect([1100,859,660,9],C.lime);
  if(t>=4.8&&t<5.6){const x=G.mix(680,1031,G.p(t,4.8,5.45));G.blade(x,822,132,G.p(t,4.8,5.45));G.cursor(x+18,926,.8);}
 }
}
function messageState(t){const g=gate(t,10.7),fold=G.p(t,g.collapseAt,12);return{...g,fold,rects:MSG.map((r,i)=>G.rmix(r,BLOCKS[i],fold))};}
window.messageTransitionState=messageState;
function messages(t){
 const C=G.C,K=G.K,state=messageState(t),starts=[5.5,7.5,8.5,9.5];
 // The timeline bed opens beneath the pile; the messages will be pulled onto this rail.
 if(t>=10.4){const en=G.p(t,10.4,10.8);G.panel([100,843,1720,136*en],{fill:C.panel,depth:5,stroke:'#45453E'});G.line(120,868,1800,868,C.gray,1.5);}
 K.messages.forEach((s,i)=>{
  if(t<starts[i])return;let r;
  if(i===0)r=G.rmix([1100,859,660,9],MSG[i],G.p(t,5.5,6.5));
  else{r=MSG[i].slice();const en=G.ease((t-starts[i])/.27);r[0]+=(1-en)*650;r[1]+=(1-en)*70;}
  r=G.rmix(r,BLOCKS[i],state.fold);
  if(i>0&&t-starts[i]<.28){const velocity=(G.ease((t-starts[i])/.27)-G.ease((t-starts[i]-.035)/.27))*650;if(velocity>18){G.c.save();G.c.globalAlpha=.10;G.c.filter='blur(5px)';G.rect([r[0]+velocity*.55,r[1]+8,r[2],r[3]],i===3?C.lime:C.white);G.c.restore();}}
  G.panel(r,{fill:i===0||i===3?C.lime:C.white,depth:G.mix(7,2,state.fold),stroke:i===0||i===3?C.lime:C.white});
  if(state.textVisible&&state.alpha>0){alphaLayer(state.alpha,()=>G.words(s,r[0]+27,r[1]+87,42,t,i===0?6.5:starts[i],{color:C.black,maxWidth:r[2]-54,stagger:.04,speed:.24}),'message-interior');}
  // Once lettering retires the same rectangles are pure material blocks, with no small text.
  if(!state.textVisible&&state.fold>0){G.line(r[0]+18,r[1]+r[3]-.23*r[3],r[0]+r[2]-18,r[1]+r[3]-.23*r[3],C.black,2);}
 });
 if(t>=6&&t<12){
  G.c.save();G.c.translate(-G.p(t,10.95,11.6)*1100,0);G.words(K.pain[0],100,358,117,t,6,{maxWidth:850,fromX:-130,punch:.1,speed:.3});G.words(K.pain[1],100,548,117,t,6.5,{maxWidth:850,fromX:-80,color:C.lime,speed:.3});G.c.restore();
  if(t<10.8){
   const toThird=G.p(t,8.2,8.8),toFourth=G.p(t,9.2,9.8);G.cursor(G.mix(G.mix(1725,1660,toThird),1720,toFourth),G.mix(G.mix(883,700,toThird),790,toFourth),.85);
   G.track([[1045,916],[1330,916],[1590,916],[1780,916]],G.p(t,7,10.5));
  }else if(t<12){const x=G.mix(1760,1350,G.p(t,10.9,11.8));G.cursor(x,970,.8);}
 }
}
function studio(t){
 const C=G.C,K=G.K;
 if(t<13.25){const targets=[[100,525,500,7],[695,525,500,7],[1265,525,555,7],[100,566,1720,3]],leave=G.p(t,13,13.25);BLOCKS.forEach((r,i)=>{const rr=G.rmix(r,targets[i],G.p(t,12,12.85));rr[2]*=1-leave;G.rect(rr,i===0||i===3?C.lime:C.white);});}
 const shrink=G.p(t,14.6,15),size=G.mix(170,62,shrink),y=G.mix(485,187,shrink),layout=brandLayout(100,y,size);
 if(t<15){G.words(layout[0].word,layout[0].x,y,size,t,12,{maxWidth:1720,stagger:0,punch:.1,speed:.3});if(t>=12.5){const x=G.mix(layout[0].x,layout[1].x,G.p(t,12.5,12.93));G.text(layout[1].word,x,y,size,C.lime);if(t<13.25){G.cursor(x+measured(layout[1].word,size).width-20,y+54,.8);G.line(layout[0].x,539,x+measured(layout[1].word,size).width,539,C.gray,1.5);}}G.words(layout[2].word,layout[2].x,y,size,t,12.45,{maxWidth:700,stagger:0,speed:.3});}
 else wordmark(100,187,62);
 if(t>=14.5){
  const en=G.p(t,14.5,15.5),r=G.rmix([1265,550,555,7],WORK_VIDEO,en);G.panel(r,{fill:C.panel,depth:8*en,stroke:C.lime});G.video(r,t);G.cropMarks(r,t,15);
  if(t>=15.5&&t<17.8)G.badge(K.concept,r[0]+22,r[1]+r[3]-24,C.black,C.white,24);
  if(t>=15.5){const gr=G.rmix([1460,746,245,8],WORK_GRAPHIC,G.p(t,15.5,16.1));blankBrand(gr,t,0);G.line(1705,746,1705,gr[1],C.gray,1.5);}
  if(t<17)G.words(K.positioning.replace(' + ','\n+ '),100,422,98,t,15,{maxWidth:880,lineHeight:133,stagger:.045,speed:.27,fromX:-100});
  else G.words(K.audience.replace(', marketers',',\nmarketers'),100,432,81,t,17,{maxWidth:875,lineHeight:119,stagger:.045,speed:.27,fromX:-110});
 }
}
function inputState(t){
 const g=gate(t,21.5),feed=G.p(t,653/30,688/30),rects=INPUTS.map((r,i)=>G.rmix(r,SLOTS[i],feed));
 // Geometry is fully settled long before f645; it remains untouched through f652.
 const doc=rects[0].slice();doc[0]-=(1-G.p(t,19.15,19.65))*680;
 const brand=G.rmix(WORK_GRAPHIC,rects[1],G.p(t,19.25,20.1));
 const footage=G.rmix(WORK_VIDEO,rects[2],G.p(t,19,19.85));
 return{frame:g.frame,textAlpha:g.alpha,textVisible:g.textVisible,fadeStartFrame:645,fadeEndFrame:651,collapseStartFrame:653,collapseEndFrame:688,feed,briefRect:doc,brandRect:brand,footageRect:footage,rects};
}
window.inputTransitionState=inputState;
function inputDocGraphics(r,t,feed){
 G.paper(r,{open:G.p(t,19.15,19.65),fold:feed,depth:8});
 // The fixed page's checkboxes, rules and fold tab become purely graphic clip markings.
 if(feed<.95){const x=r[0]+30,w=Math.max(0,r[2]-66),row=G.mix(68,14,feed);for(let j=0;j<3;j++){G.stroke([x,r[1]+56+j*row,18,18],G.C.gray,1.5);G.rect([x+233,r[1]+62+j*row,Math.max(0,w-245),6],j===0?G.C.black:G.C.gray);}}
}
function inputText(state,t){
 if(!state.textVisible||state.textAlpha<=0)return;
 const K=G.K,C=G.C,r=state.briefRect;
 // No mask, vertical translation or scaling participates in this opacity-only retirement.
 alphaLayer(state.textAlpha,()=>{
  ['Goal','Audience','Message'].forEach((s,j)=>G.text(s,r[0]+65,r[1]+74+j*68,35,C.black,{font:'Body'}));
  if(t>=20.15)G.text('Aa',state.brandRect[0]+29,state.brandRect[1]+state.brandRect[3]-31,113,C.white,{maxWidth:300});
  const starts=[19,19.85,20.65];K.inputs.forEach((s,i)=>G.words(s,INPUTS[i][0],279,55,t,starts[i],{maxWidth:530,stagger:.045,speed:.25,fromX:35}));
 },'input-interior');
}
function inputs(t){
 const C=G.C,K=G.K,state=inputState(t),feed=state.feed;
 if(t<19.35){const out=G.p(t,19,19.35);G.c.save();G.c.translate(0,-out*260);wordmark(100,187,62);G.c.restore();G.c.save();G.c.translate(-out*1200,0);G.words(K.audience.replace(', marketers',',\nmarketers'),100,432,81,t,17,{maxWidth:875,lineHeight:119,stagger:.045,speed:.27});G.c.restore();}
 footageModel(state.footageRect,t,feed);blankBrand(state.brandRect,t,feed);inputDocGraphics(state.briefRect,t,feed);inputText(state,t);
 if(t>=21.5){
  const rail=G.p(t,21.5,21.75);G.line(100,775,100+1700*rail,775,C.gray,2);const x=100+1700*G.p(t,22,22.95);G.line(x,754,x,935,C.lime,3);G.rect([x-7,750,14,12],C.lime);
  if(t>=653/30&&t<23){G.cursor(G.mix(1800,1700,G.p(t,22.5,22.95)),968,.8);}
 }
 if(t>=23){
  // Only pure material survives the contraction. Rails form the video bezel and open it.
  const r=t<24?G.rmix(SLOTS[2],[0,0,1920,1080],G.p(t,23,24)):t<24.5?[0,0,1920,1080]:G.rmix([0,0,1920,1080],Q,G.p(t,24.5,25));
  G.panel(r,{fill:C.panel,depth:8*(1-G.p(t,23,24)),stroke:C.lime});G.video(r,t);G.cropMarks(r,t,23.1);
  if(t>=23.2)G.words(K.output.replace(' content','\ncontent'),100,408,91,t,23.2,{maxWidth:800,lineHeight:114,stagger:.035,speed:.27,color:C.white});
 }
}
function finalCard(){const C=G.C;G.rect([0,0,1920,1080],C.black);wordmark(100,469,153);G.text(G.K.cta,100,710,69,C.white,{maxWidth:1720});G.rect([100,777,1720,7],C.lime);}
function promise(t){
 const C=G.C,K=G.K,captionGate=gate(t,68.8),uiGate=gate(t,68.7);
 G.panel(B,{fill:C.panel,depth:8,stroke:C.white});G.video(B,t);
 K.promise.forEach((s,i)=>G.words(s,100,340+i*210,133,t,63+i*2,{color:i===2?C.lime:C.white,maxWidth:880,stagger:.065,speed:.3,punch:.12,fromX:-90}));
 if(t<65){G.cropMarks(B,t,63);const snap=G.p(t,63,63.5);for(let i=0;i<3;i++){const rr=G.rmix([1054+i*220,728,200,45],[1040+i*250,738,220,65],snap);G.rect(rr,i===2?C.lime:i===1?C.white:C.panel);}G.check(1685,735,45*snap,C.lime);}
 if(t>=65){if(captionGate.textVisible)alphaLayer(captionGate.alpha,()=>G.posterWords(B,t,65),'promise-video-caption');G.swatches([1040,738,720,65],{spread:G.p(t,65,65.3),flip:G.p(t,65,65.7)});}
 if(t>=67){const ready=G.p(t,67,68.5);G.panel([1040,857,720,29],{fill:C.panel,depth:4,stroke:C.gray});G.rect([1040,857,720*ready,29],C.lime);if(uiGate.textVisible)alphaLayer(uiGate.alpha,()=>{G.text(K.interface.export,1040,835,30,C.white);if(t>=68.5)G.text(K.interface.completed,1135,957,33,C.white,{maxWidth:620});},'promise-status');if(t>=68.5)G.check(1070,943,35,C.lime);}
}
function fileState(t){const g=gate(t,70.8);return{frame:g.frame,textAlpha:g.alpha,textVisible:g.textVisible,fadeEndFrame:g.fadeEndFrame,collapseStartFrame:g.collapseFrame,collapseAt:g.collapseAt};}
window.fileTransitionState=fileState;
function closing(t){
 const C=G.C,K=G.K;if(t>=71.95){finalCard();return;}
 const fg=fileState(t),window=G.rmix(B,[100,300,1720,330],G.p(t,69+2/30,69.55));
 if(t<fg.collapseAt){
  G.panel(window,{fill:C.panel,depth:8,stroke:C.lime});
  if(t<69.5)G.video(window,t);
  if(t>=69.55&&fg.textVisible&&fg.textAlpha>0){
   let shown=K.fileFrom;if(t>=70){const n=G.clamp(Math.floor((t-70)*12),0,6);shown='final'+'_final'.slice(0,n)+'.mp4';}
   alphaLayer(fg.textAlpha,()=>{G.text(shown,window[0]+55,window[1]+217,130,C.white,{mono:true,maxWidth:window[2]-110});if(t>=70){const n=G.clamp(Math.floor((t-70)*12),0,6),w=measured('final'+'_final'.slice(0,n),130,true).width;G.rect([window[0]+55+w,window[1]+96,4,137],C.lime);}},'export-filename');
  }
 }else{
  // Lettering is already absent for two full frames. The physical window alone folds.
  const morph=G.p(t,fg.collapseAt,71.9),rail=G.rmix([100,300,1720,330],[100,777,1720,7],morph);
  G.panel(rail,{fill:C.panel,depth:8*(1-morph),stroke:C.lime});G.rect([rail[0],rail[1]+Math.max(0,rail[3]-7),rail[2],7],C.lime);
  const final=brandLayout(100,469,153);final.forEach((v,i)=>G.words(v.word,v.x,v.y,v.size,t,71.27+i*.045,{color:v.color,speed:.30,stagger:0,maxWidth:1720}));
 }
 if(t>=71.45)G.words(K.cta,100,710,69,t,71.45,{maxWidth:1720,speed:.27,stagger:.025});
}
window.drawFilm=t=>{
 t=G.clamp(t,0,2249/30);if(t>=72){finalCard();return;}
 G.rect([0,0,1920,1080],G.C.black);
 if(t<6.5)intro(t);
 if(t>=5.5&&t<12)messages(t);else if(t>=12&&t<19)studio(t);else if(t>=19&&t<25)inputs(t);else if(t>=25&&t<63)window.drawServices(t);else if(t>=63&&t<69)promise(t);else if(t>=69)closing(t);
};
window.prepareFilmFrame=async t=>{t=Math.round(G.clamp(t,0,2249/30)*30)/30;await G.prepare(t);window.drawFilm(t);};
window.updateFilm=t=>{t=Math.round(G.clamp(t,0,2249/30)*30)/30;G.updateMedia(t);window.drawFilm(t);};
})();
