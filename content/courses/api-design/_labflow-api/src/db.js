import { hashPassword } from './passwords.js';
// db.js — "cơ sở dữ liệu" tạm trong RAM. Tắt server là mất; Chương 12 thay bằng PostgreSQL.
export const labs = [
  { id: 'lab_1', code: 'AL-201', name: 'Phòng Lab Mạng máy tính', building: 'Alpha', capacity: 30 },
  { id: 'lab_2', code: 'AL-305', name: 'Phòng Lab IoT', building: 'Alpha', capacity: 24 },
  { id: 'lab_3', code: 'BE-102', name: 'Phòng Lab Phần mềm', building: 'Beta', capacity: 40 },
  { id: 'lab_4', code: 'BE-001', name: 'Phòng máy cũ', building: 'Beta', capacity: 20, retiredAt: '2026-09-01T00:00:00.000Z' },
];

export const devices = [
  { id: 'dev_1', labId: 'lab_1', name: 'Cisco Router 2901', type: 'ROUTER', serialNo: 'FTX1840ALBQ', status: 'AVAILABLE' },
  { id: 'dev_2', labId: 'lab_1', name: 'Cisco Switch 2960', type: 'SWITCH', serialNo: 'FOC1932X0K7', status: 'AVAILABLE' },
  { id: 'dev_3', labId: 'lab_2', name: 'Raspberry Pi 5', type: 'BOARD', serialNo: 'RPI5-00421', status: 'AVAILABLE', note: 'Thiếu thẻ nhớ' },
];

// Chương 6 — mật khẩu học tập (CHỈ để demo, đừng dùng lại): an-lab-2026, binh-lab-2026, lan-lab-2026; lưu dạng băm scrypt
export const users = [
  // Bản ghi NỘI BỘ có nhiều thứ không bao giờ được ra ngoài API (giá trị giả, chỉ để học)
  { id: 'usr_1', name: 'Nguyễn Văn An', role: 'STUDENT', email: 'an@student.labflow.example',
    passwordHash: hashPassword('an-lab-2026'), failedLogins: 0, staffNote: null },
  { id: 'usr_2', name: 'Trần Thị Bình', role: 'STUDENT', email: 'binh@student.labflow.example',
    passwordHash: hashPassword('binh-lab-2026'), failedLogins: 3, staffNote: 'Hay đặt rồi không đến' },
  { id: 'usr_3', name: 'Cô Lan', role: 'LAB_MANAGER', email: 'lan@labflow.example',
    passwordHash: hashPassword('lan-lab-2026'), failedLogins: 0, staffNote: null },
];

// Token giả của Chương 1–5 — từ Chương 6 chỉ còn khi chạy dev (auth.js)
export const tokens = { tok_an: 'usr_1', tok_bin: 'usr_2', tok_lan: 'usr_3' };

import { seedBookings, seedIssues } from './seed.js';

// SEED_BOOKINGS=n ⇒ nạp sẵn n lượt đặt cố định (Chương 3: phân trang)
export const bookings = seedBookings(Number(process.env.SEED_BOOKINGS ?? 0));
export const issues = seedIssues(Number(process.env.SEED_ISSUES ?? 0));   // Lab 1: báo hỏng thiết bị; Lab 3: SEED_ISSUES=n

const counters = { bk: bookings.length, dev: devices.length, iss: issues.length, wl: 0 };
export const nextId = (prefix) => `${prefix}_${++counters[prefix]}`;
