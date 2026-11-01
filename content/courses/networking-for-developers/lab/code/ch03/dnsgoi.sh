#!/bin/bash
# dnsgoi.sh <tệp.pcap> [bộ lọc tshark] — in mỗi gói DNS một dòng: lúc nào, ai gửi ai, hỏi hay trả lời, tên, loại, kết quả.
#   referral = "tôi không biết, hãy hỏi máy chủ này" (không có answer, có NS ở phần authority) · aa = câu trả lời của chính chủ tên miền
tshark -r "$1" ${2:+-Y "$2"} -T fields -E occurrence=f -e frame.time_relative -e ip.src -e ip.dst -e dns.flags.response \
  -e dns.qry.name -e dns.qry.type -e dns.flags.rcode -e dns.count.answers -e dns.count.auth_rr -e dns.flags.authoritative 2>/dev/null |
awk -F'\t' 'BEGIN { split("1 A 2 NS 5 CNAME 6 SOA 15 MX 16 TXT 28 AAAA 33 SRV 43 DS 46 RRSIG 48 DNSKEY 65 HTTPS 257 CAA", m, " ");
                    for (i = 1; i in m; i += 2) T[m[i]] = m[i+1]; R[0]="NOERROR"; R[2]="SERVFAIL"; R[3]="NXDOMAIN"; R[5]="REFUSED"
                    printf "%7s  %-15s   %-15s %-6s  %-20s %-6s %s\n", "t(s)", "from", "to", "msg", "name", "type", "result" }
{ ty = ($6 in T) ? T[$6] : $6; n = ($5 == "<Root>") ? "." : $5
  if ($4 == "True") { r = R[$7]; if ($8 > 0) r = r " " ($10 == "True" ? "aa " : "") "answers=" $8
                      else if ($7 == 0 && $9 > 0 && $10 != "True") r = r " referral"
                      else if ($10 == "True") r = r " aa" }
  printf "%7.4f  %-15s → %-15s %-6s  %-20s %-6s %s\n", $1, $2, $3, ($4 == "True" ? "answer" : "query"), n, ty, ($4 == "True" ? r : "") }'
