# 11.2 — log DNS: query log của router (dnsmasq, cùng định dạng Pi-hole), Windows DNS Client + bộ nhớ đệm, systemd-resolved, ba dấu hiệu lạ.
# Chạy: python3 cong-cu/chay-vm.py dns.bash (sau router.bash: router đã gửi syslog về lab7 /var/log/remote/wrt-nha.log). ~4 phút.
! @wrt reboot
! sleep 50
! @android sudo resolvectl flush-caches
! @host scp -q -F cong-cu/ssh.cfg dns/dns-la.sh android:/home/hv/ && ssh -F cong-cu/ssh.cfg android chmod +x dns-la.sh
@wrt uci set dhcp.@dnsmasq[0].logqueries=1; uci commit dhcp; /etc/init.d/dnsmasq restart >/dev/null 2>&1; uci get dhcp.@dnsmasq[0].logqueries
! sleep 3
! @win Disable-NetAdapterBinding -Name Ethernet -ComponentID ms_tcpip6
! sudo truncate -s 0 /var/log/remote/wrt-nha.log
@android grep -v '^#' /etc/resolv.conf; resolvectl dns ens3
@android dig +short vnexpress.net; dig +short vnexpress.net; dig khong-co-ten-nay.tuoitre.vn | grep -o 'status: [A-Z]*'
@wrt logread -e dnsmasq | grep "192.168.56.142/" | tail -n 9
@win Clear-DnsClientCache; wevtutil sl Microsoft-Windows-DNS-Client/Operational /e:true; wevtutil gl Microsoft-Windows-DNS-Client/Operational | Select-String enabled
@win Resolve-DnsName github.com -Type A | Select-Object Name,Type,TTL,IPAddress | Format-Table -AutoSize
@win Get-WinEvent -LogName Microsoft-Windows-DNS-Client/Operational -MaxEvents 40 | Where-Object { $_.Id -in 3006,3008,3020 -and $_.Message -match 'github' } | Select-Object -First 3 TimeCreated,Id,Message | Format-List
@win ipconfig /displaydns | Select-Object -Skip 3 -First 11
@win Get-DnsClientCache | Select-Object -First 6 Entry,Type,Status,TimeToLive,Data | Format-Table -AutoSize
@wrt logread -e dnsmasq | grep "query\[" | grep "from 192.168.56.177" | awk '{print $11}' | sort | uniq -c | sort -rn | head -n 8
resolvectl dns; resolvectl query example.com
sudo resolvectl statistics | sed -n '1,16p'
sudo resolvectl log-level debug; resolvectl query example.org >/dev/null; sudo resolvectl log-level info; journalctl -u systemd-resolved --since "-1 min" --no-pager -o cat | grep -E "Looking up|Cache miss|Positive cache hit|Transaction .* for <example.org IN A>" | head -n 5
@android cat dns-la.sh | tail -n 5; time ./dns-la.sh
sudo grep -c 'query\[' /var/log/remote/wrt-nha.log; sudo awk '$6 ~ /^query\[/ {print $9}' /var/log/remote/wrt-nha.log | sort | uniq -c | sort -rn
sudo awk '$6 ~ /^query\[/ && $7 ~ /\.test$/ {k = split($7, n, "."); print $9, n[k-1] "." n[k]}' /var/log/remote/wrt-nha.log | sort | uniq -c | sort -rn | head -n 5
sudo grep -c ' is NXDOMAIN' /var/log/remote/wrt-nha.log; sudo grep ' is NXDOMAIN' /var/log/remote/wrt-nha.log | head -n 3
sudo awk '$6 ~ /^query\[/ {split($7, n, "."); m = 0; for (i in n) if (length(n[i]) > m) m = length(n[i]); if (m >= 30) print $6, m, substr($7, 1, 64) "…"}' /var/log/remote/wrt-nha.log
sudo awk '$6 == "query[A]" && $7 == "update.cdn-lab.test" { split(substr($1, 12, 8), t, ":"); s = t[1]*3600 + t[2]*60 + t[3]; if (p) printf "%s  +%ds\n", substr($1, 12, 8), s - p; else print substr($1, 12, 8), " (lần đầu)"; p = s }' /var/log/remote/wrt-nha.log
