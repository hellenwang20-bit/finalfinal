#!/usr/bin/env python3
"""Original 15-second 120 BPM motion-study score and separate workflow effects.
No samples or speech. NumPy synthesis; FFmpeg loudness normalization.
All event times are in assets/beat-map.json. Re-run from any working directory.
"""
from pathlib import Path
import json, subprocess, tempfile, wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'
OUT.mkdir(parents=True,exist_ok=True)
SR=48000; DURATION=15; BPM=120; FPS=30
rng=np.random.default_rng(27102026)
music=np.zeros((SR*DURATION,2),dtype=np.float64)
sfx=np.zeros_like(music)
def grid(d): return np.arange(round(d*SR))/SR
def add(dest,x,at,gain=1,pan=0):
    start=round(at*SR)
    if start<0:return
    n=min(len(x),len(dest)-start)
    if n<=0:return
    x=x[:n]*gain
    if x.ndim==1:x=np.stack([x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)],axis=1)
    dest[start:start+n]+=x

def note(n):return 440*2**((n-69)/12)
def kick():
    t=grid(.4); f=46+102*np.exp(-t*38)
    phase=np.cumsum(f)*2*np.pi/SR
    x=(np.sin(phase)*np.exp(-t*13.5)+rng.normal(0,1,len(t))*.055*np.exp(-t*500))
    return np.tanh(x*1.7)*(1-np.exp(-t*1700))
def clap():
    t=grid(.17);n=rng.normal(0,1,len(t));n=n-np.convolve(n,np.ones(13)/13,'same')
    env=np.exp(-t*35)+(t>.013)*np.exp(-np.maximum(0,t-.013)*55)*.5
    return (n*.23*env+np.sin(2*np.pi*185*t)*np.exp(-t*31)*.3)*(1-np.exp(-t*1800))
def hat(open_=False):
    t=grid(.16 if open_ else .055);n=rng.normal(0,1,len(t));n=n-np.r_[n[0],n[:-1]]
    return n*.07*np.exp(-t*(30 if open_ else 90))*(1-np.exp(-t*3500))
def bass(n,d=.34):
    t=grid(d);f=note(n)
    env=(1-np.exp(-t*180))*np.exp(-t*7)*np.minimum(1,(d-t)/.035)
    return (np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*2*f*t)+.07*np.sin(2*np.pi*3*f*t))*env

def bell(n,d=.35):
    t=grid(d);f=note(n);env=(1-np.exp(-t*1200))*np.exp(-t*14)*np.minimum(1,(d-t)/.04)
    return (np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2.004*t)+.08*np.sin(2*np.pi*f*3*t))*env

def chord(notes,d=1.7):
    t=grid(d);x=np.zeros_like(t)
    for n in notes:
        f=note(n);x+=np.sin(2*np.pi*f*t)+.17*np.sin(2*np.pi*f*2*t)+.16*np.sin(2*np.pi*f*1.004*t)
    env=(1-np.exp(-t*100))*np.exp(-t*2.7)*np.minimum(1,(d-t)/.2)
    # Transient clarity: gentle quarter-note breathing.
    sidechain=.35+.65*(1-np.exp(-(t%.5)*15))
    return x/len(notes)*env*sidechain

def click(kind='cut'):
    d=.065 if kind=='cut' else .11;t=grid(d)
    n=rng.normal(0,1,len(t));n-=np.convolve(n,np.ones(19)/19,'same')
    f=1450 if kind=='cut' else 330
    return (.13*n*np.exp(-t*110)+.5*np.sin(2*np.pi*f*t)*np.exp(-t*70))*(1-np.exp(-t*2500))

def swoosh(d=.48):
    t=grid(d);n=rng.normal(0,1,len(t));smooth=np.convolve(n,np.ones(9)/9,'same')
    env=np.sin(np.pi*t/d)**2
    x=smooth*env*.45
    pan=np.linspace(-.55,.55,len(t))
    return np.stack([x*np.sqrt((1-pan)/2),x*np.sqrt((1+pan)/2)],axis=1)

# One consistent electronic-house motif; same clock as the 30 fps animation.
for b in range(30):
    at=b*.5
    energy=.44 if at<3 else .74 if at<6 else 1.0 if at<12 else .75
    add(music,kick(),at,.64*energy)
    if b%2:add(music,clap(),at,.52*energy,.04)
    add(music,hat(),at+.25,.75*energy,(-.22 if b%2 else .22))
    if at>=3:
        add(music,hat(b%4==3),at,.35*energy,-.1)
    root=[38,38,41,36][(b//4)%4]
    add(music,bass(root),at+.125,.28*energy)
    if at>=6 and b%2==0:
        add(music,bass(root+12,.2),at+.375,.12*energy,.08)
for at,ns in [(0,[50,57,60]),(2,[50,57,64]),(4,[53,57,60]),(6,[50,57,64]),(8,[48,55,60]),(10,[53,57,60]),(12,[50,57,64])]:
    add(music,chord(ns),at,.25 if at<3 else .4,-.17)
# Restrained melodic hook, with space for the interface accents.
for at,n in [(6.25,74),(6.75,77),(7.25,81),(7.75,77),(8.25,72),(8.75,76),(9.25,79),(9.75,76),(10.25,77),(10.75,81),(11.25,84),(11.75,81),(12.25,74),(13.25,77),(14.25,74)]:
    add(music,bell(n,.48),at,.095,.26)

cues=[]
def cue(at,event,kind,gain=.35,pan=0,visual=None):
    cues.append({'time':at,'frame':round(at*FPS),'beat':round(at*BPM/60,3),'event':event,'sound':kind,'visual':visual or event})
    if kind=='notification':
        idx=round(at*2);n=[79,81,84,86,88,91][idx%6]
        add(sfx,bell(n,.31),at,gain,pan)
        add(sfx,bell(n-12,.2),at+.065,gain*.25,-pan)
    elif kind=='cut':add(sfx,click('cut'),at,gain,pan)
    elif kind=='snap':add(sfx,click('snap'),at,gain,pan)
    elif kind=='whoosh':add(sfx,swoosh(),at-.24,gain)
    elif kind=='confirm':
        add(sfx,bell(79,.55),at,gain,-.15);add(sfx,bell(86,.55),at+.12,gain*.75,.15)
    else:add(sfx,bell(74,.4),at,gain,pan)
for i,at in enumerate([0,.5,1,1.5,2,2.5]):cue(at,f'message_{i+1}','notification',.17+i*.009,(-.22 if i%2 else .22))
cue(3,'cards_compress','whoosh',.65)
cue(3.5,'timeline_materialize','snap',.65)
cue(4,'timeline_cut','cut',.75)
cue(4.5,'timeline_trim','cut',.58,-.12)
cue(5,'timeline_snap','snap',.72,.12)
cue(5.5,'caption_track','snap',.48)
cue(6,'clip_to_fullscreen','whoosh',.8)
cue(7,'comparison_wipe_start','cut',.35)
cue(8.5,'comparison_wipe_finish','snap',.4)
cue(9,'graded_result','snap',.6)
cue(9.5,'shrink_to_vertical','whoosh',.55)
cue(10.5,'vertical_frame_settle','snap',.55)
cue(11,'landscape_fanout','snap',.55,-.25)
cue(11.5,'square_fanout','snap',.55,.25)
cue(12,'campaign_ready','confirm',.28)
cue(13,'tagline_beat_1','snap',.38,-.1)
cue(14,'tagline_beat_2','snap',.38,.1)
# No abrupt transient at final frame. Tail only, not an extra output duration.
fade=np.minimum(1,np.maximum(0,(DURATION-np.arange(len(music))/SR)/.32))
music*=fade[:,None];sfx*=fade[:,None]
combined=music+sfx
peak=np.max(np.abs(combined));scale=.78/peak
music*=scale;sfx*=scale;combined*=scale
# Gentle common soft saturation controls drum crest factor without limiting SFX separately.
shaped=np.tanh(combined*2.4)
shared=np.divide(shaped,combined,out=np.ones_like(combined),where=np.abs(combined)>1e-12)
music*=shared;sfx*=shared;combined=music+sfx

def wav(path,arr):
    with wave.open(str(path),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
        w.writeframes((np.clip(arr,-1,1)*32767).astype('<i2').tobytes())
# The same normalization gain is applied to both stems so they sum to the master.
raw=OUT/'_preview-raw.wav';wav(raw,combined)
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(raw),'-af','loudnorm=I=-15:TP=-1:LRA=8:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
analysis=json.JSONDecoder().raw_decode(measure.stderr[measure.stderr.rfind('{'):])[0]
gain=10**((-15-float(analysis['input_i']))/20)
# True-peak safety remains conservative for the combined stems.
gain=min(gain,10**((-1.2-float(analysis['input_tp']))/20))
music*=gain;sfx*=gain;combined=music+sfx
wav(OUT/'music.wav',music);wav(OUT/'workflow-sfx.wav',sfx);wav(OUT/'preview-score.wav',combined);raw.unlink()
manifest={'bpm':BPM,'beat_seconds':.5,'fps':FPS,'sample_rate':SR,'duration':DURATION,'time_origin':'Preview frame0','original_audio':True,'speech':False,'master':'preview-score.wav','stems':['music.wav','workflow-sfx.wav'],'beat_frames':[i*15 for i in range(30)],'events':cues,'notes':['All sound generated with NumPy; no external music or sound-effect samples.','Cue times are exact; picture animation should use these same frame markers.','Master and stems have identical duration and gain; stems sum to the master before PCM rounding.']}
(OUT/'beat-map.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print('Created15.000s48k stereo original score + two editable stems.')
print('Master peak dBFS:',20*np.log10(np.max(np.abs(combined))))
print('Estimated integrated loudness:',float(analysis['input_i'])+20*np.log10(gain),'LUFS')
