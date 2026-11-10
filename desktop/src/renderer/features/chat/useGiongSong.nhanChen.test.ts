import { describe, expect, it } from 'vitest';
import { taoBoNhanChen } from './useGiongSong';

/** Chạy chuỗi mẫu 60 khung/giây; trả mốc (ms) bộ nhận báo chen lời, hoặc null. */
function chay(muc: (t: number) => number, giayToiDa = 6): number | null {
  const nhan = taoBoNhanChen(0);
  for (let t = 0; t <= giayToiDa * 1000; t += 1000 / 60) if (nhan(muc(t), t)) return t;
  return null;
}
/** Tiếng loa vọng: đợt vọt khi micro vừa mở (khử vọng chưa hội tụ) rồi đều đều có nhịp âm tiết. */
const vong = (t: number): number => (t < 300 ? 0.045 : 0.015 + 0.006 * Math.abs(Math.sin(t / 90)));
/** Giọng người: âm tiết 180ms phát / 90ms nghỉ. */
const giong = (t: number): number => ((t % 270) < 180 ? 0.16 : 0.01);

describe('taoBoNhanChen — ngắt lời bằng giọng không tự cắt chính mình', () => {
  it('chỉ có tiếng loa vọng (kể cả đợt vọt lúc mở micro) ⇒ KHÔNG bao giờ báo chen', () => {
    expect(chay(vong)).toBeNull();
  });

  it('bản cũ (ngưỡng 0,05 giữ 250ms) LẼ RA đã cắt — xác nhận ca thử có đợt vọt thật', () => {
    let tu = 0; let cat: number | null = null;
    for (let t = 0; t < 1000 && cat === null; t += 1000 / 60) {
      const r = vong(t) + 0.02;   // loa mở to hơn chút
      if (r > 0.05) { if (!tu) tu = t; else if (t - tu >= 250) cat = t; } else tu = 0;
    }
    expect(cat).not.toBeNull();
    expect(chay((t) => vong(t) + 0.02)).toBeNull();
  });

  it('người dùng nói chen (có quãng nghỉ giữa âm tiết) ⇒ báo trong vòng ~1 giây sau khi bắt đầu nói', () => {
    const batDauNoi = 2000;
    const t = chay((x) => vong(x) + (x >= batDauNoi ? giong(x) : 0));
    expect(t).not.toBeNull();
    expect(t! - batDauNoi).toBeLessThan(1000);
  });

  it('một tiếng ho ngắn (150ms) ⇒ không báo', () => {
    expect(chay((t) => vong(t) + (t >= 2000 && t < 2150 ? 0.3 : 0))).toBeNull();
  });

  it('nói ngay trong 300ms đầu thì chưa xét — nhưng nói tiếp vẫn bị bắt sau khi đo nền', () => {
    expect(chay((t) => vong(t) + (t >= 100 ? giong(t) : 0))).not.toBeNull();
  });
});
