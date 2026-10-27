/**
 * FER202 · Exercise 15 — useReducer (handout: counter INCREMENT/DECREMENT/RESET + Question Bank
 * SELECT_OPTION · NEXT_QUESTION · RESTART_QUIZ). Thêm: tham số init của useReducer và undo/redo.
 */
import { doiDau, KHOA, jsNho, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

const QUIZ_REDUCER = `const initialState = { current: 0, selected: null, score: 0, finished: false };

function quizReducer(state, action) {
  switch (action.type) {
    case 'SELECT_OPTION':
      if (state.finished) return state;
      return { ...state, selected: action.option };
    case 'NEXT_QUESTION': {
      if (state.selected === null || state.finished) return state;
      const correct = state.selected === action.questions[state.current].answer;
      const score = state.score + (correct ? 1 : 0);
      const last = state.current === action.questions.length - 1;
      return last
        ? { ...state, score, selected: null, finished: true }
        : { ...state, score, selected: null, current: state.current + 1 };
    }
    case 'RESTART_QUIZ':
      return initialState;
    default:
      return state;
  }
}
`;

export default doiDau({
  slug: 'fer202-8-ex15-usereducer',
  ten: 'Exercise 15 — useReducer',
  khoa: KHOA,
  baiHoc: 'fer202-8-ex15-usereducer',
  de: [
    reactNho({
      tieuDe: 'Counter reducer with a lazy init function',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['useReducer(reducer, arg, init)', 'RESET to initial', 'action types as constants'], the: ['hooks', 'useReducer', 'exercise-15'],
      moTa: {
        en: '<p>The handout counter (<code>INCREMENT</code>, <code>DECREMENT</code>, <code>RESET</code>) with a twist: the start value comes from a prop <code>start</code>, and <code>RESET</code> must go back to THAT value. Use the third argument of <code>useReducer</code> — an <code>init</code> function — so the same function computes the initial state and the reset state.</p>',
        vi: '<p>Bộ đếm của handout (<code>INCREMENT</code>, <code>DECREMENT</code>, <code>RESET</code>) có thêm một điểm: giá trị bắt đầu lấy từ prop <code>start</code>, và <code>RESET</code> phải về ĐÚNG giá trị đó. Dùng tham số thứ ba của <code>useReducer</code> — hàm <code>init</code> — để cùng một hàm tính state ban đầu lẫn state khi reset.</p>',
      },
      yeuCau: [
        { en: '<code>&lt;Counter start={10} /&gt;</code> and <code>&lt;Counter start={0} /&gt;</code> in <code>.counter</code> blocks, each with <code>.value</code>, <code>.inc</code>, <code>.dec</code>, <code>.reset</code>.', vi: '<code>&lt;Counter start={10} /&gt;</code> và <code>&lt;Counter start={0} /&gt;</code> trong khối <code>.counter</code>, mỗi khối có <code>.value</code>, <code>.inc</code>, <code>.dec</code>, <code>.reset</code>.' },
        { en: 'Action types as constants (<code>const INCREMENT = "INCREMENT"</code> …). RESET dispatches <code>{ type: RESET, payload: start }</code>.', vi: 'Kiểu action là hằng (<code>const INCREMENT = "INCREMENT"</code> …). RESET gửi <code>{ type: RESET, payload: start }</code>.' },
      ],
      viDu: [{ input: 'start 10: +, +, reset', output: '10', explanation: 'init(10) ⇒ { count: 10 } for both mount and reset.|||init(10) ⇒ { count: 10 } cho cả lúc mount lẫn reset.' }],
      goiY: ['function init(start) { return { count: start }; } … useReducer(reducer, start, init)', 'case RESET: return init(action.payload);'],
      loiHayGap: ['RESET về 0 cứng ⇒ sai với counter bắt đầu từ 10.', 'Gõ sai chuỗi "INCREMNT" ở một chỗ ⇒ action rơi vào default, im lặng; hằng số giúp bắt lỗi.'],
      thuatNgu: [{ en: 'init function', vi: 'hàm tạo state ban đầu (tham số 3 của useReducer)' }],
      giaiThich: '<p><code>useReducer(reducer, arg, init)</code> gọi <code>init(arg)</code> một lần lúc mount. Dùng lại <code>init</code> trong nhánh RESET giữ một nguồn sự thật cho "state ban đầu là gì".</p>',
      dau: `// src/App.js — STARTER
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET': return { count: 0 };
    default: return state;
  }
}

function Counter({ start }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div className="counter">
      <span className="value">{state.count}</span>
      <button className="inc" onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button className="dec" onClick={() => dispatch({ type: 'DECREMENT' })}>−</button>
      <button className="reset" onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

export default function App() {
  return (<div><Counter start={10} /><Counter start={0} /></div>);
}
`,
      giai: `// src/App.js — useReducer(reducer, start, init): init dùng cho cả mount và RESET
import { useReducer } from 'react';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const RESET = 'RESET';

function init(start) {
  return { count: start };
}

function reducer(state, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    case DECREMENT:
      return { count: state.count - 1 };
    case RESET:
      return init(action.payload);
    default:
      return state;
  }
}

function Counter({ start }) {
  const [state, dispatch] = useReducer(reducer, start, init);
  return (
    <div className="counter">
      <span className="value">{state.count}</span>
      <button type="button" className="inc" onClick={() => dispatch({ type: INCREMENT })}>+</button>
      <button type="button" className="dec" onClick={() => dispatch({ type: DECREMENT })}>−</button>
      <button type="button" className="reset" onClick={() => dispatch({ type: RESET, payload: start })}>Reset</button>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Counter start={10} />
      <Counter start={0} />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Starts from the prop', kiem: 'danh-sach-text', selector: '.counter .value', mongDoi: ['10', '0'] },
        { moTa: 'Counters are independent', kiem: 'danh-sach-text', selector: '.counter .value', mongDoi: ['12', '-1'], truoc: [click('.counter:nth-child(1) .inc', 2), click('.counter:nth-child(2) .dec')] },
        { moTa: 'Reset returns to start', kiem: 'text', selector: '.counter:nth-child(1) .value', giaTri: '10', truoc: [click('.counter:nth-child(1) .inc', 3), click('.counter:nth-child(1) .reset')] },
        { an: true, moTa: 'Uses the init argument', kiem: 'ma-nguon', khop: 'useReducer\\(\\s*reducer\\s*,\\s*start\\s*,\\s*init\\s*\\)' },
        { an: true, moTa: 'Action type constants', kiem: 'ma-nguon', khop: 'const\\s+INCREMENT\\s*=\\s*[\'"]INCREMENT[\'"]' },
      ],
    }),
    jsNho({
      tieuDe: 'Question Bank reducer (pure)',
      doKho: 'MEDIUM', phut: 14,
      khaiNiem: ['state machine', 'action with data', 'immutability'], the: ['hooks', 'useReducer', 'exercise-15', 'javascript'],
      moTa: {
        en: '<p>The handout\'s Question Bank, logic first. Write <code>quizReducer</code> for state <code>{ current, selected, score, finished }</code> (initial <code>initialState</code>, also defined by you). <code>NEXT_QUESTION</code> receives the <code>questions</code> array in the action so the reducer stays pure.</p>',
        vi: '<p>Question Bank của handout, làm phần logic trước. Viết <code>quizReducer</code> cho state <code>{ current, selected, score, finished }</code> (ban đầu là <code>initialState</code>, bạn tự khai báo). <code>NEXT_QUESTION</code> nhận mảng <code>questions</code> trong action để reducer vẫn thuần.</p>',
      },
      yeuCau: [
        { en: '<code>SELECT_OPTION {option}</code> ⇒ <code>selected</code> (ignored when finished).', vi: '<code>SELECT_OPTION {option}</code> ⇒ <code>selected</code> (bỏ qua khi đã xong).' },
        { en: '<code>NEXT_QUESTION {questions}</code>: nothing selected ⇒ same state; else +1 score if <code>selected === questions[current].answer</code>, clear <code>selected</code>, go to the next question or set <code>finished: true</code> after the last one.', vi: '<code>NEXT_QUESTION {questions}</code>: chưa chọn ⇒ giữ nguyên state; ngược lại +1 điểm nếu <code>selected === questions[current].answer</code>, xoá <code>selected</code>, sang câu kế hoặc đặt <code>finished: true</code> sau câu cuối.' },
        { en: '<code>RESTART_QUIZ</code> ⇒ <code>initialState</code>; unknown ⇒ same state.', vi: '<code>RESTART_QUIZ</code> ⇒ <code>initialState</code>; action lạ ⇒ giữ nguyên.' },
      ],
      viDu: [{ input: 'select correct option, NEXT_QUESTION', output: '{ current: 1, selected: null, score: 1, finished: false }', explanation: 'Score is decided at NEXT, not at SELECT — the user may change their mind.|||Điểm tính lúc NEXT, không phải lúc SELECT — người dùng có thể đổi ý.' }],
      goiY: ['const correct = state.selected === action.questions[state.current].answer;', 'const last = state.current === action.questions.length - 1;'],
      loiHayGap: ['Cộng điểm ở SELECT_OPTION ⇒ đổi đáp án ba lần được ba điểm.', 'Đọc mảng câu hỏi từ biến toàn cục trong reducer ⇒ khó test, không thuần.'],
      thuatNgu: [{ en: 'state machine', vi: 'máy trạng thái: các trạng thái + chuyển tiếp hợp lệ' }],
      giaiThich: '<p>Reducer là máy trạng thái nhỏ: mọi chuyển tiếp hợp lệ nằm trong một switch, chuyển tiếp không hợp lệ (NEXT khi chưa chọn) trả lại state cũ. Test bằng cách gọi hàm như dưới đây.</p>',
      dau: `// main.js — STARTER
const initialState = { current: 0, selected: null, score: 0, finished: false };

function quizReducer(state, action) {
  switch (action.type) {
    case 'SELECT_OPTION':
      state.selected = action.option;
      if (action.option === 'A') state.score++;
      return state;
    default:
      return state;
  }
}
`,
      giai: `// main.js — máy trạng thái của Question Bank (thuần, không đột biến)
${QUIZ_REDUCER}`,
      kiem: [
        { moTa: 'SELECT_OPTION stores the choice', goi: 'quizReducer(initialState, { type: "SELECT_OPTION", option: "B" })', mongDoi: { current: 0, selected: 'B', score: 0, finished: false } },
        { moTa: 'NEXT scores a correct answer', goi: 'quizReducer({ current: 0, selected: "B", score: 0, finished: false }, { type: "NEXT_QUESTION", questions: [{ answer: "B" }, { answer: "A" }] })', mongDoi: { current: 1, selected: null, score: 1, finished: false } },
        { moTa: 'Last question finishes', goi: 'quizReducer({ current: 1, selected: "C", score: 1, finished: false }, { type: "NEXT_QUESTION", questions: [{ answer: "B" }, { answer: "A" }] })', mongDoi: { current: 1, selected: null, score: 1, finished: true } },
        { moTa: 'RESTART_QUIZ', goi: 'quizReducer({ current: 1, selected: null, score: 2, finished: true }, { type: "RESTART_QUIZ" })', mongDoi: { current: 0, selected: null, score: 0, finished: false } },
        { an: true, moTa: 'NEXT without a selection ⇒ same state', goi: '(() => { const s = { current: 0, selected: null, score: 0, finished: false }; return quizReducer(s, { type: "NEXT_QUESTION", questions: [{ answer: "A" }] }) === s; })()', mongDoi: true },
        { an: true, moTa: 'Changing the selection gives no extra points', goi: '(() => { let s = initialState; for (const o of ["A", "B", "A"]) s = quizReducer(s, { type: "SELECT_OPTION", option: o }); return quizReducer(s, { type: "NEXT_QUESTION", questions: [{ answer: "A" }, { answer: "A" }] }).score; })()', mongDoi: 1 },
        { an: true, moTa: 'Does not mutate', goi: '(() => { const s = { current: 0, selected: null, score: 0, finished: false }; quizReducer(s, { type: "SELECT_OPTION", option: "A" }); return s.selected; })()', mongDoi: null },
        { an: true, moTa: 'Ignores SELECT when finished', goi: '(() => { const s = { current: 1, selected: null, score: 1, finished: true }; return quizReducer(s, { type: "SELECT_OPTION", option: "A" }) === s; })()', mongDoi: true },
      ],
    }),
    reactNho({
      tieuDe: 'Question Bank app with useReducer',
      doKho: 'MEDIUM', phut: 16,
      khaiNiem: ['useReducer in UI', 'disabled until valid', 'result screen'], the: ['hooks', 'useReducer', 'exercise-15'],
      moTa: {
        en: '<p>Now the UI. Three questions; clicking an option dispatches <code>SELECT_OPTION</code> and highlights it; <b>Next</b> is disabled until something is selected; after the last question show the score and a Restart button.</p>',
        vi: '<p>Giờ đến giao diện. Ba câu hỏi; bấm một lựa chọn gửi <code>SELECT_OPTION</code> và tô sáng nó; nút <b>Next</b> bị vô hiệu tới khi đã chọn; sau câu cuối hiện điểm và nút Restart.</p>',
      },
      yeuCau: [
        { en: 'Questions: "What is ReactJS?" (A JavaScript library ✔), "What is JSX?" (A syntax extension ✔), "Which hook manages complex state?" (useReducer ✔). Each has 3 options, rendered as <code>button.option</code>.', vi: 'Câu hỏi: "What is ReactJS?" (A JavaScript library ✔), "What is JSX?" (A syntax extension ✔), "Which hook manages complex state?" (useReducer ✔). Mỗi câu 3 lựa chọn, vẽ bằng <code>button.option</code>.' },
        { en: '<code>#question</code> text, <code>#progress</code> <code>Question 1/3</code>, selected option has class <code>selected</code>, <code>#btn-next</code> (label <code>Finish</code> on the last question). Result: <code>#score</code> <code>Your score: 2/3</code>, <code>#btn-restart</code>.', vi: '<code>#question</code> nội dung, <code>#progress</code> <code>Question 1/3</code>, lựa chọn đang chọn có class <code>selected</code>, <code>#btn-next</code> (câu cuối ghi <code>Finish</code>). Kết quả: <code>#score</code> <code>Your score: 2/3</code>, <code>#btn-restart</code>.' },
      ],
      viDu: [{ input: 'answer 1st and 3rd correctly', output: 'Your score: 2/3', explanation: 'Each NEXT carries the questions array to the reducer.|||Mỗi NEXT mang mảng câu hỏi tới reducer.' }],
      goiY: ['const [state, dispatch] = useReducer(quizReducer, initialState); const q = QUESTIONS[state.current];', '<button className={opt === state.selected ? "option selected" : "option"} …>'],
      loiHayGap: ['Kiểm đúng/sai và cộng điểm trong component ⇒ logic chia đôi, reducer không còn là nguồn sự thật.', 'Next không disabled ⇒ bấm Next khi chưa chọn bị tính sai.'],
      thuatNgu: [{ en: 'result screen', vi: 'màn hình kết quả' }],
      giaiThich: '<p>Reducer đã viết ở bài trước được dùng nguyên vẹn — component chỉ hiển thị state và gửi action. Đó là lợi ích chính của useReducer: logic test riêng, UI mỏng.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const QUESTIONS = [
  { question: 'What is ReactJS?', options: ['A JavaScript library', 'A database', 'A CSS framework'], answer: 'A JavaScript library' },
  { question: 'What is JSX?', options: ['A syntax extension', 'A server', 'A test runner'], answer: 'A syntax extension' },
  { question: 'Which hook manages complex state?', options: ['useRef', 'useReducer', 'useId'], answer: 'useReducer' },
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const q = QUESTIONS[current];
  return (
    <div>
      <h2 id="question">{q.question}</h2>
      {q.options.map((o) => <button key={o} className="option">{o}</button>)}
      <button id="btn-next" onClick={() => setCurrent(current + 1)}>Next</button>
    </div>
  );
}
`,
      giai: `// src/App.js — Question Bank: reducer giữ logic, component chỉ hiển thị + dispatch
import { useReducer } from 'react';

const QUESTIONS = [
  { question: 'What is ReactJS?', options: ['A JavaScript library', 'A database', 'A CSS framework'], answer: 'A JavaScript library' },
  { question: 'What is JSX?', options: ['A syntax extension', 'A server', 'A test runner'], answer: 'A syntax extension' },
  { question: 'Which hook manages complex state?', options: ['useRef', 'useReducer', 'useId'], answer: 'useReducer' },
];

${QUIZ_REDUCER}
export default function App() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  if (state.finished) {
    return (
      <div>
        <p id="score">Your score: {state.score}/{QUESTIONS.length}</p>
        <button id="btn-restart" type="button" onClick={() => dispatch({ type: 'RESTART_QUIZ' })}>Restart</button>
      </div>
    );
  }

  const q = QUESTIONS[state.current];
  const last = state.current === QUESTIONS.length - 1;
  return (
    <div>
      <p id="progress">Question {state.current + 1}/{QUESTIONS.length}</p>
      <h2 id="question">{q.question}</h2>
      {q.options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={opt === state.selected ? 'option selected' : 'option'}
          onClick={() => dispatch({ type: 'SELECT_OPTION', option: opt })}
        >
          {opt}
        </button>
      ))}
      <button id="btn-next" type="button" disabled={state.selected === null} onClick={() => dispatch({ type: 'NEXT_QUESTION', questions: QUESTIONS })}>
        {last ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Next disabled until a choice', kiem: 'thuoc-tinh-js', selector: '#btn-next', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Selected option highlighted', kiem: 'text', selector: '.option.selected', giaTri: 'A database', truoc: [click('.option:nth-of-type(2)')] },
        { moTa: 'Progress moves on', kiem: 'danh-sach-text', selector: '#progress, #question', mongDoi: ['Question 2/3', 'What is JSX?'], truoc: [click('.option:nth-of-type(1)'), click('#btn-next')] },
        { moTa: 'Score 2/3', kiem: 'text', selector: '#score', giaTri: 'Your score: 2/3', truoc: [click('.option:nth-of-type(1)'), click('#btn-next'), click('.option:nth-of-type(3)'), click('#btn-next'), click('.option:nth-of-type(2)'), click('#btn-next')] },
        { an: true, moTa: 'Last button reads Finish', kiem: 'text', selector: '#btn-next', giaTri: 'Finish', truoc: [click('.option:nth-of-type(1)'), click('#btn-next'), click('.option:nth-of-type(1)'), click('#btn-next')] },
        { an: true, moTa: 'Restart goes back to question 1', kiem: 'text', selector: '#progress', giaTri: 'Question 1/3', truoc: [click('.option:nth-of-type(1)'), click('#btn-next'), click('.option:nth-of-type(1)'), click('#btn-next'), click('.option:nth-of-type(1)'), click('#btn-next'), click('#btn-restart')] },
        { an: true, moTa: 'Uses useReducer with the three action types', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*useReducer\\()(?=[\\s\\S]*SELECT_OPTION)(?=[\\s\\S]*NEXT_QUESTION)[\\s\\S]*RESTART_QUIZ' },
      ],
    }),
    reactNho({
      tieuDe: 'Undo / redo with a history reducer',
      doKho: 'HARD', phut: 20,
      khaiNiem: ['past/present/future', 'higher-order reducer idea', 'disabled states'], the: ['hooks', 'useReducer'],
      moTa: {
        en: '<p>A small "pixel row" editor: 5 cells you can toggle. Keep history as <code>{ past: [], present, future: [] }</code> so <b>Undo</b> and <b>Redo</b> work. A new edit after undoing clears <code>future</code>. History length is limited to the last <b>10</b> states.</p>',
        vi: '<p>Trình sửa "hàng điểm ảnh" nhỏ: 5 ô bật/tắt được. Giữ lịch sử dạng <code>{ past: [], present, future: [] }</code> để <b>Undo</b> và <b>Redo</b> chạy. Sửa mới sau khi undo thì xoá <code>future</code>. Lịch sử chỉ giữ <b>10</b> trạng thái gần nhất.</p>',
      },
      yeuCau: [
        { en: 'Cells <code>button.cell</code> (class <code>on</code> when on); <code>#undo</code> / <code>#redo</code> disabled when nothing to undo/redo; <code>#history</code> = <code>Undo: 2 · Redo: 1</code>.', vi: 'Ô <code>button.cell</code> (class <code>on</code> khi bật); <code>#undo</code> / <code>#redo</code> vô hiệu khi không có gì để undo/redo; <code>#history</code> = <code>Undo: 2 · Redo: 1</code>.' },
        { en: 'Actions: <code>TOGGLE {index}</code>, <code>UNDO</code>, <code>REDO</code>.', vi: 'Action: <code>TOGGLE {index}</code>, <code>UNDO</code>, <code>REDO</code>.' },
      ],
      viDu: [{ input: 'toggle 0, toggle 1, undo', output: 'only cell 0 on · Undo: 1 · Redo: 1', explanation: 'UNDO moves present to the front of future and pops past.|||UNDO đưa present lên đầu future và lấy phần tử cuối của past.' }],
      goiY: ['TOGGLE: const next = present.map((v, i) => i === action.index ? !v : v); return { past: [...past, present].slice(-10), present: next, future: [] };', 'UNDO: if (!past.length) return state; return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] };'],
      loiHayGap: ['Quên xoá future khi sửa mới ⇒ Redo đưa về một nhánh lịch sử không còn hợp lệ.', 'Lưu tham chiếu tới cùng một mảng present rồi sửa nó ⇒ mọi mục lịch sử đổi theo.'],
      thuatNgu: [{ en: 'undo stack', vi: 'ngăn xếp các trạng thái trước' }],
      giaiThich: '<p>Lịch sử là ba phần: quá khứ, hiện tại, tương lai. Undo/Redo chỉ dời phần tử giữa ba phần đó — vì mọi trạng thái đều bất biến, lưu tham chiếu là đủ, không cần sao chép sâu.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [cells, setCells] = useState([false, false, false, false, false]);
  const toggle = (i) => { cells[i] = !cells[i]; setCells([...cells]); };
  return (
    <div>
      {cells.map((on, i) => <button key={i} className={on ? 'cell on' : 'cell'} onClick={() => toggle(i)}>{i}</button>)}
      <button id="undo">Undo</button>
      <button id="redo">Redo</button>
    </div>
  );
}
`,
      giai: `// src/App.js — reducer lịch sử { past, present, future } cho Undo/Redo
import { useReducer } from 'react';

const LIMIT = 10;
const initialState = { past: [], present: [false, false, false, false, false], future: [] };

function historyReducer(state, action) {
  const { past, present, future } = state;
  switch (action.type) {
    case 'TOGGLE': {
      const next = present.map((v, i) => (i === action.index ? !v : v));
      return { past: [...past, present].slice(-LIMIT), present: next, future: [] };
    }
    case 'UNDO':
      if (past.length === 0) return state;
      return { past: past.slice(0, -1), present: past[past.length - 1], future: [present, ...future] };
    case 'REDO':
      if (future.length === 0) return state;
      return { past: [...past, present].slice(-LIMIT), present: future[0], future: future.slice(1) };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(historyReducer, initialState);
  return (
    <div>
      <div>
        {state.present.map((on, i) => (
          <button key={i} type="button" className={on ? 'cell on' : 'cell'} onClick={() => dispatch({ type: 'TOGGLE', index: i })}>{i}</button>
        ))}
      </div>
      <button id="undo" type="button" disabled={state.past.length === 0} onClick={() => dispatch({ type: 'UNDO' })}>Undo</button>
      <button id="redo" type="button" disabled={state.future.length === 0} onClick={() => dispatch({ type: 'REDO' })}>Redo</button>
      <p id="history">Undo: {state.past.length} · Redo: {state.future.length}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Undo reverts the last edit', kiem: 'so-luong', selector: '.cell.on', giaTri: 1, truoc: [click('.cell:nth-child(1)'), click('.cell:nth-child(2)'), click('#undo')] },
        { moTa: 'History counters', kiem: 'text', selector: '#history', giaTri: 'Undo: 1 · Redo: 1', truoc: [click('.cell:nth-child(1)'), click('.cell:nth-child(2)'), click('#undo')] },
        { moTa: 'Redo re-applies', kiem: 'so-luong', selector: '.cell.on', giaTri: 2, truoc: [click('.cell:nth-child(1)'), click('.cell:nth-child(2)'), click('#undo'), click('#redo')] },
        { moTa: 'Buttons disabled at start', kiem: 'thuoc-tinh-js', selector: '#undo, #redo', thuocTinh: 'disabled', giaTri: true },
        { an: true, moTa: 'New edit clears redo', kiem: 'text', selector: '#history', giaTri: 'Undo: 1 · Redo: 0', truoc: [click('.cell:nth-child(1)'), click('#undo'), click('.cell:nth-child(3)')] },
        { an: true, moTa: 'History limited to 10', kiem: 'text', selector: '#history', giaTri: 'Undo: 10 · Redo: 0', truoc: [click('.cell:nth-child(1)', 12)] },
        { an: true, moTa: 'Undo all the way restores the start', kiem: 'so-luong', selector: '.cell.on', giaTri: 0, truoc: [click('.cell:nth-child(1)'), click('.cell:nth-child(4)'), click('#undo', 3)] },
      ],
    }),
  ],
});
