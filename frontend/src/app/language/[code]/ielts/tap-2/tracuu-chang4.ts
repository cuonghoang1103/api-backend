/**
 * Tra cứu công thức — CHẶNG 4 của IELTS Tập 2 (Ngày 19–24). Soạn 12/11/2026 cùng các tệp `ngay/ngay19..24.ts`.
 *
 * Mảng khối (`Block[]`) để người ghép `tracuu.ts` nối vào `TRA_CONG_THUC_T2.blocks` — tệp này KHÔNG tự đăng ký vào
 * khoá (không sửa tracuu.ts theo phân công). Mỗi mục = một `h` "(Ngày N · mục M)" + `patterns` / `table` + `rule`,
 * chép (rút gọn) từ khối cùng tên trong bài ngày đó — sửa bài ngày thì sửa luôn ở đây.
 * Chỉ `import type` — script mục lục chạy Node thuần.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC_CHANG4: Block[] = [
  /* ── Ngày 19 ── */
  { t: 'h', text: 'Câu hỏi Yes/No và Wh- — hỏi chủ ngữ không mượn do (Ngày 19 · mục 1–2)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'Trợ động từ (be / do / does / did / have / modal) + S + V …?',
        vi: 'Yes/No: đưa trợ động từ lên đầu; không có thì mượn do/does/did và trả V về nguyên mẫu.',
        examples: [
          { en: 'Does your brother play any sports?', vi: 'Anh bạn có chơi môn thể thao nào không?' },
          { en: 'Have you ever tried rock climbing?', vi: 'Bạn đã bao giờ thử leo núi đá chưa?' },
        ],
      },
      {
        formula: 'Wh- + trợ động từ + S + V …? · Who / What / Which + V (hỏi chủ ngữ)?',
        vi: 'Wh- = từ để hỏi + câu hỏi Yes/No; khi từ để hỏi là chủ ngữ thì giữ trật tự câu kể.',
        examples: [
          { en: 'How often do you go to the cinema?', vi: 'Bao lâu bạn đi xem phim một lần?' },
          { en: 'Who won the match?', vi: 'Ai đã thắng trận đấu?' },
        ],
      },
    ],
  },
  { t: 'rule', formula: 'Aux + S + V? → Yes, S + aux. / No, S + aux + n\'t. · Wh- + aux + S + V? · Who / What + V?', vi: 'Không viết tắt (I\'m, he\'s…) trong câu trả lời ngắn khẳng định: Yes, I am (không ~~Yes, I\'m~~).' },

  { t: 'h', text: 'Câu hỏi gián tiếp (Ngày 19 · mục 3)' },
  {
    t: 'table',
    head: ['Câu hỏi trực tiếp', 'Câu hỏi gián tiếp'],
    rows: [
      ['Where **is the changing room**?', 'Could you tell me where **the changing room is**?'],
      ['What time **does the pool open**?', 'Do you know what time **the pool opens**?'],
      ['**Is** the course **full**?', 'Could you tell me **if / whether** the course **is full**?'],
      ['Why **did they cancel** the race?', 'I\'d like to know why **they cancelled** the race. (dấu chấm)'],
    ],
  },
  { t: 'rule', formula: 'Could you tell me / Do you know + Wh- / if / whether + S + V …? · I wonder / I\'m not sure + Wh- / if + S + V .', vi: 'Sau câu mở đầu là thứ tự câu kể — không đảo, không do/does/did.' },

  { t: 'h', text: 'Question tags — câu hỏi đuôi (Ngày 19 · mục 4)' },
  {
    t: 'table',
    head: ['Câu', 'Đuôi'],
    rows: [
      ['You **play** volleyball,', '**don\'t you?**'],
      ['He **can\'t** swim,', '**can he?**'],
      ['**I am** right,', '**aren\'t I?**'],
      ['**Let\'s** go,', '**shall we?**'],
      ['**There is** a café nearby,', '**isn\'t there?**'],
      ['She **never** complains,', '**does she?** (never = phủ định)'],
      ['**Everyone** enjoyed it,', '**didn\'t they?**'],
    ],
  },
  { t: 'rule', formula: 'Câu khẳng định, aux + n\'t + đại từ? · Câu phủ định, aux + đại từ? · Trả lời theo SỰ THẬT: “You aren\'t busy, are you?” — không bận → No, I\'m not.', vi: 'Đuôi lặp lại đúng trợ động từ, đổi dấu, chủ ngữ thành đại từ; xuống giọng = xác nhận, lên giọng = hỏi thật.' },

  { t: 'h', text: 'Listening Part 4 — đọc giới hạn số từ (Ngày 19 Nghe · mục 2)' },
  {
    t: 'table',
    head: ['Lời dẫn', 'Được', 'Không được'],
    rows: [
      ['ONE WORD ONLY', 'erosion', '~~soil erosion~~ · ~~the erosion~~'],
      ['NO MORE THAN TWO WORDS', 'other side', '~~the other side~~ (3 từ)'],
      ['NO MORE THAN TWO WORDS AND/OR A NUMBER', '24 · about 100 kilometres', '~~more than 100 kilometres~~'],
    ],
  },
  { t: 'rule', formula: 'Giới hạn từ → loại từ (N / adj / số) → paraphrase → chính tả + số ít/nhiều → đọc lại cả dòng', vi: 'Mạo từ cũng tính là một từ; từ gạch nối tính là một từ; số viết bằng chữ số.' },

  { t: 'h', text: 'Speaking Part 2 — đề hoạt động (Ngày 19 Nói · mục 1)' },
  { t: 'rule', formula: 'I\'d like to talk about + V-ing / N. · I + V(s) + tần suất. · I started + V-ing + when … · I\'ve + V3 + for / since … · Let me give you an example. · What I enjoy most is … · That\'s why …', vi: 'Ba thì: thói quen (hiện tại đơn) · lúc bắt đầu (quá khứ) · đã bao lâu (HTHT) + một câu chuyện cụ thể.' },

  /* ── Ngày 20 ── */
  { t: 'h', text: 'play / go / do · win / beat (Ngày 20 · mục 2)' },
  { t: 'rule', formula: 'play + N (bóng, đối kháng, trò chơi) · go + V-ing (di chuyển) · do + N (tập luyện, võ) · win + match / prize / medal · beat + opponent', vi: '~~play yoga~~ → do yoga · ~~go to swim~~ → go swimming · ~~won Thailand~~ → beat Thailand.' },

  { t: 'h', text: 'Reading — Yes / No / Not Given (Ngày 20 Đọc · mục 1–3)' },
  {
    t: 'table',
    head: ['Đáp án', 'Nghĩa là'],
    rows: [
      ['**YES**', 'Câu đề khớp quan điểm của tác giả.'],
      ['**NO**', 'Câu đề mâu thuẫn quan điểm của tác giả (có câu nói ngược).'],
      ['**NOT GIVEN**', 'Không thể biết tác giả nghĩ gì về điều đó.'],
    ],
  },
  { t: 'rule', formula: 'Ý người khác (Some people / Critics claim …) → đọc câu sau → tác giả đồng ý (YES) · bác bỏ (NO) · im lặng (NOT GIVEN). Phép thử: câu đề đúng thì có câu nào của tác giả bị sai không? Có → NO.', vi: 'Năm bẫy: ý người khác · all / some · so sánh bài không làm · trùng từ khác nghĩa · should ≠ thực tế.' },

  { t: 'h', text: 'Writing Task 1 — process diagram (Ngày 20 Viết · mục 2)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'S + is / are + V3 (+ by machine / by hand) (+ for / at / in …).',
        vi: 'Mỗi bước một câu bị động hiện tại đơn (quy trình nhân tạo).',
        examples: [{ en: 'The paste is mixed slowly for 30 to 40 minutes.', vi: 'Hỗn hợp được trộn chậm trong 30–40 phút.' }],
      },
      {
        formula: 'After being V3, S + is / are + V3. · Once S + has / have been V3, S + is / are + V3.',
        vi: 'Gộp hai bước — câu phức dễ nhất cho bài quy trình.',
        examples: [{ en: 'Once the oil has been separated, it is stored in tanks.', vi: 'Khi dầu đã được tách, nó được chứa trong bồn.' }],
      },
    ],
  },
  { t: 'rule', formula: 'Overall, there are + số + stages in the process, which begins with … and ends with … · First … Next … Following this … Finally … · Chu trình tự nhiên: chủ động (eggs hatch into larvae)', vi: 'Tổng quan = số bước + đầu – cuối; không ý kiến, không chép nhãn.' },

  /* ── Ngày 21 ── */
  { t: 'h', text: 'used to / would — thói quen ngày xưa (Ngày 21 · mục 2–3)' },
  {
    t: 'table',
    head: ['Loại ý', 'used to', 'would', 'quá khứ đơn'],
    rows: [
      ['Hành động lặp lại', '✓', '✓', '✓'],
      ['Trạng thái (be, have, live, like…)', '✓', '✗', '✓'],
      ['Việc một lần / có số lần cụ thể', '✗', '✗', '✓'],
    ],
  },
  { t: 'rule', formula: 'S + used to + V · S + didn\'t use to + V · Did + S + use to + V? · (≠ be / get used to + V-ing = quen / dần quen với)', vi: 'used to chỉ có ở quá khứ; would kể tiếp hành động lặp lại sau khi đã có bối cảnh.' },

  { t: 'h', text: 'Quá khứ tiếp diễn + when / while (Ngày 21 · mục 4–5)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'S + was / were + V-ing + when + S + V2.',
        vi: 'Việc dài đang diễn ra bị việc ngắn cắt ngang.',
        examples: [{ en: 'I was walking home when it started to rain.', vi: 'Tôi đang đi bộ về thì trời mưa.' }],
      },
      {
        formula: 'While + S + was / were + V-ing, S + V2 / was / were + V-ing.',
        vi: 'while + việc dài; hai việc dài song song đều tiếp diễn.',
        examples: [{ en: 'While I was studying, my brother was playing video games.', vi: 'Trong lúc tôi học thì em tôi chơi game.' }],
      },
    ],
  },
  { t: 'rule', formula: 'Việc dài: was / were + V-ing (while) · việc ngắn: V2 (when) · When + V2, V2 = nối tiếp · know / like / want không chia tiếp diễn', vi: 'When I arrived, they were having dinner (đang ăn dở) ≠ they had dinner (đến rồi mới ăn).' },

  { t: 'h', text: 'Speaking Part 3 — so sánh quá khứ – hiện tại (Ngày 21 Nói · mục 2)' },
  { t: 'rule', formula: 'In the past / Back in my grandparents\' day, people used to + V …, whereas these days they + V(s) / … has become … This is mainly because … Take my own family, for example. On the whole, I\'d say …', vi: 'Then → Now → Why → Example → Evaluate.' },

  /* ── Ngày 22 ── */
  { t: 'h', text: 'Từ vựng gia đình — khung câu ăn điểm (Ngày 22 · mục 4)' },
  { t: 'rule', formula: 'N + play(s) a key role in + V-ing · V-ing + strengthens + N, but it can also lead to + N · S + tend to + V · I get on well with … · I take after … · I was brought up by …', vi: 'Khung câu Task 2 / Part 3 chủ đề gia đình – thế hệ.' },

  { t: 'h', text: 'Reading — Diagram label completion (Ngày 22 Đọc · mục 1)' },
  { t: 'rule', formula: 'Đọc sơ đồ (nhãn mỏ neo, mũi tên) → đoán loại từ → tìm đoạn mô tả → khớp bằng từ vị trí (on top of · beside · beneath · attached to · flows into) → chép đúng chính tả, đúng giới hạn từ', vi: 'Thông tin thường gọn trong 1–2 đoạn; thứ tự câu hỏi có thể không theo bài.' },

  { t: 'h', text: 'Writing Task 1 — map trước / sau (Ngày 22 Viết · mục 2)' },
  {
    t: 'table',
    head: ['Mốc thời gian', 'Thì', 'Ví dụ'],
    rows: [
      ['Hai năm đều đã qua (2000 – 2020)', 'quá khứ đơn bị động', 'The market **was replaced by** a shopping centre.'],
      ['Năm sau là today / now', 'HTHT bị động', 'A new library **has been built**.'],
      ['Không đổi (mọi trường hợp)', 'chủ động', 'The park **remained** unchanged. (~~was remained~~)'],
    ],
  },
  { t: 'rule', formula: 'In [year], the [vị trí] was + N, but … it was + V3 (replaced by / converted into / relocated to / demolished / extended) · N + remained (unchanged)', vi: 'Chia thân bài theo vùng (bắc / nam); tổng quan = xu hướng chung.' },

  /* ── Ngày 23 ── */
  { t: 'h', text: 'too / enough / so / such / quite (Ngày 23 · mục 1–4)' },
  {
    t: 'patterns',
    rows: [
      {
        formula: 'too + adj (+ for sb) + to V · adj + enough + to V · enough + N',
        vi: 'too = quá mức (hệ quả xấu); enough đứng sau tính từ, trước danh từ.',
        examples: [
          { en: 'The water was too cold to swim in.', vi: 'Nước lạnh quá, không bơi được.' },
          { en: 'She isn\'t old enough to vote.', vi: 'Cô ấy chưa đủ tuổi bầu cử.' },
        ],
      },
      {
        formula: 'so + adj / adv (+ that …) · such (a / an) + adj + N (+ that …)',
        vi: 'so + tính từ đứng một mình; such + cụm danh từ.',
        examples: [
          { en: 'It was such a hot day that we stayed indoors.', vi: 'Hôm đó nóng đến nỗi chúng tôi ở trong nhà.' },
          { en: 'The pho here is so good!', vi: 'Phở ở đây ngon quá! (khen — không dùng too)' },
        ],
      },
    ],
  },
  { t: 'rule', formula: 'not … at all < a bit < fairly < quite < rather / pretty < very < extremely · quite a / an + adj + N', vi: '~~too delicious~~ (khen) → so delicious · ~~enough old~~ → old enough · ~~such beautiful~~ → so beautiful.' },

  { t: 'h', text: 'Ôn tổng ngữ pháp Tập 2 — 12 điểm (Ngày 23 · mục 5)' },
  {
    t: 'table',
    head: ['#', 'Điểm (Ngày)', 'Công thức chốt'],
    rows: [
      ['1', 'Mạo từ (N1)', 'a / an lần đầu · the lần hai, duy nhất · Ø nói chung'],
      ['2', 'Giới từ (N3)', 'at + giờ · on + ngày · in + tháng / năm · depend on'],
      ['3', 'HTHT vs QKĐ (N5)', 'has / have + V3 (for, since, ever) · V2 + thời điểm xác định'],
      ['4', 'Tương lai (N7)', 'will · be going to · hiện tại tiếp diễn (đã hẹn)'],
      ['5', 'So sánh (N9)', '-er / more … than · the -est / most · as … as · much + so sánh hơn'],
      ['6', 'V-ing / to V (N11)', 'enjoy / avoid + V-ing · want / decide + to V · giới từ + V-ing'],
      ['7', 'Điều kiện 0 & 1 (N13)', 'If + hiện tại, hiện tại / will + V · unless = if … not'],
      ['8', 'Mệnh đề quan hệ (N15)', 'who · which · that · whose + N · where + S + V'],
      ['9', 'Từ nối (N17)', 'Although + S + V, S + V · However / Therefore, + câu mới'],
      ['10', 'Câu hỏi & đuôi (N19)', 'Could you tell me + wh- + S + V? · đuôi đúng aux'],
      ['11', 'used to / would; QK tiếp diễn (N21)', 'used to + V · would + V · was / were + V-ing when + V2'],
      ['12', 'too / enough / so / such (N23)', 'too + adj + to V · adj + enough · so + adj · such a + adj + N'],
    ],
  },

  { t: 'h', text: 'Speaking Part 2 — đề trừu tượng (Ngày 23 Nói · mục 2)' },
  { t: 'rule', formula: 'At …, we had to / weren\'t allowed to + V. · The rule was introduced to + V. · I still remember one day when … · I disliked it because … · They should + V / It would be fairer if …', vi: 'Biến ý trừu tượng thành MỘT cảnh cụ thể: ai · ở đâu · lúc nào · chuyện gì.' },

  /* ── Ngày 24 ── */
  { t: 'h', text: 'Reading 60 phút — chiến thuật (Ngày 24 Đọc · mục 1)' },
  { t: 'rule', formula: 'Passage 1: 17 phút · Passage 2: 20 phút · Passage 3: 23 phút (20 làm + 3 phút cuối điền hết ô trống) · kẹt > 90 giây → bỏ qua', vi: 'Thi giấy KHÔNG có thêm giờ chép phiếu Reading; sai không bị trừ điểm.' },

  { t: 'h', text: 'Writing — 12 lỗi mất điểm oan (Ngày 24 Viết · mục 1)' },
  {
    t: 'table',
    head: ['#', 'Lỗi'],
    rows: [
      ['1–2', 'Thiếu số từ · lạc đề / trả lời thiếu phần'],
      ['3–4', 'Chép nguyên câu đề · bài học thuộc'],
      ['5–6', 'Task 1 thiếu overview · Task 1 đưa ý kiến / lý do'],
      ['7–8', 'Task 2 quan điểm mâu thuẫn · không chia đoạn'],
      ['9–10', 'Gạch đầu dòng, đánh số · văn nói, viết tắt'],
      ['11–12', 'Sai phân bổ 20 / 40 phút · không soát bài 3 phút'],
    ],
  },

  { t: 'h', text: 'Email công việc — formal / informal (Ngày 24 Viết · mục 2)' },
  {
    t: 'table',
    head: ['Chức năng', 'Formal', 'Informal'],
    rows: [
      ['Chào', 'Dear Ms Mai, / Dear Sir or Madam,', 'Hi Minh,'],
      ['Lý do viết', 'I am writing to enquire about …', 'Just a quick email to let you know …'],
      ['Đề nghị', 'I would be grateful if you could … / Would it be possible to …?', 'Could you …?'],
      ['Gửi kèm', 'Please find attached …', 'I\'ve attached …'],
      ['Kết', 'I look forward to hearing from you. Kind regards, / Yours sincerely, / Yours faithfully,', 'Speak soon! · Cheers,'],
    ],
  },
  { t: 'rule', formula: 'Subject → Dear + Mr / Ms + tên, → I am writing to + V … → nội dung + I would be grateful if you could … → I look forward to hearing from you. Kind regards, + tên', vi: 'Chọn văn phong theo người nhận và giữ suốt email.' },
];
