/** NWC204 · LAB chương 15 — Bộ định tuyến biên: ACL ra ngoài + PAT. */
import { doiDau, KHOA, S, bi, js, dat } from './_nw.mjs';

const ACL = [
  'access-list 120 deny tcp 192.168.1.0 0.0.0.255 any eq 23',
  'access-list 120 deny ip host 192.168.1.99 any',
  'access-list 120 permit tcp 192.168.1.0 0.0.0.255 any eq www',
  'access-list 120 permit tcp 192.168.1.0 0.0.0.255 any eq https',
  'access-list 120 permit udp 192.168.1.0 0.0.0.255 any eq domain',
];
const PK = [
  { proto: 'tcp', src: '192.168.1.10', sport: 51000, dst: '93.184.216.34', dport: 443 },
  { proto: 'tcp', src: '192.168.1.11', sport: 51000, dst: '93.184.216.34', dport: 443 },
  { proto: 'tcp', src: '192.168.1.10', sport: 51000, dst: '93.184.216.34', dport: 443 },
  { proto: 'tcp', src: '192.168.1.10', sport: 51001, dst: '93.184.216.34', dport: 23 },
  { proto: 'udp', src: '192.168.1.12', sport: 5353, dst: '8.8.8.8', dport: 53 },
  { proto: 'tcp', src: '192.168.1.99', sport: 40000, dst: '1.1.1.1', dport: 80 },
  { proto: 'icmp', src: '192.168.1.10', dst: '8.8.8.8' },
  { proto: 'tcp', src: '192.168.1.10', sport: 51002, dst: '93.184.216.34', dport: 80 },
];

function edgeRouter(cfg, packets) {
  const verdicts = S.aclRun(cfg.acl, packets);
  const map = {}; let next = cfg.startPort;
  return packets.map((p, i) => {
    const v = verdicts[i];
    if (v.action !== 'permit') return { action: 'deny', rule: v.rule, translated: null };
    const k = p.proto + '|' + p.src + ':' + p.sport;
    if (map[k] === undefined) map[k] = next++;
    return { action: 'permit', rule: v.rule, translated: cfg.pubIp + ':' + map[k] };
  });
}
const CFG = { acl: ACL, pubIp: '203.0.113.1', startPort: 50000 };

const SOL_MAIN = `
function edgeRouter(cfg, packets) {
  var verdicts = aclRun(cfg.acl, packets), map = {}, next = cfg.startPort;
  return packets.map(function (p, i) {
    var v = verdicts[i];
    if (v.action !== 'permit') return { action: 'deny', rule: v.rule, translated: null };
    var k = p.proto + '|' + p.src + ':' + p.sport;
    if (map[k] === undefined) map[k] = next++;
    return { action: 'permit', rule: v.rule, translated: cfg.pubIp + ':' + map[k] };
  });
}
`;

const LAB = js({
  ten: 'Lab 15 — The edge router: outbound ACL then PAT', kho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  en: `<p><b>Scenario.</b> The edge router of a small office filters outbound traffic with an extended ACL and then hides the LAN behind one public address (PAT). Write <code>edgeRouter(cfg, packets)</code>:</p>
<ol>
<li><code>cfg = { acl, pubIp, startPort }</code>. <code>acl</code> is an array of Cisco lines (<code>permit|deny proto src [eq sport] dst [eq dport]</code>, address specs <code>any</code>, <code>host x</code>, <code>x wildcard</code>; port names www 80, https 443, domain 53, telnet 23, ssh 22, ftp 21, smtp 25). The ACL is checked first; the first matching line decides, otherwise implicit deny (<code>rule 0</code>).</li>
<li>Only <b>permitted</b> packets are translated: the flow (proto, source IP, source port) gets the next public port (<code>startPort</code>, +1 …) the first time it is seen; a repeated flow keeps its port. Denied packets consume no port.</li>
<li>Return one entry per packet: <code>{ action, rule, translated }</code> where <code>translated</code> is <code>"pubIp:port"</code> or <code>null</code> when denied. (Packets such as ICMP have no source port: treat the port as undefined — they still get a translation if permitted.)</li>
</ol>
<p>You may reuse the ACL interpreter you wrote in 15.1: the lab is about combining two mechanisms in the right order.</p>`,
  vi: `<p><b>Tình huống.</b> Router biên của một văn phòng nhỏ lọc lưu lượng đi ra bằng ACL mở rộng rồi giấu LAN sau một địa chỉ công cộng (PAT). Viết <code>edgeRouter(cfg, packets)</code>:</p>
<ol>
<li><code>cfg = { acl, pubIp, startPort }</code>. <code>acl</code> là mảng dòng Cisco (<code>permit|deny proto src [eq sport] dst [eq dport]</code>, đặc tả địa chỉ <code>any</code>, <code>host x</code>, <code>x wildcard</code>; tên cổng www 80, https 443, domain 53, telnet 23, ssh 22, ftp 21, smtp 25). ACL được kiểm trước; dòng khớp đầu tiên quyết định, không khớp thì implicit deny (<code>rule 0</code>).</li>
<li>Chỉ gói <b>được phép</b> mới được dịch: luồng (proto, IP nguồn, cổng nguồn) nhận cổng công cộng kế tiếp (<code>startPort</code>, +1 …) lần đầu thấy; luồng lặp giữ cổng. Gói bị chặn không tốn cổng.</li>
<li>Trả một phần tử cho mỗi gói: <code>{ action, rule, translated }</code> với <code>translated</code> là <code>"pubIp:port"</code> hoặc <code>null</code> nếu bị chặn. (Gói như ICMP không có cổng nguồn: coi cổng là undefined — nếu được phép vẫn được dịch.)</li>
</ol>
<p>Bạn có thể dùng lại bộ thông dịch ACL đã viết ở 15.1: bài lab nằm ở việc ghép hai cơ chế đúng thứ tự.</p>`,
  yc: [bi('Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'), bi('A helper such as aclRun may be pasted into answer.js.', 'Có thể dán hàm phụ như aclRun vào answer.js.')],
  fn: 'edgeRouter', params: 'cfg, packets', ref: edgeRouter,
  cases: [[CFG, PK], [{ ...CFG, startPort: 1024, pubIp: '198.51.100.7' }, PK.slice(0, 3)], [CFG, [PK[3], PK[5]]], [CFG, []], [{ ...CFG, acl: ['permit ip any any'] }, PK], [{ ...CFG, acl: [] }, PK.slice(0, 2)], [{ ...CFG, startPort: 65000 }, [PK[0], PK[1], PK[7], PK[4]]]],
  giaiMaTay: '// Reference solution (needs the ACL interpreter from lesson 15.1)\n' + dat(S.aclRun, 'aclRun') + '\n' + SOL_MAIN,
  goiY: ['First compute the ACL verdict for every packet (reuse your aclRun), then do the translation pass in order.', 'Key the translation map by proto|src:sport and increment the port counter only for new permitted flows.', 'Denied packets must return translated: null and must not change the counter.'],
  loi: ['Translating before the ACL check (ports get wasted on denied packets).', 'Using the destination in the flow key.', 'Allocating a new port for every permitted packet instead of per flow.'],
  gt: ['Real routers also apply ACL and NAT in a fixed order (outbound: route, ACL, then NAT, depending on direction and platform); getting the order wrong is a classic cause of “the rule works but the NAT does not”.', 'Router thật cũng áp ACL và NAT theo thứ tự cố định (chiều ra: định tuyến, ACL rồi NAT, tuỳ chiều và nền tảng); sai thứ tự là nguyên nhân kinh điển của “luật chạy mà NAT không chạy”.'],
  kn: ['ACL', 'PAT', 'edge router'],
});

export default doiDau({ slug: 'nwc204-15-lab-edge-router', ten: 'Lab 15 — Edge router: ACL + PAT', khoa: KHOA, baiHoc: 'nwc204-ch15-quiz', de: [LAB] });
