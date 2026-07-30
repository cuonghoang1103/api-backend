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

# VIỆC TIẾP THEO — viết 12 bài Deep Dives

User đã chốt: **phương án A** (bài viết mới), và bài nào chủ đề đã có nội dung sâu
trên site thì trong bài cắm thẻ dẫn vào đó.

## Bắt đầu từ đâu

**Bài 1: *How to Use the Command Line in Linux and macOS***

User đưa mẫu: https://www.taniarascia.com/how-to-use-the-command-line-for-apple-macos-and-linux/
— khoảng **6.000 từ, vài chục khối code**. Đó là thước đo độ sâu, không phải gợi ý.

Yêu cầu nguyên văn của user: *"dựa vào mẫu viết và hướng dẫn đầy đủ, chi tiết như
mẫu + code + ảnh, chuyên nghiệp như thế"*.

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

**CÒN PHẢI LÀM: `scripts/deepdive-seed.mjs`** — chưa viết. Bắt chước
`scripts/course-seed.mjs` (đọc file spec từ `content/`, idempotent, có `--dry` /
`--apply`, khoá theo `slug`). Nội dung bài đặt ở `content/deepdives/<slug>.mjs`.
Thư mục `content/deepdives/` đã tạo, đang rỗng.

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

- [ ] **Viết 12 bài Deep Dives** — việc chính, bắt đầu bài command line
- [ ] `scripts/deepdive-seed.mjs` — chưa có
- [ ] Deploy + push 9 commit (hỏi phiên kia trước)
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
