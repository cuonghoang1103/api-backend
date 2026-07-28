/**
 * Node.js · Bài 17.5 — Deploy không gián đoạn: mất 1,5%, hay mất 0%.
 *
 * Số đo lấy nguyên từ giáo trình (bắn request liên tục SUỐT lần deploy rồi
 * đếm số request hỏng — cách đo duy nhất có ý nghĩa):
 *
 *   dừng rồi chạy lại      : gián đoạn 0,58s · 254 request · 4 HỎNG (1,5%)
 *   "blue-green" KHÔNG proxy: đổi 1,12s   · 250 request · 4 HỎNG (1,6%)
 *   blue-green CÓ proxy    : đổi 0,92s   · 327 request · 0 hỏng  (0%)
 *
 * Cách 2 là phần đắt giá nhất của bài: nó được mô tả rộng rãi là "không gián
 * đoạn" và mất y hệt cách 1, vì khe hở chưa bao giờ nằm ở chỗ container nào
 * khoẻ — nó nằm ở khoảnh khắc GẮN LẠI CỔNG. Kịch bản phải để hai cột 4 và 4
 * cạnh nhau thì người xem mới thấy điều đó.
 */

import { ArrowLeftRight } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const RECREATE_CODE = [
  '# cách hiển nhiên — và là thứ lệnh này làm',
  '# với một container đơn lẻ',
  'docker compose up -d --force-recreate',
  '',
  '# bộ dò nện /health suốt quá trình:',
  '#   thời gian gián đoạn: 0,58s',
  '#   254 request · 250 OK · 4 HỎNG  (1,5% mất)',
];

const NAIVE_CODE = [
  '# lời khuyên tiêu chuẩn, cài đặt đúng theo NGHĨA ĐEN',
  'docker run -d --name green -p 3741:3000 app:new',
  'until curl -sf localhost:3741/health; do sleep 0.05; done',
  'docker rm -f blue                  # cổng 3730 được nhả',
  'docker run -d --name green2 -p 3730:3000 app:new',
  '',
  '#   250 request · 246 OK · 4 HỎNG  (1,6% mất)',
  '#   ← y hệt cách 1',
];

const PROXY_CODE = [
  '# 1. dựng GREEN ở một cổng KHÁC',
  'docker run -d --name green -p 3741:3000 app:new',
  '',
  '# 2. chờ GREEN thật sự KHOẺ — đây là CHỐT CHẶN',
  'until curl -sf .../health/live; do sleep 0.05; done',
  '',
  '# 3. proxy trỏ sang GREEN',
  'nginx -s reload',
  '',
  '# 4. GIỜ mới bỏ BLUE (sau khoảng ân hạn, bài 17.3)',
  'docker rm -f blue',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'recreate' | 'naive' | 'proxy';
const modeOf = (opts: ScenarioOptions): Mode => (opts.mode === 'naive' || opts.mode === 'proxy' ? opts.mode : 'recreate');

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const mode = modeOf(opts);
  return [
    {
      id: 'code',
      kind: 'code',
      title: { vi: 'Kịch bản deploy', en: 'The deploy script' },
      x: 0,
      y: 0,
      w: 452,
      h: 300,
      lines: mode === 'naive' ? NAIVE_CODE : mode === 'proxy' ? PROXY_CODE : RECREATE_CODE,
    },
    {
      id: 'log',
      kind: 'log',
      title: { vi: 'Bộ dò — bắn request suốt lần deploy', en: 'The prober — hammering throughout the deploy' },
      file: 'while true; do curl /health; done',
      x: 0,
      y: 312,
      w: 452,
      h: 248,
      accent: '#38bdf8',
      maxLines: 7,
    },
    {
      id: 'who',
      kind: 'lanes',
      title: { vi: 'Ai đang lắng nghe cổng công khai', en: 'Who is listening on the public port' },
      hint: { vi: 'đây mới là câu hỏi duy nhất quan trọng', en: 'this is the only question that matters' },
      x: 464,
      y: 0,
      w: 536,
      h: 300,
      lanes: [
        { id: 'port', label: 'Cổng công khai', sub: { vi: 'thứ người dùng gọi tới', en: 'what users connect to' }, accent: '#38bdf8' },
        { id: 'blue', label: 'BLUE', sub: { vi: 'phiên bản đang chạy', en: 'the running version' }, accent: '#60a5fa' },
        { id: 'green', label: 'GREEN', sub: { vi: 'phiên bản mới', en: 'the new version' }, accent: '#34d399' },
      ],
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: { vi: 'Request HỎNG trong một lần deploy', en: 'Requests LOST in one deploy' },
      hint: { vi: 'đếm thật, không phải lời hứa', en: 'counted, not promised' },
      x: 464,
      y: 312,
      w: 536,
      h: 248,
      accent: '#f43f5e',
      unit: 'request',
      max: 5,
    },
  ];
};

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const log = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'muted'): PanelOp => ({
  p: 'log',
  op: 'push',
  item: { label, tone },
});
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const lane = (id: string, label: string, sub: string, tone: ItemTone): PanelOp => ({
  p: 'who',
  op: 'push',
  lane: id,
  item: { label, sub, tone },
});
const wipe = (id: string): PanelOp => ({ p: 'who', op: 'clear', lane: id });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — DỪNG RỒI CHẠY LẠI: 1,5%
   ──────────────────────────────────────────────────────────── */

function buildRecreate(): SimStep[] {
  const { steps, push } = collector();

  push(
    'before',
    { vi: 'Trước khi deploy — BLUE đang giữ cổng công khai', en: 'Before the deploy — BLUE holds the public port' },
    {
      vi: '"Deploy không gián đoạn" là cụm từ người ta dùng cho những hệ thống họ chưa bao giờ ĐO. Cách đo duy nhất có ý nghĩa: bắn request liên tục trong suốt lần deploy rồi đếm xem bao nhiêu cái hỏng.',
      en: '"Zero-downtime deploy" is a phrase people use about systems they have never MEASURED. The only measurement that means anything: hammer the service throughout the deploy and count what fails.',
    },
    2500,
    [
      lines([3]),
      lane('port', 'cổng 3730', 'BLUE lắng nghe', 'ok'),
      lane('blue', 'app:old', 'đang phục vụ', 'ok'),
      log('200 · 200 · 200 · 200 · 200 …', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'gap',
    { vi: 'Container bị dừng — 0,58 giây KHÔNG AI lắng nghe', en: 'The container stops — 0.58 seconds with NOBODY listening' },
    {
      vi: 'Trong khoảng đó, mọi request đều bị từ chối kết nối. Không phải 502, không phải chậm — mà là không có ai ở đầu dây.',
      en: 'For that window, every request is connection-refused. Not a 502, not slow — nobody is on the other end of the socket.',
    },
    2800,
    [
      wipe('port'),
      wipe('blue'),
      lane('port', 'cổng 3730', 'KHÔNG AI nghe', 'err'),
      log('ECONNREFUSED · ECONNREFUSED', 'err'),
      log('ECONNREFUSED · ECONNREFUSED', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'after',
    { vi: '254 request · 250 thành công · 4 HỎNG (1,5% mất)', en: '254 requests · 250 succeeded · 4 LOST (1.5%)' },
    {
      vi: 'Bốn lần hỏng trong một cửa sổ chín giây. Trên một dịch vụ xử lý 200 request mỗi giây thì đó là khoảng 115 người dùng thật nhìn thấy lỗi, MỖI LẦN deploy — và dự án này deploy vài lần một ngày.',
      en: 'Four failures in a nine-second window. On a service handling 200 requests per second that is about 115 real users seeing an error, EVERY deploy — and this project deploys several times a day.',
    },
    2900,
    [
      wipe('port'),
      lane('port', 'cổng 3730', 'GREEN chiếm lại', 'ok'),
      lane('green', 'app:new', 'đang phục vụ', 'ok'),
      bar('dừng rồi chạy lại', 4, '4 · 1,5%', 'err'),
      log('254 request · 250 OK · 4 HỎNG  (1,5% mất)', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Chấp nhận được cho công cụ nội bộ; không chấp nhận được cho sản phẩm.',
        en: 'Acceptable for an internal tool; not for a product.',
      },
    }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — "BLUE-GREEN" KHÔNG CÓ PROXY: MẤT Y HỆT
   ──────────────────────────────────────────────────────────── */

function buildNaive(): SimStep[] {
  const { steps, push } = collector();

  push(
    'green',
    { vi: 'Dựng GREEN ở cổng thứ hai, kiểm khoẻ — tới đây đều ĐÚNG', en: 'Start GREEN on a second port, health-check it — so far all CORRECT' },
    {
      vi: 'Lời khuyên tiêu chuẩn: dựng container mới, chờ nó khoẻ, rồi mới bỏ cái cũ. Việc kiểm khoẻ này THẬT SỰ có giá trị — nếu ảnh mới hỏng thì cái cũ vẫn đang phục vụ, và đó là khác biệt giữa một lần deploy thất bại với một lần sập.',
      en: 'The standard advice: start the new container, wait until it is healthy, only then remove the old one. That health check IS genuinely valuable — if the new image is broken the old one is still serving, and that is the difference between a failed deploy and an outage.',
    },
    2700,
    [
      lines([2, 3]),
      lane('port', 'cổng 3730', 'BLUE lắng nghe', 'ok'),
      lane('blue', 'app:old', 'đang phục vụ', 'ok'),
      lane('green', 'app:new @3741', 'khoẻ · chưa ai gọi', 'info'),
      log('200 · 200 · 200 · green /health → 200', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'swap',
    { vi: 'Bỏ BLUE để lấy lại cổng 3730 — và khe hở mở ra', en: 'Remove BLUE to free port 3730 — and the gap opens' },
    {
      vi: 'Giữa khoảnh khắc container cũ NHẢ cổng và khoảnh khắc cái mới CHIẾM lấy nó, không có ai lắng nghe cả. Cú sập chính là lúc GẮN LẠI CỔNG — nó chưa bao giờ liên quan tới việc container nào khoẻ.',
      en: 'Between the moment the old container RELEASES the port and the moment the new one CLAIMS it, nobody is listening. The outage is the port rebind — it was never about which container is healthy.',
    },
    2900,
    [
      lines([4, 5]),
      wipe('port'),
      wipe('blue'),
      lane('port', 'cổng 3730', 'nhả rồi, trống', 'err'),
      log('ECONNREFUSED · ECONNREFUSED', 'err'),
      log('ECONNREFUSED · ECONNREFUSED', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'same',
    { vi: '250 request · 4 HỎNG (1,6%) — y hệt cách 1', en: '250 requests · 4 LOST (1.6%) — identical to method 1' },
    {
      vi: 'Gọi cách này là "blue-green" chính là nơi sinh ra hiểu lầm: khuôn mẫu thì ĐÚNG, còn phần cài đặt bỏ sót đúng cái mảnh làm cho nó hoạt động. Hai cột bên phải là cùng một con số, từ hai quy trình mà một cái được quảng cáo là không gián đoạn.',
      en: 'Calling this "blue-green" is where the misunderstanding is born: the pattern is RIGHT, and this implementation omits the one piece that makes it work. The two bars on the right are the same number, from two procedures one of which is advertised as zero-downtime.',
    },
    3000,
    [
      wipe('port'),
      lane('port', 'cổng 3730', 'GREEN chiếm rồi', 'ok'),
      bar('dừng rồi chạy lại', 4, '4 · 1,5%', 'err'),
      bar('blue-green KHÔNG proxy', 4, '4 · 1,6%', 'err'),
      log('250 request · 246 OK · 4 HỎNG  (1,6% mất)', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Kiểm khoẻ cứu bạn khỏi ảnh HỎNG; nó không cứu bạn khỏi khe hở gắn cổng.',
        en: 'The health check saves you from a broken image; it does not save you from the rebind gap.',
      },
    }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — CÓ MỘT THỨ SỐNG LÂU SỞ HỮU ĐỊA CHỈ: 0%
   ──────────────────────────────────────────────────────────── */

function buildProxy(): SimStep[] {
  const { steps, push } = collector();

  push(
    'proxy',
    { vi: 'Thêm một proxy sở hữu cổng công khai VĨNH VIỄN', en: 'Put a proxy in front that owns the public port PERMANENTLY' },
    {
      vi: 'nginx, Traefik, hay cân bằng tải của nhà cung cấp — miễn là nó KHÔNG khởi động lại khi bạn deploy. Giờ phép đổi là đổi ĐÍCH ĐẾN, không phải đổi người lắng nghe.',
      en: 'nginx, Traefik, or your provider\'s load balancer — as long as it does NOT restart when you deploy. Now the swap changes a DESTINATION, not a listener.',
    },
    2600,
    [
      lines([1, 2]),
      lane('port', 'nginx :443', 'không restart', 'ok'),
      lane('blue', 'app:old', 'proxy trỏ vào đây', 'ok'),
      log('200 · 200 · 200 · 200 · 200 …', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'health',
    { vi: 'Chờ GREEN thật sự KHOẺ — đây là cái chốt', en: 'Wait until GREEN is genuinely healthy — this is the gate' },
    {
      vi: '"Container đã khởi động" và "ứng dụng đã sẵn sàng" cách nhau đúng bằng khoảng thời gian app cần để kết nối cơ sở dữ liệu, làm ấm cache và gắn xong các route. Chốt phải là một phản hồi HTTP THẬT từ một route thật — `docker ps` nói nó chạy rồi KHÔNG có nghĩa là nó nhận việc được rồi.',
      en: '"The container started" and "the app is ready" are separated by exactly the time your app needs to connect to the database, warm caches and mount routes. The gate must be a REAL HTTP response from a real route — `docker ps` saying it runs does NOT mean it can take work.',
    },
    2900,
    [
      lines([4, 5]),
      lane('green', 'app:new @3741', '/health chưa OK', 'warn'),
      log('until curl -sf .../health/live; do sleep 0.05; done', 'warn'),
      log('green /health/live → 200  ✓', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'switch',
    { vi: 'Đổi đích của proxy — cổng công khai chưa từng đóng', en: 'Switch the proxy target — the public port never closed' },
    {
      vi: 'Nạp lại cấu hình, kết nối đang mở tự chảy hết ở BLUE. Không có khoảnh khắc nào không có người lắng nghe, vì proxy chưa bao giờ nhả cổng.',
      en: 'Reload the config; open connections drain on BLUE. There is no moment without a listener, because the proxy never released the port.',
    },
    2800,
    [
      lines([7, 8]),
      wipe('blue'),
      wipe('green'),
      lane('blue', 'app:old', 'đang chảy hết', 'muted'),
      lane('green', 'app:new', 'proxy đã trỏ sang', 'ok'),
      log('nginx -s reload → upstream = green', 'ok'),
      log('200 · 200 · 200 · 200 · 200 …', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'result',
    { vi: '327 trên 327 — 0% mất', en: '327 out of 327 — 0% lost' },
    {
      vi: 'Đúng MỘT khác biệt về cấu trúc — có một thứ sống lâu sở hữu địa chỉ — chính là toàn bộ nội dung của việc deploy không gián đoạn. Mọi thứ còn lại là chi tiết. Và chỉ bỏ BLUE SAU khoảng ân hạn (bài 17.3: SIGTERM cộng đủ thời gian cho request đang chạy hoàn thành).',
      en: 'Exactly ONE structural difference — something long-lived owns the address — is the entire content of zero-downtime deployment. Everything else is detail. And remove BLUE only AFTER the grace period (lesson 17.3: SIGTERM plus enough time for in-flight requests to finish).',
    },
    2900,
    [
      lines([10, 11]),
      wipe('blue'),
      bar('dừng rồi chạy lại', 4, '4 · 1,5%', 'err'),
      bar('blue-green KHÔNG proxy', 4, '4 · 1,6%', 'err'),
      bar('blue-green CÓ proxy', 0, '0 · 0%', 'ok'),
      log('327 request · 327 OK · 0 HỎNG  (0% mất)', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'caveats',
    { vi: 'Hai ràng buộc mà cách này áp lên code của bạn', en: 'Two constraints this places on your code' },
    {
      vi: 'Trong một lần rolling deploy, phiên bản N và N+1 CÙNG SỐNG và cùng nói chuyện với một cơ sở dữ liệu, nên mọi thay đổi lược đồ phải tương thích ngược: thêm cột cho phép NULL → deploy code ghi vào nó → điền dữ liệu cũ → rồi mới `NOT NULL` ở lần deploy sau. Và WebSocket thì KHÔNG "rolling" được: một kết nối Socket.IO kéo dài hàng giờ và đơn giản là bị cắt — chương 11 đo được client kết nối lại sau 1.053 ms với socket id mới, không được vào lại phòng, và năm tin nhắn phát ra lúc nó vắng mặt thì nhận được con số không.',
      en: 'During a rolling deploy, versions N and N+1 are BOTH ALIVE against one database, so every schema change must be backward compatible: add a nullable column → deploy the code that writes it → backfill → only then `NOT NULL` in a later deploy. And WebSockets do not "roll": a Socket.IO connection lasts hours and is simply cut — chapter 11 measured the client reconnecting after 1,053 ms with a new socket id, not rejoining its rooms, and receiving zero of the five messages emitted while it was away.',
    },
    3100,
    [lines([]), log('mọi thay đổi lược đồ phải TƯƠNG THÍCH NGƯỢC', 'warn'), log('WebSocket: phép sửa nằm ở phía CLIENT', 'warn')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsBlueGreenScenario: Scenario = {
  id: 'nodejs-blue-green',
  name: { vi: 'Deploy không gián đoạn: 1,5% hay 0%', en: 'Zero-downtime deploy: 1.5% or 0%' },
  tagline: {
    vi: 'Ba cách deploy, đo bằng cách bắn request suốt quá trình: dừng-rồi-chạy-lại mất 4 request, "blue-green" không proxy cũng mất đúng 4 — và blue-green có proxy mất 0. Khe hở chưa bao giờ nằm ở chỗ container nào khoẻ; nó nằm ở khoảnh khắc gắn lại cổng.',
    en: 'Three deploy methods, measured by hammering the service throughout: stop-and-restart loses 4 requests, "blue-green" without a proxy loses exactly 4 too — and blue-green with a proxy loses 0. The gap was never about which container is healthy; it is the port rebind.',
  },
  icon: ArrowLeftRight,
  accent: '#60a5fa',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '17.5',
    slug: 'nodejs-17-5-deploy-khong-gian-doan',
    title: { vi: 'Deploy không gián đoạn: mất 1,5%, hay mất 0%', en: 'Zero-downtime deploy: losing 1.5%, or losing 0%' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách deploy', en: 'Deploy method' },
      defaultValue: 'recreate',
      choices: [
        {
          value: 'recreate',
          label: 'Dừng & chạy lại',
          fullLabel: 'force-recreate — gián đoạn 0,58s, mất 1,5%',
          color: '#f43f5e',
          hint: { vi: '~115 người dùng thấy lỗi mỗi lần deploy', en: '~115 real users see an error per deploy' },
        },
        {
          value: 'naive',
          label: 'Không có proxy',
          fullLabel: '"Blue-green" theo nghĩa đen — vẫn mất 1,6%',
          color: '#f59e0b',
          hint: { vi: 'khuôn mẫu đúng, thiếu đúng mảnh quan trọng', en: 'right pattern, missing the piece that matters' },
        },
        {
          value: 'proxy',
          label: 'Có proxy',
          fullLabel: '327/327 — 0% mất',
          color: '#34d399',
          hint: { vi: 'một thứ sống lâu sở hữu địa chỉ', en: 'something long-lived owns the address' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'naive' ? buildNaive() : mode === 'proxy' ? buildProxy() : buildRecreate();
  },
};
