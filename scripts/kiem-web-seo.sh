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
# ⚠️ KIỂM BỘ KIỂM TRƯỚC. `curl` của macOS nhiều bản KHÔNG biên dịch kèm
# nghttp2 — nó sẽ không chào h2 trong ALPN, và server dù bật HTTP/2 vẫn trả
# 1.1. Không kiểm chỗ này thì một cái curl thiếu tính năng sẽ báo oan cho
# server, và ta đi sửa nhầm chỗ.
if ! curl -V | grep -qi 'HTTP2'; then
  c_warn "curl này KHÔNG hỗ trợ HTTP/2 (curl -V không có 'HTTP2') — phép đo dưới đây VÔ NGHĨA."
  c_warn "  Kiểm bằng cách khác: mở DevTools → Network → cột Protocol, hoặc"
  c_warn "  brew install curl && \$(brew --prefix curl)/bin/curl -sI --http2 $BASE/"
else
  ver=$(curl -sS -o /dev/null --max-time 15 -w '%{http_version}' "$BASE/" 2>/dev/null)
  case "$ver" in
    2|3)  c_ok  "thương lượng được HTTP/$ver" ;;
    1.1)  c_bad "vẫn HTTP/1.1 — thiếu 'http2 on;' trong nginx.conf, HOẶC config chưa tới được container"
          c_bad "  (bind-mount file đơn gắn theo INODE: thay file bằng mv/rsync thì container vẫn đọc bản cũ)" ;;
    *)    c_bad "không gọi được (http_version='$ver')" ;;
  esac
fi

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

canon_of() { curl -sS --max-time 20 "$1" 2>/dev/null | grep -o '<link rel="canonical"[^>]*>' | grep -o 'href="[^"]*"' | cut -d'"' -f2 | head -1; }

# ⚠️ Phép kiểm ĐÚNG ở đây KHÔNG phải "URL kia có 404 không".
# `/blog/<slug>` được giữ sống CÓ CHỦ Ý: luồng bình luận của nó gắn với
# `Comment.postId` (bảng `posts`), 301 sang tech-trends là bỏ rơi hết bình
# luận cũ. Nên hai URL cùng trả 200 là chấp nhận được — thứ KHÔNG chấp nhận
# được là cả hai cùng tự canonical về chính mình, vì đó mới là cái chia đôi
# tín hiệu xếp hạng. Đo canonical, đừng đo mã trạng thái.
kiem_trung() { # $1=slug  $2=nhãn
  local slug="$1" nhan="$2" mb mt cb
  mb=$(code_of "$BASE/blog/$slug"); mt=$(code_of "$BASE/tech-trends/$slug")
  echo "     $nhan '$slug' → /blog/=$mb  /tech-trends/=$mt"
  if [ "$mb" != "200" ] || [ "$mt" != "200" ]; then
    c_ok "chỉ sống ở một nơi — không có gì để gộp"
    return
  fi
  cb=$(canon_of "$BASE/blog/$slug")
  echo "       canonical của /blog/$slug: ${cb:-(KHÔNG có)}"
  case "$cb" in
    */tech-trends/"$slug") c_ok "trùng nội dung NHƯNG canonical đã gộp về /tech-trends/ — đúng" ;;
    */blog/"$slug")        c_bad "cả hai cùng 200 và /blog/ tự canonical về chính nó — ĐANG chia đôi tín hiệu" ;;
    "")                    c_bad "/blog/$slug không có thẻ canonical nào" ;;
    *)                     c_bad "canonical trỏ đi đâu đó lạ: $cb" ;;
  esac
}

[ -n "$tt_slug" ] && kiem_trung "$tt_slug" "slug tech-trends" || c_warn "không lấy được slug tech-trends nào để thử"
[ -n "$bl_slug" ] && kiem_trung "$bl_slug" "slug blog"        || c_warn "không lấy được slug blog nào để thử"

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
# 7.6k URL ~ vài MB và route là force-dynamic, 60s từng là quá chật.
sm=$(curl -sS --max-time 180 "$BASE/sitemap.xml" 2>/dev/null)
tot=$(printf '%s' "$sm" | grep -c '<loc>')
cl=$(printf '%s' "$sm" | grep -c '<loc>[^<]*/code-lab/')
echo "     tổng URL: $tot   (trong đó /code-lab/: $cl)"
[ "$tot" -gt 1000 ] && c_ok "sitemap đã mang nội dung Code Lab" \
                    || c_bad "chỉ $tot URL — phần nội dung lớn nhất vẫn chưa được nộp"
# Bắt rộng tay (chỉ cần thấy chữ "playground" ở bất kỳ đâu) rồi IN RA thứ tìm
# được. Lần chạy 25/08 báo "vắng mặt" trong khi `sitemap.ts` rõ ràng có dòng đó
# — nên nghi ngờ chính phép so khớp trước, và cách duy nhất để biết là nhìn
# xem sitemap thật sự chứa gì.
pg=$(printf '%s' "$sm" | grep -i 'playground' | head -3)
if [ -n "$pg" ]; then
  c_ok "/playground có trong sitemap"
  printf '%s\n' "$pg" | sed 's/^/         /'
else
  c_bad "không thấy chữ 'playground' nào trong sitemap"
  echo "     5 URL không-code-lab đầu tiên (để đối chiếu dạng thẻ):"
  printf '%s' "$sm" | grep '<loc>' | grep -v '/code-lab/' | head -5 | sed 's/^/         /'
  echo "     dung lượng tải về: $(printf '%s' "$sm" | wc -c | tr -d ' ') byte"
fi

echo
echo "═══ $PASS đạt · $FAIL hỏng · $WARN cảnh báo ═══"
[ "$FAIL" -eq 0 ]
