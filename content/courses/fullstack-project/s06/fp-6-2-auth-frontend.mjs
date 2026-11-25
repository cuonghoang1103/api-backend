/**
 * 6.2 — Xác thực phía frontend: token trong bộ nhớ, F5 vẫn còn phiên, gộp refresh, nhiều tab (soạn 24/11/2026, agent fsp).
 * Output THẬT: Chrome 150 headless (playwright-core 1.65.1), Vite 8.3.8, React 19.3, React Router 8.5.2; API ChiaSe tag ch5
 * (refresh xoay vòng + phát hiện dùng lại từ bài 3.2). Repo chiase commit 6860f2b (nhánh ch6/frontend).
 * Phát hiện thật 24/11: refresh chưa gộp + StrictMode ⇒ MỖI lần F5 hai POST /auth/refresh cùng cookie: một 200, một 401
 * ⇒ giao diện "đăng xuất" dù phiên trên máy chủ vẫn sống (CSDL: họ token còn 1 token sống); gộp trong tab ⇒ 1 refresh/F5;
 * hai TAB F5 cùng lúc (đã gộp trong tab) ⇒ lần 1 một tab mất phiên, lần 2 máy chủ thu hồi cả họ ("token đã dùng bị dùng lại");
 * Web Locks ⇒ 0/20 lần mất phiên (41 refresh 200); access token 5 s hết hạn ⇒ 3 request 401 ⇒ đúng 1 refresh ⇒ 3 lần thử lại 200;
 * document.cookie rỗng, cookie rt httpOnly Path=/api/auth SameSite=Strict; ?tiep=//site-khác: React Router 8 ném
 * "External navigation is not allowed" (trang vỡ thành màn hình lỗi) ⇒ duongTiep() chỉ nhận đường trong site.
 * Nguồn (GET 200, 24/11/2026): Wikipedia "British Airways data breach" (2018, Magecart, 22 dòng JS, ICO £20m 10/2020);
 * MDN Web Locks API; OWASP Unvalidated Redirects and Forwards Cheat Sheet; React StrictMode.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CLIENT_DAU = `import { ApiError, docLoi } from './loi';

// Access token CHỈ nằm trong biến này (bộ nhớ của tab). Không localStorage/sessionStorage: mọi script chạy trên trang —
// kể cả mã XSS — đọc được storage. F5 làm mất biến ⇒ lấy lại bằng cookie refresh (httpOnly, JS không đọc được).
let accessToken: string | null = null;
export const datToken = (t: string | null) =&gt; {
  accessToken = t;
};

// Báo cho phần còn lại của app khi phiên chết hẳn (refresh thất bại) — AuthContext nghe để về trạng thái "khách".
export const PHIEN_HET = 'chiase:phien-het';`;

const COOKIE_CHECK = `[ 1443 ms] document.cookie = ""
[ 1453 ms] cookie trình duyệt giữ: rt httpOnly=true path=/api/auth sameSite=Strict`;

const NGU_CANH = `import { createContext, use } from 'react';
import type { NguoiDung } from '../api/types';

export type TrangThaiAuth =
  | { kieu: 'dang-kiem' } // vừa mở trang: chưa biết có phiên hay không — ĐỪNG vội chuyển về /dang-nhap
  | { kieu: 'khach' }
  | { kieu: 'da-dang-nhap'; user: NguoiDung };

export type Auth = TrangThaiAuth &amp; {
  dangNhap: (email: string, password: string) =&gt; Promise&lt;void&gt;;
  dangXuat: () =&gt; Promise&lt;void&gt;;
};

// Tách context + hook khỏi tệp component: tệp .tsx chỉ export component thì Fast Refresh của Vite mới giữ được state khi sửa mã.
export const AuthCtx = createContext&lt;Auth | null&gt;(null);

export function useAuth(): Auth {
  const a = use(AuthCtx);
  if (!a) throw new Error('useAuth phải nằm trong &lt;AuthProvider&gt;');
  return a;
}`;

const PROVIDER = `import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, datToken, lamMoiToken, PHIEN_HET } from '../api/client';
import type { NguoiDung } from '../api/types';
import { AuthCtx, type TrangThaiAuth } from './ngu-canh';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tt, setTt] = useState&lt;TrangThaiAuth&gt;({ kieu: 'dang-kiem' });

  // Mở trang / F5: token trong bộ nhớ đã mất ⇒ thử refresh bằng cookie; được thì hỏi /me.
  useEffect(() =&gt; {
    let conDung = true;
    (async () =&gt; {
      const token = await lamMoiToken();
      if (!conDung) return;
      if (!token) return setTt({ kieu: 'khach' });
      const user = await api&lt;NguoiDung&gt;('/me');
      if (conDung) setTt({ kieu: 'da-dang-nhap', user });
    })().catch(() =&gt; conDung &amp;&amp; setTt({ kieu: 'khach' }));
    const het = () =&gt; setTt({ kieu: 'khach' });
    window.addEventListener(PHIEN_HET, het);
    return () =&gt; {
      conDung = false;
      window.removeEventListener(PHIEN_HET, het);
    };
  }, []);

  const dangNhap = useCallback(async (email: string, password: string) =&gt; {
    const kq = await api&lt;{ accessToken: string; user: NguoiDung }&gt;('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    datToken(kq.accessToken);
    setTt({ kieu: 'da-dang-nhap', user: kq.user });
  }, []);

  const dangXuat = useCallback(async () =&gt; {
    try {
      await api('/auth/logout', { method: 'POST' }); // thu hồi refresh trên máy chủ + xoá cookie
    } finally {
      datToken(null); // dù máy chủ lỗi, tab này cũng quên token
      setTt({ kieu: 'khach' });
    }
  }, []);

  const giaTri = useMemo(() =&gt; ({ ...tt, dangNhap, dangXuat }), [tt, dangNhap, dangXuat]);
  return &lt;AuthCtx value={giaTri}&gt;{children}&lt;/AuthCtx&gt;;
}`;

const CLIENT_V1 = `// BẢN 1: mỗi lần cần là gọi /auth/refresh một lần — chưa gộp.
export async function lamMoiToken(): Promise&lt;string | null&gt; {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) {
    accessToken = null;
    window.dispatchEvent(new Event(PHIEN_HET));
    return null;
  }
  accessToken = ((await res.json()) as { accessToken: string }).accessToken;
  return accessToken;
}`;

const F5_V1 = `[ 1118 ms] → POST http://localhost:41811/api/auth/login
[ 1264 ms] ← 200 POST http://localhost:41811/api/auth/login
[ 2331 ms] sau đăng nhập — thanh trên: ChiaSe | Viết bài | An Nguyễn | Đăng xuất
[ 2332 ms] ----- F5 lần 1
[ 2572 ms] → POST http://localhost:41811/api/auth/refresh
[ 2572 ms] → POST http://localhost:41811/api/auth/refresh
[ 2826 ms] ← 401 POST http://localhost:41811/api/auth/refresh
[ 2826 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 2835 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 4066 ms] thanh trên: ChiaSe | Đăng nhập
[ 4066 ms] ----- F5 lần 2
[ 4263 ms] → POST http://localhost:41811/api/auth/refresh
[ 4263 ms] → POST http://localhost:41811/api/auth/refresh
[ 4859 ms] ← 401 POST http://localhost:41811/api/auth/refresh
[ 4860 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 4889 ms] ← 200 POST http://localhost:41811/api/auth/refresh
--- log API (từ lúc đăng nhập)
POST /api/auth/login 200 148.9ms
POST /api/auth/refresh 401 216.6ms
POST /api/auth/refresh 200 260.4ms
POST /api/auth/refresh 401 595.1ms
POST /api/auth/refresh 200 633.3ms
$ docker exec fsp-pg psql -U chiase -c "select family_id, count(*) filter (where revoked_at is null) song, count(*) tong from refresh_tokens group by 1 order by max(created_at) desc limit 1"
              family_id               | song | tong 
--------------------------------------+------+------
 5c556a83-23c3-48ba-8359-c9d571765ce1 |    1 |    3
(1 row)`;

const CLIENT_GOP = `// GỘP refresh: refresh token XOAY VÒNG (bài 3.2) — mỗi cookie chỉ đổi được MỘT lần. Hai lời gọi song song (StrictMode chạy
// effect 2 lần, 3 request cùng gặp TOKEN_HET_HAN…) mà gửi CÙNG cookie ⇒ một cái 200, cái kia 401 ⇒ app tưởng phiên chết.
// Nên: đang có một lần refresh bay thì mọi người CHỜ CHUNG promise đó.
let dangLamMoi: Promise&lt;string | null&gt; | null = null;

export function lamMoiToken(): Promise&lt;string | null&gt; {
  dangLamMoi ??= guiLamMoi().finally(() =&gt; {
    dangLamMoi = null;
  });
  return dangLamMoi;
}

async function guiLamMoi(): Promise&lt;string | null&gt; {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) {
    accessToken = null;
    window.dispatchEvent(new Event(PHIEN_HET));
    return null;
  }
  accessToken = ((await res.json()) as { accessToken: string }).accessToken;
  return accessToken;
}`;

const F5_V2 = `[ 1011 ms] → POST http://localhost:41811/api/auth/login
[ 1114 ms] ← 200 POST http://localhost:41811/api/auth/login
[ 2240 ms] sau đăng nhập — thanh trên: ChiaSe | Viết bài | An Nguyễn | Đăng xuất
[ 2240 ms] ----- F5 lần 1
[ 2473 ms] → POST http://localhost:41811/api/auth/refresh
[ 2576 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 2581 ms] → GET http://localhost:41811/api/me
[ 2594 ms] ← 200 GET http://localhost:41811/api/me
[ 4006 ms] thanh trên: ChiaSe | Viết bài | An Nguyễn | Đăng xuất
[ 4006 ms] ----- F5 lần 2
[ 4184 ms] → POST http://localhost:41811/api/auth/refresh
[ 4232 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 4234 ms] → GET http://localhost:41811/api/me
[ 4257 ms] ← 200 GET http://localhost:41811/api/me
[ 5703 ms] thanh trên: ChiaSe | Viết bài | An Nguyễn | Đăng xuất`;

const HAI_TAB_V2 = `$ N=20 node mo.mjs http://localhost:41811/ ./hai-tab.mjs     # đã gộp trong tab, CHƯA khoá giữa các tab
[ 3908 ms] lần 1: tab1 còn phiên · tab2 MẤT phiên
[ 5155 ms] lần 2: tab1 MẤT phiên · tab2 MẤT phiên
[ 5155 ms] cả hai tab mất phiên — dừng
[ 5155 ms] kết quả: 2/20 lần có tab mất phiên
--- log API (cảnh báo của auth.service, bài 3.2)
refresh: token đã dùng bị dùng lại — thu hồi họ 3372fb44-8163-479d-ab81-f07000fb39a6 (1 token còn sống)`;

const CLIENT_KHOA = `// Gộp trong MỘT tab chưa đủ: hai TAB dùng chung cookie nhưng mỗi tab một biến dangLamMoi (bài 6.2 đo: 2 tab F5 cùng lúc
// ⇒ tab chậm gửi cookie CŨ ⇒ máy chủ coi là token bị đánh cắp, thu hồi cả họ ⇒ cả hai tab mất phiên).
// Web Locks API: khoá có tên dùng chung mọi tab cùng origin. Tab sau CHỜ tab trước xong — lúc đó trình duyệt đã lưu cookie
// MỚI, nên tab sau gửi cookie mới, hợp lệ.
export function lamMoiToken(): Promise&lt;string | null&gt; {
  dangLamMoi ??= navigator.locks.request('chiase-refresh', guiLamMoi).finally(() =&gt; {
    dangLamMoi = null;
  });
  return dangLamMoi;
}`;

const HAI_TAB_V3 = `$ N=20 node mo.mjs http://localhost:41811/ ./hai-tab.mjs     # sau khi thêm navigator.locks
[26724 ms] kết quả: 0/20 lần có tab mất phiên
refresh 200: 41  401: 1`;

const HET_HAN = `[ 1455 ms] chờ 6 s cho access token (5 s) hết hạn…
[ 7461 ms] → GET http://localhost:41811/api/me
[ 7462 ms] → GET http://localhost:41811/api/me
[ 7462 ms] → GET http://localhost:41811/api/me
[ 7470 ms] ← 401 GET http://localhost:41811/api/me
[ 7471 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 7475 ms] → POST http://localhost:41811/api/auth/refresh
[ 7488 ms] ← 401 GET http://localhost:41811/api/me
[ 7488 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 7501 ms] ← 401 GET http://localhost:41811/api/me
[ 7503 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 7509 ms] ← 200 POST http://localhost:41811/api/auth/refresh
[ 7510 ms] → GET http://localhost:41811/api/me
[ 7510 ms] → GET http://localhost:41811/api/me
[ 7511 ms] → GET http://localhost:41811/api/me
[ 7520 ms] ← 200 GET http://localhost:41811/api/me
[ 7535 ms] ← 200 GET http://localhost:41811/api/me
[ 7549 ms] ← 200 GET http://localhost:41811/api/me
[ 7549 ms] 3 lời gọi /me song song trả: An Nguyễn, An Nguyễn, An Nguyễn`;

const DANG_NHAP = `import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router';
import { ApiError } from '../api/loi';
import { useAuth } from '../auth/ngu-canh';
import HopLoi from '../components/HopLoi';
import OTruong from '../components/OTruong';
import { duongTiep } from '../lib/duong-tiep';

export default function DangNhap() {
  const auth = useAuth();
  const [sp] = useSearchParams();
  const di = useNavigate();
  const [loi, setLoi] = useState&lt;ApiError | null&gt;(null);
  const [dangGui, setDangGui] = useState(false);
  const tiep = duongTiep(sp.get('tiep'));

  if (auth.kieu === 'da-dang-nhap') return &lt;Navigate to={tiep} replace /&gt;;

  async function gui(e: FormEvent&lt;HTMLFormElement&gt;) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setDangGui(true);
    setLoi(null);
    try {
      await auth.dangNhap(String(f.get('email')), String(f.get('password')));
      di(tiep, { replace: true }); // replace: bấm Back không quay về form đăng nhập
    } catch (err) {
      setLoi(err instanceof ApiError ? err : new ApiError(0, 'KHONG_RO', String(err)));
    } finally {
      setDangGui(false);
    }
  }

  return (
    &lt;section&gt;
      &lt;h1&gt;Đăng nhập&lt;/h1&gt;
      &lt;form onSubmit={gui} noValidate&gt;
        &lt;OTruong
          nhan="Email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={sp.get('email') ?? ''}
          required
          loi={loi?.loiTruong('email')}
        /&gt;
        &lt;OTruong
          nhan="Mật khẩu"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          loi={loi?.loiTruong('password')}
        /&gt;
        {loi &amp;&amp; loi.details.length === 0 &amp;&amp; &lt;HopLoi loi={loi} /&gt;}
        &lt;button disabled={dangGui}&gt;{dangGui ? 'Đang đăng nhập…' : 'Đăng nhập'}&lt;/button&gt;
      &lt;/form&gt;
      &lt;p&gt;
        Chưa có tài khoản? &lt;Link to="/dang-ky"&gt;Đăng ký&lt;/Link&gt;
      &lt;/p&gt;
    &lt;/section&gt;
  );
}`;

const LOI_FORM = `[  804 ms] → POST http://localhost:41811/api/auth/register
[  810 ms] ← 400 POST http://localhost:41811/api/auth/register
[ 1633 ms] ô displayName: aria-invalid=true · lỗi: "Cần tên hiển thị"
[ 1644 ms] ô email: aria-invalid=true · lỗi: "Email không hợp lệ"
[ 1650 ms] ô password: aria-invalid=true · lỗi: "Mật khẩu cần ít nhất 15 ký tự"
[ 1916 ms] → POST http://localhost:41811/api/auth/login
[ 1953 ms] ← 401 POST http://localhost:41811/api/auth/login
[ 2731 ms] đăng nhập sai: Email hoặc mật khẩu không đúng |  | Mã tra cứu: 7cebd36c-9a76-45c2-9065-3b95349aa731`;

const CAN_DANG_NHAP = `import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/ngu-canh';

// Cổng cho các trang cần đăng nhập. Đây là TIỆN cho người dùng, KHÔNG phải bảo mật: ai cũng sửa được JS trên máy họ.
// Bảo mật thật là requireAuth + kiểm quyền ở API (Chương 3–4).
export default function CanDangNhap() {
  const auth = useAuth();
  const o = useLocation();
  if (auth.kieu === 'dang-kiem') return &lt;p aria-busy="true"&gt;Đang kiểm phiên đăng nhập…&lt;/p&gt;;
  if (auth.kieu === 'khach')
    return &lt;Navigate to={\`/dang-nhap?tiep=\${encodeURIComponent(o.pathname + o.search)}\`} replace /&gt;;
  return &lt;Outlet /&gt;;
}`;

const MO_CHUYEN = `[ 1047 ms] console.error: Error handled by React Router default ErrorBoundary: Error: External navigation is not allowed
[ 1130 ms] pageerror: External navigation is not allowed
[ 2479 ms] sau đăng nhập, trình duyệt ở: http://localhost:41811/dang-nhap?tiep=//vi-du-lua-dao.example/dang-nhap`;

const DUONG_TIEP = `// "?tiep=/viet" — đăng nhập xong quay lại trang đang muốn vào. CHỈ nhận đường dẫn TRONG site:
// "//ke-gian.example" hay "https://…" là chuyển hướng mở (open redirect) — link lừa đảo mang tên miền của ta.
export function duongTiep(tiep: string | null): string {
  if (!tiep || !tiep.startsWith('/') || tiep.startsWith('//') || tiep.startsWith('/\\\\')) return '/';
  return tiep;
}`;

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-4-5-cat-token-o-dau', title: 'Authentication 4.5 — Cất token ở đâu trong trình duyệt', sub: 'localStorage, bộ nhớ, cookie httpOnly — so từng cách với XSS và CSRF.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-5-5-cuoc-dua-refresh', title: 'Authentication 5.5 — Cuộc đua refresh', sub: 'Vì sao xoay vòng + phát hiện dùng lại sinh ra cảnh báo giả, và các cách gỡ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-3-4-csrf', title: 'Authentication 3.4 — CSRF, ba lớp phòng', sub: 'Cookie tự đi theo request: SameSite là lớp đầu tiên ChiaSe đang dựa vào.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-14-1-xac-thuc', title: 'React 14.1 — Xác thực phía client', sub: 'Token, route bảo vệ, 401 → làm mới → thử lại trong một app React lớn hơn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-7-2-layout', title: 'React 7.2 — Layout, route lồng nhau, trang cần đăng nhập', sub: 'Route layout làm cổng, Navigate với replace.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'Wikipedia — British Airways data breach (2018)', 'en.wikipedia.org', 'https://en.wikipedia.org/wiki/British_Airways_data_breach'),
  nguon('🔒', 'MDN — Web Locks API', 'developer.mozilla.org', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API'),
  nguon('🛡️', 'OWASP — Unvalidated Redirects and Forwards Cheat Sheet', 'cheatsheetseries.owasp.org', 'https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html'),
  nguon('⚛️', 'React — <StrictMode>', 'react.dev', 'https://react.dev/reference/react/StrictMode'),
].join('\n');

const MERMAID = `sequenceDiagram
  participant T1 as Tab 1
  participant T2 as Tab 2
  participant L as Khoá chiase-refresh
  participant A as API
  T1->>L: xin khoá
  T2->>L: xin khoá (chờ)
  T1->>A: POST /auth/refresh (cookie rt cũ)
  A-->>T1: 200 + Set-Cookie rt mới
  T1->>L: nhả khoá
  L-->>T2: tới lượt
  T2->>A: POST /auth/refresh (cookie rt MỚI)
  A-->>T2: 200`;

export default {
  title: '6.2 — Auth in the frontend: token in memory, sessions that survive F5, one refresh at a time|||6.2 — Xác thực phía frontend: token trong bộ nhớ, F5 vẫn còn phiên, mỗi lúc một lần refresh',
  slug: 'fp-6-2-auth-frontend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đăng nhập/đăng ký trong React với access token CHỈ trong bộ nhớ và refresh token trong cookie httpOnly. Đo thật trong Chrome: refresh chưa gộp + StrictMode làm MỖI lần F5 giao diện "đăng xuất" dù phiên trên máy chủ còn sống; gộp bằng một promise dùng chung; hai tab F5 cùng lúc làm máy chủ thu hồi cả họ token ⇒ Web Locks, 0/20 lần hỏng; token hết hạn ⇒ 3 request chỉ sinh 1 refresh. Cổng đăng nhập, chuyển hướng ?tiep= không mở ra site lạ, và vụ British Airways 2018.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Frontend foundation</span>
<h2>Logged in, press F5, logged out — and why</h2>
<p class="lead">Chapter 3 designed the session: a 15-minute access token in the response body, a 30-day refresh token in an <code>httpOnly</code> cookie that rotates on every use, and reuse detection that revokes the whole family if an old refresh token comes back. The lesson promised three things for the frontend: the access token lives only in memory, an expired token triggers one refresh and a retry, and refreshes are merged because "two tabs refreshing at once logged the user out 1 time in 20". This lesson keeps those promises — and measures exactly how each one fails when you skip it.</p>

<h3>1. Where the token lives</h3>
<pre><code class="language-ts">${CLIENT_DAU}</code></pre>
<p>A module variable. Not <code>localStorage</code>, not <code>sessionStorage</code>: every script running on the page — your bundle, every npm package in it, an analytics snippet, injected code — can read storage. A token in a variable inside a module is not reachable from the global scope. When the tab closes or reloads, the variable is gone; that is what the refresh cookie is for. We checked in Chrome after logging in:</p>
<div class="out">${COOKIE_CHECK}</div>
<p><code>document.cookie</code> is empty for the page's JavaScript, while the browser still holds <code>rt</code> — <code>httpOnly</code>, only sent to <code>/api/auth</code>, <code>SameSite=Strict</code>. Lesson 6.3 shows the limit of this protection honestly.</p>

<h3>2. The provider and the three states</h3>
<pre><code class="language-ts">${NGU_CANH}</code></pre>
<p>Three states, not two. Right after a reload we <em>do not know yet</em> whether there is a session — the refresh request is in flight. A guard that treats "not known yet" as "guest" sends a logged-in user to the login page on every F5, then bounces them back; a gate must wait for <code>dang-kiem</code> to resolve.</p>
<pre><code class="language-tsx">${PROVIDER}</code></pre>

<h3>3. First version: F5 logs you out, every time</h3>
<p>The first <code>lamMoiToken</code> was the obvious one:</p>
<pre><code class="language-ts">${CLIENT_V1}</code></pre>
<p>Log in through the form, then reload twice:</p>
<div class="out">${F5_V1}</div>
<p>Every reload sends <strong>two</strong> refreshes with the same cookie at the same millisecond — StrictMode runs the provider's effect twice. The server's rotation does its job: one wins (200, new cookie), the other is told the token was already used (401). The losing call clears the access token and fires <code>PHIEN_HET</code>, and the header shows "Đăng nhập". Yet the database shows the session family still has one live token: <strong>the server thinks you are logged in, the UI says you are not.</strong> The user logs in again, creating a new family each time.</p>
<p>In production StrictMode is off, so this exact pair would not happen on load. But the same race happens any time two requests notice an expired token together — and that is normal: a page with a feed, a header and a notification badge fires three requests at once.</p>

<h3>4. Merge: one refresh in flight, everyone waits for it</h3>
<pre><code class="language-ts">${CLIENT_GOP}</code></pre>
<p>The first caller creates the promise; everyone who arrives while it is pending gets <em>the same promise</em>; when it settles, the variable is cleared so the next expiry starts a fresh one.</p>
<div class="out">${F5_V2}</div>
<p>One refresh per reload, then <code>/me</code>, session kept.</p>

<h3>5. Two tabs</h3>
<p>The merge lives in a module variable — one per tab. Two tabs share the cookie jar but not the variable. A script logged in once, opened a second tab, and reloaded both at the same instant, up to 20 times:</p>
<div class="out">${HAI_TAB_V2}</div>
<p>Round 1: both tabs sent the same cookie, one lost. Round 2 is worse: one tab still sent a cookie that had already been rotated, the server applied the rule from lesson 3.2 — "a used refresh token came back: assume theft, revoke the family" — and <strong>both</strong> tabs were logged out. The rule is right; the client was sending stale tokens.</p>
<p>The fix is a lock shared by all tabs of the origin: the Web Locks API (<code>navigator.locks</code>, in every current browser, secure contexts only — <code>localhost</code> counts).</p>
<pre><code class="language-ts">${CLIENT_KHOA}</code></pre>
<pre><code class="language-mermaid">${MERMAID}</code></pre>
<p>Tab 2 waits for tab 1 to finish. By the time it gets the lock, the browser has stored the new cookie from tab 1's response, so tab 2 sends a valid token and rotates it normally.</p>
<div class="out">${HAI_TAB_V3}</div>
<p>Zero failures in 20 rounds; 41 successful refreshes (20 rounds × 2 tabs + the first open) and one 401 — the login page opened before logging in.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "just disable reuse detection".</strong> When a security rule produces false alarms, the tempting fix is on the server: allow the old token for a few seconds, or remove detection. That reopens the hole it was protecting (a stolen refresh token stays usable). Fix the client that sends stale tokens; keep the server strict. If you must add a grace period, make it short and log every use.</p></div>

<h3>6. Expired access token: refresh once, retry once</h3>
<p>With <code>ACCESS_TTL_S=5</code> on the API, log in, wait six seconds, fire three protected requests at once:</p>
<div class="out">${HET_HAN}</div>
<p>Three 401s with code <code>TOKEN_HET_HAN</code> → <strong>one</strong> refresh → three retries, all 200. The rule in <code>api()</code> (lesson 6.1): only <code>TOKEN_HET_HAN</code> triggers a refresh — not every 401 (a wrong password is also 401) — and only one retry, so a broken server cannot cause an infinite loop.</p>

<h3>7. Login, register, the gate</h3>
<pre><code class="language-tsx">${DANG_NHAP}</code></pre>
<p>Errors come from the API's contract (lesson 5.3): field errors from <code>details[]</code> go under the right input, everything else into the error box:</p>
<div class="out">${LOI_FORM}</div>
<p>The registration page shows no "email already exists" message — the API answers 202 with the same sentence either way (lesson 3.1), and the frontend must not undo that. The first error box above still showed a "Mã tra cứu" (request id) for a wrong password; we changed <code>HopLoi</code> to show it only for 5xx errors, where support actually needs it.</p>
<pre><code class="language-tsx">${CAN_DANG_NHAP}</code></pre>
<p>The gate is convenience, not security: anyone can edit JavaScript on their own machine and render <code>/viet</code>. What protects data is <code>requireAuth</code> and the ownership checks in the API.</p>

<h3>8. <code>?tiep=</code> and the open redirect</h3>
<p>After login the user returns to the page they wanted: <code>/dang-nhap?tiep=%2Fviet</code>. Anything in a URL can be written by an attacker, so we tried <code>?tiep=//vi-du-lua-dao.example/dang-nhap</code> with the parameter used as-is:</p>
<div class="out">${MO_CHUYEN}</div>
<p>React Router 8 refuses to navigate to another origin and throws — the user is not sent away, but lands on a crash screen. Code that redirects with <code>window.location.assign(tiep)</code> would have sent them to the other site, carrying your domain's credibility ("I clicked a cuongthai.com link…"). The validator accepts only paths inside the site:</p>
<pre><code class="language-ts">${DUONG_TIEP}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">memory</span><span class="lz-d">access token in a module variable; never storage</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">restore</span><span class="lz-d">reload ⇒ state "checking" ⇒ one refresh ⇒ /me</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">merge</span><span class="lz-d">one refresh promise per tab</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">lock</span><span class="lz-d">navigator.locks across tabs ⇒ never a stale cookie</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">retry once</span><span class="lz-d">only on TOKEN_HET_HAN</span></div>
</div>

<h3>🕵️ Hacker's corner — British Airways (2018): any script on the page sees everything</h3>
<p>Between June and September 2018 attackers who had entered British Airways' network through a supplier's stolen credentials modified JavaScript on the airline's payment pages — Wired described it as 22 added lines — so that card details typed by customers were copied to an attacker-controlled site while bookings completed normally. About 429,612 people's data was potentially accessed; the UK ICO fined BA £20 million in October 2020 (Wikipedia, "British Airways data breach").</p>
<p>The lesson for a frontend: code running on your page sees what the user types and everything JavaScript can reach. Keeping the access token out of storage and the refresh token in an <code>httpOnly</code> cookie limits what such code can <em>take away</em> — it cannot steal the 30-day token. It does not stop it from <em>acting</em> as the user while the page is open (lesson 6.3 measures that). The defences are upstream: few, pinned dependencies; no third-party scripts on login and payment pages; a Content Security Policy (Chapter 11).</p>

<h3>In everyday life</h3>
<p>A hotel gives you a key card valid until tomorrow noon (access token) and keeps your passport at reception (refresh token). If you lose the card, the front desk makes a new one when you show who you are. If two members of your family go down at the same moment and both ask for a new card, the desk cancels the old card with the first request; the second person is holding a cancelled card. A sensible family sends one person, the others wait — that is the lock.</p>

<h3>On a real job</h3>
<p>"Users get logged out randomly" is one of the most common tickets on a project with rotating refresh tokens, and it is almost never random: open two tabs, let the token expire, come back. When you inherit an SPA, check three things on day one: where the token is stored (grep for <code>localStorage</code>), whether refresh is merged, and whether multiple tabs are handled. In an interview, describing this race and its fix is a strong signal of real experience.</p>

${spring(false, 'The frontend in this lesson works unchanged against a Spring backend that follows the same contract: login returns the access token in the body and sets the refresh cookie (<code>ResponseCookie</code> with <code>httpOnly</code>, <code>secure</code>, <code>sameSite("Strict")</code>, <code>path("/api/auth")</code>), refresh rotates and detects reuse, and errors carry a stable code so the client can tell an expired token from a bad one.', [
  ['sb-21-2-jwt-refresh-cookie', 'Spring Boot 21.2 — Login, access token in memory, refresh token in an httpOnly cookie'],
  ['sb-moc-22', 'Spring Boot — Project milestone 22: React ↔ Spring end to end'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Where do you store a JWT in a SPA?"</strong> — Short-lived access token in memory; long-lived refresh token in an <code>httpOnly</code>, <code>Secure</code>, <code>SameSite</code> cookie scoped to the refresh path. Explain what this does and does not protect against (theft vs acting during XSS).</li>
<li><strong>"How do you keep the user logged in after a reload?"</strong> — On start, call refresh with the cookie; keep a "checking" state so guards do not redirect too early.</li>
<li><strong>"Several requests get 401 at once. What happens?"</strong> — Merge into one refresh (shared promise), then retry each request once; refresh only for the expired-token code.</li>
<li><strong>"What about multiple tabs with rotating refresh tokens?"</strong> — Serialize refresh across tabs (Web Locks, or BroadcastChannel/leader election), otherwise a stale token triggers reuse detection.</li>
<li><strong>"What is an open redirect?"</strong> — Redirecting to a URL taken from user input without validation; fix by accepting only relative in-site paths or an allow-list.</li>
</ol>

<h3>🧪 Lab 6.2 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write <code>auth/ngu-canh.ts</code>, <code>AuthProvider.tsx</code>, <code>DangNhap.tsx</code>, <code>DangKy.tsx</code>, <code>CanDangNhap.tsx</code>; add <code>/viet</code> behind the gate.</li>
<li>Implement the <em>unmerged</em> refresh first. Log in, press F5, and capture the two refresh requests in DevTools → Network. Query <code>refresh_tokens</code> to show the session is still alive on the server.</li>
<li>Merge it. Then open two tabs and reload both together (Ctrl+Shift+R on each, or a script) until one is logged out. Add <code>navigator.locks</code> and repeat 20 times.</li>
<li>Start the API with <code>ACCESS_TTL_S=5</code>; prove three parallel requests cause exactly one refresh.</li>
<li>Try <code>?tiep=//example.com</code> and <code>?tiep=https://example.com</code>; make both land on <code>/</code>.</li>
</ol>
<p><strong>Done when:</strong> reloads in development keep the session with exactly one refresh each, two tabs survive 20 simultaneous reloads, an expired token is invisible to the user, and the login form shows API field errors under the right inputs.</p>
<p><strong>Rubric (10):</strong> no token in storage (1) · three auth states (1) · unmerged race reproduced and explained with DB evidence (2) · merge (1) · cross-tab lock with 20-round proof (2) · retry once on <code>TOKEN_HET_HAN</code> only (1) · field errors (1) · redirect validation (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>6860f2b</code> on <code>ch6/frontend</code>: <code>src/api/client.ts</code> (<code>lamMoiToken</code> with <code>navigator.locks</code>), <code>src/auth/ngu-canh.ts</code>, <code>src/auth/AuthProvider.tsx</code>, <code>src/pages/DangNhap.tsx</code>, <code>DangKy.tsx</code>, <code>src/components/CanDangNhap.tsx</code>, <code>OTruong.tsx</code>, <code>Khung.tsx</code> (user + logout), <code>src/lib/duong-tiep.ts</code>, <code>src/App.tsx</code>. Not done on purpose (exercise): when one tab logs out, the others keep their in-memory access token until it expires — broadcast a logout with <code>BroadcastChannel('chiase-auth')</code> and clear it everywhere.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">in-memory token</span><span class="v">Access token held in a JS variable; gone on reload, unreachable from storage.</span></div>
  <div class="kv"><span class="k">httpOnly cookie</span><span class="v">Cookie the page's JavaScript cannot read; sent by the browser automatically.</span></div>
  <div class="kv"><span class="k">single-flight</span><span class="v">Concurrent callers share one in-flight operation instead of starting their own.</span></div>
  <div class="kv"><span class="k">Web Locks API</span><span class="v">navigator.locks.request(name, fn): a named lock shared by all tabs of an origin.</span></div>
  <div class="kv"><span class="k">reuse detection</span><span class="v">Server rule: a used refresh token presented again ⇒ revoke the whole family.</span></div>
  <div class="kv"><span class="k">open redirect</span><span class="v">Redirecting to an unvalidated URL from user input.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Access token in memory, refresh token in an httpOnly cookie; reload ⇒ "checking" ⇒ one refresh ⇒ <code>/me</code>.</li>
<li>Unmerged refresh made every development reload look like a logout while the server session was alive.</li>
<li>A shared promise merges refresh in a tab; Web Locks serialize it across tabs: 2 failures before, 0/20 after.</li>
<li>Refresh only on <code>TOKEN_HET_HAN</code>, retry once: three 401s became one refresh and three 200s.</li>
<li>The gate is UX; the API is the security. Redirect targets are validated as in-site paths.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Nền frontend</span>
<h2>Đăng nhập rồi, bấm F5, bị đăng xuất — và vì sao</h2>
<p class="lead">Chương 3 thiết kế phiên: access token 15 phút nằm trong thân phản hồi, refresh token 30 ngày nằm trong cookie <code>httpOnly</code> xoay vòng mỗi lần dùng, và phát hiện dùng lại — refresh token cũ quay về thì thu hồi cả họ. Bài đó hứa ba điều cho frontend: access token chỉ ở trong bộ nhớ, token hết hạn thì refresh một lần rồi thử lại, và refresh phải được gộp vì "hai tab refresh cùng lúc làm người dùng bị đăng xuất 1 lần trong 20". Bài này giữ lời hứa — và đo chính xác mỗi điều hỏng ra sao khi bỏ qua.</p>

<h3>1. Token nằm ở đâu</h3>
<pre><code class="language-ts">${CLIENT_DAU}</code></pre>
<p>Một biến của module. Không <code>localStorage</code>, không <code>sessionStorage</code>: mọi script chạy trên trang — bundle của bạn, mọi gói npm trong đó, một đoạn mã thống kê, mã bị chèn — đều đọc được storage. Token trong biến nằm bên trong module thì không với tới được từ phạm vi toàn cục. Đóng tab hay tải lại là biến mất; việc đó để cookie refresh lo. Kiểm trong Chrome sau khi đăng nhập:</p>
<div class="out">${COOKIE_CHECK}</div>
<p><code>document.cookie</code> rỗng với JavaScript của trang, trong khi trình duyệt vẫn giữ <code>rt</code> — <code>httpOnly</code>, chỉ gửi tới <code>/api/auth</code>, <code>SameSite=Strict</code>. Bài 6.3 nói thật về giới hạn của lớp bảo vệ này.</p>

<h3>2. Provider và ba trạng thái</h3>
<pre><code class="language-ts">${NGU_CANH}</code></pre>
<p>Ba trạng thái, không phải hai. Ngay sau khi tải lại, ta <em>chưa biết</em> có phiên hay không — request refresh đang bay. Cổng nào coi "chưa biết" là "khách" sẽ đẩy người đã đăng nhập sang trang đăng nhập mỗi lần F5 rồi lại đẩy về; cổng phải chờ <code>dang-kiem</code> có kết quả.</p>
<pre><code class="language-tsx">${PROVIDER}</code></pre>

<h3>3. Bản đầu: F5 là bị đăng xuất, lần nào cũng vậy</h3>
<p><code>lamMoiToken</code> đầu tiên là bản hiển nhiên:</p>
<pre><code class="language-ts">${CLIENT_V1}</code></pre>
<p>Đăng nhập qua form, rồi tải lại hai lần:</p>
<div class="out">${F5_V1}</div>
<p>Mỗi lần tải lại gửi <strong>hai</strong> refresh cùng một cookie, cùng một mili giây — StrictMode chạy effect của provider hai lần. Xoay vòng ở máy chủ làm đúng việc: một cái thắng (200, cookie mới), cái kia bị báo token đã dùng (401). Lời gọi thua xoá access token và bắn <code>PHIEN_HET</code>, thanh trên hiện "Đăng nhập". Vậy mà CSDL cho thấy họ token vẫn còn một token sống: <strong>máy chủ nghĩ bạn đang đăng nhập, giao diện bảo không.</strong> Người dùng đăng nhập lại, mỗi lần tạo thêm một họ mới.</p>
<p>Trên production StrictMode tắt, nên đúng cặp này không xảy ra lúc mở trang. Nhưng cuộc đua y hệt xảy ra bất cứ khi nào hai request cùng phát hiện token hết hạn — mà chuyện đó bình thường: một trang có feed, thanh trên và chấm thông báo bắn ba request cùng lúc.</p>

<h3>4. Gộp: mỗi lúc một refresh đang bay, ai cũng chờ nó</h3>
<pre><code class="language-ts">${CLIENT_GOP}</code></pre>
<p>Người gọi đầu tiên tạo promise; ai tới trong lúc nó chưa xong nhận <em>đúng promise đó</em>; xong thì xoá biến để lần hết hạn sau bắt đầu promise mới.</p>
<div class="out">${F5_V2}</div>
<p>Một refresh mỗi lần tải lại, rồi <code>/me</code>, phiên còn nguyên.</p>

<h3>5. Hai tab</h3>
<p>Việc gộp nằm trong biến của module — mỗi tab một biến. Hai tab dùng chung hũ cookie nhưng không chung biến. Một script đăng nhập một lần, mở tab thứ hai, rồi tải lại cả hai cùng lúc, tối đa 20 lần:</p>
<div class="out">${HAI_TAB_V2}</div>
<p>Lần 1: hai tab gửi cùng một cookie, một tab thua. Lần 2 tệ hơn: một tab vẫn gửi cookie đã bị xoay, máy chủ áp luật của bài 3.2 — "refresh token đã dùng quay lại: coi như bị đánh cắp, thu hồi cả họ" — và <strong>cả hai</strong> tab bị đăng xuất. Luật đúng; client gửi token cũ mới là sai.</p>
<p>Cách sửa là một khoá dùng chung cho mọi tab của origin: Web Locks API (<code>navigator.locks</code>, có ở mọi trình duyệt hiện nay, chỉ trong ngữ cảnh an toàn — <code>localhost</code> được tính).</p>
<pre><code class="language-ts">${CLIENT_KHOA}</code></pre>
<pre><code class="language-mermaid">${MERMAID}</code></pre>
<p>Tab 2 chờ tab 1 xong. Lúc tới lượt, trình duyệt đã lưu cookie mới từ phản hồi của tab 1, nên tab 2 gửi token hợp lệ và xoay vòng bình thường.</p>
<div class="out">${HAI_TAB_V3}</div>
<p>Không lần nào hỏng trong 20 lượt; 41 lần refresh thành công (20 lượt × 2 tab + lần mở đầu) và một 401 — trang đăng nhập mở ra trước khi đăng nhập.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "tắt phát hiện dùng lại đi cho xong".</strong> Khi luật bảo mật báo động giả, cách sửa hấp dẫn nằm ở máy chủ: cho token cũ dùng thêm vài giây, hoặc bỏ phát hiện. Làm vậy mở lại đúng lỗ nó đang bịt (refresh token bị đánh cắp vẫn dùng được). Sửa client đang gửi token cũ; giữ máy chủ nghiêm. Nếu buộc phải thêm thời gian ân hạn, cho thật ngắn và ghi log mọi lần dùng.</p></div>

<h3>6. Access token hết hạn: refresh một lần, thử lại một lần</h3>
<p>Chạy API với <code>ACCESS_TTL_S=5</code>, đăng nhập, chờ sáu giây, bắn ba request cần đăng nhập cùng lúc:</p>
<div class="out">${HET_HAN}</div>
<p>Ba lần 401 mã <code>TOKEN_HET_HAN</code> → <strong>một</strong> refresh → ba lần thử lại, đều 200. Luật trong <code>api()</code> (bài 6.1): chỉ <code>TOKEN_HET_HAN</code> mới kích hoạt refresh — không phải mọi 401 (sai mật khẩu cũng là 401) — và chỉ thử lại một lần, để máy chủ hỏng không gây vòng lặp vô tận.</p>

<h3>7. Đăng nhập, đăng ký, cổng</h3>
<pre><code class="language-tsx">${DANG_NHAP}</code></pre>
<p>Lỗi lấy từ hợp đồng của API (bài 5.3): lỗi từng trường trong <code>details[]</code> nằm dưới đúng ô, còn lại vào hộp lỗi:</p>
<div class="out">${LOI_FORM}</div>
<p>Trang đăng ký không có câu "email đã tồn tại" — API trả 202 cùng một câu trong cả hai trường hợp (bài 3.1), và frontend không được phá điều đó. Hộp lỗi bản đầu ở trên còn hiện "Mã tra cứu" (request id) cho lần sai mật khẩu; ta sửa <code>HopLoi</code> chỉ hiện mã này với lỗi 5xx, nơi bộ phận hỗ trợ thật sự cần nó.</p>
<pre><code class="language-tsx">${CAN_DANG_NHAP}</code></pre>
<p>Cổng là tiện lợi, không phải bảo mật: ai cũng sửa được JavaScript trên máy mình để vẽ <code>/viet</code>. Thứ bảo vệ dữ liệu là <code>requireAuth</code> và các phép kiểm quyền sở hữu ở API.</p>

<h3>8. <code>?tiep=</code> và chuyển hướng mở</h3>
<p>Đăng nhập xong, người dùng quay lại trang họ muốn vào: <code>/dang-nhap?tiep=%2Fviet</code>. Mọi thứ trong URL đều có thể do kẻ tấn công viết, nên ta thử <code>?tiep=//vi-du-lua-dao.example/dang-nhap</code> với tham số dùng nguyên văn:</p>
<div class="out">${MO_CHUYEN}</div>
<p>React Router 8 từ chối điều hướng sang origin khác và ném lỗi — người dùng không bị đưa đi, nhưng rơi vào màn hình lỗi. Mã chuyển hướng bằng <code>window.location.assign(tiep)</code> thì đã đưa họ sang site kia, mang theo uy tín tên miền của bạn ("tôi bấm một liên kết cuongthai.com mà…"). Hàm kiểm chỉ nhận đường dẫn trong site:</p>
<pre><code class="language-ts">${DUONG_TIEP}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">bộ nhớ</span><span class="lz-d">access token trong biến của module; không bao giờ storage</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">khôi phục</span><span class="lz-d">tải lại ⇒ "đang kiểm" ⇒ một refresh ⇒ /me</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">gộp</span><span class="lz-d">mỗi tab một promise refresh</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">khoá</span><span class="lz-d">navigator.locks giữa các tab ⇒ không bao giờ gửi cookie cũ</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">thử lại một lần</span><span class="lz-d">chỉ với TOKEN_HET_HAN</span></div>
</div>

<h3>🕵️ Góc hacker — British Airways (2018): mọi script trên trang đều thấy hết</h3>
<p>Từ tháng 6 tới tháng 9/2018, kẻ tấn công — vào mạng của British Airways bằng thông tin đăng nhập bị đánh cắp của một nhà cung cấp — đã sửa JavaScript trên các trang thanh toán của hãng (Wired mô tả là thêm 22 dòng) để thông tin thẻ khách gõ vào bị chép sang một site của kẻ tấn công, trong khi việc đặt vé vẫn hoàn tất bình thường. Khoảng 429.612 người có thể bị lộ dữ liệu; cơ quan ICO của Anh phạt BA 20 triệu bảng vào tháng 10/2020 (Wikipedia, "British Airways data breach").</p>
<p>Bài học cho frontend: mã chạy trên trang của bạn thấy những gì người dùng gõ và mọi thứ JavaScript với tới. Giữ access token ngoài storage và refresh token trong cookie <code>httpOnly</code> giới hạn thứ mã đó <em>mang đi được</em> — nó không lấy được token 30 ngày. Nó không ngăn được mã đó <em>hành động</em> nhân danh người dùng khi trang còn mở (bài 6.3 đo điều này). Phòng thủ nằm ở thượng nguồn: ít phụ thuộc, ghim phiên bản; không gắn script bên thứ ba vào trang đăng nhập và thanh toán; Content Security Policy (Chương 11).</p>

<h3>Liên hệ đời thường</h3>
<p>Khách sạn đưa bạn thẻ phòng dùng tới trưa mai (access token) và giữ hộ chiếu ở quầy (refresh token). Mất thẻ thì quầy làm thẻ mới khi bạn chứng minh mình là ai. Nếu hai người trong gia đình cùng xuống quầy một lúc, ai cũng xin thẻ mới, quầy huỷ thẻ cũ theo yêu cầu đầu tiên; người thứ hai đang cầm một thẻ đã bị huỷ. Gia đình biết điều thì cử một người xuống, những người khác chờ — đó là cái khoá.</p>

<h3>Tình huống đi làm thật</h3>
<p>"Người dùng thỉnh thoảng bị đăng xuất" là một trong những ticket hay gặp nhất ở dự án có refresh token xoay vòng, và gần như không bao giờ "thỉnh thoảng": mở hai tab, để token hết hạn, quay lại. Khi nhận một SPA từ người khác, kiểm ba thứ ngay ngày đầu: token cất ở đâu (grep <code>localStorage</code>), refresh có gộp không, nhiều tab có được xử lý không. Khi phỏng vấn, kể được cuộc đua này và cách sửa là tín hiệu rất mạnh của kinh nghiệm thật.</p>

${spring(false, 'Frontend của bài này chạy nguyên với backend Spring theo cùng hợp đồng: đăng nhập trả access token trong thân và đặt cookie refresh (<code>ResponseCookie</code> với <code>httpOnly</code>, <code>secure</code>, <code>sameSite("Strict")</code>, <code>path("/api/auth")</code>), refresh xoay vòng và phát hiện dùng lại, lỗi mang mã ổn định để client phân biệt token hết hạn với token sai.', [
  ['sb-21-2-jwt-refresh-cookie', 'Spring Boot 21.2 — Đăng nhập, access token trong bộ nhớ, refresh token trong cookie httpOnly'],
  ['sb-moc-22', 'Spring Boot — Mốc dự án 22: React ↔ Spring trọn vẹn'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Trong SPA bạn cất JWT ở đâu?"</strong> — Access token ngắn hạn trong bộ nhớ; refresh token dài hạn trong cookie <code>httpOnly</code>, <code>Secure</code>, <code>SameSite</code>, giới hạn đường dẫn refresh. Giải thích nó bảo vệ và KHÔNG bảo vệ được gì (bị lấy cắp vs bị dùng ké khi có XSS).</li>
<li><strong>"Làm sao giữ đăng nhập sau khi tải lại trang?"</strong> — Lúc khởi động gọi refresh bằng cookie; giữ trạng thái "đang kiểm" để cổng không chuyển hướng quá sớm.</li>
<li><strong>"Nhiều request cùng nhận 401 thì sao?"</strong> — Gộp thành một lần refresh (promise dùng chung), rồi thử lại mỗi request một lần; chỉ refresh với mã token hết hạn.</li>
<li><strong>"Nhiều tab với refresh token xoay vòng thì sao?"</strong> — Xếp hàng refresh giữa các tab (Web Locks, hoặc BroadcastChannel/bầu tab chủ), nếu không token cũ sẽ kích hoạt phát hiện dùng lại.</li>
<li><strong>"Open redirect là gì?"</strong> — Chuyển hướng tới URL lấy từ dữ liệu người dùng mà không kiểm; sửa bằng cách chỉ nhận đường dẫn tương đối trong site hoặc danh sách cho phép.</li>
</ol>

<h3>🧪 Lab 6.2 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết <code>auth/ngu-canh.ts</code>, <code>AuthProvider.tsx</code>, <code>DangNhap.tsx</code>, <code>DangKy.tsx</code>, <code>CanDangNhap.tsx</code>; đặt <code>/viet</code> sau cổng.</li>
<li>Viết bản refresh <em>chưa gộp</em> trước. Đăng nhập, bấm F5, bắt hai request refresh trong DevTools → Network. Truy vấn <code>refresh_tokens</code> để chứng minh phiên trên máy chủ vẫn sống.</li>
<li>Gộp lại. Rồi mở hai tab và tải lại cả hai cùng lúc (Ctrl+Shift+R mỗi tab, hoặc bằng script) tới khi một tab bị đăng xuất. Thêm <code>navigator.locks</code> và lặp lại 20 lần.</li>
<li>Chạy API với <code>ACCESS_TTL_S=5</code>; chứng minh ba request song song chỉ sinh đúng một refresh.</li>
<li>Thử <code>?tiep=//example.com</code> và <code>?tiep=https://example.com</code>; cho cả hai về <code>/</code>.</li>
</ol>
<p><strong>Xong khi:</strong> tải lại khi dev vẫn giữ phiên với đúng một refresh mỗi lần, hai tab sống qua 20 lần tải lại cùng lúc, token hết hạn mà người dùng không hề biết, và form đăng nhập hiện lỗi từng trường của API dưới đúng ô.</p>
<p><strong>Thang điểm (10):</strong> không có token trong storage (1) · ba trạng thái xác thực (1) · tái hiện cuộc đua chưa gộp, giải thích bằng bằng chứng CSDL (2) · gộp (1) · khoá giữa tab có chứng minh 20 lượt (2) · chỉ thử lại một lần với <code>TOKEN_HET_HAN</code> (1) · lỗi theo trường (1) · kiểm đích chuyển hướng (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>6860f2b</code> trên <code>ch6/frontend</code>: <code>src/api/client.ts</code> (<code>lamMoiToken</code> có <code>navigator.locks</code>), <code>src/auth/ngu-canh.ts</code>, <code>src/auth/AuthProvider.tsx</code>, <code>src/pages/DangNhap.tsx</code>, <code>DangKy.tsx</code>, <code>src/components/CanDangNhap.tsx</code>, <code>OTruong.tsx</code>, <code>Khung.tsx</code> (tên người dùng + đăng xuất), <code>src/lib/duong-tiep.ts</code>, <code>src/App.tsx</code>. Cố ý chưa làm (bài tập): khi một tab đăng xuất, các tab khác vẫn giữ access token trong bộ nhớ tới khi hết hạn — phát tin đăng xuất bằng <code>BroadcastChannel('chiase-auth')</code> và xoá token ở mọi tab.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">token trong bộ nhớ</span><span class="v">Access token giữ trong biến JS; mất khi tải lại, không nằm trong storage.</span></div>
  <div class="kv"><span class="k">cookie httpOnly</span><span class="v">Cookie mà JavaScript của trang không đọc được; trình duyệt tự gửi.</span></div>
  <div class="kv"><span class="k">gộp (single-flight)</span><span class="v">Nhiều người gọi đồng thời dùng chung một thao tác đang chạy thay vì mỗi người một cái.</span></div>
  <div class="kv"><span class="k">Web Locks API</span><span class="v">navigator.locks.request(tên, hàm): khoá có tên dùng chung mọi tab của một origin.</span></div>
  <div class="kv"><span class="k">phát hiện dùng lại</span><span class="v">Luật máy chủ: refresh token đã dùng được gửi lại ⇒ thu hồi cả họ.</span></div>
  <div class="kv"><span class="k">chuyển hướng mở</span><span class="v">Chuyển hướng tới URL lấy từ dữ liệu người dùng mà không kiểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Access token trong bộ nhớ, refresh token trong cookie httpOnly; tải lại ⇒ "đang kiểm" ⇒ một refresh ⇒ <code>/me</code>.</li>
<li>Refresh chưa gộp làm mọi lần tải lại khi dev trông như đăng xuất, trong khi phiên trên máy chủ vẫn sống.</li>
<li>Promise dùng chung gộp refresh trong một tab; Web Locks xếp hàng giữa các tab: trước 2 lần hỏng, sau 0/20.</li>
<li>Chỉ refresh với <code>TOKEN_HET_HAN</code>, thử lại một lần: ba 401 thành một refresh và ba 200.</li>
<li>Cổng là trải nghiệm; API mới là bảo mật. Đích chuyển hướng được kiểm là đường dẫn trong site.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
