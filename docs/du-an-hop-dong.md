# Hợp đồng dữ liệu "Dự án xuyên suốt khoá" (v1, 21/11/2026)

Đọc cùng `docs/du-an-xuyen-suot-khoa.md` (đặc tả trải nghiệm). Tệp này chốt TÊN TRƯỜNG để agent hạ tầng và agent nội dung
làm song song không lệch nhau. Đổi hợp đồng ⇒ sửa tệp này trước, báo điều phối.

## 1. Trong tệp khoá (Courses `content/courses/<slug>.mjs` hoặc Academy `content/academy/<MÃ>.mjs`)
Thêm khoá `duAn` ở CẤP GỐC của default export (cạnh `course`/`sections`; Academy: cạnh các trường khoá hiện có):

```js
duAn: {
  version: 1,
  gioiThieu: 'EN html|||VI html',          // "Học xong khoá này bạn làm được gì" + vì sao làm dự án xuyên suốt + cách chấm
  deTai: [                                  // ≥ 5 đề tài
    {
      slug: 'shop-sneaker',                 // [a-z0-9-], duy nhất trong khoá
      ten: 'EN|||VI',
      moTa: 'EN|||VI',                      // 2–4 câu: sản phẩm là gì, ai dùng
      doKho: 1 | 2 | 3,
      tinhNang: ['EN|||VI', …],             // 6–12 tính năng chính
      banDoChuong: [ { moc: 1, dung: 'EN|||VI' }, … ],   // mốc nào xây phần nào của đề tài này
      thamKhaoThat: ['EN|||VI', …],         // sản phẩm thật tương tự ngoài đời (không link bịa)
      anh: 'https://…' | null,              // ảnh/khung giao diện mẫu nếu có
    },
  ],
  tuChon: {                                 // tiêu chí AI dùng để duyệt đề tài tự chọn
    yeuCauToiThieu: ['EN|||VI', …],         // vd "≥ 3 trang có điều hướng", "có form kiểm lỗi", "gọi API thật"
    goiYQuyMo: 'EN|||VI',
  },
  moc: [                                    // một mốc / chương (hoặc cụm chương), theo thứ tự học
    {
      so: 1,
      slug: '<prefix>-moc-1',               // = slug của BÀI mốc trong sections (xem §2)
      ten: 'EN|||VI',
      sauChuong: '<tiêu đề hoặc số chương>',
      yeuCau: ['EN|||VI', …],               // bắt buộc — viết CHUNG cho mọi đề tài ("trang danh sách sản phẩm/khoá học/sách… của đề tài bạn")
      nangCao: ['EN|||VI', …],              // tuỳ chọn
      datKhi: ['EN|||VI', …],               // tiêu chí kiểm được
      goiY: ['EN|||VI', …],                 // gợi ý theo tầng, không lộ lời giải trọn
      nop: ['repo', 'demo', 'anh'],         // thứ người học nộp (link repo/commit, link demo, ảnh)
    },
  ],
  baoVe: {
    rubric: [ { tieuChi: 'EN|||VI', diem: 2, moTa: 'EN|||VI' }, … ],   // tổng 10
    cauHoiMau: ['EN|||VI', …],              // ≥ 15 câu hội đồng hay hỏi
    chuanBi: ['EN|||VI', …],                // checklist trước buổi bảo vệ
  },
}
```

## 2. Bài mốc trong `sections`
Mỗi `duAn.moc[i]` có một BÀI thật trong đúng chương (thường là bài cuối chương, trước quiz chương):
`{ title: '🛠 Project milestone N — …|||🛠 Mốc dự án N — …', slug: <đúng duAn.moc[i].slug>, type: 'EXERCISE', mocDuAn: N, content: '<html ml-en/ml-vi>' }`.
`content` trình bày yêu cầu/nâng cao/đạt khi/gợi ý cho người đọc; khối nộp bài do frontend vẽ khi thấy `mocDuAn`.
Bài "Bắt đầu tại đây"/giới thiệu môn: thêm cuối nội dung câu *"Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới"*
và thuộc tính `dangKyDuAn: true` trên bài đó (frontend vẽ khối "🎯 Đăng ký đề tài" dưới bài có cờ này).
Cuối khoá: một bài `{ slug: '<prefix>-bao-ve-du-an', type: 'EXERCISE', baoVeDuAn: true, … }` (hoàn thiện + phòng bảo vệ AI).
KHÔNG đổi/xoá slug bài cũ; bài mới slug mới.

## 3. Quiz tiếng Anh kiểu FE
Quiz chương bổ sung theo đúng định dạng quiz hiện có của khoá (`type: 'QUIZ'`, `quiz: { timeLimitSeconds, questions: [{ id, question, options, correctIndex, points?, explanation? }] }`),
câu hỏi + đáp án TIẾNG ANH như đề FE thật của trường (có thể kèm `|||` bản Việt cho phần giải thích). Mỗi chương ≥ 10 câu,
đề cuối khoá ≥ 40 câu. Đáp án phải đúng — kiểm bằng chạy code thật khi câu hỏi về code.

## 4. Lưu DB — ĐÃ CHỐT (hạ tầng, 21/11/2026)
Migration viết tay `prisma/migrations/20261121120000_du_an_xuyen_suot_khoa` (chỉ THÊM 4 bảng, không đụng bảng cũ).

**Nội dung khoá — `course_project_specs`** (1:1 với `courses`, `course_id` unique · `noi_dung` jsonb · `van_tay` sha256).
- KHÔNG làm cột `courses.du_an`: Prisma trả mọi cột vô hướng khi không `select` ⇒ một jsonb 50–150 KB sẽ đi kèm mọi
  truy vấn danh sách/thẻ khoá.
- Seed (`scripts/course-seed.mjs` bước 5, `scripts/academy-seed-course.mjs` bước 6) gọi `scripts/lib/du-an.mjs`:
  `kiemDuAn()` kiểm **ngay đầu** (Academy: sau khi ghép Mục 0 FLM) rồi chuẩn hoá. Đọc `duAn` ở gốc default export
  (chấp nhận cả `course.duAn`); sections ở gốc hoặc `course.sections`.
- **Cờ bài KHÔNG thành cột của `lessons`.** Seed gom chúng vào `noi_dung.bai = { dangKy: [slug], baoVe: [slug] }`;
  bài mốc nhận ra bằng `noi_dung.moc[].slug`. Frontend tra vai trò bài theo slug (`vaiTroBai()` trong
  `frontend/src/lib/duAn.ts`). ⇒ bảng `lessons`/`courses` và vân tay seed cũ không đổi một byte.
- Idempotent: vân tay không đổi ⇒ không ghi (`= duAn: không đổi`). Tệp bỏ hẳn `duAn` ⇒ xoá spec (tiến độ người học
  ở bảng riêng, không mất).
- **Kiểm gắt, báo to** (bài học 21/11): lỗi ⇒ in `✗ duAn: …` (deploy.sh bắt `✗`), KHÔNG ghi spec (giữ bản cũ), phần
  còn lại của khoá VẪN seed, tiến trình thoát mã 1 ⇒ `report_seed` báo [WARN] đúng tệp. Lỗi gồm: có cờ bài mà thiếu
  `duAn`; < 5 đề tài; slug đề tài/mốc sai dạng hoặc trùng; `moc[].slug` không khớp bài thật / `mocDuAn` lệch số; bài có
  `mocDuAn` không nằm trong `duAn.moc`; mốc không tăng dần; `banDoChuong[].moc` trỏ mốc không có; thiếu
  `yeuCau`/`datKhi`; `nop` ngoài repo|demo|anh; thiếu `tuChon.yeuCauToiThieu`; rubric tổng ≠ 10; `cauHoiMau` < 5;
  thiếu `chuanBi`; không bài nào `dangKyDuAn` / `baoVeDuAn`. Cảnh báo (`! duAn:`, vẫn ghi): `tinhNang` ngoài 6–12,
  `cauHoiMau` < 15, bài mốc không phải EXERCISE, thiếu `banDoChuong`, version ≠ 1, JSON > 256 KB.
- Mặc định khi thiếu: `nop` ⇒ `['repo']`; `nangCao`/`goiY`/`banDoChuong`/`thamKhaoThat` ⇒ `[]`; `anh` ⇒ null.
- Thử trước khi deploy: `node scripts/course-seed.mjs --file content/courses/<khoá>.mjs --dry` (hoặc
  `academy-seed-course.mjs`) — dòng `✗ duAn:` nói đúng chỗ sai. Test: `node --test scripts/lib/du-an.test.mjs`.

**Dữ liệu người học** (khoá theo slug bài mốc, KHÔNG theo lessonId):
- `course_project_choices` — 1 dòng / người / khoá: `de_tai_slug` (gợi ý) HOẶC `tu_chon` {ten, moTa, tinhNang} (chỉ vào
  đây khi AI DUYỆT); `ai_duyet` (lần duyệt gần nhất, kể cả CAN_SUA, kèm bản đã gửi `ban`); `luot_duyet` (đếm trần/ngày);
  `lich_su` (đề tài đã bỏ, 30 bản); `chot_luc`. Đổi đề tài KHÔNG xoá mốc đã nộp.
- `course_project_milestones` — 1 dòng / người / khoá / `moc_slug`: `trang_thai` DANG_LAM | XONG, `repo_url`,
  `demo_url`, `anh_url`, `ghi_chu`, `tu_kiem` (chỉ số "Đạt khi" đã tick), `de_tai_ten` (đề tài lúc nộp), `nop_luc`,
  `xong_luc`. XONG đòi: link repo/demo nếu `nop` có, tick đủ `datKhi` (máy chủ kiểm).
- `course_project_defences` — mỗi phiên một dòng: `trang_thai` DANG_HOI | DA_CHAM | BO_DO, `de_tai` (ảnh chụp),
  `phien` [{role, content, luc}], `so_cau`, `diem` (/10, MÃ cộng từ `diem_chi_tiet` đã kẹp theo rubric — không tin tổng
  của model), `diem_chi_tiet`, `nhan_xet` {chung, diemManh, canCaiThien}. Phiên dở quá 24 h ⇒ BO_DO.

**API** (`src/routes/courseProject.routes.ts`, mount `/api/v1/courses/:slug/du-an`): `GET /` (công khai + "của tôi"),
`POST /chon` {deTaiSlug} | {tuChonDaDuyet:true}, `POST /tu-chon` (AI duyệt), `POST /moc/:mocSlug`, `POST /bao-ve`
(+ `/bao-ve-stream` SSE), `GET /bao-ve/:id`, `POST /bao-ve/:id/tra-loi` (+ `/tra-loi-stream`), `/hoi-lai`, `/ket-thuc`.

**AI** (`src/services/llm/gateway.ts`): `du_an_duyet` = `gpt-6-luna` (trần ra 900, effort low),
`du_an_bao_ve` = `gpt-6-sol` (≤ 450/lượt hỏi, 1.800 lượt chấm, effort low). Trần (env, mặc định):
`DU_AN_DUYET_LUOT_NGAY=5`, `DU_AN_BAO_VE_PHIEN_NGAY=2`, `DU_AN_BAO_VE_SO_CAU=6`, `DU_AN_BAO_VE_MOC_TOI_THIEU=1`;
cộng trần token/người/ngày + trần tiền/ngày chung của web. Ước: duyệt ~0,004–0,006 $/lượt, bảo vệ ~0,03–0,06 $/phiên.
Không chấm code repo bằng AI (để sau).
