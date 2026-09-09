/**
 * Khối bối cảnh "hôm nay" cho trợ lý giọng nói.
 *
 * Khối này quyết định câu trả lời cho "hôm nay tôi làm gì?". Sai một con số
 * ở đây là người dùng tới lớp nhầm giờ — và họ tin nó, vì họ hỏi bằng giọng
 * và nghe bằng tai, không nhìn thấy bảng nào để đối chiếu.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { dungKhoi, thuTuNgay, type NguonBoiCanh } from './boiCanhHomNay.js';

const rong: NguonBoiCanh = { buoiHoc: [], lichThi: [], viec: [] };

test('thứ tính đúng, kể cả Chủ nhật (8, không phải 1)', () => {
  // 10/09/2026 là thứ Năm.
  assert.equal(thuTuNgay('2026-09-10'), 5);
  assert.equal(thuTuNgay('2026-09-13'), 8, 'Chủ nhật phải là 8 theo hệ của ClassSchedule');
  assert.equal(thuTuNgay('2026-09-14'), 2, 'thứ Hai = 2');
});

test('⚠️ KHÔNG lệch ngày do múi giờ — cùng ISO phải ra cùng thứ', () => {
  // Container chạy UTC, người dùng ở +07. Neo 12:00Z nên không giờ nào kéo lệch.
  const cu = process.env.TZ;
  for (const tz of ['UTC', 'Asia/Ho_Chi_Minh', 'Pacific/Kiritimati', 'Pacific/Midway']) {
    process.env.TZ = tz;
    assert.equal(thuTuNgay('2026-09-13'), 8, `lệch ở múi giờ ${tz}`);
  }
  process.env.TZ = cu;
});

test('có giờ hiện tại thì nói rõ còn bao nhiêu phút / đang học / đã xong', () => {
  const nguon: NguonBoiCanh = {
    ...rong,
    buoiHoc: [
      { subject: 'Japanese', classCode: 'JPD123', room: 'BE-211', startTime: '10:00', endTime: '12:20' },
      { subject: 'Software Req', classCode: 'SWR302', room: 'DE-412', startTime: '12:50', endTime: '15:10' },
    ],
  };
  const s = dungKhoi(nguon, '2026-09-10', '09:30');
  assert.match(s, /còn 30 phút nữa vào học/);
  const dangHoc = dungKhoi(nguon, '2026-09-10', '11:00');
  assert.match(dangHoc, /ĐANG HỌC/);
  const xong = dungKhoi(nguon, '2026-09-10', '16:00');
  assert.match(xong, /đã xong/);
});

test('không có lịch thì NÓI RA là không có — im lặng để model tự đoán là bịa', () => {
  const s = dungKhoi(rong, '2026-09-10');
  assert.match(s, /không có buổi học nào/);
});

test('việc ưu tiên cao lên trước, và chỉ đếm việc CHƯA xong', () => {
  const s = dungKhoi({
    ...rong,
    viec: [
      { title: 'việc thường', done: false, priority: 0, dueAt: null },
      { title: 'việc GẤP', done: false, priority: 3, dueAt: '23:00' },
      { title: 'đã làm rồi', done: true, priority: 5, dueAt: null },
    ],
  }, '2026-09-10');
  assert.match(s, /Việc chưa xong \(2\)/);
  assert.ok(s.indexOf('việc GẤP') < s.indexOf('việc thường'), 'ưu tiên cao phải đứng trước');
  assert.doesNotMatch(s, /đã làm rồi/, 'việc đã xong không nhồi vào cho tốn token');
  assert.match(s, /hạn 23:00/);
});

test('khối phải NGẮN — mỗi token là thời gian chờ trước khi model mở miệng', () => {
  const s = dungKhoi({
    buoiHoc: Array.from({ length: 4 }, (_, i) => ({
      subject: `Môn số ${i}`, classCode: `MON10${i}`, room: `BE-30${i}`,
      startTime: '07:30', endTime: '09:50',
    })),
    lichThi: [{ monHoc: 'PRO192', loai: 'PE', ngay: '2026-09-20', batDau: '07:30', phong: 'LAB1', soBaoDanh: '42' }],
    viec: Array.from({ length: 30 }, (_, i) => ({ title: `Việc ${i}`, done: false, priority: 0, dueAt: null })),
  }, '2026-09-10', '08:00');
  assert.ok(s.length < 1200, `khối dài ${s.length} ký tự — quá nhiều`);
  // 30 việc nhưng chỉ liệt kê 12: đủ để trả lời, không đủ để làm chậm.
  assert.equal((s.match(/^- Việc /gm) || []).length, 12);
});
