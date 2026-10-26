/* Deterministic full-film renderer: live vectors/type plus source-video frame seeking. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{spawn}=require('node:child_process');
const {chromium}=require('playwright'),{createProjectServer}=require('./server.cjs');
const ROOT=__dirname,context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(ROOT,'config.js'),'utf8'),context);const cfg=context.window.FILM;
const args=process.argv.slice(2),stills=args.includes('--stills');
const rangeAt=args.indexOf('--range');let startFrame=0,endFrame=2250;
if(rangeAt>=0){const match=/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(args[rangeAt+1]||'');if(!match)throw Error('Use --range startSeconds:endSeconds');startFrame=Math.round(+match[1]*30);endFrame=Math.round(+match[2]*30);if(startFrame<0||endFrame>2250||startFrame>=endFrame)throw Error('Range must be within 0:75.');}
const server=createProjectServer(ROOT);
function checkedMedia(p){if(typeof p!=='string'||!p)throw Error('Missing media path.');const resolved=path.resolve(ROOT,p);if(!resolved.startsWith(ROOT+path.sep)||!fs.existsSync(resolved))throw Error('Missing project media: '+p);return resolved;}
function waitDrain(stream){return new Promise((resolve,reject)=>{const done=()=>{stream.off('error',fail);resolve()},fail=e=>{stream.off('drain',done);reject(e)};stream.once('drain',done);stream.once('error',fail)})}
(async()=>{let browser,encoder,log;try{
 if(cfg.width!==1920||cfg.height!==1080||cfg.fps!==30||cfg.duration!==75)throw Error('Expected 1920×1080 /30fps /75s.');
 for(const p of Object.values(cfg.media))checkedMedia(p);
 fs.mkdirSync(path.join(ROOT,'output'),{recursive:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const executablePath=process.env.CHROMIUM_PATH||['/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(fs.existsSync);
 browser=await chromium.launch({...(executablePath?{executablePath}:{}),headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/render.html`);await page.evaluate(()=>window.renderReady);
 if(errors.length)throw Error(errors.join('\n'));
 if(stills){
  const times=[1,4,6.5,8,10.5,11.5,12.5,14,16,18,19.5,21.5,24,25.5,27,29.5,32,34,35.5,37,39.5,42,44.5,46.5,48,50.5,53.5,56,58,59.5,60.5,62.5,63.5,65.5,67.5,68.5,69.5,71,72,73.5,2249/30];
  fs.writeFileSync(path.join(ROOT,'output/stills-times.json'),JSON.stringify(times,null,2));
  for(let i=0;i<times.length;i++){await page.evaluate(t=>prepareFilmFrame(t),times[i]);if(errors.length)throw Error(errors.join('\n'));await page.locator('canvas').screenshot({path:path.join(ROOT,`output/still-${String(i).padStart(2,'0')}.png`)});console.log(`Still ${i+1}/${times.length}: ${times[i].toFixed(3)}s`)}return;
 }
 const partial=startFrame!==0||endFrame!==2250,suffix=partial?`-range-${startFrame}-${endFrame}`:'';
 const output=path.join(ROOT,`output/FinalFinalStudio-BusinessPlan-75s${suffix}.mp4`);log=fs.openSync(path.join(ROOT,`output/render${suffix}.log`),'w');
 const duration=(endFrame-startFrame)/30;
 const audioSeek=partial?['-ss',String(startFrame/30)]:[];
 encoder=spawn('ffmpeg',['-hide_banner','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0',...audioSeek,'-i',checkedMedia(cfg.media.score),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast','-crf','17','-vf','scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-bsf:v','h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0','-c:a','aac','-b:a','256k','-ar','48000','-r','30','-t',String(duration),'-movflags','+faststart',output],{stdio:['pipe','ignore',log]});
 let encoderError;encoder.on('error',e=>encoderError=e);encoder.stdin.on('error',e=>encoderError=e);
 const finished=new Promise((resolve,reject)=>encoder.on('close',code=>code===0?resolve():reject(Error('FFmpeg exited '+code+'; inspect output/render.log'))));finished.catch(()=>{});
 const begun=Date.now();
 for(let f=startFrame;f<endFrame;f++){
  if(encoderError)throw encoderError;if(errors.length)throw Error(errors.join('\n'));
  const data=await page.evaluate(async t=>{await prepareFilmFrame(t);return document.querySelector('canvas').toDataURL('image/jpeg',.98).split(',')[1]},f/30);
  if(!encoder.stdin.write(Buffer.from(data,'base64')))await waitDrain(encoder.stdin);
  if((f-startFrame)%150===0)console.log(`${f-startFrame}/${endFrame-startFrame} frames · ${(f/30).toFixed(1)}s timeline · ${((Date.now()-begun)/1000).toFixed(0)}s elapsed`);
 }
 encoder.stdin.end();await finished;console.log('Export complete: '+output);
 }catch(e){console.error(e);process.exitCode=1;if(encoder)encoder.kill('SIGTERM');}finally{if(log!==undefined)fs.closeSync(log);if(browser)await browser.close();server.close()}
})();
