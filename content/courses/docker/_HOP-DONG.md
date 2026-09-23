# Hợp đồng nâng cấp — khoá "Docker" (/courses/docker)

> Đọc HẾT file này trước khi sửa một dòng nào. Nhiều agent nâng cấp song song từng chương;
> file này giữ cho cả khoá trông như do MỘT người viết. Chép từ hợp đồng khoá Git
> (`content/courses/git/_HOP-DONG.md`) — khoá đó đã làm xong theo đúng quy trình này, 09/2026.
> **Bài mẫu (XONG 23/09/2026):** Chương 1 — `content/courses/docker/s01-mo-hinh.mjs` + deck `scripts/slides-src/dk-01.mjs`
> (32 slide, ảnh render ở `<RENDER>/dk-01/`). MỞ XEM slide 3, 11, 17, 18, 22 của nó trước khi vẽ deck của mình: đó là
> chuẩn — hình tự vẽ bằng SVG dạy đúng một ý, số liệu thật, terminal thật ngay bên cạnh. Mỗi bài của Ch1 đào sâu gấp
> đôi độ dài (25k → 50–58k ký tự) và sửa 10 chỗ output cũ SAI/BỊA — đó cũng là chuẩn. Chỗ nào file này không nói, bắt chước đúng hai file đó. Tham khảo thêm cách khoá Git
> làm: `content/courses/git/s01-mo-hinh.mjs` + `scripts/slides-src/git-01.mjs`.

## 0. Việc này là NÂNG CẤP + ĐÀO SÂU, không phải viết lại

Khoá đã có 13 phần (Mục 0 + Chương 1–12), 5 bài dạy/chương, mỗi bài ~20–30k ký tự song ngữ, chữ tốt và
đã có khối lệnh/output. Thiếu: **slide/hình (0 ảnh cả khoá)**, thuật ngữ cho người yếu tiếng Anh, tóm tắt,
bài tập kiểu "làm được, kiểm được", và quiz tử tế (quiz cũ: 8 câu, KHÔNG có giải thích, 6 chương đáp án toàn B).

**Người dùng nhấn mạnh (23/09/2026):** *"nâng cấp toàn bộ slide từng bài chi tiết + bài giảng chi tiết để tôi dễ
học… slide chất lượng dễ nhìn dễ hiểu đầy đủ kiến thức… Docker rất quan trọng để tôi làm việc và học tập."*
⇒ Chuẩn slide và độ sâu CAO HƠN khoá Git: mỗi bài dạy phải có bộ slide riêng của nó (mục 6), và chỗ nào bài
giảng còn nhảy cóc với người mới thì ĐÀO SÂU thêm (mục 3.4).

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **KHÔNG xoá, KHÔNG rút gọn** nội dung cũ. Chỉ CHÈN thêm. Sửa câu chữ cũ chỉ khi nó SAI (nói rõ trong báo cáo).
   Bộ kiểm so độ dài từng bài với bản trong git HEAD — ngắn đi một ký tự là báo lỗi.
2. **KHÔNG đổi `slug`** của bài nào đã có (slug = khoá gắn tiến độ học + video).
3. **KHÔNG đổi `title` của CHƯƠNG** (trường `title` cấp section). Bài đầu chương sẽ là bài mới (N.0) nên bộ seed
   tìm chương bằng tiêu đề — đổi tiêu đề là nó tạo ra một chương trùng. `title` của từng BÀI thì được đổi.
4. Chỉ sửa 2 file của chương mình: `content/courses/docker/sNN-*.mjs` và `scripts/slides-src/dk-NN.mjs` (tạo mới).
   KHÔNG sửa `_slides.mjs`, `_dk-chung.mjs`, `_git-chung.mjs`, `_cr-chung.mjs`, `_render-slides.mjs`, manifest
   `docker.mjs`, file của chương khác, `content/course-videos/`. Không commit, không push, không seed, không upload.

## 1. Người học (viết cho ĐÚNG người này)

- **Cường** — sinh viên CNTT FPTU, tự dựng cuongthai.com (Next.js + Express/TypeScript + Prisma + PostgreSQL +
  Redis + nginx, **chạy bằng Docker Compose trên một VPS Ubuntu**, ảnh dựng ở máy nhà rồi đẩy GHCR). Dùng Docker
  hằng ngày nhưng nhiều chỗ "chép lệnh cho chạy": từng dính API chết 502 vì ảnh Alpine (musl) mang engine Prisma
  glibc, đĩa VPS đầy vì cache build, container bị giết exit 137 khi `next build`, bind-mount file đơn nginx đổi
  bằng `mv` mà container không thấy. Những sự cố THẬT này là ví dụ quý — dùng chúng (kể như chuyện của "một
  dự án sinh viên", không cần nêu tên miền).
- **Yếu tiếng Anh.** Mọi thuật ngữ tiếng Anh có nghĩa tiếng Việt NGAY cạnh lần đầu xuất hiện trong khối VI:
  "bind mount (gắn thư mục máy chủ)", "layer (tầng)", "registry (kho ảnh)". Mỗi bài có ô 🗂 Thuật ngữ.
- Làm đồ án nhóm ở trường (SWP391…) — ví dụ làm nhóm lấy bối cảnh đó ("bạn cùng nhóm dùng Windows chạy
  `docker compose up` không lên").
- Máy: **Mac M1 (arm64, zsh, Docker Desktop)**, có máy Linux amd64 ở nhà, VPS Ubuntu amd64. Bạn cùng nhóm
  hay dùng Windows + WSL2 ⇒ khi hành vi khác nhau giữa Mac/Linux/Windows thì NÓI (đường dẫn bind mount,
  `host.docker.internal`, hiệu năng file, arm64 vs amd64).

## 2. Mỗi chương sau khi nâng cấp gồm

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `dk-N-0-slides` (N không đệm 0: `dk-3-0-slides`, `dk-10-0-slides`) | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1–2 đoạn: bộ slide gồm những phần nào, dùng thế nào), rồi MỘT `${gallery('dk-NN', [[1,'Bìa'], …])}` đặt SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide (bộ kiểm đếm) |
| N.1… | slug cũ giữ nguyên | `LESSON` (giữ type cũ) | bài cũ + phần chèn thêm (mục 3) |
| (tuỳ) | `dk-N-K-<ten>` với K chưa dùng | `LESSON` | **Chỉ** thêm bài mới khi chương có lỗ hổng kiến thức THẬT (mục 5) |
| cuối | slug quiz cũ giữ nguyên | `QUIZ` | viết lại theo mục 4 |

Mọi bài mới: `isFreePreview: true`. Bài cũ giữ nguyên `isFreePreview` như đang có.
`title` dạng `'N.M — English|||N.M — Tiếng Việt'`, cả chuỗi ≤ 180 ký tự. `description` 1 câu tiếng Việt.
Đầu file thêm `import { gallery, slide } from './_slides.mjs';`. Mẫu N.0: xem bài `git-1-0-slides` trong
`content/courses/git/s01-mo-hinh.mjs`.

## 3. Chèn gì vào MỖI bài dạy cũ (cả khối EN lẫn khối VI)

1. **3–6 slide** bằng `${slide('dk-NN', n, 'chú thích ngắn')}` đặt NGAY SAU dòng `<h3>…</h3>` của đoạn đang
   giảng đúng nội dung slide đó (cùng slide ở cả hai khối ngôn ngữ; chú thích tiếng Việt dùng cho cả hai).
   Bộ kiểm đòi ≥ 3 slide ở MỖI khối của mỗi bài dạy.
2. Ngay TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối ngôn ngữ (không có thì trước `<p class="note-ct">` cuối
   khối, không có nữa thì cuối khối), chèn ba mục theo đúng thứ tự và đúng tiêu đề (bộ kiểm tìm `<h3>🧪` …):
   - EN `<h3>🧪 Practice (15–20 min)</h3>` / VI `<h3>🧪 Thực hành (15–20 phút)</h3>` —
     `<div class="callout ok"><ol><li>…</li></ol>` + (tuỳ) một khối lệnh/kết quả + `<p><strong>Done when: / Đạt khi:</strong> tiêu chí KIỂM ĐƯỢC</p></div>`.
     Bài tập làm trong thư mục sân tập `~/thu-docker` (Mục 0/Chương 1 tạo), 3–5 bước, **tình huống thật**
     ("container Postgres của nhóm mất dữ liệu sau khi `compose down`…"), không phải "hãy thử lệnh X".
     Đừng trùng với bài Code Lab đã có trong link-card 🧪 cuối bài — bài tập của mình là bài làm-ngay trên máy.
   - EN `<h3>🗂 Key terms</h3>` / VI `<h3>🗂 Thuật ngữ trong bài</h3>` — `.kv-grid` 5–8 mục; bên VI:
     `Thuật ngữ gốc (nghĩa Việt)` → giải thích 1 câu dễ hiểu. (2 bài đã có `.kv-grid` — vẫn thêm mục này.)
   - EN `<h3>📌 Summary</h3>` / VI `<h3>📌 Tóm tắt</h3>` — `<ul>` 5–6 ý, mỗi ý một câu chốt.
3. Được thêm khối `.callout`/`.pitfall co-tieu-de`/ví dụ vào giữa bài — ưu tiên sai lầm thật (mục 1).
4. **ĐÀO SÂU (bắt buộc cân nhắc cho từng bài):** đọc bài như một người MỚI HỌC Docker. Chỗ nào bài nhảy cóc
   (dùng một khái niệm chưa giải thích, một lệnh không nói từng cờ nghĩa là gì, một output không đọc giúp từng
   cột), thì chèn thêm một đoạn `<h3>` mới hoặc một khối giải thích (`.callout` / `.lz-flow` / bảng) ngay chỗ đó.
   Mục tiêu: người học đọc bài + nhìn slide là hiểu và LÀM LẠI được, không cần tra ngoài. Mỗi bài cân nhắc ít
   nhất: (a) một đoạn "Chạy thử từng bước" nếu bài chưa có chuỗi lệnh liền mạch làm theo được, (b) bảng giải
   thích cờ/tham số nếu bài dùng lệnh nhiều cờ, (c) "Khi nào dùng / khi nào KHÔNG" nếu bài dạy một lựa chọn.
   Phần đào sâu cũng song ngữ đầy đủ. Không độn chữ — mỗi đoạn thêm phải dạy một điều bài cũ chưa dạy rõ.

Bài tập + thuật ngữ + tóm tắt + phần đào sâu bên EN là bản song song ĐẦY ĐỦ ý của bên VI, không phải bản rút gọn.

## 4. Quiz cuối chương — viết LẠI hoàn toàn

- `content`: hai khối EN/VI: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>`
  với `<ul>` 5–6 dòng "Tôi làm được…", rồi `${slide('dk-NN', <slide bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
  Được giữ lại ý của nội dung quiz cũ nếu hợp, nhưng bộ kiểm không so độ dài bài QUIZ.
- `quiz: { timeLimitSeconds: 900, questions: [ …10 câu… ] }`. Mỗi câu:
  `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
  Phương án chỉ gồm lệnh/code giống nhau hai ngôn ngữ thì viết một lần, không cần `|||`.
- **Tình huống thực tế** ("Container api restart liên tục, `docker ps` báo `Restarting (137)`…") hơn là hỏi định nghĩa.
- `explanation` nói vì sao đúng + vì sao phương án hấp dẫn nhất lại SAI.
- **Rải đáp án**: 10 câu, mỗi vị trí A/B/C/D xuất hiện 2–3 lần. Phương án sai phải hợp lý, độ dài tương đương đáp án đúng
  (đừng để đáp án đúng luôn là câu dài nhất).
- Ngoại lệ: **Mục 0** hiện có quiz `dk-0-4-quiz` → GIỮ và viết lại như mọi chương (10 câu). **Chương 12** bài
  `dk-12-6-quiz-cuoi`: đổi title thành `'12.6 — Chapter 12 check|||12.6 — Kiểm tra Chương 12'` và viết 10 câu về
  Chương 12 (bài thi cuối khoá thật chuyển sang Chương 16: `dk-16-5-kiem-tra-cuoi-khoa`, 20 câu).

## 4b. Mục 0 — hai bài "Bắt đầu tại đây" (BẮT BUỘC, người dùng yêu cầu 23/09/2026)

Người dùng: *"phần đầu khoá khi mới bắt đầu học, cho user lần đầu học và dùng… phải giới thiệu … là gì, khác biệt,
lịch sử ra đời và tại sao nó ra đời, nó dùng để làm gì? có quan trọng không? giúp gì được cho bạn trong dự án công
việc… + hướng dẫn cách học sao cho hiệu quả không nản… những lỗi hay sự việc nghiêm trọng khi không dùng… để user
hình dung được"*. Bài đầu tiên người mới bấm vào phải khiến họ HIỂU và MUỐN học.

Mục 0 thêm HAI bài đứng TRƯỚC `dk-0-0-slides` (bộ kiểm cho phép slug `dk-0-K-bat-dau-…` đứng trước bài slide):
1. `dk-0-5-bat-dau-tai-day` — title `'Start here (1/2) — What Docker is, where it came from, and why it matters to you|||Bắt đầu tại đây (1/2) — Docker là gì, ra đời thế nào, và vì sao nó quan trọng với bạn'` (cắt cho ≤180 ký tự nếu cần):
   lời chào ấm áp nói chuyện trực tiếp với người học; Docker là gì bằng hình ảnh đời thường (container chở hàng
   tiêu chuẩn) rồi mới tới định nghĩa; phân biệt Docker (công cụ) · Docker Engine · Docker Desktop · Docker Hub
   (kho ảnh) · container vs máy ảo (bảng); **lịch sử có mốc thời gian** (chroot 1979 → FreeBSD jails 2000 → Solaris
   Zones → cgroups/namespaces trong Linux → LXC 2008 → dotCloud/Solomon Hykes trình diễn Docker ở PyCon 03/2013 →
   Docker Inc., OCI 2015, containerd/runc tặng cho cộng đồng, Kubernetes, Docker Desktop đổi giấy phép 2021…) — MỌI
   mốc phải kiểm nguồn (WebFetch trang chính thức/Wikipedia/bài của chính người trong cuộc) và ghi link; **vì sao
   nó ra đời** (bài toán "máy tôi chạy được", môi trường lệch, deploy thủ công); dùng để làm gì (bảng việc cụ thể:
   dựng môi trường dev, chạy CSDL không cần cài, CI, deploy, tự host…); **quan trọng tới đâu** (số liệu có nguồn, vd
   khảo sát Stack Overflow Developer Survey mới nhất — KIỂM con số và năm); **giúp gì cho BẠN**: đồ án nhóm SWP391
   (cả nhóm chạy cùng một lệnh), thực tập/phỏng vấn (câu hỏi Docker hay gặp), công việc DevOps/backend; khoá này
   sẽ đưa bạn tới đâu (liên kết lộ trình 17 phần).
2. `dk-0-6-bat-dau-khi-khong-co` — title `'Start here (2/2) — Life without it: real disasters, and how to learn this without giving up|||Bắt đầu tại đây (2/2) — Khi không có nó: những sự cố thật, và cách học để không bỏ cuộc'`:
   5–7 câu chuyện sự cố **có thật và kiểm được** (ghi nguồn) hoặc tình huống điển hình của sinh viên (ghi rõ là tình
   huống minh hoạ, không bịa như chuyện thật): môi trường lệch làm demo đồ án chết trước hội đồng, "cài Postgres
   cả buổi chiều", deploy tay quên bước làm sập trang, thư viện hệ thống khác phiên bản giữa máy dev và server,
   cùng các sự cố container THẬT ở mục 1 của hợp đồng (502 vì musl/glibc, đĩa đầy vì cache build…) — mỗi cái:
   chuyện gì xảy ra → hậu quả → Docker (dùng đúng) ngăn nó thế nào → học ở chương nào. Rồi **cách học hiệu quả,
   không nản**: vì sao người mới hay bỏ (thuật ngữ tiếng Anh dồn dập, lỗi đỏ đáng sợ, học lý thuyết mà không làm),
   lộ trình tối thiểu 2 tuần / đầy đủ, nhịp mỗi buổi (xem slide → đọc bài → gõ lại lệnh → 🧪 → quiz), cách đọc
   thông báo lỗi, cách hỏi khi bí, mẹo cho người yếu tiếng Anh (ô 🗂), thử thách nhỏ có thưởng (mốc "đã làm được").
Hai bài này: khối VI mỗi bài 14–20k ký tự, EN song song đầy đủ, `isFreePreview: true`, có slide (thêm slide vào deck
`dk-00`: timeline lịch sử, bảng Docker vs VM, sơ đồ "ai dùng Docker để làm gì", thẻ sự cố, lộ trình học), `.pitfall`,
🧪 (bài tập nhẹ nhàng, thành công chắc chắn trong 10 phút — để có cảm giác "mình làm được"), 🗂, 📌, link-card nguồn.
Giọng ấm, khích lệ, cụ thể — không sáo rỗng ("Docker là công nghệ mạnh mẽ…"). Ưu tiên chuyện kể + hình.

## 5. Thêm bài mới trong chương cũ? (thận trọng)

Chỉ khi có lỗ hổng rõ ràng mà người học thật sẽ vấp và chương khác KHÔNG dạy (grep cả thư mục
`content/courses/docker/` và đề cương Ch13–16 trong `_BRIEF-CHUONG-MOI.md` trước khi quyết). Tối đa 1 bài/chương,
cùng chuẩn độ dài với bài cũ (khối VI 10–15k ký tự), có đủ slide/🧪/🗂/📌. Không thêm cũng hoàn toàn ổn.

## 6. Slide — `scripts/slides-src/dk-NN.mjs` (NN có đệm: dk-00 … dk-16)

```js
import { S, cover, cards, box, steps, table, vs, kpis, flow, tag, two, list, code, mindmap, layers, host, term, diagram, yaml, seg, bars } from './_dk-chung.mjs';
export const deck = { key: 'dk-NN', code: 'DOCKER · CHƯƠNG N', title: '<tên chương ngắn>', sub: 'Docker · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
- **22–32 slide**: bìa → bản đồ chương (mindmap) → **mỗi bài dạy 4–6 slide** theo thứ tự bài (mở đầu mỗi cụm có thể
  là một slide "Bài N.M — câu hỏi bài trả lời") → 1 slide "Sai lầm hay gặp" của chương → 1 slide "Bảng tra nhanh"
  → 1 slide "Thực hành chương N" (một buổi 30–45 phút nối các bài tập lại).
- **Mỗi slide dạy MỘT ý**, tiêu đề là một câu khẳng định ("Xoá file KHÔNG làm ảnh nhỏ đi"), không phải nhãn
  ("Tầng ảnh"). Người học xem riêng bộ slide phải hiểu được mạch chương.
- **Ưu tiên HÌNH hơn chữ.** Docker rất dễ vẽ — khái niệm nào có hình thì PHẢI dùng hình:
  - `layers({rows, cap, w})` — chồng tầng ảnh (dưới → trên), `rw:true` tầng ghi được, `mnt:true` mount. Dùng cho
    image/cache/multi-stage/copy-on-write/whiteout.
  - `host({t, ctrs:[{n, im, items, port, c}], side:[{t, c}]})` — máy chủ chứa container + volume/mạng/cổng.
  - `diagram({nodes, edges, w, h})` — hộp + mũi tên (CLI → dockerd → containerd → runc; mạng; registry; CI/CD).
    (đọc chú thích đầu hàm trong `_git-chung.mjs`: toạ độ góc trên-trái, `d` xuống dòng bằng `\n`, `bend`, `fs/ts`).
  - `term([...])` — terminal (`$ ` lệnh, `! ` đỏ, `= ` xanh, `+ ` vàng, `# ` chú thích). `yaml([[dòng, ghi chú]…], {lang:'docker'})`
    — Dockerfile/compose có ghi chú bên lề từng dòng: RẤT hợp để giải thích từng chỉ thị.
  - Khối chung: `cards`, `box`, `steps`, `table`, `vs`, `kpis`, `flow`, `two`, `list`, `code`, `mindmap`, `seg`, `bars`.
  - Cần hình kiểu mới (dòng thời gian vòng đời container, sơ đồ cổng NAT, cây thư mục overlay…)? Vẽ `<svg>` nội
    tuyến ngay trong deck của mình (xem cách `graph()` vẽ trong `_git-chung.mjs`). KHÔNG sửa file thư viện.
- Chữ trên slide tiếng Việt, ngắn (≤ ~45 từ ngoài hình), cỡ chữ đọc được trên điện thoại (không dưới 14px).
  Tham số chữ vào diagram/term/yaml/host(n, im) là chuỗi thường (hàm tự escape); tham số HTML (cards/box/steps/table/
  layers.t/host.items) tự viết `&amp;` `&lt;`.
- **Output terminal trên slide phải là output THẬT** (mục 7).
- Kiểm tràn: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/dk-NN.mjs` (phải "không slide nào tràn").
- Render: `node scripts/_render-slides.mjs --deck scripts/slides-src/dk-NN.mjs --out <RENDER>` (RENDER do người điều phối đưa).
- ⛔ **MỞ TỪNG ẢNH RA NHÌN** bằng công cụ Read. Bộ đo tràn KHÔNG thấy: mũi tên đâm xuyên chữ, hộp diagram chồng nhau,
  nhãn bị cắt mép SVG, một cột hẹp làm chữ rớt mỗi dòng một từ, slide trống trơn nửa dưới. Sửa tới khi mọi slide sạch.
  Vùng thân ~1168×520px; chữ đơn cách rộng ~0,6×cỡ chữ.

## 7. Độ chính xác — luật cứng

1. **Mọi lệnh docker và output MỚI in trong bài/slide phải CHẠY THẬT** — trên Mac (Docker Desktop 29.x, arm64)
   hoặc máy Linux nhà (`ssh linux-nha`, Docker 29.x, amd64) khi cần thứ chỉ Linux mới thấy (namespace/`/proc`/cgroup/
   iptables/overlay trên máy chủ). Ghi môi trường chạy khi nó ảnh hưởng output. Output dài thì được cắt bớt dòng
   (ghi `…`), không được sửa chữ. ID container/digest trong output là của lần chạy đó.
2. Output CŨ trong bài: không bắt buộc chạy lại. Nhưng thấy chỗ nào SAI về hành vi (không phải chỉ khác phiên
   bản/ID) thì sửa và ghi vào báo cáo. Docker đổi nhanh: `docker compose` v2 (không phải `docker-compose`), BuildKit
   mặc định, `version:` trong compose đã lỗi thời… — bài cũ nói ngược thì sửa.
3. Tính năng/giới hạn hay đổi (Docker Desktop license, Docker Hub rate limit, Docker Scout, Compose spec, Dev
   Containers, Testcontainers, GHCR…): kiểm trên docs.docker.com / docs.github.com / trang chính thức bằng WebFetch
   trước khi viết con số; ghi mốc "(tính đến 09/2026)".
4. **Mọi URL mới phải GET thật** → 200 (theo redirect). Thà ít link còn hơn link chết.
5. Không bịa trích dẫn, không bịa số liệu.

## 7b. AN TOÀN KHI CHẠY DOCKER — luật cứng (máy thật đang chạy việc thật)

Máy Mac đang chạy container THẬT: `cuong_pg_new` (CSDL phát triển), `cuonghoang_redis`, `sonarqube-swt301`, và có
63+ volume của các dự án khác. Máy linux-nha chạy GPU/AI cho người dùng.
- Mọi thứ bạn tạo (container, volume, mạng, ảnh) **đặt tên bắt đầu bằng `dkNN-`** (NN = số chương, vd `dk07-pg`,
  ảnh `dk07-web:1`) và gắn `--label dkhoc=NN` khi lệnh cho phép. Compose: đặt `name: dkNN-…` trong file hoặc `-p dkNN-…`.
- ⛔ **CẤM** `docker system prune`, `docker volume prune`, `docker image prune -a`, `docker container prune`,
  `docker network prune`, `docker builder prune` KHÔNG có `--filter label=dkhoc=NN`; cấm `docker rm -f $(docker ps -aq)`
  và mọi lệnh nhắm "tất cả"; cấm đụng (stop/rm/exec/restart) container/volume không mang tiền tố `dkNN-`; cấm
  khởi động lại / tắt Docker Desktop hay dockerd. Muốn minh hoạ prune ⇒ chạy có `--filter label=dkhoc=NN`, hoặc
  chỉ in lệnh + giải thích mà không chạy.
- Cổng: chỉ dùng dải **18NN0–18NN9** (vd Chương 7 dùng 18070–18079). Không dùng 3000/5432/5434/6379/9000/80/443.
- Thử giới hạn tài nguyên: `--memory` ≤ 256m, không chạy thứ ăn hết CPU quá 30 giây, không làm đầy đĩa.
- ⛔ `docker login` CHỈ với registry cục bộ của mình, và LUÔN kèm `DOCKER_CONFIG=<scratch>/docker-cfg` (thư mục cấu hình tạm) —
  không bao giờ ghi vào `~/.docker/config.json` hay Keychain của máy thật; `docker logout` cũng chỉ trong DOCKER_CONFIG tạm đó.
  Mọi `docker push` phải có tên ảnh bắt đầu bằng `localhost:18NNx/` (đọc lại lệnh trước khi Enter — Ch3 từng lỡ push về Hub).
- Registry: không `docker login`/`push` lên Docker Hub/GHCR thật. Cần registry ⇒ `registry:2` cục bộ tên `dkNN-reg`
  ở cổng trong dải của mình.
- linux-nha: chỉ đọc/khảo sát + container nhỏ của mình, cùng các luật trên; không `sudo` thay đổi cấu hình hệ thống
  (daemon.json, iptables, systemd). VPS production: KHÔNG BAO GIỜ đụng.
- Kho thử/file tạm: trong thư mục scratch người điều phối đưa, KHÔNG trong repo api-backend.
- Xong việc: xoá đúng những gì mình tạo, theo TÊN (`docker rm -f dk07-pg`, `docker volume rm dk07-data`…), rồi
  `docker ps -a --filter name=dkNN-` phải rỗng.

## 7c. Docker 29 — điều đã đo ở Chương 1 (đừng tốn thời gian khám phá lại)

- Mac: Docker Desktop 4.91 / Engine 29.8 arm64; linux-nha: Engine 29.6 amd64. Cả hai dùng **kho ảnh containerd**:
  `docker inspect` KHÔNG còn `.GraphDriver`; xem tầng bằng `findmnt -t overlay` (trên Linux) — snapshot ở
  `/var/lib/containerd/…/snapshots/N`; `docker images` có cột mới (DISK USAGE vs CONTENT SIZE); `docker save` ra
  bản nén. Output cũ trong bài viết theo Engine 27 (overlay2/GraphDriver) ⇒ nói rõ khác biệt khi gặp.
- busybox `sh -c 'lệnh'` tự exec lệnh CUỐI (PID 1 là lệnh đó, không phải shell) — demo "shell làm PID 1" phải có
  hai lệnh (`'sleep 600; echo done'`).
- linux-nha: KHÔNG có sudo, `/proc/1/ns` không đọc được ⇒ khảo sát nhân bằng container phụ `--pid=host`
  (vd `docker run --rm --pid=host --privileged alpine …` — chỉ đọc, xoá ngay).
- Docker Desktop trên Mac dừng container sau ~3 giây chứ không phải 10 giây như Linux (chưa rõ vì sao) —
  đo gì liên quan thời gian thì đo trên Linux.
- `LiveRestoreEnabled` trên Docker Desktop là `false`. Demo OOM chắc ăn: `--memory 128m --memory-swap 128m` +
  `dd … bs=200M` ⇒ exit 137, `OOMKilled=true` (256m + swap thì thường KHÔNG chết).
- Thư viện có sẵn (đã thêm sau Ch1): `term(lines, {title, dir:'~', fs:15})` mặc định chữ 15px, dấu nhắc `~`;
  `sv/R/T/A` để tự vẽ SVG (xem cách `dk-01.mjs` vẽ `overlay()`, `stopTimeline()`, `procLens()` — được CHÉP các
  hàm đó vào deck mình rồi sửa). `diagram()` với `mono:true` áp cả dòng phụ ⇒ dòng phụ dài dễ tràn hộp: để
  `mono` tắt hoặc tự vẽ bằng `sv/R/T/A`; hai mũi tên ngược chiều giữa cùng hai hộp sẽ chồng nhau ⇒ dùng `bend`.
- Màu `'dk'` chỉ hiểu ở `layers/host/diagram/term/mindmap/sv…` — các khối của CR (`cards`, `bars`, `seg`, `kpis`,
  `flow`, `steps`) KHÔNG hiểu `'dk'` (ra ô trống màu) ⇒ dùng `'blu'`. Trong `cards`, chữ đậm viết `<strong>`, KHÔNG `<b>`
  (CSS `.c-card b` biến `<b>` thành tiêu đề khối). Lệnh dài trong `term()` thì tách dòng bằng `\` như shell.

## 8. Thoát ký tự trong template literal (bộ kiểm chặn)

- Không backtick trần → `&#96;`. Gạch chéo ngược → `\\`. **`${VAR}` (compose/shell) viết là `&#36;{VAR}`** — bộ kiểm
  `dk-ghep-chuong` báo lỗi với MỌI chữ `${` còn lại trong nội dung, kể cả dạng `\${`. `$(docker …)` viết `\$(` được.
  `{{.State.Pid}}` thì không sao.
- Trong `<pre><code>`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`. Mã: `<pre><code class="language-bash">…</code></pre>`
  (dockerfile: `language-dockerfile`, compose: `language-yaml`).
- Output lệnh: `<div class="out">…</div>`. Chú thích trong mã: `<span class="tok-comment"># …</span>`.
- KHÔNG `<svg>`, iframe, script, style trong nội dung bài (bị lọc) — hình đi qua slide.
- Phím bấm viết trong `<code>`. Chuỗi JS nháy đơn (title/quiz): không `\\'`; dùng `’` hoặc nháy kép.
- Khối được phép: `.eyebrow .lead h3 p ul ol table .kv-grid>.kv>.k/.v .callout.ok|.warn|.danger .pitfall(.co-tieu-de)
  .note-ct .lz-flow>.lz-step .lz-stack>.lz-layer .out .link-card` — bắt chước đúng cách chương đang dùng.

## 9. Kiểm trước khi báo xong

```bash
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/dk-NN.mjs
node scripts/_render-slides.mjs  --deck scripts/slides-src/dk-NN.mjs --out <RENDER>
node scripts/dk-ghep-chuong.mjs content/courses/docker/sNN-*.mjs --render <RENDER>        # chương mới: thêm --moi
node scripts/course-content-check.mjs ./content/courses/docker.mjs
docker ps -a --filter name=dkNN- ; docker volume ls --filter name=dkNN-                  # phải rỗng
```
Tất cả phải sạch. Rồi **đọc lại** bài tập/quiz của mình một lượt: con số có khớp nhau không, lệnh trong bài tập có
đúng thứ tự chạy được không, đáp án đúng có thật sự đúng không.

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · danh sách bài + độ dài trước→sau · phần đào sâu đã thêm (bài nào, về gì) · bài mới (nếu có) và lý do ·
câu chữ cũ đã sửa vì sai (nếu có) · phân bố đáp án quiz · slide nào đã phải sửa sau khi nhìn và vì sao ·
điều gì chưa chắc/chưa kiểm được · xác nhận đã dọn sạch container/volume `dkNN-`.
