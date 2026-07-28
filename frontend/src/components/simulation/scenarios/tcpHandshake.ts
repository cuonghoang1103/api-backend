/**
 * Mạng · NWC203c — bắt tay ba bước và bốn bước chia tay.
 *
 * TCP hứa hẹn một thứ mà IP không có: dữ liệu tới nơi ĐÚNG THỨ TỰ, KHÔNG THIẾU,
 * KHÔNG TRÙNG. IP bên dưới chỉ cố gắng chuyển gói đi và có thể làm mất, làm
 * trùng, hoặc giao lộn thứ tự. Toàn bộ độ tin cậy là do TCP dựng lên.
 *
 * Nền của lời hứa đó là SỐ THỨ TỰ, và bắt tay ba bước tồn tại chính là để hai
 * bên thống nhất số thứ tự khởi đầu của nhau trước khi gửi byte dữ liệu nào.
 * Ba bước không phải nghi thức xã giao — nó là số bước TỐI THIỂU để cả hai
 * cùng biết chắc rằng bên kia đã nhận được số của mình.
 *
 * Phần đóng kết nối cần bốn bước vì TCP là song công: mỗi chiều đóng riêng.
 * Đó cũng là nguồn gốc của trạng thái TIME_WAIT — thứ khiến máy chủ bận rộn có
 * hàng chục nghìn kết nối "đã đóng" mà vẫn chiếm cổng.
 */

import { Waypoints } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const nodes = [
  { id: 'c', label: 'Client', kind: 'client' as const, x: 200, y: 300, sublabel: { vi: 'trình duyệt', en: 'the browser' } },
  { id: 's', label: 'Server', kind: 'server' as const, x: 800, y: 300, sublabel: { vi: 'cổng 443', en: 'port 443' } },
];

const edges = [
  { id: 'e_cs', from: 'c', to: 's', curve: 60 },
  { id: 'e_sc', from: 's', to: 'c', curve: 60 },
];

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ── A — MỞ KẾT NỐI ──────────────────────────────────────────── */

function buildOpen(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'syn',
    title: { vi: 'Bước 1 — SYN: "tôi bắt đầu đếm từ 1000"', en: 'Step 1 — SYN: "I will start counting at 1000"' },
    detail: {
      vi: 'Client gửi một gói có cờ SYN và một số thứ tự khởi đầu, ở đây là 1000. Số này được chọn NGẪU NHIÊN chứ không phải luôn bằng 0 — nếu đoán được thì kẻ tấn công có thể chèn dữ liệu giả vào giữa kết nối của người khác. Gói này chưa mang byte dữ liệu nào.',
      en: 'The client sends a packet with the SYN flag and an initial sequence number, here 1000. That number is chosen RANDOMLY rather than always starting at zero — if it were guessable, an attacker could inject forged data into someone else’s connection. This packet carries no application data yet.',
    },
    duration: 2800,
    edge: 'e_cs',
    kind: 'POST',
    nodeStates: { c: 'active', s: 'processing' },
    packetLabel: 'SYN seq=1000',
    latencyMs: 30,
    sfx: 'swoosh',
    log: { vi: 'client: SYN, seq=1000 · trạng thái SYN_SENT', en: 'client: SYN, seq=1000 · state SYN_SENT' },
  });

  push({
    id: 'synack',
    title: { vi: 'Bước 2 — SYN-ACK: xác nhận, và nói số của mình', en: 'Step 2 — SYN-ACK: acknowledge, and state its own number' },
    detail: {
      vi: 'Một gói làm hai việc. `ack=1001` nghĩa là "tôi đã nhận tới byte 1000, đang chờ byte 1001" — chú ý ACK luôn trỏ tới byte KẾ TIẾP mong đợi, không phải byte cuối đã nhận. Đồng thời server gửi số khởi đầu của riêng nó (5000), vì hai chiều đếm độc lập với nhau.',
      en: 'One packet doing two jobs. The `ack=1001` means "I have everything through byte 1000, send me 1001 next" — note an ACK always names the NEXT expected byte, not the last received one. At the same time the server announces its own initial number (5000), because the two directions count independently.',
    },
    duration: 3000,
    edge: 'e_sc',
    kind: 'ACK',
    nodeStates: { s: 'active', c: 'processing' },
    packetLabel: 'SYN-ACK seq=5000 ack=1001',
    latencyMs: 30,
    sfx: 'ping',
    log: { vi: 'server: SYN-ACK, seq=5000, ack=1001', en: 'server: SYN-ACK, seq=5000, ack=1001' },
    teachingNote: {
      vi: 'Nhấn: ACK trỏ tới byte KẾ TIẾP mong đợi, không phải byte cuối nhận được.',
      en: 'Stress: an ACK names the NEXT expected byte, not the last one received.',
    },
  });

  push({
    id: 'ack',
    title: { vi: 'Bước 3 — ACK: và vì sao phải có bước thứ ba', en: 'Step 3 — ACK: and why a third step is necessary' },
    detail: {
      vi: 'Sau bước 2, client đã biết server nhận được số của mình. Nhưng SERVER thì chưa biết client có nhận được số 5000 hay không. Bước ba giải quyết đúng chỗ đó. Không thể rút xuống hai bước, vì với hai bước thì luôn có một bên không chắc bên kia đã nghe thấy mình.',
      en: 'After step 2 the client knows the server received its number. But the SERVER does not yet know whether the client received 5000. Step three settles exactly that. It cannot be reduced to two, because with two steps one side always remains unsure the other heard it.',
    },
    duration: 3000,
    edge: 'e_cs',
    kind: 'ACK',
    nodeStates: { c: 'success', s: 'success' },
    packetLabel: 'ACK ack=5001',
    latencyMs: 30,
    sfx: 'success',
    log: { vi: 'client: ACK, ack=5001 · cả hai vào ESTABLISHED', en: 'client: ACK, ack=5001 · both ESTABLISHED' },
  });

  push({
    id: 'rtt',
    title: { vi: 'Cái giá: một vòng khứ hồi trước khi gửi được byte đầu tiên', en: 'The price: a full round trip before the first byte of data' },
    detail: {
      vi: 'Bắt tay tốn đúng một RTT. Với máy chủ cách 200ms thì bạn mất 200ms trước khi request HTTP kịp rời máy — rồi TLS còn thêm một tới hai vòng nữa. Đây là lý do kết nối tới máy chủ ở xa cảm giác chậm dù băng thông rất lớn: cái đau là ĐỘ TRỄ, không phải tốc độ.',
      en: 'The handshake costs exactly one RTT. With a server 200ms away you lose 200ms before the HTTP request even leaves — and TLS then adds one or two more round trips. This is why distant servers feel slow despite huge bandwidth: the pain is LATENCY, not throughput.',
    },
    duration: 3000,
    at: 'c',
    nodeStates: { c: 'waiting' },
    sfx: 'blip',
    log: { vi: 'TCP 1 RTT + TLS 1-2 RTT trước khi gửi HTTP', en: 'TCP 1 RTT + TLS 1–2 RTT before any HTTP' },
  });

  push({
    id: 'reuse',
    title: { vi: 'Nên mọi thứ hiện đại đều xoay quanh việc tránh bắt tay', en: 'So everything modern is about avoiding the handshake' },
    detail: {
      vi: 'HTTP keep-alive giữ kết nối để nhiều request dùng chung một lần bắt tay — chính là thứ mà bài "vòng đời một request" gọi là tiết kiệm chi phí TLS. TLS 1.3 rút còn một vòng, `0-RTT` thì gửi dữ liệu ngay ở gói đầu. QUIC gộp luôn bắt tay TCP với TLS làm một. Tất cả cùng nhắm vào một con số: số vòng khứ hồi trước khi byte đầu tiên đi được.',
      en: 'HTTP keep-alive holds the connection so many requests share one handshake — the very saving the "life of a request" scenario calls out for TLS. TLS 1.3 cuts to one round trip, and `0-RTT` sends data in the first packet. QUIC merges the TCP and TLS handshakes entirely. All of them target one number: round trips before the first byte moves.',
    },
    duration: 3100,
    at: 's',
    nodeStates: { s: 'active' },
    sfx: 'lock',
    log: { vi: 'keep-alive · TLS 1.3 · 0-RTT · QUIC', en: 'keep-alive · TLS 1.3 · 0-RTT · QUIC' },
  });

  return steps;
}

/* ── B — ĐÓNG KẾT NỐI ────────────────────────────────────────── */

function buildClose(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'fin1',
    title: { vi: 'Client gửi FIN — "tôi hết chuyện để nói"', en: 'The client sends FIN — "I have nothing more to say"' },
    detail: {
      vi: 'Chú ý nghĩa của nó: client tuyên bố sẽ không GỬI thêm gì nữa, chứ không phải kết nối đã đóng. Nó vẫn NHẬN được bình thường. TCP là song công, hai chiều độc lập, nên phải đóng riêng từng chiều — và đó là lý do cần bốn bước chứ không phải ba.',
      en: 'Note precisely what it means: the client declares it will SEND nothing further, not that the connection is closed. It can still RECEIVE normally. TCP is full duplex with two independent directions, so each must close separately — which is why this takes four steps rather than three.',
    },
    duration: 2900,
    edge: 'e_cs',
    kind: 'DELETE',
    nodeStates: { c: 'waiting', s: 'processing' },
    packetLabel: 'FIN',
    sfx: 'swoosh',
    log: { vi: 'client: FIN · chiều client→server đóng', en: 'client: FIN · client→server direction closed' },
  });

  push({
    id: 'ack1',
    title: { vi: 'Server xác nhận — nhưng chưa đóng chiều của mình', en: 'The server acknowledges — but does not yet close its own direction' },
    detail: {
      vi: 'Server ACK ngay, rồi vẫn tiếp tục gửi nốt dữ liệu còn dở. Đây gọi là trạng thái đóng một nửa, và nó có ích thật: client báo "hết yêu cầu rồi", server cứ thong thả gửi nốt phần trả lời rồi mới đóng.',
      en: 'The server ACKs immediately, then keeps sending whatever data it still has. This is the half-closed state, and it is genuinely useful: the client says "no more requests", and the server finishes streaming its response at its own pace before closing.',
    },
    duration: 2900,
    edge: 'e_sc',
    kind: 'ACK',
    nodeStates: { s: 'active' },
    packetLabel: 'ACK',
    sfx: 'ping',
    log: { vi: 'server: ACK · vẫn còn gửi được dữ liệu', en: 'server: ACK · still able to send data' },
  });

  push({
    id: 'fin2',
    title: { vi: 'Xong việc, server mới gửi FIN của nó', en: 'Only when done does the server send its own FIN' },
    detail: {
      vi: 'Gửi hết dữ liệu rồi server mới đóng chiều còn lại. Hai FIN và hai ACK — bốn gói, đóng hai chiều độc lập. Nếu ứng dụng gọi `close()` thô bạo trong khi còn dữ liệu chưa gửi, TCP sẽ gửi RST thay vì FIN, và bên kia nhận lỗi "connection reset by peer" thay vì kết thúc êm.',
      en: 'Having sent everything, the server closes the remaining direction. Two FINs and two ACKs — four packets closing two independent directions. If the application calls `close()` abruptly with data still unsent, TCP sends an RST instead of a FIN, and the peer sees "connection reset by peer" rather than a clean end.',
    },
    duration: 3000,
    edge: 'e_sc',
    kind: 'DELETE',
    nodeStates: { s: 'waiting' },
    packetLabel: 'FIN',
    sfx: 'swoosh',
    log: { vi: 'server: FIN · đóng nốt chiều còn lại', en: 'server: FIN · closing the other direction' },
  });

  push({
    id: 'timewait',
    title: { vi: 'ACK cuối, rồi client nằm TIME_WAIT khoảng 60 giây', en: 'A final ACK, then the client sits in TIME_WAIT for ~60 seconds' },
    detail: {
      vi: 'Kết nối đã xong về mặt logic, nhưng client giữ nguyên bộ bốn địa chỉ/cổng thêm một lúc. Lý do: nếu ACK cuối bị mất, server sẽ gửi lại FIN và phải có ai đó còn sống để trả lời. Đồng thời nó bảo đảm gói lạc của kết nối cũ không lọt vào một kết nối mới trùng cổng.',
      en: 'The connection is logically finished, yet the client keeps the four-tuple reserved for a while. The reason: if that last ACK is lost the server retransmits its FIN, and somebody must still be alive to answer. It also guarantees that stray packets from the old connection cannot slip into a new one reusing the same port.',
    },
    duration: 3100,
    edge: 'e_cs',
    kind: 'ACK',
    nodeStates: { c: 'waiting', s: 'success' },
    packetLabel: 'ACK cuối',
    sfx: 'blip',
    log: { vi: 'client: TIME_WAIT ~60s · giữ chỗ bộ 4 địa chỉ/cổng', en: 'client: TIME_WAIT ~60s · four-tuple reserved' },
  });

  push({
    id: 'exhaust',
    title: { vi: 'Và đây là lý do máy chủ bận hết cổng dù CPU rảnh', en: 'And this is why a busy server runs out of ports with a free CPU' },
    detail: {
      vi: 'Mỗi kết nối đóng để lại một TIME_WAIT chiếm cổng khoảng một phút. Máy chủ mở nhiều kết nối ra ngoài — gọi API, gọi CSDL — có thể tích luỹ hàng chục nghìn TIME_WAIT và hết dải cổng tạm, dù CPU và RAM còn thừa. Triệu chứng: `connect: cannot assign requested address`. Cách chữa đúng là DÙNG LẠI kết nối (bể kết nối, keep-alive) chứ không phải chỉnh tham số kernel để rút ngắn TIME_WAIT.',
      en: 'Every closed connection leaves a TIME_WAIT holding a port for about a minute. A server making many outbound connections — API calls, database calls — can accumulate tens of thousands of them and exhaust the ephemeral port range while CPU and RAM sit idle. The symptom is `connect: cannot assign requested address`. The correct fix is to REUSE connections (pools, keep-alive), not to tune the kernel into shortening TIME_WAIT.',
    },
    duration: 3200,
    at: 'c',
    kind: 'ERROR',
    nodeStates: { c: 'error' },
    sfx: 'error',
    log: { vi: '28.000 TIME_WAIT · cannot assign requested address', en: '28,000 TIME_WAIT · cannot assign requested address' },
    teachingNote: {
      vi: 'Nhấn: chữa bằng bể kết nối, KHÔNG phải bằng chỉnh tham số kernel.',
      en: 'Stress: fix with connection pooling, NOT by tuning kernel parameters.',
    },
  });

  return steps;
}

export const tcpHandshakeScenario: Scenario = {
  id: 'tcp-handshake',
  name: { vi: 'TCP — bắt tay ba bước và bốn bước chia tay', en: 'TCP — the three-way handshake and four-way close' },
  tagline: {
    vi: 'Ba bước là số TỐI THIỂU để cả hai bên cùng chắc rằng bên kia đã nghe thấy số thứ tự của mình. Còn đóng thì cần bốn, vì TCP song công — mỗi chiều đóng riêng.',
    en: 'Three steps is the MINIMUM for both sides to be certain the other received their sequence number. Closing needs four, because TCP is full duplex — each direction closes on its own.',
  },
  icon: Waypoints,
  accent: '#38bdf8',
  group: 'network',
  lesson: {
    course: 'computer-networking',
    subject: 'NWC203c',
    code: '6.1',
    slug: 'nwc203c-6-1-tcp',
    title: { vi: 'Bắt tay TCP & điều khiển luồng', en: 'TCP handshake & flow control' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Giai đoạn', en: 'Phase' },
      defaultValue: 'open',
      choices: [
        {
          value: 'open',
          label: 'Mở kết nối',
          fullLabel: 'SYN · SYN-ACK · ACK',
          color: '#34d399',
          hint: { vi: 'vì sao phải đúng ba bước', en: 'why exactly three steps' },
        },
        {
          value: 'close',
          label: 'Đóng kết nối',
          fullLabel: 'FIN · ACK · FIN · ACK và TIME_WAIT',
          color: '#f59e0b',
          hint: { vi: 'hết cổng dù CPU rảnh', en: 'out of ports with an idle CPU' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'close' ? buildClose() : buildOpen()),
};
