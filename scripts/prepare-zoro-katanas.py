"""Blender: browser derivatives of the three authored models; masters stay untouched.
blender -b --factory-startup --python scripts/prepare-zoro-katanas.py -- ../zoro-katanas/models
"""
import bpy, json, sys, hashlib, math
from pathlib import Path
from mathutils import Matrix, Vector

BASE=Path(__file__).resolve().parents[1]
SOURCE=Path(sys.argv[sys.argv.index('--')+1]).resolve()
OUT=BASE/'public'/'katanas';OUT.mkdir(exist_ok=True)
report=[]
for kind,title in [('wado','Wado_Ichimonji'),('sandai','Sandai_Kitetsu'),('enma','Enma')]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    source=SOURCE/(kind+'.glb')
    bpy.ops.import_scene.gltf(filepath=str(source))
    sc=bpy.context.scene;sc.frame_set(1)
    sword=bpy.data.objects[title+'.Sword_CTRL'];saya=bpy.data.objects[title+'.Saya_CTRL']
    source_root=bpy.data.objects[title+'.ROOT']
    radius=float(source_root['curvature_radius_m'])
    # Native Blender import is +X length, +Y curvature. Browser uses +Y length,
    # +X curvature, +Z thickness. Output conversion from Blender to glTF is included.
    scale=4.9/1.102
    transform=Matrix(((0,scale,0,0),(0,0,scale,0),(scale,0,0,-.10),(0,0,0,1)))
    roots={}
    for label in ('Katana','Saya'):
        root=bpy.data.objects.new(label,None);sc.collection.objects.link(root);roots[label]=root
    meshes=[o for o in sc.objects if o.type=='MESH']
    total=0
    for ob in meshes:ob.data.calc_loop_triangles();total+=len(ob.data.loop_triangles)
    ratio=min(1,115000/total)
    for ob in meshes:
        parent=ob.parent
        while parent and parent not in (sword,saya):parent=parent.parent
        label='Katana' if parent==sword else 'Saya'
        matrix=ob.matrix_world.copy()
        ob.animation_data_clear();ob.parent=None;ob.matrix_world=Matrix.Identity(4)
        ob.data.transform(transform@matrix)
        ob.parent=roots[label]
        # Imported glTF splits the blade's vertices at sharp normals / UV seams.
        # Decimation treats those strips as separate surfaces and deletes faces.
        # Keep its modest 4,108 triangles intact to preserve the closed steel shell.
        if not ob.name.endswith('.Blade') and len(ob.data.polygons)>1600:
            bpy.context.view_layer.objects.active=ob
            mod=ob.modifiers.new('Browser mesh reduction','DECIMATE');mod.ratio=ratio
            bpy.ops.object.modifier_apply(modifier=mod.name)
    for ob in list(sc.objects):
        if ob not in meshes and ob not in roots.values():bpy.data.objects.remove(ob,do_unlink=True)
    for image in bpy.data.images:
        if image.source!='FILE':continue
        w,h=image.size
        limit=2048 if 'steel_basecolor' in image.name else 1024
        factor=min(1,limit/max(w,h))
        if factor<1:image.scale(max(1,round(w*factor)),max(1,round(h*factor)))
    # Carry physical sheen intensity into the glTF color (Blender exporter only
    # checks Sheen Weight as an enable flag). Original masters are not changed.
    for material in bpy.data.materials:
        if not material.use_nodes:continue
        bs=next((n for n in material.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if bs and 'woven tsuka-ito fabric' in material.name:
            bs.inputs['Sheen Weight'].default_value=1
            bs.inputs['Sheen Tint'].default_value=(.22,.22,.22,1)
    sc.unit_settings.system='METRIC'
    bpy.ops.object.select_all(action='SELECT')
    output=OUT/(kind+'.glb')
    bpy.ops.export_scene.gltf(filepath=str(output),export_format='GLB',use_selection=True,use_active_scene=True,export_animations=False,export_extras=True,export_apply=True,export_image_format='JPEG',export_jpeg_quality=90,export_yup=True)
    triangles=0
    for ob in meshes:ob.data.calc_loop_triangles();triangles+=len(ob.data.loop_triangles)
    report.append(dict(id=kind,source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),bytes=output.stat().st_size,triangles=triangles,scale=scale,withdrawal=dict(radius=radius*scale,centerY=-.10,angle=.83/radius)))
    print('PREPARED',report[-1],flush=True)
(OUT/'manifest.json').write_text(json.dumps(report,indent=2),encoding='utf8')
