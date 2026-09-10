#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# ship-847.sh — dựng lại rồi ĐẨY bài giảng LAB211 (module 847) lên production.
#
# Chạy ở MÁY NHÀ (cần ssh tới VPS). Một lệnh, thay cho chuỗi bốn lệnh chép tay
# trong README — và chép tay chính là chỗ đã sinh ra ba cái bẫy dưới đây.
#
#   bash docs/codelab-authoring/lab211/ship-847.sh
#   bash docs/codelab-authoring/lab211/ship-847.sh --khong-day   # dựng + kiểm, KHÔNG đẩy
#
# ⚠️ BẪY 1 — ĐỪNG dùng `ship-lessons.sh` cho bài này. Danh sách trắng của nó là
#    heading/prose/code/mermaid/links/image, mà bài này có `part` ×15 và
#    `practice` ×13 ⇒ nó in "SKIP (bad block types part,practice)" rồi bỏ qua,
#    và vẫn kết thúc bằng exit 0. Backend thì NHẬN cả hai loại (xem `DocBlock`
#    trong `snippets.aiDoc.service.ts`) — cái chặn nằm ở script, không ở server.
#
# ⚠️ BẪY 2 — `blocks.json` nằm trong `.gitignore`, nên deploy KHÔNG mang nó đi.
#    Deploy xanh mà không chạy bước này thì bài giảng trên web vẫn là bản cũ.
#    Vì thế script luôn DỰNG LẠI trước khi đẩy, không tin bản có sẵn trên đĩa.
#
# ⚠️ BẪY 3 — `normalizeBlock` LẶNG LẼ bỏ khối nó không hiểu rồi vẫn báo thành
#    công. Nên sau khi ghi, script đối chiếu số khối SERVER TRẢ VỀ với số khối
#    ĐÃ GỬI; lệch một khối là dừng và báo đỏ. Đây là phần đáng giá nhất của
#    script — phần chép tay không bao giờ làm.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

MODULE=847
VPS="${VPS_SSH:-root@cuongthai.com}"
CT="${CT_BACKEND:-cuonghoangdev_backend}"
KHO="$(cd "$(dirname "$0")" && pwd)"
LES="$KHO/lesson"
KHONG_DAY=0
[ "${1:-}" = "--khong-day" ] && KHONG_DAY=1

for b in python3 node javac; do
  command -v "$b" >/dev/null || { echo "thiếu $b"; exit 1; }
done

echo "── 1/4 · dựng lại blocks.json ──────────────────────────────"
( cd "$LES" && python3 main.py )

echo
echo "── 2/4 · biên dịch VÀ CHẠY mọi đoạn Java ───────────────────"
# Thoát khác 0 nếu có đoạn không biên dịch được hoặc chạy ra khác thứ bài viết.
# Bài giảng dạy sai còn tệ hơn bài giảng cũ, nên đây là cửa chặn thật.
( cd "$LES" && python3 verify_java.py java.json )

echo
echo "── 3/4 · đóng gói batch.json ───────────────────────────────"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
GUI=$(MODULE="$MODULE" OUT="$TMP/batch.json" node -e '
  const fs = require("fs");
  const blocks = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
  if (!Array.isArray(blocks) || !blocks.length) { console.error("blocks.json rỗng"); process.exit(1); }
  fs.writeFileSync(process.env.OUT,
    JSON.stringify([{ moduleId: Number(process.env.MODULE), blocks }]));
  console.log(blocks.length);
' "$LES/blocks.json")
echo "  $GUI khối · $(wc -c < "$TMP/batch.json") byte"

if [ "$KHONG_DAY" = 1 ]; then
  echo
  echo "── --khong-day: dừng ở đây, KHÔNG đẩy gì lên production ────"
  exit 0
fi

echo
echo "── 4/4 · ghi vào module $MODULE trên production ────────────"
scp -q "$TMP/batch.json" "$VPS:/tmp/lesson-batch.json"
KQ=$(ssh "$VPS" "docker cp /tmp/lesson-batch.json $CT:/tmp/lesson-batch.json >/dev/null \
  && docker exec -i $CT sh -c 'cat /tmp/lesson-batch.json | node scripts/codelab-lesson-write.mjs'")
echo "$KQ"

# ── chốt cuối: server nhận đủ số khối đã gửi chưa? ──
NHAN=$(printf '%s\n' "$KQ" | sed -n "s/^ok  module $MODULE → \([0-9]\+\) blocks$/\1/p" | head -1)
if [ -z "$NHAN" ]; then
  echo; echo "❌ không đọc được dòng 'ok  module $MODULE → N blocks' — coi như CHƯA ghi được."
  exit 1
fi
if [ "$NHAN" != "$GUI" ]; then
  echo; echo "❌ gửi $GUI khối, server chỉ giữ $NHAN — normalizeBlock đã bỏ $(( GUI - NHAN )) khối."
  echo "   Đừng tin dòng 'ok' phía trên. Xem loại khối nào mới trong blocks.json."
  exit 1
fi
echo
echo "✅ module $MODULE: $NHAN/$GUI khối, không khối nào bị bỏ."
