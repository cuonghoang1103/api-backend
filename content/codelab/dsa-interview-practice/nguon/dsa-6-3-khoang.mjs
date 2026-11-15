/** Coding Interview Prep · 6.3 — Bài toán khoảng: độ dài hợp các khoảng (sắp theo đầu), khung giờ rảnh chung, xếp lịch k người (sắp theo cuối + chọn người rảnh muộn nhất). Đề tự soạn. */
import { mod, bai, tn, nguon } from './_dsa.mjs';

/* ── 1. Sắp theo đầu + gộp: tổng số phút phòng lab có người dùng ── */
function busyMinutes(bookings) {
  const s = bookings.slice().sort((a, b) => a[0] - b[0]); // copy, then sort by START
  let total = 0, curS = null, curE = null;
  for (const [a, b] of s) {
    if (curE === null || a > curE) {          // a gap (a === curE just touches: same block, no gap)
      if (curE !== null) total += curE - curS;
      curS = a; curE = b;                       // open a new merged block
    } else if (b > curE) curE = b;              // overlaps: extend the current block
  }
  if (curE !== null) total += curE - curS;
  return total;
}
const D1 = bai({
  ten: 'Lab usage report: total minutes the room was booked', kho: 'EASY', phut: 15, ham: 'busyMinutes',
  en: `<p>Room AL-L301 is booked through an online form, and the form does not stop overlapping requests, so <code>bookings</code> is a messy list of half-open intervals <code>[start, end)</code> in minutes since the start of the semester. For the facility report, the department needs the <b>number of minutes during which the room was booked by at least one person</b>.</p>
<p>Write <code>busyMinutes(bookings)</code> returning the total length of the union of all intervals. Overlapping minutes are counted once. Do not modify the input.</p>`,
  vi: `<p>Phòng AL-L301 được đặt qua một form trực tuyến, và form không chặn các yêu cầu chồng giờ, nên <code>bookings</code> là danh sách lộn xộn các khoảng nửa mở <code>[start, end)</code>, tính bằng phút kể từ đầu học kỳ. Để làm báo cáo cơ sở vật chất, khoa cần <b>số phút mà phòng có ít nhất một người đặt</b>.</p>
<p>Viết <code>busyMinutes(bookings)</code> trả về tổng độ dài của hợp mọi khoảng. Phút bị chồng chỉ tính một lần. Không sửa đầu vào.</p>`,
  dauVao: ['bookings — array of [start, end] with start < end (integers), any order.', 'bookings — mảng [start, end] với start < end (số nguyên), thứ tự bất kỳ.'],
  dauRa: ['number — total booked minutes.', 'number — tổng số phút có người đặt.'],
  rangBuoc: [['0 ≤ bookings.length ≤ 2·10⁵; 0 ≤ start < end ≤ 10⁹.', '0 ≤ bookings.length ≤ 2·10⁵; 0 ≤ start < end ≤ 10⁹.'], ['Target: O(n log n).', 'Mục tiêu: O(n log n).']],
  goiY: [
    ['Summing <code>end − start</code> double-counts overlaps. Turn the list into disjoint blocks first — the "merge intervals" family: sort by start.', 'Cộng <code>end − start</code> sẽ đếm trùng phần chồng. Hãy biến danh sách thành các khối rời nhau trước — họ bài "gộp khoảng": sắp theo điểm đầu.'],
    ['Walk the sorted list keeping one open block <code>[curS, curE)</code>: if the next start is beyond <code>curE</code>, close the block (add its length) and open a new one; otherwise extend <code>curE</code>. You never need to store the merged list.', 'Đi qua danh sách đã sắp, giữ một khối đang mở <code>[curS, curE)</code>: nếu điểm đầu kế tiếp vượt quá <code>curE</code> thì đóng khối (cộng độ dài) và mở khối mới; ngược lại kéo dài <code>curE</code>. Không cần lưu danh sách đã gộp.'],
  ],
  loi: [
    ['Adding up <code>end − start</code> of every booking: overlapping minutes are counted two or three times.', 'Cộng <code>end − start</code> của mọi lượt đặt: phút chồng bị tính hai, ba lần.'],
    ['Extending with <code>curE = b</code> instead of <code>max(curE, b)</code>: a short booking inside a long one cuts the block short.', 'Kéo dài bằng <code>curE = b</code> thay vì <code>max(curE, b)</code>: một lượt đặt ngắn nằm trong lượt dài làm khối bị cắt cụt.'],
    ['Inserting each booking into a list of merged blocks by scanning the list: correct, but O(n²) when most bookings are disjoint.', 'Chèn từng lượt đặt vào danh sách khối đã gộp bằng cách quét cả danh sách: đúng, nhưng O(n²) khi phần lớn lượt đặt rời nhau.'],
  ],
  gt: ['After sorting by start, intervals that overlap are consecutive in the list, so one pass with a single open block builds the disjoint union; adding each block\'s length when it closes counts every booked minute exactly once. O(n log n) for the sort + O(n) for the pass, O(n) memory for the sorted copy. Touching blocks (<code>[0, 30)</code> and <code>[30, 60)</code>) may be merged or not — the total is the same.', 'Sau khi sắp theo điểm đầu, các khoảng chồng nhau nằm liền nhau trong danh sách, nên một lượt với một khối đang mở dựng được hợp rời nhau; cộng độ dài mỗi khối lúc đóng đếm mỗi phút có người đặt đúng một lần. O(n log n) cho sắp + O(n) cho lượt quét, O(n) bộ nhớ cho bản sao đã sắp. Hai khối chạm nhau (<code>[0, 30)</code> và <code>[30, 60)</code>) gộp hay không cũng ra cùng tổng.'],
  kn: ['intervals', 'merge intervals', 'sorting'],
  tns: [tn('half-open interval', 'khoảng nửa mở', '[start, end): gồm start, không gồm end.'), tn('union', 'hợp (của các khoảng)'), tn('disjoint', 'rời nhau')],
  dau: `/**
 * bookings: [start, end][] — half-open, possibly overlapping, any order
 * returns the total number of minutes covered by at least one booking
 */
function busyMinutes(bookings) {
  // Write your solution here
  let total = 0;
  for (const [s, e] of bookings) total += e - s;
  return total;
}
`,
  giai: '// Reference solution — sort by start, sweep with one open block, add each block when it closes.\n' + nguon(busyMinutes),
  cases: [
    { args: [[[60, 120], [0, 90], [200, 230]]], moTa: ['[0,120) + [200,230) = 150', '[0,120) + [200,230) = 150'] },
    { args: [[[0, 30], [30, 60]]], moTa: ['Touching bookings: 60', 'Hai lượt chạm nhau: 60'] },
    { args: [[]] },
    { args: [[[0, 600], [100, 120], [300, 310]]], an: true, moTa: ['Short bookings inside a long one', 'Lượt ngắn nằm trong lượt dài'] },
    { args: [[[5, 10], [5, 10], [5, 10]]], an: true, moTa: ['Duplicate bookings', 'Đặt trùng hệt nhau'] },
    { args: [[[900, 1000], [0, 1], [500, 950], [2, 3]]], an: true },
    { args: [[[0, 1000000000], [999999999, 1000000000]]], an: true },
  ],
  perf: [{
    moTa: ['Performance: 200 000 mostly disjoint bookings (scanning the merged list for every booking times out)', 'Hiệu năng: 200 000 lượt đặt phần lớn rời nhau (quét danh sách đã gộp cho mỗi lượt thì hết giờ)'],
    than: 'var n = 200000, a = new Array(n); for (var i = 0; i < n; i++) { var s = R(1000000000 - 1000); a[i] = [s, s + 1 + R(1000)]; } return busyMinutes(a);',
  }],
  saiMau: [
    { ten: ['O(n²): insert into a merged list by scanning it', 'O(n²): chèn vào danh sách đã gộp bằng cách quét'], chiHieuNang: true, ma: 'function busyMinutes(bookings) {\n  var m = [];\n  for (var i = 0; i < bookings.length; i++) {\n    var s = bookings[i][0], e = bookings[i][1], keep = [];\n    for (var j = 0; j < m.length; j++) { if (m[j][1] < s || m[j][0] > e) keep.push(m[j]); else { s = Math.min(s, m[j][0]); e = Math.max(e, m[j][1]); } }\n    keep.push([s, e]); m = keep;\n  }\n  var t = 0; for (var k = 0; k < m.length; k++) t += m[k][1] - m[k][0];\n  return t;\n}\n' },
    { ten: ['Extends with curE = b (no max)', 'Kéo dài bằng curE = b (thiếu max)'], ma: 'function busyMinutes(bookings) {\n  var s = bookings.slice().sort(function (x, y) { return x[0] - y[0]; }), t = 0, cs = null, ce = null;\n  for (var p of s) { if (ce === null || p[0] > ce) { if (ce !== null) t += ce - cs; cs = p[0]; ce = p[1]; } else ce = p[1]; }\n  if (ce !== null) t += ce - cs;\n  return t;\n}\n' },
  ],
});

/* ── 2. Hợp lịch bận của cả nhóm ⇒ khe rảnh chung ── */
function commonFreeSlots(calendars, dayStart, dayEnd, minLen) {
  const busy = [];
  for (const person of calendars) for (const iv of person) busy.push(iv); // everyone's busy time in ONE list
  busy.sort((a, b) => a[0] - b[0]);
  const out = [];
  let free = dayStart; // the earliest minute nobody has claimed yet
  for (const [s, e] of busy) {
    if (s > free) {                                   // a gap between `free` and the next busy start
      const gs = free, ge = Math.min(s, dayEnd);
      if (ge - gs >= minLen) out.push([gs, ge]);
    }
    if (e > free) free = e;                           // busy until at least e
    if (free >= dayEnd) break;
  }
  if (dayEnd - free >= minLen) out.push([free, dayEnd]); // the tail of the day
  return out;
}
const D2 = bai({
  ten: 'SWP391 team: find common free slots for a meeting', kho: 'MEDIUM', phut: 25, ham: 'commonFreeSlots',
  en: `<p>A five-person SWP391 team wants to meet. Each member exported their busy times for the day: <code>calendars[p]</code> is a list of half-open intervals <code>[start, end)</code> in minutes after midnight (a person's own intervals may overlap and are not sorted).</p>
<p>Write <code>commonFreeSlots(calendars, dayStart, dayEnd, minLen)</code> returning every maximal interval inside <code>[dayStart, dayEnd)</code> when <b>nobody</b> is busy and that is at least <code>minLen</code> minutes long, as <code>[start, end]</code> pairs in time order. Busy intervals may stick out before <code>dayStart</code> or after <code>dayEnd</code>.</p>`,
  vi: `<p>Một nhóm SWP391 năm người muốn họp. Mỗi thành viên xuất giờ bận trong ngày: <code>calendars[p]</code> là danh sách khoảng nửa mở <code>[start, end)</code> tính bằng phút sau nửa đêm (các khoảng của cùng một người có thể chồng nhau và không được sắp).</p>
<p>Viết <code>commonFreeSlots(calendars, dayStart, dayEnd, minLen)</code> trả về mọi khoảng lớn nhất nằm trong <code>[dayStart, dayEnd)</code> mà <b>không ai</b> bận và dài ít nhất <code>minLen</code> phút, dạng cặp <code>[start, end]</code> theo thứ tự thời gian. Khoảng bận có thể chìa ra trước <code>dayStart</code> hoặc sau <code>dayEnd</code>.</p>`,
  dauVao: ['calendars — array (one per person) of [start, end] lists; dayStart < dayEnd; minLen ≥ 1.', 'calendars — mảng (mỗi người một phần tử) các danh sách [start, end]; dayStart < dayEnd; minLen ≥ 1.'],
  dauRa: ['[start, end][] — free slots, in time order.', '[start, end][] — các khe rảnh, theo thứ tự thời gian.'],
  rangBuoc: [['Up to 50 people and 2·10⁴ busy intervals in total; 0 ≤ times ≤ 1440.', 'Tối đa 50 người và tổng 2·10⁴ khoảng bận; 0 ≤ mốc giờ ≤ 1440.'], ['Target: O(N log N), N = total busy intervals.', 'Mục tiêu: O(N log N), N = tổng số khoảng bận.']],
  goiY: [
    ['Who is busy does not matter, only WHEN someone is busy: pour all intervals of all people into one list.', 'Ai bận không quan trọng, chỉ cần BIẾT LÚC NÀO có người bận: đổ mọi khoảng của mọi người vào một danh sách.'],
    ['Sort by start and keep <code>free</code> = the end of everything busy so far (starting at <code>dayStart</code>). A start greater than <code>free</code> reveals a gap <code>[free, start)</code>; clip it to the day and keep it if it is long enough. Do not forget the gap after the last busy interval.', 'Sắp theo điểm đầu và giữ <code>free</code> = điểm cuối của mọi thứ đã bận tới giờ (bắt đầu từ <code>dayStart</code>). Một điểm đầu lớn hơn <code>free</code> lộ ra khe <code>[free, start)</code>; cắt theo ngày rồi giữ nếu đủ dài. Đừng quên khe sau khoảng bận cuối cùng.'],
  ],
  loi: [
    ['Starting the sweep at the first busy interval instead of <code>dayStart</code>: the free time at the beginning of the day disappears.', 'Bắt đầu quét từ khoảng bận đầu tiên thay vì <code>dayStart</code>: thời gian rảnh đầu ngày biến mất.'],
    ['Setting <code>free = e</code> instead of <code>max(free, e)</code>: a short meeting inside a long one creates a fake gap.', 'Gán <code>free = e</code> thay vì <code>max(free, e)</code>: một cuộc họp ngắn nằm trong cuộc dài tạo ra khe giả.'],
    ['Not clipping to <code>[dayStart, dayEnd)</code>: a slot before 08:00 or one running past the end of the day is returned.', 'Không cắt theo <code>[dayStart, dayEnd)</code>: trả cả khe trước 08:00 hoặc khe chạy quá cuối ngày.'],
  ],
  gt: ['Merging all busy intervals of all people gives the times when at least one person is busy; the complement of that union inside the day is exactly the common free time. Sorting the N intervals and sweeping with a single "free from" pointer finds every gap in one pass: O(N log N) time, O(N) memory. Clipping with <code>dayStart</code> as the initial pointer and <code>min(s, dayEnd)</code> / the tail check keeps the slots inside the day.', 'Gộp mọi khoảng bận của mọi người cho ra những lúc có ít nhất một người bận; phần bù của hợp đó trong ngày chính là thời gian rảnh chung. Sắp N khoảng rồi quét với một con trỏ "rảnh từ" tìm mọi khe trong một lượt: O(N log N) thời gian, O(N) bộ nhớ. Dùng <code>dayStart</code> làm giá trị đầu của con trỏ, <code>min(s, dayEnd)</code> và phép kiểm phần đuôi giữ các khe nằm trong ngày.'],
  kn: ['intervals', 'sweep', 'complement of a union'],
  tns: [tn('free slot', 'khe rảnh'), tn('complement', 'phần bù'), tn('clip', 'cắt theo biên'), tn('maximal', 'lớn nhất (không mở rộng thêm được)')],
  dau: `/**
 * calendars: [start, end][][] — busy times per person (half-open, minutes after midnight)
 * returns every free slot [start, end] inside [dayStart, dayEnd) of length >= minLen, in time order
 */
function commonFreeSlots(calendars, dayStart, dayEnd, minLen) {
  // Write your solution here
  return [[dayStart, dayEnd]];
}
`,
  giai: '// Reference solution — one combined list of busy intervals, sort by start, sweep a "free from" pointer.\n' + nguon(commonFreeSlots),
  cases: [
    { args: [[[[480, 570], [720, 780]], [[540, 600], [840, 900]]], 480, 1020, 30], moTa: ['Two people, 08:00–17:00, at least 30 minutes', 'Hai người, 08:00–17:00, ít nhất 30 phút'] },
    { args: [[[[600, 660]], [[630, 700]], []], 480, 720, 60], moTa: ['Free at the start of the day; 20 minutes at the end is too short', 'Rảnh đầu ngày; 20 phút cuối là quá ngắn'] },
    { args: [[[[0, 1440]]], 480, 1020, 1], moTa: ['Someone is busy all day', 'Có người bận cả ngày'] },
    { args: [[], 480, 600, 15], an: true, moTa: ['Nobody has anything ⇒ the whole window', 'Không ai có lịch ⇒ cả khung'] },
    { args: [[[[500, 900], [520, 540]], [[600, 610]]], 480, 1000, 10], an: true, moTa: ['Short meetings inside a long one', 'Họp ngắn nằm trong họp dài'] },
    { args: [[[[400, 500], [1000, 1100]], [[700, 700 + 30]]], 480, 1020, 30], an: true, moTa: ['Busy intervals stick out of the day', 'Khoảng bận chìa ra ngoài ngày'] },
    { args: [[[[480, 540]], [[540, 600]], [[630, 660]]], 480, 720, 30], an: true, moTa: ['Back-to-back meetings leave no gap', 'Họp nối tiếp không để lại khe'] },
    { args: [[[[700, 720], [600, 650]], [[650, 700], [480, 490]]], 480, 760, 5], an: true },
  ],
  saiMau: [
    { ten: ['Sweep starts at the first busy interval (misses the morning)', 'Bắt đầu quét từ khoảng bận đầu (mất buổi sáng)'], ma: 'function commonFreeSlots(calendars, dayStart, dayEnd, minLen) {\n  var b = [].concat.apply([], calendars).sort(function (x, y) { return x[0] - y[0]; });\n  if (!b.length) return dayEnd - dayStart >= minLen ? [[dayStart, dayEnd]] : [];\n  var out = [], free = Math.max(dayStart, b[0][1]);\n  for (var i = 1; i < b.length; i++) { if (b[i][0] > free) { var ge = Math.min(b[i][0], dayEnd); if (ge - free >= minLen) out.push([free, ge]); } free = Math.max(free, b[i][1]); }\n  if (dayEnd - free >= minLen) out.push([free, dayEnd]);\n  return out;\n}\n' },
    { ten: ['free = e (no max)', 'free = e (thiếu max)'], ma: 'function commonFreeSlots(calendars, dayStart, dayEnd, minLen) {\n  var b = [].concat.apply([], calendars).sort(function (x, y) { return x[0] - y[0]; });\n  var out = [], free = dayStart;\n  for (var p of b) { if (p[0] > free) { var ge = Math.min(p[0], dayEnd); if (ge - free >= minLen) out.push([free, ge]); } free = p[1]; }\n  if (dayEnd - free >= minLen) out.push([free, dayEnd]);\n  return out;\n}\n' },
  ],
});

/* ── 3. Sắp theo cuối + giao cho người rảnh MUỘN nhất mà vẫn kịp ── */
function maxProctored(sessions, k) {
  const s = sessions.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]); // earliest END first
  const freeAt = new Array(k).fill(-Infinity); // when each proctor becomes free, kept SORTED ascending
  let count = 0;
  for (const [start, end] of s) {
    // binary search: the proctor who became free LATEST but still not after `start`
    let lo = 0, hi = freeAt.length - 1, best = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (freeAt[mid] <= start) { best = mid; lo = mid + 1; } else hi = mid - 1;
    }
    if (best === -1) continue;   // nobody can take it: skip this session
    freeAt.splice(best, 1);      // that proctor is now busy until `end` …
    let i = best;                // … reinsert `end` keeping the array sorted (O(k))
    while (i < freeAt.length && freeAt[i] <= end) i++;
    freeAt.splice(i, 0, end);
    count++;
  }
  return count;
}
const D3 = bai({
  ten: 'Online exam proctoring: supervise as many sessions as possible', kho: 'HARD', phut: 35, ham: 'maxProctored',
  en: `<p>During the FE week the testing centre runs many online exam sessions; session <code>i</code> is the half-open interval <code>sessions[i] = [start, end)</code> in minutes. There are <code>k</code> proctors. A proctor watches <b>one whole session at a time</b> and can start a new one at the minute the previous one ends. A session is valid only if one proctor watches it from start to end.</p>
<p>Write <code>maxProctored(sessions, k)</code> returning the maximum number of sessions that can be fully proctored.</p>`,
  vi: `<p>Trong tuần thi FE, trung tâm khảo thí chạy nhiều ca thi trực tuyến; ca <code>i</code> là khoảng nửa mở <code>sessions[i] = [start, end)</code> tính bằng phút. Có <code>k</code> giám thị. Một giám thị coi <b>trọn một ca tại một thời điểm</b> và có thể bắt đầu ca mới đúng phút ca trước kết thúc. Một ca chỉ hợp lệ nếu có một giám thị coi từ đầu tới cuối.</p>
<p>Viết <code>maxProctored(sessions, k)</code> trả về số ca nhiều nhất có thể được coi trọn.</p>`,
  dauVao: ['sessions — array of [start, end] with start < end; k — integer ≥ 1.', 'sessions — mảng [start, end] với start < end; k — số nguyên ≥ 1.'],
  dauRa: ['number — maximum sessions proctored.', 'number — số ca nhiều nhất được coi.'],
  rangBuoc: [['0 ≤ sessions.length ≤ 10⁵; 1 ≤ k ≤ 200; 0 ≤ start < end ≤ 10⁹.', '0 ≤ sessions.length ≤ 10⁵; 1 ≤ k ≤ 200; 0 ≤ start < end ≤ 10⁹.'], ['Target: O(n log n + n·k) or better.', 'Mục tiêu: O(n log n + n·k) hoặc tốt hơn.']],
  goiY: [
    ['With k = 1 this is the "choose the most non-overlapping intervals" family of the lesson: sort by END and take a session whenever it fits.', 'Với k = 1 đây là họ bài "chọn nhiều khoảng không chồng nhất" của bài học: sắp theo điểm CUỐI và nhận một ca mỗi khi nó vừa.'],
    ['With k proctors, process sessions by end time; a session fits if some proctor is free by its start. Which free proctor should take it? The one who became free the LATEST (but ≤ start) — keep the early-free ones for sessions that start early.', 'Với k giám thị, xử lý các ca theo thời điểm kết thúc; một ca vừa nếu có giám thị rảnh trước giờ bắt đầu của nó. Ai nên nhận? Người rảnh MUỘN nhất (nhưng ≤ start) — giữ những người rảnh sớm cho các ca bắt đầu sớm.'],
    ['Keep the proctors\' free times in a sorted array: binary search for the last value ≤ start, remove it, insert <code>end</code> in order.', 'Giữ thời điểm rảnh của các giám thị trong một mảng đã sắp: tìm nhị phân giá trị cuối cùng ≤ start, xoá nó, chèn <code>end</code> đúng thứ tự.'],
  ],
  loi: [
    ['Giving the session to ANY free proctor (the first one in the list, or the one free the longest): with <code>[[0,5],[0,10],[12,20],[6,30]]</code>, k = 2 the proctor free since minute 5 is spent on the 12:00 session, and <code>[6, 30)</code> is lost — 3 instead of 4.', 'Giao ca cho BẤT KỲ giám thị rảnh nào (người đầu danh sách, hay người rảnh lâu nhất): với <code>[[0,5],[0,10],[12,20],[6,30]]</code>, k = 2 người rảnh từ phút 5 bị dùng cho ca 12:00, và mất ca <code>[6, 30)</code> — ra 3 thay vì 4.'],
    ['Sorting by start time (or by length): the greedy is only correct in END order.', 'Sắp theo giờ bắt đầu (hoặc theo độ dài): tham lam chỉ đúng khi đi theo thứ tự điểm CUỐI.'],
    ['Treating touching sessions as overlapping: a proctor finishing at minute 60 can start a session at minute 60.', 'Coi hai ca chạm nhau là chồng: giám thị xong lúc phút 60 vẫn bắt đầu được ca phút 60.'],
  ],
  gt: ['Processing by end time is the classic interval-scheduling greedy: a session that ends earlier never blocks more future sessions than one that ends later. With several proctors, assigning the session to the proctor whose free time is the largest value ≤ start is the "best fit": an exchange argument shows any optimal schedule can be rearranged to make the same choice, because proctors free earlier are strictly more useful later. Sorting is O(n log n); each session does an O(log k) search plus an O(k) array shift ⇒ O(n log n + n·k) time, O(n + k) memory (a balanced BST/TreeMap makes it O(n log n) — in Java use <code>TreeMap.floorKey</code>).', 'Xử lý theo thời điểm kết thúc là tham lam xếp lịch kinh điển: ca kết thúc sớm không bao giờ chặn nhiều ca tương lai hơn ca kết thúc muộn. Với nhiều giám thị, giao ca cho người có giờ rảnh là giá trị lớn nhất ≤ start là "vừa khít nhất": lập luận hoán đổi cho thấy mọi lịch tối ưu đều sắp lại được để chọn giống vậy, vì người rảnh sớm hơn luôn hữu ích hơn về sau. Sắp O(n log n); mỗi ca một lần tìm O(log k) cộng một lần dời mảng O(k) ⇒ O(n log n + n·k) thời gian, O(n + k) bộ nhớ (cây BST cân bằng/TreeMap cho O(n log n) — Java dùng <code>TreeMap.floorKey</code>).'],
  kn: ['intervals', 'greedy', 'binary search'],
  tns: [tn('interval scheduling', 'xếp lịch khoảng'), tn('best fit', 'vừa khít nhất'), tn('floor', 'cận dưới', 'giá trị lớn nhất ≤ x.'), tn('exchange argument', 'lập luận hoán đổi')],
  dau: `/**
 * sessions: [start, end][] (half-open), k: number of proctors
 * returns the maximum number of sessions that can each be watched start-to-end by one proctor
 */
function maxProctored(sessions, k) {
  // Write your solution here
  return Math.min(sessions.length, k);
}
`,
  giai: '// Reference solution — sort by end; give each session to the proctor free the latest but still in time.\n' + nguon(maxProctored),
  cases: [
    { args: [[[0, 10], [12, 20], [3, 25]], 2], moTa: ['Best fit keeps the 0-free proctor for [3,25) ⇒ 3', 'Vừa khít giữ người rảnh từ 0 cho [3,25) ⇒ 3'] },
    { args: [[[0, 5], [0, 10], [12, 20], [6, 30]], 2], moTa: ['Best fit: 12:00 goes to the proctor free since 10 ⇒ 4', 'Vừa khít: ca 12:00 cho người rảnh từ phút 10 ⇒ 4'] },
    { args: [[[0, 60], [60, 120], [30, 90]], 1], moTa: ['One proctor, touching sessions ⇒ 2', 'Một giám thị, hai ca chạm nhau ⇒ 2'] },
    { args: [[], 3] },
    { args: [[[0, 100], [10, 20], [20, 30], [30, 40]], 1], an: true, moTa: ['End order beats start order', 'Theo điểm cuối thắng theo điểm đầu'] },
    { args: [[[0, 5], [0, 5], [0, 5], [0, 5]], 3], an: true },
    { args: [[[1, 4], [2, 5], [3, 6], [4, 7], [5, 8], [6, 9]], 2], an: true },
    { args: [[[0, 10], [5, 15], [10, 20], [15, 25], [9, 11], [0, 30]], 2], an: true },
    { args: [[[0, 1000000000]], 1], an: true },
  ],
  perf: [{
    moTa: ['Performance: 100 000 sessions, 100 proctors', 'Hiệu năng: 100 000 ca, 100 giám thị'],
    than: 'var n = 100000, a = new Array(n); for (var i = 0; i < n; i++) { var s = R(1000000); a[i] = [s, s + 1 + R(5000)]; } return maxProctored(a, 100);',
  }],
  saiMau: [
    { ten: ['Gives the session to the first free proctor found', 'Giao ca cho giám thị rảnh đầu tiên tìm thấy'], ma: 'function maxProctored(sessions, k) {\n  var s = sessions.slice().sort(function (a, b) { return a[1] - b[1] || a[0] - b[0]; }), f = new Array(k).fill(-Infinity), c = 0;\n  for (var p of s) { for (var j = 0; j < k; j++) if (f[j] <= p[0]) { f[j] = p[1]; c++; break; } }\n  return c;\n}\n' },
    { ten: ['Greedy in START order', 'Tham lam theo thứ tự điểm ĐẦU'], ma: 'function maxProctored(sessions, k) {\n  var s = sessions.slice().sort(function (a, b) { return a[0] - b[0]; }), f = new Array(k).fill(-Infinity), c = 0;\n  for (var p of s) { var b = -1; for (var j = 0; j < k; j++) if (f[j] <= p[0] && (b < 0 || f[j] > f[b])) b = j; if (b >= 0) { f[b] = p[1]; c++; } }\n  return c;\n}\n' },
  ],
});

export default mod('dsa-6-3-khoang', '6.3 Intervals: merge, free slots, scheduling', [D1, D2, D3]);
