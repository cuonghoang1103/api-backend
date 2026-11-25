#!/bin/zsh
# chay-s06.zsh — chạy mọi lệnh mẫu Chương 6 (macOS) TRÊN MÁY MAC THẬT, ghi "$ lệnh" + output đã ẩn danh vào <tên>.out.txt.
# Đuôi .zsh (không phải .sh) để scripts/log-khoa/chay-demo.sh — chạy trong container Linux — KHÔNG đụng tới.
#   zsh content/courses/log-tu-a-den-z/_demo/s06/chay-s06.zsh [thư-mục-làm-việc] [tệp.zsh …]
# Mỗi dòng lệnh chạy bằng `zsh -c` sau `disable log` (giống Terminal tương tác: /etc/zshrc tắt lệnh dựng sẵn log).
# Không cần sudo, không đổi cấu hình máy; tạo log thử (subsystem com.example.*) và hai báo cáo crash của chính motep.
emulate -L zsh
DEMO=${0:A:h}
export LAB=${1:-${TMPDIR:-/tmp}/loglab}; shift 2>/dev/null
mkdir -p $LAB && cp $DEMO/app/*.swift $DEMO/*.plist $LAB/
export TEN_MAY=$(scutil --get LocalHostName) TEN_HIEN=$(scutil --get ComputerName)
tep=(${@:-$DEMO/luu.zsh $DEMO/muc.zsh $DEMO/ung-dung.zsh $DEMO/crash.zsh $DEMO/varlog.zsh $DEMO/show.zsh $DEMO/predicate.zsh $DEMO/bao-mat.zsh $DEMO/lab6.zsh $DEMO/thong-ke.zsh})
for f in $tep; do
  ra=${f:r}.out.txt; : >| $ra
  while IFS= read -r c; do
    [[ -z ${c// } || $c == \#* ]] && continue
    print -r -- "\$ $c" >> $ra
    ( cd $LAB && zsh -c "disable log 2>/dev/null; $c" ) 2>&1 | perl $DEMO/app/an-danh.pl >> $ra
  done < $f
  print "  ✓ ${f:t} → ${ra:t}"
done
# Chốt: không còn dấu vết thật nào trong output
for f in $tep; do
  grep -n -i -E "${TEN_MAY}|$(whoami)[^a-z]|/Users/$(whoami)" ${f:r}.out.txt | grep -v -E 'root +admin|admin +[0-9]|\(admin\)' && print "⚠️  CÒN DẤU VẾT THẬT trong ${f:t}"
done
true
