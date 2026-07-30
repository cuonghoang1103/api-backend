"""
Dựng chữ 3D "FPT UNIVERSITY" đặt trước toà Alpha của khu Đại học FPT.

Chạy:
  /Applications/Blender.app/Contents/MacOS/Blender -b -P tools/make-fptu-sign.py -- \
      static/fonts/Pally-Bold.ttf static/fptu/sign.glb

Vì sao lại là Blender chứ không ghép hộp trong mã: chữ ghép từ hộp ra nét vuông
vức kiểu 8-bit, đứng cạnh toà Alpha bo tròn sẽ lạc. Phông Pally-Bold.ttf đã nằm
sẵn trong kho này (giấy phép mở, app đang dùng cho UI) nên không phải xin gì thêm.
⚠️ KHÔNG dùng Neue Montreal Bold của bản gốc — phông thương mại, không có trong kho.

Khác với `make-letters.py` (chữ CUONG THAI): ở đó phải TÁCH RỜI từng chữ cái để
mỗi chữ là một vật thể đổ được. Ở đây chữ là biển hiệu đứng yên nên GIỮ NGUYÊN
MỘT KHỐI — ít vật thể, ít thân vật lý, và không bao giờ bị xe húc đổ mất chữ.

Xuất ra .glb RIÊNG rồi nạp lười lúc chạy (giống cách `LandingArea.js` nạp
`title/letters.glb`). KHÔNG đụng `areas.glb`: ghép thẳng vào đó từng làm cả thế
giới kẹt ở màn hình tải mà không ném lỗi nào.
"""
import bpy
import math
import sys

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
FONT_PATH = ARGS[0]
OUT_PATH = ARGS[1]

TEXT = "FPT UNIVERSITY"

# Chiều cao chữ. Toà Alpha cao 8,75 và quảng trường trước nó rộng 15 đơn vị;
# size 2.2 cho hàng chữ dài khoảng 20 — vừa bằng bề ngang khu quảng trường.
SIZE = 2.2
THICKNESS = 0.55   # bề dày, đủ dày để nhìn nghiêng vẫn ra khối chữ

print("\n===== DỰNG BIỂN CHỮ: %r =====" % TEXT)

bpy.ops.wm.read_factory_settings(use_empty=True)

font = bpy.data.fonts.load(FONT_PATH)
print("Đã nạp phông:", font.name)

curve = bpy.data.curves.new(type="FONT", name="fptuSign")
curve.body = TEXT
curve.font = font
curve.size = SIZE
curve.align_x = 'CENTER'      # canh giữa để lát nữa đặt vào giữa quảng trường là xong
curve.align_y = 'BOTTOM_BASELINE'

text_obj = bpy.data.objects.new("fptuSign", curve)
bpy.context.scene.collection.objects.link(text_obj)

# Dựng đứng chữ lên mặt phẳng XZ (mặc định chữ nằm sấp trên mặt phẳng XY)
text_obj.rotation_euler = (math.pi / 2, 0.0, 0.0)

solid = text_obj.modifiers.new(name="Solidify", type='SOLIDIFY')
solid.offset = 0.0
solid.thickness = THICKNESS

bpy.context.view_layer.objects.active = text_obj
text_obj.select_set(True)
bpy.ops.object.convert(target='MESH')
mesh_obj = bpy.context.view_layer.objects.active

# NƯỚNG phép xoay dựng đứng vào lưới. Bỏ bước này thì lúc gán rotation trong
# game, phép xoay 90° biến mất và chữ nằm sấp xuống đất — đúng lỗi đã dẫm ở
# make-letters.py, chép lại nguyên xi cái bẫy đó thì phí.
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)

dim = tuple(round(v, 3) for v in mesh_obj.dimensions)
print("Lưới: verts=%d polys=%d kích thước=%s" % (
    len(mesh_obj.data.vertices), len(mesh_obj.data.polygons), dim))

# Hạ chân chữ về đúng y = 0 để trong game chỉ việc đặt lên mặt đất
bbox_min_z = min((mesh_obj.matrix_world @ v.co).z for v in mesh_obj.data.vertices)
mesh_obj.location.z -= bbox_min_z
bpy.ops.object.transform_apply(location=True, rotation=False, scale=False)

bpy.ops.export_scene.gltf(
    filepath=OUT_PATH,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
)

print("Đã xuất:", OUT_PATH)
print("Bề ngang hàng chữ: %.2f đơn vị · cao %.2f · dày %.2f" % (dim[0], dim[2], dim[1]))
