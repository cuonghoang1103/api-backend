# 9.4 — Firefox: MOZ_LOG ghi log mạng nội bộ (giống about:logging). Firefox chụp xong vẫn treo trong headless ⇒ timeout cắt, log đã ghi đủ. Lần đầu tạo hồ sơ Firefox có khi treo trước khi tải trang (0 dòng mat-tich) ⇒ chạy lại lệnh.
MOZ_LOG='timestamp,nsHostResolver:5,nsHttp:3' MOZ_LOG_FILE=$PWD/ff.log timeout 90 firefox --headless --no-remote --profile "$PWD/ffp" --screenshot "$PWD/ff.png" http://mat-tich.lgz.test/ > /dev/null 2>&1; ls ff.log* | head -n 3; wc -l < ff.log.moz_log
grep -h 'mat-tich' ff.log.moz_log | grep -E 'uri=|failure|status 8' | head -n 4 | cut -c1-176
