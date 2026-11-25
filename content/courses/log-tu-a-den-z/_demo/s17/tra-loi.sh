# 17.1 — trả lời câu phỏng vấn bằng lệnh thật trên gói log mẫu (cwd = thư mục gói log). Chạy: scripts/log-khoa/chay-demo.sh
# Câu 1: "người dùng báo web lỗi, bạn làm gì?" — bước 1: lỗi bắt đầu lúc nào, bao nhiêu?
awk '$9 >= 500 {print substr($4, 14, 2) "h"}' web/access.log | sort | uniq -c
awk '$9 >= 500 {print substr($4, 14, 4) "x", $9}' web/access.log | sort | uniq -c
# bước 2: lỗi ở đâu (mọi đường hay một đường)?
awk '$9 >= 500 {split($7, p, "?"); print p[1]}' web/access.log | sort | uniq -c | sort -rn | head -5
# bước 3: nhảy sang log ứng dụng đúng khung giờ — ứng dụng nói gì?
jq -r 'select(.level >= 50) | .err.message' app/app.jsonl | sort | uniq -c
jq -r 'select(.level >= 50) | .time / 1000 | floor | strflocaltime("%H:%M:%S")' app/app.jsonl | sed -n '1p;$p'
# bước 4: một request cụ thể, theo reqId
jq -c 'select(.reqId == "req-00387") | {reqId, msg, url: .req.url, code: .err.code}' app/app.jsonl
# Câu 2: "ai đã vào máy chủ này?"
grep 'Accepted' linux/auth.log
grep 'Failed password' linux/auth.log | grep -oE 'from [0-9.]+' | sort | uniq -c | sort -rn | head -3
awk '/Failed password/ {for (i = 1; i <= NF; i++) if ($i == "from") sai[$(i+1)]++} /Accepted/ {for (i = 1; i <= NF; i++) if ($i == "from") print $(i+1), "vào được, trước đó sai", sai[$(i+1)] + 0, "lần"}' linux/auth.log
