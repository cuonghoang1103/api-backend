# Hợp đồng nâng cấp — khoá "Deploy lên VPS" (/courses/deploy-vps)

> Đọc HẾT file này trước khi sửa một dòng nào. Nhiều agent nâng cấp song song từng chương; file này giữ cho cả khoá
> trông như do MỘT người viết. Chép từ hợp đồng khoá Linux & Bash (`content/courses/linux-bash/_HOP-DONG.md`) — khoá
> đó xong đúng quy trình này 29/09/2026 (17 phần, 109 bài, ~540 slide).
> **Bài mẫu để bắt chước:** khoá Linux — `content/courses/linux-bash/s09-mang-may-tu-xa.mjs` + deck
> `scripts/slides-src/lx-09.mjs`, và `s12-chan-doan-may-chu.mjs` + `lx-12.mjs` (cách chèn slide sau `<h3>`, bài N.0,
> 🧪/🗂/📌, đào sâu, quiz có giải thích). Chỗ nào file này không nói, làm như hai chương đó.

## 0. Việc này là NÂNG CẤP + ĐÀO SÂU, không phải viết lại

Khoá đã có 12 phần (Mục 0 + Chương 1–11), 70 bài, mỗi bài ~15–24k ký tự song ngữ, chữ tốt, mọi số liệu ĐO THẬT trên
một máy chủ SSH thật. Thiếu: **slide/hình (0 ảnh cả khoá)**, ô thuật ngữ cho người yếu tiếng Anh, tóm tắt, bài tập
"làm được, kiểm được", quiz tử tế (quiz cũ: 8 câu, KHÔNG có giải thích, **100% đáp án là B**), Mục 0 không kể lịch sử
và không có quiz; thiếu hẳn tên miền/HTTPS, deploy bằng container + CI, nhiều môi trường/mở rộng, và một dự án cuối khoá.

**Người dùng nói (29/09/2026, nhắc lại yêu cầu khoá Linux):** *"đầy đủ từ giới thiệu, lịch sử, công dụng, tại sao
phải dùng nó, lợi ích, những vấn đề sẽ gặp nếu không biết… học xong giúp gì trong công việc, học tập, dự án… đến
chuyên gia, chuyên sâu, nâng cao… slide đầy đủ, chất lượng, sơ đồ, code phải có màu như VS Code."*
⇒ Mỗi bài dạy có bộ slide riêng (mục 6), **code/script/cấu hình trên slide luôn có màu** (`sh()` cho bash, `yaml()`
cho compose/workflow/unit), chỗ nào bài còn nhảy cóc với người mới thì ĐÀO SÂU (mục 3.4).

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **KHÔNG xoá, KHÔNG rút gọn** nội dung cũ. Chỉ CHÈN thêm. Sửa câu chữ cũ chỉ khi nó SAI (nói rõ trong báo cáo).
   Bộ kiểm so độ dài từng bài với bản trong git HEAD — ngắn đi một ký tự là báo lỗi.
2. **KHÔNG đổi `slug`** của bài nào đã có, **KHÔNG đổi `type`** (Ch6–11 có bài `type: 'VIDEO'` — giữ nguyên; bộ kiểm
   áp cùng luật slide/🧪/🗂/📌 như `LESSON`).
3. **KHÔNG đổi `title` (và `slug` nếu có) của CHƯƠNG** (trường cấp section). Bài đầu chương sẽ là bài mới (N.0) nên
   bộ seed tìm chương bằng tiêu đề — đổi tiêu đề là nó tạo ra chương trùng. `title` của từng BÀI thì được đổi.
4. Chỉ sửa 2 file của chương mình: `content/courses/deploy-vps/sNN-*.mjs` và `scripts/slides-src/dv-NN.mjs` (tạo
   mới). KHÔNG sửa `_slides.mjs`, `_dv-chung.mjs`, `_lx-chung.mjs`, `_dk-chung.mjs`, `_git-chung.mjs`, `_cr-chung.mjs`,
   `_render-slides.mjs`, manifest `deploy-vps.mjs`, file chương khác, `content/course-videos/`. Không commit, không
   push, không seed, không upload.

## 1. Người học (viết cho ĐÚNG người này)

- **Cường** — sinh viên CNTT FPTU, tự dựng và tự vận hành cuongthai.com: Next.js + Express/TypeScript + Prisma +
  PostgreSQL + Redis + nginx, **Docker Compose trên một VPS Ubuntu 6GB**, ảnh dựng ở **máy nhà** (Fedora 12 nhân) đẩy
  lên **GHCR**, VPS chỉ kéo về và tráo — bằng script `deploy-nha.sh` ~750 dòng (đã được nhắc ở Ch2, Ch7). Deploy gần
  như hằng ngày. Sự cố THẬT đã gặp — ví dụ quý nhất của khoá, kể như chuyện "một dự án sinh viên":
  - 03/07: hai workflow deploy chạy khi push `main` đua nhau ⇒ feed trả 500 vì schema lệch ảnh; 06/07: tráo container
    đua nhau ⇒ `Exited(137)` + container mồ côi ⇒ bỏ push-to-deploy, deploy thành script chạy tay;
  - 18/08: cache build Docker 7,6GB làm đầy đĩa VPS ⇒ `no space left on device` giữa lúc `next build`, Postgres suýt chết;
  - 18/08: build ảnh bằng `docker build .` (nhầm Dockerfile) ⇒ nền Alpine (musl) mang engine Prisma glibc ⇒ build
    xanh, đẩy xanh, tráo xanh, rồi backend restart vô tận, **API 502 bảy phút** ⇒ thêm chốt kiểm libc trước khi đẩy;
  - 02/07: deploy `--no-build` chỉ rsync mà không dựng lại ⇒ container chạy ảnh CŨ, route mới 404 ⇒ thêm smoke-test
    (401/200 = có route, 404 = ảnh cũ);
  - 23–25/08: đổi `nginx.conf` mà "deploy thành công" không có tác dụng — vì nginx.conf là bind-mount (nằm NGOÀI ảnh),
    rồi vì thay file bằng `mv` mà container giữ inode cũ;
  - `next.config.js` đặt header cache nhưng nginx `proxy_hide_header` nuốt mất — "nginx thắng Next, luôn luôn";
  - migration drift, `P3009` chặn deploy; seed báo OK giả khi backend đang bị tráo; deploy-nha push HEAD lúc push chứ
    không phải bản đã deploy; hai phiên deploy cùng lúc tranh ref;
  - mạng trường chặn cổng 22 ⇒ SSH qua cổng 993; VPS chỉ vào bằng khoá; `ssh.socket` giữ cổng.
- **Yếu tiếng Anh.** Mọi thuật ngữ tiếng Anh có nghĩa tiếng Việt NGAY cạnh lần đầu xuất hiện trong khối VI:
  "artifact (tạo tác — thứ được gửi đi)", "rollback (lùi bản)", "health check (phép kiểm còn sống)". Mỗi bài có ô 🗂.
- Làm đồ án nhóm ở trường (SWP391…) — ví dụ làm nhóm lấy bối cảnh đó ("tối trước hôm bảo vệ, nhóm deploy bản mới và
  trang chủ trắng xoá…").
- Máy: **Mac M1** (zsh, Docker Desktop), máy **Fedora 44** ở nhà, VPS **Ubuntu 24.04**. Bạn cùng nhóm dùng Windows ⇒
  nói khi thao tác khác trên Windows/WSL (SSH key, CRLF trong script deploy, đường dẫn).
- Đã/đang học các khoá liên quan trên site — TRỎ sang thay vì dạy lại: `/courses/linux-bash` (máy, SSH, systemd,
  chẩn đoán — vừa nâng cấp xong, 17 phần), `/courses/docker` (ảnh, Compose), `/courses/nginx` (proxy, TLS),
  `/courses/github-actions` (CI/CD), `/courses/git`. Khoá này dạy **CÁI HÀNH ĐỘNG đưa mã lên máy và giữ nó ở đó**.

## 2. Mỗi chương sau khi nâng cấp gồm

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `deploy-N-0-slides` (N không đệm: `deploy-3-0-slides`, `deploy-10-0-slides`) | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1–2 đoạn: bộ slide gồm gì, dùng thế nào), rồi MỘT `${gallery('dv-NN', [[1,'Bìa'], …])}` đặt SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide (bộ kiểm đếm) |
| N.1… | slug cũ giữ nguyên | giữ `LESSON`/`VIDEO` như cũ | bài cũ + phần chèn thêm (mục 3) |
| (tuỳ) | `deploy-N-K-<ten>` với K chưa dùng | `LESSON` | **Chỉ** thêm khi chương có lỗ hổng THẬT (mục 5). Đặt TRƯỚC quiz |
| cuối | slug quiz cũ giữ nguyên | `QUIZ` | viết lại theo mục 4 |

Mọi bài mới: `isFreePreview: true`. Bài cũ giữ nguyên `isFreePreview`. `title` dạng `'N.M — English|||N.M — Tiếng
Việt'`, ≤ 180 ký tự. `description` 1 câu tiếng Việt. Đầu file thêm `import { gallery, slide } from './_slides.mjs';`.
Mẫu N.0: bài `lnx-9-0-slides` trong `content/courses/linux-bash/s09-mang-may-tu-xa.mjs`.

## 3. Chèn gì vào MỖI bài dạy cũ (cả khối EN lẫn khối VI)

1. **3–6 slide** bằng `${slide('dv-NN', n, 'chú thích ngắn')}` NGAY SAU `<h3>…</h3>` của đoạn đang giảng đúng nội dung
   slide đó (cùng slide ở cả hai khối; chú thích tiếng Việt dùng cho cả hai). Bộ kiểm đòi ≥ 3 slide ở MỖI khối.
2. Ngay TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối ngôn ngữ (không có thì trước `<p class="note-ct">` cuối
   khối, không có nữa thì cuối khối), chèn đúng thứ tự, đúng tiêu đề (bộ kiểm tìm `<h3>🧪` …):
   - EN `<h3>🧪 Practice (15–20 min)</h3>` / VI `<h3>🧪 Thực hành (15–20 phút)</h3>` — `<div class="callout ok"><ol>…</ol>`
     + (tuỳ) khối lệnh/kết quả + `<p><strong>Done when: / Đạt khi:</strong> tiêu chí KIỂM ĐƯỢC</p></div>`. Làm trên
     **"VPS thí nghiệm"** (mục 7b: container Ubuntu có sshd mà máy bạn SSH vào như một VPS thật), 3–5 bước, **tình
     huống thật** ("bản mới lên xong thì /api trả 502; tìm xem bước nào hỏng rồi lùi về bản cũ trong 1 phút…").
   - EN `<h3>🗂 Key terms</h3>` / VI `<h3>🗂 Thuật ngữ trong bài</h3>` — `.kv-grid` 5–8 mục; VI: `Thuật ngữ gốc (nghĩa
     Việt)` → giải thích 1 câu.
   - EN `<h3>📌 Summary</h3>` / VI `<h3>📌 Tóm tắt</h3>` — `<ul>` 5–6 ý, mỗi ý một câu chốt.
3. Được thêm `.callout`/`.pitfall co-tieu-de`/ví dụ vào giữa bài — ưu tiên sự cố thật (mục 1).
4. **ĐÀO SÂU (bắt buộc cân nhắc cho từng bài):** đọc như người MỚI deploy lần đầu. Chỗ nào nhảy cóc (khái niệm chưa
   giải thích, lệnh không nói từng cờ, output không đọc giúp, "tại sao lại làm bước này") ⇒ chèn `<h3>` mới hoặc khối
   giải thích ngay đó. Mỗi bài cân nhắc: (a) "Chạy thử từng bước" trên VPS thí nghiệm, (b) **bảng cờ/chỉ thị** cho
   lệnh/cấu hình nhiều tuỳ chọn (rsync, ssh, systemd unit, compose…), (c) "Khi nào dùng / khi nào KHÔNG" cho mỗi lựa
   chọn kiến trúc, (d) **"Trên Windows/WSL và macOS khác gì"** khi thao tác phía máy dev khác (ssh-agent, CRLF, rsync
   bản Apple — openrsync thiếu cờ). Song ngữ đầy đủ. Không độn chữ.

Phần thêm bên EN là bản song song ĐẦY ĐỦ ý của bên VI, không phải bản rút gọn.

## 4. Quiz cuối chương — viết LẠI hoàn toàn

- `content`: hai khối EN/VI: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>`
  với `<ul>` 5–6 dòng "Tôi làm được…", rồi `${slide('dv-NN', <slide bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
- `quiz: { timeLimitSeconds: 900, questions: [ …10 câu… ] }`. Mỗi câu:
  `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
  ⚠️ **Mọi phương án phải có `|||`** (kể cả khi chỉ là lệnh/output: viết `'x|||x'`) — `course-content-check` báo lỗi nếu thiếu.
- **Tình huống thực tế** ("Deploy xong, `docker ps` báo `Restarting (1)`, log báo `Error loading shared library
  libssl.so.3`…") hơn định nghĩa. `explanation` nói vì sao đúng + vì sao phương án hấp dẫn nhất lại SAI.
- **Rải đáp án**: mỗi vị trí A/B/C/D 2–3 lần. Phương án sai hợp lý, độ dài tương đương.
- Ngoại lệ: **Mục 0** chưa có quiz → thêm `deploy-0-7-quiz` ở CUỐI Mục 0. **Chương 11** bài `deploy-11-6-thi-cuoi`
  (đang 12 câu): tiêu đề CHƯƠNG giữ nguyên (luật 3), đổi title bài thành
  `'11.6 — Core exam (Sections 0–11)|||11.6 — Bài thi phần cốt lõi (Mục 0–11)'`, viết 10 câu trải Mục 0–11; bài thi
  cuối khoá toàn diện 20 câu nằm ở Chương 15 (`deploy-15-5-kiem-tra-cuoi-khoa`).

## 4b. Mục 0 — hai bài "Bắt đầu tại đây" (BẮT BUỘC)

Thứ tự trong file: `deploy-0-5-bat-dau-tai-day` → `deploy-0-6-bat-dau-khi-khong-co` → `deploy-0-0-slides` → 0.1…0.4 (cũ)
→ `deploy-0-7-quiz`.
1. `deploy-0-5-bat-dau-tai-day` — title `'Start here (1/2) — What deploying is, how it evolved, and why it matters to you|||Bắt đầu tại đây (1/2) — Deploy là gì, đã tiến hoá thế nào, và vì sao nó quan trọng với bạn'`:
   lời chào ấm; deploy/VPS/máy chủ/tên miền là gì bằng hình ảnh đời thường (dọn nhà sang căn hộ thuê) rồi mới định
   nghĩa; phân biệt shared hosting · VPS · máy chủ riêng · cloud (EC2) · PaaS (Heroku/Vercel/Render) · serverless ·
   Kubernetes (bảng: bạn quản lý gì / họ quản lý gì / giá); **lịch sử có mốc** (FTP lên shared hosting + cPanel những
   năm 1990–2000 → ảo hoá x86: VMware, Xen 2003, KVM vào nhân Linux 2007 → nhà VPS: Linode 2003, AWS EC2 2006,
   DigitalOcean 2011 → Capistrano 2006 → Heroku "git push heroku" 2007–2009 → The Twelve-Factor App 2011 → Docker 2013
   → CI/CD, GitHub Actions 2019 → Vercel/Netlify, "deploy bằng một cú push"…) — MỌI mốc phải WebFetch kiểm nguồn
   (Wikipedia/trang chính thức) và ghi link; **vì sao nó quan trọng**: code chỉ có giá trị khi người khác dùng được;
   **giúp gì cho BẠN**: đồ án nhóm có link thật để hội đồng bấm, CV có sản phẩm đang chạy, phỏng vấn (câu hỏi deploy/
   DevOps hay gặp), công việc backend/DevOps; khoá này đưa bạn tới đâu (lộ trình 16 phần, trỏ khoá Linux/Docker/Nginx/GA).
2. `deploy-0-6-bat-dau-khi-khong-co` — title `'Start here (2/2) — When deploys go wrong: real disasters, and how to learn this without fear|||Bắt đầu tại đây (2/2) — Khi deploy hỏng: những sự cố thật, và cách học mà không sợ'`:
   5–7 sự cố **có thật và kiểm được** (ghi nguồn): Knight Capital 01/08/2012 (deploy thiếu một trong tám máy, mất
   ~440 triệu USD trong 45 phút — báo cáo của SEC), GitLab 31/01/2017 (post-mortem), Cloudflare 02/07/2019 (một regex
   trong bản deploy làm CPU 100% — bài blog của Cloudflare), Facebook 04/10/2021 (thay đổi cấu hình BGP — bài của
   Facebook Engineering), CrowdStrike 19/07/2024 (bản cập nhật đẩy ra toàn cầu cùng lúc — báo cáo PIR của CrowdStrike)
   … cùng các sự cố THẬT ở mục 1 — mỗi cái: chuyện gì → hậu quả → nguyên tắc deploy nào ngăn được (từng bước, canary,
   lùi bản, kiểm sau deploy…) → học ở chương nào. Rồi **cách học không sợ**: vì sao người mới sợ deploy (sợ làm sập,
   lỗi mơ hồ, nhiều mảnh ghép), sân tập an toàn (VPS thí nghiệm bằng container, VPS rẻ để phá), nhịp mỗi buổi, cách
   đọc log khi deploy hỏng, mốc "đã làm được".
Hai bài này: khối VI mỗi bài 14–20k ký tự, EN song song, `isFreePreview: true`, slide trong deck `dv-00` (dòng thời
gian, bảng hosting, thẻ sự cố, lộ trình), `.pitfall co-tieu-de`, 🧪 nhẹ (chắc thành công trong 10 phút), 🗂, 📌,
link-card nguồn. Giọng ấm, cụ thể — không sáo rỗng.

## 5. Thêm nội dung / bài mới trong chương cũ? (thận trọng)

Grep cả thư mục `content/courses/deploy-vps/` và đề cương Ch12–15 (`_BRIEF-CHUONG-MOI.md`) trước khi thêm, để khỏi
dạy trùng: tên miền/DNS/HTTPS/CDN (→ Ch12), Compose + registry + GitHub Actions + zero-downtime container (→ Ch13),
staging/nhiều máy/PaaS/chi phí (→ Ch14), dự án trọn (→ Ch15). Bổ sung ưu tiên bằng đoạn `<h3>` trong bài liên quan;
chỉ thêm BÀI mới khi lỗ hổng lớn mà chương khác không dạy (tối đa 1 bài/chương, khối VI 10–15k, đủ slide/🧪/🗂/📌).

## 6. Slide — `scripts/slides-src/dv-NN.mjs` (NN có đệm: dv-00 … dv-15)

```js
import { S, cover, sh, yaml, term, pipe, mindmap, diagram, host, layers, tree, cards, box, steps, table, vs, kpis, flow, two, list, seg, bars, sv, R, T, A } from './_dv-chung.mjs';
export const deck = { key: 'dv-NN', code: 'DEPLOY · CHƯƠNG N', title: '<tên chương ngắn>', sub: 'Deploy lên VPS · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
(Mục 0: `code: 'DEPLOY · MỤC 0'`, `chap: 'MỤC 0'`.) Đọc chú thích đầu `_dv-chung.mjs` và `_lx-chung.mjs` trước.
- **22–32 slide** (Mục 0 tới 40): bìa → bản đồ chương (mindmap, ≤ 6 nhánh) → **mỗi bài dạy 4–6 slide** → 1 "Sai lầm
  hay gặp" → 1–2 **"Bảng tra nhanh"** → 1 "Thực hành chương N" (buổi 30–45 phút nối các bài tập).
- **Mỗi slide dạy MỘT ý**, tiêu đề là câu khẳng định ("Build xanh không có nghĩa là ảnh chạy được"), ≤ ~45 ký tự.
- **Ưu tiên HÌNH**, **code luôn có màu**:
  - `sh(lines,{fs})` — script/lệnh bash tô màu VS Code + ghi chú lề. `yaml(lines,{lang})` — compose.yaml, workflow
    GitHub Actions, unit systemd (`lang:'ini'`), Dockerfile (`lang:'docker'`), nginx.conf có ghi chú từng dòng.
  - `term()` — output THẬT. `diagram()` — luồng deploy (máy dev → CI → registry → VPS), tráo xanh/lam, lùi bản.
  - `host()` — một VPS chứa container/volume/cổng; `layers()` — tầng ảnh. `pipe()` — chuỗi bước deploy.
  - Hình kiểu mới (dòng thời gian một lần deploy, cửa sổ migration, đồ thị request rơi khi tráo…) ⇒ vẽ `<svg>` bằng
    `sv/R/T/A` ngay trong deck (xem `lx-09.mjs`, `lx-12.mjs`, `dk-01.mjs`). KHÔNG sửa file thư viện.
- Chữ trên slide tiếng Việt, ngắn, không dưới 14px. Trong `cards` chữ đậm dùng `<strong>` (không `<b>`). Khối của CR
  (`cards`, `bars`, `seg`, `kpis`, `flow`, `steps`) KHÔNG hiểu màu `'dv'`/`'lx'` ⇒ dùng `'blu'`/`'tea'`; `layers()` cũng
  không hiểu `'lx'`. `table()` coi ô bắt đầu bằng "-" là tô đỏ ⇒ cờ `--x` viết trong `<code>`.
- Kiểm tràn: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/dv-NN.mjs`. Render:
  `node scripts/_render-slides.mjs --deck scripts/slides-src/dv-NN.mjs --out <RENDER>`.
- ⛔ **MỞ TỪNG ẢNH RA NHÌN** bằng Read. Bộ đo tràn KHÔNG thấy: mũi tên đâm chữ, hộp chồng, nhãn cắt mép SVG, cột
  hẹp bẻ dòng terminal, khối `steps`/box tràn xuống chân slide, `sh()` trong `two()` tràn mép phải, SVG rộng hơn cột
  (tự đặt `max-width:100%`). Sửa tới khi sạch.

## 7. Độ chính xác — luật cứng

1. **Mọi lệnh và output MỚI in trong bài/slide phải CHẠY THẬT** trên **VPS thí nghiệm** (mục 7b), máy Mac (phía dev),
   hoặc linux-nha khi cần máy Linux thật chỉ đọc. Output dài được cắt dòng (ghi `…`), không sửa chữ. Ghi môi trường chạy
   khi nó ảnh hưởng số đo (container trên Mac ≠ VPS thật: đĩa, mạng, CPU).
2. Output CŨ: không bắt buộc chạy lại. Thấy chỗ SAI về hành vi thì sửa và ghi vào báo cáo.
3. Thứ hay đổi (giá VPS/PaaS, giới hạn gói miễn phí, GitHub Actions, GHCR, Let's Encrypt — hạn chứng chỉ, rate limit,
   Docker Compose spec, Cloudflare) ⇒ WebFetch trang chính thức trước khi viết, ghi mốc "(tính đến 09/2026)".
4. **Mọi URL mới phải GET thật** → 200. Thà ít link còn hơn link chết. man7.org thay gnu.org (hay từ chối kết nối).
5. Không bịa trích dẫn, số liệu, sự cố "có thật".

## 7b. AN TOÀN — luật cứng (máy thật đang chạy việc thật)

- ⛔ **VPS production (cuongthai.com, 160.187.1.208) KHÔNG BAO GIỜ đụng** — không ssh, không curl thử tải, không quét
  cổng. Số liệu của web thật chỉ lấy từ hợp đồng mục 1 / CLAUDE.md (đã có sẵn), không đo lại.
- **VPS thí nghiệm** = container Ubuntu 24.04 có `openssh-server` (+ systemd khi cần `--privileged` NGẮN hạn), tên
  `dvNN-vps` (thêm `dvNN-vps2`… khi cần nhiều máy), `--label dvhoc=NN`, `--memory 512m` (đổi khi bài đo RAM), mạng
  Docker riêng `dvNN-net`, SSH từ Mac vào qua cổng `127.0.0.1:19NN2` bằng **khoá tạo trong scratch**
  (`ssh -i <scratch>/khoa -o UserKnownHostsFile=<scratch>/known_hosts -p 19NN2 deploy@127.0.0.1`). Registry cục bộ
  (nếu cần) `registry:2` tên `dvNN-reg` cổng 19NN5; `docker push` CHỈ tới `localhost:19NN5/…`.
- ⛔ KHÔNG sửa `~/.ssh/config`, `~/.ssh/known_hosts`, `~/.ssh/authorized_keys`, dotfile, crontab, launchd của Mac; không
  `ssh-add` vào agent thật (muốn demo agent thì `ssh-agent` riêng với `SSH_AUTH_SOCK` trong scratch); không `docker login`
  vào registry thật (GHCR/Docker Hub) — demo GHCR thì chỉ in lệnh/giải thích; `DOCKER_CONFIG=<scratch>/docker-cfg` nếu
  login registry cục bộ.
- Mac đang chạy container thật `cuong_pg_new`, `cuonghoang_redis`, `sonarqube-swt301` — KHÔNG đụng. Cấm mọi `prune`
  không có `--filter label=dvhoc=NN`. Cổng: chỉ dải **19NN0–19NN9** (Ch12 dùng 19120–19129…). Không dùng 3000/5432/
  5434/6379/9000/80/443 trên Mac.
- linux-nha: KHÔNG sudo, chỉ đọc + `~/dvhoc-NN/` (xoá khi xong); không đụng `phu-de-*`, `canh-vps`, tiến trình GPU.
- GitHub Actions: viết workflow đầy đủ nhưng KHÔNG chạy trên GitHub thật, không tạo repo/secret. Chạy được cục bộ bằng
  `act` thì chạy (nếu cài được), không thì giải thích từng bước.
- DNS/TLS: không đăng ký tên miền thật, không gọi Let's Encrypt production. Demo bằng `/etc/hosts` trong container,
  CA cục bộ (`mkcert`/`openssl`) hoặc **Pebble** (máy chủ ACME thử nghiệm của Let's Encrypt) trong container.
  `dig` tên miền công khai (example.com, cuongthai.com chỉ đọc bản ghi DNS) thì được.
- Thông tin cá nhân của người dùng: KHÔNG tự ý đưa vào nội dung khoá. Người dùng cho phép (29/09/2026) dùng email
  của họ khi một nguồn chính thức BẮT BUỘC khai liên hệ (vd sec.gov đòi User-Agent có email) — chỉ khi thật cần, và
  ghi vào báo cáo. Ngoài trường hợp đó thì không gửi ra đâu.
- Chú thích `slide(deck, n, 'chú thích')` KHÔNG được escape ⇒ không viết `<`/`>` trần trong chú thích (dùng `&lt;`).
- Kho thử/file tạm: trong thư mục scratch người điều phối đưa, KHÔNG trong repo api-backend.
- Xong: `docker ps -a --filter name=dvNN-` rỗng, mạng `dvNN-net` và ảnh tạm đã xoá, `~/dvhoc-NN` trên linux-nha xoá.

## 8. Thoát ký tự trong template literal

- Không backtick trần → `&#96;`. Gạch chéo ngược → `\\`. **`${var}` của bash/compose viết `\${var}`** trong template
  literal (bộ kiểm cho phép `${` trong nội dung đã đánh giá; quên `\` là JS nuốt mất) — sau khi sửa grep lại cho chắc.
- Trong `<pre><code>`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;` (`2>&1` → `2&gt;&amp;1`). Mã:
  `<pre><code class="language-bash">…</code></pre>` (`language-yaml`, `language-dockerfile`, `language-ini`, `language-nginx`).
  Output: `<div class="out">…</div>`.
- KHÔNG `<svg>`, iframe, script, style trong nội dung bài — hình đi qua slide.
- Chuỗi JS nháy đơn (title/quiz): dùng `’` hoặc nháy kép thay cho `\\'`.
- ⚠️ **gitleaks** (hook pre-commit) chặn token mẫu kiểu `Authorization: Bearer sk-…`, `example-token`, `your-token-here`,
  khoá riêng tư mẫu ⇒ token mẫu dùng `12345` hoặc `xxxx`; khoá SSH/TLS mẫu chỉ in dòng đầu + `…`, không in cả khối.
- Khối được phép: `.eyebrow .lead h3 p ul ol table .kv-grid>.kv>.k/.v .callout.ok|.warn|.danger .pitfall(.co-tieu-de)
  .note-ct .lz-flow>.lz-step .lz-stack>.lz-layer .out .link-card` — bắt chước cách chương đang dùng.

## 9. Kiểm trước khi báo xong

```bash
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/dv-NN.mjs
node scripts/_render-slides.mjs  --deck scripts/slides-src/dv-NN.mjs --out <RENDER>
node scripts/dv-ghep-chuong.mjs content/courses/deploy-vps/sNN-*.mjs --render <RENDER>     # chương mới: thêm --moi
node scripts/course-content-check.mjs ./content/courses/deploy-vps.mjs
gitleaks dir content/courses/deploy-vps/sNN-*.mjs --config .gitleaks.toml --no-banner       # phải sạch
docker ps -a --filter name=dvNN-                                                              # phải rỗng
```
Tất cả phải sạch (lỗi ở file chương KHÁC thì bỏ qua — agent khác đang sửa). Rồi **đọc lại** bài tập/quiz của mình.

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · danh sách bài + độ dài trước→sau · phần đào sâu đã thêm (bài nào, về gì) · bài mới (nếu có) và lý do ·
câu chữ cũ đã sửa vì sai · phân bố đáp án quiz · slide đã phải sửa sau khi nhìn và vì sao · điều chưa chắc/chưa kiểm
được · xác nhận đã dọn sạch container/mạng/ảnh `dvNN-` và `~/dvhoc-NN`.
