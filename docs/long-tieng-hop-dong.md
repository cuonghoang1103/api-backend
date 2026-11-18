# CT Lồng Tiếng — hợp đồng giữa web, trạm máy nhà và app (18/11/2026)

Chủ kênh: lồng tiếng Việt bằng GIỌNG CỦA MÌNH (cuong8) cho video kỹ thuật tiếng Trung/Anh để TỰ HỌC. Không đăng lại.
User chọn kiến trúc **"Trạm ở máy nhà"**: app trên Mac/Windows/Linux + trang web chỉ là đầu nhận việc / xem tiến độ / tải kết quả;
phần nặng (Demucs, Whisper, F5 cuong8) chạy ở máy nhà Linux (RTX 3060) hoặc máy GPU thuê nếu có (`LT_GPU=vast7`).
Bản mẫu chạy được trên Mac (đọc trước): `/Users/admin/Documents/long-tieng/lt.mts` + `lt-remote.py` (5 bước tach → nghe → dich → doc → tron).

## Ai dùng được
Chỉ tài khoản có vai ADMIN (giọng là của chủ kênh — không mở cho người khác). Kiểm vai như các tuyến admin hiện có.

## 1. API web — `/api/v1/long-tieng` (đăng nhập JWT, ADMIN) — dùng bởi trang web VÀ app
**Mọi phản hồi (cả mục 2) bọc kiểu chung của backend: `{ success: true, data: <như bảng> }`; lỗi `{ success: false, message, code? }`** (code dạng `LT_…`).
Xác thực app: **mã kết nối** tạo trên trang web (`POST /ma-ket-noi` ⇒ trả MỘT lần chuỗi `ctlt_…`, lưu băm; app gửi `Authorization: Bearer ctlt_…`). Thu hồi được.
Mã chết theo chủ: chủ mã mất vai ADMIN / bị khoá ⇒ 403; mã thu hồi / sai ⇒ 401. Mã kết nối KHÔNG tạo/xem/thu hồi được mã khác (403) — chỉ JWT.
| Tuyến | Việc |
|---|---|
| `GET /toi` | (thêm 18/11) kiểm mã/phiên: `{ userId, username, quaMa }` — app gọi lúc đăng nhập bằng mã |
| `POST /jobs` `{ url?, tep?: { ten, kichThuoc, kieu }, lang: 'auto'\|'zh'\|'en', goc: 0..0.4, tenVideo?, nhip?: 'cho-giong'\|'tang-toc', banRa?: 'ca-hai'\|'vi'\|'vi-goc', nhacNen?: { loai: 'goc'\|'thu-vien'\|'tep'\|'khong', id?, amLuong?: 0..1, tep?: { ten, kichThuoc, kieu } } }` | tạo việc ⇒ `201 { job, taiLen?, taiLenNhac? }`. Có `tep` ⇒ `taiLen: { url (PUT ký sẵn R2, sống 6 giờ), het, kieu }` — **PUT phải gửi header `Content-Type` đúng bằng `kieu`** (chữ ký có kiểu). Nhạc nền `tep` ⇒ `taiLenNhac` cùng khuôn. Còn tệp chờ ⇒ `trangThai = cho_tai_len`; PUT xong (cả video lẫn nhạc) gọi `POST /jobs/:id/da-tai-len`. Có `url` ⇒ trạm tự tải. Tệp ≤ 5 GB, nhạc ≤ 300 MB. |
| `GET /jobs` · `GET /jobs/:id` | danh sách (200 việc mới nhất) / chi tiết: `{ id, nguon: 'url'\|'tep', url, tep, tenVideo, lang, goc, nhip, banRa, nhacNen, trangThai: 'cho_tai_len'\|'cho'\|'tai'\|'lam'\|'xong'\|'loi'\|'huy', buoc, phanTram, loi, ketQua: [{ loai: 'vi'\|'vi-goc'\|'srt-vi'\|'srt-goc'\|'thong-tin', ten, kichThuoc, url }], thoiLuong, tao, xong, daTaiVe }`. `url` kết quả = GET ký sẵn 1 giờ, tải về đúng tên tiếng Việt; `null` khi đã tải về hoặc quá 7 ngày. |
| `GET /nhac` | (thêm 18/11) thư viện nhạc nền: `[{ id, ten, tamTrang, giay, nghiThu, nguon, giayPhep, tacGia }]` — `giay` = độ dài (giây), `nghiThu` = URL nghe thử TUYỆT ĐỐI ký sẵn (sống ≥ 60 phút, không cần header). Có thêm `thoiLuong`/`nghe` (cùng giá trị, trang web dùng). |
| `POST /jobs/:id/da-tai-len` | kiểm tệp đã lên kho (HEAD) ⇒ `cho`; thiếu ⇒ 409 `LT_CHUA_CO_TEP` / `LT_CHUA_CO_NHAC` |
| `POST /jobs/:id/thu-lai` | việc lỗi ⇒ về `cho` (giữ kết quả bước đã xong ở trạm) |
| `DELETE /jobs/:id` | huỷ / xoá việc + xoá MỌI tệp R2 của việc ⇒ `{ xoa, huy, soTep }`. Đang chạy ở trạm ⇒ đánh dấu `huy` (trạm nhận 410 ở nhịp tim kế tiếp rồi dừng); còn lại ⇒ xoá hẳn |
| `POST /jobs/:id/da-tai-ve` | app báo đã tải đủ ⇒ server xoá tệp kết quả trên R2 (không giữ bản sao video người khác lâu) |
| `GET /ma-ket-noi` · `POST /ma-ket-noi { ten? }` · `DELETE /ma-ket-noi/:id` | (chỉ JWT) danh sách `{ id, ten, dau, tao, dungLanCuoi, thuHoi }` / tạo ⇒ `{ id, ma, ten, dau, tao }` (`ma` hiện MỘT lần) / thu hồi. Tối đa 20 mã còn hiệu lực. |

Tệp R2: khoá riêng tư `long-tieng/<userId>/<jobId>/vao|ra/…` (jobId = UUID ngẫu nhiên; chỉ đi bằng URL ký). Dọn tự động (cron mỗi giờ,
phút 43): chờ tải lên > 24 giờ ⇒ xoá việc; `huy` > 1 ngày ⇒ xoá dòng; kết quả `xong` chưa tải về > 7 ngày ⇒ xoá tệp (giữ dòng);
`loi` > 7 ngày ⇒ xoá tệp vào; tệp mồ côi > 7 ngày ⇒ xoá. Tệp vào xoá ngay khi xong. `long-tieng/nhac/` (thư viện) không bao giờ bị dọn.

**Nhịp đọc (`nhip`, thêm 18/11 sau lượt chạy thử):** `cho-giong` (mặc định) — câu Việt dài hơn khe thì chỉ đọc nhanh tối đa
**1,08×**, phần còn thiếu KÉO DÀI HÌNH (đoạn video của câu đó chiếu chậm tới 2×, quá nữa thì giữ khung cuối) để hình và giọng khớp
nhau; video ra dài hơn bản gốc, nhạc nền gốc/giọng gốc của đoạn đó kéo theo (atempo, phần giữ khung thì lặng). `tang-toc` — như bản
mẫu: đọc nhanh tới 1,3×, video giữ nguyên độ dài. Lượt chạy thử 13 phút tiếng Trung: câu Việt dài hơn khe trung vị 1,07×, p90 1,30×,
max 1,72× ⇒ 77/103 câu bị đọc nhanh, 4 câu vẫn trễ — chủ kênh không thích đọc nhanh.

**Bản xuất ra (`banRa`, thêm 18/11 — chủ kênh không biết một việc ra HAI video):** `ca-hai` (mặc định, như trước) = `[VI]` (chỉ
giọng Việt) + `[VI + giọng gốc N%]` (song ngữ: giọng Việt + giọng người nói gốc vặn nhỏ `goc`) · `vi` = chỉ bản `[VI]` (trang web ẩn
thanh "giọng gốc") · `vi-goc` = chỉ bản song ngữ. Sai giá trị ⇒ 400 `LT_BAN_RA`. Trạm chỉ dựng + đẩy bản được chọn (bản kia không
trộn tiếng, `vi` còn khỏi kéo dải giọng gốc theo hình) ⇒ nhanh hơn; phụ đề `srt-vi`/`srt-goc` + `thong-tin.json` luôn có. Trạm cũ
không đọc trường này ⇒ vẫn ra cả hai (vô hại). Lưu ở cột `ban_ra` (migration `20261118140000_long_tieng_ban_ra`).

**Nhạc nền (`nhacNen`, thêm 18/11):** `goc` (mặc định, âm lượng 0,9) = nhạc/hiệu ứng gốc đã tách khỏi giọng (Demucs) · `thu-vien` =
một bài trong thư viện (`id` từ `GET /nhac`) · `tep` = nhạc người dùng tải lên · `khong` = không nhạc. Với `thu-vien`/`tep` (âm lượng
mặc định 0,3): lặp/cắt cho đủ độ dài video, vào/ra dần (2 s / 3 s), tự né giọng Việt (sidechaincompress). Thư viện: tệp +
`danh-sach.json` ở `long-tieng/nhac/` trên R2, mỗi bài ghi `nguon` (URL gốc) + `giayPhep`; chỉ nhận nhạc giấy phép cho dùng không
ràng buộc ghi công (CC0 / Pixabay Content License) — KHÔNG dùng bài hit có bản quyền. Nạp bằng `npx tsx scripts/long-tieng-nhac.mts` (`--thu` = chỉ tải + kiểm, không đẩy) từ `scripts/long-tieng-nhac.json`: 9 bài CC0 1.0 trên OpenGameArt (lo-fi, piano, synthwave, ambient; 25–474 s), trang nguồn + giấy phép từng bài ghi trong tệp đó.

## 2. API trạm — `/api/v1/internal/long-tieng` (header `x-internal-token` = `INTERNAL_API_TOKEN`, như `internal.routes.ts`)
Thiếu cấu hình / sai khoá ⇒ 404 (không lộ tuyến).
| Tuyến | Việc |
|---|---|
| `POST /nhan` | giành 1 việc `cho` (cũ nhất) ⇒ `{ job: { id, url, tep, tenVideo, lang, goc, nhip, banRa, nhacNen (+ ten bài thư viện), soLanNhan, tao }, vao?: { url GET ký sẵn }, nhac?: { url GET ký sẵn — bài thư viện hoặc tệp nhạc } }` hoặc 204. Việc `tai/lam` không nhịp tim > 20 phút ⇒ về `cho`; giành ≥ 5 lần vẫn mất nhịp ⇒ `loi`. |
| `POST /:id/tien-do` `{ trangThai: 'tai'\|'lam', buoc, phanTram, tenVideo? }` | nhịp tim + tiến độ. **Việc đã huỷ/xoá/xếp lại ⇒ 410 `LT_VIEC_KHONG_CON` ⇒ trạm DỪNG việc đó** (mọi tuyến `/:id/*` và `/dich` đều vậy) |
| `POST /:id/len-ket-qua` `{ tep: [{ loai, ten, kichThuoc, kieu? }] }` | ⇒ `{ tep: [{ loai, url, kieu, het }] }` URL PUT ký sẵn từng tệp (PUT với `Content-Type = kieu`; thiếu `kieu` ⇒ mặc định theo loại). Khoá theo LOẠI: `…/ra/<loai><đuôi>` |
| `POST /:id/xong` `{ thoiLuong, ketQua: [...], tenVideo?, buoc? }` · `POST /:id/loi` `{ loi }` | kết thúc. `xong` HEAD từng tệp (thiếu ⇒ 400), lấy kích thước thật, xoá tệp vào. `buoc` = dòng tóm tắt cuối (vd "103 câu · 3 câu đọc lại · 0 câu dưới ngưỡng"), thiếu ⇒ "Xong" |
| `POST /dich` `{ jobId, ngonNgu, cau: [{ i, giay, toiDa, src }] (≤ 60 câu), truoc: string \| string[] (~6 câu Việt liền trước), tuDien?: [{ goc, vi, ghiChu? }], choPhepThieu? }` | backend dịch một lô bằng **chuỗi cổng Claude** (18/11, `src/services/longTiengDich.ts`): gwai `claude-sonnet-5-5` → Anthropic chính hãng `claude-sonnet-5-5` (trần riêng `LONG_TIENG_CHINH_HANG_USD_NGAY`, mặc định 10 $/ngày, sổ `anthropic_usage.viec = long_tieng_dich`) → modelapi `gpt-6-sol`; tự chuyển bậc trong cùng yêu cầu khi lỗi/hết giờ/rỗng/JSON hỏng; structured outputs (`output_config.format` json_schema, không prefill, không temperature); log `[lt-dich]` ghi bậc đã phục vụ ⇒ `{ ds: [{ i, vi }] }`. Model bỏ sót câu ⇒ tự hỏi lại phần thiếu một lần; vẫn thiếu: `choPhepThieu` ⇒ 200 `{ ds, thieu: [i…] }` (trạm chỉ gửi lại phần thiếu), không ⇒ 502 `LT_DICH_THIEU`. |
| `POST /tu-dien` `{ jobId, ngonNgu, mau: string[] (≤ 400 câu rải đều cả bản chép) }` | (18/11, video dài) soạn TỪ ĐIỂN riêng của việc một lần qua cùng chuỗi cổng ⇒ `{ tuDien: [{ goc, vi, ghiChu? }] }` (≤ 150 mục, bỏ trùng). Trạm lưu `tu-dien.json` ở thư mục việc và gửi kèm mọi lô `/dich`. |

## 3. Trạm ở máy nhà (`linux-nha`, user Cuong03dx)
- Dịch vụ systemd --user `vbg-long-tieng.service` (Restart=always), mã ở `~/long-tieng/` (đồng bộ từ repo `tools/long-tieng-tram/` — cài đặt: README trong thư mục đó).
- Mỗi 10 s `POST /nhan`; chạy 5 bước của `lt.mts` NGAY TRÊN máy nhà: ffmpeg cục bộ; tải link bằng `yt-dlp` (YouTube có thể chặn máy nhà ⇒ thử qua máy GPU thuê nếu có, không vượt chặn — hỏng thì báo lỗi "Hãy tải video trên máy bạn rồi kéo vào app"); GPU: `LT_GPU=vast7` ⇒ ssh như bản mẫu, ngược lại GPU nhà với `flock ~/video-bai-giang/.khoa-gpu` (chung khoá với dây chuyền video bài giảng — *đính chính 18/11: khoá thật nằm ở `~/video-bai-giang/`, không phải `~/vbg-dp/`; `lam-giong.mts` chạy `cd ~/video-bai-giang && flock .khoa-gpu …`*). Dịch qua cổng LLM của web (trạm gọi `POST /api/v1/internal/long-tieng/dich` để backend dịch bằng `gateway.ts`, trạm không giữ khoá LLM).
- Mỗi bước ghi kết quả vào thư mục việc (`~/long-tieng/lam/<jobId>/`) ⇒ thử lại không làm lại bước đã xong; xong thì xoá thư mục. Nhịp tim mỗi 60 s kể cả lúc chờ GPU; nhận 410 ⇒ giết tiến trình con, dọn, quay lại hàng.
- Chống vỡ giọng (lỗi lượt chạy thử, `docs/so-loi.md`): đoạn Whisper > 8 s tách theo dấu câu / mốc từng từ trước khi dịch; câu Việt > 130 ký tự tách ở `. ? ! ; :` rồi `,`, đọc từng mẩu, ghép với lặng 0,4 s (sau `. ? ! ; :`) / 0,18 s (sau `,`) như "nhịp C" của video bài giảng. Độ dài dịch mục tiêu 13 ký tự / giây khe (bản mẫu 15).
- Đặt tên kết quả: `<Tên video> [VI].mp4`, `<Tên video> [VI + giọng gốc 15%].mp4` (chỉ những bản `banRa` chọn — `banCanDung()` trong `thuatToan.ts`), `<Tên video>.vi.srt`, `<Tên video>.<zh|en>.srt`, `thong-tin.json` (nguồn, link, ngôn ngữ, thời lượng, số câu, phiên bản trạm, ngày).

## 4. App "CT Lồng Tiếng" (Electron, Mac/Windows/Linux) — `apps/ct-long-tieng/`
- Đăng nhập bằng mã kết nối; dán link / kéo thả video (nhiều tệp) / chọn tuỳ chọn; hàng việc + tiến độ; TỰ TẢI kết quả về
  `<Thư mục tải>/CT Lồng Tiếng/<YYYY-MM-DD> <Tên video>/` rồi `POST da-tai-ve`; thư viện + trình phát (đổi bản VI ↔ VI+gốc giữ vị trí, phụ đề, tốc độ, ±10 s); thông báo hệ điều hành khi xong; cài đặt (thư mục, mặc định ngôn ngữ/giọng gốc, tự chạy cùng máy).
- Link mà trạm không tải được ⇒ app tự tải bằng yt-dlp trên máy người dùng rồi tải lên như tệp.
- Bản dựng: GitHub Actions `workflow_dispatch` ra dmg/zip (mac arm64+x64), exe NSIS (win), AppImage (linux) dạng artifact. Phát hành công khai: CHỜ chủ kênh duyệt.

## 5. Trang web `/admin/long-tieng` (ADMIN; `/long-tieng` chuyển hướng về đây)
Nằm trong khung admin (sidebar → Nội dung → CT Lồng Tiếng, hoặc ⌘K "lồng tiếng"). Cùng chức năng app (trừ tự tải vào thư mục): tạo việc bằng link hoặc tải tệp lên, tiến độ, tải kết quả, tạo/thu hồi mã kết nối app, nút tải app.
