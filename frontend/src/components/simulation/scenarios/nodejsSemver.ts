/**
 * Node.js · Bài 4.2 — Semver và lockfile.
 *
 * Giáo trình gọi đây là "nguồn gốc phổ biến nhất của câu *máy tôi chạy được
 * mà*". Không phải phép màu, cũng không phải xui — nó là một ký hiệu khoảng
 * phiên bản trong `package.json` mà hầu hết mọi người chưa đọc kỹ.
 *
 * Số liệu lấy nguyên từ bài (npm view thật):
 *   ^4.18.0 → 4.22.2   (minor ĐƯỢC nhích: 4.18 → 4.22)
 *   ~4.18.0 → 4.18.3   (chỉ patch)
 *    4.18.0 → 4.18.0   (đúng một bản)
 *
 * Và thí nghiệm hai người: `npm ci` cho 4.18.0, còn xoá lockfile rồi
 * `npm install` cho 4.22.2 — không ai sửa `package.json`, cả hai đều tuân
 * thủ nó hoàn hảo, mà hai máy chạy hai bản mã khác nhau.
 */

import { GitBranch } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const RANGE_CODE = [
  '// package.json',
  '"dependencies": {',
  '  "express": "^4.18.0"      // ngoặc nhọn — mặc định của npm',
  '}',
  '',
  '$ npm view "express@^4.18.0" version',
  '$ npm view "express@~4.18.0" version',
  '$ npm view "express@4.18.0"  version',
];

const LOCK_CODE = [
  '// package.json  → "express": "^4.18.0"',
  '// package-lock.json ghim  4.18.0',
  '',
  '# Đồng nghiệp clone repo rồi:',
  '$ npm ci',
  '',
  '# Người khác lỡ tay:',
  '$ rm package-lock.json && npm install',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Yêu cầu phiên bản', en: 'The version requirement' },
    x: 0,
    y: 0,
    w: 452,
    h: 262,
    lines: opts.demo === 'lock' ? LOCK_CODE : RANGE_CODE,
  },
  {
    id: 'resolve',
    kind: 'table',
    title: { vi: 'Khoảng phiên bản thật sự cho phép gì', en: 'What each range really allows' },
    x: 0,
    y: 274,
    w: 452,
    h: 286,
    accent: '#f59e0b',
    columns: [
      { key: 'r', label: 'viết trong package.json', flex: 1.1 },
      { key: 'g', label: 'nhận được', flex: 1 },
    ],
  },
  {
    id: 'tree',
    kind: 'tree',
    title: { vi: 'Cây phụ thuộc thật sự cài về', en: 'The dependency tree actually installed' },
    hint: { vi: 'package.json chỉ khai 1 dòng', en: 'package.json declares one line' },
    x: 464,
    y: 0,
    w: 536,
    h: 340,
    accent: '#34d399',
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả', en: 'Result' },
    x: 464,
    y: 352,
    w: 536,
    h: 208,
    accent: '#34d399',
    maxLines: 5,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const row = (id: string, a: string, b: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'resolve',
  op: 'push',
  item: { id, label: a, cells: [a, b], tone },
});
const node = (id: string, label: string, depth: number, sub?: string, badge?: string, tone: 'ok' | 'warn' | 'err' | 'muted' | 'info' = 'ok'): PanelOp => ({
  p: 'tree',
  op: 'push',
  item: { id, label, depth, sub, badge, tone },
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — BA KÝ HIỆU KHOẢNG
   ──────────────────────────────────────────────────────────── */

function buildRanges(): SimStep[] {
  const { steps, push } = collector();

  push(
    'read',
    { vi: 'Đọc một số phiên bản: 4 . 18 . 2', en: 'Reading a version number: 4 . 18 . 2' },
    {
      vi: 'MAJOR đổi là có thay đổi phá vỡ — mã của bạn có thể ngừng chạy. MINOR là tính năng mới, tương thích ngược. PATCH chỉ sửa lỗi. Ba con số, ba mức hứa hẹn khác nhau.',
      en: 'A MAJOR bump means breaking changes — your code may stop working. MINOR means new features, backward compatible. PATCH is bug fixes only. Three numbers, three different promises.',
    },
    2300,
    [
      lines([1, 2, 3, 4]),
      node('n0', 'express', 0, '4.18.2', 'MAJOR . MINOR . PATCH', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'caret',
    { vi: '^4.18.0 → nhận 4.22.2', en: '^4.18.0 → resolves to 4.22.2' },
    {
      vi: 'Ngoặc nhọn là MẶC ĐỊNH của npm, và nó rộng hơn người ta tưởng: "bất kỳ bản 4.x.x nào từ 4.18.0 trở lên". Cả MINOR lẫn PATCH đều được nhích — ở ví dụ này là nhảy qua bốn bản minor.',
      en: 'The caret is npm’s DEFAULT, and it is wider than people assume: "any 4.x.x from 4.18.0 upward". Both MINOR and PATCH may move — four minor versions in this example.',
    },
    2600,
    [lines([6]), row('r1', '^4.18.0', '4.22.2   (+4 minor)', 'warn'), out('^4.18.0    → 4.22.2', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'tilde',
    { vi: '~4.18.0 → nhận 4.18.3', en: '~4.18.0 → resolves to 4.18.3' },
    {
      vi: 'Dấu ngã chỉ cho PATCH nhích: "bất kỳ bản 4.18.x nào". Chặt hơn hẳn ngoặc nhọn, và thường là thứ người ta THỰC SỰ muốn khi viết ngoặc nhọn.',
      en: 'The tilde only lets PATCH move: "any 4.18.x". Much tighter than the caret, and usually what people actually meant when they wrote a caret.',
    },
    2400,
    [lines([7]), row('r2', '~4.18.0', '4.18.3   (chỉ patch)', 'ok'), out('~4.18.0    → 4.18.3')],
    { sfx: 'ping' }
  );

  push(
    'exact',
    { vi: '4.18.0 → nhận đúng 4.18.0', en: '4.18.0 → resolves to exactly 4.18.0' },
    {
      vi: 'Không ký hiệu nào cả nghĩa là đúng bản đó, mãi mãi. Nghe an toàn nhất, nhưng cũng nghĩa là bản vá bảo mật không tự về — bạn phải tự nâng.',
      en: 'No symbol at all means that version, forever. It sounds safest, but it also means security patches never arrive on their own — you must bump it yourself.',
    },
    2400,
    [lines([8]), row('r3', '4.18.0', '4.18.0   (đúng một bản)', 'ok'), out('4.18.0     → 4.18.0')],
    { sfx: 'blip' }
  );

  push(
    'tree',
    { vi: 'Một dòng khai báo, cả một cây được cài', en: 'One declared line, a whole tree installed' },
    {
      vi: '`package.json` chỉ nhắc tới `express`. Nhưng express kéo theo phụ thuộc của nó, và những cái đó lại kéo theo phụ thuộc của chúng. `package.json` KHÔNG hề nói gì về các tầng dưới — mà đó mới là nơi phần lớn mã thật sự chạy trong ứng dụng của bạn.',
      en: 'The `package.json` mentions only `express`. But express pulls its own dependencies, and those pull theirs. `package.json` says NOTHING about the deeper layers — and that is where most of the code actually running in your app lives.',
    },
    2800,
    [
      // Dọn node "giải phẫu số phiên bản" của bước đầu: để lại thì cạnh cây
      // thật có hai dòng express với hai số khác nhau, gây hiểu nhầm.
      { p: 'tree', op: 'clear' },
      node('t0', 'my-app', 0, 'package.json', '1 dòng khai báo', 'info'),
      node('t1', 'express', 1, '4.22.2', '^4.18.0', 'warn'),
      node('t2', 'body-parser', 2, '1.20.3', '~1.20.0', 'muted'),
      node('t3', 'bytes', 3, '3.1.2', '3.1.2', 'muted'),
      node('t4', 'qs', 2, '6.13.0', '^6.11.0', 'muted'),
      node('t5', 'send', 2, '0.19.0', '0.19.0', 'muted'),
    ],
    {
      sfx: 'stream',
      teachingNote: {
        vi: 'Hỏi lớp: trong cây này, bao nhiêu dòng do BẠN viết ra trong package.json?',
        en: 'Ask the class: how many of these lines did YOU write in package.json?',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Đây là lý do lockfile tồn tại', en: 'This is why the lockfile exists' },
    {
      vi: '`package-lock.json` ghi lại phiên bản CHÍNH XÁC và mã băm toàn vẹn của MỌI gói trong cây — kể cả phụ thuộc của phụ thuộc, thứ mà `package.json` không nói tới. Chọn "npm ci hay npm install" để xem chuyện gì xảy ra khi thiếu nó.',
      en: '`package-lock.json` records the EXACT version and integrity hash of every package in the tree — including your dependencies’ dependencies, which `package.json` never mentions. Pick "npm ci or npm install" to see what happens without it.',
    },
    2700,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — npm ci HAY npm install
   ──────────────────────────────────────────────────────────── */

function buildLock(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Một dự án tạo từ hồi 4.18.0 còn mới', en: 'A project created back when 4.18.0 was current' },
    {
      vi: '`package.json` ghi `^4.18.0`, còn lockfile ghim đúng `4.18.0`. Cả hai đều đúng và không mâu thuẫn — lockfile chỉ đang chọn MỘT điểm bên trong khoảng mà package.json cho phép.',
      en: 'The `package.json` says `^4.18.0`, and the lockfile pins exactly `4.18.0`. Both are correct and consistent — the lockfile is simply picking ONE point inside the range package.json permits.',
    },
    2400,
    [
      lines([1, 2]),
      node('a0', 'package.json', 0, '"express": "^4.18.0"', 'khoảng', 'info'),
      node('a1', 'package-lock.json', 0, 'express 4.18.0', 'ghim', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'ci',
    { vi: 'npm ci — cài ĐÚNG lockfile', en: 'npm ci — installs EXACTLY the lockfile' },
    {
      vi: 'Xoá `node_modules` trước, không giải khoảng phiên bản, không bao giờ ghi lại lockfile, và BÁO LỖI nếu package.json với lockfile mâu thuẫn. Đồng nghiệp nhận đúng 4.18.0 — y hệt cả đội.',
      en: 'Deletes `node_modules` first, resolves nothing, never rewrites the lockfile, and FAILS if package.json and the lockfile disagree. The colleague gets exactly 4.18.0 — identical to everyone else.',
    },
    2600,
    [
      lines([4, 5]),
      node('b1', 'express', 1, '4.18.0', '✅ khớp cả đội', 'ok'),
      row('c1', 'npm ci', '4.18.0  ✅', 'ok'),
      out('nhận được: 4.18.0   ✅ giống hệt cả đội', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'install',
    { vi: 'Xoá lockfile rồi npm install — nhận 4.22.2', en: 'Delete the lockfile, npm install — gets 4.22.2' },
    {
      vi: 'Không có lockfile, npm phải GIẢI lại khoảng `^4.18.0` từ đầu, và hôm nay khoảng đó dẫn tới 4.22.2. Không ai sửa `package.json`. Cả hai lệnh đều tuân thủ nó hoàn hảo.',
      en: 'With no lockfile, npm must RESOLVE `^4.18.0` from scratch, and today that range leads to 4.22.2. Nobody edited `package.json`. Both commands obeyed it perfectly.',
    },
    2800,
    [
      lines([7, 8]),
      node('b2', 'express', 1, '4.22.2', '⚠️ nhanh hơn 4 minor', 'warn'),
      row('c2', 'rm lock && npm install', '4.22.2  ⚠️', 'err'),
      out('nhận được: 4.22.2   ⚠️ nhanh hơn cả đội 4 bản minor', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Đây chính là câu "máy tôi chạy được mà" — và không ai làm gì sai cả.',
        en: 'This is "but it works on my machine" — and nobody did anything wrong.',
      },
    }
  );

  push(
    'diverged',
    { vi: 'Hai máy, hai bản mã, không ai làm sai', en: 'Two machines, two builds, nobody at fault' },
    {
      vi: 'Và bất kỳ lỗi nào chỉ xuất hiện trên MỘT trong hai máy sẽ khiến cả nhóm bối rối cho tới khi có người nghĩ tới việc so phiên bản. Điều tệ nhất: lỗi đó thường xuất hiện ở tầng phụ thuộc-của-phụ-thuộc, nơi không ai nhìn.',
      en: 'And any bug that appears on just ONE of them will baffle the team until somebody thinks to compare versions. The worst part: such bugs usually live a layer deeper, in a dependency of a dependency nobody looks at.',
    },
    2700,
    [
      node('d1', 'lỗi chỉ có ở máy B', 1, 'qs 6.13.0 đổi cách phân tích mảng', undefined, 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'verdict',
    { vi: 'Luật: npm ci ở mọi nơi, trừ khi cố ý đổi phụ thuộc', en: 'Rule: npm ci everywhere, except when deliberately changing dependencies' },
    {
      vi: 'CI dùng `npm ci`, Docker dùng `npm ci`, và bạn cũng nên dùng `npm ci` mỗi khi chỉ muốn dự án chạy được. Nó còn NHANH HƠN vì bỏ hẳn bước giải khoảng. `npm install` để dành cho đúng lúc thêm hoặc nâng một gói — và commit lockfile ngay sau đó.',
      en: 'CI uses `npm ci`, Docker uses `npm ci`, and so should you whenever you just want the project running. It is also FASTER because it skips resolution entirely. Save `npm install` for the moment you actually add or upgrade a package — and commit the lockfile right after.',
    },
    2900,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsSemverScenario: Scenario = {
  id: 'nodejs-semver',
  name: { vi: 'Semver và lockfile', en: 'Semver and the lockfile' },
  tagline: {
    vi: 'Cùng một package.json, hai người cài ra hai phiên bản khác nhau — 4.18.0 và 4.22.2 — mà cả hai đều tuân thủ nó hoàn hảo. Đây là nguồn gốc của câu "máy tôi chạy được mà".',
    en: 'The same package.json, two people, two different versions installed — 4.18.0 and 4.22.2 — and both obeyed it perfectly. This is where "but it works on my machine" comes from.',
  },
  icon: GitBranch,
  accent: '#f59e0b',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '4.2',
    slug: 'nodejs-4-2-semver-lockfile',
    title: { vi: 'Semver và lockfile', en: 'Semver and the lockfile' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'demo',
      label: { vi: 'Thí nghiệm', en: 'Experiment' },
      defaultValue: 'ranges',
      choices: [
        {
          value: 'ranges',
          label: 'Ba ký hiệu khoảng',
          fullLabel: '^ so với ~ so với đúng bản',
          color: '#f59e0b',
          hint: { vi: 'ngoặc nhọn rộng hơn bạn tưởng', en: 'the caret is wider than you think' },
        },
        {
          value: 'lock',
          label: 'npm ci hay npm install',
          fullLabel: 'Hai người, hai phiên bản',
          color: '#f43f5e',
          hint: { vi: '4.18.0 so với 4.22.2, không ai sai', en: '4.18.0 vs 4.22.2, nobody at fault' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.demo === 'lock' ? buildLock() : buildRanges()),
};
