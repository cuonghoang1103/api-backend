/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 9 (soạn cùng `tap-5/ngay/ngay9.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang2.ts` (TRA_CONG_THUC_CHANG2) và đánh số "K." liên tục cả chặng.
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_9: Block[] = [
  { t: 'h', text: '(Ngày 9 · mục 2) Song song — danh sách nối bằng and / or / but' },
  {
    t: 'patterns',
    rows: [
      { formula: 'S + V + N, N and N', vi: 'Các vế cùng loại từ, cùng dạng.', examples: [{ en: 'The scheme requires funding, trained staff and public support.', vi: 'Chương trình cần kinh phí, nhân viên được đào tạo và sự ủng hộ của công chúng.' }] },
      { formula: 'S + V + by + V-ing, V-ing and V-ing', vi: 'Ba V-ing sau một giới từ.', examples: [{ en: 'Cities can cut emissions by taxing fuel, expanding rail and restricting parking.', vi: 'Các thành phố có thể cắt giảm khí thải bằng cách đánh thuế nhiên liệu, mở rộng đường sắt và hạn chế chỗ đỗ xe.' }] },
      { formula: 'S + V + that + S + V and that + S + V', vi: 'Nhắc lại that khi vế dài.', examples: [{ en: 'Critics argue that the tax is unfair and that it will be difficult to collect.', vi: 'Những người phê bình cho rằng thuế này không công bằng và sẽ khó thu.' }] },
    ],
  },
  { t: 'rule', formula: 'A, B and C  →  cùng loại từ, cùng dạng   ·   kiểm: [phần đứng trước] + từng vế phải thành câu', vi: 'Lỗi hay nằm ở vế đứng ngay sau and.' },

  { t: 'h', text: '(Ngày 9 · mục 3) Song song — cặp liên từ tương quan' },
  {
    t: 'table',
    head: ['Cặp', 'Ví dụ đúng', 'Lỗi hay gặp'],
    rows: [
      ['not only X but also X', 'The policy not only reduces costs but also improves safety.', '~~…but also it improves…~~'],
      ['either X or X', 'reduced either by raising taxes or by cutting spending / by either raising taxes or cutting spending', '~~either pay by card or cash~~'],
      ['both X and X', 'in both cities and rural areas', '~~both in cities and rural areas~~'],
      ['not X but X', 'lies not in the law itself but in the way it is enforced', '~~not by the weather but the airline made an error~~'],
      ['X rather than X · would rather V than V', 'choose to rent rather than (to) buy', '~~would rather resign than to accept~~'],
    ],
  },
  { t: 'rule', formula: 'not only X but also X   ·   either X or X   ·   both X and X   ·   not X but X   →   X cùng dạng; giới từ: ngoài cặp thì chung, trong cặp thì nhắc lại', vi: 'Soát chữ đứng ngay sau mỗi nửa của cặp. Not only đứng đầu câu ⇒ đảo ngữ.' },

  { t: 'h', text: '(Ngày 9 · mục 4) Song song trong so sánh — that of / those in' },
  {
    t: 'table',
    head: ['Sai', 'Đúng'],
    rows: [
      ['~~The population of Japan is older than Vietnam.~~', 'The population of Japan is older than that of Vietnam.'],
      ['~~Salaries in banking are higher than teaching.~~', 'Salaries in banking are higher than those in teaching.'],
      ['~~Studying in a group is more effective than to study alone.~~', 'Studying in a group is more effective than studying alone.'],
      ['~~Compared with 2010, sales were 20% higher.~~', 'Compared with the 2010 figure, sales were 20% higher. / Sales were 20% higher than in 2010.'],
      ['~~Unlike France, the birth rate in Italy fell.~~', 'Unlike that of France, the birth rate in Italy fell. / Unlike France, Italy saw its birth rate fall.'],
    ],
  },
  { t: 'rule', formula: 'N of A + be + adj-er than + that / those of B   ·   V-ing … than + V-ing   ·   A + V + more … in X than in Y', vi: 'Hai bên than / as / compared with / unlike phải là hai thứ cùng loại.' },

  { t: 'h', text: '(Ngày 9 · mục 5) Nhắc lại từ nhỏ khi vế dài: that · to · giới từ · mạo từ' },
  { t: 'rule', formula: 'vế ngắn, sát nhau → lược được   ·   vế dài / dễ hiểu nhầm → nhắc lại that · to · giới từ · mạo từ', vi: 'interested in and good at statistics — mỗi tính từ đúng giới từ của nó. Khi đọc: gapping (Judges must decide…, governments [must decide] which research…).' },

  { t: 'h', text: '(Ngày 9 · mục 6) Chủ ngữ treo — bảy kiểu mở đầu câu' },
  {
    t: 'table',
    head: ['Kiểu mở đầu', 'Sai (treo)', 'Sửa'],
    rows: [
      ['V-ing', '~~Walking through the old quarter, the houses seemed smaller.~~', 'Walking through the old quarter, I found the houses smaller.'],
      ['V3', '~~Opened in 1902, thousands of tourists cross the bridge.~~', 'Opened in 1902, the bridge is crossed by thousands of tourists.'],
      ['To + V (mục đích)', '~~To get a high band score, grammar must be accurate.~~', 'To get a high band score, candidates must use accurate grammar.'],
      ['As + N', '~~As a final-year student, the library is my second home.~~', 'As a final-year student, I treat the library as my second home.'],
      ['After / While + V-ing', '~~After finishing the interviews, the data were analysed.~~', 'After finishing the interviews, we analysed the data.'],
      ['Unlike / Like + N', '~~Unlike most cities, the centre of Hoi An has no tall buildings.~~', 'Unlike most cities, Hoi An has no tall buildings in its centre.'],
      ['At the age of…', '~~At the age of six, my family moved to Da Nang.~~', 'When I was six, my family moved to Da Nang.'],
    ],
  },
  { t: 'rule', formula: '[V-ing / V3 / To V / As a N / After V-ing / Unlike N / At the age of…] ,  + S (= người / vật làm việc ở cụm mở đầu) + V', vi: 'Được chấp nhận (trạng ngữ cố định): Generally speaking, Considering…, Given…, Judging by…, To be fair, To sum up.' },

  { t: 'h', text: '(Ngày 9 · mục 7) Bổ ngữ đặt sai chỗ' },
  { t: 'rule', formula: 'only / almost / nearly / even  +  ngay trước từ được giới hạn   ·   mệnh đề quan hệ  +  ngay sau danh từ nó tả   ·   , which mơ hồ → , a decision / a move that …', vi: 'He failed almost every exam ≠ He almost failed every exam.' },

  { t: 'h', text: '(Ngày 9 · mục 8) Câu dài vẫn rõ — bốn phép thử và dấu câu' },
  {
    t: 'table',
    head: ['Dấu', 'Dùng khi', 'Ví dụ'],
    rows: [
      [', + and / but / so', 'nối hai mệnh đề độc lập (dấu phẩy một mình = comma splice)', 'Rents are rising, and many young people cannot afford to move out.'],
      [';', 'hai mệnh đề độc lập có quan hệ chặt; trước however / therefore', 'The plan is popular; however, it is expensive.'],
      ['; song song', 'hai vế cùng khung đặt cạnh nhau', 'In theory, the scheme is voluntary; in practice, few employees feel able to refuse.'],
      [':', 'vế sau giải thích / liệt kê; vế trước là câu hoàn chỉnh', 'There are three reasons: cost, time and risk.'],
    ],
  },
  { t: 'rule', formula: 'S gần V  ·  1 cụm mở đầu  ·  ≤ 2 tầng phụ  ·  ý mới ở cuối   +   [câu] ; [câu]   ·   [câu] : [giải thích / danh sách]', vi: 'Câu trên 35 từ mà trượt một phép thử ⇒ tách làm hai, nối bằng This / That / Such + danh từ.' },

  { t: 'h', text: '(Ngày 9 · Bài 2) Mổ đề Reading — năm nhãn nguyên nhân R1–R5 + YNNG + Headings band 8' },
  {
    t: 'table',
    head: ['Nhãn', 'Nguyên nhân', 'Chữa bằng'],
    rows: [
      ['R1', 'không tìm ra chỗ trong bài', 'ghi lề khi đọc; dò theo tên riêng, con số'],
      ['R2', 'tìm đúng chỗ, hiểu sai paraphrase', 'chép cặp “bài viết ↔ câu hỏi”; học khung more X than Y, absurd to…'],
      ['R3', 'rơi bẫy “có nhắc nhưng không phải đáp án”', 'hỏi: chữ này thuộc về ai, cái gì?'],
      ['R4', 'tự suy thêm / kiến thức ngoài bài', 'chỉ được một câu trong bài mới chọn YES / NO'],
      ['R5', 'hết giờ, chính tả, giới hạn từ', 'nhịp 17 – 20 – 23; 2 phút soát cuối'],
    ],
  },
  { t: 'rule', formula: 'YNNG:  ① ý này của AI?  →  ② chỉ được một câu của tác giả không?  →  ③ khớp = YES · trái = NO · chỉ là thuật / phải suy thêm một bước = NOT GIVEN', vi: 'Headings band 8: đọc đoạn trước → tự đặt tiêu đề 4–6 chữ → tìm tiêu đề cùng Ý → thử “sai một chữ” → đoạn khó để cuối. Tiêu đề đúng trùng ý, tiêu đề sai trùng chữ.' },

  { t: 'h', text: '(Ngày 9 · Bài 3) Mổ đề Listening — loại lỗi A–E (Ngày 8), C tách ba + bốn kiểu câu tín hiệu' },
  {
    t: 'table',
    head: ['Kiểu tín hiệu', 'Khung', 'Nghĩa là'],
    rows: [
      ['① Phủ định lý do', "that's not why / what… · that's not the issue", 'điều vừa nghe là phương án sai; đáp án ở câu kế'],
      ['② Câu chẻ', 'What + V + was / is… · The thing that… was…', 'đáp án nằm sau was / is'],
      ['③ do / does / did nhấn mạnh', 'What we do suggest is… · What I do want is… · you do have to…', 'đối lập với điều vừa bị gạt'],
      ['④ not X, it’s Y', "it's not the X, it's the Y · wasn't from X, it was from Y · X instead", 'X là bẫy, Y là đáp án'],
    ],
  },
  { t: 'rule', formula: 'nghe  not / but / actually / in fact / instead / What … is  →  bỏ điều vừa nghe  →  đáp án ở vế SAU', vi: 'Loại lỗi nghe (Ngày 8): A không nghe ra âm · B nghe ra, viết sai · C dính bẫy (C1 viết phương án bị bác · C2 nhầm người nói / nhầm thì · C3 paraphrase) · D lạc chỗ · E đọc đề không kịp.' },
];
