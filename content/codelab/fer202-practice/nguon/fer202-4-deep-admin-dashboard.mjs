/**
 * FER202 · Chương 4 — DEEP LAB: Bootstrap Admin Dashboard (React-Bootstrap chuyên sâu).
 * Sâu hơn Lab 4 (trang landing tĩnh): lưới đáp ứng nhiều mốc, Navbar thu gọn, thẻ thống kê suy ra từ dữ liệu,
 * bảng responsive + Badge theo trạng thái, lọc bằng ButtonGroup, Pagination, Modal + Form validation kiểu Bootstrap
 * (noValidate + validated + isInvalid + Feedback), Toast thông báo.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const cho = (ms = 400) => ({ hanhDong: 'cho', ms });

const DATA = `// src/data/orders.js — dữ liệu mẫu (đã cho)
export const ORDERS = [
  { id: 1, customer: 'An', amount: 250000, status: 'Paid' },
  { id: 2, customer: 'Binh', amount: 120000, status: 'Pending' },
  { id: 3, customer: 'Cuong', amount: 990000, status: 'Paid' },
  { id: 4, customer: 'Dung', amount: 45000, status: 'Cancelled' },
  { id: 5, customer: 'Em', amount: 310000, status: 'Pending' },
  { id: 6, customer: 'Giang', amount: 500000, status: 'Paid' },
];

export const STATUS_VARIANT = { Paid: 'success', Pending: 'warning', Cancelled: 'danger' };
`;

const FORMAT = `// src/utils/format.js (đã cho)
export const vnd = (n) => n.toLocaleString('en-US') + ' ₫';
`;

const NAVBAR = `// src/components/AppNavbar.js — Navbar thu gọn dưới mốc lg
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function AppNavbar() {
  return (
    <Navbar id="main-nav" bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand id="brand" href="#">CT Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav-collapse" />
        <Navbar.Collapse id="main-nav-collapse">
          <Nav className="me-auto">
            <Nav.Link href="#" active>Dashboard</Nav.Link>
            <Nav.Link href="#orders">Orders</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
`;

const STATS = `// src/components/StatCards.js — 4 thẻ thống kê, lưới 1 / 2 / 4 cột theo màn hình
import { Card, Col, Row } from 'react-bootstrap';
import { vnd } from '../utils/format';

export default function StatCards({ orders }) {
  const revenue = orders.filter((o) => o.status === 'Paid').reduce((s, o) => s + o.amount, 0);
  const stats = [
    { key: 'total', label: 'Total orders', value: orders.length },
    { key: 'revenue', label: 'Revenue', value: vnd(revenue) },
    { key: 'pending', label: 'Pending', value: orders.filter((o) => o.status === 'Pending').length },
    { key: 'cancelled', label: 'Cancelled', value: orders.filter((o) => o.status === 'Cancelled').length },
  ];
  return (
    <Row className="g-3 mb-4">
      {stats.map((s) => (
        <Col key={s.key} xs={12} md={6} xl={3}>
          <Card className="stat-card h-100" id={´stat-@{s.key}´}>
            <Card.Body>
              <Card.Subtitle className="text-muted">{s.label}</Card.Subtitle>
              <Card.Title className="stat-value fs-3 mt-2">{s.value}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
`;

const TABLE = `// src/components/OrdersTable.js — bảng responsive + Badge theo trạng thái
import { Badge, Table } from 'react-bootstrap';
import { STATUS_VARIANT } from '../data/orders';
import { vnd } from '../utils/format';

export default function OrdersTable({ orders }) {
  if (orders.length === 0) return <p id="no-orders" className="text-muted">No orders</p>;
  return (
    <Table striped hover responsive id="orders-table">
      <thead>
        <tr><th>#</th><th>Customer</th><th className="text-end">Amount</th><th>Status</th></tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="order-row">
            <td>{o.id}</td>
            <td className="customer">{o.customer}</td>
            <td className="text-end amount">{vnd(o.amount)}</td>
            <td><Badge bg={STATUS_VARIANT[o.status]} className="status">{o.status}</Badge></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
`;

const MODAL = `// src/components/NewOrderModal.js — Form validation kiểu Bootstrap: noValidate + validated + isInvalid
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

const EMPTY = { customer: '', amount: '' };

export default function NewOrderModal({ show, onHide, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [validated, setValidated] = useState(false);

  const customerOk = form.customer.trim().length >= 2;
  const amountOk = Number(form.amount) >= 1000;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const close = () => {
    setForm(EMPTY);
    setValidated(false);
    onHide();
  };

  const submit = (e) => {
    e.preventDefault();
    setValidated(true);
    if (!customerOk || !amountOk) return;
    onCreate({ customer: form.customer.trim(), amount: Number(form.amount) });
    close();
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Form noValidate validated={validated} onSubmit={submit} id="order-form">
        <Modal.Header closeButton>
          <Modal.Title>New order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="customer">
            <Form.Label>Customer</Form.Label>
            <Form.Control name="customer" value={form.customer} onChange={change} isInvalid={validated && !customerOk} isValid={validated && customerOk} />
            <Form.Control.Feedback type="invalid">Customer name needs at least 2 characters</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="amount">
            <Form.Label>Amount (₫)</Form.Label>
            <Form.Control name="amount" type="number" value={form.amount} onChange={change} isInvalid={validated && !amountOk} isValid={validated && amountOk} />
            <Form.Control.Feedback type="invalid">Amount must be at least 1,000</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btn-cancel" variant="secondary" onClick={close}>Cancel</Button>
          <Button id="btn-save" type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
`;

const APP = `// src/App.js — ghép dashboard: state đơn hàng, lọc, trang, modal, toast
import { useState } from 'react';
import { Button, ButtonGroup, Col, Container, Pagination, Row, Toast, ToastContainer } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import StatCards from './components/StatCards';
import OrdersTable from './components/OrdersTable';
import NewOrderModal from './components/NewOrderModal';
import { ORDERS } from './data/orders';

const FILTERS = ['All', 'Paid', 'Pending', 'Cancelled'];
const PAGE_SIZE = 3;

export default function App() {
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const chooseFilter = (f) => {
    setFilter(f);
    setPage(1);
  };

  const create = ({ customer, amount }) => {
    const id = Math.max(0, ...orders.map((o) => o.id)) + 1;
    setOrders((list) => [{ id, customer, amount, status: 'Pending' }, ...list]);
    setFilter('All');
    setPage(1);
    setToast(´Order #@{id} created´);
  };

  return (
    <>
      <AppNavbar />
      <Container fluid className="py-4">
        <StatCards orders={orders} />
        <Row className="align-items-center mb-3 g-2">
          <Col xs={12} md>
            <ButtonGroup id="filters">
              {FILTERS.map((f) => (
                <Button key={f} id={´filter-@{f.toLowerCase()}´} variant={filter === f ? 'primary' : 'outline-primary'} onClick={() => chooseFilter(f)}>{f}</Button>
              ))}
            </ButtonGroup>
          </Col>
          <Col xs={12} md="auto">
            <Button id="btn-new" variant="success" onClick={() => setShowModal(true)}>+ New order</Button>
          </Col>
        </Row>
        <OrdersTable orders={visible} />
        <Pagination id="pager">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Pagination.Item key={n} active={n === current} activeLabel="" onClick={() => setPage(n)}>{n}</Pagination.Item>
          ))}
        </Pagination>
      </Container>
      <NewOrderModal show={showModal} onHide={() => setShowModal(false)} onCreate={create} />
      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast !== null} onClose={() => setToast(null)} delay={4000} autohide bg="success">
          <Toast.Body id="toast-msg" className="text-white">{toast}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
`;

const S_APP = `// src/App.js — STARTER: bảng HTML thuần, chưa dùng React-Bootstrap
import { ORDERS } from './data/orders';

export default function App() {
  return (
    <div>
      <h1>CT Admin</h1>
      <table>
        <tbody>
          {ORDERS.map((o) => <tr key={o.id}><td>{o.customer}</td><td>{o.status}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
`;
const stub = (ten, mo) => `// src/components/${ten}.js — STARTER
// ${mo}
export default function ${ten}() {
  return null;
}
`;

const INDEX = index({ bootstrap: true });
const CHUNG = { 'src/index.js': INDEX, 'src/data/orders.js': DATA, 'src/utils/format.js': FORMAT };
const LOI_GIAI = {
  'src/App.js': APP, 'src/components/AppNavbar.js': NAVBAR, 'src/components/StatCards.js': STATS,
  'src/components/OrdersTable.js': TABLE, 'src/components/NewOrderModal.js': MODAL, ...CHUNG,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/components/AppNavbar.js': stub('AppNavbar', 'Navbar#main-nav bg dark expand lg · Brand #brand "CT Admin" · Toggle + Collapse #main-nav-collapse'),
  'src/components/StatCards.js': stub('StatCards', 'Row > 4 × Col xs=12 md=6 xl=3 > Card.stat-card#stat-total|revenue|pending|cancelled .stat-value'),
  'src/components/OrdersTable.js': stub('OrdersTable', 'Table#orders-table striped hover responsive · tr.order-row .customer .amount Badge.status'),
  'src/components/NewOrderModal.js': stub('NewOrderModal', 'Modal + Form#order-form noValidate validated · #customer #amount · .invalid-feedback · #btn-save #btn-cancel'),
  ...CHUNG,
};

const NEW = (ten, tien) => [click('#btn-new'), cho(), nhap('#customer', ten), nhap('#amount', tien), click('#btn-save'), cho(600)];

const KIEM = [
  // f1 layout
  { nhom: 'f1', moTa: 'Dark navbar that collapses below lg', kiem: 'ton-tai', selector: 'nav#main-nav.navbar.navbar-expand-lg.bg-dark' },
  { nhom: 'f1', moTa: 'Brand + toggle + collapse wired by id', kiem: 'danh-sach-text', selector: '#brand, button.navbar-toggler[aria-controls="main-nav-collapse"]', mongDoi: ['CT Admin', ''] },
  { nhom: 'f1', moTa: 'Stat cards use the responsive grid col-12 col-md-6 col-xl-3', kiem: 'so-luong', selector: '.row > .col-12.col-md-6.col-xl-3 > .stat-card', giaTri: 4 },
  { nhom: 'f1', an: true, moTa: 'Collapse target exists', kiem: 'ton-tai', selector: '#main-nav-collapse.navbar-collapse' },
  // f2 stats
  { nhom: 'f2', moTa: 'Stat values derived from orders', kiem: 'danh-sach-text', selector: '.stat-card .stat-value', mongDoi: ['6', '1,740,000 ₫', '2', '1'] },
  { nhom: 'f2', an: true, moTa: 'Stats update after a new order', kiem: 'danh-sach-text', selector: '#stat-total .stat-value, #stat-pending .stat-value', mongDoi: ['7', '3'], truoc: NEW('Hoa', '75000') },
  // f3 table
  { nhom: 'f3', moTa: 'Responsive striped hover table', kiem: 'ton-tai', selector: '.table-responsive > table#orders-table.table.table-striped.table-hover' },
  { nhom: 'f3', moTa: 'Badges coloured by status', kiem: 'danh-sach-text', selector: '.order-row .status.bg-success, .order-row .status.bg-warning', mongDoi: ['Paid', 'Pending', 'Paid'] },
  { nhom: 'f3', moTa: 'Amounts formatted', kiem: 'danh-sach-text', selector: '.order-row .amount', mongDoi: ['250,000 ₫', '120,000 ₫', '990,000 ₫'] },
  // f4 filters
  { nhom: 'f4', moTa: 'Filter Pending', kiem: 'danh-sach-text', selector: '.order-row .customer', mongDoi: ['Binh', 'Em'], truoc: [click('#filter-pending')] },
  { nhom: 'f4', moTa: 'Active filter button is solid primary', kiem: 'danh-sach-text', selector: '#filters .btn-primary', mongDoi: ['Cancelled'], truoc: [click('#filter-cancelled')] },
  { nhom: 'f4', an: true, moTa: 'Other filters are outline', kiem: 'so-luong', selector: '#filters .btn-outline-primary', giaTri: 3, truoc: [click('#filter-paid')] },
  // f5 pagination
  { nhom: 'f5', moTa: '3 rows per page, 2 pages', kiem: 'danh-sach-text', selector: '#pager .page-item', mongDoi: ['1', '2'] },
  { nhom: 'f5', moTa: 'Page 2 shows the rest', kiem: 'danh-sach-text', selector: '.order-row .customer', mongDoi: ['Dung', 'Em', 'Giang'], truoc: [click('#pager .page-item:nth-child(2) .page-link')] },
  { nhom: 'f5', an: true, moTa: 'Changing filter goes back to page 1', kiem: 'text', selector: '#pager .page-item.active', khop: '^1', truoc: [click('#pager .page-item:nth-child(2) .page-link'), click('#filter-paid')] },
  // f6 modal + validation
  { nhom: 'f6', moTa: 'New order opens a modal', kiem: 'text', selector: '.modal.show .modal-title', giaTri: 'New order', truoc: [click('#btn-new'), cho()] },
  { nhom: 'f6', moTa: 'Empty submit ⇒ Bootstrap validation, no new row', kiem: 'danh-sach-text', selector: '#order-form.was-validated .is-invalid', mongDoi: ['', ''], truoc: [click('#btn-new'), cho(), click('#btn-save'), cho(200)] },
  { nhom: 'f6', moTa: 'Valid order is added at the top and the modal closes', kiem: 'danh-sach-text', selector: '.order-row:first-child .customer, .order-row:first-child .status, .modal.show', mongDoi: ['Hoa', 'Pending'], truoc: NEW('Hoa', '75000') },
  { nhom: 'f6', an: true, moTa: 'Amount below 1,000 shows its feedback', kiem: 'ton-tai', selector: '#amount.is-invalid', truoc: [click('#btn-new'), cho(), nhap('#customer', 'Hoa'), nhap('#amount', '500'), click('#btn-save'), cho(200)] },
  { nhom: 'f6', an: true, moTa: 'Form uses noValidate (no native bubbles)', kiem: 'thuoc-tinh', selector: '#order-form', thuocTinh: 'novalidate', truoc: [click('#btn-new'), cho()] },
  { nhom: 'f6', an: true, moTa: 'Cancel resets the form', kiem: 'thuoc-tinh-js', selector: '#customer', thuocTinh: 'value', giaTri: '', truoc: [click('#btn-new'), cho(), nhap('#customer', 'Temp'), click('#btn-cancel'), cho(600), click('#btn-new'), cho()] },
  // f7 toast
  { nhom: 'f7', moTa: 'Toast confirms the new order id', kiem: 'text', selector: '.toast.show #toast-msg', giaTri: 'Order #7 created', truoc: NEW('Hoa', '75000') },
  { nhom: 'f7', an: true, moTa: 'Toast lives in a top-end ToastContainer', kiem: 'ton-tai', selector: '.toast-container.top-0.end-0 .toast', truoc: NEW('Hoa', '75000') },
  // f8 bootstrap usage
  { nhom: 'f8', moTa: 'Layout built with Container/Row/Col, no inline styles', kiem: 'ma-nguon', khop: '^(?=[\\s\\S]*<Container)(?=[\\s\\S]*<Row)(?=[\\s\\S]*<Col)(?![\\s\\S]*style=\\{\\{)' },
];

const BAN_IN = {
  tieuDe: { en: 'DEEP LAB 4: Bootstrap Admin Dashboard — React-Bootstrap in depth', vi: 'DEEP LAB 4: Bảng quản trị Bootstrap — React-Bootstrap chuyên sâu' },
  phu: { en: 'FER202 · Chapter 4 (deep) · Suggested time: 120 minutes · Total: 10 marks', vi: 'FER202 · Chương 4 (chuyên sâu) · Thời gian gợi ý: 120 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build the kind of admin screen every PE and every intern project has, using <b>React-Bootstrap</b> components instead of hand-written CSS: a collapsing navbar, a responsive grid of statistic cards computed from data, a responsive table with coloured badges, filter buttons, pagination, a modal form with <b>Bootstrap validation styles</b>, and a toast notification.</p>',
    vi: '<p>Dựng loại màn hình quản trị mà đề PE nào và dự án thực tập nào cũng có, bằng component <b>React-Bootstrap</b> thay vì tự viết CSS: navbar thu gọn, lưới thẻ thống kê đáp ứng tính từ dữ liệu, bảng responsive với badge màu, nút lọc, phân trang, form trong modal với <b>kiểu kiểm hợp lệ của Bootstrap</b>, và toast thông báo.</p>',
  },
  chucNangChinh: [{ en: 'Navbar · stat cards · orders table · status filters · pagination · new-order modal with validation · toast.', vi: 'Navbar · thẻ thống kê · bảng đơn hàng · lọc trạng thái · phân trang · modal tạo đơn có kiểm hợp lệ · toast.' }],
  yeuCauChung: [
    { en: 'Use React-Bootstrap components (<code>Navbar, Container, Row, Col, Card, Table, Badge, ButtonGroup, Pagination, Modal, Form, Toast</code>); <code>index.js</code> already imports <code>bootstrap.min.css</code>.', vi: 'Dùng component React-Bootstrap (<code>Navbar, Container, Row, Col, Card, Table, Badge, ButtonGroup, Pagination, Modal, Form, Toast</code>); <code>index.js</code> đã import <code>bootstrap.min.css</code>.' },
    { en: 'No inline <code>style={{…}}</code>: spacing and colours come from Bootstrap utilities and variants.', vi: 'Không <code>style={{…}}</code> inline: khoảng cách và màu lấy từ tiện ích và biến thể của Bootstrap.' },
  ],
  cayThuMuc: `
src/
├── data/orders.js            # ORDERS, STATUS_VARIANT (given)
├── utils/format.js           # vnd (given)
├── components/
│   ├── AppNavbar.js
│   ├── StatCards.js
│   ├── OrdersTable.js
│   └── NewOrderModal.js
├── App.js
└── index.js                  # imports bootstrap.min.css`,
  wireframe: `
+----------------------------------------------------------------------+
| CT Admin   Dashboard  Orders                                   [≡]   |
+----------------------------------------------------------------------+
| [Total orders 6] [Revenue 1,740,000 ₫] [Pending 2] [Cancelled 1]     |  xl: 4 cols · md: 2 · xs: 1
| [All][Paid][Pending][Cancelled]                       [+ New order]  |
| # | Customer | Amount        | Status                                |
| 1 | An       |   250,000 ₫   | (Paid)                                |
| 2 | Binh     |   120,000 ₫   | (Pending)  …                          |
| ( 1 ) ( 2 )                                                          |
+----------------------------------------------------------------------+
                                            +----------------------+
                                            | Order #7 created     |  ← toast top-end
                                            +----------------------+`,
  moHinh: {
    ten: 'Order',
    truong: [
      ['id', 'number', { en: 'new id = max + 1', vi: 'id mới = max + 1' }],
      ['customer', 'string', { en: '≥ 2 characters', vi: '≥ 2 ký tự' }],
      ['amount', 'number (₫)', { en: '≥ 1,000', vi: '≥ 1.000' }],
      ['status', "'Paid' | 'Pending' | 'Cancelled'", { en: 'new orders start as Pending', vi: 'đơn mới là Pending' }],
    ],
  },
  chucNang: [
    { ten: { en: 'Responsive layout & navbar', vi: 'Bố cục đáp ứng & navbar' }, diem: 1.5, yeuCau: [{ en: '<code>Navbar#main-nav</code> dark, <code>expand="lg"</code>, Brand <code>#brand</code> <code>CT Admin</code>, <code>Navbar.Toggle aria-controls="main-nav-collapse"</code> + <code>Navbar.Collapse#main-nav-collapse</code>. Stat cards: <code>Col xs={12} md={6} xl={3}</code>.', vi: '<code>Navbar#main-nav</code> nền tối, <code>expand="lg"</code>, Brand <code>#brand</code> <code>CT Admin</code>, <code>Navbar.Toggle aria-controls="main-nav-collapse"</code> + <code>Navbar.Collapse#main-nav-collapse</code>. Thẻ thống kê: <code>Col xs={12} md={6} xl={3}</code>.' }] },
    { ten: { en: 'Statistic cards', vi: 'Thẻ thống kê' }, diem: 1, yeuCau: [{ en: '<code>Card.stat-card#stat-total|revenue|pending|cancelled</code> with <code>.stat-value</code>: 6 · 1,740,000 ₫ (Paid only) · 2 · 1 — computed from state.', vi: '<code>Card.stat-card#stat-total|revenue|pending|cancelled</code> có <code>.stat-value</code>: 6 · 1,740,000 ₫ (chỉ Paid) · 2 · 1 — tính từ state.' }], viDu: { en: 'add a Pending order of 75,000 ⇒ Total orders 7 · Pending 3 · Revenue unchanged', vi: 'thêm đơn Pending 75,000 ⇒ Total orders 7 · Pending 3 · Revenue không đổi' } },
    { ten: { en: 'Orders table', vi: 'Bảng đơn hàng' }, diem: 1.5, yeuCau: [{ en: '<code>Table#orders-table striped hover responsive</code>; rows <code>tr.order-row</code> with <code>.customer</code>, <code>.amount</code>, <code>Badge.status</code> using <code>STATUS_VARIANT</code> (Paid success, Pending warning, Cancelled danger).', vi: '<code>Table#orders-table striped hover responsive</code>; dòng <code>tr.order-row</code> có <code>.customer</code>, <code>.amount</code>, <code>Badge.status</code> dùng <code>STATUS_VARIANT</code> (Paid success, Pending warning, Cancelled danger).' }] },
    { ten: { en: 'Status filters', vi: 'Lọc trạng thái' }, diem: 1.5, yeuCau: [{ en: '<code>ButtonGroup#filters</code> with <code>#filter-all|paid|pending|cancelled</code>; active = <code>variant="primary"</code>, others <code>outline-primary</code>. Changing the filter returns to page 1.', vi: '<code>ButtonGroup#filters</code> gồm <code>#filter-all|paid|pending|cancelled</code>; đang chọn = <code>variant="primary"</code>, còn lại <code>outline-primary</code>. Đổi bộ lọc thì về trang 1.' }] },
    { ten: { en: 'Pagination', vi: 'Phân trang' }, diem: 1, yeuCau: [{ en: '<code>Pagination#pager</code>, 3 rows per page, the current page item <code>active</code>.', vi: '<code>Pagination#pager</code>, 3 dòng mỗi trang, trang hiện tại <code>active</code>.' }] },
    { ten: { en: 'New order modal + validation', vi: 'Modal tạo đơn + kiểm hợp lệ' }, diem: 2, yeuCau: [{ en: '<code>#btn-new</code> opens a <code>Modal</code> (title <code>New order</code>) with <code>Form#order-form noValidate validated</code>, fields <code>#customer</code> (≥ 2 chars) and <code>#amount</code> (≥ 1000) using <code>isInvalid</code> + <code>Form.Control.Feedback</code>. Valid ⇒ order added at the top as Pending, modal closes, form resets. <code>#btn-cancel</code> closes and resets.', vi: '<code>#btn-new</code> mở <code>Modal</code> (tiêu đề <code>New order</code>) có <code>Form#order-form noValidate validated</code>, ô <code>#customer</code> (≥ 2 ký tự) và <code>#amount</code> (≥ 1000) dùng <code>isInvalid</code> + <code>Form.Control.Feedback</code>. Hợp lệ ⇒ đơn thêm lên đầu với trạng thái Pending, modal đóng, form xoá trắng. <code>#btn-cancel</code> đóng và xoá trắng.' }] },
    { ten: { en: 'Toast', vi: 'Toast' }, diem: 1, yeuCau: [{ en: '<code>ToastContainer position="top-end"</code>; after creating, <code>Toast</code> shows <code>#toast-msg</code> <code>Order #7 created</code> (autohide).', vi: '<code>ToastContainer position="top-end"</code>; sau khi tạo, <code>Toast</code> hiện <code>#toast-msg</code> <code>Order #7 created</code> (tự ẩn).' }] },
    { ten: { en: 'Bootstrap-only styling', vi: 'Chỉ dùng kiểu Bootstrap' }, diem: 0.5, yeuCau: [{ en: 'Layout with <code>Container/Row/Col</code>; no inline style objects.', vi: 'Bố cục bằng <code>Container/Row/Col</code>; không dùng object style inline.' }] },
  ],
  idBatBuoc: [
    ['#main-nav · #brand · #main-nav-collapse', { en: 'navbar', vi: 'navbar' }],
    ['.stat-card#stat-total|revenue|pending|cancelled · .stat-value', { en: 'stats', vi: 'thống kê' }],
    ['#orders-table · .order-row · .customer · .amount · .status', { en: 'table', vi: 'bảng' }],
    ['#filters · #filter-all|paid|pending|cancelled · #pager', { en: 'filter & pages', vi: 'lọc & trang' }],
    ['#btn-new · #order-form · #customer · #amount · #btn-save · #btn-cancel · #toast-msg', { en: 'modal & toast', vi: 'modal & toast' }],
  ],
  truDiem: [
    { en: 'Using raw <code>&lt;div className="modal"&gt;</code> markup copied from the Bootstrap docs — it needs Bootstrap\'s JS and does not open.', vi: 'Chép markup <code>&lt;div className="modal"&gt;</code> từ tài liệu Bootstrap — cần JS của Bootstrap nên không mở được.' },
    { en: 'Forgetting <code>noValidate</code> — the browser shows its own bubbles instead of Bootstrap feedback.', vi: 'Quên <code>noValidate</code> — trình duyệt hiện bong bóng riêng thay vì phản hồi của Bootstrap.' },
    { en: 'Stats typed as constants instead of computed from the orders.', vi: 'Số thống kê viết cứng thay vì tính từ đơn hàng.' },
    { en: 'A filter that keeps you on page 2 with an empty table.', vi: 'Đổi bộ lọc mà vẫn ở trang 2 với bảng rỗng.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-4-deep-admin-dashboard',
  ten: 'Deep Lab 4 — Bootstrap Admin Dashboard (React-Bootstrap)',
  khoa: KHOA,
  baiHoc: 'fer202-4-4-slot7-react-bootstrap-slides',
  de: [
    {
      dangBai: 'deep-lab',
      tieuDe: { en: 'Deep Lab 4 — Bootstrap Admin Dashboard (grid · table · modal validation · toast)', vi: 'Deep Lab 4 — Bảng quản trị Bootstrap (lưới · bảng · modal kiểm hợp lệ · toast)' },
      doKho: 'HARD',
      phut: 120,
      diem: 100,
      khaiNiem: ['responsive grid breakpoints', 'Navbar collapse', 'Card / Table / Badge', 'ButtonGroup filters', 'Pagination', 'Modal', 'Bootstrap form validation', 'Toast'],
      tienQuyet: ['Lab 4 — Café landing page', 'Exercise 10 — React-Bootstrap'],
      the: ['fer202', 'deep-lab', 'react-bootstrap', 'bootstrap'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'breakpoint', vi: 'mốc độ rộng màn hình (sm, md, lg, xl)' },
        { en: 'variant', vi: 'biến thể màu/kiểu của component (primary, outline-primary…)' },
        { en: 'collapse', vi: 'thu gọn menu thành nút ≡ trên màn hình hẹp' },
        { en: 'validation feedback', vi: 'thông báo hợp lệ/không hợp lệ dưới ô nhập' },
        { en: 'toast', vi: 'thông báo nhỏ tự ẩn' },
        ...tn('rubric'),
      ],
      goiY: [
        'Lưới: <Row className="g-3"><Col xs={12} md={6} xl={3}>…</Col></Row> ⇒ 1 cột trên điện thoại, 2 trên tablet, 4 trên màn rộng.',
        'Form Bootstrap: <Form noValidate validated={validated} onSubmit={…}>; mỗi ô isInvalid={validated && !ok} + <Form.Control.Feedback type="invalid">.',
        'Phân trang: pages = Math.ceil(filtered.length / 3); visible = filtered.slice((page − 1) * 3, page * 3); đổi lọc ⇒ setPage(1).',
        'Toast: <ToastContainer position="top-end"><Toast show={!!msg} onClose={() => setMsg(null)} autohide delay={4000}>…',
      ],
      loiHayGap: [
        'Dùng <code>class=</code> thay vì <code>className=</code> khi chép HTML Bootstrap.',
        'Đặt <code>validated</code> = true ngay từ đầu ⇒ form mới mở đã đỏ toàn bộ.',
        'Tạo id mới bằng <code>orders.length + 1</code> ⇒ trùng id khi đã có xoá.',
        'Quên <code>responsive</code> trên Table ⇒ bảng tràn ngang trên điện thoại.',
      ],
      moTaNgan: 'Deep lab chương 4: bảng quản trị React-Bootstrap — navbar thu gọn, lưới thẻ thống kê đáp ứng, bảng responsive + badge, lọc ButtonGroup, Pagination, Modal + form validation kiểu Bootstrap, Toast. Thang 10.',
      giaiThich: '<p>React-Bootstrap biến các mẫu Bootstrap thành component React có state thật (Modal mở bằng prop <code>show</code>, Toast bằng <code>show</code>/<code>onClose</code>) — không cần JS của Bootstrap. Bố cục đáp ứng đến từ thuộc tính <code>xs/md/xl</code> của <code>Col</code>. Kiểm hợp lệ: <code>noValidate</code> tắt bong bóng của trình duyệt, <code>validated</code> bật kiểu <code>.was-validated</code>, <code>isInvalid</code> + <code>Feedback</code> hiện thông báo. Mọi con số thống kê, danh sách lọc và trang đều suy ra từ state <code>orders</code>, <code>filter</code>, <code>page</code>.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap'], kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react-bootstrap.github.io/docs/forms/validation',
    },
  ],
});
