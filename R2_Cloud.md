# ☁️ R2 (Cloudflare) — Bug log + Fix log

> **Mục đích:** Ghi lại toàn bộ bug liên quan tới Cloudflare R2 (storage ảnh + nhạc) mà dự án `cuongthai.com` đã gặp, nguyên nhân gốc, và cách fix. File này là "bộ nhớ" để khi AI/người mới vào dự án đọc là hiểu ngay cả flow lẫn những cạm bẫy đã biết.

---

## 🎯 TL;DR

| Lần | Triệu chứng | Root cause | Fix |
|-----|-------------|------------|-----|
| **#1** | Ảnh upload lên nhưng trả về 403 khi browser load | R2 bucket không có CORS policy | Không dùng R2 public URL trực tiếp cho `<audio>`; route audio qua backend stream endpoint |
| **#2** | Track R2 không phát được khi dùng audio visualizer (`crossOrigin="anonymous"`) | R2 không có `Access-Control-Allow-Origin` | Backend proxy bytes từ R2 → browser (`/api/v1/music/stream/:id`) |
| **#3** | `audioUrl = null` cho track upload trước khi wire field | DB cột `localPath` còn lưu R2 key, code frontend chỉ đọc `audioUrl` | Backfill `audioUrl` từ `localPath` ở list/get handler (commit `ad7cb78`) |
| **#4** | CSP block tải media từ `https://media.cuongthai.com` | CSP `connect-src`/`media-src` chưa allow R2 host | Thêm R2 host vào allowlist (commit `a61ff66`) |
| **#5** | Stream endpoint cũ `redirect(302)` sang R2 — vẫn fail vì crossOrigin | Logic cũ: 302 sang R2 direct URL, không có CORS | Sửa stream endpoint → **proxy bytes** thay vì redirect (commit `bbe6429`) |
| **#6** | Deploy workflow dùng GHCR bị conflict container, site down 9 phút | Sai workflow — dùng rsync thay vì CI | Dùng rsync + `deploy-vps.sh` (theo `DEPLOY-FASTER.md`) |
| **#7** | `GET /api/v1/music/stream/:id` cho YouTube track trả 500 với `NoSuchKey` | Backend `getStreamOptions` cố `R2StorageProvider.readStream("https://www.youtube.com/...")` — không phải R2 key | Trả 400 với `code: "EXTERNAL_SOURCE"` cho file bắt đầu bằng `http://` / `https://` |
| **#8** | Ảnh hiển thị blank trên trình duyệt dù `curl` trả 200, CSP `img-src` không chứa `*.r2.dev` | `R2_PUBLIC_URL` server đổi sang `pub-*.r2.dev` nhưng CSP trong `next.config.js` chưa update | Thêm `https://*.r2.dev` vào `img-src`, `connect-src` và `images.remotePatterns`; sync CSP mỗi khi `R2_PUBLIC_URL` thay đổi |

---

## 🧠 Kiến thức nền về stack

### Cloudflare R2 trong dự án này

| Mục | Giá trị |
|-----|---------|
| **Bucket** | `cuongthai-media-storage` |
| **Public URL** | `https://media.cuongthai.com` (custom domain trỏ về R2 public bucket) |
| **Endpoint (S3 API)** | `https://e8105049f41b90209104afb5911d84b2.r2.cloudflarestorage.com` |
| **Region** | `auto` |
| **Env vars** | `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ENDPOINT_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_REGION` |
| **Library** | AWS SDK v3 (`@aws-sdk/client-s3`) |

### Vì sao cần R2?

- **Trước:** Upload vào `/opt/cuonghoangdev/uploads` (host SSD), serve qua nginx alias.
  - Vấn đề: VPS SSD giới hạn, backup lớn, không scale.
- **Sau:** Upload lên R2 (object storage không giới hạn), serve qua custom domain `media.cuongthai.com`.
  - Lợi: rẻ (10GB free), CDN Cloudflare, không lo disk VPS đầy.
  - Code: `src/storage/R2StorageProvider.ts` (production) + `LocalStorageProvider.ts` (dev fallback).

### Code abstraction

File `src/storage/StorageProvider.ts` quy định interface chung:

```ts
interface StorageProvider {
  upload(key, buffer, contentType): Promise<StoredObject>;
  delete(key): Promise<void>;
  getReadStream(key): Readable;        // ← quan trọng cho stream proxy
  buildPublicUrl(key): string;
  // ...
}
```

`getStorageProvider()` factory chọn R2 hay Local dựa trên env. **Nếu thiếu bất kỳ R2 env var nào → fallback Local** (chỉ OK cho dev, production PHẢI có đủ).

---

## 🐛 BUG #1 — Ảnh upload lên R2 nhưng browser load 403

**Thời gian:** Trước 2026-06-17 (pre-R2 era + early R2 era)

### Triệu chứng
- User upload ảnh avatar / cover playlist / course thumbnail thành công, URL trong DB trỏ về `https://media.cuongthai.com/...`
- `<img src="https://media.cuongthai.com/...">` ở frontend → 403 / blocked
- DevTools console: `Failed to load resource: ... net::ERR_BLOCKED_BY_RESPONSE`

### Root cause
**R2 bucket KHÔNG có CORS policy.** Browser fetch từ `https://cuongthai.com` sang `https://media.cuongthai.com` → cross-origin request → cần CORS headers (`Access-Control-Allow-Origin`), R2 trả về không có → browser block.

### Tại sao không fix bằng cách add CORS vào R2 bucket?
- R2 access token hiện tại **không có permission `s3:PutBucketCORS`**.
- Dashboard Cloudflare R2 phải vào thủ công từ trình duyệt (không phải API).
- Owner dự án (Cường) chưa setup xong.

### Workaround hiện tại
- Dùng R2 public URL trong `<img>` (cover, thumbnail, avatar) — **OK vì `<img>` không trigger CORS preflight**, browser vẫn load được.
- **KHÔNG dùng R2 public URL trong `<audio>`** kèm `crossOrigin="anonymous"` (cần cho visualizer) — sẽ fail.

### Bài học
- Custom domain R2 CDN không tự set CORS — phải cấu hình thủ công ở dashboard.
- `<img>` cross-origin thì sao? Browser KHÔNG block vì không có Web Audio / Canvas API reading bytes.
- `<audio>` / `<video>` + `crossOrigin="anonymous"` = bắt buộc CORS đầy đủ.

---

## 🐛 BUG #2 — Track R2 không phát được (audio visualizer)

**Thời gian:** 2026-06-17 → 2026-06-18

### Triệu chứng
- Track R2 hiển thị đúng trong playlist, đúng bìa, đúng title.
- Click play → `<audio>` không load được, console: `MEDIA_ERR_SRC_NOT_SUPPORTED` hoặc CORS error.
- Nếu tắt visualizer (set `crossOrigin = null`) thì play OK — nhưng mất visualizer.

### Root cause
1. `MusicAudioController.tsx` tạo `<audio>` với `crossOrigin="anonymous"` (cần thiết cho `AnalyserNode` của Web Audio API đọc frequency data → visualizer).
2. `crossOrigin="anonymous"` trigger CORS check trên **byte stream**, không chỉ header.
3. R2 không trả `Access-Control-Allow-Origin` → browser block.

### Cách giải quyết các phương án

| Phương án | Trade-off |
|-----------|-----------|
| A. Add CORS vào R2 bucket | Cần dashboard access, chưa có permission |
| B. Tắt visualizer (`crossOrigin = null`) | Mất tính năng chính |
| C. **Route audio qua backend proxy** ✅ | 1 hop extra, nhưng đơn giản & ổn định |

→ Chọn **C**.

### Fix
File `frontend/src/lib/utils.ts` → `getMediaUrl()`:

```ts
// (1) R2 key → backend stream endpoint (proxy, không redirect)
if (
  lp &&
  !lp.startsWith('/') &&
  !lp.startsWith('uploads/') &&
  !lp.startsWith('http')
) {
  if (trackId != null) {
    return `${apiBase}/api/v1/music/stream/${trackId}`;  // ← proxy
  }
  return `${cdnBase}/${lp}`;  // fallback (chỉ cho <img>)
}
```

Backend `src/routes/music.routes.ts` → `getStreamOptions()`:

```ts
// Trước: return { redirect: r2SignedUrl }
// Sau:  return { streamResult: { contentType, contentLength, stream, acceptRanges, contentRange } }
```

Backend pipe `r2ReadStream` qua `res` thay vì redirect. Backend đã có CORS middleware → response hợp lệ cho browser.

**Commit:** `bbe6429 fix(music): route audio through backend stream endpoint (CORS)`

### Trade-off chấp nhận
- 1 extra hop qua Node.js mỗi lần play (cost: ~50ms cold, không đáng kể).
- Backend phải handle Range requests + 206 Partial Content (đã có sẵn từ trước).
- Throughput giảm một chút (so với R2 CDN) — không vấn đề cho workload music.

---

## 🐛 BUG #3 — `audioUrl = null` cho track upload trước

**Thời gian:** 2026-06-18 (phát hiện sau khi fix #2)

### Triệu chứng
- Track R2 cũ (upload trước khi `audioUrl` field được wire) → API trả về `audioUrl: null, localPath: "audio/songs/xxx.mp3"`.
- Frontend `getMediaUrl(null, localPath, id)` → check case (1) "R2 key" → CẦN `trackId` để build stream URL.
- Nhưng một số list endpoint **không include track ID trong payload** (hoặc include nhưng chưa wire) → fallback case (4) → vẫn OK.
- Vấn đề thật: **list payload không đủ field**. `localPath` được include, `audioUrl` null → frontend `getMediaUrl` chạy case (4) trả về `${apiBase}/api/v1/music/stream/${trackId}` (trackId có). OK.

### Root cause
Sau khi migrate sang R2, `localPath` field trong DB vẫn được dùng để lưu R2 key (vestige của design cũ). Nhưng frontend player **chỉ đọc `audioUrl`**. Track upload qua R2 có `localPath` set, `audioUrl` = null → không play.

### Fix
Backend `src/services/music.service.ts` → thêm helper `buildAudioUrl(audioUrl, localPath)`:

```ts
function buildAudioUrl(audioUrl, localPath) {
  if (audioUrl) return audioUrl;  // YouTube, full URL, etc.
  if (!localPath) return null;
  // R2 key: không prefix '/', 'uploads/', 'http'
  const isR2Key = !localPath.startsWith('/') &&
                  !localPath.startsWith('uploads/') &&
                  !localPath.startsWith('http://') &&
                  !localPath.startsWith('https://');
  if (!isR2Key) return null;
  // Build canonical R2 public URL
  return `${config.r2.publicUrl}/${localPath}`;
}
```

`getTracks()` và `getTrackById()` gọi helper này để backfill `audioUrl` trước khi trả về frontend.

**Commit:** `ad7cb78 fix(music): backfill audioUrl from localPath on track list/get`

### Verify
```bash
curl -sH "Authorization: Bearer $TOKEN" \
  "https://api.cuongthai.com/api/v1/music/tracks" \
  | jq '.data.items[0] | {title, audioUrl, localPath}'
# → audioUrl: "https://media.cuongthai.com/audio/songs/xxx.mp3" ✅
```

---

## 🐛 BUG #4 — CSP block R2 host

**Thời gian:** 2026-06-18

### Triệu chứng
- Sau khi thêm R2 host cho `<img>` (cover, avatar), browser DevTools console: `Refused to load ... because it violates the following Content Security Policy directive: "img-src 'self' data: blob:"`.
- Một số ảnh cover bị blank.

### Root cause
File `next.config.js` (hoặc `middleware.ts`) CSP header chỉ allow `'self' data: blob:`. R2 host `https://media.cuongthai.com` không có trong allowlist.

### Fix
Thêm R2 host vào:
- `img-src`: `https://media.cuongthai.com`
- `media-src`: `https://media.cuongthai.com` (nếu dùng trực tiếp)
- `connect-src`: `https://media.cuongthai.com` (cho fetch API nếu có)

**Commit:** `a61ff66 fix(security): ensure R2 host is in CSP allowlist (rebuild frontend)`

### Bài học
- CSP phải update mỗi khi thêm domain mới.
- Build lại frontend (Next.js inline CSP header từ config vào edge middleware).

---

## 🐛 BUG #5 — Stream endpoint cũ `redirect(302)` sang R2

**Thời gian:** 2026-06-18 (commit trước `bbe6429`)

### Triệu chứng
- Test `curl -sI https://api.cuongthai.com/api/v1/music/stream/42` → trả về `HTTP/1.1 302 Found, Location: https://media.cuongthai.com/...`.
- Browser follow redirect → vẫn fail vì CORS (như BUG #2).

### Root cause
Logic cũ của `getStreamOptions()`:
```ts
// CŨ (FAIL):
return { redirect: buildSignedR2Url(track.localPath) };
// Browser: 302 → media.cuongthai.com → CORS block.
```

### Fix
Đổi sang proxy pattern:
```ts
// MỚI (OK):
const stream = await storageProvider.getReadStream(track.localPath);
return {
  streamResult: {
    contentType: 'audio/mpeg',
    contentLength: stat.size,
    stream,
    acceptRanges: true,
    contentRange: `bytes ${start}-${end}/${total}`,
  },
};
```

Route handler pipe `stream` qua `res` với headers `Accept-Ranges`, `Content-Range`, `Content-Type`. Browser nhận bytes trực tiếp từ backend (same-origin nếu qua nginx, hoặc cross-origin có CORS middleware backend OK).

**Commit:** `bbe6429 fix(music): route audio through backend stream endpoint (CORS)`

---

## 🐛 BUG #6 (ngoài luồng nhưng liên quan) — Deploy workflow chậm vì dùng GHCR thay vì rsync

**Thời gian:** 2026-06-19

### Triệu chứng
- Sửa frontend `MusicAudioController.tsx` → push code.
- CI `deploy-ghcr.yml` chạy ~3 phút, FAIL do container conflict (vì container cũ đang chạy `--force-recreate` bị stuck).
- Site down ~9 phút, phải manual rsync + chạy `scripts/deploy-vps.sh` để restore.

### Root cause
Tôi (Cursor) dùng sai workflow deploy. Theo `DEPLOY-FASTER.md`, project này dùng:
```bash
rsync -avz --delete -e "ssh -i ~/.ssh/id_rsa" \
  --exclude='node_modules' --exclude='.next' \
  ./ root@160.187.1.208:/home/deployer/repo/ && \
ssh root@160.187.1.208 "cd /home/deployer/repo && bash scripts/deploy-vps.sh"
```
**KHÔNG dùng `deploy-ghcr.yml`** (chậm, hay fail conflict).

### Fix
1. Cancel CI workflow đang chạy.
2. Tạo folder `host-cache/` ở root + `frontend/host-cache/` (Dockerfile backend/frontend đều COPY path này — deploy script cũ expect có folder rỗng).
3. Rsync (KHÔNG exclude `host-cache/`) lên VPS.
4. SSH + `bash scripts/deploy-vps.sh` → build + recreate trong ~3 phút với BuildKit cache hit.

### Bài học
- **Project này dùng rsync-based deploy**, không dùng CI GHCR.
- Lý do ghi trong `DEPLOY-FASTER.md`: VPS đơn, repo nhỏ, CI thêm layer thừa.
- Nếu tương lai chuyển sang GHCR phải verify workflows không conflict.

---

## 🛠️ Cách debug khi gặp vấn đề R2

### 0. Checklist trước khi đổi R2_PUBLIC_URL (QUAN TRỌNG)
**MỖI KHI đổi `R2_PUBLIC_URL` trên server, PHẢI đồng thời:**
1. Thêm domain mới vào `next.config.js` → `images.remotePatterns` + CSP `img-src` + `connect-src`
2. Rebuild + deploy frontend
3. Rebuild + restart backend
4. Nếu DB URLs cần update: chạy script update batch

**Template CSP update:**
```
img-src ... https://*.r2.dev
connect-src ... https://*.r2.dev
```

### 1. Check env vars có đầy đủ không
```bash
ssh root@160.187.1.208 'docker exec cuonghoangdev_backend printenv | grep R2_'
# Cần đủ 6 vars: R2_BUCKET_NAME, R2_PUBLIC_URL, R2_ENDPOINT_URL,
# R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_REGION
```

### 2. Check storage provider nào đang active
```bash
docker logs cuonghoangdev_backend 2>&1 | grep -iE "storage|r2|local"
# Hoặc:
docker exec cuonghoangdev_backend node -e "console.log(process.env.R2_BUCKET_NAME ? 'r2' : 'local')"
```

### 3. Test trực tiếp R2 từ VPS
```bash
docker exec cuonghoangdev_backend sh -c "
  curl -sI https://media.cuongthai.com/audio/songs/test.mp3
"
# Nếu 200 OK → R2 public URL hoạt động.
# Nếu 403/404 → check bucket policy + custom domain DNS.
```

### 4. Test stream endpoint
```bash
curl -sI -H "Range: bytes=0-1023" \
  "https://api.cuongthai.com/api/v1/music/stream/42"
# Phải trả 206 Partial Content, Content-Type: audio/mpeg
# KHÔNG được trả 302 redirect.
```

### 5. Check CSP
DevTools → Network tab → click request ảnh/audio fail → xem `content-security-policy` response header từ server, check `img-src` / `media-src` có include R2 host không.

### 6. Check CORS trên R2 (nếu truy cập trực tiếp)
```bash
curl -sI -H "Origin: https://cuongthai.com" \
  "https://media.cuongthai.com/audio/songs/xxx.mp3"
# Tìm header "Access-Control-Allow-Origin: https://cuongthai.com"
# Nếu KHÔNG có → R2 bucket chưa có CORS policy.
```

---

## 📋 Checklist khi thêm file upload mới (R2) hoặc đổi R2_PUBLIC_URL

- [ ] **QUAN TRỌNG: Nếu đổi R2_PUBLIC_URL** → update ngay `next.config.js` CSP + remotePatterns + rebuild frontend
- [ ] Sử dụng `storageProvider.upload(key, buffer, mimetype)` thay vì multer local.
- [ ] Lưu **cả `key` lẫn `url`** vào DB (key để delete sau này, url để frontend).
- [ ] Nếu là audio dùng cho player + visualizer → **route qua backend stream endpoint**, không dùng R2 public URL trực tiếp.
- [ ] Nếu là ảnh → dùng R2 public URL OK (img không trigger CORS).
- [ ] Update CSP `img-src` / `media-src` nếu thêm host mới.
- [ ] Build lại frontend (CSP inline ở edge middleware).
- [ ] Verify bằng curl + browser thật (Chrome DevTools Network tab).

---

## 🔗 Files / Commits liên quan

| File | Vai trò |
|------|---------|
| `src/storage/StorageProvider.ts` | Interface + factory |
| `src/storage/R2StorageProvider.ts` | R2 implementation (AWS SDK v3) |
| `src/storage/LocalStorageProvider.ts` | Fallback cho dev |
| `src/config/r2.ts` | R2 client init, sign URL, build public URL |
| `src/services/music.service.ts` | `buildAudioUrl()` backfill helper |
| `src/routes/music.routes.ts` | `/api/v1/music/stream/:id` proxy handler |
| `frontend/src/lib/utils.ts` | `getMediaUrl()` routing logic |
| `frontend/src/components/music/MusicAudioController.tsx` | `<audio crossOrigin="anonymous">` player |
| `next.config.js` (hoặc `middleware.ts`) | CSP header config |
| `docker-compose.yml` | `R2_*` env passthrough |

| Commit | Mô tả |
|--------|-------|
| `9a8c3b4` | feat(storage): migrate all file uploads from local disk to Cloudflare R2 |
| `a35588d` | fix(upload): createTrack + UploadService now R2-aware |
| `ad7cb78` | fix(music): backfill audioUrl from localPath on track list/get |
| `a61ff66` | fix(security): ensure R2 host is in CSP allowlist (rebuild frontend) |
| `bbe6429` | fix(music): route audio through backend stream endpoint (CORS) |

---

## 🎓 Bài học tổng kết

1. **CORS là vấn đề #1 khi dùng CDN cho media có JS access** (audio, video với crossOrigin). Ảnh thường OK, audio/video cần proxy.
2. **Proxy > redirect** khi upstream không có CORS. Backend thêm 1 hop nhưng giảm complexity client.
3. **CSP phải đồng bộ với storage host** — update mỗi khi thêm domain mới.
4. **DB schema vestige (localPath) phải được backfill** khi chuyển sang R2, không chỉ rely vào field mới.
5. **Deploy workflow quan trọng không kém code** — dùng đúng tool (rsync vs CI) cho từng project size.
6. **Khi fix bug, check cả network layer** (Nginx, CORS, CSP, headers) trước khi đổ lỗi cho logic frontend/backend.

---

*Cập nhật lần cuối: 2026-06-20 — sau khi fix CSP chặn pub-*.r2.dev.*
