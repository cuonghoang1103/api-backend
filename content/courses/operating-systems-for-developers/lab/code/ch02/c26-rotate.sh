# @ chạy trong container systemd của bài 2.6 (os-c26, ảnh os-lab-sd): docker exec -w /lab/ch02 os-c26 bash -c "phien c26-rotate.sh 2>&1"
mkdir -p /var/log/ctw; python3 ghi-mai.py /var/log/ctw/app.log & P=$!; sleep 2
ls -l /var/log/ctw
cp logrotate/ctw-create /etc/logrotate.d/ctw; cat /etc/logrotate.d/ctw
logrotate -f /etc/logrotate.d/ctw; sleep 2; ls -l /var/log/ctw
ls -l /proc/$P/fd | grep ctw
@ kill $P; wait $P 2> /dev/null; rm -rf /var/log/ctw; mkdir -p /var/log/ctw
python3 ghi-mai.py /var/log/ctw/app.log & Q=$!; sleep 2
cp logrotate/ctw-copytruncate /etc/logrotate.d/ctw; logrotate -f /etc/logrotate.d/ctw; sleep 2; ls -l /var/log/ctw
tail -1 /var/log/ctw/app.log; zcat /var/log/ctw/app.log.1.gz | tail -1
systemctl list-timers logrotate.timer --no-pager | head -2
@ kill $Q; wait $Q 2> /dev/null; rm -rf /var/log/ctw /etc/logrotate.d/ctw
