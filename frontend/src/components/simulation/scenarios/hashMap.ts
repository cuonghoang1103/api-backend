/**
 * OOP · CSD201 — HashMap hoạt động thế nào.
 *
 * Câu hỏi mở đầu nên là câu gây khó chịu: làm sao tìm được một khoá trong một
 * triệu khoá mà KHÔNG phải duyệt qua chúng? Mảng thì phải dò từng ô, cây tìm
 * kiếm thì log n. HashMap hứa hẹn O(1) — tức là tìm trong một triệu phần tử
 * nhanh y như tìm trong mười.
 *
 * Mẹo nằm ở chỗ: đừng TÌM, hãy TÍNH RA chỗ cần đến.
 *
 *   hàm băm biến khoá thành một số  →  chia lấy dư ra chỉ số ô  →  nhảy thẳng
 *
 * Ba chuyện đi kèm mà bài này phải nói rõ, vì thiếu chúng thì lời hứa O(1) sụp:
 *   - Va chạm là ĐIỀU CHẮC CHẮN XẢY RA, không phải trường hợp hiếm.
 *   - Bảng đầy dần thì va chạm tăng, nên phải nở ra và băm lại toàn bộ.
 *   - `equals` và `hashCode` phải nhất quán, nếu không đối tượng "biến mất"
 *     khỏi map dù nó vẫn nằm nguyên trong đó.
 */

import { Grid3x3 } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const LOOKUP_CODE = [
  'map.put("Nam", 25);',
  '',
  '// 1. băm khoá thành số',
  '   "Nam".hashCode()  →  2420395',
  '',
  '// 2. ép về chỉ số ô  (16 ô)',
  '   2420395 % 16      →  ô số 11',
  '',
  '// 3. nhảy thẳng tới ô 11 — không dò ô nào khác',
];

const COLLIDE_CODE = [
  'map.put("Nam", 25);   // → ô 11',
  'map.put("Lan", 30);   // → ô 11  ❗ trùng ô',
  '',
  '// Hai khoá khác nhau, cùng một ô.',
  '// Không phải lỗi — là chuyện chắc chắn xảy ra.',
  '',
  '// map.get("Lan"):',
  '//   tới ô 11 → so từng khoá trong ô bằng equals()',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'collide' ? { vi: 'Khi hai khoá trùng ô', en: 'When two keys share a bucket' } : { vi: 'Từ khoá tới chỗ ngồi', en: 'From key to slot' },
    file: 'HashMap.java',
    x: 0,
    y: 0,
    w: 486,
    h: 268,
    lines: opts.view === 'collide' ? COLLIDE_CODE : LOOKUP_CODE,
  },
  {
    id: 'steps',
    kind: 'lanes',
    title: { vi: 'Ba bước của một lần tra', en: 'The three steps of a lookup' },
    x: 0,
    y: 280,
    w: 486,
    h: 280,
    accent: '#a78bfa',
    layout: 'rows',
    lanes: [
      { id: 'hash', label: 'băm', sub: { vi: 'khoá → số', en: 'key → number' }, accent: '#f472b6' },
      { id: 'index', label: 'chia dư', sub: { vi: 'số → chỉ số ô', en: 'number → slot' }, accent: '#a78bfa' },
      { id: 'probe', label: 'trong ô', sub: { vi: 'so khoá bằng equals', en: 'compare keys with equals' }, accent: '#34d399' },
    ],
  },
  {
    id: 'table',
    kind: 'table',
    title: { vi: 'Bảng băm — 16 ô', en: 'The hash table — 16 buckets' },
    hint: { vi: 'ô trống vẫn chiếm chỗ, đó là cái giá của tốc độ', en: 'empty slots still cost memory — the price of speed' },
    x: 498,
    y: 0,
    w: 502,
    h: 340,
    accent: '#38bdf8',
    columns: [
      { key: 'i', label: 'ô', flex: 0.4 },
      { key: 'v', label: 'đang chứa', flex: 1.6 },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả', en: 'Result' },
    file: 'java',
    x: 498,
    y: 352,
    w: 502,
    h: 208,
    accent: '#34d399',
    maxLines: 5,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const slot = (id: string, i: string, v: string, tone: Tone): PanelOp => ({
  p: 'table',
  op: 'push',
  item: { id, label: i, cells: [i, v], tone },
});
const restain = (id: string, tone: Tone, badge?: string): PanelOp => ({ p: 'table', op: 'tone', key: id, tone, badge });
const wipe = (): PanelOp => ({ p: 'table', op: 'clear' });
const stepIn = (lane: string, label: string, sub: string, tone: Tone = 'info'): PanelOp[] => [
  { p: 'steps', op: 'clear', lane },
  { p: 'steps', op: 'push', lane, item: { label, sub, tone } },
];

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — TỪ KHOÁ TỚI CHỖ NGỒI ────────────────────────────────── */

function buildLookup(): SimStep[] {
  const { steps, push } = collector();

  push(
    'problem',
    { vi: 'Bài toán: tìm trong một triệu khoá mà không duyệt', en: 'The problem: find among a million keys without searching' },
    {
      vi: 'Với mảng chưa sắp xếp, tìm một khoá phải dò trung bình nửa triệu ô. Với cây tìm kiếm cân bằng thì khoảng hai mươi lần so sánh. HashMap hứa hẹn một con số không đổi — và cách nó làm được không phải tìm nhanh hơn, mà là KHÔNG TÌM.',
      en: 'In an unsorted array, finding a key means probing half a million cells on average. In a balanced search tree, about twenty comparisons. A HashMap promises a constant — and it achieves that not by searching faster, but by NOT SEARCHING.',
    },
    2700,
    [
      lines([1]),
      slot('s0', '0', '(trống)', 'muted'),
      slot('s1', '…', '', 'muted'),
      slot('s2', '11', '(trống)', 'muted'),
      out('cần: tìm "Nam" trong 1.000.000 khoá', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'hash',
    { vi: 'Bước 1 — hàm băm biến khoá thành một con số', en: 'Step 1 — the hash function turns the key into a number' },
    {
      vi: '`"Nam".hashCode()` nhai từng ký tự và trộn ra một số nguyên: 2420395. Hàm này phải THUẦN — cùng chuỗi luôn cho cùng số, mọi lúc — nếu không thì lần sau bạn sẽ đi tìm ở một chỗ khác với chỗ đã cất. Và nó phải trải đều: hai khoá gần giống nhau nên cho hai số cách xa nhau.',
      en: 'The `"Nam".hashCode()` chews through each character and mixes out an integer: 2420395. This function must be PURE — the same string always yields the same number, every time — otherwise next time you would look somewhere other than where you stored it. And it must spread well: two similar keys should give two distant numbers.',
    },
    3000,
    [
      lines([3, 4]),
      ...stepIn('hash', '"Nam" → 2420395', 'luôn ra cùng số này', 'ok'),
      out('hashCode("Nam") = 2420395', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'index',
    { vi: 'Bước 2 — ép con số đó về một trong 16 ô', en: 'Step 2 — fold that number into one of 16 slots' },
    {
      vi: 'Bảng chỉ có 16 ô, mà số băm thì cỡ hai triệu. Phép chia lấy dư kéo nó về khoảng hợp lệ: `2420395 % 16 = 11`. Đây là toàn bộ phép thuật — một phép chia dư, và bạn đã biết phải đi đâu, không cần nhìn vào ô nào khác.',
      en: 'The table has only 16 slots while the hash is in the millions. A modulo folds it into range: `2420395 % 16 = 11`. That is the whole trick — one modulo, and you know exactly where to go without looking at any other slot.',
    },
    2900,
    [
      lines([6, 7]),
      ...stepIn('index', '2420395 % 16 = 11', 'ra ngay chỉ số ô', 'ok'),
      restain('s2', 'active', 'đích'),
      out('→ ô số 11', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'store',
    { vi: 'Bước 3 — cất vào ô 11, và tra cũng đi đúng đường đó', en: 'Step 3 — store in slot 11, and lookups take the same road' },
    {
      vi: 'Cặp `("Nam", 25)` nằm ở ô 11. Khi gọi `map.get("Nam")`, ba bước trên lặp lại y hệt và cho ra đúng ô 11. Không dò, không so sánh với khoá nào khác. Số phần tử trong map là mười hay một triệu cũng chẳng ảnh hưởng gì tới ba bước này — đó chính là ý nghĩa của O(1).',
      en: 'The pair `("Nam", 25)` sits in slot 11. When you call `map.get("Nam")` the same three steps repeat and land on slot 11 again. No probing, no comparison against other keys. Whether the map holds ten entries or a million changes nothing about those three steps — that is what O(1) means.',
    },
    3000,
    [
      lines([9]),
      restain('s2', 'ok', ''),
      wipe(),
      slot('t0', '0', '(trống)', 'muted'),
      slot('t11', '11', '"Nam" → 25', 'ok'),
      slot('t15', '15', '(trống)', 'muted'),
      ...stepIn('probe', 'ô 11', 'lấy ra ngay', 'ok'),
      out('map.get("Nam") → 25 · không dò ô nào khác', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Nhấn: O(1) không có nghĩa là "nhanh", mà là "không phụ thuộc số phần tử".',
        en: 'Stress: O(1) does not mean "fast", it means "independent of how many elements".',
      },
    }
  );

  push(
    'cost',
    { vi: 'Cái giá: ô trống vẫn tốn bộ nhớ, và mất thứ tự', en: 'The price: empty slots still cost memory, and order is lost' },
    {
      vi: 'Bảng phải rộng hơn số phần tử thì mới thưa, mà thưa thì mới ít va chạm — nên luôn có những ô trống nằm đó tốn chỗ. Ngoài ra thứ tự duyệt HashMap là thứ tự các ô, không phải thứ tự bạn thêm vào; muốn giữ thứ tự thêm thì dùng `LinkedHashMap`, muốn sắp theo khoá thì `TreeMap` (đổi lại O(log n)).',
      en: 'The table must be wider than the number of entries to stay sparse, and sparse is what keeps collisions rare — so empty slots always sit there consuming memory. Also, iteration order is slot order, not insertion order; use `LinkedHashMap` to keep insertion order, or `TreeMap` for sorted keys (at O(log n)).',
    },
    3100,
    [out('16 ô cho 1 phần tử · 15 ô trống vẫn tốn RAM', 'warn'), out('thứ tự duyệt = thứ tự ô, KHÔNG phải thứ tự thêm', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'next',
    { vi: 'Nhưng 16 ô mà thêm khoá thứ hai thì sao?', en: 'But what happens when a second key wants slot 11?' },
    {
      vi: 'Với 16 ô và một hàm băm bất kỳ, chỉ cần vài khoá là đã có hai cái rơi vào cùng một ô. Đó không phải trường hợp xui hiếm gặp — nó là điều chắc chắn xảy ra, và mọi HashMap đều phải có sẵn cách xử lý. Chọn nhánh bên cạnh để xem.',
      en: 'With 16 slots and any hash function, a handful of keys is enough for two to land in the same slot. This is not rare bad luck — it is a certainty, and every HashMap must have an answer ready. Pick the other option to see it.',
    },
    2800,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — VA CHẠM VÀ NỞ BẢNG ──────────────────────────────────── */

function buildCollide(): SimStep[] {
  const { steps, push } = collector();

  push(
    'two',
    { vi: 'Hai khoá khác nhau rơi vào cùng một ô', en: 'Two different keys land in the same slot' },
    {
      vi: '"Nam" ra ô 11, và "Lan" cũng ra ô 11. Chuyện này không hiếm chút nào: với 16 ô, chỉ cần khoảng 5 khoá là xác suất có va chạm đã vượt 50% — cùng nguyên lý với nghịch lý ngày sinh. Bảng càng nhỏ so với số khoá thì va chạm càng dày.',
      en: '"Nam" maps to slot 11, and so does "Lan". This is not rare at all: with 16 slots, around 5 keys already push the chance of a collision past 50% — the same principle as the birthday paradox. The smaller the table relative to the key count, the denser the collisions.',
    },
    2900,
    [
      lines([1, 2]),
      slot('c11', '11', '"Nam" → 25', 'ok'),
      slot('c12', '11', '"Lan" → 30  ❗ cùng ô', 'warn'),
      out('"Nam" % 16 = 11 · "Lan" % 16 = 11', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: với 16 ô, cần bao nhiêu khoá để CHẮC CHẮN có va chạm? 17. Nhưng 50% thì chỉ cần 5.',
        en: 'Ask: with 16 slots, how many keys guarantee a collision? 17. But 50% odds need only 5.',
      },
    }
  );

  push(
    'chain',
    { vi: 'Cách xử lý: xâu chúng lại trong cùng một ô', en: 'The fix: chain them inside the same slot' },
    {
      vi: 'Mỗi ô không giữ một cặp, mà giữ một danh sách. Cả hai cặp cùng nằm ở ô 11, nối tiếp nhau. Không mất dữ liệu, không ghi đè — chỉ là ô đó giờ có hai người ngồi chung.',
      en: 'Each slot holds not one entry but a small list. Both pairs live in slot 11, one after the other. Nothing is lost and nothing is overwritten — the slot simply now seats two.',
    },
    2800,
    [
      wipe(),
      slot('d10', '10', '(trống)', 'muted'),
      slot('d11', '11', '"Nam"→25  →  "Lan"→30', 'warn'),
      slot('d12', '12', '(trống)', 'muted'),
      out('ô 11 giữ danh sách 2 phần tử', 'info'),
    ],
    { sfx: 'stream' }
  );

  push(
    'equals',
    { vi: 'Và đây là lúc equals() vào cuộc', en: 'And this is where equals() enters' },
    {
      vi: '`map.get("Lan")` tới được ô 11 nhờ băm, nhưng trong ô có hai khoá nên phải so từng cái bằng `equals` để biết lấy cái nào. Nghĩa là băm chỉ đưa bạn tới ĐÚNG Ô, còn `equals` mới xác định ĐÚNG KHOÁ. Cả hai đều cần, và đây là lý do chúng phải nhất quán với nhau.',
      en: 'A `map.get("Lan")` reaches slot 11 via the hash, but the slot holds two keys, so it compares each with `equals` to pick the right one. The hash gets you to the right SLOT; `equals` identifies the right KEY. Both are needed — which is exactly why they must agree with each other.',
    },
    3100,
    [
      lines([7, 8]),
      restain('d11', 'active', 'so 2 khoá'),
      out('tới ô 11 → equals("Nam")? không → equals("Lan")? có', 'ok'),
      out('map.get("Lan") → 30', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'contract',
    { vi: 'Hợp đồng bị phá: đối tượng "biến mất" khỏi map', en: 'Breaking the contract: an object "vanishes" from the map' },
    {
      vi: 'Nếu bạn ghi đè `equals` mà quên `hashCode`, hai đối tượng bằng nhau sẽ cho hai mã băm khác nhau — nghĩa là chúng bị cất ở hai ô khác nhau. Bạn `put` một đối tượng vào rồi `get` bằng một đối tượng bằng nó, và nhận về `null` dù dữ liệu vẫn nằm nguyên trong map. Đây là lỗi rất khó tìm, vì mọi thứ trông đều đúng.',
      en: 'Override `equals` but forget `hashCode` and two equal objects produce two different hashes — meaning they are filed in two different slots. You `put` an object, then `get` with an equal one, and receive `null` even though the data is still sitting in the map. This bug is hard to find because everything looks correct.',
    },
    3200,
    [
      wipe(),
      slot('e3', '3', 'User(id=7)  ← đã put ở đây', 'ok'),
      slot('e9', '9', '(tìm ở đây)', 'err'),
      out('u1.equals(u2) = true · nhưng hashCode khác nhau', 'err'),
      out('map.get(u2) → null  (dữ liệu vẫn nằm ở ô 3)', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'resize',
    { vi: 'Bảng đầy dần → nở gấp đôi và băm lại toàn bộ', en: 'The table fills → double it and rehash everything' },
    {
      vi: 'Khi số phần tử vượt 75% số ô (hệ số tải mặc định), va chạm bắt đầu dày và các danh sách trong ô dài ra — O(1) trượt dần về O(n). Nên HashMap cấp bảng mới gấp đôi rồi tính lại chỉ số cho MỌI khoá, vì phép chia dư đổi khi số ô đổi. Lần nở này tốn O(n), nhưng vì gấp đôi mỗi lần nên chia đều ra vẫn là O(1) khấu hao.',
      en: 'Once entries exceed 75% of slots (the default load factor), collisions thicken and the per-slot lists grow — O(1) drifts toward O(n). So the HashMap allocates a table twice the size and recomputes the index for EVERY key, because the modulo changes when the slot count changes. That resize costs O(n), but since it doubles each time the amortised cost stays O(1).',
    },
    3200,
    [
      wipe(),
      slot('f1', '16 ô', '12 phần tử · đã 75%', 'warn'),
      slot('f2', '32 ô', 'băm lại toàn bộ 12 khoá', 'ok'),
      out('% 16 → % 32 · mọi khoá đổi chỗ', 'warn'),
      out('biết trước n → new HashMap<>(n) → khỏi nở lần nào', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'rules',
    { vi: 'Ba điều gói lại', en: 'Three things to take away' },
    {
      vi: 'Một: O(1) của HashMap là O(1) TRUNG BÌNH, với điều kiện hàm băm trải đều và bảng đủ thưa; băm dở thì mọi khoá dồn vào một ô và nó suy biến thành danh sách. Hai: ghi đè `equals` thì BẮT BUỘC ghi đè `hashCode`, và cả hai phải dùng cùng bộ trường. Ba: đừng dùng đối tượng khả biến làm khoá — sửa một trường sau khi đã `put` là mã băm đổi, và chính bạn cũng không tìm lại được nó nữa.',
      en: 'One: a HashMap’s O(1) is an AVERAGE, conditional on a well-spread hash and a sparse enough table; a poor hash funnels every key into one slot and it degenerates into a list. Two: if you override `equals` you MUST override `hashCode`, and both must use the same fields. Three: never use a mutable object as a key — change a field after `put` and the hash changes, and even you cannot find it again.',
    },
    3200,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

export const hashMapScenario: Scenario = {
  id: 'hash-map',
  name: { vi: 'HashMap — tìm trong một triệu khoá mà không duyệt', en: 'HashMap — finding among a million keys without searching' },
  tagline: {
    vi: 'Mẹo không phải tìm nhanh hơn, mà là TÍNH RA chỗ cần đến: băm khoá thành số, chia lấy dư ra chỉ số ô, nhảy thẳng. Va chạm thì chắc chắn xảy ra — và đó là lúc equals() vào cuộc.',
    en: 'The trick is not searching faster but COMPUTING where to go: hash the key to a number, fold it to a slot index, jump straight there. Collisions are a certainty — and that is where equals() comes in.',
  },
  icon: Grid3x3,
  accent: '#a78bfa',
  group: 'oop',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Phần nào', en: 'Which part' },
      defaultValue: 'lookup',
      choices: [
        {
          value: 'lookup',
          label: 'Từ khoá tới ô',
          fullLabel: 'Ba bước của một lần tra',
          color: '#a78bfa',
          hint: { vi: 'vì sao không phụ thuộc số phần tử', en: 'why size does not matter' },
        },
        {
          value: 'collide',
          label: 'Va chạm & nở bảng',
          fullLabel: 'equals/hashCode và rehash',
          color: '#f43f5e',
          hint: { vi: 'đối tượng "biến mất" khỏi map', en: 'objects that "vanish" from the map' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'collide' ? buildCollide() : buildLookup()),
};
