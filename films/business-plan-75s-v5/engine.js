/* Live vector/type toolkit shared by all continuous chapters. No persistent overlays. */
(()=>{const c=document.querySelector('#film').getContext('2d',{alpha:false}),clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-Math.pow(1-clamp(x),4),io=x=>(x=clamp(x))<.5?8*x*x*x*x:1-Math.pow(-2*x+2,4)/2,mix=(a,b,p)=>a+(b-a)*p,p=(t,a,b)=>io((t-a)/(b-a));
const G=window.G={c,clamp,ease,io,mix,p,get C(){return FILM.colors},get K(){return FILM.copy}};
G.rect=(r,col)=>{c.fillStyle=col;c.fillRect(...r)};
G.line=(x,y,xx,yy,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()};
G.stroke=(r,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.strokeRect(...r)};
G.mask=(r,fn)=>{c.save();c.beginPath();c.rect(...r);c.clip();fn();c.restore()};
G.circle=(x,y,r,col,stroke=false,w=2)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(stroke){c.strokeStyle=col;c.lineWidth=w;c.stroke()}else{c.fillStyle=col;c.fill()}};
// Typography has a measured final layout and a separate, temporary entry mask.
// Text is never measured until bundled fonts are ready, and no CSS overflow is changed.
const textMetrics=new Map();
G.fontsReady=Promise.all(['Display','Body','Mono'].map(f=>document.fonts.load(`64px ${f}`))).then(()=>{textMetrics.clear();});
G.type={service:85,feature:88,price:94,meta:31};
function fontFor(size,opts={}){return `${size}px ${opts.mono?'Mono':opts.font||'Display'}`;}
G.measure=(s,size,opts={})=>{const font=fontFor(size,opts),key=font+'|'+s;if(textMetrics.has(key))return textMetrics.get(key);c.save();c.font=font;c.textAlign='left';c.textBaseline='alphabetic';c.fontKerning='normal';if('letterSpacing'in c)c.letterSpacing='0px';const m=c.measureText(String(s));const result={width:m.width,left:m.actualBoundingBoxLeft||0,right:m.actualBoundingBoxRight||m.width,ascent:m.actualBoundingBoxAscent||size*.8,descent:Math.max(0,m.actualBoundingBoxDescent||0),fontAscent:m.fontBoundingBoxAscent||size*.95,fontDescent:m.fontBoundingBoxDescent||size*.25};c.restore();textMetrics.set(key,result);return result;};
G.text=(s,x,y,size=40,col=G.C.white,opts={})=>{c.save();c.font=fontFor(size,opts);c.textBaseline='alphabetic';c.fontKerning='normal';if('letterSpacing'in c)c.letterSpacing='0px';c.fillStyle=col;c.textAlign=opts.align||'left';const m=c.measureText(String(s)),scale=opts.maxWidth?Math.min(1,opts.maxWidth/m.width):1;c.translate(x,y);c.scale(scale,1);c.fillText(String(s),0,0);c.restore()};
G.rmix=(a,b,v)=>a.map((x,i)=>mix(x,b[i],v));
G.tracked=(s,x,y,size,col,spacing,font='Display')=>{c.save();c.font=`${size}px ${font}`;c.fillStyle=col;c.textAlign='left';c.textBaseline='alphabetic';if('letterSpacing'in c){c.letterSpacing=`${spacing}px`;c.fillText(s,x,y);}else{for(let i=0;i<s.length;i++)c.fillText(s[i],x+c.measureText(s.slice(0,i)).width+i*spacing,y);}c.restore();};
G.words=(s,x,y,size,t,start,opts={})=>{
 const lines=String(s).split('\n'),font=fontFor(size,opts),stagger=opts.stagger??.07,duration=opts.speed||.34;
 const representative=G.measure('Hg jpqy',size,opts),lineHeight=Math.max(opts.lineHeight||size*1.18,representative.ascent+representative.descent+size*.10);
 let wordIndex=0;
 for(let li=0;li<lines.length;li++){
  const line=lines[li],m=G.measure(line,size,opts),scale=opts.maxWidth?Math.min(1,opts.maxWidth/m.width):1,baseline=y+li*lineHeight;
  const padX=Math.max(3,Math.ceil(size*.07)),padY=Math.max(3,Math.ceil(size*.09));
  // This final layout box encloses actual ink, including overhangs and descenders.
  const layoutBox=[x-Math.max(0,m.left*scale)-padX,baseline-m.ascent-padY,Math.max(m.width,m.right)*scale+Math.max(0,m.left*scale)+padX*2,m.ascent+m.descent+padY*2];
  const words=line.match(/\S+/g)||[];let search=0;
  for(const word of words){
   const pos=line.indexOf(word,search);search=pos+word.length;const prefix=G.measure(line.slice(0,pos),size,opts).width,xx=x+prefix*scale;
   const en=ease((t-start-wordIndex++*stagger)/duration);if(en<=0)continue;
   G.mask(layoutBox,()=>{
    const draw=()=>{c.save();c.textBaseline='alphabetic';c.textAlign='left';c.fontKerning='normal';if('letterSpacing'in c)c.letterSpacing='0px';c.translate(xx+(1-en)*(opts.fromX||0),baseline+(1-en)*size*1.12);const k=1+(opts.punch||0)*(1-en)*(1-en);c.scale(k*scale,k);c.font=font;c.fillStyle=opts.color||G.C.white;
     if(opts.tracking&&en<1)G.tracked(word,0,0,size,opts.color||G.C.white,(1-en)*opts.tracking,opts.font||'Display');else c.fillText(word,0,0);c.restore();};
    // Entry cropping is intentional only during motion. Settled text uses its complete layout.
    if(en<1-1e-8)G.mask(layoutBox,draw);else draw();
   });
  }
 }
};
G.arrow=(x,y,s,col=G.C.lime,rot=-Math.PI/4)=>{c.save();c.translate(x,y);c.rotate(rot);G.line(-s*.5,0,s*.5,0,col,s*.07);G.line(s*.08,-s*.4,s*.5,0,col,s*.07);G.line(s*.08,s*.4,s*.5,0,col,s*.07);c.restore()};
G.check=(x,y,s,col=G.C.lime)=>{G.line(x-s*.4,y,x-s*.1,y+s*.32,col,s*.11);G.line(x-s*.1,y+s*.32,x+s*.5,y-s*.4,col,s*.11)};
G.badge=(s,x,y,col=G.C.lime,ink=G.C.black,size=24)=>{c.font=`${size}px Mono`;let w=c.measureText(s).width+34;G.rect([x,y-size-7,w,size+24],col);G.text(s,x+17,y+2,size,ink,{mono:true});return w};
G.price=(s,x,y,t,start)=>{G.words(s,x,y,G.type.price,t,start,{color:G.C.lime,maxWidth:1100,stagger:.05,speed:.28});G.words('Proposed price',x,y+57,G.type.meta,t,start+.12,{font:'Body',color:G.C.white,maxWidth:900,speed:.26});};
G.cursor=(x,y,s=1)=>{c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=G.C.white;c.strokeStyle=G.C.black;c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(0,41);c.lineTo(12,29);c.lineTo(25,51);c.lineTo(35,45);c.lineTo(22,25);c.lineTo(41,25);c.closePath();c.fill();c.stroke();c.restore()};
let videos=[],mediaError=null;const still=new Image();still.src=FILM.media.still;
G.loadMedia=()=>{mediaError=null;for(const v of videos){v.pause();v.removeAttribute('src');v.load()}videos=[0,1,2].map(()=>{const v=document.createElement('video');v.src=FILM.media.product;v.muted=true;v.playsInline=true;v.preload='auto';v.onerror=()=>mediaError='Cannot load product video: '+FILM.media.product;v.load();return v});still.src=FILM.media.still};
// A continuous bounded camera clock carries the same shot across shape morphs.
// Zero-velocity turns avoid source-pose jumps at19/25/35/46/55/63seconds.
function clock(t,i){const offsets=[0,2.0,-2.5],phase=(Math.max(15,t)-15+offsets[i])*Math.PI/12;return Math.round((.05+3.85*(1-Math.cos(phase)))*30)/30;}
G.sourceTime=clock;G.status=()=>({error:mediaError,times:videos.map(v=>v.currentTime),ready:videos.every(v=>v.readyState>=2)});
G.video=(r,t,opts={})=>{const v=videos[opts.index||0];G.mask(r,()=>{G.rect(r,G.C.panel);if(!v||v.readyState<2)return; c.save();c.filter=opts.raw?'none':'saturate(1.4) contrast(1.12) brightness(1.18)';const sc=Math.max(r[2]/v.videoWidth,r[3]/v.videoHeight),w=v.videoWidth*sc,h=v.videoHeight*sc;c.drawImage(v,r[0]+(r[2]-w)/2,r[1]+(r[3]-h)/2,w,h);c.restore()});};
G.graphic=(r,i=0,opts={})=>{G.mask(r,()=>{c.save();c.translate(r[0],r[1]);c.scale(r[2]/500,r[3]/500);const C=G.C;
 G.rect([0,0,500,500],i===1?C.lime:i===2?C.white:C.black);
 if(i!==1&&still.complete&&still.naturalWidth){c.save();c.filter='contrast(1.1) brightness(1.15)';c.drawImage(still,-170,-10,880,495);c.restore();G.rect([0,355,500,145],i===2?C.white:C.black);}
 if(i===1){G.circle(250,252,178,C.black,true,7);G.rect([77,90,32,179],C.black);G.rect([125,125,32,145],C.black);G.rect([173,160,32,110],C.black);}
 const alpha=opts.textAlpha??1;if(alpha>0)G.layer(alpha,()=>{G.text(G.K.sample[0],28,411,50,i===1?C.black:i===2?C.black:C.white,{maxWidth:440});G.text(G.K.sample[1],28,467,60,i===1?C.black:i===2?C.black:C.lime,{maxWidth:440});},'graphic-interior');c.restore();});};
G.posterWords=(r,t,start,opts={})=>{
 const alpha=opts.alpha??1;if(alpha<=0)return;
 const padding=Math.max(18,r[2]*.035),gap=Math.max(9,r[3]*.035),s0=Math.min(72,r[2]*.13,r[3]*.18),s1=Math.min(82,r[2]*.15,r[3]*.205);
 const m0=G.measure(G.K.sample[0],s0),m1=G.measure(G.K.sample[1],s1),b1=r[1]+r[3]-padding-m1.descent,b0=b1-m1.ascent-gap-m0.descent;
 G.layer(alpha,()=>G.mask(r,()=>{G.words(G.K.sample[0],r[0]+padding,b0,s0,t,start,{maxWidth:r[2]-2*padding,speed:.28});G.words(G.K.sample[1],r[0]+padding,b1,s1,t,start+.12,{color:G.C.lime,maxWidth:r[2]-2*padding,speed:.28});}),'caption-interior');
};
G.prepare=async t=>{await G.fontsReady;if(mediaError)throw Error(mediaError);await Promise.all(videos.map(async(v,i)=>{if(v.readyState<1)await new Promise((res,rej)=>{const tm=setTimeout(()=>rej(Error('Video metadata timeout')),20000);v.addEventListener('loadedmetadata',()=>{clearTimeout(tm);res()},{once:true});v.addEventListener('error',()=>{clearTimeout(tm);rej(Error(mediaError||'Video unavailable'))},{once:true})});let target=clamp(clock(t,i),0,v.duration-1/30);if(v.readyState<2||Math.abs(v.currentTime-target)>.00001)await new Promise((res,rej)=>{const tm=setTimeout(()=>rej(Error('Video seek timeout')),15000);v.addEventListener('seeked',()=>{clearTimeout(tm);res()},{once:true});v.currentTime=target;});}));if(!still.complete)await still.decode();};
G.updateMedia=t=>{for(let i=0;i<videos.length;i++){let v=videos[i];if(v.readyState>=1&&!v.seeking){let tt=clamp(clock(t,i),0,v.duration-1/30);if(Math.abs(v.currentTime-tt)>.04)v.currentTime=tt}}};
G.loadMedia();
})();
