# Bug Report: Login thành công nhưng bị đá ra trang login

**Ngày:** 21/06/2026
**Severity:** Critical (auth broken)
**Trạng thái:** Fixed

---

## Mô tả lỗi

Sau khi đăng nhập thành công (API trả `success: true`), user bị redirect trở lại trang login với URL:
```
https://cuongthai.com/login?redirect=%2Fadmin&error=login_required
```

Tức là middleware không nhận ra user đã đăng nhập dù cookies đã được set đúng.

---

## Root Cause: 2 vấn đề cùng lúc

### 1. `Secure` flag trên cookies

**File:** `frontend/src/app/api/auth/login/route.ts` (và 4 file auth khác)

**Code cũ:**
```typescript
response.cookies.set("backend_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ← VẤN ĐỀ 1
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

**Vấn đề:**
- Khi `NODE_ENV=production`, `secure: true` → cookie chỉ gửi qua HTTPS
- Browser gọi `POST /api/auth/login` → frontend (Next.js) nhận request
- Frontend proxy sang backend → backend set cookies `Secure; HttpOnly`
- Response trả về browser với `Secure` flag
- Browser từ chối lưu cookie vì request origin (`https://cuongthai.com`) nhưng response từ một context khác (do proxy)
- Cookie không được lưu → request tiếp theo không có cookie → middleware đá ra

**Cách kiểm tra:**
```bash
# Response headers không có Secure → đúng
curl -v -X POST https://cuongthai.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"Cuong03dx","password":"TestPass123"}' \
  2>&1 | grep set-cookie

# Phải thấy: HttpOnly; SameSite=lax  (KHÔNG có Secure)
# Nếu thấy: Secure; HttpOnly; SameSite=lax → BUG
```

**Fix:**
```typescript
response.cookies.set("backend_token", token, {
  httpOnly: true,
  secure: false, // ← Luôn là false, không cần Secure flag
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
```

**Files cần fix:**
- `frontend/src/app/api/auth/login/route.ts`
- `frontend/src/app/api/auth/register/route.ts`
- `frontend/src/app/api/auth/oauth/token/route.ts`
- `frontend/src/app/api/auth/refresh/route.ts`
- `frontend/src/app/api/auth/logout/route.ts`

---

### 2. `ENOTFOUND backend` — DNS resolution thất bại

**Vấn đề:**
- Frontend muốn proxy request sang backend, dùng hostname `backend` hoặc `cuonghoangdev_backend`
- Docker container name `cuonghoangdev_backend` nhưng code dùng `backend`
- `backend` không được register là alias trong Docker network → DNS resolution fail
- Khi `fetch()` từ Next.js route sang backend fail → HTTP 500
- User thấy loading rồi bị đá ra

**Cách kiểm tra:**
```bash
# SSH vào server
ssh root@160.187.1.208

# Check frontend logs — sẽ thấy lỗi này
docker logs cuonghoangdev_frontend --tail 20 2>&1

# Nếu thấy: Error: getaddrinfo ENOTFOUND backend
# → Vấn đề DNS

# Check DNS resolution
docker exec cuonghoangdev_frontend nslookup backend
# Nếu thấy "can't find backend" → BUG
```

**Fix tạm thời (chạy ngay):**
```bash
# Thêm alias 'backend' vào Docker network
docker network disconnect cuonghoangdev_network cuonghoangdev_backend
docker network connect --alias backend cuonghoangdev_network cuonghoangdev_backend
docker network disconnect cuonghoangdev_network cuonghoangdev_frontend
docker network connect --alias backend cuonghoangdev_network cuonghoangdev_frontend

# Verify
docker exec cuonghoangdev_frontend nslookup backend
# Phải thấy: Name: backend → Address: 172.x.x.x
```

**Fix vĩnh viễn (sửa docker-compose.yml):**

Thêm `aliases` vào network config của backend service:

```yaml
# docker-compose.yml — backend service
backend:
  container_name: cuonghoangdev_backend
  ...
  networks:
    backend:
      aliases:
        - backend
  ...
```

Đảm bảo network definition ở cuối file:
```yaml
networks:
  backend:
    driver: bridge
    name: cuonghoangdev_network
```

**Lưu ý:** Sau khi sửa docker-compose, phải recreate container:
```bash
docker compose -f docker-compose.yml up -d --force-recreate backend
```

---

## Checklist debug tương lai

### Bước 1: Check login response headers
```bash
curl -v -X POST https://cuongthai.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"USER","password":"PASS"}' 2>&1 | grep set-cookie
```
→ Phải có `HttpOnly; SameSite=lax` (KHÔNG có `Secure`)

### Bước 2: Check middleware logs
```bash
ssh root@160.187.1.208 "docker logs cuonghoangdev_frontend --tail 20 2>&1"
```
→ Không được có `ENOTFOUND backend` hoặc `fetch failed`

### Bước 3: Check DNS resolution
```bash
ssh root@160.187.1.208 "docker exec cuonghoangdev_frontend nslookup backend"
```
→ Phải resolve được IP

### Bước 4: Test full flow với cookies
```bash
# Login
curl -c /tmp/j.txt -X POST https://cuongthai.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"USER","password":"PASS"}'

# Access protected page
curl -b /tmp/j.txt https://cuongthai.com/admin
# → Phải là HTTP 200, không redirect
```

---

## Các files đã sửa

| File | Thay đổi |
|------|----------|
| `frontend/src/app/api/auth/login/route.ts` | `secure: false` |
| `frontend/src/app/api/auth/register/route.ts` | `secure: false` |
| `frontend/src/app/api/auth/oauth/token/route.ts` | `secure: false` |
| `frontend/src/app/api/auth/refresh/route.ts` | `secure: false` |
| `frontend/src/app/api/auth/logout/route.ts` | `secure: false` |
| `docker-compose.yml` | Thêm `aliases: - backend` vào backend network |

---

## Deploy checklist

1. **Build frontend:**
   ```bash
   cd frontend && npm run build
   ```

2. **Sync .next folder lên server:**
   ```bash
   rsync -avz frontend/.next/ root@160.187.1.208:/opt/cuonghoangdev/frontend/.next/
   ```

3. **Fix hardcoded hostname trong build (nếu có):**
   ```bash
   ssh root@160.187.1.208 "
     for f in \$(grep -rl 'cuonghoangdev_backend' /opt/cuonghoangdev/frontend/.next/server/app/api/ 2>/dev/null | grep -v '.map'); do
       sed -i 's/cuonghoangdev_backend/backend/g' \"\$f\"
     done
   "
   ```
   (Hoặc ngược lại — tùy code base lúc đó dùng hostname nào)

4. **Copy routes vào container:**
   ```bash
   ssh root@160.187.1.208 "
     cat /opt/cuonghoangdev/frontend/.next/server/app/api/auth/login/route.js \
       | docker exec -i cuonghoangdev_frontend sh -c 'cat > /app/.next/server/app/api/auth/login/route.js'
   "
   ```
   (Cần copy tất cả route files đã sửa)

5. **Fix Docker network alias (nếu chưa có):**
   ```bash
   ssh root@160.187.1.208 "
     docker network disconnect cuonghoangdev_network cuonghoangdev_backend
     docker network connect --alias backend cuonghoangdev_network cuonghoangdev_backend
     docker network disconnect cuonghoangdev_network cuonghoangdev_frontend
     docker network connect --alias backend cuonghoangdev_network cuonghoangdev_frontend
   "
   ```

6. **Update docker-compose.yml (vĩnh viễn):**
   ```bash
   scp docker-compose.yml root@160.187.1.208:/opt/cuonghoangdev/docker-compose.yml
   ```

7. **Restart frontend:**
   ```bash
   ssh root@160.187.1.208 "docker restart cuonghoangdev_frontend"
   ```

8. **Verify:**
   ```bash
   curl -v -X POST https://cuongthai.com/api/auth/login \
     -H 'Content-Type: application/json' \
     -d '{"username":"Cuong03dx","password":"TestPass123"}' 2>&1 | grep set-cookie
   # → Không có Secure flag
   ```

---

## Lesson Learned

1. **Không bao giờ dùng `secure: process.env.NODE_ENV === "production"`** cho cookies trong Next.js standalone setup. Luôn dùng `secure: false` vì:
   - Cookie được set bởi Next.js response (frontend container)
   - Frontend đã chạy trong Docker network, không phải qua HTTPS trực tiếp
   - Browser nhận cookie qua nginx (HTTPS) rồi nhưng cookie origin là từ frontend proxy
   - `Secure` flag gây race condition giữa proxy chain

2. **Luôn verify Docker DNS resolution** trước khi deploy. Hostname `backend` phải resolve được từ frontend container.

3. **Test bằng curl với `-c` và `-b` flags** để verify cookies được lưu đúng trước khi test trên browser.
