/**
 * HIỆU ỨNG DÙNG CHUNG cho mọi game (05/10/2026) — người dùng: "hiệu ứng, đồ hoạ đẹp, 3D tự nhiên,
 * chuyên nghiệp, đừng vuông góc xấu".
 *
 *   phaoGiay(el)                      — pháo giấy bung từ giữa phần tử (thắng, kỷ lục)
 *   phaoGiay(el, { x, y, it: true })  — bụi sao nhỏ tại điểm (ăn điểm, đúng)
 *   diemBay(el, x, y, '+10', '#4ade80') — chữ điểm bay lên rồi mờ dần
 *   rung(el)                          — rung nhẹ khung (sai)
 *
 * Tất cả vẽ trên MỘT lớp canvas phủ (pointer-events: none) gắn vào phần tử, tự gỡ khi xong.
 * Mảnh giấy là hình bo tròn xoay 3D (co giãn theo cos góc lật) + trọng lực + lực cản ⇒ rơi
 * tự nhiên, không phải ô vuông cứng. Tôn trọng prefers-reduced-motion.
 */
const giamChuyenDong = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const MAU = ['#f472b6', '#facc15', '#22d3ee', '#a78bfa', '#4ade80', '#fb923c', '#f87171', '#ffffff'];

type Manh = { x: number; y: number; vx: number; vy: number; lat: number; vLat: number; quay: number; vQuay: number; w: number; h: number; mau: string; song: number; tron: boolean };

export function phaoGiay(el: HTMLElement | null, tuy: { x?: number; y?: number; it?: boolean; mau?: string[] } = {}) {
  if (!el || giamChuyenDong()) return;
  const r = el.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const c = document.createElement('canvas');
  Object.assign(c.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '40' });
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.appendChild(c);
  c.width = r.width * dpr; c.height = r.height * dpr;
  const g = c.getContext('2d');
  if (!g) { c.remove(); return; }
  const ox = (tuy.x ?? r.width / 2) * dpr, oy = (tuy.y ?? r.height / 2) * dpr;
  const it = !!tuy.it;
  const bang = tuy.mau ?? MAU;
  const n = it ? 18 : 120;
  const manh: Manh[] = Array.from({ length: n }, () => {
    const goc = it ? Math.random() * Math.PI * 2 : -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
    const v = (it ? 1.5 + Math.random() * 3 : 6 + Math.random() * 9) * dpr;
    return {
      x: ox, y: oy, vx: Math.cos(goc) * v, vy: Math.sin(goc) * v,
      lat: Math.random() * Math.PI, vLat: 0.08 + Math.random() * 0.22, quay: Math.random() * Math.PI, vQuay: (Math.random() - 0.5) * 0.3,
      w: (it ? 3 + Math.random() * 3 : 6 + Math.random() * 6) * dpr, h: (it ? 3 + Math.random() * 3 : 9 + Math.random() * 7) * dpr,
      mau: bang[Math.floor(Math.random() * bang.length)]!, song: 1, tron: it || Math.random() < 0.35,
    };
  });
  let raf = 0;
  const ve = () => {
    g.clearRect(0, 0, c.width, c.height);
    let con = 0;
    for (const p of manh) {
      if (p.song <= 0) continue;
      con++;
      p.vy += (it ? 0.05 : 0.22) * dpr; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.lat += p.vLat; p.quay += p.vQuay;
      p.song -= it ? 0.025 : 0.007;
      if (p.y > c.height + 40) p.song = 0;
      g.save();
      g.globalAlpha = Math.max(0, Math.min(1, p.song * 1.4));
      g.translate(p.x, p.y);
      g.rotate(p.quay);
      // Lật 3D: co theo cos — mặt sau tối hơn một chút ⇒ cảm giác giấy xoay thật.
      const sc = Math.cos(p.lat);
      g.scale(1, Math.max(0.08, Math.abs(sc)));
      g.fillStyle = p.mau;
      if (sc < 0) g.filter = 'brightness(0.78)';
      g.beginPath();
      if (p.tron) g.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      else { const rr = Math.min(p.w, p.h) * 0.3; g.roundRect?.(-p.w / 2, -p.h / 2, p.w, p.h, rr) ?? g.rect(-p.w / 2, -p.h / 2, p.w, p.h); }
      g.fill();
      g.restore();
    }
    if (con) raf = requestAnimationFrame(ve);
    else c.remove();
  };
  raf = requestAnimationFrame(ve);
  window.setTimeout(() => { cancelAnimationFrame(raf); c.remove(); }, it ? 1600 : 4200);
}

/** Chữ điểm bay lên tại (x, y) — toạ độ trong phần tử. */
export function diemBay(el: HTMLElement | null, x: number, y: number, chu: string, mau = '#4ade80') {
  if (!el) return;
  const d = document.createElement('div');
  d.textContent = chu;
  Object.assign(d.style, {
    position: 'absolute', left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: '41',
    font: '800 18px/1 system-ui, sans-serif', color: mau, textShadow: `0 2px 10px ${mau}88, 0 1px 0 rgba(0,0,0,.4)`, whiteSpace: 'nowrap',
  });
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.appendChild(d);
  if (giamChuyenDong()) { window.setTimeout(() => d.remove(), 600); return; }
  d.animate([
    { opacity: 0, transform: 'translate(-50%, -30%) scale(0.6)' },
    { opacity: 1, transform: 'translate(-50%, -80%) scale(1.15)', offset: 0.25 },
    { opacity: 0, transform: 'translate(-50%, -220%) scale(1)' },
  ], { duration: 900, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => d.remove();
}

/** Rung nhẹ (sai) — biên độ nhỏ, tắt dần. */
export function rung(el: HTMLElement | null) {
  if (!el || giamChuyenDong()) return;
  el.animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' }, { transform: 'translateX(2px)' }, { transform: 'translateX(0)' },
  ], { duration: 360, easing: 'ease-out' });
}
