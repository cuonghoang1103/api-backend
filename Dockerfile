# ============================================================
# CuongHoangDev API - Dockerfile
# Multi-stage build: Builder → Runner (node:22-alpine)
#
# ⚠️  NOT THE ONE PRODUCTION USES. docker-compose builds the backend from
#     Dockerfile.backend (see `dockerfile:` under the backend service), which is
#     what deploy.sh runs. This file is only the local `docker build -t
#     backend-test .` reference from CLAUDE.md.
#     Editing this one and expecting prod to change costs an afternoon — keep
#     any runtime file the app reads (e.g. data/) copied in BOTH.
# ============================================================

# ─── Stage 1: Builder ────────────────────────────────────
# Dùng node:22 đầy đủ để compile TypeScript và install dependencies
FROM node:22 AS builder

WORKDIR /app

# Copy package files trước để tận dụng Docker layer cache
COPY package.json package-lock.json* ./

# Install TẤT CẢ dependencies (kể cả devDependencies để build)
RUN if [ -f package-lock.json ]; then npm ci; \
    else echo "No package-lock.json found, running npm install"; npm install; \
    fi

# Copy source code
COPY prisma ./prisma/
COPY tsconfig.json ./
# Vendored kanji stroke data — read at runtime by the Hán tự module.
COPY data ./data/

# Generate Prisma Client — bước BẮT BUỘC trước khi build
RUN npx prisma generate

# Copy remaining source
COPY src ./src/

# Build TypeScript → JavaScript (output vào ./dist)
RUN npm run build


# ─── Stage 2: Runner ────────────────────────────────────
# Alpine nhẹ ~50MB, trong khiDebian ~120MB
FROM node:22-alpine

# Tạo user non-root để bảo mật (không chạy root trong container)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# mpg123 — giải mã MP3 sang PCM thô cho robot Maker Lab.
#
# TTS trả MP3; vi điều khiển thì muốn mẫu thô đẩy thẳng vào I2S. Việc
# đổi phải làm ở đâu đó, và server là chỗ rẻ nhất.
#
# ⚠️ ĐỪNG BỎ DÒNG NÀY. Không có nó thì `speakOnDevice` lặng lẽ lùi về
# gửi MP3, ESP32 không giải mã được, và triệu chứng ngoài đời là robot
# nghe được, nghĩ được, nhưng câm — không lỗi nào trong log server cả.
#
# mpg123 chứ không phải ffmpeg: ~1,5 MB so với ~80 MB, và nó làm đúng
# một việc này.
RUN apk add --no-cache mpg123

WORKDIR /app

# Copy production-only node_modules (không có devDependencies)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy compiled JavaScript output
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy Prisma schema + generated client
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy package.json (để npm scripts vẫn hoạt động)
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Kanji stroke data (read from disk at runtime, resolved against process.cwd()).
# Without this the Hán tự page 500s on prod while working locally.
COPY --from=builder --chown=nodejs:nodejs /app/data ./data

# Tạo thư mục uploads với quyền nodejs user
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

# Switch sang non-root user
USER nodejs

# Expose port 3001
EXPOSE 3001

# Health check bằng curl hoặc wget
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start command — chạy từ thư mục chứa dist/ (tức /app)
# Dùng `prisma db push` thay cho `migrate deploy` vì repo không có
# thư mục prisma/migrations (chỉ có schema.prisma + seed.ts).
# `db push` đồng bộ schema thẳng vào DB mà không cần file migration.
CMD ["sh", "-c", "cd /app && npx prisma migrate deploy && node dist/index.js"]
