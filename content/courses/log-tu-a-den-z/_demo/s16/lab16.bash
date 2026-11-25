# Lab 16 — tiếp quản một máy chủ có 7 lỗi vận hành log: kiểm → sửa → kiểm lại (máy may16: cong-cu/may.bash len; BASH_ENV=cong-cu/env.bash)
may 'bash /lab/lab16/pha-lab16.sh'
may 'bash /lab/lab16/kiem-lab16.sh'
may 'ls -l /var/log/shop/ /tmp/sao-luu-log.tar.gz; grep -c . /var/log/shop/app.log; grep -o "token=[^ ]*" /var/log/nginx/access.log | head -1'
may 'bash /lab/lab16/sua-lab16.sh'
may 'bash /lab/lab16/kiem-lab16.sh'
may 'grep -E "password|Stripe" /var/log/shop/app.log; tail -1 /var/log/nginx/access.log | cut -c1-90; ls /var/log/journal/*/ | head -2'
