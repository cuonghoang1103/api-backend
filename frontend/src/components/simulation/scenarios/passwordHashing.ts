/**
 * Nền tảng web · Băm mật khẩu — vì sao lộ CSDL không có nghĩa là lộ mật khẩu.
 *
 * Bài này có một khoảnh khắc "à ra thế" rất mạnh mà hầu như kịch bản nào cũng
 * bỏ lỡ: khi bảng người dùng lưu mật khẩu băm KHÔNG có muối, hai người đặt
 * cùng một mật khẩu sẽ có hai chuỗi băm GIỐNG HỆT NHAU. Kẻ đọc được CSDL không
 * cần bẻ gì cả — chỉ cần nhìn hai dòng trùng nhau là biết ngay hai tài khoản
 * này dùng chung mật khẩu, và một bảng tra sẵn sẽ cho biết nó là gì.
 *
 * Ba tầng của câu chuyện, kịch bản đi đúng thứ tự đó:
 *   1. Lưu thô        — lộ CSDL là lộ tất cả, không cần làm gì thêm.
 *   2. Băm không muối — hash trùng nhau, và bảng tra sẵn (rainbow table) phá
 *                       trong vài mili giây vì MD5/SHA được thiết kế để NHANH.
 *   3. bcrypt có muối — mỗi người một muối riêng nên hash khác nhau hoàn toàn,
 *                       và tham số chi phí khiến mỗi lần thử tốn ~250ms.
 *
 * Con số dùng ở đây theo thang thực đo: GPU hiện đại thử được khoảng 10 tỉ
 * hash MD5 mỗi giây, nhưng chỉ khoảng 40 nghìn bcrypt cost 12 mỗi giây — chậm
 * hơn 250.000 lần. Đó chính là toàn bộ giá trị của "hàm băm chậm có chủ đích".
 */

import { Shield } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const PLAIN_CODE = [
  '// Đăng ký — cách sai nhất, và vẫn còn gặp',
  'await db.user.create({',
  '  email,',
  '  password,          // ← lưu nguyên văn',
  '});',
  '',
  '// Hoặc "đã băm rồi" nhưng bằng MD5:',
  'password: md5(password)',
];

const BCRYPT_CODE = [
  '// Đăng ký',
  'const hash = await bcrypt.hash(password, 12);',
  '//                                       ↑ cost',
  'await db.user.create({ email, password: hash });',
  '',
  '// Đăng nhập — KHÔNG băm rồi so chuỗi',
  'const ok = await bcrypt.compare(input, user.password);',
  '// muối nằm sẵn trong chuỗi hash, compare tự đọc ra',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Mã đăng ký / đăng nhập', en: 'Signup / login code' },
    file: 'auth.service.ts',
    x: 0,
    y: 0,
    w: 470,
    h: 250,
    lines: opts.how === 'bcrypt' ? BCRYPT_CODE : PLAIN_CODE,
  },
  {
    id: 'db',
    kind: 'table',
    title: { vi: 'Bảng users — thứ kẻ tấn công đọc được', en: 'The users table — what the attacker reads' },
    hint: { vi: 'ba người dùng, hai người trùng mật khẩu', en: 'three users, two share a password' },
    x: 0,
    y: 262,
    w: 470,
    h: 298,
    accent: '#f43f5e',
    columns: [
      { key: 'u', label: 'email', flex: 0.8 },
      { key: 'p', label: 'cột password', flex: 1.5 },
    ],
  },
  {
    id: 'crack',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Thời gian dò ra mật khẩu', en: 'Time to recover the password' },
    hint: { vi: 'thang logarit — cột cuối là 3 thế kỷ', en: 'log scale — the last bar is three centuries' },
    x: 482,
    y: 0,
    w: 518,
    h: 246,
    accent: '#f59e0b',
    max: 100,
    unit: '',
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Máy của kẻ tấn công', en: 'The attacker’s machine' },
    file: 'hashcat',
    x: 482,
    y: 258,
    w: 518,
    h: 302,
    accent: '#34d399',
    maxLines: 9,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });

const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

const row = (id: string, email: string, stored: string, tone: Tone): PanelOp => ({
  p: 'db',
  op: 'push',
  item: { id, label: email, cells: [email, stored], tone },
});

/** Cột thang logarit: 1 đơn vị ≈ một bậc 10 lần. */
const bar = (key: string, value: number, label: string, tone: Tone): PanelOp => ({
  p: 'crack',
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
   A — LƯU THÔ VÀ BĂM KHÔNG MUỐI
   ──────────────────────────────────────────────────────────── */

function buildPlain(): SimStep[] {
  const { steps, push } = collector();

  push(
    'store',
    { vi: 'Ba người đăng ký, mật khẩu lưu nguyên văn', en: 'Three signups, passwords stored as-is' },
    {
      vi: 'Không có gì để giải thích ở tầng này: cột `password` chứa đúng thứ người dùng gõ. Ai đọc được bảng — do SQL injection, do sao lưu bị bỏ quên trên S3 công khai, do một nhân viên cũ — là có ngay danh sách mật khẩu.',
      en: 'Nothing to explain at this level: the `password` column holds exactly what the user typed. Anyone who reads the table — via SQL injection, a backup left in a public S3 bucket, a former employee — walks away with the password list.',
    },
    2600,
    [
      lines([2, 3, 4, 5]),
      row('r1', 'an@…', '123456', 'err'),
      row('r2', 'binh@…', '123456', 'err'),
      row('r3', 'chi@…', 'hunter2', 'err'),
      out('$ SELECT email, password FROM users;', 'info'),
      out('xong. không cần bẻ gì cả.', 'err'),
    ],
    { sfx: 'click' }
  );

  push(
    'md5',
    { vi: '"Đã băm rồi mà" — MD5, và hai dòng vẫn giống hệt nhau', en: '"But it is hashed" — MD5, and two rows are still identical' },
    {
      vi: 'Đây là khoảnh khắc đáng dừng lại. An và Bình đặt cùng mật khẩu, và vì hàm băm là hàm thuần — cùng đầu vào cho cùng đầu ra — hai chuỗi băm TRÙNG NHAU từng ký tự. Kẻ tấn công chưa bẻ gì đã biết hai tài khoản này dùng chung một mật khẩu.',
      en: 'This is the moment worth pausing on. An and Bình chose the same password, and because a hash is a pure function — same input, same output — the two hashes are IDENTICAL character for character. The attacker has cracked nothing yet and already knows these two accounts share a password.',
    },
    3100,
    [
      lines([7, 8]),
      // Panel bảng không sửa được nội dung ô bằng thao tác `tone` — muốn đổi
      // cột password từ mật khẩu thô sang chuỗi băm thì phải dựng lại hàng.
      { p: 'db', op: 'clear' },
      row('h1', 'an@…', 'e10adc39…f20f883e', 'warn'),
      row('h2', 'binh@…', 'e10adc39…f20f883e', 'warn'),
      row('h3', 'chi@…', 'f1a3d6c0…9b47e215', 'warn'),
      out('e10adc3949ba59abbe56e057f20f883e  ← an', 'warn'),
      out('e10adc3949ba59abbe56e057f20f883e  ← binh (y hệt)', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: nhìn hai dòng băm giống nhau, kẻ tấn công suy ra được gì mà chưa cần bẻ?',
        en: 'Ask the class: from two identical hashes, what does the attacker learn before cracking anything?',
      },
    }
  );

  push(
    'rainbow',
    { vi: 'Bảng tra sẵn phá MD5 trong vài mili giây', en: 'A precomputed table breaks MD5 in milliseconds' },
    {
      vi: 'Không ai đi thử từng khả năng nữa. Người ta đã băm sẵn hàng tỉ mật khẩu phổ biến và lưu thành bảng tra; bẻ khoá thu về đúng một phép TÌM KIẾM. Với MD5 và mật khẩu nằm trong danh sách rò rỉ, thời gian gần như bằng không.',
      en: 'Nobody brute-forces any more. Billions of common passwords have already been hashed and stored in lookup tables; cracking reduces to a LOOKUP. For MD5 with a password from a breach list, the time is effectively zero.',
    },
    2900,
    [
      bar('lưu thô', 1, 'tức thì', 'err'),
      bar('MD5 không muối', 3, '2 ms', 'err'),
      out('$ hashcat -m 0 hashes.txt rockyou.txt', 'info'),
      out('e10adc…:123456   ← tìm thấy trong 2ms', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'fast',
    { vi: 'Vấn đề gốc: MD5 và SHA được thiết kế để NHANH', en: 'The root problem: MD5 and SHA are designed to be FAST' },
    {
      vi: 'Chúng sinh ra để kiểm tra toàn vẹn file — càng nhanh càng tốt. Đúng phẩm chất đó lại là tai hoạ khi dùng cho mật khẩu: một GPU thử được khoảng mười tỉ hash MD5 mỗi giây. Thứ bạn cần cho mật khẩu là một hàm băm CHẬM CÓ CHỦ ĐÍCH.',
      en: 'They exist to verify file integrity — the faster the better. That same quality is a disaster for passwords: a single GPU tries around ten billion MD5 hashes per second. What passwords need is a deliberately SLOW hash.',
    },
    2900,
    [out('GPU: ~10.000.000.000 hash MD5 / giây', 'err')],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Cần hai thứ: muối riêng cho từng người, và sự chậm chạp', en: 'Two things are needed: a per-user salt, and slowness' },
    {
      vi: 'Muối phá vỡ bảng tra sẵn và làm hai mật khẩu giống nhau ra hai hash khác nhau. Sự chậm chạp làm việc thử hàng loạt trở nên vô nghĩa về mặt kinh tế. `bcrypt` cho cả hai trong một hàm — chuyển sang lựa chọn bên cạnh để xem nó thay đổi những con số này thế nào.',
      en: 'A salt destroys precomputed tables and makes two identical passwords produce different hashes. Slowness makes mass guessing economically pointless. `bcrypt` provides both in one function — switch to the other option to see how it changes these numbers.',
    },
    2800,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — BCRYPT: MUỐI VÀ CHI PHÍ
   ──────────────────────────────────────────────────────────── */

function buildBcrypt(): SimStep[] {
  const { steps, push } = collector();

  push(
    'hash',
    { vi: 'bcrypt.hash — mỗi lần gọi sinh một muối ngẫu nhiên mới', en: 'bcrypt.hash — a fresh random salt on every call' },
    {
      vi: 'Muối là một chuỗi ngẫu nhiên được tạo riêng cho từng người dùng, rồi trộn vào trước khi băm. Bạn không phải tự sinh, không phải tự lưu ở cột khác: bcrypt nhét thẳng muối vào chuỗi kết quả, cùng với phiên bản thuật toán và tham số chi phí.',
      en: 'A salt is a random string generated per user and mixed in before hashing. You do not generate it yourself and do not store it in a separate column: bcrypt embeds the salt directly in the result string, alongside the algorithm version and the cost parameter.',
    },
    2900,
    [
      lines([2, 3, 4]),
      row('b1', 'an@…', '$2b$12$Kf9x…', 'ok'),
      out('$2b$12$Kf9xQ2mR…  ← muối nằm ngay trong chuỗi', 'ok'),
    ],
    { sfx: 'lock' }
  );

  push(
    'different',
    { vi: 'Cùng mật khẩu "123456", hai hash khác hẳn nhau', en: 'Same password "123456", two completely different hashes' },
    {
      vi: 'Đây là điều mà băm không muối không bao giờ làm được. An và Bình vẫn dùng chung một mật khẩu yếu, nhưng nhìn vào bảng thì không có cách nào biết được. Và quan trọng hơn: bẻ được hash của An KHÔNG cho biết gì về hash của Bình — kẻ tấn công phải làm lại từ đầu cho từng dòng.',
      en: 'This is what an unsalted hash can never do. An and Bình still share one weak password, but nothing in the table reveals it. More importantly: cracking An’s hash tells you NOTHING about Bình’s — the attacker must start over for every single row.',
    },
    3100,
    [
      row('b2', 'binh@…', '$2b$12$7Tz4…', 'ok'),
      row('b3', 'chi@…', '$2b$12$Lp2v…', 'ok'),
      out('an:   $2b$12$Kf9x…', 'ok'),
      out('binh: $2b$12$7Tz4…  ← cùng mật khẩu, khác hash', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'So trực tiếp với nhánh kia: ở đó hai dòng giống hệt, ở đây không còn manh mối nào.',
        en: 'Compare directly with the other branch: there the rows matched, here there is no clue left.',
      },
    }
  );

  push(
    'compare',
    { vi: 'Đăng nhập: bcrypt.compare, không phải so chuỗi', en: 'Login: bcrypt.compare, not string equality' },
    {
      vi: 'Vì mỗi lần băm ra một chuỗi khác nhau, băm lại rồi so bằng `===` sẽ LUÔN sai. `compare` đọc muối và tham số chi phí ra từ chuỗi đã lưu, băm mật khẩu vừa nhập bằng đúng bộ đó, rồi so kết quả — và so bằng thuật toán thời gian hằng định để không rò rỉ thông tin qua thời gian phản hồi.',
      en: 'Because each hash differs, re-hashing and comparing with `===` will ALWAYS fail. `compare` reads the salt and cost out of the stored string, hashes the submitted password with exactly those, and compares the results — using a constant-time comparison so response timing leaks nothing.',
    },
    3000,
    [lines([6, 7, 8]), out('bcrypt.compare("123456", hash) → true (247ms)', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'cost',
    { vi: 'Tham số chi phí: mỗi bậc là gấp đôi thời gian', en: 'The cost parameter: each step doubles the time' },
    {
      vi: 'Cost 12 nghĩa là 2¹² vòng lặp. Tăng lên 13 là gấp đôi thời gian, 14 là gấp bốn. Bạn chọn con số sao cho một lần đăng nhập tốn khoảng 200–300ms — người dùng không thấy chậm, nhưng kẻ thử hàng loạt thì trả giá theo đúng cấp số nhân đó. Và vì cost nằm trong chuỗi hash, nâng cost sau này không làm hỏng mật khẩu cũ: chúng vẫn kiểm được bằng cost cũ ghi trong chính chúng.',
      en: 'Cost 12 means 2¹² rounds. Raise it to 13 and the time doubles; 14 quadruples it. You pick a number so one login takes roughly 200–300ms — invisible to a user, but an attacker guessing en masse pays that same exponential price. And because the cost lives inside the hash string, raising it later does not break old passwords: they still verify using the cost recorded in themselves.',
    },
    3200,
    [
      bar('MD5 không muối', 3, '2 ms', 'err'),
      bar('bcrypt cost 12', 90, '~3 thế kỷ', 'ok'),
      out('GPU: 10 tỉ MD5/giây  →  40 nghìn bcrypt/giây', 'info'),
      out('chậm hơn 250.000 lần', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'rules',
    { vi: 'Bốn điều gói lại', en: 'Four things to take away' },
    {
      vi: 'Một: đừng bao giờ tự chế thuật toán băm mật khẩu — dùng `bcrypt`, `scrypt` hoặc `argon2id`. Hai: đừng dùng MD5/SHA cho mật khẩu, kể cả khi có muối, vì chúng vẫn quá nhanh. Ba: mật khẩu băm KHÔNG cứu được tài khoản dùng mật khẩu quá yếu — nó chỉ mua thời gian, nên vẫn cần kiểm tra danh sách rò rỉ. Bốn: lộ CSDL vẫn là sự cố phải công bố; băm đúng cách chỉ đảm bảo nó không lập tức thành sự cố của mọi website khác mà người dùng dùng chung mật khẩu.',
      en: 'One: never invent your own password hashing — use `bcrypt`, `scrypt` or `argon2id`. Two: never use MD5/SHA for passwords, salted or not, because they remain far too fast. Three: hashing does NOT save an account with a truly weak password — it only buys time, so still check against breach lists. Four: a database leak is still a reportable incident; proper hashing only ensures it does not immediately become an incident for every other site where the user reused that password.',
    },
    3200,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const passwordHashingScenario: Scenario = {
  id: 'password-hashing',
  name: { vi: 'Băm mật khẩu — muối và sự chậm chạp', en: 'Password hashing — salt and slowness' },
  tagline: {
    vi: 'Băm không muối thì hai người cùng mật khẩu ra hai chuỗi GIỐNG HỆT — kẻ đọc được CSDL biết ngay mà chưa cần bẻ gì. bcrypt sửa cả hai chuyện: muối riêng từng người, và mỗi lần thử tốn 250ms.',
    en: 'Without a salt, two users with the same password produce IDENTICAL hashes — whoever reads the database knows it before cracking anything. bcrypt fixes both: a per-user salt, and 250ms per attempt.',
  },
  icon: Shield,
  accent: '#f43f5e',
  lesson: {
    course: 'nodejs',
    code: '8.1',
    slug: 'nodejs-8-1-mat-khau-va-bam',
    title: { vi: 'Lưu mật khẩu: vì sao gần như mọi cách đều sai', en: 'Storing passwords: why almost every way is wrong' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'how',
      label: { vi: 'Cách lưu mật khẩu', en: 'How the password is stored' },
      defaultValue: 'plain',
      choices: [
        {
          value: 'plain',
          label: 'Lưu thô / MD5',
          fullLabel: 'Nguyên văn, hoặc băm không muối',
          color: '#f43f5e',
          hint: { vi: 'hai dòng băm giống hệt nhau', en: 'two identical hashes' },
        },
        {
          value: 'bcrypt',
          label: 'bcrypt cost 12',
          fullLabel: 'Muối riêng từng người + chi phí',
          color: '#34d399',
          hint: { vi: 'chậm hơn 250.000 lần', en: '250,000× slower' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.how === 'bcrypt' ? buildBcrypt() : buildPlain()),
};
