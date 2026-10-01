/**
 * ============================================================
 * Maker Lab — chọn "não" cho robot
 * ============================================================
 *
 * Robot chạy được bằng hai bộ não, và đây là chỗ chọn:
 *
 *   'may-nha'  Qwen3.5-9B trên RTX 3060 ở nhà — chữ đầu 96-333 ms, MIỄN PHÍ,
 *              nhưng tiếng Việt 87% và tục ngữ yếu hơn.
 *   'cong'     model của modelapi.vn — chữ đầu 2.119-4.575 ms, tốn tiền,
 *              tiếng Việt 93%.
 *   null       theo cấu hình máy chủ (`LLM_LOCAL_PURPOSES`), không ghim.
 *
 * ⚠️ CẢ HAI ĐỀU LUÔN CÒN ĐÓ. Bật máy nhà KHÔNG gỡ model cũ đi — nó vẫn là
 * lưới đỡ khi nhà mất điện, và ghim `'cong'` là quay về nó ngay lập tức,
 * không cần deploy, không cần sửa biến môi trường.
 *
 * Cất trong `traits.nao` — cùng chỗ với `cheDo` và `speechRate`, vì cột JSON
 * đó có sẵn và sống qua restart. Để trong bộ nhớ tiến trình thì mỗi lần
 * deploy robot lại lặng lẽ quay về mặc định mà không ai hiểu vì sao.
 */

export type Nao = 'may-nha' | 'cong';

export const NHAN_NAO: Record<Nao, string> = {
  'may-nha': 'não ở nhà',
  cong: 'não trên mạng',
};

/** Câu xác nhận robot nói ra sau khi đổi — người dùng phải NGHE thấy nó đổi. */
export const CHAO_DOI_NAO: Record<Nao, string> = {
  'may-nha': 'Rồi, tôi chuyển sang não ở nhà. Nhanh hơn nhưng hơi cùn, chịu khó.',
  cong: 'Rồi, tôi quay lại não trên mạng. Chậm hơn mà nói năng tử tế hơn đấy.',
};

/** Câu xác nhận khi về chế độ TỰ ĐỘNG (`nao = null`) — xem `chonNao.ts`. */
export const CHAO_TU_DONG =
  'Rồi, tôi tự chọn não nhé: chuyện phiếm thì dùng não ở nhà cho nhanh, câu khó thì lên mạng nghĩ cho kỹ.';

/**
 * "Đổi sang não tự động / kết hợp / tự chọn não" — bỏ ghim, để robot chọn
 * não theo từng câu (01/10/2026). Tách khỏi `khopDoiNao` vì ở đó `null`
 * nghĩa là "không phải lệnh"; ở đây đích đến lại chính là `null`.
 */
export function khopNaoTuDong(heard: string): boolean {
  const s = khongDau(heard);
  if (!s || s.length > 50) return false;
  if (!/(doi|chuyen|switch|dung|xai|bat|che do)/.test(s)) return false;
  return /(tu dong|ket hop|tu chon|auto)/.test(s) && /(nao|model|che do)/.test(s);
}

function khongDau(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Nghe câu người nói, xem có phải lệnh đổi não không.
 *
 * Cùng khuôn với `khopDoiCheDo`: bắt buộc có ĐỘNG TỪ đổi, và câu phải ngắn.
 * Không có hai chốt đó thì "cái model mới này nói cũng được đấy" bị hiểu
 * thành lệnh đổi — người ta đang KỂ về nó, không phải RA LỆNH.
 */
export function khopDoiNao(heard: string): Nao | null {
  const s = khongDau(heard);
  if (!s || s.length > 50) return null;

  const coDongTu = /(doi|chuyen|switch|dung|xai|quay lai|tro lai|ve)/.test(s);
  if (!coDongTu) return null;

  // "não cũ" = cổng, vì cổng là thứ có trước. Người dùng nghĩ theo mốc thời
  // gian ("cái cũ", "cái lúc trước") chứ không nghĩ theo tên hạ tầng.
  if (/(nao cu|model cu|cai cu|luc truoc|tren mang|online|cong|goc)/.test(s)) return 'cong';
  if (/(nao moi|model moi|cai moi|o nha|may nha|noi bo|cuc bo|offline|local)/.test(s)) return 'may-nha';
  return null;
}

/** Giá trị hợp lệ hay không — dùng khi nhận từ web/API. */
export function laNao(x: unknown): x is Nao {
  return x === 'may-nha' || x === 'cong';
}
