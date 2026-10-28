# CREDITS — cảnh 3D "Hành trình vào máy tính"

**Không dùng mô hình, ảnh, HDRI, âm thanh hay phông chữ tải từ bên ngoài.**

| Thành phần | Nguồn | Giấy phép |
|---|---|---|
| Mọi hình khối (bàn, cây máy, bo mạch, CPU, die, lõi, cổng logic, transistor) | Dựng bằng mã trong `scene/macro.ts`, `scene/micro.ts` | Mã của cuongthai.com |
| Mọi hoạ tiết (vân gỗ, mạch in, chữ khắc nắp IHS, sơ đồ die, ô nhớ, màn hình MARIE) | Vẽ bằng Canvas 2D trong `scene/tex.ts` (seed cố định) | Mã của cuongthai.com |
| Thư viện 3D | three.js 0.186 (`three`) | MIT |
| Ánh sáng môi trường | `RoomEnvironment` (three/examples/jsm/environments) — dựng bằng mã, không phải ảnh HDR | MIT (three.js) |
| Hậu kỳ (bloom, DOF, output) | `UnrealBloomPass`, `BokehPass`, `OutputPass`, `EffectComposer` của three.js examples | MIT (three.js) |
| `RoundedBoxGeometry`, `BufferGeometryUtils` | three.js examples | MIT (three.js) |
| Âm thanh giao diện trên web | `components/labs/sfx.ts` — tổng hợp Web Audio, không tệp âm thanh | Mã của cuongthai.com |
| Âm thanh trong video | thư viện `public/am/*.wav` sẵn có của dự án video | như các bài video khác |
| Phông chữ trên hoạ tiết | phông hệ thống (Inter/Helvetica/Arial, JetBrains Mono/Menlo nếu có) — chỉ dùng để vẽ, không nhúng | — |

Tên/nhãn trên linh kiện ("CUONGTHAI CT-1", "CT GRAPHICS", "B-01 PCH") là tên giả của cuongthai.com — cố ý không dùng thương hiệu thật.
Nếu sau này thêm tài sản CC0 (Poly Haven, Kenney, Quaternius…), ghi vào bảng này: tên, đường dẫn gốc, giấy phép, ngày tải.
