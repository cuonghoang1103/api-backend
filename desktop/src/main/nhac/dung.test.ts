/**
 * Kiểm bộ dựng mashup.
 *
 * Đây là chỗ ba phép quy đổi gặp nhau (cắt · kéo · xếp), và sai ở bất kỳ phép
 * nào cũng ra một tệp NGHE ĐƯỢC — chỉ là lệch nhịp, sai tông, hoặc thiếu mất
 * một mảnh. Không có tiếng nổ nào để mà nghe ra, nên phải chốt bằng con số.
 */
import { describe, expect, it } from 'vitest';
import {
  baoFade, daiBanDung, daiSauKeo, dungBan, khoaNguon, nuaCungGan, tiLeManh,
} from './dung';
import type { BanDung, Manh, NguonManh } from './dung';

const FS = 44_100;

function manh(p: Partial<Manh> = {}): Manh {
  return {
    id: 'm1', baiId: 'a', nguon: 'goc',
    tuGiay: 0, denGiay: 1, datGiay: 0,
    gainDb: 0, vaoGiay: 0, raGiay: 0,
    ...p,
  };
}

/** Một bài giả: sin đều, để đo được biên độ ở bất kỳ chỗ nào. */
function bai(giay: number, bien = 0.5, bpm = 120, chuAm: number | null = 9): NguonManh {
  const n = Math.round(giay * FS);
  const k = new Float32Array(n);
  for (let i = 0; i < n; i++) k[i] = bien * Math.sin((2 * Math.PI * 220 * i) / FS);
  return { am: { kenh: [k], tanSoMau: FS }, bpm, chuAm };
}

/** Đỉnh của một khoảng mẫu — dùng để hỏi "chỗ này có tiếng không". */
function dinh(k: Float32Array, tu: number, den: number): number {
  let m = 0;
  for (let i = Math.max(0, tu); i < Math.min(k.length, den); i++) {
    const v = Math.abs(k[i]!);
    if (v > m) m = v;
  }
  return m;
}

describe('dịch tông theo quãng ngắn nhất', () => {
  it('⭐ đi lên 5 chọn +5, đi lên 7 chọn −5', () => {
    /* La (9) → Rê (2): +5 hoặc −7. Phải chọn +5 — WSOLA càng dịch xa càng
       lạo xạo, và hai đường ra CÙNG một tông nên không có gì phải cân nhắc. */
    expect(nuaCungGan(9, 2)).toBe(5);
    expect(nuaCungGan(2, 9)).toBe(-5);
  });

  it('luôn nằm trong [−6, +6]', () => {
    for (let a = 0; a < 12; a++) {
      for (let b = 0; b < 12; b++) {
        const d = nuaCungGan(a, b);
        expect(Math.abs(d)).toBeLessThanOrEqual(6);
        /* Và nó phải THẬT SỰ tới nơi. */
        expect(((a + d) % 12 + 12) % 12).toBe(b);
      }
    }
  });

  it('cùng tông thì không dịch', () => {
    expect(nuaCungGan(7, 7)).toBe(0);
  });
});

describe('tỉ lệ kéo và độ dài', () => {
  it('⭐ bài CHẬM kéo lên nhịp nhanh thì NGẮN lại', () => {
    /* Đảo dấu ở đây là mọi mảnh dài sai và cả bản dựng lệch nhịp — mà tệp
       xuất ra vẫn nghe được, chỉ là sai. */
    expect(tiLeManh(120, 140)).toBeCloseTo(120 / 140, 6);
    expect(tiLeManh(120, 140)).toBeLessThan(1);
    expect(tiLeManh(140, 120)).toBeGreaterThan(1);
  });

  it('nhịp gốc bằng 0 (không dò được) thì không kéo', () => {
    expect(tiLeManh(0, 140)).toBe(1);
  });

  it('độ dài sau kéo tính trên đoạn ĐÃ CẮT', () => {
    expect(daiSauKeo(manh({ tuGiay: 10, denGiay: 18 }), 0.5)).toBe(4);
  });

  it('⭐ độ dài bản dựng là mảnh KẾT THÚC muộn nhất, không phải mảnh cuối danh sách', () => {
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [
        manh({ id: 'a', datGiay: 30, tuGiay: 0, denGiay: 4 }),
        manh({ id: 'b', datGiay: 0, tuGiay: 0, denGiay: 10 }),
      ],
    };
    expect(daiBanDung(bd, { 'a/goc': { bpm: 120 } })).toBe(34);
  });

  it('bài thiếu trong bảng nguồn vẫn được tính vào độ dài', () => {
    /* Bỏ qua nó thì bản dựng NGẮN đi âm thầm, và mảnh cuối bị cắt cụt. */
    const bd: BanDung = { bpm: 120, chuAm: null, manh: [manh({ datGiay: 5, denGiay: 3 })] };
    expect(daiBanDung(bd, {})).toBe(8);
  });
});

describe('đường bao fade', () => {
  it('không fade thì phẳng 1 từ đầu tới cuối', () => {
    const b = baoFade(100, 0, 0);
    expect(b[0]).toBe(1);
    expect(b[99]).toBe(1);
  });

  it('⭐ đẳng công suất: hai đường bao chồng nhau cho tổng công suất PHẲNG', () => {
    /* Đây là cả lý do không dùng đường thẳng. Với fade tuyến tính thì tổng
       công suất ở điểm giữa tụt còn 0,707 — nghe ra như một cái hụt hơi giữa
       hai bài. */
    const n = 1000;
    const ra = baoFade(n, 0, n);      // mảnh trước: fade ra suốt
    const vao = baoFade(n, n, 0);     // mảnh sau: fade vào suốt
    for (const i of [0, 250, 500, 750, 999]) {
      const cs = ra[i]! ** 2 + vao[i]! ** 2;
      expect(cs, `mẫu ${i}`).toBeCloseTo(1, 5);
    }
  });

  it('bắt đầu từ 0 và kết thúc ở 0 khi có fade hai đầu', () => {
    const b = baoFade(200, 50, 50);
    expect(b[0]).toBeCloseTo(0, 6);
    expect(b[199]).toBeLessThan(0.05);
    expect(b[100]).toBeCloseTo(1, 6);
  });

  it('⭐ fade vào + fade ra dài hơn cả mảnh thì CO LẠI, không chồng nhau', () => {
    /* Chồng nhau thì đoạn giữa bị nhân hai đường bao và mảnh tụt gần im ở
       đúng giữa — triệu chứng trông như "mảnh này bị mất tiếng". */
    const b = baoFade(100, 80, 80);
    let cao = 0;
    for (const v of b) cao = Math.max(cao, v);
    expect(cao).toBeGreaterThan(0.9);
  });

  it('không có mẫu nào âm hay vượt 1', () => {
    for (const b of [baoFade(50, 10, 10), baoFade(30, 60, 5), baoFade(7, 3, 3)]) {
      for (const v of b) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1); }
    }
  });
});

describe('dựng cả bản', () => {
  const nguon: Record<string, NguonManh> = {
    'a/goc': bai(4, 0.5, 120), 'b/goc': bai(4, 0.5, 120),
  };

  it('⭐ mảnh nằm ĐÚNG chỗ đã đặt — im trước, có tiếng sau', () => {
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [manh({ id: 'x', baiId: 'a', tuGiay: 0, denGiay: 1, datGiay: 2 })],
    };
    const kq = dungBan(bd, nguon, FS);
    expect(kq.daDung).toEqual(['x']);
    expect(dinh(kq.am.kenh[0]!, 0, FS * 2 - 100)).toBe(0);
    expect(dinh(kq.am.kenh[0]!, FS * 2 + 100, FS * 3 - 100)).toBeGreaterThan(0.3);
    expect(dinh(kq.am.kenh[0]!, FS * 3 + 100, FS * 4)).toBe(0);
  });

  it('⭐ hai mảnh chồng nhau thì CỘNG, không đè', () => {
    /* Đè thì mảnh sau xoá mảnh trước và cú chuyển bài biến mất — mà tệp vẫn
       ra bình thường. */
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [
        manh({ id: 'x', baiId: 'a', tuGiay: 0, denGiay: 1, datGiay: 0 }),
        manh({ id: 'y', baiId: 'b', tuGiay: 0, denGiay: 1, datGiay: 0 }),
      ],
    };
    const kq = dungBan(bd, nguon, FS);
    expect(kq.daDung).toHaveLength(2);
    expect(kq.dinhTruoc).toBeGreaterThan(0.9);
  });

  it('gain âm làm mảnh nhỏ đi đúng theo dB', () => {
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [manh({ baiId: 'a', tuGiay: 0, denGiay: 1, gainDb: -6 })],
    };
    const kq = dungBan(bd, nguon, FS);
    expect(kq.dinhTruoc).toBeCloseTo(0.5 * 10 ** (-6 / 20), 2);
  });

  it('⭐ kéo quá xa thì BỎ mảnh và NÓI RA, không lặng lẽ kéo bừa', () => {
    /* 60 → 180 BPM là tỉ lệ 0,33: WSOLA ra tiếng như băng cối hỏng. Thà bỏ và
       nói lý do còn hơn trả về một mảnh không nghe nổi mà không báo gì. */
    const bd: BanDung = { bpm: 180, chuAm: null, manh: [manh({ baiId: 'c' })] };
    const kq = dungBan(bd, { 'c/goc': bai(4, 0.5, 60) }, FS);
    expect(kq.daDung).toEqual([]);
    expect(kq.boQua[0]?.viSao).toMatch(/ngoài khoảng nghe được/);
    expect(kq.boQua[0]?.viSao).toContain('60.0 BPM');
  });

  it('mảnh mất bài nguồn thì bỏ kèm lý do', () => {
    const bd: BanDung = { bpm: 120, chuAm: null, manh: [manh({ baiId: 'khong-co' })] };
    const kq = dungBan(bd, nguon, FS);
    expect(kq.daDung).toEqual([]);
    expect(kq.boQua[0]?.viSao).toMatch(/Không còn bài nguồn/);
  });

  it('đoạn cắt rỗng hoặc ngược đầu thì bỏ kèm lý do', () => {
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [manh({ id: 'r', baiId: 'a', tuGiay: 2, denGiay: 2 })],
    };
    expect(dungBan(bd, nguon, FS).boQua[0]?.viSao).toMatch(/rỗng/);
  });

  it('cắt vượt quá cuối bài thì lấy tới hết bài chứ không ném', () => {
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [manh({ id: 'q', baiId: 'a', tuGiay: 3, denGiay: 99 })],
    };
    const kq = dungBan(bd, nguon, FS);
    expect(kq.daDung).toEqual(['q']);
  });

  it('⭐ nguồn mono vào bản dựng stereo thì KHÔNG để im một bên', () => {
    const stereo: NguonManh = {
      am: { kenh: [bai(2).am.kenh[0]!, bai(2).am.kenh[0]!], tanSoMau: FS }, bpm: 120, chuAm: 9,
    };
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [
        manh({ id: 's', baiId: 's', tuGiay: 0, denGiay: 1, datGiay: 0 }),
        manh({ id: 'm', baiId: 'a', tuGiay: 0, denGiay: 1, datGiay: 1 }),
      ],
    };
    const kq = dungBan(bd, { 's/goc': stereo, 'a/goc': nguon['a/goc']! }, FS);
    expect(kq.am.kenh).toHaveLength(2);
    /* Mảnh mono đặt ở giây 1: cả hai kênh phải có tiếng. */
    expect(dinh(kq.am.kenh[0]!, FS + 100, FS * 2 - 100)).toBeGreaterThan(0.3);
    expect(dinh(kq.am.kenh[1]!, FS + 100, FS * 2 - 100)).toBeGreaterThan(0.3);
  });

  it('bản dựng rỗng vẫn trả về âm thanh hợp lệ chứ không ném', () => {
    const kq = dungBan({ bpm: 128, chuAm: null, manh: [] }, {}, FS);
    expect(kq.am.kenh).toHaveLength(1);
    expect(kq.daDung).toEqual([]);
    expect(kq.dinhTruoc).toBe(0);
  });

  it('⭐ KHÔNG tự hạn biên — `dinhTruoc` phải nói được là đã cộng quá tay', () => {
    /* Hạn biên ngay trong này thì con số đó bị chính bộ hạn biên xoá đi, và
       giao diện hết đường báo "bản dựng của bạn vượt trần 40%". */
    const to = bai(2, 0.9, 120);
    const bd: BanDung = {
      bpm: 120, chuAm: null,
      manh: [
        manh({ id: '1', baiId: 't', tuGiay: 0, denGiay: 1, datGiay: 0 }),
        manh({ id: '2', baiId: 't', tuGiay: 0, denGiay: 1, datGiay: 0 }),
      ],
    };
    const kq = dungBan(bd, { 't/goc': to }, FS);
    expect(kq.dinhTruoc).toBeGreaterThan(1);
  });

  it('⭐ hai mảnh CÙNG BÀI khác ĐƯỜNG lấy đúng tiếng của đường mình', () => {
    /* Tra theo `baiId` không thôi thì mảnh thứ hai nhận nhầm tiếng của mảnh
       thứ nhất — bản dựng vẫn nghe được, chỉ là sai đường, không có lỗi nào
       để thấy. Ở đây hai đường có biên độ khác hẳn nhau nên đo ra ngay. */
    const kq = dungBan(
      {
        bpm: 120, chuAm: null,
        manh: [
          manh({ id: 'to', baiId: 'z', nguon: 'drums', tuGiay: 0, denGiay: 1, datGiay: 0 }),
          manh({ id: 'nho', baiId: 'z', nguon: 'vocals', tuGiay: 0, denGiay: 1, datGiay: 2 }),
        ],
      },
      { 'z/drums': bai(2, 0.8, 120), 'z/vocals': bai(2, 0.1, 120) },
      FS,
    );
    expect(kq.daDung).toHaveLength(2);
    expect(dinh(kq.am.kenh[0]!, 100, FS - 100)).toBeGreaterThan(0.6);
    expect(dinh(kq.am.kenh[0]!, FS * 2 + 100, FS * 3 - 100)).toBeLessThan(0.2);
  });

  it('khoá nguồn ghép bài với đường', () => {
    expect(khoaNguon({ baiId: 'abc', nguon: 'drums' })).toBe('abc/drums');
  });
});
