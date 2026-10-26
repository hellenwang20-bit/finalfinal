"""Check actual encoded movie, every decoded frame and audio metadata. Requires NumPy."""
from pathlib import Path
import subprocess,json,hashlib
from datetime import datetime,timezone
import numpy as np
ROOT=Path(__file__).resolve().parents[1];MOVIE=ROOT/'output/FinalFinalStudio-BusinessPlan-75s.mp4'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(MOVIE)],text=True))
v=next(s for s in probe['streams'] if s['codec_type']=='video');a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert(v['width'],v['height'],v['r_frame_rate'],v['nb_frames'])==(1920,1080,'30/1','2250')
assert v['codec_name']=='h264' and a['codec_name']=='aac'
assert float(v['duration'])==float(a['duration'])==float(probe['format']['duration'])==75
assert v['pix_fmt']=='yuv420p' and v['color_space']=='bt709'
proc=subprocess.Popen(['ffmpeg','-v','error','-i',str(MOVIE),'-map','0:v:0','-vf','scale=192:108','-pix_fmt','rgb24','-f','rawvideo','pipe:1'],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
framebytes=192*108*3;n=0;minimum=192*108;blank=[];tail=None;max_rms=0
while True:
 b=proc.stdout.read(framebytes)
 if not b:break
 assert len(b)==framebytes,'Partial decoded frame'
 arr=np.frombuffer(b,dtype=np.uint8).reshape(108,192,3);lit=int((arr.max(axis=2)>70).sum());minimum=min(minimum,lit)
 if lit<10:blank.append(n)
 if n>=2160:
  if tail is None:tail=arr.astype(np.float32)
  else:max_rms=max(max_rms,float(np.sqrt(np.mean((arr.astype(np.float32)-tail)**2))))
 n+=1
err=proc.stderr.read().decode();code=proc.wait();assert code==0,err;assert n==2250;assert not blank,blank;assert max_rms<1,'Encoded final card changed substantially'
report={'title':'Final Final Studio — Yiran Wang Business Plan','validated_at_utc':datetime.now(timezone.utc).isoformat(timespec='seconds'),'duration_seconds':75,'frames':2250,'video':{k:v.get(k) for k in ['codec_name','width','height','r_frame_rate','pix_fmt','color_space','color_primaries','color_transfer']},'audio':{k:a.get(k) for k in ['codec_name','sample_rate','channels','duration']},'full_video_decode':'passed','decoded_frames':n,'blank_frames':blank,'minimum_visible_thumbnail_pixels':minimum,'final_card':{'start':72,'end':75,'live_canvas_identical_frames':90,'decoded_thumbnail_max_rms_difference':max_rms},'sha256':hashlib.sha256(MOVIE.read_bytes()).hexdigest(),'file_bytes':MOVIE.stat().st_size,'voiceover':'None; original instrumental synthesis and action effects only','client_footage':'Not supplied; authored original CGI video used as permitted, labelled Concept work at first appearance','services':{'Quick Edit':{'video':'One15–30s','aspect_ratios':1,'revision_rounds':1,'proposed_price':'€200 / project'},'Campaign Content Pack':{'main_video':1,'main_max_seconds':60,'short_cutdowns':2,'matching_graphics':3,'proposed_price':'€500 / pack'},'Monthly Creative Support':{'max_hours_per_month':20,'tasks_agreed_in_advance':True,'proposed_price':'€900 / month'}},'qa_report':'qa-report.json'}
(ROOT/'output/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('PASS:',n,'frames /75.000s /1920x1080 /30fps /H264+AAC /BT709')
print('PASS: complete video decode, no blank frames, minimum visible thumbnail pixels',minimum)
print('PASS: final3s stable; encoded thumbnail RMSmax',round(max_rms,5))
print('Movie bytes:',MOVIE.stat().st_size)
