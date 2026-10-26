/* Verify actual encoded stable-reading text against the loaded font's ink bounds.
   This extracts the finished MP4; it does not substitute editor screenshots. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const {chromium}=require('playwright'),{createProjectServer}=require('../server.cjs');
const ROOT=path.resolve(__dirname,'..'),MOVIE=process.argv[2]?path.resolve(process.argv[2]):path.join(ROOT,'output/FinalFinalStudio-BusinessPlan-75s-v4.mp4'),DIR=path.join(ROOT,'output/encoded-text-audit');
(async()=>{const server=createProjectServer(ROOT);let browser;try{
 assert(fs.existsSync(MOVIE),'Finished MP4 is required');fs.mkdirSync(DIR,{recursive:true});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1920,height:1080}});await page.goto(`http://127.0.0.1:${server.address().port}/render.html`);await page.evaluate(()=>renderReady);
 const cases=await page.evaluate(()=>{
  const defs=[
   ['author',4,FILM.copy.author,100,319,64,'Display','white'],
   ['business-plan',4,FILM.copy.assignment,100,572,198,'Display','white'],
   ['course',4,FILM.copy.course,105,729,51,'Display','white'],
   ['campaign-title',44.5,FILM.copy.campaign.name,100,159,85,'Display','white'],
   ['monthly-title',48,FILM.copy.monthly.name,100,159,85,'Display','white'],
   ['quick-price',34,FILM.copy.quick.price,100,777,94,'Display','lime'],
   ['campaign-price',44.5,FILM.copy.campaign.price,100,853,94,'Display','lime'],
   ['monthly-price',53.5,FILM.copy.monthly.price,100,694,94,'Display','lime'],
   ['quick-proposed-price',34,'Proposed price',100,834,31,'Body','white'],
   ['campaign-proposed-price',44.5,'Proposed price',100,910,31,'Body','white'],
   ['monthly-proposed-price',53.5,'Proposed price',100,751,31,'Body','white'],
   ['final-brand',73.5,FILM.copy.brand,100,469,153,'Display','mixed'],
   ['final-cta',73.5,FILM.copy.cta,100,710,69,'Display','white']
  ];return defs.map(([id,time,text,x,baseline,size,font,color])=>{G.c.save();G.c.font=`${size}px ${font}`;G.c.textAlign='left';G.c.textBaseline='alphabetic';G.c.fontKerning='normal';if('letterSpacing'in G.c)G.c.letterSpacing='0px';const m=G.c.measureText(text);G.c.restore();const ink=[x-m.actualBoundingBoxLeft,baseline-m.actualBoundingBoxAscent,x+m.actualBoundingBoxRight,baseline+m.actualBoundingBoxDescent];const crop=[Math.max(0,Math.floor(ink[0])-10),Math.max(0,Math.floor(ink[1])-10),Math.min(1920,Math.ceil(ink[2])+10),Math.min(1080,Math.ceil(ink[3])+10)];return{id,time,frame:Math.round(time*30),text,x,baseline,size,font,color,fontLoaded:document.fonts.check(`${size}px ${font}`),expectedInk:ink,crop};});
 });
 for(const item of cases){const [l,t,r,b]=item.crop;const target=path.join(DIR,item.id+'.png');execFileSync('ffmpeg',['-v','error','-y','-ss',String(item.frame/30),'-i',MOVIE,'-frames:v','1','-vf',`crop=${r-l}:${b-t}:${l}:${t}`,target],{maxBuffer:4*1024*1024});item.image=path.relative(ROOT,target);}
 fs.writeFileSync(path.join(DIR,'font-metrics.json'),JSON.stringify(cases,null,2)+'\n');
 const python=String.raw`
from pathlib import Path
import json,sys
from PIL import Image,ImageDraw,ImageFont
import numpy as np
root=Path(sys.argv[1]);folder=Path(sys.argv[2]);cases=json.loads((folder/'font-metrics.json').read_text())
for item in cases:
 p=root/item['image'];a=np.asarray(Image.open(p).convert('RGB'))
 if item['color']=='lime':mask=(a[:,:,1]>170)&(a[:,:,0]>90)&(a[:,:,2]<110)
 elif item['color']=='mixed':mask=(a[:,:,0]>140)&(a[:,:,1]>170)
 else:mask=a.min(axis=2)>170
 ys,xs=np.where(mask);assert len(xs)>0,item['id']+' has no decoded text pixels'
 l,t,r,b=item['crop'];actual=[int(xs.min())+l,int(ys.min())+t,int(xs.max())+l,int(ys.max())+t]
 item['actualBrightInk']=actual
 item['bottomDifferencePixels']=item['expectedInk'][3]-actual[3]
 item['topDifferencePixels']=actual[1]-item['expectedInk'][1]
 item['passed']=item['fontLoaded'] and item['bottomDifferencePixels']<=2.5 and item['topDifferencePixels']<=2.5
# These are direct crops from the MP4; labels are outside the crops for inspection.
font=ImageFont.truetype(str(root/'assets/Mono.ttf'),18)
for page in range((len(cases)+4)//5):
 part=cases[page*5:page*5+5];heights=[max(110,Image.open(root/x['image']).height)+48 for x in part]
 sheet=Image.new('RGB',(1800,sum(heights)+45),'#111111');d=ImageDraw.Draw(sheet);d.text((12,12),'Decoded final MP4 / measured text ink / page '+str(page+1),font=font,fill='#C5FF00');y=45
 for row,h in zip(part,heights):
  im=Image.open(root/row['image']).convert('RGB');d.text((12,y+7),row['id']+' / '+str(row['time'])+'s / '+('PASS' if row['passed'] else 'REVIEW'),font=font,fill='#C5FF00')
  sheet.paste(im,(12,y+36));y+=h
 sheet.save(folder/('decoded-crops-'+str(page+1)+'.jpg'),quality=96)
report={'movie':str(sys.argv[3]),'source':'Actual finished MP4 frames decoded by FFmpeg','method':'Thresholded bright ink bounds compared with actualBoundingBoxAscent/Descent from fully loaded matching fonts; up to2.5px threshold/codec edge tolerance. Final visual inspection is separate.','passed':all(x['passed'] for x in cases),'cases':cases}
(folder/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{k:x[k] for k in ['id','bottomDifferencePixels','topDifferencePixels','passed']} for x in cases],indent=2))
assert report['passed'],'One or more decoded text samples need review'
`;
 console.log(execFileSync('python',['-c',python,ROOT,DIR,MOVIE],{encoding:'utf8',maxBuffer:3*1024*1024}));
 console.log('PASS:13encoded text samples retain complete measured top/bottom ink');
 }catch(e){console.error(e.message||e);if(e.stdout)console.error(String(e.stdout));process.exitCode=1;}finally{if(browser)await browser.close();server.close();}})();
