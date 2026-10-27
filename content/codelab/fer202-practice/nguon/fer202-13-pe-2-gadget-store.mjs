/**
 * FER202 · Luyện PE — ĐỀ 2: Gadget Store (Vite .env + axios + route có mã sinh viên + CRUD + kiểm form).
 * Đề MỚI theo DẠNG PE17 (SU26 20060701 — Sneaker Collection): trang Collection lưới thẻ sắp xếp + định dạng tiền,
 * trang Management bảng + ảnh 70×70 + xoá có xác nhận, form Add/Edit dùng chung với luật kiểm từng ô.
 * 85 phút · 10 điểm · 9 chức năng · json-server GIẢ có trạng thái.
 */
import { doiDau, index, KHOA, NOP_BAI, tn } from './_chung.mjs';

const anh = (seed) => `https://api.dicebear.com/9.x/icons/svg?seed=${seed}`;
const DB = {
  gadgets: [
    { id: 1, gadgetName: 'iPhone 16 Pro', brandName: 'Apple Inc', category: 'Phone', imageUrl: anh('iphone16pro'), priceK: 28990, isBestSeller: true, stock: 12 },
    { id: 2, gadgetName: 'Galaxy S25', brandName: 'Samsung Electronics', category: 'Phone', imageUrl: anh('galaxys25'), priceK: 22990, isBestSeller: true, stock: 0 },
    { id: 3, gadgetName: 'MacBook Air M4', brandName: 'Apple Inc', category: 'Laptop', imageUrl: anh('macbookair'), priceK: 27490, isBestSeller: false, stock: 5 },
    { id: 4, gadgetName: 'WH-1000XM6', brandName: 'Sony Group', category: 'Audio', imageUrl: anh('wh1000xm6'), priceK: 8990, isBestSeller: true, stock: 20 },
    { id: 5, gadgetName: 'Redmi Pad 2', brandName: 'Xiaomi Corp', category: 'Tablet', imageUrl: anh('redmipad2'), priceK: 5490, isBestSeller: false, stock: 8 },
    { id: 6, gadgetName: 'Forerunner 265', brandName: 'Garmin Ltd', category: 'Wearable', imageUrl: anh('forerunner'), priceK: 10490, isBestSeller: false, stock: 3 },
    { id: 7, gadgetName: 'Legion 5', brandName: 'Lenovo Group', category: 'Laptop', imageUrl: anh('legion5'), priceK: 32990, isBestSeller: false, stock: 2 },
    { id: 8, gadgetName: 'Galaxy Tab S10', brandName: 'Samsung Electronics', category: 'Tablet', imageUrl: anh('galaxytab'), priceK: 18990, isBestSeller: false, stock: 0 },
    { id: 9, gadgetName: 'AirPods Pro 3', brandName: 'Apple Inc', category: 'Audio', imageUrl: anh('airpods3'), priceK: 6290, isBestSeller: true, stock: 30 },
    { id: 10, gadgetName: 'Galaxy Watch 8', brandName: 'Samsung Electronics', category: 'Wearable', imageUrl: anh('galaxywatch'), priceK: 7990, isBestSeller: false, stock: 6 },
  ],
};
const DB_JSON = `${JSON.stringify(DB, null, 2)}\n`;
const ROLL = 'se123456';

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const CONFIG = `// src/config.js — cấu hình chung: địa chỉ API đọc từ .env (Vite: biến phải bắt đầu bằng VITE_)
export const API_URL = import.meta.env.VITE_API_URL;
// Mã sinh viên nằm trong MỌI đường dẫn (đề cho 0 điểm nếu sai URL)
export const ROLL = '${ROLL}';
export const CATEGORIES = ['Phone', 'Laptop', 'Tablet', 'Audio', 'Wearable'];
`;

const API = `// src/services/gadgetApi.js — mọi lời gọi HTTP của tài nguyên /gadgets nằm ở MỘT chỗ
import axios from 'axios';
import { API_URL } from '../config';

const http = axios.create({ baseURL: API_URL }); // axios tự ném lỗi khi status không phải 2xx

export const getAllGadgets = async () => (await http.get('/gadgets')).data;
export const getGadget = async (id) => (await http.get(´/gadgets/@{id}´)).data;
export const createGadget = async (gadget) => (await http.post('/gadgets', gadget)).data;
export const updateGadget = async (id, gadget) => (await http.put(´/gadgets/@{id}´, gadget)).data;
export const deleteGadget = async (id) => (await http.delete(´/gadgets/@{id}´)).data;
`;

const FORMAT = `// src/utils/format.js
// priceK lưu theo NGHÌN đồng: 28990 ⇒ "28,990,000 VND" (dấu phẩy ngăn hàng nghìn như ví dụ của đề)
export function formatVnd(priceK) {
  return ´@{(Number(priceK) * 1000).toLocaleString('en-US')} VND´;
}
`;

const VALIDATE = `// src/utils/validateGadget.js — luật kiểm của form Add/Edit (thuần JS ⇒ dễ kiểm, dùng chung hai trang)
import { CATEGORIES } from '../config';

function isHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false; // new URL() ném lỗi khi chuỗi không phải URL
  }
}

// Trả về object { tênÔ: 'câu lỗi' } — rỗng nghĩa là hợp lệ
export default function validateGadget(form) {
  const errors = {};
  if (form.gadgetName.trim().length < 3) errors.gadgetName = 'Name must be at least 3 characters';
  if (form.brandName.trim().split(/\\s+/).filter(Boolean).length < 2) errors.brandName = 'Brand must contain at least 2 words';
  if (!isHttpUrl(form.imageUrl.trim())) errors.imageUrl = 'Image URL must be a valid URL';
  // số nguyên dương, tối đa 5 chữ số: regex chặn "12.5", "-5", "1e3"; > 0 chặn "0"/"00000"
  if (!/^\\d{1,5}$/.test(String(form.priceK).trim()) || Number(form.priceK) <= 0) errors.priceK = 'Price must be a positive integer (max 5 digits)';
  if (!CATEGORIES.includes(form.category)) errors.category = 'Please choose a category';
  if (!/^\\d+$/.test(String(form.stock).trim())) errors.stock = 'Stock must be a whole number (0 or more)';
  return errors;
}
`;

const NAVBAR = `// src/components/AppNavbar.js
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { ROLL } from '../config';

export default function AppNavbar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark" className="mb-4">
      <Container>
        <Navbar.Brand>Gadget Store</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={NavLink} to={´/@{ROLL}/gadgets´} id="nav-collection">Gadget Collection</Nav.Link>
          <Nav.Link as={NavLink} to={´/@{ROLL}/manage´} id="nav-management">Gadget Management</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
`;

const APP = `// src/App.js — mọi route có mã sinh viên ở đầu
import { Navigate, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import GadgetCollection from './pages/GadgetCollection';
import GadgetManagement from './pages/GadgetManagement';
import GadgetForm from './pages/GadgetForm';
import { ROLL } from './config';

export default function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to={´/@{ROLL}/gadgets´} replace />} />
        <Route path={´/@{ROLL}/gadgets´} element={<GadgetCollection />} />
        <Route path={´/@{ROLL}/manage´} element={<GadgetManagement />} />
        {/* MỘT component cho cả thêm và sửa: có :id ⇒ chế độ sửa */}
        <Route path={´/@{ROLL}/add´} element={<GadgetForm />} />
        <Route path={´/@{ROLL}/edit/:id´} element={<GadgetForm />} />
        <Route path="*" element={<p className="container">Page not found</p>} />
      </Routes>
    </>
  );
}
`;

const COLLECTION = `// src/pages/GadgetCollection.js — Câu 1: lưới thẻ, sắp giá giảm dần, định dạng tiền, nhãn, lọc
import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, ButtonGroup, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { getAllGadgets } from '../services/gadgetApi';
import { formatVnd } from '../utils/format';

export default function GadgetCollection() {
  const [gadgets, setGadgets] = useState([]);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyBest, setOnlyBest] = useState(false);

  useEffect(() => {
    getAllGadgets()
      .then(setGadgets)
      .catch(() => setError('Cannot load gadgets — check VITE_API_URL and json-server.'));
  }, []);

  // nút lọc lấy từ dữ liệu (không trùng, A→Z)
  const categories = useMemo(() => ['All', ...[...new Set(gadgets.map((g) => g.category))].sort()], [gadgets]);

  const visible = useMemo(
    () =>
      gadgets
        .filter((g) => category === 'All' || g.category === category)
        .filter((g) => !onlyBest || g.isBestSeller)
        // giá giảm dần; bằng giá thì theo tên A→Z — filter() đã tạo mảng mới nên sort an toàn
        .sort((a, b) => b.priceK - a.priceK || a.gadgetName.localeCompare(b.gadgetName)),
    [gadgets, category, onlyBest],
  );

  return (
    <Container>
      <h2>Gadget Collection</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <ButtonGroup>
          {categories.map((c) => (
            <Button
              key={c}
              id={´cat-@{c}´}
              className="cat-btn"
              variant={c === category ? 'primary' : 'outline-primary'}
              active={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </ButtonGroup>
        <Form.Check type="switch" id="only-best" label="Best sellers only" checked={onlyBest} onChange={(e) => setOnlyBest(e.target.checked)} />
        <span id="gadget-count" className="text-muted">{visible.length} gadgets</span>
      </div>

      <Row xs={1} sm={2} lg={4} className="g-3">
        {visible.map((g) => (
          <Col key={g.id}>
            <Card id={´gadget-@{g.id}´} className="gadget-card h-100">
              <Card.Img variant="top" className="gadget-img" src={g.imageUrl} alt={g.gadgetName} style={{ height: 140, objectFit: 'contain' }} />
              <Card.Body>
                <Card.Title className="gadget-name">{g.gadgetName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{g.brandName} · {g.category}</Card.Subtitle>
                <Card.Text className="gadget-price fw-bold">{formatVnd(g.priceK)}</Card.Text>
                {g.isBestSeller && <Badge bg="warning" text="dark" className="best-seller me-2">Best Seller</Badge>}
                {g.stock === 0 && <Badge bg="secondary" className="sold-out">Sold out</Badge>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
`;

const MANAGEMENT = `// src/pages/GadgetManagement.js — Câu 2: bảng quản lý, ảnh 70×70, sửa/xoá, thêm
import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Container, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ROLL } from '../config';
import { deleteGadget, getAllGadgets } from '../services/gadgetApi';

export default function GadgetManagement() {
  const [gadgets, setGadgets] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // useCallback ⇒ hàm ổn định, dùng được trong useEffect lẫn sau khi xoá ("reload the list")
  const load = useCallback(async () => {
    try {
      const data = await getAllGadgets();
      setGadgets([...data].sort((a, b) => Number(a.id) - Number(b.id))); // id tăng dần
    } catch {
      setError('Cannot load gadgets.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (g) => {
    if (!window.confirm(´Delete "@{g.gadgetName}"?´)) return; // bấm Cancel ⇒ không làm gì
    try {
      await deleteGadget(g.id);
      window.alert('Deleted successfully');
      await load();
    } catch {
      setError('Delete failed.');
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Gadget Management</h2>
        <Link id="btn-add" className="btn btn-success" to={´/@{ROLL}/add´}>+ Add Gadget</Link>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table bordered hover responsive id="gadget-table" className="align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gadgets.map((g) => (
            <tr key={g.id} id={´gadget-row-@{g.id}´}>
              <td>{g.id}</td>
              <td className="g-name">{g.gadgetName}</td>
              <td>{g.brandName}</td>
              <td>{g.category}</td>
              <td>
                <img className="thumb" src={g.imageUrl} alt={g.gadgetName} width={70} height={70} style={{ objectFit: 'cover' }} />
              </td>
              <td>
                <Button size="sm" variant="outline-primary" className="btn-edit me-2" onClick={() => navigate(´/@{ROLL}/edit/@{g.id}´)}>Edit</Button>
                <Button size="sm" variant="outline-danger" className="btn-delete" onClick={() => handleDelete(g)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
`;

const FORM = `// src/pages/GadgetForm.js — Câu 3: MỘT form cho Thêm (/add) và Sửa (/edit/:id)
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES, ROLL } from '../config';
import { createGadget, getGadget, updateGadget } from '../services/gadgetApi';
import validateGadget from '../utils/validateGadget';

const EMPTY = { gadgetName: '', brandName: '', imageUrl: '', priceK: '', category: '', isBestSeller: false, stock: '0' };

export default function GadgetForm() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);

  // Sửa: điền sẵn dữ liệu cũ (số ⇒ chuỗi vì ô nhập luôn giữ chuỗi)
  useEffect(() => {
    if (!isEdit) return;
    getGadget(id)
      .then((g) => setForm({ ...g, priceK: String(g.priceK), stock: String(g.stock) }))
      .catch(() => setNotFound(true));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateGadget(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // còn lỗi ⇒ không gửi
    // dữ liệu gửi đi đúng KIỂU: số là number, công tắc là boolean
    const payload = {
      gadgetName: form.gadgetName.trim(),
      brandName: form.brandName.trim().replace(/\\s+/g, ' '),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      priceK: Number(form.priceK),
      isBestSeller: form.isBestSeller,
      stock: Number(form.stock),
    };
    try {
      if (isEdit) {
        await updateGadget(id, payload);
        window.alert('Updated successfully');
      } else {
        await createGadget(payload);
        window.alert('Added successfully');
      }
      navigate(´/@{ROLL}/manage´);
    } catch {
      setErrors({ form: 'Save failed. Please try again.' });
    }
  };

  if (notFound) return <Container><Alert variant="danger">Gadget not found</Alert></Container>;

  // một ô nhập + câu lỗi của nó (React-Bootstrap: isInvalid ⇒ class is-invalid, Feedback hiện chữ)
  const field = (name, label, props = {}) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} value={form[name]} onChange={handleChange} isInvalid={!!errors[name]} {...props} />
      <Form.Control.Feedback type="invalid" id={´err-@{name}´}>{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Container style={{ maxWidth: 640 }}>
      <Card>
        <Card.Body>
          <Card.Title>{isEdit ? 'Edit Gadget' : 'Add Gadget'}</Card.Title>
          {errors.form && <Alert variant="danger">{errors.form}</Alert>}
          <Form id="gadget-form" noValidate onSubmit={handleSubmit}>
            {field('gadgetName', 'Gadget name')}
            {field('brandName', 'Brand name')}
            {field('imageUrl', 'Image URL', { placeholder: 'https://...' })}
            {field('priceK', 'Price (thousand VND)', { type: 'number' })}
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange} isInvalid={!!errors.category}>
                <option value="">-- Choose a category --</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid" id="err-category">{errors.category}</Form.Control.Feedback>
            </Form.Group>
            {field('stock', 'Stock', { type: 'number' })}
            <Form.Check
              className="mb-3"
              type="switch"
              id="isBestSeller"
              name="isBestSeller"
              label="Best seller"
              checked={form.isBestSeller}
              onChange={handleChange}
            />
            <Button type="submit" id="btn-save">{isEdit ? 'Update' : 'Add'}</Button>{' '}
            <Link to={´/@{ROLL}/manage´} className="btn btn-link">Back to list</Link>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
`;

// ═════════════════════════════════════ STARTER ═════════════════════════════════════
const S_CONFIG = `// src/config.js — STARTER
// TODO: đọc từ .env (import.meta.env.VITE_API_URL). Viết cứng URL ở đây = 0 điểm cả bài.
export const API_URL = 'http://localhost:9999';
export const ROLL = '${ROLL}';
export const CATEGORIES = ['Phone', 'Laptop', 'Tablet', 'Audio', 'Wearable'];
`;
const S_API = `// src/services/gadgetApi.js — STARTER
import axios from 'axios';
import { API_URL } from '../config';

export const getAllGadgets = async () => (await axios.get(´@{API_URL}/gadgets´)).data;
// TODO: getGadget(id) · createGadget(g) · updateGadget(id, g) · deleteGadget(id)
export const getGadget = async () => null;
export const createGadget = async () => null;
export const updateGadget = async () => null;
export const deleteGadget = async () => null;
`;
const S_FORMAT = `// src/utils/format.js — STARTER
export function formatVnd(priceK) {
  // TODO: 28990 ⇒ "28,990,000 VND"
  return String(priceK);
}
`;
const S_VALIDATE = `// src/utils/validateGadget.js — STARTER
export default function validateGadget(form) {
  // TODO: trả về { gadgetName?: '...', brandName?: '...', imageUrl?: '...', priceK?: '...', category?: '...', stock?: '...' }
  return {};
}
`;
const S_COLLECTION = `// src/pages/GadgetCollection.js — STARTER (Câu 1)
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { getAllGadgets } from '../services/gadgetApi';

export default function GadgetCollection() {
  const [gadgets, setGadgets] = useState([]);
  useEffect(() => {
    getAllGadgets().then(setGadgets);
  }, []);
  // TODO: lưới thẻ .gadget-card (4 thẻ/hàng), sắp giá giảm dần, formatVnd, Best Seller / Sold out, lọc .cat-btn + #only-best
  return (
    <Container>
      <h2>Gadget Collection</h2>
      <ul>
        {gadgets.map((g) => <li key={g.id}>{g.gadgetName}</li>)}
      </ul>
    </Container>
  );
}
`;
const S_MANAGEMENT = `// src/pages/GadgetManagement.js — STARTER (Câu 2)
import { Container } from 'react-bootstrap';

export default function GadgetManagement() {
  // TODO: bảng #gadget-table (id tăng dần), ảnh .thumb 70×70, .btn-edit, .btn-delete (confirm), #btn-add
  return (
    <Container>
      <h2>Gadget Management</h2>
    </Container>
  );
}
`;
const S_FORM = `// src/pages/GadgetForm.js — STARTER (Câu 3): dùng cho cả /add và /edit/:id
import { Container } from 'react-bootstrap';

export default function GadgetForm() {
  // TODO: form #gadget-form, ô #gadgetName #brandName #imageUrl #priceK #category #stock + công tắc #isBestSeller,
  //       lỗi trong #err-<tên ô>, POST (thêm) / PUT (sửa), alert rồi về /${ROLL}/manage
  return (
    <Container>
      <h2>Gadget form</h2>
    </Container>
  );
}
`;

const INDEX = index({ bootstrap: true, router: true });
const CHUNG = { 'src/App.js': APP, 'src/components/AppNavbar.js': NAVBAR, 'src/index.js': INDEX, 'database.json': DB_JSON };
const LOI_GIAI = {
  'src/pages/GadgetCollection.js': COLLECTION, 'src/pages/GadgetManagement.js': MANAGEMENT, 'src/pages/GadgetForm.js': FORM,
  'src/services/gadgetApi.js': API, 'src/utils/validateGadget.js': VALIDATE, 'src/utils/format.js': FORMAT, 'src/config.js': CONFIG,
  ...CHUNG, '.env': 'VITE_API_URL=http://localhost:9999\n',
};
const KHOI_DAU = {
  'src/pages/GadgetCollection.js': S_COLLECTION, 'src/pages/GadgetManagement.js': S_MANAGEMENT, 'src/pages/GadgetForm.js': S_FORM,
  'src/services/gadgetApi.js': S_API, 'src/utils/validateGadget.js': S_VALIDATE, 'src/utils/format.js': S_FORMAT, 'src/config.js': S_CONFIG,
  ...CHUNG, '.env': 'VITE_API_URL=\n',
};

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const P = `/${ROLL}`;
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector) => ({ hanhDong: 'click', selector });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const gui = { hanhDong: 'gui', selector: '#gadget-form' };
const BY_PRICE = ['Legion 5', 'iPhone 16 Pro', 'MacBook Air M4', 'Galaxy S25', 'Galaxy Tab S10', 'Forerunner 265', 'WH-1000XM6', 'Galaxy Watch 8', 'AirPods Pro 3', 'Redmi Pad 2'];
const dienForm = (o) => [
  cho(150),
  ...(o.name != null ? [nhap('#gadgetName', o.name)] : []),
  ...(o.brand != null ? [nhap('#brandName', o.brand)] : []),
  ...(o.url != null ? [nhap('#imageUrl', o.url)] : []),
  ...(o.price != null ? [nhap('#priceK', o.price)] : []),
  ...(o.cat != null ? [doi('#category', o.cat)] : []),
  ...(o.stock != null ? [nhap('#stock', o.stock)] : []),
  ...(o.best ? [{ hanhDong: 'chon-o', selector: '#isBestSeller' }] : []),
  gui, cho(),
];
const HOP_LE = { name: 'Pixel 10', brand: 'Google LLC', url: 'https://api.dicebear.com/9.x/icons/svg?seed=pixel10', price: '19990', cat: 'Phone', stock: '7', best: true };
const THEM = dienForm(HOP_LE);
const SUA = [cho(250), nhap('#gadgetName', 'WH-1000XM6 Silver'), nhap('#priceK', '9490'), gui, cho()];

const KIEM = [
  // f1 — Collection
  { nhom: 'f1', moTa: '"/" redirects to /se123456/gadgets', url: '/', kiem: 'duong-dan', giaTri: `${P}/gadgets` },
  { nhom: 'f1', moTa: '10 gadget cards', kiem: 'so-luong', selector: '.gadget-card', giaTri: 10 },
  { nhom: 'f1', moTa: 'Sorted by price, highest first', kiem: 'danh-sach-text', selector: '.gadget-name', mongDoi: BY_PRICE },
  { nhom: 'f1', moTa: 'Each card has an image with alt = gadget name', kiem: 'thuoc-tinh', selector: '#gadget-7 img', thuocTinh: 'alt', giaTri: 'Legion 5' },
  { nhom: 'f1', moTa: 'API URL comes from .env (VITE_API_URL)', kiem: 'ma-nguon', khop: 'import\\.meta\\.env\\.VITE_API_URL|process\\.env\\.REACT_APP_API_URL' },
  { nhom: 'f1', moTa: '.env sets VITE_API_URL=http://localhost:9999', kiem: 'ma-nguon', tep: '.env', khop: 'VITE_API_URL\\s*=\\s*http://localhost:9999' },
  { nhom: 'f1', an: true, moTa: 'Navbar links #nav-collection / #nav-management', kiem: 'so-luong', selector: '#nav-collection, #nav-management', giaTri: 2 },
  { nhom: 'f1', an: true, moTa: 'Data is fetched from GET /gadgets', kiem: 'goi-fetch', khop: `^GET ${B}/gadgets$` },
  // f2 — Price + labels
  { nhom: 'f2', moTa: 'Price formatted "32,990,000 VND"', kiem: 'text', selector: '#gadget-7 .gadget-price', giaTri: '32,990,000 VND' },
  { nhom: 'f2', moTa: '4 "Best Seller" badges', kiem: 'so-luong', selector: '.best-seller', giaTri: 4 },
  { nhom: 'f2', moTa: '"Sold out" on stock 0 (gadgets 2 and 8)', kiem: 'so-luong', selector: '#gadget-2 .sold-out, #gadget-8 .sold-out', giaTri: 2 },
  { nhom: 'f2', an: true, moTa: 'Only stock-0 gadgets are "Sold out"', kiem: 'so-luong', selector: '.sold-out', giaTri: 2 },
  // f3 — Filters
  { nhom: 'f3', moTa: 'Category buttons from data: All + 5 sorted', kiem: 'danh-sach-text', selector: '.cat-btn', mongDoi: ['All', 'Audio', 'Laptop', 'Phone', 'Tablet', 'Wearable'] },
  { nhom: 'f3', moTa: '#cat-Laptop ⇒ 2 laptops', kiem: 'danh-sach-text', selector: '.gadget-name', mongDoi: ['Legion 5', 'MacBook Air M4'], truoc: [cho(150), click('#cat-Laptop')] },
  { nhom: 'f3', moTa: 'Selected button has class active', kiem: 'text', selector: '.cat-btn.active', giaTri: 'Laptop', truoc: [cho(150), click('#cat-Laptop')] },
  { nhom: 'f3', moTa: '#only-best ⇒ 4 best sellers, "4 gadgets"', kiem: 'text', selector: '#gadget-count', khop: '^4 gadgets$', truoc: [cho(150), { hanhDong: 'chon-o', selector: '#only-best' }] },
  { nhom: 'f3', an: true, moTa: 'Audio + best sellers combine', kiem: 'danh-sach-text', selector: '.gadget-name', mongDoi: ['WH-1000XM6', 'AirPods Pro 3'], truoc: [cho(150), click('#cat-Audio'), { hanhDong: 'chon-o', selector: '#only-best' }] },
  // f4 — Management table
  { nhom: 'f4', moTa: '#gadget-table has 10 rows, id ascending', url: `${P}/manage`, kiem: 'danh-sach-text', selector: '#gadget-table tbody tr td:first-child', mongDoi: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { nhom: 'f4', moTa: 'Thumbnails are 70 × 70 px', url: `${P}/manage`, kiem: 'kich-thuoc', selector: '#gadget-table img.thumb', thuocTinh: 'width', giaTri: 70 },
  { nhom: 'f4', moTa: 'Each row has .btn-edit and .btn-delete', url: `${P}/manage`, kiem: 'so-luong', selector: '#gadget-table .btn-edit, #gadget-table .btn-delete', giaTri: 20 },
  { nhom: 'f4', moTa: 'Edit navigates to /se123456/edit/4', url: `${P}/manage`, kiem: 'duong-dan', giaTri: `${P}/edit/4`, truoc: [cho(150), click('#gadget-row-4 .btn-edit')] },
  { nhom: 'f4', an: true, moTa: 'Thumbnail height is 70 px too', url: `${P}/manage`, kiem: 'kich-thuoc', selector: '#gadget-table img.thumb', thuocTinh: 'height', giaTri: 70 },
  { nhom: 'f4', an: true, moTa: '#btn-add goes to /se123456/add', url: `${P}/manage`, kiem: 'duong-dan', giaTri: `${P}/add`, truoc: [cho(150), click('#btn-add')] },
  // f5 — Delete
  { nhom: 'f5', moTa: 'Delete (confirmed) removes the gadget on the server', url: `${P}/manage`, kiem: 'du-lieu-server', bang: 'gadgets', khongChua: { id: 2 }, truoc: [cho(150), click('#gadget-row-2 .btn-delete'), cho()] },
  { nhom: 'f5', moTa: 'The list reloads with 9 rows', url: `${P}/manage`, kiem: 'so-luong', selector: '#gadget-table tbody tr', giaTri: 9, truoc: [cho(150), click('#gadget-row-2 .btn-delete'), cho()] },
  { nhom: 'f5', an: true, moTa: 'Cancel in the confirm box ⇒ nothing is deleted', url: `${P}/manage`, confirm: false, kiem: 'goi-fetch', khop: '^DELETE', min: 0, max: 0, truoc: [cho(150), click('#gadget-row-2 .btn-delete'), cho()] },
  { nhom: 'f5', an: true, moTa: 'The user is notified (alert/toast)', kiem: 'ma-nguon', khop: '\\balert\\s*\\(|toast' },
  // f6 — Form page
  { nhom: 'f6', moTa: 'Add page has every field', url: `${P}/add`, kiem: 'so-luong', selector: '#gadgetName, #brandName, #imageUrl, #priceK, #category, #stock, #isBestSeller', giaTri: 7 },
  { nhom: 'f6', moTa: 'Category has an empty default and 5 options', url: `${P}/add`, kiem: 'so-luong', selector: '#category option', giaTri: 6 },
  { nhom: 'f6', moTa: 'Best seller is a switch, off by default', url: `${P}/add`, kiem: 'thuoc-tinh-js', selector: '#isBestSeller', thuocTinh: 'checked', giaTri: false },
  { nhom: 'f6', an: true, moTa: 'The switch uses .form-switch', url: `${P}/add`, kiem: 'ton-tai', selector: '.form-switch #isBestSeller' },
  { nhom: 'f6', an: true, moTa: 'Category default value is ""', url: `${P}/add`, kiem: 'thuoc-tinh-js', selector: '#category', thuocTinh: 'value', giaTri: '' },
  // f7 — Validation
  { nhom: 'f7', moTa: 'Empty form ⇒ 5 invalid fields (.is-invalid)', url: `${P}/add`, kiem: 'so-luong', selector: '.is-invalid', giaTri: 5, truoc: dienForm({}) },
  { nhom: 'f7', moTa: 'Name "TV" ⇒ "Name must be at least 3 characters"', url: `${P}/add`, kiem: 'text', selector: '#err-gadgetName', giaTri: 'Name must be at least 3 characters', truoc: dienForm({ ...HOP_LE, best: false, name: 'TV' }) },
  { nhom: 'f7', moTa: 'Brand "Apple" ⇒ "Brand must contain at least 2 words"', url: `${P}/add`, kiem: 'text', selector: '#err-brandName', giaTri: 'Brand must contain at least 2 words', truoc: dienForm({ ...HOP_LE, best: false, brand: 'Apple' }) },
  { nhom: 'f7', moTa: 'Bad URL ⇒ "Image URL must be a valid URL"', url: `${P}/add`, kiem: 'text', selector: '#err-imageUrl', giaTri: 'Image URL must be a valid URL', truoc: dienForm({ ...HOP_LE, best: false, url: 'not a url' }) },
  { nhom: 'f7', moTa: 'Price 123456 ⇒ price error', url: `${P}/add`, kiem: 'text', selector: '#err-priceK', giaTri: 'Price must be a positive integer (max 5 digits)', truoc: dienForm({ ...HOP_LE, best: false, price: '123456' }) },
  { nhom: 'f7', moTa: 'No category ⇒ "Please choose a category"', url: `${P}/add`, kiem: 'text', selector: '#err-category', giaTri: 'Please choose a category', truoc: dienForm({ ...HOP_LE, best: false, cat: null }) },
  { nhom: 'f7', an: true, moTa: 'Price 0 is rejected', url: `${P}/add`, kiem: 'ton-tai', selector: '#priceK.is-invalid', truoc: dienForm({ ...HOP_LE, best: false, price: '0' }) },
  { nhom: 'f7', an: true, moTa: 'Price 12.5 is rejected', url: `${P}/add`, kiem: 'ton-tai', selector: '#priceK.is-invalid', truoc: dienForm({ ...HOP_LE, best: false, price: '12.5' }) },
  { nhom: 'f7', an: true, moTa: 'ftp:// URL is rejected', url: `${P}/add`, kiem: 'ton-tai', selector: '#imageUrl.is-invalid', truoc: dienForm({ ...HOP_LE, best: false, url: 'ftp://files.example.com/a.png' }) },
  { nhom: 'f7', an: true, moTa: 'Negative stock is rejected', url: `${P}/add`, kiem: 'text', selector: '#err-stock', giaTri: 'Stock must be a whole number (0 or more)', truoc: dienForm({ ...HOP_LE, best: false, stock: '-1' }) },
  { nhom: 'f7', an: true, moTa: 'Invalid form sends no POST and does not reload', url: `${P}/add`, kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0, truoc: dienForm({ ...HOP_LE, best: false, brand: 'Apple' }) },
  { nhom: 'f7', an: true, moTa: 'Price 99999 (5 digits) is accepted', url: `${P}/add`, kiem: 'khong-ton-tai', selector: '.is-invalid', truoc: dienForm({ ...HOP_LE, best: false, price: '99999' }) },
  // f8 — Add
  { nhom: 'f8', moTa: 'Valid form ⇒ POST /gadgets with the right types', url: `${P}/add`, kiem: 'du-lieu-server', bang: 'gadgets', chua: { gadgetName: 'Pixel 10', brandName: 'Google LLC', category: 'Phone', priceK: 19990, isBestSeller: true, stock: 7 }, truoc: THEM },
  { nhom: 'f8', moTa: 'Then back to /se123456/manage', url: `${P}/add`, kiem: 'duong-dan', giaTri: `${P}/manage`, truoc: THEM },
  { nhom: 'f8', moTa: 'The table now has 11 rows', url: `${P}/add`, kiem: 'so-luong', selector: '#gadget-table tbody tr', giaTri: 11, truoc: THEM },
  { nhom: 'f8', an: true, moTa: 'Body sends priceK/stock as numbers and the switch as a boolean (strict types)', url: `${P}/add`, kiem: 'goi-fetch', khop: `^POST ${B}/gadgets$`, than: { priceK: 19990, stock: 7, isBestSeller: true }, chat: true, truoc: THEM },
  { nhom: 'f8', an: true, moTa: 'Submitting does not reload the page', url: `${P}/add`, kiem: 'khong-tai-lai', truoc: THEM },
  // f9 — Edit
  { nhom: 'f9', moTa: 'Edit form is pre-filled', url: `${P}/edit/4`, kiem: 'thuoc-tinh-js', selector: '#gadgetName', thuocTinh: 'value', giaTri: 'WH-1000XM6' },
  { nhom: 'f9', moTa: 'Pre-filled switch and category', url: `${P}/edit/4`, kiem: 'thuoc-tinh-js', selector: '#isBestSeller', thuocTinh: 'checked', giaTri: true },
  { nhom: 'f9', moTa: 'Update ⇒ PUT /gadgets/4 saves the new data', url: `${P}/edit/4`, kiem: 'du-lieu-server', bang: 'gadgets', chua: { id: 4, gadgetName: 'WH-1000XM6 Silver', priceK: 9490, category: 'Audio', isBestSeller: true }, truoc: SUA },
  { nhom: 'f9', moTa: 'The table shows the updated name', url: `${P}/edit/4`, kiem: 'text', selector: '#gadget-row-4 .g-name', giaTri: 'WH-1000XM6 Silver', truoc: SUA },
  { nhom: 'f9', an: true, moTa: 'Edit uses PUT (not POST)', url: `${P}/edit/4`, kiem: 'goi-fetch', khop: `^PUT ${B}/gadgets/4$`, truoc: SUA },
  { nhom: 'f9', an: true, moTa: 'Pre-filled category is "Audio"', url: `${P}/edit/4`, kiem: 'thuoc-tinh-js', selector: '#category', thuocTinh: 'value', giaTri: 'Audio' },
  { nhom: 'f9', an: true, moTa: 'Same validation in edit mode', url: `${P}/edit/4`, kiem: 'ton-tai', selector: '#brandName.is-invalid', truoc: [cho(250), nhap('#brandName', 'Sony'), gui, cho()] },
];

// ═════════════════════════════════════ ĐỀ (bản in) ═════════════════════════════════════
const BAN_IN = {
  tieuDe: { en: 'PE PRACTICE 2 — Gadget Store Management', vi: 'LUYỆN PE 2 — Quản lý cửa hàng thiết bị' },
  phu: {
    en: 'FER202 · Practical Exam practice (PE 20060701 format) · Duration: 85 minutes · Total: 10 marks · Vite + axios + React-Bootstrap',
    vi: 'FER202 · Luyện thi thực hành (dạng PE 20060701) · Thời gian: 85 phút · Tổng: 10 điểm · Vite + axios + React-Bootstrap',
  },
  moTa: {
    en: `<p>Build the front-end of a gadget shop. The data resource <code>gadgets</code> is served by json-server (in the real exam it may be <b>mockapi.io</b> — the code is the same) at the URL stored in <code>.env</code>. Your roll number for this paper is <b><code>${ROLL}</code></b>: <b>every route starts with <code>/${ROLL}</code></b>.</p><p>Task 1 shows the collection as cards; Task 2 is an admin table with delete; Task 3 is one form used for both adding and editing a gadget, with full validation.</p>`,
    vi: `<p>Làm giao diện cho một cửa hàng thiết bị. Tài nguyên <code>gadgets</code> do json-server phục vụ (thi thật có thể là <b>mockapi.io</b> — mã như nhau) ở địa chỉ lưu trong <code>.env</code>. Mã sinh viên của đề này là <b><code>${ROLL}</code></b>: <b>mọi route bắt đầu bằng <code>/${ROLL}</code></b>.</p><p>Câu 1 hiện bộ sưu tập dạng thẻ; Câu 2 là bảng quản trị có xoá; Câu 3 là MỘT form dùng cho cả thêm và sửa, kiểm hợp lệ đầy đủ.</p>`,
  },
  chucNangChinh: [
    { en: `Task 1 (3 marks) — <code>/${ROLL}/gadgets</code>: card grid, price sort, VND format, labels, filters.`, vi: `Câu 1 (3 điểm) — <code>/${ROLL}/gadgets</code>: lưới thẻ, sắp theo giá, định dạng VND, nhãn, bộ lọc.` },
    { en: `Task 2 (2.5 marks) — <code>/${ROLL}/manage</code>: table, 70×70 thumbnails, edit/delete, add button.`, vi: `Câu 2 (2,5 điểm) — <code>/${ROLL}/manage</code>: bảng, ảnh 70×70, sửa/xoá, nút thêm.` },
    { en: `Task 3 (4.5 marks) — <code>/${ROLL}/add</code> and <code>/${ROLL}/edit/:id</code>: one form, validation, POST / PUT.`, vi: `Câu 3 (4,5 điểm) — <code>/${ROLL}/add</code> và <code>/${ROLL}/edit/:id</code>: một form, kiểm hợp lệ, POST / PUT.` },
  ],
  yeuCauChung: [
    { en: 'The API URL lives in <code>.env</code> as <code>VITE_API_URL</code> and is read with <code>import.meta.env.VITE_API_URL</code> — hard-coding it = 0 for the whole paper.', vi: 'Địa chỉ API nằm trong <code>.env</code> tên <code>VITE_API_URL</code>, đọc bằng <code>import.meta.env.VITE_API_URL</code> — viết cứng = 0 điểm cả bài.' },
    { en: 'Use <b>axios</b> for HTTP and <b>React-Bootstrap</b> (or Bootstrap classes) for the UI.', vi: 'Dùng <b>axios</b> cho HTTP và <b>React-Bootstrap</b> (hoặc class Bootstrap) cho giao diện.' },
    { en: 'Formik/Yup are optional in the real exam; in Code Lab write the validation by hand (they are not installed here).', vi: 'Formik/Yup là tuỳ chọn khi thi thật; trong Code Lab hãy tự viết phần kiểm (ở đây không cài hai thư viện đó).' },
    { en: 'Send numbers as numbers (<code>priceK</code>, <code>stock</code>) and the switch as a boolean.', vi: 'Gửi số đúng kiểu số (<code>priceK</code>, <code>stock</code>) và công tắc là boolean.' },
    { en: 'Keep the ids / classes of section 6 — the auto-grader relies on them.', vi: 'Giữ đúng id / class ở mục 6 — máy chấm dựa vào chúng.' },
  ],
  cayThuMuc: `
database.json                  # given (json-server --port 9999)
.env                           # VITE_API_URL=http://localhost:9999
src/
├── config.js                  # API_URL (from .env) · ROLL · CATEGORIES
├── services/
│   └── gadgetApi.js           # axios: getAll · getOne · create · update · delete
├── utils/
│   ├── format.js              # formatVnd
│   └── validateGadget.js      # validation rules → { field: message }
├── components/
│   └── AppNavbar.js
├── pages/
│   ├── GadgetCollection.js    # Task 1
│   ├── GadgetManagement.js    # Task 2
│   └── GadgetForm.js          # Task 3 (add + edit)
├── App.js
└── index.js`,
  wireframe: `
+------------------------------------------------------------------------------+
| Gadget Store   Gadget Collection   Gadget Management                         |
+------------------------------------------------------------------------------+
| Gadget Collection                                                            |
| [All][Audio][Laptop][Phone][Tablet][Wearable]   (o) Best sellers only  10 gadgets
| +---------------+ +---------------+ +---------------+ +---------------+      |
| |   [ image ]   | |   [ image ]   | |   [ image ]   | |   [ image ]   |      |
| | Legion 5      | | iPhone 16 Pro | | MacBook Air M4| | Galaxy S25    |      |
| | Lenovo Group  | | Apple Inc ·   | | Apple Inc ·   | | Samsung ...   |      |
| | 32,990,000 VND| | 28,990,000 VND| | 27,490,000 VND| | 22,990,000 VND|      |
| |               | | [Best Seller] | |               | | [Best Seller] |      |
| |               | |               | |               | | [Sold out]    |      |
| +---------------+ +---------------+ +---------------+ +---------------+      |
+------------------------------------------------------------------------------+
| Gadget Management                                         [+ Add Gadget]    |
| ID | Name          | Brand      | Category | Image   | Actions               |
| 1  | iPhone 16 Pro | Apple Inc  | Phone    | [70x70] | [Edit] [Delete]       |
+------------------------------------------------------------------------------+`,
  moHinh: {
    ten: 'gadgets',
    truong: [
      ['id', 'number', { en: 'generated by the server', vi: 'máy chủ tự sinh' }],
      ['gadgetName', 'string', { en: '≥ 3 characters', vi: '≥ 3 ký tự' }],
      ['brandName', 'string', { en: '≥ 2 words (e.g. "Apple Inc")', vi: '≥ 2 từ (vd "Apple Inc")' }],
      ['category', "'Phone' | 'Laptop' | 'Tablet' | 'Audio' | 'Wearable'", ''],
      ['imageUrl', 'string (URL)', { en: 'http(s) URL', vi: 'URL http(s)' }],
      ['priceK', 'number', { en: 'price in THOUSANDS of VND; positive integer ≤ 5 digits', vi: 'giá theo NGHÌN đồng; số nguyên dương ≤ 5 chữ số' }],
      ['isBestSeller', 'boolean', ''],
      ['stock', 'number', { en: 'integer ≥ 0; 0 ⇒ "Sold out"', vi: 'số nguyên ≥ 0; 0 ⇒ "Sold out"' }],
    ],
  },
  duLieuMau: `
{ "id": 7, "gadgetName": "Legion 5", "brandName": "Lenovo Group", "category": "Laptop",
  "imageUrl": "https://api.dicebear.com/9.x/icons/svg?seed=legion5", "priceK": 32990,
  "isBestSeller": false, "stock": 2 }
... 10 records — see database.json`,
  chucNang: [
    {
      ten: { en: 'T1 · Collection page', vi: 'C1 · Trang bộ sưu tập' }, diem: 1.5,
      yeuCau: [
        { en: `Navbar links <code>#nav-collection</code> and <code>#nav-management</code>; <code>/</code> redirects to <code>/${ROLL}/gadgets</code>.`, vi: `Navbar có <code>#nav-collection</code> và <code>#nav-management</code>; <code>/</code> chuyển tới <code>/${ROLL}/gadgets</code>.` },
        { en: 'Fetch all gadgets; show them as cards <code>#gadget-{id}.gadget-card</code>, <b>4 per row</b> on large screens.', vi: 'Tải mọi gadget; hiện dạng thẻ <code>#gadget-{id}.gadget-card</code>, <b>4 thẻ một hàng</b> ở màn hình lớn.' },
        { en: 'Sort by <code>priceK</code> <b>descending</b> (same price ⇒ name A → Z).', vi: 'Sắp theo <code>priceK</code> <b>giảm dần</b> (cùng giá ⇒ tên A → Z).' },
        { en: 'Each card: image (<code>alt</code> = name), <code>.gadget-name</code>, brand · category, <code>.gadget-price</code>.', vi: 'Mỗi thẻ: ảnh (<code>alt</code> = tên), <code>.gadget-name</code>, hãng · loại, <code>.gadget-price</code>.' },
      ],
      hook: ['useEffect', 'axios.get'],
    },
    {
      ten: { en: 'T1 · Price format & labels', vi: 'C1 · Định dạng giá & nhãn' }, diem: 0.5,
      yeuCau: [
        { en: '<code>priceK</code> is in thousands: <code>32990</code> ⇒ <code>32,990,000 VND</code>.', vi: '<code>priceK</code> tính theo nghìn: <code>32990</code> ⇒ <code>32,990,000 VND</code>.' },
        { en: '<code>isBestSeller</code> ⇒ badge <code>.best-seller</code> "Best Seller"; <code>stock</code> 0 ⇒ badge <code>.sold-out</code> "Sold out".', vi: '<code>isBestSeller</code> ⇒ badge <code>.best-seller</code> "Best Seller"; <code>stock</code> = 0 ⇒ badge <code>.sold-out</code> "Sold out".' },
      ],
    },
    {
      ten: { en: 'T1 · Filters', vi: 'C1 · Bộ lọc' }, diem: 1,
      yeuCau: [
        { en: 'Buttons <code>.cat-btn</code> with id <code>cat-{Category}</code>: <code>All</code> + categories from the data, A → Z; the selected one has class <code>active</code>.', vi: 'Nút <code>.cat-btn</code> id <code>cat-{Category}</code>: <code>All</code> + các loại lấy từ dữ liệu, A → Z; nút đang chọn có class <code>active</code>.' },
        { en: 'Switch <code>#only-best</code> "Best sellers only". Both filters combine; <code>#gadget-count</code> reads <code>N gadgets</code>.', vi: 'Công tắc <code>#only-best</code> "Best sellers only". Hai bộ lọc kết hợp; <code>#gadget-count</code> ghi <code>N gadgets</code>.' },
      ],
      hook: ['useMemo', 'useState'],
      viDu: { en: 'Audio + Best sellers only ⇒ WH-1000XM6, AirPods Pro 3 (2 gadgets)', vi: 'Audio + Best sellers only ⇒ WH-1000XM6, AirPods Pro 3 (2 gadgets)' },
    },
    {
      ten: { en: 'T2 · Management table', vi: 'C2 · Bảng quản lý' }, diem: 1.5,
      yeuCau: [
        { en: `Route <code>/${ROLL}/manage</code>. Table <code>#gadget-table</code>: <code>ID | Name | Brand | Category | Image | Actions</code>, rows <code>#gadget-row-{id}</code> sorted by id <b>ascending</b>, name cell <code>.g-name</code>.`, vi: `Route <code>/${ROLL}/manage</code>. Bảng <code>#gadget-table</code>: <code>ID | Name | Brand | Category | Image | Actions</code>, hàng <code>#gadget-row-{id}</code> theo id <b>tăng dần</b>, ô tên <code>.g-name</code>.` },
        { en: 'Image as a <b>70 × 70 px</b> thumbnail <code>img.thumb</code>.', vi: 'Ảnh là ảnh nhỏ <b>70 × 70 px</b> <code>img.thumb</code>.' },
        { en: `Each row: <code>.btn-edit</code> (→ <code>/${ROLL}/edit/{id}</code>) and <code>.btn-delete</code>. Link <code>#btn-add</code> → <code>/${ROLL}/add</code>.`, vi: `Mỗi hàng: <code>.btn-edit</code> (→ <code>/${ROLL}/edit/{id}</code>) và <code>.btn-delete</code>. Link <code>#btn-add</code> → <code>/${ROLL}/add</code>.` },
      ],
      hook: ['useCallback', 'useNavigate'],
    },
    {
      ten: { en: 'T2 · Delete', vi: 'C2 · Xoá' }, diem: 1,
      yeuCau: [
        { en: 'Ask with <code>window.confirm</code> first; Cancel ⇒ nothing happens.', vi: 'Hỏi bằng <code>window.confirm</code> trước; bấm Cancel ⇒ không làm gì.' },
        { en: '<code>DELETE /gadgets/:id</code>, notify the user (alert/toast), then <b>reload the list</b> from the API.', vi: '<code>DELETE /gadgets/:id</code>, báo người dùng (alert/toast), rồi <b>tải lại danh sách</b> từ API.' },
      ],
    },
    {
      ten: { en: 'T3 · Form page', vi: 'C3 · Trang form' }, diem: 1,
      yeuCau: [
        { en: 'Form <code>#gadget-form</code> with <code>#gadgetName</code>, <code>#brandName</code>, <code>#imageUrl</code>, <code>#priceK</code>, <code>#category</code>, <code>#stock</code> (default 0), switch <code>#isBestSeller</code> (React-Bootstrap <code>type="switch"</code>, default off), submit <code>#btn-save</code>.', vi: 'Form <code>#gadget-form</code> gồm <code>#gadgetName</code>, <code>#brandName</code>, <code>#imageUrl</code>, <code>#priceK</code>, <code>#category</code>, <code>#stock</code> (mặc định 0), công tắc <code>#isBestSeller</code> (React-Bootstrap <code>type="switch"</code>, mặc định tắt), nút gửi <code>#btn-save</code>.' },
        { en: '<code>#category</code> starts on an empty option (value "") followed by Phone, Laptop, Tablet, Audio, Wearable.', vi: '<code>#category</code> bắt đầu ở lựa chọn rỗng (value "") rồi Phone, Laptop, Tablet, Audio, Wearable.' },
      ],
      hook: ['controlled form'],
    },
    {
      ten: { en: 'T3 · Validation', vi: 'C3 · Kiểm hợp lệ' }, diem: 1.5,
      moTa: { en: 'Validate <b>all</b> fields on submit; mark each invalid field with <code>is-invalid</code> and show its message in <code>#err-{field}</code>.', vi: 'Kiểm <b>mọi</b> ô khi gửi; ô sai có class <code>is-invalid</code> và câu lỗi nằm trong <code>#err-{tên ô}</code>.' },
      yeuCau: [
        { en: 'name ≥ 3 chars ⇒ <code>Name must be at least 3 characters</code>', vi: 'tên ≥ 3 ký tự ⇒ <code>Name must be at least 3 characters</code>' },
        { en: 'brand ≥ 2 words ⇒ <code>Brand must contain at least 2 words</code>', vi: 'hãng ≥ 2 từ ⇒ <code>Brand must contain at least 2 words</code>' },
        { en: 'http(s) URL ⇒ <code>Image URL must be a valid URL</code>', vi: 'URL http(s) ⇒ <code>Image URL must be a valid URL</code>' },
        { en: 'positive integer, at most 5 digits ⇒ <code>Price must be a positive integer (max 5 digits)</code>', vi: 'số nguyên dương, tối đa 5 chữ số ⇒ <code>Price must be a positive integer (max 5 digits)</code>' },
        { en: 'one of the 5 categories ⇒ <code>Please choose a category</code>', vi: 'một trong 5 loại ⇒ <code>Please choose a category</code>' },
        { en: 'stock integer ≥ 0 ⇒ <code>Stock must be a whole number (0 or more)</code>', vi: 'tồn kho nguyên ≥ 0 ⇒ <code>Stock must be a whole number (0 or more)</code>' },
      ],
      hook: ['e.preventDefault()', 'isInvalid + Form.Control.Feedback'],
    },
    {
      ten: { en: 'T3 · Add', vi: 'C3 · Thêm' }, diem: 1,
      yeuCau: [
        { en: '<code>POST /gadgets</code> (numbers as numbers), alert <code>Added successfully</code>, navigate to the management page — the new row is visible.', vi: '<code>POST /gadgets</code> (số đúng kiểu số), alert <code>Added successfully</code>, về trang quản lý — thấy hàng mới.' },
      ],
      hook: ['useNavigate'],
    },
    {
      ten: { en: 'T3 · Edit', vi: 'C3 · Sửa' }, diem: 1,
      yeuCau: [
        { en: `<code>/${ROLL}/edit/:id</code> pre-fills the form from <code>GET /gadgets/:id</code> (same component as Add).`, vi: `<code>/${ROLL}/edit/:id</code> điền sẵn form từ <code>GET /gadgets/:id</code> (cùng component với Thêm).` },
        { en: 'Same validation; <code>PUT /gadgets/:id</code>; alert <code>Updated successfully</code>; the table shows the new data.', vi: 'Cùng luật kiểm; <code>PUT /gadgets/:id</code>; alert <code>Updated successfully</code>; bảng hiện dữ liệu mới.' },
      ],
      hook: ['useParams', 'useEffect'],
    },
  ],
  idBatBuoc: [
    ['#nav-collection · #nav-management', { en: 'navbar', vi: 'navbar' }],
    ['#gadget-{id}.gadget-card · .gadget-name · .gadget-price · .best-seller · .sold-out', { en: 'collection cards', vi: 'thẻ bộ sưu tập' }],
    ['.cat-btn#cat-{Category} · #only-best · #gadget-count', { en: 'filters', vi: 'bộ lọc' }],
    ['#gadget-table · #gadget-row-{id} · .g-name · img.thumb · .btn-edit · .btn-delete · #btn-add', { en: 'management page', vi: 'trang quản lý' }],
    ['#gadget-form · #gadgetName · #brandName · #imageUrl · #priceK · #category · #stock · #isBestSeller · #btn-save · #err-{field}', { en: 'add / edit form', vi: 'form thêm / sửa' }],
  ],
  truDiem: [
    { en: 'Route without the roll number (e.g. <code>/gadgets</code>) — that task is 0.', vi: 'Route thiếu mã sinh viên (vd <code>/gadgets</code>) — câu đó 0 điểm.' },
    { en: '<code>priceK</code> sent as a string <code>"19990"</code> — later sorting by price breaks.', vi: 'Gửi <code>priceK</code> dạng chuỗi <code>"19990"</code> — sau đó sắp theo giá bị sai.' },
    { en: 'Two separate forms for add and edit with different rules — duplicate code, lost marks for "same validation".', vi: 'Hai form riêng cho thêm và sửa với luật khác nhau — trùng mã, mất điểm "cùng luật kiểm".' },
    { en: 'Deleting without confirmation, or not reloading the list afterwards.', vi: 'Xoá không hỏi xác nhận, hoặc xoá xong không tải lại danh sách.' },
    { en: 'Sorting the state array in place (<code>gadgets.sort(…)</code>) inside render.', vi: 'Sắp xếp tại chỗ mảng state (<code>gadgets.sort(…)</code>) ngay trong render.' },
  ],
  nopBai: NOP_BAI,
};

export default doiDau({
  slug: 'fer202-13-pe-2-gadget-store',
  ten: 'PE Practice 2 — Gadget Store Management',
  khoa: KHOA,
  baiHoc: 'fer202-pe17-su26-chua-tron-de',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE Practice 2 — Gadget Store Management (Vite .env · axios · CRUD)', vi: 'Luyện PE 2 — Quản lý cửa hàng thiết bị (Vite .env · axios · CRUD)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['axios', 'Vite env', 'CRUD', 'form validation', 'React-Bootstrap Form', 'useParams', 'useNavigate', 'window.confirm'],
      tienQuyet: ['React Router', 'controlled form', 'async/await'],
      the: ['fer202', 'pe', 'axios', 'crud', 'validation'],
      banIn: BAN_IN,
      thuatNgu: [
        { en: 'roll number', vi: 'mã số sinh viên (vd SE123456)' },
        { en: 'gadget', vi: 'thiết bị điện tử nhỏ' },
        { en: 'best seller', vi: 'bán chạy' },
        { en: 'sold out', vi: 'hết hàng' },
        { en: 'switch control', vi: 'công tắc bật/tắt (checkbox kiểu switch)' },
        { en: 'whole number', vi: 'số nguyên (không có phần thập phân)' },
        ...tn('thumbnail', 'confirm', 'prefill', 'validate', 'controlled', 'payload', 'redirect', 'rubric'),
      ],
      goiY: [
        'Viết config.js (đọc import.meta.env.VITE_API_URL + ROLL) và gadgetApi.js trước — ba câu đều dùng.',
        'Câu 1: sort trên bản sao ([...gadgets] hoặc sau filter); định dạng tiền = (priceK * 1000).toLocaleString("en-US") + " VND".',
        'Câu 2: tách hàm load() bằng useCallback để gọi lúc mount và sau khi xoá; confirm trả false ⇒ return ngay.',
        'Câu 3: một component GadgetForm — const { id } = useParams(); isEdit = id !== undefined. validateGadget(form) trả object lỗi; rỗng mới gửi. Nhớ Number(priceK), Number(stock).',
      ],
      loiHayGap: [
        'Đọc <code>process.env.REACT_APP_…</code> trong dự án Vite (luôn undefined) — Vite dùng <code>import.meta.env.VITE_…</code> và biến PHẢI bắt đầu bằng <code>VITE_</code>.',
        'Form sửa không điền sẵn vì <code>useState(gadget)</code> chỉ lấy giá trị LẦN ĐẦU — phải <code>setForm</code> sau khi tải xong (trong useEffect).',
        'Ô số giữ chuỗi: gửi <code>priceK: "19990"</code> ⇒ dữ liệu lẫn chuỗi và số, sắp xếp sai.',
        'Kiểm "ít nhất 2 từ" bằng <code>split(" ")</code> ⇒ "Apple&nbsp;&nbsp;Inc" (2 dấu cách) bị đếm 3 từ, "Apple " đếm 2 — dùng <code>trim().split(/\\s+/)</code>.',
        'Dùng <code>&lt;a href&gt;</code> thay <code>Link</code>/<code>navigate</code> ⇒ tải lại cả trang, mất state.',
        'Quên <code>noValidate</code> + <code>e.preventDefault()</code> ⇒ trình duyệt tự kiểm/gửi form theo kiểu của nó.',
      ],
      moTaNgan: 'Đề luyện PE dạng PE17 (SU26): .env Vite, route có mã sinh viên, axios CRUD, form thêm/sửa dùng chung với 6 luật kiểm từng ô.',
      giaiThich: '<p>Ba quyết định giữ bài gọn: (1) <code>config.js</code> + <code>gadgetApi.js</code> gom URL và mọi lời gọi axios về một chỗ (URL đọc từ <code>.env</code>); (2) <code>validateGadget</code> là hàm thuần trả object lỗi — form chỉ việc hiển thị (<code>isInvalid</code> + <code>Form.Control.Feedback</code>); (3) MỘT <code>GadgetForm</code> cho cả thêm và sửa, phân biệt bằng <code>useParams().id</code>, dữ liệu gửi đi được ép đúng kiểu (<code>Number</code>, boolean).</p><p>Trang quản lý tách <code>load</code> bằng <code>useCallback</code> để vừa gọi khi mount, vừa gọi lại sau khi xoá (đề yêu cầu "reload the list"). Trang bộ sưu tập chỉ tải một lần; lọc và sắp xếp là giá trị suy ra bằng <code>useMemo</code>.</p>',
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: `${P}/gadgets`, jsonServer: { base: B, db: DB }, kiem: KIEM },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: `${P}/gadgets` },
      thamKhao: 'https://react-bootstrap.netlify.app/docs/forms/validation',
    },
  ],
});
