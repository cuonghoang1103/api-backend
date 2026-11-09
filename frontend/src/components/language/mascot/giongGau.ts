/**
 * 🔊 Giọng gấu Bíp — ROBOT DỄ THƯƠNG kiểu WALL-E / EVE (làm lại 09/11/2026 theo ý người dùng), tổng hợp bằng Web
 * Audio, KHÔNG gọi TTS, không tải tệp.
 *
 * Mỗi ÂM TIẾT của câu = một "chirp" líu ríu gồm 2–3 nốt nhỏ nối nhau bằng trượt cao độ (pitch glide), có rung nhẹ
 * (vibrato LFO). Chất robot đến từ RING MODULATION (nhân tín hiệu với sóng ~40–90 Hz ⇒ sinh dải biên "điện tử")
 * và BAND-PASS "formant" (giọng nhỏ, trong, không the thé) + low-pass cắt gai. Ngữ điệu vẫn bám DẤU THANH tiếng Việt
 * (sắc vút, huyền trầm, hỏi võng, ngã lượn, nặng cụt) nên nghe như đang "nói" đúng câu đó; câu hỏi mở đầu bằng
 * quãng hai nốt vút lên kiểu EVE gọi "Wall-E?", câu cảm thán kết bằng nốt nhảy lên.
 *
 * Mỗi nhân vật một tông (bảng `GIONG`). Miệng SVG đồng bộ qua `docMieng()` (đọc lịch âm tiết, không phân tích tín
 * hiệu). Luật: KHÔNG phát trước khi người dùng tương tác (`daTuongTac`); nút loa nhớ ở localStorage (try/catch).
 *
 * ── Chỉnh giọng: sửa `THAM_SO` (chung) và `GIONG` (từng vai). Người nghe thấy "chói" ⇒ hạ `bandHz`/`lowpassHz` hoặc
 * tăng `bandQ`; thấy "ít robot" ⇒ tăng `ringMix` hoặc đổi `ringHz`; thấy "rè" ⇒ giảm `ringMix`; thấy "đều đều" ⇒
 * tăng `chirpBuoc` / `vibratoHz`.
 */

export type GiongGau = 'bip' | 'sensei' | 'zippy' | 'grumpy' | 'sage';

/* ── Tham số chung (người dùng chỉnh tại đây) ── */
export const THAM_SO = {
  /** Âm lượng tổng sau lọc (0–1). */
  amLuong: 0.42,
  /** Tỉ lệ tín hiệu ring-mod trộn với tiếng gốc (0 = không robot, 1 = toàn robot). */
  ringMix: 0.55,
  /** Band-pass "formant": tần số trung tâm (Hz) và độ hẹp Q. */
  bandHz: 1500,
  bandQ: 1.1,
  /** Low-pass cắt gai (Hz). */
  lowpassHz: 3400,
  /** Vibrato: tốc độ (Hz) và độ sâu (tỉ lệ cao độ, 0.012 = ±1,2 %). */
  vibratoHz: 6.2,
  vibratoSau: 0.014,
  /** Chirp: mỗi âm tiết chia 2–3 nốt nhỏ, nốt sau lệch nốt trước bao nhiêu (tỉ lệ). */
  chirpBuoc: 0.09,
  /** Độ dài âm tiết cơ bản (giây) và nghỉ giữa hai âm tiết. */
  daiAmTiet: 0.1,
  nghi: 0.04,
} as const;

/** Tông giọng từng vai. `nen`: cao độ nền (Hz) · `ringHz`: sóng ring-mod · `song`: dạng sóng · `toc`: tốc độ nói. */
export const GIONG: Record<GiongGau, { nen: number; ringHz: number; song: OscillatorType; toc: number; dao: number; am: number }> = {
  bip:    { nen: 640, ringHz: 72, song: 'sine',     toc: 1.0,  dao: 1.0, am: 1.0 },
  sensei: { nen: 400, ringHz: 55, song: 'triangle', toc: 0.9,  dao: 0.7, am: 0.95 },
  zippy:  { nen: 780, ringHz: 92, song: 'sine',     toc: 1.25, dao: 1.3, am: 0.95 },
  grumpy: { nen: 300, ringHz: 42, song: 'triangle', toc: 0.7,  dao: 0.5, am: 0.9 },
  sage:   { nen: 350, ringHz: 50, song: 'sine',     toc: 0.85, dao: 0.6, am: 0.95 },
};

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

/** Dấu thanh của một âm tiết tiếng Việt → đường cao độ [đầu, giữa, cuối] (hệ số nhân). */
function thanh(am: string): [number, number, number] {
  const s = am.normalize('NFD');
  if (/́/.test(s)) return [1.0, 1.1, 1.3];    // sắc ↗
  if (/̀/.test(s)) return [1.0, 0.93, 0.82];  // huyền ↘
  if (/̉/.test(s)) return [1.0, 0.85, 1.04];  // hỏi ↘↗
  if (/̃/.test(s)) return [0.95, 1.2, 1.05];  // ngã ~
  if (/̣/.test(s)) return [0.96, 0.88, 0.82]; // nặng ↓ cụt
  return [1.0, 1.03, 1.0];                          // ngang —
}

/** Nguyên âm chính quyết định "màu" âm tiết: i/ê sáng, u/ô tối, a mở. */
function mauNguyenAm(am: string): number {
  const s = am.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  if (/[iy]/.test(s)) return 1.16;
  if (/e/.test(s)) return 1.07;
  if (/a/.test(s)) return 1.0;
  if (/o/.test(s)) return 0.91;
  if (/u/.test(s)) return 0.85;
  return 1.0;
}

function tachAmTiet(cau: string): string[] {
  return cau
    .replace(/\p{Extended_Pictographic}|‍|️/gu, ' ')
    .split(/[\s\p{P}\p{S}]+/u)
    .map((x) => x.trim())
    .filter((x) => /\p{L}|\p{N}/u.test(x))
    .slice(0, 28);
}

type Lich = { tu: number; den: number; manh: number }[];
let lich: Lich = [];
let lichGoc = 0;
let hienTai: { dung: () => void } | null = null;

/** Độ mở miệng 0–1 lúc này (đọc mỗi khung hình từ gấu SVG). */
export function docMieng(): number {
  if (!ctx || !lich.length) return 0;
  const t = ctx.currentTime - lichGoc;
  for (const m of lich) {
    if (t >= m.tu && t <= m.den) {
      const p = (t - m.tu) / (m.den - m.tu);
      return m.manh * Math.sin(Math.min(1, p * 1.15) * Math.PI); // mở nhanh, khép chậm
    }
  }
  return 0;
}

export function dangNoi(): boolean {
  if (!ctx || !lich.length) return false;
  return ctx.currentTime - lichGoc <= lich[lich.length - 1].den;
}

export function dungNoi(): void {
  hienTai?.dung();
  hienTai = null;
  lich = [];
}

/**
 * Một "chirp" robot: carrier có vibrato, trượt qua 2–3 nốt nhỏ, nhân ring-mod rồi trộn với tiếng gốc.
 * Trả về các node nguồn để dừng được giữa chừng.
 */
function chirp(
  ac: AudioContext, ra: AudioNode, g: (typeof GIONG)[GiongGau],
  tu: number, dai: number, f: [number, number, number], manh: number,
): AudioScheduledSourceNode[] {
  const car = ac.createOscillator();
  car.type = g.song;
  // 3 nốt nhỏ: đầu → giữa (hơi vượt) → cuối; trượt theo dấu thanh, bước chirp làm "líu ríu".
  const b = THAM_SO.chirpBuoc * g.dao;
  car.frequency.setValueAtTime(f[0], tu);
  car.frequency.exponentialRampToValueAtTime(f[1] * (1 + b), tu + dai * 0.3);
  car.frequency.exponentialRampToValueAtTime(f[1] * (1 - b * 0.5), tu + dai * 0.55);
  car.frequency.exponentialRampToValueAtTime(f[2], tu + dai);

  // Vibrato LFO → tần số carrier.
  const lfo = ac.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = THAM_SO.vibratoHz;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = f[1] * THAM_SO.vibratoSau * g.dao;
  lfo.connect(lfoGain).connect(car.frequency);

  // Ring modulation: carrier × sóng thấp.
  const ring = ac.createGain();
  ring.gain.value = 0;
  const mod = ac.createOscillator();
  mod.type = 'sine';
  mod.frequency.value = g.ringHz;
  mod.connect(ring.gain);
  car.connect(ring);

  // Trộn khô/ướt.
  const kho = ac.createGain(); kho.gain.value = 1 - THAM_SO.ringMix;
  const uot = ac.createGain(); uot.gain.value = THAM_SO.ringMix * 1.6; // ring-mod mất nửa năng lượng ⇒ bù
  car.connect(kho);
  ring.connect(uot);

  // Bao hình âm lượng: tấn công 8 ms, giữ, tắt mềm.
  const env = ac.createGain();
  env.gain.setValueAtTime(0, tu);
  env.gain.linearRampToValueAtTime(manh, tu + 0.008);
  env.gain.setValueAtTime(manh, tu + dai * 0.6);
  env.gain.exponentialRampToValueAtTime(0.001, tu + dai);
  kho.connect(env); uot.connect(env);
  env.connect(ra);

  for (const n of [car, lfo, mod]) { n.start(tu); n.stop(tu + dai + 0.03); }
  return [car, lfo, mod];
}

/**
 * Nói một câu. Trả về tổng thời lượng (ms) — 0 nếu không phát (chưa tương tác / tắt tiếng / không có Web Audio);
 * lúc đó nơi gọi vẫn cho miệng mấp máy theo nhịp chữ.
 */
export function noi(cau: string, giong: GiongGau = 'bip', o: { camXuc?: 'vui' | 'buon' | 'thuong' } = {}): number {
  if (gauTat() || !daTuongTac()) return 0;
  const ac = audio();
  if (!ac) return 0;
  dungNoi();

  const g = GIONG[giong];
  const amTiet = tachAmTiet(cau);
  if (!amTiet.length) return 0;

  /* Chuỗi lọc chung: band-pass formant → low-pass → âm lượng tổng. */
  const band = ac.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = THAM_SO.bandHz * (0.85 + 0.3 * (g.nen / 640));
  band.Q.value = THAM_SO.bandQ;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = THAM_SO.lowpassHz;
  lp.Q.value = 0.6;
  const master = ac.createGain();
  master.gain.value = THAM_SO.amLuong * g.am;
  band.connect(lp).connect(master).connect(ac.destination);

  const nodes: AudioScheduledSourceNode[] = [];
  const goc = ac.currentTime + 0.02;
  let t = 0;
  const moi: Lich = [];
  const heCamXuc = o.camXuc === 'buon' ? 0.86 : o.camXuc === 'vui' ? 1.08 : 1;
  const tocBuon = o.camXuc === 'buon' ? 1.25 : 1;
  const laCauHoi = /\?/.test(cau);
  const laCamThan = /!/.test(cau);

  // Câu hỏi: mở đầu bằng quãng hai nốt vút lên kiểu EVE gọi "Wall-E?".
  if (laCauHoi) {
    const f0 = g.nen * heCamXuc;
    nodes.push(...chirp(ac, band, g, goc + t, 0.07, [f0 * 0.9, f0 * 0.95, f0 * 1.0], 0.5));
    t += 0.085;
    nodes.push(...chirp(ac, band, g, goc + t, 0.11, [f0 * 1.15, f0 * 1.3, f0 * 1.45], 0.6));
    moi.push({ tu: t, den: t + 0.11, manh: 0.5 });
    t += 0.16;
  }

  for (let i = 0; i < amTiet.length; i++) {
    const am = amTiet[i];
    const dai = (THAM_SO.daiAmTiet + Math.min(0.05, am.length * 0.009)) / g.toc * tocBuon;
    const [a, b, c] = thanh(am);
    // Lệch nhẹ theo chỉ số để câu không đều tăm tắp như máy đánh chữ.
    const run = 1 + ((((i * 7919) % 13) / 13) - 0.5) * 0.07 * g.dao;
    const nen = g.nen * heCamXuc * run * (1 + (mauNguyenAm(am) - 1) * g.dao);
    const cuoi = i === amTiet.length - 1;
    const len = laCamThan && cuoi ? 1.2 : 1;
    nodes.push(...chirp(ac, band, g, goc + t, dai, [nen * a, nen * b, nen * c * len], 0.9));
    moi.push({ tu: t, den: t + dai, manh: 0.55 + 0.45 * mauNguyenAm(am) * (am.length > 2 ? 1 : 0.8) });
    t += dai + THAM_SO.nghi / g.toc;
  }
  // Câu cảm thán: đuôi "bíp!" nhảy lên một quãng.
  if (laCamThan) {
    const f0 = g.nen * heCamXuc;
    nodes.push(...chirp(ac, band, g, goc + t + 0.02, 0.09, [f0 * 1.25, f0 * 1.5, f0 * 1.6], 0.55));
    moi.push({ tu: t + 0.02, den: t + 0.11, manh: 0.5 });
    t += 0.14;
  }

  lich = moi;
  lichGoc = goc;
  hienTai = {
    dung: () => {
      for (const n of nodes) { try { n.stop(); } catch { /* đã dừng */ } }
      try { master.disconnect(); } catch { /* đã ngắt */ }
    },
  };
  return Math.round(t * 1000);
}

/** Hiệu ứng ngắn không lời (chào, mừng, buồn, ngạc nhiên) — giữ để dùng ở nơi không có câu chữ. */
export function keu(kieu: 'chao' | 'mung' | 'buon' | 'ngac', giong: GiongGau = 'bip'): void {
  const cau = kieu === 'chao' ? 'Chào bạn!' : kieu === 'mung' ? 'Giỏi quá đi!' : kieu === 'buon' ? 'Ôi, tiếc quá.' : 'Ơ, gì vậy?';
  noi(cau, giong, { camXuc: kieu === 'buon' ? 'buon' : kieu === 'mung' ? 'vui' : 'thuong' });
}
