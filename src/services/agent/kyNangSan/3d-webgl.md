---
name: 3d-webgl
description: Làm và tối ưu 3D trên web (three.js/WebGPU/TSL, React Three Fiber, Babylon): ngân sách hiệu năng, DPR + tự hạ chất lượng, dựng shader không đơ, nén model/texture, instancing, rò rỉ bộ nhớ, âm thanh, iPad/iPhone, đo FPS thật.
---

# KỸ NĂNG: 3D TRÊN WEB — đẹp mà không treo máy người chơi

Mục tiêu: cảnh 3D chạy mượt trên máy tính, iPad, iPhone; vào trang **không đơ**; chơi lâu **không tụt FPS**; và mọi
kết luận hiệu năng đều dựa trên **số đo thật**, không đọc mã rồi đoán.

## 0. Luật vàng

1. **Đo trước, sửa sau, đo lại.** Không có số thì không biết mình sửa đúng chỗ. Tối thiểu: FPS trung vị, khung tệ nhất
   (ms), long task (> 50 ms), số draw call + tam giác mỗi khung, bộ nhớ JS, thời gian từ lúc mở tới lúc chơi được.
2. **Headless không có GPU thật** — FPS đo trong Chrome headless/pane nhúng là vô nghĩa. Đo bằng trình duyệt có GPU
   (Playwright `channel: 'chrome'`, `headless: false`) hoặc trên máy thật.
3. **Không giảm đồ hoạ của máy khoẻ để cứu máy yếu.** Dùng thang chất lượng tự động (mục 3): máy khoẻ giữ nguyên
   độ đẹp, chỉ máy không kham nổi mới bị hạ.
4. **So ảnh chụp trước/sau** mỗi lần tối ưu để chắc hình không đổi (cùng góc camera, cùng thời điểm).

## 1. Đo cho đúng

- FPS + khung tệ nhất: đếm `requestAnimationFrame` mỗi giây, ghi `max(delta)`. Theo dõi **theo thời gian** (60 giây):
  FPS tụt dần khi đứng yên = rò rỉ, không phải "máy yếu".
- Long task: `new PerformanceObserver(...).observe({ type: 'longtask', buffered: true })`.
- Draw call/tam giác: `renderer.info.render` (three.js). Với WebGPU có thể đếm bằng cách bọc
  `GPURenderPassEncoder.prototype.draw/drawIndexed` trong script đo.
- Hàm nào ăn CPU: CDP `Profiler.start/stop` 5 giây ở đầu và sau 1 phút, so danh sách self-time — hàm nào **tăng dần**
  theo thời gian là thủ phạm rò rỉ.
- Đo pipeline shader: đếm `createRenderPipeline(Async)` theo thời gian — hàng trăm cái dồn vào 1 giây = cú đơ lúc vào.

## 2. Những nguyên nhân treo/giật đã gặp thật

| Triệu chứng | Nguyên nhân | Cách sửa |
|---|---|---|
| Vào trang đơ cứng 2–4 giây, cả máy khựng | Dựng hàng trăm shader/pipeline trong MỘT tác vụ | Làm nóng shader **chia lô**: bật từng nhóm vật thể, render/`compileAsync`, nhường trình duyệt mỗi ~24 ms (rAF); tạm dừng vòng render chính trong lúc đó |
| Khu mới lọt vào khung hình là giật | Shader chỉ dựng khi vật thể lần đầu được vẽ | Làm nóng trước MỌI vật thể, kể cả đang ẩn, cho mọi mức chất lượng |
| FPS tụt dần khi đứng yên | Gọi API tốn kém MỖI khung dù giá trị không đổi (vd `howl.volume()/rate()` ⇒ `AudioParam.setValueAtTime`, hàng đợi của âm thanh chưa nạp phình vô hạn) | Chỉ gọi khi giá trị THẬT SỰ đổi; bỏ qua âm thanh chưa nạp |
| Bộ nhớ tăng mãi | Geometry/material/texture không `dispose()` khi gỡ vật thể; tạo `new Vector3()` mỗi khung | `dispose()` khi gỡ; tái dùng đối tượng tạm |
| Crash giữa vòng lặp update | Xoá phần tử khỏi mảng đang duyệt (vd `clear()` gọi từ giữa `update()`) | Đánh dấu rồi xoá sau vòng, hoặc bộ đếm thế hệ |
| Vật thể "phình to che màn hình" | Model có xương với **bind pose vỡ**; `computeBoundingBox()` KHÔNG chạy skinning nên đo sai | Đo bằng `SkinnedMesh.applyBoneTransform()`; kiểm model trước khi dùng |
| Mặt phẳng nhấp nháy, đường kẻ biến mất | Z-fighting: hai mặt trùng độ cao | Nâng từng lớp (nền → đường +0,05 → vạch +0,10), hoặc `polygonOffset` |
| Tải trang tải file 2 lần | `<link rel=preload>` khác URL thật (thiếu `?v=`, sai đuôi nén) | Preload phải khớp TỪNG KÝ TỰ với URL mà loader gọi |

## 3. Thang chất lượng tự động

- **DPR**: máy tính tối đa 2; điện thoại/iPad tối đa **1,5** (DPR 3 vẽ gấp 4 lần điểm ảnh mà mắt khó thấy).
- **iPadOS tự nhận là Mac**: nhận diện iPad bằng `/Macintosh/.test(ua) && navigator.maxTouchPoints > 1`, không chỉ UA.
- **Tự hạ khi FPS thấp**: đo FPS trung vị mỗi 3 giây bằng `performance.now()` (delta của ticker thường bị kẹp nên
  không thấy FPS < 30); **hai cửa sổ liên tiếp** dưới 30 FPS ⇒ hạ một bậc (DPR −0,25 tới 1, rồi tắt DOF/giảm bóng/bloom).
  Chỉ hạ, không tự nâng (tránh nhấp nháy). Người chơi tự chọn chất lượng trong menu ⇒ tắt tự hạ. Tab ẩn ⇒ bỏ cửa sổ đó.
- **Máy cảm ứng giới hạn 60 khung/giây** (bỏ khung trong vòng lặp; logic phải chạy theo thời gian thật, không theo số khung).

## 4. Tài nguyên (asset)

- Model: glTF/GLB + **Draco** hoặc **meshopt**; texture **KTX2/Basis** (nén trên GPU) hoặc WebP. Kiểm nhìn lại sau nén
  (nén quá mạnh làm vỡ hình — đừng đổi sang bản nén mà không so ảnh).
- **Không giản lược lưới (simplify) model có xương** — phá trọng số skinning.
- Nhiều vật thể giống nhau ⇒ `InstancedMesh` (một draw call). Vật tĩnh cùng material ⇒ gộp geometry.
- Tải lười: âm thanh/model của khu chưa tới thì chưa tải (`preload: false` + tải khi cần). Nhạc nền MB-lớn không tải ở
  màn hình chờ.
- Ghi công tài nguyên bên ngoài (CC0/CC-BY) vào `ATTRIBUTION`.

## 5. Âm thanh

- Trình duyệt chỉ cho phát sau **thao tác của người dùng** — mở khoá AudioContext ở cú bấm đầu tiên.
- Không đặt volume/rate/position mỗi khung khi không đổi (xem bảng mục 2). Âm thanh theo vị trí: cập nhật khi vị trí
  đổi đáng kể.
- Tab ẩn thì tạm dừng nhạc; quay lại thì tôn trọng lựa chọn tắt nhạc của người chơi.

## 6. WebGPU và fallback

- three.js `WebGPURenderer` tự lùi WebGL2 khi trình duyệt không có WebGPU — kiểm cả hai đường. Safari iOS có WebGPU từ
  bản mới; máy cũ sẽ đi WebGL2 (dựng shader chậm hơn).
- Lỗi TSL (`Length of parameters exceeds…`) là **lỗi hình học shader** — đọc stack bằng `Node.captureStackTrace = true`
  ở bản debug; đừng "sửa" nếu làm đổi hình vẽ, ghi chú lại.
- Canvas mất context (tab nền lâu, GPU reset) ⇒ lắng nghe sự kiện mất/khôi phục và dựng lại.

## 7. Vật lý và vòng lặp

- Vật lý (Rapier/cannon/Ammo) chạy **bước cố định** (vd 1/60 s) với bộ tích luỹ thời gian; render nội suy. Không để
  bước vật lý phụ thuộc FPS.
- `delta` kẹp tối đa (vd 1/30) để tab quay lại sau lâu không làm vật thể "bay".

## 8. Kiểm trước khi báo xong

- Đo lại cùng kịch bản trước/sau: khung tệ nhất lúc vào, FPS sau 60 giây, bộ nhớ, số file tải.
- Chụp cùng góc camera trước/sau, so bằng mắt: đồ hoạ trên máy khoẻ **không được xấu đi**.
- Giả lập iPad (UA Macintosh + `maxTouchPoints` 5) và iPhone; bóp CPU (CDP `Emulation.setCPUThrottlingRate`) để xem thang
  tự hạ có chạy. Nói rõ chưa thử trên máy thật nào.
- Dự án có bản dựng tĩnh chép vào thư mục public của web khác ⇒ chép lại + kiểm tên gói khớp + khởi động lại server
  (một số server chốt danh sách file public lúc khởi động).

## 9. Báo cáo cuối

Bảng số trước/sau (khung tệ nhất, FPS sau 1 phút, file/MB tải lúc vào), những gì đã đổi và vì sao, ảnh so sánh, và
phần CHƯA kiểm được (máy thật iPhone/iPad, Safari).
