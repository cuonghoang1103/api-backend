/**
 * Kiểm tệp MIDI bằng cách ĐỌC LẠI từng byte.
 *
 * Tệp MIDI sai có triệu chứng rất dễ đổ oan: vài phần mềm dễ tính vẫn mở được,
 * phần mềm khác thì báo hỏng — và người dùng kết luận "FL Studio kén tệp" chứ
 * không nghĩ tệp sai. Nên phải soi byte, không được chỉ kiểm "hàm chạy không nổ".
 */
import { describe, expect, it } from 'vitest';
import { TICK_DEN, caoDoTuTen, maVlq, mauVinahouse, vietMidi } from './midi';

describe('mã VLQ', () => {
  it('số nhỏ ⇒ một byte', () => {
    expect(maVlq(0)).toEqual([0x00]);
    expect(maVlq(127)).toEqual([0x7f]);
  });

  it('⛔ vượt 127 ⇒ nhiều byte, bit cao báo "còn nữa"', () => {
    // Đây là chỗ hay bị viết thành 1 byte rồi tràn âm thầm.
    expect(maVlq(128)).toEqual([0x81, 0x00]);
    expect(maVlq(TICK_DEN)).toEqual([0x83, 0x60]);
    expect(maVlq(0x3fff)).toEqual([0xff, 0x7f]);
    expect(maVlq(0x4000)).toEqual([0x81, 0x80, 0x00]);
  });

  it('số âm thì báo lỗi', () => {
    expect(() => maVlq(-1)).toThrow(/số âm/);
  });
});

describe('tệp MIDI', () => {
  const mot = [{ kenh: 0, not: 60, batDau: 0, dai: TICK_DEN, luc: 100 }];

  it('có đủ hai khối đầu đúng chuẩn SMF', () => {
    const b = vietMidi(mot, 140);
    expect(b.subarray(0, 4).toString('ascii')).toBe('MThd');
    expect(b.readUInt32BE(4)).toBe(6);          // độ dài khối đầu luôn là 6
    expect(b.readUInt16BE(8)).toBe(0);          // định dạng 0
    expect(b.readUInt16BE(10)).toBe(1);         // một rãnh
    expect(b.readUInt16BE(12)).toBe(TICK_DEN);
    expect(b.subarray(14, 18).toString('ascii')).toBe('MTrk');
  });

  it('độ dài khối rãnh khớp số byte thật', () => {
    // Sai chỗ này thì phần mềm đọc hụt hoặc đọc lố — hỏng câm.
    const b = vietMidi(mauVinahouse(69), 140);
    expect(b.readUInt32BE(18)).toBe(b.length - 22);
  });

  it('ghi đúng tempo: 140 BPM ⇒ 428.571 µs mỗi nốt đen', () => {
    const b = vietMidi(mot, 140);
    const i = b.indexOf(Buffer.from([0xff, 0x51, 0x03]));
    expect(i).toBeGreaterThan(0);
    const mps = (b[i + 3]! << 16) | (b[i + 4]! << 8) | b[i + 5]!;
    expect(mps).toBe(Math.round(60_000_000 / 140));
    expect(60_000_000 / mps).toBeCloseTo(140, 2);
  });

  it('kết thúc bằng dấu hết rãnh', () => {
    const b = vietMidi(mot, 140);
    expect(Array.from(b.subarray(-3))).toEqual([0xff, 0x2f, 0x00]);
  });

  it('có cả lệnh bật và lệnh tắt cho mỗi nốt', () => {
    const b = vietMidi(mot, 140);
    expect(b.includes(Buffer.from([0x90, 60, 100]))).toBe(true);
    expect(b.includes(Buffer.from([0x80, 60, 0]))).toBe(true);
  });

  it('⛔ cùng một thời điểm thì TẮT đi trước BẬT', () => {
    /* Hai nốt cùng cao độ nối đuôi nhau: nốt 2 bắt đầu đúng lúc nốt 1 kết
       thúc. Nếu lệnh bật của nốt 2 đi trước lệnh tắt của nốt 1 thì nốt 2 bị
       giết ngay khi vừa vang — người dùng nghe thiếu nốt mà nhìn piano roll
       thì thấy đủ. */
    const b = vietMidi([
      { kenh: 0, not: 60, batDau: 0, dai: TICK_DEN, luc: 100 },
      { kenh: 0, not: 60, batDau: TICK_DEN, dai: TICK_DEN, luc: 100 },
    ], 140);
    const tat = b.indexOf(Buffer.from([0x80, 60, 0]));
    const bat2 = b.indexOf(Buffer.from([0x90, 60, 100]), b.indexOf(Buffer.from([0x90, 60, 100])) + 1);
    expect(tat).toBeLessThan(bat2);
  });

  it('BPM không hợp lệ thì báo lỗi', () => {
    expect(() => vietMidi(mot, 0)).toThrow(/dương/);
  });
});

describe('mẫu vinahouse', () => {
  const mau = mauVinahouse(69); // La

  it('kick đánh đủ bốn phách mỗi ô, bốn ô', () => {
    const kick = mau.filter((n) => n.kenh === 9 && n.not === 36);
    expect(kick).toHaveLength(16);
    for (let i = 0; i < 16; i++) expect(kick[i]!.batDau).toBe(i * TICK_DEN);
  });

  it('clap chỉ vào phách 2 và 4', () => {
    const clap = mau.filter((n) => n.kenh === 9 && n.not === 39);
    expect(clap).toHaveLength(8);
    for (const c of clap) expect((c.batDau / TICK_DEN) % 2).toBe(1);
  });

  it('⛔ bass KHÔNG trùng phách với kick — hai thứ dồn một chỗ là mất lực cả hai', () => {
    const kick = new Set(mau.filter((n) => n.kenh === 9 && n.not === 36).map((n) => n.batDau));
    const bass = mau.filter((n) => n.kenh === 0);
    expect(bass.length).toBeGreaterThan(0);
    for (const b of bass) expect(kick.has(b.batDau)).toBe(false);
  });

  it('bass nằm trong quãng trầm nghe được, bất kể tông nào', () => {
    for (let pc = 0; pc < 12; pc++) {
      for (const n of mauVinahouse(60 + pc).filter((x) => x.kenh === 0)) {
        expect(n.not).toBeGreaterThanOrEqual(28);
        expect(n.not).toBeLessThanOrEqual(47);
      }
    }
  });

  it('bass theo đúng tông của bài', () => {
    const la = mauVinahouse(69).find((n) => n.kenh === 0)!;
    const do_ = mauVinahouse(60).find((n) => n.kenh === 0)!;
    expect(la.not % 12).toBe(69 % 12);
    expect(do_.not % 12).toBe(0);
  });

  it('đổi được số ô nhịp', () => {
    expect(mauVinahouse(69, 8).filter((n) => n.kenh === 9 && n.not === 36)).toHaveLength(32);
  });
});

describe('tên nốt sang cao độ', () => {
  it('đọc được nốt thường, thăng và giáng', () => {
    expect(caoDoTuTen('C')).toBe(60);
    expect(caoDoTuTen('A')).toBe(69);
    expect(caoDoTuTen('F#')).toBe(66);
    expect(caoDoTuTen('Bb')).toBe(70);
  });

  it('bỏ qua hậu tố thứ — "Am" vẫn là nốt La', () => {
    expect(caoDoTuTen('Am')).toBe(69);
    expect(caoDoTuTen('F#m')).toBe(66);
  });

  it('chuỗi lạ trả null chứ không đoán bừa', () => {
    expect(caoDoTuTen('H')).toBeNull();
    expect(caoDoTuTen('')).toBeNull();
  });
});
