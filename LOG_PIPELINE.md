# Log Pipeline

This document describes how to consume the structured JSON logs that
the CuongHoangDev backend now emits. Every log line is a single
JSON object on one line (NDJSON / JSON Lines), produced by
`src/utils/logger.ts`.

## Wire format

In **production** (`NODE_ENV=production`), every line is JSON:

```json
{"ts":"2026-06-23T03:49:35.789Z","level":"info","msg":"Database connected","elapsedMs":12}
{"ts":"2026-06-23T03:49:35.790Z","level":"info","msg":"Database pool OK","env":"production"}
{"ts":"2026-06-23T03:49:36.040Z","level":"info","msg":"cron all jobs registered","jobs":[...]}
{"ts":"2026-06-23T03:49:36.043Z","level":"info","msg":"CuongHoangDev API running","port":3001,"env":"production",...}
```

In **development**, the format is human-readable text:

```
[2026-06-23T03:34:13.358Z] INFO Sentry initialized {"environment":"production"}
[2026-06-23T03:34:15.144Z] ERROR Database connection failed {"error":"Can't reach database server..."}
```

Fields always present:

| Field  | Type | Description |
|--------|--------|----------------------------------------------------------|
| `ts` | string | ISO 8601 timestamp (UTC) |
| `level`| string | `debug` \| `info` \| `warn` \| `error`  |
| `msg` | string | Stable event name (e.g. `Database connected`) |

Plus any event-specific fields (`elapsedMs`, `env`, `orderCode`, etc.).
`debug` level is suppressed when `NODE_ENV=production`.

## Log destinations

The backend writes to **stdout** in production. Docker captures
this and you can read it with:

```bash
docker compose logs api -f --tail 100
```

On the VPS, Docker's default JSON log driver writes to:
`/var/lib/docker/containers/<container-id>/<container-id>-json.log`

For shipping to a log aggregator, you have three common options.

---

## Option 1: Cloudflare Logpush (easiest if you use Cloudflare)

If `cuongthai.com` is on Cloudflare, you can push Docker logs
straight to Logpush via rsyslog. The steps:

1. In Cloudflare dashboard → **Logs** → **Logpush** → **Create job**
2. Dataset: **HTTP requests** is for the proxy. For application
 logs you need a custom destination — typically an S3-compatible
 bucket or an HTTPS endpoint you control.
3. Alternative: install a small rsyslog → Logpush forwarder on
 the VPS (Cloudflare provides a guide for this).

**For application logs specifically**, the simpler path is
Option 2 or 3 below.

---

## Option 2: Vector (lightweight, no SaaS dependency)

[Vector](https://vector.dev) is a single-binary log router from
Datadog/Timber. Install on the VPS:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://sh.vector.dev | bash
```

Add `/etc/vector/vector.toml`:

```toml
[sources.docker]
type = "docker_logs"
include_images = ["cuonghoangdev_backend"]

[transforms.parse]
type = "remap"
inputs = ["docker"]
source = '''
 . = parse_json!(.message)
'''

[sinks.console]
type = "console"
inputs = ["parse"]
encoding.codec = "json"
```

Then:

```bash
sudo systemctl restart vector
sudo journalctl -u vector -f
```

You now have a stream of parsed JSON objects in the journalctl
output. You can swap the sink for Loki, Elasticsearch, S3, etc.

---

## Option 3: Promtail + Grafana Loki (if you already run Grafana)

[Promtail](https://grafana.com/docs/loki/latest/clients/promtail/)
is the official Docker-log shipper for Loki. Add
`/etc/promtail/config.yml`:

```yaml
server:
 http_listen_port: 9080

positions:
 filename: /tmp/positions.yaml

clients:
 - url: http://localhost:3100/loki/api/v1/push

scrape_configs:
 - job_name: docker
 static_configs:
 - targets: [localhost]
 labels:
 job: docker
 __path__: /var/lib/docker/containers/**/*-json.log
 pipeline_stages:
 - docker: {}
 - json:
 expressions:
 output: log
 - labels:
 level:
 msg:
```

Then query from Grafana: `{job="docker"} | json | level="error"`.

---

## Quick queries (jq)

If you just want to query the local Docker log without setting up
a full pipeline, use the helper script:

```bash
./scripts/log-query.sh errors # last 50 errors
./scripts/log-query.sh level=error # all errors
./scripts/log-query.sh msg="Database connected" # event search
./scripts/log-query.sh provider=groq # provider-filtered
```

The script uses `jq` — install on the VPS with
`apt install jq` (already there on most Ubuntu images).

---

## Stable event names (catalog)

These are the `msg` values the backend currently emits. Treat
them as a contract — when you query, filter on these. New events
should be added in a backwards-compatible way (new fields, never
rename an existing one without grepping first).

### Startup
- `Sentry initialized` — `{ environment, release }`
- `Database connected` — `{ elapsedMs }`
- `Database pool OK` — `{ env }`
- `Database disconnected` — `{}`
- `Database disconnect error` — `{ error }`
- `document_chunks table + embedding column OK (auto-synced)` — `{}`
- `social_posts GIN trigram index OK` — `{}`
- `pg_trgm index skipped (extension unavailable)` — `{ error }`
- `Schema auto-sync skipped` — `{ error }`
- `Cron jobs failed to start` — `{ error }`
- `CuongHoangDev API running` — `{ port, env, frontendUrl, uploadDir, database }`
- `Failed to start server` — `{ error }`
- `TURNSTILE_SECRET_KEY not set in production!` — `{}` (level=error; config guard)

### HTTP
- `CORS rejected origin` — `{ origin }`

### Cron lifecycle
- `cron already started, skipping`
- `cron running nightly cleanup job`
- `cron cleanup enqueued` — `{ jobId }`
- `cron cleanup enqueue failed` — `{ error }`
- `cron running weekly re-embed check`
- `cron re-embed enqueued` — `{ jobId }`
- `cron re-embed enqueue failed` — `{ error }`
- `cron Redis unreachable — quota service running in Postgres fallback mode` — `{}`
- `cron Postgres unreachable` — `{ error }`
- `cron expired stale PENDING orders` — `{ count, ttlMinutes }`
- `cron order cleanup failed` — `{ error }`
- `cron archived dashboard tasks` — `{ count, archiveDays }`
- `cron purged archived dashboard tasks` — `{ count, purgeDays }`
- `cron purged old celebration records` — `{ count }`
- `cron dashboard archive failed` — `{ error }`
- `cron all jobs registered` — `{ jobs: string[] }`
- `cron stopped (flag flipped)`

### Embed queue
- `embed job done` — `{ jobId, type, durationMs }`
- `embed job failed` — `{ jobId, type, attempts, error }`
- `embed job attempt failed, will retry` — `{ jobId, type, attempts, error }`
- `embed queue recovery scan: no pending jobs (status column not yet migrated)` — `{}`

### AI providers
- `AIProviders initialized client` — `{ provider, baseURL }`
- `CircuitBreaker cooldown expired, half-open` — `{ name }`
- `CircuitBreaker OPENED` — `{ name, cooldownSec, errorCode, consecutiveFailures, error }`
- `CircuitBreaker failure` — `{ name, failures, threshold, error }`
- `CircuitBreaker CLOSED (recovered)` — `{ name, recoveredAfterFails }`
- `AIProviders skipping (circuit open)` — `{ provider, retryIn, reason }`
- `AIProviders answered` — `{ provider, providerDurationMs, attempts, totalDurationMs, attemptLog }`
- `AIProviders provider failed, trying next` — `{ provider, error }`
- `AIProviders all client caches reset`
- `CircuitBreaker manual reset` — `{ name }`
- `Embeddings loading local model` — `{ model }`
- `Embeddings model loaded` — `{ durationMs }`

### AI service
- `AIService Embedding query failed, falling back to keyword` — `{ error }`
- `AIService document_chunks table not found, skipping RAG context` — `{}`
- `AIService document_chunks table not found, nothing to clear` — `{}`
- `AIService document_chunks table not found, returning empty` — `{}`
- `AIService Chat error` — `{ error }`
- `AIService Groq streaming failed` — `{ error }`
- `AIService All providers failed` — `{ error }`
- `AIService failed to compute embeddings` — `{ documentId, error }`
- `AIService backfilling chunks with embeddings` — `{ total }`
- `AIService batch failed` — `{ start, end, error }`
- `AIService backfill done` — `{ embedded, failed }`
- `AIService Groq client cache reset`

### Payment (VNPay IPN)
- `payment-ipn PRODUCT PAID` — `{ orderCode, shopOrderId, amountVnd, txnNo }`
- `payment-ipn PAID` — `{ orderCode, userId, courseId, amountVnd, txnNo }`
- `payment-refund REFUNDED` — `{ orderCode, amount, isFull, adminId }`
- `failed to increment coupon usedCount` — `{ error }`
- `receipt email failed` — `{ error }`
- `refund email failed` — `{ error }`

### Auth
- `register dev OTP` — `{ email, otp }` (dev mode only)
- `register email failed` — `{ email, maskedOtp, hint, error }` (dev)
- `register email failed` — `{ email, maskedOtp, hint, error }` (prod)
- `register FULL OTP (dev only)` — `{ email, otp }` (dev only)
- `Resend error` — `{ error }`
- `Failed to send` — `{ error }` (email service)
- `RESEND_API_KEY not set — email not sent` — `{ to, subject }` (level=warn; config guard)

### Notifications
- `pushNotification failed` — `{ error }`
- `notifyAdminPost failed` — `{ error }`
- `notifyAdminProject failed` — `{ error }`
- `notifyAdminBlog failed` — `{ error }`
- `notifyPasswordChanged failed` — `{ error }`
- `notification fan-out failed` — `{ error }`

### Quota
- `Redis error` — `{ error }`
- `Redis unavailable, falling back to Postgres` — `{ error }`
- `Middleware error, allowing request` — `{ error }`
- `Postgres fallback failed` — `{ error }`

### Music
- `MusicStream stream error` — `{ trackId, error }`
- `Normalization failed, using original` — `{ error }`
- `YouTube Import API error` — `{ body }`
- `YouTube Search API error` — `{ body }`

### Captcha
- `captcha bypass lookup failed, falling back to captcha check` — `{ error }`
- `captcha soft-mode: no Turnstile token` — `{ path }`
- `Turnstile API error` — `{ status }`
- `Verification failed` — `{ codes }`
- `Network error` — `{ error }`

### FFmpeg
- `getAudioMetadata failed` — `{ error }`
- `Pass 1 measurement failed (non-fatal)` — `{ error }`
- `Loudnorm normalization failed, falling back to re-encode` — `{ error }`
- `Could not stat normalized file` — `{ path }`

### GitHub
- `github fetch retry` — `{ label, attempt, retries, delayMs }`

### Redis
- `redis client error` — `{ error }`
- `redis reconnecting`
- `redis connection ready`

### Sentry
- `Sentry init failed` — `{ error }`
- `Sentry requestHandler failed` — `{ error }`
- `Sentry errorHandler failed` — `{ error }`

### AI SSE
- `AI-SSE stream error` — `{ error }`

### Express error handler
- `Express error handler` — `{ error, stack, name, code, path, method }`

### Process lifecycle
- `shutdown signal received` — `{ signal }`
- `HTTP server closed`
- `Database connections closed`
- `Error during shutdown` — `{ error }`
- `Graceful shutdown complete`
- `Could not close connections in time, forcefully shutting down`
- `UNCAUGHT EXCEPTION! Shutting down...` — `{ error, stack }`
- `UNHANDLED REJECTION! Shutting down...` — `{ reason }`

### Messaging socket
- `auto-join threads failed` — `{ error }`

### Uploads (R2 / S3 / path-based)
- `[upload] audio <url> (<size>B)` — `{}` (info)
- `[upload] document <url> (<size>B)` — `{}` (info)
- `[upload] generic <url> (<size>B, <contentType>)` — `{}` (info)
- `[upload] signed PUT <url> (<size>B)` — `{}` (info)
- `[upload] deleted <key>` — `{}` (info)
- `[upload] batch-deleted <n> object(s)` — `{}` (info)
- `[upload] batch delete failed: <message>` — `{}` (warn)
- `[upload] failed to delete <key>: <message>` — `{}` (warn)
- `[upload-deprecated] path-based delete failed for <path>: <message>` — `{}` (warn)
- `[lesson-documents] failed to remove <url>: <message>` — `{}` (warn)
- `Failed to upload <filename>: <message>` — `{}` (error)

**Note on these events:** they embed dynamic data (URLs, sizes,
keys) directly in the `msg` field rather than as structured
context fields. This is intentional for grep-based ops workflows
("find the line for this URL") but it means you cannot aggregate
them by `msg` in your log aggregator. The recommended pattern
for new code is to use the structured form:

```ts
logger.info('upload audio done', { url: stored.url, size: input.size });
```

If you need to migrate these later, the static prefixes
(`[upload]`, `[upload-deprecated]`, `[lesson-documents]`,
`Failed to upload`) are stable and safe to grep.
