# 11.4 — log tường lửa Linux: ufw trên lab7 (bị keodo quét), các mức log, dòng [UFW BLOCK]/[UFW ALLOW]/[UFW LIMIT BLOCK], giới hạn tốc độ ghi log;
# nftables "log prefix … limit" và iptables -j LOG trên keodo. Chạy: python3 cong-cu/chay-vm.py ufw.bash (lab7 đã cài ufw, nginx).
! sudo ufw --force reset >/dev/null; sudo rm -f /var/log/ufw.log*; sudo systemctl restart rsyslog
! @keodo sudo nft flush ruleset; sudo iptables -F 2>/dev/null; true
sudo ufw default deny incoming; sudo ufw allow 22/tcp; sudo ufw allow from 192.168.56.1 to any port 514 proto udp; sudo ufw limit 80/tcp
sudo ufw --force enable; sudo ufw status verbose
@keodo sudo nmap -sS -Pn -n --top-ports 25 192.168.56.10 | grep -E "open|scanned"
sudo ls -l /var/log/ufw.log; sudo tail -n 2 /var/log/ufw.log
sudo journalctl -k -g "UFW BLOCK" --since "-2 min" --no-pager -o short-iso | tail -n 1; sudo grep -c "UFW BLOCK" /var/log/kern.log /var/log/syslog /var/log/ufw.log
sudo grep "UFW BLOCK" /var/log/ufw.log | grep -o 'SRC=[^ ]*' | sort | uniq -c
sudo grep "UFW BLOCK" /var/log/ufw.log | grep -oE 'DPT=[0-9]+' | sort -t= -k2 -n | uniq | tr '\n' ' '; echo
sudo iptables -S ufw-logging-deny; sudo iptables -S ufw-after-logging-input
! sudo truncate -s 0 /var/log/ufw.log
@keodo sudo nmap -sS -Pn -n -p 1-1000 192.168.56.10 | grep -E "open|scanned"
sudo grep -c "UFW BLOCK" /var/log/ufw.log; sudo dmesg | grep -m1 -o "ufw.*callbacks suppressed" || echo "(không có dòng suppressed)"
@android for i in $(seq 1 10); do curl -s -o /dev/null -m 2 -w "%{http_code} " http://192.168.56.10/; done; echo
sudo grep -E "UFW (LIMIT BLOCK|ALLOW)" /var/log/ufw.log | tail -n 2; sudo grep -c "UFW LIMIT BLOCK" /var/log/ufw.log
sudo ufw logging medium; sudo truncate -s 0 /var/log/ufw.log
@android curl -s -o /dev/null -w "%{http_code}\n" http://192.168.56.10/
sudo grep -o "\[UFW [A-Z ]*\].*DPT=80 " /var/log/ufw.log | head -n 2
sudo ufw logging low
@keodo sudo nft add table inet lab; sudo nft add chain inet lab vao '{ type filter hook input priority 0; policy accept; }'; sudo nft add rule inet lab vao tcp dport 23 limit rate 5/minute log prefix \"lab-telnet: \" level info; sudo nft add rule inet lab vao tcp dport 23 drop; sudo nft list chain inet lab vao
@android for i in $(seq 1 12); do nc -z -w1 192.168.56.66 23; done; echo "đã thử 12 lần"
@keodo sudo journalctl -k -g "lab-telnet" --since "-1 min" --no-pager -o short-iso | tail -n 2; sudo journalctl -k -g "lab-telnet" --since "-1 min" --no-pager | grep -c lab-telnet; sudo nft list chain inet lab vao | grep -E "limit|drop"
@keodo sudo nft delete table inet lab; sudo iptables -A INPUT -p tcp --dport 2323 -m limit --limit 3/min --limit-burst 3 -j LOG --log-prefix "lab-2323: " --log-level 6; sudo iptables -A INPUT -p tcp --dport 2323 -j DROP; sudo iptables -L INPUT -n -v --line-numbers
@android for i in $(seq 1 8); do nc -z -w1 192.168.56.66 2323; done; echo "đã thử 8 lần"
@keodo sudo journalctl -k -g "lab-2323" --since "-1 min" --no-pager | grep -c lab-2323; sudo iptables -L INPUT -n -v | grep -E "LOG|DROP"
! @keodo sudo iptables -F INPUT
