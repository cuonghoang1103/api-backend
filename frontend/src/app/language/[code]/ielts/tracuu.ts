/**
 * Hai mục TRA CỨU của khoá IELTS (hiện ngay dưới "Mở đầu" ở mục lục):
 *   · `tra-cong-thuc` — mọi công thức ngữ pháp + khung câu kỹ năng của các ngày
 *     đã soạn, gom một chỗ để ôn trước khi làm bài / trước khi thi.
 *   · `tra-tu-vung`  — toàn bộ từ vựng của khoá (khối `vocabAll`, đọc từ mục lục
 *     nên tự có từ của ngày mới soạn — KHÔNG phải sửa tệp này).
 *
 * Soạn thêm ngày có điểm ngữ pháp mới → thêm một mục vào TRA_CONG_THUC (xem SOAN-BAI.md §5).
 * Ví dụ viết mới, không chép sách.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC: Lesson = {
  id: 'tra-cong-thuc',
  kind: 'grammar',
  title: 'Tra cứu: toàn bộ công thức',
  goal: 'Ôn nhanh mọi công thức ngữ pháp và khung câu Nói/Viết đã học, ở một trang — mỗi công thức có ví dụ song ngữ, lỗi hay sai và ngày học chi tiết.',
  minutes: 15,
  blocks: [
    {
      t: 'recap',
      title: 'Dùng trang này thế nào?',
      items: [
        'Mỗi khung là **một điểm ngữ pháp**: công thức tô màu → ví dụ (bấm 🔊 nghe) → **Công thức 1 dòng** để thuộc.',
        'Màu cố định cả khoá: **S chủ ngữ** xanh dương, **V động từ** đỏ, **O tân ngữ** tím, **C bổ ngữ** xanh lá, **A trạng ngữ** vàng, **N danh từ** xanh két, **adj tính từ** cam, trợ động từ (do, be…) xám.',
        'Quên chỗ nào thì mở lại **ngày ghi trong ngoặc** để học kỹ và làm bài tập.',
        'Mẹo ôn: che cột ví dụ, nhìn công thức và **tự đặt một câu về chính bạn**, rồi mới xem ví dụ.',
      ],
    },

    /* ── Ngày 1 ── */
    { t: 'h', text: '1. Câu đơn — 4 mẫu câu gốc (Ngày 1)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + V', vi: 'Ai/cái gì + làm gì (động từ không cần tân ngữ)', examples: [{ en: 'The baby sleeps.', vi: 'Em bé ngủ.' }] },
        { formula: 'S + V + O', vi: 'Ai + làm gì + ai/cái gì', examples: [{ en: 'My brother plays the guitar.', vi: 'Anh tôi chơi đàn ghi-ta.' }] },
        { formula: 'S + V + C', vi: 'Ai/cái gì + là/trông/cảm thấy + thế nào (be, look, seem, feel…)', examples: [{ en: 'The test seems easy.', vi: 'Bài kiểm tra có vẻ dễ.' }] },
        { formula: 'S + V + A', vi: 'Ai + làm gì + ở đâu / khi nào / thế nào', examples: [{ en: 'We study in the library.', vi: 'Chúng tôi học ở thư viện.' }] },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thiếu động từ trước tính từ: ~~My room very small.~~ → **My room is very small.**',
        'Thiếu chủ ngữ: ~~Is hot today.~~ → **It is hot today.**',
      ],
    },
    { t: 'rule', formula: 'S + V (+ O / C / A)', vi: 'Câu tiếng Anh **luôn có chủ ngữ và động từ**; phần sau tuỳ động từ cần gì.' },

    { t: 'h', text: '2. Động từ "to be" ở hiện tại: am / is / are (Ngày 1)' },
    {
      t: 'table',
      head: ['Chủ ngữ', 'Khẳng định', 'Phủ định', 'Câu hỏi'],
      rows: [
        ['I', 'I **am** (I\'m)', 'I **am not** (I\'m not)', '**Am** I…?'],
        ['he / she / it · danh từ số ít', 'she **is** (she\'s)', 'she **is not** (isn\'t)', '**Is** she…?'],
        ['you / we / they · danh từ số nhiều', 'they **are** (they\'re)', 'they **are not** (aren\'t)', '**Are** they…?'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + am/is/are + adj / N / A', vi: 'Khẳng định: ai/cái gì là gì, thế nào, ở đâu', examples: [{ en: 'My parents are teachers.', vi: 'Bố mẹ tôi là giáo viên.' }] },
        { formula: 'S + am/is/are + not + adj / N / A', vi: 'Phủ định: thêm not SAU be (không dùng do/does)', examples: [{ en: 'The café is not busy on Mondays.', vi: 'Quán cà phê không đông vào thứ Hai.' }] },
        { formula: 'Am/Is/Are + S + adj / N / A ?', vi: 'Câu hỏi: đảo be lên trước chủ ngữ', examples: [{ en: 'Are you ready for the test?', vi: 'Bạn sẵn sàng cho bài kiểm tra chưa?' }] },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp: be và động từ thường',
      items: [
        '~~I am agree.~~ → **I agree.** · ~~She is work here.~~ → **She works here.** Đã có động từ thường thì **không thêm am/is/are**.',
        '~~He doesn\'t tired.~~ → **He isn\'t tired.** Câu có be thì phủ định bằng **be + not**, không mượn do/does.',
      ],
    },
    { t: 'rule', formula: 'S + am/is/are (+ not) + adj / N / A', vi: 'Dùng **be** khi sau nó là tính từ, danh từ hoặc nơi chốn — không có động từ thường nào khác.' },

    { t: 'h', text: '3. Thì hiện tại đơn với động từ thường (Ngày 1)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + V(s/es) + O', vi: 'Khẳng định — he/she/it thêm -s/-es', examples: [{ en: 'She checks her messages every hour.', vi: 'Cô ấy xem tin nhắn mỗi giờ.' }, { en: 'I use Instagram every day.', vi: 'Tôi dùng Instagram mỗi ngày.' }] },
        { formula: "S + don't/doesn't + V + O", vi: 'Phủ định — sau don\'t/doesn\'t động từ về nguyên mẫu', examples: [{ en: "My dad doesn't use TikTok.", vi: 'Bố tôi không dùng TikTok.' }] },
        { formula: 'Do/Does + S + V + O ?', vi: 'Câu hỏi Yes/No — trả lời ngắn: Yes, I do. / No, she doesn\'t.', examples: [{ en: 'Does your sister post videos online?', vi: 'Em gái bạn có đăng video lên mạng không?' }] },
        { formula: 'Wh- + do/does + S + V ?', vi: 'Câu hỏi có từ để hỏi (What, Where, When, Why, How…)', examples: [{ en: 'How often do you check your email?', vi: 'Bạn kiểm tra email bao lâu một lần?' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Dùng khi nào · dấu hiệu nhận biết',
      head: ['Cách dùng', 'Ví dụ', 'Dấu hiệu hay đi kèm'],
      rows: [
        ['Thói quen, việc lặp lại', 'I **drink** coffee every morning.', 'always, usually, often, sometimes, rarely, never, every day/week, once a week'],
        ['Sự thật chung, điều luôn đúng', 'The sun **rises** in the east.', '(không cần dấu hiệu)'],
        ['Lịch trình cố định', 'The train **leaves** at 7 a.m.', 'giờ tàu, lịch học, lịch chiếu'],
        ['Ý kiến, cảm nhận (Writing Task 2)', 'I **believe** that…', 'think, believe, agree, feel'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nhớ: "ba ngôi một chữ S"',
      items: [
        '**He, she, it** — ba ngôi này ôm một chữ **s**: she work**s**, he watch**es**, it ha**s**.',
        'Chữ **s** chỉ xuất hiện **một lần** trong câu: có **does** thì động từ trơn (Does she work…?), không có does thì động từ mang s (She works…).',
        'Trạng từ tần suất đứng **trước động từ thường** nhưng **sau be**: She **often** cooks. / She is **often** late.',
      ],
    },
    { t: 'rule', formula: "S + V(s/es) · S + don't/doesn't + V · Do/Does + S + V?", vi: 'Thói quen, sự thật, ý kiến. He/she/it → **-s** hoặc **does**; còn lại → nguyên mẫu hoặc **do**.' },

    /* ── Ngày 3 ── */
    { t: 'h', text: '4. Đại từ nhân xưng — một bảng đủ 5 dạng (Ngày 3)' },
    {
      t: 'table',
      head: ['Ngôi', 'Chủ ngữ (đứng trước V)', 'Tân ngữ (sau V / giới từ)', 'Tính từ sở hữu (+ N)', 'Đại từ sở hữu (đứng một mình)', 'Phản thân'],
      rows: [
        ['tôi', 'I', 'me', 'my', 'mine', 'myself'],
        ['bạn', 'you', 'you', 'your', 'yours', 'yourself / yourselves'],
        ['anh ấy', 'he', 'him', 'his', 'his', 'himself'],
        ['cô ấy', 'she', 'her', 'her', 'hers', 'herself'],
        ['nó', 'it', 'it', 'its', '—', 'itself'],
        ['chúng tôi', 'we', 'us', 'our', 'ours', 'ourselves'],
        ['họ', 'they', 'them', 'their', 'theirs', 'themselves'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S (I/he/they…) + V + O (me/him/them…)', vi: 'Chủ ngữ trước động từ, tân ngữ sau động từ', examples: [{ en: 'She helps me with my homework.', vi: 'Cô ấy giúp tôi làm bài tập.' }] },
        { formula: 'my/your/their… + N', vi: 'Tính từ sở hữu luôn đi kèm danh từ', examples: [{ en: 'Their school is near the river.', vi: 'Trường của họ gần sông.' }] },
        { formula: 'mine/yours/theirs… (không có N)', vi: 'Đại từ sở hữu thay cho "tính từ sở hữu + danh từ"', examples: [{ en: 'This laptop is mine, not yours.', vi: 'Cái laptop này của tôi, không phải của bạn.' }] },
      ],
    },
    {
      t: 'note',
      title: 'Nhầm hay gặp',
      items: [
        '~~Me and my friend go to school.~~ → **My friend and I go to school.** (làm chủ ngữ phải dùng **I**).',
        '~~it\'s color~~ → **its color**. **it\'s** = it is; **its** = của nó.',
        '~~This book is my.~~ → **This book is mine.** / **This is my book.**',
      ],
    },
    { t: 'rule', formula: 'I → me → my + N → mine → myself', vi: 'Hỏi: từ này đứng **ở đâu** trong câu? Trước V → chủ ngữ; sau V → tân ngữ; trước N → my…; đứng một mình → mine…' },

    { t: 'h', text: '5. Đại từ quan hệ: nối hai câu (Ngày 3)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'N (người) + who/that + V', vi: 'who thay cho NGƯỜI làm chủ ngữ', examples: [{ en: 'Students who read every day learn faster.', vi: 'Học sinh đọc sách mỗi ngày học nhanh hơn.' }] },
        { formula: 'N (vật) + which/that + V', vi: 'which thay cho VẬT, sự việc', examples: [{ en: 'Schools need programs which support weak students.', vi: 'Trường học cần những chương trình hỗ trợ học sinh yếu.' }] },
        { formula: 'N + whose + N', vi: 'whose = "của người/vật đó"', examples: [{ en: 'A child whose parents read to him often loves books.', vi: 'Đứa trẻ được bố mẹ đọc sách cho nghe thường yêu sách.' }] },
        { formula: 'N (người) + whom + S + V', vi: 'whom = người làm TÂN NGỮ (trang trọng; nói thường dùng who/that)', examples: [{ en: 'The teacher whom we met was very kind.', vi: 'Cô giáo mà chúng tôi gặp rất tốt bụng.' }] },
      ],
    },
    { t: 'rule', formula: 'người → who · vật → which · cả hai → that · của → whose', vi: 'Dùng để viết **câu phức** trong Writing Task 2 — giám khảo chấm điểm ngữ pháp cao hơn khi thấy câu phức đúng.' },

    { t: 'h', text: '6. "It" chủ ngữ giả (Ngày 3)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'It + is + adj + to V', vi: 'Nêu nhận xét về một việc — rất hay dùng trong Writing Task 2', examples: [{ en: 'It is important to learn a second language.', vi: 'Học một ngoại ngữ thứ hai là điều quan trọng.' }] },
        { formula: 'It + is + adj + for + O + to V', vi: 'Thêm "đối với ai"', examples: [{ en: 'It is hard for older people to use new apps.', vi: 'Người lớn tuổi khó dùng các ứng dụng mới.' }] },
      ],
    },
    { t: 'rule', formula: 'It + is + adj + (for O) + to V', vi: 'Thay cho câu có chủ ngữ dài: ~~To learn English is important.~~ (đúng nhưng nặng nề) → **It is important to learn English.**' },

    /* ── Ngày 5 ── */
    { t: 'h', text: '7. Danh từ đếm được & không đếm được (Ngày 5)' },
    {
      t: 'table',
      head: ['', 'Đếm được số ít', 'Đếm được số nhiều', 'Không đếm được'],
      rows: [
        ['Ví dụ', 'a job, an idea', 'jobs, ideas', 'work, information, advice, money'],
        ['Mạo từ', '**a / an / the** (bắt buộc có một từ đứng trước)', 'không mạo từ / **the / some**', 'không mạo từ / **the / some**, KHÔNG a/an'],
        ['Động từ đi sau', 'số ít: The job **is**…', 'số nhiều: Jobs **are**…', 'số ít: Information **is**…'],
        ['"nhiều"', '—', '**many** / a lot of', '**much** / a lot of'],
        ['"ít"', '—', '**few** (ít, gần như không) · **a few** (một vài)', '**little** (ít, gần như không) · **a little** (một chút)'],
        ['Câu hỏi số lượng', '—', '**How many** + N số nhiều?', '**How much** + N?'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'a/an + N (số ít) + V(s/es)', vi: 'Danh từ đếm được số ít cần a/an (hoặc the, my…)', examples: [{ en: 'A good manager listens to the team.', vi: 'Một người quản lý giỏi lắng nghe cả nhóm.' }] },
        { formula: 'N(s/es) + V (số nhiều)', vi: 'Số nhiều: động từ không thêm -s', examples: [{ en: 'Many employees work from home now.', vi: 'Giờ nhiều nhân viên làm việc ở nhà.' }] },
        { formula: 'N (không đếm được) + V(s/es)', vi: 'Không đếm được: không a/an, không -s, động từ số ít', examples: [{ en: 'This information is very useful.', vi: 'Thông tin này rất hữu ích.' }] },
        { formula: 'a piece of / a cup of… + N (không đếm được)', vi: 'Muốn "đếm" thì thêm đơn vị', examples: [{ en: 'Let me give you a piece of advice.', vi: 'Để tôi cho bạn một lời khuyên.' }] },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~informations, advices, equipments, furnitures, homeworks~~ → **information, advice, equipment, furniture, homework** (không bao giờ thêm -s).',
        '~~an advice~~ → **a piece of advice** / **some advice**.',
        '~~The news are bad.~~ → **The news is bad.** (news kết thúc bằng s nhưng không đếm được).',
        '~~people is~~ → **people are** (people = số nhiều của person).',
      ],
    },
    { t: 'rule', formula: 'many + N(s) · much + N (không đếm) · a lot of + cả hai', vi: 'Không chắc danh từ đếm được hay không → dùng **a lot of / some** là an toàn.' },

    /* ── Khung câu kỹ năng ── */
    { t: 'h', text: '8. Khung câu Speaking (Ngày 4, Ngày 6)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'Yes/No + S + V + because… + ví dụ', vi: 'Câu hỏi Yes/No (Part 1): Trả lời → Lý do → Ví dụ (2–4 câu)', examples: [{ en: 'Yes, I enjoy cooking because it helps me relax. I usually cook for my family on Sundays.', vi: 'Có, tôi thích nấu ăn vì nó giúp tôi thư giãn. Tôi thường nấu cho gia đình vào Chủ nhật.' }] },
        { formula: 'Wh- ? → S + V + A (trả lời thẳng) + 1–2 câu chi tiết', vi: 'Câu hỏi Wh-: nghe đúng từ hỏi, trả lời thẳng vào nó rồi thêm chi tiết', examples: [{ en: 'I usually study in my bedroom. It is quiet, so I can focus.', vi: 'Tôi thường học trong phòng ngủ. Ở đó yên tĩnh nên tôi tập trung được.' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Từ hỏi → phải trả lời cái gì',
      head: ['Từ hỏi', 'Hỏi về', 'Trả lời bắt đầu bằng'],
      rows: [
        ['What', 'cái gì, việc gì', 'I like… / I usually…'],
        ['Where', 'nơi chốn', 'in / at / near + nơi'],
        ['When / What time', 'thời gian', 'at + giờ · on + thứ · in + buổi/tháng/năm'],
        ['Who', 'người', 'my mother / my best friend…'],
        ['Why', 'lý do', 'Because… / It helps me…'],
        ['How often', 'mức độ thường xuyên', 'every day / twice a week / rarely'],
        ['How', 'cách thức, cảm nhận', 'by bus / I feel…'],
      ],
    },
    { t: 'rule', formula: 'Trả lời thẳng + lý do + ví dụ', vi: 'Mỗi câu Part 1 nói **15–25 giây**. Không bao giờ chỉ "Yes." rồi im.' },

    { t: 'h', text: '9. Khung câu Writing (Ngày 2, Ngày 4, Ngày 6)' },
    {
      t: 'table',
      caption: 'Writing Task 1 — khung 4 đoạn',
      head: ['Đoạn', 'Viết gì', 'Câu mở mẫu'],
      rows: [
        ['Introduction', 'Viết lại đề bằng lời của mình (1 câu)', 'The line graph **shows** how… changed between 2010 and 2020.'],
        ['Overview', '2 đặc điểm nổi bật nhất, không số liệu', '**Overall,** … rose sharply, while … fell.'],
        ['Body 1 · Body 2', 'Chi tiết có số liệu, so sánh', 'In 2010, … stood at 20%, compared with…'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'Paraphrase đề. + I completely agree that + S + V + because + lý do 1 + and + lý do 2.', vi: 'Mở bài Task 2 dạng Opinion (đồng ý)', examples: [{ en: 'I completely agree that schools should teach cooking because it builds independence and improves health.', vi: 'Tôi hoàn toàn đồng ý rằng trường học nên dạy nấu ăn vì nó rèn tính tự lập và cải thiện sức khoẻ.' }] },
        { formula: 'I completely disagree with this view because + lý do 1 + and + lý do 2.', vi: 'Mở bài Task 2 dạng Opinion (không đồng ý)', examples: [{ en: 'I completely disagree with this view because exams motivate students and measure progress fairly.', vi: 'Tôi hoàn toàn không đồng ý với quan điểm này vì thi cử tạo động lực cho học sinh và đo sự tiến bộ một cách công bằng.' }] },
        { formula: 'Firstly, + S + V. + For example, + S + V.', vi: 'Thân bài: Mở ý chính → Giải thích → Ví dụ (hiện tại đơn)', examples: [{ en: 'Firstly, online courses save time. For example, students do not need to travel to class.', vi: 'Thứ nhất, khoá học trực tuyến tiết kiệm thời gian. Ví dụ, sinh viên không phải đi lại tới lớp.' }] },
      ],
    },
    { t: 'rule', formula: 'Mở bài = Paraphrase + Thesis · Thân bài = Ý chính → Giải thích → Ví dụ', vi: 'Task 2 viết chủ yếu bằng **hiện tại đơn**; Task 1 **không** nêu ý kiến riêng.' },

    { t: 'h', text: '10. Bảng chốt: gặp chủ ngữ nào thì dùng gì?' },
    {
      t: 'table',
      head: ['Chủ ngữ', 'be', 'Động từ thường', 'Phủ định', 'Câu hỏi'],
      rows: [
        ['I', 'am', 'work', "don't work · I'm not", 'Do I…? · Am I…?'],
        ['you / we / they / N số nhiều', 'are', 'work', "don't work · aren't", 'Do they…? · Are they…?'],
        ['he / she / it / N số ít / N không đếm được', 'is', 'works', "doesn't work · isn't", 'Does she…? · Is she…?'],
      ],
    },
  ],
};

export const TRA_TU_VUNG: Lesson = {
  id: 'tra-tu-vung',
  kind: 'vocab',
  title: 'Tra cứu: toàn bộ từ vựng',
  goal: 'Tìm nhanh bất kỳ từ nào đã học (gõ tiếng Anh hoặc tiếng Việt), lọc theo ngày, che nghĩa để tự kiểm tra và luyện thẻ nhớ.',
  minutes: 10,
  blocks: [
    {
      t: 'recap',
      title: 'Ôn từ vựng mỗi ngày 10 phút',
      items: [
        'Chọn **ngày vừa học** → bấm **Che nghĩa** → nhìn từ, nói to nghĩa, chạm để kiểm tra.',
        'Đổi sang **Che từ tiếng Anh**: nhìn nghĩa, nói (hoặc viết ra giấy) từ tiếng Anh — khó hơn nhưng nhớ lâu hơn.',
        'Cuối tuần: **Thẻ nhớ** trộn ngẫu nhiên cả khoá. Từ nào sai, mở lại ngày đó xem câu ví dụ.',
      ],
    },
    { t: 'vocabAll' },
  ],
};
