# ============================================================
# CuongHoangDev - Next.js Frontend Dockerfile
# 3-Stage Build: deps → builder → runner
# Final image target: < 200MB
# ============================================================

# ─── Stage 1: Deps (cache-friendly layer for node_modules) ───
FROM node:22-alpine AS deps

WORKDIR /app

# Copy only package files first — maximizes Docker layer cache.
# Any source code change won't trigger re-download of packages.
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm install --prefer-offline

# ─── Stage 3: Runner (production container) ───────────────────
# NOTE: .next/ is pre-built in GitHub Actions and rsynced to VPS.
# This stage ONLY copies the pre-built artifacts — no compilation needed.
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install wget for healthcheck only
RUN apk add --no-cache wget

# Create non-root user (security best practice)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy pre-built artifacts (built in GitHub Actions, rsynced to VPS):
#   1. standalone server directory (compiled server.js)
#   2. .next/static (static assets: JS/CSS/images)
#   3. public/ (static public assets)
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
