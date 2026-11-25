/**
 * 7.3 — Trạng thái kết nối, tự nối lại, và ghi chú khi mở rộng (soạn 24/11/2026, agent fsp).
 * Output THẬT: Chrome 150 (playwright-core 1.65.1), socket.io(-client) 4.8.4, @socket.io/redis-adapter 8.3.0 + redis 6.4.0 (npm),
 * Redis 8.12.0 (container fsp-redis --memory 512m), API ChiaSe nhánh ch7/realtime commit 8260713.
 * Phát hiện thật 24/11: API khởi động lại (tsx watch) + An bình luận ngay khi /health 200 ⇒ tab Bình KHÔNG thấy 3/3 lần (socket nối lại
 * 1–5 s sau, sự kiện đã trôi qua) ⇒ vào lại phòng RỒI hỏi HTTP (batKip theo cursor cuối) ⇒ thấy 3/3 sau 2,3–4,3 s; token sống 5 s,
 * API khởi động lại ⇒ connect_error TOKEN_HET_HAN ⇒ socket.active=false, realtime chết hẳn mà thanh báo vẫn "đang thử nối lại"
 * ⇒ refresh (khoá gộp 6.2) rồi connect: thấy sau 18 ms; 2 instance không adapter ⇒ mỗi tab chỉ nhận bình luận ghi qua instance
 * của nó; polling sid sang instance khác ⇒ 400 {"code":1,"message":"Session ID unknown"}; Redis adapter ⇒ cả hai nhận cả hai;
 * Redis chết ⇒ /health vẫn 200, lùi về từng instance, log "Socket closed unexpectedly", Redis sống lại tự nối.
 * Nguồn (GET 200, 24/11/2026): socket.io docs (connection state recovery, delivery guarantees, using multiple nodes, redis adapter);
 * Slack Engineering — "Real-time Messaging" (Sameera Thangudu, 11/04/2023).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const KDL_V1 = `[ 1563 ms] trước: "Bình luận (3)", 3 dòng, thanh trạng thái: (không có)
[ 1594 ms] đã tắt pid 460723 (tắt API)
[ 4598 ms] lúc API tắt: thanh trạng thái: (không có)
[ 5946 ms] API đã lên lại
[ 6090 ms] An đã bình luận (201)
[16094 ms] Bình KHÔNG thấy bình luận sau 10 s
[16100 ms] sau: "Bình luận (3)", 3 dòng, thanh trạng thái: (không có)
[16128 ms] CSDL: 4 bình luận
---
[ 1455 ms] trước: "Bình luận (4)", 4 dòng, thanh trạng thái: (không có)
[ 1489 ms] đã tắt pid 2150622 (tắt API)
[ 4492 ms] lúc API tắt: thanh trạng thái: (không có)
[ 5526 ms] API đã lên lại
[ 5628 ms] An đã bình luận (201)
[15630 ms] Bình KHÔNG thấy bình luận sau 10 s
[15635 ms] sau: "Bình luận (4)", 4 dòng, thanh trạng thái: (không có)
[15664 ms] CSDL: 5 bình luận
---
[ 1557 ms] trước: "Bình luận (5)", 5 dòng, thanh trạng thái: (không có)
[ 1585 ms] đã tắt pid 2276730 (tắt API)
[ 4590 ms] lúc API tắt: thanh trạng thái: (không có)
[ 5998 ms] API đã lên lại
[ 6144 ms] An đã bình luận (201)
[16145 ms] Bình KHÔNG thấy bình luận sau 10 s
[16156 ms] sau: "Bình luận (5)", 5 dòng, thanh trạng thái: (không có)
[16189 ms] CSDL: 6 bình luận
---`;

const USE_TRANG = `  // BẮT KỊP (bài 7.3): sau khi mất kết nối realtime, phần tử mới có thể đã được thêm mà ta không nghe thấy.
  // Đã tải hết ⇒ tải lại trang cuối (từ cursor cuối còn giữ), gộp theo id: cái đã có bỏ qua, cái mới nối vào cuối.
  // Chưa tải hết ⇒ không cần làm gì: phần mới nằm ở cuối, "Xem thêm" sẽ tới.
  const batKip = useCallback(() =&gt; {
    if (trangThai === 'het') taiThem();
  }, [trangThai, taiThem]);

  return { items, setItems, trangThai, loi, taiThem, thuLai, batKip };`;

const USE_TRANG_CURSOR = `      const t = await api&lt;Trang&lt;T&gt;&gt;(\`\${duong}?\${q}\`, { signal: ac.signal });
      // Hết trang thì GIỮ cursor cũ (không đặt về null): batKip() tải lại từ trang cuối đã biết để lấy phần mới thêm.
      if (t.nextCursor) cursor.current = t.nextCursor;`;

const USE_BAI_SONG = `import { useEffect, useRef } from 'react';
import type { SuKienMayChu } from '../../../api/src/realtime/hop-dong';
import { socket } from './socket';

type XuLy = {
  [K in 'binh-luan:moi' | 'binh-luan:xoa' | 'luot-thich']?: SuKienMayChu[K];
} &amp; {
  // Gọi sau khi vào LẠI phòng (lần thứ hai trở đi): lúc mất kết nối có thể đã lỡ sự kiện ⇒ hỏi lại bằng HTTP.
  khiVaoLai?: () =&gt; void;
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
    let soLanVao = 0;
    // THỨ TỰ quan trọng: vào phòng TRƯỚC (chờ ack), RỒI mới hỏi lại bằng HTTP. Ngược lại thì bình luận đăng đúng lúc
    // giữa "hỏi xong" và "vào phòng" sẽ lỡ cả hai đường.
    const vao = () =&gt;
      socket.emit('bai:xem', postId, (kq) =&gt; {
        if (!kq.ok) return console.warn(\`không vào được phòng bài \${postId}: \${kq.code}\`);
        if (soLanVao++ &gt; 0) ref.current.khiVaoLai?.();
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

const BAI_VIET = `  // Mọi bình luận đã hiện (kể cả tải bằng trang / bắt kịp) đều "đã thấy" ⇒ không bao giờ cộng số đếm lần nữa.
  useEffect(() =&gt; {
    for (const x of bl.items) daThay.current.add(x.id);
  }, [bl.items]);

  useBaiSong(id, {
    'binh-luan:moi': ({ binhLuan }) =&gt; themBinhLuan(binhLuan),
    'luot-thich': ({ likeCount }) =&gt; setBai((b) =&gt; b &amp;&amp; { ...b, likeCount }),
    // Nối lại sau khi mất kết nối: số đếm + bình luận lỡ mất lấy lại bằng HTTP — nguồn sự thật là CSDL, không phải socket.
    khiVaoLai: () =&gt; {
      api&lt;Bai&gt;(\`/posts/\${id}\`)
        .then((b) =&gt; setBai(b))
        .catch(() =&gt; {});
      bl.batKip();
    },
  });`;

const USE_KET_NOI = `import { useSyncExternalStore } from 'react';
import { socket } from './socket';

export type KetNoi = 'chua-noi' | 'da-noi' | 'mat' | 'ngung';

// Trạng thái kết nối realtime cho giao diện. useSyncExternalStore: đọc một nguồn NGOÀI React (socket) mà không cần
// useState + useEffect (không render thừa, không lệch giữa các component).
let daTungNoi = false;
// 'ngung' = thư viện ĐÃ THÔI tự nối lại (máy chủ từ chối bắt tay) — đừng nói "đang thử nối lại" khi không ai thử cả.
const doc = (): KetNoi =&gt;
  socket.connected ? 'da-noi' : !daTungNoi ? 'chua-noi' : socket.active ? 'mat' : 'ngung';
function dangKy(bao: () =&gt; void) {
  const noi = () =&gt; {
    daTungNoi = true;
    bao();
  };
  socket.on('connect', noi);
  socket.on('disconnect', bao);
  socket.on('connect_error', bao);
  return () =&gt; {
    socket.off('connect', noi);
    socket.off('disconnect', bao);
    socket.off('connect_error', bao);
  };
}

export const useKetNoi = () =&gt; useSyncExternalStore(dangKy, doc);`;

const KHUNG = `      {/* Chỉ báo khi ĐÃ từng nối rồi mất — lúc mới mở trang đang nối thì không doạ người dùng */}
      {ketNoi === 'mat' &amp;&amp; (
        &lt;p className="ket-noi" role="status"&gt;
          Mất kết nối trực tiếp — đang thử nối lại. Trang vẫn dùng được; bình luận mới sẽ hiện khi nối lại.
        &lt;/p&gt;
      )}
      {ketNoi === 'ngung' &amp;&amp; (
        &lt;p className="ket-noi" role="status"&gt;
          Không nối lại được phần cập nhật trực tiếp.{' '}
          &lt;button onClick={() =&gt; location.reload()}&gt;Tải lại trang&lt;/button&gt;
        &lt;/p&gt;
      )}`;

const KDL_V2 = `[ 1640 ms] trước: "Bình luận (6)", 6 dòng, thanh trạng thái: (không có)
[ 1673 ms] đã tắt pid 2366635 (tắt API)
[ 4680 ms] lúc API tắt: thanh trạng thái: Mất kết nối trực tiếp — đang thử nối lại. Trang vẫn dùng được; bình luận mới sẽ hiện khi nối lại.
[ 6130 ms] API đã lên lại
[ 6288 ms] An đã bình luận (201)
[ 9098 ms] Bình thấy bình luận sau 2810 ms
[ 9105 ms] sau: "Bình luận (7)", 7 dòng, thanh trạng thái: (không có)
[ 9113 ms] CSDL: 7 bình luận
---
[ 1565 ms] trước: "Bình luận (7)", 7 dòng, thanh trạng thái: (không có)
[ 1594 ms] đã tắt pid 2824448 (tắt API)
[ 4601 ms] lúc API tắt: thanh trạng thái: Mất kết nối trực tiếp — đang thử nối lại. Trang vẫn dùng được; bình luận mới sẽ hiện khi nối lại.
[ 5894 ms] API đã lên lại
[ 6038 ms] An đã bình luận (201)
[10359 ms] Bình thấy bình luận sau 4321 ms
[10365 ms] sau: "Bình luận (8)", 8 dòng, thanh trạng thái: (không có)
[10376 ms] CSDL: 8 bình luận
---
[ 1603 ms] trước: "Bình luận (8)", 8 dòng, thanh trạng thái: (không có)
[ 1632 ms] đã tắt pid 2902573 (tắt API)
[ 4639 ms] lúc API tắt: thanh trạng thái: Mất kết nối trực tiếp — đang thử nối lại. Trang vẫn dùng được; bình luận mới sẽ hiện khi nối lại.
[ 5763 ms] API đã lên lại
[ 5917 ms] An đã bình luận (201)
[ 8222 ms] Bình thấy bình luận sau 2305 ms
[ 8229 ms] sau: "Bình luận (9)", 9 dòng, thanh trạng thái: (không có)
[ 8238 ms] CSDL: 9 bình luận
---`;

const TOKEN_V1 = `[  512 ms] → POST /api/auth/refresh
[  555 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[  949 ms] An đang xem bài, đợi 7 s cho access token hết hạn
[ 7979 ms] đã tắt pid 2988855 (tắt API)
[ 9067 ms] console.error: Failed to load resource: the server responded with a status of 502 (Bad Gateway)
[ 9433 ms] API đã lên lại
[23560 ms] An KHÔNG thấy bình luận của Bình sau 8 s
[23564 ms] thanh trạng thái: Mất kết nối trực tiếp — đang thử nối lại. Trang vẫn dùng được; bình luận mới sẽ hiện khi nối lại.
[43578 ms] 20 s sau nữa: VẪN báo mất kết nối`;

const SOCKET_LOI = `// Lỗi ở middleware bắt tay (io.use) KHÁC lỗi mạng: Socket.IO coi là "máy chủ từ chối" và NGỪNG tự nối lại (socket.active
// = false). Đo (bài 7.3): token hết hạn đúng lúc API khởi động lại ⇒ realtime chết hẳn, trong khi trang vẫn báo
// "đang thử nối lại". Nên: hết hạn ⇒ lấy token mới (dùng CHUNG khoá gộp refresh của bài 6.2) rồi tự nối lại.
// Refresh thất bại (phiên chết) ⇒ layToken() = null ⇒ nối lại với tư cách khách, vẫn xem được bài công khai.
let lanCuoi = 0;
socket.on('connect_error', async (err) =&gt; {
  if (socket.active) return; // lỗi mạng: thư viện tự thử lại với thời gian chờ tăng dần
  const code = (err as Error &amp; { data?: { code?: string } }).data?.code;
  // Chỉ xử lý HẾT HẠN. TOKEN_KHONG_HOP_LE mà nối lại với cùng token = vòng lặp vô hạn ⇒ để nguyên, ghi cảnh báo.
  // Chặn thêm: tối đa một lần mỗi 10 s (đồng hồ máy lệch ⇒ token mới cũng "hết hạn" ⇒ không quay vòng liên tục).
  if (code !== 'TOKEN_HET_HAN' || Date.now() - lanCuoi &lt; 10_000)
    return console.warn('realtime bị từ chối:', code);
  lanCuoi = Date.now();
  await lamMoiToken();
  socket.connect();
});`;

const TOKEN_V2 = `[  532 ms] → POST /api/auth/refresh
[  549 ms] console.error: Failed to load resource: the server responded with a status of 401 (Unauthorized)
[ 1050 ms] An đang xem bài, đợi 7 s cho access token hết hạn
[ 8081 ms] đã tắt pid 3222098 (tắt API)
[ 8869 ms] console.error: Failed to load resource: the server responded with a status of 502 (Bad Gateway)
[ 9478 ms] API đã lên lại
[11291 ms] → POST /api/auth/refresh
[15601 ms] An thấy bình luận của Bình sau 18 ms
[15604 ms] thanh trạng thái: (không có)
[35614 ms] 20 s sau nữa: đã nối`;

const HAI_INSTANCE = `tab X (nối 41815) nhận: ["gửi qua 41815"]
tab Y (nối 41819) nhận: ["gửi qua 41819"]`;

const STICKY = `$ curl 'http://localhost:41815/socket.io/?EIO=4&amp;transport=polling'   # bắt tay ở instance 1 ⇒ sid=SVsej68uqLwdCISdAAAD
$ curl -i 'http://localhost:41819/socket.io/?EIO=4&amp;transport=polling&amp;sid=SVsej68uqLwdCISdAAAD'   # lượt hỏi kế tiếp bị LB đưa sang instance 2
HTTP/1.1 400 Bad Request
{"code":1,"message":"Session ID unknown"}
$ curl -i 'http://localhost:41815/socket.io/?EIO=4&amp;transport=polling&amp;sid=SVsej68uqLwdCISdAAAD'   # đúng instance
(không in gì: instance 1 nhận ra sid và GIỮ request chờ dữ liệu — long-polling đúng nghĩa; curl --max-time 2 tự cắt)`;

const REDIS_MA = `  // NHIỀU INSTANCE (bài 7.3 đo): mặc định mỗi tiến trình chỉ biết socket CỦA NÓ ⇒ bình luận ghi ở instance 1 không tới
  // tab đang nối instance 2. Redis adapter: io.to(phòng).emit(...) được PUBLISH qua Redis, mọi instance nhận rồi phát
  // cho socket của mình. Một instance thì không cần — đừng thêm một dịch vụ phải vận hành khi chưa cần.
  if (config.redisUrl) {
    const pub = createClient({ url: config.redisUrl });
    const sub = pub.duplicate();
    for (const c of [pub, sub]) c.on('error', (e: Error) =&gt; console.error('Redis (realtime):', e.message));
    await Promise.all([pub.connect(), sub.connect()]);
    io.adapter(createAdapter(pub, sub));
    console.log('realtime: Redis adapter bật');
  }`;

const HAI_INSTANCE_REDIS = `tab X (nối 41815) nhận: ["gửi qua 41815","gửi qua 41819"]
tab Y (nối 41819) nhận: ["gửi qua 41815","gửi qua 41819"]
socket.io-response#/#V0kzyL#
socket.io-response#/#
socket.io-request#/#
socket.io-response#/#j9Z6f1#`;

const REDIS_CHET = `tab X (nối 41815) nhận: ["gửi qua 41815"]
tab Y (nối 41819) nhận: ["gửi qua 41819"]
      8 Redis (realtime): 
      4 Redis (realtime): Socket closed unexpectedly
      1 realtime: Redis adapter bật
GET /api/health khi Redis chết: 200
Redis sống lại: tab X (nối 41815) nhận: ["gửi qua 41815","gửi qua 41819"]
Redis sống lại: tab Y (nối 41819) nhận: ["gửi qua 41815","gửi qua 41819"]`;


const MERMAID = `stateDiagram-v2
  [*] --> chua_noi: mở trang
  chua_noi --> da_noi: bắt tay OK
  da_noi --> mat: mạng rớt / API khởi động lại
  mat --> da_noi: tự nối lại (1–5 s) + vào lại phòng + HỎI LẠI bằng HTTP
  mat --> ngung: máy chủ từ chối bắt tay
  ngung --> da_noi: TOKEN_HET_HAN ⇒ refresh ⇒ connect()
  ngung --> [*]: lỗi khác ⇒ mời tải lại trang`;

const MERMAID2 = `flowchart LR
  T1["Tab X"] --> LB["Load balancer"]
  T2["Tab Y"] --> LB
  LB --> I1["API instance 1"]
  LB --> I2["API instance 2"]
  I1 <-->|"PUBLISH / SUBSCRIBE"| R[("Redis")]
  I2 <--> R
  I1 --> DB[("PostgreSQL")]
  I2 --> DB`;

const THE = [
  lienKet({ khoa: 'socket-io', bai: 'io-1-3-reconnect', title: 'Socket.IO 1.3 — Reconnect: cái thật sự xảy ra và cái KHÔNG', sub: 'Thời gian chờ tăng dần, socket mới, phòng cũ mất.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-1-5-state', title: 'Socket.IO 1.5 — Trạng thái sống sót qua reconnect: ba pattern', sub: 'Hỏi lại bằng HTTP, connection state recovery, log sự kiện có số thứ tự.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-6-1-at-most-once', title: 'Socket.IO 6.1 — Mặc định là at-most-once', sub: 'Cái Socket.IO KHÔNG hứa — và vì sao CSDL mới là nguồn sự thật.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-2-3-sticky', title: 'Socket.IO 2.3 — Sticky sessions', sub: 'Vì sao một client phải về đúng một worker khi còn long-polling.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'socket-io', bai: 'io-5-1-vi-sao', title: 'Socket.IO 5.1 — Vì sao Redis adapter', sub: 'Broadcast xuyên worker; 5.3 đo khi Redis chết.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-11-4-scale-adapter-backpressure', title: 'Node.js 11.4 — Nhiều hơn một tiến trình: adapter, sticky session', sub: 'Cùng chủ đề, góc nhìn Node.js.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🔌', 'Socket.IO — Delivery guarantees (at most once theo mặc định)', 'socket.io/docs/v4', 'https://socket.io/docs/v4/delivery-guarantees'),
  nguon('🔌', 'Socket.IO — Connection state recovery', 'socket.io/docs/v4', 'https://socket.io/docs/v4/connection-state-recovery'),
  nguon('🔌', 'Socket.IO — Using multiple nodes (sticky session)', 'socket.io/docs/v4', 'https://socket.io/docs/v4/using-multiple-nodes/'),
  nguon('🔌', 'Socket.IO — Redis adapter', 'socket.io/docs/v4', 'https://socket.io/docs/v4/redis-adapter/'),
  nguon('💬', 'Slack Engineering — Real-time Messaging (Sameera Thangudu, 11/04/2023)', 'slack.engineering', 'https://slack.engineering/real-time-messaging/'),
].join('\n');

export default {
  title: '7.3 — Connection state, reconnects and scaling notes|||7.3 — Trạng thái kết nối, tự nối lại, và ghi chú khi mở rộng',
  slug: 'fp-7-3-ket-noi-that-bai',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Realtime hỏng theo những cách đo được: API khởi động lại (như mỗi lần deploy) và bình luận đăng lúc tab chưa kịp nối lại biến mất 3/3 lần; token hết hạn đúng lúc nối lại làm realtime chết hẳn trong khi giao diện vẫn báo "đang thử". Sửa bằng nguyên tắc "socket chỉ là chuông cửa, CSDL mới là sự thật": vào lại phòng rồi hỏi lại bằng HTTP, thanh trạng thái nói thật, tự refresh khi bắt tay báo hết hạn. Cuối bài chạy hai instance API: không adapter thì mỗi tab chỉ nghe nửa thế giới, sticky session, Redis adapter, và đo cả lúc Redis chết.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Light realtime</span>
<h2>The socket is a doorbell, not the mailbox</h2>
<p class="lead">Connections drop. Phones change networks, laptops sleep, and — the one you cause yourself — every deploy restarts the API. Socket.IO reconnects automatically, which hides the real question: what happened <em>while</em> you were disconnected? This lesson breaks realtime on purpose in three measured ways and fixes each with the same principle: the database is the truth, the socket only says "something changed".</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. A deploy, and a comment that vanishes</h3>
<p>Bình (a guest) has a post open. We stop the API, start it again (exactly what a deploy does), and the moment <code>/health</code> answers, An posts a comment through the API. Three runs:</p>
<div class="out">${KDL_V1}</div>
<p>Bình never sees it — not after 10 seconds, not ever, and the counter stays wrong until a reload. The socket <em>did</em> reconnect and rejoin the room (our hook rejoins on every <code>connect</code>), but it reconnected 1–5 seconds after the restart (the client waits <code>reconnectionDelay</code> 1 s, growing to 5 s, with random jitter so that thousands of tabs do not return at the same instant), and the event was emitted to an empty room. Socket.IO's default guarantee is <em>at most once</em>: an event emitted while you are not connected is simply not delivered (socket.io docs, "Delivery guarantees").</p>
<p>Also note the last line of each "before/after": no status bar. The user had no idea the page had stopped being live.</p>

<h3>2. Rejoin, then ask again over HTTP</h3>
<p>The fix is not a smarter socket; it is to treat every reconnect as "I may have missed things — ask the source of truth". Order matters: join the room <em>first</em> and wait for the ack, <em>then</em> fetch. Fetching first leaves a gap between "fetched" and "joined" where a comment would miss both paths.</p>
<pre><code class="language-ts">${USE_BAI_SONG}</code></pre>
<p>"Ask again" for the comment list means: re-load from the last known position. <code>useTrang</code> now keeps the last cursor instead of resetting it to null when the list ends, and a new <code>batKip</code> ("catch up") re-reads the last page — items already shown are dropped by id, new ones append:</p>
<pre><code class="language-ts">${USE_TRANG_CURSOR}</code></pre>
<pre><code class="language-ts">${USE_TRANG}</code></pre>
<p>The post page re-reads the post (counts) and catches up the list after every re-join; everything that has been displayed counts as "seen", so a late event for it can never add to the counter again:</p>
<pre><code class="language-tsx">${BAI_VIET}</code></pre>
<p>And the user deserves to know. A tiny store over the socket's events, read with <code>useSyncExternalStore</code> (an external source, no extra state or effects):</p>
<pre><code class="language-ts">${USE_KET_NOI}</code></pre>
<pre><code class="language-tsx">${KHUNG}</code></pre>
<p>The same three runs:</p>
<div class="out">${KDL_V2}</div>
<p>The bar appears while the API is down, the missed comment arrives 2.3–4.3 s after the restart (that is the reconnection back-off, not our code), and the counter matches the database. Socket.IO also offers <em>connection state recovery</em>, which replays missed events after a <em>short</em> disconnection — but the built-in adapter keeps them in the server's memory, so it cannot survive the restart we just did, and the Redis adapter of section 4 does not support it at all (socket.io docs). The HTTP catch-up works in every case.</p>

<h3>3. The token expired during the reconnect</h3>
<p>Access tokens live 15 minutes. A tab left open for an hour reconnects with an expired token. We ran the API with 5-second tokens: An logs in, opens a post, waits 7 s, the API restarts, then Bình comments:</p>
<div class="out">${TOKEN_V1}</div>
<p>Realtime died permanently — and the bar said "trying to reconnect" while nothing was trying. Remember 7.2: a refusal from handshake middleware sets <code>socket.active = false</code>, and the client stops retrying (it assumes the server meant it). Only the client knows how to fix an expired token, so the client must react: on <code>TOKEN_HET_HAN</code>, refresh — through the same locked, de-duplicated <code>lamMoiToken()</code> from 6.2, so a reconnecting socket and three failing requests share one refresh — then connect again:</p>
<pre><code class="language-ts">${SOCKET_LOI}</code></pre>
<div class="out">${TOKEN_V2}</div>
<p>One refresh, reconnected, the comment arrived 18 ms after it was posted. If the refresh fails (the session really ended), <code>layToken()</code> returns null and the socket reconnects as a guest — the public page keeps working. Any other refusal turns the bar into "could not reconnect — reload", which is honest.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — reconnect loops.</strong> "On any connect_error, refresh and reconnect" looks friendly and becomes a tight loop the day the server rejects tokens for another reason (a rotated signing key, a clock that is a minute off). Handle only the error you understand, and never retry more than once per few seconds.</p></div>

<h3>4. Two API instances (notes — not required for ChiaSe v1)</h3>
<p>One Node process serves ChiaSe comfortably. But you will meet this in every job that runs more than one instance, so we measured it. Two instances (ports 41815 and 41819, same database), tab X connected to the first, tab Y to the second, An comments once through each:</p>
<div class="out">${HAI_INSTANCE}</div>
<p>Each instance only knows its own sockets: rooms live in process memory. Half of the readers miss half of the comments, at random, depending on which instance the load balancer picked. A second, independent problem appears before the socket even reaches WebSocket:</p>
<div class="out">${STICKY}</div>
<p>Long-polling is a series of HTTP requests that carry a session id. If the load balancer sends the second one to another instance, it is rejected. Socket.IO therefore requires <strong>sticky sessions</strong> (the balancer always sends one client to the same instance — e.g. Nginx <code>ip_hash</code>) whenever polling is enabled; with <code>transports: ['websocket']</code> there is one long-lived connection and no stickiness is needed, at the cost of losing the fallback.</p>
<pre><code class="language-mermaid">${MERMAID2}</code></pre>
<p>For the first problem, an <strong>adapter</strong>: <code>io.to(room).emit()</code> is published through Redis, every instance receives it and forwards it to its own sockets. Optional, off unless <code>REDIS_URL</code> is set:</p>
<pre><code class="language-ts">${REDIS_MA}</code></pre>
<pre><code class="language-bash">docker run -d --name fsp-redis --memory 512m --memory-swap 512m --cpus 1 -p 127.0.0.1:41820:6379 redis:8-alpine
npm i -w apps/api @socket.io/redis-adapter@8.3.0 redis@6.4.0 --save-exact
REDIS_URL=redis://localhost:41820 npm run dev -w apps/api      # và instance thứ hai với PORT=41819</code></pre>
<div class="out">${HAI_INSTANCE_REDIS}</div>
<p>And when Redis itself dies (<code>docker stop fsp-redis</code>), then comes back:</p>
<div class="out">${REDIS_CHET}</div>
<p>A good failure mode: HTTP keeps working, realtime degrades to "each instance for itself", and it heals by itself. That works because of everything above — a tab that missed an event catches up on its next reconnect or reload. Note also what does <em>not</em> scale with this adapter: the like-coalescing state from 7.2 is per process, so each instance coalesces its own clicks.</p>
<p>At Slack's scale the same ideas have dedicated services: "Gateway Servers" hold the users' WebSockets and subscribe to channels, while "Channel Servers" are mapped to channels by consistent hashing; Slack reports tens of millions of connected clients and messages delivered worldwide in about 500 ms (Slack Engineering, "Real-time Messaging", 11/04/2023). The shape is ours: connection holders, plus a fan-out layer between them.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">lost</span><span class="lz-d">event emitted while disconnected is gone (at most once)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">show</span><span class="lz-d">connection state: connected / lost / stopped</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">rejoin</span><span class="lz-d">reconnect ⇒ join room ⇒ wait for ack</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">catch up</span><span class="lz-d">then HTTP: post counts + list from last cursor</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">expiry</span><span class="lz-d">TOKEN_HET_HAN ⇒ shared refresh ⇒ connect()</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">scale</span><span class="lz-d">several instances ⇒ adapter + sticky polling</span></div>
</div>

<h3>Everyday analogy</h3>
<p>A doorbell rings once. If you were in the shower, you will never hear that ring again — but the parcel is still in the mailbox. A sensible person, coming out of the shower, checks the mailbox. Our tab does exactly that after every reconnect.</p>

<h3>On the job</h3>
<p>"Users sometimes don't see new messages until they refresh" is a classic production ticket for realtime features, and it almost always means "no catch-up after reconnect" — it shows up right after deploys, which is why it is hard to reproduce on a developer machine. Reproduce it deliberately: restart the server while a tab is open and post during the gap. In a team that runs several replicas (Kubernetes, multiple containers behind a load balancer), ask on day one whether WebSocket traffic is sticky and which adapter is used.</p>

${spring(false, 'In Spring, the multi-instance problem is solved by a <em>broker relay</em>: instead of the in-memory simple broker, <code>enableStompBrokerRelay()</code> forwards STOMP messages to RabbitMQ or ActiveMQ, which plays the role of our Redis adapter. The client side (reconnect, re-subscribe, catch up over REST) is the same as in this lesson. The Spring course teaches Redis (as a cache) if you want to know the tool itself.', [
  ['sb-13-2-redis-cache', 'Spring Boot 13.2 — Redis as a cache: TTL and serialization'],
  ['sb-21-4-deploy-spa-api', 'Spring Boot 21.4 — Deploying the React app and the Spring API together'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What happens to events while a client is disconnected?"</strong> — With Socket.IO defaults they are lost (at most once). Re-sync from the database after reconnect, or use a replayable log (connection state recovery for short gaps, a message store with sequence numbers for long ones).</li>
<li><strong>"Why re-join before fetching?"</strong> — Otherwise an event between the fetch and the join reaches neither path.</li>
<li><strong>"Why does Socket.IO need sticky sessions?"</strong> — Long-polling sends several HTTP requests bound to a session that lives on one instance; another instance answers "Session ID unknown".</li>
<li><strong>"Two instances — users miss messages. Why and how do you fix it?"</strong> — Rooms are per process; use an adapter (Redis pub/sub, or a message broker) so an emit reaches sockets on every instance.</li>
<li><strong>"Access token expires while the socket is connected — what then?"</strong> — The connection stays authenticated as of the handshake; on reconnect the handshake fails with an expiry code; the client refreshes and reconnects. For sensitive data, re-check per event or disconnect on logout.</li>
</ol>

<h3>🧪 Lab 7.3 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Write a script that keeps a post open in a browser, restarts your API, and posts a comment through the API as soon as <code>/health</code> answers. Run it three times before any fix and record what the page shows.</li>
<li>Add <code>batKip</code>, the re-join-then-fetch order, the connection store and the status bar. Run the script three times again.</li>
<li>Start the API with <code>ACCESS_TTL_S=5</code>. Log in, open a post, wait 7 s, restart the API, comment from another account. Reproduce the dead socket, then fix it.</li>
<li>(Notes, optional) Start a second instance on another port; connect one socket to each and reproduce the missed comment. Add Redis and the adapter; stop Redis and observe the degradation.</li>
</ol>
<p><strong>Done when:</strong> your restart script passes 3/3 with the status bar visible during the gap, the expired-token scenario recovers without reload, and you can explain from your own output why two instances need an adapter and why polling needs stickiness.</p>
<p><strong>Rubric (10):</strong> missed event reproduced with numbers (2) · join-then-fetch with cursor catch-up (2) · honest connection states incl. "stopped" (1) · expiry handled through the shared refresh lock, no loop (2) · counters stay consistent (1) · multi-instance measured and explained (2).</p>
</div>
<details><summary>Solution</summary>
<p>Commit <code>8260713</code> on <code>ch7/realtime</code>: web <code>src/hooks/useTrang.ts</code> (<code>batKip</code>, cursor kept), <code>src/realtime/useBaiSong.ts</code> (<code>khiVaoLai</code> after ack), <code>src/realtime/useKetNoi.ts</code>, <code>src/realtime/socket.ts</code> (<code>connect_error</code>), <code>src/components/Khung.tsx</code>, <code>src/pages/BaiViet.tsx</code>; API <code>src/realtime/index.ts</code> (optional Redis adapter), <code>src/config.ts</code> (<code>redisUrl</code>), <code>.env.example</code>. Checkpoint 7 (lesson 7.4) later found one more race in this code — keep reading.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at most once</span><span class="v">An event is delivered zero or one time; nothing is replayed after a disconnect.</span></div>
  <div class="kv"><span class="k">catch-up</span><span class="v">After reconnecting, re-read from the database what may have been missed.</span></div>
  <div class="kv"><span class="k">back-off + jitter</span><span class="v">Growing, randomized wait between reconnect attempts, so clients do not return all at once.</span></div>
  <div class="kv"><span class="k">socket.active</span><span class="v">Whether the client will keep reconnecting; false after a middleware refusal.</span></div>
  <div class="kv"><span class="k">sticky session</span><span class="v">The load balancer sends one client to the same instance every time.</span></div>
  <div class="kv"><span class="k">adapter</span><span class="v">Socket.IO layer that spreads room emits across instances (Redis pub/sub).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured: after an API restart, a comment posted before the tab reconnected was lost 3/3 times. Socket.IO delivers at most once.</li>
<li>Fix: re-join the room, wait for the ack, then fetch from the database (post counts + cursor catch-up). 3/3 recovered.</li>
<li>Show the connection state honestly, including "the client stopped trying".</li>
<li>Handshake refusals stop auto-reconnect: handle <code>TOKEN_HET_HAN</code> by refreshing through the shared lock, then connecting; handle nothing else automatically.</li>
<li>Several instances: rooms are per process (adapter needed), polling needs sticky sessions; Redis down ⇒ degraded, not broken.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Realtime nhẹ</span>
<h2>Socket là chuông cửa, không phải hộp thư</h2>
<p class="lead">Kết nối thì rớt. Điện thoại đổi mạng, laptop ngủ, và — cái do chính bạn gây ra — mỗi lần deploy là API khởi động lại. Socket.IO tự nối lại, điều đó che mất câu hỏi thật: chuyện gì đã xảy ra <em>trong lúc</em> mất kết nối? Bài này cố tình làm hỏng realtime theo ba cách đo được và sửa từng cách bằng cùng một nguyên tắc: CSDL là sự thật, socket chỉ báo "có gì đó vừa đổi".</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Một lần deploy, và một bình luận biến mất</h3>
<p>Bình (khách) đang mở một bài. Ta tắt API, bật lại (đúng như deploy), và ngay khi <code>/health</code> trả lời, An đăng một bình luận qua API. Ba lần chạy:</p>
<div class="out">${KDL_V1}</div>
<p>Bình không bao giờ thấy — không sau 10 giây, không bao giờ, và số đếm sai mãi tới khi tải lại. Socket <em>có</em> nối lại và vào lại phòng (hook của ta vào lại ở mỗi <code>connect</code>), nhưng nó nối lại 1–5 giây sau khi API lên (client chờ <code>reconnectionDelay</code> 1 s, tăng dần tới 5 s, cộng độ ngẫu nhiên để hàng nghìn tab không cùng quay về một khoảnh khắc), và sự kiện đã được phát vào một phòng trống. Đảm bảo mặc định của Socket.IO là <em>at most once</em> (tối đa một lần): sự kiện phát lúc bạn không nối thì đơn giản là không tới (tài liệu socket.io, "Delivery guarantees").</p>
<p>Để ý thêm dòng cuối mỗi lần "trước/sau": không có thanh trạng thái. Người dùng không hề biết trang đã thôi "sống".</p>

<h3>2. Vào lại phòng, rồi hỏi lại bằng HTTP</h3>
<p>Cách sửa không phải một socket thông minh hơn; mà là coi mỗi lần nối lại là "có thể mình đã lỡ gì đó — hỏi nguồn sự thật". Thứ tự quan trọng: vào phòng <em>trước</em> và chờ ack, <em>rồi</em> mới hỏi. Hỏi trước thì còn một khe giữa "hỏi xong" và "vào phòng" mà bình luận rơi vào đó sẽ lỡ cả hai đường.</p>
<pre><code class="language-ts">${USE_BAI_SONG}</code></pre>
<p>"Hỏi lại" danh sách bình luận nghĩa là: tải lại từ vị trí cuối cùng đã biết. <code>useTrang</code> giờ giữ cursor cuối thay vì đặt về null khi hết danh sách, và hàm mới <code>batKip</code> ("bắt kịp") đọc lại trang cuối — cái đã hiện bị bỏ qua theo id, cái mới nối vào cuối:</p>
<pre><code class="language-ts">${USE_TRANG_CURSOR}</code></pre>
<pre><code class="language-ts">${USE_TRANG}</code></pre>
<p>Trang bài viết đọc lại bài (số đếm) và bắt kịp danh sách sau mỗi lần vào lại phòng; mọi thứ đã hiện đều tính là "đã thấy", nên một sự kiện tới muộn cho nó không bao giờ cộng thêm vào số đếm:</p>
<pre><code class="language-tsx">${BAI_VIET}</code></pre>
<p>Và người dùng xứng đáng được biết. Một kho nhỏ trên sự kiện của socket, đọc bằng <code>useSyncExternalStore</code> (nguồn ngoài React, không thêm state hay effect):</p>
<pre><code class="language-ts">${USE_KET_NOI}</code></pre>
<pre><code class="language-tsx">${KHUNG}</code></pre>
<p>Cùng ba lần chạy:</p>
<div class="out">${KDL_V2}</div>
<p>Thanh báo hiện trong lúc API tắt, bình luận bị lỡ tới sau 2,3–4,3 s kể từ lúc API lên (đó là thời gian chờ nối lại, không phải mã của ta), và số đếm khớp CSDL. Socket.IO còn có <em>connection state recovery</em>, phát lại sự kiện bị lỡ sau một lần mất kết nối <em>ngắn</em> — nhưng adapter mặc định giữ chúng trong bộ nhớ máy chủ, nên không sống qua được lần khởi động lại vừa rồi, còn Redis adapter ở mục 4 thì không hỗ trợ tính năng này (tài liệu socket.io). Hỏi lại bằng HTTP thì đúng trong mọi trường hợp.</p>

<h3>3. Token hết hạn đúng lúc nối lại</h3>
<p>Access token sống 15 phút. Tab để mở một tiếng sẽ nối lại với token đã hết hạn. Ta chạy API với token 5 giây: An đăng nhập, mở một bài, chờ 7 s, API khởi động lại, rồi Bình bình luận:</p>
<div class="out">${TOKEN_V1}</div>
<p>Realtime chết hẳn — mà thanh báo vẫn nói "đang thử nối lại" trong khi chẳng có gì đang thử. Nhớ lại 7.2: middleware bắt tay từ chối thì <code>socket.active = false</code>, và client thôi thử lại (nó coi là máy chủ cố ý). Chỉ client biết cách sửa token hết hạn, nên client phải phản ứng: gặp <code>TOKEN_HET_HAN</code> thì refresh — qua đúng hàm <code>lamMoiToken()</code> có khoá và gộp ở bài 6.2, để một socket đang nối lại và ba request đang hỏng dùng chung một lần refresh — rồi nối lại:</p>
<pre><code class="language-ts">${SOCKET_LOI}</code></pre>
<div class="out">${TOKEN_V2}</div>
<p>Một lần refresh, nối lại, bình luận tới sau 18 ms kể từ lúc được đăng. Nếu refresh thất bại (phiên thật sự đã hết), <code>layToken()</code> trả null và socket nối lại với tư cách khách — trang công khai vẫn chạy. Mọi kiểu từ chối khác biến thanh báo thành "không nối lại được — tải lại trang", nói thật với người dùng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — vòng lặp nối lại.</strong> "Gặp connect_error nào cũng refresh rồi nối lại" trông thân thiện, và thành vòng lặp quay tít vào ngày máy chủ từ chối token vì lý do khác (khoá ký bị đổi, đồng hồ lệch một phút). Chỉ xử lý đúng lỗi bạn hiểu, và không bao giờ thử lại quá một lần mỗi vài giây.</p></div>

<h3>4. Hai instance API (ghi chú — ChiaSe v1 không bắt buộc)</h3>
<p>Một tiến trình Node phục vụ ChiaSe thoải mái. Nhưng bạn sẽ gặp chuyện này ở mọi công việc chạy nhiều hơn một instance, nên ta đo luôn. Hai instance (cổng 41815 và 41819, chung CSDL), tab X nối instance thứ nhất, tab Y nối instance thứ hai, An bình luận qua mỗi instance một lần:</p>
<div class="out">${HAI_INSTANCE}</div>
<p>Mỗi instance chỉ biết socket của nó: phòng nằm trong bộ nhớ tiến trình. Một nửa người đọc lỡ một nửa bình luận, ngẫu nhiên, tuỳ load balancer chọn instance nào. Một vấn đề thứ hai, độc lập, xuất hiện trước cả khi socket lên được WebSocket:</p>
<div class="out">${STICKY}</div>
<p>Long-polling là một chuỗi request HTTP mang mã phiên. Nếu load balancer gửi request thứ hai sang instance khác, nó bị từ chối. Vì vậy Socket.IO đòi <strong>sticky session</strong> (load balancer luôn gửi một client về cùng một instance — vd <code>ip_hash</code> của Nginx) khi còn bật polling; dùng <code>transports: ['websocket']</code> thì chỉ có một kết nối dài, không cần sticky, đổi lại mất đường lùi.</p>
<pre><code class="language-mermaid">${MERMAID2}</code></pre>
<p>Cho vấn đề thứ nhất, một <strong>adapter</strong>: <code>io.to(phòng).emit()</code> được publish qua Redis, mọi instance nhận rồi chuyển cho socket của mình. Tuỳ chọn, tắt nếu không đặt <code>REDIS_URL</code>:</p>
<pre><code class="language-ts">${REDIS_MA}</code></pre>
<pre><code class="language-bash">docker run -d --name fsp-redis --memory 512m --memory-swap 512m --cpus 1 -p 127.0.0.1:41820:6379 redis:8-alpine
npm i -w apps/api @socket.io/redis-adapter@8.3.0 redis@6.4.0 --save-exact
REDIS_URL=redis://localhost:41820 npm run dev -w apps/api      # và instance thứ hai với PORT=41819</code></pre>
<div class="out">${HAI_INSTANCE_REDIS}</div>
<p>Còn khi chính Redis chết (<code>docker stop fsp-redis</code>), rồi sống lại:</p>
<div class="out">${REDIS_CHET}</div>
<p>Một kiểu hỏng tốt: HTTP vẫn chạy, realtime lùi về "mỗi instance tự lo", và tự lành. Được vậy là nhờ mọi thứ ở trên — tab nào lỡ sự kiện sẽ bắt kịp ở lần nối lại hay tải lại kế tiếp. Để ý cả thứ <em>không</em> mở rộng theo adapter này: trạng thái gộp lượt thích ở 7.2 nằm trong từng tiến trình, nên mỗi instance tự gộp lượt bấm của nó.</p>
<p>Ở quy mô Slack, cùng những ý đó có dịch vụ riêng: "Gateway Server" giữ WebSocket của người dùng và đăng ký nghe các kênh, còn "Channel Server" được gán kênh bằng consistent hashing; Slack cho biết họ có hàng chục triệu client đang nối và tin nhắn tới khắp thế giới trong khoảng 500 ms (Slack Engineering, "Real-time Messaging", 11/04/2023). Hình dạng giống của ta: những nơi giữ kết nối, cộng một tầng phân phát ở giữa.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">mất</span><span class="lz-d">sự kiện phát lúc mất kết nối là mất (tối đa một lần)</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">báo</span><span class="lz-d">trạng thái kết nối: đã nối / mất / đã ngừng</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">vào lại</span><span class="lz-d">nối lại ⇒ vào phòng ⇒ chờ ack</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">bắt kịp</span><span class="lz-d">rồi HTTP: số đếm + danh sách từ cursor cuối</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">hết hạn</span><span class="lz-d">TOKEN_HET_HAN ⇒ refresh dùng chung ⇒ connect()</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">mở rộng</span><span class="lz-d">nhiều instance ⇒ adapter + sticky cho polling</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Chuông cửa reo một lần. Nếu lúc đó bạn đang tắm, bạn sẽ không bao giờ nghe lại tiếng reo đó — nhưng bưu kiện vẫn nằm trong hộp thư. Người tỉnh táo, tắm xong, ra kiểm hộp thư. Tab của ta làm đúng như vậy sau mỗi lần nối lại.</p>

<h3>Tình huống đi làm thật</h3>
<p>"Người dùng thỉnh thoảng không thấy tin mới cho tới khi F5" là ticket production kinh điển của tính năng realtime, và gần như luôn có nghĩa là "không bắt kịp sau khi nối lại" — nó xuất hiện ngay sau các lần deploy, nên khó tái hiện trên máy lập trình viên. Hãy tái hiện có chủ đích: khởi động lại máy chủ khi đang mở tab và đăng bài trong khe hở. Ở team chạy nhiều bản sao (Kubernetes, nhiều container sau load balancer), ngày đầu tiên hãy hỏi lưu lượng WebSocket có sticky không và dùng adapter nào.</p>

${spring(false, 'Trong Spring, bài toán nhiều instance được giải bằng <em>broker relay</em>: thay cho simple broker trong bộ nhớ, <code>enableStompBrokerRelay()</code> chuyển tin STOMP sang RabbitMQ hoặc ActiveMQ — đóng vai Redis adapter của ta. Phía client (nối lại, đăng ký lại, bắt kịp qua REST) giống hệt bài này. Khoá Spring dạy Redis (làm cache) nếu bạn muốn biết chính công cụ đó.', [
  ['sb-13-2-redis-cache', 'Spring Boot 13.2 — Redis làm cache: TTL và tuần tự hoá'],
  ['sb-21-4-deploy-spa-api', 'Spring Boot 21.4 — Triển khai app React và API Spring cùng nhau'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sự kiện phát ra lúc client mất kết nối thì sao?"</strong> — Với mặc định của Socket.IO là mất (at most once). Đồng bộ lại từ CSDL sau khi nối lại, hoặc dùng log phát lại được (connection state recovery cho khe ngắn, kho tin nhắn có số thứ tự cho khe dài).</li>
<li><strong>"Sao phải vào lại phòng trước rồi mới hỏi?"</strong> — Nếu không, sự kiện nằm giữa lúc hỏi và lúc vào phòng không tới bằng đường nào cả.</li>
<li><strong>"Sao Socket.IO cần sticky session?"</strong> — Long-polling gửi nhiều request HTTP gắn với một phiên nằm ở một instance; instance khác trả "Session ID unknown".</li>
<li><strong>"Hai instance — người dùng lỡ tin. Vì sao và sửa thế nào?"</strong> — Phòng nằm theo tiến trình; dùng adapter (Redis pub/sub, hoặc message broker) để một lần phát tới được socket ở mọi instance.</li>
<li><strong>"Access token hết hạn khi socket đang nối thì sao?"</strong> — Kết nối vẫn mang danh tính lúc bắt tay; lần nối lại thì bắt tay hỏng với mã hết hạn; client refresh rồi nối lại. Dữ liệu nhạy cảm thì kiểm lại ở từng sự kiện hoặc ngắt khi đăng xuất.</li>
</ol>

<h3>🧪 Lab 7.3 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Viết script giữ một bài đang mở trong trình duyệt, khởi động lại API, và đăng bình luận qua API ngay khi <code>/health</code> trả lời. Chạy ba lần trước khi sửa và ghi lại trang hiện gì.</li>
<li>Thêm <code>batKip</code>, thứ tự vào-phòng-rồi-hỏi, kho trạng thái kết nối và thanh báo. Chạy lại ba lần.</li>
<li>Bật API với <code>ACCESS_TTL_S=5</code>. Đăng nhập, mở một bài, chờ 7 s, khởi động lại API, bình luận từ tài khoản khác. Tái hiện socket chết, rồi sửa.</li>
<li>(Ghi chú, tuỳ chọn) Bật instance thứ hai ở cổng khác; nối mỗi instance một socket và tái hiện bình luận bị lỡ. Thêm Redis và adapter; tắt Redis và quan sát cách nó xuống cấp.</li>
</ol>
<p><strong>Xong khi:</strong> script khởi động lại đạt 3/3 với thanh báo hiện trong khe hở, kịch bản token hết hạn tự hồi phục không cần tải lại, và bạn giải thích được từ chính output của mình vì sao hai instance cần adapter và vì sao polling cần sticky.</p>
<p><strong>Thang điểm (10):</strong> tái hiện sự kiện bị lỡ có số liệu (2) · vào-phòng-rồi-hỏi với bắt kịp theo cursor (2) · trạng thái kết nối nói thật, kể cả "đã ngừng" (1) · xử lý hết hạn qua khoá refresh dùng chung, không vòng lặp (2) · số đếm luôn nhất quán (1) · đo và giải thích nhiều instance (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Commit <code>8260713</code> trên <code>ch7/realtime</code>: web <code>src/hooks/useTrang.ts</code> (<code>batKip</code>, giữ cursor), <code>src/realtime/useBaiSong.ts</code> (<code>khiVaoLai</code> sau ack), <code>src/realtime/useKetNoi.ts</code>, <code>src/realtime/socket.ts</code> (<code>connect_error</code>), <code>src/components/Khung.tsx</code>, <code>src/pages/BaiViet.tsx</code>; API <code>src/realtime/index.ts</code> (Redis adapter tuỳ chọn), <code>src/config.ts</code> (<code>redisUrl</code>), <code>.env.example</code>. Checkpoint 7 (bài 7.4) còn tìm ra một cuộc đua nữa trong chính đoạn mã này — đọc tiếp.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">at most once</span><span class="v">Sự kiện tới 0 hoặc 1 lần; mất kết nối thì không phát lại gì.</span></div>
  <div class="kv"><span class="k">bắt kịp</span><span class="v">Sau khi nối lại, đọc lại từ CSDL những gì có thể đã lỡ.</span></div>
  <div class="kv"><span class="k">back-off + jitter</span><span class="v">Thời gian chờ giữa các lần nối lại tăng dần, có ngẫu nhiên, để client không cùng ùa về.</span></div>
  <div class="kv"><span class="k">socket.active</span><span class="v">Client còn tự nối lại hay không; false sau khi middleware từ chối.</span></div>
  <div class="kv"><span class="k">sticky session</span><span class="v">Load balancer luôn gửi một client về cùng một instance.</span></div>
  <div class="kv"><span class="k">adapter</span><span class="v">Tầng của Socket.IO rải lệnh phát vào phòng ra mọi instance (Redis pub/sub).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo được: sau khi API khởi động lại, bình luận đăng trước khi tab nối lại bị mất 3/3 lần. Socket.IO giao tối đa một lần.</li>
<li>Sửa: vào lại phòng, chờ ack, rồi hỏi CSDL (số đếm của bài + bắt kịp theo cursor). Hồi phục 3/3.</li>
<li>Hiện trạng thái kết nối trung thực, kể cả "client đã thôi thử".</li>
<li>Bắt tay bị từ chối thì thư viện ngừng tự nối lại: xử lý <code>TOKEN_HET_HAN</code> bằng refresh qua khoá dùng chung rồi nối; không tự động xử lý gì khác.</li>
<li>Nhiều instance: phòng nằm theo tiến trình (cần adapter), polling cần sticky; Redis chết ⇒ xuống cấp, không sập.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
