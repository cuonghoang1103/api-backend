# Lộ Trình Chi Tiết Đạt 100% Production-Ready

> Ngày tạo: 2026-06-22
> Tổng: **12 tuần**, chia **6 giai đoạn**
> Mỗi tuần: 5-10 tiếng (tùy task)

---

## TỔNG QUAN

```
Tuần  1-2  │ Giai đoạn 1: Stabilize    │ Fix production fail + DB foundation
Tuần  3-4  │ Giai đoạn 2: Performance  │ Tốc độ + pagination + cache
Tuần  5-6  │ Giai đoạn 3: Payments     │ VNPay production + receipt
Tuần  7-8  │ Giai đoạn 4: Security     │ 2FA + JWT blacklist + audit
Tuần  9-10  │ Giai đoạn 5: Infrastructure│ Backup + logs + metrics
Tuần 11-12  │ Giai đoạn 6: Polish       │ Skeletons + PWA + UX
─────────────────────────────────────────────────────────────
```

---

## GIAI ĐOẠN 1 — STABILIZE (Tuần 1-2)

> **Mục tiêu**: Fix production fail ngay, đặt nền móng database vững

---

### Tuần 1 — Production Emergency Fixes

---

#### Task 1.1 — Fix GHCR Workflow Container Conflict (~1h)

**Vấn đề**: Workflow fail do container naming collision khi redeploy.

**Files cần sửa**: `.github/workflows/deploy-ghcr.yml`

**Thay đổi cụ thể**:
```yaml
# Trước khi docker compose up, thêm:
- name: Stop old containers
  run: |
    docker compose -f docker-compose.prod.yml down || true

# Hoặc dùng unique container name suffix:
container_name: cuonghoangdev_backend_${GITHUB_RUN_NUMBER}
```

**Test**: Push một commit nhỏ, verify workflow chạy thành công qua GitHub Actions tab.

---

#### Task 1.2 — VNPay Sandbox Guard (~30ph)

**Vấn đề**: Nếu `VNPAY_SANDBOX=1` trên production → tiền bị redirect sang sandbox.

**File cần sửa**: `src/services/payment/vnpay.service.ts`

**Thêm vào cuối function `loadConfig()`**:
```typescript
// Production safety: never allow sandbox mode in production
if (cachedConfig!.isSandbox && process.env.NODE_ENV === 'production') {
  throw new Error(
    '[vnpay] FATAL: VNPAY_SANDBOX=1 is set in production! ' +
    'Set VNPAY_SANDBOX=0 or remove it from production environment.'
  );
}
```

**Verify**: Kiểm tra `.env.production` trên VPS có `VNPAY_SANDBOX=0`.

---

#### Task 1.3 — Add error.tsx Cho Routes Quan Trọng (~2h)

**Vấn đề**: Lỗi crash toàn app không có fallback.

**Files cần tạo mới**:

```
frontend/src/app/courses/[slug]/error.tsx
frontend/src/app/hub/error.tsx
frontend/src/app/messages/error.tsx
frontend/src/app/admin/error.tsx
frontend/src/app/courses/[slug]/learn/error.tsx
frontend/src/app/ai/error.tsx
frontend/src/app/blog/[slug]/error.tsx
frontend/src/app/tech-trends/[slug]/error.tsx
```

**Template chuẩn** (`frontend/src/app/courses/[slug]/error.tsx`):
```tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CoursePage Error]', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center gap-4">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
      <p className="text-muted-foreground max-w-md">
        Không thể tải trang này. Vui lòng thử lại.
      </p>
      <Button onClick={reset} variant="default" className="gap-2">
        <RefreshCcw className="w-4 h-4" />
        Thử lại
      </Button>
    </div>
  );
}
```

**Verify**: Test bằng cách throw error trong page → phải thấy error boundary thay vì blank screen.

---

#### Task 1.4 — Setup Prisma Migration (~3h)

**Vấn đề**: Dùng `db push` → không có migration history, không rollback được.

**Step 1**: Tạo migration đầu tiên từ current schema

```bash
# Chạy local để generate migration file
npx prisma migrate dev --name init_schema
```

**Step 2**: Thêm vào `package.json` scripts:
```json
"db:migrate:prod": "prisma migrate deploy"
```

**Step 3**: Cập nhật GitHub Actions workflow — thay `prisma db push` bằng `prisma migrate deploy`:

```yaml
- name: Run database migrations
  run: npm run db:migrate:prod
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

**Step 4**: Backup DB hiện tại trước khi chạy migration lần đầu:
```bash
pg_dump -h $PGHOST -U $PGUSER -d $PGDB > backup_before_migrate_$(date +%Y%m%d).sql
```

**Verify**: `npx prisma migrate status` → phải show all migrations applied.

---

#### Task 1.5 — Add Database Indexes (~2h)

**File cần sửa**: `prisma/schema.prisma`

**Thêm vào cuối schema, trước `@@map` của từng model**:

```prisma
// SocialPost — cho feed pagination
model SocialPost {
  // ... existing fields ...

  @@index([visibility, createdAt(sort: Desc)])
  @@index([authorId, createdAt(sort: Desc)])
  @@map("social_posts")
}

// CourseOrder — cho admin/order list
model CourseOrder {
  // ... existing fields ...

  @@index([userId, status])
  @@index([status, createdAt(sort: Desc)])
  @@map("course_orders")
}

// Enrollment
model Enrollment {
  // ... existing fields ...

  @@index([userId, courseId], unique: true)
  @@index([courseId, enrolledAt(sort: Desc)])
  @@map("enrollments")
}

// MessageParticipant — cho inbox query
model MessageParticipant {
  // ... existing fields ...

  @@index([userId, lastReadMessageId])
  @@index([threadId, userId], unique: true)
  @@map("message_participants")
}

// Course — cho search/sort
model Course {
  // ... existing fields ...

  @@index([status, createdAt(sort: Desc)])
  @@index([instructorId, status])
  @@map("courses")
}

// SocialComment — cho comment list
model SocialComment {
  // ... existing fields ...

  @@index([postId, createdAt(sort: Desc)])
  @@map("social_comments")
}
```

**Sau đó chạy**:
```bash
npx prisma migrate dev --name add_performance_indexes
```

**Verify**: `EXPLAIN ANALYZE` trên query feed → index scan thay vì sequential scan.

---

#### Task 1.6 — Global Axios Timeout (~15ph)

**File cần sửa**: `frontend/src/lib/api.ts`

**Thêm sau axios instance creation**:
```typescript
axiosInstance.defaults.timeout = 15000; // 15s global timeout

// Hoặc per-request:
axiosInstance.get('/api/...', { timeout: 30000 }); // for large uploads
```

**Verify**: Kiểm tra trong DevTools → Network tab → requests có timeout config.

---

### Tuần 2 — Social Feed Pagination + AI Cache

---

#### Task 2.1 — Cursor Pagination Cho Social Feed (~4h)

**Files cần sửa**:
- `src/routes/social.routes.ts`
- `frontend/src/components/social/Feed.tsx`
- `src/types/index.ts` (thêm `CursorPaginationResponse` type)

**Lưu ý về cursor format**: Dùng **Base64-encoded JSON** thay vì `cursor.split('_')` với Unix timestamp number. Unix timestamp number (epoch ms) có thể bị lệch múi giờ giữa client/server hoặc mất precision khi serialize/deserialize. Base64 JSON giữ nguyên cấu trúc và timezone-agnostic.

**Backend changes** (`src/routes/social.routes.ts`):

```typescript
// Cursor format: base64(JSON({ createdAt: ISO_STRING, id: NUMBER }))
// VD: eyJjcmVhdGVkQXQiOiIyMDI2LTA2LTIyVDE1OjAwOjAwLjAwMFoiLCJpZCI6MTIzfQ==

function encodeCursor(createdAt: Date, id: number): string {
  return Buffer.from(JSON.stringify({
    createdAt: createdAt.toISOString(),
    id,
  })).toString('base64');
}

function decodeCursor(cursor: string): { createdAt: Date; id: number } | null {
  try {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
    return {
      createdAt: new Date(decoded.createdAt),
      id: decoded.id,
    };
  } catch {
    return null;
  }
}

// GET /api/v1/social/feed
router.get(
  '/feed',
  authenticate,
  [
    query('cursor').optional().isString().withMessage('Invalid cursor'),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  validate,
  async (req, res, next) => {
    const { cursor, limit = 20 } = req.query as {
      cursor?: string;
      limit: number;
    };

    // Parse cursor: Base64 JSON
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    const posts = await prisma.socialPost.findMany({
      where: {
        visibility: 'PUBLIC',
        // Cursor: lấy items mới hơn cursor
        ...(decodedCursor
          ? {
              OR: [
                { createdAt: { lt: decodedCursor.createdAt } },
                {
                  createdAt: decodedCursor.createdAt,
                  id: { lt: decodedCursor.id },
                },
              ],
            }
          : {}),
      },
      orderBy: [
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      take: limit + 1, // lấy 1 extra để check hasMore
      include: {
        author: { select: { id: true, username: true, avatarUrl: true, displayName: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });

    const hasMore = posts.length > limit;
    const items = hasMore ? posts.slice(0, -1) : posts;

    const nextCursor = hasMore && items.length > 0
      ? encodeCursor(items[items.length - 1].createdAt, items[items.length - 1].id)
      : null;

    res.json({
      success: true,
      data: {
        posts: items,
        nextCursor,
        hasMore,
      },
    });
  }
);
```

**Frontend changes** (`Feed.tsx` — dùng TanStack infinite query):

```typescript
// Feed.tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['social-feed'],
  queryFn: ({ pageParam }) => api.get(`/social/feed?cursor=${pageParam ?? ''}&limit=20`),
  getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
  initialPageParam: '',
});

const posts = data?.pages.flatMap(p => p.data.posts) ?? [];
```

**Verify**: Scroll feed 5+ pages → DevTools network không có memory growth. Cursor string phải là base64, không phải số timestamp.

---

#### Task 2.2 — AI RAG Redis Cache (~3h)

**File cần sửa**: `src/services/ai.service.ts` (hoặc `src/services/rag.service.ts`)

**Thêm cache layer**:

```typescript
import { redis } from '../config/redis.js';

// Thêm vào query embedding hoặc rag search method:
async function searchKnowledgeBase(query: string, userId: number) {
  const cacheKey = `rag:search:${createHash('sha256').update(query.toLowerCase().trim()).digest('hex')}`;

  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Vector search (existing logic)
  const results = await performVectorSearch(query);

  // Cache for 1 hour
  await redis.setEx(cacheKey, 3600, JSON.stringify(results));

  return results;
}
```

**Verify**: Query cùng câu 2 lần → lần 2 phải nhanh hơn đáng kể (Redis hit).

---

#### Task 2.3 — AI Chat Rate Limiting (~1h)

**File cần sửa**: `src/routes/ai.routes.ts`

**Thêm per-user rate limit**:

```typescript
import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis.js';

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id?.toString() ?? req.ip ?? 'unknown',
  store: new RedisStore({ client: redis, prefix: 'rl:ai:' }),
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu AI. Vui lòng chờ 1 phút.',
  },
});

// Áp dụng cho POST /ai/chat/stream
router.post('/chat/stream', authenticate, aiRateLimiter, /* ... */);
```

**Verify**: `for i in {1..35}; do curl ...; done` → request 31+ phải nhận 429.

---

#### Task 2.4 — Prisma N+1 Query Audit (~2h)

**Files cần audit**: `src/routes/social.routes.ts`, `src/routes/academy.routes.ts`, `src/routes/course.routes.ts`

**Pattern cần tìm và fix**:

```typescript
// ❌ BAD — N+1
const posts = await prisma.socialPost.findMany();
for (const post of posts) {
  post.author = await prisma.user.findUnique({ where: { id: post.authorId } });
}

// ✅ GOOD — single query với include
const posts = await prisma.socialPost.findMany({
  include: {
    author: {
      select: { id: true, username: true, avatarUrl: true, displayName: true }
    },
    _count: { select: { comments: true, likes: true } },
  },
});
```

**Commands để tìm N+1**:
```bash
grep -n "\.findMany\|findUnique" src/routes/*.ts
# Hoặc dùng Prisma Studio để xem query log
```

**Verify**: Bật Prisma query log, load 1 page của feed → chỉ có 1-3 queries, không phải 1 + N queries.

---

#### Task 2.5 — Backend Compression Middleware (~15ph)

**File cần sửa**: `src/index.ts` hoặc `src/app.ts`

```typescript
import compression from 'compression';

// Thêm sau các middleware khác:
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
}));
```

**Verify**: `curl -H "Accept-Encoding: gzip" -I https://api.cuongthai.com/api/v1/courses` → header `Content-Encoding: gzip`.

---

## GIAI ĐOẠN 2 — PERFORMANCE (Tuần 3-4)

---

### Tuần 3 — Metrics + Pagination + Socket.IO

---

#### Task 3.1 — Prometheus Metrics Endpoint (~2h)

**File mới**: `src/routes/metrics.routes.ts`

```typescript
import { Router } from 'express';
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5],
});
register.registerMetric(httpRequestDuration);

const router = Router();

router.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

export default router;
```

**Thêm vào `src/index.ts`**:
```typescript
import metricsRoutes from './routes/metrics.routes.js';
app.use(metricsRoutes);
```

**Verify**: `curl https://api.cuongthai.com/metrics` → Prometheus format output.

---

#### Task 3.2 — Message History Pagination (~2h)

**File cần sửa**: `src/routes/messages.routes.ts`

**Implement cursor pagination tương tự Task 2.1** cho:
- `/api/v1/messages/threads/:threadId/messages`
- `/api/v1/messages/inbox`

```typescript
router.get('/threads/:threadId/messages', authenticate, async (req, res) => {
  const { cursor, limit = 50 } = req.query;
  const threadId = parseInt(req.params.threadId);

  const messages = await prisma.message.findMany({
    where: { threadId },
    ...(cursor ? { cursor: { id: parseInt(cursor) }, skip: 1 } : {}),
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit as string) + 1,
    include: {
      sender: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const hasMore = messages.length > parseInt(limit as string);
  const items = hasMore ? messages.slice(0, -1) : messages;

  res.json({
    success: true,
    data: {
      messages: items.reverse(), // chronological order
      nextCursor: hasMore ? items[0].id.toString() : null,
    },
  });
});
```

---

#### Task 3.3 — Socket.IO Room Batch Join (~2h)

**File cần sửa**: `src/socket/messaging.socket.ts`

```typescript
// Tìm logic hiện tại: gọi socket.join() trong vòng for
// Thay bằng:

// Lấy tất cả thread IDs
const threads = await prisma.messageParticipant.findMany({
  where: { userId },
  select: { threadId: true },
});

const threadIds = threads.map(t => `thread:${t.threadId}`);

// Batch join
await Promise.all(threadIds.map(room => socket.join(room)));
```

**Verify**: User có 50+ threads → connect nhanh, chỉ 2 queries thay vì N+1.

---

#### Task 3.4 — Course Enrollment Pagination (~1h)

**File cần sửa**: `src/routes/academy.routes.ts`

**Implement pagination cho**: `GET /api/v1/academy/enrollments`

```typescript
const { page = 1, limit = 20 } = req.query;
const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

const [enrollments, total] = await prisma.$transaction([
  prisma.enrollment.findMany({
    where: { userId },
    skip,
    take: parseInt(limit as string),
    orderBy: { enrolledAt: 'desc' },
    include: { course: { select: { id: true, title: true, slug: true, thumbnailUrl: true } } },
  }),
  prisma.enrollment.count({ where: { userId } }),
]);

res.json({
  success: true,
  data: {
    enrollments,
    pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total, pages: Math.ceil(total / parseInt(limit as string)) },
  },
});
```

---

#### Task 3.5 — Vue/Nuxt-style Loading Skeletons (~3h)

**Files cần tạo**: Skeleton components cho từng page

```
frontend/src/components/skeletons/
  ├── PostCardSkeleton.tsx
  ├── CourseCardSkeleton.tsx
  ├── UserProfileSkeleton.tsx
  └── MessageThreadSkeleton.tsx
```

**Template** (`PostCardSkeleton.tsx`):
```tsx
export function PostCardSkeleton() {
  return (
    <div className="animate-pulse p-4 border rounded-lg space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-2 w-16 bg-muted rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-muted rounded" />
        <div className="h-3 w-3/4 bg-muted rounded" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-12 bg-muted rounded" />
        <div className="h-3 w-12 bg-muted rounded" />
      </div>
    </div>
  );
}
```

**Sử dụng trong page**:
```tsx
const { data, isLoading } = useQuery({ queryKey: ['feed'], queryFn: fetchFeed });

if (isLoading) {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => <PostCardSkeleton key={i} />)}
    </div>
  );
}
```

---

### Tuần 4 — VNPay + IPN + Receipt

---

#### Task 4.1 — VNPay Production Credentials (~1h)

1. Đăng ký tài khoản VNPay Merchant tại https://merchant.vnpay.vn
2. Lấy production credentials: `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`
3. Đặt trên VPS: thêm vào `/opt/cuonghoangdev/.env`:

```bash
VNPAY_SANDBOX=0
VNPAY_TMN_CODE=YOUR_PRODUCTION_TMN_CODE
VNPAY_HASH_SECRET=YOUR_PRODUCTION_HASH_SECRET
VNPAY_RETURN_URL=https://cuongthai.com/payment/return
VNPAY_IPN_URL=https://api.cuongthai.com/api/v1/payment/vnpay/ipn
```

4. Test với amount nhỏ (1000 VND) trước khi enable real money

---

#### Task 4.2 — IPN Retry Queue (~2h)

**File mới**: `src/services/ipn-queue.service.ts`

```typescript
import { redis } from '../config/redis.js';

const IPN_RETRY_KEY = 'ipn:retry:queue';
const MAX_RETRIES = 5;
const RETRY_DELAYS = [1000, 5000, 30000, 120000, 600000]; // 1s, 5s, 30s, 2min, 10min

export async function enqueueIpnRetry(ipnData: object) {
  const payload = JSON.stringify({ data: ipnData, attempts: 0 });
  await redis.rPush(IPN_RETRY_KEY, payload);
}

export async function processIpnQueue() {
  while (true) {
    const item = await redis.lPop(IPN_RETRY_KEY);
    if (!item) break;

    const { data, attempts } = JSON.parse(item);
    try {
      await processIpn(data);
    } catch (error) {
      if (attempts < MAX_RETRIES - 1) {
        const delay = RETRY_DELAYS[attempts] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1];
        setTimeout(async () => {
          await redis.rPush(IPN_RETRY_KEY, JSON.stringify({ data, attempts: attempts + 1 }));
        }, delay);
      } else {
        // Max retries reached — alert and log
        await logFailedIpn(data, error);
      }
    }
  }
}
```

**Thêm cron job** chạy mỗi phút:
```typescript
cron.schedule('* * * * *', () => {
  processIpnQueue().catch(console.error);
});
```

---

#### Task 4.3 — Payment Email Receipt (~1h)

**File cần sửa**: `src/services/payment/vnpay.service.ts` hoặc IPN handler

**Thêm sau khi order confirmed**:

```typescript
import { emailService } from './email.service.js';

async function sendPaymentReceipt(order: CourseOrder, user: User) {
  const items = await prisma.courseOrderItem.findMany({
    where: { orderId: order.id },
    include: { course: { select: { title: true } } },
  });

  await emailService.send({
    to: user.email,
    subject: `Thanh toán thành công — Đơn hàng #${order.id}`,
    html: renderPaymentReceiptHtml({ order, user, items }),
  });
}
```

**Template HTML**: Tạo file `src/templates/payment-receipt.html` với layout responsive.

---

#### Task 4.4 — Order Expiry Cron (~1h)

**File cần sửa**: `src/index.ts` hoặc cron service

```typescript
// Chạy mỗi 5 phút
cron.schedule('*/5 * * * *', async () => {
  const expiredOrders = await prisma.courseOrder.findMany({
    where: {
      status: 'PENDING',
      createdAt: { lt: new Date(Date.now() - 15 * 60 * 1000) }, // > 15 min
    },
  });

  await prisma.courseOrder.updateMany({
    where: { id: { in: expiredOrders.map(o => o.id) } },
    data: { status: 'EXPIRED' },
  });

  console.log(`[cron] Cancelled ${expiredOrders.length} expired orders`);
});
```

---

## GIAI ĐOẠN 3 — SECURITY (Tuần 5-6)

---

### Tuần 5 — 2FA + JWT Blacklist

---

#### Task 5.1 — User Model Update for TOTP (~1h)

**File cần sửa**: `prisma/schema.prisma`

**Thêm vào model User**:
```prisma
// TOTP 2FA
totpSecret     String?   @map("totp_secret") @db.VarChar(255)
totpEnabled    Boolean   @default(false) @map("totp_enabled")
totpVerifiedAt DateTime? @map("totp_verified_at")

// Audit fields
lastPasswordChangedAt DateTime? @map("last_password_changed_at")
```

**Chạy migration**:
```bash
npx prisma migrate dev --name add_totp_fields
```

---

#### Task 5.2 — 2FA Backend Routes (~4h)

**File mới**: `src/routes/twofa.routes.ts`

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// GET /api/v1/auth/2fa/setup — generate secret + QR
router.get('/2fa/setup', authenticate, async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `CuongHoangDev (${req.user.email})`,
    length: 20,
  });

  // Lưu tạm secret (chưa enable)
  await prisma.user.update({
    where: { id: req.user.id },
    data: { totpSecret: secret.base32 },
  });

  const qrCode = await QRCode.toDataURL(secret.otpauthURL!);

  res.json({
    success: true,
    data: {
      secret: secret.base32,
      qrCode,
    },
  });
});

// POST /api/v1/auth/2fa/verify — verify token + enable
router.post('/2fa/verify', authenticate, async (req, res) => {
  const { token } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user.totpSecret) {
    return res.status(400).json({ success: false, message: 'Chưa khởi tạo 2FA' });
  }

  const valid = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!valid) {
    return res.status(401).json({ success: false, message: 'Mã không hợp lệ' });
  }

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      totpEnabled: true,
      totpVerifiedAt: new Date(),
    },
  });

  res.json({ success: true, message: 'Đã bật xác minh 2 bước' });
});

// Cài đặt: npm install speakeasy qrcode
```

**Cập nhật login flow** (`auth.service.ts`):
```typescript
// Sau khi verify password thành công, kiểm tra 2FA
if (user.totpEnabled) {
  // Trả về yêu cầu 2FA token
  return { requires2FA: true, tempToken: generateTempToken(user.id) };
}

// Sau đó verify temp token + TOTP token ở /api/v1/auth/2fa/verify
```

---

#### Task 5.3 — Redis JWT Blacklist (~2h)

**File cần sửa**: `src/services/auth.service.ts` + `src/middleware/auth.ts`

**Thêm logout với blacklist**:
```typescript
// src/services/auth.service.ts
export async function logout(token: string): Promise<void> {
  const payload = jwt.decode(token) as JwtPayload;
  if (payload?.exp) {
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.setEx(`blacklist:${token}`, ttl, '1');
    }
  }
}

// src/middleware/auth.ts — kiểm tra blacklist
async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromCookie(req) ?? getTokenFromHeader(req);
  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  // Check blacklist
  const blacklisted = await redis.get(`blacklist:${token}`);
  if (blacklisted) {
    return res.status(401).json({ success: false, message: 'Token revoked' });
  }

  // Verify JWT...
}
```

---

#### Task 5.4 — Per-User API Rate Limiting (~2h)

**File mới**: `src/middleware/perUserRateLimit.ts`

```typescript
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

const perUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // 100 req/min per user
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id?.toString() ?? req.ip ?? 'unknown',
  store: new RedisStore({ client: redis, prefix: 'rl:user:' }),
  skip: (req) => req.path === '/health' || req.path === '/metrics',
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu. Vui lòng chờ.',
  },
});

export default perUserLimiter;

// Áp dụng global trong src/index.ts:
// app.use('/api/', perUserLimiter);
```

---

### Tuần 6 — Audit Log + Security Polish

---

#### Task 6.1 — Audit Log System (~3h)

**File mới**: `src/services/audit.service.ts` + migration

```typescript
// prisma/schema.prisma — thêm model
model AuditLog {
  id         Int       @id @default(autoincrement())
  userId     Int       @map("user_id")
  action     String    @db.VarChar(100)  // e.g. 'USER_ROLE_CHANGED', 'COURSE_DELETED'
  resource   String    @db.VarChar(100)  // e.g. 'User', 'Course'
  resourceId Int?      @map("resource_id")
  metadata   Json?
  ip         String?   @db.VarChar(64)
  userAgent  String?   @map("user_agent") @db.VarChar(500)
  createdAt  DateTime  @default(now()) @map("created_at")

  user       User      @relation(fields: [userId], references: [id])
  @@index([userId, createdAt(sort: Desc)])
  @@index([action, createdAt(sort: Desc)])
  @@map("audit_logs")
}

export async function audit(
  userId: number,
  action: string,
  resource: string,
  resourceId?: number,
  metadata?: Record<string, unknown>,
  req?: Request,
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      resource,
      resourceId,
      metadata: metadata ?? undefined,
      ip: req?.ip,
      userAgent: req?.headers['user-agent'],
    },
  });
}

// Sử dụng trong admin routes:
await audit(req.user!.id, 'USER_ROLE_CHANGED', 'User', targetUserId, {
  oldRole: 'USER',
  newRole: 'ADMIN',
}, req);
```

**Admin endpoint để xem audit log**:
```typescript
router.get('/admin/audit-logs', authenticate, requireAdmin, async (req, res) => {
  const { page = 1, action, userId } = req.query;
  // ... paginated audit log query
});
```

---

#### Task 6.2 — VNPay IP Allowlist Fix (~15ph)

**Lưu ý**: Không nên hardcode IP ranges của VNPay vào source code vì họ có thể thay đổi IP infrastructure mà không báo trước. Hardcode IP sẽ gây **false positive** — IPN bị reject dù checksum hoàn toàn hợp lệ, dẫn đến order stuck.

**Giải pháp đúng**: Bỏ IP allowlist, **chỉ dựa vào HMAC SHA512 checksum verification**. Chữ ký `vnp_SecureHash` đã cực kỳ an toàn — nếu hash mismatch → request bị reject. Không ai có thể forge được chữ ký mà không có secret key.

**File cần sửa**: `src/routes/payment.routes.ts`

```typescript
// VNPay IPN handler — KHÔNG kiểm tra IP allowlist
// Chỉ verify hash signature — đây là cách duy nhất và đủ an toàn
router.post('/vnpay/ipn', async (req, res) => {
  // Hash verification done by VNPay SDK — already validated before this handler
  // No IP checking needed

  const { vnp_ResponseCode, vnp_TxnRef, vnp_Amount } = req.body;

  // Standard VNPay response codes:
  // 00 = Success
  // 99 = Pending (retry)
  // Other = Failed
  if (vnp_ResponseCode === '00') {
    await processPaymentSuccess(vnp_TxnRef, vnp_Amount);
    return res.json({ RspCode: '00', Message: 'Confirm Success' });
  }

  if (vnp_ResponseCode === '99') {
    // Pending — enqueue for retry
    await enqueueIpnRetry(req.body);
    return res.json({ RspCode: '99', Message: 'Still Pending' });
  }

  return res.json({ RspCode: vnp_ResponseCode ?? '99', Message: 'Payment Failed' });
});
```

**Hoặc nếu muốn log IP để debug** (không block):
```typescript
// Log IP nhưng không block — chỉ dùng cho forensics
const clientIp = req.ip;
console.log(`[vnpay] IPN from IP: ${clientIp}`);
```

**Nếu thực sự cần IP allowlist** (trong trường hợp đặc biệt), đặt vào `.env` để dễ cập nhật:
```env
# .env — cập nhật khi VNPay thông báo thay đổi IP
VNPAY_IP_ALLOWLIST=203.171.20.0/24,123.30.235.0/24
```
```typescript
// Parse từ env
const allowedRanges = (process.env.VNPAY_IP_ALLOWLIST ?? '').split(',').filter(Boolean);
const isAllowed = allowedRanges.some(range => ipInCidr(clientIp, range));

if (!isAllowed) {
  console.warn(`[vnpay] IPN from non-allowlisted IP: ${clientIp}`);
  // Log nhưng vẫn xử lý nếu hash đúng
}
```

**Tóm tắt**: Hash signature (HMAC SHA512) là đủ. IP allowlist là optional defense-in-depth, nhưng phải để trong env, không hardcode.

---

#### Task 6.3 — Socket.IO CORS Fix (~15ph)

**File cần sửa**: `src/socket/index.ts` hoặc `src/index.ts`

```typescript
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://cuongthai.com'],
    credentials: true,
  },
});
```

---

## GIAI ĐOẠN 4 — INFRASTRUCTURE (Tuần 7-8)

---

### Tuần 7 — Backup + Logs

---

#### Task 7.1 — Automated Database Backup (~3h)

**Script mới**: `scripts/backup-db.sh`

```bash
#!/bin/bash
set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/postgres"
R2_BUCKET="cuonghoangdev-backups"

mkdir -p $BACKUP_DIR

# Daily backup
PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
  -h $POSTGRES_HOST \
  -U $POSTGRES_USER \
  -d $POSTGRES_DB \
  -F c \
  -f "$BACKUP_DIR/daily_$DATE.dump"

# Upload to R2
aws s3 cp "$BACKUP_DIR/daily_$DATE.dump" "s3://$R2_BUCKET/daily/daily_$DATE.dump"

# Keep only last 7 daily backups locally
cd $BACKUP_DIR && ls -t daily_*.dump | tail -n +8 | xargs -r rm

# Delete R2 backups older than 30 days
aws s3 ls "s3://$R2_BUCKET/daily/" | \
  while read -r line; do
    file_date=$(echo "$line" | awk '{print $1" "$2}' | tr -d '[:space:]')
    if [[ $(date -d "$file_date" +%s) -lt $(date -d "30 days ago" +%s) ]]; then
      aws s3 rm "s3://$R2_BUCKET/daily/$file_date.dump"
    fi
  done

echo "[backup] Completed at $DATE"
```

**Cron setup**:
```bash
# Trên VPS — thêm vào crontab
0 3 * * * /opt/scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

**Test**: Chạy script thủ công, verify backup file tạo ra + upload lên R2 thành công.

---

#### Task 7.2 — Monthly Restore Test (~1h)

**Script mới**: `scripts/test-restore.sh`

```bash
#!/bin/bash
# Restore test — chạy tháng 1 lần vào ngày mùng 1

LATEST_BACKUP=$(aws s3 ls s3://cuonghoangdev-backups/daily/ | sort | tail -n 1 | awk '{print $4}')
TEMP_DB="cuonghoangdev_test_restore"

# Download
aws s3 cp "s3://cuonghoangdev-backups/daily/$LATEST_BACKUP" /tmp/test_restore.dump

# Drop & recreate test DB
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "DROP DATABASE IF EXISTS $TEMP_DB"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $TEMP_DB"

# Restore
PGPASSWORD=$POSTGRES_PASSWORD pg_restore -h $POSTGRES_HOST -U $POSTGRES_USER -d $TEMP_DB /tmp/test_restore.dump

# Verify record count
TABLE_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $TEMP_DB -t -c "SELECT COUNT(*) FROM \"User\"")
echo "Restored $TABLE_COUNT users"

# Cleanup
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d postgres -c "DROP DATABASE $TEMP_DB"
rm /tmp/test_restore.dump
```

---

#### Task 7.3 — Nginx HTTP Fallback WS Headers (~30ph)

**File cần sửa**: `nginx/nginx.http.conf`

**Thêm vào `location /api/` block**:
```nginx
# WebSocket support
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
proxy_read_timeout 86400;
```

---

#### Task 7.4 — Docker Multi-Stage Build (~1h)

**Files cần sửa**: `Dockerfile` (backend)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodeuser -u 1001
USER nodeuser

EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

### Tuần 8 — Staging + Prometheus Dashboard

---

#### Task 8.1 — Staging Environment (~3h)

**Files cần tạo**:
- `.env.staging` (local dev)
- `.github/workflows/deploy-staging.yml`
- `docker-compose.staging.yml`

**`.env.staging`**:
```
NODE_ENV=staging
DATABASE_URL=postgresql://...
# Staging-specific: VNPAY_SANDBOX=1, DEBUG_EMAILS=true
```

**Workflow mới**: `deploy-staging.yml` — chạy khi push vào `develop` branch.

**Logic**: Staging deploy → test với real data → approve → merge vào `main` → production deploy.

---

#### Task 8.2 — Grafana Dashboard Setup (~2h)

**Sử dụng docker-compose addon**:

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
```

**prometheus.yml**:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cuonghoangdev-api'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
```

---

## GIAI ĐOẠN 5 — POLISH (Tuần 9-10)

---

### Tuần 9 — PWA + Focus Trap + Favicon

---

#### Task 9.1 — Next.js PWA (~3h)

```bash
cd frontend
npm install @ducanh2912/next-pwa
```

**`next.config.js`**:
```javascript
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 } },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: { expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 } },
      },
    ],
  },
});

module.exports = withPWA(nextConfig);
```

---

#### Task 9.2 — Focus Trap in Modals (~1h)

```bash
npm install focus-trap-react
```

**Tạo component** `frontend/src/components/ui/FocusTrap.tsx`:
```tsx
import { useEffect, useRef } from 'react';
import focusTrap from 'focus-trap';

export function FocusTrap({ children, active }: { children: React.ReactNode; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const trap = focusTrap(containerRef.current);
    trap.activate();
    return () => trap.deactivate();
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
}
```

---

#### Task 9.3 — Favicon + Open Graph Images (~1h)

```bash
# Tạo favicon SVG
# public/favicon.svg — logo của bạn dạng SVG

# Tạo Open Graph image
# public/og-image.png — 1200x630px
```

**Thêm vào `frontend/src/app/layout.tsx`**:
```tsx
export const metadata: Metadata = {
  openGraph: {
    title: 'CuongHoangDev',
    description: '...',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};
```

---

#### Task 9.4 — Upload Progress Bar (~2h)

**Component mới**: `frontend/src/components/ui/UploadProgress.tsx`

```tsx
export async function uploadWithProgress(
  file: File,
  endpoint: string,
  onProgress: (percent: number) => void
) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
    xhr.send(file);
  });
}
```

---

### Tuần 10 — AI Polish + Final Verification

---

#### Task 10.1 — AI Session Titles (~1h)

**File cần sửa**: AI chat — generate title từ first message

```typescript
// Trong tạo session mới:
const firstUserMessage = messages.find(m => m.role === 'user');
if (firstUserMessage) {
  // Gọi lightweight model hoặc truncate
  const title = firstUserMessage.content.slice(0, 60) +
    (firstUserMessage.content.length > 60 ? '...' : '');
  session.title = title;
}
```

---

#### Task 10.2 — AI Usage Tracking (~2h)

**Migration**:
```prisma
model AiUsage {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")
  model     String   @db.VarChar(100)
  inputTokens Int    @map("input_tokens")
  outputTokens Int   @map("output_tokens")
  costUsd   Decimal  @map("cost_usd") @db.Decimal(10, 6)
  createdAt  DateTime @default(now()) @map("created_at")

  user      User    @relation(fields: [userId], references: [id])
  @@index([userId, createdAt(sort: Desc)])
  @@map("ai_usages")
}
```

**Track sau mỗi AI call**:
```typescript
await prisma.aiUsage.create({
  data: {
    userId: user.id,
    model: 'deepseek-ai/deepseek-r1',
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    costUsd: calculateCost(usage), // theo bảng giá OpenRouter
  },
});
```

---

#### Task 10.3 — React.memo on List Items (~1h)

```tsx
const MemoizedPostCard = React.memo(PostCard);
// Trong map:
posts.map(post => <MemoizedPostCard key={post.id} post={post} />);
```

**Lưu ý**: Chỉ apply cho components render nhiều lần (>10 items).

---

## GIAI ĐOẠN 6 — VERIFICATION & DEPLOY (Tuần 11-12)

---

### Tuần 11 — Full System Test

---

#### Task 11.1 — Smoke Test Suite (~2h)

**File mới**: `scripts/smoke-test.ts`

```typescript
const BASE_URL = process.env.API_URL ?? 'https://api.cuongthai.com';

async function runSmokeTests() {
  const results = [];

  // 1. Health check
  results.push(await test('GET /health', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  }));

  // 2. Auth flow
  results.push(await test('POST /auth/login', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status}`);
    const { data } = await res.json();
    return data.token;
  }));

  // 3. Course list (public)
  results.push(await test('GET /academy/courses', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/academy/courses?limit=1`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  }));

  // 4. Payment IPN verification
  results.push(await test('VNPay IPN', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/payment/vnpay/ipn`, {
      method: 'POST',
      body: new URLSearchParams({ /* mock IPN data */ }),
    });
    // Should return 200 with RspCode
  }));

  // Print results
  console.table(results);
}

runSmokeTests();
```

---

#### Task 11.2 — Load Test (~1h)

```bash
# Dùng k6 (https://k6.io)
# scripts/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://api.cuongthai.com/api/v1/academy/courses?limit=20');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

---

#### Task 11.3 — Manual QA Checklist (~2h)

Kiểm tra từng feature:

```
Auth:
  [ ] Login với credentials đúng → redirect về dashboard
  [ ] Login với password sai → show error, không crash
  [ ] Register với password yếu → validate client-side
  [ ] Logout → token bị revoke, cannot access protected routes
  [ ] Refresh token hết hạn → auto redirect login

Academy:
  [ ] Xem course list → pagination works
  [ ] Enroll → tạo order → redirect VNPay
  [ ] VNPay return → enrollment created
  [ ] Watch lesson → progress updated
  [ ] Get certificate → PDF generated

Social:
  [ ] Tạo post → appears in feed
  [ ] Like/Comment → updates immediately
  [ ] Infinite scroll → no memory leak after 10 pages
  [ ] Delete post → removed from feed

AI:
  [ ] Send message → streaming response
  [ ] RAG search → relevant results
  [ ] Rate limit → 31st request blocked

Payment:
  [ ] Order tạo → IPN timeout → retry queue
  [ ] Pending order sau 15 min → auto expired
  [ ] Payment success → email receipt sent

Security:
  [ ] Invalid JWT → 401
  [ ] JWT blacklist → logout blocks token
  [ ] Rate limit → 429 response
  [ ] 2FA → valid TOTP required
```

---

### Tuần 12 — Final Deploy & Monitoring

---

#### Task 12.1 — VPS Resource Check (~30ph)

```bash
# Kiểm tra trên VPS
df -h                    # Disk space > 20%
free -h                  # RAM usage
docker stats --no-stream # Container resource usage
redis-cli info memory    # Redis memory < 80%
nginx -t                 # Nginx config valid
```

---

#### Task 12.2 — Sentry Verification (~30ph)

1. Login Sentry dashboard
2. Check recent errors — verify 0 critical errors
3. Verify Source Maps uploaded
4. Check performance tab — p95 latency < 2s
5. Test Sentry alert → verify email/Slack notification works

---

#### Task 12.3 — Final Pre-Deploy Checklist (~1h)

Chạy toàn bộ checklist trong `danh_gia_new.md` Section 5:

```
Pre-Deployment Checklist:
[ ] VNPay SANDBOX=0 on production ✓
[ ] npm run build passes ✓
[ ] docker compose config passes ✓
[ ] prisma migrate deploy passes ✓
[ ] Indexes created ✓
[ ] nginx -t passes ✓
[ ] SSL cert valid ✓
[ ] Backup chạy thành công ✓
[ ] Sentry sample events verified ✓
[ ] Health check → 200 ✓
[ ] Log rotation configured ✓
[ ] Disk > 20% free ✓
[ ] Redis memory < 80% ✓
[ ] Rate limits tested ✓
[ ] error.tsx added to all routes ✓
```

---

#### Task 12.4 — Production Deploy (~1h)

```bash
# 1. Backup current production
/opt/scripts/backup-db.sh

# 2. Pull latest code
git pull origin main

# 3. Run migrations
npm run db:migrate:prod

# 4. Rebuild containers
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# 5. Verify
curl -sI https://api.cuongthai.com/health
curl -sI https://cuongthai.com
curl -s https://api.cuongthai.com/metrics | head -5

# 6. Monitor logs for 10 minutes
docker logs -f cuonghoangdev_backend
docker logs -f cuonghoangdev_frontend
```

---

## BẢNG TỔNG HỢP — FILE CẦN SỬA/TẠO

| Task | File | Action |
|---|---|---|
| 1.1 | `.github/workflows/deploy-ghcr.yml` | Sửa |
| 1.2 | `src/services/payment/vnpay.service.ts` | Sửa |
| 1.3 | `frontend/src/app/*/error.tsx` (8 files) | Tạo mới |
| 1.4 | `prisma/migrations/`, `package.json` | Migration |
| 1.5 | `prisma/schema.prisma` | Sửa |
| 1.6 | `frontend/src/lib/api.ts` | Sửa |
| 2.1 | `src/routes/social.routes.ts`, `Feed.tsx` | Sửa |
| 2.2 | `src/services/ai.service.ts` | Sửa |
| 2.3 | `src/routes/ai.routes.ts` | Sửa |
| 2.4 | Multiple route files | Sửa |
| 2.5 | `src/index.ts` | Sửa |
| 3.1 | `src/routes/metrics.routes.ts` | Tạo mới |
| 3.2 | `src/routes/messages.routes.ts` | Sửa |
| 3.3 | `src/socket/messaging.socket.ts` | Sửa |
| 3.4 | `src/routes/academy.routes.ts` | Sửa |
| 3.5 | `frontend/src/components/skeletons/*` | Tạo mới |
| 4.1 | VPS `.env` | Sửa (manual) |
| 4.2 | `src/services/ipn-queue.service.ts` | Tạo mới |
| 4.3 | `src/services/email.service.ts` | Sửa |
| 4.4 | `src/index.ts` | Sửa |
| 5.1 | `prisma/schema.prisma` | Sửa |
| 5.2 | `src/routes/twofa.routes.ts` | Tạo mới |
| 5.3 | `src/services/auth.service.ts`, `src/middleware/auth.ts` | Sửa |
| 5.4 | `src/middleware/perUserRateLimit.ts` | Tạo mới |
| 6.1 | `prisma/schema.prisma`, `src/services/audit.service.ts` | Tạo mới |
| 6.2 | `src/routes/payment.routes.ts` | Sửa |
| 6.3 | `src/socket/index.ts` | Sửa |
| 7.1 | `scripts/backup-db.sh` | Tạo mới |
| 7.2 | `scripts/test-restore.sh` | Tạo mới |
| 7.3 | `nginx/nginx.http.conf` | Sửa |
| 7.4 | `Dockerfile` | Sửa |
| 8.1 | `.env.staging`, `docker-compose.staging.yml` | Tạo mới |
| 8.2 | `docker-compose.monitoring.yml`, `prometheus.yml` | Tạo mới |
| 9.1 | `next.config.js` | Sửa |
| 9.2 | `frontend/src/components/ui/FocusTrap.tsx` | Tạo mới |
| 9.3 | `frontend/src/app/layout.tsx`, `public/og-image.png` | Sửa/Tạo |
| 9.4 | `frontend/src/components/ui/UploadProgress.tsx` | Tạo mới |
| 10.1 | AI chat service | Sửa |
| 10.2 | `prisma/schema.prisma`, AI service | Sửa |
| 10.3 | `PostCard.tsx`, `CourseCard.tsx` | Sửa |
| 11.1 | `scripts/smoke-test.ts` | Tạo mới |
| 11.2 | `scripts/load-test.js` | Tạo mới |
| 12.1 | VPS manual check | Manual |
| 12.2 | Sentry dashboard | Manual |
| 12.3 | `danh_gia_new.md` Section 5 | Verify |
| 12.4 | Production deploy | Manual |

**Tổng: ~55 files cần thay đổi trong 12 tuần**

---

## THỜI GIAN ƯỚC TÍNH

| Giai đoạn | Tuần | Giờ/Tuần | Tổng |
|---|---|---|---|
| 1. Stabilize | 1-2 | 8-10h | ~18h |
| 2. Performance | 3-4 | 6-8h | ~14h |
| 3. Payments | 5-6 | 6-8h | ~14h |
| 4. Security | 7-8 | 6-8h | ~14h |
| 5. Infrastructure | 9-10 | 5-7h | ~12h |
| 6. Polish + Verify | 11-12 | 5-6h | ~11h |
| **TỔNG** | **12 tuần** | | **~83h** |

> ~7 tiếng/tuần = ~1 tiếng/ngày làm việc

---

*Lộ trình này được thiết kế để thực hiện tuần tự. Các task trong cùng tuần có thể làm song song. Sau mỗi giai đoạn, nên deploy lên production để verify.*
