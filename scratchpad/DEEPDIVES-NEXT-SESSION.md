# Deep Dives — MỞ PHIÊN MỚI ĐỌC FILE NÀY

Cập nhật 30/7/2026, sau khi xong 3/12 bài. Nhánh `feat/playground-3d`.
File này đủ để bắt đầu bài 4 mà **không cần đọc lại phiên cũ**.
(Bối cảnh trang chủ + lịch sử bẫy: `scratchpad/DEEPDIVES-HANDOFF.md`.)

---

## Việc: viết 9 bài Deep Dives còn lại

Bài 4 tiếp theo: **How to Set Up webpack From Scratch** (thẻ số 9 trong
`deepDivesData.ts`). Sau đó theo thứ tự: CSS → React → Redux → Vue → shell
scripting → Mac setup → reading production. Bài Node.js (thẻ 3) đã có khoá 112
bài — giữ `href` chứ không viết lại.

Ngôn ngữ: **tiếng Anh**. Thước đo 3 bài đầu:

| Bài | Từ (không tính code) | Khối code | Sơ đồ | Link nội bộ |
|---|---|---|---|---|
| 1. command line | 5.679 | 70 | 4 | 3 |
| 2. event loop | 5.230 | 74 | 4 | 3 |
| 3. GraphQL | 4.887 | 36 | 3 | 3 |

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

**4. webpack from scratch** — dựng lab trong scratchpad, `npm i webpack
webpack-cli babel-loader css-loader`. Demo: bundle đầu tiên và ĐỌC output
(`asset main.js X KiB`) · entry/output · thêm loader cho CSS rồi xem file đổi cỡ
· `mode: development` vs `production` (số byte thật, thường 8-10×) · source map
4 kiểu và cỡ file mỗi kiểu · code splitting `import()` → đếm chunk sinh ra ·
`stats.json` + `--analyze` chỉ ra ai chiếm chỗ · tree shaking: export không dùng
có bị loại thật không (kiểm bằng `grep` trong bundle) · cache busting
`[contenthash]` đổi khi nào · so `esbuild`/`vite` cùng một entry, đo thời gian.
(Sơ đồ: entry→loader→plugin→output · anatomy của một chunk · dev-server HMR.)

**5. CSS fundamentals** — không cần npm. Demo bằng `node` + một trang HTML rồi
đo bằng `javascript_tool` (`getComputedStyle`): box model `content-box` vs
`border-box` (số px thật) · specificity: 4 selector cùng target, cái nào thắng ·
cascade + `!important` + inline · margin collapse (2 div, đo khoảng cách thật) ·
flex `min-width:auto` làm item không co (bẫy kinh điển, đo được) · grid
`fr` vs `%` · `z-index` chỉ ăn khi có `position` · stacking context do
`transform` tạo ra · `em` vs `rem` lồng nhau (đo px). **CẨN THẬN:** khung xem là
tab ẩn — đo layout thì được, đo timer/rAF thì KHÔNG (xem bẫy trong file này).
(Sơ đồ: box model · specificity thang điểm · stacking context.)

**6. React structure** — `npm i react react-dom` + `react-dom/server` để render
thật trong node. Demo: `renderToString` một cây component · state boundary: cùng
state đặt cao vs thấp, đếm số component re-render (dùng counter trong body) ·
`key` sai làm mất state (chứng minh được bằng render 2 lần) · context làm mọi
consumer re-render · `useMemo` có/không, đo bằng counter chứ không bằng cảm giác ·
cấu trúc thư mục: feature-based vs type-based, nói rõ cái nào chịu được rewrite.
(Sơ đồ: cây component + nơi state nên nằm · re-render lan như thế nào.)

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

1. **CÓ PHIÊN CLAUDE KHÁC làm chung cây** (`content/exams/CSI104-FE.mjs` đang
   untracked). **ĐỪNG `git add -A`** — `git add` chỉ định từng file của mình.
   **ĐỪNG deploy khi chưa hỏi user** (`deploy.sh` rsync CẢ cây làm việc).
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

**Nhánh `feat/playground-3d` — ĐÃ deploy prod và ĐÃ push tới `ed26ede` (30/7).**
3 bài Deep Dives live (#22-24), 8 đề CSI104 live (95 đề công khai). Đếm commit
chưa push bằng
`git log --oneline @{u}..HEAD | wc -l`.
Bốn commit gần nhất là của loạt Deep Dives:

```
f438640 feat(deepdives): bài 3 — An Introduction to GraphQL
139f982 feat(deepdives): bài 2 — event loop, callbacks, promises, async/await
8e069b3 feat(deepdives): bài 1 — command line + seeder
fd842e7 feat(tech-trends): thêm category DeepDive
```

Hạ tầng đã xong, dùng lại cho 9 bài còn lại:

- `scripts/deepdive-seed.mjs` — idempotent theo slug, `--dry`/`--apply`, render
  `bodyHtml`+`toc` bằng ĐÚNG renderer backend ở `dist/`, giữ `viewCount` +
  `publishedAt` gốc, đọc lại row sau khi ghi. Bỏ qua kiểm ảnh khi không có
  `frontend/public` (container backend không copy `frontend/`) — **đừng bỏ nhánh
  đó, nó chống FAIL mọi deploy**
- Category `DeepDive` đã có ở BE (2 chỗ) + FE (6 chỗ); `lib/api.ts` dùng alias
  `TechTrendCategoryName`
- `deploy.sh` **Step 3.15** tự seed mọi `content/deepdives/*.mjs` mỗi deploy
- `scratchpad/svg-fit.mjs` + `scratchpad/check-article.mjs` — hai bộ kiểm, đều
  có phần **tự kiểm** vì cả hai từng báo sai khi mới viết

Ba bài đã seed trên `:5544` = bài #1, #2, #3. Trang đọc:
`/tech-trends/<slug>`.

---

## Câu mở đầu gợi ý cho phiên mới

> Đọc `scratchpad/DEEPDIVES-NEXT-SESSION.md` rồi viết bài 4 (webpack) theo
> đúng quy trình B1-B8 trong đó.
