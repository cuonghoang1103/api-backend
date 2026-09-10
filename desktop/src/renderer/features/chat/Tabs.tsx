/**
 * Thanh tab của chế độ Lập trình.
 *
 * ─── VÌ SAO MỌI TAB ĐỀU ĐƯỢC DỰNG, CHỈ ẨN BẰNG CSS ───
 * Tháo tab không hiện ra khỏi cây React nghĩa là mất bảng ghi của nó — và với
 * một việc 20 bước đã tốn tiền thật thì "chuyển tab rồi quay lại thấy trống"
 * là mất đúng thứ người dùng đang giữ. Vài tab cùng dựng thì rẻ; dựng lại một
 * hội thoại đã mất thì không.
 *
 * ─── DẤU CHẤM "ĐANG CHẠY" ───
 * Chỉ MỘT việc chạy tại một thời điểm (xem `chayLuot`), nên nếu người dùng bật
 * một việc dài rồi sang tab khác đọc, họ phải nhìn thấy tab nào đang bận —
 * nếu không họ gõ ở tab mới và nhận một lỗi khó hiểu.
 */
import { Plus, X } from 'lucide-react';
import { useT } from '../../i18n';

export interface TabAgent {
  id: string;
  tieuDe: string;
  dangChay: boolean;
  /** Tên thư mục dự án của tab này. Mỗi tab một dự án riêng nên đây là thứ phân biệt chúng. */
  duAn?: string | null;
}

export function ThanhTab({
  tabs,
  dangMo,
  onChon,
  onThem,
  onDong,
}: {
  tabs: TabAgent[];
  dangMo: string;
  onChon: (id: string) => void;
  onThem: () => void;
  onDong: (id: string) => void;
}) {
  const { t } = useT();
  return (
    <div className="ct-tabs" role="tablist" aria-label={t('Việc đang mở')}>
      {tabs.map((tab) => (
        <div key={tab.id} className="ct-tab" data-chon={tab.id === dangMo} role="tab" aria-selected={tab.id === dangMo}>
          <button
            type="button"
            className="ct-tab-chon"
            onClick={() => onChon(tab.id)}
            title={tab.duAn ? `${tab.tieuDe}\n📁 ${tab.duAn}` : tab.tieuDe}
          >
            {tab.dangChay && <span className="ct-tab-cham" aria-label={t('đang chạy')} />}
            <span className="ct-tab-chu">{tab.tieuDe}</span>
            {/* Tên dự án ngay trên tab: từ khi mỗi tab một dự án, hai tab cùng
                tên việc mà khác repo là chuyện thường, và không có nhãn này thì
                người dùng phải bấm vào từng cái để biết mình đang ở đâu. */}
            {tab.duAn && <span className="ct-tab-duan">{tab.duAn}</span>}
          </button>
          {/* Tab cuối cùng KHÔNG có nút đóng: đóng hết thì màn hình trống trơn
              và người dùng phải đi tìm cách tạo lại. Luôn còn ít nhất một. */}
          {tabs.length > 1 && (
            <button type="button" className="ct-tab-dong" onClick={() => onDong(tab.id)} title={t('Đóng việc này')}>
              <X size={11} aria-hidden />
            </button>
          )}
        </div>
      ))}
      <button type="button" className="ct-tab-them" onClick={onThem} title={t('Mở việc mới')}>
        <Plus size={13} aria-hidden />
      </button>
    </div>
  );
}
