# Lab 8 — ĐÁP ÁN bước 6: ngăn chặn (khoá tài khoản, giết phiên, giữ khoá lạ làm bằng chứng). ĐÃ CHẠY một lần — chạy lại sẽ khác vì tệp đã chuyển.
sudo usermod -L -e 1 test && sudo pkill -KILL -u test; sudo mv /home/test/.ssh/authorized_keys /root/bang-chung-authorized_keys-test; sudo chage -l test | grep -E 'Account expires'; sudo passwd -S test
sudo grep -E 'usermod|lock' /var/log/auth.log | tail -2 | cut -c1-150
