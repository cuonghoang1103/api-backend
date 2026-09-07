/**
 * Socket.IO — Final Exam (FE): 50 câu trắc nghiệm phủ cả 12 mục (Mục 0 + Ch1–Ch11).
 *
 * Đề tự soạn, bám sát `content/courses/socket-io/s00…s11`. MỌI packet, mọi
 * chuỗi lý do disconnect, mọi thông báo lỗi và mọi con số mặc định trong đề đều
 * CHẠY THẬT trên socket.io 4.8.3 + socket.io-client 4.8.3 + engine.io 6.6.10 +
 * engine.io-parser 5.2.3, Node v22.21.0 (macOS arm64) — không chép từ trí nhớ,
 * và bản giải mã packet còn được đối chiếu lại bằng chính `socket.io-parser`.
 *
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *
 *   • `io.to(A).to(B)` là HỢP (union), KHÔNG phải giao (intersection).
 *     Giáo trình nói "intersection" ở ba chỗ — s03-room.mjs:86, :579 và cả
 *     bảng "Column A — ALWAYS TRUE" ở s11-on-thi.mjs. Đo thật với ba socket
 *     (A∈r1, B∈r1∩r2, C∈r2): `io.to('r1').to('r2').emit(...)` làm CẢ BA nhận
 *     đúng MỘT gói. `io.to(['r1','r2'])` và `io.in('r1').in('r2')` cho kết quả
 *     y hệt, và `BroadcastOperator.rooms` sau `.to().to()` là `["r1","r2"]` —
 *     một Set hợp, không có phép giao nào trong mã. Câu 18 hỏi theo MÁY.
 *
 *   • `parse error` VẪN tự kết nối lại. Giáo trình (s01-vong-doi.mjs:349) xếp
 *     nó vào nhóm "deliberate… do not reconnect" cùng io server/client
 *     disconnect. Đo thật (bơm một packet socket.io không giải mã được):
 *     client báo `disconnect reason="parse error"`, `socket.active === true`,
 *     rồi `reconnect_attempt #1` và nối lại thành công. Đọc mã cũng ra thế:
 *     `Manager.onclose()` gọi `reconnect()` cho mọi lý do trừ khi
 *     `skipReconnect`. Câu 8 hỏi theo MÁY.
 *
 *   • `volatile` KHÔNG bị bỏ chỉ vì client đang mất kết nối. Giáo trình
 *     (s03-room.mjs:575) nói "khi user offline một chút (transport close),
 *     buffer server-side đầy, và tin nhắn tiếp theo bị DROP". Đo thật ở phía
 *     client 4.8.3: điều kiện bỏ gói là `flags.volatile && !transport.writable`
 *     — sau `engine.close()` lẫn sau `socket.disconnect()`, `transport.writable`
 *     vẫn là `true`, nên gói volatile VẪN vào `sendBuffer` và VẪN được giao khi
 *     nối lại. Nên đề chỉ hỏi ĐIỀU KIỆN THẬT (transport không ghi được), không
 *     hỏi cái ví dụ "offline một chút" của giáo trình.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/SOCKET-IO-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SOCKET-IO-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/socketio-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all twelve units, from "what is actually on the wire" to "which of the four questions to ask when a realtime feature goes red". Many questions show a real packet dump or a real reason string; every one of those came from running socket.io 4.8.3 and reading what it printed, so read the dump rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, name the layer: the wire, engine.io, socket.io, and your own handler are four different places a bug can live, and the fix never crosses layers. Second, keep the two sids apart — <code>socket.conn.id</code> belongs to engine.io and one of those carries several <code>socket.id</code>s, one per namespace. Third, when a question shows a disconnect reason, notice which SIDE produced it: the server says <code>server namespace disconnect</code> for exactly the event the client calls <code>io server disconnect</code>.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười hai mục, từ "trên dây thật ra có gì" tới "hỏi câu nào trong bốn câu khi một tính năng realtime chuyển đỏ". Nhiều câu cho sẵn một đoạn packet thật hoặc một chuỗi lý do thật; mọi thứ loại đó đều lấy từ việc chạy socket.io 4.8.3 rồi đọc đúng thứ nó in ra, nên hãy đọc đoạn packet thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, gọi tên cái tầng: dây, engine.io, socket.io và handler của chính bạn là bốn chỗ khác nhau mà một con bug có thể trú, và cách chữa không bao giờ vượt tầng. Hai, đừng lẫn hai cái sid — <code>socket.conn.id</code> thuộc về engine.io, và MỘT cái đó cõng nhiều <code>socket.id</code>, mỗi namespace một cái. Ba, khi một câu cho sẵn chuỗi lý do disconnect, hãy để ý nó do PHÍA NÀO sinh ra: máy chủ nói <code>server namespace disconnect</code> cho đúng cái sự kiện mà client gọi là <code>io server disconnect</code>.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'socket-io' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Socket.IO course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Socket.IO (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all twelve units: what socket.io is made of and what is on the wire, the lifecycle of one connection, transports and the upgrade dance, rooms and namespaces, presence and the O(N squared) trap, the Redis adapter and clustering, acks and delivery guarantees, WebRTC signalling, CRDT collaboration, raw WebSocket for devices, the diagnosis cookbook, and what survived measurement.',
        'Năm mươi câu trắc nghiệm phủ cả mười hai mục: socket.io làm bằng gì và trên dây có gì, vòng đời một connection, transport và cú upgrade, room và namespace, presence và bẫy O(N bình phương), Redis adapter và cluster, ack và bảo đảm giao hàng, signalling WebRTC, soạn thảo cộng tác bằng CRDT, WebSocket thuần cho thiết bị, sách công thức chẩn đoán, và cái sống qua đo lường.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Mục 0 — Socket.IO thật sự là gì, và trên dây có gì (5 câu) ─── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'Which sentence describes what Socket.IO is built out of?',
            'Câu nào mô tả đúng Socket.IO được làm bằng những gì?',
          ),
          options: [
            B(
              'It is a thin wrapper over the browser <code>WebSocket</code> object that adds JSON serialisation and nothing else',
              'Nó là một lớp bọc mỏng quanh đối tượng <code>WebSocket</code> của trình duyệt, chỉ thêm việc tuần tự hoá JSON chứ không thêm gì khác',
            ),
            B(
              'It is a rewrite of the WebSocket protocol with its own opcodes, so it does not run over an ordinary HTTP server',
              'Nó là một bản viết lại giao thức WebSocket với bộ opcode riêng, nên không chạy được trên một máy chủ HTTP thông thường',
            ),
            B(
              'It is engine.io — a connection manager doing pings and transport upgrades — wrapped in namespaces and rooms, a routing layer above it',
              'Nó là engine.io — một trình quản lý kết nối lo ping và nâng cấp transport — được bọc bởi namespace và room, một tầng định tuyến nằm trên',
            ),
            B(
              'It is a message broker like Redis pub/sub, with the browser acting as one more subscriber on the same bus',
              'Nó là một message broker kiểu Redis pub/sub, với trình duyệt đóng vai một subscriber nữa trên cùng cái bus đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This one sentence carries the whole course. <b>engine.io</b> owns the connection: it does the handshake, the ping/pong heartbeat, the polling-to-WebSocket upgrade and the reconnect loop. <b>socket.io</b> sits on top and adds routing: event names, acks, namespaces and rooms. That gives four layers — the wire, engine.io, socket.io, your handler — and every surprise in this course is a question of which layer is responsible. Option 1 misses everything engine.io does, which is exactly the part you would have to write by hand if you used ' + c('ws') + ' instead. Option 2 is wrong on the wire: socket.io runs over ordinary HTTP and an ordinary WebSocket upgrade, which is why it shares a port with your REST API. Option 4 confuses a client library with server-side infrastructure — the Redis adapter in Chapter 5 is an optional add-on, not what socket.io is.',
            'Riêng câu này gánh cả khoá học. <b>engine.io</b> sở hữu cái kết nối: nó lo bắt tay, lo nhịp ping/pong, lo cú nâng cấp từ polling lên WebSocket và lo vòng lặp nối lại. <b>socket.io</b> ngồi lên trên và thêm phần định tuyến: tên sự kiện, ack, namespace và room. Thành ra bốn tầng — dây, engine.io, socket.io, handler của bạn — và mọi bất ngờ trong khoá này đều là câu hỏi tầng nào chịu trách nhiệm. Phương án 1 bỏ sót toàn bộ những việc engine.io làm, mà đó đúng là phần bạn phải tự viết nếu dùng ' + c('ws') + ' thay thế. Phương án 2 sai ngay trên dây: socket.io chạy trên HTTP thường và một cú upgrade WebSocket thường, đó là lý do nó dùng chung cổng với REST API của bạn. Phương án 4 lẫn một thư viện client với hạ tầng phía máy chủ — Redis adapter ở Chương 5 là thứ cắm thêm tuỳ chọn, không phải bản chất socket.io.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'A client is configured with ' + c("transports: ['websocket', 'polling']") + '. What does that array actually decide?',
            'Một client cấu hình ' + c("transports: ['websocket', 'polling']") + '. Cái mảng đó thật sự quyết định điều gì?',
          ),
          options: [
            B(
              'Only which transports are ALLOWED — the client still opens on polling first and upgrades afterwards if the proxy lets it through',
              'Chỉ quyết định transport nào được PHÉP — client vẫn mở bằng polling trước rồi mới nâng cấp nếu proxy cho đi qua',
            ),
            B(
              'The order they are tried: WebSocket first, and polling only after the WebSocket attempt has failed',
              'Thứ tự thử: WebSocket trước, còn polling chỉ dùng sau khi lượt thử WebSocket đã hỏng',
            ),
            B(
              'That both are used at once — events go over WebSocket while acks come back over polling',
              'Rằng cả hai được dùng cùng lúc — sự kiện đi qua WebSocket còn ack quay về qua polling',
            ),
            B(
              'Nothing on the client: it is a hint sent to the server, which picks the transport and tells the client which one to use',
              'Không quyết định gì ở client: đó là một gợi ý gửi lên máy chủ, máy chủ chọn transport rồi báo lại client dùng cái nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The array is a <b>permission list, not a sequence</b>. By default the client always begins with an HTTP long-poll — it is the thing that gets through every corporate proxy — and then attempts an upgrade to WebSocket in the background. Measured on a local sandbox: <code>connection</code> fires with <code>transport = polling</code>, and the upgrade lands about 10ms later. Reading the array as a try-order is the single most common misreading of socket.io config, and the course keeps it in its "intuitions that lost to measurement" column for that reason. If you genuinely want to skip polling you write ' + c("transports: ['websocket']") + ' — one entry — and accept that the 3-5% of users behind an upgrade-stripping proxy simply cannot connect at all.',
            'Cái mảng đó là một <b>danh sách cho phép, không phải một trình tự</b>. Mặc định client luôn khởi đầu bằng một lượt long-poll HTTP — thứ lọt được qua mọi proxy công ty — rồi mới ngầm thử nâng cấp lên WebSocket. Đo thật trên hộp cát cục bộ: <code>connection</code> nổ với <code>transport = polling</code>, và cú upgrade tới sau đó khoảng 10ms. Đọc cái mảng như một thứ tự thử là kiểu hiểu sai phổ biến nhất về cấu hình socket.io, và giáo trình xếp nó vào cột "trực giác thua đo lường" chính vì thế. Nếu bạn thật sự muốn bỏ hẳn polling thì viết ' + c("transports: ['websocket']") + ' — đúng một phần tử — và chấp nhận rằng 3-5% người dùng nằm sau proxy chặn upgrade sẽ không kết nối được chút nào.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'This is the first frame a real server sent back, byte for byte:' +
            code('0{"sid":"A6HoDAHbgW7s-JwMAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}') +
            'What is the longest the server can take to notice this client has died?',

            'Đây là frame đầu tiên một máy chủ thật gửi về, nguyên từng byte:' +
            code('0{"sid":"A6HoDAHbgW7s-JwMAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}') +
            'Máy chủ mất tối đa bao lâu để nhận ra client này đã chết?',
          ),
          options: [
            B('20 seconds — <code>pingTimeout</code> is measured from the moment the connection is opened', '20 giây — <code>pingTimeout</code> tính từ lúc kết nối được mở'),
            B('45 seconds — the client may die right after answering a ping, so the server waits a whole interval and then the timeout', '45 giây — client có thể chết ngay sau khi vừa trả lời một cái ping, nên máy chủ chờ trọn một chu kỳ rồi mới tới lượt timeout'),
            B('25 seconds — the server declares the socket dead as soon as one <code>pingInterval</code> passes with no traffic', '25 giây — máy chủ tuyên bố socket đã chết ngay khi trôi qua một <code>pingInterval</code> mà không có lưu lượng nào'),
            B('It cannot be known from this frame: detection depends on the operating system TCP keepalive, not on these two numbers', 'Không thể biết từ frame này: việc phát hiện phụ thuộc keepalive TCP của hệ điều hành chứ không phải hai con số kia'),
          ],
          correct: 1,
          explanation: EX(
            'The server sends a PING every <code>pingInterval</code> and then allows <code>pingTimeout</code> for the PONG, so the worst case is <b>the sum</b>: a client that dies one millisecond after answering a ping is not even asked again for 25 seconds, and only then does the 20-second clock start. 25000 + 20000 = 45 seconds. Measured directly by shrinking the numbers: with <code>pingInterval: 300, pingTimeout: 400</code> and a client that silently swallows the engine PING frame (<code>"2"</code>), both sides logged <code>ping timeout</code> at +701ms — the sum, not either number alone. This is why a proxy read timeout must be longer than <code>pingInterval</code>: nginx closing an idle connection at 20s would kill a healthy socket four seconds before its next ping.',
            'Máy chủ gửi một PING mỗi <code>pingInterval</code> rồi cho <code>pingTimeout</code> để chờ PONG, nên trường hợp tệ nhất là <b>tổng của hai số</b>: một client chết đúng một mili giây sau khi vừa trả lời ping thì phải 25 giây nữa mới bị hỏi lại, và chỉ tới lúc đó đồng hồ 20 giây mới bắt đầu chạy. 25000 + 20000 = 45 giây. Đo thẳng bằng cách thu nhỏ hai con số: với <code>pingInterval: 300, pingTimeout: 400</code> và một client nuốt im lặng frame PING của engine (<code>"2"</code>), cả hai phía cùng ghi <code>ping timeout</code> ở mốc +701ms — đúng bằng tổng, không phải một trong hai số. Đó cũng là lý do read timeout của proxy phải dài hơn <code>pingInterval</code>: nginx đóng một kết nối rảnh ở mốc 20 giây là giết một socket khoẻ mạnh bốn giây trước cái ping kế tiếp của nó.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'A single fresh connection produced these two frames in order — first from the handshake, then right after the client sent <code>40</code>:' +
            code('0{"sid":"6RhMuCWsSPfE7gpnAAAA", ... }\n40{"sid":"dtQDtMuQaNSnR0AuAAAA"}') +
            'Why are the two sids different?',

            'Một kết nối mới toanh sinh ra hai frame này theo thứ tự — cái đầu từ lúc bắt tay, cái sau ngay khi client gửi <code>40</code>:' +
            code('0{"sid":"6RhMuCWsSPfE7gpnAAAA", ... }\n40{"sid":"dtQDtMuQaNSnR0AuAAAA"}') +
            'Vì sao hai cái sid lại khác nhau?',
          ),
          options: [
            B('The second frame arrived after the transport upgrade, and an upgrade always issues a new session id', 'Frame thứ hai tới sau cú nâng cấp transport, mà nâng cấp thì luôn cấp một session id mới'),
            B('One of them is the id the load balancer assigned; socket.io keeps it separate so stickiness can be verified', 'Một trong hai là id do bộ cân bằng tải gán; socket.io giữ riêng nó để có thể kiểm tra tính dính'),
            B('The first is a temporary handshake nonce that is thrown away once authentication has passed', 'Cái đầu là một nonce bắt tay tạm thời, bị vứt đi ngay khi việc xác thực đã qua'),
            B('They belong to two different layers: the first is the engine.io connection, the second is one socket.io session on it — one connection can carry several namespaces', 'Chúng thuộc hai tầng khác nhau: cái đầu là kết nối engine.io, cái sau là một phiên socket.io trên đó — một kết nối cõng được nhiều namespace'),
          ],
          correct: 3,
          explanation: EX(
            'Two layers, two identifiers. The engine.io sid names the <b>transport connection</b> and is reachable as <code>socket.conn.id</code>; the socket.io sid names a <b>namespace session</b> on that connection and is <code>socket.id</code>. Measured: <code>socket.id !== socket.conn.id</code> on every connection, and when a second namespace is opened over the same Manager the client gets a second, different <code>socket.id</code> while <code>manager.engine.id</code> stays the one it always was. Option 1 is measurably false — the upgrade to WebSocket was logged and both ids were unchanged across it. Option 3 is the tempting one, but nothing is thrown away: both ids stay valid for the life of the connection, and the room a socket auto-joins is named after <code>socket.id</code>, not the engine one.',
            'Hai tầng, hai định danh. Cái sid của engine.io đặt tên cho <b>kết nối transport</b> và lấy được qua <code>socket.conn.id</code>; cái sid của socket.io đặt tên cho <b>một phiên namespace</b> trên kết nối đó và chính là <code>socket.id</code>. Đo thật: <code>socket.id !== socket.conn.id</code> ở mọi kết nối, và khi mở namespace thứ hai qua cùng một Manager thì client nhận một <code>socket.id</code> thứ hai khác hẳn trong khi <code>manager.engine.id</code> vẫn y nguyên như cũ. Phương án 1 sai và sai đo được — cú nâng cấp lên WebSocket đã được ghi log và cả hai id đều không đổi qua nó. Phương án 3 là cái dễ dụ nhất, nhưng chẳng có gì bị vứt đi cả: cả hai id còn hiệu lực suốt đời kết nối, và cái room mà một socket tự vào mang tên <code>socket.id</code> chứ không phải cái id của engine.',
          ),
        }),

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'In a DevTools WS tab you see this single frame come down from the server:' + code('430["yo"]') + 'What is it?',
            'Trong tab WS của DevTools bạn thấy đúng một frame này từ máy chủ đi xuống:' + code('430["yo"]') + 'Nó là cái gì?',
          ),
          options: [
            B('An event named <code>yo</code> sent to namespace 3 with no acknowledgement requested', 'Một sự kiện tên <code>yo</code> gửi tới namespace 3, không yêu cầu xác nhận nào'),
            B('An acknowledgement for the emit whose ack id was 0, carrying <code>"yo"</code> back to the callback', 'Một xác nhận cho lượt emit mang ack id 0, đem <code>"yo"</code> trả về cho callback'),
            B('An engine.io PONG whose payload happens to be the JSON array <code>["yo"]</code>', 'Một PONG của engine.io mà phần tải tình cờ là mảng JSON <code>["yo"]</code>'),
            B('A binary event: <code>3</code> is the attachment count and <code>0</code> is the placeholder index', 'Một sự kiện nhị phân: <code>3</code> là số đính kèm còn <code>0</code> là chỉ số chỗ giữ'),
          ],
          correct: 1,
          explanation: EX(
            'Read it one character at a time. The leading <code>4</code> is the engine.io type MESSAGE. The next character is the socket.io type, and <code>3</code> is ACK (0 CONNECT, 1 DISCONNECT, 2 EVENT, 3 ACK, 4 CONNECT_ERROR, 5 BINARY_EVENT, 6 BINARY_ACK). No namespace appears, so the namespace is <code>/</code>. Then <code>0</code> is the ack id, matching the <code>420["ev",{"x":1}]</code> that went up earlier — same id, which is how the client finds the right callback. What remains is the argument list handed to that callback. Decoding the same frame with socket.io\'s own <code>Decoder</code> gives <code>ACK nsp=/ id=0 data=["yo"]</code>, confirming the reading. For contrast, a real binary event looks like ' + c('451-["blob",{"_placeholder":true,"num":0}]') + ' — the attachment count sits before the dash, not where option 4 puts it.',
            'Hãy đọc từng ký tự một. Chữ <code>4</code> đứng đầu là kiểu MESSAGE của engine.io. Ký tự kế là kiểu socket.io, và <code>3</code> là ACK (0 CONNECT, 1 DISCONNECT, 2 EVENT, 3 ACK, 4 CONNECT_ERROR, 5 BINARY_EVENT, 6 BINARY_ACK). Không thấy namespace nào, nên namespace là <code>/</code>. Rồi <code>0</code> là ack id, khớp với cái <code>420["ev",{"x":1}]</code> đã đi lên trước đó — cùng một id, và đó chính là cách client tìm đúng callback. Phần còn lại là danh sách tham số trao cho callback ấy. Giải mã đúng frame đó bằng chính <code>Decoder</code> của socket.io cho ra <code>ACK nsp=/ id=0 data=["yo"]</code>, xác nhận cách đọc trên. Để đối chiếu, một sự kiện nhị phân thật trông như ' + c('451-["blob",{"_placeholder":true,"num":0}]') + ' — số đính kèm nằm TRƯỚC dấu gạch, không phải chỗ mà phương án 4 đặt nó.',
          ),
        }),

        /* ── Chương 1 — Vòng đời một connection (5 câu) ──────────────────── */

        // q6 · đáp án 0
        mcq({
          prompt: B(
            'A server logs this line inside its ' + c("io.on('connection')") + ' handler, on a brand-new connection:' +
            code("socket.rooms at connect = [\"VZSneazpeNjNBsgQAAAA\"]") +
            'What is that one entry, and when did the socket join it?',

            'Một máy chủ ghi dòng này bên trong handler ' + c("io.on('connection')") + ' của nó, trên một kết nối mới tinh:' +
            code("socket.rooms at connect = [\"VZSneazpeNjNBsgQAAAA\"]") +
            'Cái phần tử duy nhất đó là gì, và socket vào đó lúc nào?',
          ),
          options: [
            B(
              'It is the socket\'s own id: every socket is put into a private room named after <code>socket.id</code> automatically, before your handler runs',
              'Đó là chính id của socket: mọi socket đều được tự động đưa vào một room riêng mang tên <code>socket.id</code>, trước khi handler của bạn chạy',
            ),
            B(
              'It is the default namespace <code>/</code> rendered as a room, and it disappears as soon as you call <code>socket.join</code> for the first time',
              'Đó là namespace mặc định <code>/</code> hiện ra dưới dạng một room, và nó biến mất ngay khi bạn gọi <code>socket.join</code> lần đầu',
            ),
            B(
              'It is the engine.io session id, kept as a room so that a reconnect can rejoin the same rooms automatically',
              'Đó là session id của engine.io, giữ dưới dạng một room để một lần nối lại có thể tự vào lại đúng các room cũ',
            ),
            B(
              'It is left over from the middleware: <code>io.use</code> joins a temporary room and forgets to leave it',
              'Đó là thứ sót lại từ middleware: <code>io.use</code> vào một room tạm rồi quên rời khỏi nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Every socket is a member of exactly one room the moment it connects, and that room is named after its own <code>socket.id</code>. That is why <code>socket.rooms.size >= 1</code> always holds, and it is what makes ' + c('io.to(socketId).emit(...)') + ' work as a private message with no extra bookkeeping — the id IS a room. Measured on a server with three connected clients: <code>adapter.rooms</code> held five keys, three of them socket ids. It is also why an id-shaped string can appear in <code>adapter.rooms</code> even though nobody ever called <code>join</code> with it. Option 3 gets the layer wrong (it is the socket.io sid, not the engine one) and the consequence wrong: rooms are NOT restored on reconnect unless <code>connectionStateRecovery</code> is on.',
            'Mọi socket đều là thành viên của đúng một room ngay khoảnh khắc nó kết nối, và room đó mang tên chính <code>socket.id</code> của nó. Đó là lý do <code>socket.rooms.size >= 1</code> luôn đúng, và cũng là thứ khiến ' + c('io.to(socketId).emit(...)') + ' hoạt động như một tin nhắn riêng mà không cần sổ sách gì thêm — cái id CHÍNH LÀ một room. Đo thật trên một máy chủ có ba client: <code>adapter.rooms</code> giữ năm khoá, ba trong số đó là id socket. Đó cũng là lý do một chuỗi trông như id có thể xuất hiện trong <code>adapter.rooms</code> dù chưa ai gọi <code>join</code> với nó. Phương án 3 sai tầng (đó là sid của socket.io chứ không phải của engine) và sai luôn hệ quả: room KHÔNG được khôi phục khi nối lại, trừ khi bật <code>connectionStateRecovery</code>.',
          ),
        }),

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'One call to ' + c('socket.disconnect(true)') + ' on the server produced these two log lines, one on each side:' +
            code('[server] disconnect reason = "server namespace disconnect"\n[client] disconnect reason = "io server disconnect"') +
            'What should you conclude?',

            'Một lời gọi ' + c('socket.disconnect(true)') + ' ở phía máy chủ sinh ra hai dòng log này, mỗi phía một dòng:' +
            code('[server] disconnect reason = "server namespace disconnect"\n[client] disconnect reason = "io server disconnect"') +
            'Bạn nên kết luận điều gì?',
          ),
          options: [
            B('Two disconnects happened: the namespace closed first, and the transport closed a moment later', 'Có hai lần ngắt: namespace đóng trước, rồi transport đóng ngay sau đó'),
            B('The reason strings disagree because the client and the server are on different socket.io versions', 'Hai chuỗi lý do lệch nhau vì client và máy chủ chạy hai phiên bản socket.io khác nhau'),
            B('It is one event described from two sides — each side names the disconnect from its own point of view, so a reason string only means something together with the side that printed it', 'Đó là một sự kiện được mô tả từ hai phía — mỗi phía đặt tên cho lần ngắt theo góc nhìn của mình, nên một chuỗi lý do chỉ có nghĩa khi đi kèm phía đã in nó ra'),
            B('The server string is the real reason and the client string is a generic fallback used whenever the server does not send one', 'Chuỗi phía máy chủ mới là lý do thật, còn chuỗi phía client là giá trị dự phòng chung dùng mỗi khi máy chủ không gửi lý do nào'),
          ],
          correct: 2,
          explanation: EX(
            'The reason vocabularies are deliberately different, because "who ended this" is different information on each side. Measured, one event at a time: ' + c('socket.disconnect(true)') + ' on the server gives server <code>server namespace disconnect</code> / client <code>io server disconnect</code>; ' + c('socket.disconnect()') + ' on the client gives client <code>io client disconnect</code> / server <code>client namespace disconnect</code>; killing the engine gives client <code>forced close</code> / server <code>transport close</code>; and ' + c('io.close()') + ' gives the server <code>server shutting down</code>. Copying a reason string out of a bug report without recording which side logged it is how a team ends up debugging the wrong end of the connection for an afternoon.',
            'Bộ từ vựng lý do ở hai phía cố ý khác nhau, bởi "ai kết thúc chuyện này" là thông tin khác nhau với mỗi phía. Đo thật, từng sự kiện một: ' + c('socket.disconnect(true)') + ' ở máy chủ cho máy chủ <code>server namespace disconnect</code> / client <code>io server disconnect</code>; ' + c('socket.disconnect()') + ' ở client cho client <code>io client disconnect</code> / máy chủ <code>client namespace disconnect</code>; giết engine cho client <code>forced close</code> / máy chủ <code>transport close</code>; còn ' + c('io.close()') + ' cho máy chủ <code>server shutting down</code>. Chép một chuỗi lý do ra khỏi báo cáo lỗi mà không ghi lại phía nào đã log nó là cách một đội ngồi gỡ nhầm đầu dây suốt một buổi chiều.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'A client is left at its default settings. For which of these disconnect reasons will the client NOT reconnect on its own, so your code has to call <code>socket.connect()</code> to come back?',
            'Một client để nguyên cấu hình mặc định. Với những lý do disconnect nào dưới đây thì client KHÔNG tự nối lại, nên mã của bạn phải gọi <code>socket.connect()</code> mới quay lại được?',
          ),
          options: [
            B('<code>ping timeout</code> and <code>transport error</code>', '<code>ping timeout</code> và <code>transport error</code>'),
            B('<code>transport close</code> and <code>parse error</code>', '<code>transport close</code> và <code>parse error</code>'),
            B('<code>parse error</code> only — every other reason retries', 'Chỉ <code>parse error</code> — mọi lý do khác đều thử lại'),
            B('<code>io server disconnect</code> and <code>io client disconnect</code>', '<code>io server disconnect</code> và <code>io client disconnect</code>'),
          ],
          correct: 3,
          explanation: EX(
            'The dividing line is <b>deliberate versus unexpected</b>, and only two reasons are deliberate: somebody called <code>disconnect()</code>, on one side or the other. Both set <code>skipReconnect</code>, and the socket reports <code>socket.active === false</code>. Everything else is an accident and the Manager schedules a retry. <b>Including <code>parse error</code></b> — and that is worth checking rather than assuming, because lesson 1.2 files <code>parse error</code> with the deliberate group. Measured by writing an undecodable socket.io frame down a live connection: the client logged <code>disconnect reason="parse error"</code> with <code>socket.active === true</code>, then <code>reconnect_attempt #1</code>, then connected again with a new id. The source agrees: <code>Manager.onclose()</code> calls <code>reconnect()</code> for every reason unless <code>skipReconnect</code> is set, and nothing sets it for a parse failure.',
            'Ranh giới là <b>cố ý hay ngoài ý muốn</b>, và chỉ có hai lý do là cố ý: có ai đó đã gọi <code>disconnect()</code>, ở phía này hoặc phía kia. Cả hai đều bật <code>skipReconnect</code>, và socket báo <code>socket.active === false</code>. Mọi thứ còn lại là tai nạn, và Manager xếp lịch thử lại. <b>Kể cả <code>parse error</code></b> — và chỗ này đáng đi kiểm chứ đừng tin sẵn, vì bài 1.2 xếp <code>parse error</code> chung nhóm cố ý. Đo thật bằng cách ghi một frame socket.io không giải mã được xuống một kết nối đang sống: client ghi <code>disconnect reason="parse error"</code> với <code>socket.active === true</code>, rồi <code>reconnect_attempt #1</code>, rồi kết nối lại với một id mới. Mã nguồn cũng nói vậy: <code>Manager.onclose()</code> gọi <code>reconnect()</code> với mọi lý do trừ khi <code>skipReconnect</code> được bật, và không có gì bật nó khi giải mã hỏng.',
          ),
        }),

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'A chat server joins each socket to <code>thread:42</code> in its <code>connection</code> handler and keeps ' + c('Map<socketId, draft>') + ' in memory. A user rides a lift, the socket drops with <code>transport close</code>, and the client reconnects five seconds later. With no <code>connectionStateRecovery</code> configured, what is true right after the reconnect?',
            'Một máy chủ chat cho mỗi socket vào <code>thread:42</code> trong handler <code>connection</code> và giữ ' + c('Map<socketId, draft>') + ' trong bộ nhớ. Một người dùng đi thang máy, socket rớt với <code>transport close</code>, và client nối lại sau năm giây. Không cấu hình <code>connectionStateRecovery</code>, ngay sau khi nối lại thì điều gì đúng?',
          ),
          options: [
            B(
              'The id is preserved for the recovery window, the rooms are restored, and only messages sent during the gap are lost',
              'Cái id được giữ trong khoảng thời gian khôi phục, các room được phục hồi, và chỉ những tin nhắn gửi trong lúc gián đoạn là mất',
            ),
            B(
              'It is a brand-new socket: a new id, no rooms, and the draft entry is now orphaned under an id that will never come back',
              'Đó là một socket mới tinh: id mới, không room nào, và mục bản nháp giờ mồ côi dưới một cái id sẽ không bao giờ quay lại',
            ),
            B(
              'The socket keeps its id because the browser tab did not change, but the rooms have to be rejoined by hand',
              'Socket giữ nguyên id vì tab trình duyệt không đổi, nhưng các room thì phải vào lại bằng tay',
            ),
            B(
              'Nothing was lost: the server buffers packets for a disconnected socket and flushes them once the same client returns',
              'Không mất gì cả: máy chủ đệm packet cho một socket đã ngắt và xả ra khi đúng client đó quay lại',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A reconnect is not a resume — it is a new connection that happens to come from the same browser. Measured side by side. Without recovery: the id changed, <code>socket.recovered</code> was undefined on the client, and an event emitted to the room during the gap was simply never seen. With <code>connectionStateRecovery</code> switched on, the very same script kept the id, came back with <code>recovered === true</code> and <code>rooms</code> already containing <code>r1</code>, and replayed the two events emitted while it was away. So option 1 describes the recovery feature, which this server did not enable. The practical rule from the measurement: key application state by <b>userId</b>, never by <code>socket.id</code>, or every lift ride leaks one map entry.',
            'Nối lại không phải là tiếp tục — đó là một kết nối mới tình cờ đến từ cùng một trình duyệt. Đo song song hai bên. Không bật khôi phục: id đổi, <code>socket.recovered</code> ở client là undefined, và một sự kiện phát vào room trong lúc gián đoạn thì đơn giản là không bao giờ được thấy. Bật <code>connectionStateRecovery</code> lên, đúng cái kịch bản ấy giữ nguyên id, quay lại với <code>recovered === true</code> và <code>rooms</code> đã sẵn có <code>r1</code>, đồng thời phát lại hai sự kiện đã gửi lúc nó vắng mặt. Nên phương án 1 mô tả đúng tính năng khôi phục, thứ mà máy chủ này không bật. Quy tắc thực dụng rút ra từ phép đo: khoá trạng thái ứng dụng theo <b>userId</b>, đừng bao giờ theo <code>socket.id</code>, không thì mỗi lượt đi thang máy lại rò một mục trong map.',
          ),
        }),

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'A server registers an auth guard and then serves a namespace:' +
            code("io.use((socket, next) => {\n  if (!socket.handshake.auth.token) return next(new Error('unauthorized'));\n  next();\n});\n\nio.of('/chat').on('connection', (socket) => { /* ... */ });") +
            'A client connects to <code>/chat</code> with NO token. What happens?',

            'Một máy chủ đăng ký một chốt xác thực rồi phục vụ một namespace:' +
            code("io.use((socket, next) => {\n  if (!socket.handshake.auth.token) return next(new Error('unauthorized'));\n  next();\n});\n\nio.of('/chat').on('connection', (socket) => { /* ... */ });") +
            'Một client kết nối tới <code>/chat</code> mà KHÔNG có token. Chuyện gì xảy ra?',
          ),
          options: [
            B('It is rejected: <code>io.use</code> guards every namespace, so the client gets <code>connect_error</code>', 'Bị từ chối: <code>io.use</code> canh mọi namespace, nên client nhận <code>connect_error</code>'),
            B('It connects, but the socket is put in a read-only state until a token arrives on the <code>auth</code> event', 'Kết nối được, nhưng socket bị đặt vào trạng thái chỉ-đọc cho tới khi một token tới qua sự kiện <code>auth</code>'),
            B('It connects normally — <code>io.use</code> only guards the main namespace <code>/</code>, so <code>/chat</code> was never protected at all', 'Kết nối bình thường — <code>io.use</code> chỉ canh namespace chính <code>/</code>, nên <code>/chat</code> chưa từng được bảo vệ chút nào'),
            B('The server throws at startup, because a namespace declared after <code>io.use</code> inherits an incompatible middleware chain', 'Máy chủ ném lỗi ngay lúc khởi động, vì một namespace khai sau <code>io.use</code> kế thừa một chuỗi middleware không tương thích'),
          ],
          correct: 2,
          explanation: EX(
            '<code>io</code> is shorthand for <code>io.of("/")</code>, so <code>io.use</code> installs middleware on the <b>main namespace only</b>. Measured: with exactly this shape, a client that connects to <code>/chat</code> carrying the rejected credential connects successfully and the <code>/chat</code> connection handler runs, while the identical credential on <code>/</code> is refused. The guard has to go where the traffic is: ' + c("io.of('/chat').use(...)") + ' — or, for a whole family of namespaces, a parent middleware registered on each. This is one of the most expensive silent bugs in the course, because the auth code exists, gets reviewed, gets tested against <code>/</code>, and protects nothing.',
            '<code>io</code> là cách viết tắt của <code>io.of("/")</code>, nên <code>io.use</code> cài middleware lên <b>duy nhất namespace chính</b>. Đo thật: với đúng hình dạng này, một client kết nối tới <code>/chat</code> mang chính cái thông tin bị từ chối vẫn kết nối thành công và handler connection của <code>/chat</code> vẫn chạy, trong khi cũng thông tin đó trên <code>/</code> thì bị chặn. Cái chốt phải đặt ở nơi có lưu lượng: ' + c("io.of('/chat').use(...)") + ' — hoặc, với cả một họ namespace, một middleware cha đăng ký lên từng cái. Đây là một trong những con bug im lặng đắt đỏ nhất khoá này, bởi mã xác thực có tồn tại, có được review, có được kiểm với <code>/</code>, và không bảo vệ gì cả.',
          ),
        }),

        /* ── Chương 2 — Transport và cú upgrade (6 câu) ──────────────────── */

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'Two Node workers sit behind a round-robin load balancer with no stickiness. A browser connects and immediately fails. This is the real trace, LB line then client line:' +
            code('[lb] GET  -> w0  /socket.io/?EIO=4&transport=polling\n[lb] POST -> w1  /socket.io/?EIO=4&transport=polling&sid=wr27Rkwbf\n[cli] connect_error: "xhr post error"  type=TransportError  description=400') +
            'What is the 400, in one sentence?',

            'Hai worker Node nằm sau một bộ cân bằng tải quay vòng, không có tính dính. Một trình duyệt kết nối và hỏng ngay. Đây là vết chạy thật, dòng LB rồi dòng client:' +
            code('[lb] GET  -> w0  /socket.io/?EIO=4&transport=polling\n[lb] POST -> w1  /socket.io/?EIO=4&transport=polling&sid=wr27Rkwbf\n[cli] connect_error: "xhr post error"  type=TransportError  description=400') +
            'Cái 400 đó là gì, nói trong một câu?',
          ),
          options: [
            B('The POST body exceeded <code>maxHttpBufferSize</code> on worker 1, which rejects oversized polling writes with 400', 'Thân POST vượt <code>maxHttpBufferSize</code> trên worker 1, và worker từ chối lượt ghi polling quá khổ bằng mã 400'),
            B('CORS: the POST is a cross-origin write and worker 1 has a different <code>cors.origin</code> configured from worker 0', 'CORS: lượt POST là một lệnh ghi khác nguồn, và worker 1 cấu hình <code>cors.origin</code> khác worker 0'),
            B('The EIO version in the query string is not supported by worker 1, which is running an older engine.io', 'Phiên bản EIO trong chuỗi truy vấn không được worker 1 hỗ trợ vì nó chạy engine.io cũ hơn'),
            B('Worker 1 has never heard of that sid — the session lives in worker 0\'s memory — so it answers <code>{"code":1,"message":"Session ID unknown"}</code>', 'Worker 1 chưa từng nghe tới cái sid đó — phiên nằm trong bộ nhớ của worker 0 — nên nó trả về <code>{"code":1,"message":"Session ID unknown"}</code>'),
          ],
          correct: 3,
          explanation: EX(
            'A polling handshake is <b>several HTTP requests that must land on the same process</b>, because the session is in that process\'s memory. Round-robin sends the POST somewhere else and that worker has no such sid. Measured directly against a bare engine.io endpoint, the body is exactly ' + c('{"code":1,"message":"Session ID unknown"}') + ' with status 400 — and for contrast, a bad EIO version gives ' + c('{"code":5,"message":"Unsupported protocol version"}') + ' and an unknown transport gives ' + c('{"code":0,"message":"Transport unknown"}') + ', so the numeric code tells you which of the three you are looking at. The fix is at the proxy — <code>ip_hash</code> or <code>hash $cookie_io</code> in nginx — and not in any socket.io setting.',
            'Một cú bắt tay bằng polling là <b>vài request HTTP buộc phải rơi vào cùng một tiến trình</b>, vì phiên nằm trong bộ nhớ của chính tiến trình đó. Quay vòng đưa lượt POST sang chỗ khác, và worker ấy không có cái sid nào như vậy. Đo thẳng vào một endpoint engine.io trần, thân trả về đúng là ' + c('{"code":1,"message":"Session ID unknown"}') + ' với mã 400 — và để đối chiếu, sai phiên bản EIO cho ' + c('{"code":5,"message":"Unsupported protocol version"}') + ' còn transport lạ cho ' + c('{"code":0,"message":"Transport unknown"}') + ', nên con số code nói cho bạn biết đang gặp cái nào trong ba. Chỗ chữa nằm ở proxy — <code>ip_hash</code> hoặc <code>hash $cookie_io</code> trong nginx — chứ không phải ở bất kỳ tuỳ chọn nào của socket.io.',
          ),
        }),

        // q12 · đáp án 0
        mcq({
          prompt: B(
            'Lesson 0.2 estimated polling at "133× the overhead of WebSocket" by dividing 800 header bytes by a 6-byte WebSocket frame. Lesson 2.1 then measured it properly. What did the measurement change?',
            'Bài 0.2 ước lượng polling "nặng gấp 133 lần WebSocket" bằng cách chia 800 byte header cho một frame WebSocket 6 byte. Bài 2.1 sau đó đo lại cho tử tế. Phép đo đã thay đổi điều gì?',
          ),
          options: [
            B(
              'The direction was right but the mechanism was wrong: at the socket.io layer the two cost the SAME, and the real overhead is the HTTP headers per poll cycle plus the extra latency',
              'Hướng thì đúng nhưng cơ chế thì sai: ở tầng socket.io hai bên tốn Y HỆT nhau, còn phần tốn thêm thật sự nằm ở header HTTP mỗi chu kỳ poll cộng với độ trễ tăng thêm',
            ),
            B(
              'The factor was far too small: measured burst traffic put polling at roughly 400× the cost of WebSocket',
              'Hệ số đó nhỏ hơn thực tế rất nhiều: đo trên lưu lượng dồn dập, polling tốn khoảng 400 lần WebSocket',
            ),
            B(
              'Polling turned out to be cheaper, because batching several events into one HTTP response beats sending separate WebSocket frames',
              'Hoá ra polling rẻ hơn, vì gộp nhiều sự kiện vào một phản hồi HTTP lợi hơn gửi từng frame WebSocket riêng',
            ),
            B(
              'Nothing about the cost: the measurement only showed that the 133× applies to upload and not to download',
              'Không thay đổi gì về chi phí: phép đo chỉ cho thấy con số 133 lần áp cho chiều lên chứ không áp cho chiều xuống',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The measured result was 681 bytes for 20 messages on <b>both</b> transports — identical, because that is the socket.io payload and the transport does not touch it. What differs sits underneath: every poll cycle carries a full set of HTTP headers, so the real ratio runs from about 2.7× when messages arrive in bursts (many events per poll) to about 133× when they trickle in one at a time (one poll per event). And the reason to upgrade is usually not bytes at all but <b>latency</b>: polling costs an extra round trip or two per interaction. The course keeps the wrong estimate visible on purpose — a division that was never checked against a probe is the exact failure this exam keeps testing.',
            'Kết quả đo là 681 byte cho 20 tin nhắn trên <b>cả hai</b> transport — y hệt nhau, bởi đó là phần tải của socket.io và transport không đụng tới nó. Thứ khác nhau nằm bên dưới: mỗi chu kỳ poll cõng nguyên một bộ header HTTP, nên tỷ lệ thật chạy từ khoảng 2,7 lần khi tin nhắn tới dồn dập (nhiều sự kiện mỗi lượt poll) tới khoảng 133 lần khi chúng nhỏ giọt từng cái một (mỗi sự kiện một lượt poll). Và lý do để nâng cấp thường không phải số byte mà là <b>độ trễ</b>: polling tốn thêm một tới hai vòng khứ hồi mỗi lượt tương tác. Giáo trình cố ý để nguyên con số ước lượng sai — một phép chia chưa từng đối chiếu với phép đo chính là kiểu hỏng mà bài thi này liên tục kiểm.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'A team runs four workers, hits the "some users get nothing" bug, attaches <code>@socket.io/redis-adapter</code>, and confirms the "Redis adapter attached" log on every worker. Broadcasts are now complete — but a slice of users still cannot connect at all, with HTTP 400 on their polling requests. Why?',
            'Một đội chạy bốn worker, gặp bug "một số người dùng không nhận được gì", gắn <code>@socket.io/redis-adapter</code> vào, và xác nhận dòng log "Redis adapter attached" ở mọi worker. Broadcast giờ đã đủ — nhưng một phần người dùng vẫn không kết nối nổi, với mã HTTP 400 trên các request polling của họ. Vì sao?',
          ),
          options: [
            B('The adapter needs <code>sharded pub/sub</code> enabled before it can carry handshake traffic across workers', 'Adapter cần bật <code>sharded pub/sub</code> thì mới cõng được lưu lượng bắt tay giữa các worker'),
            B('The adapter shares broadcasts, not sessions — a polling handshake still has to reach one worker, so sticky sessions are a separate requirement it does not replace', 'Adapter chia sẻ broadcast chứ không chia sẻ phiên — một cú bắt tay bằng polling vẫn phải tới đúng một worker, nên tính dính là một yêu cầu riêng mà nó không thay thế được'),
            B('Redis is rate-limiting the handshake channel; raising <code>maxmemory-policy</code> to <code>noeviction</code> clears it', 'Redis đang giới hạn tốc độ kênh bắt tay; đổi <code>maxmemory-policy</code> sang <code>noeviction</code> là hết'),
            B('Those users are on WebSocket and the adapter only relays polling packets, so their upgrade is refused', 'Những người dùng đó đang ở WebSocket còn adapter chỉ tiếp sức cho packet polling, nên cú nâng cấp của họ bị từ chối'),
          ],
          correct: 1,
          explanation: EX(
            'Two different problems that both appear at N > 1 worker, and each needs its own fix. The <b>adapter</b> makes an <code>emit</code> on worker A reach sockets held by B, C and D, over Redis pub/sub. <b>Stickiness</b> makes the several HTTP requests of one polling session land on the same worker, because the session lives in that worker\'s memory and nothing replicates it. Fixing only the adapter leaves the 400 exactly as it was; fixing only stickiness leaves 3 in 4 users missing every broadcast. The course puts sticky sessions FIRST on the five-step scaling checklist for this reason, and it is a proxy setting, not a socket.io one.',
            'Hai vấn đề khác nhau cùng lộ ra khi có nhiều hơn một worker, và mỗi cái cần cách chữa riêng. <b>Adapter</b> làm cho một lượt <code>emit</code> ở worker A tới được các socket do B, C, D giữ, thông qua pub/sub của Redis. <b>Tính dính</b> làm cho mấy request HTTP của cùng một phiên polling rơi vào cùng một worker, bởi phiên nằm trong bộ nhớ worker đó và không có gì nhân bản nó cả. Chỉ vá adapter thì cái 400 vẫn y nguyên; chỉ vá tính dính thì 3 trên 4 người dùng vẫn mất mọi broadcast. Giáo trình đặt sticky session ĐẦU TIÊN trong bảng kiểm năm bước chính vì thế, và đó là một tuỳ chọn của proxy, không phải của socket.io.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'You have no browser, only a shell, and you want to prove that a config change reached production. You run:' +
            code('curl -s "https://example.com/socket.io/?EIO=4&transport=polling"') +
            'Which claim does the response body let you settle on the spot?',

            'Bạn không có trình duyệt, chỉ có một shell, và bạn muốn chứng minh một thay đổi cấu hình đã lên tới production. Bạn chạy:' +
            code('curl -s "https://example.com/socket.io/?EIO=4&transport=polling"') +
            'Thân phản hồi cho bạn kết luận ngay tại chỗ điều gì?',
          ),
          options: [
            B('Whether the Redis adapter is attached, since the adapter name is included in the handshake payload', 'Redis adapter đã được gắn hay chưa, vì tên adapter nằm trong phần tải của cú bắt tay'),
            B('Whether this user is authorised, because the JWT middleware runs before the handshake body is written', 'Người dùng này có quyền hay không, vì middleware JWT chạy trước khi thân bắt tay được ghi ra'),
            B('Whether the timing config you deployed is live — the body carries <code>pingInterval</code> and <code>pingTimeout</code> as the running server sees them', 'Cấu hình thời gian bạn deploy đã sống hay chưa — thân phản hồi mang <code>pingInterval</code> và <code>pingTimeout</code> đúng như máy chủ đang chạy nhìn thấy'),
            B('Whether WebSocket is reachable end to end, because the handshake only succeeds once the upgrade has been negotiated', 'WebSocket có thông suốt đầu-cuối hay không, vì cú bắt tay chỉ thành công khi đã thương lượng xong việc nâng cấp'),
          ],
          correct: 2,
          explanation: EX(
            'One unauthenticated GET returns the OPEN packet, and the OPEN packet is the running server describing itself: ' + c('0{"sid":...,"upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}') + '. If you deployed <code>pingTimeout: 60000</code> and this says 20000, the deploy did not take — that is a five-second answer to a question that otherwise costs an afternoon. Option 4 has it backwards: this request IS the polling handshake and the <code>upgrades</code> array only says the server is willing, not that any proxy in between will allow it. Option 2 is wrong at the layer: engine.io opens the session first and socket.io middleware runs later, at the CONNECT packet — which is why a rejected client still gets a valid OPEN and then a <code>44</code> CONNECT_ERROR.',
            'Một lượt GET không cần xác thực trả về packet OPEN, và packet OPEN chính là máy chủ đang chạy tự mô tả mình: ' + c('0{"sid":...,"upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}') + '. Nếu bạn deploy <code>pingTimeout: 60000</code> mà chỗ này ghi 20000 thì bản deploy chưa ăn — đó là câu trả lời trong năm giây cho một câu hỏi mà bình thường tốn cả buổi chiều. Phương án 4 đảo ngược sự thật: chính request này LÀ cú bắt tay bằng polling, và mảng <code>upgrades</code> chỉ nói máy chủ sẵn lòng, không nói proxy nào ở giữa sẽ cho phép. Phương án 2 sai tầng: engine.io mở phiên trước, middleware socket.io chạy sau, ở packet CONNECT — đó là lý do một client bị từ chối vẫn nhận được một OPEN hợp lệ rồi mới tới một <code>44</code> CONNECT_ERROR.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'A server does ' + c("socket.emit('blob', Buffer.from('hi'), { meta: 1 })") + ' to a client on WebSocket. Sniffing the transport shows TWO frames arriving:' +
            code('TEXT  451-["blob",{"_placeholder":true,"num":0},{"meta":1}]\nBIN   <2 bytes>') +
            'What does that tell you about how socket.io moves binary?',

            'Một máy chủ chạy ' + c("socket.emit('blob', Buffer.from('hi'), { meta: 1 })") + ' tới một client đang ở WebSocket. Nghe lén transport thấy HAI frame tới:' +
            code('TEXT  451-["blob",{"_placeholder":true,"num":0},{"meta":1}]\nBIN   <2 bytes>') +
            'Điều đó cho bạn biết gì về cách socket.io chuyển dữ liệu nhị phân?',
          ),
          options: [
            B(
              'The buffer travels as a real binary frame, and the text frame is only a header saying how many attachments follow and where each one plugs back into the payload',
              'Cái buffer đi bằng một frame nhị phân thật, còn frame văn bản chỉ là phần đầu nói có bao nhiêu đính kèm theo sau và mỗi cái cắm trở lại vào chỗ nào trong phần tải',
            ),
            B(
              'The buffer was base64-encoded into the text frame, and the binary frame carries a checksum used to verify it',
              'Cái buffer đã được mã hoá base64 vào frame văn bản, còn frame nhị phân mang một mã kiểm tra dùng để xác minh nó',
            ),
            B(
              'Binary is always split in two so the client can start rendering from the placeholder before the bytes finish arriving',
              'Dữ liệu nhị phân luôn bị tách làm hai để client bắt đầu vẽ từ chỗ giữ trước khi các byte tới hết',
            ),
            B(
              'The second frame is unrelated: socket.io sends binary out of band on a separate connection it opens on demand',
              'Frame thứ hai không liên quan: socket.io gửi dữ liệu nhị phân ngoài luồng, trên một kết nối riêng nó mở khi cần',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Reading the header left to right: <code>4</code> MESSAGE, <code>5</code> BINARY_EVENT, <code>1-</code> one attachment follows, then the payload with the buffer replaced by ' + c('{"_placeholder":true,"num":0}') + '. The client collects attachment 0 from the next binary frame and substitutes it back before calling your handler — measured, the handler received a real <code>Buffer</code> of 2 bytes and the plain object <code>{meta:1}</code> alongside it, with no base64 anywhere. That is over WebSocket. Over <b>polling</b> there is no binary frame available, so the same buffer really does get base64-encoded, costing about 33% extra — which is the practical reason binary-heavy features want the WebSocket upgrade, and why anything over <code>maxHttpBufferSize</code> (1 MB by default) belongs on a plain HTTP upload endpoint instead.',
            'Đọc phần đầu từ trái sang: <code>4</code> MESSAGE, <code>5</code> BINARY_EVENT, <code>1-</code> có một đính kèm đi kèm, rồi tới phần tải với cái buffer bị thay bằng ' + c('{"_placeholder":true,"num":0}') + '. Client nhặt đính kèm số 0 từ frame nhị phân kế tiếp và cắm nó trở lại trước khi gọi handler của bạn — đo thật, handler nhận được một <code>Buffer</code> thật dài 2 byte cùng với đối tượng thường <code>{meta:1}</code>, không có base64 ở đâu cả. Đó là qua WebSocket. Qua <b>polling</b> thì không có frame nhị phân nào để dùng, nên đúng cái buffer ấy thật sự bị mã hoá base64, tốn thêm khoảng 33% — đó là lý do thực dụng khiến các tính năng nặng nhị phân muốn có cú nâng cấp lên WebSocket, và cũng là lý do thứ gì vượt <code>maxHttpBufferSize</code> (mặc định 1 MB) thì nên đi bằng một endpoint tải lên HTTP thường.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'A server runs with ' + c('maxHttpBufferSize: 1024') + '. A client emits a 4000-character string. The server logs:' +
            code('disconnect "transport error"  desc = RangeError: Max payload size exceeded') +
            'What is the right reading of this?',

            'Một máy chủ chạy với ' + c('maxHttpBufferSize: 1024') + '. Một client emit một chuỗi 4000 ký tự. Máy chủ ghi:' +
            code('disconnect "transport error"  desc = RangeError: Max payload size exceeded') +
            'Cách đọc đúng của chuyện này là gì?',
          ),
          options: [
            B('The event was rejected but the connection survived; the client can retry with a smaller payload on the same socket', 'Sự kiện bị từ chối nhưng kết nối vẫn sống; client có thể thử lại với phần tải nhỏ hơn trên đúng socket đó'),
            B('The payload was truncated to 1024 bytes and delivered, so the handler ran with a partially-received string', 'Phần tải bị cắt còn 1024 byte rồi vẫn được giao, nên handler chạy với một chuỗi nhận chưa đủ'),
            B('Only polling is affected: the same emit over WebSocket would have been accepted, because the limit is an HTTP body limit', 'Chỉ polling bị ảnh hưởng: cũng lượt emit đó qua WebSocket sẽ được chấp nhận, vì hạn mức này là hạn mức thân HTTP'),
            B('The whole connection was torn down, so an oversized emit costs the client its socket and everything queued behind it', 'Cả cái kết nối bị dỡ bỏ, nên một lượt emit quá khổ khiến client mất socket của nó cùng mọi thứ đang xếp hàng phía sau'),
          ],
          correct: 3,
          explanation: EX(
            'Measured exactly as shown: the socket disconnected with reason <code>transport error</code> and the description <code>RangeError: Max payload size exceeded</code>, and <code>client.connected</code> was <code>false</code> immediately afterwards. There is no per-event rejection path — the frame is over the limit, so the transport is killed. The name of the option matters here: despite <code>maxHttp</code>, the limit applies to WebSocket frames too, so option 3 is a trap that reads the identifier instead of the behaviour. The default is 1 MB, and raising it is usually the wrong move: a large upload belongs on an HTTP endpoint, where a size limit produces a 413 rather than a dropped realtime session.',
            'Đo được đúng như hiện ra: socket ngắt với lý do <code>transport error</code> và mô tả <code>RangeError: Max payload size exceeded</code>, và <code>client.connected</code> là <code>false</code> ngay sau đó. Không có đường từ chối theo từng sự kiện — frame vượt hạn mức, nên transport bị giết. Cái tên của tuỳ chọn là chỗ gài ở đây: dù mang chữ <code>maxHttp</code>, hạn mức này áp cả cho frame WebSocket, nên phương án 3 là cái bẫy đọc tên định danh thay vì đọc hành vi. Mặc định là 1 MB, và nâng nó lên thường là nước đi sai: một lượt tải lên lớn thì thuộc về một endpoint HTTP, nơi vượt kích thước sinh ra một mã 413 chứ không phải một phiên realtime bị rớt.',
          ),
        }),

        /* ── Chương 3 — Room và namespace (6 câu) ────────────────────────── */

        // q17 · đáp án 1
        mcq({
          prompt: B(
            'Sockets A and B are both in room <code>r1</code>. Inside A\'s handler you have a choice of two lines:' +
            code("io.to('r1').emit('m', 1);        // line 1\nsocket.to('r1').emit('m', 1);    // line 2") +
            'Measured, how many packets does each line deliver to A and to B?',

            'Socket A và B đều ở trong room <code>r1</code>. Bên trong handler của A bạn có hai dòng để chọn:' +
            code("io.to('r1').emit('m', 1);        // dòng 1\nsocket.to('r1').emit('m', 1);    // dòng 2") +
            'Đo thật, mỗi dòng giao bao nhiêu packet cho A và cho B?',
          ),
          options: [
            B('Line 1 gives A=0 B=1, line 2 gives A=1 B=1 — <code>socket.to</code> is the one that includes the sender', 'Dòng 1 cho A=0 B=1, dòng 2 cho A=1 B=1 — <code>socket.to</code> mới là cái bao gồm người gửi'),
            B('Line 1 gives A=1 B=1, line 2 gives A=0 B=1 — <code>socket.to</code> excludes the sender, <code>io.to</code> does not', 'Dòng 1 cho A=1 B=1, dòng 2 cho A=0 B=1 — <code>socket.to</code> loại trừ người gửi, còn <code>io.to</code> thì không'),
            B('Both give A=1 B=1: the two forms are aliases and the difference is only stylistic', 'Cả hai cho A=1 B=1: hai cách viết là bí danh của nhau, khác biệt chỉ là văn phong'),
            B('Both give A=0 B=1: socket.io never echoes an event back to the socket that triggered the handler', 'Cả hai cho A=0 B=1: socket.io không bao giờ dội một sự kiện ngược lại cái socket đã kích hoạt handler'),
          ],
          correct: 1,
          explanation: EX(
            'Measured with three clients and a counter on each: ' + c("io.to('r1').emit") + ' delivered A=1 B=1, while ' + c("socket.to('r1').emit") + ' delivered A=0 B=1. <code>socket.to(...)</code> is exactly ' + c('socket.broadcast.to(...)') + ' — the same run gave an identical A=0 B=1 for the explicit <code>broadcast</code> form. The distinction decides a very common UI bug in both directions: use <code>io.to</code> for a chat message and the sender\'s own message arrives twice (once optimistically, once from the server); use <code>socket.to</code> for a "room state changed" event and the person who caused the change is the only one who does not see it.',
            'Đo với ba client và một bộ đếm ở mỗi cái: ' + c("io.to('r1').emit") + ' giao A=1 B=1, còn ' + c("socket.to('r1').emit") + ' giao A=0 B=1. <code>socket.to(...)</code> chính là ' + c('socket.broadcast.to(...)') + ' — cùng lượt chạy đó cho kết quả y hệt A=0 B=1 với cách viết <code>broadcast</code> tường minh. Phân biệt này quyết định một con bug giao diện rất hay gặp, và hỏng được theo cả hai chiều: dùng <code>io.to</code> cho tin nhắn chat thì tin của chính người gửi tới hai lần (một lần lạc quan, một lần từ máy chủ); dùng <code>socket.to</code> cho sự kiện "trạng thái phòng đã đổi" thì người vừa gây ra thay đổi lại là người duy nhất không thấy nó.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'Three sockets: A is in <code>r1</code> only, B is in both <code>r1</code> and <code>r2</code>, C is in <code>r2</code> only. The server runs:' +
            code("io.to('r1').to('r2').emit('m', 1);") +
            'How many packets does each of A, B and C receive?',

            'Ba socket: A chỉ ở <code>r1</code>, B ở cả <code>r1</code> lẫn <code>r2</code>, C chỉ ở <code>r2</code>. Máy chủ chạy:' +
            code("io.to('r1').to('r2').emit('m', 1);") +
            'A, B và C mỗi bên nhận bao nhiêu packet?',
          ),
          options: [
            B('A=0, B=1, C=0 — chaining <code>.to()</code> intersects the two room memberships, so only the socket in both is reached', 'A=0, B=1, C=0 — nối chuỗi <code>.to()</code> lấy giao của hai tập thành viên, nên chỉ socket ở cả hai mới tới được'),
            B('A=1, B=2, C=1 — the operator visits each room in turn, so the socket in both rooms is served twice', 'A=1, B=2, C=1 — toán tử duyệt từng room một, nên socket ở cả hai room được phục vụ hai lần'),
            B('A=1, B=1, C=1 — the rooms are unioned and the recipient set is deduplicated, so everyone gets exactly one packet', 'A=1, B=1, C=1 — các room được hợp lại và tập người nhận đã khử trùng lặp, nên ai cũng nhận đúng một packet'),
            B('A=0, B=0, C=0 — a second <code>.to()</code> replaces the first, and no socket is in a room literally named <code>r1r2</code>', 'A=0, B=0, C=0 — lệnh <code>.to()</code> thứ hai thay thế lệnh đầu, và không socket nào ở trong một room tên đúng là <code>r1r2</code>'),
          ],
          correct: 2,
          explanation: EX(
            '<b>Measure this one rather than remember it.</b> Run with three real clients, ' + c("io.to('r1').to('r2').emit('m', 1)") + ' delivered A=1 B=1 C=1 — a <b>union with deduplication</b>. ' + c("io.to(['r1','r2'])") + ' and ' + c("io.in('r1').in('r2')") + ' gave byte-identical results, and inspecting the operator shows ' + c("BroadcastOperator.rooms = ['r1','r2']") + ' — a Set of rooms, with no intersection anywhere in the implementation. ' +
            '<p><b>The course says otherwise, and the course is wrong here.</b> Lessons 3.1 and 3.4, and the "always true" table in Chapter 11, all state that <code>io.to(A).to(B)</code> is an intersection and that <code>[A, B]</code> is the union. Both halves fail the same probe. If you genuinely want an intersection there is no operator for it — fetch both sides and filter: ' + c("(await io.in('r1').fetchSockets()).filter(s => s.rooms.has('r2'))") + ', which returned exactly B.</p>' +
            '<p>Believing the intersection story is expensive in the safe-looking direction: you write <code>.to(tenant).to(admins)</code> expecting "admins of this tenant" and you actually broadcast to every admin of every tenant, plus everyone in the tenant.</p>',

            '<b>Câu này hãy ĐO chứ đừng nhớ.</b> Chạy với ba client thật, ' + c("io.to('r1').to('r2').emit('m', 1)") + ' giao A=1 B=1 C=1 — một phép <b>HỢP có khử trùng lặp</b>. ' + c("io.to(['r1','r2'])") + ' và ' + c("io.in('r1').in('r2')") + ' cho kết quả giống hệt tới từng byte, và soi vào toán tử thì thấy ' + c("BroadcastOperator.rooms = ['r1','r2']") + ' — một Set các room, không hề có phép giao nào trong phần cài đặt. ' +
            '<p><b>Giáo trình nói ngược lại, và ở chỗ này giáo trình sai.</b> Bài 3.1, bài 3.4 và cả bảng "luôn đúng" ở Chương 11 đều khẳng định <code>io.to(A).to(B)</code> là phép giao còn <code>[A, B]</code> là phép hợp. Cả hai nửa đều trượt cùng một phép đo. Nếu bạn thật sự cần phép giao thì không có toán tử nào cho nó — lấy cả hai bên rồi lọc: ' + c("(await io.in('r1').fetchSockets()).filter(s => s.rooms.has('r2'))") + ', và lệnh đó trả về đúng B.</p>' +
            '<p>Tin vào câu chuyện phép giao đắt theo đúng cái hướng trông có vẻ an toàn: bạn viết <code>.to(tenant).to(admins)</code> tưởng là "quản trị viên của tenant này", còn thực tế bạn phát tới mọi quản trị viên của mọi tenant, cộng thêm toàn bộ người trong tenant đó.</p>',
          ),
        }),

        // q19 · đáp án 0
        mcq({
          prompt: B(
            'Same three sockets: A in <code>r1</code>, B in <code>r1</code> and <code>r2</code>, C in <code>r2</code>. You want to reach everyone in <code>r1</code> except the people who are also in <code>r2</code>. Which line does it, and what does it deliver?',
            'Vẫn ba socket đó: A ở <code>r1</code>, B ở <code>r1</code> và <code>r2</code>, C ở <code>r2</code>. Bạn muốn tới mọi người trong <code>r1</code> trừ những người đồng thời ở <code>r2</code>. Dòng nào làm được, và nó giao ra sao?',
          ),
          options: [
            B(c("io.to('r1').except('r2').emit(...)") + ' — delivers A=1, B=0, C=0', c("io.to('r1').except('r2').emit(...)") + ' — giao A=1, B=0, C=0'),
            B(c("io.to('r1').not('r2').emit(...)") + ' — delivers A=1, B=0, C=0', c("io.to('r1').not('r2').emit(...)") + ' — giao A=1, B=0, C=0'),
            B(c("io.to('r1').except('r2').emit(...)") + ' — delivers A=1, B=1, C=0, since <code>except</code> filters rooms and not sockets', c("io.to('r1').except('r2').emit(...)") + ' — giao A=1, B=1, C=0, vì <code>except</code> lọc room chứ không lọc socket'),
            B('No selector does it; you have to <code>fetchSockets</code> and emit to each id individually', 'Không selector nào làm được; bạn phải <code>fetchSockets</code> rồi emit tới từng id một'),
          ],
          correct: 0,
          explanation: EX(
            'Measured: ' + c("io.to('r1').except('r2').emit('m', 1)") + ' gave A=1, B=0, C=0. <code>except</code> takes a room name (or an array of them) and removes every socket in it from the recipient set that <code>to</code> built. Since a socket is always a member of a room named after its own id, the same operator does a per-socket exclusion for free: ' + c("io.to('r1').except(socketId)") + '. Option 2 invents a method name that does not exist — the call would throw <code>TypeError: io.to(...).not is not a function</code> rather than silently misbehave, which at least fails loudly. Option 4 describes the fallback you need for an intersection, not for an exclusion.',
            'Đo thật: ' + c("io.to('r1').except('r2').emit('m', 1)") + ' cho A=1, B=0, C=0. <code>except</code> nhận một tên room (hoặc một mảng tên) và gỡ mọi socket trong đó ra khỏi tập người nhận mà <code>to</code> vừa dựng. Vì một socket luôn là thành viên của room mang tên chính id của nó, đúng toán tử ấy cho bạn phép loại trừ theo từng socket mà không tốn gì thêm: ' + c("io.to('r1').except(socketId)") + '. Phương án 2 bịa ra một tên method không tồn tại — lời gọi đó sẽ ném <code>TypeError: io.to(...).not is not a function</code> chứ không âm thầm chạy sai, mà như thế ít nhất còn hỏng ra tiếng. Phương án 4 mô tả đúng cái đường vòng bạn cần cho phép GIAO, không phải cho phép loại trừ.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'A listen-together feature keeps ' + c('hostBySid: Map<string, string>') + ' — one entry per ephemeral room. Rooms are created with <code>socket.join</code> when a session starts. Which statement about cleaning this map up is correct?',
            'Một tính năng nghe chung giữ ' + c('hostBySid: Map<string, string>') + ' — mỗi room tạm một mục. Room được tạo bằng <code>socket.join</code> khi một phiên bắt đầu. Phát biểu nào về việc dọn cái map này là đúng?',
          ),
          options: [
            B('Listen for the adapter\'s <code>delete-room</code> event, which fires once the last member leaves', 'Hãy nghe sự kiện <code>delete-room</code> của adapter, nó nổ khi thành viên cuối cùng rời đi'),
            B('No cleanup is needed: the map keys are room names and socket.io garbage-collects them with the room', 'Không cần dọn: khoá của map là tên room, và socket.io thu gom chúng cùng với cái room'),
            B('Clean up in <code>disconnect</code>, where <code>socket.rooms</code> still lists every room the socket was in', 'Dọn trong <code>disconnect</code>, nơi <code>socket.rooms</code> vẫn liệt kê mọi room mà socket đã ở'),
            B('Clean up in <code>disconnecting</code> — by the time <code>disconnect</code> runs the socket has already left its rooms, and no room-deleted event exists to hook instead', 'Dọn trong <code>disconnecting</code> — tới lúc <code>disconnect</code> chạy thì socket đã rời hết room, và cũng không có sự kiện room-đã-xoá nào để móc vào thay thế'),
          ],
          correct: 3,
          explanation: EX(
            'A room is created by the first <code>join</code> and destroyed by the last <code>leave</code>, entirely inside the adapter, and it emits nothing your code can subscribe to — measured: after the last member left <code>r2</code>, ' + c("adapter.rooms.has('r2')") + ' went straight from <code>true</code> to <code>false</code> with no event in between. So your own state has to be cleaned by hand, and the hook is <code>disconnecting</code>, which fires while membership is still intact: in the same run it logged ' + c('rooms = ["<socket.id>"]') + ' for a socket that had already been removed from the room list by the time <code>disconnect</code> ran. Option 1 names an event the public API does not have. Option 2 is the leak this question is about: socket.io manages its own rooms, never your maps, so every abandoned session leaves one entry behind forever.',
            'Một room được tạo bởi lượt <code>join</code> đầu tiên và bị huỷ bởi lượt <code>leave</code> cuối cùng, hoàn toàn bên trong adapter, và nó không phát ra thứ gì để mã của bạn đăng ký nghe — đo thật: sau khi thành viên cuối rời <code>r2</code>, ' + c("adapter.rooms.has('r2')") + ' nhảy thẳng từ <code>true</code> sang <code>false</code>, không có sự kiện nào ở giữa. Nên trạng thái của chính bạn phải dọn bằng tay, và cái móc là <code>disconnecting</code>, thứ nổ lúc danh sách thành viên còn nguyên: cùng lượt chạy đó nó ghi ' + c('rooms = ["<socket.id>"]') + ' cho một socket mà tới lúc <code>disconnect</code> chạy thì đã bị gỡ khỏi danh sách room. Phương án 1 gọi tên một sự kiện mà API công khai không có. Phương án 2 chính là cái rò rỉ mà câu này nói tới: socket.io quản lý room của nó, không bao giờ quản lý map của bạn, nên mỗi phiên bị bỏ rơi để lại vĩnh viễn một mục.',
          ),
        }),

        // q21 · đáp án 1
        mcq({
          prompt: B(
            'A client opens <code>/chat</code> and then <code>/</code> through the same Manager. Measured, the two sockets have different <code>socket.id</code>s but ' + c('manager.engine.id') + ' is one value. What does that cost, and when is a namespace the right tool?',
            'Một client mở <code>/chat</code> rồi mở <code>/</code> qua cùng một Manager. Đo thật, hai socket có <code>socket.id</code> khác nhau nhưng ' + c('manager.engine.id') + ' chỉ có một giá trị. Chuyện đó tốn gì, và khi nào namespace mới là công cụ đúng?',
          ),
          options: [
            B(
              'It costs a second TCP connection and a second handshake; a namespace is right whenever you want to group events by feature',
              'Nó tốn thêm một kết nối TCP và một cú bắt tay nữa; namespace là đúng mỗi khi bạn muốn nhóm sự kiện theo tính năng',
            ),
            B(
              'It costs nothing on the wire — both namespaces are multiplexed over one connection — so a namespace earns its keep only when you need a hard wall: different auth, multi-tenancy, or a team split',
              'Nó không tốn gì trên dây — hai namespace được ghép kênh trên cùng một kết nối — nên namespace chỉ đáng dùng khi bạn cần một bức tường cứng: xác thực khác nhau, đa khách thuê, hoặc tách đội',
            ),
            B(
              'It costs one extra ping cycle per namespace, so namespaces should be avoided on mobile networks entirely',
              'Nó tốn thêm một chu kỳ ping cho mỗi namespace, nên trên mạng di động thì nên tránh hẳn namespace',
            ),
            B(
              'It costs nothing, and namespaces are strictly better than rooms because they give per-feature middleware for free',
              'Nó không tốn gì, và namespace luôn tốt hơn room vì cho bạn middleware theo từng tính năng miễn phí',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: opening <code>/chat</code> and then <code>/</code> on one Manager produced two distinct <code>socket.id</code> values over a single <code>manager.engine.id</code>, and the wire showed it plainly — ' + c('40/admin,') + ' up, ' + c('40/admin,{"sid":...}') + ' down, on the connection that was already open. So the transport cost of a namespace really is zero, which rules out options 1 and 3. What a namespace buys is <b>isolation</b>: its own middleware chain, its own sid, its own room space. What it costs is that the isolation is real — as Q10 showed, <code>io.use</code> does not reach it, so every namespace needs its own guard, and that duplication is exactly why option 4 overstates the case. For grouping events by feature a room plus an event-name prefix does the same job with none of the duplication.',
            'Đo thật: mở <code>/chat</code> rồi mở <code>/</code> trên một Manager cho ra hai giá trị <code>socket.id</code> khác nhau trên duy nhất một <code>manager.engine.id</code>, và trên dây nó lộ rõ — ' + c('40/admin,') + ' đi lên, ' + c('40/admin,{"sid":...}') + ' đi xuống, ngay trên cái kết nối vốn đã mở. Nên chi phí transport của một namespace đúng là bằng không, và điều đó loại phương án 1 với 3. Cái mà namespace mua cho bạn là <b>sự cô lập</b>: chuỗi middleware riêng, sid riêng, không gian room riêng. Cái nó bắt bạn trả là sự cô lập ấy có thật — như câu 10 đã cho thấy, <code>io.use</code> không với tới nó, nên mỗi namespace cần chốt canh của riêng mình, và chính sự lặp lại đó là lý do phương án 4 nói quá. Còn để nhóm sự kiện theo tính năng thì một room cộng một tiền tố tên sự kiện làm đúng việc ấy mà không phải lặp gì cả.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'A developer adds a heartbeat to the app layer and writes ' + c("socket.emit('connect', { at: Date.now() })") + ' on the client. What happens?',
            'Một lập trình viên thêm nhịp tim ở tầng ứng dụng và viết ' + c("socket.emit('connect', { at: Date.now() })") + ' ở phía client. Chuyện gì xảy ra?',
          ),
          options: [
            B('It works, but the server\'s own <code>connection</code> handler fires a second time for the same socket', 'Nó chạy, nhưng handler <code>connection</code> của máy chủ nổ thêm lần nữa cho cùng một socket'),
            B('It is silently ignored: reserved names are dropped by the parser before they reach the wire', 'Nó bị lờ đi trong im lặng: tên dành riêng bị parser vứt bỏ trước khi tới được dây'),
            B('It throws immediately — <code>"connect" is a reserved event name</code> — so the mistake is caught at the call site', 'Nó ném lỗi ngay — <code>"connect" is a reserved event name</code> — nên cái sai bị bắt ngay tại chỗ gọi'),
            B('It is sent as a normal event; only the server side protects its reserved names', 'Nó được gửi đi như một sự kiện thường; chỉ phía máy chủ mới bảo vệ các tên dành riêng của nó'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: the call threw synchronously with the message <code>"connect" is a reserved event name</code>. The reserved set covers the names socket.io\'s own machinery uses — <code>connect</code>, <code>disconnect</code>, <code>connect_error</code>, <code>newListener</code> and friends — and throwing is a kindness, because an event name that silently shadows the lifecycle would be nearly impossible to find. The habit that avoids the whole class of problem is a naming convention: <code>&lt;feature&gt;:&lt;verb&gt;</code>, as in <code>chat:send</code>, <code>call:offer</code>, <code>device:telemetry</code>. It keeps you clear of the reserved names by construction, makes every emit for one feature greppable, and stops two features colliding on a generic name like <code>update</code>.',
            'Đo thật: lời gọi ném lỗi đồng bộ với thông báo <code>"connect" is a reserved event name</code>. Tập tên dành riêng phủ những cái tên mà bộ máy của chính socket.io dùng — <code>connect</code>, <code>disconnect</code>, <code>connect_error</code>, <code>newListener</code> và mấy cái nữa — và việc ném lỗi là một sự tử tế, bởi một tên sự kiện âm thầm che khuất vòng đời thì gần như không thể tìm ra. Thói quen tránh được cả lớp vấn đề này là một quy ước đặt tên: <code>&lt;tính năng&gt;:&lt;động từ&gt;</code>, kiểu <code>chat:send</code>, <code>call:offer</code>, <code>device:telemetry</code>. Nó giữ bạn cách xa các tên dành riêng ngay từ cách dựng, làm cho mọi lượt emit của một tính năng đều grep ra được, và chặn hai tính năng đụng nhau ở một cái tên chung chung như <code>update</code>.',
          ),
        }),

        /* ── Chương 4 — Presence và bẫy O(N²) (5 câu) ────────────────────── */

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'A presence handler does ' + c("io.emit('presence:update', ...)") + ' on every connect and every disconnect. There are 10,000 sockets connected, and a deploy restarts the server so all of them drop and come back. Roughly how many packets does that cost, and why?',
            'Một handler presence chạy ' + c("io.emit('presence:update', ...)") + ' ở mỗi lần connect và mỗi lần disconnect. Đang có 10.000 socket, và một lượt deploy khởi động lại máy chủ nên tất cả rớt rồi quay lại. Chuyện đó tốn khoảng bao nhiêu packet, và vì sao?',
          ),
          options: [
            B('About 20,000 — one packet per event, since <code>io.emit</code> is a single broadcast the adapter fans out once', 'Khoảng 20.000 — mỗi sự kiện một packet, vì <code>io.emit</code> là một lượt broadcast duy nhất mà adapter chỉ toả ra một lần'),
            B('About 10,000 — the disconnects happen while the server is down, so only the reconnects are broadcast', 'Khoảng 10.000 — các lượt disconnect xảy ra lúc máy chủ đang tắt, nên chỉ các lượt nối lại mới được phát'),
            B('About 100,000,000 — 10,000 reconnects each broadcast to 10,000 sockets; the disconnects cost nothing because nobody is listening yet', 'Khoảng 100.000.000 — 10.000 lượt nối lại, mỗi lượt phát tới 10.000 socket; các lượt disconnect không tốn gì vì chưa ai đang nghe'),
            B('About 200,000,000 — there are 2N events (a disconnect and a reconnect each), and each one is serialised and sent to N sockets, so the cost is 2N squared', 'Khoảng 200.000.000 — có 2N sự kiện (mỗi người một lần rớt và một lần nối lại), và mỗi sự kiện được tuần tự hoá rồi gửi tới N socket, nên chi phí là 2N bình phương'),
          ],
          correct: 3,
          explanation: EX(
            'Count the events, then count the recipients per event. A deploy produces <b>2N</b> presence events — every user disconnects and every user reconnects — and <code>io.emit</code> sends each of them to <b>N</b> sockets. 2 × 10,000 × 10,000 = 200 million packets in the handful of seconds the storm lasts. At ~60 bytes that is 6 GB of egress, and Node serialises the payload once per recipient: at ~2μs each, 200 seconds of CPU, which across 8 cores is 25 seconds during which the process is doing nothing else. Option 1 is the intuition that kills servers — <code>io.emit</code> looks like one call, but the adapter still writes one packet per socket. Option 3 forgets that a socket dropping is itself an event that other, still-connected users are told about.',
            'Đếm số sự kiện, rồi đếm số người nhận trên mỗi sự kiện. Một lượt deploy sinh ra <b>2N</b> sự kiện presence — mỗi người dùng rớt một lần và nối lại một lần — và <code>io.emit</code> gửi mỗi cái tới <b>N</b> socket. 2 × 10.000 × 10.000 = 200 triệu packet trong vài giây cơn bão kéo dài. Với ~60 byte mỗi cái là 6 GB đi ra, và Node tuần tự hoá phần tải một lần cho mỗi người nhận: ~2μs mỗi lần, thành 200 giây CPU, chia trên 8 nhân là 25 giây mà tiến trình không làm được việc gì khác. Phương án 1 chính là cái trực giác giết máy chủ — <code>io.emit</code> trông như một lời gọi, nhưng adapter vẫn ghi một packet cho mỗi socket. Phương án 3 quên rằng một socket rớt xuống tự nó cũng là một sự kiện mà những người dùng khác, vẫn đang kết nối, được báo.',
          ),
        }),

        // q24 · đáp án 0
        mcq({
          prompt: B(
            'Faced with that storm, someone proposes: stop broadcasting on disconnect and only broadcast on connect. It cuts the packet count in half. Is that the right fix?',
            'Đối mặt với cơn bão đó, có người đề xuất: bỏ phát khi disconnect, chỉ phát khi connect. Nó cắt số packet đi một nửa. Đó có phải cách chữa đúng không?',
          ),
          options: [
            B(
              'No — halving a number does not change its growth: it is still N times N, so the same storm reappears at a slightly larger N. The algorithm has to change, not a constant',
              'Không — chia đôi một con số không đổi được tốc độ tăng của nó: nó vẫn là N nhân N, nên đúng cơn bão đó tái xuất ở một N lớn hơn chút. Phải đổi thuật toán, không phải đổi một hằng số',
            ),
            B(
              'Yes — halving the traffic brings the CPU cost under the 8-core budget, which is what actually mattered',
              'Có — giảm một nửa lưu lượng đưa chi phí CPU về dưới ngân sách 8 nhân, và đó mới là thứ thật sự quan trọng',
            ),
            B(
              'Yes, and it is also more correct: a disconnect is unreliable information because the user may have other tabs open',
              'Có, và nó còn đúng hơn về mặt ngữ nghĩa: một lần disconnect là thông tin không đáng tin vì người dùng có thể còn tab khác đang mở',
            ),
            B(
              'It is neutral: the adapter batches presence packets per tick anyway, so removing one of the two events changes nothing measurable',
              'Nó trung tính: adapter vốn gộp các packet presence theo từng nhịp, nên bỏ một trong hai sự kiện không thay đổi gì đo được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the difference between a constant factor and a complexity class. 2N² becomes N², which at N=10,000 is 100 million instead of 200 million — still a dead server, and it gets worse quadratically as the app grows. The actual fix changes who receives the packet: compute an <b>audience</b> and emit only to it, ' + c('emitPresenceTo(audience, payload)') + ', which costs N × |audience| instead of N × N. With an average audience of 30 that is 300,000 packets rather than 100,000,000 — the same event, 333 times cheaper. Option 3 states something true (a disconnect really is unreliable while other tabs are open) and then draws the wrong conclusion: the answer to that is reference counting, not deleting the event.',
            'Đây là chỗ phân biệt một hệ số hằng với một lớp độ phức tạp. 2N² thành N², mà ở N=10.000 là 100 triệu thay vì 200 triệu — vẫn là một máy chủ chết, và nó còn tệ đi theo cấp số bình phương khi ứng dụng lớn lên. Cách chữa thật sự đổi chỗ NGƯỜI NHẬN: tính một <b>khán giả</b> rồi chỉ phát tới đó, ' + c('emitPresenceTo(audience, payload)') + ', tốn N × |khán giả| thay vì N × N. Với khán giả trung bình 30 người thì là 300.000 packet chứ không phải 100.000.000 — cùng một sự kiện, rẻ hơn 333 lần. Phương án 3 nói một điều đúng (một lần disconnect thật sự không đáng tin khi còn tab khác mở) rồi rút ra kết luận sai: câu trả lời cho chuyện đó là đếm tham chiếu, không phải xoá cái sự kiện đi.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'The audience for a presence update is defined as ' + c('friends(X) ∪ threadPeers(X)') + ' and computing it costs two DB queries, about 10-20ms. Why is that cached in Redis with a five-minute TTL rather than simply computed on every connect?',
            'Khán giả của một cập nhật presence được định nghĩa là ' + c('friends(X) ∪ threadPeers(X)') + ' và tính nó tốn hai truy vấn DB, khoảng 10-20ms. Vì sao nó được cache vào Redis với TTL năm phút thay vì cứ tính lại mỗi lần connect?',
          ),
          options: [
            B('Because the two queries return rows in a nondeterministic order, and the cache is what makes the audience stable between calls', 'Vì hai truy vấn trả về các dòng theo thứ tự không xác định, và cái cache mới là thứ giữ cho khán giả ổn định giữa các lần gọi'),
            B('Because Redis is the only place the audience can be shared across workers; on one worker an in-process Map would be equally good', 'Vì Redis là nơi duy nhất chia sẻ được khán giả giữa các worker; trên một worker thì một Map trong tiến trình cũng tốt y như vậy'),
            B('Because a deploy storm turns it into 10,000 pairs of queries in a few seconds: 10,000 × 20ms is 200 seconds of database work, while a warm cache read is about 1ms and brings the same storm down to about 10 seconds', 'Vì một cơn bão deploy biến nó thành 10.000 cặp truy vấn trong vài giây: 10.000 × 20ms là 200 giây làm việc của cơ sở dữ liệu, còn một lượt đọc cache đã ấm mất khoảng 1ms và kéo đúng cơn bão đó xuống còn khoảng 10 giây', ),
            B('Because the friend list changes rarely, so the TTL is really about correctness: five minutes is how long the product allows a stale friend list to be shown', 'Vì danh sách bạn bè hiếm khi đổi, nên cái TTL thật ra là chuyện đúng đắn: năm phút là khoảng thời gian sản phẩm cho phép hiển thị một danh sách bạn bè cũ'),
          ],
          correct: 2,
          explanation: EX(
            'The audience fix moves the cost from packets to queries, and the query cost has the same storm shape. Uncached, a 10,000-user reconnect means 10,000 audience computations in the space of a few seconds — 200 seconds of DB work, which in practice drains the Prisma pool and pins the database at 100% rather than politely queueing. A warm Redis read is ~1ms, so the same storm becomes ~10 seconds. The TTL is not the primary mechanism: invalidation is, on friend add/remove and on thread membership changes. The five minutes is a <b>backstop</b> for the invalidations that get missed — a block that forgets to clear one cache leaves the ex-friend receiving presence for at most five minutes instead of forever.',
            'Cách chữa bằng khán giả dời chi phí từ packet sang truy vấn, và chi phí truy vấn có đúng hình dạng cơn bão đó. Không cache, 10.000 người dùng nối lại nghĩa là 10.000 lần tính khán giả trong vài giây — 200 giây làm việc của DB, mà trên thực tế nó rút cạn pool của Prisma và ghim cơ sở dữ liệu ở 100% chứ không lịch sự xếp hàng. Một lượt đọc Redis đã ấm mất ~1ms, nên cũng cơn bão đó còn ~10 giây. Cái TTL không phải cơ chế chính: cơ chế chính là vô hiệu hoá cache, khi thêm/bớt bạn và khi thành viên một cuộc trò chuyện thay đổi. Năm phút là một <b>lưới đỡ</b> cho những lần vô hiệu hoá bị bỏ sót — một lượt chặn người mà quên xoá một cache thì để người bạn cũ nhận presence tối đa năm phút, thay vì mãi mãi.',
          ),
        }),

        // q26 · đáp án 1
        mcq({
          prompt: B(
            'Presence flickers: a user with three tabs closes one and their friends see them go offline and then online again about 200ms later. The server keeps ' + c('onlineUserIds: Set<number>') + ' and deletes from it on <code>disconnect</code>. What is the fix, and what changes about it in a cluster?',
            'Presence chớp nháy: một người dùng có ba tab đóng một tab, và bạn bè thấy họ offline rồi online lại sau khoảng 200ms. Máy chủ giữ ' + c('onlineUserIds: Set<number>') + ' và xoá khỏi đó khi <code>disconnect</code>. Cách chữa là gì, và trong một cụm thì điều gì thay đổi?',
          ),
          options: [
            B(
              'Debounce the offline emit by 200ms; in a cluster the same debounce works because every worker sees the same disconnect',
              'Hoãn lượt emit offline 200ms; trong một cụm thì cũng cách hoãn đó vẫn chạy vì mọi worker đều thấy cùng một lần disconnect',
            ),
            B(
              'Reference-count with ' + c('Map<userId, Set<socketId>>') + ' and emit offline only when the Set reaches zero; in a cluster the count has to move to Redis SADD/SCARD, because an in-process Set is not shared across workers',
              'Đếm tham chiếu bằng ' + c('Map<userId, Set<socketId>>') + ' và chỉ emit offline khi Set về không; trong một cụm thì phép đếm phải chuyển sang SADD/SCARD của Redis, vì một Set trong tiến trình không được chia sẻ giữa các worker',
            ),
            B(
              'Track presence by <code>socket.id</code> instead of <code>userId</code>, so closing one tab only removes that tab\'s entry',
              'Theo dõi presence theo <code>socket.id</code> thay vì <code>userId</code>, để đóng một tab chỉ gỡ mục của đúng tab đó',
            ),
            B(
              'Emit presence from the client instead: the tab that is still open re-announces the user as online, which is self-healing',
              'Cho client phát presence thay: cái tab còn mở tự thông báo lại người dùng đang online, và như vậy là tự lành',
            ),
          ],
          correct: 1,
          explanation: EX(
            'One user is many sockets — three tabs are three sids and one <code>userId</code> — so "is this user online" is a count, not a boolean. Keep a <code>Set&lt;socketId&gt;</code> per user, emit <code>online</code> when it becomes 1 and <code>offline</code> when it reaches 0, and the flicker disappears because closing one of three tabs never touches the boundary. In a cluster the three tabs may land on three different workers, so an in-process Map answers for a third of the truth: the set moves to Redis as ' + c('SADD presence:sockets:<uid> <sid>') + ' plus ' + c('SCARD') + ', with a TTL as a backstop so a crashed worker\'s entries do not stay online forever. Option 3 fixes the symptom by changing the key to something the UI cannot use — the UI shows a person, not a tab. Option 4 puts a correctness guarantee in the least trustworthy place in the system.',
            'Một người dùng là nhiều socket — ba tab là ba sid và một <code>userId</code> — nên "người này có online không" là một phép đếm, không phải một giá trị đúng/sai. Giữ một <code>Set&lt;socketId&gt;</code> cho mỗi người, phát <code>online</code> khi nó thành 1 và <code>offline</code> khi nó về 0, thế là hết chớp nháy vì đóng một trong ba tab không bao giờ chạm tới cái ranh giới ấy. Trong một cụm, ba tab có thể rơi vào ba worker khác nhau, nên một Map trong tiến trình chỉ trả lời được một phần ba sự thật: cái tập ấy phải dời sang Redis dạng ' + c('SADD presence:sockets:<uid> <sid>') + ' cộng ' + c('SCARD') + ', kèm một TTL làm lưới đỡ để các mục của một worker vừa sập không nằm lại trạng thái online mãi mãi. Phương án 3 chữa triệu chứng bằng cách đổi khoá sang thứ mà giao diện không dùng được — giao diện hiển thị một con người, không phải một cái tab. Phương án 4 đặt một bảo đảm về tính đúng đắn vào chỗ ít đáng tin nhất trong cả hệ thống.',
          ),
        }),

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'A typing indicator emits one event per keystroke. In a busy 10-person thread that measures 50 events a second inbound, fanned out to 9 people each: 450 packets a second, for one thread. Where does the debounce belong?',
            'Một chỉ báo đang gõ emit một sự kiện mỗi lần nhấn phím. Trong một cuộc trò chuyện 10 người bận rộn, đo được 50 sự kiện mỗi giây đi vào, mỗi cái toả ra 9 người: 450 packet mỗi giây, cho một cuộc trò chuyện. Chỗ hoãn nên đặt ở đâu?',
          ),
          options: [
            B(
              'On the client, at most one emit every 3s, with a server rate limit as a backstop and an auto-clear timeout on the receiving client',
              'Ở client, tối đa một lượt emit mỗi 3 giây, kèm một hạn mức tốc độ ở máy chủ làm lưới đỡ và một timeout tự xoá ở client nhận',
            ),
            B(
              'On the server, which is the only place that can see the whole thread and therefore debounce fairly across all senders',
              'Ở máy chủ, nơi duy nhất nhìn được cả cuộc trò chuyện nên có thể hoãn một cách công bằng giữa mọi người gửi',
            ),
            B(
              'Nowhere: switch the emit to <code>volatile</code> so the packets are dropped automatically when the fanout gets expensive',
              'Không đâu cả: đổi lượt emit sang <code>volatile</code> để packet tự bị bỏ khi việc toả ra trở nên đắt',
            ),
            B(
              'On the receiving client only, since the sender cannot know whether anyone is watching the thread',
              'Chỉ ở client nhận, vì bên gửi không thể biết có ai đang xem cuộc trò chuyện hay không',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Debouncing on the <b>server</b> saves the broadcast but not the receive: every keystroke still travels up, still costs a frame, still costs a handler run. Debouncing on the <b>client</b> saves both ends. One emit per 3s takes 10 users × 0.33 emits/s × 9 receivers to about 30 packets a second — a 15× cut. Two more pieces make it correct rather than merely cheap: a server-side rate limit, because a client is not trustworthy and a modified one can still flood; and a 3s auto-clear on the receiving side, so a sender who closes the tab mid-word does not leave "An is typing…" on screen forever. Option 3 misuses <code>volatile</code>, whose real condition is that the transport is not writable — it is not a throttle, and it drops nothing on a healthy connection.',
            'Hoãn ở <b>máy chủ</b> tiết kiệm được lượt broadcast nhưng không tiết kiệm được lượt nhận: mỗi phím gõ vẫn đi lên, vẫn tốn một frame, vẫn tốn một lượt chạy handler. Hoãn ở <b>client</b> tiết kiệm được cả hai đầu. Một lượt emit mỗi 3 giây đưa 10 người × 0,33 lượt/giây × 9 người nhận về khoảng 30 packet mỗi giây — cắt 15 lần. Thêm hai mảnh nữa mới thành đúng chứ không chỉ là rẻ: một hạn mức tốc độ phía máy chủ, vì client không đáng tin và một bản đã sửa vẫn có thể xả lũ; và một lượt tự xoá sau 3 giây ở phía nhận, để người gửi đóng tab giữa chừng không để lại dòng "An đang gõ…" trên màn hình mãi mãi. Phương án 3 dùng sai <code>volatile</code>, thứ có điều kiện thật là transport không ghi được — nó không phải một cái van tiết lưu, và trên một kết nối khoẻ mạnh nó chẳng bỏ gói nào.',
          ),
        }),

        /* ── Chương 5 — Redis adapter và cluster (5 câu) ─────────────────── */

        // q28 · đáp án 3
        mcq({
          prompt: B(
            'An app that worked perfectly on one process is scaled to four Docker replicas. Nothing else changes. Users start reporting that messages "sometimes do not arrive", and it looks random. No error appears anywhere. What is happening?',
            'Một ứng dụng chạy hoàn hảo trên một tiến trình được nhân lên bốn bản Docker. Không đổi gì khác. Người dùng bắt đầu báo tin nhắn "đôi khi không tới", và trông rất ngẫu nhiên. Không có lỗi nào hiện ra ở đâu cả. Chuyện gì đang xảy ra?',
          ),
          options: [
            B('The four replicas are competing for the same rooms, so each broadcast is delivered by whichever worker wins the race', 'Bốn bản đang tranh nhau cùng những room, nên mỗi lượt broadcast do worker nào thắng cuộc đua thì worker đó giao'),
            B('Docker\'s internal DNS round-robins the WebSocket upgrade, so a quarter of connections never complete and those users see nothing', 'DNS nội bộ của Docker quay vòng cú nâng cấp WebSocket, nên một phần tư số kết nối không hoàn tất và những người dùng đó không thấy gì'),
            B('The rooms became too large for one process, and socket.io silently drops recipients above <code>maxPayload</code>', 'Các room trở nên quá lớn với một tiến trình, và socket.io âm thầm bỏ bớt người nhận vượt quá <code>maxPayload</code>'),
            B('Each worker only knows its own sockets, so a broadcast reaches about one quarter of the intended room and the rest get nothing — no error, because from that worker\'s point of view it delivered to everyone it knows', 'Mỗi worker chỉ biết những socket của chính nó, nên một lượt broadcast tới được khoảng một phần tư cái room và phần còn lại không nhận gì — không có lỗi nào, vì theo góc nhìn của worker đó thì nó đã giao cho tất cả những ai nó biết'),
          ],
          correct: 3,
          explanation: EX(
            'The default adapter is in-memory, and its <code>rooms</code> Map holds only the sockets that this process is holding. With four replicas each one is holding about a quarter of the room, so ' + c("io.to('thread:42').emit(...)") + ' delivers to about a quarter of the room and reports complete success. That is the whole bug: <b>the failure mode is silence</b>, not an exception, which is why it survives code review and staging (one process, where the number is exactly right) and only shows up as user complaints. The fix is an adapter that carries the broadcast between processes — the Redis adapter publishes to a channel like ' + c('socket.io#/#thread:42') + ' that the other three workers are subscribed to, and each rebroadcasts locally.',
            'Adapter mặc định nằm trong bộ nhớ, và cái Map <code>rooms</code> của nó chỉ giữ những socket mà chính tiến trình này đang giữ. Với bốn bản, mỗi bản giữ khoảng một phần tư cái room, nên ' + c("io.to('thread:42').emit(...)") + ' giao tới khoảng một phần tư room rồi báo thành công trọn vẹn. Đó chính là toàn bộ con bug: <b>kiểu hỏng của nó là sự im lặng</b>, không phải một ngoại lệ, và vì thế nó sống sót qua review mã và qua staging (một tiến trình, nơi con số đúng chính xác) rồi chỉ lộ ra dưới dạng người dùng phàn nàn. Cách chữa là một adapter cõng lượt broadcast đi giữa các tiến trình — Redis adapter publish vào một kênh kiểu ' + c('socket.io#/#thread:42') + ' mà ba worker kia đang subscribe, và mỗi worker phát lại cho phần của mình.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'With the Redis adapter attached on all four workers, an admin endpoint answers "who is in room <code>thread:42</code>?" with:' +
            code("io.sockets.adapter.rooms.get('thread:42').size") +
            'The number is wrong and changes between refreshes. Why?',

            'Với Redis adapter đã gắn trên cả bốn worker, một endpoint quản trị trả lời câu "ai đang ở trong room <code>thread:42</code>?" bằng:' +
            code("io.sockets.adapter.rooms.get('thread:42').size") +
            'Con số sai và đổi giữa các lần tải lại. Vì sao?',
          ),
          options: [
            B('The Redis adapter needs a moment to converge; reading after a short delay returns the correct cluster-wide number', 'Redis adapter cần một chút thời gian để hội tụ; đọc sau một khoảng trễ ngắn sẽ ra con số đúng cho cả cụm'),
            B('<code>rooms</code> counts sockets across the cluster but includes each socket\'s private id-room, so the number is inflated and unstable', '<code>rooms</code> đếm socket trên cả cụm nhưng tính cả room riêng theo id của mỗi socket, nên con số bị thổi lên và không ổn định'),
            B('The adapter replicates broadcasts, not membership: <code>rooms</code> stays local to the worker that answered the request, and the load balancer picks a different worker each time', 'Adapter nhân bản broadcast chứ không nhân bản danh sách thành viên: <code>rooms</code> vẫn cục bộ với worker đã trả lời request, và bộ cân bằng tải mỗi lần lại chọn một worker khác', ),
            B('The room was garbage-collected between reads because it briefly had no members on that worker', 'Cái room bị thu gom giữa hai lần đọc vì trong chốc lát nó không có thành viên nào trên worker đó'),
          ],
          correct: 2,
          explanation: EX(
            'The adapter shares <b>outgoing packets</b>. It does not build a cluster-wide membership registry, so ' + c('io.sockets.adapter.rooms') + ' answers for one process — roughly a quarter of the truth on four workers, and a different quarter depending on which one the proxy routed you to. The symptom reads like a race condition ("the number keeps changing") when it is a topology problem, and it is invisible in development where there is one worker and the number is exactly right. The cluster-wide question goes through the adapter: ' + c("await io.in('thread:42').fetchSockets()") + ', which round-trips to every worker and aggregates. For a number you read often, keep a count in Redis instead — <code>fetchSockets</code> is fine on an admin page, and not fine inside a message handler that fires thousands of times a second.',
            'Adapter chia sẻ <b>các packet đi ra</b>. Nó không dựng một sổ đăng ký thành viên cho cả cụm, nên ' + c('io.sockets.adapter.rooms') + ' trả lời cho một tiến trình — khoảng một phần tư sự thật trên bốn worker, và mỗi lần là một phần tư khác tuỳ proxy đẩy bạn tới worker nào. Triệu chứng đọc lên nghe như một tình huống tranh chấp ("con số cứ đổi") trong khi đó là vấn đề hình trạng hệ thống, và nó vô hình khi phát triển vì lúc đó chỉ có một worker và con số đúng chính xác. Câu hỏi ở tầm cụm phải đi qua adapter: ' + c("await io.in('thread:42').fetchSockets()") + ', thứ đi vòng tới mọi worker rồi gộp lại. Còn với một con số bạn đọc thường xuyên thì hãy giữ một bộ đếm trong Redis — <code>fetchSockets</code> ổn trên một trang quản trị, và không ổn bên trong một handler tin nhắn nổ hàng nghìn lần mỗi giây.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'A monitoring endpoint on a 4-worker cluster runs:' +
            code("io.serverSideEmit('count', (err, responses) => { /* ... */ });") +
            'Every worker replies with its local socket count. Which pair of statements is true?',

            'Một endpoint giám sát trên cụm 4 worker chạy:' +
            code("io.serverSideEmit('count', (err, responses) => { /* ... */ });") +
            'Mỗi worker trả lời bằng số socket cục bộ của nó. Cặp phát biểu nào đúng?',
          ),
          options: [
            B('<code>responses</code> has 4 entries, and a worker that times out contributes a <code>null</code> in its slot', '<code>responses</code> có 4 phần tử, và một worker quá hạn để lại một giá trị <code>null</code> ở ô của nó'),
            B('<code>responses</code> has 3 entries because the sender never receives its own emit, and if any worker misses the timeout you get <code>err</code> with NO partial results at all', '<code>responses</code> có 3 phần tử vì bên gửi không bao giờ nhận lượt emit của chính nó, và nếu một worker nào đó lỡ hạn thì bạn nhận <code>err</code> mà KHÔNG có kết quả từng phần nào cả'),
            B('<code>responses</code> has 4 entries, and the callback is invoked once per worker as each reply lands', '<code>responses</code> có 4 phần tử, và callback được gọi mỗi worker một lần khi từng lượt trả lời tới nơi'),
            B('<code>responses</code> has 3 entries, and a worker that times out is simply skipped so the array shrinks to 2', '<code>responses</code> có 3 phần tử, và một worker quá hạn thì bị bỏ qua nên mảng co lại còn 2'),
          ],
          correct: 1,
          explanation: EX(
            'Two properties that both bite in production. First, <code>serverSideEmit</code> reaches every <b>other</b> worker and never the sender, so a 4-worker cluster gives 3 responses and you must add the local value yourself — forgetting that is a monitoring dashboard that is always exactly one worker short. Second, the callback is <b>all-or-nothing</b>: one slow worker produces an error and no responses at all, not "here are the two that answered". A dashboard written on the assumption of partial results shows "0 users online" during a slow moment, which reads as an outage rather than a timeout. It is also worth knowing what happens without the adapter: measured on the in-memory default, <code>serverSideEmit</code> did not throw — it logged that the adapter does not support it and quietly did nothing.',
            'Hai tính chất, và cả hai đều cắn trên production. Một, <code>serverSideEmit</code> tới mọi worker <b>khác</b> và không bao giờ tới chính bên gửi, nên một cụm 4 worker cho 3 phản hồi và bạn phải tự cộng giá trị cục bộ vào — quên chuyện đó là có một bảng giám sát luôn luôn thiếu đúng một worker. Hai, callback là <b>được tất hoặc không được gì</b>: một worker chậm sinh ra một lỗi và không có phản hồi nào cả, chứ không phải "đây là hai đứa đã trả lời". Một bảng giám sát viết theo giả định có kết quả từng phần sẽ hiện "0 người đang online" trong một khoảnh khắc chậm, và cái đó đọc lên như một sự cố chứ không phải một lần quá hạn. Cũng đáng biết chuyện gì xảy ra khi không có adapter: đo trên bản mặc định trong bộ nhớ, <code>serverSideEmit</code> không ném lỗi — nó ghi ra rằng adapter không hỗ trợ việc đó rồi lặng lẽ không làm gì.',
          ),
        }),

        // q31 · đáp án 3
        mcq({
          prompt: B(
            'On a clustered server this line runs and then the next one throws:' +
            code("const sockets = await io.in('room:42').fetchSockets();\nsockets[0].on('typing', handler);   // TypeError") +
            'Why is <code>emit</code> available on those objects but <code>on</code> is not?',

            'Trên một máy chủ chạy cụm, dòng này chạy được rồi dòng kế ném lỗi:' +
            code("const sockets = await io.in('room:42').fetchSockets();\nsockets[0].on('typing', handler);   // TypeError") +
            'Vì sao <code>emit</code> dùng được trên những đối tượng đó mà <code>on</code> thì không?',
          ),
          options: [
            B('Because listeners can only be attached inside the <code>connection</code> handler; the restriction has nothing to do with clustering', 'Vì listener chỉ gắn được bên trong handler <code>connection</code>; hạn chế này không liên quan gì tới việc chạy cụm'),
            B('Because <code>fetchSockets</code> returns plain data snapshots, so neither <code>emit</code> nor <code>on</code> really works — the emit fails silently', 'Vì <code>fetchSockets</code> trả về các bản chụp dữ liệu thuần, nên cả <code>emit</code> lẫn <code>on</code> đều không thật sự chạy — lượt emit hỏng trong im lặng'),
            B('Because the socket lives on another worker and is read-only from here; only <code>disconnect</code> is permitted as a write', 'Vì socket đó nằm trên worker khác nên từ đây chỉ đọc được; chỉ mỗi <code>disconnect</code> được phép ghi'),
            B('Because a listener is a function and functions cannot be serialised to another process: everything that works — <code>emit</code>, <code>join</code>, <code>leave</code>, <code>disconnect</code> — is a one-way command, while <code>on</code> would need a callback to travel back', 'Vì một listener là một hàm, mà hàm thì không tuần tự hoá được để gửi sang tiến trình khác: mọi thứ chạy được — <code>emit</code>, <code>join</code>, <code>leave</code>, <code>disconnect</code> — đều là lệnh một chiều, còn <code>on</code> thì cần một callback đi ngược trở về'),
          ],
          correct: 3,
          explanation: EX(
            'A <code>RemoteSocket</code> is a handle to a socket that another process is holding. Read-only fields survive the trip because they serialise — <code>id</code>, <code>data</code>, <code>rooms</code>, <code>handshake</code> — and so do commands, because a command is just a message: <code>emit</code>, <code>join</code>, <code>leave</code> and <code>disconnect</code> are routed to the owning worker and executed there. <code>on</code> is the one thing that cannot cross, because it would mean shipping a closure to another process and calling it back. The rule to remember is the shape rather than the list: <b>you can tell a remote socket to do something; you cannot ask it to call you back.</b> Anything genuinely event-driven has to be registered in that worker\'s own <code>connection</code> handler, which every worker runs.',
            'Một <code>RemoteSocket</code> là một tay cầm trỏ tới một socket mà tiến trình khác đang giữ. Các trường chỉ đọc sống sót qua chuyến đi vì chúng tuần tự hoá được — <code>id</code>, <code>data</code>, <code>rooms</code>, <code>handshake</code> — và các lệnh cũng vậy, vì một lệnh chỉ là một thông điệp: <code>emit</code>, <code>join</code>, <code>leave</code> và <code>disconnect</code> được định tuyến về worker chủ sở hữu rồi thi hành ở đó. <code>on</code> là thứ duy nhất không vượt qua được, bởi làm thế nghĩa là gửi một closure sang tiến trình khác rồi gọi ngược nó. Điều đáng nhớ là cái hình dạng chứ không phải cái danh sách: <b>bạn BẢO được một socket ở xa làm một việc; bạn không NHỜ được nó gọi lại cho bạn.</b> Thứ gì thật sự hướng sự kiện thì phải đăng ký trong chính handler <code>connection</code> của worker đó, thứ mà mọi worker đều chạy.',
          ),
        }),

        // q32 · đáp án 0
        mcq({
          prompt: B(
            'A team runs four Node workers on one VPS under <code>node:cluster</code> and is choosing an adapter. Which reasoning is right?',
            'Một đội chạy bốn worker Node trên một VPS bằng <code>node:cluster</code> và đang chọn adapter. Lập luận nào đúng?',
          ),
          options: [
            B(
              '<code>@socket.io/cluster-adapter</code> fits exactly: it routes between workers of one machine over IPC, needs no service to run, and is lower latency than Redis — Redis becomes correct the day there is a second machine',
              '<code>@socket.io/cluster-adapter</code> khớp chính xác: nó định tuyến giữa các worker của một máy qua IPC, không cần dịch vụ nào phải vận hành, và độ trễ thấp hơn Redis — Redis chỉ trở nên đúng vào ngày có máy thứ hai',
            ),
            B(
              'Keep the default in-memory adapter: it is a single machine, so all four workers share the same process memory anyway',
              'Cứ giữ adapter mặc định trong bộ nhớ: đây là một máy duy nhất, nên bốn worker dù sao cũng dùng chung bộ nhớ của cùng một tiến trình',
            ),
            B(
              'Use the Postgres adapter, because a single VPS already runs Postgres and <code>LISTEN/NOTIFY</code> has no payload limit',
              'Dùng Postgres adapter, vì một VPS đơn lẻ vốn đã chạy Postgres và <code>LISTEN/NOTIFY</code> không có hạn mức phần tải',
            ),
            B(
              'Any adapter will do; the choice only affects latency, and at four workers the difference is under a millisecond either way',
              'Adapter nào cũng được; lựa chọn chỉ ảnh hưởng độ trễ, và với bốn worker thì chênh lệch dưới một mili giây dù chọn cách nào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Each adapter is selected by exactly one condition. <b>In-memory</b> is correct when you genuinely run one process — and dangerous precisely because it is the default, so "we never chose an adapter" and "we chose in-memory" produce identical code. Option 2 states the fatal misunderstanding out loud: <code>node:cluster</code> workers are separate processes with separate heaps, which is the entire reason this problem exists. <b>cluster-adapter</b> is the answer for many workers on one box: IPC, no service to operate, lower latency than a network hop, and it pairs with <code>@socket.io/sticky</code> so the polling requirement is solved in the same configuration. <b>redis-adapter</b> earns its place the moment there is a second machine. <b>postgres-adapter</b> is a reasonable trade when realtime traffic is modest, but option 3 is wrong on the detail that matters: <code>LISTEN/NOTIFY</code> caps a payload at 8000 bytes and spills anything larger into a table.',
            'Mỗi adapter được chọn bởi đúng một điều kiện. <b>Trong bộ nhớ</b> là đúng khi bạn thật sự chạy một tiến trình — và nguy hiểm chính vì nó là mặc định, nên "chúng tôi chưa từng chọn adapter" và "chúng tôi đã chọn bản trong bộ nhớ" sinh ra mã y hệt nhau. Phương án 2 nói toạc ra cái hiểu nhầm chí mạng: worker của <code>node:cluster</code> là những tiến trình riêng với vùng nhớ riêng, và đó chính là toàn bộ lý do vấn đề này tồn tại. <b>cluster-adapter</b> là câu trả lời cho nhiều worker trên một máy: đi bằng IPC, không có dịch vụ nào phải vận hành, độ trễ thấp hơn một chặng mạng, và nó đi cặp với <code>@socket.io/sticky</code> nên yêu cầu về polling được giải quyết trong cùng một lần cấu hình. <b>redis-adapter</b> xứng đáng có chỗ ngay khi xuất hiện máy thứ hai. <b>postgres-adapter</b> là một đánh đổi hợp lý khi lưu lượng realtime khiêm tốn, nhưng phương án 3 sai đúng ở chi tiết quan trọng: <code>LISTEN/NOTIFY</code> chặn phần tải ở 8000 byte và đẩy mọi thứ lớn hơn qua một cái bảng.',
          ),
        }),

        /* ── Chương 6 — Ack và bảo đảm giao hàng (5 câu) ─────────────────── */

        // q33 · đáp án 2
        mcq({
          prompt: B(
            'An engineer argues: "socket.io runs over WebSocket, WebSocket runs over TCP, and TCP guarantees delivery — so a plain ' + c("socket.emit('chat:new', msg)") + ' cannot lose a message." What is wrong with that?',
            'Một kỹ sư lập luận: "socket.io chạy trên WebSocket, WebSocket chạy trên TCP, mà TCP bảo đảm giao hàng — nên một lượt ' + c("socket.emit('chat:new', msg)") + ' bình thường không thể mất tin nhắn." Sai ở chỗ nào?',
          ),
          options: [
            B('WebSocket frames are sent over UDP once the connection is upgraded, so TCP is not involved at all', 'Frame WebSocket đi bằng UDP sau khi kết nối đã nâng cấp, nên TCP không dính dáng gì cả'),
            B('TCP only guarantees ordering, never delivery; a router may drop a segment and nothing retransmits it', 'TCP chỉ bảo đảm thứ tự chứ không bảo đảm giao hàng; một bộ định tuyến có thể vứt một đoạn và không có gì truyền lại'),
            B('TCP guarantees delivery WITHIN one connection. When the connection breaks, whatever is still in the send buffer is discarded, and a reconnect replays nothing — so the default is at-most-once', 'TCP bảo đảm giao hàng TRONG PHẠM VI một kết nối. Khi kết nối đứt, thứ gì còn nằm trong bộ đệm gửi thì bị vứt, và một lần nối lại không phát lại gì cả — nên mặc định là nhiều nhất một lần'),
            B('It is right for WebSocket but wrong for polling, so the guarantee depends on which transport the client ended up on', 'Nó đúng với WebSocket nhưng sai với polling, nên bảo đảm này phụ thuộc client rốt cuộc nằm trên transport nào'),
          ],
          correct: 2,
          explanation: EX(
            'The guarantee is real but its scope is one connection, and a connection is exactly the thing that breaks. A packet sitting in the buffer when the transport dies is gone: there is no exception, no error event, and no replay on reconnect. That is why the default is described as <b>at-most-once</b> — fire and forget. It is the right default for presence, typing and UI refreshes, where a lost update is corrected by the next one. It is the wrong default for a chat message, a payment or an order status, where "the user never saw it and nobody noticed" is the failure. The only exception is <code>connectionStateRecovery</code>, which does buffer and replay for a bounded window, and it is off unless you turn it on.',
            'Bảo đảm đó có thật nhưng phạm vi của nó là một kết nối, mà kết nối lại đúng là thứ hay đứt. Một packet còn nằm trong bộ đệm lúc transport chết thì mất luôn: không có ngoại lệ, không có sự kiện lỗi, và không có lượt phát lại nào khi nối lại. Đó là lý do mặc định được gọi là <b>nhiều nhất một lần</b> — bắn rồi quên. Đó là mặc định đúng cho presence, cho chỉ báo đang gõ và cho các lượt làm mới giao diện, nơi một cập nhật mất đi sẽ được cái kế tiếp sửa lại. Đó là mặc định sai cho một tin nhắn chat, một khoản thanh toán hay một trạng thái đơn hàng, nơi "người dùng không bao giờ thấy nó và không ai nhận ra" chính là kiểu hỏng. Ngoại lệ duy nhất là <code>connectionStateRecovery</code>, thứ thật sự có đệm và phát lại trong một cửa sổ có giới hạn, và nó tắt cho tới khi bạn bật lên.',
          ),
        }),

        // q34 · đáp án 1
        mcq({
          prompt: B(
            'A server broadcasts a question to three connected clients and one of them never answers:' +
            code("io.timeout(300).emit('who', (err, responses) => {\n  console.log(err && err.message, JSON.stringify(responses));\n});") +
            'What gets logged?',

            'Một máy chủ phát một câu hỏi tới ba client đang kết nối và một trong số đó không bao giờ trả lời:' +
            code("io.timeout(300).emit('who', (err, responses) => {\n  console.log(err && err.message, JSON.stringify(responses));\n});") +
            'Cái gì được ghi ra?',
          ),
          options: [
            B('<code>operation has timed out</code> and <code>undefined</code> — a broadcast ack is all-or-nothing, exactly like <code>serverSideEmit</code>', '<code>operation has timed out</code> và <code>undefined</code> — ack của một lượt broadcast là được tất hoặc không gì, y hệt <code>serverSideEmit</code>'),
            B('<code>operation has timed out</code> together with the two answers that did arrive — the error reports the timeout, and the array still holds the partial results', '<code>operation has timed out</code> kèm hai câu trả lời đã tới — lỗi báo đúng việc quá hạn, còn cái mảng vẫn giữ phần kết quả đã có'),
            B('<code>null</code> and the two answers, since a broadcast ack never errors and simply reports whoever replied in time', '<code>null</code> và hai câu trả lời, vì ack của broadcast không bao giờ báo lỗi mà chỉ liệt kê ai kịp trả lời'),
            B('Nothing at all: the callback is not invoked unless every recipient acknowledges within the timeout', 'Không có gì cả: callback không được gọi trừ khi mọi người nhận đều xác nhận trong thời hạn'),
          ],
          correct: 1,
          explanation: EX(
            'Measured both ways on the same server. With all three clients answering: <code>err = null</code> and three responses. With one client silent: the message was exactly <code>operation has timed out</code> <b>and</b> the array still contained the two answers that came back. So a broadcast ack is deliberately NOT all-or-nothing — which makes it the opposite of <code>serverSideEmit</code>, and confusing the two is easy because they look alike at the call site. Note the exact string too: the same <code>operation has timed out</code> appears whether you use ' + c('.timeout(ms).emit(ev, cb)') + ' with an error-first callback, ' + c('emitWithAck') + ' with a rejected promise, or a server asking a client. If you see that message in a log, it is a socket.io ack timeout, not a fetch or a database one.',
            'Đo cả hai chiều trên cùng một máy chủ. Khi cả ba client đều trả lời: <code>err = null</code> và ba phản hồi. Khi một client im lặng: thông báo đúng là <code>operation has timed out</code> <b>và</b> cái mảng vẫn chứa hai câu trả lời đã về. Nên ack của một lượt broadcast cố ý KHÔNG phải kiểu được tất hoặc không gì — điều này khiến nó ngược hẳn với <code>serverSideEmit</code>, và lẫn hai thứ ấy rất dễ vì ở chỗ gọi chúng trông giống nhau. Cũng để ý đúng chuỗi ký tự: cùng một <code>operation has timed out</code> xuất hiện dù bạn dùng ' + c('.timeout(ms).emit(ev, cb)') + ' với callback lỗi-trước, dùng ' + c('emitWithAck') + ' với một promise bị từ chối, hay máy chủ đi hỏi một client. Thấy thông báo đó trong log thì đó là một lần ack của socket.io quá hạn, không phải của fetch hay của cơ sở dữ liệu.',
          ),
        }),

        // q35 · đáp án 3
        mcq({
          prompt: B(
            'You are turning a chat send path from at-most-once into at-least-once. Which combination is the minimum that actually gets you there?',
            'Bạn đang chuyển đường gửi chat từ nhiều-nhất-một-lần sang ít-nhất-một-lần. Tổ hợp nào là tối thiểu để thật sự tới được đó?',
          ),
          options: [
            B('Switch the transport to WebSocket only and raise <code>pingTimeout</code>, so the connection survives short network hiccups', 'Chuyển transport sang chỉ WebSocket và nâng <code>pingTimeout</code>, để kết nối sống qua được những cú vấp mạng ngắn'),
            B('Turn on <code>connectionStateRecovery</code>, which replays anything the client missed while it was away', 'Bật <code>connectionStateRecovery</code>, thứ phát lại mọi thứ client đã lỡ trong lúc vắng mặt'),
            B('Use <code>volatile</code> for everything else, so the important events are never stuck behind a full buffer', 'Dùng <code>volatile</code> cho mọi thứ còn lại, để các sự kiện quan trọng không bao giờ kẹt sau một bộ đệm đầy'),
            B('An ack with a timeout, a retry loop with backoff around it, and a message id generated by the CLIENT so the retries are recognisable as the same message', 'Một ack có thời hạn, một vòng lặp thử lại có giãn cách bao quanh nó, và một message id do CHÍNH CLIENT sinh ra để các lượt thử lại nhận ra được là cùng một tin nhắn'),
          ],
          correct: 3,
          explanation: EX(
            'At-least-once is not a setting; it is a loop. Emit with an ack and a timeout, and if the ack does not come back, emit again. That is the whole mechanism, and the price is +50-200ms of latency plus the memory to track what is pending. The piece people leave out is the <b>client-generated id</b>: without it a retry is indistinguishable from a new message, and the layer you are about to build in the next lesson has nothing to deduplicate on. Generate a UUID before the first attempt and reuse it for every retry — the same Idempotency-Key pattern payment APIs use. Option 2 helps only within a bounded recovery window and does nothing for a message the server never received in the first place. Option 1 makes drops rarer and changes no guarantee at all.',
            'Ít-nhất-một-lần không phải một tuỳ chọn; nó là một vòng lặp. Emit kèm một ack có thời hạn, và nếu ack không quay về thì emit lại. Đó là toàn bộ cơ chế, và cái giá là +50-200ms độ trễ cộng với bộ nhớ để theo dõi những gì đang chờ. Mảnh mà người ta hay bỏ sót là <b>id do client sinh</b>: không có nó thì một lượt thử lại không phân biệt được với một tin nhắn mới, và cái tầng bạn sắp dựng ở bài kế tiếp chẳng có gì để khử trùng lặp. Hãy sinh một UUID trước lần thử đầu tiên rồi dùng lại nó cho mọi lượt thử lại — đúng cái khuôn Idempotency-Key mà các API thanh toán dùng. Phương án 2 chỉ giúp trong một cửa sổ khôi phục có giới hạn và không làm gì được cho một tin nhắn mà máy chủ chưa từng nhận ngay từ đầu. Phương án 1 làm cho các lần rớt hiếm đi và không đổi bảo đảm nào cả.',
          ),
        }),

        // q36 · đáp án 2
        mcq({
          prompt: B(
            'A retry loop is in place, keyed by a client-generated id, and the server deduplicates on that id. A message is applied on the server on attempt 1, but every ack is lost and the client gives up after 3 attempts and shows a red "not sent" marker. What is the correct description of this outcome?',
            'Một vòng lặp thử lại đã có, khoá theo id do client sinh, và máy chủ khử trùng lặp theo id đó. Một tin nhắn được áp dụng trên máy chủ ngay lượt thử 1, nhưng mọi ack đều mất và client bỏ cuộc sau 3 lượt rồi hiện dấu đỏ "chưa gửi". Mô tả nào đúng về kết quả này?',
          ),
          options: [
            B('The dedupe layer is broken: with a correct one the client would have received the ack on attempt 2', 'Tầng khử trùng lặp hỏng: nếu nó đúng thì client đã nhận được ack ở lượt thử 2'),
            B('It is a lost message: the recipient never sees it, because the server discards duplicates and the first copy was never committed', 'Đó là một tin nhắn bị mất: người nhận không bao giờ thấy nó, vì máy chủ vứt các bản trùng và bản đầu tiên chưa từng được ghi'),
            B('The message was delivered exactly once and the recipient sees it; what failed is the client\'s KNOWLEDGE of the outcome, which is why the marker is wrong rather than the data', 'Tin nhắn đã được giao đúng một lần và người nhận thấy nó; thứ hỏng là HIỂU BIẾT của client về kết quả, nên cái dấu hiệu mới là chỗ sai chứ không phải dữ liệu'),
            B('It is a duplicate: the three attempts each created a row, and the dedupe only prevents the UI from rendering them twice', 'Đó là một bản trùng: ba lượt thử mỗi lượt tạo một dòng, và việc khử trùng lặp chỉ ngăn giao diện vẽ chúng hai lần'),
          ],
          correct: 2,
          explanation: EX(
            'Dedupe on top of at-least-once buys you exactly-once <b>effect</b> on the server, and buys the client nothing about certainty. Simulated deterministically: five messages driven through a scripted link where each attempt is <code>ok</code>, <code>lost</code> (never arrived) or <code>ackLost</code> (arrived, applied, ack lost). The run applied four messages, reported two as FAILED — and one of those two was applied. So the failure to design around is not duplication (the unique constraint handles that) but a <b>false negative</b>: the client says it failed and it did not. The practical answer is to make the retry reconcile rather than guess — on reconnect, ask the server for messages since the last known id, and let the answer decide what the marker says.',
            'Khử trùng lặp đặt trên ít-nhất-một-lần mua cho bạn <b>hiệu ứng</b> đúng-một-lần ở phía máy chủ, và không mua cho client chút chắc chắn nào. Mô phỏng tất định: năm tin nhắn chạy qua một đường truyền có kịch bản, mỗi lượt thử là <code>ok</code>, <code>lost</code> (không bao giờ tới) hoặc <code>ackLost</code> (tới nơi, được áp dụng, ack mất). Lượt chạy áp dụng bốn tin nhắn, báo hai tin là FAILED — và một trong hai tin đó đã được áp dụng. Nên thứ cần thiết kế để chống lại không phải sự trùng lặp (ràng buộc duy nhất lo được) mà là một <b>âm tính giả</b>: client nói hỏng trong khi nó không hỏng. Câu trả lời thực dụng là làm cho lượt thử lại đi đối soát chứ đừng đoán — khi nối lại, hỏi máy chủ những tin nhắn kể từ id đã biết cuối cùng, rồi để câu trả lời quyết định cái dấu hiệu hiển thị gì.',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'Messages arrive out of order in a chat UI. What does socket.io actually guarantee about ordering, and where does the guarantee stop?',
            'Tin nhắn tới sai thứ tự trong giao diện chat. Socket.io thật sự bảo đảm gì về thứ tự, và bảo đảm đó dừng ở đâu?',
          ),
          options: [
            B(
              'Within ONE socket it holds, because that is one TCP stream — but not across two sockets, a reconnect gap or two workers',
              'Trong PHẠM VI một socket thì nó đúng, vì đó là một dòng TCP — nhưng không đúng giữa hai socket, qua một khoảng gián đoạn nối lại, hay giữa hai worker',
            ),
            B(
              'It holds globally per room, because the adapter stamps a monotonic sequence on every packet before it fans out to the room members',
              'Nó đúng trên phạm vi toàn room, vì adapter đóng một số thứ tự tăng dần lên mọi packet trước khi toả ra cho các thành viên của room',
            ),
            B(
              'Nothing holds at all — even two emits written one after the other on the same socket may be delivered to the handler in either order',
              'Không có gì đúng cả — kể cả hai lượt emit viết liền nhau trên cùng một socket cũng có thể tới handler theo thứ tự bất kỳ',
            ),
            B(
              'It holds per event name, so two packets with different names may interleave while two packets sharing a name never overtake each other',
              'Nó đúng theo từng tên sự kiện, nên hai packet khác tên có thể xen kẽ còn hai packet cùng tên thì không bao giờ vượt nhau',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: 200 emits fired in a tight loop on one socket came back in exactly the order sent, all 200 of them — so option 3 is wrong, and a same-socket sequence really is safe. The guarantee ends where the stream ends. Two browser tabs are two sockets with no relationship between them. A reconnect starts a new stream, and anything buffered on the client is flushed at the moment of reconnect rather than in its original position relative to what the server sent meanwhile — measured, a normal emit and a <code>volatile</code> emit both queued during a disconnect arrived together after it, behind whatever else had happened. In a cluster two workers publish independently. The fix does not live in socket.io: put a monotonic sequence number in the payload (a database auto-increment id is ideal), reorder on the client, and refetch when a gap grows too large to be a reordering.',
            'Đo thật: 200 lượt emit bắn liên tiếp trên một socket quay về đúng thứ tự đã gửi, đủ cả 200 — nên phương án 3 sai, và một chuỗi trên cùng một socket thật sự an toàn. Bảo đảm ấy chấm dứt ở chỗ dòng dữ liệu chấm dứt. Hai tab trình duyệt là hai socket không có quan hệ gì với nhau. Một lần nối lại mở một dòng mới, và mọi thứ đã đệm ở client được xả ra vào đúng khoảnh khắc nối lại chứ không phải ở vị trí ban đầu của nó so với những gì máy chủ đã gửi trong lúc đó — đo thật, một lượt emit thường và một lượt <code>volatile</code> cùng xếp hàng lúc mất kết nối đều tới cùng nhau sau đó, nằm sau mọi thứ đã xảy ra trước. Trong một cụm thì hai worker publish độc lập với nhau. Cách chữa không nằm trong socket.io: đặt một số thứ tự tăng dần vào phần tải (một id tự tăng của cơ sở dữ liệu là lý tưởng), sắp lại ở client, và tải lại khi khoảng trống lớn tới mức không còn là chuyện sai thứ tự nữa.',
          ),
        }),

        /* ── Chương 7 — WebRTC signalling (4 câu) ────────────────────────── */

        // q38 · đáp án 1
        mcq({
          prompt: B(
            'A developer builds video calling by taking <code>MediaRecorder.ondataavailable</code> and emitting a 100 KB chunk every 100ms over socket.io. It works on a laptop next to the server. Why is it the wrong architecture?',
            'Một lập trình viên dựng cuộc gọi video bằng cách lấy <code>MediaRecorder.ondataavailable</code> rồi emit một mẩu 100 KB mỗi 100ms qua socket.io. Trên một laptop kê cạnh máy chủ thì nó chạy. Vì sao đó là kiến trúc sai?',
          ),
          options: [
            B('Because <code>maxHttpBufferSize</code> caps a frame at 1 MB, and a 100 KB chunk is close enough that a spike will start dropping frames', 'Vì <code>maxHttpBufferSize</code> chặn một frame ở 1 MB, và một mẩu 100 KB đã gần tới mức đó nên một lúc dồn tải sẽ bắt đầu rớt frame'),
            B('Because it pushes 8 Mbps of media through the server per call, adds 100-500ms of latency and has no jitter buffer — media belongs on WebRTC peer-to-peer, and socket.io should carry only the signalling', 'Vì nó đẩy 8 Mbps dữ liệu đa phương tiện qua máy chủ cho mỗi cuộc gọi, cộng thêm 100-500ms độ trễ và không có bộ đệm chống giật — phần đa phương tiện thuộc về WebRTC nối trực tiếp hai đầu, còn socket.io chỉ nên cõng phần báo hiệu'),
            B('Because binary over socket.io is base64-encoded, so the real cost is 33% higher than the developer measured', 'Vì dữ liệu nhị phân qua socket.io bị mã hoá base64, nên chi phí thật cao hơn 33% so với con số lập trình viên đo được'),
            B('Because <code>MediaRecorder</code> chunks are not decodable independently, so only the very first chunk plays and the rest are discarded by the receiver', 'Vì các mẩu của <code>MediaRecorder</code> không giải mã độc lập được, nên chỉ mẩu đầu tiên phát được còn phần còn lại bị bên nhận vứt bỏ'),
          ],
          correct: 1,
          explanation: EX(
            'Two layers, and this design collapses them into one. 100 KB every 100ms is 1 MB/s, which is <b>8 Mbps per call through your server</b> — a thousand concurrent calls would be 8 Gbps of egress you are paying for. In a correct design the media never touches the server: WebRTC carries RTP over UDP directly between the peers at roughly 1-2 Mbps per stream, with a jitter buffer and loss concealment built for exactly this. Socket.io\'s job is the <b>signalling</b> — relaying the offer, the answer and the ICE candidates so the peers can find each other. Measured in the course repo, that is 5-20 packets and about 2 KB for the whole call, after which socket.io is idle. Option 3 is true over polling and false over WebSocket, and either way it is a rounding error next to 8 Mbps.',
            'Hai tầng, và thiết kế này ép chúng thành một. 100 KB mỗi 100ms là 1 MB/s, tức <b>8 Mbps mỗi cuộc gọi đi xuyên qua máy chủ của bạn</b> — một nghìn cuộc gọi đồng thời sẽ là 8 Gbps lưu lượng đi ra mà bạn phải trả tiền. Trong một thiết kế đúng thì phần đa phương tiện không hề chạm tới máy chủ: WebRTC cõng RTP trên UDP đi thẳng giữa hai đầu ở khoảng 1-2 Mbps mỗi luồng, kèm bộ đệm chống giật và cơ chế che giấu mất gói vốn sinh ra đúng cho việc này. Việc của socket.io là phần <b>báo hiệu</b> — tiếp sức lời mời, lời đáp và các ứng viên ICE để hai đầu tìm được nhau. Đo trong kho mã của khoá học, đó là 5-20 packet và khoảng 2 KB cho cả cuộc gọi, sau đó socket.io ngồi không. Phương án 3 đúng với polling và sai với WebSocket, và đằng nào nó cũng chỉ là sai số làm tròn bên cạnh con số 8 Mbps.',
          ),
        }),

        // q39 · đáp án 3
        mcq({
          prompt: B(
            'A call works everywhere except on one old Android device, and a teammate proposes fixing it by rewriting the SDP inside the ' + c("socket.on('call:offer')") + ' handler to force H.264. What is the objection?',
            'Một cuộc gọi chạy được ở mọi nơi trừ một máy Android cũ, và một đồng đội đề xuất chữa bằng cách viết lại SDP ngay trong handler ' + c("socket.on('call:offer')") + ' để ép dùng H.264. Phản đối ở chỗ nào?',
          ),
          options: [
            B('SDP is a binary blob wrapped in base64 by the parser, so it cannot be edited as text without corrupting the DTLS fingerprint inside it', 'SDP là một khối nhị phân được parser bọc trong base64, nên không thể sửa như văn bản mà không làm hỏng cái vân tay DTLS nằm bên trong'),
            B('The offer never reaches the server at all: SDP travels peer-to-peer over the WebRTC data channel, so there is nothing in that handler to rewrite', 'Lời mời không bao giờ tới máy chủ: SDP đi thẳng giữa hai đầu qua kênh dữ liệu WebRTC, nên trong cái handler đó chẳng có gì để viết lại'),
            B('It would work correctly, but parsing 1-3 KB of SDP per call is CPU the signalling tier cannot spare, which is why this repo relays the blob untouched', 'Cách đó chạy đúng, nhưng phân tích 1-3 KB SDP mỗi cuộc gọi là phần CPU mà tầng báo hiệu không dư ra được, và đó là lý do kho này tiếp sức nguyên khối'),
            B('The signalling server is deliberately dumb — it relays SDP and ICE without parsing — and hand-editing SDP breaks negotiation; codec preference belongs on the client, via <code>setCodecPreferences()</code>', 'Máy chủ báo hiệu cố ý ngu ngốc — nó tiếp sức SDP và ICE mà không phân tích — và sửa tay SDP làm hỏng quá trình thương lượng; việc chọn codec thuộc về client, qua <code>setCodecPreferences()</code>'),
          ],
          correct: 3,
          explanation: EX(
            'The architecture is <b>a dumb server and smart peers</b>, and it is dumb on purpose: the server looks up the recipient\'s room, forwards the blob, and never reads it. That is what lets the signalling code stay a few hundred lines and survive every browser change. SDP is plain text of 1-3 KB describing codecs, bitrate, DTLS keys and ICE credentials, so it <b>is</b> editable — which is exactly the trap, because an edit that looks harmless desynchronises the two peers\' negotiation state and the failure surfaces later, on a different device, as a call that connects and shows no video. If a codec really must be forced, the browser has an API for it on the peer connection: <code>RTCRtpTransceiver.setCodecPreferences()</code>. Option 2 gets the topology backwards — SDP is precisely the part that CANNOT go peer-to-peer, because there is no peer connection yet.',
            'Kiến trúc ở đây là <b>máy chủ ngu, hai đầu khôn</b>, và nó ngu một cách cố ý: máy chủ tra room của người nhận, chuyển tiếp cái khối dữ liệu, và không bao giờ đọc nó. Chính điều đó giữ cho mã báo hiệu chỉ vài trăm dòng và sống sót qua mọi lần trình duyệt thay đổi. SDP là văn bản thuần dài 1-3 KB mô tả codec, tốc độ bit, khoá DTLS và thông tin xác thực ICE, nên nó <b>sửa được</b> — và đó đúng là cái bẫy, bởi một chỗ sửa trông vô hại làm lệch trạng thái thương lượng của hai đầu, rồi kiểu hỏng lộ ra muộn hơn, trên một máy khác, dưới dạng một cuộc gọi kết nối được mà không có hình. Nếu thật sự phải ép một codec thì trình duyệt có sẵn API cho việc đó trên chính peer connection: <code>RTCRtpTransceiver.setCodecPreferences()</code>. Phương án 2 đảo ngược hình trạng — SDP đúng là phần KHÔNG THỂ đi thẳng giữa hai đầu, vì lúc đó chưa có kết nối nào giữa hai đầu cả.',
          ),
        }),

        // q40 · đáp án 2
        mcq({
          prompt: B(
            'During a call the server relays candidates of three kinds: <code>host</code>, <code>srflx</code> and <code>relay</code>. Roughly 15% of calls end up on <code>relay</code>. What does that mean, and what does it cost?',
            'Trong một cuộc gọi, máy chủ tiếp sức ba loại ứng viên: <code>host</code>, <code>srflx</code> và <code>relay</code>. Khoảng 15% cuộc gọi rốt cuộc chạy trên <code>relay</code>. Điều đó nghĩa là gì, và tốn cái gì?',
          ),
          options: [
            B('Those peers picked the relay because it had the lowest latency; the cost is only the STUN server, which is free', 'Những cặp đó chọn relay vì nó có độ trễ thấp nhất; chi phí chỉ là máy chủ STUN, mà cái đó miễn phí'),
            B('Those calls fell back to relaying through the socket.io server, which is why signalling bandwidth spikes on symmetric NAT', 'Những cuộc gọi đó lùi về việc tiếp sức qua chính máy chủ socket.io, và đó là lý do băng thông báo hiệu tăng vọt khi gặp NAT đối xứng'),
            B('Those peers are behind symmetric NAT so no direct path exists; a TURN server relays the media instead, and it pays full media bandwidth — about 2 Mbps per call, both directions', 'Những cặp đó nằm sau NAT đối xứng nên không có đường trực tiếp nào; một máy chủ TURN tiếp sức phần đa phương tiện thay cho họ, và nó phải trả trọn băng thông đa phương tiện — khoảng 2 Mbps mỗi cuộc gọi, cả hai chiều'),
            B('Those are IPv6-only peers; <code>relay</code> is the candidate type used when a NAT64 gateway is in the path', 'Đó là các cặp chỉ có IPv6; <code>relay</code> là loại ứng viên dùng khi có một cổng NAT64 nằm trên đường đi'),
          ],
          correct: 2,
          explanation: EX(
            'The three candidate types are three ways to be reachable. <code>host</code> is the peer\'s own LAN address, which works if both are on the same network. <code>srflx</code> is the public address a STUN server reports, which works behind most home routers. <code>relay</code> is a TURN server\'s address, and it is the last resort: behind a <b>symmetric NAT</b> the public port differs per destination, so STUN cannot predict it and no direct path exists. Roughly 15% of users land there, and it is the expensive 15% — TURN receives and re-sends every media byte, about 2 Mbps per call, so a thousand concurrent relayed calls is 2 Gbps you pay for. Option 2 names the wrong server: TURN is a separate service (coturn, Xirsys, Twilio); socket.io never touches media, whatever the NAT does.',
            'Ba loại ứng viên là ba cách để với tới được. <code>host</code> là địa chỉ LAN của chính máy đó, dùng được nếu cả hai cùng một mạng. <code>srflx</code> là địa chỉ công khai mà một máy chủ STUN báo về, dùng được sau phần lớn bộ định tuyến gia đình. <code>relay</code> là địa chỉ của một máy chủ TURN, và đó là phương án cuối: sau một <b>NAT đối xứng</b>, cổng công khai khác nhau tuỳ đích đến, nên STUN không đoán nổi và không có đường trực tiếp nào tồn tại. Khoảng 15% người dùng rơi vào đó, và đó là 15% đắt đỏ — TURN nhận rồi gửi lại từng byte đa phương tiện, khoảng 2 Mbps mỗi cuộc gọi, nên một nghìn cuộc gọi qua relay đồng thời là 2 Gbps bạn phải trả. Phương án 2 gọi tên nhầm máy chủ: TURN là một dịch vụ riêng (coturn, Xirsys, Twilio); socket.io không bao giờ đụng tới phần đa phương tiện, bất kể NAT làm gì.',
          ),
        }),

        // q41 · đáp án 1
        mcq({
          prompt: B(
            'A product wants group calls of 8 people, built on the existing peer-to-peer mesh where everyone connects to everyone. What breaks, and what replaces it?',
            'Một sản phẩm muốn có cuộc gọi nhóm 8 người, dựng trên mạng lưới nối trực tiếp hiện có, nơi ai cũng nối tới tất cả. Cái gì vỡ, và cái gì thay thế nó?',
          ),
          options: [
            B('The signalling breaks first: 8 peers need 56 socket.io rooms, which exceeds what one namespace can route', 'Phần báo hiệu vỡ trước: 8 người cần 56 room socket.io, vượt quá khả năng định tuyến của một namespace'),
            B('Each peer must upload its stream to all 7 others, so upload cost grows with N and consumer connections cannot carry it; an SFU takes ONE upload per peer and forwards it, moving the N-squared cost from the peers to the server', 'Mỗi người phải tải luồng của mình lên cả 7 người kia, nên chi phí tải lên tăng theo N và đường truyền của người dùng thường không cõng nổi; một SFU nhận MỘT luồng tải lên từ mỗi người rồi chuyển tiếp, dời chi phí N bình phương từ các đầu cuối sang máy chủ'),
            B('Nothing breaks technically; the mesh scales fine to 8, but browsers cap a page at 4 simultaneous <code>RTCPeerConnection</code> objects', 'Không có gì vỡ về mặt kỹ thuật; mạng lưới chạy tốt tới 8 người, chỉ là trình duyệt giới hạn mỗi trang tối đa 4 đối tượng <code>RTCPeerConnection</code> cùng lúc'),
            B('The TURN cost explodes, so the fix is an MCU, which decodes and re-encodes every stream into one composite and is cheaper than an SFU', 'Chi phí TURN bùng nổ, nên cách chữa là một MCU, thứ giải mã rồi mã hoá lại mọi luồng thành một luồng ghép và rẻ hơn SFU'),
          ],
          correct: 1,
          explanation: EX(
            'A mesh has N(N-1) connections, and the part that hurts is the <b>upload</b>: every peer sends its own stream once per other peer. At N=2 that is one stream up. At N=4 it is three, and lag starts. At N=8 it is seven streams up from a home connection, which simply does not happen — the mesh is a 2-3 person design. An <b>SFU</b> changes the shape: each peer uploads once and downloads N-1, the server forwards without decoding, so peer cost is O(1) and the N-squared term lands on the server (8 in, 56 out on a 64 Mbps link for one 8-person call). Socket.io does not go away in either design; it stays the control plane, now carrying room-join and transport-parameter events with the SFU instead of offers between peers. Option 4 gets the trade backwards — an MCU decodes, mixes and re-encodes, which is far more CPU than an SFU that only routes.',
            'Một mạng lưới có N(N-1) kết nối, và phần gây đau là chiều <b>tải lên</b>: mỗi người gửi luồng của mình một lần cho mỗi người khác. Ở N=2 là một luồng đi lên. Ở N=4 là ba luồng, và bắt đầu giật. Ở N=8 là bảy luồng đi lên từ một đường truyền gia đình, chuyện đó đơn giản là không xảy ra — mạng lưới là thiết kế cho 2-3 người. Một <b>SFU</b> đổi hẳn hình dạng: mỗi người tải lên một lần và tải xuống N-1 luồng, máy chủ chuyển tiếp mà không giải mã, nên chi phí ở đầu cuối là O(1) còn số hạng N bình phương rơi xuống máy chủ (8 vào, 56 ra trên một đường 64 Mbps cho một cuộc gọi 8 người). Socket.io không biến mất trong thiết kế nào cả; nó vẫn là mặt phẳng điều khiển, giờ cõng các sự kiện vào room và tham số transport với SFU thay vì cõng lời mời giữa hai đầu. Phương án 4 đảo ngược sự đánh đổi — một MCU giải mã, trộn rồi mã hoá lại, tốn CPU hơn hẳn một SFU vốn chỉ định tuyến.',
          ),
        }),

        /* ── Chương 8 — Soạn thảo cộng tác bằng CRDT (3 câu) ─────────────── */

        // q42 · đáp án 0
        mcq({
          prompt: B(
            'A team builds collaborative editing on socket.io events like ' + c("{ op: 'insert', pos: 12, text: 'x' }") + '. Two users type at once and the documents diverge. Which property of a CRDT removes the problem?',
            'Một đội dựng soạn thảo cộng tác trên các sự kiện socket.io kiểu ' + c("{ op: 'insert', pos: 12, text: 'x' }") + '. Hai người gõ cùng lúc và hai tài liệu lệch nhau. Tính chất nào của CRDT xoá bỏ vấn đề đó?',
          ),
          options: [
            B(
              'Updates commute: ' + c('apply(apply(D, u), v) === apply(apply(D, v), u)') + ', so any arrival order converges on the same document and no coordinator is needed',
              'Các cập nhật giao hoán: ' + c('apply(apply(D, u), v) === apply(apply(D, v), u)') + ', nên mọi thứ tự tới đều hội tụ về cùng một tài liệu và không cần một bên điều phối nào',
            ),
            B(
              'Updates are timestamped, and the later timestamp always wins, so concurrent edits resolve last-write-wins',
              'Các cập nhật được đóng dấu thời gian, và dấu muộn hơn luôn thắng, nên sửa đồng thời được giải quyết theo kiểu ghi-sau-thắng',
            ),
            B(
              'The server serialises every update into a total order before rebroadcasting, which is what makes the clients agree',
              'Máy chủ sắp mọi cập nhật vào một thứ tự toàn phần trước khi phát lại, và đó là thứ khiến các client đồng thuận',
            ),
            B(
              'Each update carries the full document state, so a client that falls behind is simply overwritten with the newest copy',
              'Mỗi cập nhật mang theo toàn bộ trạng thái tài liệu, nên một client bị tụt lại chỉ đơn giản bị ghi đè bằng bản mới nhất',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Position-based operations are order-dependent: an insert at position 12 means something different depending on what already landed, which is why two clients that received the same two edits in different orders end up with different text. A CRDT sidesteps the ordering problem instead of solving it. Yjs gives every character a globally unique, lexicographically ordered id that embeds the client id, so merging is a sort rather than a negotiation, and the merge <b>commutes</b> — the identity in option 1 is the whole reason no lock and no coordinator are required. Option 3 describes exactly what you are trying to avoid: a total order needs a coordinator, which is a single point of failure and a latency floor. Option 2 is a real strategy for a key-value cell but it silently loses one user\'s keystrokes in a text document.',
            'Các thao tác dựa trên vị trí phụ thuộc thứ tự: chèn ở vị trí 12 mang nghĩa khác nhau tuỳ theo thứ gì đã tới trước, và đó là lý do hai client nhận cùng hai chỗ sửa theo hai thứ tự khác nhau lại có hai đoạn văn bản khác nhau. Một CRDT né vấn đề thứ tự thay vì giải nó. Yjs gán cho mỗi ký tự một id duy nhất toàn cục, sắp được theo thứ tự từ điển, và có nhúng id của client, nên việc trộn là một phép sắp xếp chứ không phải một cuộc thương lượng, và phép trộn ấy <b>giao hoán</b> — đẳng thức ở phương án 1 chính là toàn bộ lý do không cần khoá và không cần bên điều phối. Phương án 3 mô tả đúng cái bạn đang cố tránh: một thứ tự toàn phần cần một bên điều phối, mà cái đó là một điểm hỏng duy nhất và một sàn độ trễ. Phương án 2 là một chiến lược có thật cho một ô khoá-giá trị, nhưng trong một tài liệu văn bản nó âm thầm làm mất các phím một người vừa gõ.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'A Y.Doc is persisted with ' + c("await prisma.note.update({ data: { yjsState: JSON.stringify(doc.toJSON()) } })") + '. Reloading gives a document that renders but has lost all collaborative history. What went wrong, and what is the memory story of a CRDT?',
            'Một Y.Doc được lưu bằng ' + c("await prisma.note.update({ data: { yjsState: JSON.stringify(doc.toJSON()) } })") + '. Tải lại thì được một tài liệu hiện ra được nhưng mất sạch lịch sử cộng tác. Sai ở đâu, và câu chuyện bộ nhớ của một CRDT là gì?',
          ),
          options: [
            B('Nothing is wrong with the storage; the history is lost because Prisma strips unknown JSON keys on update', 'Chỗ lưu không sai gì; lịch sử mất vì Prisma cắt bỏ các khoá JSON lạ khi cập nhật'),
            B('The state should be stored as JSON but under a <code>Json</code> column rather than a string, which preserves the character ids', 'Trạng thái nên lưu dạng JSON nhưng ở một cột kiểu <code>Json</code> chứ không phải chuỗi, như thế mới giữ được các id ký tự'),
            B('A Y.Doc holds only current text, so nothing was lost — the missing history is a separate feature that has to be enabled', 'Một Y.Doc chỉ giữ văn bản hiện tại, nên không mất gì cả — phần lịch sử thiếu là một tính năng riêng phải bật lên'),
            B('A Y.Doc is a binary structure: persist ' + c('Y.encodeStateAsUpdate(doc)') + ' into a BYTEA column. Serialising to JSON keeps the visible text and throws away the character ids and tombstones the CRDT needs to merge', 'Một Y.Doc là một cấu trúc nhị phân: hãy lưu ' + c('Y.encodeStateAsUpdate(doc)') + ' vào một cột BYTEA. Chuyển sang JSON thì giữ được phần văn bản nhìn thấy và vứt đi các id ký tự cùng các bia mộ mà CRDT cần để trộn'),
          ],
          correct: 3,
          explanation: EX(
            'The visible text is the smallest part of a Y.Doc. Underneath, every character carries a unique id (~16 bytes) and every deletion leaves a <b>tombstone</b> — a delete does not really delete, and that is precisely what makes merges commute. <code>toJSON()</code> gives you the readable projection and discards all of it, so the reloaded document can no longer merge with a client that has been offline. Store the binary: ' + c('Y.encodeStateAsUpdate(doc)') + ' into BYTEA/BLOB. The cost of that machinery is real — Yjs delta-encodes the ids so a document runs about 2-3× the raw text, and a heavily edited one keeps growing even when the text does not, which is why <code>snapshot</code> compaction has to run periodically (measured in the repo: 120 KB down to 45 KB). If you also need the text for search, save an HTML snapshot alongside the binary rather than instead of it.',
            'Phần văn bản nhìn thấy được là phần nhỏ nhất của một Y.Doc. Bên dưới, mỗi ký tự mang một id duy nhất (~16 byte) và mỗi lần xoá để lại một <b>bia mộ</b> — xoá không thật sự xoá, và chính điều đó làm cho các phép trộn giao hoán được. <code>toJSON()</code> cho bạn hình chiếu đọc được và vứt đi toàn bộ phần kia, nên tài liệu tải lại không còn trộn được với một client vừa ngoại tuyến về. Hãy lưu dạng nhị phân: ' + c('Y.encodeStateAsUpdate(doc)') + ' vào cột BYTEA/BLOB. Cái giá của bộ máy ấy là có thật — Yjs mã hoá sai phân các id nên một tài liệu nặng khoảng 2-3 lần văn bản thô, và một tài liệu bị sửa nhiều thì cứ phình ra dù văn bản không dài thêm, vì thế phải chạy nén <code>snapshot</code> định kỳ (đo trong kho mã: 120 KB xuống 45 KB). Nếu bạn còn cần văn bản để tìm kiếm thì hãy lưu thêm một bản chụp HTML bên cạnh bản nhị phân, chứ không phải thay cho nó.',
          ),
        }),

        // q44 · đáp án 2
        mcq({
          prompt: B(
            'A note owner revokes a collaborator\'s access. The collaborator keeps editing for a while and then stops. What made them stop, and what would have made them never stop?',
            'Chủ một ghi chú thu hồi quyền của một người cộng tác. Người đó vẫn sửa được một lúc rồi mới dừng. Cái gì khiến họ dừng, và cái gì đã có thể khiến họ không bao giờ dừng?',
          ),
          options: [
            B('The WebSocket was closed by the revoke; the delay was just the client\'s reconnect backoff finishing', 'WebSocket bị đóng bởi lượt thu hồi; cái độ trễ chỉ là vòng giãn cách nối lại của client chạy nốt'),
            B('<code>onAuthenticate</code> re-ran on the next update and rejected them; had the token been long-lived they would have continued', '<code>onAuthenticate</code> chạy lại ở lượt cập nhật kế tiếp và từ chối họ; nếu token sống lâu thì họ đã tiếp tục được'),
            B('A permission cache with a 5s TTL was still warm, so <code>beforeHandleMessage</code> kept allowing updates until it expired — and if the revoke path fails to invalidate the cache explicitly, they keep editing indefinitely', 'Một cache quyền với TTL 5 giây vẫn còn ấm, nên <code>beforeHandleMessage</code> tiếp tục cho phép cập nhật cho tới khi nó hết hạn — và nếu đường thu hồi không chủ động xoá cache thì họ sửa được vô thời hạn'),
            B('Permissions are only checked when a document loads, so they stopped when they refreshed the page; without a refresh they would never stop', 'Quyền chỉ được kiểm khi tài liệu được nạp, nên họ dừng lúc tải lại trang; không tải lại thì không bao giờ dừng'),
          ],
          correct: 2,
          explanation: EX(
            'Auth here is in two stages and the second one has a cache. <code>onAuthenticate</code> verifies the token once, at connect. <code>onLoadDocument</code> resolves read/write permission for that specific document. And <code>beforeHandleMessage</code> re-checks it on <b>every update</b> — a live check, which is what makes revocation possible at all on an already-open socket, since a database revoke stops the next HTTP request and does nothing to a WebSocket that authenticated ten minutes ago. Checking the database on every keystroke would be 100 queries a second, so a 5s TTL cache sits in front, and the acceptable consequence is up to five seconds of continued editing after a revoke. The unacceptable consequence is what option 3\'s second half names: if the revoke does not explicitly <code>redis.del</code> the cache key and call <code>closeConnections</code>, the ex-collaborator keeps editing for as long as they stay connected.',
            'Xác thực ở đây có hai chặng, và chặng thứ hai có một cái cache. <code>onAuthenticate</code> kiểm token một lần, lúc kết nối. <code>onLoadDocument</code> phân giải quyền đọc/ghi cho đúng tài liệu đó. Còn <code>beforeHandleMessage</code> kiểm lại nó ở <b>mọi lượt cập nhật</b> — một phép kiểm sống, và chính nó mới làm cho việc thu hồi có tác dụng trên một socket vốn đã mở, bởi một lượt thu hồi trong cơ sở dữ liệu chỉ chặn được request HTTP kế tiếp chứ không làm gì được một WebSocket đã xác thực từ mười phút trước. Truy vấn cơ sở dữ liệu mỗi phím gõ sẽ là 100 truy vấn mỗi giây, nên một cache TTL 5 giây đứng chắn phía trước, và hệ quả chấp nhận được là tối đa năm giây vẫn sửa được sau khi bị thu hồi. Hệ quả không chấp nhận được chính là nửa sau của phương án 3: nếu đường thu hồi không chủ động <code>redis.del</code> cái khoá cache và gọi <code>closeConnections</code>, người cộng tác cũ cứ sửa tiếp chừng nào họ còn kết nối.',
          ),
        }),

        /* ── Chương 9 — Raw WebSocket cho thiết bị (3 câu) ────────────────── */

        // q45 · đáp án 1
        mcq({
          prompt: B(
            'In this repo, <code>messaging.socket.ts</code> is 518 lines and <code>device.gateway.ts</code> is 1,035 — twice the size for what is arguably a simpler feature. Why?',
            'Trong kho mã này, <code>messaging.socket.ts</code> dài 518 dòng còn <code>device.gateway.ts</code> dài 1.035 — gấp đôi, cho một tính năng có thể nói là đơn giản hơn. Vì sao?',
          ),
          options: [
            B('Device telemetry needs schema validation on every message, and the validators are most of those lines', 'Dữ liệu đo từ thiết bị cần kiểm lược đồ ở mỗi thông điệp, và phần lớn số dòng đó là các bộ kiểm'),
            B('The devices are ESP32 firmware with no socket.io client available, so the gateway hand-writes what socket.io provides for free: reconnect, heartbeat, room fanout, auth handshake and error handling', 'Các thiết bị là firmware ESP32 không có client socket.io nào để dùng, nên gateway phải tự viết những thứ socket.io cho sẵn: nối lại, nhịp tim, toả tin theo room, bắt tay xác thực và xử lý lỗi'),
            B('Raw <code>ws</code> has no room concept, so each device gets its own dedicated WebSocket server instance and the boilerplate multiplies', '<code>ws</code> thuần không có khái niệm room, nên mỗi thiết bị được một thực thể máy chủ WebSocket riêng và phần khung lặp lại nhân lên'),
            B('The device tier speaks MQTT and the file is mostly an MQTT-to-WebSocket translation layer', 'Tầng thiết bị nói MQTT và cái file phần lớn là một tầng dịch MQTT sang WebSocket'),
          ],
          correct: 1,
          explanation: EX(
            'The size difference is a measurement of what socket.io does for you. There is no socket.io client for C++/Arduino/ESP32 — the table in lesson 9.5 lists JavaScript, Node, React Native, Swift, Kotlin, Python and C# as available, and embedded as the single "NO" — so the firmware speaks raw WebSocket, and everything socket.io normally handles has to be written twice: once in the firmware and once in the gateway. Reconnect with backoff, heartbeat and dead-peer detection, fanout to whoever is watching, an auth handshake, framing, error handling, health checks. That is the whole 500-line difference. The rule the chapter draws from it: choose raw ws only when the client platform leaves you no choice, and note that a Raspberry Pi running Node does not — the same gateway would be about 200 lines there.',
            'Chênh lệch kích thước chính là một phép đo những việc socket.io làm hộ bạn. Không có client socket.io nào cho C++/Arduino/ESP32 — bảng ở bài 9.5 liệt kê JavaScript, Node, React Native, Swift, Kotlin, Python và C# là có, còn nhúng là ô "KHÔNG" duy nhất — nên firmware nói WebSocket thuần, và mọi thứ socket.io thường lo phải được viết hai lần: một lần trong firmware và một lần trong gateway. Nối lại có giãn cách, nhịp tim và phát hiện đầu kia đã chết, toả tin tới những ai đang theo dõi, một cú bắt tay xác thực, đóng khung thông điệp, xử lý lỗi, kiểm tra sức khoẻ. Đó là trọn vẹn 500 dòng chênh lệch. Quy tắc chương này rút ra: chỉ chọn ws thuần khi nền tảng client không cho bạn lựa chọn nào khác, và lưu ý rằng một Raspberry Pi chạy Node thì không thuộc trường hợp đó — cũng cái gateway ấy ở đó chỉ khoảng 200 dòng.',
          ),
        }),

        // q46 · đáp án 0
        mcq({
          prompt: B(
            'A thousand ESP32 devices lose their connection in the same second because the server restarted. Each retries after a fixed one-second delay. The server comes up, falls over again, and the cycle repeats. What is the fix, and why is it so cheap?',
            'Một nghìn thiết bị ESP32 mất kết nối trong cùng một giây vì máy chủ khởi động lại. Mỗi cái thử lại sau một khoảng cố định một giây. Máy chủ lên, rồi lại đổ, và vòng đó lặp lại. Cách chữa là gì, và vì sao nó rẻ đến thế?',
          ),
          options: [
            B(
              'Add a random factor to each delay: the clients still all retry, but spread across the window instead of the same millisecond, and it is three lines in the firmware',
              'Thêm một hệ số ngẫu nhiên vào mỗi khoảng chờ: các client vẫn thử lại hết, nhưng rải ra trong cả cửa sổ thay vì dồn vào cùng một mili giây, và nó chỉ là ba dòng trong firmware',
            ),
            B(
              'Raise the fixed delay from 1s to 30s: the storm still arrives together but the server has had time to warm up first',
              'Nâng khoảng chờ cố định từ 1 giây lên 30 giây: cơn bão vẫn tới cùng lúc nhưng máy chủ đã kịp khởi động xong trước đó',
            ),
            B(
              'Put a rate limiter on the server and reject the excess handshakes, so the devices back off because they are being refused',
              'Đặt một bộ giới hạn tốc độ ở máy chủ và từ chối phần thừa, để các thiết bị tự giãn ra vì bị từ chối',
            ),
            B(
              'Have the devices reconnect only after a successful HTTP health check, which naturally staggers them by network latency',
              'Cho các thiết bị chỉ nối lại sau một lượt kiểm tra sức khoẻ HTTP thành công, việc đó tự nhiên làm chúng lệch nhau theo độ trễ mạng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The outage reads as "the server cannot stay up" when the server is fine and the clients are the load. Exponential backoff alone does not fix it: a thousand devices that all failed at t=0 also all wait exactly one second, then exactly two, then exactly four — synchronised the whole way down the ladder. What breaks the synchrony is <b>jitter</b>, a random factor applied to each delay so the same thousand connections spread across the window. This repo\'s firmware uses simple exponential backoff, capped at 30s, with ±20% jitter, and resets the delay on a successful <em>connection</em> rather than on an attempt — a connection that drops immediately should not go back to a one-second retry. Option 2 delays the storm without spreading it. Option 3 moves the work to the server but the handshakes still arrive, which is the expensive part.',
            'Sự cố này đọc lên như "máy chủ không trụ nổi" trong khi máy chủ vẫn ổn và chính các client mới là tải. Chỉ giãn cách theo cấp số nhân thì không chữa được: một nghìn thiết bị cùng hỏng ở mốc t=0 thì cũng cùng chờ đúng một giây, rồi đúng hai giây, rồi đúng bốn giây — đồng bộ với nhau suốt cả cái thang. Thứ phá vỡ sự đồng bộ đó là <b>jitter</b>, một hệ số ngẫu nhiên áp lên từng khoảng chờ để cũng một nghìn kết nối ấy rải ra trong cả cửa sổ. Firmware của kho này dùng giãn cách theo cấp số nhân đơn giản, chặn trên ở 30 giây, jitter ±20%, và đặt lại khoảng chờ khi <em>kết nối</em> thành công chứ không phải khi thử — một kết nối rớt ngay lập tức thì không nên quay về mức thử lại một giây. Phương án 2 hoãn cơn bão mà không rải nó ra. Phương án 3 dời công việc sang máy chủ nhưng các cú bắt tay vẫn cứ tới, và chính đó mới là phần đắt.',
          ),
        }),

        // q47 · đáp án 3
        mcq({
          prompt: B(
            'The bridge relays device telemetry into socket.io with ' + c("io.to(`device:${deviceId}`).emit('device:telemetry', { deviceId, ...payload, receivedAt: Date.now() })") + '. A reviewer says the design has one serious hole. Where is it?',
            'Cầu nối tiếp sức dữ liệu đo của thiết bị vào socket.io bằng ' + c("io.to(`device:${deviceId}`).emit('device:telemetry', { deviceId, ...payload, receivedAt: Date.now() })") + '. Một người review nói thiết kế này có một lỗ hổng nghiêm trọng. Nó ở đâu?',
          ),
          options: [
            B('The room name is derived from client input, so a crafted <code>deviceId</code> lets a dashboard join an arbitrary room', 'Tên room lấy từ dữ liệu client gửi lên, nên một <code>deviceId</code> được dựng khéo cho phép một bảng điều khiển vào một room bất kỳ'),
            B('<code>receivedAt</code> is server time while the payload carries device time, so dashboards cannot order readings correctly', '<code>receivedAt</code> là giờ máy chủ còn phần tải mang giờ thiết bị, nên các bảng điều khiển không sắp đúng thứ tự các số đo'),
            B('<code>io.to</code> should be <code>io.in</code> here, because the bridge is not a socket and cannot use the <code>to</code> selector', 'Ở đây phải dùng <code>io.in</code> chứ không phải <code>io.to</code>, vì cầu nối không phải một socket nên không dùng được bộ chọn <code>to</code>'),
            B('It emits without having authenticated the device: anyone who knows a <code>deviceId</code> can open a raw WebSocket, and the bridge will publish their fabricated telemetry to every dashboard watching that device', 'Nó phát đi mà chưa xác thực thiết bị: bất kỳ ai biết một <code>deviceId</code> đều mở được một WebSocket thuần, và cầu nối sẽ công bố dữ liệu bịa của họ tới mọi bảng điều khiển đang theo dõi thiết bị đó'),
          ],
          correct: 3,
          explanation: EX(
            'A bridge is a trust boundary, and it needs a check on <b>both</b> sides. Going up, the device must prove who it is before anything it says is published — a device token verified at the raw WebSocket handshake, not merely the presence of a <code>deviceId</code> in the payload, because a <code>deviceId</code> is an identifier and not a credential. Going down, a dashboard asking to <code>maker:device:join</code> a device room must be checked against that user\'s access to that device, or the room name becomes a lookup key for anyone else\'s telemetry. Option 1 names a real concern but at the wrong door: the join path is where it applies, and the emit shown here is the publish path. <code>io.to</code> and <code>io.in</code> are aliases and both work on the server object, so option 3 is inventing a rule.',
            'Một cầu nối là một ranh giới tin cậy, và nó cần một phép kiểm ở <b>cả hai</b> phía. Chiều đi lên, thiết bị phải chứng minh nó là ai trước khi bất cứ điều gì nó nói được công bố — một token thiết bị được xác minh ngay ở cú bắt tay WebSocket thuần, chứ không phải chỉ nhờ có một <code>deviceId</code> trong phần tải, bởi <code>deviceId</code> là một định danh chứ không phải một chứng thực. Chiều đi xuống, một bảng điều khiển xin <code>maker:device:join</code> vào room của một thiết bị phải được đối chiếu với quyền của người dùng đó trên thiết bị đó, nếu không thì tên room trở thành một khoá tra cứu để xem dữ liệu đo của người khác. Phương án 1 nêu một mối lo có thật nhưng gõ nhầm cửa: nó áp cho đường join, còn lượt emit ở đây là đường công bố. <code>io.to</code> và <code>io.in</code> là bí danh của nhau và cả hai đều dùng được trên đối tượng máy chủ, nên phương án 3 đang bịa ra một quy tắc.',
          ),
        }),

        /* ── Chương 10 — Sách công thức chẩn đoán (2 câu) ─────────────────── */

        // q48 · đáp án 2
        mcq({
          prompt: B(
            'A bug report says "notifications sometimes do not arrive". Before touching any code, which sequence does the diagnosis cookbook prescribe?',
            'Một báo cáo lỗi ghi "thông báo đôi khi không tới". Trước khi đụng vào bất kỳ dòng mã nào, sách công thức chẩn đoán bảo làm theo trình tự nào?',
          ),
          options: [
            B(
              'Add a <code>console.log</code> at the top of the handler and at the emit site, redeploy, and wait for the bug to happen again',
              'Thêm một <code>console.log</code> ở đầu handler và ở chỗ emit, deploy lại, rồi chờ con bug tái diễn',
            ),
            B(
              'Check the database first: if the row is there, the realtime layer is fine and the bug is in the frontend state',
              'Kiểm cơ sở dữ liệu trước: nếu dòng dữ liệu có ở đó thì tầng realtime ổn và con bug nằm ở trạng thái phía giao diện',
            ),
            B(
              'Four questions in order — is the client connected, is the event on the wire, is the handler running, did the side effect happen — and if question 1 fails, do not debug 2 to 4, because they all assume a connection exists',
              'Bốn câu hỏi theo thứ tự — client đã kết nối chưa, sự kiện có trên dây không, handler có chạy không, tác dụng phụ đã xảy ra chưa — và nếu câu 1 đã trượt thì đừng gỡ câu 2 tới 4, vì cả ba đều giả định rằng có một kết nối tồn tại',
            ),
            B(
              'Reproduce it locally first; a bug that does not reproduce on one worker is almost always a cluster problem and belongs to infrastructure',
              'Tái hiện cục bộ trước; một con bug không tái hiện được trên một worker thì gần như luôn là vấn đề cụm và thuộc về hạ tầng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The value of the cookbook is the ORDER, because each question has its own tool and each one assumes the previous answer was yes. Q1, is the client connected: the DevTools WS tab showing status 101, the transport-upgrade log, a <code>connect_error</code> handler, the server log. Q2, is the event on the wire: read the frames in the Messages tab — a frame present with no handler running is a receive-side bug (wrong event name, wrong namespace, a different socket), no frame at all is an emit-side bug (an empty room, a Redis blip, a full buffer). Q3, is the handler running. Q4, did the side effect happen. Answering them in order turns a 15-minute <code>console.log</code> cycle into about five minutes, and skipping to Q3 while Q1 is actually the failure is how an afternoon disappears. Option 4 also inverts something: a bug that only appears in production usually IS the cluster, but you establish that by answering Q1 and Q2, not by assuming it.',
            'Giá trị của sách công thức nằm ở THỨ TỰ, bởi mỗi câu hỏi có công cụ riêng và mỗi câu đều giả định câu trước đã trả lời là có. Câu 1, client đã kết nối chưa: tab WS của DevTools hiện trạng thái 101, dòng log nâng cấp transport, một handler <code>connect_error</code>, log máy chủ. Câu 2, sự kiện có trên dây không: đọc các frame trong tab Messages — có frame mà không có handler nào chạy là bug phía nhận (sai tên sự kiện, sai namespace, nhầm socket), còn không có frame nào cả là bug phía gửi (room rỗng, Redis chớp, bộ đệm đầy). Câu 3, handler có chạy không. Câu 4, tác dụng phụ đã xảy ra chưa. Trả lời chúng theo thứ tự biến một vòng <code>console.log</code> 15 phút thành khoảng năm phút, còn nhảy thẳng tới câu 3 trong khi chỗ hỏng thật ra ở câu 1 là cách một buổi chiều bốc hơi. Phương án 4 cũng đảo ngược một điều: một con bug chỉ xuất hiện trên production thường ĐÚNG là chuyện cụm, nhưng bạn xác lập điều đó bằng cách trả lời câu 1 và câu 2, chứ không phải bằng cách giả định nó.',
          ),
        }),

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'Three reports arrive from a clustered deployment on the same day. (a) A roughly random slice of users receives nothing. (b) Some users get HTTP 400 on their polling requests and never connect. (c) Presence flaps online/offline for users who did nothing. Which set of causes matches?',
            'Ba báo cáo cùng đến từ một hệ thống chạy cụm trong một ngày. (a) Một phần người dùng gần như ngẫu nhiên không nhận được gì. (b) Một số người dùng nhận HTTP 400 trên các request polling và không bao giờ kết nối được. (c) Presence chớp online/offline với những người dùng không làm gì cả. Bộ nguyên nhân nào khớp?',
          ),
          options: [
            B('(a) sticky sessions missing, (b) the adapter not attached, (c) a memory leak in the presence map', '(a) thiếu sticky session, (b) adapter chưa gắn, (c) rò rỉ bộ nhớ trong map presence'),
            B('(a) the Redis adapter never attached, (b) sticky sessions missing at the proxy, (c) presence state kept in process memory instead of shared across workers', '(a) Redis adapter chưa từng được gắn, (b) thiếu sticky session ở proxy, (c) trạng thái presence giữ trong bộ nhớ tiến trình thay vì chia sẻ giữa các worker'),
            B('All three are the same root cause: Redis is unreachable, and the adapter degrades silently', 'Cả ba cùng một gốc: Redis không với tới được, và adapter suy giảm trong im lặng'),
            B('(a) a full send buffer, (b) <code>maxHttpBufferSize</code> too low, (c) <code>pingTimeout</code> shorter than the proxy read timeout', '(a) bộ đệm gửi đầy, (b) <code>maxHttpBufferSize</code> đặt quá thấp, (c) <code>pingTimeout</code> ngắn hơn read timeout của proxy'),
          ],
          correct: 1,
          explanation: EX(
            'Three distinct cluster failures with three distinct signatures, and telling them apart is most of the work. <b>(a)</b> "a random 1/N gets nothing" is the adapter: a broadcast stays inside the worker that issued it. Confirm it with <code>redis-cli PSUBSCRIBE "socket.io#*"</code> — silence during a broadcast means nothing is being published. <b>(b)</b> HTTP 400 on a poll is the session, not the broadcast: the several requests of one polling handshake landed on different workers, and the body says ' + c('{"code":1,"message":"Session ID unknown"}') + '. That is a proxy fix and the adapter does not touch it. <b>(c)</b> flapping presence is per-worker state: a user\'s three tabs are on three workers, each of which sees a set of size one and announces offline as its own tab closes. Option 3 is the tempting shortcut — Redis being down would explain (a), but it explains neither the 400 nor the flapping, because neither of those goes through Redis at all.',
            'Ba kiểu hỏng khác nhau của cụm với ba dấu vết khác nhau, và phân biệt được chúng đã là phần lớn công việc. <b>(a)</b> "một phần N ngẫu nhiên không nhận gì" là chuyện adapter: một lượt broadcast nằm lại trong worker đã phát nó. Xác nhận bằng <code>redis-cli PSUBSCRIBE "socket.io#*"</code> — im lặng trong lúc đang broadcast nghĩa là không có gì được publish. <b>(b)</b> HTTP 400 trên một lượt poll là chuyện phiên, không phải chuyện broadcast: mấy request của cùng một cú bắt tay polling rơi vào các worker khác nhau, và thân phản hồi ghi ' + c('{"code":1,"message":"Session ID unknown"}') + '. Đó là chỗ chữa ở proxy và adapter không đụng tới. <b>(c)</b> presence chớp nháy là chuyện trạng thái theo từng worker: ba tab của một người nằm trên ba worker, mỗi worker thấy một tập kích thước một và tuyên bố offline khi cái tab của riêng nó đóng. Phương án 3 là lối tắt dễ dụ — Redis chết thì giải thích được (a), nhưng không giải thích được cái 400 lẫn chuyện chớp nháy, bởi cả hai thứ đó chẳng đi qua Redis chút nào.',
          ),
        }),

        /* ── Chương 11 — Cái sống qua đo lường (1 câu) ────────────────────── */

        // q50 · đáp án 0
        mcq({
          prompt: B(
            'Chapter 11 sorts what you have learned into three columns: A, rules that hold in any repo; B, this repo\'s measurements, which you must re-run on your own; C, intuitions that lost to measurement. Which assignment is correct?',
            'Chương 11 xếp những gì bạn đã học vào ba cột: A, các quy tắc đúng ở mọi kho mã; B, các số đo của riêng kho này, thứ bạn phải tự đo lại; C, các trực giác đã thua phép đo. Cách xếp nào đúng?',
          ),
          options: [
            B(
              '"The client always starts on polling" is A · "the average audience is 30 people" is B · "the Redis adapter replaces sticky sessions" is C',
              '"Client luôn khởi đầu bằng polling" thuộc A · "khán giả trung bình 30 người" thuộc B · "Redis adapter thay thế được sticky session" thuộc C',
            ),
            B(
              '"pingTimeout is 60s" is A · "the sid changes on reconnect" is B · "WebRTC media travels over socket.io" is C',
              '"pingTimeout là 60 giây" thuộc A · "sid đổi khi nối lại" thuộc B · "dữ liệu đa phương tiện WebRTC đi qua socket.io" thuộc C',
            ),
            B(
              '"device.gateway.ts is 1,035 lines" is A · "the default is at-most-once" is B · "a disconnect means the user is offline" is C',
              '"device.gateway.ts dài 1.035 dòng" thuộc A · "mặc định là nhiều nhất một lần" thuộc B · "một lần disconnect nghĩa là người dùng đã offline" thuộc C',
            ),
            B(
              '"polling is 133 times heavier than WebSocket" is A · "this repo runs three WS servers" is C · "the sid changes on reconnect" is B',
              '"polling nặng gấp 133 lần WebSocket" thuộc A · "kho này chạy ba máy chủ WS" thuộc C · "sid đổi khi nối lại" thuộc B',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Sorting a claim into the right column is the habit the whole course is teaching. <b>A</b> is a property of socket.io 4.x, so it needs no measurement anywhere: the client always opens on polling, the two sids differ, the default is at-most-once, the sid changes on reconnect, the adapter and stickiness are two different problems, WebRTC media never touches socket.io. <b>B</b> is a number this repo measured and yours will not match: pingTimeout 60s, an average audience of about 30, three WebSocket servers, 1,035 lines in the device gateway, a 26ms handshake. <b>C</b> is an intuition that lost — including the course author\'s own "133×", which had the right direction and the wrong mechanism and is kept in the text on purpose. ' +
            '<p>And one more entry belongs in C that the course itself has in A: <b>"io.to(A).to(B) is an intersection"</b>. Question 18 measured it — it is a union. A three-column table only works if you keep re-running it, including against the table.</p>',

            'Xếp một khẳng định vào đúng cột là thói quen mà cả khoá học này đang dạy. <b>A</b> là tính chất của socket.io 4.x, nên không cần đo ở đâu cả: client luôn mở bằng polling, hai cái sid khác nhau, mặc định là nhiều nhất một lần, sid đổi khi nối lại, adapter và tính dính là hai vấn đề khác nhau, dữ liệu đa phương tiện WebRTC không bao giờ chạm tới socket.io. <b>B</b> là con số kho này đã đo và kho của bạn sẽ không khớp: pingTimeout 60 giây, khán giả trung bình khoảng 30, ba máy chủ WebSocket, 1.035 dòng trong gateway thiết bị, cú bắt tay 26ms. <b>C</b> là một trực giác đã thua — trong đó có cả con số "133 lần" của chính tác giả khoá học, thứ đúng hướng mà sai cơ chế và được cố ý giữ lại trong bài. ' +
            '<p>Và còn một mục nữa lẽ ra thuộc C mà chính giáo trình lại xếp vào A: <b>"io.to(A).to(B) là phép giao"</b>. Câu 18 đã đo nó — đó là phép hợp. Một bảng ba cột chỉ có tác dụng nếu bạn liên tục chạy lại nó, kể cả chạy lại lên chính cái bảng.</p>',
          ),
        }),
      ],
    },
  ],
};
