/**
 * Vẽ giúp → ⚡ Mạch điện — BỘ KIỂM phần dọn cấu trúc model trả.
 *
 * Chạy: `npx tsx --test src/services/voMach.service.test.ts`
 *
 * Mẫu thử là đúng ca làm lộ lỗi 01/10/2026: nối mic INMP441 + ampli
 * MAX98357A + loa vào ESP32-S3 của robot Odin. Điều phải giữ bằng mọi giá:
 * số chân ra khỏi bộ dọn GIỐNG HỆT số chân đi vào.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { donMach, maMau, mauTheoChan, sachChu, MAU } from './voMach.service.js';

/** Thứ một model "ngoan" trả về cho đề mic + loa — kể cả vài tật thật của model. */
const MIC_LOA = {
  tieuDe: 'Odin — nối mic + loa',
  chinh: 'esp',
  khoi: [
    { id: 'esp', ten: 'ESP32-S3', phu: 'trên shield MKE-B01', loai: 'mcu',
      chan: ['GPIO 4', 'GPIO 5', 'GPIO 6', 'GPIO 7', 'GPIO 15', 'GPIO 16', '3V3', '5V', 'GND'] },
    { id: 'mic', ten: 'INMP441', phu: 'micro', loai: 'cam_bien', chan: ['SCK', 'WS', 'L/R', 'SD', 'VDD', 'GND'] },
    // Tật 1: quên liệt kê hai cực loa ở khối ampli nhưng vẫn dùng trong dây.
    { id: 'amp', ten: 'MAX98357A', phu: 'ampli', loai: 'module', chan: ['LRC', 'BCLK', 'DIN', 'GAIN', 'SD', 'GND', 'Vin'] },
    { id: 'loa', ten: 'LOA', phu: 'loa ⌀65', loai: 'loa', chan: ['+', '−'] },
  ],
  day: [
    { tu: { khoi: 'mic', chan: 'SCK' }, toi: { khoi: 'esp', chan: 'GPIO 4' }, mau: 'vàng' },
    // Tật 2: viết dính "GPIO5" trong dây trong khi khối ghi "GPIO 5".
    { tu: { khoi: 'mic', chan: 'WS' }, toi: { khoi: 'esp', chan: 'GPIO5' }, mau: 'xanh lá' },
    { tu: { khoi: 'mic', chan: 'SD' }, toi: { khoi: 'esp', chan: 'GPIO 6' }, mau: 'xanh dương' },
    { tu: { khoi: 'mic', chan: 'VDD' }, toi: { khoi: 'esp', chan: '3V3' } },
    // Tật 3: đảo chiều — đầu bo chính nằm ở "tu".
    { tu: { khoi: 'esp', chan: 'GND' }, toi: { khoi: 'mic', chan: 'GND' } },
    { tu: { khoi: 'mic', chan: 'L/R' }, toi: { khoi: 'mic', chan: 'GND' }, nhan: 'BẮT BUỘC' },
    { tu: { khoi: 'amp', chan: 'DIN' }, toi: { khoi: 'esp', chan: 'GPIO 7' }, mau: 'tím' },
    { tu: { khoi: 'amp', chan: 'BCLK' }, toi: { khoi: 'esp', chan: 'GPIO 15' }, mau: 'xám' },
    { tu: { khoi: 'amp', chan: 'LRC' }, toi: { khoi: 'esp', chan: 'GPIO 16' }, mau: 'nâu' },
    { tu: { khoi: 'amp', chan: 'Vin' }, toi: { khoi: 'esp', chan: '5V' } },
    { tu: { khoi: 'amp', chan: 'GND' }, toi: { khoi: 'esp', chan: 'GND' } },
    { tu: { khoi: 'amp', chan: '+' }, toi: { khoi: 'loa', chan: '+' }, mau: 'hồng' },
    { tu: { khoi: 'amp', chan: '−' }, toi: { khoi: 'loa', chan: '−' }, mau: 'xanh ngọc', nhan: 'KHÔNG nối GND' },
    // Tật 4: dây trỏ vào khối không tồn tại — phải bị bỏ, không làm hỏng cả sơ đồ.
    { tu: { khoi: 'ma', chan: 'X' }, toi: { khoi: 'esp', chan: 'GPIO 1' } },
  ],
  deHo: [
    { khoi: 'amp', chan: 'GAIN' },
    { khoi: 'amp', chan: 'SD', nhan: 'nối GND là loa câm' },
    // Tật 5: bảo "để hở" một chân đang có dây — dây thắng.
    { khoi: 'mic', chan: 'SCK' },
  ],
  linhKien: [
    { loai: 'tu_hoa', giaTri: '1000µF', a: { khoi: 'amp', chan: 'Vin' }, b: { khoi: 'amp', chan: 'GND' }, nhan: 'nên có' },
    { loai: 'tu_khong_co', a: { khoi: 'amp', chan: 'Vin' }, b: { khoi: 'amp', chan: 'GND' } },
  ],
  ghiChuChan: [
    { khoi: 'esp', chan: '3V3', nhan: 'khối 3V3 của shield' },
    { khoi: 'esp', chan: '5V', nhan: 'hàng 5V của shield' },
  ],
  canhBao: ['⛔ Mic chỉ dùng 3V3. Cấp 5V là chết mic.', 'Dây − của loa đi thẳng vào loa, không bao giờ nối GND.'],
};

test('số chân đi ra giống hệt đi vào — đúng ca 01/10', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề');
  assert.ok(m);
  const ra = m.day.filter((d) => d.toi.khoi === 'esp' && /^GPIO/.test(d.toi.chan)).map((d) => `${d.tu.chan}>${d.toi.chan}`);
  assert.deepEqual(ra, ['SCK>GPIO 4', 'WS>GPIO 5', 'SD>GPIO 6', 'DIN>GPIO 7', 'BCLK>GPIO 15', 'LRC>GPIO 16']);
});

test('"GPIO5" trong dây khớp vào "GPIO 5" của khối, không đẻ chân thứ hai', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  const esp = m.khoi.find((k) => k.id === 'esp')!;
  assert.equal(esp.chan.filter((c) => c.replace(/\s/g, '') === 'GPIO5').length, 1);
});

test('dây đảo chiều được lật lại: đầu bo chính luôn là `toi`', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  for (const d of m.day) if (d.tu.khoi === 'esp' || d.toi.khoi === 'esp') assert.equal(d.toi.khoi, 'esp');
});

test('chân dùng trong dây mà quên liệt kê ở khối thì được thêm vào khối', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  const amp = m.khoi.find((k) => k.id === 'amp')!;
  assert.ok(amp.chan.includes('+'));
  assert.ok(amp.chan.includes('-'), `chân âm phải được đổi − → - cho phông nét đơn: ${amp.chan}`);
});

test('dây trỏ vào khối không tồn tại bị bỏ, phần còn lại nguyên vẹn', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  assert.equal(m.day.length, 13);
  assert.ok(!m.day.some((d) => d.toi.chan === 'GPIO 1'));
});

test('màu: đề nói thì theo đề; không nói thì nguồn theo tên chân', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  const mau = (tu: string, chan: string) => m.day.find((d) => d.tu.khoi === tu && d.tu.chan === chan)!;
  assert.equal(mau('mic', 'SCK').tenMau, 'vàng');
  assert.equal(mau('mic', 'WS').tenMau, 'lục');
  assert.equal(mau('mic', 'SD').tenMau, 'lam');
  assert.equal(mau('mic', 'VDD').mau, MAU.do.hex);
  assert.equal(mau('mic', 'GND').tenMau, 'đen');
  assert.equal(mau('amp', 'Vin').tenMau, 'cam');
  assert.equal(mau('amp', '-').tenMau, 'xanh ngọc');
});

test('để hở: chân đang có dây không bị đánh dấu để hở', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  assert.deepEqual(m.deHo.map((d) => d.chan), ['GAIN', 'SD']);
  assert.equal(m.deHo[1].nhan, 'nối GND là loa câm');
});

test('linh kiện: loại lạ bị bỏ, µF đổi thành uF', () => {
  const m = donMach(structuredClone(MIC_LOA), 'đề')!;
  assert.equal(m.linhKien.length, 1);
  assert.equal(m.linhKien[0].giaTri, '1000uF');
});

test('linh kiện nằm giữa hai khối mà thiếu dây thì tự thêm sợi dây mang nó', () => {
  const m = donMach({
    chinh: 'uno',
    khoi: [{ id: 'uno', ten: 'Arduino Uno', loai: 'mcu', chan: ['D13', 'GND'] },
      { id: 'led', ten: 'LED đỏ', loai: 'led', chan: ['+', '-'] }],
    day: [{ tu: { khoi: 'led', chan: '-' }, toi: { khoi: 'uno', chan: 'GND' } }],
    linhKien: [{ loai: 'dien_tro', giaTri: '220Ω', a: { khoi: 'uno', chan: 'D13' }, b: { khoi: 'led', chan: '+' } }],
  }, 'led')!;
  assert.equal(m.day.length, 2);
  const tren = m.day.find((d) => d.toi.chan === 'D13')!;
  assert.equal(tren.tu.khoi, 'led', 'đầu bo chính phải là `toi`');
  assert.equal(m.linhKien[0].giaTri, '220ohm');
});

test('không có `chinh` hợp lệ thì lấy khối mcu, không có mcu thì khối nhiều dây nhất', () => {
  const a = donMach({ ...structuredClone(MIC_LOA), chinh: 'khong_co' }, 'đề')!;
  assert.equal(a.chinh, 'esp');
  const b = donMach({
    khoi: [{ id: 'pin', ten: 'Pin 3S', loai: 'pin', chan: ['P+', 'P-'] },
      { id: 'bms', ten: 'BMS 3S', loai: 'nguon', chan: ['B+', 'B-', 'P+', 'P-'] },
      { id: 'sw', ten: 'Công tắc', loai: 'cong_tac', chan: ['1', '2'] }],
    day: [{ tu: { khoi: 'pin', chan: 'P+' }, toi: { khoi: 'bms', chan: 'B+' } },
      { tu: { khoi: 'pin', chan: 'P-' }, toi: { khoi: 'bms', chan: 'B-' } },
      { tu: { khoi: 'sw', chan: '1' }, toi: { khoi: 'bms', chan: 'P+' } }],
  }, 'nguồn')!;
  assert.equal(b.chinh, 'bms');
});

test('có vi điều khiển thì nó LÀ bo chính, kể cả khi model chọn module nhiều dây hơn (ca L298N 01/10)', () => {
  const m = donMach({
    chinh: 'l298n',
    khoi: [{ id: 'esp', ten: 'ESP32', loai: 'mcu', chan: ['GPIO 25', 'GND'] },
      { id: 'l298n', ten: 'L298N', loai: 'module', chan: ['IN1', 'GND', 'OUT1', 'OUT2'] },
      { id: 'dc', ten: 'Động cơ', loai: 'dong_co', chan: ['M+', 'M-'] }],
    day: [{ tu: { khoi: 'l298n', chan: 'IN1' }, toi: { khoi: 'esp', chan: 'GPIO 25' } },
      { tu: { khoi: 'l298n', chan: 'GND' }, toi: { khoi: 'esp', chan: 'GND' } },
      { tu: { khoi: 'l298n', chan: 'OUT1' }, toi: { khoi: 'dc', chan: 'M+' } },
      { tu: { khoi: 'l298n', chan: 'OUT2' }, toi: { khoi: 'dc', chan: 'M-' } }],
  }, 'l298n')!;
  assert.equal(m.chinh, 'esp');
  assert.ok(m.day.filter((d) => d.toi.khoi === 'esp' || d.tu.khoi === 'esp').every((d) => d.toi.khoi === 'esp'));
});

test('đề rỗng / thiếu khối / không có dây → null, không dựng sơ đồ rỗng', () => {
  assert.equal(donMach(null, 'x'), null);
  assert.equal(donMach({ khoi: [{ id: 'a', ten: 'A' }] }, 'x'), null);
  assert.equal(donMach({ khoi: [{ id: 'a', ten: 'A' }, { id: 'b', ten: 'B' }], day: [] }, 'x'), null);
});

test('nhận diện màu: có dấu, không dấu, tiếng Anh, "xanh" trơn', () => {
  assert.equal(maMau('Đỏ'), 'do');
  assert.equal(maMau('xanh lá cây'), 'luc');
  assert.equal(maMau('xanh ngọc'), 'ngoc');
  assert.equal(maMau('Xanh'), 'lam');
  assert.equal(maMau('black'), 'den');
  assert.equal(maMau('dây đỏ đậm'), 'do');
  assert.equal(maMau('???'), null);
  assert.equal(maMau(undefined), null);
});

test('màu theo chân nguồn', () => {
  assert.equal(mauTheoChan('GND'), 'den');
  assert.equal(mauTheoChan('AGND'), 'den');
  assert.equal(mauTheoChan('3V3'), 'do');
  assert.equal(mauTheoChan('3.3V'), 'do');
  assert.equal(mauTheoChan('5V'), 'cam');
  assert.equal(mauTheoChan('VIN'), 'cam');
  assert.equal(mauTheoChan('GPIO 4'), null);
  assert.equal(mauTheoChan('-'), null, 'cực âm loa KHÔNG phải GND — tô đen là dạy sai');
});

test('dọn chữ cho phông nét đơn: ký hiệu điện tử đổi sang chữ viết được', () => {
  assert.equal(sachChu('1000µF', 20), '1000uF');
  assert.equal(sachChu('220Ω', 20), '220ohm');
  assert.equal(sachChu('loa ⌀65', 20), 'loa phi 65');
  assert.equal(sachChu('chân ① → ②', 20), 'chân 1 -> 2');
  assert.equal(sachChu('5V · 2A', 20), '5V - 2A');
});
