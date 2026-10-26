/* Font-ink and settled-text regression. Inspects real loaded fonts and active masks.
   This checks the live composition; encoded-frame visual review is a separate step. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createProjectServer}=require('../server.cjs');
const ROOT=path.resolve(__dirname,'..');
(async()=>{let browser;const server=createProjectServer(ROOT);try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/render.html`);await page.evaluate(()=>renderReady);
 const result=await page.evaluate(async()=>{
  const c=G.c,glyphs=[],fontFaces=Array.from(document.fonts).map(f=>({family:f.family,status:f.status}));
  for(const size of [29,44,64,85])for(const glyph of ['g','j','p','q','y']){
   c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.filter='none';c.textAlign='left';c.textBaseline='alphabetic';c.clearRect(0,0,1920,1080);
   G.words(glyph,100,160,size,10,0,{color:G.C.white});const animated=c.getImageData(70,50,230,180).data;
   c.clearRect(0,0,1920,1080);G.text(glyph,100,160,size,G.C.white);const direct=c.getImageData(70,50,230,180).data;
   let mismatch=0,missingInk=0;for(let i=0;i<direct.length;i+=4){const a=animated[i]+animated[i+1]+animated[i+2],b=direct[i]+direct[i+1]+direct[i+2];if(a!==b)mismatch++;if(b>a+30)missingInk++;}
   glyphs.push({glyph,size,pixelMismatches:mismatch,missingInkPixels:missingInk,passed:mismatch===0});c.restore();
  }
  const stableTimes=[4,10.4,14,16.5,18.5,21.45,27.5,30.8,34.8,37.8,40.8,42.8,45.8,48.8,51.8,54.8,58.8,59.8,60.8,62.8,64.8,66.8,68.8,70.8,72.2];
  const clips=[],wordStack=[],findings=[],controlledEntryClips=[];let time=0;const oldM=G.mask,oldW=G.words,oldF=c.fillText;
  function box(r,m){const ps=[[r[0],r[1]],[r[0]+r[2],r[1]],[r[0],r[1]+r[3]],[r[0]+r[2],r[1]+r[3]]].map(([x,y])=>({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f}));return [Math.min(...ps.map(p=>p.x)),Math.min(...ps.map(p=>p.y)),Math.max(...ps.map(p=>p.x)),Math.max(...ps.map(p=>p.y))]}
  G.mask=(r,fn)=>{const world=box(r,c.getTransform()),parent=clips.at(-1)||[0,0,1920,1080],effective=[Math.max(world[0],parent[0]),Math.max(world[1],parent[1]),Math.min(world[2],parent[2]),Math.min(world[3],parent[3])];clips.push(effective);try{return oldM(r,fn)}finally{clips.pop()}};
  G.words=(...args)=>{const opts=args[6]||{},words=String(args[0]).trim().split(/\s+/).filter(Boolean).length,finished=args[5]+(opts.speed||.4)+Math.max(0,words-1)*(opts.stagger??.07);wordStack.push({text:String(args[0]),settled:args[4]>=finished-.000001});try{return oldW(...args)}finally{wordStack.pop()}};
  c.fillText=function(s,x,y,...rest){
   if(String(s).trim()){
    const m=c.measureText(String(s)),ink=box([x-m.actualBoundingBoxLeft,y-m.actualBoundingBoxAscent,m.actualBoundingBoxLeft+m.actualBoundingBoxRight,m.actualBoundingBoxAscent+m.actualBoundingBoxDescent],c.getTransform()),clip=clips.at(-1)||[0,0,1920,1080];
    const visible=Math.min(ink[2],clip[2])>Math.max(ink[0],clip[0])&&Math.min(ink[3],clip[3])>Math.max(ink[1],clip[1]);
    if(visible&&(ink[0]<clip[0]-.6||ink[1]<clip[1]-.6||ink[2]>clip[2]+.6||ink[3]>clip[3]+.6)){
     const f={time,text:String(s),font:c.font,ink,clip,clipDepth:clips.length,bottomLoss:Math.max(0,ink[3]-clip[3])};
     if(wordStack.length&&!wordStack.at(-1).settled)controlledEntryClips.push(f);else findings.push(f);
    }
   }
   return oldF.call(c,s,x,y,...rest);
  };
  try{for(time of stableTimes)await prepareFilmFrame(time);}finally{G.mask=oldM;G.words=oldW;c.fillText=oldF;}
  return {fontFaces,glyphs,stableTimes,settledTextClipFindings:findings,controlledEntryClips};
 });
 result.pageErrors=errors;result.generatedAtUtc=new Date().toISOString();result.note='Live-font/layout/mask regression only. Actual encoded MP4 frames must also be extracted and visually reviewed.';
 fs.mkdirSync(path.join(ROOT,'output'),{recursive:true});fs.writeFileSync(path.join(ROOT,'output/text-qa.json'),JSON.stringify(result,null,2)+'\n');
 assert(result.fontFaces.every(f=>f.status==='loaded'),'A defined font was not loaded');assert(result.glyphs.every(g=>g.passed),'Settled animated glyph pixels differ from unclipped direct text');assert.equal(result.settledTextClipFindings.length,0,'Settled text intersects a clip edge');assert.deepEqual(errors,[],'Uncaught browser errors');
 console.log('PASS: all defined fonts loaded before checks');console.log('PASS:20pixel-identical settled glyphs(g/j/p/q/y at29/44/64/85px)');console.log('PASS:25reading samples have no settled-text clip intersections');
 }catch(e){console.error(e);process.exitCode=1;}finally{if(browser)await browser.close();server.close();}})();
