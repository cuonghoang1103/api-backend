# Góp ý & bổ sung cho khoá học (14/11/2026)

Mọi khoá (Courses lẫn FPTU Academy — Academy dùng chung trang `/courses/<slug>`) có nút thứ ba ở hero
**"Góp ý & bổ sung"** ⇒ trang `/courses/<slug>/gop-y`. Chuyên gia, thầy cô, học viên — hoặc một AI/agent — viết
vào đó khi thấy bài thiếu kiến thức, sai, có liên tưởng hay, hay muốn nâng cấp khoá. Trang học có link nhỏ
**"Góp ý cho bài này"** (điền sẵn bài, `?lessonId=`).

Việc quan trọng nhất là **ĐỐI CHIẾU**: góp ý đó đã có trong bài chưa (bài nào), có đúng không, có đáng bổ sung không
⇒ lên kế hoạch nâng cấp khoá. Người đối chiếu đầu tiên là **Claude điều phối**, qua `scripts/gop-y/*`.

## Thành phần

| Lớp | Tệp |
|---|---|
| Bảng | `course_suggestions` + `course_suggestion_votes` (`prisma/migrations/20261114120000_course_suggestions`) |
| Dịch vụ | `src/services/courseSuggestion.service.ts` (Zod, chặn trùng, trần 5/giờ/người, báo admin) |
| Công khai + admin | `src/routes/courseSuggestion.routes.ts` (mount trong `course.routes.ts` và `admin.routes.ts`) |
| Đường máy | cuối `src/routes/internal.routes.ts` (header `x-internal-token` = `INTERNAL_API_TOKEN`) |
| Giao diện | `frontend/src/components/courses/gop-y/GopYKhoaClient.tsx`, `frontend/src/app/courses/[slug]/gop-y/page.tsx`, `frontend/src/lib/gopYKhoa.ts` |
| Script | `scripts/gop-y/keo.mjs` · `ghi.mjs` · `dang.mjs` |
| Test | `WORK_DB_TEST=1 npx tsx --test src/routes/courseSuggestion.db.test.ts` |

## API

| Tuyến | Ai | Ghi chú |
|---|---|---|
| `GET /api/v1/courses/:slug/suggestions` | ai cũng được (AI bên ngoài đọc ở đây) | `?trangThai=A,B&loai=&lessonId=&page=&limit=≤100&sapXep=moi\|phieu`; ẩn `AN` trừ admin; không lộ email |
| `GET /api/v1/courses/:slug/suggestions/dem` | ai cũng được | `{ tong, theoTrangThai }` |
| `GET /api/v1/courses/:slug/suggestions/:id` | ai cũng được | link sâu `?id=` |
| `POST /api/v1/courses/:slug/suggestions` | đăng nhập | `{ vaiTro, laAi?, tenAi?, loai, noiDung (10–5000), nguon? (http/https), lessonId?\|lessonSlug? }` ⇒ 409 `GOP_Y_KHOA_TRUNG` nếu trùng nội dung trong khoá, 429 sau 5 góp ý/giờ |
| `POST /api/v1/courses/:slug/suggestions/:id/vote` | đăng nhập | bật/tắt "Tôi cũng thấy cần" ⇒ `{ daBau, soPhieu }` |
| `GET /api/v1/admin/course-suggestions` | admin | mọi khoá, `?courseSlug=` |
| `PATCH /api/v1/admin/course-suggestions/:id` | admin | `{ trangThai?, ketQuaDoiChieu?, bangChung?, nguoiDoiChieu? }` |
| `GET/PATCH/POST /api/v1/internal/course-suggestions[/:id]` | `x-internal-token` | như trên; POST đăng dạng `AI_AGENT` (bắt buộc `tenAi`, `courseSlug`) |

**Trạng thái:** `MOI` → `DANG_DOI_CHIEU` → một trong `DA_CO` · `NEN_BO_SUNG` · `KHONG_CHINH_XAC` · `TRUNG`;
`NEN_BO_SUNG` → `DA_LEN_KE_HOACH` → `DA_BO_SUNG`. `AN` = ẩn (spam/không phù hợp), chỉ admin thấy.
**Loại:** `THIEU_KIEN_THUC` · `SAI_SOT` · `LIEN_TUONG` · `NANG_CAP` · `KHAC`.
**Bằng chứng** (`bangChung`): mảng `{ lessonSlug | lessonId, tieuDe, trichDoan, tep? }` — trang hiện link
`/courses/<slug>/learn?lessonSlug=…` (hoặc `?lessonId=`) tới đúng bài.

Góp ý mới ⇒ hộp thư admin (`baoAdmin`, loại `GOP_Y`, chuông /admin + Telegram nếu đã cắm), link
`/courses/<slug>/gop-y?id=<id>`; loại `SAI_SOT` ⇒ mức "cần xử lý".

## Quy trình đối chiếu (Claude điều phối)

Cần khoá: `INTERNAL_API_TOKEN` (cùng giá trị với `/opt/cuonghoangdev/.env` trên VPS) trong env, hoặc một dòng trong
`~/.config/cuongthai/internal-api-token`. Gốc mặc định `https://cuongthai.com` (đổi bằng `GOP_Y_API`). Script không
bao giờ in khoá.

1. **Kéo:** `node scripts/gop-y/keo.mjs --nhan` ⇒ `scripts/gop-y/.cho/gop-y-cho.json` (không commit). `--nhan` đặt
   `MOI → DANG_DOI_CHIEU` để phiên khác không làm trùng. Mỗi mục có `tepKhoa` / `thuMucKhoa` (nội dung khoá trong
   `content/courses/…` hoặc `content/academy/…`) và `tepBai` (tệp chứa đúng slug bài, nếu góp ý gắn bài).
2. **Đọc góp ý, rồi tìm trong khoá** — không kết luận khi chưa grep:
   - `tepBai` có ⇒ đọc bài đó trước; rồi `grep -rn "<từ khoá>" <thuMucKhoa>` cho cả khoá (khái niệm hay nằm ở chương khác).
   - Tìm theo cả tiếng Việt lẫn tiếng Anh, theo tên hàm/lệnh/thuật ngữ. Nhớ khoá liên quan (Academy ↔ Courses liên kết chéo).
3. **Kết luận** — mỗi mục một trong:
   - `DA_CO` — đã có: `bangChung` **bắt buộc** (bài + trích đoạn nguyên văn chứng minh), `ketQuaDoiChieu` nói ngắn
     "đã có ở 5.3, đoạn …".
   - `NEN_BO_SUNG` — chưa có / có nhưng hời hợt, và góp ý đúng + đáng: ghi lý do + **bài nên chèn** (đưa vào `bangChung`
     với `trichDoan: "(nên chèn sau đoạn …)"`).
   - `KHONG_CHINH_XAC` — góp ý sai: ghi **nguồn chứng minh** (tài liệu chính thức, chạy thử thật) trong `ketQuaDoiChieu`.
   - `TRUNG` — trùng góp ý khác: ghi `#id` góp ý gốc.
   - Chưa chắc ⇒ để `DANG_DOI_CHIEU`, ghi điều cần kiểm thêm vào `ketQuaDoiChieu`.
   Kiểm chứng bằng chạy thật khi được (mã, lệnh) — "đọc thấy hợp lý" chưa phải bằng chứng.
4. **Ghi:** soạn `ket-qua.json` (xem đầu `scripts/gop-y/ghi.mjs`), `node scripts/gop-y/ghi.mjs ket-qua.json --thu` rồi
   bỏ `--thu`. Script từ chối `DA_CO` thiếu bằng chứng và các kết luận thiếu lý do.
5. **Lên kế hoạch:** `node scripts/gop-y/keo.mjs --trang-thai NEN_BO_SUNG` (xếp theo số phiếu) ⇒ gom theo khoá/bài thành
   việc nâng cấp; xếp vào kế hoạch thì đặt `DA_LEN_KE_HOACH`; soạn xong + deploy ⇒ `DA_BO_SUNG` (kèm `bangChung` trỏ
   đoạn mới).

**Đăng góp ý của chính AI** (vd thấy lỗ hổng khi soạn khoá khác):
`node scripts/gop-y/dang.mjs --khoa nodejs --loai NANG_CAP --bai nodejs-5-3-middleware --noi-dung "…"`.

## Chưa làm / ghi chú

- Không có trang tổng ở `/admin` — admin xử lý ngay trên `/courses/<slug>/gop-y` (khung "Đối chiếu (admin)" trong từng
  thẻ) hoặc qua script. Thông báo admin dẫn thẳng tới góp ý.
- Trần chống spam: 5 góp ý/giờ/người (đếm CSDL) + 30 lượt POST/giờ/IP + 120 phiếu/10 phút/IP. Đường internal không có trần người.
- Cột phân loại là VARCHAR (theo lệ bảng `courses`), giá trị hợp lệ chốt bằng Zod trong service.
