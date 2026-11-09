/**
 * 🔊 Giọng "bập bẹ" của gấu trúc Bíp — tổng hợp bằng Web Audio, KHÔNG gọi API TTS, không tải tệp.
 *
 * Kiểu Animal Crossing: mỗi ÂM TIẾT của câu là một tiếng "bíp" ngắn (70–110 ms), cao độ đi theo
 * nguyên âm + dấu thanh tiếng Việt (sắc vút lên, huyền trầm xuống, hỏi võng, ngã lượn, nặng cụt),
 * nên câu "Giỏi quá đi!" nghe ra đúng nhịp "giỏi-quá-đi" dù không có chữ nào. Mỗi nhân vật một
 * tông giọng (Bíp cao trong, Sensei trầm, Zippy líu lo, Gấu Lười ngái ngủ, Sage ấm).
 *
 * Miệng 3D đồng bộ qua `docMieng()`: trả độ mở 0–1 theo đúng lịch đã đặt cho từng âm tiết — không
 * phân tích tín hiệu, chỉ đọc lịch, nên rẻ và khớp tuyệt đối với tiếng phát ra.
 *
 * Luật: KHÔNG phát trước khi người dùng tương tác với trang (iOS cũng cấm) — `daTuongTac()` theo dõi
 * pointerdown/keydown đầu tiên. Nút tắt tiếng nhớ ở localStorage (try/catch — chế độ riêng tư).
 */

export type GiongGau = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';

const KHOA_TAT = 'langMascotMute';

export function gauTat(): boolean {
  try { return typeof window !== 'undefined' && window.localStorage.getItem(KHOA_TAT) === '1'; } catch { return false; }
}
export function datGauTat(tat: boolean): void {
  try { window.localStorage.setItem(KHOA_TAT, tat ? '1' : '0'); } catch { /* riêng tư — chỉ nhớ trong phiên */ }
}

/* ── Đã tương tác chưa ── */
let tuongTac = false;
if (typeof window !== 'undefined') {
  const bat = () => { tuongTac = true; window.removeEventListener('pointerdown', bat); window.removeEventListener('keydown', bat); };
  window.addEventListener('pointerdown', bat, { passive: true });
  window.addEventListener('keydown', bat);
}
export const daTuongTac = () => tuongTac;

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/* ── Tông giọng từng nhân vật ── */
const GIONG: Record<GiongGau, { nen: number; dao: number; song: OscillatorType; toc: number; am: number }> = {
  //        nền (Hz)  biên độ cao độ  dạng sóng   tốc độ   âm lượng
  bip:    { nen: 520, dao: 1.0, song: 'triangle', toc: 1.0, am: 0.16 },
  sensei: { nen: 330, dao: 0.7, song: 'sine',     toc: 0.9, am: 0.15 },
  zippy:  { nen: 660, dao: 1.3, song: 'triangle', toc: 1.25, am: 0.15 },
  grumpy: { nen: 250, dao: 0.5, song: 'sine',     toc: 0.7, am: 0.14 },
  sage:   { nen: 300, dao: 0.6, song: 'triangle', toc: 0.85, am: 0.15 },
};

/** Dấu thanh của một âm tiết tiếng Việt → đường cao độ [đầu, giữa, cuối] (hệ số nhân). */
function thanh(am: string): [number, number, number] {
  const s = am.normalize('NFD');
  if (/́/.test(s)) return [1.0, 1.12, 1.28];  // sắc ↗
  if (/̀/.test(s)) return [1.0, 0.92, 0.82];  // huyền ↘
  if (/̉/.test(s)) return [1.0, 0.86, 1.02];  // hỏi ↘↗
  if (/̃/.test(s)) return [0.96, 1.18, 1.06]; // ngã ~
  if (/̣/.test(s)) return [0.95, 0.88, 0.84]; // nặng ↓ cụt
  return [1.0, 1.02, 1.0];                          // ngang —
}

/** Nguyên âm chính quyết định "màu" âm tiết: i/ê sáng, u/ô tối, a mở. */
function mauNguyenAm(am: string): number {
  const s = am.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/[iy]/.test(s)) return 1.18;
  if (/e/.test(s)) return 1.08;
  if (/a/.test(s)) return 1.0;
  if (/o/.test(s)) return 0.9;
  if (/u/.test(s)) return 0.84;
  return 1.0;
}

function tachAmTiet(cau: string): string[] {
  return cau
    .replace(/\p{Extended_Pictographic}|\u200d|\ufe0f/gu, ' ')
    .split(/[\s\p{P}\p{S}]+/u)
    .map((x) => x.trim())
    .filter((x) => /\p{L}|\p{N}/u.test(x))
    .slice(0, 28);
}

type Lich = { tu: number; den: number; manh: number }[];
let lich: Lich = [];
let lichGoc = 0;
let hienTai: { dung: () => void } | null = null;

/** Độ mở miệng 0–1 lúc này (đọc mỗi khung hình từ sân khấu 3D). */
export function docMieng(): number {
  if (!ctx || !lich.length) return 0;
  const t = ctx.currentTime - lichGoc;
  for (const m of lich) {
    if (t >= m.tu && t <= m.den) {
      const p = (t - m.tu) / (m.den - m.tu);
      // mở nhanh, khép chậm — hình chuông lệch
      return m.manh * Math.sin(Math.min(1, p * 1.15) * Math.PI);
    }
  }
  return 0;
}

export function dangNoi(): boolean {
  if (!ctx || !lich.length) return false;
  const t = ctx.currentTime - lichGoc;
  return t <= lich[lich.length - 1].den;
}

export function dungNoi(): void {
  hienTai?.dung();
  hienTai = null;
  lich = [];
}

/**
 * Nói một câu. Trả về tổng thời lượng (ms) — 0 nếu không phát (chưa tương tác / tắt tiếng / không có
 * Web Audio); lúc đó gọi nơi dùng vẫn nên cho miệng mấp máy theo nhịp chữ.
 */
export function noi(cau: string, giong: GiongGau = 'bip', o: { camXuc?: 'vui' | 'buon' | 'thuong' } = {}): number {
  if (gauTat() || !daTuongTac()) return 0;
  const ac = audio();
  if (!ac) return 0;
  dungNoi();

  const g = GIONG[giong];
  const amTiet = tachAmTiet(cau);
  if (!amTiet.length) return 0;

  const ra = ac.createGain();
  ra.gain.value = g.am;
  // Lọc bớt gai — tiếng mềm như đồ chơi, không chói.
  const loc = ac.createBiquadFilter();
  loc.type = 'lowpass';
  loc.frequency.value = 2600;
  loc.Q.value = 0.7;
  ra.connect(loc).connect(ac.destination);

  const nodes: AudioScheduledSourceNode[] = [];
  const goc = ac.currentTime + 0.02;
  let t = 0;
  const moi: Lich = [];
  const heCamXuc = o.camXuc === 'buon' ? 0.86 : o.camXuc === 'vui' ? 1.08 : 1;
  const tocBuon = o.camXuc === 'buon' ? 1.25 : 1;

  for (let i = 0; i < amTiet.length; i++) {
    const am = amTiet[i];
    const dai = (0.07 + Math.min(0.05, am.length * 0.009)) / g.toc * tocBuon;
    const [a, b, c] = thanh(am);
    // Ngẫu nhiên nhẹ theo chỉ số để câu không đều tăm tắp như máy.
    const run = 1 + ((((i * 7919) % 13) / 13) - 0.5) * 0.08 * g.dao;
    const nen = g.nen * heCamXuc * run * (1 + (mauNguyenAm(am) - 1) * g.dao);
    const cuoiCau = i === amTiet.length - 1;
    const hoi = /[?]/.test(cau) && cuoiCau ? 1.18 : 1;

    const osc = ac.createOscillator();
    osc.type = g.song;
    osc.frequency.setValueAtTime(nen * a, goc + t);
    osc.frequency.linearRampToValueAtTime(nen * b, goc + t + dai * 0.5);
    osc.frequency.linearRampToValueAtTime(nen * c * hoi, goc + t + dai);
    // Hoạ âm bậc hai rất nhỏ — có "thân" hơn một sóng trần.
    const osc2 = ac.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(nen * a * 2, goc + t);
    osc2.frequency.linearRampToValueAtTime(nen * c * hoi * 2, goc + t + dai);

    const env = ac.createGain();
    env.gain.setValueAtTime(0, goc + t);
    env.gain.linearRampToValueAtTime(1, goc + t + 0.012);
    env.gain.setValueAtTime(1, goc + t + dai * 0.55);
    env.gain.exponentialRampToValueAtTime(0.001, goc + t + dai);
    const env2 = ac.createGain();
    env2.gain.value = 0.18;

    osc.connect(env).connect(ra);
    osc2.connect(env2).connect(env);
    osc.start(goc + t);
    osc2.start(goc + t);
    osc.stop(goc + t + dai + 0.02);
    osc2.stop(goc + t + dai + 0.02);
    nodes.push(osc, osc2);

    moi.push({ tu: t, den: t + dai, manh: 0.55 + 0.45 * mauNguyenAm(am) * (am.length > 2 ? 1 : 0.8) });
    // Nghỉ giữa âm tiết; dài hơn sau dấu phẩy/chấm (ước lượng theo chữ gốc).
    t += dai + 0.035 / g.toc;
    if (cuoiCau) break;
  }

  lich = moi;
  lichGoc = goc;
  hienTai = {
    dung: () => {
      for (const n of nodes) { try { n.stop(); } catch { /* đã dừng */ } }
      try { ra.disconnect(); } catch { /* đã ngắt */ }
    },
  };
  return Math.round(t * 1000);
}

/** Hiệu ứng ngắn không lời (chào, mừng, buồn, ngạc nhiên) — giữ để dùng ở nơi không có câu chữ. */
export function keu(kieu: 'chao' | 'mung' | 'buon' | 'ngac', giong: GiongGau = 'bip'): void {
  const cau = kieu === 'chao' ? 'Chào bạn!' : kieu === 'mung' ? 'Giỏi quá đi!' : kieu === 'buon' ? 'Ôi, tiếc quá.' : 'Ơ, gì vậy?';
  noi(cau, giong, { camXuc: kieu === 'buon' ? 'buon' : kieu === 'mung' ? 'vui' : 'thuong' });
}
