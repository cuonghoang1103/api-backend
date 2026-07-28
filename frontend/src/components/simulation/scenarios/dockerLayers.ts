/**
 * VPS & Docker · Ảnh Docker được xây bằng TẦNG, và cache vỡ từ dòng bị sửa.
 *
 * Đây là bài học đắt nhất của nhóm: hai Dockerfile làm ra ảnh CHẠY GIỐNG HỆT
 * nhau, nhưng một cái build lại mất ~90 giây còn cái kia mất ~2 giây, chỉ vì
 * thứ tự hai dòng lệnh. Lý do nằm ở một quy tắc duy nhất của Docker:
 *
 *   Mỗi chỉ thị trong Dockerfile tạo ra một TẦNG. Docker dùng lại tầng cũ khi
 *   và chỉ khi chỉ thị đó VÀ mọi tầng phía trên nó đều không đổi. Một tầng vỡ
 *   thì toàn bộ tầng bên dưới vỡ theo — không có ngoại lệ.
 *
 * Hệ quả trực tiếp: `COPY . .` đặt TRƯỚC `npm ci` nghĩa là mọi lần sửa một
 * dòng mã đều làm vỡ tầng COPY, kéo theo `npm ci` phải chạy lại từ đầu dù
 * `package.json` không hề đổi. Đảo hai dòng đó lại là toàn bộ mẹo.
 *
 * Con số dùng trong kịch bản lấy theo thang thời gian thực tế của một dự án
 * Node cỡ trung (~600 gói): npm ci lạnh ~85s, sao chép mã ~1s, build ~40s.
 */

import { Layers } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Hai Dockerfile ──────────────────────────────────────────── */

// Bản SAI: chép toàn bộ mã trước rồi mới cài phụ thuộc.
const BAD_CODE = [
  'FROM node:22-alpine',
  'WORKDIR /app',
  '',
  'COPY . .              # ← chép TẤT CẢ, kể cả src/',
  'RUN npm ci',
  'RUN npm run build',
  '',
  'CMD ["node", "dist/index.js"]',
];

// Bản ĐÚNG: chỉ chép đúng thứ npm cần, cài xong mới chép mã.
const GOOD_CODE = [
  'FROM node:22-alpine',
  'WORKDIR /app',
  '',
  'COPY package*.json ./  # ← chỉ 2 file kê khai',
  'RUN npm ci',
  'COPY . .               # ← mã nguồn xuống DƯỚI',
  'RUN npm run build',
  '',
  'CMD ["node", "dist/index.js"]',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title:
      opts.order === 'good'
        ? { vi: 'Dockerfile — mã nguồn nằm DƯỚI npm ci', en: 'Dockerfile — source below npm ci' }
        : { vi: 'Dockerfile — mã nguồn nằm TRÊN npm ci', en: 'Dockerfile — source above npm ci' },
    file: 'Dockerfile',
    x: 0,
    y: 0,
    w: 470,
    h: 268,
    lines: opts.order === 'good' ? GOOD_CODE : BAD_CODE,
  },
  {
    id: 'layers',
    kind: 'tree',
    title: { vi: 'Chồng tầng của ảnh', en: 'The image layer stack' },
    hint: {
      vi: 'mỗi chỉ thị = một tầng, tầng dưới phụ thuộc tầng trên',
      en: 'one instruction = one layer, lower depends on upper',
    },
    x: 0,
    y: 280,
    w: 470,
    h: 280,
    accent: '#38bdf8',
  },
  {
    id: 'cost',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Thời gian build (giây)', en: 'Build time (seconds)' },
    hint: { vi: 'lần đầu so với lần sau khi sửa 1 dòng mã', en: 'first build vs after a one-line code edit' },
    x: 482,
    y: 0,
    w: 518,
    h: 246,
    unit: 's',
    max: 140,
    accent: '#f59e0b',
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'docker build', en: 'docker build' },
    file: 'docker build -t api .',
    x: 482,
    y: 258,
    w: 518,
    h: 302,
    accent: '#34d399',
    maxLines: 9,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });

const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' | 'info' = 'ok'): PanelOp => ({
  p: 'out',
  op: 'push',
  item: { label, tone },
});

/** Một tầng trong chồng ảnh. `depth` chỉ dùng để thụt vào cho dễ đọc. */
const layer = (
  id: string,
  label: string,
  sub: string,
  badge: string,
  tone: 'ok' | 'warn' | 'err' | 'muted' | 'info' = 'muted'
): PanelOp => ({
  p: 'layers',
  op: 'push',
  item: { id, label, depth: 0, sub, badge, tone },
});

/** Đổi trạng thái một tầng đã có (CACHED → phải build lại chẳng hạn). */
const mark = (
  id: string,
  tone: 'ok' | 'warn' | 'err' | 'muted' | 'info',
  badge?: string,
  sub?: string
): PanelOp => ({ p: 'layers', op: 'tone', key: id, tone, badge, sub });

/**
 * Một cột của biểu đồ. `key` là thứ hiện DƯỚI trục X, `label` là thứ hiện
 * TRÊN đầu cột — nên key phải là tên phép đo, còn label là con số, không thì
 * hai chỗ nói cùng một điều và cột nào cũng có hai nhãn giống nhau.
 */
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err' | 'info'): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
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

/* ────────────────────────────────────────────────────────────
   A — THỨ TỰ SAI: COPY . . đặt trên npm ci
   ──────────────────────────────────────────────────────────── */

function buildBad(): SimStep[] {
  const { steps, push } = collector();

  push(
    'intro',
    { vi: 'Một Dockerfile trông hoàn toàn hợp lý', en: 'A Dockerfile that looks perfectly reasonable' },
    {
      vi: 'Đọc từ trên xuống thì không có gì sai: lấy ảnh nền, vào thư mục làm việc, chép mã vào, cài phụ thuộc, build. Đây gần như luôn là Dockerfile đầu tiên mà mọi người viết ra, và nó CHẠY ĐÚNG. Vấn đề không phải tính đúng đắn — mà là mỗi lần build lại sau này sẽ tốn bao lâu.',
      en: 'Read top to bottom, nothing looks wrong: take a base image, set the workdir, copy the code in, install dependencies, build. This is almost always the first Dockerfile anyone writes, and it WORKS. The problem is not correctness — it is what every rebuild will cost from now on.',
    },
    2600,
    [lines([1, 2, 4, 5, 6])],
    { sfx: 'click' }
  );

  push(
    'base',
    { vi: 'Tầng 1 — ảnh nền node:22-alpine', en: 'Layer 1 — the node:22-alpine base' },
    {
      vi: 'Tầng đầu tiên là ảnh nền, tải một lần rồi nằm luôn trong kho cục bộ. Nó gần như không bao giờ vỡ cache, vì bạn hiếm khi đổi phiên bản Node. Đây là lý do người ta ghim `node:22-alpine` chứ không viết `node:latest` — `latest` đổi dưới chân bạn và làm vỡ mọi thứ bên dưới.',
      en: 'The first layer is the base image, pulled once and then kept in the local store. It almost never busts, because you rarely change Node versions. This is why people pin `node:22-alpine` instead of `node:latest` — `latest` shifts under your feet and busts everything below it.',
    },
    2200,
    [lines([1]), layer('l1', 'FROM node:22-alpine', 'ảnh nền · 142 MB', 'CACHED', 'muted'), out('=> [1/5] FROM node:22-alpine    CACHED', 'muted')],
    { sfx: 'blip' }
  );

  push(
    'copy',
    { vi: 'Tầng 3 — COPY . . chép TẤT CẢ vào ảnh', en: 'Layer 3 — COPY . . copies EVERYTHING in' },
    {
      vi: 'Đây là tầng định đoạt số phận cả file. `COPY . .` gộp toàn bộ thư mục dự án — `package.json`, `src/`, `README`, mọi thứ — vào MỘT tầng duy nhất. Docker băm nội dung tầng đó để quyết định có dùng lại cache được không. Nghĩa là: sửa một ký tự trong `src/index.ts` cũng đổi mã băm y như đổi cả `package.json`.',
      en: 'This is the layer that decides the whole file’s fate. `COPY . .` folds the entire project directory — `package.json`, `src/`, the README, everything — into ONE layer. Docker hashes that layer’s contents to decide whether the cache still applies. Which means: changing one character in `src/index.ts` changes the hash exactly as much as changing `package.json` would.',
    },
    3000,
    [
      lines([4]),
      layer('l2', 'WORKDIR /app', 'siêu dữ liệu · 0 B', 'CACHED', 'muted'),
      layer('l3', 'COPY . .', 'package.json + src/ + tất cả · 4,2 MB', 'MỚI', 'warn'),
      out('=> [2/5] WORKDIR /app           CACHED', 'muted'),
      out('=> [3/5] COPY . .              4.2MB', 'warn'),
    ],
    {
      sfx: 'stream',
      teachingNote: {
        vi: 'Nhấn mạnh: Docker KHÔNG biết file nào trong tầng này quan trọng với npm. Nó chỉ thấy một mã băm.',
        en: 'Stress this: Docker does NOT know which file in this layer matters to npm. It only sees one hash.',
      },
    }
  );

  push(
    'install',
    { vi: 'Tầng 4 — npm ci, 85 giây', en: 'Layer 4 — npm ci, 85 seconds' },
    {
      vi: 'Tải và giải nén ~600 gói. Lần đầu thì bắt buộc phải trả giá này, không tránh được. Điều đáng nói là ở lần build TIẾP THEO: tầng này nằm NGAY DƯỚI tầng COPY vừa rồi, nên số phận của nó bị buộc chặt vào số phận của toàn bộ mã nguồn.',
      en: 'Downloads and unpacks ~600 packages. On a first build this cost is unavoidable. What matters is the NEXT build: this layer sits directly BELOW that COPY, so its fate is chained to the fate of your entire source tree.',
    },
    2800,
    [
      lines([5]),
      layer('l4', 'RUN npm ci', '602 gói · 312 MB', '85s', 'err'),
      out('=> [4/5] RUN npm ci            85.4s', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'first',
    { vi: 'Build lần đầu xong — 128 giây', en: 'First build done — 128 seconds' },
    {
      vi: 'Cộng lại: kéo ảnh nền, chép mã, cài phụ thuộc, biên dịch. Không ai phàn nàn về con số này, vì lần đầu thì ai cũng chấp nhận phải chờ. Cái bẫy chỉ lộ ra ở lần sửa mã tiếp theo.',
      en: 'Totalled up: pull the base, copy the code, install dependencies, compile. Nobody complains about this number, because everyone accepts waiting once. The trap only springs on the next code edit.',
    },
    2500,
    [
      lines([6]),
      layer('l5', 'RUN npm run build', 'tsc → dist/ · 8,1 MB', '41s', 'warn'),
      bar('lần đầu', 128, '128s', 'info'),
      out('=> [5/5] RUN npm run build     41.2s'),
      out('=> exporting to image          128s tổng', 'info'),
    ],
    { sfx: 'success' }
  );

  push(
    'edit',
    { vi: 'Sửa MỘT dòng trong src/index.ts', en: 'Edit ONE line in src/index.ts' },
    {
      vi: 'Đổi một dòng log. Không đụng tới `package.json`, không thêm gói nào, không nâng phiên bản gì cả. Rồi build lại. Theo trực giác thì chỉ tầng cuối cần chạy lại — nhưng Docker không làm theo trực giác, nó làm theo mã băm.',
      en: 'Change one log line. You did not touch `package.json`, did not add a package, did not bump anything. Then rebuild. Intuition says only the last layer needs to rerun — but Docker does not follow intuition, it follows hashes.',
    },
    2600,
    [
      { p: 'out', op: 'clear' },
      mark('l1', 'ok', 'CACHED'),
      mark('l2', 'ok', 'CACHED'),
      out('$ docker build -t api .   # sau khi sửa 1 dòng', 'info'),
      out('=> [1/5] FROM node:22-alpine    CACHED', 'ok'),
      out('=> [2/5] WORKDIR /app           CACHED', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'bust',
    { vi: 'Tầng COPY vỡ — và kéo mọi thứ dưới nó vỡ theo', en: 'The COPY layer busts — and drags everything below with it' },
    {
      vi: 'Mã băm của tầng `COPY . .` đổi, vì `src/index.ts` nằm trong đó. Quy tắc của Docker không có ngoại lệ: một tầng vỡ thì MỌI tầng bên dưới đều bị coi là không còn tin được, kể cả khi lệnh của chúng không đổi một chữ. `npm ci` phải chạy lại toàn bộ 85 giây, tải lại 602 gói y hệt lần trước.',
      en: 'The `COPY . .` layer’s hash changed, because `src/index.ts` lives inside it. Docker’s rule has no exceptions: once a layer busts, EVERY layer below it is considered untrustworthy, even if its command is character-for-character identical. `npm ci` reruns all 85 seconds, re-fetching the exact same 602 packages.',
    },
    3200,
    [
      mark('l3', 'err', 'VỠ CACHE', 'src/index.ts đổi → mã băm đổi'),
      mark('l4', 'err', 'BUỘC CHẠY LẠI 85s', 'lệnh không đổi, vẫn phải chạy'),
      mark('l5', 'err', 'BUỘC CHẠY LẠI 41s'),
      out('=> [3/5] COPY . .              4.2MB', 'err'),
      out('=> [4/5] RUN npm ci            85.4s  ← LẠI NỮA', 'err'),
      out('=> [5/5] RUN npm run build     41.2s', 'err'),
      bar('sửa 1 dòng mã', 127, '127s', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là chỗ để dừng: hỏi lớp "npm ci có lý do gì để chạy lại không?" — không hề. Nó chạy lại chỉ vì vị trí trong file.',
        en: 'Stop here: ask the class "did npm ci have any reason to rerun?" — none. It reran purely because of its position in the file.',
      },
    }
  );

  push(
    'verdict',
    { vi: '127 giây để đổi một dòng log', en: '127 seconds to change one log line' },
    {
      vi: 'Và cái giá này lặp lại ở MỌI lần build sau đó — mỗi lần deploy, mỗi lần chạy CI. Trên VPS 6GB thì `npm ci` lặp lại còn là nguồn gây hết RAM khi hai ảnh cùng build song song. Bật lựa chọn "Thứ tự đúng" để xem cách sửa, chỉ tốn đúng một lần đổi chỗ hai dòng.',
      en: 'And this cost repeats on EVERY subsequent build — every deploy, every CI run. On a 6GB VPS the repeated `npm ci` is also what exhausts RAM when two images build in parallel. Switch to "Correct order" to see the fix: swapping two lines, once.',
    },
    2800,
    [lines([]), out('Tổng: 127s cho một dòng log', 'err')],
    { sfx: 'buzz' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — THỨ TỰ ĐÚNG: package*.json trước, mã nguồn sau
   ──────────────────────────────────────────────────────────── */

function buildGood(): SimStep[] {
  const { steps, push } = collector();

  push(
    'intro',
    { vi: 'Cùng một ảnh, khác đúng chỗ đặt hai dòng', en: 'The same image, only two lines moved' },
    {
      vi: 'Ảnh sinh ra từ Dockerfile này chạy giống hệt bản trước: cùng Node, cùng phụ thuộc, cùng mã đã biên dịch. Điểm khác duy nhất là `COPY . .` bị đẩy xuống DƯỚI `npm ci`, và trên nó là một dòng COPY hẹp hơn nhiều.',
      en: 'The image this Dockerfile produces runs identically to the previous one: same Node, same dependencies, same compiled code. The only difference is that `COPY . .` moved BELOW `npm ci`, with a much narrower COPY above it.',
    },
    2500,
    [lines([1, 2, 4, 5, 6, 7])],
    { sfx: 'click' }
  );

  push(
    'manifest',
    { vi: 'Tầng 3 — chỉ chép package.json và package-lock.json', en: 'Layer 3 — copy only package.json and package-lock.json' },
    {
      vi: 'Đây là toàn bộ mẹo, gói trong một câu: chép vào ảnh ĐÚNG những file mà bước sau cần, không hơn. `npm ci` chỉ cần hai file kê khai — nó không đọc `src/` một dòng nào. Cho nên tầng này chỉ vỡ khi bạn thật sự thêm hoặc nâng một gói.',
      en: 'The entire trick, in one sentence: copy in exactly what the next step needs, and nothing more. `npm ci` only needs the two manifest files — it never reads a single line of `src/`. So this layer busts only when you genuinely add or upgrade a package.',
    },
    3000,
    [
      lines([4]),
      layer('g1', 'FROM node:22-alpine', 'ảnh nền · 142 MB', 'CACHED', 'muted'),
      layer('g2', 'WORKDIR /app', 'siêu dữ liệu · 0 B', 'CACHED', 'muted'),
      layer('g3', 'COPY package*.json ./', 'đúng 2 file · 48 KB', 'MỚI', 'info'),
      out('=> [1/6] FROM node:22-alpine    CACHED', 'muted'),
      out('=> [3/6] COPY package*.json ./  48kB', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'install',
    { vi: 'Tầng 4 — npm ci vẫn tốn 85 giây, nhưng ở đúng chỗ', en: 'Layer 4 — npm ci still costs 85s, but in the right place' },
    {
      vi: 'Lần đầu vẫn phải cài 602 gói, không có phép màu nào rút ngắn được. Điều đổi khác là thứ NẰM TRÊN nó: giờ chỉ có hai file kê khai. Toàn bộ `src/` đã bị đẩy xuống dưới, nên nó không còn quyền làm vỡ tầng này nữa.',
      en: 'The first build still installs 602 packages; no magic shortens that. What changed is what sits ABOVE it: just two manifest files now. The whole of `src/` has moved below, so it no longer has the power to bust this layer.',
    },
    2700,
    [
      lines([5]),
      layer('g4', 'RUN npm ci', '602 gói · 312 MB', '85s', 'warn'),
      out('=> [4/6] RUN npm ci            85.4s', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'source',
    { vi: 'Tầng 5 — bây giờ mới chép mã nguồn', en: 'Layer 5 — only now copy the source' },
    {
      vi: '`COPY . .` vẫn còn đó và vẫn chép mọi thứ, nhưng nó đã nằm dưới `npm ci`. Từ giờ, sửa mã chỉ làm vỡ tầng này trở xuống — tức là hai tầng cuối, chứ không phải nửa dưới của cả file.',
      en: '`COPY . .` is still there and still copies everything, but it now sits below `npm ci`. From here on, editing code busts only this layer downward — two layers, not the entire bottom half of the file.',
    },
    2500,
    [
      lines([6, 7]),
      layer('g5', 'COPY . .', 'mã nguồn · 4,2 MB', 'MỚI', 'info'),
      layer('g6', 'RUN npm run build', 'tsc → dist/ · 8,1 MB', '41s', 'warn'),
      bar('lần đầu', 128, '128s', 'info'),
      out('=> [5/6] COPY . .              4.2MB', 'info'),
      out('=> [6/6] RUN npm run build     41.2s', 'warn'),
      out('=> exporting to image          128s tổng', 'info'),
    ],
    { sfx: 'success' }
  );

  push(
    'edit',
    { vi: 'Sửa đúng dòng log đó, build lại', en: 'Make that same one-line edit, rebuild' },
    {
      vi: 'Cùng một thao tác sửa như ở bản trước: một dòng trong `src/index.ts`. Lần này Docker đi từ trên xuống và kiểm mã băm từng tầng — và bốn tầng đầu không có gì đổi, vì `src/` không nằm trong bất kỳ tầng nào trong số đó.',
      en: 'The same edit as before: one line in `src/index.ts`. This time Docker walks down checking each layer’s hash — and the first four are unchanged, because `src/` is not part of any of them.',
    },
    2600,
    [
      { p: 'out', op: 'clear' },
      mark('g1', 'ok', 'CACHED'),
      mark('g2', 'ok', 'CACHED'),
      mark('g3', 'ok', 'CACHED', 'package.json không đổi'),
      out('$ docker build -t api .   # sau khi sửa 1 dòng', 'info'),
      out('=> [1/6] FROM node:22-alpine    CACHED', 'ok'),
      out('=> [3/6] COPY package*.json ./  CACHED', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'hit',
    { vi: 'npm ci CACHED — 0 giây', en: 'npm ci CACHED — 0 seconds' },
    {
      vi: 'Đây là khoảnh khắc đáng giá của cả bài. Tầng `npm ci` được dùng lại nguyên vẹn, vì mọi thứ nằm trên nó đều y hệt lần build trước. Không tải lại một gói nào. 602 gói vẫn ở đó, nằm sẵn trong tầng cũ.',
      en: 'This is the moment the whole lesson is about. The `npm ci` layer is reused wholesale, because everything above it is byte-identical to the previous build. Not one package is re-fetched. All 602 are already sitting in the old layer.',
    },
    3000,
    [
      mark('g4', 'ok', 'CACHED · 0s', '602 gói dùng lại, không tải gì'),
      out('=> [4/6] RUN npm ci            CACHED', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'So sánh trực tiếp với bản trước: cùng thao tác sửa, một bên 85s một bên 0s.',
        en: 'Compare directly with the previous run: same edit, 85s on one side, 0s on the other.',
      },
    }
  );

  push(
    'rebuild',
    { vi: 'Chỉ hai tầng cuối chạy lại — 42 giây', en: 'Only the last two layers rerun — 42 seconds' },
    {
      vi: '`COPY . .` vỡ (đúng như phải thế, mã có đổi thật) và `npm run build` chạy lại theo. Đó chính xác là phần công việc THẬT SỰ cần làm lại. Từ 127 giây xuống 42 giây, chỉ bằng cách đảo chỗ hai dòng — và khoản tiết kiệm này lặp lại ở mọi lần build về sau.',
      en: '`COPY . .` busts (correctly — the code really did change) and `npm run build` follows. That is exactly the work that genuinely needed redoing. From 127 seconds down to 42, purely by swapping two lines — and that saving repeats on every future build.',
    },
    2900,
    [
      mark('g5', 'warn', 'VỠ (đúng)', 'src/index.ts đổi thật'),
      mark('g6', 'warn', 'CHẠY LẠI 41s'),
      bar('sửa 1 dòng mã', 42, '42s', 'ok'),
      out('=> [5/6] COPY . .              4.2MB', 'warn'),
      out('=> [6/6] RUN npm run build     41.2s', 'warn'),
      out('Tổng: 42s   (bản kia: 127s)', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'rule',
    { vi: 'Quy tắc rút ra: xếp tầng theo TẦN SUẤT ĐỔI', en: 'The rule: order layers by HOW OFTEN THEY CHANGE' },
    {
      vi: 'Thứ ít đổi nhất lên trên cùng, thứ đổi nhiều nhất xuống dưới cùng. Ảnh nền gần như không đổi → đứng đầu. Phụ thuộc đổi vài tuần một lần → đứng giữa. Mã nguồn đổi vài phút một lần → đứng cuối. Áp quy tắc này cho mọi Dockerfile, không riêng Node: Python thì `requirements.txt`, Go thì `go.mod`, PHP thì `composer.json`.',
      en: 'Least-frequently-changed at the top, most-frequently-changed at the bottom. Base image almost never changes → first. Dependencies change every few weeks → middle. Source changes every few minutes → last. This rule holds for every Dockerfile, not just Node: `requirements.txt` for Python, `go.mod` for Go, `composer.json` for PHP.',
    },
    3000,
    [lines([])],
    {
      sfx: 'lock',
      teachingNote: {
        vi: 'Nhắc thêm: .dockerignore (node_modules, .git, .next) cũng thu nhỏ tầng COPY và tránh vỡ cache vô cớ.',
        en: 'Also mention: a .dockerignore (node_modules, .git, .next) shrinks the COPY layer and avoids gratuitous busts.',
      },
    }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const dockerLayersScenario: Scenario = {
  id: 'docker-layers',
  name: { vi: 'Docker — tầng ảnh và cache build', en: 'Docker — image layers and build cache' },
  tagline: {
    vi: 'Hai Dockerfile cho ra ảnh chạy giống hệt nhau, nhưng sửa một dòng mã thì một bên build lại mất 127 giây còn bên kia 42 giây. Khác biệt duy nhất là thứ tự hai dòng lệnh.',
    en: 'Two Dockerfiles produce identical running images, yet a one-line code edit costs 127 seconds to rebuild on one and 42 on the other. The only difference is the order of two instructions.',
  },
  icon: Layers,
  accent: '#38bdf8',
  group: 'devops',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'order',
      label: { vi: 'Thứ tự trong Dockerfile', en: 'Dockerfile order' },
      defaultValue: 'bad',
      choices: [
        {
          value: 'bad',
          label: 'COPY . . rồi npm ci',
          fullLabel: 'Thứ tự sai — mã nguồn nằm trên',
          color: '#f43f5e',
          hint: { vi: 'sửa 1 dòng → 127s', en: 'one-line edit → 127s' },
        },
        {
          value: 'good',
          label: 'package.json rồi npm ci',
          fullLabel: 'Thứ tự đúng — mã nguồn nằm dưới',
          color: '#34d399',
          hint: { vi: 'sửa 1 dòng → 42s', en: 'one-line edit → 42s' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.order === 'good' ? buildGood() : buildBad()),
};
