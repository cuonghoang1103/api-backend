/**
 * Socket.IO — Progress Test 2 (chương s04–s07).
 *
 * Đề tự soạn, bám sát `content/courses/socket-io/s04-presence`, `s05-cluster`,
 * `s06-ack`, `s07-webrtc`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi (chấm bằng AI theo rubric). PT là đề GIỮA KỲ — dễ hơn FE một bậc,
 * và không trùng câu nào với SOCKET-IO-FE.mjs / SOCKET-IO-PE.mjs / PT1 / PT3.
 *
 * ⚠️ Mọi chuỗi lỗi ack, mọi hành vi adapter, mọi con số room membership trong
 * đề đều ĐO THẬT bằng máy chủ socket.io nháp trên cổng ngẫu nhiên — không suy
 * đoán, không chép từ tài liệu.
 *
 * Phiên bản đã dùng để đo (08–10/09/2026):
 *   socket.io 4.8.3 · socket.io-client 4.8.3 · engine.io 6.6.8
 *   engine.io-client 6.6.5 · socket.io-adapter (đi kèm) · Node v22.21.0
 *
 * ────────────────────────────────────────────────────────────────────────
 * ⛔ GIÁO TRÌNH SAI / THIẾU ĐIỀU KIỆN — ĐỀ NÀY THEO MÁY
 * ────────────────────────────────────────────────────────────────────────
 * 1. `io.sockets.size` là **undefined**, không phải một con số.
 *    Bài 5.2 (s05) dùng nó trong phần "bẫy" như thể nó là số socket. Đo thật:
 *      io.sockets.size          -> undefined
 *      io.sockets.sockets.size  -> 5
 *      io.engine.clientsCount   -> 5
 *    `io.sockets` là Namespace `/`, không phải Map. Câu 8.
 *
 * 2. `fetchSockets()` trên MỘT máy chủ dùng adapter mặc định trả về CHÍNH
 *    các đối tượng `Socket` thật, nên `.on()` chạy bình thường.
 *    Bài 5.2 ghi `all[0].on('bar', h)  // ❌ KHÔNG có` không kèm điều kiện.
 *    Đo thật, adapter mặc định, một tiến trình:
 *      o.constructor.name === 'Socket'   · o === socket thật  -> true
 *      typeof o.on === 'function'        · gọi o.on('x') -> KHÔNG lỗi
 *    Chỉ khi có adapter cụm thì phần tử ở xa mới là `RemoteSocket`, và
 *    prototype của lớp đó (đọc từ chính node_modules) đúng là chỉ có
 *      constructor, timeout, emit, join, leave, disconnect
 *    Nghĩa là mã của bạn chạy ngon ở dev rồi chết bằng TypeError trên
 *    production — đúng loại lỗi tệ nhất. Câu 10.
 *
 * 3. `serverSideEmit()` với adapter mặc định KHÔNG ném lỗi và cũng KHÔNG
 *    gọi callback. Đo thật: nó in ra stderr
 *      "this adapter does not support the serverSideEmit() functionality"
 *    rồi callback im lặng không bao giờ chạy (chờ 400 ms, không có gì). Câu 11.
 *
 * 4. Ack mang lỗi NGHIỆP VỤ không phải lỗi ack. Đo thật:
 *      cb({ error: 'khong duoc' })  ->  err = null, res = {"error":"khong duoc"}
 *    Chỉ hết giờ mới cho `err`, và thông điệp đúng từng chữ là
 *      "operation has timed out"
 *    Callback được gọi ĐÚNG MỘT LẦN kể cả khi ack muộn về sau đó. Câu 17–20.
 *
 * 5. Số kết nối trong mesh N người là **N(N-1)/2**, không phải N(N-1).
 *    Bài 7.5 (s07) ghi "N=4: 12 connections, N=8: 56" — đó là số LUỒNG GỬI
 *    (có hướng), không phải số `RTCPeerConnection`. N=4 -> 6 kết nối,
 *    N=8 -> 28. Câu 28 hỏi đúng chỗ này. (Không đo được bằng máy — đây là
 *    số học đồ thị, nhưng nó sai rõ và bài tự mâu thuẫn ở cột bitrate.)
 *
 * 6. `adapter.rooms` và `io.of('/').sockets` KHÔNG được adapter đồng bộ.
 *    Đọc thẳng `node_modules/socket.io-adapter/dist/in-memory-adapter.js`:
 *    `this.rooms` là một Map thường, chỉ được `addAll`/`del` CỤC BỘ nuôi.
 *    Redis adapter kế thừa lớp đó và không gộp room ở xa vào. Nên gắn adapter
 *    KHÔNG sửa được hai thứ này — đúng thứ câu 32 bắt học viên tự nhận ra.
 *
 * KHÔNG ĐO ĐƯỢC:
 *   - Cụm nhiều worker thật (cần Redis + nhiều tiến trình): các khẳng định về
 *     cụm suy ra từ mã nguồn adapter đã đọc + hành vi một-tiến-trình đo được,
 *     và câu 32 được ra dưới dạng MÔ PHỎNG chứ không phải "chạy thử cụm".
 *   - Mọi số đo thời gian/độ trễ: máy đang chạy nhiều agent song song.
 *     Đề chỉ hỏi cơ chế và thứ tự, không hỏi mili giây.
 *   - WebRTC thật (cần hai trình duyệt + STUN/TURN): các câu 24–30 hỏi kiến
 *     trúc và số học, không hỏi hành vi runtime.
 *
 * Phân bố đáp án (đếm bằng lệnh trong CLAUDE.md): { 0: 8, 1: 8, 2: 8, 3: 9 }  — 33 vì có ba câu chọn HAI
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SOCKET-IO-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/socketio-exam-kit.mjs';

export default {
  course: { slug: 'socket-io' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–7 (presence, cluster, acknowledgements, WebRTC signalling)',
        'Kiểm tra tiến độ 2 — Chương 4–7 (presence, cụm, acknowledgement, tín hiệu WebRTC)',
      ),
      description: B(
        'The middle third of the Socket.IO course: presence and the O(N squared) trap, the Redis adapter and what it does not fix, delivery guarantees built on acks, and using socket.io as the signalling channel for WebRTC. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Socket.IO: presence và cái bẫy O(N bình phương), Redis adapter và những thứ nó KHÔNG chữa, bảo đảm giao hàng dựng trên ack, và dùng socket.io làm kênh tín hiệu cho WebRTC. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [
        // ── Chương 4 — Presence và bẫy O(N²) ────────────────────────────
        mcq({
          prompt: B(
            'A deploy restarts the server. All 10,000 sockets drop and come back, and the handler broadcasts with <code>io.emit("presence:update", …)</code> on every connect and every disconnect. Which reasoning about the cost is right?',
            'Một lần deploy khởi động lại máy chủ. Cả 10.000 socket rớt rồi quay lại, và handler broadcast bằng <code>io.emit("presence:update", …)</code> ở mỗi lần connect và mỗi lần disconnect. Lập luận nào về chi phí là ĐÚNG?',
          ),
          options: [
            B('Cost is O(N): 20,000 broadcasts, one packet each, because <code>io.emit</code> is a single call', 'Chi phí là O(N): 20.000 lần broadcast, mỗi lần một gói, vì <code>io.emit</code> chỉ là một lời gọi'),
            B('Cost is O(N&sup2;): each of the 20,000 events fans out to ~10,000 sockets', 'Chi phí là O(N&sup2;): mỗi trong 20.000 sự kiện toả ra ~10.000 socket'),
            B('Cost is O(N log N) because the adapter keeps the room set sorted', 'Chi phí là O(N log N) vì adapter giữ tập room ở dạng đã sắp xếp'),
            B('Cost is O(1) on the server: the fan-out happens in the clients', 'Chi phí là O(1) ở máy chủ: việc toả ra xảy ra ở phía các client'),
          ],
          correct: 1,
          explanation: EX(
            'One <code>io.emit</code> is one line of code and N packets on the wire, and there are 2N of them during a restart, so the packet count is quadratic in the number of users. That is why the fix has to change the ALGORITHM — sending to <code>audience(user)</code> instead of to everyone — and not merely trim the constant. Note the trap in the other direction too: the same code is invisible at 200 users and lethal at 10,000, so "it works today" proves nothing.',
            'Một lệnh <code>io.emit</code> là một dòng mã nhưng là N gói trên dây, và trong một lần khởi động lại có 2N lệnh như thế, nên số gói tăng theo bình phương số người dùng. Vì vậy cách sửa phải đổi THUẬT TOÁN — gửi tới <code>audience(user)</code> thay vì tới tất cả — chứ không chỉ cắt bớt hằng số. Lưu ý cái bẫy chiều ngược lại: cùng đoạn mã đó vô hình ở 200 người và chí mạng ở 10.000 người, nên "hôm nay vẫn chạy" không chứng minh được gì.',
          ),
        }),

        mcq({
          prompt: B(
            'A gateway joins every socket to <code>user:&lt;id&gt;</code>. A user opens two tabs, then closes one, then closes the other. Measured on <code>io.of("/").adapter.rooms</code>, what does <code>get("user:7")</code> give at the three moments?',
            'Một gateway join mọi socket vào <code>user:&lt;id&gt;</code>. Một người dùng mở hai tab, rồi đóng một, rồi đóng nốt cái còn lại. Đo trên <code>io.of("/").adapter.rooms</code>, <code>get("user:7")</code> cho gì ở ba thời điểm đó?',
          ),
          options: [
            B('size 2 → size 1 → <code>undefined</code>, because the room key is removed when it empties', 'size 2 → size 1 → <code>undefined</code>, vì khoá room bị xoá khi nó rỗng'),
            B('size 2 → size 2 → size 2: the adapter only prunes rooms on a timer', 'size 2 → size 2 → size 2: adapter chỉ dọn room theo bộ đếm giờ'),
            B('size 1 → size 1 → size 0, because a user counts once regardless of tabs', 'size 1 → size 1 → size 0, vì một người dùng chỉ đếm một lần bất kể bao nhiêu tab'),
            B('size 2 → size 1 → size 0, the key stays with an empty Set', 'size 2 → size 1 → size 0, khoá vẫn còn với một Set rỗng'),
          ],
          correct: 0,
          explanation: EX(
            'Measured exactly this way. Each tab is its OWN socket with its own id, so a per-user room is really a reference count you get for free — and the key disappears entirely when the last member leaves, so <code>rooms.get(name)</code> returns <code>undefined</code> rather than an empty Set. Guard your reads with <code>?.size ?? 0</code>, and never treat one <code>disconnect</code> as "the user went offline".',
            'Đo đúng theo cách đó. Mỗi tab là một socket RIÊNG với id riêng, nên một room theo người dùng thực chất là bộ đếm tham chiếu bạn có sẵn không mất công — và khoá biến mất hẳn khi thành viên cuối rời đi, nên <code>rooms.get(name)</code> trả về <code>undefined</code> chứ không phải Set rỗng. Hãy đọc kèm <code>?.size ?? 0</code>, và đừng bao giờ coi một lần <code>disconnect</code> là "người dùng đã offline".',
          ),
        }),

        mcq({
          prompt: B(
            'Which disconnect reasons should schedule a DEBOUNCED "offline", and which should publish "offline" immediately?',
            'Những lý do disconnect nào nên hẹn giờ báo "offline" có DEBOUNCE, và những lý do nào nên báo "offline" ngay lập tức?',
          ),
          options: [
            B('Debounce everything — a fixed 2 s delay is always safer than guessing', 'Debounce tất cả — trễ cố định 2 giây bao giờ cũng an toàn hơn là đoán'),
            B('Never debounce — presence must reflect the socket state exactly, or the UI lies', 'Không bao giờ debounce — presence phải phản ánh đúng trạng thái socket, không thì giao diện nói dối'),
            B('Debounce the namespace disconnects; publish immediately for network drops, which are the real ones', 'Debounce các disconnect cấp namespace; báo ngay với rớt mạng, vì đó mới là thật'),
            B('Debounce <code>transport close</code>, <code>ping timeout</code>, <code>transport error</code>; publish immediately for the namespace disconnects', 'Debounce <code>transport close</code>, <code>ping timeout</code>, <code>transport error</code>; báo ngay với các disconnect cấp namespace'),
          ],
          correct: 3,
          explanation: EX(
            'The split follows one measurable fact: after a network-class disconnect the client keeps <code>active === true</code> and will come back by itself, so publishing "offline" is very likely to be undone a moment later — that is the avatar flickering grey and blue. After <code>io client disconnect</code> or <code>io server disconnect</code> the client is <code>active === false</code> and is not coming back until somebody calls <code>connect()</code>, so waiting only makes the UI stale. Debouncing everything is the wrong shape: a logout should look instant.',
            'Ranh giới này bám vào một sự thật đo được: sau một cú ngắt thuộc nhóm mạng, client giữ <code>active === true</code> và sẽ tự quay lại, nên báo "offline" gần như chắc chắn bị lật lại ngay sau đó — đó chính là cái avatar nhấp nháy xám rồi xanh. Sau <code>io client disconnect</code> hay <code>io server disconnect</code> thì client là <code>active === false</code> và không quay lại cho tới khi ai đó gọi <code>connect()</code>, nên chờ chỉ làm giao diện cũ đi. Debounce tất cả là sai hình dạng: một cú đăng xuất phải trông như tức thì.',
          ),
        }),

        mcq({
          prompt: B(
            'The audience for a presence update is cached in Redis with a five-minute TTL. Which event MUST invalidate the cache explicitly, rather than being left to the TTL?',
            'Tập khán giả của một bản cập nhật presence được cache ở Redis với TTL năm phút. Sự kiện nào BẮT BUỘC phải xoá cache tường minh, chứ không được phó mặc cho TTL?',
          ),
          options: [
            B('A user changes their avatar', 'Một người dùng đổi ảnh đại diện'),
            B('A user opens a second tab', 'Một người dùng mở thêm tab thứ hai'),
            B('A user blocks another user', 'Một người dùng chặn một người khác'),
            B('A user goes offline', 'Một người dùng chuyển sang offline'),
          ],
          correct: 2,
          explanation: EX(
            'A block removes the friendship AND takes both people out of every shared thread, so the audience set genuinely changed — and if you let the TTL handle it, the person who was just blocked keeps receiving the blocker\'s online/offline transitions for up to five minutes. That is not a stale cache, it is a privacy failure, and it is exactly the case the course flags as the one people forget. Avatar changes and tab counts do not change WHO the audience is; going offline is the payload, not the audience.',
            'Chặn ai đó là gỡ quan hệ bạn bè VÀ kéo cả hai ra khỏi mọi cuộc trò chuyện chung, nên tập khán giả đã thật sự đổi — và nếu phó mặc cho TTL thì người vừa bị chặn vẫn nhận được các lần lên/xuống mạng của người chặn trong tối đa năm phút. Đó không phải cache cũ, đó là hỏng quyền riêng tư, và đúng là trường hợp bài học chỉ ra rằng người ta hay quên. Đổi ảnh đại diện hay số tab không làm đổi khán giả LÀ AI; chuyển sang offline là nội dung gửi đi, không phải khán giả.',
          ),
        }),

        mcq({
          prompt: B(
            'A typing indicator is fixed with (a) a client-side throttle so the sender emits at most once every three seconds, and (b) a receiver-side timer that clears the indicator after three seconds of silence. Why are BOTH needed?',
            'Một chỉ báo đang gõ được vá bằng (a) throttle phía client để người gửi phát tối đa ba giây một lần, và (b) bộ đếm giờ phía người nhận để xoá chỉ báo sau ba giây im lặng. Vì sao cần CẢ HAI?',
          ),
          options: [
            B('Only (a) is really needed; (b) is a habit carried over from HTTP polling UIs', 'Thật ra chỉ cần (a); (b) là thói quen mang từ giao diện HTTP polling sang'),
            B('(b) is a fallback for (a): if the throttle timer drifts, the receiver corrects it', '(b) là phương án dự phòng cho (a): nếu bộ đếm throttle trôi thì người nhận sẽ chỉnh lại'),
            B('(a) is about correctness, (b) is about cost: (b) lets the server skip the fan-out entirely', '(a) là chuyện đúng đắn, (b) là chuyện chi phí: (b) cho phép máy chủ bỏ hẳn việc toả gói'),
            B('(a) is about cost, (b) is about correctness: without (b) the indicator stays lit when the "stop" never arrives', '(a) là chuyện chi phí, (b) là chuyện đúng đắn: không có (b) thì chỉ báo sáng mãi khi tín hiệu "dừng" không bao giờ tới'),
          ],
          correct: 3,
          explanation: EX(
            'They fix two unrelated failures. The throttle cuts the packet count, and nothing else. The receiver-side timer covers the case where the "stopped typing" signal never arrives at all — the tab was closed, the Wi-Fi went, the process died — because that signal travels over the same connection whose failure you are trying to survive. Chapter 6 makes the general form of this point: never let the correctness of a UI depend on a message that is allowed to be lost.',
            'Chúng chữa hai hỏng hóc không liên quan nhau. Throttle cắt số gói, chỉ vậy thôi. Bộ đếm giờ phía người nhận lo trường hợp tín hiệu "đã ngừng gõ" không bao giờ tới — tab bị đóng, Wi-Fi mất, tiến trình chết — vì tín hiệu ấy đi trên đúng cái kết nối mà bạn đang cố sống sót qua sự cố của nó. Chương 6 phát biểu dạng tổng quát của ý này: đừng bao giờ để tính đúng đắn của giao diện phụ thuộc vào một thông điệp được phép mất.',
          ),
        }),

        mcq({
          prompt: B(
            'What separates DELIVERED from READ in a read-receipt system, and why does it matter?',
            'Điều gì phân biệt DELIVERED với READ trong hệ thống báo đã xem, và vì sao điều đó quan trọng?',
          ),
          options: [
            B('DELIVERED means the DB write committed; READ means the packet reached the recipient socket', 'DELIVERED nghĩa là lệnh ghi cơ sở dữ liệu đã commit; READ nghĩa là gói tin đã tới socket người nhận'),
            B('They are the same event; READ is just the label used once the sender has been notified', 'Chúng là cùng một sự kiện; READ chỉ là cái nhãn dùng sau khi người gửi đã được báo'),
            B('DELIVERED means the recipient socket acked the packet; READ means a human actually looked at it', 'DELIVERED nghĩa là socket người nhận đã ack gói tin; READ nghĩa là một con người đã thật sự nhìn thấy nó'),
            B('DELIVERED is emitted by the sender optimistically; READ is the only one the server records', 'DELIVERED do người gửi tự phát một cách lạc quan; READ là cái duy nhất máy chủ có ghi lại'),
          ],
          correct: 2,
          explanation: EX(
            'Three levels, three different proofs: SENT is the server saying it persisted the row, DELIVERED is the recipient\'s socket acknowledging the packet, READ needs evidence a person saw it — an <code>IntersectionObserver</code> plus a visible, focused tab. Treating DELIVERED as READ is the classic bug: the phone in someone\'s pocket acks the packet, the sender sees "seen", and the trust the feature was built for is gone.',
            'Ba mức, ba loại bằng chứng khác nhau: SENT là máy chủ nói nó đã lưu bản ghi, DELIVERED là socket người nhận xác nhận đã nhận gói, READ cần bằng chứng có người nhìn thấy — một <code>IntersectionObserver</code> cộng với tab đang hiện và đang được chú ý. Coi DELIVERED là READ là lỗi kinh điển: cái điện thoại trong túi ai đó ack gói tin, người gửi thấy "đã xem", và niềm tin mà tính năng này sinh ra để phục vụ thì mất sạch.',
          ),
        }),

        mcq({
          prompt: B(
            'Multi-tab presence in a cluster is tracked with Redis:' + code(
              "await redis.sadd(`presence:sockets:${userId}`, socketId);\n" +
              'const count = await redis.scard(`presence:sockets:${userId}`);\n' +
              "if (count === 1) emitOnline(userId);",
            ) + 'Choose TWO real problems with this.',
            'Presence nhiều tab trong cụm được theo dõi bằng Redis:' + code(
              "await redis.sadd(`presence:sockets:${userId}`, socketId);\n" +
              'const count = await redis.scard(`presence:sockets:${userId}`);\n' +
              "if (count === 1) emitOnline(userId);",
            ) + 'Chọn HAI vấn đề THẬT của đoạn này.',
          ),
          options: [
            B('<code>SADD</code> and <code>SCARD</code> are two round trips, so two tabs connecting at once can both miss the 0→1 edge', '<code>SADD</code> và <code>SCARD</code> là hai lượt đi về, nên hai tab kết nối cùng lúc có thể cùng trượt mốc 0→1'),
            B('Without an expiry, a worker that crashes leaves its socket ids in the set forever', 'Không đặt hạn, một worker sập sẽ để lại id socket của nó trong tập, mãi mãi'),
            B('<code>SCARD</code> is O(N) in Redis, so it becomes the bottleneck above a few hundred tabs', '<code>SCARD</code> là O(N) trong Redis, nên nó thành nút thắt khi vượt vài trăm tab'),
            B('Redis sets cannot hold strings, so <code>socketId</code> must be hashed to an integer first', 'Tập hợp của Redis không chứa được chuỗi, nên <code>socketId</code> phải băm thành số nguyên trước'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The read-after-write is not atomic, so under a burst both branches can see a count that is not 1 and nobody publishes "online" — or worse, both see 1 and it is published twice. Use the return value of <code>SADD</code>, or a small Lua script. The second hole is the one that bites in production: process state disappears on a crash, Redis state does not, so every key in this pattern needs a TTL that is refreshed while the socket lives. <code>SCARD</code> is O(1) and sets hold strings fine.',
            'Phép đọc-sau-ghi không nguyên tử, nên khi có một loạt kết nối dồn dập thì cả hai nhánh có thể thấy một con số khác 1 và không ai báo "online" — hoặc tệ hơn, cả hai cùng thấy 1 và báo hai lần. Hãy dùng giá trị trả về của <code>SADD</code>, hoặc một đoạn Lua ngắn. Lỗ thứ hai mới là cái cắn trên production: trạng thái trong tiến trình biến mất khi sập, trạng thái trong Redis thì không, nên mọi khoá theo lối này đều cần một TTL được gia hạn trong lúc socket còn sống. <code>SCARD</code> là O(1) và tập hợp chứa chuỗi hoàn toàn bình thường.',
          ),
        }),

        mcq({
          prompt: B(
            'An admin endpoint reports the number of connected sockets. Three candidate expressions are measured on a server with five clients connected. Which line is correct?',
            'Một endpoint quản trị báo số socket đang kết nối. Ba biểu thức ứng viên được đo trên máy chủ có năm client đang kết nối. Dòng nào ĐÚNG?',
          ),
          options: [
            B('<code>io.sockets.size</code> → 5 · <code>io.sockets.sockets.size</code> → 5 · <code>io.engine.clientsCount</code> → 5', '<code>io.sockets.size</code> → 5 · <code>io.sockets.sockets.size</code> → 5 · <code>io.engine.clientsCount</code> → 5'),
            B('<code>io.sockets.size</code> → <code>undefined</code> · <code>io.sockets.sockets.size</code> → 5 · <code>io.engine.clientsCount</code> → 5', '<code>io.sockets.size</code> → <code>undefined</code> · <code>io.sockets.sockets.size</code> → 5 · <code>io.engine.clientsCount</code> → 5'),
            B('<code>io.sockets.size</code> → 0 · <code>io.sockets.sockets.size</code> → <code>undefined</code> · <code>io.engine.clientsCount</code> → 5', '<code>io.sockets.size</code> → 0 · <code>io.sockets.sockets.size</code> → <code>undefined</code> · <code>io.engine.clientsCount</code> → 5'),
            B('All three throw, because counting sockets requires <code>await io.fetchSockets()</code>', 'Cả ba đều ném lỗi, vì đếm socket bắt buộc phải dùng <code>await io.fetchSockets()</code>'),
          ],
          correct: 1,
          explanation: EX(
            '<code>io.sockets</code> is the Namespace <code>/</code>, not a Map, so asking it for <code>.size</code> gives <code>undefined</code> — and <code>undefined</code> rendered into a dashboard tends to show up as a blank or a zero rather than as an error, which is why this survives review. The Map is one level down at <code>io.sockets.sockets</code>. Note that both of these count LOCAL sockets only, so in a cluster they are answering for one worker even when the Redis adapter is attached.',
            '<code>io.sockets</code> là Namespace <code>/</code>, không phải Map, nên hỏi nó <code>.size</code> sẽ ra <code>undefined</code> — và <code>undefined</code> khi đổ ra bảng điều khiển thường hiện thành ô trống hoặc số không chứ không phải một lỗi, nên nó sống sót qua review. Cái Map nằm sâu hơn một tầng ở <code>io.sockets.sockets</code>. Lưu ý cả hai đều chỉ đếm socket CỤC BỘ, nên trong cụm chúng đang trả lời thay cho một worker ngay cả khi Redis adapter đã được gắn.',
          ),
        }),

        // ── Chương 5 — Redis adapter và cluster ─────────────────────────
        mcq({
          prompt: B(
            'An app is scaled from one process to four Docker replicas with sticky sessions correctly configured, but no adapter. What is the symptom?',
            'Một ứng dụng được nhân từ một tiến trình lên bốn bản Docker với sticky session đã cấu hình đúng, nhưng không có adapter. Triệu chứng là gì?',
          ),
          options: [
            B('Roughly a quarter of the intended recipients get each message, and no error appears anywhere', 'Chừng một phần tư số người cần nhận nhận được mỗi tin, và không có lỗi nào xuất hiện ở đâu cả'),
            B('Every emit throws <code>ERR_NO_ADAPTER</code> until you attach one', 'Mọi lệnh emit ném <code>ERR_NO_ADAPTER</code> cho tới khi bạn gắn một adapter'),
            B('Polling clients get HTTP 400 and WebSocket clients are fine', 'Client polling nhận HTTP 400, còn client WebSocket vẫn ổn'),
            B('Everything works: sticky sessions already keep each conversation on one worker', 'Mọi thứ vẫn chạy: sticky session đã giữ mỗi cuộc trò chuyện trên một worker'),
          ],
          correct: 0,
          explanation: EX(
            'The fraction is the fingerprint. Each worker\'s adapter only knows its own sockets, so a broadcast reaches whoever happens to live on the emitting worker — about 1/N of the room — and everyone else silently gets nothing. Sticky sessions do not help because they route a client consistently, they do not move messages between processes. HTTP 400 <code>Session ID unknown</code> is the OTHER cluster bug, the one caused by missing stickiness, and the two are often present at the same time.',
            'Cái phân số chính là dấu vân tay. Adapter của mỗi worker chỉ biết socket của chính nó, nên một lần broadcast tới được những ai tình cờ đang sống trên worker phát lệnh — chừng 1/N của room — còn tất cả những người khác âm thầm không nhận gì. Sticky session không giúp gì vì nó định tuyến một client một cách nhất quán, chứ không chuyển thông điệp giữa các tiến trình. HTTP 400 <code>Session ID unknown</code> là lỗi cụm KHÁC, do thiếu sticky, và hai thứ này thường cùng có mặt.',
          ),
        }),

        mcq({
          prompt: B(
            'A developer writes this, tests it locally, and ships it to a four-worker cluster:' + code(
              "const sockets = await io.in('thread:42').fetchSockets();\n" +
              "sockets[0].on('typing', handler);",
            ) + 'What happens?',
            'Một lập trình viên viết đoạn này, thử ở máy mình, rồi đẩy lên cụm bốn worker:' + code(
              "const sockets = await io.in('thread:42').fetchSockets();\n" +
              "sockets[0].on('typing', handler);",
            ) + 'Chuyện gì xảy ra?',
          ),
          options: [
            B('It throws locally too — <code>fetchSockets()</code> has never returned objects with <code>on</code>', 'Nó ném lỗi ngay ở máy mình — <code>fetchSockets()</code> chưa bao giờ trả về đối tượng có <code>on</code>'),
            B('It works everywhere: the adapter serialises the listener and installs it on the owning worker', 'Nó chạy ở mọi nơi: adapter tuần tự hoá listener và cài nó lên worker đang sở hữu socket'),
            B('It works locally and throws <code>TypeError</code> in the cluster whenever the socket lives elsewhere', 'Nó chạy ở máy mình và ném <code>TypeError</code> trong cụm mỗi khi socket nằm ở worker khác'),
            B('It works everywhere but the handler is called on every worker at once, so the effect happens four times', 'Nó chạy ở mọi nơi nhưng handler bị gọi trên cả bốn worker cùng lúc, nên hiệu ứng xảy ra bốn lần'),
          ],
          correct: 2,
          explanation: EX(
            'Measured on a single server with the default adapter: the returned object had <code>constructor.name === "Socket"</code>, it was identical (<code>===</code>) to the real socket, and <code>on</code> was a working function. With a cluster adapter a remote entry is a <code>RemoteSocket</code> instead, and reading that class straight out of <code>node_modules</code> shows its prototype carries only <code>timeout, emit, join, leave, disconnect</code>. The mental model: you can give a remote socket ORDERS, because an order serialises; you cannot ask it to call you back, because that would mean shipping a function to another process.',
            'Đo trên một máy chủ đơn với adapter mặc định: đối tượng trả về có <code>constructor.name === "Socket"</code>, nó đồng nhất (<code>===</code>) với socket thật, và <code>on</code> là một hàm chạy được. Với adapter cụm thì một phần tử ở xa lại là <code>RemoteSocket</code>, và đọc thẳng lớp đó trong <code>node_modules</code> cho thấy prototype của nó chỉ mang <code>timeout, emit, join, leave, disconnect</code>. Mô hình tư duy: bạn RA LỆNH được cho một socket ở xa, vì một mệnh lệnh thì tuần tự hoá được; bạn không nhờ nó gọi ngược lại cho bạn được, vì như thế là phải chuyển một hàm sang tiến trình khác.',
          ),
        }),

        mcq({
          prompt: B(
            'On a single-process server with the default in-memory adapter, what does <code>io.serverSideEmit("dem", cb)</code> do?',
            'Trên một máy chủ một tiến trình dùng adapter mặc định trong bộ nhớ, <code>io.serverSideEmit("dem", cb)</code> làm gì?',
          ),
          options: [
            B('It calls <code>cb(null, [])</code> straight away, since there are no other servers to ask', 'Nó gọi <code>cb(null, [])</code> ngay lập tức, vì không còn máy chủ nào khác để hỏi'),
            B('It throws synchronously, so a <code>try/catch</code> around the call is enough to detect it', 'Nó ném lỗi đồng bộ, nên bọc lời gọi trong <code>try/catch</code> là đủ để phát hiện'),
            B('It calls <code>cb(err)</code> after the ack timeout with a "not supported" message', 'Nó gọi <code>cb(err)</code> sau khi hết giờ ack, kèm thông điệp "không hỗ trợ"'),
            B('It logs "this adapter does not support the serverSideEmit() functionality" and the callback never runs', 'Nó ghi log "this adapter does not support the serverSideEmit() functionality" và callback không bao giờ chạy'),
          ],
          correct: 3,
          explanation: EX(
            'Measured, and the silence is the point: no throw, no error argument, no empty array — just a line on stderr and a callback that never fires. A monitoring endpoint written this way hangs forever in development and looks like a slow database. Detect the situation up front instead by logging <code>io.of("/").adapter.constructor.name</code> at boot: <code>"Adapter"</code> means in-memory, <code>"RedisAdapter"</code> means the cluster wiring is live.',
            'Đo thật, và chính sự im lặng mới là điểm mấu chốt: không ném lỗi, không tham số lỗi, không mảng rỗng — chỉ một dòng ra stderr và một callback không bao giờ nổ. Một endpoint giám sát viết theo lối này sẽ treo mãi mãi khi phát triển và trông giống như cơ sở dữ liệu chạy chậm. Hãy phát hiện tình huống này từ đầu bằng cách ghi log <code>io.of("/").adapter.constructor.name</code> lúc khởi động: <code>"Adapter"</code> nghĩa là trong bộ nhớ, <code>"RedisAdapter"</code> nghĩa là dây nối cụm đã sống.',
          ),
        }),

        mcq({
          prompt: B(
            'On a four-worker cluster with a working adapter, an endpoint runs <code>io.serverSideEmit("get-stats", cb)</code> and every worker answers with its local count. Choose TWO true statements.',
            'Trên cụm bốn worker có adapter hoạt động, một endpoint chạy <code>io.serverSideEmit("get-stats", cb)</code> và mỗi worker trả lời bằng số đếm cục bộ của nó. Chọn HAI phát biểu ĐÚNG.',
          ),
          options: [
            B('The callback receives three responses, not four — the sender never answers itself', 'Callback nhận ba phản hồi chứ không phải bốn — người gửi không bao giờ tự trả lời chính mình'),
            B('If one worker is slow you get an error and NO partial results at all', 'Nếu một worker chậm thì bạn nhận lỗi và KHÔNG có kết quả từng phần nào cả'),
            B('The responses arrive sorted by worker pid, so you can identify who answered', 'Các phản hồi về theo thứ tự pid của worker, nên bạn nhận diện được ai đã trả lời'),
            B('You may pass a callback as an argument; the adapter will invoke it on each worker', 'Bạn được phép truyền một hàm callback làm tham số; adapter sẽ gọi nó trên từng worker'),
          ],
          correct: [0, 1],
          explanation: EX(
            'The sender is excluded, so a four-worker cluster gives three answers and you must add your own local number to get a total — forgetting that is a dashboard that is quietly 25% low. The callback is all-or-nothing: one slow worker turns the whole thing into an error with no partial data, which is why this belongs on an admin page and never on a user path. Arguments must serialise, so functions are out, and nothing about the ordering is promised.',
            'Người gửi bị loại ra, nên cụm bốn worker cho ba câu trả lời và bạn phải tự cộng thêm con số cục bộ của mình mới ra tổng — quên điều đó là có một bảng điều khiển âm thầm thiếu 25%. Callback theo lối được-tất-cả-hoặc-không-gì: một worker chậm biến cả lời gọi thành lỗi mà không có dữ liệu từng phần, nên thứ này thuộc về trang quản trị chứ không bao giờ nằm trên đường đi của người dùng. Tham số phải tuần tự hoá được nên hàm thì không, và không có lời hứa nào về thứ tự.',
          ),
        }),

        mcq({
          prompt: B(
            'A user upgrades to a paid plan mid-session. Their socket may be on any worker. Which call adds them to the <code>vip</code> room from wherever the upgrade was processed?',
            'Một người dùng nâng cấp lên gói trả phí giữa phiên. Socket của họ có thể nằm ở bất cứ worker nào. Lời gọi nào thêm họ vào room <code>vip</code> từ chỗ đã xử lý việc nâng cấp?',
          ),
          options: [
            B('You cannot: joining a room is only possible from inside that socket\'s own handler', 'Không thể: join một room chỉ làm được từ trong handler của chính socket đó'),
            B('<code>io.of("/").adapter.rooms.get("vip").add(socketId)</code>', '<code>io.of("/").adapter.rooms.get("vip").add(socketId)</code>'),
            B('<code>io.to(`user:${id}`).emit("join", "vip")</code> and let the client re-join', '<code>io.to(`user:${id}`).emit("join", "vip")</code> rồi để client tự join lại'),
            B('<code>await io.in(`user:${id}`).socketsJoin("vip")</code>', '<code>await io.in(`user:${id}`).socketsJoin("vip")</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Measured on one server: <code>socketsJoin</code> on a selector really did add the matching sockets to the room, and with a cluster adapter the instruction travels to whichever worker owns them. Poking <code>adapter.rooms</code> by hand corrupts the adapter\'s bookkeeping and is local anyway. Asking the client to re-join is the pattern that fails exactly when it matters — a background tab may not act on the message for minutes, and a hostile client simply will not.',
            'Đo trên một máy chủ: <code>socketsJoin</code> trên một bộ chọn thật sự đã thêm các socket khớp vào room, và với adapter cụm thì mệnh lệnh ấy đi tới đúng worker đang sở hữu chúng. Thọc tay vào <code>adapter.rooms</code> làm hỏng sổ sách của adapter và dù sao cũng chỉ có tác dụng cục bộ. Nhờ client tự join lại là lối làm hỏng đúng vào lúc quan trọng nhất — một tab chạy nền có thể mất vài phút mới xử lý thông điệp, còn một client cố ý phá thì đơn giản là không làm.',
          ),
        }),

        mcq({
          prompt: B(
            'A "log out everywhere" feature revokes the token in the database. Why is <code>await io.in(`user:${id}`).disconnectSockets(true)</code> still required?',
            'Tính năng "đăng xuất mọi nơi" thu hồi token trong cơ sở dữ liệu. Vì sao vẫn cần <code>await io.in(`user:${id}`).disconnectSockets(true)</code>?',
          ),
          options: [
            B('It is not required — revoking the token invalidates the socket on its next heartbeat', 'Không cần — thu hồi token làm socket mất hiệu lực ở nhịp tim kế tiếp'),
            B('Because a socket authenticated an hour ago keeps receiving events; the token is only checked at handshake', 'Vì một socket đã xác thực từ một giờ trước vẫn nhận sự kiện; token chỉ được kiểm lúc bắt tay'),
            B('Because it forces the client to reload, which clears the token from <code>localStorage</code>', 'Vì nó buộc client tải lại trang, nhờ đó xoá token khỏi <code>localStorage</code>'),
            B('Because the adapter refuses to route to a socket whose token is no longer in the database', 'Vì adapter từ chối định tuyến tới một socket có token không còn trong cơ sở dữ liệu'),
          ],
          correct: 1,
          explanation: EX(
            'Auth runs once, in the middleware, before the connection exists. After that the socket is a live pipe and nothing re-checks anything — so a revoked user keeps reading a chat for as long as the tab stays open. Measured: <code>disconnectSockets(true)</code> did drop the socket and the client reported <code>active === false</code>, meaning it did not reconnect on its own. Both halves are needed: revoke stops the NEXT login, disconnecting stops the CURRENT one.',
            'Xác thực chạy một lần, trong middleware, trước khi connection tồn tại. Sau đó socket chỉ là một cái ống đang sống và không có gì kiểm lại điều gì cả — nên một người đã bị thu quyền vẫn đọc được cuộc trò chuyện chừng nào cái tab còn mở. Đo thật: <code>disconnectSockets(true)</code> đã ngắt socket và client báo <code>active === false</code>, nghĩa là nó không tự nối lại. Cần cả hai nửa: thu hồi chặn lần đăng nhập SAU, ngắt kết nối chặn phiên HIỆN TẠI.',
          ),
        }),

        mcq({
          prompt: B(
            'You want one boot-time log line that proves the cluster wiring is live. Which one?',
            'Bạn muốn một dòng log lúc khởi động chứng minh dây nối cụm đã sống. Dòng nào?',
          ),
          options: [
            B('<code>logger.info(io.engine.clientsCount)</code>', '<code>logger.info(io.engine.clientsCount)</code>'),
            B('<code>logger.info(process.env.REDIS_URL)</code>', '<code>logger.info(process.env.REDIS_URL)</code>'),
            B('<code>logger.info(io.of("/").adapter.constructor.name)</code>', '<code>logger.info(io.of("/").adapter.constructor.name)</code>'),
            B('<code>logger.info(io.sockets.adapter.rooms.size)</code>', '<code>logger.info(io.sockets.adapter.rooms.size)</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: it prints <code>"Adapter"</code> for the built-in in-memory one, and it is <code>"RedisAdapter"</code> once the real one is attached. That distinction is worth a log line because the failure it catches is invisible — the code that attaches the adapter is usually wrapped in a <code>try/catch</code> that only warns, so a Redis that was unreachable at boot leaves you with a perfectly healthy-looking server delivering to 1/N of your users. Printing the env var proves only that a string exists.',
            'Đo thật: nó in <code>"Adapter"</code> với bản trong bộ nhớ có sẵn, và là <code>"RedisAdapter"</code> khi bản thật đã được gắn. Sự phân biệt ấy đáng một dòng log vì hỏng hóc mà nó bắt được thì vô hình — đoạn mã gắn adapter thường nằm trong một <code>try/catch</code> chỉ ghi cảnh báo, nên một Redis không với tới được lúc khởi động sẽ để lại cho bạn một máy chủ trông hoàn toàn khoẻ mạnh mà giao hàng cho 1/N số người dùng. In biến môi trường chỉ chứng minh có một chuỗi tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'A team runs four Node workers on ONE VPS under <code>node:cluster</code> and already runs Redis for caching. Which reasoning about the adapter choice is sound?',
            'Một nhóm chạy bốn worker Node trên MỘT VPS bằng <code>node:cluster</code> và đã có sẵn Redis dùng cho cache. Lập luận nào về việc chọn adapter là hợp lý?',
          ),
          options: [
            B('The Postgres adapter is the safest default here: it reuses the database and has no payload limit', 'Postgres adapter là lựa chọn mặc định an toàn nhất ở đây: nó tái dùng cơ sở dữ liệu và không giới hạn kích thước payload'),
            B('No adapter is needed on one machine: workers under <code>node:cluster</code> share memory', 'Không cần adapter khi ở trên một máy: worker dưới <code>node:cluster</code> dùng chung bộ nhớ'),
            B('Only the Redis adapter can work, because <code>node:cluster</code> workers are separate processes', 'Chỉ Redis adapter chạy được, vì các worker của <code>node:cluster</code> là những tiến trình riêng'),
            B('Either the cluster adapter or the Redis adapter works; Redis wins as soon as a second machine appears', 'Cả cluster adapter lẫn Redis adapter đều dùng được; Redis thắng ngay khi có máy thứ hai xuất hiện'),
          ],
          correct: 3,
          explanation: EX(
            'The cluster adapter passes broadcasts over the IPC channel that <code>node:cluster</code> already provides, so it adds no infrastructure and no network hop — a genuinely good fit for a single box, at the cost of never crossing a machine boundary and putting the primary process on the critical path. Redis costs a hop but scales past the VPS, and if Redis is already there, that cost is mostly already paid. Workers do NOT share memory: that is the whole reason an adapter exists. The Postgres adapter uses <code>LISTEN/NOTIFY</code>, which has an 8000-byte payload limit, so "no payload limit" is simply wrong.',
            'Cluster adapter chuyển broadcast qua kênh IPC mà <code>node:cluster</code> vốn đã có, nên nó không thêm hạ tầng và không thêm chặng mạng nào — thật sự hợp với một máy đơn, đổi lại là không bao giờ vượt được ranh giới máy và đặt tiến trình chính vào đường găng. Redis tốn một chặng nhưng mở rộng được ra ngoài cái VPS, và nếu Redis đã có sẵn thì cái giá đó phần lớn đã trả rồi. Các worker KHÔNG dùng chung bộ nhớ: đó chính là toàn bộ lý do adapter tồn tại. Postgres adapter dùng <code>LISTEN/NOTIFY</code> vốn giới hạn payload 8000 byte, nên "không giới hạn kích thước" đơn giản là sai.',
          ),
        }),

        // ── Chương 6 — Ack và bảo đảm giao hàng ─────────────────────────
        mcq({
          prompt: B(
            'A client runs <code>socket.timeout(100).emit("cham", "x", cb)</code> against a handler that only calls back after 400 ms. What exactly does <code>cb</code> receive?',
            'Một client chạy <code>socket.timeout(100).emit("cham", "x", cb)</code> nhắm vào một handler mãi 400 ms sau mới gọi lại. <code>cb</code> nhận đúng những gì?',
          ),
          options: [
            B('<code>cb(err)</code> where <code>err.message</code> is <code>"operation has timed out"</code>, and the second argument is <code>undefined</code>', '<code>cb(err)</code> với <code>err.message</code> là <code>"operation has timed out"</code>, và tham số thứ hai là <code>undefined</code>'),
            B('<code>cb(err)</code> where <code>err.message</code> is <code>"ETIMEDOUT"</code>', '<code>cb(err)</code> với <code>err.message</code> là <code>"ETIMEDOUT"</code>'),
            B('Nothing — a timed-out emit drops the callback entirely to avoid a late double call', 'Không gì cả — một emit hết giờ sẽ bỏ hẳn callback để tránh gọi trùng về sau'),
            B('<code>cb(null, undefined)</code>, and you are expected to detect the timeout yourself', '<code>cb(null, undefined)</code>, và bạn phải tự phát hiện việc hết giờ'),
          ],
          correct: 0,
          explanation: EX(
            'Measured, and the exact string matters because people match on it: <code>operation has timed out</code>. The shape is Node-style, error first — which is why adding <code>.timeout()</code> to an existing <code>emit</code> silently changes the meaning of your callback\'s first parameter from "the response" to "the error", and any handler that was reading <code>arguments[0]</code> as data now reads <code>null</code> on success.',
            'Đo thật, và chuỗi chính xác này quan trọng vì người ta hay so khớp trên nó: <code>operation has timed out</code>. Hình dạng theo lối Node, lỗi trước — nên thêm <code>.timeout()</code> vào một <code>emit</code> có sẵn sẽ âm thầm đổi nghĩa của tham số đầu tiên trong callback từ "phản hồi" thành "lỗi", và mọi handler đang đọc <code>arguments[0]</code> như dữ liệu thì nay đọc ra <code>null</code> khi thành công.',
          ),
        }),

        mcq({
          prompt: B(
            'Same setup: the timeout fires at 100 ms and the real ack arrives at 400 ms. How many times is the callback invoked in total?',
            'Vẫn thiết lập đó: hết giờ ở mốc 100 ms và ack thật về ở mốc 400 ms. Callback được gọi tổng cộng bao nhiêu lần?',
          ),
          options: [
            B('Twice — once with the error, once with the late value, so you must guard with a flag', 'Hai lần — một lần với lỗi, một lần với giá trị về muộn, nên bạn phải tự chặn bằng một cờ'),
            B('Zero, because the pending entry was already discarded when the timer fired', 'Không lần nào, vì mục đang chờ đã bị vứt đi ngay khi bộ đếm nổ'),
            B('Once with the error; the late ack is discarded', 'Một lần với lỗi; ack về muộn bị vứt bỏ'),
            B('Twice, but the second call has the error argument set as well, so it is harmless', 'Hai lần, nhưng lần thứ hai cũng có tham số lỗi nên vô hại'),
          ],
          correct: 2,
          explanation: EX(
            'Measured by counting invocations over 700 ms: exactly one. Socket.IO removes the pending entry when the timer fires, so the late response has nowhere to land. That is convenient, and it is also the whole problem with acks: your code was told "timed out" while the server had in fact already done the work. A timeout means you do not KNOW, not that it failed — which is why every handler behind an ack has to be idempotent.',
            'Đo bằng cách đếm số lần gọi trong 700 ms: đúng một lần. Socket.IO gỡ mục đang chờ ngay khi bộ đếm nổ, nên phản hồi về muộn không còn chỗ nào để đáp xuống. Điều đó tiện, và cũng chính là toàn bộ vấn đề của ack: mã của bạn được báo "hết giờ" trong khi máy chủ thật ra đã làm xong việc rồi. Hết giờ nghĩa là bạn KHÔNG BIẾT, chứ không phải là đã hỏng — nên mọi handler nằm sau một ack đều phải idempotent.',
          ),
        }),

        mcq({
          prompt: B(
            'A server handler answers a business failure with <code>ack({ error: "khong duoc" })</code>. On the client, <code>socket.timeout(500).emit("nem", "q", (err, res) =&gt; …)</code>. What are <code>err</code> and <code>res</code>?',
            'Một handler máy chủ trả lời một thất bại nghiệp vụ bằng <code>ack({ error: "khong duoc" })</code>. Ở phía client, <code>socket.timeout(500).emit("nem", "q", (err, res) =&gt; …)</code>. <code>err</code> và <code>res</code> là gì?',
          ),
          options: [
            B('<code>err</code> is an Error whose message is <code>"khong duoc"</code>; <code>res</code> is <code>undefined</code>', '<code>err</code> là một Error có message là <code>"khong duoc"</code>; <code>res</code> là <code>undefined</code>'),
            B('<code>err</code> is <code>null</code>; <code>res</code> is <code>{ error: "khong duoc" }</code>', '<code>err</code> là <code>null</code>; <code>res</code> là <code>{ error: "khong duoc" }</code>'),
            B('Both are <code>undefined</code>: an ack payload containing <code>error</code> is treated as a rejection and dropped', 'Cả hai đều <code>undefined</code>: một payload ack có chứa <code>error</code> bị coi là từ chối và bị bỏ đi'),
            B('<code>err</code> is <code>{ error: "khong duoc" }</code>; <code>res</code> is <code>null</code>', '<code>err</code> là <code>{ error: "khong duoc" }</code>; <code>res</code> là <code>null</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The transport succeeded — the round trip completed inside the timeout — so the first argument is <code>null</code> and your object arrives intact as the second. Socket.IO has no idea that a key called <code>error</code> means anything. That means <code>if (err) …</code> catches only "we did not hear back", and you need a second, separate check for "we heard back and the answer was no".',
            'Đo thật. Tầng giao vận đã thành công — lượt đi về hoàn tất trong thời hạn — nên tham số đầu là <code>null</code> và object của bạn về nguyên vẹn ở tham số thứ hai. Socket.IO hoàn toàn không biết một khoá tên <code>error</code> có ý nghĩa gì. Nghĩa là <code>if (err) …</code> chỉ bắt được "chúng ta không nghe thấy hồi âm", và bạn cần thêm một phép kiểm thứ hai, tách bạch, cho "đã nghe hồi âm và câu trả lời là không".',
          ),
        }),

        mcq({
          prompt: B(
            'A handler is registered but deliberately never calls its callback. On the client, <code>await socket.timeout(120).emitWithAck("imlang")</code>. What happens?',
            'Một handler được đăng ký nhưng cố ý không bao giờ gọi callback của nó. Ở phía client, <code>await socket.timeout(120).emitWithAck("imlang")</code>. Chuyện gì xảy ra?',
          ),
          options: [
            B('It resolves to <code>undefined</code> after 120 ms; you check the value to detect the timeout', 'Nó resolve thành <code>undefined</code> sau 120 ms; bạn kiểm giá trị để phát hiện hết giờ'),
            B('It hangs forever: <code>emitWithAck</code> ignores <code>timeout()</code> and waits for a real ack', 'Nó treo mãi mãi: <code>emitWithAck</code> phớt lờ <code>timeout()</code> và chờ một ack thật'),
            B('It resolves to <code>null</code> and logs a warning on the server about the missing ack', 'Nó resolve thành <code>null</code> và ghi cảnh báo ở máy chủ về việc thiếu ack'),
            B('It rejects with an Error whose message is <code>"operation has timed out"</code>', 'Nó reject với một Error có message là <code>"operation has timed out"</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Measured both branches of the same API on the same server: with a handler that answers, <code>emitWithAck</code> resolved to the value; with a silent handler it rejected, and the message was the same <code>operation has timed out</code> string the callback form produces. So <code>emitWithAck</code> is the promise face of the same machinery, and it needs a <code>try/catch</code> — an unhandled rejection here is the "our app just stops" bug. Forgetting to call <code>ack</code> on the server is the single most common cause of it.',
            'Đo cả hai nhánh của cùng một API trên cùng một máy chủ: với handler có trả lời thì <code>emitWithAck</code> resolve ra giá trị; với handler im lặng thì nó reject, và thông điệp đúng bằng chuỗi <code>operation has timed out</code> mà dạng callback sinh ra. Vậy <code>emitWithAck</code> là bộ mặt promise của cùng một cỗ máy, và nó cần <code>try/catch</code> — một rejection không bắt ở đây chính là lỗi "ứng dụng của chúng tôi tự dưng đứng". Quên gọi <code>ack</code> ở máy chủ là nguyên nhân số một gây ra nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A retry loop keyed by a client-generated <code>messageId</code> gives up after three attempts and shows "failed to send". The server had in fact applied the message on attempt 1; every ack was lost. What is the right conclusion?',
            'Một vòng thử lại khoá theo <code>messageId</code> do client sinh ra bỏ cuộc sau ba lần và hiển thị "gửi thất bại". Thực tế máy chủ đã áp dụng thông điệp ngay ở lần 1; mọi ack đều bị mất. Kết luận đúng là gì?',
          ),
          options: [
            B('This proves acks are useless; drop them and rely on the client refetching', 'Điều này chứng minh ack là vô dụng; hãy bỏ chúng và dựa vào việc client tải lại'),
            B('The retry loop is broken: with dedupe in place, attempt 2 should have returned success', 'Vòng thử lại bị hỏng: đã có khử trùng lặp thì lần 2 phải trả về thành công'),
            B('The dedupe key should be generated by the server so retries can be matched reliably', 'Khoá khử trùng lặp nên do máy chủ sinh ra để các lần thử lại khớp được với nhau một cách tin cậy'),
            B('The UI is lying, and no amount of retrying can fix it — only a reconciliation read can', 'Giao diện đang nói dối, và thử lại bao nhiêu cũng không sửa được — chỉ một lần đọc đối soát mới sửa được'),
          ],
          correct: 3,
          explanation: EX(
            'Dedupe makes attempts 2 and 3 harmless, but it cannot make an ack survive a link that is dropping acks, so the client legitimately never learns the truth. The honest UI is "not confirmed", plus a reconciliation on reconnect — ask the server what it has since your last known id, rather than asserting failure. Note the key must be generated by the CLIENT: a server-generated id would be different on every attempt and there would be nothing to deduplicate on.',
            'Khử trùng lặp làm lần 2 và 3 trở nên vô hại, nhưng nó không thể làm một cái ack sống sót qua một đường truyền đang đánh rơi ack, nên client hoàn toàn có lý khi không bao giờ biết được sự thật. Giao diện trung thực phải là "chưa xác nhận", cộng một lần đối soát khi nối lại — hỏi máy chủ nó đang có gì kể từ id cuối bạn biết, thay vì khẳng định là thất bại. Lưu ý khoá phải do CLIENT sinh: một id do máy chủ sinh sẽ khác nhau ở mỗi lần thử và chẳng còn gì để khử trùng.',
          ),
        }),

        mcq({
          prompt: B(
            'Which dedupe mechanism is atomic against two concurrent retries hitting two different workers at the same instant?',
            'Cơ chế khử trùng lặp nào là nguyên tử trước hai lần thử lại đồng thời rơi vào hai worker khác nhau ở cùng khoảnh khắc?',
          ),
          options: [
            B('An in-process <code>Map&lt;messageId, timestamp&gt;</code> with an LRU bound', 'Một <code>Map&lt;messageId, timestamp&gt;</code> trong tiến trình kèm giới hạn LRU'),
            B('Reading the row first, and inserting only if the read came back empty', 'Đọc bản ghi trước, và chỉ chèn nếu phép đọc trả về rỗng'),
            B('A UNIQUE constraint on the <code>messageId</code> column, catching the duplicate-key error', 'Một ràng buộc UNIQUE trên cột <code>messageId</code>, bắt lấy lỗi trùng khoá'),
            B('Comparing timestamps and rejecting anything within 100 ms of an existing row', 'So sánh dấu thời gian và từ chối mọi thứ nằm trong 100 ms của một bản ghi đã có'),
          ],
          correct: 2,
          explanation: EX(
            'The database decides, once, and the loser gets a violation it can turn into "already applied" — no window, no coordination. A read-then-write has a gap between the two statements that two workers will eventually land in, and an in-process Map is not shared between workers at all, so it stops nothing in a cluster. Redis <code>SET … NX EX</code> is also atomic, but note the ordering trap: if you claim the key and THEN charge the card, a crash in between means the retry is deduplicated away and the charge never happens.',
            'Cơ sở dữ liệu quyết định, một lần, và kẻ thua nhận một lỗi vi phạm mà nó biến thành "đã áp dụng rồi" — không có khe hở, không cần phối hợp. Đọc-rồi-ghi có một khoảng trống giữa hai câu lệnh mà sớm muộn hai worker sẽ cùng rơi vào, còn một Map trong tiến trình thì không hề dùng chung giữa các worker nên chẳng chặn được gì trong cụm. <code>SET … NX EX</code> của Redis cũng nguyên tử, nhưng chú ý cái bẫy thứ tự: nếu bạn chiếm khoá RỒI mới trừ tiền thẻ, một cú sập ở giữa nghĩa là lần thử lại bị khử trùng đi và tiền không bao giờ được trừ.',
          ),
        }),

        mcq({
          prompt: B(
            'Which ordering guarantee does socket.io actually give?',
            'Socket.IO thật sự cho bảo đảm nào về thứ tự?',
          ),
          options: [
            B('Order is preserved for one socket only; across two sockets, two workers, or a reconnect it is not', 'Thứ tự được giữ trong phạm vi một socket; giữa hai socket, hai worker, hay qua một lần nối lại thì không'),
            B('Order is preserved globally per room, because the adapter serialises the room queue', 'Thứ tự được giữ toàn cục theo từng room, vì adapter tuần tự hoá hàng đợi của room'),
            B('Order is preserved only on WebSocket; polling may reorder because each poll is its own request', 'Thứ tự chỉ được giữ trên WebSocket; polling có thể đảo thứ tự vì mỗi lượt poll là một request riêng'),
            B('No ordering guarantee at all — TCP reorders, so you must always add sequence numbers', 'Không có bảo đảm thứ tự nào cả — TCP đảo thứ tự, nên bạn luôn phải thêm số thứ tự'),
          ],
          correct: 0,
          explanation: EX(
            'Two emits on the same socket land in the order you sent them, on both transports, because they ride the same ordered byte stream. Everything wider than that is unordered: a user\'s two tabs are two sockets, two workers publish into Redis independently, and a reconnect starts a new socket that replays nothing. So a chat UI that must be right uses a monotonic id from the database, not a client timestamp — clocks disagree across machines, which is precisely the case you are trying to order.',
            'Hai lệnh emit trên cùng một socket tới nơi theo đúng thứ tự bạn gửi, trên cả hai transport, vì chúng đi trên cùng một dòng byte có thứ tự. Mọi phạm vi rộng hơn thế đều không có thứ tự: hai tab của một người là hai socket, hai worker publish vào Redis độc lập nhau, và một lần nối lại mở ra socket mới không phát lại gì cả. Nên một giao diện chat cần đúng thì dùng một id tăng dần lấy từ cơ sở dữ liệu, không dùng dấu thời gian của client — đồng hồ các máy không khớp nhau, mà đó đúng là tình huống bạn đang cần sắp thứ tự.',
          ),
        }),

        // ── Chương 7 — WebRTC signalling ────────────────────────────────
        mcq({
          prompt: B(
            'In a one-to-one video call built on socket.io, what travels over the socket and what does not?',
            'Trong một cuộc gọi video một-một dựng trên socket.io, thứ gì đi qua socket và thứ gì thì không?',
          ),
          options: [
            B('Audio goes over the socket and video goes peer-to-peer, because audio is small enough', 'Âm thanh đi qua socket còn video đi ngang hàng, vì âm thanh đủ nhỏ'),
            B('Both signalling and media go over the socket; WebRTC only handles encoding', 'Cả tín hiệu lẫn nội dung đều đi qua socket; WebRTC chỉ lo việc mã hoá'),
            B('Only signalling: SDP offer, SDP answer and ICE candidates. Media goes peer-to-peer over RTP/UDP', 'Chỉ tín hiệu: SDP offer, SDP answer và ICE candidate. Nội dung đi ngang hàng qua RTP/UDP'),
            B('Only ICE candidates; the SDP is exchanged directly between browsers via STUN', 'Chỉ ICE candidate; SDP được hai trình duyệt trao đổi trực tiếp qua STUN'),
          ],
          correct: 2,
          explanation: EX(
            'The socket carries a handful of small text messages so the two browsers can find each other and agree on codecs; after that the media stream never touches your server. That is what makes the architecture affordable — if a megabit-per-second stream went through the process, a thousand concurrent calls would be a gigabit of your bandwidth. STUN does not carry SDP: it only tells a peer what its own public address looks like from outside.',
            'Socket chở một nhúm thông điệp văn bản nhỏ để hai trình duyệt tìm được nhau và thống nhất bộ mã hoá; sau đó dòng nội dung không bao giờ chạm vào máy chủ của bạn. Chính điều đó làm kiến trúc này rẻ — nếu một dòng cỡ một megabit mỗi giây đi qua tiến trình thì một nghìn cuộc gọi đồng thời là một gigabit băng thông của bạn. STUN không chở SDP: nó chỉ cho một peer biết địa chỉ công khai của chính nó trông thế nào từ bên ngoài.',
          ),
        }),

        mcq({
          prompt: B(
            'A call fails on one old Android handset and a teammate proposes rewriting the SDP inside the server\'s <code>call:offer</code> handler to force H.264. What is the objection?',
            'Một cuộc gọi hỏng trên một máy Android cũ và một đồng nghiệp đề xuất sửa lại SDP ngay trong handler <code>call:offer</code> của máy chủ để ép dùng H.264. Phản đối là gì?',
          ),
          options: [
            B('H.264 is not a valid codec in an SDP <code>m=video</code> line, so the rewrite cannot be expressed', 'H.264 không phải bộ mã hoá hợp lệ trong dòng <code>m=video</code> của SDP, nên không viết được phép sửa đó'),
            B('The SDP is encrypted end-to-end by DTLS, so the server cannot read it in the first place', 'SDP được DTLS mã hoá đầu-cuối nên máy chủ vốn không đọc được'),
            B('It would work but costs CPU, so it should be done in a worker thread', 'Nó sẽ chạy được nhưng tốn CPU, nên phải làm trong một worker thread'),
            B('SDP munging on the server breaks negotiation for everyone else, and the fix belongs on the client', 'Sửa SDP ở máy chủ làm hỏng đàm phán cho tất cả những người khác, và chỗ sửa đúng là ở client'),
          ],
          correct: 3,
          explanation: EX(
            'The signalling server is deliberately dumb: it relays a blob it does not parse. The moment it edits that blob it becomes a participant in a negotiation it does not understand, and with modern Unified Plan SDP a hand-edit tends to break the mapping between media sections and transceivers — so you fix one handset and quietly damage the other 99%. The supported way to express a codec preference is <code>RTCRtpTransceiver.setCodecPreferences()</code>, on the client, for that client. The SDP is not encrypted; DTLS protects the media, and the SDP is what carries the keys.',
            'Máy chủ tín hiệu cố ý ngu: nó chuyển tiếp một khối dữ liệu mà nó không phân tích. Ngay khi nó sửa khối ấy, nó trở thành một bên tham gia vào cuộc đàm phán mà nó không hiểu, và với SDP kiểu Unified Plan hiện đại thì một phép sửa tay thường phá vỡ ánh xạ giữa các phần media và các transceiver — nên bạn sửa được một cái máy rồi âm thầm làm hỏng 99% còn lại. Cách được hỗ trợ để nêu ưu tiên bộ mã hoá là <code>RTCRtpTransceiver.setCodecPreferences()</code>, ở phía client, cho đúng client đó. SDP không bị mã hoá; DTLS bảo vệ nội dung, còn SDP chính là thứ chở khoá.',
          ),
        }),

        mcq({
          prompt: B(
            'During a call the server relays candidates of three kinds. Match each to what it means.',
            'Trong một cuộc gọi, máy chủ chuyển tiếp ba loại candidate. Hãy ghép mỗi loại với ý nghĩa của nó.',
          ),
          options: [
            B('<code>host</code> = via TURN · <code>srflx</code> = the LAN address · <code>relay</code> = seen by STUN', '<code>host</code> = qua TURN · <code>srflx</code> = địa chỉ LAN · <code>relay</code> = do STUN nhìn thấy'),
            B('<code>host</code> = the LAN address · <code>srflx</code> = the public address STUN saw · <code>relay</code> = an address on a TURN server', '<code>host</code> = địa chỉ LAN · <code>srflx</code> = địa chỉ công khai STUN nhìn thấy · <code>relay</code> = một địa chỉ trên máy chủ TURN'),
            B('<code>host</code> = the address of your socket.io server · <code>srflx</code> = a peer address · <code>relay</code> = a fallback socket.io channel', '<code>host</code> = địa chỉ máy chủ socket.io của bạn · <code>srflx</code> = một địa chỉ peer · <code>relay</code> = kênh socket.io dự phòng'),
            B('All three are the same address written in three notations for compatibility', 'Cả ba là cùng một địa chỉ viết theo ba cách ghi khác nhau cho tương thích'),
          ],
          correct: 1,
          explanation: EX(
            'They are three increasingly expensive guesses at how the two peers can reach each other. A <code>host</code> candidate works when both are on the same network. A server-reflexive one is what the outside world sees after NAT, and it works when the NAT is predictable. A <code>relay</code> candidate routes the media through a TURN server, which always works and is the only one that costs you bandwidth — which is why a deployment that quietly relays a large share of its calls has a bill problem, not a connectivity problem.',
            'Chúng là ba phỏng đoán mỗi lúc một đắt hơn về cách hai peer có thể chạm tới nhau. Candidate <code>host</code> chạy được khi cả hai cùng một mạng. Cái server-reflexive là thứ thế giới bên ngoài nhìn thấy sau NAT, và nó chạy khi NAT còn đoán được. Candidate <code>relay</code> đưa nội dung đi vòng qua một máy chủ TURN, luôn luôn chạy và là cái duy nhất ngốn băng thông của bạn — nên một hệ thống âm thầm relay một tỷ lệ lớn cuộc gọi là đang có vấn đề về hoá đơn, không phải về kết nối.',
          ),
        }),

        mcq({
          prompt: B(
            'Which NAT type makes peer-to-peer impossible even with STUN, and what is the consequence?',
            'Loại NAT nào làm việc kết nối ngang hàng bất khả thi ngay cả khi có STUN, và hệ quả là gì?',
          ),
          options: [
            B('Full-cone NAT, because it maps every destination to a different port', 'Full-cone NAT, vì nó ánh xạ mỗi đích tới một cổng khác nhau'),
            B('Port-restricted NAT, because it blocks UDP entirely and forces a TCP fallback', 'Port-restricted NAT, vì nó chặn hẳn UDP và ép phải lùi về TCP'),
            B('Symmetric NAT, because the external port differs per destination so STUN cannot predict it — those calls need TURN', 'Symmetric NAT, vì cổng bên ngoài khác nhau theo từng đích nên STUN không đoán được — những cuộc gọi đó cần TURN'),
            B('Carrier-grade NAT, because it assigns IPv6 addresses that browsers refuse for WebRTC', 'Carrier-grade NAT, vì nó cấp địa chỉ IPv6 mà trình duyệt từ chối dùng cho WebRTC'),
          ],
          correct: 2,
          explanation: EX(
            'Under a symmetric NAT the mapping the STUN server observed applies only to traffic aimed at the STUN server, so the candidate it hands you is useless to the peer. Nothing on the client can fix that: the only route left is a relay, which means you need a TURN server and you are now paying for the media you had designed not to carry. This is why "we will add TURN later" tends to become a production incident on corporate Wi-Fi and some mobile carriers.',
            'Dưới một NAT đối xứng, ánh xạ mà máy chủ STUN quan sát được chỉ áp dụng cho lưu lượng nhắm tới chính máy chủ STUN, nên candidate nó đưa cho bạn là vô dụng với peer kia. Không có gì ở phía client sửa được điều đó: đường duy nhất còn lại là relay, nghĩa là bạn cần một máy chủ TURN và giờ đang trả tiền cho đúng thứ nội dung mà bạn thiết kế để không phải chở. Vì thế câu "TURN tính sau" hay biến thành một sự cố production trên Wi-Fi công ty và một vài nhà mạng di động.',
          ),
        }),

        mcq({
          prompt: B(
            'A product wants an 8-person group call on the existing peer-to-peer mesh. How many <code>RTCPeerConnection</code> objects exist in total, and what is the real breaking point?',
            'Một sản phẩm muốn cuộc gọi nhóm 8 người trên mạng lưới ngang hàng sẵn có. Tổng cộng có bao nhiêu đối tượng <code>RTCPeerConnection</code>, và điểm gãy thật sự nằm ở đâu?',
          ),
          options: [
            B('56 connections; the breaking point is the server, which must relay all of them', '56 kết nối; điểm gãy là máy chủ, vì nó phải relay hết ngần ấy'),
            B('8 connections, one per participant; the breaking point is the signalling channel', '8 kết nối, mỗi người một cái; điểm gãy là kênh tín hiệu'),
            B('64 connections; the breaking point is browser memory', '64 kết nối; điểm gãy là bộ nhớ trình duyệt'),
            B('28 connections; the breaking point is each participant\'s UPLOAD, which must carry 7 copies of their own stream', '28 kết nối; điểm gãy là băng thông TẢI LÊN của từng người, phải chở 7 bản sao dòng của chính họ'),
          ],
          correct: 3,
          explanation: EX(
            'A mesh is a complete graph, so the connection count is N(N-1)/2 = 28, not N(N-1) = 56 — the course quotes the directed figure, which counts each link twice. But the number that actually kills the feature is per-participant upload: everyone sends their own camera to seven other people, so a stream that costs one unit becomes seven units of upstream on a home connection that has far less upstream than downstream. An SFU fixes exactly that: each peer uploads once and the server forwards.',
            'Mạng lưới đầy đủ là một đồ thị đầy đủ, nên số kết nối là N(N-1)/2 = 28, không phải N(N-1) = 56 — giáo trình trích con số có hướng, tức là đếm mỗi liên kết hai lần. Nhưng con số thật sự giết tính năng này là băng thông tải lên của từng người: ai cũng gửi camera của mình cho bảy người khác, nên một dòng tốn một đơn vị thành bảy đơn vị đường lên trên một kết nối gia đình vốn có đường lên ít hơn hẳn đường xuống. SFU chữa đúng chỗ đó: mỗi peer tải lên một lần và máy chủ chuyển tiếp.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the difference between an SFU and an MCU, and where does socket.io sit?',
            'Khác nhau giữa SFU và MCU là gì, và socket.io đứng ở đâu?',
          ),
          options: [
            B('An SFU forwards each stream without decoding; an MCU decodes and mixes into one. socket.io stays the control plane in both', 'SFU chuyển tiếp từng dòng mà không giải mã; MCU giải mã rồi trộn thành một. socket.io vẫn là mặt điều khiển trong cả hai'),
            B('An SFU mixes streams to save client bandwidth; an MCU forwards them to save server CPU', 'SFU trộn các dòng để tiết kiệm băng thông client; MCU chuyển tiếp chúng để tiết kiệm CPU máy chủ'),
            B('They are two names for the same thing; the choice is only which vendor you buy from', 'Đó là hai tên gọi của cùng một thứ; chọn cái nào chỉ là chọn mua của nhà cung cấp nào'),
            B('An SFU replaces socket.io entirely, since it also carries the signalling', 'SFU thay thế hoàn toàn socket.io, vì nó chở luôn cả tín hiệu'),
          ],
          correct: 0,
          explanation: EX(
            'The SFU is a router: it never touches the codec, so its cost is bandwidth rather than CPU, and the client gets N-1 separate streams to lay out however it likes. The MCU is a mixer: it decodes everything, composes one picture and re-encodes, which is very expensive per call but leaves the client with a single stream to receive — useful for very weak devices and rare otherwise. Either way somebody has to run the room, authenticate people and tell them what transport to use, and that is still socket.io.',
            'SFU là bộ định tuyến: nó không bao giờ đụng tới bộ mã hoá, nên cái giá của nó là băng thông chứ không phải CPU, và client nhận N-1 dòng riêng biệt để tự bày bố ra sao tuỳ ý. MCU là bộ trộn: nó giải mã tất cả, ghép thành một khung hình rồi mã hoá lại, rất đắt cho mỗi cuộc gọi nhưng để client chỉ phải nhận đúng một dòng — hữu ích cho thiết bị rất yếu và hiếm khi cần ngoài trường hợp đó. Kiểu nào thì cũng phải có ai đó điều hành phòng, xác thực người dùng và chỉ cho họ dùng transport nào, và đó vẫn là socket.io.',
          ),
        }),

        mcq({
          prompt: B(
            'A call server tracks in-flight calls in <code>callsBySid: Map&lt;socketId, callInfo&gt;</code>. The caller\'s Wi-Fi drops for four seconds mid-call and socket.io reconnects. Choose TWO consequences.',
            'Một máy chủ gọi theo dõi các cuộc gọi đang diễn ra trong <code>callsBySid: Map&lt;socketId, callInfo&gt;</code>. Wi-Fi của người gọi rớt bốn giây giữa cuộc gọi và socket.io nối lại. Chọn HAI hệ quả.',
          ),
          options: [
            B('The reconnected socket has a new id, so the call cannot be found and hang-up never reaches the peer', 'Socket nối lại có id mới, nên không tìm thấy cuộc gọi và tín hiệu cúp máy không bao giờ tới peer'),
            B('The old entry stays in the Map forever, one leak per dropped call', 'Mục cũ nằm lại trong Map mãi mãi, mỗi cuộc gọi rớt là một lần rò rỉ'),
            B('The media stops as well, because WebRTC rides on the socket.io connection', 'Nội dung cũng dừng theo, vì WebRTC chạy trên kết nối socket.io'),
            B('socket.io re-emits the buffered <code>call:ice</code> candidates once the new socket is up', 'socket.io phát lại các candidate <code>call:ice</code> đã đệm khi socket mới lên'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Same failure as anywhere else state is keyed by <code>socket.id</code>, and it is nastier here because the symptom is a call that looks connected and cannot be ended. Track by <code>callId</code> plus <code>userId</code> instead. Note what does NOT happen: the media survives, because the peer connection is independent of the signalling channel — a call whose signalling died is still passing audio, which is precisely why the ghost-call cleanup has to be explicit. And nothing is replayed on reconnect.',
            'Vẫn là hỏng hóc quen thuộc ở mọi nơi trạng thái bị khoá theo <code>socket.id</code>, và ở đây nó khó chịu hơn vì triệu chứng là một cuộc gọi trông như đang kết nối mà không tài nào kết thúc được. Hãy theo dõi theo <code>callId</code> cộng <code>userId</code>. Chú ý thứ KHÔNG xảy ra: nội dung vẫn sống, vì kết nối peer độc lập với kênh tín hiệu — một cuộc gọi đã chết phần tín hiệu vẫn đang truyền tiếng, và đó chính là lý do việc dọn cuộc gọi ma phải được viết tường minh. Và không có gì được phát lại khi nối lại cả.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Presence that does not flicker (chapter 4).</b> Implement <code>chayPresence(log, audience, debounce)</code>, the core of a presence gateway, over a scripted timeline. No timers: everything is decided from the timestamps in the log.</p>' +
            '<ul>' +
            '<li>Track one <b>Set of socket ids per user</b>. Two tabs are two sockets and one user.</li>' +
            '<li>On <code>connect</code>: if the user has a pending offline, <b>cancel it and emit nothing</b> — that cancellation is what stops the flicker. Otherwise, emit <code>online</code> only when the set goes from empty to one.</li>' +
            '<li>On <code>disconnect</code>: remove the id. If the set is still non-empty, emit nothing. If it became empty, then — when the reason is one the client retries by itself (<code>transport close</code>, <code>ping timeout</code>, <code>transport error</code>) schedule <code>offline</code> at <code>t + debounce</code>; for any other reason emit <code>offline</code> immediately.</li>' +
            '<li>When a scheduled time arrives and the user is still socket-less, emit <code>offline</code> at that time.</li>' +
            '<li>Every emission fans out to <code>audience[user]</code>, one packet per member. Users with no audience entry send nothing.</li>' +
            '</ul>' +
            '<p>Return <code>{ phat, tongGoi }</code>: the emissions in chronological order as <code>{ t, user, online, soGoi }</code>, and the total packet count. The multi-tab room arithmetic here was verified against a real socket.io 4.8.3 server. Keep the given data and the printing block exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 31 — Presence không nhấp nháy (chương 4).</b> Cài đặt <code>chayPresence(log, audience, debounce)</code>, phần lõi của một gateway presence, chạy trên một dòng thời gian đã viết sẵn. Không dùng timer: mọi thứ quyết định từ các mốc thời gian trong log.</p>' +
            '<ul>' +
            '<li>Theo dõi một <b>Set id socket cho mỗi người dùng</b>. Hai tab là hai socket và một người dùng.</li>' +
            '<li>Khi <code>connect</code>: nếu người đó đang có một hẹn báo offline thì <b>huỷ hẹn và không phát gì</b> — chính cú huỷ đó chặn hiện tượng nhấp nháy. Ngược lại, chỉ phát <code>online</code> khi tập đi từ rỗng lên một.</li>' +
            '<li>Khi <code>disconnect</code>: gỡ id đó ra. Nếu tập vẫn còn phần tử thì không phát gì. Nếu tập vừa rỗng thì — với lý do mà client tự thử lại (<code>transport close</code>, <code>ping timeout</code>, <code>transport error</code>) hãy hẹn <code>offline</code> vào <code>t + debounce</code>; với mọi lý do khác thì phát <code>offline</code> ngay.</li>' +
            '<li>Khi tới thời điểm đã hẹn mà người đó vẫn không còn socket nào, phát <code>offline</code> tại đúng thời điểm ấy.</li>' +
            '<li>Mỗi lần phát đều toả tới <code>audience[user]</code>, mỗi thành viên một gói. Người dùng không có mục audience thì không gửi gói nào.</li>' +
            '</ul>' +
            '<p>Trả về <code>{ phat, tongGoi }</code>: danh sách lần phát theo thứ tự thời gian dạng <code>{ t, user, online, soGoi }</code>, và tổng số gói. Phần số học room nhiều tab ở đây đã được đối chiếu với máy chủ socket.io 4.8.3 thật. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const AUDIENCE = { an: ['binh', 'cuc'], binh: ['an'], cuc: ['an', 'binh'] };\n" +
            'const LOG = [\n' +
            "  { t: 0,    loai: 'connect',    user: 'an',   sid: 'a1' },\n" +
            "  { t: 100,  loai: 'connect',    user: 'an',   sid: 'a2' },\n" +
            "  { t: 200,  loai: 'connect',    user: 'binh', sid: 'b1' },\n" +
            "  { t: 900,  loai: 'disconnect', user: 'an',   sid: 'a2', reason: 'client namespace disconnect' },\n" +
            "  { t: 1500, loai: 'disconnect', user: 'an',   sid: 'a1', reason: 'transport close' },\n" +
            "  { t: 2600, loai: 'connect',    user: 'an',   sid: 'a3' },\n" +
            "  { t: 3000, loai: 'connect',    user: 'cuc',  sid: 'c1' },\n" +
            "  { t: 3200, loai: 'disconnect', user: 'binh', sid: 'b1', reason: 'ping timeout' },\n" +
            "  { t: 6000, loai: 'disconnect', user: 'an',   sid: 'a3', reason: 'client namespace disconnect' },\n" +
            "  { t: 7000, loai: 'disconnect', user: 'cuc',  sid: 'c1', reason: 'transport close' },\n" +
            "  { t: 7500, loai: 'connect',    user: 'cuc',  sid: 'c2' },\n" +
            '];\n' +
            'const DEBOUNCE = 2000;\n' +
            "const TU_NOI_LAI = new Set(['transport close', 'ping timeout', 'transport error']);\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chayPresence(log, audience, debounce) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const out = chayPresence(LOG, AUDIENCE, DEBOUNCE);\n' +
            'for (const p of out.phat) {\n' +
            "  console.log('t=' + String(p.t).padStart(4) + ' ' + p.user.padEnd(4) +\n" +
            "    ' online=' + String(p.online).padEnd(5) + ' goi=' + p.soGoi);\n" +
            '}\n' +
            "console.log('tong goi presence = ' + out.tongGoi);\n",
          expectedOutput:
            't=   0 an   online=true  goi=2\n' +
            't= 200 binh online=true  goi=1\n' +
            't=3000 cuc  online=true  goi=2\n' +
            't=5200 binh online=false goi=1\n' +
            't=6000 an   online=false goi=2\n' +
            'tong goi presence = 8',
          sampleSolution:
            'function chayPresence(log, audience, debounce) {\n' +
            '  const sockets = new Map();     // user -> Set<sid>, chính là phép đếm tham chiếu\n' +
            '  const hen = new Map();         // user -> thời điểm sẽ báo offline\n' +
            '  const phat = [];\n' +
            '  let tongGoi = 0;\n\n' +
            '  const batDau = (user, online, t) => {\n' +
            '    const ds = audience[user] ?? [];\n' +
            '    tongGoi += ds.length;\n' +
            '    phat.push({ t, user, online, soGoi: ds.length });\n' +
            '  };\n\n' +
            '  // Trộn mốc của log với mốc các hẹn debounce, xử lý theo đúng thứ tự thời gian.\n' +
            '  const moc = [...log].sort((a, b) => a.t - b.t);\n' +
            '  let i = 0;\n' +
            '  while (i < moc.length || hen.size) {\n' +
            '    const tHen = hen.size ? Math.min(...hen.values()) : Infinity;\n' +
            '    const tLog = i < moc.length ? moc[i].t : Infinity;\n' +
            '    if (tHen <= tLog) {\n' +
            '      for (const [user, t] of [...hen.entries()]) {\n' +
            '        if (t !== tHen) continue;\n' +
            '        hen.delete(user);\n' +
            '        if ((sockets.get(user)?.size ?? 0) === 0) batDau(user, false, tHen);\n' +
            '      }\n' +
            '      continue;\n' +
            '    }\n' +
            '    const e = moc[i++];\n' +
            "    if (e.loai === 'connect') {\n" +
            '      if (!sockets.has(e.user)) sockets.set(e.user, new Set());\n' +
            '      const s = sockets.get(e.user);\n' +
            '      const truocDo = s.size;\n' +
            '      s.add(e.sid);\n' +
            '      if (hen.has(e.user)) { hen.delete(e.user); continue; }   // huỷ hẹn: KHÔNG nhấp nháy\n' +
            '      if (truocDo === 0) batDau(e.user, true, e.t);\n' +
            '    } else {\n' +
            '      const s = sockets.get(e.user);\n' +
            '      if (!s) continue;\n' +
            '      s.delete(e.sid);\n' +
            '      if (s.size > 0) continue;                                 // còn tab khác: im lặng\n' +
            '      if (TU_NOI_LAI.has(e.reason)) hen.set(e.user, e.t + debounce);\n' +
            '      else batDau(e.user, false, e.t);\n' +
            '    }\n' +
            '  }\n' +
            '  return { phat, tongGoi };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — What the adapter fixes, and what it does not (chapter 5).</b> Simulate a four-worker cluster and answer each operation <b>twice</b>: once with no adapter, once with a cluster adapter attached.</p>' +
            '<p>Implement <code>chay(op, sockets, workers, coAdapter)</code>, returning one string:</p>' +
            '<ul>' +
            '<li><code>emit</code> and <code>fetchSockets</code> — the socket ids in <code>op.room</code>, in declaration order, joined by commas, or <code>(khong ai)</code> when empty. <b>Without</b> the adapter only sockets on <code>op.tren</code> count; <b>with</b> it, all of them do.</li>' +
            '<li><code>roomSize</code> — the number of sockets in <code>op.room</code> that live on <code>op.tren</code>. This is <code>adapter.rooms</code>, which is a plain local Map; <b>the adapter does not change it</b>.</li>' +
            '<li><code>socketsCount</code> — the number of sockets on <code>op.tren</code>. This is <code>io.of("/").sockets</code>, also local; <b>the adapter does not change it either</b>.</li>' +
            '<li><code>serverSideEmit</code> — with the adapter, <code>"&lt;workers-1&gt; phan hoi"</code> (the sender never answers itself); without it, <code>"khong bao gio goi callback"</code>.</li>' +
            '</ul>' +
            '<p>Then implement <code>soSanh(ops, sockets, workers)</code> returning one <code>{ nhan, khong, co }</code> per operation, where <code>nhan</code> is <code>op.op + "@" + op.tren</code> plus <code>" room=" + op.room</code> when there is a room.</p>' +
            '<p>The silent <code>serverSideEmit</code> and the local scope of both counters were measured on socket.io 4.8.3; the adapter source in <code>node_modules</code> confirms <code>rooms</code> is a local Map. Keep the given data and the printing block exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 32 — Adapter chữa được gì và KHÔNG chữa được gì (chương 5).</b> Mô phỏng một cụm bốn worker và trả lời mỗi thao tác <b>hai lần</b>: một lần không có adapter, một lần đã gắn adapter cụm.</p>' +
            '<p>Cài đặt <code>chay(op, sockets, workers, coAdapter)</code>, trả về một chuỗi:</p>' +
            '<ul>' +
            '<li><code>emit</code> và <code>fetchSockets</code> — các id socket trong <code>op.room</code>, theo thứ tự khai báo, nối bằng dấu phẩy, hoặc <code>(khong ai)</code> khi rỗng. <b>Không</b> adapter thì chỉ tính socket nằm trên <code>op.tren</code>; <b>có</b> adapter thì tính hết.</li>' +
            '<li><code>roomSize</code> — số socket trong <code>op.room</code> đang sống trên <code>op.tren</code>. Đây là <code>adapter.rooms</code>, một Map cục bộ thuần tuý; <b>adapter KHÔNG đổi nó</b>.</li>' +
            '<li><code>socketsCount</code> — số socket trên <code>op.tren</code>. Đây là <code>io.of("/").sockets</code>, cũng cục bộ; <b>adapter cũng KHÔNG đổi nó</b>.</li>' +
            '<li><code>serverSideEmit</code> — có adapter thì <code>"&lt;số worker trừ 1&gt; phan hoi"</code> (người gửi không bao giờ tự trả lời); không có thì <code>"khong bao gio goi callback"</code>.</li>' +
            '</ul>' +
            '<p>Sau đó cài <code>soSanh(ops, sockets, workers)</code> trả về một <code>{ nhan, khong, co }</code> cho mỗi thao tác, với <code>nhan</code> là <code>op.op + "@" + op.tren</code> cộng thêm <code>" room=" + op.room</code> khi có room.</p>' +
            '<p>Việc <code>serverSideEmit</code> im lặng và phạm vi cục bộ của cả hai bộ đếm đều đã đo trên socket.io 4.8.3; mã nguồn adapter trong <code>node_modules</code> xác nhận <code>rooms</code> là một Map cục bộ. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const WORKERS = ['w0', 'w1', 'w2', 'w3'];\n" +
            'const SOCKETS = [\n' +
            "  { id: 's1', worker: 'w0', rooms: ['thread:42', 'user:7'] },\n" +
            "  { id: 's2', worker: 'w0', rooms: ['thread:42'] },\n" +
            "  { id: 's3', worker: 'w1', rooms: ['thread:42'] },\n" +
            "  { id: 's4', worker: 'w2', rooms: ['thread:42', 'user:9'] },\n" +
            "  { id: 's5', worker: 'w3', rooms: ['user:7'] },\n" +
            "  { id: 's6', worker: 'w1', rooms: [] },\n" +
            '];\n' +
            'const OPS = [\n' +
            "  { op: 'emit',           tren: 'w0', room: 'thread:42' },\n" +
            "  { op: 'emit',           tren: 'w1', room: 'user:7' },\n" +
            "  { op: 'emit',           tren: 'w3', room: 'thread:42' },\n" +
            "  { op: 'fetchSockets',   tren: 'w0', room: 'thread:42' },\n" +
            "  { op: 'roomSize',       tren: 'w2', room: 'thread:42' },\n" +
            "  { op: 'socketsCount',   tren: 'w1' },\n" +
            "  { op: 'serverSideEmit', tren: 'w0' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chay(op, sockets, workers, coAdapter) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function soSanh(ops, sockets, workers) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const bang = soSanh(OPS, SOCKETS, WORKERS);\n' +
            'for (const r of bang) {\n' +
            "  console.log(r.nhan.padEnd(30) + ' | khong adapter: ' + r.khong);\n" +
            "  console.log(''.padEnd(30) + ' | co adapter   : ' + r.co);\n" +
            '}\n' +
            'const adapterChua = bang.filter((r) => r.khong !== r.co).map((r) => r.nhan.split(\'@\')[0]);\n' +
            "console.log('adapter chua duoc: ' + [...new Set(adapterChua)].join(','));\n",
          expectedOutput:
            'emit@w0 room=thread:42         | khong adapter: s1,s2\n' +
            '                               | co adapter   : s1,s2,s3,s4\n' +
            'emit@w1 room=user:7            | khong adapter: (khong ai)\n' +
            '                               | co adapter   : s1,s5\n' +
            'emit@w3 room=thread:42         | khong adapter: (khong ai)\n' +
            '                               | co adapter   : s1,s2,s3,s4\n' +
            'fetchSockets@w0 room=thread:42 | khong adapter: s1,s2\n' +
            '                               | co adapter   : s1,s2,s3,s4\n' +
            'roomSize@w2 room=thread:42     | khong adapter: 1\n' +
            '                               | co adapter   : 1\n' +
            'socketsCount@w1                | khong adapter: 2\n' +
            '                               | co adapter   : 2\n' +
            'serverSideEmit@w0              | khong adapter: khong bao gio goi callback\n' +
            '                               | co adapter   : 3 phan hoi\n' +
            'adapter chua duoc: emit,fetchSockets,serverSideEmit',
          sampleSolution:
            'function chay(op, sockets, workers, coAdapter) {\n' +
            '  const trongRoom = (s) => op.room === undefined || s.rooms.includes(op.room);\n' +
            '  const cucBo = (s) => s.worker === op.tren;\n\n' +
            "  if (op.op === 'emit' || op.op === 'fetchSockets') {\n" +
            '    const ds = sockets.filter((s) => trongRoom(s) && (coAdapter || cucBo(s))).map((s) => s.id);\n' +
            "    return ds.length ? ds.join(',') : '(khong ai)';\n" +
            '  }\n' +
            "  if (op.op === 'roomSize') {\n" +
            '    // adapter.rooms là Map CỤC BỘ — adapter cụm không gộp room ở xa vào.\n' +
            '    return String(sockets.filter((s) => trongRoom(s) && cucBo(s)).length);\n' +
            '  }\n' +
            "  if (op.op === 'socketsCount') {\n" +
            "    // io.of('/').sockets cũng là bản đồ CỤC BỘ — adapter không đụng tới nó.\n" +
            '    return String(sockets.filter(cucBo).length);\n' +
            '  }\n' +
            "  if (op.op === 'serverSideEmit') {\n" +
            "    return coAdapter ? String(workers.length - 1) + ' phan hoi' : 'khong bao gio goi callback';\n" +
            '  }\n' +
            "  return '?';\n" +
            '}\n\n' +
            'function soSanh(ops, sockets, workers) {\n' +
            '  return ops.map((op) => ({\n' +
            "    nhan: op.op + '@' + op.tren + (op.room ? ' room=' + op.room : ''),\n" +
            '    khong: chay(op, sockets, workers, false),\n' +
            '    co: chay(op, sockets, workers, true),\n' +
            '  }));\n' +
            '}\n',
        }),
      ],
    },
  ],
};
