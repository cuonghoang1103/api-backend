# Deep Dives — MỞ PHIÊN MỚI ĐỌC FILE NÀY

Cập nhật 30/7/2026, sau khi xong **10/12 bài**. Nhánh `feat/playground-3d`.
File này đủ để bắt đầu bài 11 mà **không cần đọc lại phiên cũ**.
(Bối cảnh trang chủ + lịch sử bẫy: `scratchpad/DEEPDIVES-HANDOFF.md`.)

---

## Việc: viết 5 bài Deep Dives còn lại

Bài 11 tiếp theo — **BÀI CUỐI phải viết**: *Reading Production: Logs, Metrics
and a Calm Head* (thẻ số 12 trong `deepDivesData.ts`, đang trỏ `/exam`). Bài
Node.js (thẻ 3) đã có khoá 112 bài — giữ `href` chứ không viết lại, nên xong
bài 11 là **loạt bài HOÀN TẤT**.

Ngôn ngữ: **tiếng Anh**. Thước đo 7 bài đầu:

| Bài | Từ (không tính code) | Khối code | Sơ đồ | Link nội bộ |
|---|---|---|---|---|
| 1. command line | 5.679 | 70 | 4 | 3 |
| 2. event loop | 5.230 | 74 | 4 | 3 |
| 3. GraphQL | 4.887 | 36 | 3 | 3 |
| 4. webpack | 5.074 | 95 | 4 | 3 |
| 5. CSS | 4.835 | 101 | 4 | 3 |
| 6. React | 4.913 | 64 | 4 | 3 |
| 7. Redux | 4.827 | 77 | 4 | 3 |
| 8. Vue | 4.939 | 76 | 4 | 3 |
| 9. shell scripting | 4.854 | 81 | 4 | 3 |
| 10. Mac setup | 4.829 | 63 | 4 | 3 |

Số khối code tuỳ chủ đề (CLI cần nhiều, GraphQL ít hơn). **Từ 4.800 trở lên.**

---

## CHUẨN CHẤT LƯỢNG — user chốt 30/7: "làm cực kì chi tiết đầy đủ chuyên nghiệp như này"

Không phải độ dài. Sáu thứ dưới đây là những gì làm nên 3 bài đầu — thiếu chúng
thì dài mấy cũng thành nội dung đại trà:

1. **Chạy thật rồi mới viết.** Mọi output trong bài là output thật của đúng đoạn
   code in trong bài. Mỗi bài tới nay đều có **2-3 chỗ việc chạy đã BÁC BỎ** điều
   sắp viết ra (`nextTick` vs promise đổi chỗ giữa CJS/ESM · thông báo lỗi BSD
   `sed -i` đổi theo tên file · `!$` không dùng được trong cùng dòng).
2. **Thừa nhận khi bị bác bỏ, ngay trong bài.** Bài 2 có hẳn một đoạn kể việc đo
   trong tab ẩn cho số liệu vô nghĩa và **đã cắt** một đoạn viết dựa trên nó.
   Người đọc tin bài viết dám nói nó đã sai ở đâu.
3. **Nói thẳng khi KHÔNG nên dùng.** Bài 3 có mục "when not to use it" ghi rõ site
   này phục vụ ~40 module qua REST và đó là lựa chọn đúng. Đừng bán hàng.
4. **Số liệu đo được, không phải "nhanh hơn đáng kể".** 3062 byte → 478 byte ·
   5 lookup → 1 · `/ping` 10ms → 110ms khi có request chặn · 604ms → 202ms.
5. **Ví dụ lấy từ chính hệ thống này** khi có: `lsof -ti:3000` vì `pkill -f`
   không khớp `next-server` · `[ "$x" = false ] && fail` làm deploy tự chết ·
   `df -h` khi Docker build cache ăn hết đĩa. Chân thực hơn ví dụ bịa.
6. **Giọng người, câu có ý kiến.** Không "In today's fast-paced world", không
   "Let's dive in", không đoạn mở đầu tóm tắt lại tiêu đề.

---

## Kế hoạch demo cho từng bài còn lại (dùng luôn, khỏi nghĩ lại)

Mỗi dòng là thứ **phải chạy thật** rồi dán output. Sơ đồ đề xuất trong ngoặc.

**4. webpack from scratch** — ✅ XONG 30/7, commit `c0a2baf`. Lab ở
`scratchpad/wp-lab` (ngoài repo). 6 chỗ việc chạy BÁC BỎ dự đoán, đều ghi trong
docstring của `.mjs` — đọc nó nếu cần sửa bài. Đắt nhất: `experiments.css` là
`'auto'` từ webpack ~5.9x nên **KHÔNG cần css-loader nữa** (nhưng webpack 5.90
mà Next 14.2.15 đóng gói thì VẪN cần) · `splitChunks.minSize` **10000 ở dev vs
20000 ở prod** nên đồ thị chunk hai bên khác nhau · `lodash-es` barrel vs deep
import ra bundle GIỐNG TỪNG BYTE · `babel-loader` nhắm ie11 vẫn để lại 35 arrow
vì runtime là webpack sinh sau loader, phải thêm `target: ['web','es5']`.

**5. CSS fundamentals** — ✅ XONG 30/7, commit `d21e5ef`. Lab ở
`scratchpad/css-lab/` (v1→v6, giữ lại để chạy lại được). **CÁCH ĐO TRONG TRÌNH
DUYỆT — dùng lại cho bài React/Vue:** trang `file://` NGOÀI dự án chỉ ra ảnh chụp
tĩnh, KHÔNG chạy JS ⇒ phải phục vụ qua HTTP. Thêm một entry vào
`.claude/launch.json` (thư mục này KHÔNG nằm trong git nên vô hại) trỏ
`python3 -m http.server <port> --directory <lab>`, rồi `preview_start` theo tên.
Trang tự in kết quả vào `<pre>`, đọc lại bằng `get_page_text` hoặc
`javascript_tool`. ⚠️ Tab đó là tab NỀN: đo layout thì tin được, đo **thời gian**
thì KHÔNG — bài 5 nói thẳng là không có số liệu transition/animation vì thế.
⚠️ `elementFromPoint` ăn toạ độ **viewport** ⇒ `scrollIntoView` trước khi đo,
không thì ra `null` (dẫm 3 lần).

**6. React structure** — ✅ XONG 30/7, commit `f65bb19`. Lab
`scratchpad/react-lab/` (harness.mjs + 01..07): jsdom + createRoot + `act`, bộ
đếm trong thân component. **DÙNG LẠI CHO BÀI VUE.** Bẫy đã dẫm: Node 22 có
`globalThis.navigator` chỉ-đọc (phải `Object.defineProperty`) · `root.unmount()`
cũng là một cập nhật, không bọc `act` là ra đúng 1 cảnh báo/lần · React 19 có
value-tracker nên **gán `input.value` trực tiếp KHÔNG kích hoạt `onChange`**
(phải gọi setter native của prototype). Phát hiện đắt nhất: "barrel file làm
phình bundle" SAI — 49 B vs 49 B giống từng byte; giá thật là side effect ở
top-level module.

**7. Redux** — ✅ XONG 30/7, commit `1eac247`. Lab `scratchpad/redux-lab/`
(01..06 + `size/`), copy `harness.mjs` từ react-lab. Phát hiện đắt nhất: **"RTK
bớt nhiều boilerplate" SAI** — 14 dòng → 13 dòng. Kèm: sửa state ngoài reducer
throw ngay tại dòng đó (RTK đóng băng state, KHÔNG phải middleware báo sau) ·
`.unwrap()` throw **Object** không phải Error · 3 dispatch = store notify 3 lần
nhưng render 1 lần · "createSelector có tham số đập cache" đã lỗi thời ở RTK 2.
Đo byte bằng esbuild với `--external:react` (10.670 B gzip cho một cái nút đếm).
Đo THỜI GIAN trong Node thì tin được (khác hẳn tab nền của trình duyệt).

**8. Vue** — ✅ XONG 30/7, commit `3949acd`. Lab (ĐƯỜNG DẪN TUYỆT ĐỐI, vì
scratchpad mỗi phiên một thư mục khác — phiên trước ghi đường dẫn tương đối nên
phải đi tìm):
`/private/tmp/claude-501/-Users-admin-Downloads-api-backend/becd3039-952a-4510-9831-f6bb0c076484/scratchpad/vue-lab`
(01..10 + `bench-*.mjs` + `size/` + **`ALL-OUTPUT.txt` đã lưu mọi output**).
Lab bài 4-7 nằm ở `.../e9117f46-abc6-4e6b-b4b3-810b07e8770c/scratchpad/{wp,css,react,redux}-lab`.

Cách đo, dùng lại được: đếm render bằng `probe()` gọi TRONG TEMPLATE (đừng dùng
render() viết tay — compiler sinh PatchFlags nên hành vi khác hẳn), đối chứng
bằng hook `updated()`; đếm thao tác DOM bằng `MutationObserver` thật.

**6 chỗ việc chạy BÁC BỎ dự đoán** (ghi đủ trong docstring `.mjs`). Đắt nhất:
"Proxy của Vue 3 nhanh hơn defineProperty của Vue 2" là **NGƯỢC** (290 ns vs
3,2 ns mỗi lần ghi; Proxy trần trap rỗng đã 182 ns ⇒ phần lớn là do NGÔN NGỮ,
không phải Vue) — Proxy đổi lấy tính ĐÚNG + khởi tạo lười nhanh **17×** ·
"đừng destructure reactive" chỉ đúng với giá trị NGUYÊN THUỶ · `v-model` KHÔNG
phải `:value` + `@input` (là `onUpdate:modelValue` + directive `_vModelText`) ·
"dịch template trước làm mount nhanh hơn" là **nhiễu JIT** vì chạy chung một
process ⇒ từ nay đo mỗi framework MỘT PROCESS RIÊNG, 7 lượt, lấy trung vị ·
lệch hydrate KHÔNG bỏ DOM server (vá text tại chỗ, node y nguyên) · đổi text là
1 `childList` chứ không phải `characterData` (`textContent` thay con theo spec).

Số đắt nhất của bài: thêm 1 hàng vào danh sách 1.000 hàng → Vue có key gọi lại
**1** hàm render, Vue không key **1001**, React thường **1001**, React + memo()
**1**. Mặc định của Vue = React bọc `memo()` khắp nơi.

**9. Shell scripting** — ✅ XONG 30/7, commit `c5a1c46`. Lab (ĐƯỜNG DẪN TUYỆT
ĐỐI): `/private/tmp/claude-501/-Users-admin-Downloads-api-backend/becd3039-952a-4510-9831-f6bb0c076484/scratchpad/sh-lab`
(01..11 + `ALL-OUTPUT.txt`). Cách đo dùng lại được: **mỗi ca một `bash -c`
riêng** để một lần `exit` không giết bộ đo; bảng macOS-vs-Linux dựng bằng cách
chạy CÙNG MỘT file script trên host và trong `debian:bookworm-slim`; shellcheck
qua `docker run koalaman/shellcheck:stable`.

**7 chỗ việc chạy BÁC BỎ dự đoán** (đủ trong docstring `.mjs`). Đắt nhất:
"`set -e` không cứu được `cd $DIR; rm -rf ./*`" là **SAI** — nó cứu hoàn toàn
(4 file còn nguyên với `set -e`, 0 file khi không có), và shellcheck cũng tắt
SC2164 khi thấy `set -e` · `set -e` bị **TẮT cho toàn thân hàm** khi hàm dùng
làm điều kiện · `pipefail` biến `yes | head -1` đang chạy đúng thành rc=141 ·
`which grep` nói `/usr/bin/grep` trong khi `grep --version` ra **ugrep 7.5.0**
(shell function che, `which` là chương trình ngoài nên mù) · `for f in $(ls)`
3 file → 6 tham số · khoá `[ ! -f lock ] && touch`: 40 tiến trình → **6/9/10
cùng thắng**, còn `mkdir`/`noclobber`/`ln -s` đúng 1 · shellcheck bắt 6 lỗi
nhưng **KHÔNG** bắt cái đã làm hỏng deploy thật của repo.

⚠️ macOS chỉ có **bash 3.2.57** (2007) — không `timeout`, không `flock`, không
`nproc`, không `mapfile`/`declare -A`/`lastpipe`/`$BASHPID`, và `${v^^}`/`${v@Q}`
là **lỗi CÚ PHÁP**. Muốn bash 5 thì dùng docker.

**10. Mac setup** — ✅ XONG 30/7, commit `ebbcbe8`. Lab (ĐƯỜNG DẪN TUYỆT ĐỐI):
`/private/tmp/claude-501/-Users-admin-Downloads-api-backend/becd3039-952a-4510-9831-f6bb0c076484/scratchpad/mac-lab`
(01-path, 02-fs, 03-git-case, 04-ssh + `ALL-OUTPUT.txt`).

⚠️ **CHỈ ĐỌC máy user.** Không cài gì, không `defaults write`, không sửa
`~/.zshrc` hay `~/.ssh`. Hồ sơ zsh lấy qua **BẢN SAO** rc dưới `ZDOTDIR` tạm;
khoá SSH sinh trong `mktemp -d`. Và **lọc riêng tư**: output `ssh-add` lộ
`user@hostname`, `ssh-keygen` lộ vân tay — đừng dán nguyên vào bài.

**7 chỗ việc chạy BÁC BỎ dự đoán.** Đắt nhất và cũng là bài học chung: **"đo
riêng một thành phần" cho kết quả SAI** — `compinit` đo riêng 0,02s nhưng trong
cấu hình thật là 206ms/lần (fpath rỗng vs fpath thật). Kèm: `ulimit -n` nay là
**1.048.576** chứ không phải 256 (mọi hướng dẫn cũ đều thừa) · APFS **giữ NFC**,
chuyện "macOS đổi sang NFD" là của HFS+ · `git mv` đổi hoa/thường làm thẳng được
trên git 2.51 · `ssh -i` KHÔNG cảnh báo khoá 0666 nếu server từ chối khoá công
khai (vì không đọc tới nửa khoá riêng) · `which` mù với shell function.

**Và lỗi của chính tôi, giữ lại trong bài làm ví dụ:** đếm `.d.ts` ra
"frontend: 0" — vô lý với một dự án Next.js. Nguyên nhân: shell còn giữ
`cd frontend` từ lệnh TRƯỚC, nên đường dẫn tương đối trỏ sang cây khác. Số 0 vô
lý nên bắt được; **một con số sai mà hợp lý thì đã lên bài**. ⇒ In `pwd` trong
mọi phép đo có đường dẫn tương đối.

Số trục: khởi động shell **1,06s → 0,12s** khi nạp nvm lười · `rg` 0,08s/4.024
file vs `grep -r` 120s/149.068 file · máy dev ăn **~51GB** trước khi có code
(Docker 35GB) · `tsc` backend chậm gấp đôi frontend vì
`.prisma/client/index.d.ts` nặng **21MB**.

**11. Reading production** — bài "3am" thực dụng: `curl -s -o /dev/null -w` đo
TTFB/status · `docker stats`/`docker logs --since` · `df -h` + `du -sh` (đĩa đầy
làm Postgres chết — đã xảy ra trên VPS này) · loop delay p99 (dùng lại demo bài
2) · `pg_stat_activity` truy vấn đang treo · đọc nginx log ra top status/endpoint
bằng `awk|sort|uniq -c` · phân biệt "429 ≠ outage" (sự cố thật của repo) ·
checklist 10 phút đầu khi có báo động. (Sơ đồ: cây quyết định "trang chết → xem
gì trước" · 4 tín hiệu đáng tin vs 4 tín hiệu gây nhiễu.)

**12. Node.js** (thẻ 3) — **giữ `href: '/courses'`**, đã có khoá 112 bài. Đừng
viết lại; nếu muốn thì chỉ viết bài dẫn nhập ngắn trỏ vào khoá.

---

## Quy trình một bài (đã chạy 3 lần, cứ theo đúng thứ tự)

**B1. Chạy thật TRƯỚC khi viết.** Dựng lab trong scratchpad, cài dep ở đó
(`npm i <pkg>` — ĐỪNG thêm vào `package.json` của repo), chạy từng demo, lưu
output. Mỗi bài tới nay đều có 2-3 chỗ mà việc chạy đã **bác bỏ** điều sắp
viết ra — đó là toàn bộ giá trị của loạt bài này so với nội dung trên mạng.

**B2. Viết `.md`** ở `content/deepdives/<slug>.md`. Bắt đầu bằng `##` (không
`#` — tiêu đề đã có trên trang). Chỉ dùng markdown mà sanitizer cho phép:
heading, đoạn, ul/ol, bảng, ```fence```, blockquote, hr, ảnh, link, `strong`,
`em`. KHÔNG `figure`/`details`/`aside`/`script` — bị lọc sạch.

**B3. Sơ đồ SVG** ở `frontend/public/deepdives/<chủ-đề>/*.svg`:
- **viewBox rộng ĐÚNG 700** (cột bài chỉ ~699px; 880px bị co 0.79 ⇒ chữ 12px
  thành 9px, không đọc nổi)
- **SVG GỘP dấu cách** (mặc định `xml:space="default"`) ⇒ căn cột bằng dấu cách
  là VÔ HIỆU, thụt lề trong khối giống-code BIẾN MẤT. Muốn thẳng cột thì tách hai
  `<text>`, cái phải dùng `text-anchor="end"`; muốn giữ thụt lề thì thêm
  `xml:space="preserve"`. ⚠️ Sơ đồ 3 bài ĐẦU đang bị mất thụt lề vì chưa biết
  điều này (ví dụ khối query trong `graphql/resolver-tree.svg`) — sửa được bằng
  một dòng, chưa làm vì phải deploy lại
- chữ nhãn ≥ 12px, mono chính 14-18px, nền `#0d1424`, viền `#1e293b`
- màu: `#4ade80` xanh lá · `#22d3ee` lơ · `#fb923c` cam · `#f43f5e` đỏ ·
  `#a78bfa` tím · `#fcd34d` vàng (code) · `#94a3b8` chữ phụ · `#64748b` chú thích
- KHÔNG gradient, KHÔNG glow (5 luật trang chủ)
- Tự phục vụ vì CSP `img-src 'self'` — không hotlink được

**B4. Viết `.mjs` metadata** cạnh `.md` (copy từ bài 3, đổi slug/title/summary/
tags/coverEmoji/coverImageUrl/readTimeMin). Docstring nên ghi những phát hiện
mà việc chạy đã bác bỏ — phiên sau cần biết.

**B5. Kiểm.**
```bash
F=content/deepdives/<slug>.md
# độ dày
echo "words: $(/usr/bin/perl -0777 -pe 's/```.*?```//gs' $F | wc -w)"
# dòng CODE quá dài (>84 ⇒ khối pre cuộn ngang; output JSON thì bỏ qua)
awk '/^```/{f=!f;next} f && length($0)>=84 {print NR": "length($0)}' $F
# sơ đồ có tràn viewBox không (script TỰ KIỂM bằng ca tràn cố ý trước khi tin)
node scratchpad/svg-fit.mjs frontend/public/deepdives/<chủ-đề>/*.svg
# render qua ĐÚNG renderer của backend rồi đếm khối code/ảnh/bảng/anchor
node scratchpad/check-article.mjs content/deepdives/<slug>.md
```

**B6. Seed + verify** (DB local `:5432` KHÔNG dùng được — xem cảnh báo dưới):
```bash
node scripts/deepdive-seed.mjs --file ./content/deepdives/<slug>.mjs --dry
DATABASE_URL="postgresql://postgres:123456@localhost:5544/academy_tmp?schema=public" \
  node scripts/deepdive-seed.mjs --file ./content/deepdives/<slug>.mjs --apply
```

**B7. Đổi thẻ** trong `frontend/src/components/home/landing/deepDivesData.ts`
từ `href:` sang `article: '<slug>'` (bỏ luôn `via:`). Chỉ đổi SAU khi seed
thành công, không thì là link chết.

**B8.** `(cd frontend && npx tsc --noEmit)` → commit từng bài một commit.

---

## ⚠️ Bốn điều BẮT BUỘC biết

1. **CÓ PHIÊN CLAUDE KHÁC làm chung cây** (`content/exams/CSI104-FE.mjs`).
   **ĐỪNG `git add -A`** — `git add` chỉ định từng file của mình.
   **ĐỪNG deploy khi chưa hỏi user** (`deploy.sh` rsync CẢ cây làm việc).
   ⚠️ 30/7: phiên kia **tự commit hộ** cả 9 file của bài 4 (`c0a2baf`, 11:03)
   trước khi commit đề CSI104 của nó (`c5763e5`, 11:07) — tách đúng, không lẫn
   file, nội dung khớp đĩa từng byte. Nhưng hệ quả: **`git status` có thể TRỐNG
   dù bạn vừa viết cả chục file**. Đừng kết luận "mất việc"; kiểm bằng
   `git log --oneline -5` và `git show HEAD:<file>` trước khi làm lại bất cứ gì.
2. **DB local `:5432` thiếu 5 cột** của `tech_trend_articles` (`kind`,
   `sources`, `ai_generated`, `ai_model`, `scheduled_at`) ⇒ seed lỗi `P2022`.
   Dùng DB tạm **`:5544/academy_tmp`** (đủ cột). Prod đủ cả.
3. **Sửa text trong khối code ⇒ PHẢI chạy lại demo** và dán output mới. Bài 2
   đã phải chạy lại 2 demo vì rút ngắn dòng code — code in một đằng, output
   trong bài một nẻo là mất tin cậy.
4. **`grep`/`find` trong shell này bị BỌC** thành `ugrep`/`bfs`. Cần hành vi
   thật của tool hệ thống thì gọi `/usr/bin/grep`, `/usr/bin/find`,
   `/usr/bin/sed`. Cần GNU thật: `docker run --rm debian:bookworm-slim`.
   Và **`perl -pi -e` sẽ ăn `${...}`** trong chuỗi JS → dùng Edit, không perl.

---

## Trạng thái repo lúc bàn giao

**Nhánh `feat/playground-3d` — prod đang chạy `ed26ede` (deploy + push 30/7).**
Bài 4 (webpack `c0a2baf`) + 5 (CSS `d21e5ef`) + 6 (React `f65bb19`) + 7 (Redux
**30/7 13:47 — ĐÃ DEPLOY bài 4-8 lên prod** (`bash deploy.sh`, exit 0, smoke-test
mọi route 401/200). Verify: 5 slug mới đều HTTP 200 trên cuongthai.com, mọi SVG
sơ đồ 200. Deploy thứ hai ngay sau đó cho `e91b79d` (bỏ vệt xanh trang chủ).
Bài 9 đã lên prod 14:15 (deploy 3) và bản sửa `a113185` lên 14:19 (deploy 4).
Bài 10 (`ebbcbe8`) deploy ngay sau đó. **BÀI HỌC deploy: commit SAU lượt rsync
thì KHÔNG lên prod** — rsync chạy ở đầu `deploy.sh`, nên sửa file lúc đang
deploy là phải deploy lại. Tất cả VẪN CHƯA push origin — chờ user test prod xong
(quy trình chuẩn ở CLAUDE.md: deploy → user xác nhận → mới push).
Đếm commit chưa push bằng `git log --oneline @{u}..HEAD | wc -l`.

```
ebbcbe8 feat(deepdives): bài 10 — How to Set up a Mac for Development
a113185 fix(deepdives): bài 9 — sửa đoạn nói sai về set -e trong $( )
5185da4 docs(deepdives): bàn giao sau bài 9
c5a1c46 feat(deepdives): bài 9 — Shell Scripting for People Who Deploy Things
e91b79d fix(landing): bỏ vệt xanh 2px cắt ngang trang chủ
fd7cd53 feat(exam): SSL101c Đề 5-7                        ← phiên khác, commit hộ
4e32d7d docs(deepdives): bàn giao sau bài 8
3949acd feat(deepdives): bài 8 — How to Use Vue, the JavaScript Framework
5980a09 docs(deepdives): bàn giao sau bài 7
1eac247 feat(deepdives): bài 7 — How to Use Redux and React
aa1e645 feat(exam): SSL101c Đề 4                          ← phiên khác
5dcf9c0 docs(deepdives): bàn giao sau bài 6
f65bb19 feat(deepdives): bài 6 — How to Structure and Organize a React Application
33c5d6b feat(exam): SSL101c Đề 3                          ← phiên khác
a2edf0e docs(deepdives): bàn giao sau bài 5
c69d4a7 feat(exam): SSL101c Đề 2                          ← phiên khác
d21e5ef feat(deepdives): bài 5 — A Complete Guide to CSS Concepts and Fundamentals
6d5e3a4 feat(exam): SSL101c Đề 1                        ← phiên khác
b85740c fix(deepdives): sơ đồ bài 1-3 — thụt lề + chữ tràn khung
1984e5b feat(exam): CSI104 Đề 10 — hoàn tất CSI104 10/10 ← phiên khác
f85f04d docs(deepdives): bàn giao sau bài 4
c5763e5 feat(exam): CSI104 Đề 9                          ← phiên khác
c0a2baf feat(deepdives): bài 4 — How to Set Up webpack From Scratch
f438640 feat(deepdives): bài 3 — An Introduction to GraphQL
139f982 feat(deepdives): bài 2 — event loop, callbacks, promises, async/await
8e069b3 feat(deepdives): bài 1 — command line + seeder
```

Hạ tầng đã xong, dùng lại cho bài cuối:

- `scripts/deepdive-seed.mjs` — idempotent theo slug, `--dry`/`--apply`, render
  `bodyHtml`+`toc` bằng ĐÚNG renderer backend ở `dist/`, giữ `viewCount` +
  `publishedAt` gốc, đọc lại row sau khi ghi. Bỏ qua kiểm ảnh khi không có
  `frontend/public` (container backend không copy `frontend/`) — **đừng bỏ nhánh
  đó, nó chống FAIL mọi deploy**
- Category `DeepDive` đã có ở BE (2 chỗ) + FE (6 chỗ); `lib/api.ts` dùng alias
  `TechTrendCategoryName`
- `deploy.sh` **Step 3.15** tự seed mọi `content/deepdives/*.mjs` mỗi deploy
- `scratchpad/svg-fit.mjs` + `scratchpad/check-article.mjs` — hai bộ kiểm, đều
  có phần **tự kiểm** vì cả hai từng báo sai khi mới viết. Phiên bài 4 sửa thêm
  **3 lần báo oan** và thêm tự kiểm cho từng ca: `&quot;` bị đếm là 6 ký tự ·
  `text-anchor="end"` (x là mép PHẢI, không phải trái) · `&lt;script` trong
  `<pre>`/`<code>` là escape ĐÚNG, không phải thẻ bị sanitizer lọc.
  **Chạy chúng và ĐỌC dòng tự kiểm** — cả hai in ra ✓/✗ cho chính nó

Mười bài đã seed trên `:5544` = bài #1..#10. Trang đọc: `/tech-trends/<slug>`.

---

## Câu mở đầu gợi ý cho phiên mới

> Đọc `scratchpad/DEEPDIVES-NEXT-SESSION.md` rồi viết bài 11 (reading
> production) theo đúng quy trình B1-B8 trong đó. Đó là bài CUỐI.
