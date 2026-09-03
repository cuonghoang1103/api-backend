/**
 * ============================================================
 * TÌM WEB — `tim_web`
 * ============================================================
 *
 * Agent ĐỌC được một địa chỉ (`doc_web`) nhưng trước bản này KHÔNG TÌM được
 * một địa chỉ. Hỏi "thư viện X bản mới nhất là gì" là bó tay, vì nó không có
 * đường nào để biết ngoài những gì đã học lúc huấn luyện.
 *
 * ─── ⚠️ VÌ SAO CHẠY Ở MÁY CHỦ, KHÔNG Ở APP ───
 * `ring: 'server'`. Khoá dịch vụ tìm kiếm ở lại máy chủ và KHÔNG BAO GIỜ đi
 * xuống máy người dùng. App desktop tải về được, `.asar` mở bằng một lệnh —
 * nhét khoá vào đó là cho không. Đây đúng lý do `doc_web` cũng là tool máy chủ.
 *
 * ─── ⚠️ KHÔNG CÓ KHOÁ THÌ NÓI THẲNG, KHÔNG ĐI ĐƯỜNG VÒNG ───
 * Không cào trang kết quả của Google/Bing: vừa trái điều khoản của họ, vừa vỡ
 * âm thầm ngay lần đầu họ đổi HTML hoặc bật kiểm-người-máy — và lúc đó agent
 * sẽ báo cáo "không tìm thấy gì" thay vì "tôi bị chặn", tức là nói dối người
 * dùng. Thà trả một câu nói rõ chưa cấu hình.
 *
 * Tavily có bậc MIỄN PHÍ (1.000 lượt/tháng) và trả JSON gọn — đó là lý do nó
 * là mặc định. Thiếu khoá thì tool vẫn tồn tại và trả hướng dẫn, chứ không
 * biến mất khỏi danh sách: model biết là CÓ khả năng này nhưng đang tắt, nên
 * nó nói được với người dùng thay vì im lặng đoán bừa.
 */
import { logger } from '../../utils/logger.js';

/** Trần kết quả. Nhiều hơn 8 là nhồi ngữ cảnh mà gần như không thêm thông tin. */
const MAX_KETQUA = 8;
/** Trần chữ cho mỗi mẩu tóm tắt — cả trang thì đã có `doc_web`. */
const MAX_CHU_MOI_MUC = 600;
const HET_GIO_MS = 15_000;

export interface KetQuaTimWeb {
  content: string;
  summary: string;
}

/** Khoá của dịch vụ tìm kiếm. Đọc nhiều tên để không phải sửa mã khi đổi dịch vụ. */
function khoaTim(): string | null {
  return process.env.TAVILY_API_KEY
    ?? process.env.SEARCH_API_KEY
    ?? null;
}

/** Tool có dùng được không — dùng cho cả thông điệp lẫn phép kiểm. */
export function timWebSanSang(): boolean {
  return khoaTim() !== null;
}

const CHUA_CAU_HINH =
  'LỖI: tính năng tìm web CHƯA ĐƯỢC CẤU HÌNH trên máy chủ (thiếu biến môi trường '
  + '`TAVILY_API_KEY`). Đây KHÔNG phải lỗi của bạn và cũng không phải "không tìm thấy gì" — '
  + 'hãy nói với người dùng rằng quản trị viên cần thêm khoá đó, rồi dùng `doc_web` nếu bạn '
  + 'đã biết sẵn một địa chỉ cụ thể.';

export async function timWeb(args: Record<string, unknown>): Promise<KetQuaTimWeb> {
  const cauHoi = typeof args.q === 'string' ? args.q.trim() : '';
  if (!cauHoi) return { content: 'LỖI: thiếu "q".', summary: 'thiếu câu hỏi' };

  const khoa = khoaTim();
  if (!khoa) return { content: CHUA_CAU_HINH, summary: 'chưa cấu hình' };

  const soMuc = Math.min(
    MAX_KETQUA,
    Math.max(1, typeof args.so === 'number' ? Math.floor(args.so) : 5),
  );

  /* `AbortSignal.timeout` chứ không phải đợi mãi: một lời gọi treo giữ nguyên
     cả lượt agent, và người dùng chỉ thấy con quay quay. */
  let du: unknown;
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: khoa,
        query: cauHoi,
        max_results: soMuc,
        search_depth: 'basic',
      }),
      signal: AbortSignal.timeout(HET_GIO_MS),
    });
    if (!res.ok) {
      /* Phân biệt SAI KHOÁ với HẾT LƯỢT — hai thứ này người dùng xử lý khác
         nhau, và gộp thành "lỗi tìm kiếm" là bắt họ tự đoán. */
      const vi = res.status === 401 || res.status === 403
        ? 'khoá tìm kiếm sai hoặc đã bị thu hồi'
        : res.status === 429
          ? 'đã hết lượt tìm của gói hiện tại'
          : `máy chủ tìm kiếm trả HTTP ${res.status}`;
      return { content: `LỖI: ${vi}. Nói điều này với người dùng.`, summary: `lỗi ${res.status}` };
    }
    du = await res.json();
  } catch (err) {
    const la = (err as Error).name === 'TimeoutError';
    logger.warn(`tim_web hỏng: ${(err as Error).message}`);
    return {
      content: la
        ? `LỖI: tìm kiếm quá ${HET_GIO_MS / 1000}s không phản hồi.`
        : `LỖI: không nối được tới dịch vụ tìm kiếm (${(err as Error).message}).`,
      summary: la ? 'hết giờ' : 'không nối được',
    };
  }

  const ds = Array.isArray((du as { results?: unknown[] }).results)
    ? (du as { results: Array<Record<string, unknown>> }).results
    : [];
  if (!ds.length) return { content: `Không có kết quả nào cho "${cauHoi}".`, summary: '0 kết quả' };

  /* CHỮ THUẦN, không JSON. Model đọc chữ tốt hơn đọc JSON lồng nhau, và mỗi
     dấu ngoặc thừa là token phải trả tiền — cùng lý do `serverTools.ts` đã ghi. */
  const dong = ds.slice(0, soMuc).map((r, i) => {
    const tieuDe = String(r.title ?? '(không tên)');
    const url = String(r.url ?? '');
    const noiDung = String(r.content ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHU_MOI_MUC);
    return `${i + 1}. ${tieuDe}\n   ${url}\n   ${noiDung}`;
  });

  return {
    content:
      `Kết quả tìm cho "${cauHoi}":\n\n${dong.join('\n\n')}\n\n`
      + 'Đây chỉ là TÓM TẮT do dịch vụ tìm kiếm trả về. Cần nội dung đầy đủ thì gọi `doc_web` '
      + 'với đúng địa chỉ ở trên.',
    summary: `${dong.length} kết quả`,
  };
}
