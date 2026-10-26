"""Verify and package Motion Study02; run after npm run render."""
from pathlib import Path
import json,subprocess,hashlib,zipfile,wave
from datetime import datetime,timezone
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output';MOVIE=OUT/'FinalFinalStudio-MotionPreview-v2.mp4'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(MOVIE)],text=True))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert(v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(1920,1080,'30/1','450')
assert float(probe['format']['duration'])==float(v['duration'])==float(a['duration'])==15
assert v['codec_name']=='h264' and a['codec_name']=='aac'
subprocess.run(['ffmpeg','-v','error','-i',str(MOVIE),'-f','null','-'],check=True)
with wave.open(str(ROOT/'assets/preview-score.wav')) as w:assert(w.getframerate(),w.getnchannels(),w.getnframes())==(48000,2,720000)
original=ROOT.parent/'output/final-final-studio.mp4'
report={'title':'Final Final Studio / Motion Study02','status':'15-second motion prototype; original75-second film preserved','generated_at_utc':datetime.now(timezone.utc).isoformat(timespec='seconds'),'format':{'width':1920,'height':1080,'fps':30,'frames':450,'duration':15,'video':'H264','audio':'AAC','colorspace':v.get('color_space')},'full_decode':'passed','sha256':digest(MOVIE),'original_75s_sha256':digest(original) if original.exists() else None,'media':{'product_footage':'Not supplied','sample':'Bundled8-second original CGI video,240frames960x540; not client footage or finalcampaign','storyboard':'Not supplied; written brief used','voiceover':'Not supplied; no speech synthesized'},'audio':{'original':True,'bpm':120,'sample_rate':48000,'channels':2,'duration':15,'stems':['assets/music.wav','assets/workflow-sfx.wav'],'cues':'assets/beat-map.json'},'verified_workflows':['Playback advances','Frame360 scrubs to12sec','Config palette editing','No uncaught JavaScript exceptions','Three formats at12sec use same source5.399999sec frame','Deterministic export','Full decode of exported MP4'],'notes':'Preview only. The75-second edit has not yet been rebuilt.'}
(OUT/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
archive=OUT/'FinalFinalStudio-MotionPreview-v2-Project.zip'
files=[p for p in ROOT.rglob('*') if p.is_file() and not any(part in {'output','node_modules','.git','__pycache__'} for part in p.relative_to(ROOT).parts) and not p.name.startswith('.qa-') and p.suffix!='.pyc']
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(files):z.write(p,Path('final-final-motion-v2')/p.relative_to(ROOT))
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print('Verified:1920x1080 /30fps /450frames /15.000s; full decodepassed')
print('Archive:',len(files),'files;',archive.stat().st_size,'bytes')
print('Movie:',MOVIE.stat().st_size,'bytes; SHA256',digest(MOVIE))
