/**
 * ============================================================
 * TÌM WEB — qua SearXNG tự dựng
 * ============================================================
 *
 * ─── VÌ SAO TỰ DỰNG, KHÔNG MUA API ───
 * Khảo sát 18/08/2026: Brave đã BỎ gói miễn phí từ 02/2026 (khách mới chỉ
 * còn $5 tín dụng/tháng), Google Custom Search ĐÓNG CỬA với khách mới và
 * ngừng hẳn 01/01/2027. Đường "dùng gói miễn phí của hãng" gần như khép
 * lại trong năm nay.
 *
 * SearXNG là máy tìm kiếm tổng hợp mã nguồn mở, gom kết quả từ hơn 70
 * nguồn, có sẵn API JSON, không khoá và không tính lượt. Nó chạy trên
 * chính VPS này (~200MB RAM), nghe ở cổng cầu docker nên Internet KHÔNG
 * chạm tới được — đo thật: gọi từ ngoài trả `000`.
 *
 * Cái giá không phải tiền mà là công vận hành: nó đi hỏi hộ các máy tìm
 * kiếm lớn, nên thỉnh thoảng bị chặn theo IP và phải chỉnh danh sách
 * nguồn. Vì thế MỌI hàm ở đây phải chịu được việc nó im lặng hoặc trả rác
 * — tìm kiếm hỏng thì câu trả lời vẫn phải ra, chỉ là không có nguồn.
 */
import { logger } from '../../utils/logger.js';

/** Địa chỉ SearXNG. Cổng cầu docker — cùng lối như máy đọc ở máy nhà. */
const GOC = (process.env.SEARXNG_URL || 'http://172.18.0.1:8888').replace(/\/+$/, '');

/**
 * Trần thời gian. Ngắn có chủ ý: người dùng đang chờ câu trả lời, và một
 * lượt tìm kiếm chậm 20 giây thì thà không tìm còn hơn.
 */
const TRAN_MS = Number(process.env.SEARXNG_TIMEOUT_MS) || 8000;

export interface KetQuaTim {
  tieuDe: string;
  url: string;
  tomTat: string;
  /** Tên miền, để hiện thẻ nguồn gọn: `luatvietnam.vn`. */
  mien: string;
  /** Máy tìm kiếm nào trả về — hữu ích khi soi chất lượng nguồn. */
  nguon: string;
}

export function timWebBat(): boolean {
  return String(process.env.SEARXNG_ENABLED ?? 'true').toLowerCase() !== 'false';
}

function mienCua(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Tìm web. KHÔNG BAO GIỜ ném lỗi — trả mảng rỗng khi hỏng.
 *
 * Đây là lựa chọn có chủ ý: tìm kiếm là thứ LÀM GIÀU câu trả lời, không
 * phải thứ câu trả lời phụ thuộc vào. Để nó ném lên thì một lần SearXNG
 * nghẽn là cả AI chat chết theo, đổi một tính năng phụ lấy tính năng chính.
 */
export async function timWeb(cauHoi: string, soKetQua = 6): Promise<KetQuaTim[]> {
  const q = cauHoi.trim();
  if (!q || !timWebBat()) return [];

  const dia = `${GOC}/search?q=${encodeURIComponent(q)}&format=json&language=vi&safesearch=0`;
  try {
    const res = await fetch(dia, { signal: AbortSignal.timeout(TRAN_MS) });
    if (!res.ok) {
      logger.warn('[tim-web] SearXNG trả lỗi', { status: res.status });
      return [];
    }
    const j = (await res.json()) as { results?: Array<Record<string, unknown>> };
    const tho = Array.isArray(j.results) ? j.results : [];

    const daThay = new Set<string>();
    const ra: KetQuaTim[] = [];
    for (const r of tho) {
      const url = typeof r.url === 'string' ? r.url : '';
      const tieuDe = typeof r.title === 'string' ? r.title.trim() : '';
      if (!url || !tieuDe) continue;
      // Bỏ trùng theo URL: SearXNG gom từ nhiều máy tìm kiếm nên cùng một
      // trang thường về nhiều lần, và ba thẻ nguồn giống hệt nhau trông như
      // lỗi chứ không như đầy đủ.
      if (daThay.has(url)) continue;
      daThay.add(url);
      ra.push({
        tieuDe: tieuDe.slice(0, 200),
        url,
        tomTat: (typeof r.content === 'string' ? r.content : '').trim().slice(0, 500),
        mien: mienCua(url),
        nguon: typeof r.engine === 'string' ? r.engine : '',
      });
      if (ra.length >= soKetQua) break;
    }
    return ra;
  } catch (e) {
    logger.warn('[tim-web] không gọi được SearXNG', { error: (e as Error).message });
    return [];
  }
}

/**
 * Gói kết quả thành đoạn chữ cho model đọc.
 *
 * ⚠️ ĐÁNH SỐ [1] [2] và DẶN model trích theo số. Không đánh số thì model
 * viết "theo một trang web" — người đọc không kiểm được, và thẻ nguồn ở
 * dưới cũng không nối được với câu nào.
 */
export function goiChoModel(ket: KetQuaTim[]): string {
  if (!ket.length) return '';
  const dong = ket.map((k, i) => `[${i + 1}] ${k.tieuDe} — ${k.mien}\n${k.tomTat}`);
  return (
    '## Kết quả tìm web (mới lấy về, dùng để trả lời):\n'
    + `${dong.join('\n\n')}\n\n`
    + 'Dùng những kết quả trên khi chúng liên quan, và ghi số nguồn dạng [1], [2] '
    + 'ngay sau câu dùng nó. Kết quả nào không liên quan thì BỎ QUA, đừng cố nhét vào. '
    + 'Nếu không có kết quả nào trả lời được câu hỏi, hãy nói thẳng là chưa tìm thấy.\n'
  );
}
