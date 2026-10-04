/**
 * Phòng thi — bản DESKTOP viết mới (04/10/2026).
 *
 * Người dùng: "Exam Room rất quan trọng… làm UI và tính năng full như web nhưng
 * là một bản desktop hoàn toàn mới, nâng cấp trải nghiệm."
 *
 * ─── Vì sao viết mới chứ không dựng lại cây web ───
 * Trang web là bố cục một cột 5xl giữa màn hình, thiết kế cho trình duyệt. Trong
 * cửa sổ app rộng nó để trống hai bên và bắt cuộn rất xa. Bản này dựng lại BỐ CỤC
 * theo kiểu ứng dụng (cột lọc · danh sách · khung chi tiết; phòng thi toàn khung
 * có bảng câu hỏi, phím tắt, màn soát bài trước khi nộp) nhưng GIỮ nguyên mọi
 * đường gọi máy chủ của web: dùng thẳng `examApi` (axios của web, cầu nối
 * `useCauNoiWeb`) và ba thành phần web không nên chép lại —
 *   • `ExamRichContent` (KaTeX, mermaid, đề song ngữ, bảng);
 *   • `ExamQuestionComments` (bình luận theo câu);
 *   • `CuongMiniPanel` (AI đồng hành — Pro).
 * Dùng chung payload nghĩa là web đổi API thì `tsc` của app đỏ ngay, không trôi.
 *
 * ─── Ba màn, ba đường dẫn của app ───
 *   /exam                → Sảnh: Đề thi · Lịch sử · Sổ tay
 *   /exam/:id            → Giới thiệu đề → đang thi (toàn khung)
 *   /exam/attempt/:id    → Kết quả + chữa bài
 * Dùng đường dẫn thật (không phải state cục bộ) để nút lùi/tiến, ⌘K và liên kết
 * từ nơi khác (Học viện, Sổ tay) mở thẳng đúng màn.
 */
import '@/app/exam/exam.css';
import './exam-desk.css';
import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useCauNoiWeb, VoWeb } from '../web/TrangWeb';
import { useNoi } from './chung';
import { Sanh } from './Sanh';
import { LamBai } from './LamBai';
import { KetQua } from './KetQua';

type Man =
  | { loai: 'sanh' }
  | { loai: 'de'; id: number }
  | { loai: 'ketqua'; id: number }
  | { loai: 'sai' };

export function docMan(route: string): Man {
  const doan = route.split('?')[0]!.split('/').filter(Boolean);
  if (doan[0] !== 'exam') return { loai: 'sai' };
  if (doan.length === 1) return { loai: 'sanh' };
  if (doan.length === 2 && /^\d+$/.test(doan[1]!)) return { loai: 'de', id: Number(doan[1]) };
  if (doan.length === 3 && doan[1] === 'attempt' && /^\d+$/.test(doan[2]!)) return { loai: 'ketqua', id: Number(doan[2]) };
  return { loai: 'sai' };
}

export function PhongThiPage() {
  const { route, navigate } = useAppState();
  const san = useCauNoiWeb();
  const { t } = useNoi();
  const man = useMemo(() => docMan(route), [route]);

  if (!san) {
    return (
      <div className="ct-boot">
        <div className="ct-empty">
          <Loader2 size={22} className="ct-spin" aria-hidden />
          <p style={{ marginTop: 10 }}>{t('Đang mở Phòng thi…', 'Opening Exam Room…')}</p>
        </div>
      </div>
    );
  }

  /* `.ctx-khung` mang container query: bố cục co giãn theo VÙNG NỘI DUNG (thanh
     bên app ăn 60–218px), không theo cửa sổ. Nằm NGOÀI `.ct-web-host` (khung
     cuộn) để lớp phủ fixed (màn soát bài, CuongMini) neo vào vùng nội dung. */
  return (
    <div className="ctx-khung">
    <VoWeb>
      {man.loai === 'sanh' && <Sanh />}
      {/* `key` theo id: chuyển thẳng từ đề này sang đề khác (Thi lại từ trang kết
          quả của đề khác) phải dựng lại sạch — không mang đồng hồ của đề cũ. */}
      {man.loai === 'de' && <LamBai key={man.id} examId={man.id} />}
      {man.loai === 'ketqua' && <KetQua key={man.id} attemptId={man.id} />}
      {man.loai === 'sai' && (
        <div className="ct-page">
          <div className="ct-empty">
            <h1>{t('Không tìm thấy', 'Not found')}</h1>
            <p>{t('Đường dẫn phòng thi không hợp lệ.', 'This Exam Room link is not valid.')}</p>
            <button type="button" className="ct-btn ct-btn-ghost" onClick={() => navigate('/exam')}>
              {t('Về Phòng thi', 'Back to Exam Room')}
            </button>
          </div>
        </div>
      )}
    </VoWeb>
    </div>
  );
}
