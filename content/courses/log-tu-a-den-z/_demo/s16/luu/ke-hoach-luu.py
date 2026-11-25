#!/usr/bin/env python3
"""ke-hoach-luu.py — từ MỤC ĐÍCH ra thời gian lưu, từ thời gian lưu ra dung lượng mỗi tầng.
Đầu vào là số ĐO được: GB thô mỗi ngày (bài 16.2) và tỉ lệ nén đo trên log của chính bạn."""
GB_NGAY, NEN = 2.64, 16          # 50 req/s × 3 dòng × 204 B; zstd -3 đo được 16× trên access.log của gói log
LOAI = [  # (loại log, mục đích, nóng: tìm ngay, lạnh: chỉ lưu, % lượng log)
    ("debug/trace ứng dụng", "gỡ lỗi",               3,   0, 0.55),
    ("access log web",        "gỡ lỗi + bảo mật",      30,  335, 0.35),
    ("auth/sudo/audit",       "bảo mật, pháp lý (12 tháng)", 90, 275, 0.08),
    ("nhật ký thao tác admin", "kiểm toán, hợp đồng",   90, 640, 0.02),
]
print(f"{'loại':24}{'mục đích':30}{'nóng':>6}{'lạnh':>6}{'GB nóng':>9}{'GB lạnh':>9}")
tn = tl = 0
for ten, md, nong, lanh, ti in LOAI:
    gn = GB_NGAY * ti * nong / NEN * 3      # kho nóng (Loki/Elastic): nén + chỉ mục ≈ 3 lần dữ liệu đã nén
    gl = GB_NGAY * ti * lanh / NEN          # kho lạnh (object storage): chỉ dữ liệu đã nén
    tn += gn; tl += gl
    print(f"{ten:24}{md:30}{nong:>5}n{lanh:>5}n{gn:>9.1f}{gl:>9.1f}")
print(f"{'tổng':60}{tn:>9.1f}{tl:>9.1f}   (giữ hết mọi thứ 1 năm ở tầng nóng: {GB_NGAY*365/NEN*3:.0f} GB)")
