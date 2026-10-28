# Hợp đồng soạn — khoá "Operating Systems for Developers" (/courses/operating-systems-for-developers)

> Đọc HẾT file này trước khi sửa một dòng nào. Nhiều agent soạn song song từng chương; file này giữ cho cả khoá
> trông như do MỘT người viết. **Bài MẪU đã soạn xong, bắt chước y hệt:** Mục 0 (`s00-gioi-thieu.mjs`) và Chương 1
> (`s01-tien-trinh.mjs`) + các kịch bản output `lab/code/**` → `lab/out/*.out.txt`. Chỗ nào file này không nói, làm
> như Chương 1.

## 0. Khoá này KHÁC gì và vì sao nó tồn tại

Người học: **Cường** — SV CNTT FPTU, đang học môn OSG202, muốn làm **backend / bảo mật**, tự dựng cuongthai.com
(Next.js + Express/TS + Prisma + PostgreSQL + nginx, Docker Compose trên một VPS). Câu của chủ kênh (28/10/2026):

- *"cả ngày làm việc bằng linux: xem tiến trình nào ăn tài nguyên, bộ nhớ cạn hay ổ đĩa đầy, container — mà tôi đọc
  không hiểu gì"* ⇒ Chương 2 dạy đúng kỹ năng đó, kể như sự cố thật của chính dự án.
- *"rất nhiều lỗ hổng nằm ở tầng hệ điều hành; muốn phân tích mã phải hiểu chương trình nằm trong bộ nhớ ra sao"*
  ⇒ Chương 13 (bảo mật tầng OS, **thuần phòng thủ**).
- *"backend xử lý hàng nghìn yêu cầu cùng lúc thì bắt buộc phải hiểu tiến trình và luồng"* ⇒ Chương 3–6.
- *"môn này khó vì tôi không THẤY được thứ mình đang học… Database ít ra còn chạy ra kết quả"* ⇒ **MỌI khái niệm
  trừu tượng phải THẤY được** (mô phỏng tương tác /os-lab) **VÀ ĐO được** (output chạy thật trong lab).

Ranh giới: `linux-bash` dạy DÙNG hệ điều hành (lệnh). Khoá này dạy CƠ CHẾ bên trong + hệ quả lên code. Academy OSG202
(123 bài + 8 deck ⭐) KHÔNG trùng — trỏ sang nó khi hữu ích ("Nếu đã học OSG202 bài …"), đừng chép lại.

⛔ **LUẬT CỨNG:**
1. **KHÔNG đổi `slug` bài** nào đã seed (slug = khoá gắn tiến độ học + video). **KHÔNG đổi `title` của CHƯƠNG** (seeder
   neo chương bằng tiêu đề). `title` từng BÀI thì đổi được.
2. Chỉ sửa 2–3 file của chương mình: `sNN-*.mjs` (+ `scripts/slides-src/os-NN-*.mjs`, + kịch bản `lab/code/**`). KHÔNG
   sửa `_ui.mjs`, `_lab.mjs`, `_slides.mjs`, manifest `operating-systems-for-developers.mjs`, file chương khác.
3. **MỌI lệnh và output MỚI phải CHẠY THẬT** trong ảnh `os-lab` (mục 5). Không bịa output, không bịa số đo, không bịa
   trích dẫn/sự cố. Output cũ của bài mẫu không cần chạy lại.
4. KHÔNG commit/push/seed/upload trừ khi người điều phối bảo. Thấy thư viện (`_ui.mjs`/`_lab.mjs`) thiếu gì ⇒ ghi vào
   báo cáo, đừng tự sửa file chung.

## 1. Khung MỖI chương (6 bài mẫu Chương 1)

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.1 … N.k | `os-N-1-<ten>` … (slug đã seed) | `LESSON` | bài dạy đầy đủ (mục 2) |
| cuối | `os-N-<k+1>-quiz` | `QUIZ` | 10 câu có giải thích (mục 3) |

- Mọi bài `isFreePreview: true`. `title` dạng `'N.M — English|||N.M — Tiếng Việt'`, cả chuỗi ≤ 180 ký tự.
  `description` một câu tiếng Việt.
- Mục 0 có thêm HAI bài "Bắt đầu tại đây" (`os-0-8-…`, `os-0-9-…`) đứng trước — đã soạn, đừng đụng.
- Bài mẫu KHÔNG có bài "N.0 slide" riêng như vài khoá cũ: slide được **nhúng TRONG từng bài dạy** bằng `walk()`/`slide()`
  (mục 4), đúng kiểu khoá PostgreSQL.

## 2. Mỗi bài dạy (cả khối EN lẫn khối VI, song song ĐẦY ĐỦ ý)

Khung HTML (xem bất kỳ bài nào của Chương 1):
```
<div class="ml-en"> … </div>
<div class="ml-vi"> … </div>
```
Mỗi khối: `<span class="eyebrow">` → `<h2>` → `<p class="lead">` (đặt ra CÂU HỎI bài trả lời) → các mục `<h3>` + đoạn
giảng + **output chạy thật** + **ít nhất một mô phỏng** (`${lab(...)}`) + ít nhất một `.pitfall co-tieu-de` (sai lầm
thật) → ba mục cuối theo đúng thứ tự và đúng tiêu đề:
- `<h3>🧪 Practice (…)</h3>` / `<h3>🧪 Thực hành (…)</h3>` — `.callout ok`, **tình huống THẬT** ("container của nhóm
  cứ thoát 137…"), 3–5 bước làm trong lab, `<p><strong>Done when / Đạt khi:</strong> tiêu chí KIỂM ĐƯỢC</p>`.
- `<h3>🗂 Key terms</h3>` / `<h3>🗂 Thuật ngữ trong bài</h3>` — `${kv([...])}` 5–8 mục; bên VI: `Thuật ngữ gốc
  (nghĩa Việt)` → một câu dễ hiểu.
- `<h3>📌 Summary</h3>` / `<h3>📌 Tóm tắt</h3>` — `<ul>` 4–6 ý chốt.
Cuối mỗi khối: 1–2 `${L(url, …)}` link-card nguồn chính thức (man7, kernel.org, docs chính hãng) — **URL phải GET
được 200**.

Dựng output bằng helper `_ui.mjs` (ĐỌC chú thích đầu file):
- `run('tenKichBan', 'tiền tố lệnh', n)` — cắt NGUYÊN VĂN `n` lệnh (kèm output) từ `lab/out/tenKichBan.out.txt`, bắt
  đầu từ lệnh có tiền tố đó. `whole('ten')` lấy cả file. `code('…', 'bash|c|js|java')` khối mã. `cmd('dòng1','dòng2')`
  khối lệnh nhiều dòng (ĐỪNG dùng template literal lồng — bộ kiểm cấm backtick trong thân bài). `src('ch0N/file.c')`
  in NGUYÊN mã nguồn thật người học sẽ chạy.
- ⇒ Quy trình: viết chương trình vào `lab/code/chNN/*.{c,js,java,py}`, viết kịch bản `.sh` gõ lệnh, chạy bằng `phien`
  (mục 5) ra `lab/out/<ten>.out.txt`, rồi bài chỉ `run('<ten>', '<lệnh>')`. Lệnh đổi/xoá ⇒ `run()` ném lỗi (không
  lặng lẽ sai). **KHÔNG chép output bằng tay.**

## 3. Quiz cuối chương (viết hoàn toàn)

- `content`: hai khối EN/VI (eyebrow + h2 + lead + `<h3>Self-check…/Tự kiểm…</h3>` với `<ul>` 5 dòng "Tôi làm được…").
- `quiz: { timeLimitSeconds: 900, questions: [ …10 câu… ] }`. Mỗi câu:
  `{ question:'EN|||VI', options:['EN|||VI' ×4], correctIndex, points:1, explanation:'EN: …|||VI: …' }`.
- **Tình huống thực tế** + ưu tiên "output này là gì" / "mã thoát nào" / "dòng nào sửa được". `explanation` nói vì sao
  đúng + vì sao phương án hấp dẫn nhất lại SAI. **Rải đáp án** (mỗi vị trí A/B/C/D 2–3 lần). Đáp án về output/mã thoát
  phải CHẠY THẬT để chắc.

## 4. Slide — nhúng TRONG bài (khuôn PostgreSQL)

Mỗi bài có một deck `scripts/slides-src/os-NN-X.mjs` (NN có đệm, X = số bài: `os-01-2`, hoặc `os-lab-1`). Dựng bằng
khuôn chuẩn `scripts/slides-src/_pg-chung.mjs` (slide TIẾNG ANH, dáng slide trường FU, logo CuongThai.com) — mẫu đầy
đủ: `scripts/slides-src/osg-cs1.mjs` … `osg-cs8.mjs` (deck ⭐ của OSG202, cùng chủ đề).
```js
import { lamDeck, sql, psql, sh, two, box, cards, steps, kw, vsd, run, tbl, flow } from './_pg-chung.mjs';
export const deck = { key: 'os-01-2', code: 'OS 1.2', title: 'fork, exec, wait', sub: 'Operating Systems · Chapter 1' };
export const slides = lamDeck({ khoa: 'Operating Systems', duong: 'courses/operating-systems-for-developers',
  bieuTuong: '🧠', khau: 'from zero to real backend work', chuong: 'Chapter 1 — Processes', bai: '1.2' }, [
  { cover: true, t: 'fork, exec, wait', sub: 'How every process is born' },
  { t: 'Learning goals', body: `<ul><li>…</li></ul>` },
  … 12–20 slide, mỗi slide MỘT ý, tiêu đề là một câu khẳng định …
]);
```
- Code không phải SQL ⇒ `sql(src, { lang: 'c'|'javascript'|'java' })`; terminal ⇒ `sh(text)`; output ⇒ `psql(text,
  { title:'output' })`; mã + output ⇒ `run(src, out)`. Hình mới (timeline, máy trạng thái, cây tiến trình) ⇒ vẽ
  `<svg>` nội tuyến bằng `sv/R/T/A` hoặc công thức chữ `tw = len*0.602*fs` như trong `osg-cs2.mjs`.
- **Lấp đều khung** (chủ kênh dặn): slide ít ý ⇒ `{ to:true }`/`{ giua:true }`, không để nửa dưới trống; chữ thân
  24–28px, mã ≤ ~14 dòng/slide.
- Bài nhúng slide bằng `walk()` của `_slides.mjs`:
  ```js
  import G from './giang/os-01-2.mjs';   // = walk('os-01-2', 'EN title', 'Tên VI', [[n,'Slide title','<p>EN…</p>','<p>VI…</p>'], …])
  // rồi đặt ${G} ở ĐẦU content của bài (trước khối .ml-en đầu tiên) — rows phủ ĐỦ mọi slide, mỗi số một lần.
  ```
- Quy trình: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/os-NN-X.mjs` (không slide nào tràn) →
  `node scripts/_render-slides.mjs --deck … --out <RENDER>` → **MỞ TỪNG ẢNH bằng Read, sửa tới khi sạch** (bộ đo tràn
  KHÔNG thấy mũi tên đâm chữ, hộp chồng, nhãn bị cắt) → `node --env-file=.env scripts/upload-academy-slides.mjs --dir
  <RENDER> --prefix OS/v1 --decks os-NN-X`. Sửa deck đã đẩy ⇒ prefix OS/v2 + ghi vào `VER` trong `_slides.mjs`.

## 5. Môi trường & AN TOÀN — luật cứng (máy thật đang chạy việc thật)

Ảnh lab = `os-lab` (dựng từ `lab/moi-truong/Dockerfile`: Ubuntu 26.04, gcc 15, gdb, strace, ltrace, valgrind, perf,
procps/sysstat/htop/stress-ng, Java 21, Node 22, Python 3.14). `nproc` = số lõi máy; Docker Desktop trên máy soạn bài
Apple Silicon ⇒ arm64, nhân `linuxkit`.

- Chạy output: `docker run --rm --label oslab=1 --hostname oslab -v "$PWD/chNN":/lab/chNN -w /lab/chNN os-lab bash -c
  "phien kichban.sh 2>&1" > lab/out/<ten>.out.txt`. `phien` in "$ lệnh" rồi output trong CÙNG một shell (copy từ
  `lab/moi-truong/phien.sh`).
- ⛔ Lệnh phá huỷ / đổi hệ thống (OOM, fill đĩa, kill hàng loạt, mount, `--privileged`, cgroup) **CHỈ trong container
  `os-…` vứt đi**. Container của bạn: `--label oslab=1`, tên bắt đầu `os-`; cần quyền cao ⇒ `--privileged` NGẮN hạn.
- Trên Mac NGOÀI container: chỉ lệnh CHỈ ĐỌC. KHÔNG sửa dotfile/`~/.ssh`/crontab/launchd, KHÔNG `sudo`, KHÔNG đụng
  container thật `cuong_pg_new`, `cuonghoang_redis`, `sonarqube-swt301`, các container `labflow*`. Cấm `docker prune`
  không có `--filter label=oslab=1`.
- Mạng ra ngoài chỉ tới trang công khai lành (example.com, httpbin.org, man7.org, api.github.com không token).
- Xong: `docker ps -a --filter label=oslab=1` phải rỗng (dọn hết container `os-…`).

## 6. Thoát ký tự trong template literal (bộ kiểm `course-content-check.mjs` đọc MÃ NGUỒN)

- **KHÔNG backtick trần trong thân bài** — khối lệnh nhiều dòng dùng `cmd('d1','d2')`, không `code(\`…\`)` lồng.
- Trong `<pre><code>` / `.out`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;` (vd `2>&1` → `2&gt;&amp;1`, `&&` →
  `&amp;&amp;`). Thường thì dùng `code()`/`out()` của `_ui.mjs` (tự escape) thay vì viết tay.
- `${var}` của bash trong một chuỗi template (hiếm) phải viết `\${`; gạch chéo ngược đôi `\\`. Regex trong `${…}` có
  `\s`/`\d` ⇒ bộ kiểm hiểu nhầm là "trong thân bài": tránh (dùng hàm/`[ \t]` hoặc đừng dùng tới).
- KHÔNG `<svg>`/iframe/script/style trong nội dung bài (bị `sanitizeHtml` lọc) — hình đi qua slide hoặc mô phỏng.
- Khối HTML được phép: `.eyebrow .lead h2 h3 p ul ol table .kv-grid>.kv>.k/.v .callout.ok|.warn|.danger
  .pitfall(.co-tieu-de) .out .link-card details/summary` + các khối của `_ui.mjs`/`_lab.mjs`.

## 7. Mô phỏng (phòng lab trực quan) — chỉ dùng cái đã có

`${lab(sim, preset, 'en'|'vi', 'chú thích')}` (từ `_lab.mjs`). Danh mục CÓ SẴN (khớp
`frontend/src/components/os-lab/registry.ts`): **process** (shell/zombie/orphan/fork3/oom137/threads/sandbox) ·
**scheduler** (textbook/convoy/rr/interactive/multicore/nice) · **race** (none/mutex/atomic/deadlock/ordered) ·
**memory** (layout/stack/overflow) · **vm** (program/walk/pressure/exam/belady/loop) · **latency** (default). Tên/preset
lạ ⇒ `lab()` ném lỗi. **Cần một mô phỏng chưa có** (vd ipc, fs/inode, io/epoll, container, perf flamegraph) ⇒ ghi vào
báo cáo cho người điều phối dựng component React mới + thêm vào registry; ĐỪNG tự chế HTML/JS trong bài (bị lọc).

## 8. Kiểm trước khi báo xong

```bash
node scripts/course-content-check.mjs ./content/courses/operating-systems-for-developers.mjs   # 0 lỗi, 0 thoát ký tự sai
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/os-NN-X.mjs                          # mỗi deck
# render từng deck, MỞ TỪNG ẢNH bằng Read, sửa tới khi sạch
docker ps -a --filter label=oslab=1                                                              # phải rỗng
```
Rồi **đọc lại** bài tập/quiz của mình: con số có khớp không, lệnh bài tập chạy được theo đúng thứ tự không, đáp án
đúng có thật đúng không, mỗi bài có ≥1 mô phỏng + ≥1 pitfall + 🧪/🗂/📌 ở CẢ hai ngôn ngữ.

## 9. Báo cáo (ngắn, tiếng Việt)

Số bài + độ dài · output thật đã chạy (kịch bản nào, lệnh nào) · mô phỏng đã nhúng (bài nào, sim nào) · slide (deck
nào, bao nhiêu slide, slide nào phải sửa sau khi nhìn) · phân bố đáp án quiz · mô phỏng/khả năng còn THIẾU mà bài cần
· điều gì chưa chắc/chưa đo được · xác nhận đã dọn container `os-…`.
