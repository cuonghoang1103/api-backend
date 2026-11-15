/**
 * Maker Lab — robot Odin NÓI bằng ElevenLabs (15/11/2026). Cửa chung: `services/giong/elevenlabs.ts`.
 *
 * Chảy `pcm_16000` thẳng xuống bo (đúng khuôn bo phát, không qua ffmpeg). Byte đầu ~0,4–0,65 s khi
 * giọng ấm — so với F5 máy nhà 1–2 s lúc card rảnh, 8–23 s lúc card đang đọc giọng video.
 *
 * ⚠️ MẨU PCM PHẢI CHẴN BYTE. Một byte LẺ trong đệm bo = kẹt vĩnh viễn (fw 0.5.2-bytele, 12/08/2026):
 * mạng cắt gói ở đâu cũng được, nên giữ byte lẻ lại ghép vào mẩu sau.
 */
import { logger } from '../../utils/logger.js';
import { quyenEl, moLuongEl, ghiDungEl, lamAmGiong, daDungGiong } from '../giong/elevenlabs.js';
import { apGain } from './cauDem.js';

/** Gain cho tiếng ElevenLabs trên robot. Đo 15/11: trung bình −25 dB, đỉnh −5 dB ⇒ để 0. */
export function gainEl(): number {
  const n = Number(process.env.MAKERLAB_GAIN_ELEVENLABS ?? 0);
  return Number.isFinite(n) ? n : 0;
}

/** Tách khối thành phần CHẴN byte + phần lẻ còn dư. THUẦN — test đọc. */
export function tachChan(du: Buffer | null, khoi: Buffer): { chan: Buffer; le: Buffer | null } {
  const tat = du && du.length ? Buffer.concat([du, khoi]) : khoi;
  const n = tat.length - (tat.length % 2);
  return { chan: tat.subarray(0, n), le: n < tat.length ? tat.subarray(n) : null };
}

// Dự án → giọng đang dùng, để `audio_start` làm ấm mà không phải đọc DB mỗi lượt nghe.
const _giongDuAn = new Map<number, { giong: string; model: string }>();

export function nhoGiongDuAn(projectId: number, giong: string, model: string): void {
  _giongDuAn.set(projectId, { giong, model });
}

/** Gọi ở `audio_start`: người dùng vừa mở miệng ⇒ nạp sẵn giọng trong lúc nghe + nghĩ. */
export function lamAmRobot(projectId: number): void {
  const g = _giongDuAn.get(projectId);
  if (g) lamAmGiong(g.giong, g.model);
}

/**
 * Đọc một mẩu bằng ElevenLabs, đẩy PCM xuống bo qua `onPcm`. Trả số byte đã đẩy.
 * Không được dùng (tắt / hết quỹ) ⇒ trả 0 (nơi gọi lùi giọng khác). Lỗi giữa chừng ⇒ ném.
 */
export async function docElChoRobot(o: {
  text: string;
  giong: string | null | undefined;
  tocDo?: number;
  deviceId: number;
  projectId?: number;
  onPcm: (pcm: Buffer) => void;
}): Promise<number> {
  const q = await quyenEl({ viec: 'robot', kyTu: o.text.length });
  if (!q.duoc) {
    logger.warn('MakerLab ElevenLabs không dùng được lượt này — lùi giọng khác', { lyDo: q.lyDo });
    return 0;
  }
  const giong = o.giong && /^[A-Za-z0-9]{10,40}$/.test(o.giong) ? o.giong : q.giong;
  if (o.projectId) nhoGiongDuAn(o.projectId, giong, q.model);
  const t = Date.now();
  let byte = 0;
  let byteDauMs = 0;
  try {
    const res = await moLuongEl({
      text: o.text,
      giong,
      model: q.model,
      dinhDang: 'pcm_16000',
      tocDo: o.tocDo,
      signal: AbortSignal.timeout(60_000),
    });
    daDungGiong(giong);
    const db = gainEl();
    let du: Buffer | null = null;
    for await (const m of res.body as unknown as AsyncIterable<Uint8Array>) {
      if (!byteDauMs) byteDauMs = Date.now() - t;
      const { chan, le } = tachChan(du, Buffer.from(m));
      du = le;
      if (!chan.length) continue;
      const ra = db ? apGain(Buffer.from(chan), db) : Buffer.from(chan);
      o.onPcm(ra);
      byte += ra.length;
    }
    await ghiDungEl({ viec: 'robot', kyTu: o.text.length, model: q.model, ms: Date.now() - t, ok: true });
    logger.info('MakerLab ElevenLabs', { deviceId: o.deviceId, byteDauMs, tongMs: Date.now() - t, soChu: o.text.length });
    return byte;
  } catch (err) {
    await ghiDungEl({
      viec: 'robot', kyTu: o.text.length, model: q.model, ms: Date.now() - t, ok: false,
      loi: err instanceof Error ? err.message : String(err),
    });
    if (byte > 0) return byte; // đã nói được một phần — nói cụt còn hơn đọc lại bằng giọng khác
    throw err;
  }
}
