/**
 * FER202 · Luyện PE — ĐỀ 3: Event Ticketing (Context + useReducer giỏ vé + localStorage + checkout POST/PATCH
 * + lịch sử đơn có tổng tính từ dòng). Đề MỚI theo DẠNG PE10 (SP25 Shopping System: bảng + trung bình + lọc,
 * giỏ hàng bằng Context, POST order, lịch sử dd/MM/yyyy + tổng tính) và PE1 (Accordion chi tiết).
 * 85 phút · 10 điểm · 9 chức năng · json-server GIẢ có trạng thái.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const DB = {
  events: [
    { id: 1, title: 'Hanoi Jazz Night', venue: 'Hanoi Opera House', city: 'Hanoi', date: '2026-12-05', category: 'Concert', priceK: 450, seatsLeft: 20 },
    { id: 2, title: 'React Workshop: Hooks in Depth', venue: 'FPT University', city: 'Hanoi', date: '2026-11-20', category: 'Workshop', priceK: 150, seatsLeft: 3 },
    { id: 3, title: 'Saigon Marathon Expo', venue: 'SECC', city: 'Ho Chi Minh City', date: '2027-01-10', category: 'Sport', priceK: 200, seatsLeft: 50 },
    { id: 4, title: 'Swan Lake', venue: 'Saigon Opera House', city: 'Ho Chi Minh City', date: '2026-12-18', category: 'Theatre', priceK: 600, seatsLeft: 0 },
    { id: 5, title: 'Da Nang Rock Fest', venue: 'Han River Park', city: 'Da Nang', date: '2026-11-28', category: 'Concert', priceK: 350, seatsLeft: 12 },
    { id: 6, title: 'UI/UX Bootcamp', venue: 'Dreamplex', city: 'Ho Chi Minh City', date: '2026-11-15', category: 'Workshop', priceK: 250, seatsLeft: 8 },
    { id: 7, title: 'V-League Final', venue: 'My Dinh Stadium', city: 'Hanoi', date: '2026-12-12', category: 'Sport', priceK: 180, seatsLeft: 100 },
    { id: 8, title: 'Hamlet', venue: 'Trung Vuong Theatre', city: 'Da Nang', date: '2027-02-14', category: 'Theatre', priceK: 300, seatsLeft: 6 },
  ],
  orders: [
    { id: 1, customerName: 'Nguyen Thu Ha', email: 'ha.nt@example.com', orderDate: '2026-09-28', items: [{ eventId: 1, title: 'Hanoi Jazz Night', quantity: 2, priceK: 450 }, { eventId: 7, title: 'V-League Final', quantity: 1, priceK: 180 }] },
    { id: 2, customerName: 'Tran Quoc Bao', email: 'bao.tq@example.com', orderDate: '2026-10-05', items: [{ eventId: 6, title: 'UI/UX Bootcamp', quantity: 1, priceK: 250 }] },
    { id: 3, customerName: 'Le Mai Anh', email: 'anh.lm@example.com', orderDate: '2026-10-02', items: [{ eventId: 3, title: 'Saigon Marathon Expo', quantity: 4, priceK: 200 }] },
  ],
};
const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const API = `// src/api.js — axios dùng chung, baseURL đọc từ .env
import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });
export default api;
`;

const FORMAT = `// src/utils/format.js
// priceK theo NGHÌN đồng ⇒ "450,000 VND"
export const formatVnd = (priceK) => ´@{Math.round(Number(priceK) * 1000).toLocaleString('en-US')} VND´;

// "2026-12-05" ⇒ "05/12/2026" (cắt chuỗi ⇒ không lệch múi giờ)
export function formatDate(iso) {
  const [y, m, d] = String(iso).slice(0, 10).split('-');
  return ´@{d}/@{m}/@{y}´;
}

export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return ´@{d.getFullYear()}-@{p(d.getMonth() + 1)}-@{p(d.getDate())}´;
}

// Tổng tiền của một đơn TÍNH từ các dòng (không tin con số lưu sẵn)
export const orderTotalK = (items) => items.reduce((sum, it) => sum + it.quantity * it.priceK, 0);
`;

const CART = `// src/context/CartContext.js — giỏ vé dùng chung cả app: Context (chia sẻ) + useReducer (logic) + localStorage (lưu bền)
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export const MAX_PER_EVENT = 4;
const CartContext = createContext(null);

// Reducer THUẦN: (state cũ, action) ⇒ state MỚI. Không sửa mảng cũ, không gọi API ở đây.
export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const ev = action.event;
      const max = Math.min(MAX_PER_EVENT, ev.seatsLeft); // giới hạn: 4 vé / sự kiện và không quá số ghế còn
      const found = state.find((i) => i.eventId === ev.id);
      if (!found) return max > 0 ? [...state, { eventId: ev.id, title: ev.title, priceK: ev.priceK, quantity: 1, max }] : state;
      if (found.quantity >= found.max) return state;
      return state.map((i) => (i.eventId === ev.id ? { ...i, quantity: i.quantity + 1 } : i));
    }
    case 'INC':
      return state.map((i) => (i.eventId === action.id && i.quantity < i.max ? { ...i, quantity: i.quantity + 1 } : i));
    case 'DEC': // về 0 ⇒ bỏ khỏi giỏ
      return state.map((i) => (i.eventId === action.id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => i.quantity > 0);
    case 'REMOVE':
      return state.filter((i) => i.eventId !== action.id);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

// Khởi tạo lười: đọc localStorage MỘT lần lúc mount
function init() {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, init);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items)); // giỏ đổi ⇒ ghi lại
  }, [items]);

  // số vé và tổng tiền là giá trị SUY RA — không lưu thành state riêng
  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const totalK = items.reduce((s, i) => s + i.quantity * i.priceK, 0);
    const qtyOf = (eventId) => items.find((i) => i.eventId === eventId)?.quantity ?? 0;
    return { items, count, totalK, qtyOf, dispatch };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
`;

const NAVBAR = `// src/components/AppNavbar.js — badge số vé đọc thẳng từ Context
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function AppNavbar() {
  const { count } = useCart();
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
      <Container>
        <Navbar.Brand>TicketHub</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/events" id="nav-events">Events</Nav.Link>
          <Nav.Link as={NavLink} to="/cart" id="nav-cart">
            Cart <Badge bg="warning" text="dark" id="cart-count">{count}</Badge>
          </Nav.Link>
          <Nav.Link as={NavLink} to="/orders" id="nav-orders">Orders</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
`;

const APP = `// src/App.js — CartProvider bọc mọi trang (navbar, danh sách, giỏ đều đọc chung một giỏ)
import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import { CartProvider } from './context/CartContext';
import EventList from './pages/EventList';
import CartPage from './pages/CartPage';
import OrderHistory from './pages/OrderHistory';

export default function App() {
  return (
    <CartProvider>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="*" element={<p className="container">Page not found</p>} />
      </Routes>
    </CartProvider>
  );
}
`;

const EVENTS = `// src/pages/EventList.js — Câu 1: bảng sự kiện, lọc thành phố/loại, giá trung bình, thêm vào giỏ
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import api from '../api';
import { useCart } from '../context/CartContext';
import { formatDate, formatVnd } from '../utils/format';

const uniqueSorted = (list, key) => [...new Set(list.map((x) => x[key]))].sort();

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [city, setCity] = useState('All');
  const [category, setCategory] = useState('All');
  const { qtyOf, dispatch } = useCart();

  useEffect(() => {
    api.get('/events')
      .then((res) => setEvents(res.data))
      .catch(() => setError('Cannot load events.'));
  }, []);

  const cities = useMemo(() => uniqueSorted(events, 'city'), [events]);
  const categories = useMemo(() => uniqueSorted(events, 'category'), [events]);

  const visible = useMemo(
    () =>
      events
        .filter((e) => (city === 'All' || e.city === city) && (category === 'All' || e.category === category))
        .sort((a, b) => a.date.localeCompare(b.date)), // "yyyy-mm-dd" so chuỗi = so ngày
    [events, city, category],
  );

  // trung bình trên các dòng ĐANG HIỆN; không dòng nào ⇒ N/A (tránh chia cho 0 ra NaN)
  const average = visible.length ? visible.reduce((s, e) => s + e.priceK, 0) / visible.length : null;

  return (
    <Container>
      <h2>Upcoming Events</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-2 mb-3">
        <Col md={4}>
          <Form.Select id="city-filter" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="All">All cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select id="category-filter" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Form.Select>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <span id="summary">Average ticket price: {average === null ? 'N/A' : formatVnd(average)}</span>
        </Col>
      </Row>
      {visible.length === 0 ? (
        <Alert variant="warning" className="no-result">No events found</Alert>
      ) : (
        <Table striped bordered hover responsive id="event-table" className="align-middle">
          <thead>
            <tr>
              <th>No</th><th>Event</th><th>Date</th><th>City</th><th>Category</th><th>Price</th><th>Seats left</th><th />
            </tr>
          </thead>
          <tbody>
            {visible.map((e, i) => {
              const inCart = qtyOf(e.id);
              const max = Math.min(4, e.seatsLeft);
              const soldOut = e.seatsLeft === 0;
              return (
                <tr key={e.id} id={´event-row-@{e.id}´}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="ev-title">{e.title}</span>
                    <div className="small text-muted ev-venue">{e.venue}</div>
                  </td>
                  <td className="ev-date">{formatDate(e.date)}</td>
                  <td>{e.city}</td>
                  <td>{e.category}</td>
                  <td className="ev-price">{formatVnd(e.priceK)}</td>
                  <td className="ev-seats">{e.seatsLeft}</td>
                  <td>
                    <Button
                      size="sm"
                      className="btn-add"
                      variant={soldOut ? 'secondary' : 'primary'}
                      disabled={soldOut || inCart >= max}
                      onClick={() => dispatch({ type: 'ADD', event: e })}
                    >
                      {soldOut ? 'Sold out' : 'Add to cart'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
`;

const CART_PAGE = `// src/pages/CartPage.js — Câu 2: giỏ vé (+/−/xoá, tổng) và thanh toán (POST đơn + PATCH ghế)
import { useState } from 'react';
import { Alert, Button, ButtonGroup, Card, Container, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { formatVnd, todayISO } from '../utils/format';

const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export default function CartPage() {
  const { items, totalK, dispatch } = useCart();
  const [customer, setCustomer] = useState({ customerName: '', email: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const update = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const checkout = async (e) => {
    e.preventDefault();
    if (!customer.customerName.trim()) return setError('Please enter your full name');
    if (!EMAIL_RE.test(customer.email.trim())) return setError('Please enter a valid email');
    setSaving(true);
    try {
      await api.post('/orders', {
        customerName: customer.customerName.trim(),
        email: customer.email.trim(),
        orderDate: todayISO(),
        // chỉ gửi những gì đơn hàng cần (không gửi "max" — đó là chi tiết của giỏ)
        items: items.map(({ eventId, title, quantity, priceK }) => ({ eventId, title, quantity, priceK })),
      });
      // trừ ghế của TỪNG sự kiện: đọc số ghế mới nhất rồi PATCH
      for (const it of items) {
        const { data: ev } = await api.get(´/events/@{it.eventId}´);
        await api.patch(´/events/@{it.eventId}´, { seatsLeft: ev.seatsLeft - it.quantity });
      }
      dispatch({ type: 'CLEAR' });
      navigate('/orders');
    } catch {
      setError('Checkout failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <Alert variant="info" className="empty-cart">Your cart is empty</Alert>
      ) : (
        <Table bordered responsive id="cart-table" className="align-middle">
          <thead>
            <tr><th>Event</th><th>Unit price</th><th>Quantity</th><th>Subtotal</th><th /></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.eventId} id={´cart-row-@{it.eventId}´}>
                <td>{it.title}</td>
                <td>{formatVnd(it.priceK)}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button variant="outline-secondary" className="btn-dec" onClick={() => dispatch({ type: 'DEC', id: it.eventId })}>−</Button>
                    <Button variant="light" disabled className="qty">{it.quantity}</Button>
                    <Button variant="outline-secondary" className="btn-inc" disabled={it.quantity >= it.max} onClick={() => dispatch({ type: 'INC', id: it.eventId })}>+</Button>
                  </ButtonGroup>
                </td>
                <td className="subtotal">{formatVnd(it.quantity * it.priceK)}</td>
                <td>
                  <Button size="sm" variant="outline-danger" className="btn-remove" onClick={() => dispatch({ type: 'REMOVE', id: it.eventId })}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h4 id="cart-total">Total: {formatVnd(totalK)}</h4>

      <Card className="mt-3" style={{ maxWidth: 520 }}>
        <Card.Body>
          <Card.Title>Checkout</Card.Title>
          {error && <Alert variant="danger" id="checkout-error">{error}</Alert>}
          <Form id="checkout-form" noValidate onSubmit={checkout}>
            <Form.Group className="mb-2" controlId="customerName">
              <Form.Label>Full name</Form.Label>
              <Form.Control name="customerName" value={customer.customerName} onChange={update} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" value={customer.email} onChange={update} />
            </Form.Group>
            <Button type="submit" id="btn-checkout" disabled={items.length === 0 || saving}>Place order</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
`;

const ORDERS = `// src/pages/OrderHistory.js — Câu 3: lịch sử đơn (mới nhất trước), tổng TÍNH từ dòng, doanh thu, chi tiết
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import api from '../api';
import { formatDate, formatVnd, orderTotalK } from '../utils/format';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null); // đơn đang mở chi tiết (một lúc một đơn)

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Cannot load orders.'));
  }, []);

  // mới nhất trước; cùng ngày ⇒ id lớn hơn trước
  const rows = useMemo(
    () => [...orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate) || Number(b.id) - Number(a.id)),
    [orders],
  );
  const revenueK = useMemo(() => orders.reduce((s, o) => s + orderTotalK(o.items), 0), [orders]);

  return (
    <Container>
      <h2>Order History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <p id="orders-revenue" className="fw-bold">Total revenue: {formatVnd(revenueK)}</p>
      <Table bordered hover responsive id="order-table" className="align-middle">
        <thead>
          <tr><th>Order #</th><th>Customer</th><th>Date</th><th>Tickets</th><th>Total</th><th /></tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <Fragment key={o.id}>
              <tr id={´order-row-@{o.id}´}>
                <td>{o.id}</td>
                <td className="o-customer">{o.customerName}</td>
                <td className="o-date">{formatDate(o.orderDate)}</td>
                <td className="o-tickets">{o.items.reduce((n, it) => n + it.quantity, 0)}</td>
                <td className="o-total">{formatVnd(orderTotalK(o.items))}</td>
                <td>
                  <Button size="sm" variant="link" className="btn-detail" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                    {openId === o.id ? 'Hide' : 'Details'}
                  </Button>
                </td>
              </tr>
              {openId === o.id && (
                <tr>
                  <td colSpan={6}>
                    <ul id={´order-items-@{o.id}´} className="mb-0">
                      {o.items.map((it) => (
                        <li key={it.eventId} className="order-item">{it.title} × {it.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_CART = `// src/context/CartContext.js — STARTER
import { createContext, useContext } from 'react';

export const MAX_PER_EVENT = 4;
const CartContext = createContext({ items: [], count: 0, totalK: 0, qtyOf: () => 0, dispatch: () => {} });

export function cartReducer(state, action) {
  // TODO: ADD (tối đa 4 vé/sự kiện và ≤ seatsLeft) · INC · DEC (về 0 thì bỏ) · REMOVE · CLEAR
  return state;
}

export function CartProvider({ children }) {
  // TODO: useReducer(cartReducer, …) + đọc/ghi localStorage "cart" + count/totalK suy ra
  return <CartContext.Provider value={{ items: [], count: 0, totalK: 0, qtyOf: () => 0, dispatch: () => {} }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
`;
const S_FORMAT = `// src/utils/format.js — STARTER
export const formatVnd = (priceK) => ´@{priceK} VND´; // TODO: 450 ⇒ "450,000 VND"
export const formatDate = (iso) => iso; // TODO: "2026-12-05" ⇒ "05/12/2026"
export const todayISO = () => new Date().toISOString().slice(0, 10); // ⚠ UTC — sửa theo giờ máy
export const orderTotalK = (items) => 0; // TODO: Σ quantity × priceK
`;
const S_EVENTS = `// src/pages/EventList.js — STARTER (Câu 1)
import { Container } from 'react-bootstrap';

export default function EventList() {
  // TODO: GET /events, bảng #event-table (sắp theo ngày), #city-filter, #category-filter, #summary, nút .btn-add
  return (
    <Container>
      <h2>Upcoming Events</h2>
    </Container>
  );
}
`;
const S_CARTPAGE = `// src/pages/CartPage.js — STARTER (Câu 2)
import { Container } from 'react-bootstrap';

export default function CartPage() {
  // TODO: bảng #cart-table (.qty .btn-inc .btn-dec .btn-remove .subtotal), #cart-total, form #checkout-form
  return (
    <Container>
      <h2>Your Cart</h2>
    </Container>
  );
}
`;
const S_ORDERS = `// src/pages/OrderHistory.js — STARTER (Câu 3)
import { Container } from 'react-bootstrap';

export default function OrderHistory() {
  // TODO: GET /orders, bảng #order-table (mới nhất trước), tổng tính từ items, #orders-revenue, .btn-detail
  return (
    <Container>
      <h2>Order History</h2>
    </Container>
  );
}
`;

const INDEX = index({ bootstrap: true, router: true });
const CHUNG = { 'src/App.js': APP, 'src/components/AppNavbar.js': NAVBAR, 'src/api.js': API, 'src/index.js': INDEX, '.env': 'REACT_APP_API_URL=http://localhost:9999\n', 'database.json': DB_JSON };
const LOI_GIAI = { 'src/context/CartContext.js': CART, 'src/pages/EventList.js': EVENTS, 'src/pages/CartPage.js': CART_PAGE, 'src/pages/OrderHistory.js': ORDERS, 'src/utils/format.js': FORMAT, ...CHUNG };
const KHOI_DAU = { 'src/context/CartContext.js': S_CART, 'src/pages/EventList.js': S_EVENTS, 'src/pages/CartPage.js': S_CARTPAGE, 'src/pages/OrderHistory.js': S_ORDERS, 'src/utils/format.js': S_FORMAT, ...CHUNG };

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const BY_DATE = ['UI/UX Bootcamp', 'React Workshop: Hooks in Depth', 'Da Nang Rock Fest', 'Hanoi Jazz Night', 'V-League Final', 'Swan Lake', 'Saigon Marathon Expo', 'Hamlet'];
// thêm vé từng lần một (mỗi lần một click để React kịp vẽ lại trạng thái nút)
const them = (id, lan = 1) => Array.from({ length: lan }, () => [click(`#event-row-${id} .btn-add`), cho(60)]).flat();
const VAO_GIO = [cho(200), ...them(2, 2), ...them(1, 1), click('#nav-cart'), cho(150)];
const THANH_TOAN = [...VAO_GIO, nhap('#customerName', 'Pham Thanh Long'), nhap('#email', 'long.pt@example.com'), { hanhDong: 'gui', selector: '#checkout-form' }, cho(500)];

const KIEM = [
  // f1 — events table
  { nhom: 'f1', moTa: '"/" redirects to /events', url: '/', kiem: 'duong-dan', giaTri: '/events' },
  { nhom: 'f1', moTa: '#event-table lists 8 events', kiem: 'so-luong', selector: '#event-table tbody tr', giaTri: 8 },
  { nhom: 'f1', moTa: 'Sorted by date (soonest first)', kiem: 'danh-sach-text', selector: '.ev-title', mongDoi: BY_DATE },
  { nhom: 'f1', moTa: 'Date dd/MM/yyyy and price in VND', kiem: 'danh-sach-text', selector: '#event-row-1 .ev-date, #event-row-1 .ev-price', mongDoi: ['05/12/2026', '450,000 VND'] },
  { nhom: 'f1', an: true, moTa: 'API URL read from .env', kiem: 'ma-nguon', khop: 'process\\.env\\.REACT_APP_API_URL|import\\.meta\\.env\\.VITE_API_URL' },
  { nhom: 'f1', an: true, moTa: 'Events loaded with GET /events', kiem: 'goi-fetch', khop: `^GET ${B}/events$` },
  // f2 — filters + average
  { nhom: 'f2', moTa: 'City options from data', kiem: 'danh-sach-text', selector: '#city-filter option', mongDoi: ['All cities', 'Da Nang', 'Hanoi', 'Ho Chi Minh City'] },
  { nhom: 'f2', moTa: 'Average of all events: 310,000 VND', kiem: 'text', selector: '#summary', giaTri: 'Average ticket price: 310,000 VND' },
  { nhom: 'f2', moTa: 'City "Hanoi" ⇒ 3 rows, average 260,000 VND', kiem: 'text', selector: '#summary', giaTri: 'Average ticket price: 260,000 VND', truoc: [cho(150), doi('#city-filter', 'Hanoi')] },
  { nhom: 'f2', moTa: 'Category "Workshop" ⇒ 2 rows', kiem: 'so-luong', selector: '#event-table tbody tr', giaTri: 2, truoc: [cho(150), doi('#category-filter', 'Workshop')] },
  { nhom: 'f2', an: true, moTa: 'Category options from data', kiem: 'danh-sach-text', selector: '#category-filter option', mongDoi: ['All categories', 'Concert', 'Sport', 'Theatre', 'Workshop'] },
  { nhom: 'f2', an: true, moTa: 'City + category combine', kiem: 'danh-sach-text', selector: '.ev-title', mongDoi: ['Swan Lake'], truoc: [cho(150), doi('#city-filter', 'Ho Chi Minh City'), doi('#category-filter', 'Theatre')] },
  { nhom: 'f2', an: true, moTa: 'No match ⇒ "No events found" and N/A average', kiem: 'text', selector: '.no-result, #summary', khop: 'No events found|Average ticket price: N/A', truoc: [cho(150), doi('#city-filter', 'Da Nang'), doi('#category-filter', 'Sport')] },
  // f3 — cart context
  { nhom: 'f3', moTa: 'Navbar badge #cart-count starts at 0', kiem: 'text', selector: '#cart-count', giaTri: '0' },
  { nhom: 'f3', moTa: 'Add to cart ⇒ #cart-count 1', kiem: 'text', selector: '#cart-count', giaTri: '1', truoc: [cho(150), ...them(5)] },
  { nhom: 'f3', moTa: 'Adding the same event twice ⇒ one cart row, quantity 2', kiem: 'text', selector: '#cart-row-5 .qty', giaTri: '2', truoc: [cho(150), ...them(5, 2), click('#nav-cart'), cho(150)] },
  { nhom: 'f3', moTa: 'Cart is shared with Context + useReducer', kiem: 'ma-nguon', khop: 'createContext[\\s\\S]*useReducer|useReducer[\\s\\S]*createContext' },
  // f4 — limits
  { nhom: 'f4', moTa: 'Sold-out event: button disabled and reads "Sold out"', kiem: 'text', selector: '#event-row-4 .btn-add:disabled', giaTri: 'Sold out' },
  { nhom: 'f4', moTa: 'Only 3 seats left ⇒ the 4th ticket cannot be added', kiem: 'text', selector: '#cart-count', giaTri: '3', truoc: [cho(150), ...them(2, 4)] },
  { nhom: 'f4', an: true, moTa: 'At most 4 tickets per event', kiem: 'text', selector: '#cart-count', giaTri: '4', truoc: [cho(150), ...them(1, 5)] },
  { nhom: 'f4', an: true, moTa: 'Button disabled once the limit is reached', kiem: 'thuoc-tinh-js', selector: '#event-row-2 .btn-add', thuocTinh: 'disabled', giaTri: true, truoc: [cho(150), ...them(2, 3)] },
  // f5 — cart page
  { nhom: 'f5', moTa: 'Cart table shows both events', kiem: 'so-luong', selector: '#cart-table tbody tr', giaTri: 2, truoc: VAO_GIO },
  { nhom: 'f5', moTa: 'Subtotal and total are computed', kiem: 'danh-sach-text', selector: '#cart-row-2 .subtotal, #cart-total', mongDoi: ['300,000 VND', 'Total: 750,000 VND'], truoc: VAO_GIO },
  { nhom: 'f5', moTa: '+ raises the quantity (and the total)', kiem: 'text', selector: '#cart-total', giaTri: 'Total: 1,200,000 VND', truoc: [...VAO_GIO, click('#cart-row-1 .btn-inc'), cho(80)] },
  { nhom: 'f5', moTa: 'Remove deletes the row', kiem: 'so-luong', selector: '#cart-table tbody tr', giaTri: 1, truoc: [...VAO_GIO, click('#cart-row-2 .btn-remove'), cho(80)] },
  { nhom: 'f5', an: true, moTa: '− down to 0 removes the item', kiem: 'so-luong', selector: '#cart-row-1', giaTri: 0, truoc: [...VAO_GIO, click('#cart-row-1 .btn-dec'), cho(80)] },
  { nhom: 'f5', an: true, moTa: '+ stops at the seat limit (3)', kiem: 'text', selector: '#cart-row-2 .qty', giaTri: '3', truoc: [...VAO_GIO, click('#cart-row-2 .btn-inc'), cho(60), click('#cart-row-2 .btn-inc'), cho(60)] },
  { nhom: 'f5', an: true, moTa: 'Empty cart ⇒ "Your cart is empty", checkout disabled', url: '/cart', kiem: 'thuoc-tinh-js', selector: '#btn-checkout', thuocTinh: 'disabled', giaTri: true },
  // f6 — persistence
  { nhom: 'f6', moTa: 'Cart saved in localStorage "cart"', kiem: 'kho-cuc-bo', khoa: 'cart', doDai: 2, truoc: VAO_GIO },
  { nhom: 'f6', moTa: 'Cart survives a reload', kiem: 'text', selector: '#cart-count', giaTri: '3', truoc: [...VAO_GIO, { hanhDong: 'tai-lai' }, cho(200)] },
  // f7 — checkout
  { nhom: 'f7', moTa: 'Empty name ⇒ "Please enter your full name"', kiem: 'text', selector: '#checkout-error', giaTri: 'Please enter your full name', truoc: [...VAO_GIO, { hanhDong: 'gui', selector: '#checkout-form' }, cho(100)] },
  { nhom: 'f7', moTa: 'Bad email ⇒ "Please enter a valid email"', kiem: 'text', selector: '#checkout-error', giaTri: 'Please enter a valid email', truoc: [...VAO_GIO, nhap('#customerName', 'Pham Thanh Long'), nhap('#email', 'long@'), { hanhDong: 'gui', selector: '#checkout-form' }, cho(100)] },
  { nhom: 'f7', moTa: 'POST /orders stores customer, today and the items', kiem: 'du-lieu-server', bang: 'orders', chua: { customerName: 'Pham Thanh Long', email: 'long.pt@example.com', items: [{ eventId: 2, title: 'React Workshop: Hooks in Depth', quantity: 2, priceK: 150 }, { eventId: 1, title: 'Hanoi Jazz Night', quantity: 1, priceK: 450 }] }, truoc: THANH_TOAN },
  { nhom: 'f7', moTa: 'Seats are reduced on the server (PATCH)', kiem: 'du-lieu-server', bang: 'events', chua: { id: 2, seatsLeft: 1 }, truoc: THANH_TOAN },
  { nhom: 'f7', moTa: 'Then: cart cleared and redirect to /orders', kiem: 'duong-dan', giaTri: '/orders', truoc: THANH_TOAN },
  { nhom: 'f7', an: true, moTa: 'Cart badge back to 0 after checkout', kiem: 'text', selector: '#cart-count', giaTri: '0', truoc: THANH_TOAN },
  { nhom: 'f7', an: true, moTa: 'Event 1 seats 20 → 19', kiem: 'du-lieu-server', bang: 'events', chua: { id: 1, seatsLeft: 19 }, truoc: THANH_TOAN },
  { nhom: 'f7', an: true, moTa: 'Invalid checkout sends nothing', kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: [...VAO_GIO, { hanhDong: 'gui', selector: '#checkout-form' }, cho(100)] },
  // f8 — orders page
  { nhom: 'f8', moTa: 'Orders newest first', url: '/orders', kiem: 'danh-sach-text', selector: '.o-customer', mongDoi: ['Tran Quoc Bao', 'Le Mai Anh', 'Nguyen Thu Ha'] },
  { nhom: 'f8', moTa: 'Order 1: date, tickets and computed total', url: '/orders', kiem: 'danh-sach-text', selector: '#order-row-1 .o-date, #order-row-1 .o-tickets, #order-row-1 .o-total', mongDoi: ['28/09/2026', '3', '1,080,000 VND'] },
  { nhom: 'f8', moTa: 'Total revenue 2,130,000 VND', url: '/orders', kiem: 'text', selector: '#orders-revenue', khop: '2,130,000 VND' },
  { nhom: 'f8', an: true, moTa: 'A new order appears first with today\'s date', kiem: 'text', selector: '#order-table tbody tr:first-child .o-customer', giaTri: 'Pham Thanh Long', truoc: THANH_TOAN },
  { nhom: 'f8', an: true, moTa: 'Its total is 750,000 VND', kiem: 'text', selector: '#order-table tbody tr:first-child .o-total', giaTri: '750,000 VND', truoc: THANH_TOAN },
  // f9 — details
  { nhom: 'f9', moTa: 'Details lists "title × quantity"', url: '/orders', kiem: 'danh-sach-text', selector: '#order-items-1 .order-item', mongDoi: ['Hanoi Jazz Night × 2', 'V-League Final × 1'], truoc: [cho(150), click('#order-row-1 .btn-detail'), cho(80)] },
  { nhom: 'f9', an: true, moTa: 'Clicking again hides the details', url: '/orders', kiem: 'so-luong', selector: '#order-items-1', giaTri: 0, truoc: [cho(150), click('#order-row-1 .btn-detail'), cho(80), click('#order-row-1 .btn-detail'), cho(80)] },
];

// ═════════════════════════════════════ ĐỀ (bản in) ═════════════════════════════════════
const BAN_IN = {
  tieuDe: { en: 'PE PRACTICE 3 — Event Ticketing System', vi: 'LUYỆN PE 3 — Hệ thống bán vé sự kiện' },
  phu: {
    en: 'FER202 · Practical Exam practice (SP25 Shopping-System format) · Duration: 85 minutes · Total: 10 marks · Context + useReducer + json-server',
    vi: 'FER202 · Luyện thi thực hành (dạng SP25 Shopping System) · Thời gian: 85 phút · Tổng: 10 điểm · Context + useReducer + json-server',
  },
  moTa: {
    en: '<p><b>TicketHub</b> sells tickets for concerts, workshops, sport and theatre. json-server serves <code>events</code> and <code>orders</code> at <code>http://localhost:9999</code>; the URL lives in <code>.env</code> (<code>REACT_APP_API_URL</code>).</p><p>The cart is <b>global state</b>: the navbar badge, the events table and the cart page all read the same cart, implemented with <b>React Context + useReducer</b> and saved in Local Storage. Orders store only their lines — every total must be <b>computed</b>.</p>',
    vi: '<p><b>TicketHub</b> bán vé hoà nhạc, workshop, thể thao và kịch. json-server phục vụ <code>events</code> và <code>orders</code> tại <code>http://localhost:9999</code>; địa chỉ nằm trong <code>.env</code> (<code>REACT_APP_API_URL</code>).</p><p>Giỏ vé là <b>state toàn cục</b>: badge trên navbar, bảng sự kiện và trang giỏ cùng đọc MỘT giỏ, làm bằng <b>React Context + useReducer</b> và lưu Local Storage. Đơn hàng chỉ lưu các dòng — mọi tổng tiền phải <b>tính ra</b>.</p>',
  },
  chucNangChinh: [
    { en: 'Question 1 (4 marks) — <code>/events</code>: table, filters, average price, add to cart with limits.', vi: 'Câu 1 (4 điểm) — <code>/events</code>: bảng, bộ lọc, giá trung bình, thêm vào giỏ có giới hạn.' },
    { en: 'Question 2 (3.5 marks) — <code>/cart</code>: quantities, totals, Local Storage, checkout (POST + PATCH).', vi: 'Câu 2 (3,5 điểm) — <code>/cart</code>: số lượng, tổng, Local Storage, thanh toán (POST + PATCH).' },
    { en: 'Question 3 (2.5 marks) — <code>/orders</code>: history with computed totals, revenue and details.', vi: 'Câu 3 (2,5 điểm) — <code>/orders</code>: lịch sử với tổng tính ra, doanh thu và chi tiết.' },
  ],
  yeuCauChung: [
    { en: 'API URL from <code>.env</code>; React-Bootstrap for the UI; axios or fetch.', vi: 'Địa chỉ API từ <code>.env</code>; giao diện React-Bootstrap; axios hoặc fetch.' },
    { en: 'The cart MUST be a Context provided at the top of the app and updated through a reducer (<code>useReducer</code>).', vi: 'Giỏ PHẢI là một Context cung cấp ở gốc ứng dụng và cập nhật qua reducer (<code>useReducer</code>).' },
    { en: 'Money: <code>priceK</code> is in thousands of VND ⇒ show <code>450,000 VND</code>. Dates: <code>dd/MM/yyyy</code>.', vi: 'Tiền: <code>priceK</code> tính theo nghìn đồng ⇒ hiện <code>450,000 VND</code>. Ngày: <code>dd/MM/yyyy</code>.' },
    { en: 'Never store totals in state or in the database — derive them from the lines.', vi: 'Không lưu tổng tiền vào state hay vào CSDL — luôn tính từ các dòng.' },
  ],
  cayThuMuc: `
database.json            # given — events, orders
.env                     # REACT_APP_API_URL=http://localhost:9999
src/
├── api.js               # axios.create({ baseURL })   (given)
├── context/
│   └── CartContext.js   # cartReducer · CartProvider · useCart
├── utils/
│   └── format.js        # formatVnd · formatDate · todayISO · orderTotalK
├── components/
│   └── AppNavbar.js     # Events · Cart [n] · Orders   (given)
├── pages/
│   ├── EventList.js     # Q1  /events
│   ├── CartPage.js      # Q2  /cart
│   └── OrderHistory.js  # Q3  /orders
├── App.js               # CartProvider + routes   (given)
└── index.js`,
  wireframe: `
+-------------------------------------------------------------------------------+
| TicketHub   Events   Cart [3]   Orders                                        |
+-------------------------------------------------------------------------------+
| Upcoming Events                                                               |
| [All cities v] [All categories v]          Average ticket price: 310,000 VND  |
| No | Event                  | Date       | City  | Category | Price   | Seats |      |
| 1  | UI/UX Bootcamp         | 15/11/2026 | HCMC  | Workshop | 250,000 | 8     | [Add to cart]
| 6  | Swan Lake              | 18/12/2026 | HCMC  | Theatre  | 600,000 | 0     | [Sold out]
+-------------------------------------------------------------------------------+
| Your Cart                                   | Order History                   |
| Event        Unit     Qty        Subtotal   | Total revenue: 2,130,000 VND    |
| React Wor..  150,000  [-] 2 [+]  300,000 [x]| #  Customer   Date  Tickets Total [Details]
| Hanoi Jazz   450,000  [-] 1 [+]  450,000 [x]| 2  Tran Quoc  05/10/2026  1  250,000
| Total: 750,000 VND                          |    - UI/UX Bootcamp × 1         |
| Full name [        ]  Email [        ]      |                                 |
| [Place order]                               |                                 |
+-------------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'events · orders',
    truong: [
      ['events.id', 'number', ''],
      ['events.title / venue / city / category', 'string', { en: 'cities and categories must be read from the data', vi: 'thành phố và loại phải lấy từ dữ liệu' }],
      ['events.date', "string 'yyyy-mm-dd'", ''],
      ['events.priceK', 'number', { en: 'thousands of VND', vi: 'nghìn đồng' }],
      ['events.seatsLeft', 'number', { en: '0 ⇒ sold out', vi: '0 ⇒ hết vé' }],
      ['orders.id / customerName / email', 'number / string', ''],
      ['orders.orderDate', "string 'yyyy-mm-dd'", { en: 'today for new orders', vi: 'đơn mới: hôm nay' }],
      ['orders.items[]', '{ eventId, title, quantity, priceK }', { en: 'no stored total', vi: 'không lưu tổng' }],
    ],
  },
  duLieuMau: `
events: 1 Hanoi Jazz Night (Hanoi, 2026-12-05, 450, seats 20) · 2 React Workshop: Hooks in Depth (Hanoi, 150, seats 3)
        3 Saigon Marathon Expo · 4 Swan Lake (seats 0) · 5 Da Nang Rock Fest · 6 UI/UX Bootcamp
        7 V-League Final · 8 Hamlet
orders: 1 Nguyen Thu Ha 2026-09-28 [Hanoi Jazz Night × 2 @450, V-League Final × 1 @180]
        2 Tran Quoc Bao 2026-10-05 [UI/UX Bootcamp × 1 @250]
        3 Le Mai Anh   2026-10-02 [Saigon Marathon Expo × 4 @200]`,
  chucNang: [
    {
      ten: { en: 'Q1 · Events table', vi: 'C1 · Bảng sự kiện' }, diem: 1.5,
      yeuCau: [
        { en: 'Route <code>/events</code> (<code>/</code> redirects). Table <code>#event-table</code>: <code>No | Event | Date | City | Category | Price | Seats left | (button)</code>; rows <code>#event-row-{id}</code>.', vi: 'Route <code>/events</code> (<code>/</code> chuyển sang). Bảng <code>#event-table</code>: <code>No | Event | Date | City | Category | Price | Seats left | (nút)</code>; hàng <code>#event-row-{id}</code>.' },
        { en: 'Event cell: <code>.ev-title</code> (title) with <code>.ev-venue</code> (venue, small, below). Sorted by <code>date</code>, soonest first.', vi: 'Ô Event: <code>.ev-title</code> (tên) và <code>.ev-venue</code> (địa điểm, chữ nhỏ bên dưới). Sắp theo <code>date</code>, gần nhất trước.' },
        { en: '<code>.ev-date</code> as <code>dd/MM/yyyy</code>; <code>.ev-price</code> as <code>450,000 VND</code>; <code>.ev-seats</code>.', vi: '<code>.ev-date</code> dạng <code>dd/MM/yyyy</code>; <code>.ev-price</code> dạng <code>450,000 VND</code>; <code>.ev-seats</code>.' },
      ],
      hook: ['useEffect', 'useMemo'],
    },
    {
      ten: { en: 'Q1 · Filters & average price', vi: 'C1 · Bộ lọc & giá trung bình' }, diem: 1.5,
      yeuCau: [
        { en: '<code>#city-filter</code> (<code>All cities</code> + cities from the data, A → Z) and <code>#category-filter</code> (<code>All categories</code> + categories) — combined.', vi: '<code>#city-filter</code> (<code>All cities</code> + các thành phố trong dữ liệu, A → Z) và <code>#category-filter</code> (<code>All categories</code> + các loại) — kết hợp.' },
        { en: '<code>#summary</code>: <code>Average ticket price: X VND</code> over the <b>visible</b> rows (rounded to 1 VND); <code>N/A</code> when none.', vi: '<code>#summary</code>: <code>Average ticket price: X VND</code> trên các dòng <b>đang hiện</b> (làm tròn đồng); <code>N/A</code> khi không có dòng nào.' },
        { en: 'No row ⇒ <code>.no-result</code> <code>No events found</code>.', vi: 'Không có dòng ⇒ <code>.no-result</code> <code>No events found</code>.' },
      ],
      viDu: { en: 'All ⇒ 310,000 VND · Hanoi ⇒ (450 + 150 + 180) / 3 = 260,000 VND', vi: 'All ⇒ 310,000 VND · Hanoi ⇒ (450 + 150 + 180) / 3 = 260,000 VND' },
    },
    {
      ten: { en: 'Q1 · Cart with Context + useReducer', vi: 'C1 · Giỏ bằng Context + useReducer' }, diem: 1,
      yeuCau: [
        { en: '<code>CartProvider</code> wraps the app; <code>useCart()</code> exposes <code>items</code>, <code>count</code>, <code>totalK</code>, <code>dispatch</code>.', vi: '<code>CartProvider</code> bọc ứng dụng; <code>useCart()</code> trả <code>items</code>, <code>count</code>, <code>totalK</code>, <code>dispatch</code>.' },
        { en: '<code>.btn-add</code> "Add to cart" adds one ticket; the same event twice ⇒ one cart line with quantity 2.', vi: '<code>.btn-add</code> "Add to cart" thêm một vé; cùng sự kiện hai lần ⇒ một dòng giỏ số lượng 2.' },
        { en: 'Navbar <code>#cart-count</code> shows the total number of tickets.', vi: 'Navbar <code>#cart-count</code> hiện tổng số vé.' },
      ],
      hook: ['createContext', 'useContext', 'useReducer'],
    },
    {
      ten: { en: 'Q1 · Ticket limits', vi: 'C1 · Giới hạn vé' }, diem: 0.5,
      yeuCau: [
        { en: 'At most <b>4</b> tickets per event and never more than <code>seatsLeft</code>; when reached, <code>.btn-add</code> is disabled.', vi: 'Tối đa <b>4</b> vé mỗi sự kiện và không quá <code>seatsLeft</code>; đạt giới hạn ⇒ <code>.btn-add</code> bị vô hiệu.' },
        { en: '<code>seatsLeft</code> 0 ⇒ the button is disabled and reads <code>Sold out</code>.', vi: '<code>seatsLeft</code> = 0 ⇒ nút bị vô hiệu và ghi <code>Sold out</code>.' },
      ],
    },
    {
      ten: { en: 'Q2 · Cart page', vi: 'C2 · Trang giỏ' }, diem: 1.5,
      yeuCau: [
        { en: 'Route <code>/cart</code>. Table <code>#cart-table</code>, rows <code>#cart-row-{eventId}</code>: title, unit price, <code>.btn-dec</code> <code>.qty</code> <code>.btn-inc</code>, <code>.subtotal</code>, <code>.btn-remove</code>.', vi: 'Route <code>/cart</code>. Bảng <code>#cart-table</code>, hàng <code>#cart-row-{eventId}</code>: tên, đơn giá, <code>.btn-dec</code> <code>.qty</code> <code>.btn-inc</code>, <code>.subtotal</code>, <code>.btn-remove</code>.' },
        { en: '+ respects the same limits; − at 1 removes the line. <code>#cart-total</code>: <code>Total: X VND</code>.', vi: '+ theo cùng giới hạn; − khi còn 1 thì bỏ dòng. <code>#cart-total</code>: <code>Total: X VND</code>.' },
        { en: 'Empty cart ⇒ <code>.empty-cart</code> <code>Your cart is empty</code> and the checkout button is disabled.', vi: 'Giỏ trống ⇒ <code>.empty-cart</code> <code>Your cart is empty</code> và nút thanh toán bị vô hiệu.' },
      ],
    },
    {
      ten: { en: 'Q2 · Persist the cart', vi: 'C2 · Lưu bền giỏ' }, diem: 0.5,
      yeuCau: [
        { en: 'Save the cart lines (JSON array) in Local Storage key <code>cart</code>; a reload keeps the cart.', vi: 'Lưu các dòng giỏ (mảng JSON) vào Local Storage khoá <code>cart</code>; tải lại trang vẫn còn giỏ.' },
      ],
      hook: ['useEffect', 'lazy init'], khoa: 'cart',
    },
    {
      ten: { en: 'Q2 · Checkout', vi: 'C2 · Thanh toán' }, diem: 1.5,
      yeuCau: [
        { en: 'Form <code>#checkout-form</code>: <code>#customerName</code>, <code>#email</code>, button <code>#btn-checkout</code> "Place order". Errors in <code>#checkout-error</code>: <code>Please enter your full name</code> · <code>Please enter a valid email</code>.', vi: 'Form <code>#checkout-form</code>: <code>#customerName</code>, <code>#email</code>, nút <code>#btn-checkout</code> "Place order". Lỗi trong <code>#checkout-error</code>: <code>Please enter your full name</code> · <code>Please enter a valid email</code>.' },
        { en: '<code>POST /orders</code> <code>{ customerName, email, orderDate: today, items: [{ eventId, title, quantity, priceK }] }</code> (cart order).', vi: '<code>POST /orders</code> <code>{ customerName, email, orderDate: hôm nay, items: [{ eventId, title, quantity, priceK }] }</code> (đúng thứ tự giỏ).' },
        { en: 'For every line <code>PATCH /events/:id { seatsLeft: seatsLeft - quantity }</code>; then clear the cart and navigate to <code>/orders</code>.', vi: 'Mỗi dòng <code>PATCH /events/:id { seatsLeft: seatsLeft - quantity }</code>; rồi xoá giỏ và chuyển tới <code>/orders</code>.' },
      ],
      hook: ['async/await', 'useNavigate'],
    },
    {
      ten: { en: 'Q3 · Order history', vi: 'C3 · Lịch sử đơn' }, diem: 1.5,
      yeuCau: [
        { en: 'Route <code>/orders</code>. Table <code>#order-table</code>: <code>Order # | Customer | Date | Tickets | Total</code>; rows <code>#order-row-{id}</code>, cells <code>.o-customer .o-date .o-tickets .o-total</code>; newest <code>orderDate</code> first.', vi: 'Route <code>/orders</code>. Bảng <code>#order-table</code>: <code>Order # | Customer | Date | Tickets | Total</code>; hàng <code>#order-row-{id}</code>, ô <code>.o-customer .o-date .o-tickets .o-total</code>; <code>orderDate</code> mới nhất trước.' },
        { en: 'Tickets = Σ quantity; Total = Σ quantity × priceK (VND format).', vi: 'Tickets = Σ quantity; Total = Σ quantity × priceK (định dạng VND).' },
        { en: '<code>#orders-revenue</code>: <code>Total revenue: X VND</code> over all orders.', vi: '<code>#orders-revenue</code>: <code>Total revenue: X VND</code> của mọi đơn.' },
      ],
      hook: ['useMemo', 'reduce'],
    },
    {
      ten: { en: 'Q3 · Order details', vi: 'C3 · Chi tiết đơn' }, diem: 0.5,
      yeuCau: [
        { en: '<code>.btn-detail</code> toggles a list <code>#order-items-{id}</code> of <code>.order-item</code> lines <code>title × quantity</code> under the row (click again to hide).', vi: '<code>.btn-detail</code> bật/tắt danh sách <code>#order-items-{id}</code> gồm các dòng <code>.order-item</code> <code>title × quantity</code> dưới hàng (bấm lần nữa để ẩn).' },
      ],
    },
  ],
  idBatBuoc: [
    ['#nav-events · #nav-cart · #cart-count · #nav-orders', { en: 'navbar', vi: 'navbar' }],
    ['#event-table · #event-row-{id} · .ev-title · .ev-date · .ev-price · .ev-seats · .btn-add', { en: 'events table', vi: 'bảng sự kiện' }],
    ['#city-filter · #category-filter · #summary · .no-result', { en: 'filters + average', vi: 'bộ lọc + trung bình' }],
    ['#cart-table · #cart-row-{eventId} · .qty · .btn-inc · .btn-dec · .btn-remove · .subtotal · #cart-total · .empty-cart', { en: 'cart page', vi: 'trang giỏ' }],
    ['#checkout-form · #customerName · #email · #btn-checkout · #checkout-error', { en: 'checkout', vi: 'thanh toán' }],
    ['#order-table · #order-row-{id} · .o-customer · .o-date · .o-tickets · .o-total · #orders-revenue · .btn-detail · #order-items-{id} · .order-item', { en: 'orders page', vi: 'trang đơn' }],
  ],
  truDiem: [
    { en: 'Cart kept in a page component (lost when you navigate) instead of a Context — Q1 cart + Q2 marks lost.', vi: 'Giỏ để trong component của một trang (mất khi chuyển trang) thay vì Context — mất điểm giỏ C1 + C2.' },
    { en: 'Pushing into the state array inside the reducer (<code>state.push</code>) — React does not re-render.', vi: '<code>state.push</code> trong reducer — React không vẽ lại.' },
    { en: 'Average computed over ALL events instead of the visible ones.', vi: 'Tính trung bình trên MỌI sự kiện thay vì các dòng đang hiện.' },
    { en: 'Reading a stored "total" field instead of computing it from the items.', vi: 'Đọc trường "total" lưu sẵn thay vì tính từ các dòng.' },
    { en: 'Forgetting to PATCH <code>seatsLeft</code> — the event never sells out.', vi: 'Quên PATCH <code>seatsLeft</code> — sự kiện không bao giờ hết vé.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-13-pe-3-event-tickets',
  ten: 'PE Practice 3 — Event Ticketing System',
  khoa: KHOA,
  baiHoc: 'fer202-pe10-2-cau-2',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE Practice 3 — Event Ticketing System (Context · useReducer · checkout)', vi: 'Luyện PE 3 — Hệ thống bán vé sự kiện (Context · useReducer · thanh toán)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['Context API', 'useReducer', 'global cart', 'localStorage', 'derived totals', 'POST + PATCH', 'React Router', 'React-Bootstrap Table'],
      tienQuyet: ['useState / useEffect', 'reduce', 'React Router'],
      the: ['fer202', 'pe', 'context', 'usereducer', 'json-server'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'cart', vi: 'giỏ hàng / giỏ vé' },
        { en: 'checkout', vi: 'thanh toán, đặt đơn' },
        { en: 'subtotal / total', vi: 'thành tiền một dòng / tổng cộng' },
        { en: 'revenue', vi: 'doanh thu' },
        { en: 'seats left', vi: 'số ghế còn' },
        { en: 'reducer / dispatch / action', vi: 'hàm tính state mới / gửi lệnh / lệnh {type, …}' },
        { en: 'global state', vi: 'state dùng chung toàn ứng dụng' },
        ...tn('derived', 'persist', 'immutable', 'redirect', 'payload', 'rubric'),
      ],
      goiY: [
        'Bắt đầu từ CartContext: viết cartReducer thuần (ADD/INC/DEC/REMOVE/CLEAR) rồi CartProvider dùng useReducer(cartReducer, undefined, init) — init đọc localStorage.',
        'count và totalK là giá trị suy ra từ items (reduce) — đừng tạo state riêng cho chúng.',
        'Bảng sự kiện: nút disabled = soldOut || qtyOf(e.id) >= Math.min(4, e.seatsLeft). Trung bình tính trên mảng visible, rỗng ⇒ "N/A".',
        'Thanh toán: POST /orders trước, rồi với mỗi dòng GET /events/:id lấy seatsLeft mới nhất và PATCH; xong dispatch CLEAR và navigate("/orders").',
      ],
      loiHayGap: [
        'Đặt <code>useState</code> giỏ trong trang Events ⇒ sang trang Cart giỏ rỗng (state của component bị huỷ khi rời trang).',
        'Reducer sửa tại chỗ (<code>found.quantity++</code>; <code>return state</code>) ⇒ cùng tham chiếu, React bỏ qua lần render.',
        '<code>useReducer(reducer, JSON.parse(localStorage.getItem("cart")))</code> ⇒ đọc lại mỗi lần render và vỡ khi khoá chưa có (<code>null</code>).',
        'Tính trung bình rồi chia cho 0 khi lọc không còn dòng ⇒ hiện <code>NaN VND</code>.',
        'Gửi cả trường <code>max</code> (chi tiết nội bộ của giỏ) lên <code>/orders</code>.',
        'Sắp xếp ngày bằng <code>new Date(a) - new Date(b)</code> trên chuỗi dd/MM/yyyy đã định dạng ⇒ sai thứ tự; sắp trên chuỗi gốc yyyy-mm-dd.',
      ],
      moTaNgan: 'Đề luyện PE dạng SP25 Shopping System: giỏ vé toàn cục bằng Context + useReducer + localStorage, thanh toán POST/PATCH, lịch sử đơn với tổng tính từ dòng.',
      giaiThich: '<p>Trái tim của đề là <code>CartContext</code>: một reducer thuần quyết định mọi thay đổi giỏ (kể cả giới hạn 4 vé/sự kiện và số ghế còn), <code>useReducer</code> giữ state, <code>useEffect</code> ghi Local Storage, và <code>count</code>/<code>totalK</code> là giá trị suy ra bằng <code>useMemo</code>. Vì Provider bọc toàn ứng dụng, navbar, bảng sự kiện và trang giỏ cùng đọc một nguồn.</p><p>Thanh toán đi đúng thứ tự: kiểm form → <code>POST /orders</code> (chỉ gửi các trường của đơn) → <code>PATCH</code> ghế của từng sự kiện → xoá giỏ → chuyển trang. Trang lịch sử không tin bất kỳ "tổng" nào lưu sẵn: <code>orderTotalK</code> tính từ các dòng, doanh thu là tổng của các tổng.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: '/events', jsonServer: { base: B, db: DB }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/events' },
      thamKhao: 'https://react.dev/learn/scaling-up-with-reducer-and-context',
    },
  ],
});
