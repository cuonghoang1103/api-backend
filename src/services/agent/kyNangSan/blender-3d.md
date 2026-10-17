---
name: blender-3d
description: Blender bằng dòng lệnh (không giao diện): chạy script Python `-b -P`, dựng cảnh/vật liệu/đèn/camera, render Cycles/EEVEE ra ảnh/video, xuất glTF/GLB cho web, và KIỂM ảnh render trước khi báo xong.
---

# KỸ NĂNG: BLENDER 3D — script, render, xuất glTF, kiểm bằng mắt

Dùng cho web 3D (three.js / react-three-fiber) đọc thêm kỹ năng `3d-webgl`.

## 0. Luật vàng

1. **Luôn chạy nền không giao diện**: `blender -b … -P script.py` — mở giao diện là treo lượt.
2. **Không ghi đè file `.blend` gốc** của người dùng: mở, sửa, `save_as_mainfile` sang tên mới.
3. Render lâu ⇒ `chay_lenh_nen`, đọc tiến độ; thử trước ở độ phân giải nhỏ + ít mẫu (vài giây) rồi mới render thật.
4. **NHÌN ảnh render** (read_file PNG) trước khi báo xong: đen thui, cháy sáng, camera nhìn sai chỗ, vật thể ngoài khung.

## 1. Tìm Blender & phiên bản

- macOS: `/Applications/Blender.app/Contents/MacOS/Blender` (thường KHÔNG có trong PATH) · cài `brew install --cask blender`.
- Windows: `"C:\Program Files\Blender Foundation\Blender 4.x\blender.exe"` · `winget install -e --id BlenderFoundation.Blender`.
- Linux: `blender` (snap/flatpak/tarball từ blender.org — bản apt thường cũ).
- `blender --version`. API đổi theo phiên bản (mục 6) — viết script theo đúng bản đang có.

## 2. Mẫu script đã chạy thật (Blender 5.1)

```python
# render.py — chạy: blender -b --factory-startup -P render.py -- out/render.png
import bpy, sys, os
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out = os.path.abspath(argv[0] if argv else "render.png")

bpy.ops.wm.read_factory_settings(use_empty=True)          # cảnh trống
bpy.ops.mesh.primitive_monkey_add()
obj = bpy.context.object
mat = bpy.data.materials.new("Do"); mat.use_nodes = True
mat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.8, 0.1, 0.1, 1)
obj.data.materials.append(mat)
bpy.ops.object.camera_add(location=(0, -4, 0), rotation=(1.5708, 0, 0))
bpy.context.scene.camera = bpy.context.object
bpy.ops.object.light_add(type='SUN', location=(2, -2, 3))

s = bpy.context.scene
s.render.engine = 'CYCLES'          # hoặc 'BLENDER_EEVEE' (5.x) — xem mục 6
s.cycles.samples = 64
s.cycles.device = 'CPU'             # GPU: xem mục 3
s.render.resolution_x, s.render.resolution_y = 1280, 720
s.render.filepath = out
bpy.ops.render.render(write_still=True)
bpy.ops.export_scene.gltf(filepath=out.replace('.png', '.glb'), export_format='GLB')
print("RENDER_OK", out)
```
- Tham số cho script đi SAU `--` (Blender không đọc phần đó).
- In một dấu mốc (`RENDER_OK`) rồi `grep` log — Blender thoát mã 0 cả khi script ném lỗi Python (in `Traceback`) nếu
  không có `--python-exit-code 1`. Luôn thêm: `blender -b --python-exit-code 1 -P script.py`.
- File có sẵn: `blender -b scene.blend -P sua.py` · render khung 1: `blender -b scene.blend -o //out/frame_#### -f 1`
  · cả hoạt hình: `-s 1 -e 120 -a` (ra chuỗi PNG ⇒ ghép video bằng ffmpeg, xem kỹ năng `video`).

## 3. Render nhanh & GPU

```python
prefs = bpy.context.preferences.addons['cycles'].preferences
prefs.compute_device_type = 'METAL'      # macOS Apple Silicon; NVIDIA: 'OPTIX' hoặc 'CUDA'; AMD: 'HIP'
prefs.get_devices()
for d in prefs.devices: d.use = True
bpy.context.scene.cycles.device = 'GPU'
bpy.context.scene.cycles.use_denoising = True      # ít mẫu + khử nhiễu ⇒ nhanh, sạch
```
Thử nghiệm: 320×180, `samples=16`. Bản thật mới tăng. EEVEE nhanh hơn nhiều cho xem trước/hoạt hình đơn giản.

## 4. Xuất cho web (glTF/GLB)

```python
bpy.ops.export_scene.gltf(filepath="out/model.glb", export_format='GLB',
                          export_apply=True,          # áp modifier
                          export_draco_mesh_compression_enable=True)   # nhỏ hơn nhiều; trình xem cần DRACOLoader
```
- Áp tỉ lệ/xoay trước khi xuất (`bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)`).
- Vật liệu node phức tạp KHÔNG sang glTF — chỉ Principled BSDF + ảnh texture. Bake texture nếu cần.
- Kiểm: kích thước file, mở bằng trình xem (gltf-viewer / three.js editor qua `web_mo`) và NHÌN.
- Nhập: `bpy.ops.import_scene.gltf(filepath=...)`, `bpy.ops.wm.obj_import(filepath=...)` (4.x+), FBX `import_scene.fbx`.

## 5. Kiểm sau render

- Đọc log: `grep -E "RENDER_OK|Error|Traceback" blender.log`.
- Ảnh có thật và không rỗng: kích thước file > vài KB; NHÌN ảnh. Đen ⇒ thiếu đèn/camera sai hướng; trắng ⇒ đèn quá mạnh
  (Sun strength 3–5, Point hàng trăm–nghìn W tuỳ khoảng cách).
- So số khung khi render hoạt hình: `ls out/frame_* | wc -l`.

## 6. Khác biệt phiên bản (bẫy chính)

- Tên engine EEVEE: 4.2–4.x là `'BLENDER_EEVEE_NEXT'`; 5.x quay lại `'BLENDER_EEVEE'` (đã đo trên 5.1). Viết an toàn:
  `ids = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties['engine'].enum_items]` rồi chọn cái có `EEVEE`.
- OBJ: `bpy.ops.export_scene.obj` (cũ) đã bỏ ⇒ `bpy.ops.wm.obj_export`.
- Script viết cho bản cũ hay hỏng ở tên input node (`"Specular"` → `"Specular IOR Level"`, `"Emission"` →
  `"Emission Color"` từ 4.0) — lỗi `KeyError` ⇒ in `[i.name for i in node.inputs]` để xem tên thật.

## 7. Báo cáo cuối

Phiên bản Blender, lệnh đã chạy, file ra (ảnh/GLB + dung lượng), thời gian render, ảnh đã kiểm, và tham số để người
dùng chỉnh (độ phân giải, số mẫu, góc camera).
