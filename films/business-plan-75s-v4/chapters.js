/* Live choreography: each shared item carries into the next chapter.
   Text layout uses measured glyph positions; transition masks never define settled layout. */
(()=>{
const B=[1040,280,720,405],Q=[930,260,850,478];
const WORK_VIDEO=[1030,330,740,416],WORK_GRAPHIC=[1460,755,245,245];
const MSG=[[1030,325,730,132],[1000,440,730,132],[1060,555,730,132],[1025,670,730,132]];
const BLOCKS=[[100,875,400,82],[520,875,400,82],[940,875,400,82],[1360,875,400,82]];

// The editing rails live inside their actual windows; remove the old idle diagonal decorations.
function backdrop(){}
function measured(s,size,mono=false){
 const c=G.c;c.save();c.font=`${size}px ${mono?'Mono':'Display'}`;
 const m=c.measureText(s);c.restore();
 return {width:m.width,left:Math.max(0,m.actualBoundingBoxLeft||0),right:Math.max(m.width,m.actualBoundingBoxRight||0),ascent:m.actualBoundingBoxAscent||size*.9,descent:Math.max(0,m.actualBoundingBoxDescent||0)};
}
function brandLayout(x,y,size){
 const words=G.K.brandWords;
 return words.map((word,i)=>({word,x:x+measured(i?words.slice(0,i).join(' ')+' ':'',size).width,y,size,color:i===1?G.C.lime:G.C.white}));
}
function wordmark(x,y,size){brandLayout(x,y,size).forEach(v=>G.text(v.word,v.x,v.y,v.size,v.color));}

function intro(t){
 const C=G.C,K=G.K,exit=G.p(t,5.6,6);G.c.save();G.c.translate(0,-exit*850);
 G.words(K.author,100,319,64,t,0,{maxWidth:1600,fromX:-160,stagger:.09,speed:.32});
 G.words(K.assignment,100,572,198,t,.5,{maxWidth:1720,fromX:130,stagger:.12,speed:.34,punch:.12});
 G.words(K.course,105,729,51,t,1.25,{maxWidth:1710,fromX:-100,stagger:.06,speed:.3});G.c.restore();
 if(t<6){
  for(let i=0;i<3;i++){const x=100+i*330+Math.sin(t*.3+i)*12;G.rect([x,859,300,9],i===1?C.white:C.panel);G.rect([x,889,210,5],C.panel);}
  G.rect([1100,859,660,9],C.lime);
 }
}
function messages(t){
 const C=G.C,K=G.K,fold=G.p(t,11,12),starts=[5.5,7.5,8.5,9.5];
 K.messages.forEach((s,i)=>{
  if(t<starts[i])return;let r;
  if(i===0)r=G.rmix([1100,859,660,9],MSG[i],G.p(t,5.5,6.5));
  else{r=MSG[i].slice();const en=G.ease((t-starts[i])/.29);r[0]+=(1-en)*650;r[1]+=(1-en)*70;}
  // Different entry distances establish depth; settled cards no longer drift without purpose.
  r=G.rmix(r,BLOCKS[i],fold);
  if(i>0&&t-starts[i]<.28){
   const velocity=(G.ease((t-starts[i])/.29)-G.ease((t-starts[i]-.035)/.29))*650;
   if(velocity>18){G.c.save();G.c.globalAlpha=.12;G.c.filter='blur(6px)';G.rect([r[0]+velocity*.6,r[1]+8,r[2],r[3]],i===3?C.lime:C.white);G.c.restore();}
  }
  G.c.save();G.c.shadowColor='rgba(0,0,0,.32)';G.c.shadowBlur=18;G.c.shadowOffsetY=10;
  G.rect(r,i===0||i===3?C.lime:C.white);G.c.shadowBlur=0;G.c.shadowOffsetY=0;
  // This is the semantic card boundary, not a fixed-height text-entry mask.
  G.mask(r,()=>G.words(s,r[0]+27,r[1]+G.mix(87,58,fold),G.mix(42,28,fold),t,i===0?6.5:starts[i],{color:C.black,maxWidth:r[2]-54,stagger:.04,speed:.24}));
  G.c.restore();
 });
 if(t>=6&&t<12){
  G.c.save();G.c.translate(-G.p(t,11,11.65)*1100,0);
  G.words(K.pain[0],100,358,117,t,6,{maxWidth:850,fromX:-130,punch:.1,speed:.3});
  G.words(K.pain[1],100,548,117,t,6.5,{maxWidth:850,fromX:-80,color:C.lime,speed:.3});G.c.restore();
  if(t<10.8){
   G.c.save();G.c.globalAlpha=.4;for(let i=0;i<5;i++)G.rect([1030+i*153,903,133,35],i===3?C.lime:C.white);G.c.restore();
   const toThird=G.p(t,8.2,8.8),toFourth=G.p(t,9.2,9.8);
   G.cursor(G.mix(G.mix(1725,1660,toThird),1720,toFourth),G.mix(G.mix(883,700,toThird),790,toFourth),.85);
  }
 }
}
function studio(t){
 const C=G.C,K=G.K;
 if(t<13.25){
  const targets=[[100,525,500,7],[695,525,500,7],[1265,525,555,7],[100,566,1720,3]],leave=G.p(t,13,13.25);
  BLOCKS.forEach((r,i)=>{const rr=G.rmix(r,targets[i],G.p(t,12,12.85));rr[2]*=1-leave;G.rect(rr,i===0||i===3?C.lime:C.white);});
 }
 const shrink=G.p(t,14.6,15),size=G.mix(170,62,shrink),y=G.mix(485,187,shrink),layout=brandLayout(100,y,size);
 // One measured wordmark is retained before, during and after the camera pull-back.
 if(t<15){
  G.words(layout[0].word,layout[0].x,y,size,t,12,{maxWidth:1720,stagger:0,punch:.1,speed:.3});
  if(t>=12.5){
   const copy=G.p(t,12.5,12.93),x=G.mix(layout[0].x,layout[1].x,copy);G.text(layout[1].word,x,y,size,C.lime);
   if(t<13.25)G.cursor(x+measured(layout[1].word,size).width-20,y+54,.8);
  }
  G.words(layout[2].word,layout[2].x,y,size,t,12.45,{maxWidth:700,stagger:0,speed:.3});
 }else wordmark(100,187,62);
 if(t>=14.5){
  const en=G.p(t,14.5,15.5),r=G.rmix([1265,550,555,7],WORK_VIDEO,en);G.video(r,t);G.stroke(r,C.lime,2);
  if(t>=15.5&&t<17.8)G.badge(K.concept,r[0]+22,r[1]+r[3]-24,C.black,C.white,24);
  if(t>=15.5){
   const gp=G.p(t,15.5,16.1),gr=G.rmix([1460,746,245,8],WORK_GRAPHIC,gp);G.graphic(gr,1);
   // A matching output is attached to the workspace and becomes the following brand input.
   if(gp>0)G.line(1705,746,1705,gr[1],C.gray,2);
  }
  if(t<17)G.words(K.positioning.replace(' + ','\n+ '),100,422,98,t,15,{maxWidth:880,lineHeight:133,stagger:.045,speed:.27,fromX:-100});
  else G.words(K.audience.replace(', marketers',',\nmarketers'),100,432,81,t,17,{maxWidth:875,lineHeight:119,stagger:.045,speed:.27,fromX:-110});
 }
}
function inputDoc(r,feed=0){
 const C=G.C;G.rect(r,C.white);
 // Clip the document to its physical page. Its own content leaves as it compresses into a clip.
 G.mask([r[0]+20,r[1]+18,Math.max(0,r[2]-40),Math.max(0,r[3]-36)],()=>{
  const shift=-G.p(feed,0,.9)*180;
  ['Goal','Audience','Message'].forEach((s,j)=>{
   G.text(s,r[0]+30,r[1]+74+j*68+shift,37,C.black);
   G.rect([r[0]+255,r[1]+55+j*68+shift,Math.max(0,r[2]-285),7],C.black);
  });
  if(feed<.6)G.check(r[0]+r[2]-55,r[1]+r[3]-45,33,C.black);
 });
}
function inputBrand(r,formation=1){
 const C=G.C;G.graphic(r,1);
 G.mask([r[0],r[1],r[2]*formation,r[3]],()=>{
  G.rect(r,C.panel);[C.lime,C.white,C.black].forEach((col,i)=>G.rect([r[0]+25+i*(r[2]-50)/3,r[1]+25,(r[2]-60)/3,r[3]*.42],col));
  if(r[3]>150)G.text('Aa',r[0]+27,r[1]+r[3]-30,130,C.white,{maxWidth:r[2]-54});
 });
}
function inputs(t){
 const C=G.C,K=G.K,base=[[100,315,500,360],[685,315,500,360],[1270,315,500,281]],slots=[[100,805,530,105],[695,805,530,105],[1260,805,540,105]],feed=G.p(t,21.5,23),rs=base.map((r,i)=>G.rmix(r,slots[i],feed));
 // Retain the compact workspace identity while it exits; do not reset to a new page at19seconds.
 if(t<19.35){
  const exit=G.p(t,19,19.35);G.c.save();G.c.translate(0,-exit*260);G.mask([100,54,1720,185],()=>wordmark(100,187,62));G.c.restore();
  G.c.save();G.c.translate(-exit*1200,0);G.mask([100,250,875,420],()=>G.words(K.audience.replace(', marketers',',\nmarketers'),100,432,81,t,17,{maxWidth:875,lineHeight:119,stagger:.045,speed:.27}));G.c.restore();
 }
 const vf=G.rmix(WORK_VIDEO,rs[2],G.p(t,19,19.85));G.video(vf,t);G.stroke(vf,C.lime,2);
 const br=G.rmix(WORK_GRAPHIC,rs[1],G.p(t,19.25,20.1));inputBrand(br,G.p(t,19.65,20.2));
 const den=G.p(t,19.15,19.65),doc=rs[0].slice();doc[0]-=(1-den)*680;inputDoc(doc,feed);
 if(t<22.5)K.inputs.forEach((s,i)=>G.words(s,base[i][0],279,55,t,19+i,{maxWidth:530,stagger:.06,speed:.28,fromX:45}));
 if(t>=21.5){G.line(100,775,1800,775,C.gray,2);const xx=100+1700*G.p(t,22,23);G.line(xx,754,xx,935,C.lime,3);G.rect([xx-8,750,16,14],C.lime);}
 if(t>=23){
  const r=t<24?G.rmix(slots[2],[0,0,1920,1080],G.p(t,23,24)):t<24.5?[0,0,1920,1080]:G.rmix([0,0,1920,1080],Q,G.p(t,24.5,25));G.video(r,t);if(t<24||t>=24.5)G.stroke(r,C.lime,2);
  G.words(K.output.replace(' content','\ncontent'),100,408,91,t,23,{maxWidth:800,lineHeight:114,stagger:.035,speed:.28,color:C.white});
 }
}
function finalCard(){
 const C=G.C;G.rect([0,0,1920,1080],C.black);wordmark(100,469,153);G.text(G.K.cta,100,710,69,C.white,{maxWidth:1720});G.rect([100,777,1720,7],C.lime);
}
function promise(t){
 const C=G.C,K=G.K;G.video(B,t);G.stroke(B,C.white,2);
 K.promise.forEach((s,i)=>G.words(s,100,340+i*210,133,t,63+i*2,{color:i===2?C.lime:C.white,maxWidth:880,stagger:.065,speed:.3,punch:.12,fromX:-90}));
 if(t<65){const en=G.p(t,63,63.5);for(const [x,y] of [[1040,280],[1760,280],[1040,685],[1760,685]]){G.line(x-20*(1-en),y,x+20*(1-en),y,C.lime,2);G.line(x,y-20*(1-en),x,y+20*(1-en),C.lime,2)}G.check(1685,735,45*en,C.lime);}
 if(t>=65){G.posterWords(B,t,65);[C.black,C.white,C.lime].forEach((col,i)=>{const en=G.p(t,65+i*.1,65.6+i*.1);G.rect([1040+i*250,738,220*en,65],col);G.stroke([1040+i*250,738,220*en,65],C.gray,2);});}
 if(t>=67){const en=G.p(t,67,68.5);G.rect([1040,857,720,29],C.panel);G.rect([1040,857,720*en,29],C.lime);G.text(K.interface.export,1040,835,30,C.white);if(t>=68.5){G.check(1070,943,35,C.lime);G.text(K.interface.completed,1135,957,33,C.white,{maxWidth:620});}}
}
function closing(t){
 const C=G.C,K=G.K;if(t>=71.95){finalCard();return;}
 const window=G.rmix(B,[100,300,1720,330],G.p(t,69,69.5)),morph=G.p(t,71,71.9);
 if(t<71){
  G.rect(window,C.panel);G.stroke(window,C.lime,2);if(t<69.5)G.video(window,t);
  let shown=K.fileFrom;if(t>=70){const n=G.clamp(Math.floor((t-70)*12),0,6);shown='final'+'_final'.slice(0,n)+'.mp4';}
  G.mask(window,()=>G.text(shown,window[0]+55,window[1]+217,130,C.white,{mono:true,maxWidth:window[2]-110}));
  if(t>=70){const n=G.clamp(Math.floor((t-70)*12),0,6),w=measured('final'+'_final'.slice(0,n),130,true).width;G.rect([window[0]+55+w,window[1]+96,4,137],C.lime);}
 }else{
  // The physical file window compresses into the underline. Text has its own measured layer.
  const rail=G.rmix([100,300,1720,330],[100,777,1720,7],morph),rgb=[34,34,32].map((v,i)=>Math.round(G.mix(v,[197,255,0][i],morph)));
  G.rect(rail,`rgb(${rgb.join(',')})`);if(morph<.999)G.stroke(rail,C.lime,2*(1-morph));
  // The filename leaves above the mask before the wordmark enters below it.
  // A clean shape match replaces the former overlapping per-letter scramble.
  if(t<71.36){
   const out=G.p(t,71,71.35);G.mask([100,300,1720,330],()=>G.text(K.fileTo,155,517-out*300,130,C.white,{mono:true,maxWidth:1610}));
  }
  const final=brandLayout(100,469,153);
  final.forEach((v,i)=>G.words(v.word,v.x,v.y,v.size,t,71.34+i*.045,{color:v.color,speed:.32,stagger:0,maxWidth:1720}));
 }
 if(t>=71.25){
  const en=G.p(t,71.25,71.9),m=measured(K.cta,69),pad=12;
  if(en>=1)G.text(K.cta,100,710,69,C.white,{maxWidth:1720});
  else G.mask([100-pad,710-m.ascent-pad,1720+pad*2,m.ascent+m.descent+pad*2],()=>G.text(K.cta,100,710+(1-en)*140,69,C.white,{maxWidth:1720}));
 }
}
window.drawFilm=t=>{
 t=G.clamp(t,0,2249/30);if(t>=72){finalCard();return;}
 G.rect([0,0,1920,1080],G.C.black);backdrop(t);
 if(t<6.5)intro(t);
 if(t>=5.5&&t<12)messages(t);
 else if(t>=12&&t<19)studio(t);
 else if(t>=19&&t<25)inputs(t);
 else if(t>=25&&t<63)window.drawServices(t);
 else if(t>=63&&t<69)promise(t);
 else if(t>=69)closing(t);
};
window.prepareFilmFrame=async t=>{t=Math.round(G.clamp(t,0,2249/30)*30)/30;await G.prepare(t);window.drawFilm(t);};
window.updateFilm=t=>{t=Math.round(G.clamp(t,0,2249/30)*30)/30;G.updateMedia(t);window.drawFilm(t);};
})();
