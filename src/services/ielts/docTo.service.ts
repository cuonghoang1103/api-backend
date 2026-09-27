/**
 * Đọc to cho khoá IELTS trên web — giọng Anh thật (Google Cloud WaveNet),
 * sinh MỘT lần rồi nằm trên R2.
 * ─────────────────────────────────────────────────────────────────────────
 * Vì sao không dùng giọng máy của trình duyệt: mỗi máy một giọng (Mac đọc
 * khác iPad khác Windows), có máy không có giọng Anh nào, và giọng mặc định
 * nghe rõ là máy. Người học nghe đi nghe lại cùng một câu nên cần một giọng
 * ổn định, tự nhiên.
 *
 * Vì sao không đi qua `synthesizeSpeech` của Maker Lab: chuỗi dự phòng ở đó
 * là cho robot TIẾNG VIỆT — hỏng Google Cloud thì nó rơi sang giọng Việt, đọc
 * tiếng Anh sai hoàn toàn. Ở đây hỏng thì trả `url: null`, web tự lùi về
 * giọng trình duyệt. Và bài đánh vần cần SSML `say-as characters` — đọc "A"
 * là /eɪ/ chứ không phải mạo từ /ə/ — mà đường chung chỉ gửi văn bản thường.
 *
 * Khoá R2 = băm của (giọng, tốc độ, kiểu, chữ): cùng một câu chỉ tốn tiền
 * sinh đúng một lần cho cả trang web, mọi người học sau nghe lại file đó.
 */
import crypto from 'node:crypto';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { objectExists, putObject, buildPublicUrl } from '../../config/r2.js';

/** Giọng cho phép — danh sách trắng, để không ai đốt hạn mức bằng giọng lạ. */
export const GIONG = {
  'uk-nu': 'en-GB-Wavenet-F',
  'uk-nam': 'en-GB-Wavenet-B',
  'us-nu': 'en-US-Wavenet-F',
  'us-nam': 'en-US-Wavenet-D',
} as const;
export type Giong = keyof typeof GIONG;

const TOI_DA_KY_TU = 1500;
/** Trần số lần SINH MỚI mỗi người mỗi ngày (file đã có thì không tính). */
const TRAN_SINH_MOI_NGAY = 400;
const daSinh = new Map<string, number>();

function demSinh(userId: number): boolean {
  const k = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const n = (daSinh.get(k) ?? 0) + 1;
  if (n > TRAN_SINH_MOI_NGAY) return false;
  daSinh.set(k, n);
  if (daSinh.size > 5000) daSinh.clear(); // qua ngày: dọn cho khỏi phình
  return true;
}

const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * `danhVan`: chữ dạng "W, A, L, S, H" hoặc "C, B, 2, 8, Q, X" — mỗi mẩu giữa
 * dấu phẩy đọc như tên chữ cái, cách nhau một nhịp; từ nhiều chữ ("double",
 * "dot", "Greenwood Road") đọc như từ thường.
 */
function ssmlDanhVan(text: string): string {
  const parts = text.split(/\s*,\s*/).filter(Boolean);
  const body = parts
    .map((p) => (/^[A-Za-z0-9]$/.test(p)
      ? `<say-as interpret-as="characters">${escXml(p)}</say-as>`
      : escXml(p)))
    .join('<break time="450ms"/>');
  return `<speak>${body}</speak>`;
}

export async function docTo(userId: number, b: { text?: unknown; giong?: unknown; toc?: unknown; kieu?: unknown }) {
  const text = String(b.text ?? '').trim();
  if (!text) throw new BadRequestError('Thiếu chữ để đọc');
  if (text.length > TOI_DA_KY_TU) throw new BadRequestError(`Tối đa ${TOI_DA_KY_TU} ký tự mỗi lần`);
  const giong: Giong = (Object.keys(GIONG) as Giong[]).includes(b.giong as Giong) ? (b.giong as Giong) : 'uk-nu';
  const toc = Math.min(1.2, Math.max(0.6, Number(b.toc) || 0.95));
  const danhVan = b.kieu === 'danhvan';

  const bam = crypto.createHash('sha1').update(`${giong}|${toc}|${danhVan ? 'dv' : 'tt'}|${text}`).digest('hex');
  const key = `ielts/audio/${giong}/${bam}.mp3`;
  if (await objectExists(key)) return { url: buildPublicUrl(key) };

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  // Không có khoá: nói rõ lý do, web tự đọc bằng giọng trình duyệt.
  if (!apiKey) return { url: null, lyDo: 'no_tts_key' as const };
  if (!demSinh(userId)) return { url: null, lyDo: 'quota' as const };

  const name = GIONG[giong];
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        input: danhVan ? { ssml: ssmlDanhVan(text) } : { text },
        voice: { languageCode: name.slice(0, 5), name },
        audioConfig: { audioEncoding: 'MP3', speakingRate: toc, effectsProfileId: ['headphone-class-device'] },
      }),
    },
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(`Google TTS ${res.status}: ${msg.slice(0, 200)}`);
  }
  const j = (await res.json()) as { audioContent?: string };
  if (!j.audioContent) throw new Error('Google TTS trả về rỗng');
  const { url } = await putObject(key, Buffer.from(j.audioContent, 'base64'), 'audio/mpeg');
  return { url };
}
