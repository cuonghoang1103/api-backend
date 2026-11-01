# Ch3 · 3.5 — tên miền hết hạn = nhà đăng ký gỡ ủy quyền ⇒ TLD trả NXDOMAIN (oldshop.test từng là một tên miền thật trong lab)
dig +trace +nodnssec www.oldshop.test | grep -E 'NXDOMAIN|^test\.|Received|SOA'
dig www.oldshop.test | grep -E 'status'
