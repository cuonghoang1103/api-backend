# Hợp đồng soạn khoá "TypeScript" (/courses/typescript)

> Đọc HẾT file này trước khi soạn một chương. Viết 01/11/2026 cùng đợt mẫu **Mục 0 + Chương 1** (chép quy trình của hai khoá đã
> soạn trọn: `content/courses/testing/_HOP-DONG.md`, `content/courses/api-design/_HOP-DONG.md` + `_BAN-GIAO.md`).
> Chỗ nào file này không nói ⇒ bắt chước đúng các bài của đợt mẫu: `typescript/s00/*.mjs`, `typescript/s01/*.mjs`, deck `ts-00-*`,
> `ts-01-*`, `ts-lab-1`.

## 0. Khoá này là gì, dạy ai

- Người học: SV SE FPT **kỳ 5, chuyên ngành hẹp Node.js** — đã học JavaScript qua FER202 (React) và/hoặc SDN302 (Node/Express),
  muốn viết **backend + frontend TypeScript thật** khi đi làm. Tiếng Anh còn yếu ⇒ **giảng tiếng Việt, thuật ngữ Anh luôn kèm giải
  nghĩa** lần đầu (`type annotation (chú thích kiểu)`), các lần sau dùng thẳng.
- Khoá **tự đủ từ số 0** (luật chủ kênh 31/10): không bắt sang Academy/khoá khác học phần nền — chỗ nào cần JS nền (object, mảng,
  import/export, async) thì nhắc lại ngắn ngay trong bài; link khoá khác chỉ là "đọc thêm".
- **DỄ HIỂU là tiêu chí số 1.** Mở đầu khoá, chương, bài luôn nói: học xong làm được gì, vì sao có ích (đồ án, phỏng vấn, đi làm).
- **Mọi output là output chạy thật** (tsc, node, grader) trên dự án xuyên khoá **LabFlow TS** (mục 3). Không bịa, không "khoảng chừng"
  khi đo được. Số đo ngẫu nhiên/thời gian ⇒ đo thật ≥ 2 lần, ghi đúng số.
- Thực chiến mỗi chương: một bug/bẫy THẬT chạy ra đỏ, một bảng "khi nào dùng gì", góc phỏng vấn, đối chiếu Java (PRO192/Spring) khi có ích,
  sự cố thật của chính website này khi có (vd 08/08/2026 enum `CODE` → `CODE_REVIEW` qua hết checklist mà vỡ seed production — CLAUDE.md).

## 1. Phiên bản ghim (đo 01/11/2026)

| Thứ | Bản | Ghi chú đo được |
|---|---|---|
| Node.js | **22.23.3** (LTS "Jod") | Node ≥ 22.18 chạy `.ts` trực tiếp bằng **type stripping** (bật mặc định từ 22.18.0, 31/07/2025). `process.features.typescript` = `'strip'`. Không hỗ trợ `enum`/`namespace`/parameter property ⇒ `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. |
| TypeScript | **7.0.2** (npm `latest`, 08/07/2026) | Trình biên dịch **viết lại bằng Go** (gói `typescript` kéo binary `@typescript/typescript-<os>-<arch>`, 26 MB trên darwin-arm64 — đo `du`; `typescript` 3,5 MB; cả `node_modules` 33 MB). **Mặc định `strict: true`** kể cả khi gọi `tsc file.ts` không có tsconfig. KHÔNG có JS API (7.0 "does not ship with an API"). |
| TypeScript 6 | 6.0.3 | Bản JS cuối cùng có API; **VS Code 1.124.2 dùng TypeScript 6.0.3 bên trong** để tô đỏ ⇒ editor và `npx tsc` có thể là hai bản khác nhau. Máy chấm web tương lai cần bản JS này (mục 7.3). |
| @types/node | **22.20.5** | khớp Node 22. |
| tsx | 4.23.15 | chỉ nhắc (chạy .ts ở Node cũ); khoá dùng Node chạy thẳng. |

Chương sau thêm gói (Express 5, Zod 4, Prisma, React 19, Vitest…) ⇒ ghim bản chính xác (`npm i -E`) và thêm dòng vào bảng này.
Dùng **đúng bản gói** mà khoá Node.js / API Design / Testing đã ghim nếu trùng (Express 5.3.0, Zod 4.6.7, Vitest 5.0.5, React 19.3.1).

## 2. Cây file

| File | Vai trò |
|---|---|
| `content/courses/typescript.mjs` | Khoá (`syncOrder: true` từ 01/11 ⇒ seed theo đúng thứ tự file). Import `sNN`. |
| `typescript/sNN-<ten>.mjs` | Chương: `title` **GIỮ NGUYÊN** (seeder neo chương bằng tiêu đề), `description`, `lessons: [...]` (import từ `sNN/`). |
| `typescript/sNN/<bai>.mjs` | Một bài (`slug`, `type`, `isFreePreview`, `title` EN\|\|\|VI, `description` tiếng Việt, `content`, `video` nếu có). |
| `typescript/sNN/_ma-<deck>.mjs` | `CODE` (mã nguồn) + `OUT` (output chạy thật) của MỘT bài — **SINH TỰ ĐỘNG** bằng `scripts/ts/sinh-ma.mjs`, không sửa tay. Mỗi bài một tệp (soạn song song không giẫm nhau). |
| `typescript/giang/<deck>.mjs` | Lời giảng EN/VI dưới từng slide: `walkTs(deck, tênEN, tênVI, [[n, 'Tiêu đề slide', '<p>EN</p>', '<p>VI</p>'], …])`. |
| `typescript/_slides.mjs` | `walkTs`, `ma(lang, src)`, `ra(output)`, `lienKet({ khoa, bai, … })`, `nguon(...)`, bảng **`VER`**. Chỉ sửa `VER`. |
| `typescript/_labflow-ts/` | **Ảnh chụp dự án LabFlow TS** ở cuối chương mới nhất đã soạn (không node_modules). |
| `typescript/_de-codelab-ts.json` | Đề Code Lab kiểu **`ts`** (chờ máy chấm web, mục 7). |
| `scripts/slides-src/_ts-chung.mjs` | Khuôn slide (chép `_tst-chung.mjs`): `ts()` mã TS, `tc()` terminal tsc/node + mọi helper của khuôn Testing. Đổi khuôn ⇒ deck đã đẩy phải lên prefix mới. |
| `scripts/slides-src/ts-NN-M.mjs`, `ts-lab-N.mjs` | Deck từng bài / lab chương. |
| `scripts/ts/` | `chay.sh` (chạy lệnh trong môi trường SẠCH `env -i`, chụp output), `sinh-ma.mjs` (sinh `_ma-<deck>.mjs`, chặn chuỗi bí mật/đường dẫn máy), `kiem-de-ts.mjs` (kiểm đề Code Lab `ts`). Kiểm slide dùng chung `scripts/tst/kiem-slide.mjs`, ghép ảnh `scripts/tst/ghep-anh.mjs`. |
| `content/_LIEN-KET-CHEO/typescript.md` | Sổ liên kết chéo của khoá (mục 6). |

## 3. LabFlow TS — dự án xuyên khoá

**Vì sao chọn:** cùng hệ thống đặt phòng lab "LabFlow" của khoá Node.js → API Design → Testing. Chương 1 lấy **đúng hai tệp luật**
`time.js` + `booking.js` của LabFlow Lite (khoá Testing, `testing/_labflow-lite/src/rules/`) và đổi sang TypeScript — người đã học
Testing nhận ra ngay `checkSlot`, `needsApproval`, BR-04/05/06; người chưa học thì đây là code JS bình thường. Các chương sau lớn dần
thành API Express có kiểu (Ch11), form React dùng chung kiểu (Ch12), Zod + Prisma ở biên (Ch13) — chính chồng công nghệ của các khoá kia.

### 3.1 Cấu trúc (cuối Chương 1)
```
_labflow-ts/
  package.json        # type: module, engines node >=22.18, devDeps typescript 7.0.2 + @types/node 22.20.5 (ghim -E)
  tsconfig.json       # chuẩn của khoá (bài 0.3): target es2024, module nodenext, types [node], strict, noUncheckedIndexedAccess,
                      #   noEmit, allowImportingTsExtensions, erasableSyntaxOnly, verbatimModuleSyntax, skipLibCheck; include ["src"]
  js/time.js, js/booking.js        # bản GỐC LabFlow Lite (JavaScript) — chép nguyên từ khoá Testing, không sửa
  src/rules/time.ts, booking.ts    # bản TypeScript (= lời giải Lab 1): Role, SlotCode, SlotResult, BookingInput, Booking
  src/rules/*.test.ts              # node:test (10 test) — `npm test`
  lab1/                            # Lab 1: src/ (khởi đầu = JS đổi đuôi), test/rules.test.ts (15 test), kiem/phai-dung.ts, kiem/sai.ts (8 lời gọi sai),
                                   #   yeu/ (lần thử "any", 5.5/10), vua/ (lần thử string/number, 8/10)
  scripts/cham-lab-1.mjs           # máy chấm Lab 1 — `node scripts/cham-lab-1.mjs [--from <thư mục>]`
  demo0/<deck>/, demo1/<deck>/     # thí nghiệm từng bài (có tệp CỐ Ý đỏ). Mỗi thư mục có tsconfig riêng nếu cần (extends ../../tsconfig.json)
```
- `npm run typecheck` = `tsc --noEmit -p tsconfig.json` (chỉ `src/`, luôn xanh) · `npm test` = `node --test --test-reporter=spec "src/**/*.test.ts"`
  (Node 22 cần glob; `node --test src/` báo `Cannot find module '…/src'` — đo 01/11) · `npm run lab1`.
- `demo*/` có tệp CỐ Ý lỗi ⇒ KHÔNG nằm trong `include` của tsconfig gốc; chạy bằng `npx tsc -p demo1/<deck>` hoặc `npx tsc --noEmit <file>`.
  ⚠️ `tsc --help` nói `tsc app.ts` "Ignoring tsconfig.json" nhưng đo thật (7.0.2): thư mục có tsconfig.json ⇒ `npx tsc file.ts` **lỗi TS5112**
  ("tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig'…", exit 1). Muốn mặc định TS7
  (strict, `types: []`) thì thêm `--ignoreConfig` — dạy ở 0.3.
- Code mới của chương ⇒ thêm vào `src/` đúng chỗ; giữ nguyên tệp chương trước (máy chấm lab tìm đúng chuỗi). Chương N mới ⇒ `demoN/`, `labN/`,
  `scripts/cham-lab-N.mjs`.
- Xong chương ⇒ cập nhật ảnh chụp `_labflow-ts/` (rsync bỏ `node_modules`, `.cham-*`, `.kiem-de`), kiểm trên bản sao mới:
  `npm ci && npm run typecheck && npm test && node scripts/cham-lab-1.mjs --from src/rules` (10/10).

### 3.1b Chương 2 thêm gì (01/11/2026)
- `src/rules/schedule.ts` + `schedule.test.ts` (13 test; `npm test` = 23 test) = lời giải Lab 2: `LABS as const`, `LabCode = (typeof LABS)[number]`,
  `TimeRange = readonly [start: number, end: number]`, `ScheduleEntry` (`note: string | null`, `cancelledAt?: string`), `isLab` (guard bằng `some`,
  không `as`), `toRange`, `findEntry` (`| undefined`), `noteOf` (`??`), `firstStart` (`| null`), `sortByStart` (`toSorted`), `labelOf`.
- `lab2/` (khởi đầu viết khi `strict: false` + `tsconfig.loose.json`, test, `kiem/phai-dung.ts`, `kiem/sai.ts`, `yeu/`, `vua/`), `scripts/cham-lab-2.mjs`
  (`npm run lab2`; phần C cấm thêm `as` trừ `as const` và `!` — bóc chú thích + chuỗi trước khi quét), `demo2/<deck>/`.
- Số đo Lab 2: cùng tệp `strict: false` 0 lỗi / strict 10 lỗi · khởi đầu **1/10** (0/8) · `yeu/` "! và as" **4/10** (test xanh, E 0/8) ·
  `vua/` "null thật, mảng thường" **7/10** (E 4/8: S5–S8 lọt) · tham khảo **10/10**. Mã đo được: S1 TS2532, S2 TS18047, S3 TS18048, S4 TS2531,
  S5 TS2322, S6 TS2540, S7 TS2322 (tsc 7 in union đã sắp: `"AL-301" | "BE-201" | "BE-202"`), S8 TS2339.

### 3.1c Chương 3 thêm gì (01/11/2026)
- `src/rules/validate.ts` + `validate.test.ts` (10 test; `npm test` = 33 test) = lời giải Lab 3: `ProblemCode`, `Problem`,
  `type Rule = (input: BookingInput) => Problem | null`, 4 luật hằng `: Rule`, `maxSeats(limit): Rule` (closure), `RULES`, overload
  `toMinutes(text): number` / `toMinutes(texts: readonly string[]): number[]` (KHÔNG overload `parseTime` của `time.ts` — làm thế phá máy chấm
  Lab 1: S1 sẽ ra TS2769 thay vì TS2345), `validate(input, rules, onProblem?)`, `totalMinutes(...ranges: TimeRange[])`,
  `Validator` với `run(this: Validator, …)` + `createValidator`.
- `lab3/` (khởi đầu dùng `Function`, bản sao time/booking/schedule, test, `kiem/`, `yeu/`, `vua/`), `scripts/cham-lab-3.mjs` (`npm run lab3`;
  phần C cấm thêm `Function`), `demo3/<deck>/`.
- Số đo Lab 3: khởi đầu tsc chỉ **2 lỗi** (TS7006, TS7019 — `Function` tắt kiểm) · **1/10** (E 2/8) · `yeu/` "(...args: any[]) => any" **6/10** ·
  `vua/` "Rule thật, toMinutes trả union, không this" **8/10** (S4 ra TS2345 thay vì TS2769, S8 lọt) · tham khảo **10/10**. Mã: S1–S3 TS2322,
  S4 TS2769, S5–S6 TS2345, S7 TS2554 ("Expected 2-3 arguments"), S8 TS2684.

### 3.1d Chương 4 thêm gì (01/11/2026)
- `src/rules/model.ts` + `model.test.ts` (10 test; `npm test` = 43 test) = lời giải Lab 4: `interface Entity { readonly id; readonly createdAt }`,
  `interface Lab` (`readonly code: LabCode`, `capacity`, `equipment?: readonly string[]`), `User extends Entity` (`role: Role`, `studentCode?`),
  `type BookingStatus`, `BookingRecord extends Entity` (mọi trường readonly, `range: TimeRange`, `note: string | null`),
  `type BookingView = BookingRecord & { labName; userName }`, `LAB_INFO: Record<LabCode, Lab>` (BE-202 KHÔNG có `equipment`), `labName`, `freeSeats`,
  `seatsByLab(): Record<LabCode, number>` (ba số 0), `indexById(): Record<number, User>` (mở), `withStatus` (spread), `toView`.
- `lab4/` (khởi đầu `type` lỏng: `code/role/status: string`, `capacity?`, `equipment: string[]` bắt buộc, `LabTable` index signature; 3 lỗi hành vi —
  BE-202 `equipment: []`, `seatsByLab` từ `{}`, `withStatus` sửa tại chỗ), `scripts/cham-lab-4.mjs` (`npm run lab4`; phần C như Lab 2: any/as/!/@ts-), `demo4/<deck>/`.
- Số đo Lab 4: khởi đầu **0 lỗi tsc** trong `lab4/src` mà chỉ **4.5/10** (B 0, D 6/10, E 3/8 — S1 bị từ chối vì THIẾU `equipment`, lý do sai) ·
  `yeu/` "index signature any + LAB_INFO: any" **6.5/10** (S2 ra TS2741 thay vì TS2561) · `vua/` "interface + union, không readonly, bảng mở" **7.5/10**
  (S4, S5, S7 lọt, B trượt) · tham khảo **10/10**. Mã: S1 TS2741, S2 TS2561, S3 TS2322, S4 TS2540, S5 TS2339, S6 TS18048, S7 TS7053, S8 TS2739.
- Số đo đáng nhớ của chương: typo qua biến ⇒ TS2741 (không "Did you mean"), thêm `capacity?` + `?? 0` ⇒ 0 lỗi, "free seats: -12"; `readonly string[]`-thiếu ⇒
  hai phòng cùng nhận GPU; interface trùng tên gộp (TS2741 ở dòng tạo object, Node exit 0) vs type TS2300; interface extends union ⇒ TS2312;
  `User & { id: string }` ⇒ TS2322 "not assignable to type 'never'" còn extends ⇒ TS2430; tắt `noUncheckedIndexedAccess` ⇒ 0 lỗi + TypeError
  (strict của tsc 7 KHÔNG bật cờ này — đo bằng `--ignoreConfig`); `Object.keys(Record)` ⇒ TS7053; `Object.keys(byId)` ra `['1', '2']`;
  backend cuongthai.com @88ec543b0: 896 tệp, 1.460 interface, 890 type alias (123 `= {`, 224 union chuỗi).

### 3.2 Số đo nền của Lab 1 (01/11/2026, chạy thật)
| Bài nộp | A tsc src (2) | B gọi đúng (1) | C không any (1) | D 15 test (2) | E 8 lời gọi sai bị từ chối (4) | Tổng |
|---|---|---|---|---|---|---|
| Khởi đầu (JS đổi đuôi .ts, còn `./time.js`) | 0 (13 lỗi TS7006/TS7031) | 0 | 1 | 0 (`ERR_MODULE_NOT_FOUND` `./time.js`) | 3/8 | **2.5** |
| `yeu/` — mọi chỗ `any` | 2 | 1 | 0 | 2 | **1/8** (tệ hơn không làm gì) | **5.5** |
| `vua/` — string/number, không literal union | 2 | 0 (`minutes: number \| undefined`, `status: string`) | 1 | 2 | 6/8 | **8** |
| Tham khảo `src/rules` | 2 | 1 | 1 | 2 | 8/8 | **10** |

## 4. Chụp output thật

```bash
bash scripts/ts/chay.sh <SCRATCH>/ts/lab/labflow-ts "npx tsc -p demo1/ts-01-1" > <SCRATCH>/ts/out/ts-01-1/11-loi.txt
```
- `chay.sh` chạy trong `env -i PATH=<node 22.23.3>:/usr/bin:/bin HOME=<tạm> TZ=UTC NO_COLOR=1` (đổi bằng `TS_NODE_BIN`, `TS_HOME`, `TZ=…`),
  in `$ lệnh`, output (đường dẫn tuyệt đối → `…/labflow-ts`), `[exit N]` (bị cắt khi sinh `_ma`).
- `--pretty` vẫn in mã màu ANSI ⇒ `sinh-ma.mjs` tự bóc. Không có TTY ⇒ tsc in dạng một dòng `file(dòng,cột): error TSxxxx: …`.
- Sinh `_ma`: viết `<SCRATCH>/ts/map-<deck>.json` rồi `node scripts/ts/sinh-ma.mjs <map>`:
  ```json
  { "duAn": "<SCRATCH>/ts/lab/labflow-ts", "out": "<SCRATCH>/ts/out/ts-01-1", "dich": "content/courses/typescript/s01/_ma-ts-01-1.mjs",
    "bai": "1.1", "code": { "bookingJs": "js/booking.js", "bug1": "demo1/ts-01-1/typo.ts" } }
  ```
  `sinh-ma.mjs` DỪNG nếu thấy `TOKEN|SECRET|sk-|ctw_|/Users/|/private/|API_KEY|R2_` trong code/output.
- Trích một đoạn tệp ⇒ hằng ở đầu tệp bài: `const DONG = CODE.bookingJs.split('\n'); const X = DONG.slice(9, 17).join('\n');`
  (biểu thức có `'\n'` KHÔNG được nằm trong `${…}` của thân bài — bộ kiểm cấm gạch chéo ngược trong thân).

## 5. Khung một chương

- Bài dạy giữ **slug khung** `typescript-N-M-<ten>` (xem các `sNN-*.mjs` hiện có). Mục 0 thêm 2 bài "Bắt đầu tại đây" slug
  `typescript-0-8-bat-dau-tai-day`, `typescript-0-9-bat-dau-tai-day-2` đứng ĐẦU.
- **Lab chương** (bài MỚI, đứng TRƯỚC quiz): slug `typescript-N-6-lab-<ten>`, thang 10 điểm (đạt 7) + máy chấm `scripts/cham-lab-N.mjs`
  chạy tsc + node thật. Lab có: Setup · nhiệm vụ · bảng "lời gọi sai phải bị từ chối" (đột biến ở TẦNG KIỂU — tsc phải báo đúng mã) ·
  lần thử YẾU chạy thật + vì sao trượt · thang chấm · gợi ý nhẹ→mạnh · lời giải + output 10/10 · checklist.
- **Quiz chương**: slug khung `typescript-N-5-quiz` (giữ), `type: 'QUIZ'`, **10 câu tình huống**, đáp án rải (mỗi chữ A–D 2–3 lần, ghi phân bố
  ở chú thích đầu tệp), `explanation: 'EN: …|||VI: …'` nói vì sao đúng VÀ vì sao đáp án sai hấp dẫn nhất lại sai.
- Bài (`type: 'LESSON'` hoặc `'VIDEO'` nếu đã có `video`, `isFreePreview: true`), `content` theo thứ tự:
  1. `${G}` — "📑 Học theo slide" (import từ `giang/`).
  2. `<div class="ml-en">`: `eyebrow` → `h2` → `p.lead` (học xong làm được gì) → các mục `h3` (mã `ma('typescript', …)`, output `ra()`,
     bảng, `div.pitfall.co-tieu-de` cho bẫy, sơ đồ `lz-flow`/`lz-stack`) → **🧪 Practice** trong `div.callout.ok` (đề + **lời giải + output thật**
     + "Done when") → **🗂 Key terms** (`div.kv-grid`) → **📌 Summary** → 📚 nguồn (thẻ `nguon(...)`, ghi "read 1 Nov 2026") → thẻ `lienKet(...)`. `</div>`
  3. `<div class="ml-vi">` — bản tiếng Việt **đầy đủ tương đương** (không tóm tắt), cùng mã/output.
- **Độ dài: 30–40k ký tự/bài kể cả phần giảng slide**; lời giảng ngắn (40–70 từ/slide). Chủ đề lớn ⇒ tách bài (slug mới chèn giữa).
- Mỗi bài nên có: một bẫy THẬT chạy ra đỏ, một bảng "khi nào dùng gì", thuật ngữ EN–VI, câu phỏng vấn khi hợp.

### Luật chữ trong template literal (bộ kiểm `scripts/course-content-check.mjs` bắt)
- Trong thân `` `...` ``: **không backtick, không `\`**, `${` chỉ cho nội suy thật. Mã mẫu TS có template string ⇒ đưa vào `_ma` (sinh từ tệp
  thật, tự thoát) hoặc viết bằng nối chuỗi `'a' + b`.
- HTML: `<` `>` `&` trong chữ thường ⇒ `&lt;` `&gt;` `&amp;` (generic `Array&lt;string&gt;`, mũi tên `=&gt;`). `ma()`/`ra()` tự thoát.
- Kiểm: `node scripts/course-content-check.mjs ./content/courses/typescript.mjs` ⇒ 0 lỗi; `node scripts/course-depth-audit.mjs ./content/courses/typescript.mjs`.

## 6. Slide

- Deck `scripts/slides-src/ts-NN-M.mjs` (NN 2 chữ số; M = số bài; Mục 0 "Bắt đầu" = 8, 9) và `ts-lab-N.mjs`.
  `export const deck = { key, code: 'TS N.M', title, sub }`, `export const slides = lamDeck({ chuong: 'Chapter N — …', bai: 'N.M' | 'Lab N' }, [...])`.
- Helper `_ts-chung.mjs`: `ts(src, { hl, sm })` mã TS · `js(src)` mã JS · `tc(text, { title })` terminal tsc/node (error TS đỏ, ✔ xanh) ·
  `vt` (terminal test) · `two`, `three`, `box(h, html, 'lam'|'xanh'|'do2')`, `steps`, `cards`, `flow`, `tbl`, `vsd`, `kw`, `c('code')`, `zm(html, 1.2)`.
- Luật (như Testing): **FULL TIẾNG ANH** (cả chú thích trong code), logo CuongThai.com, **không logo/tên FPT**, chữ thân 24–28px,
  mã ≤ ~14 dòng/khối, output trên slide = output thật (được cắt bằng `…`), lấp đều khung. 10–12 slide/bài, deck lab 9 slide.
- **Kiểm TỰ ĐỘNG trước khi render/upload:** `node scripts/tst/kiem-slide.mjs scripts/slides-src/ts-NN-M.mjs` ⇒ `0 slide có vấn đề`
  (TRÀN ngang/dọc, dòng mã vượt mép, TRỐNG < 70%).
- Render + soát bằng MẮT: `node scripts/_render-slides.mjs --deck scripts/slides-src/<deck>.mjs --out <SCRATCH>/ts/render` ⇒
  `node scripts/tst/ghep-anh.mjs <SCRATCH>/ts/render/<deck> <SCRATCH>/ts/sheets` ⇒ mở TỪNG ảnh ghép, đối chiếu số trên slide với output thật.
- **Upload** (chủ ý chạm R2 thật, chỉ khi đã soát): `node --env-file=.env scripts/upload-academy-slides.mjs --dir <SCRATCH>/ts/render --prefix TS/v1 --decks <deck,…>`
  ⇒ `images/academy/TS/v1/<deck>/NNN.webp`. **KHÔNG GET URL media.cuongthai.com trước khi đẩy.** Deck đã đẩy mà dựng lại ⇒ `TS/v2` + `VER`.
- Lời giảng `giang/<deck>.mjs`: đúng một dòng/slide, đủ 1..N (walkTs ném lỗi nếu thiếu/trùng); tiêu đề cột 2 ≡ `t:` của slide (bỏ `<br>`).

## 7. Code Lab

### 7.1 Đề kiểu `ts` — `typescript/_de-codelab-ts.json` (chờ máy chấm web)
Mỗi đề là một object:
| Trường | Ý nghĩa |
|---|---|
| `id` | `ts-cl-<chương>-<bài>-<chữ>` (vd `ts-cl-1-1-a`), lab: `ts-cl-lab-1` |
| `bai` | slug bài học gắn đề (nút "🏋️ Luyện tập") |
| `tieuDe`, `moTa` | EN\|\|\|VI. `moTa` là HTML ngắn: việc phải làm + "Done when". |
| `doKho`, `phut` | `EASY`/`MEDIUM`/`HARD`, phút ước lượng |
| `khoiDau` | `{ "src/x.ts": "…" }` — tệp người học SỬA (máy chấm chỉ đọc những tệp này) |
| `coDinh` | tệp của máy chấm (test, `kiem/sai.ts`, `kiem/dung.ts`) — người học thấy nhưng không sửa |
| `kiem.sach` | tsc (tsconfig chuẩn của khoá) trên tệp người học + các tệp này: **0 lỗi** ("must compile") |
| `kiem.phaiLoi` | tệp có dòng kết thúc `// expect TSxxxx` ⇒ dòng đó PHẢI có lỗi đúng mã (đột biến tầng kiểu); dòng khác: 0 lỗi |
| `kiem.loiTsc` | đề "đọc/gây lỗi": tsc trên tệp người học phải ra ĐÚNG tập mã này (`[]` = sạch) |
| `kiem.chay`, `kiem.ra` | lệnh Node 22 phải exit 0 (`node --test test/x.test.ts`, `node src/main.ts`); `ra` = chuỗi stdout phải chứa |
| `kiem.cam` | regex cấm trong tệp người học (mặc định `\bany\b`, `@ts-ignore`, `@ts-nocheck`, `@ts-expect-error`) |
| `loiGiai` | lời giải tham khảo (có chú thích tiếng Anh) |
| `saiMau` | `[{ nhan, tep }]` — bài làm SAI hay gặp (any, string thay literal union, quên kiểu trả về…) — máy chấm PHẢI đánh trượt |

Kiểm thật trên máy: `node scripts/ts/kiem-de-ts.mjs <SCRATCH>/ts/lab/labflow-ts content/courses/typescript/_de-codelab-ts.json [id…]`
⇒ mỗi đề: lời giải QUA · khởi đầu TRƯỢT · mọi sai mẫu bị bắt. Kết quả đợt mẫu: xem mục 9.

### 7.2 Đề chạy runtime thuần (dùng được máy chấm `module` hiện có)
Bài chỉ kiểm hành vi (không kiểm kiểu) có thể viết bằng JS cho grader `module` theo định dạng `content/codelab/*-practice/` — nhưng phần lớn
giá trị của khoá là **tầng kiểu**, nên đợt mẫu KHÔNG làm đề `module`. Nếu làm: track `typescript-practice`, cần dòng trong `PRACTICE_CATALOG` +
`PRACTICE_TRACK_BY_COURSE` của `src/services/codeLab.practice.ts` — **đề xuất, chưa sửa `src/`** (cần chủ kênh duyệt):
```ts
// PRACTICE_CATALOG
{ slug: 'typescript-practice', courseSlug: 'typescript', /* như các track khác */ },
// PRACTICE_TRACK_BY_COURSE
typescript: 'typescript-practice',
```
(Lưu ý: `fallbackTrackFor('web-foundations', 'wf-9-…')` đang trả `'typescript'` — một track TypeScript cũ trong CSDL; mô tả khoá cũ ghi "16 module,
160 bài" — chưa kiểm được track đó còn sống, đừng hứa con số này trong bài.)

### 7.3 Đề xuất máy chấm `ts` trên web (chưa làm — cần duyệt)
- Chạy trong **Web Worker** như `sql`/`module`. TypeScript 7 là binary Go, **không chạy trong trình duyệt và không có JS API** ⇒ dùng
  **`typescript@6.0.3`** (bản JS, cùng ngôn ngữ; VS Code cũng dùng nó) qua `ts.createProgram` + một `CompilerHost` bộ nhớ, hoặc `@typescript/vfs` (1.6.5).
  Kích thước đo 01/11: `lib/typescript.js` **9,14 MB** (gzip -9: **1,64 MB**); `lib.es5…es2024 + decorators .d.ts` 537 KB (gzip 54 KB);
  cả gói 23 MB (phần lớn là bản dịch thông báo + tsserver — không cần). Tải lười khi mở đề, cache Service Worker.
- **Lệch 6.0.3 ↔ 7.0.2 đã đo** (`KIEM_TSC=<tsc 6.0.3> node scripts/ts/kiem-de-ts.mjs …`): 30/31 đề cho cùng kết quả; đề `ts-cl-1-2-d` lệch MÃ
  lỗi (7.0.2 báo TS2739 ở dòng 6, 6.0.3 báo TS2345 bọc ngoài). Trên `lab1/kiem/sai.ts` hai bản cho 38 chẩn đoán giống hệt. ⇒ máy chấm web chỉ
  nên so mã khi 6 và 7 khớp; đề nào lệch thì nhận một trong hai mã, hoặc chấm cuối bằng máy chủ (tsc 7).
- Chấm: (1) `sach` ⇒ `getPreEmitDiagnostics` rỗng; (2) `phaiLoi` ⇒ map lỗi theo dòng + mã; (3) `chay` ⇒ `ts.transpileModule` (hoặc bỏ kiểu
  như Node) rồi chạy test kiểu `module` hiện có (node:test ⇒ cần shim `test`/`assert` nhỏ trong Worker); (4) `cam` ⇒ regex.
- `@types/node`: chỉ nạp phần cần (`console`, `process.env`) hoặc đề không dùng API Node.
- Máy chủ chấm lại khi nộp: dùng chính `scripts/ts/kiem-de-ts.mjs` (tsc 7 thật) — bản trình duyệt (TS 6) chỉ để phản hồi nhanh; lệch giữa 6.0.3 và
  7.0.2 phải được đo trên bộ đề trước khi bật.

## 8. Liên kết chéo (hai chiều, đúng bài)
- TS → bài khác: `${lienKet({ khoa: '<slug khoá>', bai: '<slug bài>', title, sub, cta })}` cuối **cả** ml-en và ml-vi. `sub` nói rõ **Giống** gì,
  **Khác/sâu thêm** gì.
- Bài khác → TS: thẻ `<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=…" …>` cùng mẫu, đặt cuối ml-en/ml-vi của bài kia.
  **Trước khi sửa tệp dùng chung: `git status --short <file>` + `git diff HEAD <file>`** — có thay đổi của phiên khác ⇒ BỎ QUA, ghi vào sổ.
  `content/academy/**` có dòng "FILE SINH TỰ ĐỘNG" ⇒ sửa nguồn ở `~/Documents/FLM-nguon/_repo/<MÔN>/gen/` rồi sinh lại (diff rỗng ngoài thẻ).
- Mọi cặp ghi vào `content/_LIEN-KET-CHEO/typescript.md`.

## 9. Kế hoạch toàn khoá (chương nào cũng: bài dạy + Lab + quiz 10 câu; dự án cuối khoá ở Ch16)

| Ch | Tiêu đề (giữ) | LabFlow TS lớn thêm gì | Lab chương (máy chấm tsc + node) |
|---|---|---|---|
| 0 | Giới thiệu & cách học | dựng dự án, tsconfig chuẩn | — (quiz Mục 0) |
| 1 | Vì sao TypeScript tồn tại | `js/` → `src/rules/*.ts` | **Lab 1** đổi luật LabFlow sang TS: 8 lời gọi sai bị từ chối |
| 2 | Hệ thống kiểu cơ bản | hằng số, `null` trong dữ liệu lịch | Lab 2: `strictNullChecks` trên bảng lịch phòng (null/undefined, tuple giờ) |
| 3 | Hàm | chuỗi validator `(input) => Problem[]` | Lab 3: bộ luật đặt phòng là mảng hàm; overload `parseTime` |
| 4 | Object, interface & type alias | mô hình miền Lab/User/Booking | Lab 4: mô hình miền readonly/optional + `Record<LabCode, Lab>` |
| 5 | Union, literal & thu hẹp | `SlotResult`, trạng thái lượt đặt | Lab 5: máy trạng thái Booking (union có nhãn + `never`); grader thêm trạng thái mới ⇒ phải đỏ |
| 6 | Generics | `Result<T, E>`, repository | Lab 6: `Repo<T extends { id }>` + `groupBy` |
| 7 | Kiểu nâng cao | tên sự kiện `booking:${Action}`, DTO ánh xạ | Lab 7: hệ sự kiện có kiểu |
| 8 | Utility types | `CreateBooking = Omit<…>`, PATCH | Lab 8: tự dựng lại Partial/Pick/Omit + DTO API |
| 9 | tsconfig & trình biên dịch | CI `tsc --noEmit`, tái hiện sự cố seed 08/08 | Lab 9: siết một dự án lỏng lên strict + cổng CI |
| 10 | Module & .d.ts | `.d.ts` cho thư viện JS cũ, augmentation `Request.user` | Lab 10: viết khai báo kiểu cho gói JS |
| 11 | Backend Node/Express | API LabFlow (Express 5.3.0) có kiểu | Lab 11: handler + lỗi có kiểu; test API (node:test/Supertest) |
| 12 | React | form đặt phòng + client API dùng chung kiểu | Lab 12: component + hook có kiểu |
| 13 | Zod & Prisma | Zod 4.6.7 ở biên, Prisma schema bookings | Lab 13: schema là nguồn sự thật duy nhất |
| 14 | Class & decorator | `BookingService`, `#private`, decorator TC39 | Lab 14: service + abstract repo |
| 15 | Hiệu năng build | đo tsc 6.0.3 vs 7.0.2, incremental, project references | Lab 15: tách check/transpile, đo lại |
| 16 | Kiến trúc & type-driven | branded `Minutes`/`LabCode`, illegal states | **Dự án cuối khoá** (bài mới `typescript-16-6-du-an-cuoi-khoa`): LabFlow TS full-stack (API + React + Zod + Prisma + CI), máy chấm 100 điểm, kể dự án theo STAR |

## 10. Trạng thái
- 01/11/2026 — đợt mẫu **Mục 0 + Chương 1**: 7 + 6 bài (2 bài "Bắt đầu" + Lab 1 + quiz Mục 0 là bài MỚI), 11 deck / 130 slide đẩy `TS/v1`
  (`VER` rỗng), 31 đề Code Lab `ts` / 66 bài sai mẫu (kiem-de-ts 31/31), 8 cặp liên kết chéo. Độ dài (nguồn bài + giảng): 38–42k ký tự/bài.
  Các chương 4–16 (lúc viết dòng này) vẫn là bài cũ (chữ, video YouTube, chưa slide/lab/Code Lab) — soạn theo §5 + §9, bắt chước đợt mẫu.
- 01/11/2026 — **Chương 2 trọn**: 4 bài (slug giữ) + Lab 2 (MỚI `typescript-2-6-lab-lich-phong`) + quiz 10 câu; 5 deck / 58 slide đẩy `TS/v1`
  (ts-02-1..4 mỗi deck 12, ts-lab-2 10); 17 đề Code Lab `ts` mới (ts-cl-2-1..4 a–d + ts-cl-lab-2), 38 sai mẫu — kiem-de-ts 48/48 (tsc 7.0.2) và
  17/17 với tsc 6.0.3; 4 cặp liên kết chéo (postgresql 4.2, react 2.3, api-design 4.1, prisma-orm 8.3). Độ dài nguồn bài + giảng 43–47k ký tự.
  Cách làm: viết `$S/ts/BRIEF-CH2.md` rồi fork 4 tác tử soạn 4 bài song song (demo riêng `demo2/<deck>`, đề Code Lab ra tệp riêng rồi gộp),
  phiên chính làm Lab, quiz, tệp chương, liên kết chiều ngược, upload, ảnh chụp dự án.
- 01/11/2026 — **Chương 3 trọn**: 4 bài (slug giữ, nguồn bài + giảng 39–43k) + Lab 3 (MỚI `typescript-3-6-lab-luat-dat-phong`) + quiz 10 câu;
  5 deck / 58 slide đẩy `TS/v1`; 17 đề Code Lab `ts` mới (ts-cl-3-1..4 + ts-cl-lab-3) — kiem-de-ts 64/64 (tsc 7.0.2), ch3 16/16 với tsc 6.0.3;
  4 cặp liên kết chéo (api-design 3.1, nodejs 1.2, nodejs 1.4, react 2.2). Brief: `$S/ts/BRIEF-CH3.md` (cùng cách làm Ch2).
  ⚠️ Bẫy khi fork song song: một tác tử chạy tsc với `extends` sai ⇒ không `noEmit` ⇒ đẻ `.js`/`.d.ts` vào `src/rules/` và `demo*/` của dự án chung —
  luôn `find . -name "*.d.ts" -o -name "*.js"` (trừ `js/`, demo cố ý) trước khi rsync ảnh chụp.
- ~~Việc tiếp theo: Chương 4~~ (ĐÃ XONG 01/11, xem dòng dưới) (Object, interface & type alias — §9: mô hình miền Lab/User/Booking readonly/optional + `Record<LabCode, Lab>`, Lab 4).
  Làm y Ch2/Ch3: viết `$S/ts/BRIEF-CH4.md` (chép BRIEF-CH3, đổi bảng bài), fork 4 bài, phiên chính làm Lab 4 + quiz + tệp chương + liên kết ngược +
  upload + ảnh chụp `_labflow-ts` (cuối Ch3: 33 test, lab1/2/3 tham khảo 10/10).
- 01/11/2026 — **Chương 4 trọn**: 4 bài (slug giữ; nguồn bài + giảng 30–41k) + Lab 4 (MỚI `typescript-4-6-lab-mo-hinh-du-lieu`) + quiz 10 câu;
  5 deck / 56 slide đẩy `TS/v1` (ts-04-1 12, ts-04-2 12, ts-04-3 11, ts-04-4 11, ts-lab-4 10; 0 lỗi kiem-slide); 14 đề Code Lab `ts` mới (ts-cl-4-1 a–d,
  4-2 a–c, 4-3 a–c, 4-4 a–c, ts-cl-lab-4; 29 sai mẫu) — kiem-de-ts 78/78; track `typescript-practice` thêm 10 module (Ch3 + Ch4 ⇒ 26 module / 78 đề),
  `codelab-xuat-de` sạch, `codelab-ts-doi-chieu` 1813/1813 kiểm khớp tsc 7.0.2, Chromium web + app 78/78; 4 cặp liên kết chéo (react rx-1-2-props,
  prisma-orm pr-1-2, prisma-orm pr-8-2, api-design 3.4); video YT cho Lab 4. Làm MỘT phiên, KHÔNG fork (luật mới: tối đa 3 tác tử chạy cùng lúc).
- 03/11/2026 — **Chương 5 trọn**: 4 bài (slug giữ; nguồn bài + giảng ~233k/6 ≈ 39k/bài) + Lab 5 (MỚI `typescript-5-6-lab-may-trang-thai`) + quiz 10 câu;
  5 deck / 49 slide đẩy `TS/v1` (ts-05-1..4 mỗi deck 10, ts-lab-5 9; 0 lỗi kiem-slide); 14 đề Code Lab `ts` mới (ts-cl-5-1 a–d, 5-2 a–c, 5-3 a–c, 5-4 a–c,
  ts-cl-lab-5; 20 sai mẫu) — kiem-de-ts **92/92** (tsc 7.0.2), codelab-xuat-de 92 sạch, codelab-ts-doi-chieu **166/166** (TS 6.0.3 ↔ 7.0.2 khớp trên 14 đề mới);
  track `typescript-practice` thêm 5 module (⇒ 31 module / 92 đề). LabFlow TS thêm `src/rules/state.ts` + `state.test.ts` (8 test ⇒ `npm test` = **51**),
  `lab5/` (starter `step: string`, `kiem/{sai,dung}`, test, `yeu`=union+default bắt-hết, `vua`=assertNever+bảng mở), `scripts/cham-lab-5.mjs` (`npm run lab5`;
  A2·B1·C1·D2·E 8×0,25·**F2 thêm trạng thái mới ⇒ describe + STEP_LABEL phải đỏ**). Số đo Lab 5: khởi đầu **4/10** · `yeu` **8/10** (F 0/2, default bắt-hết) ·
  `vua` **9/10** (F 1/2, bảng mở) · tham khảo **10/10** (thêm `expired`: TS2345 ở assertNever + TS2741 ở Record đóng). 2 cặp liên kết chéo hai chiều
  (postgresql `postgresql-4-2-select-where`, api-design `api-2-1-problem-details`). Soạn MỘT phiên, KHÔNG fork. Ảnh chụp `_labflow-ts` cuối Ch5:
  51 test, lab1–5 tham khảo 10/10. **BookingState** (discriminated union trên `BookingRecord`) = lời giải Lab 5 ở `src/rules/state.ts`.
- 03/11/2026 — **Chương 6 trọn**: 4 bài (slug giữ; nguồn bài + giảng ~196k/6 ≈ 33k/bài) + Lab 6 (MỚI `typescript-6-6-lab-repository-generic`) + quiz 10 câu;
  5 deck / 43 slide đẩy `TS/v1` (ts-06-1 9, ts-06-2 8, ts-06-3 9, ts-06-4 8, ts-lab-6 9; 0 lỗi kiem-slide); 14 đề Code Lab `ts` mới (ts-cl-6-1 a–d, 6-2 a–c,
  6-3 a–c, 6-4 a–c, ts-cl-lab-6; 16 sai mẫu) — kiem-de-ts **106/106** (tsc 7.0.2), codelab-xuat-de 106 sạch, codelab-ts-doi-chieu **169/169**
  (một lệch 6↔7 đã vá: `new Repo<{ name }>()` TS 7.0.2 ⇒ TS2741, TS 6.0.3 ⇒ TS2344 ⇒ thêm `MA_THEM_TS6['ts-cl-lab-6']` trong `_chung.mjs`);
  track `typescript-practice` thêm 5 module (⇒ 36 module / 106 đề). LabFlow TS thêm `src/rules/repo.ts` + `repo.test.ts` (5 test ⇒ `npm test` = **56**) =
  lời giải Lab 6 (`Result<T, E = string>` + ok/err/mapResult/unwrapOr, `Repo<T extends { id: number }>` add/get/remove trả Result, `pluck<T, K extends keyof T>`, `groupBy<T, K>`),
  `lab6/` (starter `any`, `kiem/{sai,dung}`, test, `yeu`=không ràng buộc+cast+get trả T|undefined, `vua`=ràng buộc nhưng pluck key:string), `scripts/cham-lab-6.mjs`
  (`npm run lab6`; A2·B1·C1·D2·E 8×0,5). Số đo Lab 6: khởi đầu **4.5/10** (`any` không generic ⇒ `new Repo<User>()` TS2558) · `yeu` **6.5/10** · `vua` **7/10** · tham khảo **10/10**.
  **3 cặp liên kết chéo hai chiều** (react `rx-2-1-use-state` ↔ 6.1 useState là generic; api-design `api-2-3-envelope` ↔ 6.3 Result<T,E>; `api-2-2-validation` ↔ 6.4 generic chỉ-trả-về = phép ép kiểu).
  ⚠ Bẫy đã gặp: parameter property `constructor(readonly x)` ⇒ **TS1294** dưới `erasableSyntaxOnly` (dạy ở 6.3 như một điểm). Soạn MỘT phiên, KHÔNG fork.
  Ảnh chụp `_labflow-ts` cuối Ch6: 56 test, lab1–6 tham khảo 10/10.
- 04/11/2026 — **Chương 7 trọn**: 4 bài (slug giữ: 7.1 mapped-types, 7.2 mapping-modifiers, 7.3 conditional-infer, 7.4 template-literal-types;
  nguồn bài + giảng ~169k/6) + Lab 7 (MỚI `typescript-7-6-lab-he-su-kien`) + quiz 10 câu (slug giữ `typescript-7-5-quiz`); tệp chương `s07-advanced-types.mjs`.
  5 deck / 41 slide đẩy `TS/v1` (ts-07-1 9, ts-07-2 7, ts-07-3 8, ts-07-4 8, ts-lab-7 9; 0 lỗi kiem-slide). 13 đề Code Lab `ts` mới (ts-cl-7-1 a–c,
  7-2 a–c, 7-3 a–c, 7-4 a–c, ts-cl-lab-7; 14 sai mẫu) — kiem-de-ts **119/119** (tsc 7.0.2), codelab-xuat-de 13 sạch, máy chấm trình duyệt TS 6.0.3 **591/591**
  (một lệch 6↔7 đã vá: `emit('booking:created', { id: 1 })` thiếu trường ⇒ TS 7.0.2 TS2741, TS 6.0.3 TS2345 ⇒ thêm `MA_THEM_TS6['ts-cl-lab-7']` trong `_chung.mjs`);
  track `typescript-practice` thêm 5 module (⇒ 41 module / 119 đề). LabFlow TS thêm `src/rules/events.ts` + `events.test.ts` (2 test ⇒ `npm test` = **58**) =
  lời giải Lab 7 (template literal `BookingEvent` = `booking:${BookingAction}`, bản đồ `EventPayloads`, conditional `PayloadOf`, `EventBus` generic theo sự kiện với
  `HandlerMap` khởi tạo đủ mọi sự kiện ⇒ `on`/`emit` không cast, `Frozen`/`Patch` mapped), `demo7/` (20 demo đo thật cho 4 bài), `lab7/` (starter string/any,
  `kiem/{sai 8 dòng,dung}`, test, `yeu`=tên có kiểu nhưng bus `unknown`, `vua`=đúng trừ `Patch` index-signature), `scripts/cham-lab-7.mjs` (`npm run lab7`; A2·B1·C1·D2·E 8×0,5).
  Số đo Lab 7: khởi đầu **5/10** · `yeu` **7.5/10** · `vua` **9.5/10** · tham khảo **10/10**.
  **3 cặp liên kết chéo hai chiều** (api-design `api-7-2-sinh-code` ↔ 7.1 suy kiểu không trôi; `api-1-2-phuong-thuc` ↔ 7.2 PATCH body = Partial; `api-2-4-i18n` ↔ 7.4 khoá câu chữ = template literal).
  Ảnh chụp `_labflow-ts` cuối Ch7 (verify sạch: npm ci + tsc 0 lỗi + 58 test + lab7 5/7.5/9.5/10): 58 test, lab1–6 + events 10/10. Soạn MỘT phiên, KHÔNG fork.
- **⏸ TẠM DỪNG sau Chương 7 (04/11/2026, chờ chủ kênh soát mẫu). Việc tiếp theo: Chương 8** (§9 — Utility types: Partial, Required, Pick, Omit, Record, ReturnType…
  đặt tên cho các mapped/conditional type của Ch7). Làm y Ch5/Ch6/Ch7: MỘT phiên KHÔNG fork, dựng demos thật rồi sinh `_ma`, deck→kiem-slide→render→R2 `TS/v1`,
  đề Code Lab `ts` + nguon + `_track.json` + xuat-de + máy chấm trình duyệt, liên kết chéo hai chiều, cập nhật ảnh chụp `_labflow-ts`,
  `git rev-parse HEAD` lại ngay trước commit-tree (phiên khác cũng commit vào main). Không phiên nào đang giữ thư mục tạm: `$S/ts/lab/labflow-ts` dựng lại từ `_labflow-ts` + `npm ci` là đủ.
- Bài mẫu để chép: `s01/ba-con-bug.mjs` (bài thường), `s01/lab.mjs` (lab), `s01/quiz.mjs` (quiz). Deck đọc `CODE/OUT` thẳng từ `_ma-<deck>.mjs`
  (`import { CODE, OUT } from '../../content/courses/typescript/s01/_ma-ts-01-1.mjs'`) ⇒ slide không bao giờ lệch output bài đọc.
- Bẫy khi soạn đã gặp: `tsc <file>` trong dự án ⇒ TS5112 (dùng `-p`); emit `.d.ts` từ thư mục demo mà import `../../src` ⇒ cần `"rootDir": "../.."`
  (TS5011/TS6059), và đừng emit vào `src/` (một lần đã để lại `src/rules/*.d.ts` — xoá trước khi chụp); `Array.isArray(unknown)` cho `any[]`.
