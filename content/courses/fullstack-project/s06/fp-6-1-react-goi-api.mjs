/**
 * 6.1 — React gọi API: một origin, một lớp gọi API, feed cuộn vô tận (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: Google Chrome 150 (headless, điều khiển bằng playwright-core 1.65.1), Vite 8.3.8, React 19.3,
 * React Router 8.5.2, TypeScript 7.0.2, oxlint; API ChiaSe tag ch5 (Express 5.3.0). Repo chiase commit aa6eeb5 (nhánh ch6/frontend).
 * Phát hiện thật 24/11: fetch sang origin khác bị CORS chặn NHƯNG API vẫn chạy request (log 200) và StrictMode gửi 2 lần;
 * thử CORS + credentials: OPTIONS preflight trước mọi request có Authorization (Chrome nhớ ~5 s; 3 request song song vẫn ra 2 preflight);
 * proxy của Vite ⇒ không CORS, cookie SameSite=Strict Path=/api/auth chạy y như production; erasableSyntaxOnly cấm
 * "constructor(readonly x)"; "import type" hợp đồng lỗi từ apps/api không kéo Zod vào bundle; feed ngây thơ + StrictMode ⇒ 20 dòng,
 * 10 lỗi key trùng; oxlint báo set-state-in-effect (2) + only-export-components (1) — một báo nhầm (setState sau await);
 * API tắt ⇒ proxy trả 502 text/plain thân RỖNG (res.json() sẽ văng) ⇒ docLoi không tin là JSON.
 * Nguồn (GET 200, 24/11/2026): PortSwigger Research — James Kettle 14/10/2016 (CORS phản chiếu Origin, sàn bitcoin);
 * MDN CORS; Vite server.proxy; React StrictMode; React Router (data routing).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const THU1 = `import { useEffect, useState } from 'react';

// THỬ 1: gọi thẳng API ở origin khác (VITE_API_URL=http://localhost:41815)
export default function App() {
  const [ketQua, setKetQua] = useState('đang tải…');
  useEffect(() =&gt; {
    fetch(\`\${import.meta.env.VITE_API_URL}/api/posts?limit=3\`)
      .then((r) =&gt; r.json())
      .then((d) =&gt; setKetQua(\`\${d.items.length} bài\`))
      .catch((e) =&gt; setKetQua(\`LỖI: \${e}\`));
  }, []);
  return &lt;p&gt;{ketQua}&lt;/p&gt;;
}`;

const CORS_LOI = `[  548 ms] → GET http://localhost:41815/api/posts?limit=3
[  549 ms] → GET http://localhost:41815/api/posts?limit=3
[  650 ms] console.error: Access to fetch at 'http://localhost:41815/api/posts?limit=3' from origin 'http://localhost:41811' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
[  654 ms] ✗ GET http://localhost:41815/api/posts?limit=3 net::ERR_FAILED
[  656 ms] console.error: Failed to load resource: net::ERR_FAILED
[  662 ms] console.error: Access to fetch at 'http://localhost:41815/api/posts?limit=3' from origin 'http://localhost:41811' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
[  663 ms] ✗ GET http://localhost:41815/api/posts?limit=3 net::ERR_FAILED
[  663 ms] console.error: Failed to load resource: net::ERR_FAILED
--- log API cùng lúc (cột requestId bỏ bớt)
GET /api/posts?limit=3 200 107.3ms
GET /api/posts?limit=3 200 9.7ms`;

const THU2 = `// THỬ 2 — API: app.use(cors({ origin: config.webOrigin, credentials: true }))
// Web: đăng nhập (credentials: 'include' để nhận cookie), gọi /me 3 lần song song, chờ 6 s, gọi /me lần nữa, rồi refresh.
const r = await fetch(\`\${API}/api/auth/login\`, {
  method: 'POST', headers: J, credentials: 'include', signal: ac.signal,
  body: JSON.stringify({ email: 'an@chiase.dev', password: 'chiase-mau-2026' }),
});
const { accessToken } = await r.json();
const me = () =&gt; fetch(\`\${API}/api/me\`, { headers: { authorization: \`Bearer \${accessToken}\` }, signal: ac.signal });
await Promise.all([me(), me(), me()]);
await new Promise((ok) =&gt; setTimeout(ok, 6000));
await me();
const rf = await fetch(\`\${API}/api/auth/refresh\`, { method: 'POST', credentials: 'include', signal: ac.signal });`;

const CORS_CRED = `[  328 ms] → POST http://localhost:41815/api/auth/login
[  329 ms] → POST http://localhost:41815/api/auth/login
[  330 ms] console.log: dừng: AbortError
[  337 ms] ✗ POST http://localhost:41815/api/auth/login net::ERR_ABORTED
[  871 ms] ← 200 POST http://localhost:41815/api/auth/login
[  886 ms] → GET http://localhost:41815/api/me
[  886 ms] → GET http://localhost:41815/api/me
[  886 ms] → GET http://localhost:41815/api/me
[  898 ms] ← 200 GET http://localhost:41815/api/me
[  906 ms] ← 200 GET http://localhost:41815/api/me
[  909 ms] ← 200 GET http://localhost:41815/api/me
[ 6909 ms] → GET http://localhost:41815/api/me
[ 6933 ms] ← 200 GET http://localhost:41815/api/me
[ 6935 ms] → POST http://localhost:41815/api/auth/refresh
[ 7189 ms] ← 200 POST http://localhost:41815/api/auth/refresh
[ 7190 ms] console.log: refresh qua cookie: 200
--- log API (cột requestId bỏ bớt)
OPTIONS /api/auth/login 204 29.5ms
OPTIONS /api/auth/login 204 8.2ms
POST /api/auth/login 200 452.2ms
OPTIONS /api/me 204 11.2ms
OPTIONS /api/me 204 0.8ms
GET /api/me 200 6.2ms
GET /api/me 304 7.9ms
GET /api/me 304 4.3ms
OPTIONS /api/me 204 2.7ms
GET /api/me 304 7.7ms
POST /api/auth/refresh 200 256.2ms`;

const VITE_CONFIG = `import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Bài 6.1: trình duyệt CHỈ nói chuyện với một origin (http://localhost:41811). Mọi /api/* do máy chủ dev của Vite
// chuyển tiếp sang API ⇒ không cần CORS, cookie refresh (SameSite=Strict, Path=/api/auth) chạy y như production,
// nơi Nginx làm đúng việc này (Chương 11). API_URL KHÔNG có tiền tố VITE_ ⇒ chỉ cấu hình đọc, không lọt vào bundle.
export default defineConfig(({ mode }) =&gt; {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 41811,
      strictPort: true,
      proxy: { '/api': { target: env.API_URL ?? 'http://localhost:41810' } },
    },
  };
});`;

const ENV_WEB = `# apps/web/.env.example — chép thành .env.local
# Biến có tiền tố VITE_* bị NHÚNG vào JavaScript gửi cho trình duyệt ⇒ ai cũng đọc được: KHÔNG để bí mật.
# API_URL (không có VITE_) chỉ dùng trong vite.config.ts: máy chủ dev chuyển tiếp /api/* tới đây (bài 6.1).
API_URL=http://localhost:41810`;

const LOI_TS = `// Hợp đồng lỗi lấy THẲNG từ API (bài 5.3). "import type" bị xoá hoàn toàn khi build ⇒ không kéo Zod hay mã server vào bundle,
// nhưng API đổi hình dạng lỗi là tsc của web báo đỏ ngay.
import type { PhanHoiLoi } from '../../../api/src/schemas/error.schema';

export type ChiTietLoi = NonNullable&lt;PhanHoiLoi['error']['details']&gt;[number];

// MỌI thất bại khi gọi API đều thành ApiError: component chỉ cần biết code (máy đọc), message (người đọc), details, requestId.
export class ApiError extends Error {
  // Khai trường rõ ràng thay vì "constructor(readonly status…)": tsconfig của Vite bật erasableSyntaxOnly — chỉ cho cú pháp
  // TypeScript XOÁ ĐI là ra JavaScript (để Node/trình duyệt chạy thẳng .ts). Tham số kiểu readonly sinh mã gán ⇒ bị cấm.
  readonly status: number; // 0 = không tới được máy chủ
  readonly code: string;
  readonly details: ChiTietLoi[];
  readonly requestId?: string;
  constructor(status: number, code: string, message: string, details: ChiTietLoi[] = [], requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
  // Lỗi của MỘT trường form (vd "title") — undefined nếu trường đó không sai
  loiTruong(field: string): string | undefined {
    return this.details.find((d) =&gt; d.field === field)?.message;
  }
}

// Đọc thân lỗi. KHÔNG tin là JSON: proxy/Nginx/trình duyệt có thể trả HTML hoặc thân rỗng (502, 504…).
export async function docLoi(res: Response): Promise&lt;ApiError&gt; {
  const chu = await res.text();
  try {
    const j = JSON.parse(chu) as PhanHoiLoi;
    if (j?.error?.code)
      return new ApiError(res.status, j.error.code, j.error.message, j.error.details, j.error.requestId);
  } catch {
    // không phải JSON ⇒ rơi xuống dưới
  }
  return new ApiError(res.status, 'PHAN_HOI_LA', \`Máy chủ trả \${res.status} không đúng định dạng\`);
}`;

const ERASABLE = `src/api/loi.ts(10,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
src/api/loi.ts(11,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
src/api/loi.ts(13,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
src/api/loi.ts(14,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`;

const CLIENT_API = `type TuyChon = { method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; body?: unknown; signal?: AbortSignal };

// Gọi API cùng origin (/api/* — Vite chuyển tiếp khi dev, Nginx khi production). Trả dữ liệu hoặc NÉM ApiError.
export async function api&lt;T&gt;(duong: string, { method = 'GET', body, signal }: TuyChon = {}): Promise&lt;T&gt; {
  const goi = async () =&gt; {
    const headers: Record&lt;string, string&gt; = {};
    if (body !== undefined) headers['content-type'] = 'application/json';
    if (accessToken) headers.authorization = \`Bearer \${accessToken}\`;
    try {
      return await fetch(\`/api\${duong}\`, {
        method,
        headers,
        signal,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (e) {
      if (signal?.aborted) throw e; // huỷ có chủ đích (rời trang) — để nguyên AbortError cho nơi gọi bỏ qua
      throw new ApiError(0, 'MAT_KET_NOI', 'Không kết nối được máy chủ — kiểm tra mạng rồi thử lại');
    }
  };

  let res = await goi();
  // Access token hết hạn ⇒ lấy token mới bằng cookie refresh rồi thử lại ĐÚNG MỘT lần (không lặp vô hạn).
  if (res.status === 401 &amp;&amp; accessToken) {
    const loi = await docLoi(res.clone());
    if (loi.code === 'TOKEN_HET_HAN' &amp;&amp; (await lamMoiToken())) res = await goi();
  }
  if (!res.ok) throw await docLoi(res);
  return (res.status === 204 ? undefined : await res.json()) as T;
}`;

const APP_TSX = `import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './auth/AuthProvider';
import CanDangNhap from './components/CanDangNhap';
import Khung from './components/Khung';
import BaiViet from './pages/BaiViet';
import DangKy from './pages/DangKy';
import DangNhap from './pages/DangNhap';
import Feed from './pages/Feed';
import KhongCo from './pages/KhongCo';
import VietBai from './pages/VietBai';

const router = createBrowserRouter([
  {
    Component: Khung,
    children: [
      { path: '/', Component: Feed },
      { path: '/bai/:id', Component: BaiViet },
      { path: '/dang-nhap', Component: DangNhap },
      { path: '/dang-ky', Component: DangKy },
      { Component: CanDangNhap, children: [{ path: '/viet', Component: VietBai }] },
      { path: '*', Component: KhongCo },
    ],
  },
]);

export default function App() {
  return (
    &lt;AuthProvider&gt;
      &lt;RouterProvider router={router} /&gt;
    &lt;/AuthProvider&gt;
  );
}`;

const FEED_NGAY_THO = `// BẢN NGÂY THƠ: tải trang đầu trong effect, NỐI vào danh sách
export default function Feed() {
  const [items, setItems] = useState&lt;Bai[]&gt;([]);
  useEffect(() =&gt; {
    api&lt;Trang&lt;Bai&gt;&gt;('/posts?limit=10').then((t) =&gt; setItems((cu) =&gt; [...cu, ...t.items]));
  }, []);
  return (
    &lt;ul&gt;
      {items.map((b) =&gt; (
        &lt;li key={b.id}&gt;
          &lt;Link to={\`/bai/\${b.id}\`}&gt;{b.title}&lt;/Link&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}`;

const STRICT_TRUNG = `[  374 ms] → GET http://localhost:41811/api/posts?limit=10
[  376 ms] → GET http://localhost:41811/api/posts?limit=10
[  388 ms] ← 200 GET http://localhost:41811/api/posts?limit=10
[  408 ms] ← 200 GET http://localhost:41811/api/posts?limit=10
[  425 ms] console.error: Encountered two children with the same key …
[  428 ms] console.error: Encountered two children with the same key …
[  430 ms] console.error: Encountered two children with the same key …
[  430 ms] console.error: Encountered two children with the same key …
[  434 ms] console.error: Encountered two children with the same key …
[  434 ms] console.error: Encountered two children with the same key …
[  438 ms] console.error: Encountered two children with the same key …
[  439 ms] console.error: Encountered two children with the same key …
[  440 ms] console.error: Encountered two children with the same key …
[  440 ms] console.error: Encountered two children with the same key …
[ 1903 ms] số &lt;li&gt;: 20`;

const USE_TRANG = `import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';
import { ApiError } from '../api/loi';
import type { Trang } from '../api/types';

type TrangThai = 'dang-tai' | 'ranh' | 'het' | 'loi';

// Danh sách phân trang bằng cursor (bài 5.2) cho MỌI đường dẫn trả { items, nextCursor }: feed, bình luận…
// Ba luật: (1) mỗi lúc tối đa MỘT request; (2) rời trang/đổi đường dẫn ⇒ huỷ request đang bay;
// (3) gộp theo id — cùng một bài không bao giờ hiện hai lần (key trùng).
export function useTrang&lt;T extends { id: string }&gt;(duong: string, limit = 10) {
  const [items, setItems] = useState&lt;T[]&gt;([]);
  const [trangThai, setTrangThai] = useState&lt;TrangThai&gt;('dang-tai');
  const [loi, setLoi] = useState&lt;ApiError | null&gt;(null);
  const cursor = useRef&lt;string | null&gt;(null);
  const dangBay = useRef&lt;AbortController | null&gt;(null);

  // Tải một trang. KHÔNG tự đặt 'dang-tai': trang đầu đã sẵn 'dang-tai' từ useState, các trang sau do taiThem đặt.
  const tai = useCallback(async () =&gt; {
    if (dangBay.current) return; // luật 1: đang tải thì bỏ qua (cuộn nhanh bắn nhiều lần)
    const ac = new AbortController();
    dangBay.current = ac;
    const q = new URLSearchParams({ limit: String(limit) });
    if (cursor.current) q.set('cursor', cursor.current);
    try {
      const t = await api&lt;Trang&lt;T&gt;&gt;(\`\${duong}?\${q}\`, { signal: ac.signal });
      cursor.current = t.nextCursor;
      setItems((cu) =&gt; {
        const da = new Set(cu.map((x) =&gt; x.id));
        return [...cu, ...t.items.filter((x) =&gt; !da.has(x.id))]; // luật 3
      });
      setTrangThai(t.nextCursor ? 'ranh' : 'het');
    } catch (e) {
      if (ac.signal.aborted) return; // luật 2: request bị huỷ có chủ đích — không phải lỗi
      setLoi(e instanceof ApiError ? e : new ApiError(0, 'KHONG_RO', String(e)));
      setTrangThai('loi');
    } finally {
      if (dangBay.current === ac) dangBay.current = null;
    }
  }, [duong, limit]);

  // Gọi từ sự kiện (cuộn tới đáy, bấm "Xem thêm", "Thử lại") ⇒ setState ở đây là đúng chỗ.
  const taiThem = useCallback(() =&gt; {
    if (dangBay.current) return;
    setTrangThai('dang-tai');
    void tai();
  }, [tai]);

  // Tải trang đầu; rời trang (hoặc StrictMode chạy effect 2 lần khi dev) ⇒ huỷ request đang bay.
  // Đổi đường dẫn thì component cha đặt key mới (vd key={id}) ⇒ React dựng lại hook này với state sạch — không tự reset bằng setState.
  useEffect(() =&gt; {
    // tai() chỉ setState SAU await (khi dữ liệu về) — đúng việc "đồng bộ với hệ thống ngoài" của effect. Luật của oxlint
    // không phân biệt trước/sau await nên báo nhầm; tắt ĐÚNG một dòng, có lý do, thay vì tắt cả luật.
    // oxlint-disable-next-line react/set-state-in-effect
    void tai();
    return () =&gt; {
      dangBay.current?.abort();
      dangBay.current = null;
    };
  }, [tai]);

  const thuLai = useCallback(() =&gt; {
    setLoi(null);
    taiThem();
  }, [taiThem]);

  return { items, setItems, trangThai, loi, taiThem, thuLai };
}`;

const OXLINT = `apps/web/src/hooks/useTrang.ts:44:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders help: Effects should synchronize React with external systems.
apps/web/src/pages/BaiViet.tsx:18:5: warning react(set-state-in-effect): Calling setState synchronously within an effect can trigger cascading renders help: Effects should synchronize React with external systems.
apps/web/src/auth/AuthContext.tsx:60:17: warning react(only-export-components): Fast refresh only works when a file only exports components.`;

const USE_THAY_DAY = `import { useEffect, useEffectEvent, useRef } from 'react';

// Gọi khiThay khi phần tử "đáy danh sách" lọt vào màn hình (cuộn vô tận). rootMargin 300px: tải trước khi người đọc chạm đáy.
// useEffectEvent (React 19.2): luôn gọi bản khiThay MỚI NHẤT mà không phải tạo lại IntersectionObserver mỗi lần render.
export function useThayDay(khiThay: () =&gt; void, bat: boolean) {
  const ref = useRef&lt;HTMLDivElement&gt;(null);
  const goi = useEffectEvent(khiThay);
  useEffect(() =&gt; {
    const el = ref.current;
    if (!el || !bat) return;
    const io = new IntersectionObserver((e) =&gt; e[0]?.isIntersecting &amp;&amp; goi(), { rootMargin: '300px' });
    io.observe(el);
    return () =&gt; io.disconnect();
  }, [bat]);
  return ref;
}`;

const FEED = `import type { Bai } from '../api/types';
import HopLoi from '../components/HopLoi';
import TheBai from '../components/TheBai';
import { useThayDay } from '../hooks/useThayDay';
import { useTrang } from '../hooks/useTrang';

// Feed cuộn vô tận: GET /posts?limit=10&amp;cursor=… (bài 5.2). Bốn trạng thái đều phải có giao diện: đang tải, lỗi, rỗng, hết.
export default function Feed() {
  const { items, trangThai, loi, taiThem, thuLai } = useTrang&lt;Bai&gt;('/posts', 10);
  const day = useThayDay(taiThem, trangThai === 'ranh');

  return (
    &lt;section&gt;
      {items.map((b) =&gt; (
        &lt;TheBai key={b.id} bai={b} /&gt;
      ))}
      {trangThai === 'dang-tai' &amp;&amp; &lt;p aria-busy="true"&gt;Đang tải…&lt;/p&gt;}
      {trangThai === 'loi' &amp;&amp; loi &amp;&amp; &lt;HopLoi loi={loi} thuLai={thuLai} /&gt;}
      {trangThai === 'het' &amp;&amp; items.length === 0 &amp;&amp; &lt;p&gt;Chưa có bài nào. Hãy là người đầu tiên!&lt;/p&gt;}
      {trangThai === 'het' &amp;&amp; items.length &gt; 0 &amp;&amp; &lt;p className="nho"&gt;— Hết bài —&lt;/p&gt;}
      &lt;div ref={day} /&gt;
    &lt;/section&gt;
  );
}`;

const CUON = `[  618 ms] → GET http://localhost:41811/api/posts?limit=10
[  618 ms] → GET http://localhost:41811/api/posts?limit=10
[  625 ms] ✗ GET http://localhost:41811/api/posts?limit=10 net::ERR_ABORTED
[  648 ms] ← 200 GET http://localhost:41811/api/posts?limit=10
[  796 ms] lúc đầu: 10 bài
[  826 ms] → GET http://localhost:41811/api/posts?limit=10&amp;cursor=eyJ0IjoiMjAy…
[  880 ms] ← 200 GET http://localhost:41811/api/posts?limit=10&amp;cursor=eyJ0IjoiMjAy…
[ 1513 ms] sau lần cuộn 1: 20 bài
[ 1524 ms] → GET http://localhost:41811/api/posts?limit=10&amp;cursor=eyJ0IjoiMjAy…
[ 1546 ms] ← 200 GET http://localhost:41811/api/posts?limit=10&amp;cursor=eyJ0IjoiMjAy…
[ 2229 ms] sau lần cuộn 2: 30 bài
[ 2936 ms] sau lần cuộn 3: 30 bài
[ 3644 ms] sau lần cuộn 4: 30 bài
[ 3654 ms] chữ cuối: — Hết bài —`;

const API_SAP = `[  679 ms] → GET http://localhost:41811/api/posts?limit=10
[  679 ms] → GET http://localhost:41811/api/posts?limit=10
[  679 ms] ✗ GET http://localhost:41811/api/posts?limit=10 net::ERR_ABORTED
[  682 ms] ← 502 GET http://localhost:41811/api/posts?limit=10
[  682 ms] console.error: Failed to load resource: the server responded with a status of 502 (Bad Gateway)
[ 2216 ms] hộp lỗi: Có sự cố phía máy chủ hoặc mạng. Bạn thử lại sau ít phút nhé. |  | Thử lại
[ 2224 ms] → GET http://localhost:41811/api/posts
[ 2237 ms] ← 502 GET http://localhost:41811/api/posts
[ 2238 ms] console.error: Failed to load resource: the server responded with a status of 502 (Bad Gateway)
[ 2238 ms] fetch trực tiếp: 502 text/plain thân=""`;

const HOP_LOI = `import type { ApiError } from '../api/loi';

// Hiện lỗi cho NGƯỜI. 4xx: câu của API (đã viết cho người đọc). 5xx/mất mạng: câu chung + mã tra cứu requestId
// (người dùng chụp màn hình ⇒ ta grep log theo mã đó). Không bao giờ hiện stack hay chữ kỹ thuật.
export default function HopLoi({ loi, thuLai }: { loi: ApiError; thuLai?: () =&gt; void }) {
  const maySai = loi.status === 0 || loi.status &gt;= 500;
  return (
    &lt;div role="alert" className="hop-loi"&gt;
      &lt;p&gt;{maySai ? 'Có sự cố phía máy chủ hoặc mạng. Bạn thử lại sau ít phút nhé.' : loi.message}&lt;/p&gt;
      {maySai &amp;&amp; loi.requestId &amp;&amp; (
        &lt;p className="nho"&gt;
          Mã tra cứu: &lt;code&gt;{loi.requestId}&lt;/code&gt;
        &lt;/p&gt;
      )}
      {thuLai &amp;&amp; &lt;button onClick={thuLai}&gt;Thử lại&lt;/button&gt;}
    &lt;/div&gt;
  );
}`;

const THE = [
  lienKet({ khoa: 'react', bai: 'rx-6-1-fetch', title: 'React 6.1 — Fetch trong effect, và vì sao đau đầu', sub: 'Cuộc đua dữ liệu, huỷ request, MSW — nền của useTrang trong bài này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-6-4-loi-api', title: 'React 6.4 — Đang tải, lỗi và rỗng', sub: 'Skeleton, thử lại, ranh giới lỗi — bốn trạng thái của một danh sách.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-7-1-router', title: 'React 7.1 — React Router căn bản', sub: 'Route, Link, tham số — và những bẫy hay gặp.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-11-3-strict-mode-ref', title: 'React 11.3 — StrictMode chạy hai lần', sub: 'Vì sao effect chạy hai lần khi dev, và cleanup đúng là gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'react', bai: 'rx-6-2-tanstack', title: 'React 6.2 — TanStack Query', sub: 'Khi danh sách nhiều hơn: cache, staleTime, useInfiniteQuery thay cho hook tự viết.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'PortSwigger Research — Exploiting CORS misconfigurations for Bitcoins and bounties (James Kettle, 14/10/2016)', 'portswigger.net/research', 'https://portswigger.net/research/exploiting-cors-misconfigurations-for-bitcoins-and-bounties'),
  nguon('📘', 'MDN — Cross-Origin Resource Sharing (CORS)', 'developer.mozilla.org', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS'),
  nguon('⚡', 'Vite — server.proxy', 'vite.dev/config/server-options', 'https://vite.dev/config/server-options#server-proxy'),
  nguon('⚛️', 'React — <StrictMode>', 'react.dev/reference/react/StrictMode', 'https://react.dev/reference/react/StrictMode'),
  nguon('🧭', 'React Router — Data routing (createBrowserRouter)', 'reactrouter.com', 'https://reactrouter.com/start/data/routing'),
].join('\n');

const MERMAID = `flowchart LR
  B["Chrome — localhost:41811"] -->|"HTML, JS"| V["Vite dev — 41811"]
  B -->|"/api/* cùng origin"| V
  V -->|"chuyển tiếp"| A["API Express — 41810"]
  A --> P[("PostgreSQL")]
  B -.->|"ảnh: GET thẳng"| M[("MinIO / R2")]`;

export default {
  title: '6.1 — React calls the API: one origin, one API layer, an infinite feed|||6.1 — React gọi API: một origin, một lớp gọi API, feed cuộn vô tận',
  slug: 'fp-6-1-react-goi-api',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nối React với API thật, đo trong Chrome thật: fetch sang origin khác bị CORS chặn nhưng API vẫn chạy request; CORS + credentials đẻ preflight; proxy của Vite cho một origin như production. Một lớp gọi API ném ApiError theo hợp đồng lỗi (import type, không kéo Zod vào bundle), React Router 8, feed cuộn vô tận theo nextCursor — StrictMode làm trùng trang đầu, oxlint chỉ chỗ setState thừa, API sập thì proxy trả 502 thân rỗng. Kèm vụ CORS phản chiếu Origin (2016).',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Frontend foundation</span>
<h2>The browser meets the API — and immediately says no</h2>
<p class="lead">Five chapters of backend, verified with curl and scripts. Now the user's real client — a browser — has to talk to it. A browser is not curl: it enforces the same-origin policy, it runs your effects twice in development, it keeps cookies by its own rules, and it shows the user every mistake. This lesson connects the React app from Chapter 1 to the API, measures each step in a real Chrome, and ends with a feed that scrolls through every published post exactly once.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. First attempt: just fetch it</h3>
<p>The quickest thing anyone writes: put the API address in an environment variable and call it from an effect.</p>
<pre><code class="language-tsx">${THU1}</code></pre>
<p>Opened in Chrome 150 (headless, driven by a small script that prints the console and network events with timestamps):</p>
<div class="out">${CORS_LOI}</div>
<p>Three facts, all important:</p>
<ul>
<li><strong>Blocked by CORS.</strong> The page lives on <code>http://localhost:41811</code>, the API on <code>http://localhost:41815</code>. A different <em>port</em> is a different <em>origin</em> (scheme + host + port). By default a page may <em>send</em> requests to another origin but may not <em>read</em> the answer unless that origin says so with <code>Access-Control-Allow-Origin</code>.</li>
<li><strong>The API ran the request — twice — and answered 200.</strong> Look at the API log. CORS is enforced by the browser, after the response arrives. It does not protect your server; it protects the <em>user</em> from a page on another site reading data with the user's cookies. Never treat "CORS blocks it" as access control.</li>
<li><strong>Two requests, not one.</strong> React's <code>&lt;StrictMode&gt;</code> (on by default in the Vite template) mounts every component, unmounts it, and mounts it again in development, so every effect runs twice. It exists to reveal effects that cannot survive a remount — we will meet one in a minute.</li>
</ul>

<h3>2. Two ways out — measured</h3>
<p><strong>Way A: turn on CORS in the API.</strong> We tried it for real: <code>cors({ origin: WEB_ORIGIN, credentials: true })</code> in the API, and on the page <code>credentials: 'include'</code> (otherwise the browser neither sends nor stores cookies cross-origin). Log in, call <code>/me</code> three times in parallel, wait 6 seconds, call it again, then refresh:</p>
<pre><code class="language-ts">${THU2}</code></pre>
<div class="out">${CORS_CRED}</div>
<p>It works — the refresh cookie travelled, because <code>localhost:41811</code> and <code>localhost:41815</code> are different origins but the <em>same site</em>, so <code>SameSite=Strict</code> still allows it. But read the API log: every request carrying <code>Authorization</code> or a JSON body is a "non-simple" request and is preceded by an <code>OPTIONS</code> <em>preflight</em>. Chrome remembered the preflight for about five seconds (no <code>Access-Control-Max-Age</code> header), three parallel calls still produced two preflights, and after the 6-second pause the next call needed a new one. Locally each preflight costs 1–30 ms; from a phone in Hà Nội to a server in Singapore, one extra round trip each time. And you now own a CORS policy that must be exactly right in production.</p>
<p><strong>Way B: one origin.</strong> The browser only ever talks to <code>localhost:41811</code>. Vite's development server serves the React files <em>and</em> forwards everything under <code>/api</code> to the API. In production (Chapter 11) Nginx does the same job: <code>chiase.example/</code> serves the built files, <code>chiase.example/api/</code> goes to Node. Same shape in development and production, no CORS code at all, no preflights, cookies behave identically.</p>
<pre><code class="language-ts">${VITE_CONFIG}</code></pre>
<pre><code class="language-bash">${ENV_WEB}</code></pre>
<p>Why <code>API_URL</code> and not <code>VITE_API_URL</code>? Vite copies every variable whose name starts with <code>VITE_</code> into the JavaScript it sends to the browser, where anyone can read it. The proxy target is needed only by the dev server, so it should not have the prefix. The page itself now calls a <em>relative</em> path, <code>/api/posts</code>, and never knows where the API lives.</p>
<table>
<thead><tr><th></th><th>A. CORS + credentials</th><th>B. One origin (proxy / Nginx)</th></tr></thead>
<tbody>
<tr><td>Code in the API</td><td>cors middleware, exact origin list per environment</td><td>none</td></tr>
<tr><td>Extra requests</td><td>OPTIONS before most requests (cache ≈ 5 s here)</td><td>none</td></tr>
<tr><td>Cookies</td><td>need <code>credentials: 'include'</code>; cross-<em>site</em> breaks <code>SameSite=Strict</code></td><td>first-party, as designed in Chapter 3</td></tr>
<tr><td>When you need it</td><td>API used by pages on <em>other</em> sites, mobile web on another domain</td><td>your own SPA and your own API — ChiaSe</td></tr>
</tbody></table>
<p>ChiaSe chooses B and keeps the API without CORS. If one day a partner site needs the API, you add CORS then — with an explicit list, never by echoing whatever <code>Origin</code> arrives (see the hacker's corner).</p>

<h3>3. One API layer: every failure becomes an ApiError</h3>
<p>Components should not call <code>fetch</code> directly. They should not parse error bodies, attach tokens or guess whether a 502 contains JSON. One small module does that, and everything else receives either data or an <code>ApiError</code> with the fields of the Chapter 5 contract:</p>
<pre><code class="language-ts">${LOI_TS}</code></pre>
<p>Two decisions in this file are worth stopping on.</p>
<p><strong>The type comes from the API.</strong> <code>import type { PhanHoiLoi } from '../../../api/src/schemas/error.schema'</code> reaches into the other workspace. That is safe here because it is <code>import type</code>: TypeScript checks against it and then erases the line completely — no Zod, no server code in the bundle (Checkpoint 6 verifies that the built bundle does not contain <code>loiSchema</code>). If the API ever changes the error shape, <code>tsc</code> of the web app turns red the same day. A <em>value</em> import across workspaces is a different story: it works in Vite, but would break the API's own build in Chapter 9, so we do not do it.</p>
<p><strong>The template's compiler settings bite.</strong> The first version used the usual shorthand <code>constructor(readonly status: number, …)</code>:</p>
<div class="out">${ERASABLE}</div>
<p>The Vite template enables <code>erasableSyntaxOnly</code>: only TypeScript syntax that can simply be <em>deleted</em> to get JavaScript is allowed (that is what lets Node 22 and other tools run <code>.ts</code> by stripping types). Parameter properties generate assignments, enums generate objects — both are refused. Declare the fields explicitly, as above.</p>
<p>And the request function itself — tokens and refresh come in lesson 6.2, the first part is what matters now:</p>
<pre><code class="language-ts">${CLIENT_API}</code></pre>
<p><code>fetch</code> only rejects when nothing came back (network down, DNS, CORS, abort). A 400 or a 500 is a <em>successful</em> fetch with <code>res.ok === false</code> — so we check <code>ok</code> ourselves, and convert the network rejection into <code>MAT_KET_NOI</code> so the UI has one type to handle. An abort is re-thrown untouched: it is not an error, it is us leaving the page.</p>

<h3>4. Routes</h3>
<p>ChiaSe has five pages: feed, post, login, register, write. React Router 8 (current <code>latest</code>; it needs React ≥ 19.2.7 and Node ≥ 22.22) with a <em>data router</em>:</p>
<pre><code class="language-tsx">${APP_TSX}</code></pre>
<p>A layout route (<code>Khung</code>, no path) draws the header and an <code>&lt;Outlet/&gt;</code>; the gate <code>CanDangNhap</code> is also a layout route around the pages that need a login — lesson 6.2 writes it. Notice the dev server must answer <code>index.html</code> for <code>/bai/…</code> when you press F5 there; Vite does, and Nginx will need <code>try_files … /index.html</code> in Chapter 11.</p>

<h3>5. The feed — first the naive version</h3>
<p>Load page one in an effect and append it to the list:</p>
<pre><code class="language-tsx">${FEED_NGAY_THO}</code></pre>
<div class="out">${STRICT_TRUNG}</div>
<p>Twenty rows for ten posts and ten key warnings. StrictMode ran the effect twice, both requests came back, both <em>appended</em>. In production StrictMode is off and you would see ten rows — until the day the same effect runs twice for a real reason (a parent re-mounting, a route revisited quickly). The effect was not safe to repeat, and StrictMode told us so.</p>
<p>The fix is not "turn StrictMode off". The effect must clean up after itself: cancel the request it started. Then build what the feed actually needs — a hook that follows <code>nextCursor</code> from Chapter 5:</p>
<pre><code class="language-ts">${USE_TRANG}</code></pre>
<p>Three rules, each from a failure: at most one request in flight (an <code>IntersectionObserver</code> can fire several times while one page is loading); leaving the page aborts the request (StrictMode's first run is aborted, so it never appends); merge by <code>id</code> (a belt-and-braces guard: a post that moves between pages never appears twice).</p>
<p>oxlint, configured in Chapter 1 to fail on warnings, did not like the first draft of this hook and of the post page:</p>
<div class="out">${OXLINT}</div>
<p>Two of these were real. The first drafts reset state at the start of an effect (<code>setItems([])</code>, <code>setBai(null)</code>) to "clean up" when the post id changed. That costs an extra render each time, and React has a better tool: give the component a <code>key</code> — <code>&lt;ChiTiet key={id} id={id}/&gt;</code> — and React throws the old state away by itself when the id changes. The third warning: a <code>.tsx</code> file that exports both a component and a hook breaks Vite's Fast Refresh, so the context and <code>useAuth</code> moved to their own <code>.ts</code> file.</p>
<p>One warning remained and is a false positive: the effect calls <code>tai()</code>, which sets state only <em>after</em> <code>await</code> — exactly what effects are for (synchronising with an external system). The rule cannot see the <code>await</code>. We disabled it for that one line with a comment saying why — never for the whole project.</p>
<p>The observer — <code>useEffectEvent</code> (stable in React 19.2) lets the observer call the latest callback without being recreated on every render:</p>
<pre><code class="language-ts">${USE_THAY_DAY}</code></pre>
<pre><code class="language-tsx">${FEED}</code></pre>
<p>Scrolling to the bottom in Chrome with 30 published posts:</p>
<div class="out">${CUON}</div>
<p>The aborted request is StrictMode's first run, cancelled as designed. Page two was requested <em>before</em> the first scroll: the sentinel was already within 300 px of the screen — that is the <code>rootMargin</code> doing its job, loading ahead. Thirty posts, three requests, no fourth request for an empty page (Chapter 5's <code>nextCursor: null</code>), and the end of the list is said out loud.</p>

<h3>6. When the API is down</h3>
<p>We stopped the API and reloaded:</p>
<div class="out">${API_SAP}</div>
<p>The Vite proxy answers <strong>502 with an empty <code>text/plain</code> body</strong>. Any code that does <code>await res.json()</code> on every response would crash here with "Unexpected end of JSON input" and show the user nothing useful. <code>docLoi</code> never assumes JSON; it becomes a <code>PHAN_HOI_LA</code> error with status 502, and the feed shows the friendly box with a "Thử lại" button. Nginx will produce its own 502/504 HTML pages in production — same code path. The error box itself shows the API's message for 4xx, and for 5xx a neutral sentence plus the <code>requestId</code>, so a screenshot from a user becomes one <code>grep</code> in the server log (lesson 5.3):</p>
<pre><code class="language-tsx">${HOP_LOI}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">one origin</span><span class="lz-d">page and /api on the same origin: proxy in dev, Nginx in prod</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">one API layer</span><span class="lz-d">fetch only in client.ts; every failure is an ApiError</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">contract types</span><span class="lz-d">import type from the API; erased at build</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">effects that repeat safely</span><span class="lz-d">abort on cleanup; reset by key, not setState</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">four states</span><span class="lz-d">loading · error with retry · empty · end</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — "CORS error? Add <code>Access-Control-Allow-Origin: *</code>."</strong> The classic Stack Overflow answer. With <code>*</code> browsers refuse to send cookies anyway, so the login breaks in a new way; the next "fix" is to reflect the request's <code>Origin</code> with credentials allowed — which hands your users' data to any website. Fix the architecture (one origin) or write an exact allow-list.</p></div>

<h3>🕵️ Hacker's corner — reflected CORS (2016)</h3>
<p>In October 2016 James Kettle of PortSwigger published research on CORS misconfigurations. Many applications "configured" CORS by copying whatever <code>Origin</code> header arrived into <code>Access-Control-Allow-Origin</code>, together with <code>Access-Control-Allow-Credentials: true</code>. One example was an unnamed bitcoin exchange: a request to its <code>/api/requestApiKey</code> endpoint from <em>any</em> origin, carrying the victim's session cookie, came back with the victim's API key — readable by the attacker's page. Others accepted any origin that merely <em>started</em> with the trusted domain, or the special <code>null</code> origin. All of it is the browser doing exactly what the server told it to.</p>
<p>That is why ChiaSe has no CORS at all, and why, if you ever need it, the allowed origins must be a fixed list compared exactly.</p>

<h3>In everyday life</h3>
<p>A building's reception desk (Vite or Nginx) is the only door visitors use. Behind it are many offices (the React files, the API, later the realtime server). A visitor never needs to know which floor the API is on — reception forwards them. Opening a side door for each office (CORS for each origin) works, but now every door needs its own guard, and one careless guard who lets in "anyone who says they're from head office" is enough.</p>

<h3>On a real job</h3>
<p>In outsourcing the frontend and backend often live in different repositories and are deployed by different teams, so the first integration day is usually a CORS day. Ask early: will production serve the SPA and the API from one domain (a gateway, Nginx, a CDN path rule)? If yes, use a dev proxy and never ship CORS. If no, the backend team owns an explicit origin list per environment, in configuration, reviewed like any security setting. Second scene: a tester reports "the list shows each item twice". Before blaming the API, open the Network tab: two identical requests at the same millisecond in development is StrictMode; your effect is missing its cleanup.</p>

${spring(false, 'With Spring Boot the backend side changes, the frontend side does not: you still choose between a dev proxy (same Vite config pointing at :8080) and CORS (<code>CorsConfigurationSource</code> / <code>@CrossOrigin</code> with an explicit origin list and <code>allowCredentials</code>). Spring Security answers preflights itself once CORS is configured in the security chain — forgetting that is the classic "works in Postman, 403 in the browser".', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — SPA + API architecture: dev proxy, CORS or one origin'],
  ['sb-12-3-cors-spring', 'Spring Boot 12.3 — Configuring CORS correctly'],
  ['sb-12-4-gan-vao-react', 'Spring Boot 12.4 — Connecting a real React page to the API'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What is CORS and what does it protect?"</strong> — A browser mechanism that relaxes the same-origin policy when the server opts in with <code>Access-Control-Allow-*</code> headers. It protects users from other sites reading responses with their credentials. It does not protect the server: the request is still sent and executed.</li>
<li><strong>"What is a preflight and when does it happen?"</strong> — An <code>OPTIONS</code> request the browser sends before a non-simple cross-origin request (custom headers like <code>Authorization</code>, JSON content type, methods other than GET/HEAD/POST). Cached per <code>Access-Control-Max-Age</code>.</li>
<li><strong>"How do you avoid CORS for your own SPA?"</strong> — Serve the SPA and the API from one origin: a dev-server proxy in development and a reverse proxy (Nginx, gateway) in production.</li>
<li><strong>"Why does my effect run twice?"</strong> — StrictMode in development mounts, unmounts and remounts to expose effects without proper cleanup. Fix the cleanup (abort the request, ignore stale results); do not disable StrictMode.</li>
<li><strong>"Can you put the API key in a <code>VITE_</code> variable?"</strong> — No: every <code>VITE_*</code> value is embedded in the JavaScript shipped to every visitor.</li>
</ol>

<h3>🧪 Lab 6.1 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Reproduce the CORS error with a direct <code>fetch</code> to the API's port. Find the request in the API log and write down what CORS did and did not prevent.</li>
<li>Configure the Vite proxy with <code>API_URL</code>; call <code>/api/health</code> through port 41811 with curl.</li>
<li>Write <code>api/loi.ts</code> and <code>api/client.ts</code>. Import the error type from the API with <code>import type</code>; make <code>npm run typecheck -w apps/web</code> pass.</li>
<li>Add React Router with the layout, feed, post and 404 routes.</li>
<li>Write the naive feed first, count the rows in development, then write <code>useTrang</code> + <code>useThayDay</code> and prove there is no duplicate.</li>
<li>Stop the API, reload, and make the feed show an error box with a working "Thử lại".</li>
</ol>
<p><strong>Done when:</strong> scrolling shows every published post exactly once and ends with "— Hết bài —", there is no key warning in the console, <code>npm run lint</code> passes, and the feed survives the API being down and coming back.</p>
<p><strong>Rubric (10):</strong> CORS observation written down (1) · proxy without <code>VITE_</code> (1) · ApiError covers network, non-JSON and contract errors (2) · type-only contract import (1) · effect cleanup with abort (2) · one request in flight + merge by id (1) · four list states (1) · lint clean without disabling rules globally (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>aa6eeb5</code> on <code>ch6/frontend</code>: <code>apps/web/vite.config.ts</code>, <code>.env.example</code>, <code>src/api/loi.ts</code>, <code>src/api/client.ts</code>, <code>src/api/types.ts</code>, <code>src/hooks/useTrang.ts</code>, <code>src/hooks/useThayDay.ts</code>, <code>src/pages/Feed.tsx</code>, <code>src/pages/BaiViet.tsx</code> (<code>key={id}</code>), <code>src/components/Khung.tsx</code>, <code>HopLoi.tsx</code>, <code>TheBai.tsx</code>, <code>src/lib/ngay.ts</code>, <code>src/App.tsx</code>. If your proxy returns 504 after a long wait instead of 502 immediately, your API is <em>running but frozen</em> (lesson 5.3's <code>docker pause</code>) rather than stopped — both reach the same error box. If <code>tsc -b</code> cannot find <code>zod</code> for the imported type, run <code>npm ci</code> at the repository root: the workspaces share one <code>node_modules</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">origin</span><span class="v">Scheme + host + port. localhost:41811 and localhost:41815 are different origins, same site.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing: headers by which a server lets other origins read its responses.</span></div>
  <div class="kv"><span class="k">preflight</span><span class="v">OPTIONS request the browser sends before a non-simple cross-origin request.</span></div>
  <div class="kv"><span class="k">dev proxy</span><span class="v">The dev server forwards /api/* to the API so the browser sees one origin.</span></div>
  <div class="kv"><span class="k">StrictMode</span><span class="v">Development-only checks; mounts components twice to reveal unsafe effects.</span></div>
  <div class="kv"><span class="k">AbortController</span><span class="v">Cancels a fetch; the standard cleanup for a request started in an effect.</span></div>
  <div class="kv"><span class="k">erasableSyntaxOnly</span><span class="v">TypeScript option allowing only syntax that disappears when types are stripped.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>CORS blocked the page from reading, but the API executed the request (twice). CORS is not server-side access control.</li>
<li>CORS + credentials works but adds preflights and a policy to maintain; ChiaSe serves page and API from one origin — Vite proxy now, Nginx later.</li>
<li>One API module: every failure — network, non-JSON 502, contract error — becomes an <code>ApiError</code>. The error type is imported from the API as a type only.</li>
<li>StrictMode exposed an effect that appended twice. Abort in cleanup; reset by <code>key</code>; one request in flight; merge by id.</li>
<li>Lint warnings were mostly right; the one false positive was disabled for one line, with a reason.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Nền frontend</span>
<h2>Trình duyệt gặp API — và lập tức nói "không"</h2>
<p class="lead">Năm chương backend, kiểm bằng curl và script. Giờ tới khách hàng thật của người dùng — trình duyệt — phải nói chuyện với nó. Trình duyệt không phải curl: nó áp chính sách cùng nguồn gốc (same-origin), nó chạy effect hai lần khi dev, nó giữ cookie theo luật riêng, và nó phơi mọi lỗi ra trước mặt người dùng. Bài này nối app React của Chương 1 với API, đo từng bước trong Chrome thật, và kết thúc bằng một feed cuộn qua mọi bài đã đăng, mỗi bài đúng một lần.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Thử lần đầu: cứ fetch thôi</h3>
<p>Thứ ai cũng viết đầu tiên: để địa chỉ API trong biến môi trường rồi gọi trong một effect.</p>
<pre><code class="language-tsx">${THU1}</code></pre>
<p>Mở bằng Chrome 150 (headless, do một script nhỏ điều khiển, in console và sự kiện mạng kèm mốc thời gian):</p>
<div class="out">${CORS_LOI}</div>
<p>Ba sự thật, cái nào cũng quan trọng:</p>
<ul>
<li><strong>Bị CORS chặn.</strong> Trang ở <code>http://localhost:41811</code>, API ở <code>http://localhost:41815</code>. Khác <em>cổng</em> là khác <em>origin</em> (scheme + host + cổng). Mặc định, trang được <em>gửi</em> request sang origin khác nhưng không được <em>đọc</em> câu trả lời, trừ khi origin kia cho phép bằng <code>Access-Control-Allow-Origin</code>.</li>
<li><strong>API vẫn chạy request — hai lần — và trả 200.</strong> Nhìn log API. CORS do trình duyệt thực thi, SAU khi phản hồi đã về. Nó không bảo vệ máy chủ của bạn; nó bảo vệ <em>người dùng</em> khỏi việc một trang của site khác đọc dữ liệu bằng cookie của họ. Đừng bao giờ coi "CORS chặn rồi" là kiểm soát truy cập.</li>
<li><strong>Hai request, không phải một.</strong> <code>&lt;StrictMode&gt;</code> của React (bật sẵn trong mẫu Vite) khi dev sẽ gắn mọi component, gỡ ra, rồi gắn lại — nên mọi effect chạy hai lần. Nó sinh ra để lộ những effect không chịu nổi việc gắn lại — lát nữa ta gặp một cái.</li>
</ul>

<h3>2. Hai lối ra — có số đo</h3>
<p><strong>Lối A: bật CORS ở API.</strong> Đã thử thật: <code>cors({ origin: WEB_ORIGIN, credentials: true })</code> trong API, và ở trang thêm <code>credentials: 'include'</code> (thiếu nó trình duyệt không gửi cũng không lưu cookie khi khác origin). Đăng nhập, gọi <code>/me</code> ba lần song song, chờ 6 giây, gọi lại, rồi refresh:</p>
<pre><code class="language-ts">${THU2}</code></pre>
<div class="out">${CORS_CRED}</div>
<p>Chạy được — cookie refresh vẫn đi, vì <code>localhost:41811</code> và <code>localhost:41815</code> khác origin nhưng <em>cùng site</em>, nên <code>SameSite=Strict</code> vẫn cho. Nhưng đọc log API: mọi request mang <code>Authorization</code> hoặc thân JSON là request "không đơn giản", đi trước nó là một <em>preflight</em> <code>OPTIONS</code>. Chrome nhớ preflight khoảng năm giây (không có header <code>Access-Control-Max-Age</code>), ba lời gọi song song vẫn ra hai preflight, và sau 6 giây nghỉ thì lời gọi tiếp theo lại cần preflight mới. Ở máy mình mỗi preflight tốn 1–30 ms; từ điện thoại ở Hà Nội tới máy chủ ở Singapore, mỗi lần là thêm một vòng đi về. Và bạn phải gánh một chính sách CORS phải đúng tuyệt đối trên production.</p>
<p><strong>Lối B: một origin.</strong> Trình duyệt chỉ nói chuyện với <code>localhost:41811</code>. Máy chủ dev của Vite vừa phục vụ tệp React <em>vừa</em> chuyển tiếp mọi thứ dưới <code>/api</code> sang API. Trên production (Chương 11) Nginx làm đúng việc đó: <code>chiase.example/</code> trả tệp đã build, <code>chiase.example/api/</code> đi vào Node. Dev và production cùng một hình, không một dòng CORS, không preflight, cookie chạy y hệt.</p>
<pre><code class="language-ts">${VITE_CONFIG}</code></pre>
<pre><code class="language-bash">${ENV_WEB}</code></pre>
<p>Vì sao <code>API_URL</code> mà không phải <code>VITE_API_URL</code>? Vite chép mọi biến có tên bắt đầu bằng <code>VITE_</code> vào JavaScript gửi xuống trình duyệt, ai cũng đọc được. Đích chuyển tiếp chỉ máy chủ dev cần, nên không được mang tiền tố đó. Bản thân trang giờ gọi đường dẫn <em>tương đối</em> <code>/api/posts</code> và không bao giờ biết API nằm ở đâu.</p>
<table>
<thead><tr><th></th><th>A. CORS + credentials</th><th>B. Một origin (proxy / Nginx)</th></tr></thead>
<tbody>
<tr><td>Mã trong API</td><td>middleware cors, danh sách origin chính xác cho từng môi trường</td><td>không có</td></tr>
<tr><td>Request thừa</td><td>OPTIONS trước hầu hết request (ở đây nhớ ≈ 5 s)</td><td>không có</td></tr>
<tr><td>Cookie</td><td>cần <code>credentials: 'include'</code>; khác <em>site</em> thì <code>SameSite=Strict</code> hỏng</td><td>cookie của chính site, đúng thiết kế Chương 3</td></tr>
<tr><td>Khi nào cần</td><td>API được trang của site <em>khác</em> gọi, web di động ở tên miền khác</td><td>SPA của mình + API của mình — ChiaSe</td></tr>
</tbody></table>
<p>ChiaSe chọn B và giữ API không có CORS. Nếu một ngày site đối tác cần gọi API, lúc đó mới thêm CORS — bằng danh sách cố định, không bao giờ bằng cách phản chiếu <code>Origin</code> nào tới cũng được (xem góc hacker).</p>

<h3>3. Một lớp gọi API: mọi thất bại thành ApiError</h3>
<p>Component không nên gọi <code>fetch</code> trực tiếp. Không nên tự đọc thân lỗi, tự gắn token, hay đoán xem 502 có chứa JSON không. Một module nhỏ làm hết, mọi nơi khác chỉ nhận dữ liệu hoặc một <code>ApiError</code> mang đúng các trường của hợp đồng lỗi Chương 5:</p>
<pre><code class="language-ts">${LOI_TS}</code></pre>
<p>Hai quyết định trong tệp này đáng dừng lại.</p>
<p><strong>Kiểu lấy từ API.</strong> <code>import type { PhanHoiLoi } from '../../../api/src/schemas/error.schema'</code> với sang workspace bên kia. An toàn vì đây là <code>import type</code>: TypeScript kiểm theo nó rồi XOÁ hẳn dòng đó — không Zod, không mã server nào vào bundle (Checkpoint 6 kiểm bundle đã build không chứa <code>loiSchema</code>). API mà đổi hình dạng lỗi thì <code>tsc</code> của web đỏ ngay trong ngày. Import <em>giá trị</em> xuyên workspace thì khác: Vite chạy được, nhưng sẽ làm hỏng bản build của chính API ở Chương 9, nên ta không làm.</p>
<p><strong>Cấu hình compiler của mẫu cắn.</strong> Bản đầu dùng cách viết tắt quen tay <code>constructor(readonly status: number, …)</code>:</p>
<div class="out">${ERASABLE}</div>
<p>Mẫu Vite bật <code>erasableSyntaxOnly</code>: chỉ cho cú pháp TypeScript mà <em>xoá đi</em> là ra JavaScript (nhờ vậy Node 22 và các công cụ khác chạy thẳng <code>.ts</code> bằng cách lột kiểu). Tham số kiểu <code>readonly</code> sinh ra lệnh gán, <code>enum</code> sinh ra đối tượng — cả hai bị từ chối. Khai trường rõ ràng như trên.</p>
<p>Còn hàm gửi request — token và refresh để bài 6.2, phần đầu là thứ cần lúc này:</p>
<pre><code class="language-ts">${CLIENT_API}</code></pre>
<p><code>fetch</code> chỉ reject khi không có gì quay về (mất mạng, DNS, CORS, huỷ). 400 hay 500 là fetch <em>thành công</em> với <code>res.ok === false</code> — nên ta tự kiểm <code>ok</code>, và đổi lần reject do mạng thành <code>MAT_KET_NOI</code> để giao diện chỉ phải xử lý một kiểu. Huỷ (abort) thì ném lại nguyên vẹn: đó không phải lỗi, đó là ta rời trang.</p>

<h3>4. Route</h3>
<p>ChiaSe có năm trang: feed, bài viết, đăng nhập, đăng ký, viết bài. React Router 8 (bản <code>latest</code> hiện tại; cần React ≥ 19.2.7 và Node ≥ 22.22) với <em>data router</em>:</p>
<pre><code class="language-tsx">${APP_TSX}</code></pre>
<p>Một route layout (<code>Khung</code>, không có path) vẽ thanh trên và <code>&lt;Outlet/&gt;</code>; cổng <code>CanDangNhap</code> cũng là route layout bọc các trang cần đăng nhập — bài 6.2 viết nó. Để ý: bấm F5 ở <code>/bai/…</code> thì máy chủ phải trả <code>index.html</code>; Vite tự làm, còn Nginx sẽ cần <code>try_files … /index.html</code> ở Chương 11.</p>

<h3>5. Feed — trước hết là bản ngây thơ</h3>
<p>Tải trang đầu trong effect rồi nối vào danh sách:</p>
<pre><code class="language-tsx">${FEED_NGAY_THO}</code></pre>
<div class="out">${STRICT_TRUNG}</div>
<p>Hai mươi dòng cho mười bài và mười cảnh báo key. StrictMode chạy effect hai lần, cả hai request đều về, cả hai đều <em>nối thêm</em>. Trên production StrictMode tắt và bạn thấy mười dòng — cho tới ngày cùng effect đó chạy hai lần vì lý do thật (component cha gắn lại, quay lại route rất nhanh). Effect không an toàn khi lặp lại, và StrictMode đã nói cho ta biết.</p>
<p>Cách sửa không phải "tắt StrictMode". Effect phải tự dọn: huỷ request nó đã khởi động. Rồi dựng thứ feed thật sự cần — một hook đi theo <code>nextCursor</code> của Chương 5:</p>
<pre><code class="language-ts">${USE_TRANG}</code></pre>
<p>Ba luật, mỗi luật từ một thất bại: tối đa một request đang bay (<code>IntersectionObserver</code> có thể bắn nhiều lần khi một trang đang tải); rời trang thì huỷ request (lượt chạy đầu của StrictMode bị huỷ nên không bao giờ nối thêm); gộp theo <code>id</code> (lưới an toàn: một bài trôi sang trang khác cũng không hiện hai lần).</p>
<p>oxlint — đã cấu hình ở Chương 1 để trượt khi có cảnh báo — không ưa bản nháp đầu của hook này và trang bài viết:</p>
<div class="out">${OXLINT}</div>
<p>Hai cảnh báo là thật. Bản nháp đầu đặt lại state ngay đầu effect (<code>setItems([])</code>, <code>setBai(null)</code>) để "dọn" khi id bài đổi. Mỗi lần như vậy tốn thêm một lượt render, và React có công cụ tốt hơn: cho component một <code>key</code> — <code>&lt;ChiTiet key={id} id={id}/&gt;</code> — id đổi thì React tự vứt state cũ. Cảnh báo thứ ba: tệp <code>.tsx</code> vừa export component vừa export hook làm hỏng Fast Refresh của Vite, nên context và <code>useAuth</code> chuyển sang tệp <code>.ts</code> riêng.</p>
<p>Còn lại một cảnh báo, và nó báo nhầm: effect gọi <code>tai()</code>, hàm này chỉ setState <em>sau</em> <code>await</code> — đúng việc của effect (đồng bộ với hệ thống bên ngoài). Luật không nhìn thấy <code>await</code>. Ta tắt nó cho đúng một dòng, kèm chú thích lý do — không bao giờ tắt cho cả dự án.</p>
<p>Bộ quan sát — <code>useEffectEvent</code> (ổn định từ React 19.2) cho observer gọi bản callback mới nhất mà không phải tạo lại mỗi lần render:</p>
<pre><code class="language-ts">${USE_THAY_DAY}</code></pre>
<pre><code class="language-tsx">${FEED}</code></pre>
<p>Cuộn xuống đáy trong Chrome với 30 bài đã đăng:</p>
<div class="out">${CUON}</div>
<p>Request bị huỷ là lượt chạy đầu của StrictMode, huỷ đúng thiết kế. Trang hai được xin <em>trước</em> lần cuộn đầu: phần tử canh đáy đã nằm trong vòng 300 px của màn hình — đó là <code>rootMargin</code> làm việc, tải trước. Ba mươi bài, ba request, không có request thứ tư cho một trang rỗng (<code>nextCursor: null</code> của Chương 5), và cuối danh sách được nói rõ ra.</p>

<h3>6. Khi API sập</h3>
<p>Tắt API rồi tải lại trang:</p>
<div class="out">${API_SAP}</div>
<p>Proxy của Vite trả <strong>502 với thân <code>text/plain</code> RỖNG</strong>. Mã nào cũng <code>await res.json()</code> cho mọi phản hồi sẽ văng ở đây với "Unexpected end of JSON input" và người dùng chẳng thấy gì hữu ích. <code>docLoi</code> không bao giờ giả định JSON; nó thành lỗi <code>PHAN_HOI_LA</code> mã 502, và feed hiện hộp lỗi thân thiện có nút "Thử lại". Trên production Nginx sẽ trả trang HTML 502/504 của nó — cùng một đường xử lý. Hộp lỗi hiện câu của API khi là 4xx; khi 5xx thì hiện một câu trung tính kèm <code>requestId</code>, để ảnh chụp màn hình của người dùng thành một lệnh <code>grep</code> trên log máy chủ (bài 5.3):</p>
<pre><code class="language-tsx">${HOP_LOI}</code></pre>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">một origin</span><span class="lz-d">trang và /api cùng origin: proxy khi dev, Nginx khi production</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">một lớp gọi API</span><span class="lz-d">fetch chỉ ở client.ts; mọi thất bại là ApiError</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">kiểu theo hợp đồng</span><span class="lz-d">import type từ API; bị xoá khi build</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">effect lặp lại an toàn</span><span class="lz-d">huỷ khi dọn; reset bằng key, không bằng setState</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">bốn trạng thái</span><span class="lz-d">đang tải · lỗi có thử lại · rỗng · hết</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — "Lỗi CORS? Thêm <code>Access-Control-Allow-Origin: *</code>."</strong> Câu trả lời kinh điển trên Stack Overflow. Với <code>*</code> trình duyệt vẫn từ chối gửi cookie, nên đăng nhập hỏng theo kiểu mới; "cách sửa" tiếp theo là phản chiếu <code>Origin</code> của request kèm cho phép credentials — tức là trao dữ liệu người dùng cho bất kỳ website nào. Sửa kiến trúc (một origin) hoặc viết danh sách cho phép chính xác.</p></div>

<h3>🕵️ Góc hacker — CORS phản chiếu (2016)</h3>
<p>Tháng 10/2016, James Kettle (PortSwigger) công bố nghiên cứu về cấu hình CORS sai. Rất nhiều ứng dụng "cấu hình" CORS bằng cách chép <code>Origin</code> nào gửi tới vào <code>Access-Control-Allow-Origin</code>, kèm <code>Access-Control-Allow-Credentials: true</code>. Một ví dụ là một sàn bitcoin giấu tên: request tới <code>/api/requestApiKey</code> của nó từ <em>bất kỳ</em> origin nào, mang cookie phiên của nạn nhân, trả về khoá API của nạn nhân — trang của kẻ tấn công đọc được. Có nơi khác nhận mọi origin chỉ cần <em>bắt đầu</em> bằng tên miền tin cậy, hoặc nhận origin đặc biệt <code>null</code>. Tất cả đều là trình duyệt làm đúng điều máy chủ bảo nó.</p>
<p>Đó là lý do ChiaSe không có CORS, và nếu có ngày cần, danh sách origin cho phép phải cố định và so khớp tuyệt đối.</p>

<h3>Liên hệ đời thường</h3>
<p>Quầy lễ tân của toà nhà (Vite hay Nginx) là cửa duy nhất khách đi vào. Phía sau có nhiều phòng (tệp React, API, sau này là máy chủ realtime). Khách không cần biết API ở tầng mấy — lễ tân dẫn đi. Mở cửa hông cho từng phòng (CORS cho từng origin) cũng được, nhưng giờ cửa nào cũng cần bảo vệ riêng, và chỉ cần một bảo vệ lơ đễnh cho vào "ai nói mình từ trụ sở chính tới" là đủ chuyện.</p>

<h3>Tình huống đi làm thật</h3>
<p>Ở công ty outsourcing, frontend và backend thường nằm ở hai repo, do hai nhóm triển khai, nên ngày ghép nối đầu tiên thường là ngày CORS. Hỏi sớm: production có phục vụ SPA và API chung một tên miền không (gateway, Nginx, luật đường dẫn của CDN)? Có thì dùng proxy khi dev và không bao giờ đưa CORS lên. Không thì nhóm backend giữ danh sách origin cho từng môi trường, nằm trong cấu hình, được review như mọi thiết lập bảo mật. Cảnh thứ hai: tester báo "danh sách hiện mỗi mục hai lần". Trước khi đổ cho API, mở tab Network: hai request y hệt cùng một mili giây khi dev là StrictMode; effect của bạn thiếu phần dọn.</p>

${spring(false, 'Làm bằng Spring Boot thì phía backend đổi, phía frontend không đổi: vẫn chọn giữa proxy khi dev (cùng cấu hình Vite, trỏ sang :8080) và CORS (<code>CorsConfigurationSource</code> / <code>@CrossOrigin</code> với danh sách origin chính xác và <code>allowCredentials</code>). Spring Security tự trả lời preflight khi CORS được cấu hình trong security chain — quên điều này là ca kinh điển "Postman chạy, trình duyệt 403".', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — Kiến trúc SPA + API: dev proxy, CORS hay cùng origin'],
  ['sb-12-3-cors-spring', 'Spring Boot 12.3 — Cấu hình CORS đúng cách'],
  ['sb-12-4-gan-vao-react', 'Spring Boot 12.4 — Gắn một trang React thật vào API'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"CORS là gì, nó bảo vệ cái gì?"</strong> — Cơ chế của trình duyệt nới chính sách cùng nguồn gốc khi máy chủ đồng ý bằng các header <code>Access-Control-Allow-*</code>. Nó bảo vệ người dùng khỏi site khác đọc phản hồi bằng thông tin đăng nhập của họ. Nó không bảo vệ máy chủ: request vẫn được gửi và thực thi.</li>
<li><strong>"Preflight là gì, khi nào xảy ra?"</strong> — Request <code>OPTIONS</code> trình duyệt gửi trước một request khác origin "không đơn giản" (header riêng như <code>Authorization</code>, kiểu nội dung JSON, method khác GET/HEAD/POST). Được nhớ theo <code>Access-Control-Max-Age</code>.</li>
<li><strong>"Làm sao tránh CORS cho SPA của chính mình?"</strong> — Phục vụ SPA và API chung một origin: proxy của máy chủ dev khi phát triển, reverse proxy (Nginx, gateway) khi production.</li>
<li><strong>"Vì sao effect của tôi chạy hai lần?"</strong> — StrictMode khi dev gắn, gỡ rồi gắn lại để lộ effect thiếu phần dọn. Sửa phần dọn (huỷ request, bỏ kết quả cũ); đừng tắt StrictMode.</li>
<li><strong>"Để khoá API trong biến <code>VITE_</code> được không?"</strong> — Không: mọi giá trị <code>VITE_*</code> được nhúng vào JavaScript gửi tới mọi người truy cập.</li>
</ol>

<h3>🧪 Lab 6.1 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Tái hiện lỗi CORS bằng một <code>fetch</code> thẳng tới cổng API. Tìm request đó trong log API và ghi ra CORS đã chặn và KHÔNG chặn điều gì.</li>
<li>Cấu hình proxy của Vite với <code>API_URL</code>; gọi <code>/api/health</code> qua cổng 41811 bằng curl.</li>
<li>Viết <code>api/loi.ts</code> và <code>api/client.ts</code>. Lấy kiểu lỗi từ API bằng <code>import type</code>; cho <code>npm run typecheck -w apps/web</code> qua.</li>
<li>Thêm React Router với layout, feed, bài viết và route 404.</li>
<li>Viết feed ngây thơ trước, đếm số dòng khi dev, rồi viết <code>useTrang</code> + <code>useThayDay</code> và chứng minh không còn trùng.</li>
<li>Tắt API, tải lại, làm cho feed hiện hộp lỗi có nút "Thử lại" bấm được.</li>
</ol>
<p><strong>Xong khi:</strong> cuộn hết thấy mọi bài đã đăng đúng một lần và kết thúc bằng "— Hết bài —", console không có cảnh báo key, <code>npm run lint</code> qua, và feed sống sót khi API sập rồi sống lại.</p>
<p><strong>Thang điểm (10):</strong> ghi nhận về CORS (1) · proxy không dùng <code>VITE_</code> (1) · ApiError phủ mất mạng, không phải JSON, lỗi theo hợp đồng (2) · import kiểu hợp đồng (1) · effect dọn bằng abort (2) · một request đang bay + gộp theo id (1) · bốn trạng thái danh sách (1) · lint sạch mà không tắt luật toàn cục (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>aa6eeb5</code> trên <code>ch6/frontend</code>: <code>apps/web/vite.config.ts</code>, <code>.env.example</code>, <code>src/api/loi.ts</code>, <code>src/api/client.ts</code>, <code>src/api/types.ts</code>, <code>src/hooks/useTrang.ts</code>, <code>src/hooks/useThayDay.ts</code>, <code>src/pages/Feed.tsx</code>, <code>src/pages/BaiViet.tsx</code> (<code>key={id}</code>), <code>src/components/Khung.tsx</code>, <code>HopLoi.tsx</code>, <code>TheBai.tsx</code>, <code>src/lib/ngay.ts</code>, <code>src/App.tsx</code>. Nếu proxy của bạn trả 504 sau một lúc lâu thay vì 502 ngay, nghĩa là API <em>đang chạy nhưng bị đóng băng</em> (như <code>docker pause</code> ở bài 5.3) chứ không phải đã tắt — cả hai đều về cùng hộp lỗi. Nếu <code>tsc -b</code> không tìm thấy <code>zod</code> cho kiểu đã import, chạy <code>npm ci</code> ở gốc repo: các workspace dùng chung một <code>node_modules</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">origin</span><span class="v">Scheme + host + cổng. localhost:41811 và localhost:41815 khác origin, cùng site.</span></div>
  <div class="kv"><span class="k">CORS</span><span class="v">Cross-Origin Resource Sharing: các header để máy chủ cho origin khác đọc phản hồi của mình.</span></div>
  <div class="kv"><span class="k">preflight</span><span class="v">Request OPTIONS trình duyệt gửi trước một request khác origin không đơn giản.</span></div>
  <div class="kv"><span class="k">proxy khi dev</span><span class="v">Máy chủ dev chuyển tiếp /api/* sang API để trình duyệt chỉ thấy một origin.</span></div>
  <div class="kv"><span class="k">StrictMode</span><span class="v">Phép kiểm chỉ chạy khi dev; gắn component hai lần để lộ effect không an toàn.</span></div>
  <div class="kv"><span class="k">AbortController</span><span class="v">Huỷ một fetch; cách dọn chuẩn cho request khởi động trong effect.</span></div>
  <div class="kv"><span class="k">erasableSyntaxOnly</span><span class="v">Tuỳ chọn TypeScript chỉ cho cú pháp biến mất khi lột kiểu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>CORS chặn trang đọc kết quả, nhưng API vẫn thực thi request (hai lần). CORS không phải kiểm soát truy cập phía máy chủ.</li>
<li>CORS + credentials chạy được nhưng thêm preflight và một chính sách phải giữ; ChiaSe phục vụ trang và API cùng một origin — proxy của Vite bây giờ, Nginx sau này.</li>
<li>Một module gọi API: mọi thất bại — mất mạng, 502 không phải JSON, lỗi theo hợp đồng — thành <code>ApiError</code>. Kiểu lỗi import từ API, chỉ dạng kiểu.</li>
<li>StrictMode lộ ra một effect nối thêm hai lần. Huỷ khi dọn; reset bằng <code>key</code>; một request đang bay; gộp theo id.</li>
<li>Cảnh báo lint phần lớn đúng; cái báo nhầm duy nhất được tắt cho một dòng, có lý do.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
