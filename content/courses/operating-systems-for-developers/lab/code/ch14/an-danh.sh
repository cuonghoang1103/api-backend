#!/bin/bash
# an-danh.sh — lọc output đo trên máy Mac THẬT trước khi đưa vào bài: thay tên người dùng, tên máy, thư mục nhà và
# thư mục làm việc tạm bằng giá trị chung (dev, mac, /Users/dev, ~/ch14-demo). Số đo, lệnh và thứ tự dòng giữ NGUYÊN.
#   bash phien-host.sh c141-mac.sh 2>&1 | bash an-danh.sh > ../../out/c141-mac.out.txt
export U=$(id -un) H=$(hostname -s) W="${CH14_WORK:-/nonexistent}"
perl -pe 's#\Q$ENV{W}\E#~/ch14-demo#g; s#/private/tmp/claude-\d+/\S*?/scratchpad\S*#~/ch14-demo#g; s#\Q$ENV{HOME}\E#/Users/dev#g;
          s#/var/folders/\S+?/T/#\$TMPDIR/#g; s#\b\Q$ENV{H}\E\b#mac#g; s#\b\Q$ENV{U}\E\b#dev#g'
