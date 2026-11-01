/**
 * Số liệu THẬT của Chương 3 (khoá Networking for Developers) — phần DNS của "Internet in a box"
 * (content/courses/networking-for-developers/lab/moi-truong/dns.yml): máy chủ gốc 192.0.2.10, TLD .test 192.0.2.20,
 * LabFlow ns1 203.0.113.53 / ns2 .54, CDN 192.0.2.40 (GeoDNS), resolver nhà mạng 198.51.100.1 (Unbound, kiểm DNSSEC),
 * DNS công cộng anycast 198.19.1.1 (pop1 Hà Nội · pop2 Singapore).
 *
 * Chép NGUYÊN VĂN (chỉ bỏ khoảng trắng cuối dòng) từ content/courses/networking-for-developers/lab/out/ — các tệp đó là output GIỮ
 * (code/dung-output-ch3.sh không ghi đè) hoặc output không đổi giữa các lần chạy. engine/capture3.test.ts mở lại từng tệp và
 * kiểm MỌI dòng ở đây có mặt nguyên văn. Đừng sửa tay. Thứ mô phỏng tự tính phải ghi nhãn "tính ra".
 */

export interface Cap3 { src: string; lines: readonly string[] }
export const CAPTURES3: Cap3[] = [];
function cap(src: string, lines: string[]): readonly string[] {
  CAPTURES3.push({ src, lines });
  return lines;
}

/** c31-isp-doc — dnsgoi.sh: mọi gói DNS trên máy nhà mạng khi laptop hỏi www.labflow.test hai lần (dòng đầu = tiêu đề cột) */
export const DNS_TRACE = cap('c31-isp-doc', [
  '   t(s)  from              to              msg     name                 type   result',
  ' 0.0000  198.51.100.2    → 198.51.100.1    query   www.labflow.test     A',
  ' 0.0003  192.0.2.1       → 192.0.2.10      query   .                    NS',
  ' 0.0015  192.0.2.10      → 192.0.2.1       answer  .                    NS     NOERROR aa answers=2',
  ' 0.0017  192.0.2.1       → 192.0.2.10      query   test                 A',
  ' 0.0019  192.0.2.10      → 192.0.2.1       answer  test                 A      NOERROR referral',
  ' 0.0020  192.0.2.1       → 192.0.2.20      query   labflow.test         A',
  ' 0.0025  192.0.2.20      → 192.0.2.1       answer  labflow.test         A      NOERROR referral',
  ' 0.0026  192.0.2.1       → 203.0.113.53    query   www.labflow.test     A',
  ' 0.0038  203.0.113.53    → 192.0.2.1       answer  www.labflow.test     A      NOERROR aa answers=4',
  ' 0.0040  192.0.2.1       → 203.0.113.54    query   labflow.test         A',
  ' 0.0051  203.0.113.54    → 192.0.2.1       answer  labflow.test         A      NOERROR aa answers=2',
  ' 0.0054  192.0.2.1       → 192.0.2.10      query   .                    DNSKEY',
  ' 0.0055  192.0.2.1       → 192.0.2.10      query   _ta-9e2e             A',
  ' 0.0065  192.0.2.10      → 192.0.2.1       answer  _ta-9e2e             A      NXDOMAIN aa',
  ' 0.0065  192.0.2.10      → 192.0.2.1       answer  .                    DNSKEY NOERROR aa answers=4',
  ' 0.0071  192.0.2.1       → 192.0.2.20      query   test                 DNSKEY',
  ' 0.0078  192.0.2.20      → 192.0.2.1       answer  test                 DNSKEY NOERROR aa answers=4',
  ' 0.0081  192.0.2.1       → 203.0.113.54    query   labflow.test         DNSKEY',
  ' 0.0093  203.0.113.54    → 192.0.2.1       answer  labflow.test         DNSKEY NOERROR aa answers=4',
  ' 0.0097  198.51.100.1    → 198.51.100.2    answer  www.labflow.test     A      NOERROR answers=2',
  ' 1.0359  198.51.100.2    → 198.51.100.1    query   www.labflow.test     A',
  ' 1.0360  198.51.100.1    → 198.51.100.2    answer  www.labflow.test     A      NOERROR answers=2',
]);
/** c31-dig — dig www.labflow.test — lần đầu (cache trống): header, câu trả lời, thời gian */
export const DNS_COLD = cap('c31-dig', [
  ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 45418',
  ';; flags: qr rd ra ad; QUERY: 1, ANSWER: 2, AUTHORITY: 0, ADDITIONAL: 1',
  '; EDNS: version: 0, flags:; udp: 1232',
  'www.labflow.test.\t300\tIN\tCNAME\tlabflow.test.',
  'labflow.test.\t\t300\tIN\tA\t203.0.113.10',
  ';; Query time: 13 msec',
  ';; SERVER: 198.51.100.1#53(198.51.100.1) (UDP)',
]);
/** c31-dig — lần hai — từ cache của resolver */
export const DNS_WARM = cap('c31-dig', [
  'www.labflow.test.\t300\tIN\tCNAME\tlabflow.test.',
  'labflow.test.\t\t300\tIN\tA\t203.0.113.10',
  ';; Query time: 0 msec',
]);
/** c31-stub — nsswitch · getent · dig · curl · Node lookup/resolve4 khi /etc/hosts có dòng 203.0.113.11 labflow.test */
export const DNS_STUB = cap('c31-stub', [
  'hosts:          files dns',
  '203.0.113.11    STREAM labflow.test',
  '203.0.113.10',
  'LabFlow edge Singapore (server 203.0.113.11)',
  'dns.resolve4 [ \'203.0.113.10\' ]',
  'dns.lookup   203.0.113.11',
]);
/** c31-ndots — các câu trả lời thấy trên dây với search labflow.test + ndots:5 */
export const DNS_NDOTS = cap('c31-ndots', [
  'NOERROR  api.labflow.test',
  'NXDOMAIN labflow.cdn.test.labflow.test',
  'NOERROR  labflow.cdn.test',
  'NOERROR  labflow.cdn.test',
]);
/** c31-ubuntu — Ubuntu + systemd-resolved: resolv.conf và nguồn của hai lần hỏi */
export const DNS_RESOLVED = cap('c31-ubuntu', [
  'nameserver 127.0.0.53',
  '-- Data from: network',
  '-- Data from: cache',
]);
/** c32-hoi — dig +noall +answer — bản ghi A */
export const ZONE_A = cap('c32-hoi', [
  'labflow.test.\t\t289\tIN\tA\t203.0.113.10',
]);
/** c32-hoi — dig +noall +answer — bản ghi AAAA */
export const ZONE_AAAA = cap('c32-hoi', [
  'labflow.test.\t\t300\tIN\tAAAA\t2001:db8:d::10',
]);
/** c32-hoi — dig +noall +answer — bản ghi CNAME */
export const ZONE_CNAME = cap('c32-hoi', [
  'www.labflow.test.\t300\tIN\tCNAME\tlabflow.test.',
  'labflow.test.\t\t289\tIN\tA\t203.0.113.10',
]);
/** c32-hoi — dig +noall +answer — bản ghi CDN */
export const ZONE_CDN = cap('c32-hoi', [
  'static.labflow.test.\t300\tIN\tCNAME\tlabflow.cdn.test.',
  'labflow.cdn.test.\t51\tIN\tA\t203.0.113.10',
]);
/** c32-hoi — dig +noall +answer — bản ghi MX */
export const ZONE_MX = cap('c32-hoi', [
  'labflow.test.\t\t300\tIN\tMX\t10 mail.labflow.test.',
  'mail.labflow.test.\t300\tIN\tA\t203.0.113.25',
]);
/** c32-hoi — dig +noall +answer — bản ghi TXT */
export const ZONE_TXT = cap('c32-hoi', [
  'labflow.test.\t\t300\tIN\tTXT\t"labflow-verify=7f3c9a1e"',
  'labflow.test.\t\t300\tIN\tTXT\t"v=spf1 mx -all"',
  '_dmarc.labflow.test.\t300\tIN\tTXT\t"v=DMARC1; p=quarantine; rua=mailto:dmarc@labflow.test"',
]);
/** c32-hoi — dig +noall +answer — bản ghi CAA */
export const ZONE_CAA = cap('c32-hoi', [
  'labflow.test.\t\t300\tIN\tCAA\t0 issue "letsencrypt.org"',
]);
/** c32-hoi — dig +noall +answer — bản ghi SRV */
export const ZONE_SRV = cap('c32-hoi', [
  '_mongodb._tcp.db.labflow.test. 300 IN\tSRV\t0 0 27017 db1.labflow.test.',
  '_mongodb._tcp.db.labflow.test. 300 IN\tSRV\t0 0 27017 db2.labflow.test.',
]);
/** c32-hoi — dig +noall +answer — bản ghi HTTPS */
export const ZONE_HTTPS = cap('c32-hoi', [
  'labflow.test.\t\t300\tIN\tHTTPS\t1 . alpn="h2" ipv4hint=203.0.113.10',
]);
/** c32-hoi — dig +noall +answer — bản ghi NS */
export const ZONE_NS = cap('c32-hoi', [
  'labflow.test.\t\t86389\tIN\tNS\tns2.labflow.test.',
  'labflow.test.\t\t86389\tIN\tNS\tns1.labflow.test.',
]);
/** c32-hoi — dig +noall +answer — bản ghi SOA */
export const ZONE_SOA = cap('c32-hoi', [
  'labflow.test.\t\t3600\tIN\tSOA\tns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
]);
/** c32-kiem — named-checkzone: CNAME ở đỉnh tên miền */
export const ZONE_APEX = cap('c32-kiem', [
  'dns_master_load: /tmp/apex.zone:13: labflow.test: CNAME and other data',
  'dns_master_load: /tmp/apex.zone:20: labflow.test: CNAME and other data',
  'dns_master_load: /tmp/apex.zone:23: labflow.test: CNAME and other data',
  'dns_master_load: /tmp/apex.zone:26: labflow.test: CNAME and other data',
  'dns_master_load: /tmp/apex.zone:34: labflow.test: CNAME and other data',
  'zone labflow.test/IN: loading from master file /tmp/apex.zone failed: CNAME and other data',
  'zone labflow.test/IN: not loaded due to errors.',
]);
/** c32-kiem — named-checkzone: CNAME đứng chung với bản ghi A */
export const ZONE_CHUNG = cap('c32-kiem', [
  'dns_master_load: /tmp/chung.zone:35: api.labflow.test: CNAME and other data',
  'zone labflow.test/IN: loading from master file /tmp/chung.zone failed: CNAME and other data',
  'zone labflow.test/IN: not loaded due to errors.',
]);
/** c32-kiem — named-checkzone: MX trỏ vào một IP */
export const ZONE_MXIP = cap('c32-kiem', [
  '/tmp/mx.zone:20: warning: \'203.0.113.25.\': MX is an address',
  'zone labflow.test/IN: labflow.test/MX \'203.0.113.25\' (out of zone) has no addresses records (A or AAAA)',
  'zone labflow.test/IN: loaded serial 2026110101',
  'OK',
]);
/** c32-kiem — named-checkzone: quên dấu chấm cuối */
export const ZONE_DOT = cap('c32-kiem', [
  'zone labflow.test/IN: labflow.test/MX \'mail.labflow.test.labflow.test\' has no address records (A or AAAA)',
  'zone labflow.test/IN: loaded serial 2026110101',
  'OK',
]);
/** c32-kiem — named-checkzone: tệp đúng */
export const ZONE_OK = cap('c32-kiem', [
  'zone labflow.test/IN: loaded serial 2026110101',
  'OK',
]);
/** c32-serial-hoi — quên serial: ns1, ns2, SOA ns1, SOA ns2 */
export const ZONE_SERIAL_BAD = cap('c32-serial-hoi', [
  '203.0.113.11',
  '203.0.113.10',
  'ns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
  'ns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
]);
/** c32-serial-hoi2 — sau khi tăng serial */
export const ZONE_SERIAL_OK = cap('c32-serial-hoi2', [
  '203.0.113.11',
  '203.0.113.11',
  'ns1.labflow.test. hostmaster.labflow.test. 2026110102 3600 600 1209600 300',
  'ns1.labflow.test. hostmaster.labflow.test. 2026110102 3600 600 1209600 300',
]);
/** c32-ns2-log — log ns2: NOTIFY + chép vùng */
export const ZONE_NS2LOG = cap('c32-ns2-log', [
  '01-Nov-2026 17:16:42.106 zone labflow.test/IN: notify from 203.0.113.53#47692: serial 2026110102',
  '01-Nov-2026 17:16:42.111: transfer of \'labflow.test/IN\' from 203.0.113.53#53: Transfer completed: 1 messages, 74 records, 5141 bytes, 0.002 secs (2570500 bytes/sec) (serial 2026110102)',
]);
/** c33-dem — qua resolver hai lần cách 5 s, rồi hỏi thẳng ns1 */
export const TTL_DEM = cap('c33-dem', [
  'api.labflow.test.\t120\tIN\tA\t203.0.113.10',
  'api.labflow.test.\t115\tIN\tA\t203.0.113.10',
  'api.labflow.test.\t120\tIN\tA\t203.0.113.10',
]);
/** c33-theo-doc — laptop hỏi api mỗi 15 s trong thí nghiệm hạ TTL rồi đổi IP ngay */
export const TTL_THEO = cap('c33-theo-doc', [
  '16:10:46  TTL 120  203.0.113.10',
  '16:11:01  TTL 105  203.0.113.10',
  '16:11:16  TTL 90   203.0.113.10',
  '16:11:31  TTL 75   203.0.113.10',
  '16:11:46  TTL 60   203.0.113.10',
  '16:12:01  TTL 45   203.0.113.10',
  '16:12:16  TTL 30   203.0.113.10',
  '16:12:32  TTL 14   203.0.113.10',
  '16:12:47  TTL 10   203.0.113.11',
  '16:13:02  TTL 10   203.0.113.11',
  '16:13:17  TTL 10   203.0.113.10',
  '16:13:32  TTL 10   203.0.113.10',
  '16:13:47  TTL 10   203.0.113.10',
]);
/** c33-ns-ha — giờ hạ TTL */
export const TTL_NS_HA = cap('c33-ns-ha', [
  '16:10:51',
]);
/** c33-ns-doi — giờ đổi IP lần 1 */
export const TTL_NS_DOI = cap('c33-ns-doi', [
  '16:11:02',
]);
/** c33-ns-doi2 — giờ đổi IP lần 2 */
export const TTL_NS_DOI2 = cap('c33-ns-doi2', [
  '16:13:07',
]);
/** c33-am — hỏi new.labflow.test trước khi tạo */
export const TTL_NEG1 = cap('c33-am', [
  ';; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 50830',
  'labflow.test.\t\t300\tIN\tSOA\tns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
]);
/** c33-am2 — đã tạo trên ns1; resolver vẫn NXDOMAIN */
export const TTL_NEG2 = cap('c33-am2', [
  '203.0.113.10',
  ';; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 29011',
  'labflow.test.\t\t298\tIN\tSOA\tns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
]);
/** c33-am-xoa1 — xoá một tên */
export const TTL_NEG_FLUSH1 = cap('c33-am-xoa1', [
  'ok',
]);
/** c33-am3b — vẫn NXDOMAIN sau khi xoá tên */
export const TTL_NEG_STILL = cap('c33-am3b', [
  ';; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 1929',
  'labflow.test.\t\t298\tIN\tSOA\tns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300',
]);
/** c33-am-xoa2 — aggressive-nsec + xoá cả vùng */
export const TTL_NEG_FLUSH2 = cap('c33-am-xoa2', [
  'yes',
  'ok removed 9 rrsets, 2 messages and 1 key entries',
]);
/** c33-am3 — sau khi xoá cả vùng */
export const TTL_NEG_OK = cap('c33-am3', [
  '203.0.113.10',
]);
/** c33-app — Java: 5 lần tra + số câu hỏi DNS rời máy */
export const TTL_JAVA = cap('c33-app', [
  'java lookup 1: 203.0.113.10 in 10.5 ms',
  'java lookup 2: 203.0.113.10 in 0.5 ms',
  'java lookup 3: 203.0.113.10 in 1.5 ms',
  'java lookup 4: 203.0.113.10 in 0.1 ms',
  'java lookup 5: 203.0.113.10 in 0.2 ms',
  '2',
]);
/** c33-app — Node: 5 lần tra + số câu hỏi DNS rời máy */
export const TTL_NODE = cap('c33-app', [
  'node lookup 1: 203.0.113.10 in 4.0 ms',
  'node lookup 2: 203.0.113.10 in 6.2 ms',
  'node lookup 3: 203.0.113.10 in 2.6 ms',
  'node lookup 4: 203.0.113.10 in 2.8 ms',
  'node lookup 5: 203.0.113.10 in 3.0 ms',
  '5',
]);
/** c33-treo — thread pool 4 luồng */
export const TTL_POOL4 = cap('c33-treo', [
  '   72 ms  readFile /etc/hostname: laptop',
  '10086 ms  lookup x1.dead.test: EAI_AGAIN',
  '10086 ms  lookup x2.dead.test: EAI_AGAIN',
  '20093 ms  lookup x3.dead.test: EAI_AGAIN',
  '20096 ms  lookup x4.dead.test: EAI_AGAIN',
]);
/** c33-treo8 — thread pool 8 luồng */
export const TTL_POOL8 = cap('c33-treo8', [
  '    6 ms  readFile /etc/hostname: laptop',
  '10012 ms  lookup x3.dead.test: EAI_AGAIN',
  '10014 ms  lookup x1.dead.test: EAI_AGAIN',
  '10015 ms  lookup x2.dead.test: EAI_AGAIN',
  '10015 ms  lookup x4.dead.test: EAI_AGAIN',
]);
/** c34-anycast — từ laptop: id.server + traceroute */
export const ANY_HOME = cap('c34-anycast', [
  '"pop1.hn (public DNS 198.19.1.1, Hanoi)"',
  'traceroute to 198.19.1.1 (198.19.1.1), 30 hops max, 60 byte packets',
  ' 1  192.168.50.1  0.554 ms',
  ' 2  198.51.100.1  0.470 ms',
  ' 3  198.19.1.1  0.359 ms',
]);
/** c34-anycast-dc — từ máy trong DC */
export const ANY_DC = cap('c34-anycast-dc', [
  '"pop2.sg (public DNS 198.19.1.1, Singapore)"',
  'traceroute to 198.19.1.1 (198.19.1.1), 30 hops max, 60 byte packets',
  ' 1  203.0.113.1  0.349 ms',
  ' 2  198.19.1.1  0.293 ms',
]);
/** c34-bgp — show ip bgp 198.19.1.0/24 trên isp */
export const ANY_BGP = cap('c34-bgp', [
  'BGP routing table entry for 198.19.1.0/24, version 2',
  'Paths: (2 available, best #1, table default)',
  '  Advertised to peers:',
  '  192.0.2.3 192.0.2.30 192.0.2.66',
  '  64530',
  '    192.0.2.30 from 192.0.2.30 (192.0.2.30)',
  '      Origin IGP, metric 0, valid, external, best (AS Path)',
  '      Last update: Sun Nov  1 17:16:01 2026',
  '  64510 64530',
  '    192.0.2.3 from 192.0.2.3 (192.0.2.3)',
  '      Origin IGP, valid, external',
  '      Last update: Sun Nov  1 17:16:01 2026',
]);
/** c34-theo-doc — laptop hỏi 198.19.1.1 mỗi giây, pop1 rút lúc 16:22:56 */
export const ANY_THEO = cap('c34-theo-doc', [
  '16:22:53  "pop1.hn (public DNS 198.19.1.1, Hanoi)"',
  '16:22:54  "pop1.hn (public DNS 198.19.1.1, Hanoi)"',
  '16:22:55  "pop1.hn (public DNS 198.19.1.1, Hanoi)"',
  '16:22:56  "pop1.hn (public DNS 198.19.1.1, Hanoi)"',
  '16:22:57  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
  '16:22:58  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
  '16:22:59  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
  '16:23:00  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
  '16:23:01  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
  '16:23:02  "pop2.sg (public DNS 198.19.1.1, Singapore)"',
]);
/** c34-pop1-rut — giờ pop1 rút */
export const ANY_RUT = cap('c34-pop1-rut', [
  '16:22:56',
]);
/** c34-geo — GeoDNS từ laptop: resolver nhà mạng, pop1, curl */
export const ANY_GEO = cap('c34-geo', [
  'labflow.cdn.test.',
  '203.0.113.10',
  'labflow.cdn.test.',
  '203.0.113.10',
  'LabFlow edge Hanoi (server 203.0.113.10)',
]);
/** c34-geo-dc — GeoDNS từ ns2 (pop2) */
export const ANY_GEO_DC = cap('c34-geo-dc', [
  'labflow.cdn.test.',
  '203.0.113.11',
  'LabFlow edge Singapore (server 203.0.113.11)',
]);
/** c34-geo-sai — laptop sau khi pop1 rút */
export const ANY_GEO_SAI = cap('c34-geo-sai', [
  '"pop2.sg (public DNS 198.19.1.1, Singapore)"',
  'labflow.cdn.test.',
  '203.0.113.11',
  'LabFlow edge Singapore (server 203.0.113.11)',
]);
/** c34-rr — thứ tự hai bản ghi A */
export const ANY_RR_DIG = cap('c34-rr', [
  '203.0.113.12 203.0.113.10',
  '203.0.113.12 203.0.113.10',
  '203.0.113.10 203.0.113.12',
  '203.0.113.10 203.0.113.12',
]);
/** c34-rr — curl: connect time */
export const ANY_RR_CURL = cap('c34-rr', [
  '203.0.113.10  connect 0.002990s',
  '203.0.113.10  connect 0.205838s',
  '203.0.113.10  connect 0.002415s',
  '203.0.113.10  connect 0.001743s',
]);
/** c34-rr — Python: connect time + lỗi tới máy chết */
export const ANY_RR_PY = cap('c34-rr', [
  'python 203.0.113.10 connected after 2.821 s',
  'python 203.0.113.10 connected after 0.005 s',
  'python 203.0.113.10 connected after 3.081 s',
  'python 203.0.113.10 connected after 0.008 s',
  'OSError: [Errno 113] No route to host',
]);
/** c34-rr-thu — curl --trace-time ×2 + Node autoSelectFamily */
export const ANY_RR_THU = cap('c34-rr-thu', [
  '16:55:49.381329 *   Trying 203.0.113.12:80...',
  '16:55:49.592099 *   Trying 203.0.113.10:80...',
  '16:55:49.593044 * Established connection to app.labflow.test (203.0.113.10 port 80) from 192.168.50.10 port 53326',
  '16:55:49.608394 *   Trying 203.0.113.12:80...',
  '16:55:50.615961 *   Trying 203.0.113.10:80...',
  '16:55:50.617127 * Established connection to app.labflow.test (203.0.113.10 port 80) from 192.168.50.10 port 53328',
  'attempt timeout: 250 ms',
  'connected to 203.0.113.10 after 264 ms',
]);
/** c34-that — cuongthai.com / media.cuongthai.com / 1.1.1.1 */
export const ANY_CF = cap('c34-that', [
  '160.187.1.208',
  '"152992 | 160.187.0.0/23 | VN | apnic | 2024-09-05"',
  '172.67.161.19',
  '104.21.90.200',
  '"13335 | 172.67.160.0/20 | US | arin | 2015-02-25"',
  'server: cloudflare',
  'cf-ray: a539d6eafec6dd3e-HKG',
  'server: nginx/1.27.5',
  '"hkg11"',
]);
/** c35-chuoi — chuỗi tin cậy: RRSIG, DNSKEY, DS, DS tự tính, DS của test, mỏ neo, cờ, delv */
export const SEC_CHUOI = cap('c35-chuoi', [
  'labflow.test.\t\t300\tIN\tA\t203.0.113.10',
  'labflow.test.\t\t300\tIN\tRRSIG\tA 13 2 300 20261201102442 20261101092442 62671 labflow.test. tHgSYhKgL+Va+d31K7R/x1uYqtxMlg+HMxogV0sVgsGPq67oXpbYhlkk oaBIfTSTjL/5kmro5Hztjm8OCNprXg==',
  'labflow.test. DNSKEY 257 3 13 Q8ELEP109JcZSFib…',
  'labflow.test. DNSKEY 256 3 13 xzRWnqoxiH8ysNNF…',
  'labflow.test.\t\t3600\tIN\tDS\t30957 13 2 0FA2C679E930C7E36936706B14EAA9991CE9A57532C3620D014E2ABA F1499185',
  'labflow.test. IN DS 30957 13 2 0FA2C679E930C7E36936706B14EAA9991CE9A57532C3620D014E2ABAF1499185',
  'test.\t\t\t86400\tIN\tDS\t39072 13 2 CCEC87AE6F412C58CF2EBA7C3DACC5B8CF14016F1AD8077617142FB5 01826AF1',
  'trust-anchors { . static-ds 57466 13 2 "53274C60181AAFF3C55E9752CA22148C8E40E807A4D2DB4602C10AA45C5E364B"; };',
  ';; flags: qr rd ra ad; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1',
  '; fully validated',
  'labflow.test.\t\t300\tIN\tA\t203.0.113.10',
]);
/** c35-chuoi — delv: CNAME có ký, đích không ký */
export const SEC_DELV_STATIC = cap('c35-chuoi', [
  '; fully validated',
  'static.labflow.test.\t300\tIN\tCNAME\tlabflow.cdn.test.',
  'static.labflow.test.\t300\tIN\tRRSIG\tCNAME 13 3 300 20261201102442 20261101092442 62671 labflow.test. vGKkGtZCt3kGalcf1Rto34AVEbuGFrAvZUfMHBPkiyku4DHlj4oERnXw QMwi1PH6W3qgyLJUtv85r+Pg6U6ISg==',
  '; unsigned answer',
  'labflow.cdn.test.\t60\tIN\tA\t203.0.113.10',
]);
/** c35-hong — chữ ký hết hạn: status/EDE, +cd, khoảng hiệu lực, giờ UTC */
export const SEC_HONG = cap('c35-hong', [
  ';; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 14879',
  '; EDE: 7 (Signature Expired): (validation failure <labflow.test. A IN>: signature expired from 203.0.113.53 for key labflow.test. while building chain of trust)',
  '203.0.113.10',
  'RRSIG valid from 20261002102446 until 20261030102446',
  '20261101102450',
]);
/** c35-sua-hoi — ngay sau khi ký lại */
export const SEC_SUA1 = cap('c35-sua-hoi', [
  ';; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 14010',
]);
/** c35-isp-bogus — val-bogus-ttl + flush_bogus */
export const SEC_BOGUS = cap('c35-isp-bogus', [
  '60',
  'ok removed 0 rrsets, 1 messages and 1 key entries',
]);
/** c35-sua-hoi2 — sau flush_bogus */
export const SEC_SUA2 = cap('c35-sua-hoi2', [
  ';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 36096',
]);
/** c35-rieng-doc — bắt gói ở router nhà: DNS thường / DoT / DoH */
export const SEC_WIRE = cap('c35-rieng-doc', [
  'DNS  port 53   query name: labflow.test',
  'TLS  port 853  TLS hello, alpn=dot',
  'TLS  port 853  TLS application data (69 bytes, encrypted)',
  'TLS  port 853  TLS application data (72 bytes, encrypted)',
  'TLS  port 853  TLS application data (19 bytes, encrypted)',
  'TLS  port 443  TLS hello, alpn=h2',
  'TLS  port 443  TLS application data (69 bytes, encrypted)',
  'TLS  port 443  TLS application data (56 bytes, encrypted)',
  'TLS  port 443  TLS application data (182 bytes, encrypted)',
  'TLS  port 443  TLS application data (26 bytes, encrypted)',
]);
/** c35-that — Internet thật: cloudflare.com, dnssec-failed.org, cuongthai.com */
export const SEC_REAL = cap('c35-that', [
  ';; flags: qr rd ra ad; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1',
  'cloudflare.com.\t\t142\tIN\tRRSIG\tA 13 2 300 20261102102436 20261031082436 34505 cloudflare.com. lmbxwbK6mMlkXN6UbyihP+SttbIcFSVUq9Gvv9/mn3WTWCEGuZuCZdrA w5Ou1a3WMIRfLtZ8Hes5LbNcq5jjog==',
  '2371 13 2 32996839A6D808AFE3EB4A795A0E6A7A39A76FC52FF228B22B76F6D6 3826F2B9',
  ';; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 43095',
  '; EDE: 9 (DNSKEY Missing): (no SEP matching the DS found for dnssec-failed.org.)',
  '96.99.227.255',
  ';; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1',
]);
