import { describe, it, expect } from 'vitest';
import { CAM_XUC, veGauNoi } from './GauNoi';
import type { OdinMood } from '../features/odin/useOdin';

/** Bối cảnh canvas giả: chỉ đếm số ô được tô. */
function ctxGia() {
  const o = { fillStyle: '', o: 0, fillRect() { o.o += 1; }, clearRect() {} };
  return o;
}

describe('Gấu nổi', () => {
  const ds = Object.keys(CAM_XUC) as OdinMood[];
  it('đủ 11 mood của robot nổi', () => {
    expect(ds.sort()).toEqual(['boiRoi', 'lo', 'matMang', 'mung', 'nghe', 'nghi', 'ngu', 'noi', 'thuong', 'vay', 'vui']);
  });
  it.each(ds)('mood %s vẽ ra con gấu ở mọi thời điểm', (m) => {
    for (const T of [0, 0.3, 1.2, 2.7, 5]) {
      const g = ctxGia();
      veGauNoi(g as unknown as CanvasRenderingContext2D, T, m, false);
      expect(g.o).toBeGreaterThan(150);
    }
  });
});
