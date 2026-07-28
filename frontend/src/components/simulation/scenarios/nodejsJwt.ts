/**
 * Node.js · Bài 8.2 — JWT, refresh token và xoay vòng.
 *
 * Số đo lấy nguyên từ giáo trình (chạy thật trên máy chủ của khoá học):
 *
 *   jwt.sign   10.000 lần = 279 ms → 35.807 lần/giây
 *   jwt.verify 10.000 lần = 383 ms → 26.113 lần/giây  (0,038 ms mỗi lần)
 *   argon2 (bài 8.1)                →     30 lần/giây  (33 ms mỗi lần)
 *   → chênh khoảng 870 lần: đó là TOÀN BỘ lý lẽ của token.
 *
 *   token dài 228 ký tự · access 15 phút · refresh 30 ngày · 256 bit ngẫu nhiên
 *
 * Ba chế độ = ba câu hỏi khác nhau, không phải ba mức độ khó:
 *   anatomy — JWT là gì, và ba đòn tấn công vào nó (decode ≠ verify là đòn
 *             duy nhất thành công, vì nó tấn công người viết code chứ không
 *             tấn công thuật toán).
 *   rotate  — refresh token dùng một lần biến vụ trộm thành sự kiện PHÁT HIỆN
 *             được. Bảng `RefreshSession` là nhân vật chính.
 *   expired — sự cố có thật tháng 7/2026: token 24h, cookie 7 ngày, không có
 *             route refresh ⇒ phiên chết câm trong sáu trên bảy ngày.
 */

import { KeyRound } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const ANATOMY_CODE = [
  "jwt.sign({ sub: '1', role: 'USER', tv: 0 }, SECRET, {",
  "  expiresIn: '15m',",
  "  issuer: 'cuongthai-api',",
  "  audience: 'cuongthai-web',",
  '});',
  '',
  '// máy chủ quyết định thuật toán, KHÔNG đọc từ token',
  'jwt.verify(token, SECRET, {',
  "  algorithms: ['HS256'],",
  "  issuer: 'cuongthai-api', audience: 'cuongthai-web',",
  '});',
];

const ROTATE_CODE = [
  '// refresh token KHÔNG phải JWT: 256 bit ngẫu nhiên,',
  '// lưu vào CSDL dưới dạng SHA-256',
  "newRefreshToken = () => crypto.randomBytes(32).toString('base64url');",
  '',
  '// mỗi refresh chỉ dùng ĐƯỢC MỘT LẦN',
  'if (session.usedAt || session.revokedAt) {',
  '  await prisma.refreshSession.updateMany({',
  '    where: { familyId: session.familyId, revokedAt: null },',
  '    data: { revokedAt: new Date() },',
  '  });',
  "  throw new AppError(401, 'REFRESH_REUSE_DETECTED');",
  '}',
];

const EXPIRED_CODE = [
  '# ba thiết lập, tách riêng ra thì cái nào cũng hợp lý',
  'JWT_EXPIRES_IN=24h            # access token chết sau 1 ngày',
  'cookie backend_token: 7 ngày  # cái cookie chở nó sống 1 tuần',
  '/auth/refresh                 # … không tồn tại',
  '',
  '// cách chữa: bắt 401 → refresh MỘT lần → phát lại request',
  'if (err.response?.status === 401 && !cfg._retried) {',
  '  cfg._retried = true;',
  "  await api.post('/auth/refresh');",
  '  return api(cfg);',
  '}',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const mode = opts.mode === 'rotate' || opts.mode === 'expired' ? opts.mode : 'anatomy';

  const code: PanelSpec = {
    id: 'code',
    kind: 'code',
    title: { vi: 'Đoạn mã', en: 'The code' },
    x: 0,
    y: 0,
    w: 452,
    h: 300,
    lines: mode === 'rotate' ? ROTATE_CODE : mode === 'expired' ? EXPIRED_CODE : ANATOMY_CODE,
  };

  const log: PanelSpec = {
    id: 'log',
    kind: 'log',
    title:
      mode === 'expired'
        ? { vi: 'Nhật ký của client', en: "The client's log" }
        : { vi: 'Chạy thật trên máy chủ', en: 'Run for real on the server' },
    file: mode === 'anatomy' ? 'node jwt-lab.js' : 'curl -i',
    x: 0,
    y: 312,
    w: 452,
    h: 248,
    accent: '#38bdf8',
    maxLines: 7,
  };

  if (mode === 'rotate') {
    return [
      code,
      log,
      {
        id: 'db',
        kind: 'table',
        title: { vi: 'Bảng RefreshSession', en: 'The RefreshSession table' },
        hint: { vi: 'một lần đăng nhập = một HỌ token', en: 'one login = one token FAMILY' },
        x: 464,
        y: 0,
        w: 536,
        h: 560,
        accent: '#34d399',
        columns: [
          { key: 'fam', label: 'familyId', flex: 1.1 },
          { key: 'hash', label: 'tokenHash', flex: 1.4 },
          { key: 'used', label: 'used', flex: 0.6, align: 'right' },
          { key: 'rev', label: 'revoked', flex: 0.8, align: 'right' },
        ],
      },
    ];
  }

  if (mode === 'expired') {
    return [
      code,
      log,
      {
        id: 'cost',
        kind: 'chart',
        mode: 'bar',
        title: { vi: 'Hai cái đồng hồ khác nhau (giờ)', en: 'Two different clocks (hours)' },
        hint: { vi: 'không có gì tự giữ chúng khớp nhau', en: 'nothing keeps them in sync for you' },
        x: 464,
        y: 0,
        w: 536,
        h: 300,
        accent: '#f43f5e',
        unit: 'giờ',
        max: 180,
      },
      {
        id: 'db',
        kind: 'table',
        title: { vi: 'Ba thiết lập, mỗi cái đều "hợp lý"', en: 'Three settings, each "reasonable"' },
        x: 464,
        y: 312,
        w: 536,
        h: 248,
        accent: '#f59e0b',
        columns: [
          { key: 'k', label: 'thiết lập', flex: 1.2 },
          { key: 'v', label: 'giá trị', flex: 1.6 },
        ],
      },
    ];
  }

  return [
    code,
    log,
    {
      id: 'db',
      kind: 'table',
      title: { vi: 'Ba phần của một JWT', en: 'The three parts of a JWT' },
      hint: { vi: 'tổng cộng 228 ký tự', en: '228 characters in total' },
      x: 464,
      y: 0,
      w: 536,
      h: 300,
      accent: '#a78bfa',
      columns: [
        { key: 'part', label: 'phần', flex: 0.9 },
        { key: 'val', label: 'nội dung', flex: 2.1 },
      ],
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: { vi: 'Giá một lần kiểm danh tính (ms)', en: 'The price of one identity check (ms)' },
      hint: { vi: 'vì sao token tồn tại, gói gọn trong hai cột', en: 'why tokens exist, in two bars' },
      x: 464,
      y: 312,
      w: 536,
      h: 248,
      accent: '#34d399',
      unit: 'ms',
      max: 36,
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
interface Row {
  id: string;
  cells: string[];
  tone?: ItemTone;
}

/**
 * Vẽ LẠI trọn bảng.
 *
 * `push` với một `id` đã tồn tại sẽ ĐẺ RA DÒNG THỨ HAI chứ không ghi đè —
 * mà bảng ở đây thay đổi chính GIÁ TRỊ Ô (used f→t, revoked f→t), thứ mà op
 * `tone` không đụng tới được. Nên mỗi lần bảng đổi là dọn sạch rồi đẩy lại
 * toàn bộ: vẫn tất định, và trình vẽ cho dòng cũ mờ đi trong đúng một bước.
 */
const table = (rows: Row[]): PanelOp[] => [
  { p: 'db', op: 'clear' },
  { p: 'db', op: 'push', item: rows.map((r) => ({ id: r.id, label: r.cells[0], cells: r.cells, tone: r.tone })) },
];
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
   A — MỔ MỘT JWT, VÀ BA ĐÒN TẤN CÔNG
   ──────────────────────────────────────────────────────────── */

function buildAnatomy(): SimStep[] {
  const { steps, push } = collector();

  const parts = (header: Row, payload: Row): Row[] => [
    header,
    payload,
    { id: 's', cells: ['signature', 'bSTHNBX71bo7BNN7cx7Rcc7C-nXU5WuI_8Vr-cZld2g'], tone: 'ok' },
  ];
  const HEADER_OK: Row = { id: 'h', cells: ['header', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'], tone: 'info' };
  const PAYLOAD_RAW: Row = { id: 'p', cells: ['payload', 'eyJzdWIiOiIxIiwicm9sZSI6IlVTRVIiLCJ0diI6MCwi…'] };
  const PAYLOAD_READ: Row = { id: 'p', cells: ['payload', '{"sub":"1","role":"USER","exp":1785173316}'], tone: 'warn' };

  push(
    'sign',
    { vi: 'Ký một access token — 228 ký tự, ba phần', en: 'Sign an access token — 228 characters, three parts' },
    {
      vi: 'Header nói thuật toán nào đã ký. Payload là các claim: ai, lúc nào, tới khi nào. Signature là HMAC của hai phần trên bằng khoá bí mật — nó chứng minh hai phần kia chưa bị sửa.',
      en: 'The header says which algorithm signed this. The payload is the claims: who, when, until when. The signature is an HMAC of the first two parts with the secret — it proves they have not been altered.',
    },
    2500,
    [
      lines([1, 2, 3, 4, 5]),
      ...table(parts(HEADER_OK, PAYLOAD_RAW)),
      // Cột argon2 dựng sẵn từ bước đầu: bước cuối chỉ thả cột `jwt.verify`
      // bé xíu vào cạnh nó, và tỉ lệ 870 lần tự hiện ra bằng hình.
      bar('argon2 (8.1)', 33, '33', 'err'),
      log('độ dài toàn token: 228 ký tự'),
    ],
    { sfx: 'click' }
  );

  push(
    'readable',
    { vi: 'Base64url là mã hoá KÝ TỰ, không phải mã hoá bảo mật', en: 'Base64url is character encoding, not encryption' },
    {
      vi: 'Bất kỳ ai cầm token — kể cả trình duyệt, kể cả người đọc log của bạn — đều đọc được mọi claim mà không cần khoá nào. Chữ ký bảo đảm tính TOÀN VẸN, không bao giờ bảo đảm tính BÍ MẬT. Đừng đặt vào payload thứ bạn không dám in ra màn hình cho người dùng xem.',
      en: 'Anyone holding the token — the browser, whoever reads your logs — can read every claim without any key. The signature guarantees INTEGRITY, never CONFIDENTIALITY. Never put anything in the payload that you would not print on screen for the user.',
    },
    2800,
    [
      ...table(parts(HEADER_OK, PAYLOAD_READ)),
      log('Buffer.from(payload, "base64url").toString()', 'warn'),
      log('→ {"sub":"1","role":"USER","exp":1785173316}', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Không số điện thoại, không địa chỉ, không ghi chú nội bộ, không id của người khác.',
        en: 'No phone numbers, no addresses, no internal notes, no other people\'s ids.',
      },
    }
  );

  push(
    'attack1',
    { vi: 'Đòn 1 — sửa payload thành role: ADMIN', en: 'Attack 1 — edit the payload to role: ADMIN' },
    {
      vi: 'Cách thử hiển nhiên: đổi vai trò rồi gắn lại chữ ký cũ. Bị chặn, và đây là phần JWT làm thật sự tốt — chữ ký phủ đúng lên `header.payload`, đổi một byte là chữ ký hỏng, và kẻ tấn công không tính lại được nếu không có khoá bí mật.',
      en: 'The obvious attempt: change the role and reattach the old signature. Blocked — and this is the part JWT genuinely does well. The signature covers `header.payload` exactly, so one changed byte breaks it, and the attacker cannot recompute it without the secret.',
    },
    2600,
    [log('jwt.verify → JsonWebTokenError: invalid signature', 'ok')],
    { sfx: 'lock' }
  );

  push(
    'attack2',
    { vi: 'Đòn 2 — dùng `decode` thay vì `verify`. Đòn này THẮNG.', en: 'Attack 2 — use `decode` instead of `verify`. This one WINS.' },
    {
      vi: '`jwt.decode()` không bao giờ kiểm chữ ký. Nó tồn tại để đọc một token mà bạn đã tin sẵn. Nếu nó xuất hiện ở bất kỳ đâu trong đường xác thực của máy chủ, bạn không có xác thực nào cả — ai cũng tự nặn được payload. Nó thắng liên tục trong dự án thật vì hai hàm nằm cạnh nhau trong cùng một thư viện.',
      en: '`jwt.decode()` never checks the signature. It exists to read a token you already trust. If it appears anywhere in a server-side auth path, you have no authentication at all — anybody can craft the payload. It keeps winning in real projects because both functions sit side by side in the same library.',
    },
    3000,
    [
      ...table(
        parts({ id: 'h', cells: ['header', '{"alg":"none"} — token tự khai KHÔNG cần chữ ký'], tone: 'err' }, {
          id: 'p',
          cells: ['payload', '{"sub":"1","role":"ADMIN"}'],
          tone: 'err',
        })
      ),
      log('jwt.decode(token giả) → { role: "ADMIN" }  ✗', 'err'),
      log('bộ kiểm TỰ VIẾT tin header.alg → ADMIN, 2 lần', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Hãy grep `jwt.decode` trong repo của bạn ngay hôm nay.',
        en: 'Go grep your repo for `jwt.decode` today.',
      },
    }
  );

  push(
    'pin',
    { vi: 'Chốt thuật toán: máy chủ quyết định, token không có quyền bỏ phiếu', en: 'Pin the algorithm: the server decides, the token gets no vote' },
    {
      vi: '`algorithms: ["HS256"]` cộng `issuer` và `audience` làm cả một lớp lỗ hổng biến mất, bất kể phiên bản thư viện. `issuer`/`audience` chặn một token HỢP LỆ do hệ thống khác của bạn phát ra bị đem sang đây dùng lại.',
      en: '`algorithms: ["HS256"]` plus `issuer` and `audience` makes a whole class of holes vanish regardless of library version. `issuer`/`audience` stop a perfectly VALID token issued by another of your systems from being replayed here.',
    },
    2700,
    [
      lines([8, 9, 10, 11]),
      ...table(
        parts({ id: 'h', cells: ['header', '{"alg":"HS256"} — do MÁY CHỦ chốt'], tone: 'ok' }, PAYLOAD_READ)
      ),
      log('audience sai → jwt audience invalid  ✓', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'cost',
    { vi: '0,038 ms so với 33 ms — chênh 870 lần', en: '0.038 ms versus 33 ms — 870× apart' },
    {
      vi: '26.113 lần `jwt.verify` mỗi giây, so với 30 lần băm argon2 mỗi giây ở bài 8.1. Chính tỉ lệ đó là toàn bộ lý lẽ của token: trả câu hỏi đắt tiền MỘT lần lúc đăng nhập, rồi trả lời câu rẻ tiền ở mọi request sau đó — và không đụng vào cơ sở dữ liệu lần nào.',
      en: '26,113 `jwt.verify` calls per second versus 30 argon2 hashes per second from lesson 8.1. That ratio is the entire argument for tokens: pay the expensive question ONCE at login, then answer the cheap one on every request after — touching no database at all.',
    },
    2900,
    [
      bar('jwt.verify', 0.038, '0,038', 'ok'),
      log('sign   10.000 lần = 279ms → 35.807/giây'),
      log('verify 10.000 lần = 383ms → 26.113/giây', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — XOAY VÒNG: DÙNG LẠI NGHĨA LÀ BỊ TRỘM
   ──────────────────────────────────────────────────────────── */

function buildRotate(): SimStep[] {
  const { steps, push } = collector();

  // Họ có từ lần ĐĂNG KÝ — nằm đó suốt kịch bản để thấy rõ: thu hồi diễn ra
  // theo HỌ, không theo người dùng, nên thiết bị khác không bị đá ra.
  const SIGNUP: Row = { id: 'r0', cells: ['91accd90', 'f76370bfd058', 'f', 'f'], tone: 'info' };

  push(
    'why',
    { vi: 'Vấn đề: bạn không lấy lại được một JWT đã phát', en: 'The problem: you cannot take back a JWT you issued' },
    {
      vi: 'Một nhân viên bị cho nghỉ. Bạn xoá tài khoản lúc 09:00. Access token của họ ký lúc 08:58, hết hạn 09:13 — suốt mười lăm phút nó vẫn kiểm hợp lệ hoàn hảo, vì bước kiểm chưa bao giờ chạm tới cơ sở dữ liệu của bạn. Đó không phải lỗi trong code; đó là ĐỊNH NGHĨA của "không trạng thái".',
      en: 'An employee is let go. You delete the account at 09:00. Their access token was signed at 08:58 and expires at 09:13 — for fifteen minutes it still verifies perfectly, because verification never touches your database. That is not a bug in your code; it is the DEFINITION of stateless.',
    },
    2700,
    [lines([1, 2, 3]), log('xoá tài khoản 09:00 · token hợp lệ tới 09:13', 'warn')],
    { sfx: 'buzz' }
  );

  push(
    'login',
    { vi: 'Đăng nhập — một họ token mới bắt đầu', en: 'Login — a new token family begins' },
    {
      vi: 'Access token 15 phút, không thu hồi được nhưng gần như vô giá trị. Refresh token 30 ngày: 256 bit ngẫu nhiên, KHÔNG phải JWT, và chỉ chuỗi băm SHA-256 của nó được lưu. Rò bảng cơ sở dữ liệu thì kẻ trộm có chuỗi băm chứ không có token.',
      en: 'A 15-minute access token: unrevokable but nearly worthless. A 30-day refresh token: 256 random bits, NOT a JWT, and only its SHA-256 hash is stored. Leak the table and the thief holds a hash, not a token.',
    },
    2800,
    [
      lines([3]),
      ...table([SIGNUP, { id: 'r1', cells: ['9e7d363c', '4eac0fe14bee', 'f', 'f'], tone: 'ok' }]),
      log('POST /auth/login → access(15p) + refresh(30 ngày)', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'rotate',
    { vi: 'Refresh — token cũ bị đánh dấu đã dùng, cặp mới ra đời', en: 'Refresh — the old token is marked used, a new pair is born' },
    {
      vi: 'Mỗi refresh token chỉ dùng được MỘT lần. Đổi xong là `usedAt` được đóng dấu và một dòng mới cùng `familyId` xuất hiện. Đăng nhập tạo họ mới; refresh nối dài họ cũ — khác biệt đúng một tham số, và đó là toàn bộ cơ chế xoay vòng.',
      en: 'Each refresh token is single-use. Once exchanged, `usedAt` is stamped and a new row appears with the same `familyId`. Login starts a family; refresh continues one — a one-argument difference, and that is the whole rotation mechanism.',
    },
    2800,
    [
      lines([5, 6]),
      ...table([
        SIGNUP,
        { id: 'r1', cells: ['9e7d363c', '4eac0fe14bee', 't', 'f'], tone: 'warn' },
        { id: 'r2', cells: ['9e7d363c', 'e577914aeebb', 'f', 'f'], tone: 'ok' },
      ]),
      log('refresh cũ : RHCbHImxHOB--VPJgYj-5hNf…'),
      log('refresh mới: r5GHhbTjHy50mAxEuVz9No39…  (đã XOAY)', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'reuse',
    { vi: 'Kẻ trộm dùng LẠI refresh cũ — chuyện không thể xảy ra trong vận hành trung thực', en: 'The thief reuses the old refresh — impossible in honest operation' },
    {
      vi: 'Hai bên cùng cầm một token thì bên nào refresh sau sẽ trình ra một token ĐÃ DÙNG RỒI. Bạn không phân biệt được ai là kẻ trộm, nên bạn đốt cả họ: mọi dòng còn sống trong `familyId` đó bị thu hồi bằng một câu `UPDATE`.',
      en: 'When two parties hold the same token, whoever refreshes second presents an ALREADY-USED token. You cannot tell which one is the thief, so you burn the whole family: every live row with that `familyId` is revoked in one `UPDATE`.',
    },
    3000,
    [
      lines([6, 7, 8, 9, 10, 11]),
      ...table([
        SIGNUP,
        { id: 'r1', cells: ['9e7d363c', '4eac0fe14bee', 't', 't'], tone: 'err' },
        { id: 'r2', cells: ['9e7d363c', 'e577914aeebb', 'f', 't'], tone: 'err' },
      ]),
      log('HTTP 401 REFRESH_REUSE_DETECTED (thu hồi 2 phiên)', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đọc hai dòng đỏ cùng nhau: token của kẻ trộm VÀ token của nạn nhân đều bị thu hồi.',
        en: 'Read the two red rows together: the thief\'s token AND the victim\'s both get revoked.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Nạn nhân đăng nhập lại một lần; kẻ trộm không được gì', en: 'The victim logs in once more; the thief gets nothing' },
    {
      vi: 'Người dùng thật đăng nhập lại bằng mật khẩu — thứ mà kẻ trộm không có. Dòng đầu tiên (một họ khác, từ lần đăng ký) vẫn sống nguyên: thu hồi theo HỌ chứ không theo người dùng, nên các thiết bị khác không bị đá ra. Một refresh token bị đánh cắp cho kẻ tấn công nhiều nhất MỘT lần refresh trước khi cả họ bị đốt.',
      en: 'The real user logs back in with their password — which the thief does not have. The first row (a different family, from signup) survives untouched: revocation is per FAMILY, not per user, so other devices are not kicked out. A stolen refresh token buys the attacker at most ONE refresh before the family burns.',
    },
    3000,
    [
      lines([]),
      ...table([
        { ...SIGNUP, tone: 'ok' },
        { id: 'r1', cells: ['9e7d363c', '4eac0fe14bee', 't', 't'], tone: 'muted' },
        { id: 'r2', cells: ['9e7d363c', 'e577914aeebb', 'f', 't'], tone: 'muted' },
        { id: 'r3', cells: ['c41f80ab', '5b0a9d2ce133', 'f', 'f'], tone: 'ok' },
      ]),
      log('91accd90 · used=f · revoked=f  ← thiết bị khác còn sống', 'ok'),
      log('người dùng thật đăng nhập lại → họ c41f80ab', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — SỰ CỐ THẬT: PHIÊN CHẾT MÀ KHÔNG BÁO
   ──────────────────────────────────────────────────────────── */

function buildExpired(): SimStep[] {
  const { steps, push } = collector();

  push(
    'settings',
    { vi: 'Ba thiết lập, tách riêng ra thì cái nào cũng hợp lý', en: 'Three settings, each reasonable on its own' },
    {
      vi: 'Access token sống 24 giờ: hợp lý. Cookie chở nó sống 7 ngày: hợp lý. Không có route refresh: chưa ai cần tới. Không có dòng cấu hình nào SAI — chỉ là ba cái đúng đặt cạnh nhau.',
      en: 'The access token lives 24 hours: reasonable. The cookie carrying it lives 7 days: reasonable. No refresh route: nobody needed one yet. Not one line of config is WRONG — they are three right answers placed side by side.',
    },
    2600,
    [
      lines([2, 3, 4]),
      ...table([
        { id: 'a', cells: ['JWT_EXPIRES_IN', '24h'] },
        { id: 'b', cells: ['cookie backend_token', '7 ngày'] },
        { id: 'c', cells: ['/auth/refresh', 'không tồn tại'], tone: 'warn' },
      ]),
      bar('access token', 24, '24h', 'warn'),
      bar('cookie', 168, '168h', 'err'),
    ],
    { sfx: 'click' }
  );

  push(
    'gap',
    { vi: 'Sáu trên bảy ngày nằm trong khe hở', en: 'Six days out of seven fall in the gap' },
    {
      vi: 'Trình duyệt trung thành gửi đi một token mà máy chủ đã tuyên bố là chết, và không có cách nào gia hạn. Người dùng nhìn thấy một giao diện ĐANG-ĐĂNG-NHẬP mà bấm nút nào cũng hỏng. Đây là sự cố có thật của chính dự án này, tháng 7 năm 2026.',
      en: 'The browser faithfully sends a token the server has already declared dead, with no way to renew it. The user sees a logged-IN interface where every button fails. This is a real incident from this very project, July 2026.',
    },
    2900,
    [
      ...table([
        { id: 'a', cells: ['JWT_EXPIRES_IN', '24h — token chết ở đây'], tone: 'err' },
        { id: 'b', cells: ['cookie backend_token', '7 ngày — trình duyệt vẫn gửi'], tone: 'err' },
        { id: 'c', cells: ['/auth/refresh', 'không tồn tại → không gia hạn được'], tone: 'err' },
      ]),
      bar('khe hở', 144, '144h', 'err'),
      log('ngay sau đăng nhập : HTTP 200'),
      log('sau 4 giây         : HTTP 401 TOKEN_EXPIRED', 'err'),
      log('cookie vẫn còn nguyên trong máy: 1', 'warn'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Tuổi thọ token và tuổi thọ cookie là HAI cái đồng hồ, không có gì tự giữ chúng khớp.',
        en: 'Token lifetime and cookie lifetime are TWO clocks; nothing keeps them in sync for you.',
      },
    }
  );

  push(
    'fix',
    { vi: 'Cách chữa: bắt 401 → refresh MỘT lần → phát lại request', en: 'The fix: catch the 401 → refresh ONCE → replay the request' },
    {
      vi: 'Chữ "một lần" là quan trọng. Không có cờ chặn, một refresh token hết hạn sẽ đẻ ra vòng lặp thử lại vô tận. Nếu refresh cũng hỏng thì mới đăng xuất thật. Phiên tự chữa lành thay vì chết lặng lẽ.',
      en: 'The word "once" carries weight. Without a guard flag, an expired refresh token spawns an infinite retry loop. Only if the refresh also fails do you really log out. Sessions self-heal instead of dying silently.',
    },
    2900,
    [
      lines([6, 7, 8, 9, 10, 11]),
      ...table([
        { id: 'a', cells: ['JWT_EXPIRES_IN', '15m — cố tình ngắn'], tone: 'ok' },
        { id: 'b', cells: ['refresh token', '30 ngày — thu hồi được'], tone: 'ok' },
        { id: 'c', cells: ['/auth/refresh', 'POST — bắc cầu qua khe hở'], tone: 'ok' },
      ]),
      log('401 → POST /auth/refresh → phát lại: HTTP 200', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'rule',
    { vi: 'Luật rút ra: bằng nhau chính xác, hoặc phải có cầu', en: 'The rule: exactly equal, or build the bridge' },
    {
      vi: 'Hoặc hai đồng hồ bằng nhau chính xác, hoặc phải có một route refresh bắc qua khoảng chênh. Nửa cái này nửa cái kia là một phiên chết mà không hề báo — loại lỗi tệ nhất, vì cả người dùng lẫn màn hình giám sát đều không thấy gì bất thường.',
      en: 'Either the two clocks match exactly, or a refresh route must bridge the gap. Half of one and half of the other is a session that dies without announcing it — the worst kind of bug, because neither the user nor your dashboards see anything unusual.',
    },
    2800,
    [lines([]), bar('access + refresh', 168, '168h', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsJwtScenario: Scenario = {
  id: 'nodejs-jwt-refresh',
  name: { vi: 'JWT, refresh token và xoay vòng', en: 'JWT, refresh tokens and rotation' },
  tagline: {
    vi: 'Kiểm một JWT tốn 0,038 ms và không đụng cơ sở dữ liệu — nhanh hơn băm mật khẩu 870 lần. Cái giá: bạn không thu hồi lại được nó. Access ngắn cộng refresh xoay vòng biến một vụ trộm token thành sự kiện PHÁT HIỆN được.',
    en: 'Verifying a JWT costs 0.038 ms and touches no database — 870× faster than hashing a password. The price: you cannot take it back. A short access token plus a rotating refresh turns a stolen token into a DETECTABLE event.',
  },
  icon: KeyRound,
  accent: '#a78bfa',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '8.2',
    slug: 'nodejs-8-2-jwt-access-refresh',
    title: { vi: 'JWT, refresh token và xoay vòng', en: 'JWT, refresh tokens and rotation' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Xem gì', en: 'What to watch' },
      defaultValue: 'anatomy',
      choices: [
        {
          value: 'anatomy',
          label: 'Mổ token',
          fullLabel: 'Ba phần, ba đòn tấn công — decode ≠ verify',
          color: '#a78bfa',
          hint: { vi: 'đòn duy nhất thắng là đòn nhắm vào người viết code', en: 'the only winning attack targets the developer' },
        },
        {
          value: 'rotate',
          label: 'Xoay vòng',
          fullLabel: 'Refresh dùng một lần + thu hồi cả họ',
          color: '#34d399',
          hint: { vi: 'dùng lại = bị trộm, và bạn phát hiện được', en: 'reuse means theft, and you can detect it' },
        },
        {
          value: 'expired',
          label: 'Sự cố thật',
          fullLabel: 'Token 24h, cookie 7 ngày, không có refresh',
          color: '#f43f5e',
          hint: { vi: 'phiên chết câm suốt 6/7 ngày', en: 'the session dies silently for 6 days out of 7' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'rotate' ? buildRotate() : opts.mode === 'expired' ? buildExpired() : buildAnatomy(),
};
