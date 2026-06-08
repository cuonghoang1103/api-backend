# ============================================================
# PRISMA MIGRATION GUIDE - Kết nối Database Production
# ============================================================
#
# Mục tiêu: Kết nối Prisma schema với Database PostgreSQL cũ
# trên Render.com mà KHÔNG làm mất dữ liệu user.
#
# Cảnh báo: Tuyệt đối KHÔNG chạy lệnh xóa database!
# ============================================================

## TÌNH HUỐNG

Database cũ đang chạy trên Render.com với:
- 44+ tables (users, posts, products, courses, music_tracks, etc.)
- Dữ liệu user thực tế (không muốn mất)
- Cấu trúc được tạo bởi Spring Boot JPA/Hibernate

Prisma schema đã được viết sẵn dựa trên cấu trúc cũ.
Cần đồng bộ Prisma với database mà giữ nguyên data.

## CÁC LỆNH PRISMA GIẢI THÍCH

### 1. `prisma db pull` — ĐỌC database TẠO schema
```
Chức năng: Đọc cấu trúc database hiện tại → tạo schema.prisma từ nó
Dùng khi: Bạn có database nhưng chưa có schema.prisma
Rủi ro: LOW — chỉ đọc, không thay đổi gì
```

### 2. `prisma db push` — ĐẨY schema VÀO database (AN TOÀN)
```
Chức năng: Đẩy schema.prisma vào database
          - Tạo bảng MỚI nếu chưa có
          - Thêm cột MỚI nếu chưa có
          - KHÔNG xóa cột/bảng hiện có
          - KHÔNG xóa dữ liệu
Dùng khi: Database đã có data, muốn sync với schema mới
Rủi ro: LOW — không delete data
⚠️  CẢNH BÁO: Nếu schema.prisma KHÔNG khớp với thực tế,
   có thể lỗi "Missing column" khi truy vấn
```

### 3. `prisma migrate` — TẠO MIGRATION FILES
```
Chức năng: Tạo migration SQL files để track schema changes
Dùng khi: Team development, muốn track lịch sử thay đổi
Rủi ro: MEDIUM — tạo bảng mới có thể conflict
⚠️  KHÔNG dùng cho production database đang có data!
   Chỉ dùng migrate dev hoặc migrate deploy
```

## HƯỚNG DẪN AN TOÀN - TỪNG BƯỚC

### BƯỚC 0: BACKUP DATABASE (QUAN TRỌNG NHẤT!)

```bash
# Kết nối vào Render PostgreSQL từ local
# (Đảm bảo đã cài psql client: brew install postgresql)

PGPASSWORD=your_render_db_password pg_dump \
  -h dpg-xxxxx.render左右.com \
  -U your_render_user \
  -d database_name \
  -Fc \
  -f backup_before_prisma_$(date +%Y%m%d_%H%M%S).dump

# Hoặc dump SQL text (dễ đọc)
PGPASSWORD=your_render_db_password pg_dump \
  -h dpg-xxxxx.render左右.com \
  -U your_render_user \
  -d database_name \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### BƯỚC 1: Kiểm tra kết nối Database

```bash
# Thử kết nối trực tiếp bằng psql
psql "postgresql://your_user:your_password@your-host.render左右.com:5432/database_name"

# Nếu thành công, bạn sẽ thấy prompt postgres=>
# Thoát bằng: \q
```

### BƯỚC 2: Update DATABASE_URL trong .env

```bash
# Mở file .env
nano .env

# Thay đổi DATABASE_URL thành connection string của Render:
DATABASE_URL="postgresql://render_user:render_password@dpg-xxxxx.render左右.com:5432/database_name"
```

### BƯỚC 3: Validate Prisma Schema

```bash
# Kiểm tra schema có lỗi không
npx prisma validate

# Output mong đợi:
# The schema at prisma/schema.prisma is valid ✓
```

### BƯỚC 4: Kiểm tra sự khác biệt (DRY RUN)

```bash
# Xem what will change WITHOUT applying (--dry-run không hoạt động với db push)
# Thay vào đó, dùng prisma migrate diff
# HOẶC đơn giản là chạy db push với --skip-generate

npx prisma db push --skip-generate --schema=./prisma/schema.prisma

# Xem output:
# - "The following migration(s) will be applied..." → xem có gì lạ không
# - "Your database is now in sync with your schema" → OK!
```

### BƯỚC 5: Chạy db push (AN TOÀN)

```bash
# Generate Prisma Client TRƯỚC
npm run db:generate

# Push schema vào database
npm run db:push

# Output mong đợi:
# Environment variables loaded from .env
# Prisma schema loaded from prisma/schema.prisma
# Database connection successful.
#
# The following changes will be made:
# [Create] ... new table(s)
# [Create] ... new column(s)
#
# Are you sure? Type 'y' to confirm:
# > y
#
# ✓ Your database is now in sync with your schema.
```

### BƯỚC 6: Verify data còn nguyên

```bash
# Kết nối vào database
psql "postgresql://..."

# Đếm số user
SELECT COUNT(*) FROM users;

# Đếm số posts
SELECT COUNT(*) FROM posts;

# Đếm số music_tracks
SELECT COUNT(*) FROM music_tracks;

# So sánh với số liệu TRƯỚC KHI push (đã ghi ở Bước 0)
# Nếu SỐ GIỐNG NHAU → Thành công!
```

### BƯỚC 7: Tạo Admin User (nếu chưa có)

```bash
# Seed admin user
npm run db:seed

# Hoặc thủ công:
# INSERT INTO users (username, email, password) VALUES (...)
```

## NẾU GẶP LỖI

### Lỗi: "Column 'xxx' does not exist"

```
Nguyên nhân: schema.prisma định nghĩa cột không có trong database
Giải pháp:
  1. Kiểm tra bảng trong database: SELECT * FROM information_schema.columns WHERE table_name = 'xxx';
  2. Thêm cột thiếu bằng ALTER TABLE
  3. HOẶC xóa field đó khỏi schema.prisma
```

### Lỗi: "Unique constraint already exists"

```
Nguyên nhân: Database đã có index/constraint mà schema định nghĩa lại
Giải pháp:
  Prisma sẽ bỏ qua và tiếp tục — KHÔNG ảnh hưởng data
```

### Lỗi: "Foreign key constraint failed"

```
Nguyên nhân: Dữ liệu vi phạm ràng buộc khóa ngoại
Giải pháp:
  1. Backup data
  2. Xóa dữ liệu vi phạm
  3. Push lại
```

## SCRIPT TỰ ĐỘNG HOÁ

```bash
#!/bin/bash
# safe-migrate.sh — Chạy migration an toàn

set -e

echo "=== 1. Backup Database ==="
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"
echo "Backup saved: $BACKUP_FILE"

echo "=== 2. Validate Schema ==="
npx prisma validate
echo "Schema valid ✓"

echo "=== 3. Generate Prisma Client ==="
npm run db:generate
echo "Client generated ✓"

echo "=== 4. Push Schema ==="
# Tự động xác nhận 'y'
echo "y" | npm run db:push

echo "=== 5. Verify ==="
psql "$DATABASE_URL" -c "SELECT COUNT(*) as user_count FROM users;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as post_count FROM posts;"

echo "=== Migration Complete ==="
```

## CÁC LỆNH NHANH (TÓM TẮT)

```bash
# 1. Validate schema
npx prisma validate

# 2. Generate client
npm run db:generate

# 3. Sync schema (AN TOÀN)
npm run db:push

# 4. Xem database trong GUI
npm run db:studio

# 5. Chạy migrations (CHỈ cho project mới, không dùng với DB có data)
npm run db:migrate

# 6. Seed data
npm run db:seed
```
