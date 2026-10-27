/**
 * FER202 · Chương 4 (Bootstrap & React-Bootstrap) — LAB 4: Café landing page.
 * Bám Exercise 5–8, 10 (grid, cards column, form controls, React-Bootstrap) nhưng sâu hơn: Navbar thu gọn
 * responsive, lưới Container/Row/Col + row-cols, Card, Nav pills lọc, Modal chứa form có kiểm hợp lệ kiểu
 * Bootstrap (noValidate + validated), Alert đóng được, Accordion, Table, ListGroup ngang.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const anh = (s) => `https://api.dicebear.com/9.x/shapes/svg?seed=${s}`;
const DATA = `// src/data/menu.js — đã cho (priceK = nghìn đồng)
export const MENU = [
  { id: 1, name: 'Espresso', category: 'coffee', priceK: 35, bestseller: true, image: '${anh('espresso')}' },
  { id: 2, name: 'Cappuccino', category: 'coffee', priceK: 45, bestseller: true, image: '${anh('cappuccino')}' },
  { id: 3, name: 'Cold Brew', category: 'coffee', priceK: 50, bestseller: false, image: '${anh('coldbrew')}' },
  { id: 4, name: 'Matcha Latte', category: 'tea', priceK: 55, bestseller: false, image: '${anh('matcha')}' },
  { id: 5, name: 'Peach Tea', category: 'tea', priceK: 40, bestseller: false, image: '${anh('peachtea')}' },
  { id: 6, name: 'Tiramisu', category: 'cake', priceK: 60, bestseller: true, image: '${anh('tiramisu')}' },
];

export const HOURS = [
  { day: 'Monday – Friday', open: '07:00', close: '22:00' },
  { day: 'Saturday', open: '08:00', close: '23:00' },
  { day: 'Sunday', open: '08:00', close: '21:00' },
];

export const FAQ = [
  { q: 'Do you have Wi-Fi?', a: 'Yes — free Wi-Fi, ask the barista for the password.' },
  { q: 'Can I book a table?', a: 'Tables for 6+ people can be booked one day ahead.' },
  { q: 'Do you deliver?', a: 'We deliver within 3 km through our app partners.' },
];
`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const NAVBAR = `// src/components/AppNavbar.js — Navbar responsive: dưới lg thu thành nút ☰ (Toggle) bung ra Collapse
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function AppNavbar() {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#home" id="brand">☕ Bean &amp; Leaf</Navbar.Brand>
        {/* aria-controls trỏ đúng id của Collapse */}
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#menu">Menu</Nav.Link>
            <Nav.Link href="#faq">FAQ</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
`;

const HERO = `// src/components/Hero.js — lưới 12 cột: 2 cột md={6}; dưới md tự xếp chồng
import { Button, Col, Container, Row } from 'react-bootstrap';

export default function Hero({ onOrder }) {
  return (
    <Container as="section" id="home" className="hero py-5">
      <Row className="align-items-center g-4">
        <Col md={6}>
          <h1 className="display-5 fw-bold">Fresh coffee, slow mornings.</h1>
          <p className="lead">Specialty coffee and handmade cakes in the heart of Hanoi.</p>
          <Button variant="primary" size="lg" id="btn-order" onClick={onOrder}>Order now</Button>{' '}
          <Button variant="outline-secondary" size="lg" href="#menu">View menu</Button>
        </Col>
        <Col md={6}>
          <img src="${anh('hero-cafe')}" alt="Our café" className="img-fluid rounded-4 shadow" />
        </Col>
      </Row>
    </Container>
  );
}
`;

const MENU = `// src/components/MenuSection.js — Nav pills để lọc + lưới thẻ: Row xs/md/lg ⇒ row-cols-1/2/3
import { useState } from 'react';
import { Badge, Button, Card, Col, Container, Nav, Row } from 'react-bootstrap';
import { MENU } from '../data/menu';

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'tea', label: 'Tea' },
  { key: 'cake', label: 'Cake' },
];

export default function MenuSection({ onOrder }) {
  const [cat, setCat] = useState('all');
  const items = MENU.filter((m) => cat === 'all' || m.category === cat);
  return (
    <Container as="section" id="menu" className="py-4">
      <h2 className="mb-3">Our menu</h2>
      <Nav variant="pills" activeKey={cat} onSelect={(k) => setCat(k)} className="mb-3">
        {CATS.map((c) => (
          <Nav.Item key={c.key}>
            <Nav.Link eventKey={c.key} id={´cat-@{c.key}´}>{c.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Row xs={1} md={2} lg={3} className="g-4" id="menu-grid">
        {items.map((m) => (
          <Col key={m.id}>
            <Card className="menu-card h-100 shadow-sm">
              <Card.Img variant="top" src={m.image} alt={m.name} style={{ height: 160, objectFit: 'cover' }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span className="item-name">{m.name}</span>
                  {m.bestseller && <Badge bg="danger" className="bestseller">Bestseller</Badge>}
                </Card.Title>
                <Badge bg="light" text="dark" className="price align-self-start mb-3">{(m.priceK * 1000).toLocaleString('en-US')} VND</Badge>
                <Button variant="outline-primary" className="mt-auto btn-pick" onClick={() => onOrder(m.name)}>Order this</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`;

const MODAL = `// src/components/OrderModal.js — Modal + Form kiểm hợp lệ kiểu Bootstrap: noValidate + validated + required
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { MENU } from '../data/menu';

export default function OrderModal({ show, initialItem, onClose, onPlaced }) {
  const [validated, setValidated] = useState(false);
  const [form, setForm] = useState({ name: '', item: '', size: 'M' });

  // mỗi lần mở: đặt lại form (chọn sẵn món nếu mở từ một thẻ)
  useEffect(() => {
    if (show) {
      setForm({ name: '', item: initialItem || '', size: 'M' });
      setValidated(false);
    }
  }, [show, initialItem]);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setValidated(true); // thêm class .was-validated ⇒ Bootstrap tô đỏ/xanh các ô
    if (!formEl.checkValidity()) return; // dùng luật HTML: required…
    onPlaced({ ...form, name: form.name.trim() });
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Place an order</Modal.Title>
      </Modal.Header>
      <Form id="order-form" noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="order-name">
            <Form.Label>Your name</Form.Label>
            <Form.Control name="name" required value={form.name} onChange={update} placeholder="e.g. Lan" />
            <Form.Control.Feedback type="invalid">Please tell us your name.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="order-item">
            <Form.Label>Drink / cake</Form.Label>
            <Form.Select name="item" required value={form.item} onChange={update}>
              <option value="">Choose...</option>
              {MENU.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
            </Form.Select>
            <Form.Control.Feedback type="invalid">Please choose an item.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="d-block">Size</Form.Label>
            {['S', 'M', 'L'].map((s) => (
              <Form.Check key={s} inline type="radio" id={´size-@{s}´} name="size" value={s} label={s} checked={form.size === s} onChange={update} />
            ))}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" id="btn-place">Place order</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
`;

const INFO = `// src/components/InfoSection.js — Accordion + Table + ListGroup ngang
import { Accordion, Col, Container, ListGroup, Row, Table } from 'react-bootstrap';
import { FAQ, HOURS } from '../data/menu';

export default function InfoSection() {
  return (
    <Container as="section" className="py-4">
      <Row className="g-4">
        <Col lg={6} id="faq">
          <h2>FAQ</h2>
          {/* defaultActiveKey="0": mục đầu mở sẵn */}
          <Accordion defaultActiveKey="0">
            {FAQ.map((f, i) => (
              <Accordion.Item eventKey={String(i)} key={f.q}>
                <Accordion.Header>{f.q}</Accordion.Header>
                <Accordion.Body>{f.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
        <Col lg={6}>
          <h2>Opening hours</h2>
          <Table striped bordered hover size="sm" id="hours">
            <thead><tr><th>Day</th><th>Open</th><th>Close</th></tr></thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h.day}><td>{h.day}</td><td>{h.open}</td><td>{h.close}</td></tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <footer id="contact" className="mt-4">
        <ListGroup horizontal="md">
          <ListGroup.Item>📍 12 Tran Hung Dao, Hanoi</ListGroup.Item>
          <ListGroup.Item>📞 024 3999 8888</ListGroup.Item>
          <ListGroup.Item>✉️ hello@beanandleaf.vn</ListGroup.Item>
        </ListGroup>
      </footer>
    </Container>
  );
}
`;

const APP = `// src/App.js — App giữ trạng thái Modal + Alert; các phần là component riêng
import { useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import AppNavbar from './components/AppNavbar';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import OrderModal from './components/OrderModal';
import InfoSection from './components/InfoSection';

export default function App() {
  const [show, setShow] = useState(false);
  const [initialItem, setInitialItem] = useState('');
  const [placed, setPlaced] = useState(null);

  const openOrder = (item = '') => {
    setInitialItem(item);
    setShow(true);
  };

  return (
    <>
      <AppNavbar />
      {placed && (
        <Container className="pt-3">
          <Alert variant="success" dismissible onClose={() => setPlaced(null)} id="order-alert">
            Thanks, {placed.name}! Your {placed.item} ({placed.size}) is on the way.
          </Alert>
        </Container>
      )}
      <Hero onOrder={() => openOrder()} />
      <MenuSection onOrder={openOrder} />
      <InfoSection />
      <OrderModal
        show={show}
        initialItem={initialItem}
        onClose={() => setShow(false)}
        onPlaced={(o) => {
          setPlaced(o);
          setShow(false);
        }}
      />
    </>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_APP = `// src/App.js — STARTER: HTML thô, chưa dùng React-Bootstrap
import { MENU } from './data/menu';

export default function App() {
  // TODO: AppNavbar · Hero · MenuSection · OrderModal · InfoSection · Alert sau khi đặt
  return (
    <div>
      <h1>Bean &amp; Leaf</h1>
      <ul>{MENU.map((m) => <li key={m.id}>{m.name}</li>)}</ul>
    </div>
  );
}
`;
const stub = (ten, viec) => `// src/components/${ten}.js — STARTER
// TODO: ${viec}
export default function ${ten}() {
  return null;
}
`;

const INDEX = index({ bootstrap: true });
const LOI_GIAI = {
  'src/App.js': APP, 'src/components/AppNavbar.js': NAVBAR, 'src/components/Hero.js': HERO, 'src/components/MenuSection.js': MENU,
  'src/components/OrderModal.js': MODAL, 'src/components/InfoSection.js': INFO, 'src/data/menu.js': DATA, 'src/index.js': INDEX,
};
const KHOI_DAU = {
  'src/App.js': S_APP,
  'src/components/AppNavbar.js': stub('AppNavbar', 'Navbar expand="lg" + Navbar.Toggle (aria-controls="main-nav") + Navbar.Collapse id="main-nav", #brand, 4 Nav.Link'),
  'src/components/Hero.js': stub('Hero', 'section#home.hero: Row > 2 × Col md={6}; #btn-order (primary) + "View menu" (outline-secondary)'),
  'src/components/MenuSection.js': stub('MenuSection', 'Nav pills #cat-all/#cat-coffee/#cat-tea/#cat-cake + Row xs={1} md={2} lg={3} của .menu-card'),
  'src/components/OrderModal.js': stub('OrderModal', 'Modal "Place an order" + Form #order-form noValidate validated, #order-name, #order-item, #size-S/M/L'),
  'src/components/InfoSection.js': stub('InfoSection', 'Accordion (mục đầu mở) + Table #hours (striped bordered hover sm) + ListGroup ngang'),
  'src/data/menu.js': DATA, 'src/index.js': INDEX,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms = 500) => ({ hanhDong: 'cho', ms });
const MO = [click('#btn-order'), cho()];
const DAT = [...MO, { hanhDong: 'nhap', selector: '#order-name', giaTri: 'Lan' }, { hanhDong: 'doi', selector: '#order-item', giaTri: 'Cappuccino' }, { hanhDong: 'chon-o', selector: '#size-L' }, { hanhDong: 'gui', selector: '#order-form' }, cho(700)];
const KIEM = [
  // f1 navbar
  { nhom: 'f1', moTa: 'Navbar collapses below lg (.navbar-expand-lg)', kiem: 'ton-tai', selector: 'nav.navbar.navbar-expand-lg' },
  { nhom: 'f1', moTa: 'Toggle button controls #main-nav', kiem: 'thuoc-tinh', selector: '.navbar-toggler', thuocTinh: 'aria-controls', giaTri: 'main-nav' },
  { nhom: 'f1', moTa: '#main-nav is a .navbar-collapse with 4 links', kiem: 'so-luong', selector: '#main-nav.navbar-collapse .nav-link', giaTri: 4 },
  { nhom: 'f1', an: true, moTa: 'Brand #brand', kiem: 'text', selector: '#brand', khop: 'Bean & Leaf' },
  // f2 hero grid
  { nhom: 'f2', moTa: 'Hero section #home has a row with two .col-md-6', kiem: 'so-luong', selector: '#home .row > .col-md-6', giaTri: 2 },
  { nhom: 'f2', moTa: 'Primary "Order now" + outline "View menu" buttons', kiem: 'so-luong', selector: '#home .btn-primary#btn-order, #home .btn-outline-secondary', giaTri: 2 },
  { nhom: 'f2', an: true, moTa: 'Hero image is responsive (.img-fluid)', kiem: 'ton-tai', selector: '#home img.img-fluid' },
  // f3 cards
  { nhom: 'f3', moTa: 'Menu grid uses row-cols 1 / md 2 / lg 3', kiem: 'ton-tai', selector: '#menu-grid.row.row-cols-1.row-cols-md-2.row-cols-lg-3' },
  { nhom: 'f3', moTa: '6 .menu-card cards (.card)', kiem: 'so-luong', selector: '.menu-card.card', giaTri: 6 },
  { nhom: 'f3', moTa: 'Price badge "45,000 VND" and 3 bestseller badges', kiem: 'danh-sach-text', selector: '.menu-card .price', mongDoi: ['35,000 VND', '45,000 VND', '50,000 VND', '55,000 VND', '40,000 VND', '60,000 VND'] },
  { nhom: 'f3', an: true, moTa: 'Bestseller badges are .badge.bg-danger', kiem: 'so-luong', selector: '.bestseller.badge.bg-danger', giaTri: 3 },
  // f4 pills
  { nhom: 'f4', moTa: 'Nav pills with 4 categories', kiem: 'so-luong', selector: '.nav-pills .nav-link', giaTri: 4 },
  { nhom: 'f4', moTa: 'Tea ⇒ 2 cards and #cat-tea is active', kiem: 'danh-sach-text', selector: '.nav-pills .nav-link.active, .menu-card .item-name', mongDoi: ['Tea', 'Matcha Latte', 'Peach Tea'], truoc: [click('#cat-tea')] },
  { nhom: 'f4', an: true, moTa: 'Back to All ⇒ 6 cards', kiem: 'so-luong', selector: '.menu-card', giaTri: 6, truoc: [click('#cat-cake'), click('#cat-all')] },
  // f5 modal + form
  { nhom: 'f5', moTa: '#btn-order opens a modal titled "Place an order"', kiem: 'text', selector: '.modal.show .modal-title', giaTri: 'Place an order', truoc: MO },
  { nhom: 'f5', moTa: 'Empty submit ⇒ form gets .was-validated and the modal stays open', kiem: 'so-luong', selector: '#order-form.was-validated, .modal.show', giaTri: 2, truoc: [...MO, { hanhDong: 'gui', selector: '#order-form' }, cho(200)] },
  { nhom: 'f5', moTa: 'Valid order closes the modal and shows #order-alert', kiem: 'text', selector: '#order-alert', khop: 'Thanks, Lan! Your Cappuccino \\(L\\) is on the way\\.', truoc: DAT },
  { nhom: 'f5', moTa: '"Order this" on a card pre-selects the item', kiem: 'thuoc-tinh-js', selector: '#order-item', thuocTinh: 'value', giaTri: 'Tiramisu', truoc: [click('#cat-cake'), click('.menu-card .btn-pick'), cho()] },
  { nhom: 'f5', an: true, moTa: 'Modal is gone after ordering', kiem: 'so-luong', selector: '.modal', giaTri: 0, truoc: DAT },
  { nhom: 'f5', an: true, moTa: 'Inline radios S/M/L (M checked by default)', kiem: 'thuoc-tinh-js', selector: '#size-M', thuocTinh: 'checked', giaTri: true, truoc: MO },
  { nhom: 'f5', an: true, moTa: 'Alert can be dismissed', kiem: 'so-luong', selector: '#order-alert', giaTri: 0, truoc: [...DAT, click('#order-alert .btn-close'), cho()] },
  // f6 accordion
  { nhom: 'f6', moTa: '3 accordion items', kiem: 'so-luong', selector: '#faq .accordion-item', giaTri: 3 },
  { nhom: 'f6', moTa: 'First item open by default', kiem: 'so-luong', selector: '#faq .accordion-collapse.show', giaTri: 1 },
  { nhom: 'f6', an: true, moTa: 'Opening item 2 closes item 1', kiem: 'text', selector: '#faq .accordion-collapse.show', khop: 'Tables for 6\\+ people', truoc: [click('#faq .accordion-item:nth-child(2) .accordion-button'), cho(700)] },
  // f7 table
  { nhom: 'f7', moTa: 'Hours table is striped, bordered, hover, sm', kiem: 'ton-tai', selector: 'table#hours.table.table-striped.table-bordered.table-hover.table-sm' },
  { nhom: 'f7', moTa: '3 rows of opening hours', kiem: 'so-luong', selector: '#hours tbody tr', giaTri: 3 },
  // f8 list group
  { nhom: 'f8', moTa: 'Footer #contact has a horizontal list group', kiem: 'so-luong', selector: '#contact .list-group.list-group-horizontal-md .list-group-item', giaTri: 3 },
  { nhom: 'f8', an: true, moTa: 'Uses React-Bootstrap components (not hand-written class strings only)', kiem: 'ma-nguon', khop: "from\\s+['\"]react-bootstrap['\"]" },
];

const BAN_IN = {
  tieuDe: { en: 'LAB 4: Café Landing Page — Bootstrap 5 & React-Bootstrap', vi: 'LAB 4: Trang giới thiệu quán cà phê — Bootstrap 5 & React-Bootstrap' },
  phu: { en: 'FER202 · Chapter 4 — Bootstrap & React-Bootstrap · Suggested time: 90 minutes · Total: 10 marks', vi: 'FER202 · Chương 4 — Bootstrap & React-Bootstrap · Thời gian gợi ý: 90 phút · Tổng: 10 điểm' },
  moTa: {
    en: '<p>Build a one-page landing site for a café using <b>React-Bootstrap</b> components on top of Bootstrap 5: a responsive navbar, a two-column hero, a responsive card grid filtered by pills, an order <b>Modal</b> with a validated form, a success <b>Alert</b>, an <b>Accordion</b>, a <b>Table</b> and a horizontal <b>ListGroup</b>. Almost no custom CSS — let the grid and utility classes do the work.</p>',
    vi: '<p>Làm trang giới thiệu một trang cho quán cà phê bằng các component <b>React-Bootstrap</b> trên nền Bootstrap 5: navbar responsive, khối hero hai cột, lưới thẻ responsive lọc bằng pills, <b>Modal</b> đặt món có form kiểm hợp lệ, <b>Alert</b> báo thành công, <b>Accordion</b>, <b>Table</b> và <b>ListGroup</b> ngang. Gần như không viết CSS — để lưới và class tiện ích làm việc.</p>',
  },
  chucNangChinh: [{ en: 'Navbar · hero · menu grid + filter · order modal · FAQ · hours · contact.', vi: 'Navbar · hero · lưới menu + lọc · modal đặt món · FAQ · giờ mở cửa · liên hệ.' }],
  yeuCauChung: [
    { en: '<code>react-bootstrap</code> components + <code>import \'bootstrap/dist/css/bootstrap.min.css\'</code> (given in <code>index.js</code>).', vi: 'Component <code>react-bootstrap</code> + <code>import \'bootstrap/dist/css/bootstrap.min.css\'</code> (có sẵn trong <code>index.js</code>).' },
    { en: 'Responsive: the layout must work from 360px phones to large screens using the grid breakpoints.', vi: 'Responsive: bố cục chạy từ điện thoại 360px đến màn hình lớn nhờ các mốc của lưới.' },
  ],
  cayThuMuc: `
src/
├── components/
│   ├── AppNavbar.js      # Navbar expand="lg" + Toggle + Collapse
│   ├── Hero.js           # Row > Col md={6} × 2
│   ├── MenuSection.js    # Nav pills + Row xs/md/lg + Card
│   ├── OrderModal.js     # Modal + validated Form
│   └── InfoSection.js    # Accordion + Table + ListGroup
├── data/menu.js          # MENU, HOURS, FAQ (given)
├── App.js                # modal + alert state
└── index.js              # bootstrap.min.css (given)`,
  wireframe: `
+-----------------------------------------------------------------------------+
| ☕ Bean & Leaf                              Home  Menu  FAQ  Contact   [☰] |
+-----------------------------------------------------------------------------+
| Fresh coffee, slow mornings.             |  +--------------------------+    |
| Specialty coffee and handmade cakes...   |  |        [ image ]         |    |
| [Order now] [View menu]                  |  +--------------------------+    |
| Our menu   (All) (Coffee) (Tea) (Cake)                                      |
| +-------------------+ +-------------------+ +-------------------+           |
| | [img]             | | [img]             | | [img]             |  lg: 3   |
| | Espresso [Bestsel]| | Cappuccino [Best] | | Cold Brew         |  md: 2   |
| | 35,000 VND        | | 45,000 VND        | | 50,000 VND        |  xs: 1   |
| | [Order this]      | | [Order this]      | | [Order this]      |           |
| FAQ (accordion)                    | Opening hours (striped table)          |
| [ 📍 address | 📞 phone | ✉️ email ]  (horizontal list group)               |
+-----------------------------------------------------------------------------+
  Modal: Place an order — Your name [   ]  Drink / cake [Choose... v]
         Size (o) S (•) M (o) L                    [Cancel] [Place order]`,
  moHinh: {
    ten: 'MenuItem (src/data/menu.js)',
    truong: [
      ['id / name', 'number / string', ''],
      ['category', "'coffee' | 'tea' | 'cake'", ''],
      ['priceK', 'number', { en: 'thousand VND ⇒ show "45,000 VND"', vi: 'nghìn đồng ⇒ hiện "45,000 VND"' }],
      ['bestseller', 'boolean', ''],
      ['image', 'string (URL)', ''],
    ],
  },
  chucNang: [
    {
      ten: { en: 'Responsive navbar', vi: 'Navbar responsive' }, diem: 1.5,
      yeuCau: [{ en: '<code>Navbar expand="lg"</code>, <code>#brand</code>, <code>Navbar.Toggle aria-controls="main-nav"</code>, <code>Navbar.Collapse id="main-nav"</code> with 4 <code>Nav.Link</code> (Home, Menu, FAQ, Contact → <code>#home</code>, <code>#menu</code>, <code>#faq</code>, <code>#contact</code>).', vi: '<code>Navbar expand="lg"</code>, <code>#brand</code>, <code>Navbar.Toggle aria-controls="main-nav"</code>, <code>Navbar.Collapse id="main-nav"</code> chứa 4 <code>Nav.Link</code> (Home, Menu, FAQ, Contact → <code>#home</code>, <code>#menu</code>, <code>#faq</code>, <code>#contact</code>).' }],
    },
    {
      ten: { en: 'Hero grid', vi: 'Lưới hero' }, diem: 1.5,
      yeuCau: [{ en: '<code>section#home.hero</code>: one <code>Row</code> with two <code>Col md={6}</code> (text + <code>img-fluid</code> image); buttons <code>#btn-order</code> (primary, opens the modal) and "View menu" (<code>outline-secondary</code>).', vi: '<code>section#home.hero</code>: một <code>Row</code> với hai <code>Col md={6}</code> (chữ + ảnh <code>img-fluid</code>); nút <code>#btn-order</code> (primary, mở modal) và "View menu" (<code>outline-secondary</code>).' }],
    },
    {
      ten: { en: 'Menu card grid', vi: 'Lưới thẻ menu' }, diem: 1.5,
      yeuCau: [{ en: '<code>Row xs={1} md={2} lg={3} id="menu-grid"</code>; each item a <code>Card.menu-card</code>: image, <code>.item-name</code>, <code>Badge.price</code> <code>45,000 VND</code>, <code>Badge bg="danger" .bestseller</code>, button <code>.btn-pick</code> "Order this" (opens the modal with the item pre-selected).', vi: '<code>Row xs={1} md={2} lg={3} id="menu-grid"</code>; mỗi món một <code>Card.menu-card</code>: ảnh, <code>.item-name</code>, <code>Badge.price</code> <code>45,000 VND</code>, <code>Badge bg="danger" .bestseller</code>, nút <code>.btn-pick</code> "Order this" (mở modal đã chọn sẵn món).' }],
    },
    {
      ten: { en: 'Category pills', vi: 'Pills lọc loại' }, diem: 1,
      yeuCau: [{ en: '<code>Nav variant="pills"</code> with <code>#cat-all</code>, <code>#cat-coffee</code>, <code>#cat-tea</code>, <code>#cat-cake</code>; the selected pill is <code>.active</code> and filters the grid.', vi: '<code>Nav variant="pills"</code> gồm <code>#cat-all</code>, <code>#cat-coffee</code>, <code>#cat-tea</code>, <code>#cat-cake</code>; pill đang chọn có <code>.active</code> và lọc lưới.' }],
      hook: ['useState', 'activeKey + onSelect'],
    },
    {
      ten: { en: 'Order modal & validation', vi: 'Modal đặt món & kiểm hợp lệ' }, diem: 1.5,
      yeuCau: [
        { en: '<code>Modal</code> (title <code>Place an order</code>) wrapping <code>Form#order-form noValidate validated={…}</code>: <code>#order-name</code> (required), <code>#order-item</code> (required select), inline radios <code>#size-S/M/L</code> (M default), submit <code>#btn-place</code>.', vi: '<code>Modal</code> (tiêu đề <code>Place an order</code>) bọc <code>Form#order-form noValidate validated={…}</code>: <code>#order-name</code> (bắt buộc), <code>#order-item</code> (select bắt buộc), radio inline <code>#size-S/M/L</code> (mặc định M), nút <code>#btn-place</code>.' },
        { en: 'Invalid ⇒ form shows Bootstrap feedback (<code>.was-validated</code>) and stays open. Valid ⇒ close and show <code>Alert#order-alert</code> (dismissible) <code>Thanks, Lan! Your Cappuccino (L) is on the way.</code>', vi: 'Sai ⇒ form hiện phản hồi Bootstrap (<code>.was-validated</code>) và giữ nguyên. Đúng ⇒ đóng và hiện <code>Alert#order-alert</code> (đóng được) <code>Thanks, Lan! Your Cappuccino (L) is on the way.</code>' },
      ],
      hook: ['Modal show/onHide', 'checkValidity()'],
      viDu: { en: 'Lan · Cappuccino · L ⇒ "Thanks, Lan! Your Cappuccino (L) is on the way."', vi: 'Lan · Cappuccino · L ⇒ "Thanks, Lan! Your Cappuccino (L) is on the way."' },
    },
    {
      ten: { en: 'FAQ accordion', vi: 'Accordion hỏi đáp' }, diem: 1,
      yeuCau: [{ en: '<code>#faq</code>: <code>Accordion defaultActiveKey="0"</code> with 3 items; one open at a time.', vi: '<code>#faq</code>: <code>Accordion defaultActiveKey="0"</code> với 3 mục; mỗi lúc mở một mục.' }],
    },
    {
      ten: { en: 'Opening hours table', vi: 'Bảng giờ mở cửa' }, diem: 1,
      yeuCau: [{ en: '<code>Table#hours</code> <code>striped bordered hover size="sm"</code>: Day · Open · Close (3 rows).', vi: '<code>Table#hours</code> <code>striped bordered hover size="sm"</code>: Day · Open · Close (3 hàng).' }],
    },
    {
      ten: { en: 'Contact list group', vi: 'Danh sách liên hệ' }, diem: 1,
      yeuCau: [{ en: '<code>footer#contact</code>: <code>ListGroup horizontal="md"</code> with address, phone, email.', vi: '<code>footer#contact</code>: <code>ListGroup horizontal="md"</code> với địa chỉ, điện thoại, email.' }],
    },
  ],
  idBatBuoc: [
    ['#brand · .navbar-toggler · #main-nav', { en: 'navbar', vi: 'navbar' }],
    ['#home · #btn-order', { en: 'hero', vi: 'hero' }],
    ['#menu-grid · .menu-card · .item-name · .price · .bestseller · .btn-pick · #cat-{all|coffee|tea|cake}', { en: 'menu', vi: 'menu' }],
    ['#order-form · #order-name · #order-item · #size-{S|M|L} · #btn-place · #order-alert', { en: 'order', vi: 'đặt món' }],
    ['#faq · #hours · #contact', { en: 'info', vi: 'thông tin' }],
  ],
  truDiem: [
    { en: 'Writing <code>class="col-md-6"</code> divs by hand everywhere instead of React-Bootstrap components.', vi: 'Viết tay <code>class="col-md-6"</code> khắp nơi thay vì dùng component React-Bootstrap.' },
    { en: 'Forgetting the Bootstrap CSS import — components render unstyled.', vi: 'Quên import CSS Bootstrap — component hiện "trần trụi".' },
    { en: 'Missing <code>aria-controls</code>/<code>id</code> pair — the hamburger button does nothing on mobile.', vi: 'Thiếu cặp <code>aria-controls</code>/<code>id</code> — nút ☰ không làm gì trên điện thoại.' },
    { en: 'Form submit without <code>noValidate</code> + <code>preventDefault</code> — the browser\'s own popups appear and the page reloads.', vi: 'Gửi form thiếu <code>noValidate</code> + <code>preventDefault</code> — hiện bong bóng mặc định của trình duyệt và trang tải lại.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-4-lab-cafe-landing',
  ten: 'Lab 4 — Café Landing Page (React-Bootstrap)',
  khoa: KHOA,
  baiHoc: 'fer202-4-1-bootstrap',
  de: [
    {
      dangBai: 'lab',
      tieuDe: { en: 'Lab 4 — Café Landing Page (Navbar · grid · Card · Modal form · Accordion)', vi: 'Lab 4 — Trang quán cà phê (Navbar · lưới · Card · Modal form · Accordion)' },
      doKho: 'MEDIUM',
      phut: 90,
      diem: 100,
      khaiNiem: ['Bootstrap grid', 'breakpoints', 'React-Bootstrap', 'Navbar collapse', 'Card', 'Nav pills', 'Modal', 'form validation', 'Accordion', 'Table', 'ListGroup'],
      tienQuyet: ['JSX', 'useState'],
      the: ['fer202', 'lab', 'bootstrap', 'react-bootstrap'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'breakpoint', vi: 'mốc bề rộng màn hình (sm 576 · md 768 · lg 992 · xl 1200)' },
        { en: 'gutter (g-4)', vi: 'khoảng cách giữa các cột' },
        { en: 'collapse / hamburger', vi: 'thu gọn / nút ba gạch ☰' },
        { en: 'modal', vi: 'hộp thoại nổi che trang' },
        { en: 'dismissible', vi: 'đóng được (có nút ×)' },
        { en: 'accordion', vi: 'các khối gập/mở, mỗi lúc mở một' },
        { en: 'utility class', vi: 'class tiện ích (mb-3, d-flex, fw-bold…)' },
        ...tn('validate', 'badge', 'rubric'),
      ],
      goiY: [
        'Lưới: <Row xs={1} md={2} lg={3}> sinh row-cols-1 row-cols-md-2 row-cols-lg-3 — mỗi <Col> không cần md nữa.',
        'Navbar: <Navbar expand="lg"> + <Navbar.Toggle aria-controls="main-nav" /> + <Navbar.Collapse id="main-nav">.',
        'Modal: App giữ show; OrderModal nhận show/onClose/onPlaced. Form: noValidate validated={validated}; onSubmit: preventDefault, setValidated(true), if (!e.currentTarget.checkValidity()) return.',
        'Pills: <Nav variant="pills" activeKey={cat} onSelect={setCat}> + <Nav.Link eventKey="tea" id="cat-tea">.',
      ],
      loiHayGap: [
        'Đặt <code>md={4}</code> trên từng Col trong khi đã dùng <code>Row md={2}</code> ⇒ hai cách chia cột đè nhau.',
        'Nút ☰ không mở vì <code>aria-controls</code> khác <code>id</code> của <code>Navbar.Collapse</code>.',
        'Quên <code>import \'bootstrap/dist/css/bootstrap.min.css\'</code> ⇒ component đúng mà giao diện vỡ.',
        'Form trong Modal thiếu <code>noValidate</code> ⇒ trình duyệt hiện bong bóng mặc định thay vì phản hồi Bootstrap.',
        'Để state <code>show</code> của Modal trong Hero ⇒ thẻ menu không mở được modal (state phải ở cha chung).',
      ],
      moTaNgan: 'Lab chương 4: trang quán cà phê bằng React-Bootstrap — navbar thu gọn, lưới responsive, Card, pills lọc, Modal form kiểm hợp lệ, Accordion, Table, ListGroup.',
      giaiThich: '<p>Lưới Bootstrap làm phần nặng: <code>Row xs/md/lg</code> chia cột theo mốc màn hình, <code>Col md={6}</code> cho hero hai cột. Navbar dùng cặp <code>Navbar.Toggle aria-controls</code> ↔ <code>Navbar.Collapse id</code> để thu gọn trên điện thoại. State <code>show</code> của Modal nằm ở <code>App</code> (cha chung của Hero và thẻ menu) nên cả hai mở được modal, thẻ còn chọn sẵn món. Form dùng kiểm hợp lệ HTML (<code>required</code>) + hiển thị kiểu Bootstrap (<code>noValidate validated</code>), hợp lệ mới báo lên App để đóng modal và hiện Alert.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-bootstrap', 'bootstrap'], kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js' },
      thamKhao: 'https://react-bootstrap.netlify.app/docs/layout/grid',
    },
  ],
});
