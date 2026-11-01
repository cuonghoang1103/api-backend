# Ch3 · 3.1 — search + ndots: tên "ít dấu chấm" bị ghép đuôi search TRƯỚC (kiểu Kubernetes ndots:5) — đếm câu hỏi thật bằng tshark
@ cp /etc/resolv.conf /tmp/resolv.bak
printf 'nameserver 198.51.100.1\nsearch labflow.test\noptions ndots:5\n' > /etc/resolv.conf
@ rm -f /tmp/n.pcap; (tcpdump -i eth0 -n -U -w /tmp/n.pcap udp port 53 >/dev/null 2>&1 &) ; sleep 2
getent ahostsv4 api | head -1
getent ahostsv4 labflow.cdn.test | head -1
getent ahostsv4 labflow.cdn.test. | head -1
@ sleep 1; pkill -INT tcpdump; sleep 1
tshark -r /tmp/n.pcap -Y 'dns.flags.response==1' -T fields -e dns.qry.name -e dns.qry.type -e dns.flags.rcode 2>/dev/null | awk '{ print ($3=="3"?"NXDOMAIN":"NOERROR "), $1 }'
@ cp /tmp/resolv.bak /etc/resolv.conf
