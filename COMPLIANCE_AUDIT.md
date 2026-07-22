# COMPLIANCE_AUDIT.md — cuongthai.com

**Audit type:** Read-only compliance audit for a Vietnamese e-commerce website notification
("thông báo website thương mại điện tử") to the Ministry of Industry and Trade (MOIT / Bộ Công Thương)
via online.gov.vn.

**Scope:** A government reviewer will manually visit the live site and compare it against the
submitted declaration. This audit finds anything that would cause rejection or create legal risk.

**Date:** 2026-07-13
**Method:** Static source inspection only. **No files were modified, no migrations run, no builds emitted.**
Type checks were run with `--noEmit` (write nothing).

---

## Executive summary

| Area | Verdict |
|------|---------|
| Part 1 — Required policy pages | 🔴 **All 5 missing** — the single biggest blocker |
| Part 2 — Purchase flow | 🟢 Real, complete, automated (PayOS + VNPay fallback) |
| Part 3 — Route inventory / authz | 🔴 One unauthenticated admin API; 🟡 middleware gaps |
| Part 4 — Data privacy (NĐ 13/2023) | 🔴 Unauth PII/enumeration endpoint; 🔴 no erasure/export |
| Part 5 — Content risk (music) | 🔴 yt-dlp re-hosts copyrighted YouTube audio on own CDN |
| Part 6 — Production health / secrets | 🟢 Secrets clean, HTTPS/HSTS solid, type checks pass |

**The submission is NOT ready.** The purchase flow itself is genuinely working and will demo well —
but the five mandatory policy pages do not exist, seller identity is incomplete, and there are
concrete legal/security exposures (unauthenticated admin API, unauth PII lookup, copyrighted-audio
re-hosting) that a reviewer or a later complaint could act on.

---

# 🔴 BLOCKERS — will cause rejection or legal risk

## B1. None of the 5 required policy pages exist (Part 1)

A MOIT notification requires these to exist as **public, linkable pages, reachable without login,
and linked from the footer on every page**. None exist as real routes. There are no route
directories for `/chinh-sach`, `/policy`, `/terms`, `/privacy`, `/huong-dan`, `/shipping`,
`/refund`, or `/return` (the only `payment` routes are VNPay callbacks).

| Required page | Status | Closest existing content |
|---|---|---|
| Hướng dẫn mua hàng | ❌ Missing | Per-product, often-empty tab `frontend/src/components/shop/ProductDetailTabs.tsx:115` ("Hướng dẫn & Bảo hành"), empty fallback at `:298-301` |
| Chính sách thanh toán | ❌ Missing | No written policy anywhere; only functional checkout logic |
| Chính sách giao hàng | ❌ Missing (fragment) | One modal line `frontend/src/components/shop/DigitalShopTermsGate.tsx:11` ("Giao hàng tự động, tức thì") |
| Chính sách đổi trả & hoàn tiền | ❌ Missing (fragment) | One modal bullet `DigitalShopTermsGate.tsx:14` (no-refund for digital) |
| Chính sách bảo mật thông tin | ❌ Missing | Footer link exists but points to `href="#"` — `frontend/src/components/home/Footer.tsx:20` |

**Footer:** `frontend/src/components/home/Footer.tsx:19-22` — "Chính sách bảo mật" → `#` and
"Điều khoản dịch vụ" → `#` are dead placeholder links. No policy page is linked to real content.

**The only consolidated policy text** is `DigitalShopTermsGate.tsx` — a 5-bullet, localStorage-gated
modal ("Điều khoản sử dụng — Hàng số", `:69`). Once a visitor clicks "Đồng ý" it sets
`digital_shop_terms_v1` and never shows again (`:30,:37`). It has no URL, cannot be linked or cited
in a submission, and is far too thin.

**Why it matters:** These pages are a hard requirement of the online.gov.vn declaration. A reviewer
who clicks the footer will hit `#` dead links. This alone causes rejection.

**Fix (described):** Create 5 real public pages (e.g. under `frontend/src/app/chinh-sach/*` or a
`/(legal)` route group), write substantive Vietnamese content for each (the delivery page must
explain digital-access delivery: access granted immediately after PayOS success, visible in
"Đơn hàng của tôi"), and wire real footer links replacing the `href="#"` placeholders.

## B2. Seller identity/contact is incomplete for MOIT (Part 1)

Publicly visible today: brand name "CuongHoang" (not a legal person/company name), email, phone/Zalo,
and city "Hà Nội, Việt Nam".
- Footer: `frontend/src/components/home/Footer.tsx:137-146` (email + "Hà Nội, Việt Nam", no phone/address)
- Navbar (all pages): `frontend/src/components/layout/Navbar.tsx:248-253` (phone `+84399360938`, Zalo, email)
- Home contact: `frontend/src/components/home/ContactSection.tsx:54,65,75`

**Missing:** full legal name of the seller (individual or business), complete street address, and
business/tax registration number (if a registered business). MOIT expects a real identifiable seller.

**Fix:** Add a public seller-info block (full name, full address, phone, email, and registration/tax
number if applicable). Vietnamese law for individuals selling online requires at least a real name
and contact address on the site.

## B3. `GET /api/v1/admin/reports` is completely unauthenticated (Part 3)

`src/routes/admin.reports.routes.ts` — `GET /` (`:19`), `GET /stats` (`:32`), `POST /:id/resolve`
(`:43`) have **no** `authenticate` / `requireAdmin`. A comment (lines 10-12) claims auth is "applied
upstream by the parent router", but `src/index.ts:523` mounts it as
`app.use('/api/v1/admin/reports', adminReportsRoutes)` with no upstream middleware.

**Impact:** Any anonymous caller can list the moderation/report queue, read stats, and resolve
reports. This is a live authorization bug (matches this project's prior history of `/admin/*` routes
missing `requireAdmin`).

**Fix:** Add `router.use(authenticate, requireAdmin('ROLE_ADMIN'))` to this router.

## B4. Unauthenticated PII lookup + user enumeration via `GET /api/v1/auth/role` (Part 4)

`src/routes/auth.routes.ts:271` — `GET /auth/role?email=<plaintext email>` has **no** `authenticate`
middleware. `getRoleByEmail` (`src/services/auth.service.ts:488-513`) returns `username`, `email`,
`primaryRole`, `roleVersion`, and `emailVerified` for **any** email supplied.

**Impact:** (a) anonymous user enumeration and cross-account info disclosure; (b) the email travels in
the query string, so it is written to nginx/express access logs. This is the most concrete personal-
data leak found — directly relevant to Nghị định 13/2023.

**Fix:** Require authentication, don't return other users' data, and move the email out of the query
string (POST body) — or remove the endpoint.

## B5. No self-service data erasure or export — Nghị định 13/2023 data-subject rights (Part 4)

The only `prisma.user.delete` is admin-only (`src/routes/admin.routes.ts:736`) and is further blocked
so **only unverified accounts can be deleted** (`emailVerified` guard, `:700-707`). A normal verified
user has **no path** to delete their account or data, and there is **no data-export endpoint**.

**Impact:** Nghị định 13 (Điều 9/16) grants data subjects the right to deletion and access. Also:
order tables (`ShopOrder.user` uses `SetNull`, `prisma/schema.prisma:1184`; `CourseOrder`) retain
buyer PII (name/email/phone/address) even after any account removal, and `lastLoginIp` /
`lastLoginUserAgent` are retained indefinitely with no retention policy.

**Fix:** Add self-service account-deletion + data-export flows; define retention windows for login
IP/user-agent and for order PII; document all of this in the privacy policy (B1 #5).

## B6. yt-dlp re-hosts copyrighted YouTube audio on the site's own CDN (Part 5)

`src/services/youtubeAudio.service.ts` downloads the best audio stream of a YouTube video with
`yt-dlp` (`-f bestaudio/best -x --audio-format mp3`), transcodes to mp3, and uploads it to Cloudflare
R2 (`:142-186`). The file's own header comment admits it: *"downloading YouTube audio is against
YouTube's ToS"* (`:19-20`). yt-dlp is baked into production: `Dockerfile.backend:82-88`.

- Trigger: `POST /api/v1/music/tracks/:id/download-audio` (`src/routes/music.routes.ts:596-652`,
  admin-gated). After download, `markTrackDownloaded` (`src/services/music.service.ts:868`) sets
  `localPath` to the R2 key and nulls `audioUrl`, so the track then streams as **first-party audio
  from the site's own CDN** (`buildAudioUrl`, `music.service.ts:152` → public R2 URL).
- Access-gate gap: the 3-tier gate (`src/services/musicAccess.service.ts`, default `ADMIN_ONLY`) is
  only checked by `GET /music/access`. The actual data route `GET /music/tracks`
  (`music.routes.ts:100-102`) uses `optionalAuth` and does **not** call `canAccessMusic`, and the R2
  URLs are public — so the re-hosted mp3s are retrievable by URL regardless of the configured mode,
  and become openly public if an admin switches the mode to `EVERYONE`.
- Secondary: `POST /music/admin/youtube-import` (`music.routes.ts:1087`) is gated by `authenticate`
  **only, not** admin — any logged-in user can create YouTube-backed tracks.

**Impact:** This is unauthorized reproduction and public redistribution of copyrighted sound
recordings from the site's own infrastructure — materially higher legal exposure than an embedded
YouTube player. This is a poor thing to have live on a site being formally registered with a
government body.

**Fix:** Remove the download-to-R2 pipeline (and yt-dlp from the image) or restrict the music module
to genuinely self-owned/licensed audio; enforce `canAccessMusic` server-side on `/music/tracks`;
lock `/music/admin/youtube-import` behind `requireAdmin`.

---

# 🟡 SHOULD FIX — weakens the application

## S1. `/api/v1/music/admin` upload is auth-only, not admin-only (Part 3)
`src/routes/music-admin.routes.ts:43` — `POST /` uses only `authenticate`. Any logged-in user can
upload/create music tracks despite the "admin" path. Add `requireAdmin('ROLE_ADMIN')`.

## S2. Middleware protects a path that doesn't exist; real learn pages are unguarded on the frontend (Part 3)
`frontend/src/middleware.ts` matches `/learn/:path*`, but there is no `/app/learn` directory. The
actual gated pages are `frontend/src/app/courses/[slug]/learn/page.tsx` and
`frontend/src/app/academy/courses/[slug]/learn/page.tsx` — neither is matched and neither has a
client guard. Content gating depends entirely on the backend course API (`requireCourseAccess`,
`src/routes/course.routes.ts:47-163`, which is currently correct). Add matchers
`/courses/:slug/learn` and `/academy/courses/:slug/learn` for defense-in-depth.

## S3. IDOR on certificate lookup (Part 4)
`src/routes/certificate.routes.ts:127-142` — `GET /api/v1/certificates/enrollment/:id`
(`optionalAuth`) does `findUnique({ where: { enrollmentId } })` with no ownership check and returns
the full certificate row. Iterating `enrollmentId` reveals who holds which certificate. Add an
ownership/auth check. (Note: public certificate *verification by number* at `/certificates/[number]`
is intended and fine.)

## S4. JWT accepted in query string (Part 4)
`src/middleware/auth.ts:199-200` accepts the JWT from `req.query.token` (for SSE). Bearer tokens in
query strings get written to server/proxy logs. Scope this strictly to the SSE route or use a
short-lived token.

## S5. `/finance/*` and a few private pages have no frontend guard (Part 3)
`/finance/*` (financial data) relies 100% on backend `authenticate`
(`src/routes/finance.routes.ts:33`) with no middleware/client guard — correct today but zero defense-
in-depth; one backend regression exposes private financial data. Same pattern (backend-only) for
`/saved`, `/settings/notifications`, `/cart`, `/checkout`. Consider adding these to the middleware
auth matcher.

## S6. Dead, misnamed `NEXT_PUBLIC_REVALIDATE_SECRET` (Part 6)
`frontend/src/app/admin/shop/page.tsx:21` declares
`const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? ''`. Currently harmless (the
var is unset and the const is never used; real auth uses server-only `REVALIDATE_SECRET` in
`frontend/src/app/api/revalidate/route.ts`), but a `NEXT_PUBLIC_*` secret is baked into the browser
bundle — if anyone ever sets it, it ships to the client. Delete the dead line.

## S7. Email/PII in localStorage and in some logs (Part 4)
`frontend/src/store/authStore.ts:54,75` (and `oauth-callback/page.tsx:96`) write a `user` object
(email + username + avatar + roles) to `localStorage` (XSS-readable; not credentials — the JWT is
correctly kept out of storage and in an httpOnly cookie). Registration/email events log the email
address (`auth.service.ts:244,277,284`). Low severity; note and minimize.

## S8. Unsplash / YouTube third-party media (Part 5)
Hardcoded Unsplash image URLs `frontend/src/types/games.ts:57-149` (permissive license but hotlinked)
and YouTube IFrame embeds in projects/social/post-music. IFrame embedding is lower risk than B6, but
ensure any user-generated embeds have a takedown path.

---

# 🟢 OK — verified compliant

## G1. Purchase flow is real, automated, and complete (Part 2)
Public course listing → detail → **"Mua ngay"** → PayOS hosted checkout (VNPay automatic fallback) →
**signature-verified server webhook** that atomically marks the order PAID, creates the enrollment,
and emails a receipt — with amount-integrity and idempotency guards, plus a webhook-independent
status-poll safety net.
- Buy handler: `frontend/src/app/courses/[slug]/CoursePageClient.tsx:402-431`
- PayOS create: `src/routes/payment.routes.ts:712`; PayOS webhook (HMAC-verified): `:804`;
  `markCourseOrderPaidAndEnroll` (`:659`) does the real access grant via `enrollment.upsert(source:'PAID')`
- VNPay IPN (HMAC-SHA512, amount-checked): `:893/:1069`; reconcile-on-poll: `:1076/:1130`
- **No "contact admin to buy" / manual-purchase / free-enroll backdoor exists.** Free enroll is hard-
  gated (402 on paid courses, `src/routes/course.routes.ts:1697-1703`); activation codes and admin
  grant/refund are legitimate and properly admin-gated.

## G2. Pricing is public and in VND (Part 2)
`Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND' })` on public listing/detail pages
(`frontend/src/components/course/CourseCard.tsx:21`, `CoursePageClient.tsx:77,248`;
`frontend/src/lib/utils.ts:97`). Free shown as "Miễn phí".

## G3. Passwords securely hashed (Part 4)
**bcrypt** (`bcryptjs`), **cost factor 12** (`src/services/auth.service.ts:12`), applied on register/
change/reset; `bcrypt.compare` verification with constant-time anti-enumeration dummy compare; strong
password policy (≥12 chars, mixed classes). No plaintext anywhere. OAuth accounts store `password=null`.

## G4. No card data stored (Part 4)
Payment is via VNPay/PayOS redirect; only transaction references kept (`paymentTxnNo`, `paymentBankCode`,
`idempotencyKey`). No raw PAN/card data in the schema.

## G5. Cross-user scoping is mostly correct (Part 4)
Hub, dashboard, messages, course orders, shop orders, certificates (list), saved codes, and finance
all filter by the authenticated `userId` or assert participant/ownership before returning data. Shop
order-by-code deliberately returns a minimal no-PII shape to non-owners (`src/routes/shop.routes.ts:1254-1276`).
(Exceptions flagged in B4 and S3.)

## G6. No secrets committed to git; strong .gitignore (Part 6)
`git ls-files` shows only `.env.example`/template files. Real `.env` / `frontend/.env.local` are
untracked and never were tracked. `.gitignore:11-14` covers env files, key files, credential files;
`.gitleaks.toml` present. No hardcoded secrets found in source (all via `process.env`). `NEXT_PUBLIC_*`
vars are all safe public values (see S6 for the one dead exception). *Note: live secrets exist in the
untracked local `.env` in plaintext on this machine — fine for git, standard for local dev.*

## G7. HTTPS / HSTS / secure cookies / CSP (Part 6)
- HTTP→HTTPS 301 redirect `nginx/nginx.conf:101,111-112`; TLS `:117-123`;
  HSTS `max-age=63072000; includeSubDomains; preload` `:132`.
- `helmet` on backend (`src/index.ts:52,184`), proxy-aware `trust proxy` (`:157`).
- Auth cookies `httpOnly:true`, `secure` in production, `sameSite:'lax'`
  (`src/routes/auth.routes.ts:37-39,82-84,181-183,220-222`).
- `frontend/next.config.js`: CSP with `upgrade-insecure-requests`, X-Frame-Options SAMEORIGIN,
  nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP.

## G8. Build config sound; type checks pass (Part 6)
`frontend/next.config.js`: `typescript.ignoreBuildErrors:false`, `eslint.ignoreDuringBuilds:false`
(errors NOT suppressed). Backend + frontend `tsconfig` both `strict:true`.
**`npx tsc --noEmit` passes clean (exit 0) for both backend and frontend.** (The full
`next build` was not run, to honor the read-only constraint; type checks emit nothing and are safe.)

## G9. Admin routes (other than B3) are guarded (Part 3)
`admin.routes.ts`, `techTrends` admin, `content.routes.ts`, `myLanguage` admin, `songs` admin,
`messages` admin, `embedJobs` all apply `authenticate + requireAdmin/requireRole`. Frontend `/admin/*`
and `/creator/*` are gated by `frontend/src/middleware.ts` plus a client re-check in
`frontend/src/app/admin/layout.tsx`. (Exceptions: B3 `/admin/reports`, S1 `/music/admin`.)

---

# Prioritized action list (for when you decide to fix)

**Must fix before submitting to MOIT:**
1. B1 — build the 5 policy pages + real footer links
2. B2 — add full seller identity (name, address, registration no.)
3. B3 — authenticate `/api/v1/admin/reports`
4. B4 — authenticate `/api/v1/auth/role`, remove email-in-query
5. B6 — remove/scope the yt-dlp audio re-hosting before the site is under a government spotlight

**Strongly recommended (legal + security):**
6. B5 — account deletion + data export + retention policy (NĐ 13)
7. S1, S3 — close the remaining authz gaps (music upload, certificate IDOR)

**Cleanup / defense-in-depth:** S2, S4, S5, S6, S7, S8.

---

*Every finding above is sourced to `file:line`. No source, config, or migration was changed in
producing this report. Decide what to fix; nothing was applied.*
