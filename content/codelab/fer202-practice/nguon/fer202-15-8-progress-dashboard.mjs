/**
 * CodeLearn · F8 — My Progress: 5 con số tổng, tiến độ + quiz tốt nhất từng khoá, lịch sử quiz (_expand=chapter).
 */
import { doiDau } from './_chung.mjs';
import { B, DB, banInF, bang, click, cho, dn, gui, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>One page that answers "how am I doing?". Everything is <b>derived</b> from data you already load: the student's enrolments (+ lesson totals, F6) and their quiz attempts (<code>results</code>). No new collection, no counters stored anywhere — numbers are recomputed from the server data every time the page opens, so they can never drift.</p>
<h3>API calls</h3>${bang(['Request', 'Used for'], [
    ['<code>GET /enrollments?userId=…&amp;_expand=course…</code> + <code>GET /lessons?courseId=…</code>', 'per-course progress (F5/F6 thunk)'],
    ['<code>GET /results?userId=…&amp;_expand=chapter&amp;_sort=submittedAt&amp;_order=desc</code>', 'quiz history with chapter titles, newest first'],
  ])}
<h3>The five numbers</h3>${bang(['Id', 'Meaning'], [
    ['<code>#stat-enrolled</code>', 'courses enrolled'],
    ['<code>#stat-completed</code>', 'courses at 100% (and having at least one lesson)'],
    ['<code>#stat-lessons</code>', 'completed lessons across all courses'],
    ['<code>#stat-quizzes</code>', 'distinct <b>chapters</b> with at least one passed attempt (passing the same quiz twice counts once)'],
    ['<code>#stat-avg</code>', 'average <code>percent</code> of all attempts, rounded, e.g. "67%"; no attempts ⇒ "—"'],
  ])}
<h3>Edge cases</h3><ul><li>No enrolments ⇒ <code>#no-progress</code>; no attempts ⇒ <code>#no-quiz-history</code> and average "—".</li><li>A result whose chapter was deleted still shows (fallback text), the page must not crash.</li></ul>`,
  vi: `<p>Một trang trả lời câu "mình học tới đâu rồi?". Mọi thứ đều <b>suy ra</b> từ dữ liệu đã tải: lượt ghi danh của học viên (+ tổng số bài, F6) và các lượt làm quiz (<code>results</code>). Không thêm bảng mới, không lưu bộ đếm ở đâu cả — mỗi lần mở trang tính lại từ dữ liệu máy chủ nên không bao giờ lệch.</p>
<h3>Lời gọi API</h3>${bang(['Request', 'Dùng cho'], [
    ['<code>GET /enrollments?userId=…&amp;_expand=course…</code> + <code>GET /lessons?courseId=…</code>', 'tiến độ từng khoá (thunk F5/F6)'],
    ['<code>GET /results?userId=…&amp;_expand=chapter&amp;_sort=submittedAt&amp;_order=desc</code>', 'lịch sử quiz kèm tên chương, mới nhất trước'],
  ])}
<h3>Năm con số</h3>${bang(['Id', 'Ý nghĩa'], [
    ['<code>#stat-enrolled</code>', 'số khoá đã ghi danh'],
    ['<code>#stat-completed</code>', 'số khoá đạt 100% (và có ít nhất một bài)'],
    ['<code>#stat-lessons</code>', 'tổng số bài đã hoàn thành'],
    ['<code>#stat-quizzes</code>', 'số <b>chương</b> khác nhau có ít nhất một lượt đạt (đạt cùng quiz hai lần tính một)'],
    ['<code>#stat-avg</code>', 'trung bình <code>percent</code> mọi lượt, làm tròn, vd "67%"; chưa làm lượt nào ⇒ "—"'],
  ])}
<h3>Trường hợp biên</h3><ul><li>Chưa ghi danh ⇒ <code>#no-progress</code>; chưa làm quiz ⇒ <code>#no-quiz-history</code> và trung bình "—".</li><li>Kết quả của chương đã bị xoá vẫn hiện (chữ thay thế), trang không được sập.</li></ul>`,
};

const BAN_IN = banInF({
  k: 8, phut: 75, doKho: 'MEDIUM', moTa: MO_TA, bangDuLieu: ['results'], soDong: 4,
  wireframe: `
/progress                                                    (#progress-title "My Progress")
┌──────────┐┌──────────┐┌──────────┐┌──────────┐┌──────────┐
│    2     ││    0     ││    3     ││    1     ││   67%    │
│ enrolled ││completed ││ lessons  ││ quizzes  ││ avg quiz │  #stat-enrolled … #stat-avg
└──────────┘└──────────┘└──────────┘└──────────┘└──────────┘
Courses                                                       (#progress-table)
│ Course                │ Lessons │ Progress        │ Best quiz │
│ JavaScript Essentials │  0/3    │ ░░░░░░░░  0%    │   33%     │  tr.progress-row
│ React for Beginners   │  3/5    │ █████░░░ 60%    │  100%     │  .progress-course/-lessons/-percent/-best
Quiz history                                                  (#quiz-history)
│ Chapter                    │ Date       │ Score       │ Result │
│ Variables & Types          │ 12/09/2026 │ 1/3 (33%)   │ Failed │  tr.quiz-row
│ Getting Started with React │ 06/09/2026 │ 3/3 (100%)  │ Passed │  .quiz-chapter/-date/-score/-status`,
  chucNang: [
    { ten: { en: 'Summary numbers', vi: 'Các con số tổng' }, diem: 3, yeuCau: [
      { en: 'Protected route <code>/progress</code> (navbar <code>#nav-progress</code> for students): <code>#stat-enrolled</code>, <code>#stat-completed</code>, <code>#stat-lessons</code>, <code>#stat-quizzes</code>, <code>#stat-avg</code> computed as in the table above.', vi: 'Route có bảo vệ <code>/progress</code> (navbar <code>#nav-progress</code> cho học viên): <code>#stat-enrolled</code>, <code>#stat-completed</code>, <code>#stat-lessons</code>, <code>#stat-quizzes</code>, <code>#stat-avg</code> tính như bảng trên.' },
    ], hook: ['reduce', 'Set'], viDu: 'an@codelearn.vn ⇒ 2 · 0 · 3 · 1 · 67%' },
    { ten: { en: 'Per-course table', vi: 'Bảng từng khoá' }, diem: 3, yeuCau: [
      { en: '<code>#progress-table</code>, one <code>tr.progress-row</code> per enrolment (newest first): <code>.progress-course</code>, <code>.progress-lessons</code> "done/total", <code>.progress-percent</code> (ProgressBar "P%"), <code>.progress-best</code> best attempt % for that course or "—".', vi: '<code>#progress-table</code>, mỗi lượt ghi danh một <code>tr.progress-row</code> (mới nhất trước): <code>.progress-course</code>, <code>.progress-lessons</code> "xong/tổng", <code>.progress-percent</code> (ProgressBar "P%"), <code>.progress-best</code> % lượt cao nhất của khoá đó hoặc "—".' },
    ] },
    { ten: { en: 'Quiz history', vi: 'Lịch sử quiz' }, diem: 2.5, yeuCau: [
      { en: '<code>#quiz-history</code>, one <code>tr.quiz-row</code> per attempt, newest first: <code>.quiz-chapter</code> (chapter title via <code>_expand=chapter</code>), <code>.quiz-date</code> dd/mm/yyyy, <code>.quiz-score</code> "S/T (P%)", <code>.quiz-status</code> badge "Passed"/"Failed". Thunk <code>fetchMyResults</code> in the quiz slice.', vi: '<code>#quiz-history</code>, mỗi lượt một <code>tr.quiz-row</code>, mới nhất trước: <code>.quiz-chapter</code> (tên chương qua <code>_expand=chapter</code>), <code>.quiz-date</code> dd/mm/yyyy, <code>.quiz-score</code> "S/T (P%)", <code>.quiz-status</code> nhãn "Passed"/"Failed". Thunk <code>fetchMyResults</code> trong slice quiz.' },
    ], hook: ['_expand=chapter', 'Badge'] },
    { ten: { en: 'Empty states & access', vi: 'Trạng thái rỗng & quyền' }, diem: 1.5, yeuCau: [
      { en: '<code>#no-progress</code> / <code>#no-quiz-history</code>; guests ⇒ <code>/login</code>; loading ⇒ spinner, error ⇒ <code>#progress-error</code>.', vi: '<code>#no-progress</code> / <code>#no-quiz-history</code>; khách ⇒ <code>/login</code>; đang tải ⇒ spinner, lỗi ⇒ <code>#progress-error</code>.' },
    ] },
  ],
  idBatBuoc: [
    ['#nav-progress · #progress-title', { en: 'navigation', vi: 'điều hướng' }],
    ['#stat-enrolled #stat-completed #stat-lessons #stat-quizzes #stat-avg', { en: 'the value element itself (text = the number)', vi: 'chính phần tử giá trị (chữ = con số)' }],
    ['#progress-table tr.progress-row .progress-course .progress-lessons .progress-percent .progress-best', { en: 'courses table', vi: 'bảng khoá' }],
    ['#quiz-history tr.quiz-row .quiz-chapter .quiz-date .quiz-score .quiz-status', { en: 'history table', vi: 'bảng lịch sử' }],
    ['#no-progress #no-quiz-history #progress-error', { en: 'states', vi: 'trạng thái' }],
  ],
  truDiem: [
    { en: 'Counting quiz <i>attempts</i> instead of distinct passed chapters.', vi: 'Đếm số <i>lượt</i> làm quiz thay vì số chương khác nhau đã đạt.' },
    { en: 'Storing totals in db.json / localStorage that go stale.', vi: 'Lưu các con số tổng vào db.json / localStorage rồi bị cũ.' },
  ],
});

const KIEM = [
  // f1 — totals
  { nhom: 'f1', moTa: 'Five numbers for Nguyen Van An', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#stat-enrolled, #stat-completed, #stat-lessons, #stat-quizzes, #stat-avg', mongDoi: ['2', '0', '3', '1', '67%'] },
  { nhom: 'f1', moTa: 'Numbers follow the data (course 1 fully done)', url: '/progress', khoCucBo: dn(2), jsonServer: { base: B, db: { ...DB, enrollments: DB.enrollments.map((e) => (e.id === 1 ? { ...e, completedLessons: [1, 2, 3, 4, 5] } : e)) } }, kiem: 'danh-sach-text', selector: '#stat-enrolled, #stat-completed, #stat-lessons, #stat-quizzes, #stat-avg', mongDoi: ['2', '1', '5', '1', '67%'] },
  { nhom: 'f1', an: true, moTa: 'No attempts ⇒ average "—", 0 quizzes', url: '/progress', khoCucBo: dn(5), kiem: 'danh-sach-text', selector: '#stat-enrolled, #stat-completed, #stat-lessons, #stat-quizzes, #stat-avg', mongDoi: ['2', '0', '1', '0', '—'] },
  { nhom: 'f1', an: true, moTa: 'Passing the same chapter twice counts once', url: '/progress', khoCucBo: dn(2), jsonServer: { base: B, db: { ...DB, results: [...DB.results, { id: 5, userId: 2, courseId: 1, chapterId: 1, score: 3, total: 3, percent: 100, passed: true, answers: [1, 1, 0], submittedAt: '2026-10-01T08:00:00.000Z' }] } }, kiem: 'text', selector: '#stat-quizzes', giaTri: '1' },
  // f2 — per course
  { nhom: 'f2', moTa: 'Courses, newest enrolment first', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.progress-course', mongDoi: ['JavaScript Essentials', 'React for Beginners'] },
  { nhom: 'f2', moTa: 'Lessons done / total', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.progress-lessons', mongDoi: ['0/3', '3/5'] },
  { nhom: 'f2', moTa: 'Best quiz per course', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.progress-best', mongDoi: ['33%', '100%'] },
  { nhom: 'f2', an: true, moTa: 'Progress bars 0% and 60%', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.progress-percent', mongDoi: ['0%', '60%'] },
  // f3 — history
  { nhom: 'f3', moTa: 'History newest first with chapter titles', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.quiz-chapter', mongDoi: ['Variables & Types', 'Getting Started with React', 'Getting Started with React'] },
  { nhom: 'f3', moTa: 'Score and result badges', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.quiz-score, .quiz-status', mongDoi: ['1/3 (33%)', 'Failed', '3/3 (100%)', 'Passed', '2/3 (67%)', 'Failed'] },
  { nhom: 'f3', an: true, moTa: 'Dates as dd/mm/yyyy', url: '/progress', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.quiz-date', mongDoi: ['12/09/2026', '06/09/2026', '05/09/2026'] },
  { nhom: 'f3', an: true, moTa: 'A new attempt appears on top after taking a quiz', url: '/quiz/4', khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.quiz-row:first-child .quiz-chapter, .quiz-row:first-child .quiz-score', mongDoi: ['Variables & Types', '3/3 (100%)'], truoc: [cho(), click('#q9-o2'), click('#q10-o1'), click('#q11-o2'), gui('#quiz-form'), cho(), click('#nav-progress'), cho()] },
  { nhom: 'f3', an: true, moTa: 'History requested with _expand=chapter', url: '/progress', khoCucBo: dn(2), kiem: 'goi-fetch', khop: 'GET .*/results\\?(?=.*userId=2)(?=.*_expand=chapter)' },
  // f4 — empty & access
  { nhom: 'f4', moTa: 'No attempts ⇒ #no-quiz-history', url: '/progress', khoCucBo: dn(5), kiem: 'ton-tai', selector: '#no-quiz-history' },
  { nhom: 'f4', moTa: 'Guest ⇒ /login', url: '/progress', kiem: 'duong-dan', giaTri: '/login' },
  { nhom: 'f4', an: true, moTa: 'No enrolments ⇒ #no-progress', url: '/progress', khoCucBo: dn(2), jsonServer: { base: B, db: { ...DB, enrollments: [] } }, kiem: 'ton-tai', selector: '#no-progress' },
  { nhom: 'f4', an: true, moTa: 'Navbar "My Progress" opens /progress', url: '/', khoCucBo: dn(2), kiem: 'duong-dan', giaTri: '/progress', truoc: [cho(), click('#nav-progress'), cho()] },
];

export default doiDau(moduleF({
  k: 8, phut: 75, doKho: 'MEDIUM', banIn: BAN_IN, kiem: KIEM, url: '/progress',
  baiHoc: 'fer202-12-1-redux-toolkit',
  khaiNiem: ['derived statistics', 'reduce / Set / Math.max', 'combining two slices', '_expand=chapter', 'empty states'],
  viDu: [{ input: 'an@codelearn.vn opens /progress', output: '2 enrolled · 0 completed · 3 lessons · 1 quiz passed · 67% average', explanation: 'Average of 33, 100 and 67 = 66.67 ⇒ 67%; chapter 1 passed once even though attempted twice.|||Trung bình 33, 100, 67 = 66,67 ⇒ 67%; chương 1 đạt một lần dù làm hai lần.' }],
  thuatNgu: [{ en: 'dashboard', vi: 'bảng tổng quan' }, { en: 'distinct', vi: 'khác nhau (không đếm trùng)' }],
  goiY: [
    'Thêm <code>getResultsByUser(userId)</code> vào quizApi (<code>_expand: "chapter", _sort: "submittedAt", _order: "desc"</code>) và thunk <code>fetchMyResults</code> + <code>history</code> vào quizSlice. Trang dispatch cả <code>fetchMyEnrollments</code> lẫn <code>fetchMyResults</code>.',
    'Mỗi dòng khoá: <code>total = totals[e.courseId] ?? 0</code>, <code>done = Math.min(e.completedLessons.length, total)</code>, <code>best = Math.max(...history.filter(r =&gt; r.courseId === e.courseId).map(r =&gt; r.percent))</code> (mảng rỗng ⇒ "—").',
    'Quiz đạt: <code>new Set(history.filter(r =&gt; r.passed).map(r =&gt; r.chapterId)).size</code>. Trung bình: <code>Math.round(sum / history.length)</code> chỉ khi có lượt làm.',
  ],
  loiHayGap: [
    '<code>Math.max(...[])</code> = <code>-Infinity</code> ⇒ hiện "-Infinity%" cho khoá chưa làm quiz.',
    'Chia cho <code>history.length</code> = 0 ⇒ "NaN%".',
    'Đếm <code>results.filter(r =&gt; r.passed).length</code> ⇒ làm lại quiz đã đạt được cộng thêm điểm "quiz passed".',
    'Gọi <code>GET /results</code> không lọc <code>userId</code> ⇒ thấy kết quả của người khác.',
    'Hiện <code>new Date(r.submittedAt).toLocaleDateString()</code> ⇒ định dạng đổi theo máy (10/28/2026 trên máy tiếng Anh).',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> Two thunks feed the page: <code>fetchMyEnrollments</code> (with lesson totals) and the new <code>fetchMyResults</code> (<code>_expand=chapter</code>, newest first). The component builds one <code>rows</code> array — title, done, total, %, best attempt — and then every number is a one-line reduction over <code>rows</code> or <code>history</code>: completed courses, completed lessons, distinct passed chapters (<code>Set</code>), rounded average. Guards for empty arrays avoid NaN and -Infinity, and the loading/error states wait for both requests.</p>',
    vi: '<p><b>Hướng giải.</b> Hai thunk cấp dữ liệu: <code>fetchMyEnrollments</code> (kèm tổng số bài) và <code>fetchMyResults</code> mới (<code>_expand=chapter</code>, mới nhất trước). Component dựng một mảng <code>rows</code> — tên, xong, tổng, %, lượt cao nhất — rồi mỗi con số là một phép gộp một dòng trên <code>rows</code> hoặc <code>history</code>: số khoá xong, số bài xong, số chương đạt khác nhau (<code>Set</code>), trung bình làm tròn. Chặn mảng rỗng để không ra NaN/-Infinity; trạng thái đang tải/lỗi chờ cả hai request.</p>',
  },
}));
