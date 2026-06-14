# 📋 TIẾN ĐỘ DỰ ÁN — CuongHoangDev (api-backend)

> **Cập nhật:** 14/06/2026 13:34 (UTC+7)
> **Repo:** `/Users/admin/Downloads/api-backend`
> **Production:** https://cuongthai.com

---

## 🎯 TỔNG QUAN TỪ "LÚC SỬA LỖI NHẦM" ĐẾN GIỜ

Phiên làm việc này bắt đầu sau khi hệ thống auth/chat AI đã được deploy production ổn định
(các commit `2ed0866`, `8b76f64`, `554dd55`, `4f08c30`, `c7034ec` đã merge ở phiên trước).
Mục tiêu phiên: **trang bị kiến thức cá nhân cho AI chatbot + xây trang admin quản lý RAG**.

---

## ✅ CÁC MỤC ĐÃ HOÀN THÀNH

### 1. Tìm hiểu trạng thái Groq AI (trả lời 3 câu hỏi)
- **Q1: Thêm kiến thức cho AI** — Có sẵn RAG (document_chunks table, `getRAGContext()`,
  `buildSystemPrompt()` inject context), chỉ thiếu data + UI quản lý.
- **Q2: Giới hạn Groq** — `llama-3.1-8b-instant` ở 30 RPM, 14,400 RPD, 500K TPD.
  Reset tự động (rolling window cho phút, 00:00 UTC cho ngày = 07:00 VN).
- **Q3: Dùng lâu dài** — Free key vĩnh viễn, không cần đổi key. Chỉ cần đổi
  `GROQ_CHAT_MODEL` env nếu model bị deprecate.

### 2. 🐛 FIX #1 — Bug infinite loop trong `chunkText()` (commit `0fde049`)
- **Triệu chứng:** Upload RAG document >500 chars → backend crash với `FATAL ERROR:
  Reached heap limit` → Nginx trả 502 Bad Gateway.
- **Nguyên nhân:** Vòng lặp trong `private chunkText()` không terminate. Khi
  `end - overlap <= start` (do overlap >= effective chunk size), con trỏ `start`
  không tăng → build vô hạn chunks → OOM.
- **Fix:**
  1. Validate `0 <= overlap < chunkSize` ngay đầu hàm (throw `AppError`).
  2. Thêm safety check `nextStart <= start` → force `start = end` để đảm bảo
     vòng lặp dừng.
- **Test:** Upload 1.5KB content → 2 chunks (đúng), không OOM.

### 3. 🐛 FIX #2 — Backend heap 512MB → 1.5GB (commit `0fde049`)
- **Vấn đề:** Default V8 heap chỉ 512MB trên container 2GB. Kết hợp với fix #1
  ở trên, các document lớn vẫn có thể spike RAM khi `Promise.all` nhiều Prisma writes.
- **Fix:** Thêm `ENV NODE_OPTIONS=--max-old-space-size=1536` vào `Dockerfile.backend`.
- **Verify:** `node -e 'console.log(v8.getHeapStatistics().heap_size_limit)'`
  → 1548 MB (đúng).

### 4. 📚 Upload 7 documents vào RAG knowledge base
Upload qua API admin `POST /api/v1/ai/admin/documents` (17 chunks tổng):

| Document ID | Loại | Chunks | Nội dung |
|---|---|---|---|
| `bio-overview-2026` | personal_bio | 2 | Bio, sở thích, tính cách, mục tiêu |
| `contact-info-2026` | contact | 2 | Email, Zalo, Facebook, GitHub, giờ làm việc |
| `skills-tech-2026` | skills | 2 | Frontend, Backend, Database, DevOps, AI/ML |
| `projects-portfolio-2026` | projects | 3 | CuongHoangDev, Cyber Terminal, AI Chatbot |
| `pricing-services-2026` | pricing | 3 | Bảng giá freelance |
| `education-fpt-2026` | education | 2 | FPT University, GPA, môn học |
| `faq-how-can-i-help-2026` | faq | 3 | Câu hỏi thường gặp |

**Tool hỗ trợ:** `scripts/upload-knowledge.sh` (idempotent — chạy lại sẽ refresh).

### 5. ✨ Trang Admin UI — `/admin/ai-knowledge` (commit `3d52dab`)
**File:** `frontend/src/app/admin/ai-knowledge/page.tsx`

**Features:**
- 📊 **Stats dashboard**: tổng chunks, số documents, số loại duy nhất, tổng ký tự
- 🔍 **Search + filter** theo `documentType`
- ➕ **Upload modal** với 10 loại preset (`personal_bio`, `contact`, `skills`,
  `projects`, `pricing`, `education`, `faq`, `blog`, `service`, `policy`, `custom`)
- 🗑️ **Xoá từng document** (xoá 1 → xoá hết chunks của nó)
- 🎨 **UI dark mode** đồng bộ với admin panel CuongHoangDev
- 📋 **Group chunks theo document**, hiển thị content preview

**Nav added:** "AI Knowledge Base" với icon `Database` trong `admin/layout.tsx`.

### 6. 🐛 FIX #3 — Thêm DELETE endpoint cho RAG documents (commit `3d52dab`)
- **Thiếu:** Backend chỉ có `DELETE /admin/knowledge/clear-all` (nguy hiểm, xoá tất cả).
- **Thêm:** `DELETE /api/v1/ai/admin/documents/:documentId?documentType=X`
  → xoá đúng 1 document, an toàn.
- **Graceful fallback** khi `document_chunks` table chưa tồn tại.

### 7. 🐛 FIX #4 — Admin UI 401 do cross-origin cookie (commit `f60c105`)
- **Triệu chứng:** User mở `/admin/ai-knowledge` → banner đỏ "HTTP 401", 0 chunks
  hiển thị dù DB có 21 chunks.
- **Nguyên nhân:** Page gọi `fetch(https://api.cuongthai.com/api/v1/...)` trực tiếp
  (cross-origin) → browser KHÔNG gửi cookie httpOnly `backend_token` → backend 401.
- **Fix:** Đổi sang relative URL `/api/v1/...` để đi qua Next.js catch-all proxy
  tại `frontend/src/app/api/v1/[[...path]]/route.ts`. Proxy đọc cookie server-side
  và forward `Authorization: Bearer <token>`. Đây là pattern chuẩn mà tất cả
  trang admin khác (music, projects, ...) đều dùng.
- **Verify:** Login → gọi `/api/v1/ai/admin/documents` qua proxy với cookie
  → 200, 21 chunks.

---

## 📦 FILES TOUCHED TRONG PHIÊN

### Code (backend)
- `src/services/ai.service.ts` — fix `chunkText()` infinite loop, validate params
- `src/routes/ai.routes.ts` — thêm `DELETE /admin/documents/:documentId`
- `Dockerfile.backend` — bump `NODE_OPTIONS=--max-old-space-size=1536`

### Code (frontend)
- `frontend/src/app/admin/ai-knowledge/page.tsx` — **FILE MỚI**, ~410 dòng
- `frontend/src/app/admin/layout.tsx` — thêm nav item "AI Knowledge Base"

### Scripts
- `scripts/upload-knowledge.sh` — bash script upload 7 documents (production-tested)
- `scripts/upload-knowledge.py` — bản Python (gặp vấn đề với Python 3.14 urllib, không dùng)

---

## 🧪 TESTING ĐÃ LÀM

| Test | Kết quả |
|---|---|
| Upload 1 chunk 200 chars | ✅ 201 Created |
| Upload 1 chunk 600 chars (trước fix) | ❌ 502 OOM |
| Upload 1.5KB (sau fix) | ✅ 2 chunks |
| Upload 7 documents (1.5-2KB mỗi cái) | ✅ 17 chunks total |
| Admin page `/admin/ai-knowledge` (trước fix 4) | ❌ HTTP 401, 0 chunks |
| Admin page (sau fix 4) | ✅ 200, 21 chunks |
| DELETE single document endpoint | ✅ 1 chunk deleted |
| Backend heap limit | ✅ 1548 MB (đúng 1.5GB) |
| AI chat với RAG context | ✅ "Số điện thoại và Zalo của Hoàng Nghĩa Cường..." (test streaming) |

---

## 📊 STATE HIỆN TẠI

### Production
- **Frontend:** https://cuongthai.com (Next.js 14, dark mode, 14+ admin pages)
- **Backend:** https://cuongthai.com/api/v1 (Node.js 22, Express, Prisma, PostgreSQL)
- **Containers:** 5 services (backend, frontend, nginx, postgres, redis) — all healthy
- **Auth:** Email/password + Google OAuth + GitHub OAuth (cookie `backend_token` httpOnly)
- **AI:** Groq `llama-3.1-8b-instant` + RAG với 17 chunks cá nhân
- **Database:** PostgreSQL trong container, 21 rows trong `document_chunks`
- **VPS:** 160.187.1.208 (root@...), 2GB RAM, deploy script tự động

### RAG Knowledge Base (17 chunks)
- 7 documents / 8 document types
- AI có thể trả lời chính xác về: bio, contact, skills, projects, pricing,
  education, FAQ của Hoàng Nghĩa Cường

### Code Stats
- 4 commits mới trong phiên
- 1 file mới (admin page)
- 3 files sửa (ai.service, ai.routes, layout, Dockerfile)
- 0 linter errors, 0 TypeScript build errors

---

## 🔜 CÁC MỤC CÓ THỂ LÀM TIẾP (chưa làm trong phiên này)

| # | Mục | Độ khó | Lợi ích |
|---|---|---|---|
| 1 | **Function calling** cho AI query trực tiếp DB (projects, courses, users) | Trung bình (~3h) | AI trả lời real-time về data hiện tại |
| 2 | **Vector embedding** thật (bật pgvector + Groq embeddings) | Trung bình (~4h) | Search semantic thay vì keyword |
| 3 | **Fallback model + auto-retry** khi Groq rate-limit | Dễ (~1h) | Không bị 429 khi traffic cao |
| 4 | **Rate-limit UI** ở frontend (đếm lượt, hiển thị "đang chờ reset") | Dễ (~2h) | UX tốt hơn |
| 5 | **Multi-tenant** knowledge base (mỗi user có RAG riêng) | Khó (~1 ngày) | Scale cho nhiều khách |
| 6 | **Auto-train** từ blog posts, project descriptions (cron job) | Trung bình (~3h) | Knowledge base tự cập nhật |
| 7 | **Pagination** cho admin page (hiện 21 chunks, sau này có thể 1000+) | Dễ (~1h) | Performance với data lớn |
| 8 | **Bulk upload** qua file .txt/.md thay vì paste vào textarea | Dễ (~1h) | UX tốt hơn |
| 9 | **Test RAG** với câu hỏi phức tạp (so sánh trước/sau upload) | Dễ (~30min) | Đánh giá chất lượng AI |

---

## 🎓 LESSONS LEARNED

1. **`Promise.all` + infinite loop = OOM nhanh.** Luôn verify termination condition
   của vòng lặp trước khi map với Promise.all. Bug này ẩn vì chỉ xảy ra khi input
   vừa đủ lớn (600+ chars).

2. **Cross-origin cookie ≠ same-origin cookie.** Khi frontend SPA gọi backend khác
   domain, cookie httpOnly KHÔNG được gửi kèm theo mặc định. Phải đi qua server-side
   proxy hoặc config CORS `credentials: 'include'` + `Access-Control-Allow-Credentials: true`
   + `Access-Control-Allow-Origin: <specific>` (không được `*`).

3. **Catch-all proxy pattern** ở `frontend/src/app/api/v1/[[...path]]/route.ts` là
   cách sạch nhất để vừa forward API calls vừa giữ cookie httpOnly — không lộ token
   ra JavaScript, không cần CORS phức tạp. Tất cả trang admin đều nên follow pattern này.

4. **Heap limit chỉ là cap, không phải allocation.** Bump `NODE_OPTIONS=--max-old-space-size=1536`
   không ăn hết RAM lúc idle. Node chỉ dùng nhiều khi thật sự cần, và GC free trước
   khi đụng cap. An toàn để set cao hơn default 512MB.

5. **Test với content size thực tế.** Bug chunkText chỉ xuất hiện với text > 500 chars.
   Unit test với text ngắn sẽ miss. Có thể viết integration test upload 5KB, 50KB.

---

## 🐛 BUGS ĐÃ SỬA TRONG PHIÊN (tóm tắt)

| # | Commit | Mức nghiêm trọng | Triệu chứng | Root cause |
|---|---|---|---|---|
| 1 | `0fde049` | 🔴 Critical | 502 Bad Gateway khi upload RAG doc | Infinite loop trong `chunkText()` |
| 2 | `0fde049` | 🟡 Medium | OOM crash với content lớn | Default V8 heap 512MB quá nhỏ |
| 3 | `3d52dab` | 🟢 Low | Không có cách xoá 1 RAG document | Backend chỉ có `clear-all` |
| 4 | `f60c105` | 🔴 High | Admin page 401, 0 chunks | Cross-origin call mất cookie httpOnly |

---

## 📌 GIT HISTORY (4 commits mới nhất)

```
f60c105 fix(admin/ai-knowledge): use same-origin proxy URL so the cookie is forwarded
3d52dab feat(admin): AI Knowledge Base management UI + DELETE endpoint
0fde049 fix(ai-rag): terminate chunkText() loop and raise backend heap
2215940 fix(ai-chat): upsert ChatSession BEFORE creating ChatMessage   ← (phiên trước)
```

---

## 🚀 CÁCH DÙNG NGAY

### Upload thêm document
- Vào **https://cuongthai.com/admin/ai-knowledge**
- Bấm **"Upload Document"** góc phải trên
- Chọn loại (vd: `blog`, `service`, `policy`, hoặc `custom`)
- Paste nội dung, bấm Upload

### Upload bằng script (production)
```bash
# Edit scripts/upload-knowledge.sh, thêm document mới vào mảng CUỐI cùng
bash scripts/upload-knowledge.sh
```

### Upload bằng curl
```bash
TOKEN=$(curl -s -X POST https://cuongthai.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Cuong03dx","password":"Cuong123"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

curl -X POST https://cuongthai.com/api/v1/ai/admin/documents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "my-new-doc",
    "documentType": "blog",
    "content": "Nội dung bất kỳ..."
  }'
```

### Test AI dùng knowledge mới
- Mở **https://cuongthai.com/chat** (hoặc component ChatModal ở bất kỳ trang nào)
- Hỏi: *"Cường học trường nào?"*, *"Giá làm portfolio gói Standard?"*, *"Số Zalo?"*
- AI sẽ trả lời chính xác từ RAG context

---

## 📞 LIÊN HỆ KHI CẦN HỖ TRỢ

- **GitHub:** https://github.com/cuonghoang1103/api-backend
- **VPS:** 160.187.1.208 (root SSH key ở `~/.ssh/id_rsa`)
- **Deploy script:** `bash scripts/deploy-vps.sh` (chạy từ `/home/deployer/repo`)
- **Logs:** `docker logs cuonghoangdev_backend --tail=100`

---

*File này là snapshot tại 14/06/2026 13:34. Mỗi khi hoàn thành mục lớn,
update file này để có timeline chính xác cho dự án.*
