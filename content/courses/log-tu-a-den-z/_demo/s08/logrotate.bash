grep -vE '^#|^$' /etc/logrotate.conf
cat /etc/logrotate.d/rsyslog
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y nginx 2>&1 | grep -E '^Setting up nginx '; cat /etc/logrotate.d/nginx
systemctl list-timers logrotate.timer --no-pager | head -2; systemctl cat logrotate.timer | grep -E '^On|^Accuracy|^Randomized|^Persistent'; systemctl cat logrotate.service | grep -E '^ExecStart|^Nice|^IOSched'
sudo install -d -o hv -g adm -m 0750 /var/log/shopapp && cat s08/shop-create.conf
sudo cp s08/shop-create.conf /etc/logrotate.d/shop && sudo logrotate -d /etc/logrotate.d/shop 2>&1 | grep -vE '^$|^Handling 1 logs|reading config|Allocating|Ignoring|acquired lock'
setsid nohup python3 s08/ghi.py /var/log/shopapp/app.log 2000 8 >/dev/null 2>&1 < /dev/null & sleep 3; sudo logrotate -v -f /etc/logrotate.d/shop 2>&1 | grep -E 'rotating|renaming|creating|log does not need'; ls -l /proc/$(pgrep -f '^python3 .*ghi.py')/fd | grep shopapp
sleep 7; ls -l /var/log/shopapp/; python3 s08/dem.py /var/log/shopapp/app.log.tong /var/log/shopapp/app.log /var/log/shopapp/app.log.1
sudo rm -f /var/log/shopapp/* && cat s08/shop-hup.conf | grep -A3 postrotate
sudo cp s08/shop-hup.conf /etc/logrotate.d/shop; setsid nohup python3 s08/ghi.py /var/log/shopapp/app.log 2000 8 >/dev/null 2>&1 < /dev/null & sleep 3; sudo logrotate -f /etc/logrotate.d/shop; sleep 7; ls -l /var/log/shopapp/; python3 s08/dem.py /var/log/shopapp/app.log.tong /var/log/shopapp/app.log /var/log/shopapp/app.log.1
sudo rm -f /var/log/shopapp/* && sudo cp s08/shop-copy.conf /etc/logrotate.d/shop; setsid nohup python3 s08/ghi.py /var/log/shopapp/app.log 200000 8 >/dev/null 2>&1 < /dev/null & sleep 3; sudo logrotate -f /etc/logrotate.d/shop; sleep 7; ls -l /var/log/shopapp/; python3 s08/dem.py /var/log/shopapp/app.log.tong /var/log/shopapp/app.log /var/log/shopapp/app.log.1
sudo rm -f /var/log/shopapp/* && sudo chmod 0770 /var/log/shopapp && echo x > /var/log/shopapp/app.log && sudo logrotate -f /etc/logrotate.d/shop; echo "exit=$?"
cat s08/shop-day-du.conf
sudo cp s08/shop-day-du.conf /etc/logrotate.d/shop && sudo logrotate -d /etc/logrotate.d/shop 2>&1 | grep -iE 'error|insecure|switching|rotating pattern'
setsid nohup python3 s08/ghi.py /var/log/shopapp/app.log 2000 12 >/dev/null 2>&1 < /dev/null & for i in 1 2 3; do sleep 3; sudo logrotate -f /etc/logrotate.d/shop; done; sleep 4; ls -l /var/log/shopapp/
sudo grep shopapp /var/lib/logrotate/status
sudo logrotate -d /etc/logrotate.conf 2>&1 | grep -A2 '/var/log/shopapp/\*.log' | head -4
setsid nohup python3 s08/ghi.py /var/log/shopapp/app.log 200000 20 >/dev/null 2>&1 < /dev/null & sleep 4; rm /var/log/shopapp/app.log; sleep 2; df -m /var/log | tail -1; ls -l /proc/$(pgrep -f '^python3 .*ghi.py')/fd | grep deleted; sudo find /proc/[0-9]*/fd -lname '*(deleted)' 2>/dev/null | grep -v -e '/proc/self' | head -3
sleep 4; df -m /var/log | tail -1; sudo kill -HUP $(pgrep -f '^python3 .*ghi.py'); sleep 1; df -m /var/log | tail -1; pkill -f '^python3 .*ghi.py'; sleep 1; df -m /var/log | tail -1
