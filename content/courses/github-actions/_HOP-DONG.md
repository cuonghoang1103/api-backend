# Hợp đồng nâng cấp — khoá "GitHub Actions" (/courses/github-actions)

> Đọc HẾT file này trước khi sửa một dòng nào. Quy trình CHÉP từ khoá Docker (xong 24/09/2026, 17 phần) — hợp đồng
> gốc `content/courses/docker/_HOP-DONG.md` là nền; file này ghi lại đầy đủ phần áp dụng cho GitHub Actions.
> **Chuẩn chất lượng để bắt chước:** khoá Docker — đọc có chọn lọc `content/courses/docker/s01-mo-hinh.mjs`
> (một bài: slide sau h3, 🧪/🗂/📌, phần đào sâu, quiz có giải thích) + deck `scripts/slides-src/dk-01.mjs`; mở xem ảnh
> `<RENDER>/dk-01/011.webp`, `017.webp`, `022.webp` (nếu còn) — hình tự vẽ dạy đúng một ý, số liệu thật, terminal thật.

## 0. Việc này là NÂNG CẤP + ĐÀO SÂU, không phải viết lại

Khoá có 12 phần (Mục 0 + Chương 1–11), 5 bài dạy/chương (type `VIDEO`), mỗi bài ~15–22k ký tự song ngữ, chữ tốt, giọng
riêng (nói thẳng, lấy sự cố thật của chính repo cuongthai.com). Thiếu: **slide (0 ảnh)**, 🧪 bài tập, 🗂 thuật ngữ, 📌 tóm
tắt, và quiz tử tế (8 câu, KHÔNG giải thích, **mọi đáp án đều là A**). Mục 0 không có quiz.

Người dùng (24/09/2026): công ty phỏng vấn nói *"nếu học được và nắm vững kỹ năng + môn này từ cơ bản đến chuyên gia
thì sẽ nhận"* ⇒ khoá phải đưa người học tới mức **viết, đọc, sửa, bảo mật, tăng tốc và chẩn đoán** pipeline CI/CD thật,
và **trả lời được câu phỏng vấn**. Trước đó user dặn: *"slide chi tiết từng bài, bài giảng chi tiết để tôi dễ học…
video chuyên sâu đúng bài"*.

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **KHÔNG xoá, KHÔNG rút gọn** nội dung cũ. Chỉ CHÈN. Sửa câu chữ cũ chỉ khi SAI (nói rõ trong báo cáo).
   Bộ kiểm so độ dài từng bài với bản git HEAD — ngắn đi là lỗi.
2. **KHÔNG đổi `slug`** bài đã có. **KHÔNG đổi `type`** bài đã có (bài dạy cũ là `VIDEO` — giữ `VIDEO`).
3. **KHÔNG đổi `title` của CHƯƠNG** (trừ Chương 11 — mục 4c). `title` từng BÀI thì được đổi.
4. Chỉ sửa 2 file của chương mình: `content/courses/github-actions/sNN-*.mjs` + `scripts/slides-src/ga-NN.mjs` (tạo mới).
   KHÔNG sửa `_slides.mjs`, `_ga-chung.mjs`, `_dk-chung.mjs`, `_git-chung.mjs`, `_cr-chung.mjs`, `_render-slides.mjs`,
   manifest `github-actions.mjs`, file chương khác, `content/course-videos/`. Không commit repo api-backend, không seed, không upload R2.

## 1. Người học

- **Cường** — SV CNTT FPTU, tự dựng cuongthai.com (Next.js + Express/TS + Prisma + Postgres + Redis + nginx, Docker
  Compose trên VPS). Repo api-backend có thật các workflow: `ci-lint.yml` (CI lint & type check), `deploy-ghcr.yml`,
  `backend-vps.yml` (từng chạy mỗi push rồi **đua nhau gây sập**: 03/07/2026 feed 500 vì schema lệch ảnh; 06/07 container
  bị giết `Exited(137)` → giờ chỉ `workflow_dispatch`), `vps-cleanup-weekly.yml` (cron dọn đĩa), `desktop-release.yml`
  (chặn dựng đè bản đã phát hành), `ssh-port-diagnostic.yml`. Đọc chúng trong `.github/workflows/` để lấy ví dụ THẬT.
- Vừa học xong khoá Git và Docker trên site — trỏ sang `/courses/git`, `/courses/docker`, `/courses/deploy-vps` khi hợp.
- **Yếu tiếng Anh**: thuật ngữ có nghĩa Việt ngay lần đầu ("runner (máy chạy)", "artifact (sản phẩm dựng)"); mỗi bài có 🗂.
- Chuẩn bị đi phỏng vấn ⇒ mỗi chương nên có ít nhất 1–2 chỗ "**Câu hỏi phỏng vấn hay gặp**" (callout: câu hỏi + ý trả lời).
- Mac M1 (zsh), máy Linux nhà; bạn cùng nhóm dùng Windows.

## 2. Mỗi chương sau khi nâng cấp

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `ga-N-0-slides` | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1–2 đoạn), rồi MỘT `${gallery('ga-NN', [[1,'Bìa'], …])}` SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide |
| N.1… | slug cũ | giữ type cũ (`VIDEO`) | bài cũ + phần chèn (mục 3) |
| cuối | slug quiz cũ | `QUIZ` | viết lại (mục 4) |

Bài mới: `isFreePreview: true`, `title` `'N.M — English|||N.M — Tiếng Việt'` ≤180 ký tự, `description` 1 câu tiếng Việt.
Đầu file thêm `import { gallery, slide } from './_slides.mjs';`.

## 3. Chèn gì vào MỖI bài dạy cũ (EN lẫn VI)

1. **3–6 slide** `${slide('ga-NN', n, 'chú thích')}` NGAY SAU `<h3>…</h3>` của đoạn đang giảng đúng nội dung đó (cùng slide ở
   hai khối). Bộ kiểm đòi ≥3 slide mỗi khối.
2. TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối (không có thì trước `<h3>Nguồn</h3>`/`<h3>Sources</h3>` nếu có, không
   có nữa thì cuối khối): `<h3>🧪 Practice (15–20 min)</h3>`/`<h3>🧪 Thực hành (15–20 phút)</h3>` (`.callout ok` + `<ol>` +
   `Done when/Đạt khi` KIỂM ĐƯỢC — bài tập làm trên **repo của chính người học** hoặc một repo thử của họ: tạo workflow,
   push, xem tab Actions/`gh run view`), `<h3>🗂 Key terms</h3>`/`<h3>🗂 Thuật ngữ trong bài</h3>` (`.kv-grid` 5–8 mục),
   `<h3>📌 Summary</h3>`/`<h3>📌 Tóm tắt</h3>` (`<ul>` 5–6 ý).
3. **ĐÀO SÂU** (bài cũ chỉ ~15–20k — mục tiêu mỗi bài ~40–55k sau nâng cấp): đọc như người mới, chỗ nhảy cóc thì thêm
   `<h3>` mới / bảng / "Chạy thử từng bước" / "Khi nào dùng — khi nào KHÔNG" / "Câu hỏi phỏng vấn hay gặp". Không độn chữ.
4. `.callout`/`.pitfall co-tieu-de` với sai lầm thật (mục 1).

## 4. Quiz cuối chương — viết LẠI

- `content` hai khối: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>` (`<ul>`
  5–6 dòng "Tôi làm được…") + `${slide('ga-NN', <bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
- `quiz: { timeLimitSeconds: 900, questions: [10 câu] }`, mỗi câu `{ question:'EN|||VI', options:['EN|||VI'×4], correctIndex,
  points:1, explanation:'EN: …|||VI: …' }`. Tình huống thật > định nghĩa. Explanation: vì sao đúng + vì sao phương án hấp
  dẫn nhất SAI. **Rải đáp án** 2–3 lần mỗi vị trí; phương án sai hợp lý, dài tương đương.

## 4b. Mục 0 — hai bài "Bắt đầu tại đây" + quiz (BẮT BUỘC)

Người dùng phàn nàn khoá Git mở đầu khô ("mới ấn vào bài đầu không có giới thiệu chia sẻ gì… làm tôi chả hiểu và có hứng
học"). Mẫu đã làm: `content/courses/docker/s00-intro.mjs` (hai bài `dk-0-5-…`, `dk-0-6-…`) + `content/courses/git/s00-intro.mjs`.
Mục 0 thêm, đứng TRƯỚC `ga-0-0-slides`:
1. `ga-0-5-bat-dau-tai-day` — "Bắt đầu tại đây (1/2) — CI/CD và GitHub Actions là gì, ra đời thế nào, vì sao công ty cần":
   CI/CD bằng hình ảnh đời thường trước; CI vs CD (delivery vs deployment); GitHub Actions vs Jenkins/GitLab CI/CircleCI
   (bảng); **lịch sử có mốc kiểm nguồn** (Martin Fowler "Continuous Integration" 2000/2006, CruiseControl, Hudson→Jenkins
   2011, Travis CI, GitLab CI, GitHub Actions công bố 10/2018 + GA 11/2019, Marketplace…); con số hiện nay (Octoverse /
   docs — KIỂM); **vì sao công ty coi trọng** + câu hỏi phỏng vấn điển hình; khoá đưa bạn tới đâu.
2. `ga-0-6-bat-dau-khi-khong-co-ci` — "Bắt đầu tại đây (2/2) — Khi không có CI/CD: sự cố thật, và cách học không bỏ cuộc":
   sự cố THẬT có nguồn (vd Knight Capital 2012 deploy tay lệch 1/8 máy — kiểm SEC; sự cố CI/supply chain: tj-actions/changed-files
   03/2025 lộ secret — kiểm GitHub advisory; Codecov bash uploader 2021) + chính sự cố của repo này (hai workflow deploy đua
   nhau) + tình huống minh hoạ của SV (ghi rõ là minh hoạ); cách học (YAML đáng sợ, CI đỏ, đọc log), lộ trình tối thiểu/đầy đủ.
3. `ga-0-7-kiem-tra` (QUIZ, mới) — 10 câu về Mục 0 (Mục 0 cũ không có quiz; bộ kiểm đòi mỗi chương đúng 1 quiz ở cuối).
Hai bài mở đầu: khối VI 14–20k ký tự, EN song song, slide riêng trong deck `ga-00`, `.pitfall`, 🧪 nhẹ chắc thành công, 🗂, 📌.

## 4c. Chương 11 — ôn tổng giữa khoá (khoá có thêm Ch12–15)

Chương 11 cũ là "ôn tổng và kỳ thi cuối". Khoá mới có Ch12–15 (xem `_BRIEF-CHUONG-MOI.md`), thi cuối khoá chuyển sang
`ga-15-5-thi-cuoi-khoa` (20 câu). Vì vậy Chương 11:
- **Được đổi title chương** thành `'Chapter 11 — Mid-course review: Chapters 1–10|||Chương 11 — Ôn tổng giữa khoá: Chương 1–10'`
  — AN TOÀN chỉ vì bài ĐẦU chương vẫn là bài cũ `ga-11-1-chot` (seeder neo chương bằng slug bài đầu). ⇒ thứ tự bài:
  `ga-11-1-chot`, `ga-11-0-slides`, `ga-11-2-thi-cuoi` (bộ kiểm cho phép riêng ca này).
- `ga-11-2-thi-cuoi`: title → `'11.2 — Mid-course check|||11.2 — Kiểm tra giữa khoá'`, 10 câu trải Ch1–10.

## 5. Slide — `scripts/slides-src/ga-NN.mjs` (NN đệm: ga-00 … ga-15)

```js
import { S, cover, cards, box, steps, table, vs, kpis, flow, two, list, code, mindmap, term, diagram, yaml, pipe, sv, R, T, A, seg, bars } from './_ga-chung.mjs';
export const deck = { key: 'ga-NN', code: 'GITHUB ACTIONS · CHƯƠNG N', title: '<tên ngắn>', sub: 'GitHub Actions · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
- **24–32 slide**: bìa → bản đồ chương → mỗi bài 4–6 slide → "Sai lầm hay gặp" → "Bảng tra nhanh" → "Thực hành chương N".
- Mỗi slide MỘT ý, tiêu đề là câu khẳng định. Ưu tiên HÌNH:
  - `pipe({cols, needs})` — đồ thị job như giao diện GitHub (✓ ✗ ⊘ ◌ …). `yaml([[dòng, ghi chú]…])` — workflow có ghi chú
    bên lề TỪNG DÒNG (rất hợp). `term([...])` — `gh run view --log`, output thật. `diagram()` — sự kiện → workflow → job →
    runner, token/OIDC, cache key… `sv/R/T/A` — tự vẽ (dòng thời gian run, cây cache key, concurrency group…).
- Màu: `'dk'`/`'ga'` (xanh GitHub Actions) chỉ hiểu ở `diagram/term/mindmap/sv/pipe`; khối CR (`cards/bars/seg/kpis/flow/
  steps`) dùng `'blu'`. Trong `cards` chữ đậm dùng `<strong>`, KHÔNG `<b>`. Lệnh dài trong term tách dòng bằng `\`.
- Chữ trên slide tiếng Việt, ngắn, ≥14px. Kiểm tràn `node scripts/_kiem-tran-slide.mjs --deck …`; render
  `node scripts/_render-slides.mjs --deck … --out <RENDER>`; ⛔ **MỞ TỪNG ẢNH bằng Read**, sửa tới khi sạch (bộ đo tràn không
  thấy: chữ đè mũi tên, tràn chân trang, tiêu đề 2 dòng, terminal gãy dòng).

## 6. Độ chính xác — luật cứng

1. **Log/output MỚI phải CHẠY THẬT.** Có sân tập **public** `github.com/cuonghoang1103/ga-san-tap` (người dùng đồng ý
   24/09/2026). Làm trong clone ở scratch; **mỗi chương đẩy lên NHÁNH RIÊNG `chNN-<tên>`**, workflow đặt trong
   `.github/workflows/chNN-*.yml`, trigger CHỈ trên nhánh của mình (`branches: [chNN-*]`) hoặc `workflow_dispatch` —
   để không kích hoạt workflow của chương khác. Xem kết quả bằng `gh run list/view --log`, `gh api`. Link tới run thật được
   đưa vào bài (repo public).
   - Workflow cố ý đỏ là bình thường. Không để workflow cron chạy mãi: cron thì xoá/tắt (`gh workflow disable`) khi xong.
   - Không tạo secret THẬT; secret thử đặt giá trị giả rõ ràng (`gia-tri-thu-khong-that-123`).
   - ⛔ Không thêm collaborator, không đổi cài đặt repo ngoài phạm vi bài (nếu bài cần — vd environments, rulesets — làm
     trên repo sân tập, ghi rõ, và KHÔNG làm gì khiến repo nguy hiểm: không self-hosted runner nghe PR từ fork).
   - Không đụng repo `api-backend` hay repo nào khác của người dùng (chỉ ĐỌC workflow của api-backend để lấy ví dụ).
2. Chạy cục bộ được thì dùng `actionlint` (qua `docker run --rm -v "$PWD":/repo -w /repo rhysd/actionlint:latest`) và
   `act` nếu cần; ghi rõ khi output đến từ `act` chứ không phải GitHub.
3. Tính năng/giới hạn/giá (phút miễn phí, runner lớn, cache 10GB, artifact retention, OIDC, rulesets…) kiểm trên
   docs.github.com trước khi viết con số; ghi "(tính đến 09/2026)". Mọi URL mới GET 200. Không bịa.
4. Output CŨ không bắt buộc chạy lại, nhưng thấy SAI hành vi (GitHub đổi nhanh: `set-output` đã bỏ, Node 16→20→24 cho
   action, `actions/cache@v4`, `upload-artifact@v4` không ghi đè tên trùng…) thì sửa và ghi báo cáo.

## 7. An toàn máy (khi chạy Docker/act)

Mac đang chạy container thật `cuong_pg_new`, `cuonghoang_redis`, `sonarqube-swt301` — KHÔNG đụng. Đối tượng docker tên
`gaNN-…`, cổng 19NN0–19NN9, cấm prune không filter, volume vô danh chỉ xoá theo ID đã ghi. `gh auth` đang đăng nhập tài
khoản thật của người dùng: chỉ dùng cho repo sân tập (và ĐỌC api-backend); không `gh repo create/delete`, không sửa cài
đặt tài khoản.

## 8. Thoát ký tự (bộ kiểm chặn)

Không backtick trần → `&#96;`. **`${{ … }}` của GitHub Actions viết `&#36;{{ … }}`** (bộ kiểm báo lỗi mọi `${` còn lại).
`$VAR`/`$(…)` shell thường thì không sao. Gạch chéo ngược `\\`. Trong `<pre><code>`: `&lt; &gt; &amp;`. Mã YAML:
`<pre><code class="language-yaml">…</code></pre>`. Output: `<div class="out">…</div>`. Không `<svg>`/iframe/script/style
trong bài. Chuỗi JS nháy đơn (title/quiz): không `\\'` — dùng `’` hoặc nháy kép. Khối được phép như chương đang dùng.

## 9. Kiểm trước khi báo xong

```bash
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/ga-NN.mjs
node scripts/_render-slides.mjs  --deck scripts/slides-src/ga-NN.mjs --out <RENDER>
node scripts/ga-ghep-chuong.mjs content/courses/github-actions/sNN-*.mjs --render <RENDER>     # chương mới: thêm --moi
node scripts/course-content-check.mjs ./content/courses/github-actions/sNN-*.mjs             # nhận thẳng file chương
```
Rồi đọc lại bài tập/quiz một lượt.

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · độ dài từng bài trước→sau · phần đào sâu · câu chữ cũ đã sửa vì sai · link các run thật trên ga-san-tap đã dùng ·
phân bố đáp án · slide đã sửa sau khi nhìn · điều chưa chắc · xác nhận đã dọn (cron đã tắt, container gaNN- đã xoá).
