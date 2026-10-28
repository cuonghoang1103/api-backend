# cpu-lab-3d — "Hành trình vào máy tính" + "Bạn đang ở đâu trong máy tính"

Một cảnh 3D (three.js, dựng toàn bằng mã) dùng chung cho **ba nơi**:

| Nơi | Tệp | Chế độ |
|---|---|---|
| Trang `/cpu-lab/3d` (bay 8 tầng, nút/phím/cuộn/vuốt) | `Journey3D.tsx` | `journey` (p = 0..7) |
| Mini-map cạnh mô phỏng bất kỳ | `WhereInComputer.tsx` | `focus` |
| Video Remotion (`~/Documents/video-bai-giang/src/khung/may3d/`) | `San3D.tsx`, `ViTri.tsx` | cả hai |

`scene/` là **nguồn duy nhất** (thuần three.js, không React, không `Math.random`, mỗi khung là hàm thuần của trạng thái).
Dự án video chép nó bằng `bash src/khung/may3d/dong-bo.sh` — sửa ở đây rồi chạy lại lệnh đó.

## 1. Mini-map `<WhereInComputer>`

```tsx
import WhereInComputer from '@/components/cpu-lab-3d/WhereInComputer';
<WhereInComputer focus="page-table" lang="vi" height={260} />   // khái niệm
<WhereInComputer focus="cpu.registers" />                          // hoặc id điểm đến
```

- `focus` đổi ⇒ camera bay từ chỗ cũ tới chỗ mới (~1,8 s), khung sáng + chú thích "ở đây xảy ra gì".
- Khái niệm có `also` ⇒ các chỗ phụ cũng sáng nhạt + chip "+ RAM"… trong chú thích.
- Nạp three.js khi khung **hiện trên màn hình**; chỉ dựng thế giới vĩ mô, hoạ tiết độ nét thấp, DPR ≤ 1,5;
  vẽ trong lúc bay + 8 s xoay chậm rồi **ngừng vẽ** (rê chuột vào để xoay tiếp).
- `prefers-reduced-motion` ⇒ không bay, không xoay. Không có WebGL ⇒ sơ đồ 2D (`MiniMap2D` trong `Fallback2D.tsx`).
- Mỗi mini-map giữ một ngữ cảnh WebGL ⇒ **một trang chỉ nên có một cái** (đổi `focus` thay vì gắn nhiều cái).
  Trong phòng lab OS dùng `<WhereBox>` (`os-lab/where.tsx`): khung đầu tiên trên trang giữ ngữ cảnh 3D, các khung sau tự vẽ 2D
  (có nút "Xem 3D" để giành lại chỗ).
- Mở thẳng trên trang 3D: `/cpu-lab/3d?vi-tri=page-table` (tab "Ở đâu?").

## 2. Id điểm đến (`FOCUS_IDS`, `scene/data.ts`)

| id | chỗ | id | chỗ |
|---|---|---|---|
| `pc` | cả cây máy | `bus.memory` | đường đồng CPU ⇄ RAM |
| `board` | bo mạch chủ | `ram` | hai thanh RAM |
| `cpu` | gói CPU trong socket | `ram.cells` | ô nhớ DRAM trong một chip RAM |
| `cpu.die` | die silicon | `bus.pcie` | làn PCIe (GPU, SSD) |
| `cpu.core` | một lõi | `ssd` | ổ SSD M.2 |
| `cpu.fetch` | khối nạp lệnh | `ssd.controller` | chip điều khiển SSD |
| `cpu.decode` | giải mã & điều khiển (control unit) | `ssd.nand` | chip NAND flash |
| `cpu.registers` | thanh ghi | `gpu` | card đồ hoạ |
| `cpu.alu` | ALU | `chipset` | chipset (PCH) + đường DMI |
| `cpu.mmu` | MMU · TLB | `nic` | chip mạng Ethernet |
| `cpu.l1` / `cpu.l2` / `cpu.l3` | cache từng cấp | `cpu.imc` | bộ điều khiển bộ nhớ |

## 3. Khái niệm bài học ⇒ chỗ (`CONCEPTS`)

| khái niệm | camera tới | cũng sáng |
|---|---|---|
| `register` | `cpu.registers` | |
| `alu` | `cpu.alu` | |
| `control-unit` | `cpu.decode` | |
| `cache-line` | `cpu.l3` | `cpu.l1`, `cpu.l2` |
| `page-table` | `ram.cells` | `cpu.mmu` (TLB) |
| `tlb` | `cpu.mmu` | `ram` |
| `ram-cell` | `ram.cells` | |
| `bus` | `bus.memory` | `bus.pcie` |
| `ssd` | `ssd.nand` | `ssd` |
| `file` | `ssd.nand` | `ram` (page cache) |
| `page-cache` | `ram` | `ssd.nand` |
| `process` | `ram` | `cpu.core` |
| `thread` | `cpu.core` | `cpu.registers` |
| `scheduler` | `cpu.core` | `ram` (run queue) |
| `run-queue` | `ram` | `cpu.core` |
| `stack` | `ram` | `cpu.l1`, `cpu.registers` |
| `heap` | `ram` | |
| `interrupt` | `cpu.core` | `chipset` |
| `packet` | `nic` | `chipset`, `ram` |
| `gpu` | `gpu` | |
| `syscall` | `cpu.core` | `cpu.registers`, `ram` |
| `kernel-code` | `ram` | `cpu.core` |
| `vdso` | `ram` | `cpu.core` |
| `fd-table` | `ram` | `ssd.nand` |
| `inode` | `ssd.nand` | `ram` |
| `permission` | `cpu.core` | `ram`, `ssd.nand` |
| `namespace` | `ram` | `cpu.core` |
| `overlay` | `ssd.nand` | `ram` |
| `epoll` | `ram` | `nic`, `cpu.core` |

Thêm khái niệm: một dòng trong `CONCEPTS` (`scene/data.ts`), có `note` VI/EN. Thêm chỗ mới: thêm id vào `FOCUS_IDS` + `FOCUS`,
một tư thế camera trong `poses` (`scene/macro.ts`) và vùng sáng trong `FOCUS_HL` (`scene/journey.ts`).

## 4. Video (Remotion)

Xem `~/Documents/video-bai-giang/src/khung/may3d/README.md`. Tóm tắt:

```tsx
import { ViTriTrongMay } from '../../khung/may3d/ViTri';
<ViTriTrongMay buoc={[{ focus: 'tlb', tu: 0 }, { focus: 'page-table', tu: C.tu(3, 'bảng') }]} />
```

⚠️ Render bài có cảnh 3D phải bật WebGL: `LAM_BAI_GL=angle tsx xuat/lam-bai.mts <id>` (Chrome mặc định của Remotion trên Mac
không tạo được ngữ cảnh WebGL ⇒ lỗi `Error creating WebGL context`).

## 5. Ngân sách hiệu năng (trang `/cpu-lab/3d`)

- three.js nạp động khi trang mở (trang chỉ 17 kB); chất lượng `auto`: máy cảm ứng màn nhỏ ⇒ `low`, còn lại `high`.
- `high`: DPR ≤ 1,5, bóng đổ 1024, bloom + MSAA 4 qua EffectComposer. `low`: DPR 1, không bóng, không hậu kỳ.
- Tự hạ xuống `low` nếu 2–5 s đầu trung bình < 40 fps; đứng yên ⇒ vẽ 30 fps; tab ẩn / ra khỏi màn hình ⇒ ngừng vẽ.
- `prefers-reduced-motion` hoặc không WebGL ⇒ bản 2D (`Fallback2D`), có nút "Xem bản 3D".

## 6. Giấy phép tài sản

Xem `CREDITS.md` — không có tài sản ngoài nào.
