---
name: deploy
description: Deploy web/API mọi ngôn ngữ: Dockerfile, compose, VPS + HTTPS, Vercel/Netlify/Cloudflare/Render, CI/CD GitHub Actions.
---

# KỸ NĂNG: DEPLOY — đưa dự án lên chạy thật

Mục tiêu: dự án chạy được trên mạng, có HTTPS, tự khởi động lại khi server reboot,
deploy lại được bằng MỘT lệnh, và bạn đã TỰ KIỂM rằng nó chạy — không phải "chắc là chạy".

## 0. Luật vàng (đọc trước mọi thứ)

1. **KHÔNG BAO GIỜ chạy lệnh chờ gõ tay.** Bạn không trả lời được câu hỏi của lệnh. Lệnh hỏi mật khẩu,
   hỏi yes/no, mở trình soạn thảo ⇒ treo tới hết giờ. Luôn dùng dạng không tương tác:
   `ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new`, `apt-get install -y`,
   `DEBIAN_FRONTEND=noninteractive`, `sudo -n`, `npm ci`, `git -c core.editor=true`,
   `docker compose up -d` (không `-it`), `certbot --non-interactive --agree-tos -m <email>`.
   Nếu một bước BẮT BUỘC cần người (mật khẩu lần đầu, mua domain, bấm trên dashboard) ⇒ DỪNG,
   nói rõ người dùng cần làm đúng việc gì, đưa sẵn lệnh để họ chép, rồi chờ.
2. **Không bao giờ in, commit, hay gửi bí mật** (mật khẩu DB, API key, `.env`). Bí mật sống trong
   file `.env` TRÊN SERVER (quyền 600) hoặc GitHub Secrets — không trong repo, không trong Dockerfile.
   Có `.env.example` liệt kê TÊN biến.
3. **Đọc dự án trước khi viết gì.** Xác định: ngôn ngữ + framework + phiên bản runtime, lệnh build,
   lệnh chạy, cổng, database, biến môi trường cần có, file tĩnh, migration. Đọc `package.json`,
   `*.csproj`, `pom.xml`/`build.gradle`, `requirements.txt`/`pyproject.toml`, `go.mod`, `composer.json`,
   `README`. Đừng đoán phiên bản — lấy từ file.
4. **Hỏi người dùng những gì không suy ra được** — gom thành MỘT lần hỏi: đích deploy (VPS có sẵn? IP?
   user SSH?), domain (có chưa?), email cho HTTPS, database dùng sẵn hay dựng mới.
5. **Kiểm bằng CHẠY, không bằng đọc.** Build xanh ≠ ảnh chạy được. Xong mỗi chặng phải có bằng chứng:
   `docker ps` thấy `Up` (không phải `Restarting`), `docker logs` không lỗi, `curl -sS -o /dev/null -w '%{http_code}'`
   ra 200/301/401 đúng như mong đợi, trang mở được qua HTTPS.

## 1. Chọn đích deploy

| Dự án | Đích hợp nhất |
|---|---|
| Frontend tĩnh / SPA (React/Vite, Vue, Angular, Astro tĩnh) | Vercel · Netlify · Cloudflare Pages · GitHub Pages — hoặc Nginx trên VPS |
| Next.js / Nuxt / SvelteKit (SSR) | Vercel (dễ nhất) · hoặc Docker trên VPS |
| Backend + DB (Node, Python, Java, .NET, PHP, Go, Ruby) | **VPS + Docker Compose** (rẻ, toàn quyền) · Render/Railway/Fly (không cần quản trị) |
| .NET + SQL Server | VPS **x86_64** + Docker (SQL Server KHÔNG chạy trên ARM, cần ≥ 2GB RAM) · hoặc Azure |
| Nhiều dịch vụ + queue + cache | VPS + Compose; lớn hơn nữa mới nghĩ tới Kubernetes |

Mặc định cho người mới có VPS: **Docker Compose + reverse proxy Caddy (tự lấy HTTPS)**.

## 2. Dockerfile theo ngôn ngữ (luôn multi-stage, chạy user thường, có HEALTHCHECK khi được)

Quy tắc chung: tag phiên bản CỤ THỂ (không `latest`), `.dockerignore` loại `node_modules`, `.git`, `.env*`,
`bin/`, `obj/`, `target/`, `__pycache__`; copy file khai phụ thuộc TRƯỚC rồi cài, sau mới copy mã (tận dụng cache);
lắng nghe `0.0.0.0` chứ không `localhost` bên trong container.

**Node (Express/Nest/Fastify):**
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --if-present && npm prune --omit=dev
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```
Prisma trên alpine: thêm `binaryTargets = ["native","linux-musl-openssl-3.0.x"]` và `RUN npx prisma generate`
— engine glibc trên ảnh musl ⇒ container restart vô tận dù build xanh.

**Next.js:** `output: 'standalone'` trong `next.config`, chạy `node server.js`, copy `.next/static` và `public`.
Biến `NEXT_PUBLIC_*` được NHÚNG LÚC BUILD ⇒ phải có lúc `docker build` (ARG), đổi thì build lại.
Không bao giờ để API key bí mật trong `NEXT_PUBLIC_*`.

**Python (FastAPI/Django/Flask):**
```dockerfile
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m app && chown -R app /app
USER app
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]
```
Django: `python manage.py collectstatic --noinput`, `migrate` ở bước khởi động riêng, `ALLOWED_HOSTS`, `DEBUG=False`.

**Java Spring Boot:**
```dockerfile
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY . .
RUN ./mvnw -q -DskipTests package   # hoặc ./gradlew bootJar
FROM eclipse-temurin:21-jre
COPY --from=build /src/target/*.jar /app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","/app.jar"]
```

**.NET / ASP.NET Core:**
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.sln ./
COPY */*.csproj ./          # hoặc COPY đúng đường .csproj rồi restore
RUN for f in *.csproj; do mkdir -p ${f%.*} && mv $f ${f%.*}/; done; dotnet restore
COPY . .
RUN dotnet publish <DuAn>/<DuAn>.csproj -c Release -o /out /p:UseAppHost=false
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "<DuAn>.dll"]
```
Lấy đúng phiên bản `TargetFramework` trong `.csproj` (net6/7/8/9 ⇒ tag sdk/aspnet tương ứng).
Chuỗi kết nối SQL Server trong container: `Server=db,1433;Database=App;User Id=sa;Password=${SA_PASSWORD};TrustServerCertificate=True`
— truyền qua biến môi trường `ConnectionStrings__DefaultConnection`, KHÔNG sửa appsettings.json có mật khẩu.
Migration EF Core: `dotnet ef database update` từ máy dev trỏ tới DB, hoặc gọi `db.Database.Migrate()` lúc app khởi động.

**PHP Laravel:** ảnh `php:8.3-fpm` + nginx (hoặc `serversideup/php`), `composer install --no-dev --optimize-autoloader`,
`php artisan config:cache route:cache`, `php artisan migrate --force`, `APP_KEY` trong `.env`.

**Go:** build tĩnh `CGO_ENABLED=0 go build -o /app` rồi chép vào `gcr.io/distroless/static` hoặc `alpine`.

**Frontend tĩnh trên VPS:** build rồi phục vụ bằng `nginx:alpine` (SPA cần `try_files $uri /index.html`).

## 3. docker-compose.yml (app + DB + reverse proxy)

```yaml
services:
  app:
    build: .
    restart: unless-stopped
    env_file: .env
    depends_on:
      db: { condition: service_healthy }
    expose: ["8080"]
  db:                                   # chọn MỘT trong các DB dưới
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: app
    volumes: [dbdata:/var/lib/postgresql/data]
    healthcheck: { test: ["CMD-SHELL","pg_isready -U postgres"], interval: 5s, retries: 20 }
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports: ["80:80", "443:443"]
    volumes: [./Caddyfile:/etc/caddy/Caddyfile:ro, caddydata:/data]
volumes: { dbdata: {}, caddydata: {} }
```
Caddyfile: `ten-mien.com { reverse_proxy app:8080 }` — Caddy tự xin và gia hạn HTTPS.

DB khác:
- **SQL Server:** `mcr.microsoft.com/mssql/server:2022-latest`, env `ACCEPT_EULA=Y`, `MSSQL_SA_PASSWORD` (≥8 ký tự, có hoa/thường/số/ký hiệu — sai là container tự tắt),
  volume `/var/opt/mssql`, healthcheck `/opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1"`. Chỉ x86_64.
- **MySQL/MariaDB:** `mysql:8.4` / `mariadb:11`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, volume `/var/lib/mysql`.
- **MongoDB:** `mongo:7`, volume `/data/db`. **Redis:** `redis:7-alpine`.
- KHÔNG mở cổng DB ra internet (không `ports:` cho db). Cần xem DB từ máy mình ⇒ `ssh -L 5432:localhost:5432`.

## 4. Quy trình deploy lên VPS (xem thêm kỹ năng `may-chu-ssh`)

1. Kiểm kết nối: `ssh -o BatchMode=yes -o ConnectTimeout=10 user@ip 'uname -m; free -h; df -h /; docker --version'`.
   Thất bại vì mật khẩu ⇒ hướng dẫn người dùng nạp SSH key (kỹ năng `may-chu-ssh` mục 1) rồi dừng chờ.
2. Server chưa có Docker ⇒ `curl -fsSL https://get.docker.com | sh` (cần root hoặc sudo không mật khẩu).
3. Build + chạy THỬ ở máy local trước nếu máy có Docker: `docker compose up -d --build` rồi `curl` kiểm.
4. Đưa mã lên server — chọn một:
   - `git clone`/`git pull` trên server (repo riêng tư ⇒ deploy key chỉ-đọc), hoặc
   - `rsync -az --delete --exclude .git --exclude node_modules --exclude .env ./ user@ip:/opt/app/`, hoặc
   - build ảnh ở CI, đẩy lên GHCR/Docker Hub, server chỉ `docker compose pull && up -d` (tốt nhất khi server yếu RAM).
5. Tạo `.env` trên server bằng lệnh ghi file có quyền 600 (hỏi người dùng giá trị bí mật, hoặc sinh ngẫu nhiên
   `openssl rand -base64 24` cho mật khẩu DB).
6. `docker compose up -d --build` trên server. Server ≤ 2GB RAM mà build nặng (Next.js, Java, .NET) ⇒ bị giết exit 137:
   build ở CI/máy local rồi đẩy ảnh, hoặc thêm swap.
7. Chạy migration (lệnh riêng, một lần).
8. **Kiểm:** `docker compose ps` (Up, không Restarting), `docker compose logs --tail=80 app`, `curl -I https://ten-mien`.
9. Báo cho người dùng: URL, cách xem log, cách deploy lại, cách backup DB.

Domain: trỏ bản ghi **A** về IP server (và AAAA nếu có IPv6), đợi DNS (`dig +short ten-mien`) TRƯỚC khi xin HTTPS.

## 5. Nền tảng không cần server

- **Vercel:** `npx vercel --prod --yes` (cần `VERCEL_TOKEN` — người dùng tạo ở dashboard); biến môi trường `vercel env add`.
  Monorepo ⇒ đặt Root Directory. Backend dài hạn/WebSocket/cron nặng không hợp Vercel.
- **Netlify:** `npx netlify-cli deploy --prod --dir=dist` (token `NETLIFY_AUTH_TOKEN`). SPA cần `_redirects`: `/* /index.html 200`.
- **Cloudflare Pages/Workers:** `npx wrangler pages deploy dist` (token `CLOUDFLARE_API_TOKEN`).
- **GitHub Pages:** workflow `actions/deploy-pages`; SPA cần `base` đúng tên repo.
- **Render / Railway / Fly.io:** kết nối repo hoặc `flyctl deploy` với Dockerfile có sẵn; khai biến môi trường trên dashboard/CLI.
Mọi token: người dùng tự tạo và dán vào biến môi trường/secret — bạn không in nó ra.

## 6. CI/CD với GitHub Actions (deploy mỗi lần push nhánh chính)

```yaml
name: deploy
on: { push: { branches: [main] }, workflow_dispatch: {} }
concurrency: { group: deploy, cancel-in-progress: false }   # không cho hai lần deploy đè nhau
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & push image
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .
          docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
      - name: Deploy qua SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/app && TAG=${{ github.sha }} docker compose pull && TAG=${{ github.sha }} docker compose up -d
            docker image prune -f
```
Nhắc người dùng thêm secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) — bạn không tự thêm được. Chạy test/lint TRƯỚC bước deploy.
`permissions: packages: write` cho job đẩy GHCR.

## 7. Bẫy đã gặp thật — kiểm trước khi kết luận "xong"

- Ảnh build cho ARM (Mac M) chạy trên VPS x86 ⇒ `exec format error`. Build `--platform linux/amd64` hoặc build trên server/CI.
- App nghe `localhost`/`127.0.0.1` trong container ⇒ proxy báo 502. Phải `0.0.0.0`.
- Container `Restarting` liên tục ⇒ đọc `docker logs`, đừng đoán. Hay gặp: thiếu biến môi trường, sai chuỗi kết nối DB, DB chưa sẵn sàng (thiếu healthcheck + depends_on), mật khẩu SA của SQL Server không đủ mạnh.
- Exit 137 = hết RAM. Đĩa đầy (`df -h`) ⇒ `docker system prune -af` (hỏi trước: xoá ảnh không dùng).
- Sửa file cấu hình bind-mount 1 file (nginx.conf) bằng cách thay file (mv/sed -i) ⇒ container vẫn đọc bản cũ. Ghi đè tại chỗ rồi reload, kiểm từ BÊN TRONG container.
- Firewall/nhà cung cấp chặn cổng 80/443 ⇒ `curl` từ ngoài server để kiểm, không chỉ từ trong.
- Migration hỏng giữa chừng ⇒ DỪNG, báo người dùng lỗi nguyên văn; không tự "resolve" hay xoá dữ liệu.
- Không bao giờ `docker compose down -v`, `DROP`, `rm -rf` dữ liệu trên server khi chưa được đồng ý rõ ràng — volume DB là dữ liệu thật.

## 8. Báo cáo cuối

Nói ngắn: đã deploy ở đâu (URL), bằng chứng đã kiểm (mã HTTP, trạng thái container), những gì CHƯA làm / người dùng
cần làm (thêm secret, trỏ domain, đổi mật khẩu mặc định), lệnh deploy lại và lệnh xem log.
