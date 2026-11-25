# 11.1 — log của router + Wi-Fi: logread, DHCP, hostapd, đăng nhập trang quản trị, UPnP, gửi syslog về máy Linux, mất log khi khởi động lại.
# Chạy: python3 cong-cu/chay-vm.py router.bash (cần cong-cu/may.bash bat; router đã qua wrt-dau.sh + cấu hình Wi-Fi/UPnP/tường lửa của wrt-them.sh)
! @host scp -q -F cong-cu/ssh.cfg router/10-nhan-router.conf lab7:/tmp/ && ssh -F cong-cu/ssh.cfg lab7 "sudo cp /tmp/10-nhan-router.conf /etc/rsyslog.d/ && sudo rm -rf /var/log/remote"
! @wrt uci delete system.@system[0].log_ip; uci commit system; reboot
! sleep 45
@wrt grep DESCRIPTION /etc/openwrt_release; uptime
@wrt logread | wc -l; logread | head -n 3
! @win ipconfig /renew | Out-Null
! @android sudo networkctl reconfigure ens3; sleep 6
@wrt logread -e dnsmasq-dhcp | tail -n 4
@wrt cat /tmp/dhcp.leases
@wrt awk '{ print strftime("%Y-%m-%d %H:%M:%S", $1), $2, $3, $4 }' /tmp/dhcp.leases
@wrt ip neigh show dev br-lan | grep -v FAILED
@wrt logread -e hostapd | tail -n 4
@wrt iw dev phy0-ap0 station dump | grep -E "^Station|connected time|signal:"
! @wrt uci set wireless.default_radio1.key=doan-sai-mat-khau; uci commit wireless; wifi reload; sleep 15
@wrt logread -e hostapd | tail -n 6
! @wrt uci set wireless.default_radio1.disabled=1; uci commit wireless; wifi reload; sleep 3
@keodo for p in admin 123456 password; do curl -s -o /dev/null -w "%{http_code} " -d "luci_username=root&luci_password=$p" http://192.168.56.1/cgi-bin/luci/; done; echo
@keodo sshpass -p admin ssh -o StrictHostKeyChecking=no -o PreferredAuthentications=password root@192.168.56.1 true; echo "mã thoát $?"
@wrt logread | grep -E "luci: failed|Bad password|Pubkey auth|Password auth succeeded" | tail -n 6
@android upnpc -u http://192.168.56.1:5000/rootDesc.xml -e game -a 192.168.56.142 2323 2323 TCP | tail -n 1
@android upnpc -u http://192.168.56.1:5000/rootDesc.xml -e x -a 192.168.56.142 22 22 TCP | tail -n 1
@wrt logread -e miniupnpd | grep -E "AddPortMapping|redirecting|not permitted|denied|returned" | tail -n 4
@wrt cat /var/run/miniupnpd.leases; nft list chain inet fw4 upnp_prerouting | grep dport
cat /etc/rsyslog.d/10-nhan-router.conf
sudo systemctl restart rsyslog && ss -ulnp | grep ':514 '
@wrt uci set system.@system[0].log_ip=192.168.56.10; uci set system.@system[0].log_proto=udp; uci commit system; reload_config; sleep 6; logger -t thu-gui "xin chào từ router"
! sleep 2
sudo ls -l /var/log/remote/; sudo tail -n 2 /var/log/remote/wrt-nha.log
@wrt logread | wc -l; reboot
! sleep 50
@wrt uptime; logread | wc -l; logread | grep -c "xin chào từ router"
sudo grep -c "xin chào từ router" /var/log/remote/wrt-nha.log; sudo grep -n -E "xin chào|shutdown|Logread connected" /var/log/remote/wrt-nha.log | cut -c1-150
