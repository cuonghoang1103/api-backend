/**
 * FER202 · 6.1 — Event handlers, synthetic events & forms (bài luyện React).
 * Dễ → khó: handler đặt tên → ô controlled + đếm → onSubmit + preventDefault → phím → ủy quyền sự kiện (data-*)
 * → form nhiều loại ô với nút gửi chỉ bật khi hợp lệ.
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const phim = (selector, p) => ({ hanhDong: 'phim', selector, phim: p });

export default doiDau({
  slug: 'fer202-6-1-events-forms',
  ten: '6.1 Event handlers, synthetic events & forms',
  khoa: KHOA,
  baiHoc: 'fer202-6-1-events-forms',
  de: [
    reactNho({
      tieuDe: 'Pass a handler, do not call it',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['onClick', 'function reference', 'render vs event'], the: ['events'],
      moTa: {
        en: '<p>The starter writes <code>onClick={showDetails()}</code>: the function runs during <b>render</b> (logging "details" on page load) and the button does nothing. Pass the function itself so it runs only when clicked.</p>',
        vi: '<p>Starter viết <code>onClick={showDetails()}</code>: hàm chạy ngay lúc <b>render</b> (in "details" khi trang vừa tải) và nút không làm gì. Hãy truyền chính hàm để nó chỉ chạy khi bấm.</p>',
      },
      yeuCau: [
        { en: 'Nothing is logged when the page loads.', vi: 'Không in gì khi trang vừa tải.' },
        { en: 'Each click on <code>#btn-details</code> logs <code>details</code> and toggles <code>#details</code> visibility.', vi: 'Mỗi lần bấm <code>#btn-details</code> in <code>details</code> và bật/tắt <code>#details</code>.' },
      ],
      viDu: [{ input: 'onClick={showDetails}', output: 'runs on click only', explanation: 'onClick={showDetails()} passes the RESULT of calling it (undefined).|||onClick={showDetails()} truyền KẾT QUẢ của lời gọi (undefined).' }],
      goiY: ['onClick={showDetails} — không có ngoặc tròn.', 'Cần tham số? onClick={() => showDetails(id)}.'],
      loiHayGap: ['<code>onClick={setOpen(!open)}</code> ⇒ đổi state ngay khi render ⇒ "Too many re-renders".', 'Viết <code>onclick</code> (chữ thường) ⇒ React không nhận.'],
      thuatNgu: [{ en: 'function reference', vi: 'tham chiếu tới hàm (chưa gọi)' }],
      giaiThich: '<p>JSX tính mọi thứ trong <code>{ }</code> ngay khi render. <code>{showDetails}</code> là tham chiếu hàm — React giữ lại và gọi khi có sự kiện; <code>{showDetails()}</code> gọi luôn và chỉ đưa cho React kết quả.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [open, setOpen] = useState(false);
  function showDetails() {
    console.log('details');
  }
  return (
    <div>
      <button id="btn-details" onClick={showDetails()}>Details</button>
      {open && <p id="details">Shipping in 2 days.</p>}
    </div>
  );
}
`,
      giai: `// src/App.js — truyền HÀM (không gọi) cho onClick
import { useState } from 'react';

export default function App() {
  const [open, setOpen] = useState(false);
  function showDetails() {
    console.log('details');
    setOpen((o) => !o);
  }
  return (
    <div>
      <button id="btn-details" type="button" onClick={showDetails}>Details</button>
      {open && <p id="details">Shipping in 2 days.</p>}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Nothing logged on load', kiem: 'console', mongDoi: [] },
        { moTa: 'Click logs once and shows details', kiem: 'console', mongDoi: ['details'], truoc: [click('#btn-details')] },
        { moTa: 'Details visible after one click', kiem: 'ton-tai', selector: '#details', truoc: [click('#btn-details')] },
        { an: true, moTa: 'Second click hides details', kiem: 'khong-ton-tai', selector: '#details', truoc: [click('#btn-details', 2)] },
      ],
    }),
    reactNho({
      tieuDe: 'Controlled textarea with a live counter',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['controlled input', 'onChange', 'e.target.value', 'derived value'], the: ['events', 'forms'],
      moTa: {
        en: '<p>A tweet box: 140 characters max. Show how many characters remain; turn the counter red (class <code>over</code>) and disable "Post" when the text is empty or too long.</p>',
        vi: '<p>Ô viết tweet: tối đa 140 ký tự. Hiện số ký tự còn lại; bộ đếm đỏ (class <code>over</code>) và nút "Post" bị vô hiệu khi chữ rỗng hoặc quá dài.</p>',
      },
      yeuCau: [
        { en: '<code>textarea#tweet</code> controlled; <code>#remaining</code> = 140 − length (can go negative).', vi: '<code>textarea#tweet</code> controlled; <code>#remaining</code> = 140 − độ dài (có thể âm).' },
        { en: '<code>#remaining.over</code> when negative; <code>#btn-post</code> disabled when trimmed text is empty or length &gt; 140.', vi: '<code>#remaining.over</code> khi âm; <code>#btn-post</code> vô hiệu khi chữ (đã trim) rỗng hoặc độ dài &gt; 140.' },
      ],
      viDu: [{ input: 'type 150 characters', output: '-10 (red), Post disabled', explanation: 'Do not cut the text — tell the user.|||Không tự cắt chữ — hãy báo cho người dùng.' }],
      goiY: ['const [text, setText] = useState(""); const left = 140 - text.length;', 'disabled={!text.trim() || left < 0}'],
      loiHayGap: ['Lưu <code>remaining</code> trong state riêng ⇒ lệch khi dán/xoá nhanh.', 'Dùng <code>maxLength</code> rồi quên báo người dùng vì sao không gõ được.'],
      thuatNgu: [{ en: 'counter', vi: 'bộ đếm' }],
      giaiThich: '<p>Chữ là state; số còn lại, màu, trạng thái nút đều suy ra từ chữ khi render. <code>onChange</code> của React chạy mỗi lần gõ (khác <code>change</code> của HTML chỉ chạy khi rời ô).</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return (
    <div>
      <textarea id="tweet" />
      <span id="remaining">140</span>
      <button id="btn-post">Post</button>
    </div>
  );
}
`,
      giai: `// src/App.js — một state (text); mọi thứ khác suy ra
import { useState } from 'react';

const LIMIT = 140;

export default function App() {
  const [text, setText] = useState('');
  const left = LIMIT - text.length;
  return (
    <div>
      <textarea id="tweet" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
      <span id="remaining" className={left < 0 ? 'over' : ''}>{left}</span>
      <button id="btn-post" type="button" disabled={!text.trim() || left < 0}>Post</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Post disabled when empty', kiem: 'thuoc-tinh-js', selector: '#btn-post', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Counter follows typing', kiem: 'text', selector: '#remaining', giaTri: '129', truoc: [nhap('#tweet', 'Hello React')] },
        { moTa: 'Too long ⇒ negative, red, disabled', kiem: 'text', selector: '#remaining.over', giaTri: '-10', truoc: [nhap('#tweet', 'x'.repeat(150))] },
        { an: true, moTa: 'Whitespace only ⇒ still disabled', kiem: 'thuoc-tinh-js', selector: '#btn-post', thuocTinh: 'disabled', giaTri: true, truoc: [nhap('#tweet', '    ')] },
        { an: true, moTa: 'Valid text enables Post', kiem: 'thuoc-tinh-js', selector: '#btn-post', thuocTinh: 'disabled', giaTri: false, truoc: [nhap('#tweet', 'Ready')] },
      ],
    }),
    reactNho({
      tieuDe: 'onSubmit and preventDefault: newsletter sign-up',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['onSubmit', 'preventDefault', 'validation', 'form reset'], the: ['events', 'forms'],
      moTa: {
        en: '<p>Handle the form\'s <code>submit</code> event (not the button\'s click) so pressing Enter also works. Stop the browser from reloading the page, validate the email, then show a thank-you message and clear the input.</p>',
        vi: '<p>Bắt sự kiện <code>submit</code> của form (không phải click của nút) để nhấn Enter cũng gửi được. Chặn trình duyệt tải lại trang, kiểm email, rồi hiện lời cảm ơn và xoá ô.</p>',
      },
      yeuCau: [
        { en: '<code>form#signup</code> + <code>#email</code>; invalid ⇒ <code>#error</code> "Please enter a valid email"; valid ⇒ <code>#thanks</code> "Thanks! Check {email}", input cleared.', vi: '<code>form#signup</code> + <code>#email</code>; sai ⇒ <code>#error</code> "Please enter a valid email"; đúng ⇒ <code>#thanks</code> "Thanks! Check {email}", xoá ô.' },
        { en: 'The page must never reload.', vi: 'Trang không bao giờ tải lại.' },
      ],
      viDu: [{ input: 'submit "an@fpt.edu.vn"', output: 'Thanks! Check an@fpt.edu.vn', explanation: 'e.preventDefault() is the first line of the submit handler.|||e.preventDefault() là dòng đầu của handler submit.' }],
      goiY: ['<form id="signup" onSubmit={handleSubmit}> và nút type="submit".', 'const ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim());'],
      loiHayGap: ['Thiếu <code>e.preventDefault()</code> ⇒ trang tải lại, mọi state mất, thông báo chớp rồi biến.', 'Gắn logic vào <code>onClick</code> của nút ⇒ Enter trong ô không chạy logic.'],
      thuatNgu: [{ en: 'default behavior', vi: 'hành vi mặc định của trình duyệt' }],
      giaiThich: '<p>Form HTML mặc định gửi request và tải lại trang. Trong React ta tự xử lý dữ liệu nên luôn gọi <code>e.preventDefault()</code> trong <code>onSubmit</code>. Bắt ở form (không ở nút) để cả Enter lẫn nút đều đi qua một chỗ.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  return (
    <form id="signup">
      <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Subscribe</button>
    </form>
  );
}
`,
      giai: `// src/App.js — xử lý ở onSubmit của FORM, chặn tải lại trang trước tiên
import { useState } from 'react';

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export default function App() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError('Please enter a valid email');
      setDone('');
      return;
    }
    setError('');
    setDone(value);
    setEmail('');
  };

  return (
    <form id="signup" onSubmit={handleSubmit} noValidate>
      <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <button type="submit">Subscribe</button>
      {error && <p id="error">{error}</p>}
      {done && <p id="thanks">Thanks! Check {done}</p>}
    </form>
  );
}
`,
      kiem: [
        { moTa: 'Valid email ⇒ thanks message', kiem: 'text', selector: '#thanks', giaTri: 'Thanks! Check an@fpt.edu.vn', truoc: [nhap('#email', 'an@fpt.edu.vn'), { hanhDong: 'gui', selector: '#signup' }] },
        { moTa: 'Invalid email ⇒ error', kiem: 'text', selector: '#error', giaTri: 'Please enter a valid email', truoc: [nhap('#email', 'an@'), { hanhDong: 'gui', selector: '#signup' }] },
        { moTa: 'No page reload', kiem: 'khong-tai-lai', truoc: [nhap('#email', 'an@fpt.edu.vn'), { hanhDong: 'gui', selector: '#signup' }] },
        { an: true, moTa: 'Input cleared after success', kiem: 'thuoc-tinh-js', selector: '#email', thuocTinh: 'value', giaTri: '', truoc: [nhap('#email', 'an@fpt.edu.vn'), { hanhDong: 'gui', selector: '#signup' }] },
      ],
    }),
    reactNho({
      tieuDe: 'Keyboard events: Enter to add, Escape to clear',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['onKeyDown', 'e.key', 'shortcuts'], the: ['events', 'keyboard'],
      moTa: {
        en: '<p>A quick-add box for tags (no form element): <b>Enter</b> adds the trimmed text as a tag, <b>Escape</b> clears the box, and <b>Ctrl+Backspace</b> removes the last tag.</p>',
        vi: '<p>Ô thêm nhãn nhanh (không có thẻ form): <b>Enter</b> thêm chữ (đã trim) thành nhãn, <b>Escape</b> xoá ô, <b>Ctrl+Backspace</b> xoá nhãn cuối.</p>',
      },
      yeuCau: [
        { en: '<code>#tag-input</code> with <code>onKeyDown</code>; tags in <code>ul#tags li</code>; duplicates ignored.', vi: '<code>#tag-input</code> có <code>onKeyDown</code>; nhãn trong <code>ul#tags li</code>; bỏ qua nhãn trùng.' },
      ],
      viDu: [{ input: 'type "react" + Enter, "hooks" + Enter, Escape', output: 'tags: react, hooks; input empty', explanation: 'e.key is "Enter", "Escape", "Backspace"…; e.ctrlKey tells whether Ctrl is held.|||e.key là "Enter", "Escape", "Backspace"…; e.ctrlKey cho biết có giữ Ctrl không.' }],
      goiY: ['if (e.key === "Enter") { … } else if (e.key === "Escape") setText("");', 'Ctrl+Backspace: if (e.key === "Backspace" && e.ctrlKey) setTags(t => t.slice(0, -1)).'],
      loiHayGap: ['Dùng <code>e.keyCode</code> (đã lỗi thời) thay vì <code>e.key</code>.', 'Bắt <code>onKeyPress</code> — đã bị bỏ, không bắt được Escape.'],
      thuatNgu: [{ en: 'keyboard shortcut', vi: 'phím tắt' }],
      giaiThich: '<p><code>onKeyDown</code> nhận mọi phím (kể cả Escape, mũi tên). So sánh <code>e.key</code> theo tên phím, đọc <code>e.ctrlKey</code>/<code>e.shiftKey</code> cho tổ hợp.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);
  return (
    <div>
      <input id="tag-input" value={text} onChange={(e) => setText(e.target.value)} />
      <ul id="tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — onKeyDown + e.key: Enter thêm, Escape xoá ô, Ctrl+Backspace bỏ nhãn cuối
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [tags, setTags] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const tag = text.trim();
      if (tag && !tags.includes(tag)) setTags((t) => [...t, tag]);
      setText('');
    } else if (e.key === 'Escape') {
      setText('');
    } else if (e.key === 'Backspace' && e.ctrlKey) {
      setTags((t) => t.slice(0, -1));
    }
  };

  return (
    <div>
      <input id="tag-input" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Add a tag and press Enter" />
      <ul id="tags">{tags.map((t) => <li key={t}>{t}</li>)}</ul>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Enter adds tags', kiem: 'danh-sach-text', selector: '#tags li', mongDoi: ['react', 'hooks'], truoc: [nhap('#tag-input', 'react'), phim('#tag-input', 'Enter'), nhap('#tag-input', ' hooks '), phim('#tag-input', 'Enter')] },
        { moTa: 'Escape clears the input', kiem: 'thuoc-tinh-js', selector: '#tag-input', thuocTinh: 'value', giaTri: '', truoc: [nhap('#tag-input', 'draft'), phim('#tag-input', 'Escape')] },
        { moTa: 'Duplicates ignored', kiem: 'so-luong', selector: '#tags li', giaTri: 1, truoc: [nhap('#tag-input', 'react'), phim('#tag-input', 'Enter'), nhap('#tag-input', 'react'), phim('#tag-input', 'Enter')] },
        { an: true, moTa: 'Uses e.key, not keyCode', kiem: 'ma-nguon', khop: 'keyCode|which', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Event delegation with data attributes',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['event bubbling', 'e.target vs e.currentTarget', 'data-* attributes', 'closest()'], the: ['events', 'delegation'],
      moTa: {
        en: '<p>A colour palette of 8 swatches. Instead of 8 handlers, put ONE <code>onClick</code> on the container, find the clicked swatch with <code>e.target.closest(\'[data-color]\')</code> and read <code>dataset.color</code>.</p>',
        vi: '<p>Bảng 8 ô màu. Thay vì 8 handler, đặt MỘT <code>onClick</code> ở khung chứa, tìm ô được bấm bằng <code>e.target.closest(\'[data-color]\')</code> và đọc <code>dataset.color</code>.</p>',
      },
      yeuCau: [
        { en: '<code>#palette</code> with 8 <code>button.swatch[data-color]</code>, each containing a <code>span.dot</code> (clicking the dot must work too).', vi: '<code>#palette</code> có 8 <code>button.swatch[data-color]</code>, mỗi nút chứa <code>span.dot</code> (bấm vào chấm cũng phải được).' },
        { en: '<code>#chosen</code> "Chosen: teal"; the chosen swatch has class <code>active</code>; clicks on the gap between swatches do nothing.', vi: '<code>#chosen</code> "Chosen: teal"; ô được chọn có class <code>active</code>; bấm vào khe giữa các ô thì không làm gì.' },
      ],
      viDu: [{ input: 'click the dot inside the "teal" swatch', output: 'Chosen: teal', explanation: 'e.target is the span; closest() walks up to the button.|||e.target là span; closest() đi ngược lên tới button.' }],
      goiY: ['const btn = e.target.closest("[data-color]"); if (!btn) return; setColor(btn.dataset.color);', 'e.currentTarget là phần tử GẮN handler (#palette), e.target là phần tử THẬT SỰ được bấm.'],
      loiHayGap: ['Đọc <code>e.target.dataset.color</code> ⇒ undefined khi bấm vào span bên trong.', 'Không kiểm <code>btn</code> null ⇒ lỗi khi bấm vào khoảng trống.'],
      thuatNgu: [{ en: 'bubbling', vi: 'sự kiện nổi bọt từ phần tử con lên cha' }, { en: 'delegation', vi: 'ủy quyền: một handler ở cha xử lý cho nhiều con' }],
      giaiThich: '<p>Sự kiện click nổi bọt từ phần tử được bấm lên các tổ tiên, nên handler ở <code>#palette</code> nhận mọi click bên trong. <code>closest</code> tìm nút gần nhất có <code>data-color</code>; React vẫn khuyến khích handler riêng cho từng nút trong danh sách nhỏ, nhưng ủy quyền hữu ích với danh sách rất dài.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

const COLORS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];

export default function App() {
  const [color, setColor] = useState('none');
  return (
    <div>
      <div id="palette" onClick={(e) => setColor(e.target.dataset.color)}>
        {COLORS.map((c) => <button key={c} className="swatch" data-color={c}><span className="dot" />{c}</button>)}
      </div>
      <p id="chosen">Chosen: {color}</p>
    </div>
  );
}
`,
      giai: `// src/App.js — MỘT handler ở khung chứa; closest() tìm nút được bấm (kể cả khi bấm vào phần tử con)
import { useState } from 'react';

const COLORS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];

export default function App() {
  const [color, setColor] = useState('none');

  const handleClick = (e) => {
    const btn = e.target.closest('[data-color]'); // e.target có thể là span.dot
    if (!btn) return; // bấm vào khe giữa các ô
    setColor(btn.dataset.color);
  };

  return (
    <div>
      <div id="palette" onClick={handleClick} style={{ display: 'flex', gap: 8, padding: 8 }}>
        {COLORS.map((c) => (
          <button key={c} type="button" className={c === color ? 'swatch active' : 'swatch'} data-color={c}>
            <span className="dot" style={{ display: 'inline-block', width: 10, height: 10, background: c }} /> {c}
          </button>
        ))}
      </div>
      <p id="chosen">Chosen: {color}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Clicking a swatch chooses it', kiem: 'text', selector: '#chosen', giaTri: 'Chosen: blue', truoc: [click('[data-color="blue"]')] },
        { moTa: 'Clicking the inner dot works', kiem: 'text', selector: '#chosen', giaTri: 'Chosen: teal', truoc: [click('[data-color="teal"] .dot')] },
        { moTa: 'Clicking the gap does nothing', kiem: 'text', selector: '#chosen', giaTri: 'Chosen: none', truoc: [click('#palette')] },
        { an: true, moTa: 'Active class on the chosen swatch', kiem: 'so-luong', selector: '.swatch.active[data-color="pink"]', giaTri: 1, truoc: [click('[data-color="pink"] .dot')] },
        { an: true, moTa: 'Only one onClick handler (on the container)', kiem: 'ma-nguon', khop: 'onClick=[\\s\\S]*onClick=', phuDinh: true },
      ],
    }),
    reactNho({
      tieuDe: 'Course feedback form: submit enabled only when valid',
      doKho: 'HARD', phut: 18,
      khaiNiem: ['select', 'radio group', 'checkbox', 'derived validity', 'reset'], the: ['events', 'forms'],
      moTa: {
        en: '<p>A feedback form for a course. The submit button stays disabled until the form is valid — validity is <b>derived</b> from the current values, not stored. After submitting, show the summary and reset the form.</p>',
        vi: '<p>Form góp ý khoá học. Nút gửi bị vô hiệu cho tới khi form hợp lệ — tính hợp lệ là giá trị <b>suy ra</b> từ giá trị hiện tại, không lưu. Gửi xong thì hiện tóm tắt và làm trống form.</p>',
      },
      yeuCau: [
        { en: '<code>#course</code> select (required, empty default), rating radios <code>#rate-1</code>…<code>#rate-5</code> (required), checkbox <code>#anonymous</code>, <code>#comment</code> textarea (required when rating ≤ 2, at least 10 characters).', vi: '<code>#course</code> select (bắt buộc, mặc định rỗng), radio điểm <code>#rate-1</code>…<code>#rate-5</code> (bắt buộc), checkbox <code>#anonymous</code>, textarea <code>#comment</code> (bắt buộc khi điểm ≤ 2, ít nhất 10 ký tự).' },
        { en: '<code>#btn-send</code> disabled while invalid; on submit ⇒ <code>#sent</code> "FER202 · 5★ · anonymous" (or "named"), form reset.', vi: '<code>#btn-send</code> vô hiệu khi chưa hợp lệ; gửi ⇒ <code>#sent</code> "FER202 · 5★ · anonymous" (hoặc "named"), làm trống form.' },
      ],
      viDu: [{ input: 'FER202, rating 2, comment "too fast"', output: 'still disabled (comment < 10 chars)', explanation: 'A low rating needs a reason.|||Điểm thấp cần lý do.' }],
      goiY: ['const valid = course !== "" && rating > 0 && (rating > 2 || comment.trim().length >= 10);', 'Radio: checked={rating === n} onChange={() => setRating(n)}.'],
      loiHayGap: ['Lưu <code>isValid</code> trong state và cập nhật ở vài onChange ⇒ quên một chỗ là sai.', 'Nút trong form không ghi <code>type</code> ⇒ là submit — được, nhưng nhớ chặn tải lại.'],
      thuatNgu: [{ en: 'conditional requirement', vi: 'yêu cầu có điều kiện' }],
      giaiThich: '<p>Tính <code>valid</code> ngay trong render từ các giá trị hiện tại nên luật có điều kiện (comment bắt buộc khi điểm thấp) luôn đúng. Gửi: chặn mặc định, ghi kết quả, đặt mọi state về giá trị ban đầu.</p>',
      dau: `// src/App.js — STARTER
export default function App() {
  return (
    <form id="feedback">
      <select id="course"><option value="">Choose a course</option><option>FER202</option><option>SWT301</option></select>
      {[1, 2, 3, 4, 5].map((n) => <label key={n}><input type="radio" name="rate" id={´rate-@{n}´} /> {n}</label>)}
      <label><input type="checkbox" id="anonymous" /> Anonymous</label>
      <textarea id="comment" />
      <button id="btn-send">Send</button>
    </form>
  );
}
`,
      giai: `// src/App.js — tính hợp lệ SUY RA từ giá trị hiện tại; gửi xong làm trống form
import { useState } from 'react';

export default function App() {
  const [course, setCourse] = useState('');
  const [rating, setRating] = useState(0);
  const [anonymous, setAnonymous] = useState(false);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState('');

  const needsComment = rating > 0 && rating <= 2;
  const valid = course !== '' && rating > 0 && (!needsComment || comment.trim().length >= 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSent(´@{course} · @{rating}★ · @{anonymous ? 'anonymous' : 'named'}´);
    setCourse('');
    setRating(0);
    setAnonymous(false);
    setComment('');
  };

  return (
    <form id="feedback" onSubmit={handleSubmit}>
      <select id="course" value={course} onChange={(e) => setCourse(e.target.value)}>
        <option value="">Choose a course</option>
        <option value="FER202">FER202</option>
        <option value="SWT301">SWT301</option>
      </select>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n}>
            <input type="radio" name="rate" id={´rate-@{n}´} checked={rating === n} onChange={() => setRating(n)} /> {n}
          </label>
        ))}
      </div>
      <label><input type="checkbox" id="anonymous" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Anonymous</label>
      <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder={needsComment ? 'Tell us what went wrong (10+ characters)' : 'Optional comment'} />
      <button id="btn-send" type="submit" disabled={!valid}>Send</button>
      {sent && <p id="sent">{sent}</p>}
    </form>
  );
}
`,
      kiem: [
        { moTa: 'Disabled at start', kiem: 'thuoc-tinh-js', selector: '#btn-send', thuocTinh: 'disabled', giaTri: true },
        { moTa: 'Course + 5★ ⇒ enabled', kiem: 'thuoc-tinh-js', selector: '#btn-send', thuocTinh: 'disabled', giaTri: false, truoc: [{ hanhDong: 'doi', selector: '#course', giaTri: 'FER202' }, { hanhDong: 'chon-o', selector: '#rate-5' }] },
        { moTa: 'Low rating needs a 10+ character comment', kiem: 'thuoc-tinh-js', selector: '#btn-send', thuocTinh: 'disabled', giaTri: true, truoc: [{ hanhDong: 'doi', selector: '#course', giaTri: 'FER202' }, { hanhDong: 'chon-o', selector: '#rate-2' }, nhap('#comment', 'too fast')] },
        { moTa: 'Submit shows the summary and resets', kiem: 'danh-sach-text', selector: '#course, #sent', mongDoi: ['Choose a courseFER202SWT301', 'FER202 · 5★ · anonymous'], truoc: [{ hanhDong: 'doi', selector: '#course', giaTri: 'FER202' }, { hanhDong: 'chon-o', selector: '#rate-5' }, { hanhDong: 'chon-o', selector: '#anonymous' }, { hanhDong: 'gui', selector: '#feedback' }] },
        { an: true, moTa: 'Course select is reset to empty', kiem: 'thuoc-tinh-js', selector: '#course', thuocTinh: 'value', giaTri: '', truoc: [{ hanhDong: 'doi', selector: '#course', giaTri: 'SWT301' }, { hanhDong: 'chon-o', selector: '#rate-4' }, { hanhDong: 'gui', selector: '#feedback' }] },
        { an: true, moTa: 'Low rating with a long reason is accepted', kiem: 'text', selector: '#sent', giaTri: 'SWT301 · 1★ · named', truoc: [{ hanhDong: 'doi', selector: '#course', giaTri: 'SWT301' }, { hanhDong: 'chon-o', selector: '#rate-1' }, nhap('#comment', 'The lab instructions were unclear'), { hanhDong: 'gui', selector: '#feedback' }] },
      ],
    }),
  ],
});
