"""
Dựng chữ 3D "CUONG THAI" thay cho "BRUNO SIMON".

Vì sao phải dựng lại thay vì sửa chữ có sẵn: chữ gốc là LƯỚI đã convert từ phông
Neue Montreal Bold — phông thương mại nằm ở ~/Library/Fonts của máy tác giả, KHÔNG
có trong kho và KHÔNG nhúng trong .blend. Nên dựng lại bằng Pally-Bold.ttf, phông
đã nằm sẵn trong static/fonts/ của chính kho này (MIT) và app đang dùng cho UI.

Số đo lấy THẲNG từ file gốc, không đoán:
  - Text.003 (FONT, body='BRUNO SIMON'): size 2.5, align LEFT/TOP_BASELINE,
    rotation X = pi/2, modifier Solidify (độ dày KHÔNG đến từ extrude).
  - Chữ mẫu .019: material 'palette', custom prop mass = 0.2, parent 'landing',
    rotation Z = 0.4363, bề dày theo Y = 0.46.
  - 10 chữ trải từ (38.383, -44.246) tới (49.701, -38.969) => nghiêng
    atan(5.277/11.318) = 0.4363 rad = 25.0 độ. Khớp rotation Z của chữ.

Xuất RIÊNG ra một .glb nhỏ. KHÔNG xuất đè areas.glb — file blend có 120
collection và không ai biết thiết lập xuất gốc; xuất đè mà đoán sai là hỏng cả
737 nút của thế giới.
"""
import bpy
import math
import os
import sys

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
FONT_PATH = ARGS[0]
OUT_PATH = ARGS[1]
TEXT = "CUONG THAI"

# ── Số đo lấy từ file gốc ────────────────────────────────────────────────
SIZE = 2.5
SOLIDIFY_THICKNESS = 0.46      # bề dày theo Y của chữ gốc
ANGLE_Z = 0.4363               # 25 độ, hướng của hàng chữ
FIRST_LETTER_LOC = (38.3828, -44.2462, 0.7455)   # vị trí chữ đầu (B) của bản gốc
MASS = 0.20000000298023424     # custom prop của chữ gốc

print("\n===== DỰNG CHỮ: %r =====" % TEXT)

# ── Dọn sạch scene, chỉ giữ thứ mình dựng ────────────────────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)

# ── Nạp phông ────────────────────────────────────────────────────────────
font = bpy.data.fonts.load(FONT_PATH)
print("Đã nạp phông:", font.name)

# ── Tạo đối tượng chữ ────────────────────────────────────────────────────
curve = bpy.data.curves.new(type="FONT", name="titleText")
curve.body = TEXT
curve.font = font
curve.size = SIZE
curve.align_x = 'LEFT'
curve.align_y = 'TOP_BASELINE'

text_obj = bpy.data.objects.new("titleText", curve)
bpy.context.scene.collection.objects.link(text_obj)

# Dựng đứng chữ lên (mặt phẳng XZ) đúng như Text.003 gốc
text_obj.rotation_euler = (math.pi / 2, 0.0, 0.0)

# Độ dày: bản gốc dùng modifier Solidify chứ không dùng extrude
solid = text_obj.modifiers.new(name="Solidify", type='SOLIDIFY')
solid.offset = 0.0
solid.thickness = SOLIDIFY_THICKNESS

# ── Convert sang lưới (áp dụng cả modifier) ──────────────────────────────
bpy.context.view_layer.objects.active = text_obj
text_obj.select_set(True)
bpy.ops.object.convert(target='MESH')
mesh_obj = bpy.context.view_layer.objects.active

# NƯỚNG phép xoay dựng đứng vào chính lưới.
# Bắt buộc: chữ gốc có rotation_euler = (0, 0, 0.4363) mà bề dày 0.46 nằm ở trục Y
# => lưới của họ ĐÃ đứng sẵn, phép xoay X=90° đã được apply. Nếu bỏ bước này thì
# lát nữa gán rotation_euler = (0,0,angle) sẽ XOÁ mất phép xoay dựng đứng và chữ
# nằm sấp xuống đất (bề dày rơi về trục Z — đã dẫm đúng lỗi này một lần).
bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
print("Sau convert+apply: verts=%d polys=%d dim=%s" % (
    len(mesh_obj.data.vertices), len(mesh_obj.data.polygons),
    tuple(round(v, 3) for v in mesh_obj.dimensions)))

# ── Tách rời từng chữ cái ────────────────────────────────────────────────
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.separate(type='LOOSE')
bpy.ops.object.mode_set(mode='OBJECT')

parts = [o for o in bpy.context.scene.objects if o.type == 'MESH']
print("Tách được %d mảnh (mong đợi %d chữ cái)" % (parts, len(TEXT.replace(" ", ""))) if False
      else "Tách được %d mảnh (mong đợi %d chữ cái)" % (len(parts), len(TEXT.replace(" ", ""))))

# ── Đặt gốc toạ độ mỗi mảnh về tâm khối, rồi sắp theo trục X ─────────────
for o in parts:
    o.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME', center='MEDIAN')

# Sắp trái sang phải theo X của tâm
parts.sort(key=lambda o: o.matrix_world.translation.x)

letters = TEXT.replace(" ", "")
if len(parts) != len(letters):
    print("!! CẢNH BÁO: số mảnh (%d) khác số chữ cái (%d)." % (len(parts), len(letters)))
    print("   Chữ có lỗ (A, O) hoặc dấu có thể tách thành nhiều mảnh — cần xem lại.")

# ── Xếp lại thành hàng nghiêng 25 độ, bắt đầu ở vị trí chữ đầu bản gốc ───
# Giữ nguyên khoảng cách tương đối mà bố cục phông sinh ra, chỉ xoay cả hàng.
base_x = parts[0].matrix_world.translation.x
cos_a, sin_a = math.cos(ANGLE_Z), math.sin(ANGLE_Z)

info = []
for i, o in enumerate(parts):
    # khoảng cách dọc hàng chữ, tính từ chữ đầu
    d = o.matrix_world.translation.x - base_x

    o.rotation_euler = (0.0, 0.0, ANGLE_Z)
    o.location = (
        FIRST_LETTER_LOC[0] + d * cos_a,
        FIRST_LETTER_LOC[1] + d * sin_a,
        FIRST_LETTER_LOC[2],
    )
    # Bản gốc đánh số .010 (phải nhất) -> .019 (trái nhất), tức NGƯỢC thứ tự đọc.
    idx = 10 + (len(parts) - 1 - i)
    o.name = "refLettersPhysicalDynamic.%03d" % idx
    o["mass"] = MASS
    info.append((o.name, letters[i] if i < len(letters) else '?',
                 tuple(round(v, 3) for v in o.location),
                 tuple(round(v, 3) for v in o.dimensions),
                 len(o.data.vertices)))

print("\n--- Kết quả ---")
for name, ch, loc, dim, nv in info:
    print("  %-32s '%s'  loc=%s dim=%s verts=%d" % (name, ch, loc, dim, nv))

# ── Xuất ─────────────────────────────────────────────────────────────────
for o in bpy.context.scene.objects:
    o.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=OUT_PATH,
    export_format='GLB',
    use_selection=True,
    export_apply=True,
    export_yup=True,
)
print("\nĐã xuất:", OUT_PATH, "(%d bytes)" % os.path.getsize(OUT_PATH))
print("===== XONG =====\n")
