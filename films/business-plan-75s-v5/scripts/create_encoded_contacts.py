"""Create full-film contacts and transition strips from the actual H.264 export."""
from pathlib import Path
import subprocess,json,hashlib
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output';MOVIE=OUT/'FinalFinalStudio-BusinessPlan-75s-v5.mp4'
times=json.loads((OUT/'stills-times.json').read_text());frames=[round(t*30) for t in times]
transitions={'message-to-timeline':[321,327,329,330,345,359,360,375], 'input-to-output':[645,650,651,652,653,660,672,688,690,720], 'campaign-expansion':[1137,1140,1155,1170,1200,1245,1260,1290,1377,1380,1395,1404,1413], 'calendar-to-queue':[1458,1466,1468,1470,1485,1500,1647,1650,1668], 'export-to-brand':[2124,2128,2130,2132,2140,2148,2157,2160]}
allframes=sorted(set(frames)|{f for seq in transitions.values() for f in seq});folder=OUT/'encoded-contacts';folder.mkdir(exist_ok=True)
def balanced(xs):
 if len(xs)==1:return xs[0]
 m=len(xs)//2;return '('+balanced(xs[:m])+'+'+balanced(xs[m:])+')'
expr=balanced([f'eq(n,{f})' for f in allframes])
subprocess.run(['ffmpeg','-v','error','-y','-i',str(MOVIE),'-vf',"select='"+expr+"'",'-fps_mode','vfr',str(folder/'frame-%04d.png')],check=True)
paths={f:folder/f'frame-{i+1:04d}.png' for i,f in enumerate(allframes)};font=ImageFont.truetype(str(ROOT/'assets/Mono.ttf'),16)
def sheet(seq,target,cols,width=480):
 im=Image.new('RGB',(width*cols,((len(seq)+cols-1)//cols)*300),'#222222');d=ImageDraw.Draw(im)
 for i,f in enumerate(seq):
  src=Image.open(paths[f]).convert('RGB');src.thumbnail((width,270));x=i%cols*width;y=i//cols*300;im.paste(src,(x,y));d.text((x+8,y+274),f'Encoded frame {f} / {f/30:.3f}s',font=font,fill='#C5FF00')
 im.save(target,quality=96)
for pg in range(3):sheet(frames[pg*15:(pg+1)*15],OUT/f'contact-{pg+1}.jpg',3)
for name,seq in transitions.items():sheet(seq,folder/(name+'.jpg'),4)
report={'source_movie':MOVIE.name,'sha256':hashlib.sha256(MOVIE.read_bytes()).hexdigest(),'source':'Actual finished H.264 decoded with FFmpeg','full_film_contact_frames':frames,'transition_sequences':transitions,'note':'Extraction only. See transition-review.md for the separate visual-inspection verdict.'}
(folder/'manifest.json').write_text(json.dumps(report,indent=2)+'\n')
print('Created actual encoded contacts:',len(allframes),'distinct frames and',len(transitions),'transition strips')
