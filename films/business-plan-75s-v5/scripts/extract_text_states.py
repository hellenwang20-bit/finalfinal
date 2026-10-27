"""Extract exact encoded MP4 frames for four-state review of every major text block."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output/encoded-review';OUT.mkdir(exist_ok=True)
MOVIE=ROOT/'output/FinalFinalStudio-BusinessPlan-75s-v5.mp4'
# label, four exact timeline times, crop(x,y,width,height). Crops are inspection views only.
G=[
 ('Yiran Wang',[.15,.5,3,5.5667],[80,220,1100,170]),
 ('Business Plan',[.65,1.1,3.5,5.5667],[80,365,1760,280]),
 ('Media Business & Enterprise',[1.4,1.85,4,5.5667],[85,625,1740,180]),
 ('More content.',[6.1,6.5,8.5,10.9667],[80,220,920,210]),
 ('Same deadline.',[6.6,7,9.8,10.9667],[80,410,920,210]),
 ('Final Final Studio / introduction',[12.6,13.1,14.1,14.5667],[80,300,1760,290]),
 ('Video editing + brand content',[15.1,15.55,16.2,16.9667],[80,290,925,350]),
 ('For brand teams, marketers & agencies',[17.1,17.6,18.2,18.9667],[80,300,925,350]),
 ('Your brief',[19.1,19.55,20.7,21.4667],[80,195,565,150]),
 ('Your brand',[19.95,20.35,21.2,21.4667],[665,195,565,150]),
 ('Your footage',[20.75,21.05,21.3,21.4667],[1250,195,590,150]),
 ('Goal / brief interior',[19.35,19.7,20.7,21.4667],[115,330,455,100]),
 ('Audience / brief interior',[19.35,19.7,20.7,21.4667],[115,395,455,100]),
 ('Message / brief interior',[19.35,19.7,20.7,21.4667],[115,460,455,100]),
 ('Ready-to-share content',[23.3,23.75,24.2,24.9667],[80,295,840,300]),
 ('Quick Edit',[25.1,25.5,30,34.9667],[80,55,1740,190]),
 ('One15–30s video',[25.2,25.75,27,27.9667],[80,305,820,310]),
 ('Basic captions',[28.1,28.45,29.8,30.9667],[80,270,1120,190]),
 ('One aspect ratio',[28.6,28.95,30.2,30.9667],[80,485,1120,205]),
 ('One revision round',[31.1,31.5,33.5,34.9667],[80,240,1120,190]),
 ('€200 / project',[31.65,32.1,33.5,34.9667],[80,655,1080,220]),
 ('Proposed price / Quick Edit',[31.75,32.1,33.5,34.9667],[80,795,800,85]),
 ('Campaign Content Pack',[35.1,35.55,40,45.9667],[80,55,1740,190]),
 ('1 main video / Up to60s',[35.75,36.5,37.2,37.9667],[1210,345,630,295]),
 ('2 short cutdowns',[38.1,38.55,40,40.9667],[80,735,1120,180]),
 ('3 matching graphics',[41.1,41.55,42.4,42.9667],[80,735,1120,180]),
 ('One campaign. One consistent look.',[43,43.3,44.5,45.9667],[80,170,1740,125]),
 ('€500 / pack',[43.1,43.6,44.5,45.9667],[80,775,760,180]),
 ('Proposed price / Campaign',[43.2,43.6,44.5,45.9667],[80,880,760,85]),
 ('Monthly Creative Support',[46.1,46.55,50.5,54.9667],[80,55,1740,190]),
 ('Regular content support',[46.65,47.1,48,48.9667],[80,280,820,320]),
 ('Up to20hours/month',[49.1,49.6,51,51.9667],[80,260,860,320]),
 ('Editing + simple design',[49.75,50.25,51.3,51.9667],[80,550,900,175]),
 ('Tasks agreed in advance',[52.1,52.6,53.5,54.9667],[80,260,900,290]),
 ('€900 / month',[52.15,52.6,53.5,54.9667],[80,590,860,220]),
 ('Proposed price / Monthly',[52.25,52.6,53.5,54.9667],[80,720,860,85]),
 ('Extra capacity.',[55.1,55.55,56.8,58.9667],[80,110,1740,200]),
 ('Consistent content.',[56.75,57.2,58.2,58.9667],[80,255,1740,200]),
 ('Brief → Review → Deliver',[59.1,59.6,61.5,62.9667],[80,60,1740,185]),
 ('On brief.',[63.1,63.55,64.2,68.9667],[80,215,940,205]),
 ('On brand.',[65.1,65.55,66.2,68.9667],[80,420,940,205]),
 ('On time.',[67.1,67.55,68.3,68.9667],[80,630,940,215]),
 ('final.mp4',[69.5667,69.6,69.7,69.9667],[80,280,1760,380]),
 ('final_final.mp4',[70.1,70.55,70.7,70.7667],[80,280,1760,380]),
 ('Final Final Studio / ending',[71.4,71.9333,73,74.9667],[80,275,1760,315]),
 ('Let’s make your next edit.',[71.5,71.9333,73.5,74.9667],[80,605,1740,195])]
TRANSITION_FRAMES=[645,648,650,651,652,653,660,672,688,690]
frames=sorted({max(0,min(2249,round(t*30))) for _,ts,_ in G for t in ts} | set(TRANSITION_FRAMES))
def balanced(items):
 if len(items)==1:return items[0]
 m=len(items)//2;return '('+balanced(items[:m])+'+'+balanced(items[m:])+')'
expr=balanced([f'eq(n,{f})' for f in frames])
subprocess.run(['ffmpeg','-v','error','-y','-i',str(MOVIE),'-vf',"select='"+expr+"'",'-fps_mode','vfr','-compression_level','3',str(OUT/'frame-%04d.png')],check=True)
paths={f:OUT/f'frame-{i+1:04d}.png' for i,f in enumerate(frames)}
font=ImageFont.truetype(str(ROOT/'assets/Mono.ttf'),18);small=ImageFont.truetype(str(ROOT/'assets/Mono.ttf'),16)
states=['Entry','Landed','Hold','Before exit'];manifest=[]
for i,(label,ts,roi) in enumerate(G):
 row=[]
 for state,t in zip(states,ts):
  f=max(0,min(2249,round(t*30)));row.append({'state':state,'frame':f,'time':f/30,'file':paths[f].name,'roi':roi})
 manifest.append({'label':label,'samples':row})
for pg in range((len(G)+7)//8):
 selected=manifest[pg*8:(pg+1)*8];sheet=Image.new('RGB',(2000,60+len(selected)*235),'#111111');d=ImageDraw.Draw(sheet)
 d.text((12,14),f'Actual encoded MP4 / V5 text-state review / {pg+1}',font=font,fill='#C5FF00')
 for r,group in enumerate(selected):
  yy=60+r*235;d.text((12,yy),group['label'],font=font,fill='#C5FF00')
  for j,s in enumerate(group['samples']):
   x=j*500+5;d.text((x,yy+27),f'{s["state"]} / {s["time"]:.3f}s',font=small,fill='#F5F5F0')
   xx,y,w,h=s['roi'];im=Image.open(OUT/s['file']).convert('RGB').crop((xx,y,xx+w,y+h));im.thumbnail((490,174));sheet.paste(im,(x,yy+54))
 sheet.save(OUT/f'text-states-{pg+1}.jpg',quality=96)
source_sha256=hashlib.sha256(MOVIE.read_bytes()).hexdigest()
(OUT/'manifest.json').write_text(json.dumps({'source_movie':MOVIE.name,'source_sha256':source_sha256,'source':'Decoded final H264 MP4, exact selected frame numbers','text_blocks':manifest,'distinct_encoded_frames':len(frames),'samples':len(G)*4},ensure_ascii=False,indent=2)+'\n')
# The document follows a vertical route into the timeline. A tall crop keeps the
# whole physical object visible throughout rather than hiding its shrunken state.
transition_roi=[80,200,580,780]
transition=[]
sheet=Image.new('RGB',(2000,1140),'#111111');draw=ImageDraw.Draw(sheet)
draw.text((15,15),'Actual encoded MP4 / V5 brief text retirement and graphic-only compression',font=font,fill='#C5FF00')
for i,f in enumerate(TRANSITION_FRAMES):
 state='complete text fade' if f<651 else 'zero-text gap' if f<653 else 'graphic-only compression' if f<690 else 'assembled output'
 transition.append({'frame':f,'time':f/30,'file':paths[f].name,'roi':transition_roi,'expected_stage':state})
 xx,yy=(i%5)*400+8,55+(i//5)*540
 draw.text((xx,yy),f'Frame {f} / {f/30:.3f}s',font=small,fill='#F5F5F0')
 draw.text((xx,yy+23),state,font=small,fill='#C5FF00')
 x,y,w,h=transition_roi
 im=Image.open(paths[f]).convert('RGB').crop((x,y,x+w,y+h));im.thumbnail((384,482));sheet.paste(im,(xx,yy+48))
sheet.save(ROOT/'output/transition-contact.jpg',quality=97)
(OUT/'transition-manifest.json').write_text(json.dumps({'source_movie':MOVIE.name,'source_sha256':source_sha256,'source':'Decoded final H264 MP4, exact selected frame numbers','scope':'Brief object and its complete path; image extraction is evidence, not an automatic visual verdict','samples':transition,'contact_sheet':'../transition-contact.jpg'},ensure_ascii=False,indent=2)+'\n')
print('Extracted',len(frames),'actual encoded frames for',len(G),'text blocks /',len(G)*4,'state samples.')
