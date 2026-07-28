/**
 * VPS & Docker · RAM, swap và OOM killer của cả máy.
 *
 * Kịch bản `docker-container` đã dạy OOM ở mức CONTAINER: vượt `memory.max`
 * thì kernel giết đúng tiến trình trong cgroup đó. Bài này là mức MÁY, và nó
 * hành xử khác hẳn ở một điểm khiến người ta bất ngờ:
 *
 *   khi RAM toàn máy cạn, kernel KHÔNG giết tiến trình vừa xin thêm bộ nhớ.
 *   Nó chấm điểm mọi tiến trình rồi giết đứa điểm cao nhất — thường là đứa
 *   TO NHẤT, chứ không phải đứa có lỗi.
 *
 * Hệ quả thực tế trên VPS: bạn chạy một lệnh build nặng, và thứ chết lại là
 * Postgres hoặc chính website đang phục vụ. Nạn nhân không liên quan gì tới
 * nguyên nhân, nên nhật ký của nó cũng không giải thích được gì.
 *
 * Số liệu lấy theo VPS thật đang chạy cuongthai.com: 8 GB RAM + 8 GB swap,
 * bộ container thường trú chiếm ~3,1 GB, và `next build` đỉnh khoảng 2,4 GB.
 */

import { MemoryStick } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Bố cục ──────────────────────────────────────────────────── */

const PANELS: PanelSpec[] = [
  {
    id: 'mem',
    kind: 'meter',
    title: { vi: 'Bộ nhớ toàn máy', en: 'Machine-wide memory' },
    hint: { vi: 'swap không phải RAM thêm — nó là đĩa', en: 'swap is not extra RAM — it is disk' },
    x: 0,
    y: 0,
    w: 494,
    h: 268,
    accent: '#38bdf8',
    meters: [
      { id: 'ram', label: 'RAM đã dùng', max: 8192, unit: 'MB', threshold: 7800, thresholdLabel: 'cạn', accent: '#38bdf8' },
      { id: 'swap', label: 'Swap đã dùng', max: 8192, unit: 'MB', accent: '#a78bfa' },
    ],
  },
  {
    id: 'procs',
    kind: 'lanes',
    title: { vi: 'Tiến trình và điểm oom_score', en: 'Processes and their oom_score' },
    hint: { vi: 'kernel giết đứa điểm CAO nhất, không phải đứa có lỗi', en: 'the kernel kills the HIGHEST score, not the culprit' },
    x: 0,
    y: 280,
    w: 494,
    h: 280,
    accent: '#f59e0b',
    layout: 'rows',
    lanes: [
      { id: 'live', label: 'đang phục vụ', sub: { vi: 'backend · frontend · postgres', en: 'backend · frontend · postgres' } },
      { id: 'build', label: 'đang build', sub: { vi: 'docker build', en: 'docker build' } },
    ],
  },
  {
    id: 'chart',
    kind: 'chart',
    mode: 'line',
    title: { vi: 'RAM theo thời gian (MB)', en: 'RAM over time (MB)' },
    x: 506,
    y: 0,
    w: 494,
    h: 268,
    accent: '#f43f5e',
    max: 8600,
    xMax: 10,
    unit: 'MB',
    xLabel: { vi: 'giây', en: 'seconds' },
    series: [
      { id: 'used', label: 'đã dùng', accent: '#f43f5e' },
      { id: 'limit', label: 'tổng RAM', accent: '#475569' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'dmesg / docker', en: 'dmesg / docker' },
    file: 'root@vps:~#',
    x: 506,
    y: 280,
    w: 494,
    h: 280,
    accent: '#34d399',
    maxLines: 8,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';

const meter = (key: string, value: number, label: string, tone: Tone): PanelOp => ({
  p: 'mem',
  op: 'value',
  key,
  value,
  label,
  tone,
});

const point = (key: string, x: number, y: number): PanelOp => ({ p: 'chart', op: 'point', key, x, y });

const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

const proc = (lane: string, id: string, label: string, sub: string, badge: string, tone: Tone): PanelOp => ({
  p: 'procs',
  op: 'push',
  lane,
  item: { id, label, sub, badge, tone },
});

const mark = (id: string, tone: Tone, badge?: string, sub?: string): PanelOp => ({
  p: 'procs',
  op: 'tone',
  key: id,
  tone,
  badge,
  sub,
});

type Push = (
  id: string,
  title: I18nText,
  detail: I18nText,
  duration: number,
  ops: PanelOp[],
  extra?: Partial<SimStep>
) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/** Vạch trần RAM vẽ suốt chiều ngang biểu đồ, để đường "đã dùng" có cái so. */
const CEILING: PanelOp[] = [point('limit', 0, 8192), point('limit', 10, 8192)];

/* ────────────────────────────────────────────────────────────
   A — BUILD SONG SONG: KERNEL GIẾT NHẦM NGƯỜI
   ──────────────────────────────────────────────────────────── */

function buildParallel(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idle',
    { vi: 'Trạng thái nghỉ: 3,1 GB cho bộ container đang phục vụ', en: 'At rest: 3.1 GB for the live stack' },
    {
      vi: 'Backend, frontend, Postgres và Redis cộng lại khoảng 3,1 GB. Còn dư gần 5 GB — nghe rất thoải mái, và đó chính là lý do người ta yên tâm chạy build ngay trên máy sản xuất.',
      en: 'Backend, frontend, Postgres and Redis together sit around 3.1 GB. Almost 5 GB free — which sounds roomy, and is exactly why people feel safe running builds straight on the production machine.',
    },
    2500,
    [
      meter('ram', 3100, '3,1 GB / 8 GB', 'ok'),
      meter('swap', 0, '0 MB', 'muted'),
      ...CEILING,
      point('used', 0, 3100),
      proc('live', 'p_be', 'backend', '420 MB · điểm 112', '', 'muted'),
      proc('live', 'p_fe', 'frontend', '380 MB · điểm 98', '', 'muted'),
      proc('live', 'p_pg', 'postgres', '1,9 GB · điểm 486', '', 'muted'),
      out('$ free -m → used 3100 / 8192', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'start',
    { vi: 'Chạy build hai ảnh CÙNG LÚC', en: 'Build both images AT THE SAME TIME' },
    {
      vi: 'Song song thì nhanh hơn — đó là bản năng đúng trong hầu hết mọi trường hợp. Nhưng ở đây thứ khan hiếm không phải thời gian mà là RAM, và hai tiến trình build không chia nhau bộ nhớ: chúng CỘNG vào nhau.',
      en: 'Parallel is faster — a correct instinct almost everywhere else. But here the scarce resource is not time, it is RAM, and two build processes do not share memory: they ADD to each other.',
    },
    2600,
    [
      meter('ram', 4800, '4,8 GB / 8 GB', 'warn'),
      point('used', 2, 4800),
      proc('build', 'b_be', 'backend img', '900 MB · điểm 240', '', 'warn'),
      proc('build', 'b_fe', 'next build', 'đang leo · điểm 300', '', 'warn'),
      out('$ docker compose build   # cả hai cùng lúc', 'info'),
    ],
    { sfx: 'stream' }
  );

  push(
    'swap',
    { vi: 'RAM cạn → kernel bắt đầu dùng swap, và máy chậm hẳn', en: 'RAM runs out → the kernel starts swapping, and the machine crawls' },
    {
      vi: 'Swap không phải RAM thêm; nó là ĐĨA được giả làm RAM. Đọc ghi chậm hơn hàng trăm lần, nên máy không chết mà lờ đờ đi — website vẫn trả lời nhưng chậm gấp mấy lần. Đây là giai đoạn dễ chẩn đoán sai nhất, vì mọi thứ vẫn "chạy".',
      en: 'Swap is not extra RAM; it is DISK pretending to be RAM. Hundreds of times slower, so the machine does not die — it crawls. The site still answers, just several times slower. This is the easiest phase to misdiagnose, because everything is still "working".',
    },
    3000,
    [
      meter('ram', 7800, '7,8 GB — cạn', 'err'),
      meter('swap', 1400, '1,4 GB', 'warn'),
      point('used', 4, 7800),
      mark('b_fe', 'err', '', '2,4 GB · điểm 742'),
      out('kswapd0 hoạt động mạnh · I/O đợi 38%', 'warn'),
      out('p95 phản hồi: 180ms → 2.400ms', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn mạnh: "còn swap" không có nghĩa là còn khoẻ. Swap đầy là dấu hiệu đã quá tải rồi.',
        en: 'Stress: "swap is available" does not mean healthy. Swapping at all means you are already over budget.',
      },
    }
  );

  push(
    'oom',
    { vi: 'OOM killer chấm điểm — và chọn Postgres', en: 'The OOM killer scores everything — and picks Postgres' },
    {
      vi: 'Đây là chỗ trực giác sai. Kernel không giết tiến trình vừa xin bộ nhớ, cũng không giết "đứa gây ra chuyện". Nó tính `oom_score` chủ yếu theo LƯỢNG BỘ NHỚ ĐANG GIỮ, rồi giết đứa cao điểm nhất để giải phóng được nhiều nhất trong một nhát. Postgres giữ vùng đệm chung lớn nên thường xuyên là đứa đứng đầu bảng.',
      en: 'This is where intuition fails. The kernel does not kill the process that just asked for memory, nor "the one at fault". It computes `oom_score` mostly from HOW MUCH MEMORY A PROCESS HOLDS, then kills the top scorer to free the most in one blow. Postgres holds a large shared buffer, so it is frequently at the top of that list.',
    },
    3300,
    [
      meter('ram', 8100, '8,1 GB — TRÀN', 'err'),
      meter('swap', 3200, '3,2 GB', 'err'),
      point('used', 6, 8190),
      mark('p_pg', 'err', '✗', 'cao điểm nhất → chết'),
      out('dmesg: Out of memory: Killed process 812 (postgres)', 'err'),
      out('postgres exited (137)', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Câu hỏi hay: ai gây ra? next build. Ai chết? postgres. Nhật ký của postgres nói gì? Không gì cả.',
        en: 'Good question: who caused it? next build. Who died? postgres. What does postgres’ log say? Nothing.',
      },
    }
  );

  push(
    'cascade',
    { vi: 'Đổ dây chuyền: CSDL chết kéo cả website chết', en: 'Cascade: the database dies and takes the site with it' },
    {
      vi: 'Backend mất kết nối CSDL, mọi request thành 500. Frontend hiện lỗi. Người dùng thấy website sập — trong khi nguyên nhân thật là một lệnh build chạy sai cách vài phút trước. Nếu chỉ đọc nhật ký backend thì bạn sẽ đi tìm lỗi CSDL và không bao giờ ra.',
      en: 'The backend loses its database connection and every request turns into a 500. The frontend shows errors. Users see a dead site — while the real cause was a build command run the wrong way minutes earlier. Reading only the backend log sends you hunting a database bug you will never find.',
    },
    2900,
    [
      mark('p_be', 'err', '', 'mất kết nối CSDL → 500'),
      point('used', 7, 5200),
      out('backend: Can’t reach database server', 'err'),
      out('502 Bad Gateway cho mọi người dùng', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'diagnose',
    { vi: 'Ba chỗ để nhìn — và không chỗ nào là nhật ký ứng dụng', en: 'Three places to look — none of them the app log' },
    {
      vi: '`dmesg -T | grep -i "killed process"` cho biết ai bị giết và lúc nào. `docker inspect <c> | grep OOMKilled` phân biệt bị kernel giết với tự thoát. Và mã thoát 137 = 128 + 9, tức SIGKILL, luôn nghĩa là bị giết chứ không phải tự chết. Ba câu lệnh này biến một sự cố mù mờ thành một câu chuyện rõ ràng.',
      en: '`dmesg -T | grep -i "killed process"` tells you who died and when. `docker inspect <c> | grep OOMKilled` distinguishes a kernel kill from a clean exit. And exit code 137 = 128 + 9, SIGKILL, always means killed rather than crashed. Those three commands turn a murky incident into a clear story.',
    },
    3100,
    [out('$ dmesg -T | grep -i "killed process"', 'info'), out('$ docker inspect postgres | grep OOMKilled → true', 'info')],
    { sfx: 'blip' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — BUILD TUẦN TỰ: ĐỈNH CHỈ BẰNG MỘT ẢNH
   ──────────────────────────────────────────────────────────── */

function buildSequential(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idle',
    { vi: 'Cùng điểm xuất phát: 3,1 GB', en: 'Same starting point: 3.1 GB' },
    {
      vi: 'Không đổi gì về phần cứng, không nâng RAM, không thêm swap. Thay đổi duy nhất là THỨ TỰ: dựng xong hẳn một ảnh rồi mới dựng ảnh kia.',
      en: 'No hardware change, no extra RAM, no extra swap. The only change is ORDER: finish one image completely before starting the next.',
    },
    2400,
    [
      meter('ram', 3100, '3,1 GB / 8 GB', 'ok'),
      meter('swap', 0, '0 MB', 'muted'),
      ...CEILING,
      point('used', 0, 3100),
      proc('live', 'q_be', 'backend', '420 MB · điểm 112', '', 'muted'),
      proc('live', 'q_fe', 'frontend', '380 MB · điểm 98', '', 'muted'),
      proc('live', 'q_pg', 'postgres', '1,9 GB · điểm 486', '', 'muted'),
      out('$ docker compose -p cuonghoangdev build backend', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'first',
    { vi: 'Ảnh backend: đỉnh 4,0 GB, còn dư một nửa', en: 'Backend image: peaks at 4.0 GB, half the machine still free' },
    {
      vi: '`tsc` biên dịch xong, ảnh được xuất ra, tiến trình kết thúc và trả lại toàn bộ bộ nhớ nó mượn. Đỉnh chỉ chạm 4,0 GB — chưa tới ngưỡng nào cả, không có byte swap nào bị dùng.',
      en: '`tsc` finishes, the image is exported, the process exits and hands back every byte it borrowed. The peak only touches 4.0 GB — nowhere near any threshold, and not a single byte of swap is used.',
    },
    2700,
    [
      meter('ram', 4000, '4,0 GB / 8 GB', 'ok'),
      point('used', 2, 4000),
      proc('build', 'q_b1', 'backend img', '900 MB · điểm 240', '', 'info'),
      out('Backend image built  ✅', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'release',
    { vi: 'Tiến trình build kết thúc → RAM về lại 3,1 GB', en: 'The build process exits → RAM returns to 3.1 GB' },
    {
      vi: 'Đây chính là điều mà chạy song song không bao giờ có được: một khoảng lặng để trả bộ nhớ. Kernel thu hồi toàn bộ vùng nhớ của tiến trình đã thoát, và máy trở lại đúng trạng thái nghỉ trước khi bước thứ hai bắt đầu.',
      en: 'This is precisely what running in parallel never gets: a quiet moment to give memory back. The kernel reclaims every page of the exited process, and the machine returns to its resting state before step two begins.',
    },
    2500,
    [
      meter('ram', 3100, '3,1 GB / 8 GB', 'ok'),
      point('used', 3, 3100),
      mark('q_b1', 'muted', '', 'xong · đã trả bộ nhớ'),
      out('$ docker compose -p cuonghoangdev build frontend', 'info'),
    ],
    { sfx: 'ping' }
  );

  push(
    'second',
    { vi: 'next build: đỉnh 5,5 GB — nặng hơn, nhưng một mình', en: 'next build: peaks at 5.5 GB — heavier, but alone' },
    {
      vi: '`next build` là bước ngốn RAM nhất, khoảng 2,4 GB. Cộng với 3,1 GB thường trú là 5,5 GB, còn dư 2,7 GB. Vẫn không chạm swap, vẫn không ai bị chấm điểm để giết. Cùng bấy nhiêu công việc, cùng bấy nhiêu RAM vật lý — chỉ khác là hai đỉnh không chồng lên nhau.',
      en: '`next build` is the heaviest step at around 2.4 GB. Added to the 3.1 GB resident that is 5.5 GB, leaving 2.7 GB free. Still no swap, still nobody being scored for death. The same work, the same physical RAM — the two peaks simply do not overlap.',
    },
    3000,
    [
      meter('ram', 5500, '5,5 GB / 8 GB', 'warn'),
      meter('swap', 0, '0 MB', 'muted'),
      point('used', 5, 5500),
      proc('build', 'q_b2', 'next build', '2,4 GB · điểm 300', '', 'info'),
      out('Frontend image built  ✅', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'done',
    { vi: 'Xong: không swap, không ai bị giết, website không gián đoạn', en: 'Done: no swap, nothing killed, no interruption' },
    {
      vi: 'Và điều đáng nói là nó KHÔNG chậm hơn bao nhiêu. Chạy song song trên một máy đã gần hết RAM thì phần lớn thời gian đổ vào swap, nên đường tuần tự thường về đích trước. Khi cache còn ấm thì cả hai bước gần như tức thì.',
      en: 'And the notable part is that it is barely slower. Running in parallel on a nearly-full machine pours most of the time into swap, so the sequential path usually finishes first anyway. With a warm cache both steps are near-instant.',
    },
    2800,
    [
      meter('ram', 3100, '3,1 GB / 8 GB', 'ok'),
      point('used', 7, 3100),
      mark('q_pg', 'ok', '', 'sống · không bị đụng tới'),
      out('Containers swapped · site khoẻ suốt quá trình', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'rules',
    { vi: 'Ba luật cho một VPS nhỏ', en: 'Three rules for a small VPS' },
    {
      vi: 'Một: đừng bao giờ để hai việc ngốn RAM chạy chồng nhau, kể cả khi "nhìn thấy còn dư". Hai: đặt swap để có đệm, nhưng coi việc CHẠM vào swap là tín hiệu quá tải chứ không phải chỗ dựa. Ba: nếu bắt buộc phải build trên máy sản xuất thì đặt trần cho tiến trình build (`--memory` hoặc `NODE_OPTIONS`) để kẻ gây ra chuyện chết trước, thay vì để kernel chọn nạn nhân giúp bạn.',
      en: 'One: never let two memory-hungry jobs overlap, even when there "looks like" headroom. Two: configure swap as a cushion, but treat any swapping as an overload signal rather than a resource. Three: if you must build on the production machine, cap the build process (`--memory` or `NODE_OPTIONS`) so the culprit dies first, instead of letting the kernel pick a victim for you.',
    },
    3100,
    [out('build có trần: kẻ gây ra chuyện chết trước, không phải postgres', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const vpsMemoryScenario: Scenario = {
  id: 'vps-memory',
  name: { vi: 'RAM, swap và OOM killer của VPS', en: 'VPS RAM, swap and the OOM killer' },
  tagline: {
    vi: 'Khi RAM cạn, kernel không giết kẻ gây ra chuyện — nó giết tiến trình TO NHẤT. Chạy build song song trên VPS 8GB và thứ chết lại là Postgres, kéo cả website xuống theo.',
    en: 'When RAM runs out the kernel does not kill the culprit — it kills the BIGGEST process. Run parallel builds on an 8GB VPS and the casualty is Postgres, taking the whole site down with it.',
  },
  icon: MemoryStick,
  accent: '#f43f5e',
  group: 'devops',
  nodes: [],
  edges: [],
  panels: PANELS,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách chạy build', en: 'How the build is run' },
      defaultValue: 'parallel',
      choices: [
        {
          value: 'parallel',
          label: 'Song song',
          fullLabel: 'Dựng hai ảnh cùng lúc',
          color: '#f43f5e',
          hint: { vi: 'kernel giết postgres', en: 'the kernel kills postgres' },
        },
        {
          value: 'sequential',
          label: 'Tuần tự',
          fullLabel: 'Xong ảnh này mới tới ảnh kia',
          color: '#34d399',
          hint: { vi: 'đỉnh 5,5 GB, không swap', en: 'peaks at 5.5 GB, no swap' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'sequential' ? buildSequential() : buildParallel(),
};
