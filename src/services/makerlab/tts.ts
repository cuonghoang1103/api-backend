/**
 * ============================================================
 * Maker Lab — Text-to-Speech
 * ============================================================
 *
 * The robot's voice. Four providers behind one function, chosen by
 * `MAKERLAB_TTS_PROVIDER` (or per-project via MakerPersona.voiceProvider),
 * with an automatic fallback chain so a dead upstream turns the robot
 * mute for one sentence instead of forever.
 *
 *   google      translate_tts. Free, no key. DEFAULT — always works.
 *   edge        Microsoft read-aloud. Giọng Việt hay nhất, nhưng từ
 *               07/08/2026 trả 403 — chỉ bật khi có MAKERLAB_EDGE_TOKEN.
 *
 *   openai      OPENAI_API_KEY. Good prosody, foreign accent on Vietnamese.
 *   elevenlabs  ELEVENLABS_API_KEY + a voice id. THIS is the one to use
 *               once you clone your own voice — see cloneVoiceHowTo below.
 *
 * Output is always MP3. Not PCM: at 24 kHz/48 kbps an MP3 sentence is
 * ~6 KB where raw PCM would be ~120 KB, which matters a lot over the
 * robot's WiFi link, and ESP8266Audio decodes MP3 on the ESP32 fine.
 *
 * ── Switching to your cloned voice later ───────────────────
 * No code change. Record ~3 minutes of yourself, create the voice in
 * ElevenLabs, then set on the VPS (/opt/cuonghoangdev/.env):
 *     MAKERLAB_TTS_PROVIDER=elevenlabs
 *     ELEVENLABS_API_KEY=...
 *     MAKERLAB_TTS_VOICE=<voice id>
 * and restart the backend container. Per-project override lives in
 * MakerPersona.voiceProvider / voiceId and beats the env.
 */

import { WebSocket } from 'ws';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger.js';
import { phienAmSangViet } from './phienAm.js';

export type TtsProvider =
  | 'edge'
  | 'google'
  | 'gcloud'
  | 'fptai'
  | 'openai'
  | 'elevenlabs'
  | 'cuongmini';

export interface TtsOptions {
  provider?: TtsProvider;
  /** Provider-specific voice id/name. */
  voice?: string;
  /** BCP-47, e.g. vi-VN. */
  language?: string;
  /** -50..+50 percent, edge only. */
  ratePct?: number;
  /**
   * Tốc độ đọc, 0,25–4,0 (1,0 = bình thường). Google Cloud dùng thẳng
   * con số này; các nhà cung cấp khác bỏ qua.
   */
  speakingRate?: number;
  /** -50..+50 Hz, edge only. */
  pitchHz?: number;
}

export interface TtsResult {
  audio: Buffer;
  mime: string;
  provider: TtsProvider;
}

/** Sensible Vietnamese defaults per provider. */
const DEFAULT_VOICE: Record<TtsProvider, string> = {
  edge: 'vi-VN-NamMinhNeural', // male; vi-VN-HoaiMyNeural is the female one
  google: 'vi',
  openai: 'onyx',
  elevenlabs: '', // no default — a cloned voice id is always explicit
  // Giọng nam WaveNet tiếng Việt. Chọn WaveNet chứ không phải Chirp3
  // vì hạn miễn phí gấp BỐN lần (4 triệu ký tự/tháng so với 1 triệu),
  // mà với robot để bàn thì 4 triệu là không bao giờ chạm tới.
  gcloud: 'vi-VN-Wavenet-D',
  // Để TRỐNG: giọng của dịch vụ tự dựng luôn phải chọn tên rõ ràng, vì
  // giọng nhân bản do người dùng tự đặt tên. Đoán bừa một cái tên mặc
  // định thì lúc tên đó không tồn tại sẽ hỏng ở tận trong dịch vụ.
  cuongmini: '',
  // Giọng nam miền Bắc. "banmai" (nữ) nổi tiếng hơn nhờ các video
  // review phim, nhưng robot này xưng "tôi" và nói trống không nên
  // giọng nam hợp hơn — đổi một dòng ở tab Tính cách là xong.
  fptai: 'leminh',
};

/** Giọng tiếng Việt của FPT.AI, để UI khỏi phải đoán. */
export const FPTAI_VOICES = [
  { id: 'leminh', label: 'Lê Minh — nam, miền Bắc' },
  { id: 'giahuy', label: 'Gia Huy — nam, miền Trung' },
  { id: 'minhquang', label: 'Minh Quang — nam, miền Nam' },
  { id: 'banmai', label: 'Ban Mai — nữ, miền Bắc' },
  { id: 'thuminh', label: 'Thu Minh — nữ, miền Bắc' },
  { id: 'myan', label: 'Mỹ An — nữ, miền Trung' },
  { id: 'lannhi', label: 'Lan Nhi — nữ, miền Nam' },
  { id: 'linhsan', label: 'Linh San — nữ, miền Nam' },
];

const TTS_TIMEOUT_MS = Number(process.env.MAKERLAB_TTS_TIMEOUT_MS) || 20_000;

/**
 * Hạn chờ BYTE ĐẦU TIÊN của đường luồng.
 *
 * Máy đọc khoẻ trả byte đầu sau ~165 ms (đo 12/08/2026 qua đường hầm về
 * máy nhà). 8 giây là rộng gấp năm chục lần mức bình thường, nên nó chỉ
 * nổ khi có gì đó thật sự kẹt — mà kẹt thì phải chuyển giọng khác NGAY,
 * đừng bắt người dùng đứng nghe im lặng.
 */
const TTS_TTFB_MS = Number(process.env.MAKERLAB_TTS_TTFB_MS) || 8_000;

/**
 * Hạn chờ byte đầu, tính theo ĐỘ DÀI khi máy đọc KHÔNG sinh theo luồng.
 *
 * ⚠️ MỘT CON SỐ CHO CẢ HAI MÁY ĐỌC LÀ SAI TỪ GIẢ ĐỊNH.
 *
 * VieNeu sinh theo luồng: byte đầu về sau ~165 ms bất kể đoạn dài bao
 * nhiêu, nên 8 giây là quá thừa và bắt kẹt rất nhanh.
 *
 * Chatterbox thì KHÔNG. Nó làm xong cả đoạn rồi mới trả byte đầu tiên,
 * nên "byte đầu" chính là "sinh xong". Đo thật 13/08/2026:
 *
 *    40 ký tự → 1.735 ms
 *   120 ký tự → 3.709 ms
 *   220 ký tự → 7.050 ms   ← sát mép
 *   320 ký tự → 9.384 ms   ← VƯỢT hạn 8 giây
 *
 * Máy chủ gom câu tới ÍT NHẤT 220 ký tự nên đoạn thật thường 250-350.
 * Hậu quả người dùng thấy: robot nói tiếng Anh được một hai câu rồi đột
 * ngột nhảy sang giọng Google tiếng Việt đọc chữ tiếng Anh. Mẩu ĐẦU gửi
 * ngay khi có một câu nên nó ngắn và sống sót; mẩu thứ hai mới chết.
 *
 * ~29 ms mỗi ký tự là số đo; nhân đôi thành 60 để chừa chỗ cho lúc máy
 * bận (train giọng, LLM đang trả lời dài) mà vẫn bắt được kẹt thật.
 */
function hanChoByteDau(voice: string | null | undefined, soChu: number): number {
  if (khoaGain('cuongmini', voice) !== 'cuongmini-en') return TTS_TTFB_MS;
  return Math.max(TTS_TTFB_MS, 4_000 + soChu * 60);
}

/**
 * Phiên âm từ tiếng Anh sang chính tả tiếng Việt trước khi đưa cho máy
 * đọc. CHỈ cho `cuongmini` — đó là giọng nhân bản tiếng Việt.
 *
 * Không áp cho giọng tiếng Anh: ở đó chính tả GỐC mới là thứ đúng, và
 * phiên âm vào là biến "deploy" thành một từ vô nghĩa.
 *
 * Tắt được bằng `MAKERLAB_PHIEN_AM=false` — nếu một ngày mô hình tự đọc
 * chữ Latin đúng thì đây là thứ nên tắt trước, chứ không phải gỡ mã.
 */
function doiChuNgoaiLai(text: string, bat = true): string {
  if (!bat) return text;
  if (process.env.MAKERLAB_PHIEN_AM === 'false') return text;
  const ra = phienAmSangViet(text);
  if (ra !== text) logger.debug('MakerLab phiên âm', { truoc: text.slice(0, 90), sau: ra.slice(0, 90) });
  return ra;
}

function envProvider(): TtsProvider {
  // Default is `google`, not `edge`, as of 2026-08-07: Microsoft's
  // read-aloud endpoint now answers 403 to this handshake (it wants a
  // Sec-MS-GEC token derived from a rotating clock skew). The edge
  // path is kept in the chain — if it comes back it is the better
  // Vietnamese voice — but defaulting to it costs ~600 ms of failed
  // handshake on every single reply, which is 60% of the latency
  // budget for a robot that has one second to answer.
  const p = (process.env.MAKERLAB_TTS_PROVIDER || 'google').toLowerCase();
  if (
    p === 'google' ||
    p === 'gcloud' ||
    p === 'fptai' ||
    p === 'openai' ||
    p === 'elevenlabs' ||
    p === 'edge' ||
    p === 'cuongmini'
  )
    return p;
  return 'google';
}

/**
 * Synthesize speech. Tries the requested provider, then falls back
 * through the chain; only throws when every provider failed.
 */
/**
 * Trần chờ cho CẢ lời gọi, tính theo ĐỘ DÀI văn bản.
 *
 * ⚠️ MỘT CON SỐ CỐ ĐỊNH KHÔNG BAO GIỜ ĐÚNG CHO CẢ CÂU NGẮN LẪN BÀI DÀI.
 *
 * 20 giây được chọn hồi mọi lời gọi đều là hai bốn câu. Từ khi đường
 * không-luồng của robot chuyển sang GOM qua cửa luồng (13/08/2026), lời
 * gọi này không còn là "xin một mẩu" mà là "nhận trọn đoạn tiếng" — và
 * một câu trả lời 1.126 ký tự là ~68 giây tiếng. Gom 68 giây trong ngân
 * sách 20 giây thì không bao giờ xong:
 *
 *     cuongmini: tts timeout after 20000ms
 *     → openai 429 hết credit → Google
 *
 * Người dùng lại nghe thấy đúng một chuyện: "giọng về Google". Bản vá
 * hôm nay chữa được vòng luẩn quẩn hàng đợi nhưng đẻ ra cái này.
 *
 * Tiếng nói ~16,5 ký tự mỗi giây; máy đọc chạy nhanh hơn thời gian thực
 * nên trần bằng ĐÚNG thời lượng tiếng đã là rộng rãi. Cộng 20 giây nền
 * cho lúc nạp mô hình, và chặn trần trên 180 giây để một lời gọi treo
 * không giữ cả lượt nói mãi mãi.
 */
function tranTheoDoDai(text: string): number {
  const giayTieng = text.length / 16.5;
  return Math.min(180_000, Math.max(TTS_TIMEOUT_MS, Math.round(giayTieng * 1000) + 20_000));
}

export async function synthesizeSpeech(text: string, opts: TtsOptions = {}): Promise<TtsResult> {
  const clean = sanitizeForSpeech(text);
  if (!clean) throw new Error('nothing to speak');

  const first = opts.provider || envProvider();
  // google last: it always works, so it makes a good floor.
  // `fptai` đứng trước `google`: khi nhà cung cấp chính hỏng, rơi vào
  // một giọng Việt tử tế vẫn hơn rơi thẳng xuống translate_tts. Còn
  // `google` giữ vị trí cuối vì nó không cần khoá — một cái sàn không
  // bao giờ thủng.
  const chain: TtsProvider[] = [first, 'edge', 'openai', 'elevenlabs', 'fptai', 'google'].filter(
    (p, i, arr) => arr.indexOf(p) === i,
  ) as TtsProvider[];

  let lastErr: unknown = null;
  for (const provider of chain) {
    if (!providerConfigured(provider)) continue;
    try {
      const audio = await withTimeout(runProvider(provider, clean, opts), tranTheoDoDai(clean));
      if (audio.length > 0) {
        // Ghi ĐÚNG kiểu: dịch vụ tự dựng trả WAV, mọi nhà cung cấp còn
        // lại trả MP3. Hiện ffmpeg vẫn tự ngửi ra định dạng nên sai nhãn
        // cũng chạy, nhưng nhãn sai là quả mìn hẹn giờ cho bất kỳ chỗ
        // nào sau này tin vào nó thay vì tự ngửi.
        const mime = provider === 'cuongmini' ? 'audio/wav' : 'audio/mpeg';
        return { audio, mime, provider };
      }
    } catch (err) {
      lastErr = err;
      logger.warn('MakerLab TTS provider failed, trying next', {
        provider,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  throw new Error(
    `all TTS providers failed: ${lastErr instanceof Error ? lastErr.message : String(lastErr)}`,
  );
}


/** Địa chỉ dịch vụ TTS tự dựng. Trong docker network nó là `tts`. */
function cuongMiniRoot(): string {
  // ⚠️ DÙNG CHUNG biến với trang /voice-mini (`TTS_SERVICE_URL` trong
  // voiceMini.routes.ts). Hai chỗ trỏ vào hai dịch vụ khác nhau là một
  // cái bẫy im lặng: người dùng nhân bản giọng trên web, giọng đó nằm ở
  // dịch vụ A, còn robot đọc bằng dịch vụ B — nên robot báo "không có
  // giọng đó" trong khi web hiện nó rành rành.
  return (process.env.TTS_SERVICE_URL || process.env.MAKERLAB_TTS_LOCAL_URL || 'http://tts:8080')
    .replace(/\/+$/, '');
}

/**
 * Giọng tự dựng trên chính VPS này — kể cả giọng nhân bản từ mẫu thu.
 *
 * ⚠️ ĐẮT VỀ THỜI GIAN, và phải biết trước con số. Dịch vụ chạy VieNeu
 * trên CPU với RTF ≈ 1,0: sinh mười giây tiếng mất khoảng mười giây.
 * Mọi nhà cung cấp khác trong file này đều chạy trên GPU của họ và trả
 * về sau vài trăm mili giây.
 *
 * Nghĩa là robot dùng giọng này sẽ CHẬM HẲN — nó không bao giờ chạy
 * trước được người nghe, mà chỉ vừa kịp. Đổi lại: giọng của chính chủ,
 * không phụ thuộc ai, không hạn mức, không hoá đơn.
 *
 * Vì thế đây là LỰA CHỌN, không phải mặc định. Đổi lại bằng một dòng
 * `voiceProvider` trong tính cách robot.
 *
 * Đường gọi là bất đồng bộ (nhận việc → hỏi lại) chứ không phải chờ
 * một lần: một câu dài có thể mất hơn ba mươi giây, mà nhiều tầng proxy
 * cắt kết nối chờ lâu — nhận việc rồi hỏi lại thì không tầng nào phải
 * giữ một kết nối mở suốt.
 */
/**
 * Bọc PCM 16-bit mono thành WAV.
 *
 * Viết tại chỗ chứ không mượn `pcmToWav` của `voiceLoop.ts`: file đó đã
 * import `tts.ts`, mượn ngược lại là vòng import — và vòng import trong
 * ESM không nổ lúc build, nó nổ lúc chạy bằng một `undefined` giữa
 * chừng, tức đúng kiểu hỏng khó lần nhất.
 */
function bocWav(pcm: Buffer, sr: number): Buffer {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write('WAVE', 8);
  h.write('fmt ', 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(sr, 24);
  h.writeUInt32LE(sr * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function synthesizeCuongMini(
  text: string,
  voice: string | undefined,
  speakingRate?: number,
): Promise<Buffer> {
  const goc = cuongMiniRoot();

  /**
   * ⚠️ ROBOT PHẢI ĐI ĐƯỜNG LUỒNG, KHÔNG ĐƯỢC NỘP VIỆC VÀO HÀNG ĐỢI.
   *
   * Hàng đợi `/tts` có trần ba việc và nó dành cho TRANG WEB — người ta
   * dán chữ, bấm nút, rồi đi làm việc khác. Robot thì có người đang đứng
   * chờ nghe.
   *
   * Chuyện xảy ra 13/08/2026 khi bỏ sót điều này — một vòng luẩn quẩn:
   *
   *   câu trả lời dài  → đường luồng chờ quá hạn vì máy đọc đang bận
   *                    → tụt xuống ĐƯỜNG JOB
   *                    → nộp thêm việc vào ĐÚNG hàng đợi đang tắc
   *                    → đầy 3 việc → 429
   *                    → openai hết credit → **Google**
   *
   * Log ghi bốn lần 429 liên tiếp trong hai chục giây, và người dùng chỉ
   * nghe thấy một chuyện: "giọng tiếng Việt về giọng mặc định Google".
   *
   * Chỗ lùi mà đổ thêm tải vào chính thứ đang quá tải thì nó không phải
   * lưới đỡ, nó là cái đẩy thêm. Cùng họ với lỗi sáng nay: chỗ lùi hỏi
   * lại model rồi sinh tiếng HAI LẦN cho cùng một nội dung.
   *
   * Nên đường không-luồng của robot nay cũng gọi `/tts-stream` rồi gom
   * lại — cùng MỘT cửa vào máy đọc, cửa có quyền ưu tiên cho robot, và
   * không có trần hàng đợi.
   */
  {
    const mau: Buffer[] = [];
    try {
      await streamCuongMini(text, { voice, speakingRate }, async (pcm) => {
        mau.push(pcm);
        return true;
      });
      if (mau.length) return bocWav(Buffer.concat(mau), TTS_SR);
    } catch (e) {
      // Luồng hỏng thật (máy đọc tắt, đường hầm đứt) thì mới xuống dưới.
      // Bận thì đã được xử ở trong `streamCuongMini` bằng quyền ưu tiên.
      logger.warn('MakerLab luồng cuongmini hỏng, thử đường việc', {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const nhan = await fetch(`${goc}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: doiChuNgoaiLai(text), voice: voice || undefined, style: 'tu_nhien' }),
    // 4 giây, không phải 20. Đây là chốt PHÁT HIỆN HỎNG, không phải
    // chốt chờ việc: nếu máy ở nhà tắt hoặc đường hầm đứt thì cổng bên
    // VPS biến mất và lời gọi này bị từ chối tức thì. Nhưng nếu máy còn
    // sống mà treo, không có trần ngắn thì cả lượt nói của robot đứng
    // im 20 giây rồi mới rơi về Google — người dùng đọc cái đó thành
    // "robot hỏng", chứ không đọc thành "máy ở nhà đang tắt".
    //
    // Trần chờ SINH TIẾNG nằm ở vòng hỏi lại phía dưới, dài hơn nhiều.
    signal: AbortSignal.timeout(4_000),
  });
  if (!nhan.ok) {
    throw new Error(`cuongmini nhận việc hỏng HTTP ${nhan.status} ${(await nhan.text()).slice(0, 200)}`);
  }
  const { jobId, uocTinhGiay } = (await nhan.json()) as { jobId: string; uocTinhGiay: number };

  // Trần chờ = ước tính × 4, tối thiểu 20 giây. Nhân 4 vì máy có lúc
  // bận; không để vô hạn vì một việc treo sẽ giữ luôn cả lượt nói của
  // robot và người dùng chỉ thấy nó im.
  const tran = Math.max(20_000, Math.round((uocTinhGiay || 10) * 4_000));
  const hetHan = Date.now() + tran;

  while (Date.now() < hetHan) {
    // 150 ms chứ không phải 400. Mỗi vòng hỏi lại là một lần CHỜ THỪA:
    // việc xong ở mili giây thứ 610 mà nhịp hỏi 400 ms thì mãi 800 ms mới
    // biết — mất trắng 190 ms mỗi mẩu tiếng. Với robot đang nói dở thì
    // 190 ms đó là chỗ đệm cạn.
    //
    // Rẻ: mỗi lần hỏi là một GET rỗng qua mạng nội bộ Docker + đường hầm,
    // vài trăm byte. Đổi lấy độ trễ thì đáng.
    await new Promise((r) => setTimeout(r, 150));
    const hoi = await fetch(`${goc}/tts/${jobId}`, { signal: AbortSignal.timeout(15_000) });

    // 202 = đang chạy. Đây đúng là chỗ mà một API trả 200 cho cả hai
    // trạng thái sẽ lừa được người gọi — xem chú thích trong app.py.
    if (hoi.status === 202) continue;
    if (!hoi.ok) {
      throw new Error(`cuongmini hỏng HTTP ${hoi.status} ${(await hoi.text()).slice(0, 200)}`);
    }
    const wav = Buffer.from(await hoi.arrayBuffer());
    if (wav.length < 64) throw new Error('cuongmini trả về tiếng rỗng');
    return speakingRate && speakingRate !== 1 ? await doiTocDo(wav, speakingRate) : wav;
  }
  throw new Error(`cuongmini quá ${Math.round(tran / 1000)} giây chưa xong`);
}

/**
 * Đổi tốc độ đọc mà KHÔNG đổi cao độ, bằng bộ lọc `atempo` của ffmpeg.
 *
 * Dịch vụ tự dựng không có tham số tốc độ, nên phải làm sau khi có tiếng.
 * `atempo` chỉ nhận 0,5-2,0 mỗi tầng nên kẹp lại — ngoài khoảng đó thì
 * giọng cũng đã méo tới mức không ai muốn nghe.
 */
/**
 * Đọc theo LUỒNG: gọi `onChunk` với từng mẩu PCM ngay khi máy nhà sinh ra.
 *
 * Đây là thứ xoá GỐC chuyện đói đệm, chứ không vá quanh nó. Đường
 * `synthesizeCuongMini` cũ phải đợi sinh xong cả đoạn rồi mới nhận được
 * byte đầu tiên — đo 12/08/2026: một mẩu 14 giây tiếng mất 3,5 giây, và
 * suốt 3,5 giây ấy bo không nhận thêm gì nên đệm cạn.
 *
 * Đo đường này, lúc model đã ấm:
 *   byte đầu tiên   105 ms   (đường cũ: 3.500 ms)
 *   9,4 giây tiếng về hết trong 2,7 giây  ⇒ nhanh gấp 3,5 lần tốc độ phát
 *
 * Trả về PCM THÔ 16 kHz mono — đúng thứ bo đẩy thẳng vào I2S. Không WAV
 * (khuôn WAV cần biết độ dài trước, mà đang stream thì chưa biết — chính
 * cái bẫy `RIFF size 0xFFFFFFFF` đã gặp), không ffmpeg trong đường nóng.
 *
 * Trả về tổng số byte đã gửi. 0 nghĩa là không dùng được — bên gọi rơi
 * về đường thường.
 */
/**
 * Tần số lấy mẫu của đường luồng — phải khớp `BO_SR` trong
 * `services/tts/app.py`. Lệch số này thì ffmpeg vẫn chạy trơn tru và
 * không báo gì cả, chỉ có giọng ra là sai tốc độ lẫn cao độ.
 */
const TTS_SR = 16_000;

export async function streamCuongMini(
  text: string,
  opts: { voice?: string; speakingRate?: number; phienAm?: boolean },
  onChunk: (pcm: Buffer) => Promise<boolean>,
): Promise<number> {
  // ⚠️ CANH BYTE ĐẦU TIÊN, đừng canh tổng thời gian.
  //
  // Trước đây đặt một hạn chờ 120 giây cho cả lượt. Nghe thì rộng rãi,
  // thực ra là hai lỗi cùng lúc:
  //
  //   - Máy đọc KẸT (12/08/2026: khoá mô hình bị một việc treo giữ, chỉ
  //     `/health` còn trả lời) ⇒ robot ngồi đợi tới hai phút thay vì
  //     chuyển sang giọng khác. Người dùng thấy "nó nghĩ mãi không trả
  //     lời", log ghi `firstAudioMs: 0`, `totalMs: 42039`.
  //   - Mà một câu trả lời DÀI thì chảy lâu là chuyện bình thường, nên
  //     hạ tổng thời gian xuống lại cắt cụt câu đang đọc dở.
  //
  // Hai chuyện đó cần hai con số khác nhau. Thứ phân biệt "kẹt" với
  // "đang chảy" là byte ĐẦU TIÊN: máy đọc khoẻ trả byte đầu sau ~165 ms
  // (đo thật), nên quá 8 giây mà chưa có gì thì nó không sắp có.
  const huy = new AbortController();
  const tong = setTimeout(() => huy.abort(), 120_000);
  const han = hanChoByteDau(opts.voice, text.length);
  let dauTien = setTimeout(() => huy.abort(), han);

  let res: Awaited<ReturnType<typeof fetch>>;
  try {
    res = await fetch(`${cuongMiniRoot()}/tts-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: doiChuNgoaiLai(text, opts.phienAm !== false),
        voice: opts.voice || undefined,
        style: 'tu_nhien',
      }),
      signal: huy.signal,
    });
  } catch (e) {
    clearTimeout(tong);
    clearTimeout(dauTien);
    throw new Error(
      huy.signal.aborted
        ? `cuongmini không trả byte nào trong ${han} ms (${text.length} ký tự) — máy đọc đang kẹt`
        : `cuongmini stream: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
  if (!res.ok || !res.body) {
    clearTimeout(tong);
    clearTimeout(dauTien);
    throw new Error(`cuongmini stream HTTP ${res.status}`);
  }

  // Byte đầu đã về ⇒ tháo canh, để câu dài chảy thoải mái tới trần tổng.
  const goc = res.body as unknown as AsyncIterable<Uint8Array>;
  const nguon = (async function* () {
    try {
      for await (const m of goc) {
        if (dauTien) {
          clearTimeout(dauTien);
          dauTien = null as unknown as NodeJS.Timeout;
        }
        yield m;
      }
    } finally {
      clearTimeout(tong);
      clearTimeout(dauTien);
    }
  })();
  const r = Number(opts.speakingRate);
  const loc = chuoiLoc(r, GAIN_DB[khoaGain('cuongmini', opts.voice)] ?? 0);
  // Không có bộ lọc nào cần chạy ⇒ đường nóng: KHÔNG đẻ tiến trình,
  // không thêm một mili giây nào.
  if (!loc) return bomThang(nguon, onChunk);
  return bomQuaFfmpeg(nguon, loc, onChunk);
}

/**
 * ============================================================
 * Chuẩn hoá độ TO — hai máy đọc, hai mức, chênh 6 dB
 * ============================================================
 *
 * ⚠️ ĐỔI CHẾ ĐỘ TIẾNG LÀ ĐỔI LUÔN MÁY ĐỌC, VÀ HAI MÁY KHÔNG CÙNG MỘT MỨC.
 *
 * Đo thật 13/08/2026, cùng một câu, đo RMS:
 *
 *   Chatterbox (Anh + Robot)   ~7.400  →  −12,8 dBFS
 *   VieNeu     (Tiếng Việt)    ~3.400  →  −19,6 dBFS
 *
 * Chênh 6,8 dB — hơn GẤP ĐÔI độ to. Người dùng nghe ra là "loa lúc to
 * lúc nhỏ, không giữ đúng mức đã cài", và tưởng loa hỏng hoặc nút âm
 * lượng không ăn. Thật ra nút vẫn ăn: nó nhân đúng phần trăm, nhưng nhân
 * lên hai thứ vốn đã khác nhau.
 *
 * Trong CÙNG một máy đọc thì các giọng đều nhau (±0,4 dB đo trên 3 giọng
 * mỗi bên), nên chênh lệch nằm ở tầng MÁY ĐỌC, không phải tầng giọng —
 * và một bảng gain theo máy đọc là đủ.
 *
 * ── Vì sao KHÔNG dùng `speechnorm` / `loudnorm` ──
 *
 * `speechnorm` chỉ biết ĐẨY LÊN. Đo được: nguồn to −13,7 → −13,0 dBFS,
 * tức nó làm cái đã to càng to hơn, và chênh lệch chỉ giảm còn 3,3 dB.
 * Sai hướng.
 *
 * `loudnorm` (EBU R128) chuẩn nhất nhưng cần NHÌN TRƯỚC vài giây — đây
 * là đường nói chuyện thời gian thực, độ trễ mở miệng đang ~165 ms và
 * không được phép cộng thêm giây nào.
 *
 * Gain cố định + `alimiter` thì đoán trước được hoàn toàn, không thở
 * phập phồng, không nhìn trước. Đo lại sau khi áp: −16,4 so với −15,5
 * dBFS, chênh 0,9 dB — dưới ngưỡng tai người phân biệt — và KHÔNG mẫu
 * nào vượt ngưỡng ở cả hai bên.
 *
 * Đổi bằng env khi thêm máy đọc mới, không cần sửa mã:
 *   `MAKERLAB_GAIN_CUONGMINI_VI` / `MAKERLAB_GAIN_CUONGMINI_EN` / `MAKERLAB_GAIN_GOOGLE`
 */
const GAIN_DB: Record<string, number> = {
  // VieNeu — nguồn nhỏ nhất, kéo lên.
  'cuongmini-vi': Number(process.env.MAKERLAB_GAIN_CUONGMINI_VI ?? 3.7),
  // Chatterbox — nguồn to nhất, hạ xuống.
  'cuongmini-en': Number(process.env.MAKERLAB_GAIN_CUONGMINI_EN ?? -3.2),
  // Google chỉ còn là lưới đỡ; để 0 cho tới khi có số đo thật.
  google: Number(process.env.MAKERLAB_GAIN_GOOGLE ?? 0),
};

/** Giọng này thuộc máy đọc nào — quyết định lấy gain nào. */
export function khoaGain(provider: string, voice?: string | null): string {
  if (provider !== 'cuongmini') return provider;
  // Giọng tiếng Anh đều bắt đầu bằng `en-`, trừ giọng nhân bản. Cách chắc
  // chắn là hỏi máy chủ, nhưng ở đường nóng thì một lần gọi mạng cho mỗi
  // mẩu tiếng là quá đắt — nên dựa vào tên, và giọng nhân bản tiếng Anh
  // khai báo qua `MAKERLAB_GIONG_EN` khi cần.
  const dsEn = (process.env.MAKERLAB_GIONG_EN || 'robot-walle')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  const v = String(voice || '');
  return v.startsWith('en-') || dsEn.includes(v) ? 'cuongmini-en' : 'cuongmini-vi';
}

/** Chuỗi bộ lọc ffmpeg, hoặc `null` nếu không cần đụng tới tiếng. */
function chuoiLoc(rate: number, gainDb: number): string | null {
  const loc: string[] = [];
  if (Number.isFinite(rate) && rate !== 1) {
    loc.push(`atempo=${Math.min(2, Math.max(0.5, rate)).toFixed(2)}`);
  }
  // Dưới 0,3 dB thì tai không nghe ra, mà vẫn phải đẻ một tiến trình
  // ffmpeg cho mỗi mẩu tiếng. Không đáng.
  if (Number.isFinite(gainDb) && Math.abs(gainDb) >= 0.3) {
    // `alimiter` đứng SAU: kéo lên 3,7 dB trên một nguồn vốn đã chạm đỉnh
    // 32767 (đo được ở giọng "Cuong") là vỡ tiếng. Limiter chặn đúng chỗ
    // đó, và nó chỉ nhìn trước ~5 ms nên không ảnh hưởng độ trễ.
    loc.push(`volume=${gainDb.toFixed(1)}dB`, 'alimiter=limit=0.95');
  }
  return loc.length ? loc.join(',') : null;
}

async function bomThang(
  nguon: AsyncIterable<Uint8Array>,
  onChunk: (pcm: Buffer) => Promise<boolean>,
): Promise<number> {
  let tong = 0;
  for await (const mau of nguon) {
    const b = Buffer.from(mau);
    tong += b.length;
    // Bên gọi trả false khi bo rớt mạng hoặc người dùng chen lời — dừng
    // NGAY, đừng đọc nốt cả đoạn rồi mới biết không ai nghe nữa.
    if (!(await onChunk(b))) break;
  }
  return tong;
}

/**
 * Đổi tốc độ NGAY TRÊN DÒNG CHẢY, không đợi đủ bài rồi mới xử lý.
 *
 * Vì sao không dùng lại `doiTocDo()`: hàm đó nhận một Buffer WAV hoàn
 * chỉnh và trả về một Buffer hoàn chỉnh. Ghép nó vào đây là vứt bỏ đúng
 * cái thứ khiến đường luồng tồn tại — byte đầu tiên tới tai sau ~105 ms
 * thay vì sau khi sinh xong cả câu. Đổi tốc độ mà mất luôn tính "chảy"
 * thì thà đừng chảy.
 *
 * `atempo` giữ nguyên cao độ. Kéo tốc độ bằng cách đổi tần số lấy mẫu thì
 * nhanh hơn nhưng giọng biến thành giọng chuột — đây là giọng nhân bản
 * của chính người dùng, méo cao độ là hỏng hết ý nghĩa.
 */
async function bomQuaFfmpeg(
  nguon: AsyncIterable<Uint8Array>,
  loc: string,
  onChunk: (pcm: Buffer) => Promise<boolean>,
): Promise<number> {
  const { spawn } = await import('child_process');
  const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
    '-hide_banner', '-loglevel', 'error',
    '-f', 's16le', '-ar', String(TTS_SR), '-ac', '1', '-i', 'pipe:0',
    // MỘT lượt ffmpeg cho cả đổi tốc độ lẫn chuẩn âm lượng. Hai lượt là
    // hai tiến trình và hai lần sao chép đệm cho mỗi mẩu tiếng.
    '-af', loc,
    '-f', 's16le', '-ar', String(TTS_SR), '-ac', '1', 'pipe:1',
  ]);
  // Người dùng chen lời ⇒ ta giết ffmpeg ⇒ lệnh ghi đang dở bắn EPIPE.
  // Không bắt ở đây thì lỗi đó nổi lên thành uncaught và hạ cả tiến trình
  // Node — mất luôn mọi lượt nói của mọi thiết bị vì một lần chen lời.
  ff.stdin.on('error', () => {});

  const bom = (async () => {
    try {
      for await (const mau of nguon) {
        if (!ff.stdin.writable) break;
        if (!ff.stdin.write(Buffer.from(mau))) {
          await new Promise((ok) => ff.stdin.once('drain', ok));
        }
      }
    } catch {
      /* nguồn đứt giữa chừng — cứ đóng đầu vào, ffmpeg xả nốt phần đã nhận */
    } finally {
      ff.stdin.end();
    }
  })();

  let tong = 0;
  try {
    for await (const mau of ff.stdout as unknown as AsyncIterable<Buffer>) {
      const b = Buffer.from(mau);
      tong += b.length;
      if (!(await onChunk(b))) {
        ff.kill('SIGKILL');
        break;
      }
    }
  } finally {
    await bom.catch(() => {});
  }
  return tong;
}

async function doiTocDo(wav: Buffer, rate: number): Promise<Buffer> {
  const r = Math.min(2, Math.max(0.5, rate));
  const { spawn } = await import('child_process');
  return new Promise((resolve) => {
    const ff = spawn(process.env.FFMPEG_PATH || 'ffmpeg', [
      '-hide_banner', '-loglevel', 'error',
      '-i', 'pipe:0', '-af', `atempo=${r.toFixed(2)}`, '-f', 'wav', 'pipe:1',
    ]);
    const ra: Buffer[] = [];
    ff.stdout.on('data', (c: Buffer) => ra.push(c));
    ff.on('close', () => {
      const out = Buffer.concat(ra);
      resolve(out.length > 64 ? out : wav);   // hỏng thì trả bản gốc
    });
    ff.stdin.end(wav);
  });
}

function providerConfigured(p: TtsProvider): boolean {
  if (p === 'gcloud') return !!process.env.GOOGLE_TTS_API_KEY;
  if (p === 'fptai') return !!process.env.FPTAI_API_KEY;
  if (p === 'openai') return !!process.env.OPENAI_API_KEY;
  if (p === 'elevenlabs') return !!process.env.ELEVENLABS_API_KEY;
  // Edge needs its client token supplied; unset means skip it.
  if (p === 'edge') return !!edgeToken();
  // cuongmini: luôn coi là "có cấu hình" — địa chỉ mặc định trỏ vào
  // dịch vụ TTS trên chính VPS, nên nó không bao giờ là chỗ chết. Có
  // đường hầm thì biến môi trường trỏ về máy nhà; không có thì vẫn chạy
  // được, chỉ chậm hơn.
  if (p === 'cuongmini') return true;
  return true; // google needs no credentials
}

function runProvider(p: TtsProvider, text: string, opts: TtsOptions): Promise<Buffer> {
  const voice = opts.voice || process.env.MAKERLAB_TTS_VOICE || DEFAULT_VOICE[p];
  const lang = opts.language || process.env.MAKERLAB_TTS_LANG || 'vi-VN';
  switch (p) {
    case 'edge':
      return synthesizeEdge(text, voice || DEFAULT_VOICE.edge, lang, opts);
    case 'google':
      return synthesizeGoogle(text, lang.split('-')[0] || 'vi');
    case 'gcloud':
      return synthesizeGoogleCloud(text, voice || DEFAULT_VOICE.gcloud, lang, opts.speakingRate);
    case 'fptai':
      return synthesizeFptAi(text, voice || DEFAULT_VOICE.fptai, opts.speakingRate);
    case 'openai':
      return synthesizeOpenAI(text, voice || DEFAULT_VOICE.openai);
    case 'elevenlabs':
      return synthesizeElevenLabs(text, voice);
    case 'cuongmini':
      return synthesizeCuongMini(text, voice, opts.speakingRate);
  }
}

/**
 * Strip things that sound terrible when read out loud. The LLM is
 * told not to emit markdown, but "told not to" is not a guarantee.
 */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_#>|]/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    // Khớp với MAX_SAY_CHARS bên voiceLoop. Để lệch thì cái nhỏ hơn âm
    // thầm thắng, và câu dài lại cụt ở một chỗ khác — đúng kiểu lỗi
    // vừa mất công truy ra.
    .slice(0, 2_000);
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`tts timeout after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

// ─── Edge (Microsoft read-aloud) ───────────────────────────

/**
 * Microsoft's read-aloud handshake needs a client token. It is a public
 * constant, not a credential — but it is indistinguishable from one to
 * a secret scanner, and hardcoding it would trip the repo's pre-commit
 * hook for every future contributor.
 *
 * Keeping it in env also matches reality: Microsoft started answering
 * 403 to this handshake on 2026-08-07, so the provider is opt-in now.
 * Unset (the default) means edge is skipped entirely rather than
 * burning ~600 ms on a doomed handshake before falling through.
 */
function edgeToken(): string {
  return process.env.MAKERLAB_EDGE_TOKEN ?? '';
}

function edgeWssUrl(): string {
  return `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${edgeToken()}`;
}

function edgeTimestamp(): string {
  return new Date().toISOString().replace(/[:-]/g, '').replace(/\.\d+Z$/, 'Z');
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Edge's protocol: a WebSocket carrying HTTP-ish framed messages.
 * Text frames are `Header:value\r\n...\r\n\r\nbody`; binary frames
 * start with a big-endian uint16 header length, then the header,
 * then the MP3 bytes. `Path:turn.end` means the clip is complete.
 */
function synthesizeEdge(
  text: string,
  voice: string,
  language: string,
  opts: TtsOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(edgeWssUrl(), {
      headers: {
        Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
      },
    });

    const chunks: Buffer[] = [];
    let settled = false;
    const done = (err: Error | null, buf?: Buffer) => {
      if (settled) return;
      settled = true;
      try {
        ws.close();
      } catch {
        /* already closing */
      }
      if (err) reject(err);
      else resolve(buf ?? Buffer.alloc(0));
    };

    ws.on('open', () => {
      const ts = edgeTimestamp();
      ws.send(
        `X-Timestamp:${ts}\r\n` +
          'Content-Type:application/json; charset=utf-8\r\n' +
          'Path:speech.config\r\n\r\n' +
          '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}',
      );

      const rate = clampInt(opts.ratePct ?? 0, -50, 50);
      const pitch = clampInt(opts.pitchHz ?? 0, -50, 50);
      const ssml =
        `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${language}'>` +
        `<voice name='${voice}'>` +
        `<prosody rate='${rate >= 0 ? '+' : ''}${rate}%' pitch='${pitch >= 0 ? '+' : ''}${pitch}Hz'>` +
        `${escapeXml(text)}</prosody></voice></speak>`;

      ws.send(
        `X-RequestId:${randomUUID().replace(/-/g, '')}\r\n` +
          'Content-Type:application/ssml+xml\r\n' +
          `X-Timestamp:${ts}\r\n` +
          'Path:ssml\r\n\r\n' +
          ssml,
      );
    });

    ws.on('message', (data: Buffer, isBinary: boolean) => {
      if (isBinary) {
        if (data.length < 2) return;
        const headerLen = data.readUInt16BE(0);
        const body = data.subarray(2 + headerLen);
        if (body.length) chunks.push(body);
        return;
      }
      const msg = data.toString();
      if (msg.includes('Path:turn.end')) {
        const out = Buffer.concat(chunks);
        if (!out.length) done(new Error('edge tts returned no audio'));
        else done(null, out);
      }
    });

    ws.on('error', (err) => done(err instanceof Error ? err : new Error(String(err))));
    ws.on('close', () => {
      if (settled) return;
      const out = Buffer.concat(chunks);
      if (out.length) done(null, out);
      else done(new Error('edge tts socket closed before audio'));
    });
  });
}

function clampInt(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.trunc(n)));
}

// ─── Google translate_tts ──────────────────────────────────

/**
 * Free and keyless, but hard-capped at ~200 characters per request,
 * so long replies are split on sentence boundaries and the MP3s are
 * concatenated. Frame-level concatenation is legal MP3 and every
 * decoder (including the ESP32's) plays it back seamlessly.
 */
async function synthesizeGoogle(text: string, lang: string): Promise<Buffer> {
  const parts = chunkText(text, 190);
  const out: Buffer[] = [];
  for (const part of parts) {
    const url =
      'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob' +
      `&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(part)}&total=${parts.length}&idx=${out.length}&textlen=${part.length}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://translate.google.com/',
      },
    });
    if (!res.ok) throw new Error(`google tts HTTP ${res.status}`);
    out.push(Buffer.from(await res.arrayBuffer()));
  }
  return Buffer.concat(out);
}

/** Split on sentence ends, then on spaces, never mid-word. */
function chunkText(text: string, max: number): string[] {
  const sentences = text.split(/(?<=[.!?…。！？])\s+/);
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (s.length > max) {
      if (cur) {
        chunks.push(cur);
        cur = '';
      }
      let rest = s;
      while (rest.length > max) {
        const cut = rest.lastIndexOf(' ', max);
        const at = cut > max * 0.5 ? cut : max;
        chunks.push(rest.slice(0, at));
        rest = rest.slice(at).trim();
      }
      cur = rest;
      continue;
    }
    if ((cur + ' ' + s).trim().length > max) {
      chunks.push(cur);
      cur = s;
    } else {
      cur = (cur + ' ' + s).trim();
    }
  }
  if (cur) chunks.push(cur);
  return chunks.filter(Boolean);
}

// ─── OpenAI ────────────────────────────────────────────────

async function synthesizeOpenAI(text: string, voice: string): Promise<Buffer> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.MAKERLAB_OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
      voice,
      input: text,
      response_format: 'mp3',
    }),
  });
  if (!res.ok) throw new Error(`openai tts HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  return Buffer.from(await res.arrayBuffer());
}

// ─── ElevenLabs (voice cloning) ────────────────────────────

async function synthesizeElevenLabs(text: string, voiceId: string): Promise<Buffer> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY missing');
  const id = voiceId || process.env.MAKERLAB_TTS_VOICE;
  if (!id) throw new Error('elevenlabs voice id missing');

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}?output_format=mp3_22050_32`,
    {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        // v2.5 flash is the low-latency multilingual model — the right
        // trade-off for a robot that has to answer in about a second.
        model_id: process.env.MAKERLAB_ELEVEN_MODEL || 'eleven_flash_v2_5',
        voice_settings: { stability: 0.45, similarity_boost: 0.85, style: 0.2 },
      }),
    },
  );
  if (!res.ok)
    throw new Error(`elevenlabs HTTP ${res.status} ${(await res.text()).slice(0, 120)}`);
  return Buffer.from(await res.arrayBuffer());
}

// ─── FPT.AI (giọng Việt, đăng ký không cần thẻ) ────────────

/**
 * Giọng Việt của người Việt làm, và là đường DUY NHẤT trong file này
 * đăng ký được mà không cần thẻ quốc tế.
 *
 * Vì sao có thêm cửa này (11/08/2026): Google Cloud từ chối hồ sơ thanh
 * toán với mã `OR_BACR2_31`, ElevenLabs cũng đòi thẻ, còn Edge thì trả
 * 403 kể cả khi đã ký đúng `Sec-MS-GEC` (tôi thử rồi, không phải đoán).
 * `console.fpt.ai` chỉ cần email + số điện thoại Việt Nam.
 *
 * ⚠️ Khác mọi nhà cung cấp còn lại ở một điểm quan trọng: nó KHÔNG trả
 * về file. Nó trả về một URL rồi sinh file ở đằng sau, nên phải hỏi lại
 * URL đó tới khi có. Đó là lý do có vòng lặp dưới đây, và cũng là lý do
 * đường này chậm hơn Google chừng nửa giây mỗi lượt.
 */
async function synthesizeFptAi(
  text: string,
  voice: string,
  speakingRate?: number,
): Promise<Buffer> {
  const key = process.env.FPTAI_API_KEY;
  if (!key) throw new Error('FPTAI_API_KEY missing');

  // FPT.AI nhận tốc độ theo thang -3..3, không phải hệ số nhân như
  // Google. Quy đổi để MỘT thanh trượt trên web điều khiển được cả hai.
  //
  // Hai vế phải có hệ số khác nhau, vì thanh trượt không đối xứng quanh
  // 1: bên chậm chỉ có nửa đơn vị (0,5→1) còn bên nhanh có cả đơn vị
  // (1→2). Dùng chung một hệ số thì phía nhanh bị bão hoà — 1,5 và 2,0
  // cùng ra +3, kéo thêm không thấy đổi gì và trông như thanh trượt
  // hỏng.
  const speed =
    typeof speakingRate !== 'number' || speakingRate === 1
      ? 0
      : Math.max(
          -3,
          Math.min(3, +((speakingRate < 1 ? (speakingRate - 1) * 6 : (speakingRate - 1) * 3).toFixed(1))),
        );

  const res = await fetch('https://api.fpt.ai/hmi/tts/v5', {
    method: 'POST',
    headers: {
      'api-key': key,
      voice,
      speed: String(speed),
      'Content-Type': 'text/plain; charset=utf-8',
    },
    body: text,
    signal: AbortSignal.timeout(TTS_TIMEOUT_MS),
  });
  if (!res.ok)
    throw new Error(`fptai HTTP ${res.status} ${(await res.text()).slice(0, 140)}`);

  const json = (await res.json()) as { async?: string; error?: number; message?: string };
  if (!json.async) throw new Error(`fptai không trả URL: ${json.message ?? 'không rõ'}`);

  // Hỏi lại tới khi file sinh xong. Trong lúc chưa xong nó trả 403/404
  // chứ không phải lỗi thật — đừng nhầm hai thứ đó, nếu không sẽ bỏ
  // cuộc ngay ở lần hỏi đầu tiên và tưởng khoá hỏng.
  const deadline = Date.now() + TTS_TIMEOUT_MS;
  let delay = 250;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, delay));
    const file = await fetch(json.async).catch(() => null);
    if (file?.ok) {
      const buf = Buffer.from(await file.arrayBuffer());
      if (buf.length > 0) return buf;
    }
    delay = Math.min(delay * 1.5, 1_200);
  }
  throw new Error('fptai: hết giờ chờ file');
}

/** Surfaced in the frontend so the setup steps live next to the switch. */
export const cloneVoiceHowTo = {
  provider: 'elevenlabs',
  steps: [
    'Thu 3–5 phút giọng của bạn: đọc rõ, phòng yên, một micro duy nhất, không nhạc nền.',
    'Lên elevenlabs.io → Voices → Add Voice → Instant Voice Cloning → tải file lên.',
    'Sao chép Voice ID mà nó sinh ra.',
    'Trên VPS thêm vào /opt/cuonghoangdev/.env: MAKERLAB_TTS_PROVIDER=elevenlabs, ELEVENLABS_API_KEY=..., MAKERLAB_TTS_VOICE=<voice id>',
    'Khởi động lại container backend. Không phải build lại, không phải sửa code.',
  ],
};

// ─── Google Cloud Text-to-Speech ───────────────────────────

/**
 * Khác hẳn `synthesizeGoogle` ở trên. Cái kia gọi `translate_tts` —
 * cửa sau miễn phí không cần khoá, đúng MỘT giọng máy móc cho mỗi
 * ngôn ngữ, và Google có thể chặn bất cứ lúc nào. Cái này là dịch vụ
 * thật, có khoá, nhiều giọng, chất lượng hơn hẳn.
 *
 * Vì sao đáng đổi — con số lấy từ bảng giá chính thức 10/08/2026:
 *
 *   WaveNet / Standard   4.000.000 ký tự/tháng miễn phí, sau đó  4 $/1M
 *   Neural2 / Chirp3-HD  1.000.000 ký tự/tháng miễn phí, sau đó 16-30 $/1M
 *
 * Robot mỗi lượt nói ~120 ký tự. 4 triệu ký tự là ~33.000 lượt mỗi
 * tháng, tức 1.100 lượt mỗi ngày — với một con robot để bàn thì đó là
 * vô hạn trên thực tế. Để so: ElevenLabs gói 22 $ cho 121.000 ký tự,
 * tức ~1.000 lượt/tháng. Gấp 33 lần, mà miễn phí.
 *
 * Đánh đổi: KHÔNG nhân bản được giọng của bạn. Đó vẫn là chỗ duy nhất
 * ElevenLabs hơn.
 */
async function synthesizeGoogleCloud(
  text: string,
  voice: string,
  lang: string,
  speakingRate?: number,
): Promise<Buffer> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY missing');

  // Tên giọng đã cõng sẵn mã ngôn ngữ ("vi-VN-Wavenet-D") — lấy từ đó
  // ra thay vì tin vào `lang` truyền xuống, vì chọn nhầm cặp
  // ngôn-ngữ/giọng thì API trả 400 chứ không tự sửa.
  const languageCode = /^[a-z]{2}-[A-Z]{2}/.exec(voice)?.[0] || lang || 'vi-VN';

  // ⚠️ Google Cloud chặn ở 5.000 BYTE mỗi lần gọi, không phải ký tự.
  //
  // Tiếng Việt có dấu tốn 2-3 byte một ký tự trong UTF-8, nên 2.000 ký
  // tự có thể thành ~4.500 byte — sát trần tới mức chỉ cần một câu dài
  // hơn thường lệ là API trả 400 và robot câm nguyên lượt. Cắt ở 1.200
  // ký tự cho chắc chắn dưới trần kể cả trường hợp xấu nhất, rồi nối
  // các MP3 lại: nối ở ranh giới frame là MP3 hợp lệ, mọi bộ giải mã
  // kể cả trên ESP32 đều phát liền mạch (đường `google` ở trên đã sống
  // bằng đúng mẹo này từ đầu).
  const parts = chunkText(text, 1_200);
  if (parts.length > 1) {
    const outs: Buffer[] = [];
    for (const p of parts) outs.push(await gcloudOnce(p, voice, languageCode, key, speakingRate));
    return Buffer.concat(outs);
  }
  return gcloudOnce(parts[0] ?? text, voice, languageCode, key, speakingRate);
}

async function gcloudOnce(
  text: string,
  voice: string,
  languageCode: string,
  key: string,
  speakingRate?: number,
): Promise<Buffer> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TTS_TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode, name: voice },
          // MP3 chứ không phải LINEAR16: gateway đã có sẵn đường đổi
          // sang PCM cho bo, và MP3 nhẹ hơn ~4 lần khi đi qua mạng tới
          // VPS. Chỗ này không phải nút thắt — đổi mã chỉ tốn ~120 ms.
          audioConfig: {
            audioEncoding: 'MP3',
            // Ngoài dải 0,25–4,0 thì Google trả 400 chứ không tự kẹp,
            // nên kẹp ở đây. Bỏ hẳn trường khi bằng 1 để giữ nguyên
            // hành vi mặc định của API.
            ...(typeof speakingRate === 'number' && speakingRate !== 1
              ? { speakingRate: Math.max(0.25, Math.min(4, speakingRate)) }
              : {}),
          },
        }),
        signal: ctrl.signal,
      },
    );
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`gcloud tts HTTP ${res.status} ${detail.slice(0, 160)}`);
    }
    const json = (await res.json()) as { audioContent?: string };
    if (!json.audioContent) throw new Error('gcloud tts: thiếu audioContent');
    return Buffer.from(json.audioContent, 'base64');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Giọng tiếng Việt của Google Cloud, để UI khỏi phải đoán.
 *
 * Danh sách này có thể lệch với thực tế theo thời gian — gọi
 * `listGoogleCloudVoices()` để lấy bản thật từ API khi cần chắc chắn.
 */
export const GCLOUD_VI_VOICES = [
  { id: 'vi-VN-Wavenet-A', label: 'WaveNet A — nữ' },
  { id: 'vi-VN-Wavenet-B', label: 'WaveNet B — nam' },
  { id: 'vi-VN-Wavenet-C', label: 'WaveNet C — nữ' },
  { id: 'vi-VN-Wavenet-D', label: 'WaveNet D — nam' },
  { id: 'vi-VN-Standard-A', label: 'Standard A — nữ' },
  { id: 'vi-VN-Standard-B', label: 'Standard B — nam' },
  { id: 'vi-VN-Standard-C', label: 'Standard C — nữ' },
  { id: 'vi-VN-Standard-D', label: 'Standard D — nam' },
  { id: 'vi-VN-Neural2-A', label: 'Neural2 A — nữ (hạn 1M/tháng)' },
  { id: 'vi-VN-Neural2-D', label: 'Neural2 D — nam (hạn 1M/tháng)' },
];

/** Hỏi thẳng API xem tài khoản này có những giọng nào. */
export async function listGoogleCloudVoices(lang = 'vi-VN'): Promise<string[]> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) throw new Error('GOOGLE_TTS_API_KEY missing');
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/voices?languageCode=${encodeURIComponent(lang)}&key=${encodeURIComponent(key)}`,
  );
  if (!res.ok) throw new Error(`gcloud voices HTTP ${res.status}`);
  const json = (await res.json()) as { voices?: Array<{ name?: string }> };
  return (json.voices ?? []).map((v) => v.name ?? '').filter(Boolean);
}
