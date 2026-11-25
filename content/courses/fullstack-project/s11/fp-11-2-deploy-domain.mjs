/**
 * 11.2 — Deploy container và gắn domain + HTTPS (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Chạy THẬT trên VPS mô phỏng (fsp-vps, Ubuntu 24.04, Docker 29.10.1, Nginx 1.24.0 của Ubuntu, certbot 2.9.0).
 * HTTPS: Pebble (máy chủ ACME thử nghiệm của Let's Encrypt, ghcr.io/letsencrypt/pebble) — luồng http-01 THẬT với tên miền giả
 * chiase.test; CA của Pebble được nạp vào kho tin cậy của các container mô phỏng (đời thật: Let's Encrypt đã được tin sẵn).
 * Ảnh: dựng từ bản chép chiase + thay đổi Ch11 (REVISION), đẩy vào registry:2 cục bộ đóng vai GHCR, VPS kéo theo mã commit.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const DNS = `$ getent hosts chiase.test www.chiase.test
172.27.0.4      chiase.test
172.27.0.4      www.chiase.test

$ ssh root@chiase.test "DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx certbot cron &gt;/dev/null 2&gt;&amp;1; nginx -v; certbot --version; mkdir -p /var/www/certbot"
nginx version: nginx/1.24.0 (Ubuntu)
certbot 2.9.0

$ scp -q chiase/deploy/nginx/chiase.conf root@chiase.test:/etc/nginx/sites-available/chiase &amp;&amp; ssh root@chiase.test "ln -sf /etc/nginx/sites-available/chiase /etc/nginx/sites-enabled/chiase &amp;&amp; rm -f /etc/nginx/sites-enabled/default &amp;&amp; nginx -t"
2026/11/25 05:38:33 [emerg] 5022#5022: unknown directive "http2" in /etc/nginx/sites-enabled/chiase:27
nginx: configuration file /etc/nginx/nginx.conf test failed`;

const TU_KHAI = `diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index d05878f..80a2620 100644
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -126,6 +126,7 @@ jobs:
           push: \${{ github.event_name == 'push' }}
           tags: \${{ steps.ten.outputs.tags }}
           labels: org.opencontainers.image.revision=\${{ github.sha }}
+          build-args: REVISION=\${{ github.sha }} # ảnh tự khai commit: GET /api "ban", /ban.txt của web (bài 11.2)
           cache-from: type=gha,scope=\${{ matrix.ten }}
           cache-to: type=gha,mode=max,scope=\${{ matrix.ten }}
 
diff --git a/apps/api/Dockerfile b/apps/api/Dockerfile
index d0e0655..2b0d588 100644
--- a/apps/api/Dockerfile
+++ b/apps/api/Dockerfile
@@ -33,6 +33,8 @@ RUN --mount=type=cache,target=/root/.npm npm ci -w apps/api --omit=dev --omit=pe
 # ── cong-cu: tầng build + migrations + scripts — compose chạy "prisma migrate deploy", "kho:chuan-bi" bằng nó ──
 FROM build AS cong-cu
 WORKDIR /app/apps/api
+ARG REVISION=dev
+LABEL org.opencontainers.image.revision=\${REVISION}
 USER node
 CMD ["npx", "prisma", "migrate", "deploy"]
 
@@ -42,6 +44,11 @@ ENV NODE_ENV=production
 COPY --from=prod-deps /app/node_modules node_modules
 COPY --from=build /app/apps/api/dist apps/api/dist
 COPY apps/api/package.json apps/api/
+# Bài 11.2: ảnh TỰ KHAI nó là commit nào — GET /api trả "ban", nhãn OCI cho docker inspect. ARG đặt SAU mọi COPY
+# ⇒ đổi REVISION chỉ dựng lại tầng siêu dữ liệu, không làm mất cache npm/tsc. CI truyền --build-arg REVISION=&lt;sha&gt;.
+ARG REVISION=dev
+ENV APP_REVISION=\${REVISION}
+LABEL org.opencontainers.image.revision=\${REVISION}
 # Không chạy bằng root: ảnh node có sẵn người dùng "node" (uid 1000)
 USER node
 EXPOSE 41810
diff --git a/apps/api/src/services/info.service.ts b/apps/api/src/services/info.service.ts
index 75cc541..11e0c70 100644
--- a/apps/api/src/services/info.service.ts
+++ b/apps/api/src/services/info.service.ts
@@ -1,4 +1,5 @@
 // Service: logic nghiệp vụ, KHÔNG biết gì về req/res — gọi được từ route, từ test, từ script.
 export function layThongTin() {
-  return { ten: 'chiase-api', phienBan: '0.2.0' };
+  // ban: mã commit ảnh được dựng từ (Dockerfile đặt APP_REVISION lúc dựng). Smoke test bài 11.3 so nó với mã vừa deploy.
+  return { ten: 'chiase-api', phienBan: '0.2.0', ban: process.env.APP_REVISION ?? 'dev' };
 }
diff --git a/apps/web/Dockerfile b/apps/web/Dockerfile
index 2e8b293..5919320 100644
--- a/apps/web/Dockerfile
+++ b/apps/web/Dockerfile
@@ -15,3 +15,7 @@ RUN npm run build -w apps/web
 FROM nginx:1.30-alpine AS runtime
 COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
 COPY --from=build /app/apps/web/dist /usr/share/nginx/html
+# Bài 11.2: trang web cũng tự khai bản — smoke test so /ban.txt với mã commit vừa deploy (bản web cũ trong cache/ảnh cũ ⇒ lệch).
+ARG REVISION=dev
+LABEL org.opencontainers.image.revision=\${REVISION}
+RUN echo "\${REVISION}" &gt; /usr/share/nginx/html/ban.txt`;

const COMPOSE = `# ChiaSe trên VPS (bài 11.2). KHÁC compose.yaml của máy dev ở ba chỗ:
#   1. KHÔNG có "build:" — VPS không dựng gì, chỉ KÉO ảnh CI đã dựng, đúng một mã commit (TAG = 40 ký tự hex).
#   2. Chỉ "web" mở cổng, và chỉ trên 127.0.0.1 ⇒ Nginx của máy chủ (có TLS) là cửa DUY NHẤT ra Internet.
#      Mở "5432:5432" là Docker tự chèn luật iptables đi VÒNG qua ufw (bài 11.1 đo: ufw chặn mà vẫn vào được).
#   3. Việc một lần (migrate, chuẩn bị kho) nằm trong profile "migrate": "up" không đụng tới; deploy.sh chạy TRƯỚC khi tráo api.
# Biến lấy từ .env cùng thư mục (chmod 600, KHÔNG nằm trong git, KHÔNG nằm trong thư mục web phục vụ).
name: chiase

x-anh: &amp;anh-api \${REGISTRY:?đặt REGISTRY trong .env}/chiase-api:\${TAG:?deploy.sh đặt TAG = mã commit}

x-api-env: &amp;api-env
  NODE_ENV: production
  WEB_ORIGIN: https://\${DOMAIN:?đặt DOMAIN trong .env}
  DATABASE_URL: postgresql://chiase:\${POSTGRES_PASSWORD:?}@db:5432/chiase
  JWT_ACCESS_SECRET: \${JWT_ACCESS_SECRET:?}
  S3_ENDPOINT: http://kho:9000
  S3_PUBLIC_ENDPOINT: https://\${DOMAIN} # URL ký tải ảnh lên trỏ về chính tên miền (Nginx ⇒ web ⇒ /chiase/ ⇒ kho)
  S3_REGION: auto
  S3_BUCKET: chiase
  S3_ACCESS_KEY_ID: chiase
  S3_SECRET_ACCESS_KEY: \${MINIO_ROOT_PASSWORD:?}
  MEDIA_BASE_URL: https://\${DOMAIN}/chiase
  # HAI lớp proxy đáng tin: Nginx của máy chủ (TLS) ⇒ Nginx trong ảnh web ⇒ api. Đặt 1 là mọi người dùng
  # mang chung IP của Nginx máy chủ ⇒ một kẻ dò mật khẩu khoá luôn người khác (bài 11.2 đo).
  TRUST_PROXY: 2

x-gioi-han: &amp;gioi-han
  restart: unless-stopped
  logging: { driver: local, options: { max-size: 20m, max-file: '5' } }

services:
  db:
    image: postgres:18-alpine
    &lt;&lt;: *gioi-han
    mem_limit: 512m
    environment:
      POSTGRES_USER: chiase
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:?}
      POSTGRES_DB: chiase
    volumes:
      - pgdata:/var/lib/postgresql
    healthcheck:
      test: ['CMD', 'pg_isready', '-h', '127.0.0.1', '-U', 'chiase', '-d', 'chiase']
      interval: 2s
      timeout: 3s
      retries: 30

  kho:
    image: cgr.dev/chainguard/minio:latest
    &lt;&lt;: *gioi-han
    mem_limit: 384m
    command: ['server', '/data']
    environment:
      MINIO_ROOT_USER: chiase
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD:?}
      MC_HOST_local: http://chiase:\${MINIO_ROOT_PASSWORD}@127.0.0.1:9000
    volumes:
      - kho:/data
    healthcheck:
      test: ['CMD', 'mc', 'ready', 'local']
      interval: 2s
      timeout: 3s
      retries: 30

  # Ảnh api-migrate (tầng cong-cu, Chương 10 dựng sẵn): prisma migrate deploy — KHÔNG BAO GIỜ migrate dev/reset ở đây.
  migrate:
    image: \${REGISTRY}/chiase-api-migrate:\${TAG}
    profiles: [migrate]
    mem_limit: 512m
    environment: *api-env
    depends_on:
      db: { condition: service_healthy }

  kho-chuan-bi:
    image: \${REGISTRY}/chiase-api-migrate:\${TAG}
    profiles: [migrate]
    mem_limit: 512m
    environment: *api-env
    command: ['npm', 'run', 'kho:chuan-bi']
    depends_on:
      kho: { condition: service_healthy }

  api:
    image: *anh-api
    &lt;&lt;: *gioi-han
    mem_limit: 384m
    environment: *api-env
    depends_on:
      db: { condition: service_healthy }
      kho: { condition: service_healthy }

  web:
    image: \${REGISTRY}/chiase-web:\${TAG}
    &lt;&lt;: *gioi-han
    mem_limit: 64m
    ports:
      - 127.0.0.1:8080:80 # chỉ Nginx của máy chủ gọi được; Internet không thấy cổng này
    depends_on:
      api: { condition: service_healthy }

volumes:
  pgdata:
  kho:`;

const ENV_MAU = `# ~/chiase/.env TRÊN VPS (bài 11.2). Chép thành .env rồi điền; chmod 600 (deploy.sh từ chối chạy nếu không phải 600).
# KHÔNG bao giờ commit, KHÔNG đặt trong thư mục Nginx phục vụ. Mỗi giá trị bí mật sinh MỚI trên chính máy này:
#   openssl rand -base64 32 | tr -d '/+=' 
# REGISTRY=ghcr.io/ten-ban  — mô phỏng trong bài: registry.chiase.test:5000/chiase-team
REGISTRY=
DOMAIN=chiase.test
POSTGRES_PASSWORD=
MINIO_ROOT_PASSWORD=
JWT_ACCESS_SECRET=
# Tài khoản riêng cho smoke test — không phải tài khoản của ai, không có quyền gì đặc biệt
SMOKE_EMAIL=smoke@chiase.test
SMOKE_PASSWORD=`;

const TAO_ENV = `#!/usr/bin/env bash
# tao-env.sh — tạo ~/chiase/.env TRÊN VPS với bí mật sinh ngẫu nhiên tại chỗ (bài 11.2). KHÔNG in bí mật ra màn hình:
# bí mật đã hiện trên terminal là đã nằm trong scrollback, trong ảnh chụp màn hình, trong log của công cụ ghi phiên.
#   ./tao-env.sh &lt;REGISTRY&gt; &lt;DOMAIN&gt;
set -euo pipefail
cd "$(dirname "$0")"
[ -e .env ] &amp;&amp; { echo "✘ .env đã có — không ghi đè (đổi bí mật là việc có kế hoạch: bài deploy-4-5)"; exit 1; }
umask 077 # tệp tạo ra chỉ chủ đọc được NGAY TỪ ĐẦU (chmod sau thì có một khoảnh khắc người khác đọc được)
sinh() { openssl rand -base64 48 | tr -d "/+=\\n" | head -c 40; }
sed -e "s|^REGISTRY=.*|REGISTRY=\${1:?registry}|" -e "s|^DOMAIN=.*|DOMAIN=\${2:?domain}|" \\
    -e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$(sinh)|" -e "s|^MINIO_ROOT_PASSWORD=.*|MINIO_ROOT_PASSWORD=$(sinh)|" \\
    -e "s|^JWT_ACCESS_SECRET=.*|JWT_ACCESS_SECRET=$(sinh)|" -e "s|^SMOKE_EMAIL=.*|SMOKE_EMAIL=|" env.example &gt; .env
stat -c "%a %U %n" .env
awk -F= "!/^#/ &amp;&amp; NF { printf \\"  %-20s %s\\n\\", \\$1, (length(\\$2) ? length(\\$2) \\" ký tự\\" : \\"(trống)\\") }" .env`;

const NGINX_B = `$ scp -q chiase/deploy/nginx/chiase.conf root@chiase.test:/etc/nginx/sites-available/chiase &amp;&amp; ssh root@chiase.test nginx -t
2026/11/25 05:38:55 [emerg] 5048#5048: cannot load certificate "/etc/letsencrypt/live/chiase.test/fullchain.pem": BIO_new_file() failed (SSL: error:80000002:system library::No such file or directory:calling fopen(/etc/letsencrypt/live/chiase.test/fullchain.pem, r) error:10000080:BIO routines::no such file)
nginx: configuration file /etc/nginx/nginx.conf test failed`;

const CERT = `$ ssh root@chiase.test "cat /etc/nginx/sites-enabled/acme-tam &amp;&amp; nginx -t 2&gt;&amp;1 | tail -1 &amp;&amp; nginx &amp;&amp; echo nginx-chay"
server {
  listen 80;
  server_name chiase.test www.chiase.test;
  location ^~ /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 404; }
}
nginx: configuration file /etc/nginx/nginx.conf test is successful
nginx-chay

$ ssh root@chiase.test "certbot certonly --webroot -w /var/www/certbot -d chiase.test -d www.chiase.test --server https://pebble:14000/dir --email quan-tri@chiase.test --agree-tos --no-eff-email --non-interactive"
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Account registered.
Requesting a certificate for chiase.test and www.chiase.test

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/chiase.test/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/chiase.test/privkey.pem
This certificate expires on 2026-12-01.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$ ssh root@chiase.test "ls -l /etc/letsencrypt/live/chiase.test/; openssl x509 -in /etc/letsencrypt/live/chiase.test/cert.pem -noout -issuer -subject -dates -ext subjectAltName"
total 20
-rw-r--r--. 1 root root 692 Nov 25 05:39 README
lrwxrwxrwx. 1 root root  35 Nov 25 05:39 cert.pem -&gt; ../../archive/chiase.test/cert1.pem
lrwxrwxrwx. 1 root root  36 Nov 25 05:39 chain.pem -&gt; ../../archive/chiase.test/chain1.pem
lrwxrwxrwx. 1 root root  40 Nov 25 05:39 fullchain.pem -&gt; ../../archive/chiase.test/fullchain1.pem
lrwxrwxrwx. 1 root root  38 Nov 25 05:39 privkey.pem -&gt; ../../archive/chiase.test/privkey1.pem
issuer=CN = Pebble Intermediate CA 038227
subject=
notBefore=Nov 25 05:39:08 2026 GMT
notAfter=Dec  1 05:39:07 2026 GMT
X509v3 Subject Alternative Name: critical
    DNS:chiase.test, DNS:www.chiase.test

$ ssh root@chiase.test "rm /etc/nginx/sites-enabled/acme-tam &amp;&amp; ln -sf /etc/nginx/sites-available/chiase /etc/nginx/sites-enabled/chiase &amp;&amp; nginx -t &amp;&amp; nginx -s reload &amp;&amp; echo reload-ok"
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
reload-ok
2026/11/25 05:39:09 [notice] 5132#5132: signal process started`;

const PEBBLE_LOG = `2026/11/25 05:39:07 Attempting to validate w/ HTTP: http://chiase.test:80/.well-known/acme-challenge/IlVDyD3FrhVGCyLL0t5N9YO3RaYGG9DmbtxhS7NBIy8
2026/11/25 05:39:07 Attempting to validate w/ HTTP: http://www.chiase.test:80/.well-known/acme-challenge/XEgg-ouQVz4mTD7uglL1-feb1tB9W_sbKmkL8oJsiZg
2026/11/25 05:39:07 authz T6SZcTIxomjtb5sJL6sW84_t1dkF8YH7-rGUCBK1ilA set VALID by completed challenge POaPjhrWLhcCcih4Y84voyrb14DSx0Jj7TtWoZJhKVs
2026/11/25 05:39:07 authz lVNkpxl0nb4Vlun2WsgaufK3z3jyGcS17pi10oBcJBU set VALID by completed challenge uaCIOgnZCodaa3aB2a1zGzsovMWRYM70edRHlqeqyPo
2026/11/25 05:39:08 Issued certificate serial 5ba1ffa12f2542c1 for order -EDmLCnJwxP-6QMq5xSMq9tmCF_nIxRn2ya_kbLZCb0`;

const NGINX_CONF = `# /etc/nginx/sites-available/chiase — Nginx CỦA MÁY CHỦ, cửa duy nhất ra Internet (bài 11.2).
# Nó làm ba việc container không nên tự làm: giữ chứng chỉ TLS, giới hạn tần suất theo IP thật, gắn header bảo mật.
# Sau nó còn Nginx trong ảnh web (127.0.0.1:8080) ⇒ API thấy HAI lớp proxy ⇒ TRUST_PROXY=2.

# Giới hạn ĐỌC (lời hứa bài 5.2): 10 request/giây mỗi IP cho /api, cho phép dồn 20. Vượt ⇒ 429 (mặc định là 503,
# trông như máy chủ sập). Đăng nhập đã có giới hạn riêng trong API (bài 3.3).
limit_req_zone $binary_remote_addr zone=api_doc:10m rate=10r/s;
limit_req_status 429;

# Cổng 80: CHỈ để ACME http-01 kiểm tên miền + chuyển mọi thứ khác sang https.
server {
  listen 80;
  listen [::]:80;
  server_name chiase.test www.chiase.test;

  location ^~ /.well-known/acme-challenge/ {
    root /var/www/certbot; # certbot --webroot ghi tệp thử thách vào đây
  }
  location / {
    return 301 https://chiase.test$request_uri;
  }
}

server {
  # "http2 on;" chỉ có từ Nginx 1.25.1 — Ubuntu 24.04 cài 1.24.0 ⇒ "unknown directive http2" (bài 11.2 đo).
  # Cách viết cũ dưới đây chạy được cả hai (bản mới chỉ cảnh báo "deprecated").
  listen 443 ssl http2;
  listen [::]:443 ssl http2;
  server_name chiase.test;

  ssl_certificate /etc/letsencrypt/live/chiase.test/fullchain.pem; # fullchain: chứng chỉ + CA trung gian
  ssl_certificate_key /etc/letsencrypt/live/chiase.test/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  # HSTS: trình duyệt nhớ "chỉ https" trong max-age giây. Bắt đầu NHỎ (300 = 5 phút); chạy ổn vài tuần mới nâng lên
  # 31536000. Đặt một năm ngay ngày đầu mà chứng chỉ hỏng = người dùng không có nút "vẫn vào" trong một năm.
  add_header Strict-Transport-Security "max-age=300" always;
  # CSP (lời hứa bài 6.2/6.3): chỉ chạy script của CHÍNH trang. Một lỗ XSS lọt qua React vẫn không nạp được script lạ.
  add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self' wss://chiase.test; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;

  client_max_body_size 6m; # ảnh tối đa 5 MiB (bài 4.2) — mặc định 1m ⇒ 413 trước khi tới kho (bài 9.3)

  # Header chung cho mọi khối proxy dưới đây. $http_host giữ nguyên Host như trình duyệt gửi (chữ ký URL tải ảnh lên).
  proxy_set_header Host $http_host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto https;

  location ^~ /api/ {
    limit_req zone=api_doc burst=20 nodelay;
    proxy_pass http://127.0.0.1:8080;
  }

  location ^~ /socket.io/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 1h; # mặc định 60 s ⇒ socket im lặng một phút là bị cắt
  }

  location / {
    proxy_pass http://127.0.0.1:8080;
  }
}

# www ⇒ tên chính (cùng chứng chỉ, có cả www trong SAN)
server {
  listen 443 ssl;
  listen [::]:443 ssl;
  server_name www.chiase.test;
  ssl_certificate /etc/letsencrypt/live/chiase.test/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/chiase.test/privkey.pem;
  return 301 https://chiase.test$request_uri;
}`;

const RENEW = `$ ssh root@chiase.test "certbot renew --dry-run 2&gt;&amp;1 | tail -4; cat /etc/cron.d/certbot | grep -v ^#"
  /etc/letsencrypt/live/chiase.test/fullchain.pem (failure)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1 renew failure(s), 0 parse failure(s)
Ask for help or search for solutions at https://community.letsencrypt.org. See the logfile /var/log/letsencrypt/letsencrypt.log or re-run Certbot with -v for more details.
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
0 */12 * * * root test -x /usr/bin/certbot -a \\! -d /run/systemd/system &amp;&amp; perl -e 'sleep int(rand(43200))' &amp;&amp; certbot -q renew --no-random-sleep-on-renew
$ ssh root@chiase.test "grep -m1 -o \\"Cannot issue for[^(]*\\" /var/log/letsencrypt/letsencrypt.log"
Cannot issue for \\"chiase.test\\": Domain name does not end with a valid public suffix 

$ ssh root@chiase.test "certbot renew --force-renewal --deploy-hook \\"nginx -s reload\\""   # không có terminal
(treo... log ghi: Non-interactive renewal: random delay of 392 giây — Ctrl-C)

$ ssh root@chiase.test "certbot renew --force-renewal --no-random-sleep-on-renew --deploy-hook \\"nginx -s reload\\" 2&gt;&amp;1 | grep -E \\"Renewing|success|hook\\"; openssl x509 -in /etc/letsencrypt/live/chiase.test/cert.pem -noout -serial -enddate"
Renewing an existing certificate for chiase.test and www.chiase.test
Hook 'deploy-hook' ran with error output:
  /etc/letsencrypt/live/chiase.test/fullchain.pem (success)
serial=7A6EFB82980101C1
notAfter=Feb 23 05:50:39 2027 GMT`;

const DEPLOY1 = `$ ssh deployer@chiase.test mkdir -p chiase &amp;&amp; scp -q -r chiase/deploy/. deployer@chiase.test:chiase/ &amp;&amp; ssh deployer@chiase.test ls chiase
compose.prod.yaml
deploy.sh
don-refresh.sh
env.example
nginx
smoke.sh
tao-env.sh

$ ssh deployer@chiase.test chiase/tao-env.sh registry.chiase.test:5000/chiase-team chiase.test
600 deployer .env
  REGISTRY             37 ký tự
  DOMAIN               11 ký tự
  POSTGRES_PASSWORD    40 ký tự
  MINIO_ROOT_PASSWORD  40 ký tự
  JWT_ACCESS_SECRET    40 ký tự
  SMOKE_EMAIL          (trống)
  SMOKE_PASSWORD       (trống)

$ ssh deployer@chiase.test chiase/deploy.sh latest
[05:39:56] ✘ 'latest' không phải mã commit đầy đủ (40 ký tự hex). Không deploy 'latest' hay tag tự đặt: không ai trả lời được 'đang chạy mã nào?' 2

$ ssh deployer@chiase.test "time chiase/deploy.sh 0e0a2cba7f3476e4341b813474bb6340d834f2db"
[05:39:57] 1/6 kéo ảnh 0e0a2cba7f34 từ registry.chiase.test:5000/chiase-team
 Image registry.chiase.test:5000/chiase-team/chiase-web:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulling 
 Image registry.chiase.test:5000/chiase-team/chiase-api-migrate:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulling 
 Image registry.chiase.test:5000/chiase-team/chiase-api:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulling 
 Image registry.chiase.test:5000/chiase-team/chiase-web:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulled 
 Image registry.chiase.test:5000/chiase-team/chiase-api:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulled 
 Image registry.chiase.test:5000/chiase-team/chiase-api-migrate:0e0a2cba7f3476e4341b813474bb6340d834f2db Pulled 
[05:40:12] 2/6 kiểm ảnh tự khai đúng commit
[05:40:12]     api, api-migrate, web đều khai 0e0a2cba7f34
[05:40:12] 3/6 sao lưu CSDL trước khi migrate
[05:40:12]     CSDL chưa chạy (lần deploy đầu) — không có gì để sao lưu
[05:40:12] 4/6 migrate (prisma migrate deploy)
  … (12 dòng tiến độ/trạng thái, lược bớt)
Loaded Prisma config from prisma.config.ts.

  … (4 dòng tiến độ/trạng thái, lược bớt)
Datasource "db": PostgreSQL database "chiase", schema "public" at "db:5432"
Prisma schema loaded from prisma/schema.prisma.

7 migrations found in prisma/migrations

Applying migration \`20261124120000_init_users\`
Applying migration \`20261124120015_users_db_defaults\`
Applying migration \`20261124122750_refresh_tokens\`
Applying migration \`20261124130621_posts\`
Applying migration \`20261124134442_comments\`
Applying migration \`20261124135157_ms_timestamps\`
Applying migration \`20261124153747_likes\`

The following migration(s) have been applied:

  … (15 dòng tiến độ/trạng thái, lược bớt)

All migrations have been successfully applied.
  … (5 dòng tiến độ/trạng thái, lược bớt)
 Image cgr.dev/chainguard/minio:latest Pulling 
  … (220 dòng tiến độ/trạng thái, lược bớt)
 Image cgr.dev/chainguard/minio:latest Pulled 
  … (10 dòng tiến độ/trạng thái, lược bớt)
.env not found. Continuing without it.
.env not found. Continuing without it.
  … (5 dòng tiến độ/trạng thái, lược bớt)
[05:40:41] 5/6 tráo api + web
  … (24 dòng tiến độ/trạng thái, lược bớt)
[05:40:47] 6/6 smoke test từ https://chiase.test
  ✔ GET /api/health → 200
  ✘ API khai bản '' (cần 0e0a2cba7f34, mã 301)
  ✔ web khai bản 0e0a2cba7f34
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✘ WebSocket /socket.io → 400 (cần 101)
  ⚠ bỏ qua lượt ghi: chưa khai SMOKE_EMAIL trong .env (chỉ chấp nhận ở lần deploy ĐẦU TIÊN)
SMOKE ĐỎ: 2 phép kiểm hỏng
[05:40:48] ✘ không có bản trước để lùi về 5

real	0m51.024s
user	0m0.727s
sys	0m0.264s`;

const DEPLOY2 = `$ cd chiase &amp;&amp; git log --oneline -1 &amp;&amp; scp -q deploy/*.sh deploy/compose.prod.yaml deployer@chiase.test:chiase/
30722f7 Ch11: smoke — /api/ có gạch chéo, Sec-WebSocket-Key đúng 16 byte (bộ kiểm báo đỏ oan ở lần deploy đầu)

$ ssh deployer@chiase.test "chiase/deploy.sh 30722f7fd864ca4c495359cb600888854f83481e 2&gt;&amp;1 | grep -E \\"^\\\\[|✔|✘|⚠|SMOKE\\""
[05:41:51] 1/6 kéo ảnh 30722f7fd864 từ registry.chiase.test:5000/chiase-team
[05:41:53] 2/6 kiểm ảnh tự khai đúng commit
[05:41:53]     api, api-migrate, web đều khai 30722f7fd864
[05:41:53] 3/6 sao lưu CSDL trước khi migrate
[05:41:53]     sao-luu/20261125T054153Z-truoc-30722f7fd864.dump (16K, 6 bảng có dữ liệu)
[05:41:53] 4/6 migrate (prisma migrate deploy)
[05:41:58] 5/6 tráo api + web
[05:42:05] 6/6 smoke test từ https://chiase.test
  ✔ GET /api/health → 200
  ✔ API khai bản 30722f7fd864
  ✔ web khai bản 30722f7fd864
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ⚠ bỏ qua lượt ghi: chưa khai SMOKE_EMAIL trong .env (chỉ chấp nhận ở lần deploy ĐẦU TIÊN)
SMOKE XANH 30722f7fd864
[05:42:09] ✔ đang chạy 30722f7fd864 (trước đó: )`;

const SMOKE_TK = `$ ssh deployer@chiase.test bash &lt; tao-tai-khoan-smoke.sh
đăng ký → 202

$ ssh deployer@chiase.test chiase/smoke.sh https://chiase.test 30722f7fd864ca4c495359cb600888854f83481e
  ✔ GET /api/health → 200
  ✔ API khai bản 30722f7fd864
  ✔ web khai bản 30722f7fd864
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE XANH 30722f7fd864

$ ssh deployer@chiase.test chiase/smoke.sh https://chiase.test 30722f7fd864ca4c495359cb600888854f83481e   # lần 2: dùng cookie refresh, không đăng nhập lại
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE XANH 30722f7fd864
-rw-------`;

const NGOAI = `$ curl -sS -o /dev/null -w "%{http_code} → %{redirect_url}\\n" http://chiase.test/bai/123
301 → https://chiase.test/bai/123

$ curl -sS -o /dev/null -w "%{http_code} → %{redirect_url}\\n" https://www.chiase.test/
301 → https://chiase.test/

$ curl -sS -I https://chiase.test/ | grep -iE "^(HTTP|strict|content-security|x-content|referrer|cache-control)"
HTTP/2 200 
cache-control: no-cache
strict-transport-security: max-age=300
content-security-policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self' wss://chiase.test; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin

$ echo | openssl s_client -connect chiase.test:443 -servername chiase.test 2&gt;/dev/null | grep -E "^(depth|verify return| *[0-9] s:|Verification)" | head -6
 0 s:
 1 s:CN = Pebble Intermediate CA 038227
Verification: OK

$ curl -sS -o /dev/null -w "%{http_version} %{http_code}\\n" https://chiase.test/
2 200

$ for p in /.env /.git/config /chiase/.env /api/../.env; do printf "%-16s %s\\n" $p $(curl -s -o /dev/null -w %{http_code} --path-as-is https://chiase.test$p); done
/.env            404
/.git/config     200
/chiase/.env     403
/api/../.env     404

$ curl -s -o /dev/null -w "%{http_code} %{content_type} %{size_download} byte\\n" https://chiase.test/.git/config
200 text/html 456 byte

$ curl -s https://chiase.test/.git/config | head -2
&lt;!doctype html&gt;
&lt;html lang="vi"&gt;`;

const CSP = `$ curl -sI https://chiase.test/thu-csp | grep -ciE "^(content-security-policy|strict-transport)"
2
Chrome mở /thu-csp ⇒ đoạn &lt;p id=k&gt;: chưa

$ curl -sI https://chiase.test/thu-csp-2 | grep -ciE "^(content-security-policy|strict-transport)"
0
Chrome mở /thu-csp-2 ⇒ đoạn &lt;p id=k&gt;: SCRIPT CHÈN VÀO ĐÃ CHẠY`;

const TRUST = `## TRUST_PROXY=2 (đúng: Nginx máy chủ + Nginx trong ảnh web)
TRUST_PROXY: 2
ke-la dò mật khẩu của nạn nhân: 401 401 401 401 401 401 401 401 401 401 429 
an (máy khác) đăng nhập ĐÚNG mật khẩu: 200

## TRUST_PROXY=1 (đếm thiếu một lớp)
TRUST_PROXY: 1
ke-la dò mật khẩu của nạn nhân: 401 401 401 401 401 401 401 401 401 401 429 
an (máy khác) đăng nhập ĐÚNG mật khẩu: 429
  log api (2 dòng cuối):
  2026-11-25T05:43:55.704Z 3c6f57bc-b954-4084-8a03-d247cb46c84d POST /api/auth/login 429 0.8ms
  2026-11-25T05:43:55.794Z f5d38537-22e5-4f7e-bc8b-1f19526a2953 POST /api/auth/login 429 0.8ms

## TRUST_PROXY=3 (đếm thừa một lớp) — ke-la tự ghi X-Forwarded-For giả, mỗi lần một IP
TRUST_PROXY: 3
ke-la dò kèm XFF giả: 401 401 401 401 401 401 401 401 401 401 401 

(đã trả về TRUST_PROXY: 2)`;

const LIMIT = `$ # ke-la: 60 request GET /api/posts dồn dập (10 luồng song song)
$ seq 60 | xargs -P10 -I{} curl -s -o /dev/null -w "%{http_code}\\n" "https://chiase.test/api/posts?limit=1" | sort | uniq -c
     45 200
     15 429
laptop ngay sau: 200
ke-la ngay sau: 200
ke-la 2 giây sau: 200

$ ssh root@chiase.test tail -2 /var/log/nginx/error.log
2026/11/25 05:44:27 [error] 5142#5142: *333 limiting requests, excess: 20.050 by zone "api_doc", client: 172.27.0.6, server: chiase.test, request: "GET /api/posts?limit=1 HTTP/2.0", host: "chiase.test
2026/11/25 05:44:27 [error] 5143#5143: *332 limiting requests, excess: 20.030 by zone "api_doc", client: 172.27.0.6, server: chiase.test, request: "GET /api/posts?limit=1 HTTP/2.0", host: "chiase.test`;

const STATS = `$ ssh deployer@chiase.test docker stats --no-stream --format "table {{.Name}}	{{.MemUsage}}	{{.CPUPerc}}"
NAME           MEM USAGE / LIMIT   CPU %
chiase-web-1   10.68MiB / 64MiB    0.00%
chiase-api-1   83.3MiB / 384MiB    10.67%
chiase-kho-1   70.84MiB / 384MiB   0.02%
chiase-db-1    38.69MiB / 512MiB   4.09%
$ ssh deployer@chiase.test "docker system df; df -h /var/lib/docker | tail -1"
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          9         4         2.131GB   13.89MB (0%)
Containers      4         4         24.58kB   0B (0%)
Local Volumes   4         2         131.2MB   81.61MB (62%)
Build Cache     0         0         0B        0B
(cả "VPS" mô phỏng đang dùng 1071 MiB RAM)`;


const NGUON = [
  nguon('🔏', 'Pebble — máy chủ ACME thu nhỏ để thử, của Let’s Encrypt', 'github.com/letsencrypt/pebble', 'https://github.com/letsencrypt/pebble'),
  nguon('📜', 'Certbot — User Guide (webroot, renew, --dry-run)', 'eff-certbot.readthedocs.io', 'https://eff-certbot.readthedocs.io/en/stable/using.html'),
  nguon('🧭', 'nginx — add_header (chỉ kế thừa khi khối hiện tại KHÔNG khai add_header nào)', 'nginx.org', 'https://nginx.org/en/docs/http/ngx_http_headers_module.html#add_header'),
  nguon('🕵️', 'Unit 42 — Leaked Environment Variables Allow Large-Scale Extortion Operation in Cloud Environments (15/08/2024)', 'unit42.paloaltonetworks.com', 'https://unit42.paloaltonetworks.com/large-scale-cloud-extortion-operation/'),
  nguon('⚙️', 'Express — Express behind proxies (trust proxy là SỐ lớp)', 'expressjs.com', 'https://expressjs.com/en/guide/behind-proxies.html'),
].join('\n');

const THE = [
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-12-1-ten-mien-dns', title: 'Deploy VPS 12.1 — Tên miền và DNS: ai giữ cái gì, và vì sao đổi IP rồi vẫn thấy máy cũ', sub: 'Bản ghi A, TTL, bộ đệm DNS.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-12-2-reverse-proxy-tls', title: 'Deploy VPS 12.2 — Reverse proxy và HTTPS: chứng chỉ từ ACME, gia hạn', sub: 'ACME từng bước, http-01 và dns-01.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-13-1-compose-tren-vps', title: 'Deploy VPS 13.1 — Compose trên VPS: một tệp mô tả cả cái máy', sub: 'Cùng hình dạng compose.prod.yaml của bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-4-1-cau-hinh-song-ngoai-tao-tac', title: 'Deploy VPS 4.1 — Cấu hình sống ngoài tạo tác', sub: 'Vì sao .env nằm trên máy chủ, không nằm trong ảnh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-6-5-chuyen-huong-va-hsts', title: 'Nginx 6.5 — Chuyển hướng sang HTTPS, HSTS, và việc gia hạn nó', sub: 'Vì sao max-age bắt đầu nhỏ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-7-1-limit-req', title: 'Nginx 7.1 — limit_req: ba chế độ burst', sub: 'Đào sâu con số 45/15 đo ở mục 9.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nginx', bai: 'nginx-3-5-websocket', title: 'Nginx 3.5 — WebSocket: cú nâng cấp mà Nginx CỐ Ý gỡ đi', sub: 'Vì sao khối /socket.io/ phải tự khai lại Upgrade.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.2 — Deploying the containers and wiring domain + HTTPS|||11.2 — Deploy container và gắn domain + HTTPS',
  slug: 'fp-11-2-deploy-domain',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đưa ChiaSe lên VPS đúng như ảnh CI đã dựng: ảnh tự khai mã commit (GET /api "ban", /ban.txt), compose.prod.yaml chỉ KÉO ảnh theo SHA và chỉ mở 127.0.0.1:8080, .env sinh tại chỗ mode 600, tên miền trỏ về máy, Nginx của máy chủ giữ TLS (cấp chứng chỉ bằng luồng ACME http-01 thật với Pebble + certbot — kèm bốn cú vấp đo được: Nginx 1.24 không hiểu "http2 on", chứng chỉ chưa có thì nginx -t đỏ, --dry-run gọi máy chủ staging thật, gia hạn không terminal ngủ ngẫu nhiên tới 8 phút), HSTS + CSP (và cái add_header làm CSP biến mất), giới hạn đọc ở Nginx (lời hứa bài 5.2), TRUST_PROXY = 2 đo bằng một kẻ dò mật khẩu khoá oan người khác. Lần deploy đầu ĐỎ — vì chính smoke test sai.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Deploy</span>
<h2>From "CI built an image" to "a stranger opens https://chiase.test"</h2>
<p class="lead">Chapter 10 ended with three images in a registry, tagged with a commit SHA. This lesson gets them onto the VPS from 11.1 and in front of users: a name that points to the machine, a certificate, a reverse proxy that is the only door, secrets that never leave the server, and a deploy command that refuses anything but a full SHA. The first real deploy goes red — and the bug is in the checker.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">name</span><span class="lz-d">A records, TTL 300 while building</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">images</span><span class="lz-d">bake the SHA: /api/ ban, /ban.txt</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">secrets</span><span class="lz-d">generated on the server, umask 077</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">TLS</span><span class="lz-d">bootstrap :80 ⇒ http-01 ⇒ real config ⇒ test renewal</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">deploy</span><span class="lz-d">pull by SHA ⇒ … ⇒ smoke</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">outside</span><span class="lz-d">headers, CSP, TRUST_PROXY, limits — measured</span></div>
</div>


<pre><code class="language-mermaid">flowchart LR
  U[Browser] -- "DNS: chiase.test ⇒ VPS" --> N["Nginx on the VPS :443<br/>TLS · HSTS · CSP · limit_req"]
  N -- "127.0.0.1:8080" --> W["web container<br/>Nginx: static + proxy"]
  W -- "/api /socket.io" --> A[api]
  W -- "/chiase/ (images)" --> K[(MinIO)]
  A --> D[(PostgreSQL)]
  A --> K</code></pre>
<p>Two Nginx on purpose: the one <em>inside</em> the web image (Chapter 9) knows the app (SPA fallback, cache headers, which paths go to the API); the one <em>on the VPS</em> knows the Internet (certificates, rate limits, security headers). Swapping the app never touches certificates, and renewing a certificate never touches the app.</p>

<h3>1. A name for the machine</h3>
<p>At your registrar (or Cloudflare) create two records: <code>A chiase.test → VPS IP</code> and <code>A www.chiase.test → VPS IP</code> (or a CNAME for www). TTL: 300 seconds while you are setting things up, so a mistake is fixed in five minutes; raise it later. Check from your laptop before doing anything that depends on it — Let's Encrypt will look the name up from the Internet, not from your machine:</p>
<div class="out">${DNS.split('\n\n')[0]}</div>
<p>(In the simulation, the Docker network's DNS plays the registrar.)</p>

<h3>2. Images that say which commit they are</h3>
<p>"Which code is running?" must have a one-word answer. Chapter 10 tagged images with the SHA; that proves what you <em>pushed</em>, not what is <em>answering</em>. A stale container, a cache, a wrong tag — all look fine until someone asks the running process. So the build bakes the SHA in, and both the API and the web page report it:</p>
<pre><code class="language-diff">${TU_KHAI}</code></pre>
<p>The <code>ARG</code> sits after every <code>COPY</code>, so a new SHA rebuilds only a metadata layer (the simulated CI rebuilt all three images in 7–9 s when only <code>deploy/</code> changed).</p>

<h3>3. compose.prod.yaml: pull, never build</h3>
<pre><code class="language-yaml">${COMPOSE}</code></pre>
<p>Read it against the dev <code>compose.yaml</code> of lesson 9.3: no <code>build:</code>, every image is <code>…:\${TAG}</code> where <code>TAG</code> must be set (the deploy script sets it to the SHA), the database and object store publish nothing, the web container publishes only on loopback, logs have a ceiling, and migrations live in a profile so that <code>up</code> can never run them by accident.</p>

<h3>4. Secrets are born on the server</h3>
<p>The VPS gets <code>deploy/</code> from the repo (compose file, scripts, Nginx config) — <em>not</em> the source code, and not a <code>.env</code> from your laptop. Secrets are generated on the machine that uses them and never printed:</p>
<pre><code class="language-bash">${TAO_ENV}</code></pre>
<pre><code class="language-ini">${ENV_MAU}</code></pre>
<p><code>umask 077</code> before writing, not <code>chmod</code> after: between "create" and "chmod" the file exists readable by everyone. The script shows lengths, never values — a secret that appeared on a terminal lives on in scrollback, screen recordings and session logs.</p>

<h3>5. A certificate, and four stumbles on the way</h3>
<p>Install Nginx and certbot from Ubuntu (<code>apt install nginx certbot</code>), copy the site config from the repo, test it:</p>
<div class="out">${DNS.split('\n\n').slice(1).join('\n\n')}</div>
<p><strong>Stumble 1:</strong> <code>http2 on;</code> exists only since Nginx 1.25.1; Ubuntu 24.04 ships 1.24.0. The config now uses <code>listen 443 ssl http2;</code>, which both versions accept. Lesson: the docs you read describe the newest version; your server runs the distribution's. <code>nginx -v</code> first.</p>
<div class="out">${NGINX_B}</div>
<p><strong>Stumble 2:</strong> the config refers to a certificate that does not exist yet, and the certificate needs a running Nginx to answer the ACME challenge. Break the circle with a temporary site that only serves <code>/.well-known/acme-challenge/</code>, get the certificate, then switch:</p>
<div class="out">${CERT}</div>
<p>What happened on the other side — the CA connected to <em>your</em> port 80 by name, fetched the token certbot had written into <code>/var/www/certbot</code>, and only then signed (Pebble's log):</p>
<div class="out">${PEBBLE_LOG}</div>
<p>That is the whole idea of http-01: "prove you control the name by serving a file the CA chose, at that name, on port 80". It is also why port 80 must stay open even though every user is redirected to 443. (In the simulation the CA is Pebble — Let's Encrypt's test server — so <code>--server https://pebble:14000/dir</code>. Against real Let's Encrypt you drop that flag.)</p>
<p>The final site config, every line commented with the measurement that justifies it:</p>
<pre><code class="language-nginx">${NGINX_CONF}</code></pre>
<p><strong>Stumbles 3 and 4 — renewal.</strong> A 90-day certificate that does not renew takes the whole site down on day 91, at night. Test renewal now:</p>
<div class="out">${RENEW}</div>
<p><code>--dry-run</code> does not use the server you configured: it talks to the <em>real Let's Encrypt staging</em> server (the log shows <code>acme-staging-v02.api.letsencrypt.org</code>), which refuses a fake <code>.test</code> name — on a real domain it would have passed. And a renewal started without a terminal sleeps a random time first (here 392 s) so that millions of servers don't hit Let's Encrypt at the same second — the cron entry already passes <code>--no-random-sleep-on-renew</code> after its own random sleep. The real renewal went through Pebble and installed a new serial. <code>--deploy-hook "nginx -s reload"</code> is what makes Nginx pick up the new file; without it the old certificate stays in memory until the next restart. (The "error output" line is just Nginx printing its <code>signal process started</code> notice to stderr.)</p>

<h3>6. The first deploy — red, and the bug is ours</h3>
<p>The deploy script (full text in 11.3) does six things in order: pull the three images by SHA ⇒ check each image's revision label equals that SHA ⇒ back up the database ⇒ run migrations ⇒ swap api + web and wait for healthy ⇒ smoke test, and roll back if it fails. First it refuses what people type when tired:</p>
<div class="out">${DEPLOY1}</div>
<p>Two red checks on the very first deploy, and both were <strong>bugs in <code>smoke.sh</code></strong>, not in ChiaSe:</p>
<ul>
<li><code>GET /api</code> → 301: the VPS Nginx matches <code>location ^~ /api/</code> — with the slash. Bare <code>/api</code> fell through to <code>location /</code>. Users never call <code>/api</code>; the checker did.</li>
<li>WebSocket → 400 <code>Missing or invalid Sec-WebSocket-Key header</code>: the key must be base64 of exactly 16 bytes (RFC 6455). The made-up key was 19 bytes.</li>
</ul>
<p>And because it was the first deploy there was nothing to roll back to. After fixing the checker (new commit, new SHA — the scripts on the server come from the repo too):</p>
<div class="out">${DEPLOY2}</div>
<p>Then create the smoke account once, without the password ever appearing on a command line (<code>ps</code> shows arguments to every user on the machine):</p>
<div class="out">${SMOKE_TK}</div>
<div class="pitfall co-tieu-de"><p class="tieu-de">Pitfall: a red check is a claim about the system <em>or</em> about the check</p><p>Before "fixing" the app because a monitor says so, reproduce the failing request by hand. Here two minutes with <code>curl -i</code> showed a 301 from Nginx and a 400 with an explicit message — the app was fine. The same rule made Checkpoints 9 and 10 trustworthy.</p></div>

<h3>7. What a user (and a scanner) sees</h3>
<div class="out">${NGOAI}</div>
<p>Redirects keep the path (<code>/bai/123</code> stays <code>/bai/123</code>), <code>www</code> folds into the main name, HTTP/2 is on, the chain is the site certificate plus the intermediate (that is what <code>fullchain.pem</code> is for). Note <code>/.git/config → 200</code>: a naive scanner would report a leak, but it is the SPA's <code>index.html</code> (456 bytes of <code>text/html</code>) — a 200 means nothing until you look at the body. A real leak is a 200 with the file's content, which cannot happen here: the web image contains only the built <code>dist/</code>, and <code>.env</code> lives in <code>~/chiase</code>, a directory no Nginx serves.</p>

<h3>🕵️ Hacker's corner — 110,000 domains with a readable .env</h3>
<p>Unit 42 (Palo Alto Networks, 15 August 2024) described an extortion campaign that simply requested <code>/.env</code> from 110,000 domains (out of "more than 230 million unique targets" scanned), collected "over 90,000 unique variables" — 7,000 of them cloud credentials — then used AWS keys to create an admin role, copy S3 buckets, empty them and leave a ransom note. No exploit, no zero-day: a web server whose document root contained the project folder. Defence: the served directory contains only build output (Chapter 9's image); secrets live outside any served path with mode 600; long-lived cloud keys are replaced by short-lived roles where possible; and you test the paths yourself — section 7 does.</p>

<h3>8. CSP works — until one location adds a header</h3>
<p>Lessons 6.2/6.3 promised a Content Security Policy as the second wall behind React's escaping. To prove it blocks something, a throw-away page with an inline script was added to the VPS Nginx twice: once plain, once with one extra <code>add_header</code> in its <code>location</code>. Headless Chrome opened both:</p>
<div class="out">${CSP}</div>
<p>With CSP the injected script did not run. In the second location, adding <em>one</em> header (<code>Cache-Control</code>) silently removed <em>all</em> server-level headers — CSP and HSTS included: Nginx inherits <code>add_header</code> from the outer block only if the inner block declares none. The real ChiaSe page also loaded cleanly under the policy (React rendered the feed, no CSP violation), because Vite emits external scripts and styles only. Rule: a location that needs its own header repeats the security headers (or put them in an <code>include</code> file).</p>

<h3>9. TRUST_PROXY: count the hops, then prove the count</h3>
<p>Requests reach the API through two proxies (VPS Nginx ⇒ web Nginx), so <code>TRUST_PROXY: 2</code>. Test: a stranger (ke-la) guesses a password 11 times; then An, from a different machine, logs in with the right password.</p>
<div class="out">${TRUST}</div>
<ul>
<li><strong>2 (correct):</strong> the stranger is blocked after 10 attempts; An gets in.</li>
<li><strong>1 (one hop short):</strong> the API sees every user as the VPS's own address ⇒ one shared counter ⇒ the stranger locks <em>An</em> out. A five-line script becomes a denial of service against your login page.</li>
<li><strong>3 (one hop too many):</strong> the API trusts the first <code>X-Forwarded-For</code> entry, which the client writes itself ⇒ a fake IP per request ⇒ the limit never triggers.</li>
</ul>
<p>Behind Cloudflare it becomes 3 — every new proxy changes the number, and this test is how you find out.</p>

<h3>10. A limit for reads (promised in 5.2)</h3>
<p>The API limits logins; nothing limited reads, so one script could page through the whole feed as fast as the database answers. Now the VPS Nginx allows 10 requests/s per IP with a burst of 20:</p>
<div class="out">${LIMIT}</div>
<p>45 = 1 + 20 burst + what refilled during the second it took; the other user is unaffected; the limit forgets in a fraction of a second. <code>limit_req_status 429</code> matters: the default is 503, which looks like an outage in every dashboard.</p>

<h3>11. What it costs to run</h3>
<div class="out">${STATS}</div>
<p>About 200 MiB for the four containers at rest; images are the disk cost (2.1 GB after several releases — lesson 11.3 keeps that in check). This is the measurement behind the sizing table of 11.1.</p>

<h3>12. Moving images to Cloudflare R2 (promise of 4.2/4.3)</h3>
<p>Not run here (no real account is used in this course), but the code needs no change — only configuration: <code>S3_ENDPOINT=https://&lt;account&gt;.r2.cloudflarestorage.com</code>, <code>S3_PUBLIC_ENDPOINT</code> empty (browsers upload straight to R2 with the presigned URL), <code>MEDIA_BASE_URL=https://media.chiase.test</code> (a custom domain on the bucket, cached by Cloudflare). Two new obligations: a CORS rule on the bucket allowing <code>PUT</code> from <code>https://chiase.test</code> (the browser now uploads cross-origin), and <code>img-src</code>/<code>connect-src</code> in the CSP extended to the media domain — otherwise section 8's policy blocks your own images.</p>

<h3>🧪 Lab 11.2 — the stranger, the hops and the header</h3>
<div class="callout ok">
<ol>
<li>Deploy your stack with <code>compose.prod.yaml</code>; from your laptop show <code>/api/</code> and <code>/ban.txt</code> report the SHA you deployed.</li>
<li>From a second machine (a phone hotspot works), make 11 bad logins; then log in correctly from your laptop. Repeat with <code>TRUST_PROXY</code> one too low and one too high. Write the three results in your README.</li>
<li>Add <code>add_header X-Lab 1;</code> inside <code>location /api/</code>. Which headers disappear from <code>curl -sI https://your-domain/api/health</code>? Fix it without removing <code>X-Lab</code>.</li>
<li>Run <code>certbot renew --dry-run</code> on your real domain and explain each line of the output.</li>
</ol>
<p><strong>Done when:</strong> all four results are in your README with the commands that produced them.</p>
</div>
<details><summary>Solution</summary>
<ol>
<li><code>curl -s https://your-domain/api/ | grep -o '"ban":"[^"]*"'</code> and <code>curl -s https://your-domain/ban.txt</code> — both must equal <code>cat ~/chiase/.ban-dang-chay</code> on the server.</li>
<li>Expected: correct number ⇒ 401×10, 429, then you 200; too low ⇒ you 429; too high ⇒ with a forged <code>X-Forwarded-For</code> the stranger never sees 429.</li>
<li>Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options and Referrer-Policy all vanish from <code>/api/</code>. Fix: move the four security headers into <code>/etc/nginx/snippets/bao-mat.conf</code> and <code>include</code> it in the server block <em>and</em> in every location that has its own <code>add_header</code>.</li>
<li>On a real domain: "Simulating renewal…", a challenge against the staging CA, "Congratulations, all simulated renewals succeeded". Nothing is installed — it only proves the next real renewal can work.</li>
</ol>
</details>

${spring(true, 'The VPS side is identical. In Spring Boot the "trust proxy" setting is server.forward-headers-strategy=native (Tomcat RemoteIpValve) plus the list of trusted proxies; the same three-way test applies. Expose /actuator/info with git.commit.id (git-commit-id plugin) as the "which commit" endpoint.', [
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Configuration for containers'],
  ['sb-18-3-test-va-docker', 'Spring Boot 18.3 — Test, Docker and CI (capstone)'],
])}

<h3>On the job</h3>
<p>"It works on staging but users get logged out at random" and "login is blocked for the whole office" are both TRUST_PROXY tickets. When you join a project, ask "how many proxies are in front of the app?" and write the answer next to the setting. When you change infrastructure (add Cloudflare, a load balancer), the number changes — put "re-run the three-way login test" in the change checklist.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How does Let's Encrypt know you own the domain?"</strong> — http-01: it asks for a random token at <code>http://domain/.well-known/acme-challenge/…</code>; only whoever controls the name and port 80 can serve it.</li>
<li><strong>"Why a reverse proxy in front of Node?"</strong> — TLS, rate limits, security headers and static caching in one tested place; the app container stays replaceable.</li>
<li><strong>"What is <code>trust proxy</code> and how do you set it?"</strong> — The number of proxies you control in front of the app; too low merges users, too high lets clients forge their IP. Count, then test.</li>
<li><strong>"How do you know which version is in production?"</strong> — The process reports its commit (<code>/api/</code>, <code>/ban.txt</code>), and deploys accept only full SHAs.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">ACME http-01</span><span class="v">Prove control of a name by serving a CA-chosen file on port 80.</span></div>
  <div class="kv"><span class="k">fullchain.pem</span><span class="v">Your certificate + the intermediate CA, in the order clients need.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v">Browser remembers "HTTPS only" for max-age seconds.</span></div>
  <div class="kv"><span class="k">CSP</span><span class="v">Header listing where scripts, styles, images may come from.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">How many X-Forwarded-For hops the app believes.</span></div>
  <div class="kv"><span class="k">limit_req</span><span class="v">Nginx token-bucket rate limit per key (here: client IP).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The VPS pulls images by SHA; the running processes report that SHA.</li>
<li>Secrets are generated on the server, mode 600, outside every served path.</li>
<li>Certificate: bootstrap port 80, http-01, test renewal — and know that <code>--dry-run</code> talks to staging.</li>
<li>CSP and HSTS live in one place; any <code>add_header</code> in a location drops them.</li>
<li>TRUST_PROXY is a count you prove with a stranger and a victim.</li>
</ul>
${NGUON}
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Deploy</span>
<h2>Từ "CI đã dựng ảnh" tới "người lạ mở https://chiase.test"</h2>
<p class="lead">Chương 10 kết thúc với ba ảnh trong registry, gắn tag là mã commit. Bài này đưa chúng lên VPS của bài 11.1 và tới tay người dùng: một cái tên trỏ về máy, một chứng chỉ, một reverse proxy là cánh cửa duy nhất, bí mật không bao giờ rời máy chủ, và một lệnh deploy từ chối mọi thứ trừ mã commit đầy đủ. Lần deploy thật đầu tiên ĐỎ — và con bọ nằm trong bộ kiểm.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">tên</span><span class="lz-d">bản ghi A, TTL 300 trong lúc dựng</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">ảnh</span><span class="lz-d">nướng SHA vào: /api/ ban, /ban.txt</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">bí mật</span><span class="lz-d">sinh trên máy chủ, umask 077</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">TLS</span><span class="lz-d">mồi :80 ⇒ http-01 ⇒ cấu hình thật ⇒ thử gia hạn</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">deploy</span><span class="lz-d">kéo theo SHA ⇒ … ⇒ smoke</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">bên ngoài</span><span class="lz-d">header, CSP, TRUST_PROXY, giới hạn — đo thật</span></div>
</div>


<pre><code class="language-mermaid">flowchart LR
  U[Trình duyệt] -- "DNS: chiase.test ⇒ VPS" --> N["Nginx trên VPS :443<br/>TLS · HSTS · CSP · limit_req"]
  N -- "127.0.0.1:8080" --> W["container web<br/>Nginx: tĩnh + proxy"]
  W -- "/api /socket.io" --> A[api]
  W -- "/chiase/ (ảnh)" --> K[(MinIO)]
  A --> D[(PostgreSQL)]
  A --> K</code></pre>
<p>Hai Nginx là cố ý: cái <em>trong</em> ảnh web (Chương 9) hiểu ứng dụng (trả index.html cho SPA, header cache, đường nào sang API); cái <em>trên VPS</em> hiểu Internet (chứng chỉ, giới hạn tần suất, header bảo mật). Tráo ứng dụng không đụng tới chứng chỉ, gia hạn chứng chỉ không đụng tới ứng dụng.</p>

<h3>1. Một cái tên cho cái máy</h3>
<p>Ở nơi bán tên miền (hoặc Cloudflare) tạo hai bản ghi: <code>A chiase.test → IP của VPS</code> và <code>A www.chiase.test → IP của VPS</code> (hoặc CNAME cho www). TTL: 300 giây trong lúc dựng, để lỡ sai thì năm phút là sửa xong; ổn rồi mới nâng. Kiểm từ laptop trước khi làm bất cứ thứ gì phụ thuộc vào nó — Let's Encrypt tra tên từ Internet chứ không từ máy bạn:</p>
<div class="out">${DNS.split('\n\n')[0]}</div>
<p>(Trong mô phỏng, DNS của mạng Docker đóng vai nhà đăng ký tên miền.)</p>

<h3>2. Ảnh tự khai mình là commit nào</h3>
<p>Câu "đang chạy mã nào?" phải trả lời được bằng một từ. Chương 10 gắn tag ảnh bằng SHA; điều đó chứng minh thứ bạn đã <em>đẩy</em>, không phải thứ đang <em>trả lời</em>. Một container cũ còn sót, một tầng cache, một tag gắn nhầm — trông đều ổn cho tới khi có người hỏi chính tiến trình đang chạy. Vì vậy lúc dựng, SHA được nướng vào ảnh, và cả API lẫn trang web đều tự khai:</p>
<pre><code class="language-diff">${TU_KHAI}</code></pre>
<p><code>ARG</code> đứng sau mọi <code>COPY</code>, nên SHA mới chỉ dựng lại một tầng siêu dữ liệu (CI mô phỏng dựng lại cả ba ảnh trong 7–9 giây khi chỉ <code>deploy/</code> thay đổi).</p>

<h3>3. compose.prod.yaml: chỉ kéo, không bao giờ dựng</h3>
<pre><code class="language-yaml">${COMPOSE}</code></pre>
<p>Đọc đối chiếu với <code>compose.yaml</code> của máy dev ở bài 9.3: không có <code>build:</code>, ảnh nào cũng là <code>…:\${TAG}</code> và <code>TAG</code> bắt buộc phải đặt (script deploy đặt nó bằng SHA), CSDL và kho ảnh không công bố gì, container web chỉ công bố trên loopback, log có trần, còn migration nằm trong một profile để <code>up</code> không bao giờ vô tình chạy nó.</p>

<h3>4. Bí mật sinh ra trên máy chủ</h3>
<p>VPS nhận <code>deploy/</code> từ repo (tệp compose, các script, cấu hình Nginx) — <em>không</em> nhận mã nguồn, và không nhận tệp <code>.env</code> từ laptop. Bí mật được sinh trên chính cái máy dùng nó và không bao giờ in ra:</p>
<pre><code class="language-bash">${TAO_ENV}</code></pre>
<pre><code class="language-ini">${ENV_MAU}</code></pre>
<p><code>umask 077</code> TRƯỚC khi ghi, không phải <code>chmod</code> sau: giữa lúc "tạo" và lúc "chmod", tệp tồn tại và ai cũng đọc được. Script chỉ in độ dài, không in giá trị — bí mật đã hiện trên terminal là còn sống trong scrollback, trong video quay màn hình, trong log phiên làm việc.</p>

<h3>5. Một chứng chỉ, và bốn cú vấp trên đường</h3>
<p>Cài Nginx và certbot của Ubuntu (<code>apt install nginx certbot</code>), chép cấu hình site từ repo, kiểm:</p>
<div class="out">${DNS.split('\n\n').slice(1).join('\n\n')}</div>
<p><strong>Vấp 1:</strong> <code>http2 on;</code> chỉ có từ Nginx 1.25.1; Ubuntu 24.04 cài 1.24.0. Cấu hình giờ dùng <code>listen 443 ssl http2;</code>, cả hai bản đều nhận. Bài học: tài liệu bạn đọc tả bản mới nhất; máy chủ chạy bản của bản phân phối. Gõ <code>nginx -v</code> trước.</p>
<div class="out">${NGINX_B}</div>
<p><strong>Vấp 2:</strong> cấu hình trỏ tới một chứng chỉ chưa tồn tại, mà muốn có chứng chỉ thì phải có Nginx đang chạy để trả lời thử thách ACME. Phá vòng luẩn quẩn bằng một site TẠM chỉ phục vụ <code>/.well-known/acme-challenge/</code>, lấy chứng chỉ, rồi đổi sang cấu hình thật:</p>
<div class="out">${CERT}</div>
<p>Chuyện xảy ra ở phía bên kia — CA nối vào cổng 80 của <em>bạn</em> theo TÊN, lấy đúng mã thông báo certbot vừa ghi vào <code>/var/www/certbot</code>, rồi mới ký (log của Pebble):</p>
<div class="out">${PEBBLE_LOG}</div>
<p>Đó là toàn bộ ý tưởng của http-01: "chứng minh bạn nắm cái tên bằng cách phục vụ một tệp do CA chọn, tại cái tên đó, ở cổng 80". Cũng vì vậy cổng 80 phải luôn mở dù mọi người dùng đều bị chuyển sang 443. (Trong mô phỏng CA là Pebble — máy chủ thử nghiệm của Let's Encrypt — nên có <code>--server https://pebble:14000/dir</code>. Với Let's Encrypt thật, bỏ cờ đó.)</p>
<p>Cấu hình site cuối cùng, dòng nào cũng có chú thích ghi phép đo biện minh cho nó:</p>
<pre><code class="language-nginx">${NGINX_CONF}</code></pre>
<p><strong>Vấp 3 và 4 — gia hạn.</strong> Chứng chỉ 90 ngày mà không tự gia hạn thì ngày 91 cả trang chết, vào ban đêm. Thử gia hạn ngay bây giờ:</p>
<div class="out">${RENEW}</div>
<p><code>--dry-run</code> KHÔNG dùng máy chủ bạn đã cấu hình: nó gọi máy chủ <em>staging thật của Let's Encrypt</em> (log ghi <code>acme-staging-v02.api.letsencrypt.org</code>), nơi từ chối tên giả <code>.test</code> — với tên miền thật thì đã qua. Còn lượt gia hạn chạy không có terminal sẽ ngủ một khoảng ngẫu nhiên trước (ở đây 392 giây) để hàng triệu máy chủ không cùng đập vào Let's Encrypt trong một giây — dòng cron có sẵn đã truyền <code>--no-random-sleep-on-renew</code> sau khi tự ngủ ngẫu nhiên. Lượt gia hạn thật đi qua Pebble và cài một số serial mới. <code>--deploy-hook "nginx -s reload"</code> là thứ làm Nginx nạp tệp mới; thiếu nó, chứng chỉ cũ nằm trong bộ nhớ tới lần khởi động lại kế tiếp. (Dòng "error output" chỉ là Nginx in thông báo <code>signal process started</code> ra stderr.)</p>

<h3>6. Lần deploy đầu — đỏ, và lỗi là của ta</h3>
<p>Script deploy (toàn văn ở 11.3) làm sáu việc theo thứ tự: kéo ba ảnh theo SHA ⇒ kiểm nhãn revision của từng ảnh bằng đúng SHA đó ⇒ sao lưu CSDL ⇒ chạy migration ⇒ tráo api + web và chờ healthy ⇒ smoke test, hỏng thì lùi. Trước hết nó từ chối thứ người ta hay gõ lúc mệt:</p>
<div class="out">${DEPLOY1}</div>
<p>Hai phép kiểm đỏ ngay lần deploy đầu, và cả hai đều là <strong>lỗi của <code>smoke.sh</code></strong>, không phải của ChiaSe:</p>
<ul>
<li><code>GET /api</code> → 301: Nginx của VPS khớp <code>location ^~ /api/</code> — có gạch chéo. <code>/api</code> trần rơi xuống <code>location /</code>. Người dùng không bao giờ gọi <code>/api</code>; bộ kiểm thì có.</li>
<li>WebSocket → 400 <code>Missing or invalid Sec-WebSocket-Key header</code>: khoá phải là base64 của ĐÚNG 16 byte (RFC 6455). Khoá tự bịa dài 19 byte.</li>
</ul>
<p>Và vì là lần deploy đầu nên không có gì để lùi về. Sửa bộ kiểm xong (commit mới, SHA mới — script trên máy chủ cũng đến từ repo):</p>
<div class="out">${DEPLOY2}</div>
<p>Rồi tạo tài khoản smoke một lần, mật khẩu không bao giờ nằm trên dòng lệnh (<code>ps</code> cho MỌI người dùng trên máy thấy tham số của mọi tiến trình):</p>
<div class="out">${SMOKE_TK}</div>
<div class="pitfall co-tieu-de"><p class="tieu-de">Bẫy: một phép kiểm đỏ là lời khẳng định về hệ thống, HOẶC về chính phép kiểm</p><p>Trước khi "sửa" ứng dụng vì một bộ theo dõi nói vậy, gọi lại đúng request đó bằng tay. Ở đây hai phút với <code>curl -i</code> cho thấy một 301 từ Nginx và một 400 có thông báo rõ ràng — ứng dụng không sao. Cũng chính luật này làm Checkpoint 9 và 10 đáng tin.</p></div>

<h3>7. Người dùng (và máy quét) thấy gì</h3>
<div class="out">${NGOAI}</div>
<p>Chuyển hướng giữ nguyên đường dẫn (<code>/bai/123</code> vẫn là <code>/bai/123</code>), <code>www</code> gộp về tên chính, HTTP/2 bật, chuỗi chứng chỉ gồm chứng chỉ của site cộng CA trung gian (đó là việc của <code>fullchain.pem</code>). Để ý <code>/.git/config → 200</code>: máy quét ngây thơ sẽ báo "lộ", nhưng đó là <code>index.html</code> của SPA (456 byte <code>text/html</code>) — mã 200 chẳng nói gì cho tới khi bạn nhìn vào thân. Lộ thật là 200 kèm nội dung tệp, mà ở đây không thể xảy ra: ảnh web chỉ chứa <code>dist/</code> đã dựng, còn <code>.env</code> nằm ở <code>~/chiase</code>, thư mục không Nginx nào phục vụ.</p>

<h3>🕵️ Góc hacker — 110.000 tên miền có .env đọc được</h3>
<p>Unit 42 (Palo Alto Networks, 15/08/2024) mô tả một chiến dịch tống tiền chỉ đơn giản là xin <code>/.env</code> từ 110.000 tên miền (trong "hơn 230 triệu mục tiêu" đã quét), gom được "hơn 90.000 biến" — 7.000 cái là thông tin đăng nhập đám mây — rồi dùng khoá AWS tạo một vai trò quản trị, chép các bucket S3, xoá sạch và để lại thư đòi tiền chuộc. Không khai thác lỗ hổng, không zero-day: chỉ là một máy chủ web có thư mục gốc chứa luôn thư mục dự án. Phòng thủ: thư mục được phục vụ chỉ chứa thứ đã dựng (ảnh của Chương 9); bí mật nằm ngoài mọi đường được phục vụ, mode 600; khoá đám mây dài hạn thay bằng vai trò ngắn hạn khi có thể; và tự thử các đường đó — mục 7 đã làm.</p>

<h3>8. CSP chạy được — cho tới khi một location thêm một header</h3>
<p>Bài 6.2/6.3 hứa Content Security Policy là bức tường thứ hai sau cơ chế thoát chữ của React. Để chứng minh nó chặn được thứ gì đó, một trang dùng một lần có script nội tuyến được thêm vào Nginx của VPS hai lần: một lần trơn, một lần có thêm đúng một <code>add_header</code> trong <code>location</code> của nó. Chrome không giao diện mở cả hai:</p>
<div class="out">${CSP}</div>
<p>Có CSP, script chèn vào không chạy. Ở location thứ hai, thêm <em>một</em> header (<code>Cache-Control</code>) đã lặng lẽ xoá <em>mọi</em> header cấp server — cả CSP lẫn HSTS: Nginx chỉ kế thừa <code>add_header</code> từ khối ngoài khi khối trong không khai cái nào. Trang ChiaSe thật cũng chạy sạch dưới chính sách này (React dựng feed, không vi phạm CSP nào), vì Vite chỉ sinh script và style ở tệp ngoài. Luật: location nào cần header riêng thì khai lại các header bảo mật (hoặc gom chúng vào một tệp <code>include</code>).</p>

<h3>9. TRUST_PROXY: đếm số lớp, rồi chứng minh con số</h3>
<p>Request tới API đi qua hai proxy (Nginx của VPS ⇒ Nginx của ảnh web), nên <code>TRUST_PROXY: 2</code>. Phép thử: một người lạ (ke-la) đoán mật khẩu 11 lần; rồi An, từ một máy khác, đăng nhập đúng mật khẩu.</p>
<div class="out">${TRUST}</div>
<ul>
<li><strong>2 (đúng):</strong> người lạ bị chặn sau 10 lần; An vào được.</li>
<li><strong>1 (thiếu một lớp):</strong> API thấy mọi người dùng mang cùng địa chỉ của chính VPS ⇒ một bộ đếm chung ⇒ người lạ khoá luôn <em>An</em>. Một script năm dòng thành một cuộc tấn công từ chối dịch vụ vào trang đăng nhập.</li>
<li><strong>3 (thừa một lớp):</strong> API tin mục đầu tiên của <code>X-Forwarded-For</code>, thứ do chính client tự ghi ⇒ mỗi request một IP giả ⇒ giới hạn không bao giờ kích hoạt.</li>
</ul>
<p>Đứng sau Cloudflare thì thành 3 — thêm proxy nào là con số đổi, và phép thử này là cách bạn biết.</p>

<h3>10. Giới hạn cho request đọc (lời hứa bài 5.2)</h3>
<p>API giới hạn đăng nhập; không gì giới hạn request đọc, nên một script lật hết feed nhanh tới mức CSDL trả lời kịp. Giờ Nginx của VPS cho 10 request/giây mỗi IP, dồn được 20:</p>
<div class="out">${LIMIT}</div>
<p>45 = 1 + 20 suất dồn + phần được nạp lại trong khoảng một giây lượt bắn diễn ra; người dùng khác không hề hấn gì; giới hạn quên ngay sau chưa tới một giây. <code>limit_req_status 429</code> quan trọng: mặc định là 503, trông như sập trên mọi bảng theo dõi.</p>

<h3>11. Chạy nó tốn bao nhiêu</h3>
<div class="out">${STATS}</div>
<p>Khoảng 200 MiB cho bốn container lúc rảnh; ảnh mới là chi phí đĩa (2,1 GB sau vài lần phát hành — bài 11.3 giữ nó trong tầm). Đây là số đo đứng sau bảng chọn cỡ máy ở bài 11.1.</p>

<h3>12. Chuyển ảnh sang Cloudflare R2 (lời hứa bài 4.2/4.3)</h3>
<p>Không chạy ở đây (khoá học không dùng tài khoản thật nào), nhưng mã không phải sửa — chỉ cấu hình: <code>S3_ENDPOINT=https://&lt;account&gt;.r2.cloudflarestorage.com</code>, <code>S3_PUBLIC_ENDPOINT</code> để trống (trình duyệt tải thẳng lên R2 bằng URL ký sẵn), <code>MEDIA_BASE_URL=https://media.chiase.test</code> (tên miền riêng gắn vào bucket, Cloudflare làm cache). Thêm hai nghĩa vụ: luật CORS trên bucket cho phép <code>PUT</code> từ <code>https://chiase.test</code> (giờ trình duyệt tải lên khác origin), và <code>img-src</code>/<code>connect-src</code> trong CSP mở thêm tên miền ảnh — không thì chính sách ở mục 8 chặn luôn ảnh của bạn.</p>

<h3>🧪 Lab 11.2 — người lạ, số lớp, và cái header</h3>
<div class="callout ok">
<ol>
<li>Deploy stack của bạn bằng <code>compose.prod.yaml</code>; từ laptop cho thấy <code>/api/</code> và <code>/ban.txt</code> khai đúng SHA vừa deploy.</li>
<li>Từ một máy thứ hai (phát wifi từ điện thoại cũng được), đăng nhập sai 11 lần; rồi đăng nhập đúng từ laptop. Lặp lại với <code>TRUST_PROXY</code> thiếu một và thừa một. Ghi ba kết quả vào README.</li>
<li>Thêm <code>add_header X-Lab 1;</code> vào trong <code>location /api/</code>. Header nào biến mất khỏi <code>curl -sI https://ten-mien/api/health</code>? Sửa mà không bỏ <code>X-Lab</code>.</li>
<li>Chạy <code>certbot renew --dry-run</code> trên tên miền thật của bạn và giải thích từng dòng output.</li>
</ol>
<p><strong>Xong khi:</strong> cả bốn kết quả nằm trong README cùng lệnh đã tạo ra chúng.</p>
</div>
<details><summary>Lời giải</summary>
<ol>
<li><code>curl -s https://ten-mien/api/ | grep -o '"ban":"[^"]*"'</code> và <code>curl -s https://ten-mien/ban.txt</code> — cả hai phải bằng <code>cat ~/chiase/.ban-dang-chay</code> trên máy chủ.</li>
<li>Mong đợi: đúng số ⇒ 401×10, 429, rồi bạn 200; thiếu ⇒ bạn 429; thừa ⇒ có <code>X-Forwarded-For</code> giả thì người lạ không bao giờ thấy 429.</li>
<li>Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options và Referrer-Policy đều biến mất khỏi <code>/api/</code>. Sửa: chuyển bốn header bảo mật vào <code>/etc/nginx/snippets/bao-mat.conf</code> rồi <code>include</code> nó ở khối server <em>và</em> ở mọi location có <code>add_header</code> riêng.</li>
<li>Với tên miền thật: "Simulating renewal…", một thử thách với CA staging, "Congratulations, all simulated renewals succeeded". Không cài gì — nó chỉ chứng minh lần gia hạn thật kế tiếp CÓ THỂ thành công.</li>
</ol>
</details>

${spring(false, 'Phía VPS giống hệt. Với Spring Boot, "trust proxy" là server.forward-headers-strategy=native (RemoteIpValve của Tomcat) cộng danh sách proxy đáng tin; phép thử ba trường hợp y như trên. Mở /actuator/info kèm git.commit.id (plugin git-commit-id) làm endpoint "đang chạy commit nào".', [
  ['sb-17-2-application-properties-docker', 'Spring Boot 17.2 — Cấu hình cho môi trường container'],
  ['sb-18-3-test-va-docker', 'Spring Boot 18.3 — Test, Docker và CI (capstone)'],
])}

<h3>Tình huống đi làm thật</h3>
<p>"Trên staging chạy mà người dùng thật bị đá ra ngẫu nhiên" và "cả văn phòng bị chặn đăng nhập" đều là phiếu lỗi TRUST_PROXY. Vào dự án mới, hỏi "trước ứng dụng có bao nhiêu proxy?" rồi ghi câu trả lời ngay cạnh biến cấu hình. Khi đổi hạ tầng (thêm Cloudflare, thêm bộ cân bằng tải), con số đổi — ghi "chạy lại phép thử đăng nhập ba trường hợp" vào checklist thay đổi.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Let's Encrypt biết bạn sở hữu tên miền bằng cách nào?"</strong> — http-01: nó xin một mã ngẫu nhiên tại <code>http://ten-mien/.well-known/acme-challenge/…</code>; chỉ ai nắm cái tên và cổng 80 mới phục vụ được.</li>
<li><strong>"Sao cần reverse proxy trước Node?"</strong> — TLS, giới hạn tần suất, header bảo mật, cache tĩnh ở một chỗ đã được kiểm; container ứng dụng giữ được tính thay thế.</li>
<li><strong>"<code>trust proxy</code> là gì, đặt thế nào?"</strong> — Số proxy bạn kiểm soát đứng trước ứng dụng; thiếu thì gộp người dùng, thừa thì client tự khai IP. Đếm, rồi thử.</li>
<li><strong>"Sao biết production đang chạy bản nào?"</strong> — Tiến trình tự khai commit (<code>/api/</code>, <code>/ban.txt</code>), và lệnh deploy chỉ nhận SHA đầy đủ.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">ACME http-01</span><span class="v">Chứng minh nắm cái tên bằng cách phục vụ tệp do CA chọn ở cổng 80.</span></div>
  <div class="kv"><span class="k">fullchain.pem</span><span class="v">Chứng chỉ của bạn + CA trung gian, đúng thứ tự client cần.</span></div>
  <div class="kv"><span class="k">HSTS</span><span class="v">Trình duyệt nhớ "chỉ HTTPS" trong max-age giây.</span></div>
  <div class="kv"><span class="k">CSP</span><span class="v">Header liệt kê nơi script, style, ảnh được phép đến từ.</span></div>
  <div class="kv"><span class="k">trust proxy</span><span class="v">Ứng dụng tin bao nhiêu lớp X-Forwarded-For.</span></div>
  <div class="kv"><span class="k">limit_req</span><span class="v">Giới hạn tần suất kiểu thùng token của Nginx theo khoá (ở đây: IP client).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>VPS kéo ảnh theo SHA; tiến trình đang chạy tự khai đúng SHA đó.</li>
<li>Bí mật sinh trên máy chủ, mode 600, ngoài mọi đường được phục vụ.</li>
<li>Chứng chỉ: mồi bằng cổng 80, http-01, thử gia hạn — và biết <code>--dry-run</code> gọi staging.</li>
<li>CSP và HSTS ở một chỗ; một <code>add_header</code> trong location là đánh rơi chúng.</li>
<li>TRUST_PROXY là con số phải chứng minh bằng một người lạ và một nạn nhân.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
