/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 15 (soạn cùng `tap-5/ngay/ngay15.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang3.ts` (TRA_CONG_THUC_CHANG3) và đánh số "K." liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_15: Block[] = [
  { t: 'h', text: '(Ngày 15 · mục 1) Register — mức đích của từng phần thi' },
  {
    t: 'table',
    head: ['Phần thi', 'Mức đích', 'Lệch xuống', 'Lệch lên'],
    rows: [
      ['Writing Task 1', 'formal – trung tính, khách quan', 'went through the roof', 'it is with great interest that we observe'],
      ['Writing Task 2', 'formal vừa đủ, có lập trường', 'kids · a lot of stuff · I reckon', 'in this day and age · a myriad of'],
      ['Speaking Part 1', 'neutral – informal', 'gonna / wanna liên tục', 'moreover · I am of the opinion'],
      ['Speaking Part 3', 'neutral, nhích lên một nấc', 'toàn I think, một câu', 'nói như đọc bài luận'],
    ],
  },
  { t: 'rule', formula: 'Task 1 · Task 2 → formal vừa đủ   ·   Part 1 → neutral – informal   ·   Part 3 → neutral, nhích lên một nấc', vi: 'Không có mức “cao nhất”; chỉ có mức hợp chỗ.' },

  { t: 'h', text: '(Ngày 15 · mục 2) Bảy công tắc ngữ pháp đổi register' },
  {
    t: 'table',
    head: ['Công tắc', 'Informal', 'Formal'],
    rows: [
      ['① Viết tắt', "it's · don't", 'it is · do not'],
      ['② Cụm động từ ↔ động từ đơn', 'find out · put up with · get rid of', 'discover · tolerate · eliminate'],
      ['③ Chủ ngữ', 'I think · you can see', 'It is argued that · It can be seen that · There is a need to'],
      ['④ Động từ ↔ danh hoá', 'People are living longer, so…', 'Rising life expectancy means…'],
      ['⑤ Lượng từ', 'lots of · really · pretty', 'many · a great deal of · considerably · fairly'],
      ['⑥ Từ nối', 'but · so · plus', 'however · therefore · in addition'],
      ['⑦ Kiểu câu', 'câu hỏi tu từ · câu cụt', 'câu trần thuật trọn vẹn'],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: 'It + is / has been + V3 + that + S + V', vi: 'Chủ ngữ phi nhân xưng thay I think / people say.', examples: [{ en: 'It is widely assumed that longer sentences deter crime.', vi: 'Người ta thường cho rằng án dài hơn thì răn đe được tội phạm.' }] },
      { formula: 'There + is / are + N (danh hoá) + giới từ…', vi: 'Thay “we need to… / people want…”.', examples: [{ en: 'There is little evidence that the ban has reduced consumption.', vi: 'Có rất ít bằng chứng cho thấy lệnh cấm đã làm giảm tiêu thụ.' }] },
    ],
  },
  { t: 'rule', formula: 'informal → formal:  viết tắt ✗ · cụm động từ → động từ đơn · I / you → It is V3 that / There is N · S V → N (danh hoá) · lots of → many · but / so → however / therefore', vi: 'Bật cả bảy công tắc về cùng một phía — dừng ở mức người đọc hiểu ngay lần đầu.' },

  { t: 'h', text: '(Ngày 15 · mục 3) “Trang trọng giả” — cụm nên bỏ' },
  {
    t: 'table',
    head: ['Trang trọng giả', 'Viết thế này'],
    rows: [
      ['In this day and age', 'Today · In recent years'],
      ['It goes without saying that…', '(bỏ) · It is generally accepted that…'],
      ['a plethora of / a myriad of', 'a range of · several'],
      ['Every coin has two sides.', 'This development has both benefits and costs.'],
      ['utilise · commence · endeavour', 'use · begin · attempt'],
      ['Last but not least,', 'Finally, · A further consideration is…'],
    ],
  },
  { t: 'rule', formula: 'từ dài chỉ dùng khi nó HẸP NGHĨA hơn từ ngắn  ·  cụm vạn năng → bỏ', vi: 'Band 8 = chính xác + tự nhiên.' },

  { t: 'h', text: '(Ngày 15 · mục 4) Tone — hedge, booster, từ chỉ thái độ' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + tend to / appear to / be likely to + V', vi: 'Hedge bằng động từ.', examples: [{ en: 'The decline appears to be linked to the rise of streaming.', vi: 'Sự sụt giảm có vẻ liên quan tới sự nổi lên của dịch vụ phát trực tuyến.' }] },
      { formula: 'Admittedly, + S + V; + nevertheless, + S + V', vi: 'Nhượng bộ với tone công bằng.', examples: [{ en: 'Admittedly, the scheme is costly; nevertheless, the long-term savings are substantial.', vi: 'Phải thừa nhận chương trình tốn kém; tuy nhiên, khoản tiết kiệm dài hạn là đáng kể.' }] },
      { formula: 'It would be + adj + to V (unwise / naive / premature)', vi: 'Phê bình mạnh nhưng không gắt.', examples: [{ en: 'It would be naive to assume that the market will solve the problem unaided.', vi: 'Sẽ là ngây thơ nếu cho rằng thị trường tự nó giải quyết được vấn đề.' }] },
    ],
  },
  { t: 'rule', formula: 'độ chắc của câu ≤ bằng chứng   ·   một câu — một hedge   ·   lập trường ở kết bài: KHÔNG hedge', vi: 'Hedge cho nguyên nhân, xu hướng, dự đoán; booster cho điều số liệu cho thấy và câu chốt.' },

  { t: 'h', text: '(Ngày 15 · mục 5) Register khi nói — Part 3 nhích lên một nấc' },
  {
    t: 'table',
    head: ['Đặc điểm lời nói', 'Ví dụ'],
    rows: [
      ['Viết tắt', "I'd say · it's · wouldn't"],
      ['Từ mở lời', 'Well, · Actually, · I mean, · To be honest,'],
      ['Từ nối nói', 'that said · mind you · then again · plus · on top of that'],
      ['Lùi lại sửa ý', '…or rather, · what I mean is,'],
    ],
  },
  { t: 'rule', formula: 'Part 3 = Part 1 + hedge (tend to / seem to) + 1 danh từ trừu tượng + 1 câu phức  —  vẫn viết tắt, vẫn từ nối nói', vi: 'Nhích lên một nấc; nói như bài luận là lệch lên hai nấc.' },

  { t: 'h', text: '(Ngày 15 · mục 6) Lệch register trong một câu — lượt soát thứ bảy' },
  { t: 'rule', formula: 'soát register: người (kids → children) · lượng (a bunch of → a number of) · get / do / make → động từ chính xác · pretty / super → rather / highly · thing → factor / issue / aspect', vi: 'Đọc lướt bài Task 2 tìm đúng năm loại chữ này.' },

  { t: 'h', text: '(Ngày 15 · mục 7) Lời đề nghị trong công việc — ba mức' },
  {
    t: 'patterns',
    rows: [
      { formula: 'Can you + V…?', vi: 'Bạn bè, đồng đội thân.', examples: [{ en: 'Can you send me the log file?', vi: 'Gửi tớ tệp log được không?' }] },
      { formula: 'Could you + V…? / Would you mind + V-ing…?', vi: 'Đồng nghiệp, cấp trên trực tiếp.', examples: [{ en: 'Would you mind moving our call to three o\'clock?', vi: 'Chị có phiền dời cuộc gọi của mình sang ba giờ không?' }] },
      { formula: 'I was wondering if + S + could + V / I would be grateful if + S + could + V', vi: 'Khách hàng, việc khó nhờ.', examples: [{ en: 'I would be grateful if you could confirm the delivery date in writing.', vi: 'Tôi rất biết ơn nếu quý công ty xác nhận ngày giao hàng bằng văn bản.' }] },
    ],
  },
  { t: 'rule', formula: 'Can you…?  →  Could you…? / Would you mind V-ing…?  →  I was wondering if you could… / I would be grateful if you could…', vi: 'Càng lùi thì, càng dài, càng gián tiếp ⇒ càng lịch sự.' },

  { t: 'h', text: '(Ngày 15 · Đọc mục 2–3) Matching information + matching features — quy trình và “ý của ai”' },
  { t: 'rule', formula: 'đọc 1 lần + bản đồ đoạn (chức năng · tên · ✗)  →  features trước  →  information sau  →  soát NB', vi: 'Mỗi câu hỏi chỉ quay lại đúng MỘT đoạn.' },
  { t: 'rule', formula: 'For X, … / X argued that … = ý của X   ·   Y observed / pointed out / replied that … = ý của Y (phản bác)   ·   it must be said / though = tác giả', vi: 'Ý phản bác nằm TRONG đoạn nói về X vẫn là ý của Y.' },

  { t: 'h', text: '(Ngày 15 · Nói mục 2) Thang năm nấc phản đối' },
  {
    t: 'table',
    head: ['Nấc', 'Khung câu'],
    rows: [
      ['① Đồng ý một phần', "That's true up to a point, but… · There's something in that, though…"],
      ['② Nghi ngờ nhẹ', "I'm not sure it's quite that simple. · I'd be a bit wary of saying that."],
      ['③ Phản bác có lý do', "I see it rather differently. · I'd actually argue the opposite."],
      ['④ Kiên quyết, lịch sự', "I'm afraid I really can't agree with that. · I'd have to disagree there."],
    ],
  },
  {
    t: 'patterns',
    rows: [
      { formula: "It's not so much + N / that + S + V + as + N / that + S + V", vi: 'Sửa trọng tâm thay vì bác thẳng.', examples: [{ en: "It's not so much a question of money as of priorities.", vi: 'Đây không hẳn là chuyện tiền, mà là chuyện ưu tiên.' }] },
      { formula: 'If anything, + S + V', vi: 'Lật ngược nhẹ nhàng.', examples: [{ en: 'If anything, young people are more polite online than their parents are.', vi: 'Có chăng thì người trẻ còn lịch sự trên mạng hơn cha mẹ họ.' }] },
    ],
  },
  { t: 'rule', formula: 'công nhận (I take your point / That\'s true up to a point)  +  but / though  +  ý của bạn  +  lý do', vi: 'Part 3: nấc ①–③ là đủ; nấc ④ khi bị đẩy lần hai.' },

  { t: 'h', text: '(Ngày 15 · Nói mục 5) Thương lượng trong công việc — năm bước' },
  {
    t: 'patterns',
    rows: [
      { formula: 'If + S + could + V, + S + would be able to + V', vi: 'Đề xuất có điều kiện.', examples: [{ en: "If you could push the deadline to Monday, I'd be able to include the test results.", vi: 'Nếu anh lùi hạn sang thứ Hai, tôi có thể đưa cả kết quả kiểm thử vào.' }] },
      { formula: 'Suppose / What if + S + V-ed…?', vi: 'Thả một phương án để thăm dò.', examples: [{ en: 'What if we released it to ten per cent of users first?', vi: 'Hay là mình phát hành cho mười phần trăm người dùng trước?' }] },
      { formula: 'Would it help if + S + V-ed…?', vi: 'Đề nghị một nhượng bộ nhỏ.', examples: [{ en: 'Would it help if I joined the call to answer technical questions?', vi: 'Liệu có đỡ hơn không nếu tôi tham gia cuộc gọi để trả lời câu hỏi kỹ thuật?' }] },
      { formula: "I'd rather + S + V-ed", vi: 'Nêu điều muốn tránh mà không ra lệnh.', examples: [{ en: "I'd rather we didn't promise a date until the tests are done.", vi: 'Tôi mong mình đừng hứa ngày nào cho tới khi kiểm thử xong.' }] },
    ],
  },
  { t: 'rule', formula: 'công nhận → What worries me is + sự kiện → If you could…, I\'d be able to… → Would that work for you? → I\'ll put it in writing', vi: 'Từ chối một PHẦN và luôn kèm một phương án.' },
];
