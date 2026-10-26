/* Meaningful acceptance checks: scope counts, actual moving video, UI and final hold. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const {createProjectServer}=require('../server.cjs');const ROOT=path.resolve(__dirname,'..');
(async()=>{const server=createProjectServer(ROOT);let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/render.html');await page.evaluate(()=>renderReady);
 const result=await page.evaluate(async()=>{
  const assert=(v,m)=>{if(!v)throw Error(m)};
  assert(FILM.duration===75&&FILM.fps===30&&FILM.width===1920&&FILM.height===1080,'Wrong delivery format');
  assert(FILM.copy.author==='Yiran Wang'&&FILM.copy.assignment==='Business Plan'&&FILM.copy.course==='Media Business & Enterprise','Missing author/course');
  let end=0;for(const ch of FILM.chapters){assert(ch.start===end&&ch.end>ch.start,'Broken chapter continuity');end=ch.end;}assert(end===75,'Chapter end');
  const capture={video:0,graphics:0,copy:[]};const oldV=G.video,oldGr=G.graphic,oldW=G.words,oldT=G.text;
  G.video=(...a)=>{capture.video++;return oldV(...a)};G.graphic=(...a)=>{capture.graphics++;return oldGr(...a)};
  G.words=(...a)=>{capture.copy.push(String(a[0]));return oldW(...a)};G.text=(...a)=>{capture.copy.push(String(a[0]));return oldT(...a)};
  async function sample(t){capture.video=0;capture.graphics=0;capture.copy=[];await prepareFilmFrame(t);return {videos:capture.video,graphics:capture.graphics,copy:[...capture.copy],times:G.status().times};}
  const quick=await sample(34);assert(quick.videos===1&&quick.graphics===0,'Quick Edit has multiple delivered formats');assert(quick.copy.includes('One revision round')&&quick.copy.includes('€200 / project')&&quick.copy.includes('Proposed price'),'Quick Edit price/scope');
  const campaign=await sample(44.5);assert(campaign.videos===3&&campaign.graphics===3,'Campaign must show1+2+3');assert(campaign.copy.includes('1 main video')&&campaign.copy.includes('2 short cutdowns')&&campaign.copy.includes('3 matching graphics')&&campaign.copy.includes('€500 / pack')&&campaign.copy.includes('Proposed price'),'Campaign scope/price');
  const monthly=await sample(53.5);assert(FILM.copy.monthly.allocations.reduce((a,b)=>a+b,0)===20,'Hours exceed20');assert(monthly.copy.includes('€900 / month')&&monthly.copy.includes('Proposed price')&&monthly.copy.some(s=>s==='Allocated: 20 / 20 hours'),'Monthly cap/price');
  for(const cap of [quick,campaign,monthly])assert(!cap.copy.some(s=>/unlimited|∞|timecode|fps|motion study/i.test(s)),'Unwanted onscreen label');
  const qA=await sample(32),qB=await sample(34);assert(Math.abs(qB.times[0]-qA.times[0])>.5,'Video freezes while price is read');
  const pA=await sample(64),pB=await sample(68);assert(pB.times[0]>pA.times[0]+2,'Promise video freezes');
  let final=null;for(let f=2160;f<2250;f++){drawFilm(f/30);const image=document.querySelector('canvas').toDataURL('image/png');if(final===null)final=image;else assert(final===image,'Final card moves during final3seconds');}
  assert(capture.copy.includes(FILM.copy.cta),'Final CTA missing');
  G.video=oldV;G.graphic=oldGr;G.words=oldW;G.text=oldT;
  return {format:'1920x1080 /30fps /75s',author_course:'passed',quick:{videos:quick.videos,graphics:quick.graphics,price:'€200 / project'},campaign:{videos:campaign.videos,graphics:campaign.graphics,price:'€500 / pack'},monthly:{max_hours:20,price:'€900 / month'},proposed_price_labels:'passed',moving_video_during_price:'passed',final_static_frames:90,no_persistent_debug_labels:'passed'};
 });
 console.log('PASS: author/course, contiguous75seconds, all service prices and scope counts');console.log('PASS: Quick1video; Campaign3videos+3graphics; monthly20-hour cap');console.log('PASS: actual video continues during price hold and brand promise');console.log('PASS: all final90frames are pixel-identical on the live canvas');
 await page.goto(base+'/index.html');await page.waitForFunction(()=>G.status().ready);await page.click('#play');await page.waitForTimeout(650);const frame=+(await page.locator('#seek').inputValue());assert(frame>3,'Playback failed');await page.click('#play');await page.locator('#seek').evaluate(el=>{el.value='2100';el.dispatchEvent(new Event('input',{bubbles:true}))});await page.waitForTimeout(250);assert((await page.locator('#time').textContent()).includes('01:10'),'Scrubber rounding failed');
 await page.locator('details').evaluate(el=>el.open=true);await page.locator('#config').evaluate(el=>{let v=JSON.parse(el.value);v.colors.lime='#B5FF00';el.value=JSON.stringify(v)});await page.click('#apply');await page.waitForFunction(()=>document.querySelector('#message').textContent==='Applied to preview.');assert.deepEqual(errors,[],'Uncaught JS errors');
 result.preview_playback='passed';result.frame_scrub='passed';result.config_edit='passed';result.page_errors=errors;fs.writeFileSync(path.join(ROOT,'output/qa-report.json'),JSON.stringify(result,null,2)+'\n');console.log('PASS: player, frame scrubbing, JSON editing, no uncaught JavaScript errors');
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}})();
