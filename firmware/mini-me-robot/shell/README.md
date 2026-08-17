# Mini-Me Robot — bộ vỏ in 3D

9 file STL, đơn vị **milimét**, đã đặt sẵn nằm trên mặt phẳng z = 0.
Sinh từ đúng kích thước linh kiện thật trong bản thiết kế:
https://cuongthai.com/maker-lab/mini-me-robot?tab=shell

---

## Xem trước trước khi gửi đi in

```bash
node gen-stl.mjs stl        # sinh 9 file STL
python3 xem-stl.py stl anh  # dựng ảnh → anh/00-tat-ca.png
```

⚠️ **Nhìn ảnh TRƯỚC KHI trả tiền in.** Vỏ nhựa đắt hơn firmware nhiều: sai một con số là mất cả lô và mấy ngày chờ ship. `xem-stl.py` dựng hai góc cho mỗi mảnh — nghiêng để thấy khối, và **chiếu thẳng từ trên xuống để thấy lỗ nằm đâu**.

⚠️ **Nhưng ảnh KHÔNG bắt được mọi lỗi.** Ngày 16/08/2026 ống mắt trông hoàn toàn bình thường trong ảnh, trong khi hốc chữ nhật bên trong đang **chọc thủng thành ống** — nửa đường chéo hốc 31 mm lớn hơn bán kính ống 27 mm, lưới tự cắt nhau. Chỉ phép **đo bằng số** mới lộ ra. Đo xong rồi hãy tin mắt.

## Số lượng cần in

| File | In mấy cái | Kích thước (mm) | Ghi chú |
|---|---|---|---|
| `01-than.stl` | 1 | 150 × 120 × 130 | Hộp chính, hở nóc và hở mặt sau |
| `02-nap-sau.stl` | 1 | 150 × 130 × 3 | Cửa bảo trì — 4 vít M3 |
| `03-tam-nguc.stl` | 1 | 140 × 138 × 7 | Cửa sổ 86×41 + lỗ loa ⌀52 + trụ bắt |
| `04-dau.stl` | 1 | 130 × 60 × 56 | 2 lỗ ⌀35 + 8 vấu giữ bo màn |
| `05-ong-mat.stl` | **2** | 54 × 54 × 40 | Vành khuyên úp ngoài mặt đầu |
| `06-canh-tay-tren.stl` | **2** | 18 × 52 × 14 | Rỗng giữa để luồn dây khuỷu |
| `07-cang-tay.stl` | **2** | 20 × 54 × 12 | Có sẵn bàn tay |
| `08-op-xich.stl` | **2** | 195 × 105 × 6 | Trùm ngoài khung TP101 |
| `09-gia-co.stl` | 1 | 44 × 18 × 26 | Ôm **MỘT** servo MG90S. ⚠️ Dòng cũ ghi "2 servo vuông góc" là SAI — hình chỉ có một rãnh chữ U, đã kiểm bằng mặt cắt. Muốn đầu quay 2 trục thì MUA khung pan-tilt sẵn (20-40k), đừng in |

Tổng **13 lần in**, khoảng **520 g nhựa**, **~34 giờ**.

### Số đo thật đã đo (16/08/2026)

| Linh kiện | Kích thước | Ảnh hưởng tới vỏ |
|---|---|---|
| Loa | **⌀65 × 30 dày** | ép thân cao 130 (bản cũ tính cho ⌀40) |
| Đế pin 18650 đôi | 92 × 43 × 22, nằm ngang | chốt chiều sâu thân 120 |
| Màn 3.5" | 100 × 55 × 5, viền 6 → kính 88 × 43 | cửa sổ khoét 86 × 41 (chờm 1mm che sai số in) |
| Bo màn tròn | 38 × 45,5 × 3,2, kính ⌀32,4 | **chữ nhật, KHÔNG vuông** — xem mảnh 05 |
| Khung TP101 | 193 × 163 × 60, 0,47 kg | ốp xích cao 105 để trông gấp rưỡi |

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
