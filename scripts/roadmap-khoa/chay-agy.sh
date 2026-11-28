#!/bin/bash
# Roadmap sơ đồ đầu khoá — BƯỚC 2: cho Antigravity (Gemini, gói Google Ultra — không tốn hạn mức Claude) soạn 4 ý mỗi bài.
#
#   bash scripts/roadmap-khoa/chay-agy.sh <thư mục khoá do chuan-bi.mjs tạo> [<thư mục khoá> …]
#
# Mỗi chương c<NN>/ chạy một lượt agy trong CHÍNH thư mục đó (agy đọc chuong.md, ghi kq.json). Chương đã có kq.json
# hợp lệ thì bỏ qua (chạy lại được bất cứ lúc nào). Hết hạn mức (429 RESOURCE_EXHAUSTED) KHÔNG phải chương hỏng ⇒ chờ
# tới giờ hồi rồi soạn lại đúng chương đó. Dừng êm: touch <thư mục khoá>/../dung. Song song: SONG_SONG=3 (mặc định 2).
# ⚠️ 28/11/2026: hạn mức TUẦN nhóm Gemini dùng CHUNG với dây chuyền soạn video (ưu tiên cao hơn). Một chương ≈ 60k token;
#    lượt đầu (45 chương) đã góp phần làm cạn hạn mức tuần ⇒ chỉ chạy khi người điều phối cho phép, và chạy ít khoá một lúc.
set -u
BRIEF="$(cd "$(dirname "$0")" && pwd)/BRIEF.md"
KIEM="$(cd "$(dirname "$0")" && pwd)/kiem-kq.mjs"
AGY=${AGY:-$HOME/.local/bin/agy}
SONG_SONG=${SONG_SONG:-2}

lam_chuong() {
  local d="$1" log="$2"
  local ten; ten="$(basename "$(dirname "$d")")/$(basename "$d")"
  [ -f "$(dirname "$(dirname "$d")")/dung" ] && return 0
  node "$KIEM" "$d" >/dev/null 2>&1 && return 0
  for lan in 1 2 3; do
    echo "$(date '+%d/%m %H:%M') ▶ $ten (lượt $lan)" >> "$log"
    ( cd "$d" && rm -f kq.json && "$AGY" -p "$(cat "$BRIEF")" --model gemini-4-neon-high --sandbox --dangerously-skip-permissions \
        --print-timeout 1800s --output-format json > agy.json 2> agy.err )
    if grep -q "RESOURCE_EXHAUSTED" "$d/agy.err" "$d/agy.json" 2>/dev/null; then
      local cho
      cho=$(grep -o "Resets in [0-9hms]*" "$d/agy.err" "$d/agy.json" 2>/dev/null | head -1 | sed 's/.*in //' \
        | awk '{h=0;m=0;if(match($0,/[0-9]+h/))h=substr($0,RSTART,RLENGTH-1);if(match($0,/[0-9]+m/))m=substr($0,RSTART,RLENGTH-1);print h*3600+m*60+240}')
      [ -z "$cho" ] && cho=1800
      echo "$(date '+%d/%m %H:%M') ⏸ $ten hết hạn mức — chờ ${cho}s" >> "$log"
      sleep "$cho"; continue
    fi
    if node "$KIEM" "$d" >> "$log" 2>&1; then echo "$(date '+%d/%m %H:%M') ■ $ten ok" >> "$log"; return 0; fi
    echo "$(date '+%d/%m %H:%M') ✗ $ten kq.json hỏng/thiếu slug — soạn lại" >> "$log"
  done
  echo "$(date '+%d/%m %H:%M') ■ $ten LỖI sau 3 lượt" >> "$log"
}
export -f lam_chuong; export BRIEF KIEM AGY

for khoa in "$@"; do
  khoa="$(cd "$khoa" && pwd)"; log="$khoa/chay.log"
  ls -d "$khoa"/c[0-9]* | xargs -P "$SONG_SONG" -I{} bash -c 'lam_chuong "$1" "$2"' _ {} "$log"
  echo "$(date '+%d/%m %H:%M') HẾT $(basename "$khoa")" >> "$log"
done
