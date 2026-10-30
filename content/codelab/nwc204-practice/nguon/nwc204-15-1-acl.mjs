/** NWC204 · 15.1 — Access control lists. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'ACL 1 — How an ACL works', kho: 'EASY', phut: 8,
  en: 'Concepts of Cisco access control lists.', vi: 'Khái niệm danh sách kiểm soát truy cập Cisco.',
  cau: [
    q('c1', ['A packet is checked against ACL lines …', 'Gói được so với các dòng ACL …'], ['from the top, stopping at the first match', 'in random order', 'from the bottom', 'all lines, then majority vote'], ['Order matters: put specific lines before general ones.', 'Thứ tự quan trọng: dòng cụ thể trước dòng chung.']),
    q('c2', ['If no line matches, the packet is …', 'Nếu không dòng nào khớp, gói bị …'], ['denied (implicit deny any at the end)', 'permitted', 'logged only', 'sent to the default route'], ['Add “permit ip any any” if the intention is to block only some traffic.', 'Thêm “permit ip any any” nếu chỉ muốn chặn một phần lưu lượng.']),
    q('c3', ['Standard ACLs (1–99) filter on …', 'ACL chuẩn (1–99) lọc theo …'], ['source IP address only', 'source and destination plus ports', 'MAC address', 'URL'], ['Extended ACLs (100–199) match protocol, source, destination and ports.', 'ACL mở rộng (100–199) khớp giao thức, nguồn, đích và cổng.']),
    q('c4', ['Where should an extended ACL normally be placed?', 'ACL mở rộng thường đặt ở đâu?'], ['As close to the source as possible', 'As close to the destination as possible', 'On the DNS server', 'On every switch port'], ['Drop unwanted traffic early. Standard ACLs go near the destination.', 'Chặn sớm lưu lượng không mong muốn. ACL chuẩn đặt gần đích.']),
    q('c5', ['In an ACL a wildcard mask bit 0 means …', 'Trong ACL, bit 0 của wildcard mask nghĩa là …'], ['the bit must match', 'the bit is ignored', 'the bit must be 1', 'the bit is inverted'], ['0.0.0.255 matches a whole /24.', '0.0.0.255 khớp cả một /24.']),
    q('c6', ['An ACL does nothing until it is …', 'ACL không có tác dụng cho tới khi được …'], ['applied to an interface in a direction (in or out)', 'saved to flash with copy running-config', 'copied to every switch of the same VLAN', 'given a name or a number between 1 and 99'], ['“ip access-group 101 in” on the interface.', '“ip access-group 101 in” trên giao diện.']),
  ],
  goiY: ['First match wins; implicit deny at the end.', 'Extended near the source, standard near the destination.'],
  loi: ['Putting “permit ip any any” first.', 'Writing the subnet mask instead of the wildcard mask.'],
  tn: [tn('implicit deny', 'từ chối ngầm'), tn('wildcard mask', 'mặt nạ wildcard')], kn: ['ACL'],
});

const ACL1 = [
  'access-list 101 deny tcp 192.168.10.0 0.0.0.255 any eq 23',
  'access-list 101 permit tcp 192.168.10.0 0.0.0.255 any eq www',
  'access-list 101 deny ip host 192.168.10.99 any',
  'access-list 101 permit ip 192.168.10.0 0.0.0.255 10.0.0.0 0.255.255.255',
];
const P1 = [
  { proto: 'tcp', src: '192.168.10.5', dst: '203.0.113.9', dport: 23 },
  { proto: 'tcp', src: '192.168.10.5', dst: '203.0.113.9', dport: 80 },
  { proto: 'tcp', src: '192.168.10.99', dst: '203.0.113.9', dport: 80 },
  { proto: 'udp', src: '192.168.10.5', dst: '10.1.2.3', dport: 53 },
  { proto: 'udp', src: '192.168.10.5', dst: '8.8.8.8', dport: 53 },
  { proto: 'tcp', src: '192.168.20.5', dst: '203.0.113.9', dport: 80 },
];
const R1 = S.aclRun(ACL1, P1);
const lbl = (r) => (r.rule === 0 ? 'implicit deny' : 'line ' + r.rule);
const E2 = tinh({
  tieuDe: 'ACL 2 — Permit or deny?', doKho: 'MEDIUM', phut: 14,
  moTa: mt('ACL 101 is applied inbound on the LAN interface:<pre>' + ACL1.map((l, i) => `${i + 1}  ${l.replace('access-list 101 ', '')}`).join('\n') + '</pre>For each packet say whether it is permitted or denied, and which line decides it (or “implicit deny”).', 'ACL 101 áp dụng chiều vào trên giao diện LAN:<pre>' + ACL1.map((l, i) => `${i + 1}  ${l.replace('access-list 101 ', '')}`).join('\n') + '</pre>Với mỗi gói, cho biết được phép hay bị chặn và dòng nào quyết định (hoặc “implicit deny”).'),
  loai: 'table',
  bang: [bang1('b1', ['ACL decisions', 'Quyết định ACL'], [{ ma: 'p', ten: 'Packet' }, { ma: 'a', ten: 'Action', luaChon: ['permit', 'deny'] }, { ma: 'l', ten: 'Decided by', luaChon: ['line 1', 'line 2', 'line 3', 'line 4', 'implicit deny'] }],
    P1.map((p, i) => ({ o: { p: `${p.proto.toUpperCase()} ${p.src} → ${p.dst}:${p.dport}` }, a: { a: [R1[i].action], l: [lbl(R1[i])] } })),
    [P1.map((p, i) => `#${i + 1} ${R1[i].action} (${lbl(R1[i])})`).join('; ') + '. Note #3: host .99 is permitted for web by line 2 before the deny of line 3 is ever reached, so order decides.', 'Đọc từng dòng theo thứ tự; dòng khớp đầu tiên quyết định.'])],
  goiY: ['Go line by line from the top.', 'Wildcard 0.0.0.255 means the first three octets must match.'],
  loiHayGap: ['Skipping to the “most specific” line instead of the first one that matches.', 'Forgetting the implicit deny for UDP to the Internet.'],
  thuatNgu: [tn('inbound', 'chiều vào')], khaiNiem: ['ACL evaluation'],
});

const ACL2 = [
  'access-list 110 permit tcp 10.1.1.0 0.0.0.255 host 172.16.0.5 eq 443',
  'access-list 110 deny tcp 10.1.1.0 0.0.0.255 host 172.16.0.5',
  'access-list 110 permit icmp any any',
  'access-list 110 deny udp any any eq 53',
  'access-list 110 permit ip any any',
];
const P2 = [
  { proto: 'tcp', src: '10.1.1.20', dst: '172.16.0.5', dport: 443 },
  { proto: 'tcp', src: '10.1.1.20', dst: '172.16.0.5', dport: 22 },
  { proto: 'tcp', src: '10.1.2.20', dst: '172.16.0.5', dport: 22 },
  { proto: 'icmp', src: '10.1.1.20', dst: '172.16.0.5' },
  { proto: 'udp', src: '10.9.9.9', dst: '1.1.1.1', dport: 53 },
  { proto: 'tcp', src: '10.9.9.9', dst: '1.1.1.1', dport: 53 },
];
const R2 = S.aclRun(ACL2, P2);
const E3 = tinh({
  tieuDe: 'ACL 3 — A longer extended ACL', doKho: 'HARD', phut: 16,
  moTa: mt('ACL 110:<pre>' + ACL2.map((l, i) => `${i + 1}  ${l.replace('access-list 110 ', '')}`).join('\n') + '</pre>Decide each packet (“icmp” packets have no port).', 'ACL 110:<pre>' + ACL2.map((l, i) => `${i + 1}  ${l.replace('access-list 110 ', '')}`).join('\n') + '</pre>Quyết định từng gói (gói “icmp” không có cổng).'),
  loai: 'table',
  bang: [bang1('b1', ['ACL 110 decisions', 'Quyết định ACL 110'], [{ ma: 'p', ten: 'Packet' }, { ma: 'a', ten: 'Action', luaChon: ['permit', 'deny'] }, { ma: 'l', ten: 'Decided by', luaChon: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5', 'implicit deny'] }],
    P2.map((p, i) => ({ o: { p: `${p.proto.toUpperCase()} ${p.src} → ${p.dst}${p.dport ? ':' + p.dport : ''}` }, a: { a: [R2[i].action], l: [lbl(R2[i])] } })),
    [P2.map((p, i) => `#${i + 1} ${R2[i].action} (${lbl(R2[i])})`).join('; ') + '.', 'Dòng 2 chặn mọi TCP khác của mạng 10.1.1.0/24 tới server đó.'])],
  goiY: ['A deny with no port blocks every port of that protocol.', 'UDP/53 is denied but TCP/53 falls to the final permit.'],
  loiHayGap: ['Thinking line 2 only blocks port 22.', 'Applying the DNS deny to TCP too.'],
  thuatNgu: [tn('extended ACL', 'ACL mở rộng')], khaiNiem: ['extended ACL'],
});

const E4 = js({
  ten: 'ACL 4 — Write aclRun(lines, packets)', kho: 'HARD', phut: 35,
  en: '<p>Write <code>aclRun(lines, packets)</code> for Cisco-style lines. Supported syntax (optional leading <code>access-list N</code>): <code>permit|deny</code> then either an <b>extended</b> match <code>proto src [eq sport] dst [eq dport]</code> with proto in ip/tcp/udp/icmp, or a <b>standard</b> match <code>src</code>. Address specs are <code>any</code>, <code>host a.b.c.d</code>, <code>a.b.c.d wildcard</code> (a standard line may give just <code>a.b.c.d</code> = host). Port names: www/http 80, https 443, ftp 21, telnet 23, smtp 25, domain 53, ssh 22. A packet is <code>{ proto, src, dst, sport?, dport? }</code>. Return for each packet <code>{ action, rule }</code> where <code>rule</code> is the 1-based matching line or 0 for the implicit deny (<code>action "deny"</code>). Standard lines match on the source only; protocol <code>ip</code> matches everything.</p>',
  vi: '<p>Viết <code>aclRun(lines, packets)</code> cho các dòng kiểu Cisco. Cú pháp hỗ trợ (có thể có <code>access-list N</code> ở đầu): <code>permit|deny</code> rồi hoặc khớp <b>mở rộng</b> <code>proto src [eq sport] dst [eq dport]</code> với proto là ip/tcp/udp/icmp, hoặc khớp <b>chuẩn</b> <code>src</code>. Đặc tả địa chỉ là <code>any</code>, <code>host a.b.c.d</code>, <code>a.b.c.d wildcard</code> (dòng chuẩn có thể chỉ ghi <code>a.b.c.d</code> = host). Tên cổng: www/http 80, https 443, ftp 21, telnet 23, smtp 25, domain 53, ssh 22. Gói là <code>{ proto, src, dst, sport?, dport? }</code>. Với mỗi gói trả <code>{ action, rule }</code>, <code>rule</code> là số dòng khớp (từ 1) hoặc 0 cho implicit deny (<code>action "deny"</code>). Dòng chuẩn chỉ khớp theo nguồn; proto <code>ip</code> khớp mọi gói.</p>',
  fn: 'aclRun', params: 'lines, packets', ref: S.aclRun,
  cases: [[ACL1, P1], [ACL2, P2], [['access-list 10 permit 192.168.1.0 0.0.0.255'], [{ proto: 'ip', src: '192.168.2.1', dst: '1.1.1.1' }, { proto: 'ip', src: '192.168.1.77', dst: '1.1.1.1' }]], [['deny host 10.0.0.1', 'permit any'], [{ proto: 'tcp', src: '10.0.0.1', dst: '1.1.1.1', dport: 80 }, { proto: 'tcp', src: '10.0.0.2', dst: '1.1.1.1', dport: 80 }]], [['permit tcp any any eq ssh'], [{ proto: 'tcp', src: '1.2.3.4', dst: '5.6.7.8', dport: 22 }, { proto: 'tcp', src: '1.2.3.4', dst: '5.6.7.8', dport: 2222 }, { proto: 'udp', src: '1.2.3.4', dst: '5.6.7.8', dport: 22 }]], [['permit tcp 10.0.0.0 0.255.255.255 eq 1024 any'], [{ proto: 'tcp', src: '10.2.2.2', dst: '5.6.7.8', sport: 1024, dport: 80 }, { proto: 'tcp', src: '10.2.2.2', dst: '5.6.7.8', sport: 1025, dport: 80 }]], [[], [{ proto: 'ip', src: '1.1.1.1', dst: '2.2.2.2' }]]],
  goiY: ['Parse every line once into a rule object, then evaluate all packets.', 'A wildcard match is ((ip XOR base) AND NOT wildcard) === 0, using unsigned 32-bit integers.'],
  loi: ['Using the subnet mask logic instead of the wildcard.', 'Treating “eq 80” after the source as the destination port.'],
  gt: ['Reading an ACL by hand and parsing it in code are the same skill; the parser also shows why a wildcard is an inverse mask.', 'Đọc ACL bằng tay và phân tích trong mã là cùng một kỹ năng; trình phân tích cũng cho thấy vì sao wildcard là mặt nạ đảo.'],
  kn: ['ACL parsing'],
});

const E5 = cs({
  ten: 'ACL 5 — Write the right line', kho: 'HARD', phut: 12,
  en: 'Choose the ACL line (or fix) that does what the requirement says.', vi: 'Chọn dòng ACL (hoặc cách sửa) đúng yêu cầu.',
  cau: [
    q('c1', ['Block only web traffic (TCP 80) from 192.168.30.0/24 to the server 10.0.0.10. Which line?', 'Chặn riêng lưu lượng web (TCP 80) từ 192.168.30.0/24 tới server 10.0.0.10. Dòng nào?'], ['deny tcp 192.168.30.0 0.0.0.255 host 10.0.0.10 eq 80', 'deny tcp 192.168.30.0 255.255.255.0 host 10.0.0.10 eq 80', 'deny ip 192.168.30.0 0.0.0.255 host 10.0.0.10', 'deny tcp host 10.0.0.10 192.168.30.0 0.0.0.255 eq 80'], ['Wildcard, not mask; protocol tcp with eq 80 on the destination.', 'Wildcard chứ không phải mask; giao thức tcp với eq 80 ở đích.']),
    q('c2', ['After “deny tcp any any eq 23” the traffic of every other kind disappears. Why and how to fix?', 'Sau “deny tcp any any eq 23” mọi lưu lượng khác biến mất. Vì sao và sửa thế nào?'], ['The implicit deny; add “permit ip any any” at the end', 'The deny is too general; delete it', 'The ACL must be inbound', 'Telnet uses UDP'], ['An ACL with only denies blocks everything.', 'ACL chỉ có deny sẽ chặn tất cả.']),
    q('c3', ['“permit ip any any” is line 1 and “deny tcp any any eq 23” is line 2. Telnet is …', '“permit ip any any” là dòng 1 và “deny tcp any any eq 23” là dòng 2. Telnet sẽ …'], ['still permitted: line 2 is never reached', 'denied by line 2', 'logged', 'denied by the implicit deny'], ['Order matters: reorder or insert lines with sequence numbers.', 'Thứ tự quan trọng: sắp xếp lại hoặc chèn dòng bằng số thứ tự.']),
    q('c4', ['Which wildcard matches 172.16.4.0 – 172.16.7.255?', 'Wildcard nào khớp 172.16.4.0 – 172.16.7.255?'], ['0.0.3.255 with base 172.16.4.0', '0.0.7.255 with base 172.16.4.0', '0.0.4.255 with base 172.16.4.0', '0.0.0.255 with base 172.16.4.0'], ['4 consecutive /24 = a /22 → wildcard 0.0.3.255.', '4 mạng /24 liên tiếp = /22 → wildcard 0.0.3.255.']),
  ],
  goiY: ['Write the permit/deny logic in words, then the line.', 'Remember the implicit deny and the order.'],
  loi: ['Using a mask where a wildcard is expected.', 'Putting a general permit before a specific deny.'],
  tn: [tn('sequence number', 'số thứ tự dòng')], kn: ['ACL design'],
});

void tinh;
export default doiDau({ slug: 'nwc204-15-1-acl', ten: '15.1 Access control lists', khoa: KHOA, baiHoc: 'nwc204-15-2-giam-thieu-va-lam-cung-thiet-bi', de: [E1, E2, E3, E4, E5] });
