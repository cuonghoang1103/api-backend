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
