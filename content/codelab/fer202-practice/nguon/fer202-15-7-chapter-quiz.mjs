/**
 * CodeLearn · F7 — quiz cuối chương: tải câu hỏi, chọn đáp án (radio), bắt trả lời hết, chấm ≥ 70% đạt, lưu results,
 * xem lại đúng/sai + giải thích, làm lại.
 */
import { doiDau } from './_chung.mjs';
import { banInF, bang, click, cho, dn, gui, moduleF } from './_codelearn.mjs';

const MO_TA = {
  en: `<p>Every chapter ends with a quiz made of all questions whose <code>chapterId</code> is that chapter. The student picks one option per question (radio buttons), submits, and sees the score; <b>70% or more passes</b>. After submitting, every question shows whether it was right, highlights the correct option, crosses out a wrong choice and shows the explanation. Each attempt is stored in <code>results</code> so F8 can show the history. "Retake quiz" clears the answers.</p>
<h3>API calls</h3>${bang(['When', 'Request'], [
    ['open <code>/quiz/:chapterId</code>', '<code>GET /chapters/:id</code> (title + courseId) and <code>GET /questions?chapterId=:id</code>; enrolments of the student (F5)'],
    ['submit', '<code>POST /results</code> <code>{ userId, courseId, chapterId, score, total, percent, passed, answers: [optionIndex…], submittedAt }</code>'],
  ])}
<p><b>Scoring</b>: <code>score</code> = number of questions where the chosen index <code>===</code> <code>answerIndex</code>; <code>percent = Math.round(score / total × 100)</code>; <code>passed = percent ≥ 70</code>. (json-server sends <code>answerIndex</code> to the browser — a real back end would grade on the server; expect that question in the defence.)</p>
<h3>Edge cases</h3><ul><li>Submit with unanswered questions ⇒ <code>#quiz-error</code> "Please answer all questions (N unanswered)." and <b>no</b> request.</li><li>Not enrolled in the chapter's course ⇒ <code>#not-enrolled</code>; chapter without questions ⇒ <code>#no-questions</code>; unknown chapter ⇒ <code>#quiz-not-found</code>.</li><li>After submitting, options are locked until "Retake quiz". Opening another chapter starts clean.</li></ul>`,
  vi: `<p>Mỗi chương kết thúc bằng một quiz gồm mọi câu hỏi có <code>chapterId</code> là chương đó. Học viên chọn một phương án mỗi câu (radio), nộp, và xem điểm; <b>từ 70% là đạt</b>. Sau khi nộp, từng câu cho biết đúng hay sai, tô đáp án đúng, gạch lựa chọn sai và hiện giải thích. Mỗi lượt làm lưu vào <code>results</code> để F8 hiện lịch sử. "Retake quiz" xoá câu trả lời.</p>
<h3>Lời gọi API</h3>${bang(['Khi nào', 'Request'], [
    ['mở <code>/quiz/:chapterId</code>', '<code>GET /chapters/:id</code> (tên + courseId) và <code>GET /questions?chapterId=:id</code>; lượt ghi danh của học viên (F5)'],
    ['nộp', '<code>POST /results</code> <code>{ userId, courseId, chapterId, score, total, percent, passed, answers: [chỉ số phương án…], submittedAt }</code>'],
  ])}
<p><b>Chấm</b>: <code>score</code> = số câu có chỉ số đã chọn <code>===</code> <code>answerIndex</code>; <code>percent = Math.round(score / total × 100)</code>; <code>passed = percent ≥ 70</code>. (json-server gửi cả <code>answerIndex</code> về trình duyệt — back end thật phải chấm ở máy chủ; GV hay hỏi câu này khi bảo vệ.)</p>
<h3>Trường hợp biên</h3><ul><li>Nộp khi còn câu chưa trả lời ⇒ <code>#quiz-error</code> "Please answer all questions (N unanswered)." và <b>không</b> gửi request.</li><li>Chưa ghi danh khoá của chương ⇒ <code>#not-enrolled</code>; chương chưa có câu hỏi ⇒ <code>#no-questions</code>; chương lạ ⇒ <code>#quiz-not-found</code>.</li><li>Đã nộp thì khoá lựa chọn cho tới khi "Retake quiz". Mở chương khác thì bắt đầu sạch.</li></ul>`,
};

const BAN_IN = banInF({
  k: 7, phut: 120, moTa: MO_TA, bangDuLieu: ['questions'], soDong: 3,
  wireframe: `
/quiz/1
← Back to lessons                                          (#back-to-learn)
Quiz: Getting Started with React                               (#quiz-title)
3 questions · pass mark 70%
[✔ You scored 2/3 (67%) — Not passed]                         (#quiz-result)
┌ .question#q-1 (.correct) ──────────────────────────────────────────────┐
│ 1. What does JSX compile to?                         .question-text     │
│ ( ) Plain HTML strings            ← input#q1-o0                         │
│ (•) React.createElement() calls   ← input#q1-o1   .option-correct       │
│ 💡 The build tool turns every JSX tag …               .explanation      │
└─────────────────────────────────────────────────────────────────────────┘
┌ .question#q-2 (.incorrect) … (•) npm create-react-app my-app  .option-wrong ┐
[!] Please answer all questions (1 unanswered).                (#quiz-error)
[ Submit answers ] (#submit-quiz)   →   [ Retake quiz ] (#retake-quiz)
Learn page sidebar: "📝 Chapter quiz" under each chapter (.chapter-quiz#quiz-link-CHAPTERID)`,
  chucNang: [
    { ten: { en: 'Load & guard', vi: 'Tải & chặn' }, diem: 2, yeuCau: [
      { en: 'Protected route <code>/quiz/:chapterId</code>: <code>#quiz-title</code> "Quiz: &lt;chapter title&gt;", one <code>.question#q-&lt;id&gt;</code> per question with <code>.question-text</code> "N. content". Guards: <code>#not-enrolled</code>, <code>#no-questions</code>, <code>#quiz-not-found</code>.', vi: 'Route có bảo vệ <code>/quiz/:chapterId</code>: <code>#quiz-title</code> "Quiz: &lt;tên chương&gt;", mỗi câu một <code>.question#q-&lt;id&gt;</code> có <code>.question-text</code> "N. nội dung". Chặn: <code>#not-enrolled</code>, <code>#no-questions</code>, <code>#quiz-not-found</code>.' },
    ], hook: ['useParams', 'Promise.all'] },
    { ten: { en: 'Answering & validation', vi: 'Trả lời & kiểm' }, diem: 2, yeuCau: [
      { en: 'Radio inputs <code>#q&lt;questionId&gt;-o&lt;optionIndex&gt;</code> (e.g. <code>#q1-o1</code>), one group per question (<code>name</code>); answers kept in the store as <code>{ [questionId]: optionIndex }</code>. Submitting <code>#quiz-form</code> with gaps ⇒ <code>#quiz-error</code>, no POST.', vi: 'Radio <code>#q&lt;questionId&gt;-o&lt;chỉ số&gt;</code> (vd <code>#q1-o1</code>), mỗi câu một nhóm (<code>name</code>); câu trả lời giữ trong store dạng <code>{ [questionId]: chỉ số }</code>. Nộp <code>#quiz-form</code> khi còn thiếu ⇒ <code>#quiz-error</code>, không POST.' },
    ], hook: ['Form.Check type="radio"'] },
    { ten: { en: 'Score & save', vi: 'Chấm & lưu' }, diem: 3, yeuCau: [
      { en: '<code>#quiz-result</code> "You scored S/T (P%) — Passed 🎉" or "— Not passed"; the attempt is POSTed to <code>results</code> with numbers and booleans (not strings).', vi: '<code>#quiz-result</code> "You scored S/T (P%) — Passed 🎉" hoặc "— Not passed"; lượt làm được POST vào <code>results</code> với số và boolean (không phải chuỗi).' },
    ], hook: ['createAsyncThunk', 'getState'], viDu: 'q1 ✓, q2 ✗, q3 ✓ ⇒ "You scored 2/3 (67%) — Not passed" · POST /results { score: 2, total: 3, percent: 67, passed: false, answers: [1, 0, 0] }' },
    { ten: { en: 'Review & retake', vi: 'Xem lại & làm lại' }, diem: 2, yeuCau: [
      { en: 'After submitting: each <code>.question</code> gets <code>correct</code> or <code>incorrect</code>; the right option has <code>option-correct</code>, a wrong pick <code>option-wrong</code>; <code>.explanation</code> appears; inputs are disabled. <code>#retake-quiz</code> clears answers and result.', vi: 'Sau khi nộp: mỗi <code>.question</code> có class <code>correct</code> hoặc <code>incorrect</code>; phương án đúng có <code>option-correct</code>, lựa chọn sai có <code>option-wrong</code>; hiện <code>.explanation</code>; khoá các ô chọn. <code>#retake-quiz</code> xoá câu trả lời và kết quả.' },
    ] },
    { ten: { en: 'Links & slice', vi: 'Link & slice' }, diem: 1, yeuCau: [
      { en: 'Learn page sidebar: <code>.chapter-quiz#quiz-link-&lt;chapterId&gt;</code> under every chapter. <code>features/quiz/quizSlice.js</code>: <code>fetchQuiz</code>, <code>submitQuiz</code>, reducers <code>answerSelected</code>, <code>retakeQuiz</code>; pure <code>scoreQuiz()</code> in <code>utils/learning.js</code>.', vi: 'Thanh bên trang học: <code>.chapter-quiz#quiz-link-&lt;chapterId&gt;</code> dưới mỗi chương. <code>features/quiz/quizSlice.js</code>: <code>fetchQuiz</code>, <code>submitQuiz</code>, reducer <code>answerSelected</code>, <code>retakeQuiz</code>; hàm thuần <code>scoreQuiz()</code> ở <code>utils/learning.js</code>.' },
    ] },
  ],
  idBatBuoc: [
    ['#quiz-title #quiz-form .question#q-ID .question-text #qQID-oN', { en: 'quiz form', vi: 'form quiz' }],
    ['#submit-quiz #quiz-error #quiz-result #retake-quiz #quiz-save-error #back-to-learn', { en: 'actions + messages', vi: 'thao tác + thông báo' }],
    ['.correct .incorrect .option-correct .option-wrong .explanation', { en: 'review classes', vi: 'class xem lại' }],
    ['#not-enrolled #no-questions #quiz-not-found · .chapter-quiz#quiz-link-ID', { en: 'guards + links', vi: 'chặn + link' }],
  ],
  truDiem: [
    { en: 'Comparing the chosen option as a string ("1") with <code>answerIndex</code> (number) ⇒ every answer counted wrong.', vi: 'So phương án đã chọn dạng chuỗi ("1") với <code>answerIndex</code> (số) ⇒ câu nào cũng sai.' },
    { en: 'Score shown but never saved (F8 has nothing to show).', vi: 'Có hiện điểm nhưng không lưu (F8 không có gì để hiện).' },
  ],
});

const DUNG = [click('#q1-o1'), click('#q2-o1'), click('#q3-o0')];
const HAI_BA = [click('#q1-o1'), click('#q2-o0'), click('#q3-o0')];
const NOP = (chon) => [cho(), ...chon, gui('#quiz-form'), cho()];
const Q = '/quiz/1';
const KIEM = [
  // f1 — load & guard
  { nhom: 'f1', moTa: 'Title and 3 questions', url: Q, khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#quiz-title, .question-text', mongDoi: ['Quiz: Getting Started with React', '1. What does JSX compile to?', '2. Which command creates a new React app with Create React App?', '3. Which file renders <App /> into #root in a CRA project?'] },
  { nhom: 'f1', moTa: 'Each question has 4 radio options', url: Q, khoCucBo: dn(2), kiem: 'so-luong', selector: '#q-1 input[type=radio]', giaTri: 4 },
  { nhom: 'f1', moTa: 'Not enrolled in the course ⇒ #not-enrolled', url: '/quiz/6', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#not-enrolled' },
  { nhom: 'f1', an: true, moTa: 'Chapter without questions ⇒ #no-questions', url: '/quiz/5', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#no-questions' },
  { nhom: 'f1', an: true, moTa: 'Unknown chapter ⇒ #quiz-not-found', url: '/quiz/99', khoCucBo: dn(2), kiem: 'ton-tai', selector: '#quiz-not-found' },
  { nhom: 'f1', an: true, moTa: 'Guest ⇒ /login', url: Q, kiem: 'duong-dan', giaTri: '/login' },
  // f2 — answering & validation
  { nhom: 'f2', moTa: 'Submitting with nothing answered is refused', url: Q, khoCucBo: dn(2), kiem: 'text', selector: '#quiz-error', giaTri: 'Please answer all questions (3 unanswered).', truoc: NOP([]) },
  { nhom: 'f2', moTa: 'Clicking an option checks it (controlled radio)', url: Q, khoCucBo: dn(2), kiem: 'thuoc-tinh-js', selector: '#q1-o1', thuocTinh: 'checked', giaTri: true, truoc: [cho(), click('#q1-o1'), cho(100)] },
  { nhom: 'f2', an: true, moTa: 'One answered ⇒ "(2 unanswered)"', url: Q, khoCucBo: dn(2), kiem: 'text', selector: '#quiz-error', giaTri: 'Please answer all questions (2 unanswered).', truoc: NOP([click('#q2-o3')]) },
  { nhom: 'f2', an: true, moTa: 'Changing the answer unchecks the previous option', url: Q, khoCucBo: dn(2), kiem: 'thuoc-tinh-js', selector: '#q1-o1', thuocTinh: 'checked', giaTri: false, truoc: [cho(), click('#q1-o1'), click('#q1-o2'), cho(100)] },
  { nhom: 'f2', an: true, moTa: 'Incomplete answers ⇒ no POST /results', url: Q, khoCucBo: dn(2), kiem: 'goi-fetch', khop: '^POST .*/results', min: 0, max: 0, truoc: NOP([click('#q1-o1')]) },
  // f3 — score & save
  { nhom: 'f3', moTa: 'All correct ⇒ 3/3 (100%) — Passed', url: Q, khoCucBo: dn(2), kiem: 'text', selector: '#quiz-result', khop: '^You scored 3/3 \\(100%\\) — Passed', truoc: NOP(DUNG) },
  { nhom: 'f3', moTa: '2 of 3 ⇒ 2/3 (67%) — Not passed', url: Q, khoCucBo: dn(2), kiem: 'text', selector: '#quiz-result', khop: '^You scored 2/3 \\(67%\\) — Not passed', truoc: NOP(HAI_BA) },
  { nhom: 'f3', moTa: 'Attempt saved to results with real numbers/booleans', url: Q, khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'results', chat: true, chua: { id: 5, userId: 2, courseId: 1, chapterId: 1, score: 3, total: 3, percent: 100, passed: true }, truoc: NOP(DUNG) },
  { nhom: 'f3', an: true, moTa: 'Chosen option indexes saved in question order', url: Q, khoCucBo: dn(2), kiem: 'du-lieu-server', bang: 'results', chat: true, chua: { id: 5, answers: [1, 0, 0], percent: 67, passed: false }, truoc: NOP(HAI_BA) },
  // f4 — review & retake
  { nhom: 'f4', moTa: 'Wrong question marked .incorrect, others .correct', url: Q, khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.question.incorrect .question-text', mongDoi: ['2. Which command creates a new React app with Create React App?'], truoc: NOP(HAI_BA) },
  { nhom: 'f4', moTa: 'Correct option highlighted in every question + explanations', url: Q, khoCucBo: dn(2), kiem: 'so-luong', selector: '.option-correct', giaTri: 3, truoc: NOP(HAI_BA) },
  { nhom: 'f4', an: true, moTa: 'Wrong pick marked .option-wrong and explanations shown', url: Q, khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '.option-wrong', mongDoi: ['npm create-react-app my-app'], truoc: NOP(HAI_BA) },
  { nhom: 'f4', an: true, moTa: 'Inputs locked after submit', url: Q, khoCucBo: dn(2), kiem: 'thuoc-tinh-js', selector: '#q1-o0', thuocTinh: 'disabled', giaTri: true, truoc: NOP(HAI_BA) },
  { nhom: 'f4', moTa: 'Retake clears the result and the answers', url: Q, khoCucBo: dn(2), kiem: 'danh-sach-text', selector: '#quiz-result, #submit-quiz, .question.correct', mongDoi: ['Submit answers'], truoc: [...NOP(HAI_BA), click('#retake-quiz'), cho(200)] },
  // f5 — links & slice
  { nhom: 'f5', moTa: 'Learn page links every chapter to its quiz', url: '/learn/1/lessons/1', khoCucBo: dn(2), kiem: 'so-luong', selector: '.chapter-quiz', giaTri: 3 },
  { nhom: 'f5', moTa: 'Quiz link of chapter 1 → /quiz/1', url: '/learn/1/lessons/1', khoCucBo: dn(2), kiem: 'thuoc-tinh', selector: '#quiz-link-1', thuocTinh: 'href', khop: '/quiz/1$' },
  { nhom: 'f5', an: true, moTa: 'quizSlice uses createAsyncThunk for load and submit', kiem: 'ma-nguon', tep: 'src/features/quiz/quizSlice.js', khop: 'createAsyncThunk\\([\\s\\S]*createAsyncThunk\\(' },
];

export default doiDau(moduleF({
  k: 7, phut: 120, banIn: BAN_IN, kiem: KIEM, url: Q,
  baiHoc: 'fer202-6-1-events-forms',
  khaiNiem: ['controlled radio groups', 'answers map in Redux', 'validation before submit', 'thunk reading getState()', 'POST result', 'review UI from derived classes'],
  viDu: [{ input: 'Submit with only question 2 answered', output: '#quiz-error "Please answer all questions (2 unanswered)." · no request', explanation: 'Count questions whose id is not a key of the answers map.|||Đếm câu có id không nằm trong map câu trả lời.' }],
  thuatNgu: [{ en: 'pass mark', vi: 'điểm đạt (70%)' }, { en: 'radio group', vi: 'nhóm radio cùng name — chỉ chọn được một' }, { en: 'attempt', vi: 'một lượt làm bài' }],
  goiY: [
    'quizApi: <code>getChapter(id)</code>, <code>getQuestions(chapterId)</code>, <code>saveResult(r)</code>. Slice: <code>{ chapter, questions, answers: {}, result: null, status, submitStatus }</code>; <code>fetchQuiz.pending</code> xoá answers/result cũ.',
    'Radio: <code>&lt;Form.Check type="radio" id={`q${q.id}-o${i}`} name={`q-${q.id}`} checked={answers[q.id] === i} onChange={() =&gt; dispatch(answerSelected({ questionId: q.id, optionIndex: i }))} /&gt;</code> — <code>i</code> là SỐ nên so <code>=== q.answerIndex</code> được.',
    'submitQuiz đọc <code>getState().quiz</code>, gọi hàm thuần <code>scoreQuiz(questions, answers)</code> rồi POST; kết quả máy chủ trả về là <code>result</code>. Class xem lại suy ra khi render: <code>result ? (answers[q.id] === q.answerIndex ? "correct" : "incorrect") : ""</code>.',
  ],
  loiHayGap: [
    'Lấy giá trị radio từ <code>e.target.value</code> (luôn là CHUỖI) rồi so với <code>answerIndex</code> (số) ⇒ chấm sai hết.',
    'Mọi câu dùng chung một <code>name</code> ⇒ chọn câu 2 thì mất lựa chọn câu 1.',
    'Radio không controlled (thiếu <code>checked</code>) ⇒ bấm "Retake" xoá store nhưng ô vẫn còn dấu chọn.',
    'Chia <code>score / total</code> khi chương 0 câu ⇒ NaN%; chặn bằng trạng thái <code>#no-questions</code>.',
    'Hiện điểm trước khi POST xong ⇒ lỗi mạng mà người học vẫn tưởng đã lưu.',
    'Không chặn chưa ghi danh ⇒ ai cũng làm được quiz bằng cách gõ /quiz/6.',
  ],
  giaiThich: {
    en: '<p><b>Walkthrough.</b> <code>fetchQuiz</code> loads the chapter and its questions together; its <code>pending</code> case wipes the previous attempt. Answers live in the store as a map keyed by question id, written by a plain reducer, so the radios are fully controlled and "Retake" is just a reset. Submitting first counts unanswered questions locally (no request), then <code>submitQuiz</code> reads the questions and answers with <code>getState()</code>, scores them with the pure <code>scoreQuiz</code>, and saves the attempt; the saved row becomes <code>result</code>, which drives the result alert, the <code>correct/incorrect</code> classes, the highlighted options and the explanations. The page also checks the enrolment of the chapter\'s course, so typing the URL does not bypass enrolment.</p>',
    vi: '<p><b>Hướng giải.</b> <code>fetchQuiz</code> tải chương và câu hỏi cùng lúc; case <code>pending</code> xoá lượt làm trước. Câu trả lời nằm trong store dạng map theo id câu hỏi, ghi bằng reducer thường ⇒ radio hoàn toàn controlled và "Retake" chỉ là đặt lại. Khi nộp, trước tiên đếm câu chưa trả lời ngay ở client (không gửi request), rồi <code>submitQuiz</code> đọc câu hỏi + câu trả lời bằng <code>getState()</code>, chấm bằng hàm thuần <code>scoreQuiz</code> và lưu lượt làm; bản ghi đã lưu thành <code>result</code>, từ đó suy ra thông báo điểm, class <code>correct/incorrect</code>, phương án được tô và giải thích. Trang còn kiểm ghi danh khoá của chương nên gõ URL cũng không vượt được.</p>',
  },
}));
