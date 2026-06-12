# ============================================================
# CuongHoangDev - Next.js Frontend Dockerfile
#
# .next/ is pre-built in GitHub Actions and rsynced to VPS.
# Docker packages the pre-built .next/ + node_modules from the build.
# ============================================================

# ─── Runner (production container) ─────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install wget for healthcheck + npm for post-install scripts
RUN apk add --no-cache wget npm

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy pre-built artifacts (built in GitHub Actions, rsynced to VPS):
#   1. node_modules (runtime deps from npm install)
#   2. standalone server directory (compiled server.js)
#   3. .next/static (static assets: JS/CSS/images)
#   4. public/ (static public assets)
COPY public ./public
COPY .next/standalone ./
COPY .next/static ./.next/static
# Copy node_modules from the rsynced build context
# (npm install ran during the Next.js build on GitHub Actions)
COPY node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
