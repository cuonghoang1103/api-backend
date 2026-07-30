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

**17 commit local trên `feat/playground-3d`, CHƯA deploy, CHƯA push** (đếm từ `05f0cf1`,
commit đã push cuối cùng; `git log --oneline 05f0cf1..HEAD`).
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
