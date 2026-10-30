/** NWC204 · 6.2 — The MAC address table and how a switch forwards. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'Switch 1 — Learn, flood, filter, forward', kho: 'EASY', phut: 8,
  en: 'How a Layer 2 switch builds and uses its MAC address table.', vi: 'Switch tầng 2 xây dựng và dùng bảng địa chỉ MAC thế nào.',
  cau: [
    q('c1', ['A switch learns MAC addresses from the …', 'Switch học địa chỉ MAC từ …'], ['source MAC of incoming frames', 'destination MAC of incoming frames', 'ARP replies only', 'the DHCP server'], ['It records “source MAC → ingress port”.', 'Nó ghi “MAC nguồn → cổng vào”.']),
    q('c2', ['The destination MAC is not in the table. The switch …', 'MAC đích không có trong bảng. Switch …'], ['floods the frame out of every port except the one it came in on', 'drops the frame', 'sends it only to the gateway', 'asks the sender to retry'], ['This is called unknown-unicast flooding.', 'Đây gọi là tràn unicast chưa biết.']),
    q('c3', ['A broadcast frame (ff:ff:ff:ff:ff:ff) is …', 'Frame broadcast (ff:ff:ff:ff:ff:ff) được …'], ['always flooded within the VLAN', 'forwarded to one port', 'dropped', 'learned as a source address'], ['The broadcast address is never a source, so it is never in the table.', 'Địa chỉ broadcast không bao giờ là địa chỉ nguồn nên không có trong bảng.']),
    q('c4', ['If the destination is learned on the same port the frame arrived on, the switch …', 'Nếu đích đã học nằm trên chính cổng frame tới, switch …'], ['filters (discards) it', 'floods it', 'forwards it back', 'sends it to the router'], ['Both devices sit behind the same port (e.g. a hub), so no forwarding is needed.', 'Hai thiết bị cùng sau một cổng (vd hub) nên không cần chuyển.']),
    q('c5', ['An entry that has not been refreshed is removed after the aging time, by default …', 'Một mục không được làm mới sẽ bị xoá sau thời gian aging, mặc định …'], ['300 seconds on Cisco switches', '30 seconds', '24 hours', 'never'], ['Aging stops the table from filling with stale stations.', 'Aging tránh bảng đầy các trạm đã đi.']),
  ],
  goiY: ['Learn from the source, decide by the destination.', 'Unknown or broadcast ⇒ flood; known ⇒ one port.'],
  loi: ['Learning from the destination MAC.', 'Forwarding a frame back out of its ingress port.'],
  tn: [tn('flooding', 'tràn khung'), tn('aging', 'hết hạn mục bảng')], kn: ['MAC table'],
});

const FR = [
  { src: 'A', dst: 'B', in: 1 }, { src: 'B', dst: 'A', in: 2 }, { src: 'C', dst: 'ff:ff:ff:ff:ff:ff', in: 3 },
  { src: 'A', dst: 'C', in: 1 }, { src: 'D', dst: 'B', in: 2 }, { src: 'B', dst: 'D', in: 2 },
];
const R = S.macSwitch(FR);
const E2 = tinh({
  tieuDe: 'Switch 2 — What does the switch do with each frame?', doKho: 'MEDIUM', phut: 12,
  moTa: mt('The table starts empty. Frames arrive in the order shown (A, B, C, D are the source/destination MACs; port numbers are the ingress ports). For each frame choose: <i>flood</i>, <i>filter</i>, or <i>port N</i> (forward out of port N). Note that D and B are both behind port 2 (a hub).', 'Bảng ban đầu rỗng. Frame đến theo thứ tự cho trước (A, B, C, D là MAC nguồn/đích; số cổng là cổng vào). Với mỗi frame chọn: <i>flood</i>, <i>filter</i> hoặc <i>port N</i> (chuyển ra cổng N). Chú ý D và B cùng nằm sau cổng 2 (một hub).'),
  loai: 'table',
  bang: [bang1('b1', ['Actions', 'Hành động'], [{ ma: 'f', ten: 'Frame' }, { ma: 'a', ten: 'Action', luaChon: ['flood', 'filter', 'port 1', 'port 2', 'port 3'] }],
    FR.map((f, i) => ({ o: { f: `#${i + 1}: ${f.src} → ${f.dst === 'ff:ff:ff:ff:ff:ff' ? 'broadcast' : f.dst} arrives on port ${f.in}` }, a: { a: [R.actions[i]] } })),
    [R.actions.map((a, i) => `#${i + 1} ${a}`).join('; ') + '. The switch learns the source before deciding on the destination.', 'Switch học nguồn trước rồi mới quyết định theo đích.'])],
  goiY: ['Update the table with the source of each frame first.', 'Same-port destination ⇒ filter.'],
  loiHayGap: ['Looking up the destination before learning the source (matters for filter).', 'Flooding a frame whose destination was learned earlier.'],
  thuatNgu: [tn('ingress port', 'cổng vào')], khaiNiem: ['switch forwarding'],
});

const E3 = tinh({
  tieuDe: 'Switch 3 — The MAC table after the traffic', doKho: 'MEDIUM', phut: 8,
  moTa: mt('After the six frames of the previous set, which port does the switch list for each MAC address? Answer “none” if it is not in the table.', 'Sau sáu frame của bộ trước, bảng của switch ghi cổng nào cho từng địa chỉ MAC? Trả lời “none” nếu chưa có trong bảng.'),
  loai: 'table',
  bang: [bang1('b1', ['Final MAC table', 'Bảng MAC cuối cùng'], [{ ma: 'm', ten: 'MAC' }, { ma: 'p', ten: 'Port', luaChon: ['1', '2', '3', 'none'] }],
    ['A', 'B', 'C', 'D', 'ff:ff:ff:ff:ff:ff'].map((m) => ({ o: { m }, a: { p: [R.table[m] === undefined ? 'none' : String(R.table[m])] } })),
    ['Final table: ' + Object.entries(R.table).map(([m, p]) => `${m}→${p}`).join(', ') + '. Broadcast is never learned.', 'Broadcast không bao giờ được học.'])],
  goiY: ['Every source address is learned; destinations never are.', 'A MAC seen on a new port is updated (host moved).'],
  loiHayGap: ['Adding the broadcast address to the table.', 'Keeping the old port when a MAC moves.'],
  thuatNgu: [tn('MAC address table', 'bảng địa chỉ MAC (CAM)')], khaiNiem: ['MAC learning'],
});

const E4 = cs({
  ten: 'Switch 4 — Switching methods and symptoms', kho: 'MEDIUM', phut: 10,
  en: 'Forwarding methods and common table problems.', vi: 'Các phương pháp chuyển mạch và sự cố bảng thường gặp.',
  cau: [
    q('c1', ['Which method receives the whole frame and checks the FCS before forwarding?', 'Phương pháp nào nhận đủ frame và kiểm FCS trước khi chuyển?'], ['Store-and-forward', 'Cut-through (fast-forward)', 'Fragment-free', 'Wire-speed flooding'], ['Store-and-forward is the Cisco default; it never forwards a corrupt frame.', 'Store-and-forward là mặc định của Cisco; không bao giờ chuyển frame lỗi.']),
    q('c2', ['Cut-through switching starts forwarding after reading …', 'Chuyển mạch cut-through bắt đầu chuyển sau khi đọc …'], ['the destination MAC address', 'the whole frame', 'the first 64 bytes', 'the IP header'], ['Lowest latency, but it may forward errored frames.', 'Trễ thấp nhất nhưng có thể chuyển frame lỗi.']),
    q('c3', ['A host is moved from port 3 to port 7 and nothing reaches it for minutes. Likely reason?', 'Một host chuyển từ cổng 3 sang cổng 7 và vài phút không nhận được gì. Nguyên nhân khả dĩ?'], ['Another stale table entry still points at port 3 until it ages out or the host sends a frame', 'The switch has no flooding', 'The MAC address changed', 'The IP address expired'], ['The first frame from the host on the new port refreshes the entry.', 'Frame đầu tiên của host trên cổng mới sẽ làm mới mục bảng.']),
    q('c4', ['A MAC flooding attack tries to …', 'Tấn công MAC flooding cố …'], ['fill the CAM table so the switch floods traffic like a hub', 'steal the VLAN password', 'change the IP address', 'shut down STP'], ['Port security limits the number of MACs per port.', 'Port security giới hạn số MAC trên mỗi cổng.']),
  ],
  goiY: ['Store-and-forward trades latency for correctness.', 'Stale entries clear by aging or when the host talks.'],
  loi: ['Believing cut-through checks the FCS.', 'Thinking the table is built from ARP.'],
  tn: [tn('CAM table', 'bảng nội dung có thể địa chỉ hoá'), tn('port security', 'bảo mật cổng')], kn: ['switching methods'],
});

function macSwitch(frames) {
  var table = {}, actions = [];
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i];
    table[f.src] = f.in;
    if (f.dst === 'ff:ff:ff:ff:ff:ff' || table[f.dst] === undefined) actions.push('flood');
    else if (table[f.dst] === f.in) actions.push('filter');
    else actions.push('port ' + table[f.dst]);
  }
  return { actions: actions, table: table };
}
const E5 = js({
  ten: 'Switch 5 — Write macSwitch(frames)', kho: 'MEDIUM', phut: 15,
  en: '<p>Write <code>macSwitch(frames)</code>. <code>frames</code> is an array of <code>{ src, dst, in }</code> (<code>in</code> = ingress port). Starting with an empty table return <code>{ actions, table }</code>: <code>actions[i]</code> is <code>"flood"</code> (unknown or broadcast destination <code>ff:ff:ff:ff:ff:ff</code>), <code>"filter"</code> (destination on the ingress port) or <code>"port N"</code>; <code>table</code> maps MAC → port. Learn the source <b>before</b> deciding.</p>',
  vi: '<p>Viết <code>macSwitch(frames)</code>. <code>frames</code> là mảng <code>{ src, dst, in }</code> (<code>in</code> = cổng vào). Bắt đầu với bảng rỗng, trả <code>{ actions, table }</code>: <code>actions[i]</code> là <code>"flood"</code> (đích chưa biết hoặc broadcast <code>ff:ff:ff:ff:ff:ff</code>), <code>"filter"</code> (đích nằm trên cổng vào) hoặc <code>"port N"</code>; <code>table</code> ánh xạ MAC → cổng. Học nguồn <b>trước</b> khi quyết định.</p>',
  fn: 'macSwitch', params: 'frames', ref: macSwitch,
  cases: [[FR], [[{ src: 'A', dst: 'B', in: 1 }]], [[{ src: 'A', dst: 'A', in: 1 }]], [[{ src: 'A', dst: 'B', in: 1 }, { src: 'B', dst: 'A', in: 2 }, { src: 'A', dst: 'B', in: 3 }, { src: 'B', dst: 'A', in: 2 }]], [[]], [[{ src: 'X', dst: 'ff:ff:ff:ff:ff:ff', in: 4 }, { src: 'Y', dst: 'X', in: 5 }, { src: 'X', dst: 'Y', in: 4 }]]],
  goiY: ['Keep a plain object table; table[src] = in at the start of the loop.', 'Check broadcast before looking at the table.'],
  loi: ['Learning the destination as well.', 'Returning "filter" when the destination is on a different port.'],
  gt: ['This is the heart of every learning bridge since the 1980s.', 'Đây là lõi của mọi bridge tự học từ thập niên 1980.'],
  kn: ['MAC learning'],
});

function macSwitchAging(frames, age) {
  var table = {}, seen = {}, actions = [];
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i];
    for (var m in table) if (f.t - seen[m] > age) { delete table[m]; delete seen[m]; }
    table[f.src] = f.in; seen[f.src] = f.t;
    if (f.dst === 'ff:ff:ff:ff:ff:ff' || table[f.dst] === undefined) actions.push('flood');
    else if (table[f.dst] === f.in) actions.push('filter');
    else actions.push('port ' + table[f.dst]);
  }
  return actions;
}
const E6 = js({
  ten: 'Switch 6 — Aging out entries', kho: 'HARD', phut: 18,
  en: '<p>Extend the switch with aging. Write <code>macSwitchAging(frames, age)</code> where frames are <code>{ src, dst, in, t }</code> in time order (<code>t</code> in seconds). Before handling a frame, delete every entry whose last-seen time is more than <code>age</code> seconds before the frame’s <code>t</code> (strictly greater). Refresh the source entry’s time on every frame. Return only the <code>actions</code> array.</p>',
  vi: '<p>Mở rộng switch với aging. Viết <code>macSwitchAging(frames, age)</code> với frame là <code>{ src, dst, in, t }</code> theo thứ tự thời gian (<code>t</code> tính bằng giây). Trước khi xử lý một frame, xoá mọi mục có lần thấy cuối cách <code>t</code> của frame hơn <code>age</code> giây (lớn hơn hẳn). Làm mới thời gian của mục nguồn ở mỗi frame. Chỉ trả mảng <code>actions</code>.</p>',
  fn: 'macSwitchAging', params: 'frames, age', ref: macSwitchAging,
  cases: [[[{ src: 'A', dst: 'B', in: 1, t: 0 }, { src: 'B', dst: 'A', in: 2, t: 10 }, { src: 'A', dst: 'B', in: 1, t: 20 }], 300], [[{ src: 'A', dst: 'B', in: 1, t: 0 }, { src: 'B', dst: 'A', in: 2, t: 10 }, { src: 'A', dst: 'B', in: 1, t: 400 }], 300], [[{ src: 'A', dst: 'B', in: 1, t: 0 }, { src: 'B', dst: 'A', in: 2, t: 100 }, { src: 'A', dst: 'B', in: 1, t: 301 }], 300], [[{ src: 'A', dst: 'B', in: 1, t: 0 }, { src: 'B', dst: 'A', in: 2, t: 5 }, { src: 'A', dst: 'B', in: 1, t: 300 }], 300], [[{ src: 'A', dst: 'B', in: 1, t: 0 }, { src: 'B', dst: 'A', in: 2, t: 1 }, { src: 'C', dst: 'B', in: 3, t: 250 }, { src: 'A', dst: 'C', in: 1, t: 500 }], 300], [[], 300]],
  goiY: ['At the start of each iteration loop over the table and delete the old entries.', 'Compare with strict “>”, so an entry exactly age seconds old survives.'],
  loi: ['Not refreshing the timestamp of the source entry on every frame.', 'Using ">=" so entries expire one second early.'],
  gt: ['Aging explains the minute-long outage after moving a host: an old entry survives until a frame from the new port refreshes it.', 'Aging giải thích vì sao di chuyển host gây mất mạng cả phút: mục cũ còn đó tới khi frame từ cổng mới làm mới.'],
  kn: ['aging'],
});

void tinh;
export default doiDau({ slug: 'nwc204-6-2-mac-table', ten: '6.2 The MAC address table and forwarding', khoa: KHOA, baiHoc: 'nwc204-6-2-bang-mac-va-cach-switch-chuyen-tiep', de: [E1, E2, E3, E4, E5, E6] });
