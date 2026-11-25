/**
 * 7.1 — Vì sao cần realtime, và chọn phương án nhẹ (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: Chrome 150 (headless, playwright-core 1.65.1), Node 22.22.2, Socket.IO 4.8.4 (server + client),
 * Vite 8.3.8, API ChiaSe tag ch6 + nhánh ch7/realtime (commit 7748985). Máy nhà đang chạy việc khác (load 28–49) ⇒ số CPU để so tương đối.
 * Phát hiện thật 24/11: polling 3 s ⇒ trễ 177–3317 ms (trung vị 2787), 20 request/phút/tab, 7/17 lần là 304 (ETag) nhưng CSDL
 * vẫn bị hỏi; 200 tab: 4008 request/phút, 21,5% một nhân CPU API vs 200 socket: 0 request, 0,6%; Vite chưa khai proxy ⇒
 * /socket.io/ trả index.html (200 text/html) và client lặng lẽ thử lại; proxy thiếu ws ⇒ kẹt long-polling; ws: true ⇒ 2probe/3probe;
 * socket rảnh: ping mỗi 25 s; web import type một tệp kéo theo comment.service ⇒ tsc của web báo lỗi erasableSyntaxOnly trong mã API
 * + Date ≠ string; server.close() treo khi còn WebSocket (18 s, tới khi client tự đi) ⇒ io.close().
 * Nguồn (GET 200, 24/11/2026): RFC 6455 (12/2011); MDN Server-sent events; socket.io "How it works"; Wikipedia Socket.IO;
 * Chrome for Developers — timer throttling in Chrome 88.
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const POLL = `// THỬ 1 (bài 7.1): POLLING — trong ChiTiet của pages/BaiViet.tsx, cứ 3 giây hỏi lại "có bình luận mới không?"
const { setItems } = bl;
useEffect(() =&gt; {
  const hen = setInterval(async () =&gt; {
    const t = await api&lt;{ items: BinhLuan[] }&gt;(\`/posts/\${id}/comments?limit=50\`);
    setItems((cu) =&gt; {
      const da = new Set(cu.map((x) =&gt; x.id));
      const moi = t.items.filter((x) =&gt; !da.has(x.id));
      return moi.length ? [...cu, ...moi] : cu;
    });
  }, 3000);
  return () =&gt; clearInterval(hen);
}, [id, setItems]);`;

const POLL_OUT = `[ 7227 ms] bình luận 1 (201) hiện sau 1796 ms
[16274 ms] bình luận 2 (201) hiện sau 2787 ms
[21970 ms] bình luận 3 (201) hiện sau 177 ms
[28050 ms] bình luận 4 (201) hiện sau 2789 ms
[34116 ms] bình luận 5 (201) hiện sau 2799 ms
[37407 ms] bình luận 6 (201) hiện sau 792 ms
[43363 ms] bình luận 7 (201) hiện sau 3317 ms
[48988 ms] bình luận 8 (201) hiện sau 1307 ms
[48989 ms] trễ: nhỏ nhất 177 ms · trung vị 2787 ms · lớn nhất 3317 ms
[48989 ms] trang gửi 16 request /api trong 48.0 s ⇒ 20.0 request/phút cho MỘT tab
--- log API: 17 lần GET …/comments?limit=50 ⇒ 10 × 200 + 7 × 304 (ETag), mỗi lần 2,4–10,7 ms; phản hồi 200 = 1588 byte`;

const TAI_200 = `$ node tai-200.mjs poll 200 30      # 200 "tab" hỏi lại mỗi 3 s
poll × 200 trong 30 s: 2004 request HTTP (4008/phút), CPU API 6440 ms (21.5% một nhân), sự kiện nhận 0, lỗi 0
$ node tai-200.mjs socket 200 30    # 200 kết nối WebSocket chỉ nằm nghe; giữa chừng An đăng 1 bình luận
socket × 200 trong 30 s: 0 request HTTP (0/phút), CPU API 190 ms (0.6% một nhân), sự kiện nhận 200, lỗi 0
(máy nhà đang chạy việc khác, load average ~28–49 ⇒ số CPU chỉ để so tương đối)`;

const CURL = `$ curl -i 'http://localhost:41815/socket.io/?EIO=4&amp;transport=polling'
HTTP/1.1 200 OK
Content-Type: text/plain; charset=UTF-8
Content-Length: 118
cache-control: no-store
Connection: keep-alive
Keep-Alive: timeout=5

0{"sid":"zbzasrGuEp8AKQtfAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}
$ curl 'http://localhost:41815/socket.io/?EIO=3&amp;transport=polling'
{"code":5,"message":"Unsupported protocol version"}
$ curl -i 'http://localhost:41811/socket.io/?EIO=4&amp;transport=polling'     # qua Vite, CHƯA khai proxy /socket.io
HTTP/1.1 200 OK
Vary: Origin
Content-Type: text/html
Cache-Control: no-cache`;

const HOP_DONG = `// HỢP ĐỒNG realtime: tên sự kiện + dữ liệu đi kèm, cho CẢ HAI chiều. Web import ĐÚNG tệp này bằng "import type"
// (như hợp đồng lỗi, bài 6.1) ⇒ gõ sai tên sự kiện hay sai trường là tsc báo ở cả hai phía, không phải đợi tới lúc chạy.
// CHỈ KIỂU THUẦN, KHÔNG import gì từ mã máy chủ: web kiểm kiểu tệp này ⇒ kéo theo mọi tệp nó import (lần đầu import kiểu
// từ comment.service ⇒ tsc của web đi xuyên prisma, http-error… và báo lỗi erasableSyntaxOnly ở mã API — bài 7.1 đo).

// Hình dạng TRÊN DÂY: Socket.IO gửi JSON ⇒ Date thành chuỗi ISO. Kiểu Prisma (createdAt: Date) KHÔNG phải hợp đồng.
export type BinhLuanTrenDay = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; displayName: string };
};

// Máy chủ ⇒ trình duyệt. Mọi sự kiện đều mang postId: một socket có thể đang xem vài bài (vài tab dùng chung sau này).
export interface SuKienMayChu {
  'binh-luan:moi': (d: { postId: string; binhLuan: BinhLuanTrenDay }) =&gt; void;
  'binh-luan:xoa': (d: { postId: string; id: string }) =&gt; void;
  // Gửi SỐ ĐẾM TUYỆT ĐỐI, không gửi "+1": bỏ lỡ một sự kiện thì sự kiện sau vẫn đúng (bài 7.2 đo).
  'luot-thich': (d: { postId: string; likeCount: number }) =&gt; void;
}

export type KetQuaVao = { ok: true } | { ok: false; code: 'KHONG_TIM_THAY' | 'QUA_NHIEU_PHONG' };

// Trình duyệt ⇒ máy chủ. Có "ack" (hàm gọi lại): client BIẾT được vào phòng thành công hay bị từ chối.
export interface SuKienKhach {
  'bai:xem': (postId: string, ack: (kq: KetQuaVao) =&gt; void) =&gt; void;
  'bai:roi': (postId: string) =&gt; void;
}

// Lỗi ở bước bắt tay (io.use) tới client trong sự kiện connect_error: err.message + err.data.code.
export type MaLoiBatTay = 'TOKEN_HET_HAN' | 'TOKEN_KHONG_HOP_LE';`;

const SU_KIEN = `import type { SuKienMayChu } from '../realtime/hop-dong.js';

// Cầu nối service ⇒ realtime. Service chỉ BÁO "vừa có chuyện này" — không import Socket.IO, không biết ai đang nghe.
// Lợi: test service (Chương 8) không cần máy chủ socket; đổi Socket.IO sang SSE hay hàng đợi chỉ sửa MỘT chỗ.
type Ten = keyof SuKienMayChu;
export type SuKien = { [K in Ten]: { ten: K; duLieu: Parameters&lt;SuKienMayChu[K]&gt;[0] } }[Ten];

let nguoiNghe: (e: SuKien) =&gt; void = () =&gt; {}; // chưa gắn realtime (test, script) ⇒ không làm gì
export const ganNguoiNghe = (f: (e: SuKien) =&gt; void) =&gt; {
  nguoiNghe = f;
};

// GỌI SAU KHI CSDL ĐÃ GHI XONG. Phát lỗi (bug trong realtime) KHÔNG được làm hỏng request HTTP đã thành công.
export function bao(e: SuKien) {
  try {
    nguoiNghe(e);
  } catch (err) {
    console.error('phát sự kiện realtime lỗi', e.ten, err);
  }
}`;

const REALTIME_DAU = `import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { ganNguoiNghe } from '../lib/su-kien.js';
import type { SuKienKhach, SuKienMayChu } from './hop-dong.js';

// Socket.IO gắn vào CHÍNH máy chủ HTTP của Express: cùng cổng, cùng origin, đường dẫn /socket.io/.
// Không mở cổng thứ hai ⇒ không CORS, proxy Vite (khi dev) và Nginx (production) chỉ cần thêm một location.
export function ganRealtime(http: HttpServer) {
  const io = new Server&lt;SuKienKhach, SuKienMayChu&gt;(http, {
    serveClient: false, // web tự bundle socket.io-client; đừng phục vụ /socket.io/socket.io.js
  });

  io.on('connection', (socket) =&gt; {
    console.log(\`socket \${socket.id} nối (\${socket.conn.transport.name}), tổng \${io.engine.clientsCount}\`);
    socket.conn.once('upgrade', (t) =&gt; console.log(\`socket \${socket.id} nâng lên \${t.name}\`));
    socket.on('disconnect', (lyDo) =&gt; console.log(\`socket \${socket.id} ngắt: \${lyDo}\`));
  });

  // BẢN ĐẦU (bài 7.1): phát cho TẤT CẢ socket. Bài 7.2 đổi sang phòng theo bài.
  ganNguoiNghe((e) =&gt; io.emit(e.ten, e.duLieu as never));
  return io;
}`;

const TAO_BL = `export async function taoBinhLuan(postId: string, tacGia: string, { body }: TaoBinhLuan) {
  const bai = await baiNhinThay(postId, tacGia);
  if (bai.status !== 'published')
    throw new HttpError(409, 'BAI_CHUA_DANG', 'Đăng bài trước rồi mới bình luận được');
  try {
    const bl = await prisma.comment.create({
      data: { postId, authorId: tacGia, body },
      select: chonBinhLuan,
    });
    bao({
      ten: 'binh-luan:moi',
      duLieu: { postId, binhLuan: { ...bl, createdAt: bl.createdAt.toISOString() } },
    }); // SAU khi CSDL đã ghi
    return bl;
  } catch (e) {
    // Bài bị xoá ĐÚNG lúc giữa lần kiểm ở trên và câu INSERT ⇒ khoá ngoại từ chối (P2003) ⇒ trả 404, không phải 500.
    if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2003') throw khongThayBai();
    throw e;
  }
}`;

const TSC_LOI = `$ npx tsc -b      # apps/web, lần đầu import type hợp đồng (hop-dong.ts import type BinhLuanDto từ comment.service)
../api/src/lib/http-error.ts(7,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
../api/src/lib/http-error.ts(8,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
../api/src/lib/http-error.ts(10,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
../api/src/lib/http-error.ts(11,5): error TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
src/pages/BaiViet.tsx(41,32): error TS2345: Argument of type '({ postId, binhLuan }: { postId: string; binhLuan: BinhLuan; }) =&gt; void' is not assignable to parameter of type '(d: { postId: string; binhLuan: { author: { displayName: string; id: string; }; body: string; createdAt: Date; id: string; }; }) =&gt; void'.
  Types of parameters '__0' and 'd' are incompatible.
    Type '{ postId: string; binhLuan: { author: { displayName: string; id: string; }; body: string; createdAt: Date; id: string; }; }' is not assignable to type '{ postId: string; binhLuan: BinhLuan; }'.
      The types of 'binhLuan.createdAt' are incompatible between these types.
        Type 'Date' is not assignable to type 'string'.`;

const SOCKET_DAU = `import { io, type Socket } from 'socket.io-client';
import type { SuKienKhach, SuKienMayChu } from '../../../api/src/realtime/hop-dong';

// MỘT socket cho cả tab (không phải một socket mỗi component): mở 5 trang là vẫn 1 kết nối.
// Không truyền URL ⇒ nối về CHÍNH origin của trang (localhost:41811 khi dev, tên miền thật khi production).
export const socket: Socket&lt;SuKienMayChu, SuKienKhach&gt; = io({ autoConnect: false });`;

const NGHE_DAU = `  // BẢN ĐẦU (bài 7.1): nghe MỌI bình luận mới của cả hệ thống, lọc lấy bài đang xem.
  const { setItems } = bl;
  useEffect(() =&gt; {
    const khiCoMoi = ({ postId, binhLuan }: { postId: string; binhLuan: BinhLuan }) =&gt; {
      if (postId !== id) return;
      setItems((cu) =&gt; (cu.some((x) =&gt; x.id === binhLuan.id) ? cu : [...cu, binhLuan]));
    };
    socket.on('binh-luan:moi', khiCoMoi);
    socket.connect();
    return () =&gt; {
      socket.off('binh-luan:moi', khiCoMoi);
    };
  }, [id, setItems]);`;

const KHONG_PROXY = `[  452 ms] WS mở /?token=CaYKyxAn05Gl
[  456 ms]   WS nhận {"type":"connected"}
[  541 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ui6vsot8
[  556 ms] ← 200 text/html
[  570 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 1256 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ui7fud3w
[ 1260 ms] ← 200 text/html
[ 4245 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ui9qo9mf
[ 4245 ms] ← 200 text/html`;

const THIEU_WS = `[  298 ms]   WS nhận {"type":"connected"}
[  379 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uizz2paz
[  389 ms] ← 200 text/plain; charset=UTF-8
[  390 ms] → POST /socket.io/?EIO=4&amp;transport=polling&amp;t=uizzecdu&amp;sid=vRoMH-gFDEL3Gj5KAAA
[  390 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uizzgsyv&amp;sid=vRoMH-gFDEL3Gj5KAAA
[  391 ms] WS mở /socket.io/?EIO=4&amp;transport=websocket&amp;sid=vRoMH-gFDEL3Gj5KAA
[  396 ms] ← 200 text/html
[  397 ms] ← 200 text/plain; charset=UTF-8
[  398 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uizzozb7&amp;sid=vRoMH-gFDEL3Gj5KAAA
[  398 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 7988 ms] ← 200 text/plain; charset=UTF-8
[ 7988 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uj5ue1w9&amp;sid=vRoMH-gFDEL3Gj5KAAA
[ 9642 ms] ← 200 text/plain; charset=UTF-8
[ 9642 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uj74ho25&amp;sid=vRoMH-gFDEL3Gj5KAAA
[12246 ms] ← 200 text/plain; charset=UTF-8
[12246 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=uj94ob22&amp;sid=vRoMH-gFDEL3Gj5KAAA
[12260 ms] trễ (ms): 32, 8, 21
socket V7AZSgnki53Wd074AAAB nối (polling), tổng 1
socket V7AZSgnki53Wd074AAAB ngắt: transport error`;

const CO_WS = `[  379 ms]   WS nhận {"type":"connected"}
[  452 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ujd8mwg4
[  466 ms] ← 200 text/plain; charset=UTF-8
[  467 ms] → POST /socket.io/?EIO=4&amp;transport=polling&amp;t=ujd91aiw&amp;sid=TiYgeLyjJ0ZrwirhAAA
[  468 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ujd93q63&amp;sid=TiYgeLyjJ0ZrwirhAAA
[  469 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[  469 ms] WS mở /socket.io/?EIO=4&amp;transport=websocket&amp;sid=TiYgeLyjJ0ZrwirhAA
[  472 ms] ← 200 text/html
[  473 ms] ← 200 text/plain; charset=UTF-8
[  475 ms] → GET /socket.io/?EIO=4&amp;transport=polling&amp;t=ujd9f8hy&amp;sid=TiYgeLyjJ0ZrwirhAAA
[  477 ms]   WS gửi 2probe
[  478 ms]   WS nhận 3probe
[  581 ms] ← 200 text/plain; charset=UTF-8
[  581 ms]   WS gửi 5
[ 7820 ms]   WS nhận 42["binh-luan:moi",{"postId":"01a20e25-b40f-7188-b70f-12726ca16e31","binhLuan":{"id":"01a2
[ 9139 ms]   WS nhận 42["binh-luan:moi",{"postId":"01a20e25-b40f-7188-b70f-12726ca16e31","binhLuan":{"id":"01a2
[11810 ms]   WS nhận 42["binh-luan:moi",{"postId":"01a20e25-b40f-7188-b70f-12726ca16e31","binhLuan":{"id":"01a2
[13268 ms]   WS nhận 42["binh-luan:moi",{"postId":"01a20e25-b40f-7188-b70f-12726ca16e31","binhLuan":{"id":"01a2
[15118 ms]   WS nhận 42["binh-luan:moi",{"postId":"01a20e25-b40f-7188-b70f-12726ca16e31","binhLuan":{"id":"01a2
[15135 ms] trễ (ms): 69, 19, 28, 21, 18`;

const VITE = `import react from '@vitejs/plugin-react';
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
      proxy: {
        '/api': { target: env.API_URL ?? 'http://localhost:41810' },
        // ws: true — chuyển tiếp cả cú "nâng cấp" HTTP ⇒ WebSocket. Thiếu nó: Socket.IO kẹt ở long-polling (bài 7.1 đo).
        '/socket.io': { target: env.API_URL ?? 'http://localhost:41810', ws: true },
      },
    },
  };
});`;

const RANH = `[  284 ms]   WS gửi 2probe
[  289 ms]   WS nhận 3probe
[  389 ms]   WS gửi 5
[25290 ms]   WS nhận 2
[25291 ms]   WS gửi 3
[50312 ms]   WS nhận 2
[50312 ms]   WS gửi 3`;

const TAT_TREO = `--- TRƯỚC (server.close() như Chương 2): 1 client WebSocket đang nối, gửi SIGTERM lúc 22:30:16.405
API ChiaSe đang nghe http://localhost:41817 (cho phép web http://localhost:41811)
socket mCyW7ZdiRMB-oEaYAAAB nối (websocket), tổng 1
Nhận SIGTERM, đang tắt…
   (15 giây sau tiến trình VẪN SỐNG — server.close() chờ kết nối WebSocket tự đóng)
socket mCyW7ZdiRMB-oEaYAAAB ngắt: forced close        ← chỉ khi client tự thoát (~18 s sau)
Đã đóng HTTP và kết nối CSDL.
--- SAU (io.close(cb)): 2 client đang nối, gửi SIGTERM lúc 22:31:16.852
Nhận SIGTERM, đang tắt…
socket mRnk2iNB3I5LEMjhAAAA ngắt: server shutting down
socket i6Kbq0-XXVZ-jzTHAAAB ngắt: server shutting down
Đã đóng HTTP và kết nối CSDL.
15:31:16.872 client: ngắt — transport close              ← client biết ngay (20 ms), tự nối lại khi máy chủ lên`;

const SERVER_TS = `const io = await ganRealtime(server);

// Tắt êm: Ctrl+C (SIGINT) hoặc docker stop (SIGTERM) ⇒ ngừng nhận request mới, chờ request đang chạy, đóng pool CSDL.
for (const tinHieu of ['SIGINT', 'SIGTERM'] as const) {
  process.once(tinHieu, () =&gt; {
    console.log(\`Nhận \${tinHieu}, đang tắt…\`);
    // io.close() thay cho server.close(): ngắt mọi socket RỒI đóng máy chủ HTTP (vẫn chờ request HTTP đang chạy).
    // Chỉ server.close() thì Node chờ MỌI kết nối tự kết thúc — một tab đang mở giữ WebSocket mãi ⇒ tắt treo
    // tới khi docker stop hết 10 s rồi SIGKILL (bài 7.1 đo).
    void io.close(async () =&gt; {
      await prisma.$disconnect();
      console.log('Đã đóng HTTP và kết nối CSDL.');
      process.exit(0);
    });
  });
}`;


const MERMAID = `flowchart LR
  A["An bấm Gửi"] -->|"POST /api/posts/:id/comments"| API["API Express"]
  API -->|"INSERT"| DB[("PostgreSQL")]
  API -->|"bao(): SAU khi ghi"| RT["realtime/index.ts"]
  RT -->|"42[binh-luan:moi, …] qua WebSocket"| B["Tab của Bình"]
  RT -->|"cùng sự kiện"| C["Tab của Chi"]`;

const THE = [
  lienKet({ khoa: 'socket-io', bai: 'io-0-2-long-poll', title: 'Socket.IO 0.2 — Vì sao long-polling KHÔNG chết trong năm 2026', sub: 'Proxy công ty, mạng di động — vì sao thư viện vẫn bắt đầu bằng HTTP rồi mới nâng cấp.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-0-3-tren-day', title: 'Socket.IO 0.3 — Thứ trên dây: ba packet thật', sub: 'Đọc 0, 40, 42 như đọc header HTTP.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-2-2-ping', title: 'Socket.IO 2.2 — pingInterval và pingTimeout', sub: 'Hai con số quyết định bao lâu thì biết một kết nối đã chết.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-1-websocket-co-ban', title: 'Node.js 11.1 — Từ hỏi đi hỏi lại tới được báo: WebSocket', sub: 'Cú bắt tay Upgrade, khung WebSocket — nền của mọi thứ trong chương này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-10-3-realtime', title: 'API Design 10.4 — Polling, SSE hay WebSocket: chọn thế nào', sub: 'Bảng quyết định đầy đủ hơn, góc nhìn thiết kế API.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📜', 'RFC 6455 — The WebSocket Protocol (IETF, 12/2011)', 'rfc-editor.org', 'https://www.rfc-editor.org/rfc/rfc6455'),
  nguon('🔌', 'Socket.IO — How it works (Engine.IO, nâng cấp transport, ping)', 'socket.io/docs/v4', 'https://socket.io/docs/v4/how-it-works/'),
  nguon('📘', 'MDN — Server-sent events', 'developer.mozilla.org', 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events'),
  nguon('⏱️', 'Chrome for Developers — Heavy throttling of chained JS timers (Chrome 88)', 'developer.chrome.com', 'https://developer.chrome.com/blog/timer-throttling-in-chrome-88'),
  nguon('📖', 'Wikipedia — Socket.IO', 'en.wikipedia.org', 'https://en.wikipedia.org/wiki/Socket.IO'),
].join('\n');

export default {
  title: '7.1 — Why realtime, and picking the light option|||7.1 — Vì sao cần realtime, và chọn phương án nhẹ',
  slug: 'fp-7-1-vi-sao-realtime',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo trước khi chọn: polling 3 giây cho trễ tới 3,3 s và 20 request/phút mỗi tab (200 tab ⇒ 4.008 request/phút, 21,5% CPU API) so với Socket.IO 0 request và 0,6%. Gắn Socket.IO vào chính máy chủ Express, một cầu nối sự kiện để service không biết gì về socket, hợp đồng sự kiện dùng chung kiểu với web (và cái bẫy import kéo cả API vào tsc của web), proxy Vite với ws: true (thiếu nó là kẹt long-polling), đọc gói tin bằng curl, và vì sao server.close() treo khi còn WebSocket. Kèm danh sách chỗ KHÔNG cần realtime.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Light realtime</span>
<h2>Someone comments — how fast should everyone else see it?</h2>
<p class="lead">In Chapter 1 we filed "live comments" under <em>Should</em>: v1 could ship without it. ChiaSe now works end to end, so it is time. Before choosing a technology, we measure the simplest thing that could work — asking the server again and again — and only then pay for something better. By the end of this lesson the API pushes a new comment to every open tab in about 20–90 ms, and you will know exactly what that costs and where it is not worth it.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. The simplest thing: polling</h3>
<p>Polling means the page asks "anything new?" on a timer. It needs no new library and no new server code — the comments endpoint from Chapter 5 already exists. Inside the post page:</p>
<pre><code class="language-tsx">${POLL}</code></pre>
<p>We measured it in a real Chrome: one tab (a guest) watches a post while a script logs in as An and posts eight comments at random moments, then records how long each one takes to appear on the page.</p>
<div class="out">${POLL_OUT}</div>
<p>Three things to read from this:</p>
<ul>
<li><strong>Latency is random between 0 and the interval.</strong> A comment that lands right after a poll waits almost the full 3 seconds (3,317 ms — interval plus request plus render); one that lands right before waits 177 ms. The median is about half the interval. To halve the delay you must double the requests.</li>
<li><strong>The cost is paid even when nothing happens.</strong> 20 requests per minute per open tab, whether or not anyone comments. Express answered 7 of 17 with <code>304 Not Modified</code> (its automatic ETag noticed the body was identical), which saves bandwidth — but the route still ran both database queries to build the body before it could compare.</li>
<li><strong>Polling the first page only works while the list is short.</strong> The poll asks for <code>limit=50</code>; the 51st comment would never show. Fixing that properly needs the "after cursor" logic we write in 7.3 anyway.</li>
</ul>

<h3>2. Now multiply by real users</h3>
<p>One tab is cheap. Here are 200 simulated tabs against the same API for 30 seconds — first polling every 3 s, then each holding one Socket.IO connection and just listening (half-way through, An posts one comment):</p>
<div class="out">${TAI_200}</div>
<p>4,008 requests per minute and a fifth of a CPU core spent answering "no, nothing new" — versus zero requests and 0.6% for 200 idle sockets, which still all received the one comment that mattered. The machine was busy with other work, so treat the CPU figures as a comparison, not a benchmark. The shape is what matters: polling cost grows with <em>tabs × time</em>; push cost grows with <em>events × listeners</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — polling in a background tab.</strong> Browsers slow timers in hidden tabs. Since Chrome 88, a chain of timers in a page hidden for more than 5 minutes (and silent for 30 seconds) is checked only <em>once per minute</em> (Chrome for Developers, "timer throttling in Chrome 88"). Your 3-second poll silently becomes a 60-second poll exactly when the user switches back and expects fresh data.</p></div>

<h3>3. The four options, side by side</h3>
<table>
<thead><tr><th></th><th>Polling</th><th>Long-polling</th><th>Server-Sent Events</th><th>WebSocket</th></tr></thead>
<tbody>
<tr><td>How</td><td>Ask on a timer</td><td>Ask; server holds the request until there is news</td><td>One HTTP response that never ends; server writes lines</td><td>HTTP request "Upgrade: websocket", then a two-way channel (RFC 6455, 2011)</td></tr>
<tr><td>Direction</td><td>client → server</td><td>client → server</td><td>server → client only</td><td>both</td></tr>
<tr><td>Delay</td><td>0 … interval</td><td>~1 round trip</td><td>~0</td><td>~0</td></tr>
<tr><td>Idle cost</td><td>a request every interval</td><td>a held request</td><td>one open connection</td><td>one open connection + small pings</td></tr>
<tr><td>Reconnect</td><td>n/a</td><td>you write it</td><td>built into <code>EventSource</code></td><td>you write it</td></tr>
<tr><td>Passes strict proxies</td><td>always</td><td>always</td><td>usually</td><td>sometimes not</td></tr>
</tbody>
</table>
<p><strong>Socket.IO</strong> (originally by Guillermo Rauch; now maintained by Damien Arrachequesne) is not a fifth transport: it is a library that <em>starts with long-polling</em> (works everywhere), <em>upgrades to WebSocket</em> when the path allows, and adds what you would otherwise write by hand — automatic reconnection with back-off, heartbeats, named events, acknowledgements, and <em>rooms</em> (send to "everyone viewing post X"). The price: it is its own protocol on top of WebSocket — a plain <code>new WebSocket()</code> cannot talk to it — and it adds a client library to the bundle.</p>
<p>For ChiaSe we pick Socket.IO because we need exactly its extras: rooms per post (7.2), reconnection and a connection state (7.3), and something that works behind the school or company proxy. SSE would also be a fine choice for "server tells the page" — it is the lighter option when you need no rooms and no client-to-server messages.</p>

<h3>4. Attach Socket.IO to the server you already have</h3>
<pre><code class="language-bash">npm i -w apps/api socket.io@4.8.4 --save-exact
npm i -w apps/web socket.io-client@4.8.4 --save-exact</code></pre>
<p>Three small pieces, each with one job. First, the <strong>contract</strong>: every event name and its payload, in both directions. The web app imports this file <em>as types only</em>, exactly like the error contract in 6.1:</p>
<pre><code class="language-ts">${HOP_DONG}</code></pre>
<p>Our first version of this file imported the comment type from <code>comment.service.ts</code>. The web build immediately failed:</p>
<div class="out">${TSC_LOI}</div>
<p>Two real lessons in one output. (1) <code>import type</code> is erased from the <em>bundle</em>, but the type checker still <em>reads</em> the imported file and everything it imports — here Prisma and <code>http-error.ts</code>, whose constructor parameter properties are forbidden by the web's <code>erasableSyntaxOnly</code>. A shared contract file must import nothing. (2) Prisma's type says <code>createdAt: Date</code>, but Socket.IO sends JSON and JSON has no dates: the browser receives a string. The contract describes what is <em>on the wire</em>, so the server converts with <code>toISOString()</code> before emitting.</p>
<p>Second, a <strong>bridge</strong>: services announce "this happened" without importing Socket.IO. Tests in Chapter 8 call services with no socket server at all; switching to SSE later touches one file.</p>
<pre><code class="language-ts">${SU_KIEN}</code></pre>
<p>The comment service announces <em>after</em> the insert succeeded — never before the data is in the database, or a tab could show a comment that a failed write never stored:</p>
<pre><code class="language-ts">${TAO_BL}</code></pre>
<p>Third, the <strong>realtime module</strong>. Socket.IO attaches to the same HTTP server Express runs on — same port, same origin, path <code>/socket.io/</code> — so there is no second port, no CORS, and in production Nginx needs one extra <code>location</code>. This first version sends every event to every socket (7.2 replaces that with rooms):</p>
<pre><code class="language-ts">${REALTIME_DAU}</code></pre>
<p>On the web, one socket for the whole tab, created but not yet connected, pointing at the page's own origin:</p>
<pre><code class="language-ts">${SOCKET_DAU}</code></pre>
<pre><code class="language-tsx">${NGHE_DAU}</code></pre>

<h3>5. Read the wire with curl</h3>
<div class="out">${CURL}</div>
<p>The first response is an Engine.IO <em>open</em> packet: type <code>0</code>, a session id, the transports it may upgrade to, and the heartbeat settings (server pings every 25 s, waits 20 s for the pong). Protocol version 3 is refused — a Socket.IO v2 client cannot talk to a v4 server, a classic upgrade surprise. And through Vite, before we told Vite about <code>/socket.io</code>, the "handshake" returns ChiaSe's <code>index.html</code>: the dev server's single-page fallback answers every unknown path with 200.</p>

<h3>6. The Vite proxy, measured three ways</h3>
<p><strong>No proxy entry.</strong> The client gets HTML, cannot parse it, and silently retries with growing delays. No red error in the console — just nothing ever arrives:</p>
<div class="out">${KHONG_PROXY}</div>
<p><strong>Proxy without <code>ws</code>.</strong> Long-polling works through the proxy, the client then tries the WebSocket upgrade — Vite does not forward it, the socket never receives a frame, and the connection stays on long-polling. It even works (comments arrive in 23–93 ms, each one releasing a held GET), which is why this misconfiguration survives for months:</p>
<div class="out">${THIEU_WS}</div>
<p><strong>Proxy with <code>ws: true</code>.</strong> The upgrade succeeds: <code>2probe</code>/<code>3probe</code> test the new channel, <code>5</code> switches to it, and events arrive as <code>42[…]</code> frames:</p>
<div class="out">${CO_WS}</div>
<pre><code class="language-ts">${VITE}</code></pre>
<p>Left idle for 60 seconds, the WebSocket carries only a heartbeat — the server sends <code>2</code> (ping) every 25 s and the client answers <code>3</code> (pong). That is the entire idle cost:</p>
<div class="out">${RANH}</div>

<h3>7. A server that will not stop</h3>
<p>Chapter 2 wrote a graceful shutdown: on SIGTERM, <code>server.close()</code>, then close the database. With a WebSocket open, we sent SIGTERM and waited:</p>
<div class="out">${TAT_TREO}</div>
<p><code>server.close()</code> stops accepting new connections but waits for existing ones to end — and a WebSocket from an open tab never ends by itself. In Docker (Chapter 9) <code>docker stop</code> waits 10 seconds then kills the process, in the middle of whatever it was doing. <code>io.close()</code> disconnects every socket and then closes the HTTP server, still letting in-flight HTTP requests finish:</p>
<pre><code class="language-ts">${SERVER_TS}</code></pre>

<h3>8. Where ChiaSe does NOT need realtime</h3>
<ul>
<li><strong>The feed.</strong> Inserting new posts at the top while someone reads makes the page jump. Twitter-style "3 new posts — show" with a poll every minute (or on window focus) is kinder and far cheaper.</li>
<li><strong>Counters on the feed cards.</strong> Comment and like counts that are a minute old hurt no one. Live counts belong on the page where people are actually watching.</li>
<li><strong>Things that must not be lost.</strong> A notification "someone replied" must survive the user being offline — store it in the database and show it on the next visit; realtime is only a faster doorbell.</li>
<li><strong>Your own action.</strong> After you post, the HTTP response already contains your comment. Realtime is for <em>other people's</em> actions.</li>
</ul>
<p>Rule of thumb for a client meeting: ask "how many seconds of delay is acceptable?" If the answer is "a minute is fine", poll. If it is "people are watching the same thing together", push.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">measure</span><span class="lz-d">polling: delay and requests per tab, before choosing</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">attach</span><span class="lz-d">Socket.IO on the same HTTP server and origin</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">contract</span><span class="lz-d">event types only, no imports, wire shapes</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bridge</span><span class="lz-d">services call bao() after the write</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">proxy</span><span class="lz-d">/socket.io with ws: true — prove it with 2probe</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">shutdown</span><span class="lz-d">io.close() instead of server.close()</span></div>
</div>

<h3>Everyday analogy</h3>
<p>Polling is a child in the back seat asking "are we there yet?" every three minutes: the driver answers "no" fifty times, and still the child learns of the arrival up to three minutes late. Push is the driver saying "we're here" once. Long-polling is the child asking once and the driver staying silent until arrival — then the child asks again.</p>

<h3>On the job</h3>
<p>"Make the dashboard real-time" is a common outsourcing ticket that often hides a 30-second requirement. Ask the client for the acceptable delay and the number of simultaneous viewers, then put both numbers in the ticket. If you do add WebSocket, list the operations changes up front: proxy/Nginx upgrade headers, graceful shutdown, a heartbeat that survives the load balancer's idle timeout — the parts that break in production, not in the demo.</p>

${spring(false, 'The Spring Boot course has no WebSocket lesson. Spring offers <code>spring-boot-starter-websocket</code> (raw WebSocket or STOMP over WebSocket with <code>@MessageMapping</code>) and <code>SseEmitter</code> for server-sent events — there is no official Socket.IO server for Spring. The architecture decisions of this lesson carry over unchanged: same origin through the dev proxy and Nginx, emit only after the transaction commits (<code>@TransactionalEventListener(phase = AFTER_COMMIT)</code>), and close sessions on shutdown.', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — SPA + API architecture: dev proxy, CORS or same origin'],
  ['sb-21-4-deploy-spa-api', 'Spring Boot 21.4 — Deploying the React app and the Spring API together'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Polling, long-polling, SSE, WebSocket — when would you use each?"</strong> — Polling when a delay of tens of seconds is fine; SSE for one-way server→client streams; WebSocket for two-way or many small messages; long-polling as the fallback that passes every proxy. Back it with numbers: requests per tab per minute vs open connections.</li>
<li><strong>"Is Socket.IO the same as WebSocket?"</strong> — No: a protocol on top (Engine.IO handshake, upgrade from polling, heartbeats, packet types, rooms, acks). A plain WebSocket client cannot connect to it.</li>
<li><strong>"When do you emit the event — before or after saving?"</strong> — After the write commits. Inside a transaction, emit only after commit, or a rollback leaves clients showing data that does not exist.</li>
<li><strong>"Your Node server takes 10 seconds to stop in Docker. Why?"</strong> — Open keep-alive or WebSocket connections keep <code>server.close()</code> waiting; close the socket server (or the connections) explicitly in the shutdown handler.</li>
<li><strong>"What changes in the reverse proxy for WebSocket?"</strong> — Forward the upgrade (<code>Upgrade</code>/<code>Connection</code> headers, HTTP/1.1), and raise the read timeout above the heartbeat interval.</li>
</ol>

<h3>🧪 Lab 7.1 (60 minutes)</h3>
<div class="callout ok">
<ol>
<li>Add the polling version to the post page. With DevTools → Network open, post comments from a second browser and record five delays and the number of requests per minute. Find the 304s in the API log.</li>
<li>Install Socket.IO; write <code>realtime/hop-dong.ts</code>, <code>lib/su-kien.ts</code>, <code>realtime/index.ts</code>; call <code>bao()</code> after the comment insert. Replace polling with a socket listener.</li>
<li>Run <code>curl</code> on <code>/socket.io/?EIO=4&amp;transport=polling</code> against the API and against Vite. Explain each response.</li>
<li>Try the three proxy settings (none, without <code>ws</code>, with <code>ws: true</code>). In DevTools → Network → WS, find the <code>2probe</code> frame — it only appears in one of them.</li>
<li>Open a tab, send SIGTERM to the API (<code>kill</code> the PID listening on the port), and time the exit before and after <code>io.close()</code>.</li>
</ol>
<p><strong>Done when:</strong> a comment posted in browser A appears in browser B in under a second without reload, the WS tab shows <code>42["binh-luan:moi",…]</code> frames, <code>npm run typecheck</code> passes for both apps, and the API stops within a second with tabs open.</p>
<p><strong>Rubric (10):</strong> polling measured with numbers (2) · contract file imports nothing, dates as strings (2) · services do not import Socket.IO (1) · emit after the write (1) · proxy with <code>ws: true</code> proven by a <code>2probe</code> frame (2) · shutdown fixed and timed (1) · a written list of places that do not need realtime (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>7748985</code> on <code>ch7/realtime</code>: <code>apps/api/src/realtime/hop-dong.ts</code>, <code>realtime/index.ts</code>, <code>lib/su-kien.ts</code>, <code>services/comment.service.ts</code> (<code>bao()</code> after <code>create</code>), <code>server.ts</code> (<code>io.close()</code>), <code>apps/web/vite.config.ts</code> (<code>/socket.io</code> with <code>ws: true</code>), <code>src/realtime/socket.ts</code>, <code>src/pages/BaiViet.tsx</code>. If your 200-tab test shows errors, check the open-files limit (<code>ulimit -n</code>): each socket is a file descriptor on both ends.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">polling</span><span class="v">The client asks again on a timer; delay is anywhere between 0 and the interval.</span></div>
  <div class="kv"><span class="k">long-polling</span><span class="v">The server holds the request until there is news, then the client asks again.</span></div>
  <div class="kv"><span class="k">SSE</span><span class="v">Server-Sent Events: one never-ending HTTP response, server → client only, built-in reconnect.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">Two-way channel opened by an HTTP Upgrade request (RFC 6455).</span></div>
  <div class="kv"><span class="k">Engine.IO</span><span class="v">The transport layer under Socket.IO: handshake, polling → WebSocket upgrade, ping/pong.</span></div>
  <div class="kv"><span class="k">heartbeat</span><span class="v">Ping/pong every pingInterval so both sides notice a dead connection.</span></div>
  <div class="kv"><span class="k">graceful shutdown</span><span class="v">Stop taking new work, finish current work, close resources — open sockets included.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured: 3-second polling gives 0.2–3.3 s delay and 20 requests per minute per tab; 200 tabs cost 4,008 requests/min and 21.5% of a core versus 0 and 0.6% with sockets.</li>
<li>Socket.IO = long-polling first, WebSocket upgrade, reconnection, heartbeats, rooms. It shares the Express server and origin.</li>
<li>A shared event contract must import nothing and describe the wire (dates are strings). Services announce through a bridge, after the write.</li>
<li>Vite needs <code>/socket.io</code> with <code>ws: true</code>; without it the app quietly stays on long-polling.</li>
<li><code>server.close()</code> waits forever for open WebSockets; close the socket server in the shutdown handler.</li>
<li>Not everything needs realtime: the feed, feed counters and must-not-lose notifications are better served otherwise.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Realtime nhẹ</span>
<h2>Có người bình luận — người khác cần thấy nhanh tới đâu?</h2>
<p class="lead">Ở Chương 1 ta xếp "bình luận tức thời" vào nhóm <em>Should</em>: v1 vẫn ra được nếu thiếu. Giờ ChiaSe đã chạy trọn từ đầu tới cuối, tới lúc làm. Trước khi chọn công nghệ, ta đo thứ đơn giản nhất có thể chạy — hỏi máy chủ hết lần này tới lần khác — rồi mới trả tiền cho thứ tốt hơn. Hết bài này, API đẩy bình luận mới tới mọi tab đang mở trong khoảng 20–90 ms, và bạn biết chính xác cái giá của nó cũng như chỗ nào không đáng làm.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Thứ đơn giản nhất: polling</h3>
<p>Polling là trang tự hỏi "có gì mới không?" theo đồng hồ. Không cần thư viện mới, không cần mã máy chủ mới — đường dẫn bình luận từ Chương 5 đã có sẵn. Trong trang bài viết:</p>
<pre><code class="language-tsx">${POLL}</code></pre>
<p>Ta đo trong Chrome thật: một tab (khách) xem một bài, một script đăng nhập bằng An rồi đăng tám bình luận vào những lúc ngẫu nhiên, ghi lại mỗi bình luận mất bao lâu mới hiện trên trang.</p>
<div class="out">${POLL_OUT}</div>
<p>Ba điều đọc ra được:</p>
<ul>
<li><strong>Độ trễ ngẫu nhiên từ 0 tới chu kỳ hỏi.</strong> Bình luận rơi ngay sau một lần hỏi phải chờ gần đủ 3 giây (3.317 ms — chu kỳ cộng thời gian request cộng vẽ lại); rơi ngay trước thì chỉ 177 ms. Trung vị khoảng nửa chu kỳ. Muốn trễ giảm một nửa thì phải hỏi gấp đôi.</li>
<li><strong>Tốn kể cả khi chẳng có gì xảy ra.</strong> 20 request mỗi phút cho mỗi tab đang mở, dù có ai bình luận hay không. Express trả 7/17 lần bằng <code>304 Not Modified</code> (ETag tự động thấy thân giống hệt) — đỡ băng thông, nhưng route vẫn chạy đủ hai truy vấn CSDL để dựng thân rồi mới so được.</li>
<li><strong>Hỏi trang đầu chỉ đúng khi danh sách còn ngắn.</strong> Lệnh hỏi dùng <code>limit=50</code>; bình luận thứ 51 sẽ không bao giờ hiện. Sửa cho đúng cần logic "sau cursor" mà bài 7.3 đằng nào cũng viết.</li>
</ul>

<h3>2. Giờ nhân với người dùng thật</h3>
<p>Một tab thì rẻ. Đây là 200 tab giả lập vào cùng API trong 30 giây — đầu tiên polling mỗi 3 s, sau đó mỗi tab giữ một kết nối Socket.IO và chỉ nằm nghe (giữa chừng An đăng một bình luận):</p>
<div class="out">${TAI_200}</div>
<p>4.008 request mỗi phút và một phần năm nhân CPU chỉ để trả lời "không, chưa có gì" — so với 0 request và 0,6% cho 200 socket rảnh, mà cả 200 vẫn nhận được đúng bình luận đáng nhận. Máy đang bận việc khác, nên coi số CPU là để so sánh, không phải benchmark. Điều đáng nhớ là hình dạng: chi phí polling tăng theo <em>số tab × thời gian</em>; chi phí đẩy tăng theo <em>số sự kiện × số người nghe</em>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — polling ở tab nền.</strong> Trình duyệt làm chậm đồng hồ ở tab bị ẩn. Từ Chrome 88, chuỗi hẹn giờ trong trang bị ẩn quá 5 phút (và im lặng 30 giây) chỉ được kiểm <em>mỗi phút một lần</em> (Chrome for Developers, "timer throttling in Chrome 88"). Polling 3 giây của bạn lặng lẽ thành polling 60 giây — đúng lúc người dùng quay lại tab và mong thấy dữ liệu mới.</p></div>

<h3>3. Bốn lựa chọn, đặt cạnh nhau</h3>
<table>
<thead><tr><th></th><th>Polling</th><th>Long-polling</th><th>Server-Sent Events</th><th>WebSocket</th></tr></thead>
<tbody>
<tr><td>Cách làm</td><td>Hỏi theo đồng hồ</td><td>Hỏi; máy chủ giữ request tới khi có tin</td><td>Một phản hồi HTTP không bao giờ kết thúc; máy chủ viết từng dòng</td><td>Request HTTP "Upgrade: websocket", sau đó là kênh hai chiều (RFC 6455, 2011)</td></tr>
<tr><td>Chiều</td><td>client → server</td><td>client → server</td><td>chỉ server → client</td><td>cả hai</td></tr>
<tr><td>Độ trễ</td><td>0 … chu kỳ</td><td>~1 lượt đi-về</td><td>~0</td><td>~0</td></tr>
<tr><td>Chi phí khi rảnh</td><td>một request mỗi chu kỳ</td><td>một request bị giữ</td><td>một kết nối mở</td><td>một kết nối mở + ping nhỏ</td></tr>
<tr><td>Tự nối lại</td><td>không cần</td><td>tự viết</td><td>có sẵn trong <code>EventSource</code></td><td>tự viết</td></tr>
<tr><td>Qua proxy khó tính</td><td>luôn qua</td><td>luôn qua</td><td>thường qua</td><td>có lúc không</td></tr>
</tbody>
</table>
<p><strong>Socket.IO</strong> (do Guillermo Rauch viết ban đầu; nay Damien Arrachequesne duy trì) không phải cách truyền thứ năm: nó là thư viện <em>bắt đầu bằng long-polling</em> (chạy ở mọi nơi), <em>nâng lên WebSocket</em> khi đường đi cho phép, và thêm những thứ bạn sẽ phải tự viết — tự nối lại với thời gian chờ tăng dần, heartbeat, sự kiện có tên, xác nhận (ack), và <em>phòng</em> (gửi cho "mọi người đang xem bài X"). Cái giá: nó là giao thức riêng nằm trên WebSocket — một <code>new WebSocket()</code> trần không nói chuyện được với nó — và thêm một thư viện client vào bundle.</p>
<p>ChiaSe chọn Socket.IO vì cần đúng những phần thêm đó: phòng theo bài (7.2), tự nối lại và trạng thái kết nối (7.3), và thứ chạy được sau proxy của trường hay công ty. SSE cũng là lựa chọn tốt cho "máy chủ báo trang" — nó nhẹ hơn khi bạn không cần phòng và không cần tin nhắn từ client lên.</p>

<h3>4. Gắn Socket.IO vào chính máy chủ đang có</h3>
<pre><code class="language-bash">npm i -w apps/api socket.io@4.8.4 --save-exact
npm i -w apps/web socket.io-client@4.8.4 --save-exact</code></pre>
<p>Ba mảnh nhỏ, mỗi mảnh một việc. Thứ nhất, <strong>hợp đồng</strong>: mọi tên sự kiện và dữ liệu đi kèm, cả hai chiều. Web import tệp này <em>chỉ dạng kiểu</em>, y như hợp đồng lỗi ở bài 6.1:</p>
<pre><code class="language-ts">${HOP_DONG}</code></pre>
<p>Bản đầu của tệp này import kiểu bình luận từ <code>comment.service.ts</code>. Bản build của web hỏng ngay:</p>
<div class="out">${TSC_LOI}</div>
<p>Hai bài học thật trong một output. (1) <code>import type</code> bị xoá khỏi <em>bundle</em>, nhưng bộ kiểm kiểu vẫn <em>đọc</em> tệp được import và mọi thứ tệp đó import — ở đây là Prisma và <code>http-error.ts</code>, nơi cú pháp tham số-thuộc-tính trong constructor bị <code>erasableSyntaxOnly</code> của web cấm. Tệp hợp đồng dùng chung không được import gì. (2) Kiểu của Prisma nói <code>createdAt: Date</code>, nhưng Socket.IO gửi JSON mà JSON không có kiểu ngày: trình duyệt nhận một chuỗi. Hợp đồng mô tả thứ <em>nằm trên dây</em>, nên máy chủ đổi bằng <code>toISOString()</code> trước khi phát.</p>
<p>Thứ hai, một <strong>cầu nối</strong>: service báo "vừa có chuyện này" mà không import Socket.IO. Test ở Chương 8 gọi service khi không có máy chủ socket nào; sau này đổi sang SSE chỉ sửa một tệp.</p>
<pre><code class="language-ts">${SU_KIEN}</code></pre>
<p>Service bình luận báo <em>sau khi</em> câu INSERT thành công — không bao giờ trước khi dữ liệu đã nằm trong CSDL, kẻo một tab hiện bình luận mà lần ghi thất bại chưa từng lưu:</p>
<pre><code class="language-ts">${TAO_BL}</code></pre>
<p>Thứ ba, <strong>module realtime</strong>. Socket.IO gắn vào chính máy chủ HTTP mà Express đang chạy — cùng cổng, cùng origin, đường dẫn <code>/socket.io/</code> — nên không có cổng thứ hai, không CORS, và khi production Nginx chỉ cần thêm một <code>location</code>. Bản đầu này phát mọi sự kiện cho mọi socket (7.2 thay bằng phòng):</p>
<pre><code class="language-ts">${REALTIME_DAU}</code></pre>
<p>Phía web: một socket cho cả tab, tạo sẵn nhưng chưa nối, trỏ về chính origin của trang:</p>
<pre><code class="language-ts">${SOCKET_DAU}</code></pre>
<pre><code class="language-tsx">${NGHE_DAU}</code></pre>

<h3>5. Đọc dây bằng curl</h3>
<div class="out">${CURL}</div>
<p>Phản hồi đầu là gói <em>open</em> của Engine.IO: loại <code>0</code>, mã phiên (sid), các cách truyền được phép nâng lên, và thông số heartbeat (máy chủ ping mỗi 25 s, chờ pong 20 s). Giao thức phiên bản 3 bị từ chối — client Socket.IO v2 không nói chuyện được với máy chủ v4, một bất ngờ kinh điển khi nâng cấp. Còn đi qua Vite, khi chưa khai <code>/socket.io</code> cho Vite, "cú bắt tay" trả về <code>index.html</code> của ChiaSe: máy chủ dev trả lời mọi đường dẫn lạ bằng trang chính, mã 200.</p>

<h3>6. Proxy của Vite, đo ba cách</h3>
<p><strong>Không khai proxy.</strong> Client nhận HTML, không đọc được, rồi lặng lẽ thử lại với thời gian chờ tăng dần. Console không có dòng đỏ nào — chỉ là chẳng bao giờ có gì tới:</p>
<div class="out">${KHONG_PROXY}</div>
<p><strong>Proxy thiếu <code>ws</code>.</strong> Long-polling chạy qua proxy, rồi client thử nâng lên WebSocket — Vite không chuyển tiếp cú nâng cấp, socket không bao giờ nhận được khung nào, và kết nối ở lại long-polling. Nó thậm chí vẫn chạy (bình luận tới sau 23–93 ms, mỗi bình luận "nhả" một GET đang bị giữ) — vì thế cấu hình sai này sống được hàng tháng không ai phát hiện:</p>
<div class="out">${THIEU_WS}</div>
<p><strong>Proxy có <code>ws: true</code>.</strong> Nâng cấp thành công: <code>2probe</code>/<code>3probe</code> thử kênh mới, <code>5</code> chuyển sang nó, và sự kiện tới dạng khung <code>42[…]</code>:</p>
<div class="out">${CO_WS}</div>
<pre><code class="language-ts">${VITE}</code></pre>
<p>Để yên 60 giây, WebSocket chỉ chở heartbeat — máy chủ gửi <code>2</code> (ping) mỗi 25 s, client đáp <code>3</code> (pong). Đó là toàn bộ chi phí khi rảnh:</p>
<div class="out">${RANH}</div>

<h3>7. Máy chủ không chịu tắt</h3>
<p>Chương 2 đã viết tắt êm: nhận SIGTERM thì <code>server.close()</code>, rồi đóng CSDL. Khi có một WebSocket đang mở, ta gửi SIGTERM và chờ:</p>
<div class="out">${TAT_TREO}</div>
<p><code>server.close()</code> ngừng nhận kết nối mới nhưng chờ các kết nối cũ tự kết thúc — mà WebSocket của một tab đang mở thì không bao giờ tự kết thúc. Trong Docker (Chương 9), <code>docker stop</code> chờ 10 giây rồi giết tiến trình, đang làm gì bỏ dở đó. <code>io.close()</code> ngắt mọi socket rồi mới đóng máy chủ HTTP, vẫn để các request HTTP đang chạy làm xong:</p>
<pre><code class="language-ts">${SERVER_TS}</code></pre>

<h3>8. Chỗ ChiaSe KHÔNG cần realtime</h3>
<ul>
<li><strong>Feed.</strong> Chèn bài mới lên đầu khi người ta đang đọc làm trang nhảy. Kiểu "3 bài mới — bấm để xem" với polling mỗi phút (hoặc khi cửa sổ được focus) dễ chịu hơn và rẻ hơn rất nhiều.</li>
<li><strong>Số đếm trên thẻ ở feed.</strong> Số bình luận, lượt thích cũ một phút chẳng hại ai. Số đếm sống chỉ đáng làm ở trang mà người ta đang thật sự cùng xem.</li>
<li><strong>Thứ không được mất.</strong> Thông báo "có người trả lời bạn" phải sống qua lúc người dùng offline — lưu vào CSDL và hiện ở lần ghé sau; realtime chỉ là cái chuông cửa nhanh hơn.</li>
<li><strong>Hành động của chính mình.</strong> Đăng xong, phản hồi HTTP đã chứa bình luận của bạn. Realtime dành cho hành động của <em>người khác</em>.</li>
</ul>
<p>Mẹo khi họp với khách hàng: hỏi "chậm bao nhiêu giây thì chấp nhận được?". Nếu câu trả lời là "một phút cũng được" thì polling. Nếu là "mọi người cùng xem một thứ một lúc" thì đẩy.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">đo</span><span class="lz-d">polling: trễ và số request mỗi tab, trước khi chọn</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">gắn</span><span class="lz-d">Socket.IO trên chính máy chủ HTTP, cùng origin</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">hợp đồng</span><span class="lz-d">chỉ kiểu sự kiện, không import, đúng hình dạng trên dây</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">cầu nối</span><span class="lz-d">service gọi bao() sau khi ghi</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">proxy</span><span class="lz-d">/socket.io với ws: true — chứng minh bằng 2probe</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">tắt êm</span><span class="lz-d">io.close() thay cho server.close()</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Polling là đứa trẻ ghế sau cứ ba phút hỏi "tới chưa bố?": bố trả lời "chưa" năm mươi lần, mà con vẫn biết tin tới nơi trễ tới ba phút. Đẩy là bố nói "tới rồi" đúng một lần. Long-polling là con hỏi một lần và bố im cho tới khi tới nơi — rồi con lại hỏi tiếp.</p>

<h3>Tình huống đi làm thật</h3>
<p>"Làm dashboard real-time" là ticket outsourcing hay gặp, mà nhiều khi bên dưới chỉ là yêu cầu 30 giây. Hỏi khách độ trễ chấp nhận được và số người xem cùng lúc, rồi ghi cả hai con số vào ticket. Nếu có thêm WebSocket, liệt kê ngay từ đầu các việc vận hành: header nâng cấp ở proxy/Nginx, tắt êm, heartbeat sống qua timeout rảnh của load balancer — những phần hỏng ở production chứ không hỏng lúc demo.</p>

${spring(false, 'Khoá Spring Boot chưa có bài WebSocket. Spring có <code>spring-boot-starter-websocket</code> (WebSocket trần hoặc STOMP trên WebSocket với <code>@MessageMapping</code>) và <code>SseEmitter</code> cho server-sent events — không có máy chủ Socket.IO chính thức cho Spring. Các quyết định kiến trúc của bài này giữ nguyên: cùng origin qua proxy dev và Nginx, chỉ phát sau khi transaction commit (<code>@TransactionalEventListener(phase = AFTER_COMMIT)</code>), và đóng phiên khi tắt máy chủ.', [
  ['sb-21-1-kien-truc-spa', 'Spring Boot 21.1 — Kiến trúc SPA + API: dev proxy, CORS hay cùng origin'],
  ['sb-21-4-deploy-spa-api', 'Spring Boot 21.4 — Triển khai app React và API Spring cùng nhau'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Polling, long-polling, SSE, WebSocket — khi nào dùng cái nào?"</strong> — Polling khi trễ vài chục giây vẫn ổn; SSE cho luồng một chiều server→client; WebSocket cho hai chiều hoặc nhiều tin nhỏ; long-polling là đường lùi qua được mọi proxy. Dẫn số: request mỗi tab mỗi phút so với số kết nối mở.</li>
<li><strong>"Socket.IO có phải WebSocket không?"</strong> — Không: là giao thức nằm trên (bắt tay Engine.IO, nâng từ polling lên, heartbeat, loại gói, phòng, ack). Client WebSocket trần không nối được.</li>
<li><strong>"Phát sự kiện trước hay sau khi lưu?"</strong> — Sau khi ghi đã commit. Trong transaction thì chỉ phát sau commit, nếu không rollback sẽ để client hiện dữ liệu không tồn tại.</li>
<li><strong>"Máy chủ Node của bạn mất 10 giây mới dừng trong Docker. Vì sao?"</strong> — Kết nối keep-alive hay WebSocket còn mở làm <code>server.close()</code> chờ mãi; đóng máy chủ socket (hoặc các kết nối) một cách tường minh trong hàm tắt.</li>
<li><strong>"Reverse proxy phải đổi gì cho WebSocket?"</strong> — Chuyển tiếp cú nâng cấp (header <code>Upgrade</code>/<code>Connection</code>, HTTP/1.1), và tăng timeout đọc lên trên chu kỳ heartbeat.</li>
</ol>

<h3>🧪 Lab 7.1 (60 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm bản polling vào trang bài viết. Mở DevTools → Network, đăng bình luận từ trình duyệt thứ hai, ghi lại năm độ trễ và số request mỗi phút. Tìm các dòng 304 trong log API.</li>
<li>Cài Socket.IO; viết <code>realtime/hop-dong.ts</code>, <code>lib/su-kien.ts</code>, <code>realtime/index.ts</code>; gọi <code>bao()</code> sau câu INSERT bình luận. Thay polling bằng một listener socket.</li>
<li>Chạy <code>curl</code> vào <code>/socket.io/?EIO=4&amp;transport=polling</code> ở cổng API và ở cổng Vite. Giải thích từng phản hồi.</li>
<li>Thử ba cấu hình proxy (không có, thiếu <code>ws</code>, có <code>ws: true</code>). Trong DevTools → Network → WS, tìm khung <code>2probe</code> — nó chỉ xuất hiện ở một trong ba.</li>
<li>Mở một tab, gửi SIGTERM cho API (<code>kill</code> đúng PID đang nghe cổng), đo thời gian thoát trước và sau khi dùng <code>io.close()</code>.</li>
</ol>
<p><strong>Xong khi:</strong> bình luận đăng ở trình duyệt A hiện ở trình duyệt B dưới một giây mà không tải lại, tab WS thấy khung <code>42["binh-luan:moi",…]</code>, <code>npm run typecheck</code> qua cho cả hai ứng dụng, và API dừng trong một giây khi còn tab đang mở.</p>
<p><strong>Thang điểm (10):</strong> đo polling có số liệu (2) · tệp hợp đồng không import gì, ngày là chuỗi (2) · service không import Socket.IO (1) · phát sau khi ghi (1) · proxy <code>ws: true</code> có bằng chứng khung <code>2probe</code> (2) · sửa tắt êm có đo giờ (1) · danh sách viết ra các chỗ không cần realtime (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>7748985</code> trên <code>ch7/realtime</code>: <code>apps/api/src/realtime/hop-dong.ts</code>, <code>realtime/index.ts</code>, <code>lib/su-kien.ts</code>, <code>services/comment.service.ts</code> (<code>bao()</code> sau <code>create</code>), <code>server.ts</code> (<code>io.close()</code>), <code>apps/web/vite.config.ts</code> (<code>/socket.io</code> với <code>ws: true</code>), <code>src/realtime/socket.ts</code>, <code>src/pages/BaiViet.tsx</code>. Nếu phép thử 200 tab báo lỗi, kiểm giới hạn số tệp mở (<code>ulimit -n</code>): mỗi socket là một file descriptor ở cả hai đầu.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">polling</span><span class="v">Client hỏi lại theo đồng hồ; trễ bất kỳ từ 0 tới chu kỳ hỏi.</span></div>
  <div class="kv"><span class="k">long-polling</span><span class="v">Máy chủ giữ request tới khi có tin, rồi client hỏi tiếp.</span></div>
  <div class="kv"><span class="k">SSE</span><span class="v">Server-Sent Events: một phản hồi HTTP không bao giờ kết thúc, chỉ server → client, tự nối lại sẵn.</span></div>
  <div class="kv"><span class="k">WebSocket</span><span class="v">Kênh hai chiều mở bằng request HTTP Upgrade (RFC 6455).</span></div>
  <div class="kv"><span class="k">Engine.IO</span><span class="v">Tầng truyền dưới Socket.IO: bắt tay, nâng polling → WebSocket, ping/pong.</span></div>
  <div class="kv"><span class="k">heartbeat</span><span class="v">Ping/pong mỗi pingInterval để hai bên nhận ra kết nối đã chết.</span></div>
  <div class="kv"><span class="k">tắt êm</span><span class="v">Ngừng nhận việc mới, làm xong việc đang dở, đóng tài nguyên — kể cả socket đang mở.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo được: polling 3 giây cho trễ 0,2–3,3 s và 20 request mỗi phút mỗi tab; 200 tab tốn 4.008 request/phút và 21,5% một nhân, so với 0 và 0,6% khi dùng socket.</li>
<li>Socket.IO = long-polling trước, nâng lên WebSocket, tự nối lại, heartbeat, phòng. Nó dùng chung máy chủ và origin với Express.</li>
<li>Hợp đồng sự kiện dùng chung không được import gì và mô tả thứ trên dây (ngày là chuỗi). Service báo qua cầu nối, sau khi ghi.</li>
<li>Vite cần <code>/socket.io</code> với <code>ws: true</code>; thiếu nó ứng dụng lặng lẽ ở lại long-polling.</li>
<li><code>server.close()</code> chờ mãi WebSocket đang mở; đóng máy chủ socket trong hàm tắt.</li>
<li>Không phải chỗ nào cũng cần realtime: feed, số đếm trên feed và thông báo không được mất nên làm cách khác.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
