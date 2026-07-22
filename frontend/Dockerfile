# ============================================================
# CuongHoangDev - Next.js Frontend Dockerfile
# 3-Stage Build: deps → builder → runner
# Final image target: < 200MB
# ============================================================

# ─── Stage 1: Deps (cache-friendly layer for node_modules) ───
# NOTE: Use node:22-slim (Debian-based) instead of node:22-alpine because
# Next.js SWC requires glibc (ld-linux-x86-64.so.2) which Alpine/musl lacks.
FROM node:22-slim AS deps

WORKDIR /app

# Copy only package files first — maximizes Docker layer cache.
# Any source code change won't trigger re-download of packages.
COPY package*.json ./

# Copy host-cache from host if it exists (for offline VPS fallback)
RUN if [ -d "$(pwd)/host-cache" ] && [ "$(ls -A "$(pwd)/host-cache")" != "" ]; then \
      cp -r host-cache /app-host-cache && echo "host-cache present"; \
    else \
      echo "host-cache empty/absent — using online npm"; \
    fi

# Install dependencies. Offline fallback uses /app-host-cache/
# that the deploy script pre-warms (see scripts/pre-warm-node-modules.sh).
RUN npm install --no-audit --fetch-timeout=60000 || \
    (echo "npm install failed — checking host cache..." && \
     if [ -d /app-host-cache/frontend-node_modules/sharp ] && \
        [ -d /app-host-cache/frontend-node_modules/.bin/next ]; then \
       rm -rf node_modules && \
       cp -r /app-host-cache/frontend-node_modules ./node_modules && \
       echo "Restored from host cache" && \
       npm rebuild --no-audit || true; \
     else \
       echo "No host fallback — npm install must succeed" && exit 1; \
     fi)

# ─── Stage 2: Builder (compile code) ─────────────────────────
# NOTE: Use node:22-slim (Debian-based) instead of node:22-alpine because
# Next.js SWC requires glibc (ld-linux-x86-64.so.2) which Alpine/musl lacks.
FROM node:22-slim AS builder

WORKDIR /app

# Heap 4096: the single-process webpack compile + type-check grew past the
# old 3072 ceiling and hit a JS-heap OOM (exit 134) on a cold --no-cache build
# (2026-07-23, after the Code Lab + roadmap expansion). The VPS is now 8GB
# (≈6GB free during a build — jobs are I/O-light), so 4096 is safe headroom.
# The static-generation OOM (exit 137) is separately controlled by limiting the
# worker COUNT to 1 via `experimental.cpus` in next.config.js.
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy cached node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy rest of source
COPY . .

# ─── Defensive: nuke any pre-existing .next directory ──────────────
# Next.js's incremental build uses `.next/cache/` to skip re-building
# chunks that haven't changed. When the cache is present but stale
# (e.g. BuildKit layer cache hit from an older commit), the resulting
# image can ship pre-rendered HTML that references chunk hashes no
# longer in `.next/static/chunks/` — the browser then 404s on those
# scripts and the page hangs on the loading spinner.
#
# Deleting .next before `npm run build` forces a full rebuild from
# scratch. Cost: ~1-2 min on top of the normal build, but the image
# is guaranteed self-consistent (HTML + chunks + manifest all share
# the same buildId). Bounded: only adds 1 line to the builder stage;
# runner stage is unaffected. See the postmortem for the
# 2026-06-26 outage: commit 309413f shipped a build where the
# pre-rendered HTML still referenced the previous deploy's
# `main-app-57e58c5…js` while the actual chunk file had been
# regenerated with a new hash.
RUN rm -rf .next

# Build args for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
# Sentry (browser error tracking). NEXT_PUBLIC_* vars are inlined
# at build time by Next.js's webpack plugin, so they MUST be passed
# as build args — runtime env vars won't reach the browser bundle.
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT
ARG NEXT_PUBLIC_SENTRY_RELEASE
# GIPHY GIF picker key (browser-side). Inlined at build time like the
# other NEXT_PUBLIC_* vars. The old public beta key is banned by GIPHY,
# so a real key must be provided for the chat GIF search to return results.
ARG NEXT_PUBLIC_GIPHY_API_KEY
ARG BUILD_NUMBER=local

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=$NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE
ENV NEXT_PUBLIC_SENTRY_ENVIRONMENT=$NEXT_PUBLIC_SENTRY_ENVIRONMENT
ENV NEXT_PUBLIC_SENTRY_RELEASE=$NEXT_PUBLIC_SENTRY_RELEASE
ENV NEXT_PUBLIC_GIPHY_API_KEY=$NEXT_PUBLIC_GIPHY_API_KEY

# Clean build — prevents Next.js incremental build race condition
# where HTML and JS chunks get mismatched hashes after source changes
RUN rm -rf .next

# Build Next.js (standalone output)
RUN npm run build

# ─── Stage 3: Runner (production container) ───────────────────
# NOTE: Use node:22-slim (Debian-based) instead of node:22-alpine because
# Next.js SWC requires glibc (ld-linux-x86-64.so.2) which Alpine/musl lacks.
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# No apt-get here: the container healthcheck uses node's built-in http
# (see docker-compose.yml), so we don't install wget. This removes the
# `apt-get install wget` step that repeatedly failed with a transient Debian
# GPG "invalid signature" error and broke the frontend image build.

# Create non-root user (security best practice)
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 --shell /bin/bash nextjs

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
