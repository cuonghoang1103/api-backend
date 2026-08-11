/**
 * Voice CuongMini — gọi máy đọc chạy trên VPS.
 *
 * Máy đọc chạy ở RTF ~0,97 (đo thật trên chính VPS), nghĩa là sinh một
 * phút tiếng mất khoảng một phút. Nên đây là mô hình ĐẶT VIỆC rồi hỏi
 * lại, không phải một request chờ tới cùng: 5.000 ký tự là hơn năm phút,
 * mà nginx cắt kết nối trước khi tới đó.
 */
import { api } from './api';

const BASE = '/voice-mini';

export interface MiniVoice {
  id: string;
  label: string;
}

export async function listVoices(): Promise<MiniVoice[]> {
  const res = await api.get(`${BASE}/voices`);
  return res.data?.data?.voices ?? [];
}

export async function startTts(text: string, voice?: string): Promise<{ jobId: string; uocTinhGiay: number }> {
  const res = await api.post(`${BASE}/tts`, { text, voice });
  return res.data?.data;
}

export interface TtsDone {
  blob: Blob;
  audioSeconds: number | null;
  genMs: number | null;
}

/**
 * Hỏi lại tới khi có tiếng.
 *
 * 202 = đang chạy (xem ghi chú trong services/tts/app.py — dùng 202
 * chứ không phải 200 chính vì chỗ này: lúc xong thân trả về là WAV nhị
 * phân, cùng mã 200 thì không phân biệt được).
 */
export async function waitForTts(
  jobId: string,
  onTick?: (giay: number) => void,
  signal?: AbortSignal,
): Promise<TtsDone> {
  const bat_dau = Date.now();
  for (;;) {
    if (signal?.aborted) throw new Error('Đã huỷ');
    const res = await api.get(`${BASE}/tts/${jobId}`, {
      responseType: 'blob',
      // Đừng để axios ném lỗi ở 202 — đó là trạng thái bình thường.
      validateStatus: (s) => s === 200 || s === 202,
    });

    if (res.status === 202) {
      onTick?.((Date.now() - bat_dau) / 1000);
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }

    const num = (h: string) => {
      const v = res.headers?.[h];
      return v == null ? null : Number(v);
    };
    return {
      blob: res.data as Blob,
      audioSeconds: num('x-audio-seconds'),
      genMs: num('x-gen-ms'),
    };
  }
}
