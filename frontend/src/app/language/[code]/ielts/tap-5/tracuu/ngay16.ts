/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 16 (soạn cùng `tap-5/ngay/ngay16.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang3.ts` (TRA_CONG_THUC_CHANG3) và đánh số "K." liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_16: Block[] = [
  { t: 'h', text: '(Ngày 16 · Viết mục A2) Advantages / disadvantages band 8 — ba quả cân' },
  {
    t: 'table',
    head: ['Quả cân', 'Khung câu'],
    rows: [
      ['Phạm vi', 'The benefits are spread across…, whereas the costs fall on a relatively small group.'],
      ['Thời gian', 'This is a one-off cost set against a permanent benefit.'],
      ['Đảo ngược', 'The damage, once done, cannot easily be undone.'],
      ['Khắc phục', 'This drawback, though real, can largely be addressed by…'],
      ['Xác suất', 'The gain is certain; the risk is merely possible.'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'Although + S + V, + I would argue that + S + be outweighed by + N', vi: 'Câu lập trường ở mở bài.', examples: [{ en: 'Although the move carries real costs, I would argue that these are outweighed by what it makes possible.', vi: 'Dù bước đi này có cái giá thật, tôi cho rằng những gì nó mở ra còn nặng hơn.' }] },
      { formula: 'The first concern is + adj, but + S + V; the second is less + adj + than it sounds', vi: 'Nhận định từng lập luận đối lập.', examples: [{ en: 'The first concern is well founded, but it is a one-off cost; the second is less persuasive than it sounds.', vi: 'Mối lo thứ nhất có cơ sở, nhưng đó là chi phí một lần; mối lo thứ hai kém thuyết phục hơn ta tưởng.' }] },
      { formula: 'What tips the balance is + N / the fact that + S + V', vi: 'Chỉ ra quả cân quyết định.', examples: [{ en: 'What tips the balance is the fact that the harm is reversible, while the benefit is not.', vi: 'Điều làm cán cân nghiêng là tác hại thì đảo ngược được, còn lợi ích thì không mất đi.' }] },
      { formula: 'Provided that + S + V, + S + be + to be welcomed', vi: 'Kết bài có điều kiện.', examples: [{ en: 'Provided that funding is not taken from conservation, this is a development to be welcomed.', vi: 'Miễn là kinh phí không bị lấy từ công tác bảo tồn, đây là một bước phát triển đáng hoan nghênh.' }] },
    ],
  },
  { t: 'rule', formula: 'outweigh = CÂN bằng quả cân (phạm vi · thời gian · đảo ngược · khắc phục · xác suất), không phải ĐẾM số ý', vi: 'Mỗi bài chọn một hoặc hai quả cân, nêu tên ở thân bài 2 và nhắc lại ở kết bài.' },

  { t: 'h', text: '(Ngày 16 · Viết mục B1–B2) Task 1 hai hình: bảng nhiều đơn vị + biểu đồ tròn' },
  {
    t: 'table',
    head: ['Việc', 'Khung câu'],
    rows: [
      ['Mở bài hai hình', 'The table compares…, while the pie chart breaks down…'],
      ['Tăng nhẹ', 'rose slightly, from 212 to 228 hectares'],
      ['Giảm hơn một nửa', 'more than halved, from 46 to 21'],
      ['Giảm một phần tư', 'was cut by roughly a quarter, to £2.9 million'],
      ['Phép tính nối hai hàng', 'so that each gardener was responsible for over twice as much land'],
      ['Chuyển sang hình thứ hai', 'As for the reasons behind…, exercise was cited by just over a third of respondents'],
      ['Gộp hai lát', 'together accounting for more than half'],
    ],
  },
  { t: 'rule', formula: 'bảng nhiều đơn vị: so DỌC (theo năm), không so NGANG (giữa các hàng)  ·  tự tính 1 tỉ lệ nối hai hàng  ·  hai hình: mỗi hình một thân bài', vi: 'Overview = một câu cho bảng (điều đáng nói) + một câu cho biểu đồ tròn.' },
  { t: 'rule', formula: 'Task 1 hai hình: 4′ đọc + 13′ viết + 3′ soát  ·  Task 2 hai câu hỏi: 6′ dàn ý + 29′ viết + 5′ soát', vi: 'Phút đọc thêm lấy từ khâu viết, không lấy từ khâu soát.' },

  { t: 'h', text: '(Ngày 16 · Viết mục B3) Task 2 hai câu hỏi khác loại' },
  { t: 'rule', formula: 'hai câu hỏi → mở bài trả lời NGẮN cả hai → thân 1 = câu hỏi 1 → thân 2 = câu hỏi 2 (CHỌN + vì sao không phải bên kia) → hai thân dài ngang nhau', vi: '“Who should…: A, B or C?” đòi một lựa chọn có tiêu chí.' },

  { t: 'h', text: '(Ngày 16 · Nghe mục 3) Bẫy band 8 — con số bị đổi' },
  {
    t: 'table',
    head: ['Cụm', 'Nghĩa', 'Gốc 120'],
    rows: [
      ['half as many again', 'thêm một nửa (× 1,5)', '180'],
      ['twice as many · double', 'gấp đôi', '240'],
      ['a third off', 'bớt một phần ba', '80'],
      ['up by a quarter', 'tăng một phần tư', '150'],
      ['X, not the Y it says…', 'số đúng nói TRƯỚC', '—'],
      ['no, hang on / sorry', 'số sửa lại là đáp án', '—'],
    ],
  },
  { t: 'rule', formula: 'con số đúng = con số có câu XÁC NHẬN hoặc là KẾT QUẢ của phép tính — không phải con số nói đầu tiên hay cuối cùng', vi: 'Ghi cả chuỗi số ra nháp; chốt khi người nói đổi ý khác; đối chiếu nhãn ô.' },

  { t: 'h', text: '(Ngày 16 · Nghe mục 4) Bẫy band 8 — phủ định kép và gần phủ định' },
  {
    t: 'table',
    head: ['Cụm nghe được', 'Nghĩa thật'],
    rows: [
      ['not uncommon / not unusual', 'khá thường gặp'],
      ['no shortage of', 'có rất nhiều'],
      ["can't fail to", 'chắc chắn sẽ'],
      ['hardly… without', 'gần như lần nào cũng'],
      ['nobody… without', 'ai cũng phải'],
      ["It's not that I don't…; …", 'tôi CÓ…; lý do thật ở vế sau'],
      ['far from · anything but', 'hoàn toàn không'],
      ["didn't mind", 'không phản đối'],
    ],
  },
  { t: 'rule', formula: 'not un- · no shortage of · can\'t fail to · hardly… without · nobody… without  →  KHẲNG ĐỊNH   ·   far from · anything but · didn\'t mind  →  một phủ định giấu', vi: 'Nhận cả cụm như một từ; trong MCQ, phủ định kép thường LOẠI một phương án nghe giống đáp án.' },

  { t: 'h', text: '(Ngày 16 · Nghe mục 2) Giờ đọc trước theo dạng' },
  { t: 'rule', formula: 'giờ đọc trước: Form / Table → loại từ   ·   MCQ → từ KHÁC nhau   ·   Matching → thuộc HỘP   ·   Flow-chart → từ đứng trước ô', vi: 'Mỗi dạng một việc.' },
];
