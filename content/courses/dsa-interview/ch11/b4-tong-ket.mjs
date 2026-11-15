/** 11.5 (slug khung dsa-11-4-tong-ket) — Ngày phỏng vấn, sau phỏng vấn, khi trượt, lừa đảo tuyển dụng, NDA, và cả khoá trên một trang. */
import { nguon, hoiThoai, lienKet, baiNay } from '../_chung.mjs';
import { THE } from './_rieng.mjs';

const L = (slug, so) => `<a href="${baiNay(slug)}">${so}</a>`;

// Cả khoá trên một trang: dấu hiệu → mẫu → lõi → độ phức tạp → bài (slug khung / bài đã xong).
const MAU = [
  ['"find a partner", "seen before?", "how many times?"', '"tìm người còn lại", "gặp rồi chưa?", "bao nhiêu lần?"', 'Hash map / set', 'store what you passed, look up in O(1)', 'cất cái đã đi qua, tra O(1)', 'O(n)', L('dsa-1-1-hash-map', '1.1')],
  ['sum of a range, "subarray sum = k"', 'tổng một đoạn, "đoạn con có tổng = k"', 'Prefix sum (+ map)', 'pre[r+1] − pre[l]; count earlier prefixes equal to pre − k', 'pre[r+1] − pre[l]; đếm tiền tố trước bằng pre − k', 'O(n)', L('dsa-1-2-prefix-sum', '1.2')],
  ['order helps, top-k, overlapping', 'thứ tự giúp ích, top-k, chồng lấn', 'Sort + scan', 'sort with a comparator, then one pass', 'sắp với comparator, rồi một lượt', 'O(n log n)', L('dsa-1-3-sap-xep', '1.3')],
  ['"appears once", subsets with n ≤ 20', '"xuất hiện một lần", tập con với n ≤ 20', 'Bits / bitmask', 'XOR cancels pairs; mask 0..2ⁿ−1', 'XOR triệt cặp; mask 0..2ⁿ−1', 'O(n) / O(2ⁿ·n)', L('dsa-1-5-bit', '1.4')],
  ['sorted array, pair, palindrome, in place', 'mảng đã sắp, cặp, đối xứng, tại chỗ', 'Two pointers', 'move the pointer whose move can still help', 'dịch con trỏ mà việc dịch còn có ích', 'O(n)', L('dsa-2-1-hai-con-tro', '2.1')],
  ['longest / shortest contiguous part with a rule', 'đoạn liên tiếp dài / ngắn nhất thoả luật', 'Sliding window', 'grow right; shrink left while invalid', 'mở rộng phải; co trái khi vi phạm', 'O(n)', L('dsa-2-2-cua-so', '2.2')],
  ['cycle, middle, duplicate in 1..n', 'chu trình, điểm giữa, phần tử trùng trong 1..n', 'Fast / slow pointers', 'fast moves 2, slow moves 1; they meet in the cycle', 'nhanh đi 2, chậm đi 1; gặp nhau trong chu trình', 'O(n), O(1)', L('dsa-2-3-nhanh-cham', '2.3')],
  ['matching brackets, "next greater", undo', 'khớp ngoặc, "phần tử lớn hơn kế tiếp", hoàn tác', 'Stack / monotonic stack', 'pop while the top is beaten', 'pop khi đỉnh bị vượt', 'O(n)', L('dsa-3-1-stack', '3.1')],
  ['window maximum, BFS order', 'max cửa sổ, thứ tự BFS', 'Queue / deque', 'deque of indices, decreasing values', 'deque chỉ số, giá trị giảm dần', 'O(n)', L('dsa-3-2-queue', '3.2')],
  ['rewire a list, LRU', 'nối lại danh sách, LRU', 'Linked list + dummy', 'dummy head; prev/cur/next', 'nút giả đầu; prev/cur/next', 'O(n)', L('dsa-3-3-linked-list', '3.3')],
  ['sorted, or "smallest x that works"', 'đã sắp, hoặc "x nhỏ nhất thoả"', 'Binary search (firstTrue)', 'invariant on [lo, hi); predicate monotone', 'bất biến trên [lo, hi); vị từ đơn điệu', 'O(log n) · O(n log V)', `${L('dsa-4-1-co-ban', '4.1')} · ${L('dsa-4-3-khong-gian-dap-an', '4.3')}`],
  ['tree: depth, paths, balance, BST, prefixes', 'cây: độ sâu, đường đi, cân bằng, BST, tiền tố', 'DFS / BFS / trie', '"what does the function return to its parent?"', '"hàm trả gì cho cha?"', 'O(n)', `${L('dsa-5-2-de-quy', '5.2')} · ${L('dsa-5-3-bst', '5.3')} · ${L('dsa-5-5-trie', '5.4')}`],
  ['top-k, merge k lists, running median', 'top-k, gộp k danh sách, trung vị động', 'Heap', 'size-k heap; two heaps for the median', 'heap cỡ k; hai heap cho trung vị', 'O(n log k)', `${L('dsa-6-1-heap', '6.1')} · ${L('dsa-6-2-trung-vi', '6.2')}`],
  ['intervals: merge, rooms, schedule', 'khoảng: gộp, số phòng, xếp lịch', 'Sort + sweep', 'sort by start (merge) or end (schedule); +1/−1 events', 'sắp theo đầu (gộp) hoặc cuối (xếp lịch); sự kiện +1/−1', 'O(n log n)', L('dsa-6-3-khoang', '6.3')],
  ['grid / network connectivity, fewest steps', 'lưới / mạng liên thông, ít bước nhất', 'BFS / DFS', 'mark when pushed; BFS for unweighted shortest', 'đánh dấu lúc push; BFS cho ngắn nhất không trọng số', 'O(V + E)', L('dsa-7-2-bfs-dfs', '7.2')],
  ['prerequisites, build order, cycle?', 'tiên quyết, thứ tự build, có chu trình?', 'Topological sort', 'Kahn: indegree 0 first', 'Kahn: bậc vào 0 trước', 'O(V + E)', L('dsa-7-3-topo', '7.3')],
  ['weighted shortest path, merging groups', 'đường ngắn nhất có trọng số, gộp nhóm', 'Dijkstra / union-find', 'heap of (dist, node); find with path compression', 'heap (khoảng cách, đỉnh); find nén đường', 'O(E log V)', L('dsa-7-4-dijkstra', '7.4')],
  ['"all combinations / arrangements", n small', '"mọi tổ hợp / hoán vị", n nhỏ', 'Backtracking', 'choose → recurse → unchoose; prune early', 'chọn → đệ quy → bỏ chọn; cắt nhánh sớm', 'O(2ⁿ·n), O(n!·n)', `${L('dsa-8-1-mau', '8.1')} · ${L('dsa-8-3-cat-nhanh', '8.3')}`],
  ['count ways, min cost, max value, overlapping subproblems', 'đếm số cách, chi phí nhỏ nhất, giá trị lớn nhất, bài con chồng nhau', 'Dynamic programming', 'state · transition · base · order — say them first', 'trạng thái · chuyển · cơ sở · thứ tự — nói trước', 'states × transition', `${L('dsa-9-1-nhap-mon', '9.1')} · ${L('dsa-9-4-nhan-dien', '9.4')}`],
  ['"locally best is globally best?"', '"tốt nhất trước mắt là tốt nhất cả bài?"', 'Greedy', 'prove it or find a counterexample first', 'chứng minh, hoặc tìm phản ví dụ trước', 'often O(n log n)', L('dsa-9-5-greedy', '9.5')],
];
function bangMau(lang) {
  const en = lang === 'en';
  const dau = en ? ['Signal in the problem', 'Pattern', 'Core move', 'Typical cost', 'Lesson'] : ['Dấu hiệu trong đề', 'Mẫu', 'Nước đi cốt lõi', 'Chi phí thường gặp', 'Bài'];
  return `<table>\n<thead><tr>${dau.map((d) => `<th>${d}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    MAU.map((m) => `<tr><td>${en ? m[0] : m[1]}</td><td><strong>${m[2]}</strong></td><td>${en ? m[3] : m[4]}</td><td>${m[5]}</td><td>${m[6]}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

// Triệu chứng sau một buổi trượt → trục → bài chữa (bài 11.2–11.4 trỏ về cột này).
const CHUA = [
  ['Silent stretches; started coding without questions', 'Im lặng từng quãng; code mà không hỏi gì', 'Communication', 'Giao tiếp', `${L('dsa-10-1-noi', '10.1')} · ${L('dsa-0-2-khung', '0.2')}`],
  ['Froze when stuck, apologised, stopped talking', 'Đứng hình khi bí, xin lỗi rồi im', 'Communication', 'Giao tiếp', L('dsa-10-1-noi', '10.1')],
  ['No brute force; went straight for the clever idea', 'Không có vét cạn; lao thẳng vào ý "khôn"', 'Problem solving', 'Giải quyết vấn đề', L('dsa-0-2-khung', '0.2')],
  ['Did not recognise the pattern', 'Không nhận ra mẫu', 'Problem solving', 'Giải quyết vấn đề', '§'],
  ['Wrong or missing complexity', 'Sai hoặc thiếu độ phức tạp', 'Problem solving', 'Giải quyết vấn đề', L('dsa-0-1-big-o', '0.1')],
  ['Messy code, bad names, copy-paste', 'Code rối, tên tồi, chép–dán', 'Technical', 'Code', L('dsa-10-2-code-sach', '10.2')],
  ['Forgot an API (heap, comparator, deque)', 'Quên API (heap, comparator, deque)', 'Technical', 'Code', `${L('dsa-6-1-heap', '6.1')} · ${L('dsa-1-3-sap-xep', '1.3')} · ${L('dsa-3-2-queue', '3.2')}`],
  ['Off-by-one in a search or a window', 'Lệch một trong phép tìm hay cửa sổ', 'Technical', 'Code', `${L('dsa-4-1-co-ban', '4.1')} · ${L('dsa-2-2-cua-so', '2.2')}`],
  ['Stack overflow on a deep input', 'Tràn stack với đầu vào sâu', 'Technical', 'Code', L('dsa-5-2-de-quy', '5.2')],
  ['OA: wrong input format, TLE from slow I/O', 'OA: đọc sai định dạng, quá giờ vì I/O chậm', 'Technical', 'Code', L('dsa-10-4-online', '10.4')],
  ['Said "done" without tracing; traced the intention', 'Nói "xong" mà không chạy tay; chạy tay theo ý định', 'Testing', 'Kiểm thử', L('dsa-10-3-test', '10.3')],
];
function bangChua(lang) {
  const en = lang === 'en';
  const dau = en ? ['Symptom in your notes', 'Axis', 'Fixing lesson'] : ['Triệu chứng trong ghi chú', 'Trục', 'Bài chữa'];
  return `<table>\n<thead><tr>${dau.map((d) => `<th>${d}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    CHUA.map((c) => `<tr><td>${en ? c[0] : c[1]}</td><td>${en ? c[2] : c[3]}</td><td>${c[4] === '§' ? (en ? 'the pattern table below' : 'bảng mẫu bên dưới') : c[4]}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

export default {
  title: '11.5 — The day, the day after, scams and NDAs — and the whole course on one page|||11.5 — Ngày phỏng vấn, sau phỏng vấn, lừa đảo và NDA — và cả khoá trên một trang',
  slug: 'dsa-11-4-tong-ket',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Checklist ngày phỏng vấn (online và tại văn phòng), ghi lại đề trong 30 phút, thư cảm ơn và thư hỏi kết quả EN/VI, xử lý khi trượt theo 4 trục, checklist chống lừa đảo tuyển dụng, NDA và quyền riêng tư, và bảng tóm tắt mọi mẫu của khoá.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>The day, the day after, scams and NDAs — and the whole course on one page</h2>
<p class="lead">You have the patterns, the habits and three mock sessions behind you. What is left is everything around the 45 minutes: the morning of the interview (where people lose rounds to a dead laptop battery), the half-hour after it (where they lose the lessons), the email they send or do not send, what to do with a rejection, how to spot the fake recruiters who target exactly people in your position, and what you may and may not share afterwards. The lesson ends with the whole course on one page — the table to read on the morning of the interview.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Ngày phỏng vấn, sau phỏng vấn, lừa đảo và NDA — và cả khoá trên một trang</h2>
<p class="lead">Bạn đã có các mẫu bài, các thói quen và ba buổi phỏng vấn thử. Phần còn lại là mọi thứ xung quanh 45 phút đó: buổi sáng hôm phỏng vấn (nơi người ta mất cả vòng vì laptop hết pin), nửa tiếng ngay sau đó (nơi người ta đánh rơi bài học), lá thư họ gửi hoặc không gửi, làm gì với một lời từ chối, cách nhận ra những "nhà tuyển dụng" giả nhắm đúng vào người ở vị trí của bạn, và điều gì được và không được chia sẻ sau buổi. Bài kết thúc bằng cả khoá trên một trang — tấm bảng để đọc vào sáng hôm phỏng vấn.</p>
</div>

<div class="ml-en">
<h3>The everyday picture: why pilots still use checklists</h3>
<p>In October 1935 the prototype of the Boeing B-17 crashed on a demonstration flight because an experienced test pilot forgot to release a control lock — one step among dozens. The response was not "train harder" but a short written checklist read aloud before take-off, and pilots with thousands of hours still use one today. The lesson transfers exactly: on interview day your head is full of the problem, so anything that depends on remembering a small step (charging, muting Zalo, sharing the right window) will eventually be forgotten. Write it down once, read it every time.</p>
</div>
<div class="ml-vi">
<h3>Hình dung đời thường: vì sao phi công vẫn dùng checklist</h3>
<p>Tháng 10/1935, nguyên mẫu máy bay Boeing B-17 rơi trong chuyến bay trình diễn vì một phi công thử nghiệm dày dạn quên mở khoá cần lái — một bước trong hàng chục bước. Cách phản ứng không phải "luyện chăm hơn" mà là một bảng kiểm (checklist) ngắn, đọc to trước khi cất cánh, và các phi công có hàng nghìn giờ bay vẫn dùng nó tới hôm nay. Bài học chuyển nguyên vẹn sang bạn: ngày phỏng vấn đầu bạn đầy ắp đề bài, nên bất cứ thứ gì phụ thuộc vào việc nhớ một bước nhỏ (sạc pin, tắt Zalo, chia sẻ đúng cửa sổ) sớm muộn sẽ bị quên. Viết ra một lần, đọc lại mỗi lần.</p>
</div>

<div class="ml-en">
<h3>The interview-day checklist</h3>
<div class="lz-flow">
${THE('T − 1 day', 'Prepare', 'Confirm the time zone and link; open the link once (Meet / Zoom / Teams / CoderPad) to install whatever it needs. Re-read the job post, your CV and the projects on it. Prepare your 90-second introduction and two questions to ask. Sleep — a tired brain loses more points than one more problem gains.')}
${THE('T − 60′', 'Machine and room', 'Laptop on the charger. Internet tested, phone hotspot ready as backup. Camera at eye level, light in front of you, headphones with a mic. Tell family or roommates; a note on the door. Paper, pen, water.')}
${THE('T − 15′', 'Software', 'Close every chat app; turn notifications off (Zalo, Messenger, Slack, mail). AI assistants off in the IDE. Editor font size 16+, the language you will use selected, a blank file ready. Share-screen tested on the editor window only.')}
${THE('During', 'Habits', 'Six steps out loud (0.2). Ask before coding. Trace two edge cases on purpose. If stuck: the protocol of 10.1. If the call drops: rejoin immediately, and send a one-line message to the recruiter.')}
${THE('T + 30′', 'Write it down', 'The private interview log below, before you check your phone.')}
</div>
<table>
<thead><tr><th>Online</th><th>On site</th></tr></thead>
<tbody>
<tr><td>Laptop + charger plugged in; backup hotspot; headphones</td><td>Arrive 15 minutes early; know the building, floor and the name of the person to ask for</td></tr>
<tr><td>Quiet room, plain background, light in front</td><td>ID card (CCCD) for the security desk; laptop + charger if they asked you to bring one</td></tr>
<tr><td>Link opened the day before; the recruiter's phone number saved in case it fails</td><td>Paper and pen — whiteboard or paper rounds still exist and are coming back</td></tr>
<tr><td>Only the editor window shared; notifications off</td><td>Phone silent and in the bag; water</td></tr>
</tbody></table>
</div>
<div class="ml-vi">
<h3>Checklist ngày phỏng vấn</h3>
<div class="lz-flow">
${THE('T − 1 ngày', 'Chuẩn bị', 'Xác nhận giờ (múi giờ) và đường link; mở link một lần (Meet / Zoom / Teams / CoderPad) để cài sẵn thứ nó cần. Đọc lại tin tuyển dụng, CV của bạn và các dự án trong đó. Chuẩn bị phần giới thiệu 90 giây và hai câu hỏi để hỏi lại. Đi ngủ — não mệt mất nhiều điểm hơn số điểm thêm được nhờ luyện thêm một đề.')}
${THE('T − 60′', 'Máy và phòng', 'Laptop cắm sạc. Đã thử mạng, có 4G điện thoại phát dự phòng. Camera ngang tầm mắt, đèn chiếu từ phía trước, tai nghe có mic. Báo gia đình hoặc bạn cùng phòng; dán tờ giấy lên cửa. Giấy, bút, nước.')}
${THE('T − 15′', 'Phần mềm', 'Tắt mọi ứng dụng chat; tắt thông báo (Zalo, Messenger, Slack, mail). Tắt trợ lý AI trong IDE. Cỡ chữ trình soạn từ 16 trở lên, chọn sẵn ngôn ngữ sẽ dùng, mở sẵn một tệp trống. Đã thử chia sẻ màn hình CHỈ cửa sổ trình soạn.')}
${THE('Trong buổi', 'Thói quen', 'Sáu bước, nói to (0.2). Hỏi trước khi code. Cố ý chạy tay hai ca biên. Khi bí: quy trình của 10.1. Rớt cuộc gọi: vào lại ngay, và nhắn một dòng cho người tuyển dụng.')}
${THE('T + 30′', 'Ghi lại', 'Sổ phỏng vấn riêng tư ở dưới, trước khi bạn mở điện thoại.')}
</div>
<table>
<thead><tr><th>Online</th><th>Tại văn phòng</th></tr></thead>
<tbody>
<tr><td>Laptop + cắm sạc; 4G dự phòng; tai nghe</td><td>Tới sớm 15 phút; biết toà nhà, tầng và tên người cần gặp</td></tr>
<tr><td>Phòng yên tĩnh, phông nền gọn, đèn chiếu phía trước</td><td>CCCD để gửi ở bàn bảo vệ; laptop + sạc nếu được dặn mang theo</td></tr>
<tr><td>Đã mở link từ hôm trước; lưu số điện thoại người tuyển dụng phòng khi link lỗi</td><td>Giấy và bút — vòng viết bảng trắng hay giấy vẫn còn, và đang quay lại</td></tr>
<tr><td>Chỉ chia sẻ cửa sổ trình soạn; đã tắt thông báo</td><td>Điện thoại im lặng, để trong balo; nước uống</td></tr>
</tbody></table>
${lienKet({ khoa: 'interview-prep', bai: 'pv-9-4-tong-ket', title: 'Interview Prep 9.4 — Checklist sẵn sàng phỏng vấn', sub: 'Bản đầy đủ cho mọi loại vòng: hôm trước, buổi sáng, thiết lập online', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>Within 30 minutes: write the problem down</h3>
<p>Memory of the details fades fast — within a day you will remember "it was a graph problem" and little else. Thirty minutes after the call, before any messages, write a private entry with these fields: the problem <strong>in your own words</strong> with the example; the constraints you were told; the approach you took, its complexity and the minute you got there; where you got stuck and which hint you received; the follow-up questions; the question you asked at the end; the interviewer's name and role; and one sentence "next time I would…". Then add the problem's <em>pattern</em> to your error log and the review ladder like any other problem.</p>
<p>This log is yours. It is how you find patterns across real interviews (three companies in a row asked about intervals?), and it is the material for the email you are about to write.</p>
<h3>The thank-you email (within 24 hours)</h3>
<p>Short, specific, and never a second attempt at the interview. One detail from the conversation shows you were present; a two-page corrected solution looks like you are re-arguing the result. If you realised a real bug or a better complexity after the call, one sentence is acceptable — no code attachment.</p>
<div class="callout"><p><strong>Subject:</strong> Thank you — Software Engineering Intern interview</p>
<p>Dear [Name],</p>
<p>Thank you for taking the time to interview me today for the Software Engineering Intern position. I enjoyed working through the scheduling problem with you, especially your follow-up about returning the chosen jobs — it made me think about how to trace back through the DP table.</p>
<p>I'm very interested in the role and in [one specific thing about the team you heard in the interview]. Please let me know if you need anything else from me.</p>
<p>Best regards,<br>[Full name] · [phone] · [GitHub link]</p></div>
<p><strong>Following up on the result.</strong> If they said "within a week", wait a week plus two working days, then send one polite line: <em>"I wanted to follow up on my interview on [date] for the [role] position. Is there any update on the next steps? Thank you."</em> Once, not every day.</p>
</div>
<div class="ml-vi">
<h3>Trong vòng 30 phút: ghi đề lại</h3>
<p>Trí nhớ về chi tiết phai rất nhanh — qua một ngày bạn sẽ chỉ còn nhớ "đề về đồ thị" và gần như không gì hơn. Ba mươi phút sau cuộc gọi, trước khi đọc tin nhắn nào, viết một mục riêng tư gồm: đề bài <strong>bằng lời của bạn</strong> kèm ví dụ; các ràng buộc đã được cho biết; hướng bạn đi, độ phức tạp và phút bạn tới được đó; chỗ bị bí và gợi ý đã nhận; các câu hỏi nối tiếp; câu bạn hỏi lại ở cuối; tên và vai trò người phỏng vấn; và một câu "lần sau mình sẽ…". Rồi đưa <em>mẫu</em> của đề đó vào sổ lỗi và thang ôn như mọi đề khác.</p>
<p>Sổ này là của riêng bạn. Nó giúp bạn thấy quy luật qua các buổi phỏng vấn thật (ba công ty liền đều hỏi về khoảng?), và là nguyên liệu cho lá thư bạn sắp viết.</p>
<h3>Thư cảm ơn (trong vòng 24 giờ)</h3>
<p>Ngắn, cụ thể, và không bao giờ là một lần thi lại. Một chi tiết từ cuộc trò chuyện cho thấy bạn đã thật sự có mặt; một bản lời giải sửa lại dài hai trang trông như bạn đang cãi lại kết quả. Nếu sau buổi bạn nhận ra một lỗi thật hoặc một độ phức tạp tốt hơn, một câu là chấp nhận được — không đính kèm code.</p>
<div class="callout"><p><strong>Tiêu đề:</strong> Cảm ơn anh/chị — buổi phỏng vấn vị trí Thực tập sinh Kỹ sư phần mềm</p>
<p>Chào anh/chị [Tên],</p>
<p>Em cảm ơn anh/chị đã dành thời gian phỏng vấn em hôm nay cho vị trí Thực tập sinh Kỹ sư phần mềm. Em rất thích phần cùng anh/chị giải bài xếp lịch, nhất là câu hỏi nối tiếp về việc trả lại danh sách việc đã chọn — nó làm em nghĩ thêm về cách truy vết ngược bảng DP.</p>
<p>Em rất mong được làm việc ở vị trí này và ở [một điều cụ thể về đội mà bạn nghe được trong buổi]. Nếu anh/chị cần thêm thông tin gì từ em, em xin gửi ngay.</p>
<p>Trân trọng,<br>[Họ tên] · [số điện thoại] · [link GitHub]</p></div>
<p>Công ty nước ngoài thì gửi bản tiếng Anh ở khối EN (đổi tên vị trí và chi tiết cho đúng buổi của bạn). <strong>Hỏi kết quả.</strong> Nếu họ hẹn "trong một tuần", đợi một tuần cộng hai ngày làm việc, rồi gửi một dòng lịch sự: <em>"Em xin phép hỏi thăm kết quả buổi phỏng vấn ngày [ngày] cho vị trí [tên vị trí] ạ. Anh/chị có cập nhật gì về bước tiếp theo không ạ? Em cảm ơn."</em> Một lần thôi, không phải mỗi ngày.</p>
${lienKet({ khoa: 'interview-prep', bai: 'pv-9-2-sau-phong-van', title: 'Interview Prep 9.2 — Sau phỏng vấn', sub: 'Thư cảm ơn, hỏi kết quả, xin góp ý và xử lý lời từ chối — thêm nhiều mẫu thư', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>When the answer is no</h3>
<p>Reply in two lines, thank them, and ask once for feedback: <em>"Thank you for letting me know. If possible, I would really appreciate any feedback that could help me improve."</em> Many companies have a policy of not giving feedback; do not push. Then debrief yourself the way you debriefed the mocks, with the four axes — your private log has the facts. Match each symptom to its fixing lesson:</p>
${bangChua('en')}
<p>Three things to keep in mind. One interview is a noisy measurement: a different interviewer, problem or day can move the result a lot, so one rejection says less about you than it feels. Most large companies let you re-apply after a cooling-off period (often 6–12 months); internship cycles repeat every term. And the application you just sent is not the last — keep the review ladder running, because the next interview is usually sooner than you expect.</p>
</div>
<div class="ml-vi">
<h3>Khi câu trả lời là không</h3>
<p>Trả lời hai dòng, cảm ơn, và xin góp ý một lần: <em>"Em cảm ơn anh/chị đã báo kết quả. Nếu được, em rất mong nhận được góp ý để em cải thiện ạ." ("If possible, I would really appreciate any feedback that could help me improve.")</em> Nhiều công ty có chính sách không đưa góp ý; đừng nài. Rồi tự rút kinh nghiệm như bạn đã làm với các buổi thử, bằng bốn trục — sổ phỏng vấn riêng tư có sẵn sự việc. Ghép mỗi triệu chứng với bài chữa của nó:</p>
${bangChua('vi')}
<p>Ba điều nên nhớ. Một buổi phỏng vấn là một phép đo nhiều nhiễu: người phỏng vấn khác, đề khác, ngày khác có thể đổi kết quả rất nhiều, nên một lời từ chối nói về bạn ít hơn cảm giác của nó. Phần lớn công ty lớn cho ứng tuyển lại sau một thời gian chờ (thường 6–12 tháng); đợt tuyển thực tập lặp lại mỗi kỳ. Và hồ sơ bạn vừa nộp không phải hồ sơ cuối cùng — cứ giữ thang ôn chạy đều, vì buổi phỏng vấn tiếp theo thường tới sớm hơn bạn nghĩ.</p>
</div>

<div class="ml-en">
<h3>🎤 The rejection call, handled well</h3>
${hoiThoai([
  ['I', 'Hi, this is [Name] from the recruiting team. Thanks again for interviewing with us. Unfortunately, we’ve decided not to move forward this time.'],
  ['C', 'Thank you for letting me know, and for the time the team spent with me.'],
  ['N', 'First sentence: thanks, not arguing. The recruiter decides whether to keep your profile for the next cycle — this call is part of that.'],
  ['C', 'If it’s possible, could you share any feedback on what I could improve? Even one point would help me a lot.'],
  ['I', 'I can say the interviewers liked how you communicated, but felt the second problem needed more hints than they expected.'],
  ['C', 'That’s really useful, thank you. I’ll work on that. Would it be OK to apply again for the next internship cycle?'],
  ['N', 'Take the one point, do not debate it, and ask about the next cycle. "Needed more hints" maps to problem solving — Chapter 9.4 or the pattern table below.'],
  ['I', 'Of course, we’d be happy to see your application again.'],
  ['C', 'Great. Thank you again, and have a good day.'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Cuộc gọi báo trượt, xử lý cho khéo</h3>
<p>Bản tiếng Anh ở khối EN; dưới đây là cùng mạch bằng tiếng Việt, kèm cụm tiếng Anh nên thuộc.</p>
${hoiThoai([
  ['I', 'Chào bạn, mình là [Tên] bên tuyển dụng. Cảm ơn bạn lần nữa đã tham gia phỏng vấn. Rất tiếc lần này bên mình quyết định chưa tiếp tục với bạn.'],
  ['C', 'Em cảm ơn chị đã báo cho em, và cảm ơn thời gian các anh chị đã dành cho em ạ. <em>("Thank you for letting me know.")</em>'],
  ['N', 'Câu đầu: cảm ơn, không cãi. Người tuyển dụng quyết định có giữ hồ sơ bạn cho đợt sau không — cuộc gọi này là một phần của việc đó.'],
  ['C', 'Nếu được, chị có thể cho em xin góp ý em nên cải thiện điều gì không ạ? Chỉ một điểm thôi cũng giúp em rất nhiều. <em>("Could you share any feedback on what I could improve?")</em>'],
  ['I', 'Mình có thể chia sẻ là người phỏng vấn thích cách bạn trao đổi, nhưng thấy đề thứ hai bạn cần nhiều gợi ý hơn họ mong đợi.'],
  ['C', 'Góp ý này rất có ích, em cảm ơn chị. Em sẽ luyện phần đó. Đợt thực tập sau em ứng tuyển lại được không ạ? <em>("Would it be OK to apply again for the next internship cycle?")</em>'],
  ['N', 'Nhận đúng một điểm góp ý, không tranh luận, và hỏi về đợt sau. "Cần nhiều gợi ý" là trục giải quyết vấn đề — bài 9.4 hoặc bảng mẫu bên dưới.'],
  ['I', 'Tất nhiên rồi, bên mình rất vui được nhận lại hồ sơ của bạn.'],
  ['C', 'Dạ vâng. Em cảm ơn chị lần nữa, chúc chị một ngày tốt lành.'],
], 'vi')}
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: fake recruiters, fake offers, fake tests</h3>
<p>Students who are applying for internships are a target: they expect messages from strangers, they want to say yes, and they rarely know what a normal process looks like. Section 0 and lesson 10.4 described the "Contagious Interview" campaign documented by Unit 42 (a fake technical test whose repository installs malware on <code>npm install</code>). Here is the full checklist to run on any unexpected offer.</p>
<table>
<thead><tr><th>Red flag</th><th>Why it is a red flag</th></tr></thead>
<tbody>
<tr><td>Any request for money: "application fee", "training deposit", "uniform / laptop deposit", "insurance before you start"</td><td>Real employers pay you; they do not charge you to work. This single rule catches most scams.</td></tr>
<tr><td>An offer without an interview, or after a 5-minute chat</td><td>Nobody hires an engineer without testing them.</td></tr>
<tr><td>Contact only through Telegram / WhatsApp / a personal Gmail; the company domain does not match</td><td>Real recruiters use the company's email and you can find them on its website or LinkedIn with a history.</td></tr>
<tr><td>Pressure: "decide today", "only 2 places left"</td><td>Urgency is there to stop you from checking.</td></tr>
<tr><td>Your ID card photo, bank account, or an OTP before a signed contract</td><td>ID + bank details are what is needed to open loans or accounts in your name. An OTP is never part of hiring.</td></tr>
<tr><td>"Download this repository and run it to start the test"</td><td>A real OA runs in the browser (10.4). If you must look at code, read it on GitHub, never run it on your own machine; use a throw-away virtual machine if you truly must run it.</td></tr>
<tr><td>Small paid "tasks" first (liking, rating, booking), then a deposit to "unlock" bigger earnings</td><td>The classic task scam: the first small payments are real so that the large deposit is sent.</td></tr>
<tr><td>A salary far above the market for an intern with no experience required</td><td>Too good to be true is usually exactly that.</td></tr>
</tbody></table>
<p><strong>How to verify:</strong> find the job on the company's own careers page; call the company's public phone number (not the one in the message); look the recruiter up on LinkedIn; ask your school's company-relations office, who know which partners are real. <strong>If you already paid or ran something:</strong> stop all further transfers, keep every message and receipt, call your bank immediately, change passwords from another device, and report to the police. Do not be ashamed — these schemes are built by professionals.</p>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: nhà tuyển dụng giả, offer giả, bài test giả</h3>
<p>Sinh viên đang nộp hồ sơ thực tập là một mục tiêu: họ chờ tin nhắn từ người lạ, họ muốn nói "có", và họ hiếm khi biết một quy trình bình thường trông thế nào. Mục 0 và bài 10.4 đã kể chiến dịch "Contagious Interview" do Unit 42 ghi nhận (bài test kỹ thuật giả mà repo của nó cài mã độc khi <code>npm install</code>). Đây là checklist đầy đủ để chạy với mọi offer bất ngờ.</p>
<table>
<thead><tr><th>Cờ đỏ</th><th>Vì sao là cờ đỏ</th></tr></thead>
<tbody>
<tr><td>Mọi yêu cầu nộp tiền: "phí hồ sơ", "cọc đào tạo", "cọc đồng phục / laptop", "phí bảo hiểm trước khi đi làm"</td><td>Nhà tuyển dụng thật trả tiền cho bạn; họ không thu tiền để bạn được làm việc. Riêng luật này đã chặn được phần lớn vụ lừa.</td></tr>
<tr><td>Offer không cần phỏng vấn, hoặc sau 5 phút nói chuyện</td><td>Không ai tuyển kỹ sư mà không kiểm tra.</td></tr>
<tr><td>Chỉ liên lạc qua Telegram / WhatsApp / Gmail cá nhân; tên miền email không khớp công ty</td><td>Người tuyển dụng thật dùng email công ty và bạn tìm được họ trên website hay LinkedIn có lịch sử.</td></tr>
<tr><td>Thúc ép: "quyết định trong hôm nay", "chỉ còn 2 suất"</td><td>Sự gấp gáp có mặt để bạn không kịp kiểm tra.</td></tr>
<tr><td>Đòi ảnh CCCD, số tài khoản ngân hàng, hay mã OTP trước khi ký hợp đồng</td><td>CCCD + thông tin ngân hàng là thứ cần để mở khoản vay hay tài khoản đứng tên bạn. OTP không bao giờ là một bước tuyển dụng.</td></tr>
<tr><td>"Tải repo này về và chạy để bắt đầu bài test"</td><td>Bài OA thật chạy trong trình duyệt (10.4). Bắt buộc phải xem code thì đọc trên GitHub, không chạy trên máy mình; thật sự phải chạy thì dùng một máy ảo dùng một lần.</td></tr>
<tr><td>Vài "nhiệm vụ" nhỏ có trả tiền trước (thả tim, đánh giá, đặt phòng), rồi đòi nạp tiền để "mở khoá" thu nhập lớn hơn</td><td>Lừa đảo nhiệm vụ kinh điển: vài khoản nhỏ đầu tiên là thật để bạn chịu chuyển khoản lớn.</td></tr>
<tr><td>Lương cao vượt hẳn thị trường cho thực tập sinh, không cần kinh nghiệm</td><td>Tốt tới mức khó tin thì thường đúng là không nên tin.</td></tr>
</tbody></table>
<p><strong>Cách kiểm tra:</strong> tìm tin tuyển dụng trên trang tuyển dụng chính thức của công ty; gọi số điện thoại công khai của công ty (không phải số trong tin nhắn); tra người tuyển dụng trên LinkedIn; hỏi phòng quan hệ doanh nghiệp của trường, nơi biết đối tác nào là thật. <strong>Nếu đã chuyển tiền hoặc đã chạy thứ gì đó:</strong> dừng mọi lần chuyển tiếp theo, giữ lại mọi tin nhắn và biên lai, gọi ngân hàng ngay, đổi mật khẩu từ một thiết bị khác, và báo công an. Đừng xấu hổ — những kịch bản này do dân chuyên nghiệp dựng ra.</p>
${lienKet({ khoa: 'interview-prep', bai: 'pv-0-1-tim-viec', title: 'Interview Prep 0.1 — Tìm việc ở đâu và nhận ra lừa đảo', sub: 'Đọc tin tuyển dụng và các dấu hiệu tin giả, kể cả trên nhóm Facebook', cta: 'Mở' })}
</div>

<div class="ml-en">
<h3>NDA and privacy: what you may share afterwards</h3>
<p>Many companies ask candidates — sometimes in writing — to keep interview questions confidential, and interns often sign a non-disclosure agreement (NDA) with the offer. Posting the exact problem text after signing can break that agreement and gets candidates removed from future processes. What is fine and useful to share: the process (number of rounds, duration, online or on site), the <em>kind</em> of problem at pattern level ("a graph traversal and a DP"), and your preparation advice. What stays in your private log only: the exact wording, the company's internal examples, and anything about colleagues or systems you heard about. Two more rules: do not record a real interview without explicit permission, and do not share someone else's details (the interviewer's name, a classmate's result) in a public group.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: posting the full problem in a Facebook group the same evening.</strong></p><p>It feels helpful to classmates, and the post is screenshotted, shared and indexed within hours. If you signed an NDA, it can be a breach with your name on it; if you did not, the company may still change its question bank and quietly stop inviting candidates who leaked it. Share the pattern, keep the text.</p></div>
</div>
<div class="ml-vi">
<h3>NDA và quyền riêng tư: được chia sẻ gì sau buổi</h3>
<p>Nhiều công ty đề nghị ứng viên — đôi khi bằng văn bản — giữ kín câu hỏi phỏng vấn, và thực tập sinh thường ký thoả thuận bảo mật (NDA — non-disclosure agreement) kèm offer. Đăng nguyên văn đề sau khi đã ký có thể vi phạm thoả thuận đó và khiến ứng viên bị loại khỏi các đợt sau. Những gì chia sẻ được và có ích: quy trình (mấy vòng, bao lâu, online hay tại văn phòng), <em>loại</em> đề ở mức mẫu ("một bài duyệt đồ thị và một bài DP"), và lời khuyên chuẩn bị. Những gì chỉ nằm trong sổ riêng tư: câu chữ nguyên văn của đề, ví dụ nội bộ của công ty, và mọi điều bạn nghe được về đồng nghiệp hay hệ thống. Thêm hai luật: không ghi âm, ghi hình buổi phỏng vấn thật khi chưa được cho phép rõ ràng, và không chia sẻ thông tin của người khác (tên người phỏng vấn, kết quả của bạn cùng lớp) trong nhóm công khai.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: đăng nguyên văn đề lên nhóm Facebook ngay tối hôm đó.</strong></p><p>Nó có vẻ giúp ích cho các bạn, và bài đăng bị chụp màn hình, chia sẻ, lên kết quả tìm kiếm chỉ trong vài giờ. Nếu bạn đã ký NDA, đó có thể là một vi phạm có tên bạn trên đó; nếu chưa ký, công ty vẫn có thể đổi ngân hàng đề và lặng lẽ thôi mời những ứng viên làm lộ đề. Chia sẻ mẫu bài, giữ lại câu chữ.</p></div>
${lienKet({ khoa: 'interview-prep', bai: 'pv-9-3-offer', title: 'Interview Prep 9.3 — Đọc và thương lượng offer', sub: 'Phụ cấp, hợp đồng, thử việc và điều khoản NDA nên đọc kỹ', cta: 'Mở' })}
</div>

<div class="ml-en">
<h2>The whole course on one page</h2>
<p>Read this on the morning of the interview, and whenever a problem gives you nothing: scan the left column for the words in the statement, then look at the constraint (lesson 0.1's table: n ≤ 20 allows 2ⁿ, n ≤ 10⁵ needs O(n log n) or better).</p>
${bangMau('en')}
<p>And the habits that are worth as much as the table: six steps out loud (0.2); ask before coding; brute force first, always with its complexity; narrate the one subtle decision; trace two edge cases you chose on purpose; on a Hard, climb the ladder (11.4).</p>
<h3>After the application: the next six weeks</h3>
<ul>
<li>Keep the review ladder running — 15 minutes a day keeps the patterns alive until the interviews.</li>
<li>Finish what Plan A skipped (Chapter 8, the rest of Chapter 9) and the practice sets you did not do.</li>
<li>Then a public list in pattern order (Grind 75, NeetCode 150) for breadth; a weekly LeetCode contest for speed under a clock.</li>
<li>For roles that ask for it: system design basics (Interview Prep 7.3) and the backend or frontend technical round of the Interview Prep course.</li>
</ul>
</div>
<div class="ml-vi">
<h2>Cả khoá trên một trang</h2>
<p>Đọc bảng này vào sáng hôm phỏng vấn, và bất cứ khi nào một đề làm bạn trống rỗng: dò cột bên trái tìm chữ có trong đề, rồi nhìn ràng buộc (bảng của bài 0.1: n ≤ 20 cho phép 2ⁿ, n ≤ 10⁵ cần O(n log n) hoặc tốt hơn).</p>
${bangMau('vi')}
<p>Và những thói quen đáng giá ngang cả tấm bảng: sáu bước nói to (0.2); hỏi trước khi code; vét cạn trước, luôn kèm độ phức tạp; thuật lại đúng một quyết định tinh tế; chạy tay hai ca biên do chính bạn cố ý chọn; với đề Hard thì leo thang (11.4).</p>
<h3>Sau khi nộp hồ sơ: sáu tuần tiếp theo</h3>
<ul>
<li>Giữ thang ôn chạy đều — 15 phút mỗi ngày giữ các mẫu bài sống tới ngày phỏng vấn.</li>
<li>Học nốt phần lộ trình A bỏ qua (Chương 8, phần còn lại của Chương 9) và các bộ luyện chưa làm.</li>
<li>Rồi một danh sách công khai theo thứ tự mẫu (Grind 75, NeetCode 150) để phủ rộng; mỗi tuần một kỳ thi LeetCode (contest) để luyện tốc độ dưới đồng hồ.</li>
<li>Với vị trí có yêu cầu: nền tảng system design (Interview Prep 7.3) và vòng kỹ thuật backend hay frontend của khoá Interview Prep.</li>
</ul>
${lienKet({ khoa: 'interview-prep', bai: 'pv-7-3-system-design', title: 'Interview Prep 7.3 — System design cho junior', sub: 'Thứ thật sự được mong đợi, khung bốn bước, ví dụ rút gọn URL', cta: 'Mở' })}
${lienKet({ bai: 'dsa-11-6-kiem-tra-cuoi-khoa', title: '11.6 — Bài thi cuối khoá', sub: '24 tình huống trộn mọi chương, 30 phút — làm ngay sau bài này', cta: 'Làm bài' })}
</div>

<div class="ml-en">
<h3>Common mistakes around the interview</h3>
<ul>
<li>Testing the video link for the first time at the start time — the installer takes four minutes.</li>
<li>Sharing the whole screen, with chat notifications popping up during the round.</li>
<li>Writing nothing down afterwards, then not remembering the problem a week later.</li>
<li>A thank-you email with a corrected solution attached, or a follow-up every day.</li>
<li>Arguing with a rejection instead of asking for one point of feedback.</li>
<li>Paying any "fee" to get a job, or running a stranger's repository on your own laptop.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp quanh buổi phỏng vấn</h3>
<ul>
<li>Thử link video lần đầu đúng vào giờ bắt đầu — trình cài đặt mất bốn phút.</li>
<li>Chia sẻ cả màn hình, thông báo chat nhảy lên giữa buổi.</li>
<li>Không ghi gì sau buổi, một tuần sau không nhớ nổi đề.</li>
<li>Thư cảm ơn đính kèm lời giải sửa lại, hoặc ngày nào cũng gửi thư hỏi kết quả.</li>
<li>Cãi lại lời từ chối thay vì xin một điểm góp ý.</li>
<li>Nộp bất kỳ "phí" nào để được nhận việc, hoặc chạy repo của người lạ trên laptop của mình.</li>
</ul>
</div>

<div class="ml-en">
<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>Copy the interview-day checklist into your phone notes and adapt it to your room and devices.</li>
<li>Create the private interview log (a document or a sheet) with the fields of "Within 30 minutes".</li>
<li>Write your own thank-you email and follow-up line, in English and Vietnamese, with placeholders.</li>
<li>Take the red-flag table and check the last three job messages you received against it.</li>
<li>Take the final exam, lesson 11.6.</li>
</ol>
<p><strong>Done when:</strong> the checklist is on your phone, the log exists, both email templates are saved, and you have a score on 11.6.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">checklist</span><span class="v">A short written list read every time, so small steps are not left to memory.</span></div>
  <div class="kv"><span class="k">follow-up email</span><span class="v">One polite message asking about the next step, after the promised time.</span></div>
  <div class="kv"><span class="k">cooling-off period</span><span class="v">The time a company asks you to wait before re-applying.</span></div>
  <div class="kv"><span class="k">NDA (non-disclosure agreement)</span><span class="v">A contract to keep information confidential.</span></div>
  <div class="kv"><span class="k">recruitment scam</span><span class="v">A fake job offer used to take money, personal data, or control of your machine.</span></div>
  <div class="kv"><span class="k">task scam</span><span class="v">Small paid "tasks" that lead to a large deposit you never get back.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>A written checklist beats memory on interview day: machine, room, software, habits.</li>
<li>Within 30 minutes, write the problem in your own words in a private log.</li>
<li>Thank-you within 24 hours, short and specific; follow up once after the promised time.</li>
<li>After a no: thank them, ask once for feedback, map symptoms to the fixing lessons, re-apply next cycle.</li>
<li>Any request for money, ID + bank details, OTP, or "run this repo" is a red flag.</li>
<li>Share the pattern, not the problem text; respect NDAs and other people's privacy.</li>
</ul>
${nguon('📘', 'Wikipedia — Checklist', 'Including the 1935 Boeing Model 299 crash that made pre-flight checklists standard', 'https://en.wikipedia.org/wiki/Checklist')}
${nguon('🔐', 'FTC — Job scams', 'How fake job offers work and how to check an employer', 'https://consumer.ftc.gov/articles/job-scams')}
${nguon('🔐', 'Unit 42 — job seekers targeted by fake interviews', 'The "Contagious Interview" campaign documented by Palo Alto Networks', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Chép checklist ngày phỏng vấn vào ghi chú điện thoại và sửa cho hợp với phòng và thiết bị của bạn.</li>
<li>Tạo sổ phỏng vấn riêng tư (một tài liệu hoặc một bảng tính) với các mục của phần "Trong vòng 30 phút".</li>
<li>Viết thư cảm ơn và dòng hỏi kết quả của riêng bạn, bằng tiếng Anh và tiếng Việt, có chỗ trống để điền.</li>
<li>Lấy bảng cờ đỏ, đối chiếu với ba tin nhắn tuyển dụng gần nhất bạn nhận được.</li>
<li>Làm bài thi cuối khoá, bài 11.6.</li>
</ol>
<p><strong>Đạt khi:</strong> checklist nằm trong điện thoại, sổ phỏng vấn đã có, hai mẫu thư đã lưu, và bạn có điểm bài 11.6.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">checklist (bảng kiểm)</span><span class="v">Danh sách ngắn viết sẵn, đọc mỗi lần, để các bước nhỏ không phải dựa vào trí nhớ.</span></div>
  <div class="kv"><span class="k">follow-up email (thư hỏi tiếp)</span><span class="v">Một tin nhắn lịch sự hỏi về bước tiếp theo, sau thời hạn đã hẹn.</span></div>
  <div class="kv"><span class="k">cooling-off period (thời gian chờ)</span><span class="v">Khoảng thời gian công ty yêu cầu bạn đợi trước khi ứng tuyển lại.</span></div>
  <div class="kv"><span class="k">NDA (thoả thuận bảo mật)</span><span class="v">Hợp đồng cam kết giữ kín thông tin.</span></div>
  <div class="kv"><span class="k">recruitment scam (lừa đảo tuyển dụng)</span><span class="v">Offer giả dùng để lấy tiền, dữ liệu cá nhân, hoặc chiếm quyền máy của bạn.</span></div>
  <div class="kv"><span class="k">task scam (lừa đảo nhiệm vụ)</span><span class="v">Vài "nhiệm vụ" nhỏ có trả tiền dẫn tới một khoản nạp lớn không bao giờ lấy lại được.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Ngày phỏng vấn, checklist viết sẵn thắng trí nhớ: máy, phòng, phần mềm, thói quen.</li>
<li>Trong 30 phút, ghi đề bằng lời của bạn vào sổ riêng tư.</li>
<li>Thư cảm ơn trong 24 giờ, ngắn và cụ thể; hỏi kết quả một lần sau thời hạn đã hẹn.</li>
<li>Sau lời từ chối: cảm ơn, xin góp ý một lần, ghép triệu chứng với bài chữa, ứng tuyển lại đợt sau.</li>
<li>Mọi yêu cầu nộp tiền, CCCD + ngân hàng, OTP, hay "chạy repo này" đều là cờ đỏ.</li>
<li>Chia sẻ mẫu bài, không chia sẻ câu chữ của đề; tôn trọng NDA và quyền riêng tư của người khác.</li>
</ul>
${nguon('📘', 'Wikipedia — Checklist', 'Có kể vụ rơi Boeing Model 299 năm 1935 khiến checklist trước khi bay thành chuẩn (tiếng Anh)', 'https://en.wikipedia.org/wiki/Checklist')}
${nguon('🔐', 'FTC — Job scams', 'Offer việc làm giả hoạt động ra sao và cách kiểm tra một nhà tuyển dụng (tiếng Anh)', 'https://consumer.ftc.gov/articles/job-scams')}
${nguon('🔐', 'Unit 42 — ứng viên bị nhắm bằng phỏng vấn giả', 'Chiến dịch "Contagious Interview" do Palo Alto Networks ghi nhận', 'https://unit42.paloaltonetworks.com/two-campaigns-by-north-korea-bad-actors-target-job-hunters/')}
</div>
`,
};
