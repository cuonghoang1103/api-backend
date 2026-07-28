/**
 * OOP · PRO192 / CSD201 — bốn tính chất, nhìn từ bộ nhớ.
 *
 * Bốn tính chất OOP thường được dạy như bốn định nghĩa cần học thuộc, và chính
 * vì thế mà khó nhớ. Kịch bản này dựng chúng theo thứ tự chúng THẬT SỰ phụ
 * thuộc vào nhau, và cho thấy từng cái xảy ra ở đâu trong bộ nhớ:
 *
 *   Đóng gói (encapsulation) — dữ liệu và hàm thao tác lên nó nằm chung một
 *       chỗ, và bên ngoài chỉ chạm được qua cửa đã mở sẵn. Đây là nền của ba
 *       cái còn lại: có ranh giới rõ thì mới nói tới chuyện thay ruột được.
 *   Trừu tượng (abstraction) — người dùng lớp chỉ thấy "làm được gì", không
 *       thấy "làm bằng cách nào".
 *   Kế thừa (inheritance) — lớp con dùng lại phần chung, chỉ khai thêm phần
 *       riêng.
 *   Đa hình (polymorphism) — cùng MỘT dòng gọi hàm, chạy ra nhiều thân hàm
 *       khác nhau tuỳ đối tượng thật đang nằm ở đó.
 *
 * Đa hình là cái khó hình dung nhất qua chữ, nên nhánh thứ hai dành hẳn cho
 * nó: theo dõi một dòng `a.speak()` duy nhất trong vòng lặp, và xem con trỏ
 * nhảy vào ba thân hàm khác nhau qua bảng phương thức ảo.
 */

import { Boxes } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const ENCAP_CODE = [
  'class BankAccount {',
  '  private double balance;      // ẩn khỏi bên ngoài',
  '',
  '  public void deposit(double x) {',
  '    if (x <= 0) throw new Error();   // luật nằm ở đây',
  '    balance += x;',
  '  }',
  '  public double getBalance() { return balance; }',
  '}',
  '',
  'acc.balance = -999;   // ❌ trình biên dịch chặn',
  'acc.deposit(-999);    // ❌ luật trong lớp chặn',
];

const POLY_CODE = [
  'abstract class Animal {',
  '  abstract String speak();     // không có thân hàm',
  '}',
  'class Dog extends Animal  { String speak(){ return "Gâu"; } }',
  'class Cat extends Animal  { String speak(){ return "Meo"; } }',
  'class Bird extends Animal { String speak(){ return "Chiếp"; } }',
  '',
  'for (Animal a : list) {',
  '  System.out.println(a.speak());   // ← MỘT dòng duy nhất',
  '}',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title:
      opts.view === 'poly'
        ? { vi: 'Một dòng gọi, ba thân hàm', en: 'One call site, three bodies' }
        : { vi: 'Đóng gói: dữ liệu và luật đi cùng nhau', en: 'Encapsulation: data and rules together' },
    file: opts.view === 'poly' ? 'Animal.java' : 'BankAccount.java',
    x: 0,
    y: 0,
    w: 486,
    h: 300,
    lines: opts.view === 'poly' ? POLY_CODE : ENCAP_CODE,
  },
  {
    id: 'tree',
    kind: 'tree',
    title:
      opts.view === 'poly'
        ? { vi: 'Cây kế thừa', en: 'The inheritance tree' }
        : { vi: 'Bên trong lớp', en: 'Inside the class' },
    hint:
      opts.view === 'poly'
        ? { vi: 'lớp con chỉ khai phần KHÁC', en: 'a subclass declares only what DIFFERS' }
        : { vi: 'private = không ai ngoài lớp chạm được', en: 'private = untouchable from outside' },
    x: 0,
    y: 312,
    w: 486,
    h: 248,
    accent: '#f472b6',
  },
  {
    id: 'mem',
    kind: 'lanes',
    title: { vi: 'Đối tượng trong bộ nhớ', en: 'Objects in memory' },
    hint: { vi: 'mỗi đối tượng mang theo kiểu THẬT của nó', en: 'each object carries its real type' },
    x: 498,
    y: 0,
    w: 502,
    h: 316,
    accent: '#38bdf8',
    layout: 'rows',
    lanes: [
      { id: 'obj', label: 'đối tượng', sub: { vi: 'nằm trong heap', en: 'on the heap' }, accent: '#38bdf8' },
      { id: 'vtable', label: 'bảng hàm', sub: { vi: 'trỏ tới thân hàm thật', en: 'points at the real body' }, accent: '#a78bfa' },
      { id: 'call', label: 'đang gọi', sub: { vi: 'thân hàm được chạy', en: 'the body that runs' }, accent: '#34d399' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả chạy', en: 'Program output' },
    file: 'java',
    x: 498,
    y: 328,
    w: 502,
    h: 232,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

const node = (id: string, label: string, depth: number, sub: string, badge: string, tone: Tone = 'muted'): PanelOp => ({
  p: 'tree',
  op: 'push',
  item: { id, label, depth, sub, badge, tone },
});

const mark = (id: string, tone: Tone, badge?: string, sub?: string): PanelOp => ({ p: 'tree', op: 'tone', key: id, tone, badge, sub });

/** Đặt giá trị mới cho một làn bộ nhớ (xoá cũ trước để không chồng chất). */
const set = (lane: string, label: string, sub: string, tone: Tone = 'info'): PanelOp[] => [
  { p: 'mem', op: 'clear', lane },
  { p: 'mem', op: 'push', lane, item: { label, sub, tone } },
];

const add = (lane: string, id: string, label: string, sub: string, tone: Tone = 'info'): PanelOp => ({
  p: 'mem',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
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
   A — ĐÓNG GÓI VÀ TRỪU TƯỢNG
   ──────────────────────────────────────────────────────────── */

function buildEncap(): SimStep[] {
  const { steps, push } = collector();

  push(
    'without',
    { vi: 'Nếu không đóng gói: ai cũng sửa được số dư', en: 'Without encapsulation: anyone can edit the balance' },
    {
      vi: 'Giả sử `balance` để công khai. Bất kỳ dòng mã nào trong cả dự án cũng gán thẳng được `acc.balance = -999`. Khi số dư sai, bạn phải đi tìm trong toàn bộ mã nguồn xem chỗ nào đã sửa nó — và số chỗ đó tăng theo thời gian, không giảm.',
      en: 'Suppose `balance` were public. Any line anywhere in the project could assign `acc.balance = -999` directly. When the balance goes wrong you must search the entire codebase for whatever wrote to it — and the number of such places only grows over time.',
    },
    2800,
    [
      lines([11]),
      node('n0', 'BankAccount', 0, 'nếu balance là public', 'nguy hiểm', 'err'),
      ...set('obj', 'balance = -999', 'bị gán từ bên ngoài', 'err'),
      out('acc.balance = -999   → số dư âm, không ai chặn', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'private',
    { vi: 'private — đóng cửa, chỉ chừa lối đi đã định', en: 'private — close the door, leave only the intended path' },
    {
      vi: 'Đánh dấu `balance` là `private` thì trình biên dịch từ chối mọi truy cập từ ngoài lớp. Không phải quy ước lịch sự, không phải tài liệu — nó là lỗi biên dịch, mã sai không chạy được. Số chỗ có thể sửa `balance` giảm từ "cả dự án" xuống "vài dòng trong một file".',
      en: 'Marking `balance` as `private` makes the compiler refuse every access from outside the class. Not a polite convention, not documentation — a compile error, so the wrong code never runs. The set of places that can modify `balance` shrinks from "the whole project" to "a few lines in one file".',
    },
    3000,
    [
      lines([2]),
      mark('n0', 'ok', 'balance private'),
      ...set('obj', 'balance = 0', 'chỉ lớp này chạm được', 'ok'),
      out('acc.balance = -999   → LỖI BIÊN DỊCH', 'ok'),
    ],
    {
      sfx: 'lock',
      teachingNote: {
        vi: 'Nhấn: private không phải để giấu bí mật, mà để THU HẸP số chỗ có thể gây lỗi.',
        en: 'Stress: private is not about secrecy, it is about SHRINKING the set of places that can break things.',
      },
    }
  );

  push(
    'rule',
    { vi: 'Luật nghiệp vụ chuyển vào trong lớp', en: 'Business rules move inside the class' },
    {
      vi: 'Bây giờ muốn nạp tiền thì phải đi qua `deposit`, và ở đó có kiểm tra số âm. Đây mới là phần đắt giá của đóng gói: luật "số dư không được âm" chỉ cần viết ĐÚNG MỘT LẦN, và mọi đường vào đều bắt buộc đi qua nó. Không còn chuyện quên kiểm tra ở một chỗ nào đó.',
      en: 'Now depositing must go through `deposit`, which checks for negatives. This is the valuable part of encapsulation: the rule "balance may not go negative" is written EXACTLY ONCE, and every path in must pass through it. No more forgetting the check somewhere.',
    },
    3000,
    [
      lines([4, 5, 6, 7]),
      node('n1', 'deposit(x)', 1, 'kiểm tra x > 0 rồi mới cộng', 'cửa vào', 'ok'),
      out('acc.deposit(-999)  → Error: số tiền phải dương', 'ok'),
      out('acc.deposit(500)   → balance = 500', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'abstract',
    { vi: 'Trừu tượng — người dùng chỉ cần biết LÀM ĐƯỢC GÌ', en: 'Abstraction — the caller only needs to know WHAT it can do' },
    {
      vi: 'Người viết mã gọi `deposit` và `getBalance` mà không cần biết số dư lưu bằng `double`, `BigDecimal` hay một hàng trong CSDL. Đó là trừu tượng: mặt ngoài kể việc làm được, ruột giữ cách làm. Hai tính chất này luôn đi cặp — đóng gói dựng bức tường, trừu tượng quyết định trên tường có những cửa nào.',
      en: 'A caller uses `deposit` and `getBalance` without knowing whether the balance is a `double`, a `BigDecimal`, or a row in a database. That is abstraction: the surface states what can be done, the interior keeps how. The two always come as a pair — encapsulation builds the wall, abstraction decides which doors it has.',
    },
    3100,
    [
      lines([4, 8]),
      node('n2', 'mặt ngoài', 1, 'deposit · getBalance', 'thấy được', 'info'),
      node('n3', 'ruột', 1, 'kiểu dữ liệu · cách lưu', 'ẩn', 'muted'),
      ...set('obj', 'balance: double', 'có thể đổi sang BigDecimal', 'muted'),
    ],
    { sfx: 'blip' }
  );

  push(
    'swap',
    { vi: 'Và đây là phần thưởng: thay ruột mà không ai biết', en: 'And here is the payoff: replace the interior, nobody notices' },
    {
      vi: 'Đổi `double` sang `BigDecimal` cho khỏi sai số tiền tệ — sửa đúng bên trong lớp, không một dòng mã gọi nào phải sửa theo. Nếu `balance` từng để công khai thì bạn phải đi sửa mọi nơi đã chạm vào nó. Đóng gói không làm chương trình chạy nhanh hơn; nó làm chương trình SỬA được.',
      en: 'Switch `double` to `BigDecimal` to avoid monetary rounding errors — change only inside the class, and not one calling line changes with it. Had `balance` been public you would have to fix every place that ever touched it. Encapsulation does not make a program faster; it makes it CHANGEABLE.',
    },
    3100,
    [
      mark('n3', 'ok', 'đổi tự do'),
      ...set('obj', 'balance: BigDecimal', 'đã đổi · 0 dòng gọi phải sửa', 'ok'),
      out('đổi kiểu lưu · mã gọi không đổi một dòng', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — KẾ THỪA VÀ ĐA HÌNH
   ──────────────────────────────────────────────────────────── */

function buildPoly(): SimStep[] {
  const { steps, push } = collector();

  push(
    'tree',
    { vi: 'Kế thừa — lớp con chỉ khai phần KHÁC', en: 'Inheritance — a subclass declares only what DIFFERS' },
    {
      vi: '`Animal` giữ phần chung; `Dog`, `Cat`, `Bird` mỗi lớp chỉ viết `speak()` của riêng mình. Chú ý `Animal.speak()` không có thân hàm — nó là `abstract`, tức là một lời hứa: "mọi Animal đều nói được, nhưng nói thế nào thì lớp con tự lo".',
      en: '`Animal` holds what is common; `Dog`, `Cat` and `Bird` each write only their own `speak()`. Note that `Animal.speak()` has no body — it is `abstract`, a promise: "every Animal can speak, but how is up to the subclass".',
    },
    2900,
    [
      lines([1, 2, 3]),
      node('a0', 'Animal', 0, 'abstract speak()', 'không có thân hàm', 'info'),
      node('a1', 'Dog', 1, 'speak() → "Gâu"', '', 'ok'),
      node('a2', 'Cat', 1, 'speak() → "Meo"', '', 'ok'),
      node('a3', 'Bird', 1, 'speak() → "Chiếp"', '', 'ok'),
      out('3 lớp con · mỗi lớp 1 dòng khác nhau', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'objects',
    { vi: 'Ba đối tượng nằm trong heap, mỗi cái mang kiểu THẬT', en: 'Three objects on the heap, each carrying its REAL type' },
    {
      vi: 'Danh sách khai kiểu `Animal`, nhưng thứ nằm trong bộ nhớ là ba đối tượng cụ thể. Mỗi đối tượng mang theo một con trỏ tới bảng phương thức của LỚP THẬT của nó — chính con trỏ này là cơ chế làm nên đa hình, chứ không phải kiểu ghi trong khai báo biến.',
      en: 'The list is declared as `Animal`, but what sits in memory is three concrete objects. Each carries a pointer to the method table of its REAL class — and that pointer, not the declared variable type, is the mechanism behind polymorphism.',
    },
    3000,
    [
      lines([8]),
      add('obj', 'o1', 'Dog', 'kiểu thật: Dog', 'ok'),
      add('obj', 'o2', 'Cat', 'kiểu thật: Cat', 'ok'),
      add('obj', 'o3', 'Bird', 'kiểu thật: Bird', 'ok'),
      add('vtable', 'v1', 'Dog.speak', '', 'muted'),
      add('vtable', 'v2', 'Cat.speak', '', 'muted'),
      add('vtable', 'v3', 'Bird.speak', '', 'muted'),
      out('List<Animal> nhưng ruột là Dog, Cat, Bird', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'call1',
    { vi: 'Vòng lặp thứ nhất: a.speak() → thân hàm của Dog', en: 'First iteration: a.speak() → Dog’s body' },
    {
      vi: 'Dòng `a.speak()` không hề biết `a` là con gì. Lúc chạy, máy ảo nhìn vào con trỏ bảng phương thức của đối tượng đang nằm ở đó, thấy nó trỏ tới `Dog.speak`, và nhảy vào đúng thân hàm ấy. Quyết định này xảy ra ở THỜI ĐIỂM CHẠY, không phải lúc biên dịch.',
      en: 'The line `a.speak()` has no idea what `a` is. At run time the VM follows the object’s method-table pointer, finds it points at `Dog.speak`, and jumps into that body. This decision happens at RUN TIME, not at compile time.',
    },
    3000,
    [
      lines([9]),
      { p: 'mem', op: 'tone', key: 'o1', tone: 'active' },
      { p: 'mem', op: 'tone', key: 'v1', tone: 'active' },
      ...set('call', 'Dog.speak()', 'trả về "Gâu"', 'ok'),
      out('Gâu', 'ok'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Đây là điểm chốt: MỘT dòng mã, nhưng thân hàm được chọn lúc chạy theo kiểu thật.',
        en: 'The key point: ONE line of code, but the body is chosen at run time from the real type.',
      },
    }
  );

  push(
    'call2',
    { vi: 'Vòng lặp thứ hai: vẫn dòng đó, giờ vào Cat', en: 'Second iteration: same line, now into Cat' },
    {
      vi: 'Không có `if`, không có `switch`, không có bảng tra nào do bạn viết. Cùng một dòng mã, cùng một địa chỉ lệnh, nhưng đối tượng đổi thì đích nhảy đổi theo. Đây chính là thứ mà "đa hình" muốn nói: một dạng gọi, nhiều dạng thi hành.',
      en: 'No `if`, no `switch`, no lookup table you wrote. The same line, the same instruction address, but a different object means a different jump target. This is precisely what "polymorphism" means: one form of call, many forms of execution.',
    },
    2900,
    [
      { p: 'mem', op: 'tone', key: 'o1', tone: 'muted' },
      { p: 'mem', op: 'tone', key: 'v1', tone: 'muted' },
      { p: 'mem', op: 'tone', key: 'o2', tone: 'active' },
      { p: 'mem', op: 'tone', key: 'v2', tone: 'active' },
      ...set('call', 'Cat.speak()', 'trả về "Meo"', 'ok'),
      out('Meo', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'call3',
    { vi: 'Vòng lặp thứ ba: Bird', en: 'Third iteration: Bird' },
    {
      vi: 'Ba kết quả khác nhau từ một dòng in. Bây giờ hãy thử tưởng tượng viết đoạn này KHÔNG có đa hình: bạn sẽ cần một chuỗi `if (a instanceof Dog) … else if (a instanceof Cat) …`, và mỗi lần thêm loài mới là phải tìm lại đúng chuỗi đó để sửa.',
      en: 'Three different results from one print statement. Now imagine writing this WITHOUT polymorphism: you would need a chain of `if (a instanceof Dog) … else if (a instanceof Cat) …`, and every new species means hunting down that chain to edit it.',
    },
    2900,
    [
      { p: 'mem', op: 'tone', key: 'o2', tone: 'muted' },
      { p: 'mem', op: 'tone', key: 'v2', tone: 'muted' },
      { p: 'mem', op: 'tone', key: 'o3', tone: 'active' },
      { p: 'mem', op: 'tone', key: 'v3', tone: 'active' },
      ...set('call', 'Bird.speak()', 'trả về "Chiếp"', 'ok'),
      out('Chiếp', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'extend',
    { vi: 'Thêm loài thứ tư mà không sửa vòng lặp', en: 'Add a fourth species without touching the loop' },
    {
      vi: 'Viết `class Fish extends Animal` với `speak()` riêng, cho vào danh sách — xong. Vòng lặp không đổi một ký tự, và nó chạy đúng ngay lập tức. Đây mới là lý do đa hình đáng giá: mã cũ mở rộng được mà không phải sửa, tức là không có nguy cơ làm hỏng thứ đang chạy.',
      en: 'Write `class Fish extends Animal` with its own `speak()`, put it in the list — done. The loop does not change by one character, and it works immediately. This is why polymorphism earns its keep: existing code extends without being edited, so there is no risk of breaking what already works.',
    },
    3100,
    [
      node('a4', 'Fish', 1, 'speak() → "..."', 'thêm mới', 'info'),
      add('obj', 'o4', 'Fish', 'kiểu thật: Fish', 'info'),
      out('thêm Fish · vòng lặp sửa 0 dòng', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'recap',
    { vi: 'Bốn tính chất, xếp theo thứ tự phụ thuộc', en: 'Four pillars, in dependency order' },
    {
      vi: 'Đóng gói dựng ranh giới quanh dữ liệu. Trừu tượng quyết định trên ranh giới đó có cửa nào. Kế thừa cho phép nhiều lớp cùng mang một bộ cửa giống nhau. Và đa hình dùng chính bộ cửa chung đó để gọi mà không cần biết bên trong là ai. Ba cái sau đều đứng trên cái đầu tiên — không có ranh giới thì không có gì để nói tiếp.',
      en: 'Encapsulation draws a boundary around data. Abstraction decides which doors that boundary has. Inheritance lets many classes carry the same set of doors. And polymorphism uses that shared set to call through without knowing who is inside. The last three all rest on the first — with no boundary there is nothing further to say.',
    },
    3100,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const oopPillarsScenario: Scenario = {
  id: 'oop-pillars',
  name: { vi: 'Bốn tính chất OOP — nhìn từ bộ nhớ', en: 'The four OOP pillars — seen from memory' },
  tagline: {
    vi: 'Cùng MỘT dòng `a.speak()` trong vòng lặp lại chạy ra ba thân hàm khác nhau — không `if`, không `switch`. Bí mật nằm ở con trỏ bảng phương thức mà mỗi đối tượng mang theo.',
    en: 'The same single line `a.speak()` in a loop runs three different bodies — no `if`, no `switch`. The secret is the method-table pointer each object carries.',
  },
  icon: Boxes,
  accent: '#f472b6',
  group: 'oop',
  lesson: {
    course: 'object-oriented-programming',
    subject: 'PRO192',
    code: '4.2',
    slug: 'pro192-4-2-da-hinh',
    title: { vi: 'Đa hình', en: 'Polymorphism' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Cặp tính chất', en: 'Which pair' },
      defaultValue: 'encap',
      choices: [
        {
          value: 'encap',
          label: 'Đóng gói & trừu tượng',
          fullLabel: 'private, và vì sao thay ruột được',
          color: '#f472b6',
          hint: { vi: 'đổi double → BigDecimal, 0 dòng gọi sửa', en: 'double → BigDecimal, zero callers change' },
        },
        {
          value: 'poly',
          label: 'Kế thừa & đa hình',
          fullLabel: 'Một dòng gọi, ba thân hàm',
          color: '#34d399',
          hint: { vi: 'thân hàm chọn lúc CHẠY', en: 'the body is chosen at RUN time' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'poly' ? buildPoly() : buildEncap()),
};
