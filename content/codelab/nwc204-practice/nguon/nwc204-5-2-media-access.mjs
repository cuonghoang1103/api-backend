/** NWC204 · 5.2 — Topologies, duplex and media access control. */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Access 1 — Topologies and duplex', kho: 'EASY', phut: 8,
  en: 'Physical vs logical topology, half and full duplex.', vi: 'Topology vật lý và logic, bán song công và song công.',
  cau: [
    q('c1', ['A modern switched Ethernet LAN is physically a … and logically behaves like …', 'LAN Ethernet có switch hiện nay về vật lý là … và về logic hoạt động như …'], ['star; a set of point-to-point links', 'bus; a shared cable', 'ring; token passing', 'mesh; full routing'], ['Every device has its own cable to the switch.', 'Mỗi thiết bị có cáp riêng tới switch.']),
    q('c2', ['In half-duplex a device …', 'Ở chế độ bán song công, thiết bị …'], ['can send or receive, but not both at once', 'can send and receive at the same time', 'can only send', 'can only receive'], ['Half-duplex needs collision handling (CSMA/CD).', 'Bán song công cần xử lý va chạm (CSMA/CD).']),
    q('c3', ['Full-duplex links between a host and a switch …', 'Liên kết song công giữa host và switch …'], ['have no collisions, so CSMA/CD is turned off', 'still need CSMA/CD', 'work only on fibre', 'share the bandwidth between send and receive'], ['Separate transmit and receive pairs remove the collision possibility.', 'Cặp truyền và nhận tách biệt loại bỏ va chạm.']),
    q('c4', ['A hub is a layer 1 device, so all its ports are in …', 'Hub là thiết bị tầng 1 nên mọi cổng của nó nằm trong …'], ['one collision domain', 'separate collision domains', 'separate VLANs', 'separate subnets'], ['A hub repeats every signal to all ports.', 'Hub lặp mọi tín hiệu ra tất cả cổng.']),
    q('c5', ['Which topology has a single point of failure at the centre?', 'Topology nào có điểm hỏng duy nhất ở trung tâm?'], ['Star', 'Full mesh', 'Partial mesh', 'Dual ring'], ['If the centre switch fails, every spoke is isolated.', 'Switch trung tâm hỏng thì mọi nhánh bị cô lập.']),
  ],
  goiY: ['Physical = how it is cabled; logical = how data flows.', 'Full duplex + switch = no collisions.'],
  loi: ['Saying a switch makes the LAN a bus.', 'Mixing up collision domains with broadcast domains.'],
  tn: [tn('collision domain', 'miền va chạm'), tn('duplex', 'song công')], kn: ['topology', 'duplex'],
});

const SC = [
  ['Classic shared coaxial Ethernet, half duplex', 'CSMA/CD'], ['Wi-Fi access point and laptops', 'CSMA/CA'], ['Host cabled to a switch port, full duplex', 'None (no contention)'], ['Old token ring LAN', 'Token passing'],
];
const E2 = tinh({
  tieuDe: 'Access 2 — Which access method?', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Choose the media access control method used in each scenario.', 'Chọn phương pháp điều khiển truy cập đường truyền dùng trong từng tình huống.'),
  loai: 'table',
  bang: [bang1('b1', ['Access method', 'Phương pháp truy cập'], [{ ma: 's', ten: 'Scenario' }, { ma: 'm', ten: 'Method', luaChon: ['CSMA/CD', 'CSMA/CA', 'Token passing', 'None (no contention)'] }],
    SC.map(([s, m]) => ({ o: { s }, a: { m: [m] } })),
    ['Wired half-duplex Ethernet detects collisions (CD); wireless cannot detect them so it avoids them (CA); a full-duplex switch link has none; token ring uses a token.', 'Ethernet bán song công có dây phát hiện va chạm (CD); không dây không phát hiện được nên tránh (CA); liên kết song công với switch không có va chạm; token ring dùng token.'])],
  goiY: ['Can the station hear a collision while it transmits? Wired yes, wireless no.', 'Contention methods only matter on shared media.'],
  loiHayGap: ['Using CSMA/CD for Wi-Fi.', 'Applying contention methods to a full-duplex switch link.'],
  thuatNgu: [tn('CSMA/CD', 'đa truy cập cảm nhận sóng mang, phát hiện va chạm'), tn('CSMA/CA', '… tránh va chạm')], khaiNiem: ['MAC methods'],
});

const E3 = tinh({
  tieuDe: 'Access 3 — Order the CSMA/CD procedure', doKho: 'MEDIUM', phut: 8,
  moTa: mt('A half-duplex Ethernet station wants to send a frame and a collision happens. Put the steps in order.', 'Một trạm Ethernet bán song công muốn gửi frame và xảy ra va chạm. Sắp các bước theo thứ tự.'),
  loai: 'order',
  cauHoi: [ord('q1', ['CSMA/CD', 'CSMA/CD'], ['Listen: is the medium idle?', 'Transmit the frame while listening', 'A collision is detected', 'Send a jam signal so everybody notices', 'Wait a random backoff time', 'Try again (up to 16 attempts)'], ['Carrier sense, transmit, collision detect, jam, random backoff, retry.', 'Nghe sóng mang, phát, phát hiện va chạm, tín hiệu jam, chờ ngẫu nhiên, thử lại.'], 3)],
  goiY: ['“Listen before talk, listen while talk.”', 'The random backoff comes after the jam.'],
  loiHayGap: ['Retransmitting immediately after the collision.', 'Putting the jam before the detection.'],
  thuatNgu: [tn('backoff', 'thời gian chờ lùi'), tn('jam signal', 'tín hiệu báo va chạm')], khaiNiem: ['CSMA/CD'],
});

const E4 = cs({
  ten: 'Access 4 — Count the domains', kho: 'HARD', phut: 12,
  en: 'Count collision and broadcast domains (switch ports are separate collision domains; a hub joins all its ports into one; only routers or VLANs split broadcast domains).', vi: 'Đếm miền va chạm và miền broadcast (mỗi cổng switch là một miền va chạm; hub gộp mọi cổng của nó thành một; chỉ router hoặc VLAN mới chia miền broadcast).',
  cau: [
    mcNum('c1', ['One 8-port switch with 8 PCs, no VLAN. Collision domains = ?', 'Một switch 8 cổng với 8 PC, không VLAN. Số miền va chạm = ?'], 8, [1, 9, 4], null, ['Each switch port is its own collision domain.', 'Mỗi cổng switch là một miền va chạm.']),
    mcNum('c2', ['The same switch, no VLAN. Broadcast domains = ?', 'Cùng switch đó, không VLAN. Số miền broadcast = ?'], 1, [8, 2, 0], null, ['A switch forwards broadcasts out of every port.', 'Switch chuyển broadcast ra mọi cổng.']),
    mcNum('c3', ['A switch has 4 PCs on 4 ports and a hub on a fifth port with 3 PCs. Collision domains = ?', 'Switch có 4 PC trên 4 cổng và một hub trên cổng thứ năm với 3 PC. Số miền va chạm = ?'], 5, [8, 4, 1], null, ['4 switch-port domains + 1 domain for the hub link and its 3 PCs = 5.', '4 miền của cổng switch + 1 miền của liên kết hub cùng 3 PC = 5.']),
    mcNum('c4', ['A router joins 3 switches, each with 5 PCs. Broadcast domains = ?', 'Một router nối 3 switch, mỗi switch 5 PC. Số miền broadcast = ?'], 3, [1, 15, 18], null, ['Each router interface starts a new broadcast domain.', 'Mỗi giao diện router mở một miền broadcast mới.']),
    mcNum('c5', ['One switch carries 3 VLANs (no router). Broadcast domains = ?', 'Một switch có 3 VLAN (không router). Số miền broadcast = ?'], 3, [1, 2, 0], null, ['One broadcast domain per VLAN.', 'Mỗi VLAN một miền broadcast.']),
  ],
  goiY: ['Switch ports split collision domains; routers and VLANs split broadcast domains.', 'A hub merges collision domains.'],
  loi: ['Counting switch ports as separate broadcast domains.', 'Counting each hub port as a separate collision domain.'],
  tn: [tn('broadcast domain', 'miền broadcast')], kn: ['domains'],
});

export default doiDau({ slug: 'nwc204-5-2-media-access', ten: '5.2 Topologies and media access control', khoa: KHOA, baiHoc: 'nwc204-5-2-topo-mang-va-dieu-khien-truy-cap', de: [E1, E2, E3, E4] });
