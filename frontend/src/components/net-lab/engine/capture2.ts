/**
 * Số liệu THẬT của Chương 2 (khoá Networking for Developers) — "Internet in a box"
 * (content/courses/networking-for-developers/lab/moi-truong/internet.yml): nhà 192.168.50.0/24 sau homegw (NAT ra wan0
 * 198.51.100.2) → nhà mạng isp AS64500 → điểm trao đổi IX 192.0.2.0/24 → DC AS64510 (server 203.0.113.10, ns .53) và
 * rogue AS64511 (198.18.0.0/24). BGP bằng FRR.
 *
 * Chép NGUYÊN VĂN (chỉ bỏ khoảng trắng cuối dòng) từ content/courses/networking-for-developers/lab/out/:
 *   c21-dia-chi, c21-chia, c21-sai-mask                         — subnet
 *   c22-laptop, c22-routers, c22-isp, c22-dc-vong, c22-dc-sua,
 *   c22-trace, c22-sao, c22-dc-chan, c22-vong                    — định tuyến, traceroute, vòng lặp
 *   c23-homegw, c23-laptop, c23-phone, c23-vao, c23-dnat,
 *   c23-vao2, c23-vao3, c23-isp, c23-mobile, c23-docker          — NAT, conntrack, DNAT, CGNAT
 *   c24-dia-chi, c24-ndp, c24-dual, c24-happy, c24-localhost,
 *   c24-nghe, c24-goi-nghe                                       — IPv6
 *   c25-isp, c25-dc, c25-rogue-cuop, c25-isp-cuop, c25-laptop-cuop,
 *   c25-dc-thay, c25-isp-loc, c25-laptop-ok, c25-dc-rut, c25-isp-rut,
 *   c25-laptop-rut, c25-dc-lai, c25-laptop-lai, c25-that         — BGP
 * engine/capture2.test.ts mở lại từng file .out.txt và kiểm MỌI dòng ở đây có mặt nguyên văn trong file nguồn.
 * Đừng sửa tay: đây là bằng chứng. Thứ mô phỏng tự tính phải ghi nhãn "tính ra" trong giao diện.
 */

export interface Cap { src: string; lines: readonly string[] }
export const CAPTURES: Cap[] = [];
function cap(src: string, lines: string[]): readonly string[] {
  CAPTURES.push({ src, lines });
  return lines;
}

// ───────────────────────── 2.1 subnet ─────────────────────────
/** python3 cidr.py … — năm lần chạy thật (bỏ dòng "check" của ipaddress) */
export const CIDR_RUNS: Record<string, readonly string[]> = {
  '10.10.1.10/24': cap('c21-dia-chi', [
    'address    10.10.1.10       00001010.00001010.00000001.00001010',
    'mask /24   255.255.255.0    11111111.11111111.11111111.00000000',
    'network    10.10.1.0        00001010.00001010.00000001.00000000   (address AND mask)',
    'broadcast  10.10.1.255      00001010.00001010.00000001.11111111   (host bits all 1)',
    'hosts      10.10.1.1 - 10.10.1.254   usable 254 of 256 addresses',
  ]),
  '10.10.1.10/16': cap('c21-dia-chi', [
    'address    10.10.1.10       00001010.00001010.00000001.00001010',
    'mask /16   255.255.0.0      11111111.11111111.00000000.00000000',
    'network    10.10.0.0        00001010.00001010.00000000.00000000   (address AND mask)',
    'broadcast  10.10.255.255    00001010.00001010.11111111.11111111   (host bits all 1)',
    'hosts      10.10.0.1 - 10.10.255.254   usable 65534 of 65536 addresses',
  ]),
  '192.168.50.77/26': cap('c21-dia-chi', [
    'address    192.168.50.77    11000000.10101000.00110010.01001101',
    'mask /26   255.255.255.192  11111111.11111111.11111111.11000000',
    'network    192.168.50.64    11000000.10101000.00110010.01000000   (address AND mask)',
    'broadcast  192.168.50.127   11000000.10101000.00110010.01111111   (host bits all 1)',
    'hosts      192.168.50.65 - 192.168.50.126   usable 62 of 64 addresses',
  ]),
  '203.0.113.10/32': cap('c21-dia-chi', [
    'address    203.0.113.10     11001011.00000000.01110001.00001010',
    'mask /32   255.255.255.255  11111111.11111111.11111111.11111111',
    'network    203.0.113.10     11001011.00000000.01110001.00001010   (address AND mask)',
    'broadcast  none             (/32: too few host bits to spare one for broadcast)',
    'hosts      203.0.113.10 - 203.0.113.10   usable 1 of 1 addresses',
  ]),
  '192.0.2.0/31': cap('c21-dia-chi', [
    'address    192.0.2.0        11000000.00000000.00000010.00000000',
    'mask /31   255.255.255.254  11111111.11111111.11111111.11111110',
    'network    192.0.2.0        11000000.00000000.00000010.00000000   (address AND mask)',
    'broadcast  none             (/31: too few host bits to spare one for broadcast)',
    'hosts      192.0.2.0 - 192.0.2.1   usable 2 of 2 addresses',
  ]),
};

/** python3 chia.py — VLSM cho văn phòng LabFlow */
export const CHIA_SORTED = cap('c21-chia', [
  '$ python3 chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10',
  'block 10.20.0.0/22 = 1024 addresses; needs sorted largest first',
  'name   hosts  subnet           first host   last host    broadcast    usable',
  'iot      300  10.20.0.0/23     10.20.0.1    10.20.1.254  10.20.1.255     510',
  'web      100  10.20.2.0/25     10.20.2.1    10.20.2.126  10.20.2.127     126',
  'db        20  10.20.2.128/27   10.20.2.129  10.20.2.158  10.20.2.159      30',
  'mgmt      10  10.20.2.160/28   10.20.2.161  10.20.2.174  10.20.2.175      14',
  'check: all inside 10.20.0.0/22: True · any overlap: False · used 688 of 1024, next free 10.20.2.176',
]);
export const CHIA_GIVEN = cap('c21-chia', [
  '$ python3 chia.py --as-given 10.20.0.0/22 web=100 db=20 mgmt=10 iot=300',
  'block 10.20.0.0/22 = 1024 addresses; needs in the order given',
  'name   hosts  subnet           first host   last host    broadcast    usable',
  'web      100  10.20.0.0/25     10.20.0.1    10.20.0.126  10.20.0.127     126',
  'db        20  10.20.0.128/27   10.20.0.129  10.20.0.158  10.20.0.159      30',
  'mgmt      10  10.20.0.160/28   10.20.0.161  10.20.0.174  10.20.0.175      14',
  'iot      300  10.20.2.0/23     10.20.2.1    10.20.3.254  10.20.3.255     510',
  'gap    10.20.0.176 - 10.20.1.255  (336 addresses skipped to keep the next subnet aligned)',
  'check: all inside 10.20.0.0/22: True · any overlap: False · used 688 of 1024, block full',
]);
export const CHIA_FAIL = cap('c21-chia', [
  '$ python3 chia.py 10.20.0.0/24 iot=300',
  'block 10.20.0.0/24 = 256 addresses; needs sorted largest first',
  '✗ iot needs /23 (512 addresses) — no aligned /23 left in 10.20.0.0/24: the plan does not fit',
]);

/** client2 với mặt nạ đúng /24 rồi gõ nhầm /16 */
export const MASK24 = {
  addr: cap('c21-sai-mask', ['eth0@if2838      UP             10.10.1.11/24']),
  route: cap('c21-sai-mask', ['default via 10.10.1.254 dev eth0', '10.10.1.0/24 dev eth0 proto kernel scope link src 10.10.1.11']),
  get: cap('c21-sai-mask', ['10.10.2.10 via 10.10.1.254 dev eth0 src 10.10.1.11 uid 0']),
  ping: cap('c21-sai-mask', ['64 bytes from 10.10.2.10: icmp_seq=1 ttl=63 time=1.41 ms', '1 packets transmitted, 1 received, 0% packet loss, time 0ms']),
  pingFixed: cap('c21-sai-mask', ['64 bytes from 10.10.2.10: icmp_seq=1 ttl=63 time=0.110 ms']),
};
export const MASK16 = {
  addr: cap('c21-sai-mask', ['eth0@if2838      UP             10.10.1.11/16']),
  route: cap('c21-sai-mask', ['default via 10.10.1.254 dev eth0', '10.10.0.0/16 dev eth0 proto kernel scope link src 10.10.1.11']),
  get: cap('c21-sai-mask', ['10.10.2.10 dev eth0 src 10.10.1.11 uid 0']),
  arp: cap('c21-sai-mask', [
    '05:12:20.595710 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
    '05:12:21.622394 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
    '05:12:22.646419 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
    '05:12:23.670731 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
    '05:12:23.862451 ARP, Reply 10.10.1.11 is-at 02:00:0a:0a:01:0b, length 28',
    '05:12:24.694678 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
    '05:12:25.719207 ARP, Request who-has 10.10.2.10 tell 10.10.1.11, length 28',
  ]),
  ping: cap('c21-sai-mask', ['From 10.10.1.11 icmp_seq=1 Destination Host Unreachable', '4 packets transmitted, 0 received, +1 errors, 100% packet loss, time 3075ms']),
  neigh: cap('c21-sai-mask', ['10.10.2.10 dev eth0 FAILED']),
};

// ───────────────────────── 2.2 routing ─────────────────────────
export const RT_LAPTOP = cap('c22-laptop', [
  'default via 192.168.50.1 dev eth0',
  '192.168.50.0/24 dev eth0 proto kernel scope link src 192.168.50.10',
]);
export const RT_HOMEGW = cap('c22-routers', [
  'default via 198.51.100.1 dev wan0',
  '192.168.50.0/24 dev lan0 proto kernel scope link src 192.168.50.1',
  '198.51.100.0/24 dev wan0 proto kernel scope link src 198.51.100.2',
]);
export const RT_ISP = cap('c22-isp', [
  '100.64.0.0/24 dev mob0 proto kernel scope link src 100.64.0.1',
  '192.0.2.0/24 dev ix0 proto kernel scope link src 192.0.2.1',
  '198.18.0.0/24 nhid 24 via 192.0.2.66 dev ix0 proto bgp metric 20',
  '198.51.100.0/24 dev cust0 proto kernel scope link src 198.51.100.1',
  '203.0.113.0/24 nhid 22 via 192.0.2.3 dev ix0 proto bgp metric 20',
]);
/** dc: hai dòng thật (ip route | grep 203.0.113) — tuyến /24 nối thẳng và tuyến /32 bị quên */
export const RT_DC_REAL = cap('c22-dc-vong', [
  '203.0.113.0/24 dev dc0 proto kernel scope link src 203.0.113.1',
  '203.0.113.10 via 192.0.2.1 dev ix0',
]);
export const DC_ADD_32 = cap('c22-dc-vong', ['$ ip route add 203.0.113.10/32 via 192.0.2.1']);
export const DC_DEL_32 = cap('c22-dc-sua', ['$ ip route del 203.0.113.10/32 via 192.0.2.1']);
/** `ip route get` thật: "router|đích" → dòng trả lời */
export const ROUTE_GET: Record<string, string> = {
  'laptop|192.168.50.11': cap('c22-laptop', ['192.168.50.11 dev eth0 src 192.168.50.10 uid 0'])[0],
  'laptop|203.0.113.10': cap('c22-laptop', ['203.0.113.10 via 192.168.50.1 dev eth0 src 192.168.50.10 uid 0'])[0],
  'laptop|8.8.8.8': cap('c22-laptop', ['8.8.8.8 via 192.168.50.1 dev eth0 src 192.168.50.10 uid 0'])[0],
  'homegw|203.0.113.10': cap('c22-routers', ['203.0.113.10 via 198.51.100.1 dev wan0 src 198.51.100.2 uid 0'])[0],
  'isp|203.0.113.10': cap('c22-isp', ['203.0.113.10 via 192.0.2.3 dev ix0 src 192.0.2.1 uid 0'])[0],
  'isp|203.0.113.200': cap('c22-isp', ['203.0.113.200 via 192.0.2.3 dev ix0 src 192.0.2.1 uid 0'])[0],
  'isp|8.8.8.8': cap('c22-isp', ['RTNETLINK answers: Network is unreachable'])[0],
  'dc+32|203.0.113.10': cap('c22-dc-vong', ['203.0.113.10 via 192.0.2.1 dev ix0 src 192.0.2.3 uid 0'])[0],
  'dc|203.0.113.10': cap('c22-dc-sua', ['203.0.113.10 dev dc0 src 203.0.113.1 uid 0'])[0],
};

/** traceroute + tshark của chính các gói thăm dò (TTL 1..4) */
export const TRACE_OUT = cap('c22-trace', [
  '$ traceroute -n 203.0.113.10',
  'traceroute to 203.0.113.10 (203.0.113.10), 30 hops max, 60 byte packets',
  ' 1  192.168.50.1  0.591 ms  0.509 ms  0.495 ms',
  ' 2  198.51.100.1  0.483 ms  0.409 ms  0.388 ms',
  ' 3  192.0.2.3  0.364 ms  0.329 ms  0.308 ms',
  ' 4  203.0.113.10  0.279 ms  0.199 ms  0.160 ms',
]);
/** ip.src  ip.dst  ip.ttl  info (tab) */
export const TRACE_TSHARK = cap('c22-trace', [
  '192.168.50.10\t203.0.113.10\t1\t53040 → 33434 Len=32',
  '192.168.50.1\t192.168.50.10\t64\tTime-to-live exceeded (Time to live exceeded in transit)',
  '192.168.50.10\t203.0.113.10\t2\t52581 → 33435 Len=32',
  '198.51.100.1\t192.168.50.10\t63\tTime-to-live exceeded (Time to live exceeded in transit)',
  '192.168.50.10\t203.0.113.10\t3\t47619 → 33436 Len=32',
  '192.0.2.3\t192.168.50.10\t62\tTime-to-live exceeded (Time to live exceeded in transit)',
  '192.168.50.10\t203.0.113.10\t4\t43503 → 33437 Len=32',
  '203.0.113.10\t192.168.50.10\t61\tDestination unreachable (Port unreachable)',
]);
export const DC_SILENT_RULE = cap('c22-dc-chan', ['$ iptables -A OUTPUT -p icmp --icmp-type time-exceeded -j DROP', '-A OUTPUT -p icmp -m icmp --icmp-type 11 -j DROP']);
export const SAO_OUT = cap('c22-sao', [
  '$ traceroute -n -w 1 203.0.113.10',
  'traceroute to 203.0.113.10 (203.0.113.10), 30 hops max, 60 byte packets',
  ' 1  192.168.50.1  0.048 ms  0.010 ms  0.009 ms',
  ' 2  198.51.100.1  0.034 ms  0.017 ms  0.015 ms',
  ' 3  * * *',
  ' 4  203.0.113.10  0.030 ms  0.020 ms *',
]);
export const SAO_MTR = cap('c22-sao', [
  '$ mtr -n -r -c 10 203.0.113.10',
  'HOST: laptop                      Loss%   Snt   Last   Avg  Best  Wrst StDev',
  '  1.|-- 192.168.50.1               0.0%    10    0.2   0.2   0.1   0.7   0.2',
  '  2.|-- 198.51.100.1               0.0%    10    0.1   0.2   0.1   0.3   0.1',
  '  3.|-- ???                       100.0    10    0.0   0.0   0.0   0.0   0.0',
  '  4.|-- 203.0.113.10               0.0%    10    0.4   0.2   0.1   0.4   0.1',
]);
export const SAO_CURL = cap('c22-sao', ['LabFlow edge (server 203.0.113.10)', 'you came from 198.51.100.2 port 41106']);
export const VONG_PING = cap('c22-vong', [
  '$ ping -c 2 203.0.113.10',
  'From 198.51.100.1 icmp_seq=1 Time to live exceeded',
  'From 198.51.100.1 icmp_seq=2 Time to live exceeded',
  '2 packets transmitted, 0 received, +2 errors, 100% packet loss, time 1062ms',
]);
export const VONG_TRACE = cap('c22-vong', [
  '$ traceroute -n -q 1 -N 1 -m 9 203.0.113.10',
  ' 1  192.168.50.1  0.065 ms',
  ' 2  198.51.100.1  0.041 ms',
  ' 3  192.0.2.3  0.067 ms',
  ' 4  198.51.100.1  0.026 ms',
  ' 5  192.0.2.3  0.028 ms',
  ' 6  198.51.100.1  0.033 ms',
  ' 7  192.0.2.3  0.034 ms',
  ' 8  198.51.100.1  0.035 ms',
  ' 9  192.0.2.3  0.033 ms',
]);

// ───────────────────────── 2.3 NAT ─────────────────────────
export const NAT_RULE = cap('c23-homegw', ['-A POSTROUTING -o wan0 -j MASQUERADE']);
/** SYN thấy ở hai phía homegw (tcpdump -q) */
export const NAT_LAN_SYN = cap('c23-homegw', [
  'IP 192.168.50.10.41122 > 203.0.113.10.80: tcp 0',
  'IP 192.168.50.10.41000 > 203.0.113.10.80: tcp 0',
  'IP 192.168.50.11.41000 > 203.0.113.10.80: tcp 0',
]);
export const NAT_WAN_SYN = cap('c23-homegw', [
  'IP 198.51.100.2.41122 > 203.0.113.10.80: tcp 0',
  'IP 198.51.100.2.41000 > 203.0.113.10.80: tcp 0',
  'IP 198.51.100.2.4734 > 203.0.113.10.80: tcp 0',
]);
/** conntrack -L -p tcp --dport 80 trên homegw (thứ tự như nhân in) */
export const NAT_CONNTRACK = cap('c23-homegw', [
  'tcp      6 117 TIME_WAIT src=192.168.50.10 dst=203.0.113.10 sport=41122 dport=80 src=203.0.113.10 dst=198.51.100.2 sport=80 dport=41122 [ASSURED] mark=0 use=1',
  'tcp      6 117 TIME_WAIT src=192.168.50.11 dst=203.0.113.10 sport=41000 dport=80 src=203.0.113.10 dst=198.51.100.2 sport=80 dport=4734 [ASSURED] mark=0 use=1',
  'tcp      6 117 TIME_WAIT src=192.168.50.10 dst=203.0.113.10 sport=41000 dport=80 src=203.0.113.10 dst=198.51.100.2 sport=80 dport=41000 [ASSURED] mark=0 use=1',
]);
export const NAT_SEEN = {
  laptopAuto: cap('c23-laptop', ['you came from 198.51.100.2 port 41122'])[0],
  laptop41000: cap('c23-laptop', ['you came from 198.51.100.2 port 41000'])[0],
  phone41000: cap('c23-phone', ['you came from 198.51.100.2 port 4734'])[0],
};
export const NAT_IN_FAIL = cap('c23-vao', [
  '$ nc -vz -w 3 192.168.50.10 8080',
  'nc: connect to 192.168.50.10 port 8080 (tcp) failed: Network is unreachable',
  '$ traceroute -n -q 1 -m 3 192.168.50.10',
  ' 1  203.0.113.1  0.066 ms !N',
  '$ nc -vz -w 3 198.51.100.2 8080',
  'nc: connect to 198.51.100.2 port 8080 (tcp) failed: Connection refused',
]);
export const NAT_DNAT = cap('c23-dnat', [
  '$ iptables -t nat -A PREROUTING -i wan0 -p tcp --dport 8080 -j DNAT --to-destination 192.168.50.10:8080',
  '-A PREROUTING -i wan0 -p tcp -m tcp --dport 8080 -j DNAT --to-destination 192.168.50.10:8080',
]);
export const NAT_IN_OK = cap('c23-vao2', ['$ curl -s -m 3 http://198.51.100.2:8080/', 'hello from the laptop dev server (192.168.50.10:8080)']);
export const CGNAT_RULE = cap('c23-isp', ['-A POSTROUTING -s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200']);
export const CGNAT_CONNTRACK = cap('c23-isp', ['tcp      6 119 TIME_WAIT src=100.64.0.10 dst=203.0.113.10 sport=47852 dport=80 src=203.0.113.10 dst=198.51.100.200 sport=80 dport=47852 [ASSURED] mark=0 use=1']);
export const CGNAT_MOBILE = cap('c23-mobile', ['eth0@if2878      UP             100.64.0.10/24', 'you came from 198.51.100.200 port 47852']);
export const CGNAT_IN = cap('c23-vao3', ['$ nc -vz -w 3 198.51.100.200 8080', 'nc: connect to 198.51.100.200 port 8080 (tcp) failed: Connection refused']);
export const DOCKER_P = cap('c23-docker', [
  '172.17.0.5',
  '-A DOCKER -p tcp -m tcp --dport 18080 -j DNAT --to-destination 172.17.0.5:80',
  '-A POSTROUTING -s 172.17.0.0/16 ! -o docker0 -j MASQUERADE',
  'HTTP 200 from 127.0.0.1:18080',
]);

// ───────────────────────── 2.4 IPv6 ─────────────────────────
export const V6_ADDR = cap('c24-dia-chi', [
  'eth0@if2877      UP             2001:db8:a:50::10/64 fe80::c0ff:fea8:320a/64',
  '2001:0db8:000a:0050:0000:0000:0000:0010 -> 2001:db8:a:50::10',
  '2001:db8::1:0:0:1',
  '2001:db8:a:50::/64 holds 18446744073709551616 addresses',
  'you came from 2001:db8:a:50::10 port 58834',
  'you came from 198.51.100.2 port 42874',
]);
export const V6_NDP = cap('c24-ndp', [
  'IP6 2001:db8:a:50::10 > ff02::1:ff00:11: ICMP6, neighbor solicitation, who has 2001:db8:a:50::11, length 32',
  'IP6 2001:db8:a:50::10 > 2001:db8:a:50::11: ICMP6, echo request, id 360, seq 1, length 64',
  'IP6 2001:db8:a:50::11 > 2001:db8:a:50::10: ICMP6, neighbor advertisement, tgt is 2001:db8:a:50::11, length 32',
  '2001:db8:a:50::11 dev eth0 lladdr 02:00:c0:a8:32:0b REACHABLE',
]);
export const V6_DUAL = cap('c24-dual', [
  '$ dig +short labflow.test A',
  '203.0.113.10',
  '$ dig +short labflow.test AAAA',
  '2001:db8:d::10',
  '*   Trying [2001:db8:d::10]:80...',
  '* Established connection to labflow.test (2001:db8:d::10 port 80) from 2001:db8:a:50::10 port 58840',
]);
export const V6_HAPPY = cap('c24-happy', [
  '*   Trying [2001:db8:d::10]:80...',
  '*   Trying 203.0.113.10:80...',
  '* Established connection to labflow.test (203.0.113.10 port 80) from 192.168.50.10 port 45964',
  'connected to 203.0.113.10 after 0.210868 s',
  'curl: (28) Connection timed out after 5003 milliseconds',
  'node fetch: you came from 198.51.100.2 port 38370 after 324 ms',
  'node fetch without Happy Eyeballs: TimeoutError after 8002 ms',
]);
export const V6_BREAK = cap('c24-isp-hong', ['$ ip6tables -I FORWARD -d 2001:db8:d::/48 -j DROP']);
export const V6_LOCALHOST = cap('c24-localhost', [
  '$ getent ahosts localhost',
  '::1             STREAM localhost',
  '127.0.0.1       STREAM',
  'LISTEN 0      511        127.0.0.1:5000      0.0.0.0:*',
  "[ { address: '::1', family: 6 }, { address: '127.0.0.1', family: 4 } ]",
  'dev server on 127.0.0.1:5000',
  'node 22 fetch: dev server on 127.0.0.1:5000',
  'node without autoselect: ECONNREFUSED ::1:5000',
]);
export const V6_LISTEN = cap('c24-nghe', [
  'State  Recv-Q Send-Q Local Address:Port Peer Address:Port',
  'LISTEN 0      511          0.0.0.0:3000      0.0.0.0:*',
  'LISTEN 0      511                *:3001            *:*',
]);
export const V6_CALL = cap('c24-goi-nghe', [
  'v4-only app sees 198.51.100.2',
  'curl: (7) Failed to connect to 2001:db8:d::10 port 3000 after 0 ms: Could not connect to server',
  'dual-stack app sees ::ffff:198.51.100.2',
  'dual-stack app sees 2001:db8:a:50::10',
]);

// ───────────────────────── 2.5 BGP ─────────────────────────
export const BGP_SUMMARY = cap('c25-isp', [
  'Neighbor        V         AS   MsgRcvd   MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd   PfxSnt Desc',
  '192.0.2.3       4      64510         6         6        3    0    0 00:00:55            1        3 dc (LabFlow',
  '192.0.2.66      4      64511         6         7        3    0    0 00:00:55            1        3 rogue',
]);
export const BGP_HEAD = cap('c25-isp', ['     Network          Next Hop            Metric LocPrf Weight Path'])[0];
/** `show ip bgp` (chỉ các dòng bảng) — mỗi ảnh chụp một lúc */
export const BGP_SHOW = {
  isp: cap('c25-isp', [
    ' *>  198.18.0.0/24    192.0.2.66               0             0 64511 i',
    ' *>  198.51.100.0/24  0.0.0.0                  0         32768 i',
    ' *>  203.0.113.0/24   192.0.2.3                0             0 64510 i',
  ]),
  dc: cap('c25-dc', [
    ' *>  198.18.0.0/24    192.0.2.66                             0 64500 64511 i',
    ' *>  198.51.100.0/24  192.0.2.1                0             0 64500 i',
    ' *>  203.0.113.0/24   0.0.0.0                  0         32768 i',
  ]),
  rogueHijack: cap('c25-rogue-cuop', [
    ' *>  198.18.0.0/24    0.0.0.0                  0         32768 i',
    ' *>  198.51.100.0/24  192.0.2.1                0             0 64500 i',
    ' *>  203.0.113.0/24   192.0.2.3                              0 64500 64510 i',
    ' *u  203.0.113.0/25   0.0.0.0                  0         32768 i',
  ]),
  ispHijack: cap('c25-isp-cuop', [
    ' *>  198.18.0.0/24    192.0.2.66               0             0 64511 i',
    ' *>  198.51.100.0/24  0.0.0.0                  0         32768 i',
    ' *>  203.0.113.0/24   192.0.2.3                0             0 64510 i',
    ' *>  203.0.113.0/25   192.0.2.66               0             0 64511 i',
  ]),
  ispFiltered: cap('c25-isp-loc', [
    ' *>  198.18.0.0/24    192.0.2.66               0             0 64511 i',
    ' *>  198.51.100.0/24  0.0.0.0                  0         32768 i',
    ' *>  203.0.113.0/24   192.0.2.3                0             0 64510 i',
  ]),
  ispWithdrawn: cap('c25-isp-rut', [
    ' *>  198.18.0.0/24    192.0.2.66               0             0 64511 i',
    ' *>  198.51.100.0/24  0.0.0.0                  0         32768 i',
  ]),
};
export const BGP_ISP_FIB = cap('c25-isp', [
  '198.18.0.0/24 nhid 24 via 192.0.2.66 dev ix0 proto bgp metric 20',
  '203.0.113.0/24 nhid 22 via 192.0.2.3 dev ix0 proto bgp metric 20',
]);
export const HIJACK_ROGUE_CMD = cap('c25-rogue-cuop', ['$ ip route add blackhole 203.0.113.0/25']);
export const HIJACK_FIB = cap('c25-isp-cuop', [
  '203.0.113.0/25 nhid 24 via 192.0.2.66 dev ix0 proto bgp metric 20',
  '203.0.113.0/24 nhid 22 via 192.0.2.3 dev ix0 proto bgp metric 20',
  '203.0.113.10 via 192.0.2.66 dev ix0 src 192.0.2.1 uid 0',
]);
export const HIJACK_LAPTOP = cap('c25-laptop-cuop', [
  'curl: (28) Connection timed out after 3003 milliseconds',
  ' 1  192.168.50.1  0.058 ms',
  ' 2  198.51.100.1  0.036 ms',
  ' 3  *',
  ' 4  *',
  ' 5  *',
  ';; communications error to 198.51.100.1#53: timed out',
  ';; no servers could be reached',
]);
export const HIJACK_DC_SEES = cap('c25-dc-thay', [
  'BGP routing table entry for 203.0.113.0/25, version 6',
  '  64500 64511',
  '    192.0.2.66 from 192.0.2.1 (192.0.2.1)',
]);
export const FILTER_CMD = cap('c25-isp-loc', [
  "$ vtysh -c 'configure terminal' -c 'ip prefix-list FROM-ROGUE seq 10 permit 198.18.0.0/24' -c 'router bgp 64500' -c 'address-family ipv4 unicast' -c 'neighbor 192.0.2.66 prefix-list FROM-ROGUE in' -c 'end'",
  '203.0.113.10 via 192.0.2.3 dev ix0 src 192.0.2.1 uid 0',
]);
export const FILTER_OK = cap('c25-laptop-ok', ['LabFlow edge (server 203.0.113.10)', 'you came from 198.51.100.2 port 36430']);
export const WITHDRAW_CMD = cap('c25-dc-rut', ["$ vtysh -c 'configure terminal' -c 'router bgp 64510' -c 'address-family ipv4 unicast' -c 'no network 203.0.113.0/24' -c 'end'"]);
export const WITHDRAW_ISP = cap('c25-isp-rut', ['$ ip route get 203.0.113.10', 'RTNETLINK answers: Network is unreachable', '$ ip route get 203.0.113.53', 'RTNETLINK answers: Network is unreachable']);
export const WITHDRAW_LAPTOP = cap('c25-laptop-rut', [
  ';; ->>HEADER<<- opcode: QUERY, status: REFUSED, id: 14418',
  '; EDE: 23 (Network Error)',
  'curl: (6) Could not resolve host: labflow.test',
  'curl: (7) Failed to connect to 203.0.113.10 port 80 after 0 ms: Could not connect to server',
  ' 1  192.168.50.1  0.039 ms',
  ' 2  198.51.100.1  0.027 ms !N',
]);
export const REANNOUNCE_CMD = cap('c25-dc-lai', ["$ vtysh -c 'configure terminal' -c 'router bgp 64510' -c 'address-family ipv4 unicast' -c 'network 203.0.113.0/24' -c 'end'"]);
export const REANNOUNCE_LAPTOP = cap('c25-laptop-lai', ['$ dig +short labflow.test', '203.0.113.10', 'you came from 198.51.100.2 port 57874']);
/** Internet THẬT — RIPEstat (công khai, chỉ đọc) cho cuongthai.com */
export const RIPE = cap('c25-that', [
  '160.187.1.208',
  '160.187.0.0/23 is announced by AS152992 (DATAONLINE-VN - ONLINE DATA COMPANY LIMITED)',
  'AS152992 announcing 160.187.0.0/23: valid',
  'ROA: origin AS152992, prefix 160.187.0.0/23, max length /24',
  'AS64511 announcing 160.187.0.0/23: invalid_asn',
  'AS152992 announcing 160.187.1.0/25: invalid_length',
]);
