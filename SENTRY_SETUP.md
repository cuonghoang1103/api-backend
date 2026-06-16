# Sentry Integration - Hướng Dẫn Triển Khai

## Tổng Quan

Tích hợp **Sentry** theo skill chính thức `getsentry/sentry-for-ai/skills/sentry-nextjs-sdk` (2025). Khi có lỗi production (500, unhandled rejection, crash Express...) → Sentry gửi alert kèm stack trace, request context, user info, breadcrumbs.

**Trạng thái hiện tại**: Backend (Node.js) **enabled** với DSN đã cấu hình. Frontend (Next.js) **code sẵn sàng** nhưng **disabled** (chưa có DSN riêng).

## Skill Reference

Đã follow chính xác theo skill: <https://github.com/getsentry/sentry-for-ai/blob/main/skills/sentry-nextjs-sdk/SKILL.md>

Có 2 điểm khác biệt vs skill mặc định:
1. **SDK version**: Skill dùng `@sentry/nextjs` ≥8.28.0. Code này pin v7.120.4 vì Next.js 14.2.15. Một số API mới không có:
   - `Sentry.setupExpressErrorHandler()` → thay bằng `Sentry.Handlers.requestHandler()` + `Sentry.Handlers.errorHandler()` (v7 pattern)
   - `Sentry.captureRequestError` → thay bằng thủ công trong `error.tsx` / `global-error.tsx`
   - `Sentry.captureRouterTransitionStart` → tạm thời bỏ (không critical)
2. **Privacy**: Skill dùng `sendDefaultPii: true`. Code này tắt vì app có user data nhạy cảm (chat messages, emails). Có strip riêng email/username/IP trong `beforeSend`.

## Files Đã Tạo/Sửa

### Frontend
| File | Mô tả |
|---|---|
| `sentry.client.config.ts` (root) | Browser init: replay 10% sessions, 100% on error, mask all text/inputs, beforeSend strips PII |
| `sentry.server.config.ts` (root) | SSR/API init: includeLocalVariables, beforeSend strips PII + body |
| `sentry.edge.config.ts` (root) | Middleware init |
| `src/instrumentation.ts` | Hook load server/edge configs theo `NEXT_RUNTIME` |
| `src/app/global-error.tsx` | Root error boundary dùng `NextError` |
| `src/app/error.tsx` | (updated) Capture exception vào Sentry |
| `next.config.js` | Wrap `withSentryConfig`: tunnelRoute `/monitoring`, widenClientFileUpload, treeshake, hideSourceMaps |

### Backend
| File | Mô tả |
|---|---|
| `src/services/sentry.service.ts` | Sentry init + `Handlers.requestHandler/errorHandler` + `setUser` + `captureException/Message` + `flushSentry` |
| `src/index.ts` | `initSentry()` đầu tiên + `sentryRequestMiddleware` cho mỗi request + `setupSentryErrorHandler` |
| `src/middleware/errorHandler.ts` | Tự động capture 5xx (không spam 4xx) |
| `src/config/env.ts` | 4 env vars: `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE` |

### Config
| File | Mô tả |
|---|---|
| `docker-compose.yml` | Backend + frontend env vars |
| `frontend/Dockerfile` | Build args cho `NEXT_PUBLIC_SENTRY_DSN` (cần build-time vì Next.js inlines) |
| `.env.example` (3 files) | Template + documentation |

## Bước Tiếp Theo Của Anh

### 1. Sentry DSNs

**Đã cấu hình cả 2 DSNs**:

| Project | DSN | Environment vars |
|---|---|---|
| **Backend (Node.js)** | `https://f691f0372269644d4d60a7f2be17ac83@o4511576800755712.ingest.us.sentry.io/4511576832737280` | `SENTRY_DSN` |
| **Frontend (Next.js)** | `https://aacd6db6a1fbd9788a250d9dfd65f88d@o4511576800755712.ingest.us.sentry.io/4511576889819136` | `NEXT_PUBLIC_SENTRY_DSN` |

Cả 2 DSN cùng org (`o4511576800755712`) nhưng khác project. Events sẽ hiển thị trong 2 projects riêng biệt trên Sentry dashboard → dễ phân biệt backend 5xx vs frontend hydration errors.

**Cấu hình đã thêm vào `/Users/admin/Downloads/api-backend/.env`** (local). Cần copy lên VPS `/opt/cuonghoangdev/.env`.

### 2. Update env trên VPS

Đã thêm DSN vào `.env` local rồi. Cần push lên VPS `/opt/cuonghoangdev/.env`:

```bash
ssh vps
cd /opt/cuonghoangdev
# Backup trước
cp .env .env.bak-pre-sentry
# Append hoặc edit thêm:
# SENTRY_DSN="https://f691f0372269644d4d60a7f2be17ac83@o4511576800755712.ingest.us.sentry.io/4511576832737280"
# SENTRY_TRACES_SAMPLE_RATE="0.1"
# SENTRY_ENVIRONMENT="production"
```

### 3. Redeploy

```bash
# Local
git add -A
git commit -m "feat: add Sentry error tracking"
git push origin main

# VPS (auto-deploy, hoặc manual)
ssh vps
cd /opt/cuonghoangdev
docker compose pull
docker compose build --no-cache
docker compose up -d
```

### 4. Verify (5 phút)

1. **Backend log check**:
   ```bash
   docker logs cuonghoangdev_backend 2>&1 | grep -i sentry
   # → "✅ Sentry initialized" (chỉ khi SENTRY_DSN được set)
   ```

2. **Browser console check**: Mở https://cuongthai.com → DevTools → Console
   - Sẽ thấy log `Sentry initialized` (nếu debug = true)
   - Hoặc thấy request đến `/monitoring` (tunnel route)

3. **Trigger test error**:
   ```bash
   # Test 404
   curl -I https://cuongthai.com/api/v1/courses/nonexistent

   # Test 500
   curl https://cuongthai.com/api/v1/messages/threads
   ```

4. **Sentry dashboard**: Mở https://sentry.io → Issues → tìm project → sẽ thấy events trong 5-10s

## Tính Năng Đã Enable

| Feature | Status | Config |
|---|---|---|
| Error Monitoring | ✅ | `instrumentation.ts` + error boundaries |
| Tracing (server) | ✅ | `Handlers.requestHandler()` + `tracesSampleRate: 0.1` |
| Tracing (client) | ✅ | `tracesSampleRate: 0.1` |
| Session Replay (on error) | ✅ | `replaysOnErrorSampleRate: 1.0` |
| Session Replay (sampling) | ✅ | `replaysSessionSampleRate: 0.1` |
| Privacy masking | ✅ | `maskAllText: true`, `blockAllMedia: true` |
| URL query strip | ✅ | `beforeSendTransaction` strip search params |
| PII strip (email/IP) | ✅ | `beforeSend` + `sendDefaultPii: false` |
| Express auto-capture | ✅ | `Handlers.errorHandler()` |
| Uncaught exception capture | ✅ | `process.on('uncaughtException')` |
| Unhandled rejection capture | ✅ | `process.on('unhandledRejection')` |
| Graceful flush on shutdown | ✅ | `flushSentry(2000)` |
| App Router error capture | ✅ | `app/error.tsx` + `app/global-error.tsx` |
| Ad-blocker bypass | ✅ | `tunnelRoute: '/monitoring'` |
| Source maps (optional) | 🟡 | Cần `SENTRY_AUTH_TOKEN` |

## Frontend Sentry (✅ Active)

`NEXT_PUBLIC_SENTRY_DSN` đã được set với DSN riêng (Node.js project thứ 2 trong cùng Sentry org).

**Tính năng đã enable:**
- ✅ Error Monitoring (browser, SSR, edge runtime)
- ✅ Tracing 10% (server + client)
- ✅ Session Replay: 10% sessions, 100% on-error
- ✅ Privacy masking (text + media)
- ✅ PII strip (email/username/IP) trong beforeSend
- ✅ App Router error boundaries (`error.tsx`, `global-error.tsx`)
- ✅ Ad-blocker bypass qua `tunnelRoute: '/monitoring'`
- ✅ Tree-shake debug logging
- ✅ Source map hidden from public build

**Sẽ capture được**:
- React render errors / hydration mismatches (#418, #423)
- Client-side unhandled exceptions
- Promise rejections
- Server Action errors
- API route errors (qua global-error.tsx)
- User navigation breadcrumbs

**Sẽ KHÔNG capture** (cần config thêm):
- Source map readable stack traces (cần `SENTRY_AUTH_TOKEN`)
- Profiling (cần Document-Policy header)
- AI monitoring (cần explicit integration)

## Tính Năng Có Thể Thêm Sau

| Feature | Khi nào cần |
|---|---|
| Source map upload | Khi stack traces bị minified → cần `SENTRY_AUTH_TOKEN` |
| Profiling | Khi cần CPU profile (cần `Document-Policy: js-profiling` header) |
| AI Monitoring | Khi app gọi OpenAI/Vercel AI |
| Crons | Khi có scheduled jobs (đã có node-cron) |
| Logs | Khi cần log search (đã có morgan cho backend) |
| Metrics | Khi cần custom counters/gauges |

## Troubleshooting

| Vấn đề | Nguyên nhân | Fix |
|---|---|---|
| Không thấy events | DSN sai | Verify DSN bằng `curl https://...sentry.io/api/0/` |
| Build fail với `tunnelRoute 404` | Plugin cần `next build` chạy sau khi add tunnelRoute | Rebuild |
| Stack traces minified | Chưa upload source maps | Set `SENTRY_AUTH_TOKEN` + rebuild |
| `setupExpressErrorHandler` not found | Đang dùng SDK v7 | Đã được wrap qua `setupSentryErrorHandler` (v7 pattern) |
| Events bị ad-block chặn | Browser block sentry.io | Đã có `tunnelRoute: /monitoring` |
| Memory tăng nhẹ | Replay worker | Normal, ~30KB bundle + 50KB gzipped |
