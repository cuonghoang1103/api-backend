/**
 * Đề 0 — SÀNG LỌC 10 phút của TEST ĐẦU VÀO (docs/ielts-lo-trinh-0-8.md mục 4.3). TỰ SOẠN 12/11/2026.
 * Câu 1–25: MCQ ngữ pháp + từ vựng, 5 câu/mức A1 · A2 · B1 · B1+ · B2 (bám bảng G01–G44 / V-D mục 2.1–2.2; `mucCau`).
 * Câu 26–30: TFNG trên đoạn ~120 từ. Dưới 10/30 ⇒ dừng, xếp Tập 1 Ngày 1 (luật xếp lớp #1).
 * Mỗi câu có `vi` giải thích vì sao đúng và các phương án kia sai ở đâu. MCQ ngữ pháp không có `ev` (không bám bài đọc);
 * TFNG có `ev` nguyên văn.
 */
import type { DeSangLoc } from './types';

export const SANGLOC_00: DeSangLoc = {
  id: 'sangloc-00',
  kyNang: 'sangloc',
  ten: 'Placement Test — 10-minute screening',
  boDe: 'CuongThai Placement Test',
  capDo: 'Band 4.0 → 8.0 (bậc thang)',
  moTa: '25 câu ngữ pháp + từ vựng A1 → B2 · 5 câu True/False/Not Given trên đoạn đọc ngắn',
  phut: 10,
  phan: [
    {
      so: 1,
      tieuDe: 'Screening — grammar, vocabulary and a short reading',
      gioiThieu: 'You have **10 minutes**. Questions 1–25 test grammar and vocabulary; Questions 26–30 are based on the short passage below. Answer as many as you can — the questions get harder as you go.',
      doan: [
        { s: 'Every other Saturday, the hall behind Marlow Street church fills with broken toasters, torn jackets and bicycles with flat tyres. This is the town\'s Repair Café, started three years ago by two retired engineers who were tired of seeing useful things thrown away. Visitors bring an item, sit down with a volunteer and learn to fix it themselves; the volunteers give advice and lend tools, but they never do the whole job on their own. There is no charge, although most people leave a small donation, which pays for tea, coffee and spare parts. Last year the café repaired more than six hundred items, and the organisers estimate that about four out of five things brought in were saved. They now hope to open a second café on the other side of town.' },
      ],
      nhom: [
        {
          id: 'sl-mcq', tu: 1, den: 25, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**, to complete each sentence.',
          tieuDe: 'Questions 1–25 — Grammar and vocabulary',
          cau: [
            /* A1 */
            { n: 1, s: 'My brother ___ a doctor.', chon: [{ k: 'A', t: 'am' }, { k: 'B', t: 'is' }, { k: 'C', t: 'are' }, { k: 'D', t: 'be' }] },
            { n: 2, s: 'She ___ to school by bus every day.', chon: [{ k: 'A', t: 'go' }, { k: 'B', t: 'goes' }, { k: 'C', t: 'going' }, { k: 'D', t: 'is go' }] },
            { n: 3, s: 'There ___ three chairs in the room.', chon: [{ k: 'A', t: 'is' }, { k: 'B', t: 'are' }, { k: 'C', t: 'have' }, { k: 'D', t: 'has' }] },
            { n: 4, s: 'I bought ___ apple and some bread.', chon: [{ k: 'A', t: 'a' }, { k: 'B', t: 'an' }, { k: 'C', t: 'the' }, { k: 'D', t: '(no article)' }] },
            { n: 5, s: 'The opposite of "cheap" is ___.', chon: [{ k: 'A', t: 'expensive' }, { k: 'B', t: 'big' }, { k: 'C', t: 'old' }, { k: 'D', t: 'fast' }] },
            /* A2 */
            { n: 6, s: 'Yesterday we ___ a film at home.', chon: [{ k: 'A', t: 'watch' }, { k: 'B', t: 'watching' }, { k: 'C', t: 'watched' }, { k: 'D', t: 'have watched' }] },
            { n: 7, s: 'Look! It ___ outside.', chon: [{ k: 'A', t: 'rain' }, { k: 'B', t: 'rains' }, { k: 'C', t: 'is raining' }, { k: 'D', t: 'rained' }] },
            { n: 8, s: 'This bag is ___ than that one.', chon: [{ k: 'A', t: 'heavy' }, { k: 'B', t: 'heavier' }, { k: 'C', t: 'more heavy' }, { k: 'D', t: 'the heaviest' }] },
            { n: 9, s: 'You ___ wear a helmet when you ride a motorbike. It\'s the law.', chon: [{ k: 'A', t: 'can' }, { k: 'B', t: 'must' }, { k: 'C', t: 'might' }, { k: 'D', t: 'would' }] },
            { n: 10, s: 'I\'m tired. Let\'s ___ a break.', chon: [{ k: 'A', t: 'make' }, { k: 'B', t: 'do' }, { k: 'C', t: 'take' }, { k: 'D', t: 'give' }] },
            /* B1 */
            { n: 11, s: 'I ___ in this city since 2019.', chon: [{ k: 'A', t: 'live' }, { k: 'B', t: 'lived' }, { k: 'C', t: 'have lived' }, { k: 'D', t: 'am living' }] },
            { n: 12, s: 'If it ___ tomorrow, we\'ll stay at home.', chon: [{ k: 'A', t: 'rains' }, { k: 'B', t: 'will rain' }, { k: 'C', t: 'rained' }, { k: 'D', t: 'would rain' }] },
            { n: 13, s: 'She enjoys ___ to music while she works.', chon: [{ k: 'A', t: 'listen' }, { k: 'B', t: 'to listen' }, { k: 'C', t: 'listening' }, { k: 'D', t: 'listened' }] },
            { n: 14, s: 'That\'s the woman ___ car was stolen last week.', chon: [{ k: 'A', t: 'who' }, { k: 'B', t: 'which' }, { k: 'C', t: 'whose' }, { k: 'D', t: 'that' }] },
            { n: 15, s: 'The city\'s population has ___ rapidly over the last ten years.', chon: [{ k: 'A', t: 'raised' }, { k: 'B', t: 'risen' }, { k: 'C', t: 'rose' }, { k: 'D', t: 'arisen' }] },
            /* B1+ */
            { n: 16, s: 'I ___ live in a small village, but now I live in the city.', chon: [{ k: 'A', t: 'used to' }, { k: 'B', t: 'use to' }, { k: 'C', t: 'am used to' }, { k: 'D', t: 'was using to' }] },
            { n: 17, s: 'The new bridge ___ last year by a Spanish company.', chon: [{ k: 'A', t: 'built' }, { k: 'B', t: 'was built' }, { k: 'C', t: 'has built' }, { k: 'D', t: 'is built' }] },
            { n: 18, s: 'It was ___ cold day that we decided not to go out.', chon: [{ k: 'A', t: 'so' }, { k: 'B', t: 'such a' }, { k: 'C', t: 'too' }, { k: 'D', t: 'very' }] },
            { n: 19, s: 'You haven\'t seen my keys, ___?', chon: [{ k: 'A', t: 'have you' }, { k: 'B', t: 'haven\'t you' }, { k: 'C', t: 'did you' }, { k: 'D', t: 'do you' }] },
            { n: 20, s: 'The meeting was ___ because the manager was ill.', chon: [{ k: 'A', t: 'put off' }, { k: 'B', t: 'put up' }, { k: 'C', t: 'put on' }, { k: 'D', t: 'put out' }] },
            /* B2 */
            { n: 21, s: 'If I ___ harder at school, I would have got a better job.', chon: [{ k: 'A', t: 'worked' }, { k: 'B', t: 'had worked' }, { k: 'C', t: 'have worked' }, { k: 'D', t: 'would work' }] },
            { n: 22, s: 'She told me that she ___ the report the day before.', chon: [{ k: 'A', t: 'finishes' }, { k: 'B', t: 'has finished' }, { k: 'C', t: 'had finished' }, { k: 'D', t: 'will finish' }] },
            { n: 23, s: '___ the bad weather, the match went ahead as planned.', chon: [{ k: 'A', t: 'Although' }, { k: 'B', t: 'Despite' }, { k: 'C', t: 'However' }, { k: 'D', t: 'Because of' }] },
            { n: 24, s: 'The lights are off — they ___ gone to bed.', chon: [{ k: 'A', t: 'must have' }, { k: 'B', t: 'needn\'t have' }, { k: 'C', t: 'can\'t have' }, { k: 'D', t: 'would have' }] },
            { n: 25, s: 'The government\'s ___ of a new tax led to widespread protests.', chon: [{ k: 'A', t: 'introduce' }, { k: 'B', t: 'introduction' }, { k: 'C', t: 'introducing' }, { k: 'D', t: 'introduced' }] },
          ],
        },
        {
          id: 'sl-tfng', tu: 26, den: 30, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in the passage?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          tieuDe: 'Questions 26–30 — The Repair Café',
          cau: [
            { n: 26, s: 'The Repair Café takes place once a month.' },
            { n: 27, s: 'The café was set up by people who used to work as engineers.' },
            { n: 28, s: 'Volunteers repair the items while visitors watch.' },
            { n: 29, s: 'Most of the volunteers are retired.' },
            { n: 30, s: 'The organisers would like to open another café.' },
          ],
        },
      ],
    },
  ],

  mucCau: {
    1: 'A1', 2: 'A1', 3: 'A1', 4: 'A1', 5: 'A1',
    6: 'A2', 7: 'A2', 8: 'A2', 9: 'A2', 10: 'A2',
    11: 'B1', 12: 'B1', 13: 'B1', 14: 'B1', 15: 'B1',
    16: 'B1+', 17: 'B1+', 18: 'B1+', 19: 'B1+', 20: 'B1+',
    21: 'B2', 22: 'B2', 23: 'B2', 24: 'B2', 25: 'B2',
  },

  dapAn: {
    /* A1 — G01, G02, G07, G04, V-A1 */
    1: { a: ['B'], vi: 'Chủ ngữ ngôi thứ ba số ít ("My brother") đi với **is**. "am" chỉ dùng với I, "are" với you/we/they, "be" là nguyên mẫu không đứng một mình làm động từ chính.' },
    2: { a: ['B'], vi: 'Hiện tại đơn, chủ ngữ "She" ⇒ thêm -es: **goes**. "go" thiếu -s; "going" cần trợ động từ (is going); "is go" sai hoàn toàn.' },
    3: { a: ['B'], vi: '"three chairs" là số nhiều ⇒ **There are**. "There is" chỉ đi với số ít; "have/has" không dùng trong cấu trúc "there + be".' },
    4: { a: ['B'], vi: '"apple" bắt đầu bằng nguyên âm ⇒ **an** apple. "a" trước phụ âm; "the" khi đã xác định; bỏ mạo từ chỉ với danh từ không đếm được/số nhiều ("some bread").' },
    5: { a: ['A'], vi: 'cheap (rẻ) ↔ **expensive** (đắt). big ↔ small, old ↔ new/young, fast ↔ slow — không liên quan đến giá.' },

    /* A2 — G06, G06, G14, G08, V-D3 */
    6: { a: ['C'], vi: '"Yesterday" ⇒ quá khứ đơn: **watched**. "have watched" (hiện tại hoàn thành) không đi với thời điểm xác định trong quá khứ; "watch"/"watching" không chia thì.' },
    7: { a: ['C'], vi: '"Look!" báo hiệu hành động đang diễn ra ngay lúc nói ⇒ hiện tại tiếp diễn **is raining**. "rains" là thói quen; "rained" là quá khứ.' },
    8: { a: ['B'], vi: 'So sánh hơn với "than": tính từ ngắn "heavy" ⇒ **heavier** (y → ier). "more heavy" sai vì heavy là từ ngắn; "the heaviest" là so sánh nhất, không đi với "than".' },
    9: { a: ['B'], vi: '"It\'s the law" = bắt buộc ⇒ **must**. "can" = có thể; "might" = có lẽ; "would" không diễn tả nghĩa vụ.' },
    10: { a: ['C'], vi: 'Collocation cố định: **take a break** (nghỉ một lát). "make/do/give a break" không phải cụm tự nhiên trong tiếng Anh.' },

    /* B1 — G12, G16, G15, G17, V-D5 */
    11: { a: ['C'], vi: '"since 2019" (từ một mốc trong quá khứ đến nay) ⇒ hiện tại hoàn thành **have lived**. "live" (hiện tại đơn) và "am living" không đi với since; "lived" (quá khứ) ngụ ý đã không còn ở đó.' },
    12: { a: ['A'], vi: 'Điều kiện loại 1: mệnh đề if dùng hiện tại đơn, mệnh đề chính dùng will ⇒ **rains**. Lỗi kinh điển của người Việt là viết "If it will rain".' },
    13: { a: ['C'], vi: '"enjoy" luôn đi với V-ing ⇒ **listening**. Nhóm động từ theo sau bằng gerund: enjoy, finish, avoid, mind, suggest…' },
    14: { a: ['C'], vi: 'Chiếc xe THUỘC VỀ người phụ nữ ⇒ đại từ quan hệ sở hữu **whose**. "who/that" thay chủ ngữ người; "which" thay vật — nhưng ở đây cần sở hữu.' },
    15: { a: ['B'], vi: 'rise – rose – **risen** (tự tăng, nội động từ); "has" + quá khứ phân từ ⇒ risen. "raised" là của raise (nâng cái gì lên, cần tân ngữ); "rose" là quá khứ đơn; "arisen" (nảy sinh) không dùng cho dân số.' },

    /* B1+ — G20, G09, G21, G19, V-D2 */
    16: { a: ['A'], vi: 'Thói quen/trạng thái trong quá khứ nay không còn ⇒ **used to** live. "use to" chỉ đúng sau did/didn\'t; "am used to" + V-ing nghĩa là "quen với"; "was using to" không tồn tại.' },
    17: { a: ['B'], vi: 'Cây cầu bị xây (bởi công ty) + "last year" ⇒ bị động quá khứ đơn **was built**. "built" (chủ động) thì cầu phải là người xây; "has built"/"is built" sai thì.' },
    18: { a: ['B'], vi: '"such + a + adj + danh từ + that" ⇒ **such a** cold day that… "so" chỉ đi với tính từ đứng một mình (so cold that…); "too/very" không tạo cấu trúc kết quả với "that".' },
    19: { a: ['A'], vi: 'Câu hỏi đuôi: mệnh đề chính PHỦ ĐỊNH với "haven\'t" ⇒ đuôi KHẲNG ĐỊNH cùng trợ động từ: **have you**. "did/do you" sai trợ động từ.' },
    20: { a: ['A'], vi: '**put off** = hoãn lại (postpone). put up = dựng/cho ở nhờ; put on = mặc/bật; put out = dập tắt.' },

    /* B2 — G25, G27, G29, G28, G31 */
    21: { a: ['B'], vi: 'Điều kiện loại 3 (giả định trái quá khứ): if + quá khứ hoàn thành, mệnh đề chính would have + V3 ⇒ **had worked**. "worked" là loại 2 (không khớp "would have got").' },
    22: { a: ['C'], vi: 'Tường thuật gián tiếp lùi thì: "I finished the report yesterday" ⇒ she **had finished** the report the day before. "has finished" không lùi thì; "finishes/will finish" sai hẳn.' },
    23: { a: ['B'], vi: 'Sau chỗ trống là CỤM DANH TỪ "the bad weather" ⇒ cần giới từ nhượng bộ **Despite**. "Although" phải đi với mệnh đề (Although the weather was bad); "However" đứng một mình có dấu phẩy; "Because of" ngược nghĩa.' },
    24: { a: ['A'], vi: 'Suy đoán chắc chắn về quá khứ dựa trên bằng chứng (đèn tắt) ⇒ **must have** gone. "can\'t have" = chắc chắn KHÔNG; "needn\'t have" = lẽ ra không cần (việc đã làm mà không cần thiết); "would have" cần điều kiện.' },
    25: { a: ['B'], vi: 'Sau tính từ sở hữu "The government\'s" và trước "of" cần DANH TỪ ⇒ danh hoá **introduction**. Đây là kỹ năng nominalisation của văn phong học thuật (band 7+).' },

    /* TFNG */
    26: { a: ['FALSE'], vi: '"Every other Saturday" = cách một tuần một lần (2 lần/tháng), không phải "once a month" ⇒ **FALSE**.', ev: 'Every other Saturday, the hall behind Marlow Street church fills with broken toasters' },
    27: { a: ['TRUE'], vi: '"started three years ago by two retired engineers" — "retired engineers" = người từng làm kỹ sư ⇒ **TRUE**.', ev: 'started three years ago by two retired engineers' },
    28: { a: ['FALSE'], vi: 'Khách "learn to fix it themselves"; tình nguyện viên "never do the whole job on their own" ⇒ ngược với "volunteers repair while visitors watch" ⇒ **FALSE**.', ev: 'learn to fix it themselves; the volunteers give advice and lend tools, but they never do the whole job on their own' },
    29: { a: ['NOT GIVEN'], vi: 'Bài chỉ nói HAI NGƯỜI SÁNG LẬP là kỹ sư về hưu; không nói gì về tuổi/tình trạng của các tình nguyện viên nói chung ⇒ **NOT GIVEN**. Bẫy: thấy chữ "retired" là chọn TRUE.', ev: 'started three years ago by two retired engineers who were tired of seeing useful things thrown away' },
    30: { a: ['TRUE'], vi: '"They now hope to open a second café on the other side of town" — "would like to open another" = "hope to open a second" ⇒ **TRUE**.', ev: 'They now hope to open a second café on the other side of town.' },
  },
};
