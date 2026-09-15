/**
 * ============================================================
 * HỎI AI ĐANG CHẠY TRÊN MÁY — và dùng nó làm LƯỚI ĐỠ
 * ============================================================
 *
 * ⚠️ AI trên máy KHÔNG thay thế bản trên mạng, và không được phép giả vờ là
 * nó. Đo thật 15/09/2026: model 4B trả lời đúng khái niệm và giải đúng toán,
 * nhưng đọc sai một dấu tiếng Việt ("biên" thành "biến") — đúng loại sai làm
 * hỏng cả bài toán mà người học không nhận ra.
 *
 * Nên quy tắc là: **có mạng thì luôn đi máy chủ**. Chỉ khi máy chủ không với
 * tới được mới rơi xuống đây, và câu trả lời phải được GẮN NHÃN để người dùng
 * biết mình đang đọc cái gì.
 */
import { trangThai } from './chay';

export interface LuotNoi {
  vaiTro: 'nguoi' | 'may';
  chu: string;
}

/**
 * Trần số ảnh mỗi lượt.
 *
 * 3 — khớp với trần của máy chủ (`docAnhDan` trong `course.routes.ts`), để
 * người dùng không gặp hai luật khác nhau tuỳ lúc có mạng hay không. Mỗi ảnh
 * ăn hàng trăm token thị giác, và trên máy chỉ có CPU thì mỗi token là thời
 * gian chờ thật.
 */
const TRAN_SO_ANH = 3;

/**
 * Lời dặn cho model cục bộ.
 *
 * Ngắn có chủ đích. Mỗi chữ trong lời dặn là chữ phải nạp lại mỗi lượt, mà
 * trên máy chỉ có CPU thì nạp đề chạy 33,8 chữ/giây — một lời dặn 300 chữ là
 * 9 giây cộng vào MỌI câu hỏi.
 *
 * Câu "nói thẳng khi không biết" là câu quan trọng nhất: model nhỏ bịa trôi
 * chảy hơn là nó nhận dốt, và ở đây không có máy chủ nào đỡ phía sau.
 */
const LOI_DAN = 'Bạn là trợ lý học tập chạy ngay trên máy của người dùng, không có mạng. '
  + 'Trả lời bằng tiếng Việt, ngắn gọn, đi thẳng vào việc. '
  + 'Không biết thì nói thẳng là không biết — đừng đoán.';

export interface YeuCauHoi {
  chu: string;
  lichSu?: LuotNoi[] | undefined;
  /** Một hai câu bối cảnh (tên bài đang học chẳng hạn). Để rỗng nếu không có. */
  boiCanh?: string | undefined;
  /** Ảnh dạng data URL (`data:image/png;base64,…`). Chỉ bản xem ảnh dùng được. */
  anh?: string[] | undefined;
  signal?: AbortSignal | undefined;
}

/**
 * Kết quả hỏi.
 *
 * Tách `chu` và `loi` thay vì trả `string | null` vì có một trạng thái thứ ba
 * quan trọng: **hỏi được nhưng yêu cầu không hợp lệ** (gửi ảnh cho bản không
 * nhìn được). Gộp nó vào `null` thì chỗ gọi chỉ biết "không trả lời được" và
 * người dùng nhận một câu chung chung, trong khi thứ họ cần nghe là "bản đang
 * chạy không xem được ảnh, tải Bản xem ảnh đi".
 */
export type KetQuaHoi = { chu: string; loi?: undefined } | { chu?: undefined; loi: string };

/** AI trên máy có đang bật không. */
export function dangSan(): boolean {
  return trangThai() !== null;
}

/**
 * Bản đang chạy có nhìn được ảnh không.
 *
 * Chỉ `anh` có mmproj — xem `kho.ts`. Hỏi ở đây thay vì để `llama-server` trả
 * lỗi, không phải vì nó im lặng (đo thật 16/09/2026: nó trả HTTP 500 kèm
 * "image input is not supported"), mà vì câu đó là tiếng Anh dành cho lập
 * trình viên, không phải cho người đang học bài.
 */
export function nhinDuocAnh(): boolean {
  return trangThai()?.maModel === 'anh';
}

/**
 * Hỏi AI trên máy.
 *
 * Ba kết quả, và chỗ gọi phải phân biệt cả ba:
 *   • `{ chu }` — trả lời được.
 *   • `{ loi }` — hỏi được nhưng yêu cầu sai (gửi ảnh cho bản không nhìn được),
 *     hoặc máy chủ nói rõ vì sao nó từ chối. Câu này ĐƯA THẲNG cho người dùng.
 *   • `null`    — chưa bật, hoặc hỏng theo kiểu không nói được gì.
 *
 * Không bao giờ ném: chỗ gọi là đường LÙI, và một đường lùi mà ném ra lỗi thì
 * nó biến sự cố mạng thành sự cố app.
 */
export async function hoiMay(yc: YeuCauHoi): Promise<KetQuaHoi | null> {
  const dang = trangThai();
  if (!dang) return null;

  const anh = (yc.anh ?? []).filter((a) => typeof a === 'string' && a.startsWith('data:image/'));
  if (anh.length && !nhinDuocAnh()) {
    return {
      loi: 'Bản AI đang chạy trên máy không xem được ảnh. '
        + 'Vào Cài đặt → AI ngoại tuyến và tải "Bản xem ảnh" nếu bạn muốn hỏi bằng ảnh.',
    };
  }
  if (anh.length > TRAN_SO_ANH) {
    return { loi: `Mỗi lần hỏi gửi tối đa ${TRAN_SO_ANH} ảnh.` };
  }

  /*
   * Hình dạng `image_url` — ĐO THẬT 16/09/2026 trên `llama-server` b10964 với
   * Qwen3-VL-4B: gửi `{type:'image_url', image_url:{url:'data:image/png;base64,…'}}`
   * thì nó đọc đúng con số ngẫu nhiên vẽ trong ảnh. Đây là tuyến OpenAI, cùng
   * hình dạng app đã dùng với cổng, nên không cần lớp chuyển đổi nào.
   */
  const noiDungHoi: unknown = anh.length
    ? [
      { type: 'text', text: yc.chu },
      ...anh.map((url) => ({ type: 'image_url', image_url: { url } })),
    ]
    : yc.chu;

  const tin: Array<{ role: string; content: unknown }> = [
    { role: 'system', content: yc.boiCanh ? `${LOI_DAN}\n\n${yc.boiCanh}` : LOI_DAN },
    ...(yc.lichSu ?? []).map((t) => ({
      role: t.vaiTro === 'nguoi' ? 'user' : 'assistant',
      content: t.chu,
    })),
    { role: 'user', content: noiDungHoi },
  ];

  try {
    const r = await fetch(`${dang.goc}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: tin, max_tokens: 900, temperature: 0.7 }),
      /* 3 phút. Máy chỉ có CPU gõ 8 chữ/giây, nên một câu trả lời dài thật sự
         mất hơn một phút — trần ngắn hơn sẽ cắt ngang đúng những máy yếu mà
         tính năng này sinh ra để phục vụ. */
      signal: yc.signal ?? AbortSignal.timeout(180_000),
    });
    if (!r.ok) {
      /* Nói lại lý do THẬT của máy chủ khi nó có nói. Nuốt thành `null` thì
         "thiếu mmproj" và "hết bộ nhớ" trông giống hệt nhau. */
      const j = await r.json().catch(() => null) as { error?: { message?: string } } | null;
      const vi = j?.error?.message;
      return vi ? { loi: `AI trên máy: ${vi}` } : null;
    }
    const j = await r.json() as { choices?: { message?: { content?: string } }[] };
    const chu = j?.choices?.[0]?.message?.content?.trim();
    return chu ? { chu } : null;
  } catch {
    return null;
  }
}

/**
 * Câu mở đầu gắn vào mọi trả lời của AI trên máy.
 *
 * ⚠️ Dòng này KHÔNG phải trang trí. Không có nó, một câu trả lời yếu hơn hẳn
 * sẽ trông y như câu của bản trên mạng, và người học mang nó đi thi. Nói rõ
 * nguồn là điều kiện để tính năng này được phép tồn tại.
 */
export const NHAN_MAY = '_Trả lời bởi AI trên máy bạn (không có mạng) — '
  + 'ngắn và có thể sót. Có mạng lại thì hỏi lại để có câu đầy đủ hơn._';

/** Gắn nhãn vào một câu trả lời của AI trên máy. */
export function ganNhan(chu: string): string {
  return `${NHAN_MAY}\n\n${chu}`;
}
