/**
 * FER202 · 4.3 — Slide check: React-Bootstrap (Slot 7). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-4-4-slot7-react-bootstrap-slides',
  ten: '4.8 Slide check — React-Bootstrap',
  khoa: KHOA,
  baiHoc: 'fer202-4-4-slot7-react-bootstrap-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: React-Bootstrap components',
      doKho: 'EASY', phut: 10,
      khaiNiem: ['react-bootstrap', 'props', 'controlled components'], the: ['react-bootstrap', 'quiz'],
      moTa: {
        en: '<p>Eight questions on using Bootstrap through React components.</p>',
        vi: '<p>Tám câu về cách dùng Bootstrap qua component React.</p>',
      },
      goiY: ['Prop của React-Bootstrap luôn được dịch thành class Bootstrap.', 'Component có trạng thái mở/đóng (Modal, Alert, Toast) nhận show + hàm đóng.'],
      loiHayGap: ['Nhầm <code>variant</code> (màu) với <code>bg</code> (màu nền của Badge/Navbar).', 'Quên import component từ <code>react-bootstrap</code>.'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'subcomponent', vi: 'component con dạng Card.Body, Modal.Header…' }],
      cauHoi: [
        q('q1', 'Correct import of a Button?', [['a', "<code>import Button from 'bootstrap'</code>"], ['b', "<code>import { Button } from 'react-bootstrap'</code>"], ['c', "<code>import { Button } from 'react'</code>"], ['d', "<code>import 'react-bootstrap/Button.css'</code>"]], ['b'], 'Named import from react-bootstrap (or the per-component path <code>react-bootstrap/Button</code>).|||Import có tên từ react-bootstrap (hoặc đường dẫn riêng react-bootstrap/Button).'),
        q('q2', '<code>&lt;Button variant="outline-success" size="lg"&gt;</code> produces…', [['a', '<code>btn btn-outline-success btn-lg</code>'], ['b', '<code>button success outline large</code>'], ['c', '<code>btn-success-outline lg</code>'], ['d', 'inline styles']], ['a'], 'variant ⇒ btn-{variant}, size ⇒ btn-{size}.|||variant ⇒ btn-{variant}, size ⇒ btn-{size}.'),
        q('q3', 'How do you open a React-Bootstrap Modal?', [['a', "<code>$('#myModal').modal('show')</code>"], ['b', 'Set a state to true and pass it as <code>show</code>'], ['c', 'Call <code>Modal.open()</code>'], ['d', 'Add class <code>show</code> by hand']], ['b'], 'Modals are controlled: <code>show={isOpen}</code> and <code>onHide={() =&gt; setOpen(false)}</code>.|||Modal là controlled: show={isOpen} và onHide={() => setOpen(false)}.'),
        q('q4', 'Which subcomponents belong to Card? (choose all)', [['a', '<code>Card.Body</code>'], ['b', '<code>Card.Title</code>'], ['c', '<code>Card.Row</code>'], ['d', '<code>Card.Img</code>']], [['a', 'b', 'd']], 'Card has Body, Title, Subtitle, Text, Img, Header, Footer, Link — no Row.|||Card có Body, Title, Subtitle, Text, Img, Header, Footer, Link — không có Row.', true),
        q('q5', '<code>&lt;Row xs={1} md={3}&gt;</code> means…', [['a', 'every Col is md-3'], ['b', '1 column per row on phones, 3 per row from md'], ['c', 'the row is 3px tall'], ['d', 'invalid prop']], ['b'], 'Numeric props on Row become row-cols-* classes.|||Prop số trên Row thành class row-cols-*.'),
        q('q6', 'What does the <code>as</code> prop do?', [['a', 'Renames the component'], ['b', 'Changes the rendered HTML element/component while keeping the styles'], ['c', 'Adds an alias import'], ['d', 'Sets aria-label']], ['b'], 'e.g. <code>&lt;Nav.Link as={NavLink} to="/"&gt;</code> renders a router link with Bootstrap styles.|||vd <Nav.Link as={NavLink} to="/"> vẽ link của router với giao diện Bootstrap.'),
        q('q7', 'Form validation styles appear when…', [['a', 'You add <code>validated</code> to Form (after submit) or <code>isInvalid</code> to a control'], ['b', 'Always'], ['c', 'Only with Formik'], ['d', 'Only in Bootstrap 4']], ['a'], '<code>validated</code> adds .was-validated (browser rules); <code>isInvalid</code>/<code>isValid</code> are for your own rules.|||validated thêm .was-validated (luật trình duyệt); isInvalid/isValid dành cho luật của bạn.'),
        q('q8', 'Why prefer <code>Navbar.Collapse</code> + <code>Navbar.Toggle</code> over a plain list of links?', [['a', 'They look nicer only'], ['b', 'They collapse the menu into a hamburger on small screens'], ['c', 'They are faster'], ['d', 'They add routing']], ['b'], 'With <code>expand="lg"</code>, below lg the links hide behind the toggle button.|||Với expand="lg", dưới lg các link ẩn sau nút ☰.'),
      ],
    }),
  ],
});
