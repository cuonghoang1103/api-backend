# wrt-them.sh — phần cấu hình router dùng cho Bài 11.1–11.2 và Lab 11 (chạy sau wrt-dau.sh, qua: ssh -F cong-cu/ssh.cfg wrt 'sh -s' < cong-cu/wrt-them.sh)
# Wi‑Fi: hai "card" mô phỏng mac80211_hwsim — radio0 làm điểm phát "Nha-An" (WPA2), radio1 làm một điện thoại (MAC ngẫu nhiên kiểu riêng tư).
for r in radio0 radio1; do uci set wireless.$r.band=2g; uci set wireless.$r.channel=6; uci set wireless.$r.htmode=HT20; uci set wireless.$r.country=VN; done
uci set wireless.default_radio0.ssid=Nha-An; uci set wireless.default_radio0.encryption=psk2; uci set wireless.default_radio0.key=matkhau-wifi-11; uci set wireless.default_radio0.disabled=0
uci set network.wwan=interface; uci set network.wwan.proto=none
uci set wireless.default_radio1.mode=sta; uci set wireless.default_radio1.network=wwan; uci set wireless.default_radio1.ssid=Nha-An
uci set wireless.default_radio1.encryption=psk2; uci set wireless.default_radio1.key=matkhau-wifi-11; uci set wireless.default_radio1.macaddr=a6:3c:91:7e:22:5b; uci set wireless.default_radio1.disabled=0
# UPnP bật (như nhiều router nhà mạng); WAN của lab là địa chỉ riêng 10.0.2.15 (giống CGNAT) ⇒ cho phép riêng để thấy được ánh xạ cổng
uci set upnpd.config.enabled=1; uci set upnpd.config.log_output=1
uci -q delete upnpd.config.config_file; uci commit upnpd; /etc/init.d/miniupnpd enable; /etc/init.d/miniupnpd restart; sleep 3
grep -v "^ext_ip=" /var/etc/miniupnpd.conf | sed "1i ext_allow_private_ipv4=yes" > /etc/miniupnpd-lab.conf; uci set upnpd.config.config_file=/etc/miniupnpd-lab.conf
# Tường lửa: chặn LAN → Internet cổng 23/2323 (telnet — cổng botnet hay dùng) và GHI LOG
uci show firewall | grep -q Chan-telnet-ra-ngoai || { uci add firewall rule >/dev/null; uci set firewall.@rule[-1].name=Chan-telnet-ra-ngoai; uci set firewall.@rule[-1].src=lan; uci set firewall.@rule[-1].dest=wan; uci set firewall.@rule[-1].proto=tcp; uci set firewall.@rule[-1].dest_port="23 2323"; uci set firewall.@rule[-1].target=REJECT; uci set firewall.@rule[-1].log=1; }
uci commit; /etc/init.d/network reload; wifi; /etc/init.d/miniupnpd restart; fw4 reload >/dev/null 2>&1; echo "wrt-them xong"
# LAN chỉ IPv4 cho bài dễ đọc (mỗi thiết bị một địa chỉ; nhà thật thường có cả IPv6 — một máy hiện dưới nhiều địa chỉ)
uci set dhcp.lan.ra=disabled; uci set dhcp.lan.dhcpv6=disabled; uci -q delete network.globals.ula_prefix; uci -q delete network.lan.ip6assign; uci commit; /etc/init.d/odhcpd restart; /etc/init.d/network reload; echo "chỉ IPv4"
uci set network.wan.peerdns=0; uci -q delete network.wan.dns; uci add_list network.wan.dns=1.1.1.1; uci commit network; /etc/init.d/network reload; echo 'DNS gốc 1.1.1.1'
