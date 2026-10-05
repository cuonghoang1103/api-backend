/**
 * Flying Pencil — giọng đọc Azure Neural cho studio game (06/10/2026).
 *
 * Vì sao không dùng `/ielts/doc`: nó chỉ có giọng Anh/Nhật/Trung, chỉ mp3 48 kbps, không có style cảm
 * xúc. Game cần (1) thuyết minh tiếng Việt có giấy phép thương mại rõ (thay giọng VieNeu chưa xác minh —
 * RAID-12/FP-67), (2) lời lính tiếng Anh có cảm xúc ("shouting", "terrified"…) cho chiến trường.
 *
 * Rào chắn: chỉ tài khoản studio (env `FP_TTS_USER_IDS`, mặc định 5 bot fp_* id 151–155) hoặc ADMIN;
 * giọng + style theo danh sách trắng; trần ký tự SINH MỚI mỗi người/ngày (gói Azure F0 0,5 triệu ký
 * tự/tháng dùng chung với IELTS); kết quả WAV 24 kHz lưu R2 theo băm ⇒ cùng câu chỉ tốn tiền một lần.
 */
import crypto from 'node:crypto';
import { BadRequestError, ForbiddenError } from '../../middleware/errorHandler.js';
import { objectExists, putObject, buildPublicUrl } from '../../config/r2.js';

export const GIONG_FP = [
  'vi-VN-NamMinhNeural', 'vi-VN-HoaiMyNeural',
  'en-GB-RyanNeural', 'en-GB-ThomasNeural', 'en-GB-SoniaNeural',
  'en-US-AndrewNeural', 'en-US-DavisNeural', 'en-US-GuyNeural', 'en-US-JasonNeural', 'en-US-TonyNeural',
  'en-US-NancyNeural', 'en-US-AriaNeural',
] as const;
export type GiongFp = (typeof GIONG_FP)[number];

/** Style Azure cho phép (giọng không hỗ trợ style nào thì Azure tự bỏ qua, vẫn đọc giọng thường). */
export const STYLE_FP = ['shouting', 'terrified', 'angry', 'excited', 'whispering', 'sad', 'serious', 'unfriendly', 'hopeful', 'narration-professional', 'newscast'] as const;
export type StyleFp = (typeof STYLE_FP)[number];

const TOI_DA_KY_TU = 1500;
const TRAN_KY_TU_NGAY = Number(process.env.FP_TTS_DAILY_CHARS || 20_000);
const dem = new Map<string, number>();

export function choPhep(userId: number, laAdmin: boolean): boolean {
  if (laAdmin) return true;
  const ds = (process.env.FP_TTS_USER_IDS || '151,152,153,154,155').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
  return ds.includes(userId);
}

export const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export interface YeuCauTts { text: string; voice: GiongFp; style?: StyleFp; styledegree?: number; rate?: number; pitch?: number }

/** Kiểm + chuẩn hoá đầu vào (ném 400 rõ lý do). Thuần — có test. */
export function chuanHoa(b: Record<string, unknown>): YeuCauTts {
  const text = String(b.text ?? '').trim();
  if (!text) throw new BadRequestError('Thiếu chữ để đọc');
  if (text.length > TOI_DA_KY_TU) throw new BadRequestError(`Tối đa ${TOI_DA_KY_TU} ký tự mỗi lần`);
  if (!GIONG_FP.includes(b.voice as GiongFp)) throw new BadRequestError(`Giọng không hợp lệ. Cho phép: ${GIONG_FP.join(', ')}`);
  if (b.style != null && !STYLE_FP.includes(b.style as StyleFp)) throw new BadRequestError(`Style không hợp lệ. Cho phép: ${STYLE_FP.join(', ')}`);
  const so = (v: unknown, min: number, max: number, md: number) => (v == null ? md : Math.min(max, Math.max(min, Number(v) || md)));
  return {
    text, voice: b.voice as GiongFp,
    ...(b.style ? { style: b.style as StyleFp } : {}),
    styledegree: so(b.styledegree, 0.01, 2, 1),
    rate: so(b.rate, 0.5, 1.5, 1),
    pitch: so(b.pitch, -20, 20, 0),
  };
}

/** SSML Azure (mstts:express-as khi có style). Thuần — có test. */
export function taoSsml(y: YeuCauTts): string {
  const lang = y.voice.slice(0, 5);
  const rate = `${Math.round(((y.rate ?? 1) - 1) * 100)}%`;
  const pitch = `${(y.pitch ?? 0) >= 0 ? '+' : ''}${y.pitch ?? 0}%`;
  let than = `<prosody rate="${rate}" pitch="${pitch}">${escXml(y.text)}</prosody>`;
  if (y.style) than = `<mstts:express-as style="${y.style}" styledegree="${y.styledegree ?? 1}">${than}</mstts:express-as>`;
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}">`
    + `<voice name="${y.voice}">${than}</voice></speak>`;
}

export async function docFp(userId: number, laAdmin: boolean, body: Record<string, unknown>) {
  if (!choPhep(userId, laAdmin)) throw new ForbiddenError('Chỉ tài khoản studio Flying Pencil dùng được giọng này');
  const y = chuanHoa(body);
  if (!process.env.AZURE_SPEECH_KEY) return { url: null, lyDo: 'Máy chủ chưa cấu hình AZURE_SPEECH_KEY' };
  const ssml = taoSsml(y);
  const bam = crypto.createHash('sha1').update(ssml).digest('hex');
  const key = `flying-pencil/tts/${y.voice}/${bam}.wav`;
  if (await objectExists(key)) return { url: buildPublicUrl(key), daCo: true };

  const ngay = new Date().toISOString().slice(0, 10);
  const k = `${userId}:${ngay}`;
  const daDung = dem.get(k) ?? 0;
  if (daDung + y.text.length > TRAN_KY_TU_NGAY) return { url: null, lyDo: `Hết hạn mức ${TRAN_KY_TU_NGAY} ký tự/ngày` };
  dem.set(k, daDung + y.text.length);
  if (dem.size > 2000) dem.clear();

  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
      'User-Agent': 'cuongthai-flying-pencil',
    },
    signal: AbortSignal.timeout(30_000),
    body: ssml,
  });
  if (!res.ok) return { url: null, lyDo: `Azure TTS ${res.status}: ${(await res.text().catch(() => '')).slice(0, 160)}` };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) return { url: null, lyDo: 'Azure trả về rỗng' };
  await putObject(key, buf, 'audio/wav');
  return { url: buildPublicUrl(key), daCo: false, kyTu: y.text.length };
}
