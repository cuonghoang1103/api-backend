# Liên kết chéo Node.js Chương 10 (upload & object storage) ↔ Object Storage ↔ Media Processing ↔ API Design ↔ SDN302

Đợt 8b video Node.js, 01/11/2026. Deep link: `/courses/<slug-khoá>/learn?lessonSlug=<slug-bài>` (Courses: `nodejs`, `object-storage`, `media-processing`, `api-design`; Academy SDN302: `server-side-development-nodejs-express-mongodb`).
Khối `<a class="link-card lien-ket-cheo">` cuối `ml-en` và cuối `ml-vi`, HAI CHIỀU. Thẻ ở bài Node nói "Bạn đã học phần này ở …" / "Học sâu hơn ở …"; thẻ ở bài kia nói "Áp vào Node.js — bài 10.x".
Mọi bài đích viết tay (không có header FILE SINH TỰ ĐỘNG). Lời video (`src/bai/node-10-*/kichban.ts`) nhắc cùng các bài ở đúng cảnh và ghi trong `LIEN_KET`.
Số đo của Node đều chạy trên MinIO cục bộ (khoá giả) và sharp 0.35.5 — KHÔNG chạm bucket R2 thật; con số khác bài kia (máy, phiên bản) thì thẻ nói rõ.

| Node.js | Bài kia | Giống | Node.js thêm (đo thật, Node 22.23.3 + Express 5.3.0 + @aws-sdk 3.1161 + MinIO) |
|---|---|---|---|
| `nodejs-10-2-object-storage-presigned` | `object-storage/os-4-2-sigv4-bug` | PUT ký sẵn chỉ ký host ⇒ text/html dưới key video; signableHeaders ràng buộc Content-Type | 200 → 403 đo trên MinIO; kích thước không ký (120 MB vào URL "5 MB"), POST policy 400 EntityTooLarge, sửa key ⇒ SignatureDoesNotMatch, hạn 5 s |
| `nodejs-10-2-object-storage-presigned` | `api-design/api-8-3-mo-rong` | hai instance ⇒ thứ nằm trong một instance hỏng; file thuộc object storage | API S3 đo trên MinIO, bố trí key, upload ký sẵn (API chỉ nhận 41 byte) |
| `nodejs-10-3-kiem-file-that` | `media-processing/mp-2-1-svg` | SVG = XML chạy script; website từ chối ở hai cổng; vẽ ra điểm ảnh có rủi ro riêng | SVG qua ba lớp kiểm cạnh 4 tệp khác (chặn do tình cờ); sharp vẽ thành WebP 80×80, hết onload |
| `nodejs-10-3-kiem-file-that` | `media-processing/mp-1-2-metadata` | bom 758 KB = 256 MP; hạn mức điểm ảnh + giới hạn đồng thời (website: 100 MP, 4 ảnh) | đo lại trên sharp 0.35.5: +190 MB một quả, 8 quả +889 MB vs 8 ảnh thật +112 MB; 50e6 từ chối trong 1,4 ms |
| `nodejs-10-3-kiem-file-that` | `server-side-development-nodejs-express-mongodb/sdn302-5-2-jwt-cors` | Multer nhận file, trả file về | lời khai filename/đuôi/Content-Type, magic bytes, polyglot, mã hoá lại, bom, EXIF/GPS, tên gốc không vào đường dẫn |
| `nodejs-10-4-phuc-vu-media-cache` | `object-storage/os-3-2-cache` | public, max-age=31536000, immutable đặt lúc upload; key có phiên bản | header production thật; bẫy curl -I (HEAD ⇒ DYNAMIC, GET ⇒ HIT, age 26 → 33); 304 = 0 byte, 206 = 100 byte |
| `nodejs-10-4-phuc-vu-media-cache` | `object-storage/os-6-3-orphans` | không có khoá ngoại ⇒ đối soát, không phải luật vòng đời | 3 chỗ rò dựng lại trong MinIO, quét (5 object, 3 mồ côi, 2,21 MB), deleteByUrl bỏ qua URL ngoài, xoá object trước dòng |
| `nodejs-10-4-phuc-vu-media-cache` | `media-processing/mp-0-1-formats` | JPEG/WebP/AVIF đánh đổi cỡ với thời gian, tuỳ ảnh | ảnh mượt + ảnh nhiễu 4032×3024: thu nhỏ bỏ 88–98 %, WebP 2,8× vs 1,17×, AVIF chậm 4–7× |

**Đã có từ trước:** Node 10.1 ↔ SDN302 5.2 (`sdn302-nodejs.md`), Node 10.1 ↔ PRJ301 upload (một chiều từ Node).
**Chỉ nhắc trong lời video, CHƯA đặt thẻ web:** Object Storage 1.2 (bốn operation), 1.3 (multipart cho file lớn — lib-storage), 2.3 (access key), 3.1 (ba loại URL), 3.3 (signed URL riêng tư), 4.1 (vì sao upload thẳng), 5.1 (CORS cho PUT); Media Processing 0.2 (xử lý ở đâu), 1.4 (bẫy xoay EXIF), 5.1 (một cửa vào), 5.2 (thiết kế key); Node 2.4, 3.2, 3.3, 5.4, 9.1, 9.2, 9.4.
