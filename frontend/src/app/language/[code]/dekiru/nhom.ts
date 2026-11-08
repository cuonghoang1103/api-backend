/**
 * Sắp mục lục MỘT bài Dekiru thành 5 nhóm có thứ tự học (23/10/2026 — người học: "nhiều mục quá, nhìn thấy sợ,
 * không biết học từ đâu"). Không xoá/sửa nội dung bài nào: chỉ gom theo id và gập các nhóm phụ.
 *
 *  ① Học trước (cốt lõi) — bộ bài gốc của bài: hội thoại, từ vựng, ngữ pháp, chữ Hán của lớp, nghe, nói, bài tập.
 *  ② Học lại theo buổi của cô — slot-… / slide tổng hợp / buổi theo khung lớp (s113-…): đúng thứ tự cô dạy.
 *  ③ Luyện thêm — dễ → khó (lt-…): bài tập tự soạn thêm, đã sắp từ dễ đến khó.
 *  ④ Ôn thi & đáp án bài của cô (bt-…, ôn giữa kỳ, chia thể て).
 *  ⑤ Bổ sung & tra sách: chữ Hán trong từ vựng, 📖 Theo sách.
 */
import type { Lesson } from '@/components/sach-hoc/types';
import type { NhomMuc } from '@/components/sach-hoc/course';

// Bài 16+ (tiếp sau sách, 09/11/2026): chữ Hán `bN-han-tu`, đọc hiểu `bN-doc` là phần cốt lõi; buổi học
// `bN-buoi-K-…`; luyện thêm `bN-lt-…`; kiểm tra chặng / thi thử `bN-kiem-tra…` / `bN-thi-thu…`.
const LOI = /^b\d+-(hoi-thoai|tu-vung|ngu-phap|han-lop|han-tu|nghe|doc|noi|viet|bai-tap|luyen-nho|doc-to|hinh-tu)$|^b0-/;
const BUOI_CO = /^(slot-|slide-tong-hop-|s113-|b\d+-buoi-)/;
const LUYEN = /^(lt-|b\d+-lt-)/;
const ON_THI = /^(bt-|on-giua-ky|chia-the-te-|b\d+-kiem-tra|b\d+-thi-thu)/;

function phut(ls: Lesson[]) {
  const h = ls.reduce((a, l) => a + (l.minutes || 0), 0) / 60;
  return h < 1 ? `${Math.round(h * 60)} phút` : `~${h.toFixed(h < 10 ? 1 : 0).replace('.0', '')} giờ`;
}

export function nhomMucDekiru(lessons: Lesson[]): NhomMuc[] | null {
  if (lessons.length < 12) return null; // Bài 8–15 chỉ 9 mục: để phẳng.
  const g: Record<'loi' | 'co' | 'luyen' | 'thi' | 'bs', Lesson[]> = { loi: [], co: [], luyen: [], thi: [], bs: [] };
  for (const l of lessons) {
    if (LOI.test(l.id)) g.loi.push(l);
    else if (BUOI_CO.test(l.id)) g.co.push(l);
    else if (LUYEN.test(l.id)) g.luyen.push(l);
    else if (ON_THI.test(l.id)) g.thi.push(l);
    else g.bs.push(l);
  }
  const ds: NhomMuc[] = [
    { key: 'loi', ten: '① Học trước — phần cốt lõi', batDau: true, lessons: g.loi,
      mota: `Chỉ ${g.loi.length} mục, ${phut(g.loi)}. Làm đủ phần này là nắm xong bài; các nhóm dưới học khi cần.` },
    { key: 'co', ten: '② Học theo buổi trên lớp', lessons: g.co,
      mota: 'Cùng nội dung bài, chia đúng từng buổi như trên lớp (slide → giảng → luyện → câu hỏi phát biểu). Dùng để học theo nhịp lớp hoặc ôn lại buổi vừa học.' },
    { key: 'luyen', ten: '③ Luyện thêm — từ dễ đến khó', lessons: g.luyen,
      mota: 'Bài tập soạn thêm có đáp án. Bắt đầu từ mục "đọc trước" để biết thứ tự; làm khi đã xong nhóm ①.' },
    { key: 'thi', ten: '④ Ôn thi · kiểm tra · đáp án', lessons: g.thi,
      mota: 'Đề và bài tập cô giao có đáp án + giải thích. Làm vào tuần trước kỳ thi.' },
    { key: 'bs', ten: '⑤ Bổ sung & tra sách', lessons: g.bs,
      mota: 'Chữ Hán trong từ vựng và phần Theo sách (đi theo từng trang) — tra khi cần.' },
  ];
  return ds.filter((d) => d.lessons.length > 0);
}
