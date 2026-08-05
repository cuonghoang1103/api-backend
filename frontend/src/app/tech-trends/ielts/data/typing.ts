/**
 * Đoạn văn luyện gõ.
 *
 * Vì sao luyện gõ lại nằm trong khoá IELTS — ba lý do thật, không phải nhồi
 * thêm cho vui:
 *
 *  1. **Bài thi trên máy tính.** IELTS bản computer-delivered bắt gõ toàn bộ
 *     Writing trong 60 phút. Gõ mổ cò hai ngón thì mất vài phút chỉ để gõ, và
 *     mất thêm sức chú ý mà lẽ ra dành cho nội dung.
 *  2. **Gõ lại câu đúng làm câu đó dính vào tay.** Chép tay một câu mẫu hiệu
 *     quả hơn đọc nó năm lần — đây là lý do các đoạn ở đây đều là câu THẬT
 *     dùng được, không phải văn bản ngẫu nhiên.
 *  3. **Bắt lỗi chính tả.** Listening và Reading chấm chính tả rất chặt: nghe
 *     đúng mà viết sai vẫn 0 điểm. Gõ đoạn văn lộ ra đúng những từ bạn hay sai.
 *
 * Nội dung các đoạn lấy lại chính câu mẫu trong khoá (câu mở bài Task 2, cụm
 * mô tả xu hướng, câu trả lời Speaking) nên gõ xong là thuộc luôn phần dùng được.
 */

export interface TypingPassage {
  id: string;
  title: string;
  /** Chặng nào nên gõ đoạn này. */
  stage: 'stage1' | 'stage2' | 'stage3' | 'stage4';
  /** Vì sao đoạn này đáng gõ — nối về phần nào của kỳ thi. */
  why: string;
  text: string;
  /** Từ trong đoạn mà người Việt hay gõ sai, hiện ở phần cảnh báo. */
  watch?: string[];
}

export const TYPING_KEY = 'ielts:typing:best:v1';

export const TYPING_PASSAGES: TypingPassage[] = [
  /* ═════════════ CHẶNG 1 ═════════════ */
  {
    id: 't1',
    title: 'Giới thiệu bản thân',
    stage: 'stage1',
    why: 'Chính là câu trả lời Speaking Part 1 và câu mở bài viết về bản thân. Gõ xong là thuộc.',
    text:
      'I am a second-year student at a university in Da Nang. I live with my parents in a small flat near the '
      + 'city centre. In my free time I read books and take photographs. I am studying English because I hope '
      + 'to work abroad after I graduate.',
    watch: ['second-year', 'photographs', 'because', 'graduate'],
  },
  {
    id: 't2',
    title: 'Thói quen hằng ngày',
    stage: 'stage1',
    why: 'Luyện hiện tại đơn và trạng từ tần suất — hai điểm ngữ pháp bài 11 và 12.',
    text:
      'I usually wake up at six o clock and have breakfast at home. My sister works in a hospital and she '
      + 'finishes work at six every evening. We rarely eat out during the week, but at weekends we often visit '
      + 'my grandparents in the countryside.',
    watch: ['usually', 'breakfast', 'rarely', 'countryside'],
  },
  {
    id: 't3',
    title: 'Kể một kỷ niệm',
    stage: 'stage1',
    why: 'Quá khứ đơn và quá khứ tiếp diễn — khung kể chuyện của bài 20 và Speaking Part 2.',
    text:
      'Last summer I visited my grandparents in the countryside. The weather was very hot and humid. One '
      + 'afternoon I was reading in the garden when my grandfather called me. He wanted to show me his old '
      + 'photographs. We looked at them for two hours, and I felt very close to him that day.',
    watch: ['visited', 'humid', 'was reading', 'photographs'],
  },
  {
    id: 't4',
    title: 'Tả nơi bạn sống',
    stage: 'stage1',
    why: 'There is / There are và giới từ nơi chốn — bài 10 và 33.',
    text:
      'There is a market at the end of our street, so we can buy fresh vegetables every morning. The bank is '
      + 'opposite the post office, and the bus stop is just next to our building. The university is within '
      + 'walking distance, which saves me a lot of money on transport.',
    watch: ['opposite', 'vegetables', 'within walking distance'],
  },

  /* ═════════════ CHẶNG 2 ═════════════ */
  {
    id: 't5',
    title: 'Mở bài Task 2',
    stage: 'stage2',
    why: 'Khung mở bài dùng được cho MỌI đề Task 2. Gõ tới khi bật ra được không cần nghĩ.',
    text:
      'It is sometimes argued that young people should focus only on subjects that will help them find work. '
      + 'While I accept that practical skills matter, I believe this view is too narrow. This essay will '
      + 'discuss both sides before explaining my own position.',
    watch: ['argued', 'practical', 'believe', 'position'],
  },
  {
    id: 't6',
    title: 'Mô tả xu hướng — Task 1',
    stage: 'stage2',
    why: 'Bộ động từ và trạng từ mô tả xu hướng, xương sống của Task 1 ở mọi band.',
    text:
      'The line graph illustrates how many people travelled by bus, by train and by private car between 1990 '
      + 'and 2020. Overall, private cars replaced buses as the most popular option. Bus numbers fell steadily, '
      + 'dropping to 9.5 million by 2000, whereas train passengers increased throughout the period.',
    watch: ['illustrates', 'steadily', 'whereas', 'throughout'],
  },
  {
    id: 't7',
    title: 'Nối câu và nhượng bộ',
    stage: 'stage2',
    why: 'Although / Despite / However — ba từ bài 4 chỉ ra là người Việt hay dùng sai ngữ pháp.',
    text:
      'Although the cost was high, the project went ahead. Despite the high cost, the council approved it '
      + 'unanimously. The scheme was expensive. However, most residents now say it was worth the money, and '
      + 'nearby shops report higher takings than before.',
    watch: ['Although', 'Despite', 'However,', 'unanimously'],
  },
  {
    id: 't8',
    title: 'Câu trả lời Speaking Part 3',
    stage: 'stage2',
    why: 'Cách nói có mức độ (hedging) — thứ phân biệt band 6.5 với band 5.5.',
    text:
      'It depends largely on the type of work. In manufacturing, machines have clearly reduced the number of '
      + 'hours a person needs to spend. In office work, though, I would say the effect has been the opposite, '
      + 'because email and messaging follow people home.',
    watch: ['depends', 'manufacturing', 'opposite', 'messaging'],
  },

  /* ═════════════ CHẶNG 3 ═════════════ */
  {
    id: 't9',
    title: 'Đoạn thân bài có ví dụ',
    stage: 'stage3',
    why: 'Khuôn đoạn thân đầy đủ: câu chủ đề → giải thích → ví dụ → hệ quả.',
    text:
      'The most persuasive argument concerns cost. Building a new underground line requires enormous capital '
      + 'investment, whereas dedicated bus lanes can be introduced within months at a fraction of the price. '
      + 'Bogota, for instance, transformed its public transport this way without laying a single kilometre of '
      + 'track. Consequently, cities with limited budgets can act far sooner than they assume.',
    watch: ['persuasive', 'enormous', 'dedicated', 'Consequently'],
  },
  {
    id: 't10',
    title: 'Câu phức và mệnh đề rút gọn',
    stage: 'stage3',
    why: 'Đa dạng ngữ pháp mà không gượng — tiêu chí kéo Writing từ 6.0 lên 6.5.',
    text:
      'Students living in halls of residence report fewer difficulties than those renting privately, largely '
      + 'because rent is fixed in advance. The report, published in 2020, also found that having a guaranteed '
      + 'room reduces the anxiety commonly experienced in the first term, which in turn improves attendance.',
    watch: ['residence', 'privately', 'guaranteed', 'anxiety'],
  },

  /* ═════════════ CHẶNG 4 ═════════════ */
  {
    id: 't11',
    title: 'Đoạn văn học thuật band 7+',
    stage: 'stage4',
    why: 'Câu dài nhưng vẫn rõ, cách nói giảm nhẹ chính xác — đúng thứ chấm ở band 7.0–7.5.',
    text:
      'While the evidence linking screen time to poor concentration is often presented as conclusive, the '
      + 'picture is considerably more complicated. Much of the research is correlational, and it is entirely '
      + 'plausible that children who already struggle to concentrate are simply more likely to be given a '
      + 'device. This does not mean the concern is misplaced, but it does suggest that confident claims about '
      + 'causation are premature.',
    watch: ['conclusive', 'correlational', 'plausible', 'premature'],
  },
  {
    id: 't12',
    title: 'Kết bài có lập trường rõ',
    stage: 'stage4',
    why: 'Kết bài band cao: nhắc lại lập trường bằng từ khác và nêu điều kiện, không thêm ý mới.',
    text:
      'On balance, the advantages of the policy appear to outweigh its drawbacks, provided that the revenue '
      + 'raised is visibly reinvested in public transport. Without that condition, the measure risks being '
      + 'perceived as a tax on the poorest drivers rather than a genuine attempt to reduce congestion, and '
      + 'public support would be unlikely to last.',
    watch: ['outweigh', 'provided that', 'perceived', 'genuine'],
  },
];
