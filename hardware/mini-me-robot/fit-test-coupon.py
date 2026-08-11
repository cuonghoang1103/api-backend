"""
============================================================
Miếng thử khớp — in TRƯỚC khi in vỏ robot
============================================================

    /Applications/Blender.app/Contents/MacOS/Blender --background \
      --python hardware/mini-me-robot/fit-test-coupon.py

Xuất ra `fit-test-coupon.stl` cạnh file này.

── Vì sao có miếng này ──

Vỏ robot 9 mảnh là 15–25 giờ in và 300–500 g nhựa. Sai 1 mm ở lỗ động
cơ là in lại từ đầu. Miếng này vài gram, nửa tiếng, và trả lời được câu
hỏi mà KHÔNG thước cặp nào trả lời được: **máy in đó co ngót bao nhiêu**.

Cùng một file STL đưa cho hai tiệm khác nhau ra hai kích thước khác
nhau — nhựa co khi nguội, đầu phun nở khi nóng, mỗi máy một kiểu, sai
số thực tế 0,1–0,4 mm. Đo bằng thước trên linh kiện của bạn KHÔNG bắt
được cái đó, vì nó là sai số của máy chứ không phải của linh kiện.

Nên thay vì đoán một con số, in cả một THANG số rồi để linh kiện tự
chọn. Cái nào lắp vừa tay thì đó là số đúng — cho đúng cái máy đó, đúng
loại nhựa đó, đúng hôm đó.

── Cách dùng ──

1. In một miếng, không cần đỡ, 0,2 mm lớp, 20% đặc.
2. Đo hai cạnh tấm bằng thước cặp. Danh nghĩa 100,00 × 70,00 mm.
   Lệch bao nhiêu là máy co ngót bấy nhiêu — báo tôi con số này.
3. Ấn thử động cơ vào ba hõm phía trên. Hõm nào ôm vừa — không lỏng
   lẻo, không phải nện — thì ghi lại vị trí.
4. Ấn thử servo vào ba khe giữa. Tương tự.
5. Thử ốc M3 qua ba lỗ trái, và bắt ren M3 vào ba lỗ phải.
6. Báo tôi kết quả, tôi chốt đúng số đó cho cả 9 mảnh vỏ.

── Bố cục (nhìn từ mặt trên, gốc ở góc dưới-trái) ──

  hõm động cơ (cạnh trên):   24,8 · 25,2 · 25,6 mm   ← trái sang phải
  khe servo (giữa):          +0,3 · +0,5 · +0,7 mm hở
  lỗ ốc suốt (dưới-trái):    3,0 · 3,2 · 3,4 mm
  lỗ bắt ren (dưới-phải):    2,5 · 2,7 · 2,9 mm
  ô vuông giữa dưới:         20,00 × 20,00 mm — thước đo co ngót thứ hai
  lỗ tròn nhỏ góc dưới-trái: dấu định hướng, để biết đâu là trái
"""
import math
import sys
from pathlib import Path

import bpy

# ── Kích thước danh nghĩa ────────────────────────────────────
W, H, T = 100.0, 70.0, 3.0          # tấm nền, mm

# Thân hộp số JGA25-370 danh nghĩa Ø25. Thang phủ hai bên số đó.
MOTOR_DIAMS = [24.8, 25.2, 25.6]
MOTOR_X = [17.0, 50.0, 83.0]

# Thân SG90/MG90S danh nghĩa 22,8 × 12,2 mm. Thang là độ HỞ thêm.
SERVO_W, SERVO_D = 22.8, 12.2
SERVO_CLEAR = [0.3, 0.5, 0.7]
SERVO_X = [20.0, 50.0, 80.0]
SERVO_Y = 45.0

SCREW_THRU = [3.0, 3.2, 3.4]        # ốc M3 chui lọt
SCREW_THRU_X = [12.0, 20.0, 28.0]
SCREW_TAP = [2.5, 2.7, 2.9]         # bắt ren thẳng vào nhựa
SCREW_TAP_X = [72.0, 80.0, 88.0]
SCREW_Y = 32.0

CAL_SQ = 20.0                        # ô vuông kiểm co ngót
CAL_X, CAL_Y = 50.0, 15.0

MARK_D, MARK_X, MARK_Y = 4.0, 6.0, 6.0   # dấu định hướng


def reset() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


def box(name: str, x: float, y: float, z: float, sx: float, sy: float, sz: float):
    """Khối hộp đặt theo TÂM (x, y) — mọi toạ độ ở đây tính bằng mm."""
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    o = bpy.context.object
    o.name = name
    o.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return o


def cyl(name: str, x: float, y: float, d: float, h: float):
    bpy.ops.mesh.primitive_cylinder_add(radius=d / 2, depth=h, location=(x, y, T / 2), vertices=64)
    o = bpy.context.object
    o.name = name
    return o


def cut(target, cutter) -> None:
    m = target.modifiers.new(name=f"cut_{cutter.name}", type="BOOLEAN")
    m.operation = "DIFFERENCE"
    m.object = cutter
    m.solver = "EXACT"
    bpy.context.view_layer.objects.active = target
    bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.data.objects.remove(cutter, do_unlink=True)


def main() -> None:
    reset()

    plate = box("coupon", W / 2, H / 2, T / 2, W, H, T)

    # Hõm động cơ: cắt hình trụ có tâm NẰM TRÊN cạnh trên, nên chỉ nửa
    # dưới ăn vào tấm — thành ra một cái nôi hở, ấn động cơ vào thử được
    # mà không tốn nhựa cho cả vòng tròn.
    for x, d in zip(MOTOR_X, MOTOR_DIAMS):
        cut(plate, cyl(f"motor_{d}", x, H, d, T * 3))

    # Khe servo
    for x, c in zip(SERVO_X, SERVO_CLEAR):
        cut(plate, box(f"servo_{c}", x, SERVO_Y, T / 2, SERVO_W + c, SERVO_D + c, T * 3))

    # Lỗ ốc
    for x, d in zip(SCREW_THRU_X, SCREW_THRU):
        cut(plate, cyl(f"thru_{d}", x, SCREW_Y, d, T * 3))
    for x, d in zip(SCREW_TAP_X, SCREW_TAP):
        cut(plate, cyl(f"tap_{d}", x, SCREW_Y, d, T * 3))

    # Ô vuông kiểm co ngót + dấu định hướng
    cut(plate, box("cal", CAL_X, CAL_Y, T / 2, CAL_SQ, CAL_SQ, T * 3))
    cut(plate, cyl("mark", MARK_X, MARK_Y, MARK_D, T * 3))

    out = Path(__file__).parent / "fit-test-coupon.stl"
    bpy.ops.object.select_all(action="DESELECT")
    plate.select_set(True)
    bpy.context.view_layer.objects.active = plate

    # Blender 4.2 bỏ `export_mesh.stl`, thay bằng `wm.stl_export`. Thử
    # cái mới trước rồi mới lùi, để script chạy được trên cả hai đời.
    try:
        bpy.ops.wm.stl_export(filepath=str(out), export_selected_objects=True, global_scale=1.0)
    except AttributeError:
        bpy.ops.export_mesh.stl(filepath=str(out), use_selection=True, global_scale=1.0)

    print(f"\n✅ Đã xuất {out}")
    print(f"   Tấm {W:.2f} × {H:.2f} × {T:.2f} mm")
    print(f"   Hõm động cơ: {', '.join(f'{d}' for d in MOTOR_DIAMS)} mm")
    print(f"   Khe servo hở thêm: {', '.join(f'+{c}' for c in SERVO_CLEAR)} mm")


if __name__ == "__main__":
    main()
    sys.exit(0)
