# 14.4 · nft-gw: trường thấy gì khi laptop dùng OpenVPN-TCP 443 — và câu hỏi DNS nào đã lọt ra trước khi vá
conntrack -L -s 10.20.2.159 -p tcp 2>/dev/null | awk '{print $6, $8}' | sort | uniq -c
tshark -r /tmp/dns.pcap -Y "dns.flags.response == 0" -T fields -e ip.src -e ip.dst -e dns.qry.name 2>/dev/null
