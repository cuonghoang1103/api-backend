# CuongHoangDev API - Hướng Dẫn Cài Đặt & Test Local

## Bước 1: Cài đặt Dependencies

```bash
cd /Users/admin/Downloads/api-backend

# Cài đặt tất cả dependencies
npm install
```

## Bước 2: Cấu hình Environment

```bash
# Copy file .env.example thành .env
cp .env.example .env
```

Mở file `.env` và cấu hình các biến sau:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:123456@localhost:5432/cuonghoangdev_db?schema=public"

# JWT Secret (thay bằng chuỗi ngẫu nhiên 256-bit)
JWT_SECRET="CuongHoangDevV2SecretKeyNangCao2026NheMaNayCanItNhat256BitNhe"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL (cho CORS)
FRONTEND_URL="http://localhost:3000"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# AI Gemini API Key (lấy từ https://aistudio.google.com)
GEMINI_API_KEY=""

# OAuth (tùy chọn)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

## Bước 3: Khởi tạo Database

### Option A: PostgreSQL local (khuyến nghị)

```bash
# Tạo database
createdb cuonghoangdev_db

# Generate Prisma Client
npm run db:generate

# Push schema lên database (tạo tables)
npm run db:push

# Seed data mẫu
npm run db:seed
```

### Option B: Docker PostgreSQL (nếu không cài local)

```bash
# Chạy PostgreSQL trong Docker
docker run -d \
  --name cuonghoangdev_pg \
  -e POSTGRES_DB=cuonghoangdev_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -p 5432:5432 \
  postgis/postgis:16-3.4

# Verify
docker exec cuonghoangdev_pg pg_isready -U postgres

# Sau đó chạy các lệnh generate/push/seed ở trên
```

## Bước 4: Khởi tạo Database Schema

```bash
# Generate Prisma Client từ schema.prisma
npm run db:generate

# Push schema (tạo/migrate tables)
npm run db:push

# Seed dữ liệu ban đầu (roles, admin, AI config, discounts)
npm run db:seed
```

**Kết quả mong đợi:**
```
✅ Database connected
✅ Roles created
✅ Admin user created: cuonghoang1103@gmail.com
✅ AI configs seeded
✅ AI prompts seeded
✅ Discount codes seeded
🌱 Seed complete!
```

## Bước 5: Chạy Development Server

```bash
# Development với hot reload (tsx watch)
npm run dev
```

**Output mong đợi:**
```
✅ Database connected (45ms)
✅ Database pool: OK (development)
🚀 CuongHoangDev API running on port 3001
   Environment: development
   Frontend URL: http://localhost:3000
   Upload dir: ./uploads
   Database: localhost:5432/cuonghoangdev_db
```

## Bước 6: Test API

### Test Health Check

```bash
# Health check
curl http://localhost:3001/health

# Response:
# {"status":"ok","timestamp":"2026-06-08T03:15:00.000Z","uptime":12.5,"database":"connected"}
```

### Test Authentication

```bash
# Register user mới
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123456",
    "email": "test@example.com",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Login response (có JWT token):
# {"success":true,"data":{"userId":1,"username":"admin","token":"eyJhbGci..."}}
```

### Test Music Streaming (206 Partial Content)

```bash
# Giả sử có track ID=1 trong database
# Tạo file test: tạo thư mục uploads/audio và copy 1 file mp3

# Test 1: Full file request (không có Range header)
curl -I http://localhost:3001/api/v1/music/stream/1

# Response headers:
# HTTP/1.1 200 OK
# Content-Type: audio/mpeg
# Content-Length: 5242880
# Accept-Ranges: bytes

# Test 2: Range request (tua nhạc)
curl -I http://localhost:3001/api/v1/music/stream/1 \
  -H "Range: bytes=0-102399"

# Response headers:
# HTTP/1.1 206 Partial Content
# Content-Type: audio/mpeg
# Content-Length: 102400
# Content-Range: bytes 0-102399/5242880
# Accept-Ranges: bytes

# Test 3: Download range
curl http://localhost:3001/api/v1/music/stream/1 \
  -H "Range: bytes=0-1023" \
  -o /tmp/test_chunk.mp3
```

### Test AI Chatbot SSE

```bash
# Non-streaming (sync)
curl -X POST http://localhost:3001/api/v1/ai/chat/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "message": "Xin chào, bạn là ai?",
    "sessionId": "test-session-1"
  }'

# Response:
# {"success":true,"data":{"text":"Tôi là trợ lý AI của CuongHoangDev...","sessionId":"test-session-1"}

# SSE Streaming (xem từng token)
curl -N -X POST http://localhost:3001/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "message": "Xin chào, bạn là ai?",
    "sessionId": "test-session-1"
  }'

# Output (mỗi dòng là 1 token):
# data: {"text":"Tôi","done":false}
# data: {"text":" là","done":false}
# data: {"text":" trợ","done":false}
# data: {"text":" lý","done":false}
# ...
# data: {"text":"","done":true,"tokens":45}
```

### Test File Upload

```bash
# Tạo file test
echo "Test audio content" > /tmp/test.mp3

# Upload audio file
curl -X POST http://localhost:3001/api/v1/files/upload \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -F "file=@/tmp/test.mp3" \
  -F "category=audio"

# Response:
# {"success":true,"data":{"id":1,"originalName":"test.mp3","storedName":"test-1718000000-abcd.mp3","url":"/uploads/audio/test-1718000000-abcd.mp3",...}}
```

## Các NPM Commands

```bash
# Development
npm run dev              # tsx watch (hot reload)
npm run dev:debug        # tsx watch + --inspect (debug Node.js)

# Production
npm run build            # TypeScript compile → dist/
npm run start            # Chạy dist/index.js

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push           # Push schema (tạo tables)
npm run db:migrate        # Run Prisma migrations
npm run db:seed           # Seed data
npm run db:studio         # Mở Prisma Studio (GUI)

# Quality
npm run lint             # ESLint
npm run type-check        # TypeScript type checking (không compile)
npm run clean             # Xóa dist/
```

## Docker Deployment (VPS)

```bash
# Setup server mới
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh

# Deploy thay đổi
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# Backup database
chmod +x scripts/backup.sh
./scripts/backup.sh

# Restore database
./scripts/restore.sh backup_20260608_120000.sql.gz
```

## Cấu trúc Project

```
api-backend/
├── src/
│   ├── index.ts              # Express app + middleware
│   ├── config/
│   │   ├── env.ts           # Environment variables
│   │   └── database.ts      # Prisma singleton
│   ├── routes/               # Express routers
│   ├── services/            # Business logic
│   ├── middleware/           # Auth, error handling
│   └── types/               # TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema (44 tables)
│   └── seed.ts              # Database seed
├── uploads/                  # Local file storage
│   ├── images/
│   ├── audio/
│   ├── video/
│   └── documents/
├── nginx/
│   └── nginx.conf          # Nginx config (SSL + static serve)
├── docker-compose.yml       # All-in-one deployment
└── scripts/
    ├── setup-server.sh
    ├── deploy.sh
    ├── backup.sh
    └── restore.sh
```

## Troubleshooting

### Lỗi "Cannot find module './routes/auth.routes'"

```bash
# Ensure all route imports use .js extension (ESM)
# import authRoutes from './routes/auth.routes.js';  ✓ Correct
# import authRoutes from './routes/auth.routes';    ✗ Wrong
```

### Lỗi "Prisma Client not found"

```bash
npm run db:generate
```

### Lỗi "Database connection refused"

```bash
# Kiểm tra PostgreSQL đang chạy
pg_isready -h localhost -p 5432

# Hoặc chạy PostgreSQL trong Docker
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=cuonghoangdev_db \
  -e POSTGRES_PASSWORD=123456 \
  postgis/postgis:16-3.4
```

### Lỗi "GEMINI_API_KEY is not configured"

Thêm API key vào `.env`:
```bash
GEMINI_API_KEY="AIza..."
```

Lấy key tại: https://aistudio.google.com/apikey

### Lỗi SSE stream bị cắt

Đảm bảo Nginx config có:
```nginx
proxy_buffering off;
chunked_transfer_encoding on;
```

Và headers SSE được set:
```
X-Accel-Buffering: no
```
