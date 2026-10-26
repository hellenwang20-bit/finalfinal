/* Live vector/type toolkit shared by all continuous chapters. No persistent overlays. */
(()=>{const c=document.querySelector('#film').getContext('2d',{alpha:false}),clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-Math.pow(1-clamp(x),4),io=x=>(x=clamp(x))<.5?8*x*x*x*x:1-Math.pow(-2*x+2,4)/2,mix=(a,b,p)=>a+(b-a)*p,p=(t,a,b)=>io((t-a)/(b-a));
const G=window.G={c,clamp,ease,io,mix,p,get C(){return FILM.colors},get K(){return FILM.copy}};
G.rect=(r,col)=>{c.fillStyle=col;c.fillRect(...r)};
G.line=(x,y,xx,yy,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke()};
G.stroke=(r,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.strokeRect(...r)};
G.mask=(r,fn)=>{c.save();c.beginPath();c.rect(...r);c.clip();fn();c.restore()};
G.circle=(x,y,r,col,stroke=false,w=2)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(stroke){c.strokeStyle=col;c.lineWidth=w;c.stroke()}else{c.fillStyle=col;c.fill()}};
G.text=(s,x,y,size=40,col=G.C.white,opts={})=>{c.save();c.font=`${size}px ${opts.mono?'Mono':'Display'}`;c.fillStyle=col;c.textAlign=opts.align||'left';let scale=opts.maxWidth?Math.min(1,opts.maxWidth/c.measureText(String(s)).width):1;c.translate(x,y);c.scale(scale,1);c.fillText(String(s),0,0);c.restore()};
G.rmix=(a,b,v)=>a.map((x,i)=>mix(x,b[i],v));
G.tracked=(s,x,y,size,col,spacing)=>{c.save();c.font=`${size}px Display`;c.fillStyle=col;for(const l of s){c.fillText(l,x,y);x+=c.measureText(l).width+spacing}c.restore()};
G.words=(s,x,y,size,t,start,opts={})=>{
 const lines=String(s).split('\n'),lh=opts.lineHeight||size*1.1,stagger=opts.stagger??.07;
 lines.forEach((line,li)=>{c.font=`${size}px Display`;const ws=line.split(' '),gap=c.measureText(' ').width,total=c.measureText(line).width,scale=opts.maxWidth?Math.min(1,opts.maxWidth/total):1;let xx=x;
 ws.forEach((word,wi)=>{const en=ease((t-start-(li*ws.length+wi)*stagger)/(opts.speed||.4));if(en<=0){xx+=(c.measureText(word).width+gap)*scale;return;}
 G.mask([x-2,y-size+li*lh-8,opts.maxWidth||1800,size*1.24],()=>{c.save();c.translate(xx+(1-en)*(opts.fromX||0),y+li*lh+(1-en)*size*1.12);const k=1+(opts.punch||0)*Math.pow(1-en,2);c.scale(k*scale,k);c.font=`${size}px Display`;c.fillStyle=opts.color||G.C.white;
 if(opts.tracking)G.tracked(word,0,0,size,opts.color||G.C.white,(1-en)*opts.tracking);else c.fillText(word,0,0);c.restore();});xx+=(c.measureText(word).width+gap)*scale;
 });});
};
G.arrow=(x,y,s,col=G.C.lime,rot=-Math.PI/4)=>{c.save();c.translate(x,y);c.rotate(rot);G.line(-s*.5,0,s*.5,0,col,s*.07);G.line(s*.08,-s*.4,s*.5,0,col,s*.07);G.line(s*.08,s*.4,s*.5,0,col,s*.07);c.restore()};
G.check=(x,y,s,col=G.C.lime)=>{G.line(x-s*.4,y,x-s*.1,y+s*.32,col,s*.11);G.line(x-s*.1,y+s*.32,x+s*.5,y-s*.4,col,s*.11)};
G.badge=(s,x,y,col=G.C.lime,ink=G.C.black,size=24)=>{c.font=`${size}px Mono`;let w=c.measureText(s).width+34;G.rect([x,y-size-7,w,size+24],col);G.text(s,x+17,y+2,size,ink,{mono:true});return w};
G.price=(s,x,y,t,start)=>{G.words(s,x,y,91,t,start,{color:G.C.lime,maxWidth:1100,stagger:.06});G.words('Proposed price',x,y+55,29,t,start+.15,{color:G.C.white,maxWidth:900});};
G.cursor=(x,y,s=1)=>{c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=G.C.white;c.strokeStyle=G.C.black;c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(0,41);c.lineTo(12,29);c.lineTo(25,51);c.lineTo(35,45);c.lineTo(22,25);c.lineTo(41,25);c.closePath();c.fill();c.stroke();c.restore()};
let videos=[],mediaError=null;const still=new Image();still.src=FILM.media.still;
G.loadMedia=()=>{mediaError=null;for(const v of videos){v.pause();v.removeAttribute('src');v.load()}videos=[0,1,2].map(()=>{const v=document.createElement('video');v.src=FILM.media.product;v.muted=true;v.playsInline=true;v.preload='auto';v.onerror=()=>mediaError='Cannot load product video: '+FILM.media.product;v.load();return v});still.src=FILM.media.still};
function clock(t,i){let b;if(t>=25&&t<35)b=(t-25)*.65;else if(t>=35&&t<46)b=i===1?1+Math.max(0,t-38)*.6:i===2?2+Math.max(0,t-38)*.5:(t-35)*.55;else if(t>=19&&t<25)b=(t-19)*.7;else if(t>=46&&t<55)b=(t-46)*.65;else if(t>=55&&t<63)b=(t-55)*.8;else if(t>=63&&t<69)b=(t-63);else b=Math.max(0,t-15)*.9;return clamp(b,0,7.8)}
G.sourceTime=clock;G.status=()=>({error:mediaError,times:videos.map(v=>v.currentTime),ready:videos.every(v=>v.readyState>=2)});
G.video=(r,t,opts={})=>{const v=videos[opts.index||0];G.mask(r,()=>{G.rect(r,G.C.panel);if(!v||v.readyState<2)return; c.save();c.filter=opts.raw?'none':'saturate(1.4) contrast(1.12) brightness(1.18)';const sc=Math.max(r[2]/v.videoWidth,r[3]/v.videoHeight),w=v.videoWidth*sc,h=v.videoHeight*sc;c.drawImage(v,r[0]+(r[2]-w)/2,r[1]+(r[3]-h)/2,w,h);c.restore()});};
G.graphic=(r,i=0)=>{G.mask(r,()=>{c.save();c.translate(r[0],r[1]);c.scale(r[2]/500,r[3]/500);const C=G.C;
 G.rect([0,0,500,500],i===1?C.lime:i===2?C.white:C.black);
 if(i!==1&&still.complete&&still.naturalWidth){c.save();c.filter='contrast(1.1) brightness(1.15)';c.drawImage(still,-170,-10,880,495);c.restore();G.rect([0,355,500,145],i===2?C.white:C.black);}
 if(i===1){G.circle(250,252,178,C.black,true,7);G.rect([77,90,32,179],C.black);G.rect([125,125,32,145],C.black);G.rect([173,160,32,110],C.black);}
 G.text(G.K.sample[0],28,411,50,i===1?C.black:i===2?C.black:C.white,{maxWidth:440});G.text(G.K.sample[1],28,467,60,i===1?C.black:i===2?C.black:C.lime,{maxWidth:440});c.restore();});};
G.posterWords=(r,t,start)=>{G.mask(r,()=>{G.words(G.K.sample[0],r[0]+22,r[1]+r[3]*.7,Math.min(72,r[2]*.13),t,start,{maxWidth:r[2]-44});G.words(G.K.sample[1],r[0]+22,r[1]+r[3]*.85,Math.min(82,r[2]*.15),t,start+.15,{color:G.C.lime,maxWidth:r[2]-44})});};
G.prepare=async t=>{if(mediaError)throw Error(mediaError);await Promise.all(videos.map(async(v,i)=>{if(v.readyState<1)await new Promise((res,rej)=>{const tm=setTimeout(()=>rej(Error('Video metadata timeout')),20000);v.addEventListener('loadedmetadata',()=>{clearTimeout(tm);res()},{once:true});v.addEventListener('error',()=>{clearTimeout(tm);rej(Error(mediaError||'Video unavailable'))},{once:true})});let target=clamp(clock(t,i),0,v.duration-1/30);if(v.readyState<2||Math.abs(v.currentTime-target)>.00001)await new Promise((res,rej)=>{const tm=setTimeout(()=>rej(Error('Video seek timeout')),15000);v.addEventListener('seeked',()=>{clearTimeout(tm);res()},{once:true});v.currentTime=target;});}));if(!still.complete)await still.decode();};
G.updateMedia=t=>{for(let i=0;i<videos.length;i++){let v=videos[i];if(v.readyState>=1&&!v.seeking){let tt=clamp(clock(t,i),0,v.duration-1/30);if(Math.abs(v.currentTime-tt)>.04)v.currentTime=tt}}};
G.loadMedia();
})();
