# LabFlow ID — dự án xuyên khoá Authentication (cuongthai.com/courses/authentication)

Dịch vụ danh tính của nền tảng LabFlow (cùng thế giới với LabFlow API của khoá API Design và LabFlow Lite của khoá Testing).
Ảnh chụp này = **cuối Chương 1** (v0.1). Hợp đồng soạn: `content/courses/authentication/_HOP-DONG.md`.

```bash
npm ci                                   # Node 22.12+ (khoá đo trên 22.23.3)
mkdir -p wordlists && curl -sLo wordlists/10k-most-common.txt \
  https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt
npm test                                 # 6 test của src/crypto
node scripts/cham-lab-1.mjs src/crypto   # 10/10 (lời giải tham khảo Lab 1) · lab1/yeu 2/10 · lab1/starter 0/10
npm start                                # LabFlow ID v0.1 trên http://localhost:4800 ; npm run seed tạo An/Bình/Cô Lan
```

| Thư mục | Nội dung |
|---|---|
| `src/` | máy chủ v0.1 (`server.js`), kho JSON `store.js` (`data/db.json`), log allow-list `log.js`, bộ công cụ `crypto/` |
| `demo0/` | thí nghiệm Mục 0 (forget, gates, server-v0, enumerate, guess-session, brute, storage-xss, first-proof, linkedin-replay…) |
| `demo1/` | thí nghiệm Chương 1 (bearer + Referer, dự đoán Math.random, đo thời gian ===, webhook, length extension, khoá dùng chung, CTR/GCM, log, axios, git, Vite) |
| `lab1/` | Lab 1: `starter/` (khởi đầu), `yeu/` (lần thử đầu "chạy được") — chấm bằng `scripts/cham-lab-1.mjs` |

Mọi bí mật trong demo là GIẢ (truyền qua biến môi trường, có chữ `demo`/`fake`, hoặc sinh bằng `newToken()` tại chỗ).
Các demo dùng cổng 4800–4804; Playwright cần trình duyệt đã cài (`npx playwright install chromium`).
