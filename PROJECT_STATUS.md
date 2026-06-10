# PROJECT STATUS — CuongHoangDev API-Backend

> **Trang thai hien tai (10/06/2026):**
> Da xong: ~80% — He thong dang chay production, trang music da nang cap Cyber-Anime, upload da fix, history da them.
> Con lai: ~20% — YouTube search integration, FFmpeg normalization, remaining premium features.

---

## MUC LUC

1. [Tong quan he thong](#1-tong-quan-he-thong)
2. [Tien do chi tiet theo module](#2-tien-do-chi-tiet-theo-module)
3. [File da tao / sua trong cuoc troi nay](#3-file-da-tao-sua-trong-cuoc-troi-nay)
4. [Stack ky thuat](#4-stack-ky-thuat)
5. [VPS hien tai](#5-vps-hien-tai)
6. [Bug can fix som](#6-bug-can-fix-som)
7. [Muc tieu con lai](#7-muc-tieu-con-lai)

---

## 1. TONG QUAN HE THONG

```
Nguoi dung
   |
   v
Nginx (port 80/443)
   |-- /               --> Next.js (port 3000)
   |-- /api/v1/*       --> Node.js Backend (port 3001)
   |-- /uploads/*      --> Static files (Docker volume / host SSD)
   |
   v
Backend (Node.js + Express)
   |-- PostgreSQL (port 5432) — Tat ca du lieu
   |-- Redis (port 6379)     — Cache
```

### Domain & SSL
- **Frontend**: `https://cuongthai.com`
- **API**: `https://api.cuongthai.com`
- **SSL**: Let's Encrypt (auto-renew via certbot)
- **SSL Cert**: `/opt/certbot/conf/archive/cuongthai.com/`

### VPS Info
- **IP**: `160.187.1.208`
- **SSH**: `root@160.187.1.208` (key: `/tmp/gha_local`)
- **Data dir**: `/opt/cuonghoangdev/`
- **Uploads**: `/opt/cuonghoangdev/uploads/` (SSD-mounted)
- **Postgres data**: `/opt/cuonghoangdev/postgres/`
- **Redis data**: `/opt/cuonghoangdev/redis/`
- **Backups**: `/opt/cuonghoangdev/backups/`

### Container Status (10/06/2026)
```
cuonghoangdev_backend    --> Healthy (port 3001)
cuonghoangdev_frontend --> Healthy (port 3000)
cuonghoangdev_nginx    --> Running (port 80/443)
cuonghoangdev_postgres  --> Healthy (port 5432)
cuonghoangdev_redis    --> Healthy (port 6379)
```

---

## 2. TIEN DO CHI TIET THEO MODULE

### 2.1 Authentication & Users ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Login username/password | ✅ Hoan thanh |
| Register | ✅ Hoan thanh |
| JWT tokens (24h access + 7d refresh) | ✅ Hoan thanh |
| OAuth Google | ✅ Hoan thanh |
| OAuth GitHub | ✅ Hoan thanh |
| Password reset (forgot/reset) | ✅ Hoan thanh |
| Role-based access (ROLE_ADMIN, ROLE_USER) | ✅ Hoan thanh |
| RoleVersion invalidation on password change | ✅ Hoan thanh |
| Admin middleware verification | ✅ Hoan thanh |
| NextAuth integration | ✅ Hoan thanh |
| Dual auth: backend JWT + NextAuth JWT | ✅ Hoan thanh |
| User management (admin CRUD) | ✅ Hoan thanh |
| Profile update | ✅ Hoan thanh |

### 2.2 Blog ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Public blog listing (paginated) | ✅ Hoan thanh |
| Blog categories | ✅ Hoan thanh |
| Blog post detail (view count) | ✅ Hoan thanh |
| Blog search | ✅ Hoan thanh |
| Featured + Popular posts | ✅ Hoan thanh |
| Comments (authenticated) | ✅ Hoan thanh |
| Admin post CRUD | ✅ Hoan thanh |
| Rich text editor (TinyMCE-like) | ✅ Hoan thanh |
| Image upload for posts | ✅ Hoan thanh |
| Source code download tracking | ✅ Hoan thanh |

### 2.3 E-Commerce / Shop ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Product listing (paginated, filterable) | ✅ Hoan thanh |
| Product detail (tabs: description/reviews) | ✅ Hoan thanh |
| Category filter | ✅ Hoan thanh |
| Cart drawer (slide-out) | ✅ Hoan thanh |
| Discount codes (PERCENT/FIXED_AMOUNT) | ✅ Hoan thanh |
| Create order (digital product) | ✅ Hoan thanh |
| Order confirmation | ✅ Hoan thanh |
| My orders page | ✅ Hoan thanh |
| Invoice PDF generation | ✅ Hoan thanh |
| Admin product CRUD | ✅ Hoan thanh |
| Admin order management | ✅ Hoan thanh |
| Admin discount CRUD | ✅ Hoan thanh |
| Multi-image upload | ✅ Hoan thanh |

### 2.4 Course / LMS (Academy) ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Public course catalog | ✅ Hoan thanh |
| Course categories | ✅ Hoan thanh |
| Course detail + curriculum | ✅ Hoan thanh |
| Enrollment (buy or free) | ✅ Hoan thanh |
| Lesson progress tracking | ✅ Hoan thanh |
| Video lesson player | ✅ Hoan thanh |
| Lesson documents (downloadable) | ✅ Hoan thanh |
| Assignments + submissions | ✅ Hoan thanh |
| Teacher grading | ✅ Hoan thanh |
| Certificates (auto-generate) | ✅ Hoan thanh |
| Certificate verification | ✅ Hoan thanh |
| My courses page | ✅ Hoan thanh |
| Admin course CRUD | ✅ Hoan thanh |
| Admin lesson CRUD | ✅ Hoan thanh |
| Admin assignment CRUD | ✅ Hoan thanh |
| Semester management | ✅ Hoan thanh |

### 2.5 AI Chatbot ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Gemini AI streaming (SSE) | ✅ Hoan thanh |
| Chat sessions (create/delete) | ✅ Hoan thanh |
| Chat history per session | ✅ Hoan thanh |
| Suggested prompts | ✅ Hoan thanh |
| Robot emotion states | ✅ Hoan thanh |
| Feedback (rating + comment) | ✅ Hoan thanh |
| Analytics overview | ✅ Hoan thanh |
| AI config (model, temperature, etc.) | ✅ Hoan thanh |
| RAG document indexing (pgvector) | ✅ Hoan thanh |
| Non-streaming fallback | ✅ Hoan thanh |
| Persistent chat sessions | ✅ Hoan thanh |
| Floating chat widget | ✅ Hoan thanh |
| Chat sidebar | ✅ Hoan thanh |

### 2.6 Music 🎵 DANG HOAN THIEN

| Tinh nang | Trang thai |
|-----------|-----------|
| Music track listing | ✅ Hoan thanh |
| Music player (HTML5 audio) | ✅ Hoan thanh |
| Global player (persistent across pages) | ✅ Hoan thanh |
| Playlist CRUD | ✅ Hoan thanh |
| Add track to playlist | ✅ Hoan thanh |
| Audio streaming (HTTP 206 Partial Content) | ✅ Hoan thanh |
| Audio upload (admin) | ✅ Da fix upload |
| Cover image upload | ✅ Da fix upload |
| Cyber-Anime Music Terminal UI | ✅ HOAN THANH |
| Scanlines overlay | ✅ HOAN THANH |
| Glassmorphism cards | ✅ HOAN THANH |
| Vinyl disc animation | ✅ HOAN THANH |
| Audio visualizer (80-bar canvas) | ✅ HOAN THANH |
| Glitch text effect (hover) | ✅ HOAN THANH |
| Smart Shuffle | ✅ HOAN THANH |
| History tracking (localStorage) | ✅ HOAN THANH |
| Now Playing full-screen page | ✅ HOAN THANH |
| Blur background from album art | ✅ HOAN THANH |
| Custom crosshair cursor | ✅ HOAN THANH |
| CyberBackground (particles + grid) | ✅ HOAN THANH |
| Framer Motion transitions | ✅ HOAN THANH |
| **Database history** | ✅ HOAN THANH |
| **History API (POST/GET/DELETE)** | ✅ HOAN THANH |
| YouTube Data API key | ✅ Da them vao env |
| YouTube search integration | 🔜 CHO LAM |
| FFmpeg audio normalization | 🔜 CHO LAM |
| YouTube + local track merge UI | 🔜 CHO LAM |
| Playback position persistence | 🔜 CHO LAM (da luu currentTime nhung chua khoi phuc vi tri) |

### 2.7 Projects ✅ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Project listing | ✅ Hoan thanh |
| Featured projects | ✅ Hoan thanh |
| Project detail drawer | ✅ Hoan thanh |
| Image carousel | ✅ Hoan thanh |
| Admin project CRUD | ✅ Hoan thanh |
| Tech stack tags | ✅ Hoan thanh |

### 2.8 Games 🕹️ CO BAN

| Tinh nang | Trang thai |
|-----------|-----------|
| Games listing page | ✅ Hoan thanh |
| Memory Card Game | ✅ Hoan thanh |
| Tic Tac Toe | ✅ Can them |
| Snake Game | ✅ Can them |
| Admin game management | 🔜 CHO LAM |

### 2.9 Dev Hub 💻 CO BAN

| Tinh nang | Trang thai |
|-----------|-----------|
| Dev post listing | ✅ Hoan thanh |
| Dev post detail | ✅ Hoan thanh |
| Post comments | ✅ Hoan thanh |
| Admin CRUD | 🔜 CHO LAM |
| Download tracking | 🔜 CHO LAM |

### 2.10 Dashboard 📊 CO BAN

| Tinh nang | Trang thai |
|-----------|-----------|
| Task list | ✅ Co component |
| Timeline | ✅ Co component |
| Stats modal | ✅ Co component |
| Avatar card | ✅ Co component |
| Zustand store | ✅ Co store |

### 2.11 Deployment & DevOps ⚙️ HOAN THANH

| Tinh nang | Trang thai |
|-----------|-----------|
| Docker Compose (5 services) | ✅ Hoan thanh |
| Multi-stage Dockerfiles | ✅ Hoan thanh |
| Nginx reverse proxy | ✅ Hoan thanh |
| SSL Let's Encrypt | ✅ Hoan thanh |
| Health checks | ✅ Hoan thanh |
| GitHub Actions CI/CD | ✅ Hoan thanh |
| Cron: DB backup 2AM daily | ✅ Hoan thanh |
| Cron: Monitor every 5min | ✅ Hoan thanh |
| Uploads on host SSD | ✅ Hoan thanh |
| Nginx static file serving | ✅ Hoan thanh |
| Rate limiting (API/auth/uploads) | ✅ Hoan thanh |
| Gzip compression | ✅ Hoan thanh |
| RoleVersion cache invalidation | ✅ Hoan thanh |

---

## 3. FILE DA TAO / SUA TRONG CUOC TROI NAY

### 3.1 Files tao moi (trong chat)

| File | Mo ta | Trang thai |
|------|-------|-----------|
| `frontend/src/app/music/page.tsx` | Cyber Music Terminal page | ✅ Xong |
| `frontend/src/app/music/now-playing/page.tsx` | Full-screen Now Playing | ✅ Xong |
| `frontend/src/components/music/CyberBackground.tsx` | Canvas particles + grid + glow | ✅ Xong |
| `frontend/src/components/music/CyberPlayer.tsx` | Main player: vinyl disc, glitch, controls | ✅ Xong |
| `frontend/src/components/music/CyberPlaylist.tsx` | Playlist + history tab | ✅ Xong |
| `frontend/src/components/music/CyberAudioVisualizer.tsx` | 80-bar waveform visualizer | ✅ Xong |
| `frontend/src/app/api/music/history/route.ts` | Frontend proxy: GET/POST/DELETE history | ✅ Xong |
| `frontend/src/app/api/music/upload/route.ts` | Upload proxy (manual multipart parse) | ✅ Xong |
| `src/routes/music-history.routes.ts` | Backend: POST/GET/DELETE history | ✅ Xong |
| `frontend/src/store/musicStore.ts` | Zustand: Smart Shuffle, history, debounce | ✅ Xong |
| `frontend/src/lib/api.ts` | musicApi helpers | ✅ Xong |
| `prisma/schema.prisma` | MusicHistory model | ✅ Xong |

### 3.2 Files sua (trong chat)

| File | Thay doi |
|------|---------|
| `frontend/src/app/music/page.tsx` | Thay theu page cu boi Cyber Music Terminal |
| `frontend/src/store/musicStore.ts` | Them Smart Shuffle, history tracking, debounced persist |
| `frontend/src/lib/api.ts` | Them musicApi helper functions |
| `src/index.ts` | Them musicHistoryRoutes |
| `prisma/schema.prisma` | Them MusicHistory model, reverse relations |
| `docker-compose.yml` | Them NEXT_PUBLIC_YOUTUBE_API_KEY env |
| `frontend/Dockerfile` | Them ARG cho YouTube API key |
| `.env.example` | Them NEXT_PUBLIC_YOUTUBE_API_KEY |
| `.env.docker` | Them NEXT_PUBLIC_YOUTUBE_API_KEY |

---

## 4. STACK KY THUAT

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animation**: Framer Motion
- **State**: Zustand (persisted)
- **Forms**: React Hook Form
- **Toast**: Sonner
- **Icons**: Lucide React
- **i18n**: next-intl (en/vi)

### Backend
- **Runtime**: Node.js 22
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma 5 (PostgreSQL 16 + pgvector)
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **File Upload**: Multer
- **AI**: Google Gemini (streaming)
- **Cache**: Redis 7
- **Rate Limiting**: express-rate-limit

### DevOps
- **Container**: Docker + Docker Compose
- **Database**: PostgreSQL 16 + PostGIS 3.4
- **Cache**: Redis 7 Alpine
- **Proxy**: Nginx 1.27
- **SSL**: Let's Encrypt (certbot)
- **CI/CD**: GitHub Actions
- **Server**: VPS (custom)

---

## 5. VPS HIEN TAI

### Thong tin ket noi
```bash
Host: 160.187.1.208
User: root
SSH Key: /tmp/gha_local
Data: /opt/cuonghoangdev/
```

### SSH
```bash
ssh -i /tmp/gha_local root@160.187.1.208
```

### Quan ly container
```bash
cd /opt/cuonghoangdev
docker compose ps           # Trang thai
docker compose logs -f       # Xem log
docker compose restart backend # Restart backend
docker compose build backend  # Rebuild backend
```

### Log
```bash
docker compose logs backend --tail=50 -f
docker compose logs frontend --tail=50 -f
docker compose logs nginx --tail=50 -f
```

### Database (postgres)
```bash
# Ket noi
docker compose exec postgres psql -U postgres -d cuonghoangdev_db

# Kiem tra bang
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### Backup
```bash
# Manual backup
docker compose exec postgres pg_dump -U postgres cuonghoangdev_db > backup_$(date +%Y%m%d).sql

# Cron auto backup (2AM hang ngay)
# Da cau hinh trong crontab
```

### Restart tat ca
```bash
docker compose down && docker compose up -d
```

---

## 6. BUG CAN FIX SOM

### [CAO] Music page - Tracks khong hien thi

**Trieu chung**: Trang `/music` hien thi trang thai loading ma khong hien thi track nao.

**Nguyen nhan**: Khi `fetchBackendTracks()` chay, no truyen ket qua vao `storeSetTracks(result)` nhung `setTracks` da bi override de luu vao `allTracks`. Thu vien music page dat `setTracks` = `storeSetTracks` nhung `storeSetTracks` goi `setTracks` (internal). Vong lap vo han co the xay ra.

**Cach fix**: Lam sao cho `music/page.tsx` goi dung `store.setTracks(result)` thay vi `storeSetTracks`.

**Trang thai**: 🔜 CHO FIX — Da xac dinh nguyen nhan, can implement fix.

### [THAP] Admin music upload - Cover image bi swap thanh audio

**Trieu chung**: Upload audio nhung backend nhan duoc `image/jpeg` (anh bia).

**Nguyen nhan**: Frontend proxy `request.formData()` co the reorder fields.

**Cach fix**: Da viet lai upload route voi manual multipart parsing. **Da deploy** — can test lai.

**Trang thai**: ✅ Da fix + deploy

### [THAP] PremiumBackground/SVG components - SSR error

**Trieu chung**: Mot so component co the gay SSR hydration mismatch khi su dung `useState`/`useEffect`.

**Cach fix**: Wrap trong `<ClientOnly>` hoac dung `dynamic` import.

**Trang thai**: 🔜 CHO FIX neu gap loi

### [THAP] Pre-existing TypeScript error - `useAudioStream.ts`

**Trieu chung**: `frontend/src/hooks/useAudioStream.ts` co TypeScript errors.

**Cach fix**: Khong anh huong den chuc nang — chi la type errors.

**Trang thai**: 🔜 CHO FIX (optional)

---

## 7. MUC TIEU CON LAI

### Priority 1: Fix Music Page Loading [CRITICAL]

Music page khong load tracks. Can fix ngay.

```
1. Sua music/page.tsx goi dung store.setTracks() hoac
2. Hoac tao action setTracksFromAPI() trong store
3. Test: upload 1 track, verify no hien thi
```

### Priority 2: YouTube Search Integration [NEW]

Khi nguoi dung tim nhac, cho phep tim tu YouTube.

```
1. Tao component YouTubeSearch.tsx
2. Goi YouTube Data API v3: https://www.googleapis.com/youtube/v3/search
3. Hien thi ket qua (title, thumbnail, duration)
4. Khi nguoi dung chon -> Play bang react-player
5. Luu sourceType = 'youtube' vao Track model
```

**File can tao**:
- `frontend/src/components/music/YouTubeSearch.tsx`
- `frontend/src/lib/youtube.ts`

**API endpoint moi**:
- Backend: `GET /api/v1/music/search?q=...` (proxy YouTube search)

### Priority 3: FFmpeg Audio Normalization [NEW]

Dam bao tat ca audio format deu phat duoc.

```
1. Cai FFmpeg tren VPS
2. Tao script normalize_audio.sh
3. Sau khi upload -> FFmpeg chuan hoa -> WAV 128kbps
4. Hoac dung fluent-ffmpeg npm package trong backend
```

**Steps**:
```bash
# Tren VPS
apt install ffmpeg

# Script normalize
#!/bin/bash
ffmpeg -i "$1" -af loudnorm=I=-16:TP=-1.5:LRA=11 "$2"
```

### Priority 4: Remaining Game Components [LOW]

- Snake Game: chua co giao dien hoan chinh
- Tic Tac Toe: can xay dung

### Priority 5: Dev Post Admin CRUD [LOW]

- Chua co admin page cho Dev Posts
- Chua co upload cho Dev Posts

### Priority 6: Premium Music Features [MEDIUM]

- Khi track thay doi -> Khoi phuc vi tri phat (chua hoat dong tot)
- Lyrics display (sync voi audio)
- Queue management UI (keo tha bai trong playlist)
- Playlist collaborative (chia se playlist)

### Priority 7: Performance [MEDIUM]

- Them TanStack Query / SWR cho music list cache
- Them CDN cho static files (neu can)
- Database query optimization (indexes)

---

## 8. LENH THUONG DUNG

### Deploy thay doi
```bash
# 1. Commit
git add -A && git commit -m "message"

# 2. Push
git push

# 3. Tren VPS
ssh -i /tmp/gha_local root@160.187.1.208
cd /opt/cuonghoangdev
git pull  # hoac rsync

# 4. Rebuild
docker compose build backend frontend
docker compose up -d backend frontend
```

### Test upload
```bash
curl -X POST https://cuongthai.com/api/music/upload \
  -H "Cookie: backend_token=YOUR_TOKEN" \
  -F "audio=@song.mp3" \
  -F "title=Test Song" \
  -F "artist=Test Artist"
```

### Check logs
```bash
docker compose logs backend -f --since 5m
docker compose logs nginx -f --since 5m
```

### Check DB
```bash
docker compose exec postgres psql -U postgres -d cuonghoangdev_db -c "SELECT COUNT(*) FROM music_tracks;"
```

### Check music page
```bash
curl -s https://cuongthai.com/api/v1/music/tracks | jq '.data | length'
```

---

## 9. LICH SU CAP NHAT

| Ngay | Hanh dong |
|------|----------|
| 10/06/2026 | Hoan thanh Cyber-Anime Music Terminal (CyberPlayer, CyberPlaylist, CyberBackground, CyberAudioVisualizer, Now Playing page) |
| 10/06/2026 | Fix music upload multipart parsing (image/jpeg bug) |
| 10/06/2026 | Them MusicHistory model + API routes |
| 10/06/2026 | Them YouTube API key vao env |
| 10/06/2026 | Nang cap musicStore (Smart Shuffle, history, debounce) |
| 10/06/2026 | Deploy to VPS |
| 10/06/2026 | Them Prisma schema + db push |
| Trc do | Hoan thanh blog, shop, courses, AI chatbot, music co ban, auth, admin pages |

---

**Document version**: 1.0
**Last updated**: 10/06/2026
**Author**: Cursor AI Agent
