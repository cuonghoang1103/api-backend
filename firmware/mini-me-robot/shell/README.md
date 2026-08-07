# Mini-Me Robot — bộ vỏ in 3D

9 file STL, đơn vị **milimét**, đã đặt sẵn nằm trên mặt phẳng z = 0.
Sinh từ đúng kích thước linh kiện thật trong bản thiết kế:
https://cuongthai.com/maker-lab/mini-me-robot?tab=shell

---

## Số lượng cần in

| File | In mấy cái | Kích thước (mm) | Ghi chú |
|---|---|---|---|
| `01-than.stl` | 1 | 106 × 130 × 80 | Hộp chính, hở nóc và hở mặt sau |
| `02-nap-sau.stl` | 1 | 106 × 80 × 3 | Cửa bảo trì — 4 vít M3 |
| `03-tam-nguc.stl` | 1 | 96 × 60 × 3 | Lỗ ⌀8 cho laser + 4 lỗ vít |
| `04-dau.stl` | 1 | 105 × 52 × 60 | 2 lỗ ⌀42 cho ống mắt |
| `05-ong-mat.stl` | **2** | 48 × 48 × 45 | ⌀48 ngoài / ⌀42 trong, có gờ chặn PCB |
| `06-canh-tay-tren.stl` | **2** | 18 × 52 × 14 | Rỗng giữa để luồn dây khuỷu |
| `07-cang-tay.stl` | **2** | 20 × 54 × 12 | Có sẵn bàn tay |
| `08-op-xich.stl` | **2** | 150 × 62 × 6 | 2 lỗ trục ⌀8 |
| `09-gia-co.stl` | 1 | 44 × 18 × 26 | Ôm 2 servo MG90S vuông góc |

Tổng **13 lần in**, khoảng **380 g nhựa**, **~26 giờ**.

---

## Thông số in

```
Vật liệu     PLA (PETG nếu robot phải để nơi nóng — PLA mềm ở 60 °C)
Lớp          0,2 mm
Thành        3 lớp (1,2 mm) — riêng THÂN và GIÁ CỔ để 6 lớp (2,4 mm)
Đặc ruột     20 % gyroid · riêng CÁNH TAY và CẲNG TAY 12 %
Vật liệu đỡ  chỉ cho 01-than và 04-dau
Bám bàn      brim 5 mm cho 08-op-xich (dài và mỏng, dễ vênh góc)
```

**Cẳng tay in càng nhẹ càng tốt.** Mô-men đè lên khớp vai tỉ lệ với khối lượng nhân chiều dài cánh tay, nên mỗi gram ở cẳng tay "đắt" gấp đôi ở vai.

---

## In theo thứ tự này

**1. In `05-ong-mat.stl` TRƯỚC TIÊN, chỉ một cái.**

Đây là mảnh quyết định. Nhét thử module GC9A01 vào:

- Vừa khít, hơi chặt → đúng. In tiếp cái thứ hai và phần còn lại.
- Không lọt → PCB của bạn lớn hơn 40,4 mm. Mở `gen-stl.mjs`, tăng `eyeInnerD` thêm đúng phần chênh, sinh lại. **Và phải sinh lại cả `04-dau.stl`** vì lỗ trên mặt đầu phải khớp.
- Lỏng lẻo → giảm `eyeInnerD` xuống 0,5 mm.

**2. In `09-gia-co.stl`**, nhét thử servo MG90S. Cùng cách xử lý như trên.

**3. Sơn khi vỏ còn RỖNG**, trước khi lắp linh kiện — sau đó bạn sẽ không dám xịt nữa.
Lót → chà nhám 800 → 2 lớp vàng RAL 1023 → xám RAL 7016 cho ống mắt và ốp xích.

**4. Rồi mới in phần còn lại.**

---

## Chỉnh kích thước

Mọi số nằm trong khối `P` ở đầu `gen-stl.mjs`. Đổi rồi chạy lại:

```bash
node gen-stl.mjs ./stl
```

Vài tham số hay phải chỉnh sau khi cầm linh kiện thật:

| Tham số | Mặc định | Chỉnh khi nào |
|---|---|---|
| `eyeInnerD` | 42 | PCB màn hình không lọt hoặc lỏng |
| `screwD` | 3,2 | Vít M3 chặt quá (tăng) hoặc lỏng (giảm) |
| `postInnerD` | 2,7 | Lỗ mồi vít tự ren — máy in khác nhau co khác nhau |
| `wall` | 2,4 | Muốn nhẹ hơn thì 1,6; muốn cứng hơn thì 3,2 |
| `servoAxleD` | 6 | Đo trục servo thật của bạn |

---

## Những thứ cố ý KHÔNG có trong file

Ba chi tiết này dễ khoan tay hơn là in, và khoan thì chỉnh được vị trí sau khi đã lắp thử:

1. **Lỗ luồn cáp qua cổ** — khoan ⌀12 ở nóc thân và đáy đầu, sau khi đã biết bó cáp thật to bao nhiêu.
2. **Lưới loa trên tấm ngực** — khoan 7–9 lỗ ⌀3 hoặc cắt khe bằng dao rọc giấy. In lưới mảnh thường ra xấu và dễ gãy.
3. **Lỗ micro** — hai lỗ ⌀2 ở hai bên đầu. Khoan sau khi dán micro để căn đúng vị trí.

---

## Kiểm trước khi in cả bộ

Cả 9 file đã được kiểm tự động: **0 cạnh hở**, không tam giác suy biến, không pháp tuyến lỗi. Nhưng vẫn nên mở bằng slicer và xem preview trước khi bấm in — đặc biệt là `01-than.stl`, mảnh tốn nhiều giờ nhất.

Nếu slicer báo "mesh không kín" hoặc tự động sửa: đó là do các khối chồng mép nhau trong cùng file (thành với đáy). Cứ để slicer hợp nhất — đó là cách file này được thiết kế.
