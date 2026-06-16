# Lỗi Thường Gặp & Cách Fix

Ghi chú lại các lỗi thực tế đã gặp trong dự án, nguyên nhân, cách debug và fix. Mỗi entry có format: **triệu chứng → nguyên nhân → fix → bài học**.

---

## Lỗi #1: User login xong bị đá về `/login?redirect=/admin` liên tục

**Ngày gặp**: 2026-06-16
**Mức độ**: 🔴 Critical — không vào được admin
**File liên quan**: `frontend/src/middleware.ts`

### Triệu chứng
- User login thành công tại `/login` → set cookie `backend_token` + `admin_role=1`
- Redirect tới `/admin` → **307 redirect về `/login?redirect=/admin`**
- Click "Admin Dashboard" trên sidebar → lại bị đá
- Reload trang admin → vẫn bị đá
- URL luôn kết thúc ở `/login?redirect=/admin`

### Debug
- Test thẳng tới `/api/auth/admin-check` với cookie → **200 OK** ✓ (backend OK)
- Test thẳng tới `/admin` với cookie qua curl → **307 redirect** ✗ (middleware fail)
- Log frontend container → không có log của middleware (Edge runtime không ghi stdout)
- Thêm `x-mw-admin` header vào response → header **không xuất hiện** ⇒ middleware thực sự không chạy đúng

### Nguyên nhân gốc
Middleware Edge runtime (`src/middleware.ts`) check `/admin/*` theo flow:
1. Đọc `backend_token` từ `request.cookies.get('backend_token')?.value` → OK
2. **Gọi `fetch('https://cuongthai.com/api/auth/admin-check')` từ Edge runtime** (loopback call về chính Next.js server)
3. Fetch từ Edge runtime trong Docker standalone environment thường **timeout / fail / trả response không như mong đợi**
4. Catch block → `redirectToLogin()`

Vấn đề thật sự là **2 lớp**:
- **Logic**: gọi `fetch` loopback không ổn định
- **Cookie reading**: `request.cookies.get()` không trả về httpOnly cookies trong một số config (Edge runtime + `output: 'standalone'` + reverse proxy)

### Fix
Refactor middleware: dùng cookie companion `admin_role` (đã được set với `1` cho admin) làm fast path, không cần gọi API.

```typescript
// frontend/src/middleware.ts (đoạn chính)
function readCookie(request: NextRequest, name: string): string {
  // Edge runtime KHÔNG tin tưởng request.cookies.get() với httpOnly cookies.
  // Parse raw cookie header là đường duy nhất đáng tin.
  const header = request.headers.get('cookie') ?? '';
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = header.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return m?.[1] ?? '';
}

async function handleAdminRoute(request, pathname) {
  const backendToken = readCookie(request, 'backend_token');
  const adminRole = readCookie(request, 'admin_role');

  if (!backendToken) return redirectToLogin(request, pathname, 'login_required');

  // Fast path: tin tưởng admin_role cookie (set cùng lúc với backend_token)
  if (adminRole === '1') return NextResponse.next();
  if (adminRole === '0') return redirectToLogin(request, pathname, 'not_admin');

  // Slow path: cookie bị stale hoặc thiếu, gọi backend verify
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);  // timeout cứng
    const res = await fetch(`${protocol}://${host}/api/auth/admin-check`, {
      headers: { Cookie: `backend_token=${backendToken}` },
      cache: 'no-store',
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json().catch(() => null);
      const isAdmin = data?.data?.roles?.some(r => r.replace('ROLE_', '').toUpperCase() === 'ADMIN');
      if (isAdmin) return NextResponse.next();
      return redirectToLogin(request, pathname, 'not_admin');
    }
  } catch { /* timeout/network blip → fall through */ }

  return redirectToLogin(request, pathname, 'login_required');
}
```

### Bài học
- **Edge runtime ≠ Node.js runtime**: không có sẵn `jsonwebtoken`, `fs`, `process`, một số Node API. Tránh logic phức tạp ở đây.
- **Đọc httpOnly cookies**: dùng raw `request.headers.get('cookie')` thay vì `request.cookies.get()` để chắc chắn.
- **Loopback fetch trong middleware**: thêm timeout (1-2s) và `cache: 'no-store'`. Nếu có thể tránh thì tránh — dùng cookie companion.
- **Debug Edge runtime**: `console.log` không lên stdout. Dùng response header (`x-mw-admin: fast-path`) để verify code path.

---

## Lỗi #2: Sau khi rsync `.next/`, container vẫn dùng code cũ

**Ngày gặp**: 2026-06-16
**Mức độ**: 🟠 High — fix xong nhưng container vẫn bug
**File liên quan**: `docker-compose.yml`, frontend Dockerfile

### Triệu chứng
- Build local OK, rsync `.next/` lên VPS, restart container
- Vẫn 307 redirect, vẫn thấy middleware cũ
- `docker exec` kiểm tra file trong container: **timestamp cũ** dù đã rsync file mới

### Nguyên nhân gốc
- `docker-compose.yml` không có `volumes:` cho `frontend` — container dùng code **baked vào image** khi `docker build`
- `rsync frontend/.next/...` lên `/opt/.../frontend/.next/` **không ảnh hưởng** container (volume không mount)
- Restart container với image cũ → vẫn dùng middleware.js cũ trong image

### Fix
Khi không thể `docker build` (Docker Hub timeout), workaround bằng `docker commit` patch image:

```bash
# 1. Chạy container tạm từ image GỐC
docker run -d --name temp_frontend api-backend-frontend:orig sleep infinity

# 2. Copy file mới vào
docker cp frontend/.next/standalone/.next/server/src/middleware.js temp_frontend:/app/.next/server/middleware.js
docker cp frontend/.next/standalone/.next/server/middleware-manifest.json temp_frontend:/app/.next/server/
docker cp frontend/.next/standalone/.next/server/middleware-build-manifest.js temp_frontend:/app/.next/server/
docker cp frontend/.next/standalone/.next/server/edge-runtime-webpack.js temp_frontend:/app/.next/server/

# 3. Fix ownership (image chạy user nextjs, file copy từ host là 501:50)
docker exec -u root temp_frontend chown nextjs:nodejs /app/.next/server/middleware.js ...

# 4. Commit thành image mới với CMD ĐÚNG
docker commit \
  --change='CMD ["/usr/local/bin/node", "server.js"]' \
  temp_frontend api-backend-frontend:patched
docker tag api-backend-frontend:patched api-backend-frontend:latest
docker rm -f temp_frontend
```

### Bài học
- **Khi deploy bằng rsync thay vì `docker build`**: PHẢI patch image. Rsync file trên host KHÔNG ảnh hưởng container (trừ khi có volume mount).
- **CMD format phải là JSON exec form** (mảng `[]`), KHÔNG phải string `node server.js`. Shell form `/bin/sh -c "..."` không tìm được `node` trong PATH ngắn.
- **File ownership trong Next.js standalone image**: user `nextjs:nodejs` (UID 1001). Khi copy từ host (thường UID 501), phải `chown` lại, nếu không `node server.js` không đọc được file.
- **Khi Docker Hub timeout**: workaround bằng `docker commit` + `docker tag`. Lần sau nên có fallback mirror (gcr.io mirror) trong `daemon.json`.

---

## Lỗi #3: Docker image CMD bị overwrite bởi `docker commit`

**Ngày gặp**: 2026-06-16
**Mức độ**: 🟡 Medium — dễ debug, fix nhanh
**File liên quan**: Docker commit

### Triệu chứng
- Sau khi `docker commit` image mới, container restart liên tục (`Restarting (127)`)
- Logs: `sh: [node,: not found` hoặc `sh: node,: not found`

### Nguyên nhân
`docker commit` mặc định lấy CMD từ container đang chạy. Nếu container chạy `sleep 3600` (lệnh dùng để patch), CMD mới sẽ là `sleep 3600`, không phải `node server.js`.

### Fix
```bash
# Ghi đè CMD khi commit
docker commit \
  --change='CMD ["/usr/local/bin/node", "server.js"]' \
  --change='USER nextjs' \
  --change='WORKDIR /app' \
  --change='ENV PORT=3000' \
  --change='ENV HOSTNAME=0.0.0.0' \
  temp_frontend api-backend-frontend:patched
```

**Quan trọng**: dùng **exec form** (mảng `[]`), KHÔNG phải shell form. Vì `sh -c "node server.js"` cần `node` trong PATH mà Alpine Node image đặt ở `/usr/local/bin/node` — shell form fail vì PATH rỗng.

### Bài học
- `--change='CMD [...]'` phải dùng exec form (JSON array)
- Trong Alpine Node, full path là `/usr/local/bin/node` (không có symlink ở `/usr/bin`)
- Luôn verify CMD sau commit: `docker inspect <image> --format='{{.Config.Cmd}}'`

---

## Lỗi #4: Nginx health check fail → Docker mark "unhealthy"

**Ngày gặp**: 2026-06-16
**Mức độ**: 🟡 Low — không ảnh hưởng traffic, chỉ là health flag
**File liên quan**: `docker-compose.yml` (nginx healthcheck)

### Triệu chứng
- `docker ps` hiển thị `cuonghoangdev_nginx: Up ... (unhealthy)`
- Site vẫn serve bình thường qua `https://cuongthai.com`
- Sau 3 retries vẫn unhealthy

### Nguyên nhân
- Healthcheck: `wget -qO- http://localhost/ || exit 1`
- Nginx listen cả `:80` và `:443`
- Request tới `http://localhost/` → nginx redirect 301 sang `https://localhost/`
- `wget` không trust self-signed cert → SSL fail → exit 1
- Docker mark unhealthy

### Fix tạm thời
Đổi healthcheck để gọi endpoint không redirect, hoặc bỏ qua healthcheck cho nginx:

```yaml
# docker-compose.yml
nginx:
  healthcheck:
    test: ["CMD-SHELL", "wget -qO- http://localhost/health || exit 1"]
    # hoặc đơn giản:
    test: ["CMD-SHELL", "pgrep nginx || exit 1"]
    interval: 30s
    timeout: 10s
    retries: 3
```

Hoặc thêm `nginx.conf` location `/health` trả `200`:

```nginx
location = /health {
    access_log off;
    return 200 "ok\n";
}
```

### Bài học
- "Unhealthy" ≠ "không hoạt động". Check `docker ps` xem service có nhận traffic không trước khi restart.
- Self-signed cert làm healthcheck fail khi test qua HTTPS. Dùng internal HTTP endpoint.

---

## Lỗi #5: Build Docker image fail vì Docker Hub timeout

**Ngày gặp**: 2026-06-16
**Mức độ**: 🟠 High — không deploy được
**File liên quan**: VPS DNS / network

### Triệu chứm
```
failed to solve: node:22-alpine: failed to resolve source metadata for
docker.io/library/node:22-alpine: dial tcp: lookup registry-1.docker.io
on 8.8.8.8:53: read udp ...: i/o timeout
```

### Nguyên nhân
VPS resolve `registry-1.docker.io` qua `8.8.8.8` (Google DNS) timeout. Có thể do:
- DNS upstream bị chặn từ IP VPS
- Docker daemon chưa cấu hình DNS mirror

### Fix
Thêm mirror trong `/etc/docker/daemon.json`:

```json
{
  "dns": ["1.1.1.1", "8.8.4.4"],
  "registry-mirrors": [
    "https://mirror.gcr.io",
    "https://docker.m.daocloud.io"
  ]
}
```

```bash
systemctl restart docker
# Hoặc trên Docker Swarm / Docker rootless: restart docker daemon tương ứng
```

Hoặc workaround: build image local, rsync `image.tar` lên VPS, `docker load`:

```bash
# Local
docker save api-backend-frontend:tag > /tmp/frontend.tar

# VPS
docker load < /tmp/frontend.tar
```

### Bài học
- DNS `8.8.8.8` không phải lúc nào cũng available. Luôn có fallback `1.1.1.1` hoặc DNS nội bộ.
- Docker Hub bị rate-limit nếu cùng IP pull nhiều. Mirror giúp giảm tải.

---

## Lỗi #6: `x-mw-admin` header không xuất hiện dù middleware chạy

**Ngày gặp**: 2026-06-16
**Mức độ**: 🟡 Low — chỉ là debug
**File liên quan**: middleware debugging

### Triệu chứng
- Thêm `res.headers.set('x-mw-admin', 'fast-path')` để verify middleware
- Test: header **không xuất hiện** trong response

### Nguyên nhân
- Nginx strip response headers không nằm trong danh sách expose
- Mặc định `proxy_pass` không forward custom headers từ upstream

### Fix
Thêm header vào nginx `proxy_pass_headers`:

```nginx
location / {
    proxy_pass http://frontend:3000;
    proxy_pass_header X-Mw-Admin;  # thêm dòng này
}
```

Hoặc dùng `proxy_hide_header` / `proxy_pass_header` tùy nhu cầu.

### Bài học
- Middleware header KHÔNG tự động pass qua nginx. Dùng `add_header` (nginx) hoặc `proxy_pass_header`.
- Để debug nhanh hơn: log ra stderr thay vì response header. Edge runtime có `console.error` work tốt hơn `console.log`.

---

## Quick Reference: Debug auth issue

```bash
# 1. Test cookie có được set không (sau login)
/usr/bin/curl -s -i -X POST https://cuongthai.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"X","password":"Y"}' | grep -E "Set-Cookie|HTTP"

# 2. Test admin-check với cookie (simulate browser)
/usr/bin/curl -s -i -H "Cookie: backend_token=eyJ...; admin_role=1" \
  https://cuongthai.com/api/auth/admin-check | head -3

# 3. Test /admin với cookie (full flow)
/usr/bin/curl -s -i -H "Cookie: backend_token=eyJ...; admin_role=1" \
  https://cuongthai.com/admin | head -3
# → 200 OK = OK
# → 307 → /login = middleware fail

# 4. Check middleware có chạy không
/usr/bin/curl -s -i -H "Cookie: backend_token=eyJ...; admin_role=1" \
  https://cuongthai.com/admin 2>&1 | grep -i "x-mw-admin"
# → x-mw-admin: fast-path = middleware pass
# → x-mw-admin: redirect-... = middleware redirect
# → (không có) = middleware không chạy (image cũ)
```

---

## Quick Reference: Force re-deploy frontend khi Docker Hub fail

```bash
# 1. Build local
npm run build --prefix frontend

# 2. Rsync .next lên VPS
rsync -avz --delete -e "ssh -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no" \
  frontend/.next root@160.187.1.208:/opt/cuonghoangdev/api-backend/frontend/

# 3. Patch image (thay vì docker build)
ssh -i ~/.ssh/id_rsa root@160.187.1.208 "
  cd /opt/cuonghoangdev/api-backend
  docker rm -f temp 2>/dev/null
  docker run -d --name temp api-backend-frontend:orig sleep infinity
  sleep 3
  docker cp frontend/.next/standalone/.next/server/src/middleware.js temp:/app/.next/server/
  docker cp frontend/.next/standalone/.next/server/middleware-manifest.json temp:/app/.next/server/
  docker cp frontend/.next/standalone/.next/server/middleware-build-manifest.js temp:/app/.next/server/
  docker cp frontend/.next/standalone/.next/server/edge-runtime-webpack.js temp:/app/.next/server/
  docker exec -u root temp chown nextjs:nodejs /app/.next/server/middleware.js /app/.next/server/middleware-manifest.json /app/.next/server/middleware-build-manifest.js /app/.next/server/edge-runtime-webpack.js
  docker commit --change='CMD [\"/usr/local/bin/node\", \"server.js\"]' temp api-backend-frontend:patched
  docker rm -f temp
  docker tag api-backend-frontend:patched api-backend-frontend:latest
  docker compose up -d --no-deps --force-recreate frontend
"
```

---

## Ghi chú chung

### Tại sao frontend container chạy ổn nhưng mỗi lần deploy phải patch image?
Docker compose trong project này **không mount volume** cho `frontend`, nên mọi code thay đổi phải rebuild image. Khi Docker Hub không pull được base image, workaround bằng `docker commit` patch. Lâu dài nên:
- Thêm `registry-mirrors` cho Docker daemon
- Hoặc volume mount `.next` (chấp nhận mất caching)
- Hoặc dùng `docker buildx` với cache từ registry nội bộ

### Tại sao nên dùng exec form cho CMD?
Alpine Node image đặt binary ở `/usr/local/bin/node`, không có symlink ở `/usr/bin`. Shell form `CMD node server.js` chạy `/bin/sh -c "node server.js"` — sh có PATH rỗng, fail ngay. Exec form `CMD ["/usr/local/bin/node", "server.js"]` chạy trực tiếp, work.

### Tại sao phải set `INTERNAL_BACKEND_URL=http://backend:3001`?
Frontend container trong Docker network có thể gọi backend qua internal DNS `http://backend:3001` (nhanh, không qua nginx). `BACKEND_URL=https://api.cuongthai.com` chỉ dùng cho client-side (browser) và Next.js public env. Tách 2 cái để tránh loopback qua internet.
