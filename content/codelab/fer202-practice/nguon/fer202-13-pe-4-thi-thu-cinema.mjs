/**
 * FER202 · ĐỀ THI THỬ PE cô cho trên lớp 30/10/2026 — Movie listing & Ticket booking (boutique cinema).
 * ════════════════════════════════════════════════════════════════════════════════════════════════
 * Người học yêu cầu "cái đề y nguyên 100%" ⇒ KHÔNG dựng bằng `banIn` (bộ dựng đó viết lại đề theo khuôn
 * chung). problemHtml = tờ đề của cô (Sample.docx) chép NGUYÊN VĂN: cùng câu chữ, cùng thứ tự, cùng điểm,
 * cùng 4 ảnh chụp màn hình (đặt đúng chỗ trong docx — ảnh 2 nằm ở gạch đầu dòng "trống" sau Genre Filter).
 * Chỉ một chỗ khác hình thức: docx ghi LaTeX `$\times$` ⇒ hiện thành dấu ×. Phần "Code Lab" (selector cho máy
 * chấm, thang điểm tự động, những gì chấm tay) nằm SAU tờ đề, có ghi rõ là KHÔNG thuộc đề của cô.
 *
 * Tài nguyên gốc (chép nguyên, không sửa) ở ./_pe4-cinema/:
 *   database.json            — đúng tệp cô phát (6 movies · 5 rooms · 8 showtimes · 14 tickets · 6 users + "$schema")
 *   given/                   — dự án CRA cô phát (package.json, public/index.html, src/App.js, src/index.js) = STARTER
 *   anh/sample-1..4.webp     — 4 ảnh trong docx (nén WebP 1000px để nhúng data: URI)
 * Nguồn: ~/Documents/FER202-Luyen-PE/DE-THI-THU-30-10/ (Practice_PE/Sample.docx, FER202_given/).
 *
 * Bẫy chính của đề: URL dùng `?status=now-showing` nhưng dữ liệu lưu `"NOW_SHOWING"` ⇒ phải đổi trước khi gửi
 * GET /movies?status=…; vé lưu trường `showTimeId` (chữ T hoa) trong khi suất chiếu có `movieId`.
 */
import fs from 'node:fs';
import { doiDau, KHOA, tn } from './_chung.mjs';

const TN_MUC = new URL('./_pe4-cinema/', import.meta.url);
const doc = (p) => fs.readFileSync(new URL(p, TN_MUC), 'utf8').replace(/\r\n/g, '\n');
const anh = (n) => `data:image/webp;base64,${fs.readFileSync(new URL(`anh/sample-${n}.webp`, TN_MUC)).toString('base64')}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const DB_JSON = doc('database.json');          // nguyên văn tệp cô phát
const DB = JSON.parse(DB_JSON);
const GIVEN = {
  'src/App.js': doc('given/src/App.js'),
  'src/index.js': doc('given/src/index.js'),
  'package.json': doc('given/package.json'),
  'public/index.html': doc('given/public/index.html'),
};

// ═════════════════════════════════════ LỜI GIẢI ═════════════════════════════════════
const INDEX = String.raw`// src/index.js — điểm vào. So với tệp cô cho chỉ thêm 2 dòng:
//   (1) nạp CSS của Bootstrap (react-bootstrap KHÔNG tự kèm CSS)
//   (2) bọc <App /> trong <BrowserRouter> để <Routes> trong App dùng được
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
`;

const APP = String.raw`// src/App.js — Question 1: cấu hình route (react-router-dom v6)
import { Navigate, Route, Routes } from 'react-router-dom';
import MovieListPage from './pages/MovieListPage';
import TicketBookingPage from './pages/TicketBookingPage';

function App() {
  return (
    <Routes>
      {/* /movies ⇒ trang danh sách phim */}
      <Route path="/movies" element={<MovieListPage />} />
      {/* /tickets/create?movie_id=... ⇒ trang đặt vé (movie_id là QUERY string, không phải :param) */}
      <Route path="/tickets/create" element={<TicketBookingPage />} />
      {/* mọi đường dẫn khác (kể cả "/") ⇒ chuyển về /movies; replace để nút Back không quay lại URL hỏng */}
      <Route path="*" element={<Navigate to="/movies" replace />} />
    </Routes>
  );
}

export default App;
`;

const API = String.raw`// src/services/api.js — một axios dùng chung, trỏ vào json-server
// Chạy máy chủ giả: npx json-server --watch database.json --port 9999
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:9999' });

export default api;
`;

const FORMAT = String.raw`// src/utils/format.js — các hàm THUẦN (không đụng state/DOM) để định dạng và tính tiền

// 90000 ⇒ "90.000" — dấu chấm ngăn nghìn như ảnh mẫu của đề ("100.000 VND")
export const formatNumber = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const formatVnd = (n) => ´@{formatNumber(n)} VND´;

// "2026-03-10T18:30" ⇒ "10/03/2026 - 18:30"
// CẮT CHUỖI chứ không new Date(...).toLocale...: tránh lệch múi giờ và khác định dạng giữa các máy
export function formatShowtime(startTime) {
  const [date, time = ''] = String(startTime).split('T');
  const [y, m, d] = date.split('-');
  return ´@{d}/@{m}/@{y} - @{time.slice(0, 5)}´;
}

// URL viết "now-showing" nhưng dữ liệu lưu "NOW_SHOWING" ⇒ đổi trước khi gửi lên json-server
// (json-server lọc ?status=... theo đúng từng ký tự, gửi nguyên "now-showing" sẽ ra mảng rỗng)
export const toApiStatus = (status) => String(status).trim().toUpperCase().replace(/-/g, '_');

// Giá một ghế: VIP = giá suất chiếu × 1.2 (làm tròn tới đồng), ghế thường = giá suất chiếu
export const seatPrice = (seat, basePrice) => (seat.type === 'VIP' ? Math.round(basePrice * 1.2) : basePrice);
`;

const MOVIES = String.raw`// src/pages/MovieListPage.js — Question 2: danh sách phim (status trên URL, thể loại, tìm + lọc, Card)
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import api from '../services/api';
import { toApiStatus } from '../utils/format';

// Ảnh mặc định của đề: chép Practice_PE/movie_thumbnail.png vào thư mục public/ của dự án
const THUMBNAIL = '/movie_thumbnail.png';

export default function MovieListPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status'); // "now-showing" | "stopped" | null
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]); // phim theo status — danh sách chính
  const [genres, setGenres] = useState([]); // thể loại rút từ TẤT CẢ phim
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);

  // (1) Data fetching: GET /movies lọc theo status trên URL; không có status ⇒ lấy hết.
  //     status nằm trong mảng phụ thuộc ⇒ đổi URL (?status=stopped) là gọi lại.
  useEffect(() => {
    const params = status ? { status: toApiStatus(status) } : {};
    api.get('/movies', { params })
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  }, [status]);

  // (2) Genre list: GET /movies KHÔNG lọc (một lần) ⇒ gộp mọi mảng genre ⇒ Set bỏ trùng.
  //     Lấy từ tất cả phim nên đang ở ?status=stopped vẫn đủ 7 thể loại.
  useEffect(() => {
    api.get('/movies')
      .then((res) => setGenres([...new Set(res.data.flatMap((m) => m.genre || []))]))
      .catch((err) => console.error(err));
  }, []);

  // tick / bỏ tick một thể loại — luôn tạo MẢNG MỚI (không push vào state cũ)
  const toggleGenre = (genre) => setSelectedGenres((prev) => (
    prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
  ));

  // (3) Search + Genre filter cùng lúc — giá trị SUY RA, không lưu state riêng:
  //     tên "bắt đầu bằng" chuỗi đã trim (không phân biệt hoa thường) VÀ có ít nhất một thể loại đã tick.
  const visibleMovies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return movies
      .filter((m) => m.title.toLowerCase().startsWith(keyword))
      .filter((m) => selectedGenres.length === 0 || (m.genre || []).some((g) => selectedGenres.includes(g)));
  }, [movies, search, selectedGenres]);

  return (
    <Container fluid className="py-3">
      {/* phần trên: thanh tìm kiếm */}
      <Row className="mb-3">
        <Col md={{ span: 6, offset: 3 }}>
          <Form.Control
            id="search"
            type="text"
            placeholder="Search by title (starts with) ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        {/* trái: Sidebar thể loại (checkbox, value = tên thể loại) */}
        <Col md={2}>
          <h2>Genres</h2>
          {genres.map((g) => (
            <Form.Check
              key={g}
              type="checkbox"
              id={´genre-@{g}´}
              value={g}
              label={g}
              checked={selectedGenres.includes(g)}
              onChange={() => toggleGenre(g)}
            />
          ))}
        </Col>

        {/* phải: danh sách phim, mỗi phim một <Card> */}
        <Col md={10}>
          <Row>
            {visibleMovies.map((m) => (
              <Col key={m.id} xs={12} sm={6} lg={3} className="mb-4">
                <Card className="h-100">
                  <Card.Img variant="top" src={THUMBNAIL} alt={m.title} />
                  <Card.Body>
                    <Card.Title>{m.title}</Card.Title>
                  </Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Genre: {(m.genre || []).join('; ')}</ListGroup.Item>
                    <ListGroup.Item>Duration: {m.duration} minutes</ListGroup.Item>
                  </ListGroup>
                  {/* (4) điều hướng bằng code, movie_id đi trong QUERY string */}
                  <Button variant="primary" onClick={() => navigate(´/tickets/create?movie_id=@{m.id}´)}>
                    Create Ticket
                  </Button>
                </Card>
              </Col>
            ))}
            {visibleMovies.length === 0 && <p className="text-muted">No movies found.</p>}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
`;

const BOOKING = String.raw`// src/pages/TicketBookingPage.js — Question 3: chọn người dùng, suất chiếu, ghế ⇒ tạo vé
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';
import api from '../services/api';
import { formatShowtime, formatVnd, seatPrice } from '../utils/format';

// màu đề cho sẵn
const COLORS = { BOOKED: '#adb5bd', SELECTED: '#dc3545', VIP: '#ffc107', NORMAL: '#87CEEB' };
const LOCKED_STATUS = ['booked', 'paid']; // vé "canceled" KHÔNG khoá ghế

export default function TicketBookingPage() {
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movie_id');

  const [showtimes, setShowtimes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [showtimeId, setShowtimeId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]); // mảng seatId đang chọn
  const [creating, setCreating] = useState(false);

  // (1) Initial data loading: 4 request chạy SONG SONG bằng Promise.all, chờ đủ cả 4 rồi mới set state
  useEffect(() => {
    Promise.all([
      movieId ? api.get('/showtimes', { params: { movieId } }) : Promise.resolve({ data: [] }),
      api.get('/rooms'),
      api.get('/tickets'),
      api.get('/users'),
    ])
      .then(([showtimeRes, roomRes, ticketRes, userRes]) => {
        // tăng dần theo thời gian: "yyyy-mm-ddTHH:MM" so như chuỗi là đúng thứ tự thời gian
        setShowtimes([...showtimeRes.data].sort((a, b) => a.startTime.localeCompare(b.startTime)));
        setRooms(roomRes.data);
        setTickets(ticketRes.data);
        setUsers(userRes.data);
        setShowtimeId('');
        setSelectedSeats([]);
      })
      .catch((err) => console.error(err));
  }, [movieId]);

  const roomName = (roomId) => rooms.find((r) => r.id === roomId)?.roomName ?? '';
  const showtime = showtimes.find((s) => s.id === showtimeId) || null;
  const room = showtime ? rooms.find((r) => r.id === showtime.roomId) : null;

  // (2) ghế đã khoá của suất đang chọn = vé của suất đó có status "booked" hoặc "paid"
  //     (vé lưu khoá ngoại tên showTimeId — chữ T HOA)
  const lockedSeats = useMemo(() => (showtime
    ? tickets.filter((t) => t.showTimeId === showtime.id && LOCKED_STATUS.includes(t.status)).map((t) => t.seatId)
    : []), [tickets, showtime]);

  // tổng tiền thời gian thực — SUY RA từ ghế đang chọn (VIP × 1.2), không lưu state riêng
  const total = useMemo(() => (room && showtime
    ? room.seats.filter((s) => selectedSeats.includes(s.id)).reduce((sum, s) => sum + seatPrice(s, showtime.price), 0)
    : 0), [room, showtime, selectedSeats]);

  // đổi suất chiếu ⇒ bỏ ghế đã chọn của suất cũ (phòng khác, ghế khác)
  const chooseShowtime = (id) => {
    setShowtimeId(id);
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId) => setSelectedSeats((prev) => (
    prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
  ));

  const seatColor = (seat) => {
    if (lockedSeats.includes(seat.id)) return COLORS.BOOKED;
    if (selectedSeats.includes(seat.id)) return COLORS.SELECTED;
    return seat.type === 'VIP' ? COLORS.VIP : COLORS.NORMAL;
  };

  // (3) Tạo vé: kiểm hợp lệ ⇒ mỗi ghế MỘT POST /tickets ⇒ báo thành công ⇒ bỏ chọn ⇒ tải lại vé để khoá ghế
  const handleCreate = async () => {
    if (!userId) { alert('Please select a user!'); return; }
    if (!showtime) { alert('Please select a showtime!'); return; }
    if (selectedSeats.length === 0) { alert('Please select at least one seat!'); return; }

    setCreating(true); // nút bị khoá + chữ "Creating..." trong lúc chờ API
    try {
      const seats = room.seats.filter((s) => selectedSeats.includes(s.id));
      await Promise.all(seats.map((seat) => api.post('/tickets', {
        showTimeId: showtime.id,
        seatId: seat.id,
        userId,
        price: seatPrice(seat, showtime.price),
        status: 'booked',
        bookedAt: new Date().toISOString(),
        paymentMethod: 'cash',
      })));
      alert('Create ticket successfully!');
      setSelectedSeats([]);
      const res = await api.get('/tickets'); // làm mới ⇒ ghế vừa đặt chuyển xám + disabled
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      alert('Create ticket failed!');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Container className="py-3" style={{ maxWidth: 820 }}>
      <h1>Create Ticket</h1>

      {/* người đặt vé */}
      <Form.Group className="d-flex align-items-center gap-2 mb-3">
        <Form.Label htmlFor="user-select" className="mb-0">Select User:</Form.Label>
        <Form.Select id="user-select" style={{ width: 'auto' }} value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">-- Select User --</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Form.Select>
      </Form.Group>

      {/* nhóm radio suất chiếu — suất đang chọn có nền khác */}
      <h5 className="fw-bold">Select Showtime</h5>
      {showtimes.length === 0 && <p className="text-muted">No showtimes for this movie.</p>}
      {showtimes.map((s) => {
        const active = s.id === showtimeId;
        return (
          <div
            key={s.id}
            className="showtime-option border rounded px-3 py-2 mb-2"
            style={{ backgroundColor: active ? '#f8d7da' : 'transparent' }}
          >
            <Form.Check
              type="radio"
              name="showtime"
              id={´showtime-@{s.id}´}
              value={s.id}
              checked={active}
              onChange={() => chooseShowtime(s.id)}
              label={´@{formatShowtime(s.startTime)} | @{roomName(s.roomId)} | @{formatVnd(s.price)}´}
              className="mb-0"
            />
          </div>
        );
      })}

      {/* sơ đồ ghế: CHỈ hiện sau khi đã chọn một suất chiếu */}
      {showtime && room && (
        <div className="mt-3">
          <div className="d-flex align-items-center gap-3 mb-2">
            <h5 className="fw-bold mb-0">Select Seats</h5>
            {[['VIP', COLORS.VIP], ['Normal', COLORS.NORMAL], ['Selected', COLORS.SELECTED], ['Booked', COLORS.BOOKED]].map(([text, color]) => (
              <span key={text} className="d-inline-flex align-items-center gap-1 small">
                <span style={{ width: 14, height: 14, backgroundColor: color, display: 'inline-block', borderRadius: 2 }} />
                {text}
              </span>
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {room.seats.map((seat) => {
              const locked = lockedSeats.includes(seat.id);
              const color = seatColor(seat);
              return (
                <Button
                  key={seat.id}
                  id={´seat-@{seat.id}´}
                  disabled={locked}
                  onClick={() => toggleSeat(seat.id)}
                  style={{ backgroundColor: color, borderColor: color, color: '#000', width: 64, fontWeight: 700 }}
                >
                  {seat.id}
                </Button>
              );
            })}
          </div>
          <p id="total" className="fw-bold">Total: {formatVnd(total)}</p>
        </div>
      )}

      <Button id="btn-create" variant="danger" className="mt-2" disabled={creating} onClick={handleCreate}>
        {creating ? 'Creating...' : 'Create Ticket'}
      </Button>
    </Container>
  );
}
`;

const CHUNG = { 'database.json': DB_JSON, 'package.json': GIVEN['package.json'], 'public/index.html': GIVEN['public/index.html'] };
const LOI_GIAI = {
  'src/pages/MovieListPage.js': MOVIES,
  'src/pages/TicketBookingPage.js': BOOKING,
  'src/App.js': APP,
  'src/index.js': INDEX,
  'src/services/api.js': API,
  'src/utils/format.js': FORMAT,
  ...CHUNG,
};
// STARTER = đúng dự án cô phát (App.js + index.js nguyên văn) + database.json
const KHOI_DAU = { 'src/App.js': GIVEN['src/App.js'], 'src/index.js': GIVEN['src/index.js'], ...CHUNG };

// ═════════════════════════════════════ BỘ KIỂM ═════════════════════════════════════
const B = 'http://localhost:9999';
const M = (n) => `65fa0000000000000000000${n}`;
const ST = (n) => `65fc0000000000000000000${n}`;
const U1 = '65fd00000000000000000001';
const TA = `/tickets/create?movie_id=${M(1)}`; // Avengers: 3 suất (dữ liệu KHÔNG theo thứ tự thời gian)
const TB = `/tickets/create?movie_id=${M(2)}`; // Avatar: Room C (A1 paid · A2 canceled · B1) + Room A
const TC = `/tickets/create?movie_id=${M(3)}`; // Inception: Room A 95.000
const GENRES = ['action', 'sci-fi', 'adventure', 'fantasy', 'thriller', 'romance', 'drama'];

const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const doi = (selector, giaTri) => ({ hanhDong: 'doi', selector, giaTri });
const click = (selector, thu) => ({ hanhDong: 'click', selector, ...(thu != null ? { thu } : {}) });
const cho = (ms = 300) => ({ hanhDong: 'cho', ms });
const genre = (g, giaTri = true) => ({ hanhDong: 'chon-o', selector: `input[type="checkbox"][value="${g}"]`, ...(giaTri ? {} : { giaTri: false }) });
const suat = (n) => ({ hanhDong: 'chon-o', selector: `.showtime-option input[value="${ST(n)}"]` });
const user = doi('#user-select', U1);
const SO = (n) => `(^|[^\\d.,])${n}[.,]?000([^\\d]|$)`; // 120000 · 120.000 · 120,000 đều được
const KHONG = '(^|[^\\d.,])0\\s*(VND|đ|₫)';
const VAO_C = [cho(200), suat(3), cho(80)]; // Avatar · 01/04 14:00 · Room C
const DAT_VE = [cho(200), user, suat(3), cho(80), click('#seat-A2'), click('#seat-B1'), click('#btn-create'), cho(400)];
const KHONG_POST = { kiem: 'goi-fetch', khop: '^POST', min: 0, max: 0 };

const KIEM = [
  // f1 — Q1 Routing (1.5)
  { nhom: 'f1', moTa: '"/" redirects to /movies', url: '/', kiem: 'duong-dan', giaTri: '/movies' },
  { nhom: 'f1', moTa: 'An undefined path (/abc/xyz) redirects to /movies', url: '/abc/xyz', kiem: 'duong-dan', giaTri: '/movies' },
  { nhom: 'f1', moTa: '/movies renders MovieListPage', url: '/movies', kiem: 'ton-tai', selector: '#search' },
  { nhom: 'f1', moTa: '/tickets/create renders TicketBookingPage', url: TB, kiem: 'ton-tai', selector: '#user-select' },
  { nhom: 'f1', an: true, moTa: '/tickets (no such route) redirects to /movies', url: '/tickets', kiem: 'duong-dan', giaTri: '/movies' },
  { nhom: 'f1', an: true, moTa: '/tickets/create does not show the movie list', url: TB, kiem: 'khong-ton-tai', selector: '#search' },

  // f2 — Q2 Data fetching & API integration (1.5)
  { nhom: 'f2', moTa: '/movies (no status) shows all 6 movies', url: '/movies', kiem: 'so-luong', selector: '.card', giaTri: 6 },
  { nhom: 'f2', moTa: '/movies?status=now-showing ⇒ the 4 NOW_SHOWING movies', url: '/movies?status=now-showing', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Avengers', 'Avatar', 'Inception', 'Spider-Man'] },
  { nhom: 'f2', moTa: '/movies?status=stopped ⇒ Titanic, Old Movie', url: '/movies?status=stopped', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Titanic', 'Old Movie'] },
  { nhom: 'f2', an: true, moTa: 'The status is sent to json-server: GET /movies?status=NOW_SHOWING', url: '/movies?status=now-showing', kiem: 'goi-fetch', khop: `^GET ${B}/movies\\?(.*&)?status=NOW_SHOWING(&|$)` },
  { nhom: 'f2', an: true, moTa: 'No status ⇒ GET /movies without a filter', url: '/movies', kiem: 'goi-fetch', khop: `^GET ${B}/movies$` },

  // f3 — Q2 Dynamic genre list (1.0)
  { nhom: 'f3', moTa: '7 unique genres as checkboxes', url: '/movies', kiem: 'so-luong', selector: 'input[type="checkbox"]', giaTri: 7 },
  { nhom: 'f3', moTa: 'Every genre of the data has a checkbox (value = genre)', url: '/movies', kiem: 'so-luong', selector: GENRES.map((g) => `input[type="checkbox"][value="${g}"]`).join(', '), giaTri: 7 },
  { nhom: 'f3', moTa: 'Genres come from ALL movies — still 7 on /movies?status=stopped', url: '/movies?status=stopped', kiem: 'so-luong', selector: 'input[type="checkbox"]', giaTri: 7 },

  // f4 — Q2 Combined search & filter (1.0)
  { nhom: 'f4', moTa: 'Search "a" ⇒ titles starting with A: Avengers, Avatar', url: '/movies', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Avengers', 'Avatar'], truoc: [cho(200), nhap('#search', 'a')] },
  { nhom: 'f4', moTa: 'Search "  INC  " (spaces, upper case) ⇒ Inception', url: '/movies', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Inception'], truoc: [cho(200), nhap('#search', '  INC  ')] },
  { nhom: 'f4', moTa: 'Tick romance + thriller ⇒ movies with at least one: Inception, Titanic', url: '/movies', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Inception', 'Titanic'], truoc: [cho(200), genre('romance'), genre('thriller')] },
  { nhom: 'f4', moTa: 'Search "A" + tick action ⇒ Avengers (both filters together)', url: '/movies', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Avengers'], truoc: [cho(200), nhap('#search', 'A'), genre('action')] },
  { nhom: 'f4', an: true, moTa: '"Starts with", not "contains": "tar" ⇒ no movie', url: '/movies', kiem: 'so-luong', selector: '.card', giaTri: 0, truoc: [cho(200), nhap('#search', 'tar'), cho(100)] },
  { nhom: 'f4', an: true, moTa: 'Unticking the last genre shows every movie again', url: '/movies', kiem: 'so-luong', selector: '.card', giaTri: 6, truoc: [cho(200), genre('drama'), cho(60), genre('drama', false), cho(60)] },
  { nhom: 'f4', an: true, moTa: 'Filters apply to the status list: ?status=stopped + drama + "old" ⇒ Old Movie', url: '/movies?status=stopped', kiem: 'danh-sach-text', selector: '.card-title', mongDoi: ['Old Movie'], truoc: [cho(200), genre('drama'), nhap('#search', 'old')] },

  // f5 — Q2 Card + navigation (1.0)
  { nhom: 'f5', moTa: 'Every card has a thumbnail image', url: '/movies', kiem: 'so-luong', selector: '.card img', giaTri: 6 },
  { nhom: 'f5', moTa: 'The card shows title, genres and duration (Avengers · action · sci-fi · 180)', url: '/movies', kiem: 'text', selector: '.card', tatCa: false, khop: 'Avengers.*action.*sci-fi.*180' },
  { nhom: 'f5', moTa: 'Each card has a "Create Ticket" button', url: '/movies', kiem: 'text', selector: '.card button', giaTri: 'Create Ticket' },
  { nhom: 'f5', moTa: '"Create Ticket" on Avengers ⇒ /tickets/create?movie_id=65fa…01', url: '/movies', kiem: 'duong-dan', giaTri: `/tickets/create?movie_id=${M(1)}`, truoc: [cho(200), click('.card button')] },
  { nhom: 'f5', an: true, moTa: '"Create Ticket" on Spider-Man (4th card of now-showing) ⇒ movie_id=65fa…05', url: '/movies?status=now-showing', kiem: 'duong-dan', giaTri: `/tickets/create?movie_id=${M(5)}`, truoc: [cho(200), click('.card button', 3)] },
  { nhom: 'f5', an: true, moTa: '…and the booking page opens', url: '/movies', kiem: 'ton-tai', selector: '#user-select', truoc: [cho(200), click('.card button'), cho(150)] },

  // f6 — Q3 Initial data loading (1.0)
  { nhom: 'f6', moTa: 'Showtimes are fetched filtered by movieId', url: TA, kiem: 'goi-fetch', khop: `^GET ${B}/showtimes\\?(.*&)?movieId=${M(1)}(&|$)` },
  { nhom: 'f6', moTa: 'rooms, tickets and users are fetched too', url: TA, kiem: 'goi-fetch', khop: `^GET ${B}/(rooms|tickets|users)(\\?.*)?$`, min: 3 },
  { nhom: 'f6', moTa: 'The requests run concurrently with Promise.all', kiem: 'ma-nguon', khop: 'Promise\\.all\\s*\\(' },
  { nhom: 'f6', moTa: 'Avengers ⇒ 3 showtimes as radio buttons', url: TA, kiem: 'so-luong', selector: '.showtime-option input[type="radio"]', giaTri: 3 },
  { nhom: 'f6', moTa: 'Ascending time + label "DD/MM/YYYY - HH:MM | Room | Price VND"', url: TA, kiem: 'text', selector: 'body', khop: '10/03/2026 - 18:30 \\| Room A \\| 90[.,]?000 VND.*10/03/2026 - 20:00 \\| Room A \\| 90[.,]?000 VND.*11/03/2026 - 18:00 \\| Room B \\| 85[.,]?000 VND' },
  { nhom: 'f6', moTa: 'The selected showtime has a background colour', url: TA, kiem: 'css', selector: '.showtime-option:has(input:checked)', thuocTinh: 'background-color', khop: '^(?!(rgba\\(0, 0, 0, 0\\)|transparent|rgb\\(255, 255, 255\\))$)', truoc: [cho(200), suat(8), cho(80)] },
  { nhom: 'f6', an: true, moTa: 'Radios are one group: choosing another showtime moves the selection', url: TA, kiem: 'text', selector: '.showtime-option:has(input:checked)', khop: '^10/03/2026 - 18:30', truoc: [cho(200), suat(8), cho(60), suat(1), cho(80)] },

  // f7 — Q3 Seat map + total (1.5)
  { nhom: 'f7', moTa: 'No seat map before a showtime is selected', url: TB, kiem: 'so-luong', selector: '[id^="seat-"]', giaTri: 0, truoc: [cho(300)] },
  { nhom: 'f7', moTa: 'Avatar 01/04 14:00 (Room C) ⇒ seats A1, A2, B1', url: TB, kiem: 'danh-sach-text', selector: '[id^="seat-"]', mongDoi: ['A1', 'A2', 'B1'], truoc: VAO_C },
  { nhom: 'f7', moTa: 'A1 has a "paid" ticket ⇒ disabled', url: TB, kiem: 'thuoc-tinh-js', selector: '#seat-A1', thuocTinh: 'disabled', giaTri: true, truoc: VAO_C },
  { nhom: 'f7', moTa: '…and gray #adb5bd', url: TB, kiem: 'css', selector: '#seat-A1', thuocTinh: 'background-color', giaTri: 'rgb(173, 181, 189)', truoc: VAO_C },
  { nhom: 'f7', moTa: 'A2 only has a "canceled" ticket ⇒ free VIP seat, yellow #ffc107', url: TB, kiem: 'css', selector: '#seat-A2', thuocTinh: 'background-color', giaTri: 'rgb(255, 193, 7)', truoc: VAO_C },
  { nhom: 'f7', moTa: 'B1 is a normal seat ⇒ #87CEEB', url: TB, kiem: 'css', selector: '#seat-B1', thuocTinh: 'background-color', giaTri: 'rgb(135, 206, 235)', truoc: VAO_C },
  { nhom: 'f7', moTa: 'Clicking A2 highlights it in red #dc3545', url: TB, kiem: 'css', selector: '#seat-A2', thuocTinh: 'background-color', giaTri: 'rgb(220, 53, 69)', truoc: [...VAO_C, click('#seat-A2')] },
  { nhom: 'f7', moTa: 'VIP A2 ⇒ total 100,000 × 1.2 = 120,000', url: TB, kiem: 'text', selector: '#total', khop: SO(120), truoc: [...VAO_C, click('#seat-A2')] },
  { nhom: 'f7', moTa: 'A2 + B1 ⇒ total 220,000', url: TB, kiem: 'text', selector: '#total', khop: SO(220), truoc: [...VAO_C, click('#seat-A2'), click('#seat-B1')] },
  { nhom: 'f7', an: true, moTa: 'A2 is clickable (not disabled)', url: TB, kiem: 'thuoc-tinh-js', selector: '#seat-A2', thuocTinh: 'disabled', giaTri: false, truoc: VAO_C },
  { nhom: 'f7', an: true, moTa: 'Clicking A2 again unselects it ⇒ total 0', url: TB, kiem: 'text', selector: '#total', khop: KHONG, truoc: [...VAO_C, click('#seat-A2'), cho(60), click('#seat-A2')] },
  { nhom: 'f7', an: true, moTa: 'Avengers 10/03 18:30 (Room A): A2 is "booked" ⇒ locked too', url: TA, kiem: 'thuoc-tinh-js', selector: '#seat-A2', thuocTinh: 'disabled', giaTri: true, truoc: [cho(200), suat(1), cho(80)] },
  { nhom: 'f7', an: true, moTa: '…while B2 (no ticket) stays free', url: TA, kiem: 'thuoc-tinh-js', selector: '#seat-B2', thuocTinh: 'disabled', giaTri: false, truoc: [cho(200), suat(1), cho(80)] },
  { nhom: 'f7', an: true, moTa: 'Switching to Avatar 02/04 (Room A) redraws the map: 5 seats', url: TB, kiem: 'so-luong', selector: '[id^="seat-"]', giaTri: 5, truoc: [...VAO_C, suat(7), cho(80)] },
  { nhom: 'f7', an: true, moTa: '…where B1 ("booked") is locked', url: TB, kiem: 'thuoc-tinh-js', selector: '#seat-B1', thuocTinh: 'disabled', giaTri: true, truoc: [...VAO_C, suat(7), cho(80)] },
  { nhom: 'f7', an: true, moTa: 'Inception 12/03 (95,000): VIP A1 + A3 ⇒ 228,000', url: TC, kiem: 'text', selector: '#total', khop: SO(228), truoc: [cho(200), suat(4), cho(80), click('#seat-A1'), click('#seat-A3')] },

  // f8 — Q3 Ticket creation & submission (1.5)
  { nhom: 'f8', moTa: 'Nothing selected ⇒ no POST is sent', url: TB, ...KHONG_POST, truoc: [cho(200), click('#btn-create'), cho(150)] },
  { nhom: 'f8', moTa: 'No user ⇒ no POST', url: TB, ...KHONG_POST, truoc: [...VAO_C, click('#seat-A2'), click('#btn-create'), cho(150)] },
  { nhom: 'f8', moTa: 'No seat ⇒ no POST', url: TB, ...KHONG_POST, truoc: [cho(200), user, suat(3), cho(80), click('#btn-create'), cho(150)] },
  { nhom: 'f8', moTa: 'One POST /tickets per seat (2 seats ⇒ 2 requests)', url: TB, kiem: 'goi-fetch', khop: `^POST ${B}/tickets$`, min: 2, max: 2, truoc: DAT_VE },
  { nhom: 'f8', moTa: 'VIP A2 saved: showTimeId, seatId, userId, price 120000, "booked", "cash"', url: TB, kiem: 'du-lieu-server', bang: 'tickets', chua: { showTimeId: ST(3), seatId: 'A2', userId: U1, price: 120000, status: 'booked', paymentMethod: 'cash' }, truoc: DAT_VE },
  { nhom: 'f8', moTa: 'Normal B1 saved with price 100000', url: TB, kiem: 'du-lieu-server', bang: 'tickets', chua: { showTimeId: ST(3), seatId: 'B1', userId: U1, price: 100000, status: 'booked', paymentMethod: 'cash' }, truoc: DAT_VE },
  { nhom: 'f8', moTa: 'While the requests are pending the button reads "Creating..."', url: TB, jsonServer: { base: B, db: DB, treMs: 600 }, kiem: 'text', selector: '#btn-create', giaTri: 'Creating...', truoc: [cho(1000), user, suat(3), cho(80), click('#seat-A2'), click('#btn-create')] },
  { nhom: 'f8', moTa: 'After success the new seats are locked (A2 disabled)', url: TB, kiem: 'thuoc-tinh-js', selector: '#seat-A2', thuocTinh: 'disabled', giaTri: true, truoc: DAT_VE },
  { nhom: 'f8', an: true, moTa: '…and the button is disabled while pending', url: TB, jsonServer: { base: B, db: DB, treMs: 600 }, kiem: 'thuoc-tinh-js', selector: '#btn-create', thuocTinh: 'disabled', giaTri: true, truoc: [cho(1000), user, suat(3), cho(80), click('#seat-A2'), click('#btn-create')] },
  { nhom: 'f8', an: true, moTa: 'Selected seats are reset after booking (total 0)', url: TB, kiem: 'text', selector: '#total', khop: KHONG, truoc: DAT_VE },
  { nhom: 'f8', an: true, moTa: 'bookedAt is the current time as an ISO string', kiem: 'ma-nguon', khop: 'toISOString\\s*\\(' },
  { nhom: 'f8', an: true, moTa: 'tickets now has 14 + 2 = 16 records', url: TB, kiem: 'du-lieu-server', bang: 'tickets', doDai: 16, truoc: DAT_VE },
];

const THANG_DIEM = [
  ['Q1 · Routing configuration', 1.5],
  ['Q2 · Data fetching & API integration (?status)', 1.5],
  ['Q2 · Dynamic genre list extraction', 1],
  ['Q2 · Combined search and filter', 1],
  ['Q2 · Ticket booking navigation (Card)', 1],
  ['Q3 · Initial data loading (Promise.all + radios)', 1],
  ['Q3 · Dynamic seat map + real-time total', 1.5],
  ['Q3 · Ticket creation & booking submission', 1.5],
].map(([ten, diem], i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${ten}`, diem }));
const THANG_VI = ['C1 · Cấu hình route', 'C2 · Lấy dữ liệu & gọi API (?status)', 'C2 · Rút danh sách thể loại', 'C2 · Tìm kiếm + lọc kết hợp', 'C2 · Card + điều hướng đặt vé', 'C3 · Tải dữ liệu ban đầu (Promise.all + radio)', 'C3 · Sơ đồ ghế + tổng tiền', 'C3 · Tạo vé & gửi đặt chỗ'];

// ═════════════════════════════════════ ĐỀ — NGUYÊN VĂN ═════════════════════════════════════
const img = (n, alt) => `<p><img src="${anh(n)}" alt="${alt}" style="max-width:100%;height:auto;border:1px solid #d1d5db;border-radius:4px"></p>`;
const PRE_DB = `<pre>${esc(DB_JSON.replace(/\s+$/, ''))}</pre>`;

const DE_EN = `<h1>PRACTICAL EXAMINATION</h1>
<p class="bi-phu">FER202 · Mock Practical Exam given in class on 30/10/2026 — the lecturer's paper, reproduced verbatim (wording, order, points and screenshots)</p>
<p><b>Technical Requirement:</b> Launch a mock API server using json-server to read/write data from/to the database.json file on an appropriate port (e.g., http://localhost:9999).</p>
<h2>PROBLEM DESCRIPTION</h2>
<p>You are required to build an internal movie listing and ticket booking application for a boutique cinema. The application consists of two main pages: the Movie List Page (with search and filter functionalities) and the Ticket Booking Page (with showtime selection and an interactive seat map).</p>
<h2>PART 1: INPUT DATA (database.json)</h2>
<p>Create a database.json file at the root of your mock API project.</p>
<p class="bi-chu-y"><i>database.json — the file handed out with the paper (6 movies · 5 rooms · 8 showtimes · 14 tickets · 6 users):</i></p>
${PRE_DB}
<h2>PART 2: REQUIREMENTS</h2>
<h3>Question 1: Routing Configuration (1.5 points)</h3>
<p>Utilize the react-router-dom (v6) library to configure the following routes within the &lt;App /&gt; component:</p>
<ul>
  <li>Path /movies: Renders the Movie List Page (MovieListPage).</li>
  <li>Path /tickets/create: Renders the Ticket Booking Page (TicketBookingPage).</li>
  <li>For any undefined or fallback URL paths (*), automatically redirect the user to the /movies path.</li>
</ul>
<h3>Question 2: Movie List Page - MovieListPage (4.5 points)</h3>
<p>Design the user interface using react-bootstrap. The layout must be split into two main sections: a top Search Bar, and a lower section containing a left Sidebar (for Genres) and a right main content area (for the Movie List).</p>
${img(1, 'Sample screen from the paper — /movies')}
<ul>
  <li><b>Data Fetching &amp; API Integration (1.5 pts):</b>
    <ul>
      <li>Read the status parameter from the URL Query String (e.g., /movies?status=now-showing).</li>
      <li>Send a GET request to /movies filtered by the retrieved status to display the corresponding movies. If no status parameter is present, fetch and display all movies.</li>
    </ul>
  </li>
  <li><b>Dynamic Genre List Extraction (1.0 pt):</b>
    <ul>
      <li>Fetch all movies from the database, dynamically extract unique (non-duplicate) genres, and render them as a list of Checkboxes in the left Sidebar.</li>
    </ul>
  </li>
  <li><b>Combined Search and Filter Functionality (1.0 pt):</b>
    <ul>
      <li><b>Search:</b> As the user types into the text input, filter the movies whose titles <b>start with</b> the input string (case-insensitive, ignoring leading/trailing whitespaces).</li>
      <li><b>Genre Filter:</b> When one or more genre checkboxes are ticked, display only the movies that contain <i>at least one</i> of the selected genres.</li>
      <li>${img(2, 'Sample screen from the paper — search "A" + genre action')}</li>
    </ul>
  </li>
  <li><b>Ticket Booking Navigation (1.0 pt):</b>
    <ul>
      <li>Display each movie inside a Bootstrap &lt;Card&gt; containing: a default placeholder thumbnail image, Title, Genre list, Duration, and a <b>"Create Ticket"</b> button.</li>
      <li>Clicking the <b>"Create Ticket"</b> button must navigate the user to /tickets/create?movie_id=[movie_id].</li>
    </ul>
  </li>
</ul>
<h3>Question 3: Ticket Booking Page - TicketBookingPage (4.0 points)</h3>
<p>Design the ticket booking interface which accepts a movie_id query parameter from the URL.</p>
${img(3, 'Sample screen from the paper — /tickets/create?movie_id=65fa00000000000000000002')}
<ul>
  <li><b>Initial Data Loading (1.0 pt):</b>
    <ul>
      <li>When the page initializes, utilize a concurrent asynchronous mechanism (Promise.all) to fetch data from the following endpoints: showtimes filtered by movieId, rooms, tickets, and users.</li>
      <li>Render the showtimes for the selected movie as a group of <b>Radio Buttons</b>, sorted in ascending chronological order. Format the showtime label as: [DD/MM/YYYY] - [HH:MM] | [Room Name] | [Base Price] VND. The currently selected showtime must have a distinct background color.</li>
    </ul>
  </li>
  <li><b>Dynamic Seat Map Rendering (1.5 pts):</b>
    <ul>
      <li>The seat map for the corresponding room should only be displayed after a specific showtime is selected.</li>
      <li>Filter the tickets array for the active showtime to identify seats with a status of either "booked" or "paid". These seats must be disabled and styled with a gray background color (#adb5bd).</li>
      <li>Style the remaining available seats dynamically based on their category: VIP seats (#ffc107) and Normal seats (#87CEEB). Temporarily highlight currently selected seats in red (#dc3545).</li>
      <li><b>Real-time Total Price Calculation:</b> Display the total amount dynamically. If a selected seat is a VIP type, its price is calculated as <b>Showtime Base Price × 1.2</b>. Otherwise, it takes the base price.</li>
    </ul>
  </li>
  <li><b>Ticket Creation &amp; Booking Submission (1.5 pts):</b>
    ${img(4, 'Sample screen from the paper — showtime selected, seat map and total')}
    <ul>
      <li>When the user clicks the <b>"Create Ticket"</b> button, validate that a user, a showtime, and at least one seat have been selected. Display an alert message if any validation fails.</li>
      <li>If valid, execute individual POST requests to /tickets for each selected seat containing: <i>showtime ID, seat ID, user ID, calculated price, default status "booked", current timestamp (ISO String), and payment method "cash"</i>.</li>
      <li>While the API requests are pending, disable the submit button and change its text to "Creating..." to prevent duplicate submissions. Upon successful creation, show a success alert, reset the selected seats state, and refresh the seat map to lock the newly booked seats.</li>
    </ul>
  </li>
</ul>`;

const DE_VI = `<h1>BÀI THI THỰC HÀNH</h1>
<p class="bi-phu">FER202 · Đề thi thử PE cô cho trên lớp ngày 30/10/2026 — bản DỊCH tiếng Việt sát từng câu của tờ đề (bản gốc tiếng Anh ở nút English, giữ nguyên ảnh mẫu)</p>
<p><b>Yêu cầu kỹ thuật:</b> Chạy một máy chủ API giả bằng json-server để đọc/ghi dữ liệu từ/vào tệp database.json trên một cổng phù hợp (ví dụ: http://localhost:9999).</p>
<h2>MÔ TẢ BÀI TOÁN</h2>
<p>Bạn cần xây dựng một ứng dụng nội bộ hiển thị danh sách phim và đặt vé cho một rạp chiếu phim nhỏ (boutique cinema). Ứng dụng gồm hai trang chính: Trang danh sách phim (Movie List Page — có chức năng tìm kiếm và lọc) và Trang đặt vé (Ticket Booking Page — có chọn suất chiếu và sơ đồ ghế tương tác).</p>
<h2>PHẦN 1: DỮ LIỆU ĐẦU VÀO (database.json)</h2>
<p>Tạo tệp database.json ở thư mục gốc của dự án API giả.</p>
<p class="bi-chu-y"><i>database.json — tệp cô phát kèm đề (6 movies · 5 rooms · 8 showtimes · 14 tickets · 6 users):</i></p>
${PRE_DB}
<h2>PHẦN 2: YÊU CẦU</h2>
<h3>Câu 1: Cấu hình định tuyến (Routing Configuration) (1,5 điểm)</h3>
<p>Dùng thư viện react-router-dom (v6) để cấu hình các route sau bên trong component &lt;App /&gt;:</p>
<ul>
  <li>Đường dẫn /movies: hiển thị Trang danh sách phim (MovieListPage).</li>
  <li>Đường dẫn /tickets/create: hiển thị Trang đặt vé (TicketBookingPage).</li>
  <li>Với mọi đường dẫn URL không được định nghĩa hoặc dự phòng (*), tự động chuyển hướng người dùng về đường dẫn /movies.</li>
</ul>
<h3>Câu 2: Trang danh sách phim - MovieListPage (4,5 điểm)</h3>
<p>Thiết kế giao diện bằng react-bootstrap. Bố cục phải chia thành hai phần chính: Thanh tìm kiếm (Search Bar) ở trên cùng, và phần bên dưới gồm Thanh bên trái (Sidebar — cho các Thể loại) và vùng nội dung chính bên phải (cho Danh sách phim).</p>
${img(1, 'Ảnh mẫu trong đề — /movies')}
<ul>
  <li><b>Lấy dữ liệu &amp; tích hợp API (1,5 điểm):</b>
    <ul>
      <li>Đọc tham số status từ Query String của URL (ví dụ: /movies?status=now-showing).</li>
      <li>Gửi một request GET tới /movies có lọc theo status đọc được để hiển thị các phim tương ứng. Nếu không có tham số status, lấy và hiển thị tất cả phim.</li>
    </ul>
  </li>
  <li><b>Rút danh sách thể loại động (1,0 điểm):</b>
    <ul>
      <li>Lấy tất cả phim từ cơ sở dữ liệu, rút ra (một cách động) các thể loại duy nhất (không trùng lặp), và hiển thị chúng thành một danh sách Checkbox ở Sidebar bên trái.</li>
    </ul>
  </li>
  <li><b>Tìm kiếm và lọc kết hợp (1,0 điểm):</b>
    <ul>
      <li><b>Tìm kiếm:</b> Khi người dùng gõ vào ô nhập chữ, lọc các phim có tên <b>bắt đầu bằng</b> chuỗi đã nhập (không phân biệt hoa thường, bỏ qua khoảng trắng ở đầu/cuối).</li>
      <li><b>Lọc thể loại:</b> Khi một hoặc nhiều checkbox thể loại được tick, chỉ hiển thị những phim có chứa <i>ít nhất một</i> trong các thể loại đã chọn.</li>
      <li>${img(2, 'Ảnh mẫu trong đề — tìm "A" + thể loại action')}</li>
    </ul>
  </li>
  <li><b>Điều hướng sang đặt vé (1,0 điểm):</b>
    <ul>
      <li>Hiển thị mỗi phim trong một Bootstrap &lt;Card&gt; gồm: một ảnh thumbnail mặc định (ảnh giữ chỗ), Tên phim (Title), Danh sách thể loại (Genre list), Thời lượng (Duration), và một nút <b>"Create Ticket"</b>.</li>
      <li>Bấm nút <b>"Create Ticket"</b> phải điều hướng người dùng tới /tickets/create?movie_id=[movie_id].</li>
    </ul>
  </li>
</ul>
<h3>Câu 3: Trang đặt vé - TicketBookingPage (4,0 điểm)</h3>
<p>Thiết kế giao diện đặt vé, nhận tham số query movie_id từ URL.</p>
${img(3, 'Ảnh mẫu trong đề — /tickets/create?movie_id=65fa00000000000000000002')}
<ul>
  <li><b>Tải dữ liệu ban đầu (1,0 điểm):</b>
    <ul>
      <li>Khi trang khởi tạo, dùng một cơ chế bất đồng bộ chạy song song (Promise.all) để lấy dữ liệu từ các endpoint sau: showtimes lọc theo movieId, rooms, tickets và users.</li>
      <li>Hiển thị các suất chiếu của phim đã chọn thành một nhóm <b>Radio Button</b>, sắp xếp theo thứ tự thời gian tăng dần. Định dạng nhãn suất chiếu là: [DD/MM/YYYY] - [HH:MM] | [Tên phòng] | [Giá gốc] VND. Suất chiếu đang được chọn phải có màu nền khác biệt.</li>
    </ul>
  </li>
  <li><b>Hiển thị sơ đồ ghế động (1,5 điểm):</b>
    <ul>
      <li>Sơ đồ ghế của phòng tương ứng chỉ được hiển thị sau khi đã chọn một suất chiếu cụ thể.</li>
      <li>Lọc mảng tickets của suất chiếu đang chọn để tìm các ghế có trạng thái "booked" hoặc "paid". Những ghế này phải bị vô hiệu hoá (disabled) và có màu nền xám (#adb5bd).</li>
      <li>Tô màu các ghế còn trống một cách động theo loại ghế: ghế VIP (#ffc107) và ghế thường (#87CEEB). Tạm thời tô đỏ (#dc3545) các ghế đang được chọn.</li>
      <li><b>Tính tổng tiền theo thời gian thực:</b> Hiển thị tổng số tiền một cách động. Nếu ghế được chọn là loại VIP, giá của nó được tính bằng <b>Giá gốc của suất chiếu × 1,2</b>. Ngược lại, lấy giá gốc.</li>
    </ul>
  </li>
  <li><b>Tạo vé &amp; gửi đặt chỗ (1,5 điểm):</b>
    ${img(4, 'Ảnh mẫu trong đề — đã chọn suất chiếu, sơ đồ ghế và tổng tiền')}
    <ul>
      <li>Khi người dùng bấm nút <b>"Create Ticket"</b>, kiểm tra đã chọn một người dùng, một suất chiếu và ít nhất một ghế. Hiện một thông báo alert nếu có bước kiểm tra nào không đạt.</li>
      <li>Nếu hợp lệ, gửi các request POST riêng lẻ tới /tickets cho từng ghế đã chọn, chứa: <i>ID suất chiếu, ID ghế, ID người dùng, giá đã tính, trạng thái mặc định "booked", thời điểm hiện tại (chuỗi ISO), và phương thức thanh toán "cash"</i>.</li>
      <li>Trong lúc các request API đang chờ, vô hiệu hoá nút gửi và đổi chữ trên nút thành "Creating..." để tránh gửi trùng. Khi tạo thành công, hiện một alert thành công, đặt lại (reset) state các ghế đang chọn, và làm mới sơ đồ ghế để khoá các ghế vừa được đặt.</li>
    </ul>
  </li>
</ul>`;

// ─── Phần Code Lab (KHÔNG thuộc đề của cô) ───
const SEL = [
  ['#search', 'MovieListPage — the search text input', 'MovieListPage — ô tìm kiếm'],
  ['input[type="checkbox"][value="<genre>"]', 'one checkbox per genre, <code>value</code> = the genre (e.g. <code>value="sci-fi"</code>)', 'mỗi thể loại một checkbox, <code>value</code> = tên thể loại'],
  ['.card · .card-title · .card img · .card button', 'one react-bootstrap <code>&lt;Card&gt;</code> per movie: <code>&lt;Card.Title&gt;</code>, the thumbnail and the "Create Ticket" button inside the card', 'mỗi phim một <code>&lt;Card&gt;</code>: <code>&lt;Card.Title&gt;</code>, ảnh và nút "Create Ticket" nằm trong card'],
  ['#user-select', 'TicketBookingPage — the user <code>&lt;select&gt;</code> (option <code>value</code> = user id)', 'TicketBookingPage — ô chọn người dùng (<code>value</code> của option = id user)'],
  ['.showtime-option', 'the box around ONE showtime radio (radio <code>value</code> = showtime id); the selected box gets the background colour', 'khung bao MỘT radio suất chiếu (<code>value</code> của radio = id suất); khung đang chọn có màu nền'],
  ['#seat-<seatId>', 'one <code>&lt;button&gt;</code> per seat, text = seat id (e.g. <code>&lt;button id="seat-A1"&gt;A1&lt;/button&gt;</code>), <code>disabled</code> when locked', 'mỗi ghế một <code>&lt;button&gt;</code>, chữ = mã ghế, <code>disabled</code> khi đã khoá'],
  ['#total', 'the total amount text (any of <code>120000</code> · <code>120.000</code> · <code>120,000</code> is accepted)', 'dòng tổng tiền (chấp nhận <code>120000</code> · <code>120.000</code> · <code>120,000</code>)'],
  ['#btn-create', 'the "Create Ticket" submit button on the booking page', 'nút "Create Ticket" của trang đặt vé'],
];
const codeLab = (lang) => {
  const vi = lang === 'vi';
  const r = (en, v) => (vi ? v : en);
  return `<hr>
<h2>${r('Code Lab — auto-grader notes (not part of the lecturer\'s paper)', 'Code Lab — ghi chú cho máy chấm (KHÔNG thuộc đề của cô)')}</h2>
<p class="bi-chu-y">${r('Everything above this line is the paper exactly as handed out. Below is only what the CuongThai auto-grader needs to find your elements, plus how it reads the two places where the paper and the data disagree.', 'Mọi thứ phía trên đường kẻ là tờ đề y nguyên như cô phát. Phía dưới chỉ là những gì máy chấm CuongThai cần để tìm phần tử của bạn, và cách nó hiểu hai chỗ đề với dữ liệu lệch nhau.')}</p>
<h3>${r('Element ids / classes used by the auto-grader', 'id / class máy chấm dùng')}</h3>
<table><thead><tr><th>Selector</th><th>${r('Purpose', 'Vai trò')}</th></tr></thead><tbody>${SEL.map(([s, en, v]) => `<tr><td><code>${esc(s)}</code></td><td>${r(en, v)}</td></tr>`).join('')}</tbody></table>
<h3>${r('How the grader reads the data', 'Máy chấm hiểu dữ liệu thế nào')}</h3>
<ul>
  <li>${r('The URL says <code>?status=now-showing</code> but <code>database.json</code> stores <code>"NOW_SHOWING"</code> / <code>"STOPPED"</code>. The grader expects <code>/movies?status=now-showing</code> to show the 4 <code>NOW_SHOWING</code> movies and <code>?status=stopped</code> the 2 <code>STOPPED</code> ones — convert the value before <code>GET /movies?status=…</code>.', 'URL ghi <code>?status=now-showing</code> nhưng <code>database.json</code> lưu <code>"NOW_SHOWING"</code> / <code>"STOPPED"</code>. Máy chấm mong <code>/movies?status=now-showing</code> ra 4 phim <code>NOW_SHOWING</code>, <code>?status=stopped</code> ra 2 phim <code>STOPPED</code> — đổi giá trị trước khi <code>GET /movies?status=…</code>.')}</li>
  <li>${r('"showtime ID" in a new ticket is the field <code>showTimeId</code> (capital T), exactly like the 14 existing tickets — otherwise the seat map cannot lock the new seats.', '"showtime ID" của vé mới là trường <code>showTimeId</code> (chữ T hoa) giống 14 vé có sẵn — sai tên thì sơ đồ ghế không khoá được ghế vừa đặt.')}</li>
  <li>${r('Money format is free (<code>90000</code>, <code>90.000</code> as in the screenshots, or <code>90,000</code>); the showtime label must follow <code>DD/MM/YYYY - HH:MM | Room Name | Price VND</code>.', 'Định dạng tiền tuỳ bạn (<code>90000</code>, <code>90.000</code> như ảnh mẫu, hay <code>90,000</code>); nhãn suất chiếu phải đúng <code>DD/MM/YYYY - HH:MM | Room Name | Price VND</code>.')}</li>
</ul>
<h3>${r('Auto-grader rubric', 'Thang điểm máy chấm')}</h3>
<table><thead><tr><th>#</th><th>${r('Rubric line of the paper', 'Dòng điểm của đề')}</th><th>${r('Marks', 'Điểm')}</th></tr></thead><tbody>${THANG_DIEM.map((t, i) => `<tr><td>${i + 1}</td><td>${esc(vi ? THANG_VI[i] : t.ten.replace(/^\d+\. /, ''))}</td><td>${t.diem}</td></tr>`).join('')}<tr><td></td><td><b>${r('Total', 'Tổng')}</b></td><td><b>10</b></td></tr></tbody></table>
<h3>${r('Checked by hand (the auto-grader cannot see these)', 'Tự kiểm bằng mắt (máy chấm không thấy được)')}</h3>
<ul>
  <li>${r('Layout: Search Bar on top, Genres sidebar on the left, movie list on the right (compare with the screenshots).', 'Bố cục: thanh tìm kiếm trên cùng, Sidebar thể loại bên trái, danh sách phim bên phải (so với ảnh mẫu).')}</li>
  <li>${r('The placeholder thumbnail is <code>movie_thumbnail.png</code> from the paper (put it in <code>public/</code>). Practising at home without that file? Use any image — the grader only checks that each card has an image.', 'Ảnh thumbnail là <code>movie_thumbnail.png</code> của đề (đặt trong <code>public/</code>). Luyện ở nhà không có tệp đó thì dùng ảnh bất kỳ — máy chấm chỉ kiểm mỗi card có ảnh.')}</li>
  <li>${r('The alert messages (validation failures and success): the grader checks that nothing is POSTed when validation fails, not the wording of your alert.', 'Nội dung alert (lỗi kiểm tra và thành công): máy chấm chỉ kiểm khi không hợp lệ thì không POST gì, không chấm câu chữ alert.')}</li>
  <li>${r('<code>Promise.all</code> is checked in the source code; <code>bookedAt</code> (current ISO timestamp) is checked as a call to <code>toISOString()</code>.', '<code>Promise.all</code> được kiểm trong mã nguồn; <code>bookedAt</code> (thời điểm hiện tại dạng ISO) được kiểm bằng lời gọi <code>toISOString()</code>.')}</li>
</ul>`;
};

const YEU_CAU = [
  { en: 'Start the mock API exactly as in the exam: <code>npx json-server --watch database.json --port 9999</code> (json-server 0.17.x from the given <code>package.json</code>).', vi: 'Chạy API giả như lúc thi: <code>npx json-server --watch database.json --port 9999</code> (json-server 0.17.x có sẵn trong <code>package.json</code> cô cho).' },
  { en: 'The starter is the given project untouched (<code>src/App.js</code>, <code>src/index.js</code>): import Bootstrap\'s CSS and add a router yourself — nothing else is installed for you.', vi: 'Starter là đúng dự án cô cho (<code>src/App.js</code>, <code>src/index.js</code>): tự nạp CSS Bootstrap và tự thêm router — không có gì làm sẵn.' },
  { en: 'Press <b>Run</b> for the sample checks, <b>Submit</b> for the full rubric (hidden checks included). Time yourself: 85 minutes, like the real PE on 07/11.', vi: 'Bấm <b>Chạy thử</b> để chạy kiểm mẫu, <b>Nộp</b> để chấm đủ thang điểm (có kiểm ẩn). Tự bấm giờ 85 phút như PE thật ngày 07/11.' },
];

export default doiDau({
  slug: 'fer202-13-pe-4-thi-thu-cinema',
  ten: 'PE thi thử 30/10 — Cinema Booking (đề của cô)',
  khoa: KHOA,
  baiHoc: 'fer202-pe18-sp26-chua-tron-de',
  de: [
    {
      dangBai: 'pe',
      tieuDe: { en: 'PE Mock Exam 30/10 — Movie Listing & Ticket Booking (lecturer\'s paper, verbatim)', vi: 'Đề thi thử PE 30/10 — Danh sách phim & đặt vé (đề của cô, nguyên văn)' },
      doKho: 'HARD',
      phut: 85,
      diem: 100,
      ngonNgu: 'javascript',
      khaiNiem: ['React Router v6', 'Navigate redirect', 'useSearchParams', 'json-server query filter', 'Set (unique values)', 'combined filters', 'Promise.all', 'radio group', 'conditional styling', 'derived total', 'POST per item', 'pending state'],
      tienQuyet: ['useState / useEffect', 'axios', 'React-Bootstrap Card / Form'],
      the: ['fer202', 'pe', 'mock-exam', 'router', 'json-server', 'promise-all'],
      moTa: { en: DE_EN + '\n' + codeLab('en'), vi: DE_VI + '\n' + codeLab('vi') },
      yeuCau: YEU_CAU,
      dauVao: { en: 'The given CRA project (React 18, react-router-dom 6, react-bootstrap 2, axios, json-server 0.17) + database.json — see the paper.', vi: 'Dự án CRA cô cho (React 18, react-router-dom 6, react-bootstrap 2, axios, json-server 0.17) + database.json — xem đề.' },
      dauRa: { en: 'A working app that passes every rubric line: /movies and /tickets/create as described in the paper.', vi: 'Ứng dụng chạy đúng mọi dòng điểm: /movies và /tickets/create như đề mô tả.' },
      rangBuoc: [
        { en: 'react-router-dom v6 (<code>Routes</code>, <code>Navigate</code>, <code>useSearchParams</code>, <code>useNavigate</code>); UI with react-bootstrap.', vi: 'react-router-dom v6 (<code>Routes</code>, <code>Navigate</code>, <code>useSearchParams</code>, <code>useNavigate</code>); giao diện bằng react-bootstrap.' },
        { en: 'Data only through json-server at <code>http://localhost:9999</code> (axios or fetch); no extra libraries (the exam forbids downloading packages).', vi: 'Dữ liệu chỉ qua json-server ở <code>http://localhost:9999</code> (axios hoặc fetch); không thêm thư viện (đề cấm tải gói khi thi).' },
        { en: 'Initial load of the booking page with <code>Promise.all</code>; one <code>POST /tickets</code> per selected seat.', vi: 'Trang đặt vé tải ban đầu bằng <code>Promise.all</code>; mỗi ghế đã chọn một <code>POST /tickets</code>.' },
      ],
      viDu: [
        { input: '/movies?status=now-showing', output: 'Avengers · Avatar · Inception · Spider-Man (GET /movies?status=NOW_SHOWING)', explanation: { en: 'The URL value is mapped to the stored value NOW_SHOWING.', vi: 'Giá trị trên URL được đổi sang giá trị lưu NOW_SHOWING.' } },
        { input: '/tickets/create?movie_id=65fa00000000000000000001', output: '10/03/2026 - 18:30 | Room A | 90.000 VND\n10/03/2026 - 20:00 | Room A | 90.000 VND\n11/03/2026 - 18:00 | Room B | 85.000 VND', explanation: { en: 'Showtimes sorted by startTime (the data order is 01, 02, 08).', vi: 'Suất chiếu sắp theo startTime (thứ tự trong dữ liệu là 01, 02, 08).' } },
        { input: { en: 'Avatar · 01/04 14:00 (Room C) · select A2 (VIP) + B1', vi: 'Avatar · 01/04 14:00 (Room C) · chọn A2 (VIP) + B1' }, output: 'Total: 220.000 VND (100.000 × 1.2 + 100.000)', explanation: { en: 'A1 is gray/disabled (paid); A2 is free because its only ticket is "canceled".', vi: 'A1 xám/khoá (paid); A2 còn trống vì vé duy nhất của nó là "canceled".' } },
      ],
      goiY: [
        'Câu 1 làm trước (1,5 điểm dễ nhất): index.js bọc <BrowserRouter> + import "bootstrap/dist/css/bootstrap.min.css"; App.js có <Routes> với /movies, /tickets/create và path="*" ⇒ <Navigate to="/movies" replace />.',
        'MovieListPage: hai useEffect — một cái GET /movies theo status (deps [status]), một cái GET /movies không lọc để rút thể loại bằng [...new Set(movies.flatMap(m => m.genre))]. Nhớ đổi "now-showing" ⇒ "NOW_SHOWING" (toUpperCase + replace("-", "_")).',
        'Tìm + lọc là giá trị suy ra: movies.filter(tên.toLowerCase().startsWith(search.trim().toLowerCase())) rồi filter(selected.length === 0 || m.genre.some(g => selected.includes(g))).',
        'TicketBookingPage: Promise.all([get showtimes?movieId, get rooms, get tickets, get users]) ⇒ sort theo startTime. Ghế khoá = tickets.filter(t => t.showTimeId === suất.id && ["booked","paid"].includes(t.status)). Giá VIP = Math.round(price * 1.2).',
        'Tạo vé: kiểm user/suất/ghế ⇒ setCreating(true) ⇒ await Promise.all(ghế.map(seat => axios.post("/tickets", {...}))) ⇒ alert ⇒ setSelectedSeats([]) ⇒ GET /tickets lại ⇒ finally setCreating(false).',
      ],
      loiHayGap: [
        'Gửi nguyên <code>?status=now-showing</code> lên json-server ⇒ mảng rỗng (dữ liệu lưu <code>NOW_SHOWING</code>, json-server so khớp đúng từng ký tự) — mất cả 1,5 điểm phần lấy dữ liệu.',
        'Rút thể loại từ danh sách ĐÃ lọc theo status ⇒ ở <code>?status=stopped</code> chỉ còn 2 thể loại; đề yêu cầu lấy từ TẤT CẢ phim.',
        'Dùng <code>includes</code> thay vì <code>startsWith</code>, hoặc quên <code>trim()</code> ⇒ gõ "tar" vẫn ra Avatar, gõ " inc" không ra Inception.',
        'Lọc thể loại kiểu "đủ mọi thể loại đã tick" (<code>every</code>) thay vì "ít nhất một" (<code>some</code>).',
        'Dùng <code>&lt;Route path="/tickets/create/:movie_id"&gt;</code> hoặc <code>useParams</code> — movie_id là QUERY string (<code>?movie_id=</code>), phải đọc bằng <code>useSearchParams</code>.',
        'Sắp suất chiếu sau khi đã định dạng "DD/MM/YYYY" ⇒ so chuỗi sai thứ tự; sắp trên <code>startTime</code> gốc.',
        'Khoá cả ghế có vé <code>"canceled"</code>, hoặc chỉ khoá <code>"paid"</code> mà quên <code>"booked"</code>.',
        'Gửi vé mới với <code>showtimeId</code> (t thường) ⇒ ghế vừa đặt không bao giờ chuyển xám vì sơ đồ lọc theo <code>showTimeId</code>.',
        'Gửi MỘT POST chứa mảng ghế, hoặc quên tải lại tickets sau khi đặt ⇒ ghế vừa đặt vẫn chọn được.',
        '<code>bookedAt: new Date()</code> (object) thay vì <code>new Date().toISOString()</code>; quên <code>finally</code> ⇒ lỗi mạng làm nút kẹt mãi ở "Creating...".',
      ],
      thuatNgu: [
        { en: 'showtime', vi: 'suất chiếu' },
        { en: 'seat map', vi: 'sơ đồ ghế' },
        { en: 'query string', vi: 'chuỗi tham số sau dấu ? trên URL (?status=…&movie_id=…)' },
        { en: 'fallback route (*)', vi: 'route dự phòng — khớp mọi đường dẫn chưa khai báo' },
        { en: 'concurrent requests (Promise.all)', vi: 'các request chạy song song, chờ tất cả xong' },
        { en: 'ascending chronological order', vi: 'thứ tự thời gian tăng dần (sớm trước)' },
        { en: 'pending', vi: 'đang chờ phản hồi của API' },
        { en: 'boutique cinema', vi: 'rạp chiếu phim nhỏ, cao cấp' },
        ...tn('queryParam', 'redirect', 'derived', 'caseInsensitive', 'validate', 'payload', 'rubric'),
      ],
      giaiThich: {
        en: '<p>Q1 is three <code>&lt;Route&gt;</code>s; the catch-all <code>path="*"</code> renders <code>&lt;Navigate to="/movies" replace /&gt;</code>, which also covers <code>/</code>.</p><p>MovieListPage keeps two lists: the status list (<code>GET /movies?status=…</code>, re-fetched when the URL changes — note <code>now-showing</code> ⇒ <code>NOW_SHOWING</code>) and the genre list built from ALL movies with a <code>Set</code>. What is shown is <i>derived</i> from the status list, the trimmed lower-case search (<code>startsWith</code>) and the ticked genres (<code>some</code>) — no extra state.</p><p>TicketBookingPage loads showtimes/rooms/tickets/users with one <code>Promise.all</code>, sorts showtimes on the raw <code>startTime</code>, and derives everything else: the room of the chosen showtime, the locked seats (tickets of that showtime with status booked/paid), the colours and the total (VIP × 1.2). Booking validates, flips <code>creating</code>, sends one POST per seat, then alerts, clears the selection and re-reads <code>/tickets</code> so the new seats lock; <code>finally</code> always releases the button.</p>',
        vi: '<p>Câu 1 là ba <code>&lt;Route&gt;</code>; route bắt-tất-cả <code>path="*"</code> trả <code>&lt;Navigate to="/movies" replace /&gt;</code>, nên <code>/</code> cũng về /movies.</p><p>MovieListPage giữ hai danh sách: danh sách theo status (<code>GET /movies?status=…</code>, gọi lại khi URL đổi — nhớ <code>now-showing</code> ⇒ <code>NOW_SHOWING</code>) và danh sách thể loại dựng từ TẤT CẢ phim bằng <code>Set</code>. Thứ hiện ra là giá trị <i>suy ra</i> từ danh sách theo status, chuỗi tìm đã trim + chữ thường (<code>startsWith</code>) và các thể loại đã tick (<code>some</code>) — không thêm state.</p><p>TicketBookingPage tải showtimes/rooms/tickets/users bằng một <code>Promise.all</code>, sắp suất chiếu trên <code>startTime</code> gốc, còn lại đều suy ra: phòng của suất đang chọn, ghế bị khoá (vé của suất đó có status booked/paid), màu ghế và tổng tiền (VIP × 1,2). Đặt vé: kiểm hợp lệ, bật <code>creating</code>, gửi mỗi ghế một POST, rồi alert, bỏ chọn và đọc lại <code>/tickets</code> để ghế mới bị khoá; <code>finally</code> luôn mở lại nút.</p>',
      },
      tests: { loai: 'react', phienBan: 1, tepChinh: 'src/index.js', thuVien: ['react-router-dom', 'react-bootstrap', 'bootstrap'], url: '/movies', jsonServer: { base: B, db: DB }, thangDiem: THANG_DIEM, kiem: KIEM, loiGiaiSauKhiDat: true },
      khoiDau: KHOI_DAU,
      loiGiai: LOI_GIAI,
      demo: { tepChinh: 'src/index.js', url: '/movies', css: 'html body{background:#f4f6fb}html body h2{font-size:1.25rem;font-weight:700}html body .card{transition:transform .15s,box-shadow .15s}html body .card:hover{transform:translateY(-3px);box-shadow:0 18px 34px -20px rgba(15,23,42,.55)}html body .card-img-top{height:170px;object-fit:contain;padding:18px;background:linear-gradient(135deg,#e8ecf8,#f8fafc)}html body .card>.btn{margin:4px 14px 14px;width:calc(100% - 28px)}', thay: [['/movie_thumbnail.png', `data:image/svg+xml;base64,${fs.readFileSync(new URL('thumbnail-demo.svg', TN_MUC)).toString('base64')}`]] },
      thamKhao: 'https://reactrouter.com/en/6.26.2/hooks/use-search-params',
    },
  ],
});
