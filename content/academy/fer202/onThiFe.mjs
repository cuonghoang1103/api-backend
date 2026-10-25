/**
 * FER202 · Ôn thi FE — chữa TRỌN đề trắc nghiệm thật (mục video tự thêm, ngoài slide trường). Tách riêng khỏi mục Ôn thi PE.
 * Mỗi đề = MỘT bài VIDEO dài (4 phần đã ghép bằng xuat/ghep-phan.mts ⇒ thư mục `-tron`), có mốc "Phần k — câu a–b".
 * Đề: content/exams/FER202-FE{1,2,8,6,7}.mjs (50 câu · 60 phút · 0,2 đ/câu · đạt ≥ 4/10). Thứ tự = thứ tự loạt video (đề mới nhất trước).
 * Video gắn qua content/course-videos/front-end-web-development-with-react.mjs (track VI/R2, slug `fer202-feK-chua-tron-de`).
 * Mốc thời gian lấy từ mo-ta-chuong.txt của bản ghép; thống kê chương lấy từ cảnh "Thống kê chương" ở phần 4 mỗi đề.
 */

const KHOA = '/courses/front-end-web-development-with-react/learn?lessonSlug=';

// một bài video = một đề FE
const fe = ({ so, ky, kyEn, dai, nhieuDA, nhieuDAEn, daGap, daGapEn, moc, chuong, chuongEn, onLai, meo, meoEn }) => ({
  title: `FE review · Exam ${so} (${kyEn}) — full walkthrough, 50 questions|||Ôn thi FE · Chữa trọn đề FE${so} (${ky}) · 50 câu`,
  slug: `fer202-fe${so}-chua-tron-de`,
  type: 'VIDEO',
  description: `Chữa trọn đề FE số ${so} kỳ ${ky}: 50 câu trắc nghiệm đúng thứ tự phòng thi, mỗi câu có ảnh đề gốc, dịch, từ vựng, vì sao từng đáp án sai/đúng và nhãn chương. Video ${dai}.`,
  content: `
<div class="ml-en">
<span class="eyebrow">FE review · real exam, added by this site</span>
<h2>FE exam ${so} (${kyEn}) — all 50 questions</h2>
<p class="lead">A full walkthrough of FER202 Final Exam paper ${so} from <b>${kyEn}</b>: 50 multiple-choice questions, 60 minutes, 0.2 marks each (pass ≥ 4/10). Questions go in exam-room order; each one shows the original question image, a Vietnamese translation, 2–4 key terms, why every option is right or wrong, and the chapter it belongs to. Video length ${dai}.</p>
<ul>
<li>${nhieuDAEn}</li>
<li>${daGapEn}</li>
</ul>
<h3>Chapters in the video</h3>
<ul>${moc.map(([t, en]) => `<li><b>${t}</b> — ${en}</li>`).join('')}</ul>
<h3>Which chapters this paper tests most</h3>
<ul>${chuongEn.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Review these lessons for the weak spots</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[0]}</a></li>`).join('')}</ul>
<div class="callout">How to study: when a question appears, <b>pause</b>, choose your answer, then listen. ${meoEn} Then redo the whole paper in the <a href="/exam">Exam room</a> → FER202 → Final Exam ${so}.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Ôn thi FE · đề thật, phần web tự thêm</span>
<h2>Chữa trọn đề FE${so} (${ky}) — đủ 50 câu</h2>
<p class="lead">Chữa trọn đề thi cuối kỳ FER202 số ${so}, kỳ <b>${ky}</b>: 50 câu trắc nghiệm, 60 phút, 0,2 điểm/câu (qua môn ≥ 4/10). Đi đúng thứ tự phòng thi; mỗi câu: ảnh đề gốc, dịch tiếng Việt, 2–4 từ vựng cần nhớ, vì sao từng đáp án sai/đúng, và nhãn chương của câu. Video dài ${dai}.</p>
<ul>
<li>${nhieuDA}</li>
<li>${daGap}</li>
</ul>
<h3>Các mốc trong video</h3>
<ul>${moc.map(([t, , vi]) => `<li><b>${t}</b> — ${vi}</li>`).join('')}</ul>
<h3>Đề này ra nhiều ở chương nào</h3>
<ul>${chuong.map((c) => `<li>${c}</li>`).join('')}</ul>
<h3>Ôn lại bài cho các lỗ hổng</h3>
<ul>${onLai.map(([s, t]) => `<li><a href="${KHOA}${s}">${t.split('|||')[1]}</a></li>`).join('')}</ul>
<div class="callout">Cách học: đề hiện lên thì <b>bấm dừng</b>, tự chọn đáp án, rồi mới nghe lời giải. ${meo} Xong video, làm lại cả đề trong <a href="/exam">Phòng thi</a> → FER202 → Đề thi cuối kỳ số ${so}.</div>
</div>`,
});

const L = {
  c4: ['fer202-4-1-bootstrap', 'FER202 4.1 — Bootstrap grid & React-Bootstrap|||FER202 4.1 — Grid Bootstrap & React-Bootstrap'],
  c5: ['fer202-5-1-components-props', 'FER202 5.1 — Components & props|||FER202 5.1 — Component & props'],
  c5pt: ['fer202-5-ex19-proptypes', 'Exercise 19 — PropTypes|||Exercise 19 — PropTypes'],
  c6: ['fer202-6-1-events-forms', 'FER202 6.1 — Event handlers, synthetic events & forms|||FER202 6.1 — Event handler, synthetic event & form'],
  c7: ['fer202-7-1-context', 'FER202 7.1 — Prop drilling & the Context API|||FER202 7.1 — Prop drilling & Context API'],
  c8: ['fer202-8-1-usestate-useeffect', 'FER202 8.1 — useState & useEffect|||FER202 8.1 — useState & useEffect'],
  c8b: ['fer202-8-2-usecontext-usereducer', 'FER202 8.2 — useContext & useReducer|||FER202 8.2 — useContext & useReducer'],
  c9: ['fer202-9-1-router', 'FER202 9.1 — Routes, params & links|||FER202 9.1 — Route, tham số & link'],
  c10: ['fer202-10-1-lazy-suspense', 'FER202 10.1 — lazy() & Suspense|||FER202 10.1 — lazy() & Suspense'],
  c11: ['fer202-11-1-fetch-async', 'FER202 11.1 — fetch, promises & async/await|||FER202 11.1 — fetch, promise & async/await'],
  c11b: ['fer202-11-2-axios-json-server', 'FER202 11.2 — Axios & json-server|||FER202 11.2 — Axios & json-server'],
  c12: ['fer202-12-1-redux-toolkit', 'FER202 12.1 — Flux & Redux Toolkit|||FER202 12.1 — Flux & Redux Toolkit'],
  c12b: ['fer202-12-2-thunk-middleware', 'FER202 12.2 — combineReducers, thunk & middleware|||FER202 12.2 — combineReducers, thunk & middleware'],
  a1: ['fer202-a1-1-performance', 'FER202 A1.1 — memo, useMemo & useCallback|||FER202 A1.1 — memo, useMemo & useCallback'],
  a3: ['fer202-a3-1-typescript-nextjs', 'FER202 A3.1 — TypeScript & Next.js|||FER202 A3.1 — TypeScript & Next.js'],
  fe: ['fer202-final-exam-fe', 'FE — Final Exam: format & sample questions|||FE — Thi trắc nghiệm: cấu trúc & câu mẫu'],
};

export default [
  fe({
    so: 1, ky: 'SP26 B5FE', kyEn: 'SP26 B5FE', dai: '55 phút',
    nhieuDA: 'Hai câu chọn HAI đáp án: câu 13 và câu 50 — chọn thiếu một là mất cả câu.',
    nhieuDAEn: 'Two "choose two" questions: 13 and 50 — missing one option loses the whole question.',
    daGap: '26/50 câu đã gặp trong video chữa quiz chương ⇒ chữa ngắn và chỉ đường về video đó; câu mới chữa đầy đủ.',
    daGapEn: '26 of the 50 questions were already covered in the chapter quiz videos — short recap plus a pointer; new questions get the full treatment.',
    moc: [
      ['0:00', 'Part 1 — questions 1–13 (exam structure, time plan, lazy/Suspense, fetch, props, useReducer, memo)', 'Phần 1 — câu 1–13 (cấu trúc đề, chia giờ, lazy/Suspense, fetch, props, useReducer, memo)'],
      ['16:10', 'Part 2 — questions 14–26 (React Router, Redux, Hooks)', 'Phần 2 — câu 14–26 (React Router, Redux, Hooks)'],
      ['31:09', 'Part 3 — questions 27–40', 'Phần 3 — câu 27–40'],
      ['43:29', 'Part 4 — questions 41–50 + chapter statistics', 'Phần 4 — câu 41–50 + thống kê chương'],
    ],
    chuong: [
      'Chương 4 — Bootstrap: 7 câu (nhiều nhất) · Chương 5 — component & state: 6 câu · Chương 9 — React Router: 5 câu',
      'Lỗ hổng nên ôn: React Router (5 câu, Ch9) · lazy, Suspense & code splitting (4 câu, Ch10) · Redux & Thunk (3 câu, Ch12) · fetch & json-server (3 câu, Ch11) · Hooks (3 câu, Ch8) · Next.js (3 câu, Nâng cao A3)',
    ],
    chuongEn: [
      'Chapter 4 — Bootstrap: 7 questions (most) · Chapter 5 — components & state: 6 · Chapter 9 — React Router: 5',
      'Weak spots worth reviewing: React Router (5, Ch9) · lazy, Suspense & code splitting (4, Ch10) · Redux & Thunk (3, Ch12) · fetch & json-server (3, Ch11) · Hooks (3, Ch8) · Next.js (3, Advanced A3)',
    ],
    onLai: [L.c9, L.c10, L.c12, L.c11, L.c8, L.a3],
    meo: 'Câu đề hay lặp một ý mà đổi vỏ (lazy + Suspense ra 4 lần); nhớ nội dung đáp án chứ đừng nhớ chữ cái, và chữ NOT là hỏi ngược.',
    meoEn: 'The paper repeats one idea in different wording (lazy + Suspense appears 4 times); remember the answer content, not the letter, and NOT means the question is reversed.',
  }),
  fe({
    so: 2, ky: 'SP26', kyEn: 'SP26', dai: '56 phút',
    nhieuDA: 'Ba câu chọn nhiều đáp án: câu 19, câu 28 (chọn BA) và câu 33 — thiếu một là mất cả câu.',
    nhieuDAEn: 'Three multiple-answer questions: 19, 28 (choose THREE) and 33 — missing one loses the whole question.',
    daGap: '20/50 câu đã gặp trong video chữa quiz chương; 30 câu còn lại chữa đầy đủ. Đề nặng Redux, Axios, React Router, Hooks và Next.js.',
    daGapEn: '20 of the 50 questions were covered in the chapter quiz videos; the other 30 get the full treatment. Heavy on Redux, Axios, React Router, Hooks and Next.js.',
    moc: [
      ['0:00', 'Part 1 — questions 1–10 (exam structure, time plan)', 'Phần 1 — câu 1–10 (cấu trúc đề, chia giờ)'],
      ['12:55', 'Part 2 — questions 11–22', 'Phần 2 — câu 11–22'],
      ['27:17', 'Part 3 — questions 23–40', 'Phần 3 — câu 23–40'],
      ['41:32', 'Part 4 — questions 41–50 + chapter statistics', 'Phần 4 — câu 41–50 + thống kê chương'],
    ],
    chuong: [
      'Chương 4 — Bootstrap: 9 câu (gần như toàn câu đã gặp) · Chương 12 — Redux: 7 câu · Hooks, React Router, gọi API: mỗi mảng 5 câu',
      'Lỗ hổng nên ôn: Redux (7 câu, Ch12: store, hook, middleware, Flux) · Hooks (5 câu, Ch8: cleanup, closure, state bất biến) · React Router (5 câu, Ch9: route, useParams, navigate, route lồng) · gọi API (5 câu, Ch11: Axios, fetch, mã HTTP) · Context & PropTypes (4 câu, Ch7) · Next.js (3 câu, Nâng cao A3)',
      'So với FE1: nặng Redux hơn, ít Bootstrap hơn, nhưng lỗ hổng gần như trùng — ôn Router, Redux, Hooks, gọi API, Next.js là phủ phần lớn câu mới của cả hai đề.',
    ],
    chuongEn: [
      'Chapter 4 — Bootstrap: 9 questions (almost all seen before) · Chapter 12 — Redux: 7 · Hooks, React Router, API calls: 5 each',
      'Weak spots worth reviewing: Redux (7, Ch12: store, hooks, middleware, Flux) · Hooks (5, Ch8: cleanup, closures, immutable state) · React Router (5, Ch9: routes, useParams, navigate, nested routes) · API calls (5, Ch11: Axios, fetch, HTTP codes) · Context & PropTypes (4, Ch7) · Next.js (3, Advanced A3)',
      'Compared with FE1: more Redux, less Bootstrap, but the same weak spots — Router, Redux, Hooks, API calls and Next.js cover most new questions of both papers.',
    ],
    onLai: [L.c12, L.c12b, L.c8, L.c9, L.c11b, L.c7, L.a3],
    meo: 'Gặp câu chọn nhiều đáp án thì đếm đủ số đáp án đề đòi trước khi sang câu khác.',
    meoEn: 'On a multiple-answer question, count that you picked as many options as asked before moving on.',
  }),
  fe({
    so: 8, ky: 'SU25', kyEn: 'SU25', dai: '48 phút',
    nhieuDA: 'Không có câu chọn nhiều đáp án — mỗi câu đúng một đáp án.',
    nhieuDAEn: 'No multiple-answer questions — every question has exactly one correct option.',
    daGap: '32 câu đã gặp ở video chữa quiz chương, 2 câu ở các đề trước, 16 câu mới. Đề trộn kiến thức nền (ES6, Promise, Bootstrap, PropTypes) với Redux, Router, Next.js.',
    daGapEn: '32 questions were covered in the chapter quiz videos, 2 in earlier papers, 16 are new. A mix of fundamentals (ES6, Promises, Bootstrap, PropTypes) with Redux, Router and Next.js.',
    moc: [
      ['0:00', 'Part 1 — questions 1–13 (exam structure, time plan)', 'Phần 1 — câu 1–13 (cấu trúc đề, chia giờ)'],
      ['13:56', 'Part 2 — questions 14–28', 'Phần 2 — câu 14–28'],
      ['26:26', 'Part 3 — questions 29–40', 'Phần 3 — câu 29–40'],
      ['36:37', 'Part 4 — questions 41–50 + chapter statistics', 'Phần 4 — câu 41–50 + thống kê chương'],
    ],
    chuong: [
      'Chương 4 — Bootstrap: 8 câu (gần như toàn câu đã gặp) · Chương 7 — props & Context: 5 câu · Chương 12 — Redux: 5 câu',
      'Lỗ hổng nên ôn: Redux (5 câu, Ch12: action phải có type, reducer thuần, một store, cập nhật bất biến, Flux) · props, PropTypes & Context (5 câu, Ch7) · gọi API (4 câu, Ch11: fetch, Axios, mã HTTP, REST) · Next.js (3 câu, A3: create-next-app, route động) · lazy & Suspense (3 câu, Ch10) · Hooks và chu trình render trigger → render → commit (Ch8, Ch6)',
    ],
    chuongEn: [
      'Chapter 4 — Bootstrap: 8 questions (almost all seen before) · Chapter 7 — props & Context: 5 · Chapter 12 — Redux: 5',
      'Weak spots worth reviewing: Redux (5, Ch12: actions need a type, pure reducers, one store, immutable updates, Flux) · props, PropTypes & Context (5, Ch7) · API calls (4, Ch11: fetch, Axios, HTTP codes, REST) · Next.js (3, A3: create-next-app, dynamic routes) · lazy & Suspense (3, Ch10) · Hooks and the trigger → render → commit cycle (Ch8, Ch6)',
    ],
    onLai: [L.c12, L.c7, L.c5pt, L.c11b, L.a3, L.c10, L.c8],
    meo: 'Đề này ít React Router hơn nhưng lặp lại Redux, Context và gọi API — ôn kèm Router và Hooks từ FE1, FE2.',
    meoEn: 'Less React Router here, but Redux, Context and API calls repeat — review them together with Router and Hooks from FE1 and FE2.',
  }),
  fe({
    so: 6, ky: 'SU25 thi lại', kyEn: 'SU25 retake', dai: '46 phút',
    nhieuDA: 'Đúng một câu chọn nhiều đáp án: câu 37, phải chọn BA đáp án.',
    nhieuDAEn: 'Exactly one multiple-answer question: 37, choose THREE.',
    daGap: 'Đề thi lại gần như một lượt tổng duyệt: 36/50 câu đã gặp ở video chữa quiz chương. Câu mới tập trung ở Redux và Next.js; hai câu (11 PropTypes, 39 synthetic event) các đề chấm khác nhau — video nói rõ cả "đề chấm gì" lẫn sự thật kỹ thuật.',
    daGapEn: 'The retake is almost a full revision: 36 of 50 questions were covered in the chapter quiz videos. New ones are mostly Redux and Next.js; two questions (11 PropTypes, 39 synthetic events) are graded differently across papers — the video explains both the graded answer and the technical truth.',
    moc: [
      ['0:00', 'Part 1 — questions 1–13 (exam structure, time plan)', 'Phần 1 — câu 1–13 (cấu trúc đề, chia giờ)'],
      ['14:48', 'Part 2 — questions 14–30', 'Phần 2 — câu 14–30'],
      ['26:42', 'Part 3 — questions 31–44', 'Phần 3 — câu 31–44'],
      ['38:47', 'Part 4 — questions 45–50 + chapter statistics', 'Phần 4 — câu 45–50 + thống kê chương'],
    ],
    chuong: [
      'Chương 4 — Bootstrap: 7 câu (nhiều nhất) · Chương 5 — component & state, Chương 8 — Hooks, Chương 9 — React Router: mỗi chương 5 câu',
      'Lỗ hổng nên ôn: Redux (4 câu, Ch12: initial state, reducer thuần, thunk, selector) · Next.js & Tailwind (4 câu, Nâng cao A3) · hai câu chấm khác nhau giữa các đề (11, 39) · chạy lại Hooks, React Router và lazy/Suspense vì lặp nhiều',
    ],
    chuongEn: [
      'Chapter 4 — Bootstrap: 7 questions (most) · Chapter 5 — components & state, Chapter 8 — Hooks, Chapter 9 — React Router: 5 each',
      'Weak spots worth reviewing: Redux (4, Ch12: initial state, pure reducers, thunk, selectors) · Next.js & Tailwind (4, Advanced A3) · the two questions graded differently across papers (11, 39) · rerun Hooks, React Router and lazy/Suspense — they repeat a lot',
    ],
    onLai: [L.c12, L.c12b, L.a3, L.c5pt, L.c6, L.c8, L.c9, L.c10],
    meo: 'Với hai câu chấm khác nhau, nhớ cả hai mặt: đáp án đề chấm và sự thật kỹ thuật.',
    meoEn: 'For the two inconsistently graded questions, remember both the graded answer and the technical truth.',
  }),
  fe({
    so: 7, ky: 'SP 2025', kyEn: 'SP 2025', dai: '41 phút',
    nhieuDA: 'Không có câu chọn nhiều đáp án — mỗi câu đúng một đáp án.',
    nhieuDAEn: 'No multiple-answer questions — every question has exactly one correct option.',
    daGap: 'Đề cuối của loạt và gần như toàn câu đã gặp: 43 câu ở video chữa quiz chương, 6 câu ở các đề trước trong loạt, chỉ 1 câu mới — làm kỹ đề này là ôn gần hết các dạng hay ra.',
    daGapEn: 'The last paper of the series and almost all familiar: 43 questions from the chapter quiz videos, 6 from earlier papers in the series, only 1 new — a great final revision.',
    moc: [
      ['0:00', 'Part 1 — questions 1–13 (exam structure, time plan)', 'Phần 1 — câu 1–13 (cấu trúc đề, chia giờ)'],
      ['11:50', 'Part 2 — questions 14–26', 'Phần 2 — câu 14–26'],
      ['21:57', 'Part 3 — questions 27–39', 'Phần 3 — câu 27–39'],
      ['31:22', 'Part 4 — questions 40–50 + chapter statistics', 'Phần 4 — câu 40–50 + thống kê chương'],
    ],
    chuong: [
      'Chương 4 — Bootstrap: 8 câu (nhiều nhất) · Chương 1 — nền tảng & Git: 6 câu · React Router và Next.js: mỗi mảng 5 câu',
      'Lỗ hổng nên ôn: Next.js (5 câu, Nâng cao A3) · Redux (4 câu, Ch12: action, reducer thuần, selector, dòng chảy middleware) · React Router & json-server (5 câu, Ch9) + 2 câu HTTP (Ch11) · Hooks & PropTypes (4 câu, Ch8) + 1 câu useMemo/useCallback (A1) · lazy & Suspense (4 câu, Ch10) · sự kiện (4 câu, Ch6 — có câu ref ném TypeError)',
    ],
    chuongEn: [
      'Chapter 4 — Bootstrap: 8 questions (most) · Chapter 1 — fundamentals & Git: 6 · React Router and Next.js: 5 each',
      'Weak spots worth reviewing: Next.js (5, Advanced A3) · Redux (4, Ch12: actions, pure reducers, selectors, middleware flow) · React Router & json-server (5, Ch9) + 2 HTTP questions (Ch11) · Hooks & PropTypes (4, Ch8) + 1 useMemo/useCallback question (A1) · lazy & Suspense (4, Ch10) · events (4, Ch6 — including the ref that throws a TypeError)',
    ],
    onLai: [L.a3, L.c12, L.c9, L.c11, L.c8, L.a1, L.c10, L.c6],
    meo: 'Sau năm đề FE1, FE2, FE8, FE6, FE7 bạn đã đi qua phần lớn dạng câu của đề trắc nghiệm FER202 — phần còn lại là làm lại cho nhớ chắc.',
    meoEn: 'After FE1, FE2, FE8, FE6 and FE7 you have seen most question types of the FER202 multiple-choice exam — what is left is redoing them until they stick.',
  }),
];
