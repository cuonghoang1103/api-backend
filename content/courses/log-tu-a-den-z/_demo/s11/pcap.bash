# 11.5 — bắt gói cho người đọc log: tcpdump trên android-7f3a (máy khách) lúc nó gọi web lab7 (200, 404), cổng đóng trên router (RST), DNS, HTTPS;
# rồi đọc tệp .pcap trên lab7 bằng tcpdump -r và tshark (Wireshark 4.2 dòng lệnh), đối chiếu với access log nginx. Chạy: python3 cong-cu/chay-vm.py pcap.bash
! @android sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq tcpdump >/dev/null 2>&1; rm -f /tmp/c11.pcap
! sleep 35
@android sudo timeout 20 tcpdump -i ens3 -n -s 0 -w /tmp/c11.pcap 'not port 22' 2>/tmp/td.err & sleep 2; curl -s -o /dev/null -w "%{http_code}\n" http://192.168.56.10/; curl -s -o /dev/null -w "%{http_code}\n" "http://192.168.56.10/khong-co?ma=abc"; curl -s -m 3 -o /dev/null http://192.168.56.1:8081/; echo "curl cổng 8081: mã thoát $?"; curl -s -o /dev/null -w "%{http_code}\n" https://example.com/; wait; cat /tmp/td.err
! @host ssh -F cong-cu/ssh.cfg android 'cat /tmp/c11.pcap' | ssh -F cong-cu/ssh.cfg lab7 'cat > /home/hv/c11.pcap'
capinfos -c -u -a -e c11.pcap
tcpdump -nn -r c11.pcap 2>/dev/null | head -n 8
tcpdump -nn -r c11.pcap 'tcp[tcpflags] & tcp-rst != 0' 2>/dev/null
tshark -r c11.pcap -Y 'dns.flags.response == 1' -T fields -e frame.time -e ip.dst -e dns.qry.name -e dns.a 2>/dev/null | cut -c13-
tshark -r c11.pcap -Y 'http.request || http.response' -T fields -e frame.number -e ip.src -e tcp.srcport -e http.request.method -e http.request.uri -e http.response.code -e http.time 2>/dev/null
tshark -r c11.pcap -Y 'http.response.code >= 400' 2>/dev/null
tshark -r c11.pcap -q -z follow,tcp,ascii,1 2>/dev/null | head -n 16
sudo tail -n 2 /var/log/nginx/access.log
tshark -r c11.pcap -Y 'tls.handshake.type == 1' -T fields -e ip.dst -e tls.handshake.extensions_server_name 2>/dev/null; tshark -r c11.pcap -Y 'tls.app_data' 2>/dev/null | head -n 2 | cut -c1-120
tshark -r c11.pcap -q -z conv,tcp 2>/dev/null | sed -n '1,12p'
