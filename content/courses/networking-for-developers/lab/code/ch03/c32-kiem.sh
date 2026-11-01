# Ch3 · 3.2 — named-checkzone kiểm một tệp vùng TRƯỚC khi nạp: tệp đúng, rồi ba lỗi kinh điển
named-checkzone labflow.test /dnsz/src/labflow.test.zone
# 1) CNAME ở đỉnh (apex) tên miền — muốn trỏ labflow.test sang tên của CDN
sed 's/^@              IN A    203.0.113.10/@              IN CNAME labflow.cdn.test./' /dnsz/src/labflow.test.zone > /tmp/apex.zone
named-checkzone labflow.test /tmp/apex.zone
# 2) CNAME đứng chung với bản ghi khác ở cùng một tên
printf 'api            IN CNAME labflow.test.\n' | cat /dnsz/src/labflow.test.zone - > /tmp/chung.zone
named-checkzone labflow.test /tmp/chung.zone
# 3) MX trỏ thẳng vào một địa chỉ IP thay vì một tên
sed 's/^@              IN MX   10 mail/@              IN MX   10 203.0.113.25./' /dnsz/src/labflow.test.zone > /tmp/mx.zone
named-checkzone labflow.test /tmp/mx.zone
# 4) quên DẤU CHẤM CUỐI: tên không có dấu chấm cuối là tên TƯƠNG ĐỐI ⇒ bị ghép thêm tên miền
sed 's/^@              IN MX   10 mail$/@              IN MX   10 mail.labflow.test/' /dnsz/src/labflow.test.zone > /tmp/cham.zone
named-checkzone labflow.test /tmp/cham.zone
