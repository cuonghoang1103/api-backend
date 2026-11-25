# Lời giải 🧪 Bài 11.4 (chạy thật trên lab7/keodo)
cat /etc/rsyslog.d/20-ufw.conf | grep -v '^#'
! sleep 200
@keodo sudo nmap -sS -Pn -n --top-ports 100 192.168.56.10 | grep -E "scanned"
sudo grep -c "UFW BLOCK" /var/log/ufw.log
@keodo sudo nmap -sS -Pn -n --top-ports 100 192.168.56.10 | grep -E "scanned"
sudo grep -c "UFW BLOCK" /var/log/ufw.log
sudo awk '/UFW BLOCK/ {for (i = 1; i <= NF; i++) {if ($i ~ /^SRC=/) s = $i; if ($i ~ /^DPT=/) d = $i} print s, d}' /var/log/ufw.log | sort -u | awk '{print $1}' | uniq -c | sort -rn | head -n 3
@keodo sudo nft add table inet lab; sudo nft add chain inet lab vao '{ type filter hook input priority 0; policy accept; }'; sudo nft add rule inet lab vao tcp dport 22 ct state new limit rate 10/minute log prefix \"ssh-moi: \" accept; sudo nft list chain inet lab vao | grep ssh-moi
@android timeout 5 bash -c 'echo > /dev/tcp/192.168.56.66/22' && echo "kết nối 22 được"
@keodo sudo journalctl -k -g ssh-moi --since "-1 min" --no-pager -o cat | cut -c1-110; sudo nft delete table inet lab
