# Bàn giao — Trang chủ mới + Deep Dives

Cập nhật 30/7/2026. Nhánh `feat/playground-3d`.

# ⚑ ĐỌC MỤC NÀY TRƯỚC

## Trạng thái: 10 commit ở LOCAL, CHƯA deploy, CHƯA push

```
9cecedc feat(home): mục Deep Dives — 12 thẻ hướng dẫn, logo thương hiệu tự phục vụ
769884a style(home): thêm màu nhấn có chủ đích + chỉ mục dải + vạch hover
b868e82 feat(playground): nút thoát về trang chủ + hộp xác nhận, rút gọn ghi công
42fb25f style(playground): giãn dòng cho chữ đọc trong các bảng (line-height 1.65)
c6c551c chore(home): bỏ dòng ghi công ở trang chủ, đưa nguyên văn giấy phép vào bản dựng
42c3612 chore(deploy): thêm /landing/stats vào smoke-test
410be07 feat(home): viết lại trang chủ theo cấu trúc Ecosystem Index + cửa cảnh báo sân chơi
f3b25f0 fix(nav): chuyển `return null` của /creator xuống sau hooks — hết 26 lỗi rules-of-hooks
57abdb5 perf(nav): bỏ hoạt hình backdrop-filter + scale trên bề mặt mờ, rút nhịp mở dock
05f0cf1 docs(playground): ghi nhận đã deploy prod — commit 0fd0c0c, live tại /playground
```

⚠️ **`05f0cf1` trở về trước ĐÃ deploy + ĐÃ push.** Chín commit từ `57abdb5` lên
thì chưa. Sân chơi 3D đang chạy trên prod; trang chủ mới thì chưa.

## ⚠️ CÓ PHIÊN CLAUDE KHÁC ĐANG LÀM CHUNG CÂY

Phiên đó soạn đề thi trong `content/exams/`. Lúc bàn giao còn
`content/exams/CSI104-FE.mjs` chưa commit.

Ba luật bắt buộc:

1. **ĐỪNG `git add -A`.** Luôn `git add` chỉ định từng file của mình, nếu không
   là vơ luôn file đề đang viết dở của họ vào commit.
2. **ĐỪNG deploy khi chưa hỏi.** `deploy.sh` rsync CẢ CÂY LÀM VIỆC — ai bấm
   deploy là đẩy luôn phần dở của người kia lên production.
3. **Mỗi lúc chỉ MỘT phiên chạy build hoặc dev server.** Xem bẫy `.next` bên dưới.

---

# TRẠNG THÁI DEEP DIVES — 2/12 bài xong (30/7, phiên 2)

User chốt: **phương án A** (bài viết mới), bài nào chủ đề đã có nội dung sâu trên
site thì cắm thẻ dẫn vào đó. Ngôn ngữ: **tiếng Anh** (user chốt phiên 2).

## ✅ Bài 1 XONG — *How to Use the Command Line in Linux and macOS*

- `content/deepdives/how-to-use-the-command-line-in-linux-and-macos.md` —
  **5.679 từ** (không tính code), **70 khối code**, 42.7KB markdown, 27 heading
- `.mjs` cùng tên = metadata (đọc `.md` bằng `fs.readFileSync`). **Prose đặt ở
  `.md` chứ không nhúng template literal** — 70 khối code thì mọi backtick phải
  escape, vô nghĩa
- 4 sơ đồ SVG tự phục vụ: `frontend/public/deepdives/command-line/`
- Đã seed + xác nhận idempotent trên DB tạm `:5544` (view_count giữ nguyên,
  publishedAt không bị đóng dấu lại, chạy 2 lần vẫn 1 bài)
- Thẻ số 1 trong `deepDivesData.ts` đã trỏ `article:` sẵn từ phiên 1 → nay hợp lệ

**Mọi lệnh trong bài đã CHẠY THẬT** trước khi viết — macOS 26 (BSD) và
`debian:bookworm-slim` trong Docker (GNU) cho bảng khác biệt nền tảng. Ba lần
suýt viết sai vì tin lý thuyết: xem mục "BẪY ĐO LƯỜNG" bên dưới.

## ✅ Bài 2 XONG — *The Event Loop, Callbacks, Promises and Async/Await*

- 5.230 từ, 74 khối code, 4 sơ đồ ở `frontend/public/deepdives/event-loop/`
- Thẻ số 2 trong `deepDivesData.ts` đã đổi `href:'/simulation'` → `article:`
- Seed + verify trên `:5544` (bài #2), commit `139f982`
- **Hai phát hiện đã bác bỏ bản nháp** (giá trị nhất của bài):
  1. `process.nextTick` vs `Promise.then` **đổi chỗ giữa CJS và ESM** — thân
     module `.mjs` tự nó là promise job. Gần như mọi bài trên mạng nói
     "nextTick luôn trước" mà không nói điều kiện
  2. **Đo timer trong tab ẩn là vô nghĩa**: `requestAnimationFrame` không chạy
     lần nào sau 600ms, hai `setTimeout(0)` lồng nhau cách 700ms. Đã cắt một
     đoạn về MessageChannel vì số liệu lấy từ tab ẩn
- Demo mạnh nhất: HTTP server 2 route — `/ping` một mình 10ms, `/ping` khi có
  một `/report` parse 20MB JSON là 110ms

## Hạ tầng đã dựng xong (dùng lại cho 10 bài còn lại)

- **`scripts/deepdive-seed.mjs`** — idempotent theo slug, `--dry`/`--apply`,
  `--author <username>`. Render `bodyHtml` + `toc` bằng ĐÚNG renderer của backend
  (`dist/services/techTrendsRenderer.service.js`) chứ không dựng pipeline marked
  thứ hai. Giữ `viewCount`, `publishedAt` gốc, `authorId`. Đọc lại row sau khi
  ghi (bodyHtml < 500 ký tự hoặc toc rỗng ⇒ exit 1)
- **Category `DeepDive`** — đã thêm ở BE (`techTrends.routes.ts:68`,
  `ai.service.ts:31`) và FE (`types.ts` 3 chỗ, `TechTrendsClient`, `[slug]/page`,
  `admin/tech-trends/page` 2 chỗ). `lib/api.ts` nay dùng alias
  `TechTrendCategoryName` thay cho 8 union gõ tay — category sau chỉ sửa 1 chỗ
- **`deploy.sh` Step 3.15** — seed mọi `content/deepdives/*.mjs` mỗi lần deploy,
  ngay sau Step 3.14 (exams). Không có bước này thì thẻ trang chủ là link chết

## Còn 10 bài — thứ tự gợi ý

GraphQL → webpack → CSS → React → Redux → Vue → shell scripting → Mac setup →
reading production → Node.js (bài cuối đã có khoá 112 bài, có thể giữ `href`).

Thước đo hai bài đầu: **5.200–5.700 từ, 70+ khối code, 4 sơ đồ, 3 link nội bộ**.
Điều làm nên giá trị không phải độ dài mà là **chạy thật rồi mới viết** — mỗi bài
tới nay đều có 2-3 chỗ mà việc chạy đã bác bỏ điều sắp viết ra.

Quy trình cho mỗi bài: viết `.md` (chạy thật mọi lệnh) → `.mjs` metadata → SVG
nếu cần → `node scripts/deepdive-seed.mjs --file … --dry` → `--apply` vào `:5544`
→ đổi thẻ trong `deepDivesData.ts` từ `href:` sang `article:`.

## Đường ống — KHÔNG viết trang Next riêng

Bài nằm trong **`TechTrendArticle`** (đã có sẵn, xem `prisma/schema.prisma:2997`):

| Cột | Dùng cho |
|---|---|
| `bodyMdx` | nguồn Markdown chuẩn (thứ mình soạn) |
| `bodyHtml` | HTML render sẵn server-side, trang công khai đọc cái này |
| `category` | đặt **`DeepDive`** (prod đang có `TechNews` 16 bài, `FixBug` 1 bài) |
| `slug` | `how-to-use-the-command-line-in-linux-and-macos` |
| `coverImageUrl`, `tags`, `readTimeMin`, `status`, `isFeatured` | đủ cả |

Được miễn phí: trang `/tech-trends/[slug]` với SSR + JSON-LD + RSS + bình luận.

`scripts/deepdive-seed.mjs` ĐÃ CÓ (xem mục trên). Nội dung bài đặt ở
`content/deepdives/<slug>.md` + `<slug>.mjs`.

---

# 🪤 BẪY ĐO LƯỜNG — phiên 2 (đắt nhất trong phiên)

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| **`grep`/`find` trong shell của Claude Code bị BỌC** thành `ugrep`/`bfs` | Mọi phép thử về hành vi `grep`/`find` đo SAI tool. Máy user còn cài ugrep 7.5.0 đứng trước `/usr/bin` trong PATH | Đo bằng **đường dẫn tuyệt đối** `/usr/bin/grep`, `/usr/bin/find`, `/usr/bin/sed` khi cần hành vi BSD thật |
| Bộ kiểm bảng tự viết dùng regex `/<th/` | Khớp luôn `<thead>` ⇒ thổi số cột lên 1 ⇒ báo **cả 5 bảng "LỆCH"** trong khi tất cả đều đúng | `/<th[ >]/`. Và khi MỌI hàng lệch đúng 1 ô thì nghi bộ kiểm trước, đừng nghi dữ liệu — xem [[feedback_verify_the_checker_before_the_content]] |
| Thông báo lỗi của BSD `sed -i` **đổi theo tên file** | Viết vào bài "unescaped newline inside substitute pattern" trong khi với `access.log` nó là "command a expects \\ followed by text" | Chạy đúng cặp lệnh + tên file mình đưa vào bài, đừng chép output của lần thử khác |
| `!$` trong CÙNG một dòng lệnh | `mkdir -p x && cd !$` không lấy `x` mà lấy đối số cuối của lệnh TRƯỚC ĐÓ. Suýt dạy sai | `!$` chỉ dùng ở dòng SAU. Cùng dòng thì `$_` (đã verify cả zsh và bash) |
| SVG rộng 880px trong bài | Cột nội dung `/tech-trends/[slug]` chỉ **~699px** (`max-w-6xl` − padding, `lg:col-span-8`, `gap-10`) ⇒ ảnh co 0.79 ⇒ chữ 12px thành 9px, **không đọc được** | Vẽ SVG **viewBox rộng 700** để tỷ lệ 1:1. Chữ nhãn ≥ 12.5px, mono chính 14-18px |
| Seeder kiểm ảnh ở `frontend/public` | **Container backend KHÔNG có `frontend/`** (Dockerfile.backend chỉ copy `content`, `scripts`, `src`, `dist`, `data`) ⇒ phép kiểm sẽ làm FAIL MỌI DEPLOY | Seeder chỉ kiểm khi `frontend/public` tồn tại, không có thì in dòng "bỏ qua". Đã thử bằng cây mô phỏng — và **symlink không mô phỏng được**, `import.meta.dirname` giải về repo thật, phải `cp` bản thật của `scripts/` |
| Dòng code dài > ~80 ký tự trong bài | Khối `pre` cuộn ngang, người đọc mất nửa comment | Kiểm bằng `awk '/^```/{f=!f;next} f && length($0)>80'` |
| Sửa text bên trong khối code sau khi đã dán output | Code in ra một đằng, output trong bài một nẻo — người đọc chạy lại thấy khác | Đổi code ⇒ CHẠY LẠI, dán output mới. Bài 2 phải chạy lại 2 demo vì rút ngắn dòng |
| `perl -pi -e` với chuỗi chứa `${...}` | Perl hiểu `${Date.now()}` là biến của nó → `Undefined subroutine &main::now`, file KHÔNG đổi mà lệnh vẫn "chạy xong" | Dùng Edit cho code JS/TS, đừng dùng perl/sed |
| Tin ảnh chụp khung xem để kiểm sơ đồ | Khung xem là tab **ẩn**, có lúc chụp ra ảnh trống, có lúc không mở nổi file | Kiểm hình học bằng script (`scratchpad/svg-fit.mjs`: text có tràn viewBox không) và **tự kiểm bộ kiểm** bằng một ca tràn cố ý |

## Sau khi publish bài — BƯỚC HAY QUÊN

Trong `frontend/src/components/home/landing/deepDivesData.ts`, đổi thẻ đó từ

```ts
href: '/simulation', via: 'Watch it run in Simulation'
```

thành

```ts
article: '<slug-vừa-publish>'
```

⚠️ **ĐỪNG đặt `article` cho slug chưa có trong DB** — thẻ thành link chết.
Publish trước, đổi sau.

## 12 chủ đề đã chốt

Xem `deepDivesData.ts`. Hiện **cả 12 đều đang là `href`** trỏ vào nội dung có sẵn —
chưa bài nào được viết. Thứ tự ưu tiên gợi ý: command line → event loop →
GraphQL → webpack → CSS → React → Redux → Vue → shell scripting → Mac setup →
reading production → Node.js (cái này đã có khoá 112 bài, có thể giữ nguyên `href`).

---

# TRẠNG THÁI TRANG CHỦ

## Cấu trúc mới (`RiveLanding.tsx`)

Đổi hẳn sang **Ecosystem Index** (skill `hallmark`): nhiều dải nội dung để duyệt,
thay cho phễu hero → 3 cột → CTA. Cùng họ Are.na / Figma Community / Behance.

Thứ tự khối: mở đầu (chữ lớn lề trái + số liệu thật) → dải sân chơi 3D nổi bật →
**Deep Dives (00)** → Learn (01) → Build (02) → Practice & play (03) → chân trang.

## Audit hallmark đã sửa: 8 critical + 8 major

Đã gỡ, **đừng đưa lại**: aurora-blob background · gradient tím→lam trên chữ ·
hero căn giữa + huy hiệu viên thuốc · lưới 6 thẻ icon · icon-tile nhuộm màu ·
shadow-glow theo màu nhấn · `hover:scale` toàn cục · fade-up áp cho mọi khối ·
chân trang 4 cột kiểu AI · 4 số liệu gõ cứng.

## Năm luật giữ khi sửa tiếp

Ghi đầy đủ ở đầu `RiveLanding.tsx`. Tóm lại: không căn giữa cả trang · không
gradient trên chữ / glow / blob · hover chỉ đổi viền và màu chữ · mọi con số phải
từ `useLandingStats()` · màu lấy từ token của site, không hex thẳng vào lớp.

## Số liệu — endpoint mới `GET /api/v1/landing/stats`

`src/services/landingStats.service.ts`. Đếm 8 bảng, nhớ tạm 10 phút, dùng
`Promise.allSettled` nên một phép đếm hỏng trả `null` cho riêng ô đó thay vì sập
cả endpoint. **Client PHẢI ẩn ô `null`, không bao giờ hiện `0`** — "0 bài tập" là
nói dối, còn không hiện gì thì chỉ là thiếu.

⚠️ **DB local đang LỆCH SCHEMA** — thiếu `lang_hanzi_chars`, `roadmap_nodes`,
`exam_questions` (`P2021`/`P2022`). Prod có đủ 8 bảng, đã kiểm. Nên ở máy dev số
sẽ nhỏ và thiếu vài ô — **đó là môi trường, không phải lỗi code**.

---

# 🪤 BẪY ĐÃ DẪM TRONG PHIÊN NÀY

| Bẫy | Hậu quả | Cách tránh |
|---|---|---|
| Chạy `npm run build` khi `next dev` đang chạy | Hai lệnh ghi chung `.next/` ⇒ dev server 404 sạch hoặc `Cannot find module './5836.js'`. **Dẫm HAI LẦN.** Lần hai ra màn hình trắng, user tưởng code hỏng | Tắt dev TRƯỚC khi build. Nếu đã lỡ: `rm -rf .next` rồi khởi động lại dev |
| Tắt dev để build rồi **quên bật lại** | User mở localhost:3000 thấy trắng trơn — cổng không có gì phục vụ | Build xong bật lại dev ngay |
| `pkill -f "next start"` / `pkill -f "standalone/server.js"` | KHÔNG khớp — Node đổi tên tiến trình thành `next-server`. Server cũ sống dai, mọi phép đo bắn vào nó | Diệt theo CỔNG: `lsof -ti:3000 \| xargs -r kill -9` |
| Khôi phục file từ bản chụp cũ khi đo A/B | Ghi đè mất một sửa đổi vừa làm ⇒ commit message nói một đằng, code làm một nẻo (đã phải đính chính `57abdb5` trong `f3b25f0`) | Chụp lại bản MỚI NHẤT trước mỗi lần swap |
| `ui-ux-pro-max --design-system` với từ khoá "education" | Trả về hệ **dành cho TRẺ EM** — phông Baloo 2 + Comic Neue, "Children's apps, educational games". Sai hoàn toàn đối tượng | Dùng `"developer technical documentation dark professional"`. **Đừng tin phát đầu của công cụ** |
| Nối `@import` vào cuối `index.styl` bằng `>>` | File cũ không có newline cuối ⇒ hai lệnh `@import` dính vào một dòng, stylus parse lỗi | Kiểm `tail -3` sau khi nối |
| Dùng token CSS không tồn tại | Viết `--bg-secondary` / `--bg-tertiary` trong khi site chỉ có `--bg-card` / `--bg-surface-hover` | `grep -oE "^\s*--[a-z-]+:" src/app/globals.css` trước khi dùng |
| `regexp_replace(..., E'\\s+', ...)` qua nhiều lớp nháy SSH | Rụng một gạch chéo thành `'s+'` ⇒ thay mọi chữ `s` bằng dấu cách, tưởng dữ liệu hỏng | Kiểm lại bằng truy vấn không có regexp trước khi kết luận |
| `[ "$x" = false ] && fail "…"` trong `deploy.sh` | Script chạy `set -euo pipefail`, dây `&&` vế trái sai thì trả mã khác 0 ⇒ **deploy tự chết đúng lúc mọi thứ đang khoẻ** | Dùng `if` |
| Gọi `wget`/`curl` bên trong container frontend | Image đó **không cài cả hai** (Dockerfile cố ý bỏ). Chốt kiểm cũ vì thế luôn thất bại, tốn không ~25s/deploy mà không kiểm được gì | Dùng `node -e` + `require('http')` |

---

# QUY TRÌNH TEST LOCAL ĐÚNG

```bash
# backend đã chạy sẵn ở :3001 (kiểm: lsof -ti:3001)

# frontend dev
lsof -ti:3000 | xargs -r kill -9          # diệt theo CỔNG, không dùng pkill -f
cd frontend && npm run dev

# muốn build production thì TẮT dev trước
lsof -ti:3000 | xargs -r kill -9
cd frontend && npm run build
```

Sân chơi 3D sau khi sửa:

```bash
cd playground-3d && npm run build
cd .. && rm -rf frontend/public/playground && mkdir -p frontend/public/playground
rsync -a playground-3d/dist/ frontend/public/playground/
lsof -ti:3000 | xargs -r kill -9   # ← Next chốt danh sách public/ lúc KHỞI ĐỘNG
cd frontend && npm run dev
```

---

# FILE MỚI / ĐÃ SỬA TRONG PHIÊN

```
frontend/src/components/home/landing/
  RiveLanding.tsx        ← VIẾT LẠI HẲN. 5 luật giữ ghi ở đầu file
  DeepDives.tsx          ← MỚI: lưới 12 thẻ
  deepDivesData.ts       ← MỚI: 12 chủ đề, article: | href:
  PlaygroundGate.tsx     ← MỚI: hộp cảnh báo GPU trước khi vào sân chơi
  useLandingStats.ts     ← MỚI: hook đọc số liệu thật
  (LandingBackground · StatsCounter · FeatureShowcase · FeatureMarquee ·
   NewModulesSection · LandingHero · AnimatedGreeting — nay KHÔNG AI DÙNG,
   cố ý CHƯA xoá để user còn đường lùi. Ưng rồi thì dọn)

frontend/public/logos/    ← MỚI: 12 SVG + README.md ghi giấy phép
frontend/src/app/globals.css        ← thêm keyframes pg-fade / pg-rise
src/services/landingStats.service.ts ← MỚI
src/routes/landing.routes.ts         ← thêm GET /stats
deploy.sh                            ← chốt kiểm frontend dùng node -e; thêm
                                       /landing/stats + chốt kiểm /playground

playground-3d/
  sources/index.html        ← nút thoát + hộp xác nhận + ghi công rút gọn
  sources/style/exit.styl   ← MỚI
  sources/style/general.styl ← .text line-height 1.65
  static/license.md         ← MỚI (bản sao, để nguyên văn MIT vào bản dựng)
  static/ATTRIBUTION.txt    ← MỚI
```

---

# GIẤY PHÉP — BA NƠI KHÔNG ĐƯỢC GỠ

Sân chơi là fork `folio-2025` của Bruno Simon (MIT). MIT chỉ đòi thông báo bản
quyền đi kèm mọi bản sao — **không** đòi ghi công trên giao diện. Nghĩa vụ đang
được thoả ở:

1. `playground-3d/static/license.md` → phục vụ tại `/playground/license.md`
2. `playground-3d/static/ATTRIBUTION.txt` → ai làm phần nào
3. `sources/data/consoleLog.js` → khối Credits in ra console, có nguyên văn
   "Bruno Simon - Copyright (c) 2025, giay phep MIT"

Gỡ ba cái đó là **vi phạm giấy phép**. Mục "Original project" trong hộp
*Behind the scene* thì chỉ là lịch sự, đã rút còn một câu theo yêu cầu user.

---

# VIỆC CÒN NỢ

- [ ] **Viết 10 bài Deep Dives còn lại** — việc chính (command line + event loop đã xong)
- [ ] Seed bài 1 lên **DB local `:5432`** — hiện KHÔNG được: DB local thiếu 5 cột
      mới của `tech_trend_articles` (`kind`, `sources`, `ai_generated`,
      `ai_model`, `scheduled_at`) ⇒ `P2022`. Prod có đủ (migration news bulletin
      20/7 đã áp). Đã seed + verify trên DB tạm `:5544` thay thế
- [ ] Deploy + push (nay là **13 commit** local; hỏi phiên đề thi trước)
- [ ] Dọn 7 file landing cũ không ai dùng (chờ user ưng trang chủ mới)
- [ ] Phông: vẫn Inter + Poppins. "Inter ở mọi nơi" là dấu hiệu AI có tên. Muốn
      đúng chất editorial cần một phông serif hiển thị — nhưng thêm nó là đổi
      `package-lock.json`, đừng làm khi dùng chung cây với phiên khác
- [ ] Trang chủ hiện chỉ tiếng Anh. User chưa yêu cầu song ngữ
- [ ] 8 file `.png` trong `playground-3d/static/ui/previews/` không ai dùng
      (~4MB mỡ thừa của kho gốc) — chỉ `.webp` được dùng
- [ ] Cảnh báo `computeBoundingSphere NaN` trong sân chơi, có sẵn từ kho gốc,
      chưa truy nguồn. Vô hại, thế giới vẫn chạy
- [ ] Màu nhấn site đang là xanh Facebook `#1877f2`/`#4599ff`. Skill gợi ý xanh
      lá "run green" `#22C55E` kiểu terminal/IDE — hợp CuongThai hơn, nhưng đổi
      là đổi cả app nên chờ user quyết
