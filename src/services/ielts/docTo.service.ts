/**
 * Đọc to cho khoá IELTS trên web — giọng Anh thật, sinh MỘT lần rồi nằm trên R2.
 *
 * Ba nguồn, theo thứ tự (03/10/2026):
 *   1. Azure Speech Neural — `AZURE_SPEECH_KEY` + `AZURE_SPEECH_REGION`. Gói F0
 *      miễn phí 0,5 triệu ký tự/tháng; cùng khoá đó chấm phát âm. Đây là đường
 *      chính: Google Cloud đòi TRẢ TRƯỚC 800.000₫ với thẻ Việt Nam.
 *   2. Google Cloud WaveNet — `GOOGLE_TTS_API_KEY` (giữ lại nếu sau này có khoá).
 *   3. Google Dịch — không khoá, một giọng mỗi thứ tiếng. Azure hết hạn mức
 *      tháng (429) hay lỗi thì cũng rơi về đây: bài nghe không bao giờ câm.
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
import { synthesizeGoogle } from '../makerlab/tts.js';

/** Giọng cho phép — danh sách trắng, để không ai đốt hạn mức bằng giọng lạ. */
export const GIONG = {
  'uk-nu': 'en-GB-Wavenet-F',
  'uk-nam': 'en-GB-Wavenet-B',
  'us-nu': 'en-US-Wavenet-F',
  'us-nam': 'en-US-Wavenet-D',
  // Khoá tiếng Nhật (Dekiru, JPD113/123) dùng chung đường này.
  'ja-nu': 'ja-JP-Wavenet-A',
  'ja-nam': 'ja-JP-Wavenet-C',
  // Khoá JP/CH (05/10/2026): tiếng Trung phổ thông.
  'zh-nu': 'cmn-CN-Wavenet-A',
  'zh-nam': 'cmn-CN-Wavenet-B',
  // Người dẫn bài nghe (lời giới thiệu, đánh số câu) — components/sach-hoc/nghe.ts.
  dan: 'en-GB-Wavenet-A',
} as const;
export type Giong = keyof typeof GIONG;

/** Giọng Azure Neural tương ứng (đo 03/10: cả 6 có trong /voices/list vùng eastasia). */
const GIONG_AZURE: Record<Giong, string> = {
  'uk-nu': 'en-GB-SoniaNeural',
  'uk-nam': 'en-GB-RyanNeural',
  'us-nu': 'en-US-AvaNeural',
  'us-nam': 'en-US-AndrewNeural',
  'ja-nu': 'ja-JP-NanamiNeural',
  'ja-nam': 'ja-JP-KeitaNeural',
  'zh-nu': 'zh-CN-XiaoxiaoNeural',
  'zh-nam': 'zh-CN-YunxiNeural',
  dan: 'en-GB-LibbyNeural',
};

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

/** Azure: SSML có prosody (tốc độ) và say-as cho bài đánh vần. Lỗi → ném, bên gọi tự lùi. */
async function synthesizeAzure(text: string, giong: Giong, toc: number, danhVan: boolean): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY!;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  const name = GIONG_AZURE[giong];
  const body = danhVan ? ssmlDanhVan(text).replace(/^<speak>|<\/speak>$/g, '') : escXml(text);
  const rate = `${Math.round((toc - 1) * 100)}%`;
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${name.slice(0, 5)}">`
    + `<voice name="${name}"><prosody rate="${rate}">${body}</prosody></voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      'User-Agent': 'cuongthai-ielts',
    },
    signal: AbortSignal.timeout(20_000),
    body: ssml,
  });
  if (!res.ok) throw new Error(`Azure TTS ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error('Azure TTS trả về rỗng');
  return buf;
}

/** Giọng Google Dịch — lưới đỡ cuối, không khoá. */
async function docGoogleDich(text: string, giong: Giong, bam: string, danhVan: boolean) {
  const keyGt = `ielts/audio/gt-${giong.slice(0, 2)}/${bam}.mp3`;
  if (await objectExists(keyGt)) return { url: buildPublicUrl(keyGt), giongDon: true };
  const tl = giong.startsWith('ja') ? 'ja' : giong.startsWith('zh') ? 'zh-CN' : giong.startsWith('us') ? 'en-US' : 'en-GB';
  const doc = danhVan ? text.split(/\s*,\s*/).join('. ') : text;
  const mp3 = await synthesizeGoogle(doc, tl);
  const { url } = await putObject(keyGt, mp3, 'audio/mpeg');
  return { url, giongDon: true };
}

/**
 * Tệp đã chắc chắn có trên R2 — khỏi hỏi lại R2 mỗi lần bấm (đo 03/10: 135ms
 * cho câu đã có, gần hết là lượt HEAD sang R2). Và lượt ĐANG tạo của từng
 * tệp: bấm liên tục / web tải trước trùng câu thì chỉ gọi Azure MỘT lần.
 */
const daCo = new Set<string>();
const dangTao = new Map<string, Promise<string>>();
async function coSan(key: string): Promise<boolean> {
  if (daCo.has(key)) return true;
  const ok = await objectExists(key);
  if (ok) { if (daCo.size > 50_000) daCo.clear(); daCo.add(key); }
  return ok;
}

export async function docTo(userId: number, b: { text?: unknown; giong?: unknown; toc?: unknown; kieu?: unknown }) {
  const text = String(b.text ?? '').trim();
  if (!text) throw new BadRequestError('Thiếu chữ để đọc');
  if (text.length > TOI_DA_KY_TU) throw new BadRequestError(`Tối đa ${TOI_DA_KY_TU} ký tự mỗi lần`);
  const giong: Giong = (Object.keys(GIONG) as Giong[]).includes(b.giong as Giong) ? (b.giong as Giong) : 'uk-nu';
  const toc = Math.min(1.2, Math.max(0.6, Number(b.toc) || 0.95));
  const danhVan = b.kieu === 'danhvan';

  const bam = crypto.createHash('sha1').update(`${giong}|${toc}|${danhVan ? 'dv' : 'tt'}|${text}`).digest('hex');

  // 1. Azure — thư mục riêng `az-…` để không lẫn với file WaveNet/Google Dịch cũ.
  if (process.env.AZURE_SPEECH_KEY) {
    const keyAz = `ielts/audio/az-${giong}/${bam}.mp3`;
    if (await coSan(keyAz)) return { url: buildPublicUrl(keyAz) };
    const dang = dangTao.get(keyAz);
    if (dang) return dang.then((url) => ({ url }), () => docGoogleDich(text, giong, bam, danhVan));
    if (!demSinh(userId)) return { url: null, lyDo: 'quota' as const };
    const p = (async () => {
      const { url } = await putObject(keyAz, await synthesizeAzure(text, giong, toc, danhVan), 'audio/mpeg');
      daCo.add(keyAz);
      return url;
    })();
    dangTao.set(keyAz, p);
    try {
      return { url: await p };
    } catch (e) {
      console.warn('[ielts/doc] Azure TTS hỏng, lùi về Google Dịch:', (e as Error).message);
      return docGoogleDich(text, giong, bam, danhVan);
    } finally {
      dangTao.delete(keyAz);
    }
  }

  const key = `ielts/audio/${giong}/${bam}.mp3`;
  if (await objectExists(key)) return { url: buildPublicUrl(key) };

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!demSinh(userId)) return { url: null, lyDo: 'quota' as const };
  // 3. Không khoá nào → Google Dịch (xem chú thích đầu tệp).
  if (!apiKey) return docGoogleDich(text, giong, bam, danhVan);

  // 2. Google Cloud WaveNet.
  const name = GIONG[giong];
  const res = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        input: danhVan ? { ssml: ssmlDanhVan(text) } : { text },
        voice: { languageCode: name.split('-').slice(0, 2).join('-'), name },
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
