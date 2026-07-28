/**
 * Mạng · NWC203c — cửa sổ trượt, mất gói và điều khiển tắc nghẽn.
 *
 * Sau khi bắt tay xong, câu hỏi tiếp theo là: gửi bao nhiêu byte thì dừng lại
 * chờ xác nhận? Hai thái cực đều sai:
 *
 *   Gửi một gói rồi chờ ACK  — an toàn tuyệt đối, nhưng với RTT 100ms thì
 *       thông lượng tối đa chỉ khoảng 14 KB/giây, bất kể đường truyền 1 Gbps.
 *   Gửi hết sức có thể       — làm ngập bộ đệm của bên nhận hoặc của router
 *       ở giữa, gói rơi hàng loạt, và mọi thứ còn tệ hơn.
 *
 * TCP giải quyết bằng một cửa sổ trượt, và nó phải đồng thời tôn trọng HAI
 * giới hạn khác nhau: bên nhận xử lý được bao nhiêu (điều khiển luồng), và
 * đường truyền ở giữa chịu được bao nhiêu (điều khiển tắc nghẽn). Cái thứ hai
 * khó hơn nhiều, vì không ai báo cho bạn biết đường đang tắc — TCP phải SUY RA
 * từ việc gói bị mất.
 */

import { Gauge } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const CODE = [
  '// Đường truyền 1 Gbps, RTT = 100ms',
  '',
  '// A. gửi 1 gói rồi chờ ACK',
  '//    1.460 byte / 0,1s = 14 KB/giây',
  '//    dùng hết 0,01% băng thông',
  '',
  '// B. cửa sổ 64 KB',
  '//    64 KB / 0,1s = 640 KB/giây · gấp 45 lần',
];

const PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Vì sao cần cửa sổ', en: 'Why a window is needed' },
    file: 'tcp',
    x: 0,
    y: 0,
    w: 470,
    h: 244,
    lines: CODE,
  },
  {
    id: 'win',
    kind: 'meter',
    title: { vi: 'Cửa sổ tắc nghẽn (số gói được phép bay)', en: 'Congestion window (packets allowed in flight)' },
    hint: { vi: 'tăng khi thuận lợi, tụt mạnh khi mất gói', en: 'grows when clear, collapses on loss' },
    x: 0,
    y: 256,
    w: 470,
    h: 304,
    accent: '#f59e0b',
    meters: [
      { id: 'cwnd', label: 'cwnd', max: 64, unit: 'gói', threshold: 32, thresholdLabel: 'ngưỡng', accent: '#38bdf8' },
    ],
  },
  {
    id: 'flow',
    kind: 'lanes',
    title: { vi: 'Gói trên đường', en: 'Packets in flight' },
    x: 482,
    y: 0,
    w: 518,
    h: 316,
    accent: '#34d399',
    layout: 'rows',
    lanes: [
      { id: 'sent', label: 'đã gửi', sub: { vi: 'chờ ACK', en: 'awaiting ACK' }, accent: '#94a3b8' },
      { id: 'ackd', label: 'đã xác nhận', sub: { vi: 'tới nơi an toàn', en: 'safely delivered' }, accent: '#34d399' },
      { id: 'lost', label: 'mất', sub: { vi: 'phải gửi lại', en: 'must be resent' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Log' },
    file: 'tcp',
    x: 482,
    y: 328,
    w: 518,
    h: 232,
    accent: '#a78bfa',
    maxLines: 6,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const cwnd = (value: number, label: string, tone: Tone): PanelOp => ({ p: 'win', op: 'value', key: 'cwnd', value, label, tone });
const pk = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'flow',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipeFlow = (lane: string): PanelOp => ({ p: 'flow', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — CỬA SỔ TRƯỢT ────────────────────────────────────────── */

function buildWindow(): SimStep[] {
  const { steps, push } = collector();

  push(
    'stop',
    { vi: 'Gửi một gói rồi chờ: dùng hết 0,01% đường truyền', en: 'Send one, then wait: 0.01% of the link used' },
    {
      vi: 'Mỗi gói tối đa 1.460 byte dữ liệu. Gửi xong chờ ACK mất một RTT, tức 100ms. Vậy thông lượng là 14 KB mỗi giây — trên một đường 1 Gbps. Đường truyền gần như trống rỗng suốt thời gian chờ, và không có cách nào cải thiện bằng cách mua thêm băng thông.',
      en: 'Each packet carries at most 1,460 bytes. Sending one and awaiting its ACK costs a full RTT, 100ms. That yields 14 KB per second — on a 1 Gbps link. The wire sits essentially empty throughout the wait, and no amount of extra bandwidth changes it.',
    },
    2800,
    [
      lines([3, 4, 5]),
      cwnd(1, '1 gói', 'err'),
      pk('sent', 'p1', 'gói #1', 'chờ ACK 100ms', 'warn'),
      out('14 KB/giây trên đường 1 Gbps', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'slide',
    { vi: 'Cửa sổ trượt: gửi nhiều gói trước khi cần ACK', en: 'The sliding window: send many packets before needing an ACK' },
    {
      vi: 'Bên nhận công bố nó chứa được bao nhiêu byte chưa xử lý — đó là cửa sổ nhận. Bên gửi được phép có bấy nhiêu byte "đang bay" cùng lúc. Với cửa sổ 64 KB và RTT 100ms, thông lượng lên 640 KB/giây, gấp 45 lần mà không đổi gì ở đường truyền.',
      en: 'The receiver advertises how many unprocessed bytes it can hold — the receive window. The sender may keep that many bytes "in flight" at once. With a 64 KB window and 100ms RTT, throughput reaches 640 KB/s, forty-five times more with no change to the link.',
    },
    3000,
    [
      lines([7, 8]),
      wipeFlow('sent'),
      cwnd(8, '8 gói cùng bay', 'ok'),
      pk('sent', 'p2', 'gói #1..#8', 'cùng trên đường', 'info'),
      out('cửa sổ 64KB → 640 KB/giây', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'flowctl',
    { vi: 'Giới hạn thứ nhất: bên nhận xử lý kịp không', en: 'Limit one: can the receiver keep up' },
    {
      vi: 'Nếu ứng dụng bên nhận đọc chậm, bộ đệm đầy dần và cửa sổ công bố nhỏ lại. Bằng 0 thì bên gửi phải dừng hẳn — gọi là điều khiển luồng. Đây là cơ chế rõ ràng và dễ hiểu, vì bên nhận NÓI THẲNG ra nó chịu được bao nhiêu trong mỗi gói ACK.',
      en: 'If the receiving application reads slowly its buffer fills and the advertised window shrinks. At zero the sender must stop entirely — this is flow control. It is the straightforward mechanism, because the receiver states outright how much it can take in every ACK.',
    },
    2900,
    [
      pk('ackd', 'a1', 'ACK · win=32KB', 'bên nhận báo còn chỗ', 'ok'),
      cwnd(16, 'cửa sổ 32KB', 'warn'),
      out('bên nhận công bố win=32KB → bên gửi giảm theo', 'info'),
    ],
    { sfx: 'ping' }
  );

  push(
    'congestion',
    { vi: 'Giới hạn thứ hai khó hơn nhiều: đường ở giữa', en: 'Limit two is much harder: the path in between' },
    {
      vi: 'Bên nhận có thể thoải mái mà router giữa đường vẫn nghẽn. Và không router nào gửi cho bạn một thông báo "tôi đang quá tải" — nó chỉ lặng lẽ vứt gói khi bộ đệm đầy. Nên TCP phải SUY RA tình trạng đường truyền từ việc gói mất, chứ không được ai báo cho.',
      en: 'The receiver may have plenty of room while a router along the path is congested. And no router sends you a "I am overloaded" message — it silently drops packets when its buffer fills. So TCP must INFER the path’s condition from lost packets, with nobody telling it anything.',
    },
    3000,
    [out('router giữa đường tắc → lặng lẽ vứt gói, không báo ai', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'bdp',
    { vi: 'Cửa sổ lý tưởng: đúng bằng lượng dữ liệu "chứa" được trên đường', en: 'The ideal window: exactly what the path can hold' },
    {
      vi: 'Nhân băng thông với RTT ra tích băng thông–độ trễ: đường 1 Gbps với RTT 100ms "chứa" khoảng 12,5 MB đang bay. Cửa sổ nhỏ hơn thì bỏ phí đường truyền; lớn hơn thì chỉ làm đầy bộ đệm router và tăng độ trễ chứ không nhanh thêm. Đây là lý do đường dài băng thông cao cần bật cửa sổ mở rộng.',
      en: 'Multiply bandwidth by RTT for the bandwidth–delay product: a 1 Gbps link at 100ms RTT "holds" about 12.5 MB in flight. A smaller window wastes the link; a larger one merely fills router buffers and adds latency without going faster. This is why long fat paths need window scaling enabled.',
    },
    3100,
    [cwnd(48, '≈ tích băng thông × RTT', 'ok'), out('1 Gbps × 100ms = 12,5 MB đang bay', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — MẤT GÓI ─────────────────────────────────────────────── */

function buildLoss(): SimStep[] {
  const { steps, push } = collector();

  push(
    'grow',
    { vi: 'Khởi đầu chậm: cửa sổ tăng gấp đôi mỗi vòng', en: 'Slow start: the window doubles every round trip' },
    {
      vi: 'TCP không biết đường chịu được bao nhiêu nên nó dò: bắt đầu từ vài gói, mỗi vòng khứ hồi trót lọt thì gấp đôi. Tên gọi "khởi đầu chậm" gây hiểu lầm — nó tăng theo cấp số nhân, và rất nhanh. Cái chậm là điểm XUẤT PHÁT, không phải tốc độ tăng.',
      en: 'TCP does not know what the path can bear, so it probes: start at a few packets and double every successful round trip. The name "slow start" misleads — the growth is exponential and rapid. What is slow is the STARTING POINT, not the rate of increase.',
    },
    2800,
    [
      cwnd(2, '2 gói', 'muted'),
      pk('ackd', 'g1', 'vòng 1 · 2 gói', 'đều tới nơi', 'ok'),
      pk('ackd', 'g2', 'vòng 2 · 4 gói', 'đều tới nơi', 'ok'),
      out('2 → 4 → 8 → 16 · gấp đôi mỗi RTT', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'loss',
    { vi: 'Một gói rơi — và bên nhận không thể im lặng bỏ qua', en: 'A packet drops — and the receiver cannot just skip it' },
    {
      vi: 'Gói #7 bị router vứt. Gói #8, #9, #10 vẫn tới, nhưng TCP phải giao dữ liệu ĐÚNG THỨ TỰ nên chúng bị giữ lại trong bộ đệm, không đưa lên ứng dụng được. Bên nhận ACK lại số cũ để nói "tôi vẫn đang chờ #7".',
      en: 'Packet #7 is dropped by a router. Packets #8, #9 and #10 still arrive, but TCP must deliver bytes IN ORDER, so they sit in a buffer and cannot reach the application. The receiver re-ACKs the old number, saying "still waiting for #7".',
    },
    3000,
    [
      cwnd(16, '16 gói', 'warn'),
      pk('lost', 'l1', 'gói #7', 'router vứt', 'err'),
      pk('sent', 'l2', '#8 #9 #10', 'tới nơi nhưng phải chờ #7', 'warn'),
      out('ACK 7 · ACK 7 · ACK 7  ← lặp lại', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là head-of-line blocking: gói tới rồi vẫn không dùng được vì thiếu gói trước.',
        en: 'This is head-of-line blocking: packets have arrived yet are unusable while one is missing.',
      },
    }
  );

  push(
    'fast',
    { vi: 'Ba ACK trùng nhau = tín hiệu mất gói, gửi lại ngay', en: 'Three duplicate ACKs = a loss signal, retransmit at once' },
    {
      vi: 'Bên gửi thấy ba ACK giống hệt nhau thì hiểu ngay: #7 mất, còn đường vẫn thông vì các gói sau vẫn tới được. Nó gửi lại #7 mà KHÔNG đợi hết giờ chờ. Đây là truyền lại nhanh, và nó là khác biệt lớn giữa TCP hiện đại với bản gốc.',
      en: 'Seeing three identical ACKs, the sender concludes: #7 is lost, but the path still works since later packets got through. It resends #7 WITHOUT waiting for a timeout. This is fast retransmit, and it is a major difference between modern TCP and the original.',
    },
    3000,
    [
      pk('sent', 'l3', 'gửi lại #7', 'không đợi hết giờ', 'ok'),
      out('3 dup ACK → truyền lại nhanh gói #7', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'halve',
    { vi: 'Và cửa sổ bị cắt một nửa — TCP tự lùi lại', en: 'And the window is halved — TCP backs off on its own' },
    {
      vi: 'Mất gói được hiểu là dấu hiệu đường đang tắc, nên bên gửi tự giảm cửa sổ xuống một nửa rồi tăng lại chậm rãi, mỗi vòng thêm một gói thay vì gấp đôi. Hình răng cưa quen thuộc của TCP sinh ra từ đây. Điểm đáng nói: KHÔNG AI ra lệnh cho nó giảm — mỗi bên gửi tự nguyện nhường, và chính sự tự nguyện đó giữ cho Internet không sụp.',
      en: 'Loss is read as congestion, so the sender halves its window and then grows slowly, one packet per round trip instead of doubling. TCP’s familiar sawtooth comes from this. Worth noting: NOBODY orders it to back off — every sender yields voluntarily, and that voluntary yielding is what keeps the Internet standing.',
    },
    3100,
    [
      cwnd(8, '16 → 8 gói', 'warn'),
      out('cwnd giảm nửa · rồi tăng tuyến tính (+1/RTT)', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'wifi',
    { vi: 'Cái bẫy: TCP mặc định mọi mất gói đều do tắc nghẽn', en: 'The trap: TCP assumes every loss means congestion' },
    {
      vi: 'Giả định đó đúng với cáp, nhưng sai với Wi-Fi và 4G — nơi gói mất vì nhiễu sóng chứ chẳng có ai tắc cả. TCP vẫn cắt nửa cửa sổ, làm chậm hẳn một kết nối vốn đang thoải mái. Đây là lý do có những thuật toán mới như BBR đo trực tiếp băng thông và độ trễ thay vì suy đoán từ mất gói.',
      en: 'That assumption holds on cable but fails on Wi-Fi and 4G, where packets are lost to interference with no congestion at all. TCP halves the window anyway, throttling a connection that was perfectly fine. This is why newer algorithms like BBR measure bandwidth and delay directly instead of inferring from loss.',
    },
    3100,
    [out('Wi-Fi nhiễu → mất gói → TCP tưởng tắc → giảm tốc oan', 'err'), out('BBR: đo băng thông + RTT thật thay vì đoán', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

export const tcpWindowScenario: Scenario = {
  id: 'tcp-window',
  name: { vi: 'Cửa sổ trượt — gửi bao nhiêu thì dừng lại chờ', en: 'The sliding window — how much to send before waiting' },
  tagline: {
    vi: 'Gửi một gói rồi chờ ACK thì đường 1 Gbps chỉ đạt 14 KB/giây. Cửa sổ 64 KB đưa lên 640 KB/giây — gấp 45 lần mà không đổi gì ở đường truyền.',
    en: 'Send one packet and wait for its ACK and a 1 Gbps link delivers 14 KB/s. A 64 KB window makes it 640 KB/s — forty-five times more, with nothing changed on the wire.',
  },
  icon: Gauge,
  accent: '#34d399',
  group: 'network',
  nodes: [],
  edges: [],
  panels: PANELS,
  options: [
    {
      id: 'view',
      label: { vi: 'Phần nào', en: 'Which part' },
      defaultValue: 'window',
      choices: [
        {
          value: 'window',
          label: 'Cửa sổ trượt',
          fullLabel: 'Vì sao chờ từng gói là thảm hoạ',
          color: '#34d399',
          hint: { vi: '14 KB/s so với 640 KB/s', en: '14 KB/s vs 640 KB/s' },
        },
        {
          value: 'loss',
          label: 'Mất gói & tắc nghẽn',
          fullLabel: 'Ba ACK trùng, và cửa sổ cắt nửa',
          color: '#f43f5e',
          hint: { vi: 'Wi-Fi làm TCP giảm tốc oan', en: 'Wi-Fi makes TCP throttle for nothing' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'loss' ? buildLoss() : buildWindow()),
};
