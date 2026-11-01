# LabFlow ID — dự án xuyên khoá Authentication (cuongthai.com/courses/authentication)

Dịch vụ danh tính của nền tảng LabFlow (cùng thế giới với LabFlow API của khoá API Design và LabFlow Lite của khoá Testing).
Ảnh chụp này = **cuối Chương 2** (v0.2). Hợp đồng soạn: `content/courses/authentication/_HOP-DONG.md`.

```bash
npm ci                                   # Node 22.12+ (khoá đo trên 22.23.3)
mkdir -p wordlists && curl -sLo wordlists/10k-most-common.txt \
  https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10k-most-common.txt
npm test                                 # 11 test: src/crypto (6) + src/passwords (5) — không cần CSDL
node scripts/cham-lab-1.mjs src/crypto   # 10/10 · lab1/yeu 2/10 · lab1/starter 0/10
node scripts/cham-lab-2.mjs src/passwords # 10/10 · lab2/yeu 3.5/10 · lab2/starter 0/10 (kho giả, không cần CSDL)

# Từ Chương 2 máy chủ cần PostgreSQL 17:
docker run -d --name labflow-id-pg -p 127.0.0.1:4832:5432 \
  -e POSTGRES_USER=labflow -e POSTGRES_PASSWORD=labflow-demo-pw -e POSTGRES_DB=labflow_id postgres:17
export DATABASE_URL=postgres://labflow:labflow-demo-pw@127.0.0.1:4832/labflow_id
npm run migrate && npm run seed          # bảng users + sessions; An/Bình/Cô Lan nhập thẳng bằng argon2id
npm start                                # LabFlow ID v0.2 trên http://localhost:4800
```

| Thư mục | Nội dung |
|---|---|
| `src/` | máy chủ v0.2 (`server.js`), `db.js` (pg), `users.js` (kho users), `passwords/` (Lab 2: hash, policy, pwned, signin), `crypto/` (Lab 1), `log.js`; `store.js` (JSON) chỉ còn cho demo0 |
| `sql/` | migration (`001_users.sql`), áp bằng `scripts/migrate.mjs` |
| `demo0/` | thí nghiệm Mục 0 |
| `demo1/` | thí nghiệm Chương 1 |
| `demo2/` | thí nghiệm Chương 2 (bẻ 4 cách lưu, bảng thời gian, tune/load argon2id, chuỗi tự mô tả, scrypt maxmem, bcrypt 72 byte, đăng nhập ngây thơ vs v0.2 đo thời gian, NFC, pepper, mật khẩu dài, luật pha trộn, HIBP, chuyển MD5 cũ) |
| `lab1/`, `lab2/` | `starter/` (khởi đầu) và `yeu/` (lần thử đầu "chạy được") — chấm bằng `scripts/cham-lab-N.mjs` |

Mọi bí mật trong demo là GIẢ (truyền qua biến môi trường, có chữ `demo`/`fake`, hoặc sinh bằng `newToken()` tại chỗ).
Các demo dùng cổng 4800–4804 (PostgreSQL 4832); Playwright cần trình duyệt đã cài (`npx playwright install chromium`).
`demo2/hibp.mjs` và lượt đăng ký của máy chủ gọi API công khai `api.pwnedpasswords.com` (chỉ gửi 5 ký tự hex của SHA-1).
