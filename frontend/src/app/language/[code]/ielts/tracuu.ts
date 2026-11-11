/**
 * Hai mục TRA CỨU của khoá IELTS (hiện ngay dưới "Mở đầu" ở mục lục):
 *   · `tra-cong-thuc` — mọi công thức ngữ pháp + khung câu kỹ năng của các ngày
 *     đã soạn, gom một chỗ để ôn trước khi làm bài / trước khi thi.
 *   · `tra-tu-vung`  — toàn bộ từ vựng của khoá (khối `vocabAll`, đọc từ mục lục
 *     nên tự có từ của ngày mới soạn — KHÔNG phải sửa tệp này).
 *
 * Soạn thêm ngày có điểm ngữ pháp mới → thêm một mục vào TRA_CONG_THUC (xem SOAN-BAI.md §5).
 * Ví dụ viết mới, không chép sách. Mục 10–28 (Ngày 7–15) chép nguyên văn các khối
 * rule / patterns / table của bài ngày đó — sửa bài ngày thì sửa luôn ở đây.
 */
import type { Lesson } from '@/components/sach-hoc/types';

export const TRA_CONG_THUC: Lesson = {
  id: 'tra-cong-thuc',
  kind: 'grammar',
  title: 'Tra cứu: toàn bộ công thức',
  goal: 'Ôn nhanh mọi công thức ngữ pháp và khung câu Nói/Viết đã học, ở một trang — mỗi công thức có ví dụ song ngữ, lỗi hay sai và ngày học chi tiết.',
  minutes: 30,
  blocks: [
    {
      t: 'recap',
      title: 'Dùng trang này thế nào?',
      items: [
        'Thứ tự theo ngày học: **mục 1–9** = Ngày 1–6 · **mục 10–28** = Ngày 7–15 · **mục 29** = bảng chốt chia động từ theo chủ ngữ.',
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

    /* ── Ngày 7 ── */

    { t: 'h', text: '10. Tính từ: vị trí, thứ tự, -ed / -ing (Ngày 7)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'a / an / the + adj + N', vi: 'Tính từ đứng TRƯỚC danh từ (ngược tiếng Việt)', examples: [{ en: 'I work at a small desk next to the window.', vi: 'Tôi làm việc ở một cái bàn nhỏ cạnh cửa sổ.' }, { en: 'She bought an expensive headset for online meetings.', vi: 'Cô ấy mua một bộ tai nghe đắt tiền để họp trực tuyến.' }] },
        { formula: 'S + am / is / are + adj', vi: 'Tính từ đứng SAU be — nói người / vật đó thế nào', examples: [{ en: 'My manager is very patient.', vi: 'Quản lý của tôi rất kiên nhẫn.' }, { en: 'These chairs are uncomfortable.', vi: 'Mấy cái ghế này không thoải mái. (chairs số nhiều nhưng uncomfortable KHÔNG thêm -s)' }] },
        { formula: 'S + look / feel / seem / sound + adj', vi: 'Tính từ đứng SAU động từ nối — "trông / cảm thấy / có vẻ / nghe có vẻ"', examples: [{ en: 'You look stressed today.', vi: 'Hôm nay trông bạn căng thẳng.' }, { en: 'That idea sounds interesting.', vi: 'Ý tưởng đó nghe có vẻ thú vị.' }] },
      ],
    },
    {
      t: 'table',
      caption: '12 cặp -ed / -ing hay gặp trong IELTS',
      head: ['-ed (người cảm thấy)', '-ing (thứ gây ra)', 'Nghĩa'],
      rows: [
        ['bored', 'boring', 'chán / gây chán'],
        ['interested (in)', 'interesting', 'quan tâm, hứng thú / thú vị'],
        ['tired', 'tiring', 'mệt / gây mệt'],
        ['exhausted', 'exhausting', 'kiệt sức / làm kiệt sức'],
        ['confused', 'confusing', 'bối rối / gây khó hiểu'],
        ['excited', 'exciting', 'háo hức / hấp dẫn, sôi động'],
        ['surprised', 'surprising', 'ngạc nhiên / đáng ngạc nhiên'],
        ['disappointed', 'disappointing', 'thất vọng / gây thất vọng'],
        ['satisfied', 'satisfying', 'hài lòng / làm hài lòng'],
        ['stressed', 'stressful (!)', 'căng thẳng / gây căng thẳng — dạng thứ hai là **-ful**, không phải ~~stressing~~'],
        ['relaxed', 'relaxing', 'thư thái / giúp thư giãn'],
        ['motivated', 'motivating', 'có động lực / tạo động lực'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~I very like music.~~ → I **really like** music. / I like music **very much**. — very không bổ nghĩa cho động từ',
        '~~She sings beautiful.~~ → She sings **beautifully**. — sing là động từ hành động → trạng từ',
        '~~I am boring.~~ (ý: tôi thấy chán) → I am **bored**. — người cảm thấy → -ed',
      ],
    },
    { t: 'rule', formula: 'a / the + adj + N · S + be / look / feel / seem / sound + adj', vi: 'Tính từ đứng trước danh từ hoặc sau be / động từ nối; không thêm -s.' },
    { t: 'rule', formula: 'opinion + size + age + shape + colour + origin + material + purpose + N', vi: 'Ý kiến đứng đầu, mục đích sát danh từ nhất; thường chỉ dùng 2–3 tính từ.' },
    { t: 'rule', formula: 'người + be / feel + V-ed (cảm thấy) · vật / việc / người gây ra + be + V-ing', vi: 'I am bored (tôi thấy chán) ↔ The lesson is boring (bài học gây chán).' },

    { t: 'h', text: '11. Trạng từ: cách tạo -ly, vị trí, động từ nối + tính từ (Ngày 7)' },
    {
      t: 'table',
      caption: 'Trạng từ bất quy tắc & cặp dễ bẫy',
      head: ['Tính từ', 'Trạng từ', 'Bẫy cần nhớ'],
      rows: [
        ['good (tốt)', '**well**', '~~He works good.~~ → He works **well**. (Nhưng I feel **well** = tôi khoẻ — well lúc này là tính từ "khoẻ mạnh".)'],
        ['fast (nhanh)', '**fast**', '~~fastly~~ không tồn tại.'],
        ['hard (chăm, vất vả)', '**hard**', '**hardly** = **hầu như không**: I **hardly** sleep = tôi hầu như không ngủ (≠ ngủ "chăm").'],
        ['late (muộn)', '**late**', '**lately** = **gần đây**: Have you been busy **lately**?'],
        ['early, daily, weekly', 'early, daily, weekly', 'Cùng một dạng: I get up **early**. · We meet **weekly**.'],
        ['high (cao)', '**high**', '**highly** = **rất, hết sức**: a **highly** skilled worker, I **highly** recommend it.'],
        ['near (gần)', '**near**', '**nearly** = **gần như**: It is **nearly** five o\'clock.'],
        ['straight, right, wrong', 'straight, right, wrong', 'Go **straight** home. · You spelled it **wrong**. (văn viết trang trọng: wrongly)'],
      ],
    },
    {
      t: 'table',
      caption: 'Loại trạng từ và vị trí quen thuộc',
      head: ['Loại', 'Từ hay gặp', 'Vị trí', 'Ví dụ'],
      rows: [
        ['**Cách thức** (như thế nào?)', 'quickly, carefully, clearly, well, badly', 'Sau động từ, hoặc **sau tân ngữ** — không chen giữa động từ và tân ngữ', 'She checked the report **carefully**. (~~checked carefully the report~~)'],
        ['**Tần suất** (bao lâu một lần?)', 'always, usually, often, sometimes, rarely, never', '**Trước động từ thường**, **sau be**, sau trợ động từ', 'I **usually** work from home. · He **is always** online. · I **don\'t often** go out.'],
        ['**Mức độ** (đến mức nào?)', 'very, really, quite, extremely, fairly, too, so', '**Trước tính từ / trạng từ** mà nó bổ nghĩa', '**extremely** busy · **quite** slowly · **too** expensive'],
        ['**enough** (đủ)', 'enough', '**Sau** tính từ / trạng từ, nhưng **trước** danh từ', 'old **enough** · fast **enough** · **enough** time / **enough** chairs'],
        ['**Thời gian, nơi chốn**', 'yesterday, today, soon, here, there, at home', 'Thường ở **cuối câu**; thứ tự: **nơi chốn → thời gian**', 'I worked **at home yesterday**. (~~yesterday at home~~ nghe kém tự nhiên)'],
        ['**Bình luận cả câu**', 'unfortunately, luckily, clearly, obviously, surprisingly', '**Đầu câu**, theo sau là dấu phẩy', '**Unfortunately**, the meeting was cancelled.'],
      ],
    },
    { t: 'rule', formula: 'adj + ly = adv (quick → quickly · happy → happily · gentle → gently · basic → basically) · good → well · fast / hard / late → giữ nguyên', vi: 'hardly = hầu như không · lately = gần đây · highly = rất · nearly = gần như.' },
    { t: 'rule', formula: 'S + adv (tần suất) + V + O + adv (cách thức) + nơi chốn + thời gian · S + be + adv (tần suất) · very / really / extremely + adj · adj + enough · enough + N', vi: 'Không nói "I very like" — dùng "I really like" hoặc "I like … very much".' },
    { t: 'rule', formula: 'S + be / look / feel / seem / sound / taste / become / remain + adj · S + action V (+ O) + adv', vi: 'Thay động từ bằng "is" mà câu vẫn hợp nghĩa → dùng tính từ.' },

    { t: 'h', text: '12. So sánh hơn & so sánh nhất (Ngày 7)' },
    {
      t: 'table',
      caption: 'Cách tạo dạng so sánh',
      head: ['Loại tính từ', 'So sánh hơn', 'So sánh nhất', 'Ví dụ'],
      rows: [
        ['1 âm tiết', '+ **-er** (+ than)', 'the + **-est**', 'cheap → **cheaper** → **the cheapest**'],
        ['1 âm tiết: 1 nguyên âm + 1 phụ âm cuối', 'gấp đôi phụ âm + -er', 'the + gấp đôi + -est', 'big → **bigger** → **the biggest** · hot → **hotter**'],
        ['tận cùng **-e**', '+ **-r**', 'the + **-st**', 'large → **larger** → **the largest**'],
        ['2 âm tiết tận cùng **-y**', 'y → **i** + er', 'the + **iest**', 'busy → **busier** → **the busiest** · easy → **easier**'],
        ['2 âm tiết trở lên (còn lại)', '**more** + adj', '**the most** + adj', 'useful → **more useful** → **the most useful** · expensive → **more expensive**'],
        ['**Bất quy tắc**', 'good → **better** · bad → **worse** · far → **further / farther** · many / much → **more** · little → **less**', 'the **best** · the **worst** · the **furthest** · the **most** · the **least**', 'This is **the best** laptop I have ever used.'],
        ['**Trạng từ -ly**', '**more** + adv', '**the most** + adv', 'She works **more efficiently** at home. (fast → faster, hard → harder)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + be + adj-er / more + adj + than + N', vi: 'So sánh hơn hai thứ', examples: [{ en: 'Working from home is cheaper than renting an office.', vi: 'Làm ở nhà rẻ hơn thuê văn phòng.' }, { en: 'Video calls are more convenient than face-to-face meetings.', vi: 'Gọi video tiện hơn họp trực tiếp.' }] },
        { formula: 'S + be + the + adj-est / the most + adj + (in / of …)', vi: 'So sánh nhất trong một nhóm', examples: [{ en: 'Monday is the busiest day of the week.', vi: 'Thứ Hai là ngày bận nhất trong tuần.' }, { en: 'This is the most useful app on my phone.', vi: 'Đây là ứng dụng hữu ích nhất trên điện thoại tôi.' }] },
        { formula: 'S + be + (not) as + adj + as + N', vi: 'So sánh bằng / không bằng', examples: [{ en: 'My home internet is not as fast as the office Wi-Fi.', vi: 'Mạng nhà tôi không nhanh bằng Wi-Fi ở văn phòng.' }] },
        { formula: 'much / far / a lot / slightly + adj-er / more + adj', vi: 'Nhấn mạnh mức chênh lệch (hơn nhiều / hơn một chút) — rất hay dùng trong Task 1', examples: [{ en: 'Rent in the city centre is much higher than in the suburbs.', vi: 'Tiền thuê nhà ở trung tâm cao hơn nhiều so với ở ngoại ô.' }, { en: 'The second laptop is slightly more expensive.', vi: 'Chiếc laptop thứ hai đắt hơn một chút.' }] },
      ],
    },
    { t: 'rule', formula: 'adj-er / more + adj + than · the + adj-est / the most + adj · (not) as + adj + as · much / far + so sánh hơn', vi: '1 âm tiết → -er/-est; 2 âm tiết trở lên → more/most (trừ -y → -ier/-iest); good → better → best.' },
    { t: 'rule', formula: 'absolutely / really + adj mạnh (exhausted, amazing, terrible) · Adv bình luận, + S + V · a + adj + N ↔ V + adv', vi: 'Tính từ mạnh thay cho "very + adj"; trạng từ đầu câu thể hiện thái độ; Task 1 xen kẽ "a sharp rise" và "rose sharply".' },

    /* ── Ngày 8 ── */

    { t: 'h', text: '13. Đoạn thân bài Task 2: chủ đề → giải thích → ví dụ (Ngày 8)' },
    {
      t: 'table',
      caption: 'Cấu trúc một đoạn thân bài',
      head: ['Phần', 'Làm gì', 'Khung câu hay dùng'],
      rows: [
        ['**Topic sentence**', 'Nêu **một** lý do — đúng lý do đã hứa trong thesis, nhưng viết bằng từ **khác** một chút.', 'Firstly, … · The first reason why… is that… · One major advantage of… is that… · Secondly, … · Another reason is that…'],
        ['**Explanation**', 'Trả lời câu hỏi **“Tại sao lại thế?”** hoặc **“Điều đó dẫn tới gì?”**', 'This is because… · This means that… · As a result, … · In other words, … · Without…, …'],
        ['**Example**', 'Đưa **một trường hợp cụ thể**: người thật (bạn, người thân), nơi thật (thành phố, trường), tình huống giả định (If…).', 'For example, … · For instance, … · …, such as… · A good example of this is… · If…, …'],
        ['**Link** (tuỳ chọn)', 'Nói gọn hệ quả của ví dụ, **nối về quan điểm** của bạn.', 'Therefore, … · As a result, … · This shows that… · That is why I believe…'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'Firstly, / Secondly, + S + V + (ý chính).', vi: 'Đơn giản, an toàn nhất cho band 4.5–5.5.', examples: [{ en: 'Firstly, working from home saves employees a considerable amount of time.', vi: 'Thứ nhất, làm việc tại nhà giúp nhân viên tiết kiệm một lượng thời gian đáng kể.' }] },
        { formula: 'The first / main reason why + S + V + is that + S + V.', vi: 'Dài hơn, có mệnh đề — nâng điểm ngữ pháp.', examples: [{ en: 'The main reason why I support this view is that hobbies help students reduce stress.', vi: 'Lý do chính khiến tôi ủng hộ quan điểm này là sở thích giúp học sinh giảm căng thẳng.' }] },
        { formula: 'One major advantage / disadvantage of + N / V-ing + is that + S + V.', vi: 'Hợp với đề nói về lợi ích – bất lợi.', examples: [{ en: 'One major advantage of online learning is that students can learn at their own pace.', vi: 'Một lợi ích lớn của học trực tuyến là sinh viên có thể học theo tốc độ của riêng mình.' }] },
        { formula: 'Another reason is that + S + V. · In addition, + S + V.', vi: 'Mở đoạn thân bài 2 (thay cho Secondly).', examples: [{ en: 'Another reason is that many people find it easier to concentrate at home.', vi: 'Một lý do khác là nhiều người thấy tập trung ở nhà dễ hơn.' }] },
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'For example, / For instance, + S + V.', vi: 'Ví dụ là cả một câu — đứng đầu câu, có dấu phẩy.', examples: [{ en: 'For example, my cousin cycles to work every day.', vi: 'Ví dụ, anh họ tôi đạp xe đi làm mỗi ngày.' }] },
        { formula: 'N (số nhiều / chung), such as + N1, N2 and N3, + V…', vi: 'Ví dụ là vài danh từ chen trong câu (KHÔNG có dấu phẩy sau such as).', examples: [{ en: 'Team sports such as football and basketball teach children how to cooperate.', vi: 'Các môn thể thao đồng đội như bóng đá và bóng rổ dạy trẻ cách hợp tác.' }] },
        { formula: 'A good example of this is + N (, where / who + S + V).', vi: 'Giới thiệu một trường hợp tiêu biểu (thành phố, nghề, công ty…).', examples: [{ en: 'A good example of this is Singapore, where many buildings have green roofs.', vi: 'Một ví dụ điển hình là Singapore, nơi nhiều toà nhà có mái xanh.' }] },
        { formula: 'If + S + V (hiện tại), S + will / can + V.', vi: 'Ví dụ giả định — câu điều kiện loại 1 (sẽ học kỹ sau).', examples: [{ en: 'If students have no time to rest, they will quickly become exhausted.', vi: 'Nếu học sinh không có thời gian nghỉ ngơi, các em sẽ nhanh chóng kiệt sức.' }] },
      ],
    },
    { t: 'rule', formula: 'Đoạn thân bài = Firstly / Secondly, + S + V (ý chính). → This is because / This means that + S + V. → For example, + S + V (cụ thể). → (As a result, + S + V.)', vi: 'Topic → Explain → Example → (Link). Mỗi đoạn MỘT ý, khoảng 90–110 từ.' },
    { t: 'rule', formula: 'This is because + S + V. · This means that + S + V. · As a result, + S + V. · In other words, + S + V.', vi: 'because + mệnh đề / because of + danh từ. Tự hỏi “Tại sao?” rồi “Thì sao?” để có 2 câu giải thích.' },

    { t: 'h', text: '14. Khung trả lời Part 1 — Sở thích & thời gian rảnh (Ngày 8)' },
    {
      t: 'table',
      caption: 'Khung trả lời cho từng kiểu câu hỏi',
      head: ['Kiểu câu hỏi', 'Khung trả lời (2–4 câu)', 'Câu mẫu ngắn'],
      rows: [
        ['(a) What do you do in your free time?', 'In my free time, I usually + V… / I\'m really into + V-ing. → chi tiết (ở đâu, với ai) → It helps me + V.', 'In my free time, I\'m really into cooking. I usually try a new recipe on Sunday. It helps me unwind.'],
        ['(b) How often…?', 'I + V + tần suất (every day / twice a week / once a month), usually + thời điểm. → (But when…, I…)', 'I play badminton twice a week, usually on Tuesday and Friday evenings. But during exams, I hardly play at all.'],
        ['(c) Why do you enjoy…?', 'I enjoy it because + S + V. → (The main reason is that…) → ví dụ nhỏ.', 'I enjoy reading because it takes me to other worlds. Last month I read a novel about Japan and felt like I was there.'],
        ['(d) Do you prefer A or B?', 'I prefer A to B / I\'d rather + V than + V, because… → (But I sometimes…)', 'I prefer outdoor activities to indoor ones because I sit at a desk all day. But on rainy days I\'m happy to stay in.'],
        ['(e) Did you have a hobby as a child?', 'Yes, when I was a child, I + V-ed / used to + V… → (I gave it up / I still… now).', 'Yes, when I was a child, I collected stickers from snack packets. I gave it up at secondary school.'],
        ['(f) Is there a hobby you\'d like to try?', 'I\'d love to take up + N / V-ing, because… → (I\'m planning to…)', 'I\'d love to take up rock climbing, because it looks exciting. I\'m planning to try a class next month.'],
        ['(g) What hobbies are popular in your country?', 'I think + N / V-ing + is/are very popular among + nhóm người, especially… because…', 'I think badminton is very popular among young people in Vietnam, especially in big cities, because it\'s cheap and easy to play in a park.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + prefer + N/V-ing + to + N/V-ing · S + would rather + V + than + V', vi: 'Kiểu (d) — so sánh, chọn một bên. prefer… TO (không phải than); would rather + V nguyên mẫu.', examples: [{ en: 'I prefer reading books to watching films.', vi: 'Tôi thích đọc sách hơn xem phim.' }, { en: 'I\'d rather stay at home than go to a crowded party.', vi: 'Tôi thà ở nhà còn hơn đến một bữa tiệc đông người.' }] },
        { formula: 'When I was a child, I + V-ed / used to + V.', vi: 'Kiểu (e) — hồi nhỏ. Động từ chia quá khứ đơn (Ngày 9 học kỹ).', examples: [{ en: 'When I was a child, I used to fly kites with my father.', vi: 'Hồi nhỏ, tôi hay thả diều với bố.' }] },
        { formula: 'I\'d love to / I\'d like to + take up + N/V-ing', vi: 'Kiểu (f) — mong muốn tương lai. I\'d = I would.', examples: [{ en: 'I\'d love to take up painting one day.', vi: 'Một ngày nào đó tôi rất muốn bắt đầu học vẽ.' }] },
        { formula: 'N / V-ing + is / are + very popular among + nhóm người', vi: 'Kiểu (g) — nói về người khác. Chủ ngữ V-ing (Playing badminton) → is.', examples: [{ en: 'Playing badminton is very popular among office workers in Vietnam.', vi: 'Chơi cầu lông rất phổ biến với dân văn phòng ở Việt Nam.' }] },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~I like reading book.~~ → I like **reading books**. — **book** đếm được → nói chung chung dùng **số nhiều** (ôn Ngày 5)',
        '~~I enjoy to play chess.~~ → I enjoy **playing** chess. — **enjoy + V-ing** (không bao giờ enjoy to V). Cùng nhóm: **finish, avoid, mind + V-ing**',
        '~~I\'m interesting in music.~~ → I\'m **interested in** music. — **interested** (cảm thấy thích — người) ≠ **interesting** (gây hứng thú — vật) — quy tắc -ed / -ing đã học ở Ngày 7',
        '~~I prefer coffee than tea.~~ → I prefer coffee **to** tea. — **prefer A to B**. **than** chỉ dùng với **would rather** (I\'d rather drink coffee **than** tea)',
      ],
    },
    { t: 'rule', formula: 'Trả lời = [câu trả lời thẳng, đúng thì của câu hỏi] + [chi tiết: khi nào / với ai / ở đâu] + [lý do hoặc cảm xúc: It helps me unwind.]', vi: 'do you → hiện tại đơn · did you → quá khứ đơn · would you like → I\'d love to + V · prefer A TO B.' },

    /* ── Ngày 9 ── */

    { t: 'h', text: '15. Hiện tại tiếp diễn & động từ trạng thái (Ngày 9)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + am / is / are + V-ing', vi: 'Khẳng định. I → am · he / she / it / danh từ số ít → is · you / we / they / danh từ số nhiều → are.', examples: [{ en: 'I am answering a message from my team leader.', vi: 'Tôi đang trả lời tin nhắn của trưởng nhóm.' }, { en: 'The volunteers are planting trees along the river.', vi: 'Các tình nguyện viên đang trồng cây dọc bờ sông.' }] },
        { formula: 'S + am / is / are + not + V-ing', vi: 'Phủ định. Viết tắt: I\'m not · he isn\'t · they aren\'t.', examples: [{ en: 'She is not working today; she is at home with her son.', vi: 'Hôm nay cô ấy không làm việc; cô ấy ở nhà với con trai.' }, { en: 'We aren\'t using the meeting room at the moment.', vi: 'Lúc này chúng tôi không dùng phòng họp.' }] },
        { formula: 'Am / Is / Are + S + V-ing? · Wh- + am / is / are + S + V-ing?', vi: 'Câu hỏi: đảo am / is / are lên trước chủ ngữ. Trả lời ngắn: Yes, I am. / No, she isn\'t.', examples: [{ en: 'Are you studying for the IELTS exam this month?', vi: 'Tháng này bạn có đang ôn thi IELTS không?' }, { en: 'What are they doing in the garden?', vi: 'Họ đang làm gì trong vườn vậy?' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Hiện tại tiếp diễn dùng khi nào?',
      head: ['Cách dùng', 'Giải thích', 'Ví dụ'],
      rows: [
        ['① Đang xảy ra **ngay lúc nói**', 'Việc bắt đầu trước lúc nói một chút và chưa xong.', '**Listen!** Someone **is knocking** at the door. — Nghe kìa! Có người đang gõ cửa.'],
        ['② **Tạm thời**, quanh giai đoạn hiện nay', 'Không nhất thiết đang làm đúng giây này, nhưng đang diễn ra **trong tuần này / tháng này / dạo này**, và sẽ kết thúc.', 'I **am staying** with my aunt **this month** because my flat is being repaired. — Tháng này tôi ở nhờ nhà dì.'],
        ['③ **Xu hướng đang thay đổi**', 'Một quá trình **đang tăng / giảm / thay đổi** trong xã hội. Hay đi với **more and more, increasingly, these days, nowadays**.', '**More and more** young people **are volunteering** in their free time. — Ngày càng nhiều bạn trẻ làm tình nguyện lúc rảnh.'],
        ['④ **Kế hoạch đã sắp xếp** cho tương lai gần (nâng cao)', 'Đã hẹn, đã đặt, đã sắp xếp xong. Luôn có **thời gian tương lai** trong câu.', 'I **am meeting** the volunteer coordinator **tomorrow morning**. — Sáng mai tôi gặp người điều phối tình nguyện viên (đã hẹn).'],
      ],
    },
    {
      t: 'table',
      caption: 'Các nhóm động từ trạng thái hay gặp',
      head: ['Nhóm', 'Động từ', 'Ví dụ đúng'],
      rows: [
        ['Suy nghĩ, hiểu biết', 'know, understand, believe, remember, forget, mean, realise, suppose, agree', 'I **understand** the problem now. (~~am understanding~~)'],
        ['Thích / ghét / muốn', 'like, love, hate, prefer, want, need, wish', 'She **wants** to help at the shelter. (~~is wanting~~)'],
        ['Sở hữu', 'have (= có), own, belong to, possess', 'This bike **belongs** to the charity. (~~is belonging~~)'],
        ['Giác quan, vẻ ngoài', 'see, hear, smell, taste, seem, look (= trông có vẻ), sound', 'You **seem** tired today. · That **sounds** great!'],
        ['Khác', 'cost, weigh, contain, depend, matter, consist of', 'The ticket **costs** ten dollars. · It **depends** on the weather.'],
      ],
    },
    { t: 'rule', formula: 'S + am / is / are (+ not) + V-ing · Am / Is / Are + S + V-ing?', vi: 'Đang xảy ra lúc nói · tạm thời quanh hiện tại · xu hướng đang thay đổi · kế hoạch đã hẹn (có mốc tương lai).' },
    { t: 'rule', formula: 'know / like / want / need / believe / understand / belong / seem + V(s/es) — không bao giờ + -ing', vi: 'Động từ chỉ trạng thái (nghĩ, thích, có, giác quan) dùng hiện tại đơn kể cả khi nói "bây giờ". think / have / see có thêm nghĩa hành động thì mới được -ing.' },
    { t: 'rule', formula: 'Thói quen / sự thật: S + V(s/es) · Bây giờ / tạm thời / xu hướng: S + am / is / are + V-ing', vi: 'What do you do? = làm nghề gì · What are you doing? = đang làm gì.' },

    { t: 'h', text: '16. Quá khứ đơn: was / were · V-ed / V2 · did (Ngày 9)' },
    {
      t: 'table',
      caption: 'Quá khứ đơn với động từ be: was / were',
      head: ['Chủ ngữ', 'Hiện tại', 'Quá khứ', 'Ví dụ'],
      rows: [
        ['I', 'am', '**was**', 'I **was** at the farm yesterday.'],
        ['he / she / it / danh từ số ít', 'is', '**was**', 'The weather **was** perfect last Sunday.'],
        ['you / we / they / danh từ số nhiều', 'are', '**were**', 'The volunteers **were** very friendly.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + V-ed / V2', vi: 'Khẳng định — mọi ngôi giống nhau (không có -s ngôi thứ ba).', examples: [{ en: 'We cleaned the whole beach in three hours.', vi: 'Chúng tôi dọn cả bãi biển trong ba tiếng.' }, { en: 'She donated her old books to a village school last year.', vi: 'Năm ngoái cô ấy tặng sách cũ cho một trường làng.' }] },
        { formula: 'S + did not (didn\'t) + V (nguyên mẫu)', vi: 'Phủ định — did đã mang nghĩa quá khứ, động từ chính KHÔNG chia nữa.', examples: [{ en: 'I didn\'t watch the match last night.', vi: 'Tối qua tôi không xem trận đấu.' }, { en: 'The charity didn\'t raise enough money.', vi: 'Tổ chức từ thiện không quyên đủ tiền.' }] },
        { formula: 'Did + S + V (nguyên mẫu)? · Wh- + did + S + V?', vi: 'Câu hỏi. Trả lời ngắn: Yes, I did. / No, I didn\'t.', examples: [{ en: 'Did you enjoy the volunteering trip?', vi: 'Bạn có thích chuyến đi tình nguyện không?' }, { en: 'How long did you stay in the village?', vi: 'Bạn ở lại làng bao lâu?' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Dấu hiệu nhận biết quá khứ đơn',
      head: ['Dấu hiệu', 'Ví dụ'],
      rows: [
        ['yesterday · the day before yesterday', 'I **met** her **yesterday**.'],
        ['last + night / week / month / year / summer', 'We **planted** trees **last weekend**.'],
        ['khoảng thời gian + **ago**', 'She **moved** to Da Nang **three years ago**.'],
        ['in + năm đã qua · in the past', 'The charity **started in 2015**.'],
        ['when I was + tuổi / a child / at school', '**When I was twelve**, I **learnt** to swim.'],
        ['at that time · then · once', '**At that time**, I **didn\'t speak** any English.'],
      ],
    },
    {
      t: 'table',
      caption: 'Quy tắc đọc -ed',
      head: ['Âm cuối của động từ gốc', 'Đọc -ed là', 'Ví dụ'],
      rows: [
        ['/t/ hoặc /d/', '**/ɪd/** — thêm một âm tiết "ịt"', 'want**ed** /ˈwɒntɪd/ · need**ed** /ˈniːdɪd/ · visit**ed** · donat**ed** · decid**ed**'],
        ['âm **vô thanh** (dây thanh không rung): /p/ /k/ /f/ /s/ /ʃ/ /tʃ/ /θ/', '**/t/** — không thêm âm tiết', 'help**ed** /helpt/ · work**ed** /wɜːkt/ · laugh**ed** /lɑːft/ · pass**ed** · wash**ed** /wɒʃt/ · watch**ed** /wɒtʃt/'],
        ['âm **hữu thanh** (dây thanh rung) và **mọi nguyên âm**', '**/d/** — không thêm âm tiết', 'play**ed** /pleɪd/ · clean**ed** /kliːnd/ · liv**ed** /lɪvd/ · volunteer**ed** /ˌvɒlənˈtɪəd/ · stay**ed**'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~I working now.~~ → I **am working** now. — Tiếp diễn cần đủ **am/is/are + V-ing**',
        '~~I am knowing her.~~ / ~~She is wanting…~~ → I **know** her. / She **wants**… — Động từ trạng thái không -ing',
        '~~I am usually walk to school.~~ → I **usually walk** to school. — usually → hiện tại đơn; không ghép am với V nguyên mẫu',
        '~~Yesterday I go to the farm.~~ → Yesterday I **went** to the farm. — Có mốc quá khứ → V2',
        '~~I didn\'t went.~~ / ~~Did you saw…?~~ → I **didn\'t go**. / Did you **see**…? — did + V nguyên mẫu',
      ],
    },
    { t: 'rule', formula: 'I / he / she / it + was · you / we / they + were · Was / Were + S …?', vi: 'was / were + danh từ, tính từ, nơi chốn — không đi với động từ nguyên mẫu (~~was go~~).' },
    { t: 'rule', formula: 'S + V-ed / V2 · S + didn\'t + V · Did + S + V? · Wh- + did + S + V?', vi: 'Có did thì động từ chính về nguyên mẫu (didn\'t go, Did you see…?).' },
    { t: 'rule', formula: 'go → went · have → had · do → did · make → made · see → saw · take → took · buy → bought · rise → rose · fall → fell', vi: 'Động từ bất quy tắc chỉ đổi dạng ở câu KHẲNG ĐỊNH; câu phủ định / câu hỏi vẫn did + V nguyên mẫu.' },
    { t: 'rule', formula: 'S + V2 + mốc quá khứ (yesterday / last… / … ago / in 2019 / when I was…)', vi: 'Việc đã xong ở thời điểm xác định · chuỗi hành động · việc kéo dài đã chấm dứt · thói quen ngày xưa (= used to + V).' },

    /* ── Ngày 10 ── */

    { t: 'h', text: '17. Kết bài Opinion & cả bài 4 đoạn (Ngày 10)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'In conclusion, I firmly believe that + S + V. + S + V + lý do 1, and + S + also + V + lý do 2.', vi: 'Kết bài cho quan điểm ĐỒNG Ý (hoặc không đồng ý) một phía — dễ nhất, an toàn nhất.', examples: [{ en: 'In conclusion, I firmly believe that cooking should be taught at secondary school. It is an essential life skill, and it also helps teenagers eat more healthily.', vi: 'Tóm lại, tôi tin chắc rằng nấu ăn nên được dạy ở trường trung học. Đó là một kỹ năng sống thiết yếu, và nó cũng giúp thanh thiếu niên ăn uống lành mạnh hơn.' }] },
        { formula: 'To conclude, I disagree that + S + V, because + S + V + and + S + V.', vi: 'Kết bài cho quan điểm KHÔNG đồng ý — gói cả quan điểm và lý do trong một câu dài, hoặc tách làm hai.', examples: [{ en: 'To conclude, I disagree that homework should be banned, because it helps students remember lessons and teaches them to work independently.', vi: 'Tóm lại, tôi không đồng ý rằng nên cấm bài tập về nhà, vì nó giúp học sinh nhớ bài và dạy các em tự làm việc.' }] },
        { formula: 'In conclusion, although + S + V (mặt kia), I believe that + S + V + because + lý do 1 + and + lý do 2.', vi: 'Kết bài có NHƯỢNG BỘ (concession — thừa nhận mặt kia một chút) — hợp với đề “To what extent”, nghe chín chắn hơn (band 6+).', examples: [{ en: 'In conclusion, although online learning can feel lonely, I believe its advantages outweigh its drawbacks because it saves time and lets students learn at their own pace.', vi: 'Tóm lại, dù học trực tuyến có thể gây cảm giác cô đơn, tôi tin lợi ích của nó lớn hơn bất lợi vì nó tiết kiệm thời gian và cho người học học theo tốc độ riêng.' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Từ nối cho cả bài Opinion — mỗi vị trí một nhóm',
      head: ['Vị trí', 'Từ nối', 'Lưu ý'],
      rows: [
        ['Mở thân bài 1', '**Firstly, · First of all, · To begin with,**', 'Không viết ~~First of all, firstly~~ (lặp).'],
        ['Mở thân bài 2', '**Secondly, · In addition, · Another reason is that…**', '**Secondly** đi đôi với **Firstly** — dùng cặp cho nhất quán (~~First, … Secondly~~ lệch cặp).'],
        ['Thêm ý trong đoạn', '**Moreover, · Furthermore, · also**', 'Đứng đầu câu, có **dấu phẩy** sau Moreover, / Furthermore,.'],
        ['Đưa ví dụ', '**For example, · For instance, · such as + N**', '**such as** đi với danh từ, không đi với câu: ~~such as students run a club~~.'],
        ['Nêu kết quả', '**As a result, · Therefore, · so**', '**so** nối hai vế trong một câu: …online, **so** they have little contact…'],
        ['Nhượng bộ / đối lập', '**However, · Although + S + V, · while**', '~~Although… but…~~ → chỉ dùng **một** trong hai.'],
        ['Mở kết bài', '**In conclusion, · To conclude, · In summary,**', 'Không dùng ~~In a nutshell~~, ~~Last but not least~~.'],
      ],
    },
    { t: 'rule', formula: 'In conclusion, + I firmly believe / I strongly disagree that + S + V. + It + V + lý do 1, and it also + V + lý do 2.', vi: 'Kết bài = báo hiệu + quan điểm (lời khác) + 2 lý do (lời khác). Không ý mới, không ví dụ mới.' },
    { t: 'rule', formula: 'Bài Opinion = [Paraphrase + I agree because R1 and R2.] + [Firstly, R1 → giải thích → For example… → As a result…] + [Secondly, R2 → …] + [In conclusion, quan điểm (lời khác) + R1 & R2 (lời khác).]', vi: 'R1, R2 = hai lý do. Mỗi lý do xuất hiện 3 lần: thesis → thân bài → kết bài.' },

    { t: 'h', text: '18. Trạng từ tần suất & used to (Ngày 10)' },
    {
      t: 'table',
      caption: 'Từ 100% đến 0%',
      head: ['Trạng từ', 'Mức độ', 'Nghĩa', 'Ví dụ'],
      rows: [
        ['**always**', '100%', 'luôn luôn', 'I **always** have breakfast at home.'],
        ['**usually / normally**', '≈ 90%', 'thường thường', 'I **usually** cycle to school.'],
        ['**often / frequently**', '≈ 70%', 'thường, hay', 'We **often** eat out on Fridays.'],
        ['**sometimes**', '≈ 50%', 'thỉnh thoảng', 'I **sometimes** study in a café.'],
        ['**occasionally**', '≈ 30%', 'đôi khi, lâu lâu', 'I **occasionally** stay up after midnight.'],
        ['**rarely / seldom**', '≈ 10%', 'hiếm khi', 'My father **rarely** watches TV.'],
        ['**hardly ever**', '≈ 5%', 'hầu như không', 'I **hardly ever** drink soft drinks.'],
        ['**never**', '0%', 'không bao giờ', 'I **never** skip breakfast.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + always / usually / often / sometimes / rarely / never + V(s/es)', vi: 'Trạng từ tần suất đứng TRƯỚC động từ thường.', examples: [{ en: 'My sister often reads before bed.', vi: 'Em gái tôi hay đọc sách trước khi ngủ.' }, { en: 'I never drink coffee after 4 p.m.', vi: 'Tôi không bao giờ uống cà phê sau 4 giờ chiều.' }] },
        { formula: 'S + am / is / are + always / usually / often… + adj / N', vi: 'Với động từ to be, trạng từ đứng SAU be.', examples: [{ en: 'I am usually tired on Monday mornings.', vi: 'Sáng thứ Hai tôi thường mệt.' }, { en: 'The bus is rarely on time.', vi: 'Xe buýt hiếm khi đúng giờ.' }] },
        { formula: 'S + don\'t / doesn\'t + usually / often + V · Do / Does + S + usually + V?', vi: 'Câu phủ định và câu hỏi: trạng từ đứng sau trợ động từ, trước động từ chính.', examples: [{ en: 'I don\'t usually eat breakfast.', vi: 'Tôi thường không ăn sáng.' }, { en: 'Do you often go to the cinema?', vi: 'Bạn có hay đi xem phim không?' }] },
        { formula: 'S + V + (O) + every day / once a week / twice a month / three times a year / from time to time', vi: 'Cụm tần suất (nhiều từ) thường đứng CUỐI câu.', examples: [{ en: 'I call my grandparents twice a week.', vi: 'Tôi gọi cho ông bà hai lần một tuần.' }, { en: 'We go camping once or twice a year.', vi: 'Chúng tôi đi cắm trại một hai lần mỗi năm.' }] },
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + used to + V (nguyên mẫu)', vi: 'Khẳng định: trước đây thường làm, bây giờ không còn. Dùng cho MỌI ngôi (I / he / they used to).', examples: [{ en: 'I used to play football every afternoon.', vi: 'Trước đây chiều nào tôi cũng đá bóng.' }, { en: 'My father used to smoke, but he gave up last year.', vi: 'Bố tôi từng hút thuốc, nhưng năm ngoái ông đã bỏ.' }] },
        { formula: 'S + didn\'t use to + V', vi: 'Phủ định: sau didn\'t, used → use (bỏ -d).', examples: [{ en: 'I didn\'t use to like vegetables.', vi: 'Trước đây tôi không thích rau.' }] },
        { formula: 'Did + S + use to + V?', vi: 'Câu hỏi: sau Did, cũng là use (bỏ -d).', examples: [{ en: 'Did you use to watch cartoons on Sunday mornings?', vi: 'Hồi trước bạn có hay xem hoạt hình sáng Chủ nhật không?' }] },
        { formula: 'I used to + V…, but now I + V(s)… / these days I + V(s)…', vi: 'Khung so sánh XƯA – NAY — câu ăn điểm cho mọi câu hỏi “Has… changed?”.', examples: [{ en: 'I used to stay up late gaming, but now I go to bed before eleven.', vi: 'Trước đây tôi hay thức khuya chơi game, nhưng giờ tôi đi ngủ trước mười một giờ.' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Thêm ba cách nói thói quen tự nhiên (band 5.5–6)',
      head: ['Cấu trúc', 'Nghĩa', 'Ví dụ', 'Dùng khi'],
      rows: [
        ['**tend to + V**', 'có xu hướng, thường hay', 'I **tend to** study better at night.', 'Nói thói quen một cách **mềm**, không tuyệt đối — rất tự nhiên trong văn nói.'],
        ['**be in the habit of + V-ing**', 'có thói quen', 'I\'m **in the habit of** checking my email before breakfast.', 'Nhấn mạnh **đây là một thói quen** (tốt hoặc xấu).'],
        ['**would + V** (kể chuyện xưa)', 'ngày xưa hay…', 'Every summer, my grandmother **would** take me to the market.', 'Kể **hồi ức**, thường sau một câu **used to**. Chỉ dùng cho **hành động**, không cho trạng thái: ~~I would live in Hue~~ → I **used to** live in Hue.'],
        ['**These days / Nowadays, S + V(s)**', 'dạo này, ngày nay', '**These days**, I mostly read on my phone.', 'Mở vế **bây giờ** sau khi đã nói chuyện xưa.'],
      ],
    },
    { t: 'rule', formula: 'S + usually / often / never + V · S + be + usually + adj · …+ once / twice / three times + a week (cuối câu)', vi: 'Trạng từ tần suất: TRƯỚC động từ thường, SAU be. Cụm nhiều chữ đứng cuối câu.' },
    { t: 'rule', formula: 'S + used to + V (xưa, nay hết) · S + didn\'t use to + V · Did + S + use to + V? · S + be used to + V-ing (đã quen)', vi: 'Câu so sánh xưa – nay: I used to + V…, but now I + V(s)…' },
    { t: 'rule', formula: 'I tend to + V · I\'m in the habit of + V-ing · I used to + V… and I would + V… · These days, I + V(s)…', vi: 'Thay “I usually” lặp đi lặp lại bằng các cụm này để lên band Lexical Resource.' },

    /* ── Ngày 11 ── */

    { t: 'h', text: '19. Collocation & trật tự từ (Ngày 11)' },
    {
      t: 'table',
      caption: 'Dịch từng chữ (sai) và collocation đúng',
      head: ['Tiếng Việt', 'Dịch từng chữ ❌', 'Collocation đúng ✅'],
      rows: [
        ['mưa to', '~~big rain~~ / ~~strong rain~~', '**heavy** rain'],
        ['giá cao', '~~expensive price~~', 'a **high** price (cái **giá** cao; còn **món đồ** thì expensive)'],
        ['làm bài tập về nhà', '~~make homework~~', '**do** homework'],
        ['mắc lỗi', '~~do a mistake~~', '**make** a mistake'],
        ['đưa ra quyết định', '~~give a decision~~', '**make** / **take** a decision'],
        ['đường đông xe', '~~big traffic~~ / ~~many traffic~~', '**heavy** traffic'],
        ['nghỉ giải lao', '~~rest a break~~', '**take** / **have** a break'],
        ['cà phê đặc', '~~thick coffee~~', '**strong** coffee'],
        ['tích luỹ kinh nghiệm', '~~collect experience~~', '**gain** experience'],
        ['nâng cao nhận thức', '~~rise awareness~~ / ~~make awareness~~', '**raise** awareness'],
        ['đóng vai trò quan trọng', '~~take an important role~~', '**play** an important role'],
        ['rất đồng ý', '~~very agree~~', '**strongly** / **completely** agree'],
      ],
    },
    {
      t: 'table',
      caption: 'Trật tự từ trong câu: S – V – O – cách thức – nơi chốn – thời gian',
      head: ['S', 'V', 'O', 'Cách thức', 'Nơi chốn', 'Thời gian'],
      rows: [
        ['I', 'review', 'my notes', 'carefully', 'at the library', 'every evening.'],
        ['She', 'speaks', 'English', 'very well', '—', '—'],
        ['We', 'met', 'our tutor', '—', 'in her office', 'yesterday.'],
        ['My father', 'goes', '—', 'by motorbike', 'to work', 'every day.'],
      ],
    },
    { t: 'rule', formula: 'Học từ theo CỤM: động từ + danh từ · tính từ + danh từ · trạng từ + tính từ / động từ · từ + giới từ', vi: 'Đừng dịch từng chữ từ tiếng Việt: “mưa to” = heavy rain, “làm lỗi” = make a mistake.' },
    { t: 'rule', formula: 'S + V + O + cách thức + nơi chốn + thời gian  ·  (Thời gian), S + V + O…', vi: 'Không bao giờ chen trạng từ giữa động từ và tân ngữ.' },
    { t: 'rule', formula: 'make + decision / mistake / effort / progress / money · do + homework / research / exercise / damage · take + a break / part in / action · have + an impact on · pay + attention to', vi: 'Học động từ CÙNG danh từ của nó — đây là nhóm collocation dùng nhiều nhất trong Task 2.' },
    { t: 'rule', formula: 'heavy + rain / traffic · strong + wind / coffee · high / low + price / level / rate · a large number of + N (đếm được) · a large amount of + N (không đếm được)', vi: 'Giá, mức, tỉ lệ → high / low; số lượng → large / small number / amount (không dùng ~~big amount of people~~).' },
    { t: 'rule', formula: 'highly + effective / likely · fully + aware · widely + used · strongly + agree / believe · V + sharply / heavily', vi: 'Trạng từ “nhấn mạnh” cũng có bạn đồng hành riêng — very không thay được tất cả.' },
    { t: 'rule', formula: 'a rise / fall / increase IN + N · an increase OF + số · impact / effect ON · reason / demand FOR · solution / access TO · good AT · interested IN · responsible FOR', vi: 'Giới từ đi theo danh từ / tính từ — học cả cụm.' },

    { t: 'h', text: '20. Cụm danh từ (Ngày 11)' },
    {
      t: 'table',
      caption: 'Khung cụm danh từ',
      head: ['Vị trí', 'Loại từ', 'Ví dụ'],
      rows: [
        ['1. Hạn định (determiner)', 'a / an / the / my / this / these / some', '**the**…'],
        ['2. Số lượng', 'two / many / a few / several / most', 'the **two**…'],
        ['3. Tính từ', 'theo thứ tự: ý kiến → kích cỡ → tuổi → màu → nguồn gốc → chất liệu', 'the two **busy modern**…'],
        ['4. Danh từ bổ nghĩa', 'danh từ dùng như tính từ, **số ít**', 'the two busy modern **bus**…'],
        ['5. DANH TỪ CHÍNH', 'head noun', 'the two busy modern bus **stations**'],
        ['6. Phía sau', 'cụm giới từ / mệnh đề quan hệ / V-ing / V3', '…stations **in the city centre** / **that opened last year**'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'N1 (số ít) + N2  — danh từ đứng trước làm “tính từ”', vi: 'Danh từ đứng trước KHÔNG thêm -s, kể cả khi nghĩa là số nhiều.', examples: [{ en: 'a shoe shop (không ~~shoes shop~~) · car parks · a bus station', vi: 'cửa hàng giày · bãi đỗ xe · bến xe buýt' }, { en: 'It\'s a ten-minute walk from here. (không ~~ten-minutes~~)', vi: 'Từ đây đi bộ mười phút.' }, { en: 'She has a three-year-old son.', vi: 'Cô ấy có một cậu con trai ba tuổi.' }] },
        { formula: 'the + N + of + N  =  N + N', vi: 'Hai cách viết cùng một ý — đổi qua lại để paraphrase trong Writing.', examples: [{ en: 'the price of houses = house prices', vi: 'giá nhà' }, { en: 'the number of tourists = tourist numbers', vi: 'số lượng du khách' }] },
        { formula: 'N + cụm giới từ / mệnh đề quan hệ / V-ing / V3', vi: 'Thông tin dài đặt SAU danh từ chính.', examples: [{ en: 'students living in dormitories', vi: 'sinh viên sống trong ký túc xá' }, { en: 'the money spent on advertising', vi: 'số tiền chi cho quảng cáo' }, { en: 'people who work from home', vi: 'những người làm việc tại nhà' }] },
      ],
    },
    { t: 'rule', formula: '(the / my) + (số lượng) + (tính từ: ý kiến → cỡ → tuổi → màu → nguồn gốc → chất liệu) + (N bổ nghĩa, số ít) + N CHÍNH + (in… / who… / V-ing / V3)', vi: 'Tính từ và danh từ bổ nghĩa đứng TRƯỚC; thông tin dài đứng SAU danh từ chính.' },

    { t: 'h', text: '21. Writing Task 1 — tả xu hướng theo thời gian (Ngày 11, Ngày 12)' },
    {
      t: 'table',
      caption: 'Động từ ↔ danh từ (tả cùng một thay đổi bằng hai cách)',
      head: ['Động từ', 'Danh từ', 'Ví dụ với danh từ (biểu đồ sân bay)'],
      rows: [
        ['rise / increase / grow', 'a rise · an increase · growth (U)', 'There was **a steady rise in** passenger numbers between 2016 and 2019.'],
        ['fall / decrease / decline / drop', 'a fall · a decrease · a decline · a drop', '2020 saw **a dramatic drop of** 19 million passengers.'],
        ['peak', 'a peak', 'Passenger numbers **reached a peak of** 24 million in 2019.'],
        ['recover', 'a recovery', 'There was **a strong recovery** between 2021 and 2023.'],
        ['fluctuate', 'a fluctuation', 'The water park figures showed **considerable fluctuation**.'],
        ['remain stable / level off', 'stability (U)', 'The final year showed **stability** at 22 million.'],
      ],
    },
    {
      t: 'table',
      caption: 'Từ mạnh nhất đến nhẹ nhất (trạng từ đi với động từ, tính từ đi với danh từ)',
      head: ['Trạng từ (+ V)', 'Tính từ (+ N)', 'Mức độ', 'Ví dụ khớp biểu đồ'],
      rows: [
        ['dramatically', 'dramatic', 'rất lớn, gây sốc', 'fell **dramatically** (24 → 5 triệu)'],
        ['sharply · steeply', 'sharp · steep', 'mạnh và nhanh (đường dốc)', 'a **sharp** rise between 2021 and 2022 (8 → 16)'],
        ['significantly · considerably · substantially', 'significant · considerable · substantial', 'đáng kể', 'The zoo grew **significantly** (40 → 83)'],
        ['moderately', 'moderate', 'vừa phải', 'a **moderate** increase'],
        ['steadily', 'steady', 'đều đặn (mỗi kỳ một ít)', 'rose **steadily** by 3 million a year'],
        ['gradually', 'gradual', 'từ từ, chậm', 'a **gradual** decline'],
        ['slightly · marginally', 'slight · marginal', 'nhẹ, rất ít', '**slightly** (25 → 26)'],
        ['rapidly · quickly', 'rapid · quick', '**tốc độ** nhanh', '**rapid** growth'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + V (rose / fell / fluctuated) + adv + (from X to Y / by Z)', vi: 'Khung 1 — chủ ngữ là thứ thay đổi, động từ + trạng từ. Dễ nhất, dùng nhiều nhất.', examples: [{ en: 'Passenger numbers rose steadily from 15 million in 2016 to 24 million in 2019.', vi: 'Số hành khách tăng đều từ 15 triệu năm 2016 lên 24 triệu năm 2019.' }] },
        { formula: 'There + was + a / an + adj + N (rise / fall…) + in + S + (from X to Y)', vi: 'Khung 2 — biến động thành danh từ, tính từ đứng trước danh từ.', examples: [{ en: 'There was a dramatic fall in the number of passengers in 2020.', vi: 'Năm 2020 có một sự sụt giảm mạnh về số hành khách.' }] },
        { formula: 'S (năm / nơi) + saw / experienced + a / an + adj + N + (of + số)', vi: 'Khung 3 — chủ ngữ là năm hoặc địa điểm “chứng kiến” sự thay đổi.', examples: [{ en: '2020 saw a sharp drop of 19 million passengers.', vi: 'Năm 2020 chứng kiến số hành khách giảm mạnh 19 triệu.' }, { en: 'The art museum experienced a steady decline in visitors.', vi: 'Bảo tàng mỹ thuật có lượng khách giảm đều.' }] },
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'The line graph / bar chart + illustrates / compares + the proportion of / how many + N + (that) + V + … + between X and Y.', vi: 'Câu mở bài: một câu, viết lại toàn bộ đề, KHÔNG thêm nhận xét.', examples: [{ en: 'The line graph illustrates the proportion of households in one country that owned three types of computer device between 2004 and 2024.', vi: 'Biểu đồ đường cho thấy tỉ lệ hộ gia đình ở một quốc gia sở hữu ba loại thiết bị máy tính từ 2004 đến 2024.' }] },
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'Overall, + N1 + rose / fell + adv, whereas / while + N2 + V-ed.', vi: 'Overview: hai xu hướng trái ngược trong một câu.', examples: [{ en: 'Overall, laptop ownership rose steadily, whereas desktop computers became less popular.', vi: 'Nhìn chung, tỉ lệ sở hữu laptop tăng đều, trong khi máy để bàn kém phổ biến dần.' }] },
        { formula: 'In + năm, + số + of + N + V-ed…, more than / almost + twice / three times + the figure for + N2.', vi: 'Câu đầu thân bài: điểm xuất phát + so sánh hai nhóm.', examples: [{ en: 'In 2004, 62% of households owned a desktop, more than three times the figure for laptops.', vi: 'Năm 2004, 62% hộ có máy để bàn, gấp hơn ba lần con số của laptop.' }] },
        { formula: 'S + V-ed + adv + from X in + năm + to Y in + năm + and + peaked at / finished at + Z.', vi: 'Một câu “kể” cả chặng đường của một đường.', examples: [{ en: 'Ownership grew rapidly from 15% in 2012 to 37% in 2016 and peaked at 45% in 2020.', vi: 'Tỉ lệ sở hữu tăng nhanh từ 15% năm 2012 lên 37% năm 2016 và đạt đỉnh 45% năm 2020.' }] },
        { formula: '…, reaching / finishing at + số  ·  …, which was + still / well + above / below + N', vi: 'Nối thêm thông tin vào cuối câu bằng V-ing hoặc which — nâng điểm ngữ pháp.', examples: [{ en: 'Desktop ownership fell sharply, reaching just 24% in 2024.', vi: 'Tỉ lệ sở hữu máy để bàn giảm mạnh, chỉ còn 24% năm 2024.' }] },
      ],
    },
    { t: 'rule', formula: 'S + rose / fell + adv + from X to Y · There was a + adj + rise / fall + in + S · S (năm) + saw a + adj + rise / drop + of + số', vi: 'Ba khung câu xoay vòng để không lặp — động từ đi với TRẠNG từ, danh từ đi với TÍNH từ.' },
    { t: 'rule', formula: 'Between X and Y, S + V-ed + adv · S + V-ed + to + số + by + năm · S + peaked in + năm and fell + adv + thereafter', vi: 'Cụm thời gian đầu câu hoặc cuối câu; số xấp xỉ: about / around / just over / nearly + số.' },
    { t: 'rule', formula: 'The + line graph / bar chart + illustrates / compares + how many / the proportion of + N + V + between X and Y.', vi: 'Mở bài Task 1 = viết lại đề bằng từ khác: shows → illustrates, the number of → how many, from…to → between…and.' },
    { t: 'rule', formula: 'Intro (paraphrase) → Overall, N1 + V-ed…, whereas N2 + V-ed… → Body 1: In + năm, số… → V-ed + adv + from X to Y… → Body 2: …peaked at…, …dipped slightly to…', vi: 'Task 1 theo thời gian: 4 đoạn, quá khứ đơn, số ở thân bài, so sánh ở mọi câu có thể.' },

    /* ── Ngày 12 ── */

    { t: 'h', text: '22. Khung trả lời câu hỏi quan điểm O–R–E (Ngày 12)' },
    {
      t: 'table',
      caption: 'Cụm cho từng bước',
      head: ['Bước', 'Cụm dùng được', 'Lưu ý'],
      rows: [
        ['**Opinion** (mạnh)', 'I\'m absolutely convinced that… · I strongly believe that… · Definitely.', 'Dùng khi bạn **thật sự chắc**.'],
        ['**Opinion** (vừa)', 'I think… · I believe… · In my opinion, … · Personally, I feel that…', 'An toàn nhất. **Chỉ chọn một**: ~~In my opinion, I think~~.'],
        ['**Opinion** (dè dặt)', 'I\'d say… · I guess… · I suppose… · It depends on… · To some extent, …', 'Hợp câu hỏi khó / không có câu trả lời rõ.'],
        ['**Reason**', 'because… · since… · The main reason is that… · This is mainly because…', 'Sau **because** là **mệnh đề** (S + V); sau **because of** là **danh từ**.'],
        ['**Example**', 'For example, … · For instance, … · Take my brother — he… · In my case, …', 'Ví dụ **cụ thể** (tên, số, nơi chốn) nghe thật hơn.'],
        ['**Mặt kia**', 'That said, … · Having said that, … · Of course, some people might argue that…', 'Cho thấy bạn nghĩ **hai chiều** — điểm cộng ở Part 3.'],
        ['**Chốt**', 'So overall, … · That\'s why I think… · So, all in all, …', 'Một câu ngắn quay lại quan điểm.'],
        ['**Câu câu giờ**', 'That\'s an interesting question. · I\'ve never really thought about it, but…', 'Dùng **một lần**, rồi trả lời ngay. Đừng im lặng.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'Yes, I think so / No, I don\'t think so, + because + S + V. + For example, + S + V.', vi: 'Part 1 — trả lời Do you think…? trong 2–3 câu.', examples: [{ en: 'Yes, I think so, because sleep helps me remember what I study. For example, when I sleep less than six hours, I forget new words very quickly.', vi: 'Có, tôi nghĩ vậy, vì giấc ngủ giúp tôi nhớ những gì đã học. Ví dụ, khi ngủ ít hơn sáu tiếng, tôi quên từ mới rất nhanh.' }] },
        { formula: 'I don\'t think + S + V (khẳng định), because + S + V.', vi: 'Phủ định ở THINK, vế sau giữ khẳng định.', examples: [{ en: 'I don\'t think phones should be banned at school, because students can use them to look things up.', vi: 'Tôi không nghĩ nên cấm điện thoại ở trường, vì học sinh có thể dùng để tra cứu.' }] },
        { formula: 'I\'d say + S + V, mainly because + S + V. That said, + S + V. So overall, + S + V.', vi: 'Part 3 — có quan điểm, lý do, mặt kia, và chốt.', examples: [{ en: 'I\'d say cycling is a great option for short trips, mainly because it\'s cheap and healthy. That said, it isn\'t practical when it\'s very hot or raining heavily. So overall, it works best alongside buses.', vi: 'Tôi cho rằng đạp xe là lựa chọn tuyệt vời cho quãng ngắn, chủ yếu vì rẻ và tốt cho sức khoẻ. Dù vậy, nó không tiện khi trời quá nóng hoặc mưa to. Nên nhìn chung, nó hiệu quả nhất khi đi kèm xe buýt.' }] },
      ],
    },
    { t: 'rule', formula: 'O: I think / I\'d say + S + V → R: because + S + V → E: For example, + S + V → (Part 3) That said, + S + V → So overall, + S + V', vi: 'Part 1 dừng sau E (2–3 câu). Part 3 đi đủ năm bước (4–6 câu).' },

    /* ── Ngày 13 ── */

    { t: 'h', text: '23. Động từ khuyết thiếu: luật chung · khả năng · xin phép (Ngày 13)' },
    {
      t: 'table',
      caption: 'Các modal hay gặp nhất trong IELTS',
      head: ['Modal', 'Nghĩa chính', 'Ví dụ'],
      rows: [
        ['**can**', 'có thể, biết (khả năng); được phép (thân mật)', 'She **can** speak three languages.'],
        ['**could**', 'đã có thể (quá khứ); xin phép/nhờ lịch sự; có lẽ', '**Could** you open the window, please?'],
        ['**may**', 'được phép (trang trọng); có lẽ (~50%)', 'Students **may** use a dictionary. / It **may** rain later.'],
        ['**might**', 'có lẽ, có thể (kém chắc hơn may một chút)', 'I **might** study abroad next year.'],
        ['**must**', 'phải (người nói thấy cần); chắc hẳn là', 'You **must** be tired after the flight.'],
        ['**have to**', 'phải (do luật lệ, hoàn cảnh bên ngoài)', 'I **have to** wear a uniform at work.'],
        ['**should**', 'nên (lời khuyên, giải pháp)', 'The government **should** build more libraries.'],
        ['**ought to**', 'nên (= should, trang trọng hơn một chút)', 'We **ought to** recycle more.'],
        ['**will / would**', 'sẽ / sẽ (giả định, lịch sự)', 'I **would** like to work in a hospital.'],
        ['**need to / needn\'t**', 'cần / không cần', 'You **needn\'t** bring food — lunch is provided.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + modal + V', vi: 'Khẳng định — modal giữ nguyên với mọi chủ ngữ.', examples: [{ en: 'My brother can fix computers.', vi: 'Anh tôi biết sửa máy tính.' }, { en: 'You should drink more water.', vi: 'Bạn nên uống nhiều nước hơn.' }] },
        { formula: 'S + modal + not + V', vi: 'Phủ định — viết tắt: can\'t, couldn\'t, mustn\'t, shouldn\'t, won\'t (= will not). Riêng cannot viết LIỀN.', examples: [{ en: 'I can\'t find my keys.', vi: 'Tôi không tìm thấy chìa khoá.' }, { en: 'Children shouldn\'t use phones before bed.', vi: 'Trẻ em không nên dùng điện thoại trước khi ngủ.' }] },
        { formula: 'Modal + S + V…? · Wh- + modal + S + V?', vi: 'Câu hỏi — đảo modal lên đầu, không dùng do / does.', examples: [{ en: 'Could you speak more slowly, please?', vi: 'Bạn có thể nói chậm hơn được không?' }, { en: 'What should I do if I miss the bus?', vi: 'Tôi nên làm gì nếu lỡ xe buýt?' }] },
      ],
    },
    { t: 'rule', formula: 'S + modal (can / could / may / might / must / should / will / would) + V · S + modal + not + V · Modal + S + V?', vi: 'Modal không đổi theo chủ ngữ, theo sau là động từ nguyên mẫu không to; phủ định và câu hỏi không mượn do/does.' },
    { t: 'rule', formula: 'Hiện tại: S + can + V · Quá khứ: S + could / was able to + V · Tương lai: S + will be able to + V', vi: 'Một lần làm được việc khó trong quá khứ → was able to / managed to, không phải could.' },
    { t: 'rule', formula: 'Can / Could / May + I + V? (xin phép) · Can / Could / Would + you + V? (nhờ) · Would you mind + V-ing? · Shall I + V? (đề nghị giúp)', vi: 'could / would trong câu hỏi = lịch sự, không phải quá khứ. may = trang trọng nhất.' },

    { t: 'h', text: '24. Modal: bắt buộc · cấm · lời khuyên · phỏng đoán (Ngày 13)' },
    {
      t: 'table',
      caption: 'Bắt buộc, cấm đoán và “không cần”: must · have to · mustn\'t · don\'t have to',
      head: ['Dạng', 'Nghĩa', 'Ví dụ', 'Dịch'],
      rows: [
        ['**must** + V', 'phải (người nói thấy cần; nội quy viết)', 'I **must** call my mum tonight. / Passengers **must** wear seat belts.', 'Tối nay tôi phải gọi cho mẹ. / Hành khách phải thắt dây an toàn.'],
        ['**have to / has to** + V', 'phải (do luật, công việc, hoàn cảnh bên ngoài)', 'Nurses **have to** work at night. / She **has to** take two buses to school.', 'Y tá phải làm đêm. / Cô ấy phải đi hai chuyến xe buýt đến trường.'],
        ['**mustn\'t** + V', '**CẤM**, không được làm', 'You **mustn\'t** use your phone in the exam room.', 'Bạn không được dùng điện thoại trong phòng thi.'],
        ['**don\'t / doesn\'t have to** + V', '**KHÔNG CẦN**, không bắt buộc (làm cũng được)', 'You **don\'t have to** bring a pen — we provide them.', 'Bạn không cần mang bút — chúng tôi có sẵn.'],
        ['**needn\'t** + V / **don\'t need to** + V', 'không cần (= don\'t have to)', 'You **needn\'t** print the form.', 'Bạn không cần in mẫu đơn.'],
        ['**had to** + V', 'đã phải (quá khứ của CẢ must và have to)', 'I **had to** retake the exam last year.', 'Năm ngoái tôi đã phải thi lại.'],
        ['**will have to** + V', 'sẽ phải', 'You **will have to** show your passport.', 'Bạn sẽ phải trình hộ chiếu.'],
      ],
    },
    {
      t: 'table',
      caption: 'Phỏng đoán (deduction): must · may · might · could · can\'t',
      head: ['Modal', 'Độ chắc', 'Ví dụ (có bằng chứng)', 'Dịch'],
      rows: [
        ['**must** + V', 'gần như chắc chắn ĐÚNG', 'The lights are off. They **must be** asleep.', 'Đèn tắt rồi. Chắc hẳn họ ngủ rồi.'],
        ['**may / might / could** + V', 'có thể đúng, có thể sai', 'Take an umbrella. It **might rain** this afternoon.', 'Mang ô theo. Chiều nay có thể mưa.'],
        ['**may not / might not** + V', 'có thể KHÔNG', 'He **may not know** the answer.', 'Có thể anh ấy không biết câu trả lời.'],
        ['**can\'t / couldn\'t** + V', 'gần như chắc chắn SAI', 'That **can\'t be** Lan. She\'s in Japan this week.', 'Đó không thể là Lan được. Tuần này cô ấy ở Nhật.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~She can speaks English.~~ → She can **speak** English. — Sau modal là V nguyên mẫu, không -s',
        '~~You must to wear a helmet.~~ → You must **wear** a helmet. — must không đi với to (chỉ have to / ought to có to)',
        '~~I will can help you tomorrow.~~ → I **will be able to** help you tomorrow. — Hai modal không đứng liền nhau',
        '~~Do you can swim?~~ → **Can you** swim? — Câu hỏi đảo modal, không mượn do',
      ],
    },
    { t: 'rule', formula: 'must / have to + V = phải · mustn\'t + V = CẤM · don\'t have to / needn\'t + V = KHÔNG CẦN · had to + V = đã phải', vi: 'Hỏi: “làm thì có sao không?” — có sao → mustn\'t; không sao → don\'t have to.' },
    { t: 'rule', formula: 'S + should / ought to + V (nên) · S + had better (not) + V (cảnh báo) · I don\'t think + S + should + V', vi: 'Task 2: should / ought to để đưa giải pháp; had better chỉ dùng khi nói chuyện thân mật.' },
    { t: 'rule', formula: 'must + V (chắc chắn đúng) · may / might / could + V (có thể) · can\'t + V (chắc chắn sai)', vi: 'Phỏng đoán dựa vào bằng chứng. Không dùng mustn\'t để nói “chắc là không”.' },
    { t: 'rule', formula: 'Task 2: S + should + V (giải pháp) · S + can / may + V (khả năng chung) · This could / may + lead to + N (hậu quả)', vi: 'Thêm modal + từ chỉ mức độ (some, often) để câu không khẳng định tuyệt đối.' },

    /* ── Ngày 14 ── */

    { t: 'h', text: '25. Bài luận thảo luận hai mặt — Discussion (Ngày 14)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'Some people argue / believe that + S + V, while / whereas others feel / think that + S + V.', vi: 'Câu 1 — paraphrase CẢ HAI quan điểm trong một câu (hoặc tách hai câu bằng Others, however, …).', examples: [{ en: 'Some people argue that online courses will soon take the place of traditional classrooms, while others believe that face-to-face teaching will always be needed.', vi: 'Một số người lập luận rằng khoá học trực tuyến sẽ sớm thay chỗ lớp học truyền thống, trong khi những người khác tin rằng dạy trực tiếp sẽ luôn cần thiết.' }] },
        { formula: 'In my opinion, / I believe that + S + V (+ although + S + V).', vi: 'Câu 2 — nêu ý kiến ngay ở mở bài. Thêm although để thừa nhận phía kia (cho thấy bạn công bằng).', examples: [{ en: 'In my opinion, although online learning will continue to grow, it cannot completely replace classroom teaching.', vi: 'Theo tôi, dù học trực tuyến sẽ tiếp tục phát triển, nó không thể thay thế hoàn toàn việc dạy trên lớp.' }] },
        { formula: 'This essay will discuss both views before explaining why I support the latter / the former.', vi: 'Câu tuỳ chọn — báo dàn bài. the former = cái thứ nhất (A); the latter = cái thứ hai (B).', examples: [{ en: 'This essay will discuss both views before explaining why I support the latter.', vi: 'Bài luận này sẽ bàn cả hai quan điểm trước khi giải thích vì sao tôi ủng hộ quan điểm sau.' }] },
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'On the one hand, + some people / those who + V + argue that + S + V. + This is because + S + V. + For example, + S + V.', vi: 'Thân bài 1 — trình bày CÔNG BẰNG quan điểm A.', examples: [{ en: 'On the one hand, some people argue that online learning is more convenient. This is because students can study at any time. For example, working parents can watch lectures after their children go to bed.', vi: 'Một mặt, một số người lập luận rằng học trực tuyến tiện hơn. Đó là vì sinh viên có thể học bất cứ lúc nào. Ví dụ, phụ huynh đi làm có thể xem bài giảng sau khi con đi ngủ.' }] },
        { formula: 'On the other hand, + I agree with those who believe that + S + V. + The main reason is that + S + V.', vi: 'Thân bài 2 — quan điểm B + ý kiến của bạn trong cùng câu chủ đề.', examples: [{ en: 'On the other hand, I agree with those who believe that classroom teaching is irreplaceable. The main reason is that students learn a great deal from interacting with others.', vi: 'Mặt khác, tôi đồng ý với những người tin rằng dạy trên lớp là không thể thay thế. Lý do chính là học sinh học được rất nhiều từ việc tương tác với người khác.' }] },
        { formula: 'In conclusion, while + S + V (phía A), I believe that + S + V (phía B).', vi: 'Kết bài — một câu nhắc cả hai phía, khẳng định ý kiến; câu thứ hai (tuỳ chọn) đưa gợi ý / dự đoán.', examples: [{ en: 'In conclusion, while online courses offer flexibility, I believe that schools will remain essential because they teach social skills.', vi: 'Tóm lại, dù khoá học trực tuyến mang lại sự linh hoạt, tôi tin rằng trường học vẫn thiết yếu vì chúng dạy kỹ năng xã hội.' }] },
      ],
    },
    { t: 'rule', formula: 'Mở bài = Some people argue that + [A], while others believe that + [B]. + In my opinion, (although + S + V,) + S + V.', vi: 'Hai quan điểm trong câu 1, ý kiến của bạn trong câu 2 — không bao giờ để giám khảo phải đoán.' },
    { t: 'rule', formula: 'Thân 1: On the one hand, some people argue that + [A] + This is because… + For example… · Thân 2: On the other hand, I agree with those who believe that + [B] + The main reason is that… · Kết: In conclusion, while + [A], I believe that + [B].', vi: 'Ý người khác → some people argue / those who…; ý của mình → I agree / I believe. Mỗi đoạn thân bài: câu chủ đề → lý do → ví dụ.' },

    { t: 'h', text: '26. Speaking Part 2 kể chuyện quá khứ & Part 3 (Ngày 14)' },
    {
      t: 'table',
      caption: 'Từ nối thời gian — giúp câu chuyện trôi chảy (Fluency & Coherence)',
      head: ['Vị trí trong câu chuyện', 'Từ nối', 'Ví dụ'],
      rows: [
        ['Bắt đầu', 'First · At first · In the beginning', '**At first**, I didn\'t want to go.'],
        ['Tiếp theo', 'Then · Next · After that · Later', '**After that**, we boiled the cakes.'],
        ['Cùng lúc', 'While · When · Meanwhile', '**While** we were waiting, it started to rain.'],
        ['Bất ngờ', 'Suddenly · All of a sudden · Just then', '**Suddenly**, the rice fell out.'],
        ['Kết thúc', 'Finally · Eventually · In the end', '**In the end**, I made a good one.'],
        ['Mốc thời gian', 'about three years ago · last summer · the next day · a week before Tet', 'It happened **about three years ago**.'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + V-ed / V2 (quá khứ đơn) · S + didn\'t + V · Did + S + V?', vi: 'Kể từng việc đã xảy ra, theo thứ tự.', examples: [{ en: 'First, she showed me how to fold the leaves. Then I tried it myself.', vi: 'Đầu tiên, bà chỉ tôi cách gói lá. Rồi tôi tự làm thử.' }] },
        { formula: 'S + was / were + V-ing (quá khứ tiếp diễn) + when + S + V2', vi: 'Tả BỐI CẢNH đang diễn ra thì một việc khác xen vào (đã học Ngày 9).', examples: [{ en: 'We were waiting for the bus when it started to rain.', vi: 'Chúng tôi đang chờ xe buýt thì trời bắt đầu mưa.' }] },
        { formula: 'I felt + adj (+ because + S + V) · It was + adj + to V', vi: 'Kết câu chuyện bằng cảm xúc — dòng “explain” của thẻ đề.', examples: [{ en: 'I felt really proud because my cake didn\'t fall apart.', vi: 'Tôi thấy rất tự hào vì cái bánh của tôi không bị vỡ.' }, { en: 'It was amazing to see the sunrise from the top of the mountain.', vi: 'Thật tuyệt khi ngắm bình minh từ đỉnh núi.' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Part 3 — thảo luận nối tiếp',
      head: ['Bước', 'Làm gì', 'Cụm mở đầu'],
      rows: [
        ['**O** — Opinion', 'Nêu ý kiến thẳng, trả lời đúng câu hỏi', 'I\'d say… / I think… / Yes, I believe so. / Not really.'],
        ['**R** — Reason', 'Giải thích vì sao', 'The main reason is that… / This is because…'],
        ['**E** — Example', 'Ví dụ cụ thể (người khác, xã hội, bản thân)', 'For example… / In my country… / I\'ve noticed that…'],
        ['(+) Ý ngược lại', 'Thêm mặt khác để thể hiện suy nghĩ sâu', 'That said, … / However, … / On the other hand, …'],
      ],
    },
    { t: 'rule', formula: 'Mở: I\'d like to talk about the time I + V2… · Kể: First, + S + V2… Then… After that… In the end… · Kết: I felt + adj + because + S + V2.', vi: 'Toàn bộ câu chuyện ở quá khứ; chỉ câu cuối (Now I…) mới dùng hiện tại.' },

    /* ── Ngày 15 ── */

    { t: 'h', text: '27. Câu bị động — mọi thì đã học (Ngày 15)' },
    {
      t: 'patterns',
      rows: [
        { formula: 'S + be (am / is / are / was / were / will be…) + V3 (+ by + O)', vi: 'Công thức chung. be là động từ duy nhất thay đổi theo thì; V3 không bao giờ đổi.', examples: [{ en: 'Coffee is grown in the Central Highlands.', vi: 'Cà phê được trồng ở Tây Nguyên.' }, { en: 'The museum was designed by a Japanese architect.', vi: 'Bảo tàng được thiết kế bởi một kiến trúc sư người Nhật.' }] },
      ],
    },
    {
      t: 'table',
      caption: 'Bị động theo từng thì — bảng tổng',
      head: ['Thì', 'Chủ động', 'Bị động', 'Ví dụ bị động'],
      rows: [
        ['Hiện tại đơn', 'S + V(s/es)', 'S + **am / is / are + V3**', 'Rice **is grown** in the delta.'],
        ['Hiện tại tiếp diễn', 'S + am / is / are + V-ing', 'S + **am / is / are being + V3**', 'A new bridge **is being built**.'],
        ['Quá khứ đơn', 'S + V2 / V-ed', 'S + **was / were + V3**', 'The school **was built** in 1995.'],
        ['Quá khứ tiếp diễn (thêm)', 'S + was / were + V-ing', 'S + **was / were being + V3**', 'The road **was being repaired** when I arrived.'],
        ['Hiện tại hoàn thành (thêm)', 'S + have / has + V3', 'S + **have / has been + V3**', 'The factory **has been converted** into flats.'],
        ['Tương lai đơn', 'S + will + V', 'S + **will be + V3**', 'A hospital **will be opened** next year.'],
        ['Modal (Ngày 13)', 'S + can / must / should + V', 'S + **can / must / should be + V3**', 'Glass **can be recycled** many times.'],
      ],
    },
    {
      t: 'table',
      caption: 'Phủ định và câu hỏi ở bị động',
      head: ['Thì', 'Phủ định', 'Câu hỏi'],
      rows: [
        ['Hiện tại đơn', 'The room **isn\'t cleaned** every day.', '**Is** the room **cleaned** every day?'],
        ['Quá khứ đơn', 'The tickets **weren\'t sold** online.', '**Were** the tickets **sold** online?'],
        ['Hiện tại tiếp diễn', 'The road **isn\'t being repaired**.', '**Is** the road **being repaired**?'],
        ['Tương lai / modal', 'The library **won\'t be closed**. / It **can\'t be recycled**.', '**Will** the library **be closed**? / **Can** it **be recycled**?'],
        ['Câu hỏi Wh-', '—', '**Where were** these photos **taken**? · **When was** the bridge **built**?'],
      ],
    },
    {
      t: 'table',
      caption: 'Động từ KHÔNG có bị động — bẫy lớn',
      head: ['Động từ', 'Sai', 'Đúng'],
      rows: [
        ['happen / occur (xảy ra)', '~~The accident was happened at 9 p.m.~~', 'The accident **happened** at 9 p.m.'],
        ['take place (diễn ra)', '~~The festival is taken place in May.~~', 'The festival **takes place** in May.'],
        ['arrive (đến)', '~~The train was arrived late.~~', 'The train **arrived** late.'],
        ['rise / fall (tăng / giảm — Task 1)', '~~The number of tourists was risen.~~', 'The number of tourists **rose**.'],
        ['die (chết)', '~~Many fish were died.~~', 'Many fish **died**.'],
        ['appear / disappear (xuất hiện / biến mất)', '~~The forest has been disappeared.~~', 'The forest **has disappeared**.'],
        ['remain (vẫn giữ nguyên)', '~~The school was remained the same.~~', 'The school **remained** the same / **remained unchanged**.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~The bridge built in 1990.~~ → The bridge **was built** in 1990. — Thiếu **be** → thành chủ động vô nghĩa (cây cầu tự xây)',
        '~~Rice is grew here.~~ → Rice is **grown** here. — Sau be dùng **V3**, không dùng V2',
        '~~The leaves is dried.~~ → The leaves **are** dried. — be chia theo chủ ngữ **số nhiều**',
        '~~Glass can recycled.~~ → Glass can **be** recycled. — Sau modal là **be + V3**',
      ],
    },
    { t: 'rule', formula: 'Chủ động: S + V + O → Bị động: O (làm S mới) + be (chia theo thì + S mới) + V3 (+ by + S cũ)', vi: 'Chỉ đổi được khi động từ có tân ngữ. by + người làm chỉ giữ khi thông tin đó quan trọng.' },
    { t: 'rule', formula: 'S + will / can / must / should / may + be + V3', vi: 'Tương lai & modal bị động — be luôn nguyên mẫu sau will và modal.' },

    { t: 'h', text: '28. Writing Task 1 — bản đồ & quy trình (Ngày 15)' },
    {
      t: 'table',
      caption: 'Từ nối trình tự — mỗi bước một từ nối khác nhau',
      head: ['Vị trí', 'Từ nối', 'Ví dụ trong bài mẫu'],
      rows: [
        ['Bước đầu', 'First / Firstly / To begin with / At the first stage', '**First**, tea leaves are picked by hand…'],
        ['Bước giữa', 'Then / Next / After that / Following this / Subsequently', '**Next**, the leaves are rolled by a machine…'],
        ['Nối hai bước', 'Once + S + have/has been + V3 / After + V-ing', '**Once** they have been dried, the tea is sorted…'],
        ['Bước cuối', 'Finally / Lastly / At the final stage', '**Finally**, it is packed and sent to shops.'],
        ['Chỉ thời lượng / điều kiện', 'for + khoảng thời gian · at + nhiệt độ · until + …', 'left to wither **for** 12 to 16 hours · **at** about 90°C'],
      ],
    },
    { t: 'rule', formula: 'Từ nối (First / Next / After that / Once… / Finally) + S + is / are (+ then) + V3 (+ by machine / for + thời gian / at + nhiệt độ)', vi: 'Khung câu mô tả quy trình — hiện tại đơn bị động, mỗi bước một từ nối.' },
    { t: 'rule', formula: 'In [năm cũ], the [vị trí] was + N, but this has since been replaced by / converted into + N. · N + has / have been + V3 (+ to make way for + N). · N + has / have remained unchanged.', vi: 'Khung câu bản đồ “trước – sau”: vị trí + thì đúng + động từ biến đổi ở bị động.' },
    { t: 'rule', formula: 'The diagram illustrates how + N + is / are + V3. + The process consists of [số] stages, from [bước đầu] to [bước cuối]. + First / Next / After that / Finally + S + is / are + V3.', vi: 'Khung bài quy trình: mở bài (paraphrase đề) + tổng quan (số bước, đầu, cuối) + từng bước bị động có từ nối.' },

    /* ── Bảng chốt ── */
    { t: 'h', text: '29. Bảng chốt: gặp chủ ngữ nào thì dùng gì?' },
    {
      t: 'table',
      head: ['Chủ ngữ', 'be', 'Động từ thường', 'Phủ định', 'Câu hỏi', 'Đang làm (Ngày 9)', 'Quá khứ (Ngày 9)'],
      rows: [
        ['I', 'am', 'work', "don't work · I'm not", 'Do I…? · Am I…?', 'am working', "was · worked · didn't work"],
        ['you / we / they / N số nhiều', 'are', 'work', "don't work · aren't", 'Do they…? · Are they…?', 'are working', "were · worked · didn't work"],
        ['he / she / it / N số ít / N không đếm được', 'is', 'works', "doesn't work · isn't", 'Does she…? · Is she…?', 'is working', "was · worked · didn't work"],
      ],
    },
    { t: 'rule', formula: 'Mọi chủ ngữ + V2 / didn\'t + V (Ngày 9) · Mọi chủ ngữ + can / must / should + V (Ngày 13) · be (chia như cột be) + V3 (Ngày 15)', vi: 'Quá khứ của động từ thường và modal **không đổi theo chủ ngữ**; chỉ **be** (am / is / are · was / were) và hiện tại đơn (**-s / does**) phải nhìn chủ ngữ — câu bị động cũng chỉ chia **be**.' },
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
