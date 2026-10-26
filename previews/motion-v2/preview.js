/* One continuous composition: the same message cards become editable clip blocks;
   the selected block expands into a playing video, then becomes three video crops.
   All principal copy, paths, action cues and colours are in config.js. */
(()=>{
const canvas=document.querySelector('#film'),c=canvas.getContext('2d',{alpha:false});
let clip,mediaError=null;const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),mix=(a,b,p)=>a+(b-a)*p;
const out=x=>1-Math.pow(1-clamp(x),4),smooth=x=>(x=clamp(x))<.5?8*x*x*x*x:1-Math.pow(-2*x+2,4)/2;
const at=(t,a,b)=>smooth((t-a)/(b-a));const rectMix=(a,b,p)=>a.map((v,i)=>mix(v,b[i],p));
function rect(x,y,w,h,col){c.fillStyle=col;c.fillRect(x,y,w,h)}
function line(x,y,xx,yy,col,w=2){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()}
function txt(s,x,y,size,col,{width=0,mono=false,align='left'}={}){c.save();c.font=`${size}px ${mono?'Mono':'Display'}`;c.fillStyle=col;c.textAlign=align;const scale=width?Math.min(1,width/c.measureText(s).width):1;c.translate(x,y);c.scale(scale,1);c.fillText(s,0,0);c.restore()}
function tracked(s,x,y,size,col,spacing=3){c.save();c.font=`${size}px Display`;c.fillStyle=col;for(const l of s){c.fillText(l,x,y);x+=c.measureText(l).width+spacing}c.restore()}
function mask(r,fn){c.save();c.beginPath();c.rect(...r);c.clip();fn();c.restore()}
function strokeRect(r,col,w=2){c.strokeStyle=col;c.lineWidth=w;c.strokeRect(...r)}
function arrow(x,y,s,col){line(x-s*.4,y+s*.4,x+s*.4,y-s*.4,col,s*.07);line(x-s*.15,y-s*.4,x+s*.4,y-s*.4,col,s*.07);line(x+s*.4,y-s*.4,x+s*.4,y+s*.15,col,s*.07)}
function pill(s,x,y,bg,fg,size=18){c.font=`${size}px Mono`;const w=c.measureText(s).width+30;rect(x,y-26,w,42,bg);txt(s,x+15,y+2,size,fg,{mono:true});return w}
function word(s,x,y,size,t,start,{color=PREVIEW.colors.white,width=1600,exit=99,overshoot=0,tracking=0}={}){
 const p=out((t-start)/.35),ex=at(t,exit,exit+.28);if(t<start||ex>=1)return;
 mask([0,Math.max(155,y-size*1.05),1920,size*1.3],()=>{
 c.save();c.translate(x+(1-p)*-180-ex*420,y+(1-p)*size*1.1);const scale=1+overshoot*Math.pow(1-p,2);c.scale(scale,scale);
 if(tracking){tracked(s,0,0,size,color,mix(tracking,0,p))}else txt(s,0,0,size,color,{width});c.restore();
 });
}
function video(r,t,{raw=false,fit='cover'}={}){
 mask(r,()=>{rect(...r,'#232323');if(!clip||clip.readyState<2){txt('MEDIA REQUIRED',r[0]+24,r[1]+50,24,PREVIEW.colors.lime,{mono:true});return;}
 c.save();c.filter=raw?'none':'saturate(1.45) contrast(1.12) brightness(1.2)';
 const [x,y,w,h]=r,scale=fit==='contain'?Math.min(w/clip.videoWidth,h/clip.videoHeight):Math.max(w/clip.videoWidth,h/clip.videoHeight);
 // Same decoded source frame is reused in every crop, including before/after.
 const vw=clip.videoWidth*scale,vh=clip.videoHeight*scale;c.drawImage(clip,x+(w-vw)/2,y+(h-vh)/2,vw,vh);c.restore();
 });
}
function cursor(x,y,col){c.save();c.translate(x,y);c.fillStyle=col;c.beginPath();c.moveTo(0,0);c.lineTo(0,43);c.lineTo(12,31);c.lineTo(24,54);c.lineTo(34,49);c.lineTo(22,28);c.lineTo(42,27);c.closePath();c.fill();c.strokeStyle='#111111';c.lineWidth=3;c.stroke();c.restore()}
function clipRects(t){
 const x=[160,425,750,1075,1390,1625],w=[245,305,305,295,215,135];
 const trim=at(t,4,4.5),snap=at(t,4.5,5);return x.map((xx,i)=>[
 xx+(i>2?-80*snap:0),750,w[i]-(i===2?80*trim:0),110]);
}
function panel(t){const P=PREVIEW,C=P.colors,T=P.timing,K=P.copy;
 const fold=at(t,T.compress,T.compressed),zoom=at(t,T.zoom,T.full),slots=clipRects(t);
 c.save();c.translate(-zoom*170,0);const sceneScale=1-zoom*.06;c.translate(960*(1-sceneScale),540*(1-sceneScale));c.scale(sceneScale,sceneScale);
 // A single typographic thought at a time, not a paragraph entrance.
 if(t<3.3){let wi=Math.max(0,Math.min(2,Math.floor(t)));word(K.introWords[wi],100,475,257,t,wi,{width:1000,overshoot:.5,tracking:30,exit:Math.min(3,wi+1)-.18});
 txt(K.introNote,108,590,23,C.white,{mono:true});for(let i=0;i<3;i++)rect(105+i*88,650,70,6,i<=wi?C.lime:'#44443E');}
 if(t>=3){word(K.timelineHeading[0],100,342,128,t,3,{width:850,exit:5.5,tracking:25});word(K.timelineHeading[1],100,577,244,t,3.5,{width:900,overshoot:.35,exit:5.5});txt(K.timelineNote,108,650,23,C.white,{mono:true});}
 // Preview pane glides out of the area vacated by the cards.
 if(t>=3){const pane=rectMix([1180,500,520,292],[1080,191,740,416],fold);video(pane,t,{raw:true});strokeRect(pane,C.lime,2);if(fold>.8){txt('PREVIEW',1080,164,18,C.lime,{mono:true});txt('01 / 03',1820,164,18,C.white,{mono:true,align:'right'});}}
 // Timeline bed grows around the very same cards as they compress.
 if(t>=3){const bed=at(t,3,3.5);mask([100,690,1720*bed,275],()=>{rect(100,690,1720,275,'#1D1D1B');line(100,732,1820,732,'#55554E',1);for(let i=0;i<29;i++){let x=160+i*55;line(x,705,x,i%4===0?726:715,'#8A8A80',1)}txt(K.trackNames[0],115,783,13,C.white,{mono:true});});}
 K.messages.forEach((message,i)=>{
 if(t<T.messages[i])return;const en=out((t-T.messages[i])/.27),depth=(i-2.5)*8;
 const floating=[1040+(i%2)*83-depth+Math.sin(t*.9+i)*7,238+i*98+Math.sin(t+i)*5,650,131];
 const target=slots[i];const r=rectMix(floating,target,fold);
 r[0]+=(1-en)*650;r[1]+=(1-en)*70;
 c.save();c.translate((t<3?(t/3)*depth:0),0);c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=22;c.shadowOffsetY=15;
 rect(...r,i===5||i===2?C.lime:C.white);c.shadowBlur=0;c.shadowOffsetY=0;
 mask(r,()=>{
 if(fold<.7){txt(K.messageLabels[i],r[0]+26,r[1]+30,14,C.black,{mono:true});txt(message,r[0]+26,r[1]+89,mix(38,24,fold),C.black,{width:r[2]-70});arrow(r[0]+r[2]-43,r[1]+27,23,C.black);}
 else{video([r[0],r[1],r[2],r[3]],t,{raw:true});rect(r[0],r[1]+r[3]-29,r[2],29,i===2?C.lime:C.white);txt(K.clipLabels[i],r[0]+10,r[1]+r[3]-9,15,C.black,{mono:true,width:r[2]-20});}
 });if(i===2&&fold>.9)strokeRect(r,C.lime,4);c.restore();
 });
 if(t>=4){
 const trim=at(t,4,4.5),snap=at(t,4.5,5);const sel=slots[2];
 // Visible trim handles and a released tail move away before the ripple snap.
 line(sel[0]+sel[2],738,sel[0]+sel[2],872,C.lime,5);
 if(t<4.6){rect(1057-80*trim,750,80,110,'#47473D');line(1057-80*trim,750,1137-80*trim,860,C.lime,2);pill(K.cutLabel,866,700,C.lime,C.black);}
 if(t>=4.5&&t<5.5){pill(K.snapLabel,1085-80*snap,700,C.lime,C.black);line(1075-80*snap,735,1075-80*snap,878,C.lime,2);}
 const cap=at(t,5.5,6);if(cap>0){txt(K.trackNames[1],115,921,13,C.white,{mono:true});K.captionWords.forEach((s,i)=>{const xx=160+i*390;rect(xx,895,370*cap,42,C.lime);mask([xx,895,370*cap,42],()=>txt(s,xx+16,924,21,C.black,{mono:true}));});}
 const px=160+clamp((t-3)/3.5)*1490;line(px,693,px,950,C.lime,3);rect(px-9,691,18,14,C.lime);
 const cur=[mix(1230,975,at(t,3.8,4.3)),mix(580,804,at(t,3.8,4.3))];if(t>=4.5){cur[0]=mix(975,1000,at(t,4.5,5));cur[1]=804;}cursor(...cur,C.white);
 }
 c.restore();
 return slots[2];
}
function fullResult(t,r){const P=PREVIEW,C=P.colors,T=P.timing,K=P.copy;
 video(r,t);const split=mix(1920,0,at(t,T.wipe,T.wipeDone));
 if(t<T.wipeDone){mask([0,0,split,1080],()=>video(r,t,{raw:true}));}
 // Branded graphics are revealed by the divider while the camera/shot keeps playing.
 mask([split,0,1920-split,1080],()=>{
 if(t>=6.5){word(K.resultWords[0],100,355,148,t,6.5,{width:720,color:C.white,tracking:15});word(K.resultWords[1],100,505,148,t,7,{width:720,color:C.white,tracking:15});word(K.resultWords[2],100,655,148,t,7.5,{width:720,color:C.lime,overshoot:.16});}
 });
 if(t>=T.wipe&&t<T.wipeDone){line(split,136,split,942,C.lime,5);rect(split-17,500,34,84,C.lime);line(split-7,522,split-7,564,C.black,3);line(split+7,522,split+7,564,C.black,3);if(split>300)pill(K.sourceLabel,100,158,C.black,C.white);if(split<1580)pill(K.editedLabel,1600,158,C.lime,C.black);}
 if(t>=T.wipeDone&&t<9.5)pill(K.editedLabel,100,840,C.lime,C.black,20);
}
function formats(t){const P=PREVIEW,C=P.colors,T=P.timing,K=P.copy;
 const vertical=[804,204,312,554],full=[0,0,1920,1080],from=rectMix(full,vertical,at(t,T.reframe,T.vertical));
 // Type lives behind the shrinking image. No empty interstitial frame.
 if(t>=9.5&&t<11.5){word(K.finalWords[0],100,464,258,t,9.5,{width:900,color:C.white,tracking:20,exit:11.2});word(K.finalWords[1],100,755,258,t,10,{width:900,color:C.lime,exit:11.2});}
 const targets=[[100,430,770,433],[920,430,433,433],[1440,309,312,554]];
 if(t<10.5){video(from,t);strokeRect(from,C.lime,2);if(t>10.2)txt(K.ratios[2],from[0],from[1]-24,24,C.lime,{mono:true});}
 else{
 const land=rectMix(vertical,targets[0],at(t,10.5,11.5));const sq=rectMix(vertical,targets[1],at(t,11,12));const port=rectMix(vertical,targets[2],at(t,10.5,12));
 [land,sq,port].forEach((r,i)=>{
 // Tiny independent drift continues even after the layout settles.
 const drift=at(t,12,12.5);r[0]+=Math.sin((t-12)*.55+i)*3*drift;r[1]+=Math.sin((t-12)*.6+i)*2*drift;
 video(r,t);strokeRect(r,C.white,2);
 const corners=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0],r[1]+r[3]],[r[0]+r[2],r[1]+r[3]]];corners.forEach(([x,y])=>rect(x-4,y-4,8,8,C.lime));
 if(t>=12){txt(K.ratios[i],targets[i][0],920,24,C.white,{mono:true});}
 });
 }
 if(t>=11.5){const xs=[100,390,759,1215],starts=[11.5,11.5,12,12.5];K.finalWords.forEach((s,i)=>word(s,xs[i],246,104,t,starts[i],{color:i>1?C.lime:C.white,width:[285,333,430,600][i],tracking:12}));}
}
function chrome(t){const P=PREVIEW,C=P.colors,K=P.copy;
 // Identical anchors across the whole journey; no repeated chapter title resets.
 txt(K.brand,100,92,22,C.white,{mono:true});txt(K.study,1820,92,18,C.lime,{mono:true,align:'right'});
 line(100,115,1820,115,'#5A5A50',1);
 txt(K.concept,100,1008,17,C.lime,{mono:true});txt(K.missing,1820,1008,15,C.white,{mono:true,align:'right'});
 line(100,1036,1820,1036,'#45453D',1);rect(100,1033,1720*clamp(t/15),5,C.lime);
 // Beat markers are actual musical beats (not flashes). The dot travels continuously.
 for(let i=0;i<30;i++)line(100+i*(1720/30),1048,100+i*(1720/30),i%4===0?1060:1053,'#68685E',1);
}
window.loadPreviewMedia=()=>{mediaError=null;clip=document.createElement('video');clip.src=PREVIEW.media.product;clip.muted=true;clip.playsInline=true;clip.preload='auto';clip.onerror=()=>mediaError='Missing video: '+PREVIEW.media.product;clip.load();};
function mediaTime(t){return Math.max(0,Math.min((clip.duration||8)-1/30,(t-PREVIEW.media.startAt)*PREVIEW.media.rate));}
window.previewMediaStatus=()=>({error:mediaError,ready:clip?.readyState>=2,time:clip?.currentTime,duration:clip?.duration});
window.drawPreview=t=>{const P=PREVIEW,C=P.colors;rect(0,0,1920,1080,C.black);
 // Graphic depth on a continuous charcoal stage; deliberately no black/white flashing.
 c.save();c.globalAlpha=.22;for(let i=0;i<7;i++)line(-200+i*400+t*6,164,90+i*400+t*6,970,'#45453D',1);c.restore();
 if(t<6.5){let selected=panel(t);if(t>=P.timing.zoom){const r=rectMix(selected,[0,0,1920,1080],at(t,P.timing.zoom,P.timing.full));video(r,t,{raw:true});strokeRect(r,C.lime,2);}}
 else if(t<9.5)fullResult(t,[0,0,1920,1080]);else formats(t);
 chrome(t);
};
window.preparePreviewFrame=async t=>{
 if(mediaError)throw Error(mediaError);
 if(clip.readyState<1)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Video metadata timeout')),20000);clip.addEventListener('loadedmetadata',()=>{clearTimeout(timer);resolve()},{once:true});clip.addEventListener('error',()=>{clearTimeout(timer);reject(Error('Video unavailable'))},{once:true});});
 const target=mediaTime(t);if(Math.abs(clip.currentTime-target)>.00001||clip.readyState<2){await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Video seek timeout')),20000);clip.addEventListener('seeked',()=>{clearTimeout(timer);resolve()},{once:true});clip.addEventListener('error',()=>{clearTimeout(timer);reject(Error('Video seek error'))},{once:true});clip.currentTime=target;});}
 window.drawPreview(t);
};
window.updatePreview=t=>{if(clip?.readyState>=1&&!clip.seeking){const target=mediaTime(t);if(Math.abs(clip.currentTime-target)>.04)clip.currentTime=target;}window.drawPreview(t)};
window.loadPreviewMedia();
})();
