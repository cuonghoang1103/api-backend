/**
 * FER202 · Exercise 16 — Event handling (tham số cho handler, stopPropagation, preventDefault, ủy quyền).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });

export default doiDau({
  slug: 'fer202-6-ex16-event-handling',
  ten: '6.3 Exercise 16 — Event handling',
  khoa: KHOA,
  baiHoc: 'fer202-6-ex16-event-handling',
  de: [
    reactNho({
      tieuDe: 'Pass parameters to an event handler',
      doKho: 'EASY', phut: 8,
      khaiNiem: ['arrow wrapper', 'handler parameters'], the: ['events', 'exercise-16'],
      moTa: {
        en: '<p>One <code>greet(name)</code> function, three buttons. Wrap the call in an arrow function so each button passes its own name — and nothing runs during render.</p>',
        vi: '<p>Một hàm <code>greet(name)</code>, ba nút. Bọc lời gọi trong arrow function để mỗi nút truyền tên của nó — và không có gì chạy khi render.</p>',
      },
      yeuCau: [
        { en: 'Buttons <code>.greet</code> for React, Vue, Angular; clicking shows <code>#greeting</code> "Hello React!".', vi: 'Nút <code>.greet</code> cho React, Vue, Angular; bấm thì <code>#greeting</code> hiện "Hello React!".' },
        { en: '<code>greet</code> also receives the event as a second argument and logs its type (<code>click</code>).', vi: '<code>greet</code> còn nhận event làm đối số thứ hai và in kiểu của nó (<code>click</code>).' },
      ],
      viDu: [{ input: 'onClick={(e) => greet("Vue", e)}', output: 'Hello Vue! · logs "click"', explanation: 'The arrow receives the event and forwards it.|||Arrow nhận event và chuyển tiếp.' }],
      goiY: ['onClick={(e) => greet(fw, e)}', 'function greet(name, e) { console.log(e.type); setMsg(´Hello @{name}!´); }'],
      loiHayGap: ['<code>onClick={greet(\'React\')}</code> ⇒ chạy khi render.', 'Quên chuyển <code>e</code> nên trong greet không có event.'],
      thuatNgu: [{ en: 'wrapper function', vi: 'hàm bọc' }],
      giaiThich: '<p>Arrow function tạo một hàm mới cho mỗi nút, "nhớ" tên của nút đó và chỉ gọi <code>greet</code> khi có click. Event là đối số đầu của handler — muốn dùng thì chuyển tiếp.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState('');
  function greet(name) {
    setMsg('Hello ' + name + '!');
  }
  return (
    <div>
      {['React', 'Vue', 'Angular'].map((fw) => <button key={fw} className="greet">{fw}</button>)}
      <p id="greeting">{msg}</p>
    </div>
  );
}
`,
      giai: `// src/App.js — arrow bọc lời gọi để truyền tham số (và event)
import { useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState('');
  function greet(name, e) {
    console.log(e.type);
    setMsg(´Hello @{name}!´);
  }
  return (
    <div>
      {['React', 'Vue', 'Angular'].map((fw) => (
        <button key={fw} type="button" className="greet" onClick={(e) => greet(fw, e)}>{fw}</button>
      ))}
      <p id="greeting">{msg}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Vue button greets Vue', kiem: 'text', selector: '#greeting', giaTri: 'Hello Vue!', truoc: [click('.greet:nth-child(2)')] },
        { moTa: 'Event type is logged', kiem: 'console', mongDoi: ['click'], truoc: [click('.greet:nth-child(3)')] },
        { moTa: 'Nothing happens before a click', kiem: 'text', selector: '#greeting', giaTri: '' },
      ],
    }),
    reactNho({
      tieuDe: 'stopPropagation: a delete button inside a clickable card',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['bubbling', 'stopPropagation'], the: ['events', 'exercise-16'],
      moTa: {
        en: '<p>Clicking a card opens it. Each card also has a Delete button — but clicking Delete must NOT open the card. Stop the click from bubbling up.</p>',
        vi: '<p>Bấm thẻ thì mở thẻ. Mỗi thẻ có nút Delete — nhưng bấm Delete KHÔNG được mở thẻ. Hãy chặn click nổi bọt lên.</p>',
      },
      yeuCau: [
        { en: '<code>.note</code> click ⇒ <code>#opened</code> "Opened: {title}"; <code>.btn-del</code> removes the note and leaves <code>#opened</code> unchanged.', vi: 'Bấm <code>.note</code> ⇒ <code>#opened</code> "Opened: {tiêu đề}"; <code>.btn-del</code> xoá ghi chú và giữ nguyên <code>#opened</code>.' },
      ],
      viDu: [{ input: 'click Delete on the first note', output: 'note removed, "Opened: none"', explanation: 'e.stopPropagation() in the button handler.|||e.stopPropagation() trong handler của nút.' }],
      goiY: ['onClick={(e) => { e.stopPropagation(); remove(n.id); }}', 'Thẻ cha: onClick={() => setOpened(n.title)}.'],
      loiHayGap: ['Dùng <code>preventDefault</code> thay vì <code>stopPropagation</code> — hai việc khác nhau.', 'Kiểm <code>e.target.tagName</code> trong handler của thẻ — rối và dễ sai.'],
      thuatNgu: [{ en: 'propagation', vi: 'sự lan truyền sự kiện lên các phần tử cha' }],
      giaiThich: '<p>Click trên nút nổi bọt lên thẻ cha nên cả hai handler chạy. <code>e.stopPropagation()</code> ở nút cắt chuỗi đó. (<code>preventDefault</code> chỉ chặn hành vi mặc định như gửi form/đi theo link.)</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [notes, setNotes] = useState([{ id: 1, title: 'Lab 6' }, { id: 2, title: 'Quiz 3' }]);
  const [opened, setOpened] = useState('none');
  return (
    <div>
      {notes.map((n) => (
        <div key={n.id} className="note" onClick={() => setOpened(n.title)}>
          {n.title}
          <button className="btn-del" onClick={() => setNotes(notes.filter((x) => x.id !== n.id))}>Delete</button>
        </div>
      ))}
      <p id="opened">Opened: {opened}</p>
    </div>
  );
}
`,
      giai: `// src/App.js — stopPropagation ở nút con để click không nổi bọt lên thẻ cha
import { useState } from 'react';

export default function App() {
  const [notes, setNotes] = useState([{ id: 1, title: 'Lab 6' }, { id: 2, title: 'Quiz 3' }]);
  const [opened, setOpened] = useState('none');
  const remove = (id) => setNotes((list) => list.filter((x) => x.id !== id));
  return (
    <div>
      {notes.map((n) => (
        <div key={n.id} className="note" onClick={() => setOpened(n.title)}>
          <span className="note-title">{n.title}</span>
          <button
            type="button"
            className="btn-del"
            onClick={(e) => {
              e.stopPropagation(); // không cho click "đi lên" .note
              remove(n.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      <p id="opened">Opened: {opened}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Clicking a card opens it', kiem: 'text', selector: '#opened', giaTri: 'Opened: Quiz 3', truoc: [click('.note:nth-child(2)')] },
        { moTa: 'Delete does not open the card', kiem: 'text', selector: '#opened', giaTri: 'Opened: none', truoc: [click('.note:first-child .btn-del')] },
        { moTa: 'Delete removes the note', kiem: 'so-luong', selector: '.note', giaTri: 1, truoc: [click('.note:first-child .btn-del')] },
      ],
    }),
    reactNho({
      tieuDe: 'preventDefault on a link',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['preventDefault', 'default actions', 'anchor'], the: ['events', 'exercise-16'],
      moTa: {
        en: '<p>A "Cancel" link (<code>&lt;a href="/home"&gt;</code>) inside an editor must not navigate when there are unsaved changes: it asks to discard them instead. Without changes it may follow the link (here: shows "Leaving…").</p>',
        vi: '<p>Link "Cancel" (<code>&lt;a href="/home"&gt;</code>) trong trình soạn thảo không được chuyển trang khi còn thay đổi chưa lưu: nó hỏi có bỏ thay đổi không. Không có thay đổi thì được đi (ở đây: hiện "Leaving…").</p>',
      },
      yeuCau: [
        { en: 'With unsaved text: clicking <code>#cancel</code> calls <code>e.preventDefault()</code> and shows <code>#warn</code> "You have unsaved changes".', vi: 'Có chữ chưa lưu: bấm <code>#cancel</code> gọi <code>e.preventDefault()</code> và hiện <code>#warn</code> "You have unsaved changes".' },
        { en: 'Without changes: <code>#status</code> "Leaving…" (no warning).', vi: 'Không có thay đổi: <code>#status</code> "Leaving…" (không cảnh báo).' },
      ],
      viDu: [{ input: 'type "draft", click Cancel', output: 'You have unsaved changes', explanation: 'The default action of a link is navigation.|||Hành vi mặc định của link là chuyển trang.' }],
      goiY: ['onClick={(e) => { if (text) { e.preventDefault(); setWarn(true); } else setStatus("Leaving…"); }}', 'preventDefault chặn hành vi mặc định; không chặn nổi bọt.'],
      loiHayGap: ['<code>return false</code> như jQuery ⇒ React KHÔNG coi đó là preventDefault.', 'Đổi link thành nút chỉ để né vấn đề — mất ngữ nghĩa điều hướng.'],
      thuatNgu: [{ en: 'unsaved changes', vi: 'thay đổi chưa lưu' }],
      giaiThich: '<p>Trong React phải gọi <code>e.preventDefault()</code> tường minh — trả về <code>false</code> không có tác dụng như HTML/jQuery.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  return (
    <div>
      <textarea id="editor" value={text} onChange={(e) => setText(e.target.value)} />
      <a id="cancel" href="/home" onClick={() => { if (text) return false; }}>Cancel</a>
    </div>
  );
}
`,
      giai: `// src/App.js — preventDefault TƯỜNG MINH (return false không có tác dụng trong React)
import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [warn, setWarn] = useState(false);
  const [status, setStatus] = useState('');

  const handleCancel = (e) => {
    if (text.trim()) {
      e.preventDefault();
      setWarn(true);
      return;
    }
    setStatus('Leaving…');
  };

  return (
    <div>
      <textarea id="editor" value={text} onChange={(e) => { setText(e.target.value); setWarn(false); }} />
      <a id="cancel" href="/home" onClick={handleCancel}>Cancel</a>
      {warn && <p id="warn">You have unsaved changes</p>}
      {status && <p id="status">{status}</p>}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Unsaved changes ⇒ warning', kiem: 'text', selector: '#warn', giaTri: 'You have unsaved changes', truoc: [{ hanhDong: 'nhap', selector: '#editor', giaTri: 'draft' }, click('#cancel')] },
        { moTa: 'No changes ⇒ leaving', kiem: 'danh-sach-text', selector: '#warn, #status', mongDoi: ['Leaving…'], truoc: [click('#cancel')] },
        { moTa: 'preventDefault is called explicitly', kiem: 'ma-nguon', khop: '\\.preventDefault\\(\\)' },
      ],
    }),
    reactNho({
      tieuDe: 'Inbox actions with one delegated handler',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['delegation', 'data-action', 'data-id', 'switch on action'], the: ['events', 'exercise-16'],
      moTa: {
        en: '<p>An inbox list where each row has three actions (star, archive, delete). Put ONE <code>onClick</code> on the <code>ul</code>; each button carries <code>data-action</code> and the row carries <code>data-id</code>. Dispatch on the action name.</p>',
        vi: '<p>Hộp thư mỗi dòng có ba hành động (gắn sao, lưu trữ, xoá). Đặt MỘT <code>onClick</code> trên <code>ul</code>; mỗi nút mang <code>data-action</code>, mỗi dòng mang <code>data-id</code>. Xử lý theo tên hành động.</p>',
      },
      yeuCau: [
        { en: '<code>ul#inbox</code> → <code>li.mail[data-id]</code> with buttons <code>[data-action="star"]</code>, <code>[data-action="archive"]</code>, <code>[data-action="delete"]</code>.', vi: '<code>ul#inbox</code> → <code>li.mail[data-id]</code> với nút <code>[data-action="star"]</code>, <code>[data-action="archive"]</code>, <code>[data-action="delete"]</code>.' },
        { en: 'star toggles class <code>starred</code>; archive moves it to <code>ul#archive</code>; delete removes it. <code>#counts</code> "Inbox 3 · Archive 0".', vi: 'star bật/tắt class <code>starred</code>; archive chuyển sang <code>ul#archive</code>; delete xoá. <code>#counts</code> "Inbox 3 · Archive 0".' },
      ],
      viDu: [{ input: 'archive mail 2', output: 'Inbox 2 · Archive 1', explanation: 'const id = Number(row.dataset.id); switch (btn.dataset.action) …|||const id = Number(row.dataset.id); switch (btn.dataset.action) …' }],
      goiY: ['const btn = e.target.closest("[data-action]"); const row = e.target.closest("[data-id]"); if (!btn || !row) return;', 'Mỗi mail { id, subject, starred, archived } — hai danh sách là giá trị suy ra (filter theo archived).'],
      loiHayGap: ['<code>dataset.id</code> là CHUỖI — so với id số bằng <code>===</code> sẽ sai, phải Number().', 'Giữ hai mảng state inbox/archive riêng ⇒ chuyển qua lại dễ nhân bản/mất thư.'],
      thuatNgu: [{ en: 'dispatch', vi: 'phân luồng xử lý theo loại hành động' }],
      giaiThich: '<p>Một handler đọc hai thứ từ DOM: dòng nào (<code>data-id</code>) và làm gì (<code>data-action</code>), rồi cập nhật MỘT mảng mail. Hai danh sách Inbox/Archive là bộ lọc của cùng mảng — không thể lệch nhau. Mẫu "action + id" này chính là ý tưởng của reducer ở chương 8.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [mails, setMails] = useState([
    { id: 1, subject: 'Exam schedule', starred: false, archived: false },
    { id: 2, subject: 'Lab 6 feedback', starred: false, archived: false },
    { id: 3, subject: 'Club meeting', starred: false, archived: false },
  ]);
  // TODO: một onClick trên #inbox, data-action / data-id
  return <ul id="inbox">{mails.map((m) => <li key={m.id} className="mail">{m.subject}</li>)}</ul>;
}
`,
      giai: `// src/App.js — MỘT handler trên ul: đọc data-id (dòng nào) + data-action (làm gì)
import { useState } from 'react';

export default function App() {
  const [mails, setMails] = useState([
    { id: 1, subject: 'Exam schedule', starred: false, archived: false },
    { id: 2, subject: 'Lab 6 feedback', starred: false, archived: false },
    { id: 3, subject: 'Club meeting', starred: false, archived: false },
  ]);

  const handleClick = (e) => {
    const btn = e.target.closest('[data-action]');
    const row = e.target.closest('[data-id]');
    if (!btn || !row) return;
    const id = Number(row.dataset.id); // dataset luôn là CHUỖI
    switch (btn.dataset.action) {
      case 'star':
        setMails((ms) => ms.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
        break;
      case 'archive':
        setMails((ms) => ms.map((m) => (m.id === id ? { ...m, archived: true } : m)));
        break;
      case 'delete':
        setMails((ms) => ms.filter((m) => m.id !== id));
        break;
      default:
    }
  };

  const row = (m) => (
    <li key={m.id} data-id={m.id} className={m.starred ? 'mail starred' : 'mail'}>
      <span className="subject">{m.subject}</span>
      <button type="button" data-action="star">★</button>
      {!m.archived && <button type="button" data-action="archive">Archive</button>}
      <button type="button" data-action="delete">Delete</button>
    </li>
  );
  const inbox = mails.filter((m) => !m.archived);
  const archive = mails.filter((m) => m.archived);

  return (
    <div onClick={handleClick}>
      <ul id="inbox">{inbox.map(row)}</ul>
      <ul id="archive">{archive.map(row)}</ul>
      <p id="counts">Inbox {inbox.length} · Archive {archive.length}</p>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Initial counts', kiem: 'text', selector: '#counts', giaTri: 'Inbox 3 · Archive 0' },
        { moTa: 'Archive moves a mail', kiem: 'danh-sach-text', selector: '#archive .subject, #counts', mongDoi: ['Lab 6 feedback', 'Inbox 2 · Archive 1'], truoc: [click('[data-id="2"] [data-action="archive"]')] },
        { moTa: 'Star toggles the class', kiem: 'so-luong', selector: '.mail.starred', giaTri: 1, truoc: [click('[data-id="3"] [data-action="star"]')] },
        { moTa: 'Delete removes', kiem: 'danh-sach-text', selector: '#inbox .subject', mongDoi: ['Exam schedule', 'Club meeting'], truoc: [click('[data-id="2"] [data-action="delete"]')] },
        { an: true, moTa: 'Star twice ⇒ not starred', kiem: 'so-luong', selector: '.mail.starred', giaTri: 0, truoc: [click('[data-id="1"] [data-action="star"]'), click('[data-id="1"] [data-action="star"]')] },
      ],
    }),
  ],
});
