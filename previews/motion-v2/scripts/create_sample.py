"""Original unbranded CGI motion test. Run: blender -b -t 4 -P create_sample.py -- --benchmark
Full render: blender -b -t 4 -P create_sample.py
No client footage or client logos. 8 seconds, 30 fps; authored moving camera + object.
"""
from pathlib import Path
import math, sys, subprocess, time
import bpy
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets'/'sample-motion.mp4'
FRAMES=240
TMP=Path('/tmp/final-final-cgi'); TMP.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='BLENDER_WORKBENCH'
scene.display.shading.light='STUDIO'
scene.display.shading.studiolight_rotate_z=.3
scene.display.shading.color_type='MATERIAL'
scene.display.shading.show_shadows=True
scene.display.shading.show_cavity=True
scene.display.shading.cavity_type='BOTH'
scene.display.shading.show_specular_highlight=True
scene.display.shading.background_type='WORLD'
scene.display.render_aa='8'
scene.world.color=(.015,.015,.015)
scene.cycles.device='CPU';scene.cycles.samples=12
scene.cycles.use_denoising=False
scene.cycles.use_light_tree=True
scene.render.resolution_x=960;scene.render.resolution_y=540;scene.render.resolution_percentage=100
scene.render.fps=30;scene.frame_start=1;scene.frame_end=FRAMES
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB'
scene.render.threads_mode='FIXED';scene.render.threads=4
scene.world.color=(.07,.07,.07)
scene.view_settings.view_transform='Standard'
scene.view_settings.look='None'
scene.render.film_transparent=False

def mat(n,color,metal=0,rough=.4):
 m=bpy.data.materials.new(n);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 return m
black=mat('Charcoal ceramic',(0.018,.019,.016),.2,.28)
white=mat('Warm brushed aluminium',(.78,.8,.72),.74,.22)
lime=mat('Lime ink',(.56,1,.001),.1,.28)
floor=mat('Charcoal stage',(.028,.03,.026),.1,.33)
soft=mat('Fine seam',(.23,.24,.21),.8,.26)
parent=bpy.data.objects.new('Rotating original CGI can',None);scene.collection.objects.link(parent)

def cyl(n,r,d,z,m,bevel=.02):
 bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=r,depth=d,location=(0,0,z))
 ob=bpy.context.object;ob.name=n;ob.data.materials.append(m)
 for p in ob.data.polygons:p.use_smooth=True
 if bevel:
  mod=ob.modifiers.new('Machined edge','BEVEL');mod.width=bevel;mod.segments=3
  mod=ob.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 ob.parent=parent;return ob

def torus(n,r,minor,z,m):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=minor,major_segments=80,minor_segments=10,location=(0,0,z))
 ob=bpy.context.object;ob.name=n;ob.data.materials.append(m);ob.parent=parent
 for p in ob.data.polygons:p.use_smooth=True
 return ob
cyl('Can body',.61,2.36,1.5,white,.075)
cyl('Charcoal wrap',.616,1.72,1.49,black,.01)
cyl('Lime bottom band',.619,.08,.67,lime,.006)
cyl('Lime upper band',.619,.035,2.31,lime,.005)
cyl('Inset lid',.56,.035,2.704,white,.012)
torus('Top rolled rim',.566,.027,2.713,soft)
torus('Bottom rolled rim',.559,.025,.31,soft)
# A real pull tab and inset opening make the changing camera angle easy to perceive.
bpy.ops.mesh.primitive_torus_add(major_radius=.125,minor_radius=.035,major_segments=40,minor_segments=10,location=(0,-.09,2.735))
tab=bpy.context.object;tab.name='Silver pull tab';tab.scale=(.7,1.45,.3);tab.data.materials.append(soft);tab.parent=parent
# Intentional abstract registration stripes, no fictional client logo or copy.
for i in range(3):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(-.14+i*.14,-.616,1.57))
 ob=bpy.context.object;ob.name='Lime geometric sleeve stripe';ob.scale=(.055,.009,.53-i*.105);ob.data.materials.append(lime);ob.parent=parent
 bevel=ob.modifiers.new('Soft ink edge','BEVEL');bevel.width=.012;bevel.segments=2
# Fine silver registration detail on the reverse provides texture as it turns.
for i in range(7):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(.62,0,1.23+i*.064))
 ob=bpy.context.object;ob.name='Reverse silver registration';ob.scale=(.009,.17,.018);ob.data.materials.append(white);ob.parent=parent
# Ground: moving reflections and diagonal marks reveal that the shot is live motion.
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,0));bpy.context.object.name='Infinite charcoal stage';bpy.context.object.data.materials.append(floor)
for x in [-4,-2,2,4]:
 bpy.ops.mesh.primitive_cube_add(size=1,location=(x,1,.004));ob=bpy.context.object;ob.name='Stage registration line';ob.scale=(.025,5,.003);ob.rotation_euler[2]=.35;ob.data.materials.append(lime)
# Low bevel plinth adds a clean contact shadow.
bpy.ops.mesh.primitive_cylinder_add(vertices=96,radius=1.27,depth=.12,location=(0,0,.08));ob=bpy.context.object;ob.name='Low podium';ob.data.materials.append(black)
bevel=ob.modifiers.new('Podium bevel','BEVEL');bevel.width=.06;bevel.segments=3
for p in ob.data.polygons:p.use_smooth=True
# Elliptical orbit graphic behind the can, static world-space object reveals camera parallax.
bpy.ops.mesh.primitive_torus_add(major_radius=1.72,minor_radius=.018,major_segments=100,minor_segments=8,location=(0,.65,1.65),rotation=(math.radians(70),0,math.radians(-18)))
ob=bpy.context.object;ob.name='Lime orbit';ob.data.materials.append(lime)

def area(name,loc,energy,color,size,target=(0,0,1.3)):
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=energy;o.data.color=color;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Large softbox',(-3,-4,6),700,(1,.98,.90),4)
area('White edge',(3,1,4.5),900,(.93,1,1),3)
area('Lime rim',(-2,3,2),550,(.63,1,.05),2)
area('Front strip',(0,-6,2.5),160,(1,1,1),2)
bpy.ops.object.camera_add();cam=bpy.context.object;scene.camera=cam;cam.data.lens=56
cam.data.dof.use_dof=False

def set_frame(f):
 t=(f-1)/30
 # Mostly front-on throughout so the subject stays safe inside a portrait crop.
 angle=math.radians(-7+14*math.sin(t*.43))
 dist=8.35-.38*math.sin(t*.39)
 cam.location=(math.sin(angle)*dist,-math.cos(angle)*dist,3.55+.12*math.cos(t*.37))
 target=Vector((0,0,1.46+.025*math.sin(t*.6)))
 cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
 parent.rotation_euler=(.035*math.sin(t*.9),.06*math.sin(t*.65),-.25+t*.38)
 parent.location=(0,0,.04+.025*math.sin(t*.85))
 scene.frame_set(f)

if '--benchmark' in sys.argv:
 for f in [28]:
  set_frame(f);scene.render.filepath=str(TMP/'benchmark.png');before=time.monotonic();bpy.ops.render.render(write_still=True);print('BENCHMARK_SECONDS',time.monotonic()-before,flush=True)
else:
 before=time.monotonic()
 start=int(sys.argv[sys.argv.index('--start-frame')+1]) if '--start-frame' in sys.argv else 1
 for f in range(start,FRAMES+1):
  set_frame(f);scene.render.filepath=str(TMP/f'{f:04d}.png');bpy.ops.render.render(write_still=True)
  if f%30==0:print('PROGRESS',f,FRAMES,'SECONDS',time.monotonic()-before,flush=True)
 OUT.parent.mkdir(parents=True,exist_ok=True)
 subprocess.run(['ffmpeg','-y','-v','error','-framerate','30','-i',str(TMP/'%04d.png'),'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT)],check=True)
 print('COMPLETED',OUT,'SECONDS',time.monotonic()-before,flush=True)
