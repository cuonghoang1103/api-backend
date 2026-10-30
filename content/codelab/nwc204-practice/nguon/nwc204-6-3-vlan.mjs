/** NWC204 · 6.3 — VLANs, access and trunk ports, 802.1Q. */
import { doiDau, KHOA, S, tinh, q, ord, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'VLAN 1 — Concepts', kho: 'EASY', phut: 8,
  en: 'What a VLAN is and what it changes.', vi: 'VLAN là gì và nó thay đổi điều gì.',
  cau: [
    q('c1', ['A VLAN creates a separate …', 'VLAN tạo ra một … riêng.'], ['broadcast domain', 'collision domain', 'physical cable', 'MAC address'], ['Broadcasts stay inside the VLAN.', 'Broadcast ở lại trong VLAN.']),
    q('c2', ['Two PCs in different VLANs on the same switch need … to talk.', 'Hai PC ở VLAN khác nhau trên cùng switch cần … để nói chuyện.'], ['a router or Layer 3 switch (inter-VLAN routing)', 'a longer cable', 'a larger MAC table', 'nothing, VLANs are transparent'], ['Different VLAN = different IP subnet = routing is required.', 'VLAN khác = mạng IP khác = cần định tuyến.']),
    q('c3', ['An access port belongs to …', 'Cổng access thuộc về …'], ['exactly one VLAN and sends untagged frames', 'all VLANs', 'no VLAN', 'two VLANs'], ['End hosts use access ports and know nothing about VLAN tags.', 'Host đầu cuối dùng cổng access và không biết gì về tag VLAN.']),
    q('c4', ['A trunk port carries …', 'Cổng trunk mang …'], ['frames of several VLANs, tagged with 802.1Q', 'only VLAN 1', 'only management traffic', 'only untagged frames'], ['The 4-byte 802.1Q tag holds the 12-bit VLAN ID.', 'Tag 802.1Q 4 byte chứa VLAN ID 12 bit.']),
    q('c5', ['The native VLAN on a trunk is …', 'Native VLAN trên trunk là …'], ['the VLAN whose frames are sent untagged', 'the VLAN with the most hosts', 'always VLAN 100', 'the management VLAN of the router'], ['Both ends must agree on the native VLAN; mismatches are a common error.', 'Hai đầu phải thống nhất native VLAN; lệch nhau là lỗi thường gặp.']),
    q('c6', ['How many usable normal-range VLAN IDs exist (IEEE 802.1Q)?', 'Có bao nhiêu VLAN ID dùng được (IEEE 802.1Q)?'], ['4094 (1–4094)', '1024', '4096', '255'], ['12 bits give 4096 values; 0 and 4095 are reserved.', '12 bit cho 4096 giá trị; 0 và 4095 bị dành riêng.']),
  ],
  goiY: ['VLAN ⇒ separate broadcast domain ⇒ separate subnet.', 'Access = one VLAN untagged; trunk = many VLANs tagged (except the native).'],
  loi: ['Thinking VLANs separate collision domains.', 'Trying to ping across VLANs without a router.'],
  tn: [tn('trunk', 'đường trục'), tn('802.1Q', 'chuẩn gắn thẻ VLAN')], kn: ['VLAN'],
});

const PORTS = { 1: { mode: 'access', vlan: 10 }, 2: { mode: 'access', vlan: 10 }, 3: { mode: 'access', vlan: 20 }, 4: { mode: 'access', vlan: 20 }, 5: { mode: 'trunk', allowed: [10, 20], native: 1 } };
const FR = [
  { src: 'A', dst: 'ff:ff:ff:ff:ff:ff', in: 1 }, { src: 'C', dst: 'ff:ff:ff:ff:ff:ff', in: 3 }, { src: 'B', dst: 'A', in: 2 },
  { src: 'S', dst: 'C', in: 5, vlan: 20 }, { src: 'T', dst: 'ff:ff:ff:ff:ff:ff', in: 5, vlan: 30 }, { src: 'A', dst: 'C', in: 1 },
];
const V = S.vlanSwitch(PORTS, FR);
const txt = (a) => (a.length ? 'ports ' + a.join(', ') : 'none (dropped / no output)');
const cfg = 'Ports 1–2 access VLAN 10, ports 3–4 access VLAN 20, port 5 trunk (allowed 10 and 20, native VLAN 1). Tables start empty.';
const cfgVi = 'Cổng 1–2 access VLAN 10, cổng 3–4 access VLAN 20, cổng 5 trunk (cho phép 10 và 20, native VLAN 1). Bảng ban đầu rỗng.';
const E2 = cs({
  ten: 'VLAN 2 — Where does the frame go?', kho: 'MEDIUM', phut: 14,
  en: cfg + ' Frames arrive in order; for each, choose the output ports (a trunk output is tagged unless the VLAN is native).', vi: cfgVi + ' Frame đến theo thứ tự; với mỗi frame, chọn các cổng ra (cổng trunk gắn tag trừ khi là native VLAN).',
  cau: FR.map((f, i) => {
    const dung = txt(V.out[i]);
    const alt = ['ports 1, 2, 3, 4, 5', 'ports 3, 4, 5(tag 20)', dung === 'none (dropped / no output)' ? 'ports 5(tag 10)' : 'none (dropped / no output)'];
    return q('c' + (i + 1), [`#${i + 1}: ${f.src} → ${f.dst === 'ff:ff:ff:ff:ff:ff' ? 'broadcast' : f.dst} arrives on port ${f.in}${f.vlan ? ' tagged VLAN ' + f.vlan : ''}`, `#${i + 1}: ${f.src} → ${f.dst === 'ff:ff:ff:ff:ff:ff' ? 'broadcast' : f.dst} tới cổng ${f.in}${f.vlan ? ' gắn tag VLAN ' + f.vlan : ''}`],
      [dung, ...alt.filter((x) => x !== dung).slice(0, 3)], ['Flooding and forwarding stay inside the frame’s VLAN; a trunk allows only listed VLANs.', 'Tràn và chuyển tiếp chỉ trong VLAN của frame; trunk chỉ cho phép VLAN trong danh sách.']);
  }),
  goiY: ['First find the frame’s VLAN: access port ⇒ its VLAN; trunk ⇒ the tag.', 'Only ports that are members of that VLAN can receive the frame.'],
  loi: ['Flooding into the other VLAN.', 'Forgetting that an unlisted VLAN on a trunk is dropped.'],
  tn: [tn('tagged', 'có gắn thẻ')], kn: ['VLAN forwarding'],
});

const E3 = tinh({
  tieuDe: 'VLAN 3 — Which port mode?', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Choose the correct port configuration for each link.', 'Chọn cấu hình cổng đúng cho từng liên kết.'),
  loai: 'table',
  bang: [bang1('b1', ['Port modes', 'Chế độ cổng'], [{ ma: 'l', ten: 'Link' }, { ma: 'm', ten: 'Mode', luaChon: ['access', 'trunk'] }],
    [['A PC in the Sales VLAN', 'access'], ['Switch-to-switch uplink carrying VLANs 10, 20 and 30', 'trunk'], ['Switch to a router sub-interface (router-on-a-stick)', 'trunk'], ['A network printer in VLAN 40', 'access'], ['Switch to a hypervisor host running VMs in VLANs 10 and 20', 'trunk']].map(([l, m]) => ({ o: { l }, a: { m: [m] } })),
    ['Hosts that belong to one VLAN use access ports. Links that must carry several VLANs (switches, routers, hypervisors) use trunks.', 'Host thuộc một VLAN dùng cổng access. Liên kết mang nhiều VLAN dùng trunk.'])],
  goiY: ['One VLAN ⇒ access; many VLANs ⇒ trunk.', 'A router-on-a-stick needs tagged traffic.'],
  loiHayGap: ['Putting a trunk on a user PC.', 'Using an access port for the uplink and losing all but one VLAN.'],
  thuatNgu: [tn('router-on-a-stick', 'router một cổng nhiều VLAN')], khaiNiem: ['port modes'],
});

const E4 = tinh({
  tieuDe: 'VLAN 4 — Order the trip across a trunk', doKho: 'MEDIUM', phut: 8,
  moTa: mt('PC A (VLAN 10, switch SW1) sends a broadcast to PC B (VLAN 10, switch SW2). Put the steps in order.', 'PC A (VLAN 10, switch SW1) gửi broadcast tới PC B (VLAN 10, switch SW2). Sắp các bước theo thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['VLAN broadcast across a trunk', 'Broadcast VLAN qua trunk'], ['A sends an untagged frame into SW1’s access port in VLAN 10', 'SW1 floods it only to VLAN 10 ports and to the trunk', 'SW1 inserts the 802.1Q tag (VLAN 10) on the trunk', 'SW2 receives the tagged frame and reads the VLAN ID', 'SW2 removes the tag and floods the frame to its VLAN 10 access ports', 'B receives an ordinary untagged frame'], ['Tags exist only on trunks; hosts never see them.', 'Tag chỉ tồn tại trên trunk; host không bao giờ thấy.'], 2)],
  goiY: ['Tag is added when leaving on a trunk, removed when leaving on an access port.', 'Flooding is restricted to the VLAN.'],
  loiHayGap: ['Believing the PC adds the tag.', 'Leaving the tag on when delivering to B.'],
  thuatNgu: [tn('tag', 'thẻ VLAN')], khaiNiem: ['802.1Q'],
});

function vlanSwitch(ports, frames) {
  var table = {}, out = [];
  for (var i = 0; i < frames.length; i++) {
    var f = frames[i], pin = ports[String(f.in)], v;
    if (pin.mode === 'access') v = pin.vlan; else v = (f.vlan === undefined || f.vlan === null) ? pin.native : f.vlan;
    if (pin.mode === 'trunk' && pin.allowed.indexOf(v) < 0) { out.push([]); continue; }
    table[v + '/' + f.src] = f.in;
    var known = table[v + '/' + f.dst], targets = [];
    var names = Object.keys(ports).sort(function (a, b) { return a - b; });
    for (var k = 0; k < names.length; k++) {
      var p = names[k], c = ports[p], member = c.mode === 'access' ? c.vlan === v : c.allowed.indexOf(v) >= 0;
      if (!member || Number(p) === Number(f.in)) continue;
      if (f.dst !== 'ff:ff:ff:ff:ff:ff' && known !== undefined && Number(p) !== Number(known)) continue;
      targets.push(c.mode === 'trunk' && v !== c.native ? p + '(tag ' + v + ')' : p);
    }
    if (known !== undefined && f.dst !== 'ff:ff:ff:ff:ff:ff' && Number(known) === Number(f.in)) targets = [];
    out.push(targets);
  }
  return { out: out, table: table };
}
const E5 = js({
  ten: 'VLAN 5 — Write vlanSwitch(ports, frames)', kho: 'HARD', phut: 25,
  en: '<p>Write <code>vlanSwitch(ports, frames)</code>. <code>ports</code> maps a port number to <code>{ mode: "access", vlan }</code> or <code>{ mode: "trunk", allowed: [...], native }</code>. <code>frames</code> are <code>{ src, dst, in, vlan? }</code> (<code>vlan</code> is the 802.1Q tag, present only on trunk ingress; untagged ⇒ native VLAN). The MAC table is kept <b>per VLAN</b> (key <code>"vlan/mac"</code>). Return <code>{ out, table }</code>: <code>out[i]</code> lists the output ports as strings sorted numerically (<code>"2"</code>, or <code>"5(tag 10)"</code> for a trunk when the VLAN is not the native one). A frame on a trunk with a VLAN not in <code>allowed</code> is dropped (<code>[]</code>, not learned). Broadcast or unknown destination ⇒ flood to all member ports except ingress; known ⇒ only that port; known on the ingress port ⇒ nothing.</p>',
  vi: '<p>Viết <code>vlanSwitch(ports, frames)</code>. <code>ports</code> ánh xạ số cổng sang <code>{ mode: "access", vlan }</code> hoặc <code>{ mode: "trunk", allowed: [...], native }</code>. <code>frames</code> là <code>{ src, dst, in, vlan? }</code> (<code>vlan</code> là tag 802.1Q, chỉ có khi vào cổng trunk; không tag ⇒ native VLAN). Bảng MAC giữ <b>riêng theo VLAN</b> (khoá <code>"vlan/mac"</code>). Trả <code>{ out, table }</code>: <code>out[i]</code> liệt kê cổng ra dạng chuỗi sắp theo số (<code>"2"</code>, hoặc <code>"5(tag 10)"</code> cho trunk khi VLAN khác native). Frame vào trunk có VLAN không nằm trong <code>allowed</code> bị loại (<code>[]</code>, không học). Broadcast hoặc đích chưa biết ⇒ tràn tới mọi cổng thành viên trừ cổng vào; đã biết ⇒ chỉ cổng đó; biết nằm trên cổng vào ⇒ không gửi gì.</p>',
  fn: 'vlanSwitch', params: 'ports, frames', ref: vlanSwitch,
  cases: [[PORTS, FR], [PORTS, [{ src: 'A', dst: 'ff:ff:ff:ff:ff:ff', in: 1 }]], [PORTS, [{ src: 'S', dst: 'ff:ff:ff:ff:ff:ff', in: 5 }]], [PORTS, [{ src: 'A', dst: 'B', in: 1 }, { src: 'B', dst: 'A', in: 2 }, { src: 'A', dst: 'B', in: 1 }]], [PORTS, [{ src: 'A', dst: 'C', in: 1 }, { src: 'C', dst: 'A', in: 3 }]], [{ 1: { mode: 'trunk', allowed: [1, 5], native: 5 }, 2: { mode: 'access', vlan: 5 }, 3: { mode: 'trunk', allowed: [1], native: 1 } }, [{ src: 'X', dst: 'ff:ff:ff:ff:ff:ff', in: 2 }, { src: 'Y', dst: 'ff:ff:ff:ff:ff:ff', in: 1, vlan: 1 }]]],
  goiY: ['Compute the frame VLAN first, then drop it if the trunk does not allow it.', 'A port is a member of VLAN v if it is access in v or a trunk allowing v.'],
  loi: ['Sharing one MAC table across VLANs.', 'Tagging frames that leave on the native VLAN.'],
  gt: ['Per-VLAN tables let two VLANs reuse the same MAC without clashes, and the allowed list is what keeps a rogue VLAN off a trunk.', 'Bảng riêng theo VLAN cho phép hai VLAN dùng lại cùng MAC; danh sách allowed giữ VLAN lạ khỏi trunk.'],
  kn: ['VLAN', 'trunk'],
});

const E6 = cs({
  ten: 'VLAN 6 — Troubleshoot', kho: 'HARD', phut: 12,
  en: 'Diagnose the VLAN fault.', vi: 'Chẩn đoán lỗi VLAN.',
  cau: [
    q('c1', ['PCs in VLAN 10 on two different switches cannot reach each other; each switch’s VLAN 10 PCs reach each other fine. First check …', 'PC VLAN 10 trên hai switch khác nhau không nói chuyện được; PC cùng switch thì ổn. Kiểm tra đầu tiên …'], ['that the trunk allows VLAN 10 on both ends', 'the IP addresses of the PCs', 'the DNS server', 'the PCs’ cables'], ['show interfaces trunk reveals the allowed VLAN list.', 'show interfaces trunk cho thấy danh sách VLAN được phép.']),
    q('c2', ['“%CDP-4-NATIVE_VLAN_MISMATCH” appears. The cause is …', '“%CDP-4-NATIVE_VLAN_MISMATCH” xuất hiện. Nguyên nhân là …'], ['the two ends of a trunk use different native VLANs', 'a duplicate IP address', 'a wrong DNS entry', 'an STP loop'], ['Mismatched native VLANs leak traffic between VLANs.', 'Lệch native VLAN làm lọt lưu lượng giữa các VLAN.']),
    q('c3', ['A PC plugged into a port still gets no IP from the DHCP server in its VLAN. The port was configured as a trunk. Fix?', 'PC cắm vào cổng không nhận IP từ DHCP của VLAN. Cổng đang cấu hình trunk. Cách sửa?'], ['Make the port an access port in the right VLAN', 'Change the PC’s MAC address', 'Add more VLANs to the trunk', 'Reboot the DHCP server'], ['End devices need access ports.', 'Thiết bị đầu cuối cần cổng access.']),
    q('c4', ['You deleted VLAN 30 from the VLAN database but ports 20–24 still use it. The ports …', 'Bạn xoá VLAN 30 khỏi cơ sở dữ liệu VLAN nhưng cổng 20–24 vẫn gán nó. Các cổng …'], ['become inactive until the VLAN is recreated or the ports reassigned', 'move to VLAN 1 automatically', 'work as before', 'turn into trunks'], ['Cisco keeps the assignment but the ports stop forwarding.', 'Cisco giữ gán nhưng cổng ngừng chuyển.']),
  ],
  goiY: ['Same switch OK, different switch broken ⇒ look at the trunk.', 'Think access vs trunk for every port.'],
  loi: ['Looking at IP addressing first when only cross-switch traffic fails.', 'Deleting a VLAN without moving its ports.'],
  tn: [tn('native VLAN mismatch', 'lệch native VLAN')], kn: ['VLAN troubleshooting'],
});

void tinh; void ord;
export default doiDau({ slug: 'nwc204-6-3-vlan', ten: '6.3 VLANs and trunking', khoa: KHOA, baiHoc: 'nwc204-ch6-quiz', de: [E1, E2, E3, E4, E5, E6] });
