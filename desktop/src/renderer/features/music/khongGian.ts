/**
 * ============================================================
 * KHÔNG GIAN — âm thanh nền (mưa, sóng, ồn nâu, lửa) sinh bằng Web Audio
 * ============================================================
 *
 * Không kèm file âm thanh nào: mọi tiếng đều là NHIỄU đã lọc, sinh ra lúc chạy.
 * Cùng lý do như `dashboard/amThanh.ts` — bản cài không phình, không phải đi qua
 * CSP và đường `app://`, và không có chỗ nào để "chạy ở dev, câm ở bản cài".
 *
 * ⚠️ NÓI THẬT về chất lượng: đây là nhiễu được tạo hình, KHÔNG phải bản ghi mưa
 * thật. Nghe gần giống và đủ để che tiếng ồn xung quanh — đó là việc của nó —
 * nhưng nhãn trong giao diện không được hứa "tiếng mưa thu âm".
 *
 * ─── Vì sao là module đơn (singleton), không phải state của trang ───
 * Người ta bật tiếng mưa rồi đi làm việc khác. Đặt nó trong trang Nhạc thì rời
 * trang là React tháo, tiếng tắt phụt — đúng cái lỗi `player.tsx` từng có với
 * thẻ <audio>. Module này sống suốt phiên app; trang chỉ là bảng điều khiển.
 *
 * ⚠️ `AudioContext` tạo LƯỜI ở lần bật đầu tiên (sau một cú bấm). Tạo sớm hơn là
 * nó nằm `suspended` và im lặng mãi, không lỗi.
 */

export type MaKhongGian = 'mua' | 'song' | 'nau' | 'lua';

export const DS_KHONG_GIAN: readonly MaKhongGian[] = ['mua', 'song', 'nau', 'lua'];

/** Mức 0..1 của từng tiếng. 0 = tắt. */
export type MucKhongGian = Record<MaKhongGian, number>;

const KHOA = 'ct-music-khong-gian';
const TRAN = 0.55; // âm lượng tối đa thật — nền phải NẰM DƯỚI nhạc, không đè lên

let ctx: AudioContext | null = null;
let tong: GainNode | null = null;
const nhanh = new Map<MaKhongGian, { gain: GainNode; dung: () => void }>();

let muc: MucKhongGian = { mua: 0, song: 0, nau: 0, lua: 0 };
/** Mức đã lưu lần trước — để nút "bật lại" nhớ người dùng thích bao nhiêu. */
let mucNho: MucKhongGian = docNho();
const ngheGia = new Set<() => void>();

function docNho(): MucKhongGian {
  const macDinh: MucKhongGian = { mua: 0.35, song: 0.35, nau: 0.3, lua: 0.3 };
  try {
    const tho = JSON.parse(localStorage.getItem(KHOA) ?? 'null') as Partial<MucKhongGian> | null;
    if (!tho) return macDinh;
    for (const ma of DS_KHONG_GIAN) {
      const v = Number(tho[ma]);
      if (Number.isFinite(v) && v > 0 && v <= 1) macDinh[ma] = v;
    }
  } catch { /* hỏng thì dùng mặc định */ }
  return macDinh;
}

function bao(): void {
  for (const f of ngheGia) f();
}

/** Bộ đệm nhiễu 4 giây, lặp vô tận. `kieu` quyết định màu của nhiễu. */
function taoNhieu(c: AudioContext, kieu: 'hong' | 'nau' | 'lach-tach'): AudioBuffer {
  const dai = c.sampleRate * 4;
  const buf = c.createBuffer(2, dai, c.sampleRate);
  for (let kenh = 0; kenh < 2; kenh++) {
    const d = buf.getChannelData(kenh);
    if (kieu === 'hong') {
      // Bộ lọc hồng của Paul Kellet — rẻ, đủ đúng cho tai người.
      let b0 = 0; let b1 = 0; let b2 = 0; let b3 = 0; let b4 = 0; let b5 = 0; let b6 = 0;
      for (let i = 0; i < dai; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else if (kieu === 'nau') {
      let cu = 0;
      for (let i = 0; i < dai; i++) {
        const w = Math.random() * 2 - 1;
        cu = (cu + 0.02 * w) / 1.02;
        d[i] = cu * 3.5;
      }
    } else {
      // Lách tách của lửa: những xung ngắn thưa thớt, tắt dần rất nhanh.
      for (let i = 0; i < dai; i++) d[i] = 0;
      const soXung = 90;
      for (let n = 0; n < soXung; n++) {
        const dau = Math.floor(Math.random() * (dai - 2000));
        const bien = 0.25 + Math.random() * 0.75;
        const doDai = 200 + Math.floor(Math.random() * 1400);
        for (let k = 0; k < doDai; k++) {
          d[dau + k] = (d[dau + k] ?? 0) + (Math.random() * 2 - 1) * bien * Math.exp(-k / (doDai / 6));
        }
      }
    }
  }
  return buf;
}

function layCtx(): AudioContext | null {
  try {
    if (!ctx) {
      ctx = new AudioContext();
      tong = ctx.createGain();
      tong.gain.value = 1;
      tong.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Dựng một nhánh âm. Trả hàm dừng để gỡ mọi node khi tắt hẳn. */
function dungNhanh(c: AudioContext, ma: MaKhongGian, ra: GainNode): { gain: GainNode; dung: () => void } {
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.connect(ra);
  const nguon: AudioScheduledSourceNode[] = [];
  const nodes: AudioNode[] = [gain];

  const lapNhieu = (kieu: 'hong' | 'nau' | 'lach-tach'): AudioBufferSourceNode => {
    const s = c.createBufferSource();
    s.buffer = taoNhieu(c, kieu);
    s.loop = true;
    nguon.push(s);
    nodes.push(s);
    return s;
  };
  const loc = (type: BiquadFilterType, f: number, q = 0.7): BiquadFilterNode => {
    const b = c.createBiquadFilter();
    b.type = type; b.frequency.value = f; b.Q.value = q;
    nodes.push(b);
    return b;
  };

  if (ma === 'mua') {
    // Mưa: nhiễu hồng cắt bỏ phần trầm ục ục, giữ dải xào xạc 0,5–9 kHz.
    const s = lapNhieu('hong');
    const cao = loc('highpass', 500);
    const thap = loc('lowpass', 9000);
    s.connect(cao); cao.connect(thap); thap.connect(gain);
  } else if (ma === 'song') {
    // Sóng: nhiễu nâu qua lọc thấp, âm lượng phồng xẹp theo chu kỳ ~9 giây.
    const s = lapNhieu('nau');
    const thap = loc('lowpass', 700);
    const nhip = c.createGain();
    nhip.gain.value = 0.55;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.11;
    const doSau = c.createGain();
    doSau.gain.value = 0.45;
    lfo.connect(doSau); doSau.connect(nhip.gain);
    s.connect(thap); thap.connect(nhip); nhip.connect(gain);
    nguon.push(lfo);
    nodes.push(nhip, lfo, doSau);
  } else if (ma === 'nau') {
    // Ồn nâu: trầm, đều, che tiếng nói chuyện xung quanh — loại hay dùng để tập trung.
    const s = lapNhieu('nau');
    const thap = loc('lowpass', 1000);
    s.connect(thap); thap.connect(gain);
  } else {
    // Lửa: tiếng ù trầm của ngọn lửa + lách tách ở dải cao.
    const nen = lapNhieu('nau');
    const thap = loc('lowpass', 400);
    const nenGain = c.createGain();
    nenGain.gain.value = 0.6;
    nodes.push(nenGain);
    nen.connect(thap); thap.connect(nenGain); nenGain.connect(gain);
    const tach = lapNhieu('lach-tach');
    const cao = loc('highpass', 1800);
    tach.connect(cao); cao.connect(gain);
  }

  for (const s of nguon) s.start();
  return {
    gain,
    dung: () => {
      for (const s of nguon) { try { s.stop(); } catch { /* đã dừng */ } }
      for (const n of nodes) { try { n.disconnect(); } catch { /* đã gỡ */ } }
    },
  };
}

/** Đặt mức một tiếng (0..1). Gọi từ cú bấm/kéo của người dùng. */
export function datMucKhongGian(ma: MaKhongGian, gia: number): void {
  const v = Math.max(0, Math.min(1, gia));
  muc = { ...muc, [ma]: v };
  if (v > 0) {
    mucNho = { ...mucNho, [ma]: v };
    try { localStorage.setItem(KHOA, JSON.stringify(mucNho)); } catch { /* đầy/khoá thì thôi */ }
  }
  const c = v > 0 ? layCtx() : ctx;
  if (c && tong) {
    let n = nhanh.get(ma);
    if (!n && v > 0) { n = dungNhanh(c, ma, tong); nhanh.set(ma, n); }
    if (n) {
      /* Tăng/giảm trong ~0,6 giây: bật tiếng mưa mà nó ập vào một phát là giật
         mình — đúng thứ trang thư giãn không được làm. */
      n.gain.gain.setTargetAtTime(v * TRAN, c.currentTime, 0.2);
      if (v === 0) {
        const cu = n;
        nhanh.delete(ma);
        setTimeout(() => { if (!nhanh.has(ma)) cu.dung(); }, 1200);
      }
    }
  }
  bao();
}

/** Bật/tắt nhanh một tiếng, bật lại đúng mức lần trước. */
export function doiKhongGian(ma: MaKhongGian): void {
  datMucKhongGian(ma, muc[ma] > 0 ? 0 : mucNho[ma]);
}

/** Tắt hết tiếng nền. */
export function tatKhongGian(): void {
  for (const ma of DS_KHONG_GIAN) if (muc[ma] > 0) datMucKhongGian(ma, 0);
}

export function layMucKhongGian(): MucKhongGian {
  return muc;
}

export function ngheKhongGian(f: () => void): () => void {
  ngheGia.add(f);
  return () => { ngheGia.delete(f); };
}
