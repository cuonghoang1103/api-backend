/**
 * 🐻 Gấu nổi — thân của robot nổi CuongMini (11/11/2026), thay hình robot Odin cũ.
 *
 * Cùng con Gấu pixel với khung chat (`GauPixel`), nhưng nhận đủ 11 `OdinMood` của robot nổi và đổi
 * mỗi mood thành một cảm xúc (mắt + dáng + đạo cụ), chép từ chế độ cảm xúc của Gấu bên web. Bản mẫu
 * user đã duyệt: https://claude.ai/artifact/9HCdc5KhX1n95uBHRhv5Wy
 *
 * Dấu phụ (?, mất mạng, zzz, chấm thông báo, "…" khi đọc) vẫn do `ThanRobot` vẽ ở ngoài — ở đây chỉ con gấu.
 * prefers-reduced-motion ⇒ một khung tĩnh.
 */
import { useEffect, useRef } from 'react';
import type { OdinMood } from '../features/odin/useOdin';
import { BODY, C, MAPCOL, U, eye, makeP } from '../features/chat/GauPixel';

type Dang = 'bob' | 'jump' | 'slump' | 'sit' | 'tilt' | 'lean' | 'startle';
interface CamXuc { mat: string; tai: 0 | 1; dang: Dang; doVat: string[]; noi?: boolean }

/** Mood ⇒ cảm xúc. Đúng bảng trong bản mẫu đã duyệt. */
export const CAM_XUC: Record<OdinMood, CamXuc> = {
  thuong: { mat: 'idle', tai: 0, dang: 'bob', doVat: [] },
  vui: { mat: 'happy', tai: 0, dang: 'jump', doVat: ['star', 'sparkle'] },
  nghi: { mat: 'up', tai: 0, dang: 'tilt', doVat: ['dots'] },
  nghe: { mat: 'open', tai: 0, dang: 'lean', doVat: [] },
  noi: { mat: 'happy', tai: 0, dang: 'bob', doVat: [], noi: true },
  vay: { mat: 'wide', tai: 0, dang: 'startle', doVat: ['sparkle'] },
  mung: { mat: 'happy', tai: 0, dang: 'jump', doVat: ['hat', 'confetti'] },
  lo: { mat: 'sad', tai: 1, dang: 'slump', doVat: ['tear'] },
  boiRoi: { mat: 'open', tai: 1, dang: 'tilt', doVat: ['sweat'] },
  matMang: { mat: 'down', tai: 1, dang: 'sit', doVat: [] },
  ngu: { mat: 'closed', tai: 0, dang: 'sit', doVat: [] },
};

const EC = {
  star: '#ffcf4d', tear: '#6cc3ff', sweat: '#7fd3ff', hat: '#7c5cff', sound: '#8b7cf0', spark: '#ffd264',
  conf: ['#ff6b8a', '#6cc3ff', '#ffd264', '#7bd18a'] as const,
};

function doVat(P: ReturnType<typeof makeP>, T: number, p: string, bx: number, oy: number) {
  if (p === 'sparkle') { if (Math.floor(T * 4) % 2) { P(bx + 16, oy + 1, EC.spark); P(bx - 1, oy + 3, EC.spark); P(bx + 17, oy + 4, EC.spark); } }
  else if (p === 'star') { P(bx + 15, oy - 1, EC.star); P(bx + 14, oy, EC.star, 3, 1); P(bx + 15, oy + 1, EC.star); }
  else if (p === 'tear') { const ty = oy + 6 + Math.floor((T * 6) % 4); P(bx + 3, ty, EC.tear); P(bx + 11, ty - 1, EC.tear); }
  else if (p === 'sweat') { const ty = oy + 2 + Math.floor((T * 5) % 3); P(bx + 15, ty, EC.sweat, 1, 2); }
  else if (p === 'dots') { const n = Math.floor(T * 3) % 4; for (let i = 0; i < n; i++) P(bx + 15 + i, oy + 2, C.k); }
  else if (p === 'confetti') { for (let i = 0; i < 5; i++) { const q = (T * 0.8 + i * 0.3) % 1.4; P(bx + 2 + i * 3, oy - 1 + q * 14, EC.conf[i % 4] ?? EC.spark); } }
  else if (p === 'hat') { P(bx + 6, oy - 3, EC.hat, 4, 1); P(bx + 7, oy - 4, EC.hat, 2, 1); P(bx + 7.5, oy - 5, EC.hat, 1, 1); }
  else if (p === 'sound') { const a = Math.floor(T * 6) % 3; for (let i = 0; i <= a; i++) P(bx + 16 + i, oy + 4 - i * 0.5, EC.sound, 1, 1 + i); }
}

export function veGauNoi(g: CanvasRenderingContext2D, T: number, mood: OdinMood, hover: boolean) {
  const P = makeP(g);
  g.clearRect(0, 0, 22 * U, 22 * U);
  const E = CAM_XUC[mood] ?? CAM_XUC.thuong;
  let by = 5, lean = 0, tanSo = 2.6, bienDo = 0.8;
  if (E.dang === 'jump') { const c = T % 1.8; by = 5 - (c < 0.55 ? Math.round(Math.sin(c / 0.55 * Math.PI) * 7) : 0); }
  else if (E.dang === 'slump') { by = 7; bienDo = 0.5; tanSo = 2.2; }
  else if (E.dang === 'sit') { by = 8; bienDo = 0.4; tanSo = 2; }
  else if (E.dang === 'tilt') { lean = Math.round(Math.sin(T * 2) * 0.6) + 1; }
  else if (E.dang === 'lean') { lean = -1; tanSo = 3.4; }
  else if (E.dang === 'startle') { by = 5 - (((T % 1.4) < 0.2) ? 2 : 0); }
  if (E.noi) { tanSo = 7; bienDo = 1; }
  const bx = 3, oy = by + Math.round(Math.sin(T * tanSo) * bienDo);

  for (let r = 0; r < BODY.length; r++) {
    const row = BODY[r]; if (!row) continue;
    for (let c = 0; c < 16; c++) { const col = MAPCOL[row[c] ?? '.']; if (col) P(bx + c + lean, oy + r, col); }
  }
  const tai = Math.round(Math.sin(T * 2.4));
  if (E.tai) { P(bx + 1 + lean, oy + 2, C.k, 2, 1); P(bx + 11 + lean, oy + 2, C.k, 2, 1); }
  else { P(bx + 2 + lean, oy - tai - 0.5, C.k, 2, 1); P(bx + 10 + lean, oy + tai - 0.5, C.k, 2, 1); }

  const chop = (T % 2.8) > 2.64;
  let mat = E.mat, nhin = 0;
  if (mat === 'idle') {
    // Rê chuột vào ⇒ cười. Không thì nhìn quanh, thỉnh thoảng cười.
    mat = (T % 3.4) > 3.26 ? 'blink' : (hover || Math.sin(T * 0.7) > 0.6 ? 'happy' : 'open');
    nhin = hover ? 0 : Math.round(Math.sin(T * 0.5) * 0.6);
  } else if (chop && mat !== 'closed') mat = 'blink';
  eye(P, bx + 3 + lean, oy + 4, mat, nhin); eye(P, bx + 9 + lean, oy + 4, mat, nhin);
  P(bx + 7 + lean, oy + 6, C.nose, 2, 1);
  P(bx + 1 + lean, oy + 6, C.pk); P(bx + 14 + lean, oy + 6, C.pk);
  for (const p of (E.noi ? [...E.doVat, 'sound'] : E.doVat)) doVat(P, T, p, bx + lean, oy);
}

export function GauNoi({ mood, hover, size }: { mood: OdinMood; hover: boolean; size: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Đọc mood/hover qua ref ⇒ vòng vẽ không phải dựng lại mỗi lần đổi (đổi liên tục khi rê chuột).
  const moi = useRef({ mood, hover });
  moi.current = { mood, hover };

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const g = cv.getContext('2d'); if (!g) return;
    g.imageSmoothingEnabled = false;
    const tinh = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const batDau = performance.now();
    const ve = (now: number) => veGauNoi(g, (now - batDau) / 1000 + 1.2, moi.current.mood, moi.current.hover);
    ve(performance.now());
    if (tinh) return;
    let raf = 0;
    const lap = (t: number) => { ve(t); raf = requestAnimationFrame(lap); };
    raf = requestAnimationFrame(lap);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Giảm chuyển động: vẽ lại khi mood đổi (vòng lặp không chạy).
  useEffect(() => {
    const cv = ref.current; const g = cv?.getContext('2d');
    if (g && typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) veGauNoi(g, 1.2, mood, hover);
  }, [mood, hover]);

  return (
    <canvas
      ref={ref}
      className="rb-gau"
      width={22 * U}
      height={22 * U}
      style={{ width: size, height: size, imageRendering: 'pixelated', display: 'block' }}
      aria-hidden
    />
  );
}
