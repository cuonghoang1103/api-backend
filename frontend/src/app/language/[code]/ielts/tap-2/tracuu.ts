/**
 * Hai mục TRA CỨU của IELTS Tập 2 (hiện dưới "Mở đầu" ở mục lục) — tách khỏi `../tracuu.ts` của Tập 1
 * theo docs/ielts-lo-trinh-0-8.md 5.1 #10 ("từ Tập 2 tách tracuu theo tập").
 *   · `t2-tra-cong-thuc` — công thức + khung câu Nói/Viết của các ngày Tập 2 đã soạn.
 *     **Soạn ngày có điểm ngữ pháp / khung câu mới → thêm một mục `h` + `patterns`/`table` + `rule` vào đây**
 *     (chép nguyên khối của bài ngày đó; tiêu đề ghi "(Ngày N · mục M)").
 *   · `t2-tra-tu-vung` — khối `vocabAll`: từ vựng CỦA TẬP 2, tự đọc từ mục lục (manifest) — không phải sửa.
 */
import type { Lesson } from '@/components/sach-hoc/types';
import { TRA_CONG_THUC_CHANG1 } from './tracuu-chang1';
import { TRA_CONG_THUC_CHANG2 } from './tracuu-chang2';
import { TRA_CONG_THUC_CHANG3 } from './tracuu-chang3';
import { TRA_CONG_THUC_CHANG4 } from './tracuu-chang4';

export const TRA_CONG_THUC_T2: Lesson = {
  id: 't2-tra-cong-thuc',
  kind: 'grammar',
  title: 'Tra cứu Tập 2: công thức',
  goal: 'Ôn nhanh mọi công thức ngữ pháp và khung câu Nói/Viết của Tập 2 ở một trang, mỗi mục ghi ngày học chi tiết.',
  minutes: 20,
  blocks: [
    {
      t: 'recap',
      title: 'Dùng trang này thế nào?',
      items: [
        'Mỗi khung là **một điểm ngữ pháp / khung câu** của Tập 2, xếp theo ngày học; tiêu đề ghi **(Ngày N · mục M)** để mở lại đúng chỗ.',
        'Công thức của **Tập 1** (thì hiện tại đơn, đại từ, danh từ đếm được, tính từ – trạng từ, bị động…) vẫn ở mục tra cứu của Tập 1.',
        'Bốn chặng: Ngày 1–6 · 7–12 · 13–18 · 19–24.',
      ],
    },
    ...TRA_CONG_THUC_CHANG1,
    ...TRA_CONG_THUC_CHANG2,
    ...TRA_CONG_THUC_CHANG3,
    ...TRA_CONG_THUC_CHANG4,
  ],
};

export const TRA_TU_VUNG_T2: Lesson = {
  id: 't2-tra-tu-vung',
  kind: 'vocab',
  title: 'Tra cứu Tập 2: từ vựng',
  goal: 'Tìm nhanh bất kỳ từ nào đã học ở Tập 2 (gõ tiếng Anh hoặc tiếng Việt), lọc theo ngày, che nghĩa để tự kiểm tra và luyện thẻ nhớ.',
  minutes: 10,
  blocks: [
    {
      t: 'recap',
      title: 'Ôn từ vựng mỗi ngày 10 phút',
      items: [
        'Chọn **ngày vừa học** → bấm **Che nghĩa** → nhìn từ, nói to nghĩa, chạm để kiểm tra.',
        'Đổi sang **Che từ tiếng Anh**: nhìn nghĩa, nói (hoặc viết ra giấy) từ tiếng Anh.',
        'Ôn giãn cách cả Tập 1 lẫn Tập 2: **Flashcards** (bộ "Từ của khoá — Tập 2").',
      ],
    },
    { t: 'vocabAll' },
  ],
};
