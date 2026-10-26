"""Package the completed, validated full film and working offline project."""
from pathlib import Path
import json,hashlib,zipfile,shutil
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output';MOVIE=OUT/'FinalFinalStudio-BusinessPlan-75s.mp4';ZIP=OUT/'FinalFinalStudio-BusinessPlan-Project.zip'
report=json.loads((OUT/'validation.json').read_text());assert report['frames']==2250 and report['duration_seconds']==75
assert hashlib.sha256(MOVIE.read_bytes()).hexdigest()==report['sha256'],'Stale media validation'
assert json.loads((OUT/'qa-report.json').read_text())['final_static_frames']==90
source=[p for p in ROOT.rglob('*') if p.is_file() and not any(s in {'output','node_modules','.git','__pycache__'} for s in p.relative_to(ROOT).parts) and p.suffix!='.pyc' and not p.name.startswith('.qa-')]
extras=[MOVIE]+[OUT/n for n in ['validation.json','qa-report.json','audio-validation.json','contact-1.jpg','contact-2.jpg','contact-3.jpg','stills-times.json']]
with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(source+extras):z.write(p,Path('FinalFinalStudio-BusinessPlan')/p.relative_to(ROOT))
with zipfile.ZipFile(ZIP) as z:
 assert z.testzip() is None
 names=z.namelist();assert 'FinalFinalStudio-BusinessPlan/output/FinalFinalStudio-BusinessPlan-75s.mp4' in names
 assert all('node_modules/' not in n and '/.git/' not in n for n in names)
folder=ROOT.parent.parent/'downloads';folder.mkdir(mode=0o755,exist_ok=True)
for p in [MOVIE,ZIP]:
 dst=folder/p.name;shutil.copyfile(p,dst);dst.chmod(0o644)
 assert hashlib.sha256(dst.read_bytes()).digest()==hashlib.sha256(p.read_bytes()).digest()
print('Verified ZIP:',len(source),'editable/source files +',len(extras),'complete delivery files')
print('MP4 MiB:',round(MOVIE.stat().st_size/1048576,2))
print('ZIP MiB:',round(ZIP.stat().st_size/1048576,2))
print('Copies verified in',folder)
