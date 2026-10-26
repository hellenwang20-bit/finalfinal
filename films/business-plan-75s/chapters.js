/* Author, request-to-brand, inputs, promise and final-card choreography.
   Live type and vector shapes; no persistent corner overlays or technical labels. */
(()=>{
const B=[1040,280,720,405],Q=[930,260,850,478];
const MSG=[[1030,325,730,132],[1000,440,730,132],[1060,555,730,132],[1025,670,730,132]];
const BLOCKS=[[100,875,400,82],[520,875,400,82],[940,875,400,82],[1360,875,400,82]];
function backdrop(t){const C=G.C;G.c.save();G.c.globalAlpha=.15;for(let i=0;i<7;i++){const x=-240+i*400+Math.sin(t*.15)*35;G.line(x,70,x+270,1010,'#55554B',1)}G.c.restore();}
function intro(t){const C=G.C,K=G.K;const exit=G.p(t,6,6.5);G.c.save();G.c.translate(0,-exit*850);
 G.words(K.author,100,319,64,t,0,{maxWidth:1600,fromX:-160,stagger:.1});
 G.words(K.assignment,100,572,198,t,.5,{maxWidth:1720,fromX:130,stagger:.16,punch:.16});
 G.words(K.course,105,729,51,t,1.25,{maxWidth:1710,fromX:-100,stagger:.075});G.c.restore();
 if(t<6){for(let i=0;i<3;i++){let x=100+i*330+Math.sin(t*.3+i)*12;G.rect([x,859,300,9],i===1?C.white:C.panel);G.rect([x,889,210,5],C.panel);}G.rect([1100,859,660,9],C.lime);}
}
function messages(t){const C=G.C,K=G.K,fold=G.p(t,11,12);
 // The selected intro rail becomes the first real message window.
 const starts=[5.5,7.5,8.5,9.5];
 K.messages.forEach((s,i)=>{if(t<starts[i])return;let r;
 if(i===0)r=G.rmix([1100,859,660,9],MSG[i],G.p(t,5.5,6.5));else{r=MSG[i].slice();const en=G.ease((t-starts[i])/.29);r[0]+=(1-en)*650;r[1]+=(1-en)*70;}
 const frozen=Math.min(t,10.5);r[0]+=Math.sin(frozen*.85+i)*6*(1-fold);r[1]+=Math.sin(frozen*.75+i)*4*(1-fold);
 r=G.rmix(r,BLOCKS[i],fold);if(i>0&&t-starts[i]<.28&&t>=starts[i]){const velocity=(G.ease((t-starts[i])/.29)-G.ease((t-starts[i]-.035)/.29))*650;if(velocity>18){G.c.save();G.c.globalAlpha=.12;G.c.filter='blur(6px)';G.rect([r[0]+velocity*.6,r[1]+8,r[2],r[3]],i===3?C.lime:C.white);G.c.restore();}}G.c.save();G.c.shadowColor='rgba(0,0,0,.38)';G.c.shadowBlur=25;G.c.shadowOffsetY=13;G.rect(r,i===0||i===3?C.lime:C.white);G.c.shadowBlur=0;G.c.shadowOffsetY=0;
 G.mask(r,()=>{const enStart=i===0?6.5:starts[i];G.words(s,r[0]+27,r[1]+G.mix(87,58,fold),G.mix(42,28,fold),t,enStart,{color:C.black,maxWidth:r[2]-52,stagger:.045,speed:.25});});G.c.restore();
 });
 if(t>=6&&t<12){G.c.save();G.c.translate(-G.p(t,11,11.65)*1100,0);G.words(K.pain[0],100,358,117,t,6,{maxWidth:850,fromX:-130,punch:.12});G.words(K.pain[1],100,548,117,t,6.5,{maxWidth:850,fromX:-80,color:C.lime});G.c.restore();
 if(t<10.8){G.c.save();G.c.globalAlpha=.4;for(let i=0;i<5;i++)G.rect([1030+i*153,903,133,35],i===3?C.lime:C.white);G.c.restore();G.cursor(1580+Math.sin(t*1.4)*74,825+Math.cos(t*.9)*18,.85);}
 }
}
function studio(t){const C=G.C,K=G.K;
 if(t<13.1){const targets=[[100,525,500,7],[695,525,500,7],[1265,525,555,7],[100,566,1720,3]];BLOCKS.forEach((r,i)=>G.rect(G.rmix(r,targets[i],G.p(t,12,12.85)),i%2?C.white:C.lime));}
 const shrink=G.p(t,14.5,15),y=G.mix(485,187,shrink),size=G.mix(175,62,shrink);
 const xx=[G.mix(100,100,shrink),G.mix(695,317,shrink),G.mix(1265,535,shrink)];
 if(t<15){G.words(K.brandWords[0],xx[0],y,size,t,12,{maxWidth:540,stagger:0,punch:.12});
 if(t>=12.5){const copy=G.p(t,12.5,12.95),x=G.mix(100,xx[1],copy);G.text(K.brandWords[1],x,y,size,C.lime,{maxWidth:540});if(t<13.5)G.cursor(x+410,y+60,.8);}
 G.words(K.brandWords[2],xx[2],y,G.mix(150,62,shrink),t,12.45,{maxWidth:555,stagger:0});
 }else G.text(K.brand,100,187,62,C.white,{maxWidth:1720});
 if(t>=14.5){const en=G.p(t,14.5,15.5),r=G.rmix([1265,550,555,7],[1030,330,740,416],en);G.video(r,t);G.stroke(r,C.lime,2);
 if(t>=15.5&&t<17.8)G.badge(K.concept,r[0]+22,r[1]+r[3]-24,C.black,C.white,24);
 if(t>=15.5){const p=G.p(t,15.5,16.1);G.graphic(G.rmix([1430,746,200,8],[1460,755,245,245],p),1);}
 if(t<17){G.words('Video editing\n+ brand content',100,422,98,t,15,{maxWidth:880,lineHeight:133,stagger:.08,fromX:-100});}
 else G.words('For brand teams,\nmarketers & agencies',100,432,81,t,17,{maxWidth:875,lineHeight:119,stagger:.07,fromX:-110});
 }
}
function inputDoc(r){const C=G.C;G.rect(r,C.white);if(r[3]>100){G.text('Goal',r[0]+30,r[1]+74,37,C.black);G.text('Audience',r[0]+30,r[1]+142,37,C.black);G.text('Message',r[0]+30,r[1]+210,37,C.black);for(let j=0;j<3;j++)G.rect([r[0]+255,r[1]+55+j*68,r[2]-285,7],C.black);G.check(r[0]+r[2]-55,r[1]+r[3]-45,33,C.black);}}
function inputBrand(r){const C=G.C;G.rect(r,C.panel);const colors=[C.lime,C.white,C.black];for(let i=0;i<3;i++)G.rect([r[0]+25+i*(r[2]-50)/3,r[1]+25,(r[2]-60)/3,r[3]*.42],colors[i]);if(r[3]>150)G.text('Aa',r[0]+27,r[1]+r[3]-30,130,C.white,{maxWidth:r[2]-54});}
function inputs(t){const C=G.C,K=G.K;
 const base=[[100,315,500,360],[685,315,500,360],[1270,315,500,281]],slots=[[100,805,530,105],[695,805,530,105],[1260,805,540,105]];
 const feed=G.p(t,21.5,23),rs=base.map((r,i)=>G.rmix(r,slots[i],feed));
 // The workspace video remains the footage card; documents join it rather than resetting.
 const vf=G.rmix([1030,330,740,416],rs[2],G.p(t,19,20));G.video(vf,t);G.stroke(vf,C.lime,2);
 if(t>=19){const en=G.p(t,19,19.55),r=rs[0].slice();r[0]-=(1-en)*680;inputDoc(r);}
 if(t>=20){const en=G.p(t,20,20.55),r=rs[1].slice();r[1]+=(1-en)*550;inputBrand(r);}
 if(t<22.5){K.inputs.forEach((s,i)=>G.words(s,base[i][0],279,55,t,19+i,{maxWidth:530,stagger:.08,fromX:60}));}
 if(t>=21.5){G.line(100,775,1800,775,C.gray,1);const xx=100+1700*G.p(t,22,23);G.line(xx,754,xx,935,C.lime,4);G.rect([xx-8,750,16,14],C.lime);}
 // The selected block actually fills the canvas before settling into the Quick Edit preview.
 if(t>=23){const r=t<24?G.rmix(slots[2],[0,0,1920,1080],G.p(t,23,24)):t<24.5?[0,0,1920,1080]:G.rmix([0,0,1920,1080],Q,G.p(t,24.5,25));G.video(r,t);if(t<24||t>=24.5)G.stroke(r,C.lime,2);
 G.words('Ready-to-share\ncontent',100,408,91,t,23,{maxWidth:800,lineHeight:114,stagger:.04,color:C.white});
 }
}
function finalCard(){const C=G.C,K=G.K;G.rect([0,0,1920,1080],C.black);const size=153;G.c.font=`${size}px Display`;let x=100;K.brandWords.forEach((w,i)=>{G.text(w,x,469,size,i===1?C.lime:C.white);x+=G.c.measureText(w+' ').width;});G.text(K.cta,100,710,69,C.white,{maxWidth:1720});G.rect([100,777,1720,7],C.lime);}
function promise(t){const C=G.C,K=G.K;G.video(B,t);G.stroke(B,C.white,2);
 K.promise.forEach((s,i)=>G.words(s,100,340+i*210,133,t,63+i*2,{color:i===2?C.lime:C.white,maxWidth:880,stagger:.08,punch:.2,fromX:-90}));
 if(t<65){const en=G.p(t,63,63.5);for(const [x,y] of [[1040,280],[1760,280],[1040,685],[1760,685]]){G.line(x-20*(1-en),y,x+20*(1-en),y,C.lime,3);G.line(x,y-20*(1-en),x,y+20*(1-en),C.lime,3)}G.check(1685,735,45*en,C.lime);}
 if(t>=65){G.posterWords(B,t,65);[C.black,C.white,C.lime].forEach((col,i)=>{const en=G.p(t,65+i*.1,65.6+i*.1);G.rect([1040+i*250,738,220*en,65],col);G.stroke([1040+i*250,738,220*en,65],C.gray,1)});}
 if(t>=67){const en=G.p(t,67,68.5);G.rect([1040,857,720,29],C.panel);G.rect([1040,857,720*en,29],C.lime);G.text(K.interface.export,1040,835,30,C.white);if(t>=68.5){G.check(1070,943,35,C.lime);G.text(K.interface.completed,1135,957,33,C.white,{maxWidth:620});}}
}
function closing(t){const C=G.C,K=G.K;const r=G.rmix(B,[100,300,1720,330],G.p(t,69,69.5));
 const dissolve=G.p(t,71,72);const shade=Math.round(G.mix(34,17,dissolve));G.rect(r,`rgb(${shade},${shade},${shade})`);G.stroke(r,dissolve>=1?C.black:C.lime,2);
 if(t<69.5){G.video(r,t);}
 G.mask(r,()=>{
 const before=K.fileFrom,after=K.fileTo;let shown=before;
 if(t>=70){const n=G.clamp(Math.floor((t-70)*12),0,6);shown='final'+'_final'.slice(0,n)+'.mp4';}
 const x=G.mix(r[0]+55,100,dissolve),y=G.mix(r[1]+217,469,dissolve),size=G.mix(130,153,dissolve);
 if(t<71)G.text(shown,r[0]+55,r[1]+217,130,C.white,{mono:true,maxWidth:r[2]-110});
 else{
  // Each filename glyph moves into the brand wordmark; old/new letters exchange through a mask.
  G.c.font='130px Mono';const fromWidths=Array.from(after).map(ch=>G.c.measureText(ch).width),fromXs=[];let a=r[0]+55;for(let i=0;i<after.length;i++){fromXs.push(a);a+=fromWidths[i];}
  G.c.font='153px Display';const dest=Array.from(K.brand),destXs=[];for(let i=0;i<dest.length;i++)destXs.push(100+G.c.measureText(K.brand.slice(0,i)).width);
  for(let i=0;i<dest.length;i++){const ep=G.p(t,71+(i%4)*.035,71.85+(i%4)*.035),sx=fromXs[Math.min(i,after.length-1)],tx=destXs[i],px=G.mix(sx,tx,ep),py=G.mix(r[1]+217,469,ep);G.mask([px-2,py-170,200,210],()=>{if(ep<.55)G.text(after[Math.min(i,after.length-1)],px,py-ep*230,130,C.white,{mono:true});if(ep>=.25)G.text(dest[i],px,py+(1-ep)*190,153,i>=6&&i<=10?C.lime:C.white);});}
 }
 });
 if(t>=70&&t<71){G.c.font='130px Mono';const n=G.clamp(Math.floor((t-70)*12),0,6),w=G.c.measureText('final'+'_final'.slice(0,n)).width;G.rect([r[0]+55+w,r[1]+96,5,137],C.lime);}
 // Window edges compress into the final brand underline. CTA settles before72seconds.
 if(t>=71){G.rect(G.rmix([100,630,1720,2],[100,777,1720,7],dissolve),C.lime);const en=G.p(t,71.35,72);G.mask([100,633,1720,115],()=>G.text(K.cta,100,710+(1-en)*140,69,C.white,{maxWidth:1720}));}
}
window.drawFilm=t=>{
 t=G.clamp(t,0,2249/30);const C=G.C;if(t>=72){finalCard();return;}
 G.rect([0,0,1920,1080],C.black);backdrop(t);
 if(t<6.5)intro(t);if(t>=5.5&&t<12)messages(t);
 else if(t>=12&&t<19)studio(t);else if(t>=19&&t<25)inputs(t);
 else if(t>=25&&t<63)window.drawServices(t);
 else if(t>=63&&t<69)promise(t);else if(t>=69)closing(t);
};
window.prepareFilmFrame=async t=>{await G.prepare(t);window.drawFilm(t);};
window.updateFilm=t=>{G.updateMedia(t);window.drawFilm(t);};
})();
