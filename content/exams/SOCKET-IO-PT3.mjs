/**
 * Socket.IO — Progress Test 3 (chương s08–s11).
 *
 * Đề tự soạn, bám sát `content/courses/socket-io/s08-crdt`, `s09-raw-ws`,
 * `s10-chan-doan`, `s11-on-thi`. 30 câu trắc nghiệm + 2 câu lập trình làm
 * ngay trong phòng thi (chấm bằng AI theo rubric). PT là đề GIỮA KỲ — dễ hơn
 * FE một bậc, và không trùng câu nào với SOCKET-IO-FE.mjs / -PE.mjs / PT1 / PT2.
 *
 * ⚠️ Mọi frame trong đề (kể cả bộ dữ liệu của câu 31) đều bắt từ máy chủ
 * socket.io thật dựng trên cổng ngẫu nhiên; lời giải câu 32 đã chạy ba lượt
 * và diff — kết quả không phụ thuộc thời gian hay số cổng.
 *
 * Phiên bản đã dùng để đo (08–10/09/2026):
 *   socket.io 4.8.3 · socket.io-client 4.8.3 · engine.io 6.6.8
 *   engine.io-client 6.6.5 · ws 8.x · Node v22.21.0 · darwin arm64
 *
 * ────────────────────────────────────────────────────────────────────────
 * ⛔ GIÁO TRÌNH SAI — ĐỀ NÀY THEO MÁY
 * ────────────────────────────────────────────────────────────────────────
 * Chương 11 là chương TỔNG KẾT, và đúng hai mục trong "cột A — luôn đúng"
 * của bài 11.1 lại sai khi đem ra đo. Đây là chất liệu ra đề đắt giá nhất
 * của cả đề, nên câu 28 và 29 hỏi thẳng vào chúng.
 *
 * 1. Cột A #5: "`io.to(A).to(B)` là INTERSECTION — cần ở CẢ A VÀ B".
 *    Đo thật với A∈r1, B∈r1+r2, C∈r2 trên socket.io 4.8.3:
 *      io.to('r1').to('r2').emit('m')  ->  A, B, C  (B nhận ĐÚNG 1 gói)
 *      io.to(['r1','r2']).emit('m')    ->  A, B, C
 *    Đó là HỢP. Câu 12 của đề thi cuối (bài 11.2) cũng đang lấy "intersection"
 *    làm đáp án đúng — cần sửa cả hai chỗ. Câu 28.
 *
 * 2. Cột A #2: "client LUÔN bắt đầu bằng polling; mảng `transports` chỉ là
 *    danh sách được phép". Đo thật, đọc `engine.transport.name` tại `open`:
 *      transports:['websocket','polling'] -> websocket
 *      transports:['polling','websocket'] -> polling
 *    Câu đó chỉ đúng cho tuỳ chọn PHÍA SERVER cùng tên. Câu 29.
 *
 * 3. Bài 9.2 tự mâu thuẫn ba chỗ trong cùng một bài về backoff:
 *      - mã là `min(delay*2, 30000)` => 1s 2s 4s 8s 16s 30s, nhưng phần
 *        "một câu" tổng kết lại ghi "1s → 2s → 5s → 30s". Số 5s không có gốc.
 *      - chữ ghi "jitter ±20%", mã là `random(-500, 500)` trên nền 1000ms
 *        (tức ±50%), còn bảng ghi 1s → 0,5–1,5s (cũng ±50%).
 *      - cột Fibonacci ghi 1,1,2,3,5,8,13,30 — sau 13 phải là 21.
 *    Vì thế đề KHÔNG hỏi con số trong bảng đó; câu 10 và 11 chỉ hỏi NGUYÊN TẮC.
 *
 * 4. Bài 9.3: chú thích `// 8 byte: 2 float + 4 byte timestamp` — hai float
 *    đã là 8 byte và trong mã không hề có timestamp nào; ví dụ hex ngay dưới
 *    lại dài 12 byte. Đề không hỏi con số của ví dụ đó.
 *
 * 5. Bài 9.3 đóng kết nối bằng `ws.close(1002, 'invalid JSON')`. Theo
 *    RFC 6455 §7.4.1 thì 1002 là *Protocol Error* — dùng cho khung WebSocket
 *    hỏng. JSON hỏng NẰM BÊN TRONG một khung text hợp lệ, nên mã đúng là
 *    1007 (Invalid frame payload data) hoặc 1003. Câu 15.
 *
 * 6. Bài 8.1 đặt tiêu đề "HAI WebSocket server" (slug `io-8-1-hai-ws`) trong
 *    khi ngay câu mở đầu và cả quiz 8.6 đều nói BA. Đề dùng con số BA.
 *
 * 7. Bài 8.3 khẳng định Yjs/Hocuspocus "idle: 0 traffic (khác socket.io ping
 *    25s)". Cả `y-websocket` lẫn Hocuspocus đều có ping/pong giữ nhịp riêng,
 *    nên "0 traffic khi rảnh" là sai. Không đo được ở đây (không cài Yjs),
 *    nên đề KHÔNG ra câu nào dựa trên khẳng định đó.
 *
 * 8. Bài 9.1 và bảng 9.5 ghi "không có socket.io client C++". Có bản C++
 *    chính thức (`socketio-client-cpp`); điều đúng là nó KHÔNG chạy nổi trên
 *    ESP32 bare-metal. Không đo được ở đây, nên đề tránh ô C++ của bảng đó.
 *
 * KHÔNG ĐO ĐƯỢC (nên không ra đề dạng con số):
 *   - Yjs / Hocuspocus: không có trong node_modules của kho. Các câu chương 8
 *     hỏi CƠ CHẾ (giao hoán, bia mộ, awareness, cadence lưu) chứ không hỏi
 *     kích thước byte thật.
 *   - Firmware ESP32, TURN/SFU, cụm Redis nhiều tiến trình.
 *   - Mọi số đo thời gian: máy đang chạy nhiều agent song song.
 *
 * Phân bố đáp án (đếm bằng lệnh trong CLAUDE.md): { 0: 8, 1: 8, 2: 8, 3: 8 }
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SOCKET-IO-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/socketio-exam-kit.mjs';

export default {
  course: { slug: 'socket-io' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8–11 (CRDTs, raw WebSocket, the diagnosis cookbook, what survived measurement)',
        'Kiểm tra tiến độ 3 — Chương 8–11 (CRDT, WebSocket thuần, sách công thức chẩn đoán, cái sống qua đo lường)',
      ),
      description: B(
        'The last third of the Socket.IO course: where socket.io is the wrong tool, collaborative editing with CRDTs, raw WebSocket for microcontrollers, the four-question diagnosis tree, and the closing audit of which claims held up. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Two questions test claims the course states as always-true and the machine disagrees with.',
        'Một phần ba cuối của khoá Socket.IO: chỗ socket.io là công cụ sai, soạn thảo cộng tác bằng CRDT, WebSocket thuần cho vi điều khiển, cây chẩn đoán bốn câu hỏi, và bản kiểm kê cuối xem khẳng định nào đứng vững. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Có hai câu kiểm tra đúng những khẳng định giáo trình xếp vào nhóm luôn đúng mà máy lại nói khác.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–11'),
      questions: [
        // ── Chương 8 — CRDT và soạn thảo cộng tác ───────────────────────
        mcq({
          prompt: B(
            'The repo runs THREE WebSocket servers on ONE HTTP server and one port: socket.io on <code>/socket.io/</code>, Hocuspocus on <code>/notes-collaboration</code>, and a raw <code>ws</code> gateway on <code>/devices</code>. What makes them coexist?',
            'Kho này chạy BA máy chủ WebSocket trên MỘT máy chủ HTTP và một cổng: socket.io ở <code>/socket.io/</code>, Hocuspocus ở <code>/notes-collaboration</code>, và một gateway <code>ws</code> thuần ở <code>/devices</code>. Điều gì làm chúng sống chung được?',
          ),
          options: [
            B('Each one listens on its own port internally and nginx maps the three paths onto them', 'Mỗi cái nghe một cổng riêng bên trong và nginx ánh xạ ba đường dẫn vào chúng'),
            B('Each handler subscribes to the HTTP server\'s <code>upgrade</code> event and returns early unless the URL is its own', 'Mỗi handler lắng nghe sự kiện <code>upgrade</code> của máy chủ HTTP và thoát sớm trừ khi URL là của chính nó'),
            B('socket.io owns the upgrade and forwards the other two over its own namespaces', 'socket.io sở hữu cú upgrade rồi chuyển tiếp hai cái kia qua namespace của nó'),
            B('Node routes the upgrade automatically by matching the <code>Sec-WebSocket-Protocol</code> header', 'Node tự định tuyến cú upgrade bằng cách so header <code>Sec-WebSocket-Protocol</code>'),
          ],
          correct: 1,
          explanation: EX(
            'A WebSocket handshake arrives as an ordinary HTTP request that raises <code>upgrade</code> on the server, and every listener sees every one of them — which is why each handler must check <code>req.url</code> and return when it does not match. Forget one <code>return</code> and two libraries both call <code>handleUpgrade</code> on the same socket, which does not throw a clean error; it produces a connection that behaves strangely under load. Nothing here involves extra ports, namespaces or subprotocol negotiation.',
            'Một cú bắt tay WebSocket tới dưới dạng một request HTTP bình thường làm máy chủ phát sự kiện <code>upgrade</code>, và mọi listener đều thấy mọi cú như thế — nên từng handler bắt buộc phải kiểm <code>req.url</code> rồi thoát khi không khớp. Quên một lệnh <code>return</code> là hai thư viện cùng gọi <code>handleUpgrade</code> trên cùng một socket, thứ này không ném ra lỗi sạch sẽ mà tạo ra một kết nối hành xử kỳ quặc khi có tải. Ở đây không dính gì tới cổng phụ, namespace hay đàm phán subprotocol.',
          ),
        }),

        mcq({
          prompt: B(
            'In a CRDT text document, deleting a character does not remove it — it is marked as a tombstone. Why is that required?',
            'Trong một tài liệu văn bản CRDT, xoá một ký tự không phải là gỡ nó đi — nó bị đánh dấu thành bia mộ. Vì sao phải làm vậy?',
          ),
          options: [
            B('So the editor can offer undo without keeping a separate history stack', 'Để trình soạn thảo có thể hoàn tác mà không cần giữ một ngăn xếp lịch sử riêng'),
            B('Because a concurrent insert may be anchored to it, and a merge must still find that anchor', 'Vì một phép chèn đồng thời có thể neo vào nó, và khi hợp nhất vẫn phải tìm ra cái neo ấy'),
            B('Because deletions are only applied after the server confirms them, and the tombstone is the pending state', 'Vì phép xoá chỉ được áp sau khi máy chủ xác nhận, và bia mộ chính là trạng thái đang chờ'),
            B('To keep the byte offsets of all following characters stable for the search index', 'Để giữ nguyên độ lệch byte của mọi ký tự phía sau cho chỉ mục tìm kiếm'),
          ],
          correct: 1,
          explanation: EX(
            'Two people can act at once: one deletes a character while the other types right after it. If the deletion physically removed the item, the second person\'s insert would arrive referring to something that no longer exists, and the merge would have to guess — which is exactly the order-dependence a CRDT exists to eliminate. Keeping the item and hiding it lets both operations commute. The cost is real and permanent: a document that has been edited for a year is much larger than its visible text, which is why Yjs offers snapshot compaction.',
            'Hai người có thể hành động cùng lúc: một người xoá một ký tự trong khi người kia gõ ngay sau nó. Nếu phép xoá gỡ hẳn phần tử đi thì lệnh chèn của người thứ hai tới nơi lại trỏ vào một thứ không còn tồn tại, và phép hợp nhất sẽ phải đoán — đúng cái phụ thuộc thứ tự mà CRDT sinh ra để triệt tiêu. Giữ phần tử lại và ẩn nó đi thì hai thao tác giao hoán được. Cái giá là thật và vĩnh viễn: một tài liệu bị sửa suốt một năm sẽ lớn hơn hẳn phần chữ nhìn thấy, nên Yjs có cơ chế nén ảnh chụp.',
          ),
        }),

        mcq({
          prompt: B(
            'Awareness (the cursor positions and user colours you see in a collaborative editor) is transported alongside the CRDT. Which description is right?',
            'Awareness (vị trí con trỏ và màu của từng người bạn thấy trong trình soạn thảo cộng tác) được chở song song với CRDT. Mô tả nào ĐÚNG?',
          ),
          options: [
            B('It is merged like the text, but with a last-write-wins rule per field', 'Nó được hợp nhất như phần chữ, nhưng theo quy tắc ghi-sau-thắng cho từng trường'),
            B('It is part of the CRDT, so cursor history is replayable from the document state', 'Nó là một phần của CRDT, nên lịch sử con trỏ phát lại được từ trạng thái tài liệu'),
            B('It is persisted with the document so a returning user sees where everyone was', 'Nó được lưu cùng tài liệu để người quay lại thấy mọi người đã ở đâu'),
            B('It is ephemeral: broadcast only, never merged, never persisted — the presence pattern of chapter 4 in another costume', 'Nó phù du: chỉ broadcast, không hợp nhất, không lưu — chính là lối presence của chương 4 khoác bộ áo khác'),
          ],
          correct: 3,
          explanation: EX(
            'Awareness answers "who is here right now and where is their cursor", and the correct answer changes the instant somebody closes the tab, so merging it or storing it would only preserve stale facts. It is exactly the shape of presence: high frequency, low value per message, worthless once it is a second old. Notice the consequence for cost — the same throttling argument from the typing indicator applies, and for the same reason.',
            'Awareness trả lời câu hỏi "ai đang ở đây ngay lúc này và con trỏ của họ ở đâu", mà câu trả lời đúng thay đổi ngay khoảnh khắc có người đóng tab, nên hợp nhất hay lưu trữ nó chỉ giữ lại những sự thật đã cũ. Nó đúng hình dạng của presence: tần suất cao, giá trị mỗi thông điệp thấp, hết giá trị ngay khi già đi một giây. Chú ý hệ quả về chi phí — lập luận tiết chế của chỉ báo đang gõ áp dụng y nguyên, và vì cùng một lý do.',
          ),
        }),

        mcq({
          prompt: B(
            'A client connects to a Yjs document and sends SyncStep1. What does SyncStep1 carry, and why is the FIRST load the expensive one?',
            'Một client kết nối tới một tài liệu Yjs và gửi SyncStep1. SyncStep1 chở cái gì, và vì sao lần nạp ĐẦU TIÊN mới là lần tốn kém?',
          ),
          options: [
            B('The full document, so the server can diff it — the first load is expensive because the client uploads everything', 'Toàn bộ tài liệu để máy chủ so sai khác — lần đầu tốn vì client tải lên tất cả'),
            B('The list of characters the client wants, so the server can page the document in', 'Danh sách ký tự client muốn, để máy chủ phân trang tài liệu gửi dần'),
            B('An auth token only; the document is pushed by the server on a timer afterwards', 'Chỉ một token xác thực; tài liệu được máy chủ đẩy xuống theo bộ đếm giờ sau đó'),
            B('A state vector saying how far the client has seen per author; the server then answers with everything it is missing', 'Một vector trạng thái nói client đã thấy tới đâu theo từng tác giả; máy chủ sau đó gửi về mọi thứ nó còn thiếu'),
          ],
          correct: 3,
          explanation: EX(
            'The first message is tiny — a compact summary of "I have seen up to clock X from each author" — and the reply is the whole gap, which on a fresh client is the entire document plus its CRDT metadata. After that the connection carries only deltas, and each keystroke is a very small update. That is the shape you should recognise: cheap steady state, one expensive handshake, which is the opposite of a chat protocol and the reason idle collaborative documents are so quiet.',
            'Thông điệp đầu tiên rất nhỏ — một bản tóm tắt gọn của "tôi đã thấy tới nhịp X của từng tác giả" — và câu trả lời là toàn bộ phần còn thiếu, mà với một client mới tinh thì đó là cả tài liệu cộng phần siêu dữ liệu CRDT của nó. Sau đó kết nối chỉ chở phần chênh lệch, và mỗi lần gõ phím là một bản cập nhật rất bé. Đó là hình dạng bạn cần nhận ra: trạng thái thường rẻ, một cú bắt tay đắt, ngược hẳn với giao thức chat và là lý do các tài liệu cộng tác đang rảnh thì rất im ắng.',
          ),
        }),

        mcq({
          prompt: B(
            'Permission for a shared note is re-checked on every incoming update, with the result cached. The repo uses a 5-second TTL. Which comparison is right?',
            'Quyền với một ghi chú được chia sẻ được kiểm lại ở mỗi bản cập nhật đi vào, và kết quả được cache. Kho này dùng TTL 5 giây. So sánh nào ĐÚNG?',
          ),
          options: [
            B('No cache is the only safe choice; any TTL means a revoked user can keep editing', 'Không cache là lựa chọn an toàn duy nhất; mọi TTL đều nghĩa là người bị thu quyền vẫn sửa được'),
            B('A 60-second TTL is strictly better: fewer queries, and the revoke still lands eventually', 'TTL 60 giây tốt hơn hẳn: ít truy vấn hơn, mà việc thu quyền rồi cũng có hiệu lực'),
            B('No cache means one query per update, which drains the connection pool; the TTL bounds how long a revoke lags', 'Không cache nghĩa là một truy vấn mỗi bản cập nhật, làm cạn nguồn kết nối; TTL chặn trên độ trễ của việc thu quyền'),
            B('The TTL is irrelevant because Hocuspocus re-runs <code>onAuthenticate</code> for every message', 'TTL không liên quan vì Hocuspocus chạy lại <code>onAuthenticate</code> cho từng thông điệp'),
          ],
          correct: 2,
          explanation: EX(
            'A busy document produces updates at typing speed, so an uncached check is a database round trip per keystroke per user — the pool goes first, and then everything else that shares it. The TTL turns an unbounded query rate into a bounded one, and the price is written on the label: a revoked collaborator can keep editing for at most that long. Five seconds is a judgement call, not a law; sixty is a long time to keep writing into a document you were removed from. And a revoke should not rely on the TTL at all — delete the key and close the connections explicitly.',
            'Một tài liệu đang bận sinh ra bản cập nhật với tốc độ gõ phím, nên phép kiểm không cache là một lượt đi về cơ sở dữ liệu cho mỗi phím của mỗi người — nguồn kết nối đi trước, rồi tới mọi thứ khác dùng chung nó. TTL biến một tốc độ truy vấn không chặn thành có chặn, và cái giá ghi ngay trên nhãn: một cộng tác viên bị thu quyền còn sửa được tối đa chừng ấy. Năm giây là một phán đoán chứ không phải định luật; sáu mươi giây là khoảng thời gian dài để tiếp tục viết vào một tài liệu bạn đã bị gỡ khỏi. Và việc thu quyền không nên trông cậy vào TTL chút nào — hãy xoá khoá và đóng kết nối một cách tường minh.',
          ),
        }),

        mcq({
          prompt: B(
            'A developer persists the document synchronously inside the <code>onChange</code> handler:' + code(
              'async onChange({ documentName, document }) {\n' +
              '  await prisma.note.update({ /* ... */ });\n' +
              '}',
            ) + 'What is wrong with it?',
            'Một lập trình viên lưu tài liệu một cách đồng bộ ngay trong handler <code>onChange</code>:' + code(
              'async onChange({ documentName, document }) {\n' +
              '  await prisma.note.update({ /* ... */ });\n' +
              '}',
            ) + 'Sai ở chỗ nào?',
          ),
          options: [
            B('<code>onChange</code> is on the hot path of every keystroke, so a database write stalls the sync for everyone in the document', '<code>onChange</code> nằm trên đường găng của từng phím gõ, nên một lệnh ghi cơ sở dữ liệu làm nghẽn việc đồng bộ cho mọi người trong tài liệu'),
            B('<code>onChange</code> may not be async; the handler must be synchronous or Hocuspocus drops the update', '<code>onChange</code> không được là async; handler phải đồng bộ nếu không Hocuspocus sẽ bỏ bản cập nhật'),
            B('The <code>document</code> argument is not safe to read there — it is only complete in <code>onStoreDocument</code>', 'Tham số <code>document</code> ở đó đọc không an toàn — nó chỉ đầy đủ trong <code>onStoreDocument</code>'),
            B('Nothing is wrong: awaiting the write is what guarantees no keystroke is lost', 'Không sai gì: chờ lệnh ghi xong chính là thứ bảo đảm không mất phím nào'),
          ],
          correct: 0,
          explanation: EX(
            'Every update passes through this handler, so the cost of one database write is paid on every character somebody types, and while that write is in flight the sync loop is not moving. The fix is the standard one: put the persist on a debounced queue and return immediately, so the write happens once after the typing stops rather than once per keystroke, plus a final save when the last collaborator leaves. Note the trade you are accepting — a crash loses at most the debounce window.',
            'Mọi bản cập nhật đều đi qua handler này, nên cái giá của một lệnh ghi cơ sở dữ liệu phải trả cho từng ký tự có người gõ ra, và trong lúc lệnh ghi đó đang bay thì vòng đồng bộ đứng yên. Cách sửa là lối quen thuộc: đẩy việc lưu vào một hàng đợi có debounce rồi trả về ngay, để lệnh ghi xảy ra một lần sau khi ngừng gõ chứ không phải một lần mỗi phím, cộng thêm một lần lưu cuối khi cộng tác viên cuối cùng rời đi. Chú ý cái bạn đang đánh đổi — một cú sập làm mất nhiều nhất là khoảng debounce.',
          ),
        }),

        mcq({
          prompt: B(
            'The Yjs state is stored as bytes, and a separate HTML snapshot is stored so the note is searchable in SQL. What is the honest downside of the snapshot?',
            'Trạng thái Yjs được lưu dạng byte, và một bản chụp HTML riêng được lưu để ghi chú tìm kiếm được bằng SQL. Nhược điểm trung thực của bản chụp đó là gì?',
          ),
          options: [
            B('It doubles the storage, which is why most teams drop full-text search on collaborative documents', 'Nó nhân đôi dung lượng lưu trữ, nên phần lớn các nhóm bỏ hẳn tìm kiếm toàn văn trên tài liệu cộng tác'),
            B('It cannot represent formatting, so search results lose their context', 'Nó không biểu diễn được định dạng, nên kết quả tìm kiếm mất ngữ cảnh'),
            B('It is written on the same debounce as the state, so the search index lags the document by that window', 'Nó được ghi theo cùng nhịp debounce với phần trạng thái, nên chỉ mục tìm kiếm chậm hơn tài liệu đúng bằng khoảng đó'),
            B('Regenerating it requires loading the CRDT, so it can only be produced offline in a batch job', 'Tái tạo nó đòi phải nạp CRDT, nên chỉ sinh được ngoại tuyến bằng một job chạy theo lô'),
          ],
          correct: 2,
          explanation: EX(
            'You cannot search the CRDT bytes with SQL, so the snapshot exists — but it is produced by the same debounced save, which means text a user typed a moment ago is not findable yet. For notes that is a perfectly reasonable trade and you should say so out loud in the product; for anything where "I saved it and it is not there" is a support ticket, it is not. Storage is not the issue, formatting survives in the HTML, and the snapshot is generated in the same process that already holds the document.',
            'Bạn không tìm kiếm được các byte CRDT bằng SQL nên mới cần bản chụp — nhưng nó được sinh ra bởi đúng cái lượt lưu có debounce ấy, nghĩa là đoạn chữ người dùng vừa gõ lúc nãy thì chưa tìm ra được. Với ghi chú thì đó là một đánh đổi hoàn toàn hợp lý và bạn nên nói rõ điều đó trong sản phẩm; với bất cứ thứ gì mà "tôi lưu rồi mà không thấy" là một phiếu hỗ trợ thì không. Dung lượng không phải vấn đề, định dạng vẫn còn trong HTML, và bản chụp được sinh ngay trong tiến trình vốn đang giữ tài liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO reasons the notes feature uses Yjs over a plain WebSocket instead of putting the same events through socket.io.',
            'Chọn HAI lý do tính năng ghi chú dùng Yjs trên một WebSocket riêng thay vì đẩy cùng những sự kiện đó qua socket.io.',
          ),
          options: [
            B('CRDT updates commute, so the ordering and acknowledgement machinery socket.io offers buys nothing here', 'Bản cập nhật CRDT giao hoán được, nên bộ máy thứ tự và acknowledgement của socket.io chẳng mang lại gì ở đây'),
            B('socket.io cannot carry binary payloads, so the Uint8Array updates would have to be base64-encoded', 'socket.io không chở được payload binary, nên các bản cập nhật Uint8Array sẽ phải mã hoá base64'),
            B('Hocuspocus already implements auth, awareness, persistence and cross-worker sync for this exact problem', 'Hocuspocus đã hiện thực sẵn xác thực, awareness, lưu trữ và đồng bộ giữa worker cho đúng bài toán này'),
            B('A namespace cannot be used for documents, so rooms would have to be created dynamically', 'Không thể dùng namespace cho tài liệu, nên sẽ phải tạo room động'),
          ],
          correct: [0, 2],
          explanation: EX(
            'The argument is not that socket.io is bad, it is that its main features are dead weight for this workload: you do not need a total order over operations that already commute, and you do not need acks over a protocol whose state vector reconciles gaps on its own. Meanwhile a mature server for exactly this exists. socket.io does carry binary natively — that was measured in chapter 2 — and rooms would have been a perfectly fine way to model documents.',
            'Lập luận ở đây không phải socket.io dở, mà là những tính năng chính của nó thành gánh nặng vô ích với loại tải này: bạn không cần một thứ tự toàn phần trên những thao tác vốn đã giao hoán, và bạn không cần ack trên một giao thức mà bản thân vector trạng thái đã tự khớp lại chỗ thiếu. Trong khi đó đã có sẵn một máy chủ chín muồi làm đúng việc ấy. socket.io CÓ chở binary nguyên bản — điều đó đã đo ở chương 2 — và room hoàn toàn là cách mô hình hoá tài liệu chấp nhận được.',
          ),
        }),

        // ── Chương 9 — WebSocket thuần ──────────────────────────────────
        mcq({
          prompt: B(
            'The raw-WebSocket device gateway is twice the size of the socket.io messaging gateway. Which item is NOT one of the things it had to reimplement?',
            'Gateway thiết bị dùng WebSocket thuần lớn gấp đôi gateway nhắn tin dùng socket.io. Mục nào KHÔNG nằm trong những thứ nó phải viết lại?',
          ),
          options: [
            B('Reconnection with backoff on the client side', 'Việc nối lại kèm backoff ở phía client'),
            B('Heartbeat and dead-peer timeout', 'Nhịp tim và hạn phát hiện peer đã chết'),
            B('TLS termination and certificate renewal', 'Kết thúc TLS và gia hạn chứng chỉ'),
            B('Room-style fan-out to many dashboards', 'Việc toả gói kiểu room tới nhiều bảng điều khiển'),
          ],
          correct: 2,
          explanation: EX(
            'TLS is handled at the proxy, exactly as it is for socket.io — dropping the library does not push certificates into your application. Everything else on the list is real work you inherit: reconnect logic with backoff, a heartbeat plus a timeout to notice a peer that vanished, message framing, an auth handshake, and a fan-out mechanism, because a raw socket has no concept of a room. That is what the line-count difference buys, and the point of the chapter is that the trade is only worth it when the client physically cannot run the library.',
            'TLS được xử lý ở proxy, y hệt như với socket.io — bỏ thư viện đi không đẩy chứng chỉ vào trong ứng dụng của bạn. Mọi thứ còn lại trong danh sách đều là việc thật bạn phải gánh: logic nối lại kèm backoff, một nhịp tim cộng một hạn để nhận ra peer đã biến mất, việc đóng khung thông điệp, một cú bắt tay xác thực, và một cơ chế toả gói, vì socket thuần không có khái niệm room. Đó là thứ mà chênh lệch số dòng mã mua về, và ý của chương này là đánh đổi ấy chỉ đáng khi client về mặt vật lý không chạy nổi thư viện.',
          ),
        }),

        mcq({
          prompt: B(
            'A firmware backoff loop resets its delay to the initial value. When should the reset happen?',
            'Một vòng backoff trong firmware đặt lại độ trễ về giá trị ban đầu. Việc đặt lại nên xảy ra khi nào?',
          ),
          options: [
            B('Never — a device that has failed once should stay at the maximum delay for the rest of its uptime', 'Không bao giờ — một thiết bị đã hỏng một lần thì nên giữ độ trễ tối đa suốt thời gian còn chạy'),
            B('On every attempt, successful or not, so the device always retries quickly', 'Ở mỗi lần thử, thành công hay không, để thiết bị luôn thử lại nhanh'),
            B('When the delay reaches the cap, to start the ramp over from the bottom', 'Khi độ trễ chạm trần, để bắt đầu leo lại từ dưới'),
            B('When the connection has been established AND has stayed up, not merely when an attempt succeeded', 'Khi kết nối đã thiết lập VÀ đã đứng vững, chứ không phải chỉ vì một lần thử đã thành công'),
          ],
          correct: 3,
          explanation: EX(
            'The failure mode this rule prevents is a server that accepts the TCP connection and then dies a moment later, either because it is overloaded or because it is crash-looping. If you reset on "connected", every device is back to a one-second retry immediately and you have rebuilt the stampede that backoff existed to stop. Requiring the connection to survive for a while before resetting keeps the pressure off a server that is not actually healthy yet.',
            'Hỏng hóc mà quy tắc này ngăn được là một máy chủ chấp nhận kết nối TCP rồi chết ngay sau đó, hoặc vì quá tải hoặc vì đang lặp vòng sập-khởi-động. Nếu bạn đặt lại ngay khi "đã kết nối" thì mọi thiết bị lập tức quay về mức thử lại một giây và bạn vừa dựng lại đúng cơn giẫm đạp mà backoff sinh ra để chặn. Đòi kết nối phải sống được một lúc rồi mới đặt lại sẽ giữ áp lực khỏi đè lên một máy chủ thật ra chưa khoẻ.',
          ),
        }),

        mcq({
          prompt: B(
            'A thousand devices lose power and reboot together. Their firmware already has exponential backoff with a 30-second cap, but no jitter. What still goes wrong?',
            'Một nghìn thiết bị cùng mất điện rồi khởi động lại cùng lúc. Firmware của chúng đã có backoff hàm mũ với trần 30 giây, nhưng không có nhiễu ngẫu nhiên. Vẫn hỏng ở chỗ nào?',
          ),
          options: [
            B('Nothing: the cap already spreads the load, since devices reach it at different times', 'Không hỏng gì: cái trần đã dàn tải rồi, vì các thiết bị chạm trần vào những lúc khác nhau'),
            B('They stay synchronised: all thousand wait the same delay and arrive together at every step of the ramp', 'Chúng vẫn đồng pha: cả nghìn cái chờ cùng một khoảng và cùng ập tới ở mọi bậc của thang'),
            B('The cap is too low; with 1000 devices it needs to be several minutes', 'Trần quá thấp; với 1000 thiết bị nó cần tới vài phút'),
            B('Exponential backoff is the wrong shape here; a constant five-second delay would spread them out', 'Backoff hàm mũ sai hình dạng ở đây; một khoảng cố định năm giây sẽ dàn chúng ra'),
          ],
          correct: 1,
          explanation: EX(
            'Backoff without randomness is a metronome that every device shares, because they all started their clock at the same instant. So the server gets a thousand handshakes at t=1s, then a thousand at t=3s, then at t=7s, and each wave can knock it over again — the ramp changes when the spikes arrive, not whether they are spikes. Randomising each delay by some percentage turns each spike into a spread, and it is a couple of lines. A constant delay is worse, not better: it locks the herd into a permanent rhythm.',
            'Backoff không có ngẫu nhiên là một cái máy đập nhịp mà mọi thiết bị dùng chung, vì chúng cùng bấm giờ ở đúng một khoảnh khắc. Nên máy chủ nhận một nghìn cú bắt tay ở t=1s, rồi một nghìn ở t=3s, rồi ở t=7s, và mỗi đợt sóng lại có thể quật ngã nó lần nữa — cái thang chỉ đổi thời điểm các đỉnh ập tới, chứ không làm chúng thôi là đỉnh. Rắc ngẫu nhiên một tỷ lệ phần trăm vào mỗi khoảng chờ sẽ biến mỗi đỉnh thành một vệt dàn đều, và đó là vài dòng mã. Một khoảng cố định còn tệ hơn: nó khoá cả bầy vào một nhịp vĩnh viễn.',
          ),
        }),

        mcq({
          prompt: B(
            'A telemetry device is switched from JSON to a packed binary frame. What is the real cost of the change?',
            'Một thiết bị đo được chuyển từ JSON sang khung nhị phân nén chặt. Cái giá thật của thay đổi đó là gì?',
          ),
          options: [
            B('Nothing measurable: binary is smaller and faster to parse on both sides', 'Không có gì đáng kể: nhị phân vừa nhỏ hơn vừa phân tích nhanh hơn ở cả hai phía'),
            B('Binary cannot travel over WebSocket without base64, so the saving disappears', 'Nhị phân không đi được qua WebSocket nếu không base64, nên phần tiết kiệm biến mất'),
            B('You lose readability, so every wire capture now needs the decoder — and the layout becomes an undocumented contract between two codebases', 'Bạn mất tính đọc được, nên mọi bản bắt gói giờ cần bộ giải mã — và bố cục byte thành một hợp đồng không giấy tờ giữa hai kho mã'),
            B('The server must now run a schema registry, which is a new service to operate', 'Máy chủ giờ phải chạy một sổ đăng ký schema, tức thêm một dịch vụ phải vận hành'),
          ],
          correct: 2,
          explanation: EX(
            'The bytes and the parse time really do drop, and for a device sending something every second the daily volume difference is substantial. What you pay is diagnosability: a JSON frame in a capture explains itself, a run of hex does not, and the meaning of byte 4 now lives in two places that can drift apart with no compiler to notice. That is why the sensible rule is a threshold rather than a preference — stay with JSON while the volume is small, and move only when the numbers say so. WebSocket carries binary frames natively, and a hand-packed layout needs no registry, only discipline.',
            'Số byte và thời gian phân tích giảm thật, và với một thiết bị gửi gì đó mỗi giây thì chênh lệch khối lượng mỗi ngày là đáng kể. Thứ bạn trả là khả năng chẩn đoán: một khung JSON trong bản bắt gói tự nó giải thích được, còn một dãy hex thì không, và ý nghĩa của byte thứ 4 giờ sống ở hai nơi có thể trôi xa nhau mà không trình biên dịch nào phát hiện. Vì thế quy tắc hợp lý là một NGƯỠNG chứ không phải một sở thích — cứ JSON khi khối lượng còn nhỏ, và chỉ chuyển khi các con số bảo thế. WebSocket chở khung nhị phân nguyên bản, và một bố cục tự đóng gói không cần sổ đăng ký nào, chỉ cần kỷ luật.',
          ),
        }),

        mcq({
          prompt: B(
            'The bridge forwards device telemetry into socket.io with <code>io.to(`device:${deviceId}`).emit("device:telemetry", …)</code>, and dashboards subscribe with <code>maker:device:join</code>. Choose TWO checks that must exist.',
            'Cầu nối chuyển tiếp dữ liệu đo của thiết bị vào socket.io bằng <code>io.to(`device:${deviceId}`).emit("device:telemetry", …)</code>, và bảng điều khiển đăng ký bằng <code>maker:device:join</code>. Chọn HAI phép kiểm bắt buộc phải có.',
          ),
          options: [
            B('The raw socket must prove it IS that device before its readings are trusted', 'Socket thuần phải chứng minh nó ĐÚNG LÀ thiết bị đó trước khi số liệu của nó được tin'),
            B('The dashboard must be authorised for that device before <code>socket.join</code> runs', 'Bảng điều khiển phải được cấp quyền với thiết bị đó trước khi <code>socket.join</code> chạy'),
            B('The telemetry must be acknowledged, or the reading is lost and the chart has a gap', 'Dữ liệu đo phải được ack, không thì số liệu mất và biểu đồ có lỗ hổng'),
            B('The device room must be created explicitly before the first dashboard joins it', 'Room của thiết bị phải được tạo tường minh trước khi bảng điều khiển đầu tiên join vào'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Both ends are attacker-controlled inputs. Without the first check, anyone who learns a device id can open a socket and publish invented readings into somebody else\'s dashboard. Without the second, any logged-in user can join <code>device:&lt;any id&gt;</code> and watch a stranger\'s sensors — the room name is guessable by construction. Acks are the wrong tool for a stream where the next sample is a second away, and rooms are created on first join, never declared.',
            'Cả hai đầu đều là đầu vào do kẻ tấn công điều khiển được. Thiếu phép kiểm thứ nhất, ai biết được một mã thiết bị đều có thể mở một socket và bơm số liệu bịa vào bảng điều khiển của người khác. Thiếu phép kiểm thứ hai, bất kỳ người dùng đã đăng nhập nào cũng join được <code>device:&lt;id bất kỳ&gt;</code> và ngồi xem cảm biến của người lạ — tên room vốn đoán được theo cấu tạo. Ack là công cụ sai cho một dòng dữ liệu mà mẫu kế tiếp chỉ cách một giây, còn room thì được tạo ở lần join đầu tiên chứ không bao giờ phải khai báo.',
          ),
        }),

        mcq({
          prompt: B(
            'A firmware author must choose between a WebSocket-native ping frame and an application-level <code>{"type":"ping"}</code> message. What is the honest comparison?',
            'Người viết firmware phải chọn giữa khung ping nguyên bản của WebSocket và một thông điệp cấp ứng dụng <code>{"type":"ping"}</code>. So sánh trung thực là gì?',
          ),
          options: [
            B('The JSON one is cheaper because it reuses the text frame the device is already sending', 'Cái JSON rẻ hơn vì nó tái dùng khung text mà thiết bị vốn đã gửi'),
            B('The native frame is not supported by most browsers, so the JSON one is the only portable choice', 'Khung nguyên bản phần lớn trình duyệt không hỗ trợ, nên cái JSON là lựa chọn khả chuyển duy nhất'),
            B('They are identical on the wire; the difference is only in which library method you call', 'Chúng giống hệt nhau trên dây; khác biệt chỉ là bạn gọi phương thức nào của thư viện'),
            B('The native frame is cheaper and is handled by the library; the JSON one is visible to your own code and to any log you already have', 'Khung nguyên bản rẻ hơn và do thư viện lo; cái JSON thì mã của chính bạn nhìn thấy được, và mọi bản log bạn đã có cũng vậy'),
          ],
          correct: 3,
          explanation: EX(
            'A control frame is a couple of bytes and the library answers it for you, which is why it is the default choice for keeping a connection alive through an idle-timeout. An application ping costs a real message but it shows up in your own handler, so you can log it, count it, and attach a sequence number — that is genuinely useful when you are trying to prove which side stopped talking. Running both is a defensible choice; picking the JSON one on the theory that proxies strip control frames is not, because a proxy that terminates the WebSocket is closing the idle connection, not filtering pings out of it.',
            'Một khung điều khiển chỉ vài byte và thư viện tự trả lời thay bạn, nên nó là lựa chọn mặc định để giữ kết nối sống qua một hạn nhàn rỗi. Một cú ping cấp ứng dụng tốn một thông điệp thật nhưng nó hiện ra trong handler của chính bạn, nên bạn ghi log được, đếm được và gắn số thứ tự được — điều đó thực sự có ích khi bạn đang cố chứng minh phía nào đã ngừng nói. Chạy cả hai là một lựa chọn có lý; chọn cái JSON vì tin rằng proxy cắt khung điều khiển thì không, vì một proxy có kết thúc WebSocket là nó đang đóng kết nối nhàn rỗi chứ không phải lọc ping ra khỏi nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A gateway rejects a malformed payload with <code>ws.close(1002, "invalid JSON")</code>. Is 1002 the right close code?',
            'Một gateway từ chối payload hỏng bằng <code>ws.close(1002, "invalid JSON")</code>. 1002 có phải mã đóng đúng không?',
          ),
          options: [
            B('Yes — any content the server refuses to process is a protocol error by definition', 'Đúng — mọi nội dung máy chủ từ chối xử lý đều là lỗi giao thức theo định nghĩa'),
            B('No — 1002 means the WebSocket framing itself was broken; bad JSON inside a valid text frame is 1007 or 1003', 'Không — 1002 nghĩa là bản thân việc đóng khung WebSocket bị hỏng; JSON hỏng bên trong một khung text hợp lệ là 1007 hoặc 1003'),
            B('No — a server may only send 1000 or 1001; the 1002-1015 range is reserved for the client', 'Không — máy chủ chỉ được gửi 1000 hoặc 1001; dải 1002-1015 dành riêng cho client'),
            B('It does not matter: close codes are advisory and no client library exposes them', 'Không quan trọng: mã đóng chỉ mang tính tham khảo và không thư viện client nào phơi chúng ra'),
          ],
          correct: 1,
          explanation: EX(
            'The frame arrived perfectly well formed — correct opcode, correct length, valid UTF-8 — and only its CONTENT was unacceptable, which is what 1007 (invalid frame payload data) and 1003 (unsupported data) are for. 1002 tells the peer that the transport-level conversation broke, which sends a firmware author looking in the wrong place. Close codes matter precisely because they are the only diagnostic a device leaves behind, and both sides can send any of them.',
            'Khung tin tới nơi hoàn toàn đúng dạng — đúng mã thao tác, đúng độ dài, UTF-8 hợp lệ — và chỉ NỘI DUNG của nó là không chấp nhận được, đó chính là chỗ dùng của 1007 (dữ liệu payload không hợp lệ) và 1003 (dữ liệu không hỗ trợ). 1002 nói với phía kia rằng cuộc trò chuyện ở tầng giao vận đã đứt, và điều đó khiến người viết firmware đi tìm nhầm chỗ. Mã đóng quan trọng chính vì nó là dấu vết chẩn đoán duy nhất một thiết bị để lại, và cả hai phía đều gửi được bất kỳ mã nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A water meter reports one reading every five minutes and the dashboard is refreshed by hand. Which transport is the right choice?',
            'Một đồng hồ nước báo một số đọc mỗi năm phút và bảng điều khiển được làm mới bằng tay. Transport nào là lựa chọn đúng?',
          ),
          options: [
            B('A raw WebSocket, so the reading arrives the instant it is taken', 'Một WebSocket thuần, để số đọc tới ngay khoảnh khắc nó được lấy'),
            B('socket.io with <code>volatile.emit</code>, since a missed reading does not matter', 'socket.io với <code>volatile.emit</code>, vì lỡ một số đọc cũng không sao'),
            B('An HTTP POST every five minutes: no connection to keep alive, no reconnect logic, no heartbeat', 'Một lệnh HTTP POST mỗi năm phút: không có kết nối phải giữ sống, không logic nối lại, không nhịp tim'),
            B('Server-Sent Events, which is the standard answer for low-frequency device telemetry', 'Server-Sent Events, vốn là câu trả lời chuẩn cho dữ liệu đo tần suất thấp của thiết bị'),
          ],
          correct: 2,
          explanation: EX(
            'Nothing about this problem needs a live connection. A persistent socket for a message every five minutes means paying for reconnect logic, a heartbeat, and a proxy timeout you now have to think about, in exchange for latency nobody will observe on a manually refreshed page. The whole raw-WebSocket chapter is about a case where you have no choice; this is the opposite case, and recognising it is worth more than knowing the API. SSE is a server-to-client push channel, which is the wrong direction here.',
            'Không có gì trong bài toán này cần một kết nối sống. Giữ một socket bền cho một thông điệp mỗi năm phút nghĩa là trả tiền cho logic nối lại, một nhịp tim, và một hạn nhàn rỗi của proxy mà giờ bạn phải bận tâm, đổi lại một độ trễ mà không ai quan sát được trên một trang phải bấm làm mới bằng tay. Cả chương WebSocket thuần nói về trường hợp bạn không có lựa chọn; đây là trường hợp ngược lại, và nhận ra nó đáng giá hơn việc thuộc API. SSE là kênh đẩy từ máy chủ xuống client, tức sai chiều ở đây.',
          ),
        }),

        // ── Chương 10 — Sách công thức chẩn đoán ────────────────────────
        mcq({
          prompt: B(
            'A report says "some events arrive and some do not, and it looks random". Where does the cookbook start, and what is the leading suspect?',
            'Một báo cáo nói "có sự kiện tới, có sự kiện không, và trông như ngẫu nhiên". Sách công thức bắt đầu từ đâu, và nghi phạm hàng đầu là ai?',
          ),
          options: [
            B('Q3 — the handler; the suspect is a typo in one of the event names', 'Q3 — handler; nghi phạm là một chỗ gõ nhầm trong một tên sự kiện'),
            B('Q1 — the connection; the suspect is an auth middleware that rejects some tokens', 'Q1 — kết nối; nghi phạm là middleware xác thực từ chối một số token'),
            B('Q2 — is the event on the wire at all; the suspects are a missing adapter or a wrong room', 'Q2 — sự kiện có lên dây hay không; nghi phạm là thiếu adapter hoặc sai tên room'),
            B('Q4 — the side effect; the suspect is a database write that silently failed', 'Q4 — hệ quả phụ; nghi phạm là một lệnh ghi cơ sở dữ liệu hỏng âm thầm'),
          ],
          correct: 2,
          explanation: EX(
            'The symptom already tells you the connection is alive, so Q1 is answered — some events DO arrive. The question is whether the missing ones ever left the server, and that is exactly what looking at the frames answers, splitting the search space in half in one step. "Random" is also a strong hint by itself: a partial, unpredictable slice of recipients is the fingerprint of a cluster with no adapter, where delivery depends on which worker the sender happened to be on.',
            'Bản thân triệu chứng đã cho biết kết nối còn sống, nên Q1 đã có lời giải — CÓ những sự kiện tới nơi. Câu hỏi là những cái thiếu có bao giờ rời khỏi máy chủ không, và nhìn vào các frame trả lời đúng chỗ đó, cắt đôi không gian tìm kiếm chỉ trong một bước. Chữ "ngẫu nhiên" tự nó cũng là một manh mối mạnh: một lát cắt người nhận không đoán được là dấu vân tay của một cụm thiếu adapter, nơi việc giao hàng phụ thuộc vào việc người gửi tình cờ nằm ở worker nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A support tool decides whether a user is online by reading <code>socket.connected</code> on the client and reporting it. Why is that unreliable?',
            'Một công cụ hỗ trợ quyết định một người dùng có online hay không bằng cách đọc <code>socket.connected</code> ở phía client rồi báo về. Vì sao cách đó không đáng tin?',
          ),
          options: [
            B('It reflects the client\'s own belief, which stays <code>true</code> after a silent network loss until the heartbeat expires', 'Nó phản ánh niềm tin của chính client, vốn giữ <code>true</code> sau một cú mất mạng âm thầm cho tới khi nhịp tim hết hạn'),
            B('It is <code>undefined</code> until the first event is received, so early reads are meaningless', 'Nó là <code>undefined</code> cho tới khi nhận được sự kiện đầu tiên, nên đọc sớm thì vô nghĩa'),
            B('It counts all tabs, so a user with three tabs reports as three separate connections', 'Nó đếm tất cả các tab, nên một người dùng ba tab báo về thành ba kết nối riêng'),
            B('It is only maintained on the server; the client copy is always <code>false</code> outside a handler', 'Nó chỉ được duy trì ở máy chủ; bản sao phía client luôn là <code>false</code> khi ở ngoài handler'),
          ],
          correct: 0,
          explanation: EX(
            'When a laptop lid closes or a train enters a tunnel there is no FIN packet, so nothing tells the client anything is wrong — it keeps reporting a healthy connection until the ping cycle runs out, which is <code>pingInterval + pingTimeout</code> later. That can be tens of seconds of confidently wrong answers. For presence, trust the server\'s view, and let the heartbeat be the thing that defines "gone"; treat the client flag as a local hint for deciding whether to grey out a send button.',
            'Khi nắp laptop đóng lại hay một chuyến tàu chui vào hầm thì không có gói FIN nào cả, nên không gì báo cho client biết có chuyện gì — nó cứ báo một kết nối khoẻ mạnh cho tới khi chu kỳ ping cạn, tức là <code>pingInterval + pingTimeout</code> sau đó. Đó có thể là hàng chục giây trả lời sai một cách đầy tự tin. Với presence, hãy tin cách nhìn của máy chủ, và để nhịp tim là thứ định nghĩa "đã mất"; còn cờ ở phía client thì coi như một gợi ý cục bộ để quyết định có làm mờ nút gửi hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'In the Network tab the socket.io request shows one of these. Match the status to the cause.',
            'Trong tab Network, request của socket.io hiện ra một trong các trạng thái sau. Hãy ghép trạng thái với nguyên nhân.',
          ),
          options: [
            B('<code>404</code> = auth rejected · <code>403</code> = nginx not routing <code>/socket.io/</code> · <code>101</code> = still polling', '<code>404</code> = xác thực từ chối · <code>403</code> = nginx chưa định tuyến <code>/socket.io/</code> · <code>101</code> = vẫn đang polling'),
            B('<code>404</code> = nginx is not routing <code>/socket.io/</code> · <code>403</code> = auth rejected · <code>101</code> = the WebSocket upgrade succeeded', '<code>404</code> = nginx chưa định tuyến <code>/socket.io/</code> · <code>403</code> = xác thực từ chối · <code>101</code> = nâng cấp WebSocket đã thành công'),
            B('All three mean the same thing; only the response body distinguishes them', 'Cả ba đều cùng một nghĩa; chỉ thân phản hồi mới phân biệt được'),
            B('<code>404</code> = the namespace does not exist · <code>403</code> = the room does not exist · <code>101</code> = the handshake is pending', '<code>404</code> = namespace không tồn tại · <code>403</code> = room không tồn tại · <code>101</code> = cú bắt tay đang chờ'),
          ],
          correct: 1,
          explanation: EX(
            'These three answers point at three different teams. A 404 means the request never reached your application at all, so the problem is the proxy configuration. A 403 means it did reach it and was turned away, so look at the token. A green 101 means the upgrade completed and you should stop looking at the connection and move to Q2. Note what a 200 with a long <code>text/plain</code> body means instead: you are connected but still on polling, which is fine unless you expected otherwise. Namespaces and rooms are layer-3 ideas and never produce an HTTP status.',
            'Ba câu trả lời này chỉ vào ba nhóm người khác nhau. 404 nghĩa là request chưa từng tới được ứng dụng của bạn, nên vấn đề nằm ở cấu hình proxy. 403 nghĩa là nó có tới và bị đuổi về, nên hãy xem lại token. Một cú 101 màu xanh nghĩa là nâng cấp đã hoàn tất và bạn nên thôi nhìn vào kết nối mà chuyển sang Q2. Chú ý một cú 200 với thân <code>text/plain</code> dài lại có nghĩa khác: bạn đã kết nối nhưng vẫn đang ở polling, điều đó ổn trừ khi bạn mong đợi khác đi. Namespace và room là khái niệm tầng 3 và không bao giờ sinh ra một mã trạng thái HTTP.',
          ),
        }),

        mcq({
          prompt: B(
            'A client logs <code>connect_error</code> and the message is <code>"xhr poll error"</code>. What does that point at, compared with <code>"unauthorized"</code>?',
            'Một client ghi log <code>connect_error</code> và thông điệp là <code>"xhr poll error"</code>. So với <code>"unauthorized"</code>, nó chỉ vào cái gì?',
          ),
          options: [
            B('At a payload larger than <code>maxHttpBufferSize</code> during the handshake', 'Chỉ vào một payload lớn hơn <code>maxHttpBufferSize</code> trong lúc bắt tay'),
            B('At the same thing: both are how socket.io reports a rejected token', 'Chỉ vào cùng một thứ: cả hai đều là cách socket.io báo một token bị từ chối'),
            B('At a namespace that does not exist on the server', 'Chỉ vào một namespace không tồn tại trên máy chủ'),
            B('At CORS or the network — the polling request itself failed, so nothing your middleware did is involved', 'Chỉ vào CORS hoặc mạng — chính request polling đã hỏng, nên chẳng liên quan gì tới việc middleware của bạn làm'),
          ],
          correct: 3,
          explanation: EX(
            'The same event fires for very different failures, which is why the message string is worth branching on. <code>"unauthorized"</code> is your own middleware talking and means log the user out; <code>"xhr poll error"</code> means the HTTP request did not complete at all — a CORS header, a dead backend, a captive portal — and logging the user out for that is the classic overreaction that turns a two-second outage into a support ticket. <code>"timeout"</code> and <code>"websocket error"</code> are the other two you will meet, and an unknown namespace produces <code>"Invalid namespace"</code>.',
            'Cùng một sự kiện nổ ra cho những hỏng hóc rất khác nhau, nên chuỗi thông điệp đáng để rẽ nhánh theo. <code>"unauthorized"</code> là middleware của chính bạn đang nói và nghĩa là hãy đăng xuất người dùng; <code>"xhr poll error"</code> nghĩa là request HTTP không hoàn tất được — một header CORS, một backend chết, một cổng đăng nhập Wi-Fi công cộng — và đăng xuất người dùng vì lý do đó là phản ứng thái quá kinh điển biến một sự cố hai giây thành một phiếu hỗ trợ. <code>"timeout"</code> và <code>"websocket error"</code> là hai cái còn lại bạn sẽ gặp, còn namespace không tồn tại thì sinh ra <code>"Invalid namespace"</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A handler logs "done" every time, the database row is correct, and the recipient still sees nothing. The emit line is:' + code(
              'io.to(`user:${uid}`).emit(\'notify\', payload);',
            ) + 'Which check finds the bug fastest?',
            'Một handler lần nào cũng ghi log "done", bản ghi cơ sở dữ liệu đúng, mà người nhận vẫn không thấy gì. Dòng emit như sau:' + code(
              'io.to(`user:${uid}`).emit(\'notify\', payload);',
            ) + 'Phép kiểm nào tìm ra lỗi nhanh nhất?',
          ),
          options: [
            B('Turn on verbose logging in the client library and re-run the scenario', 'Bật log chi tiết trong thư viện client rồi chạy lại kịch bản'),
            B('Add a retry with an ack, so a lost packet is sent again', 'Thêm một lần thử lại có ack, để gói bị mất được gửi lại'),
            B('Restart the server to clear any stale room membership', 'Khởi động lại máy chủ để xoá mọi thành viên room đã cũ'),
            B('Log the room name and its member count immediately before the emit', 'Ghi log tên room và số thành viên của nó ngay trước lệnh emit'),
          ],
          correct: 3,
          explanation: EX(
            'Two lines of logging answer the question outright, and they catch the specific failure this code invites: if <code>uid</code> is <code>undefined</code> the template literal happily builds the room <code>user:undefined</code>, which exists as a perfectly valid name that nobody has joined. The emit then succeeds, silently, into an empty set — no error, no warning, and a handler that logs "done" with complete honesty. A size of zero tells you instantly whether to look at the room name or at the receiving side.',
            'Hai dòng log trả lời dứt điểm câu hỏi, và chúng bắt đúng cái hỏng hóc mà đoạn mã này mời gọi: nếu <code>uid</code> là <code>undefined</code> thì chuỗi mẫu vui vẻ dựng ra room <code>user:undefined</code>, một cái tên hoàn toàn hợp lệ mà không ai join vào. Lệnh emit sau đó thành công, âm thầm, vào một tập rỗng — không lỗi, không cảnh báo, và một handler ghi "done" với sự trung thực trọn vẹn. Con số không cho bạn biết ngay là nên nhìn vào tên room hay nhìn sang phía nhận.',
          ),
        }),

        mcq({
          prompt: B(
            'Why is a rejected Promise inside <code>socket.on("X", async (data) =&gt; { … })</code> called the number-one bug at Q4?',
            'Vì sao một Promise bị từ chối bên trong <code>socket.on("X", async (data) =&gt; { … })</code> được gọi là lỗi số một ở Q4?',
          ),
          options: [
            B('Because socket.io retries the handler automatically, so the side effect happens twice', 'Vì socket.io tự động chạy lại handler, nên hệ quả phụ xảy ra hai lần'),
            B('Because nothing awaits the handler, so the failure produces no response, no ack and often no visible log', 'Vì không có gì await cái handler đó, nên thất bại không sinh ra phản hồi, không sinh ra ack và thường cũng không có log nào nhìn thấy'),
            B('Because an async handler is not allowed and socket.io ignores its return value', 'Vì handler async không được phép và socket.io bỏ qua giá trị trả về của nó'),
            B('Because the rejection propagates to the client as a <code>connect_error</code>', 'Vì cú từ chối lan tới client dưới dạng một <code>connect_error</code>'),
          ],
          correct: 1,
          explanation: EX(
            'socket.io calls your handler and moves on; it is not awaiting the promise you returned, so a rejection has nowhere to go. The user sees an operation that simply did not happen, the client is still waiting for an ack that will never come, and depending on the Node version and your process settings you get either a warning nobody reads or a crash with a stack that does not mention the event. The discipline is a <code>try/catch</code> around every async handler body, with the catch calling <code>ack</code> with an error so the caller learns something.',
            'socket.io gọi handler của bạn rồi đi tiếp; nó không await cái promise bạn trả về, nên một cú từ chối không có chỗ nào để đi. Người dùng thấy một thao tác đơn giản là đã không xảy ra, client thì vẫn đang chờ một cái ack không bao giờ tới, và tuỳ phiên bản Node cùng cấu hình tiến trình mà bạn nhận được hoặc một cảnh báo không ai đọc hoặc một cú sập với vết ngăn xếp chẳng nhắc gì tới sự kiện đó. Kỷ luật ở đây là bọc <code>try/catch</code> quanh thân mọi handler async, và trong catch thì gọi <code>ack</code> kèm lỗi để phía gọi biết được điều gì đó.',
          ),
        }),

        mcq({
          prompt: B(
            'You run <code>redis-cli PSUBSCRIBE "socket.io#*"</code> while reproducing a cluster bug. Match what you see to the conclusion.',
            'Bạn chạy <code>redis-cli PSUBSCRIBE "socket.io#*"</code> trong lúc tái hiện một lỗi cụm. Ghép điều bạn thấy với kết luận.',
          ),
          options: [
            B('No messages at all = the adapter is not publishing; messages present but the client got nothing = the receiving worker or the room is wrong', 'Không có thông điệp nào = adapter không publish; có thông điệp mà client không nhận gì = sai worker nhận hoặc sai room'),
            B('No messages at all = Redis is healthy and the broadcast went direct; messages present = the adapter is broken', 'Không có thông điệp nào = Redis khoẻ và broadcast đi thẳng; có thông điệp = adapter hỏng'),
            B('The output is unreadable because the adapter encodes with msgpack, so this command is useless', 'Đầu ra không đọc được vì adapter mã hoá bằng msgpack, nên lệnh này vô dụng'),
            B('Messages appear only for <code>io.emit</code>; room broadcasts use a direct socket and never touch Redis', 'Thông điệp chỉ xuất hiện với <code>io.emit</code>; broadcast theo room dùng một socket trực tiếp và không bao giờ chạm tới Redis'),
          ],
          correct: 0,
          explanation: EX(
            'This is the cheapest possible way to cut the problem in half without deploying anything, and the two outcomes point in opposite directions. Silence means the emitting worker never published, so suspect the adapter attachment. Traffic means the fan-out left the sender correctly and the fault is downstream — the wrong room name, or a worker that is not subscribed. The payload is indeed msgpack and looks like noise, but you are reading the CHANNEL names and the presence of traffic, not the bodies.',
            'Đây là cách rẻ nhất có thể để cắt đôi vấn đề mà không phải deploy gì, và hai kết quả chỉ về hai hướng ngược nhau. Im lặng nghĩa là worker phát lệnh chưa từng publish, nên hãy nghi việc gắn adapter. Có lưu lượng nghĩa là phần toả gói đã rời khỏi người gửi đúng cách và lỗi nằm ở phía sau — sai tên room, hoặc một worker không đăng ký nhận. Phần payload đúng là msgpack và trông như nhiễu, nhưng thứ bạn đọc là tên KÊNH và sự có mặt của lưu lượng, không phải nội dung.',
          ),
        }),

        mcq({
          prompt: B(
            'Why do the three classic cluster bugs never appear during local development?',
            'Vì sao ba lỗi cụm kinh điển không bao giờ xuất hiện khi phát triển ở máy cá nhân?',
          ),
          options: [
            B('Because <code>npm run dev</code> runs one process, so there is nothing for a broadcast to cross and no session to lose', 'Vì <code>npm run dev</code> chạy một tiến trình, nên không có gì để một broadcast phải vượt qua và không có phiên nào để mất'),
            B('Because the development build attaches an in-memory adapter that emulates the cluster', 'Vì bản dựng phát triển gắn một adapter trong bộ nhớ để mô phỏng cụm'),
            B('Because localhost has no proxy, and all three bugs are caused by nginx', 'Vì localhost không có proxy, và cả ba lỗi đều do nginx gây ra'),
            B('Because they only appear above a few hundred concurrent users, which is a load issue, not a topology one', 'Vì chúng chỉ xuất hiện khi vượt vài trăm người dùng đồng thời, tức là vấn đề tải chứ không phải hình trạng'),
          ],
          correct: 0,
          explanation: EX(
            'One process is the degenerate case where every one of these problems is structurally impossible: the adapter has nobody to talk to, every polling request lands on the only worker there is, and the in-process presence map genuinely knows about all the sockets. So a codebase can be completely broken for a cluster and pass every local test. The cheap fix is to run two workers behind a tiny proxy locally before you ship, because none of this is about load — a topology bug shows up with two users, if there are two workers.',
            'Một tiến trình là trường hợp suy biến mà mọi vấn đề trong nhóm này đều bất khả thi về mặt cấu trúc: adapter không có ai để nói chuyện, mọi request polling đều rơi vào worker duy nhất đang có, và bản đồ presence trong tiến trình thật sự biết hết mọi socket. Nên một kho mã có thể hỏng hoàn toàn với cụm mà vẫn qua sạch mọi phép kiểm ở máy cá nhân. Cách sửa rẻ tiền là chạy hai worker sau một proxy nhỏ ở máy mình trước khi phát hành, vì chuyện này không liên quan gì tới tải — một lỗi hình trạng lộ ra với hai người dùng, miễn là có hai worker.',
          ),
        }),

        // ── Chương 11 — Cái sống qua đo lường ───────────────────────────
        mcq({
          prompt: B(
            'Chapter 11 sorts every finding into column A (holds in any repo), column B (this repo\'s measurement, re-measure your own) and column C (intuitions that lost). Where does "the audience for a presence update averages 30 people" belong, and why?',
            'Chương 11 xếp mọi phát hiện vào cột A (đúng ở mọi kho), cột B (số đo của kho này, kho bạn phải đo lại) và cột C (trực giác đã thua). "Tập khán giả của một bản cập nhật presence trung bình 30 người" thuộc cột nào, và vì sao?',
          ),
          options: [
            B('Column A, because the fan-out cost of presence is a property of the algorithm', 'Cột A, vì chi phí toả gói của presence là thuộc tính của thuật toán'),
            B('Column B: the number is a fact about this social graph; the rule "send to the audience, not to everyone" is the column-A part', 'Cột B: con số là sự thật về đồ thị xã hội này; quy tắc "gửi tới khán giả, đừng gửi tới tất cả" mới là phần thuộc cột A'),
            B('Column C, because it was later shown to be an over-simplification', 'Cột C, vì sau đó nó được chứng minh là một sự đơn giản hoá quá mức'),
            B('None of them: it is an implementation detail, not a finding', 'Không cột nào: đó là chi tiết hiện thực, không phải một phát hiện'),
          ],
          correct: 1,
          explanation: EX(
            'The discipline the chapter is teaching is to separate the rule from the reading. A different product could have an average audience of five or of three hundred, and the saving you get from targeting changes by an order of magnitude with it — but the reason to target rather than broadcast does not change at all. Getting this split wrong in either direction is how a team either re-derives something that was always true, or ships a decision based on somebody else\'s social graph.',
            'Kỷ luật mà chương này dạy là tách bạch quy tắc với con số đọc được. Một sản phẩm khác có thể có khán giả trung bình năm người hoặc ba trăm người, và phần tiết kiệm bạn thu được từ việc nhắm đích cũng đổi theo cả một bậc độ lớn — nhưng lý do để nhắm đích thay vì broadcast thì không đổi chút nào. Chia sai ranh giới này theo chiều nào cũng dẫn tới việc một nhóm hoặc suy lại từ đầu một thứ vốn luôn đúng, hoặc phát hành một quyết định dựa trên đồ thị xã hội của người khác.',
          ),
        }),

        mcq({
          prompt: B(
            'The course first claimed polling costs "133 times the overhead of WebSocket", then measured it properly. What did the measurement actually change?',
            'Giáo trình ban đầu khẳng định polling tốn "gấp 133 lần WebSocket", rồi sau đó đo lại cho tử tế. Phép đo ấy thật sự đã thay đổi điều gì?',
          ),
          options: [
            B('It showed the overhead is identical, so the choice of transport is purely about proxies', 'Nó cho thấy chi phí phụ trội y hệt nhau, nên chọn transport chỉ là chuyện proxy'),
            B('It reversed the direction: polling turned out to be cheaper for small messages', 'Nó lật ngược chiều: hoá ra polling rẻ hơn với thông điệp nhỏ'),
            B('It confirmed 133 exactly, which is why the number is still quoted', 'Nó xác nhận đúng con số 133, nên con số đó vẫn được trích dẫn'),
            B('It kept the direction but destroyed the single number: the ratio depends on how many messages fit into one poll', 'Nó giữ nguyên chiều nhưng phá bỏ con số duy nhất: tỷ lệ phụ thuộc vào bao nhiêu thông điệp lọt vào một lượt poll'),
          ],
          correct: 3,
          explanation: EX(
            'The original figure came from dividing one header size by one frame size — arithmetic, not observation — and it silently assumed one message per poll, which is the worst case. Measured across a burst, the same messages ride one set of HTTP headers and the per-message overhead collapses. So polling really is heavier, and by how much is a property of your traffic shape rather than a constant. The course keeps the error on purpose, because the lesson is that a number without a measurement attached is a guess wearing a suit.',
            'Con số ban đầu đến từ việc chia một kích thước header cho một kích thước khung — phép tính chứ không phải quan sát — và nó âm thầm giả định một thông điệp mỗi lượt poll, tức trường hợp xấu nhất. Đo trên một chùm thông điệp dồn dập thì cùng ngần ấy thông điệp đi chung một bộ header HTTP và chi phí phụ trội trên mỗi thông điệp sụp xuống. Vậy polling đúng là nặng hơn, còn nặng bao nhiêu thì là thuộc tính của hình dạng lưu lượng nhà bạn chứ không phải một hằng số. Giáo trình cố ý giữ lại lỗi này, vì bài học là một con số không kèm phép đo chỉ là một phỏng đoán mặc com-lê.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague quotes "WebSocket is 40 times lighter than polling" from an internal benchmark to justify turning polling off. What is the strongest objection?',
            'Một đồng nghiệp trích "WebSocket nhẹ hơn polling 40 lần" từ một phép đo nội bộ để biện minh cho việc tắt polling. Phản đối mạnh nhất là gì?',
          ),
          options: [
            B('The ratio came with conditions — message size and poll cadence — and those conditions are not stated, so the number cannot be transferred', 'Tỷ lệ đó đi kèm điều kiện — kích thước thông điệp và nhịp poll — mà các điều kiện ấy không được nêu, nên con số không mang đi chỗ khác được'),
            B('Benchmarks are always wrong, so no measurement should influence an architecture decision', 'Phép đo bao giờ cũng sai, nên không số đo nào được ảnh hưởng tới một quyết định kiến trúc'),
            B('The real figure is 133, so the colleague is understating the case', 'Con số thật là 133, nên đồng nghiệp đó đang nói giảm đi'),
            B('Bandwidth is never the reason to choose a transport; only latency is', 'Băng thông không bao giờ là lý do chọn transport; chỉ độ trễ mới là'),
          ],
          correct: 0,
          explanation: EX(
            'This is the failure mode chapter 11 names explicitly: a column-B reading that lost its footnote becomes a column-C belief. Halve the poll cadence or send four-kilobyte payloads and that ratio moves by an order of magnitude, so the number is only meaningful next to the conditions that produced it. And notice what the argument is not even about — turning polling off is a decision about which users can connect at all, so the bandwidth ratio is the wrong axis regardless of its value.',
            'Đây đúng là kiểu hỏng mà chương 11 gọi tên tường minh: một số đọc thuộc cột B đánh mất chú thích của nó thì thành một niềm tin cột C. Giảm nhịp poll đi một nửa hoặc gửi payload bốn kilobyte thì tỷ lệ ấy dịch cả một bậc độ lớn, nên con số chỉ có nghĩa khi đứng cạnh các điều kiện đã sinh ra nó. Và hãy để ý cuộc tranh luận này thậm chí không phải về chuyện đó — tắt polling là quyết định về việc những người dùng nào còn kết nối được, nên tỷ lệ băng thông là trục sai bất kể nó bằng bao nhiêu.',
          ),
        }),

        mcq({
          prompt: B(
            'Column A of the summary states that <code>io.to("A").to("B")</code> is an intersection. Three sockets are set up to check it — X in A only, Y in A and B, Z in B only — and the line is run against a real socket.io 4.8.3 server. What is measured?',
            'Cột A của phần tổng kết khẳng định <code>io.to("A").to("B")</code> là phép giao. Ba socket được dựng lên để kiểm — X chỉ ở A, Y ở cả A và B, Z chỉ ở B — và dòng lệnh đó được chạy trên một máy chủ socket.io 4.8.3 thật. Đo ra gì?',
          ),
          options: [
            B('Only Y receives it, confirming the summary', 'Chỉ Y nhận được, xác nhận phần tổng kết'),
            B('Nobody receives it, because chaining <code>to()</code> twice is a no-op', 'Không ai nhận được, vì nối hai lần <code>to()</code> là vô tác dụng'),
            B('X, Y and Z all receive it, and Y receives one copy — it is a union, so the summary is wrong', 'X, Y và Z đều nhận được, và Y nhận một bản — đó là phép hợp, nên phần tổng kết SAI'),
            B('X and Z receive it and Y does not, because Y is deduplicated out of both rooms', 'X và Z nhận được còn Y thì không, vì Y bị khử trùng ra khỏi cả hai room'),
          ],
          correct: 2,
          explanation: EX(
            'Measured with three real clients counting arrivals. Chaining <code>.to()</code> ADDS a room to the target set, exactly as passing an array does, and the adapter deduplicates by socket id so nobody gets two copies. This is the most consequential error in the course, because it sits in the column labelled "true in any repo" and it is repeated as the answer to a final-exam question — and because the mistake is silent in the direction that leaks: code written believing in an intersection will reach strictly MORE people than intended. If you want a genuine intersection, filter it yourself with <code>fetchSockets()</code> or check <code>socket.rooms</code> in the handler.',
            'Đo bằng ba client thật cùng đếm thứ đã tới. Nối thêm <code>.to()</code> là THÊM một room vào tập đích, đúng như truyền vào một mảng, và adapter khử trùng theo id socket nên không ai nhận hai bản. Đây là sai sót nặng hậu quả nhất của khoá học, vì nó nằm trong cột dán nhãn "đúng ở mọi kho" và còn được nhắc lại làm đáp án của một câu trong đề thi cuối — và vì cái sai này âm thầm theo đúng chiều gây rò rỉ: mã viết ra với niềm tin đây là phép giao sẽ tới được NHIỀU người hơn dự định. Muốn một phép giao thật thì hãy tự lọc bằng <code>fetchSockets()</code> hoặc kiểm <code>socket.rooms</code> ngay trong handler.',
          ),
        }),

        mcq({
          prompt: B(
            'Column A also states that the client always begins on polling and that <code>transports</code> is only a permission list. Under what condition is that statement true?',
            'Cột A cũng khẳng định client luôn bắt đầu bằng polling và <code>transports</code> chỉ là danh sách được phép. Khẳng định đó đúng trong điều kiện nào?',
          ),
          options: [
            B('It is true only for the browser client; a Node client starts on WebSocket', 'Nó chỉ đúng với client trình duyệt; client Node bắt đầu bằng WebSocket'),
            B('It is true always, in every version of Socket.IO', 'Nó luôn đúng, ở mọi phiên bản Socket.IO'),
            B('It is true only when the client is behind a proxy that strips the <code>Upgrade</code> header', 'Nó chỉ đúng khi client đứng sau một proxy cắt header <code>Upgrade</code>'),
            B('It is true of the SERVER-side option of the same name; on the client the array is the order it tries them in', 'Nó đúng với tuỳ chọn PHÍA SERVER cùng tên; ở phía client thì mảng đó chính là thứ tự nó thử'),
          ],
          correct: 3,
          explanation: EX(
            'Measured by reading <code>engine.transport.name</code> at the <code>open</code> event: <code>["websocket","polling"]</code> opened on websocket and <code>["polling","websocket"]</code> opened on polling, on the same server, with the same library. The server option genuinely is a permission list — the server does not choose, it only allows — and the summary collapsed the two into one sentence. The practical consequence is worth remembering: putting <code>["websocket"]</code> on the client is not an optimisation, it is a decision to exclude every user whose network will not carry an upgrade.',
            'Đo bằng cách đọc <code>engine.transport.name</code> tại sự kiện <code>open</code>: <code>["websocket","polling"]</code> mở ra ở websocket còn <code>["polling","websocket"]</code> mở ra ở polling, trên cùng máy chủ, cùng thư viện. Tuỳ chọn phía server đúng là một danh sách được phép — máy chủ không chọn, nó chỉ cho phép — và phần tổng kết đã gộp hai thứ vào một câu. Hệ quả thực tế đáng nhớ: đặt <code>["websocket"]</code> ở phía client không phải một phép tối ưu, đó là quyết định loại bỏ mọi người dùng có mạng không chở nổi một cú upgrade.',
          ),
        }),

        mcq({
          prompt: B(
            'Which pair of column-A claims survived measurement in this paper?',
            'Cặp khẳng định nào của cột A đã sống sót qua các phép đo trong đề này?',
          ),
          options: [
            B('"The Redis adapter is not a substitute for sticky sessions" and "the default delivery guarantee is at-most-once"', '"Redis adapter không thay được sticky session" và "bảo đảm giao hàng mặc định là at-most-once"'),
            B('"<code>socket.id</code> is preserved across a reconnect" and "rooms exist at the engine.io layer"', '"<code>socket.id</code> được giữ nguyên qua một lần nối lại" và "room tồn tại ở tầng engine.io"'),
            B('"A namespace is a separate engine.io connection" and "polling cannot carry binary"', '"Một namespace là một kết nối engine.io riêng" và "polling không chở được binary"'),
            B('"An emit throws when the client is gone" and "the client sends the heartbeat"', '"Một lệnh emit sẽ ném lỗi khi client đã biến mất" và "client là bên gửi nhịp tim"'),
          ],
          correct: 0,
          explanation: EX(
            'Both hold up. Stickiness and the adapter address different failures — one routes a session to the worker that owns it, the other carries broadcasts between workers — and neither substitutes for the other. And an <code>emit</code> genuinely promises nothing: it never throws when the recipient has gone, and a reconnect replays nothing, which is the whole reason chapter 6 exists. Everything in the other options was measured false: the id changes on reconnect, rooms are a layer-3 idea, a namespace shares one engine.io connection, polling carries binary as a base64 attachment, and in Engine.IO v4 the SERVER pings.',
            'Cả hai đều đứng vững. Sticky và adapter chữa hai hỏng hóc khác nhau — một cái định tuyến phiên về đúng worker sở hữu nó, cái kia chở broadcast giữa các worker — và không cái nào thay được cái nào. Còn một lệnh <code>emit</code> thì thật sự chẳng hứa gì: nó không bao giờ ném lỗi khi người nhận đã biến mất, và một lần nối lại không phát lại gì cả, đó chính là toàn bộ lý do chương 6 tồn tại. Mọi thứ trong các phương án còn lại đều đã đo ra sai: id đổi khi nối lại, room là khái niệm tầng 3, một namespace dùng chung một kết nối engine.io, polling chở binary dưới dạng attachment base64, và trong Engine.IO v4 thì SERVER là bên ping.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Automating Q1 and Q2 of the cookbook (chapter 10).</b> Implement <code>soi(cap)</code>, which reads one captured frame log and returns a verdict. Every frame line begins with <code>"&lt;- "</code> (server to client) or <code>"-&gt; "</code> (client to server), followed by the frame exactly as it appeared on the wire.</p>' +
            '<p>Return <code>{ transport, loi, vao, ra, pingChua, ketLuan }</code>:</p>' +
            '<ul>' +
            '<li><code>transport</code> is <code>"websocket"</code> only when all three upgrade frames are present — the client sent <code>2probe</code>, the server answered <code>3probe</code>, and the client sent <code>5</code>. Otherwise <code>"polling"</code>.</li>' +
            '<li><code>loi</code> is the <code>message</code> field of an incoming <code>44</code> frame (CONNECT_ERROR), or <code>null</code>.</li>' +
            '<li><code>vao</code> and <code>ra</code> are the event NAMES of incoming and outgoing <code>42</code> frames, in order. A <code>42</code> frame is <code>42</code> followed by a JSON array whose first element is the name.</li>' +
            '<li><code>pingChua</code> counts unanswered heartbeats: an incoming lone <code>2</code> adds one, an outgoing lone <code>3</code> subtracts one, never below zero.</li>' +
            '<li><code>ketLuan</code>: the connection counts as up only when an incoming <code>0{…}</code> AND an incoming <code>40…</code> were both seen. If it is not up and there was a <code>44</code>, return <code>"Q1 hong: " + loi</code>; if it is not up otherwise, <code>"Q1 hong: bat tay chua xong"</code>; if it is up but <code>cap.mongDoi</code> is not among <code>vao</code>, <code>"Q2 hong: su kien khong len day"</code>; otherwise <code>"OK toi Q3"</code>.</li>' +
            '</ul>' +
            '<p>Careful: <code>44</code> and <code>40</code> both start with <code>4</code>, and a lone <code>2</code> is not the same thing as a <code>42</code>. Every frame in the data was captured from a real socket.io 4.8.3 server. Keep the given data and the printing loop exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 31 — Tự động hoá Q1 và Q2 của sách công thức (chương 10).</b> Cài đặt <code>soi(cap)</code>, đọc một bản ghi frame đã bắt được và trả về một kết luận. Mỗi dòng frame bắt đầu bằng <code>"&lt;- "</code> (server về client) hoặc <code>"-&gt; "</code> (client lên server), theo sau là frame đúng như nó xuất hiện trên dây.</p>' +
            '<p>Trả về <code>{ transport, loi, vao, ra, pingChua, ketLuan }</code>:</p>' +
            '<ul>' +
            '<li><code>transport</code> là <code>"websocket"</code> chỉ khi có đủ cả ba frame upgrade — client đã gửi <code>2probe</code>, server đã trả <code>3probe</code>, và client đã gửi <code>5</code>. Ngược lại là <code>"polling"</code>.</li>' +
            '<li><code>loi</code> là trường <code>message</code> của một frame <code>44</code> đi vào (CONNECT_ERROR), hoặc <code>null</code>.</li>' +
            '<li><code>vao</code> và <code>ra</code> là TÊN sự kiện của các frame <code>42</code> đi vào và đi ra, theo thứ tự. Một frame <code>42</code> là <code>42</code> rồi tới một mảng JSON mà phần tử đầu là tên sự kiện.</li>' +
            '<li><code>pingChua</code> đếm số nhịp tim chưa được trả lời: một <code>2</code> đứng một mình đi vào thì cộng một, một <code>3</code> đứng một mình đi ra thì trừ một, không bao giờ xuống dưới không.</li>' +
            '<li><code>ketLuan</code>: kết nối chỉ được tính là lên khi thấy CẢ một <code>0{…}</code> đi vào VÀ một <code>40…</code> đi vào. Nếu chưa lên mà có <code>44</code> thì trả <code>"Q1 hong: " + loi</code>; nếu chưa lên vì lý do khác thì <code>"Q1 hong: bat tay chua xong"</code>; nếu đã lên nhưng <code>cap.mongDoi</code> không nằm trong <code>vao</code> thì <code>"Q2 hong: su kien khong len day"</code>; ngược lại <code>"OK toi Q3"</code>.</li>' +
            '</ul>' +
            '<p>Cẩn thận: <code>44</code> và <code>40</code> đều bắt đầu bằng <code>4</code>, và một <code>2</code> đứng một mình không phải là <code>42</code>. Mọi frame trong dữ liệu đều bắt từ máy chủ socket.io 4.8.3 thật. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// "<-" la frame server GUI VE, "->" la frame client GUI DI.\n' +
            'const CAPTURES = [\n' +
            "  { ten: 'c1', mongDoi: 'chat:new-message', frames: [\n" +
            '    \'<- 0{"sid":"E1","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\',\n' +
            "    '-> 40',\n" +
            '    \'<- 40{"sid":"S1"}\',\n' +
            "    '-> 2probe', '<- 3probe', '-> 5',\n" +
            '    \'-> 42["chat:send",{"text":"hi"}]\',\n' +
            '    \'<- 42["chat:new-message",{"id":9}]\',\n' +
            "    '<- 2', '-> 3',\n" +
            '  ] },\n' +
            "  { ten: 'c2', mongDoi: 'chat:new-message', frames: [\n" +
            '    \'<- 0{"sid":"E2","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\',\n' +
            '    \'-> 40{"token":"sai"}\',\n' +
            '    \'<- 44{"message":"unauthorized","data":{"code":401}}\',\n' +
            '  ] },\n' +
            "  { ten: 'c3', mongDoi: 'presence:update', frames: [\n" +
            '    \'<- 0{"sid":"E3","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\',\n' +
            "    '-> 40',\n" +
            '    \'<- 40{"sid":"S3"}\',\n' +
            "    '-> 2probe',\n" +
            "    '<- 2', '-> 3',\n" +
            '    \'-> 42["thread:join",42]\',\n' +
            "    '<- 2', '-> 3',\n" +
            '  ] },\n' +
            "  { ten: 'c4', mongDoi: 'device:telemetry', frames: [\n" +
            '    \'<- 0{"sid":"E4","upgrades":[],"pingInterval":5000,"pingTimeout":5000,"maxPayload":1000000}\',\n' +
            "    '-> 40',\n" +
            '    \'<- 40{"sid":"S4"}\',\n' +
            "    '<- 2', '<- 2', '<- 2',\n" +
            '  ] },\n' +
            "  { ten: 'c5', mongDoi: 'thread:typing', frames: [\n" +
            '    \'<- 0{"sid":"E5","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\',\n' +
            '  ] },\n' +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function soi(cap) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const cap of CAPTURES) {\n' +
            '  const r = soi(cap);\n' +
            "  console.log(cap.ten + ' | transport=' + r.transport +\n" +
            "    ' | ra=[' + r.ra.join(',') + ']' +\n" +
            "    ' | vao=[' + r.vao.join(',') + ']' +\n" +
            "    ' | ping chua tra=' + r.pingChua +\n" +
            "    ' | ' + r.ketLuan);\n" +
            '}\n',
          expectedOutput:
            'c1 | transport=websocket | ra=[chat:send] | vao=[chat:new-message] | ping chua tra=0 | OK toi Q3\n' +
            'c2 | transport=polling | ra=[] | vao=[] | ping chua tra=0 | Q1 hong: unauthorized\n' +
            'c3 | transport=polling | ra=[thread:join] | vao=[] | ping chua tra=0 | Q2 hong: su kien khong len day\n' +
            'c4 | transport=polling | ra=[] | vao=[] | ping chua tra=3 | Q2 hong: su kien khong len day\n' +
            'c5 | transport=polling | ra=[] | vao=[] | ping chua tra=0 | Q1 hong: bat tay chua xong',
          sampleSolution:
            'function soi(cap) {\n' +
            '  let moKetNoi = false, moNamespace = false, loi = null;\n' +
            '  let daProbe = false, daTraProbe = false, daUpgrade = false;\n' +
            '  let pingChua = 0;\n' +
            '  const vao = [], ra = [];\n' +
            '  for (const line of cap.frames) {\n' +
            '    const chieu = line.slice(0, 2);\n' +
            '    const f = line.slice(3);\n' +
            "    if (chieu === '<-') {\n" +
            "      if (f.startsWith('0{')) moKetNoi = true;\n" +
            "      else if (f.startsWith('44')) loi = JSON.parse(f.slice(2)).message;\n" +
            "      else if (f.startsWith('40')) moNamespace = true;   // xet SAU 44\n" +
            "      else if (f === '3probe') daTraProbe = true;\n" +
            "      else if (f === '2') pingChua++;                     // PING don doc, khong phai 42\n" +
            "      else if (f.startsWith('42')) vao.push(JSON.parse(f.slice(2))[0]);\n" +
            '    } else {\n' +
            "      if (f === '2probe') daProbe = true;\n" +
            "      else if (f === '5') daUpgrade = true;\n" +
            "      else if (f === '3') pingChua = Math.max(0, pingChua - 1);\n" +
            "      else if (f.startsWith('42')) ra.push(JSON.parse(f.slice(2))[0]);\n" +
            '    }\n' +
            '  }\n' +
            '  const noiDuoc = moKetNoi && moNamespace;\n' +
            "  const transport = daProbe && daTraProbe && daUpgrade ? 'websocket' : 'polling';\n" +
            '  let ketLuan;\n' +
            "  if (!noiDuoc && loi) ketLuan = 'Q1 hong: ' + loi;\n" +
            "  else if (!noiDuoc) ketLuan = 'Q1 hong: bat tay chua xong';\n" +
            "  else if (!vao.includes(cap.mongDoi)) ketLuan = 'Q2 hong: su kien khong len day';\n" +
            "  else ketLuan = 'OK toi Q3';\n" +
            '  return { transport, loi, vao, ra, pingChua, ketLuan };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Why events diverge and a CRDT does not (chapter 8).</b> The same four concurrent edits are written twice: once as positional events, once as CRDT operations. Apply each set in three different orders and show what happens.</p>' +
            '<p><code>chayTheoSuKien(vanBan, ops, thuTu)</code> — plain positional editing on a character array: <code>{ kieu: "chen", pos, ch }</code> inserts <code>ch</code> at index <code>pos</code>; <code>{ kieu: "xoa", pos }</code> removes the character at index <code>pos</code>. Return the resulting string.</p>' +
            '<p><code>chayTheoCRDT(base, ops, thuTu)</code> — every character is an item <code>{ id, ch, origin, xoa }</code> where <code>origin</code> is the id of the item it was inserted after (<code>null</code> for the very first). <code>{ kieu: "chen", id, origin, ch }</code> appends a new item; <code>{ kieu: "xoa", id }</code> sets <code>xoa</code> on the existing item — <b>a tombstone, never a removal</b>, because a later insert may be anchored to it.</p>' +
            '<p>Then derive the document order deterministically, ignoring the order the operations arrived in: group the items by <code>origin</code> (use <code>"ROOT"</code> for <code>null</code>), sort each group by <code>id</code> <b>descending</b> as strings, and walk the tree depth-first from <code>"ROOT"</code>, emitting each item before its own children. Return <code>{ text, soO }</code> where <code>text</code> joins the non-tombstoned characters and <code>soO</code> is the total number of items including tombstones.</p>' +
            '<p>The point of the exercise is the last two lines of output: the event model gives a different document per arrival order, the CRDT gives the same one every time. Keep the given data and the printing block exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 32 — Vì sao sự kiện phân kỳ còn CRDT thì không (chương 8).</b> Cùng bốn phép sửa đồng thời được viết hai lần: một lần dưới dạng sự kiện theo vị trí, một lần dưới dạng thao tác CRDT. Hãy áp mỗi bộ theo ba thứ tự khác nhau và cho thấy điều gì xảy ra.</p>' +
            '<p><code>chayTheoSuKien(vanBan, ops, thuTu)</code> — sửa theo vị trí thuần tuý trên một mảng ký tự: <code>{ kieu: "chen", pos, ch }</code> chèn <code>ch</code> vào chỉ số <code>pos</code>; <code>{ kieu: "xoa", pos }</code> gỡ ký tự ở chỉ số <code>pos</code>. Trả về chuỗi kết quả.</p>' +
            '<p><code>chayTheoCRDT(base, ops, thuTu)</code> — mỗi ký tự là một phần tử <code>{ id, ch, origin, xoa }</code>, trong đó <code>origin</code> là id của phần tử mà nó được chèn ngay sau (<code>null</code> với phần tử đầu tiên). <code>{ kieu: "chen", id, origin, ch }</code> thêm một phần tử mới; <code>{ kieu: "xoa", id }</code> bật <code>xoa</code> trên phần tử đã có — <b>một bia mộ, không bao giờ gỡ đi</b>, vì một phép chèn sau đó có thể đang neo vào nó.</p>' +
            '<p>Sau đó suy ra thứ tự tài liệu một cách tất định, bỏ qua thứ tự các thao tác đã tới: gom các phần tử theo <code>origin</code> (dùng <code>"ROOT"</code> thay cho <code>null</code>), sắp mỗi nhóm theo <code>id</code> <b>giảm dần</b> như chuỗi, rồi duyệt cây theo chiều sâu từ <code>"ROOT"</code>, phát ra mỗi phần tử trước các con của chính nó. Trả về <code>{ text, soO }</code> với <code>text</code> nối các ký tự chưa bị bia mộ và <code>soO</code> là tổng số phần tử kể cả bia mộ.</p>' +
            '<p>Điểm mấu chốt của bài nằm ở hai dòng kết quả cuối: mô hình sự kiện cho ra một tài liệu khác nhau theo từng thứ tự tới, còn CRDT cho ra cùng một tài liệu mọi lần. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const VAN_BAN = 'Hello world';\n" +
            "const idCua = (i) => String(i + 1).padStart(3, '0') + '.S';\n" +
            'const BASE = VAN_BAN.split(\'\').map((ch, i) => ({\n' +
            '  id: idCua(i), ch, origin: i === 0 ? null : idCua(i - 1), xoa: false,\n' +
            '}));\n\n' +
            '// Bon thao tac DONG THOI, moi cai viet o hai dang.\n' +
            'const OPS = [\n' +
            "  { ten: 'A', suKien: { kieu: 'chen', pos: 11, ch: '!' }, crdt: { kieu: 'chen', id: '012.A', origin: '011.S', ch: '!' } },\n" +
            "  { ten: 'B', suKien: { kieu: 'chen', pos: 11, ch: '?' }, crdt: { kieu: 'chen', id: '012.B', origin: '011.S', ch: '?' } },\n" +
            "  { ten: 'C', suKien: { kieu: 'xoa',  pos: 6 },           crdt: { kieu: 'xoa',  id: '007.S' } },\n" +
            "  { ten: 'D', suKien: { kieu: 'chen', pos: 7, ch: 'W' },  crdt: { kieu: 'chen', id: '012.D', origin: '007.S', ch: 'W' } },\n" +
            '];\n' +
            "const THU_TU = [['A', 'B', 'C', 'D'], ['D', 'C', 'B', 'A'], ['C', 'A', 'D', 'B']];\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chayTheoSuKien(vanBan, ops, thuTu) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function chayTheoCRDT(base, ops, thuTu) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const eventKQ = THU_TU.map((t) => chayTheoSuKien(VAN_BAN, OPS, t));\n' +
            'const crdtKQ = THU_TU.map((t) => chayTheoCRDT(BASE, OPS, t));\n' +
            'THU_TU.forEach((t, i) => {\n' +
            "  console.log('thu tu ' + t.join('') + ' | su kien: ' + JSON.stringify(eventKQ[i]) +\n" +
            "    ' | crdt: ' + JSON.stringify(crdtKQ[i].text));\n" +
            '});\n' +
            "console.log('su kien hoi tu = ' + (new Set(eventKQ).size === 1));\n" +
            "console.log('crdt hoi tu    = ' + (new Set(crdtKQ.map((r) => r.text)).size === 1));\n" +
            "console.log('ky tu hien thi = ' + crdtKQ[0].text.length + ' | o trong CRDT (ke bia mo) = ' + crdtKQ[0].soO);\n",
          expectedOutput:
            'thu tu ABCD | su kien: "Hello oWrld?!" | crdt: "Hello World?!"\n' +
            'thu tu DCBA | su kien: "Hello World!?" | crdt: "Hello World?!"\n' +
            'thu tu CADB | su kien: "Hello oWrld?!" | crdt: "Hello World?!"\n' +
            'su kien hoi tu = false\n' +
            'crdt hoi tu    = true\n' +
            'ky tu hien thi = 13 | o trong CRDT (ke bia mo) = 14',
          sampleSolution:
            'function chayTheoSuKien(vanBan, ops, thuTu) {\n' +
            "  let s = vanBan.split('');\n" +
            '  for (const ten of thuTu) {\n' +
            '    const op = ops.find((o) => o.ten === ten).suKien;\n' +
            "    if (op.kieu === 'chen') s.splice(op.pos, 0, op.ch);\n" +
            '    else s.splice(op.pos, 1);\n' +
            '  }\n' +
            "  return s.join('');\n" +
            '}\n\n' +
            'function chayTheoCRDT(base, ops, thuTu) {\n' +
            '  const items = base.map((it) => ({ ...it }));\n' +
            '  for (const ten of thuTu) {\n' +
            '    const op = ops.find((o) => o.ten === ten).crdt;\n' +
            "    if (op.kieu === 'chen') items.push({ id: op.id, ch: op.ch, origin: op.origin, xoa: false });\n" +
            '    else items.find((it) => it.id === op.id).xoa = true;   // bia mo, KHONG xoa that\n' +
            '  }\n' +
            '  // Thu tu tai lieu suy ra tu (origin, id) — khong phu thuoc thu tu toi.\n' +
            '  const con = new Map();\n' +
            '  for (const it of items) {\n' +
            "    const k = it.origin ?? 'ROOT';\n" +
            '    if (!con.has(k)) con.set(k, []);\n' +
            '    con.get(k).push(it);\n' +
            '  }\n' +
            '  for (const arr of con.values()) arr.sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0));\n' +
            '  const ra = [];\n' +
            "  (function di(k) { for (const it of con.get(k) ?? []) { ra.push(it); di(it.id); } })('ROOT');\n" +
            "  return { text: ra.filter((it) => !it.xoa).map((it) => it.ch).join(''), soO: ra.length };\n" +
            '}\n',
        }),
      ],
    },
  ],
};
