# Code Lab — định dạng tệp đề (cho agent soạn đề)

> Nền tảng đợt Academy 28/10/2026 (KE-HOACH-CODELAB.md §8–§9). Đọc hết trang này trước khi soạn.
> Mẫu đầy đủ: bài nhỏ → `web-foundations-practice/nguon/*.mjs` · đề lớn ("bản in") → `fer202-practice/nguon/fer202-8-lab-movie-hooks.mjs`.

## 1. Cây thư mục

```
content/codelab/
├── _chung/deLon.mjs                 # bộ dựng "bản in" + demo tự chứa (dùng chung)
├── <track>/                         # vd fer202-practice, swt301-practice, swr302-practice
│   ├── _track.json                  # track + danh sách module (slug = slug BÀI HỌC Academy/khoá)
│   ├── nguon/<module-slug>.mjs      # NGUỒN SỰ THẬT — mỗi tệp một module (một bài học / một Lab chương)
│   └── <track>__<module-slug>.json  # SINH RA bằng script — đừng sửa tay
└── web-foundations-practice/        # track cũ, bộ xuất riêng: scripts/codelab-kiem-de-web.mjs
```

- **Module slug = slug bài học** (vd `fer202-8-ex12-usestate`) ⇒ thẻ "🏋️ Luyện tập" dưới video tự hiện.
- Lab / Deep Lab / PE / dự án của chương: module riêng, slug `<môn>-<chương>-lab-…` / `…-deep-…` / `…-pe-…`
  (số chương ở vị trí thứ 2 ⇒ trang track xếp đúng chương, sau các bài luyện).
- Môn mới phải có dòng trong `PRACTICE_CATALOG` + `PRACTICE_TRACK_BY_COURSE` (`src/services/codeLab.practice.ts`).

## 2. Một module (`nguon/<slug>.mjs`)

```js
import { doiDau } from '../../web-foundations-practice/nguon/_luoc-do.mjs';   // ´ ⇒ `   ·   @{ ⇒ ${
export default doiDau({
  slug: 'fer202-8-ex12-usestate',         // = tên tệp
  ten: '8.1 useState: counter & toggle',  // tên module ("N.M …" ⇒ trang track hiện số bài)
  khoa: 'front-end-web-development-with-react',   // slug khoá (videoRef)
  baiHoc: 'fer202-8-ex12-usestate',       // slug bài học có video (nút "📺 Bài giảng")
  de: [ /* 4–7 đề EASY → HARD, rồi (module Lab) một đề lớn */ ],
});
```

### Bài nhỏ (thẻ đề kiểu LeetCode)

Trường chữ nhận `'…'` hoặc `{ en: '…', vi: '…' }` — **tiếng Anh là chính** (§8.7), VI là nút "Tiếng Việt".

| Trường | Ý nghĩa |
|---|---|
| `tieuDe` | tiêu đề EN (slug sinh từ đây — đừng đổi sau khi lên prod) |
| `doKho` `phut` `diem?` | `EASY`/`MEDIUM`/`HARD`, phút ước lượng, điểm (mặc định 10/20/30) |
| `khaiNiem[]` `tienQuyet[]` `the[]` | concepts / prerequisites / tags |
| `moTa` · `yeuCau[]` | mô tả (HTML) + gạch đầu dòng Requirements |
| `dauVao` `dauRa` `rangBuoc[]` | Input / Output format · Constraints |
| `viDu[]` | `{ input, output, explanation }` (≥ 1) |
| `goiY[]` | gợi ý theo bậc (≥ 2, cái sau gần lời giải hơn) |
| `loiHayGap[]` | lỗi hay gặp THẬT (≥ 2) ⇒ tab "Lỗi hay gặp" |
| `thuatNgu[]` | `{ en, vi, giaiThich? }` ⇒ bảng thuật ngữ trong đề |
| `khoiDau` / `loiGiai` | `{ 'đường/dẫn': 'code' }` — tệp đầu mở trước; lời giải có chú thích, ≥ 200 ký tự, không `TODO`/`…` |
| `giaiThich` | VÌ SAO lời giải đúng (HTML) |
| `tests` | bộ kiểm — mục 3 |
| `dangBai` | `practice` (mặc định) · `lab` · `deep-lab` · `pe` · `project` |

### Đề lớn ("bản in", §8.6)

Thêm `banIn: { … }` (xem mẫu FER202) ⇒ bộ xuất dựng tờ đề EN + VI, thang điểm, demo:

`tieuDe, phu, moTa, chucNangChinh[], yeuCauChung[], cayThuMuc, wireframe, moHinh { ten, truong: [[tên, kiểu, ghi chú]] },
duLieuMau, chucNang: [{ ten, diem, moTa, yeuCau[], hook[], khoa?, viDu? }], idBatBuoc: [[selector, vai trò]], truDiem[], nopBai`

- Tổng `diem` các chức năng = **10** (như PE). Mỗi kiểm gắn `nhom: 'f1'…'fN'` theo thứ tự chức năng ⇒ bảng điểm
  "2. Search 1/1 · 6. Add 1.5/2".
- `demo: { tepChinh: 'src/index.js' }` (đề React) ⇒ `demoHtml` tự chứa từ LỜI GIẢI cho nút "▶ Live demo".
- Nút "⬇ Starter" = `khoiDau` (zip ngay trên trình duyệt) · "⬇ Tải đề PDF" = in tờ đề ra A4.
- **id/class máy chấm dùng phải in trong đề** (mục `idBatBuoc`) — người học không đoán.

## 3. Bộ kiểm (`tests`) — chạy TRONG TRÌNH DUYỆT

`loai` | chạy ở | kiểm
---|---|---
`dom` | iframe sandbox | trang HTML/CSS (+JS nếu `chayScript: true`). Lược đồ đủ: `web-foundations-practice/nguon/_luoc-do.mjs`
`js` / `console` / `module` | Worker | gọi hàm so sâu / so dòng console / ES modules (`_luoc-do.mjs` mục CH4–CH5)
`react` | iframe sandbox | `{ loai:'react', tepChinh:'src/index.js' \| renderTu:'src/App.js', thuVien?:['react-router-dom','react-bootstrap','bootstrap','prop-types'], fetchGia?, khoCucBo?, kiem }`
`choice` | thuần JS (máy chủ chấm lại) | `cauHoi: [{ ma, de, luaChon:[{ma,noiDung}], dapAn:['b'] \| [['a','c']], nhieu?, giaiThich?, nhom? }]`
`order` | thuần JS | `cauHoi: [{ ma, de, muc:[{ma,noiDung}] (thứ tự hiện), dapAn:['c','a','b'], giaiThich? }]`
`table` | thuần JS | `bang: [{ ma, de, cot:[{ma,ten,luaChon?,phanBietHoa?}], hang:[{ma,o:{cot:'giá trị cho sẵn'}}], dapAn:{'<hàng>.<cột>': 'đáp án' \| ['các','đáp án']}, giaiThich?, nhom? }]` — mỗi ô đáp án là một kiểm (SWT301: phân vùng, giá trị biên, bảng quyết định…)
`sql` (29/10/2026) | Worker (PGlite) | SQL chạy thật trên PostgreSQL 18 (WASM) ở **chế độ SQL Server** — mục 3b
`java` `tsql` `bash` `sql-pg` `python` `text-ai` | — | **chưa chấm** (máy chủ nhà / AI — đợt sau); giao diện ghi "sắp có", người học tự đánh dấu

Kiểm chung: `{ moTa, kiem, an?: true (kiểm ẩn — chỉ khi Nộp), nhom?: 'f1', truoc?: [bước], choToiDa?: ms }`.

**Bước `truoc`** (dom có script + react): `click` · `nhap` (gõ — React thấy) · `doi` (select/change) · `chon-o` (checkbox) ·
`gui` (submit form) · `phim` · `focus` · `cho {ms}` · `tai-lai` (react: tải lại app, GIỮ localStorage — kiểm "lưu bền").
Form gửi đi không `preventDefault` ⇒ máy chấm mô phỏng TẢI LẠI TRANG như trình duyệt.

**Loại kiểm DOM** (đủ ở `_luoc-do.mjs`): `ton-tai` `khong-ton-tai` `so-luong` `text` `thuoc-tinh` `css` `kich-thuoc` `so-cot`
`ti-le-cot` `co-nhan` `neo-hop-le` `tieu-de` `thu-tu` `hop-le` `thuoc-tinh-js` `console` `khong-loi-js` `khong-tai-lai`
`ma-nguon` + MỚI 28/10: `danh-sach-text {selector, mongDoi:[…]}` · `focus {selector}` (tự focus) ·
`kho-cuc-bo {khoa, mongDoi? | khop? | doDai? | tonTai?}` (localStorage) · `goi-fetch {khop:'GET /api/x', min?, max?}`.

Khung chấm: localStorage/sessionStorage GIẢ (bắt đầu rỗng, hoặc `khoCucBo`), `confirm()` ⇒ true (`confirm:false` để đổi),
`alert()` ghi vào console, `fetch` GIẢ khi có `fetchGia` (cùng giao ước máy chấm JS), link ngoài không điều hướng.

**Mở rộng 29/10/2026 (bộ luyện FER202 — đề PE):**
- **React Router**: khung srcdoc không `pushState` được ⇒ `BrowserRouter`/`HashRouter`/`createBrowserRouter` tự chạy bằng
  bộ nhớ (MemoryRouter). `url: '/subjects?status=ACTIVE'` (trên `tests` hoặc từng kiểm) = URL mở đầu; vị trí GIỮ qua `tai-lai`.
  Kiểm **`duong-dan` {giaTri | khop}** so URL hiện tại (pathname + search) — vd sau khi lưu phải về `/sneakers`.
- **json-server GIẢ có trạng thái**: `tests.jsonServer = { base: 'http://localhost:9999', db: { subjects: […], … } }` ⇒
  GET/POST/PUT/PATCH/DELETE như json-server 0.17 (lọc `?field=v`, `_sort/_order`, `_limit/_page`, `q`, `_like/_gte/_lte/_ne`,
  `_expand/_embed`, id mới = max+1). POST rồi GET thấy bản ghi mới; dữ liệu sống qua `tai-lai`. `fetchGia` (nếu khớp) thắng. `treMs` (≤ 2000) = độ trễ giả để kiểm "đang tải"; danh sách có header `X-Total-Count` (axios giả trả `headers`). Kiểm có thể khai `jsonServer` riêng (vd db thiếu bảng ⇒ 404 để kiểm trạng thái lỗi).
  Kiểm **`du-lieu-server` {bang, doDai | chua:{…} | khongChua:{…}}** soi dữ liệu máy chủ; **`goi-fetch` thêm `than:{…}`** (body JSON chứa các trường đó). Cả hai so giá trị nguyên thuỷ LỎNG kiểu (3 khớp "3"); thêm `chat: true` để bắt đúng kiểu (số phải là số).
- **`.env`** trong bài ⇒ `process.env.REACT_APP_*` (CRA) và `import.meta.env.VITE_*` (Vite) đọc được.
- **Thư viện**: `thuVien` thêm `@reduxjs/toolkit` (1.9.7 UMD — `redux` trỏ cùng) · `react-redux` (8.1.3); `redux-thunk` có sẵn.
  Đừng kiểm CSS tính toán của Bootstrap (app desktop nạp CSS bất đồng bộ) — kiểm class/cấu trúc.
- Demo (`demo: { tepChinh, url?, jsonServer? }` — mặc định lấy `tests.jsonServer/url`): json-server giả + thanh địa chỉ (app có router).
- `choice`/`order`/`table`: bộ kiểm trình duyệt tự dựng câu trả lời đúng từ `dapAn` (không cần `dapAnMau`); vẫn cần `khoiDau`/`loiGiai`
  (vd `answers.md`) vì bộ xuất bắt buộc.

## 3b. Máy chấm SQL (`loai: 'sql'`, 29/10/2026)

Mã: `frontend/src/components/code-lab/cham/` — `chamSql.ts` (điều phối) · `sqlRunner.ts` (bộ chạy PGlite dùng chung
worker web / khung hộp cát app / Node) · `sqlSoSanh.ts` (so bảng) · `sqlLoi.ts` (tách câu, phương ngữ, gợi ý lỗi).
Test: `npx tsx --test frontend/src/components/code-lab/cham/sql.test.ts`. Mẫu đề: `dbi202-practice/nguon/*.mjs`.

```js
tests: { loai: 'sql', csdl: '<DDL + INSERT kiểu SQL Server — như DBscript.sql của PE>', tepChinh: 'query.sql', timeoutMs?: 8000, kiem: [
  { kiem: 'ket-qua',   moTa, thuTu?, tenCot?, boQuaThuTuCot?, saiSo?, nullBang?: 'rong', tep?, csdl?, themCsdl?, an?, nhom? },
  { kiem: 'sau-lenh',  moTa, kiemTra: 'SELECT …' /* chạy SAU mã người học: DML, DDL, VIEW */, …như trên },
  { kiem: 'bi-chan',   moTa, thu: 'INSERT …', maLoi?: '23505' },   // câu thử PHẢI bị CSDL từ chối (23505 trùng · 23503 FK · 23502 NOT NULL · 23514 CHECK · 44000 CHECK OPTION)
  { kiem: 'chay-duoc', moTa, thu: 'INSERT …' },                    // câu hợp lệ phải chạy được
  { kiem: 'ma-nguon',  moTa, khop, phuDinh?, tep },                // regex (chú thích -- đã bỏ)
]}
```

- **`mongDoi` KHÔNG viết tay**: `codelab-xuat-de.mjs` chạy LỜI GIẢI qua đúng bộ chạy này trong Node (PGlite ghim bản, tự
  cài vào `~/.cache/cuongthai-pglite/<bản>` lần đầu — `scripts/codelab-sql-node.mjs`) rồi ghi bảng kết quả vào JSON.
  Lời giải có cú pháp riêng một hệ ⇒ bộ xuất từ chối. `saiMau: ['SQL sai…']` (hoặc `{ 'Q3.sql': '…' }`) = các câu SAI
  mẫu (đúng lỗi trong `loiHayGap`) — bộ xuất chạy thử, mỗi câu phải trượt ≥ 1 kiểm (không ghi vào JSON).
- **Mỗi kiểm cô lập**: `BEGIN` → dữ liệu mẫu → mã người học → kiểm → `ROLLBACK`; catalog lệch (COMMIT lén…) ⇒ dựng CSDL mới.
  Kiểm ẩn nên **đổi dữ liệu** (`themCsdl`) để bắt lời giải chép cứng.
- **Giới hạn**: ≤ 20 000 ký tự, ≤ 40 câu, không BEGIN/COMMIT/ROLLBACK, ≤ 2 000 dòng/bảng, mỗi kiểm ≤ `timeoutMs` (quá ⇒ huỷ worker).
- **Phương ngữ — phương án (a) "tập con ANSI chung", không dịch mã người học** (đầu `sqlLoi.ts`):
  - Đề + lời giải viết bằng SQL chạy GIỐNG nhau trên SQL Server 2019+ và PostgreSQL. Cú pháp chỉ T-SQL (TOP, ISNULL,
    GETDATE, YEAR(), IDENTITY, NVARCHAR, `[tên]`, biến `@`, procedure…) ⇒ báo "chấm bằng máy chủ SQL Server — sắp có";
    chỉ PostgreSQL (LIMIT, ILIKE, `::`, `||`, TRUE/FALSE, NATURAL JOIN, ORDER BY trong truy vấn con/view, GROUP BY bí danh…)
    ⇒ báo "SQL Server sẽ từ chối", không tính đạt.
  - Cùng cú pháp, khác kết quả ⇒ GIẢ LẬP SQL Server: cột **NVARCHAR** của dữ liệu mẫu nạp thành CITEXT (so chuỗi, LIKE,
    ORDER BY không phân biệt hoa thường; có toán tử riêng cho hằng `N'…'`), AVG trên INT/BIGINT cắt phần lẻ, PRIMARY KEY
    nạp thành UNIQUE NOT NULL (PostgreSQL thôi nới GROUP BY theo khoá chính).
  - Soạn dữ liệu mẫu: chữ người đọc ⇒ NVARCHAR; mã/khoá (người học sẽ tạo khoá ngoại tới) ⇒ VARCHAR/CHAR (giữ nguyên,
    phân biệt hoa thường — citext ≠ char thì PostgreSQL từ chối khoá ngoại).
  - Còn lệch, KHÔNG giả lập: NULL khi ORDER BY (SQL Server NULL đứng đầu, PostgreSQL đứng cuối) ⇒ kiểm `thuTu: true` không
    để NULL trong khoá sắp xếp; thứ tự chữ có dấu tiếng Việt ⇒ đừng kiểm thứ tự theo tên có dấu (sắp theo số/mã).
    UNIQUE cho NHIỀU NULL (PostgreSQL) vs MỘT NULL (SQL Server) ⇒ dữ liệu kiểm tránh. information_schema (`data_type`) là
    tên kiểu của PostgreSQL — chỉ dùng trong `kiemTra`, không bắt người học viết.
- **Máy chủ không chấm lại** (như loại code khác): trình duyệt báo kết quả, máy chủ kiểm hình dạng ⇒ tiến độ cá nhân.
  Không chạy PGlite trên VPS — mã người học không bao giờ chạy cạnh Postgres thật.
- **CSP**: không phải sửa. Web: `script-src` đã có `cdn.jsdelivr.net` + `'unsafe-eval'` (biên dịch WASM), `connect-src`
  jsdelivr (tải .wasm/.data), `worker-src blob:`. App desktop: worker blob bị CSP renderer chặn ⇒ chạy trong khung hộp cát
  `hop-cat-khung.html` (CSP riêng đã có jsdelivr + `'unsafe-eval'`).
- **Đề lớn SQL** (Lab/PE): `deLonSql()` trong `dbi202-practice/nguon/_chung.mjs` — mỗi câu một tệp `Q1.sql … Qn.sql` như quy
  định PE, kiểm câu i tự gắn `tep: 'Qi.sql'` + `nhom: 'fi'`; `moHinh` nhận MẢNG bảng.

## 4. Lệnh

```bash
# 1. xuất JSON (kiểm trường: ≥1 ví dụ, ≥2 gợi ý, ≥2 lỗi hay gặp, ≥3 kiểm, nhóm thang điểm khớp…)
node scripts/codelab-xuat-de.mjs --track fer202-practice [--chi <module>]
# 2. CHẤM THẬT bằng Chromium dưới CSP của web: lời giải đạt 100% · code khởi đầu trượt ≥ 1  (BẮT BUỘC xanh)
npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track fer202-practice [--chi <module>] [--chi-tiet]
npx tsx scripts/codelab-kiem-cham-trinh-duyet.mjs --track fer202-practice --app     # giả lập CSP app desktop
# 3. nạp (máy chủ: trong container backend, sau deploy). Track mới tạo trước bằng create-track.
node scripts/codelab-create-track.mjs --file content/codelab/<track>/_track.json --apply
node scripts/codelab-seed-authored.mjs --dir content/codelab/<track> --apply --update   # --update: sửa tại chỗ, GIỮ tiến độ/lượt nộp
```

Web Foundations: `node scripts/codelab-kiem-de-web.mjs --xuat` (jsdom) rồi cũng chạy bước 2.
