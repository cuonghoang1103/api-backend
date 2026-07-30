# Deep Dives — MỞ PHIÊN MỚI ĐỌC FILE NÀY

Cập nhật 30/7/2026, sau khi xong **6/12 bài**. Nhánh `feat/playground-3d`.
File này đủ để bắt đầu bài 7 mà **không cần đọc lại phiên cũ**.
(Bối cảnh trang chủ + lịch sử bẫy: `scratchpad/DEEPDIVES-HANDOFF.md`.)

---

## Việc: viết 6 bài Deep Dives còn lại

Bài 7 tiếp theo: **How to Use Redux and React** (thẻ số 7 trong
`deepDivesData.ts`). Sau đó theo thứ tự: Vue → shell scripting → Mac setup →
reading production. Bài Node.js (thẻ 3) đã có khoá 112
bài — giữ `href` chứ không viết lại.

Ngôn ngữ: **tiếng Anh**. Thước đo 6 bài đầu:

| Bài | Từ (không tính code) | Khối code | Sơ đồ | Link nội bộ |
|---|---|---|---|---|
| 1. command line | 5.679 | 70 | 4 | 3 |
| 2. event loop | 5.230 | 74 | 4 | 3 |
| 3. GraphQL | 4.887 | 36 | 3 | 3 |
| 4. webpack | 5.074 | 95 | 4 | 3 |
| 5. CSS | 4.835 | 101 | 4 | 3 |
| 6. React | 4.913 | 64 | 4 | 3 |

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

**7. Redux** — `npm i @reduxjs/toolkit`. Demo: store + reducer thuần chạy trong
node · `dispatch` và log state trước/sau · immer trong RTK: mutate mà không
mutate (chứng minh bằng `Object.is` trên object cũ) · selector chạy lại bao
nhiêu lần với/không `createSelector` (counter) · async thunk + trạng thái
pending/fulfilled/rejected · **và mục "khi nào KHÔNG cần Redux"** — `useState` +
context + query lib đủ cho 90% app; nói thẳng như bài GraphQL.
(Sơ đồ: dispatch→reducer→store→subscriber · vị trí middleware.)

**8. Vue** — `npm i vue @vue/server-renderer`. Demo: reactivity thật —
`ref`/`reactive`, `watchEffect` chạy mấy lần · `reactive` mất tính reactive khi
destructure (bẫy số 1, chứng minh được) · computed cache vs method gọi lại ·
SFC compile ra gì (`@vue/compiler-sfc` → in ra render function) · so sánh thẳng
với React ở chỗ nào khác thật (proxy vs immutable + re-render).
(Sơ đồ: dependency tracking của reactivity · SFC → render function.)

**9. Shell scripting** — nối tiếp bài 1 nhưng sâu hơn: `set -euo pipefail` từng
cờ tách riêng (bài 1 đã có, ở đây đào sâu) · `trap` ERR/EXIT/INT · subshell vs
`source` (biến đi đâu) · `$()` trong `local` làm mất exit code · `[[ ]]` vs
`[ ]` · mảng và `"${arr[@]}"` vs `"${arr[*]}"` · `getopts` phân tích tham số ·
`mktemp -d` + cleanup · lock file chống chạy trùng (`flock`, macOS không có →
`mkdir` atomic) · retry + timeout · **và soi chính `deploy.sh` của repo** làm ví
dụ thật (bẫy `&& fail` đã làm deploy tự chết). (Sơ đồ: đời một script từ
shebang tới trap EXIT · subshell vs source.)

**10. Mac setup for development** — chạy thật những gì đo được trên máy này:
`softwareupdate --list` / `xcode-select -p` · Homebrew: `brew --prefix` khác
nhau giữa Intel/ARM (số liệu thật) · nvm/fnm và `PATH` order (dùng lại phát hiện
ugrep che grep) · SSH key ed25519 + `~/.ssh/config` + `chmod 600` · Docker
Desktop vs colima · dotfiles + `defaults write` vài tuỳ chọn hữu ích · kiểm
đúng-sai bằng `command -v` sau mỗi bước. (Sơ đồ: PATH order và ai thắng · sơ đồ
một máy đã sẵn sàng làm việc.)

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
Bài 4 (webpack, `c0a2baf`) + bài 5 (CSS, `d21e5ef`) + bài 6 (React, `f65bb19`)
+ fix sơ đồ (`b85740c`) **đã commit local, CHƯA deploy, CHƯA push** — prod vẫn 3 bài Deep Dives
(#22-24). User chốt 30/7: **đợi phiên CSI/SSL xong rồi deploy MỘT THỂ**. Thẻ
webpack + CSS trên trang chủ đã trỏ `article:` nên **trên prod là LINK CHẾT tới
khi deploy** (Step 3.15 của
`deploy.sh` seed bài lúc deploy). Đếm commit chưa push bằng
`git log --oneline @{u}..HEAD | wc -l`.

```
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

Hạ tầng đã xong, dùng lại cho 6 bài còn lại:

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

Sáu bài đã seed trên `:5544` = bài #1..#6. Trang đọc:
`/tech-trends/<slug>`.

---

## Câu mở đầu gợi ý cho phiên mới

> Đọc `scratchpad/DEEPDIVES-NEXT-SESSION.md` rồi viết bài 7 (Redux) theo
> đúng quy trình B1-B8 trong đó.
