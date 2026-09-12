/**
 * Kiểm bản tóm tắt dạng sóng.
 *
 * Sai ở đây không nổ, không lỗi — nó chỉ vẽ ra một hình SAI, và người dùng sẽ
 * tin vào hình đó để chọn chỗ cắt. Nên phép kiểm ở đây đo hình dạng, không đo
 * "có chạy không".
 */
import { describe, expect, it } from 'vitest';
import { dangSong, phangHoa } from './dangSong';

/** Sin `chuKy` chu kỳ trọn vẹn trên `n` mẫu, biên độ `a`. */
function sin(n: number, a = 1, chuKy = 1): Float32Array {
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = a * Math.sin((2 * Math.PI * chuKy * i) / n);
  return x;
}

describe('dangSong', () => {
  it('trả đúng số cột đã xin', () => {
    expect(dangSong([sin(10_000)], 300)).toHaveLength(300);
    expect(dangSong([sin(10_000)], 1)).toHaveLength(1);
  });

  it('⭐ giữ ĐỈNH, không lấy trung bình — cú đánh ngắn không được biến mất', () => {
    /* Một cú kick chiếm 200 mẫu trong 100.000 mẫu im lặng. Lấy trung bình thì
       nó thành 0,002 và không thấy gì trên hình; lấy đỉnh thì nó còn nguyên. */
    const x = new Float32Array(100_000);
    for (let i = 500; i < 700; i++) x[i] = 0.9;
    const cot = dangSong([x], 100);
    expect(Math.max(...cot.map((c) => c.max))).toBeCloseTo(0.9, 5);
  });

  it('⭐ giữ CẢ hai phía — sóng lệch phải nhìn ra là lệch', () => {
    /* Tiếng đã qua hạn biên lệch hẳn về một phía. Vẽ bằng |x| gương lên sẽ ra
       một hình cân đối đẹp mà sai hẳn với thứ nằm trong tệp. */
    const x = new Float32Array(1000);
    for (let i = 0; i < 1000; i++) x[i] = i % 2 === 0 ? 0.9 : -0.1;
    const [c] = dangSong([x], 1);
    expect(c!.max).toBeCloseTo(0.9, 5);
    expect(c!.min).toBeCloseTo(-0.1, 5);
  });

  it('gộp mọi kênh: đáy thấp nhất và đỉnh cao nhất của cả hai', () => {
    const L = Float32Array.from([0.5, 0.5]);
    const R = Float32Array.from([-0.8, 0.2]);
    const [c] = dangSong([L, R], 1);
    expect(c!.max).toBeCloseTo(0.5, 5);
    expect(c!.min).toBeCloseTo(-0.8, 5);
  });

  it('⭐ KHÔNG bỏ rơi phần đuôi bài', () => {
    /* Chia bằng `Math.floor(n / cot)` thì 1000 mẫu chia 3 cột ra bước 333 và
       mẫu 999 rơi ra ngoài. Ở bài thật, phần rơi ra là mấy giây cuối. */
    const x = new Float32Array(1000);
    x[999] = 1;
    const cot = dangSong([x], 3);
    expect(cot[2]!.max).toBeCloseTo(1, 5);
  });

  it('xin nhiều cột hơn số mẫu thì không ra Infinity', () => {
    const cot = dangSong([Float32Array.from([0.5, -0.5])], 50);
    expect(cot.every((c) => Number.isFinite(c.min) && Number.isFinite(c.max))).toBe(true);
  });

  it('không có mẫu nào thì trả cột phẳng, không nổ', () => {
    expect(dangSong([new Float32Array(0)], 5)).toEqual(
      Array.from({ length: 5 }, () => ({ min: 0, max: 0 })),
    );
    expect(dangSong([], 5)).toHaveLength(5);
  });

  it('mỗi cột phủ trọn một chu kỳ thì cột nào cũng chạm cả hai đầu', () => {
    /* 20 chu kỳ chia 20 cột ⇒ mỗi cột đúng một chu kỳ. Chia ít chu kỳ hơn số
       cột thì cột ở đỉnh sóng nằm hoàn toàn phía dương — đúng về mặt tín
       hiệu, nên đừng đòi nó âm. */
    const cot = dangSong([sin(48_000, 0.7, 20)], 20);
    for (const c of cot) {
      expect(c.max).toBeCloseTo(0.7, 2);
      expect(c.min).toBeCloseTo(-0.7, 2);
    }
  });
});

describe('phangHoa', () => {
  it('tách thành hai mảng phẳng cùng độ dài', () => {
    const { min, max } = phangHoa(dangSong([sin(1000)], 8));
    expect(min).toHaveLength(8);
    expect(max).toHaveLength(8);
    expect(min[0]).toBeLessThanOrEqual(max[0]!);
  });
});
