# VPS Deploy - Tối ưu CI/CD Pipeline

## Vấn đề hiện tại

### Deploy mất 30-40 phút mỗi lần
- Không có Docker layer caching — mỗi lần build đều chạy lại từ đầu
- `npm ci` + `npm run build` chạy hoàn toàn mới dù code thay đổi rất ít
- Docker build không tận dụng cache từ các lần build trước
- `docker builder prune` gây lỗi exit code 125 trên VPS RAM thấp (1-2GB)
- BuildKit bị vô hiệu hóa hoàn toàn

### Tại sao deploy lâu?
```
Mỗi lần push code:
  1. GitHub Actions rsync toàn bộ source lên VPS (2-5 phút)
  2. Docker build chạy lại từ đầu (25-35 phút)
     - COPY . .                    → cache MISS
     - npm ci                      → cache MISS (vì có COPY . . phía trên)
     - npm run build (TypeScript)  → cache MISS
     - npx prisma generate         → cache MISS
  3. Container restart + health check (1-2 phút)
```

### Nguyên nhân root cause
1. **Dockerfile không tối ưu layer order** — `COPY . .` xảy ra TRƯỚC `npm ci`, nên khi code thay đổi → toàn bộ layer phía dưới bị invalidate
2. **BuildKit bị tắt** — `DOCKER_BUILDKIT=0` trong script deploy
3. **Không có multi-stage build** — container chạy với toàn bộ builder tools bên trong
4. **Prune commands gây crash** — `docker builder prune -af` làm hỏng Docker daemon trên VPS RAM thấp

---

## Giải pháp: Multi-Stage Build + Layer Caching

### Nguyên tắc vàng của Docker layer caching

```
┌─────────────────────────────────────────────────────────┐
│  Layer order tối ưu (từ ít thay đổi → nhiều thay đổi) │
├─────────────────────────────────────────────────────────┤
│  1. Base image         (thay đổi: never/rarely)         │
│  2. System packages    (thay đổi: rarely)               │
│  3. package.json       (thay đổi: when deps change)     │
│  4. npm install        (thay đổi: when package.json changes)│
│  5. Source code        (thay đổi: frequently) ★        │
│  6. Build step         (thay đổi: when source changes) │
└─────────────────────────────────────────────────────────┘
```

**Key insight**: Copy `package.json` + `npm ci` TRƯỚC `COPY . .` → nếu chỉ thay đổi code, `npm ci` vẫn dùng cache.

### Kết quả mong đợi

```
Lần deploy đầu tiên (cold build):  ~3-5 phút (bình thường)
Lần deploy thứ 2+ (code changes): ~30-60 giây (cache hit!)
  - Docker build (incremental):  ~25-40 giây  (BuildKit cache)
  - Container start:              ~5-10 giây   (zero-downtime)
  - Total deploy time:            ~40-60 giây
```

---

## 3 giai đoạn của Multi-Stage Build

### Stage 1: Dependencies (builder-base)
- Copy `package.json` + `package-lock.json`
- Chạy `npm ci`
- Kết quả: layer cache chỉ invalid khi dependencies thay đổi

### Stage 2: Builder (full build)
- Copy source code đầy đủ
- Chạy TypeScript compiler + Prisma generate
- Tạo production artifacts
- Kết quả: layer cache invalid khi source code thay đổi

### Stage 3: Runner (production runtime)
- Alpine-based slim image (~150MB thay vì ~1GB)
- Copy chỉ artifacts cần thiết từ builder stage
- Không có dev dependencies, không có TypeScript, không có prisma CLI
- Kết quả: container nhẹ, khởi động nhanh, bảo mật tốt hơn

---

## BuildKit Acceleration

### Tại sao cần BuildKit?
- Parallel layer building (giảm 30-50% thời gian build)
- Advanced caching (build cache có thể share giữa các build)
- Inline cache: embed cache metadata vào image để reuse ở lần sau

### Cách enable
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
docker build --build-arg BUILDKIT_INLINE_CACHE=1 ...
```

---

## Checklist triển khai

- [x] Viết lại `Dockerfile.backend` theo multi-stage build
- [x] Viết lại `scripts/deploy-vps.sh` enable BuildKit + cache flags
- [x] Test build lần 1 (cold build)
- [x] Test build lần 2 (code change only) → nhanh hơn 10x
- [x] Verify container chạy đúng sau deploy
- [x] Xóa toàn bộ `docker builder prune` / `docker image prune` / `docker container prune`
- [x] Thêm healthcheck cho backend container

---

## Tài liệu tham khảo

- [Docker Layer Caching Best Practices](https://docs.docker.com/build/cache/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [BuildKit](https://docs.docker.com/build/buildkit/)
- [Next.js Docker Optimization](https://nextjs.org/docs/deployment#docker-image)
