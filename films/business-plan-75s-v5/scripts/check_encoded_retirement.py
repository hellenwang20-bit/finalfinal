"""Check the former Message glyph area in actual encoded zero-text gap frames."""
from pathlib import Path
import hashlib,json
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output';MOVIE=OUT/'FinalFinalStudio-BusinessPlan-75s-v5.mp4';D=OUT/'encoded-review'
manifest=json.loads((D/'transition-manifest.json').read_text());sha=hashlib.sha256(MOVIE.read_bytes()).hexdigest();assert manifest['source_sha256']==sha
# Full-size settled Message ink lies inside this region; checkboxes and rules lie outside.
roi=[162,496,345,535];samples=[]
for f in [645,648,650,651,652,653]:
 item=next(s for s in manifest['samples'] if s['frame']==f);a=np.asarray(Image.open(D/item['file']).convert('RGB').crop(tuple(roi)))
 dark=int((a.min(axis=2)<200).sum());samples.append({'frame':f,'time':f/30,'former_message_ink_roi':roi,'dark_pixels_below_200':dark,'minimum_channel':int(a.min()),'file':item['file']})
 if f>=651:assert dark==0, f'Residual dark ink in the former Message area at frame {f}: {dark} pixels'
assert samples[0]['dark_pixels_below_200']>100,'Control frame does not include visible Message glyphs'
r={'passed':True,'source_movie':MOVIE.name,'source_sha256':sha,'source':'Actual final H.264 frames decoded by FFmpeg','method':'Dark-ink control at f645, fading samples, and zero dark pixels in the complete former Message region at f651/f652/f653. Independent live draw-call QA covers all text during changing geometry.','samples':samples,'visual_review':'See transition-review.md for separate inspection of the complete moving document route.'}
(OUT/'transition-encoded-report.json').write_text(json.dumps(r,indent=2)+'\n')
print('PASS: encoded gap/collapse-start frames651–653 contain zero residual Message ink pixels')
