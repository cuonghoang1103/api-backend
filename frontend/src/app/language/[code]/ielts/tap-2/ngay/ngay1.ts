/**
 * IELTS Tập 2 · Ngày 1 — Mạo từ a / an / the / Ø [G10] · Listening Part 1 Form completion 2:
 * đăng ký khoá học [L03 L07] · Speaking Part 1 ôn Yes/No: Work/Study · Hometown · Home [S02 S07]
 * 🔊 /p b t d k ɡ/ bật hơi + âm cuối [S11] · Bài tập (34 câu).
 *
 * Nguồn đề cương: docs/ielts-lo-trinh-0-8.md mục 3.2 hàng N1. Nội dung tự soạn (lời giảng, câu ví dụ,
 * kịch bản nghe, câu bài tập). Vòng 2 của Part 1 Listening (Tập 1 Ngày 7, 15) và Part 1 Yes/No
 * (Tập 1 Ngày 4); vòng 1 (dạy hệ thống) của mạo từ — Tập 1 Ngày 5 mới nhập a / an / some / any / the.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T2D1_GRAMMAR: Lesson = {
  id: 't2d1-ngu-phap',
  kind: 'grammar',
  title: 'Mạo từ a / an / the / Ø — địa danh, lần nhắc thứ hai, danh từ chung',
  goal: 'Chọn đúng a / an / the / không mạo từ (Ø) trong mọi câu thường gặp — kể cả tên địa danh và câu nói chung chung của Writing Task 2 — để bớt hẳn loại lỗi làm tụt điểm Grammatical Range & Accuracy (GRA) nhiều nhất của người Việt.',
  minutes: 80,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy tiêu chí **GRA** (ngữ pháp) của **Writing và Speaking** từ 4.0 lên 5.0: band 4 "lỗi mạo từ, số nhiều **thường xuyên**"; band 5 "dạng cơ bản đúng **khá ổn**". Mạo từ là lỗi số 1 vì tiếng Việt **không có** mạo từ.',
        'Tiếng Anh có **4 lựa chọn** trước danh từ: **a**, **an**, **the** và **Ø** (zero article — không dùng mạo từ nào). Chọn bằng **3 câu hỏi**: đếm được không? số ít hay nhiều? người nghe đã biết **cái nào** chưa?',
        '**a / an** chọn theo **ÂM** đầu, không theo chữ: **an hour**, **a university**.',
        '**the** = "cái mà cả hai ta đều biết là cái nào": lần nhắc thứ hai, vật duy nhất, so sánh nhất, có cụm "of…" chỉ rõ.',
        '**Ø** = nói **chung chung** với danh từ số nhiều / không đếm được: ==**Pollution** is a serious problem.== (~~The pollution~~) — câu kiểu này có trong gần như mọi bài Task 2.',
        '**Địa danh** có luật riêng: **Vietnam, Hanoi, Asia** (Ø) nhưng **the UK, the Mekong, the Pacific, the Alps**.',
      ],
    },
    {
      t: 'p',
      text: 'Ở **Tập 1 Ngày 5** bạn đã gặp **a / an / some / any** khi học danh từ đếm được – không đếm được, và **the** cho "lần nhắc thứ hai". Hôm nay học **trọn hệ thống**: khi nào dùng cái nào, và đặc biệt là khi nào **không dùng gì cả** — chỗ người Việt sai nhiều nhất, vì ta hay "dịch" chữ **những, các, cái, sự, việc** thành ~~the~~.',
    },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Ba câu hỏi để chọn mạo từ',
      steps: [
        { label: '① Người nghe **đã biết** đó là **cái nào** chưa?', sub: 'Đã nhắc rồi · chỉ có một · có cụm "of / that…" chỉ rõ · so sánh nhất → **the** (mọi loại danh từ).' },
        { label: '② Chưa biết cái nào → danh từ **đếm được số ít**?', sub: 'Có → bắt buộc **a / an** (không bao giờ để trần: ~~I have car~~).' },
        { label: '③ Số nhiều hoặc không đếm được, nói **chung chung**?', sub: '→ **Ø** (không mạo từ): Children need love. Water is essential.' },
        { label: 'Số nhiều / không đếm được, **một ít**, chưa xác định?', sub: '→ **some / any** (Tập 1 Ngày 5) hoặc Ø: I bought (some) apples.' },
      ],
      caption: 'Luôn hỏi câu ① TRƯỚC: "the" được dùng với cả số ít, số nhiều lẫn không đếm được, miễn là đã xác định.',
    },

    { t: 'h', text: '1. a hay an? — theo ÂM đầu, không theo chữ cái đầu' },
    {
      t: 'p',
      text: '**an** đứng trước từ bắt đầu bằng **nguyên âm khi đọc** (âm /æ/, /e/, /ɪ/, /ɒ/, /ʌ/, /aʊ/…). **a** đứng trước **phụ âm khi đọc** — kể cả âm /j/ ("diu") và /w/. Vì vậy phải **đọc thầm** từ đó trước khi chọn, đừng nhìn chữ cái.',
    },
    {
      t: 'table',
      caption: 'Những trường hợp người học hay chọn sai',
      head: ['Chữ đầu', 'Âm đầu khi đọc', 'Mạo từ đúng'],
      rows: [
        ['**h câm**: hour, honest, honour, heir', 'nguyên âm /aʊ/, /ɒ/, /eə/', '**an** hour · **an** honest answer'],
        ['**h đọc**: house, hotel, hospital, holiday', 'phụ âm /h/', '**a** house · **a** hotel'],
        ['**u** đọc /juː/: university, uniform, useful, user', 'phụ âm /j/', '**a** university · **a** useful tip'],
        ['**u** đọc /ʌ/: umbrella, uncle, unusual', 'nguyên âm /ʌ/', '**an** umbrella · **an** unusual idea'],
        ['**eu**: European, euro', 'phụ âm /j/', '**a** European city · **a** euro'],
        ['**o** đọc /w/: one, once', 'phụ âm /w/', '**a** one-way ticket · **a** one-day course'],
        ['**chữ viết tắt** đọc từng chữ: MBA, SMS, X-ray, FAQ, IELTS', 'em /e/, es /e/, ex /e/, ef /e/, ai /aɪ/', '**an** MBA · **an** X-ray · **an** IELTS course'],
        ['chữ viết tắt **đọc như từ**: UNESCO, NASA', '/j/, /n/', '**a** UNESCO site'],
        ['**số**: 8, 11, 18', '/eɪ/ (eight), /ɪ/ (eleven)', '**an** 8-hour shift · **an** 11-year-old boy'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        '~~an university~~ → **a university** (/juː/ là phụ âm). ~~a hour~~ → **an hour** (h câm).',
        '~~a IELTS test~~ → **an IELTS test**: IELTS đọc /ˈaɪelts/, mở đầu bằng nguyên âm /aɪ/.',
        'Có tính từ đứng trước thì nhìn **tính từ**: **an** apple → **a** big apple; **a** job → **an** interesting job.',
      ],
    },
    {
      t: 'rule',
      formula: 'an + âm nguyên âm (an hour, an MBA) · a + âm phụ âm (a university, a one-day course)',
      vi: 'Đọc thầm từ ngay sau mạo từ — âm đầu quyết định, không phải chữ cái đầu.',
    },
    {
      t: 'quiz',
      id: 't2d1-a-an',
      title: 'Điền a hoặc an (8 câu)',
      kind: 'fill',
      items: [
        { q: 'I waited for ___ hour at the station.', answers: ['an'] },
        { q: 'She studies at ___ university in Da Nang.', answers: ['a'] },
        { q: 'He has ___ MBA from a British school.', answers: ['an'] },
        { q: 'We stayed in ___ small hotel near the beach.', answers: ['a'] },
        { q: 'It was ___ honest mistake.', answers: ['an'] },
        { q: 'I bought ___ one-way ticket to Hue.', answers: ['a'] },
        { q: 'Is there ___ IELTS centre in your town?', answers: ['an'] },
        { q: 'That is ___ unusual name.', answers: ['an'] },
      ],
    },

    { t: 'h', text: '2. a / an dùng khi nào?' },
    {
      t: 'table',
      head: ['Cách dùng', 'Giải thích', 'Ví dụ'],
      rows: [
        ['① Nhắc **lần đầu**, người nghe **chưa biết** cái nào', 'Danh từ đếm được **số ít**, "một cái nào đó".', 'I live in **a** small flat near **a** park. — Tôi sống trong một căn hộ nhỏ gần một công viên.'],
        ['② **Nghề nghiệp**, vai trò, phân loại', 'Tiếng Việt nói "tôi là sinh viên" — tiếng Anh **bắt buộc** có a / an.', 'I am **a** student. · My mother is **an** accountant. · It is **a** fast-growing city.'],
        ['③ **"mỗi"** trong số đo, tần suất, giá', 'a / an = per (mỗi).', 'twice **a** week · 60 km **an** hour · 30,000 dong **a** kilo'],
        ['④ Câu cảm thán, cụm cố định', 'What a…! · such a… · quite a… · half an hour · a lot of · a few.', '**What a** beautiful view! · It was **such a** long day.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận',
      items: [
        '**Nghề nghiệp số ít luôn có a / an**: ~~I am student.~~ ~~She is engineer.~~ → I am **a** student. She is **an** engineer. (Số nhiều thì Ø: They are **engineers**.)',
        'Đừng dùng **a / an** với danh từ **không đếm được**: ~~an advice~~, ~~a homework~~, ~~a good news~~ → **some advice**, **a piece of** advice, **good news**.',
        '**a / an** không đi với danh từ **số nhiều**: ~~a books~~ → **books / some books**.',
      ],
    },
    {
      t: 'rule',
      formula: 'a / an + N đếm được số ít — lần đầu · nghề nghiệp (She is an engineer) · "mỗi" (twice a week)',
      vi: 'Danh từ đếm được số ít KHÔNG BAO GIỜ đứng trần: phải có a / an, the, my, this…',
    },
    {
      t: 'quiz',
      id: 't2d1-a-an-dich',
      title: 'Dịch nhanh — a / an (4 câu)',
      kind: 'translate',
      grammar: 'Nghề nghiệp: S + am / is / are + a / an + N. "mỗi": twice a week, an hour. Lần đầu nhắc: a / an + N số ít.',
      items: [
        { q: 'Chị tôi là kế toán.', hint: 'My sister, is, an accountant', answers: ['My sister is an accountant.', 'My older sister is an accountant.', 'My elder sister is an accountant.'] },
        { q: 'Tôi học tiếng Anh ba lần một tuần.', hint: 'study English, three times a week', answers: ['I study English three times a week.', 'I learn English three times a week.', 'I have English classes three times a week.', 'I have English lessons three times a week.'] },
        { q: 'Tôi sống trong một căn hộ nhỏ.', hint: 'live in, a small flat / apartment', answers: ['I live in a small flat.', 'I live in a small apartment.'] },
        { q: 'Thật là một ngày dài!', hint: 'What a…!', answers: ['What a long day!', 'What a long day it was!', 'It was such a long day!'] },
      ],
    },

    { t: 'h', text: '3. the — "cái mà cả hai ta đều biết"' },
    {
      t: 'p',
      text: '**the** (mạo từ xác định) dùng khi người nói tin rằng **người nghe biết chính xác cái nào** đang được nhắc. Nó đi được với **mọi loại** danh từ: số ít (the car), số nhiều (the cars), không đếm được (the water). Có **7 lý do** khiến người nghe "biết cái nào":',
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Lần đầu (a) → lần hai (the)',
      cols: [
        {
          title: '**Lần 1 — a / an**',
          anh: 'house',
          items: ['I saw **a** house for rent near my office.', 'There is **a** café on the ground floor.', 'She bought **a** laptop and **a** printer.'],
        },
        {
          title: '**Lần 2 — the**',
          anh: 'key',
          items: ['**The** house has three bedrooms.', '**The** café opens at 7 a.m.', '**The** laptop was cheap, but **the** printer was expensive.'],
        },
      ],
      caption: 'Lần đầu người nghe chưa biết cái nào → a / an. Từ lần thứ hai, cả hai đã biết → the.',
    },
    {
      t: 'table',
      head: ['Lý do người nghe biết "cái nào"', 'Ví dụ'],
      rows: [
        ['① **Lần nhắc thứ hai**', 'We watched a film. **The** film was about climate change.'],
        ['② Vật **duy nhất** (trong thế giới / trong hoàn cảnh)', '**the** sun · **the** moon · **the** world · **the** internet · **the** environment · **the** government (của nước mình) · **the** capital'],
        ['③ Hoàn cảnh nói làm rõ (cùng ở một chỗ)', 'Could you close **the** window? (cửa sổ phòng này) · Where is **the** toilet?'],
        ['④ Có cụm / mệnh đề **chỉ rõ** đứng sau', '**the** price **of houses in Hanoi** · **the** man **who lives next door** · **the** history **of Vietnam**'],
        ['⑤ **So sánh nhất**, số thứ tự, only, same, next, last (trong một chuỗi)', '**the** best · **the** first time · **the** only reason · **the** same · **the** next stop'],
        ['⑥ **the + tính từ** = cả một nhóm người', '**the** elderly (người già) · **the** young · **the** poor · **the** unemployed — động từ chia **số nhiều**: The elderly **need** care.'],
        ['⑦ Nhạc cụ, thập niên, một số cụm cố định', 'play **the** guitar · in **the** 1990s · in **the** morning · at **the** weekend (Anh) · go to **the** cinema'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Thiếu **the** ở so sánh nhất: ~~It is best way to learn.~~ → It is **the** best way to learn.',
        'Thiếu **the** khi có "of": ~~Price of petrol is rising.~~ → **The** price of petrol is rising.',
        '**the + tính từ** không thêm -s: ~~the olds~~, ~~the poors~~ → **the elderly / old people**, **the poor**.',
        'Câu hỏi "the government" hay "governments"? Nói về chính phủ **nước mình / một nước cụ thể** → **the government**; nói chung **mọi chính phủ** → **governments** (Ø). Task 2: "**Governments** should invest more in public transport."',
      ],
    },
    {
      t: 'rule',
      formula: 'the + N (mọi loại) — lần hai · duy nhất · có "of / who…" chỉ rõ · so sánh nhất · the + adj = nhóm người',
      vi: 'Hỏi: người nghe đã biết CÁI NÀO chưa? Biết rồi → the.',
    },
    {
      t: 'quiz',
      id: 't2d1-the-dich',
      title: 'Dịch nhanh — the (5 câu)',
      kind: 'translate',
      grammar: 'the + so sánh nhất · the + N + of… · the + adj (nhóm người, động từ số nhiều) · lần nhắc thứ hai · vật duy nhất (the internet, the environment).',
      items: [
        { q: 'Đây là cách tốt nhất để học từ vựng.', hint: 'This is, the best way, to learn vocabulary', answers: ['This is the best way to learn vocabulary.', 'This is the best way to learn new vocabulary.', 'This is the best way to learn words.'] },
        { q: 'Giá nhà ở Hà Nội đang tăng.', hint: 'The price(s) of houses / housing, in Hanoi, is / are rising', answers: ['The price of houses in Hanoi is rising.', 'The prices of houses in Hanoi are rising.', 'House prices in Hanoi are rising.', 'The price of housing in Hanoi is rising.', 'Housing prices in Hanoi are rising.', 'The price of houses in Hanoi is increasing.', 'House prices in Hanoi are increasing.', 'The prices of houses in Hanoi are increasing.'] },
        { q: 'Người già cần được chăm sóc nhiều hơn.', hint: 'The elderly (động từ số nhiều), need, more care', answers: ['The elderly need more care.', 'Elderly people need more care.', 'Old people need more care.', 'The elderly need more attention.', 'Elderly people need more attention.'] },
        { q: 'Tôi đọc một bài báo về internet. Bài báo đó rất hay.', hint: 'an article about the internet. The article was…', answers: ['I read an article about the internet. The article was very interesting.', 'I read an article about the internet. The article was really interesting.', 'I read an article about the internet. It was very interesting.', 'I read an article about the Internet. The article was very interesting.', 'I read an article about the internet. The article was very good.'] },
        { q: 'Chị tôi chơi ghi-ta mỗi tối.', hint: 'plays the guitar, every evening', answers: ['My sister plays the guitar every evening.', 'My sister plays the guitar every night.', 'My older sister plays the guitar every evening.', 'My elder sister plays the guitar every evening.'] },
      ],
    },

    { t: 'h', text: '4. Ø — không dùng mạo từ: nói chung chung' },
    {
      t: 'p',
      text: 'Khi nói về một thứ **nói chung** (tất cả các thứ thuộc loại đó, không chỉ riêng cái nào), dùng **danh từ số nhiều** hoặc **danh từ không đếm được** mà **không có mạo từ**. Tiếng Việt hay thêm "những", "các", "sự", "việc" ở đầu — **đừng** dịch các chữ đó thành ~~the~~.',
    },
    {
      t: 'sodo',
      kind: 'compare',
      title: 'Nói chung (Ø) hay nói một nhóm cụ thể (the)?',
      cols: [
        {
          title: '**Ø — nói chung**',
          anh: 'globe-showing-asia-australia',
          items: ['**Children** need a lot of sleep. (mọi trẻ em)', '**Pollution** is a serious problem. (ô nhiễm nói chung)', '**Technology** has changed **education**.', 'I like **music** and **dogs**.'],
        },
        {
          title: '**the — nhóm / cái cụ thể**',
          anh: 'round-pushpin',
          items: ['**The children in my class** need more help.', '**The pollution in Hanoi** is getting worse.', '**The technology** we used in 2010 is now outdated.', 'I like **the music** in this café.'],
        },
      ],
      caption: 'Thêm một cụm chỉ rõ (in my class, in Hanoi, we used…) là danh từ chuyển từ Ø sang the.',
    },
    {
      t: 'table',
      caption: 'Những nhóm từ thường đi với Ø',
      head: ['Nhóm', 'Ví dụ đúng', 'Sai hay gặp'],
      rows: [
        ['Danh từ **số nhiều / không đếm được** nói chung', '**Students** should do **exercise**. · **Money** cannot buy **happiness**.', '~~The students should…~~ (khi ý là mọi học sinh)'],
        ['**Bữa ăn**', 'have **breakfast / lunch / dinner**', '~~have the breakfast~~'],
        ['**Môn học, ngôn ngữ, môn thể thao**', 'study **maths** · speak **English** · play **football**', '~~the English~~ (= người Anh) · ~~play the football~~'],
        ['**Phương tiện** sau by', 'by **bus / car / train / bike** · on **foot**', '~~by the bus~~ · ~~by a car~~'],
        ['Nơi chốn dùng **đúng mục đích chính**', 'go to **school** (đi học) · go to **bed** · go to **work** · be at **home** · be in **hospital** (Anh: nằm viện)', '~~go to the bed~~ · ~~at the home~~'],
        ['**Ngày, tháng, năm, mùa** chung', 'on **Monday** · in **May** · in **2025** · in **summer**', '~~in the 2025~~ (nhưng: in **the** 1990s)'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: go to school ≠ go to the school',
      items: [
        '**go to school** = đi học (làm học sinh). **go to the school** = đến ngôi trường đó vì việc khác: My mum went to **the school** to meet my teacher.',
        'Tương tự: **in hospital** = nằm viện (Anh-Anh); **at the hospital** = ở toà nhà bệnh viện (thăm người ốm, làm việc ở đó). Người Mỹ nói **in the hospital** cho cả hai.',
        '**home** không có giới từ to: ~~go to home~~ → **go home**; nhưng **at home**.',
      ],
    },
    {
      t: 'rule',
      formula: 'Ø + N số nhiều / N không đếm được = nói chung · Ø + bữa ăn / môn học / ngôn ngữ / by + phương tiện / go to school, work, bed',
      vi: 'Chữ "những, các, sự, việc" của tiếng Việt KHÔNG dịch thành the. Có cụm chỉ rõ (of / in / who…) mới thêm the.',
    },
    {
      t: 'quiz',
      id: 't2d1-zero-dich',
      title: 'Dịch nhanh — không mạo từ (5 câu)',
      kind: 'translate',
      grammar: 'Nói chung: N số nhiều / không đếm được, KHÔNG the. by bus · go to work · have breakfast · play football.',
      items: [
        { q: 'Trẻ em cần nhiều thời gian chơi ngoài trời.', hint: 'Children (Ø), need, a lot of time, to play outside / outdoors', answers: ['Children need a lot of time to play outside.', 'Children need a lot of time to play outdoors.', 'Children need lots of time to play outside.', 'Children need plenty of time to play outside.', 'Children need a lot of time playing outside.', 'Children need much time to play outside.'] },
        { q: 'Ô nhiễm không khí là một vấn đề nghiêm trọng.', hint: 'Air pollution (Ø), is, a serious problem', answers: ['Air pollution is a serious problem.', 'Air pollution is a serious issue.', 'Air pollution is a big problem.'] },
        { q: 'Tôi thường đi làm bằng xe buýt.', hint: 'usually go to work (Ø), by bus (Ø)', answers: ['I usually go to work by bus.', 'I usually take the bus to work.', 'I often go to work by bus.', 'I usually travel to work by bus.'] },
        { q: 'Tiền không thể mua được hạnh phúc.', hint: 'Money (Ø), cannot / can’t buy, happiness (Ø)', answers: ['Money cannot buy happiness.', "Money can't buy happiness.", 'Money can not buy happiness.'] },
        { q: 'Công nghệ đã thay đổi giáo dục.', hint: 'Technology (Ø), has changed, education (Ø)', answers: ['Technology has changed education.', 'Technology has transformed education.', 'Technology changed education.'] },
      ],
    },

    { t: 'h', text: '5. Mạo từ với tên địa danh' },
    {
      t: 'p',
      text: 'Tên riêng (proper noun) phần lớn **không có mạo từ**: Vietnam, Hanoi, Asia, Oxford Street. Nhưng có **những nhóm tên luôn có the** — thường là tên **có chữ chung** (Republic, Kingdom, States, River, Sea…), tên **số nhiều**, và tên các **vùng nước**. Gặp nhiều nhất ở **Listening Part 1–2** (địa chỉ, bản đồ) và **Writing Task 1** (so sánh các nước).',
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Địa danh: Ø hay the?',
      center: 'Tên địa danh',
      branches: [
        { label: 'Ø — phần lớn', items: ['nước: Vietnam, Japan, France', 'thành phố, tỉnh: Hanoi, Da Nang, Texas', 'châu lục: Asia, Europe', 'hồ, núi đơn: Lake Geneva, Mount Fansipan', 'đường, công viên: Oxford Street, Hyde Park', 'sân bay, ga: Noi Bai Airport'], anh: 'world-map' },
        { label: 'the — tên có chữ chung', items: ['the United Kingdom / the UK', 'the United States / the USA', 'the Czech Republic', 'the University of Oxford (có "of")'], anh: 'classical-building' },
        { label: 'the — tên số nhiều', items: ['the Philippines', 'the Netherlands', 'the Maldives', 'the Alps · the Himalayas (dãy núi)'], anh: 'mountain' },
        { label: 'the — vùng nước, sa mạc', items: ['sông: the Mekong, the Red River, the Thames', 'biển, đại dương: the Pacific, the East Sea', 'sa mạc: the Sahara', 'vịnh có "of": the Gulf of Tonkin'], anh: 'water-wave' },
      ],
      caption: 'Mẹo nhớ: tên là MỘT chữ riêng (Vietnam, Asia) → Ø; tên có chữ chung / số nhiều / là sông – biển → the.',
    },
    {
      t: 'table',
      caption: 'Các cặp hay nhầm',
      head: ['Ø', 'the', 'Vì sao'],
      rows: [
        ['**Lake** Hoan Kiem · **Mount** Everest', '**the** Red River · **the** Alps', 'Hồ và núi đơn: Ø. Sông và dãy núi: the.'],
        ['Hanoi University (tên + University)', '**the** University **of** Hanoi', 'Có "of" → the.'],
        ['**northern** Vietnam (tính từ)', '**the north of** Vietnam', '"the north / south / east / west **of**" có the; dạng tính từ thì Ø.'],
        ['Britain · England', '**the** UK · **the** United Kingdom', 'Có Kingdom / United → the.'],
        ['Ben Thanh Market · Hyde Park', '**the** British Museum · **the** Hilton (hotel)', 'Bảo tàng, khách sạn, rạp hát thường có the; chợ, công viên mang tên riêng thường Ø.'],
      ],
    },
    {
      t: 'rule',
      formula: 'Ø: Vietnam · Hanoi · Asia · Lake X · Mount X · X Street · the: the UK / USA · the Philippines · the Mekong · the Pacific · the Alps · the X of Y',
      vi: 'Tên một chữ riêng → Ø; có Republic / Kingdom / States, số nhiều, sông, biển, dãy núi, "of" → the.',
    },
    {
      t: 'quiz',
      id: 't2d1-dia-danh-dich',
      title: 'Dịch nhanh — địa danh (4 câu)',
      kind: 'translate',
      grammar: 'Ø + tên nước / thành phố / châu lục / hồ / núi đơn; the + the UK / the USA / sông / biển / dãy núi / tên số nhiều / the north of…',
      items: [
        { q: 'Sông Mê Kông chảy qua sáu nước.', hint: 'The Mekong (River), flows through, six countries', answers: ['The Mekong flows through six countries.', 'The Mekong River flows through six countries.', 'The Mekong runs through six countries.', 'The Mekong River runs through six countries.'] },
        { q: 'Anh trai tôi đang sống ở Vương quốc Anh.', hint: 'is living / lives, in the UK', answers: ['My brother is living in the UK.', 'My brother lives in the UK.', 'My brother is living in the United Kingdom.', 'My brother lives in the United Kingdom.', 'My older brother lives in the UK.', "My brother's living in the UK."] },
        { q: 'Tôi đến từ miền Bắc Việt Nam.', hint: 'come from, the north of Vietnam / northern Vietnam', answers: ['I come from the north of Vietnam.', 'I come from northern Vietnam.', 'I am from the north of Vietnam.', "I'm from the north of Vietnam.", 'I am from northern Vietnam.', "I'm from northern Vietnam.", 'I come from the North of Vietnam.', 'I am from Northern Vietnam.'] },
        { q: 'Philippines có hơn bảy nghìn hòn đảo.', hint: 'The Philippines, has, more than 7,000 islands', answers: ['The Philippines has more than 7,000 islands.', 'The Philippines has more than seven thousand islands.', 'The Philippines has over 7,000 islands.', 'The Philippines has over seven thousand islands.', 'The Philippines have more than 7,000 islands.', 'There are more than 7,000 islands in the Philippines.'] },
      ],
    },

    { t: 'h', text: '6. Mạo từ trong bài thi IELTS' },
    {
      t: 'table',
      head: ['Phần thi', 'Chỗ hay cần mạo từ', 'Câu mẫu đúng'],
      rows: [
        ['**Writing Task 2**', 'Câu nói chung: Ø + số nhiều / không đếm được. Chủ đề xã hội: **the** environment, **the** government, **the** internet.', '**Young people** today spend too much time on **the internet**, which affects **their health**.'],
        ['**Writing Task 1**', '**the** number / proportion / percentage **of** · **the** highest · **the** UK · in **the** 1990s · between 2010 and 2020 (Ø trước năm).', '**The** proportion **of** households with **a** car rose sharply in **the** 1990s.'],
        ['**Speaking Part 1**', 'Nghề (a / an) · nơi ở (in Hanoi, Ø) · the capital · by motorbike (Ø).', "I'm **a** second-year student. I live in **a** small flat in Hanoi, **the** capital of Vietnam."],
        ['**Listening Part 1**', 'Đáp án là danh từ đếm được số ít thì trên phiếu thường đã in sẵn **a / an / the** trước chỗ trống — bạn **không** viết thêm.', 'Bring: **a** ______ → điền **notebook**, không viết ~~a notebook~~ (thừa từ).'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo: tự soát mạo từ trong bài viết (1 phút)',
      items: [
        'Gạch dưới **mọi danh từ đếm được số ít** trong bài: chữ nào **đứng trần** (không a / the / my / this…) là **lỗi chắc chắn**.',
        'Khoanh **mọi chữ the**: hỏi "người đọc biết **cái nào** chưa?". Nếu câu đang nói **chung chung** → xoá the.',
        'Nhìn câu so sánh nhất và cụm **of**: thiếu the thì thêm.',
      ],
    },
    {
      t: 'rule',
      formula: 'Task 2: Ø + N chung (Students, Technology) · Task 1: the + number / proportion of · the highest · in the 1990s',
      vi: 'Soát cuối bài: danh từ đếm được số ít đứng trần = lỗi; chữ the trong câu nói chung = thừa.',
    },
    {
      t: 'quiz',
      id: 't2d1-ielts-dich',
      title: 'Dịch nhanh — câu IELTS (4 câu)',
      kind: 'translate',
      grammar: 'Ø + N chung · the + proportion / number of · the + so sánh nhất · a / an + nghề.',
      items: [
        { q: 'Tỉ lệ hộ gia đình có ô tô đã tăng mạnh.', hint: 'The proportion of households with a car, rose / increased sharply', answers: ['The proportion of households with a car rose sharply.', 'The proportion of households with a car increased sharply.', 'The proportion of households with cars rose sharply.', 'The proportion of households that owned a car rose sharply.', 'The percentage of households with a car rose sharply.', 'The percentage of households with a car increased sharply.', 'The proportion of households with a car has risen sharply.', 'The proportion of households with a car has increased sharply.'] },
        { q: 'Học sinh nên tập thể dục mỗi ngày.', hint: 'Students (Ø), should, do exercise / exercise, every day', answers: ['Students should exercise every day.', 'Students should do exercise every day.', 'Students should do some exercise every day.', 'Pupils should exercise every day.', 'Students should take exercise every day.'] },
        { q: 'Tôi là sinh viên năm hai.', hint: 'a second-year student', answers: ["I'm a second-year student.", 'I am a second-year student.', 'I am a second year student.', "I'm a second year student.", "I'm a sophomore.", 'I am a sophomore.'] },
        { q: 'Năm 2020, Nhật Bản có tỉ lệ cao nhất.', hint: 'In 2020, Japan (Ø), had, the highest proportion / rate', answers: ['In 2020, Japan had the highest proportion.', 'In 2020 Japan had the highest proportion.', 'In 2020, Japan had the highest rate.', 'In 2020 Japan had the highest rate.', 'Japan had the highest proportion in 2020.', 'Japan had the highest rate in 2020.', 'In 2020, Japan had the highest percentage.', 'Japan had the highest percentage in 2020.'] },
      ],
    },

    { t: 'h', text: '7. Tổng hợp: 8 lỗi mạo từ người Việt hay mắc nhất' },
    {
      t: 'table',
      head: ['Câu sai', 'Câu đúng', 'Luật'],
      rows: [
        ['~~I am student.~~', 'I am **a** student.', 'Nghề / danh từ đếm được số ít không đứng trần.'],
        ['~~The technology is important in our life.~~', '**Technology** is important in our **lives**.', 'Nói chung → Ø.'],
        ['~~It is most popular sport in Vietnam.~~', 'It is **the** most popular sport in Vietnam.', 'So sánh nhất → the.'],
        ['~~I go to the school by the bus.~~', 'I go to **school** by **bus**.', 'Đúng mục đích chính · by + phương tiện → Ø.'],
        ['~~Number of tourists increased.~~', '**The** number of tourists increased.', 'the number / proportion of.'],
        ['~~She can speak the English very well.~~', 'She can speak **English** very well.', 'Ngôn ngữ → Ø.'],
        ['~~I visited the Vietnam and Thailand.~~', 'I visited **Vietnam** and **Thailand**.', 'Tên nước một chữ → Ø.'],
        ['~~He gave me an useful advice.~~', 'He gave me **some useful advice** / **a useful piece of advice**.', 'advice không đếm được; useful đọc /juː/ → a.'],
      ],
    },
    {
      t: 'mcq',
      id: 't2d1-tong-hop-chon',
      title: 'Kiểm tra cuối bài — chọn mạo từ đúng (10 câu)',
      items: [
        { q: 'My father is ___ doctor at a children’s hospital.', options: ['a', 'the', 'Ø (không mạo từ)'], correct: 0, why: '**Nghề nghiệp**, danh từ đếm được số ít → **a** doctor.' },
        { q: '___ pollution is one of the biggest problems in modern cities.', options: ['The', 'Ø (không mạo từ)', 'A'], correct: 1, why: 'Ô nhiễm **nói chung** (không đếm được) → Ø. Nếu có "**The** pollution **in Hanoi**" mới dùng the.' },
        { q: 'This is ___ most expensive restaurant in the city.', options: ['a', 'Ø (không mạo từ)', 'the'], correct: 2, why: '**So sánh nhất** → the most expensive.' },
        { q: 'I bought a phone and a case. ___ phone was cheap.', options: ['A', 'The', 'Ø (không mạo từ)'], correct: 1, why: '**Lần nhắc thứ hai** — người nghe đã biết cái điện thoại nào → The.' },
        { q: 'We travelled along ___ Mekong for three days.', options: ['Ø (không mạo từ)', 'a', 'the'], correct: 2, why: 'Tên **sông** luôn có **the**: the Mekong, the Thames.' },
        { q: 'She has lived in ___ Japan since 2019.', options: ['Ø (không mạo từ)', 'the', 'a'], correct: 0, why: 'Tên nước **một chữ** → Ø. (So với **the** UK, **the** Philippines.)' },
        { q: 'It takes about half ___ hour to get there.', options: ['a', 'an', 'the'], correct: 1, why: 'hour có **h câm**, mở đầu bằng nguyên âm /aʊ/ → **an** hour; cụm cố định **half an hour**.' },
        { q: 'Governments should do more to help ___ poor.', options: ['Ø (không mạo từ)', 'the', 'a'], correct: 1, why: '**the + tính từ** = cả nhóm người: **the poor** (người nghèo). Không viết ~~the poors~~.' },
        { q: 'I usually have ___ breakfast at seven.', options: ['the', 'a', 'Ø (không mạo từ)'], correct: 2, why: '**Bữa ăn** dùng Ø: have breakfast / lunch / dinner.' },
        { q: 'The museum is in ___ north of the city.', options: ['the', 'Ø (không mạo từ)', 'a'], correct: 0, why: '**the north / south / east / west of** + địa danh. Dạng tính từ thì Ø: in **northern** Hanoi.' },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Listening ─────────────────────────── */

const T2D1_SCRIPT_1: { who: string; voice: 'uk-nu' | 'uk-nam'; text: string }[] = [
  { who: 'Receptionist', voice: 'uk-nu', text: 'Good morning, Riverside Adult Learning Centre. How can I help you?' },
  { who: 'Daniel', voice: 'uk-nam', text: "Hi. I'd like to enrol on one of your evening courses, please. I saw the list on your website." },
  { who: 'Receptionist', voice: 'uk-nu', text: 'Of course. Which course are you interested in?' },
  { who: 'Daniel', voice: 'uk-nam', text: "Well, I was looking at the creative writing course at first, but I think I'd rather do something more practical. So it's the beginners' photography course." },
  { who: 'Receptionist', voice: 'uk-nu', text: "Lovely, that one's very popular. Can I take your name?" },
  { who: 'Daniel', voice: 'uk-nam', text: "Yes, it's Daniel Whitlock." },
  { who: 'Receptionist', voice: 'uk-nu', text: 'Could you spell your surname for me?' },
  { who: 'Daniel', voice: 'uk-nam', text: 'Sure. W, H, I, T, L, O, C, K.' },
  { who: 'Receptionist', voice: 'uk-nu', text: 'Thank you. And your address?' },
  { who: 'Daniel', voice: 'uk-nam', text: "It's forty-seven Barnfield Road, in Ashford." },
  { who: 'Receptionist', voice: 'uk-nu', text: "Is that B, A, R, N…?" },
  { who: 'Daniel', voice: 'uk-nam', text: "That's right. B, A, R, N, F, I, E, L, D. Barnfield." },
  { who: 'Receptionist', voice: 'uk-nu', text: 'And a contact number?' },
  { who: 'Daniel', voice: 'uk-nam', text: "My home number is oh one seven eight four, two two five, nine six oh. Actually, it's better to use my mobile, because I'm hardly ever at home. That's oh seven nine four three, double one six, two eight five." },
  { who: 'Receptionist', voice: 'uk-nu', text: "Got it. Now, the photography course runs on two evenings. The Tuesday group is completely full, I'm afraid, but there are still a few places on Thursday." },
  { who: 'Daniel', voice: 'uk-nam', text: 'Thursday is fine. I finish work early that day anyway.' },
  { who: 'Receptionist', voice: 'uk-nu', text: 'Great. There is an open evening, where you can meet the tutor, on the fourteenth of September, but the first class is a week later, on the twenty-first.' },
  { who: 'Daniel', voice: 'uk-nam', text: 'OK. And how much is the course?' },
  { who: 'Receptionist', voice: 'uk-nu', text: 'The standard fee is a hundred and twenty pounds for ten weeks. But do you live in Ashford?' },
  { who: 'Daniel', voice: 'uk-nam', text: 'Yes, I do.' },
  { who: 'Receptionist', voice: 'uk-nu', text: "Then you get the local residents' rate, which is ninety-five pounds." },
  { who: 'Daniel', voice: 'uk-nam', text: "That's good news. Do I need my own camera?" },
  { who: 'Receptionist', voice: 'uk-nu', text: "No, we lend cameras to all beginners, and we provide memory cards too. The only thing the tutor asks is that you bring a notebook, because there's quite a lot of theory in the first few weeks." },
  { who: 'Daniel', voice: 'uk-nam', text: 'No problem. Which room is it in?' },
  { who: 'Receptionist', voice: 'uk-nu', text: "Let me check. It says Room B twelve here… oh no, sorry, that's changed. The group has moved to the ground floor because of the lift repairs. It's Room G four now." },
  { who: 'Daniel', voice: 'uk-nam', text: 'G four. Got it.' },
  { who: 'Receptionist', voice: 'uk-nu', text: 'And finally, we always ask this: how did you hear about the course?' },
  { who: 'Daniel', voice: 'uk-nam', text: "Well, I've seen your leaflets in the library, but actually it was my neighbour who told me about it. She did the course last year and loved it." },
  { who: 'Receptionist', voice: 'uk-nu', text: "Wonderful. You're all booked in, Mr Whitlock. We'll send a confirmation letter to your address this week." },
];

const T2D1_SCRIPT_2: string[] = [
  "Hello, this is Karen Lopez, the tutor for the Thursday photography group. I'm calling all new students before our first class, so here are a few quick things.",
  "First, please don't go straight to the classroom. We'll meet in the café on the ground floor at a quarter to seven, so that everyone can get to know each other before we start.",
  "Second, parking. The car park behind the building is free for students, but only after six o'clock. If you arrive before that, you'll have to pay at the machine.",
  "Third, I'll be sending you a short reading list by email, so please check your inbox, and your junk folder too, just in case.",
  "In our first session we'll be looking at light, because good photographs always start with good light. Composition, which a lot of you asked about on the enrolment form, will be in week three. See you on Thursday!",
];

const T2D1_LISTENING: Lesson = {
  id: 't2d1-nghe',
  kind: 'listening',
  title: 'Listening Part 1 — Form completion 2: đăng ký khoá học (+ Note completion)',
  goal: 'Làm đủ 10 câu Part 1 dạng điền phiếu đăng ký với độ khó cao hơn Tập 1 (đánh vần, số điện thoại, ngày, giá, thông tin bị sửa lời) và một bài Note completion 5 câu — đúng chính tả, đúng giới hạn từ, nhắm ≥ 8/10.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Listening** từ 4.0 lên 5.0: đích cuối Tập 2 là **Part 1 + Part 2 ≥ 14/20**. Part 1 là phần **dễ lấy điểm nhất** — band 5 cần **8–9/10** ở đây.',
        'Ôn **vòng 2** của Part 1 (Tập 1 Ngày 7, 15): cùng dạng **Form completion**, nhưng nhiều **bẫy sửa lời** hơn, nói nhanh hơn, có số điện thoại hai số, phí có giảm giá.',
        'Mới hôm nay: dạng **Note completion** (ghi chú) — giống Form nhưng câu trong ghi chú **không đầy đủ**, phải đoán loại từ từ ngữ cảnh.',
        'Ba thói quen: **đọc trước – đoán loại từ**, **nghe hết câu sửa lời** (actually, sorry, no…), **đếm số từ** trước khi ghi.',
        'Nối Ngày 1 Ngữ pháp: trên phiếu đã in sẵn **a / the** trước chỗ trống thì **không** viết lại mạo từ.',
      ],
    },
    {
      t: 'p',
      text: '**Part 1** (câu 1–10) luôn là **hội thoại hai người** về một việc **đời thường**: đăng ký, đặt chỗ, hỏi thông tin. Một người hỏi, một người cung cấp thông tin để điền vào **phiếu (form)**, **ghi chú (notes)** hoặc **bảng (table)**. Ở Tập 1 bạn đã làm được 6–7/10. Từ band 4 lên band 5, khác biệt nằm ở **3–4 câu bẫy** mà người mới hay mất: chữ đánh vần, số đọc theo nhóm, thông tin bị **đổi giữa chừng**.',
    },

    { t: 'h', text: '1. Quy trình làm Part 1' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Năm bước cho mỗi phiếu Part 1',
      steps: [
        { label: '**Đọc lời dẫn**: giới hạn từ', sub: 'ONE WORD AND/OR A NUMBER · NO MORE THAN TWO WORDS… — gạch dưới, nhớ suốt bài.' },
        { label: '**Đọc tiêu đề phiếu** + các dòng có sẵn', sub: 'Biết đang đăng ký cái gì, ai gọi, thông tin nào đã cho.' },
        { label: '**Đoán loại thông tin** từng chỗ trống', sub: 'Tên? số? ngày? giá? danh từ số ít hay nhiều? Có a / an phía trước?' },
        { label: '**Nghe – ghi nháp**, chờ hết câu', sub: 'Nghe thấy actually / sorry / no, wait / that’s changed → thông tin MỚI mới là đáp án.' },
        { label: '**Soát**: chính tả, số từ, số nhiều', sub: 'Đáp án sai chính tả = sai. Phía trước có "a" thì danh từ số ít.' },
      ],
      caption: 'Câu hỏi luôn đi theo thứ tự lời nói. Lỡ một câu → bỏ ngay, nghe câu sau; đừng đứng lại tiếc.',
    },
    {
      t: 'table',
      caption: 'Đoán loại thông tin — nhìn chữ trước / sau chỗ trống',
      head: ['Dòng trên phiếu', 'Đoán', 'Lý do'],
      rows: [
        ['Surname: ______', 'tên riêng — sẽ được **đánh vần**', 'Họ / tên đường gần như luôn đánh vần.'],
        ['Phone: ______', 'dãy số 10–11 chữ số', 'Nghe "oh" = 0, "double" = hai số giống nhau.'],
        ['Start date: ______ September', 'số ngày (1–31)', 'Viết 21 hoặc 21st, không cần chữ.'],
        ['Fee: £ ______', 'số (giá)', 'Ký hiệu £ đã in sẵn → chỉ ghi số.'],
        ['Bring: a ______', 'danh từ **số ít**, bắt đầu bằng **phụ âm** khi đọc', 'Có "a" (không phải an) — Ngữ pháp mục 1.'],
        ['Room: ______', 'mã chữ + số (B12, G4)', 'Viết hoa chữ cái, không dấu cách cũng được.'],
      ],
    },

    { t: 'h', text: '2. Bốn kiểu bẫy của Part 1 vòng 2' },
    {
      t: 'table',
      head: ['Kiểu bẫy', 'Người nói nói gì', 'Đáp án đúng'],
      rows: [
        ['**Đổi ý / sửa lời**', '"My home number is… **Actually**, it’s better to use my mobile… That’s…"', 'số **mobile** (thông tin sau "actually")'],
        ['**Hai lựa chọn, một bị loại**', '"The Tuesday group is **full**, but there are places on Thursday."', '**Thursday**'],
        ['**Hai mốc gần nhau**', '"An open evening on the **14th**, but the **first class** is a week later, on the 21st."', 'đọc kỹ dòng phiếu hỏi cái gì: **first class** → 21'],
        ['**Giá gốc / giá giảm**', '"The standard fee is £120… you get the local residents’ rate, which is £95."', 'giá **người này trả**: 95'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo nghe số và chữ',
      items: [
        '**oh** = 0 · **double six** = 66 · **triple five** = 555. Số điện thoại Anh đọc theo **nhóm** (5–3–3 hoặc 4–3–3) — ghi theo nhóm cho khỏi lạc, rồi nối lại.',
        'Nghe đánh vần: **G** /dʒiː/ ≠ **J** /dʒeɪ/ · **A** /eɪ/ ≠ **E** /iː/ ≠ **I** /aɪ/ · **W** = "double-u". Đây là bảng chữ cái đã học ở Tập 1 Ngày 1 — ôn lại nếu còn lẫn.',
        '-**teen** (fourteen, nhấn **sau**) khác -**ty** (forty, nhấn **trước**). Ngày tháng nghe **số thứ tự**: the twenty-**first** → viết **21** hoặc **21st**.',
      ],
    },
    {
      t: 'mcq',
      id: 't2d1-nghe-bay',
      title: 'Khởi động — đọc lời thoại, chọn đáp án đúng (4 câu)',
      items: [
        { q: '"The lesson starts at seven… sorry, I mean half past seven, because the room is busy until then." — Start time:', options: ['7.00', '7.15', '7.30'], correct: 2, why: '**sorry, I mean** = sửa lời → thông tin sau mới đúng: half past seven = **7.30**.' },
        { q: '"The full price is forty pounds, but students pay thirty-two." — The speaker is a student. Fee: £', options: ['32', '40', '8'], correct: 0, why: 'Phiếu hỏi **người này trả bao nhiêu**: sinh viên → **32**. 40 là giá gốc; 8 là mức giảm, không ai nói.' },
        { q: '"My postcode is S, K, nine, three, P, J." — Postcode:', options: ['SK9 3PG', 'SK9 3PJ', 'SK9 3BJ'], correct: 1, why: '**P** /piː/, **J** /dʒeɪ/ → SK9 **3PJ**. G đọc /dʒiː/, B đọc /biː/ — nghe kỹ nguyên âm cuối.' },
        { q: '"We used to meet in the library, but now we meet in the community hall." — Meeting place:', options: ['library', 'community hall', 'both'], correct: 1, why: '**used to… but now** → lấy thông tin **hiện tại**: community hall.' },
      ],
    },
    {
      t: 'rule',
      formula: 'Giới hạn từ → loại thông tin → nghe hết câu (actually · sorry · but · used to… but now) → soát chính tả + số nhiều',
      vi: 'Trong Part 1, đáp án gần như luôn là thông tin CUỐI CÙNG được chốt, không phải thông tin đầu tiên nghe thấy.',
    },

    { t: 'h', text: '3. Bài luyện chính — Questions 1–10 (Form completion)' },
    {
      t: 'canh',
      anh: ['telephone-receiver', 'camera-with-flash', 'man-office-worker', 'school'],
      caption: '**Daniel Whitlock** gọi điện cho **Riverside Adult Learning Centre** (trung tâm học tập cho người lớn) để đăng ký một khoá học buổi tối. Nhân viên lễ tân điền phiếu đăng ký.',
    },
    {
      t: 'p',
      text: '**Trước khi bấm nghe**: đọc phiếu dưới đây, đoán loại thông tin của từng chỗ trống (tên? số? ngày?). Lời dẫn: **Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.** — mỗi chỗ trống **một từ và/hoặc một con số**.',
    },
    {
      t: 'table',
      caption: 'Riverside Adult Learning Centre — Course Enrolment Form',
      head: ['Mục', 'Thông tin'],
      rows: [
        ['Course', 'Beginners’ (1) ______'],
        ['Name', 'Daniel (2) ______'],
        ['Address', '47 (3) ______ Road, Ashford'],
        ['Contact number', '(4) ______'],
        ['Class day', '(5) ______ evening'],
        ['First class', '(6) ______ September'],
        ['Course fee', '£ (7) ______'],
        ['Students must bring', 'a (8) ______'],
        ['Room', '(9) ______'],
        ['Heard about the course from', 'his (10) ______'],
      ],
    },
    {
      t: 'listen',
      id: 't2d1-nghe-bai-1',
      title: 'Enrolling on an evening course',
      dan: { so: 'Day 1, Recording 1', boiCanh: 'a telephone conversation between a receptionist at an adult learning centre and a man who wants to join an evening course.', cau: [1, 10] },
      note: 'Hai giọng Anh-Anh (nữ: lễ tân · nam: Daniel), khoảng 3 phút 30. Có 5 chỗ bẫy: hai khoá học, hai số điện thoại, hai buổi tối, hai ngày tháng Chín, hai mức phí — và phòng học bị đổi.',
      lines: T2D1_SCRIPT_1,
    },
    {
      t: 'quiz',
      id: 't2d1-nghe-form',
      title: 'Questions 1–10 — ONE WORD AND/OR A NUMBER',
      kind: 'fill',
      items: [
        { q: '1. Course: Beginners’ ___', answers: ['photography'] },
        { q: '2. Name: Daniel ___', answers: ['Whitlock'] },
        { q: '3. Address: 47 ___ Road, Ashford', answers: ['Barnfield'] },
        { q: '4. Contact number: ___', answers: ['07943116285', '07943 116285', '07943 116 285', '0794 3116 285'] },
        { q: '5. Class day: ___ evening', answers: ['Thursday', 'Thurs'] },
        { q: '6. First class: ___ September', answers: ['21', '21st', 'twenty-first', 'twenty first'] },
        { q: '7. Course fee: £ ___', answers: ['95', 'ninety-five', 'ninety five', '95.00'] },
        { q: '8. Students must bring a ___', answers: ['notebook'] },
        { q: '9. Room: ___', answers: ['G4', 'G 4', 'G-4'] },
        { q: '10. Heard about the course from his ___', answers: ['neighbour', 'neighbor'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án 1–10',
      items: [
        '**1 photography** — "I was looking at the **creative writing** course at first, **but** I think I’d rather… So it’s the beginners’ **photography** course." Hai lựa chọn, lấy cái **sau but**. (creative writing là hai từ — vượt giới hạn, càng chắc là sai.)',
        '**2 Whitlock** — đánh vần W-H-I-T-L-O-C-K. Viết hoa chữ đầu hay không đều được chấm đúng, nhưng **sai một chữ là mất điểm**.',
        '**3 Barnfield** — lễ tân hỏi lại "B, A, R, N…?" rồi Daniel đánh vần đủ. Số 47 đã in sẵn trên phiếu.',
        '**4 07943116285** — bẫy: số nhà (01784…) đọc trước, rồi "**Actually**, it’s better to use my **mobile**". "double one" = **11**.',
        '**5 Thursday** — "The **Tuesday** group is completely **full**… but there are still a few places on **Thursday**."',
        '**6 21 / 21st** — 14 là **open evening** (buổi gặp mặt), còn **first class** là "a week later, on the **twenty-first**".',
        '**7 95** — £120 là **standard fee**; Daniel sống ở Ashford nên được "**local residents’ rate**, which is **ninety-five** pounds".',
        '**8 notebook** — máy ảnh và thẻ nhớ đều **được cho mượn / cung cấp** → không phải mang; "the only thing… you bring a **notebook**". Có sẵn "a" → không viết thêm a.',
        '**9 G4** — "It says Room **B12** here… oh no, sorry, **that’s changed**… It’s Room **G four** now."',
        '**10 neighbour** — "I’ve seen your **leaflets** in the library, **but actually** it was my **neighbour** who told me". leaflets là bẫy nghe thấy trước. Viết **neighbor** (Mỹ) cũng đúng.',
      ],
    },
    {
      t: 'vocab',
      items: [
        { w: 'enrol (on)', pos: 'v', ipa: '/ɪnˈrəʊl/', vi: 'đăng ký (khoá học)', ex: 'I enrolled on an evening course in photography.', exVi: 'Tôi đã đăng ký một khoá nhiếp ảnh buổi tối.', more: 'Anh-Anh **enrol on**, Mỹ **enroll in**. Danh từ **enrolment** (Mỹ enrollment). Gần nghĩa: **sign up for**, **register for**.' },
        { w: 'tutor', pos: 'n', ipa: '/ˈtjuːtə(r)/', vi: 'giáo viên (lớp nhỏ, gia sư, người hướng dẫn)', ex: 'The tutor gave us a reading list.', exVi: 'Giáo viên phát cho chúng tôi danh sách tài liệu đọc.', anh: 'teacher' },
        { w: 'fee', pos: 'n', ipa: '/fiː/', vi: 'phí, lệ phí', ex: 'The course fee includes all materials.', exVi: 'Học phí đã gồm mọi tài liệu.', more: '**tuition fees** (học phí) · **pay a fee** · **a fee of £95**. Đi với **high / low**, không đi với ~~expensive~~.' },
        { w: 'standard', pos: 'adj', ipa: '/ˈstændəd/', vi: 'tiêu chuẩn, thông thường (giá chưa giảm)', ex: 'The standard rate is £120, but students pay less.', exVi: 'Giá thông thường là 120 bảng, nhưng sinh viên trả ít hơn.' },
        { w: 'resident', pos: 'n', ipa: '/ˈrezɪdənt/', vi: 'cư dân, người sống ở một nơi', ex: 'Local residents get a discount at the sports centre.', exVi: 'Cư dân địa phương được giảm giá ở trung tâm thể thao.', more: 'Họ từ: **reside** (v) · **residence** (n, nơi ở) · **residential** (adj): a residential area.' },
        { w: 'discount', pos: 'n', ipa: '/ˈdɪskaʊnt/', vi: 'sự giảm giá', ex: 'There is a ten per cent discount for early booking.', exVi: 'Đặt sớm được giảm mười phần trăm.', more: '**a discount on** sth · **get / give a discount**. Gần nghĩa: **reduction**, **concession** (giá ưu đãi).' },
        { w: 'leaflet', pos: 'n', ipa: '/ˈliːflət/', vi: 'tờ rơi', ex: 'I picked up a leaflet about the course at the library.', exVi: 'Tôi lấy một tờ rơi về khoá học ở thư viện.', more: 'Gần nghĩa: **brochure** (cuốn nhỏ nhiều trang), **flyer** (tờ quảng cáo).', anh: 'page-facing-up' },
        { w: 'confirmation', pos: 'n', ipa: '/ˌkɒnfəˈmeɪʃn/', vi: 'sự xác nhận', ex: 'You will receive a confirmation email within 24 hours.', exVi: 'Bạn sẽ nhận email xác nhận trong vòng 24 giờ.', more: 'Động từ **confirm** (xác nhận): confirm a booking.' },
      ],
    },

    { t: 'h', text: '4. Bài luyện 2 — Note completion (5 câu)' },
    {
      t: 'p',
      text: '**Note completion** khác **Form** ở chỗ: ghi chú viết **tắt**, câu **không đầy đủ** (không có chủ ngữ, động từ), nên bạn phải đọc kỹ **từ ngay trước và sau** chỗ trống để đoán loại từ. Lời dẫn: **Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.**',
    },
    {
      t: 'canh',
      anh: ['woman-teacher', 'mobile-phone', 'automobile', 'light-bulb'],
      caption: 'Cô **Karen Lopez**, giáo viên lớp nhiếp ảnh tối thứ Năm, gọi điện để lại lời nhắn cho học viên mới trước buổi học đầu tiên.',
    },
    {
      t: 'table',
      caption: 'Photography course — notes before the first class',
      head: ['Mục', 'Ghi chú'],
      rows: [
        ['Meet in the', '(1) ______ on the ground floor'],
        ['Meeting time', '(2) ______'],
        ['Car park', 'free for students after (3) ______ o’clock'],
        ['Reading list', 'sent by (4) ______'],
        ['Topic of first session', '(5) ______'],
      ],
    },
    {
      t: 'listen',
      id: 't2d1-nghe-bai-2',
      title: 'A message from the tutor',
      dan: { so: 'Day 1, Recording 2', boiCanh: 'a telephone message left by a photography tutor for her new students.', cau: [1, 5] },
      note: 'Một giọng Mỹ (nữ), khoảng 1 phút. Bẫy ở câu 5: hai chủ đề được nhắc, chỉ một là của buổi đầu tiên.',
      lines: T2D1_SCRIPT_2.map((text) => ({ who: 'Karen', voice: 'us-nu' as const, text })),
    },
    {
      t: 'quiz',
      id: 't2d1-nghe-notes',
      title: 'Note completion — ONE WORD AND/OR A NUMBER (5 câu)',
      kind: 'fill',
      items: [
        { q: '(1) Meet in the ___ on the ground floor', answers: ['café', 'cafe'] },
        { q: '(2) Meeting time: ___', answers: ['6.45', '6:45', '6.45pm', '6:45pm', '6.45 pm', '6:45 pm', '18.45', '18:45'] },
        { q: '(3) Car park free for students after ___ o’clock', answers: ['6', 'six'] },
        { q: '(4) Reading list sent by ___', answers: ['email', 'e-mail'] },
        { q: '(5) Topic of first session: ___', answers: ['light'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích bài luyện 2',
      items: [
        '**(1) café** — "don’t go straight to the **classroom**. We’ll meet in the **café** on the ground floor". classroom là bẫy (bị phủ định bằng don’t).',
        '**(2) 6.45** — "at **a quarter to seven**" = 6.45. Không viết ~~7.15~~ (quarter **past** seven).',
        '**(3) six / 6** — "free for students, but **only after six o’clock**". Phía sau chỗ trống đã có "o’clock" → chỉ ghi số.',
        '**(4) email** — "a short reading list **by email**". Ghi **email** hoặc **e-mail** đều đúng.',
        '**(5) light** — "In our **first session** we’ll be looking at **light**". **Composition** là chủ đề **tuần ba** — bẫy "hai chủ đề".',
      ],
    },
    {
      t: 'note',
      title: 'Lỗi mất điểm oan ở Part 1 (soát trước khi nộp)',
      items: [
        '**Thừa từ**: phiếu ghi "Bring: a ___" mà viết ~~a notebook~~ → hai từ, vượt giới hạn ONE WORD.',
        '**Sai số nhiều**: nghe "reading **lists**" mà phiếu có "a ___" thì phải là số ít; ngược lại "some ___" thường là số nhiều.',
        '**Viết số bằng chữ sai chính tả**: an toàn nhất là viết **chữ số** (21, 95, 6.45).',
        '**Chép thông tin đầu tiên** nghe thấy — trong bài trên, 8/10 câu có thông tin gây nhiễu đứng **trước** đáp án.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Speaking ─────────────────────────── */

const T2D1_SPEAKING: Lesson = {
  id: 't2d1-noi',
  kind: 'speaking',
  title: 'Speaking Part 1 ôn câu hỏi Yes/No: Work/Study · Hometown · Home',
  goal: 'Trả lời mọi câu Yes/No của Part 1 về công việc / việc học, quê hương và nhà ở bằng 2–3 câu theo khung A–R–E (trả lời – lý do – ví dụ), không cụt, không học thuộc, phát âm rõ /p b t d k ɡ/ và âm cuối.',
  minutes: 55,
  blocks: [
    {
      t: 'recap',
      title: 'Bài này đẩy band nào, tiêu chí nào',
      items: [
        'Đẩy **Speaking** từ 4.0 lên 5.0 ở ba tiêu chí: **Fluency & Coherence** (nói được 2–3 câu nối nhau, không dừng lâu), **Lexical Resource** (có từ đúng chủ đề) và **Pronunciation** (âm cuối rõ).',
        'Ôn **vòng 2** của Tập 1 Ngày 4: câu Yes/No **không** trả lời một chữ. Khung **A – R – E**: ==Answer (có / không + mức độ) → Reason (vì sao) → Example / Extra (ví dụ, chi tiết)==.',
        'Ba chủ đề **chắc chắn** gặp ở đầu Part 1: **Work / Study** (hoặc), **Hometown**, **Home / Accommodation** — giám khảo hỏi 1 trong 3 ngay câu đầu.',
        '12 cách nói "có / không" tự nhiên hơn Yes / No; câu trả lời mẫu band 4 → band 5–5.5 để thấy khác ở đâu.',
        '🔊 Phát âm: **/p t k/ bật hơi** ở đầu từ, **/b d ɡ/ rung**, và **âm cuối** không được nuốt (cap ≠ cab, write ≠ ride).',
      ],
    },
    {
      t: 'p',
      text: '**Part 1** kéo dài **4–5 phút**, giám khảo hỏi khoảng **10–12 câu** về bản thân bạn, chia thành 2–3 chủ đề. Câu hỏi dễ, nên điểm không nằm ở **ý tưởng** mà ở **cách bạn kéo dài câu trả lời**. Người band 4 thường trả lời "Yes, I do." rồi im — giám khảo không có gì để chấm. Người band 5 nói **2–3 câu**, khoảng **15–25 giây** mỗi câu hỏi.',
    },

    { t: 'h', text: '1. Khung A – R – E cho câu hỏi Yes/No' },
    {
      t: 'sodo',
      kind: 'flow',
      title: 'Trả lời một câu Yes/No trong 15–25 giây',
      steps: [
        { label: '**A — Answer**', sub: 'Có / không + mức độ: Yes, definitely. · Not really. · It depends.' },
        { label: '**R — Reason**', sub: 'Vì sao: because… · The main reason is that…' },
        { label: '**E — Example / Extra**', sub: 'Ví dụ cụ thể hoặc chi tiết: For example,… · Actually,… · Last week,…' },
      ],
      caption: 'Dừng ở đây. Part 1 KHÔNG cần nói dài hơn 3 câu — giám khảo có nhiều câu cần hỏi và sẽ ngắt lời nếu bạn nói quá dài.',
    },
    {
      t: 'table',
      caption: '12 cách mở đầu thay cho Yes / No',
      head: ['Ý', 'Cách nói', 'Dùng khi'],
      rows: [
        ['Có, rất chắc', 'Yes, definitely. · Absolutely. · Of course.', 'Bạn thật sự thích / đồng ý.'],
        ['Có, vừa phải', 'Yes, I think so. · I’d say so. · Yes, quite a lot.', 'Có nhưng không mạnh.'],
        ['Không hẳn', 'Not really. · Not especially. · Not that much.', 'Từ chối nhẹ nhàng — **lịch sự hơn "No"**.'],
        ['Không, rất chắc', 'Not at all. · No, never.', 'Hoàn toàn không.'],
        ['Tuỳ', 'It depends. · Yes and no. · Sort of.', 'Câu trả lời có hai mặt — sau đó **phải** nói hai mặt đó.'],
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai',
      items: [
        'Trả lời cụt: "Do you like your hometown?" — ~~Yes.~~ / ~~Yes, I do.~~ → band 4. Thêm R + E.',
        'Lặp nguyên câu hỏi: ~~Yes, I like my hometown very much.~~ — không sai ngữ pháp, nhưng phí cơ hội dùng từ khác. Ngày 9 sẽ học **paraphrase câu hỏi**; hôm nay ít nhất đổi **like** → **love / be fond of / enjoy living there**.',
        'Nói "**It depends**" rồi không nói nó phụ thuộc vào cái gì — câu bỏ lửng làm giám khảo trừ FC.',
        'Học thuộc đoạn dài: giám khảo được huấn luyện để nhận ra (giọng đều, không ăn khớp câu hỏi) — họ sẽ đổi câu hỏi và điểm bị kéo xuống.',
      ],
    },
    {
      t: 'rule',
      formula: 'Answer (Yes, definitely / Not really / It depends) → Reason (because…) → Example (For example, … / Actually, …)',
      vi: 'Mỗi câu Part 1: 2–3 câu, 15–25 giây. Không một chữ, không một phút.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'major in', pos: 'v', ipa: '/ˈmeɪdʒər ɪn/', vi: 'học chuyên ngành', ex: 'I major in business administration.', exVi: 'Tôi học chuyên ngành quản trị kinh doanh.', more: 'Danh từ: **my major is…** · Anh-Anh hay nói: **I study / I’m doing a degree in…**' },
        { w: 'colleague', pos: 'n', ipa: '/ˈkɒliːɡ/', vi: 'đồng nghiệp', ex: 'My colleagues are friendly and helpful.', exVi: 'Đồng nghiệp của tôi thân thiện và hay giúp đỡ.', more: 'Đọc /ˈkɒliːɡ/ — **không** đọc "co-lê-giơ". Gần nghĩa: **co-worker**.', anh: 'busts-in-silhouette' },
        { w: 'demanding', pos: 'adj', ipa: '/dɪˈmɑːndɪŋ/', vi: 'đòi hỏi cao, vất vả', ex: 'My job is quite demanding, but I learn a lot.', exVi: 'Công việc của tôi khá vất vả nhưng tôi học được nhiều.', more: '**a demanding job / course / boss**. Trái nghĩa: **easy-going**, **relaxed**.' },
        { w: 'part-time', pos: 'adj, adv', ipa: '/ˌpɑːt ˈtaɪm/', vi: 'bán thời gian', ex: 'I work part-time in a coffee shop at weekends.', exVi: 'Tôi làm bán thời gian ở quán cà phê vào cuối tuần.', more: '**a part-time job** (adj, có gạch nối) · **work part-time** (adv). Trái nghĩa: **full-time**.' },
        { w: 'hometown', pos: 'n', ipa: '/ˈhəʊmtaʊn/', vi: 'quê nhà, nơi mình lớn lên', ex: 'My hometown is a small fishing town in Quang Ngai.', exVi: 'Quê tôi là một thị trấn chài lưới nhỏ ở Quảng Ngãi.' },
        { w: 'peaceful', pos: 'adj', ipa: '/ˈpiːsfl/', vi: 'yên bình', ex: 'Life in my hometown is slow and peaceful.', exVi: 'Cuộc sống ở quê tôi chậm rãi và yên bình.', more: 'Gần nghĩa: **quiet**, **calm**. Trái nghĩa: **hectic** (bận rộn), **noisy**.', anh: 'sunrise-over-mountains' },
        { w: 'crowded', pos: 'adj', ipa: '/ˈkraʊdɪd/', vi: 'đông đúc', ex: 'The city centre is always crowded at weekends.', exVi: 'Trung tâm thành phố lúc nào cũng đông đúc vào cuối tuần.', more: 'Đuôi -ed đọc **/ɪd/** vì gốc tận cùng /d/. **crowded with** + N: crowded with tourists.' },
        { w: 'landmark', pos: 'n', ipa: '/ˈlændmɑːk/', vi: 'địa danh nổi tiếng, công trình biểu tượng', ex: 'The old bridge is the most famous landmark in my town.', exVi: 'Cây cầu cổ là địa danh nổi tiếng nhất ở thị trấn tôi.', anh: 'bridge-at-night' },
        { w: 'flat / apartment', pos: 'n', ipa: '/flæt/ · /əˈpɑːtmənt/', vi: 'căn hộ (flat: Anh · apartment: Mỹ)', ex: 'We live in a two-bedroom flat on the fifth floor.', exVi: 'Chúng tôi sống trong căn hộ hai phòng ngủ ở tầng năm.', more: '**a two-bedroom flat** (không có -s ở bedroom vì đứng trước danh từ). Nhà riêng: **a house**; nhà ống: **a tube house / a narrow townhouse**.', anh: 'office-building' },
        { w: 'cosy', pos: 'adj', ipa: '/ˈkəʊzi/', vi: 'ấm cúng', ex: 'My bedroom is small but cosy.', exVi: 'Phòng ngủ của tôi nhỏ nhưng ấm cúng.', more: 'Mỹ viết **cozy**. Đi với: **a cosy room / café / atmosphere**.', anh: 'couch-and-lamp' },
        { w: 'spacious', pos: 'adj', ipa: '/ˈspeɪʃəs/', vi: 'rộng rãi', ex: 'Our new apartment is much more spacious than the old one.', exVi: 'Căn hộ mới của chúng tôi rộng rãi hơn căn cũ nhiều.', more: 'Trái nghĩa: **cramped** (chật chội).' },
        { w: 'move out (of)', pos: 'phr v', ipa: '/muːv aʊt/', vi: 'dọn ra khỏi (nhà)', ex: 'I’d like to move out of my parents’ house after I graduate.', exVi: 'Tôi muốn dọn ra khỏi nhà bố mẹ sau khi tốt nghiệp.', more: 'Ngược lại: **move in (to)**: We moved into this flat in 2022. · **move house** = chuyển nhà.' },
      ],
    },

    { t: 'h', text: '2. Chủ đề Work / Study' },
    {
      t: 'p',
      text: 'Câu đầu tiên của Part 1 gần như luôn là "**Do you work or are you a student?**" — đây là câu **chọn một trong hai**, không phải Yes/No: trả lời "Yes" là sai hoàn toàn. Sau đó giám khảo hỏi tiếp 2–3 câu Yes/No về việc bạn vừa chọn.',
    },
    {
      t: 'canh',
      anh: ['woman-student', 'books', 'man-office-worker', 'laptop'],
      caption: 'Giám khảo (Examiner) bắt đầu Part 1. Thí sinh (Candidate) là **Lan**, sinh viên năm hai ngành kinh doanh, đang làm thêm cuối tuần.',
    },
    {
      t: 'dialogue',
      title: 'Work / Study — band 4 (cụt) và band 5–5.5 (A – R – E)',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'Do you work or are you a student?' },
        { who: 'Band 4', role: 'b', text: 'Yes, I am student.', vi: '❌ "Yes" sai kiểu câu hỏi; thiếu "a" (student là danh từ đếm được số ít — Ngữ pháp mục 2).' },
        { who: 'Candidate', role: 'candidate', text: "I'm a student. I'm in my second year at a university in Hanoi, and I'm majoring in business. I also work part-time in a bookshop at weekends.", vi: 'Tôi là sinh viên. Tôi đang học năm hai ở một trường đại học tại Hà Nội, chuyên ngành kinh doanh. Tôi cũng làm bán thời gian ở hiệu sách vào cuối tuần.' },
        { who: 'Examiner', role: 'examiner', text: 'Do you enjoy your studies?' },
        { who: 'Band 4', role: 'b', text: 'Yes, I enjoy my studies.', vi: '❌ Chỉ có A, lặp nguyên câu hỏi.' },
        { who: 'Candidate', role: 'candidate', text: "Yes, definitely. The course is quite demanding, but it's very practical. For example, last term we ran a small online shop as a group project, and I learned a lot about marketing.", vi: 'Có, chắc chắn rồi. Khoá học khá vất vả nhưng rất thực tế. Ví dụ, học kỳ trước chúng tôi làm dự án nhóm mở một cửa hàng online nhỏ, và tôi học được nhiều về marketing.' },
        { who: 'Examiner', role: 'examiner', text: 'Is your subject popular in your country?' },
        { who: 'Candidate', role: 'candidate', text: "I'd say so. A lot of young people choose business because they think it's easy to find a job afterwards. In my class alone there are more than eighty students.", vi: 'Tôi cho là có. Nhiều người trẻ chọn kinh doanh vì họ nghĩ sau này dễ tìm việc. Riêng lớp tôi đã có hơn tám mươi sinh viên.' },
        { who: 'Examiner', role: 'examiner', text: 'Would you like to change your subject?' },
        { who: 'Candidate', role: 'candidate', text: "Not really. I sometimes find accounting a bit boring, but overall I'm happy with my choice. Actually, I'm thinking of doing a master's in marketing later.", vi: 'Không hẳn. Đôi khi tôi thấy môn kế toán hơi chán, nhưng nhìn chung tôi hài lòng với lựa chọn của mình. Thật ra tôi đang tính học thạc sĩ marketing sau này.' },
      ],
    },
    {
      t: 'table',
      caption: 'Nếu bạn đi làm — câu hỏi và gợi ý',
      head: ['Câu hỏi hay gặp', 'Gợi ý A – R – E'],
      rows: [
        ['Do you like your job?', 'Yes, quite a lot. → my colleagues are supportive / I learn new skills → For example, last month I…'],
        ['Is your job difficult?', 'It can be. → it’s demanding at the end of the month / deadlines → Last week I worked until 9 p.m. twice.'],
        ['Would you like to change your job in the future?', 'Not right now. → I’m still learning a lot → but in five years I’d like to…'],
        ['Do you work with many people?', 'Yes, I’m in a team of six. → we share tasks → For instance, I handle the customer emails.'],
      ],
    },

    { t: 'h', text: '3. Chủ đề Hometown' },
    {
      t: 'canh',
      anh: ['cityscape', 'bridge-at-night', 'sunrise-over-mountains'],
      caption: 'Giám khảo chuyển chủ đề: "Let’s talk about your hometown." Thí sinh **Minh** lớn lên ở **Hội An**, giờ học ở Đà Nẵng.',
    },
    {
      t: 'dialogue',
      title: 'Hometown — câu trả lời band 5–5.5',
      lines: [
        { who: 'Examiner', role: 'examiner', text: "Let's talk about your hometown. Is your hometown a big city?" },
        { who: 'Candidate', role: 'candidate', text: "No, not at all. I come from Hoi An, which is a small town in the centre of Vietnam. It's famous for its old streets and lanterns, so it's much quieter than big cities like Da Nang.", vi: 'Không hề. Tôi đến từ Hội An, một thị trấn nhỏ ở miền Trung Việt Nam. Nơi đó nổi tiếng với phố cổ và đèn lồng, nên yên tĩnh hơn nhiều so với thành phố lớn như Đà Nẵng.' },
        { who: 'Examiner', role: 'examiner', text: 'Do you like living there?' },
        { who: 'Candidate', role: 'candidate', text: "Yes, I love it. Life there is peaceful, and everything is close, so I can cycle everywhere. The only problem is that the old town gets very crowded with tourists in summer.", vi: 'Có, tôi rất thích. Cuộc sống ở đó yên bình, mọi thứ đều gần nên tôi đạp xe đi khắp nơi. Vấn đề duy nhất là phố cổ rất đông khách du lịch vào mùa hè.' },
        { who: 'Examiner', role: 'examiner', text: 'Is there anything you would like to change about your hometown?' },
        { who: 'Candidate', role: 'candidate', text: "Yes, I'd say the public transport. There are almost no buses, so most people depend on motorbikes. For example, my grandparents can't visit the hospital in Da Nang without help.", vi: 'Có, tôi nghĩ là giao thông công cộng. Hầu như không có xe buýt, nên phần lớn mọi người phải dựa vào xe máy. Ví dụ, ông bà tôi không thể tự đi bệnh viện ở Đà Nẵng nếu không có người giúp.' },
        { who: 'Examiner', role: 'examiner', text: 'Would you like to live there in the future?' },
        { who: 'Candidate', role: 'candidate', text: "It depends. If I can find a good job there, then yes, definitely. But most companies in my field are in big cities, so I'll probably stay in Da Nang for a few years first.", vi: 'Còn tuỳ. Nếu tìm được việc tốt ở đó thì chắc chắn có. Nhưng phần lớn công ty trong ngành của tôi ở thành phố lớn, nên có lẽ trước mắt tôi sẽ ở lại Đà Nẵng vài năm.' },
      ],
    },
    {
      t: 'note',
      title: 'Để ý ngữ pháp Ngày 1 trong câu trả lời',
      items: [
        '**Hoi An**, **Da Nang**, **Vietnam** — tên riêng **Ø**; **the centre of Vietnam** — có "of" → the.',
        '**a small town** (lần đầu, đếm được số ít) · **the old town** (người nghe biết là phố cổ của Hội An) · **public transport** (Ø, không đếm được, nói chung).',
        '**It depends** được nói rõ: phụ thuộc **vào việc tìm được việc** (If I can find a good job…). Đó là cách dùng "It depends" đúng.',
      ],
    },

    { t: 'h', text: '4. Chủ đề Home / Accommodation' },
    {
      t: 'canh',
      anh: ['office-building', 'couch-and-lamp', 'house-with-garden'],
      caption: 'Chủ đề nhà ở — "Let’s talk about where you live." Thí sinh **Hà** sống cùng bố mẹ trong một căn hộ ở Hà Nội.',
    },
    {
      t: 'dialogue',
      title: 'Home — câu trả lời band 5–5.5',
      lines: [
        { who: 'Examiner', role: 'examiner', text: 'Do you live in a house or an apartment?' },
        { who: 'Candidate', role: 'candidate', text: "I live in an apartment with my parents. It's on the eighth floor of a building in Cau Giay district, and it has two bedrooms and a small balcony.", vi: 'Tôi sống trong một căn hộ với bố mẹ. Căn hộ ở tầng tám của một toà nhà ở quận Cầu Giấy, có hai phòng ngủ và một ban công nhỏ.' },
        { who: 'Examiner', role: 'examiner', text: 'Do you like your home?' },
        { who: 'Candidate', role: 'candidate', text: "Yes, quite a lot. It's not very spacious, but it's cosy and bright. My favourite place is the balcony, because I can grow some plants and see the whole street from there.", vi: 'Có, khá thích. Không rộng lắm nhưng ấm cúng và sáng sủa. Chỗ tôi thích nhất là ban công, vì tôi có thể trồng ít cây và nhìn được cả con phố từ đó.' },
        { who: 'Examiner', role: 'examiner', text: 'Is there anything you would like to change about your home?' },
        { who: 'Candidate', role: 'candidate', text: "Not really, apart from the noise. Our building is next to a main road, so it can be quite noisy in the rush hour. I'd love to have thicker windows.", vi: 'Không hẳn, ngoài tiếng ồn. Toà nhà của chúng tôi ở cạnh một con đường lớn nên giờ cao điểm khá ồn. Tôi rất muốn có cửa sổ dày hơn.' },
        { who: 'Examiner', role: 'examiner', text: 'Do you plan to live there for a long time?' },
        { who: 'Candidate', role: 'candidate', text: "Probably not. I'd like to move out after I graduate, because I want to be more independent. My plan is to rent a small flat near my office with a friend.", vi: 'Chắc là không. Tôi muốn dọn ra ở riêng sau khi tốt nghiệp, vì tôi muốn tự lập hơn. Dự định của tôi là thuê một căn hộ nhỏ gần chỗ làm cùng một người bạn.' },
      ],
    },

    { t: 'h', text: '5. Phát âm: /p b t d k ɡ/ — bật hơi và âm cuối' },
    {
      t: 'p',
      text: 'Tiếng Anh có **6 âm tắc** (plosives) đi thành 3 cặp: **/p/–/b/**, **/t/–/d/**, **/k/–/ɡ/**. Trong mỗi cặp, âm thứ nhất **không rung** dây thanh, âm thứ hai **rung**. Người Việt gặp hai khó khăn: (1) **/p t k/ ở đầu từ** phải **bật hơi** (aspirated) — luồng hơi bật ra mạnh; (2) **âm cuối**: tiếng Việt "đóng" âm cuối p, t, c mà không bật ra, còn tiếng Anh phải để người nghe **nghe thấy** âm cuối, và **phân biệt được** /t/ với /d/, /p/ với /b/, /k/ với /ɡ/.',
    },
    {
      t: 'table',
      head: ['Cặp âm', 'Đầu từ', 'Cuối từ (cặp tối thiểu)', 'Mẹo'],
      rows: [
        ['/p/ – /b/', '**p**ark /pɑːk/ (bật hơi) · **b**ook /bʊk/', 'ca**p** /kæp/ ≠ ca**b** /kæb/ · ro**pe** ≠ ro**be**', 'Để tờ giấy trước miệng: nói "park" giấy phải **rung**; "book" giấy gần như đứng yên.'],
        ['/t/ – /d/', '**t**en /ten/ (bật hơi, gần "th" tiếng Việt) · **d**ay /deɪ/', 'wri**te** /raɪt/ ≠ ri**de** /raɪd/ · ha**t** ≠ ha**d**', 'Nguyên âm **trước** âm cuối hữu thanh (/d/) **dài hơn**: ride dài hơn write.'],
        ['/k/ – /ɡ/', '**k**ey /kiː/ (bật hơi) · **g**o /ɡəʊ/', 'ba**ck** /bæk/ ≠ ba**g** /bæɡ/ · pi**ck** ≠ pi**g**', '/k/ đầu từ không phải "kh" tiếng Việt — vẫn là "c" nhưng có một luồng hơi bật ra.'],
      ],
    },
    {
      t: 'note',
      title: 'Vì sao giám khảo để ý âm cuối',
      items: [
        'Âm cuối mang **ngữ pháp**: work**s** /wɜːks/, work**ed** /wɜːkt/, a bi**g** fla**t** — nuốt âm cuối là giám khảo nghe như sai thì, sai số nhiều → bị trừ cả **Pronunciation** lẫn **GRA**.',
        'Sau **s**, /p t k/ **không** bật hơi: s**p**ort, s**t**udy, s**k**y — đọc nhẹ như "sb, sđ, sg".',
        'Ở giữa câu, âm cuối nối sang nguyên âm sau: "par**t**‿of", "a bi**g**‿apartment" — Ngày 23 học kỹ nối âm.',
      ],
    },
    {
      t: 'phatam',
      id: 't2d1-phat-am',
      title: 'Luyện phát âm — /p b t d k ɡ/: bật hơi và âm cuối',
      note: 'Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Dòng 1–4: đọc chậm, phóng đại bật hơi ở /p t k/ đầu từ và giữ rõ âm cuối. Dòng 5–8: câu Part 1 — đừng nuốt âm cuối của work, part, flat, park, job, need.',
      items: [
        { text: 'pay, tea, key', ipa: 'peɪ tiː kiː', vi: '/p t k/ đầu từ — bật hơi mạnh' },
        { text: 'bay, day, game', ipa: 'beɪ deɪ ɡeɪm', vi: '/b d ɡ/ — rung cổ, không bật hơi' },
        { text: 'cap, cab, back, bag', ipa: 'kæp kæb bæk bæɡ', vi: 'âm cuối /p/ ≠ /b/, /k/ ≠ /ɡ/' },
        { text: 'write, ride, hat, had', ipa: 'raɪt raɪd hæt hæd', vi: 'âm cuối /t/ ≠ /d/ — ride, had kéo nguyên âm dài hơn' },
        { text: 'I work part-time at a bookshop.', ipa: 'aɪ wɜːk pɑːt taɪm ət ə bʊkʃɒp', vi: 'work /k/ · part-time /t t/ · bookshop /k p/' },
        { text: 'My hometown is a quiet place by the coast.', ipa: 'maɪ həʊmtaʊn ɪz ə kwaɪət pleɪs baɪ ðə kəʊst', vi: 'quiet /t/ · place /p/ bật hơi · coast /st/ cuối' },
        { text: 'We rent a big flat near the park.', ipa: 'wi rent ə bɪɡ flæt nɪə ðə pɑːk', vi: 'big /ɡ/ · flat /t/ · park bật hơi /p/ + /k/ cuối' },
        { text: "I'd like to keep my job, but I need a break.", ipa: 'aɪd laɪk tə kiːp maɪ dʒɒb bʌt aɪ niːd ə breɪk', vi: 'keep /p/ ≠ job /b/ · need /d/ · break /k/' },
      ],
    },

    { t: 'h', text: '6. Luyện nói với AI chấm' },
    {
      t: 'p',
      text: 'Ba nhóm câu hỏi, mỗi nhóm 3 câu, đúng như Part 1 thật. Mỗi câu **2–3 câu trả lời theo A – R – E**, 15–25 giây. Đừng nhìn lại câu mẫu ở trên khi ghi âm — nói về **chính bạn**.',
    },
    {
      t: 'speak',
      id: 't2d1-noi-work',
      part: '1',
      questions: [
        'Do you work or are you a student?',
        'Do you enjoy your work or your studies?',
        'Would you like to change your job or your subject in the future?',
      ],
    },
    {
      t: 'speak',
      id: 't2d1-noi-hometown',
      part: '1',
      questions: [
        'Is your hometown a good place for young people?',
        'Has your hometown got any famous landmarks?',
        'Would you like to live in your hometown in the future?',
      ],
    },
    {
      t: 'speak',
      id: 't2d1-noi-home',
      part: '1',
      questions: [
        'Do you live in a house or an apartment?',
        'Is there anything you would like to change about your home?',
        'Do you plan to live there for a long time?',
      ],
    },
    {
      t: 'note',
      title: 'Tự chấm sau khi ghi âm',
      items: [
        'Mỗi câu có đủ **A + R + E** chưa? Có câu nào chỉ một câu không?',
        'Có lặp **nguyên văn** câu hỏi không? Đổi ít nhất một từ.',
        'Nghe lại: âm cuối của **work, part, flat, big, job, like** có nghe được không?',
        'Mạo từ: **a student / an apartment / the capital / in Hanoi** — có chỗ nào để danh từ số ít đứng trần?',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D1_HOMEWORK: Lesson = {
  id: 't2d1-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 1',
  goal: 'Tự kiểm tra Ngày 1 bằng 34 câu có đáp án: 12 câu chọn mạo từ, 8 câu điền a / an, 6 câu dịch, 4 mục nghe chép thông tin Part 1 và 4 câu chọn câu trả lời Part 1 tốt nhất.',
  minutes: 40,
  blocks: [
    {
      t: 'recap',
      title: 'Bài tập hôm nay (34 câu)',
      items: [
        '**Phần I — Mạo từ** (12 câu trắc nghiệm): a / an / the / Ø, kể cả địa danh.',
        '**Phần II — a hay an** (8 câu điền): theo âm đầu.',
        '**Phần III — Dịch** (6 câu): câu Speaking Part 1 và câu Writing có mạo từ.',
        '**Phần IV — Nghe chép** (4 mục): tên, số điện thoại, giá, ngày — kiểu Part 1.',
        '**Phần V — Speaking** (4 câu): chọn câu trả lời A – R – E tốt nhất.',
        'Đạt ≥ 27/34 (80 %) là vững; dưới 24 thì làm lại mục sai trong bài Ngữ pháp.',
      ],
    },
    {
      t: 'sodo',
      kind: 'mindmap',
      title: 'Ngày 1 trong một hình',
      center: '**Ngày 1**',
      branches: [
        { label: 'Ngữ pháp: mạo từ', items: ['a / an theo âm', 'the: lần hai · duy nhất · of · nhất', 'Ø: nói chung · bữa ăn · by bus', 'địa danh: Vietnam ≠ the UK'] },
        { label: 'Nghe: Part 1', items: ['đọc giới hạn từ', 'đoán loại thông tin', 'actually / sorry → thông tin mới', 'soát chính tả, số từ'] },
        { label: 'Nói: Part 1 Yes/No', items: ['A – R – E', 'Not really · It depends', 'Work / Hometown / Home', '/p t k/ bật hơi · âm cuối'] },
      ],
    },

    { t: 'h', text: 'Phần I — Chọn mạo từ đúng (12 câu)' },
    {
      t: 'mcq',
      id: 't2d1-bt-mao-tu',
      title: 'Phần I — a / an / the / Ø (12 câu)',
      items: [
        { q: 'I’d like to be ___ engineer like my father.', options: ['a', 'an', 'the'], correct: 1, why: 'Nghề, số ít → a / an; **engineer** mở đầu bằng nguyên âm /e/ → **an**.' },
        { q: '___ life in big cities is often stressful.', options: ['Ø (không mạo từ)', 'The', 'A'], correct: 0, why: 'Cuộc sống ở thành phố lớn **nói chung** → Ø + life. (Có cụm cụ thể như "The life **of my grandparents**" mới dùng the.)' },
        { q: 'We stayed at a hotel by the sea. ___ hotel had a swimming pool.', options: ['A', 'Ø (không mạo từ)', 'The'], correct: 2, why: '**Lần nhắc thứ hai** → The hotel.' },
        { q: 'He usually goes to ___ bed after midnight.', options: ['the', 'Ø (không mạo từ)', 'a'], correct: 1, why: '**go to bed** (đi ngủ — đúng mục đích chính) → Ø.' },
        { q: 'Mount Fansipan is the highest mountain in ___ Indochina.', options: ['Ø (không mạo từ)', 'the', 'an'], correct: 0, why: 'Tên **vùng địa lý một chữ** → Ø. Nhưng "**the** highest mountain" (so sánh nhất) có the.' },
        { q: 'Have you ever swum in ___ Pacific Ocean?', options: ['a', 'Ø (không mạo từ)', 'the'], correct: 2, why: 'Tên **đại dương / biển** luôn có **the**.' },
        { q: '___ number of students studying abroad has doubled.', options: ['The', 'A', 'Ø (không mạo từ)'], correct: 0, why: '**The number of** + N số nhiều + động từ **số ít** (has). (So với **A number of** students **have**… = nhiều sinh viên.)' },
        { q: 'She speaks ___ Japanese fluently.', options: ['the', 'a', 'Ø (không mạo từ)'], correct: 2, why: '**Ngôn ngữ** → Ø. ~~the Japanese~~ = người Nhật (cả dân tộc).' },
        { q: 'My cousin lives in ___ Netherlands.', options: ['Ø (không mạo từ)', 'the', 'a'], correct: 1, why: 'Tên nước **số nhiều** → **the** Netherlands (như the Philippines).' },
        { q: 'It was ___ useful meeting.', options: ['a', 'an', 'the'], correct: 0, why: '**useful** đọc /ˈjuːsfl/ — âm đầu /j/ là **phụ âm** → **a** useful meeting.' },
        { q: 'Some people think ___ internet makes us lonelier.', options: ['an', 'Ø (không mạo từ)', 'the'], correct: 2, why: '**the internet** — vật **duy nhất**, luôn có the.' },
        { q: 'I go to the gym three times ___ week.', options: ['a', 'the', 'Ø (không mạo từ)'], correct: 0, why: '"mỗi" trong tần suất → **a** week (= per week).' },
      ],
    },

    { t: 'h', text: 'Phần II — Điền a hoặc an (8 câu)' },
    {
      t: 'quiz',
      id: 't2d1-bt-a-an',
      title: 'Phần II — a hay an (8 câu)',
      kind: 'fill',
      items: [
        { q: 'She is ___ European student studying in Hue.', answers: ['a'] },
        { q: 'The doctor asked for ___ X-ray of my arm.', answers: ['an'] },
        { q: 'We had ___ honest conversation about money.', answers: ['an'] },
        { q: 'He wears ___ uniform at work.', answers: ['a'] },
        { q: 'It was ___ eight-hour flight.', answers: ['an'] },
        { q: 'My brother bought ___ house near the river.', answers: ['a'] },
        { q: 'I need ___ umbrella; it is raining.', answers: ['an'] },
        { q: 'There was ___ one-day sale at the shopping centre.', answers: ['a'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Phần II',
      items: [
        '**a** European (/j/) · **an** X-ray (/e/ trong "ex") · **an** honest (h câm) · **a** uniform (/j/) · **an** eight-hour (/eɪ/) · **a** house (h đọc) · **an** umbrella (/ʌ/) · **a** one-day (/w/).',
      ],
    },

    { t: 'h', text: 'Phần III — Dịch Việt → Anh (6 câu)' },
    {
      t: 'quiz',
      id: 't2d1-bt-dich',
      title: 'Phần III — Dịch (6 câu)',
      kind: 'translate',
      grammar: 'a / an + nghề · Ø + N nói chung · the + duy nhất / so sánh nhất / of · tên nước Ø, the UK · by + phương tiện Ø.',
      items: [
        { q: 'Mẹ tôi là y tá ở một bệnh viện lớn.', hint: 'My mother is a nurse, at / in a big hospital', answers: ['My mother is a nurse at a big hospital.', 'My mother is a nurse in a big hospital.', 'My mum is a nurse at a big hospital.', 'My mom is a nurse at a big hospital.', 'My mother is a nurse at a large hospital.', 'My mother works as a nurse at a big hospital.', 'My mum is a nurse in a big hospital.'] },
        { q: 'Quê tôi là một thị trấn nhỏ ở miền Nam Việt Nam.', hint: 'My hometown is a small town, in the south of Vietnam / in southern Vietnam', answers: ['My hometown is a small town in the south of Vietnam.', 'My hometown is a small town in southern Vietnam.', 'My hometown is a small town in the South of Vietnam.', 'My home town is a small town in the south of Vietnam.', 'My hometown is a small town in Southern Vietnam.'] },
        { q: 'Học sinh nên đọc sách mỗi ngày.', hint: 'Students (Ø), should read books (Ø), every day', answers: ['Students should read books every day.', 'Students should read every day.', 'Pupils should read books every day.', 'Students should read books daily.'] },
        { q: 'Đây là tòa nhà cao nhất ở Hà Nội.', hint: 'This is the tallest / highest building in Hanoi', answers: ['This is the tallest building in Hanoi.', 'This is the highest building in Hanoi.', "This is Hanoi's tallest building.", 'This is the tallest building in Ha Noi.'] },
        { q: 'Tôi muốn học thạc sĩ ở Anh.', hint: "would like to do a master's (degree), in the UK", answers: ["I would like to do a master's in the UK.", "I'd like to do a master's in the UK.", "I would like to do a master's degree in the UK.", "I'd like to do a master's degree in the UK.", "I want to do a master's in the UK.", "I want to do a master's degree in the UK.", "I would like to study for a master's degree in the UK.", "I'd like to study for a master's degree in the UK.", "I would like to do a master's in the United Kingdom.", "I want to study for a master's degree in the UK."] },
        { q: 'Giá vé xe buýt đã tăng.', hint: 'The price of bus tickets / Bus fares, has / have risen / increased', answers: ['The price of bus tickets has risen.', 'The price of bus tickets has increased.', 'The price of bus tickets has gone up.', 'Bus fares have risen.', 'Bus fares have increased.', 'Bus fares have gone up.', 'The price of bus tickets increased.', 'The price of bus tickets rose.', 'The prices of bus tickets have increased.', 'The prices of bus tickets have risen.'] },
      ],
    },

    { t: 'h', text: 'Phần IV — Nghe chép thông tin kiểu Part 1 (4 mục)' },
    {
      t: 'dictation',
      id: 't2d1-bt-nghe-chep',
      title: 'Phần IV — Nghe và ghi đúng thông tin (4 mục)',
      items: [
        { label: 'Họ (surname)', spell: 'My surname is Fairbrother. F, A, I, R, B, R, O, T, H, E, R.', answer: 'Fairbrother' },
        { label: 'Số điện thoại — viết liền, không dấu cách', spell: 'You can call me on oh seven seven one two, double four nine, three oh eight.', answer: '07712449308', alt: ['07712 449308', '07712 449 308'] },
        { label: 'Phí — chỉ ghi số (đơn vị bảng Anh)', spell: 'The full price is sixty pounds, but members only pay forty-five.', answer: '45', alt: ['45.00', '£45'] },
        { label: 'Ngày bắt đầu — dạng 3 October', spell: 'We were going to start on the first of October, but now it is the third.', answer: '3 October', alt: ['3rd October', 'October 3', 'October 3rd', '3 Oct'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích Phần IV',
      items: [
        '**Fairbrother** — nghe đánh vần đủ 11 chữ; ba chữ R.',
        '**07712449308** — "double four" = **44**; "oh" = 0.',
        '**45** — 60 là giá gốc; câu hỏi về người là **member** → "members only pay **forty-five**".',
        '**3 October** — "were going to start on the first… **but now** it is the **third**" → lấy thông tin mới.',
      ],
    },

    { t: 'h', text: 'Phần V — Chọn câu trả lời Part 1 tốt nhất (4 câu)' },
    {
      t: 'mcq',
      id: 't2d1-bt-noi',
      title: 'Phần V — Speaking Part 1 (4 câu)',
      items: [
        {
          q: 'Examiner: “Do you work or are you a student?”',
          options: [
            'Yes, I am.',
            "I'm a student. I'm studying English at a college in Can Tho, and I'm in my final year.",
            "I am student and I am work too and I like it very much because it is good.",
          ],
          correct: 1,
          why: 'Câu hỏi **chọn một trong hai** → không trả lời "Yes". Phương án B trả lời thẳng + chi tiết, đúng mạo từ (**a** college). C thiếu "a", sai "I am work", ý lặp vô nghĩa.',
        },
        {
          q: 'Examiner: “Do you like your hometown?”',
          options: [
            'Yes.',
            'Yes, I like my hometown.',
            "Yes, I love it. It's small and peaceful, and the food is amazing. For example, there's a noodle stall near my house that has been open for forty years.",
          ],
          correct: 2,
          why: 'Đủ **A – R – E**: love it → small, peaceful, food → ví dụ quán bún. A và B chỉ có A (B còn lặp nguyên câu hỏi).',
        },
        {
          q: 'Examiner: “Is there anything you would like to change about your home?”',
          options: [
            "It depends. If I could, I'd make the kitchen bigger, because my whole family likes cooking together at weekends.",
            'It depends.',
            "It depends on many things in my life and in the society nowadays.",
          ],
          correct: 0,
          why: '"It depends" phải được **giải thích ngay**. A nói rõ muốn đổi gì và vì sao. B bỏ lửng. C mơ hồ và sai mạo từ (~~the society~~ nói chung → **society**).',
        },
        {
          q: 'Examiner: “Would you like to live in your hometown in the future?”',
          options: [
            'No.',
            "Not really. There aren't many jobs in my field there, so I'll probably stay in Ho Chi Minh City. But I'll definitely go back to visit my parents often.",
            'In the future, I would like to live in my hometown in the future.',
          ],
          correct: 1,
          why: '**Not really** (từ chối nhẹ) + lý do (ít việc) + chi tiết (về thăm bố mẹ). A cụt; C lặp câu hỏi và lặp "in the future".',
        },
      ],
    },
  ],
};

export const NGAY_1: Lesson[] = [T2D1_GRAMMAR, T2D1_LISTENING, T2D1_SPEAKING, T2D1_HOMEWORK];
