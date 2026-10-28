/**
 * Dự án xuyên suốt FER202 — "CT Booking" (đặt phòng tự học thư viện FPT). Mỗi chương một mốc; mốc N bắt đầu từ
 * LỜI GIẢI của mốc N−1 (khoiDau = loiGiai mốc trước + tệp khung mới). Tệp này giữ dữ liệu + mã nguồn dùng chung.
 * ´ = dấu huyền, @{ = ${ (doiDau đổi lại).
 */

export const ROOMS = [
  { id: 1, name: 'Room A1', capacity: 4, floor: 1, features: ['TV'] },
  { id: 2, name: 'Room A2', capacity: 6, floor: 1, features: ['Whiteboard', 'TV'] },
  { id: 3, name: 'Room B1', capacity: 8, floor: 2, features: ['Whiteboard'] },
];

export const BOOKINGS = [
  { id: 1, roomId: 1, student: 'HE180001', name: 'An', start: '08:00', end: '09:30', purpose: 'SWT301 review' },
  { id: 2, roomId: 1, student: 'HE180002', name: 'Binh', start: '10:00', end: '11:00', purpose: 'FER202 project' },
  { id: 3, roomId: 2, student: 'HE180003', name: 'Cuong', start: '09:00', end: '10:30', purpose: 'Group meeting' },
];

const json = (v) => JSON.stringify(v, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'");

/** data.js dạng script (mốc 2) và dạng ES module (mốc 3+) */
export const DATA_SCRIPT = `// data.js — dữ liệu mẫu (đã cho)
const ROOMS = ${json(ROOMS)};

const BOOKINGS = ${json(BOOKINGS)};
`;
export const DATA_MODULE = `// src/data/seed.js — dữ liệu mẫu (đã cho)
export const ROOMS = ${json(ROOMS)};

export const BOOKINGS = ${json(BOOKINGS)};
`;

/** Lõi nghiệp vụ (mốc 2) — thân hàm dùng chung cho bản script và bản module */
const DOMAIN_BODY = (ex) => `const OPEN = '08:00';
const CLOSE = '17:00';
const MAX_MINUTES = 120;

// '08:30' ⇒ 510 phút kể từ 00:00
${ex}function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// 510 ⇒ '08:30'
${ex}function toTime(minutes) {
  return ´@{String(Math.floor(minutes / 60)).padStart(2, '0')}:@{String(minutes % 60).padStart(2, '0')}´;
}

// hai khoảng [start, end) chồng nhau khi mỗi cái bắt đầu trước khi cái kia kết thúc
${ex}function overlaps(a, b) {
  return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
}

// danh sách lỗi (rỗng = hợp lệ); chỉ so trùng với booking CÙNG phòng, khác id
${ex}function validateBooking(booking, existing = []) {
  const errors = [];
  const s = toMinutes(booking.start);
  const e = toMinutes(booking.end);
  if (s >= e) errors.push('Start must be before end');
  if (s < toMinutes(OPEN) || e > toMinutes(CLOSE)) errors.push('Outside opening hours (08:00–17:00)');
  if (e - s > MAX_MINUTES) errors.push('Maximum 2 hours per booking');
  const clash = existing.some((x) => x.roomId === booking.roomId && x.id !== booking.id && overlaps(x, booking));
  if (clash) errors.push('Overlaps with an existing booking');
  return errors;
}

// giờ bắt đầu của các ô trống step phút trong giờ mở cửa
${ex}function freeSlots(roomId, bookings, step = 30) {
  const taken = bookings.filter((b) => b.roomId === roomId);
  const slots = [];
  for (let t = toMinutes(OPEN); t + step <= toMinutes(CLOSE); t += step) {
    const slot = { start: toTime(t), end: toTime(t + step) };
    if (!taken.some((b) => overlaps(b, slot))) slots.push(slot.start);
  }
  return slots;
}

// { roomId: số booking } bằng reduce, không sửa dữ liệu vào
${ex}function countByRoom(bookings) {
  return bookings.reduce((acc, b) => ({ ...acc, [b.roomId]: (acc[b.roomId] ?? 0) + 1 }), {});
}

// bản sao đã sắp: theo phòng rồi theo giờ bắt đầu
${ex}function sortBookings(list) {
  return [...list].sort((a, b) => a.roomId - b.roomId || toMinutes(a.start) - toMinutes(b.start));
}

// '08:00–09:30 (90 min)'
${ex}function formatRange({ start, end }) {
  return ´@{start}–@{end} (@{toMinutes(end) - toMinutes(start)} min)´;
}

// cộng phút vào một giờ: addMinutes('09:30', 60) ⇒ '10:30'
${ex}function addMinutes(time, minutes) {
  return toTime(toMinutes(time) + minutes);
}
`;

export const DOMAIN_SCRIPT = `// booking.js — lõi nghiệp vụ CT Booking: hàm THUẦN, dùng lại ở mọi mốc sau
${DOMAIN_BODY('')}`;
export const DOMAIN_MODULE = `// src/domain/booking.js — lõi nghiệp vụ từ mốc 2 (ES module)
${DOMAIN_BODY('export ')}`;

export const CSS = `/* src/index.css — CT Booking (đã cho) */
body { font-family: system-ui, sans-serif; margin: 0; background: #f1f5f9; color: #0f172a; }
main { padding: 20px; max-width: 1100px; margin: auto; }
.rooms { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.room-card { background: #fff; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
.room-card.selected { outline: 3px solid #2563eb; }
.feature { display: inline-block; background: #e0f2fe; color: #075985; border-radius: 999px; padding: 1px 8px; font-size: 12px; margin-right: 4px; }
.booking-row { font-size: 14px; padding: 3px 0; border-bottom: 1px dashed #e2e8f0; }
.slot { margin: 2px; padding: 3px 8px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; }
.slot.active { background: #2563eb; color: #fff; border-color: #2563eb; }
.error { color: #dc2626; font-size: 13px; margin: 2px 0; }
.success { color: #15803d; }
`;

/**
 * Dựng bản in cho một mốc dự án. o = { moc, chuong, en, vi (tiêu đề), moTa:{en,vi}, cay, wireframe?, chucNang[],
 * idBatBuoc[], truDiem[], phut, nopBai }
 */
export function banInMoc(o) {
  return {
    tieuDe: { en: `CT BOOKING · MILESTONE ${o.moc}: ${o.en}`, vi: `CT BOOKING · MỐC ${o.moc}: ${o.vi}` },
    phu: {
      en: `FER202 running project · Chapter ${o.chuong} · Builds on milestone ${o.moc - 1 >= 2 ? o.moc - 1 : '—'} · Suggested time: ${o.phut} minutes · Total: 10 marks`,
      vi: `Dự án xuyên suốt FER202 · Chương ${o.chuong} · Tiếp nối mốc ${o.moc - 1 >= 2 ? o.moc - 1 : '—'} · Thời gian gợi ý: ${o.phut} phút · Tổng: 10 điểm`,
    },
    moTa: o.moTa,
    chucNangChinh: [{ en: o.chucNang.map((c) => c.ten.en).join(' · '), vi: o.chucNang.map((c) => c.ten.vi).join(' · ') }],
    yeuCauChung: [
      { en: 'Start from your solution of the previous milestone (the starter already contains it). Keep the ids/classes printed below — the grader uses them.', vi: 'Bắt đầu từ lời giải mốc trước (starter đã chứa sẵn). Giữ đúng id/class in bên dưới — máy chấm dùng chúng.' },
      ...(o.yeuCauThem ?? []),
    ],
    cayThuMuc: o.cay,
    ...(o.wireframe ? { wireframe: o.wireframe } : {}),
    moHinh: {
      ten: 'Room · Booking',
      truong: [
        ['Room', '{ id, name, capacity, floor, features: string[] }', ''],
        ['Booking', "{ id, roomId, student, name, start: 'HH:MM', end: 'HH:MM', purpose }", { en: 'opening hours 08:00–17:00 · max 2 h · no overlap in the same room', vi: 'giờ mở cửa 08:00–17:00 · tối đa 2 giờ · không trùng giờ cùng phòng' }],
      ],
    },
    chucNang: o.chucNang,
    idBatBuoc: o.idBatBuoc,
    truDiem: o.truDiem,
    nopBai: o.nopBai,
  };
}

// ─────────────────────────── MỐC 3 (JSX) ───────────────────────────
export const APP_M3 = `// src/App.js — mốc 3: hiển thị phòng + lịch hôm nay bằng JSX (chưa có state)
import { BOOKINGS, ROOMS } from './data/seed';
import { countByRoom, formatRange, freeSlots, sortBookings } from './domain/booking';

const counts = countByRoom(BOOKINGS);

export default function App() {
  const sorted = sortBookings(BOOKINGS);
  return (
    <main>
      <h1 id="title">CT Booking</h1>
      <p id="summary">{ROOMS.length} rooms · {BOOKINGS.length} bookings today</p>
      <div className="rooms">
        {ROOMS.map((room) => {
          const list = sorted.filter((b) => b.roomId === room.id);
          const free = freeSlots(room.id, BOOKINGS);
          const n = counts[room.id] ?? 0;
          return (
            <article key={room.id} className="room-card" id={´room-@{room.id}´}>
              <h2 className="room-name">{room.name}</h2>
              <p className="room-meta">{room.capacity} seats · Floor {room.floor}</p>
              <div className="features">
                {room.features.map((f) => <span key={f} className="feature">{f}</span>)}
              </div>
              <p className="room-count">{n} {n === 1 ? 'booking' : 'bookings'} today</p>
              {list.length === 0 ? (
                <p className="no-bookings">No bookings yet</p>
              ) : (
                <ul className="schedule">
                  {list.map((b) => (
                    <li key={b.id} className="booking-row">{formatRange(b)} · {b.name} · {b.purpose}</li>
                  ))}
                </ul>
              )}
              <p className="first-free">{free.length > 0 ? ´First free slot: @{free[0]}´ : 'Fully booked'}</p>
            </article>
          );
        })}
      </div>
    </main>
  );
}
`;

// ─────────────────────────── MỐC 4 (React-Bootstrap) ───────────────────────────
export const APP_M4 = `// src/App.js — mốc 4: cùng dữ liệu, giao diện React-Bootstrap đáp ứng
import { Badge, Card, Col, Container, ListGroup, Navbar, Row } from 'react-bootstrap';
import { BOOKINGS, ROOMS } from './data/seed';
import { countByRoom, formatRange, freeSlots, sortBookings } from './domain/booking';

const counts = countByRoom(BOOKINGS);

export default function App() {
  const sorted = sortBookings(BOOKINGS);
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md" id="app-nav">
        <Container>
          <Navbar.Brand id="title">CT Booking</Navbar.Brand>
          <Navbar.Text id="summary" className="text-white">{ROOMS.length} rooms · {BOOKINGS.length} bookings today</Navbar.Text>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Row className="g-3">
          {ROOMS.map((room) => {
            const list = sorted.filter((b) => b.roomId === room.id);
            const free = freeSlots(room.id, BOOKINGS);
            const n = counts[room.id] ?? 0;
            return (
              <Col key={room.id} xs={12} md={6} lg={4}>
                <Card className="room-card h-100 shadow-sm" id={´room-@{room.id}´}>
                  <Card.Body>
                    <Card.Title className="room-name">{room.name}</Card.Title>
                    <Card.Subtitle className="room-meta mb-2 text-muted">{room.capacity} seats · Floor {room.floor}</Card.Subtitle>
                    <div className="mb-2">
                      {room.features.map((f) => <Badge key={f} bg="info" className="feature me-1">{f}</Badge>)}
                    </div>
                    <Card.Text className="room-count">{n} {n === 1 ? 'booking' : 'bookings'} today</Card.Text>
                  </Card.Body>
                  {list.length === 0 ? (
                    <Card.Body className="pt-0"><p className="no-bookings text-muted mb-0">No bookings yet</p></Card.Body>
                  ) : (
                    <ListGroup variant="flush" className="schedule">
                      {list.map((b) => (
                        <ListGroup.Item key={b.id} className="booking-row">{formatRange(b)} · {b.name} · {b.purpose}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                  <Card.Footer>
                    <Badge bg={free.length > 0 ? 'success' : 'danger'} className="first-free">
                      {free.length > 0 ? ´First free slot: @{free[0]}´ : 'Fully booked'}
                    </Badge>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
}
`;

// ─────────────────────────── MỐC 5 (component · props · state) ───────────────────────────
export const M5_FILES = {
  'src/components/Schedule.js': `// src/components/Schedule.js — danh sách lượt đặt của một phòng
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import { formatRange } from '../domain/booking';

export default function Schedule({ bookings }) {
  if (bookings.length === 0) return <p className="no-bookings text-muted mb-0 px-3">No bookings yet</p>;
  return (
    <ListGroup variant="flush" className="schedule">
      {bookings.map((b) => (
        <ListGroup.Item key={b.id} className="booking-row">{formatRange(b)} · {b.name} · {b.purpose}</ListGroup.Item>
      ))}
    </ListGroup>
  );
}

Schedule.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired, start: PropTypes.string.isRequired, end: PropTypes.string.isRequired }),
  ).isRequired,
};
`,
  'src/components/RoomCard.js': `// src/components/RoomCard.js — thẻ phòng: chỉ hiển thị + báo cha khi được chọn
import PropTypes from 'prop-types';
import { Badge, Button, Card } from 'react-bootstrap';
import Schedule from './Schedule';

export default function RoomCard({ room, bookings, freeCount, firstFree, selected, onSelect }) {
  const n = bookings.length;
  return (
    <Card className={´room-card h-100 shadow-sm@{selected ? ' selected border-primary' : ''}´} id={´room-@{room.id}´}>
      <Card.Body>
        <Card.Title className="room-name">{room.name}</Card.Title>
        <Card.Subtitle className="room-meta mb-2 text-muted">{room.capacity} seats · Floor {room.floor}</Card.Subtitle>
        <div className="mb-2">
          {room.features.map((f) => <Badge key={f} bg="info" className="feature me-1">{f}</Badge>)}
        </div>
        <Card.Text className="room-count">{n} {n === 1 ? 'booking' : 'bookings'} today</Card.Text>
      </Card.Body>
      <Schedule bookings={bookings} />
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <Badge bg={freeCount > 0 ? 'success' : 'danger'} className="first-free">
          {freeCount > 0 ? ´First free slot: @{firstFree}´ : 'Fully booked'}
        </Badge>
        <Button size="sm" className="btn-select" variant={selected ? 'primary' : 'outline-primary'} disabled={freeCount === 0} onClick={() => onSelect(room.id)}>
          {selected ? 'Selected' : 'Select'}
        </Button>
      </Card.Footer>
    </Card>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    floor: PropTypes.number.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  bookings: PropTypes.array.isRequired,
  freeCount: PropTypes.number.isRequired,
  firstFree: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};
`,
  'src/components/SlotPicker.js': `// src/components/SlotPicker.js — component ĐIỀU KHIỂN: cha giữ value, con báo onChange
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

export default function SlotPicker({ slots, value, onChange }) {
  if (slots.length === 0) return <p className="text-muted">No free slots</p>;
  return (
    <div className="slot-picker">
      {slots.map((s) => (
        <Button key={s} size="sm" className="slot me-1 mb-1" variant={s === value ? 'primary' : 'outline-primary'} active={s === value} onClick={() => onChange(s)}>
          {s}
        </Button>
      ))}
    </div>
  );
}

SlotPicker.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
`,
};

export const APP_M5 = `// src/App.js — mốc 5: chia component, state "phòng đang chọn" + "ô đang chọn"
import { useState } from 'react';
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import RoomCard from './components/RoomCard';
import SlotPicker from './components/SlotPicker';
import { BOOKINGS, ROOMS } from './data/seed';
import { addMinutes, freeSlots, sortBookings } from './domain/booking';

export default function App() {
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const sorted = sortBookings(BOOKINGS);
  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? null;

  const selectRoom = (id) => {
    setSelectedRoomId(id);
    setSelectedSlot(null); // đổi phòng ⇒ ô cũ không còn ý nghĩa
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md" id="app-nav">
        <Container>
          <Navbar.Brand id="title">CT Booking</Navbar.Brand>
          <Navbar.Text id="summary" className="text-white">{ROOMS.length} rooms · {BOOKINGS.length} bookings today</Navbar.Text>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Row className="g-3">
          {ROOMS.map((room) => {
            const free = freeSlots(room.id, BOOKINGS);
            return (
              <Col key={room.id} xs={12} md={6} lg={4}>
                <RoomCard
                  room={room}
                  bookings={sorted.filter((b) => b.roomId === room.id)}
                  freeCount={free.length}
                  firstFree={free[0]}
                  selected={room.id === selectedRoomId}
                  onSelect={selectRoom}
                />
              </Col>
            );
          })}
        </Row>
        {selectedRoom && (
          <Card className="mt-4" id="selected-panel">
            <Card.Body>
              <Card.Title id="selected-room">Selected: {selectedRoom.name}</Card.Title>
              <SlotPicker slots={freeSlots(selectedRoom.id, BOOKINGS)} value={selectedSlot} onChange={setSelectedSlot} />
              <p id="selected-slot" className="mt-2 mb-2">
                {selectedSlot ? ´Selected slot: @{selectedSlot}–@{addMinutes(selectedSlot, 30)}´ : 'Choose a start time'}
              </p>
              <Button id="clear-selection" variant="link" onClick={() => selectRoom(null)}>Clear selection</Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
`;

// ─────────────────────────── MỐC 6 (form · sự kiện) ───────────────────────────
export const BOOKING_FORM_M6 = `// src/components/BookingForm.js — form đặt phòng: một state object, một handler, lỗi theo ô + luật nghiệp vụ
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { addMinutes, validateBooking } from '../domain/booking';

const EMPTY = { name: '', student: '', duration: '60', purpose: '' };

export function fieldErrors(values, slot) {
  const e = {};
  if (!slot) e.slot = 'Choose a start time first';
  if (values.name.trim().length < 2) e.name = 'Name is required';
  if (!/^[A-Z]{2}\\d{6}$/.test(values.student.trim())) e.student = 'Student code looks like HE180001';
  if (values.purpose.trim().length < 5) e.purpose = 'Purpose needs at least 5 characters';
  return e;
}

export default function BookingForm({ room, slot, bookings, onBook, initial = EMPTY }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [ruleErrors, setRuleErrors] = useState([]);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const fe = fieldErrors(values, slot);
    setErrors(fe);
    setRuleErrors([]);
    if (Object.keys(fe).length > 0) return;
    const booking = {
      roomId: room.id,
      student: values.student.trim(),
      name: values.name.trim(),
      start: slot,
      end: addMinutes(slot, Number(values.duration)),
      purpose: values.purpose.trim(),
    };
    const rules = validateBooking(booking, bookings);
    if (rules.length > 0) {
      setRuleErrors(rules);
      return;
    }
    onBook(booking);
    setValues({ ...EMPTY, ...initial });
  };

  return (
    <Form id="booking-form" noValidate onSubmit={handleSubmit}>
      {errors.slot && <p className="error" id="err-slot">{errors.slot}</p>}
      <Form.Group className="mb-2" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control name="name" value={values.name} onChange={handleChange} isInvalid={!!errors.name} />
        {errors.name && <p className="error" id="err-name">{errors.name}</p>}
      </Form.Group>
      <Form.Group className="mb-2" controlId="student">
        <Form.Label>Student code</Form.Label>
        <Form.Control name="student" value={values.student} onChange={handleChange} isInvalid={!!errors.student} />
        {errors.student && <p className="error" id="err-student">{errors.student}</p>}
      </Form.Group>
      <Form.Group className="mb-2" controlId="duration">
        <Form.Label>Duration</Form.Label>
        <Form.Select name="duration" value={values.duration} onChange={handleChange}>
          <option value="30">30 min</option>
          <option value="60">60 min</option>
          <option value="90">90 min</option>
          <option value="120">120 min</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-2" controlId="purpose">
        <Form.Label>Purpose</Form.Label>
        <Form.Control name="purpose" value={values.purpose} onChange={handleChange} isInvalid={!!errors.purpose} />
        {errors.purpose && <p className="error" id="err-purpose">{errors.purpose}</p>}
      </Form.Group>
      {ruleErrors.map((m) => <p key={m} className="error rule-error">{m}</p>)}
      <Button id="btn-book" type="submit">Book {room.name}</Button>
    </Form>
  );
}

BookingForm.propTypes = {
  room: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired }).isRequired,
  slot: PropTypes.string,
  bookings: PropTypes.array.isRequired,
  onBook: PropTypes.func.isRequired,
  initial: PropTypes.object,
};
`;

export const APP_M6 = `// src/App.js — mốc 6: bookings thành state; form đặt phòng thêm lượt mới (cập nhật thẻ, lịch, ô trống)
import { useState } from 'react';
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import RoomCard from './components/RoomCard';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import { BOOKINGS, ROOMS } from './data/seed';
import { addMinutes, formatRange, freeSlots, sortBookings } from './domain/booking';

export default function App() {
  const [bookings, setBookings] = useState(BOOKINGS);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');
  const sorted = sortBookings(bookings);
  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? null;

  const selectRoom = (id) => {
    setSelectedRoomId(id);
    setSelectedSlot(null);
    setMessage('');
  };

  const book = (booking) => {
    const id = Math.max(0, ...bookings.map((b) => b.id)) + 1;
    const saved = { ...booking, id };
    setBookings((list) => [...list, saved]);
    setSelectedSlot(null);
    setMessage(´Booked @{selectedRoom.name} @{formatRange(saved).split(' (')[0]} for @{saved.name}´);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md" id="app-nav">
        <Container>
          <Navbar.Brand id="title">CT Booking</Navbar.Brand>
          <Navbar.Text id="summary" className="text-white">{ROOMS.length} rooms · {bookings.length} bookings today</Navbar.Text>
        </Container>
      </Navbar>
      <Container className="py-4">
        {message && <p id="booking-success" className="success">{message}</p>}
        <Row className="g-3">
          {ROOMS.map((room) => {
            const free = freeSlots(room.id, bookings);
            return (
              <Col key={room.id} xs={12} md={6} lg={4}>
                <RoomCard
                  room={room}
                  bookings={sorted.filter((b) => b.roomId === room.id)}
                  freeCount={free.length}
                  firstFree={free[0]}
                  selected={room.id === selectedRoomId}
                  onSelect={selectRoom}
                />
              </Col>
            );
          })}
        </Row>
        {selectedRoom && (
          <Card className="mt-4" id="selected-panel">
            <Card.Body>
              <Card.Title id="selected-room">Selected: {selectedRoom.name}</Card.Title>
              <SlotPicker slots={freeSlots(selectedRoom.id, bookings)} value={selectedSlot} onChange={setSelectedSlot} />
              <p id="selected-slot" className="mt-2 mb-2">
                {selectedSlot ? ´Selected slot: @{selectedSlot}–@{addMinutes(selectedSlot, 30)}´ : 'Choose a start time'}
              </p>
              <BookingForm key={selectedRoom.id} room={selectedRoom} slot={selectedSlot} bookings={bookings} onBook={book} />
              <Button id="clear-selection" variant="link" onClick={() => selectRoom(null)}>Clear selection</Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
`;

// ─────────────────────────── MỐC 7 (Context) ───────────────────────────
export const M7_FILES = {
  'src/context/BookingContext.js': `// src/context/BookingContext.js — bookings dùng chung cả app (thay cho props truyền nhiều tầng)
import { createContext, useContext, useMemo, useState } from 'react';
import { BOOKINGS } from '../data/seed';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(BOOKINGS);

  const value = useMemo(() => {
    const addBooking = (booking) => {
      const saved = { ...booking, id: Math.max(0, ...bookings.map((b) => b.id)) + 1 };
      setBookings((list) => [...list, saved]);
      return saved;
    };
    const cancelBooking = (id) => setBookings((list) => list.filter((b) => b.id !== id));
    return { bookings, addBooking, cancelBooking };
  }, [bookings]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used inside BookingProvider');
  return ctx;
}
`,
  'src/context/StudentContext.js': `// src/context/StudentContext.js — sinh viên đang đăng nhập
import { createContext, useContext, useMemo, useState } from 'react';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const value = useMemo(
    () => ({ student, login: (name, code) => setStudent({ name, code }), logout: () => setStudent(null) }),
    [student],
  );
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used inside StudentProvider');
  return ctx;
}
`,
  'src/components/StudentArea.js': `// src/components/StudentArea.js — đăng nhập nhanh bằng tên + mã SV (đọc/ghi qua context)
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useStudent } from '../context/StudentContext';

export default function StudentArea() {
  const { student, login, logout } = useStudent();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  if (student) {
    return (
      <div className="d-flex align-items-center gap-2 text-white">
        <span id="current-student">{student.name} ({student.code})</span>
        <Button id="logout" size="sm" variant="light" onClick={logout}>Log out</Button>
      </div>
    );
  }
  const submit = (e) => {
    e.preventDefault();
    if (name.trim() && /^[A-Z]{2}\\d{6}$/.test(code.trim())) login(name.trim(), code.trim());
  };
  return (
    <Form id="login-form" className="d-flex gap-2" onSubmit={submit}>
      <Form.Control id="login-name" size="sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Form.Control id="login-code" size="sm" placeholder="HE180001" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button id="login" size="sm" variant="light" type="submit">Log in</Button>
    </Form>
  );
}
`,
  'src/components/MyBookings.js': `// src/components/MyBookings.js — lượt đặt của sinh viên đang đăng nhập, có huỷ
import { Button, Card, ListGroup } from 'react-bootstrap';
import { useBookings } from '../context/BookingContext';
import { useStudent } from '../context/StudentContext';
import { ROOMS } from '../data/seed';
import { formatRange, sortBookings } from '../domain/booking';

export default function MyBookings() {
  const { student } = useStudent();
  const { bookings, cancelBooking } = useBookings();
  if (!student) return <p id="my-bookings" className="text-muted">Log in to see your bookings</p>;
  const mine = sortBookings(bookings.filter((b) => b.student === student.code));
  return (
    <Card id="my-bookings" className="mt-4">
      <Card.Header>My bookings ({mine.length})</Card.Header>
      {mine.length === 0 ? (
        <Card.Body className="text-muted">You have no bookings today</Card.Body>
      ) : (
        <ListGroup variant="flush">
          {mine.map((b) => (
            <ListGroup.Item key={b.id} className="my-booking d-flex justify-content-between">
              <span className="my-booking-text">{ROOMS.find((r) => r.id === b.roomId)?.name} · {formatRange(b)}</span>
              <Button size="sm" variant="outline-danger" className="btn-cancel" onClick={() => cancelBooking(b.id)}>Cancel</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card>
  );
}
`,
};

export const APP_M7 = `// src/App.js — mốc 7: Provider bọc app; component đọc bookings/student từ Context
import { useState } from 'react';
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import RoomCard from './components/RoomCard';
import SlotPicker from './components/SlotPicker';
import BookingForm from './components/BookingForm';
import StudentArea from './components/StudentArea';
import MyBookings from './components/MyBookings';
import { BookingProvider, useBookings } from './context/BookingContext';
import { StudentProvider, useStudent } from './context/StudentContext';
import { ROOMS } from './data/seed';
import { addMinutes, formatRange, freeSlots, sortBookings } from './domain/booking';

function Shell() {
  const { bookings, addBooking } = useBookings();
  const { student } = useStudent();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [message, setMessage] = useState('');
  const sorted = sortBookings(bookings);
  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? null;

  const selectRoom = (id) => {
    setSelectedRoomId(id);
    setSelectedSlot(null);
    setMessage('');
  };

  const book = (booking) => {
    const saved = addBooking(booking);
    setSelectedSlot(null);
    setMessage(´Booked @{selectedRoom.name} @{formatRange(saved).split(' (')[0]} for @{saved.name}´);
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="md" id="app-nav">
        <Container>
          <Navbar.Brand id="title">CT Booking</Navbar.Brand>
          <Navbar.Text id="summary" className="text-white me-3">{ROOMS.length} rooms · {bookings.length} bookings today</Navbar.Text>
          <StudentArea />
        </Container>
      </Navbar>
      <Container className="py-4">
        {message && <p id="booking-success" className="success">{message}</p>}
        <Row className="g-3">
          {ROOMS.map((room) => {
            const free = freeSlots(room.id, bookings);
            return (
              <Col key={room.id} xs={12} md={6} lg={4}>
                <RoomCard room={room} bookings={sorted.filter((b) => b.roomId === room.id)} freeCount={free.length} firstFree={free[0]} selected={room.id === selectedRoomId} onSelect={selectRoom} />
              </Col>
            );
          })}
        </Row>
        {selectedRoom && (
          <Card className="mt-4" id="selected-panel">
            <Card.Body>
              <Card.Title id="selected-room">Selected: {selectedRoom.name}</Card.Title>
              <SlotPicker slots={freeSlots(selectedRoom.id, bookings)} value={selectedSlot} onChange={setSelectedSlot} />
              <p id="selected-slot" className="mt-2 mb-2">
                {selectedSlot ? ´Selected slot: @{selectedSlot}–@{addMinutes(selectedSlot, 30)}´ : 'Choose a start time'}
              </p>
              <BookingForm
                key={´@{selectedRoom.id}-@{student?.code ?? 'guest'}´}
                room={selectedRoom}
                slot={selectedSlot}
                bookings={bookings}
                onBook={book}
                initial={student ? { name: student.name, student: student.code } : undefined}
              />
              <Button id="clear-selection" variant="link" onClick={() => selectRoom(null)}>Clear selection</Button>
            </Card.Body>
          </Card>
        )}
        <MyBookings />
      </Container>
    </>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <BookingProvider>
        <Shell />
      </BookingProvider>
    </StudentProvider>
  );
}
`;

// ─────────────────────────── MỐC 8 (Hooks) ───────────────────────────
export const M8_FILES = {
  'src/context/BookingContext.js': `// src/context/BookingContext.js — mốc 8: useReducer + lưu localStorage "ctb-bookings"
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { BOOKINGS } from '../data/seed';

const BookingContext = createContext(null);
const KEY = 'ctb-bookings';

export function bookingsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.booking];
    case 'CANCEL':
      return state.filter((b) => b.id !== action.id);
    default:
      return state;
  }
}

function loadBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved : BOOKINGS;
  } catch {
    return BOOKINGS;
  }
}

export function BookingProvider({ children }) {
  const [bookings, dispatch] = useReducer(bookingsReducer, undefined, loadBookings);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(bookings));
  }, [bookings]);

  const value = useMemo(() => {
    const addBooking = (booking) => {
      const saved = { ...booking, id: Math.max(0, ...bookings.map((b) => b.id)) + 1 };
      dispatch({ type: 'ADD', booking: saved });
      return saved;
    };
    const cancelBooking = (id) => dispatch({ type: 'CANCEL', id });
    return { bookings, addBooking, cancelBooking };
  }, [bookings]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used inside BookingProvider');
  return ctx;
}
`,
  'src/context/StudentContext.js': `// src/context/StudentContext.js — mốc 8: nhớ sinh viên qua localStorage "ctb-student"
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const StudentContext = createContext(null);
const KEY = 'ctb-student';

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (student) localStorage.setItem(KEY, JSON.stringify(student));
    else localStorage.removeItem(KEY);
  }, [student]);

  const value = useMemo(
    () => ({ student, login: (name, code) => setStudent({ name, code }), logout: () => setStudent(null) }),
    [student],
  );
  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used inside StudentProvider');
  return ctx;
}
`,
  'src/hooks/useFreeSlots.js': `// src/hooks/useFreeSlots.js — custom hook: ô trống của một phòng, chỉ tính lại khi bookings/phòng đổi
import { useMemo } from 'react';
import { useBookings } from '../context/BookingContext';
import { freeSlots } from '../domain/booking';

export function useFreeSlots(roomId) {
  const { bookings } = useBookings();
  return useMemo(() => (roomId == null ? [] : freeSlots(roomId, bookings)), [roomId, bookings]);
}
`,
};

// BookingForm mốc 8: focus ô Purpose khi người dùng vừa chọn ô giờ (useRef + useEffect)
export const BOOKING_FORM_M8 = BOOKING_FORM_M6
  .replace("// src/components/BookingForm.js — form đặt phòng: một state object, một handler, lỗi theo ô + luật nghiệp vụ\nimport { useState } from 'react';",
    "// src/components/BookingForm.js — mốc 8: thêm useRef + useEffect focus ô Purpose khi vừa chọn giờ\nimport { useEffect, useRef, useState } from 'react';")
  .replace("  const [ruleErrors, setRuleErrors] = useState([]);\n",
    "  const [ruleErrors, setRuleErrors] = useState([]);\n  const purposeRef = useRef(null);\n\n  useEffect(() => {\n    if (slot && purposeRef.current) purposeRef.current.focus(); // vừa chọn giờ ⇒ gõ mục đích ngay\n  }, [slot]);\n")
  .replace('<Form.Control name="purpose" value={values.purpose}', '<Form.Control ref={purposeRef} name="purpose" value={values.purpose}');

export const APP_M8 = APP_M7
  .replace('// src/App.js — mốc 7: Provider bọc app; component đọc bookings/student từ Context', '// src/App.js — mốc 8: dùng custom hook useFreeSlots cho bảng chọn ô')
  .replace("import { ROOMS } from './data/seed';", "import { ROOMS } from './data/seed';\nimport { useFreeSlots } from './hooks/useFreeSlots';")
  .replace("  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? null;\n", "  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) ?? null;\n  const selectedFree = useFreeSlots(selectedRoomId);\n")
  .replace('<SlotPicker slots={freeSlots(selectedRoom.id, bookings)}', '<SlotPicker slots={selectedFree}');
