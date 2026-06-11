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

# ─── Stage 2: Builder (compile code) ─────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of source
COPY . .

# Build args for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_YOUTUBE_API_KEY
ARG BUILD_NUMBER=local

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_YOUTUBE_API_KEY=$NEXT_PUBLIC_YOUTUBE_API_KEY

# Build Next.js (standalone output)
RUN npm run build

# ─── Stage 3: Runner (production container) ───────────────────
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

# Copy only what standalone needs:
#   1. standalone server directory (contains compiled server.js)
#   2. .next/static (static assets: JS/CSS/images)
#   3. public/ (static public assets)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
