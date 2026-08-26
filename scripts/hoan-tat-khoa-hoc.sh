#!/usr/bin/env bash
# hoan-tat-khoa-hoc.sh — chạy nốt mọi thứ còn thiếu của đợt khoá học, MỘT LẦN.
# ─────────────────────────────────────────────────────────────────────────────
# CHẠY TRÊN MÁY MAC. Nó cần ba thứ mà máy dựng khoá (sandbox cloud) không có:
#   • ra được youtube.com  → điền credit thật, phát hiện link chết
#   • khoá ssh vào VPS     → sinh ảnh bìa trong container backend
#   • khoá ssh vào máy nhà → deploy-nha.sh
#
# Nó KHÔNG tự push lên GitHub. Chỉ commit tại chỗ; deploy-nha.sh ở bước cuối
# vẫn hỏi duyệt qua Telegram rồi mới push — giữ nguyên chỗ người đồng ý.
#
#   bash scripts/hoan-tat-khoa-hoc.sh                  # chạy đủ
#   bash scripts/hoan-tat-khoa-hoc.sh --khong-deploy   # làm mọi thứ, trừ deploy
set -uo pipefail

VPS="root@160.187.1.208"
KHONG_DEPLOY=false
[ "${1:-}" = "--khong-deploy" ] && KHONG_DEPLOY=true

b()  { echo; echo "══════ $* ══════"; }
ok() { echo "  ✅ $*"; }
no() { echo "  ❌ $*"; }

[ -f deploy-nha.sh ] && [ -d content/course-videos ] || {
  no "Phải chạy từ thư mục gốc của repo api-backend."; exit 1; }

# ── 1. Điền credit thật từ YouTube ───────────────────────────────────────────
# verify thoát 1 khi có link chết — đó là thông tin, không phải lỗi, nên || true.
b "1/5 · Điền credit từ YouTube (link chết sẽ hiện ✗)"
for f in content/course-videos/*.mjs; do
  node scripts/verify-youtube-videos.mjs --file "$f" --fix-credits || true
done

# ── 2. Gỡ những entry credit VẪN rỗng = link chết ────────────────────────────
# --fix-credits chỉ bỏ qua entry DEAD, nên "còn rỗng sau bước 1" == chết.
# Gỡ ra để chốt credit của course-video-seed cho ~780 bài còn lại đi qua;
# audit ở bước 3 sẽ liệt kê đúng những bài vừa mất video để vá sau.
#
# ⛔ CHỐT NGƯỠNG 20%. Trước khi vá, thử thật trên bản sao: lúc credit còn
# rỗng toàn bộ (đúng trạng thái của main hôm nay), khối này gỡ SẠCH 804/804
# entry — tức là bước 1 mà hỏng vì bất cứ lý do gì (mất mạng, sai thư mục,
# oEmbed đổi) thì nó xoá trắng cả tính năng video mà không ai kịp thấy.
# Thực tế chỉ ~24/804 link chết (3%), nên >20% nghĩa là bước 1 KHÔNG chạy
# được — dừng hẳn, KHÔNG ghi file nào.
b "2/5 · Gỡ link chết ra khỏi bản đồ"
node - <<'NODE' || { echo; no "Bước 2 dừng — chưa ghi file nào. Xem lý do ở trên."; exit 1; }
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const dir = 'content/course-videos';
const NGUONG = 0.20;

// Lượt 1 — chỉ ĐẾM, chưa ghi gì.
const soan = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
  const p = path.join(dir, f);
  const giu = [], bo = [];
  for (const ln of readFileSync(p, 'utf8').split('\n')) {
    if (/yt:\s*['"]/.test(ln) && /credit:\s*(''|"")/.test(ln)) {
      bo.push((ln.trim().match(/^['"]([^'"]+)['"]/) || [, '?'])[1]);
      continue;
    }
    giu.push(ln);
  }
  const tongEntry = bo.length + giu.filter((l) => /yt:\s*['"]/.test(l)).length;
  soan.push({ f, p, giu, bo, tongEntry });
}

const bad = soan.filter((s) => s.tongEntry > 0 && s.bo.length / s.tongEntry > NGUONG);
if (bad.length) {
  console.error(`\n  ⛔ DỪNG: ${bad.length} bản đồ có tỉ lệ credit rỗng > ${NGUONG * 100}%.`);
  for (const s of bad) {
    console.error(`     ${s.f}: ${s.bo.length}/${s.tongEntry} rỗng`);
  }
  console.error('\n  Nghĩa là bước 1 (--fix-credits) KHÔNG chạy được, chứ không phải link chết');
  console.error('  nhiều đến thế. Kiểm mạng ra youtube.com rồi chạy lại. Không file nào bị đổi.');
  process.exit(1);
}

// Lượt 2 — giờ mới ghi.
let tong = 0;
for (const s of soan) {
  if (!s.bo.length) continue;
  writeFileSync(s.p, s.giu.join('\n'));
  console.log(`  ${s.f}: gỡ ${s.bo.length}/${s.tongEntry} → ${s.bo.join(', ')}`);
  tong += s.bo.length;
}
console.log(`  Tổng gỡ: ${tong} link chết`);
NODE

# ── 3. Kiểm ngoại tuyến + commit ─────────────────────────────────────────────
b "3/5 · Kiểm bản đồ rồi commit"
node scripts/course-video-audit.mjs --all || true
if [ -n "$(git status --porcelain content/course-videos)" ]; then
  git add content/course-videos
  git commit -q -m "videos: điền credit thật từ YouTube, gỡ link chết" && ok "đã commit"
else
  ok "không có gì đổi — bỏ qua commit"
fi

# ── 4. Ảnh bìa: dò CDN rồi CHỈ sinh cái nào thiếu ────────────────────────────
# course-cover.mjs cần sharp + R2_*, nên PHẢI chạy trong container backend trên
# VPS. Nó đẩy lên key images/course-covers/<slug>.png — đúng chỗ thumbnailUrl
# của mọi khoá trỏ tới (cả 19 khoá dùng chung một mẫu URL), nên sinh xong là
# thẻ hết vỡ ảnh.
#
# Dò trước bằng curl thay vì sinh mù cả 19: khoá cũ (nodejs, nextjs…) đã có ảnh
# do chính script này làm, sinh đè lại chỉ tốn thời gian và có rủi ro ghi hỏng
# thứ đang chạy tốt. 200 = giữ nguyên, còn lại = sinh.
#
# Mọi mã logo dưới đây đã đối chiếu với bộ dữ liệu simple-icons (3.453 icon):
# cả 19 đều có thật, nên không cái nào chết ở bước tải logo. Riêng nextdotjs
# (#000000) và socketdotio (#010101) bị ép sang FFFFFF — hex thật của hãng là
# màu đen, vẽ lên nền gradient tối thì mất tiêu.
b "4/5 · Ảnh bìa — dò CDN rồi chỉ sinh cái thiếu"
CDN="https://media.cuongthai.com/images/course-covers"
CO=0; MOI=0; HONG=0
bia() {  # slug icon color title subtitle
  local ma
  ma=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$CDN/$1.png" 2>/dev/null)
  if [ "$ma" = "200" ]; then ok "$1 — đã có, giữ nguyên"; CO=$((CO + 1)); return; fi
  if ssh -o ConnectTimeout=15 "$VPS" \
      "docker exec cuonghoangdev_backend node scripts/course-cover.mjs \
       --slug $1 --icon $2 --color $3 --title \"$4\" --subtitle \"$5\"" >/dev/null 2>&1; then
    ok "$1 — vừa sinh"; MOI=$((MOI + 1))
  else
    no "$1 — sinh HỎNG, chạy lại bằng tay"; HONG=$((HONG + 1))
  fi
}
bia nodejs         nodedotjs      5FA04E "Node.js"        "Zero → Production"
bia nextjs         nextdotjs      FFFFFF "Next.js"        "React → Production"
bia typescript     typescript     3178C6 "TypeScript"     "JavaScript → TypeScript"
bia postgresql     postgresql     4169E1 "PostgreSQL"     "SQL → Production"
bia web-foundations html5         E34F26 "Web Foundations" "HTML → Full-stack"
bia object-storage cloudflare     F38020 "Object Storage" "Upload → CDN"
bia media-processing ffmpeg       007808 "Media Processing" "Ảnh · Video → Web"
bia socket-io      socketdotio    FFFFFF "Socket.IO"      "Realtime → Production"
bia tailwind-css   tailwindcss    06B6D4 "Tailwind CSS"   "Utility → Design system"
bia git            git            F05032 "Git & GitHub"   "Zero → Production"
bia linux-bash     linux          FCC624 "Linux & Bash"   "Terminal → Server"
bia docker         docker         2496ED "Docker"         "Container → Production"
bia redis          redis          DC382D "Redis"          "Cache → Production"
bia prisma-orm     prisma         2D3748 "Prisma ORM"     "Schema → Production"
bia authentication openid         F78C40 "Authentication" "Login → Production"
bia nginx          nginx          009639 "Nginx"          "Request → Production"
bia deploy-vps     ubuntu         E95420 "Deploy lên VPS" "Máy bạn → Production"
bia github-actions githubactions  2088FF "GitHub Actions" "Push → Production"
bia observability-monitoring grafana F46800 "Observability & Monitoring" "Log → Metric → Trace"
echo "  ── $CO đã có · $MOI vừa sinh · $HONG hỏng ──"

# ── 5. Deploy ────────────────────────────────────────────────────────────────
# Deploy chạy lại toàn bộ seed (Step 3.12b khoá + 3.12c video). Lần này chốt
# credit cho qua, nên video mới thực sự gắn vào lesson_details.
b "5/5 · Deploy"
if [ "$KHONG_DEPLOY" = true ]; then
  ok "bỏ qua theo --khong-deploy. Chạy tay: bash deploy-nha.sh"
else
  echo y | bash deploy-nha.sh
fi

b "XONG"
echo "  Kiểm lại trên web: thẻ khoá đã có ảnh chưa · bài học đã có video chưa."
echo "  Bài nào mất video là do link chết — danh sách in ở bước 3."
