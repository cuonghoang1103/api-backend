# Bàn giao deploy — Tech Trends + Game Library

> Dành cho Claude Code ở terminal. Đọc **§0 Cảnh báo** trước khi chạy bất cứ lệnh nào.
> Soạn ngày 2026-07-16.

Mình vừa hoàn thành **2 module** trên cuongthai.com. Nhờ bạn **check rồi deploy giúp mình**.

---

## §0. ⚠️ CẢNH BÁO — đọc trước khi chạy `deploy.sh`

### 0.1 — `deploy.sh` rsync TOÀN BỘ cây local, kể cả file chưa commit

Hiện mình **đang có việc làm dở chưa commit**:

```
 M frontend/src/app/language/[code]/page.tsx
 M frontend/src/lib/language-api.ts
 M src/routes/myLanguage.routes.ts
 M src/services/langNotebook.service.ts
 M src/services/myLanguage.ai.service.ts
?? frontend/src/app/language/[code]/grammar-check/
?? frontend/src/app/language/[code]/translate/
?? src/services/myLanguage.catalog.service.ts.bak
```

**HỎI MÌNH TRƯỚC** xem có muốn deploy kèm phần này không. Nếu chưa xong thì **đừng deploy vội** —
`deploy.sh` sẽ đẩy nguyên trạng lên prod.

### 0.2 — Có 3 migration sẽ TỰ apply

`deploy.sh` chạy `npx prisma migrate deploy` (khoảng dòng 246), nên 3 migration này sẽ apply tự động:

| Migration | Nội dung | Của |
|---|---|---|
| `20260811000000_add_tech_trend_comments` | 2 bảng mới (comments + likes) | module Tech Trends |
| `20260812000000_add_game_library` | 3 enum + 3 bảng mới | module Games |
| `20260812000000_add_lang_levels` | — | việc My Language của mình |

**Hai migration của 2 module này thuần ADDITIVE** — chỉ `CREATE` bảng/enum mới, **không `ALTER` bảng cũ nào**,
nên an toàn kể cả khi DB có drift lịch sử. SQL lấy **verbatim từ `prisma migrate diff --from-empty`** và đã
verify **byte-identical với canonical DDL của Prisma** → `migrate deploy` sẽ apply sạch, **không tạo drift**.

> ℹ️ Hai migration `20260812000000_*` **trùng timestamp** nhưng khác tên. Không xung đột — Prisma xếp thứ tự
> theo **tên thư mục đầy đủ** nên vẫn apply cả hai.

> 🛑 **Nếu gặp P3009 / lỗi migrate: DỪNG LẠI, KHÔNG tự chạy `migrate resolve`.**
> Theo đúng *Migration Failure Protocol* trong `CLAUDE.md` — báo lại mình.

### 0.3 — `deploy.sh` cũng chạy `prisma db seed`

Seed games sẽ tự tạo **6 chuyên mục + 8 game**. Seed dùng `update: {}` (**create-if-missing**) nên
chạy lại nhiều lần **không đè** dữ liệu admin đã chỉnh.

---

## §1. Module Tech Trends (`/tech-trends`) — nâng cấp toàn diện

Blog kỹ thuật admin-curated. **Đã push lên `origin/main`**, nhưng **có thể chưa deploy lên prod**.

- **Trang chi tiết SSR** `/tech-trends/[slug]`: SEO thật + JSON-LD + TOC + **đếm view thật** + Share/tag hoạt động + sitemap động
- **AI cho admin**: tạo nháp bài · dựng post-mortem #FixBug từ error/stack-trace · auto tóm tắt+tags+SEO · viết lại
- **AI cho người đọc** (gate PRO): TL;DR · "Hỏi blog" (RAG có trích dẫn) · giải thích code
- **Bài liên quan** (SSR) · **RSS** `/tech-trends/rss.xml` · thanh tiến độ đọc
- **Bình luận + likes** ⚠️ *mang migration*

## §2. Module Game Library "Playground" (`/games`) — làm mới hoàn toàn

Chuyển từ danh sách game **hard-code trong code** sang **quản lý bằng DB + trang admin**.

- **6 game chơi được**: Snake · Memory Card · Tic Tac Toe · **Math Blitz** (mới) · **Projectile Challenge** (mới, vật lý ném xiên thật) · love-me (HTML/iframe)
- **`/admin/games`**: CRUD, kéo-thả sắp xếp, dashboard + biểu đồ 14 ngày, quản lý chuyên mục
- **Portal `/games`** SSR · **`/games/[slug]`** SSR (SEO từng game) · **`/games/leaderboard`**
- **Chống gian lận điểm server-side**: clamp theo cap từng game + rate-limit 40/phút
- ⚠️ *mang migration*

---

## §3. Việc cần bạn làm

1. `git status` + xem qua các commit chưa push:
   ```bash
   git log --oneline origin/main..HEAD
   ```
   (~9 commit: games Stage 3–7 của mình + vài commit language của mình)
2. Chạy pre-push checklist — mình đã chạy hết đều **PASS**, bạn chạy lại cho chắc:
   ```bash
   npx tsc --noEmit
   (cd frontend && npx tsc --noEmit && npm run build)
   ```
3. **Hỏi mình về việc dở chưa commit** (§0.1) rồi mới deploy.
4. Deploy **FULL** (không dùng `--no-build`):
   ```bash
   bash deploy.sh
   ```
   Smoke-test trong `deploy.sh` đã có sẵn `tech-trends/articles` và `games`.
5. Xác nhận trong log: **"Database schema migrated"** + seed OK + smoke-test trả 200/401 (404 = build cũ).
6. **Đợi mình test prod xong** rồi mới:
   ```bash
   git push origin main
   ```

---

## §4. Về AI — KHÔNG cần đổi env

AI của **cả 2 module** tái dùng gateway `interview/llm` có sẵn, tự bật nhờ `ANTHROPIC_API_KEY` + `LLM_BASE_URL`
đã có trên VPS (`/opt/cuonghoangdev/.env`). Không có key thì AI **tự ẩn / trả 503 sạch**, không crash.

**Không thêm dependency nào** cho cả 2 module.

---

## §5. Checklist test prod (mình sẽ làm)

**Tech Trends**
- [ ] `/tech-trends` → mở 1 bài → TOC, nút Chia sẻ, **view count tăng**, mục "Bài liên quan"
- [ ] Bình luận: đăng nhập → viết / trả lời / thích / sửa-xoá của mình
- [ ] `/tech-trends/rss.xml` trả về XML
- [ ] Admin editor → "Trợ lý AI" → Tạo nháp / Dựng #FixBug
- [ ] Tài khoản PRO: thấy card AI (TL;DR / Hỏi blog / giải thích code); non-PRO thấy nút nâng cấp `/pro`

**Games**
- [ ] `/games` → portal hiện 6 game, filter + chips chạy
- [ ] Mở 1 game → bấm Chơi → **Math Blitz** (60s, number-pad trên mobile)
- [ ] **Projectile** → chỉnh góc/lực → Bắn (preview quỹ đạo chỉ ở level 1–2)
- [ ] `/games/leaderboard` → tab từng game, top 20
- [ ] `/admin/games` → kéo-thả sắp xếp, sửa game, trang Chuyên mục

---

Cảm ơn bạn!
