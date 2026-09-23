# Hợp đồng nâng cấp — khoá "Git & GitHub" (/courses/git)

> Đọc HẾT file này trước khi sửa một dòng nào. Nhiều agent nâng cấp song song từng chương;
> file này giữ cho cả khoá trông như do MỘT người viết.
> **Bài mẫu đã làm xong:** Chương 1 — `content/courses/git/s01-mo-hinh.mjs` + deck
> `scripts/slides-src/git-01.mjs`. Chỗ nào file này không nói, bắt chước đúng hai file đó.

## 0. Việc này là NÂNG CẤP, không phải viết lại

Khoá đã có 14 phần (Mục 0 + Chương 1–13), mỗi bài ~15–20k ký tự song ngữ, chữ tốt. Thiếu:
slide/ảnh, bài tập nhỏ đều đặn, thuật ngữ cho người yếu tiếng Anh, tóm tắt, và quiz tử tế
(quiz cũ: 8 câu, KHÔNG có giải thích, đáp án gần như luôn là B).

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **KHÔNG xoá, KHÔNG rút gọn** nội dung cũ. Chỉ CHÈN thêm. Sửa câu chữ cũ chỉ khi nó SAI (và nói rõ trong báo cáo).
   Bộ kiểm so độ dài từng bài với bản trong git HEAD — ngắn đi một ký tự là báo lỗi.
2. **KHÔNG đổi `slug`** của bài nào đã có (slug = khoá gắn tiến độ học + video).
3. **KHÔNG đổi `title` của CHƯƠNG** (trường `title` cấp section). Bài đầu chương sẽ là bài mới
   (N.0) nên bộ seed tìm chương bằng tiêu đề — đổi tiêu đề là nó tạo ra một chương trùng.
   `title` của từng BÀI thì được đổi (vd đánh số lại "11.3" → "11.4").
4. Chỉ sửa 2 file của chương mình: `content/courses/git/sNN-*.mjs` và `scripts/slides-src/git-NN.mjs` (tạo mới).
   KHÔNG sửa `_slides.mjs`, `_git-chung.mjs`, `_cr-chung.mjs`, `_render-slides.mjs`, manifest `git.mjs`,
   file của chương khác, `content/course-videos/`. Không commit, không push, không seed, không upload.

## 1. Người học (viết cho ĐÚNG người này)

- **Cường** — sinh viên CNTT FPTU, tự dựng cuongthai.com (Next.js + Node.js + Prisma + Docker, deploy VPS,
  repo trên GitHub). Dùng Git hằng ngày nhưng theo kiểu "add . / commit / push", sợ rebase, từng lỡ push nhầm.
- **Yếu tiếng Anh.** Mọi thuật ngữ tiếng Anh có nghĩa tiếng Việt NGAY cạnh lần đầu xuất hiện trong khối VI:
  "fast-forward (tua thẳng)", "upstream (kho gốc)". Mỗi bài có ô 🗂 Thuật ngữ.
- Làm đồ án nhóm ở trường (SWP391…) với 4–5 bạn — ví dụ về làm việc nhóm nên lấy bối cảnh đó.
- Máy: Mac M1 (zsh), có máy Linux; bạn cùng nhóm hay dùng Windows ⇒ khi lệnh khác nhau giữa OS thì nói.

## 2. Mỗi chương sau khi nâng cấp gồm

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `git-N-0-slides` (N không đệm 0: `git-3-0-slides`, `git-10-0-slides`) | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1 đoạn), rồi MỘT `${gallery('git-NN', [[1,'Bìa'], …])}` đặt SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide |
| N.1… | slug cũ giữ nguyên | `LESSON` (giữ type cũ) | bài cũ + phần chèn thêm (mục 3) |
| (tuỳ) | `git-N-K-<ten>` với K chưa dùng | `LESSON` | **Chỉ** thêm bài mới khi chương có lỗ hổng kiến thức THẬT (mục 5) |
| cuối | slug quiz cũ giữ nguyên | `QUIZ` | viết lại theo mục 4 |

Mọi bài mới: `isFreePreview: true`. Bài cũ giữ nguyên `isFreePreview` như đang có.
`title` dạng `'N.M — English|||N.M — Tiếng Việt'`, cả chuỗi ≤ 180 ký tự. `description` 1 câu tiếng Việt.
Đầu file thêm `import { gallery, slide } from './_slides.mjs';`.

## 3. Chèn gì vào MỖI bài dạy cũ (cả khối EN lẫn khối VI)

1. **2–4 slide** bằng `${slide('git-NN', n, 'chú thích ngắn')}` đặt NGAY SAU dòng `<h3>…</h3>` của đoạn đang
   giảng đúng nội dung slide đó (cùng slide ở cả hai khối ngôn ngữ; chú thích tiếng Việt dùng cho cả hai).
2. Ngay TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối ngôn ngữ (không có thì trước `<div class="pitfall"`),
   chèn ba mục theo đúng thứ tự và đúng tiêu đề (bộ kiểm tìm emoji):
   - EN `<h3>🧪 Practice (15–20 min)</h3>` / VI `<h3>🧪 Thực hành (15–20 phút)</h3>` —
     `<div class="callout ok"><ol><li>…</li></ol>` + (tuỳ) một khối lệnh/kết quả + `<p><strong>Done when: / Đạt khi:</strong> tiêu chí KIỂM ĐƯỢC</p></div>`.
     Bài tập làm được trong kho sân tập `thu-git` (Chương 1 tạo), 3–5 bước, có tình huống thật (không phải "hãy thử lệnh X").
   - EN `<h3>🗂 Key terms</h3>` / VI `<h3>🗂 Thuật ngữ trong bài</h3>` — `.kv-grid` 4–6 mục; bên VI: `Thuật ngữ gốc` → nghĩa tiếng Việt + giải thích 1 câu.
   - EN `<h3>📌 Summary</h3>` / VI `<h3>📌 Tóm tắt</h3>` — `<ul>` 4–5 ý, mỗi ý một câu chốt.
3. Được thêm (không bắt buộc) khối `.callout`/`.pitfall co-tieu-de`/ví dụ vào giữa bài nếu thật sự thiếu —
   ưu tiên sai lầm thật của sinh viên làm đồ án nhóm.

Bài tập + thuật ngữ + tóm tắt bên EN là bản song song ĐẦY ĐỦ ý của bên VI, không phải bản rút gọn.
Mẫu chính xác: xem 5 bài trong `s01-mo-hinh.mjs` (tìm `🧪`).

## 4. Quiz cuối chương — viết LẠI hoàn toàn

- `content`: hai khối EN/VI: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>`
  với `<ul>` 4–6 dòng "Tôi làm được…", rồi `${slide('git-NN', <slide bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
- `quiz: { timeLimitSeconds: 900, questions: [ …10 câu… ] }`. Mỗi câu:
  `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
  Phương án chỉ gồm lệnh/code giống nhau hai ngôn ngữ thì viết một lần, không cần `|||` (xem câu 3, câu 10 của Ch1).
- **Tình huống thực tế** ("Bạn vừa force-push lên nhánh chung và bạn cùng nhóm báo mất commit…") hơn là hỏi định nghĩa.
- `explanation` nói vì sao đúng + vì sao phương án hấp dẫn nhất lại SAI.
- **Rải đáp án**: 10 câu, mỗi vị trí A/B/C/D xuất hiện 2–3 lần. Phương án sai phải hợp lý (không đùa), độ dài tương đương đáp án đúng.
- Ngoại lệ: **Mục 0** không có quiz → không thêm. **Chương 13** bài `git-13-3-kiem-tra-cuoi-khoa`: đổi title thành
  "13.3 — Chapter 13 check|||13.3 — Kiểm tra Chương 13" và viết 10 câu về Chương 13 (bài thi cuối khoá thật chuyển sang Chương 16).

## 5. Thêm bài mới trong chương cũ? (thận trọng)

Chỉ khi có lỗ hổng rõ ràng mà người học thật sẽ vấp và chương khác KHÔNG dạy (grep cả thư mục `content/courses/git/`
trước khi quyết). Tối đa 1 bài/chương, cùng chuẩn độ dài với bài cũ (khối VI 8–12k ký tự), có đủ slide/🧪/🗂/📌.
Không thêm cũng hoàn toàn ổn — nói rõ trong báo cáo vì sao.

## 6. Slide — `scripts/slides-src/git-NN.mjs` (NN có đệm: git-00 … git-16)

```js
import { S, cover, cards, box, steps, table, vs, kpis, flow, tag, two, list, code, mindmap, graph, trees, term, diagram, conflict } from './_git-chung.mjs';
export const deck = { key: 'git-NN', code: 'GIT · CHƯƠNG N', title: '<tên chương ngắn>', sub: 'Git & GitHub · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
- **12–18 slide**: bìa → bản đồ chương (mindmap) → slide khái niệm theo thứ tự bài → 1 slide "Bảng tra nhanh" → 1 slide "Thực hành chương N".
- **Ưu tiên HÌNH hơn chữ.** Git sinh ra để vẽ: nhánh, merge, rebase, reset, remote… Mỗi khái niệm có hình thì PHẢI dùng hình:
  - `graph({commits, refs, lanes, …})` — đồ thị commit (đọc chú thích đầu hàm trong `_git-chung.mjs`). Trước/sau một lệnh
    (rebase, reset, merge) vẽ HAI đồ thị hoặc dùng `ghost: true` cho commit cũ bị bỏ rơi.
  - `trees({wd, idx, head, arrows})` — ba cây. `term([...])` — terminal (`$ ` lệnh, `! ` đỏ, `= ` xanh, `+ ` vàng, `# ` chú thích).
  - `diagram({nodes, edges})` — hộp+mũi tên (local/remote, fork/upstream, CI…). `conflict({ours, base, theirs})` — vùng xung đột.
  - Khối chung: `cards`, `box`, `steps`, `table`, `vs`, `kpis`, `flow`, `two`, `list`, `code`, `mindmap`.
- Chữ trên slide tiếng Việt, ngắn (≤ ~45 từ ngoài hình). Tham số chữ vào graph/diagram/term là chuỗi thường (hàm tự escape);
  tham số HTML (cards/box/steps/table) tự viết `&amp;` `&lt;`.
- **Output terminal/diff trên slide phải là output THẬT** (mục 7).
- Kiểm tràn: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/git-NN.mjs` (phải "không slide nào tràn").
- Render: `node scripts/_render-slides.mjs --deck scripts/slides-src/git-NN.mjs --out <RENDER>` (RENDER do người điều phối đưa).
- ⛔ **MỞ TỪNG ẢNH RA NHÌN** bằng công cụ Read. Bộ đo tràn KHÔNG thấy: nhãn nhánh đè commit, mũi tên đâm xuyên chữ,
  hộp diagram chồng nhau, nhãn bị cắt mép SVG, một cột hẹp làm chữ rớt mỗi dòng một từ. Sửa tới khi mọi slide sạch.
  Vùng thân ~1168×520px; chữ đơn cách rộng ~0,6×cỡ chữ; graph: đặt `w`/`h`/`dx`/`y0` sao cho nhãn ref (mặc định ở TRÊN
  commit, `side:'down'` ở dưới) không ra ngoài khung.
- Cần hình kiểu mới? Vẽ `<svg>` nội tuyến ngay trong deck của mình. KHÔNG sửa `_git-chung.mjs`.

## 7. Độ chính xác — luật cứng

1. **Mọi lệnh git và output in trong bài/slide phải CHẠY THẬT** (máy có git 2.51) trong một kho thử ở thư mục scratch
   (KHÔNG chạy trong repo api-backend, KHÔNG để file rác trong repo). Mã băm trong output là mã thật của lần chạy đó.
   Output dài thì được cắt bớt dòng, không được sửa chữ.
2. Tính năng GitHub (rulesets, Actions, Pages, Codespaces, Copilot, gói sinh viên…) hay đổi: kiểm trên docs.github.com /
   github.blog / education.github.com bằng WebFetch trước khi viết con số, tên menu, giới hạn; ghi mốc "(tính đến 09/2026)".
3. **Mọi URL mới phải GET thật** → 200 (theo redirect). Thà ít link còn hơn link chết.
4. Không bịa trích dẫn, không bịa số liệu.

## 8. Thoát ký tự trong template literal (bộ kiểm chặn)

- Không backtick trần → `&#96;`. `${` trong mã mẫu → `\${`. Gạch chéo ngược → `\\`.
- Trong `<pre><code>`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Mã: `<pre><code class="language-bash">…</code></pre>`.
- Output lệnh: `<div class="out">…</div>`. Chú thích trong mã: `<span class="tok-comment"># …</span>`.
- KHÔNG `<svg>`, iframe, script, style trong nội dung bài (bị lọc) — hình đi qua slide.
- Phím bấm viết trong `<code>` (site gỡ `<kbd>`). Chuỗi JS nháy đơn (title/quiz): không `\\'`; dùng `’` hoặc nháy kép.
- Khối được phép: `.eyebrow .lead h3 p ul ol table .kv-grid>.kv>.k/.v .callout.ok|.warn|.danger .pitfall(.co-tieu-de)
  .note-ct .lz-flow>.lz-step .lz-stack>.lz-layer .out .link-card` — bắt chước đúng cách chương đang dùng.

## 9. Kiểm trước khi báo xong

```bash
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/git-NN.mjs
node scripts/_render-slides.mjs  --deck scripts/slides-src/git-NN.mjs --out <RENDER>
node scripts/git-ghep-chuong.mjs content/courses/git/sNN-*.mjs --render <RENDER>        # chương mới: thêm --moi
node scripts/course-content-check.mjs ./content/courses/git.mjs
```
Cả ba phải sạch. Rồi **đọc lại** bài tập/quiz của mình một lượt: con số có khớp nhau không, lệnh trong bài tập có
đúng thứ tự chạy được không, đáp án đúng có thật sự đúng không.

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · danh sách bài + độ dài trước→sau · bài mới (nếu có) và lý do · câu chữ cũ đã sửa vì sai (nếu có) ·
phân bố đáp án quiz · slide nào đã phải sửa sau khi nhìn và vì sao · điều gì chưa chắc/chưa kiểm được.
