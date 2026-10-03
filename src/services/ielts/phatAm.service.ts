/**
 * CHẤM PHÁT ÂM TỪNG ÂM — Azure Speech Pronunciation Assessment (03/10/2026).
 * ─────────────────────────────────────────────────────────────────────────
 * Người học đọc một từ/câu CHO SẴN; Azure so với câu mẫu và trả điểm cho
 * từng từ và TỪNG ÂM (âm vị). Khác `chamNoi.service.ts` (Whisper + AI chấm
 * NỘI DUNG câu trả lời Speaking): ở đây chấm CÁCH PHÁT ÂM, không chấm ý.
 *
 * Đo thật với khoá F0 vùng eastasia (03/10):
 *   - en-US + PhonemeAlphabet IPA → mỗi âm có tên IPA ("oʊ", "m") và điểm.
 *   - en-GB → có điểm từng âm nhưng tên âm RỖNG (cả khi xin IPA). Khoá học dạy
 *     giọng Anh, nên mặc định vẫn chấm en-GB; web tự gắn tên âm từ phiên âm
 *     IPA của bài khi SỐ ÂM KHỚP (xem Blocks2 PhatAm), không khớp thì để trống.
 *
 * Âm thanh: Azure REST "short audio" nhận WAV PCM 16 kHz mono — trình duyệt
 * ghi webm/mp4 nên web tự đổi sang WAV trước khi gửi. Tối đa 60 giây; ở đây
 * chặn 20 giây vì bài chỉ là từ/câu ngắn, và mỗi giây đều trừ vào 5 giờ
 * miễn phí của gói F0 mỗi tháng.
 *
 * ⚠️ AUDIO KHÔNG ĐƯỢC LƯU: đi thẳng từ RAM sang Azure rồi bị bỏ.
 */
import { BadRequestError } from '../../middleware/errorHandler.js';

const TOI_DA_GIAY = 20;
const TOI_DA_KY_TU = 200;
/** Trần lượt chấm mỗi người mỗi ngày — 5 giờ/tháng chia cho vài người học. */
const TRAN_NGAY = 150;
const daCham = new Map<string, number>();

function demLuot(userId: number): boolean {
  const k = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const n = (daCham.get(k) ?? 0) + 1;
  if (n > TRAN_NGAY) return false;
  daCham.set(k, n);
  if (daCham.size > 5000) daCham.clear();
  return true;
}

/** Độ dài (giây) của WAV PCM — đọc từ header, không tin lời trình duyệt. */
function giayCuaWav(buf: Buffer): number | null {
  if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return null;
  const byteRate = buf.readUInt32LE(28);
  return byteRate > 0 ? (buf.length - 44) / byteRate : null;
}

export type KetQuaPhatAm = {
  diem: { chinhXac: number; troiChay: number; dayDu: number; tong: number };
  /** Azure nghe ra câu gì — để người học thấy máy hiểu mình nói gì. */
  ngheRa: string;
  tu: { tu: string; diem: number; loi: 'None' | 'Mispronunciation' | 'Omission' | 'Insertion' | string; am: { am: string; diem: number }[] }[];
};

export async function chamPhatAm(
  userId: number,
  input: { audio: Buffer; cau: string; giong?: string },
): Promise<{ ketQua: KetQuaPhatAm | null; lyDo?: 'chua_co_khoa' | 'het_luot_ngay' | 'het_luot_thang' | 'khong_nghe_thay' | 'loi_may_cham' }> {
  const cau = String(input.cau ?? '').trim();
  if (!cau) throw new BadRequestError('Thiếu câu mẫu');
  if (cau.length > TOI_DA_KY_TU) throw new BadRequestError(`Câu mẫu tối đa ${TOI_DA_KY_TU} ký tự`);
  const giay = giayCuaWav(input.audio);
  if (giay == null) throw new BadRequestError('Âm thanh phải là WAV PCM');
  if (giay > TOI_DA_GIAY) throw new BadRequestError(`Bản ghi tối đa ${TOI_DA_GIAY} giây`);
  if (giay < 0.3) return { ketQua: null, lyDo: 'khong_nghe_thay' };

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return { ketQua: null, lyDo: 'chua_co_khoa' };
  if (!demLuot(userId)) return { ketQua: null, lyDo: 'het_luot_ngay' };

  const lang = input.giong === 'us' ? 'en-US' : 'en-GB';
  const cauHinh = {
    ReferenceText: cau,
    GradingSystem: 'HundredMark',
    Granularity: 'Phoneme',
    Dimension: 'Comprehensive',
    EnableMiscue: true,
    ...(lang === 'en-US' ? { PhonemeAlphabet: 'IPA' } : {}),
  };
  const res = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${lang}&format=detailed`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Pronunciation-Assessment': Buffer.from(JSON.stringify(cauHinh)).toString('base64'),
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(30_000),
      body: new Uint8Array(input.audio),
    },
  );
  // F0 hết 5 giờ của tháng → 429 (hoặc 403 quota). Không phải lỗi của người học.
  if (res.status === 429 || res.status === 403) return { ketQua: null, lyDo: 'het_luot_thang' };
  if (!res.ok) {
    console.warn('[ielts/phat-am] Azure', res.status, (await res.text().catch(() => '')).slice(0, 200));
    return { ketQua: null, lyDo: 'loi_may_cham' };
  }
  type W = { Word: string; AccuracyScore?: number; ErrorType?: string; Phonemes?: { Phoneme?: string; AccuracyScore?: number }[] };
  const j = (await res.json()) as {
    RecognitionStatus?: string; DisplayText?: string;
    NBest?: { AccuracyScore?: number; FluencyScore?: number; CompletenessScore?: number; PronScore?: number; Display?: string; Words?: W[] }[];
  };
  const b = j.NBest?.[0];
  if (j.RecognitionStatus !== 'Success' || !b) return { ketQua: null, lyDo: 'khong_nghe_thay' };
  const r = (x?: number) => Math.round(Number(x) || 0);
  return {
    ketQua: {
      diem: { chinhXac: r(b.AccuracyScore), troiChay: r(b.FluencyScore), dayDu: r(b.CompletenessScore), tong: r(b.PronScore) },
      ngheRa: j.DisplayText ?? b.Display ?? '',
      tu: (b.Words ?? []).map((w) => ({
        tu: w.Word,
        diem: r(w.AccuracyScore),
        loi: w.ErrorType ?? 'None',
        am: (w.Phonemes ?? []).map((p) => ({ am: p.Phoneme ?? '', diem: r(p.AccuracyScore) })),
      })),
    },
  };
}
