/**
 * 11.3 — Kiểm nhanh production và kế hoạch rollback (soạn 25/11/2026, agent trên Mac tiếp quản fsp).
 * Chuỗi phát hành THẬT trên VPS mô phỏng (mỗi bản = một commit của bản chép chiase, ảnh dựng + đẩy registry cục bộ):
 * R2 thêm cột posts.tom_tat (lấp rồi bỏ DEFAULT) · R3 hỏng tuyến GET /api/posts ⇒ smoke đỏ ⇒ tự lùi · lùi tay về R1 ⇒ POST 500
 * (cánh cửa một chiều) ⇒ tự quay lại R2 · R4 sửa tiến (SET DEFAULT) ⇒ lùi R1 chạy · R5 migration hỏng giữa chừng (UNIQUE trên
 * dữ liệu trùng) ⇒ cột nằm lại, P3009 · cứu bằng tay · R6 (BEGIN/COMMIT, có lỗi gõ của chính người soạn) · R7 xanh.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const DEPLOY_SH = `#!/usr/bin/env bash
# deploy.sh — chạy TRÊN VPS, trong thư mục ~/chiase (bài 11.2–11.3).
#   ./deploy.sh &lt;mã-commit-40-ký-tự&gt;   deploy đúng ảnh CI đã dựng từ commit đó
#   ./deploy.sh --lui                  quay về bản chạy tốt NGAY TRƯỚC bản hiện tại (đọc lich-su.log)
# Thứ tự: khoá ⇒ kéo ảnh ⇒ kiểm ảnh tự khai đúng commit ⇒ sao lưu CSDL ⇒ migrate ⇒ tráo api + web ⇒ smoke test.
# Smoke đỏ ⇒ TỰ LÙI về bản trước (migration KHÔNG lùi — xem bài 11.3: chỉ migration "mở rộng" mới cho lùi an toàn).
set -euo pipefail
cd "$(dirname "$0")"
# Bản sao lưu chứa mã băm mật khẩu + mọi dữ liệu: chỉ chủ đọc được (trước dòng này: -rw-rw-r--, bài 11.3 đo).
umask 077

log() { printf '[%s] %s\\n' "$(date -u +%H:%M:%S)" "$*"; }
chet() { log "✘ $*"; exit "\${2:-1}"; }

[ -f .env ] || chet "thiếu .env (chép từ env.example rồi điền, chmod 600)"
[ "$(stat -c %a .env)" = 600 ] || chet ".env đang mode $(stat -c %a .env) — chmod 600 .env"
REGISTRY=$(sed -n 's/^REGISTRY=//p' .env)
DOMAIN=$(sed -n 's/^DOMAIN=//p' .env)

TRUOC=$(cat .ban-dang-chay 2&gt;/dev/null || true)
if [ "\${1:-}" = --lui ]; then
  # bản "ok" gần nhất KHÁC bản đang chạy
  SHA=$(awk '$3=="ok"{print $2}' lich-su.log 2&gt;/dev/null | grep -vx "\${TRUOC:-x}" | tail -1 || true)
  [ -n "$SHA" ] || chet "lich-su.log không có bản tốt nào khác bản đang chạy để lùi về"
  log "lùi: \${TRUOC:0:12} ⇒ \${SHA:0:12}"
else
  SHA="\${1:-}"
fi
[[ "$SHA" =~ ^[0-9a-f]{40}$ ]] || chet "'$SHA' không phải mã commit đầy đủ (40 ký tự hex). Không deploy 'latest' hay tag tự đặt: không ai trả lời được 'đang chạy mã nào?'" 2

exec 9&gt;.deploy.lock
flock -n 9 || chet "đang có một lượt deploy khác chạy (khoá .deploy.lock)" 3

export TAG="$SHA"
dc() { docker compose -f compose.prod.yaml "$@"; }

log "1/6 kéo ảnh \${SHA:0:12} từ $REGISTRY"
dc --profile migrate pull -q api web migrate

log "2/6 kiểm ảnh tự khai đúng commit"
for a in api api-migrate web; do
  rev=$(docker image inspect "$REGISTRY/chiase-$a:$SHA" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')
  [ "$rev" = "$SHA" ] || chet "ảnh chiase-$a:\${SHA:0:12} tự khai revision '$rev' — tag bị gắn nhầm ảnh?"
done
log "    api, api-migrate, web đều khai \${SHA:0:12}"

log "3/6 sao lưu CSDL trước khi migrate"
mkdir -p sao-luu
if dc ps --status running --services | grep -qx db; then
  tep="sao-luu/$(date -u +%Y%m%dT%H%M%SZ)-truoc-\${SHA:0:12}.dump"
  dc exec -T db pg_dump -U chiase -d chiase -Fc &gt; "$tep"
  [ -s "$tep" ] || chet "bản sao lưu rỗng: $tep"
  log "    $tep ($(du -h "$tep" | cut -f1), $(dc exec -T db pg_restore -l &lt; "$tep" | grep -c 'TABLE DATA') bảng có dữ liệu)"
  ls -1t sao-luu/*.dump | tail -n +11 | xargs -r rm -- # giữ 10 bản mới nhất trên máy; bản ra-khỏi-máy: bài 11.3
else
  log "    CSDL chưa chạy (lần deploy đầu) — không có gì để sao lưu"
fi

log "4/6 migrate (prisma migrate deploy)"
if ! dc --profile migrate run --rm migrate; then
  chet "migrate HỎNG — KHÔNG tráo api; người dùng vẫn ở bản \${TRUOC:0:12}. Đọc lỗi ở trên, KHÔNG tự 'migrate resolve' (bài 11.3)" 4
fi
dc --profile migrate run --rm kho-chuan-bi &gt;/dev/null

lui() {
  [ -n "$TRUOC" ] &amp;&amp; [ "$TRUOC" != "$SHA" ] || chet "không có bản trước để lùi về" 5
  log "↩ TỰ LÙI về \${TRUOC:0:12} (lược đồ CSDL GIỮ NGUYÊN ở bản mới)"
  TAG="$TRUOC" dc up -d --wait --wait-timeout 90 api web
  if ./smoke.sh "https://$DOMAIN" "$TRUOC"; then
    printf '%s %s lui-ve\\n' "$(date -u +%FT%TZ)" "$TRUOC" &gt;&gt; lich-su.log
    echo "$TRUOC" &gt; .ban-dang-chay
    chet "deploy \${SHA:0:12} THẤT BẠI, đã lùi về \${TRUOC:0:12} — smoke xanh" 6
  fi
  chet "LÙI CŨNG ĐỎ — gọi người ngay (bài 11.3: cú lùi nói dối)" 7
}

log "5/6 tráo api + web"
if ! dc up -d --wait --wait-timeout 90 api web; then
  printf '%s %s hong-khoi-dong\\n' "$(date -u +%FT%TZ)" "$SHA" &gt;&gt; lich-su.log
  dc logs --tail 15 api || true
  lui
fi

log "6/6 smoke test từ https://$DOMAIN"
if ! ./smoke.sh "https://$DOMAIN" "$SHA"; then
  printf '%s %s hong-smoke\\n' "$(date -u +%FT%TZ)" "$SHA" &gt;&gt; lich-su.log
  lui
fi
echo "$SHA" &gt; .ban-dang-chay
printf '%s %s ok\\n' "$(date -u +%FT%TZ)" "$SHA" &gt;&gt; lich-su.log
log "✔ đang chạy \${SHA:0:12} (trước đó: \${TRUOC:0:12})"`;

const SMOKE_SH = `#!/usr/bin/env bash
# smoke.sh &lt;URL gốc&gt; &lt;mã commit mong đợi&gt; — kiểm nhanh production SAU mỗi lần deploy (bài 11.3). ~2 giây.
# Đọc mã trạng thái: 200 = tuyến có và chạy; 401 = tuyến CÓ (chỉ thiếu token); 404 ở tuyến phải có = bản cũ / thiếu.
# "health xanh" KHÔNG đủ: health chỉ hỏi CSDL. Smoke đi đúng đường người dùng đi — kể cả một lượt GHI.
# Tài khoản smoke: SMOKE_EMAIL / SMOKE_PASSWORD trong .env (tạo MỘT lần, xem bài 11.2). Đăng nhập một lần rồi
# giữ cookie refresh trong ~/.chiase-smoke-cookie — lần sau chỉ làm mới, không ăn vào giới hạn 10 lần đăng nhập/15 phút.
set -uo pipefail
GOC="\${1:?cách dùng: ./smoke.sh https://ten-mien &lt;mã-commit&gt;}"
SHA="\${2:?thiếu mã commit mong đợi}"
cd "$(dirname "$0")"
[ -f .env ] &amp;&amp; { SMOKE_EMAIL=\${SMOKE_EMAIL:-$(sed -n 's/^SMOKE_EMAIL=//p' .env)}; SMOKE_PASSWORD=\${SMOKE_PASSWORD:-$(sed -n 's/^SMOKE_PASSWORD=//p' .env)}; }
JAR="\${SMOKE_COOKIE:-$HOME/.chiase-smoke-cookie}"
tam=$(mktemp); dau=$(mktemp); trap 'rm -f "$tam" "$dau"' EXIT
loi=0
ok() { printf '  ✔ %s\\n' "$1"; }
hong() { printf '  ✘ %s\\n' "$1"; loi=$((loi + 1)); }
ma() { curl -sS -o "$tam" -D "$dau" -w '%{http_code}' --max-time 10 "$@" 2&gt;/dev/null || true; }
kiem() { local mong=$1 mota=$2 m; shift 2; m=$(ma "$@"); [ "$m" = "$mong" ] &amp;&amp; ok "$mota → $m" || hong "$mota → \${m:-000} (cần $mong)"; }

kiem 200 "GET /api/health" "$GOC/api/health"
# "/api/" có gạch chéo: Nginx khớp location ^~ /api/ — "/api" trần rơi xuống location / ⇒ 301 (bài 11.2 đo).
m=$(ma "$GOC/api/"); ban=$(grep -o '"ban":"[^"]*"' "$tam" | cut -d'"' -f4)
[ "$m" = 200 ] &amp;&amp; [ "$ban" = "$SHA" ] &amp;&amp; ok "API khai bản \${ban:0:12}" || hong "API khai bản '\${ban:0:12}' (cần \${SHA:0:12}, mã $m)"
m=$(ma "$GOC/ban.txt"); w=$(tr -d '\\n' &lt; "$tam")
[ "$m" = 200 ] &amp;&amp; [ "$w" = "$SHA" ] &amp;&amp; ok "web khai bản \${w:0:12}" || hong "web khai bản '\${w:0:12}' (cần \${SHA:0:12}, mã $m)"
m=$(ma "$GOC/")
[ "$m" = 200 ] &amp;&amp; grep -q 'id="root"' "$tam" &amp;&amp; ok "GET / trả trang React → $m" || hong "GET / → $m (không thấy #root)"
kiem 200 "GET /api/posts?limit=1" "$GOC/api/posts?limit=1"
kiem 401 "GET /api/me không token (tuyến có mặt, khoá đúng)" "$GOC/api/me"
kiem 404 "GET /api/khong-co-tuyen-nay (404 của API)" "$GOC/api/khong-co-tuyen-nay"
# Khoá phải là base64 của ĐÚNG 16 byte (RFC 6455) — khoá tự bịa 19 byte làm máy chủ trả 400 (bài 11.2: bộ kiểm sai trước).
m=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 3 --http1.1 -H 'Connection: Upgrade' -H 'Upgrade: websocket' \\
  -H 'Sec-WebSocket-Version: 13' -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==' -H "Origin: $GOC" \\
  "$GOC/socket.io/?EIO=4&amp;transport=websocket" 2&gt;/dev/null || true)
[ "\${m:0:3}" = 101 ] &amp;&amp; ok "WebSocket /socket.io nâng cấp → 101" || hong "WebSocket /socket.io → \${m:-000} (cần 101)"

# Lượt GHI: làm mới phiên (hoặc đăng nhập lần đầu) ⇒ tạo bài nháp ⇒ xoá. Đây là chỗ bắt được "cú lùi nói dối".
tok=""
if [ -s "$JAR" ]; then
  m=$(ma -X POST -b "$JAR" -c "$JAR" "$GOC/api/auth/refresh")
  [ "$m" = 200 ] &amp;&amp; tok=$(grep -o '"accessToken":"[^"]*"' "$tam" | cut -d'"' -f4)
fi
if [ -z "$tok" ] &amp;&amp; [ -n "\${SMOKE_EMAIL:-}" ]; then
  m=$(ma -X POST -c "$JAR" -H 'Content-Type: application/json' \\
    --data "{\\"email\\":\\"$SMOKE_EMAIL\\",\\"password\\":\\"$SMOKE_PASSWORD\\"}" "$GOC/api/auth/login")
  [ "$m" = 200 ] &amp;&amp; tok=$(grep -o '"accessToken":"[^"]*"' "$tam" | cut -d'"' -f4)
  chmod 600 "$JAR" 2&gt;/dev/null || true
fi
if [ -z "$tok" ] &amp;&amp; [ -z "\${SMOKE_EMAIL:-}" ]; then
  echo "  ⚠ bỏ qua lượt ghi: chưa khai SMOKE_EMAIL trong .env (chỉ chấp nhận ở lần deploy ĐẦU TIÊN)"
elif [ -z "$tok" ]; then
  hong "tài khoản smoke không đăng nhập được (mã \${m:-000})"
else
  ok "tài khoản smoke có phiên"
  m=$(ma -X POST -H "Authorization: Bearer $tok" -H 'Content-Type: application/json' \\
    --data '{"title":"smoke","body":"bài nháp của smoke test — tự xoá"}' "$GOC/api/posts")
  id=$(sed -n 's#^[Ll]ocation: /api/posts/\\([0-9a-f-]*\\).*#\\1#p' "$dau" | tr -d '\\r')
  if [ "$m" = 201 ] &amp;&amp; [ -n "$id" ]; then
    ok "POST /api/posts (ghi CSDL) → 201"
    kiem 204 "DELETE /api/posts/:id (dọn bài nháp)" -X DELETE -H "Authorization: Bearer $tok" "$GOC/api/posts/$id"
  else
    hong "POST /api/posts → \${m:-000} $(head -c 160 "$tam")"
  fi
fi

if [ "$loi" -eq 0 ]; then echo "SMOKE XANH \${SHA:0:12}"; else echo "SMOKE ĐỎ: $loi phép kiểm hỏng"; exit 1; fi`;

const MIG_R2 = `-- Bài 11.3 (bản R2): tóm tắt bài viết. Lấp bài cũ bằng DEFAULT '' rồi BỎ DEFAULT để cột "bắt buộc" đúng như schema.prisma.
-- ⚠ Đây là một CÁNH CỬA MỘT CHIỀU: mã của bản trước (không biết cột này) INSERT không ghi tom_tat ⇒ vi phạm NOT NULL.
ALTER TABLE "posts" ADD COLUMN "tom_tat" VARCHAR(200) NOT NULL DEFAULT '';
ALTER TABLE "posts" ALTER COLUMN "tom_tat" DROP DEFAULT;`;

const R2 = `$ ssh deployer@chiase.test "chiase/deploy.sh 6b749e8631e25f7b88824fb79f0d5052e4a75216"
[05:52:10] 1/6 kéo ảnh 6b749e8631e2 từ registry.chiase.test:5000/chiase-team
[05:52:12] 2/6 kiểm ảnh tự khai đúng commit
[05:52:12]     api, api-migrate, web đều khai 6b749e8631e2
[05:52:12] 3/6 sao lưu CSDL trước khi migrate
[05:52:13]     sao-luu/20261125T055212Z-truoc-6b749e8631e2.dump (16K, 6 bảng có dữ liệu)
[05:52:13] 4/6 migrate (prisma migrate deploy)
Applying migration \`20261125090000_post_tom_tat\`
The following migration(s) have been applied:
All migrations have been successfully applied.
[05:52:23] 5/6 tráo api + web
[05:52:35] 6/6 smoke test từ https://chiase.test
  ✔ GET /api/health → 200
  ✔ API khai bản 6b749e8631e2
  ✔ web khai bản 6b749e8631e2
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE XANH 6b749e8631e2
[05:52:39] ✔ đang chạy 6b749e8631e2 (trước đó: 30722f7fd864)`;

const R3 = `$ ssh deployer@chiase.test "chiase/deploy.sh e9ff45bbe48efee69b743e4a2d4ba23071fc9a35"
[05:53:21] 1/6 kéo ảnh e9ff45bbe48e từ registry.chiase.test:5000/chiase-team
[05:53:23] 2/6 kiểm ảnh tự khai đúng commit
[05:53:24]     api, api-migrate, web đều khai e9ff45bbe48e
[05:53:24] 3/6 sao lưu CSDL trước khi migrate
[05:53:24]     sao-luu/20261125T055324Z-truoc-e9ff45bbe48e.dump (16K, 6 bảng có dữ liệu)
[05:53:24] 4/6 migrate (prisma migrate deploy)
No pending migrations to apply.
[05:53:33] 5/6 tráo api + web
[05:53:44] 6/6 smoke test từ https://chiase.test
  ✔ GET /api/health → 200
  ✔ API khai bản e9ff45bbe48e
  ✔ web khai bản e9ff45bbe48e
  ✔ GET / trả trang React → 200
  ✘ GET /api/posts?limit=1 → 404 (cần 200)
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE ĐỎ: 1 phép kiểm hỏng
[05:53:47] ↩ TỰ LÙI về 6b749e8631e2 (lược đồ CSDL GIỮ NGUYÊN ở bản mới)
  ✔ GET /api/health → 200
  ✔ API khai bản 6b749e8631e2
  ✔ web khai bản 6b749e8631e2
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE XANH 6b749e8631e2
[05:54:03] ✘ deploy e9ff45bbe48e THẤT BẠI, đã lùi về 6b749e8631e2 — smoke xanh 6`;

const TRAO = `05:53:21.265 → 05:53:34.434  200  ×52
05:53:34.695 → 05:53:34.695  000  ×1
05:53:36.909 → 05:53:43.533  502  ×27
05:53:43.785 → 05:53:49.274  200  ×22
05:53:49.532 → 05:53:49.532  502  ×1
05:53:49.787 → 05:53:49.787  000  ×1
05:53:52.007 → 05:53:58.604  502  ×27
05:53:58.858 → 05:54:24.820  200  ×101
05:54:25.075 → 05:54:25.075  000  ×1
05:54:27.292 → 05:54:34.177  502  ×28
05:54:34.435 → 05:54:35.747  200  ×6`;

const LUI_R1 = `$ ssh deployer@chiase.test "cat chiase/lich-su.log"
2026-11-25T05:40:48Z 0e0a2cba7f3476e4341b813474bb6340d834f2db hong-smoke
2026-11-25T05:42:09Z 30722f7fd864ca4c495359cb600888854f83481e ok
2026-11-25T05:52:39Z 6b749e8631e25f7b88824fb79f0d5052e4a75216 ok
2026-11-25T05:53:47Z e9ff45bbe48efee69b743e4a2d4ba23071fc9a35 hong-smoke
2026-11-25T05:54:03Z 6b749e8631e25f7b88824fb79f0d5052e4a75216 lui-ve

$ ssh deployer@chiase.test "chiase/deploy.sh --lui"   # sếp: "tóm tắt lỗi font, lùi về bản hôm qua đi"
[05:54:12] lùi: 6b749e8631e2 ⇒ 30722f7fd864
[05:54:12] 1/6 kéo ảnh 30722f7fd864 từ registry.chiase.test:5000/chiase-team
[05:54:14] 2/6 kiểm ảnh tự khai đúng commit
[05:54:14]     api, api-migrate, web đều khai 30722f7fd864
[05:54:14] 3/6 sao lưu CSDL trước khi migrate
[05:54:15]     sao-luu/20261125T055414Z-truoc-30722f7fd864.dump (16K, 6 bảng có dữ liệu)
[05:54:15] 4/6 migrate (prisma migrate deploy)
[05:54:22] 5/6 tráo api + web
[05:54:34] 6/6 smoke test từ https://chiase.test
  ✔ GET /api/health → 200
  ✔ API khai bản 30722f7fd864
  ✔ web khai bản 30722f7fd864
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✘ POST /api/posts → 500 {"error":{"code":"LOI_MAY_CHU","message":"Có lỗi phía máy chủ","requestId":"2a80544d-2b95-4dc3-8dec-76f637270bdb"}}
SMOKE ĐỎ: 1 phép kiểm hỏng
[05:54:38] ↩ TỰ LÙI về 6b749e8631e2 (lược đồ CSDL GIỮ NGUYÊN ở bản mới)
  ✔ GET /api/health → 200
  ✔ API khai bản 6b749e8631e2
  ✔ web khai bản 6b749e8631e2
  ✔ GET / trả trang React → 200
  ✔ GET /api/posts?limit=1 → 200
  ✔ GET /api/me không token (tuyến có mặt, khoá đúng) → 401
  ✔ GET /api/khong-co-tuyen-nay (404 của API) → 404
  ✔ WebSocket /socket.io nâng cấp → 101
  ✔ tài khoản smoke có phiên
  ✔ POST /api/posts (ghi CSDL) → 201
  ✔ DELETE /api/posts/:id (dọn bài nháp) → 204
SMOKE XANH 6b749e8631e2
[05:54:52] ✘ deploy 30722f7fd864 THẤT BẠI, đã lùi về 6b749e8631e2 — smoke xanh 6`;

const LOG = `$ ssh deployer@chiase.test "cd chiase &amp;&amp; TAG=$(cat .ban-dang-chay) docker compose -f compose.prod.yaml logs api | grep -c 2a80544d"
0
$ ssh deployer@chiase.test "docker ps -a --format \\"{{.Names}} {{.Image}}\\" | grep api"
chiase-api-1 Up 21 seconds (healthy) registry.chiase.test:5000/chiase-team/chiase-api:6b749e8631e25f7b88824fb79f0d5052e4
$ ssh deployer@chiase.test "cd chiase &amp;&amp; TAG=$(cat .ban-dang-chay) docker compose -f compose.prod.yaml logs --since 2m db | grep -A1 ERROR | tail -2"
2026-11-25 05:54:38.592 UTC [3092] ERROR:  null value in column "tom_tat" of relation "posts" violates not-null constraint
2026-11-25 05:54:38.592 UTC [3092] DETAIL:  Failing row contains (01a21145-377f-7afd-a64a-25537efb4558, 01a2113a-07e0-77f4-a853-940aeef602a5, smoke, bài nháp của smoke test — tự xoá, null, draft, 2026-11-25 05:5`;

const MIG_R4 = `-- Bài 11.3 (bản R4, SỬA TIẾN): trả DEFAULT cho tom_tat. Bản R2 đóng "cánh cửa một chiều": mã cũ INSERT thiếu cột ⇒ 500.
-- Chỉ thêm DEFAULT là mở lại được đường lùi — không động tới dữ liệu, không khoá bảng lâu (chỉ đổi siêu dữ liệu).
ALTER TABLE "posts" ALTER COLUMN "tom_tat" SET DEFAULT '';`;

const R4 = `$ ssh deployer@chiase.test "chiase/deploy.sh 9f1adf4d0baee67ceceb9c2bde6c9f78ceb4b623"
Applying migration \`20261125100000_post_tom_tat_default\`
  ✔ POST /api/posts (ghi CSDL) → 201
SMOKE XANH 9f1adf4d0bae
[05:57:16] ✔ đang chạy 9f1adf4d0bae (trước đó: 6b749e8631e2)

$ ssh deployer@chiase.test "chiase/deploy.sh 30722f7fd864ca4c495359cb600888854f83481e"
No pending migrations to apply.
  ✔ POST /api/posts (ghi CSDL) → 201
SMOKE XANH 30722f7fd864
[05:57:42] ✔ đang chạy 30722f7fd864 (trước đó: 9f1adf4d0bae)

$ ssh deployer@chiase.test "chiase/deploy.sh 9f1adf4d0baee67ceceb9c2bde6c9f78ceb4b623"
No pending migrations to apply.
  ✔ POST /api/posts (ghi CSDL) → 201
SMOKE XANH 9f1adf4d0bae
[05:58:12] ✔ đang chạy 9f1adf4d0bae (trước đó: 30722f7fd864)`;

const MIG_R5 = `-- Bài 11.3 (bản R5): tên đăng nhập lấy từ phần trước @ của email, duy nhất.
-- Chạy ngon trên CSDL dev (mỗi người một email khác hẳn nhau). Trên production thì sao?
ALTER TABLE "users" ADD COLUMN "ten_dang_nhap" VARCHAR(64);
UPDATE "users" SET "ten_dang_nhap" = split_part("email", '@', 1);
CREATE UNIQUE INDEX "users_ten_dang_nhap_key" ON "users"("ten_dang_nhap");`;

const R5 = `$ ssh deployer@chiase.test "chiase/deploy.sh de9aff70a5c2a734547158e6cff8e8690a8aa62c"
[05:59:07] 1/6 kéo ảnh de9aff70a5c2 từ registry.chiase.test:5000/chiase-team
[05:59:12] 2/6 kiểm ảnh tự khai đúng commit
[05:59:12]     api, api-migrate, web đều khai de9aff70a5c2
[05:59:12] 3/6 sao lưu CSDL trước khi migrate
[05:59:13]     sao-luu/20261125T055912Z-truoc-de9aff70a5c2.dump (16K, 6 bảng có dữ liệu)
[05:59:13] 4/6 migrate (prisma migrate deploy)
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "chiase", schema "public" at "db:5432"
10 migrations found in prisma/migrations
Applying migration \`20261125110000_user_ten_dang_nhap\`
Error: P3018
A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve
Migration name: 20261125110000_user_ten_dang_nhap
Database error code: 23505
Database error:
ERROR: could not create unique index "users_ten_dang_nhap_key"
DETAIL: Key (ten_dang_nhap)=(an) is duplicated.
DbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23505), message: "could not create unique index \\"users_ten_dang_nhap_key\\"", detail: Some("Key (ten_dang_nhap)=(an) is duplicated."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("users"), column: None, datatype: None, constraint: Some("users_ten_dang_nhap_key"), file: Some("tuplesortvariants.c"), line: Some(1706), routine: Some("comparetup_index_btree_tiebreak") }
[05:59:17] ✘ migrate HỎNG — KHÔNG tráo api; người dùng vẫn ở bản 9f1adf4d0bae. Đọc lỗi ở trên, KHÔNG tự 'migrate resolve' (bài 11.3) 4

$ curl -s https://chiase.test/api/ | grep -o "\\"ban\\":\\"[0-9a-f]\\{12\\}"   # người dùng đang ở bản nào?
"ban":"9f1adf4d0bae`;

const R5B = `$ ssh deployer@chiase.test "... psql -c \\"\\d users\\" | grep ten_dang"   # cột có nằm lại không?
 ten_dang_nhap | character varying(64)    |           |          | 
$ ssh deployer@chiase.test "... psql -c \\"SELECT migration_name, finished_at, rolled_back_at, left(logs,40) FROM _prisma_migrations ORDER BY started_at DESC LIMIT 2\\""
           migration_name            | xong | rolled_back_at |                   logs                   
-------------------------------------+------+----------------+------------------------------------------
 20261125110000_user_ten_dang_nhap   | f    |                | A migration failed to apply. New migrati
 20261125100000_post_tom_tat_default | t    |                | 
(2 rows)


$ ssh deployer@chiase.test "chiase/deploy.sh de9aff70a5c2a734547158e6cff8e8690a8aa62c"   # thử lại lần nữa
10 migrations found in prisma/migrations
Error: P3009
migrate found failed migrations in the target database, new migrations will not be applied. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve
The \`20261125110000_user_ten_dang_nhap\` migration started at 2026-11-25 05:59:16.405778 UTC failed
[05:59:35] ✘ migrate HỎNG — KHÔNG tráo api; người dùng vẫn ở bản 9f1adf4d0bae. Đọc lỗi ở trên, KHÔNG tự 'migrate resolve' (bài 11.3) 4`;

const CUU = `$ ssh deployer@chiase.test "... psql -c \\"SELECT split_part(email,'@',1) AS ten, count(*) FROM users GROUP BY 1 HAVING count(*) &gt; 1\\""
 ten | count 
-----+-------
 an  |     2
(1 row)

$ # (người) gỡ phần đã chạy dở, rồi đánh dấu migration là đã lùi
$ ssh deployer@chiase.test "... psql -c \\"ALTER TABLE users DROP COLUMN ten_dang_nhap\\""
ALTER TABLE
$ ssh deployer@chiase.test "cd chiase &amp;&amp; TAG=de9aff70a5c2a734547158e6cff8e8690a8aa62c docker compose -f compose.prod.yaml --profile migrate run --rm migrate npx prisma migrate resolve --rolled-back 20261125110000_user_ten_dang_nhap"
Loaded Prisma config from prisma.config.ts.
Prisma schema loaded from prisma/schema.prisma.
Datasource "db": PostgreSQL database "chiase", schema "public" at "db:5432"
Migration 20261125110000_user_ten_dang_nhap marked as rolled back.

$ # thử: CÙNG ba câu lệnh đó, bọc trong BEGIN … COMMIT
BEGIN
ALTER TABLE
UPDATE 3
ERROR:  could not create unique index "users_ten_dang_nhap_key"
DETAIL:  Key (ten_dang_nhap)=(an) is duplicated.
ROLLBACK
số cột ten_dang_nhap còn lại: 0`;

const R6_HONG = `$ ssh deployer@chiase.test "chiase/deploy.sh 10ce86b7daa71674db17707a98cc41fdbf7c22c5"
[06:00:46] 1/6 kéo ảnh 10ce86b7daa7 từ registry.chiase.test:5000/chiase-team
[06:00:49] 2/6 kiểm ảnh tự khai đúng commit
[06:00:50]     api, api-migrate, web đều khai 10ce86b7daa7
[06:00:50] 3/6 sao lưu CSDL trước khi migrate
[06:00:50]     sao-luu/20261125T060050Z-truoc-10ce86b7daa7.dump (20K, 6 bảng có dữ liệu)
[06:00:50] 4/6 migrate (prisma migrate deploy)
Applying migration \`20261125110000_user_ten_dang_nhap\`
[06:00:56] ✘ migrate HỎNG — KHÔNG tráo api; người dùng vẫn ở bản 9f1adf4d0bae. Đọc lỗi ở trên, KHÔNG tự 'migrate resolve' (bài 11.3) 4
$ ssh deployer@chiase.test "... psql -c \\"SELECT email, ten_dang_nhap FROM users ORDER BY id\\""`;

const R6_LOI = `$ ssh deployer@chiase.test "... psql -At -c \\"SELECT logs FROM _prisma_migrations WHERE migration_name LIKE %ten_% ORDER BY started_at DESC LIMIT 1\\""
A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve

Migration name: 20261125110000_user_ten_dang_nhap

Database error code: 42601

Database error:
ERROR: syntax error at or near ","
$ ssh deployer@chiase.test "... psql &lt; migration.sql"     # chạy chính tệp đó bằng tay để thấy dòng hỏng
BEGIN
ALTER TABLE
ERROR:  syntax error at or near ","
LINE 4:          split_part(email, @, 1)
                                    ^
ERROR:  current transaction is aborted, commands ignored until end of transaction block
ROLLBACK`;

const MIG_R7 = `-- Bài 11.3 (bản R6 — SỬA migration R5, vốn CHƯA từng áp dụng xong: đã "migrate resolve --rolled-back" bằng tay).
-- Hai thay đổi so với R5:
--   1. BEGIN … COMMIT: Prisma KHÔNG bọc migration trong giao dịch (bài 11.3 đo: R5 hỏng ở câu 3 mà cột của câu 1
--      vẫn nằm lại). PostgreSQL có DDL trong giao dịch ⇒ hỏng câu nào cũng lùi sạch cả tệp.
--   2. Trùng tên (an@chiase.test và an@khac.test) ⇒ người đến SAU nhận hậu tố -2, -3… (id là uuidv7 ⇒ thứ tự tạo).
BEGIN;
ALTER TABLE "users" ADD COLUMN "ten_dang_nhap" VARCHAR(64);
UPDATE "users" AS u SET "ten_dang_nhap" = x.ten
FROM (
  SELECT id,
         split_part(email, '@', 1)
           || CASE WHEN row_number() OVER w &gt; 1 THEN '-' || row_number() OVER w ELSE '' END AS ten
  FROM "users"
  WINDOW w AS (PARTITION BY split_part(email, '@', 1) ORDER BY id)
) AS x
WHERE u.id = x.id;
CREATE UNIQUE INDEX "users_ten_dang_nhap_key" ON "users"("ten_dang_nhap");
COMMIT;`;

const R7 = `$ ssh deployer@chiase.test "... psql -c \\"\\d users\\" | grep -c ten_dang"   # sau lượt R6 hỏng (bản ĐÃ bọc BEGIN)
0
$ ssh deployer@chiase.test "cd chiase &amp;&amp; TAG=10ce86b7daa7… … migrate resolve --rolled-back 20261125110000_user_ten_dang_nhap"
Migration 20261125110000_user_ten_dang_nhap marked as rolled back.

$ ssh deployer@chiase.test "chiase/deploy.sh 54dfcffc944487b377a2ee3395b794d4204d1e00"
[06:02:30] 1/6 kéo ảnh 54dfcffc9444 từ registry.chiase.test:5000/chiase-team
[06:02:34] 2/6 kiểm ảnh tự khai đúng commit
[06:02:34]     api, api-migrate, web đều khai 54dfcffc9444
[06:02:34] 3/6 sao lưu CSDL trước khi migrate
[06:02:35]     sao-luu/20261125T060234Z-truoc-54dfcffc9444.dump (20K, 6 bảng có dữ liệu)
[06:02:35] 4/6 migrate (prisma migrate deploy)
Applying migration \`20261125110000_user_ten_dang_nhap\`
[06:02:52] 5/6 tráo api + web
[06:03:09] 6/6 smoke test từ https://chiase.test
SMOKE XANH 54dfcffc9444
[06:03:13] ✔ đang chạy 54dfcffc9444 (trước đó: 9f1adf4d0bae)
$ ssh deployer@chiase.test "... psql -c \\"SELECT email, ten_dang_nhap FROM users ORDER BY id\\""
       email       | ten_dang_nhap 
-------------------+---------------
 smoke@chiase.test | smoke
 an@chiase.test    | an
 an@khac.test      | an-2
(3 rows)`;

const PHUC_HOI_SH = `#!/usr/bin/env bash
# thu-phuc-hoi.sh [tệp.dump] — DIỄN TẬP phục hồi (bài 11.3): nạp bản sao lưu mới nhất vào một CSDL TẠM, đếm, rồi xoá.
# Bản sao lưu chưa từng được phục hồi thử thì chưa phải bản sao lưu (GitLab 31/01/2017: năm cơ chế, không cái nào cứu được).
set -euo pipefail
cd "$(dirname "$0")"
export TAG=$(cat .ban-dang-chay)
f="\${1:-$(ls -t sao-luu/*.dump | head -1)}"
db() { docker compose -f compose.prod.yaml exec -T db "$@"; }
db dropdb -U chiase --if-exists thu_phuc_hoi
db createdb -U chiase thu_phuc_hoi
trap 'db dropdb -U chiase --if-exists thu_phuc_hoi' EXIT
t0=$(date +%s%N)
db pg_restore -U chiase -d thu_phuc_hoi --no-owner --exit-on-error &lt; "$f"
ms=$(( ($(date +%s%N) - t0) / 1000000 ))
dem() { db psql -U chiase -d "$1" -Atc "SELECT (SELECT count(*) FROM users)||' người dùng · '||(SELECT count(*) FROM posts)||' bài · '||(SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL)||' migration'"; }
echo "bản sao lưu : $f ($(du -h "$f" | cut -f1)), phục hồi trong $ms ms"
echo "  phục hồi  : $(dem thu_phuc_hoi)"
echo "  đang chạy : $(dem chiase)"`;

const UMASK = `$ cd chiase &amp;&amp; scp -q deploy/*.sh deploy/compose.prod.yaml deployer@chiase.test:chiase/ &amp;&amp; ssh deployer@chiase.test "chiase/deploy.sh ea8d8a130a9dda49dea71a2bfee35d223fb26f1b 2&gt;&amp;1 | grep -E \\"sao-luu|SMOKE|đang chạy\\""
[06:04:32]     sao-luu/20261125T060431Z-truoc-ea8d8a130a9d.dump (20K, 6 bảng có dữ liệu)
SMOKE XANH ea8d8a130a9d
[06:05:23] ✔ đang chạy ea8d8a130a9d (trước đó: 54dfcffc9444)

$ ssh deployer@chiase.test "ls -l chiase/sao-luu | tail -2"
-rw-rw-r--  … Nov 25 06:02 20261125T060234Z-truoc-54dfcffc9444.dump
-rw-------  … Nov 25 06:04 20261125T060431Z-truoc-ea8d8a130a9d.dump

$ ssh deployer@chiase.test chiase/thu-phuc-hoi.sh
chiase/thu-phuc-hoi.sh: line 11: trap: dropdb: invalid signal specification
chiase/thu-phuc-hoi.sh: line 11: trap: -U: invalid signal specification
chiase/thu-phuc-hoi.sh: line 11: trap: chiase: invalid signal specification
chiase/thu-phuc-hoi.sh: line 11: trap: --if-exists: invalid signal specification
chiase/thu-phuc-hoi.sh: line 11: trap: thu_phuc_hoi: invalid signal specification
requires at least 2 arg(s), only received 1`;

const PHUC_HOI = `$ ssh deployer@chiase.test chiase/thu-phuc-hoi.sh
bản sao lưu : sao-luu/20261125T060624Z-truoc-6fbd3331c683.dump (20K), phục hồi trong 604 ms
  phục hồi  : 3 người dùng · 3 bài · 10 migration
  đang chạy : 3 người dùng · 3 bài · 10 migration`;

const SAO_LUU = `$ ssh deployer@chiase.test "ls -lh chiase/sao-luu | tail -3"
-rw-rw-r--. 1 deployer deployer 17K Nov 25 05:59 20261125T055929Z-truoc-de9aff70a5c2.dump
-rw-rw-r--. 1 deployer deployer 17K Nov 25 06:00 20261125T060050Z-truoc-10ce86b7daa7.dump
-rw-rw-r--. 1 deployer deployer 17K Nov 25 06:02 20261125T060234Z-truoc-54dfcffc9444.dump

$ ssh deployer@chiase.test "cd chiase &amp;&amp; f=\\$(ls -t sao-luu/*.dump | head -1) &amp;&amp; D=\\"docker compose -f compose.prod.yaml exec -T db\\" &amp;&amp; export TAG=\\$(cat .ban-dang-chay) &amp;&amp; \\$D createdb -U chiase thu_phuc_hoi &amp;&amp; \\$D pg_restore -U chiase -d thu_phuc_hoi --no-owner &lt; \\$f &amp;&amp; \\$D psql -U chiase -d thu_phuc_hoi -Atc \\"SELECT (SELECT count(*) FROM users) || \\\\\\" người dùng, \\\\\\" || (SELECT count(*) FROM posts) || \\\\\\" bài, \\\\\\" || (SELECT count(*) FROM _prisma_migrations WHERE finished_at IS NOT NULL) || \\\\\\" migration\\\\\\"\\" &amp;&amp; \\$D dropdb -U chiase thu_phuc_hoi &amp;&amp; echo \\"(đã xoá CSDL thử)\\""
ERROR:  column " người dùng, " does not exist
LINE 1: SELECT (SELECT count(*) FROM users) || " người dùng, " || (S...
                                               ^

$ mkdir -p ~/sao-luu-chiase &amp;&amp; scp -q "deployer@chiase.test:chiase/sao-luu/*.dump" ~/sao-luu-chiase/ &amp;&amp; ls ~/sao-luu-chiase | wc -l
10`;

const CRON_SAI = `$ ssh deployer@chiase.test 'mkdir -p chiase/logs &amp;&amp; (crontab -l 2&gt;/dev/null; echo "17 3 * * * $HOME/chiase/don-refresh.sh &gt;&gt; $HOME/chiase/logs/don-refresh.log 2&gt;&amp;1") | crontab - &amp;&amp; crontab -l'
17 3 * * * /home/deployer/chiase/don-refresh.sh &gt;&gt; /home/deployer/chiase/logs/don-refresh.log 2&gt;&amp;1

$ ssh deployer@chiase.test chiase/don-refresh.sh
2026-11-25 06:07:27 xoá 45 token, còn 62

$ ssh deployer@chiase.test chiase/don-refresh.sh   # chạy lần nữa: không còn gì để xoá
2026-11-25 06:07:28 xoá 0 token, còn 17`;

const CRON_DUNG = `$ ssh deployer@chiase.test chiase/don-refresh.sh
2026-11-25 06:09:40 xoá 45 token, còn 18`;

const DON_SH = `#!/usr/bin/env bash
# don-refresh.sh — xoá refresh token đã chết (lời hứa bài 3.2). Chạy hằng đêm bằng cron:
#   17 3 * * * $HOME/chiase/don-refresh.sh &gt;&gt; $HOME/chiase/logs/don-refresh.log 2&gt;&amp;1
# Giữ token thu hồi thêm 7 ngày: phát hiện "token đã dùng bị dùng lại" (bài 3.2) cần thấy dòng cũ để thu hồi cả họ.
# Đếm "còn lại" bằng câu lệnh RIÊNG: trong một WITH … DELETE, các truy vấn con khác vẫn thấy ảnh chụp TRƯỚC khi xoá
# (bản đầu của script này báo "xoá 45, còn 62" — thật ra còn 17; bài 11.3).
set -euo pipefail
cd "$(dirname "$0")"
sql() { TAG=$(cat .ban-dang-chay) docker compose -f compose.prod.yaml exec -T db psql -U chiase -d chiase -v ON_ERROR_STOP=1 -Atc "$1"; }
xoa=$(sql "WITH xoa AS (DELETE FROM refresh_tokens
             WHERE expires_at &lt; now() - interval '1 day' OR revoked_at &lt; now() - interval '7 days' RETURNING 1)
           SELECT count(*) FROM xoa")
con=$(sql "SELECT count(*) FROM refresh_tokens")
echo "$(date -u '+%F %T') xoá $xoa token, còn $con"`;

const GIT_LOG = `f707cca test: checkpoint-11 (từ chỗ người dùng đứng, trên máy chủ, diễn tập lùi bản)
d69a75f Ch11: don-refresh — đếm phần còn lại bằng câu lệnh riêng (ảnh chụp của WITH … DELETE)
6fbd333 Ch11: thu-phuc-hoi.sh — trả dấu nháy bị mất (trap, chuỗi SQL)
ea8d8a1 Ch11: deploy/thu-phuc-hoi.sh (diễn tập phục hồi) + umask 077 cho bản sao lưu
54dfcff fix(db): migration tên đăng nhập — dấu nháy bị mất khi dán (lỗi cú pháp)
10ce86b fix(db): migration tên đăng nhập — bọc giao dịch, xử lý tên trùng
de9aff7 feat(user): tên đăng nhập duy nhất lấy từ email
9f1adf4 fix(db): tom_tat có DEFAULT rỗng — mở lại đường lùi về bản trước R2
2288929 Revert "refactor(routes): gom tuyến bài viết" — smoke bắt 404 ở GET /api/posts
e9ff45b refactor(routes): gom tuyến bài viết
6b749e8 feat(post): tóm tắt bài (tom_tat) — migration lấp rồi bỏ DEFAULT
30722f7 Ch11: smoke — /api/ có gạch chéo, Sec-WebSocket-Key đúng 16 byte (bộ kiểm báo đỏ oan ở lần deploy đầu)
0e0a2cb Ch11: deploy/tao-env.sh — sinh .env trên VPS, không in bí mật
8323b05 Ch11: nginx — listen ... ssl http2 (Nginx 1.24 của Ubuntu 24.04 chưa có chỉ thị http2)
e984ccc Ch11: deploy/ — smoke bỏ qua lượt ghi khi chưa có tài khoản smoke (lần deploy đầu)
9da78e8 Ch11: ảnh tự khai commit + thư mục deploy (compose.prod, deploy.sh, smoke.sh, nginx, don-refresh)
12b2eeb Ch10: trạng thái cuối Chương 10 (bản chép từ cây làm việc chiase)`;


const NGUON = [
  nguon('📗', 'Prisma Docs — Patching & hotfixing / migrate resolve (production)', 'prisma.io', 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/patching-and-hotfixing'),
  nguon('🐘', 'PostgreSQL — WITH queries: data-modifying statements (cùng một ảnh chụp)', 'postgresql.org', 'https://www.postgresql.org/docs/current/queries-with.html#QUERIES-WITH-MODIFYING'),
  nguon('🔥', 'GitLab — Postmortem of database outage of January 31 (2017)', 'about.gitlab.com', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/'),
].join('\n');

const THE = [
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-5-2-mo-rong-thu-hep', title: 'Deploy VPS 5.2 — Mở rộng và thu hẹp: cú đổi tên không bao giờ làm vỡ', sub: 'Lý thuyết đứng sau bản R4.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-5-4-migration-nua-chung', title: 'Deploy VPS 5.4 — Cái migration áp dụng NỬA CHỪNG', sub: 'Đào sâu đúng sự cố bản R5.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-6-2-lui-noi-doi', title: 'Deploy VPS 6.2 — Cú lùi NÓI DỐI', sub: 'Lùi bản mà smoke chỉ hỏi GET.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-10-4-kiem-chung', title: 'Deploy VPS 10.4 — Bằng chứng DUY NHẤT là một cú phục hồi', sub: 'Vì sao có thu-phuc-hoi.sh.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'deploy-vps', bai: 'deploy-13-4-khong-rot-request-voi-container', title: 'Deploy VPS 13.4 — Tráo container mà không rơi request', sub: 'Xoá chín giây 502 đo ở mục 5.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'github-actions', bai: 'ga-9-3-rollback', title: 'GitHub Actions 9.3 — Rollback, cái nhánh bạn không bao giờ đi', sub: 'Đưa deploy.sh --lui vào một workflow bấm tay.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'docker', bai: 'dk-11-4-cap-nhat-quay-lui', title: 'Docker 11.4 — Cập nhật, CI/CD, và quay lui', sub: 'Quay lui ở tầng ảnh.', cta: 'Mở bài →' }),
].join('\n');

export default {
  title: '11.3 — Smoke-testing production and a rollback plan|||11.3 — Kiểm nhanh production và kế hoạch rollback',
  slug: 'fp-11-3-smoke-rollback',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Script deploy sáu bước + smoke test đi đúng đường người dùng (kể cả một lượt GHI), rồi một chuỗi phát hành thật: bản hỏng tuyến bị smoke bắt và TỰ LÙI (đo được chín giây 502 mỗi lần tráo); lùi tay về bản cũ mà POST trả 500 vì migration đã đóng "cánh cửa một chiều" — sửa tiến bằng expand/contract; migration hỏng giữa chừng để lại cột thừa và khoá mọi lần deploy sau (P3018 ⇒ P3009) — cứu bằng tay, bọc BEGIN/COMMIT; log nằm đâu (và log của container cũ biến mất khi tráo); sao lưu trước mỗi migration, diễn tập phục hồi, cron dọn refresh token (lời hứa bài 3.2) — mỗi script có một con bọ do chính lần chạy thật tìm ra.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Deploy</span>
<h2>Every deploy is a hypothesis. The smoke test is the experiment</h2>
<p class="lead">A deploy says "the new version works". Health checks only say "the process is up and the database answers". Between those two sentences live the 404 from a renamed route, the 500 from a column the old code does not know, and the migration that stopped half way. This lesson ships seven real releases to the VPS — three of them broken on purpose or by accident — and shows what caught each one, what the users saw, and how long.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">pull</span><span class="lz-d">3 images by SHA, labels checked</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">backup</span><span class="lz-d">pg_dump, mode 600, restore drill</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">migrate</span><span class="lz-d">fails ⇒ stop before the swap</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">swap</span><span class="lz-d">up --wait (≈ 9 s of 502)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">smoke</span><span class="lz-d">GETs + one write; red ⇒ roll back + re-smoke</span></div>
</div>


<h3>1. The deploy script, whole</h3>
<pre><code class="language-mermaid">flowchart LR
  A[SHA?] --> B[pull 3 images] --> C{revision label = SHA?}
  C -- no --> X[stop]
  C -- yes --> D[pg_dump] --> E{migrate deploy}
  E -- fails --> Y[stop · users stay on old]
  E -- ok --> F[up --wait api web] --> G{smoke}
  G -- red --> H[roll back to previous SHA] --> I{smoke}
  G -- green --> Z[record SHA]
  I -- red --> P[page a human]</code></pre>
<pre><code class="language-bash">${DEPLOY_SH}</code></pre>
<p>Design choices worth defending in a review: <code>flock</code> (two deploys at once corrupt everything), the label check (a mistagged image is caught before it runs), the backup <em>before</em> migrate (the only thing that undoes a bad data change), migrate failure stops <em>before</em> the swap (users stay on the old version), and the rollback re-runs the smoke test — a rollback is a deploy too.</p>

<h3>2. The smoke test walks where users walk</h3>
<pre><code class="language-bash">${SMOKE_SH}</code></pre>
<p>Status codes carry meaning: <strong>200</strong> the route exists and works; <strong>401</strong> on <code>/api/me</code> the route exists and auth is wired; <strong>404</strong> on a route that must exist means a stale or broken build. The write path — create a draft and delete it with a dedicated account — is what catches database problems that every <code>GET</code> misses, as section 4 shows.</p>

<h3>3. Release R2: an innocent feature with a one-way door</h3>
<p>R2 adds a summary to posts. The migration is the textbook way to add a required column to a table with rows:</p>
<pre><code class="language-sql">${MIG_R2}</code></pre>
<div class="out">${R2}</div>
<p>Green. Remember the second line of that migration.</p>

<h3>4. Release R3: health is green, the feed is gone</h3>
<p>R3 is a "small refactor" of the router — one character (<code>/posts</code> ⇒ <code>/post</code>) that type checking cannot see. While it deployed, a loop on another machine asked <code>/api/health</code> five times a second.</p>
<div class="out">${R3}</div>
<p>Health 200, revision correct, write path fine — only <code>GET /api/posts</code> 404'd, and that is the request every visitor makes first. The script rolled back by itself and re-ran the smoke test against the old version. What users experienced, measured from outside:</p>
<div class="out">${TRAO}</div>
<p>Three swaps (R3 in, back to R2, and the next deploy), each with <strong>about 9 seconds of 502</strong> (27–28 requests at 0.25 s): <code>up -d</code> stops the old container before the new one is healthy, and the VPS Nginx has nowhere to send traffic. Plus ~20 s during which the broken R3 served 404 on the feed (05:53:44 → 05:54:03). That is the honest cost of the simplest possible deploy. Zero-downtime swaps (two API containers behind an upstream, switch, drain) are the linked lessons — for a student project, nine seconds at 3 a.m. is a fine trade; for a shop at noon it is not.</p>

<h3>5. Where are the logs? Not where you left them</h3>
<p>The smoke test in section 6 below got a <code>500</code> with request ID <code>2a80544d…</code>. Looking for it:</p>
<div class="out">${LOG}</div>
<p>Zero lines: the API container that served the error was <em>replaced</em> by the rollback, and with the <code>local</code> log driver its logs went with it. The database container was not replaced, and Postgres logged the real cause. Lessons: (1) every error response carries a request ID and every log line too (lesson 5.3 did this), (2) for an investigation, grab <code>docker compose logs api &gt; incident.log</code> <em>before</em> redeploying, (3) a real project ships logs off the container (journald driver, or a log collector) — linked in 11.4.</p>
<table>
<tr><th>Symptom</th><th>Look first at</th></tr>
<tr><td>502 / 504 from the site</td><td><code>/var/log/nginx/error.log</code> on the VPS (upstream refused / timed out) ⇒ <code>docker compose ps</code></td></tr>
<tr><td>500 with a request ID</td><td><code>docker compose logs api | grep &lt;id&gt;</code> ⇒ <code>logs db</code> for SQL errors</td></tr>
<tr><td>Container restarting</td><td><code>docker compose ps</code> (exit code; 137 = killed for memory) ⇒ <code>logs --tail 50 api</code></td></tr>
<tr><td>Certificate errors</td><td><code>/var/log/letsencrypt/letsencrypt.log</code>, <code>openssl x509 -enddate</code></td></tr>
<tr><td>"It worked yesterday"</td><td><code>~/chiase/lich-su.log</code> — what was deployed when</td></tr>
</table>

<h3>6. The rollback that lies</h3>
<p>The boss: "the summary field looks wrong, go back to yesterday's version". <code>deploy.sh --lui</code> picks the last good SHA that is not the current one — R1, from before the summary existed:</p>
<div class="out">${LUI_R1}</div>
<p>Every <code>GET</code> was green. <code>POST /api/posts</code> was 500: R1's code inserts posts without <code>tom_tat</code>, and R2's migration removed the default, so the column is <code>NOT NULL</code> with nothing to fill it — the database log above said exactly that. A smoke test made of <code>GET</code>s would have declared this rollback a success and left the site unable to accept a single new post. The script went back to R2 instead.</p>
<p>Code can be rolled back; the schema cannot (the migration does not run backwards, and nobody wants a <code>DROP COLUMN</code> on production in a hurry). The way out is <strong>forward</strong>: R4 restores what old code needs.</p>
<pre><code class="language-sql">${MIG_R4}</code></pre>
<div class="out">${R4}</div>
<p>After R4, R1 runs again on the new schema, and back to R4 — both directions green. That is <strong>expand / contract</strong>: a release may only <em>add</em> things the previous release can ignore (nullable or defaulted columns, new tables, new indexes built concurrently); removing or tightening (drop column, drop default, rename, <code>NOT NULL</code> without default) waits until no running or rollback-able version depends on the old shape — usually one release later.</p>

<h3>7. The migration that stopped half way</h3>
<p>R5: a unique username derived from the email. On the developer's database every email is different; on production two people are called "an":</p>
<pre><code class="language-sql">${MIG_R5}</code></pre>
<div class="out">${R5}</div>
<p>The script stopped before the swap: users never saw R5. But look at the database:</p>
<div class="out">${R5B}</div>
<p>Two facts that surprise people: <strong>Prisma does not wrap a migration in a transaction</strong> — statement 1 (<code>ADD COLUMN</code>) stayed, statement 3 failed; and the failed migration is recorded, so every future deploy stops with <code>P3009</code> until a human decides. That is the right behaviour, and it is why the script prints "do not <code>migrate resolve</code> automatically": resolving without looking would mark a half-applied schema as either "applied" (it is not) or "rolled back" (it is not, yet).</p>
<p>The human procedure — look, undo exactly what ran, mark, fix the migration, deploy again:</p>
<div class="out">${CUU}</div>
<p>The last block is the fix in miniature: the same three statements inside <code>BEGIN … COMMIT</code> fail the same way, and <em>nothing</em> remains — PostgreSQL has transactional DDL. The corrected migration (R6) wraps itself and handles duplicates. And R6 failed too — a typing error by the author of this lesson (quotes lost while pasting into a shell):</p>
<div class="out">${R6_HONG}</div>
<div class="out">${R6_LOI}</div>
<p>This time the failure left nothing behind — the column does not exist — because the file was wrapped. One more <code>resolve --rolled-back</code>, fix the quotes, R7:</p>
<pre><code class="language-sql">${MIG_R7}</code></pre>
<div class="out">${R7}</div>
<p>(Editing a migration is allowed <em>only</em> because it never completed anywhere and is marked rolled back. A migration that has been applied on any shared database is immutable; fix it with a new one, as R4 did.)</p>

<h3>8. Backups you have actually restored</h3>
<p><code>deploy.sh</code> dumps the database before every migration. The first measurement found a hole:</p>
<div class="out">${UMASK}</div>
<p>Dumps contain every password hash and every post; they were created readable by any user on the machine (<code>-rw-rw-r--</code>). One line, <code>umask 077</code>, and the next dump is <code>-rw-------</code>. Then the part almost everybody skips — restoring:</p>
<pre><code class="language-bash">${PHUC_HOI_SH}</code></pre>
<div class="out">${PHUC_HOI}</div>
<p>And a copy that does not live on the machine it protects (a dead disk, a deleted VPS or an attacker with the deploy key takes local backups too):</p>
<div class="out">${SAO_LUU.split('\n\n').slice(-1)[0]}</div>

<h3>🔥 Incident — GitLab.com, 31 January 2017</h3>
<p>An engineer meant to wipe a lagging replica and ran the command on the primary; "around 300 GB of data had already been removed" when he stopped it. GitLab then discovered that its backups did not work: the daily <code>pg_dump</code> to S3 had produced an empty bucket (pg_dump 9.2 against PostgreSQL 9.6 — and the failure e-mails were silently rejected), disk snapshots were not enabled for the database servers, replication could not catch up. They restored from an LVM snapshot taken by hand six hours earlier; GitLab.com was down about 18 hours and lost data for roughly 5,000 projects, 5,000 comments and 700 new accounts (GitLab's own post-mortem). The lesson they published is the one <code>thu-phuc-hoi.sh</code> encodes: a backup is not a file that exists, it is a restore that has been done — on a schedule, with the counts compared, and with an alert when it fails.</p>

<h3>9. The nightly cleanup (promise of 3.2) — and a counting bug</h3>
<p>Refresh tokens accumulate: one row per login and per rotation. Expired rows are useless; revoked rows are kept a week so reuse detection (lesson 3.2) can still recognise a stolen token. A cron job deletes the rest. The first version printed nonsense:</p>
<div class="out">${CRON_SAI}</div>
<p>"Deleted 45, 62 left" — then the second run says 17 left. In a <code>WITH … DELETE … RETURNING</code>, the other subqueries of the same statement see the snapshot from <em>before</em> the delete (PostgreSQL docs). The deletion was right; the report lied. Fixed by counting in a separate statement:</p>
<pre><code class="language-bash">${DON_SH}</code></pre>
<div class="out">${CRON_DUNG}</div>

<h3>10. The rollback plan, on one page</h3>
<table>
<tr><th>Situation</th><th>Action</th><th>Data</th></tr>
<tr><td>Smoke red after swap</td><td>Automatic: script rolls back to previous SHA and re-smokes</td><td>Schema stays new — only safe if the release was expand-only</td></tr>
<tr><td>Bug found later, schema unchanged</td><td><code>./deploy.sh --lui</code> (or <code>./deploy.sh &lt;sha&gt;</code>)</td><td>Untouched</td></tr>
<tr><td>Bug found later, release changed schema</td><td>Check old code against new schema (smoke write path!). If it fails: fix forward (R4)</td><td>Never "migrate down" in a hurry</td></tr>
<tr><td>Migration failed (P3018 / P3009)</td><td>Stop. Inspect what ran. Undo exactly that, <code>migrate resolve --rolled-back</code>, fix, redeploy — a human decision</td><td>Backup from step 3 is the safety net</td></tr>
<tr><td>Data destroyed</td><td>Restore the dump into a new database, compare, switch</td><td>Loss = time since last dump</td></tr>
</table>
<p>The release history of this lesson, as git shows it — a revert, a fix-forward and two migration fixes are what a real week looks like:</p>
<pre><code>${GIT_LOG}</code></pre>

<h3>🧪 Lab 11.3 — break production three ways (on purpose)</h3>
<div class="callout ok">
<ol>
<li>Ship a release that removes one route your smoke test checks. Measure, from another machine, how long users get 502 and how long the broken route answered.</li>
<li>Ship a release whose migration drops the default of a <code>NOT NULL</code> column, then roll back. Make your smoke test catch it; fix forward.</li>
<li>Ship a migration that fails on its third statement. Show the half-applied state, recover by hand, and show that the corrected migration wrapped in <code>BEGIN/COMMIT</code> leaves nothing behind when it fails.</li>
<li>Restore your newest backup into a scratch database and compare row counts with production.</li>
</ol>
<p><strong>Done when:</strong> <code>lich-su.log</code> shows at least one <code>hong-smoke</code>, one <code>lui-ve</code> and one <code>ok</code> after them, and you can explain each line.</p>
</div>
<details><summary>Solution</summary>
<ol>
<li>Expect ≈ the time from "5/6" to the rollback finishing (here ~9 s of 502 per swap + ~20 s of 404). Measure with a loop: <code>while :; do date +%T.%N; curl -s -o /dev/null -w '%{http_code}\n' https://…/api/health; sleep 0.2; done</code>.</li>
<li><code>ALTER COLUMN … DROP DEFAULT</code>; rollback ⇒ POST 500 ⇒ smoke red ⇒ script returns to the new release. Fix forward with <code>SET DEFAULT</code>; then the rollback is green.</li>
<li>As in section 7: <code>\\d table</code> shows the leftover; <code>DROP</code> it; <code>docker compose --profile migrate run --rm migrate npx prisma migrate resolve --rolled-back &lt;name&gt;</code>; wrap the corrected file in <code>BEGIN; … COMMIT;</code>.</li>
<li><code>./thu-phuc-hoi.sh</code> — the "phục hồi" and "đang chạy" lines must match (they can differ by rows written since the dump; explain any difference).</li>
</ol>
</details>

${spring(true, 'Same plan with Flyway: Flyway runs each migration in a transaction on PostgreSQL by default (so R5\'s half-applied state does not happen), records failures in flyway_schema_history, and "flyway repair" is the equivalent of migrate resolve — equally a human decision. Expand/contract and the write-path smoke test are identical.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI with GitHub Actions'],
  ['sb-18-4-tong-ket', 'Spring Boot 18.4 — Final checklist and comparison with Node.js'],
])}

<h3>On the job</h3>
<p>Release notes at a company usually have a "rollback" line. Write it truthfully: "rollback = redeploy <code>&lt;previous sha&gt;</code>; schema change is expand-only (new nullable column), old code verified against new schema by smoke write path". If you cannot write that sentence, the release is not ready — say so in the review instead of discovering it at night.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How do you roll back a deploy that included a migration?"</strong> — Usually you don't roll the schema back: releases are expand-only, so old code runs on the new schema; otherwise fix forward.</li>
<li><strong>"Your health check is green but users complain. Why?"</strong> — Health checks prove liveness, not features. A smoke test exercises real routes, including a write.</li>
<li><strong>"A migration failed half way in production. What do you do?"</strong> — Stop deploys, inspect which statements ran, undo exactly those, mark it rolled back, fix and redeploy; never auto-resolve.</li>
<li><strong>"How do you know your backups work?"</strong> — Scheduled restore into a scratch database with row counts compared, alert on failure.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">smoke test</span><span class="v">Fast end-to-end check of the main user paths right after a deploy.</span></div>
  <div class="kv"><span class="k">rollback</span><span class="v">Redeploy the previous known-good artifact.</span></div>
  <div class="kv"><span class="k">fix forward</span><span class="v">Repair with a new release instead of going back.</span></div>
  <div class="kv"><span class="k">expand/contract</span><span class="v">Add first, remove one release later, so old and new code both run.</span></div>
  <div class="kv"><span class="k">P3018 / P3009</span><span class="v">Prisma: migration failed / earlier failed migration blocks new ones.</span></div>
  <div class="kv"><span class="k">restore drill</span><span class="v">Restoring a backup on purpose to prove it works.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Deploy = pull by SHA, verify label, back up, migrate, swap, smoke; red smoke ⇒ automatic rollback + re-smoke.</li>
<li>Smoke must include a write: R1-after-R2 was green on every GET and broken on POST.</li>
<li>Schema changes are one-way doors: expand only, fix forward.</li>
<li>Prisma migrations are not transactional by default — wrap them; a failed one blocks deploys until a human resolves it.</li>
<li>Backups are 600, off-machine, and restored on purpose.</li>
</ul>
${NGUON}
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Deploy</span>
<h2>Mỗi lần deploy là một giả thuyết. Smoke test là thí nghiệm</h2>
<p class="lead">Lần deploy nói "bản mới chạy được". Health check chỉ nói "tiến trình đang sống và CSDL trả lời". Giữa hai câu đó là cái 404 của một tuyến bị đổi tên, cái 500 của một cột mà mã cũ không biết, và cái migration dừng giữa chừng. Bài này đưa bảy bản phát hành THẬT lên VPS — ba bản trong đó hỏng, cố ý hoặc vô tình — và cho thấy cái gì bắt được từng bản, người dùng thấy gì, và trong bao lâu.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">kéo</span><span class="lz-d">3 ảnh theo SHA, kiểm nhãn</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">sao lưu</span><span class="lz-d">pg_dump, mode 600, diễn tập phục hồi</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">migrate</span><span class="lz-d">hỏng ⇒ dừng trước khi tráo</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">tráo</span><span class="lz-d">up --wait (≈ 9 giây 502)</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">smoke</span><span class="lz-d">GET + một lượt ghi; đỏ ⇒ lùi + smoke lại</span></div>
</div>


<h3>1. Toàn bộ script deploy</h3>
<pre><code class="language-mermaid">flowchart LR
  A[SHA?] --> B[kéo 3 ảnh] --> C{nhãn revision = SHA?}
  C -- không --> X[dừng]
  C -- đúng --> D[pg_dump] --> E{migrate deploy}
  E -- hỏng --> Y[dừng · người dùng ở bản cũ]
  E -- ổn --> F[up --wait api web] --> G{smoke}
  G -- đỏ --> H[lùi về SHA trước] --> I{smoke}
  G -- xanh --> Z[ghi SHA]
  I -- đỏ --> P[gọi người]</code></pre>
<pre><code class="language-bash">${DEPLOY_SH}</code></pre>
<p>Những lựa chọn đáng bảo vệ khi bị review: <code>flock</code> (hai lượt deploy cùng lúc phá hỏng mọi thứ), kiểm nhãn (ảnh gắn nhầm tag bị bắt trước khi chạy), sao lưu <em>trước</em> migrate (thứ duy nhất gỡ được một thay đổi dữ liệu sai), migrate hỏng thì dừng <em>trước</em> khi tráo (người dùng ở lại bản cũ), và lúc lùi cũng chạy lại smoke — lùi bản cũng là một lần deploy.</p>

<h3>2. Smoke test đi đúng đường người dùng đi</h3>
<pre><code class="language-bash">${SMOKE_SH}</code></pre>
<p>Mã trạng thái mang nghĩa: <strong>200</strong> tuyến có và chạy; <strong>401</strong> ở <code>/api/me</code> là tuyến có và xác thực đã nối; <strong>404</strong> ở một tuyến phải có nghĩa là bản dựng cũ hoặc hỏng. Lượt ghi — tạo một bài nháp rồi xoá bằng một tài khoản riêng — là thứ bắt được lỗi CSDL mà mọi <code>GET</code> bỏ lọt, như mục 6 cho thấy.</p>

<h3>3. Bản R2: một tính năng vô hại với một cánh cửa một chiều</h3>
<p>R2 thêm phần tóm tắt cho bài viết. Migration là cách sách giáo khoa để thêm một cột bắt buộc vào bảng đã có dữ liệu:</p>
<pre><code class="language-sql">${MIG_R2}</code></pre>
<div class="out">${R2}</div>
<p>Xanh. Nhớ dòng thứ hai của migration đó.</p>

<h3>4. Bản R3: health xanh, feed biến mất</h3>
<p>R3 là một "refactor nhỏ" phần tuyến — đúng một ký tự (<code>/posts</code> ⇒ <code>/post</code>) mà kiểm kiểu không nhìn thấy. Trong lúc nó deploy, một vòng lặp ở máy khác hỏi <code>/api/health</code> năm lần mỗi giây.</p>
<div class="out">${R3}</div>
<p>Health 200, revision đúng, lượt ghi ổn — chỉ <code>GET /api/posts</code> 404, mà đó là request mọi người vào trang đều gửi đầu tiên. Script tự lùi và chạy lại smoke với bản cũ. Người dùng trải qua những gì, đo từ bên ngoài:</p>
<div class="out">${TRAO}</div>
<p>Ba lần tráo (R3 vào, lùi về R2, và lần deploy kế), lần nào cũng <strong>khoảng 9 giây 502</strong> (27–28 request cách nhau 0,25 giây): <code>up -d</code> dừng container cũ trước khi container mới healthy, và Nginx của VPS không còn chỗ nào để gửi request. Cộng thêm ~20 giây bản R3 hỏng trả 404 cho feed (05:53:44 → 05:54:03). Đó là cái giá trung thực của cách deploy đơn giản nhất. Tráo không gián đoạn (hai container API sau một upstream, chuyển, xả) là các bài liên kết — với dự án sinh viên, chín giây lúc 3 giờ sáng là đổi chác hợp lý; với một cửa hàng lúc trưa thì không.</p>

<h3>5. Log ở đâu? Không ở chỗ bạn để nó</h3>
<p>Smoke test ở mục 6 dưới đây nhận một <code>500</code> có mã request <code>2a80544d…</code>. Đi tìm nó:</p>
<div class="out">${LOG}</div>
<p>Không dòng nào: container API đã trả lỗi bị <em>thay</em> bởi lượt lùi, và với log driver <code>local</code> log của nó đi theo nó. Container CSDL không bị thay, và Postgres đã ghi nguyên nhân thật. Bài học: (1) mọi phản hồi lỗi mang mã request và mọi dòng log cũng vậy (bài 5.3 đã làm), (2) khi điều tra, chụp <code>docker compose logs api &gt; su-co.log</code> <em>trước</em> khi deploy lại, (3) dự án thật đẩy log ra khỏi container (driver journald, hoặc một bộ gom log) — liên kết ở 11.4.</p>
<table>
<tr><th>Triệu chứng</th><th>Nhìn trước tiên</th></tr>
<tr><td>Trang trả 502 / 504</td><td><code>/var/log/nginx/error.log</code> trên VPS (upstream từ chối / quá giờ) ⇒ <code>docker compose ps</code></td></tr>
<tr><td>500 kèm mã request</td><td><code>docker compose logs api | grep &lt;mã&gt;</code> ⇒ <code>logs db</code> cho lỗi SQL</td></tr>
<tr><td>Container khởi động lại liên tục</td><td><code>docker compose ps</code> (mã thoát; 137 = bị giết vì bộ nhớ) ⇒ <code>logs --tail 50 api</code></td></tr>
<tr><td>Lỗi chứng chỉ</td><td><code>/var/log/letsencrypt/letsencrypt.log</code>, <code>openssl x509 -enddate</code></td></tr>
<tr><td>"Hôm qua còn chạy"</td><td><code>~/chiase/lich-su.log</code> — bản nào được deploy lúc nào</td></tr>
</table>

<h3>6. Cú lùi nói dối</h3>
<p>Sếp: "phần tóm tắt trông sai, quay về bản hôm qua đi". <code>deploy.sh --lui</code> chọn SHA tốt gần nhất khác bản đang chạy — R1, từ trước khi có tóm tắt:</p>
<div class="out">${LUI_R1}</div>
<p>Mọi <code>GET</code> đều xanh. <code>POST /api/posts</code> 500: mã của R1 chèn bài không có <code>tom_tat</code>, còn migration của R2 đã bỏ DEFAULT, nên cột là <code>NOT NULL</code> mà chẳng có gì lấp — log CSDL ở trên nói đúng như vậy. Một smoke test toàn <code>GET</code> sẽ tuyên bố cú lùi này thành công và để lại một trang web không nhận nổi một bài viết mới. Script đã quay lại R2.</p>
<p>Mã lùi được; lược đồ thì không (migration không chạy ngược, và không ai muốn <code>DROP COLUMN</code> vội vàng trên production). Lối ra là đi <strong>tiến</strong>: R4 trả lại thứ mã cũ cần.</p>
<pre><code class="language-sql">${MIG_R4}</code></pre>
<div class="out">${R4}</div>
<p>Sau R4, R1 chạy lại được trên lược đồ mới, rồi quay về R4 — cả hai chiều đều xanh. Đó là <strong>mở rộng / thu hẹp</strong> (expand/contract): một bản phát hành chỉ được <em>thêm</em> những thứ bản trước bỏ qua được (cột cho phép null hoặc có DEFAULT, bảng mới, chỉ mục mới dựng CONCURRENTLY); bỏ hoặc siết lại (xoá cột, bỏ DEFAULT, đổi tên, <code>NOT NULL</code> không DEFAULT) phải đợi tới khi không còn bản nào đang chạy hoặc có thể lùi về phụ thuộc vào hình dạng cũ — thường là một bản phát hành sau.</p>

<h3>7. Cái migration dừng giữa chừng</h3>
<p>R5: tên đăng nhập duy nhất lấy từ email. Trên CSDL của lập trình viên mọi email đều khác nhau; trên production có hai người tên "an":</p>
<pre><code class="language-sql">${MIG_R5}</code></pre>
<div class="out">${R5}</div>
<p>Script dừng trước khi tráo: người dùng không bao giờ thấy R5. Nhưng nhìn vào CSDL:</p>
<div class="out">${R5B}</div>
<p>Hai sự thật làm nhiều người bất ngờ: <strong>Prisma không bọc migration trong một giao dịch</strong> — câu 1 (<code>ADD COLUMN</code>) nằm lại, câu 3 hỏng; và migration hỏng được ghi sổ, nên mọi lần deploy sau đều dừng với <code>P3009</code> cho tới khi có người quyết định. Đó là hành vi đúng, và là lý do script in "đừng tự <code>migrate resolve</code>": đánh dấu mà không nhìn là gán cho một lược đồ áp dụng nửa chừng nhãn "đã áp dụng" (sai) hoặc "đã lùi" (chưa đúng, cho tới khi gỡ phần đã chạy).</p>
<p>Quy trình của con người — nhìn, gỡ đúng phần đã chạy, đánh dấu, sửa migration, deploy lại:</p>
<div class="out">${CUU}</div>
<p>Khối cuối là cách sửa thu nhỏ: cùng ba câu lệnh đó bọc trong <code>BEGIN … COMMIT</code> hỏng y hệt, và <em>không còn gì</em> nằm lại — PostgreSQL có DDL trong giao dịch. Migration đã sửa (R6) tự bọc mình và xử lý tên trùng. Và R6 cũng hỏng — lỗi gõ của chính người soạn bài này (dấu nháy rơi mất khi dán vào shell):</p>
<div class="out">${R6_HONG}</div>
<div class="out">${R6_LOI}</div>
<p>Lần này hỏng mà không để lại gì — cột không tồn tại — vì tệp đã được bọc. Thêm một <code>resolve --rolled-back</code>, sửa dấu nháy, R7:</p>
<pre><code class="language-sql">${MIG_R7}</code></pre>
<div class="out">${R7}</div>
<p>(Sửa một migration chỉ được phép vì nó CHƯA từng hoàn tất ở đâu và đã được đánh dấu lùi. Migration đã áp dụng trên bất kỳ CSDL dùng chung nào là bất biến; sửa bằng một migration mới, như R4.)</p>

<h3>8. Bản sao lưu đã từng được phục hồi</h3>
<p><code>deploy.sh</code> dump CSDL trước mỗi migration. Phép đo đầu tiên tìm ra một lỗ:</p>
<div class="out">${UMASK}</div>
<p>Bản dump chứa mọi mã băm mật khẩu và mọi bài viết; chúng được tạo ra với quyền ai trên máy cũng đọc được (<code>-rw-rw-r--</code>). Một dòng, <code>umask 077</code>, và bản dump kế là <code>-rw-------</code>. Rồi đến phần gần như ai cũng bỏ — phục hồi:</p>
<pre><code class="language-bash">${PHUC_HOI_SH}</code></pre>
<div class="out">${PHUC_HOI}</div>
<p>Và một bản sao không sống trên chính cái máy nó bảo vệ (đĩa chết, VPS bị xoá, hay kẻ có khoá deploy đều mang theo luôn bản sao lưu cục bộ):</p>
<div class="out">${SAO_LUU.split('\n\n').slice(-1)[0]}</div>

<h3>🔥 Sự cố — GitLab.com, 31/01/2017</h3>
<p>Một kỹ sư định xoá dữ liệu của bản sao đang chạy chậm và chạy nhầm lệnh trên máy chính; "khoảng 300 GB dữ liệu đã bị xoá" lúc anh dừng được nó. Rồi GitLab phát hiện các bản sao lưu không chạy: <code>pg_dump</code> hằng ngày lên S3 để lại một bucket rỗng (pg_dump 9.2 chạy với PostgreSQL 9.6 — còn thư báo lỗi thì bị từ chối âm thầm), ảnh chụp đĩa không bật cho máy CSDL, nhân bản không đuổi kịp. Họ phục hồi từ một ảnh chụp LVM làm bằng tay sáu giờ trước; GitLab.com sập khoảng 18 giờ và mất dữ liệu của khoảng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới (bản tường trình của chính GitLab). Bài học họ công bố là thứ <code>thu-phuc-hoi.sh</code> viết thành mã: bản sao lưu không phải một tệp đang tồn tại, mà là một lần phục hồi đã làm — theo lịch, có so số đếm, có báo động khi hỏng.</p>

<h3>9. Việc dọn hằng đêm (lời hứa bài 3.2) — và một con bọ đếm</h3>
<p>Refresh token tích lại: mỗi lần đăng nhập và mỗi lần xoay vòng một dòng. Dòng hết hạn vô dụng; dòng đã thu hồi được giữ một tuần để cơ chế phát hiện dùng lại (bài 3.2) còn nhận ra token bị trộm. Một job cron xoá phần còn lại. Bản đầu in ra chuyện vô lý:</p>
<div class="out">${CRON_SAI}</div>
<p>"Xoá 45, còn 62" — rồi lần chạy thứ hai báo còn 17. Trong một câu <code>WITH … DELETE … RETURNING</code>, các truy vấn con khác của CÙNG câu lệnh nhìn thấy ảnh chụp <em>trước</em> khi xoá (tài liệu PostgreSQL). Xoá thì đúng; báo cáo thì nói dối. Sửa bằng cách đếm trong một câu lệnh riêng:</p>
<pre><code class="language-bash">${DON_SH}</code></pre>
<div class="out">${CRON_DUNG}</div>

<h3>10. Kế hoạch rollback, trên một trang</h3>
<table>
<tr><th>Tình huống</th><th>Hành động</th><th>Dữ liệu</th></tr>
<tr><td>Smoke đỏ sau khi tráo</td><td>Tự động: script lùi về SHA trước và chạy lại smoke</td><td>Lược đồ giữ ở bản mới — chỉ an toàn nếu bản đó chỉ "mở rộng"</td></tr>
<tr><td>Phát hiện lỗi sau đó, lược đồ không đổi</td><td><code>./deploy.sh --lui</code> (hoặc <code>./deploy.sh &lt;sha&gt;</code>)</td><td>Không đụng</td></tr>
<tr><td>Phát hiện lỗi sau đó, bản đó đổi lược đồ</td><td>Kiểm mã cũ trên lược đồ mới (lượt ghi của smoke!). Hỏng thì sửa tiến (R4)</td><td>Không bao giờ "migrate down" vội</td></tr>
<tr><td>Migration hỏng (P3018 / P3009)</td><td>Dừng. Xem câu nào đã chạy. Gỡ đúng phần đó, <code>migrate resolve --rolled-back</code>, sửa, deploy lại — con người quyết</td><td>Bản sao lưu ở bước 3 là lưới đỡ</td></tr>
<tr><td>Dữ liệu bị phá</td><td>Phục hồi dump vào một CSDL mới, so sánh, chuyển sang</td><td>Mất = thời gian từ bản dump cuối</td></tr>
</table>
<p>Lịch sử phát hành của chính bài này, như git cho thấy — một lần revert, một lần sửa tiến và hai lần sửa migration là hình dạng của một tuần làm việc thật:</p>
<pre><code>${GIT_LOG}</code></pre>

<h3>🧪 Lab 11.3 — làm hỏng production ba kiểu (có chủ đích)</h3>
<div class="callout ok">
<ol>
<li>Phát hành một bản gỡ mất một tuyến mà smoke test có kiểm. Đo từ máy khác: người dùng nhận 502 trong bao lâu, và tuyến hỏng trả lời sai trong bao lâu.</li>
<li>Phát hành một bản có migration bỏ DEFAULT của một cột <code>NOT NULL</code>, rồi lùi. Làm smoke test bắt được; sửa tiến.</li>
<li>Phát hành một migration hỏng ở câu thứ ba. Cho thấy trạng thái nửa chừng, cứu bằng tay, rồi cho thấy migration đã sửa bọc trong <code>BEGIN/COMMIT</code> hỏng thì không để lại gì.</li>
<li>Phục hồi bản sao lưu mới nhất vào một CSDL tạm và so số dòng với production.</li>
</ol>
<p><strong>Xong khi:</strong> <code>lich-su.log</code> có ít nhất một <code>hong-smoke</code>, một <code>lui-ve</code> và một <code>ok</code> sau chúng, và bạn giải thích được từng dòng.</p>
</div>
<details><summary>Lời giải</summary>
<ol>
<li>Mong đợi ≈ khoảng từ "5/6" tới lúc lùi xong (ở đây ~9 giây 502 mỗi lần tráo + ~20 giây 404). Đo bằng vòng lặp: <code>while :; do date +%T.%N; curl -s -o /dev/null -w '%{http_code}\n' https://…/api/health; sleep 0.2; done</code>.</li>
<li><code>ALTER COLUMN … DROP DEFAULT</code>; lùi ⇒ POST 500 ⇒ smoke đỏ ⇒ script quay lại bản mới. Sửa tiến bằng <code>SET DEFAULT</code>; sau đó lùi xanh.</li>
<li>Như mục 7: <code>\\d bang</code> cho thấy phần thừa; <code>DROP</code> nó; <code>docker compose --profile migrate run --rm migrate npx prisma migrate resolve --rolled-back &lt;tên&gt;</code>; bọc tệp đã sửa trong <code>BEGIN; … COMMIT;</code>.</li>
<li><code>./thu-phuc-hoi.sh</code> — dòng "phục hồi" và "đang chạy" phải khớp (có thể lệch bằng số dòng ghi sau lúc dump; giải thích mọi chênh lệch).</li>
</ol>
</details>

${spring(false, 'Cùng kế hoạch với Flyway: trên PostgreSQL Flyway mặc định chạy mỗi migration trong một giao dịch (nên trạng thái nửa chừng của R5 không xảy ra), ghi lần hỏng vào flyway_schema_history, và "flyway repair" tương đương migrate resolve — cũng là quyết định của con người. Expand/contract và lượt ghi trong smoke test giữ nguyên.', [
  ['sb-17-3-github-actions-spring', 'Spring Boot 17.3 — CI với GitHub Actions'],
  ['sb-18-4-tong-ket', 'Spring Boot 18.4 — Checklist cuối khoá và so sánh Node.js'],
])}

<h3>Tình huống đi làm thật</h3>
<p>Ghi chú phát hành ở công ty thường có một dòng "rollback". Viết nó cho trung thực: "rollback = deploy lại <code>&lt;sha trước&gt;</code>; thay đổi lược đồ chỉ mở rộng (cột mới cho phép null), mã cũ đã được kiểm trên lược đồ mới bằng lượt ghi của smoke". Không viết được câu đó thì bản phát hành chưa sẵn sàng — nói ra lúc review, đừng để phát hiện lúc nửa đêm.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Lùi một lần deploy có migration thế nào?"</strong> — Thường không lùi lược đồ: bản phát hành chỉ mở rộng, nên mã cũ chạy được trên lược đồ mới; không thì sửa tiến.</li>
<li><strong>"Health check xanh mà người dùng kêu. Vì sao?"</strong> — Health check chứng minh "còn sống", không chứng minh tính năng. Smoke test đi qua tuyến thật, kể cả một lượt ghi.</li>
<li><strong>"Migration hỏng giữa chừng trên production, bạn làm gì?"</strong> — Dừng deploy, xem câu nào đã chạy, gỡ đúng phần đó, đánh dấu đã lùi, sửa và deploy lại; không bao giờ tự resolve.</li>
<li><strong>"Sao biết bản sao lưu dùng được?"</strong> — Phục hồi theo lịch vào CSDL tạm, so số dòng, báo động khi hỏng.</li>
</ol>

<div class="kv-grid">
  <div class="kv"><span class="k">smoke test</span><span class="v">Kiểm nhanh đầu-cuối các đường chính ngay sau deploy.</span></div>
  <div class="kv"><span class="k">rollback</span><span class="v">Deploy lại tạo tác tốt gần nhất.</span></div>
  <div class="kv"><span class="k">sửa tiến</span><span class="v">Sửa bằng một bản phát hành mới thay vì quay lui.</span></div>
  <div class="kv"><span class="k">expand/contract</span><span class="v">Thêm trước, bỏ sau một bản, để mã cũ và mới cùng chạy.</span></div>
  <div class="kv"><span class="k">P3018 / P3009</span><span class="v">Prisma: migration hỏng / migration hỏng trước đó chặn cái mới.</span></div>
  <div class="kv"><span class="k">diễn tập phục hồi</span><span class="v">Cố ý phục hồi một bản sao lưu để chứng minh nó dùng được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Deploy = kéo theo SHA, kiểm nhãn, sao lưu, migrate, tráo, smoke; smoke đỏ ⇒ tự lùi + smoke lại.</li>
<li>Smoke phải có lượt ghi: R1 sau R2 xanh mọi GET mà hỏng POST.</li>
<li>Thay đổi lược đồ là cánh cửa một chiều: chỉ mở rộng, sửa tiến.</li>
<li>Migration của Prisma mặc định không nằm trong giao dịch — tự bọc; migration hỏng chặn deploy tới khi con người xử lý.</li>
<li>Bản sao lưu mode 600, ra khỏi máy, và được phục hồi có chủ đích.</li>
</ul>
${NGUON}
${THE}
</div>
`,
};
