/**
 * Kịch bản 3 — Xác thực: đăng nhập, phát JWT, gọi route được bảo vệ.
 *
 * Trọng tâm sư phạm: tách bạch hai khái niệm mà người mới luôn trộn lẫn —
 * XÁC THỰC (authentication: bạn là ai) diễn ra một lần lúc đăng nhập, còn
 * PHÂN QUYỀN (authorization: bạn được làm gì) diễn ra ở MỌI request sau đó.
 * Hoạt hình cho thấy rõ: sau khi có token, đường đi tới CSDL người dùng
 * biến mất hoàn toàn — đó chính là ý nghĩa của "không trạng thái".
 */

import { KeyRound } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'client', label: 'Client', kind: 'client' as const, x: 110, y: 300, sublabel: { vi: 'Form đăng nhập', en: 'Login form' } },
  { id: 'api', label: 'API', kind: 'server' as const, x: 370, y: 300, sublabel: { vi: 'Express · route công khai', en: 'Express · public route' } },
  { id: 'auth', label: 'Auth Service', kind: 'auth' as const, x: 640, y: 130, sublabel: { vi: 'bcrypt · ký JWT', en: 'bcrypt · JWT signing' } },
  { id: 'db', label: 'Users DB', kind: 'db' as const, x: 640, y: 460, sublabel: { vi: 'Bảng users', en: 'users table' } },
  { id: 'protected', label: 'Protected API', kind: 'server' as const, x: 890, y: 300, sublabel: { vi: '/me · /admin', en: '/me · /admin' } },
];

const edges = [
  { id: 'e_client_api', from: 'client', to: 'api' },
  { id: 'e_api_auth', from: 'api', to: 'auth' },
  { id: 'e_auth_db', from: 'auth', to: 'db', curve: 70, ghost: true },
  { id: 'e_api_db', from: 'api', to: 'db' },
  { id: 'e_api_protected', from: 'api', to: 'protected', curve: -46 },
  { id: 'e_client_protected', from: 'client', to: 'protected', curve: -230 },
];

const JWT_PAYLOAD = {
  sub: 1,
  email: 'cuong@cuongthai.com',
  role: 'ADMIN',
  isPro: true,
  iat: 1753689600,
  exp: 1753776000,
};

export const authScenario: Scenario = {
  id: 'auth',
  name: { vi: 'Xác thực — Đăng nhập & JWT', en: 'Authentication — Login & JWT' },
  tagline: {
    vi: 'Từ mật khẩu tới token, rồi tới route được bảo vệ. Kèm cả nhánh sai mật khẩu và token hết hạn.',
    en: 'From password to token to a protected route — including the wrong-password and expired-token branches.',
  },
  icon: KeyRound,
  accent: '#facc15',
  lesson: {
    course: 'nodejs',
    code: '8.3',
    slug: 'nodejs-8-3-requireauth-phan-quyen',
    title: { vi: 'requireAuth, phân quyền, và xoá bỏ AUTHOR_ID = 1', en: 'requireAuth, roles, and deleting AUTHOR_ID = 1' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'outcome',
      label: { vi: 'Diễn biến', en: 'Outcome' },
      defaultValue: 'success',
      choices: [
        { value: 'success', label: 'Đăng nhập thành công', color: '#34d399' },
        { value: 'wrong', label: 'Sai mật khẩu', color: '#fbbf24' },
        { value: 'expired', label: 'Token hết hạn → refresh', color: '#38bdf8' },
      ],
    },
    {
      id: 'store',
      label: { vi: 'Nơi lưu token', en: 'Token storage' },
      defaultValue: 'cookie',
      choices: [
        { value: 'cookie', label: 'httpOnly cookie', color: '#34d399', hint: { vi: 'JS không đọc được — an toàn hơn', en: 'Unreadable by JS — safer' } },
        { value: 'localStorage', label: 'localStorage', color: '#f43f5e', hint: { vi: 'Dễ bị đánh cắp qua XSS', en: 'Stealable via XSS' } },
      ],
    },
  ],

  build({ outcome = 'success', store = 'cookie' }) {
    const steps: SimStep[] = [];

    /* ── Nhánh token hết hạn (bắt đầu từ giữa câu chuyện) ────── */
    if (outcome === 'expired') {
      steps.push({
        id: 'call-protected',
        edge: 'e_client_protected',
        kind: 'GET',
        duration: 1200,
        latencyMs: 26,
        packetLabel: 'GET /me',
        title: { vi: 'Gọi route được bảo vệ bằng token cũ', en: 'Call a protected route with an old token' },
        detail: {
          vi: 'Người dùng đã đăng nhập từ hôm qua. Cookie vẫn còn (thời hạn 7 ngày) nhưng token bên trong chỉ sống 24 giờ. Đây chính là cái bẫy kinh điển: cookie còn mà token đã chết, nên request nào cũng 401 dù người dùng thấy mình "vẫn đang đăng nhập".',
          en: 'The user logged in yesterday. The cookie is still there (7-day lifetime) but the token inside lives only 24 hours. This is the classic trap: the cookie survives while the token does not, so every request 401s even though the user believes they are still signed in.',
        },
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs… (exp: hôm qua)' },
        nodeStates: { client: 'active', protected: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'verify-expired',
        at: 'protected',
        kind: 'ERROR',
        duration: 1200,
        status: 401,
        latencyMs: 1,
        title: { vi: 'jwt.verify ném TokenExpiredError', en: 'jwt.verify throws TokenExpiredError' },
        detail: {
          vi: 'Chữ ký vẫn HỢP LỆ — token không bị giả mạo, chỉ là đã quá hạn. Phân biệt được hai loại lỗi này rất quan trọng: chữ ký sai là dấu hiệu tấn công, còn hết hạn chỉ là chuyện thường ngày.',
          en: 'The signature is still VALID — the token was not forged, it simply expired. Telling these two failures apart matters: an invalid signature smells like an attack, an expiry is routine.',
        },
        payload: { error: 'TokenExpiredError', expiredAt: '2026-07-27T09:00:00.000Z' },
        nodeStates: { protected: 'error' },
        sfx: 'error',
      });
      steps.push({
        id: 'res-401',
        edge: 'e_client_protected',
        reverse: true,
        kind: 'ERROR',
        duration: 950,
        status: 401,
        packetLabel: '401',
        title: { vi: 'Client nhận 401', en: 'Client receives 401' },
        detail: {
          vi: 'Đây là nơi axios interceptor vào cuộc. Điều kiện bắt buộc: chỉ thử refresh MỘT lần cho mỗi request, nếu không hai lỗi 401 liên tiếp sẽ tạo ra vòng lặp vô tận đập vào server.',
          en: 'This is where the axios interceptor takes over. Non-negotiable condition: retry the refresh only ONCE per request, otherwise two consecutive 401s create an infinite loop hammering the server.',
        },
        nodeStates: { client: 'error', protected: 'idle' },
        sfx: 'buzz',
        teachingNote: {
          vi: 'Dừng lại và giảng về "refresh một lần rồi phát lại". Cũng nên nói về hàng đợi: nếu 5 request cùng 401, chỉ gọi refresh MỘT lần và cho 4 request kia chờ kết quả.',
          en: 'Pause and teach "refresh once, then replay". Mention queueing too: if five requests 401 at once, call refresh ONCE and let the other four await its result.',
        },
      });
      steps.push({
        id: 'refresh',
        edge: 'e_client_api',
        kind: 'POST',
        duration: 1100,
        packetLabel: 'POST /auth/refresh',
        title: { vi: 'Gọi /auth/refresh', en: 'Call /auth/refresh' },
        detail: {
          vi: 'Server xác minh token với tuỳ chọn ignoreExpiration, rồi kiểm tra lại tài khoản trong CSDL: còn tồn tại không, có bị khoá không, quyền có thay đổi không. Bước kiểm tra lại này là thứ bù đắp cho nhược điểm không thu hồi được của JWT.',
          en: 'The server verifies the token with ignoreExpiration, then re-checks the account in the database: does it still exist, is it banned, did the role change. That re-check is what compensates for JWT\'s inability to be revoked.',
        },
        nodeStates: { api: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'refresh-db',
        edge: 'e_api_db',
        kind: 'QUERY',
        duration: 900,
        latencyMs: 6,
        packetLabel: 'SELECT user',
        title: { vi: 'Kiểm tra lại tài khoản', en: 'Re-check the account' },
        detail: {
          vi: 'Nếu tài khoản đã bị vô hiệu hoá, refresh phải thất bại. Bỏ qua bước này nghĩa là một người bị ban vẫn dùng được hệ thống cho tới khi token cuối cùng hết hạn.',
          en: 'If the account was disabled the refresh must fail. Skipping this check means a banned user keeps working until their last token naturally expires.',
        },
        nodeStates: { db: 'processing' },
        sfx: 'blip',
      });
      steps.push({
        id: 'refresh-issue',
        edge: 'e_api_db',
        reverse: true,
        kind: 'TOKEN',
        duration: 950,
        packetLabel: 'new JWT',
        title: { vi: 'Phát token mới', en: 'Issue a fresh token' },
        detail: {
          vi: 'Token mới có exp mới, được đặt lại vào cookie httpOnly. Người dùng hoàn toàn không biết chuyện gì vừa xảy ra — phiên làm việc tự lành.',
          en: 'The new token carries a new exp and is written back into the httpOnly cookie. The user never notices anything happened — the session self-heals.',
        },
        payload: { ...JWT_PAYLOAD, iat: 1753776100, exp: 1753862500 },
        nodeStates: { db: 'idle', api: 'success' },
        sfx: 'lock',
      });
      steps.push({
        id: 'replay',
        edge: 'e_client_protected',
        kind: 'GET',
        duration: 1100,
        packetLabel: 'GET /me (retry)',
        title: { vi: 'Phát lại request gốc', en: 'Replay the original request' },
        detail: {
          vi: 'Interceptor gửi lại đúng request ban đầu với token mới. Từ góc nhìn của component React, lời gọi API chỉ đơn giản là… thành công. Không có màn hình đăng nhập nào chớp lên.',
          en: 'The interceptor re-sends the exact original request with the new token. From the React component\'s point of view the API call simply… succeeded. No login screen flashed at all.',
        },
        nodeStates: { client: 'active', protected: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'replay-ok',
        edge: 'e_client_protected',
        reverse: true,
        kind: 'RESPONSE',
        duration: 1000,
        status: 200,
        packetLabel: '200 OK',
        title: { vi: 'Phiên tự lành — 200 OK', en: 'Session healed — 200 OK' },
        detail: {
          vi: 'Toàn bộ chuỗi 401 → refresh → retry mất chưa tới 300ms và hoàn toàn vô hình với người dùng. Đây là dấu hiệu của một hệ thống xác thực được làm tử tế.',
          en: 'The whole 401 → refresh → retry chain took under 300ms and was entirely invisible. That is the signature of an authentication layer done properly.',
        },
        payload: { id: 1, email: 'cuong@cuongthai.com', role: 'ADMIN', isPro: true },
        nodeStates: { client: 'success', protected: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Đăng nhập ─────────────────────────────────────────────── */
    steps.push({
      id: 'login',
      edge: 'e_client_api',
      kind: 'POST',
      duration: 1200,
      latencyMs: 24,
      packetLabel: 'POST /auth/login',
      title: { vi: 'Gửi thông tin đăng nhập', en: 'Submit the credentials' },
      detail: {
        vi: 'Mật khẩu rời máy người dùng dưới dạng plaintext BÊN TRONG đường hầm TLS. Đây là lý do HTTPS không phải tuỳ chọn: trên HTTP, mật khẩu này ai cũng đọc được. Và tuyệt đối không bao giờ ghi thân request này vào log.',
        en: 'The password leaves the device in plaintext INSIDE the TLS tunnel. That is why HTTPS is not optional: over plain HTTP anyone could read it. And never, ever log this request body.',
      },
      payload: { email: 'cuong@cuongthai.com', password: '••••••••••' },
      headers: { 'Content-Type': 'application/json' },
      nodeStates: { client: 'active', api: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'find-user',
      edge: 'e_api_db',
      kind: 'QUERY',
      duration: 1000,
      latencyMs: 7,
      packetLabel: 'SELECT user',
      title: { vi: 'Tìm người dùng theo email', en: 'Look the user up by email' },
      detail: {
        vi: 'Chỉ lấy về passwordHash — mật khẩu gốc KHÔNG bao giờ tồn tại trong CSDL. Nếu email không có, hệ thống vẫn nên chạy một phép so sánh bcrypt giả để thời gian phản hồi không tiết lộ email nào đã đăng ký (chống tấn công dò thời gian).',
        en: 'Only the passwordHash comes back — the raw password never exists in the database. If the email is unknown the system should still run a dummy bcrypt compare so response timing does not reveal which emails are registered (timing-attack defence).',
      },
      payload: { sql: 'SELECT id, email, password_hash, role FROM users WHERE email = $1' },
      nodeStates: { db: 'processing' },
      sfx: 'blip',
    });

    steps.push({
      id: 'row',
      edge: 'e_api_db',
      reverse: true,
      kind: 'RESPONSE',
      duration: 900,
      packetLabel: 'user row',
      title: { vi: 'Nhận bản ghi người dùng', en: 'Receive the user row' },
      detail: {
        vi: 'passwordHash có dạng $2b$12$… — trong đó 12 là "cost factor", nghĩa là 2¹² vòng lặp. Con số này cố tình làm bcrypt CHẬM: chậm với bạn 200ms, nhưng chậm với kẻ dò mật khẩu hàng triệu lần thì thành bức tường.',
        en: 'The hash looks like $2b$12$… where 12 is the cost factor, i.e. 2¹² rounds. That number makes bcrypt deliberately SLOW: 200ms of inconvenience for you, a wall for someone trying millions of guesses.',
      },
      payload: { id: 1, email: 'cuong@cuongthai.com', password_hash: '$2b$12$Kx9…', role: 'ADMIN' },
      nodeStates: { db: 'success', api: 'processing' },
      sfx: 'blip',
    });

    steps.push({
      id: 'to-auth',
      edge: 'e_api_auth',
      kind: 'INTERNAL',
      duration: 900,
      packetLabel: 'bcrypt.compare',
      title: { vi: 'So khớp mật khẩu bằng bcrypt', en: 'Compare the password with bcrypt' },
      detail: {
        vi: 'bcrypt.compare băm lại mật khẩu vừa nhập với ĐÚNG salt lấy từ hash đã lưu, rồi so sánh. Không có phép "giải mã" nào ở đây — hàm băm là một chiều, đó chính là điều khiến rò rỉ CSDL không đồng nghĩa với rò rỉ mật khẩu.',
        en: 'bcrypt.compare re-hashes the submitted password with the SAME salt extracted from the stored hash, then compares. Nothing is ever "decrypted" — hashing is one-way, which is why a database leak is not automatically a password leak.',
      },
      nodeStates: { auth: 'processing' },
      sfx: 'click',
    });

    if (outcome === 'wrong') {
      steps.push({
        id: 'bcrypt-fail',
        at: 'auth',
        kind: 'ERROR',
        duration: 1200,
        latencyMs: 214,
        status: 401,
        title: { vi: 'Mật khẩu KHÔNG khớp', en: 'Password does NOT match' },
        detail: {
          vi: 'Thông báo trả về phải chung chung: "Email hoặc mật khẩu không đúng". Nói rõ "sai mật khẩu" là vô tình xác nhận email đó có tồn tại — món quà miễn phí cho kẻ dò tài khoản. Đây cũng là lúc tăng bộ đếm chống dò mật khẩu (rate limit theo IP + theo tài khoản).',
          en: 'The message must stay generic: "Invalid email or password". Saying "wrong password" confirms the email exists — a free gift to anyone enumerating accounts. This is also where the brute-force counter increments (rate limit by IP and by account).',
        },
        payload: { error: 'InvalidCredentials', message: 'Email hoặc mật khẩu không đúng' },
        nodeStates: { auth: 'error' },
        sfx: 'error',
        log: { vi: 'login failed · email=cuong@… · attempt 3/5 · ip=113.161.44.9', en: 'login failed · email=cuong@… · attempt 3/5 · ip=113.161.44.9' },
        teachingNote: {
          vi: 'Chú ý độ trễ 214ms: đó là bcrypt cố tình chậm. Đừng "tối ưu" con số này xuống.',
          en: 'Note the 214ms: that is bcrypt being slow on purpose. Do not "optimise" it away.',
        },
      });
      steps.push({
        id: 'wrong-back',
        edge: 'e_api_auth',
        reverse: true,
        kind: 'ERROR',
        duration: 850,
        status: 401,
        title: { vi: 'Trả lỗi về tầng API', en: 'Error bubbles back to the API layer' },
        detail: {
          vi: 'Không phát token, không đặt cookie, không tạo phiên. Trạng thái hệ thống không thay đổi gì ngoài một dòng log và một bộ đếm.',
          en: 'No token issued, no cookie set, no session created. Nothing in the system changed except a log line and a counter.',
        },
        nodeStates: { auth: 'idle', api: 'error' },
        sfx: 'buzz',
      });
      steps.push({
        id: 'wrong-client',
        edge: 'e_client_api',
        reverse: true,
        kind: 'ERROR',
        duration: 1000,
        status: 401,
        packetLabel: '401',
        title: { vi: 'Form hiện lỗi', en: 'The form shows the error' },
        detail: {
          vi: 'Sau 5 lần sai, tài khoản nên bị tạm khoá theo cấp số nhân (1 phút, 2 phút, 4 phút…). Khoá vĩnh viễn là con dao hai lưỡi: kẻ xấu có thể cố tình nhập sai để khoá tài khoản người khác.',
          en: 'After five failures the account should back off exponentially (1 min, 2 min, 4 min…). A permanent lock is double-edged: an attacker can deliberately fail logins to lock someone else out.',
        },
        payload: { error: 'InvalidCredentials', message: 'Email hoặc mật khẩu không đúng' },
        nodeStates: { api: 'idle', client: 'error' },
        sfx: 'error',
      });
      return steps;
    }

    /* ── Đăng nhập thành công ──────────────────────────────────── */
    steps.push({
      id: 'sign',
      at: 'auth',
      kind: 'TOKEN',
      duration: 1300,
      latencyMs: 208,
      title: { vi: 'Mật khẩu khớp — ký JWT', en: 'Password matches — sign the JWT' },
      detail: {
        vi: 'Token gồm ba phần ngăn bởi dấu chấm: header (thuật toán), payload (dữ liệu), signature (chữ ký). Điểm sống còn phải nhắc: payload chỉ được ENCODE base64url chứ KHÔNG mã hoá — ai cũng đọc được. Đừng bao giờ nhét dữ liệu nhạy cảm vào đó. Chữ ký không giấu nội dung, nó chỉ chứng minh nội dung chưa bị sửa.',
        en: 'The token has three dot-separated parts: header (algorithm), payload (claims), signature. The critical point to stress: the payload is merely base64url ENCODED, not encrypted — anyone can read it. Never put secrets there. The signature does not hide the content; it only proves the content was not altered.',
      },
      payload: JWT_PAYLOAD,
      // Tắt đèn Users DB ngay tại đây. Từ bước này trở đi bài giảng khẳng
      // định "không còn truy vấn CSDL nào nữa" — để node CSDL còn sáng là
      // hình ảnh nói ngược lại lời giảng.
      nodeStates: { auth: 'success', db: 'idle' },
      sfx: 'lock',
      teachingNote: {
        vi: 'Mở jwt.io dán token vào cho học viên thấy tận mắt payload đọc được — khoảnh khắc "à hoá ra thế" mạnh nhất của cả buổi.',
        en: 'Paste the token into jwt.io live so learners see the readable payload — the strongest "oh!" moment of the whole session.',
      },
    });

    steps.push({
      id: 'token-back',
      edge: 'e_api_auth',
      reverse: true,
      kind: 'TOKEN',
      duration: 900,
      packetLabel: 'JWT',
      title: { vi: 'Token về tầng API', en: 'Token returns to the API layer' },
      detail: {
        vi: 'Thời hạn ngắn (15 phút đến 24 giờ) là đánh đổi: token càng sống lâu, cửa sổ nguy hiểm khi bị đánh cắp càng rộng; càng ngắn thì càng phải refresh nhiều.',
        en: 'A short lifetime (15 minutes to 24 hours) is the trade-off: the longer a token lives, the wider the damage window if stolen; the shorter it lives, the more often you refresh.',
      },
      nodeStates: { auth: 'idle', api: 'success' },
      sfx: 'blip',
    });

    steps.push({
      id: 'set-cookie',
      edge: 'e_client_api',
      reverse: true,
      kind: 'TOKEN',
      duration: 1150,
      status: 200,
      packetLabel: store === 'cookie' ? 'Set-Cookie' : '200 + token',
      title: {
        vi: store === 'cookie' ? 'Đặt cookie httpOnly' : 'Trả token trong thân JSON',
        en: store === 'cookie' ? 'Set an httpOnly cookie' : 'Return the token in the JSON body',
      },
      detail: {
        vi:
          store === 'cookie'
            ? 'httpOnly nghĩa là document.cookie KHÔNG đọc được — một lỗ hổng XSS cũng không lấy được token. Secure bắt buộc HTTPS. SameSite=Lax chặn phần lớn CSRF. Đây là lựa chọn mặc định đúng cho ứng dụng web.'
            : 'Lưu ở localStorage nghĩa là BẤT KỲ đoạn JavaScript nào trên trang cũng đọc được token — kể cả script của thư viện quảng cáo bị chèn mã độc. Một lỗ hổng XSS duy nhất là mất toàn bộ phiên đăng nhập. Chỉ nên dùng khi thực sự không có cookie (ví dụ app native gọi API khác domain).',
        en:
          store === 'cookie'
            ? 'httpOnly means document.cookie cannot read it — even an XSS hole cannot exfiltrate the token. Secure forces HTTPS. SameSite=Lax stops most CSRF. This is the correct default for a web app.'
            : 'localStorage means ANY JavaScript on the page can read the token — including a compromised third-party ad script. A single XSS hole costs you every session. Only reach for it when cookies genuinely are not available (a native app hitting a cross-origin API).',
      },
      headers:
        store === 'cookie'
          ? { 'Set-Cookie': 'backend_token=eyJ…; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/' }
          : { 'Content-Type': 'application/json' },
      payload: store === 'cookie' ? { user: { id: 1, email: 'cuong@cuongthai.com', role: 'ADMIN' } } : { token: 'eyJhbGciOiJIUzI1NiIs…', user: { id: 1, role: 'ADMIN' } },
      nodeStates: { api: 'idle', client: 'success' },
      sfx: 'success',
      teachingNote:
        store === 'localStorage'
          ? { vi: 'Đây là điểm dừng để giảng XSS: mở console gõ localStorage.getItem("token") cho học viên thấy token hiện ra ngay.', en: 'Pause here for XSS: open the console, run localStorage.getItem("token") and let learners watch it print.' }
          : undefined,
    });

    steps.push({
      id: 'protected-call',
      edge: 'e_client_protected',
      kind: 'GET',
      duration: 1200,
      latencyMs: 26,
      packetLabel: 'GET /me',
      title: { vi: 'Gọi route được bảo vệ', en: 'Call a protected route' },
      detail: {
        vi:
          store === 'cookie'
            ? 'Trình duyệt TỰ ĐỘNG đính cookie vào mọi request cùng domain — frontend không phải viết một dòng nào. Tiện lợi này chính là lý do CSRF tồn tại, và cũng là lý do cần SameSite.'
            : 'Frontend phải tự gắn header Authorization: Bearer <token> ở mỗi lần gọi, thường thông qua một axios interceptor dùng chung.',
        en:
          store === 'cookie'
            ? 'The browser attaches the cookie AUTOMATICALLY to every same-site request — the frontend writes no code at all. That convenience is precisely why CSRF exists, and why SameSite matters.'
            : 'The frontend must attach Authorization: Bearer <token> itself on every call, usually through one shared axios interceptor.',
      },
      headers: store === 'cookie' ? { Cookie: 'backend_token=eyJ…' } : { Authorization: 'Bearer eyJ…' },
      nodeStates: { client: 'active', protected: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'verify',
      at: 'protected',
      kind: 'TOKEN',
      duration: 1100,
      latencyMs: 1,
      title: { vi: 'Xác minh chữ ký — 0 lần truy vấn CSDL', en: 'Verify the signature — 0 database queries' },
      detail: {
        vi: 'Hãy nhìn kỹ sơ đồ: KHÔNG có mũi tên nào đi xuống CSDL người dùng ở bước này. Server chỉ cần khoá bí mật để kiểm chữ ký, mất khoảng 0,1ms. Đó là toàn bộ ý nghĩa của "stateless" và là lý do JWT mở rộng theo chiều ngang dễ dàng — thêm bao nhiêu server cũng không cần chia sẻ bộ nhớ phiên.',
        en: 'Look carefully at the diagram: NO arrow reaches the users table in this step. The server only needs the secret to check the signature, roughly 0.1ms. That is the whole meaning of "stateless" and why JWT scales horizontally so easily — add as many servers as you like, none of them need a shared session store.',
      },
      payload: JWT_PAYLOAD,
      nodeStates: { protected: 'success' },
      sfx: 'lock',
      log: { vi: 'verify ok · alg=HS256 · sub=1 · role=ADMIN · 0.11ms', en: 'verify ok · alg=HS256 · sub=1 · role=ADMIN · 0.11ms' },
    });

    steps.push({
      id: 'authorize',
      at: 'protected',
      kind: 'INTERNAL',
      duration: 1000,
      title: { vi: 'Phân quyền — được làm gì?', en: 'Authorisation — what may you do?' },
      detail: {
        vi: 'Xác thực đã xong ("bạn là user id 1"), giờ mới tới phân quyền ("user id 1 có được xoá bài của người khác không?"). Cảnh báo quan trọng: role nằm trong token là ẢNH CHỤP lúc đăng nhập. Nếu admin vừa hạ quyền một người, token cũ của người đó vẫn ghi ADMIN cho tới khi hết hạn — với thao tác nhạy cảm, hãy kiểm quyền lại từ CSDL.',
        en: 'Authentication is done ("you are user 1"); authorisation begins now ("may user 1 delete someone else\'s post?"). Important warning: the role inside the token is a SNAPSHOT taken at login. If an admin just demoted someone, their old token still claims ADMIN until it expires — for sensitive operations, re-check the role against the database.',
      },
      nodeStates: { protected: 'processing' },
      sfx: 'click',
      teachingNote: {
        vi: 'Liên hệ với lỗ hổng IDOR: kiểm "đã đăng nhập chưa" là chưa đủ, phải kiểm "tài nguyên này có phải của bạn không" ở TỪNG thao tác.',
        en: 'Tie this to IDOR: checking "are you logged in" is not enough; every operation must also check "is this resource yours".',
      },
    });

    steps.push({
      id: 'protected-res',
      edge: 'e_client_protected',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1050,
      status: 200,
      packetLabel: '200 OK',
      title: { vi: 'Trả dữ liệu riêng tư', en: 'Return the private data' },
      detail: {
        vi: 'Vòng lặp khép lại. Từ giờ tới khi token hết hạn, mọi request đều đi con đường ngắn này: không bcrypt, không CSDL người dùng, chỉ một phép kiểm chữ ký.',
        en: 'The loop closes. Until the token expires every request takes this short path: no bcrypt, no users table, just one signature check.',
      },
      payload: { id: 1, email: 'cuong@cuongthai.com', role: 'ADMIN', isPro: true, proUntil: '2027-01-01T00:00:00.000Z' },
      nodeStates: { protected: 'success', client: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};
