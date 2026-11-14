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
const TOI_DA_KY_TU = 200; // tiếng Nhật/Trung: 200 chữ đã là đoạn dài
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
export function giayCuaWav(buf: Buffer): number | null {
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

/**
 * Bản ĐẦY ĐỦ hơn (15/11/2026, CT Language luyện phát âm): thêm điểm NGỮ ĐIỆU (prosody — chỉ en-US, `null` nếu Azure
 * không trả), điểm từng ÂM TIẾT (`Syllables` — en-US có tên IPA; zh-CN mỗi chữ là một âm tiết) và tên âm/âm tiết GỐC
 * Azure trả (zh-CN có thể kèm số thanh "xue2" — app đọc ra thanh điệu). `chamPhatAm` cũ dùng chung lõi này rồi bỏ bớt
 * trường ⇒ đầu ra của web KHÔNG đổi.
 */
export type KetQuaPhatAmChiTiet = {
  diem: { chinhXac: number; troiChay: number; dayDu: number; tong: number; ngonDieu: number | null };
  ngheRa: string;
  tu: {
    tu: string; diem: number; loi: string;
    am: { am: string; diem: number }[];
    amTiet: { amTiet: string; diem: number }[];
  }[];
};

export type LyDoPhatAm = 'chua_co_khoa' | 'het_luot_ngay' | 'het_luot_thang' | 'khong_nghe_thay' | 'loi_may_cham';
export type NgonNguPhatAm = 'en-US' | 'en-GB' | 'ja-JP' | 'zh-CN';

/** `giong` của web/app ⇒ mã ngôn ngữ Azure. 05/10/2026: khoá JP/CH chấm tiếng Nhật / tiếng Trung (Azure PA có ja-JP, zh-CN). */
export function ngonNguPhatAm(giong?: string): NgonNguPhatAm {
  return giong === 'us' ? 'en-US' : giong === 'ja' ? 'ja-JP' : giong === 'zh' ? 'zh-CN' : 'en-GB';
}

/** Có khoá Azure Speech chưa (thiếu ⇒ mọi lượt trả `chua_co_khoa`, không gọi đi đâu). */
export const coKhoaPhatAm = () => Boolean(process.env.AZURE_SPEECH_KEY);

const so = (x?: number) => Math.round(Number(x) || 0);
type DiemPA = { AccuracyScore?: number; FluencyScore?: number; CompletenessScore?: number; PronScore?: number; ProsodyScore?: number; ErrorType?: string };
type WAzure = DiemPA & {
  Word: string; PronunciationAssessment?: DiemPA;
  Syllables?: ({ Syllable?: string; Grapheme?: string; PronunciationAssessment?: DiemPA } & DiemPA)[];
  Phonemes?: ({ Phoneme?: string; PronunciationAssessment?: DiemPA } & DiemPA)[];
};
type JAzure = {
  RecognitionStatus?: string; DisplayText?: string;
  NBest?: (DiemPA & { Display?: string; PronunciationAssessment?: DiemPA; Words?: WAzure[] })[];
};

/**
 * Đọc JSON của Azure (REST "short audio", format=detailed). REST trả điểm PHẲNG ngay trên từ/âm (`AccuracyScore`); SDK
 * và bản mới bọc trong `PronunciationAssessment` — đọc được cả hai. Không nhận ra câu nào ⇒ `null`.
 */
export function docKetQuaAzure(j: JAzure): KetQuaPhatAmChiTiet | null {
  const b = j.NBest?.[0];
  if (j.RecognitionStatus !== 'Success' || !b) return null;
  const d = (x: DiemPA & { PronunciationAssessment?: DiemPA }) => ({ ...x, ...(x.PronunciationAssessment ?? {}) });
  const bd = d(b);
  return {
    diem: {
      chinhXac: so(bd.AccuracyScore), troiChay: so(bd.FluencyScore), dayDu: so(bd.CompletenessScore), tong: so(bd.PronScore),
      ngonDieu: typeof bd.ProsodyScore === 'number' ? so(bd.ProsodyScore) : null,
    },
    ngheRa: j.DisplayText ?? b.Display ?? '',
    tu: (b.Words ?? []).map((w) => {
      const wd = d(w);
      return {
        tu: w.Word,
        diem: so(wd.AccuracyScore),
        loi: wd.ErrorType ?? 'None',
        am: (w.Phonemes ?? []).map((p) => ({ am: p.Phoneme ?? '', diem: so(d(p).AccuracyScore) })),
        amTiet: (w.Syllables ?? []).map((s) => ({ amTiet: s.Syllable ?? s.Grapheme ?? '', diem: so(d(s).AccuracyScore) })),
      };
    }),
  };
}

/**
 * Lõi chấm (không đếm lượt — người gọi tự đếm qua `demLuot`): kiểm WAV + độ dài, thiếu khoá ⇒ `chua_co_khoa`, gọi Azure,
 * đọc kết quả đầy đủ. `ngonDieu` ⇒ xin thêm điểm ngữ điệu (chỉ en-US; Azure từ chối thì gọi lại không có nó).
 */
export async function chamAzure(
  input: { audio: Buffer; cau: string; lang: NgonNguPhatAm; tuDo?: boolean; toiDaGiay?: number; ngonDieu?: boolean; toiDaKyTu?: number },
  demLuot?: () => boolean,
): Promise<{ ketQua: KetQuaPhatAmChiTiet | null; lyDo?: LyDoPhatAm }> {
  const cau = String(input.cau ?? '').trim();
  const tranKyTu = input.toiDaKyTu ?? TOI_DA_KY_TU;
  if (!cau && !input.tuDo) throw new BadRequestError('Thiếu câu mẫu');
  if (cau.length > (input.tuDo ? 2000 : tranKyTu)) throw new BadRequestError(`Câu mẫu tối đa ${tranKyTu} ký tự`);
  const giay = giayCuaWav(input.audio);
  if (giay == null) throw new BadRequestError('Âm thanh phải là WAV PCM');
  const tran = Math.min(59, Math.max(1, input.toiDaGiay ?? TOI_DA_GIAY));
  if (giay > tran) throw new BadRequestError(`Bản ghi tối đa ${tran} giây`);
  if (giay < 0.3) return { ketQua: null, lyDo: 'khong_nghe_thay' };

  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION || 'eastasia';
  if (!key) return { ketQua: null, lyDo: 'chua_co_khoa' };
  if (demLuot && !demLuot()) return { ketQua: null, lyDo: 'het_luot_ngay' };

  const lang = input.lang;
  const goi = (referenceText: string, ngonDieu: boolean) => fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${lang}&format=detailed`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
        'Pronunciation-Assessment': Buffer.from(JSON.stringify({
          ReferenceText: referenceText,
          GradingSystem: 'HundredMark',
          Granularity: 'Phoneme',
          Dimension: 'Comprehensive',
          EnableMiscue: !input.tuDo,
          ...(lang === 'en-US' ? { PhonemeAlphabet: 'IPA' } : {}),
          ...(ngonDieu ? { EnableProsodyAssessment: true } : {}),
        })).toString('base64'),
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(30_000),
      body: new Uint8Array(input.audio),
    },
  );
  const ngonDieu = Boolean(input.ngonDieu) && lang === 'en-US';
  let res = await goi(input.tuDo ? '' : cau, ngonDieu);
  // Xin ngữ điệu mà Azure từ chối (vùng/gói chưa hỗ trợ) ⇒ chấm lại không có nó, đừng mất cả lượt.
  if (ngonDieu && res.status === 400) res = await goi(input.tuDo ? '' : cau, false);
  // Nói tự do: thử unscripted (ReferenceText rỗng) trước; Azure từ chối (4xx) thì lùi về chấm theo bản phiên âm.
  if (input.tuDo && cau && res.status >= 400 && res.status !== 429 && res.status !== 403) {
    console.warn('[ielts/phat-am] Azure unscripted', res.status, '— lùi về chấm theo bản phiên âm');
    res = await goi(cau, false);
  }
  // F0 hết 5 giờ của tháng → 429 (hoặc 403 quota). Không phải lỗi của người học.
  if (res.status === 429 || res.status === 403) return { ketQua: null, lyDo: 'het_luot_thang' };
  if (!res.ok) {
    console.warn('[ielts/phat-am] Azure', res.status, (await res.text().catch(() => '')).slice(0, 200));
    return { ketQua: null, lyDo: 'loi_may_cham' };
  }
  const kq = docKetQuaAzure((await res.json()) as JAzure);
  return kq ? { ketQua: kq } : { ketQua: null, lyDo: 'khong_nghe_thay' };
}

export async function chamPhatAm(
  userId: number,
  input: {
    audio: Buffer; cau: string; giong?: string;
    /**
     * 12/11/2026 — phòng thi Speaking: nói TỰ DO, không có câu mẫu. `tuDo` ⇒ chấm "unscripted" (ReferenceText
     * rỗng, Azure chấm trên chính câu nó nghe ra); `cau` khi đó là bản phiên âm Whisper để lùi về chấm có mẫu
     * nếu Azure từ chối unscripted. `toiDaGiay` nới trần 20 s (REST short-audio nhận tới 60 s).
     */
    tuDo?: boolean; toiDaGiay?: number;
  },
): Promise<{ ketQua: KetQuaPhatAm | null; lyDo?: LyDoPhatAm }> {
  const r = await chamAzure(
    { audio: input.audio, cau: input.cau, lang: ngonNguPhatAm(input.giong), tuDo: input.tuDo, toiDaGiay: input.toiDaGiay },
    () => demLuot(userId),
  );
  if (!r.ketQua) return { ketQua: null, lyDo: r.lyDo };
  const { chinhXac, troiChay, dayDu, tong } = r.ketQua.diem;
  return {
    ketQua: {
      diem: { chinhXac, troiChay, dayDu, tong },
      ngheRa: r.ketQua.ngheRa,
      tu: r.ketQua.tu.map(({ tu, diem, loi, am }) => ({ tu, diem, loi, am })),
    },
  };
}
