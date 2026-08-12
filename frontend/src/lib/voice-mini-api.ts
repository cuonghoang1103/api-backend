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
  /**
   * Giọng do người dùng nhân bản (xoá được) hay giọng gốc của VieNeu
   * (không xoá được).
   *
   * Máy chủ cũ chưa gửi trường này nên nó có thể thiếu — khi thiếu thì
   * coi như KHÔNG xoá được. Mặc định phải nghiêng về phía an toàn: đoán
   * sai kiểu "khoá nhầm giọng của mình" chỉ làm bực; đoán sai kiểu "mở
   * nút xoá cho giọng gốc" là mất giọng và phải cài lại mô hình.
   */
  custom?: boolean;
}

export async function listVoices(): Promise<MiniVoice[]> {
  const res = await api.get(`${BASE}/voices`);
  return res.data?.data?.voices ?? [];
}

/**
 * Nhân bản một giọng từ đoạn mẫu.
 *
 * Chậm hơn hẳn một lượt đọc: máy phải khử nhiễu, cắt gọn rồi rút đặc
 * trưng người nói. Đặt timeout 3 phút ở đây cho khớp với phía server —
 * để mặc định của axios (không có) thì trình duyệt tự bỏ cuộc lúc nào
 * không ai đoán được.
 */
export async function cloneVoice(name: string, file: File, description = ''): Promise<string> {
  const form = new FormData();
  form.append('name', name);
  form.append('description', description);
  form.append('file', file);
  // ⚠️ PHẢI ghi đè Content-Type. Thực thể axios dùng chung đặt sẵn
  // `application/json` cho mọi yêu cầu (api.ts), và gửi FormData kèm
  // header đó thì trình duyệt KHÔNG gắn boundary vào — backend nhận
  // được một thân multipart mà không biết chỗ cắt, multer trả về rỗng,
  // và người dùng thấy đúng dòng "Chưa chọn file giọng mẫu" trong khi
  // họ đã chọn file rồi.
  //
  // Mọi chỗ tải file khác trong api.ts đều ghi đè; riêng chỗ này quên.
  const res = await api.post(`${BASE}/voices`, form, {
    timeout: 180_000,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data?.data?.voice ?? name;
}

export async function deleteVoice(name: string): Promise<void> {
  await api.delete(`${BASE}/voices/${encodeURIComponent(name)}`);
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
