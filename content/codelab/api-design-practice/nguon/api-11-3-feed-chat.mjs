/** API Design · 11.4 — News feed: fan-out khi ghi/khi đọc/lai, trộn timeline, cursor (output thật bài 11.4: interview/feed/fanout.mjs). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Feed 1 — Push, pull and hybrid, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.4: Redis 8.2, timelines as sorted sets, a page with 100,000 followers.',
  vi: 'Những điều từ bài 11.4: Redis 8.2, timeline là sorted set, một trang có 100.000 người theo dõi.',
  cau: [
    q('c1', ['With fan-out on write, what did one post of the 100,000-follower page cost?', 'Với fan-out khi ghi, một bài của trang 100.000 người theo dõi tốn bao nhiêu?'],
      ['200,000 Redis commands, about half a second and 7.1 MB of timeline entries', 'One ZADD, because the followers read the page’s own list', '100,000 commands and 16.7 ms', 'Nothing until each follower opens the app'],
      ['One ZADD plus one trim per follower: 465–543 ms over two runs.', 'Một ZADD cộng một lệnh cắt cho mỗi người theo dõi: 465–543 ms qua hai lần đo.']),
    q('c2', ['With fan-out on read, a student who follows 1,000 accounts opens the feed. Measured cost?', 'Với fan-out khi đọc, một sinh viên theo dõi 1.000 tài khoản mở feed. Chi phí đo được?'],
      ['1,000 commands and 7.7–16.7 ms on every read', 'One command and 0.18 ms, the same as push', '200,000 commands, the same as a big post', 'Nothing, because reads are cached by Redis'],
      ['Pull moves the cost to reads, and reads are about 100 times more frequent than posts.', 'Kéo dời chi phí sang lúc đọc, mà số lần đọc gấp khoảng 100 lần số bài đăng.']),
    q('c3', ['Page 1 is loaded, one new post arrives, page 2 is loaded with offset=10. What happened?', 'Tải trang 1, một bài mới tới, tải trang 2 với offset=10. Chuyện gì xảy ra?'],
      ['Post 1000021 appeared again; the cursor “older than 1000021” repeated nothing', 'Page 2 skipped one post, because the new post pushed it up into page 1', 'Nothing changed, because Redis sorted sets keep their order by score', 'Redis returned an error, because the offset no longer matched the set size'],
      ['New items shift every offset; a cursor anchored to an item is immune (3.2).', 'Mục mới làm lệch mọi offset; cursor neo vào một mục thì miễn nhiễm (3.2).']),
    q('c4', ['Why is the feed cursor opaque to clients?', 'Vì sao cursor của feed phải mờ với client?'],
      ['So the server can later encode a ranking score instead of an id without a new API version', 'Because base64 makes the cursor smaller than an id', 'Because clients must not know how many posts exist', 'Because Redis cannot read plain numbers as cursors'],
      ['Clients only pass it back; what it encodes is the server’s business (Chapter 4: changes without breaking).', 'Client chỉ gửi lại; nó mã hoá gì là việc của server (Chương 4: thay đổi mà không làm vỡ).']),
  ],
  goiY: [['Push pays at write, pull pays at read.', 'Đẩy trả giá lúc ghi, kéo trả giá lúc đọc.'], ['Which side happens 100 times more often?', 'Phía nào xảy ra nhiều gấp 100 lần?']],
  loi: [['Answering “push, like Twitter” without numbers.', 'Trả lời “đẩy, như Twitter” mà không có số.'], ['Paging a moving feed by offset.', 'Phân trang feed đang trôi bằng offset.']],
  tns: [tn('fan-out', 'toả bài tới người theo dõi'), tn('timeline', 'dòng thời gian'), tn('hybrid', 'kiểu lai')],
  kn: ['system design', 'pagination'],
});

function mergeFeed(lists, limit, cursor) {
  const seen = new Set();
  const all = [];
  for (const list of lists) for (const id of list) if ((cursor === null || id < cursor) && !seen.has(id)) { seen.add(id); all.push(id); }
  all.sort((a, b) => b - a);                                        // mới nhất trước
  const data = all.slice(0, limit);
  return { data, next: all.length > limit ? data[data.length - 1] : null };
}
const E2 = jsBai({
  ten: 'Feed 2 — Write mergeFeed(lists, limit, cursor): pull at read time', kho: 'MEDIUM', phut: 15,
  en: `<p>Each followed account gives a list of numeric post ids (newest first). Build one page of the feed: the newest <code>limit</code> ids strictly older than <code>cursor</code> (<code>null</code> ⇒ from the newest), each id once even if two lists contain it. Return <code>{ data, next }</code> where <code>next</code> is the last id of the page when more ids remain, otherwise <code>null</code>.</p>`,
  vi: `<p>Mỗi tài khoản đang theo dõi cho một danh sách id bài (số, mới nhất trước). Dựng một trang feed: <code>limit</code> id mới nhất cũ hơn hẳn <code>cursor</code> (<code>null</code> ⇒ từ mới nhất), mỗi id một lần dù hai danh sách cùng chứa. Trả <code>{ data, next }</code> với <code>next</code> là id cuối của trang khi còn id, ngược lại <code>null</code>.</p>`,
  dauVao: ['lists — number[][]; limit — number; cursor — number | null', 'lists — number[][]; limit — số; cursor — số | null'],
  dauRa: ['{ data: number[], next: number | null }', '{ data: number[], next: number | null }'],
  goiY: [['Flatten, filter by the cursor, dedupe, sort descending, slice.', 'Làm phẳng, lọc theo cursor, bỏ trùng, sắp giảm dần, cắt.'], ['“Strictly older” means id &lt; cursor.', '“Cũ hơn hẳn” nghĩa là id &lt; cursor.']],
  loi: [['Keeping the cursor post itself — it appears on two pages.', 'Giữ cả bài ở cursor — nó hiện trên hai trang.'], ['Sorting ids as strings: "999" &gt; "1000".', 'Sắp id như chuỗi: "999" &gt; "1000".']],
  gt: ['This is pullFeed of 11.4 plus the cursor: ZRANGE … (cursor -inf BYSCORE REV LIMIT 0 limit on each list, then merge. With 1,000 lists every read paid 7.7–16.7 ms.', 'Đây là pullFeed của bài 11.4 cộng cursor: ZRANGE … (cursor -inf BYSCORE REV LIMIT 0 limit trên từng danh sách, rồi trộn. Với 1.000 danh sách mỗi lần đọc tốn 7,7–16,7 ms.'],
  kn: ['pagination', 'system design'],
  tns: [tn('merge', 'trộn'), tn('cursor', 'con trỏ trang')],
  dau: `/** one page of a pulled feed */
function mergeFeed(lists, limit, cursor) {
  // Write your solution here
  const all = lists.flat().sort().reverse();
  const data = all.slice(0, limit);
  return { data, next: data[data.length - 1] ?? null };
}
`,
  giai: '// Reference solution\n' + nguon(mergeFeed),
  cases: [
    { goi: goi('mergeFeed', [[1000030, 1000027, 1000021], [1000029, 1000022], [1000028, 1000025]], 4, null), moTa: ['Three accounts, first page of 4', 'Ba tài khoản, trang đầu 4 bài'] },
    { goi: goi('mergeFeed', [[1000030, 1000027, 1000021], [1000029, 1000022], [1000028, 1000025]], 4, 1000027), an: true },
    { goi: goi('mergeFeed', [[999, 500], [1000, 999, 2]], 10, null), an: true },
    { goi: goi('mergeFeed', [[5, 4], [3]], 3, null), an: true },
    { goi: goi('mergeFeed', [[], []], 20, null), an: true },
  ],
});

function fanoutPlan(authors, following, threshold) {
  const big = new Set(authors.filter((a) => a.followers > threshold).map((a) => a.id));
  const writeCommands = {};
  for (const a of authors) writeCommands[a.id] = big.has(a.id) ? 1 : a.followers * 2;   // đẩy: ZADD + cắt bớt cho mỗi người theo dõi
  const pullAtRead = following.filter((id) => big.has(id));
  return { writeCommands, pullAtRead, readCommands: 1 + pullAtRead.length };
}
const E3 = jsBai({
  ten: 'Feed 3 — Write fanoutPlan(authors, following, threshold): the hybrid', kho: 'HARD', phut: 15,
  en: `<p>Hybrid fan-out: an author with <b>more than</b> <code>threshold</code> followers is pulled at read time; everyone else is pushed. Return <code>{ writeCommands, pullAtRead, readCommands }</code>:</p><ul><li><code>writeCommands</code> — for each author id, the Redis commands one post costs: pushed authors 2 per follower (ZADD + trim), pulled authors 1 (their own list);</li><li><code>pullAtRead</code> — the ids in <code>following</code> (same order) that are pulled;</li><li><code>readCommands</code> — 1 (the reader’s own timeline) + the number of pulled accounts followed.</li></ul>`,
  vi: `<p>Fan-out kiểu lai: tác giả có <b>nhiều hơn</b> <code>threshold</code> người theo dõi được kéo lúc đọc; còn lại được đẩy. Trả <code>{ writeCommands, pullAtRead, readCommands }</code>:</p><ul><li><code>writeCommands</code> — với mỗi id tác giả, số lệnh Redis một bài tốn: tác giả được đẩy 2 lệnh mỗi người theo dõi (ZADD + cắt), tác giả được kéo 1 lệnh (danh sách của chính họ);</li><li><code>pullAtRead</code> — các id trong <code>following</code> (giữ thứ tự) thuộc diện kéo;</li><li><code>readCommands</code> — 1 (timeline của người đọc) + số tài khoản bị kéo mà họ theo dõi.</li></ul>`,
  dauVao: ['authors — {id, followers}[]; following — string[]; threshold — number', 'authors — {id, followers}[]; following — string[]; threshold — số'],
  dauRa: ['{ writeCommands: {[id]: number}, pullAtRead: string[], readCommands: number }', '{ writeCommands: {[id]: number}, pullAtRead: string[], readCommands: number }'],
  goiY: [['Build the set of big authors first.', 'Dựng tập tác giả lớn trước.'], ['“More than” threshold — equal stays pushed.', '“Nhiều hơn” ngưỡng — bằng ngưỡng vẫn đẩy.']],
  loi: [['Counting one command per follower (forgetting the trim).', 'Đếm một lệnh mỗi người theo dõi (quên lệnh cắt).'], ['Pulling accounts the reader does not follow.', 'Kéo cả tài khoản người đọc không theo dõi.']],
  gt: ['Lesson 11.4: the student’s post = 300 commands (150 followers), the big page = 200,000 pushed or 1 pulled; the hybrid read = 1 timeline + 3 big accounts = 4 commands, 0.16–0.68 ms.', 'Bài 11.4: bài của sinh viên = 300 lệnh (150 người theo dõi), trang lớn = 200.000 nếu đẩy hoặc 1 nếu kéo; đọc kiểu lai = 1 timeline + 3 tài khoản lớn = 4 lệnh, 0,16–0,68 ms.'],
  kn: ['system design'],
  tns: [tn('threshold', 'ngưỡng'), tn('pull', 'kéo'), tn('push', 'đẩy')],
  dau: `/** hybrid fan-out plan */
function fanoutPlan(authors, following, threshold) {
  // Write your solution here
  const writeCommands = {};
  for (const a of authors) writeCommands[a.id] = a.followers;
  return { writeCommands, pullAtRead: [], readCommands: 1 };
}
`,
  giai: '// Reference solution\n' + nguon(fanoutPlan),
  cases: [
    { goi: goi('fanoutPlan', [{ id: 'sv_an', followers: 150 }, { id: 'clb', followers: 10000 }, { id: 'fptu', followers: 100000 }], ['sv_an', 'clb', 'fptu'], 10000), moTa: ['The three authors of the lesson, threshold 10,000', 'Ba tác giả trong bài, ngưỡng 10.000'] },
    { goi: goi('fanoutPlan', [{ id: 'a', followers: 5 }, { id: 'b', followers: 50 }], ['b'], 10), an: true },
    { goi: goi('fanoutPlan', [{ id: 'x', followers: 0 }], [], 0), an: true },
    { goi: goi('fanoutPlan', [{ id: 'p', followers: 300 }, { id: 'q', followers: 301 }, { id: 'r', followers: 999 }], ['r', 'p', 'q'], 300), an: true },
  ],
});

export default doiDau({ slug: 'api-11-3-feed-chat', ten: '11.4 Interview: a news feed', khoa: KHOA, baiHoc: 'api-11-3-feed-chat', de: [E1, E2, E3] });
