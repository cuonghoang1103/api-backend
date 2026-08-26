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

# ⚠️ DEPLOY PHẢI ĐI TRƯỚC ẢNH BÌA. Bước 5 gọi scripts/course-cover-upload.mjs
# và đọc 19 PNG ở scripts/covers/ — cả script lẫn thư mục ảnh chỉ vào được
# container qua một lần deploy. Đảo thứ tự là chạy vào khoảng không.
# ── 4. Deploy ────────────────────────────────────────────────────────────────
# Deploy chạy lại toàn bộ seed (Step 3.12b khoá + 3.12c video). Lần này chốt
# credit cho qua, nên video mới thực sự gắn vào lesson_details.
b "4/5 · Deploy"
if [ "$KHONG_DEPLOY" = true ]; then
  ok "bỏ qua theo --khong-deploy. Chạy tay: bash deploy-nha.sh"
  no "Lưu ý: bước 5 sẽ hỏng nếu container chưa có scripts/course-cover-upload.mjs"
  no "và scripts/covers/ — hai thứ đó chỉ vào ảnh sau một lần deploy."
else
  echo y | bash deploy-nha.sh
fi

# ── 5. Ảnh bìa: đẩy PNG DỰNG SẴN lên R2 ──────────────────────────────────────
# Trước đây bước này gọi course-cover.mjs 19 lần trong container, mà mỗi lần
# nó làm ba việc: kéo logo từ cdn.simpleicons.org → vẽ SVG bằng sharp (cần font
# DejaVu Sans) → đẩy R2. Ba chỗ chết, và nó đã chết câm nhiều lần: script chạy
# đủ, deploy xanh, smoke-test sạch, mà redis.png vẫn 404. Ảnh bìa của
# postgresql/typescript/nextjs làm được là vì HỒI ĐÓ container còn ra được CDN.
#
# Giờ ảnh dựng sẵn ở scripts/covers/ (bằng course-cover-offline.mjs, cùng bố
# cục), container chỉ còn mỗi việc PUT lên R2. Không mạng ngoài, không sharp,
# không font, không SVG — chỉ còn đúng một thứ có thể hỏng, và nó in tên biến
# môi trường thiếu thay vì ném lỗi SDK khó đọc.
b "5/5 · Ảnh bìa — đẩy 19 PNG dựng sẵn lên R2"
if out=$(ssh -o ConnectTimeout=15 "$VPS" \
    "docker exec cuonghoangdev_backend node scripts/course-cover-upload.mjs" 2>&1); then
  printf '%s\n' "$out" | sed 's/^/  /'
  ok "đẩy xong"
else
  no "đẩy HỎNG:"
  printf '%s\n' "$out" | sed 's/^/       /'
fi

b "XONG"
echo "  Kiểm lại trên web: thẻ khoá đã có ảnh chưa · bài học đã có video chưa."
echo "  Bài nào mất video là do link chết — danh sách in ở bước 3."
