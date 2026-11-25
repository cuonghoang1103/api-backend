# 11.6 — log VPN: WireGuard (wg show, latest handshake, dynamic debug), OpenVPN (journal + status file, chứng chỉ đã thu hồi), Windows RasClient.
# Chạy: python3 cong-cu/chay-vm.py vpn.bash (sau vpn/chuan-bi-vpn.sh + vpn/wg-tao.sh trên lab7 và chép cấu hình sang android/keodo — xem chay-s11.bash).
! sudo wg-quick down wg0 >/dev/null 2>&1; sudo systemctl stop openvpn-server@lab; echo 'module wireguard -p' | sudo tee /sys/kernel/debug/dynamic_debug/control >/dev/null; true
! @android sudo wg-quick down wg0 >/dev/null 2>&1; sudo pkill -x openvpn; true
! @keodo sudo wg-quick down wg0 >/dev/null 2>&1; sudo pkill -x openvpn; sudo rm -f /tmp/ovpn.log; true
! @android sudo rm -f /tmp/ovpn.log
sudo sed 's/^PrivateKey = .*/PrivateKey = (đã che — bí mật, không bao giờ dán vào log hay ticket)/' /etc/wireguard/wg0.conf
sudo wg-quick up wg0; sudo wg show wg0
@android sudo wg-quick up wg0 >/dev/null 2>&1; ping -c 2 -W 2 10.66.0.1 | tail -n 2
sudo wg show wg0
sudo wg show wg0 latest-handshakes | while read -r k t; do echo "$(echo "$k" | cut -c1-10)…  $(date -d @"$t" '+%F %T')"; done; sudo wg show wg0 dump | tail -n 1 | cut -f3-7
sudo journalctl -k --since "-3 min" --no-pager -o cat | grep -i wireguard || echo "(nhân không ghi dòng nào về WireGuard)"
echo 'module wireguard +p' | sudo tee /sys/kernel/debug/dynamic_debug/control
@keodo sudo wg-quick up wg0 >/dev/null 2>&1; ping -c 2 -W 2 10.66.0.1 | tail -n 2
@android sudo wg-quick down wg0 >/dev/null 2>&1; sudo wg-quick up wg0 >/dev/null 2>&1; ping -c 1 -W 2 10.66.0.1 | tail -n 1
sudo dmesg -T | grep "wireguard: wg0" | tail -n 8 | cut -c1-150
echo 'module wireguard -p' | sudo tee /sys/kernel/debug/dynamic_debug/control >/dev/null; sudo wg show wg0 | grep -E "^peer|endpoint|latest handshake"
! @android sudo wg-quick down wg0 >/dev/null 2>&1
! @keodo sudo wg-quick down wg0 >/dev/null 2>&1
! sleep 40
sudo wg show wg0 | grep -E "endpoint|latest handshake|transfer"
sudo grep -vE '^(ca|cert|key)|^#' /etc/openvpn/server/lab.conf | tr '\n' ' '; echo; sudo systemctl start openvpn-server@lab; sleep 2; systemctl is-active openvpn-server@lab
@android sudo openvpn --config lab.ovpn --daemon --log /tmp/ovpn.log; sleep 6; sudo grep -E "Peer Connection Initiated|Initialization Sequence Completed" /tmp/ovpn.log | cut -c21-
@keodo sudo timeout 20 openvpn --config lab.ovpn --connect-retry-max 1 --log /tmp/ovpn.log; sudo grep -E "TLS Error|TLS handshake|SIGTERM|SIGUSR1" /tmp/ovpn.log | head -n 3 | cut -c21-
sudo journalctl -u openvpn-server@lab --since "-2 min" --no-pager -o short-iso | grep -E "Peer Connection Initiated|pool returned|VERIFY|CRL|TLS Error|TLS handshake failed" | sed -E 's/^(\S+) \S+ \S+ /\1 /' | cut -c1-200
sudo cat /run/openvpn-server/status-lab.log
@android sudo pkill -x openvpn; sleep 3; echo "android ngắt OpenVPN"
sudo journalctl -u openvpn-server@lab --since "-1 min" --no-pager -o short-iso | grep -iE "exit|SIGTERM" | sed -E 's/^(\S+) \S+ \S+ /\1 /' | cut -c1-200 | tail -n 2; sudo grep -c CLIENT_LIST /run/openvpn-server/status-lab.log
@win Add-VpnConnection -Name 'VPN-Cong-Ty' -ServerAddress 192.168.56.10 -TunnelType Sstp -AuthenticationMethod MSChapv2 -EncryptionLevel Required -Force -PassThru | Select-Object Name,ServerAddress,TunnelType
@win rasdial 'VPN-Cong-Ty' an MatKhauGia-11; "rasdial thoát với mã $LASTEXITCODE"
@win Get-WinEvent -FilterHashtable @{LogName='Application'; ProviderName='RasClient'} -MaxEvents 3 | Sort-Object TimeCreated | Select-Object TimeCreated,Id,@{n='Message';e={($_.Message -replace '\s+',' ').Substring(0,[Math]::Min(300,($_.Message -replace '\s+',' ').Length))}} | Format-List
! @win Remove-VpnConnection -Name 'VPN-Cong-Ty' -Force
