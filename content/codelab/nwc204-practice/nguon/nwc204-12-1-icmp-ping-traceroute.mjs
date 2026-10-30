/** NWC204 · 12.1 — ICMP, ping and traceroute. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'ICMP 1 — Messages and what they mean', kho: 'EASY', phut: 8,
  en: 'Read ICMP types and ping/traceroute output.', vi: 'Đọc các kiểu ICMP và kết quả ping/traceroute.',
  cau: [
    q('c1', ['ICMP echo request (type 8) and echo reply (type 0) are used by …', 'ICMP echo request (type 8) và echo reply (type 0) được dùng bởi …'], ['ping', 'traceroute only', 'DNS', 'ARP'], ['Ping tests reachability and round-trip time.', 'Ping kiểm tra khả năng tới được và thời gian khứ hồi.']),
    q('c2', ['A router discards a packet because its TTL reached 0. It sends …', 'Router huỷ gói vì TTL về 0. Nó gửi …'], ['ICMP Time Exceeded (type 11)', 'ICMP Echo Reply', 'ICMP Redirect', 'TCP RST'], ['Traceroute exploits exactly this reply.', 'Traceroute khai thác đúng phản hồi này.']),
    q('c3', ['“Destination host unreachable” from your own gateway usually means …', '“Destination host unreachable” từ chính gateway thường nghĩa là …'], ['the router has no route or cannot ARP the host', 'DNS failed', 'the TTL expired in transit', 'the web server is down'], ['Destination Unreachable (type 3) comes from the router that cannot deliver.', 'Destination Unreachable (type 3) do router không chuyển được gửi về.']),
    q('c4', ['“Request timed out” in ping means …', '“Request timed out” trong ping nghĩa là …'], ['no reply came within the timeout (down, filtered, or lost)', 'the host replied with an error', 'DNS is slow', 'the TTL is too large'], ['A firewall that drops ICMP looks the same as a dead host.', 'Firewall chặn ICMP trông giống host chết.']),
    q('c5', ['Each traceroute probe uses a TTL that is …', 'Mỗi gói dò của traceroute dùng TTL …'], ['increased by one each time, starting at 1', 'always 255', 'random', 'decreased from 30'], ['TTL 1 reaches hop 1, TTL 2 hop 2 and so on.', 'TTL 1 tới chặng 1, TTL 2 tới chặng 2…']),
  ],
  goiY: ['Time Exceeded = TTL ran out; Unreachable = cannot deliver.', 'No answer does not prove the host is down.'],
  loi: ['Treating “request timed out” as proof the host is off.', 'Thinking traceroute sends ICMP errors itself.'],
  tn: [tn('round-trip time', 'thời gian khứ hồi')], kn: ['ICMP'],
});

const P1 = ['10.0.0.1', '172.16.0.1', '203.0.113.9', '8.8.8.8'];
const tr = (path, silent) => S.traceroute(path, silent, 8);
const E2 = tinh({
  tieuDe: 'ICMP 2 — Read a traceroute', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Path to 8.8.8.8: ' + P1.join(' → ') + '. The router at hop 3 does not answer ICMP (it shows “*”). Fill in what each TTL prints.', 'Đường tới 8.8.8.8: ' + P1.join(' → ') + '. Router ở chặng 3 không trả lời ICMP (hiện “*”). Điền kết quả in ra ứng với mỗi TTL.'),
  loai: 'table',
  bang: [bang1('b1', ['Traceroute lines', 'Dòng traceroute'], [{ ma: 't', ten: 'TTL' }, { ma: 'r', ten: 'Printed address' }],
    tr(P1, [2]).map((line, i) => ({ o: { t: String(i + 1) }, a: { r: [line.split(' ')[1]] } })),
    [tr(P1, [2]).join(' | ') + '. The destination answers the last probe with an Echo Reply / Port Unreachable.', 'Đích trả lời gói dò cuối bằng Echo Reply / Port Unreachable.'])],
  goiY: ['Probe n expires at router n.', 'A silent router prints * but the trace continues.'],
  loiHayGap: ['Stopping the trace at the first *.', 'Counting the destination as a router.'],
  thuatNgu: [tn('hop', 'chặng')], khaiNiem: ['traceroute'],
});

const E3 = js({
  ten: 'ICMP 3 — Write traceroute(path, silent, maxTtl)', kho: 'MEDIUM', phut: 15,
  en: '<p>Simulate traceroute. <code>path</code> lists the hop addresses (the last one is the destination), <code>silent</code> is an array of hop indexes (0-based) that never reply, <code>maxTtl</code> the highest TTL tried. Return one line per TTL as <code>"&lt;ttl&gt; &lt;address or *&gt;"</code>, stopping right after the destination answers. If the path is shorter than a TTL (because the destination was silent or unreachable) print <code>"&lt;ttl&gt; *"</code> until <code>maxTtl</code>.</p>',
  vi: '<p>Mô phỏng traceroute. <code>path</code> liệt kê địa chỉ các chặng (cuối cùng là đích), <code>silent</code> là mảng chỉ số chặng (từ 0) không bao giờ trả lời, <code>maxTtl</code> là TTL cao nhất thử. Trả mỗi TTL một dòng <code>"&lt;ttl&gt; &lt;địa chỉ hoặc *&gt;"</code>, dừng ngay sau khi đích trả lời. Nếu đường ngắn hơn TTL (vì đích im lặng hoặc không tới được) in <code>"&lt;ttl&gt; *"</code> cho tới <code>maxTtl</code>.</p>',
  fn: 'traceroute', params: 'path, silent, maxTtl', ref: S.traceroute,
  cases: [[P1, [2], 8], [P1, [], 8], [P1, [3], 6], [['1.1.1.1'], [], 5], [P1, [0, 1], 4], [[], [], 3]],
  goiY: ['Loop ttl from 1 to maxTtl; the router at index ttl − 1 answers.', 'If the destination (last index) answers, stop.'],
  loi: ['Continuing after the destination replied.', 'Printing the address of a silent hop.'],
  gt: ['A silent last hop makes traceroute run to maxTtl, which is why firewalls produce lines of asterisks.', 'Chặng cuối im lặng khiến traceroute chạy tới maxTtl, vì thế firewall cho ra cả dòng dấu sao.'],
  kn: ['traceroute'],
});

void tinh;
export default doiDau({ slug: 'nwc204-12-1-icmp-ping-traceroute', ten: '12.1 ICMP, ping and traceroute', khoa: KHOA, baiHoc: 'nwc204-12-2-ping-traceroute-va-lab-2-3', de: [E1, E2, E3] });
