/**
 * IELTS Tập 3 · Ngày 3 — Mạo từ vòng 2: the + danh từ chung, lỗi band 6 [G10] · Reading: True / False / Not Given 3 +
 * paraphrase hệ thống [R05 R18 VD4] · Speaking Part 1: Weather · Shopping · Clothes theo 12 khung câu hỏi + nối âm
 * phụ âm–nguyên âm [S04 S07 S18 S14] 🔊 linking /r/ · Bài tập (40 câu).
 *
 * Nguồn đề cương: docs/ielts-lo-trinh-0-8.md mục 3.3 hàng N3 + mục 3.6 (N3: S18 trọn 12 khung, nối T2 N5).
 * Nối Tập 2: mạo từ T2 N1 (hệ thống a / an / the / Ø) · TFNG T2 N6 (5 bẫy) · paraphrase T2 N8 (3 cách) + T3 N1 (4 mức) ·
 * Part 1 theo dạng câu hỏi T2 N5 (6 khung) · nối âm T2 N23 (nhập). Mọi bài đọc, câu ví dụ, câu trả lời mẫu đều tự soạn.
 */
import type { Lesson } from "../data";

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T3D3_GRAMMAR: Lesson = {
  id: "t3d3-ngu-phap",
  kind: "grammar",
  title: "Mạo từ vòng 2 — the + danh từ chung, 6 nhóm lỗi còn sót ở band 6",
  goal: "Dùng đúng mạo từ ở 6 chỗ người band 5 còn sai: ba cách nói chung về một loại, nhóm từ luôn có the (the environment, the government), the + tính từ, danh từ có cụm of / that theo sau, danh từ không đếm được, và cụm cố định — rồi tự soát mạo từ trong bài viết của mình trong 2 phút.",
  minutes: 80,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy tiêu chí **GRA** (Grammatical Range & Accuracy — độ đa dạng và chính xác ngữ pháp) của **Writing và Speaking** từ 5 lên 6. Band 6 cho phép có lỗi, nhưng lỗi phải **ít dần và không làm sai nghĩa**. Mạo từ là loại lỗi còn sót **nhiều nhất** trong bài band 5.5 của người Việt.",
        "**Tập 2 Ngày 1** đã dạy hệ thống a / an / the / Ø (Ø = không dùng mạo từ) bằng 3 câu hỏi. Hôm nay là **vòng 2**: 6 chỗ khó hơn mà 3 câu hỏi đó chưa đủ.",
        "Nói **chung về một loại** có 3 cách: ==**Computers** are…== · ==**The computer** is…== · ==**A computer** is…== — mỗi cách một sắc thái.",
        "Một nhóm danh từ chung **luôn có the**: **the environment, the government, the economy, the internet, the media, the public**. Một nhóm **không bao giờ có**: ~~the society~~, ~~the nature~~ → **society, nature**.",
        "Có cụm **of / that / which** chỉ rõ phía sau → thường là **the**: **the** education **of** children. Nhưng **a number of, a lack of, a rise of 5 %** vẫn là **a**.",
        "Cuối bài có **bảng tự soát 4 bước** — dùng cho mọi bài viết từ nay tới ngày thi.",
      ],
    },
    {
      t: "p",
      text: "Bạn đã biết luật cơ bản. Vậy vì sao bài viết vẫn bị gạch đỏ ở mạo từ? Vì ở band 5–6, lỗi không còn nằm ở **a student / the sun** nữa. Nó nằm ở những danh từ **trừu tượng và danh từ xã hội** mà bài Task 2 nào cũng có: society, the government, education, the environment, research, the elderly. Hôm nay ta xử lý đúng nhóm đó.",
    },

    { t: "h", text: "1. Ôn 5 phút — ba câu hỏi của Tập 2 Ngày 1" },
    {
      t: "table",
      caption: "Hỏi lần lượt từ trên xuống (ôn từ T2 N1)",
      head: ["Câu hỏi", "Trả lời", "Chọn", "Ví dụ"],
      rows: [
        ["① Người nghe **đã biết cái nào** chưa?", "Rồi: đã nhắc · chỉ có một · so sánh nhất · có cụm chỉ rõ", "**the**", "I bought a laptop. **The** laptop is very light."],
        ["② Chưa biết — danh từ **đếm được số ít**?", "Đúng", "**a / an** (không để trần)", "She works for **a** software company."],
        ["③ Số nhiều / không đếm được, nói **chung**?", "Đúng", "**Ø**", "**Ø** Children need **Ø** love."],
      ],
    },
    {
      t: "mcq",
      id: "t3d3-on-nhanh",
      title: "Khởi động — ôn Tập 2 (6 câu)",
      items: [
        { q: "My sister is ___ engineer at a car factory.", options: ["a", "an", "the", "Ø (không mạo từ)"], correct: 1, why: "Nghề nghiệp, đếm được số ít → a / an. **engineer** bắt đầu bằng nguyên âm /e/ → **an**." },
        { q: "___ air pollution is getting worse in many Asian cities.", options: ["An", "The", "A", "Ø (không mạo từ)"], correct: 3, why: "Ô nhiễm không khí **nói chung**, không đếm được → **Ø**." },
        { q: "This is ___ tallest building in the city.", options: ["the", "a", "an", "Ø (không mạo từ)"], correct: 0, why: "**So sánh nhất** → the tallest." },
        { q: "We stayed in a hotel near a lake. ___ lake was frozen.", options: ["A", "Ø (không mạo từ)", "The", "An"], correct: 2, why: "**Lần nhắc thứ hai** — người nghe đã biết hồ nào → **The**." },
        { q: "He has worked in ___ United States for ten years.", options: ["a", "the", "Ø (không mạo từ)", "an"], correct: 1, why: "Tên nước có chữ chung **States** → **the** United States." },
        { q: "It takes ___ hour and a half to drive there.", options: ["Ø (không mạo từ)", "a", "the", "an"], correct: 3, why: "**hour** có h câm, bắt đầu bằng nguyên âm /aʊ/ → **an** hour." },
      ],
    },

    { t: "h", text: "2. Ba cách nói CHUNG về một loại — Computers · The computer · A computer" },
    {
      t: "p",
      text: "Câu nói chung (generic statement — câu nói về **cả một loại**, không về một vật cụ thể) là xương sống của Task 2 và Part 3. Tiếng Anh có **ba cách** viết câu này. Cả ba đều đúng ngữ pháp, nhưng dùng ở chỗ khác nhau.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "Ø + N số nhiều / N không đếm được + V",
          vi: "Cách **an toàn nhất**, dùng được cho mọi danh từ, mọi văn cảnh. Chọn cách này khi không chắc.",
          examples: [
            { en: "Smartphones have changed the way people communicate.", vi: "Điện thoại thông minh đã thay đổi cách con người liên lạc." },
            { en: "Plastic takes hundreds of years to break down.", vi: "Nhựa mất hàng trăm năm để phân huỷ." },
          ],
        },
        {
          formula: "The + N số ít + V(s/es)",
          vi: "Trang trọng, **học thuật**: nói về cả loại như **một khái niệm**. Hay dùng với phát minh, loài vật, nhạc cụ, bộ phận cơ thể.",
          examples: [
            { en: "The smartphone has changed the way people communicate.", vi: "(Loại máy gọi là) điện thoại thông minh đã thay đổi cách con người liên lạc." },
            { en: "The tiger is in danger of extinction.", vi: "Loài hổ đang có nguy cơ tuyệt chủng." },
          ],
        },
        {
          formula: "A / An + N số ít + V(s/es)",
          vi: "Dùng để **định nghĩa** hoặc nói điều đúng với **bất kỳ một cá thể nào** của loại đó.",
          examples: [
            { en: "A smartphone is a mobile phone that can run apps.", vi: "Điện thoại thông minh là một chiếc điện thoại di động chạy được ứng dụng." },
            { en: "A teacher needs a great deal of patience.", vi: "Một người giáo viên (bất kỳ) cần rất nhiều kiên nhẫn." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Chọn cách nào?",
      head: ["Bạn muốn nói", "Cách dùng", "Ví dụ"],
      rows: [
        ["Một nhận xét chung trong Task 2 / Part 3", "**Ø + số nhiều** (mặc định)", "**Cars** cause a lot of pollution."],
        ["Lịch sử một phát minh; cả một loài; văn phong báo cáo", "**The + số ít**", "**The car** was invented in the nineteenth century."],
        ["Định nghĩa; điều đúng với từng cá thể", "**A / An + số ít**", "**A car** needs regular maintenance."],
        ["Danh từ không đếm được", "**chỉ Ø**", "**Traffic** is a major problem. (~~The traffic~~, ~~A traffic~~)"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~**The smartphones** have changed our lives.~~ → **Smartphones** have changed our lives. — **the + số nhiều** nghĩa là **một nhóm cụ thể** (những cái điện thoại đó), không phải cả loại.",
        "~~**Smartphone** has changed our lives.~~ → danh từ đếm được số ít **không đứng trần**: thêm **The** hoặc đổi sang số nhiều.",
        "~~**A tiger** is in danger of extinction.~~ → **The tiger is** / **Tigers are** in danger of extinction. — a tiger = một con bất kỳ; mà **một con** thì không “tuyệt chủng” được. Nói về **cả loài như một tổng thể** thì không dùng a.",
        "Đã chọn cách nào thì **giữ suốt đoạn**: đừng viết câu đầu “Computers are…” rồi câu sau “The computer is…” cho cùng một ý — người đọc tưởng bạn đổi sang một cái máy cụ thể.",
      ],
    },
    {
      t: "rule",
      formula: "Nói chung: Ø + N số nhiều (mặc định) · The + N số ít (học thuật: phát minh, loài) · A / An + N số ít (định nghĩa)",
      vi: "Không chắc → dùng Ø + số nhiều. Không dùng the + danh từ số nhiều cho câu nói chung về một loại (the + số nhiều = một nhóm cụ thể). Ngoại lệ là tên dân tộc: the Germans, the Thais (mục 4).",
    },
    {
      t: "quiz",
      id: "t3d3-noi-chung-dich",
      title: "Dịch nhanh — câu nói chung (4 câu)",
      kind: "translate",
      grammar: "Ø + N số nhiều + V · The + N số ít + V(s) (phát minh, loài) · A / An + N số ít (định nghĩa).",
      items: [
        { q: "Máy tính đã làm cho cuộc sống dễ dàng hơn.", hint: "Computers (Ø), have made, life (Ø), easier", answers: ["Computers have made life easier.", "The computer has made life easier.", "Computers have made our lives easier.", "Computers have made people's lives easier."] },
        { q: "Bác sĩ là người chữa bệnh cho người ốm. (câu định nghĩa)", hint: "A doctor, is a person who, treats, sick people", answers: ["A doctor is a person who treats sick people.", "A doctor is someone who treats sick people.", "A doctor is a person who treats ill people.", "A doctor is a person who treats people who are sick.", "A doctor is someone who treats ill people."] },
        { q: "Loài voi là động vật trên cạn lớn nhất.", hint: "The elephant / Elephants, the largest land animal(s)", answers: ["The elephant is the largest land animal.", "Elephants are the largest land animals.", "The elephant is the biggest land animal.", "Elephants are the biggest land animals."] },
        { q: "Giao thông là một vấn đề nghiêm trọng ở các thành phố lớn.", hint: "Traffic (Ø), a serious problem, in big cities (Ø)", answers: ["Traffic is a serious problem in big cities.", "Traffic is a serious problem in large cities.", "Traffic is a serious problem in major cities.", "Traffic is a serious issue in big cities."] },
      ],
    },

    { t: "h", text: "3. Nhóm danh từ chung LUÔN có the — và nhóm KHÔNG BAO GIỜ có" },
    {
      t: "p",
      text: "Có những thứ mà **cả xã hội cùng chia sẻ một cái**: một môi trường, một chính phủ (của nước đang nói tới), một nền kinh tế, một mạng internet. Vì “ai cũng biết là cái nào”, chúng **luôn đi với the**, kể cả khi câu đang nói chung. Ngược lại, một số danh từ **rất trừu tượng** (society, nature) lại **không** có the. Nhóm này phải học thuộc — không suy ra được từ tiếng Việt.",
    },
    {
      t: "sodo",
      kind: "compare",
      title: "Hai nhóm phải thuộc",
      cols: [
        {
          title: "**Luôn the** — thứ cả xã hội chia sẻ",
          items: [
            "**the** environment · **the** climate · **the** weather",
            "**the** government · **the** state · **the** police",
            "**the** economy · **the** job market · **the** workforce",
            "**the** internet · **the** media · **the** press",
            "**the** public · **the** population · **the** countryside",
            "**the** world · **the** planet · **the** past / present / future",
            "**the** cost of living · **the** crime rate · **the** birth rate",
          ],
        },
        {
          title: "**Luôn Ø** khi nói chung",
          items: [
            "**society** (~~the society~~)",
            "**nature** (~~the nature~~) · **space** (vũ trụ)",
            "**people** · **humanity** · **human beings**",
            "**life** · **health** · **education** · **crime**",
            "**technology** · **science** · **industry**",
            "**public transport** · **social media** · **work**",
            "**unemployment** · **poverty** · **pollution** · **tourism**",
          ],
        },
      ],
      caption: "Mẹo: bên trái là những thứ CHỈ CÓ MỘT trong đời sống chung (một chính phủ, một môi trường). Bên phải là khái niệm trừu tượng, không đếm được. ⚠️ Khi từ bên trái chỉ đứng bổ nghĩa cho danh từ khác thì mạo từ theo danh từ chính: **climate change**, **government spending**, **internet access** (Ø — nói chung).",
    },
    {
      t: "examples",
      items: [
        { en: "The government should spend more money on public transport.", vi: "Chính phủ nên chi nhiều tiền hơn cho giao thông công cộng. (the government · Ø public transport)" },
        { en: "Plastic waste does serious damage to the environment.", vi: "Rác nhựa gây hại nghiêm trọng cho môi trường. (Ø plastic waste · the environment)" },
        { en: "Social media has a strong influence on society.", vi: "Mạng xã hội có ảnh hưởng mạnh tới xã hội. (Ø social media · Ø society)" },
        { en: "Many young people get their news from the internet rather than from the press.", vi: "Nhiều người trẻ lấy tin từ internet thay vì từ báo in. (Ø young people · the internet · the press)" },
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — ba từ sai nhiều nhất trong bài Task 2 của người Việt",
      items: [
        "~~in **the society**~~ → **in society**. Chỉ dùng mạo từ khi có phần chỉ rõ: **the society we live in** (xã hội mà ta đang sống), hoặc khi nói **một kiểu** xã hội: **a fair society**, **a modern society**.",
        "~~protect **the nature**~~ → protect **nature** / protect **the environment**. Còn **the nature of** + N nghĩa là **bản chất của**: the nature of the problem.",
        "~~**Government** should…~~ (để trần) → **The government** should… / **Governments** should… (các chính phủ nói chung — cũng đúng và rất hay dùng trong Task 2).",
        "**people** nói chung thì Ø: **People** are living longer. **The people** = những người cụ thể: **the people in my neighbourhood**.",
      ],
    },
    {
      t: "rule",
      formula: "the + environment / government / economy / internet / media / public / world / future · Ø + society / nature / people / education / technology",
      vi: "Thứ cả xã hội chia sẻ một cái → the. Khái niệm trừu tượng nói chung → Ø.",
    },
    {
      t: "quiz",
      id: "t3d3-the-chung-dich",
      title: "Dịch nhanh — the hay Ø với danh từ xã hội (5 câu)",
      kind: "translate",
      grammar: "the + environment / government / economy / internet / media · Ø + society / nature / people / technology / education.",
      items: [
        { q: "Công nghệ đóng một vai trò quan trọng trong xã hội hiện đại.", hint: "Technology (Ø), plays an important role, in modern society (Ø)", answers: ["Technology plays an important role in modern society.", "Technology plays a vital role in modern society.", "Technology plays a key role in modern society.", "Technology plays an important part in modern society."] },
        { q: "Chính phủ nên bảo vệ môi trường.", hint: "The government / Governments, should protect, the environment", answers: ["The government should protect the environment.", "Governments should protect the environment."] },
        { q: "Nền kinh tế đã tăng trưởng nhanh trong mười năm qua.", hint: "The economy, has grown, rapidly / quickly, over / in the last ten years", answers: ["The economy has grown rapidly over the last ten years.", "The economy has grown quickly over the last ten years.", "The economy has grown rapidly in the last ten years.", "The economy has grown rapidly over the past ten years.", "The economy has grown rapidly in the past ten years.", "The economy has grown quickly in the last ten years.", "The economy has grown rapidly over the last decade.", "The economy has grown rapidly over the past decade."] },
        { q: "Trẻ em nên dành nhiều thời gian hơn với thiên nhiên.", hint: "Children (Ø), should spend more time, in nature (Ø)", answers: ["Children should spend more time in nature.", "Children should spend more time with nature.", "Children should spend more time close to nature.", "Kids should spend more time in nature."] },
        { q: "Hầu hết mọi người đọc tin tức trên internet.", hint: "Most people (Ø), read the news, on the internet", answers: ["Most people read the news on the internet.", "Most people read news on the internet.", "Most people read the news online."] },
      ],
    },
    {
      t: "quiz",
      id: "t3d3-the-chung-dien",
      title: "Điền the hoặc x (x = không cần mạo từ) — 8 câu",
      kind: "fill",
      items: [
        { q: "Crime is a growing problem in ___ society.", answers: ["x", "ø", "Ø", "0", "-"], hint: "society nói chung" },
        { q: "Factories release harmful gases into ___ environment.", answers: ["the"], hint: "thứ cả xã hội chia sẻ" },
        { q: "___ media often focuses on negative stories.", answers: ["The", "the"], hint: "báo đài, truyền thông" },
        { q: "Humans cannot control ___ nature.", answers: ["x", "ø", "Ø", "0", "-"], hint: "thiên nhiên nói chung" },
        { q: "Nobody can predict ___ future with certainty.", answers: ["the"], hint: "past / present / future" },
        { q: "___ unemployment tends to rise during a recession.", answers: ["x", "ø", "Ø", "0", "-"], hint: "khái niệm trừu tượng, không đếm được" },
        { q: "The museum is open to ___ public every day except Monday.", answers: ["the"], hint: "công chúng" },
        { q: "___ public transport is cheaper than driving.", answers: ["x", "ø", "Ø", "0", "-"], hint: "public là tính từ ở đây; transport không đếm được, nói chung" },
      ],
    },

    { t: "h", text: "4. the + tính từ = cả một nhóm người" },
    {
      t: "patterns",
      rows: [
        {
          formula: "the + adj + V (số nhiều)",
          vi: "**the + tính từ** (không có danh từ) chỉ **cả nhóm người** có đặc điểm đó. Động từ luôn chia **số nhiều**. Rất hay dùng trong Task 2 về xã hội.",
          examples: [
            { en: "The elderly are more likely to live alone than they were in the past.", vi: "Người cao tuổi có khả năng sống một mình cao hơn so với trước đây." },
            { en: "The gap between the rich and the poor is widening.", vi: "Khoảng cách giữa người giàu và người nghèo đang nới rộng." },
            { en: "The government should create more jobs for the unemployed.", vi: "Chính phủ nên tạo thêm việc làm cho người thất nghiệp." },
          ],
        },
      ],
    },
    {
      t: "table",
      head: ["Nhóm", "Các từ hay gặp", "Ghi nhớ"],
      rows: [
        ["Hoàn cảnh xã hội", "the rich · the wealthy · the poor · the unemployed · the homeless", "Viết được cả: **poor people**, **unemployed people** (Ø)."],
        ["Tuổi tác, sức khoẻ", "the young · the elderly · the old · the sick · the disabled", "**the elderly** lịch sự hơn the old."],
        ["Quốc tịch đuôi -sh / -ch / -ese", "the British · the French · the Japanese · the Vietnamese", "Quốc tịch khác thêm -s: **the Germans**, **the Thais**; hoặc **Vietnamese people**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~the poors~~ · ~~the elderlies~~ → **the poor**, **the elderly** — tính từ không thêm -s.",
        "~~The elderly **needs** more care.~~ → The elderly **need** more care. — nghĩa số nhiều → động từ số nhiều.",
        "Nói về **một người** thì phải có danh từ: ~~a poor~~ → **a poor person**; ~~an elderly~~ → **an elderly man / woman**.",
        "Đừng dùng cả hai: ~~the elderly people~~ khi nói chung → **the elderly** hoặc **elderly people**.",
      ],
    },
    {
      t: "rule",
      formula: "the + adj (rich / poor / elderly / young / unemployed) + V số nhiều",
      vi: "the + tính từ = cả nhóm người; không thêm -s; động từ số nhiều. Một người → a / an + adj + person.",
    },
    {
      t: "quiz",
      id: "t3d3-the-adj-dich",
      title: "Dịch nhanh — the + tính từ (3 câu)",
      kind: "translate",
      grammar: "the + adj + V số nhiều: the elderly / the poor / the rich / the young / the unemployed.",
      items: [
        { q: "Người trẻ thường thích nghi với công nghệ nhanh hơn người cao tuổi.", hint: "The young, usually adapt to, technology (Ø), faster than, the elderly", answers: ["The young usually adapt to technology faster than the elderly.", "The young usually adapt to technology more quickly than the elderly.", "The young often adapt to technology faster than the elderly.", "Young people usually adapt to technology faster than the elderly.", "Young people usually adapt to technology faster than elderly people.", "The young usually adapt to technology faster than the old."] },
        { q: "Người giàu nên đóng thuế nhiều hơn.", hint: "The rich, should pay, more tax", answers: ["The rich should pay more tax.", "The rich should pay more taxes.", "The wealthy should pay more tax.", "Rich people should pay more tax.", "The rich should pay higher taxes."] },
        { q: "Người vô gia cư cần sự giúp đỡ từ chính phủ.", hint: "The homeless, need, help, from the government", answers: ["The homeless need help from the government.", "Homeless people need help from the government.", "The homeless need support from the government."] },
      ],
    },

    { t: "h", text: "5. Danh từ có cụm chỉ rõ phía sau — the education of children" },
    {
      t: "p",
      text: "Một danh từ trừu tượng đang là Ø sẽ **đổi thành the** khi phía sau có một cụm **chỉ rõ là cái nào**: cụm **of…**, mệnh đề **that / which / who…**, hoặc cụm giới từ **in / at…**. Người đọc lúc này đã “biết cái nào” (câu hỏi ① ở mục 1).",
    },
    {
      t: "table",
      caption: "Cùng một danh từ: nói chung (Ø) → được chỉ rõ (the)",
      head: ["Nói chung — Ø", "Được chỉ rõ — the", "Phần chỉ rõ"],
      rows: [
        ["**Education** is the key to success.", "**The education of girls** has improved.", "of girls"],
        ["**History** is my favourite subject.", "**The history of Vietnam** is fascinating.", "of Vietnam"],
        ["**Life** is getting more expensive.", "**The life of a farmer** is hard.", "of a farmer"],
        ["**Water** is essential.", "**The water in this river** is polluted.", "in this river"],
        ["**Information** is easy to find online.", "**The information that you gave me** was wrong.", "that you gave me"],
        ["**People** need friends.", "**The people who live next door** are very quiet.", "who live next door"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — không phải cứ có “of” là the",
      items: [
        "Dùng **a / an** khi danh từ là **một trong nhiều** hoặc chỉ **số lượng / mức độ**: **a member of** the team · **a kind of** fruit · **a lack of** money · **a range of** courses · **a rise of** 5 % · **a total of** 300 students.",
        "**the number of** + N số nhiều + V **số ít** = **con số**: **The number of** cars **has** risen. ↔ **a number of** + N số nhiều + V **số nhiều** = **một số, vài**: **A number of** cars **were** damaged.",
        "Task 1: **the** percentage / proportion / amount / figure **of / for**… dùng the khi nói **con số xác định** trên hình: **The proportion of** students who… rose to 40 %. Nhưng có tính từ chỉ **mức** thì dùng a: **a large proportion of**, **a small percentage of**. Và: there was **a** rise / **an** increase / **a** fall **in**… (lần đầu nhắc tới một sự thay đổi).",
        "**the majority of** (đa số — hay gặp nhất; cũng gặp **a majority of**, **the vast majority of**) nhưng **a minority of**; **the rest of** · **the end of** · **the beginning of** · **the top of** — luôn the vì chỉ có một.",
      ],
    },
    {
      t: "rule",
      formula: "Ø + N chung → the + N + of / that / which / in… (đã chỉ rõ) · nhưng: a number of · a lack of · a range of · a rise of 5 %",
      vi: "Có cụm chỉ rõ cái nào → the. Chỉ số lượng, một trong nhiều → a / an.",
    },
    {
      t: "quiz",
      id: "t3d3-of-dich",
      title: "Dịch nhanh — danh từ có cụm chỉ rõ (4 câu)",
      kind: "translate",
      grammar: "the + N + of… (the number of + N số nhiều + V số ít) · a number of + N số nhiều + V số nhiều · a lack of · the quality of.",
      items: [
        { q: "Số lượng khách du lịch đã tăng gấp đôi.", hint: "The number of tourists, has doubled", answers: ["The number of tourists has doubled.", "The number of visitors has doubled.", "The number of tourists doubled."] },
        { q: "Một số sinh viên đã phàn nàn về tiếng ồn.", hint: "A number of students, (have) complained, about the noise", answers: ["A number of students have complained about the noise.", "A number of students complained about the noise.", "Several students have complained about the noise.", "Some students have complained about the noise."] },
        { q: "Chất lượng không khí ở Hà Nội đang trở nên tệ hơn.", hint: "The quality of the air / The air quality, in Hanoi, is getting worse", answers: ["The quality of the air in Hanoi is getting worse.", "The air quality in Hanoi is getting worse.", "The quality of air in Hanoi is getting worse.", "The quality of the air in Hanoi is becoming worse.", "Air quality in Hanoi is getting worse."] },
        { q: "Nhiều vấn đề là do thiếu tiền gây ra.", hint: "Many problems, are caused by, a lack of money", answers: ["Many problems are caused by a lack of money.", "Many problems are caused by lack of money.", "A lot of problems are caused by a lack of money.", "Many problems are caused by a shortage of money."] },
      ],
    },
    {
      t: "mcq",
      id: "t3d3-of-chon",
      title: "Chọn đáp án đúng — the / a / Ø trước cụm of (6 câu)",
      items: [
        { q: "___ number of people working from home has increased sharply.", options: ["A", "The", "Ø (không mạo từ)"], correct: 1, why: "Động từ **has** (số ít) → chủ ngữ là **con số** → **The number of**." },
        { q: "___ number of shops in my street have closed this year.", options: ["A", "The", "Ø (không mạo từ)"], correct: 0, why: "Động từ **have** (số nhiều), nghĩa “một số cửa hàng” → **A number of**." },
        { q: "___ history is taught in every secondary school.", options: ["The", "A", "Ø (không mạo từ)"], correct: 2, why: "Môn lịch sử **nói chung**, không có cụm chỉ rõ → **Ø**." },
        { q: "She is writing a book about ___ history of the internet.", options: ["Ø (không mạo từ)", "the", "a"], correct: 1, why: "Có cụm **of the internet** chỉ rõ lịch sử nào → **the history of**." },
        { q: "There was ___ sharp rise in house prices between 2015 and 2020.", options: ["a", "the", "Ø (không mạo từ)"], correct: 0, why: "Lần đầu nhắc tới **một** sự tăng → **a** sharp rise in. (rise đếm được số ít, không để trần.)" },
        { q: "The project failed because of ___ lack of funding.", options: ["the", "Ø (không mạo từ)", "a"], correct: 2, why: "Cụm chỉ mức độ: **a lack of** + N." },
      ],
    },

    { t: "h", text: "6. Danh từ không đếm được — không a / an, không -s" },
    {
      t: "p",
      text: "Nhiều danh từ **đếm được trong tiếng Việt** (một lời khuyên, một thông tin, một nghiên cứu) lại **không đếm được trong tiếng Anh**. Chúng không đi với a / an, không có số nhiều, và động từ chia **số ít**. Đây là nhóm lỗi làm lộ band 5 nhanh nhất trong bài viết học thuật.",
    },
    {
      t: "table",
      caption: "20 danh từ không đếm được hay gặp trong IELTS",
      head: ["Nhóm", "Danh từ", "Muốn đếm thì nói"],
      rows: [
        ["Thông tin, tri thức", "information · advice · news · knowledge · research · evidence · feedback", "**a piece of** advice / information / evidence · **a study** (một nghiên cứu)"],
        ["Đồ vật gom chung", "equipment · furniture · luggage · software · rubbish · clothing", "**a piece of** equipment / furniture · **an item of** clothing · **a program / an app**"],
        ["Hiện tượng xã hội", "traffic · pollution · progress · employment · behaviour", "**a traffic jam** · **a type of** pollution"],
        ["Việc làm, chỗ ở", "work · homework · accommodation · money", "**a job** · **a task** · **an assignment** · **a flat**"],
      ],
    },
    {
      t: "table",
      caption: "Ngoại lệ có ích: a / an + tính từ + danh từ trừu tượng",
      head: ["Cụm đúng", "Ví dụ", "Vì sao được dùng a"],
      rows: [
        ["**a good knowledge of**", "She has a good knowledge of statistics.", "Có tính từ + of: nói về **một mức** hiểu biết cụ thể."],
        ["**a deep / clear understanding of**", "Students need a clear understanding of the task.", "Như trên."],
        ["**a good education**", "Every child deserves a good education.", "education + tính từ = **một nền** giáo dục."],
        ["**an experience** ↔ **experience**", "It was an unforgettable experience. ↔ She has ten years of experience.", "**C** = một trải nghiệm · **U** = kinh nghiệm."],
        ["**a work** ↔ **work**", "a work of art ↔ I have a lot of work.", "**C** = tác phẩm · **U** = công việc."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai",
      items: [
        "~~many **researches** show~~ → **much research shows** / **many studies show**.",
        "~~an **advice**~~ · ~~some **advices**~~ → **a piece of advice** / **some advice**.",
        "~~**informations**~~ · ~~**knowledges**~~ · ~~**equipments**~~ · ~~**evidences**~~ · ~~**furnitures**~~ → không bao giờ có -s.",
        "~~The news **are** bad.~~ → The news **is** bad. — news có chữ s nhưng **không đếm được**.",
        "~~There is **a heavy traffic**.~~ → There is **heavy traffic**. / There is **a traffic jam**.",
        "~~I have **a homework**.~~ · ~~I found **a work**.~~ → **some homework** · **a job**.",
      ],
    },
    {
      t: "rule",
      formula: "N không đếm được (advice, information, research, evidence, equipment, traffic) + V số ít · không a / an · không -s",
      vi: "Muốn đếm: a piece of advice, a study, a job. Được dùng a khi có tính từ + of: a good knowledge of.",
    },
    {
      t: "quiz",
      id: "t3d3-khong-dem-dich",
      title: "Dịch nhanh — danh từ không đếm được (4 câu)",
      kind: "translate",
      grammar: "N không đếm được + V số ít; a piece of + N; much / a lot of / little + N không đếm được.",
      items: [
        { q: "Nghiên cứu cho thấy giấc ngủ cải thiện trí nhớ.", hint: "Research (Ø), shows / suggests, sleep (Ø), improves, memory (Ø)", answers: ["Research shows that sleep improves memory.", "Research shows sleep improves memory.", "Research suggests that sleep improves memory.", "Studies show that sleep improves memory.", "Research has shown that sleep improves memory."] },
        { q: "Thầy giáo đã cho tôi một lời khuyên hữu ích.", hint: "My teacher, gave me, a useful piece of advice / some useful advice", answers: ["My teacher gave me a useful piece of advice.", "My teacher gave me some useful advice.", "The teacher gave me a useful piece of advice.", "The teacher gave me some useful advice.", "My teacher gave me useful advice."] },
        { q: "Có rất ít bằng chứng cho ý kiến này.", hint: "There is, little / very little, evidence, for this idea / view", answers: ["There is little evidence for this idea.", "There is very little evidence for this idea.", "There is little evidence for this view.", "There is very little evidence for this view.", "There is little evidence for this opinion.", "There is very little evidence for this opinion.", "There is very little evidence to support this idea.", "There is little evidence to support this idea."] },
        { q: "Bệnh viện cần thiết bị mới.", hint: "The hospital, needs, new equipment", answers: ["The hospital needs new equipment.", "The hospital needs some new equipment.", "The hospital requires new equipment."] },
      ],
    },

    { t: "h", text: "7. Cụm cố định — học cả cụm, đừng suy luật" },
    {
      t: "table",
      caption: "Ba cột phải thuộc",
      head: ["Ø — không mạo từ", "the", "a / an"],
      rows: [
        ["go to **school / university / work / bed / prison** (đúng mục đích)", "go to **the** cinema / **the** theatre / **the** bank", "go for **a** walk · have **a** look · take **a** break"],
        ["**by** bus / car / train · **on** foot", "**in the** morning / afternoon / evening", "once **a** week · 60 km **an** hour · twice **a** year"],
        ["**at** night · **at** noon · **at** home · **at** work", "**in the** 1990s · **in the** past · **in the** future", "**as a** result · **as a** whole · **on a** daily basis"],
        ["**last** year · **next** month · **in** 2020 · **on** Monday", "**the** following year · **the** next day (kể chuyện quá khứ)", "**a** few · **a** little · **a** lot of · **a** great deal of"],
        ["have **breakfast / lunch / dinner** · play **football**", "play **the** piano / **the** guitar · listen to **the** radio", "play **a** role in · have **an** effect / **an** impact on"],
        ["**most** people · **both** parents · **in** society · **in** public", "**the** same · **the** only · **the** first / last · **the** most popular", "make **a** decision · make **a** difference · to **a** large extent"],
        ["watch **TV** · on **social media** · **in** general", "on **the** internet · on **the** one hand / on **the** other hand", "come to **a** conclusion · in **a** hurry · at **a** time"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — bốn cặp dễ lẫn",
      items: [
        "**Most people** agree. (đa số — Ø) ↔ It is **the most** popular sport. (so sánh nhất — the). ~~The most people agree~~ là sai.",
        "**last year** = năm ngoái (tính từ bây giờ, Ø) ↔ **the last year** of university = năm cuối. ~~I visited Hue the last year~~ là sai.",
        "He went **to prison** (đi tù) ↔ She went **to the prison** to visit him (tới toà nhà nhà tù). Tương tự: go to **school** (đi học) ↔ go to **the school** (tới ngôi trường vì việc khác).",
        "**play a role** / **an important role** in — luôn có a / an. ~~Technology plays important role~~ là lỗi rất hay gặp ở câu mở bài Task 2.",
      ],
    },
    {
      t: "rule",
      formula: "Ø: in society · most people · last year · by bus · at night · the: in the 1990s · the same · the internet · a: play a role in · as a result · have an impact on",
      vi: "Cụm cố định không theo luật — thuộc cả cụm rồi dùng nguyên khối.",
    },
    {
      t: "quiz",
      id: "t3d3-cum-co-dinh-dich",
      title: "Dịch nhanh — cụm cố định (4 câu)",
      kind: "translate",
      grammar: "most + N (Ø) · in the 1990s · play a(n) + adj + role in · as a result · last year (Ø) · by + phương tiện (Ø).",
      items: [
        { q: "Hầu hết sinh viên đi học bằng xe máy.", hint: "Most students (Ø), go to university / school, by motorbike", answers: ["Most students go to university by motorbike.", "Most students go to school by motorbike.", "Most students travel to university by motorbike.", "Most students go to class by motorbike.", "Most students go to college by motorbike."] },
        { q: "Cha mẹ đóng một vai trò then chốt trong việc giáo dục con cái.", hint: "Parents (Ø), play a key role, in the education of their children / in educating their children", answers: ["Parents play a key role in the education of their children.", "Parents play a key role in educating their children.", "Parents play a key role in their children's education.", "Parents play a vital role in the education of their children.", "Parents play a crucial role in educating their children.", "Parents play a key role in children's education."] },
        { q: "Năm ngoái giá cả tăng; kết quả là nhiều người tiêu ít hơn.", hint: "Last year (Ø), prices rose; as a result, many people, spent less", answers: ["Last year prices rose; as a result, many people spent less.", "Last year, prices rose; as a result, many people spent less.", "Prices rose last year; as a result, many people spent less.", "Last year prices rose. As a result, many people spent less.", "Last year, prices rose. As a result, many people spent less.", "Last year prices increased; as a result, many people spent less.", "Prices rose last year. As a result, many people spent less."] },
        { q: "Vào những năm 1990, rất ít người có máy tính.", hint: "In the 1990s, very few people, had / owned, a computer", answers: ["In the 1990s, very few people had a computer.", "In the 1990s very few people had a computer.", "In the 1990s, very few people owned a computer.", "In the 1990s, very few people had computers.", "In the 1990s, few people had a computer.", "Very few people had a computer in the 1990s.", "In the 1990s, very few people owned computers."] },
      ],
    },

    { t: "h", text: "8. Bảng tự soát mạo từ — 4 bước, 2 phút cuối bài viết" },
    {
      t: "sodo",
      kind: "flow",
      title: "Soát mạo từ sau khi viết xong (nâng cấp từ mẹo 1 phút của T2 N1)",
      steps: [
        { label: "① Gạch dưới mọi **danh từ đếm được số ít**", sub: "Chữ nào đứng trần (không a / the / my / this / each…) = **lỗi chắc chắn**. Thêm a / the hoặc đổi sang số nhiều." },
        { label: "② Khoanh mọi chữ **the**", sub: "Hỏi: người đọc biết cái nào chưa? Câu nói chung với **số nhiều / không đếm được** mà có the → xoá (trừ nhóm mục 3: the environment, the government…)." },
        { label: "③ Tìm **6 từ đen**: society · nature · people · research · information · advice", sub: "Không the society / the nature (nói chung); không a / an, không -s với research, information, advice, evidence, equipment." },
        { label: "④ Soát **cụm cố định** và cụm **of**", sub: "play **a** role · as **a** result · **the** number of · **the** same · **most** people · in **the** 1990s · so sánh nhất có the." },
      ],
      caption: "Bốn bước này bắt được khoảng 8/10 lỗi mạo từ trong một bài band 5.5. Tập 3 Ngày 27 sẽ ghép nó vào bảng tự soát 6 lượt.",
    },
    {
      t: "p",
      text: "Áp dụng ngay: đoạn thân bài Task 2 dưới đây (đề về tội phạm vị thành niên) có **10 chỗ trống**. Điền **a / an / the** hoặc **x** (không cần mạo từ).",
    },
    {
      t: "quiz",
      id: "t3d3-soat-doan",
      title: "Soát một đoạn thân bài — điền a / an / the / x (10 chỗ)",
      kind: "fill",
      items: [
        { q: "(1) In many countries, ___ number of young offenders has risen in recent years.", answers: ["the"], hint: "has = số ít → con số" },
        { q: "(2) One reason is that ___ teenagers spend less time with their parents than before.", answers: ["x", "ø", "Ø", "0", "-"], hint: "thanh thiếu niên nói chung" },
        { q: "(3) Parents play ___ essential role in teaching children right from wrong.", answers: ["an"], hint: "play a / an … role; essential bắt đầu bằng nguyên âm" },
        { q: "(4) When both parents work long hours, children get little ___ advice at home.", answers: ["x", "ø", "Ø", "0", "-"], hint: "advice không đếm được" },
        { q: "(5) Another cause is ___ internet, where violent content is easy to find.", answers: ["the"], hint: "nhóm luôn the" },
        { q: "(6) ___ research suggests that such content can influence behaviour.", answers: ["x", "ø", "Ø", "0", "-"], hint: "research không đếm được, nói chung" },
        { q: "(7) In my view, ___ government should fund more youth clubs.", answers: ["the"], hint: "nhóm luôn the" },
        { q: "(8) These clubs give ___ young a safe place to spend their evenings.", answers: ["the"], hint: "the + tính từ = cả nhóm người" },
        { q: "(9) As ___ result, fewer teenagers would be on the streets at night.", answers: ["a"], hint: "cụm cố định" },
        { q: "(10) This would benefit not only families but also ___ society as a whole.", answers: ["x", "ø", "Ø", "0", "-"], hint: "society nói chung" },
      ],
    },
    {
      t: "table",
      caption: "Mạo từ trong ba chủ đề Speaking hôm nay (dùng ở Bài 3)",
      head: ["Chủ đề", "Cụm đúng", "Hay nói sai thành"],
      rows: [
        ["**Weather**", "**the** weather · **the** rainy season · **in the** north · **in** summer · **a** hot day · **the** sun", "~~weather is hot~~ · ~~in the summer of every year~~ (dài, thừa)"],
        ["**Shopping**", "go **shopping** (Ø) · **at the** supermarket · **at a** local market · shop **online** · **on the** internet", "~~go to shopping~~ · ~~go to the shopping~~"],
        ["**Clothes**", "wear **a** uniform · **a** pair of jeans · **Ø** clothes (luôn số nhiều) · **the** same style", "~~a clothes~~ · ~~an uniform~~ (uniform đọc /juː/ → a)"],
      ],
    },
    {
      t: "mcq",
      id: "t3d3-tong-hop-chon",
      title: "Kiểm tra cuối bài — 10 câu",
      items: [
        { q: "___ bicycle is one of the cheapest forms of transport ever invented.", options: ["The", "Ø (không mạo từ)", "Some", "An"], correct: 0, why: "Nói về cả loại như **một phát minh** → **The bicycle** (the + số ít, văn phong học thuật). Để trần là sai vì bicycle đếm được số ít." },
        { q: "Too much screen time can damage ___ health of young children.", options: ["a", "Ø (không mạo từ)", "the", "an"], correct: 2, why: "Có cụm **of young children** chỉ rõ → **the health of**. Không có cụm of thì Ø: damage children’s **health**." },
        { q: "Many people believe that ___ prison does not reduce crime.", options: ["a", "Ø (không mạo từ)", "the", "an"], correct: 1, why: "Nhà tù như **một hình phạt** (thiết chế, nói chung) → **Ø prison**, giống go to prison." },
        { q: "The elderly ___ often less confident about using online banking.", options: ["is", "was", "has", "are"], correct: 3, why: "**the + tính từ** = cả nhóm người → động từ **số nhiều**: are." },
        { q: "We need more ___ before we can draw a conclusion.", options: ["evidences", "an evidence", "evidence", "the evidences"], correct: 2, why: "**evidence** không đếm được: không -s, không a / an." },
        { q: "___ most people in my country go to work by motorbike.", options: ["Ø (không mạo từ)", "The", "A", "An"], correct: 0, why: "**Most people** = đa số → Ø. **the most** chỉ dùng cho so sánh nhất." },
        { q: "Tourism has had ___ enormous impact on the local economy.", options: ["a", "the", "Ø (không mạo từ)", "an"], correct: 3, why: "Cụm cố định **have an impact on**; **enormous** bắt đầu bằng nguyên âm → **an**." },
        { q: "Young people today are under great pressure from ___ society.", options: ["a", "Ø (không mạo từ)", "the", "an"], correct: 1, why: "**society** nói chung → Ø. (Có phần chỉ rõ mới the: the society they live in.)" },
        { q: "A number of studies ___ that exercise reduces stress.", options: ["shows", "has shown", "have shown", "is showing"], correct: 2, why: "**A number of** + N số nhiều = “một số” → động từ **số nhiều**: have shown. (The number of… has…)" },
        { q: "In ___ 1980s, very few households had a personal computer.", options: ["Ø (không mạo từ)", "a", "an", "the"], correct: 3, why: "Thập niên luôn có the: **in the 1980s**. (Một năm thì Ø: in 1985.)" },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 2 · Reading ─────────────────────────── */

const T3D3_READING: Lesson = {
  id: "t3d3-doc",
  kind: "reading",
  title: "Reading: True / False / Not Given 3 + paraphrase hệ thống (8 phép)",
  goal: "Gọi tên được 8 phép paraphrase mà đề dùng để “nói lại” bài đọc, đối chiếu từng mảnh của nhận định với bài, tránh thêm 4 bẫy mức band 6, và làm đúng ≥ 10/13 câu TFNG trong 20 phút với một bài đọc ~800 từ.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy **Reading** từ 5 lên 6 (23/40 câu). Khác biệt lớn nhất giữa hai band: band 5 nhận ra paraphrase **đồng nghĩa**; band 6 phải bắt được paraphrase **đổi loại từ và đổi cấu trúc**.",
        "TFNG **vòng 3**: Tập 1 Ngày 12 (sơ đồ 2 câu hỏi) → Tập 2 Ngày 6 (5 bẫy cơ bản) → hôm nay: bài dài gấp đôi, thêm **4 bẫy band 6**, và cách **đối chiếu từng mảnh**.",
        "Paraphrase **hệ thống**: Tập 2 Ngày 8 dạy 3 cách, Tập 3 Ngày 1 xếp thành 4 mức. Hôm nay chia nhỏ thành **8 phép** có tên — gặp câu hỏi là gọi được tên phép.",
        "Một nhận định TFNG có 3 mảnh: ==**ai / cái gì** · **làm gì / thế nào** · **từ giới hạn** (all, first, quickly, because…)==. Sai **một mảnh** là không còn TRUE.",
        "Bài đọc tự soạn: **The Box That Shrank the World** (lịch sử container tàu biển, ~800 từ, 13 câu).",
      ],
    },

    { t: "h", text: "1. Ôn nhanh: TRUE · FALSE · NOT GIVEN và 5 bẫy của Tập 2" },
    {
      t: "table",
      caption: "Ôn từ T2 N6 — năm bẫy cơ bản",
      head: ["Bẫy", "Dấu hiệu trong câu hỏi", "Thường là"],
      rows: [
        ["① Từ trùng, khác ý", "Chép đúng từ của bài nhưng ghép thành ý khác", "NOT GIVEN / FALSE"],
        ["② Từ mức độ", "all · every · only · always · never · most", "FALSE"],
        ["③ So sánh không có trong bài", "more than · the largest · the first · better than", "NOT GIVEN"],
        ["④ Thêm lý do / chi tiết", "because · in order to · originally · by + ai đó", "NOT GIVEN"],
        ["⑤ Trái nghĩa / phủ định", "fewer ↔ more · rare ↔ common · thêm / bớt not", "FALSE"],
      ],
    },
    {
      t: "rule",
      formula: "Bài KHÔNG nói về ý này → NOT GIVEN · Bài nói GIỐNG → TRUE · Bài nói NGƯỢC → FALSE",
      vi: "FALSE cần bằng chứng ngược trong bài. Không tìm ra bằng chứng nào (cả giống lẫn ngược) mới là NOT GIVEN.",
    },

    { t: "h", text: "2. Paraphrase hệ thống — 8 phép có tên" },
    {
      t: "p",
      text: "**Paraphrase** = diễn đạt lại cùng một ý bằng lời khác. Người ra đề **không bao giờ** chép nguyên câu của bài vào câu hỏi; họ dùng một (hoặc hai, ba) trong 8 phép dưới đây. Biết tên phép có ích ở hai chỗ: khi **đọc** (nhận ra câu hỏi và câu trong bài là một), và khi **viết** (tự paraphrase đề ở mở bài Task 1, Task 2 — dùng lại chính 8 phép này).",
    },
    {
      t: "table",
      caption: "8 phép paraphrase — kèm mức tương ứng trong 4 mức của Ngày 1 (① đồng nghĩa · ② đổi loại từ · ③ đổi cấu trúc · ④ ý ẩn)",
      head: ["Mức (Ngày 1)", "Phép", "Trong bài", "Trong câu hỏi"],
      rows: [
        ["**① Đồng nghĩa**", "**P1 Đồng nghĩa**", "A **vessel** could spend **as long** in port as at sea.", "A **ship** might stay in port **for about as much time** as it spent sailing."],
        ["**③ Đổi cấu trúc**", "**P2 Trái nghĩa + phủ định**", "The idea spread **slowly**.", "The idea did **not** spread **quickly**."],
        ["**② Đổi loại từ**", "**P3 Đổi loại từ**", "The unions **resisted** the change.", "There was **resistance** from the unions."],
        ["**③ Đổi cấu trúc**", "**P4 Chủ động ↔ bị động / đổi chủ ngữ**", "His company **was hired** by the military.", "The military **hired** his company."],
        ["**③ Đổi cấu trúc**", "**P5 Đảo chiều so sánh**", "Machines were far **cheaper than** hand loading.", "Hand loading was much **more expensive than** machines."],
        ["**①** (đổi thẳng) · **④** (phải tự tính)", "**P6 Con số ↔ lời**", "**fifty-eight** containers · 16 cents against 6 dollars", "**nearly sixty** containers · **a small fraction** of the cost"],
        ["**①** (cụm cùng nghĩa, rộng hơn)", "**P7 Cụ thể ↔ khái quát**", "**sacks of coffee, barrels of oil, crates of machine parts**", "**goods of many different kinds**"],
        ["**④ Ý ẩn**", "**P8 Ý suy ra**", "a **converted oil tanker**", "a ship that was **not originally built** for containers"],
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng bảng 8 phép",
      items: [
        "Gặp câu hỏi có **số, phân số, %** → nghĩ ngay **P6**: đề hay đổi 25 % ↔ a quarter ↔ one in four; 58 ↔ nearly sixty; “gấp ba” ↔ three times.",
        "Gặp câu hỏi có **not, never, fail to, lack** → nghĩ **P2**: tìm từ **trái nghĩa** trong bài (slowly ↔ not quickly; common ↔ not rare).",
        "Gặp câu hỏi có **danh từ trừu tượng** (resistance, growth, standardisation, agreement) → nghĩ **P3**: bài có thể dùng **động từ** (resisted, grew, standardised, agreed).",
        "**P8 không phải đoán mò**: ý suy ra phải **chắc chắn đúng** từ chữ trong bài (tàu chở dầu được hoán cải ⇒ chắc chắn không phải đóng để chở container). Nếu phải “đoán thêm” mới ra thì đó là NOT GIVEN.",
      ],
    },
    {
      t: "mcq",
      id: "t3d3-doc-phep",
      title: "Nhận ra phép paraphrase (6 câu)",
      items: [
        { q: "Bài: “Theft was common at the docks.” → Câu hỏi: “Theft at the docks was not rare.”", options: ["P1 Đồng nghĩa", "P2 Trái nghĩa + phủ định", "P4 Bị động", "P7 Cụ thể ↔ khái quát"], correct: 1, why: "**common** ↔ **not rare**: lấy từ trái nghĩa (rare) rồi thêm **not** — phép P2. Nghĩa không đổi → TRUE." },
        { q: "Bài: “Three in ten ports had adopted the system.” → Câu hỏi: “Fewer than half of the ports used the system.”", options: ["P6 Con số ↔ lời", "P3 Đổi loại từ", "P5 Đảo chiều so sánh", "P1 Đồng nghĩa"], correct: 0, why: "**three in ten** = 30 % → **fewer than half**: đổi con số thành lời (P6). Phải tự tính: 30 % < 50 % → TRUE." },
        { q: "Bài: “Shipping lines standardised the size of the boxes.” → Câu hỏi: “The standardisation of box sizes was carried out by shipping lines.”", options: ["P2 Trái nghĩa + phủ định", "P8 Ý suy ra", "P3 Đổi loại từ + P4 Bị động", "P7 Cụ thể ↔ khái quát"], correct: 2, why: "**standardised** (động từ) → **standardisation** (danh từ) là P3; câu chuyển sang bị động (**was carried out by**) là P4. Một câu hỏi thường dùng **hai phép cùng lúc**." },
        { q: "Bài: “Rail was slower than road transport.” → Câu hỏi: “Road transport was faster than rail.”", options: ["P1 Đồng nghĩa", "P6 Con số ↔ lời", "P8 Ý suy ra", "P5 Đảo chiều so sánh"], correct: 3, why: "Đổi chỗ hai vật được so sánh và dùng tính từ trái nghĩa (slower ↔ faster) — P5. Nghĩa giữ nguyên." },
        { q: "Bài: “Ships, trains and lorries could all carry the same box.” → Câu hỏi: “The same box could be moved by different forms of transport.”", options: ["P7 Cụ thể ↔ khái quát", "P2 Trái nghĩa + phủ định", "P5 Đảo chiều so sánh", "P6 Con số ↔ lời"], correct: 0, why: "**ships, trains and lorries** (cụ thể) → **different forms of transport** (khái quát) — P7. Kèm P4 (could be moved)." },
        { q: "Bài: “The port closed in 1981, five years after the new terminal opened.” → Câu hỏi: “The new terminal opened in 1976.”", options: ["P3 Đổi loại từ", "P1 Đồng nghĩa", "P8 Ý suy ra (tự tính)", "P4 Bị động"], correct: 2, why: "Bài không viết “1976”, nhưng 1981 − 5 = 1976 là **chắc chắn** → P8 (kèm P6). Ý suy ra bằng phép tính vẫn là TRUE." },
      ],
    },
    {
      t: "rule",
      formula: "P1 đồng nghĩa · P2 trái nghĩa + not · P3 đổi loại từ · P4 bị động · P5 đảo so sánh · P6 số ↔ lời · P7 cụ thể ↔ khái quát · P8 ý suy ra chắc chắn",
      vi: "Câu hỏi = câu trong bài đi qua 1–3 phép. Gọi được tên phép là tìm được câu chứa đáp án.",
    },

    { t: "h", text: "3. Đối chiếu từng mảnh — quy trình 4 bước cho mỗi câu" },
    {
      t: "sodo",
      kind: "flow",
      title: "Mỗi nhận định: 4 bước, khoảng 90 giây",
      steps: [
        { label: "① Chẻ nhận định thành **3 mảnh**", sub: "**Ai / cái gì** · **làm gì / thế nào** · **từ giới hạn** (all, only, first, quickly, because, more than…). Gạch dưới từ giới hạn." },
        { label: "② **Định vị** bằng từ không đổi", sub: "Tên riêng, năm, con số ít bị paraphrase — dò chúng trước. Câu hỏi đi **theo thứ tự bài**, nên đáp án câu 5 nằm sau đáp án câu 4." },
        { label: "③ **Đối chiếu từng mảnh** với 1–2 câu trong bài", sub: "Mảnh nào khớp (qua phép P1–P8)? Mảnh nào ngược? Mảnh nào bài **không nhắc**?" },
        { label: "④ **Quyết định**", sub: "Cả 3 mảnh khớp → TRUE · có mảnh **ngược** → FALSE · có mảnh bài **không nói** (và không mảnh nào ngược) → NOT GIVEN." },
      ],
      caption: "Quá 2 phút chưa xong một câu: đánh dấu, chọn tạm, đi tiếp. Câu sau sẽ cho bạn biết vị trí của câu trước.",
    },
    {
      t: "table",
      caption: "Ví dụ chẻ mảnh — bài: “In 2019, about a third of the city’s buses were electric.”",
      head: ["Nhận định", "Mảnh có vấn đề", "Đáp án"],
      rows: [
        ["Roughly one in three of the city’s buses ran on electricity in 2019.", "Không có — a third = one in three (P6), electric = ran on electricity (P3).", "**TRUE**"],
        ["**Most** of the city’s buses were electric in 2019.", "Từ giới hạn: most (> 50 %) ↔ a third (33 %) — **ngược**.", "**FALSE**"],
        ["The city’s electric buses were **cheaper to run** than diesel ones.", "Mảnh “làm gì”: chi phí vận hành — bài **không nhắc**.", "**NOT GIVEN**"],
        ["The city **began buying** electric buses in 2019.", "Bài nói năm 2019 **đã có** một phần ba; không nói **bắt đầu** mua khi nào.", "**NOT GIVEN**"],
      ],
    },

    { t: "h", text: "4. Bốn bẫy mức band 6 (thêm vào 5 bẫy của Tập 2)" },
    {
      t: "table",
      head: ["Bẫy", "Trông như thế nào", "Ví dụ (bài ↔ câu hỏi)", "Đáp án"],
      rows: [
        ["⑥ **Đúng một nửa**", "Nhận định có **hai vế**; một vế khớp bài, vế kia ngược hoặc không có.", "Bài: “Experts **disagree about how much**, but few doubt it played a part.” ↔ “Experts **agree** it was the **main** cause.”", "FALSE (vế ngược) / NG (vế không có)"],
        ["⑦ **Đổi chủ thể**", "Việc đó **có** trong bài, nhưng do **người / vật khác** làm.", "Bài: “**Railways** had tried metal boxes decades earlier.” ↔ “**McLean** was the first to use metal boxes.”", "FALSE"],
        ["⑧ **Lời kể ↔ sự thật / dự định ↔ đã làm**", "Bài dùng **is said to, may, plans to, hoped to**; câu hỏi nói như chuyện **đã chắc chắn xảy ra** — hoặc ngược lại.", "Bài: “The firm **plans to** open a second port.” ↔ “The firm **has opened** a second port.”", "FALSE"],
        ["⑨ **Kiến thức ngoài bài**", "Điều bạn **biết là đúng ngoài đời** nhưng bài không viết.", "Bài không nhắc quy mô cảng ↔ “It is now the country’s **largest** port.”", "NOT GIVEN"],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — FALSE hay NOT GIVEN?",
      items: [
        "Tự hỏi: **“Tôi chỉ được câu nào trong bài nói NGƯỢC lại không?”** Chỉ được → FALSE. Không chỉ được câu nào → NOT GIVEN.",
        "Bẫy ⑥: đọc **hết nhận định** rồi mới chọn. Vế đầu khớp làm bạn muốn chọn TRUE ngay — vế sau mới là chỗ gài.",
        "Bẫy ⑨ đau nhất với người **biết nhiều**: đề thi kiểm tra bạn **đọc bài**, không kiểm tra kiến thức. Bài không viết thì là NOT GIVEN, kể cả khi ngoài đời nó đúng.",
        "Một đề 13 câu thường có **cả ba loại**, mỗi loại ít nhất 3 câu. Nếu bạn chọn 9 câu TRUE thì gần như chắc chắn đã đọc ẩu.",
      ],
    },

    { t: "h", text: "5. Bài đọc — The Box That Shrank the World" },
    {
      t: "p",
      text: "Làm như thi thật: **20 phút** cho 13 câu. Skim bố cục khoảng 3 phút (vẽ “bản đồ bài”: mỗi đoạn nói về gì — kỹ năng của Ngày 1), đọc **câu hỏi trước**, rồi mới đọc kỹ từng chỗ. Chưa xem giải thích cho tới khi làm xong.",
    },
    {
      t: "passage",
      title: "The Box That Shrank the World",
      intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
      paras: [
        { label: "A", text: "For most of human history, moving goods across the sea was slow, costly and surprisingly risky. Until the middle of the twentieth century, cargo of every kind – sacks of coffee, barrels of oil, crates of machine parts – was carried on and off ships piece by piece by gangs of dockworkers. A vessel could spend as long in port as it did at sea, and theft and breakage were so common that insurers treated them as a normal cost of trade. For many products, shipping was simply too expensive to be worth the trouble, so most factories sold their goods close to where they were made." },
        { label: "B", text: "The person usually credited with changing this was not a sailor or an engineer but an American trucking businessman, Malcolm McLean. Sitting in his lorry at a port in the 1930s, waiting hours for his load to be taken apart and carried aboard, he is said to have wondered why the whole trailer could not simply be lifted onto the ship. Metal boxes for freight were not his invention – railways in Britain and the United States had experimented with them decades earlier. What McLean understood was that the box itself mattered less than the system around it: ships, cranes, lorries and ports all had to be redesigned to handle a container of one agreed shape." },
        { label: "C", text: "In April 1956, a converted oil tanker called the Ideal X sailed from Newark, New Jersey, to Houston, Texas, with fifty-eight containers on its deck. The economics were startling. Loading loose cargo by hand cost almost six dollars a ton at the time; McLean’s accountants calculated that loading the Ideal X had cost less than sixteen cents a ton. Even so, the idea spread slowly at first. Many shipping lines doubted that the savings were real, and each company that did adopt containers built them to its own dimensions, so one firm’s boxes would not fit another firm’s ships or cranes." },
        { label: "D", text: "The strongest resistance came from the docks themselves. Dockworkers’ unions on both sides of the Atlantic saw, correctly, that containers would destroy thousands of jobs, and they fought the new method with strikes and with rules that limited how the boxes could be handled. In several ports, agreements were eventually reached under which employers paid into funds that guaranteed an income for workers who were no longer needed. Elsewhere the conflict simply moved the business. London’s historic docks, where the unions were powerful and the quays were too cramped for the new cranes, lost their traffic to Felixstowe, then a small harbour on England’s east coast with no such history." },
        { label: "E", text: "Two developments in the 1960s turned a promising experiment into a global system. The first was standardisation. After years of argument, international agreement was reached on a small number of sizes, including the twenty-foot and forty-foot boxes still used today, so that any container could travel on any ship, train or lorry. The second was war. When the United States military struggled to supply its forces in Vietnam, McLean’s company was hired to deliver equipment in containers. Rather than send the ships home empty, he had them call at Japanese ports on the return voyage and fill up with goods for American consumers, opening a trade route that would later become one of the busiest in the world." },
        { label: "F", text: "The consequences reached far beyond the shipping industry. Once transport costs became a tiny fraction of a product’s price, manufacturers no longer needed to be near their customers. A company could design a product in one country, make its parts in several others and assemble it in yet another. Economists disagree about how much of the growth in world trade since the 1960s should be credited to the container rather than to falling import taxes, but few doubt that it played a major part. Not everyone gained: factory towns in wealthy countries lost work to regions where wages were lower, and old port cities were left with empty warehouses and silent waterfronts." },
        { label: "G", text: "Today the largest container ships can carry the equivalent of more than twenty thousand twenty-foot boxes and are operated by crews of fewer than thirty people. The system has become so efficient that it is almost invisible; most consumers never think about how a pair of shoes reached the shop. Yet its weaknesses have recently become harder to ignore. When a single giant vessel blocked the Suez Canal for six days in 2021, hundreds of ships were held up and deliveries were delayed around the world. The steel box made global trade cheap, but it also made it dependent on a small number of crowded routes." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–13.** Do the following statements agree with the information given in the reading passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this.",
    },
    {
      t: "mcq",
      id: "t3d3-doc-tfng",
      title: "Questions 1–13 — True / False / Not Given",
      items: [
        { q: "1. Before containers were introduced, a ship might be in port for about as much time as it spent sailing.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "A: “A vessel could **spend as long in port as it did at sea**.” vessel = ship (P1); as long… as = about as much time as (P1); at sea = sailing (P1 — cụm cùng nghĩa). Cả 3 mảnh khớp → **TRUE**." },
        { q: "2. Before containers were introduced, it was unusual for cargo to be damaged.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "A: “theft and **breakage were so common** that insurers treated them as a normal cost of trade.” breakage (danh từ) = cargo to be damaged (động từ bị động — P3); **common ↔ unusual** — ngược → **FALSE** (bẫy ⑤ trái nghĩa)." },
        { q: "3. Malcolm McLean was the first person to transport freight in metal boxes.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "B: “Metal boxes for freight were **not his invention** – **railways**… had experimented with them **decades earlier**.” Việc dùng hộp kim loại có trong bài, nhưng **đường sắt** làm trước → **FALSE** (bẫy ⑦ đổi chủ thể + từ giới hạn **the first**)." },
        { q: "4. The railway companies made a profit from their early experiments with containers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "B chỉ nói đường sắt **đã thử nghiệm** (had experimented). Lãi hay lỗ — bài **không nhắc** → **NOT GIVEN** (bẫy ④ thêm chi tiết)." },
        { q: "5. The Ideal X had been built specially for carrying containers.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "C: “a **converted oil tanker** called the Ideal X.” converted = được hoán cải từ tàu chở dầu ⇒ chắc chắn **không** được đóng riêng để chở container (P8) → **FALSE**." },
        { q: "6. Loading the Ideal X cost only a small fraction of what loading by hand cost.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "C: loading by hand “**almost six dollars** a ton” ↔ the Ideal X “**less than sixteen cents** a ton”. 16 cent so với gần 600 cent ≈ 1/37 → a small fraction (P6 con số ↔ lời) → **TRUE**." },
        { q: "7. McLean’s company lost money during its first year of container shipping.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "C nói ý tưởng **lan chậm** và các hãng khác nghi ngờ; không có chữ nào về **lãi / lỗ của công ty McLean** → **NOT GIVEN**. Đừng suy từ “spread slowly” ra “lost money” — đó là đoán thêm, không phải P8." },
        { q: "8. The dockworkers’ unions were right to believe that containers would reduce employment.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "D: unions “**saw, correctly**, that containers would **destroy thousands of jobs**.” saw, correctly = were right to believe (P8/P1); destroy jobs = reduce employment (P3) → **TRUE**. Một chữ **correctly** quyết định cả câu." },
        { q: "9. Felixstowe is now the largest port in Britain.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "D chỉ nói London **mất hàng vào tay** Felixstowe, “**then** a small harbour” (hồi đó). Bài không so quy mô Felixstowe **ngày nay** với cảng nào → **NOT GIVEN** (bẫy ⑨ kiến thức ngoài bài + bẫy ③ so sánh nhất)." },
        { q: "10. International agreement on container sizes was reached quickly.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "E: “**After years of argument**, international agreement was reached.” years of argument ↔ quickly — ngược → **FALSE** (từ giới hạn **quickly**)." },
        { q: "11. Ships returning from Vietnam carried Japanese products to the United States.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "E: “he had them **call at Japanese ports on the return voyage** and **fill up with goods for American consumers**.” return voyage = returning (P3); goods for American consumers = products to the United States (P1/P7) → **TRUE**." },
        { q: "12. Economists agree that the container was the main cause of the growth in world trade.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "F: “Economists **disagree about how much**… should be credited to the container…, but few doubt that it played **a major part**.” Vế “đóng vai trò lớn” gần khớp, nhưng **agree ↔ disagree** và **the main cause ↔ a major part** đều lệch → **FALSE** (bẫy ⑥ đúng một nửa)." },
        { q: "13. The blockage of the Suez Canal in 2021 was caused by bad weather.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "G: “a single giant vessel **blocked** the Suez Canal for six days in 2021.” Bài nói **cái gì** chắn kênh và hậu quả, không nói **vì sao** con tàu chắn kênh → **NOT GIVEN** (bẫy ④ thêm lý do + bẫy ⑨)." },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại 13 câu",
      items: [
        "Phân bố: **TRUE** 1, 6, 8, 11 · **FALSE** 2, 3, 5, 10, 12 · **NOT GIVEN** 4, 7, 9, 13 — đủ cả ba loại, không loại nào dưới 4 câu.",
        "Đúng **≥ 10/13**: đạt mức band 6 cho dạng này. **7–9**: xem lại mục 3 (chẻ mảnh) rồi làm lại các câu sai mà không nhìn giải thích. **≤ 6**: ôn Tập 2 Ngày 6, sau đó làm lại bài này sau 2 ngày.",
        "Câu 5 và 8 là hai câu **P8 ý suy ra**: chỉ **một chữ** trong bài (converted · correctly) mang đáp án. Đọc lướt quá nhanh là mất.",
        "Câu 7 và 9 là hai câu dễ nhầm sang FALSE / TRUE vì bạn **đoán thêm** hoặc **biết ngoài đời**. Luật: không chỉ được câu nào trong bài → NOT GIVEN.",
      ],
    },
    {
      t: "table",
      caption: "Soi paraphrase — câu hỏi đã “nói lại” bài bằng phép nào",
      head: ["Câu", "Trong bài", "Trong câu hỏi", "Phép"],
      rows: [
        ["1", "spend as long in port as it did at sea", "in port for about as much time as it spent sailing", "P1 (cả ba mảnh)"],
        ["2", "breakage were so common", "unusual for cargo to be damaged", "P3 + trái nghĩa (→ FALSE)"],
        ["5", "a converted oil tanker", "built specially for carrying containers", "P8 (→ FALSE)"],
        ["6", "almost six dollars ↔ less than sixteen cents a ton", "a small fraction of what loading by hand cost", "P6"],
        ["8", "saw, correctly, that containers would destroy thousands of jobs", "were right to believe that containers would reduce employment", "P8 + P3"],
        ["10", "After years of argument, … agreement was reached", "agreement… was reached quickly", "trái nghĩa (→ FALSE)"],
        ["11", "call at Japanese ports on the return voyage… goods for American consumers", "returning… carried Japanese products to the United States", "P3 + P7"],
        ["12", "disagree about how much… played a major part", "agree… the main cause", "trái nghĩa + mức độ (→ FALSE)"],
      ],
    },
    {
      t: "quiz",
      id: "t3d3-doc-viet-lai",
      title: "Tự paraphrase — viết lại bằng phép cho sẵn (5 câu)",
      kind: "translate",
      grammar: "P2: adj → not + adj trái nghĩa · P3: V → N (resist → resistance, grow → growth) · P4: S + V + O → O + be + V3 + by S · P5: A is cheaper than B → B is more expensive than A.",
      items: [
        { q: "P4 (bị động): “The military hired McLean’s company.”", hint: "McLean’s company was hired by…", answers: ["McLean's company was hired by the military.", "McLean’s company was hired by the military."] },
        { q: "P5 (đảo so sánh): “Sea transport is cheaper than air transport.”", hint: "Air transport is more expensive than…", answers: ["Air transport is more expensive than sea transport.", "Air transport is more costly than sea transport.", "Air transport costs more than sea transport."] },
        { q: "P2 (trái nghĩa + not): “The idea spread slowly.” — dùng quickly", hint: "The idea did not spread…", answers: ["The idea did not spread quickly.", "The idea didn't spread quickly."] },
        { q: "P3 (động từ → danh từ): “World trade grew rapidly.” — bắt đầu bằng There was", hint: "There was rapid growth in…", answers: ["There was rapid growth in world trade.", "There was a rapid growth in world trade.", "There was a rapid increase in world trade.", "There was a rapid rise in world trade."] },
        { q: "P4 (bị động): “Dockworkers carried the cargo onto the ships.”", hint: "The cargo was carried onto the ships by…", answers: ["The cargo was carried onto the ships by dockworkers.", "The cargo was carried onto ships by dockworkers.", "The cargo was carried onto the ships by the dockworkers."] },
      ],
    },
    { t: "h", text: "6. Từ vựng hữu ích từ bài đọc" },
    {
      t: "vocab",
      items: [
        { w: "cargo", pos: "n", ipa: "/ˈkɑːɡəʊ/", vi: "hàng hoá chở trên tàu, máy bay", ex: "The ship was carrying a cargo of rice.", exVi: "Con tàu đang chở một lô gạo.", more: "Gần nghĩa: **freight** /freɪt/ (hàng vận chuyển nói chung, không đếm được). **a cargo ship** = tàu hàng." },
        { w: "vessel", pos: "n", ipa: "/ˈvesl/", vi: "tàu thuyền (trang trọng)", ex: "Fishing vessels are not allowed in this area.", exVi: "Tàu cá không được phép vào khu vực này.", more: "Trong bài đọc học thuật, **vessel** thay cho ship để tránh lặp — phép P1." },
        { w: "credit", pos: "v", ipa: "/ˈkredɪt/", vi: "ghi công, cho là nhờ", ex: "She is credited with inventing the device.", exVi: "Bà được ghi công phát minh ra thiết bị đó.", more: "**be credited with** + V-ing / N · **credit sth to sb**. Danh từ: **take the credit for**." },
        { w: "adopt", pos: "v", ipa: "/əˈdɒpt/", vi: "áp dụng, tiếp nhận (phương pháp, công nghệ)", ex: "Many schools have adopted online learning.", exVi: "Nhiều trường đã áp dụng học trực tuyến.", more: "Danh từ: **adoption**. Đừng nhầm với **adapt** /əˈdæpt/ = thích nghi." },
        { w: "resistance", pos: "n", ipa: "/rɪˈzɪstəns/", vi: "sự phản đối, chống lại", ex: "The plan met strong resistance from local residents.", exVi: "Kế hoạch gặp sự phản đối mạnh từ cư dân địa phương.", more: "**resistance to / from** · động từ **resist** · tính từ **resistant to**." },
        { w: "standardisation", pos: "n", ipa: "/ˌstændədaɪˈzeɪʃn/", vi: "sự tiêu chuẩn hoá", ex: "Standardisation made the parts cheaper to produce.", exVi: "Tiêu chuẩn hoá làm linh kiện rẻ hơn khi sản xuất.", more: "Họ từ: **standard** (n, adj) → **standardise** (v) → **standardisation** (n). Mỹ viết -ize / -ization." },
        { w: "consequence", pos: "n", ipa: "/ˈkɒnsɪkwəns/", vi: "hậu quả, hệ quả", ex: "The decision had serious consequences for small farmers.", exVi: "Quyết định đó gây hậu quả nghiêm trọng cho nông dân nhỏ.", more: "**have consequences for** · **as a consequence** = as a result · tính từ **consequent**, trạng từ **consequently**." },
        { w: "fraction", pos: "n", ipa: "/ˈfrækʃn/", vi: "phần nhỏ; phân số", ex: "Online courses cost a fraction of the price of a degree.", exVi: "Khoá học trực tuyến chỉ tốn một phần nhỏ so với học phí đại học.", more: "**a (small / tiny) fraction of** + N — cụm hay gặp ở phép P6." },
        { w: "efficient", pos: "adj", ipa: "/ɪˈfɪʃnt/", vi: "hiệu quả (ít tốn thời gian, sức, tiền)", ex: "Trains are a more efficient way to move goods.", exVi: "Tàu hoả là cách chuyển hàng hiệu quả hơn.", more: "Danh từ **efficiency** · trái nghĩa **inefficient**. Khác **effective** = có tác dụng." },
        { w: "dependent", pos: "adj", ipa: "/dɪˈpendənt/", vi: "phụ thuộc", ex: "The island is heavily dependent on tourism.", exVi: "Hòn đảo phụ thuộc nặng vào du lịch.", more: "**dependent on** (không phải ~~of~~) · động từ **depend on** · danh từ **dependence** · trái nghĩa **independent of**." },
      ],
    },
  ],
};

/* ─────────────────────────── Bài 3 · Speaking ─────────────────────────── */

const T3D3_SPEAKING: Lesson = {
  id: "t3d3-noi",
  kind: "speaking",
  title: "Speaking Part 1: Weather · Shopping · Clothes theo 12 khung câu hỏi + nối âm",
  goal: "Nhận ra 12 khung câu hỏi Part 1 trong 1 giây, mở câu trả lời đúng khung rồi kéo dài 2–3 câu ở mức band 6 trên ba chủ đề Weather · Shopping · Clothes, và nói liền hơi nhờ nối âm phụ âm–nguyên âm và linking /r/.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này đẩy band nào, tiêu chí nào",
      items: [
        "Đẩy **Speaking Part 1** từ 5 lên 6 ở cả 4 tiêu chí: **FC** (Fluency & Coherence — trôi chảy, mạch lạc), **LR** (Lexical Resource — vốn từ), **GRA** (ngữ pháp), **P** (Pronunciation — phát âm).",
        "**Tập 2 Ngày 5** (mục 5) đã dạy 6 dạng (best time · suitable · easy / difficult · dislike · last time · popular) và đã chạm câu tần suất + khung It depends. Hôm nay học **trọn 12 khung**: thêm ==Do you like · How often · prefer X or Y · How has X changed · as a child · What kind… most==.",
        "Chủ đề đổi liên tục, **khung thì không**. Gặp chủ đề lạ (mirrors, robots, rain…) bạn vẫn có câu đầu tiên — vì bạn trả lời theo **khung**, không theo chủ đề.",
        "Band 5 → band 6 ở Part 1: thêm **một chi tiết cụ thể**, **một từ đúng chủ đề**, **một câu phức** — và dừng đúng lúc (2–3 câu, 15–25 giây).",
        "🔊 Nối âm: ôn **phụ âm → nguyên âm** (Tập 2 Ngày 23) và học **linking /r/**: ==weathe**r‿i**s · fo**r‿e**xample · mo**re‿o**ften==.",
      ],
    },

    { t: "h", text: "1. Mười hai khung câu hỏi Part 1" },
    {
      t: "p",
      text: "Giám khảo có khoảng 30 chủ đề Part 1 quen và nhiều chủ đề lạ, nhưng **cách hỏi** chỉ xoay quanh 12 khung dưới đây. Sáu khung có dấu ✔ đã học ở **Tập 2 Ngày 5** (mục 5) — hôm nay nâng chúng lên band 6. Sáu khung ★ là mới thành khung riêng (How often và What kind đã được chạm ở T2 N5: mở câu tần suất bằng bối cảnh, khung It depends cho câu hỏi rộng).",
    },
    {
      t: "table",
      caption: "12 khung — câu đầu tiên và cách kéo dài",
      head: ["Khung câu hỏi", "Câu 1 — trả lời thẳng", "Câu 2–3 — kéo dài", "Thì chính"],
      rows: [
        ["★ **1. Do you like X?**", "I’m (really) keen on… / I’m not a big fan of…, to be honest.", "lý do + **một ví dụ cụ thể** (khi nào, ở đâu)", "hiện tại đơn"],
        ["★ **2. How often do you…?**", "Mở bằng **bối cảnh** rồi mới tới tần suất: Since I started working, I only… about twice a month.", "làm gì trong lần đó · so với **trước đây**: I used to… much more often.", "hiện tại đơn + used to"],
        ["✔ **3. When was the last time…?**", "The last time I… was… / It’s been… since I last…", "2 câu **quá khứ**: với ai, làm gì, thấy sao — rồi dừng", "quá khứ đơn"],
        ["★ **4. Do you prefer X or Y?**", "I’d go for X / I much prefer X to Y. · It depends on…", "lý do chọn X + **mặt được của Y**: although Y is…", "hiện tại đơn + so sánh"],
        ["✔ **5. Is X popular in your country?**", "It’s hugely popular, especially among…", "vì sao + xu hướng: more and more people are…", "hiện tại đơn / tiếp diễn"],
        ["★ **6. How has X changed?**", "It has changed quite a lot. / It hasn’t changed much, actually.", "**trước**: …used to… → **nay**: these days… + nguyên nhân", "hiện tại hoàn thành + used to"],
        ["★ **7. Did you do X as a child?**", "Yes, all the time. / Not really — when I was a kid, I…", "một ký ức ngắn (would / used to) + **còn bây giờ**: these days I…", "quá khứ đơn + would / used to"],
        ["✔ **8. What do you dislike about X?**", "The one thing that annoys me about X is…", "ví dụ nhỏ + chốt cân bằng: Apart from that, I quite like it.", "hiện tại đơn"],
        ["✔ **9. Is it easy / difficult to…?**", "It’s fairly easy / It can be quite tricky to…", "lý do · điều kiện: unless… / as long as… · lúc đầu – về sau", "hiện tại đơn + điều kiện"],
        ["✔ **10. What is the best time to…?**", "I’d say the best time is…, when…", "lý do + thời điểm **nên tránh**: I’d avoid…, because…", "hiện tại đơn"],
        ["✔ **11. Is X suitable for…?**", "On the whole, yes. / Not really, I’d say.", "lý do + **ngoại lệ**: although it might not be ideal for…", "hiện tại đơn + might"],
        ["★ **12. What kind of X do you like most?**", "I like all kinds of X, but if I had to choose one, I’d go for…", "vì sao loại đó + một ví dụ / lần gần đây", "hiện tại đơn + điều kiện 2"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Mỗi câu Part 1 — 4 nhịp, 15–25 giây",
      steps: [
        { label: "① Nghe **khung**", sub: "Do you like · How often · last time · prefer · popular · changed · as a child · dislike · easy · best time · suitable · what kind" },
        { label: "② **Câu 1 trả lời thẳng** đúng khung", sub: "Hỏi tần suất → câu 1 có tần suất. Hỏi thích loại nào → câu 1 có một loại." },
        { label: "③ **1–2 câu kéo dài**", sub: "lý do · ví dụ cụ thể · mặt kia · trước–nay" },
        { label: "④ **Hạ giọng, dừng**", sub: "Không treo and… / so… / but yeah…" },
      ],
      caption: "Part 1 có khoảng 10–12 câu trong 4–5 phút. Trả lời dài quá 30 giây thì giám khảo có thể ngắt để chuyển câu — không bị trừ điểm vì bị ngắt, nhưng mất nhịp và hay lạc ý.",
    },
    {
      t: "rule",
      formula: "Nghe khung → câu 1 trả lời thẳng → lý do / ví dụ cụ thể → mặt kia hoặc trước–nay → dừng",
      vi: "12 khung, một cách trả lời. Không cần học thuộc câu trả lời theo chủ đề.",
    },

    { t: "h", text: "2. Weather — bốn khung, mẫu band 5 và band 6" },
    {
      t: "table",
      caption: "Cùng một câu hỏi: band 5 nói gì, thiếu gì",
      head: ["Khung · câu hỏi", "Trả lời khoảng band 5", "Thiếu gì để lên band 6"],
      rows: [
        ["**1** · Do you like rainy days?", "Yes, I like rainy days. Because it is cool. I can stay at home and sleep.", "Câu ngắn, rời; **Because** đứng riêng thành câu; không có chi tiết cụ thể; từ chung (cool, like)."],
        ["**6** · How has the weather in your hometown changed?", "The weather is hotter now. In the past it is cooler. I think it is because of pollution.", "Sai thì (in the past it **is**); không dùng hiện tại hoàn thành / used to — đúng thứ khung này kiểm tra."],
        ["**10** · What’s the best time of year to visit your country?", "I think spring is the best time. The weather is good. Tourists can go many places.", "Lý do chung chung (good); không có thời điểm nên tránh; thiếu từ chủ đề."],
        ["**7** · Did you enjoy playing in the rain as a child?", "Yes, I did. When I was a child I play in the rain with my friends. It was very fun.", "Sai thì (I **play**); ~~very fun~~; không có “còn bây giờ”."],
      ],
    },
    {
      t: "dialogue",
      title: "Weather — câu trả lời mẫu band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you like rainy days?" },
        { who: "Candidate", role: "candidate", text: "I do, as long as I don't have to go out. There's something really relaxing about staying in with a hot drink while it's pouring outside. On a working day, though, a sudden downpour is a nightmare, because the streets flood in minutes.", vi: "Có, miễn là tôi không phải ra ngoài. Ở nhà với một cốc đồ uống nóng trong lúc ngoài trời mưa như trút thì rất thư giãn. Nhưng vào ngày đi làm, một trận mưa rào bất chợt là ác mộng, vì đường ngập chỉ trong vài phút." },
        { who: "Examiner", role: "examiner", text: "How has the weather in your hometown changed in recent years?" },
        { who: "Candidate", role: "candidate", text: "It's become a lot less predictable. When I was younger, we used to have four clear seasons, but these days it can be boiling hot one day and chilly the next. Summers have definitely got longer, too.", vi: "Nó trở nên khó đoán hơn nhiều. Hồi tôi còn nhỏ, chúng tôi từng có bốn mùa rõ rệt, nhưng dạo này có thể hôm nay nóng như thiêu, hôm sau đã se lạnh. Mùa hè chắc chắn cũng dài hơn." },
        { who: "Examiner", role: "examiner", text: "What's the best time of year to visit your country?" },
        { who: "Candidate", role: "candidate", text: "I'd say autumn, around October, when the air is dry and the temperature is pleasant. I'd avoid July and August if I were a tourist, because it's incredibly humid and there's a real risk of storms.", vi: "Tôi cho là mùa thu, khoảng tháng Mười, khi không khí khô và nhiệt độ dễ chịu. Nếu là khách du lịch thì tôi sẽ tránh tháng Bảy và tháng Tám, vì trời cực kỳ ẩm và có nguy cơ bão thật sự." },
        { who: "Examiner", role: "examiner", text: "Did you enjoy playing in the rain as a child?" },
        { who: "Candidate", role: "candidate", text: "Absolutely. Whenever there was a heavy shower, my cousins and I would run out into the yard and get completely soaked. My mum wasn't too pleased, but we loved it. These days I just reach for an umbrella.", vi: "Chắc chắn rồi. Cứ có mưa rào to là anh chị em họ và tôi lại chạy ra sân và ướt sũng. Mẹ tôi không vui lắm, nhưng chúng tôi rất thích. Bây giờ thì tôi chỉ với lấy cái ô." },
      ],
    },

    { t: "h", text: "3. Shopping — bốn khung, mẫu band 5 và band 6" },
    {
      t: "table",
      caption: "Cùng một câu hỏi: band 5 nói gì, thiếu gì",
      head: ["Khung · câu hỏi", "Trả lời khoảng band 5", "Thiếu gì để lên band 6"],
      rows: [
        ["**2** · How often do you go shopping?", "I go shopping two times a week. I buy food and something for my house.", "Trả lời đúng nhưng cụt; ~~two times~~ → twice; không có bối cảnh, không so với trước."],
        ["**4** · Do you prefer shopping online or in stores?", "I prefer shopping online. It is convenient and cheap. I don’t like go to stores.", "Chỉ một mặt; ~~don’t like go~~; hai tính từ quen (convenient, cheap) — không có ví dụ."],
        ["**5** · Is online shopping popular in your country?", "Yes, it is very popular. Many people buy things online. It is very convenient.", "Lặp very, lặp convenient; không nói **ai** mua, **xu hướng** ra sao."],
        ["**8** · What do you dislike about shopping?", "I don’t like shopping because it is crowded and I am tired.", "Không nêu **một điều** cụ thể; không có ví dụ; không có câu chốt cân bằng."],
      ],
    },
    {
      t: "dialogue",
      title: "Shopping — câu trả lời mẫu band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "How often do you go shopping?" },
        { who: "Candidate", role: "candidate", text: "Since I moved into my own flat, I've had to go to the supermarket about twice a week, mainly for groceries. Shopping for clothes or gadgets is much rarer, maybe once every couple of months. I used to go far more often when I lived near a shopping centre.", vi: "Từ khi chuyển ra ở căn hộ riêng, tôi phải đi siêu thị khoảng hai lần một tuần, chủ yếu mua thực phẩm. Mua quần áo hay đồ công nghệ thì hiếm hơn nhiều, có lẽ vài tháng một lần. Hồi sống gần trung tâm thương mại tôi đi thường xuyên hơn hẳn." },
        { who: "Examiner", role: "examiner", text: "Do you prefer shopping online or in stores?" },
        { who: "Candidate", role: "candidate", text: "It depends on what I'm buying. For things like books or phone accessories, I'd go for online shopping every time, because I can compare prices in seconds. But for shoes, I much prefer a real shop, since I need to try them on.", vi: "Tuỳ tôi mua gì. Với những thứ như sách hay phụ kiện điện thoại, lần nào tôi cũng chọn mua online, vì tôi so giá được trong vài giây. Nhưng với giày thì tôi thích cửa hàng thật hơn nhiều, vì tôi cần đi thử." },
        { who: "Examiner", role: "examiner", text: "Is online shopping popular in your country?" },
        { who: "Candidate", role: "candidate", text: "It's hugely popular, especially among students and office workers. Delivery is cheap, and there are big sales almost every month, so people buy everything from snacks to furniture online. Even my grandmother has started ordering things on her phone.", vi: "Nó cực kỳ phổ biến, nhất là với sinh viên và dân văn phòng. Phí giao hàng rẻ, và gần như tháng nào cũng có đợt giảm giá lớn, nên người ta mua mọi thứ từ đồ ăn vặt đến nội thất trên mạng. Ngay cả bà tôi cũng bắt đầu đặt hàng bằng điện thoại." },
        { who: "Examiner", role: "examiner", text: "What do you dislike about shopping?" },
        { who: "Candidate", role: "candidate", text: "The one thing that really annoys me is queuing. Last weekend I waited nearly twenty minutes just to pay for a bottle of shampoo. Apart from that, I actually quite enjoy browsing around the shops.", vi: "Điều duy nhất thật sự làm tôi bực là xếp hàng. Cuối tuần trước tôi chờ gần hai mươi phút chỉ để trả tiền một chai dầu gội. Ngoài chuyện đó ra thì thật ra tôi khá thích đi ngó nghiêng các cửa hàng." },
      ],
    },

    { t: "h", text: "4. Clothes — bốn khung, mẫu band 5 và band 6" },
    {
      t: "table",
      caption: "Cùng một câu hỏi: band 5 nói gì, thiếu gì",
      head: ["Khung · câu hỏi", "Trả lời khoảng band 5", "Thiếu gì để lên band 6"],
      rows: [
        ["**12** · What kind of clothes do you like most?", "I like T-shirt and jeans. They are comfortable. I wear them every day.", "~~T-shirt~~ thiếu số nhiều; không có khung “all kinds… but if I had to choose”; một tính từ duy nhất."],
        ["**3** · When was the last time you bought clothes?", "Last month I buy a jacket. It is black. I like it.", "Sai thì (I **buy**, it **is**); ba câu cụt không nối; không có vì sao mua."],
        ["**9** · Is it easy to find clothes that fit you?", "No, it is difficult. Because I am tall. The clothes is short.", "~~The clothes is~~ (clothes luôn số nhiều); Because đứng riêng; không có điều kiện / giải pháp."],
        ["**11** · Are jeans suitable for work?", "I think yes. Jeans are comfortable. Many people wear jeans to work.", "~~I think yes~~ → I think so; không có ngoại lệ (nghề nào thì không hợp)."],
      ],
    },
    {
      t: "dialogue",
      title: "Clothes — câu trả lời mẫu band 6 (ước tính)",
      lines: [
        { who: "Examiner", role: "examiner", text: "What kind of clothes do you like most?" },
        { who: "Candidate", role: "candidate", text: "I like all kinds of casual clothes, but if I had to choose one, I'd go for a plain hoodie. It's comfortable, it goes with almost anything, and it's perfect for air-conditioned classrooms.", vi: "Tôi thích mọi kiểu đồ thường ngày, nhưng nếu phải chọn một thì tôi chọn áo hoodie trơn. Nó thoải mái, hợp với gần như mọi thứ, và rất hợp với phòng học bật điều hoà." },
        { who: "Examiner", role: "examiner", text: "When was the last time you bought some clothes?" },
        { who: "Candidate", role: "candidate", text: "It's been about a month since I last bought anything. I picked up a waterproof jacket in a sale, because my old one had started to leak. It was a real bargain, less than half the original price.", vi: "Đã khoảng một tháng từ lần cuối tôi mua thứ gì đó. Tôi mua được một cái áo khoác chống nước trong đợt giảm giá, vì cái cũ đã bắt đầu thấm nước. Đúng là một món hời, chưa đến nửa giá gốc." },
        { who: "Examiner", role: "examiner", text: "Is it easy to find clothes that fit you?" },
        { who: "Candidate", role: "candidate", text: "It can be quite tricky, to be honest. I'm taller than average, so the sleeves are usually too short unless I buy from international brands. Shopping online makes it even harder, as the sizes are never consistent.", vi: "Thật lòng mà nói thì khá khó. Tôi cao hơn mức trung bình, nên tay áo thường quá ngắn trừ khi tôi mua của các hãng quốc tế. Mua online còn khó hơn, vì kích cỡ chẳng bao giờ thống nhất." },
        { who: "Examiner", role: "examiner", text: "Are jeans suitable for work?" },
        { who: "Candidate", role: "candidate", text: "On the whole, yes, at least in my field. Most tech companies are happy for staff to dress casually. They might not be ideal for people who meet clients, though, like lawyers or bank staff.", vi: "Nhìn chung là có, ít nhất trong ngành của tôi. Phần lớn công ty công nghệ thoải mái cho nhân viên ăn mặc thường ngày. Tuy vậy nó có thể không lý tưởng với những người gặp khách hàng, như luật sư hay nhân viên ngân hàng." },
      ],
    },

    { t: "h", text: "5. Band 5 và band 6 khác nhau ở đâu — theo 4 tiêu chí" },
    {
      t: "table",
      head: ["Tiêu chí", "Band 5 (các câu ở bảng trên)", "Band 6 (các hội thoại mẫu)", "Bạn làm gì"],
      rows: [
        ["**FC** — trôi chảy, mạch lạc", "3 câu rời, mỗi câu 5–6 từ; **Because** đứng riêng.", "2–3 câu **nối nhau**: as long as · though · since · so · unless · apart from that.", "Mỗi câu trả lời có **ít nhất một từ nối trong câu** (không tính and)."],
        ["**LR** — vốn từ", "good · cool · convenient · very + tính từ.", "Từ đúng chủ đề: downpour · humid · chilly · bargain · browse · groceries · casual · goes with.", "Mỗi câu trả lời cài **một** từ chủ đề (mục 7) — không nhồi."],
        ["**GRA** — ngữ pháp", "Câu đơn hiện tại; sai thì khi kể quá khứ.", "Trộn thì đúng khung: used to · would · have got · if I had to choose, I’d…; mệnh đề when / because / unless.", "Nghe khung → biết **thì** (cột cuối bảng mục 1)."],
        ["**P** — phát âm", "Đọc rời từng từ; nuốt âm cuối (like → “lai”).", "Nối âm trong cụm; có nhấn từ chính (really **relaxing**, a real **bargain**).", "Luyện mục 8 hôm nay."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận — lên band 6 không có nghĩa là nói dài hơn",
      items: [
        "Câu mẫu band 6 chỉ dài khoảng **35–50 từ** (15–25 giây). Khác biệt là **cụ thể hơn và nối tốt hơn**, không phải dài hơn.",
        "**Một chi tiết cụ thể** thay cho ba tính từ chung: ~~It is very crowded and noisy and tiring~~ → I waited nearly twenty minutes just to pay for a bottle of shampoo.",
        "Đừng mở mọi câu bằng **I think**. Xoay vòng: I’d say… · To be honest,… · On the whole,… · It depends on…",
        "~~very fun~~ → **great fun / really fun** · ~~two times~~ → **twice** · ~~I think yes~~ → **I think so** · ~~go to shopping~~ → **go shopping**.",
      ],
    },

    { t: "h", text: "6. Ba công cụ kéo dài — What kind… most · kể 2 câu quá khứ · It depends" },
    {
      t: "patterns",
      rows: [
        {
          formula: "I like all kinds of + N, but if I had to choose one, I'd go for + N",
          vi: "Cho khung **What kind of X do you like most?** — nói rộng trước, rồi chọn một. Cấu trúc điều kiện loại 2 (if + quá khứ, would + V) ghi điểm GRA.",
          examples: [
            { en: "I like all kinds of weather, but if I had to choose one, I'd go for a cool, sunny morning.", vi: "Tôi thích mọi kiểu thời tiết, nhưng nếu phải chọn một thì tôi chọn một buổi sáng mát và có nắng." },
            { en: "I enjoy all sorts of shops, but if I had to pick one, it would be a second-hand bookshop.", vi: "Tôi thích đủ loại cửa hàng, nhưng nếu phải chọn một thì đó là hiệu sách cũ." },
          ],
        },
        {
          formula: "It's been + thời gian + since I last + V2. + 1–2 câu quá khứ đơn",
          vi: "Cho khung **last time** và **as a child**: một câu rào mở đầu, rồi **đúng 2 câu quá khứ** (làm gì – thấy sao). Không kể thành Part 2.",
          examples: [
            { en: "It's been ages since I last went to a market. I think it was at Tet, when I helped my mum buy flowers.", vi: "Lâu lắm rồi tôi chưa đi chợ. Tôi nghĩ là hồi Tết, khi tôi giúp mẹ mua hoa." },
            { en: "As far as I remember, I wore a uniform every day at primary school. I hated the tie, but it saved a lot of time in the morning.", vi: "Theo tôi nhớ thì hồi tiểu học ngày nào tôi cũng mặc đồng phục. Tôi ghét cái cà vạt, nhưng nó tiết kiệm nhiều thời gian buổi sáng." },
          ],
        },
        {
          formula: "It depends on + N / Wh-. If…, I… . But if…, I…",
          vi: "Cho câu hỏi **rộng** hoặc khung **prefer X or Y** khi bạn không nghiêng hẳn về bên nào (ôn khung It depends → If… → But if… của T2 N5 mục 5, nay dùng thêm cho prefer X or Y).",
          examples: [
            { en: "It depends on the season. If it's summer, I wear shorts almost every day. But if it's winter, I need at least three layers.", vi: "Tuỳ mùa. Nếu là mùa hè, gần như ngày nào tôi cũng mặc quần đùi. Nhưng nếu là mùa đông, tôi cần ít nhất ba lớp áo." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Kéo dài bằng đối lập — T2 N5 mục 6 đã cho 4 khung câu (Generally… but · At first… but after a while…); nay thêm bốn từ nối và chỗ đặt chúng",
      head: ["Từ nối", "Vị trí", "Ví dụ"],
      rows: [
        ["**though**", "**cuối câu** thứ hai (văn nói)", "I love sunny days. It gets too hot in June, **though**."],
        ["**although**", "đầu mệnh đề, nối **hai vế trong một câu**", "**Although** online shopping is cheap, I still like real shops."],
        ["**whereas / while**", "giữa hai vế so sánh **hai đối tượng**", "My sister follows fashion, **whereas** I wear the same things for years."],
        ["**apart from that**", "đầu câu chốt, sau khi nêu một điểm trừ", "The prices are a bit high. **Apart from that**, it’s a great market."],
      ],
    },
    {
      t: "rule",
      formula: "I like all kinds of X, but if I had to choose one, I'd go for… · It's been… since I last + V2 · It depends on… If…, But if…",
      vi: "Ba khung cứu mọi câu hỏi rộng, câu hỏi về lần gần nhất, và câu hỏi chọn X hay Y.",
    },
    {
      t: "quiz",
      id: "t3d3-noi-khung-dich",
      title: "Dịch nhanh — ba khung kéo dài (4 câu)",
      kind: "translate",
      grammar: "I like all kinds of + N, but if I had to choose one, I'd go for… · It's been + thời gian + since I last + V2 · It depends on + N · used to + V.",
      items: [
        { q: "Tôi thích mọi loại quần áo, nhưng nếu phải chọn một thì tôi chọn quần bò.", hint: "all kinds of clothes, if I had to choose one, I'd go for, jeans", answers: ["I like all kinds of clothes, but if I had to choose one, I'd go for jeans.", "I like all kinds of clothes, but if I had to choose one, I would go for jeans.", "I like all kinds of clothes, but if I had to choose one, I'd choose jeans.", "I like all kinds of clothes but if I had to choose one, I'd go for jeans.", "I like all sorts of clothes, but if I had to choose one, I'd go for jeans.", "I like all kinds of clothes, but if I had to pick one, I'd go for jeans."] },
        { q: "Đã ba tháng từ lần cuối tôi đi mua sắm.", hint: "It's been, three months, since I last, went shopping", answers: ["It's been three months since I last went shopping.", "It has been three months since I last went shopping.", "It's been three months since I went shopping.", "It has been three months since I went shopping."] },
        { q: "Tuỳ vào thời tiết.", hint: "It depends on, the weather", answers: ["It depends on the weather.", "That depends on the weather.", "It all depends on the weather."] },
        { q: "Hồi trước mùa đông lạnh hơn bây giờ nhiều.", hint: "Winters, used to be, much colder, than they are now", answers: ["Winters used to be much colder than they are now.", "Winters used to be much colder than now.", "Winter used to be much colder than it is now.", "Winters used to be a lot colder than they are now.", "Winter used to be much colder than now.", "Winters used to be far colder than they are now."] },
      ],
    },
    {
      t: "mcq",
      id: "t3d3-noi-chon",
      title: "Chọn câu trả lời Part 1 tốt nhất (6 câu)",
      items: [
        {
          q: "How often do you check the weather forecast?",
          options: [
            "The weather forecast is very important for farmers and for people who travel a lot.",
            "Every day.",
            "Now that I ride a motorbike to work, I check it every morning before I leave. I never used to bother when I took the bus.",
            "I check it and sometimes it is right and sometimes it is wrong and so I don't know and…",
          ],
          correct: 2,
          why: "Khung **How often**: C mở bằng **bối cảnh** (Now that I ride a motorbike), có tần suất, rồi so với trước (never used to). A nói như Part 3, không trả lời câu hỏi. B cụt. D lê thê, treo “and…”.",
        },
        {
          q: "Do you prefer hot or cold weather?",
          options: [
            "I'd go for cold weather. You can always put on another layer, whereas in the heat there's not much you can do.",
            "Hot weather is hot and cold weather is cold, so they are different.",
            "I prefer.",
            "Yes, I do.",
          ],
          correct: 0,
          why: "Khung **prefer X or Y**: A chọn một bên, nêu lý do và đối lập bằng **whereas**. B không chọn. C thiếu tân ngữ. D trả lời như câu Yes/No — sai khung.",
        },
        {
          q: "Has the way people shop changed in your country?",
          options: [
            "Yes. People shop.",
            "People go to markets every day, and they are buying many things in the past.",
            "I think shopping is a good hobby for young people because it helps them relax.",
            "It's changed dramatically. People used to go to the local market every morning, but these days most of them order online and have things delivered.",
          ],
          correct: 3,
          why: "Khung **How has X changed**: D dùng **hiện tại hoàn thành** + **used to… but these days…**. B sai thì (are buying… in the past). C lạc đề. A cụt.",
        },
        {
          q: "What kind of shops do you like most?",
          options: [
            "Shops.",
            "I like all kinds of shops, really, but if I had to choose one, I'd go for a stationery shop. I can spend an hour just looking at notebooks.",
            "I go shopping twice a week with my mother.",
            "I like shop sell clothes because clothes is nice.",
          ],
          correct: 1,
          why: "Khung **What kind… most**: B dùng đúng khung **all kinds… but if I had to choose one, I’d go for…** rồi thêm chi tiết cụ thể. C trả lời khung How often. D sai ngữ pháp (shop sell · clothes is).",
        },
        {
          q: "Did you wear a uniform when you were a child?",
          options: [
            "Uniforms are useful because all students look equal.",
            "Yes, I wear a uniform every day and I like it.",
            "Yes, right through primary and secondary school. We had to wear a white shirt and dark blue trousers, which I found quite boring at the time. These days I'm glad I never had to think about what to put on.",
            "No.",
          ],
          correct: 2,
          why: "Khung **as a child**: C trả lời thẳng, 1 câu ký ức (**had to wear**, quá khứ), rồi “còn bây giờ” (These days…). B sai thì (wear — hiện tại). A nói ý kiến chung, không trả lời về bản thân. D cụt.",
        },
        {
          q: "Is it difficult to choose clothes for a job interview?",
          options: [
            "It can be quite tricky, especially for a first interview. You want to look smart, but you don't want to seem too formal unless it's a bank or a law firm.",
            "Job interviews are very important in everyone's life.",
            "Difficult.",
            "I choose clothes and then I go to the interview and I answer the questions and then…",
          ],
          correct: 0,
          why: "Khung **easy / difficult**: A mở **It can be quite tricky**, nêu lý do và điều kiện **unless**. B lạc đề. C cụt. D kể lể, không trả lời.",
        },
      ],
    },

    { t: "h", text: "7. Từ vựng ba chủ đề — mỗi câu trả lời cài MỘT từ" },
    {
      t: "vocab",
      items: [
        { w: "humid", pos: "adj", ipa: "/ˈhjuːmɪd/", vi: "ẩm, oi (nóng ẩm)", ex: "Summers in Hanoi are hot and humid.", exVi: "Mùa hè ở Hà Nội nóng và ẩm.", more: "Danh từ: **humidity**. Nói kèm: **hot and humid**, **incredibly humid**." },
        { w: "downpour", pos: "n", ipa: "/ˈdaʊnpɔː/", vi: "trận mưa rào rất to", ex: "We got caught in a sudden downpour.", exVi: "Chúng tôi bị dính một trận mưa rào bất chợt.", more: "**a sudden / heavy downpour** · động từ: **It’s pouring (down)**. Nhẹ hơn: **a shower**." },
        { w: "drizzle", pos: "n, v", ipa: "/ˈdrɪzl/", vi: "mưa phùn", ex: "In early spring it often drizzles for weeks.", exVi: "Đầu xuân trời thường mưa phùn hàng tuần liền.", more: "Đúng kiểu mưa phùn miền Bắc: **light drizzle**." },
        { w: "chilly", pos: "adj", ipa: "/ˈtʃɪli/", vi: "se lạnh, hơi lạnh", ex: "It gets quite chilly in the evenings.", exVi: "Buổi tối trời khá se lạnh.", more: "Thang lạnh: **cool → chilly → cold → freezing**. Thang nóng: **warm → hot → boiling**." },
        { w: "heatwave", pos: "n", ipa: "/ˈhiːtweɪv/", vi: "đợt nắng nóng", ex: "The city had a two-week heatwave in June.", exVi: "Thành phố có đợt nắng nóng hai tuần vào tháng Sáu.", more: "**during a heatwave** · **a record-breaking heatwave**." },
        { w: "unpredictable", pos: "adj", ipa: "/ˌʌnprɪˈdɪktəbl/", vi: "khó đoán, thất thường", ex: "The weather here is very unpredictable in spring.", exVi: "Thời tiết ở đây rất thất thường vào mùa xuân.", more: "Họ từ: **predict** (v) → **prediction** (n) → **predictable** ↔ **unpredictable**. Liên quan: **the weather forecast** = dự báo thời tiết." },
        { w: "bargain", pos: "n", ipa: "/ˈbɑːɡɪn/", vi: "món hời; (v) mặc cả", ex: "This jacket was a real bargain.", exVi: "Cái áo khoác này đúng là một món hời.", more: "**a real bargain** · **hunt for bargains** · động từ: **bargain with the seller** (mặc cả)." },
        { w: "browse", pos: "v", ipa: "/braʊz/", vi: "xem lướt, ngó nghiêng (không định mua)", ex: "I like browsing in bookshops at the weekend.", exVi: "Cuối tuần tôi thích ngó nghiêng trong hiệu sách.", more: "**browse around the shops** · **browse online**. Gần nghĩa: **window shopping** (đi ngắm hàng)." },
        { w: "groceries", pos: "n (số nhiều)", ipa: "/ˈɡrəʊsəriz/", vi: "thực phẩm, đồ dùng hằng ngày", ex: "I order my groceries online once a week.", exVi: "Tôi đặt thực phẩm trên mạng mỗi tuần một lần.", more: "**do the grocery shopping** = đi chợ / đi siêu thị mua đồ ăn." },
        { w: "impulse buy", pos: "n", ipa: "/ˈɪmpʌls baɪ/", vi: "món mua bốc đồng (không định trước)", ex: "Those headphones were an impulse buy.", exVi: "Cái tai nghe đó là một món mua bốc đồng.", more: "**buy something on impulse** · **an impulse purchase**." },
        { w: "refund", pos: "n", ipa: "/ˈriːfʌnd/", vi: "tiền hoàn lại", ex: "The shop gave me a full refund.", exVi: "Cửa hàng hoàn lại toàn bộ tiền cho tôi.", more: "**get / ask for a refund**. Động từ nhấn âm sau: **refund** /rɪˈfʌnd/. Liên quan: **return an item**, **exchange**." },
        { w: "affordable", pos: "adj", ipa: "/əˈfɔːdəbl/", vi: "giá phải chăng, vừa túi tiền", ex: "Local brands are much more affordable.", exVi: "Hãng trong nước có giá phải chăng hơn nhiều.", more: "Từ **afford** (v): I **can’t afford** it. Thay cho cheap (nghe như “rẻ tiền”)." },
        { w: "casual", pos: "adj", ipa: "/ˈkæʒuəl/", vi: "(quần áo) thường ngày, thoải mái", ex: "We can wear casual clothes on Fridays.", exVi: "Thứ Sáu chúng tôi được mặc đồ thường ngày.", more: "Trái nghĩa: **formal** / **smart**. **dress casually** · **smart casual** (lịch sự mà không cứng)." },
        { w: "outfit", pos: "n", ipa: "/ˈaʊtfɪt/", vi: "bộ đồ (mặc cùng nhau)", ex: "She bought a new outfit for the wedding.", exVi: "Cô ấy mua một bộ đồ mới để đi đám cưới.", more: "Đếm được: **an outfit**, hai **outfits**. (**clothes** luôn số nhiều, không có ~~a clothes~~.)" },
        { w: "fit", pos: "v", ipa: "/fɪt/", vi: "vừa (kích cỡ)", ex: "These trousers don't fit me any more.", exVi: "Cái quần này không còn vừa tôi nữa.", more: "**fit** = vừa cỡ · **suit** /suːt/ = hợp (màu, kiểu): Blue **suits** you. · **go with** = hợp với đồ khác: It **goes with** anything." },
        { w: "try on", pos: "phr v", ipa: "/traɪ ɒn/", vi: "mặc thử, đi thử", ex: "Can I try these shoes on?", exVi: "Tôi đi thử đôi giày này được không?", more: "Tách được: **try it on** (đại từ đứng giữa). **fitting room** = phòng thử đồ." },
        { w: "trendy", pos: "adj", ipa: "/ˈtrendi/", vi: "hợp mốt, thời thượng", ex: "He always wears trendy trainers.", exVi: "Anh ấy lúc nào cũng đi giày thể thao hợp mốt.", more: "**follow fashion / the latest trends** · **be in fashion** ↔ **go out of fashion**." },
        { w: "second-hand", pos: "adj", ipa: "/ˌsekənd ˈhænd/", vi: "(đồ) cũ, đã qua sử dụng", ex: "I buy most of my jackets second-hand.", exVi: "Phần lớn áo khoác của tôi là mua đồ cũ.", more: "**a second-hand shop** · Anh còn gọi **a charity shop**; Mỹ: **a thrift store**." },
      ],
    },

    { t: "h", text: "8. Phát âm: nối phụ âm → nguyên âm (ôn) và linking /r/ (mới)" },
    {
      t: "p",
      text: "Ở **Tập 2 Ngày 23** bạn đã nhập phép nối cơ bản: từ **kết thúc bằng phụ âm** + từ **bắt đầu bằng nguyên âm** → kéo phụ âm sang: turn‿it‿off. Hôm nay thêm **linking /r/** — phép nối riêng của giọng Anh-Anh, và là lý do người Việt nghe “far away” thành một từ lạ.",
    },
    {
      t: "table",
      caption: "Hai phép nối",
      head: ["Phép nối", "Luật", "Ví dụ hôm nay"],
      rows: [
        ["**Phụ âm → nguyên âm** (ôn)", "Phụ âm cuối “trượt” sang nguyên âm đầu của từ sau. Không ngắt hơi giữa hai từ.", "a lot‿of · try‿it‿on · goes‿with‿anything · it‿depends‿on · apart from that‿I · twice‿a week"],
        ["**Linking /r/** (mới)", "Giọng Anh-Anh **không đọc** chữ r cuối từ (weather /ˈweðə/). Nhưng khi từ sau **bắt đầu bằng nguyên âm**, âm /r/ **xuất hiện** để nối.", "weathe**r‿i**s /ˈweðər ɪz/ · fo**r‿e**xample · mo**re‿o**ften · fa**r‿a**way · a pai**r‿o**f jeans · wea**r‿i**t"],
        ["**Không nối /r/**", "Từ sau bắt đầu bằng **phụ âm** → r vẫn câm (giọng Anh).", "the weathe**r** changes /ˈweðə ˈtʃeɪndʒɪz/ · fo**r** me /fə miː/"],
      ],
    },
    {
      t: "note",
      title: "Mẹo luyện nối âm",
      items: [
        "Nối âm chỉ xảy ra **trong một cụm nghĩa** (ôn T2 N23): The weather‿is getting hotter | and hotter‿every year. Giữa hai cụm được ngừng nhẹ.",
        "Giọng **Mỹ, Canada** đọc /r/ ở mọi vị trí, nên không có “r xuất hiện”. Bạn theo giọng nào cũng được — miễn **nhất quán** và **không ngắt** giữa hai từ.",
        "Đừng thêm /r/ vào chỗ không có chữ r: ~~I saw‿r‿it~~. Người bản ngữ đôi khi làm vậy, nhưng người học không cần bắt chước.",
        "Tự kiểm: ghi âm câu “There are a lot of shops near our house.” Nếu nghe ra **chín tiếng rời**, bạn chưa nối. Nếu nghe ra **hai cụm** (there‿are‿a lot‿of shops | near‿our house), bạn đã nối.",
      ],
    },
    {
      t: "phatam",
      id: "t3d3-phat-am",
      title: "Luyện phát âm — linking /r/ và nối phụ âm–nguyên âm",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. Bốn dòng đầu là cụm ngắn; bốn dòng sau là câu trả lời Part 1. Đừng ngắt hơi ở những chỗ có dấu ‿ trong phần gợi ý.",
      items: [
        { text: "far away", ipa: "fɑːr əweɪ", vi: "fa‿raway — /r/ xuất hiện" },
        { text: "more often", ipa: "mɔːr ɒfn", vi: "mo‿roften" },
        { text: "for example", ipa: "fər ɪɡzɑːmpl", vi: "fo‿rexample — for đọc yếu /fər/" },
        { text: "a pair of jeans", ipa: "ə peər əv dʒiːnz", vi: "pai‿rof — of đọc yếu /əv/" },
        { text: "The weather is getting hotter every year.", ipa: "ðə weðər ɪz ɡetɪŋ hɒtər evri jɪə", vi: "weathe‿ris · hotte‿revery" },
        { text: "There are a lot of shops near our house.", ipa: "ðeər ər ə lɒt əv ʃɒps nɪər aʊə haʊs", vi: "the‿re‿a · lo‿tof · nea‿rour" },
        { text: "I wear it all summer and autumn.", ipa: "aɪ weər ɪt ɔːl sʌmər ən ɔːtəm", vi: "wea‿ri‿tall · summe‿rand" },
        { text: "I tried it on, but it didn't fit at all.", ipa: "aɪ traɪd ɪt ɒn bət ɪt dɪdnt fɪt ət ɔːl", vi: "trie‿di‿ton · fi‿ta‿tall" },
      ],
    },

    { t: "h", text: "9. Luyện nói với AI chấm — ba bộ, đủ 12 khung" },
    {
      t: "p",
      text: "Mỗi câu **15–25 giây**: câu 1 trả lời thẳng đúng khung → 1–2 câu kéo dài → dừng. Trước khi ghi âm, liếc bảng mục 1 để biết **thì** của từng khung. Mỗi câu cài **một** từ ở mục 7.",
    },
    {
      t: "speak",
      id: "t3d3-noi-weather",
      part: "1",
      questions: [
        "Do you like hot weather?",
        "How often does it rain where you live?",
        "How has the weather in your country changed since you were a child?",
        "What is the best season for outdoor activities in your hometown?",
        "Did you enjoy summer holidays when you were a child?",
        "What kind of weather do you like most?",
      ],
    },
    {
      t: "speak",
      id: "t3d3-noi-shopping",
      part: "1",
      questions: [
        "Do you like shopping?",
        "Do you prefer shopping alone or with other people?",
        "When was the last time you bought something online?",
        "Are street markets popular in your country?",
        "What do you dislike about shopping online?",
        "Is it easy to save money when you go shopping?",
      ],
    },
    {
      t: "speak",
      id: "t3d3-noi-clothes",
      part: "1",
      questions: [
        "What kind of clothes do you usually wear to class or to work?",
        "Do you prefer comfortable clothes or fashionable clothes?",
        "Are school uniforms suitable for university students?",
        "Has the way young people dress changed in your country?",
        "Did you choose your own clothes when you were a child?",
        "What is the best time of year to buy clothes in your country?",
      ],
    },
    {
      t: "note",
      title: "Tự chấm sau khi nghe lại",
      items: [
        "**Khung**: câu đầu có trả lời **đúng khung** không (How often → có tần suất; changed → có hiện tại hoàn thành hoặc used to; as a child → quá khứ)?",
        "**FC**: mỗi câu có ít nhất **một từ nối trong câu** (because, although, whereas, unless, so, since)? Có câu nào bị treo “and…” không? Có im lặng quá 3 giây không?",
        "**LR**: đếm từ chủ đề đã dùng (mục 7). Dưới 6 từ trong 18 câu → ghi âm lại bộ yếu nhất.",
        "**GRA**: câu **last time / as a child** có giữ **quá khứ** suốt không? Có ít nhất một câu **if I had to choose…, I’d…** không?",
        "**P**: nghe lại “weather is”, “a lot of”, “for example”, “a pair of” — đã nối chưa?",
        "**Sổ Speaking** (Ngày 2 · mục 7): chọn **câu trả lời yếu nhất**, chép nguyên văn cả lỗi, sửa bằng bút khác màu ở mức band 6, nói lại bản sửa 2 lần không nhìn sổ; hôm sau đóng vai giám khảo tự hỏi lại câu đó + một câu hỏi vặn.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T3D3_HOMEWORK: Lesson = {
  id: "t3d3-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 3",
  goal: "Củng cố cả ngày bằng 40 câu có đáp án: 6 nhóm lỗi mạo từ band 6, True / False / Not Given với 8 phép paraphrase, và 12 khung câu hỏi Part 1 — rồi ghi âm một bộ Part 1 trộn ba chủ đề.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Làm bài tập thế nào",
      items: [
        "**40 câu, khoảng 60 phút**: mạo từ 10 + 8 · dịch 6 · TFNG 6 · phép paraphrase 4 · khung Part 1 6. Cuối bài có một bộ ghi âm.",
        "Làm **không mở lại bài học**. Sai câu nào thì đọc phần giải thích, rồi quay lại đúng mục đó.",
        "Mục tiêu: **≥ 30/40**. Dưới 30: xem phần nào sai nhiều nhất — mạo từ (Bài 1 mục 3, 5, 6), TFNG (Bài 2 mục 3, 4), hay khung Part 1 (Bài 3 mục 1).",
        "Phần mạo từ: nhớ **bảng tự soát 4 bước** — danh từ đếm được số ít đứng trần · chữ the trong câu nói chung · 6 từ đen · cụm cố định.",
      ],
    },

    { t: "h", text: "Phần I — Chọn mạo từ đúng (10 câu)" },
    {
      t: "mcq",
      id: "t3d3-bt-mao-tu",
      title: "Chọn a / an / the / Ø",
      items: [
        { q: "Many experts believe that ___ education is the best way out of poverty.", options: ["an", "the", "Ø (không mạo từ)", "a"], correct: 2, why: "Giáo dục **nói chung**, không có cụm chỉ rõ → **Ø**." },
        { q: "___ education of young children should begin at home.", options: ["The", "Ø (không mạo từ)", "An", "A"], correct: 0, why: "Có cụm **of young children** chỉ rõ → **The education of**." },
        { q: "Air travel does a great deal of damage to ___ environment.", options: ["Ø (không mạo từ)", "an", "a", "the"], correct: 3, why: "Nhóm **luôn the**: the environment." },
        { q: "___ telephone was invented in the 1870s.", options: ["Ø (không mạo từ)", "The", "A", "Some"], correct: 1, why: "Nói về cả loại như **một phát minh** → **The telephone** (the + số ít)." },
        { q: "The teacher gave us ___ about the exam.", options: ["some useful information", "an useful information", "some useful informations", "a useful informations"], correct: 0, why: "**information** không đếm được: không a / an, không -s → **some useful information**." },
        { q: "The government should provide more housing for ___ homeless.", options: ["a", "Ø (không mạo từ)", "the", "an"], correct: 2, why: "**the + tính từ** = cả nhóm người: **the homeless**." },
        { q: "Tourism plays ___ important role in the economy of many islands.", options: ["Ø (không mạo từ)", "the", "a", "an"], correct: 3, why: "Cụm cố định **play a / an … role in**; **important** bắt đầu bằng nguyên âm → **an**." },
        { q: "___ number of universities now offer online degrees.", options: ["The", "A", "Ø (không mạo từ)", "An"], correct: 1, why: "Động từ **offer** (số nhiều), nghĩa “một số trường” → **A number of**." },
        { q: "People in big cities often have little contact with ___ nature.", options: ["Ø (không mạo từ)", "the", "a", "an"], correct: 0, why: "**nature** (thiên nhiên) nói chung → **Ø**. ~~the nature~~ là lỗi rất hay gặp." },
        { q: "___ most teenagers in my country own a smartphone.", options: ["The", "A", "An", "Ø (không mạo từ)"], correct: 3, why: "**Most + N** = đa số → **Ø**. **the most** chỉ dùng cho so sánh nhất." },
      ],
    },

    { t: "h", text: "Phần II — Điền a / an / the hoặc x (8 câu)" },
    {
      t: "quiz",
      id: "t3d3-bt-dien",
      title: "x = không cần mạo từ",
      kind: "fill",
      items: [
        { q: "Unemployment is one of the biggest problems in ___ society today.", answers: ["x", "ø", "Ø", "0", "-"], hint: "6 từ đen" },
        { q: "There has been ___ sharp increase in online fraud.", answers: ["a"], hint: "lần đầu nhắc tới một sự tăng" },
        { q: "___ percentage of elderly people in Japan is among the highest in the world.", answers: ["The", "the"], hint: "con số xác định + of" },
        { q: "We need more ___ evidence before we change the law.", answers: ["x", "ø", "Ø", "0", "-"], hint: "không đếm được" },
        { q: "In ___ 1990s, few families could afford a car.", answers: ["the"], hint: "thập niên" },
        { q: "She has ___ good knowledge of European history.", answers: ["a"], hint: "tính từ + knowledge + of" },
        { q: "___ rich should do more to help those in need.", answers: ["The", "the"], hint: "the + tính từ" },
        { q: "My brother goes to work by ___ bus.", answers: ["x", "ø", "Ø", "0", "-"], hint: "by + phương tiện" },
      ],
    },

    { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t3d3-bt-dich",
      title: "Chú ý mạo từ ở những chỗ in đậm trong gợi ý",
      kind: "translate",
      grammar: "Ø + N chung · the + environment / government / internet · the + adj · the number of + V số ít · N không đếm được · play a role in.",
      items: [
        { q: "Internet đã thay đổi cách con người làm việc.", hint: "The internet, has changed, the way people work", answers: ["The internet has changed the way people work.", "The Internet has changed the way people work.", "The internet has changed how people work.", "The internet has changed the way that people work."] },
        { q: "Người cao tuổi cần nhiều sự hỗ trợ hơn từ xã hội.", hint: "The elderly, need, more support, from society (Ø)", answers: ["The elderly need more support from society.", "Elderly people need more support from society.", "The elderly need more help from society.", "Older people need more support from society."] },
        { q: "Số lượng người mua sắm trực tuyến đang tăng.", hint: "The number of people who shop online / online shoppers, is rising / increasing", answers: ["The number of people who shop online is rising.", "The number of people who shop online is increasing.", "The number of online shoppers is rising.", "The number of online shoppers is increasing.", "The number of people shopping online is rising.", "The number of people shopping online is increasing.", "The number of people who shop online is growing."] },
        { q: "Ô nhiễm là một mối đe doạ nghiêm trọng đối với sức khoẻ.", hint: "Pollution (Ø), a serious threat, to health (Ø)", answers: ["Pollution is a serious threat to health.", "Pollution is a serious threat to our health.", "Pollution is a serious threat to people's health.", "Pollution is a serious threat to human health.", "Pollution is a major threat to health."] },
        { q: "Có rất ít nghiên cứu về vấn đề này.", hint: "There is, very little, research, on / into, this issue / problem", answers: ["There is very little research on this issue.", "There is very little research on this problem.", "There is very little research into this issue.", "There is very little research into this problem.", "There is little research on this issue.", "There is very little research on this topic.", "There is little research on this problem.", "There is little research into this issue."] },
        { q: "Thời tiết đóng một vai trò lớn trong nông nghiệp.", hint: "The weather, plays a major / big role, in agriculture / farming (Ø)", answers: ["The weather plays a major role in agriculture.", "The weather plays a big role in agriculture.", "The weather plays a major role in farming.", "The weather plays a big role in farming.", "The weather plays an important role in agriculture.", "The weather plays a major part in agriculture.", "The weather plays a large role in agriculture.", "Weather plays a major role in agriculture."] },
      ],
    },

    { t: "h", text: "Phần IV — True / False / Not Given (6 câu · 8 phút)" },
    {
      t: "passage",
      title: "The Return of the Night Train",
      intro: "Read the passage and answer Questions 1–6.",
      paras: [
        { label: "A", text: "For much of the twentieth century, the night train was the normal way to cross Europe. Passengers boarded after dinner, slept in a narrow bunk and woke up in another country. From the 1990s, however, low-cost airlines and high-speed daytime trains took away most of their customers, and by 2015 the majority of sleeper routes had been cut." },
        { label: "B", text: "The revival began in Austria. In 2016, when Germany’s national railway abandoned its sleeper services, the Austrian state operator took over many of the routes and, to the surprise of many analysts, made them profitable. Since then, new night services have been launched from Brussels, Paris and Stockholm, some of them run by small private companies." },
        { label: "C", text: "Supporters point out that a night train produces far less carbon per passenger than a flight and saves the cost of a hotel room. Yet the business remains fragile. A sleeping carriage carries about a third as many people as an ordinary one, tickets are often more expensive than flying, and operators complain that new carriages take years to be delivered." },
      ],
    },
    {
      t: "mcq",
      id: "t3d3-bt-tfng",
      title: "Questions 1–6 — TRUE / FALSE / NOT GIVEN",
      items: [
        { q: "1. Night trains lost most of their passengers to cheaper flights and faster day trains.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "A: “**low-cost airlines** and **high-speed daytime trains** took away **most of their customers**.” low-cost = cheaper, high-speed = faster, customers = passengers (P1) → **TRUE**." },
        { q: "2. By 2015, every sleeper route in Europe had closed.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "A: “**the majority** of sleeper routes had been cut” ↔ **every** — khác mức độ → **FALSE** (bẫy ② từ mức độ)." },
        { q: "3. Germany’s national railway sold its sleeping carriages to the Austrian operator.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "B nói hãng Áo **tiếp quản nhiều tuyến** (took over many of the routes). Chuyện **bán toa xe** — bài không nhắc → **NOT GIVEN** (bẫy ④ thêm chi tiết)." },
        { q: "4. Experts had expected the Austrian night services to make money.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "B: “**to the surprise of many analysts**, made them profitable.” Ngạc nhiên ⇒ họ **không** ngờ là có lãi (P8) ↔ had expected → **FALSE**." },
        { q: "5. The service from Stockholm is the most popular of the new routes.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "B chỉ liệt kê Brussels, Paris, Stockholm — **không so** tuyến nào đông khách nhất → **NOT GIVEN** (bẫy ③ so sánh nhất)." },
        { q: "6. A sleeping carriage holds fewer passengers than a normal carriage.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "C: “carries about **a third as many people as an ordinary one**.” a third as many = fewer (P6); ordinary = normal (P1) → **TRUE**." },
      ],
    },

    { t: "h", text: "Phần V — Gọi tên phép paraphrase (4 câu)" },
    {
      t: "mcq",
      id: "t3d3-bt-phep",
      title: "Câu hỏi đã dùng phép nào?",
      items: [
        { q: "Bài: “tickets are often more expensive than flying” → Câu hỏi: “Flying is frequently cheaper than taking a night train.”", options: ["P7 Cụ thể ↔ khái quát", "P5 Đảo chiều so sánh", "P3 Đổi loại từ", "P8 Ý suy ra"], correct: 1, why: "Đổi chỗ hai vật so sánh + tính từ trái nghĩa (more expensive ↔ cheaper) — **P5**. Kèm P1: often = frequently." },
        { q: "Bài: “the Austrian operator made them profitable” → Câu hỏi: “The routes were made profitable by the Austrian operator.”", options: ["P4 Chủ động ↔ bị động", "P2 Trái nghĩa + phủ định", "P6 Con số ↔ lời", "P7 Cụ thể ↔ khái quát"], correct: 0, why: "Tân ngữ (them = the routes) lên làm chủ ngữ, động từ chuyển bị động — **P4**." },
        { q: "Bài: “new services have been launched from Brussels, Paris and Stockholm” → Câu hỏi: “New services now run from several European capitals.”", options: ["P2 Trái nghĩa + phủ định", "P5 Đảo chiều so sánh", "P7 Cụ thể ↔ khái quát", "P3 Đổi loại từ"], correct: 2, why: "Ba tên thành phố cụ thể → **several European capitals** (khái quát) — **P7**." },
        { q: "Bài: “the business remains fragile” → Câu hỏi: “The business is still not secure.”", options: ["P6 Con số ↔ lời", "P4 Chủ động ↔ bị động", "P8 Ý suy ra", "P2 Trái nghĩa + phủ định"], correct: 3, why: "fragile ↔ **not secure**: lấy từ trái nghĩa rồi thêm not — **P2**. Kèm P1: remains = is still." },
      ],
    },

    { t: "h", text: "Phần VI — Hoàn thành khung câu Part 1 (6 câu)" },
    {
      t: "quiz",
      id: "t3d3-bt-khung",
      title: "Điền MỘT từ vào mỗi chỗ trống",
      kind: "fill",
      items: [
        { q: "(What kind of music do you like most?) I like all kinds of music, but if I ___ to choose one, I’d go for jazz.", answers: ["had"], hint: "điều kiện loại 2: if + quá khứ" },
        { q: "(When did you last go to a market?) It’s been ages ___ I last went to a market.", answers: ["since"], hint: "It’s been… ___ I last + V2" },
        { q: "(Do you prefer tea or coffee?) It ___ on the time of day.", answers: ["depends"], hint: "tuỳ vào" },
        { q: "(How has your city changed?) There ___ to be rice fields here, but now it’s all apartment blocks.", answers: ["used"], hint: "trước đây từng…" },
        { q: "(What do you dislike about your phone?) The battery dies too fast. ___ from that, I’m very happy with it.", answers: ["Apart", "apart", "Aside", "aside"], hint: "ngoài chuyện đó ra" },
        { q: "(Do you like rainy days?) I do, as ___ as I don’t have to go out.", answers: ["long"], hint: "miễn là" },
      ],
    },

    { t: "h", text: "Phần VII — Ghi âm: Part 1 trộn ba chủ đề" },
    {
      t: "p",
      text: "Sáu câu, sáu khung khác nhau. Mỗi câu 15–25 giây. Nghe lại rồi tự chấm theo bảng “Tự chấm” cuối Bài 3 — đặc biệt là **thì** của khung last time / changed và chỗ **nối âm**.",
    },
    {
      t: "speak",
      id: "t3d3-bt-noi",
      part: "1",
      questions: [
        "How often do you buy new clothes?",
        "When was the last time you got caught in the rain?",
        "Do you prefer big shopping centres or small local shops?",
        "Is it easy to dress well in very hot weather?",
        "What do you dislike about the weather in your city?",
        "What kind of shops do you like most?",
      ],
    },
  ],
};

export const NGAY_3: Lesson[] = [T3D3_GRAMMAR, T3D3_READING, T3D3_SPEAKING, T3D3_HOMEWORK];
