/**
 * 7.2 — Cập nhật bình luận và lượt thích tức thời (soạn 24/11/2026, agent fsp).
 * Output THẬT: Chrome 150 (playwright-core 1.65.1, hai context = hai người), socket.io-client 4.8.4 từ Node, PostgreSQL 18,
 * Prisma 7.10.1. Repo chiase nhánh ch7/realtime commit 0498e68.
 * Phát hiện thật 24/11: io.emit ⇒ tab xem bài A nhận bình luận của B, C, D (254 byte mỗi cái); vào phòng không kiểm ⇒ MỘT socket
 * vào 1.000.000 phòng trong 16 s, RAM API 219 → 564 MB; chỉ giới hạn số phòng thì 100.000 uuid ngẫu nhiên vẫn là 50.000 truy vấn
 * CSDL (RAM 140 → 379 MB) ⇒ giới hạn tốc độ: bị ngắt sau 22 ms; trang ở origin lạ mở WebSocket tới API và vào phòng được (CORS
 * chặn polling nhưng không chặn WebSocket) ⇒ allowRequest kiểm Origin: 400/403; connect_error từ middleware ⇒ s.active=false;
 * 40 người thích cùng lúc ⇒ 40 sự kiện, số đi NGƯỢC (40 → 35) ⇒ phát gộp: 1 sự kiện; người gửi thấy "Bình luận (29)" khi thật
 * là 26 (HTTP + socket cùng cộng); sau F5 GET bài xong trước refresh 14 ms ⇒ likedByMe sai, bấm bỏ thích lại gửi PUT.
 * Nguồn (GET 200, 24/11/2026): Snyk Security Labs — Elliot Ward 27/02/2023 (Gitpod CVE-2023-0957, WebSocket hijacking);
 * PortSwigger Web Security Academy — Cross-site WebSocket hijacking; socket.io docs (rooms, middlewares, handling CORS).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const IO_EMIT = `tab xem bài 0a97 nhận binh-luan:moi của bài …9f6c: "Bình gửi bài …9f6c" — 254 byte
tab xem bài 0a97 nhận binh-luan:moi của bài …6e31: "Bình gửi bài …6e31" — 254 byte
tab xem bài 0a97 nhận binh-luan:moi của bài …0adc: "Bình gửi bài …0adc" — 254 byte`;

const VAO_NGAY_THO = `// THỬ (bài 7.2): vào phòng KHÔNG kiểm gì — trong io.on('connection', …)
socket.on('bai:xem', async (postId, ack) =&gt; {
  await socket.join(\`bai:\${postId}\`);
  ack({ ok: true });
});`;

const LU_PHONG = `$ node lu-phong.mjs 100000      # MỘT socket khách, gửi bai:xem với uuid ngẫu nhiên / chuỗi rác 200 ký tự
100000 lần bai:xem trong 2075 ms: vào 100000, bị từ chối 0, không đáp 0 · RAM API 159 → 212 MB · socket còn nối: true
$ node lu-phong.mjs 1000000
1000000 lần bai:xem trong 15864 ms: vào 1000000, bị từ chối 0, không đáp 0 · RAM API 219 → 564 MB · socket còn nối: true`;

const LU_PHONG_SAU = `100000 lần bai:xem trong 3884 ms: vào 0, bị từ chối 100000, không đáp 0 · RAM API 140 → 379 MB · socket còn nối: true
100000 lần bai:xem trong 25 ms: vào 0, bị từ chối 10, không đáp 490 · RAM API 162 → 164 MB · socket còn nối: false — bị máy chủ ngắt lúc 22 ms (io server disconnect) sau 10 lần được đáp
socket wNgPPW2LGX1k7O-PAAAB (khách) gửi bai:xem quá nhanh — ngắt`;

const CSWSH_TRUOC = `[   23 ms] console.error: Access to fetch at 'http://localhost:41815/socket.io/?EIO=4&amp;transport=polling' from origin 'http://127.0.0.1:41818' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
[   25 ms] console.error: Failed to load resource: net::ERR_FAILED
[   26 ms] console.log: polling: TypeError: Failed to fetch
[   26 ms] console.log: nhận 0{"sid":"-vo8rHO8k432u4n8AAAL","upgrades":[],"pingInterval":25000,"pingTimeout":
[   26 ms] console.error: Failed to load resource: the server responded with a status of 404 (File not found)
[   27 ms] console.log: nhận 40{"sid":"4rdP7DmWPUB3e-rLAAAK"}
[   33 ms] console.log: nhận 430[{"ok":true}]`;

const CSWSH_SAU = `[   32 ms] console.error: WebSocket connection to 'ws://localhost:41815/socket.io/?EIO=4&amp;transport=websocket' failed: Error during WebSocket handshake: Unexpected response code: 400
[   34 ms] console.log: WebSocket lỗi
[   34 ms] console.log: đóng 1006
[   34 ms] console.error: Failed to load resource: the server responded with a status of 404 (File not found)
HTTP/1.1 403 Forbidden
{"code":4,"message":"Forbidden"}`;

const REALTIME = `import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { z } from 'zod';
import { ganNguoiNghe } from '../lib/su-kien.js';
import { kiemAccessToken } from '../lib/tokens.js';
import { config } from '../config.js';
import { baiNhinThay } from '../services/comment.service.js';
import type { MaLoiBatTay, SuKienKhach, SuKienMayChu } from './hop-dong.js';

type DuLieuSocket = { userId: string | null }; // null = khách (xem bài công khai không cần đăng nhập)

// Một tab xem một bài; vài tab dùng chung một socket thì vài bài. 10 là quá đủ cho người thật,
// và chặn kiểu tấn công "một socket vào một triệu phòng" (bài 7.2 đo: +345 MB RAM API trong 16 giây).
const TOI_DA_PHONG = 10;
// Mỗi lần 'bai:xem' hợp lệ tốn MỘT truy vấn CSDL ⇒ giới hạn tốc độ theo socket: quá 20 lần/10 giây thì ngắt hẳn.
// (Đo: chỉ có TOI_DA_PHONG thì 100.000 uuid ngẫu nhiên — không bao giờ vào được phòng nào — vẫn là 50.000 truy vấn.)
const TOI_DA_XEM_10S = 20;
const uuid = z.uuid();
const phong = (postId: string) =&gt; \`bai:\${postId}\`;

function loiBatTay(code: MaLoiBatTay) {
  // Client nhận trong connect_error: err.message === code, err.data.code === code
  return Object.assign(new Error(code), { data: { code } });
}

// Socket.IO gắn vào CHÍNH máy chủ HTTP của Express: cùng cổng, cùng origin, đường dẫn /socket.io/.
// Không mở cổng thứ hai ⇒ không CORS, proxy Vite (khi dev) và Nginx (production) chỉ cần thêm một location.
export function ganRealtime(http: HttpServer) {
  const io = new Server&lt;SuKienKhach, SuKienMayChu, Record&lt;string, never&gt;, DuLieuSocket&gt;(http, {
    serveClient: false, // web tự bundle socket.io-client; đừng phục vụ /socket.io/socket.io.js
    maxHttpBufferSize: 10_000, // sự kiện từ client chỉ là một uuid — 10 kB là quá rộng rãi (mặc định 1 MB)
    // WebSocket KHÔNG bị CORS chặn: trang ở origin lạ mở được socket tới ta (bài 7.2 đo). Trình duyệt LUÔN gửi Origin và
    // JavaScript không giả được ⇒ có Origin mà khác web của ta thì từ chối. Không có Origin = script/ứng dụng ngoài trình
    // duyệt (không mang cookie của nạn nhân) ⇒ cho qua, vẫn phải qua xác thực token như mọi người.
    allowRequest: (req, cb) =&gt; {
      const origin = req.headers.origin;
      cb(null, origin === undefined || origin === config.webOrigin);
    },
  });

  // XÁC THỰC MỘT LẦN, LÚC BẮT TAY (trước 'connection'). Token đi trong handshake.auth — KHÔNG trong cookie:
  // WebSocket không bị CORS chặn, nên nếu nhận diện bằng cookie thì trang lạ mở socket "thay mặt" nạn nhân được (CSWSH).
  io.use(async (socket, next) =&gt; {
    const token: unknown = socket.handshake.auth.token;
    if (token == null) {
      socket.data.userId = null; // không gửi token = khách, được xem bài công khai
      return next();
    }
    const kq = typeof token === 'string' ? await kiemAccessToken(token) : null;
    if (!kq?.ok) return next(loiBatTay(kq?.lyDo === 'HET_HAN' ? 'TOKEN_HET_HAN' : 'TOKEN_KHONG_HOP_LE'));
    socket.data.userId = kq.userId;
    next();
  });

  io.on('connection', (socket) =&gt; {
    const ai = socket.data.userId ?? 'khách';
    console.log(
      \`socket \${socket.id} nối (\${socket.conn.transport.name}, \${ai}), tổng \${io.engine.clientsCount}\`,
    );
    socket.on('disconnect', (lyDo) =&gt; console.log(\`socket \${socket.id} ngắt: \${lyDo}\`));

    // PHÂN QUYỀN MỖI LẦN vào phòng — cùng luật với GET /posts/:id (nháp của người khác = không tồn tại).
    // Dữ liệu từ client là KHÔNG tin được: kiểm kiểu, kiểm ack là hàm, kiểm giới hạn TRƯỚC khi chạm CSDL.
    let soLanXem = 0;
    const henDatLai = setInterval(() =&gt; (soLanXem = 0), 10_000);
    socket.on('disconnect', () =&gt; clearInterval(henDatLai));

    socket.on('bai:xem', async (postId, ack) =&gt; {
      if (typeof ack !== 'function') return;
      if (++soLanXem &gt; TOI_DA_XEM_10S) {
        console.warn(\`socket \${socket.id} (\${ai}) gửi bai:xem quá nhanh — ngắt\`);
        return socket.disconnect(true);
      }
      if (!uuid.safeParse(postId).success) return ack({ ok: false, code: 'KHONG_TIM_THAY' });
      if (socket.rooms.size &gt; TOI_DA_PHONG) return ack({ ok: false, code: 'QUA_NHIEU_PHONG' }); // rooms có cả phòng riêng socket.id
      try {
        await baiNhinThay(postId, socket.data.userId ?? undefined);
      } catch {
        return ack({ ok: false, code: 'KHONG_TIM_THAY' });
      }
      await socket.join(phong(postId));
      ack({ ok: true });
    });
    socket.on('bai:roi', (postId) =&gt; {
      if (typeof postId === 'string') void socket.leave(phong(postId));
    });
  });

  // Service báo ⇒ phát cho ĐÚNG phòng của bài đó, không phát cho cả hệ thống.
  ganNguoiNghe((e) =&gt; io.to(phong(e.duLieu.postId)).emit(e.ten, e.duLieu as never));
  return io;
}`;

const BAT_TAY = `không token (khách)      ⇒ nối được (id wJUDAk…)
token rác                ⇒ connect_error: message="TOKEN_KHONG_HOP_LE" data={"code":"TOKEN_KHONG_HOP_LE"} · s.active=false
token ký bằng khoá khác  ⇒ connect_error: message="TOKEN_KHONG_HOP_LE" data={"code":"TOKEN_KHONG_HOP_LE"} · s.active=false
token là số              ⇒ connect_error: message="TOKEN_KHONG_HOP_LE" data={"code":"TOKEN_KHONG_HOP_LE"} · s.active=false
token của An             ⇒ nối được (id oPSBYj…)
--- An tạo bài NHÁP 00d3d2; ba socket xin vào phòng của nó
khách          bai:xem ⇒ {"ok":false,"code":"KHONG_TIM_THAY"}
Bình           bai:xem ⇒ {"ok":false,"code":"KHONG_TIM_THAY"}
An (tác giả)   bai:xem ⇒ {"ok":true}`;

const LIKE_SCHEMA = `/// Lượt thích: bảng nối n-n User ⇄ Post (thiết kế từ Chương 1). Khoá chính GHÉP (user_id, post_id) ⇒ một người thích
/// một bài TỐI ĐA một lần — CSDL đảm bảo, không phải mã. Thứ tự (user, post) phục vụ "tôi đã thích bài này chưa";
/// chỉ mục post_id phục vụ "bài này có bao nhiêu lượt thích".
model Like {
  userId    String   @map("user_id") @db.Uuid
  postId    String   @map("post_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz(3)

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@id([userId, postId])
  @@index([postId])
  @@map("likes")
}`;

const LIKE_SQL = `-- CreateTable
CREATE TABLE "likes" (
    "user_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateIndex
CREATE INDEX "likes_post_id_idx" ON "likes"("post_id");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;`;

const THICH_NGAY_THO = `// BẢN ĐẦU: mỗi lần bấm ⇒ đếm lại rồi phát NGAY
export async function thich(postId: string, userId: string): Promise&lt;KetQuaThich&gt; {
  // … kiểm bài như bản cuối …
  await prisma.like.createMany({ data: [{ postId, userId }], skipDuplicates: true });
  return { liked: true, likeCount: await demVaBao(postId) };
}

async function demVaBao(postId: string) {
  const likeCount = await prisma.like.count({ where: { postId } });
  bao({ ten: 'luot-thich', duLieu: { postId, likeCount } });
  return likeCount;
}`;

const DUA_THICH = `vào phòng: {"ok":true}
lượt 1 (40 × PUT): nhận 40 sự kiện, cuối cùng = 40, CSDL = 40, 1 lần số đi NGƯỢC · dãy: 34 38 34 34 34 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40
lượt 2 (40 × DELETE): nhận 40 sự kiện, cuối cùng = 0, CSDL = 0, 0 lần số đi NGƯỢC · dãy: 11 11 9 9 7 7 2 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
lượt 3 (40 × PUT): nhận 40 sự kiện, cuối cùng = 40, CSDL = 40, 1 lần số đi NGƯỢC · dãy: 35 35 35 35 39 40 40 40 35 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40 40`;

const LIKE_SVC = `import { prisma } from '../db/prisma.js';
import { HttpError } from '../lib/http-error.js';
import { bao } from '../lib/su-kien.js';
import { baiNhinThay } from './comment.service.js';

export type KetQuaThich = { liked: boolean; likeCount: number };

// PUT = "đặt trạng thái ĐÃ THÍCH" (idempotent): bấm hai lần, mạng gửi lại, hai tab cùng bấm — kết quả vẫn là một lượt.
// ON CONFLICT DO NOTHING (skipDuplicates) thay vì bắt lỗi P2002: trùng khoá là chuyện BÌNH THƯỜNG ở đây, không phải lỗi.
export async function thich(postId: string, userId: string): Promise&lt;KetQuaThich&gt; {
  const bai = await baiNhinThay(postId, userId);
  if (bai.status !== 'published')
    throw new HttpError(409, 'BAI_CHUA_DANG', 'Bài chưa đăng thì chưa thích được');
  await prisma.like.createMany({ data: [{ postId, userId }], skipDuplicates: true });
  henPhat(postId);
  return { liked: true, likeCount: await dem(postId) };
}

// DELETE cũng idempotent: chưa thích mà bỏ thích ⇒ vẫn 200 với số đếm hiện tại.
export async function boThich(postId: string, userId: string): Promise&lt;KetQuaThich&gt; {
  await baiNhinThay(postId, userId);
  await prisma.like.deleteMany({ where: { postId, userId } });
  henPhat(postId);
  return { liked: false, likeCount: await dem(postId) };
}

const dem = (postId: string) =&gt; prisma.like.count({ where: { postId } });

// PHÁT GỘP. Bản đầu "mỗi lần bấm: đếm rồi phát ngay" — đo 40 người bấm cùng lúc: 40 sự kiện, và số ĐI NGƯỢC
// (… 40 40 35 40): lần đếm xong trước chưa chắc được phát trước. Giờ: mỗi bài tối đa MỘT lần đếm+phát mỗi 100 ms,
// và KHÔNG BAO GIỜ hai lần đếm của cùng một bài chạy chồng nhau ⇒ số phát ra luôn là số đọc SAU lần ghi cuối cùng.
// Phát SỐ TUYỆT ĐỐI, không "+1/-1": client lỡ một sự kiện thì sự kiện sau vẫn đúng.
// Trạng thái nằm trong bộ nhớ của MỘT tiến trình — nhiều instance thì xem bài 7.3.
const GOP_MS = 100;
const trangThai = new Map&lt;string, 'cho' | 'dang-dem' | 'dem-lai'&gt;();

function henPhat(postId: string) {
  const tt = trangThai.get(postId);
  if (tt === 'cho' || tt === 'dem-lai') return; // đã có lượt đếm sắp chạy — nó sẽ thấy cả lần ghi này
  if (tt === 'dang-dem') return void trangThai.set(postId, 'dem-lai'); // đang đếm: có thể chưa thấy lần ghi này ⇒ đếm thêm lượt nữa
  trangThai.set(postId, 'cho');
  setTimeout(() =&gt; void demVaPhat(postId), GOP_MS);
}

async function demVaPhat(postId: string) {
  trangThai.set(postId, 'dang-dem');
  try {
    bao({ ten: 'luot-thich', duLieu: { postId, likeCount: await dem(postId) } });
  } catch (e) {
    console.error('đếm lượt thích để phát lỗi', postId, e);
  } finally {
    if (trangThai.get(postId) === 'dem-lai') {
      trangThai.set(postId, 'cho');
      setTimeout(() =&gt; void demVaPhat(postId), GOP_MS);
    } else trangThai.delete(postId);
  }
}`;

const DUA_THICH_GOP = `vào phòng: {"ok":true}
lượt 1 (40 × PUT): nhận 1 sự kiện, cuối cùng = 40, CSDL = 40, 0 lần số đi NGƯỢC · dãy: 40
lượt 2 (40 × DELETE): nhận 1 sự kiện, cuối cùng = 0, CSDL = 0, 0 lần số đi NGƯỢC · dãy: 0
lượt 3 (40 × PUT): nhận 1 sự kiện, cuối cùng = 40, CSDL = 40, 0 lần số đi NGƯỢC · dãy: 40
(trước lượt 1, bài còn 40 lượt từ lần đo trước ⇒ 40 PUT lặp lại không sinh lượt nào mới — PUT idempotent)`;

const ROUTES = `apiRouter.put('/posts/:id/like', requireAuth, validateIdParam, putThich); // PUT/DELETE: idempotent, bấm lại không sinh lượt thứ hai
apiRouter.delete('/posts/:id/like', requireAuth, validateIdParam, deleteThich);`;

const DEM_THICH = `// Một bài ⇒ một lô một phần tử. Danh sách ⇒ một lô nhiều phần tử. Không bao giờ đếm TỪNG bài trong vòng lặp (N+1).
// Lượt thích đếm cùng kiểu (GROUP BY post_id trên chỉ mục likes_post_id_idx) + MỘT truy vấn "tôi đã thích bài nào trong lô này".
async function demThich(ids: string[], nguoiXem?: string) {
  if (ids.length === 0) return { dem: new Map&lt;string, number&gt;(), cuaToi: new Set&lt;string&gt;() };
  const [nhom, cuaToi] = await Promise.all([
    prisma.like.groupBy({ by: ['postId'], where: { postId: { in: ids } }, _count: { _all: true } }),
    nguoiXem
      ? prisma.like.findMany({ where: { userId: nguoiXem, postId: { in: ids } }, select: { postId: true } })
      : [],
  ]);
  return {
    dem: new Map(nhom.map((g) =&gt; [g.postId, g._count._all])),
    cuaToi: new Set(cuaToi.map((l) =&gt; l.postId)),
  };
}

async function raDsBai(ds: DongBai[], nguoiXem?: string) {
  const ids = ds.map((b) =&gt; b.id);
  const [dem, thich] = await Promise.all([demBinhLuan(ids), demThich(ids, nguoiXem)]);
  return ds.map((b) =&gt; raBai(b, dem.get(b.id) ?? 0, thich.dem.get(b.id) ?? 0, thich.cuaToi.has(b.id)));
}
const raMotBai = async (b: DongBai, nguoiXem?: string) =&gt; (await raDsBai([b], nguoiXem))[0]!;`;

const SOCKET_WEB = `import { io, type Socket } from 'socket.io-client';
import type { SuKienKhach, SuKienMayChu } from '../../../api/src/realtime/hop-dong';
import { layToken } from '../api/client';

// MỘT socket cho cả tab (không phải một socket mỗi component): mở 5 trang là vẫn 1 kết nối.
// Không truyền URL ⇒ nối về CHÍNH origin của trang (localhost:41811 khi dev, tên miền thật khi production).
// auth là HÀM: Socket.IO gọi nó MỖI LẦN bắt tay (kể cả tự nối lại) ⇒ luôn gửi token MỚI NHẤT trong bộ nhớ.
// Token đi trong gói bắt tay, không trong URL (URL nằm trong log của proxy/Nginx) và không trong cookie (CSWSH).
export const socket: Socket&lt;SuKienMayChu, SuKienKhach&gt; = io({
  autoConnect: false,
  auth: (cb) =&gt; {
    const token = layToken();
    cb(token ? { token } : {});
  },
});`;

const AUTH_NOI = `  // Realtime theo DANH TÍNH: biết là khách hay ai rồi mới nối; đổi danh tính (đăng nhập/đăng xuất) ⇒ bắt tay LẠI
  // để máy chủ thấy token mới (danh tính của socket chốt lúc bắt tay, bài 7.2). Đang kiểm phiên thì chưa nối.
  const danhTinh = tt.kieu === 'da-dang-nhap' ? tt.user.id : tt.kieu;
  useEffect(() =&gt; {
    if (danhTinh === 'dang-kiem') return;
    socket.connect();
    return () =&gt; {
      socket.disconnect();
    };
  }, [danhTinh]);`;

const USE_BAI_SONG = `import { useEffect, useRef } from 'react';
import type { SuKienMayChu } from '../../../api/src/realtime/hop-dong';
import { socket } from './socket';

type XuLy = {
  [K in 'binh-luan:moi' | 'binh-luan:xoa' | 'luot-thich']?: SuKienMayChu[K];
};

// Nghe sự kiện realtime của MỘT bài: vào phòng khi mở trang, rời phòng khi đóng.
// Vào lại MỖI LẦN 'connect' — phòng thuộc về một socket ở máy chủ; nối lại là socket MỚI, phòng cũ mất (bài 7.3).
export function useBaiSong(postId: string, xuLy: XuLy) {
  // Giữ hàm xử lý mới nhất trong ref: component render lại (hàm mới) không làm effect gỡ/gắn lại listener và vào/rời phòng.
  const ref = useRef(xuLy);
  useEffect(() =&gt; {
    ref.current = xuLy;
  });

  useEffect(() =&gt; {
    const vao = () =&gt;
      socket.emit('bai:xem', postId, (kq) =&gt; {
        if (!kq.ok) console.warn(\`không vào được phòng bài \${postId}: \${kq.code}\`);
      });
    // Sự kiện của bài KHÁC (socket đang xem vài bài) ⇒ bỏ qua
    const moi: SuKienMayChu['binh-luan:moi'] = (d) =&gt;
      d.postId === postId &amp;&amp; ref.current['binh-luan:moi']?.(d);
    const xoa: SuKienMayChu['binh-luan:xoa'] = (d) =&gt;
      d.postId === postId &amp;&amp; ref.current['binh-luan:xoa']?.(d);
    const thich: SuKienMayChu['luot-thich'] = (d) =&gt; d.postId === postId &amp;&amp; ref.current['luot-thich']?.(d);
    socket.on('connect', vao);
    socket.on('binh-luan:moi', moi);
    socket.on('binh-luan:xoa', xoa);
    socket.on('luot-thich', thich);
    if (socket.connected) vao();
    return () =&gt; {
      socket.off('connect', vao);
      socket.off('binh-luan:moi', moi);
      socket.off('binh-luan:xoa', xoa);
      socket.off('luot-thich', thich);
      if (socket.connected) socket.emit('bai:roi', postId);
    };
  }, [postId]);
}`;

const DEM_NGAY_THO = `// THỬ (bài 7.2): mỗi đường tự cộng số đếm
useBaiSong(id, {
  'binh-luan:moi': ({ binhLuan }) =&gt; {
    bl.setItems((cu) =&gt; (cu.some((x) =&gt; x.id === binhLuan.id) ? cu : [...cu, binhLuan]));
    setBai((b) =&gt; b &amp;&amp; { ...b, commentCount: b.commentCount + 1 });
  },
  'luot-thich': ({ likeCount }) =&gt; setBai((b) =&gt; b &amp;&amp; { ...b, likeCount }),
});
// … và FormBinhLuan khiXong (từ Chương 6) cũng cộng:
khiXong={(moi) =&gt; {
  bl.setItems((cu) =&gt; (cu.some((x) =&gt; x.id === moi.id) ? cu : [...cu, moi]));
  setBai((b) =&gt; b &amp;&amp; { ...b, commentCount: b.commentCount + 1 });
}}`;

const HAI_NGUOI_V1 = `[ 2104 ms] trước: An thấy "Bình luận (23)" ♥0 · Bình thấy "Bình luận (23)" ♥0
[ 2216 ms] bình luận 1: Bình thấy sau 40 ms (tính từ lúc An bấm Gửi)
[ 2621 ms]   An thấy bình luận này 1 lần
[ 2723 ms] bình luận 2: Bình thấy sau 33 ms (tính từ lúc An bấm Gửi)
[ 3126 ms]   An thấy bình luận này 1 lần
[ 3221 ms] bình luận 3: Bình thấy sau 34 ms (tính từ lúc An bấm Gửi)
[ 3624 ms]   An thấy bình luận này 1 lần
[ 3776 ms] An bấm Thích: số ở trang Bình đổi sau 152 ms
[ 4286 ms] sau: An thấy "Bình luận (29)" ♥1 · Bình thấy "Bình luận (26)" ♥1
[ 4604 ms] F5 cả hai: An thấy "Bình luận (26)" ♥1 · Bình thấy "Bình luận (26)" ♥1`;

const BAI_VIET = `export default function BaiViet() {
  const { id = '' } = useParams();
  const auth = useAuth();
  // Bài trả KHÁC NHAU theo người xem (likedByMe, bài nháp của chính mình) ⇒ CHỜ biết là ai rồi mới tải.
  // Bản đầu tải ngay: sau F5, GET bài xong TRƯỚC khi refresh khôi phục phiên ⇒ likedByMe = false dù đã thích,
  // bấm "bỏ thích" lại gửi PUT (bài 7.2 đo trong log API). Đổi danh tính (đăng nhập/xuất) ⇒ key đổi ⇒ tải lại sạch.
  if (auth.kieu === 'dang-kiem') return &lt;p aria-busy="true"&gt;Đang tải…&lt;/p&gt;;
  const ai = auth.kieu === 'da-dang-nhap' ? auth.user.id : 'khach';
  return &lt;ChiTiet key={\`\${id}:\${ai}\`} id={id} /&gt;;
}

function ChiTiet({ id }: { id: string }) {
  const [bai, setBai] = useState&lt;Bai | null&gt;(null);
  const [loi, setLoi] = useState&lt;ApiError | null&gt;(null);

  // Rời trang trước khi bài về ⇒ huỷ request (không setState lên component đã gỡ, không tốn băng thông).
  useEffect(() =&gt; {
    const ac = new AbortController();
    api&lt;Bai&gt;(\`/posts/\${id}\`, { signal: ac.signal })
      .then(setBai)
      .catch((e) =&gt; !ac.signal.aborted &amp;&amp; setLoi(e));
    return () =&gt; ac.abort();
  }, [id]);

  const bl = useTrang&lt;BinhLuan&gt;(\`/posts/\${id}/comments\`, 20);

  // MỘT bình luận mới tới bằng HAI đường: phản hồi HTTP của chính mình VÀ sự kiện socket (máy chủ phát cho cả phòng,
  // kể cả người gửi). Bản đầu mỗi đường tự cộng số đếm ⇒ người gửi thấy "Bình luận (29)" khi thật là 26 (bài 7.2 đo).
  // Một chỗ duy nhất, gộp theo id — đường nào tới trước thì tính, đường tới sau bỏ qua.
  const daThay = useRef(new Set&lt;string&gt;());
  const { setItems, trangThai } = bl;
  function themBinhLuan(moi: BinhLuan) {
    if (daThay.current.has(moi.id)) return;
    daThay.current.add(moi.id);
    setBai((b) =&gt; b &amp;&amp; { ...b, commentCount: b.commentCount + 1 });
    // Danh sách xếp CŨ → MỚI. Chưa tải hết trang thì bình luận mới thuộc về CUỐI danh sách thật — nối vào bây giờ là
    // chen lên trước những trang cũ chưa tải. Để nó tới theo "Xem thêm" (useTrang gộp theo id, không trùng).
    if (trangThai === 'het') setItems((cu) =&gt; (cu.some((x) =&gt; x.id === moi.id) ? cu : [...cu, moi]));
  }

  useBaiSong(id, {
    'binh-luan:moi': ({ binhLuan }) =&gt; themBinhLuan(binhLuan),
    'luot-thich': ({ likeCount }) =&gt; setBai((b) =&gt; b &amp;&amp; { ...b, likeCount }),
  });

  if (loi) return &lt;HopLoi loi={loi} /&gt;;
  if (!bai) return &lt;p aria-busy="true"&gt;Đang tải…&lt;/p&gt;;`;

const LIKED_DUA = `--- log API khi An (đã thích bài) bấm F5 trên trang bài viết rồi bấm nút ♥ để BỎ thích (bản chưa chờ danh tính)
15:41:13.509Z GET  /api/posts/01a20e25-…-12726ca16e31        200 33.4ms   ← tải bài KHÔNG có token: likedByMe = false
15:41:13.523Z POST /api/auth/refresh                          200 36.1ms   ← phiên khôi phục xong SAU đó 14 ms
15:41:13.609Z GET  /api/posts/01a20e25-…-12726ca16e31        200 16.6ms
15:41:13.628Z POST /api/auth/refresh                          200 24.8ms
15:41:13.774Z PUT  /api/posts/01a20e25-…-12726ca16e31/like   200 6.4ms    ← nút tưởng "chưa thích" ⇒ gửi PUT thay vì DELETE
$ psql -c "select u.email from likes l join users u on u.id = l.user_id where l.post_id = '01a20e25-…-12726ca16e31'"
an@chiase.dev                                                              ← vẫn thích; bấm "bỏ thích" không có tác dụng`;

const HAI_NGUOI = `[ 2279 ms] trước: An thấy "Bình luận (0)" ♥0 · Bình thấy "Bình luận (0)" ♥0
[ 2379 ms] bình luận 1: Bình thấy sau 35 ms (tính từ lúc An bấm Gửi)
[ 2783 ms]   An thấy bình luận này 1 lần
[ 2867 ms] bình luận 2: Bình thấy sau 31 ms (tính từ lúc An bấm Gửi)
[ 3270 ms]   An thấy bình luận này 1 lần
[ 3367 ms] bình luận 3: Bình thấy sau 31 ms (tính từ lúc An bấm Gửi)
[ 3770 ms]   An thấy bình luận này 1 lần
[ 3923 ms] An bấm Thích: số ở trang Bình đổi sau 153 ms
[ 4437 ms] sau: An thấy "Bình luận (3)" ♥1 · Bình thấy "Bình luận (3)" ♥1
[ 4811 ms] F5 cả hai: An thấy "Bình luận (3)" ♥1 · Bình thấy "Bình luận (3)" ♥1`;

const NHIEU_TRANG = `[ 2253 ms] trước: An thấy "Bình luận (29)" ♥1 · Bình thấy "Bình luận (29)" ♥1
[ 7326 ms] bình luận 1: Bình KHÔNG thấy sau 5 s
[ 7730 ms]   An thấy bình luận này 0 lần
[ 7888 ms] An bấm Thích: số ở trang Bình đổi sau 158 ms
[ 8403 ms] sau: An thấy "Bình luận (30)" ♥0 · Bình thấy "Bình luận (30)" ♥0
[ 8757 ms] F5 cả hai: An thấy "Bình luận (30)" ♥0 · Bình thấy "Bình luận (30)" ♥0`;


const MERMAID = `sequenceDiagram
  participant B as Tab Bình
  participant S as API (Socket.IO)
  participant D as PostgreSQL
  B->>S: bắt tay { auth: { token } }
  S-->>B: 40 (đã nối — userId hoặc khách)
  B->>S: bai:xem(postId), chờ ack
  S->>D: bài này Bình xem được không?
  S-->>B: ack { ok: true } — đã vào phòng bai:postId
  Note over S: An đăng bình luận ⇒ ghi CSDL xong ⇒ bao()
  S-->>B: binh-luan:moi { postId, binhLuan }`;

const THE = [
  lienKet({ khoa: 'socket-io', bai: 'io-3-1-room', title: 'Socket.IO 3.1 — Room: abstraction bạn THẬT SỰ cần', sub: 'join, to(), except() — và vì sao không cần namespace cho bài toán này.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-1-4-auth', title: 'Socket.IO 1.4 — Xác thực: middleware chạy TRƯỚC connection', sub: 'io.use, handshake.auth, lỗi connect_error mang data.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-3-xac-thuc-phan-quyen-socket', title: 'Node.js 11.3 — Xác thực một lần, phân quyền mọi lần', sub: 'Danh tính chốt lúc bắt tay, quyền kiểm mỗi sự kiện.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-4-3-multi-tab', title: 'Socket.IO 4.3 — Nhiều tab: một user, nhiều socket', sub: 'Vì sao người gửi cũng nhận lại sự kiện của chính mình.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-6-3-exactly-once', title: 'Socket.IO 6.3 — Exactly-once: chỉ có với lớp chống trùng', sub: 'Gộp theo id ở client chính là lớp chống trùng nhỏ nhất.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'Snyk Security Labs — Gitpod remote code execution 0-day vulnerability via WebSockets (Elliot Ward, 27/02/2023)', 'snyk.io/blog', 'https://snyk.io/blog/gitpod-remote-code-execution-vulnerability-websockets/'),
  nguon('🛡️', 'PortSwigger Web Security Academy — Cross-site WebSocket hijacking', 'portswigger.net', 'https://portswigger.net/web-security/websockets/cross-site-websocket-hijacking'),
  nguon('🔌', 'Socket.IO — Rooms', 'socket.io/docs/v4', 'https://socket.io/docs/v4/rooms/'),
  nguon('🔌', 'Socket.IO — Middlewares (io.use, connect_error)', 'socket.io/docs/v4', 'https://socket.io/docs/v4/middlewares/'),
  nguon('🔌', 'Socket.IO — Handling CORS (và allowRequest)', 'socket.io/docs/v4', 'https://socket.io/docs/v4/handling-cors/'),
].join('\n');

export default {
  title: '7.2 — Live comment and like updates|||7.2 — Cập nhật bình luận và lượt thích tức thời',
  slug: 'fp-7-2-cap-nhat-song',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Từ "phát cho tất cả" sang phòng theo bài, rồi khoá từng cửa đã đo được là hở: một socket vào một triệu phòng (+345 MB RAM API), trang ở origin lạ mở WebSocket và vào phòng (CORS không chặn WebSocket — vụ Gitpod 2023), vào phòng bài nháp của người khác. Thêm lượt thích (bảng likes, PUT/DELETE idempotent) và đo cuộc đua 40 người bấm cùng lúc làm số đi ngược ⇒ phát gộp số tuyệt đối. Phía web: một hook nghe theo bài, gộp bình luận theo id (bản đầu người gửi thấy 29 thay vì 26), và vì sao trang bài phải chờ biết danh tính rồi mới tải.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Light realtime</span>
<h2>Rooms, then lock every door we can measure</h2>
<p class="lead">Lesson 7.1 sent every new comment to every open tab. It works on a laptop and fails both ways at scale: everyone pays for everyone's events, and anyone can listen to anything. This lesson gives each post its own room, decides <em>who</em> may enter it, adds likes with a race we can actually watch, and makes the React page show each event exactly once with correct counts.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Broadcast to everyone: what one tab receives</h3>
<p>A socket watches post …0a97. Bình comments on three <em>other</em> posts:</p>
<div class="out">${IO_EMIT}</div>
<p>Every tab receives every comment on the site, 254 bytes each, and throws most of them away. With 200 tabs and 10 comments per second, that is 2,000 messages per second sent so that almost all can be ignored. Socket.IO's answer is <strong>rooms</strong>: a name the server associates with a set of sockets. The client asks to join <code>bai:&lt;postId&gt;</code>; the server emits with <code>io.to('bai:&lt;postId&gt;')</code>.</p>

<h3>2. Joining a room is an API call — treat it like one</h3>
<p>The obvious first version simply joins whatever the client asks for:</p>
<pre><code class="language-ts">${VAO_NGAY_THO}</code></pre>
<p>A room costs memory on the server. One guest socket, a loop of random ids:</p>
<div class="out">${LU_PHONG}</div>
<p>One million rooms in 16 seconds, +345 MB in the API process, from a single connection that never logged in. Ten such tabs and the API is killed by the out-of-memory killer. The client is untrusted input, so the join handler gets the same treatment as an HTTP route: validate the type, check permission, cap the count. Our first fix — max 10 rooms per socket and a database check that the post exists and is visible — left a different hole:</p>
<div class="out">${LU_PHONG_SAU}</div>
<p>The first line: random uuids never enter any room, so the room cap never triggers — and each one is a database query. 50,000 queries from one socket. Hence the second line: a rate limit <em>per socket</em> (more than 20 joins in 10 seconds ⇒ disconnect) that kicks in after 22 ms. The cheap checks run before the expensive one.</p>

<h3>3. WebSocket ignores CORS — so check Origin yourself</h3>
<p>A test page on another origin (<code>http://127.0.0.1:41818</code>) opens a raw WebSocket to the API, speaks the Socket.IO protocol by hand, and joins a room:</p>
<div class="out">${CSWSH_TRUOC}</div>
<p>Polling (an ordinary <code>fetch</code>) was blocked by CORS. The WebSocket was not: CORS does not apply to WebSocket handshakes. The page connected and joined (<code>430[{"ok":true}]</code>). For ChiaSe this is harmless <em>only because</em> identity comes from a token in the handshake payload, which another site does not have. If we had authenticated sockets with the refresh cookie, the browser would have attached the victim's cookie and the attacker's page would be connected <em>as the victim</em> — that attack is called Cross-Site WebSocket Hijacking. Two layers of defence: never authenticate WebSockets with cookies alone, and check the <code>Origin</code> header, which browsers always send and page JavaScript cannot forge:</p>
<div class="out">${CSWSH_SAU}</div>

<h3>4. The realtime module, complete</h3>
<pre><code class="language-ts">${REALTIME}</code></pre>
<p>Authentication happens <strong>once</strong>, in <code>io.use</code>, before the connection exists. No token means guest (public posts are public). A bad token is refused <em>with a code</em>, so the client can tell "expired" (refresh and retry) from "invalid" (give up). Authorization happens <strong>on every join</strong>, with the same rule as <code>GET /posts/:id</code>: someone else's draft does not exist. Measured from Node:</p>
<div class="out">${BAT_TAY}</div>
<p>Note <code>s.active=false</code>: when the server refuses the handshake in middleware, the client stops reconnecting. That matters in 7.3, when a token expires during a reconnect.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — the identity is frozen at handshake.</strong> A socket authenticated at 10:00 is still "An" at 10:20, after the 15-minute access token expired, and after An logged out in another tab. For events derived from public data that is acceptable; for private data, re-check permission per event, and disconnect sockets on logout (the web app in this lesson reconnects whenever identity changes).</p></div>

<h3>5. Likes: a table, two idempotent verbs</h3>
<p>The schema from Chapter 1 already had a <code>likes</code> junction table. Migration and model:</p>
<pre><code class="language-prisma">${LIKE_SCHEMA}</code></pre>
<pre><code class="language-sql">${LIKE_SQL}</code></pre>
<p>Routes use <code>PUT</code> ("make it liked") and <code>DELETE</code> ("make it not liked") rather than a toggle: pressing twice, a network retry, two tabs pressing at once — the result is the same. A toggle endpoint turns each of those into a bug.</p>
<pre><code class="language-ts">${ROUTES}</code></pre>
<p>Post responses gain <code>likeCount</code> and <code>likedByMe</code>, counted per batch like comments in 5.1 (one <code>GROUP BY</code> plus one "which of these did I like" query — never per post):</p>
<pre><code class="language-ts">${DEM_THICH}</code></pre>

<h3>6. Forty people press Like at the same moment</h3>
<p>The first service counted and emitted right after each write:</p>
<pre><code class="language-ts">${THICH_NGAY_THO}</code></pre>
<p>Forty test users, one socket in the room recording every <code>luot-thich</code> event:</p>
<div class="out">${DUA_THICH}</div>
<p>The final number was right, but along the way the count went <em>backwards</em> (40 → 35): requests finish their counts in one order and their emits in another. Forty events for one burst of clicks is also forty re-renders on every viewer. The fix coalesces per post: at most one count-and-emit every 100 ms, and never two counts of the same post in flight, so whatever is emitted last was read after the last write:</p>
<pre><code class="language-ts">${LIKE_SVC}</code></pre>
<div class="out">${DUA_THICH_GOP}</div>
<p>We send the absolute count, never "+1": a client that missed one event is corrected by the next one. The coalescing state lives in one process's memory — with several API instances (7.3) each instance coalesces its own.</p>

<h3>7. The web side: one hook per post</h3>
<p>The socket now carries the in-memory access token at handshake — read through a function, so every reconnect sends the newest token. It goes in the handshake payload, not the URL (URLs end up in proxy logs) and not a cookie (section 3):</p>
<pre><code class="language-ts">${SOCKET_WEB}</code></pre>
<p>The auth provider connects once it knows who the user is, and reconnects when identity changes, so the server always sees the current token:</p>
<pre><code class="language-tsx">${AUTH_NOI}</code></pre>
<p>A hook joins the post's room, listens, and leaves on unmount. It joins again on every <code>connect</code>: rooms belong to a socket on the server, and a reconnect is a new socket.</p>
<pre><code class="language-ts">${USE_BAI_SONG}</code></pre>

<h3>8. The same comment arrives twice</h3>
<p>The server emits to the whole room — including the author's own tab, which also gets the comment from its HTTP response. The first version let each path add to the counter:</p>
<pre><code class="language-tsx">${DEM_NGAY_THO}</code></pre>
<p>Two real browsers (An and Bình), An comments three times:</p>
<div class="out">${HAI_NGUOI_V1}</div>
<p>Bình saw each comment in about 35 ms, the list de-duplicated by id — but An's counter says 29 while the truth is 26: every comment counted twice on the sender's page. Fixing it means one function for both paths, keyed by id:</p>
<pre><code class="language-tsx">${BAI_VIET}</code></pre>
<p>That listing also fixes two bugs measured on the way. The comment list is oldest-first; Chapter 6 put your own new comment at the <em>top</em>, and appending a new one while older pages are not yet loaded would put it in the middle — so it is appended only when the whole list is loaded. And the page now waits until it knows who is viewing, because the post's response depends on the viewer:</p>
<div class="out">${LIKED_DUA}</div>
<p>After the fixes, on a short thread and on a thread with more than one page of comments:</p>
<div class="out">${HAI_NGUOI}</div>
<div class="out">${NHIEU_TRANG}</div>
<p>On the long thread the counter is right on both pages, and the new comment is not appended in the middle; it appears when the reader scrolls to it with "Show more". Telling the author "your comment was added at the end" is a good small exercise.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">handshake</span><span class="lz-d">token in auth, Origin checked, refusal with a code</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">join</span><span class="lz-d">validate → rate-limit → cap → authorize → join</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">write</span><span class="lz-d">INSERT, then bao() to the post's room</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">likes</span><span class="lz-d">PUT/DELETE idempotent, coalesced absolute count</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">client</span><span class="lz-d">one socket per tab, one hook per post</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">de-dupe</span><span class="lz-d">one function per id for HTTP + event</span></div>
</div>

<h3>🕵️ Hacker's corner — Gitpod (2023): a WebSocket that trusted the cookie</h3>
<p>In February 2023, Elliot Ward of Snyk Security Labs reported that Gitpod, a cloud development environment, authenticated its WebSocket API with the user's session cookie and did not check the <code>Origin</code> of the handshake. A page on another site could open that WebSocket from the victim's browser, the browser attached the cookie, and the attacker's script could call the API as the victim — Snyk chained it with a SameSite cookie bypass into full account takeover and code execution in the victim's workspaces. Gitpod fixed the SaaS version on 22/02/2023; CVE-2023-0957 was assigned (Snyk blog, 27/02/2023). The same two lines would have stopped it: identity from a token the other site cannot read, and an <code>Origin</code> check at the handshake.</p>

<h3>Everyday analogy</h3>
<p>A building with one loudspeaker shouts every parcel delivery to all floors; with rooms, the receptionist phones only the floor that has a parcel. But anyone may ask to be put through to any floor — so the receptionist checks the badge (handshake), checks the floor list for that badge (join), and hangs up on someone requesting a thousand floors a second.</p>

<h3>On the job</h3>
<p>In code review, read every <code>socket.on(…)</code> handler as if it were a public HTTP route: what does the client control, what is validated, which database call can it trigger, how often. Security testers for outsourcing projects routinely open the browser's WebSocket tab and replay frames with modified ids; a room join without a permission check is a standard finding in their reports.</p>

${spring(false, 'With Spring WebSocket + STOMP, the same three checks live in different places: authenticate on <code>CONNECT</code> in a <code>ChannelInterceptor</code> (read the JWT from the STOMP header, not a cookie), authorize each <code>SUBSCRIBE</code> to <code>/topic/posts/{id}</code> with the same rule as the REST controller, and restrict origins with <code>setAllowedOriginPatterns</code>. The Spring course covers the JWT filter and method-level authorization that you would reuse.', [
  ['sb-9-4-jwt-filter', 'Spring Boot 9.4 — Checking the JWT on every request'],
  ['sb-9-6-phan-quyen-role', 'Spring Boot 9.6 — Roles and method-level authorization'],
  ['sb-12-3-cors-spring', 'Spring Boot 12.3 — Configuring CORS correctly'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"How do you authenticate a WebSocket?"</strong> — At the handshake (Socket.IO middleware / STOMP CONNECT) with a token in the handshake payload; reject with a machine-readable code; never rely on cookies alone; check Origin.</li>
<li><strong>"Does CORS protect WebSocket?"</strong> — No. Browsers do not apply CORS to the upgrade; the server must check the Origin header (that is Cross-Site WebSocket Hijacking).</li>
<li><strong>"How do you send an update only to people viewing a post?"</strong> — Rooms per post; join after a permission check; emit to the room after the write.</li>
<li><strong>"The sender sees their own comment twice — how do you fix it?"</strong> — De-duplicate by id in one function used by both the HTTP response and the event; do not try to exclude the sender on the server, because the same user may have several tabs.</li>
<li><strong>"Why send likeCount instead of +1?"</strong> — Absolute values are idempotent and self-correcting after missed or reordered events.</li>
</ol>

<h3>🧪 Lab 7.2 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Switch from <code>io.emit</code> to rooms. Write the naive join first and run the room-flood script against it; record the API's RSS before and after.</li>
<li>Add uuid validation, the permission check, the room cap and the per-socket rate limit; run the flood again.</li>
<li>Serve a one-file HTML page from another port that opens a raw WebSocket to your API and joins a room. Then add <code>allowRequest</code> and show the handshake failing.</li>
<li>Add the <code>likes</code> table, <code>PUT</code>/<code>DELETE /posts/:id/like</code>, <code>likeCount</code>/<code>likedByMe</code>. Register 40 users and like concurrently; record the sequence of counts before and after coalescing.</li>
<li>Open two browsers as two users. Reproduce the doubled counter, then fix it with one de-duplicating function.</li>
</ol>
<p><strong>Done when:</strong> a comment and a like from one browser appear in the other within a second, every counter matches the database after a reload, a draft's room refuses everyone but its author, and both the flood script and the foreign page fail.</p>
<p><strong>Rubric (10):</strong> rooms instead of broadcast (1) · join validated + authorized + capped + rate-limited, cheap checks first (2) · Origin check proven with a foreign page (2) · PUT/DELETE idempotent likes, batch counts (1) · coalesced absolute counts with before/after sequences (2) · one de-duplicating path on the web (1) · page waits for identity (1).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>0498e68</code> on <code>ch7/realtime</code>: <code>apps/api/src/realtime/index.ts</code>, <code>prisma/schema.prisma</code> + migration <code>20261124153747_likes</code>, <code>services/like.service.ts</code>, <code>controllers/like.controller.ts</code>, <code>routes/index.ts</code>, <code>services/post.service.ts</code> (<code>demThich</code>), <code>services/comment.service.ts</code> (exported <code>baiNhinThay</code>); web: <code>src/realtime/socket.ts</code>, <code>useBaiSong.ts</code>, <code>src/auth/AuthProvider.tsx</code>, <code>src/components/NutThich.tsx</code>, <code>src/pages/BaiViet.tsx</code>, <code>src/api/client.ts</code> (<code>layToken</code>, <code>PUT</code>). After <code>prisma migrate dev</code>, run <code>prisma generate</code> yourself — Prisma 7 no longer does it (Chapter 2).</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">room</span><span class="v">A server-side name for a set of sockets; emit to it instead of to everyone.</span></div>
  <div class="kv"><span class="k">handshake auth</span><span class="v">Identity checked once, before the connection exists (io.use).</span></div>
  <div class="kv"><span class="k">ack</span><span class="v">A callback the server calls to answer one client event (joined / refused).</span></div>
  <div class="kv"><span class="k">CSWSH</span><span class="v">Cross-Site WebSocket Hijacking: a foreign page opens a WebSocket that the browser authenticates with the victim's cookie.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">Repeating the request gives the same result (PUT/DELETE like).</span></div>
  <div class="kv"><span class="k">coalescing</span><span class="v">Turning a burst of changes into one update read after the last change.</span></div>
  <div class="kv"><span class="k">de-duplication</span><span class="v">Accepting an item once by id, whichever path delivers it first.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rooms per post; the server emits to the room after the write.</li>
<li>A join is an API call: validate, rate-limit, cap, then authorize — measured: one socket could add 345 MB or 50,000 queries.</li>
<li>WebSocket handshakes ignore CORS: authenticate with a token in the handshake and check Origin.</li>
<li>Likes are PUT/DELETE; counts are absolute and coalesced — 40 concurrent clicks became 1 correct event instead of 40 that went backwards.</li>
<li>On the client, one function de-duplicates by id; pages whose data depends on the viewer wait for the identity.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Realtime nhẹ</span>
<h2>Phòng theo bài, rồi khoá từng cửa đo được là hở</h2>
<p class="lead">Bài 7.1 gửi mọi bình luận mới tới mọi tab đang mở. Chạy được trên laptop, và hỏng theo cả hai hướng khi đông người: ai cũng trả tiền cho sự kiện của tất cả mọi người, và ai cũng nghe được mọi thứ. Bài này cho mỗi bài viết một phòng riêng, quyết định <em>ai</em> được vào, thêm lượt thích với một cuộc đua ta nhìn thấy được, và làm trang React hiện mỗi sự kiện đúng một lần với số đếm đúng.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Phát cho tất cả: một tab nhận được gì</h3>
<p>Một socket đang xem bài …0a97. Bình bình luận vào ba bài <em>khác</em>:</p>
<div class="out">${IO_EMIT}</div>
<p>Tab nào cũng nhận mọi bình luận của cả trang, mỗi cái 254 byte, rồi vứt gần hết. 200 tab và 10 bình luận mỗi giây là 2.000 tin nhắn mỗi giây gửi đi để gần như tất cả bị bỏ qua. Câu trả lời của Socket.IO là <strong>phòng</strong> (room): một cái tên máy chủ gắn với một tập socket. Client xin vào <code>bai:&lt;postId&gt;</code>; máy chủ phát bằng <code>io.to('bai:&lt;postId&gt;')</code>.</p>

<h3>2. Vào phòng là một lời gọi API — đối xử như vậy</h3>
<p>Bản đầu ai cũng viết: client xin phòng nào thì cho vào phòng đó:</p>
<pre><code class="language-ts">${VAO_NGAY_THO}</code></pre>
<p>Mỗi phòng tốn bộ nhớ máy chủ. Một socket khách, một vòng lặp id ngẫu nhiên:</p>
<div class="out">${LU_PHONG}</div>
<p>Một triệu phòng trong 16 giây, +345 MB trong tiến trình API, từ một kết nối chưa từng đăng nhập. Mười tab như vậy là API bị trình diệt-hết-bộ-nhớ của hệ điều hành giết. Client là dữ liệu không đáng tin, nên hàm vào phòng phải được đối xử như một route HTTP: kiểm kiểu, kiểm quyền, giới hạn số lượng. Lần sửa đầu — tối đa 10 phòng mỗi socket và kiểm CSDL xem bài có tồn tại và được xem không — để lộ một lỗ khác:</p>
<div class="out">${LU_PHONG_SAU}</div>
<p>Dòng đầu: uuid ngẫu nhiên không bao giờ vào được phòng nào, nên giới hạn số phòng không bao giờ kích hoạt — mà mỗi uuid là một truy vấn CSDL. 50.000 truy vấn từ một socket. Vì thế có dòng thứ hai: giới hạn tốc độ <em>theo socket</em> (quá 20 lần vào phòng trong 10 giây ⇒ ngắt), kích hoạt sau 22 ms. Phép kiểm rẻ chạy trước phép kiểm đắt.</p>

<h3>3. WebSocket bỏ qua CORS — nên tự kiểm Origin</h3>
<p>Một trang thử ở origin khác (<code>http://127.0.0.1:41818</code>) mở WebSocket trần tới API, tự nói giao thức Socket.IO bằng tay, rồi vào phòng:</p>
<div class="out">${CSWSH_TRUOC}</div>
<p>Polling (một <code>fetch</code> bình thường) bị CORS chặn. WebSocket thì không: CORS không áp cho cú bắt tay WebSocket. Trang lạ nối được và vào được phòng (<code>430[{"ok":true}]</code>). Với ChiaSe chuyện này vô hại <em>chỉ vì</em> danh tính đến từ token trong gói bắt tay, thứ mà site khác không có. Nếu ta xác thực socket bằng cookie refresh, trình duyệt sẽ tự gắn cookie của nạn nhân và trang của kẻ tấn công được nối <em>với tư cách nạn nhân</em> — kiểu tấn công đó gọi là Cross-Site WebSocket Hijacking (chiếm WebSocket liên trang). Hai lớp phòng thủ: không bao giờ xác thực WebSocket chỉ bằng cookie, và kiểm header <code>Origin</code> — trình duyệt luôn gửi và JavaScript của trang không giả được:</p>
<div class="out">${CSWSH_SAU}</div>

<h3>4. Module realtime, bản đầy đủ</h3>
<pre><code class="language-ts">${REALTIME}</code></pre>
<p>Xác thực <strong>một lần</strong>, trong <code>io.use</code>, trước khi kết nối tồn tại. Không token là khách (bài công khai thì công khai). Token hỏng bị từ chối <em>kèm mã</em>, để client phân biệt "hết hạn" (refresh rồi thử lại) với "không hợp lệ" (thôi). Phân quyền <strong>mỗi lần vào phòng</strong>, cùng luật với <code>GET /posts/:id</code>: bài nháp của người khác coi như không tồn tại. Đo từ Node:</p>
<div class="out">${BAT_TAY}</div>
<p>Để ý <code>s.active=false</code>: khi máy chủ từ chối bắt tay ở middleware, client thôi không tự nối lại nữa. Điều này quan trọng ở 7.3, khi token hết hạn đúng lúc nối lại.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — danh tính bị đóng băng lúc bắt tay.</strong> Socket xác thực lúc 10:00 vẫn là "An" lúc 10:20, sau khi access token 15 phút đã hết hạn, và sau khi An đăng xuất ở tab khác. Với sự kiện suy từ dữ liệu công khai thì chấp nhận được; với dữ liệu riêng tư, kiểm quyền lại ở từng sự kiện, và ngắt socket khi đăng xuất (web trong bài này nối lại mỗi khi danh tính đổi).</p></div>

<h3>5. Lượt thích: một bảng, hai động từ idempotent</h3>
<p>Lược đồ từ Chương 1 đã có bảng nối <code>likes</code>. Migration và model:</p>
<pre><code class="language-prisma">${LIKE_SCHEMA}</code></pre>
<pre><code class="language-sql">${LIKE_SQL}</code></pre>
<p>Route dùng <code>PUT</code> ("đặt thành đã thích") và <code>DELETE</code> ("đặt thành chưa thích") thay vì một nút bật/tắt: bấm hai lần, mạng gửi lại, hai tab cùng bấm — kết quả vẫn y nguyên. Một endpoint "toggle" biến mỗi tình huống đó thành một lỗi.</p>
<pre><code class="language-ts">${ROUTES}</code></pre>
<p>Phản hồi bài viết có thêm <code>likeCount</code> và <code>likedByMe</code>, đếm theo lô như bình luận ở bài 5.1 (một <code>GROUP BY</code> cộng một truy vấn "trong lô này tôi đã thích bài nào" — không bao giờ đếm từng bài):</p>
<pre><code class="language-ts">${DEM_THICH}</code></pre>

<h3>6. Bốn mươi người bấm Thích cùng một lúc</h3>
<p>Service bản đầu đếm và phát ngay sau mỗi lần ghi:</p>
<pre><code class="language-ts">${THICH_NGAY_THO}</code></pre>
<p>Bốn mươi người dùng thử, một socket trong phòng ghi lại mọi sự kiện <code>luot-thich</code>:</p>
<div class="out">${DUA_THICH}</div>
<p>Số cuối cùng đúng, nhưng dọc đường số đếm <em>đi ngược</em> (40 → 35): các request xong phép đếm theo một thứ tự, mà phát sự kiện theo thứ tự khác. Bốn mươi sự kiện cho một tràng bấm cũng là bốn mươi lần vẽ lại ở mọi người đang xem. Cách sửa là gộp theo bài: mỗi bài tối đa một lần đếm-và-phát mỗi 100 ms, và không bao giờ hai lần đếm cùng một bài chạy chồng nhau, nên số phát ra cuối cùng luôn được đọc sau lần ghi cuối cùng:</p>
<pre><code class="language-ts">${LIKE_SVC}</code></pre>
<div class="out">${DUA_THICH_GOP}</div>
<p>Ta gửi số tuyệt đối, không bao giờ "+1": client lỡ một sự kiện sẽ được sự kiện sau sửa lại. Trạng thái gộp nằm trong bộ nhớ của một tiến trình — có nhiều instance API (7.3) thì mỗi instance tự gộp phần của mình.</p>

<h3>7. Phía web: một hook cho mỗi bài</h3>
<p>Socket giờ mang access token trong bộ nhớ lúc bắt tay — đọc qua một hàm, nên mỗi lần nối lại đều gửi token mới nhất. Token nằm trong gói bắt tay, không trong URL (URL rơi vào log của proxy) và không trong cookie (mục 3):</p>
<pre><code class="language-ts">${SOCKET_WEB}</code></pre>
<p>AuthProvider nối khi đã biết người dùng là ai, và nối lại khi danh tính đổi, nên máy chủ luôn thấy token hiện tại:</p>
<pre><code class="language-tsx">${AUTH_NOI}</code></pre>
<p>Một hook vào phòng của bài, nghe, và rời phòng khi gỡ component. Nó vào lại ở mỗi lần <code>connect</code>: phòng thuộc về một socket ở máy chủ, nối lại là một socket mới.</p>
<pre><code class="language-ts">${USE_BAI_SONG}</code></pre>

<h3>8. Cùng một bình luận tới hai lần</h3>
<p>Máy chủ phát cho cả phòng — kể cả tab của chính người viết, tab đó còn nhận bình luận từ phản hồi HTTP. Bản đầu để mỗi đường tự cộng số đếm:</p>
<pre><code class="language-tsx">${DEM_NGAY_THO}</code></pre>
<p>Hai trình duyệt thật (An và Bình), An bình luận ba lần:</p>
<div class="out">${HAI_NGUOI_V1}</div>
<p>Bình thấy mỗi bình luận sau khoảng 35 ms, danh sách đã gộp theo id — nhưng bộ đếm của An ghi 29 trong khi thật là 26: mỗi bình luận bị đếm hai lần ở trang người gửi. Sửa là một hàm duy nhất cho cả hai đường, gộp theo id:</p>
<pre><code class="language-tsx">${BAI_VIET}</code></pre>
<p>Đoạn mã đó sửa luôn hai lỗi đo được dọc đường. Danh sách bình luận xếp cũ trước; Chương 6 đặt bình luận mới của chính mình lên <em>đầu</em>, còn nối bình luận mới khi các trang cũ hơn chưa tải sẽ đặt nó vào giữa — nên chỉ nối khi đã tải hết danh sách. Và trang giờ chờ biết ai đang xem, vì phản hồi bài viết phụ thuộc người xem:</p>
<div class="out">${LIKED_DUA}</div>
<p>Sau khi sửa, ở một bài ít bình luận và ở một bài có hơn một trang bình luận:</p>
<div class="out">${HAI_NGUOI}</div>
<div class="out">${NHIEU_TRANG}</div>
<p>Ở bài dài, số đếm đúng ở cả hai trang, và bình luận mới không bị chèn vào giữa; nó hiện khi người đọc cuộn tới bằng "Xem thêm bình luận". Báo cho người viết "bình luận của bạn đã được thêm ở cuối" là một bài tập nhỏ đáng làm.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">bắt tay</span><span class="lz-d">token trong auth, kiểm Origin, từ chối kèm mã</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">vào phòng</span><span class="lz-d">kiểm kiểu → giới hạn tốc độ → giới hạn số → phân quyền → vào</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">ghi</span><span class="lz-d">INSERT, rồi bao() vào phòng của bài</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">lượt thích</span><span class="lz-d">PUT/DELETE idempotent, số tuyệt đối có gộp</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">client</span><span class="lz-d">mỗi tab một socket, mỗi bài một hook</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">chống trùng</span><span class="lz-d">một hàm theo id cho HTTP + sự kiện</span></div>
</div>

<h3>🕵️ Góc hacker — Gitpod (2023): một WebSocket tin vào cookie</h3>
<p>Tháng 2/2023, Elliot Ward của Snyk Security Labs báo rằng Gitpod, một môi trường lập trình trên đám mây, xác thực API WebSocket của họ bằng cookie phiên của người dùng và không kiểm <code>Origin</code> của cú bắt tay. Một trang ở site khác mở được WebSocket đó từ trình duyệt của nạn nhân, trình duyệt tự gắn cookie, và script của kẻ tấn công gọi API với tư cách nạn nhân — Snyk nối nó với một cách vượt SameSite cookie để chiếm trọn tài khoản và chạy mã trong workspace của nạn nhân. Gitpod sửa bản SaaS ngày 22/02/2023; lỗ hổng được gán CVE-2023-0957 (blog Snyk, 27/02/2023). Đúng hai dòng sẽ chặn được: danh tính lấy từ token mà site khác không đọc được, và kiểm <code>Origin</code> lúc bắt tay.</p>

<h3>Liên hệ đời thường</h3>
<p>Toà nhà chỉ có một loa thì đọc mọi bưu kiện cho tất cả các tầng; có phòng thì lễ tân chỉ gọi đúng tầng có bưu kiện. Nhưng ai cũng có thể xin nối máy tới bất kỳ tầng nào — nên lễ tân kiểm thẻ ra vào (bắt tay), kiểm thẻ đó được lên tầng nào (vào phòng), và cúp máy với người xin nối một nghìn tầng mỗi giây.</p>

<h3>Tình huống đi làm thật</h3>
<p>Khi review mã, đọc mọi hàm <code>socket.on(…)</code> như một route HTTP công khai: client điều khiển được gì, kiểm cái gì, gây ra được truy vấn CSDL nào, bao nhiêu lần. Bên kiểm thử bảo mật của dự án outsourcing thường mở tab WebSocket của trình duyệt và gửi lại khung với id đã sửa; vào phòng không kiểm quyền là phát hiện quen thuộc trong báo cáo của họ.</p>

${spring(false, 'Với Spring WebSocket + STOMP, ba phép kiểm này nằm ở chỗ khác: xác thực lúc <code>CONNECT</code> trong một <code>ChannelInterceptor</code> (đọc JWT từ header STOMP, không từ cookie), phân quyền từng lần <code>SUBSCRIBE</code> vào <code>/topic/posts/{id}</code> bằng cùng luật với controller REST, và giới hạn origin bằng <code>setAllowedOriginPatterns</code>. Khoá Spring dạy filter JWT và phân quyền cấp phương thức mà bạn sẽ dùng lại.', [
  ['sb-9-4-jwt-filter', 'Spring Boot 9.4 — Kiểm JWT trên mọi request'],
  ['sb-9-6-phan-quyen-role', 'Spring Boot 9.6 — Vai trò và phân quyền cấp phương thức'],
  ['sb-12-3-cors-spring', 'Spring Boot 12.3 — Cấu hình CORS đúng cách'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Xác thực WebSocket thế nào?"</strong> — Lúc bắt tay (middleware Socket.IO / STOMP CONNECT) bằng token trong gói bắt tay; từ chối kèm mã máy đọc được; không bao giờ chỉ dựa vào cookie; kiểm Origin.</li>
<li><strong>"CORS có bảo vệ WebSocket không?"</strong> — Không. Trình duyệt không áp CORS cho cú nâng cấp; máy chủ phải tự kiểm header Origin (đó là Cross-Site WebSocket Hijacking).</li>
<li><strong>"Làm sao chỉ gửi cập nhật cho người đang xem một bài?"</strong> — Phòng theo bài; vào phòng sau khi kiểm quyền; phát vào phòng sau khi ghi.</li>
<li><strong>"Người gửi thấy bình luận của mình hai lần — sửa thế nào?"</strong> — Gộp theo id trong một hàm dùng chung cho phản hồi HTTP và sự kiện; đừng cố loại người gửi ở máy chủ, vì cùng một người có thể mở nhiều tab.</li>
<li><strong>"Sao gửi likeCount mà không gửi +1?"</strong> — Giá trị tuyệt đối là idempotent và tự sửa sai sau khi lỡ hoặc đảo thứ tự sự kiện.</li>
</ol>

<h3>🧪 Lab 7.2 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Đổi từ <code>io.emit</code> sang phòng. Viết bản vào phòng ngây thơ trước và chạy script lũ phòng vào nó; ghi RSS của API trước và sau.</li>
<li>Thêm kiểm uuid, kiểm quyền, giới hạn số phòng và giới hạn tốc độ theo socket; chạy lại lũ.</li>
<li>Phục vụ một trang HTML một tệp từ cổng khác, mở WebSocket trần tới API và vào phòng. Rồi thêm <code>allowRequest</code> và cho thấy cú bắt tay thất bại.</li>
<li>Thêm bảng <code>likes</code>, <code>PUT</code>/<code>DELETE /posts/:id/like</code>, <code>likeCount</code>/<code>likedByMe</code>. Đăng ký 40 người và thích đồng thời; ghi dãy số đếm trước và sau khi gộp.</li>
<li>Mở hai trình duyệt với hai người dùng. Tái hiện bộ đếm bị nhân đôi, rồi sửa bằng một hàm gộp duy nhất.</li>
</ol>
<p><strong>Xong khi:</strong> bình luận và lượt thích từ trình duyệt này hiện ở trình duyệt kia dưới một giây, mọi số đếm khớp CSDL sau khi tải lại, phòng của bài nháp từ chối mọi người trừ tác giả, và cả script lũ lẫn trang lạ đều thất bại.</p>
<p><strong>Thang điểm (10):</strong> phòng thay cho phát tất cả (1) · vào phòng có kiểm kiểu + quyền + giới hạn + tốc độ, kiểm rẻ trước (2) · kiểm Origin có chứng minh bằng trang lạ (2) · lượt thích PUT/DELETE idempotent, đếm theo lô (1) · số tuyệt đối có gộp, kèm dãy trước/sau (2) · một đường gộp ở web (1) · trang chờ danh tính (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>0498e68</code> trên <code>ch7/realtime</code>: <code>apps/api/src/realtime/index.ts</code>, <code>prisma/schema.prisma</code> + migration <code>20261124153747_likes</code>, <code>services/like.service.ts</code>, <code>controllers/like.controller.ts</code>, <code>routes/index.ts</code>, <code>services/post.service.ts</code> (<code>demThich</code>), <code>services/comment.service.ts</code> (export <code>baiNhinThay</code>); web: <code>src/realtime/socket.ts</code>, <code>useBaiSong.ts</code>, <code>src/auth/AuthProvider.tsx</code>, <code>src/components/NutThich.tsx</code>, <code>src/pages/BaiViet.tsx</code>, <code>src/api/client.ts</code> (<code>layToken</code>, <code>PUT</code>). Sau <code>prisma migrate dev</code> nhớ tự chạy <code>prisma generate</code> — Prisma 7 không tự làm nữa (Chương 2).</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">phòng (room)</span><span class="v">Tên phía máy chủ cho một tập socket; phát vào đó thay vì phát cho tất cả.</span></div>
  <div class="kv"><span class="k">xác thực bắt tay</span><span class="v">Danh tính kiểm một lần, trước khi kết nối tồn tại (io.use).</span></div>
  <div class="kv"><span class="k">ack</span><span class="v">Hàm gọi lại máy chủ dùng để trả lời một sự kiện của client (vào được / bị từ chối).</span></div>
  <div class="kv"><span class="k">CSWSH</span><span class="v">Cross-Site WebSocket Hijacking: trang lạ mở WebSocket mà trình duyệt xác thực bằng cookie của nạn nhân.</span></div>
  <div class="kv"><span class="k">idempotent</span><span class="v">Lặp lại request cho cùng kết quả (PUT/DELETE lượt thích).</span></div>
  <div class="kv"><span class="k">gộp (coalescing)</span><span class="v">Biến một tràng thay đổi thành một cập nhật đọc sau thay đổi cuối cùng.</span></div>
  <div class="kv"><span class="k">chống trùng</span><span class="v">Nhận một phần tử đúng một lần theo id, đường nào tới trước thì tính.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phòng theo bài; máy chủ phát vào phòng sau khi ghi.</li>
<li>Vào phòng là một lời gọi API: kiểm kiểu, giới hạn tốc độ, giới hạn số lượng, rồi mới phân quyền — đo được: một socket có thể thêm 345 MB hoặc 50.000 truy vấn.</li>
<li>Cú bắt tay WebSocket bỏ qua CORS: xác thực bằng token trong gói bắt tay và kiểm Origin.</li>
<li>Lượt thích là PUT/DELETE; số đếm tuyệt đối và được gộp — 40 lần bấm đồng thời thành 1 sự kiện đúng thay vì 40 sự kiện đi ngược.</li>
<li>Ở client, một hàm gộp theo id; trang có dữ liệu phụ thuộc người xem phải chờ biết danh tính.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
