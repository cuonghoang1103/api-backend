# ─────────────────────────────────────────────
# Build stage
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Ensure public dir exists (needed by Next.js standalone output)
RUN mkdir -p /app/public

# Build args for environment variables
ARG NEXT_PUBLIC_YOUTUBE_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG BUILD_NUMBER=$GITHUB_RUN_NUMBER

# Copy package files for dependency caching
COPY package*.json ./
RUN npm install --prefer-offline

# Copy source
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_YOUTUBE_API_KEY=$NEXT_PUBLIC_YOUTUBE_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ─────────────────────────────────────────────
# Runtime stage
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
