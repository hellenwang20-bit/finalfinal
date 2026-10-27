#!/usr/bin/env python3
"""Original75s instrumental score and action SFX for Final Final Studio.
120BPM /30fps. Deterministic NumPy synthesis; no speech, vocals or third-party samples.
The two editable stems sum to score.wav before PCM16 rounding. Run from any cwd.
"""
from pathlib import Path
import json,subprocess,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets';OUT.mkdir(parents=True,exist_ok=True)
SR=48000;DURATION=75;BPM=120;FPS=30
RNG=np.random.default_rng(310262026)
music=np.zeros((SR*DURATION,2),dtype=np.float64)
sfx=np.zeros_like(music)
def grid(seconds):return np.arange(round(seconds*SR))/SR
def note(n):return 440*2**((n-69)/12)
def add(dest,x,at,gain=1,pan=0):
    start=round(at*SR)
    if start<0:
        x=x[-start:];start=0
    n=min(len(x),len(dest)-start)
    if n<=0:return
    x=x[:n]*gain
    if x.ndim==1:x=np.stack([x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)],axis=1)
    dest[start:start+n]+=x

def kick():
    t=grid(.38);freq=43+124*np.exp(-t*39)
    phase=np.cumsum(freq)*2*np.pi/SR
    body=np.sin(phase)*np.exp(-t*13.5)
    transient=RNG.normal(0,1,len(t))*.045*np.exp(-t*550)
    return np.tanh((body+transient)*1.65)*(1-np.exp(-t*1900))

def snare():
    t=grid(.18);n=RNG.normal(0,1,len(t));n-=np.convolve(n,np.ones(21)/21,'same')
    env=np.exp(-t*30)+.4*(t>.012)*np.exp(-np.maximum(0,t-.012)*49)
    return (n*.18*env+np.sin(2*np.pi*182*t)*.29*np.exp(-t*32))*(1-np.exp(-t*2200))

def hat(open_=False):
    t=grid(.16 if open_ else .062);n=RNG.normal(0,1,len(t));n=np.r_[0,np.diff(n)]
    return .052*n*np.exp(-t*(25 if open_ else 82))*(1-np.exp(-t*3500))

def bass(n,d=.36):
    t=grid(d);f=note(n)
    env=(1-np.exp(-t*170))*np.exp(-t*6.4)*np.minimum(1,(d-t)/.045)
    x=np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2*t)+.075*np.sin(2*np.pi*f*3*t)
    return np.tanh(x*1.2)*env

def pluck(n,d=.55,decay=8):
    t=grid(d);f=note(n)
    env=(1-np.exp(-t*600))*np.exp(-t*decay)*np.minimum(1,(d-t)/.055)
    x=np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*2.002*t)+.08*np.sin(2*np.pi*f*3*t)
    return x*env

def keys(notes,d=2.0):
    t=grid(d);x=np.zeros_like(t)
    for n in notes:
        f=note(n)
        x+=np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*1.004*t)+.12*np.sin(2*np.pi*f*2*t)
    envelope=(1-np.exp(-t*110))*np.exp(-t*2.5)*np.minimum(1,(d-t)/.22)
    pump=.42+.58*(1-np.exp(-(t%.5)*17))
    return x/len(notes)*envelope*pump

def pad(notes,d=3.8):
    t=grid(d);x=np.zeros_like(t)
    for n in notes:
        f=note(n)
        x+=np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*1.003*t)
    envelope=np.minimum(1,t/.16)*np.minimum(1,np.maximum(0,(d-t)/1.2))
    return x/len(notes)*envelope

def click(kind='cut'):
    d=.065 if kind=='cut' else .10;t=grid(d)
    n=RNG.normal(0,1,len(t));n-=np.convolve(n,np.ones(19)/19,'same')
    f={'cut':1320,'snap':235,'key':860,'place':390}.get(kind,600)
    noise=.14 if kind=='cut' else .075
    return (noise*n*np.exp(-t*115)+.45*np.sin(2*np.pi*f*t)*np.exp(-t*(78 if kind=='cut' else 52)))*(1-np.exp(-t*2600))

def air(d=.48,reverse=False):
    t=grid(d);n=RNG.normal(0,1,len(t));n=np.convolve(n,np.ones(12)/12,'same')
    env=(np.sin(np.pi*t/d)**2) if not reverse else (t/d)**2*np.minimum(1,(d-t)/.035)
    x=n*env*.38;pan=np.linspace(-.38,.38,len(t))
    return np.stack([x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)],axis=1)

# Harmonic identity: Dm9 / Bbmaj7 / Fmaj9 / C6. Restrained instrumental hook.
chords=[[50,57,60,64,69],[46,53,57,62,65],[41,53,57,60,67],[48,55,60,64,69]]
roots=[38,34,41,36]
# Global .5sec beat grid; phrasing changes energy without changing tempo.
for b in range(144):
    at=b*.5
    if 10.5<=at<11.5:continue
    if at<3:energy=.36
    elif at<6:energy=.25
    elif at<10.5:energy=.60
    elif at<12:energy=.25
    elif at<19:energy=.84
    elif at<25:energy=.70
    elif at<35:energy=.83
    elif at<46:energy=1.0
    elif at<55:energy=.78
    elif at<59:energy=.85
    elif at<63:energy=.57
    elif at<69:energy=1.06
    else:energy=.36
    # Four-on-the-floor main pulse, half-time space for intro and file rename.
    if at>=6 and at<69 or b%2==0:
        add(music,kick(),at,.57*energy)
    if b%2==1 and (6<=at<69):
        add(music,snare(),at,.48*energy,.035)
    if at<69:
        add(music,hat(),at+.25,.63*energy,(-.22 if b%2 else .22))
        if at>=12:add(music,hat(b%8==7),at,.25*energy,-.08)
    root=roots[(b//8)%4]
    if at>=6 or b%2==0:add(music,bass(root,.37),at+.125,.28*energy)
    # Offbeat syncopation grows during the main services and final promise.
    if (25<=at<46 or 63<=at<69) and b%2==0:
        add(music,bass(root+12,.21),at+.375,.10*energy,.10)
    if 6<=at<10.5 or 35<=at<43 or 63<=at<68:
        if b%2:add(music,hat(),at+.375,.24*energy,.33)
# Chord punctuations at actual chapter/action beats, with space for typography.
for at in np.arange(0,72,2):
    if 10<=at<12:continue
    ns=chords[(int(at)//4)%4]
    gain=.20 if at<6 else .31 if at<25 else .34 if at<46 else .29 if at<63 else .37 if at<69 else .16
    add(music,keys(ns),float(at),gain,-.13)
# Soft underlying sustained colour, ducked beneath drums.
for at in [0,12,19,25,35,43,46,55,63]:
    add(music,pad(chords[(at//4)%4],3.8),at,.065,.18)
# Sparse original melodic identity; no voice-like formants.
for base in [12,19,25,35,43,46,55,63]:
    melody=[74,77,81,77,72,76,79,76]
    if base==46:melody=[74,77,79,77]
    for i,n in enumerate(melody):
        at=base+.25+i*.5
        if at<69:add(music,pluck(n,.54),at,.065 if base<35 else .08,.23)
# Intro text has quiet, percussive key tones rather than a dense drop.
for at,n in [(0,62),(.5,69),(1,74),(3,65),(5.5,69)]:
    add(music,pluck(n,.8,5),at,.12,-.15)
# Main promise lands on three musically emphasized downbeats.
for at in [12,25,35,46,55,63,65,67]:
    add(music,kick(),at,.16)
    add(music,keys([50,57,60,64],1.8),at,.12,.12)
# A short pickup before the pain montage, a compressed pause and a restrained final resolve.
add(music,air(.5,True),5.5,.38)
add(music,air(.5,True),11.5,.4)
add(music,air(.5,True),34.5,.25)
for at in [67.5,68,68.5]:add(music,hat(),at,.17,.1)
add(music,keys([50,57,60,64,69],2.95),72,.34,-.18)
add(music,pad([38,50,57,60,64],3),72,.17,.12)
add(music,pluck(74,2.85,2.2),72,.11,.24)

cues=[]
def cue(at,event,kind,gain=.3,pan=0):
    at=round(at*FPS)/FPS  # Each effect is placed on its actual deterministic picture frame.
    cues.append({'time':at,'frame':round(at*FPS),'beat':round(at*2,3),'event':event,'sound':kind})
    if kind=='notification':
        n=[79,81,84,86][sum(q['sound']=='notification' for q in cues)%4]
        add(sfx,pluck(n,.32,13),at,gain,pan)
        add(sfx,pluck(n-12,.20,16),at+.07,gain*.22,-pan)
    elif kind in ['cut','snap','key','place']:add(sfx,click(kind),at,gain,pan)
    elif kind=='air':add(sfx,air(),at-.2,gain)
    elif kind=='confirm':
        add(sfx,pluck(79,.65,7),at,gain,-.16);add(sfx,pluck(86,.60,7),at+.12,gain*.68,.16)
    elif kind=='resolve':
        add(sfx,pluck(74,1.1,4),at,gain,-.16);add(sfx,pluck(81,1.05,4),at+.10,gain*.65,.16)
    elif kind=='duplicate':
        add(sfx,click('key'),at,gain,-.20);add(sfx,click('snap'),at+.09,gain*.60,.20)

# All cues below correspond to a specific visible action, not a generic transition.
for at,event in [(0,'author_name'),(.5,'business_plan_title'),(1.25,'course_name')]:cue(at,event,'place',.13)
cue(5.5,'intro_line_opens_message','air',.20)
for i,at in enumerate([6.5,7.5,8.5,9.5]):cue(at,f'client_message_{i+1}','notification',.16+i*.008,(-.22 if i%2 else .22))
cue(11,'messages_compress','air',.32)
cue(12,'message_blocks_snap','snap',.45)
cue(12,'brand_materializes','place',.35)
cue(12.5,'second_final_duplicates','duplicate',.33)
cue(15,'business_positioning','place',.20)
cue(17,'audience','place',.18)
for i,at in enumerate([19,19.85,20.65]):cue(at,f'input_{i+1}','place',.25,(-.18+i*.18))
cue(653/30,'inputs_become_material_blocks','cut',.20)
cue(688/30,'input_blocks_snap_to_rail','snap',.25)
cue(23.2,'ready_to_share','confirm',.20)
cue(25,'quick_edit_start','place',.28)
cue(26,'quick_edit_trim','cut',.40,-.10)
cue(27,'quick_edit_snap','snap',.40,.10)
cue(28,'basic_captions_added','key',.26)
cue(28.75,'single_aspect_ratio_set','snap',.25)
cue(31,'revision_feedback','notification',.15)
cue(32.5,'revision_applied','cut',.28)
cue(33,'revision_complete','confirm',.18)
cue(35,'campaign_start','place',.34)
cue(36,'main_video_plays','snap',.30)
cue(38,'first_cutdown','cut',.39,-.23)
cue(38.5,'second_cutdown','cut',.39,.23)
for i,at in enumerate([41,41.5,42]):cue(at,f'matching_graphic_{i+1}','snap',.27,(-.22+i*.22))
cue(43,'campaign_pack_complete','confirm',.20)
cue(46,'monthly_support_start','place',.31)
cue(47,'monthly_calendar_unfolds','key',.26)
cue(49,'work_queue_receives_tasks','snap',.30)
cue(49.5,'hours_allocation_bar','place',.24)
cue(52,'scheduled_tasks_complete','snap',.27)
cue(52,'monthly_price','confirm',.18)
cue(55,'extra_capacity','place',.32)
cue(56.6,'consistent_content','snap',.28)
cue(59,'process_brief','key',.25)
cue(60,'process_review','notification',.14)
cue(61,'process_revision','cut',.26)
cue(62.5,'process_deliver','confirm',.19)
for at,event in [(63,'on_brief'),(65,'on_brand'),(67,'on_time')]:cue(at,event,'snap',.38)
cue(68.5,'export_progress_completes','confirm',.23)
cue(69,'file_window','key',.27)
for j,at in enumerate([70,70.085,70.17,70.255,70.34,70.425,70.51,70.595,70.68]):
    cue(at,f'rename_keystroke_{j+1}','key',.13,(-.10 if j%2 else .10))
cue(71,'rename_confirmed','snap',.31)
cue(72,'final_brand_resolve','resolve',.22)
# A continuous3s release from the final chord; no extra frames and no cut-off music.
clock=np.arange(SR*DURATION)/SR
release=np.ones_like(clock)
release[clock>=72]=np.cos(np.minimum(1,(clock[clock>=72]-72)/3)*np.pi/2)**1.3
music*=release[:,None];sfx*=release[:,None]
# Subtle saturation reduces crest factor while preserving shared stem summation.
combined=music+sfx
scale=.77/np.max(np.abs(combined));music*=scale;sfx*=scale;combined=music+sfx
shaped=np.tanh(combined*2.7)
shared=np.divide(shaped,combined,out=np.ones_like(combined),where=np.abs(combined)>1e-12)
music*=shared;sfx*=shared;combined=music+sfx

def wav(path,x):
    with wave.open(str(path),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR)
        f.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes())
raw=OUT/'_measure.wav';wav(raw,combined)
measurement=subprocess.run(['ffmpeg','-hide_banner','-i',str(raw),'-af','loudnorm=I=-15.5:TP=-1:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
analysis=json.JSONDecoder().raw_decode(measurement.stderr[measurement.stderr.rfind('{'):])[0]
gain=10**((-15.5-float(analysis['input_i']))/20)
gain=min(gain,10**((-1.3-float(analysis['input_tp']))/20))
music*=gain;sfx*=gain;combined=music+sfx
wav(OUT/'music.wav',music);wav(OUT/'workflow-sfx.wav',sfx);wav(OUT/'score.wav',combined);raw.unlink()
manifest={'title':'Final Final Studio /75-second original instrumental score','bpm':BPM,'beat_seconds':.5,'fps':FPS,'sample_rate':SR,'duration':DURATION,'time_origin':'Film frame0','speech':False,'vocals':False,'original_audio':True,'master':'score.wav','stems':['music.wav','workflow-sfx.wav'],'beat_frames':[i*15 for i in range(150)],'events':cues,'measured_estimate':{'integrated_lufs':round(float(analysis['input_i'])+20*np.log10(gain),2),'true_peak_dbtp':round(float(analysis['input_tp'])+20*np.log10(gain),2)},'notes':['All sound synthesized with NumPy. No third-party samples, speech, AI voices, or vocals.','V5 effects follow the actual deterministic picture frames. Input lettering is retired before the block-contraction cue; individual filename keystrokes intentionally sit between beats.','Master and stems have identical duration and shared normalization; they sum before PCM16 rounding.','The final brand chord starts at72s and decays naturally through the final3-second brand hold.']}
(OUT/'beat-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Created75.000s stereo48k master and two original stems.')
print('Integrated estimate',manifest['measured_estimate']['integrated_lufs'],'LUFS; truepeakestimate',manifest['measured_estimate']['true_peak_dbtp'],'dBTP')
print('Action cues',len(cues),'beatmarkers150; no vocals or speech.')


def validate_written_audio():
    from pathlib import Path
    import wave,json,hashlib,subprocess
    import numpy as np
    R=ROOT;A=R/'assets'
    def read(n):
     p=A/n
     with wave.open(str(p),'rb') as f:
      shape={'sample_rate':f.getframerate(),'channels':f.getnchannels(),'sample_width':f.getsampwidth(),'samples_per_channel':f.getnframes()};x=np.frombuffer(f.readframes(f.getnframes()),dtype='<i2').astype(np.int32).reshape(-1,2)
     assert shape=={'sample_rate':48000,'channels':2,'sample_width':2,'samples_per_channel':3600000},shape
     return x,{'file':n,**shape,'duration_seconds':75,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'sample_peak_dbfs':round(20*np.log10(np.max(np.abs(x))/32768),3)}
    m,rm=read('music.wav');s,rs=read('workflow-sfx.wav');x,rx=read('score.wav')
    err=int(np.max(np.abs(m+s-x)));assert err<=1,err
    r=subprocess.run(['ffmpeg','-hide_banner','-i',str(A/'score.wav'),'-af','loudnorm=I=-15.5:TP=-1:LRA=9:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    measurement=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{'):])[0]
    assert float(measurement['input_tp'])<-1
    assert -17<float(measurement['input_i'])<-14
    last=x[-4800:]/32768;endpeak=float(np.max(np.abs(x[-48:]))/32768)
    assert endpeak<.001
    b=json.loads((A/'beat-map.json').read_text());assert all(e['frame']==round(e['time']*30) for e in b['events']);assert not b['speech'] and not b['vocals']
    report={'passed':True,'scope':'Actual PCM master and stems; original instrumental synthesis only, no speech or vocal assets. Effects retimed to V5 deterministic animation frames.','format':'75.000s stereo 48000Hz PCM16','assets':[rm,rs,rx],'mix_sum_max_quantization_error_lsb':err,'measured_master':{k:measurement[k] for k in ['input_i','input_tp','input_lra','input_thresh']},'tail_last_0_1s_rms_dbfs':round(20*np.log10(np.sqrt(np.mean(last**2))),2),'last_1ms_peak_dbfs':round(20*np.log10(max(endpeak,1e-12)),2),'last_1ms_peak':endpeak,'effect_cues':len(b['events']),'beat_count':len(b['beat_frames']),'no_voiceover':True,'music_composition':'Original 120BPM instrumental composition retained; shared mix normalization regenerated with revised action cues.'}
    (R/'output').mkdir(exist_ok=True);(R/'output/audio-validation.json').write_text(json.dumps(report,indent=2)+'\n');print('Validated PCM master/stems; source-bound report: output/audio-validation.json')

validate_written_audio()
