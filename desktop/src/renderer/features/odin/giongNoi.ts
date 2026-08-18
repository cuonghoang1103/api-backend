/**
 * Tổng hợp giọng nói — dùng chung cho robot Odin và cuộc gọi thoại ở /chat.
 *
 * ─── Máy đọc làm việc theo KIỂU ĐẶT VIỆC, không trả tiếng ngay ───
 *   POST /api/v1/voice-mini/tts        { text, voice }  → { jobId }
 *   GET  /api/v1/voice-mini/tts/:jobId → 202 (đang làm) | 200 + audio/wav
 * Nên phải hỏi lại nhiều lần. Ai viết như thể nó trả tiếng ngay ở lời gọi đầu
 * sẽ nhận về JSON `{jobId}` rồi đưa thẳng cho thẻ <audio> — và không bao giờ
 * nghe thấy gì, cũng không có lỗi nào.
 *
 * ─── Vì sao KHÔNG dùng `api.request` ───
 * `request()` đọc trọn thân rồi `JSON.parse`. Kết quả cuối là **audio/wav**,
 * `JSON.parse` trên chuỗi byte đó sẽ ném. Phải `fetch` thẳng rồi lấy blob.
 */

export interface Giong {
  id: string;
  label: string;
  lang: string;
  custom?: boolean;
}

import { chuChoMayDoc } from './loiNoi';

interface Api {
  baseUrlForForms(): string;
  authHeaders(): Record<string, string>;
}

/** Trần thời gian chờ máy đọc. Câu của trợ lý ngắn, quá ngần này là có sự cố. */
const TRAN_MS = 45_000;
/**
 * Nhịp hỏi máy đọc — TĂNG DẦN, không cố định.
 *
 * ⚠️ 700ms CỐ ĐỊNH LÀ ~400ms CHỜ SUÔNG MỖI CÂU. Một câu nói ngắn xong trong
 * khoảng 300ms, nhưng lần hỏi đầu (ngay lập tức) gần như luôn nhận 202 — nên
 * vòng lặp ngủ trọn 700ms rồi mới lấy được tiếng. Đó chính là quãng người dùng
 * mô tả là "chữ ra rồi mà giọng chưa ra".
 *
 * 120ms rồi nhân 1,5: câu ngắn lấy được gần như ngay, câu dài vẫn không đấm
 * máy chủ liên tục.
 */
const NHIP_DAU_MS = 120;
const NHIP_TOI_DA_MS = 600;

export async function layDanhSachGiong(api: Api): Promise<Giong[]> {
  const res = await fetch(`${api.baseUrlForForms()}/api/v1/voice-mini/voices`, {
    headers: api.authHeaders(), credentials: 'omit',
  });
  if (!res.ok) throw new Error(`Không lấy được danh sách giọng (${res.status})`);
  const than = await res.json() as { data?: { voices?: Giong[] } | Giong[]; voices?: Giong[] };
  // Máy chủ có lúc bọc trong `data`, có lúc trả thẳng — nhận cả hai.
  const o = (than.data ?? than) as { voices?: Giong[] } | Giong[];
  const ds = Array.isArray(o) ? o : (o.voices ?? []);
  return ds.filter((g) => g && typeof g.id === 'string');
}

/**
 * Đọc một câu, trả về Blob WAV. KHÔNG tự phát — người gọi quyết định phát lúc
 * nào, vì phát ngay giữa lúc người dùng đang nghe câu trước là chồng tiếng.
 */
export async function docThanhTieng(api: Api, text: string, voice?: string): Promise<Blob> {
  // Bóc markdown ở ĐÂY, không ở từng nơi gọi. Đây là cửa duy nhất mọi câu nói
  // đi qua, nên đặt ở đây thì không có đường nào lọt — thêm một nơi gọi mới
  // sau này cũng tự được lọc mà người viết không phải nhớ.
  const doc = chuChoMayDoc(text);
  const dat = await fetch(`${api.baseUrlForForms()}/api/v1/voice-mini/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
    credentials: 'omit',
    body: JSON.stringify({ text: doc, ...(voice ? { voice } : {}) }),
  });
  if (!dat.ok) {
    const than = await dat.json().catch(() => null) as { message?: string } | null;
    throw new Error(than?.message ?? `Máy đọc từ chối (${dat.status})`);
  }
  const { data } = await dat.json() as { data?: { jobId?: string } };
  const jobId = data?.jobId;
  if (!jobId) throw new Error('Máy đọc không trả mã việc.');

  const hetHan = Date.now() + TRAN_MS;
  let nhip = NHIP_DAU_MS;
  for (;;) {
    if (Date.now() > hetHan) throw new Error('Máy đọc không trả kết quả kịp.');
    const lay = await fetch(`${api.baseUrlForForms()}/api/v1/voice-mini/tts/${encodeURIComponent(jobId)}`, {
      headers: api.authHeaders(), credentials: 'omit',
    });
    // 202 = đang làm. Đây là nhánh BÌNH THƯỜNG, không phải lỗi.
    if (lay.status === 202) {
      await new Promise((x) => setTimeout(x, nhip));
      nhip = Math.min(Math.round(nhip * 1.5), NHIP_TOI_DA_MS);
      continue;
    }
    if (!lay.ok) {
      const than = await lay.json().catch(() => null) as { message?: string } | null;
      throw new Error(than?.message ?? `Lấy tiếng hỏng (${lay.status})`);
    }
    return await lay.blob();
  }
}

/**
 * Bộ phát dùng chung — MỘT thẻ audio cho mọi câu nói của trợ lý.
 *
 * Mỗi câu một thẻ mới thì hai câu liền nhau sẽ chồng tiếng lên nhau, và không
 * có cách nào tắt câu đang đọc dở khi người dùng hỏi câu tiếp theo.
 */
let theAudio: HTMLAudioElement | null = null;
let urlDangPhat: string | null = null;

export function ngungNoi(): void {
  theAudio?.pause();
  if (urlDangPhat) { URL.revokeObjectURL(urlDangPhat); urlDangPhat = null; }
}

/**
 * ============================================================
 * TỐC ĐỘ ĐỌC
 * ============================================================
 *
 * Chỉnh ở MÁY PHÁT, không phải ở máy đọc — và đó là lựa chọn tốt hơn chứ
 * không phải đường vòng:
 *
 *  • Máy đọc của web KHÔNG nhận tham số tốc độ (đã kiểm `/tts` và
 *    `/tts-stream`, cả hai không có trường nào).
 *  • Chỉnh ở đây áp cho MỌI giọng như nhau — 18 giọng Việt, 8 giọng F5 tự
 *    train, 4 giọng Anh. Chỉnh ở máy đọc thì mỗi bên một kiểu.
 *  • Không phải sinh lại tiếng: đổi tốc độ là đổi ngay, kể cả với câu đã
 *    tải về rồi.
 *
 * `preservesPitch` giữ nguyên cao độ khi kéo giãn thời gian — thiếu nó thì
 * chậm lại thành giọng trầm đục và nhanh lên thành giọng chuột.
 */
let tocDoDoc = 1;

/** Đặt tốc độ đọc. Kẹp trong khoảng nghe được — ngoài khoảng đó là không hiểu nổi. */
export function datTocDoDoc(v: number): void {
  tocDoDoc = Math.min(2, Math.max(0.5, Number.isFinite(v) ? v : 1));
  if (theAudio) {
    theAudio.playbackRate = tocDoDoc;
    theAudio.preservesPitch = true;
  }
}

export function layTocDoDoc(): number {
  return tocDoDoc;
}

function apTocDo(a: HTMLAudioElement): void {
  a.playbackRate = tocDoDoc;
  // Tên có tiền tố ở một số bản WebKit cũ — gán cả hai cho chắc.
  a.preservesPitch = true;
  (a as unknown as { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
}

export function phatTieng(blob: Blob): Promise<void> {
  ngungNoi();
  if (!theAudio) theAudio = new Audio();
  const url = URL.createObjectURL(blob);
  urlDangPhat = url;
  theAudio.src = url;
  apTocDo(theAudio);
  return new Promise((xong) => {
    const donDep = () => {
      // Thu hồi URL sau khi phát xong: mỗi câu là một Blob trong bộ nhớ, không
      // thu hồi thì nói cả buổi là giữ lại toàn bộ số tiếng đã đọc.
      if (urlDangPhat === url) { URL.revokeObjectURL(url); urlDangPhat = null; }
      xong();
    };
    theAudio!.onended = donDep;
    theAudio!.onerror = donDep;
    void theAudio!.play().catch(donDep);
  });
}
