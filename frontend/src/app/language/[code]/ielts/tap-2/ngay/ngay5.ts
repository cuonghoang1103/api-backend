/**
 * IELTS Tập 2 · Ngày 5 — Hiện tại hoàn thành vs quá khứ đơn; for / since / yet / already / just [G12]
 * · Listening: Dictation 3 + Table completion [L02 L08] · Speaking: Part 1 Wh- ôn + filler học thuật, kéo dài ý
 * [S03 S09] 🔊 /z ʒ ŋ h j/ [S11] · Bài tập (34 câu).
 *
 * Đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N5. Vòng 1 của G12 (Tập 1 chưa dạy hiện tại hoàn thành);
 * vòng 3 của Dictation (Tập 1 Ngày 3, 5); vòng 2 của Part 1 Wh- (Tập 1 Ngày 6). Kịch bản nghe, câu chép chính tả,
 * câu trả lời mẫu, câu bài tập đều tự soạn.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D5_GRAMMAR: Lesson = {
  id: 't2d5-ngu-phap',
  kind: 'grammar',
  title: 'Hiện tại hoàn thành vs quá khứ đơn; for / since / yet / already / just',
  goal: 'Chia đúng thì hiện tại hoàn thành (have / has + V3), chọn đúng giữa hiện tại hoàn thành và quá khứ đơn theo mốc thời gian, dùng đúng for / since / ever / never / just / already / yet — để trả lời "Have you ever…? / How long have you…?" ở Speaking và viết câu xu hướng ở Writing.',
  minutes: 85,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **GRA** (Speaking + Writing) lên band 5: band 5 cần "dạng cơ bản đúng khá ổn" — hiện tại hoàn thành là thì "cơ bản" thứ tư sau hiện tại đơn, tiếp diễn, quá khứ đơn, và là thì người Việt **né** nhiều nhất.',
        '**Hiện tại hoàn thành** (present perfect) = ==have / has + V3 (quá khứ phân từ)==: nối **quá khứ với bây giờ** — trải nghiệm (ever / never), việc vừa xong (just), việc kéo dài tới nay (for / since).',
        '**Quá khứ đơn** = việc xong ở **mốc đã kết thúc** (yesterday, in 2019, ago, last week). Có mốc đó trong câu → **không** dùng hiện tại hoàn thành.',
        '**for** + khoảng (for three years) · **since** + mốc (since 2021). **just / already** đứng giữa have và V3; **yet** đứng cuối câu phủ định / câu hỏi.',
        'Áp dụng: Speaking Part 1 (**How long have you lived there?**), Part 2 (kể chuyện = quá khứ đơn), Task 2 mở bài (**In recent years, … has increased**).',
      ],
    },
    {
      t: 'sodo',
      kind: 'timeline',
      title: 'Quá khứ đơn và hiện tại hoàn thành trên trục thời gian',
      caption: 'Quá khứ đơn: một điểm đã khép lại, có mốc rõ. Hiện tại hoàn thành: đoạn hoặc điểm nằm TRƯỚC bây giờ nhưng còn "chạm" tới bây giờ (vẫn đang tiếp tục, hoặc kết quả còn đó, hoặc không nói khi nào).',
      marks: [
        { from: -6, kieu: 'diem', label: '**Quá khứ đơn** — I **moved** to Hanoi **in 2021**.', mau: 3 },
        { from: -6, to: 0, kieu: 'doan', label: '**HTHT (kéo dài)** — I **have lived** in Hanoi **since 2021**.', mau: 1 },
        { from: -3, kieu: 'diem', label: '**HTHT (trải nghiệm, không nói khi nào)** — I **have been** to Japan.', mau: 2 },
        { from: -0.5, kieu: 'diem', label: '**HTHT (vừa xong)** — I **have just finished** my essay.', mau: 2 },
      ],
    },

    { t: 'h', text: '1. Cấu tạo: have / has + V3' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'S + have / has + V3',
          vi: 'Khẳng định. I / you / we / they + have · he / she / it + has. Viết tắt: I’ve, she’s, they’ve.',
          examples: [
            { en: 'I have studied English for six years.', vi: 'Tôi đã học tiếng Anh được sáu năm.' },
            { en: 'She has visited Hue three times.', vi: 'Cô ấy đã đến Huế ba lần.' },
          ],
        },
        {
          formula: 'S + have / has + not + V3',
          vi: 'Phủ định. Viết tắt: haven’t, hasn’t.',
          examples: [
            { en: "I haven't finished my homework yet.", vi: 'Tôi chưa làm xong bài tập.' },
            { en: "He hasn't called me since Monday.", vi: 'Anh ấy không gọi cho tôi từ thứ Hai.' },
          ],
        },
        {
          formula: 'Have / Has + S + V3? · Wh- + have / has + S + V3?',
          vi: 'Câu hỏi. Trả lời ngắn: Yes, I have. / No, she hasn’t.',
          examples: [
            { en: 'Have you ever eaten durian?', vi: 'Bạn đã bao giờ ăn sầu riêng chưa?' },
            { en: 'How long have you lived in this city?', vi: 'Bạn sống ở thành phố này bao lâu rồi?' },
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'V3 — quá khứ phân từ: có quy tắc = V-ed; bất quy tắc phải thuộc (37 động từ hay dùng)',
      head: ['Nhóm', 'Nguyên mẫu → quá khứ (V2) → V3'],
      rows: [
        ['**A–A–A** (ba dạng giống nhau)', 'cut – cut – cut · put – put – put · cost – cost – cost · read – read – read (đọc /riːd/ → /red/ → /red/)'],
        ['**A–B–B** (V2 = V3)', 'buy – bought – bought · think – thought – thought · teach – taught – taught · make – made – made · have – had – had · find – found – found · meet – met – met · spend – spent – spent · lose – lost – lost · win – won – won'],
        ['**A–B–C** (ba dạng khác nhau)', 'be – was/were – **been** · do – did – **done** · go – went – **gone** · see – saw – **seen** · eat – ate – **eaten** · write – wrote – **written** · take – took – **taken** · give – gave – **given** · know – knew – **known** · speak – spoke – **spoken** · break – broke – **broken** · choose – chose – **chosen** · forget – forgot – **forgotten** · grow – grew – **grown** · rise – rose – **risen** · fall – fell – **fallen**'],
        ['**A–B–A**', 'come – came – come · become – became – become · run – ran – run'],
        ['**i – a – u**', 'begin – began – begun · drink – drank – drunk · swim – swam – swum · sing – sang – sung'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Dùng V2 thay V3: ~~I have went~~ → I have **gone / been** · ~~She has wrote~~ → has **written** · ~~It has rose~~ → has **risen**.',
        'Quên **has** với ngôi thứ ba: ~~She have finished~~ → She **has** finished.',
        '**’s** có thể là **is** hoặc **has**: She**’s** gone (= has gone) · She**’s** going (= is going). Phía sau là V3 → has.',
        '**get** – got – **got** (Anh) / **gotten** (Mỹ). Cả hai đều đúng — chọn một kiểu và giữ suốt bài.',
      ],
    },
    {
      t: 'rule',
      formula: 'S + have / has (+ not) + V3 · Have / Has + S + V3?',
      vi: 'I / you / we / they + have; he / she / it + has. V3 bất quy tắc phải thuộc: been, done, gone, seen, written, risen, fallen…',
    },
    {
      t: 'quiz',
      id: 't2d5-v3',
      title: 'Viết dạng V3 (8 câu)',
      kind: 'fill',
      items: [
        { q: 'I have ___ this film twice. (see)', answers: ['seen'] },
        { q: 'She has ___ three books about Vietnam. (write)', answers: ['written'] },
        { q: 'Prices have ___ by 10 % this year. (rise)', answers: ['risen'] },
        { q: 'We have ___ all the cake. (eat)', answers: ['eaten'] },
        { q: 'He has ___ his phone again. (lose)', answers: ['lost'] },
        { q: 'Have you ___ your homework? (do)', answers: ['done'] },
        { q: 'They have ___ a new house. (buy)', answers: ['bought'] },
        { q: 'The number of visitors has ___ sharply. (fall)', answers: ['fallen'] },
      ],
    },

    { t: 'h', text: '2. Hiện tại hoàn thành dùng khi nào?' },
    {
      t: 'table',
      head: ['Cách dùng', 'Giải thích', 'Ví dụ'],
      rows: [
        ['① **Trải nghiệm** (đã từng)', 'Không nói **khi nào** — chỉ nói **có / chưa** trong cả đời đến nay. Hay đi với **ever, never, once, twice, three times, before**.', 'I **have been** to Singapore **twice**. · **Have** you **ever tried** bun cha? · I**’ve never seen** snow.'],
        ['② **Kéo dài tới nay**', 'Bắt đầu trong quá khứ và **vẫn đang tiếp tục**. Đi với **for / since / How long**.', 'We **have known** each other **since** primary school. · She **has worked** here **for** five years.'],
        ['③ **Kết quả còn ở hiện tại**', 'Việc xảy ra trước đây, **kết quả** còn thấy bây giờ.', 'I**’ve lost** my keys (→ bây giờ không vào nhà được). · He **has broken** his leg (→ đang bó bột).'],
        ['④ **Vừa mới / đã / chưa**', '**just** (vừa), **already** (đã — sớm hơn dự kiến), **yet** (chưa — câu phủ định / câu hỏi).', 'The film **has just started**. · I**’ve already eaten**. · **Have** you **finished yet**?'],
        ['⑤ **Khoảng thời gian chưa kết thúc**', '**today, this week, this year, so far, recently, lately, in recent years**.', 'I**’ve drunk** three coffees **today**. · **In recent years**, online shopping **has become** very popular.'],
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Năm cách dùng hiện tại hoàn thành',
      center: '**have / has + V3**',
      branches: [
        { label: '① Trải nghiệm', items: ['ever · never', 'once · twice · three times', 'Have you ever…?'], anh: 'airplane' },
        { label: '② Kéo dài tới nay', items: ['for + khoảng', 'since + mốc', 'How long…?'], anh: 'hourglass-not-done' },
        { label: '③ Kết quả còn đó', items: ['I’ve lost my keys', 'He’s broken his leg'], anh: 'key' },
        { label: '④ Vừa / đã / chưa', items: ['just · already', 'yet (cuối câu)'], anh: 'check-mark-button' },
        { label: '⑤ Khoảng chưa hết', items: ['today · this year', 'so far · recently', 'in recent years'], anh: 'spiral-calendar' },
      ],
    },
    {
      t: 'rule',
      formula: 'ever / never / twice · for / since · just / already / yet · today / this year / so far / recently / in recent years → have / has + V3',
      vi: 'Hiện tại hoàn thành = quá khứ CÒN DÍNH với bây giờ (vẫn tiếp diễn, kết quả còn, khoảng thời gian chưa hết, không nói khi nào).',
    },
    {
      t: 'quiz',
      id: 't2d5-cach-dung-dich',
      title: 'Dịch nhanh — năm cách dùng (5 câu)',
      kind: 'translate',
      grammar: 'S + have / has + V3. Trải nghiệm: ever / never / twice. Vừa: just (giữa have và V3). In recent years + HTHT.',
      items: [
        { q: 'Tôi đã đến Đà Lạt hai lần.', hint: 'have been to, Da Lat, twice', answers: ['I have been to Da Lat twice.', "I've been to Da Lat twice.", 'I have visited Da Lat twice.', "I've visited Da Lat twice.", 'I have been to Dalat twice.', "I've been to Dalat twice."] },
        { q: 'Bạn đã bao giờ ăn sầu riêng chưa?', hint: 'Have you ever, eaten / tried, durian', answers: ['Have you ever eaten durian?', 'Have you ever tried durian?'] },
        { q: 'Tôi chưa bao giờ thấy tuyết.', hint: 'have never seen, snow', answers: ['I have never seen snow.', "I've never seen snow."] },
        { q: 'Buổi họp vừa mới bắt đầu.', hint: 'The meeting, has just started / begun', answers: ['The meeting has just started.', 'The meeting has just begun.', "The meeting's just started."] },
        { q: 'Những năm gần đây, mua sắm trực tuyến đã trở nên rất phổ biến.', hint: 'In recent years, online shopping, has become, very popular', answers: ['In recent years, online shopping has become very popular.', 'In recent years online shopping has become very popular.', 'Online shopping has become very popular in recent years.', 'In recent years, online shopping has become really popular.', 'In recent years, shopping online has become very popular.'] },
      ],
    },

    { t: 'h', text: '3. for hay since?' },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'for + KHOẢNG · since + MỐC',
      cols: [
        { title: '**for** + khoảng thời gian (bao lâu)', anh: 'stopwatch', items: ['for three years', 'for six months', 'for a long time', 'for ages', 'for two hours'] },
        { title: '**since** + mốc bắt đầu (từ khi)', anh: 'tear-off-calendar', items: ['since 2021', 'since Monday', 'since I was ten', 'since last summer', 'since 8 o’clock'] },
      ],
      caption: 'I have lived here for three years = I have lived here since 2022 (nếu bây giờ là 2025). Sau since có thể là một mệnh đề QUÁ KHỨ ĐƠN: since I **moved** here.',
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~I live here for three years.~~ (hiện tại đơn + for) → I **have lived** here for three years. Tiếng Việt "tôi sống ở đây ba năm rồi" không đổi động từ — tiếng Anh phải đổi.',
        '~~since three years~~ → **for** three years. ~~for 2021~~ → **since** 2021.',
        '~~I have lived here since three years ago.~~ → since **2022** / for three years. (Đừng ghép since với ago.)',
        '**How long** + HTHT: ~~How long do you live here?~~ → How long **have** you **lived** here?',
      ],
    },
    {
      t: 'rule',
      formula: 'S + have / has + V3 + for + khoảng / since + mốc · How long have you + V3?',
      vi: 'Việc bắt đầu trong quá khứ và VẪN tiếp tục bây giờ → hiện tại hoàn thành, không dùng hiện tại đơn.',
    },
    {
      t: 'quiz',
      id: 't2d5-for-since-dich',
      title: 'Dịch nhanh — for / since / How long (4 câu)',
      kind: 'translate',
      grammar: 'have / has + V3 + for + khoảng / since + mốc. How long have / has + S + V3?',
      items: [
        { q: 'Tôi đã sống ở Hà Nội từ năm 2020.', hint: 'have lived, in Hanoi, since 2020', answers: ['I have lived in Hanoi since 2020.', "I've lived in Hanoi since 2020.", 'I have been living in Hanoi since 2020.', "I've been living in Hanoi since 2020."] },
        { q: 'Chúng tôi quen nhau được mười năm rồi.', hint: 'have known each other, for ten years', answers: ['We have known each other for ten years.', "We've known each other for ten years.", 'We have known each other for 10 years.', "We've known each other for 10 years."] },
        { q: 'Bạn học tiếng Anh bao lâu rồi?', hint: 'How long, have you studied / learned, English', answers: ['How long have you studied English?', 'How long have you learned English?', 'How long have you learnt English?', 'How long have you been studying English?', 'How long have you been learning English?'] },
        { q: 'Cô ấy làm việc ở công ty này từ khi tốt nghiệp.', hint: 'has worked, at / for this company, since she graduated', answers: ['She has worked at this company since she graduated.', 'She has worked for this company since she graduated.', "She's worked at this company since she graduated.", "She's worked for this company since she graduated.", 'She has been working at this company since she graduated.', 'She has been working for this company since she graduated.', 'She has worked in this company since she graduated.'] },
      ],
    },

    { t: 'h', text: '4. just · already · yet · ever · never · still — đặt ở đâu?' },
    {
      t: 'table',
      head: ['Từ', 'Vị trí', 'Loại câu', 'Ví dụ'],
      rows: [
        ['**just** (vừa mới)', 'giữa **have** và **V3**', 'khẳng định', 'I have **just** finished.'],
        ['**already** (đã rồi — sớm hơn mong đợi)', 'giữa have và V3 (hoặc cuối câu)', 'khẳng định (đôi khi câu hỏi tỏ ý ngạc nhiên)', 'She has **already** left. · Have you finished **already**?'],
        ['**yet** (chưa / đã… chưa)', '**cuối câu**', 'phủ định và câu hỏi', 'I haven’t decided **yet**. · Have you booked the tickets **yet**?'],
        ['**ever** (đã bao giờ)', 'giữa S và V3 trong câu hỏi', 'câu hỏi (và "the best… I have ever…")', 'Have you **ever** been to Japan? · It’s the best pho I’ve **ever** eaten.'],
        ['**never** (chưa bao giờ)', 'giữa have và V3', 'khẳng định mang nghĩa phủ định', 'I have **never** flown. (~~I haven’t never~~)'],
        ['**still** (vẫn chưa)', 'trước **haven’t / hasn’t**', 'phủ định, nhấn mạnh sự chậm', 'He **still** hasn’t replied to my email.'],
      ],
    },
    {
      t: 'rule',
      formula: 'have just / already / never + V3 · haven’t + V3 + yet · Have you ever + V3? · still + haven’t + V3',
      vi: 'yet đứng cuối câu phủ định / câu hỏi; just – already – never đứng giữa have và V3.',
    },
    {
      t: 'quiz',
      id: 't2d5-trang-tu-dich',
      title: 'Dịch nhanh — just / already / yet / still (4 câu)',
      kind: 'translate',
      grammar: 'have just / already + V3 · haven’t + V3 + yet · Have you + V3 + yet? · still haven’t + V3.',
      items: [
        { q: 'Tôi vừa ăn trưa xong.', hint: 'have just had / eaten lunch', answers: ['I have just had lunch.', "I've just had lunch.", 'I have just eaten lunch.', "I've just eaten lunch.", 'I have just finished lunch.', "I've just finished lunch."] },
        { q: 'Bạn đã đặt vé chưa?', hint: 'Have you booked, the tickets, yet', answers: ['Have you booked the tickets yet?', 'Have you bought the tickets yet?', 'Have you booked the ticket yet?', 'Have you bought the ticket yet?', 'Have you booked tickets yet?'] },
        { q: 'Họ đã rời đi rồi.', hint: 'have already left', answers: ['They have already left.', "They've already left.", 'They have left already.', "They've left already."] },
        { q: 'Anh ấy vẫn chưa trả lời email của tôi.', hint: 'still hasn’t replied to, my email', answers: ["He still hasn't replied to my email.", 'He still has not replied to my email.', "He still hasn't answered my email.", 'He still has not answered my email.', "He hasn't replied to my email yet.", 'He has not replied to my email yet.'] },
      ],
    },

    { t: 'h', text: '5. Hiện tại hoàn thành hay quá khứ đơn?' },
    {
      t: 'p',
      text: 'Câu hỏi quyết định: trong câu (hoặc trong ý người nói) có **mốc thời gian đã kết thúc** không? Có (yesterday, last week, in 2019, three years ago, when I was a child) → **quá khứ đơn**. Không có mốc, hoặc khoảng thời gian **vẫn chưa hết** (today, this year, so far, since…) → **hiện tại hoàn thành**.',
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Hai thì đặt cạnh nhau',
      cols: [
        { title: '**Quá khứ đơn** — mốc đã khép', anh: 'tear-off-calendar', items: ['I **went** to Japan **in 2019**.', 'She **lived** in Hue **for** five years (giờ không sống ở đó nữa).', 'I **lost** my keys **yesterday** (đã tìm thấy hay chưa — không quan tâm).', '**When did** you **start** learning English?', 'Dấu hiệu: **yesterday, last…, …ago, in 2019, when…**'] },
        { title: '**Hiện tại hoàn thành** — còn dính tới bây giờ', anh: 'hourglass-not-done', items: ['I **have been** to Japan (không nói khi nào).', 'She **has lived** in Hue **for** five years (vẫn đang sống).', 'I **have lost** my keys (bây giờ vẫn chưa có).', '**How long have** you **learned** English?', 'Dấu hiệu: **ever, never, just, yet, for/since (tới nay), so far, this year**'] },
      ],
      caption: 'Hội thoại thật: HỎI bằng hiện tại hoàn thành (Have you ever…?) → KỂ CHI TIẾT bằng quá khứ đơn (When did you go? I went in 2019…).',
    },
    {
      t: 'dialogue',
      title: 'Mẫu hội thoại: mở bằng HTHT, kể bằng quá khứ đơn',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'Have you ever been abroad?' },
        { who: 'Candidate', role: 'candidate', text: "Yes, I have. I've been to Thailand twice. The first time, I went with my family when I was fifteen, and we spent a week in Bangkok. Last year I went back with some friends, and we visited Chiang Mai.", vi: 'Có rồi. Tôi đã đi Thái Lan hai lần. Lần đầu tôi đi cùng gia đình năm mười lăm tuổi, chúng tôi ở Bangkok một tuần. Năm ngoái tôi quay lại với vài người bạn và đến Chiang Mai.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'HTHT với mốc đã kết thúc: ~~I have visited Hue last year.~~ → I **visited** Hue last year. ~~I have finished it yesterday.~~ → I **finished** it yesterday.',
        'Quá khứ đơn cho việc còn tiếp diễn: ~~I studied here since 2022.~~ → I **have studied** here since 2022.',
        '**been** vs **gone**: She **has been** to Paris (đã đi và đã về) · She **has gone** to Paris (đã đi, giờ đang ở đó / trên đường).',
        '**Task 1**: số liệu của năm đã qua → **quá khứ đơn** (In 2010, sales **rose**…). Chỉ dùng HTHT khi giai đoạn kéo tới **bây giờ** (Since 2015, sales **have risen**…).',
      ],
    },
    {
      t: 'rule',
      formula: 'Mốc đã kết thúc (yesterday · last… · …ago · in 2019) → V2 · Không mốc / chưa kết thúc (ever · just · yet · for / since · this year) → have / has + V3',
      vi: 'Hỏi bằng HTHT, kể chi tiết bằng quá khứ đơn.',
    },
    {
      t: 'quiz',
      id: 't2d5-so-sanh-dich',
      title: 'Dịch nhanh — chọn thì đúng (5 câu)',
      kind: 'translate',
      grammar: 'Có mốc đã kết thúc → quá khứ đơn (V2). Không mốc / tới nay → have / has + V3.',
      items: [
        { q: 'Tôi đã đến Huế năm ngoái.', hint: 'went to / visited Hue, last year (mốc → quá khứ đơn)', answers: ['I went to Hue last year.', 'I visited Hue last year.', 'Last year I went to Hue.', 'Last year, I went to Hue.', 'Last year I visited Hue.', 'Last year, I visited Hue.'] },
        { q: 'Tôi đã đến Huế ba lần.', hint: 'have been to Hue, three times (không mốc → HTHT)', answers: ['I have been to Hue three times.', "I've been to Hue three times.", 'I have visited Hue three times.', "I've visited Hue three times."] },
        { q: 'Bạn bắt đầu học tiếng Anh khi nào?', hint: 'When did you start, learning / to learn English', answers: ['When did you start learning English?', 'When did you start to learn English?', 'When did you begin learning English?', 'When did you begin to learn English?', 'When did you start studying English?'] },
        { q: 'Năm nay giá xăng đã tăng hai lần.', hint: 'Petrol prices, have risen / gone up, twice, this year', answers: ['Petrol prices have risen twice this year.', 'Petrol prices have gone up twice this year.', 'Petrol prices have increased twice this year.', 'This year petrol prices have risen twice.', 'This year, petrol prices have risen twice.', 'The price of petrol has risen twice this year.', 'Gas prices have risen twice this year.', 'The price of petrol has gone up twice this year.'] },
        { q: 'Năm 2010, doanh số tăng mạnh.', hint: 'In 2010, sales, rose / increased sharply (mốc → quá khứ đơn)', answers: ['In 2010, sales rose sharply.', 'In 2010 sales rose sharply.', 'In 2010, sales increased sharply.', 'In 2010 sales increased sharply.', 'Sales rose sharply in 2010.', 'Sales increased sharply in 2010.', 'In 2010, sales rose dramatically.', 'In 2010, sales grew sharply.'] },
      ],
    },

    { t: 'h', text: '6. Áp dụng trong IELTS' },
    {
      t: 'table',
      head: ['Phần thi', 'Mẫu câu', 'Ví dụ'],
      rows: [
        ['**Speaking Part 1**', 'How long have you…? / Have you ever…? → trả lời HTHT, rồi kể bằng quá khứ đơn', 'I’ve lived in Da Nang **for about ten years**. We **moved** there when my dad **got** a new job.'],
        ['**Speaking Part 2**', 'Kể chuyện = **quá khứ đơn**; câu mở / câu chốt có thể dùng HTHT', 'It’s one of the best trips I’**ve ever had**. We **left** early in the morning…'],
        ['**Writing Task 2** — mở bài', 'In recent years / Over the past decade + HTHT', '**Over the past decade**, the number of people working from home **has increased** dramatically.'],
        ['**Writing Task 1**', 'Năm đã qua → quá khứ đơn; giai đoạn tới nay → HTHT', 'Between 2000 and 2020, consumption **rose**… · Since 2015, the figure **has fallen** steadily.'],
      ],
    },
    {
      t: 'mcq',
      id: 't2d5-tong-hop-chon',
      title: 'Kiểm tra cuối bài — chọn đáp án đúng (10 câu)',
      items: [
        { q: 'I ___ my grandparents last weekend.', options: ['have visited', 'visited', 'have been visiting'], correct: 1, why: '**last weekend** = mốc đã kết thúc → **quá khứ đơn**.' },
        { q: 'She ___ in this company since 2019.', options: ['works', 'worked', 'has worked'], correct: 2, why: '**since 2019** + vẫn đang làm → **hiện tại hoàn thành**.' },
        { q: '___ you ever ___ a horse?', options: ['Have / ridden', 'Did / ride', 'Have / rode'], correct: 0, why: 'Trải nghiệm + **ever** → Have + S + **V3**: ride – rode – **ridden**.' },
        { q: 'I have known Lan ___ ten years.', options: ['since', 'for', 'ago'], correct: 1, why: '**ten years** là khoảng → **for**.' },
        { q: 'He hasn’t finished his report ___.', options: ['yet', 'already', 'just'], correct: 0, why: 'Câu **phủ định** + cuối câu → **yet**.' },
        { q: 'When ___ you move to Ho Chi Minh City?', options: ['have', 'did', 'has'], correct: 1, why: '**When** hỏi mốc thời gian cụ thể → **quá khứ đơn**: When did you move…? (~~When have you moved~~).' },
        { q: 'Oh no! I ___ my wallet. I can’t pay for lunch.', options: ['lose', 'was losing', 'have lost'], correct: 2, why: '**Kết quả còn ở hiện tại** (bây giờ không trả tiền được) → **have lost**.' },
        { q: 'Over the past ten years, the cost of housing ___ dramatically.', options: ['has risen', 'rose', 'rises'], correct: 0, why: '**Over the past ten years** = giai đoạn kéo tới bây giờ → **has risen**.' },
        { q: '"Where is Minh?" — "He ___ to the bank. He’ll be back in ten minutes."', options: ['has been', 'has gone', 'goes'], correct: 1, why: '**has gone** = đã đi và **chưa về** (đang ở ngân hàng). has been = đã đi và đã về.' },
        { q: 'This is the most delicious pho I ___.', options: ['ever ate', 'have ever eaten', 'have ever ate'], correct: 1, why: '**the most… I have ever + V3**: eat – ate – **eaten**.' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Listening ─────────────────────────── */

const T2D5_SCRIPT_TABLE: { who: string; voice: 'uk-nu' | 'us-nam'; text: string }[] = [
  { who: 'Assistant', voice: 'uk-nu', text: 'Good morning, Parkside Leisure Centre. How can I help you?' },
  { who: 'Kevin', voice: 'us-nam', text: "Hi. I've just moved to the area, and I'd like some information about your evening classes for adults." },
  { who: 'Assistant', voice: 'uk-nu', text: "Of course. We've got four classes at the moment. Shall I go through them?" },
  { who: 'Kevin', voice: 'us-nam', text: 'Yes, please.' },
  { who: 'Assistant', voice: 'uk-nu', text: "Right. First, there's yoga on Mondays. It used to start at seven, but it's moved to seven fifteen, so that people have time to get here after work. It's six pounds a session, and you need to bring your own mat. We don't have enough for everyone." },
  { who: 'Kevin', voice: 'us-nam', text: 'OK. What about swimming? I have never really learned properly.' },
  { who: 'Assistant', voice: 'uk-nu', text: "We have a swimming class for adult beginners. It isn't on Tuesday any more; it's on Wednesday now, at eight o'clock. It costs four pounds fifty, and the groups are small, a maximum of eight people, so the teacher can help everyone." },
  { who: 'Kevin', voice: 'us-nam', text: "That sounds good. And is there anything at the weekend?" },
  { who: 'Assistant', voice: 'uk-nu', text: "Yes, badminton on Saturday mornings at ten. That's five pounds. If you haven't got a racket, one can be hired from reception for a pound." },
  { who: 'Kevin', voice: 'us-nam', text: 'And the fourth class?' },
  { who: 'Assistant', voice: 'uk-nu', text: "That's our walking group on Friday evenings at six thirty. It's completely free, because it's paid for by the city council. The only thing is, you have to register online first, so we know how many people are coming." },
  { who: 'Kevin', voice: 'us-nam', text: "Great. I think I'll try the swimming and the walking group." },
];

const T2D5_LISTENING: Lesson = {
  id: 't2d5-nghe',
  kind: 'listening',
  title: 'Dictation 3 (nghe chép chính tả) + Table completion',
  goal: 'Nghe chép đúng 6 câu 10–16 từ ở tốc độ tự nhiên (kể cả have / has, đuôi -s, -ed, mạo từ), rồi làm được bài Table completion 8 câu — đọc bảng theo hàng / cột, đoán loại thông tin, bắt thông tin bị đổi.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Listening** lên band 5: Dictation luyện **tai bắt từ nhỏ** — have / has, a / the, -s, -ed — những từ quyết định đúng ngữ pháp và đúng chính tả đáp án.',
        '**Dictation 3** (vòng 3 sau Tập 1 Ngày 3, 5): câu **dài hơn** (10–16 từ), tốc độ gần thật, và có **hiện tại hoàn thành** của bài Ngữ pháp hôm nay.',
        '**Table completion** (dạng mới): bảng có **cột** (loại thông tin) và **hàng** (từng mục). Đọc tiêu đề cột là đoán được 80 % loại đáp án.',
        'Bẫy hôm nay: **giờ đổi**, **ngày đổi** ("isn’t on Tuesday any more"), **giá + thuê thêm**, **free vì ai trả**.',
        'Ghi chú: một bài đầy đủ 8 câu với hai giọng **Anh (nữ) – Mỹ (nam)**.',
      ],
    },

    { t: 'h', text: '1. Dictation 3 — cách nghe chép' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Bốn lượt nghe một câu',
      steps: [
        { label: 'Lượt 1 — **chỉ nghe**', sub: 'Không viết. Hiểu ý cả câu: ai, làm gì, khi nào.' },
        { label: 'Lượt 2 — **từ nội dung**', sub: 'Ghi danh từ, động từ, số: moved · city · 2019.' },
        { label: 'Lượt 3 — **từ chức năng**', sub: 'Điền have / has, a / the, to, of, -s, -ed: I have moved to the city…' },
        { label: 'Lượt 4 — **soát ngữ pháp**', sub: 'since + HTHT? chủ ngữ số ít → has? Có -s số nhiều?' },
      ],
      caption: 'Ngữ pháp giúp tai: nghe "since" mà chưa nghe "have" → gần như chắc chắn có have / has bị nói nhẹ (I’ve, she’s).',
    },
    {
      t: 'note',
      title: 'Âm bị "nuốt" khi nói nhanh',
      items: [
        '**have / has** thành **’ve /v/, ’s /z/**: I**’ve** lived · She**’s** worked — rất nhẹ, dễ mất.',
        '**-ed** trước phụ âm gần như mất: work**ed** there → "work-there". Nghĩa câu (yesterday, since) giúp bạn biết phải có -ed.',
        '**a, the, of, to, and** đọc yếu /ə/, /ðə/, /əv/, /tə/, /ən/. Viết đủ dù nghe không rõ.',
      ],
    },
    {
      t: 'dictation',
      id: 't2d5-chep-chinh-ta',
      title: 'Dictation 3 — nghe và chép đúng cả câu (6 câu)',
      items: [
        { label: 'Câu 1 (10 từ)', spell: 'I have lived in this city since I started university.', answer: 'I have lived in this city since I started university.', alt: ["I've lived in this city since I started university."] },
        { label: 'Câu 2 (12 từ)', spell: 'She has already booked the tickets, so we can relax this evening.', answer: 'She has already booked the tickets, so we can relax this evening.', alt: ["She's already booked the tickets, so we can relax this evening.", 'She has already booked the tickets so we can relax this evening.'] },
        { label: 'Câu 3 (13 từ)', spell: 'The number of people who cycle to work has doubled in recent years.', answer: 'The number of people who cycle to work has doubled in recent years.' },
        { label: 'Câu 4 (13 từ)', spell: 'Have you ever tried the noodle soup at the market near the station?', answer: 'Have you ever tried the noodle soup at the market near the station?' },
        { label: 'Câu 5 (13 từ)', spell: 'We moved here three years ago, and we have not regretted it once.', answer: 'We moved here three years ago, and we have not regretted it once.', alt: ["We moved here three years ago, and we haven't regretted it once.", 'We moved here three years ago and we have not regretted it once.', "We moved here three years ago and we haven't regretted it once."] },
        { label: 'Câu 6 (16 từ)', spell: 'The leisure centre has just opened a new swimming pool, which is free for local children.', answer: 'The leisure centre has just opened a new swimming pool, which is free for local children.', alt: ['The leisure center has just opened a new swimming pool, which is free for local children.', "The leisure centre's just opened a new swimming pool, which is free for local children."] },
      ],
    },
    {
      t: 'note',
      title: 'Soát lại 6 câu — chỗ hay mất',
      items: [
        'Câu 1: **have** lived · **since** + I **started** (quá khứ đơn sau since).',
        'Câu 2: **has already** booked · **the** tickets (số nhiều).',
        'Câu 3: **The number of** people **who** cycle · **has** doubled (the number → số ít).',
        'Câu 4: **Have** you **ever** tried · **the** noodle soup · **at the** market · **near the** station.',
        'Câu 5: **moved** (quá khứ đơn — có "ago") · **have not regretted** (HTHT — tới nay).',
        'Câu 6: **has just opened** · **a** new swimming pool · **which is free for** local children.',
      ],
    },

    { t: 'h', text: '2. Table completion — đọc bảng thế nào?' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Năm bước làm Table completion',
      steps: [
        { label: '① Giới hạn từ', sub: 'ONE WORD AND/OR A NUMBER · NO MORE THAN TWO WORDS…' },
        { label: '② Đọc **tiêu đề cột**', sub: 'Day · Time · Cost · Notes → biết mỗi cột là loại thông tin gì.' },
        { label: '③ Đọc **tiêu đề hàng**', sub: 'Yoga · Swimming · Badminton → thứ tự người nói đi qua.' },
        { label: '④ Đoán từng ô trống', sub: 'Ô ở cột Time → giờ; cột Cost → số tiền; cột Notes → danh từ.' },
        { label: '⑤ Nghe **theo hàng**, từ trái sang phải', sub: 'Người nói thường tả xong một hàng rồi mới sang hàng sau.' },
      ],
      caption: 'Các ô đã có sẵn chữ cũng là "mỏ neo": nghe thấy "six pounds" là biết đang ở hàng Yoga, cột Cost.',
    },
    {
      t: 'mcq',
      id: 't2d5-nghe-doan',
      title: 'Khởi động — ô này cần thông tin gì? (4 câu)',
      items: [
        { q: 'Cột **Time**, hàng Yoga: ______', options: ['một giờ (7.15)', 'một ngày trong tuần', 'một số tiền'], correct: 0, why: 'Cột **Time** → giờ.' },
        { q: 'Cột **Notes**: "bring your own ______"', options: ['một con số', 'một đồ vật (danh từ)', 'một tính từ'], correct: 1, why: '"your own + ___" → **danh từ** (đồ vật): mat, towel…' },
        { q: 'Cột **Cost**: "£ ______"', options: ['một tên riêng', 'một ngày', 'một con số (có thể có số lẻ)'], correct: 2, why: 'Ký hiệu £ đã in sẵn → chỉ ghi **số**: 4.50.' },
        { q: 'Cột **Day**, hàng Swimming: ______', options: ['một ngày trong tuần', 'một giờ', 'một môn thể thao'], correct: 0, why: 'Cột **Day** → thứ trong tuần. Cẩn thận ngày bị đổi.' },
      ],
    },
    {
      t: 'rule',
      formula: 'Tiêu đề cột = loại thông tin · tiêu đề hàng = thứ tự nghe · ô có sẵn = mỏ neo · nghe theo hàng, trái → phải',
      vi: 'Bảng giúp bạn đoán trước gần như mọi đáp án — hãy dùng hết thời gian đọc trước.',
    },

    { t: 'h', text: '3. Bài luyện — Questions 1–8 (Table completion)' },
    {
      t: 'canh',
      anh: ['telephone-receiver', 'person-in-lotus-position', 'person-swimming', 'badminton'],
      caption: '**Kevin** (giọng Mỹ) vừa chuyển đến khu phố mới, gọi điện cho **Parkside Leisure Centre** (trung tâm thể thao – giải trí) hỏi về các lớp buổi tối cho người lớn.',
    },
    {
      t: 'p',
      text: 'Complete the table below. Write **ONE WORD AND/OR A NUMBER** for each answer.',
    },
    {
      t: 'table',
      caption: 'Parkside Leisure Centre — adult classes',
      head: ['Class', 'Day', 'Time', 'Cost', 'Notes'],
      rows: [
        ['Yoga', 'Monday', '(1) ______ p.m.', '£6', 'bring your own (2) ______'],
        ['Swimming (beginners)', '(3) ______', '8 p.m.', '£ (4) ______', 'maximum of (5) ______ people'],
        ['Badminton', 'Saturday', '10 a.m.', '£5', 'rackets can be (6) ______ for £1'],
        ['Walking group', 'Friday', '6.30 p.m.', '(7) ______', 'must (8) ______ online first'],
      ],
    },
    {
      t: 'listen',
      id: 't2d5-nghe-bang',
      title: 'Evening classes at a leisure centre',
      dan: { so: 'Day 5, Recording 1', boiCanh: 'a telephone conversation between an assistant at a leisure centre and a man who has just moved to the area.', cau: [1, 8] },
      note: 'Hai giọng: Anh (nữ, nhân viên) — Mỹ (nam, Kevin). Khoảng 2 phút 30. Có 2 chỗ thông tin bị đổi so với trước đây (giờ lớp yoga, ngày lớp bơi).',
      lines: T2D5_SCRIPT_TABLE,
    },
    {
      t: 'quiz',
      id: 't2d5-nghe-dien',
      title: 'Questions 1–8 — ONE WORD AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '1. Yoga — Time: ___ p.m.', answers: ['7.15', '7:15'] },
        { q: '2. Yoga — bring your own ___', answers: ['mat'] },
        { q: '3. Swimming — Day: ___', answers: ['Wednesday', 'Wednesdays', 'Wed'] },
        { q: '4. Swimming — Cost: £ ___', answers: ['4.50', '4.5'] },
        { q: '5. Swimming — maximum of ___ people', answers: ['8', 'eight'] },
        { q: '6. Badminton — rackets can be ___ for £1', answers: ['hired'] },
        { q: '7. Walking group — Cost: ___', answers: ['free', '£0', '0', 'nothing'] },
        { q: '8. Walking group — must ___ online first', answers: ['register'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án 1–8',
      items: [
        '**1 7.15** — "It **used to** start at seven, **but** it’s moved to **seven fifteen**". Bẫy trước – sau (used to… but).',
        '**2 mat** — "you need to bring **your own mat**".',
        '**3 Wednesday** — "It **isn’t on Tuesday any more**; it’s on **Wednesday** now".',
        '**4 4.50** — "It costs **four pounds fifty**". £ đã in sẵn.',
        '**5 8** — "a **maximum of eight** people".',
        '**6 hired** — "one **can be hired** from reception for a pound". Bảng viết "can be ___" (bị động) → chép đúng dạng nghe được: **hired**, không viết ~~hire~~.',
        '**7 free** — "It’s **completely free**, because it’s paid for by the city council". (council là **ai trả**, không phải chi phí.)',
        '**8 register** — "you have to **register online first**". Sau "must" → động từ nguyên mẫu.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'leisure centre', pos: 'n', ipa: '/ˈleʒə ˌsentə(r)/', vi: 'trung tâm thể thao – giải trí', ex: 'The new leisure centre has a pool and a gym.', exVi: 'Trung tâm thể thao mới có hồ bơi và phòng gym.', more: 'leisure đọc **/ˈleʒə/** (Anh) — âm /ʒ/ của bài phát âm hôm nay. Mỹ /ˈliːʒər/.', anh: 'person-swimming' },
        { w: 'session', pos: 'n', ipa: '/ˈseʃn/', vi: 'buổi (học, tập)', ex: 'Each session lasts an hour.', exVi: 'Mỗi buổi kéo dài một giờ.', more: '**a training session** · **per session** (mỗi buổi).' },
        { w: 'beginner', pos: 'n', ipa: '/bɪˈɡɪnə(r)/', vi: 'người mới bắt đầu', ex: 'This class is for complete beginners.', exVi: 'Lớp này dành cho người mới hoàn toàn.', more: 'Các mức: **beginner – intermediate – advanced**.' },
        { w: 'hire', pos: 'v', ipa: '/ˈhaɪə(r)/', vi: 'thuê (đồ, trong thời gian ngắn); thuê (người)', ex: 'You can hire a bike for the day.', exVi: 'Bạn có thể thuê xe đạp theo ngày.', more: 'Anh: **hire** a car / bike; Mỹ: **rent**. **rent** (Anh) dùng cho nhà, căn hộ.' },
        { w: 'register', pos: 'v', ipa: '/ˈredʒɪstə(r)/', vi: 'đăng ký', ex: 'Please register online before the first class.', exVi: 'Vui lòng đăng ký trực tuyến trước buổi học đầu.', more: 'Danh từ **registration**. Gần nghĩa **sign up**, **enrol** (Ngày 1).' },
        { w: 'maximum', pos: 'n, adj', ipa: '/ˈmæksɪməm/', vi: 'tối đa', ex: 'The lift takes a maximum of ten people.', exVi: 'Thang máy chở tối đa mười người.', more: 'Trái nghĩa **minimum**. **a maximum of** + số.' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Speaking ─────────────────────────── */

const T2D5_SPEAKING: Lesson = {
  id: 't2d5-noi',
  kind: 'speaking',
  title: 'Speaking Part 1 ôn câu hỏi Wh-: filler học thuật, kéo dài ý',
  goal: 'Trả lời câu hỏi Wh- của Part 1 trong 20–30 giây bằng khung Trả lời thẳng – Chi tiết – Cảm xúc / lý do, dùng filler học thuật thay cho “ờ, ừm” khi cần thời gian nghĩ, kéo dài ý bằng because / which means / for example hoặc bằng mặt đối lập, nhận ra 6 dạng câu hỏi Part 1 (best time, suitable for, easy/difficult, dislike, first/last time, popular) để trả lời đúng ngay câu đầu, và đọc rõ /z ʒ ŋ h j/.',
  minutes: 75,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Fluency & Coherence** lên band 5: band 4 "**ngắt dài**, lặp từ"; band 5 "giữ được mạch nhưng nhờ lặp / nói chậm". Filler đúng cách giúp bạn **có thời gian nghĩ mà không im lặng**.',
        'Ôn **vòng 2** của Tập 1 Ngày 6: câu Wh- (What / Where / When / Who / How / Why) không trả lời có / không — trả lời **thẳng** rồi thêm **chi tiết** và **cảm xúc**.',
        '**Filler học thuật** (S09): Well, … · Let me think… · I’d say… · To be honest, … · That’s an interesting question. — **dùng 1 lần mỗi câu**, không lạm dụng.',
        '**Kéo dài ý**: because… · which means… · for example… · apart from that… · especially…',
        'Nối Ngữ pháp Ngày 5: **How long have you…? / Have you ever…?** → HTHT rồi kể bằng quá khứ đơn. 🔊 **/z ʒ ŋ h j/**.',
        '**Part 1 theo DẠNG câu hỏi** (mục 5): best time · suitable for · easy/difficult · dislike · first/last time · popular in your country — mỗi dạng một khung; câu rộng thì **It depends → If… → But if…**; Part 1 **2–3 câu rồi dừng**.',
        '**Kéo dài bằng đối lập** (mục 6): Generally I love X, but the only thing I don’t like is… · At first…, but after a while… · câu tần suất mở bằng bối cảnh.',
      ],
    },

    { t: 'h', text: '1. Khung trả lời câu Wh-' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'D – D – F: 20–30 giây mỗi câu',
      steps: [
        { label: '**D — Direct answer** (trả lời thẳng)', sub: 'What do you usually do at weekends? → I usually meet my friends.' },
        { label: '**D — Detail** (chi tiết: ai, ở đâu, khi nào, thế nào)', sub: 'We often go to a café near West Lake on Saturday afternoon.' },
        { label: '**F — Feeling / reason** (cảm xúc, lý do)', sub: 'It’s the only time we can really relax, because we’re all busy during the week.' },
      ],
      caption: 'Câu Yes/No dùng A – R – E (Ngày 1); câu Wh- dùng D – D – F. Cả hai đều 2–3 câu.',
    },

    { t: 'h', text: '2. Filler học thuật — có thời gian nghĩ mà không im' },
    {
      t: 'table',
      head: ['Khi nào', 'Nói', 'Đừng nói'],
      rows: [
        ['Cần **2–3 giây** để nghĩ', 'Well, … · Let me think… · Hmm, that’s a good question.', 'Ờ… ừm… (im 5 giây)'],
        ['Câu hỏi **lạ**, chưa từng nghĩ', 'That’s an interesting question. I’ve never really thought about it, but I’d say…', 'I don’t know.'],
        ['Đưa ra **ý kiến nhẹ nhàng**', 'I’d say… · I suppose… · I guess… (thân mật)', 'I think, I think, I think…'],
        ['Nói **thật** / bất ngờ', 'To be honest, … · Actually, …', 'Honestly speaking (dịch "nói thật lòng" — không tự nhiên)'],
        ['**Sửa lời** khi nói nhầm', 'I mean… · Sorry, what I mean is…', 'Im lặng rồi nói lại từ đầu'],
        ['**Không hiểu** câu hỏi', 'Sorry, could you repeat the question, please? · Do you mean…?', 'What? / Huh?'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '**Mỗi câu trả lời một filler là đủ.** Ba filler liên tiếp ("Well, let me think, that’s an interesting question…") = né câu hỏi → giám khảo trừ FC.',
        'Filler **không thay cho nội dung**: sau "Well," phải là câu trả lời thật.',
        '**Xin nhắc lại câu hỏi** được phép và không bị trừ điểm. Nhưng ở **Part 1** giám khảo chỉ được **đọc lại** câu hỏi, **không** được giải thích từ — nếu vẫn chưa hiểu, hãy trả lời theo phần bạn hiểu. Ở **Part 3** giám khảo được phép diễn đạt lại câu hỏi.',
        '"**you know**", "**like**" lặp nhiều nghe non nớt. Thay bằng khoảng dừng ngắn có chủ ý.',
      ],
    },
    {
      t: 'rule',
      formula: 'Well, / Let me think… / I’d say… / To be honest, … + câu trả lời thật — tối đa 1 filler mỗi câu',
      vi: 'Filler để mua 2–3 giây suy nghĩ; im lặng quá 3 giây mới là lỗi FC.',
    },

    { t: 'h', text: '3. Kéo dài ý — 6 cách nối' },
    {
      t: 'table',
      head: ['Cách nối', 'Chức năng', 'Ví dụ'],
      rows: [
        ['**because / since**', 'lý do', 'I prefer mornings **because** my mind is clearer.'],
        ['**which means (that)**', 'hệ quả', 'My office is far away, **which means** I have to leave at 6.'],
        ['**for example / for instance**', 'ví dụ', '**For example**, last Sunday I cooked for the whole family.'],
        ['**especially / particularly**', 'nhấn một trường hợp', 'I love Vietnamese food, **especially** street food.'],
        ['**apart from that / also**', 'thêm ý', '**Apart from that**, I sometimes go swimming.'],
        ['**but / although**', 'đối lập, mặt kia', "I enjoy it, **although** it's quite expensive."],
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'unwind', pos: 'v', ipa: '/ˌʌnˈwaɪnd/', vi: 'thư giãn (sau căng thẳng)', ex: 'I usually unwind by listening to music.', exVi: 'Tôi thường thư giãn bằng cách nghe nhạc.', more: 'Quá khứ **unwound** /ʌnˈwaʊnd/. Gần nghĩa: **relax, chill out** (thân mật).' },
        { w: 'catch up with', pos: 'phr v', ipa: '/kætʃ ˈʌp wɪð/', vi: 'gặp lại để hàn huyên', ex: 'I catch up with my old classmates once a month.', exVi: 'Mỗi tháng tôi gặp hàn huyên với bạn học cũ một lần.', more: 'Còn nghĩa "đuổi kịp": catch up with the class.' },
        { w: 'hang out (with)', pos: 'phr v', ipa: '/hæŋ ˈaʊt/', vi: 'đi chơi, tụ tập (thân mật)', ex: 'We often hang out at a café near my school.', exVi: 'Chúng tôi hay tụ tập ở một quán cà phê gần trường.', more: 'Speaking Part 1 dùng tốt; Writing nên dùng **spend time with**.' },
        { w: 'night owl', pos: 'n', ipa: '/ˈnaɪt aʊl/', vi: 'cú đêm (người hay thức khuya)', ex: "I'm a real night owl — I do my best work after 10 p.m.", exVi: 'Tôi đúng là cú đêm — làm việc tốt nhất sau 10 giờ tối.', more: 'Ngược: **an early bird** (người dậy sớm).', anh: 'owl' },
        { w: 'take a nap', pos: 'phr', ipa: '/teɪk ə ˈnæp/', vi: 'chợp mắt, ngủ trưa ngắn', ex: 'Many Vietnamese people take a nap after lunch.', exVi: 'Nhiều người Việt ngủ trưa ngắn sau bữa trưa.', anh: 'sleeping-face' },
        { w: 'routine', pos: 'n', ipa: '/ruːˈtiːn/', vi: 'lịch sinh hoạt, thói quen hằng ngày', ex: 'My weekend routine is quite relaxed.', exVi: 'Lịch cuối tuần của tôi khá thoải mái.', more: '**a daily routine** · **stick to a routine**. Trọng âm sau: rou**TINE**.' },
        { w: 'close friend', pos: 'n', ipa: '/ˌkləʊs ˈfrend/', vi: 'bạn thân', ex: 'I have three close friends from high school.', exVi: 'Tôi có ba bạn thân từ hồi cấp ba.', more: 'close đọc **/kləʊs/** (âm /s/) khi là tính từ "thân, gần"; **/kləʊz/** khi là động từ "đóng".' },
        { w: 'have something in common', pos: 'phr', ipa: '/hæv ɪn ˈkɒmən/', vi: 'có điểm chung', ex: 'We have a lot in common — we both love football.', exVi: 'Chúng tôi có nhiều điểm chung — cả hai đều mê bóng đá.' },
      ],
    },

    { t: 'h', text: '4. Ba chủ đề Part 1 — mẫu yếu và mẫu tốt' },
    {
      t: 'canh',
      anh: ['spiral-calendar', 'people-hugging', 'bed'],
      caption: 'Giám khảo hỏi ba chủ đề trong ngân hàng Part 1 (S07): **Weekends**, **Friends**, **Sleep**. Thí sinh **Quân**, nhân viên văn phòng ở Hà Nội.',
    },
    {
      t: 'dialogue',
      title: 'Weekends · Friends · Sleep — band 4 và band 5–5.5',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'What do you usually do at weekends?' },
        { who: 'Band 4', role: 'b', text: 'Ờ… I go out. With friends.', vi: '❌ Im lặng + filler tiếng Việt; chỉ có D, không chi tiết, không cảm xúc.' },
        { who: 'Candidate', role: 'candidate', text: "Well, on Saturdays I usually catch up with my friends. We often go to a small café near West Lake and chat for hours. It's the best way for me to unwind after a busy week at work.", vi: 'À, thứ Bảy tôi thường gặp bạn bè. Chúng tôi hay đến một quán cà phê nhỏ gần Hồ Tây và nói chuyện hàng giờ. Đó là cách tốt nhất để tôi thư giãn sau một tuần làm việc bận rộn.' },
        { who: 'Examiner', role: 'examiner', text: 'How long have you known your best friend?' },
        { who: 'Candidate', role: 'candidate', text: "I've known him for about twelve years. We met in grade six, when we sat next to each other in maths class. We have a lot in common, especially our love of football, which means we never run out of things to talk about.", vi: 'Tôi quen cậu ấy khoảng mười hai năm. Chúng tôi gặp nhau năm lớp sáu, khi ngồi cạnh nhau trong giờ toán. Chúng tôi có nhiều điểm chung, nhất là cùng mê bóng đá, nên không bao giờ hết chuyện để nói.' },
        { who: 'Examiner', role: 'examiner', text: 'Why do some people find it hard to sleep?' },
        { who: 'Candidate', role: 'candidate', text: "That's an interesting question. I'd say the main reason is stress, because people take their problems to bed with them. Apart from that, many of us use our phones until midnight. For example, I'm a bit of a night owl myself, and I often scroll through social media much longer than I should.", vi: 'Câu hỏi hay đấy. Tôi cho rằng lý do chính là căng thẳng, vì người ta mang cả vấn đề lên giường. Ngoài ra, nhiều người dùng điện thoại đến nửa đêm. Ví dụ, bản thân tôi cũng hơi là cú đêm, và tôi hay lướt mạng xã hội lâu hơn mức nên làm.' },
        { who: 'Examiner', role: 'examiner', text: 'When do you usually take a nap?' },
        { who: 'Candidate', role: 'candidate', text: "Usually after lunch, around one o'clock. My company lets us rest for about thirty minutes, so I put my head on my desk and sleep for twenty minutes. To be honest, without that nap I can't concentrate in the afternoon.", vi: 'Thường là sau bữa trưa, khoảng một giờ. Công ty cho chúng tôi nghỉ khoảng ba mươi phút, nên tôi gục đầu lên bàn ngủ hai mươi phút. Nói thật là không có giấc ngủ ngắn đó thì buổi chiều tôi không tập trung được.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý trong câu trả lời mẫu',
      items: [
        'Mỗi câu **đúng một filler** (Well, / That’s an interesting question. / To be honest,) — không chồng nhiều filler.',
        '**How long have you known…?** → **I’ve known** him for… → rồi kể bằng quá khứ đơn: We **met** in grade six (Ngữ pháp mục 5).',
        'Từ nối kéo dài: **especially, which means, Apart from that, For example, so, without that…**',
      ],
    },

    { t: 'h', text: '5. Part 1 theo DẠNG câu hỏi — 6 dạng hay gặp, mỗi dạng một khung' },
    {
      t: 'p',
      text: 'Đề Part 1 thật đổi **chủ đề** liên tục (đồ ăn, thời tiết, đi bộ, ảnh chụp…), nhưng **cách hỏi** chỉ xoay quanh vài dạng. Nhận ra **dạng** trong 1 giây là biết ngay câu đầu tiên phải nói gì — không cần học thuộc câu trả lời cho từng chủ đề.',
    },
    {
      t: 'table',
      head: ['Dạng câu hỏi', 'Câu 1 (trả lời thẳng)', 'Câu 2–3 (kéo dài)'],
      rows: [
        ['**What is the best time to…?**', 'I think the best time to… is + thời điểm.', 'because + lý do · Thời điểm **xấu** thì sao: It’s not a good idea to… at…, because…'],
        ['**Is X suitable for…?** (children, old people…)', 'Yes, I think it’s suitable for… / Not really, it’s not very suitable for…', 'because + lý do · **but** + ngoại lệ: However, it might not be suitable for…'],
        ['**Is it easy or difficult to…?**', 'It’s quite easy / fairly difficult to…, actually.', 'lý do · **lúc đầu – về sau**: At first it was hard, but after a while…'],
        ['**What do you dislike about X?**', 'The only thing I don’t like about X is…', 'vì sao khó chịu + ví dụ nhỏ · có thể chốt: Apart from that, I love it.'],
        ['**When was the first / last time…?**', 'The last time I… was + thời điểm (quá khứ).', '2 câu **quá khứ đơn**: đi với ai, làm gì, cảm thấy thế nào. **Dừng** — không kể thành Part 2.'],
        ['**Is X popular in your country?**', 'Yes, it’s very popular in Vietnam, especially among + nhóm người.', 'vì sao phổ biến · xu hướng: These days more and more people…'],
      ],
    },
    {
      t: 'table',
      caption: 'Không nhớ rõ thời điểm (dạng first / last time) — 3 câu rào',
      head: ['Câu rào', 'Ví dụ'],
      rows: [
        ['**I can’t remember exactly, but** I think it was…', 'I can’t remember exactly, but I think it was about three years ago.'],
        ['**It’s been + thời gian + since I last** + V2', 'It’s been ages since I last went to the cinema — maybe six months.'],
        ['**As far as I can remember,** …', 'As far as I can remember, the first time I swam in the sea was when I was seven.'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Sáu dạng câu hỏi — câu trả lời mẫu (band ~5.5, ước tính)',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'What is the best time of day to go for a walk?' },
        { who: 'Candidate', role: 'candidate', text: "I'd say early morning is the best time, because the air is fresh and the streets are still quiet. Walking at noon isn't a good idea in Vietnam, because it's far too hot.", vi: 'Tôi cho rằng sáng sớm là lúc tốt nhất, vì không khí trong lành và đường phố còn yên tĩnh. Đi bộ buổi trưa ở Việt Nam thì không nên, vì nóng quá.' },
        { who: 'Examiner', role: 'examiner', text: 'Are video games suitable for young children?' },
        { who: 'Candidate', role: 'candidate', text: "Some of them are, I think. Simple games can teach kids colours and numbers. However, many popular games are too violent for young children, so parents should check them first.", vi: 'Tôi nghĩ một số trò thì phù hợp. Trò đơn giản có thể dạy trẻ màu sắc và con số. Tuy nhiên, nhiều trò phổ biến quá bạo lực với trẻ nhỏ, nên bố mẹ cần kiểm tra trước.' },
        { who: 'Examiner', role: 'examiner', text: 'Is it easy to cook Vietnamese food?' },
        { who: 'Candidate', role: 'candidate', text: "Some dishes are fairly easy, like fried rice. But at first I found it hard to make a good soup, because you need the right balance of fish sauce and sugar. After a few months of practice, it got much easier.", vi: 'Có món khá dễ, như cơm rang. Nhưng lúc đầu tôi thấy nấu canh ngon rất khó, vì phải cân đúng nước mắm và đường. Sau vài tháng tập thì dễ hơn nhiều.' },
        { who: 'Examiner', role: 'examiner', text: 'What do you dislike about your neighbourhood?' },
        { who: 'Candidate', role: 'candidate', text: "The only thing I don't like is the noise. There's a karaoke shop at the end of my street, and it's often open until midnight. Apart from that, it's a really nice place to live.", vi: 'Điều duy nhất tôi không thích là tiếng ồn. Cuối phố tôi có một quán karaoke, thường mở đến nửa đêm. Ngoài chuyện đó ra thì đây là nơi rất dễ chịu để sống.' },
        { who: 'Examiner', role: 'examiner', text: 'When was the last time you took a photo?' },
        { who: 'Candidate', role: 'candidate', text: "It was just yesterday, actually. I took a photo of a beautiful sunset from my balcony and sent it to my mum. She said it was the best picture I've ever taken.", vi: 'Mới hôm qua thôi. Tôi chụp cảnh hoàng hôn rất đẹp từ ban công và gửi cho mẹ. Mẹ bảo đó là bức ảnh đẹp nhất tôi từng chụp.' },
        { who: 'Examiner', role: 'examiner', text: 'Is cycling popular in your country?' },
        { who: 'Candidate', role: 'candidate', text: "Not as popular as it used to be. Most people in big cities ride motorbikes now, because the distances are long. But cycling is coming back among young people, especially for exercise at weekends.", vi: 'Không còn phổ biến như trước. Phần lớn người ở thành phố lớn giờ đi xe máy vì quãng đường xa. Nhưng xe đạp đang trở lại với người trẻ, nhất là để tập thể dục cuối tuần.' },
      ],
    },
    {
      t: 'table',
      caption: 'Câu hỏi quá rộng ("What kind of food / clothes / music…?") — khung It depends',
      head: ['Bước', 'Khung', 'Ví dụ: What kind of clothes do you usually wear?'],
      rows: [
        ['1 · Nói "tuỳ"', 'It depends on + điều kiện.', 'It depends on where I’m going.'],
        ['2 · Trường hợp A', 'If…, I usually…', 'If I’m going to work, I usually wear a shirt and trousers.'],
        ['3 · Trường hợp B', 'But if… / At weekends, …', 'But at weekends I just wear jeans and a T-shirt, because they’re comfortable.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận — Part 1 ngắn, thẳng, dừng đúng lúc',
      items: [
        '**2–3 câu (20–30 giây) là đủ.** Đừng nói đến khi giám khảo phải ngắt lời — Part 1 có khoảng 12 câu trong 4–5 phút, nói quá dài là chiếm giờ và hay lạc ý.',
        '**Câu đầu tiên trả lời thẳng đúng câu hỏi.** Hỏi "best time" → câu đầu là một thời điểm; hỏi "dislike" → câu đầu là một điều không thích. Đừng mở đầu bằng chuyện khác.',
        '**Đừng cố nhét từ khó** vào Part 1. Một từ đơn giản dùng đúng tốt hơn một thành ngữ dùng sai — Part 1 chấm sự tự nhiên.',
        '**Chốt câu dứt khoát**: câu cuối hạ giọng xuống, rồi dừng. Đừng treo "and…", "so…", "but yeah…" rồi im — nghe như bạn chưa nói xong.',
        'Dạng **first / last time**: kể **2 câu quá khứ** rồi dừng. Nếu kể đủ ai – ở đâu – vì sao – cảm xúc như Part 2 là quá dài.',
      ],
    },
    {
      t: 'rule',
      formula: 'Nhận DẠNG câu hỏi → câu 1 trả lời đúng dạng → 1–2 câu lý do / ví dụ / mặt kia → hạ giọng, dừng.',
      vi: 'Part 1 = 2–3 câu. Biết dạng là biết câu đầu tiên.',
    },
    {
      t: 'mcq',
      id: 't2d5-noi-dang-chon',
      title: 'Chọn câu trả lời Part 1 tốt nhất (5 câu)',
      items: [
        {
          q: 'What is the best time to visit your hometown?',
          options: [
            'My hometown is in the north and it has a lot of famous dishes, and the people are friendly, and…',
            'Probably in spring, around March, because the weather is cool and there are flowers everywhere.',
            'Spring.',
          ],
          correct: 1,
          why: 'B trả lời **thẳng một thời điểm** rồi thêm lý do, 1–2 câu, chốt gọn. A không trả lời câu hỏi và treo "and…". C quá cụt (band 4).',
        },
        {
          q: 'What do you dislike about public transport?',
          options: [
            'The only thing I really dislike is that buses are often late, so I can never plan my time properly.',
            'Public transport is very important for big cities because it reduces traffic and pollution in the long term.',
            'I dislike it.',
          ],
          correct: 0,
          why: 'Dạng **dislike** → câu đầu nêu **một điều không thích**: "The only thing I really dislike is…". B nói như Part 3 (lợi ích cho xã hội), không trả lời câu hỏi. C cụt.',
        },
        {
          q: 'When was the last time you went to the cinema?',
          options: [
            'I go to the cinema twice a month because I love films.',
            "It's been a while since I last went — probably two months ago. I saw a comedy with my sister and we laughed the whole time.",
            "Last time I went to the cinema it was a Saturday and I met my friend first and we had coffee and then we bought tickets and then we watched a film and then we went for dinner and then…",
          ],
          correct: 1,
          why: 'B dùng câu rào **It’s been a while since I last went**, 2 câu **quá khứ**, rồi dừng. A sai thì (hiện tại đơn — trả lời "how often"). C kể lê thê như Part 2, toàn "and then".',
        },
        {
          q: 'Is it easy to learn to swim?',
          options: [
            'At first it was quite difficult for me, because I was scared of the water, but after a few lessons it became much easier.',
            'Swimming is a sport.',
            'Yes. Swimming is good for health. Swimming is good for children. Swimming is popular.',
          ],
          correct: 0,
          why: 'A dùng cách kéo dài **lúc đầu khó → sau dễ**. B lạc đề. C lặp "swimming" ba lần, ba câu rời không nối — FC thấp.',
        },
        {
          q: 'What kind of music do you like?',
          options: [
            'Music.',
            'It depends on my mood. If I’m studying, I listen to soft piano music, but when I’m at the gym I prefer fast pop songs.',
            'I like music, and music is good, and I listen to music every day, and…',
          ],
          correct: 1,
          why: 'Câu hỏi **rộng** → khung **It depends → If… → but when…**. A cụt; C lặp từ và treo "and…".',
        },
      ],
    },

    { t: 'h', text: '6. Kéo dài bằng đối lập — 4 khung + mở câu tần suất bằng bối cảnh' },
    {
      t: 'p',
      text: 'Ngoài because / for example (mục 3), cách kéo dài **tự nhiên nhất** là nói thêm **mặt kia**: điều mình thích **và** điều chưa thích, lúc đầu **và** bây giờ. Câu nghe chín chắn hơn mà không cần từ khó.',
    },
    {
      t: 'table',
      head: ['Khung', 'Ví dụ'],
      rows: [
        ['**Generally I love X, but the only thing I don’t like is…**', 'Generally I love living in Hanoi, but the only thing I don’t like is the traffic in the rush hour.'],
        ['**At first… , but after a while…** (lúc đầu – về sau)', 'At first I found online classes boring, but after a while I got used to them.'],
        ['**X is great at / in…, but not at / in…** (lúc tốt – lúc xấu)', 'The beach is great in the early morning, but not at midday, when it gets really crowded.'],
        ['**The good thing is…, while the downside is…** (ưu – nhược)', 'The good thing about my phone is the camera, while the downside is the battery — it dies by 4 p.m.'],
      ],
    },
    {
      t: 'table',
      caption: 'Câu tần suất dễ cụt ("How often do you…?") — mở bằng bối cảnh',
      head: ['Cụt (band 4)', 'Có bối cảnh (band 5–5.5)'],
      rows: [
        ['I go swimming once a week.', 'These days I’m really busy with work, so I only go swimming once a week, usually on Sunday mornings.'],
        ['I read books every night.', 'Since I started living alone, I’ve had more free time, so I read for about half an hour every night before bed.'],
        ['I rarely cook.', 'My office is far from home and I get back quite late, so to be honest I rarely cook — maybe twice a month.'],
      ],
    },
    {
      t: 'rule',
      formula: 'Generally I love X, but the only thing I don’t like is… · At first…, but after a while… · Bối cảnh + so + tần suất',
      vi: 'Kéo dài bằng mặt kia hoặc bằng hoàn cảnh — không cần từ khó.',
    },
    {
      t: 'quiz',
      id: 't2d5-noi-doi-lap',
      title: 'Dịch câu kéo dài bằng đối lập (4 câu)',
      kind: 'translate',
      grammar: 'Generally I love…, but the only thing I don’t like is… · At first…, but after a while… · …, while the downside is… · These days…, so…',
      items: [
        { q: 'Nhìn chung tôi rất thích công việc của mình, nhưng điều duy nhất tôi không thích là phải làm thêm giờ.', hint: 'Generally I love my job, but the only thing I don’t like is, working overtime', answers: ["Generally I love my job, but the only thing I don't like is working overtime.", "Generally, I love my job, but the only thing I don't like is working overtime.", "Generally I love my job, but the only thing I don't like is having to work overtime.", "Generally, I love my job, but the only thing I don't like is having to work overtime.", "Generally I love my job, but the only thing I dislike is working overtime."] },
        { q: 'Lúc đầu tôi thấy tiếng Anh rất khó, nhưng sau một thời gian thì nó dễ dần.', hint: 'At first I found English very difficult, but after a while, it got easier', answers: ['At first I found English very difficult, but after a while it got easier.', 'At first, I found English very difficult, but after a while it got easier.', 'At first I found English very difficult, but after a while it became easier.', 'At first, I found English very difficult, but after a while, it got easier.', 'At first I found English very hard, but after a while it got easier.'] },
        { q: 'Điểm hay của xe máy là nhanh, còn điểm dở là không an toàn.', hint: 'The good thing about motorbikes is…, while the downside is…', answers: ["The good thing about motorbikes is that they're fast, while the downside is that they're not safe.", 'The good thing about motorbikes is that they are fast, while the downside is that they are not safe.', 'The good thing about motorbikes is the speed, while the downside is safety.', "The good thing about motorbikes is that they're fast, while the downside is that they aren't safe.", 'The good thing about motorbikes is that they are quick, while the downside is that they are not safe.'] },
        { q: 'Dạo này tôi khá bận, nên tôi chỉ gặp bạn bè khoảng hai lần một tháng.', hint: "These days I'm quite busy, so I only meet my friends about twice a month", answers: ["These days I'm quite busy, so I only meet my friends about twice a month.", 'These days I am quite busy, so I only meet my friends about twice a month.', "These days I'm quite busy, so I only see my friends about twice a month.", 'These days I am quite busy, so I only see my friends about twice a month.', "These days I'm pretty busy, so I only meet my friends about twice a month."] },
      ],
    },

    { t: 'h', text: '7. Phát âm: /z/ · /ʒ/ · /ŋ/ · /h/ · /j/' },
    {
      t: 'table',
      head: ['Âm', 'Cách đọc', 'Lỗi người Việt', 'Từ luyện'],
      rows: [
        ['/z/', 'như /s/ nhưng **rung** cổ ("zzz" của con ong)', 'đọc thành /s/ ở cuối từ: ~~rises~~ "rai-sít"', '**z**oo · la**z**y · ri**s**e · friend**s** /dz/ · weekend**s** /dz/'],
        ['/ʒ/', 'như /ʃ/ nhưng **rung**', 'đọc thành "d" hoặc /ʃ/', 'u**s**ually · plea**s**ure · lei**s**ure · televi**s**ion · deci**s**ion'],
        ['/ŋ/', 'cuống lưỡi chạm vòm mềm, hơi ra mũi; **không** bật /ɡ/ sau', 'đọc "-ing" thành "inh" hoặc thêm /k/', 'si**ng** · morni**ng** · lo**ng** · readi**ng** · Ho**ng** Kong'],
        ['/h/', 'hơi thở nhẹ từ cổ họng', 'bỏ /h/ ở từ không nhấn hoặc thêm /h/ vào hour, honest', '**h**obby · **h**appy · **h**ome · per**h**aps (nhưng **h**our câm)'],
        ['/j/', 'như "d" nhẹ trong "da" miền Nam / "i" lướt', 'bỏ /j/: year → "ia" (nghe như ear)', '**y**es · **y**ear · **y**oung · **u**sually /ˈjuːʒuəli/ · m**u**sic /ˈmjuːzɪk/'],
      ],
    },
    {
      t: 'phatam',
      id: 't2d5-phat-am',
      title: 'Luyện phát âm — /z ʒ ŋ h j/',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. /z/ và /ʒ/ phải rung cổ (đặt tay lên cổ để kiểm tra). -ing kết thúc bằng /ŋ/, không có /k/ hay /ɡ/. year bắt đầu bằng /j/ — khác ear.',
      items: [
        { text: 'zoo, lazy, rise, friends', ipa: 'zuː leɪzi raɪz frendz', vi: '/z/ đầu, giữa, cuối từ' },
        { text: 'usually, pleasure, leisure, decision', ipa: 'juːʒuəli pleʒə leʒə dɪsɪʒn', vi: '/ʒ/' },
        { text: 'sing, morning, long, reading', ipa: 'sɪŋ mɔːnɪŋ lɒŋ riːdɪŋ', vi: '/ŋ/ cuối — không bật /ɡ/' },
        { text: 'year, ear, yes, young', ipa: 'jɪə ɪə jes jʌŋ', vi: '/j/: year ≠ ear' },
        { text: 'I usually relax at home on Sundays.', ipa: 'aɪ juːʒuəli rɪlæks ət həʊm ɒn sʌndeɪz', vi: 'usually /j ʒ/ · home /h/ · Sundays /z/' },
        { text: 'Reading is my favourite leisure activity.', ipa: 'riːdɪŋ ɪz maɪ feɪvərɪt leʒər æktɪvəti', vi: 'reading /ŋ/ · is /z/ · leisure /ʒ/' },
        { text: "I've had this hobby for years.", ipa: 'aɪv hæd ðɪs hɒbi fə jɪəz', vi: 'had, hobby /h/ · years /j/ + /z/' },
        { text: 'Young people often hang out in the evening.', ipa: 'jʌŋ piːpl ɒfn hæŋ aʊt ɪn ði iːvnɪŋ', vi: 'young /j ŋ/ · hang /h ŋ/ · evening /ŋ/' },
      ],
    },

    { t: 'h', text: '8. Luyện nói với AI chấm' },
    {
      t: 'p',
      text: 'Mỗi câu **D – D – F**, 20–30 giây, **tối đa một filler**. Có câu hỏi **How long / Have you ever** — dùng HTHT rồi kể bằng quá khứ đơn.',
    },
    {
      t: 'speak',
      id: 't2d5-noi-weekend-friends',
      part: '1',
      questions: [
        'What do you usually do at weekends?',
        'Who do you usually spend your weekends with?',
        'How long have you known your best friend?',
        'What do you and your friends usually talk about?',
      ],
    },
    {
      t: 'speak',
      id: 't2d5-noi-sleep',
      part: '1',
      questions: [
        'How many hours do you usually sleep at night?',
        'What do you do when you cannot fall asleep?',
        'Have you ever stayed up all night?',
        'Why do some people find it hard to sleep?',
      ],
    },
    {
      t: 'p',
      text: 'Bộ thứ ba trộn **đủ 6 dạng câu hỏi** của mục 5 — câu đầu trả lời đúng dạng, 2–3 câu, rồi dừng.',
    },
    {
      t: 'speak',
      id: 't2d5-noi-dang-cau',
      part: '1',
      questions: [
        'What is the best time of year to visit your city?',
        'Is your hometown a suitable place for young people to live?',
        'Is it easy or difficult to find a good job where you live?',
        'What do you dislike about using your mobile phone?',
        'When was the last time you went to a restaurant?',
        'Is street food popular in your country?',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm',
      items: [
        'Bộ 6 dạng: câu đầu có trả lời **đúng dạng** không (best time → thời điểm; dislike → một điều không thích; last time → quá khứ)? Có câu nào dài quá 40 giây không?',
        'Mỗi câu ≥ 20 giây? Có đủ **D – D – F**?',
        'Đếm filler: có câu nào ≥ 2 filler? Có chỗ nào **im lặng > 3 giây**?',
        'Câu **How long / Have you ever**: có dùng **have / has + V3** không? Sang chi tiết có đổi sang **quá khứ đơn** không?',
        'Nghe lại âm cuối: **friends /dz/, usually /ʒ/, morning /ŋ/**.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D5_HOMEWORK: Lesson = {
  id: 't2d5-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 5',
  goal: 'Tự kiểm tra Ngày 5 bằng 34 câu có đáp án: 12 câu chọn thì, 8 câu for / since / just / already / yet, 3 câu nghe chép, 6 câu dịch, 5 câu chọn cách trả lời Part 1 tốt nhất.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (34 câu)',
      items: [
        '**Phần I** — HTHT hay quá khứ đơn (12 câu trắc nghiệm).',
        '**Phần II** — for / since / just / already / yet / ever / never (8 câu điền).',
        '**Phần III** — Nghe chép 3 câu.',
        '**Phần IV** — Dịch 6 câu.',
        '**Phần V** — Part 1: filler và kéo dài ý (5 câu trắc nghiệm).',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Ngày 5 trong một hình',
      center: '**Ngày 5**',
      branches: [
        { label: 'Ngữ pháp: HTHT vs QKĐ', items: ['have / has + V3', 'for khoảng · since mốc', 'just · already · yet · ever', 'mốc đã hết → V2'] },
        { label: 'Nghe', items: ['Dictation: 4 lượt', '’ve / ’s / -ed bị nuốt', 'Table: cột = loại thông tin', 'used to… but now · any more'] },
        { label: 'Nói: Part 1 Wh-', items: ['D – D – F', 'Well, / I’d say… (1 filler)', 'because · which means · for example', '/z ʒ ŋ h j/'] },
      ],
    },

    { t: 'h', text: 'Phần I — Chọn thì (12 câu)' },
    {
      t: 'mcq',
      id: 't2d5-bt-thi',
      title: 'Phần I — HTHT hay quá khứ đơn (12 câu)',
      items: [
        { q: 'I ___ to London in 2018.', options: ['have gone', 'went', 'have been'], correct: 1, why: '**in 2018** = mốc đã kết thúc → quá khứ đơn.' },
        { q: 'We ___ in this flat for six years, and we still love it.', options: ['have lived', 'lived', 'live'], correct: 0, why: '**for six years** + "still love it" (vẫn đang sống) → HTHT.' },
        { q: 'He ___ his leg when he was skiing last winter.', options: ['has broken', 'had broke', 'broke'], correct: 2, why: '**last winter** → quá khứ đơn: break – **broke** – broken.' },
        { q: '___ you ___ the new Marvel film yet?', options: ['Did / see', 'Have / seen', 'Have / saw'], correct: 1, why: '**yet** + câu hỏi → HTHT: Have + S + **V3** (seen).' },
        { q: 'My sister ___ three books since January.', options: ['has read', 'read', 'reads'], correct: 0, why: '**since January** (tới nay) → HTHT: has + read (V3 /red/).' },
        { q: 'How long ago ___ you start this job?', options: ['have', 'had', 'did'], correct: 2, why: '**ago** → quá khứ đơn: How long ago **did** you start…?' },
        { q: 'I can’t find my glasses. Have you ___ them?', options: ['saw', 'seen', 'see'], correct: 1, why: 'Have + **V3**: see – saw – **seen**.' },
        { q: 'Unemployment ___ steadily since 2020.', options: ['fell', 'has fallen', 'falls'], correct: 1, why: '**since 2020** → HTHT: has **fallen** (Task 1 khi giai đoạn kéo tới nay).' },
        { q: 'In 2015, the population of the city ___ 2 million.', options: ['reached', 'has reached', 'reaches'], correct: 0, why: '**In 2015** → quá khứ đơn.' },
        { q: 'This is the first time I ___ sushi.', options: ['ate', 'eat', 'have eaten'], correct: 2, why: '**This is the first time** + HTHT.' },
        { q: '"Is Hoa at home?" — "No, she ___ to the supermarket."', options: ['has gone', 'has been', 'went to'], correct: 0, why: 'Đã đi và **chưa về** → has **gone**.' },
        { q: 'I ___ him at a party two weeks ago.', options: ['have met', 'met', 'have been meeting'], correct: 1, why: '**two weeks ago** → quá khứ đơn: met.' },
      ],
    },

    { t: 'h', text: 'Phần II — Từ đi với HTHT (8 câu — mỗi từ dùng đúng một lần)' },
    {
      t: 'quiz',
      id: 't2d5-bt-tu',
      title: 'Phần II — Điền for / since / just / already / yet / ever / never / still (8 câu)',
      kind: 'fill',
      items: [
        { q: 'I have worked here ___ 2022.', answers: ['since'] },
        { q: 'They have been married ___ twenty years.', answers: ['for'] },
        { q: 'Have you ___ been to Phu Quoc?', answers: ['ever'] },
        { q: 'I have ___ eaten snake, and I don’t want to try it.', answers: ['never'] },
        { q: 'The bus has ___ left — you missed it by one minute!', answers: ['just'] },
        { q: 'Don’t tell me the ending. I haven’t watched it ___.', answers: ['yet'] },
        { q: 'She has ___ finished the report, two days early.', answers: ['already'] },
        { q: 'It’s 11 p.m. and he ___ hasn’t come home.', answers: ['still'] },
      ],
    },

    { t: 'h', text: 'Phần III — Nghe chép (3 câu)' },
    {
      t: 'dictation',
      id: 't2d5-bt-chep',
      title: 'Phần III — Nghe và chép cả câu (3 câu)',
      items: [
        { label: 'Câu 1', spell: 'I have never been to a swimming class before.', answer: 'I have never been to a swimming class before.', alt: ["I've never been to a swimming class before."] },
        { label: 'Câu 2', spell: 'The yoga class has moved to Monday evenings.', answer: 'The yoga class has moved to Monday evenings.', alt: ["The yoga class's moved to Monday evenings."] },
        { label: 'Câu 3', spell: 'We met at university, and we have been friends ever since.', answer: 'We met at university, and we have been friends ever since.', alt: ["We met at university, and we've been friends ever since.", 'We met at university and we have been friends ever since.', "We met at university and we've been friends ever since."] },
      ],
    },

    { t: 'h', text: 'Phần IV — Dịch (6 câu)' },
    {
      t: 'quiz',
      id: 't2d5-bt-dich',
      title: 'Phần IV — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'have / has + V3 + for / since / ever / never / just / yet · mốc đã hết → quá khứ đơn.',
      items: [
        { q: 'Tôi đã học ở trường này được hai năm.', hint: 'have studied, at this school, for two years', answers: ['I have studied at this school for two years.', "I've studied at this school for two years.", 'I have been studying at this school for two years.', "I've been studying at this school for two years.", 'I have studied in this school for two years.'] },
        { q: 'Bạn đã bao giờ đi máy bay chưa?', hint: 'Have you ever, flown / been on a plane / travelled by plane', answers: ['Have you ever flown?', 'Have you ever been on a plane?', 'Have you ever travelled by plane?', 'Have you ever traveled by plane?', 'Have you ever taken a plane?', 'Have you ever flown on a plane?'] },
        { q: 'Tôi chưa làm xong bài tập về nhà.', hint: "haven't finished, my homework, yet", answers: ["I haven't finished my homework yet.", 'I have not finished my homework yet.', "I haven't done my homework yet.", 'I have not done my homework yet.'] },
        { q: 'Chúng tôi chuyển đến đây năm 2019.', hint: 'moved here, in 2019', answers: ['We moved here in 2019.', 'In 2019 we moved here.', 'In 2019, we moved here.'] },
        { q: 'Ông tôi vừa mới nghỉ hưu.', hint: 'My grandfather, has just retired', answers: ['My grandfather has just retired.', 'My grandpa has just retired.', "My grandfather's just retired."] },
        { q: 'Trong mười năm qua, số người dùng điện thoại thông minh đã tăng mạnh.', hint: 'Over the past ten years, the number of smartphone users, has risen / increased sharply', answers: ['Over the past ten years, the number of smartphone users has risen sharply.', 'Over the past ten years, the number of smartphone users has increased sharply.', 'Over the past ten years the number of smartphone users has risen sharply.', 'In the past ten years, the number of smartphone users has risen sharply.', 'In the past ten years, the number of smartphone users has increased sharply.', 'Over the last ten years, the number of smartphone users has risen sharply.', 'Over the last ten years, the number of smartphone users has increased sharply.', 'Over the past decade, the number of smartphone users has risen sharply.', 'Over the past decade, the number of smartphone users has increased sharply.'] },
      ],
    },

    { t: 'h', text: 'Phần V — Part 1: filler và kéo dài ý (5 câu)' },
    {
      t: 'mcq',
      id: 't2d5-bt-noi',
      title: 'Phần V — Chọn câu trả lời tốt nhất (5 câu)',
      items: [
        {
          q: 'Examiner: "What kind of music do you like?"',
          options: [
            'Well, let me think, that is a good question, hmm, I like pop.',
            "I'd say I mostly listen to Vietnamese pop, especially songs by Den Vau, because his lyrics are about everyday life, which means I can relate to them.",
            'Pop music.',
          ],
          correct: 1,
          why: 'B: một filler (I’d say), D – D – F đủ, nối bằng especially / because / which means. A chồng 3 filler rồi trả lời cụt; C cụt.',
        },
        {
          q: 'Examiner: "How long have you lived in your current home?"',
          options: [
            "I've lived there for about five years. We moved in when my younger brother was born, because our old flat was too small.",
            'I live there five years.',
            'I have lived there since five years ago.',
          ],
          correct: 0,
          why: 'A: HTHT + for, rồi kể bằng quá khứ đơn (moved, was born). B sai thì; C ghép sai "since … ago".',
        },
        {
          q: 'Bạn không hiểu câu hỏi của giám khảo. Bạn nên nói:',
          options: ['What?', "Sorry, could you repeat the question, please?", '(Im lặng chờ giám khảo hỏi câu khác)'],
          correct: 1,
          why: 'Xin nhắc lại câu hỏi **lịch sự** là được phép và không bị trừ điểm.',
        },
        {
          q: 'Examiner: "Who do you usually go shopping with?"',
          options: [
            'Usually with my mum. We go to Ben Thanh Market on Sunday mornings, and to be honest, I mainly go because she always buys me lunch afterwards!',
            'My mum.',
            'Honestly speaking, I think, I think my mum.',
          ],
          correct: 0,
          why: 'A: trả lời thẳng + chi tiết (nơi, khi nào) + cảm xúc hài hước. C dùng "Honestly speaking" (không tự nhiên) và lặp "I think".',
        },
        {
          q: 'Câu nào dùng "which means" đúng?',
          options: [
            'Which means I like walking.',
            'I like walking, which means because it is healthy.',
            'I live near my office, which means I can walk to work.',
          ],
          correct: 2,
          why: '**which means (that)** + mệnh đề nêu **hệ quả** của câu trước (C). A thiếu mệnh đề chính; B ghép sai với because.',
        },
      ],
    },
  ],
};

export const NGAY_5: Lesson[] = [T2D5_GRAMMAR, T2D5_LISTENING, T2D5_SPEAKING, T2D5_HOMEWORK];
