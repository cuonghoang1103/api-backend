/**
 * Node.js · Bài 7.4 — Quan hệ, và bẫy N+1 đo bằng số thật.
 *
 * Số đo lấy nguyên từ giáo trình (50 người dùng · 1000 ghi chú, đếm câu lệnh
 * bằng sự kiện `query` của Prisma nên không phải ước lượng):
 *
 *   A. vòng lặp (N+1)            79 ms · 51 truy vấn
 *   B. include                   14 ms ·  2 truy vấn
 *   C. findMany + gom bằng Map   12 ms ·  2 truy vấn
 *   D. groupBy (chỉ đếm)          5 ms ·  1 truy vấn
 *   E. include + select 2 cột     3 ms ·  2 truy vấn   (nhanh hơn A 26 lần)
 *
 *   đủ mọi cột   : 322,1 KB      select 4 cột : 50,1 KB   (nhỏ hơn 6,4 lần)
 *
 * Bài học KHÔNG nằm ở 79 ms — trên cùng một máy thì 79 ms còn chịu được. Bài
 * học nằm ở chỗ 51 lượt đi về nhân với độ trễ mạng: đẩy cơ sở dữ liệu ra xa
 * một mili-giây thôi là A trả thêm 51 ms còn B trả thêm 2 ms. Vì vậy đồng hồ
 * "số câu lệnh SQL" mới là nguyên thuỷ chính của kịch bản này, không phải
 * đồng hồ mili-giây: số câu lệnh là thứ ta điều khiển được, thời gian chỉ là
 * hệ quả của nó nhân với một con số mà ta không điều khiển được.
 */

import { Repeat } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const LOOP_CODE = [
  '// A. vòng lặp — con bug đang săn',
  'const users = await prisma.user.findMany();',
  '',
  'for (const u of users) {',
  '  const notes = await prisma.note.findMany({',
  '    where: { authorId: u.id },',
  '  });',
  '}',
];

const INCLUDE_CODE = [
  '// B. một lời gọi Prisma',
  'await prisma.user.findMany({',
  '  include: { notes: true },',
  '});',
  '',
  '// C. gom trong bộ nhớ — vẫn 2 truy vấn',
  'const byUser = new Map(users.map(u => [u.id, []]));',
  'for (const n of notes) byUser.get(n.authorId)?.push(n);',
  '',
  '// D. chỉ cần số lượng',
  "await prisma.note.groupBy({ by: ['authorId'],",
  '  _count: { _all: true } });',
];

const COLUMNS_CODE = [
  '// sai: 1000 dòng chạy qua mạng để gọi .length',
  'await prisma.user.findMany({ include: { notes: true } });',
  '',
  '// E. chỉ lấy cột cần dùng',
  'await prisma.user.findMany({',
  '  select: { id: true, name: true,',
  '    notes: { select: { id: true, title: true } } },',
  '});',
  '',
  '// hoặc bỏ đúng cột nặng, giữ mọi cột tương lai',
  'omit: { body: true }',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Đoạn mã', en: 'The code' },
    x: 0,
    y: 0,
    w: 452,
    h: 288,
    lines: opts.mode === 'include' ? INCLUDE_CODE : opts.mode === 'columns' ? COLUMNS_CODE : LOOP_CODE,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Một lần gọi endpoint tốn gì', en: 'What one endpoint call costs' },
    hint: { vi: '50 người dùng · 1000 ghi chú', en: '50 users · 1000 notes' },
    x: 0,
    y: 300,
    w: 452,
    h: 260,
    accent: '#f59e0b',
    meters: [
      { id: 'sql', label: 'Số câu lệnh SQL gửi đi', max: 51, unit: 'truy vấn', accent: '#f43f5e' },
      { id: 'ms', label: 'Thời gian (CSDL cùng máy)', max: 80, unit: 'ms', threshold: 15, thresholdLabel: 'ngưỡng dễ chịu', accent: '#f59e0b' },
      { id: 'kb', label: 'JSON trả về', max: 330, unit: 'KB', accent: '#38bdf8' },
    ],
  },
  {
    id: 'cost',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Cùng một kết quả, năm cách hỏi (ms)', en: 'Same result, five ways to ask (ms)' },
    hint: { vi: 'cùng 50 người dùng và 1000 ghi chú', en: 'same 50 users and 1000 notes' },
    x: 464,
    y: 0,
    w: 536,
    h: 348,
    accent: '#f43f5e',
    unit: 'ms',
    max: 84,
  },
  {
    id: 'log',
    kind: 'log',
    title: { vi: 'Log truy vấn của Prisma', en: "Prisma's query log" },
    file: 'prisma.$on("query")',
    x: 464,
    y: 360,
    w: 536,
    h: 200,
    accent: '#34d399',
    maxLines: 7,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const log = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({
  p: 'log',
  op: 'push',
  item: { label, tone },
});
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
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
   A — VÒNG LẶP: 1 + 50 TRUY VẤN
   ──────────────────────────────────────────────────────────── */

function buildLoop(): SimStep[] {
  const { steps, push } = collector();

  push(
    'parents',
    { vi: 'Truy vấn thứ nhất — lấy 50 người dùng', en: 'Query one — fetch the 50 users' },
    {
      vi: 'Một câu lệnh, mọi thứ đều ổn. Đây là chữ "1" trong tên gọi N+1, và cũng là câu lệnh duy nhất mà người viết code có ý định gửi đi.',
      en: 'One statement, everything fine. This is the "1" in the name N+1, and it is also the only statement the author of this code meant to send.',
    },
    2400,
    [
      lines([2]),
      gauge('sql', 1, '1 truy vấn', 'ok'),
      gauge('ms', 1.6, '1,6 ms', 'ok'),
      gauge('kb', 0, '—'),
      log('SELECT "User"."id", "User"."email", … FROM "User"'),
    ],
    { sfx: 'click' }
  );

  push(
    'loop1',
    { vi: 'Vòng lặp chạy — người dùng #1', en: 'The loop runs — user #1' },
    {
      vi: 'Chữ `await` nằm BÊN TRONG vòng `for`. Mỗi vòng là một lượt đi về cơ sở dữ liệu, và mỗi lượt phải chờ lượt trước xong. Truy vấn này nhanh: 0,4 ms. Đó chính là điều làm nó nguy hiểm — không có gì để mà nghi ngờ.',
      en: 'The `await` sits INSIDE the `for` loop. Every iteration is a round trip to the database, and every one waits for the previous. This query is fast: 0.4 ms. That is exactly what makes it dangerous — there is nothing to be suspicious of.',
    },
    2500,
    [
      lines([4, 5, 6, 7]),
      gauge('sql', 2, '2 truy vấn', 'ok'),
      gauge('ms', 2.0, '2,0 ms', 'ok'),
      log('SELECT … FROM "Note" WHERE "authorId" = 1'),
    ],
    { sfx: 'blip' }
  );

  push(
    'loop2',
    { vi: '#2, #3, #4 … mỗi người một câu lệnh', en: '#2, #3, #4 … one statement each' },
    {
      vi: 'Không có câu lệnh nào chậm. Không có câu lệnh nào sai. Vòng lặp chỉ đang làm đúng thứ nó được bảo làm, năm mươi lần.',
      en: 'No statement is slow. No statement is wrong. The loop is simply doing what it was told, fifty times over.',
    },
    2400,
    [
      gauge('sql', 5, '5 truy vấn', 'warn'),
      gauge('ms', 8.4, '8,4 ms', 'ok'),
      log('SELECT … FROM "Note" WHERE "authorId" = 2'),
      log('SELECT … FROM "Note" WHERE "authorId" = 3'),
      log('SELECT … FROM "Note" WHERE "authorId" = 4'),
    ],
    { sfx: 'blip' }
  );

  push(
    'loop50',
    { vi: 'Hết vòng lặp — 51 truy vấn, 79 ms', en: 'Loop finished — 51 queries, 79 ms' },
    {
      vi: 'Một truy vấn cha cộng năm mươi truy vấn con. Đồng hồ bên trái là thứ đáng nhìn, không phải mili-giây: số câu lệnh SQL tăng theo SỐ DÒNG lấy về, mà số dòng thì tăng theo lượng người dùng thật.',
      en: 'One parent query plus fifty child queries. The left gauge is the one to watch, not the milliseconds: the SQL count grows with the NUMBER OF ROWS fetched, and that number grows with your real user count.',
    },
    2800,
    [
      gauge('sql', 51, '51 truy vấn', 'err'),
      gauge('ms', 79, '79 ms', 'err'),
      gauge('kb', 322.1, '322,1 KB', 'warn'),
      bar('A · vòng lặp', 79, '79', 'err'),
      log('… 50 câu lệnh "Note" tất cả …', 'err'),
      log('A. vòng lặp → 79 ms · 51 truy vấn · 1000 ghi chú', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Dừng ở đây: đọc đồng hồ SỐ CÂU LỆNH trước, mili-giây sau.',
        en: 'Pause here: read the STATEMENT COUNT gauge first, milliseconds second.',
      },
    }
  );

  push(
    'network',
    { vi: 'Giờ đặt cơ sở dữ liệu cách một mili-giây', en: 'Now put the database one millisecond away' },
    {
      vi: '79 ms đó đo trên cơ sở dữ liệu chạy NGAY TRÊN CÙNG MỘT MÁY, nơi một lượt đi về tốn khoảng 0,4 ms. Production không như vậy. Chỉ cần một mạng khiêm tốn 1 ms: A trả thêm 51 lượt ≈ +51 ms, B trả thêm 2 lượt ≈ +2 ms. Khoảng cách nới rộng theo mỗi người dùng bạn thêm vào — nên lỗi này luôn xuất hiện SAU khi ra mắt.',
      en: 'That 79 ms was measured with the database on the SAME MACHINE, where a round trip costs about 0.4 ms. Production is not like that. Add a modest 1 ms network: A pays 51 round trips ≈ +51 ms, B pays 2 ≈ +2 ms. The gap widens with every user you add — which is why this bug always shows up AFTER launch.',
    },
    3000,
    [
      lines([]),
      gauge('ms', 79, '79 ms + 51 ms mạng', 'err'),
      bar('A · +mạng 1ms', 79, '130', 'err'),
      log('mạng 1 ms → A ≈ 130 ms · B ≈ 16 ms', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'spot',
    { vi: 'Cách nhận ra nó khi review code', en: 'How to spot it in a code review' },
    {
      vi: 'Một chữ `await` gọi cơ sở dữ liệu nằm trong `for`, `map` hay `forEach` duyệt đúng những dòng vừa lấy về. Toàn bộ dấu hiệu chỉ có vậy. Nó cũng núp trong hàm phụ trợ: `await enrich(note)` trông vô hại cho tới khi bạn mở `enrich` ra. Chọn "include" để xem cách sửa.',
      en: 'An `await` on a database call inside a `for`, `map` or `forEach` over rows you just fetched. That is the entire signature. It also hides inside helpers: `await enrich(note)` looks harmless until you open `enrich`. Pick "include" to see the fix.',
    },
    2800,
    [lines([4, 5, 6, 7])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — HAI TRUY VẤN, VÀ CÁI `IN (…)`
   ──────────────────────────────────────────────────────────── */

function buildInclude(): SimStep[] {
  const { steps, push } = collector();

  push(
    'call',
    { vi: 'Một lời gọi Prisma, hai câu lệnh SQL', en: 'One Prisma call, two SQL statements' },
    {
      vi: 'Prisma mặc định KHÔNG sinh `JOIN`. Nó gửi một truy vấn cho mỗi cấp rồi ghép kết quả bằng JavaScript — nghe có vẻ tệ hơn join, nhưng hãy nhìn câu lệnh thứ hai.',
      en: 'Prisma does not emit a `JOIN` by default. It sends one query per level and stitches the results in JavaScript — which sounds worse than a join, until you look at the second statement.',
    },
    2400,
    [
      lines([2, 3, 4]),
      gauge('sql', 1, '1 truy vấn', 'ok'),
      gauge('ms', 1.6, '1,6 ms', 'ok'),
      gauge('kb', 0, '—'),
      log('SELECT "User"."id", "User"."email", … FROM "User"'),
    ],
    { sfx: 'click' }
  );

  push(
    'in',
    { vi: 'Câu lệnh thứ hai: `IN ($1,$2,…)`', en: 'Statement two: `IN ($1,$2,…)`' },
    {
      vi: 'Nó dùng `IN (…)` với TOÀN BỘ id cha vừa lấy được. Chính cái `IN` đó là toàn bộ mẹo: nó là khác biệt giữa hai lượt đi về và năm mươi mốt lượt. Cùng 1000 ghi chú trả về, cùng một kết quả cuối cùng.',
      en: 'It uses `IN (…)` with EVERY parent id it just fetched. That `IN` is the whole trick: it is the difference between two round trips and fifty-one. The same 1000 notes come back, the same final result.',
    },
    2800,
    [
      gauge('sql', 2, '2 truy vấn', 'ok'),
      gauge('ms', 14, '14 ms', 'ok'),
      gauge('kb', 322.1, '322,1 KB', 'warn'),
      bar('A · vòng lặp', 79, '79', 'err'),
      bar('B · include', 14, '14', 'ok'),
      log('SELECT … FROM "Note" WHERE "authorId" IN ($1,…,$50)', 'ok'),
      log('B. include → 14 ms · 2 truy vấn · 1000 ghi chú', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Hai truy vấn thay vì một join là đánh đổi CÓ CHỦ Ý — nói rõ ở bước sau.',
        en: 'Two queries instead of one join is a DELIBERATE trade — spelled out next.',
      },
    }
  );

  push(
    'tradeoff',
    { vi: 'Vì sao không phải một phép JOIN?', en: 'Why not a single JOIN?' },
    {
      vi: 'Join nhân bản dòng cha một lần cho mỗi dòng con: một người dùng có 20 ghi chú sẽ được gửi về hai mươi lần trên đường truyền. Hai truy vấn thì mỗi dòng chỉ gửi một lần. Với quan hệ sâu hoặc rộng, chiến lược hai truy vấn thường truyền ít dữ liệu hơn hẳn.',
      en: 'A join duplicates the parent row once per child: a user with 20 notes comes back twenty times over the wire. Two queries send each row exactly once. For deep or wide relations, the two-query strategy usually transfers far less data.',
    },
    2700,
    [lines([]), log('join: 1 người dùng × 20 ghi chú = 20 lần dòng cha', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'map',
    { vi: 'C — khi `include` không ra được hình dạng bạn cần', en: 'C — when `include` cannot give you the shape you need' },
    {
      vi: 'Lấy cả hai tập rồi ghép trong bộ nhớ: gom id lại, lấy một lần bằng `in`, lập chỉ mục theo khoá. Đây là mẫu "dataloader" ở dạng đơn giản nhất — vẫn đúng hai truy vấn, 12 ms.',
      en: 'Fetch both sets and join them in memory: collect the ids, fetch once with `in`, index by key. This is the "dataloader" pattern at its simplest — still exactly two queries, 12 ms.',
    },
    2600,
    [
      lines([7, 8]),
      gauge('sql', 2, '2 truy vấn', 'ok'),
      gauge('ms', 12, '12 ms', 'ok'),
      bar('C · Map', 12, '12', 'ok'),
      log('C. findMany + Map → 12 ms · 2 truy vấn', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'groupby',
    { vi: 'D — đừng tải về thứ bạn chỉ định ĐẾM', en: 'D — do not fetch what you are only going to COUNT' },
    {
      vi: 'Nếu màn hình chỉ hiện "12 ghi chú", đừng kéo 1000 dòng qua mạng để gọi `.length`. `groupBy` bắt cơ sở dữ liệu đếm và gửi về đúng 50 con số: một truy vấn, 5 ms. `include: { _count: … }` làm điều tương tự khi vẫn cần dòng cha.',
      en: 'If the screen only shows "12 notes", do not drag 1000 rows across the network to call `.length`. `groupBy` makes the database count and send back exactly 50 numbers: one query, 5 ms. `include: { _count: … }` does the same when you still need the parent rows.',
    },
    2800,
    [
      lines([11, 12]),
      gauge('sql', 1, '1 truy vấn', 'ok'),
      gauge('ms', 5, '5 ms', 'ok'),
      gauge('kb', 4.2, '4,2 KB', 'ok'),
      bar('D · groupBy', 5, '5', 'ok'),
      log('D. groupBy → 5 ms · 1 truy vấn · không cõng dòng nào', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'assert',
    { vi: 'Biến số đếm thành một bài test', en: 'Turn the count into a test' },
    {
      vi: '"Endpoint này được phép gửi tối đa 3 câu lệnh" là một khẳng định sẽ đỏ ngay ngày có người thêm một vòng lặp — và đó là cách duy nhất bắt được N+1 từ sớm. Đếm bằng chính sự kiện `query` mà log ở trên đang dùng. Đừng log mọi truy vấn trên production: tốn CPU thật, và nội dung truy vấn có thể chứa dữ liệu cá nhân.',
      en: '"This endpoint may issue at most 3 statements" is an assertion that goes red the day someone adds a loop — and that is the only way N+1 is ever caught early. Count using the same `query` event the log above is using. Do not log every query in production: it costs real CPU, and query text can contain personal data.',
    },
    2900,
    [lines([]), log('expect(queries).toBeLessThanOrEqual(3)  ✓', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — CỘT CHÍNH LÀ BĂNG THÔNG
   ──────────────────────────────────────────────────────────── */

function buildColumns(): SimStep[] {
  const { steps, push } = collector();

  push(
    'all',
    { vi: 'Đủ mọi cột — 322,1 KB', en: 'Every column — 322.1 KB' },
    {
      vi: 'Vẫn 50 người dùng và 1000 ghi chú đó, chuyển thành JSON như một API sẽ làm. Hai truy vấn, không có N+1 nào ở đây — nhưng endpoint vẫn nặng, vì mỗi dòng cõng theo cả trường `body`.',
      en: 'The same 50 users and 1000 notes, serialised to JSON as an API would. Two queries, no N+1 anywhere — and yet the endpoint is heavy, because every row carries the `body` field along.',
    },
    2500,
    [
      lines([2]),
      gauge('sql', 2, '2 truy vấn', 'ok'),
      gauge('ms', 14, '14 ms', 'warn'),
      gauge('kb', 322.1, '322,1 KB', 'err'),
      bar('mọi cột', 14, '14', 'warn'),
      log('đủ mọi cột   : 322,1 KB', 'warn'),
    ],
    { sfx: 'click' }
  );

  push(
    'select',
    { vi: 'select 4 cột — 50,1 KB, nhỏ hơn 6,4 lần', en: 'select 4 columns — 50.1 KB, 6.4× smaller' },
    {
      vi: 'Cùng số truy vấn, cùng số dòng, chỉ khác ở chỗ dòng nào cũng gọn hơn. Trường `body` mới là thứ ngốn tiền — một endpoint danh sách gần như không bao giờ cần tới nó, và một máy điện thoại đang dùng 4G thì chắc chắn là không.',
      en: 'Same query count, same row count, only every row is smaller. The `body` field is what costs you — a list endpoint almost never needs it, and a phone on 4G certainly does not.',
    },
    2800,
    [
      lines([5, 6, 7, 8]),
      gauge('kb', 50.1, '50,1 KB', 'ok'),
      gauge('ms', 3, '3 ms', 'ok'),
      bar('select 4 cột', 3, '3', 'ok'),
      log('select 4 cột :  50,1 KB   (nhỏ hơn 6,4 lần)', 'ok'),
      log('E. include + select → 3 ms · 2 truy vấn', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'e-vs-a',
    { vi: 'E nhanh hơn A 26 lần — và không có mẹo nào cả', en: 'E is 26× faster than A — and there is no trick' },
    {
      vi: '3 ms so với 79 ms. Không đổi cơ sở dữ liệu, không thêm chỉ mục, không thêm cache. Chỉ là hỏi ít lượt hơn và hỏi ít cột hơn. Hai đòn bẩy đó gần như luôn là hai đòn bẩy đầu tiên nên kéo.',
      en: '3 ms versus 79 ms. No new database, no new index, no cache. Just fewer round trips and fewer columns. Those two levers are almost always the first two to pull.',
    },
    2800,
    [
      bar('A · vòng lặp', 79, '79', 'err'),
      bar('E · select', 3, '3', 'ok'),
      log('A 79 ms → E 3 ms   (nhanh hơn 26 lần)', 'ok'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'So hai cột ngoài cùng: cùng dữ liệu trả về, chênh 26 lần.',
        en: 'Compare the outer two bars: identical data out, 26× apart.',
      },
    }
  );

  push(
    'omit',
    { vi: '`omit` là hình ảnh phản chiếu của `select`', en: '`omit` is the mirror image of `select`' },
    {
      vi: '`omit: { body: true }` giữ lại mọi cột thêm vào sau này một cách tự động trong khi vẫn bỏ đi cái cột bạn biết là nặng. Với `select` bạn phải nhớ bổ sung trường mới; với `omit` bạn phải nhớ loại trừ trường nặng mới. Chọn theo từng endpoint: `select` cho danh sách, `include` cho chi tiết.',
      en: '`omit: { body: true }` automatically keeps every column added later while dropping the one you know is heavy. With `select` you must remember to add new fields; with `omit` you must remember to exclude new heavy ones. Choose per endpoint: `select` for lists, `include` for details.',
    },
    2900,
    [lines([10, 11]), log('omit: { body: true } → cột mới tự động được giữ', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsNPlusOneScenario: Scenario = {
  id: 'nodejs-n-plus-1',
  name: { vi: 'Quan hệ và bẫy N+1', en: 'Relations and the N+1 trap' },
  tagline: {
    vi: 'Cùng 50 người dùng và 1000 ghi chú: vòng lặp gửi 51 câu lệnh SQL mất 79 ms, `include` gửi 2 câu mất 14 ms, `select` bốn cột còn 3 ms và 50,1 KB. Đếm câu lệnh chứ đừng đếm mili-giây — mili-giây chỉ là số câu lệnh nhân với độ trễ mạng.',
    en: 'The same 50 users and 1000 notes: the loop sends 51 SQL statements for 79 ms, `include` sends 2 for 14 ms, four selected columns cost 3 ms and 50.1 KB. Count statements, not milliseconds — milliseconds are just statements times network latency.',
  },
  icon: Repeat,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '7.4',
    slug: 'nodejs-7-4-quan-he-va-n-plus-1',
    title: { vi: 'Quan hệ, và bẫy N+1 đo bằng số thật', en: 'Relations, and the N+1 problem measured' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách đọc dữ liệu liên quan', en: 'How you read the relation' },
      defaultValue: 'loop',
      choices: [
        {
          value: 'loop',
          label: 'Vòng lặp',
          fullLabel: 'await trong for — 51 truy vấn, 79 ms',
          color: '#f43f5e',
          hint: { vi: 'mỗi truy vấn đều nhanh, endpoint vẫn chậm', en: 'every query is fast, the endpoint is still slow' },
        },
        {
          value: 'include',
          label: 'include',
          fullLabel: 'include / Map / groupBy — 2 truy vấn, 14 ms',
          color: '#34d399',
          hint: { vi: 'một chữ IN (…) thay cho năm mươi lượt đi về', en: 'one IN (…) instead of fifty round trips' },
        },
        {
          value: 'columns',
          label: 'select cột',
          fullLabel: 'Cột chính là băng thông — 322,1 KB → 50,1 KB',
          color: '#38bdf8',
          hint: { vi: 'cùng số truy vấn, nhỏ hơn 6,4 lần', en: 'same query count, 6.4× smaller' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'include' ? buildInclude() : opts.mode === 'columns' ? buildColumns() : buildLoop(),
};
