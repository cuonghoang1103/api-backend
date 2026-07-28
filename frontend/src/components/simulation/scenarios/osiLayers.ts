/**
 * Mạng · NWC203c — chồng giao thức: mỗi tầng bọc thêm một lớp phong bì.
 *
 * Mô hình bảy tầng OSI thường bị dạy như một danh sách cần học thuộc, và học
 * thuộc xong thì vẫn không biết dùng để làm gì. Kịch bản này bỏ hẳn cách đó và
 * đi theo một câu hỏi cụ thể: khi bạn bấm gửi một tin nhắn 12 byte, thứ thật
 * sự chạy trên dây điện là bao nhiêu byte, và gồm những gì?
 *
 * Câu trả lời: 12 byte dữ liệu được bọc thêm ba lớp tiêu đề, thành 66 byte.
 * Mỗi lớp do một tầng thêm vào, và mỗi lớp giải quyết đúng một vấn đề:
 *
 *   TCP  — tới đúng ỨNG DỤNG nào (cổng), đúng thứ tự, không mất.
 *   IP   — tới đúng MÁY nào trên toàn cầu.
 *   Ethernet — tới đúng THIẾT BỊ kế bên trong mạng nội bộ.
 *
 * Điểm đắt giá của mô hình phân tầng nằm ở chỗ: mỗi tầng chỉ đọc phong bì của
 * chính mình và không cần biết gì về nội dung bên trong. Nhờ vậy Wi-Fi thay
 * được cáp mà TCP không đổi một dòng, và HTTPS chạy được trên mọi loại đường
 * truyền đã có lẫn chưa phát minh ra.
 */

import { Layers } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const CODE = [
  '// Bạn gửi đúng 12 byte',
  'socket.write("Chào bạn!");',
  '',
  '// Trên dây điện thật sự chạy 66 byte:',
  '//   14  Ethernet',
  '//   20  IP',
  '//   20  TCP',
  '//   12  dữ liệu của bạn',
];

const PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Bạn gửi 12 byte', en: 'You send 12 bytes' },
    file: 'app.js',
    x: 0,
    y: 0,
    w: 470,
    h: 244,
    lines: CODE,
  },
  {
    id: 'wire',
    kind: 'table',
    title: { vi: 'Byte thật sự trên dây', en: 'The actual bytes on the wire' },
    hint: { vi: 'phong bì ngoài cùng được đọc trước', en: 'the outermost envelope is read first' },
    x: 0,
    y: 256,
    w: 470,
    h: 304,
    accent: '#38bdf8',
    columns: [
      { key: 'l', label: 'lớp', flex: 1 },
      { key: 'b', label: 'nội dung', flex: 1.4 },
    ],
  },
  {
    id: 'stack',
    kind: 'lanes',
    title: { vi: 'Bốn tầng thực dụng', en: 'The four practical layers' },
    hint: { vi: 'mỗi tầng chỉ đọc phong bì của mình', en: 'each layer reads only its own envelope' },
    x: 482,
    y: 0,
    w: 518,
    h: 330,
    accent: '#a78bfa',
    layout: 'rows',
    lanes: [
      { id: 'app', label: 'Ứng dụng', sub: { vi: 'HTTP · WebSocket', en: 'HTTP · WebSocket' }, accent: '#34d399' },
      { id: 'tcp', label: 'Giao vận', sub: { vi: 'TCP — tới đúng ứng dụng', en: 'TCP — to the right app' }, accent: '#38bdf8' },
      { id: 'ip', label: 'Mạng', sub: { vi: 'IP — tới đúng máy', en: 'IP — to the right machine' }, accent: '#f59e0b' },
      { id: 'eth', label: 'Liên kết', sub: { vi: 'Ethernet — tới máy kế bên', en: 'Ethernet — to the next device' }, accent: '#f472b6' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Log' },
    file: 'tcpdump',
    x: 482,
    y: 342,
    w: 518,
    h: 218,
    accent: '#34d399',
    maxLines: 5,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const row = (id: string, l: string, b: string, tone: Tone): PanelOp => ({
  p: 'wire',
  op: 'push',
  item: { id, label: l, cells: [l, b], tone },
});
const wipeWire = (): PanelOp => ({ p: 'wire', op: 'clear' });
const lay = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'stack',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipeLane = (lane: string): PanelOp => ({ p: 'stack', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — ĐÓNG GÓI ĐI XUỐNG ───────────────────────────────────── */

function buildDown(): SimStep[] {
  const { steps, push } = collector();

  push(
    'data',
    { vi: 'Ứng dụng chỉ biết 12 byte của nó', en: 'The application knows only its 12 bytes' },
    {
      vi: 'Mã của bạn gọi `socket.write` và coi như đã xong việc. Nó không biết gì về cổng, địa chỉ IP hay card mạng — và đó chính là điều mà phân tầng mang lại: mỗi tầng chỉ cần biết đúng phần việc của mình.',
      en: 'Your code calls `socket.write` and considers the job done. It knows nothing about ports, IP addresses or network cards — and that is exactly what layering buys: each layer only needs to know its own concern.',
    },
    2600,
    [
      lines([1, 2]),
      lay('app', 'a1', '"Chào bạn!"', '12 byte', 'ok'),
      row('w1', 'dữ liệu', '"Chào bạn!" · 12B', 'ok'),
      out('ứng dụng: 12 byte', 'muted')
    ],
    { sfx: 'click' }
  );

  push(
    'tcp',
    { vi: 'TCP bọc lớp đầu: 20 byte để biết tới ỨNG DỤNG nào', en: 'TCP wraps first: 20 bytes to reach the right APPLICATION' },
    {
      vi: 'Tiêu đề TCP mang cổng nguồn và cổng đích — đây là thứ phân biệt tin nhắn này với gói của trình duyệt đang chạy cùng máy. Nó còn mang số thứ tự và số xác nhận, tức toàn bộ bộ máy giữ đúng thứ tự và không mất gói mà bài "cửa sổ trượt" đã nói.',
      en: 'The TCP header carries source and destination ports — this is what distinguishes this message from the browser’s packets on the same machine. It also carries sequence and acknowledgement numbers, the entire ordering-and-reliability machinery covered in the sliding window scenario.',
    },
    3000,
    [
      lines([7]),
      lay('tcp', 't1', 'cổng 51000 → 443', 'seq · ack · cờ', 'info'),
      wipeWire(),
      row('w2', 'TCP', 'cổng 51000 → 443 · 20B', 'info'),
      row('w3', 'dữ liệu', '"Chào bạn!" · 12B', 'ok'),
      out('+20B TCP → tổng 32B', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'ip',
    { vi: 'IP bọc tiếp: 20 byte để biết tới MÁY nào', en: 'IP wraps next: 20 bytes to reach the right MACHINE' },
    {
      vi: 'Tiêu đề IP mang địa chỉ nguồn và đích, cùng bộ đếm TTL. Chú ý IP hoàn toàn không đọc phần TCP bên trong — với nó, cả khối 32 byte kia chỉ là "hàng hoá cần chuyển". Nhờ sự không-cần-biết ấy mà UDP hay QUIC dùng chung được đúng tầng IP này.',
      en: 'The IP header carries source and destination addresses plus the TTL counter. Note that IP never reads the TCP part inside — to it, those 32 bytes are simply "cargo to deliver". That deliberate ignorance is what lets UDP and QUIC reuse this very same IP layer.',
    },
    3000,
    [
      lines([6]),
      lay('ip', 'i1', '192.168.1.5 → 93.184.216.34', 'TTL 64', 'warn'),
      wipeWire(),
      row('w4', 'IP', '192.168.1.5 → 93.184… · 20B', 'warn'),
      row('w5', 'TCP', 'cổng 51000 → 443 · 20B', 'info'),
      row('w6', 'dữ liệu', '"Chào bạn!" · 12B', 'ok'),
      out('+20B IP → tổng 52B', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'eth',
    { vi: 'Ethernet bọc ngoài cùng: 14 byte để tới máy KẾ BÊN', en: 'Ethernet wraps outermost: 14 bytes to reach the NEXT device' },
    {
      vi: 'Tiêu đề Ethernet mang địa chỉ MAC nguồn và đích — mà đích ở đây là ROUTER NHÀ, không phải máy chủ ở xa. Đây là chỗ hay nhầm nhất: địa chỉ IP là đích cuối cùng, còn địa chỉ MAC chỉ là chặng kế tiếp, và nó bị thay mới ở MỖI chặng trong khi IP giữ nguyên suốt hành trình.',
      en: 'The Ethernet header carries source and destination MAC addresses — and the destination here is the HOME ROUTER, not the distant server. This is the most common confusion: the IP address is the final destination, while the MAC is merely the next hop, and it is replaced at EVERY hop while the IP stays unchanged throughout.',
    },
    3200,
    [
      lines([5]),
      lay('eth', 'e1', 'MAC máy → MAC router', 'đổi mới ở mỗi chặng', 'err'),
      wipeWire(),
      row('w7', 'Ethernet', 'MAC → MAC router · 14B', 'err'),
      row('w8', 'IP', '192.168.1.5 → 93.184… · 20B', 'warn'),
      row('w9', 'TCP', 'cổng 51000 → 443 · 20B', 'info'),
      row('wa', 'dữ liệu', '"Chào bạn!" · 12B', 'ok'),
      out('+14B Ethernet → tổng 66B', 'err'),
    ],
    {
      sfx: 'stream',
      teachingNote: {
        vi: 'Điểm chốt: IP giữ nguyên cả hành trình, MAC bị thay ở TỪNG chặng.',
        en: 'The key point: the IP stays the whole way, the MAC is replaced at EVERY hop.',
      },
    }
  );

  push(
    'overhead',
    { vi: '12 byte dữ liệu, 54 byte tiêu đề — và đó là chuyện bình thường', en: '12 bytes of data, 54 of headers — and that is normal' },
    {
      vi: 'Tiêu đề chiếm 82% gói tin. Với tin nhắn ngắn thì tỉ lệ này luôn tệ, nên gửi nhiều gói bé là rất lãng phí — đây chính là lý do đằng sau thuật toán Nagle, và cũng là lý do gộp nhiều thao tác vào một request lại đáng giá. Với gói đầy 1500 byte thì tiêu đề chỉ còn 3,6%.',
      en: 'Headers are 82% of the packet. For short messages this ratio is always bad, so sending many tiny packets is deeply wasteful — the very reason Nagle’s algorithm exists, and why batching operations into one request pays off. On a full 1500-byte packet the headers are just 3.6%.',
    },
    3100,
    [out('54B tiêu đề / 66B tổng = 82% chi phí bao bì', 'err'), out('gói đầy 1500B → tiêu đề chỉ 3,6%', 'ok')],
    { sfx: 'buzz' }
  );

  return steps;
}

/* ── B — MỞ GÓI ĐI LÊN ───────────────────────────────────────── */

function buildUp(): SimStep[] {
  const { steps, push } = collector();

  push(
    'arrive',
    { vi: 'Bên nhận: mở phong bì theo thứ tự ngược lại', en: 'At the receiver: envelopes open in reverse order' },
    {
      vi: '66 byte tới card mạng của máy chủ. Nó bóc lớp Ethernet trước — kiểm MAC đích có phải mình không, đúng thì bỏ 14 byte đó đi và đưa phần còn lại lên tầng trên. Mỗi tầng lột đúng phong bì của mình rồi chuyển tiếp, không đụng vào lớp sâu hơn.',
      en: 'Sixty-six bytes reach the server’s network card. It strips Ethernet first — checking whether the destination MAC is its own, and if so discarding those 14 bytes and passing the rest upward. Each layer removes exactly its own envelope and forwards, never touching deeper ones.',
    },
    2800,
    [
      row('u1', 'Ethernet', 'MAC khớp → bóc bỏ', 'err'),
      lay('eth', 'r1', 'nhận 66B', 'kiểm MAC đích', 'err'),
      out('bóc Ethernet · còn 52B', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'unip',
    { vi: 'Tầng IP: kiểm địa chỉ, kiểm tổng, rồi bóc tiếp', en: 'The IP layer: check the address, the checksum, then strip' },
    {
      vi: 'IP xác nhận địa chỉ đích đúng là mình, kiểm tra mã kiểm tổng để loại gói hỏng dọc đường, rồi nhìn trường "giao thức" để biết bên trong là TCP hay UDP mà giao lên đúng chỗ. Chú ý IP không hề quan tâm nội dung — nó chỉ đọc nhãn ghi trên phong bì của nó.',
      en: 'IP confirms the destination is itself, verifies the checksum to discard packets corrupted in transit, then reads the "protocol" field to know whether TCP or UDP is inside and hand it to the right place. Note IP never inspects the payload — it only reads the label on its own envelope.',
    },
    2900,
    [
      row('u2', 'IP', 'địa chỉ khớp · giao thức = TCP', 'warn'),
      lay('ip', 'r2', 'còn 52B', 'giao lên TCP', 'warn'),
      out('bóc IP · còn 32B · đưa cho TCP', 'muted'),
    ],
    { sfx: 'blip' }
  );

  push(
    'untcp',
    { vi: 'Tầng TCP: nhìn cổng đích để biết giao cho tiến trình nào', en: 'The TCP layer: the destination port picks the process' },
    {
      vi: 'Cổng 443 dẫn tới tiến trình đang lắng nghe ở đó. TCP còn dùng số thứ tự để xếp gói đúng chỗ trong dòng byte — nếu gói này tới sớm hơn một gói trước đó thì nó phải nằm chờ trong bộ đệm. Xong xuôi mới đánh thức ứng dụng.',
      en: 'Port 443 identifies the process listening there. TCP also uses the sequence number to place this packet correctly in the byte stream — if it arrived ahead of an earlier one it waits in a buffer. Only then is the application woken.',
    },
    3000,
    [
      row('u3', 'TCP', 'cổng 443 → tiến trình nginx', 'info'),
      lay('tcp', 'r3', 'còn 32B', 'xếp theo seq', 'info'),
      out('bóc TCP · còn 12B · cổng 443', 'muted'),
    ],
    { sfx: 'blip' }
  );

  push(
    'app',
    { vi: 'Ứng dụng nhận đúng 12 byte đã gửi', en: 'The application receives exactly the 12 bytes sent' },
    {
      vi: 'Không thừa, không thiếu, không sai thứ tự. Toàn bộ 54 byte tiêu đề đã hoàn thành nhiệm vụ và biến mất. Ứng dụng bên nhận cũng không biết gì về MAC, IP hay cổng — hoàn toàn đối xứng với bên gửi.',
      en: 'Nothing extra, nothing missing, nothing out of order. All 54 header bytes did their job and vanished. The receiving application knows nothing about MACs, IPs or ports either — perfectly symmetric with the sender.',
    },
    2900,
    [
      wipeWire(),
      row('u4', 'dữ liệu', '"Chào bạn!" · 12B', 'ok'),
      lay('app', 'r4', '"Chào bạn!"', 'đúng 12 byte ban đầu', 'ok'),
      out('ứng dụng nhận: "Chào bạn!"', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'swap',
    { vi: 'Giá trị thật của phân tầng: thay một tầng, các tầng khác không đổi', en: 'Layering’s real payoff: replace one layer, the rest stay put' },
    {
      vi: 'Đổi cáp mạng sang Wi-Fi là thay hẳn tầng liên kết — mà TCP, IP và ứng dụng không đổi một dòng nào. Đổi IPv4 sang IPv6 thì TCP vẫn nguyên. Đó là lý do Internet sống được năm mươi năm qua bao nhiêu thế hệ phần cứng: mỗi tầng được phép tiến hoá riêng, miễn giữ đúng giao diện với hai tầng kề.',
      en: 'Swapping cable for Wi-Fi replaces the entire link layer — while TCP, IP and the application change not one line. Move from IPv4 to IPv6 and TCP is untouched. This is how the Internet has survived fifty years across generations of hardware: each layer may evolve on its own, as long as it keeps its interface to the two beside it.',
    },
    3100,
    [
      wipeLane('eth'),
      lay('eth', 'r5', 'Wi-Fi thay Ethernet', 'ba tầng trên: 0 dòng sửa', 'ok'),
      out('đổi Wi-Fi ↔ cáp · TCP/IP/app không đổi', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

export const osiLayersScenario: Scenario = {
  id: 'osi-layers',
  name: { vi: 'Chồng giao thức — mỗi tầng một lớp phong bì', en: 'The protocol stack — one envelope per layer' },
  tagline: {
    vi: 'Bạn gửi 12 byte, trên dây chạy 66 byte: 54 byte kia là ba lớp tiêu đề TCP, IP và Ethernet. Địa chỉ IP giữ nguyên cả hành trình, còn địa chỉ MAC bị thay mới ở từng chặng.',
    en: 'You send 12 bytes; 66 travel the wire. The other 54 are three header layers — TCP, IP and Ethernet. The IP address survives the whole journey while the MAC is replaced at every hop.',
  },
  icon: Layers,
  accent: '#a78bfa',
  group: 'network',
  lesson: {
    course: 'computer-networking',
    subject: 'NWC203c',
    code: '1.1',
    slug: 'nwc203c-1-1-phan-tang',
    title: { vi: 'Mạng, dịch vụ & mô hình phân tầng', en: 'Networks, services & the layered model' },
  },
  nodes: [],
  edges: [],
  panels: PANELS,
  options: [
    {
      id: 'view',
      label: { vi: 'Chiều nào', en: 'Which direction' },
      defaultValue: 'down',
      choices: [
        {
          value: 'down',
          label: 'Đóng gói đi xuống',
          fullLabel: '12 byte thành 66 byte',
          color: '#38bdf8',
          hint: { vi: 'tiêu đề chiếm 82% gói', en: 'headers are 82% of the packet' },
        },
        {
          value: 'up',
          label: 'Mở gói đi lên',
          fullLabel: 'Bóc từng phong bì ở bên nhận',
          color: '#34d399',
          hint: { vi: 'đổi Wi-Fi, TCP không đổi dòng nào', en: 'swap to Wi-Fi, TCP unchanged' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'up' ? buildUp() : buildDown()),
};
