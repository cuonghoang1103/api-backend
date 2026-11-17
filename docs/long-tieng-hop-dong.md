# CT Lồng Tiếng — hợp đồng giữa web, trạm máy nhà và app (18/11/2026)

Chủ kênh: lồng tiếng Việt bằng GIỌNG CỦA MÌNH (cuong8) cho video kỹ thuật tiếng Trung/Anh để TỰ HỌC. Không đăng lại.
User chọn kiến trúc **"Trạm ở máy nhà"**: app trên Mac/Windows/Linux + trang web chỉ là đầu nhận việc / xem tiến độ / tải kết quả;
phần nặng (Demucs, Whisper, F5 cuong8) chạy ở máy nhà Linux (RTX 3060) hoặc máy GPU thuê nếu có (`LT_GPU=vast7`).
Bản mẫu chạy được trên Mac (đọc trước): `/Users/admin/Documents/long-tieng/lt.mts` + `lt-remote.py` (5 bước tach → nghe → dich → doc → tron).

## Ai dùng được
Chỉ tài khoản có vai ADMIN (giọng là của chủ kênh — không mở cho người khác). Kiểm vai như các tuyến admin hiện có.

## 1. API web — `/api/v1/long-tieng` (đăng nhập JWT, ADMIN) — dùng bởi trang web VÀ app
Xác thực app: **mã kết nối** tạo trên trang web (`POST /ma-ket-noi` ⇒ trả MỘT lần chuỗi `ctlt_…`, lưu băm; app gửi `Authorization: Bearer ctlt_…`). Thu hồi được.
| Tuyến | Việc |
|---|---|
| `POST /jobs` `{ url?, tep?: { ten, kichThuoc, kieu }, lang: 'auto'|'zh'|'en', goc: 0..0.4, tenVideo? }` | tạo việc. Có `tep` ⇒ trả kèm `taiLen: { url (PUT ký sẵn R2), het }`; app PUT xong gọi `POST /jobs/:id/da-tai-len`. Có `url` ⇒ trạm tự tải. |
| `GET /jobs` · `GET /jobs/:id` | danh sách / chi tiết: `trangThai: 'cho_tai_len'|'cho'|'tai'|'lam'|'xong'|'loi'|'huy'`, `buoc`, `phanTram`, `loi`, `ketQua: [{ loai: 'vi'|'vi-goc'|'srt-vi'|'srt-goc'|'thong-tin', ten, kichThuoc, url (GET ký sẵn, 1 giờ) }]`, `thoiLuong`, `tao`, `xong` |
| `POST /jobs/:id/thu-lai` | việc lỗi ⇒ về `cho` (giữ kết quả bước đã xong ở trạm) |
| `DELETE /jobs/:id` | huỷ / xoá việc + xoá MỌI tệp R2 của việc |
| `POST /jobs/:id/da-tai-ve` | app báo đã tải đủ ⇒ server xoá tệp kết quả trên R2 (không giữ bản sao video người khác lâu) |
Tệp R2: khoá riêng tư `long-tieng/<userId>/<jobId>/…` (không công khai qua CDN). Dọn tự động: tệp quá 7 ngày ⇒ xoá (cron có sẵn của backend hoặc thêm).

## 2. API trạm — `/api/v1/internal/long-tieng` (header `x-internal-token` = `INTERNAL_API_TOKEN`, như `internal.routes.ts`)
| Tuyến | Việc |
|---|---|
| `POST /nhan` | giành 1 việc `cho` (cũ nhất) ⇒ `{ job, vao?: { url GET ký sẵn } }` hoặc 204. Việc `tai/lam` không nhịp tim > 20 phút ⇒ về `cho`. |
| `POST /:id/tien-do` `{ trangThai: 'tai'|'lam', buoc, phanTram }` | nhịp tim + tiến độ |
| `POST /:id/len-ket-qua` `{ tep: [{ loai, ten, kichThuoc, kieu }] }` | ⇒ URL PUT ký sẵn cho từng tệp |
| `POST /:id/xong` `{ thoiLuong, ketQua: [...] }` · `POST /:id/loi` `{ loi }` | kết thúc |
| `POST /dich` `{ jobId, ngonNgu, cau: [{ i, giay, toiDa, src }], truoc }` | backend dịch một lô bằng `gateway.ts` (việc mới `long_tieng_dich`, model rẻ, trần chi phí sẵn có) ⇒ `{ ds: [{ i, vi }] }` |

## 3. Trạm ở máy nhà (`linux-nha`, user Cuong03dx)
- Dịch vụ systemd --user `vbg-long-tieng.service` (Restart=always), mã ở `~/long-tieng/` (đồng bộ từ repo `tools/long-tieng-tram/`).
- Mỗi 10 s `POST /nhan`; chạy 5 bước của `lt.mts` NGAY TRÊN máy nhà: ffmpeg cục bộ; tải link bằng `yt-dlp` (YouTube có thể chặn máy nhà ⇒ thử qua máy GPU thuê nếu có, không vượt chặn — hỏng thì báo lỗi "Hãy tải video trên máy bạn rồi kéo vào app"); GPU: `LT_GPU=vast7` ⇒ ssh như bản mẫu, ngược lại GPU nhà với `flock ~/vbg-dp/.khoa-gpu` (chung khoá với dây chuyền video bài giảng). Dịch qua cổng LLM của web (khoá trong `/opt`… KHÔNG — trạm gọi `POST /api/v1/internal/long-tieng/dich` để backend dịch bằng `gateway.ts`, trạm không giữ khoá LLM).
- Đặt tên kết quả: `<Tên video> [VI].mp4`, `<Tên video> [VI + giọng gốc 15%].mp4`, `<Tên video>.vi.srt`, `<Tên video>.<zh|en>.srt`, `thong-tin.json` (nguồn, link, ngôn ngữ, thời lượng, số câu, phiên bản trạm, ngày).

## 4. App "CT Lồng Tiếng" (Electron, Mac/Windows/Linux) — `apps/ct-long-tieng/`
- Đăng nhập bằng mã kết nối; dán link / kéo thả video (nhiều tệp) / chọn tuỳ chọn; hàng việc + tiến độ; TỰ TẢI kết quả về
  `<Thư mục tải>/CT Lồng Tiếng/<YYYY-MM-DD> <Tên video>/` rồi `POST da-tai-ve`; thư viện + trình phát (đổi bản VI ↔ VI+gốc giữ vị trí, phụ đề, tốc độ, ±10 s); thông báo hệ điều hành khi xong; cài đặt (thư mục, mặc định ngôn ngữ/giọng gốc, tự chạy cùng máy).
- Link mà trạm không tải được ⇒ app tự tải bằng yt-dlp trên máy người dùng rồi tải lên như tệp.
- Bản dựng: GitHub Actions `workflow_dispatch` ra dmg/zip (mac arm64+x64), exe NSIS (win), AppImage (linux) dạng artifact. Phát hành công khai: CHỜ chủ kênh duyệt.

## 5. Trang web `/long-tieng` (ADMIN)
Cùng chức năng app (trừ tự tải vào thư mục): tạo việc bằng link hoặc tải tệp lên, tiến độ, tải kết quả, tạo/thu hồi mã kết nối app, nút tải app.
