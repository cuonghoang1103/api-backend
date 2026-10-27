/**
 * FER202 · Exercise 10 — Demo about React-Bootstrap (bài luyện component có hành vi: Alert, Table, Tabs, Modal).
 */
import { doiDau, KHOA, reactNho } from './_chung.mjs';

const RB = ['react-bootstrap', 'bootstrap'];
const IMPORT = "import 'bootstrap/dist/css/bootstrap.min.css';\n";
const cho = (ms = 500) => ({ hanhDong: 'cho', ms });
const click = (selector) => ({ hanhDong: 'click', selector });

export default doiDau({
  slug: 'fer202-4-ex10-react-bootstrap',
  ten: '4.9 Exercise 10 — React-Bootstrap components',
  khoa: KHOA,
  baiHoc: 'fer202-4-ex10-react-bootstrap',
  de: [
    reactNho({
      tieuDe: 'Dismissible alert controlled by state',
      doKho: 'EASY', phut: 8, thuVien: RB,
      khaiNiem: ['Alert', 'dismissible', 'show/onClose'], the: ['react-bootstrap', 'alert'],
      moTa: {
        en: '<p>React-Bootstrap components are <b>controlled</b>: you keep the "is it visible?" flag in state and pass it as <code>show</code>. Build an alert that can be closed and shown again.</p>',
        vi: '<p>Component React-Bootstrap là <b>controlled</b>: bạn giữ cờ "có hiện không?" trong state và truyền vào <code>show</code>. Làm một alert đóng được và mở lại được.</p>',
      },
      yeuCau: [
        { en: '<code>Alert variant="warning" dismissible id="notice"</code> visible at start with heading "Maintenance tonight".', vi: '<code>Alert variant="warning" dismissible id="notice"</code> hiện lúc đầu với tiêu đề "Maintenance tonight".' },
        { en: 'Closing it shows <code>Button#btn-show</code> "Show notice" which brings it back.', vi: 'Đóng nó thì hiện <code>Button#btn-show</code> "Show notice" để mở lại.' },
      ],
      viDu: [{ input: 'click × on the alert', output: 'alert gone, "Show notice" button visible', explanation: 'onClose={() => setShow(false)}|||onClose={() => setShow(false)}' }],
      goiY: ['const [show, setShow] = useState(true);', '<Alert show={show} onClose={() => setShow(false)} dismissible> … </Alert> {!show && <Button …>}'],
      loiHayGap: ['Thêm <code>dismissible</code> mà không có <code>onClose</code>/<code>show</code> ⇒ bấm × không có tác dụng.', 'Dùng <code>document.getElementById(...).remove()</code> ⇒ phá DOM do React quản lý.'],
      thuatNgu: [{ en: 'dismissible', vi: 'đóng được bằng nút ×' }],
      giaiThich: '<p>Hiển thị là dữ liệu: <code>show</code> trong state quyết định alert có mặt hay không; nút × chỉ gọi <code>onClose</code> để đổi state.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Alert } from 'react-bootstrap';

export default function App() {
  return (
    <Alert id="notice" variant="warning" dismissible>
      <Alert.Heading>Maintenance tonight</Alert.Heading>
      The site will be down from 23:00 to 01:00.
    </Alert>
  );
}
`,
      giai: `// src/App.js — show nằm trong state; × gọi onClose để đổi state
${IMPORT}import { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <div className="p-3">
      <Alert id="notice" variant="warning" dismissible show={show} onClose={() => setShow(false)}>
        <Alert.Heading>Maintenance tonight</Alert.Heading>
        The site will be down from 23:00 to 01:00.
      </Alert>
      {!show && <Button id="btn-show" onClick={() => setShow(true)}>Show notice</Button>}
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Warning alert visible at start', kiem: 'text', selector: '#notice.alert-warning .alert-heading', giaTri: 'Maintenance tonight' },
        { moTa: '× closes it and shows the button', kiem: 'danh-sach-text', selector: '#notice, #btn-show', mongDoi: ['Show notice'], truoc: [click('#notice .btn-close'), cho()] },
        { moTa: 'Button brings it back', kiem: 'ton-tai', selector: '#notice.alert-warning', truoc: [click('#notice .btn-close'), cho(), click('#btn-show'), cho()] },
      ],
    }),
    reactNho({
      tieuDe: 'Data table with React-Bootstrap Table',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['Table', 'striped/hover/responsive', 'tfoot totals'], the: ['react-bootstrap', 'table'],
      moTa: {
        en: '<p>Render the order lines as a responsive striped table with a computed total row in <code>tfoot</code>. Numbers are right-aligned (<code>text-end</code>).</p>',
        vi: '<p>Vẽ các dòng đơn hàng thành bảng sọc responsive, có dòng tổng tính sẵn trong <code>tfoot</code>. Cột số căn phải (<code>text-end</code>).</p>',
      },
      yeuCau: [
        { en: '<code>Table striped bordered hover responsive id="lines"</code>: Item · Qty · Price · Amount; amounts = qty × price.', vi: '<code>Table striped bordered hover responsive id="lines"</code>: Item · Qty · Price · Amount; thành tiền = qty × price.' },
        { en: '<code>tfoot</code> row: "Total" spanning 3 columns + total amount <code>#grand-total</code>.', vi: 'Dòng <code>tfoot</code>: "Total" gộp 3 cột + tổng <code>#grand-total</code>.' },
      ],
      viDu: [{ input: 'Pen 3 × 5,000', output: 'Amount 15,000', explanation: 'Format with toLocaleString(\'en-US\').|||Định dạng bằng toLocaleString(\'en-US\').' }],
      goiY: ['<Table striped bordered hover responsive> tự bọc div.table-responsive.', 'Tổng: LINES.reduce((s, l) => s + l.qty * l.price, 0).'],
      loiHayGap: ['Đặt dòng tổng trong <code>tbody</code> ⇒ khi sắp xếp/lọc nó bị lẫn với dữ liệu.', 'Quên <code>responsive</code> ⇒ bảng tràn ngang trên điện thoại.'],
      thuatNgu: [{ en: 'tfoot', vi: 'phần chân bảng' }],
      giaiThich: '<p>Các prop của <code>Table</code> thêm class <code>table-striped/bordered/hover</code>; <code>responsive</code> bọc bảng trong vùng cuộn ngang. Tổng là giá trị suy ra, đặt ở <code>tfoot</code>.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}const LINES = [
  { id: 1, item: 'Notebook', qty: 2, price: 25000 },
  { id: 2, item: 'Pen', qty: 3, price: 5000 },
  { id: 3, item: 'Backpack', qty: 1, price: 320000 },
];

export default function App() {
  return <ul>{LINES.map((l) => <li key={l.id}>{l.item}</li>)}</ul>;
}
`,
      giai: `// src/App.js — Table của React-Bootstrap + dòng tổng trong tfoot
${IMPORT}import { Table } from 'react-bootstrap';

const LINES = [
  { id: 1, item: 'Notebook', qty: 2, price: 25000 },
  { id: 2, item: 'Pen', qty: 3, price: 5000 },
  { id: 3, item: 'Backpack', qty: 1, price: 320000 },
];
const fmt = (n) => n.toLocaleString('en-US');

export default function App() {
  const total = LINES.reduce((s, l) => s + l.qty * l.price, 0);
  return (
    <div className="p-3">
      <Table striped bordered hover responsive id="lines">
        <thead>
          <tr><th>Item</th><th className="text-end">Qty</th><th className="text-end">Price</th><th className="text-end">Amount</th></tr>
        </thead>
        <tbody>
          {LINES.map((l) => (
            <tr key={l.id}>
              <td>{l.item}</td>
              <td className="text-end">{l.qty}</td>
              <td className="text-end">{fmt(l.price)}</td>
              <td className="text-end amount">{fmt(l.qty * l.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={3}>Total</th>
            <th className="text-end" id="grand-total">{fmt(total)}</th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Table classes + responsive wrapper', kiem: 'ton-tai', selector: '.table-responsive > table#lines.table.table-striped.table-bordered.table-hover' },
        { moTa: 'Amounts computed', kiem: 'danh-sach-text', selector: '#lines tbody .amount', mongDoi: ['50,000', '15,000', '320,000'] },
        { moTa: 'Total in tfoot', kiem: 'text', selector: '#lines tfoot #grand-total', giaTri: '385,000' },
        { an: true, moTa: 'Numbers right-aligned', kiem: 'so-luong', selector: '#lines tbody td.text-end', giaTri: 9 },
      ],
    }),
    reactNho({
      tieuDe: 'Tabs with a controlled active key',
      doKho: 'MEDIUM', phut: 10, thuVien: RB,
      khaiNiem: ['Tabs', 'Tab', 'activeKey', 'onSelect'], the: ['react-bootstrap', 'tabs'],
      moTa: {
        en: '<p>Profile tabs: Overview, Courses, Settings. Control the active tab with state so another button ("Edit settings") can switch tabs from outside.</p>',
        vi: '<p>Tab hồ sơ: Overview, Courses, Settings. Điều khiển tab đang mở bằng state để một nút khác ("Edit settings") có thể chuyển tab từ bên ngoài.</p>',
      },
      yeuCau: [
        { en: '<code>Tabs id="profile-tabs" activeKey={key} onSelect={setKey}</code> with <code>Tab eventKey="overview|courses|settings"</code>.', vi: '<code>Tabs id="profile-tabs" activeKey={key} onSelect={setKey}</code> với <code>Tab eventKey="overview|courses|settings"</code>.' },
        { en: 'Panels contain <code>#overview-pane</code>, <code>#courses-pane</code> (3 <code>li</code>), <code>#settings-pane</code>; <code>#btn-edit</code> switches to settings.', vi: 'Các khung chứa <code>#overview-pane</code>, <code>#courses-pane</code> (3 <code>li</code>), <code>#settings-pane</code>; <code>#btn-edit</code> chuyển sang settings.' },
      ],
      viDu: [{ input: 'click "Courses" tab', output: 'the courses pane becomes active', explanation: 'Controlled: onSelect updates key, Tabs re-renders with the new activeKey.|||Controlled: onSelect cập nhật key, Tabs vẽ lại với activeKey mới.' }],
      goiY: ['const [key, setKey] = useState("overview");', '<Tabs activeKey={key} onSelect={(k) => setKey(k)} id="profile-tabs">'],
      loiHayGap: ['Dùng <code>defaultActiveKey</code> (uncontrolled) rồi muốn đổi tab từ nút ngoài ⇒ không được.', 'Trùng <code>eventKey</code> giữa hai Tab.'],
      thuatNgu: [{ en: 'controlled vs uncontrolled', vi: 'do state của bạn điều khiển / tự component giữ' }],
      giaiThich: '<p><code>defaultActiveKey</code> để component tự nhớ (uncontrolled); <code>activeKey</code> + <code>onSelect</code> đưa quyền điều khiển cho bạn, nên mọi nơi khác đều chuyển tab được bằng <code>setKey</code>.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { Tab, Tabs } from 'react-bootstrap';

export default function App() {
  return (
    <Tabs id="profile-tabs" defaultActiveKey="overview">
      <Tab eventKey="overview" title="Overview"><p id="overview-pane">Hello!</p></Tab>
    </Tabs>
  );
}
`,
      giai: `// src/App.js — Tabs CONTROLLED: activeKey trong state, đổi được từ bất kỳ đâu
${IMPORT}import { useState } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';

export default function App() {
  const [key, setKey] = useState('overview');
  return (
    <div className="p-3">
      <Button id="btn-edit" variant="outline-secondary" size="sm" className="mb-2" onClick={() => setKey('settings')}>Edit settings</Button>
      <Tabs id="profile-tabs" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="overview" title="Overview"><p id="overview-pane">Hello! You joined in 2025.</p></Tab>
        <Tab eventKey="courses" title="Courses">
          <ul id="courses-pane"><li>React Basics</li><li>React Router</li><li>Redux Toolkit</li></ul>
        </Tab>
        <Tab eventKey="settings" title="Settings"><p id="settings-pane">Notification settings</p></Tab>
      </Tabs>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Three tabs, Overview active', kiem: 'danh-sach-text', selector: '#profile-tabs .nav-link.active', mongDoi: ['Overview'] },
        { moTa: 'Clicking Courses activates its pane', kiem: 'so-luong', selector: '.tab-pane.active #courses-pane li', giaTri: 3, truoc: [click('#profile-tabs-tab-courses'), cho()] },
        { moTa: '#btn-edit switches to Settings', kiem: 'ton-tai', selector: '.tab-pane.active #settings-pane', truoc: [click('#btn-edit'), cho()] },
        { an: true, moTa: 'Uses activeKey (controlled)', kiem: 'ma-nguon', khop: 'activeKey=\\{' },
      ],
    }),
    reactNho({
      tieuDe: 'Confirm-delete modal',
      doKho: 'HARD', phut: 15, thuVien: RB,
      khaiNiem: ['Modal', 'pending action state', 'list update'], the: ['react-bootstrap', 'modal'],
      moTa: {
        en: '<p>Deleting must be confirmed in a <b>Modal</b>. Remember WHICH item is waiting for confirmation (state <code>toDelete</code>); the modal is open whenever that state is not null.</p>',
        vi: '<p>Xoá phải được xác nhận trong <b>Modal</b>. Hãy nhớ phần tử NÀO đang chờ xác nhận (state <code>toDelete</code>); modal mở khi state đó khác null.</p>',
      },
      yeuCau: [
        { en: '<code>ListGroup#tasks</code> with <code>ListGroup.Item.task</code> and a <code>.btn-del</code> each.', vi: '<code>ListGroup#tasks</code> với các <code>ListGroup.Item.task</code>, mỗi mục một nút <code>.btn-del</code>.' },
        { en: 'Modal title "Delete task?", body shows the task title; <code>#btn-confirm</code> deletes, <code>#btn-cancel</code> keeps it.', vi: 'Tiêu đề modal "Delete task?", thân hiện tên công việc; <code>#btn-confirm</code> xoá, <code>#btn-cancel</code> giữ lại.' },
      ],
      viDu: [{ input: 'click delete on "Write tests", then Confirm', output: '2 tasks left', explanation: 'show={toDelete !== null}|||show={toDelete !== null}' }],
      goiY: ['const [toDelete, setToDelete] = useState(null); — lưu cả object task.', 'Confirm: setTasks(ts => ts.filter(t => t.id !== toDelete.id)); setToDelete(null);'],
      loiHayGap: ['Dùng hai state (<code>show</code> + <code>selectedId</code>) dễ lệch nhau; một state <code>toDelete</code> là đủ.', '<code>window.confirm</code> — chặn luồng và không theo giao diện của app.'],
      thuatNgu: [{ en: 'modal', vi: 'hộp thoại che trang' }, { en: 'pending action', vi: 'hành động đang chờ xác nhận' }],
      giaiThich: '<p>Một state duy nhất (<code>toDelete</code>) vừa cho biết modal có mở không, vừa cho biết xoá cái gì — không thể lệch nhau. Huỷ chỉ đặt lại null; xác nhận lọc khỏi danh sách rồi đặt null.</p>',
      dau: `// src/App.js — STARTER
${IMPORT}import { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';

export default function App() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'Write tests' }, { id: 2, title: 'Fix bug #42' }, { id: 3, title: 'Deploy' }]);
  return (
    <ListGroup id="tasks">
      {tasks.map((t) => (
        <ListGroup.Item key={t.id} className="task">
          {t.title} <Button size="sm" className="btn-del" onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))}>Delete</Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
`,
      giai: `// src/App.js — MỘT state toDelete: vừa mở modal, vừa nhớ xoá cái gì
${IMPORT}import { useState } from 'react';
import { Button, ListGroup, Modal } from 'react-bootstrap';

export default function App() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'Write tests' }, { id: 2, title: 'Fix bug #42' }, { id: 3, title: 'Deploy' }]);
  const [toDelete, setToDelete] = useState(null);

  const confirm = () => {
    setTasks((ts) => ts.filter((t) => t.id !== toDelete.id));
    setToDelete(null);
  };

  return (
    <div className="p-3">
      <ListGroup id="tasks">
        {tasks.map((t) => (
          <ListGroup.Item key={t.id} className="task d-flex justify-content-between align-items-center">
            <span className="task-title">{t.title}</span>
            <Button size="sm" variant="outline-danger" className="btn-del" onClick={() => setToDelete(t)}>Delete</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={toDelete !== null} onHide={() => setToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete task?</Modal.Title>
        </Modal.Header>
        <Modal.Body id="modal-body">"{toDelete?.title}" will be removed.</Modal.Body>
        <Modal.Footer>
          <Button id="btn-cancel" variant="secondary" onClick={() => setToDelete(null)}>Cancel</Button>
          <Button id="btn-confirm" variant="danger" onClick={confirm}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Delete opens a modal naming the task', kiem: 'danh-sach-text', selector: '.modal.show .modal-title, .modal.show #modal-body', mongDoi: ['Delete task?', '"Write tests" will be removed.'], truoc: [click('.task:first-child .btn-del'), cho()] },
        { moTa: 'Nothing is deleted before confirming', kiem: 'so-luong', selector: '#tasks .task', giaTri: 3, truoc: [click('.task:first-child .btn-del'), cho()] },
        { moTa: 'Confirm removes that task', kiem: 'danh-sach-text', selector: '#tasks .task-title', mongDoi: ['Fix bug #42', 'Deploy'], truoc: [click('.task:first-child .btn-del'), cho(), click('#btn-confirm'), cho()] },
        { an: true, moTa: 'Cancel keeps all tasks and closes', kiem: 'so-luong', selector: '#tasks .task, .modal.show', giaTri: 3, truoc: [click('.task:nth-child(2) .btn-del'), cho(), click('#btn-cancel'), cho(700)] },
      ],
    }),
  ],
});
