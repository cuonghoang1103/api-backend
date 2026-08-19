/**
 * ============================================================
 * BA NÚT DƯỚI TIN NHẮN ĐÃ GỬI + THỜI GIAN
 * ============================================================
 *
 * Người dùng đối chiếu với Claude (ảnh 19/08/2026): dưới mỗi câu mình vừa gõ
 * có ba nút nhỏ — chép, quay lui về đây, tách nhánh từ đây — và một nhãn
 * "x phút trước" như Claude Code.
 *
 * ─── QUAY LUI ≠ TÁCH NHÁNH ───
 * Hai nút nhìn giống nhau nhưng làm hai việc ngược nhau, nên nhãn phải nói rõ:
 *   • Quay lui  → CẮT hội thoại tại đây. Việc cũ mất phần đuôi.
 *   • Tách nhánh → chép thành việc MỚI, việc cũ còn nguyên.
 * Gọi cả hai là "sửa lại câu hỏi" thì người dùng bấm nhầm và mất đoạn hội
 * thoại đã trả tiền để có.
 *
 * ─── VÌ SAO CHỈ MỘT ĐỒNG HỒ CHO CẢ MÀN HÌNH ───
 * "3 phút trước" phải tự trôi, nếu không thì nó đứng ì ở "vừa xong" cho tới
 * lần vẽ lại tình cờ tiếp theo. Nhưng mỗi tin nhắn một `setInterval` thì một
 * hội thoại 60 lượt có 60 bộ đếm chạy song song. Ở đây dùng MỘT bộ đếm chung
 * ở cấp module, các tin nhắn đăng ký nghe qua `useSyncExternalStore`.
 */
import { useState, useSyncExternalStore } from 'react';
import { Check, Copy, GitBranch, Undo2 } from 'lucide-react';

// ─── Đồng hồ chung ────────────────────────────────────────────────

const nguoiNghe = new Set<() => void>();
let boDem: ReturnType<typeof setInterval> | null = null;
let nhip = 0;

function dangKy(g: () => void): () => void {
  nguoiNghe.add(g);
  // Chỉ chạy bộ đếm khi CÓ người nghe. Hội thoại rỗng, hoặc người dùng sang
  // trang khác, thì không có gì nhịp cả.
  if (!boDem) boDem = setInterval(() => { nhip += 1; nguoiNghe.forEach((f) => f()); }, 30_000);
  return () => {
    nguoiNghe.delete(g);
    if (nguoiNghe.size === 0 && boDem) { clearInterval(boDem); boDem = null; }
  };
}

function docNhip(): number { return nhip; }

/** "vừa xong" · "3 phút trước" · "hôm qua" — mốc tuyệt đối không nói lên gì. */
export function baoLau(luc: number): string {
  const giay = Math.max(0, (Date.now() - luc) / 1000);
  if (giay < 45) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 172800) return 'hôm qua';
  return new Date(luc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function NhanThoiGian({ luc }: { luc: number }) {
  // Giá trị trả về không dùng tới — nó chỉ để React vẽ lại mỗi 30 giây.
  useSyncExternalStore(dangKy, docNhip, docNhip);
  return <span className="ct-tn-luc">{baoLau(luc)}</span>;
}

// ─── Thanh nút ────────────────────────────────────────────────────

export function NutTinNhan({
  text, luc, khoa, onQuayLui, onTachNhanh,
}: {
  /** Chữ được chép khi bấm nút chép. */
  text: string;
  /** Lúc gửi. Vắng mặt = việc mở lại từ đĩa, không có mốc từng tin. */
  luc?: number;
  /** Lượt đang chạy ⇒ khoá hai nút đổi hội thoại. */
  khoa?: boolean;
  onQuayLui?: () => void;
  onTachNhanh?: () => void;
}) {
  const [daChep, datDaChep] = useState(false);

  const chep = (): void => {
    void navigator.clipboard.writeText(text).then(() => {
      datDaChep(true);
      // Về lại biểu tượng cũ sau 1,4s. Không có bước này thì dấu tick nằm mãi
      // và lần chép sau không có phản hồi nào cả.
      setTimeout(() => datDaChep(false), 1400);
    }).catch(() => { /* chép hỏng thì im — không đáng một dòng lỗi đỏ */ });
  };

  return (
    <div className="ct-tn-nut">
      <button type="button" className="ct-tn-nho" onClick={chep} title="Chép câu này">
        {daChep ? <Check size={11} aria-hidden /> : <Copy size={11} aria-hidden />}
        {daChep ? 'Đã chép' : 'Chép'}
      </button>

      {onQuayLui && (
        <button
          type="button"
          className="ct-tn-nho"
          disabled={khoa === true}
          onClick={onQuayLui}
          title={'Quay lui về đây — BỎ câu này và mọi thứ sau nó khỏi hội thoại, rồi đặt lại '
            + 'câu hỏi vào ô soạn. Không hoàn tác file đã ghi.'}
        >
          <Undo2 size={11} aria-hidden />
          Quay lui
        </button>
      )}

      {onTachNhanh && (
        <button
          type="button"
          className="ct-tn-nho"
          disabled={khoa === true}
          onClick={onTachNhanh}
          title={'Tách nhánh từ đây — chép thành một việc MỚI dừng ngay trước câu này. '
            + 'Việc hiện tại giữ nguyên.'}
        >
          <GitBranch size={11} aria-hidden />
          Tách nhánh
        </button>
      )}

      {luc !== undefined && <NhanThoiGian luc={luc} />}
    </div>
  );
}
