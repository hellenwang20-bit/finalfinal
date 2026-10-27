/* Frame-by-frame retirement QA. Tests real text draw calls, not just claimed state.
   Encoded movie extraction and visual inspection remain a separate required step. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createProjectServer}=require('../server.cjs');
const ROOT=path.resolve(__dirname,'..');
(async()=>{const server=createProjectServer(ROOT);let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/render.html`);await page.evaluate(()=>renderReady);
 const result=await page.evaluate(async()=>{
  const require=(v,m)=>{if(!v)throw Error(m)};
  require(JSON.stringify(FILM.copy.inputs)===JSON.stringify(['Your brief','Your brand','Your footage']),'Input spelling changed');require(FILM.copy.output==='Ready-to-share content','Output spelling changed');
  const stateFn=window.inputTransitionState||G.inputState;require(typeof stateFn==='function','Input transition state interface is required for geometry QA');
  const c=G.c,originalFill=c.fillText,originalMask=G.mask,maskStack=[];let calls=[];
  const world=(r,m)=>{const ps=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0],r[1]+r[3]],[r[0]+r[2],r[1]+r[3]]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));return [Math.min(...ps.map(p=>p.x)),Math.min(...ps.map(p=>p.y)),Math.max(...ps.map(p=>p.x)),Math.max(...ps.map(p=>p.y))]};
  G.mask=(r,fn)=>{let clip=world(r,c.getTransform()),prior=maskStack.at(-1)||[0,0,1920,1080];clip=[Math.max(clip[0],prior[0]),Math.max(clip[1],prior[1]),Math.min(clip[2],prior[2]),Math.min(clip[3],prior[3])];maskStack.push(clip);try{return originalMask(r,fn)}finally{maskStack.pop()}};
  c.fillText=function(s,x,y,...rest){const m=c.measureText(String(s)),tr=c.getTransform();const ink=world([x-m.actualBoundingBoxLeft,y-m.actualBoundingBoxAscent,m.actualBoundingBoxLeft+m.actualBoundingBoxRight,m.actualBoundingBoxAscent+m.actualBoundingBoxDescent],tr);const clip=maskStack.at(-1)||[0,0,1920,1080];const clipped=ink[0]<clip[0]-.6||ink[1]<clip[1]-.6||ink[2]>clip[2]+.6||ink[3]>clip[3]+.6;calls.push({text:String(s),alpha:c.globalAlpha,font:c.font,matrix:[tr.a,tr.b,tr.c,tr.d,tr.e,tr.f],ink,clip,clipped});return originalFill.call(c,s,x,y,...rest)};
  const coreWords=new Set(['Goal','Audience','Message','Aa']);const headingWords=new Set(['Your','brief','brand','footage']);
  const rows=[];let base=null;const numericRect=r=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite);const eq=(a,b)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<.00001);
  try{
   for(let frame=640;frame<=700;frame++){
    calls=[];const t=frame/30;await prepareFilmFrame(t);const state=stateFn(t),core=calls.filter(x=>coreWords.has(x.text)),head=calls.filter(x=>headingWords.has(x.text));
    const rects=['briefRect','brandRect','footageRect'].map(k=>state[k]);require(rects.every(numericRect),'State must return three physical card rectangles');
    if(frame===645)base=rects.map(r=>r.slice());
    if(frame>=645&&frame<=652)require(rects.every((r,i)=>eq(r,base[i])),`Geometry changed before retirement/gap completed at frame${frame}`);
    if(frame>=651){require(core.length===0,`Internal text still submitted to canvas at frame${frame}: ${core.map(x=>x.text).join(',')}`);require(head.length===0,`Input heading reappeared at frame${frame}`);}
    if(frame>=645&&frame<=650){
     require(core.some(x=>x.text==='Message'),`Message must fade as a complete line at frame${frame}`);
     for(const x of core){require(!x.clipped,`${x.text} was clipped instead of completely faded at frame${frame}`);require(Math.abs(x.alpha-state.textAlpha)<.012,`${x.text} opacity differs from explicit retirement state at frame${frame}`);}
    }
    rows.push({frame,time:t,textAlpha:state.textAlpha,briefRect:rects[0],brandRect:rects[1],footageRect:rects[2],drawnInternalText:core,drawnInputHeadings:head.map(x=>({text:x.text,alpha:x.alpha}))});
   }
   const faded=rows.filter(r=>r.frame>=645&&r.frame<=650);for(let i=1;i<faded.length;i++)require(faded[i].textAlpha<=faded[i-1].textAlpha,'Fade opacity must not rise');
   const msgAt=f=>rows.find(x=>x.frame===f).drawnInternalText.find(x=>x.text==='Message');const first=msgAt(645);
   for(let f=646;f<=650;f++){const x=msgAt(f);require(eq(x.matrix,first.matrix),'Message was translated/scaled while fading');}
   const collapsed=rows.find(x=>x.frame===688);require(collapsed.briefRect[3]<rows.find(x=>x.frame===652).briefRect[3],'Brief did not compress after text retirement');
   const additional=[];
   // All four message texts must be absent while their cards become timeline blocks.
   const messageWords=new Set(['shorter.','captions.','vertical','version.','matching','graphics.']);
   for(let f=330;f<360;f++){calls=[];await prepareFilmFrame(f/30);const residual=calls.filter(x=>messageWords.has(x.text));require(residual.length===0,`Message copy survives card compression at${f}`);additional.push({kind:'message-compression',frame:f,residual:0});}
   // Renamed filename must stop being drawn before the file window becomes the wordmark rail.
   for(let f=2132;f<=2154;f++){calls=[];await prepareFilmFrame(f/30);const residual=calls.filter(x=>/\.mp4/.test(x.text));require(residual.length===0,`Filename survives window fold at${f}`);additional.push({kind:'filename-morph',frame:f,residual:0});}
   return {passed:true,scope:'Actual canvas fillText calls, alpha, active mask intersections and physical input-card geometry',input:{fadeStartFrame:645,fadeEndFrame:651,zeroTextGapFrames:[651,652],collapseStartFrame:653,collapseEndFrame:688,scannedFrames:[640,700],frames:rows},additional,spelling:'passed',note:'Live draw-call/geometry QA only. Decode and visually inspect final MP4 transition frames separately.'};
  }finally{c.fillText=originalFill;G.mask=originalMask;}
 });
 result.pageErrors=errors;result.checkedAtUtc=new Date().toISOString();assert.deepEqual(errors,[]);fs.mkdirSync(path.join(ROOT,'output'),{recursive:true});fs.writeFileSync(path.join(ROOT,'output/transition-qa.json'),JSON.stringify(result,null,2)+'\n');
 console.log('PASS: full-size card stays fixed during complete text fade; text layer stops rendering at frame651');
 console.log('PASS: frames651–652 contain no retired words; compression653–688 has no residual internal text');
 console.log('PASS: Message has no translation/scale or glyph clipping during fade');
 console.log('PASS: message-to-timeline and filename-to-brand compression contain no retired text draw calls');
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}})();
