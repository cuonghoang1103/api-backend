# Hợp đồng nâng cấp — khoá "Linux & Bash" (/courses/linux-bash)

> Đọc HẾT file này trước khi sửa một dòng nào. Nhiều agent nâng cấp song song từng chương; file này giữ cho cả khoá
> trông như do MỘT người viết. Chép từ hợp đồng khoá Docker (`content/courses/docker/_HOP-DONG.md`) — khoá đó đã làm
> xong đúng quy trình này (17 phần, 115 bài, ~490 slide, lên prod 24/09/2026).
> **Bài mẫu để bắt chước:** Chương 1 khoá Docker — `content/courses/docker/s01-mo-hinh.mjs` + deck
> `scripts/slides-src/dk-01.mjs` (cách chèn slide sau `<h3>`, bài N.0, 🧪/🗂/📌, đào sâu, quiz có giải thích).
> Chỗ nào file này không nói, làm như Docker Ch1.

## 0. Việc này là NÂNG CẤP + ĐÀO SÂU, không phải viết lại

Khoá đã có 13 phần (Mục 0 + Chương 1–12), 69 bài, mỗi bài ~16–65k ký tự song ngữ, chữ tốt, output chạy thật
Ubuntu 24.04. Thiếu: **slide/hình (0 ảnh cả khoá)**, ô thuật ngữ cho người yếu tiếng Anh, tóm tắt, bài tập kiểu
"làm được, kiểm được", quiz tử tế (quiz cũ: 8 câu, KHÔNG có giải thích, 73% đáp án là B), Mục 0 không kể lịch sử
(0 lần nhắc Thompson/Ritchie/Torvalds/Bourne/1991), không có phần nâng cao / macOS–Windows / dự án cuối khoá.

**Người dùng nói (28/09/2026):** *"kiểm tra toàn diện khoá này đã dạy + hướng dẫn đầy đủ từ giới thiệu, lịch sử,
công dụng, tại sao phải dùng nó, lợi ích, và những vấn đề sẽ gặp nếu không biết… học xong sẽ giúp được gì trong
công việc, học tập, dự án… đến chuyên gia, chuyên sâu, nâng cao đầy đủ chi tiết chất lượng (đủ mọi kiến thức, mọi
lệnh từ những lệnh phổ thông hay dùng nhất đến các lệnh nâng cao…) và quan trọng là khoá này chưa có slide đầy đủ,
chất lượng, sơ đồ, code phải có màu như VS Code…"*
⇒ Mỗi bài dạy có bộ slide riêng của nó (mục 6), **code bash trên slide tô màu kiểu VS Code** (`sh()`), và chỗ nào
bài còn nhảy cóc với người mới thì ĐÀO SÂU (mục 3.4). "Mọi lệnh" ⇒ mỗi chương có slide **Bảng tra nhanh** đủ lệnh
của chương, và chỗ nào thiếu một lệnh phổ biến thật sự (mục 5) thì bổ sung.

⛔ **LUẬT CỨNG — vi phạm là hỏng dữ liệu người học trên production:**
1. **KHÔNG xoá, KHÔNG rút gọn** nội dung cũ. Chỉ CHÈN thêm. Sửa câu chữ cũ chỉ khi nó SAI (nói rõ trong báo cáo).
   Bộ kiểm so độ dài từng bài với bản trong git HEAD — ngắn đi một ký tự là báo lỗi.
2. **KHÔNG đổi `slug`** của bài nào đã có (slug = khoá gắn tiến độ học + video).
3. **KHÔNG đổi `title` của CHƯƠNG** (trường `title` cấp section). Bài đầu chương sẽ là bài mới (N.0) nên bộ seed
   tìm chương bằng tiêu đề — đổi tiêu đề là nó tạo ra một chương trùng. `title` của từng BÀI thì được đổi.
4. Chỉ sửa 2 file của chương mình: `content/courses/linux-bash/sNN-*.mjs` và `scripts/slides-src/lx-NN.mjs` (tạo mới).
   KHÔNG sửa `_slides.mjs`, `_lx-chung.mjs`, `_dk-chung.mjs`, `_git-chung.mjs`, `_cr-chung.mjs`, `_render-slides.mjs`,
   manifest `linux-bash.mjs`, file của chương khác, `content/course-videos/`. Không commit, không push, không seed,
   không upload.

## 1. Người học (viết cho ĐÚNG người này)

- **Cường** — sinh viên CNTT FPTU, tự dựng cuongthai.com (Next.js + Express/TypeScript + Prisma + PostgreSQL + nginx,
  chạy Docker Compose trên **một VPS Ubuntu**, deploy bằng một script bash dài ~750 dòng). Dùng terminal hằng ngày
  nhưng nhiều chỗ "chép lệnh cho chạy". Sự cố THẬT đã gặp — ví dụ quý, kể như chuyện "một dự án sinh viên":
  - đĩa VPS đầy (cache build 7,6GB) làm Postgres chết giữa lúc deploy — `df`/`du`/`ncdu`;
  - `sshd_config` sửa `PasswordAuthentication no` mà không có hiệu lực vì file `50-cloud-init.conf` đọc TRƯỚC
    (luật "giá trị đầu tiên thắng") — nghiệm thu bằng `sshd -T`, không bằng `cat`;
  - thêm `Port 993` vào `sshd_config` vô tác dụng vì `ssh.socket` (systemd socket activation) giữ cổng;
  - thay file bằng `mv`/`sed -i` làm container bind-mount một file đơn vẫn thấy inode CŨ;
  - `pkill -f "next start"` không khớp vì tiến trình đổi tên thành `next-server` ⇒ diệt theo cổng `lsof -ti:3000`;
  - mạng trường chặn cổng 22 ⇒ SSH qua cổng khác, `~/.ssh/config` có `Match … exec`;
  - `cd` thất bại làm cả chuỗi `&&` phía sau bị bỏ qua; `grep` trên macOS không hiểu `\|` (BRE BSD);
  - macOS không có lệnh `timeout`, bash của Mac là **3.2** (2007) — script viết cho bash 5 vỡ trên Mac;
  - container dùng giờ UTC còn máy dùng giờ +07 ⇒ cron chạy lệch 7 tiếng.
- **Yếu tiếng Anh.** Mọi thuật ngữ tiếng Anh có nghĩa tiếng Việt NGAY cạnh lần đầu xuất hiện trong khối VI:
  "pipe (ống dẫn)", "exit code (mã thoát)", "glob (mẫu tên file)". Mỗi bài có ô 🗂 Thuật ngữ.
- Làm đồ án nhóm ở trường (SWP391…) — ví dụ làm nhóm lấy bối cảnh đó ("bạn cùng nhóm dùng Windows chạy script
  `deploy.sh` báo `$'\r': command not found`").
- Máy: **Mac M1 (zsh mặc định, bash 3.2, công cụ BSD)**, máy **Fedora 44** ở nhà (bash 5.3, GNU), VPS **Ubuntu 24.04**.
  Bạn cùng nhóm dùng Windows + WSL2 ⇒ khi hành vi khác nhau giữa GNU/Linux, macOS (BSD) và WSL thì NÓI (`sed -i ''`,
  `date -d` vs `date -v`, `stat -c` vs `stat -f`, `readlink -f`, `grep -P`, `ls --color`…).

## 2. Mỗi chương sau khi nâng cấp gồm

| Bài | slug | type | Nội dung |
|---|---|---|---|
| N.0 | `lnx-N-0-slides` (N không đệm 0: `lnx-3-0-slides`, `lnx-10-0-slides`) | `DOCUMENT` | 2 khối `.ml-en`/`.ml-vi` (eyebrow + h2 + lead + 1–2 đoạn: bộ slide gồm những phần nào, dùng thế nào), rồi MỘT `${gallery('lx-NN', [[1,'Bìa'], …])}` đặt SAU hai khối, NGOÀI khối ngôn ngữ, liệt kê ĐỦ mọi slide (bộ kiểm đếm) |
| N.1… | slug cũ giữ nguyên | `LESSON` (giữ type cũ) | bài cũ + phần chèn thêm (mục 3) |
| (tuỳ) | `lnx-N-K-<ten>` với K chưa dùng | `LESSON` | **Chỉ** thêm bài mới khi chương có lỗ hổng kiến thức THẬT (mục 5). Đặt TRƯỚC quiz |
| cuối | slug quiz cũ giữ nguyên | `QUIZ` | viết lại theo mục 4 |

Mọi bài mới: `isFreePreview: true`. Bài cũ giữ nguyên `isFreePreview` như đang có.
`title` dạng `'N.M — English|||N.M — Tiếng Việt'`, cả chuỗi ≤ 180 ký tự. `description` 1 câu tiếng Việt.
Đầu file thêm `import { gallery, slide } from './_slides.mjs';`. Mẫu N.0: bài `dk-1-0-slides` trong
`content/courses/docker/s01-mo-hinh.mjs`.

## 3. Chèn gì vào MỖI bài dạy cũ (cả khối EN lẫn khối VI)

1. **3–6 slide** bằng `${slide('lx-NN', n, 'chú thích ngắn')}` đặt NGAY SAU dòng `<h3>…</h3>` của đoạn đang giảng
   đúng nội dung slide đó (cùng slide ở cả hai khối; chú thích tiếng Việt dùng cho cả hai). Bộ kiểm đòi ≥ 3 slide ở
   MỖI khối của mỗi bài dạy. (Bài không có `<h3>` nào ở chỗ cần ⇒ đặt sau `<h2>`/đoạn `.lead`.)
2. Ngay TRƯỚC `<a class="link-card"` đầu tiên của mỗi khối ngôn ngữ (không có thì trước `<p class="note-ct">` cuối
   khối, không có nữa thì cuối khối), chèn ba mục theo đúng thứ tự và đúng tiêu đề (bộ kiểm tìm `<h3>🧪` …):
   - EN `<h3>🧪 Practice (15–20 min)</h3>` / VI `<h3>🧪 Thực hành (15–20 phút)</h3>` —
     `<div class="callout ok"><ol><li>…</li></ol>` + (tuỳ) một khối lệnh/kết quả + `<p><strong>Done when: / Đạt khi:</strong> tiêu chí KIỂM ĐƯỢC</p></div>`.
     Bài tập làm trong thư mục sân tập `~/thu-linux` (Mục 0 tạo) hoặc trong container `ubuntu:24.04` vứt đi khi cần
     root/systemd/apt; 3–5 bước, **tình huống thật** ("log của nhóm đầy đĩa, tìm 5 file lớn nhất đã sửa trong 24 giờ
     qua…"), không phải "hãy thử lệnh X". Đừng trùng bài Code Lab trong link-card 🧪 cuối bài.
   - EN `<h3>🗂 Key terms</h3>` / VI `<h3>🗂 Thuật ngữ trong bài</h3>` — `.kv-grid` 5–8 mục; bên VI:
     `Thuật ngữ gốc (nghĩa Việt)` → giải thích 1 câu dễ hiểu. (Bài đã có `.kv-grid` khác — vẫn thêm mục này.)
   - EN `<h3>📌 Summary</h3>` / VI `<h3>📌 Tóm tắt</h3>` — `<ul>` 5–6 ý, mỗi ý một câu chốt.
3. Được thêm khối `.callout`/`.pitfall co-tieu-de`/ví dụ vào giữa bài — ưu tiên sai lầm thật (mục 1).
4. **ĐÀO SÂU (bắt buộc cân nhắc cho từng bài):** đọc bài như một người MỚI HỌC Linux. Chỗ nào bài nhảy cóc (dùng một
   khái niệm chưa giải thích, một lệnh không nói từng cờ nghĩa là gì, một output không đọc giúp từng cột), thì chèn
   một đoạn `<h3>` mới hoặc khối giải thích (`.callout` / `.lz-flow` / bảng) ngay chỗ đó. Mỗi bài cân nhắc ít nhất:
   (a) "Chạy thử từng bước" nếu bài chưa có chuỗi lệnh liền mạch làm theo được, (b) **bảng cờ** cho lệnh nhiều cờ
   (cột: cờ · nghĩa · ví dụ), (c) "Khi nào dùng / khi nào KHÔNG", (d) **"Trên macOS / WSL khác gì"** khi lệnh của bài
   hành xử khác trên BSD/macOS hoặc WSL (chạy thật trên Mac để lấy output). Phần đào sâu song ngữ đầy đủ. Không độn
   chữ — mỗi đoạn thêm phải dạy một điều bài cũ chưa dạy rõ.

Bài tập + thuật ngữ + tóm tắt + phần đào sâu bên EN là bản song song ĐẦY ĐỦ ý của bên VI, không phải bản rút gọn.

## 4. Quiz cuối chương — viết LẠI hoàn toàn

- `content`: hai khối EN/VI: eyebrow + h2 + lead + `<h3>Self-check before you start</h3>`/`<h3>Tự kiểm trước khi làm</h3>`
  với `<ul>` 5–6 dòng "Tôi làm được…", rồi `${slide('lx-NN', <slide bảng tra nhanh>, 'Bảng tra nhanh Chương N')}`.
  Bộ kiểm không so độ dài bài QUIZ.
- `quiz: { timeLimitSeconds: 900, questions: [ …10 câu… ] }`. Mỗi câu:
  `{ question: 'EN|||VI', options: ['EN|||VI' ×4], correctIndex, points: 1, explanation: 'EN: …|||VI: …' }`.
  Phương án chỉ gồm lệnh/code giống nhau hai ngôn ngữ thì viết một lần, không cần `|||`.
- **Tình huống thực tế** ("Script chạy tay thì được, chạy bằng cron thì báo `command not found`…") hơn là hỏi định nghĩa.
  Ưu tiên câu "lệnh này in ra gì" / "dòng nào sửa được lỗi" — đọc lệnh là kỹ năng cốt lõi của khoá.
- `explanation` nói vì sao đúng + vì sao phương án hấp dẫn nhất lại SAI.
- **Rải đáp án**: mỗi vị trí A/B/C/D 2–3 lần trong 10 câu. Phương án sai hợp lý, độ dài tương đương đáp án đúng.
- **Mọi đáp án về output phải CHẠY THẬT** để chắc (mục 7).
- Ngoại lệ: **Mục 0** chưa có quiz → thêm `lnx-0-7-quiz` ở CUỐI Mục 0 (10 câu, như mọi chương). **Chương 12** bài
  `lnx-12-6-quiz`: đổi title thành `'12.6 — Chapter 12 check|||12.6 — Kiểm tra Chương 12'` và viết 10 câu về
  Chương 12 (bài thi cuối khoá thật chuyển sang Chương 16: `lnx-16-5-kiem-tra-cuoi-khoa`, 20 câu).

## 4b. Mục 0 — hai bài "Bắt đầu tại đây" (BẮT BUỘC)

Bài đầu tiên người mới bấm vào phải khiến họ HIỂU và MUỐN học. Mục 0 thêm HAI bài đứng TRƯỚC `lnx-0-0-slides`
(bộ kiểm cho phép slug `lnx-0-K-bat-dau-…` đứng trước bài slide), thứ tự trong file:
`lnx-0-5-bat-dau-tai-day` → `lnx-0-6-bat-dau-khi-khong-co` → `lnx-0-0-slides` → 0.1 … 0.4 (cũ) → `lnx-0-7-quiz`.
1. `lnx-0-5-bat-dau-tai-day` — title `'Start here (1/2) — What Linux and the shell are, where they came from, and why they matter to you|||Bắt đầu tại đây (1/2) — Linux và shell là gì, ra đời thế nào, và vì sao chúng quan trọng với bạn'` (cắt cho ≤180 ký tự nếu cần):
   lời chào ấm, nói chuyện trực tiếp; Linux/shell/terminal/bash là gì bằng hình ảnh đời thường trước rồi mới định
   nghĩa; phân biệt kernel · distro (Ubuntu/Fedora/Debian/Alpine) · shell (sh/bash/zsh/fish/PowerShell) · terminal
   (ứng dụng) · GNU coreutils; **lịch sử có mốc thời gian** (Multics → Unix 1969 Ken Thompson & Dennis Ritchie ở
   Bell Labs → C 1972–73 và viết lại Unix bằng C → pipe của Doug McIlroy 1973 → Thompson shell → **Bourne shell 1979**
   → BSD → Richard Stallman khởi động **GNU 1983**, FSF 1985 → **Bash 1989** (Brian Fox) → **Linus Torvalds công bố
   Linux 25/08/1991**, GPL → POSIX → Debian 1993, Red Hat 1994/95 → Ubuntu 2004 → Android 2008 → WSL 2016/WSL2 2019
   → macOS đổi shell mặc định sang zsh 2019 vì bash mới là GPLv3…) — MỌI mốc phải kiểm nguồn (WebFetch Wikipedia/
   trang chính thức/bài của chính người trong cuộc, ví dụ thư Torvalds gửi comp.os.minix) và ghi link; **vì sao nó
   ra đời** (triết lý Unix: mỗi chương trình làm một việc, nối bằng ống dẫn, văn bản là giao diện chung); **dùng để
   làm gì** (bảng việc cụ thể: máy chủ web, Docker/cloud, CI/CD, siêu máy tính, Android, thiết bị nhúng/robot, dev
   hằng ngày); **quan trọng tới đâu** (số liệu CÓ NGUỒN và năm: tỉ lệ máy chủ web chạy Unix/Linux theo W3Techs,
   TOP500 siêu máy tính, Stack Overflow Developer Survey — KIỂM con số); **giúp gì cho BẠN**: đồ án nhóm (deploy lên
   VPS), thực tập/phỏng vấn (câu hỏi Linux hay gặp), công việc backend/DevOps/AI (máy GPU đều chạy Linux), và nó
   dùng được trên cả macOS (zsh, cùng họ Unix) và Windows (WSL2, Git Bash); khoá này đưa bạn tới đâu (lộ trình 17 phần).
2. `lnx-0-6-bat-dau-khi-khong-co` — title `'Start here (2/2) — Life without it: real disasters, and how to learn this without giving up|||Bắt đầu tại đây (2/2) — Khi không biết nó: những sự cố thật, và cách học để không bỏ cuộc'`:
   5–7 câu chuyện sự cố **có thật và kiểm được** (ghi nguồn — ví dụ: lỗi `rm -rf` với biến rỗng trong script cài
   đặt của Steam trên Linux 2015 (issue GitHub valvesoftware/steam-for-linux #3671), GitLab mất dữ liệu 31/01/2017 vì
   chạy `rm -rf` nhầm máy (bản post-mortem chính thức), Shellshock CVE-2014-6271 trong bash…) hoặc tình huống điển
   hình của sinh viên (ghi rõ là minh hoạ), cùng các sự cố THẬT ở mục 1 — mỗi cái: chuyện gì xảy ra → hậu quả → biết
   Linux/bash (dùng đúng) ngăn nó thế nào → học ở chương nào. Rồi **cách học hiệu quả, không nản**: vì sao người mới
   hay bỏ (màn hình đen đáng sợ, lỗi tiếng Anh, học thuộc lệnh mà không hiểu), lộ trình tối thiểu 2 tuần / đầy đủ,
   nhịp mỗi buổi (xem slide → đọc bài → gõ lại lệnh → 🧪 → quiz), cách đọc thông báo lỗi, `man`/`--help`/`tldr`/
   explainshell, cách hỏi khi bí, mẹo cho người yếu tiếng Anh (ô 🗂), mốc "đã làm được".
Hai bài này: khối VI mỗi bài 14–20k ký tự, EN song song đầy đủ, `isFreePreview: true`, có slide (thêm vào deck
`lx-00`: timeline lịch sử, cây họ Unix, bảng kernel/distro/shell/terminal, "Linux ở đâu quanh bạn", thẻ sự cố, lộ
trình học), `.pitfall co-tieu-de`, 🧪 (nhẹ nhàng, chắc thành công trong 10 phút), 🗂, 📌, link-card nguồn.
Giọng ấm, khích lệ, cụ thể — không sáo rỗng ("Linux là hệ điều hành mạnh mẽ…"). Ưu tiên chuyện kể + hình.

## 5. Thêm nội dung / bài mới trong chương cũ? (thận trọng)

Lỗ hổng đã biết từ kiểm toán 28/09 (grep cả thư mục + đề cương Ch13–16 trong `_BRIEF-CHUONG-MOI.md` trước khi làm, để
khỏi dạy trùng). Đã có rải rác và KHÔNG cần thêm: jq, tmux, lsof, ss, dig, rsync, ncdu, getopts, shellcheck, bats,
mapfile, strace. CHƯA có / quá mỏng: `sha256sum`/checksum tải file (Ch10), `nslookup` và `host` bên cạnh `dig` (Ch9),
`ulimit` (Ch5), `less`/`man` đọc hiệu quả — tìm `/`, `n`, mục man 1/5/8, `apropos` (Ch1), `tar` các cờ nén hiện đại
`-z/-J/--zstd` (Ch2), `column`/`paste`/`comm`/`diff` (Ch3). Mảng kết hợp `declare -A`, `coproc`, process substitution,
LVM, perf, namespaces, launchd/Homebrew/WSL/PowerShell để dành cho Ch13–15 — đừng dạy ở chương cũ.
Bổ sung ưu tiên bằng một đoạn `<h3>` mới trong bài liên quan. Chỉ thêm BÀI mới khi lỗ hổng lớn mà chương khác
KHÔNG dạy — tối đa 1 bài/chương, khối VI 10–15k ký tự, đủ slide/🧪/🗂/📌. Không thêm cũng hoàn toàn ổn.

## 6. Slide — `scripts/slides-src/lx-NN.mjs` (NN có đệm: lx-00 … lx-16)

```js
import { S, cover, sh, perms, pipe, term, mindmap, diagram, cards, box, steps, table, vs, kpis, flow, two, list, tree, seg, bars, host, layers, sv, R, T, A } from './_lx-chung.mjs';
export const deck = { key: 'lx-NN', code: 'LINUX · CHƯƠNG N', title: '<tên chương ngắn>', sub: 'Linux & Bash · Chương N' };
export const slides = S([ cover({ t, sub, chap: 'CHƯƠNG N' }), { t: 'Bản đồ chương', body: mindmap(…) }, … ]);
```
(Mục 0: `code: 'LINUX · MỤC 0'`, `chap: 'MỤC 0'`.) Đọc chú thích đầu file `scripts/slides-src/_lx-chung.mjs` trước.
- **22–32 slide** (Mục 0 tới 40 vì có 6 bài dạy): bìa → bản đồ chương (mindmap) → **mỗi bài dạy 4–6 slide** theo thứ
  tự bài → 1 slide "Sai lầm hay gặp" → 1–2 slide **"Bảng tra nhanh"** (đủ lệnh + cờ quan trọng của chương, dạng
  `table` hoặc `sh()` có ghi chú) → 1 slide "Thực hành chương N" (một buổi 30–45 phút nối các bài tập lại).
- **Mỗi slide dạy MỘT ý**, tiêu đề là một câu khẳng định ("`rm` không có thùng rác"), không phải nhãn ("Lệnh rm").
- **Ưu tiên HÌNH hơn chữ**, và **code luôn có màu**:
  - `sh(lines, {fs, so, bat})` — KHỐI BASH TÔ MÀU KIỂU VS CODE Dark+ (lệnh/cờ/biến/chuỗi/từ khoá/chú thích/toán tử),
    `lines` = `[['dòng mã', 'ghi chú bên lề'], …]` hoặc chuỗi. DÙNG CHO MỌI SCRIPT và lệnh nhiều cờ — đây là thứ người
    dùng đòi ("code phải có màu như VS Code"). Không dán script vào `code()`/`box()` trần.
  - `term([...], {title, dir})` — cửa sổ terminal với output THẬT (`$ ` lệnh, `! ` đỏ, `= ` xanh, `+ ` vàng, `# ` chú thích).
  - `perms('-rwxr-x---', {raw})` — lưới quyền rwx + bát phân (Ch4, và mọi chỗ nói tới quyền).
  - `pipe([{c:'cat log', d:'dòng thô'}, …])` — dữ liệu chảy qua ống dẫn (Ch3, và mọi one-liner nhiều chặng).
  - `tree(src)` — cây thư mục (Ch1 FHS, Ch2). `diagram({nodes, edges})` — hộp + mũi tên (kernel/shell/terminal, tiến
    trình cha–con, fork/exec, SSH tunnel, systemd unit phụ thuộc…). `host()`/`layers()` — máy chủ / chồng tầng.
  - Khối chung: `cards`, `box`, `steps`, `table`, `vs`, `kpis`, `flow`, `two`, `list`, `mindmap`, `seg`, `bars`.
  - Hình kiểu mới (dòng thời gian, bảng mô tả file descriptor 0/1/2, vòng đời tín hiệu…)? Vẽ `<svg>` nội tuyến bằng
    `sv/R/T/A` ngay trong deck (xem `stopTimeline()`/`overlay()` trong `scripts/slides-src/dk-01.mjs` — được CHÉP vào
    deck mình rồi sửa). KHÔNG sửa file thư viện.
- Chữ trên slide tiếng Việt, ngắn (≤ ~45 từ ngoài hình), không dưới 14px. Tham số chữ vào diagram/term/sh/pipe/perms
  là chuỗi thường (hàm tự escape); tham số HTML (cards/box/steps/table/layers.t/host.items) tự viết `&amp;` `&lt;`.
  Trong `cards`, chữ đậm viết `<strong>`, KHÔNG `<b>`. Màu `'lx'` chỉ hiểu ở hàm của `_lx-chung`/`_git-chung`
  (term/diagram/mindmap/sv…); khối của CR (`cards`, `bars`, `seg`, `kpis`, `flow`, `steps`) dùng `'amb'` thay cho `'lx'`.
- Kiểm tràn: `node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/lx-NN.mjs` (phải "không slide nào tràn").
- Render: `node scripts/_render-slides.mjs --deck scripts/slides-src/lx-NN.mjs --out <RENDER>`.
- ⛔ **MỞ TỪNG ẢNH RA NHÌN** bằng công cụ Read. Bộ đo tràn KHÔNG thấy: mũi tên đâm xuyên chữ, hộp chồng nhau, nhãn bị
  cắt mép SVG, cột hẹp làm chữ rớt mỗi dòng một từ, slide trống nửa dưới, ghi chú `sh()` bị cắt. Sửa tới khi sạch.
  Vùng thân ~1168×520px; chữ đơn cách rộng ~0,6×cỡ chữ ⇒ `sh()` fs 16 chứa ~60 ký tự mã + ghi chú; dòng dài thì
  hạ `fs` hoặc tách dòng bằng `\`.

## 7. Độ chính xác — luật cứng

1. **Mọi lệnh và output MỚI in trong bài/slide phải CHẠY THẬT.** Môi trường chuẩn của khoá = **Ubuntu 24.04** ⇒ chạy
   trong container `docker run --rm -it --name lxNN-u ubuntu:24.04 bash` trên Mac (cài thêm gói bằng `apt-get` trong
   container). Thứ cần máy Linux thật (systemd, journalctl, `/proc` của máy thật, `ss` trên máy có dịch vụ, cgroup v2,
   hiệu năng) ⇒ `ssh linux-nha` (Fedora 44, bash 5.3 — ghi rõ "Fedora" khi output khác Ubuntu). Thứ về macOS ⇒
   chạy trên Mac (zsh 5.9, `/bin/bash` 3.2, BSD tools). Output dài được cắt dòng (ghi `…`), không sửa chữ.
2. Output CŨ trong bài: không bắt buộc chạy lại. Thấy chỗ SAI về hành vi (không phải chỉ khác phiên bản/PID) thì sửa
   và ghi vào báo cáo.
3. Thứ hay đổi (phiên bản bash/coreutils, `apt` vs `apt-get`, `ifconfig`/`netstat` đã lỗi thời, `ufw`/`firewalld`/
   `nftables`, systemd…) kiểm trên trang chính thức (gnu.org, man7.org, ubuntu.com, freedesktop.org) bằng WebFetch
   trước khi viết; ghi mốc "(tính đến 09/2026)".
4. **Mọi URL mới phải GET thật** → 200 (theo redirect). Thà ít link còn hơn link chết.
5. Không bịa trích dẫn, không bịa số liệu, không bịa sự cố "có thật".

## 7b. AN TOÀN KHI CHẠY LỆNH — luật cứng (máy thật đang chạy việc thật)

Mac của người dùng là máy làm việc CHÍNH (có container CSDL thật `cuong_pg_new`, `cuonghoang_redis`,
`sonarqube-swt301`, repo đang có thay đổi chưa commit của phiên khác). linux-nha đang chạy việc GPU/AI và pipeline
phụ đề (`phu-de-*`).
- ⛔ **Lệnh phá huỷ / đổi hệ thống CHỈ chạy trong container `lxNN-…`** (`rm -rf`, `chmod -R`, `chown`, `useradd`,
  `passwd`, `apt`, `systemctl`, sửa `/etc/*`, `kill` hàng loạt, `mkfs`, `dd`, `iptables`/`nft`/`ufw`, fork bomb,
  làm đầy đĩa). Container: tên bắt đầu `lxNN-`, `--label lxhoc=NN`, `--memory 512m`; cần systemd thật thì dùng ảnh
  có systemd chạy `--privileged` NGẮN hạn (hoặc demo trên linux-nha ở mức `systemctl --user`).
- Trên Mac, ngoài container: chỉ lệnh CHỈ ĐỌC hoặc lệnh trong thư mục scratch người điều phối đưa. Không sửa
  dotfile (`~/.zshrc`, `~/.bashrc`, `~/.ssh/*`, `~/.gitconfig`), không `crontab -e`, không `launchctl load`, không
  `sudo`, không đổi biến môi trường toàn cục, không `kill` tiến trình không do mình tạo. Muốn demo file khởi động
  shell ⇒ `HOME=<scratch>/home bash -l` hoặc `ZDOTDIR=<scratch>/zdot zsh -i`.
- linux-nha: KHÔNG có sudo. Chỉ đọc/khảo sát + thư mục `~/lxhoc-NN/` của mình (xoá khi xong) + container nhỏ tên
  `lxNN-`. Không đụng `phu-de-*`, tiến trình GPU, `~/.config/systemd`, crontab. VPS production: KHÔNG BAO GIỜ đụng.
- Cổng (nếu cần dựng server nhỏ: `python3 -m http.server`, `nc -l`): chỉ dải **19NN0–19NN9** (Ch9 dùng 19090–19099).
- Docker: cấm mọi `prune` không có `--filter label=lxhoc=NN`, cấm đụng container/volume không mang tiền tố `lxNN-`.
- Mạng ra ngoài: chỉ tới trang công khai lành (example.com, httpbin.org, api.github.com không token). Không quét cổng
  máy của người khác (`nmap` chỉ nhắm `127.0.0.1` hoặc container của mình).
- Kho thử/file tạm: trong thư mục scratch người điều phối đưa, KHÔNG trong repo api-backend.
- Xong việc: `docker ps -a --filter name=lxNN-` phải rỗng; xoá `~/lxhoc-NN` trên linux-nha.

## 8. Thoát ký tự trong template literal

- Không backtick trần → `&#96;`. Gạch chéo ngược → `\\`. **`${var}` của bash viết `\${var}`** trong template literal
  (bộ kiểm cho phép `${` trong nội dung đã đánh giá — bash cần nó; nhưng quên `\` là JS nuốt mất hoặc import lỗi ⇒
  sau khi sửa, grep nội dung bài của mình có đúng `${` như ý). `$(lệnh)` viết `$(` bình thường.
- Trong `<pre><code>`: `<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;` (chú ý `2>&1` → `2&gt;&amp;1`, `&&` → `&amp;&amp;`).
  Mã: `<pre><code class="language-bash">…</code></pre>`. Output lệnh: `<div class="out">…</div>`.
  Chú thích trong mã: `<span class="tok-comment"># …</span>` (nếu chương đang dùng).
- KHÔNG `<svg>`, iframe, script, style trong nội dung bài (bị lọc) — hình đi qua slide.
- Phím bấm viết trong `<code>` (`<code>Ctrl</code>+<code>C</code>`). Chuỗi JS nháy đơn (title/quiz): dùng `’` hoặc
  nháy kép thay cho `\\'`.
- Khối được phép: `.eyebrow .lead h3 p ul ol table .kv-grid>.kv>.k/.v .callout.ok|.warn|.danger .pitfall(.co-tieu-de)
  .note-ct .lz-flow>.lz-step .lz-stack>.lz-layer .out .link-card` — bắt chước đúng cách chương đang dùng.

## 9. Kiểm trước khi báo xong

```bash
node scripts/_kiem-tran-slide.mjs --deck scripts/slides-src/lx-NN.mjs
node scripts/_render-slides.mjs  --deck scripts/slides-src/lx-NN.mjs --out <RENDER>
node scripts/lx-ghep-chuong.mjs content/courses/linux-bash/sNN-*.mjs --render <RENDER>     # chương mới: thêm --moi
node scripts/course-content-check.mjs ./content/courses/linux-bash.mjs
docker ps -a --filter name=lxNN-                                                            # phải rỗng
```
Tất cả phải sạch (lỗi ở file chương KHÁC thì bỏ qua — agent khác đang sửa). Rồi **đọc lại** bài tập/quiz của mình:
con số có khớp nhau không, lệnh trong bài tập có chạy được theo đúng thứ tự không, đáp án đúng có thật sự đúng không.

## 10. Báo cáo (ngắn, tiếng Việt)

Số slide · danh sách bài + độ dài trước→sau · phần đào sâu đã thêm (bài nào, về gì, lệnh nào mới được dạy) · bài mới
(nếu có) và lý do · câu chữ cũ đã sửa vì sai (nếu có) · phân bố đáp án quiz · slide nào đã phải sửa sau khi nhìn và
vì sao · điều gì chưa chắc/chưa kiểm được · xác nhận đã dọn sạch container `lxNN-` và `~/lxhoc-NN`.
