# ============================================================
# CuongHoangDev API - Dockerfile
# Multi-stage build: Builder → Runner (node:22-alpine)
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

WORKDIR /app

# Copy production-only node_modules (không có devDependencies)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy compiled JavaScript output
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copy Prisma schema + generated client
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

# Copy package.json (để npm scripts vẫn hoạt động)
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Tạo thư mục uploads với quyền nodejs user
RUN mkdir -p /app/uploads && chown -R nodejs:nodejs /app/uploads

# Switch sang non-root user
USER nodejs

# Expose port 3001
EXPOSE 3001

# Health check bằng curl hoặc wget
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start command — dùng npm start để chạy dist/index.js
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
