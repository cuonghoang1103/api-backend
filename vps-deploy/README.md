# CuongHoangDev — VPS Production Deployment Guide (Node.js Stack)

## Architecture Overview

Single VPS chạy đầy đủ:

- `nginx` cho reverse proxy + HTTPS + static uploads
- `frontend` là Next.js
- `backend` là Node.js/Express
- `postgres` cho database chính
- `redis` cho cache
- `uploads` lưu trực tiếp trên ổ đĩa VPS

## Production source of truth

File deploy production chính thức là:

- `docker-compose.yml` ở root repo

Không còn các file compose thay thế. Chỉ dùng duy nhất `docker-compose.yml` ở root.

## Directory Structure on VPS

```text
/opt/cuonghoangdev/
├── .env
├── docker-compose.yml
├── nginx/
│   └── ssl/
├── uploads/
├── backups/
└── vps-deploy/
    ├── .env.example
    ├── README.md
    └── scripts/
```

## Setup Checklist

### 1. Initial VPS setup

```bash
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh
systemctl enable docker
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw default deny incoming
ufw enable
mkdir -p /opt/cuonghoangdev/data/{postgres,redis,uploads}
mkdir -p /opt/cuonghoangdev/nginx/{ssl,certbot}
mkdir -p /opt/cuonghoangdev/{backups,logs}
```

### 2. Sync project to VPS

```bash
cd /Users/admin/Downloads/api-backend
rsync -avz --exclude='.git' \
  --exclude='node_modules' \
  --exclude='frontend/node_modules' \
  --exclude='frontend/.next' \
  --exclude='frontend/.env' \
  --exclude='*.log' \
  . root@YOUR_VPS:/opt/cuonghoangdev/
```

### 3. Create `.env`

```bash
cd /opt/cuonghoangdev
cp vps-deploy/.env.example .env
nano .env
```

Điền đầy đủ:

- `DATABASE_URL`
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECRET`
- `AUTH_SECRET`
- `FRONTEND_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- OAuth keys nếu dùng
- SMTP nếu dùng

### 4. SSL certificates

Dùng Certbot hoặc copy chứng chỉ vào:

- `/opt/cuonghoangdev/nginx/ssl/fullchain.pem`
- `/opt/cuonghoangdev/nginx/ssl/privkey.pem`

### 5. Deploy

```bash
cd /opt/cuonghoangdev
docker compose -f docker-compose.yml up -d --build
```

### 6. Verify

```bash
docker compose -f /opt/cuonghoangdev/docker-compose.yml ps
docker compose -f /opt/cuonghoangdev/docker-compose.yml logs --tail=100 backend
docker compose -f /opt/cuonghoangdev/docker-compose.yml logs --tail=100 frontend
docker compose -f /opt/cuonghoangdev/docker-compose.yml logs --tail=100 nginx
curl http://localhost:3001/health
```

## Important production notes

- Backend chính là Node.js, không phải Spring Boot.
- Upload file lưu thẳng vào volume local VPS qua `UPLOAD_DIR=/app/uploads`.
- Không dùng Supabase hoặc Cloudinary trong runtime production mới.
- Nếu giữ Java legacy trong repo, phải exclude khỏi deploy.

## GitHub Actions secrets

Thêm các secret sau vào GitHub:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_PRIVATE_KEY`
- `DOCKER_HUB_USERNAME` nếu dùng image push riêng

## Smoke test after deploy

Kiểm tra tối thiểu:

- login credentials
- login OAuth
- profile session
- admin access
- upload ảnh
- upload mp3
- upload video
- phát nhạc / seek audio
- file vẫn còn sau restart container
