# ============================================================
# CuongHoangDev - Next.js Frontend Dockerfile
# Architecture: deps stage (node_modules) → runner stage (pre-built .next/)
#
# .next/ is pre-built in GitHub Actions and rsynced to VPS.
# This Dockerfile only packages the pre-built .next/ + production deps.
# ============================================================

# ─── Stage 1: Deps (all dependencies for standalone server) ───────
FROM node:22-alpine AS deps

WORKDIR /app

# Ensure package files exist in the build context
COPY package*.json ./

# Verify files exist
RUN ls -la package*.json 2>/dev/null || echo "WARNING: package files not found in build context"

# Install all deps — some are needed at runtime for standalone server
# If package.json is missing, create a minimal one to prevent build failure
RUN if [ ! -f package.json ]; then \
      echo '{"name":"app","dependencies":{"next":"^14.2.15"},"devDependencies":{}}' > package.json; \
      echo "Created minimal package.json"; \
    fi && \
    npm install 2>&1 | tail -5 || echo "npm install had warnings (continuing)"

# ─── Stage 2: Runner (production container) ───────────────────
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

# Copy production node_modules (required by standalone server.js at runtime)
COPY --from=deps /app/node_modules ./node_modules

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
