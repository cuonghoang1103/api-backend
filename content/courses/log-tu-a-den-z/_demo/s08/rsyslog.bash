grep -vE '^#|^$' /etc/rsyslog.conf
systemd-analyze cat-config systemd/journald.conf | grep -E '^# /|^ForwardToSyslog'
ls -l /dev/log /run/systemd/journal/syslog
cat s08/30-shop.conf
sudo cp s08/30-shop.conf /etc/rsyslog.d/ && sudo rsyslogd -N1 && sudo systemctl restart rsyslog
for m in debug info notice warning err crit; do logger -p local3.$m -t shop "thu muc $m"; done; sleep 1
sudo cat /var/log/shop/shop.log
sudo cat /var/log/shop/canh-bao.log
sudo head -2 /var/log/shop/shop.json; sudo jq -r 'select(.severity=="err") | "\(.time) \(.msg)"' /var/log/shop/shop.json
sudo grep -c 'thu muc' /var/log/syslog
logger -p local3.info -t 'shop[4242]' "dat hang #1001 thanh cong"; sleep 1; sudo tail -1 /var/log/shop/shop.json
sudo timeout 8 tcpdump -i ens3 -nn -A -c 1 'udp port 514' 2>/dev/null & sleep 2; logger --server 10.0.2.2 --udp -p local3.err -t shop "reset mat khau cho an@vd.vn token=GIA_TOKEN·VIDU_9f3c"; wait $!
@logsrv cat /var/log/remote/lab7/shop.log
python3 s08/bom.py udp 200000
python3 s08/bom.py tcp 200000
@logsrv sleep 5; for p in udp tcp; do f=/var/log/remote/lab7/bom-$p.log; echo "$p: nhận $(wc -l < $f) / 200000 dòng, số lớn nhất $(grep -o 'so [0-9]*' $f | cut -d' ' -f2 | sort -n | tail -1)"; done
cat s08/90-gui-udp.conf
sudo cp s08/90-gui-udp.conf /etc/rsyslog.d/90-gui-di.conf && sudo systemctl restart rsyslog; sleep 1; logger -p local3.err -t shop "qua rsyslog: local3"; logger -p user.err -t shop "qua rsyslog: user"; sleep 2
@logsrv grep 'qua rsyslog' /var/log/remote/lab7/shop.log
ls /etc/rsyslog.d/
sudo mv /etc/rsyslog.d/90-gui-di.conf /etc/rsyslog.d/20-gui-di.conf && sudo systemctl restart rsyslog; sleep 1; logger -p local3.err -t shop "qua rsyslog lan 2: local3"; sleep 2
@logsrv grep 'qua rsyslog' /var/log/remote/lab7/shop.log
sudo timeout 8 tcpdump -i ens3 -nn -A -c 1 'udp port 514' 2>/dev/null | tail -1 & sleep 2; logger -p local3.err -t shop "dinh dang khi rsyslog chuyen di"; wait $!
@logsrv kill -STOP $(pgrep -x rsyslogd); echo "máy chủ log TẠM DỪNG (đơ, không đọc socket)"
python3 s08/bom.py udp 200000; sleep 1
@logsrv kill -CONT $(pgrep -x rsyslogd); sleep 4; f=/var/log/remote/lab7/bom-udp.log; echo "udp khi máy nhận đơ: nhận $(( $(wc -l < $f) - 200000 )) / 200000 dòng"
@logsrv kill -STOP $(pgrep -x rsyslogd); setsid sh -c 'sleep 5; kill -CONT $(pgrep -x rsyslogd)' >/dev/null 2>&1 < /dev/null & echo "máy chủ log TẠM DỪNG 5 giây"
python3 s08/bom.py tcp 200000
@logsrv sleep 4; f=/var/log/remote/lab7/bom-tcp.log; echo "tcp khi máy nhận đơ: nhận $(( $(wc -l < $f) - 200000 )) / 200000 dòng"
cat s08/90-gui-tcp.conf
sudo cp s08/90-gui-tcp.conf /etc/rsyslog.d/20-gui-di.conf && sudo rsyslogd -N1 2>&1 | tail -1 && sudo systemctl restart rsyslog; sleep 2; logger -t shop "kiem tra tcp"
@logsrv kill $(cat /run/rsyslogd.pid); sleep 2; pgrep -x rsyslogd || echo "máy chủ log ĐÃ TẮT"
for i in 1 2 3; do logger -p local3.warning -t shop "don hang loi so $i luc may chu log tat"; sleep 1; done; sleep 6
sudo journalctl -u rsyslog --since '-30s' -q --no-pager -o cat | grep -E 'suspended|closed connection' | cut -c1-120
@logsrv rsyslogd -i /run/rsyslogd.pid; sleep 15; grep -c 'luc may chu log tat' /var/log/remote/lab7/shop.log; grep -o 'so [0-9] luc may chu log tat' /var/log/remote/lab7/shop.log
cat s08/90-gui-relp.conf
sudo cp s08/90-gui-relp.conf /etc/rsyslog.d/20-gui-di.conf && sudo rsyslogd -N1 2>&1 | tail -1 && sudo systemctl restart rsyslog; sleep 2; logger -t shop "kiem tra relp"
@logsrv kill $(cat /run/rsyslogd.pid); sleep 2; pgrep -x rsyslogd || echo "máy chủ log ĐÃ TẮT"
for i in 4 5 6; do logger -p local3.warning -t shop "don hang loi so $i luc may chu log tat"; sleep 1; done; sleep 6
sudo ls -l /var/spool/rsyslog/
@logsrv rsyslogd -i /run/rsyslogd.pid; sleep 15; grep -o 'so [0-9] luc may chu log tat' /var/log/remote/lab7/shop.log
cat s08/90-gui-tls.conf
sudo cp s08/90-gui-tls.conf /etc/rsyslog.d/20-gui-di.conf && sudo rsyslogd -N1 2>&1 | tail -1 && sudo systemctl restart rsyslog; sleep 3
sudo journalctl -u rsyslog --since '-10s' -q --no-pager -o cat | grep -m2 -E 'error|Permission'
sudo journalctl -k --since '-15s' -q --no-pager -o cat | grep -m1 'apparmor="DENIED"'
echo '/etc/rsyslog-tls/** r,' | sudo tee -a /etc/apparmor.d/local/usr.sbin.rsyslogd && sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.rsyslogd && sudo systemctl restart rsyslog; sleep 3; sudo journalctl -u rsyslog --since '-5s' -q --no-pager -o cat | grep -c -i error
sudo rm -f /tmp/tls.pcap; sudo timeout 10 tcpdump -U -i ens3 -nn 'tcp port 6514' -w /tmp/tls.pcap 2>/dev/null & sleep 2; logger -p local3.err -t shop "reset mat khau cho binh@vd.vn token=GIA_TOKEN·VIDU_77aa"; wait $!; echo "gói bắt được: $(sudo tcpdump -nn -r /tmp/tls.pcap 2>/dev/null | wc -l), chứa token rõ chữ: $(sudo tcpdump -nn -A -r /tmp/tls.pcap 2>/dev/null | grep -c GIA_TOKEN·VIDU)"
@logsrv sleep 2; grep binh@ /var/log/remote/lab7/shop.log
sudo sed -i 's/PermittedPeers="logsrv.lab"/PermittedPeers="logsrv.that"/' /etc/rsyslog.d/20-gui-di.conf && sudo systemctl restart rsyslog; sleep 3; logger -t shop "thu ten sai"; sleep 6; sudo journalctl -u rsyslog --since '-12s' -q --no-pager -o cat | grep -m2 -iE 'not permitted|peer|certificate|name'
sudo sed -i 's/PermittedPeers="logsrv.that"/PermittedPeers="logsrv.lab"/' /etc/rsyslog.d/20-gui-di.conf && sudo systemctl restart rsyslog; sleep 8; logger -t shop "ten dung lai"
@host docker run --rm rockylinux:9 bash -c 'dnf -q -y install rsyslog >/dev/null 2>&1; grep -E "^module|^#### MODULES" /etc/rsyslog.conf; ls -l /dev/log 2>&1 | head -1'
