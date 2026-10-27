/* Read actual canvas submissions around non-input structural morphs.
   This is deterministic live-composition QA; decoded-film review is separate. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createProjectServer}=require('../server.cjs');
const ROOT=path.resolve(__dirname,'..');
(async()=>{const server=createProjectServer(ROOT);let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/render.html`);await page.evaluate(()=>renderReady);
 const result=await page.evaluate(async()=>{
  const check=(ok,message)=>{if(!ok)throw Error(message)};
  const c=G.c,oldFill=c.fillText,oldVideo=G.video,oldGraphic=G.graphic,oldPoster=G.posterWords;
  let calls=[],videos=[],activeSource=null;const eq=(a,b)=>a.length===b.length&&a.every((x,i)=>Math.abs(x-b[i])<.001);
  G.video=function(r,t,opts={}){videos.push({rect:r.slice(),index:opts.index||0});return oldVideo.apply(this,arguments)};
  G.graphic=function(r,index=0,opts={}){const prior=activeSource;activeSource={kind:'graphic',index,rect:r.slice(),requestedAlpha:opts.textAlpha??1};try{return oldGraphic.apply(this,arguments)}finally{activeSource=prior}};
  G.posterWords=function(r,t,start,opts={}){const prior=activeSource,v=videos.findLast(x=>eq(x.rect,r));activeSource={kind:'video-caption',index:v?.index??null,rect:r.slice(),requestedAlpha:opts.alpha??1};try{return oldPoster.apply(this,arguments)}finally{activeSource=prior}};
  c.fillText=function(text,x,y,...rest){const tr=c.getTransform();calls.push({text:String(text),alpha:c.globalAlpha,layer:G.activeTextLayer||'',source:activeSource?{...activeSource}:null,anchor:[tr.a*x+tr.c*y+tr.e,tr.b*x+tr.d*y+tr.f]});return oldFill.call(c,text,x,y,...rest)};
  const rows=[];
  async function inspect(frame,kind,filter){calls=[];videos=[];await prepareFilmFrame(frame/30);const residual=calls.filter(filter);check(residual.length===0,`${kind} retained internal copy at frame${frame}: ${JSON.stringify(residual)}`);rows.push({kind,frame,time:frame/30,retiredCopySubmissions:0,allTextSubmissions:calls.length});}
  try{
   // Timeline copy must be gone before the bed folds into the caption rail.
   const timelineWords=new Set(['First take','Selected cut','Final take','First','take','Selected','cut','Final']);
   for(let f=834;f<=844;f++)await inspect(f,'quick-timeline',x=>x.layer==='quick-timeline-copy'||timelineWords.has(x.text));
   // Every output's caption/graphic type retires before that output enters the calendar.
   for(let f=1377;f<=1410;f++)await inspect(f,'campaign-to-calendar',x=>!!x.source);
   // Calendar labels fade in place; only the unlettered grid is allowed to collapse.
   const days=new Set(FILM.copy.interface.days);
   for(let f=1467;f<=1488;f++)await inspect(f,'calendar-to-queue',x=>days.has(x.text));
   // The three agreed-task rows retire their own copy before shrinking away.
   const queueWords=new Set(['Video','editing','Captions','Simple','design','Video editing','Simple design','8h','4h']);
   for(let f=1647;f<=1662;f++)await inspect(f,'queue-to-delivery',x=>x.layer==='monthly-row-copy'||(queueWords.has(x.text)&&x.anchor[0]>950&&x.anchor[1]>300&&x.anchor[1]<800));
   // Companions leave as unlettered graphics. The surviving main project may reappear.
   for(let f=1767;f<=1785;f++)await inspect(f,'delivery-to-process',x=>x.source&&(x.source.kind==='graphic'||x.source.index!==0));
   return {passed:true,scope:'Actual canvas fillText submissions inside source media and named/positioned interior text layers',framesChecked:rows.length,rows,note:'Live composition tests only; actual decoded MP4 inspection is recorded separately.'};
  }finally{c.fillText=oldFill;G.video=oldVideo;G.graphic=oldGraphic;G.posterWords=oldPoster;}
 });
 assert.deepEqual(errors,[]);result.pageErrors=errors;result.checkedAtUtc=new Date().toISOString();fs.mkdirSync(path.join(ROOT,'output'),{recursive:true});fs.writeFileSync(path.join(ROOT,'output/motion-retirement-qa.json'),JSON.stringify(result,null,2)+'\n');
 console.log(`PASS: ${result.framesChecked} actual-frame text submission checks across five structural transitions`);
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}})();
