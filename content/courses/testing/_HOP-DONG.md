# Hợp đồng soạn khoá "Testing" (/courses/testing)

> Đọc HẾT file này trước khi soạn một chương mới. Viết 01/11/2026 sau Mục 0 + Chương 1 (đợt mẫu, `bdd965397`) và Chương 2
> (`73346c69c`); cập nhật khi xong Chương 3–4. **Bài mẫu độ dài chuẩn (từ Ch3):** Chương 3–4 — `testing/s03-*.mjs`, `s04-*.mjs` +
> deck `tst-03-*`, `tst-04-*`, `tst-lab-3/4`. Chỗ nào file này không nói, bắt chước đúng các file đó.

## 0. Khoá này là gì, dạy ai

- Người học: SV SE FPT kỳ 5 đang học **SWT301** (lý thuyết ISTQB, Report 5.x, JUnit), đã/đang học **SDN302** (Node/Express),
  sắp làm **Spring Boot**. Tiếng Anh yếu ⇒ **giảng tiếng Việt; thuật ngữ Anh luôn kèm giải nghĩa** — lần đầu xuất hiện ghi
  `fake timers (bộ hẹn giờ giả)`, các lần sau dùng thẳng.
- Khoá **tự đủ** (không cần SWT301 để hiểu), đi từ số 0 → chuyên sâu, **DỄ HIỂU là tiêu chí số 1**.
- Mọi ví dụ **CHẠY THẬT** trên dự án xuyên khoá **LabFlow Lite** (mục 3). Không bịa output, không "khoảng chừng" khi đo được.
- Thực chiến: mỗi chương có bug thật do test tìm ra (Ch2: đặt trùng phòng do tranh chấp, bug múi giờ UTC+7), có sự cố/bẫy
  hay gặp khi đi làm, có đối chiếu JUnit/Spring Boot khi hữu ích.

## 1. Cây file

| File | Vai trò |
|---|---|
| `content/courses/testing.mjs` | Khoá. `sections: [s00, s01, s02, ...khung('tst', [...]).slice(K)]` — thêm chương N ⇒ import `sNN`, chèn vào mảng, tăng `slice(K)` lên 1. Cập nhật chú thích đầu file. |
| `testing/sNN-<ten>.mjs` | Chương: `title` **GIỮ NGUYÊN như khung** (seeder neo chương bằng tiêu đề), `description`, `lessons: [...]`. |
| `testing/sNN/<bai>.mjs` | Một bài (`slug`, `type`, `isFreePreview`, `title` EN\|\|\|VI, `description` tiếng Việt, `content`). |
| `testing/sNN/_ma.mjs` | `CODE` (mã nguồn) + `OUT` (output chạy thật) — **SINH TỰ ĐỘNG**, không sửa tay (mục 3.3). |
| `testing/giang/<deck>.mjs` | Lời giảng EN/VI dưới từng slide: `walkTst(deck, tênEN, tênVI, [[n, 'Tiêu đề slide', '<p>EN</p>', '<p>VI</p>'], …])`. |
| `testing/_slides.mjs` | `walkTst`, `ma(lang, src)`, `ra(output)`, `lienKet({...})`, `nguon(...)`, bảng **`VER`**. Chỉ sửa `VER`. |
| `testing/_labflow-lite/` | **Ảnh chụp dự án LabFlow Lite** (không có node_modules) ở cuối chương mới nhất đã soạn: `src/` (code + bộ test tham khảo), `demo/`…`demoN/` (thí nghiệm từng chương — có test CỐ Ý hỏng), `test/` (support, integration), `scripts/dot-bien*.mjs`, `openapi.json` (Ch5). |
| `testing/_de-codelab-mutation.json` | Đề Code Lab kiểu **mutation** dự kiến (mục 7). |
| `scripts/slides-src/_tst-chung.mjs` | Khuôn slide (chép từ `_pg-chung.mjs`). Chỉ sửa khi thật cần, và nhớ: đổi khuôn ⇒ deck đã đẩy phải lên prefix mới. |
| `scripts/slides-src/tst-NN-M.mjs`, `tst-lab-N.mjs` | Deck từng bài / lab chương. |
| `scripts/tst/` | `chay.sh` (chụp output), `sinh-ma.mjs` (sinh `_ma.mjs`), `kiem-slide.mjs` (kiểm TRÀN/TRỐNG), `ghep-anh.mjs` (ghép 2×2 để soát), `kiem-de-mutation.mjs` (kiểm đề mutation). |
| `content/_LIEN-KET-CHEO/swt301-testing.md` | Bảng liên kết chéo SWT301 ↔ Testing (mục 6). |

## 2. Khung một chương

- 4 bài dạy giữ **slug khung** `tst-N-M-<ten>` (M = 1..4, xem `khung(...)` trong `testing.mjs`; Mục 0 dùng 8/9 cho 2 bài "Bắt đầu tại đây").
- **Lab chương** (bài MỚI): slug `tst-N-5-lab-<ten>`, có thang chấm 10 điểm (đạt 7) + máy chấm là script đột biến.
- **Quiz chương** (bài MỚI): slug `tst-N-6-quiz`, `type: 'QUIZ'`, 10 câu tình huống, **đáp án rải** (mỗi chữ A–D 2–3 lần, ghi phân bố
  ở chú thích đầu file), `explanation: 'EN: …|||VI: …'` nói vì sao đúng VÀ vì sao đáp án sai hấp dẫn nhất lại sai.
- Bài (`type: 'LESSON'`, `isFreePreview: true`), `content` theo thứ tự:
  1. `${G}` — phần "📑 Học theo slide" (import từ `giang/`).
  2. `<div class="ml-en">`: `eyebrow` → `h2` → `p.lead` → các mục `h3` (mã `ma()`, output `ra()`, bảng, `div.pitfall.co-tieu-de` cho bẫy)
     → **🧪 Practice (15 minutes)** trong `div.callout.ok` (đề + **lời giải + output thật** + "Done when") → **🗂 Key terms** (`div.kv-grid`)
     → **📌 Summary** → thẻ `lienKet(...)` nếu có (mục 6). `</div>`
  3. `<div class="ml-vi">` — bản tiếng Việt **đầy đủ tương đương** (không tóm tắt), cùng mã/output.
- **Độ dài (điều phối chốt 01/11): 25–40k ký tự/bài kể cả phần giảng slide** — đủ ý nhưng gọn; chủ đề thật sự lớn thì TÁCH 2 bài.
  Ch2 (45–68k) là quá dài, đừng chép độ dài đó. Cách gọn: 10–11 slide/bài, lời giảng 40–70 từ/slide, output dài thì LỌC dòng bằng hằng
  ở đầu file (vd `const gon = (t) => t.split('\n').filter((l) => /✓|×|Tests /.test(l)).join('\n')`) — chỉ bỏ dòng, không sửa chữ.
- Mỗi bài nên có: một bug/bẫy THẬT chạy ra đỏ, một bảng tóm "khi nào dùng gì", một đoạn đối chiếu JUnit/Spring khi có ích.

### Luật chữ trong template literal (bộ kiểm `scripts/course-content-check.mjs` bắt)
- Trong thân `` `...` ``: **không backtick, không `\`**, `${` chỉ dùng cho nội suy thật. Biểu thức có `'\n'` (vd `CODE.x.split('\n')`)
  ⇒ đưa ra **hằng ở đầu file**, không viết trong `${…}` của thân.
- HTML: `<` `>` `&` trong chữ thường ⇒ `&lt;` `&gt;` `&amp;` (kể cả `=&gt;` trong `<code>`). `ma()`/`ra()` tự thoát.
- Kiểm: `node scripts/course-content-check.mjs content/courses/testing.mjs` và `.../testing/sNN-*.mjs` ⇒ 0 lỗi.

## 3. LabFlow Lite — dự án xuyên khoá

### 3.1 Dựng lại môi trường (scratch, KHÔNG làm trong repo)
```bash
cp -r content/courses/testing/_labflow-lite <SCRATCH>/lab/labflow-lite
cd <SCRATCH>/lab/labflow-lite && npm ci            # Node 22 (chuẩn: 22.23.3), Vitest 5.0.5, fast-check 4, Express 5, Supertest 7
npm run test:unit                                   # = vitest run src/ · 85 passed (cuối Ch5) — đây là “unit suite”
npm run test:int -- test/integration                # 11 passed — cần Docker (Testcontainers, postgres:17)
for s in dot-bien dot-bien-2 dot-bien-3 dot-bien-4 dot-bien-5; do node scripts/$s.mjs | tail -1; done   # 5 × 8/8
```
- ⚠️ `npm test` = `vitest run` chạy CẢ `demo*/` (có test cố ý đỏ) ⇒ bài/slide/lab luôn ghi **`npm run test:unit`** (script `"test:unit": "vitest run src/"`,
  giới thiệu ở phần Setup của Lab 1, dùng nhất quán Ch1–Ch5 từ 01/11 theo yêu cầu điều phối). Không viết “npm test xanh”.
- Ch5: `src/api/` (server.js `createApp({ repo, auth })`, auth.js jose HS256 + `now`, schemas.js Zod `strictObject`, main.js `listen` — test
  KHÔNG import main.js), `test/support/api.js` (`makeApi({ now })` ⇒ app + repo + `bearer(id, role)`, `body()`), `test/support/contract.js`
  (Ajv2020 + formats, `contractErrors(method, path, res)`), `openapi.json` (3.1). Supertest TỰ mở/đóng một cổng tạm — đừng viết “không mở cổng”.
  Test hết hạn token: đồng hồ cố định ở 2030 (`makeApi({ now: () => clock })`); jose coi đúng mốc `exp` là đã hết hạn.
- Ch4: `vitest.integration.config.js` (include `test/integration/**`, `demo4/**/*.int.test.js`; `globalSetup`; `fileParallelism: false`),
  `vitest.config.js` loại `test/integration/**` và `demo4/**`. `TEST_DATABASE_URL` có ⇒ dùng CSDL đó (compose `compose.test.yml`, cổng 54329);
  không ⇒ Testcontainers. `TST_SCHEMA` đổi file schema (demo). Test tích hợp nhận URL bằng `inject('databaseUrl')` (`test/support/db.js`).
- Test tranh chấp trên CSDL thật: mở sẵn 2 kết nối (`Promise.all([pool.query('SELECT 1'), …])`) — pool nguội thì lượt 2 chậm vì
  bắt tay kết nối và tranh chấp KHÔNG xảy ra (đo 01/11). File test tích hợp nào cũng `TRUNCATE` một lần ở `beforeAll` (rollback không
  huỷ được dòng file khác đã commit — đo được: 20/20 đỏ).
- Cổng: kiểm `lsof -i :PORT` trước khi chọn (54330 trên máy soạn bị đường hầm SSH chiếm ⇒ báo sai mật khẩu khó hiểu).
- `vitest.config.js`: `reporters: ['tree']`, `expect: { requireAssertions: true }`. Ch2 dạy thêm `restoreMocks: true` (Lab 2 yêu cầu).
- `src/` = code thật + **bộ test tham khảo** (lời giải các lab, luôn xanh). `demo/`, `demo2/`, … = thí nghiệm từng bài, có test CỐ Ý ĐỎ
  ⇒ CI/script đột biến chỉ chạy `src/`. Chương N mới ⇒ thư mục `demoN/`, file thực hành `demoN/thNM.test.js`.
- Code mới của chương ⇒ đặt trong `src/` đúng chỗ, giữ nguyên các file chương trước (script đột biến tìm đúng dòng).
- Xong chương ⇒ **cập nhật lại ảnh chụp** `_labflow-lite/` (rsync bỏ `node_modules`), kiểm lại cả 3 lệnh ở trên.

### 3.2 Chụp output thật
```bash
TST_NODE_BIN=~/.nvm/versions/node/v22.23.3/bin \
  bash scripts/tst/chay.sh <SCRATCH>/lab/labflow-lite npx vitest run demo3/abc.test.js > <SCRATCH>/out3/31-abc.txt
```
- In `$ lệnh`, output (đường dẫn tuyệt đối → `…/labflow-lite`), `[exit N]` (bị cắt khi sinh `_ma`). Tên file `.txt` = khoá `OUT`.
- Agent AI chạy Vitest: biến `AI_AGENT`/`CLAUDECODE` tắt watch mode; muốn chụp watch thì unset chúng (đã gặp ở bài 0.2).
- Số đo ngẫu nhiên (test chập chờn, thời gian) ⇒ đo thật, ghi đúng số đo; đo ≥ 2 lần nếu dạy về xác suất (Ch2: 86/14 và 82/18).
- Lệnh phụ thuộc múi giờ ⇒ chụp cả `TZ=UTC` và `TZ=Asia/Ho_Chi_Minh`.

### 3.3 Sinh `_ma.mjs`
Viết `<SCRATCH>/mapN.json` rồi `node scripts/tst/sinh-ma.mjs <SCRATCH>/mapN.json`:
```json
{ "duAn": "<SCRATCH>/lab/labflow-lite", "out": "<SCRATCH>/out3", "dich": "content/courses/testing/s03/_ma.mjs", "chuong": 3,
  "code": { "service": "src/booking/service.js", "stubDemo": "demo3/stub.test.js" } }
```
Đã kiểm: map tương đương của Chương 2 sinh ra `s02/_ma.mjs` **giống từng byte** phần thân. Sửa code/test ⇒ chụp lại output ⇒ sinh lại.
Trích một đoạn của file (vd chỉ class lỗi) ⇒ hằng ở đầu file bài: `const DONG = CODE.service.split('\n'); const X = DONG.slice(2, 9).join('\n');`.

## 4. Slide

- Deck: `scripts/slides-src/tst-NN-M.mjs` (bài M chương N, NN 2 chữ số) và `tst-lab-N.mjs`. `export const deck = { key, code: 'TST N.M', title, sub }`,
  `export const slides = lamDeck({ chuong: 'Chapter N — …', bai: 'N.M' | 'Lab N' }, [...])`. Nhãn góc: `bai` bắt đầu bằng chữ (`'Lab 2'`) in nguyên,
  số (`'2.1'`) in `Lesson 2.1` (sửa 01/11 — trước đó in "Lesson Lab 1").
- Slide: `{ cover: true, t, sub }` · `{ t, body, to?: true (chữ 28px), giua?: true (căn giữa dọc) }`. Tiêu đề `t` ≡ tiêu đề dòng giảng trong `giang/` (bỏ `<br>`).
- Helper (`_tst-chung.mjs`): `js(src, { hl: [dòng], sm, fs })` mã JS · `vt(text, { title, fs, sm })` terminal Vitest (✓ xanh, ×/FAIL đỏ) ·
  `two(a, b, 'r64'?)` hai cột · `box(tiêuĐề, html, 'lam'|'xanh'|'do2')` · `steps([...])` · `flow([{ t, s, mau }], { h, fs })` ·
  `c('code')` mã trong dòng · `zm(html, 1.1)` phóng · `pyr(...)` kim tự tháp · `tbl`, `cards`, `kw`, `vsd` (như khuôn PG).
- Luật: **FULL TIẾNG ANH** (cả chú thích trong code mẫu ⇒ code trong dự án viết comment tiếng Anh), logo CuongThai.com, **KHÔNG logo/tên FPT**,
  chữ thân 24–28px, mã ≤ ~14 dòng/khối, output trên slide = output thật (được cắt bớt bằng `…`), lấp đều khung (không để nửa dưới trống).
- **Kiểm TỰ ĐỘNG mọi deck trước khi render/upload** (yêu cầu điều phối 01/11):
  `node scripts/tst/kiem-slide.mjs scripts/slides-src/tst-NN-M.mjs` ⇒ phải `0 slide có vấn đề`. Nó đo **TRÀN** (scrollWidth/scrollHeight của
  pre/bảng/terminal/hộp/cột, và từng dòng chữ trong khối mã vượt mép) và **TRỐNG** (nội dung < 70% chiều cao vùng thân). Có tự kiểm bộ kiểm.
  Cách sửa quen: dòng mã dài ⇒ xuống dòng/rút gọn; terminal hai cột tràn ⇒ xếp dọc; trống ⇒ `to/giua`, `zm`, thêm ví dụ/hình.
- Render + soát bằng MẮT: `node scripts/_render-slides.mjs --deck scripts/slides-src/<deck>.mjs --out <SCRATCH>/final` ⇒
  `node scripts/tst/ghep-anh.mjs <SCRATCH>/final/<deck> <SCRATCH>/sheets` ⇒ mở TỪNG ảnh ghép. Đối chiếu số trên slide với output thật
  (Ch2 bắt được nhiều chỗ sai kiểu "22 test trong 4 file" — thật ra 5 file; "rò sang file test sau" — thật ra chỉ rò trong cùng file).
- **Upload** (chủ ý chạm bucket R2 thật): `node --env-file=.env scripts/upload-academy-slides.mjs --dir <SCRATCH>/final --prefix TST/v1 --decks <deck,…>`
  ⇒ `images/academy/TST/v1/<deck>/NNN.webp`. **KHÔNG GET URL media.cuongthai.com trước khi đẩy** (Cloudflare cache luôn cái 404).
  Deck đã đẩy mà phải dựng lại ⇒ đẩy sang `TST/v2` (v3…) và ghi `VER = { '<deck>': 'v2' }` trong `_slides.mjs` — đừng ghi đè v1.
  Hiện (01/11): `tst-lab-1`, `tst-lab-2` = v3; `tst-02-2`, `tst-lab-3`, `tst-lab-4`, `tst-04-1/2/3` = v2 (đổi sang `npm run test:unit`); còn lại v1. Không sửa `_render-slides.mjs`, `_cs-chung.mjs`, `_pg-chung.mjs`.

## 5. Lời giảng dưới slide (`giang/<deck>.mjs`)
- Đúng **một dòng/slide**, đủ 1..N (walkTst ném lỗi nếu thiếu/trùng). EN 50–90 từ, VI tương đương, giải thích **vì sao**, không đọc lại slide.
- Kiểm khớp tiêu đề: so `t:` trong deck với cột 2 của `giang/` (Ch2 dùng một lệnh `diff` — xem lịch sử commit Ch2).

## 6. Liên kết chéo Academy ↔ Courses
- Courses → Academy: `${lienKet({ bai: '<slug SWT301>', title, sub, cta })}` cuối **cả** khối ml-en (EN) và ml-vi (VI);
  `sub` nói rõ **Giống** gì và **Khác/sâu thêm** gì. Khoá khác: `lienKet({ khoa: 'nodejs', bai: 'nodejs-1-4-bat-dong-bo', … })` (bài 2.1).
- Academy → Courses: trong `content/academy/swt301/chN.mjs`, thêm MỘT cặp `bi(enCard, viCard)` (thẻ `<a class="link-card lien-ket-cheo"
  href="/courses/testing/learn?lessonSlug=…" target="_blank" rel="noopener">` với `lc-ico/lc-body/lc-title/lc-sub/lc-cta`) vào **cuối mảng
  `content`** của bài, ngay trước `].join('\n'),` và sau `books([...])` nếu có. **Trước khi sửa: `git status --short <file>` — có thay đổi của
  phiên khác thì BỎ QUA** file đó và ghi lại trong báo cáo.
- SDN302 (Academy, `server-side-development-nodejs-express-mongodb`) nằm trọn trong `content/academy/SDN302.mjs`, nội dung là HTML
  trong template literal: chèn thẻ ngay sau thẻ `lien-ket-cheo` cuối cùng của khối `ml-en` và của khối `ml-vi` trong đúng bài
  (Ch3: `sdn302-4-1-rest-mvc` ↔ `tst-3-4-thiet-ke`). Khoá Node.js (Courses) chỉ gắn một chiều từ Testing: `lienKet({ khoa: 'nodejs', … })`.
- Chỉ gắn khi đã ĐỌC bài SWT301 và liên quan thật. Ghi mỗi cặp vào `content/_LIEN-KET-CHEO/swt301-testing.md`.
- Kiểm SWT301 sau khi sửa: `node --check` từng file + cân thẻ (ml-en = ml-vi; div/p/pre/code/span/a mở = đóng) trên `content/academy/SWT301.mjs`
  (`course-content-check.mjs` không chạy được với SWT301 vì có bài quiz không có content — lỗi có sẵn).

## 7. Lab chương + đề Code Lab kiểu mutation

### 7.1 Lab = kiểm thử đột biến làm tay
- `scripts/dot-bien-N.mjs` trong dự án: mảng `MUTANTS = [[file, from, to, nhãn], …]` (8 con), với mỗi con: thay **đúng một đoạn**
  (`String.replace` = chỗ khớp ĐẦU TIÊN — cẩn thận khi chuỗi xuất hiện 2 lần), chạy `npx vitest run src/`, exit ≠ 0 ⇒ *killed*, trả file trong
  `finally`; `shell: process.platform === 'win32'` (npx là .cmd trên Windows). In `N/8 mutants killed`.
- Bài lab có: Setup · bảng 8 đột biến (+ "với người dùng nghĩa là gì") · Nhiệm vụ (bắt đầu từ LUẬT, không từ bảng đột biến) ·
  **lần thử đầu YẾU chạy thật** (xanh nhưng diệt ít — Lab 1: 1/8, Lab 2: 0/8) + giải thích từng con sống · Thang chấm 10 điểm
  (đột biến chỉ 4 điểm; còn lại là thói quen của chương) · Gợi ý từ nhẹ tới mạnh · **Lời giải tham khảo + output + 8/8** · Checklist xong.
- Deck lab 9 slide: cover · mission · code under test · 8 bugs · first attempt · reference · rubric · hints · checklist.

### 7.2 Đề Code Lab kiểu `mutation` (chờ máy chấm)
`testing/_de-codelab-mutation.json` — 24 đề, 132 đột biến + 6 thay đổi vô hại, **đã kiểm 138/138 đạt** trên một bản sao mới của
`_labflow-lite` (`npm ci`, Docker bật) bằng
`node scripts/tst/kiem-de-mutation.mjs <SCRATCH>/lab/labflow-lite content/courses/testing/_de-codelab-mutation.json [id…]` (01/11/2026).
Trường thêm: `config` (Ch4: `vitest.integration.config.js`, cần Docker) · `voHai[{file, from, to, label}]` = thay đổi VÔ HẠI mà test
phải VẪN XANH (bắt test quá chi tiết — đề 3.3).
Mỗi đề: `id`, `bai` (slug bài gắn), `tieuDe` EN\|\|\|VI, `ham`, `fileDung` (code đúng trong `_labflow-lite`), `testThamKhao` (bộ test
chứng minh mọi đột biến diệt được), `yeuCau`, `dotBien[{ file, from, to, label }]` (`from` khớp **đúng 1 chỗ**, kể cả xuống dòng).
Máy chấm sau này: chạy file test của người học trên code đúng (phải xanh, có `requireAssertions`) rồi với từng đột biến (phải đỏ).

| id | Bài | Hàm | Đột biến |
|---|---|---|---|
| tst-cl-1-1 | tst-1-1-cau-truc | needsApproval, createBooking | 30 chỗ cần duyệt · ADMIN cần duyệt · đảo trạng thái · nhận 0 chỗ · khung sai trả null |
| tst-cl-1-2 | tst-1-2-matcher | parseTime, formatTime, usageRate | nhận "24:00" · nhận "07:60" · sai lớp lỗi định dạng · làm tròn giờ · "7:00" thiếu số 0 · usageRate chỉ tính lượt cuối |
| tst-cl-1-3 | tst-1-3-ten-test | checkSlot | giờ kết thúc lệch lưới · khung 0 phút · từ chối 07:00 · từ chối kết thúc 21:00 · sai mã giờ mở cửa |
| tst-cl-1-4 | tst-1-4-ham-thuan | isWithinBookingWindow, checkSlot, needsApproval | từ chối 14 ngày · từ chối hôm nay · nhận 2.5 ngày · từ chối đúng 4 giờ · nhận 2.5 chỗ |
| tst-cl-lab-1 | tst-1-5-lab-quy-tac | (8 đột biến của `dot-bien.mjs`) | |
| tst-cl-2-1 | tst-2-1-async | bookLab | trùng lịch trả lượt cũ · từ chối khung nối tiếp 10:00 · phòng khác chặn khung · 31 chỗ thành CONFIRMED · lỗi luật là Error thường |
| tst-cl-2-2 | tst-2-2-thoi-gian | canCancel, login guard, retry, daysAheadVN | huỷ đúng 60 phút bị từ chối · phút tính thành giây · khoá 15 giây · không xoá bộ đếm khi khoá · không giãn cách · ngày theo UTC |
| tst-cl-2-3 | tst-2-3-loi | BookingError, bookLab | lỗi đọc lọt ra · thiếu `await` khi `return repo.insert` (lỗi ghi thoát try/catch) · mất cause · mất code · mọi lỗi luật cùng một mã |
| tst-cl-2-4 | tst-2-4-ngau-nhien | makeBookingCode, newBookingRecord | không bao giờ ra ký tự cuối · thiếu dấu "-" · mã thiếu 1 ký tự · bỏ qua đồng hồ tiêm · bỏ qua bộ sinh id tiêm |
| tst-cl-lab-2 | tst-2-5-lab-bat-dong-bo | (8 đột biến của `dot-bien-2.mjs`) | |
| tst-cl-3-1 | tst-3-1-phan-loai | bookAndNotify | thiếu `notified: true` · thư hỏng vẫn báo đã gửi · quên `await mailer.send` · xác nhận gửi người duyệt · cảnh báo ghi phòng thay id |
| tst-cl-3-2 | tst-3-2-mock-module | createHttpMailer, sendReminder | sai đường dẫn · sai method · thiếu subject trong JSON · trả cả body · 429 thành lỗi chung · nhắc lịch mất “tomorrow” |
| tst-cl-3-3 | tst-3-3-qua-da | bookAndNotify, bookLab | mọi lượt CONFIRMED · độ dài luôn 60 · thư duyệt gửi sinh viên · **vô hại:** lưu thêm cột `source` (phải vẫn xanh) |
| tst-cl-3-4 | tst-3-4-thiet-ke | buildMail, createReminder | tiêu đề mất “confirmed” · “31 seat” · mất giờ bắt đầu · nhắc “today” |
| tst-cl-lab-3 | tst-3-5-lab-test-double | (8 đột biến của `dot-bien-3.mjs`) | |
| tst-cl-4-1 | tst-4-1-vi-sao | createPgRepo, bookLab (config tích hợp) | 23P01 → 23505 · OVERLAP thành STORAGE_DOWN · mất cause · thiếu id |
| tst-cl-4-23 | tst-4-2 + tst-4-3 | global setup, schema | test chạy PostgreSQL 16 · schema thiếu ràng buộc · thiếu btree_gist |
| tst-cl-4-4 | tst-4-4-co-lap | bookLab, createPgRepo | 31 chỗ lưu CONFIRMED · độ dài luôn 60 · số chỗ luôn 20 |
| tst-cl-lab-4 | tst-4-5-lab-tich-hop | (8 đột biến của `dot-bien-4.mjs`, mỗi lần một PostgreSQL mới) | |
| tst-cl-5-1 | tst-5-1-supertest | createApp | 201→200 · mất trường status · thiếu Location · 409→400 · 422→400 · **vô hại:** đặt Location trước status |
| tst-cl-5-2 | tst-5-2-xac-thuc | createAuth, requireUser/Role | hết hạn theo đồng hồ thật · token sống thừa 1 giây · IDOR · giảng viên qua cửa admin · 403→401 · **vô hại:** `slice('Bearer '.length)` |
| tst-cl-5-3 | tst-5-3-validation | BookingInput, middleware lỗi | khoá lạ lọt · trần 201 chỗ · nhận 2.5 chỗ · ngày không tồn tại · giờ 24–29 · JSON hỏng → 500 · TOO_LONG → 500 · **vô hại:** đổi lời thông báo |
| tst-cl-5-4 | tst-5-4-hop-dong | contractErrors + cả API | lộ userId/role · start→startTime · minutes thành chuỗi · lỗi mất vỏ `{ error }` · 415 chưa ghi · **vô hại:** đổi thứ tự trường |
| tst-cl-lab-5 | tst-5-5-lab-api | (8 đột biến của `dot-bien-5.mjs`) | **vô hại:** đặt Location trước status |

Chương mới ⇒ thêm 1 đề/bài dạy (3–8 đột biến, mỗi con là một bug THẬT có nghĩa với người dùng, không đột biến tương đương), chạy
`kiem-de-mutation.mjs` tới khi `N/N`, rồi cập nhật bảng này. Đột biến phải giữ cú pháp hợp lệ: xoá `lab = $1 AND` làm `$1` thừa ⇒ cả câu
SQL hỏng ⇒ test nào cũng “diệt” vì lý do sai; thay bằng `$1::text IS NOT NULL AND` (đo 01/11: bộ yếu diệt bản xoá, để sống bản thay).
Bài hạ tầng (4.2/4.3) gộp một đề; đề phải có test tham khảo NẰM TRONG dự án (`testThamKhao`).

## 8. Quy trình một chương (tóm tắt)
1. Đọc khung chương trong `testing.mjs` + bài SWT301 liên quan. 2. Viết code mới vào LabFlow Lite (scratch), chạy, bắt bug thật.
3. Viết demo + thực hành + lời giải, chụp output (`chay.sh`), sinh `_ma.mjs`. 4. Deck từng bài → `kiem-slide` 0 lỗi → render → soát ảnh.
5. `giang/` → bài EN/VI → lab (+ `dot-bien-N.mjs`, bộ yếu, lời giải) → quiz. 6. Liên kết chéo hai chiều + bảng `_LIEN-KET-CHEO`.
7. Đề mutation + `kiem-de-mutation`. 8. `course-content-check` 0 lỗi, upload slide, cập nhật `_labflow-lite/` + file này.
9. Commit bằng **index riêng** (`GIT_INDEX_FILE=$(mktemp)`; `git read-tree HEAD`; `git add <đúng file của mình>`), không Co-Authored-By,
   KHÔNG push/deploy; xong `git reset -q HEAD -- <đúng các file đó>` để index chung khớp.
