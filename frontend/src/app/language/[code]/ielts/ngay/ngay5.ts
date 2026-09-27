/**
 * Ngày 5 — Danh từ đếm được & không đếm được · Từ vựng Làm việc từ xa
 * (Remote Work) · Nghe chép chính tả 2 · Bài tập. Theo sách trang 75–89.
 *
 * Giữ đủ điểm kiến thức, thứ tự, dạng bài và số câu của sách (19 từ, 10 cụm
 * động từ, 5 họ từ, Practice 1 = 19 chỗ trống, Practice 2 = 13 câu 3 lựa chọn,
 * Homework 12 + 10 câu). Lời giảng, câu ví dụ, kịch bản nghe và câu bài tập
 * đều VIẾT MỚI (xem ../SOAN-BAI.md). Sách không in đáp án Day 5 → đáp án tự
 * soạn và đã kiểm theo kịch bản / ngữ pháp.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Ngữ pháp ─────────────────────────── */

const D5_GRAMMAR: Lesson = {
  id: 'd5-ngu-phap',
  kind: 'grammar',
  title: 'Danh từ đếm được & không đếm được (Countable & Uncountable Nouns)',
  goal: 'Phân biệt danh từ đếm được / không đếm được, chọn đúng a/an, many/much, few/little…, tránh các lỗi "informations, advices" và dùng đúng trong Writing Task 2.',
  minutes: 40,
  blocks: [
    { t: 'h', text: '1. Hai loại danh từ — bảng tổng quan' },
    {
      t: 'p',
      text: 'Tiếng Việt đếm được mọi thứ bằng cách thêm từ chỉ đơn vị: "một **cái** bàn", "hai **lời** khuyên", "ba **chai** nước". Tiếng Anh thì chia danh từ làm hai nhóm. **Danh từ đếm được** (countable noun) đếm thẳng được bằng số: *one book, two books*. **Danh từ không đếm được** (uncountable noun) không đếm thẳng được, không có dạng số nhiều: nói ~~two waters~~ hay ~~an advice~~ là sai. Chọn sai loại danh từ kéo theo sai cả mạo từ, từ chỉ số lượng và động từ — nên đây là **nền móng** của cả tiêu chí ngữ pháp.',
    },
    {
      t: 'table',
      caption: 'Ba nhóm danh từ và từ chỉ số lượng đi kèm',
      head: ['Loại danh từ', 'Đặc điểm', 'Ví dụ', 'Từ chỉ số lượng đi kèm'],
      rows: [
        ['**Đếm được** (Countable Nouns)', '• Đếm được bằng số (one, two, three…). • Có **số ít** và **số nhiều**.', 'Số ít: **a** laptop, **an** email, **one** colleague · Số nhiều: laptops, emails, colleagues', 'many, a few, few, several, a couple of, a number of, a lot of, one / two…, each, every'],
        ['**Không đếm được** (Uncountable Nouns)', '• Không đếm trực tiếp bằng số. • Chỉ có **một dạng** (không thêm -s), động từ chia **số ít**.', 'water, rice, money, information, advice, furniture', 'much, a little, little, some, a lot of, a great deal of, an amount of'],
        ['**Vừa đếm được vừa không**', 'Đổi loại theo **nghĩa** trong câu.', '**glass** (thuỷ tinh — chất liệu, không đếm được): *The table is made of glass.* · **a glass / two glasses** (cái cốc — đếm được): *Bring two glasses, please.*', 'Tuỳ nghĩa: nghĩa đếm được → many, a few…; nghĩa không đếm được → much, a little…'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ',
      items: [
        'Một danh từ đếm được **số ít** không bao giờ đứng trơ trọi: phải có **a / an / the / my / this / one…** phía trước. ~~I have laptop.~~ → **I have a laptop.**',
        'Danh từ không đếm được **không đi với a/an** và **không thêm -s**: ~~an information~~, ~~informations~~ → **information**, **some information**.',
        '**some, a lot of, lots of, the, no, any** dùng được cho **cả hai** loại: *some emails / some money*.',
      ],
    },

    { t: 'h', text: '2. Ba câu hỏi để nhận ra loại danh từ' },
    {
      t: 'p',
      text: 'Phần này sách chưa có. Khi gặp một danh từ mới, tự hỏi ba câu sau (hoặc tra từ điển: danh từ không đếm được được đánh dấu **[U]**, đếm được là **[C]**).',
    },
    {
      t: 'table',
      head: ['Câu hỏi', 'Nếu "có"', 'Ví dụ'],
      rows: [
        ['1. Có đếm "một, hai, ba" **thẳng** được không, không cần "cái / chai / mẩu"?', '→ đếm được', 'one meeting, two meetings ✅ · ~~two rices~~ ❌ (phải nói two bowls of rice)'],
        ['2. Nó là **chất / khối** (nước, gạo, cát, không khí) hay **ý niệm trừu tượng** (lời khuyên, kiến thức, hạnh phúc)?', '→ thường không đếm được', 'water, air, knowledge, happiness, freedom'],
        ['3. Nó là **tên gọi chung** cho cả một nhóm đồ vật khác nhau?', '→ thường không đếm được', '**furniture** (gồm bàn, ghế, tủ…), **equipment** (máy tính, máy in…), **luggage** (vali, túi…)'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'a / an + danh từ đếm được số ít + V (số ít)',
          vi: 'Một người / một vật',
          examples: [
            { en: 'An employee is waiting in the lobby.', vi: 'Một nhân viên đang đợi ở sảnh.' },
            { en: 'I have a meeting at nine.', vi: 'Tôi có một cuộc họp lúc chín giờ.' },
          ],
        },
        {
          formula: 'danh từ đếm được số nhiều (-s / -es) + V (số nhiều)',
          vi: 'Nhiều người / nhiều vật, hoặc nói chung chung về cả loại',
          examples: [
            { en: 'Freelancers choose their own hours.', vi: 'Người làm tự do tự chọn giờ làm.' },
            { en: 'The new laptops are much lighter.', vi: 'Những chiếc laptop mới nhẹ hơn nhiều.' },
          ],
        },
        {
          formula: 'danh từ không đếm được (không a/an, không -s) + V (số ít)',
          vi: 'Chất, khối, ý niệm — luôn chia động từ số ít',
          examples: [
            { en: 'Information travels fast online.', vi: 'Thông tin lan truyền nhanh trên mạng.' },
            { en: 'Good advice is hard to find.', vi: 'Lời khuyên hay thì khó tìm.' },
          ],
        },
      ],
    },

    { t: 'h', text: '3. Danh từ không đếm được hay gặp trong IELTS' },
    {
      t: 'p',
      text: 'Phần này sách chưa liệt kê. Đây là những từ **xuất hiện liên tục** trong Writing và Speaking — và cũng là những từ người Việt hay thêm -s sai nhất. Học thuộc bảng này là tránh được phần lớn lỗi.',
    },
    {
      t: 'table',
      caption: 'Danh từ không đếm được theo nhóm',
      head: ['Nhóm', 'Các từ', 'Ví dụ'],
      rows: [
        ['**Thông tin, kiến thức**', 'information, advice, knowledge, research, evidence, news, feedback, data (thường coi là không đếm được)', 'The survey gives us useful **information**. — Cuộc khảo sát cho ta thông tin hữu ích.'],
        ['**Công việc, học tập**', 'work, homework, housework, employment, progress, training, experience (kinh nghiệm), education', 'She has made great **progress** this year. — Năm nay cô ấy tiến bộ nhiều.'],
        ['**Tên chung cho một nhóm đồ vật**', 'furniture, equipment, luggage / baggage, software, hardware, machinery, stationery, jewellery, clothing', 'The office bought new **equipment**. — Văn phòng mua thiết bị mới.'],
        ['**Tiền, giao thông, nơi ở**', 'money, cash, traffic, transport, accommodation, infrastructure', 'Students need cheap **accommodation**. — Sinh viên cần chỗ ở giá rẻ.'],
        ['**Môi trường, tự nhiên**', 'pollution, weather, air, water, energy, electricity, rubbish / litter, wildlife, land', 'Air **pollution** is getting worse. — Ô nhiễm không khí ngày càng tệ.'],
        ['**Ý niệm trừu tượng**', 'happiness, health, freedom, safety, stress, pressure, help, fun, time (thời gian nói chung), behaviour, access', 'Remote work gives employees more **freedom**. — Làm từ xa cho nhân viên nhiều tự do hơn.'],
        ['**Thực phẩm, chất liệu**', 'food, rice, bread, meat, sugar, salt, milk, coffee, glass, paper, wood, plastic', 'We should use less **plastic**. — Chúng ta nên dùng ít nhựa hơn.'],
        ['**Môn học, lĩnh vực (-ics)**', 'economics, mathematics, physics, politics, statistics (môn thống kê)', '**Economics** is a popular subject. — Kinh tế học là môn được nhiều người chọn.'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận với mấy từ "trông như số nhiều"',
      items: [
        '**news** có -s nhưng là **không đếm được, số ít**: ~~The news are bad.~~ → **The news is bad.** Một tin = **a piece of news**.',
        'Môn học tận cùng **-ics** (economics, physics, mathematics) chia động từ **số ít**: *Physics **is** difficult.*',
        '**data**: trong IELTS nên dùng như danh từ không đếm được (*the data **shows***); cách dùng số nhiều (*the data show*) cũng không bị coi là sai — chỉ cần **thống nhất cả bài**.',
      ],
    },

    { t: 'h', text: '4. Muốn "đếm" danh từ không đếm được thì làm sao?' },
    {
      t: 'p',
      text: 'Phần này sách chưa có. Giống tiếng Việt dùng "một **lời** khuyên", tiếng Anh dùng **từ chỉ đơn vị + of**. Chính từ đơn vị mới được đếm (thêm -s), còn danh từ phía sau giữ nguyên.',
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'a / two… + đơn vị + of + danh từ không đếm được',
          vi: 'Đếm qua một "vật chứa" hoặc "mẩu"',
          examples: [
            { en: 'She gave me two pieces of advice.', vi: 'Cô ấy cho tôi hai lời khuyên.' },
            { en: 'I drink three glasses of water before lunch.', vi: 'Tôi uống ba cốc nước trước bữa trưa.' },
          ],
        },
      ],
    },
    {
      t: 'table',
      head: ['Đơn vị', 'Đi với', 'Ví dụ'],
      rows: [
        ['a piece of / an item of', 'advice, information, news, furniture, equipment, evidence, software', 'an important **piece of** information — một thông tin quan trọng'],
        ['a bottle / glass / cup of', 'water, milk, coffee, tea, juice', 'a **cup of** coffee — một tách cà phê'],
        ['a bowl / kilo / bag of', 'rice, sugar, flour, meat', 'a **bag of** rice — một bao gạo'],
        ['a slice / loaf of', 'bread, cake, cheese', 'two **slices of** bread — hai lát bánh mì'],
        ['a sheet / piece of', 'paper', 'a **sheet of** paper — một tờ giấy'],
        ['a sum / an amount of', 'money, time, energy', 'a large **sum of** money — một khoản tiền lớn'],
      ],
    },

    { t: 'h', text: '5. Từ chỉ số lượng (Quantifiers)' },
    {
      t: 'p',
      text: '**Từ chỉ số lượng** (quantifier) là từ đứng trước danh từ để nói "nhiều hay ít". Mỗi từ chỉ hợp với một loại danh từ — chọn sai là giám khảo nhận ra ngay.',
    },
    {
      t: 'table',
      caption: 'Chọn từ chỉ số lượng theo loại danh từ',
      head: ['Nghĩa', 'Với danh từ ĐẾM ĐƯỢC (số nhiều)', 'Với danh từ KHÔNG ĐẾM ĐƯỢC', 'Ví dụ'],
      rows: [
        ['nhiều', '**many**, a large number of', '**much**, a great deal of, a large amount of', '**many** tasks · **much** work'],
        ['nhiều (cả hai loại, thân mật hơn)', 'a lot of / lots of / plenty of', 'a lot of / lots of / plenty of', '**a lot of** calls · **a lot of** stress'],
        ['một vài / một ít (đủ dùng — nghĩa tích cực)', '**a few**, several, a couple of (= hai)', '**a little**', '**a few** colleagues · **a little** time'],
        ['rất ít (gần như không — nghĩa tiêu cực)', '**few**', '**little**', '**few** people came · **little** hope'],
        ['một ít, vài (câu khẳng định, lời mời)', '**some**', '**some**', '**some** files · **some** coffee?'],
        ['chút nào (câu phủ định, câu hỏi)', '**any**', '**any**', "I don't have **any** meetings. · Is there **any** news?"],
        ['ít hơn', '**fewer**', '**less**', '**fewer** cars · **less** traffic'],
        ['mỗi, mọi', '**each / every** + danh từ **số ít**', '—', '**every** employee (không phải ~~every employees~~)'],
        ['số lượng / lượng', '**the number of** + số nhiều', '**the amount of**', '**the number of** freelancers · **the amount of** money'],
      ],
    },
    {
      t: 'examples',
      items: [
        { en: 'How many emails do you get a day?', vi: 'Mỗi ngày bạn nhận bao nhiêu email? (email đếm được → how many)' },
        { en: 'How much time do you spend on video calls?', vi: 'Bạn mất bao nhiêu thời gian cho các cuộc gọi video? (time không đếm được → how much)' },
        { en: 'I have a few questions about the contract.', vi: 'Tôi có vài câu hỏi về hợp đồng. (đủ để hỏi)' },
        { en: 'Few people enjoy long meetings.', vi: 'Hầu như chẳng ai thích họp dài. (gần như không có ai)' },
        { en: 'There is a little coffee left if you want some.', vi: 'Còn một ít cà phê nếu bạn muốn. (vẫn còn)' },
        { en: 'We had little time to prepare, so the report was weak.', vi: 'Chúng tôi gần như không có thời gian chuẩn bị nên bản báo cáo yếu.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay nhầm',
      items: [
        '**a few / a little** (có, tuy ít — tích cực) ≠ **few / little** (gần như không — tiêu cực). Chỉ một chữ **a** mà nghĩa ngược nhau: *I have **a few** friends here* (tôi có vài người bạn — ổn) · *I have **few** friends here* (tôi gần như không có bạn — buồn).',
        '**much** trong câu khẳng định nghe rất cứng: ~~I have much work.~~ → **I have a lot of work.** Dùng much chủ yếu trong câu phủ định và câu hỏi: *I don\'t have **much** work. How **much** work…?*',
        '**less** đi với không đếm được, **fewer** đi với đếm được: ~~less people~~ → **fewer people**; **less** traffic, **less** pollution. Giám khảo IELTS để ý lỗi này.',
        '**the number of** + danh từ số nhiều + động từ **số ít**: *The number of remote workers **has** doubled.* Còn **a number of** (= nhiều) + động từ **số nhiều**: *A number of workers **have** complained.*',
      ],
    },

    { t: 'h', text: '6. Danh từ vừa đếm được vừa không đếm được' },
    {
      t: 'p',
      text: 'Sách nêu ví dụ **glass / glasses**. Thực tế có khá nhiều từ như vậy, và nghĩa đổi theo loại. Quy tắc chung: **nói chung chung, trừu tượng, chất liệu → không đếm được**; **nói một cái, một lần, một loại cụ thể → đếm được**.',
    },
    {
      t: 'table',
      head: ['Từ', 'Không đếm được (nghĩa chung)', 'Đếm được (nghĩa cụ thể)'],
      rows: [
        ['glass', 'thuỷ tinh: *The door is made of **glass**.*', 'cái cốc: *two **glasses** of juice* · kính đeo mắt: *my **glasses***'],
        ['experience', 'kinh nghiệm: *She has five years of **experience**.*', 'trải nghiệm, chuyến trải qua: *Working abroad was **an** amazing **experience**.*'],
        ['time', 'thời gian: *I don\'t have much **time**.*', 'lần: *I called him three **times**.*'],
        ['paper', 'giấy: *Save **paper** — print less.*', 'tờ báo / bài nghiên cứu: *a daily **paper** · She published two **papers**.*'],
        ['work', 'công việc (chung): *I have a lot of **work** today.*', 'tác phẩm: *the **works** of Nguyen Du* (các tác phẩm của Nguyễn Du)'],
        ['room', 'chỗ trống: *There is no **room** for a desk.*', 'căn phòng: *The flat has three **rooms**.*'],
        ['business', 'việc kinh doanh nói chung: ***Business** is good this year.*', 'một công ty: *She runs **two small businesses**.*'],
        ['coffee / tea', 'cà phê (đồ uống nói chung): *I love **coffee**.*', 'một cốc (khi gọi món): *Two **coffees**, please.*'],
        ['light', 'ánh sáng: *This room gets a lot of **light**.*', 'cái đèn: *Turn off **the lights**.*'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: job ≠ work',
      items: [
        '**job** (một công việc, một vị trí) là **đếm được**: *She has **a** new **job**. He has two **jobs**.*',
        '**work** (việc làm nói chung) là **không đếm được**: ~~a work~~, ~~works~~ (khi nghĩa là công việc) → *I have a lot of **work**. She is looking for **work**.*',
        'Cặp tương tự: **a suggestion** (đếm được) ≈ **advice** (không đếm được); **a suitcase** ≈ **luggage**; **a chair** ≈ **furniture**; **a fact** ≈ **information**. Không nhớ được từ không đếm được thì đổi sang từ đếm được cùng nghĩa.',
      ],
    },

    { t: 'h', text: '7. Danh từ chỉ có dạng số nhiều và danh từ số ít = số nhiều' },
    {
      t: 'p',
      text: 'Phần này sách chưa có nhưng rất hay gây lỗi chia động từ.',
    },
    {
      t: 'table',
      head: ['Nhóm', 'Các từ', 'Cách dùng'],
      rows: [
        ['**Luôn số nhiều** (đồ vật có hai phần)', 'trousers, jeans, shorts, glasses (kính), scissors, headphones', 'Động từ số nhiều: *My headphones **are** broken.* Đếm bằng **a pair of**: *a pair of scissors*.'],
        ['**Luôn số nhiều** (không có -s nhưng mang nghĩa số nhiều)', 'people, police, cattle', '*The police **are** looking into it.* · *People **are** busier than ever.* (~~peoples~~ chỉ dùng khi nói "các dân tộc")'],
        ['**Tận cùng -s nhưng thường số nhiều**', 'clothes, goods, belongings, surroundings, earnings', '*Her clothes **are** very stylish.*'],
        ['**Số ít = số nhiều** (không đổi dạng)', 'sheep, fish, deer, species, series, means, aircraft, crossroads', '*one **species**, many **species*** · *This means of transport **is** cheap. / These means **are** cheap.*'],
        ['**Số nhiều bất quy tắc** (nhắc lại)', 'person → people, child → children, man → men, woman → women, tooth → teeth, foot → feet', '~~childrens~~, ~~peoples~~ (nghĩa "người") là sai.'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ',
      items: [
        '**staff** (toàn bộ nhân viên) là danh từ tập hợp: *The staff **are** / **is** friendly.* Một nhân viên = **a staff member** / **an employee**, không phải ~~a staff~~; nhiều nhân viên ≠ ~~staffs~~.',
        '**family, team, government, company** có thể chia số ít (coi là một khối) hoặc số nhiều (nghĩ đến từng thành viên, kiểu Anh-Anh). Chọn một cách và giữ nguyên cả bài.',
      ],
    },

    { t: 'h', text: '8. Ứng dụng trong IELTS Writing Task 2' },
    {
      t: 'p',
      text: 'Task 2 thường xoay quanh giáo dục, xã hội, môi trường, công việc — toàn chủ đề đầy danh từ không đếm được (education, pollution, employment, technology, information…). Sách chia phần ứng dụng thành 4 ý a–b–c–d; các câu ví dụ dưới đây được viết mới cho chủ đề làm việc từ xa.',
    },
    {
      t: 'p',
      text: '**a) Dùng đúng loại danh từ.** Danh từ không đếm được không có số nhiều; danh từ đếm được số nhiều đi với many, không đi với much.',
    },
    {
      t: 'table',
      head: ['Sai', 'Đúng', 'Vì sao'],
      rows: [
        ['~~Technologies has changed how we work.~~', '**Technology has** changed how we work.', '"technology" (công nghệ nói chung) không đếm được → không -s, động từ số ít.'],
        ['~~Remote work causes much problems.~~', 'Remote work causes **many problems**.', '"problems" đếm được, số nhiều → many.'],
        ['~~Employees need more trainings.~~', 'Employees need more **training**.', '"training" không đếm được.'],
      ],
    },
    {
      t: 'p',
      text: '**b) Dùng từ chỉ số lượng phù hợp.** Mỗi từ chỉ số lượng "ăn" với một loại danh từ.',
    },
    {
      t: 'table',
      head: ['Sai', 'Đúng', 'Vì sao'],
      rows: [
        ['~~Companies should spend more moneys on staff wellbeing.~~', 'Companies should spend **more money** on staff wellbeing.', '"money" không đếm được → **more / a lot of money**, không thêm -s.'],
        ['~~A few pollution comes from commuting.~~', '**A little** / **Some** pollution comes from commuting.', '"pollution" không đếm được → không dùng a few.'],
        ['~~Only a little workers want to return to the office full-time.~~', 'Only **a few workers** want to return to the office full-time.', '"workers" đếm được → a few.'],
      ],
    },
    {
      t: 'p',
      text: '**c) Chọn nghĩa phù hợp với danh từ "hai mặt".** Cùng một chữ, nghĩa chung chung thì không đếm được, nghĩa cụ thể thì đếm được.',
    },
    {
      t: 'examples',
      items: [
        { en: 'Employers value experience more than qualifications.', vi: 'Nhà tuyển dụng coi trọng kinh nghiệm hơn bằng cấp. (experience = kinh nghiệm nói chung → không đếm được)' },
        { en: 'Working for a start-up was one of the best experiences of my life.', vi: 'Làm cho một công ty khởi nghiệp là một trong những trải nghiệm tuyệt nhất đời tôi. (experiences = những trải nghiệm cụ thể → đếm được)' },
        { en: 'Remote workers save a lot of time because they do not commute.', vi: 'Người làm từ xa tiết kiệm nhiều thời gian vì không phải đi lại. (time = thời gian)' },
        { en: 'I have checked my messages five times this morning.', vi: 'Sáng nay tôi đã xem tin nhắn năm lần. (times = số lần)' },
      ],
    },
    {
      t: 'p',
      text: '**d) Tăng điểm Grammatical Range and Accuracy.** Tiêu chí ngữ pháp chấm cả **độ chính xác** lẫn **độ đa dạng**. Bài band 5 thường đầy lỗi *informations, much people, a work*; bài band 6.5+ gần như không có lỗi này và còn dùng linh hoạt *a great deal of, a growing number of, fewer… less…*. Sửa hết lỗi danh từ là cách **rẻ nhất** để lên điểm.',
    },
    {
      t: 'examples',
      items: [
        { en: 'A growing number of companies now allow staff to work from home.', vi: 'Ngày càng nhiều công ty cho phép nhân viên làm việc tại nhà.' },
        { en: 'Working from home means less traffic and fewer cars on the road.', vi: 'Làm việc tại nhà nghĩa là bớt tắc đường và ít xe trên đường hơn.' },
        { en: 'Managers need a great deal of trust to lead a remote team.', vi: 'Người quản lý cần rất nhiều sự tin tưởng để dẫn dắt một nhóm làm từ xa.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo làm bài',
      items: [
        'Soát bài theo một vòng riêng chỉ để kiểm danh từ: gạch chân mọi danh từ, hỏi "đếm được không?", rồi kiểm **a/an**, **-s**, **từ chỉ số lượng** và **động từ** đi theo.',
        'Viết về một nhóm người **nói chung** thì dùng **số nhiều không "the"**: *Employees need…*, *Freelancers often…* — tự nhiên hơn "An employee needs…".',
        'Thuộc sẵn 5 cụm "an toàn": **a growing number of** + số nhiều · **a great deal of** + không đếm được · **fewer / less** · **the number / the amount of** · **a piece of** + không đếm được.',
      ],
    },

    { t: 'h', text: '9. Lỗi danh từ người Việt hay mắc nhất' },
    {
      t: 'p',
      text: 'Phần này sách chưa có. Những lỗi dưới đây xuất hiện trong gần như mọi bài viết band 4–5.',
    },
    {
      t: 'table',
      head: ['Sai', 'Đúng', 'Ghi chú'],
      rows: [
        ['~~informations~~', '**information** / pieces of information', 'không đếm được'],
        ['~~advices~~, ~~an advice~~', '**advice** / a piece of advice', 'động từ là **advise** (khuyên) — khác chữ c/s'],
        ['~~researches~~, ~~a research~~', '**research** / a study, studies', 'muốn đếm thì dùng **study / studies**'],
        ['~~knowledges~~', '**knowledge**', '"a good knowledge of" là cụm cố định, được phép'],
        ['~~equipments~~', '**equipment** / pieces of equipment', ''],
        ['~~homeworks~~, ~~houseworks~~', '**homework**, **housework**', 'đếm thì dùng **tasks / exercises**'],
        ['~~luggages~~, ~~a luggage~~', '**luggage** / a suitcase, bags', ''],
        ['~~evidences~~, ~~feedbacks~~', '**evidence**, **feedback**', ''],
        ['~~traffics~~, ~~pollutions~~', '**traffic**, **pollution**', '"traffic jams" thì đếm được'],
        ['~~a news~~', '**a piece of news** / some news', 'news + động từ số ít'],
        ['~~much people~~, ~~less people~~', '**many people**, **fewer people**', 'people là số nhiều'],
        ['~~childrens~~, ~~peoples~~', '**children**, **people**', 'đã là số nhiều rồi'],
        ['~~staffs~~', '**staff** / staff members / employees', ''],
      ],
    },
    {
      t: 'quiz',
      id: 'd5-nhanh',
      title: 'Kiểm tra nhanh — điền một từ',
      kind: 'fill',
      items: [
        { q: 'We need more ___ about the new policy. (information)', answers: ['information'] },
        { q: 'My mentor gave me some useful ___ . (advice)', answers: ['advice'] },
        { q: 'How ___ employees work from home in your company?', answers: ['many'] },
        { q: 'How ___ time do you spend answering emails?', answers: ['much'] },
        { q: 'Hurry up! We have very ___ time left. (gần như không còn)', answers: ['little'] },
        { q: 'I have ___ close friends at work, so I never feel lonely. (vài người — tích cực)', answers: ['a few'] },
        { q: 'She gave me two ___ of advice. (piece)', answers: ['pieces'] },
        { q: 'The police ___ looking into the problem. (be — hiện tại)', answers: ['are'] },
        { q: 'The news ___ better than we expected. (be — hiện tại)', answers: ['is'] },
      ],
    },
  ],
};

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const D5_VOCAB: Lesson = {
  id: 'd5-tu-vung',
  kind: 'vocab',
  title: 'Từ vựng chủ đề Làm việc từ xa (Remote Work)',
  goal: 'Nắm 19 từ, 10 cụm động từ và 5 họ từ về làm việc từ xa — chủ đề hay ra ở Speaking Part 1 (Work) và Writing Task 2 (working from home).',
  minutes: 35,
  blocks: [
    {
      t: 'p',
      text: 'Từ sau năm 2020, **làm việc từ xa** (remote work — làm việc không cần đến văn phòng) trở thành đề tài quen thuộc của IELTS. Bấm 🔊 để nghe từng từ. Học theo vòng: nghe → đọc to → che nghĩa tự nhớ → đặt một câu về công việc hoặc việc học của chính bạn. Để ý cột **loại từ**: bài ngữ pháp hôm nay dạy bạn phân biệt đếm được / không đếm được — hãy áp dụng ngay cho từng từ.',
    },
    { t: 'h', text: '1. 19 từ cốt lõi' },
    {
      t: 'vocab',
      items: [
        { w: 'job', pos: 'n', ipa: '/dʒɒb/', vi: 'công việc, việc làm (đếm được)', ex: 'My brother got a part-time job at a design studio.', exVi: 'Anh tôi xin được một công việc bán thời gian ở một xưởng thiết kế.' },
        { w: 'office', pos: 'n', ipa: '/ˈɒfɪs/', vi: 'văn phòng', ex: 'Our office is on the tenth floor, but I only go there on Mondays.', exVi: 'Văn phòng chúng tôi ở tầng mười, nhưng tôi chỉ lên đó vào thứ Hai.' },
        { w: 'home', pos: 'n', ipa: '/həʊm/', vi: 'nhà (nơi mình sống)', ex: 'Since the pandemic, she has done most of her work from home.', exVi: 'Từ sau đại dịch, cô ấy làm phần lớn công việc tại nhà.' },
        { w: 'workplace', pos: 'n', ipa: '/ˈwɜːkpleɪs/', vi: 'nơi làm việc', ex: 'A friendly workplace makes people want to stay longer in a company.', exVi: 'Một nơi làm việc thân thiện khiến người ta muốn gắn bó lâu hơn với công ty.' },
        { w: 'employee', pos: 'n', ipa: '/ɪmˈplɔɪiː/', vi: 'nhân viên, người làm thuê', ex: 'Every new employee receives a laptop on the first day.', exVi: 'Mỗi nhân viên mới được nhận một chiếc laptop vào ngày đầu tiên.' },
        { w: 'boss', pos: 'n', ipa: '/bɒs/', vi: 'sếp, cấp trên', ex: 'My boss replies to messages even at weekends, which is a bit stressful.', exVi: 'Sếp tôi trả lời tin nhắn cả cuối tuần, điều đó hơi căng thẳng.' },
        { w: 'internet', pos: 'n', ipa: '/ˈɪntənet/', vi: 'mạng internet (thường có "the")', ex: 'Without a stable internet connection, remote work is almost impossible.', exVi: 'Không có kết nối internet ổn định thì gần như không thể làm việc từ xa.' },
        { w: 'computer', pos: 'n', ipa: '/kəmˈpjuːtə(r)/', vi: 'máy tính', ex: 'I bought a second screen for my computer to work faster.', exVi: 'Tôi mua thêm một màn hình cho máy tính để làm việc nhanh hơn.' },
        { w: 'email', pos: 'n, v', ipa: '/ˈiːmeɪl/', vi: 'thư điện tử; gửi thư điện tử', ex: 'I usually answer emails before I start my main tasks.', exVi: 'Tôi thường trả lời email trước khi bắt đầu các việc chính.' },
        { w: 'meeting', pos: 'n', ipa: '/ˈmiːtɪŋ/', vi: 'cuộc họp', ex: 'The weekly meeting moved online, so nobody has to travel.', exVi: 'Cuộc họp hằng tuần đã chuyển lên mạng nên không ai phải di chuyển.' },
        { w: 'online', pos: 'adj, adv', ipa: '/ˌɒnˈlaɪn/', vi: 'trực tuyến, trên mạng', ex: 'Many companies now hold job interviews online.', exVi: 'Nhiều công ty hiện phỏng vấn tuyển dụng qua mạng.' },
        { w: 'task', pos: 'n', ipa: '/tɑːsk/', vi: 'nhiệm vụ, đầu việc', ex: 'I write down three tasks every morning and finish them one by one.', exVi: 'Mỗi sáng tôi ghi ra ba đầu việc và làm xong từng việc một.' },
        { w: 'call', pos: 'n, v', ipa: '/kɔːl/', vi: 'cuộc gọi; gọi điện', ex: 'We have a quick video call with the design team at ten.', exVi: 'Lúc mười giờ chúng tôi có một cuộc gọi video ngắn với nhóm thiết kế.' },
        { w: 'flexible', pos: 'adj', ipa: '/ˈfleksəbl/', vi: 'linh hoạt', ex: 'Flexible hours let parents take their children to school.', exVi: 'Giờ làm linh hoạt giúp cha mẹ đưa con đi học được.' },
        { w: 'job satisfaction', pos: 'n', ipa: '/ˌdʒɒb ˌsætɪsˈfækʃn/', vi: 'sự hài lòng với công việc', ex: 'Good relationships with colleagues increase job satisfaction.', exVi: 'Quan hệ tốt với đồng nghiệp làm tăng sự hài lòng với công việc.' },
        { w: 'colleague', pos: 'n', ipa: '/ˈkɒliːɡ/', vi: 'đồng nghiệp', ex: 'Working from home, I sometimes miss chatting with my colleagues.', exVi: 'Làm việc ở nhà, đôi khi tôi nhớ những lúc trò chuyện với đồng nghiệp.' },
        { w: 'work-life balance', pos: 'n', ipa: '/ˌwɜːk ˈlaɪf ˈbæləns/', vi: 'sự cân bằng giữa công việc và cuộc sống', ex: 'Turning off notifications after 7 p.m. helps my work-life balance.', exVi: 'Tắt thông báo sau 7 giờ tối giúp tôi cân bằng công việc và cuộc sống.' },
        { w: 'time management', pos: 'n', ipa: '/ˈtaɪm ˌmænɪdʒmənt/', vi: 'kỹ năng quản lý thời gian', ex: 'Without a manager nearby, time management becomes your own responsibility.', exVi: 'Không có quản lý bên cạnh, việc quản lý thời gian trở thành trách nhiệm của chính bạn.' },
        { w: 'freelancer', pos: 'n', ipa: '/ˈfriːlɑːnsə(r)/', vi: 'người làm việc tự do (nhận việc theo dự án, không thuộc công ty nào)', ex: 'As a freelancer, he translates documents for clients in three countries.', exVi: 'Là người làm tự do, anh ấy dịch tài liệu cho khách hàng ở ba nước.' },
      ],
    },
    {
      t: 'note',
      title: 'Người Việt hay sai (phần sách chưa có)',
      items: [
        '**job** đếm được (*a job, two jobs*) nhưng **work** không đếm được (~~a work~~). *I have **a** job* = tôi có việc làm; *I have **a lot of work*** = tôi có nhiều việc phải làm.',
        '**at home / from home**, còn đi về nhà thì **không có giới từ**: ~~go to home~~ → **go home**. *work **from** home* = làm việc tại nhà (thay vì ở văn phòng).',
        '**the internet** thường có **the** và không đếm được: *search **the** internet*, *on **the** internet*. Viết hoa (Internet) hay thường đều được.',
        '**email**: *send **an** email / two emails* (đếm được, một lá thư) — nhưng *contact us **by email*** (phương thức, không có mạo từ).',
        '**online** vừa là tính từ (*an **online** meeting*) vừa là trạng từ (*work **online***). ~~work in online~~ là sai.',
        '**colleague** đọc /ˈkɒliːɡ/, âm cuối là /ɡ/ — không đọc "co-lê-giu". **employee** nhấn âm cuối: em-ploy-**EE**.',
        '**job satisfaction, time management, work-life balance** đều là **danh từ không đếm được**: *high job satisfaction* (không ~~a high job satisfaction~~).',
      ],
    },
    { t: 'h', text: '2. Cụm động từ (phrasal verbs)' },
    {
      t: 'p',
      text: 'Cụm động từ = **động từ + tiểu từ** (on, off, in, out, up…), nghĩa cả cụm thường khác nghĩa từng chữ. 10 cụm dưới đây là "ngôn ngữ hằng ngày" của dân văn phòng và làm từ xa — dùng trong Speaking thì rất tự nhiên.',
    },
    {
      t: 'vocab',
      items: [
        { w: 'set up', pos: 'phr v', ipa: '/set ʌp/', vi: 'thiết lập, cài đặt, dựng lên', ex: 'It took me an hour to set up the new printer.', exVi: 'Tôi mất một tiếng để cài đặt chiếc máy in mới.' },
        { w: 'log in', pos: 'phr v', ipa: '/lɒɡ ˈɪn/', vi: 'đăng nhập', ex: 'You have to log in with your company password.', exVi: 'Bạn phải đăng nhập bằng mật khẩu công ty.' },
        { w: 'log out', pos: 'phr v', ipa: '/lɒɡ ˈaʊt/', vi: 'đăng xuất', ex: 'Always log out when you use a shared computer.', exVi: 'Luôn đăng xuất khi dùng máy tính dùng chung.' },
        { w: 'catch up', pos: 'phr v', ipa: '/kætʃ ˈʌp/', vi: 'bắt kịp, làm bù (phần bị chậm / bị lỡ)', ex: 'I stayed late on Friday to catch up on my reports.', exVi: 'Tôi ở lại muộn hôm thứ Sáu để làm bù các bản báo cáo.' },
        { w: 'turn on', pos: 'phr v', ipa: '/tɜːn ˈɒn/', vi: 'bật (máy, đèn…)', ex: 'Please turn on your camera when the meeting starts.', exVi: 'Vui lòng bật camera khi cuộc họp bắt đầu.' },
        { w: 'turn off', pos: 'phr v', ipa: '/tɜːn ˈɒf/', vi: 'tắt (máy, đèn…)', ex: 'I turn off my work phone at 6 p.m.', exVi: 'Tôi tắt điện thoại công việc lúc 6 giờ chiều.' },
        { w: 'work on', pos: 'phr v', ipa: '/wɜːk ˈɒn/', vi: 'làm, dành công sức cho (một việc, dự án)', ex: 'Our team is working on a new website for a hotel.', exVi: 'Nhóm chúng tôi đang làm một trang web mới cho một khách sạn.' },
        { w: 'check in', pos: 'phr v', ipa: '/tʃek ˈɪn/', vi: 'hỏi thăm / báo cáo tình hình; làm thủ tục nhận phòng', ex: 'The team leader checks in with each of us every morning.', exVi: 'Trưởng nhóm hỏi thăm tình hình từng người chúng tôi mỗi sáng.' },
        { w: 'follow up', pos: 'phr v', ipa: '/ˌfɒləʊ ˈʌp/', vi: 'liên hệ lại, theo dõi tiếp (sau một việc đã xảy ra)', ex: 'The client did not reply, so I followed up with a short email.', exVi: 'Khách hàng không trả lời nên tôi liên hệ lại bằng một email ngắn.' },
        { w: 'put off', pos: 'phr v', ipa: '/pʊt ˈɒf/', vi: 'hoãn lại, trì hoãn', ex: 'We had to put off the launch because of a technical problem.', exVi: 'Chúng tôi phải hoãn buổi ra mắt vì một sự cố kỹ thuật.' },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo dùng cụm động từ (phần sách chưa có)',
      items: [
        '**Động từ viết rời, danh từ viết liền**: *to **log in*** (đăng nhập) → *your **login** details* (thông tin đăng nhập) · *to **set up*** → *the **setup*** · *to **check in*** → *the **check-in** desk* · *to **follow up*** → *a **follow-up** email*.',
        'Đi kèm giới từ: **log in to / log into** + hệ thống · **catch up on** + việc bị chậm · **check in with** + người · **follow up on** + việc / **follow up with** + người · **put off** + V-ing (*put off **doing** homework*).',
        '**set up, turn on, turn off, put off** tách ra được: *turn on the camera* = *turn the camera on*. Với đại từ thì **bắt buộc** tách: *turn **it** on* (~~turn on it~~), *put **it** off*.',
        '**work on** không tách: *work on **it*** (~~work it on~~).',
        '**put off** hay xuất hiện trong chủ đề thói quen học tập: *I tend to put things off* = tôi hay trì hoãn. Từ học thuật cùng nghĩa: **procrastinate**; trong Writing trang trọng hơn thì dùng **postpone / delay**.',
      ],
    },
    { t: 'h', text: '3. Họ từ (word formation)' },
    {
      t: 'p',
      text: 'Năm gốc từ của sách, mỗi gốc đủ bốn loại từ (danh từ, động từ, tính từ, trạng từ). Chữ in nghiêng là dạng **bổ sung** sách chưa ghi.',
    },
    {
      t: 'table',
      head: ['Gốc', 'Danh từ', 'Động từ', 'Tính từ', 'Trạng từ'],
      rows: [
        ['flex — linh hoạt, uốn', 'flexibility (sự linh hoạt)', 'flex (uốn, co giãn)', 'flexible (linh hoạt) · *inflexible* (cứng nhắc)', 'flexibly'],
        ['collaborate — hợp tác', 'collaboration (sự hợp tác) · *collaborator* (người cộng tác)', 'collaborate', 'collaborative (mang tính hợp tác)', 'collaboratively'],
        ['produce — sản xuất, năng suất', 'production (sự sản xuất) · *product* (sản phẩm) · *productivity* (năng suất)', 'produce', 'productive (năng suất cao) · *unproductive*', 'productively'],
        ['communicate — giao tiếp', 'communication (sự giao tiếp)', 'communicate', 'communicative (cởi mở, hay giao tiếp)', 'communicatively'],
        ['employ — thuê người làm', 'employment (việc làm) · *employer* (chủ) · *employee* (nhân viên) · *unemployment* (thất nghiệp)', 'employ', 'employed (có việc làm) · *unemployed* · *employable* (dễ được tuyển)', '— (không có)'],
      ],
    },
    {
      t: 'note',
      title: 'Dễ nhầm trong họ từ',
      items: [
        '**productivity** (năng suất — danh từ, không đếm được) mới là từ hay dùng nhất trong bài về làm từ xa, dù sách chỉ ghi **production** (việc sản xuất ra hàng hoá). *Remote work can boost **productivity**.*',
        '**employer** (người thuê — chủ) ≠ **employee** (người được thuê — nhân viên). Đuôi **-er** = người làm hành động; đuôi **-ee** = người nhận hành động (giống *trainer / trainee*, *interviewer / interviewee*).',
        '**employment** (việc làm nói chung) là **không đếm được**: ~~employments~~. Muốn đếm thì dùng **jobs**.',
        '**communication** (sự giao tiếp) không đếm được; **communications** (số nhiều) chỉ ngành / hệ thống truyền thông. *Good **communication** is vital in remote teams.*',
        '**flex** là động từ ít gặp (*flex your muscles*); trong bài viết hãy dùng **flexible / flexibility**. Cụm hay gặp: **flexible working hours**, **flexitime / flextime** (giờ làm linh hoạt).',
      ],
    },
    { t: 'h', text: '4. Dùng trong IELTS: câu mẫu ăn điểm' },
    {
      t: 'examples',
      items: [
        { en: 'Remote work gives employees more flexibility, but it requires excellent time management.', vi: 'Làm từ xa cho nhân viên sự linh hoạt hơn, nhưng đòi hỏi kỹ năng quản lý thời gian rất tốt. (Task 2)' },
        { en: 'Many employers worry that productivity will fall when staff work from home.', vi: 'Nhiều chủ doanh nghiệp lo năng suất sẽ giảm khi nhân viên làm tại nhà. (Task 2)' },
        { en: 'Online tools allow colleagues in different countries to collaborate effectively.', vi: 'Các công cụ trực tuyến giúp đồng nghiệp ở nhiều nước hợp tác hiệu quả. (Task 2)' },
        { en: 'A healthy work-life balance leads to higher job satisfaction.', vi: 'Cân bằng công việc và cuộc sống lành mạnh dẫn đến sự hài lòng với công việc cao hơn. (Task 2)' },
        { en: 'I work as a freelancer, so I can set up my office anywhere with an internet connection.', vi: 'Tôi làm tự do nên có thể đặt văn phòng ở bất cứ đâu có internet. (Speaking Part 1)' },
        { en: 'To be honest, I tend to put off difficult tasks until the last minute.', vi: 'Thật lòng mà nói, tôi hay trì hoãn những việc khó đến phút chót. (Speaking Part 1)' },
      ],
    },
  ],
};

/* ─────────────────────────── Nghe ─────────────────────────── */
/*
 * Kịch bản tự viết (sách dùng Audio 5 có bản quyền). Cùng chủ đề "đa nhiệm và
 * bộ não", cùng dạng: phần 1 điền 19 chỗ trống, phần 2 trắc nghiệm 13 câu.
 */
const D5_SCRIPT_1: string[] = [
  'These days, our phones buzz with messages all day, our inboxes keep filling up, and our to-do lists never seem to get any shorter. So many of us try to cope in the same way: we do several things at once. We answer emails during meetings, we scroll through social media while we eat, and some people even boast about being brilliant multitaskers. But is the human brain really built to work like this?',
  'The word "multitasking" actually comes from the world of technology. Engineers first used it to describe a machine that could run several programs at the same time. A modern processor can do this easily, but the brain works in a very different way. Our attention is limited, and scientists often compare it to a narrow bridge: only a few cars can cross at any moment, and the rest have to wait in a queue.',
  'Every second, our eyes, ears and skin send the brain a huge amount of information. Most of it never reaches our conscious mind. The brain acts like a strict filter, letting through only what seems important and quietly throwing away the rest. This is extremely useful, because without it we would feel overwhelmed. However, it also means that we can fail to notice things that are happening right in front of us.',
  'Imagine you are searching a crowded station for a friend in a red coat. You may walk straight past a street musician, or miss an announcement about your train, simply because your brain has decided that they are not relevant. Psychologists have shown this many times: when people concentrate hard on one task, they often miss surprising events that should be impossible to ignore. In other words, we simply do not have the capacity to handle everything at once.',
];

const D5_SCRIPT_2: string[] = [
  'So what really happens when we try to multitask? In most cases, the brain is not doing two things at the same time. Instead, it is switching rapidly from one task to the other and back again. Each switch takes a fraction of a second, and those tiny delays add up. Researchers call this the "switch cost". The result is almost always the same: we make more mistakes and finish later than if we had done the tasks one at a time.',
  'There is one important exception. We can do two things together quite well if they use different kinds of mental resources. For example, most people can fold laundry and listen to a podcast at the same time, because one activity mainly uses the hands, while the other uses the ears and language.',
  'You might assume, then, that chatting on the phone while driving is safe, as long as both hands stay on the wheel. Unfortunately, it is not that simple. When we listen to someone describe a place or a problem, we tend to build pictures in our mind, and those pictures compete for the same visual system that we need to watch the road.',
  'When that system is overloaded, a driver can look straight at a cyclist and still fail to see them. The eyes receive the image, but the information never reaches conscious awareness. So next time you feel proud of juggling five things at once, remember: multitasking usually makes us slower and less accurate, and in some situations it can be genuinely dangerous.',
];

const D5_LISTENING: Lesson = {
  id: 'd5-nghe',
  kind: 'listening',
  title: 'Nghe chép chính tả 2 (Dictation)',
  goal: 'Ôn lại cách luyện dictation và tự làm một bài nghe dài về đa nhiệm (multitasking): điền 19 chỗ trống và trả lời 13 câu trắc nghiệm.',
  minutes: 35,
  blocks: [
    { t: 'h', text: '1. Nhắc lại: nghe chép chính tả' },
    {
      t: 'p',
      text: 'Ở Ngày 3 bạn đã làm quen với **dictation** (nghe chép chính tả): nghe rồi viết lại từng chữ. Hôm nay ta luyện tiếp với một bài **dài hơn, nhanh hơn**, và thêm một dạng mới: nghe để **chọn đáp án** (giống dạng Multiple Choice trong đề thật).',
    },
    {
      t: 'table',
      caption: '5 lưu ý khi luyện dictation',
      head: ['Lưu ý', 'Làm thế nào'],
      rows: [
        ['1. **Chọn bài vừa sức**', 'Người đang ở band 3.0–4.0 nên bắt đầu với bài ngắn, nói chậm vừa phải, chủ đề quen. Bài quá khó thì bạn chỉ nghe được lác đác vài từ và nhanh nản; bài hơi khó một chút mới là bài giúp tiến bộ.'],
        ['2. **Nghe cho ra từng chi tiết**', 'Đừng hài lòng với "hiểu đại khái". Chép lại từng chữ buộc bạn để ý mọi từ, kể cả từ nhỏ — nhờ đó phát hiện từ mới và luyện tai nhận ra từ quen khi nó được nói nhanh.'],
        ['3. **Nghe đi nghe lại**', 'Mỗi câu có thể nghe vài lần cho tới khi chép được sát nhất. Mỗi lần nghe lại, bạn quen thêm ngữ điệu và cách người bản xứ dùng từ.'],
        ['4. **Đối chiếu và sửa lỗi**', 'Chép xong mới mở lời thoại để so. Đánh dấu từng chỗ sai và tìm lý do — sửa lỗi của chính mình là cách nhớ lâu nhất.'],
        ['5. **Kiên trì, đều đặn**', 'Dictation cần kiên nhẫn và tập trung cao. 15 phút mỗi ngày tốt hơn 2 tiếng một lần mỗi tuần; sau vài tuần bạn sẽ thấy tai "nhạy" hơn rõ rệt.'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo làm dạng trắc nghiệm nghe (phần sách chưa có)',
      items: [
        '**Đọc câu hỏi trước khi nghe**, gạch chân từ đứng trước và sau chỗ trống. Khi nghe tới những từ đó, đáp án nằm ngay đấy.',
        'Ba lựa chọn thường **cùng loại từ** và đều "nghe có lý". Đừng chọn theo cảm giác ngữ pháp — chọn theo **đúng từ bạn nghe được**.',
        'Cẩn thận với **từ gây nhiễu**: người nói có thể nhắc cả hai lựa chọn ("not A… but B"). Nghe hết câu rồi mới chốt.',
        'Nghe sót một câu thì bỏ qua ngay, tập trung câu sau — lời nói không dừng lại chờ bạn.',
      ],
    },

    { t: 'h', text: '2. Practice 1 — nghe và điền 19 chỗ trống' },
    {
      t: 'p',
      text: 'Chủ đề: **Đa nhiệm làm gì với bộ não của bạn?** (multitasking — làm nhiều việc cùng lúc). Đây là đề tài tâm lý học rất hay gặp ở Listening Section 4 và Reading. Nghe cả đoạn một lần để nắm ý, rồi điền **MỘT từ** vào mỗi chỗ trống. Cố điền hết trước khi mở lời thoại.',
    },
    {
      t: 'listen',
      id: 'd5-nghe-bai-1',
      title: 'What happens to your brain when you multitask? (Part 1)',
      note: 'Giọng Anh-Anh, khoảng 2 phút. Nghe hết một lượt, làm bài điền bên dưới, rồi mới mở lời thoại để soát.',
      lines: D5_SCRIPT_1.map((text) => ({ text, voice: 'uk-nam' as const })),
    },
    {
      t: 'quiz',
      id: 'd5-nghe-dien',
      title: 'Practice 1 — nghe và điền MỘT từ vào mỗi chỗ trống (19 câu)',
      kind: 'fill',
      items: [
        { q: 'These days, our phones buzz with (1) ___ all day…', answers: ['messages'] },
        { q: '…and our to-do lists never seem to get any (2) ___ .', answers: ['shorter'] },
        { q: 'So many of us try to (3) ___ in the same way: we do several things at once.', answers: ['cope'] },
        { q: 'We answer emails during (4) ___ , we scroll through social media while we eat…', answers: ['meetings'] },
        { q: '…and some people even (5) ___ about being brilliant multitaskers.', answers: ['boast'] },
        { q: 'The word "multitasking" actually comes from the world of (6) ___ .', answers: ['technology'] },
        { q: 'Engineers first used it to describe a machine that could run several (7) ___ at the same time.', answers: ['programs', 'programmes'] },
        { q: 'Our attention is (8) ___ …', answers: ['limited'] },
        { q: '…and scientists often compare it to a narrow (9) ___ .', answers: ['bridge'] },
        { q: 'Every second, our eyes, ears and (10) ___ send the brain a huge amount of information.', answers: ['skin'] },
        { q: 'Most of it never reaches our (11) ___ mind.', answers: ['conscious'] },
        { q: 'The brain acts like a strict (12) ___ , letting through only what seems important…', answers: ['filter'] },
        { q: 'This is extremely useful, because without it we would feel (13) ___ .', answers: ['overwhelmed'] },
        { q: 'However, it also means that we can fail to (14) ___ things that are happening right in front of us.', answers: ['notice'] },
        { q: 'Imagine you are searching a (15) ___ station for a friend in a red coat.', answers: ['crowded'] },
        { q: 'You may walk straight past a street musician, or miss an (16) ___ about your train…', answers: ['announcement'] },
        { q: '…simply because your brain has decided that they are not (17) ___ .', answers: ['relevant'] },
        { q: '…when people (18) ___ hard on one task, they often miss surprising events…', answers: ['concentrate'] },
        { q: 'In other words, we simply do not have the (19) ___ to handle everything at once.', answers: ['capacity'] },
      ],
    },
    {
      t: 'note',
      title: 'Mẹo soát đáp án Practice 1',
      items: [
        'Câu (1) **messages**, (4) **meetings**, (7) **programs** là **danh từ số nhiều** — nghe kỹ âm cuối /ɪz/ và /z/. Trước (4) là *during* (trong suốt) nên cần danh từ; "meetings" số nhiều vì nói chung chung.',
        'Câu (2) **shorter**: sau *get any* + tính từ so sánh hơn. Câu (13) **overwhelmed** (bị quá tải, choáng ngợp) có đuôi **-ed** — đuôi này đọc rất nhẹ, dễ bị bỏ sót.',
        'Câu (11) **conscious** (có ý thức) /ˈkɒnʃəs/ — chữ viết có "sc" nhưng đọc như "con-shợs". Từ này quay lại ở Practice 2.',
        'Câu (7): cả **programs** (Mỹ) và **programmes** (Anh) đều được chấp nhận; riêng chương trình **máy tính** thì người Anh cũng viết *program*.',
        'Liên hệ bài ngữ pháp: (10) **skin** và (19) **capacity** ở đây là **không đếm được** — không thêm -s. Câu (10) còn có *a huge **amount** of information* — "amount" đi với danh từ không đếm được.',
      ],
    },

    { t: 'h', text: '3. Practice 2 — nghe và chọn đáp án đúng (13 câu)' },
    {
      t: 'p',
      text: 'Phần tiếp theo của bài nói. Đọc trước 13 câu bên dưới, sau đó bấm **Nghe** và chọn từ bạn nghe được cho mỗi chỗ trống.',
    },
    {
      t: 'listen',
      id: 'd5-nghe-bai-2',
      title: 'What happens to your brain when you multitask? (Part 2)',
      note: 'Khoảng 1 phút 30 giây. Có thể nghe hai lần: lần một chọn đáp án, lần hai kiểm tra.',
      lines: D5_SCRIPT_2.map((text) => ({ text, voice: 'uk-nam' as const })),
    },
    {
      t: 'mcq',
      id: 'd5-nghe-chon',
      title: 'Practice 2 — chọn đáp án đúng (13 câu)',
      items: [
        { q: '(1) Instead, it is ___ rapidly from one task to the other and back again.', options: ['sleeping', 'switching', 'stopping'], correct: 1, why: 'Bộ não **chuyển** qua lại rất nhanh giữa hai việc — *switching*. Đây là ý chính của cả đoạn: đa nhiệm thật ra là chuyển việc liên tục.' },
        { q: '(2) Researchers call this the "switch ___".', options: ['cost', 'time', 'game'], correct: 0, why: '**switch cost** = "cái giá của việc chuyển đổi": mỗi lần chuyển việc mất một chút thời gian và sự tập trung.' },
        { q: '(3) The ___ is almost always the same: we make more mistakes and finish later…', options: ['reason', 'problem', 'result'], correct: 2, why: 'Câu nói về **kết quả** của việc chuyển đổi — *the result*. "reason" (lý do) không hợp vì phía sau là hậu quả.' },
        { q: '(4) …than if we had done the tasks one ___ a time.', options: ['in', 'at', 'by'], correct: 1, why: 'Cụm cố định **one at a time** = từng cái một. (Đừng nhầm với *one by one* — cũng là "từng cái một" nhưng không có "a time".)' },
        { q: '(5) We can do two things together quite well if they use different kinds of mental ___ .', options: ['images', 'energy', 'resources'], correct: 2, why: '**mental resources** = nguồn lực tinh thần (thị giác, thính giác, ngôn ngữ, vận động…). Hai việc dùng nguồn lực khác nhau thì không "giành" nhau.' },
        { q: '(6) For example, most people can ___ laundry and listen to a podcast at the same time.', options: ['fold', 'wash', 'sell'], correct: 0, why: 'Người nói nhắc **fold laundry** (gấp quần áo) — việc chủ yếu dùng tay, nên làm song song với việc nghe được.' },
        { q: '(7) You might ___, then, that chatting on the phone while driving is safe…', options: ['assume', 'deny', 'forget'], correct: 0, why: '**assume** = cho rằng, mặc định là. Người nói đưa ra một suy nghĩ phổ biến rồi bác bỏ nó ở câu sau.' },
        { q: '(8) Unfortunately, it is not that ___ .', options: ['difficult', 'simple', 'dangerous'], correct: 1, why: '**not that simple** = không đơn giản như vậy. Có "Unfortunately" (đáng tiếc) báo hiệu ý vừa nêu là sai → "difficult" hay "dangerous" đều ngược nghĩa.' },
        { q: '(9) …those pictures compete for the same ___ system that we need to watch the road.', options: ['visual', 'hearing', 'memory'], correct: 0, why: 'Hình ảnh trong đầu dùng chung **hệ thống thị giác** (visual system) với việc nhìn đường — nên nghe điện thoại vẫn làm lái xe kém đi.' },
        { q: '(10) When that system is ___ , a driver can look straight at a cyclist and still fail to see them.', options: ['relaxed', 'overloaded', 'repaired'], correct: 1, why: '**overloaded** = quá tải. Hệ thị giác phải xử lý cả con đường lẫn hình ảnh tưởng tượng nên bị quá tải.' },
        { q: '(11) …a driver can look straight at a ___ and still fail to see them.', options: ['cyclist', 'sign', 'tree'], correct: 0, why: 'Người nói nói **a cyclist** (người đi xe đạp). Đại từ **them** phía sau cũng là gợi ý: nó chỉ **người** (they số ít), không dùng cho biển báo hay cái cây.' },
        { q: '(12) The eyes receive the image, but the information never reaches ___ awareness.', options: ['passive', 'conscious', 'unconscious'], correct: 1, why: '**conscious awareness** = nhận thức có ý thức. Mắt có "thấy" nhưng thông tin không đi tới phần ý thức — giống như bộ lọc ở Practice 1.' },
        { q: '(13) …and in some situations it can be genuinely ___ .', options: ['useful', 'safe', 'dangerous'], correct: 2, why: 'Kết bài: đa nhiệm làm ta chậm và kém chính xác, và có lúc **thật sự nguy hiểm** (genuinely dangerous) — liên hệ ví dụ lái xe.' },
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch — Phần 1',
      items: [
        '(1) Ngày nay, điện thoại của chúng ta rung vì tin nhắn suốt cả ngày, hộp thư cứ đầy lên, còn danh sách việc cần làm thì dường như chẳng bao giờ ngắn đi. Vì thế rất nhiều người trong chúng ta xoay xở theo cùng một cách: làm nhiều việc một lúc. Ta trả lời email trong lúc họp, lướt mạng xã hội trong khi ăn, và có người còn khoe mình là "cao thủ đa nhiệm". Nhưng bộ não con người có thật sự được "thiết kế" để làm việc như vậy không?',
        '(2) Từ "multitasking" (đa nhiệm) thật ra bắt nguồn từ thế giới công nghệ. Các kỹ sư lần đầu dùng nó để mô tả một cỗ máy có thể chạy nhiều chương trình cùng lúc. Một bộ vi xử lý hiện đại làm việc đó dễ dàng, nhưng bộ não hoạt động theo cách rất khác. Sự chú ý của chúng ta có hạn, và các nhà khoa học thường ví nó như một cây cầu hẹp: mỗi lúc chỉ vài chiếc xe qua được, những xe còn lại phải xếp hàng chờ.',
        '(3) Mỗi giây, mắt, tai và da gửi lên não một lượng thông tin khổng lồ. Phần lớn chúng không bao giờ tới được phần ý thức của ta. Bộ não hoạt động như một chiếc lưới lọc nghiêm ngặt, chỉ cho qua những gì có vẻ quan trọng và lặng lẽ bỏ đi phần còn lại. Điều này cực kỳ hữu ích, vì nếu không có nó ta sẽ thấy choáng ngợp. Tuy nhiên, nó cũng có nghĩa là ta có thể không nhận ra những việc đang diễn ra ngay trước mắt.',
        '(4) Hãy tưởng tượng bạn đang tìm một người bạn mặc áo khoác đỏ giữa nhà ga đông đúc. Bạn có thể đi ngang qua một nghệ sĩ đường phố, hoặc bỏ lỡ một thông báo về chuyến tàu của mình, chỉ vì bộ não đã quyết định những thứ đó không liên quan. Các nhà tâm lý học đã chứng minh điều này nhiều lần: khi người ta tập trung cao độ vào một việc, họ thường bỏ lỡ những sự kiện bất ngờ mà lẽ ra không thể không thấy. Nói cách khác, đơn giản là ta không có đủ khả năng để xử lý mọi thứ cùng một lúc.',
      ],
    },
    {
      t: 'note',
      title: 'Bản dịch — Phần 2',
      items: [
        '(5) Vậy điều gì thật sự xảy ra khi ta cố làm nhiều việc một lúc? Trong đa số trường hợp, bộ não không làm hai việc cùng lúc. Thay vào đó, nó chuyển rất nhanh từ việc này sang việc kia rồi quay lại. Mỗi lần chuyển mất một phần nhỏ của giây, và những khoảng trễ nhỏ xíu ấy cộng dồn lại. Các nhà nghiên cứu gọi đó là "cái giá của việc chuyển đổi". Kết quả gần như lúc nào cũng vậy: ta mắc nhiều lỗi hơn và xong việc muộn hơn so với khi làm từng việc một.',
        '(6) Có một ngoại lệ quan trọng. Ta có thể làm hai việc cùng lúc khá tốt nếu chúng dùng những loại nguồn lực tinh thần khác nhau. Ví dụ, hầu hết mọi người có thể vừa gấp quần áo vừa nghe podcast, vì một việc chủ yếu dùng đôi tay, còn việc kia dùng đôi tai và ngôn ngữ.',
        '(7) Vậy thì bạn có thể cho rằng vừa lái xe vừa nói chuyện điện thoại là an toàn, miễn là hai tay vẫn đặt trên vô-lăng. Đáng tiếc là mọi chuyện không đơn giản như vậy. Khi nghe ai đó tả một nơi chốn hay một vấn đề, ta có xu hướng dựng hình ảnh trong đầu, và những hình ảnh đó tranh giành chính hệ thống thị giác mà ta cần để quan sát đường.',
        '(8) Khi hệ thống ấy bị quá tải, người lái có thể nhìn thẳng vào một người đi xe đạp mà vẫn không thấy họ. Mắt nhận được hình ảnh, nhưng thông tin không bao giờ tới được nhận thức có ý thức. Nên lần tới khi bạn tự hào vì "tung hứng" được năm việc cùng lúc, hãy nhớ: đa nhiệm thường làm ta chậm hơn, kém chính xác hơn, và trong một số tình huống nó có thể thật sự nguy hiểm.',
      ],
    },
    {
      t: 'note',
      title: 'Cách học sau khi làm xong',
      items: [
        'Mở lời thoại, nghe lại từng đoạn và **đọc nhại theo** (shadowing) — bắt chước cả chỗ ngắt nghỉ và nhấn giọng.',
        'Chép vào sổ những cụm hữu ích cho Writing: **a huge amount of information**, **at the same time**, **one at a time**, **fail to notice**, **not that simple**, **in other words**.',
        'Bài nghe này là "nguyên liệu" cho Speaking: *Do you often do several things at once?* — thử trả lời 3–4 câu bằng những ý vừa nghe.',
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const D5_HOMEWORK: Lesson = {
  id: 'd5-bai-tap',
  kind: 'homework',
  title: 'Bài tập Ngày 5',
  goal: 'Tự kiểm tra Ngày 5: 12 câu chia danh từ đếm được / không đếm được theo từ vựng Remote Work và 10 câu dịch dùng cụm động từ — có đáp án và gia sư chấm.',
  minutes: 30,
  blocks: [
    {
      t: 'p',
      text: '**Bài I:** xác định danh từ trong ngoặc là đếm được hay không đếm được, rồi điền **dạng đúng** của nó (giữ nguyên hoặc thêm -s / -es). Nhìn các **dấu hiệu** quanh chỗ trống: a/an, many, several, all, one of, động từ số ít hay số nhiều… Gợi ý trong ngoặc tròn cho biết dấu hiệu cần để ý.',
    },
    {
      t: 'quiz',
      id: 'd5-dem-duoc',
      title: 'I. Điền dạng đúng của danh từ (12 câu)',
      kind: 'fill',
      items: [
        { q: 'After graduating, my cousin found a well-paid ___ (job) in Da Nang.', hint: 'có "a" phía trước', answers: ['job'] },
        { q: 'The company has two ___ (office): one in Hanoi and one in Ho Chi Minh City.', hint: 'có "two"', answers: ['offices'] },
        { q: 'After a long day, all I want is to relax in my quiet ___ (home).', hint: 'có "my", chỉ một nơi', answers: ['home'] },
        { q: 'Many modern ___ (workplace) now include a small gym and a coffee corner.', hint: 'có "many"', answers: ['workplaces'] },
        { q: 'The director thanked all fifty ___ (employee) for their hard work.', hint: 'có "all fifty"', answers: ['employees'] },
        { q: 'Our ___ (boss) lets us leave early on Fridays.', hint: 'động từ "lets" chia số ít', answers: ['boss'] },
        { q: 'Fast ___ (internet) is essential for video meetings.', hint: 'danh từ không đếm được', answers: ['internet'] },
        { q: 'During my holiday, hundreds of ___ (email) piled up in my inbox.', hint: 'có "hundreds of"', answers: ['emails'] },
        { q: 'The ___ (meeting) with the new client usually lasts about an hour.', hint: 'động từ "lasts" chia số ít', answers: ['meeting'] },
        { q: 'Each ___ (task) on the list has a clear deadline.', hint: 'có "each"', answers: ['task'] },
        { q: 'She made three phone ___ (call) before lunch.', hint: 'có "three"', answers: ['calls'] },
        { q: 'One of my ___ (colleague) is teaching me how to use the new software.', hint: 'có "one of"', answers: ['colleagues'] },
      ],
    },
    {
      t: 'note',
      title: 'Giải thích đáp án Bài I',
      items: [
        '(1) **job** — "a" + danh từ đếm được **số ít**. (2) **offices** — "two" → số nhiều; *office* chỉ thêm -s. (3) **home** — "my quiet home": một ngôi nhà, số ít.',
        '(4) **workplaces** — "many" chỉ đi với danh từ đếm được **số nhiều**. (5) **employees** — "all fifty" → số nhiều.',
        '(6) **boss** — động từ **lets** có -s nên chủ ngữ số ít. Lưu ý số nhiều của boss là **bosses** (thêm -es vì tận cùng -ss).',
        '(7) **internet** — không đếm được, không bao giờ thêm -s.',
        '(8) **emails** — "hundreds of" → số nhiều. (9) **meeting** — động từ **lasts** số ít.',
        '(10) **task** — **each / every** luôn đi với danh từ **số ít** (~~each tasks~~). (11) **calls** — "three" → số nhiều.',
        '(12) **colleagues** — **one of + danh từ số nhiều** (một trong số các đồng nghiệp), nhưng động từ vẫn chia theo "one" → **is**. Đây là lỗi rất hay gặp: ~~one of my colleague~~.',
      ],
    },
    {
      t: 'p',
      text: '**Bài II:** dịch sang tiếng Anh, dùng **cụm động từ** gợi ý. Bấm 💡 để xem nghĩa cụm động từ và cấu trúc câu.',
    },
    {
      t: 'quiz',
      id: 'd5-dich',
      title: 'II. Dịch sang tiếng Anh — dùng cụm động từ gợi ý (10 câu)',
      kind: 'translate',
      grammar: 'need to / have to / must / will + V nguyên mẫu; câu mệnh lệnh bắt đầu bằng V hoặc Please / Remember to / Don\'t + V; hiện tại tiếp diễn (am/is/are + V-ing) cho việc đang làm; hiện tại đơn (V/V-s) cho thói quen. Cụm động từ tách được (turn on, turn off, set up, put off): với đại từ phải tách — turn it on. Nhớ giới từ: log in to, catch up on, check in with, follow up with.',
      items: [
        {
          q: 'Tôi cần cài đặt chiếc laptop mới của mình.',
          hint: 'set up',
          answers: ['I need to set up my new laptop.', 'I need to set my new laptop up.', 'I have to set up my new laptop.', 'I have to set my new laptop up.', 'I need to set up my new laptop computer.'],
        },
        {
          q: 'Nhân viên phải đăng nhập vào hệ thống mỗi sáng.',
          hint: 'log in',
          answers: ['Employees must log in to the system every morning.', 'Employees must log into the system every morning.', 'Employees have to log in to the system every morning.', 'Employees have to log into the system every morning.', 'Staff must log in to the system every morning.', 'Staff must log into the system every morning.', 'Staff have to log in to the system every morning.', 'Staff have to log into the system every morning.', 'The employees must log in to the system every morning.', 'The employees have to log in to the system every morning.'],
        },
        {
          q: 'Nhớ đăng xuất trước khi rời khỏi máy tính nhé.',
          hint: 'log out',
          answers: ['Remember to log out before you leave the computer.', 'Remember to log out before leaving the computer.', "Don't forget to log out before you leave the computer.", "Don't forget to log out before leaving the computer.", 'Remember to log out before you leave your computer.', 'Remember to log out before leaving your computer.', "Don't forget to log out before you leave your computer.", "Don't forget to log out before leaving your computer."],
        },
        {
          q: 'Tôi cần bắt kịp tiến độ công việc sau kỳ nghỉ.',
          hint: 'catch up',
          answers: ['I need to catch up on my work after the holiday.', 'I need to catch up on work after the holiday.', 'I need to catch up on my work after the holidays.', 'I need to catch up on work after the holidays.', 'I need to catch up on my work after my holiday.', 'I need to catch up on my work after the vacation.', 'I need to catch up with my work after the holiday.', 'I have to catch up on my work after the holiday.'],
        },
        {
          q: 'Bạn bật camera lên được không?',
          hint: 'turn on',
          answers: ['Can you turn on your camera?', 'Could you turn on your camera?', 'Can you turn your camera on?', 'Could you turn your camera on?', 'Can you turn on the camera?', 'Could you turn on the camera?', 'Can you turn the camera on?', 'Could you turn the camera on?'],
        },
        {
          q: 'Hãy tắt micro khi bạn không nói.',
          hint: 'turn off',
          answers: ["Please turn off your microphone when you aren't speaking.", 'Please turn off your microphone when you are not speaking.', "Please turn off your microphone when you're not speaking.", "Please turn off your mic when you aren't speaking.", 'Please turn off your mic when you are not speaking.', "Please turn off your mic when you're not speaking.", 'Turn off your microphone when you are not speaking.', "Turn off your microphone when you're not speaking.", 'Please turn your microphone off when you are not speaking.', 'Please turn off the microphone when you are not speaking.', "Please turn off your microphone when you don't speak."],
        },
        {
          q: 'Nhóm của chúng tôi đang làm một ứng dụng mới cho khách hàng.',
          hint: 'work on',
          answers: ['Our team is working on a new app for a client.', 'Our team is working on a new app for the client.', 'Our team is working on a new app for clients.', 'Our team is working on a new app for our client.', 'Our team is working on a new application for a client.', 'Our team is working on a new application for the client.', 'Our team is working on a new app for customers.', 'Our team is working on a new app for a customer.', "Our team's working on a new app for a client."],
        },
        {
          q: 'Quản lý của chúng tôi hỏi thăm tình hình cả nhóm vào mỗi thứ Hai.',
          hint: 'check in',
          answers: ['Our manager checks in with the team every Monday.', 'Our manager checks in with the whole team every Monday.', 'Our manager checks in with the team on Mondays.', 'Our manager checks in with the whole team on Mondays.', 'Our manager checks in with our team every Monday.', 'Our manager checks in with the team each Monday.'],
        },
        {
          q: 'Sau buổi phỏng vấn, tôi sẽ liên hệ lại với nhà tuyển dụng.',
          hint: 'follow up',
          answers: ['After the interview, I will follow up with the employer.', 'After the interview I will follow up with the employer.', 'I will follow up with the employer after the interview.', "After the interview, I'll follow up with the employer.", "I'll follow up with the employer after the interview.", 'After the interview, I will follow up with the recruiter.', 'I will follow up with the recruiter after the interview.', "After the interview, I'll follow up with the recruiter.", "I'll follow up with the recruiter after the interview."],
        },
        {
          q: 'Đừng hoãn những việc quan trọng đến tuần sau.',
          hint: 'put off',
          answers: ["Don't put off important tasks until next week.", 'Do not put off important tasks until next week.', "Don't put off important things until next week.", 'Do not put off important things until next week.', "Don't put off important work until next week.", "Don't put important tasks off until next week.", "Don't put off important tasks till next week.", "Don't put off important jobs until next week."],
        },
      ],
    },
    {
      t: 'note',
      title: 'Soát lỗi Bài II',
      items: [
        '(2) **log in to / log into** + hệ thống — đừng quên "to": ~~log in the system~~.',
        '(4) **catch up on** + việc bị chậm (*catch up on my work*). **catch up with** thường dùng cho người (*catch up with the other students*).',
        '(5)(6) Có thể tách: *turn **your camera** on* — với đại từ thì **bắt buộc** tách: *turn **it** on*.',
        '(8) Chủ ngữ số ít (**Our manager**) → **checks** có -s. **check in with** + người.',
        '(10) **put off** + danh từ hoặc **V-ing**: *Don\'t put off **doing** your homework.* Không dùng ~~put off to do~~.',
      ],
    },
  ],
};

export const NGAY_5: Lesson[] = [D5_GRAMMAR, D5_VOCAB, D5_LISTENING, D5_HOMEWORK];
