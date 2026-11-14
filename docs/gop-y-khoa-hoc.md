# Góp ý & bổ sung cho khoá học (14/11/2026)

Mọi khoá (Courses lẫn FPTU Academy — Academy dùng chung trang `/courses/<slug>`) có nút thứ ba ở hero
**"Góp ý & bổ sung"** ⇒ trang `/courses/<slug>/gop-y`. Chuyên gia, thầy cô, học viên — hoặc một AI/agent — viết
vào đó khi thấy bài thiếu kiến thức, sai, có liên tưởng hay, hay muốn nâng cấp khoá.

**Ô góp ý NHANH trong trang học (14/11/2026)** — ngay dưới video (bài không có video: ở đáy bài, trên nút bài
trước/sau): 4 chip **🔊 Đọc sai / vấp · 🤔 Chưa hiểu chỗ này · ➕ Cần bổ sung · 🐞 Lỗi khác**; bấm chip ⇒ **mốc video
(mm:ss) + track đang xem (VI/EN/YT) tự điền** từ player thật, gõ vài chữ, Enter. Ngay dưới là danh sách góp ý của bài
(mọi người, mới nhất trước, trạng thái + kết quả đối chiếu, "của bạn"); bấm mốc ⇒ tua video tới đó. Mục đích: điều phối
sửa đúng BÀI, đúng VỊ TRÍ (tập video + câu lời đọc) — xem "Xử lý góp ý có mốc video" bên dưới.

Việc quan trọng nhất là **ĐỐI CHIẾU**: góp ý đó đã có trong bài chưa (bài nào), có đúng không, có đáng bổ sung không
⇒ lên kế hoạch nâng cấp khoá. Người đối chiếu đầu tiên là **Claude điều phối**, qua `scripts/gop-y/*`.

## Thành phần

| Lớp | Tệp |
|---|---|
| Bảng | `course_suggestions` + `course_suggestion_votes` (`prisma/migrations/20261114120000_course_suggestions`); 4 cột mốc video `thoi_diem_giay` · `nguon_video` · `tu_sai` · `nen_doc` (`20261114190000_course_suggestions_thoi_diem`, chỉ ADD COLUMN nullable) |
| Dịch vụ | `src/services/courseSuggestion.service.ts` (Zod, chặn trùng, trần 5/giờ/người — 20 với ô nhanh, báo admin) |
| Công khai + admin | `src/routes/courseSuggestion.routes.ts` (mount trong `course.routes.ts` và `admin.routes.ts`) |
| Đường máy | cuối `src/routes/internal.routes.ts` (header `x-internal-token` = `INTERNAL_API_TOKEN`) |
| Giao diện | `frontend/src/components/courses/gop-y/GopYKhoaClient.tsx`, `frontend/src/app/courses/[slug]/gop-y/page.tsx`, `frontend/src/lib/gopYKhoa.ts` |
| Ô góp ý nhanh | `frontend/src/components/courses/gop-y/GopYNhanhBai.tsx`, cắm trong `frontend/src/app/courses/[slug]/learn/LearnPageClient.tsx` (player đăng ký `BoDieuKhienVideo` = đọc mốc + tua) |
| Script | `scripts/gop-y/keo.mjs` · `ghi.mjs` · `dang.mjs` · `_video.mjs` (mốc ⇒ tập ⇒ câu lời đọc) |
| Test | `WORK_DB_TEST=1 npx tsx --test src/routes/courseSuggestion.db.test.ts` |

## API

| Tuyến | Ai | Ghi chú |
|---|---|---|
| `GET /api/v1/courses/:slug/suggestions` | ai cũng được (AI bên ngoài đọc ở đây) | `?trangThai=A,B&loai=&lessonId=&page=&limit=≤100&sapXep=moi\|phieu`; ẩn `AN` trừ admin; không lộ email |
| `GET /api/v1/courses/:slug/suggestions/dem` | ai cũng được | `{ tong, theoTrangThai }` |
| `GET /api/v1/courses/:slug/suggestions/:id` | ai cũng được | link sâu `?id=` |
| `POST /api/v1/courses/:slug/suggestions` | đăng nhập | `{ vaiTro, laAi?, tenAi?, loai, noiDung (10–5000), nguon? (http/https), lessonId?\|lessonSlug?, thoiDiemGiay? (0–86400), nguonVideo? (VI\|EN\|YT), tuSai? (≤300), nenDoc? (≤300) }` ⇒ 409 `GOP_Y_KHOA_TRUNG` nếu trùng nội dung trong khoá, 429 sau 5 góp ý/giờ. **`nhanh: true`** (ô trong trang học): bắt buộc `lessonId\|lessonSlug`; `noiDung` 0–2000 — trống được nếu có mốc hoặc `tuSai` (máy chủ tự soạn `Đọc sai "X" — nên đọc "Y" ở 3:12` / `Chưa hiểu ở 3:12`), còn không thì ≥ 3 ký tự; trần 20/giờ |
| `POST /api/v1/courses/:slug/suggestions/:id/vote` | đăng nhập | bật/tắt "Tôi cũng thấy cần" ⇒ `{ daBau, soPhieu }` |
| `GET /api/v1/admin/course-suggestions` | admin | mọi khoá, `?courseSlug=` |
| `PATCH /api/v1/admin/course-suggestions/:id` | admin | `{ trangThai?, ketQuaDoiChieu?, bangChung?, nguoiDoiChieu? }` |
| `GET/PATCH/POST /api/v1/internal/course-suggestions[/:id]` | `x-internal-token` | như trên; POST đăng dạng `AI_AGENT` (bắt buộc `tenAi`, `courseSlug`) |

**Trạng thái:** `MOI` → `DANG_DOI_CHIEU` → một trong `DA_CO` · `NEN_BO_SUNG` · `KHONG_CHINH_XAC` · `TRUNG`;
`NEN_BO_SUNG` → `DA_LEN_KE_HOACH` → `DA_BO_SUNG`. `AN` = ẩn (spam/không phù hợp), chỉ admin thấy.
**Loại:** `THIEU_KIEN_THUC` · `SAI_SOT` · `LIEN_TUONG` · `NANG_CAP` · `KHAC` · `DOC_SAI` (giọng đọc sai / vấp) ·
`KHONG_HIEU` (chưa hiểu chỗ này) — hai loại cuối thêm 14/11 cho ô góp ý nhanh, trang chung cũng chọn được.
**Mốc video** (mọi đường đọc đều trả): `thoiDiemGiay` (giây từ đầu video, null = không gắn) · `nguonVideo` (track lúc
góp ý) · `tuSai` / `nenDoc` (loại DOC_SAI) · `cuaBan` (góp ý của người đang xem). Link mốc ở trang chung:
`/courses/<slug>/learn?lessonId=<id>&t=<giây>&track=VI` (trang học mở bài, chọn track, tua tới mốc).
**Chặn trùng:** góp ý có mốc / `tuSai` ⇒ vân tay = nội dung + bài + mốc + track + từ (câu "Chưa hiểu" ở 2 mốc khác nhau
không bị coi là trùng); góp ý thường giữ vân tay cũ (chỉ nội dung).
**Bằng chứng** (`bangChung`): mảng `{ lessonSlug | lessonId, tieuDe, trichDoan, tep? }` — trang hiện link
`/courses/<slug>/learn?lessonSlug=…` (hoặc `?lessonId=`) tới đúng bài.

Góp ý mới ⇒ hộp thư admin (`baoAdmin`, loại `GOP_Y`, chuông /admin + Telegram nếu đã cắm), link
`/courses/<slug>/gop-y?id=<id>`, nội dung kèm `⏱ 3:12 (VI)` khi có mốc; loại `SAI_SOT` / `DOC_SAI` ⇒ mức "cần xử lý".

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

### Xử lý góp ý có mốc video (ô góp ý nhanh)

`keo.mjs` gắn thêm cho mỗi góp ý có `thoiDiemGiay`: `mocVideo` (mm:ss), `nguonVideo`, `tuSai`, `nenDoc` và
**`viTriVideo`** — ánh xạ mốc ⇒ tập ⇒ câu (`scripts/gop-y/_video.mjs`, chỉ chạy trên Mac có kho video):

```jsonc
"viTriVideo": {
  "timThay": true, "tap": "ts-16-6",            // id kịch bản: ~/Documents/video-bai-giang/src/bai/<tap>/kichban.ts
  "phan": 2, "tongPhan": 3, "lechPhanGiay": 546.3, // chỉ có khi video web là bản GHÉP nhiều phần (…-tron)
  "giayTrongTap": 10, "mocTrongTap": "0:10",
  "viTri": "trong-cau",                          // trong-cau | giua-cau (khoảng lặng SAU câu) | mo-dau | truoc-cau-dau | man-ket
  "canhId": "on", "canhTen": "…", "cauId": "on-0",
  "cau":   { "id", "a", "b", "moc": "0:05–0:12", "hien": "chữ hiện", "doc": "chữ ĐƯA CHO GIỌNG", "nghe": "Whisper nghe ra" },
  "truoc": { … }, "sau": { … },                  // ±1 câu (người học hay bấm ngay SAU chỗ vấp ⇒ xem cả câu trước)
  "tepKichBan": "…/kichban.ts", "tepThoiGian": "…/public/bai/<tap>/thoigian.json",
  "canhBao": ["thoigian.json sửa SAU lần đẩy R2 …"], "ghiChu": ["bài dùng CHUNG video của …"]
}
```

- **Cách tính mốc** (đã đo 14/11 trên 2.205 tập): `a`/`b` trong `thoigian.json` là giây TUYỆT ĐỐI của video đã render —
  màn mở đầu `moDau` (4,6 s) đã nằm trong đó; video thật dài hơn `tong` ~5,27 s (màn kết). Nên mốc player = mốc
  `thoigian.json`, không cộng trừ. Video ghép `-tron`: mỗi phần chiếm `thoiLuongGiay + đuôi` (đuôi suy từ bản ghép).
- **`canhBao`** = giọng đã làm lại SAU lần render/đẩy R2 (`thoigian.json` mới hơn `r2Goc`, hoặc thời lượng lệch > 2 s):
  video người học xem có thể là bản cũ ⇒ câu ánh xạ có thể lệch, nghe lại tại mốc trước khi sửa.
- **Không ánh xạ được** ⇒ `timThay: false` + `lyDo` (track YT = video tuyển chọn của tác giả khác; EN chưa có bản lồng
  tiếng; bài chưa có video của kênh; không có kho video trên máy…).

**Quy trình "🔊 Đọc sai / vấp" (`DOC_SAI`):**
1. `node scripts/gop-y/keo.mjs --nhan --loai DOC_SAI` ⇒ mở `viTriVideo.tepKichBan`, so `cau.doc` (chữ giọng đọc) với
   `cau.nghe` (Whisper nghe ra) và `tuSai`/`nenDoc` của người học. Nghe lại video tại mốc nếu còn nghi.
2. Kiểm `giong/doc-tay.json` trước — **cách đọc chủ kênh đã chọn bằng tai là luật**, không ép khác đi (nếu người học
   góp ý ngược với doc-tay ⇒ `KHONG_CHINH_XAC`, ghi lý do).
3. Sửa luật đọc: thêm `[W('từ'), 'phiên âm']` vào mảng luật riêng của tập (vd `DOC_DU_AN` cuối `kichban.ts`, áp bằng
   `apDocTsMoi(CANH, [...])`) — từ lặp ở nhiều tập của khoá thì thêm vào `src/khung/<khoá>/doc.ts`. Vấp/ngắt sai mà
   không phải lỗi từ ⇒ viết lại câu `hien` cho dễ đọc (thêm dấu phẩy, tách câu) hoặc ghi `doc` riêng cho câu đó.
   Nhớ luật phiên âm tránh âm tục (memory `feedback_phien_am_tranh_tu_tuc`).
4. `bash scratchpad/dp-lam-lai.sh <tap> giong` (trong `~/Documents/video-bai-giang`) ⇒ Linux đọc lại giọng ⇒ soát ⇒
   render lại.
5. Ghi kết quả: `trangThai: DA_BO_SUNG`, `ketQuaDoiChieu: "Đã sửa luật đọc 'X' → 'Y' ở <tap> (<cauId>); đã lồng tiếng
   lại, chờ render + đẩy R2"`, `bangChung: [{ lessonSlug, tieuDe, tep: "<tepKichBan>", trichDoan: "<câu doc mới>" }]`.
   Render + `xuat/len-r2.mts` + `xuat/gan-web.mts` + deploy xong thì sửa lại ghi chú thành "đã lên web".

**"🤔 Chưa hiểu" / "➕ Cần bổ sung"** có mốc: đọc câu `cau.hien` + cảnh `canhTen` để biết đúng đoạn đang giảng ⇒ đối
chiếu bài web (`tepBai`) như quy trình chung; nên sửa ⇒ `NEN_BO_SUNG` kèm `bangChung.tep` = `tepKichBan` + `cauId`
(sửa cả lời giảng của tập lẫn bài web, rồi `dp-lam-lai.sh <tap> giong`). **"🐞 Lỗi khác"** (hình, chữ slide, âm thanh,
code trong video) ⇒ xem cảnh `canhId` trong `kichban.ts` / slide của tập.

**Đăng góp ý của chính AI** (vd thấy lỗ hổng khi soạn khoá khác):
`node scripts/gop-y/dang.mjs --khoa nodejs --loai NANG_CAP --bai nodejs-5-3-middleware --noi-dung "…"`.

## Chưa làm / ghi chú

- Không có trang tổng ở `/admin` — admin xử lý ngay trên `/courses/<slug>/gop-y` (khung "Đối chiếu (admin)" trong từng
  thẻ) hoặc qua script. Thông báo admin dẫn thẳng tới góp ý.
- Trần chống spam: 5 góp ý/giờ/người ở trang chung, **20/giờ/người với ô góp ý nhanh** (cùng MỘT bộ đếm trong CSDL —
  ai đã gửi ≥ 5 góp ý nhanh trong giờ thì trang chung tạm chặn, thông báo chỉ sang ô nhanh) + 60 lượt POST/giờ/IP (nâng
  từ 30: một người tới 20 góp ý nhanh, cả lớp chung IP trường) + 120 phiếu/10 phút/IP. Đường internal không có trần người.
  Lý do nới cho ô nhanh: một lượt xem video 15 phút có thể vấp 5–10 chỗ, mỗi chỗ một dòng ngắn gắn mốc — trần 5 chặn
  đúng người học chăm nhất; mỗi góp ý vẫn phải nằm trong bài có thật của khoá + chặn trùng theo mốc.
- Ô góp ý nhanh đọc mốc từ `<video>` (DIRECT, track VI/EN) và YouTube IFrame API (`getCurrentTime`/`seekTo`, track YT).
  Iframe nhúng khác (không phải YouTube) không cho đọc mốc ⇒ người học gõ tay mm:ss.
- App desktop: tuyến `/courses/:slug/learn` đã có (`desktop/src/renderer/features/web/dinhTuyenWeb.ts` ⇒
  `trangKhoaHocApp.KhoaHocHoc` ⇒ chính `LearnPageClient`) ⇒ KHÔNG cần tuyến mới. Nhưng app ĐÓNG GÓI mã web lúc dựng ⇒ ô
  góp ý nhanh chỉ có trong app sau lần phát hành app CuongThai kế tiếp (`cd desktop && npm run phat-hanh -- "…"`).
- Cột phân loại là VARCHAR (theo lệ bảng `courses`), giá trị hợp lệ chốt bằng Zod trong service.
