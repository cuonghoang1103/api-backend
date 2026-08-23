#!/usr/bin/env bash
# ============================================================
# Kiểm nhanh 6 điểm hiệu năng/SEO trên PRODUCTION
#
#   bash scripts/kiem-web-seo.sh                  # cuongthai.com
#   bash scripts/kiem-web-seo.sh https://...      # host khác
#
# Vì sao là script chứ không phải một dòng trong tài liệu: cả sáu mục dưới
# đây đều là thứ ĐỌC MÃ KHÔNG RA. Config nginx đúng nhưng chưa `reload` thì
# vẫn HTTP/1.1; `next.config.js` khai cache 7 ngày nhưng nginx ghi đè thành
# `no-store` thì vẫn tải lại mỗi lần. Chỉ có gọi thật mới biết.
#
# Script CHỈ ĐỌC: toàn GET/HEAD, không sửa gì.
# ============================================================
set -uo pipefail

BASE="${1:-https://cuongthai.com}"
PASS=0; FAIL=0; WARN=0

c_ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; PASS=$((PASS+1)); }
c_bad()  { printf '  \033[31m✗\033[0m %s\n' "$1"; FAIL=$((FAIL+1)); }
c_warn() { printf '  \033[33m!\033[0m %s\n' "$1"; WARN=$((WARN+1)); }
head_of() { curl -sS -I --max-time 15 "$1" 2>/dev/null; }

echo "═══ Kiểm $BASE ═══"

# ── 1. HTTP/2 ────────────────────────────────────────────────
echo
echo "1) HTTP/2"
ver=$(curl -sS -o /dev/null --max-time 15 -w '%{http_version}' "$BASE/" 2>/dev/null)
case "$ver" in
  2|3)  c_ok  "thương lượng được HTTP/$ver" ;;
  1.1)  c_bad "vẫn HTTP/1.1 — thiếu 'http2 on;' trong nginx.conf, HOẶC đã sửa mà chưa 'nginx -s reload'" ;;
  *)    c_bad "không gọi được (http_version='$ver')" ;;
esac

# ── 2. Bài viết ở hai URL? ───────────────────────────────────
# Lấy slug THẬT từ chính API, rồi thử slug đó ở CẢ HAI đường. Đây là phép
# kiểm cho câu "mọi bài tồn tại ở 2 URL": nếu một slug tech-trends mà
# /blog/<slug> cũng trả 200 thì đúng là trùng, và ngược lại.
echo
echo "2) Một slug có sống ở cả /blog/ lẫn /tech-trends/ không?"
tt_slug=$(curl -sS --max-time 15 "$BASE/api/v1/tech-trends/articles?size=1" 2>/dev/null \
          | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
bl_slug=$(curl -sS --max-time 15 "$BASE/api/v1/blog/posts?size=1" 2>/dev/null \
          | grep -o '"slug":"[^"]*"' | head -1 | cut -d'"' -f4)
code_of() { curl -sS -o /dev/null --max-time 15 -w '%{http_code}' "$1" 2>/dev/null; }

if [ -n "$tt_slug" ]; then
  a=$(code_of "$BASE/tech-trends/$tt_slug"); b=$(code_of "$BASE/blog/$tt_slug")
  echo "     slug tech-trends '$tt_slug' → /tech-trends/=$a  /blog/=$b"
  [ "$b" = "404" ] && c_ok "/blog/<slug tech-trends> trả 404 (không trùng)" \
                   || c_bad "/blog/<slug tech-trends> trả $b — ĐANG trùng URL"
else
  c_warn "không lấy được slug tech-trends nào để thử"
fi
if [ -n "$bl_slug" ]; then
  a=$(code_of "$BASE/blog/$bl_slug"); b=$(code_of "$BASE/tech-trends/$bl_slug")
  echo "     slug blog '$bl_slug' → /blog/=$a  /tech-trends/=$b"
  [ "$b" = "404" ] && c_ok "/tech-trends/<slug blog> trả 404 (không trùng)" \
                   || c_bad "/tech-trends/<slug blog> trả $b — ĐANG trùng URL"
  canon=$(curl -sS --max-time 15 "$BASE/blog/$bl_slug" 2>/dev/null \
          | grep -o '<link rel="canonical"[^>]*>' | head -1)
  echo "     canonical của /blog/$bl_slug: ${canon:-(không có)}"
else
  c_warn "không lấy được slug blog nào để thử"
fi

# ── 3. Trang chủ có tải emoji-mart / lottie không? ────────────
echo
echo "3) Gói JS thừa trên trang chủ"
html=$(curl -sS --max-time 25 "$BASE/" 2>/dev/null)
chunks=$(printf '%s' "$html" | grep -o '/_next/static/chunks/[A-Za-z0-9._-]*\.js' | sort -u)
n=$(printf '%s\n' "$chunks" | grep -c . )
echo "     $n chunk trong HTML trang chủ"
total=0
for c in $chunks; do
  sz=$(curl -sS -o /dev/null --max-time 15 -w '%{size_download}' -H 'Accept-Encoding: gzip' "$BASE$c" 2>/dev/null)
  total=$((total + ${sz:-0}))
  body=$(curl -sS --max-time 15 "$BASE$c" 2>/dev/null | head -c 400)
  case "$body" in
    *'"emojis":["grinning"'*) c_bad "$c mang BỘ DỮ LIỆU EMOJI (~466KB) — trang chủ không có bảng emoji nào" ;;
  esac
done
echo "     tổng JS (đã nén) tham chiếu trực tiếp trong HTML: $((total/1024)) KB"

# ── 4. Nút 3D có phải liên kết thật? ─────────────────────────
echo
echo "4) CTA sân chơi 3D"
printf '%s' "$html" | grep -q 'href="/playground"' \
  && c_ok 'trang chủ có <a href="/playground"> — Googlebot bò tới được' \
  || c_bad 'không thấy href="/playground" trong HTML trang chủ (vẫn là <button>?)'
pg=$(code_of "$BASE/playground")
[ "$pg" = "200" ] && c_ok "/playground trả 200" || c_warn "/playground trả $pg"

# ── 5. Cache của public/ ─────────────────────────────────────
echo
echo "5) Cache-Control cho tài sản tĩnh"
for u in /logos/react.svg /animations/robot.json /favicon.png /mascots/bip.png; do
  cc=$(head_of "$BASE$u" | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-)
  printf '     %-24s %s\n' "$u" "${cc:-(không có)}"
  case "$cc" in
    *no-store*|"") c_bad "$u vẫn no-store — tải lại mỗi lần điều hướng" ;;
    *max-age=0*)   c_bad "$u max-age=0" ;;
    *)             c_ok  "$u đã được cache" ;;
  esac
done
# Hai cái này PHẢI không cache — kiểm ngược để chắc quy tắc mới không quét nhầm.
for u in /sw.js /sitemap.xml; do
  cc=$(head_of "$BASE$u" | grep -i '^cache-control:' | tr -d '\r' | cut -d' ' -f2-)
  printf '     %-24s %s\n' "$u (phải KHÔNG cache)" "${cc:-(không có)}"
  case "$cc" in
    *no-store*|*no-cache*|*max-age=0*) c_ok "$u không bị cache — đúng" ;;
    *) c_bad "$u ĐANG bị cache ('$cc') — bản cập nhật sẽ không tới được người dùng" ;;
  esac
done

# ── 6. Sitemap ───────────────────────────────────────────────
echo
echo "6) Sitemap"
sm=$(curl -sS --max-time 60 "$BASE/sitemap.xml" 2>/dev/null)
tot=$(printf '%s' "$sm" | grep -c '<loc>')
cl=$(printf '%s' "$sm" | grep -c '<loc>[^<]*/code-lab/')
echo "     tổng URL: $tot   (trong đó /code-lab/: $cl)"
[ "$tot" -gt 1000 ] && c_ok "sitemap đã mang nội dung Code Lab" \
                    || c_bad "chỉ $tot URL — phần nội dung lớn nhất vẫn chưa được nộp"
printf '%s' "$sm" | grep -q '<loc>[^<]*/playground</loc>' \
  && c_ok "/playground có trong sitemap" || c_bad "/playground vắng mặt trong sitemap"

echo
echo "═══ $PASS đạt · $FAIL hỏng · $WARN cảnh báo ═══"
[ "$FAIL" -eq 0 ]
