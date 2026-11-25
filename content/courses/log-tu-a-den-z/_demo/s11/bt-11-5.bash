# Lời giải 🧪 Bài 11.5 (trên lab7, tệp c11.pcap của pcap.bash)
tshark -r c11.pcap -Y 'dns.flags.response == 0' -T fields -e frame.number -e dns.qry.name -e dns.qry.type 2>/dev/null
tshark -r c11.pcap -Y 'tcp.flags.syn == 1 && tcp.flags.ack == 0' -T fields -e ip.dst -e tcp.dstport 2>/dev/null | sort | uniq -c
tshark -r c11.pcap -Y 'http.request' -T fields -e frame.time -e http.request.uri -e http.user_agent 2>/dev/null | cut -c13-
