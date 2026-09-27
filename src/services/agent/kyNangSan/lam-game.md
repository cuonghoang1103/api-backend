---
name: lam-game
description: Làm game (web: Phaser/three.js/Babylon/PixiJS; desktop/mobile: Godot/Unity): chọn engine, vòng lặp bước cố định, input bàn phím/tay cầm/cảm ứng, máy trạng thái, lưu game, âm thanh, hiệu năng, nhiều người chơi, kiểm thử, đóng gói Windows/macOS/Linux/web.
---

# KỸ NĂNG: LÀM GAME — chơi được, mượt, không mất dữ liệu người chơi

Mục tiêu: game chạy mượt ở mọi tốc độ khung hình, điều khiển nhạy trên bàn phím/tay cầm/cảm ứng, lưu tiến trình
không bao giờ hỏng, và **đã chơi thử thật** (hoặc có bài kiểm cho logic) trước khi báo xong.

## 0. Luật vàng

1. **Logic game tách khỏi hiển thị.** Luật chơi (điểm, máu, va chạm logic, trạng thái màn) viết thành hàm/lớp thuần,
   không gọi API vẽ ⇒ kiểm thử được bằng unit test, và đổi engine hiển thị không phải viết lại luật.
2. **Mọi thứ chạy theo THỜI GIAN, không theo SỐ KHUNG.** `vitri += vanToc * dt`. Game chạy 144 Hz không được nhanh gấp
   đôi máy 60 Hz.
3. **Đọc engine/phiên bản dự án đang dùng trước** (package.json, `project.godot`, `ProjectSettings` của Unity). Đừng
   trộn API của hai phiên bản lớn (Godot 3 vs 4, Phaser 2 vs 3).
4. **Tài nguyên (hình, âm thanh, font, model) phải có giấy phép rõ ràng** (CC0 hoặc tác giả cho phép) và ghi công.
   Không lấy tài nguyên của game thương mại.
5. **Kiểm bằng chơi**: chạy game, chụp màn hình, thử phím/tay cầm; logic quan trọng có unit test. "Build xanh" chưa
   phải "chơi được".

## 1. Chọn engine

| Loại game | Gợi ý |
|---|---|
| 2D trên web, nhỏ tới vừa | **Phaser 3** (đủ vật lý arcade, scene, âm thanh, tilemap) · PixiJS nếu chỉ cần vẽ nhanh |
| 3D trên web | **three.js** (linh hoạt) · Babylon.js (có sẵn nhiều thứ: vật lý, GUI, inspector) — đọc kèm kỹ năng `3d-webgl` |
| 2D/3D desktop + mobile, miễn phí | **Godot 4** (GDScript/C#), xuất Windows/macOS/Linux/Android/iOS/Web |
| Dự án lớn, cần store/asset | Unity (C#) — chú ý điều khoản giấy phép hiện hành |
| Game trong trình duyệt nhúng vào web React | Phaser/three.js trong component, dọn sạch khi unmount (`game.destroy(true)`, `renderer.dispose()`) |

## 2. Vòng lặp game

- **Bước cố định cho logic/vật lý** (vd 60 Hz) + bộ tích luỹ; vẽ theo tốc độ màn hình, nội suy vị trí giữa hai bước:
  ```js
  const BUOC = 1 / 60; let tichLuy = 0;
  function khung(dtThat) {
    tichLuy += Math.min(dtThat, 0.25);      // kẹp: tab quay lại sau lâu không "tua nhanh"
    while (tichLuy >= BUOC) { capNhat(BUOC); tichLuy -= BUOC; }
    ve(tichLuy / BUOC);                      // alpha nội suy
  }
  ```
- Tạm dừng khi tab ẩn (`visibilitychange`), và khi mở menu.
- Không cấp phát đối tượng mới mỗi khung (đạn, hạt): dùng **object pool** ⇒ không giật vì dọn rác.

## 3. Trạng thái và cấu trúc

- **Máy trạng thái** cho màn (Menu → Đang chơi → Tạm dừng → Thua/Thắng) và cho nhân vật (Đứng/Chạy/Nhảy/Bị đánh).
  Chuyển trạng thái có `vao()`/`ra()` rõ ràng — không rải `if (dangNhay && !dangRoi && ...)` khắp nơi.
- Game nhiều đối tượng cùng loại hành vi ⇒ cân nhắc **ECS** (thực thể + thành phần + hệ thống).
- Dữ liệu cân bằng game (máu, sát thương, giá) để trong file dữ liệu (JSON/Resource), không rải số cứng trong mã.
- Sinh ngẫu nhiên có **seed** (ví dụ `seedrandom`) ⇒ tái hiện được lỗi và viết test tất định.

## 4. Điều khiển

- Bàn phím: dùng `event.code` (vị trí phím, không phụ thuộc bố cục bàn phím/Telex) thay vì `event.key`; hỗ trợ cả
  WASD và mũi tên.
- Tay cầm: Gamepad API (web) phải **đọc lại mỗi khung** (`navigator.getGamepads()`), có vùng chết cho cần analog.
- Cảm ứng: nút ảo đủ to (≥ 44 px), `touch-action: none` trên canvas, không để cử chỉ cuộn/zoom của trình duyệt ăn thao tác.
- Cho **đổi phím** và nhớ lựa chọn. Đầu vào được đệm (input buffer) vài khung để nút nhảy bấm sớm vẫn ăn.

## 5. Lưu game

- Lưu dạng dữ liệu có **số phiên bản** (`{ v: 3, ... }`) + hàm nâng cấp từ bản cũ — thêm trường mới mà không có nâng cấp
  là làm hỏng file lưu của người chơi cũ.
- Ghi an toàn: ghi file tạm rồi đổi tên (desktop); web dùng IndexedDB/localStorage có `try/catch` (chế độ riêng tư có thể
  chặn). Lưu định kỳ + khi thoát.
- Có dữ liệu trên máy chủ (điểm cao, tiền trong game) ⇒ **máy chủ kiểm**, không tin số client gửi lên.

## 6. Âm thanh và cảm giác chơi

- Mở khoá âm thanh ở thao tác đầu tiên của người chơi (quy định của trình duyệt). Tách kênh nhạc/hiệu ứng với thanh
  âm lượng riêng; nhớ lựa chọn tắt tiếng.
- "Cảm giác" đến từ phản hồi: rung màn hình nhẹ, dừng khung (hit-stop) vài chục ms, hạt, âm thanh — thêm có chừng mực,
  có tuỳ chọn giảm chuyển động.

## 7. Hiệu năng

- Đặt ngân sách: 60 FPS trên máy mục tiêu yếu nhất; đo (xem kỹ năng `3d-webgl` mục 1).
- Sprite gom vào **atlas**; 3D dùng instancing; hạt có giới hạn số lượng.
- Va chạm: lưới không gian/quadtree cho nhiều vật thể; đừng so từng cặp O(n²).
- Web: DPR tối đa 1,5–2, thang chất lượng tự hạ.

## 8. Nhiều người chơi

- **Máy chủ quyết định** (authoritative): client gửi thao tác, máy chủ tính kết quả; client dự đoán cục bộ rồi chỉnh
  theo máy chủ. Không tin vị trí/điểm do client gửi.
- WebSocket (ví dụ Socket.IO/Colyseus) gửi trạng thái theo nhịp cố định (10–30 lần/giây), nội suy phía client.
- Có giới hạn tần suất và kiểm dữ liệu đầu vào (chống spam/gian lận).

## 9. Kiểm thử

- Unit test cho logic thuần (tính sát thương, luật thắng/thua, nâng cấp file lưu) với seed cố định.
- Chơi thử có kịch bản: vào game, chơi 1 màn, thua, chơi lại, lưu/thoát/mở lại. Chụp màn hình các trạng thái.
- Web: Playwright bấm phím + chụp; đo FPS bằng trình duyệt có GPU thật.

## 10. Đóng gói và phát hành

- **Godot**: cài export templates đúng phiên bản; xuất Windows (`.exe` + `.pck`), macOS (`.app`/`.dmg`, cần ký/notarize
  để không bị Gatekeeper chặn), Linux (`.x86_64`), Web (cần header COOP/COEP nếu dùng thread).
- **Unity**: Build Settings chọn nền tảng; IL2CPP cho mobile.
- **Web**: bản dựng tĩnh, đặt cache dài cho file có mã băm, nén gzip/brotli; `.wasm` phải được phục vụ đúng
  `Content-Type: application/wasm`.
- Phát hành itch.io bằng `butler push <thư-mục> user/game:windows` (đưa lệnh cho người dùng — cần đăng nhập của họ).
- Windows: bản chưa ký sẽ bị SmartScreen cảnh báo — nói trước với người dùng.

## 11. Báo cáo cuối

Engine + phiên bản, đã làm gì, đã chơi thử những gì (kèm ảnh), số đo FPS, bài kiểm logic nào đã chạy, tài nguyên
dùng giấy phép gì, và phần chưa kiểm được (tay cầm thật, máy yếu, mobile thật).
