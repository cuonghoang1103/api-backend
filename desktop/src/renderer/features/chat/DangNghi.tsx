/**
 * ============================================================
 * DÒNG CHỜ — ba chặng, một giọng nói
 * ============================================================
 *
 * Trước 18/08/2026 mỗi màn hình tự viết một câu: AI chat nói "Đang trả
 * lời… 50s — cổng AI đang chậm, không phải app treo", AI Code nói "Đang
 * đọc và suy nghĩ…", robot nói "Đang trả lời…". Ba giọng cho một nhân vật.
 *
 * Và câu của AI chat tuy ĐÚNG nhưng đọc như một dòng nhật ký lỗi. Người
 * dùng đang chờ chứ không đang gỡ lỗi.
 *
 * ─── VÌ SAO ĐỔI CÂU THEO THỜI GIAN, KHÔNG PHẢI MỘT CÂU CỐ ĐỊNH ───
 * Một câu đứng im 50 giây thì không phân biệt được với app treo. Câu đổi
 * là bằng chứng sống rằng còn có thứ đang chạy — rẻ hơn nhiều so với một
 * thanh tiến trình giả vờ (mà cũng không thể làm thật, vì không ai biết
 * model còn nghĩ bao lâu).
 *
 * ⚠️ VẪN GIỮ câu "cổng AI đang chậm chứ app không treo", chỉ dời xuống
 * muộn hơn và nói nhẹ đi. Nó là thông tin THẬT và cho người dùng một lựa
 * chọn (chờ tiếp, hay bấm Dừng) — bỏ đi cho "thân thiện" là đổi sự tử tế
 * lấy sự mơ hồ.
 */
import { Loader2 } from 'lucide-react';

/** Giây bắt đầu đổi sang câu thứ hai. Dưới ngần này thì câu đầu chưa kịp đọc xong. */
const CHANG_HAI_GIAY = 6;
/** Giây bắt đầu nói ra nguyên nhân. Dưới ngần này thì chưa có gì bất thường để báo. */
const CHANG_LO_GIAY = 15;

export function DangNghi({
  giay,
  dangTraLoi = false,
  chuRieng,
  buoc,
}: {
  /** Đã chờ bao lâu. Truyền 0 nếu không đếm. */
  giay: number;
  /** Model đã bắt đầu SINH câu trả lời (khác với còn đang nghĩ). */
  dangTraLoi?: boolean;
  /** Câu riêng cho chặng đầu, ví dụ AI Code muốn nói rõ nó đang ĐỌC gì. */
  chuRieng?: string;
  /**
   * Bước thứ mấy trên tổng bao nhiêu (chỉ AI Code có).
   *
   * Không có nó thì một khoảng lặng 40 giây trông y hệt app treo — cổng này
   * không chảy chữ thật, nên chữ chỉ về một cục ở cuối. Con số bước là thứ
   * duy nhất nói được "vẫn đang chạy", và nó còn báo trước sắp chạm trần.
   */
  buoc?: { nay: number; tran: number };
}) {
  const chu = dangTraLoi
    ? 'Odin đang trả lời…'
    : giay >= CHANG_HAI_GIAY
      ? 'Odin đang suy nghĩ…'
      : (chuRieng ?? 'Chờ tớ suy nghĩ xíu nhé…');

  return (
    <div className="ct-agent-nghi">
      <Loader2 size={13} aria-hidden className="ct-spin" />
      {buoc && (
        <span className="ct-agent-nghi-buoc" data-sap-het={buoc.tran - buoc.nay <= 1}>
          bước {buoc.nay}/{buoc.tran}
        </span>
      )}
      <span>
        {chu}
        {/* Số giây chỉ hiện sau 3s: câu trả lời nhanh mà kèm một con số nhảy
            liên tục thì nó thành thứ gây lo, không phải thứ trấn an. */}
        {giay >= 3 && <span className="ct-nghi-giay"> {giay}s</span>}
        {giay >= CHANG_LO_GIAY && (
          <span className="ct-nghi-phu">
            {' '}Cổng AI đang chậm chứ app không treo — bấm Dừng nếu muốn thử lại.
          </span>
        )}
      </span>
    </div>
  );
}
