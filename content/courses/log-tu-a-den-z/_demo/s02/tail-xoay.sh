# tail -f bám theo TỆP ĐANG MỞ (inode) — tệp bị logrotate đổi tên thì nó đứng im
printf 'dong-1\n' > /tmp/a.log; (sleep 1; echo dong-2 >> /tmp/a.log; mv /tmp/a.log /tmp/a.log.1; echo dong-3-tep-moi > /tmp/a.log) & timeout 4 tail -f /tmp/a.log; true
# tail -F bám theo TÊN tệp — thấy tệp mới và đọc tiếp
printf 'dong-1\n' > /tmp/b.log; (sleep 1; echo dong-2 >> /tmp/b.log; mv /tmp/b.log /tmp/b.log.1; echo dong-3-tep-moi > /tmp/b.log) & timeout 4 tail -F /tmp/b.log; true
