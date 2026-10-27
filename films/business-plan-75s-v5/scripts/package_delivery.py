"""Package the completed, validated full film and working offline project."""
from pathlib import Path
import json,hashlib,zipfile,shutil
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output';MOVIE=OUT/'FinalFinalStudio-BusinessPlan-75s-v5.mp4';ZIP=OUT/'FinalFinalStudio-BusinessPlan-Project-v5.zip'
report=json.loads((OUT/'validation.json').read_text());assert report['frames']==2250 and report['duration_seconds']==75
assert hashlib.sha256(MOVIE.read_bytes()).hexdigest()==report['sha256'],'Stale media validation'
assert json.loads((OUT/'qa-report.json').read_text())['final_static_frames']==90
assert json.loads((OUT/'watch-qa.json').read_text())['passed']
transition=json.loads((OUT/'transition-qa.json').read_text())
assert transition['passed'] and transition['input']['zeroTextGapFrames']==[651,652]
assert transition['input']['collapseStartFrame']==653 and transition['input']['collapseEndFrame']==688
for manifest in ['manifest.json','transition-manifest.json']:
 assert json.loads((OUT/'encoded-review'/manifest).read_text())['source_sha256']==report['sha256'],'Stale encoded review evidence'
source=[p for p in ROOT.rglob('*') if p.is_file() and not any(s in {'output','node_modules','.git','__pycache__'} for s in p.relative_to(ROOT).parts) and p.suffix!='.pyc' and not p.name.startswith('.qa-')]
extras=[MOVIE]+[OUT/n for n in ['validation.json','qa-report.json','text-qa.json','preserved-content.json','audio-validation.json','watch-qa.json','contact-1.jpg','contact-2.jpg','contact-3.jpg','stills-times.json','transition-qa.json','transition-contact.jpg']]
extras += [p for p in (OUT/'encoded-text-audit').rglob('*') if p.is_file()]
extras += sorted((OUT/'encoded-contacts').glob('*.jpg'))+[OUT/'encoded-contacts/manifest.json']
extras += [OUT/'encoded-review/manifest.json',OUT/'encoded-review/transition-manifest.json']+sorted((OUT/'encoded-review').glob('text-states-*.jpg'))
# Additional final-motion/decoded-review reports are included when the review step
# writes them; never substitute these for the required critical-transition gate.
for name in ['motion-retirement-qa.json','motion-retirement.json','transition-encoded-report.json','transition-encoded-report.md','transition-review.md']:
 if (OUT/name).is_file():extras.append(OUT/name)
assert json.loads((OUT/'text-qa.json').read_text())['settledTextClipFindings']==[]
assert json.loads((OUT/'encoded-text-audit/report.json').read_text())['passed']
with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(source+extras):z.write(p,Path('FinalFinalStudio-BusinessPlan-v5')/p.relative_to(ROOT))
with zipfile.ZipFile(ZIP) as z:
 assert z.testzip() is None
 names=z.namelist();assert 'FinalFinalStudio-BusinessPlan-v5/output/FinalFinalStudio-BusinessPlan-75s-v5.mp4' in names
 assert all('node_modules/' not in n and '/.git/' not in n for n in names)
folder=ROOT.parent.parent/'downloads';folder.mkdir(mode=0o755,exist_ok=True)
for p in [MOVIE,ZIP]:
 dst=folder/p.name;shutil.copyfile(p,dst);dst.chmod(0o644)
 assert hashlib.sha256(dst.read_bytes()).digest()==hashlib.sha256(p.read_bytes()).digest()
print('Verified ZIP:',len(source),'editable/source files +',len(extras),'complete delivery files')
print('MP4 MiB:',round(MOVIE.stat().st_size/1048576,2))
print('ZIP MiB:',round(ZIP.stat().st_size/1048576,2))
print('Copies verified in',folder)
