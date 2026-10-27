/**
 * FER202 · Luyện PE — ĐỀ 1: Library Loan System (json-server + React Router + React-Bootstrap + fetch).
 * Đề MỚI theo DẠNG PE SP26/SU26 (PE18 Attendance — lưới thẻ + tìm/lọc + tham số URL; PE17 — .env, Bootstrap;
 * PE7 — form đặt + luật nghiệp vụ + POST/PATCH + chuyển trang). Không chép đề thật.
 * 85 phút · 10 điểm · 9 chức năng (nhom f1..f9) · json-server GIẢ có trạng thái (tests.jsonServer).
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

// ═════════════════════════════════════ DỮ LIỆU (database.json) ═════════════════════════════════════
const DB = {
  books: [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', category: 'Software', publishedYear: 2008, totalCopies: 3, availableCopies: 2 },
    { id: 2, title: 'The Pragmatic Programmer', author: 'David Thomas', category: 'Software', publishedYear: 1999, totalCopies: 2, availableCopies: 0 },
    { id: 3, title: 'A Brief History of Time', author: 'Stephen Hawking', category: 'Science', publishedYear: 1988, totalCopies: 4, availableCopies: 4 },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', category: 'History', publishedYear: 2011, totalCopies: 3, availableCopies: 1 },
    { id: 5, title: 'Cosmos', author: 'Carl Sagan', category: 'Science', publishedYear: 1980, totalCopies: 2, availableCopies: 2 },
    { id: 6, title: 'Design Patterns', author: 'Erich Gamma', category: 'Software', publishedYear: 1994, totalCopies: 2, availableCopies: 1 },
    { id: 7, title: 'Guns, Germs, and Steel', author: 'Jared Diamond', category: 'History', publishedYear: 1997, totalCopies: 1, availableCopies: 1 },
    { id: 8, title: 'The Selfish Gene', author: 'Richard Dawkins', category: 'Science', publishedYear: 1976, totalCopies: 2, availableCopies: 0 },
  ],
  members: [
    { id: 1, code: 'M001', fullName: 'Nguyen Van An', email: 'an.nv@example.com', status: 'ACTIVE' },
    { id: 2, code: 'M002', fullName: 'Tran Thi Binh', email: 'binh.tt@example.com', status: 'ACTIVE' },
    { id: 3, code: 'M003', fullName: 'Le Hoang Cuong', email: 'cuong.lh@example.com', status: 'SUSPENDED' },
    { id: 4, code: 'M004', fullName: 'Pham Minh Duc', email: 'duc.pm@example.com', status: 'ACTIVE' },
  ],
  loans: [
    { id: 1, bookId: 1, memberId: 1, borrowDate: '2026-03-02', dueDate: '2026-03-16', returnDate: null },
    { id: 2, bookId: 4, memberId: 1, borrowDate: '2026-10-20', dueDate: '2026-11-03', returnDate: null },
    { id: 3, bookId: 3, memberId: 2, borrowDate: '2026-02-01', dueDate: '2026-02-10', returnDate: '2026-02-09' },
  ],
};
const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;
const ENV = 'REACT_APP_API_URL=http://localhost:9999\n';

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const API = `// src/api.js — MỘT chỗ duy nhất biết địa chỉ API (đọc từ .env — đề cho 0 điểm nếu viết cứng URL)
export const API_URL = process.env.REACT_APP_API_URL;

// GET: fetch KHÔNG tự ném lỗi khi 404/500 ⇒ phải tự kiểm res.ok
export async function getJSON(path) {
  const res = await fetch(´@{API_URL}@{path}´);
  if (!res.ok) throw new Error(´GET @{path} failed with status @{res.status}´);
  return res.json();
}

// POST / PUT / PATCH / DELETE kèm body JSON (nhớ header Content-Type, nếu không json-server lưu body rỗng)
export async function sendJSON(method, path, body) {
  const res = await fetch(´@{API_URL}@{path}´, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(´@{method} @{path} failed with status @{res.status}´);
  return res.json();
}
`;

const DATE = `// src/utils/date.js — xử lý ngày dạng chuỗi "yyyy-mm-dd" (đúng định dạng của <input type="date">)

// Hôm nay theo giờ MÁY. Không dùng new Date().toISOString(): đó là giờ UTC — 6h sáng ở Việt Nam vẫn là "hôm qua".
export function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return ´@{d.getFullYear()}-@{p(d.getMonth() + 1)}-@{p(d.getDate())}´;
}

// "2026-03-02" → "02/03/2026": cắt chuỗi, không qua new Date() ⇒ không bao giờ lệch múi giờ
export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return ´@{d}/@{m}/@{y}´;
}

// Số ngày từ a đến b. Date.UTC ⇒ một ngày luôn đúng 86 400 000 ms (không vướng giờ mùa hè)
export function daysBetween(a, b) {
  const t = (s) => {
    const [y, m, d] = s.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((t(b) - t(a)) / 86400000);
}
`;

const APP = `// src/App.js — khai báo route của cả ứng dụng
import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import BookList from './pages/BookList';
import BorrowBook from './pages/BorrowBook';
import LoanList from './pages/LoanList';

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        {/* "/" chuyển thẳng sang /books — replace để nút Back không quay lại "/" rồi bị đẩy đi lần nữa */}
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id/borrow" element={<BorrowBook />} />
        <Route path="/loans" element={<LoanList />} />
        <Route path="*" element={<p className="container">Page not found</p>} />
      </Routes>
    </>
  );
}
`;

const NAVBAR = `// src/components/AppNavbar.js — NavLink tự gắn class "active" cho trang đang mở
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export default function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" className="mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/books">Library</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/books" id="nav-books">Books</Nav.Link>
          <Nav.Link as={NavLink} to="/loans" id="nav-loans">Loans</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
`;

const BOOK_LIST = `// src/pages/BookList.js — Câu 1: danh mục sách (tải, sắp xếp, tìm, lọc theo thể loại + tham số URL)
import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getJSON } from '../api';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Thể loại đang chọn SỐNG TRÊN URL (?category=Science): mở link là thấy đúng bộ lọc, F5 không mất.
  // URL là nguồn sự thật ⇒ không chép sang một state thứ hai.
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    getJSON('/books')
      .then(setBooks)
      .catch(() => setError('Cannot load books — is json-server running on port 9999?'))
      .finally(() => setLoading(false));
  }, []); // [] ⇒ gọi API đúng MỘT lần; tìm/lọc làm ở client, không gọi lại

  // Danh sách thể loại lấy TỪ DỮ LIỆU (không viết cứng): Set bỏ trùng, sort A→Z
  const categories = useMemo(() => [...new Set(books.map((b) => b.category))].sort(), [books]);

  // Danh sách hiển thị là giá trị SUY RA từ books + search + category
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books
      .filter((b) => b.title.toLowerCase().includes(q))
      .filter((b) => category === 'All' || b.category === category)
      .sort((a, b) => a.title.localeCompare(b.title)); // filter() đã tạo mảng mới ⇒ sort không đụng state
  }, [books, search, category]);

  const changeCategory = (value) => setSearchParams(value === 'All' ? {} : { category: value });

  return (
    <Container>
      <h2>Book Catalog</h2>
      <p className="text-muted">Browse the library and borrow a book</p>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-2 mb-3">
        <Col md={8}>
          <Form.Control
            id="search"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select id="category-filter" value={category} onChange={(e) => changeCategory(e.target.value)}>
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <p id="result-count">Showing {visible.length} of {books.length} books</p>
      {!loading && visible.length === 0 && <Alert variant="warning" className="no-result">No books found</Alert>}

      <Row xs={1} md={3} className="g-3">
        {visible.map((b) => (
          <Col key={b.id}>
            <Card id={´book-@{b.id}´} className="book-card h-100">
              <Card.Body>
                <Card.Title className="book-title">{b.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{b.author}</Card.Subtitle>
                <Card.Text className="mb-2">{b.category} · {b.publishedYear}</Card.Text>
                {b.availableCopies > 0 ? (
                  <Badge bg="success" className="book-availability">Available: {b.availableCopies}</Badge>
                ) : (
                  <Badge bg="secondary" className="book-availability">Out of stock</Badge>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  size="sm"
                  className="btn-borrow"
                  disabled={b.availableCopies === 0}
                  onClick={() => navigate(´/books/@{b.id}/borrow´)}
                >
                  Borrow
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`;

const BORROW = `// src/pages/BorrowBook.js — Câu 2: form mượn sách + luật nghiệp vụ + POST/PATCH + chuyển trang
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getJSON, sendJSON } from '../api';
import { daysBetween, todayISO } from '../utils/date';

const MAX_DAYS = 14;
const MAX_OPEN_LOANS = 2;

export default function BorrowBook() {
  const { id } = useParams(); // id trên URL luôn là CHUỖI
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [members, setMembers] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [form, setForm] = useState({ memberId: '', borrowDate: todayISO(), dueDate: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // hai request độc lập ⇒ chạy song song bằng Promise.all; sách không có ⇒ 404 ⇒ getJSON ném lỗi
    Promise.all([getJSON(´/books/@{id}´), getJSON('/members?status=ACTIVE')])
      .then(([b, m]) => {
        setBook(b);
        setMembers(m);
      })
      .catch(() => setNotFound(true));
  }, [id]); // đổi :id (sang sách khác) ⇒ tải lại

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Câu lỗi ĐẦU TIÊN theo đúng thứ tự luật trong đề; '' = hợp lệ
  const validate = () => {
    if (!form.memberId) return 'Please select a member.';
    if (!form.borrowDate) return 'Please choose a borrow date.';
    if (!form.dueDate) return 'Please choose a due date.';
    if (form.borrowDate > todayISO()) return 'Borrow date cannot be in the future.'; // so chuỗi yyyy-mm-dd = so ngày
    const days = daysBetween(form.borrowDate, form.dueDate);
    if (days <= 0) return 'Due date must be after the borrow date.';
    if (days > MAX_DAYS) return ´A loan cannot exceed @{MAX_DAYS} days.´;
    if (book.availableCopies === 0) return 'This book is out of stock.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // không có dòng này: trình duyệt gửi form và TẢI LẠI trang
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setSaving(true);
    try {
      // Luật cần dữ liệu máy chủ: đếm phiếu CHƯA trả của thành viên (lọc returnDate ở client cho chắc)
      const loans = await getJSON(´/loans?memberId=@{form.memberId}´);
      if (loans.filter((l) => !l.returnDate).length >= MAX_OPEN_LOANS) {
        setError(´This member already has @{MAX_OPEN_LOANS} open loans.´);
        return;
      }
      await sendJSON('POST', '/loans', {
        bookId: book.id,
        memberId: Number(form.memberId), // <select> trả chuỗi — id trong database.json là số
        borrowDate: form.borrowDate,
        dueDate: form.dueDate,
        returnDate: null,
      });
      await sendJSON('PATCH', ´/books/@{book.id}´, { availableCopies: book.availableCopies - 1 });
      navigate('/loans');
    } catch {
      setError('Could not save the loan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <Container>
        <Alert variant="danger">Book not found</Alert>
        <Link to="/books">← Back to books</Link>
      </Container>
    );
  }
  if (!book) {
    return (
      <Container>
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: 560 }}>
      <Card>
        <Card.Body>
          <Card.Title>Borrow a book</Card.Title>
          <div id="book-info" className="mb-3">
            <b>{book.title}</b> — {book.author}
            <br />
            <span className="text-muted">Available: {book.availableCopies}</span>
          </div>
          {error && <Alert variant="danger" id="form-error">{error}</Alert>}
          <Form id="borrow-form" onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="member">
              <Form.Label>Member</Form.Label>
              <Form.Select name="memberId" value={form.memberId} onChange={update}>
                <option value="">-- Select member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.code} — {m.fullName}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="borrowDate">
              <Form.Label>Borrow date</Form.Label>
              <Form.Control type="date" name="borrowDate" value={form.borrowDate} onChange={update} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dueDate">
              <Form.Label>Due date</Form.Label>
              <Form.Control type="date" name="dueDate" value={form.dueDate} onChange={update} />
            </Form.Group>
            <Button type="submit" disabled={saving}>Confirm borrow</Button>{' '}
            <Link to="/books" className="btn btn-link">Cancel</Link>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
`;

const LOANS = `// src/pages/LoanList.js — Câu 3: bảng phiếu mượn (nối sách/thành viên, định dạng ngày, trạng thái) + trả sách
import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Container, Table } from 'react-bootstrap';
import { getJSON, sendJSON } from '../api';
import { formatDate, todayISO } from '../utils/date';

const BADGE = { Returned: 'secondary', Overdue: 'danger', 'On loan': 'primary' };

export default function LoanList() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const today = todayISO();

  useEffect(() => {
    // Nối ở CLIENT (không dùng _expand: json-server 1.x đã bỏ) — ba request song song
    Promise.all([getJSON('/loans'), getJSON('/books'), getJSON('/members')])
      .then(([l, b, m]) => {
        setLoans(l);
        setBooks(b);
        setMembers(m);
      })
      .catch(() => setError('Cannot load loans.'));
  }, []);

  // Bảng tra cứu theo id (khoá chuỗi ⇒ không vướng 1 vs "1")
  const bookById = useMemo(() => new Map(books.map((b) => [String(b.id), b])), [books]);
  const memberById = useMemo(() => new Map(members.map((m) => [String(m.id), m])), [members]);

  // Mới nhất lên đầu — sort trên BẢN SAO
  const rows = useMemo(() => [...loans].sort((a, b) => b.borrowDate.localeCompare(a.borrowDate)), [loans]);

  const statusOf = (l) => {
    if (l.returnDate) return 'Returned';
    return l.dueDate < today ? 'Overdue' : 'On loan';
  };

  const handleReturn = async (loan) => {
    const book = bookById.get(String(loan.bookId));
    try {
      await sendJSON('PATCH', ´/loans/@{loan.id}´, { returnDate: today });
      if (book) {
        const saved = await sendJSON('PATCH', ´/books/@{book.id}´, { availableCopies: book.availableCopies + 1 });
        setBooks((list) => list.map((b) => (b.id === saved.id ? saved : b)));
      }
      // cập nhật ĐÚNG một dòng bằng map (mảng mới) — không tải lại cả trang
      setLoans((list) => list.map((l) => (l.id === loan.id ? { ...l, returnDate: today } : l)));
    } catch {
      setError('Could not return the book.');
    }
  };

  return (
    <Container>
      <h2>Loans</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover responsive id="loan-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Book</th>
            <th>Member</th>
            <th>Borrow date</th>
            <th>Due date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((l, i) => {
            const st = statusOf(l);
            return (
              <tr key={l.id} id={´loan-row-@{l.id}´}>
                <td>{i + 1}</td>
                <td className="loan-book">{bookById.get(String(l.bookId))?.title ?? 'Unknown book'}</td>
                <td className="loan-member">{memberById.get(String(l.memberId))?.fullName ?? 'Unknown member'}</td>
                <td className="loan-borrow">{formatDate(l.borrowDate)}</td>
                <td className="loan-due">{formatDate(l.dueDate)}</td>
                <td>
                  <Badge bg={BADGE[st]} className="loan-status">{st}</Badge>
                </td>
                <td>
                  {!l.returnDate && (
                    <Button size="sm" variant="outline-success" className="btn-return" onClick={() => handleReturn(l)}>
                      Return
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_API = `// src/api.js — STARTER
// Đọc địa chỉ API từ .env (REACT_APP_API_URL). Viết cứng "http://localhost:9999" ⇒ đề cho 0 điểm.
export const API_URL = '';

export async function getJSON(path) {
  // TODO: fetch(API_URL + path), kiểm res.ok, trả res.json()
  return [];
}

export async function sendJSON(method, path, body) {
  // TODO: fetch với method, header Content-Type: application/json, body JSON.stringify(body)
  return null;
}
`;
const S_DATE = `// src/utils/date.js — STARTER
export function todayISO() {
  // TODO: "yyyy-mm-dd" của hôm nay theo giờ máy
  return '';
}

export function formatDate(iso) {
  // TODO: "2026-03-02" → "02/03/2026"
  return iso;
}

export function daysBetween(a, b) {
  // TODO: số ngày từ a đến b
  return 0;
}
`;
const S_BOOKS = `// src/pages/BookList.js — STARTER (Câu 1)
import { Container } from 'react-bootstrap';

export default function BookList() {
  // TODO: tải /books, sắp xếp A→Z, ô #search, #category-filter (+ ?category=), #result-count, thẻ .book-card
  return (
    <Container>
      <h2>Book Catalog</h2>
    </Container>
  );
}
`;
const S_BORROW = `// src/pages/BorrowBook.js — STARTER (Câu 2)
import { Container } from 'react-bootstrap';

export default function BorrowBook() {
  // TODO: useParams() lấy :id, tải sách + thành viên ACTIVE, form #borrow-form, luật kiểm, POST /loans + PATCH /books/:id
  return (
    <Container>
      <h2>Borrow a book</h2>
    </Container>
  );
}
`;
const S_LOANS = `// src/pages/LoanList.js — STARTER (Câu 3)
import { Container } from 'react-bootstrap';

export default function LoanList() {
  // TODO: bảng #loan-table: No | Book | Member | Borrow date | Due date | Status | Action, nút .btn-return
  return (
    <Container>
      <h2>Loans</h2>
    </Container>
  );
}
`;
const S_APP = `// src/App.js — STARTER: route đã khai, chưa có "/" ⇒ "/books"
import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import BookList from './pages/BookList';
import BorrowBook from './pages/BorrowBook';
import LoanList from './pages/LoanList';

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id/borrow" element={<BorrowBook />} />
        <Route path="/loans" element={<LoanList />} />
      </Routes>
    </>
  );
}
`;

const INDEX = index({ bootstrap: true, router: true });
const LOI_GIAI = {
  'src/pages/BookList.js': BOOK_LIST, 'src/pages/BorrowBook.js': BORROW, 'src/pages/LoanList.js': LOANS,
  'src/App.js': APP, 'src/api.js': API, 'src/utils/date.js': DATE, 'src/components/AppNavbar.js': NAVBAR,
  'src/index.js': INDEX, '.env': ENV, 'database.json': DB_JSON,
};
const KHOI_DAU = {
  'src/pages/BookList.js': S_BOOKS, 'src/pages/BorrowBook.js': S_BORROW, 'src/pages/LoanList.js': S_LOANS,
  'src/App.js': S_APP, 'src/api.js': S_API, 'src/utils/date.js': S_DATE, 'src/components/AppNavbar.js': NAVBAR,
  'src/index.js': INDEX, '.env': 'REACT_APP_API_URL=\n', 'database.json': DB_JSON,
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const TITLES = ['A Brief History of Time', 'Clean Code', 'Cosmos', 'Design Patterns', 'Guns, Germs, and Steel', 'Sapiens', 'The Pragmatic Programmer', 'The Selfish Gene'];
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const gui = { hanhDong: 'gui', selector: '#borrow-form' };
const dien = (member, borrow, due) => [
  { hanhDong: 'cho', ms: 150 },
  ...(member ? [doi('#member', member)] : []),
  ...(borrow != null ? [nhap('#borrowDate', borrow)] : []),
  ...(due != null ? [nhap('#dueDate', due)] : []),
  gui, cho(),
];
const MUON_OK = dien('4', '2026-01-10', '2026-01-20');

const KIEM = [
  // f1 — Catalog
  { nhom: 'f1', moTa: '"/" redirects to /books', url: '/', kiem: 'duong-dan', giaTri: '/books' },
  { nhom: 'f1', moTa: '8 book cards are rendered', kiem: 'so-luong', selector: '.book-card', giaTri: 8 },
  { nhom: 'f1', moTa: 'Cards are sorted by title A → Z', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: TITLES },
  { nhom: 'f1', moTa: 'Card #book-1 shows author, category and year', kiem: 'text', selector: '#book-1', khop: 'Robert C\\. Martin[\\s\\S]*Software[\\s\\S]*2008' },
  { nhom: 'f1', moTa: 'Navbar has #nav-books and #nav-loans', kiem: 'so-luong', selector: '#nav-books, #nav-loans', giaTri: 2 },
  { nhom: 'f1', moTa: '.env defines REACT_APP_API_URL=http://localhost:9999', kiem: 'ma-nguon', tep: '.env', khop: 'REACT_APP_API_URL\\s*=\\s*http://localhost:9999' },
  { nhom: 'f1', moTa: 'Code reads the API URL from the environment', kiem: 'ma-nguon', khop: 'process\\.env\\.REACT_APP_API_URL|import\\.meta\\.env\\.VITE_API_URL' },
  { nhom: 'f1', an: true, moTa: 'UI uses React-Bootstrap / Bootstrap', kiem: 'ma-nguon', khop: "from\\s+['\"]react-bootstrap['\"]|className=\"[^\"]*\\b(card|row|container|table)\\b" },
  { nhom: 'f1', an: true, moTa: 'Books are loaded with GET /books', kiem: 'goi-fetch', khop: `^GET ${B}/books$` },
  // f2 — Search
  { nhom: 'f2', moTa: 'Counter reads "Showing 8 of 8 books"', kiem: 'text', selector: '#result-count', khop: 'Showing 8 of 8 books' },
  { nhom: 'f2', moTa: 'Search "the" ⇒ 2 books', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: ['The Pragmatic Programmer', 'The Selfish Gene'], truoc: [nhap('#search', 'the')] },
  { nhom: 'f2', moTa: 'Counter updates: "Showing 2 of 8 books"', kiem: 'text', selector: '#result-count', khop: 'Showing 2 of 8 books', truoc: [nhap('#search', 'the')] },
  { nhom: 'f2', an: true, moTa: 'Search is case-insensitive', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: ['Cosmos'], truoc: [nhap('#search', 'COSMOS')] },
  { nhom: 'f2', an: true, moTa: 'No match ⇒ .no-result "No books found"', kiem: 'text', selector: '.no-result', khop: 'No books found', truoc: [nhap('#search', 'zzz')] },
  { nhom: 'f2', an: true, moTa: 'Searching does not call the API again', kiem: 'goi-fetch', khop: '^GET .*/books', min: 1, max: 1, truoc: [nhap('#search', 'c'), nhap('#search', 'co'), cho(150)] },
  // f3 — Category filter + query param
  { nhom: 'f3', moTa: 'Dropdown options come from the data', kiem: 'danh-sach-text', selector: '#category-filter option', mongDoi: ['All categories', 'History', 'Science', 'Software'] },
  { nhom: 'f3', moTa: 'Choosing "Science" ⇒ 3 books', kiem: 'danh-sach-text', selector: '.book-title', mongDoi: ['A Brief History of Time', 'Cosmos', 'The Selfish Gene'], truoc: [doi('#category-filter', 'Science')] },
  { nhom: 'f3', moTa: 'Choosing a category writes ?category= to the URL', kiem: 'duong-dan', khop: '^/books\\?category=History$', truoc: [doi('#category-filter', 'History')] },
  { nhom: 'f3', moTa: '/books?category=Science pre-selects the dropdown', url: '/books?category=Science', kiem: 'thuoc-tinh-js', selector: '#category-filter', thuocTinh: 'value', giaTri: 'Science' },
  { nhom: 'f3', an: true, moTa: '/books?category=Science shows only 3 cards', url: '/books?category=Science', kiem: 'so-luong', selector: '.book-card', giaTri: 3 },
  { nhom: 'f3', an: true, moTa: 'Search + filter combine', kiem: 'text', selector: '#result-count', khop: 'Showing 1 of 8 books', truoc: [doi('#category-filter', 'Science'), nhap('#search', 'the')] },
  // f4 — Availability + navigation
  { nhom: 'f4', moTa: 'Out-of-stock badge on #book-2', kiem: 'text', selector: '#book-2 .book-availability', khop: '^Out of stock$' },
  { nhom: 'f4', moTa: '"Available: 2" badge on #book-1', kiem: 'text', selector: '#book-1 .book-availability', khop: '^Available: 2$' },
  { nhom: 'f4', moTa: 'Borrow is disabled when out of stock', kiem: 'thuoc-tinh-js', selector: '#book-2 .btn-borrow', thuocTinh: 'disabled', giaTri: true },
  { nhom: 'f4', moTa: 'Borrow navigates to /books/3/borrow', kiem: 'duong-dan', giaTri: '/books/3/borrow', truoc: [click('#book-3 .btn-borrow')] },
  // f5 — Borrow page loads
  { nhom: 'f5', moTa: '#book-info shows the title and "Available: 4"', url: '/books/3/borrow', kiem: 'text', selector: '#book-info', khop: 'A Brief History of Time[\\s\\S]*Available: 4' },
  { nhom: 'f5', moTa: '#member lists the 3 ACTIVE members + a placeholder', url: '/books/3/borrow', kiem: 'so-luong', selector: '#member option', giaTri: 4 },
  { nhom: 'f5', moTa: 'Suspended member M003 is not offered', url: '/books/3/borrow', kiem: 'text', selector: '#member', khop: '^(?![\\s\\S]*Le Hoang Cuong)[\\s\\S]*Pham Minh Duc' },
  { nhom: 'f5', an: true, moTa: 'Borrow date defaults to today (yyyy-mm-dd)', url: '/books/3/borrow', kiem: 'thuoc-tinh', selector: '#borrowDate', thuocTinh: 'value', khop: '^\\d{4}-\\d{2}-\\d{2}$' },
  { nhom: 'f5', an: true, moTa: 'Unknown id ⇒ "Book not found"', url: '/books/99/borrow', kiem: 'text', selector: '.alert-danger', khop: 'Book not found' },
  // f6 — Validation
  { nhom: 'f6', moTa: 'Nothing selected ⇒ "Please select a member."', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: '^Please select a member\\.$', truoc: dien(null, null, null) },
  { nhom: 'f6', moTa: 'No due date ⇒ "Please choose a due date."', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: '^Please choose a due date\\.$', truoc: dien('4', null, null) },
  { nhom: 'f6', moTa: 'Due before borrow ⇒ "Due date must be after the borrow date."', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: 'Due date must be after the borrow date', truoc: dien('4', '2026-01-10', '2026-01-05') },
  { nhom: 'f6', moTa: '20 days ⇒ "A loan cannot exceed 14 days."', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: 'A loan cannot exceed 14 days', truoc: dien('4', '2026-01-10', '2026-01-30') },
  { nhom: 'f6', moTa: 'Submitting does not reload the page', url: '/books/3/borrow', kiem: 'khong-tai-lai', truoc: dien('4', '2026-01-10', '2026-01-30') },
  { nhom: 'f6', an: true, moTa: 'Future borrow date is rejected', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: 'Borrow date cannot be in the future', truoc: dien('4', '2099-01-01', '2099-01-05') },
  { nhom: 'f6', an: true, moTa: 'Out-of-stock book is rejected', url: '/books/2/borrow', kiem: 'text', selector: '#form-error', khop: 'This book is out of stock', truoc: dien('4', '2026-01-10', '2026-01-20') },
  { nhom: 'f6', an: true, moTa: 'Member with 2 open loans is rejected', url: '/books/3/borrow', kiem: 'text', selector: '#form-error', khop: 'This member already has 2 open loans', truoc: dien('1', '2026-01-10', '2026-01-20') },
  { nhom: 'f6', an: true, moTa: 'An invalid form sends no POST', url: '/books/3/borrow', kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: dien('4', '2026-01-10', '2026-01-30') },
  // f7 — Save
  { nhom: 'f7', moTa: 'Valid loan ⇒ redirect to /loans', url: '/books/3/borrow', kiem: 'duong-dan', giaTri: '/loans', truoc: MUON_OK },
  { nhom: 'f7', moTa: 'POST /loans stores the new loan', url: '/books/3/borrow', kiem: 'du-lieu-server', bang: 'loans', chua: { bookId: 3, memberId: 4, borrowDate: '2026-01-10', dueDate: '2026-01-20' }, truoc: MUON_OK },
  { nhom: 'f7', moTa: 'PATCH /books/3 decreases availableCopies to 3', url: '/books/3/borrow', kiem: 'du-lieu-server', bang: 'books', chua: { id: 3, availableCopies: 3 }, truoc: MUON_OK },
  { nhom: 'f7', an: true, moTa: 'Exactly 14 days is allowed', url: '/books/3/borrow', kiem: 'du-lieu-server', bang: 'loans', chua: { dueDate: '2026-01-24' }, truoc: dien('4', '2026-01-10', '2026-01-24') },
  { nhom: 'f7', an: true, moTa: 'The loan table then shows 4 rows', url: '/books/3/borrow', kiem: 'so-luong', selector: '#loan-table tbody tr', giaTri: 4, truoc: MUON_OK },
  // f8 — Loan list
  { nhom: 'f8', moTa: '#loan-table has 3 rows', url: '/loans', kiem: 'so-luong', selector: '#loan-table tbody tr', giaTri: 3 },
  { nhom: 'f8', moTa: 'Book titles are joined, newest borrow first', url: '/loans', kiem: 'danh-sach-text', selector: '.loan-book', mongDoi: ['Sapiens', 'Clean Code', 'A Brief History of Time'] },
  { nhom: 'f8', moTa: 'Member names are joined', url: '/loans', kiem: 'danh-sach-text', selector: '.loan-member', mongDoi: ['Nguyen Van An', 'Nguyen Van An', 'Tran Thi Binh'] },
  { nhom: 'f8', moTa: 'Dates are dd/MM/yyyy', url: '/loans', kiem: 'text', selector: '#loan-row-1 .loan-borrow', giaTri: '02/03/2026' },
  { nhom: 'f8', moTa: 'Loan 1 is "Overdue", loan 3 is "Returned"', url: '/loans', kiem: 'danh-sach-text', selector: '#loan-row-1 .loan-status, #loan-row-3 .loan-status', mongDoi: ['Overdue', 'Returned'] },
  { nhom: 'f8', an: true, moTa: 'Returned loans have no Return button', url: '/loans', kiem: 'so-luong', selector: '#loan-row-3 .btn-return', giaTri: 0 },
  { nhom: 'f8', an: true, moTa: 'Due date formatted too', url: '/loans', kiem: 'text', selector: '#loan-row-3 .loan-due', giaTri: '10/02/2026' },
  // f9 — Return
  { nhom: 'f9', moTa: 'Return ⇒ status becomes "Returned"', url: '/loans', kiem: 'text', selector: '#loan-row-1 .loan-status', giaTri: 'Returned', truoc: [cho(150), click('#loan-row-1 .btn-return'), cho()] },
  { nhom: 'f9', moTa: 'Return ⇒ PATCH /loans/1', url: '/loans', kiem: 'goi-fetch', khop: `^PATCH ${B}/loans/1$`, truoc: [cho(150), click('#loan-row-1 .btn-return'), cho()] },
  { nhom: 'f9', moTa: 'Return ⇒ book 1 availableCopies goes back to 3', url: '/loans', kiem: 'du-lieu-server', bang: 'books', chua: { id: 1, availableCopies: 3 }, truoc: [cho(150), click('#loan-row-1 .btn-return'), cho()] },
  { nhom: 'f9', an: true, moTa: 'The change survives a reload (saved on the server)', url: '/loans', kiem: 'text', selector: '#loan-row-1 .loan-status', giaTri: 'Returned', truoc: [cho(150), click('#loan-row-1 .btn-return'), cho(), { hanhDong: 'tai-lai' }, cho(150)] },
  { nhom: 'f9', an: true, moTa: 'The Return button disappears from that row', url: '/loans', kiem: 'so-luong', selector: '#loan-row-1 .btn-return', giaTri: 0, truoc: [cho(150), click('#loan-row-1 .btn-return'), cho()] },
];

// ═════════════════════════════════════ ĐỀ (bản in) ═════════════════════════════════════
const BAN_IN = {
  tieuDe: { en: 'PE PRACTICE 1 — Library Loan System', vi: 'LUYỆN PE 1 — Hệ thống mượn sách thư viện' },
  phu: {
    en: 'FER202 · Practical Exam practice (SP26/SU26 format) · Duration: 85 minutes · Total: 10 marks · json-server + React Router + React-Bootstrap',
    vi: 'FER202 · Luyện thi thực hành (dạng SP26/SU26) · Thời gian: 85 phút · Tổng: 10 điểm · json-server + React Router + React-Bootstrap',
  },
  moTa: {
    en: '<p>A small library wants a React front-end for its loan desk. The REST API is served by <b>json-server</b> from the given <code>database.json</code> at <code>http://localhost:9999</code> (<code>npx json-server --watch database.json --port 9999</code>); the React app runs at <code>http://localhost:3000</code>.</p><p>Build three pages: a <b>Book Catalog</b> (search, category filter with a URL query parameter), a <b>Borrow</b> form with business rules, and a <b>Loans</b> table where a librarian records returns. <b>0 marks</b> for a page whose URL differs from the paper.</p>',
    vi: '<p>Một thư viện nhỏ cần giao diện React cho quầy mượn sách. API REST do <b>json-server</b> phục vụ từ tệp <code>database.json</code> đã cho tại <code>http://localhost:9999</code> (<code>npx json-server --watch database.json --port 9999</code>); ứng dụng React chạy ở <code>http://localhost:3000</code>.</p><p>Làm ba trang: <b>Danh mục sách</b> (tìm, lọc thể loại có tham số URL), form <b>Mượn sách</b> có luật nghiệp vụ, và bảng <b>Phiếu mượn</b> nơi thủ thư ghi nhận trả sách. Trang sai URL so với đề ⇒ <b>0 điểm</b> phần đó.</p>',
  },
  chucNangChinh: [
    { en: 'Question 1 (4 marks) — <code>/books</code>: catalog, search, category filter + <code>?category=</code>.', vi: 'Câu 1 (4 điểm) — <code>/books</code>: danh mục, tìm, lọc thể loại + <code>?category=</code>.' },
    { en: 'Question 2 (3.5 marks) — <code>/books/:id/borrow</code>: borrow form, 7 business rules, POST + PATCH, redirect.', vi: 'Câu 2 (3,5 điểm) — <code>/books/:id/borrow</code>: form mượn, 7 luật nghiệp vụ, POST + PATCH, chuyển trang.' },
    { en: 'Question 3 (2.5 marks) — <code>/loans</code>: joined table, dd/MM/yyyy dates, status, Return.', vi: 'Câu 3 (2,5 điểm) — <code>/loans</code>: bảng nối dữ liệu, ngày dd/MM/yyyy, trạng thái, Trả sách.' },
  ],
  yeuCauChung: [
    { en: 'Store the API URL in <code>.env</code> as <code>REACT_APP_API_URL</code> (Vite: <code>VITE_API_URL</code>) — hard-coding it costs all marks.', vi: 'Lưu địa chỉ API trong <code>.env</code> với tên <code>REACT_APP_API_URL</code> (Vite: <code>VITE_API_URL</code>) — viết cứng URL là mất hết điểm.' },
    { en: 'Use <b>Bootstrap or React-Bootstrap</b> for the UI.', vi: 'Giao diện dùng <b>Bootstrap hoặc React-Bootstrap</b>.' },
    { en: 'Function components + Hooks; <code>react-router-dom</code> v6 for routing; <code>fetch</code> or <code>axios</code> for HTTP.', vi: 'Function component + Hooks; <code>react-router-dom</code> v6 cho định tuyến; <code>fetch</code> hoặc <code>axios</code> cho HTTP.' },
    { en: 'Search and filtering happen on the client — <b>no extra API call</b> per keystroke.', vi: 'Tìm và lọc làm ở client — <b>không gọi API thêm</b> mỗi lần gõ.' },
    { en: 'Ids in <code>database.json</code> are numbers; route parameters are strings — convert when you compare or save.', vi: 'Id trong <code>database.json</code> là số; tham số route là chuỗi — đổi kiểu khi so sánh hoặc lưu.' },
    { en: 'Keep the ids / class names of section 6 exactly — the auto-grader relies on them.', vi: 'Giữ đúng id / class ở mục 6 — máy chấm dựa vào chúng.' },
  ],
  cayThuMuc: `
database.json              # given — run json-server on port 9999
.env                       # REACT_APP_API_URL=http://localhost:9999
src/
├── api.js                 # API_URL + getJSON / sendJSON helpers
├── utils/
│   └── date.js            # todayISO · formatDate · daysBetween
├── components/
│   └── AppNavbar.js       # given
├── pages/
│   ├── BookList.js        # Q1  /books
│   ├── BorrowBook.js      # Q2  /books/:id/borrow
│   └── LoanList.js        # Q3  /loans
├── App.js                 # routes
└── index.js               # given (BrowserRouter + bootstrap.css)`,
  wireframe: `
+-----------------------------------------------------------------------------+
| Library   Books   Loans                                                     |
+-----------------------------------------------------------------------------+
| Book Catalog                                                                |
| [Search by title...                          ] [All categories       v]    |
| Showing 8 of 8 books                                                        |
| +----------------------+ +----------------------+ +----------------------+  |
| | A Brief History of   | | Clean Code           | | Cosmos               |  |
| | Time                 | | Robert C. Martin     | | Carl Sagan           |  |
| | Stephen Hawking      | | Software · 2008      | | Science · 1980       |  |
| | Science · 1988       | | [Available: 2]       | | [Available: 2]       |  |
| | [Available: 4]       | |----------------------| |----------------------|  |
| |----------------------| | [Borrow]             | | [Borrow]             |  |
| | [Borrow]             | +----------------------+ +----------------------+  |
| +----------------------+   ... 3 cards per row (md and up)                  |
+-----------------------------------------------------------------------------+
| /books/3/borrow                       | /loans                              |
| Borrow a book                         | No Book    Member  Borrow Due  Status|
| A Brief History of Time — S. Hawking  | 1  Sapiens An    20/10/2026 ...  [On loan] [Return]
| Available: 4                          | 2  Clean.. An    02/03/2026 ...  [Overdue] [Return]
| Member      [-- Select member --  v]  | 3  A Brief Binh  01/02/2026 ...  [Returned]
| Borrow date [2026-10-29]              |                                     |
| Due date    [          ]              |                                     |
| [Confirm borrow]  Cancel              |                                     |
+-----------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'books · members · loans (database.json)',
    truong: [
      ['books.id', 'number', { en: 'primary key', vi: 'khoá chính' }],
      ['books.title / author / category', 'string', { en: 'category ∈ Software, Science, History (read it from the data)', vi: 'category ∈ Software, Science, History (lấy từ dữ liệu)' }],
      ['books.publishedYear', 'number', ''],
      ['books.totalCopies / availableCopies', 'number', { en: 'availableCopies = 0 ⇒ out of stock', vi: 'availableCopies = 0 ⇒ hết sách' }],
      ['members.id / code / fullName / email', 'number / string', ''],
      ['members.status', "'ACTIVE' | 'SUSPENDED'", { en: 'only ACTIVE members may borrow', vi: 'chỉ thành viên ACTIVE được mượn' }],
      ['loans.id / bookId / memberId', 'number', { en: 'foreign keys to books / members', vi: 'khoá ngoại tới books / members' }],
      ['loans.borrowDate / dueDate', "string 'yyyy-mm-dd'", ''],
      ['loans.returnDate', "string | null", { en: 'null ⇒ not returned yet', vi: 'null ⇒ chưa trả' }],
    ],
  },
  duLieuMau: `
books (8):  1 Clean Code (avail 2) · 2 The Pragmatic Programmer (avail 0) · 3 A Brief History of Time (avail 4)
            4 Sapiens (avail 1) · 5 Cosmos (avail 2) · 6 Design Patterns (avail 1)
            7 Guns, Germs, and Steel (avail 1) · 8 The Selfish Gene (avail 0)
members:    1 M001 Nguyen Van An (ACTIVE) · 2 M002 Tran Thi Binh (ACTIVE)
            3 M003 Le Hoang Cuong (SUSPENDED) · 4 M004 Pham Minh Duc (ACTIVE)
loans:      1 book 1 / member 1  2026-03-02 → 2026-03-16  returnDate null
            2 book 4 / member 1  2026-10-20 → 2026-11-03  returnDate null
            3 book 3 / member 2  2026-02-01 → 2026-02-10  returnDate 2026-02-09`,
  chucNang: [
    {
      ten: { en: 'Q1 · Book catalog page', vi: 'C1 · Trang danh mục sách' }, diem: 1.5,
      moTa: { en: 'Route <code>/books</code> (and <code>/</code> redirects there). Fetch <code>GET /books</code> once.', vi: 'Route <code>/books</code> (và <code>/</code> chuyển sang đó). Gọi <code>GET /books</code> một lần.' },
      yeuCau: [
        { en: 'Navbar with links <code>#nav-books</code> (Books) and <code>#nav-loans</code> (Loans).', vi: 'Navbar có link <code>#nav-books</code> (Books) và <code>#nav-loans</code> (Loans).' },
        { en: 'Cards in a grid, <b>3 per row</b> on medium screens, sorted by <code>title</code> A → Z.', vi: 'Thẻ trong lưới, <b>3 thẻ một hàng</b> ở màn hình vừa, sắp theo <code>title</code> A → Z.' },
        { en: 'Each card <code>#book-{id}.book-card</code> shows <code>.book-title</code>, author, <code>category · publishedYear</code>.', vi: 'Mỗi thẻ <code>#book-{id}.book-card</code> có <code>.book-title</code>, tác giả, <code>category · publishedYear</code>.' },
      ],
      hook: ['useEffect', 'useState', 'fetch / axios'],
    },
    {
      ten: { en: 'Q1 · Search by title', vi: 'C1 · Tìm theo tên sách' }, diem: 1,
      yeuCau: [
        { en: 'Input <code>#search</code>: title <b>contains</b> the keyword, case-insensitive, updates while typing.', vi: 'Ô <code>#search</code>: tên sách <b>chứa</b> từ khoá, không phân biệt hoa/thường, cập nhật khi gõ.' },
        { en: '<code>#result-count</code> reads <code>Showing X of Y books</code>.', vi: '<code>#result-count</code> ghi <code>Showing X of Y books</code>.' },
        { en: 'No match ⇒ <code>.no-result</code> with the text <code>No books found</code>.', vi: 'Không có kết quả ⇒ <code>.no-result</code> ghi <code>No books found</code>.' },
      ],
      hook: ['useMemo'],
      viDu: { en: 'Type "the"  ⇒  The Pragmatic Programmer, The Selfish Gene  ·  Showing 2 of 8 books', vi: 'Gõ "the"  ⇒  The Pragmatic Programmer, The Selfish Gene  ·  Showing 2 of 8 books' },
    },
    {
      ten: { en: 'Q1 · Category filter + query parameter', vi: 'C1 · Lọc thể loại + tham số URL' }, diem: 1,
      yeuCau: [
        { en: '<code>#category-filter</code>: first option <code>All categories</code> (value <code>All</code>), then the <b>unique categories from the data</b>, A → Z. Do not hard-code them.', vi: '<code>#category-filter</code>: lựa chọn đầu <code>All categories</code> (value <code>All</code>), rồi các <b>thể loại không trùng lấy từ dữ liệu</b>, A → Z. Không viết cứng.' },
        { en: 'Selecting a category updates the URL to <code>/books?category=Science</code>; "All" removes the parameter.', vi: 'Chọn thể loại ⇒ URL thành <code>/books?category=Science</code>; chọn "All" ⇒ bỏ tham số.' },
        { en: 'Opening <code>/books?category=Science</code> directly pre-selects and applies the filter. Search and filter combine.', vi: 'Mở thẳng <code>/books?category=Science</code> ⇒ dropdown chọn sẵn và đã lọc. Tìm và lọc kết hợp được.' },
      ],
      hook: ['useSearchParams'],
      viDu: { en: 'Science + "the"  ⇒  The Selfish Gene  ·  Showing 1 of 8 books', vi: 'Science + "the"  ⇒  The Selfish Gene  ·  Showing 1 of 8 books' },
    },
    {
      ten: { en: 'Q1 · Availability & Borrow button', vi: 'C1 · Tình trạng & nút Mượn' }, diem: 0.5,
      yeuCau: [
        { en: 'Badge <code>.book-availability</code>: <code>Available: N</code> (green) or <code>Out of stock</code> (gray) when <code>availableCopies</code> is 0.', vi: 'Badge <code>.book-availability</code>: <code>Available: N</code> (xanh) hoặc <code>Out of stock</code> (xám) khi <code>availableCopies</code> = 0.' },
        { en: 'Button <code>.btn-borrow</code> navigates to <code>/books/:id/borrow</code>; it is <b>disabled</b> when out of stock.', vi: 'Nút <code>.btn-borrow</code> chuyển tới <code>/books/:id/borrow</code>; <b>bị vô hiệu</b> khi hết sách.' },
      ],
      hook: ['useNavigate'],
    },
    {
      ten: { en: 'Q2 · Borrow page — load data', vi: 'C2 · Trang mượn — tải dữ liệu' }, diem: 1,
      moTa: { en: 'Route <code>/books/:id/borrow</code>. Fetch <code>GET /books/:id</code> and the members.', vi: 'Route <code>/books/:id/borrow</code>. Gọi <code>GET /books/:id</code> và danh sách thành viên.' },
      yeuCau: [
        { en: '<code>#book-info</code> shows the title, author and <code>Available: N</code>.', vi: '<code>#book-info</code> hiện tên sách, tác giả và <code>Available: N</code>.' },
        { en: 'Form <code>#borrow-form</code>: select <code>#member</code> (placeholder <code>-- Select member --</code> with value "", then <code>code — fullName</code> of <b>ACTIVE</b> members only), <code>#borrowDate</code> (type date, defaults to <b>today</b>), <code>#dueDate</code> (type date, empty).', vi: 'Form <code>#borrow-form</code>: select <code>#member</code> (dòng gợi ý <code>-- Select member --</code> value "", rồi <code>code — fullName</code> của thành viên <b>ACTIVE</b>), <code>#borrowDate</code> (kiểu date, mặc định <b>hôm nay</b>), <code>#dueDate</code> (kiểu date, trống).' },
        { en: 'Unknown id (API answers 404) ⇒ a red alert <code>.alert-danger</code> <code>Book not found</code>.', vi: 'Id không có (API trả 404) ⇒ cảnh báo đỏ <code>.alert-danger</code> <code>Book not found</code>.' },
      ],
      hook: ['useParams', 'useEffect', 'Promise.all'],
    },
    {
      ten: { en: 'Q2 · Business rules', vi: 'C2 · Luật nghiệp vụ' }, diem: 1.5,
      moTa: { en: 'On submit, check the rules <b>in this order</b> and show only the first message in <code>#form-error</code> (an <code>.alert-danger</code>). Nothing is sent while a rule fails; the page never reloads.', vi: 'Khi gửi, kiểm các luật <b>theo đúng thứ tự</b> và chỉ hiện câu lỗi đầu tiên trong <code>#form-error</code> (một <code>.alert-danger</code>). Còn lỗi thì không gửi gì; trang không bao giờ tải lại.' },
      yeuCau: [
        { en: 'No member ⇒ <code>Please select a member.</code>', vi: 'Chưa chọn thành viên ⇒ <code>Please select a member.</code>' },
        { en: 'Empty date ⇒ <code>Please choose a borrow date.</code> / <code>Please choose a due date.</code>', vi: 'Thiếu ngày ⇒ <code>Please choose a borrow date.</code> / <code>Please choose a due date.</code>' },
        { en: 'Borrow date after today ⇒ <code>Borrow date cannot be in the future.</code>', vi: 'Ngày mượn sau hôm nay ⇒ <code>Borrow date cannot be in the future.</code>' },
        { en: 'Due date not after the borrow date ⇒ <code>Due date must be after the borrow date.</code>', vi: 'Ngày hẹn trả không sau ngày mượn ⇒ <code>Due date must be after the borrow date.</code>' },
        { en: 'More than 14 days ⇒ <code>A loan cannot exceed 14 days.</code> (exactly 14 is allowed)', vi: 'Quá 14 ngày ⇒ <code>A loan cannot exceed 14 days.</code> (đúng 14 ngày vẫn được)' },
        { en: '<code>availableCopies</code> is 0 ⇒ <code>This book is out of stock.</code>', vi: '<code>availableCopies</code> = 0 ⇒ <code>This book is out of stock.</code>' },
        { en: 'The member already has 2 loans with <code>returnDate: null</code> ⇒ <code>This member already has 2 open loans.</code>', vi: 'Thành viên đã có 2 phiếu <code>returnDate: null</code> ⇒ <code>This member already has 2 open loans.</code>' },
      ],
      hook: ['controlled form', 'e.preventDefault()'],
    },
    {
      ten: { en: 'Q2 · Save the loan', vi: 'C2 · Lưu phiếu mượn' }, diem: 1,
      yeuCau: [
        { en: '<code>POST /loans</code> with <code>{ bookId, memberId, borrowDate, dueDate, returnDate: null }</code> (ids as numbers).', vi: '<code>POST /loans</code> với <code>{ bookId, memberId, borrowDate, dueDate, returnDate: null }</code> (id là số).' },
        { en: '<code>PATCH /books/:id</code> with <code>{ availableCopies: current - 1 }</code>.', vi: '<code>PATCH /books/:id</code> với <code>{ availableCopies: hiện tại - 1 }</code>.' },
        { en: 'Then navigate to <code>/loans</code>.', vi: 'Rồi chuyển tới <code>/loans</code>.' },
      ],
      hook: ['useNavigate', 'async/await'],
      viDu: { en: 'POST /loans  { "bookId": 3, "memberId": 4, "borrowDate": "2026-01-10", "dueDate": "2026-01-20", "returnDate": null }', vi: 'POST /loans  { "bookId": 3, "memberId": 4, "borrowDate": "2026-01-10", "dueDate": "2026-01-20", "returnDate": null }' },
    },
    {
      ten: { en: 'Q3 · Loans table', vi: 'C3 · Bảng phiếu mượn' }, diem: 1.5,
      moTa: { en: 'Route <code>/loans</code>.', vi: 'Route <code>/loans</code>.' },
      yeuCau: [
        { en: 'Table <code>#loan-table</code>: <code>No | Book | Member | Borrow date | Due date | Status | Action</code>; row id <code>loan-row-{id}</code>; cells <code>.loan-book</code>, <code>.loan-member</code>, <code>.loan-borrow</code>, <code>.loan-due</code>, <code>.loan-status</code>.', vi: 'Bảng <code>#loan-table</code>: <code>No | Book | Member | Borrow date | Due date | Status | Action</code>; id hàng <code>loan-row-{id}</code>; ô <code>.loan-book</code>, <code>.loan-member</code>, <code>.loan-borrow</code>, <code>.loan-due</code>, <code>.loan-status</code>.' },
        { en: 'Show the book <b>title</b> and member <b>fullName</b> (not the ids). Newest <code>borrowDate</code> first.', vi: 'Hiện <b>tên sách</b> và <b>họ tên</b> thành viên (không hiện id). <code>borrowDate</code> mới nhất lên đầu.' },
        { en: 'Dates as <code>dd/MM/yyyy</code>.', vi: 'Ngày dạng <code>dd/MM/yyyy</code>.' },
        { en: 'Status badge: <code>Returned</code> (returnDate set) · <code>Overdue</code> (not returned, dueDate before today) · <code>On loan</code>.', vi: 'Badge trạng thái: <code>Returned</code> (đã có returnDate) · <code>Overdue</code> (chưa trả, dueDate trước hôm nay) · <code>On loan</code>.' },
      ],
      hook: ['useMemo', 'Promise.all'],
    },
    {
      ten: { en: 'Q3 · Return a book', vi: 'C3 · Trả sách' }, diem: 1,
      yeuCau: [
        { en: 'Rows not returned have a <code>.btn-return</code> button.', vi: 'Hàng chưa trả có nút <code>.btn-return</code>.' },
        { en: 'Click ⇒ <code>PATCH /loans/:id { returnDate: today }</code> and <code>PATCH /books/:bookId { availableCopies: +1 }</code>.', vi: 'Bấm ⇒ <code>PATCH /loans/:id { returnDate: hôm nay }</code> và <code>PATCH /books/:bookId { availableCopies: +1 }</code>.' },
        { en: 'The row shows <code>Returned</code> immediately (no full page reload) and the button disappears.', vi: 'Hàng hiện <code>Returned</code> ngay (không tải lại cả trang) và nút biến mất.' },
      ],
      hook: ['useState (immutable update)'],
    },
  ],
  idBatBuoc: [
    ['#nav-books · #nav-loans', { en: 'navbar links', vi: 'link navbar' }],
    ['#search · #category-filter · #result-count · .no-result', { en: 'catalog toolbar', vi: 'thanh công cụ danh mục' }],
    ['#book-{id}.book-card · .book-title · .book-availability · .btn-borrow', { en: 'one card per shown book', vi: 'mỗi sách đang hiện một thẻ' }],
    ['#book-info · #borrow-form · #member · #borrowDate · #dueDate · #form-error', { en: 'borrow page', vi: 'trang mượn' }],
    ['#loan-table · #loan-row-{id} · .loan-book · .loan-member · .loan-borrow · .loan-due · .loan-status · .btn-return', { en: 'loans page', vi: 'trang phiếu mượn' }],
  ],
  truDiem: [
    { en: 'URL in the code instead of <code>.env</code> — the whole paper is 0.', vi: 'URL viết trong mã thay vì <code>.env</code> — cả bài 0 điểm.' },
    { en: 'Wrong route (e.g. <code>/borrow/:id</code>) — that question is 0.', vi: 'Sai route (vd <code>/borrow/:id</code>) — câu đó 0 điểm.' },
    { en: 'Categories hard-coded in the dropdown — the filter mark is lost.', vi: 'Viết cứng thể loại trong dropdown — mất điểm lọc.' },
    { en: 'Comparing the route <code>id</code> (string) with <code>book.id</code> (number) using <code>===</code> — nothing matches.', vi: 'So <code>id</code> trên route (chuỗi) với <code>book.id</code> (số) bằng <code>===</code> — không khớp gì.' },
    { en: 'Missing <code>e.preventDefault()</code> — the page reloads and the error never shows.', vi: 'Thiếu <code>e.preventDefault()</code> — trang tải lại, câu lỗi không bao giờ hiện.' },
    { en: 'Date shown as <code>2026-03-02</code> or shifted by one day (<code>toISOString()</code> uses UTC).', vi: 'Ngày hiện <code>2026-03-02</code> hoặc lệch một ngày (<code>toISOString()</code> dùng giờ UTC).' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-13-pe-1-library-loans',
  ten: 'PE Practice 1 — Library Loan System',
  khoa: KHOA,
  baiHoc: 'fer202-pe18-sp26-chua-tron-de',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE Practice 1 — Library Loan System (json-server · Router · Bootstrap)', vi: 'Luyện PE 1 — Hệ thống mượn sách (json-server · Router · Bootstrap)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['json-server REST', 'React Router v6', 'useSearchParams', 'useParams', 'useNavigate', 'controlled form', 'validation', 'fetch', 'React-Bootstrap', '.env'],
      tienQuyet: ['useState / useEffect', 'map / filter / sort', 'Promise & async/await'],
      the: ['fer202', 'pe', 'json-server', 'router', 'react-bootstrap'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'loan', vi: 'phiếu mượn' },
        { en: 'borrow / return', vi: 'mượn / trả' },
        { en: 'due date', vi: 'hạn trả' },
        { en: 'overdue', vi: 'quá hạn' },
        { en: 'out of stock', vi: 'hết sách (không còn bản nào)' },
        { en: 'business rule', vi: 'luật nghiệp vụ' },
        { en: 'join (client-side)', vi: 'nối dữ liệu hai bảng ở phía client' },
        ...tn('queryParam', 'routeParam', 'redirect', 'controlled', 'caseInsensitive', 'payload', 'rubric'),
      ],
      goiY: [
        'Làm theo thứ tự điểm: Câu 1 trước (4 điểm, dễ nhất). Viết api.js + date.js trước — ba trang đều dùng.',
        'Câu 1: một state books + một state search; category KHÔNG để state — đọc từ useSearchParams. Danh sách hiển thị = useMemo(filter → filter → sort).',
        'Câu 2: luật nào chỉ cần dữ liệu form ⇒ kiểm đồng bộ trước; luật "2 phiếu chưa trả" cần GET /loans?memberId=… ⇒ để cuối, trong async.',
        'Câu 3: tải loans + books + members bằng Promise.all, dựng Map id → object rồi tra; trả sách xong dùng setLoans(list => list.map(…)) để chỉ đổi một dòng.',
      ],
      loiHayGap: [
        'Lưu thể loại vào state riêng rồi quên đồng bộ với URL ⇒ mở <code>/books?category=Science</code> không chọn sẵn.',
        'So <code>book.id === id</code> với <code>id</code> từ <code>useParams()</code> (chuỗi) ⇒ luôn false; dùng <code>String(book.id) === id</code> hoặc <code>Number(id)</code>.',
        'Gọi <code>fetch</code> rồi quên <code>res.ok</code>: 404 không ném lỗi ⇒ trang "Book not found" không bao giờ hiện.',
        '<code>new Date().toISOString().slice(0, 10)</code> làm ngày mặc định ⇒ trước 7 giờ sáng ở VN ra ngày HÔM QUA.',
        'Hiện <code>bookId</code>/<code>memberId</code> thay vì tên sách/tên thành viên ở bảng phiếu mượn.',
        'Trả sách xong gọi <code>window.location.reload()</code> — mất điểm "không tải lại trang", và chậm.',
        'PATCH availableCopies bằng chuỗi (<code>"3"</code>) hoặc quên PATCH sách ⇒ số bản sai lệch.',
      ],
      moTaNgan: 'Đề luyện PE dạng SP26: json-server + Router (tham số URL, query) + React-Bootstrap + form có 7 luật + POST/PATCH. Có đồng hồ 85 phút, thang 10.',
      giaiThich: '<p>Lời giải chia đúng ba câu thành ba trang và hai tiện ích dùng chung: <code>api.js</code> (đọc <code>REACT_APP_API_URL</code>, kiểm <code>res.ok</code>) và <code>utils/date.js</code> (ngày theo giờ máy, định dạng bằng cắt chuỗi để không lệch múi giờ).</p><p><b>Câu 1</b>: dữ liệu tải một lần; tìm/lọc/sắp xếp là giá trị suy ra bằng <code>useMemo</code>; thể loại sống trên URL qua <code>useSearchParams</code> nên mở link có <code>?category=</code> là thấy đúng bộ lọc. <b>Câu 2</b>: kiểm các luật đồng bộ theo thứ tự, luật cần máy chủ (2 phiếu chưa trả) để cuối; lưu bằng POST rồi PATCH, xong <code>navigate(\'/loans\')</code>. <b>Câu 3</b>: nối dữ liệu ở client bằng <code>Map</code> (json-server 1.x bỏ <code>_expand</code>), trạng thái là giá trị tính, trả sách cập nhật đúng một dòng bằng <code>map</code>.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: '/books', jsonServer: { base: B, db: DB }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/books' },
      thamKhao: 'https://reactrouter.com/en/6.26.2/hooks/use-search-params',
    },
  ],
});
