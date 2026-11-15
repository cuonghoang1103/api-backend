/** 6.3 — Bài toán khoảng. Mọi mã/output đọc từ ../ma/ch06 (chạy thật bằng _chay.mjs, Node 26 + Java 21, Apple M1 Max). */
import { ma, maHai, ketQua, oMang, bangVet, lc, bangDe, moPhong, nguon, csd, hoiThoai, baiNay } from '../_chung.mjs';
import { vetQuet, vetHeapPhong } from '../ma/ch06/sweep.vet.mjs';

const LABS = [[9, 11], [10, 12], [11, 13], [13, 14], [9, 10]];
const BANG_HEAP = bangVet(['next meeting (by start)', 'room free times before (heap)', 'decision', 'heap after', 'rooms'],
  vetHeapPhong(LABS).map((h) => [
    `<strong>${h.hop}</strong>`,
    h.truoc.length ? oMang(h.truoc, { to: { 0: 'l' } }) : '∅',
    h.viec,
    oMang(h.sau, { to: { [h.sau.length - 1]: 'r' } }),
    String(h.phong),
  ]));
const BANG_QUET = bangVet(['time', 'event', 'running count', 'max', 'meetings in progress'],
  vetQuet(LABS).map((h) => [
    String(h.t),
    `${h.d > 0 ? '+1 start' : '−1 end'} ${h.ten}`,
    `<strong>${h.cur}</strong>`,
    String(h.best),
    h.dang.length ? h.dang.join(' ') : '—',
  ]));

const DE = [
  [lc(56, 'merge-intervals', 'Merge Intervals', 'Medium'), 'Sort by start, extend the last merged one (lesson 1.3).', 'Sắp theo đầu, nới khoảng cuối đã gộp (bài 1.3).'],
  [lc(57, 'insert-interval', 'Insert Interval', 'Medium'), 'Already sorted: before / overlapping / after, one pass.', 'Đã sắp sẵn: trước / chồng lấn / sau, một lượt.'],
  [lc(252, 'meeting-rooms', 'Meeting Rooms', 'Easy', { premium: true }), 'Premium. Free equivalent: LintCode 920. Sort by start, compare neighbours.', 'Premium. Bản miễn phí: LintCode 920. Sắp theo đầu, so hai khoảng kề nhau.'],
  [lc(253, 'meeting-rooms-ii', 'Meeting Rooms II', 'Medium', { premium: true }), 'Premium. Free equivalents: LC 2406 (closed version) or LintCode 919. Heap of end times or sweep.', 'Premium. Bản miễn phí: LC 2406 (bản khoảng đóng) hoặc LintCode 919. Heap giờ kết thúc hoặc quét.'],
  [lc(2406, 'divide-intervals-into-minimum-number-of-groups', 'Divide Intervals Into Minimum Number of Groups', 'Medium'), 'Meeting Rooms II with CLOSED intervals: sharing an endpoint clashes.', 'Meeting Rooms II với khoảng ĐÓNG: chung một mép là trùng.'],
  [lc(435, 'non-overlapping-intervals', 'Non-overlapping Intervals', 'Medium'), 'Keep as many as possible ⇒ greedy by earliest END.', 'Giữ được càng nhiều càng tốt ⇒ tham lam theo điểm KẾT THÚC sớm nhất.'],
  [lc(452, 'minimum-number-of-arrows-to-burst-balloons', 'Minimum Number of Arrows to Burst Balloons', 'Medium'), 'Same greedy, closed intervals; the tests contain ±2³¹ — no subtraction in the comparator.', 'Cùng kiểu tham lam, khoảng đóng; test có ±2³¹ — comparator không được trừ.'],
  [lc(1094, 'car-pooling', 'Car Pooling', 'Medium'), 'Sweep with small coordinates ⇒ a difference array, no sorting.', 'Quét với toạ độ nhỏ ⇒ mảng hiệu, không cần sắp xếp.'],
  [lc(986, 'interval-list-intersections', 'Interval List Intersections', 'Medium'), 'Two sorted lists ⇒ two pointers; advance the one that ends first.', 'Hai danh sách đã sắp ⇒ hai con trỏ; tiến con trỏ của khoảng kết thúc trước.'],
  [lc(1851, 'minimum-interval-to-include-each-query', 'Minimum Interval to Include Each Query', 'Hard'), 'Sort queries and intervals; a min-heap by length, pop intervals that ended.', 'Sắp truy vấn và khoảng; min-heap theo độ dài, bỏ những khoảng đã kết thúc.'],
];

export default {
  title: '6.3 — Interval problems: merge, insert, schedule, count the rooms|||6.3 — Bài toán khoảng: gộp, chèn, xếp lịch, đếm số phòng',
  slug: 'dsa-6-3-khoang',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Một phép kiểm chồng lấn (nửa mở hay đóng — đề quyết định), chèn khoảng, tham lam theo điểm kết thúc (non-overlapping, minimum arrows + bẫy tràn số), số phòng họp tối thiểu bằng heap giờ kết thúc và bằng quét +1/−1, mảng hiệu, giao hai danh sách — kèm lịch họp CT Work thật và góc kẻ giữ chỗ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Interval problems: merge, insert, schedule, count the rooms</h2>
<p class="lead">Calendars, room bookings, shifts, video segments, IP ranges, sprints on a timeline — a surprising amount of real software is about <strong>intervals</strong>, and so is a well-known family of interview questions. They look different but stand on two things: <em>one</em> overlap test (whose answer for "touching" endpoints the problem decides), and the right <em>sort</em> — by start when you merge, by end when you choose, by event time when you count. This lesson gives you the four families, the greedy argument behind "sort by end", the famous Meeting Rooms II solved two ways (it is Premium on LeetCode, so we practise on free equivalents), and the overflow trap that sinks Java solutions to Minimum Arrows.</p>

<h3>The everyday picture</h3>
<p>The faculty books computer labs for project teams. Team A has lab 401 from 9 to 11, team B wants it from 10 to 12 — clash. Team C wants 11 to 13: does that clash with A? In real life, no: A walks out at 11 and C walks in at 11. That is a <strong>half-open interval</strong> <code>[start, end)</code> — it includes its start and excludes its end — and it is how calendars, bookings and most time ranges in code behave. But "balloons from x = 1 to x = 2 and from 2 to 3 can be popped by one arrow at x = 2" treats both ends as included: a <strong>closed interval</strong> <code>[start, end]</code>. Same numbers, different answer. Always ask, or read the examples, before writing a single comparison.</p>
<p>The test itself is one line. Two half-open intervals a and b overlap exactly when <code>a.start &lt; b.end &amp;&amp; b.start &lt; a.end</code> ("each one starts before the other ends"). For closed intervals, replace both <code>&lt;</code> with <code>≤</code>. It is easier to remember through its negation: they do <em>not</em> overlap when one ends before (or, half-open, exactly when) the other starts.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">merge / insert</span><span class="lz-t">sort by START</span><span class="lz-d">extend the last kept interval or start a new one</span></div>
  <div class="lz-step"><span class="lz-k">keep the most / fewest points</span><span class="lz-t">sort by END</span><span class="lz-d">greedy: whoever finishes first leaves the most room</span></div>
  <div class="lz-step"><span class="lz-k">how many at once</span><span class="lz-t">sort EVENTS</span><span class="lz-d">+1 at a start, −1 at an end; or a heap of end times</span></div>
  <div class="lz-step"><span class="lz-k">two sorted lists</span><span class="lz-t">two pointers</span><span class="lz-d">advance the one that ends first</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Bài toán khoảng: gộp, chèn, xếp lịch, đếm số phòng</h2>
<p class="lead">Lịch họp, đặt phòng, ca làm việc, đoạn video, dải địa chỉ IP, sprint trên dòng thời gian — một phần đáng ngạc nhiên của phần mềm thật xoay quanh <strong>khoảng</strong> (interval), và một họ câu hỏi phỏng vấn nổi tiếng cũng vậy. Chúng trông khác nhau nhưng đứng trên hai thứ: <em>một</em> phép kiểm chồng lấn (overlap) — mà đề quyết định trường hợp "chạm mép" tính thế nào — và cách <em>sắp xếp</em> đúng: theo điểm đầu khi gộp, theo điểm cuối khi chọn, theo thời điểm sự kiện khi đếm. Bài này cho bạn bốn họ bài, lập luận tham lam đứng sau "sắp theo điểm cuối", bài Meeting Rooms II nổi tiếng giải hai cách (trên LeetCode nó là Premium nên ta luyện trên các bản miễn phí tương đương), và cái bẫy tràn số đánh chìm lời giải Java của Minimum Arrows.</p>

<h3>Hình dung đời thường</h3>
<p>Khoa đặt phòng lab cho các nhóm làm dự án. Nhóm A giữ lab 401 từ 9 giờ tới 11 giờ, nhóm B muốn từ 10 tới 12 — trùng. Nhóm C muốn từ 11 tới 13: có trùng với A không? Ngoài đời thì không: A ra khỏi phòng lúc 11 và C bước vào lúc 11. Đó là <strong>khoảng nửa mở</strong> (half-open interval) <code>[start, end)</code> — chứa điểm đầu, không chứa điểm cuối — và là cách lịch, đặt chỗ và hầu hết khoảng thời gian trong code vận hành. Nhưng "quả bóng từ x = 1 tới x = 2 và quả từ 2 tới 3 có thể bắn thủng bằng một mũi tên ở x = 2" lại coi cả hai đầu đều thuộc khoảng: <strong>khoảng đóng</strong> (closed interval) <code>[start, end]</code>. Cùng những con số, đáp án khác nhau. Luôn hỏi, hoặc đọc kỹ ví dụ, trước khi viết bất kỳ phép so sánh nào.</p>
<p>Bản thân phép kiểm chỉ một dòng. Hai khoảng nửa mở a và b chồng lấn đúng khi <code>a.start &lt; b.end &amp;&amp; b.start &lt; a.end</code> ("mỗi khoảng bắt đầu trước khi khoảng kia kết thúc"). Với khoảng đóng, thay cả hai <code>&lt;</code> bằng <code>≤</code>. Dễ nhớ hơn qua mệnh đề phủ định: chúng KHÔNG chồng lấn khi một khoảng kết thúc trước (hoặc, với nửa mở, đúng lúc) khoảng kia bắt đầu.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">gộp / chèn</span><span class="lz-t">sắp theo ĐẦU</span><span class="lz-d">nới khoảng cuối đã giữ hoặc mở khoảng mới</span></div>
  <div class="lz-step"><span class="lz-k">giữ nhiều nhất / ít điểm nhất</span><span class="lz-t">sắp theo CUỐI</span><span class="lz-d">tham lam: ai xong sớm nhất chừa nhiều chỗ nhất</span></div>
  <div class="lz-step"><span class="lz-k">cùng lúc có bao nhiêu</span><span class="lz-t">sắp SỰ KIỆN</span><span class="lz-d">+1 lúc bắt đầu, −1 lúc kết thúc; hoặc heap giờ kết thúc</span></div>
  <div class="lz-step"><span class="lz-k">hai danh sách đã sắp</span><span class="lz-t">hai con trỏ</span><span class="lz-d">tiến con trỏ của khoảng kết thúc trước</span></div>
</div>
${csd('csd201-slide-cs5-1', 'vi', 'CS.5 Tham lam: xếp lịch khoảng, phòng họp', '<p>Phần chuyên sâu CS.5 chứng minh vì sao tham lam theo điểm kết thúc sớm nhất cho số khoảng không chồng lấn nhiều nhất (lập luận đổi chỗ — exchange argument), và giới thiệu bài phòng họp. <strong>Ở đây đi sâu thêm:</strong> phân biệt khoảng nửa mở/đóng theo từng đề, hai cách đếm phòng (heap và quét), bẫy tràn số của comparator, và cách hệ thống đặt lịch thật chống đặt trùng.</p>')}
</div>

<div class="ml-en">
<h3>Signals: when it is an interval problem</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pairs [start, end], "meetings", "bookings", "ranges", "segments", "balloons"</span><span class="v">The input is already intervals — decide half-open vs closed first.</span></div>
  <div class="kv"><span class="k">"merge", "union", "free time", "covered length"</span><span class="v">Sort by start and sweep once.</span></div>
  <div class="kv"><span class="k">"maximum number of non-overlapping", "minimum to remove", "minimum points/arrows"</span><span class="v">Greedy by earliest end.</span></div>
  <div class="kv"><span class="k">"minimum rooms / platforms / groups", "maximum at the same time", "capacity never exceeded"</span><span class="v">Count simultaneous intervals: sweep +1/−1 or a min-heap of end times; small coordinates ⇒ difference array.</span></div>
  <div class="kv"><span class="k">n up to 10⁵</span><span class="v">Pairwise comparison is O(n²) = 10¹⁰: too slow. Everything here is O(n log n), dominated by the sort.</span></div>
</div>
</div>
<div class="ml-vi">
<h3>Dấu hiệu nhận ra: khi nào là bài toán khoảng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">các cặp [start, end], "cuộc họp", "lượt đặt", "dải", "đoạn", "quả bóng"</span><span class="v">Đầu vào đã là khoảng — việc đầu tiên là quyết định nửa mở hay đóng.</span></div>
  <div class="kv"><span class="k">"gộp", "hợp", "thời gian rảnh", "tổng độ dài được phủ"</span><span class="v">Sắp theo điểm đầu rồi quét một lượt.</span></div>
  <div class="kv"><span class="k">"nhiều nhất bao nhiêu khoảng không chồng lấn", "ít nhất phải bỏ", "ít nhất bao nhiêu điểm/mũi tên"</span><span class="v">Tham lam theo điểm kết thúc sớm nhất.</span></div>
  <div class="kv"><span class="k">"ít nhất bao nhiêu phòng / sân ga / nhóm", "cùng lúc nhiều nhất bao nhiêu", "không bao giờ quá sức chứa"</span><span class="v">Đếm số khoảng đồng thời: quét +1/−1 hoặc min-heap giờ kết thúc; toạ độ nhỏ ⇒ mảng hiệu.</span></div>
  <div class="kv"><span class="k">n tới 10⁵</span><span class="v">So từng cặp là O(n²) = 10¹⁰: quá chậm. Mọi thứ trong bài này là O(n log n), phần lớn chi phí là phép sắp xếp.</span></div>
</div>
</div>

<div class="ml-en">
<h3>The foundation: one overlap test, and who decides about touching</h3>
</div>
<div class="ml-vi">
<h3>Nền móng: một phép kiểm chồng lấn, và ai quyết định chuyện chạm mép</h3>
</div>
${maHai('ch06/khoang-co-ban.ts', 'ch06/KhoangCoBan.java', { vung: 'overlap' })}
${maHai('ch06/khoang-co-ban.ts', 'ch06/KhoangCoBan.java', { vung: 'canattend' })}
${ketQua('ch06/khoang-co-ban.ts')}
<div class="ml-en">
<p>Row one is the whole lesson in miniature: <code>[9,11]</code> and <code>[11,13]</code> do not clash as bookings (half-open) but do clash as closed intervals. Row two is containment — one interval inside the other is still an overlap, and the one-line test catches it without a special case. <code>canAttendMeetings</code> is LeetCode 252 (Premium): after sorting by start, only <em>neighbours</em> can clash first, so one pass suffices — O(n log n).</p>
<p>How the well-known problems treat touching endpoints — memorise the pattern, not the list:</p>
<table>
<thead><tr><th>Problem</th><th>Touching ends</th><th>Why</th></tr></thead>
<tbody>
<tr><td>56 Merge / 57 Insert</td><td>merge them</td><td>[1,4] and [4,5] become [1,5] — "covered" ranges</td></tr>
<tr><td>252 / 253 Meeting Rooms</td><td>no clash</td><td>half-open: a room is free the moment a meeting ends</td></tr>
<tr><td>435 Non-overlapping</td><td>no clash</td><td>[1,2] and [2,3] may both stay</td></tr>
<tr><td>452 Arrows</td><td>clash (share an arrow)</td><td>closed: x = 2 is inside both [1,2] and [2,3]</td></tr>
<tr><td>2406 Min Groups</td><td>clash</td><td>closed: [1,5] and [5,8] intersect at 5</td></tr>
<tr><td>986 Intersections</td><td>clash</td><td>closed: the intersection [5,5] is reported</td></tr>
<tr><td>1094 Car Pooling</td><td>no clash</td><td>passengers get out at "to" before others get in</td></tr>
</tbody></table>
</div>
<div class="ml-vi">
<p>Dòng một là cả bài học thu nhỏ: <code>[9,11]</code> và <code>[11,13]</code> không trùng nếu là lượt đặt phòng (nửa mở) nhưng lại trùng nếu là khoảng đóng. Dòng hai là quan hệ chứa nhau — một khoảng nằm trọn trong khoảng kia vẫn là chồng lấn, và phép kiểm một dòng bắt được mà không cần trường hợp riêng. <code>canAttendMeetings</code> là LeetCode 252 (Premium): sau khi sắp theo điểm đầu, chỉ những khoảng <em>kề nhau</em> mới có thể trùng trước tiên, nên một lượt là đủ — O(n log n).</p>
<p>Các đề quen thuộc xử lý chuyện chạm mép thế nào — hãy nhớ quy luật, đừng học thuộc danh sách:</p>
<table>
<thead><tr><th>Đề</th><th>Chạm mép</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>56 Merge / 57 Insert</td><td>gộp lại</td><td>[1,4] và [4,5] thành [1,5] — dải "được phủ"</td></tr>
<tr><td>252 / 253 Meeting Rooms</td><td>không trùng</td><td>nửa mở: phòng trống ngay khi cuộc họp kết thúc</td></tr>
<tr><td>435 Non-overlapping</td><td>không trùng</td><td>[1,2] và [2,3] được giữ cả hai</td></tr>
<tr><td>452 Arrows</td><td>trùng (chung một mũi tên)</td><td>đóng: x = 2 nằm trong cả [1,2] lẫn [2,3]</td></tr>
<tr><td>2406 Min Groups</td><td>trùng</td><td>đóng: [1,5] và [5,8] giao nhau tại 5</td></tr>
<tr><td>986 Intersections</td><td>trùng</td><td>đóng: phần giao [5,5] được báo ra</td></tr>
<tr><td>1094 Car Pooling</td><td>không trùng</td><td>khách xuống ở điểm "to" trước khi người khác lên</td></tr>
</tbody></table>
</div>

<div class="ml-en">
<h3>Family 1 — merge and insert (sort by start)</h3>
<p>Merging overlapping intervals you already did in lesson 1.3: sort by start, then each interval either extends the last merged one or starts a new one. Its sibling <strong>Insert Interval</strong> gives you a list that is <em>already</em> sorted and disjoint plus one new interval. Sorting again would be O(n log n); the list's order lets you do it in one O(n) pass with three phases: copy everything that ends before the new one starts; swallow everything that starts before the (growing) new one ends; copy the rest.</p>
</div>
<div class="ml-vi">
<h3>Họ 1 — gộp và chèn (sắp theo điểm đầu)</h3>
<p>Gộp các khoảng chồng lấn bạn đã làm ở <a href="${baiNay('dsa-1-3-sap-xep')}">bài 1.3</a>: sắp theo điểm đầu, rồi mỗi khoảng hoặc nới khoảng đã gộp cuối cùng, hoặc mở một khoảng mới. Bài anh em <strong>Insert Interval</strong> cho bạn một danh sách <em>đã</em> sắp và rời nhau, cộng một khoảng mới. Sắp lại sẽ tốn O(n log n); thứ tự sẵn có cho phép làm trong một lượt O(n) với ba pha: chép mọi khoảng kết thúc trước khi khoảng mới bắt đầu; nuốt mọi khoảng bắt đầu trước khi khoảng mới (đang lớn dần) kết thúc; chép phần còn lại.</p>
</div>
${maHai('ch06/insert-interval.ts', 'ch06/InsertInterval.java', { vung: 'giai' })}
${ketQua('ch06/insert-interval.ts')}
<div class="ml-en">
<p>Phase conditions are where people slip. Phase 1 uses <code>intervals[i][1] &lt; s</code>: strictly before, so <code>[1,3]</code> with new <code>[3,6]</code> is <em>not</em> copied — it touches, and LC 57 merges touching intervals (row 4 swallows both neighbours into <code>[1,9]</code>). Phase 2 uses <code>intervals[i][0] &lt;= e</code> with the <em>updated</em> e, so a chain of overlaps is absorbed in one loop. The empty list (row 5) needs no special case.</p>
</div>
<div class="ml-vi">
<p>Điều kiện của từng pha là chỗ hay trượt. Pha 1 dùng <code>intervals[i][1] &lt; s</code>: trước hẳn, nên <code>[1,3]</code> với khoảng mới <code>[3,6]</code> KHÔNG bị chép đi — nó chạm mép, và LC 57 gộp các khoảng chạm mép (dòng 4 nuốt cả hai láng giềng thành <code>[1,9]</code>). Pha 2 dùng <code>intervals[i][0] &lt;= e</code> với e <em>đã cập nhật</em>, nên một chuỗi chồng lấn nối tiếp được hấp thụ trong một vòng lặp. Danh sách rỗng (dòng 5) không cần trường hợp riêng.</p>
</div>

<div class="ml-en">
<h3>Family 2 — choose the most (sort by end): Non-overlapping Intervals and Minimum Arrows</h3>
<p><strong>Non-overlapping Intervals:</strong> remove the fewest intervals so the rest do not overlap — equivalently, keep the most. <strong>Greedy:</strong> sort by end; keep an interval if it starts at or after the end of the last kept one; otherwise drop it. Why by end and not by start? Sort <code>[[1,10],[2,3],[4,5],[6,7]]</code> by start and the greedy keeps <code>[1,10]</code> first, which blocks the three short ones: it keeps 1 instead of 3. The <strong>exchange argument</strong> (CSD201 CS.5): take any optimal selection; its first interval ends no earlier than the earliest-ending interval overall, so swapping it for the earliest-ending one keeps the selection valid and the same size. Repeat for the rest. "Whoever finishes first leaves the most room" is the sentence to say.</p>
<p><strong>Minimum Arrows</strong> is the same greedy from the other side: each kept interval is where an arrow is shot (at its end), every interval that starts at or before that point is burst by it. The only differences are closed intervals (<code>start &gt; shotAt</code> to need a new arrow) and that the answer counts kept intervals instead of removed ones.</p>
</div>
<div class="ml-vi">
<h3>Họ 2 — chọn được nhiều nhất (sắp theo điểm cuối): Non-overlapping Intervals và Minimum Arrows</h3>
<p><strong>Non-overlapping Intervals:</strong> bỏ ít khoảng nhất để phần còn lại không chồng lấn — tương đương giữ lại nhiều nhất. <strong>Tham lam (greedy):</strong> sắp theo điểm cuối; giữ một khoảng nếu nó bắt đầu từ (hoặc sau) điểm cuối của khoảng vừa giữ; ngược lại thì bỏ. Vì sao theo điểm cuối mà không theo điểm đầu? Sắp <code>[[1,10],[2,3],[4,5],[6,7]]</code> theo điểm đầu thì tham lam giữ <code>[1,10]</code> trước, và nó chắn cả ba khoảng ngắn: giữ được 1 thay vì 3. <strong>Lập luận đổi chỗ</strong> (exchange argument — CSD201 CS.5): lấy một lựa chọn tối ưu bất kỳ; khoảng đầu tiên của nó kết thúc không sớm hơn khoảng kết thúc sớm nhất trong toàn bộ, nên đổi nó lấy khoảng kết thúc sớm nhất vẫn giữ lựa chọn hợp lệ và cùng kích thước. Lặp lại cho phần còn lại. Câu để nói ra: "ai xong sớm nhất chừa lại nhiều chỗ nhất".</p>
<p><strong>Minimum Arrows</strong> là cùng kiểu tham lam nhìn từ phía bên kia: mỗi khoảng được giữ là chỗ bắn một mũi tên (tại điểm cuối của nó), mọi khoảng bắt đầu tại hoặc trước điểm đó đều bị bắn thủng. Khác biệt duy nhất là khoảng đóng (cần mũi tên mới khi <code>start &gt; shotAt</code>), và đáp án đếm số khoảng được giữ thay vì số bị bỏ.</p>
</div>
${maHai('ch06/non-overlap.ts', 'ch06/NonOverlap.java', { vung: 'erase' })}
${maHai('ch06/non-overlap.ts', 'ch06/NonOverlap.java', { vung: 'arrows' })}
${ketQua('ch06/non-overlap.ts')}
<div class="ml-en">
<p>Row 4 is the counter-example above: by end, the greedy keeps [2,3], [4,5], [6,7] and removes only [1,10]; three arrows. Row 3 shows the touching rule from both sides: <code>[2,4]</code> and <code>[4,7]</code> are fine for 435 (0 removed) and share one arrow for 452. Both functions start from <code>-Infinity</code> / <code>Long.MIN_VALUE</code> rather than "the first interval" — no special case for the first element, and no collision with real inputs that can be as low as −2³¹.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap: the comparator <code>a[1] - b[1]</code> on balloons near ±2³¹.</strong></p><p>LeetCode 452 deliberately tests coordinates at the limits of <code>int</code>:</p></div>
</div>
<div class="ml-vi">
<p>Dòng 4 chính là phản ví dụ ở trên: sắp theo điểm cuối, tham lam giữ [2,3], [4,5], [6,7] và chỉ bỏ [1,10]; ba mũi tên. Dòng 3 cho thấy luật chạm mép từ hai phía: <code>[2,4]</code> và <code>[4,7]</code> hợp lệ với 435 (bỏ 0) và chung một mũi tên với 452. Cả hai hàm bắt đầu từ <code>-Infinity</code> / <code>Long.MIN_VALUE</code> thay vì "khoảng đầu tiên" — không cần trường hợp riêng cho phần tử đầu, và không đụng với đầu vào thật có thể thấp tới −2³¹.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy: comparator <code>a[1] - b[1]</code> trên các quả bóng sát ±2³¹.</strong></p><p>LeetCode 452 cố tình test toạ độ ở giới hạn của <code>int</code>:</p></div>
</div>
${ma('ch06/ArrowsTran.java', { vung: 'tran', nhan: 'Java' })}
${ketQua('ch06/ArrowsTran.java')}
<div class="ml-en">
<p>−2,147,483,645 − 2,147,483,647 wraps around to <strong>+4</strong>, so the comparator says the balloon on the far left ends <em>after</em> the one on the far right. Sorted backwards, the greedy shoots at 2,147,483,647, sees the left balloon "start before" that point, and counts one arrow for two balloons four billion units apart. Same disease as lesson 6.1's priority queue, same cure: <code>Integer.compare</code>. And the initial <code>shotAt</code> must be a <code>long</code> below every <code>int</code>; starting it at <code>Integer.MIN_VALUE</code> would wrongly treat a balloon starting at −2³¹ as already burst.</p>
</div>
<div class="ml-vi">
<p>−2.147.483.645 − 2.147.483.647 quay vòng thành <strong>+4</strong>, nên comparator khẳng định quả bóng tận bên trái kết thúc <em>sau</em> quả tận bên phải. Sắp ngược, tham lam bắn ở 2.147.483.647, thấy quả bên trái "bắt đầu trước" điểm đó, và đếm một mũi tên cho hai quả bóng cách nhau bốn tỷ đơn vị. Cùng căn bệnh với hàng đợi ưu tiên ở bài 6.1, cùng thuốc chữa: <code>Integer.compare</code>. Và <code>shotAt</code> ban đầu phải là một <code>long</code> nhỏ hơn mọi <code>int</code>; khởi tạo bằng <code>Integer.MIN_VALUE</code> sẽ coi nhầm một quả bóng bắt đầu ở −2³¹ là đã bị bắn thủng.</p>
</div>

<div class="ml-en">
<h3>Worked example: how many rooms? (Meeting Rooms II, and its free twins)</h3>
<p><strong>Problem (in our words).</strong> Given booking intervals, return the minimum number of rooms so that no two bookings in the same room overlap. On LeetCode this is problem 253, Premium. Free equivalents to submit: <strong>LC 2406 Divide Intervals Into Minimum Number of Groups</strong> (identical idea, but intervals are <em>closed</em>: sharing an endpoint is a clash) and LintCode 919 Meeting Rooms II (half-open, like 253).</p>
<p><strong>Brute force.</strong> The answer is the maximum number of bookings in progress at any moment. Check every start time against every booking: O(n²). Fine for 50 bookings, too slow for 10⁵.</p>
<p><strong>Way 1 — sort by start + min-heap of end times.</strong> Process bookings in order of start. The heap holds, for each room already opened, the time it becomes free. For the next booking, look at the room that frees up <em>earliest</em> (the heap top): if it is free by the booking's start, reuse it (pop); otherwise open a new room. Either way push this booking's end. The heap's final size is the number of rooms ever opened. O(n log n).</p>
<p><strong>Way 2 — sweep line.</strong> Turn each booking into two events: +1 at its start, −1 at its end. Sort events by time, and at equal times put −1 <em>first</em> (half-open: a room freed at 11 can be taken at 11). Walk the events with a running count; the maximum count is the answer. O(n log n), no heap, and it generalises to "capacity" problems where each interval carries a weight.</p>
</div>
<div class="ml-vi">
<h3>Ví dụ giải mẫu: cần bao nhiêu phòng? (Meeting Rooms II, và các bản sinh đôi miễn phí)</h3>
<p><strong>Đề (diễn đạt lại).</strong> Cho các khoảng đặt phòng, trả về số phòng tối thiểu sao cho không có hai lượt đặt nào cùng phòng bị chồng lấn. Trên LeetCode đây là đề 253, Premium. Bản miễn phí tương đương để nộp: <strong>LC 2406 Divide Intervals Into Minimum Number of Groups</strong> (ý tưởng y hệt, nhưng khoảng là <em>đóng</em>: chung một mép là trùng) và LintCode 919 Meeting Rooms II (nửa mở, giống 253).</p>
<p><strong>Vét cạn.</strong> Đáp án là số lượt đặt đang diễn ra cùng lúc nhiều nhất tại một thời điểm nào đó. Kiểm mọi thời điểm bắt đầu với mọi lượt đặt: O(n²). Ổn với 50 lượt, quá chậm với 10⁵.</p>
<p><strong>Cách 1 — sắp theo điểm đầu + min-heap giờ kết thúc.</strong> Duyệt các lượt đặt theo thứ tự giờ bắt đầu. Heap giữ, với mỗi phòng đã mở, thời điểm phòng đó trống. Với lượt tiếp theo, nhìn vào phòng trống <em>sớm nhất</em> (đỉnh heap): nếu nó trống kịp giờ bắt đầu thì dùng lại (pop); không thì mở phòng mới. Dù thế nào cũng push giờ kết thúc của lượt này. Kích thước cuối cùng của heap là số phòng đã từng mở. O(n log n).</p>
<p><strong>Cách 2 — đường quét (sweep line).</strong> Biến mỗi lượt đặt thành hai sự kiện: +1 lúc bắt đầu, −1 lúc kết thúc. Sắp sự kiện theo thời gian, bằng giờ thì đặt −1 <em>trước</em> (nửa mở: phòng được trả lúc 11 thì lấy được ngay lúc 11). Đi qua các sự kiện với một bộ đếm chạy; giá trị lớn nhất của bộ đếm là đáp án. O(n log n), không cần heap, và mở rộng được cho bài "sức chứa" khi mỗi khoảng mang một trọng số.</p>
</div>
${maHai('ch06/min-groups.ts', 'ch06/MinGroups.java', { vung: 'heap' })}
${maHai('ch06/min-groups.ts', 'ch06/MinGroups.java', { vung: 'sweep' })}
${ketQua('ch06/min-groups.ts')}
${ketQua('ch06/MinGroups.java')}
<div class="ml-en">
<p>The lab bookings need <strong>2</strong> rooms as half-open meetings but <strong>3</strong> groups as closed intervals: at time 10, <code>[9,10]</code>, <code>[9,11]</code> and <code>[10,12]</code> all contain the point 10. The code switches between the two meanings in exactly one place each: <code>&lt;</code> vs <code>&lt;=</code> in the heap test, and <code>end</code> vs <code>end + 1</code> in the sweep (for integer coordinates, a closed interval ending at 10 frees its room at 11). The Java sweep uses <code>long</code> events so that <code>end + 1</code> cannot overflow at 2³¹ − 1. Last row: two identical one-point intervals <code>[4,4]</code> need 2 groups.</p>
<h3>Watch it run — both ways on the lab bookings</h3>
<p>Way 1, the heap of room free times (shown sorted; blue = top, the earliest free room; orange = the end just pushed):</p>
</div>
<div class="ml-vi">
<p>Các lượt đặt lab cần <strong>2</strong> phòng nếu hiểu là cuộc họp nửa mở, nhưng <strong>3</strong> nhóm nếu là khoảng đóng: tại thời điểm 10, cả <code>[9,10]</code>, <code>[9,11]</code> và <code>[10,12]</code> đều chứa điểm 10. Code chuyển giữa hai nghĩa đúng ở một chỗ mỗi cách: <code>&lt;</code> hay <code>&lt;=</code> ở phép kiểm của heap, và <code>end</code> hay <code>end + 1</code> ở phép quét (với toạ độ nguyên, khoảng đóng kết thúc ở 10 trả phòng lúc 11). Bản quét Java dùng sự kiện kiểu <code>long</code> để <code>end + 1</code> không tràn ở 2³¹ − 1. Dòng cuối: hai khoảng một điểm giống hệt nhau <code>[4,4]</code> cần 2 nhóm.</p>
<h3>Xem nó chạy — cả hai cách trên các lượt đặt lab</h3>
<p>Cách 1, heap giờ trả phòng (in đã sắp; xanh dương = đỉnh, phòng trống sớm nhất; cam = giờ kết thúc vừa được push):</p>
</div>
${BANG_HEAP}
<div class="ml-en">
<p>Only the second booking <code>[9,10)</code> opens a new room — when it arrives, the earliest room is busy until 11. Every later booking finds a room that is already free: <code>[10,12)</code> takes the room <code>[9,10)</code> just left at 10, and so on. Way 2, the sweep over the 10 sorted events:</p>
</div>
<div class="ml-vi">
<p>Chỉ lượt thứ hai <code>[9,10)</code> phải mở phòng mới — lúc nó tới, phòng sớm nhất còn bận tới 11. Mọi lượt sau đều tìm được phòng đã trống: <code>[10,12)</code> lấy đúng phòng mà <code>[9,10)</code> vừa trả lúc 10, và cứ thế. Cách 2, quét qua 10 sự kiện đã sắp:</p>
</div>
${BANG_QUET}
<div class="ml-en">
<p>At t = 10 and t = 11 the <em>end</em> is processed before the <em>start</em>, so the count dips to 1 before climbing back to 2; it never reaches 3. Flip the tie rule and both of those moments would read 3 — the closed-interval answer. Both tables reach the same maximum, 2, from different directions: the heap counts rooms, the sweep counts people in rooms.</p>
${moPhong('ch06/sweep.sim.js', 'en', 'Sweep line — how many rooms at once', 'The 10 sorted events and a bar for the running count after each one; ties process END before START.')}
</div>
<div class="ml-vi">
<p>Tại t = 10 và t = 11 sự kiện <em>kết thúc</em> được xử lý trước sự kiện <em>bắt đầu</em>, nên bộ đếm tụt về 1 rồi mới lên lại 2; nó không bao giờ chạm 3. Lật luật hoà và cả hai thời điểm đó sẽ đọc ra 3 — đáp án của khoảng đóng. Hai bảng tới cùng giá trị lớn nhất, 2, từ hai hướng: heap đếm phòng, phép quét đếm số cuộc họp đang ở trong phòng.</p>
${moPhong('ch06/sweep.sim.js', 'vi', 'Đường quét — cùng lúc cần bao nhiêu phòng', '10 sự kiện đã sắp và một cột cho bộ đếm sau mỗi sự kiện; bằng giờ thì xử lý KẾT THÚC trước BẮT ĐẦU.')}
</div>

<div class="ml-en">
<h3>Variant 1 — Car Pooling: the sweep without sorting</h3>
<p>A car with <code>capacity</code> seats drives east; each trip says "num passengers from kilometre <code>from</code> to <code>to</code>". Can it serve all trips? This is the sweep with weights (+num, −num). The twist: kilometres are between 0 and 1000, so instead of sorting events we drop them into an array indexed by kilometre — the <strong>difference array</strong> of lesson 1.2 — and a prefix sum gives the load at every point. O(n + 1001), no sort.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 1 — Car Pooling: phép quét không cần sắp xếp</h3>
<p>Một chiếc xe <code>capacity</code> chỗ chạy về hướng đông; mỗi chuyến nói "num khách từ km <code>from</code> tới km <code>to</code>". Xe có chở hết được không? Đây là phép quét có trọng số (+num, −num). Điểm khác: số km nằm trong 0 tới 1000, nên thay vì sắp sự kiện, ta thả chúng vào một mảng đánh chỉ số theo km — <strong>mảng hiệu</strong> (difference array) của <a href="${baiNay('dsa-1-2-prefix-sum')}">bài 1.2</a> — và một lượt cộng dồn (prefix sum) cho ra tải trọng tại mọi điểm. O(n + 1001), không sắp xếp.</p>
</div>
${maHai('ch06/car-pooling.ts', 'ch06/CarPooling.java', { vung: 'giai' })}
${ketQua('ch06/car-pooling.ts')}
<div class="ml-en">
<p>Rows 1 and 2 differ only in whether the second group boards at kilometre 4 (while the first group, 3 people, is still inside: 5 &gt; 4) or at kilometre 6 (exactly when the first group gets out — half-open, so 3 then 2, never 5). The choice "sort events or index an array" is one you should say out loud: sorting works for any coordinates; the array needs a small known range but is linear.</p>
</div>
<div class="ml-vi">
<p>Dòng 1 và 2 chỉ khác ở chỗ nhóm thứ hai lên xe ở km 4 (khi nhóm đầu, 3 người, vẫn còn trên xe: 5 &gt; 4) hay ở km 6 (đúng lúc nhóm đầu xuống — nửa mở, nên 3 rồi 2, không bao giờ 5). Lựa chọn "sắp sự kiện hay đánh chỉ số mảng" là điều nên nói to ra: sắp xếp chạy với mọi toạ độ; mảng cần miền nhỏ biết trước nhưng tuyến tính.</p>
</div>

<div class="ml-en">
<h3>Variant 2 — Interval List Intersections: two pointers</h3>
<p>Two lists, each sorted and pairwise disjoint (two people's free slots); return all their intersections. The intersection of two closed intervals is <code>[max(starts), min(ends)]</code> if that is non-empty. Then advance whichever interval ends first — it cannot meet anything else in the other list, because everything after it in the other list starts later. O(m + n), the merge step of merge sort in disguise.</p>
</div>
<div class="ml-vi">
<h3>Biến thể 2 — Interval List Intersections: hai con trỏ</h3>
<p>Hai danh sách, mỗi danh sách đã sắp và các khoảng rời nhau (giờ rảnh của hai người); trả về mọi phần giao. Phần giao của hai khoảng đóng là <code>[max(điểm đầu), min(điểm cuối)]</code> nếu nó không rỗng. Rồi tiến con trỏ của khoảng nào kết thúc trước — nó không thể gặp thêm gì ở danh sách kia, vì mọi khoảng sau đó trong danh sách kia đều bắt đầu muộn hơn. O(m + n), chính là bước trộn của merge sort đội lốt.</p>
</div>
${maHai('ch06/intersections.ts', 'ch06/Intersections.java', { vung: 'giai' })}
${ketQua('ch06/intersections.ts')}

<div class="ml-en">
<h3>Where intervals live in real systems</h3>
<ul>
<li><strong>The CT Work calendar feed on this website</strong> (<code>src/services/work/calendar.service.ts</code>, around line 138) selects the sprints to show in a date window with <code>startAt: { lte: to }, endAt: { gte: from }</code> — that is exactly <code>overlapsClosed(sprint, window)</code> written as a Prisma/SQL condition, and it correctly includes a sprint that started before the window and is still running. In <code>meetingFeedLines()</code> of the same file, meetings are selected with <code>startsAt: { gte: from, lte: to }</code> — "starts inside the window", a different and narrower question. Both are reasonable; the skill is knowing which one you wrote.</li>
<li><strong>Validation before any sweep.</strong> <code>meetingTimeError()</code> in <code>src/services/work/governance.ts</code> rejects a meeting unless it ends after it starts, and caps it at 24 hours. Every interval algorithm in this lesson silently assumes <code>start &lt; end</code>; a reversed interval turns a +1/−1 sweep into nonsense. Validate at the boundary.</li>
<li><strong>Double booking is a database problem.</strong> CT Work, like Google Calendar, lets a person be invited to overlapping meetings — a calendar is a record, not a lock. A room-booking system must <em>refuse</em> overlaps, and "check with a query, then insert" has a race: two requests both see the room free and both insert. PostgreSQL solves it in the schema: a <code>tstzrange</code> column with an <code>EXCLUDE USING gist (room WITH =, during WITH &amp;&amp;)</code> constraint, where <code>&amp;&amp;</code> is the overlap test and ranges are half-open <code>[)</code> by default — the same choice as this lesson.</li>
<li><strong>Elsewhere:</strong> merging IP ranges in firewall rules, coalescing free disk extents, video editors joining clips, "busy/free" lookups when you schedule a meeting with five people (Interval List Intersections over five lists).</li>
</ul>
</div>
<div class="ml-vi">
<h3>Khoảng sống ở đâu trong hệ thống thật</h3>
<ul>
<li><strong>Lịch đồng bộ (calendar feed) của CT Work trên chính trang này</strong> (<code>src/services/work/calendar.service.ts</code>, quanh dòng 138) chọn các sprint để hiện trong một cửa sổ ngày bằng <code>startAt: { lte: to }, endAt: { gte: from }</code> — đó chính là <code>overlapsClosed(sprint, cửa sổ)</code> viết thành điều kiện Prisma/SQL, và nó lấy đúng cả sprint bắt đầu trước cửa sổ mà vẫn đang chạy. Trong hàm <code>meetingFeedLines()</code> của cùng tệp, các cuộc họp được chọn bằng <code>startsAt: { gte: from, lte: to }</code> — "bắt đầu bên trong cửa sổ", một câu hỏi khác và hẹp hơn. Cả hai đều hợp lý; kỹ năng là biết mình đang viết câu nào.</li>
<li><strong>Kiểm tra dữ liệu trước mọi phép quét.</strong> <code>meetingTimeError()</code> trong <code>src/services/work/governance.ts</code> từ chối một cuộc họp nếu nó không kết thúc sau khi bắt đầu, và giới hạn tối đa 24 giờ. Mọi thuật toán khoảng trong bài này đều ngầm giả định <code>start &lt; end</code>; một khoảng bị đảo ngược biến phép quét +1/−1 thành vô nghĩa. Kiểm ngay tại biên.</li>
<li><strong>Đặt trùng là bài toán của cơ sở dữ liệu.</strong> CT Work, giống Google Calendar, cho phép một người được mời vào các cuộc họp chồng giờ — lịch là bản ghi, không phải ổ khoá. Hệ thống đặt phòng thì phải <em>từ chối</em> chồng lấn, và kiểu "truy vấn kiểm tra rồi mới insert" có lỗi tranh chấp (race condition): hai request cùng thấy phòng trống và cùng insert. PostgreSQL giải ngay trong schema: một cột <code>tstzrange</code> với ràng buộc <code>EXCLUDE USING gist (room WITH =, during WITH &amp;&amp;)</code>, trong đó <code>&amp;&amp;</code> là phép kiểm chồng lấn và dải mặc định là nửa mở <code>[)</code> — đúng lựa chọn của bài này.</li>
<li><strong>Chỗ khác:</strong> gộp dải IP trong luật tường lửa, gom các vùng trống trên đĩa, trình dựng video nối các đoạn clip, tra "bận/rảnh" khi xếp một cuộc họp với năm người (Interval List Intersections trên năm danh sách).</li>
</ul>
</div>

<div class="ml-en">
<h3>🕵️ The attacker's view: holding rooms you will not use</h3>
<ul>
<li><strong>Placeholder bookings.</strong> The cheapest attack on a booking system is not a hack at all: book every lab slot for the week "just in case", then cancel at the last minute — or never show up. The algorithm is happy; the other teams have no rooms. Defences are policy encoded in code: a cap on simultaneous future bookings per user (a sweep over <em>that user's</em> intervals), holds that expire unless confirmed, no-show penalties, and limits on how far ahead one may book.</li>
<li><strong>The giant interval.</strong> A single booking <code>[0, 10¹⁸)</code> blocks a room forever and may overflow arithmetic downstream. A maximum duration (CT Work's 24-hour cap) and a maximum date range close it.</li>
<li><strong>Reversed or zero-length intervals.</strong> <code>end &lt; start</code> produces a −1 before its +1; in a sweep that lowers the running count and can hide a real clash elsewhere — an attacker who can submit such a booking may squeeze an overlapping booking past a naive capacity check. Reject at input.</li>
<li><strong>The race.</strong> Two concurrent requests for the last free slot both pass an application-level overlap check. Fix it where the data lives: an exclusion constraint or a transaction with the right isolation level, not a faster check.</li>
</ul>
</div>
<div class="ml-vi">
<h3>🕵️ Góc kẻ xấu: giữ phòng mà không dùng</h3>
<ul>
<li><strong>Đặt giữ chỗ.</strong> Cách tấn công rẻ nhất vào hệ thống đặt phòng chẳng cần hack gì: đặt hết mọi khung giờ lab trong tuần "cho chắc", rồi huỷ sát giờ — hoặc không bao giờ đến. Thuật toán vẫn vui vẻ; các nhóm khác hết phòng. Cách phòng là chính sách được mã hoá: giới hạn số lượt đặt tương lai đồng thời của mỗi người (một phép quét trên các khoảng của <em>chính người đó</em>), lượt giữ chỗ tự hết hạn nếu không xác nhận, phạt vắng mặt, và giới hạn được đặt trước xa tối đa bao lâu.</li>
<li><strong>Khoảng khổng lồ.</strong> Một lượt đặt duy nhất <code>[0, 10¹⁸)</code> chặn phòng vĩnh viễn và có thể làm tràn số ở các phép tính phía sau. Thời lượng tối đa (trần 24 giờ của CT Work) và miền ngày tối đa đóng lỗ này.</li>
<li><strong>Khoảng đảo ngược hoặc dài bằng 0.</strong> <code>end &lt; start</code> sinh ra một −1 trước +1 của nó; trong phép quét, điều đó hạ bộ đếm xuống và có thể che một chỗ trùng thật ở nơi khác — kẻ gửi được lượt đặt như vậy có thể lách một lượt đặt chồng giờ qua phép kiểm sức chứa ngây thơ. Từ chối ngay ở đầu vào.</li>
<li><strong>Tranh chấp đồng thời.</strong> Hai request đồng thời xin khung giờ trống cuối cùng đều qua được phép kiểm chồng lấn ở tầng ứng dụng. Sửa ở nơi dữ liệu sống: ràng buộc loại trừ (exclusion constraint) hoặc transaction với mức cô lập (isolation level) phù hợp, chứ không phải một phép kiểm nhanh hơn.</li>
</ul>
</div>

<div class="ml-en">
<h3>🎤 Saying it out loud: a sample exchange</h3>
${hoiThoai([
  ['I', 'Given meeting time intervals, find the minimum number of conference rooms required.'],
  ['C', 'If one meeting ends at 10 and another starts at 10, can they share a room? Are the times integers, and how many meetings?'],
  ['N', 'The touching-endpoint question changes the answer (2 vs 3 on our lab data). Asking it first is the single most valuable clarification in this family.'],
  ['I', 'Yes, they can share. Integers, up to 10⁴ meetings.'],
  ['C', 'So intervals are half-open. The answer is the maximum number of meetings in progress at once. Brute force checks each start against all meetings, O(n²). Better: sort by start and keep a min-heap of end times, one per room; for each meeting, if the earliest-ending room is free by its start I reuse it, otherwise I open a new one. O(n log n) time, O(n) space.'],
  ['N', 'Restate as "max simultaneous", give the brute force, then the heap with the reason the top is the right room to check.'],
  ['I', 'Go ahead.'],
  ['C', '(coding) Sort a copy by start… the reuse test is heap top ≤ start, less-or-equal because a room freed at 10 can be used at 10… push the end either way… return the heap size. Trace [9,11], [9,10], [10,12]: first opens room 1, second sees 11 > 9 and opens room 2, third sees 10 ≤ 10 and reuses. Two rooms. Correct.'],
  ['N', 'Narrate the one comparison that encodes the touching rule, and trace the exact case that tests it.'],
  ['I', 'Can you do it without a heap?'],
  ['C', 'Yes — a sweep: +1 at each start, −1 at each end, sort the events with ends before starts at equal times, and track the running maximum. Same O(n log n). If times were small integers, say minutes in a day, I would use a difference array and skip sorting: O(n + 1440).'],
], 'en')}
</div>
<div class="ml-vi">
<h3>🎤 Nói to lời giải: một đoạn hội thoại mẫu</h3>
${hoiThoai([
  ['I', 'Cho các khoảng thời gian họp, tìm số phòng họp tối thiểu cần có.'],
  ['C', 'Nếu một cuộc họp kết thúc lúc 10 và cuộc khác bắt đầu lúc 10 thì dùng chung phòng được không ạ? Thời gian là số nguyên chứ, có bao nhiêu cuộc họp? <em>("Can they share a room if one ends exactly when the other starts?")</em>'],
  ['N', 'Câu hỏi chạm mép đổi đáp án (2 hay 3 trên dữ liệu lab của ta). Hỏi nó trước tiên là câu làm rõ đáng giá nhất của họ bài này.'],
  ['I', 'Được dùng chung. Số nguyên, tới 10⁴ cuộc họp.'],
  ['C', 'Vậy khoảng là nửa mở. Đáp án là số cuộc họp diễn ra cùng lúc nhiều nhất. Vét cạn kiểm mỗi giờ bắt đầu với mọi cuộc họp, O(n²). Tốt hơn: sắp theo giờ bắt đầu và giữ một min-heap giờ kết thúc, mỗi phòng một giá trị; với mỗi cuộc họp, nếu phòng kết thúc sớm nhất đã trống kịp giờ bắt đầu thì dùng lại, không thì mở phòng mới. O(n log n) thời gian, O(n) bộ nhớ. <em>("a min-heap of end times, one per room")</em>'],
  ['N', 'Phát biểu lại thành "số cuộc đồng thời lớn nhất", nêu vét cạn, rồi tới heap kèm lý do vì sao đỉnh heap là phòng đúng để kiểm.'],
  ['I', 'Làm đi.'],
  ['C', '(đang code) Sắp một bản sao theo giờ bắt đầu… phép kiểm dùng lại là đỉnh heap ≤ giờ bắt đầu, nhỏ hơn hoặc bằng vì phòng trả lúc 10 dùng được ngay lúc 10… lúc nào cũng push giờ kết thúc… trả về kích thước heap. Chạy tay [9,11], [9,10], [10,12]: cái đầu mở phòng 1, cái thứ hai thấy 11 &gt; 9 nên mở phòng 2, cái thứ ba thấy 10 ≤ 10 nên dùng lại. Hai phòng. Đúng.'],
  ['N', 'Thuật lại đúng phép so sánh mã hoá luật chạm mép, và chạy tay đúng ca kiểm tra nó.'],
  ['I', 'Không dùng heap thì làm được không?'],
  ['C', 'Được ạ — quét: +1 ở mỗi giờ bắt đầu, −1 ở mỗi giờ kết thúc, sắp sự kiện với kết thúc đứng trước bắt đầu khi bằng giờ, rồi theo dõi giá trị lớn nhất của bộ đếm. Vẫn O(n log n). Nếu thời gian là số nguyên nhỏ, ví dụ số phút trong ngày, em dùng mảng hiệu và bỏ qua sắp xếp: O(n + 1440). <em>("a sweep line", "a difference array")</em>'],
], 'vi')}
</div>

<div class="ml-en">
<h3>Common mistakes</h3>
<ul>
<li>Not deciding half-open vs closed — then <code>&lt;</code> and <code>&lt;=</code> get mixed inside the same solution.</li>
<li>Sorting by start for "keep the most non-overlapping" (the [1,10] counter-example) — choosing problems sort by end.</li>
<li>Sweep events with the wrong tie order (start before end at the same time for half-open intervals) ⇒ one room too many.</li>
<li>Java comparators that subtract (<code>a[1] - b[1]</code>) and initial values like <code>Integer.MIN_VALUE</code> that collide with real inputs.</li>
<li>Mutating the caller's array by sorting it in place (copy first, or say that you are allowed to mutate).</li>
<li>Re-sorting in Insert Interval when the input is already sorted: O(n log n) where O(n) was asked for.</li>
</ul>
</div>
<div class="ml-vi">
<h3>Lỗi hay gặp</h3>
<ul>
<li>Không quyết định nửa mở hay đóng — rồi trộn lẫn <code>&lt;</code> với <code>&lt;=</code> trong cùng một lời giải.</li>
<li>Sắp theo điểm đầu cho bài "giữ nhiều khoảng không chồng lấn nhất" (phản ví dụ [1,10]) — bài chọn thì sắp theo điểm cuối.</li>
<li>Sự kiện quét có thứ tự hoà sai (bắt đầu trước kết thúc khi bằng giờ với khoảng nửa mở) ⇒ thừa một phòng.</li>
<li>Comparator Java dùng phép trừ (<code>a[1] - b[1]</code>) và giá trị khởi tạo như <code>Integer.MIN_VALUE</code> đụng với đầu vào thật.</li>
<li>Làm thay đổi mảng của người gọi khi sắp xếp tại chỗ (sao chép trước, hoặc nói rõ là được phép sửa).</li>
<li>Sắp lại trong Insert Interval khi đầu vào đã sắp sẵn: O(n log n) trong khi đề muốn O(n).</li>
</ul>
</div>

<div class="ml-en">
<h3>Practice problems (do them in this order)</h3>
${bangDe(DE, 'en')}
</div>
<div class="ml-vi">
<h3>Đề luyện (làm theo đúng thứ tự)</h3>
${bangDe(DE, 'vi')}
<p>Hai đề Premium (252, 253) không nộp được nếu không có tài khoản trả phí: làm bản miễn phí LC 2406 và LintCode 919/920, rồi tự viết bản nửa mở và chạy với dữ liệu lab ở trên (đáp án 2). Lời giải từng bước của Remove Covered Intervals, Maximum Number of Events và Meeting Rooms III nằm ở <a href="${baiNay('dsa-6-4-luyen')}">bài 6.4</a>.</p>
</div>

<div class="ml-en">
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Without looking, write <code>overlapsHalfOpen</code> and <code>overlapsClosed</code> and test them on <code>[9,11]</code> vs <code>[11,13]</code> and on a containment pair.</li>
<li>Write minimum rooms with a heap of end times. Run it on the lab data <code>[[9,11],[10,12],[11,13],[13,14],[9,10]]</code>: half-open must give 2. Change one character so it gives 3, and submit that version to LC 2406.</li>
<li>Submit LC 452 in Java with <code>Integer.compare</code>. Then explain in two sentences why <code>a[1] - b[1]</code> fails its tests.</li>
<li>Submit LC 57 in one O(n) pass, no sorting.</li>
</ol>
<p><strong>Done when:</strong> LC 2406, 452 and 57 accepted, and you can say for each of the seven problems in the touching-endpoints table whether touching counts — and why.</p></div>
<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">half-open interval [s, e)</span><span class="v">Contains s, not e. Bookings, calendars, most ranges in code.</span></div>
  <div class="kv"><span class="k">closed interval [s, e]</span><span class="v">Contains both ends; touching intervals share a point.</span></div>
  <div class="kv"><span class="k">overlap test</span><span class="v">a.s &lt; b.e and b.s &lt; a.e (closed: ≤).</span></div>
  <div class="kv"><span class="k">greedy by earliest end</span><span class="v">To keep the most non-overlapping intervals, always keep the one that finishes first.</span></div>
  <div class="kv"><span class="k">exchange argument</span><span class="v">Proof that swapping an optimal choice for the greedy one keeps it optimal.</span></div>
  <div class="kv"><span class="k">sweep line</span><span class="v">Turn intervals into +1/−1 events, sort by time, keep a running count.</span></div>
  <div class="kv"><span class="k">difference array</span><span class="v">Sweep over small integer coordinates: add at start, subtract at end, prefix-sum.</span></div>
  <div class="kv"><span class="k">exclusion constraint</span><span class="v">PostgreSQL rule that rejects overlapping ranges in the same table, race-free.</span></div>
</div>
<h3>📌 Summary</h3>
<ul>
<li>First decide half-open or closed; that single choice is a <code>&lt;</code> vs <code>&lt;=</code> everywhere after.</li>
<li>Merge/insert: sort by start (insert needs no sort — three phases, O(n)).</li>
<li>Keep the most / fewest arrows: sort by end, greedy; the exchange argument explains why.</li>
<li>How many at once (rooms, groups, capacity): heap of end times or a +1/−1 sweep; small coordinates ⇒ difference array.</li>
<li>Java: no subtraction in comparators, no sentinels that equal real inputs — LC 452 tests ±2³¹.</li>
<li>Real booking systems validate intervals and stop double booking in the database, not in the app.</li>
</ul>
${nguon('🐘', 'PostgreSQL — Range Types (exclusion constraints)', 'tstzrange, the && overlap operator, half-open [) by default, EXCLUDE USING gist', 'https://www.postgresql.org/docs/current/rangetypes.html')}
${nguon('📘', 'Interval scheduling (Wikipedia)', 'The greedy-by-earliest-finish algorithm and its proof', 'https://en.wikipedia.org/wiki/Interval_scheduling')}
${nguon('📗', 'NeetCode roadmap — Intervals', 'The standard order of the interval problems, with video solutions', 'https://neetcode.io/roadmap')}
</div>
<div class="ml-vi">
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Không nhìn bài, viết <code>overlapsHalfOpen</code> và <code>overlapsClosed</code> rồi test với <code>[9,11]</code> và <code>[11,13]</code>, và với một cặp chứa nhau.</li>
<li>Viết bài số phòng tối thiểu bằng heap giờ kết thúc. Chạy với dữ liệu lab <code>[[9,11],[10,12],[11,13],[13,14],[9,10]]</code>: bản nửa mở phải ra 2. Đổi đúng một ký tự để nó ra 3, rồi nộp bản đó lên LC 2406.</li>
<li>Nộp LC 452 bằng Java với <code>Integer.compare</code>. Sau đó giải thích trong hai câu vì sao <code>a[1] - b[1]</code> trượt test của nó.</li>
<li>Nộp LC 57 trong một lượt O(n), không sắp xếp.</li>
</ol>
<p><strong>Đạt khi:</strong> LC 2406, 452 và 57 Accepted, và với mỗi đề trong bảng chạm mép bạn nói được chạm mép có tính là trùng không — và vì sao.</p></div>
<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">half-open interval [s, e) (khoảng nửa mở)</span><span class="v">Chứa s, không chứa e. Lượt đặt, lịch, hầu hết dải trong code.</span></div>
  <div class="kv"><span class="k">closed interval [s, e] (khoảng đóng)</span><span class="v">Chứa cả hai đầu; hai khoảng chạm mép có chung một điểm.</span></div>
  <div class="kv"><span class="k">overlap test (phép kiểm chồng lấn)</span><span class="v">a.s &lt; b.e và b.s &lt; a.e (khoảng đóng: ≤).</span></div>
  <div class="kv"><span class="k">greedy by earliest end (tham lam theo điểm kết thúc sớm nhất)</span><span class="v">Muốn giữ nhiều khoảng không chồng lấn nhất thì luôn giữ khoảng xong sớm nhất.</span></div>
  <div class="kv"><span class="k">exchange argument (lập luận đổi chỗ)</span><span class="v">Chứng minh rằng đổi một lựa chọn tối ưu lấy lựa chọn tham lam vẫn tối ưu.</span></div>
  <div class="kv"><span class="k">sweep line (đường quét)</span><span class="v">Biến khoảng thành sự kiện +1/−1, sắp theo thời gian, giữ bộ đếm chạy.</span></div>
  <div class="kv"><span class="k">difference array (mảng hiệu)</span><span class="v">Phép quét trên toạ độ nguyên nhỏ: cộng ở đầu, trừ ở cuối, rồi cộng dồn.</span></div>
  <div class="kv"><span class="k">exclusion constraint (ràng buộc loại trừ)</span><span class="v">Luật của PostgreSQL từ chối các dải chồng lấn trong cùng bảng, không bị tranh chấp.</span></div>
</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Quyết định nửa mở hay đóng trước tiên; lựa chọn đó là một dấu <code>&lt;</code> hay <code>&lt;=</code> ở mọi chỗ phía sau.</li>
<li>Gộp/chèn: sắp theo điểm đầu (chèn thì không cần sắp — ba pha, O(n)).</li>
<li>Giữ nhiều nhất / ít mũi tên nhất: sắp theo điểm cuối, tham lam; lập luận đổi chỗ giải thích vì sao.</li>
<li>Cùng lúc có bao nhiêu (phòng, nhóm, sức chứa): heap giờ kết thúc hoặc quét +1/−1; toạ độ nhỏ ⇒ mảng hiệu.</li>
<li>Java: comparator không dùng phép trừ, giá trị canh gác không được trùng đầu vào thật — LC 452 test cả ±2³¹.</li>
<li>Hệ thống đặt chỗ thật kiểm tra khoảng đầu vào và chặn đặt trùng trong cơ sở dữ liệu, không phải trong ứng dụng.</li>
</ul>
${nguon('🐘', 'PostgreSQL — Range Types (exclusion constraints)', 'tstzrange, toán tử chồng lấn &&, mặc định nửa mở [), EXCLUDE USING gist', 'https://www.postgresql.org/docs/current/rangetypes.html')}
${nguon('📘', 'Interval scheduling (Wikipedia)', 'Thuật toán tham lam theo điểm kết thúc sớm nhất và chứng minh', 'https://en.wikipedia.org/wiki/Interval_scheduling')}
${nguon('📗', 'NeetCode roadmap — Intervals', 'Thứ tự chuẩn các đề khoảng, có video lời giải (tiếng Anh)', 'https://neetcode.io/roadmap')}
</div>
`,
};
