# Đề giao (Opus): ĐƯA GAME FLYING PENCIL (BẢN THỬ MÀN 1) VÀO APP DESKTOP + PHÁT HÀNH · 08/10/2026

Repo `/Users/admin/Downloads/api-backend` (app desktop ở `desktop/`) + game ở `~/Documents/FlyingPencil` (bản build macOS
`FlyingPencilUnity/Build/FlyingPencil.app`, đã dựng từ master sau FP-97). Đọc `CLAUDE.md` (mục Phát hành app desktop — `npm run phat-hanh`,
KHÔNG bump tay; Deploy). Làm MỘT MÌNH. **Không commit/push/deploy/phát hành** — trưởng nhóm kiểm rồi làm. Nhiều phiên khác cùng repo:
chỉ đụng tệp trong phạm vi, không git add/stash/checkout.

## Khách muốn
Có bản game để CHƠI THỬ ngay trong app desktop, ở một mục riêng; sau này cập nhật bản game mới không cần phát hành lại app.

## Làm
1. **Đóng gói bản game**: script `~/Documents/FlyingPencil/TaiNguyen/dong_goi_game.sh` — zip `FlyingPencil.app` (ditto -c -k --keepParent, giữ symlink/quyền),
   tính sha256, ghi `phien_ban.json` {version: "0.1.0-man1", sha256, size, ngay, ghi_chu EN/VI, yeu_cau: "macOS 13+, Apple Silicon"}.
   Kiểm tra thành phần bên thứ ba trong bản build được phép PHÂN PHỐI dạng game đã dựng (CC BY/CC0 ok; Asset Store EULA cho phép trong sản phẩm đã
   biên dịch; Mixamo ok) — ghi kết luận; màn Ghi công có trong game.
2. **Nơi tải**: phát hành tệp zip + phien_ban.json lên GitHub Release của kho CÔNG KHAI `cuonghoang1103/cuongthai-desktop` với tag riêng
   `flying-pencil-0.1.0` (KHÔNG đụng release app `v*`) — chuẩn bị lệnh `gh release create …` trong script nhưng KHÔNG tự chạy; hoặc đề xuất R2 nếu
   hợp lý hơn (ghi lý do). Cung cấp URL cố định "latest" để app đọc `phien_ban.json`.
3. **Mục trong app desktop**: trong `/games` (TroChoiPage) thêm thẻ lớn nổi bật "Flying Pencil — Thế chiến (bản thử màn 1 Trân Châu Cảng)" với ảnh bìa
   (lấy từ render/), mô tả, dung lượng, yêu cầu máy, nút **Tải về** (tiến độ %, huỷ, tiếp tục), kiểm sha256, giải nén vào
   `~/Library/Application Support/<app>/games/flying-pencil/<version>/`, nút **Chơi** (mở .app qua main process `shell.openPath`/`open -a`), **Cập nhật**
   khi phien_ban.json có bản mới, **Gỡ cài đặt**. Xử lý macOS Gatekeeper cho app chưa ký (gỡ thuộc tính quarantine trên thư mục đã giải nén nếu cần,
   giải thích trong UI nếu macOS vẫn chặn: chuột phải → Mở). IPC an toàn (contextBridge, chỉ hàm cụ thể, kiểm đường dẫn nằm trong thư mục games).
   Theo `feedback_app_desktop_khong_dung_layout_web` + `feedback_bay_electron_desktop` trong bộ nhớ dự án (đọc trước).
4. Kiểm: desktop typecheck 2 config + test, chạy app dev (`npm run dev` trong desktop) tải từ một URL thử cục bộ (http server tạm phục vụ zip) — tải, kiểm
   sha256, giải nén, bấm Chơi mở được game, gỡ được. Ảnh chụp vào scratchpad.
Báo lại ngắn: tệp đổi, script đóng gói, lệnh phát hành chờ chạy, ảnh, rủi ro (Gatekeeper/ký số).
