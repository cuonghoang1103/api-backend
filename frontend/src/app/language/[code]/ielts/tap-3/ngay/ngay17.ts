/**
 * IELTS Tập 3 — Ngày 17 (tự soạn 18/11/2026; mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI):
 *   Bài 1 · Grammar   — Mệnh đề quan hệ không xác định · “, which” thay cả ý · of which / of whom · giới từ + which ·
 *                        rút gọn V-ing / V3 (cả khi nói Part 3) [G26, ôn G17 — nối G24 Ngày 13]
 *   Bài 2 · Reading   — Flow-chart completion 2 + Diagram label + ngôn ngữ quy trình vòng 2 (16 từ); bài đọc ~830 từ, 13 câu [R02 R16 VC07]
 *   Bài 3 · Listening — Part 3 ba người nói: Choose TWO ×2 + Flow-chart chọn từ hộp A–H; flow-chart viết từ [L05 L09 L11]
 *                        🔊 ngắt hơi trước mệnh đề quan hệ không xác định
 *   Bài tập           — 35 câu + 3 câu nói.
 * Nối: Tập 2 Ngày 15 (mệnh đề quan hệ xác định) · Tập 1 Ngày 6 (Flow-chart lần đầu) · Tập 2 Ngày 22 (Diagram label) ·
 *      Tập 2 Ngày 20 + Tập 1 Ngày 15 (ngôn ngữ quy trình vòng 1) · Tập 2 Ngày 13 (Part 3: chọn TWO, Flow-chart) · Tập 3 Ngày 13 (bị động).
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Bài 1 · Ngữ pháp ─────────────────────────── */

const T3D17_GRAMMAR: Lesson = {
  id: "t3d17-ngu-phap",
  kind: "grammar",
  title: "Ngữ pháp: Mệnh đề quan hệ không xác định · rút gọn V-ing / V-ed · giới từ + which",
  goal: "Thêm thông tin phụ vào câu bằng mệnh đề quan hệ không xác định (có dấu phẩy), dùng “, which” để bình luận cả một ý, viết most of whom / the extent to which, và rút gọn mệnh đề quan hệ thành V-ing / V-ed cả khi viết lẫn khi nói — nhóm câu phức đẩy GRA và CC lên band 6.",
  minutes: 85,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 15 bạn đã ghép câu bằng mệnh đề quan hệ **xác định** (who / which / that / whose / where — KHÔNG dấu phẩy). Hôm nay học nửa còn lại: mệnh đề quan hệ **không xác định** (non-defining) — ==có dấu phẩy==, chỉ **thêm thông tin phụ**.",
        "**“, which”** thay cho **cả mệnh đề đứng trước**: “Many people work from home, **which reduces** traffic.” Đây là câu nối nguyên nhân – kết quả tự nhiên nhất cho Task 2 và Part 3.",
        "**Lượng từ + of which / of whom** (most of whom, half of which) và **giới từ + which** (the extent to which, the way in which) — hai kiểu câu “đắt” cho Task 1 và Task 2.",
        "**Rút gọn**: bỏ who / which + be, giữ ==V-ing== (nghĩa chủ động) hoặc ==V-ed / V3== (nghĩa bị động): “people **living** in cities”, “the data **collected** in 2020”. Dùng được cả khi **nói** Part 3.",
        "Đẩy band: **GRA band 6** (trộn câu đơn + câu phức, lỗi hiếm khi làm sai nghĩa) và **CC** (gói hai ý vào một câu thay vì hai câu rời). Phát âm đi kèm: **ngắt hơi trước mệnh đề không xác định** (luyện ở bài Nghe hôm nay).",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Ôn 60 giây: mệnh đề quan hệ xác định (Tập 2 Ngày 15)" },
    {
      t: "table",
      caption: "Năm từ quan hệ đã học — nhìn lại trước khi học phần mới",
      head: ["Từ", "Thay cho", "Ví dụ (xác định — không dấu phẩy)"],
      rows: [
        ["**who**", "người", "Students **who work part-time** often sleep less."],
        ["**which**", "vật, ý tưởng", "The course **which I chose** lasts two years."],
        ["**that**", "người hoặc vật (chỉ ở mệnh đề xác định)", "The app **that I use** is free."],
        ["**whose**", "“của người / vật đó”", "Children **whose parents read to them** learn faster."],
        ["**where**", "nơi chốn (= in / at which)", "The town **where I grew up** has changed a lot."],
      ],
    },
    {
      t: "p",
      text: "Mệnh đề **xác định** trả lời câu hỏi “**người nào? cái nào?**” — bỏ nó đi thì người nghe không biết bạn đang nói về ai. Mệnh đề **không xác định** thì khác: người nghe **đã biết** bạn nói về ai, bạn chỉ **nói thêm** một thông tin. Tiếng Việt không có dấu hiệu riêng cho hai loại này, nên người Việt hay viết thiếu dấu phẩy hoặc dùng **that** sai chỗ.",
    },

    /* ── 2 ── */
    { t: "h", text: "2. Xác định hay không xác định? — dấu phẩy đổi nghĩa" },
    {
      t: "sodo",
      kind: "compare",
      title: "Cùng một câu — có và không có dấu phẩy",
      caption: "Xác định = chọn ra một phần trong nhóm. Không xác định = nói về cả nhóm rồi thêm thông tin.",
      cols: [
        {
          title: "Xác định (KHÔNG phẩy)",
          items: [
            "The students **who failed the test** had to retake it.",
            "→ Chỉ **những sinh viên trượt** mới thi lại (có người không trượt).",
            "My brother **who lives in Hue** is a doctor.",
            "→ Tôi có **nhiều anh em**; người ở Huế là bác sĩ.",
          ],
        },
        {
          title: "Không xác định (CÓ phẩy)",
          items: [
            "The students**, who failed the test,** had to retake it.",
            "→ **Tất cả** sinh viên đều trượt và đều thi lại.",
            "My brother**, who lives in Hue,** is a doctor.",
            "→ Tôi chỉ có **một anh / em trai**; nhân tiện: anh ấy ở Huế.",
          ],
        },
      ],
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N (đã rõ là ai / cái gì) , who / which / whose / where + … , V …",
          vi: "Mệnh đề chen GIỮA câu: hai dấu phẩy, một trước một sau.",
          examples: [
            { en: "Ho Chi Minh City, which has over nine million people, suffers from heavy traffic.", vi: "Thành phố Hồ Chí Minh, nơi có hơn chín triệu dân, chịu cảnh kẹt xe nặng." },
            { en: "My supervisor, who studied in Australia, speaks three languages.", vi: "Người hướng dẫn của tôi, người từng học ở Úc, nói được ba thứ tiếng." },
          ],
        },
        {
          formula: "S + V + N , who / which / whose / where + …",
          vi: "Mệnh đề ở CUỐI câu: một dấu phẩy trước, dấu chấm sau.",
          examples: [
            { en: "The survey was carried out in Da Nang, where tourism is the main industry.", vi: "Cuộc khảo sát được thực hiện ở Đà Nẵng, nơi du lịch là ngành chính." },
            { en: "I work with Ms Lan, whose team designed the app.", vi: "Tôi làm việc với chị Lan, người có nhóm đã thiết kế ứng dụng đó." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Khi nào danh từ “đã rõ” — gần như luôn dùng mệnh đề không xác định",
      head: ["Danh từ đứng trước", "Ví dụ"],
      rows: [
        ["Tên riêng (người, nơi, tổ chức)", "**Singapore, which** has few natural resources, invests heavily in education."],
        ["my / his / this / that + danh từ duy nhất", "**My mother, who** is sixty, still cycles to work."],
        ["Danh từ chỉ cả một loại (nói chung)", "**Plastic bags, which** take centuries to break down, are banned in many countries."],
        ["Danh từ vừa được nhắc ở câu trước", "The city built a new metro line. **The line, which** opened in 2021, carries 50,000 people a day."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Bốn lỗi người Việt hay sai với mệnh đề không xác định",
      items: [
        "**Dùng that sau dấu phẩy.** ~~Hanoi, that is the capital, is very crowded.~~ → Hanoi, **which** is the capital, is very crowded. Sau dấu phẩy chỉ dùng **who / whom / which / whose / where / when** — không bao giờ **that**.",
        "**Bỏ đại từ quan hệ.** Ở mệnh đề xác định bạn bỏ được đại từ tân ngữ (the book I bought). Ở mệnh đề không xác định thì **không bao giờ bỏ**: ~~My laptop, I bought last year, is slow.~~ → My laptop, **which** I bought last year, is slow.",
        "**Quên dấu phẩy thứ hai.** ~~My manager, who is from Korea speaks Vietnamese well.~~ → My manager, who is from Korea**,** speaks Vietnamese well. Mẹo: thử **bỏ cả cụm giữa hai dấu phẩy** — câu còn lại phải đứng được.",
        "**Lặp chủ ngữ / tân ngữ.** ~~Mr Nam, who he teaches maths, is strict.~~ → Mr Nam, **who teaches** maths, is strict. Who đã LÀ chủ ngữ rồi.",
      ],
    },
    {
      t: "rule",
      formula: "N đã rõ , who / which / whose / where + mệnh đề , V …",
      vi: "Thông tin THÊM (bỏ đi câu vẫn đủ nghĩa) → có dấu phẩy, không dùng that, không bỏ đại từ quan hệ.",
    },
    {
      t: "quiz",
      id: "t3d17-khong-xac-dinh-dich",
      title: "Dịch sang tiếng Anh — mệnh đề không xác định (4 câu)",
      kind: "translate",
      grammar: "N , who / which / whose / where + … , V … (máy không chấm dấu phẩy — bạn tự soát đủ HAI dấu phẩy)",
      items: [
        { q: "Hà Nội, nơi có hơn tám triệu dân, đang xây thêm các tuyến metro.", answers: ["Hanoi, which has over eight million people, is building more metro lines.", "Hanoi, which has more than eight million people, is building more metro lines.", "Hanoi, which has over eight million inhabitants, is building more metro lines.", "Hanoi, which has more than eight million inhabitants, is building more metro lines."], hint: "which has · over eight million people · is building" },
        { q: "Bố tôi, người đã nghỉ hưu năm ngoái, giờ dạy tiếng Anh miễn phí.", answers: ["My father, who retired last year, now teaches English for free.", "My father, who retired last year, teaches English for free now.", "My dad, who retired last year, now teaches English for free."], hint: "who retired · now teaches · for free" },
        { q: "Cuộc khảo sát được thực hiện ở Đà Nẵng, nơi du lịch là ngành chính.", answers: ["The survey was carried out in Da Nang, where tourism is the main industry.", "The survey was conducted in Da Nang, where tourism is the main industry."], hint: "was carried out · where · the main industry" },
        { q: "Chị Mai, người có nhóm đã thắng cuộc thi, sẽ thuyết trình vào ngày mai.", answers: ["Ms Mai, whose team won the competition, will give a presentation tomorrow.", "Ms Mai, whose team won the competition, is going to give a presentation tomorrow.", "Ms Mai, whose team won the contest, will give a presentation tomorrow.", "Mai, whose team won the competition, will give a presentation tomorrow."], hint: "whose team won · give a presentation" },
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. “, which” thay cho CẢ một ý — câu bình luận ăn điểm" },
    {
      t: "p",
      text: "Ở mục 2, **which** thay cho một danh từ. Nhưng **“, which”** còn một cách dùng nữa rất hay gặp ở band 6–7: nó thay cho **toàn bộ mệnh đề đứng trước** — nghĩa là “**điều này**”. Người Việt thường viết hai câu: “Many people work from home. **This** reduces traffic.” Gộp lại bằng “, which” là bạn có ngay một câu phức đúng và mạch lạc.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "S + V … , which + V(s/es) …",
          vi: "which = “điều này” (cả ý phía trước) → động từ sau which luôn chia SỐ ÍT.",
          examples: [
            { en: "More people are working from home, which reduces traffic at rush hour.", vi: "Ngày càng nhiều người làm việc ở nhà, điều này làm giảm kẹt xe giờ cao điểm." },
            { en: "Tuition fees have doubled, which means that many students have to take out loans.", vi: "Học phí đã tăng gấp đôi, nghĩa là nhiều sinh viên phải vay tiền." },
          ],
        },
        {
          formula: "S + V … , which is why / which explains why + S + V",
          vi: "Nối thẳng sang kết quả: “đó là lý do vì sao…”.",
          examples: [
            { en: "Public transport is cheap and reliable there, which is why few people own a car.", vi: "Giao thông công cộng ở đó rẻ và đáng tin cậy, đó là lý do ít người có ô tô." },
          ],
        },
        {
          formula: "S + V … , which in turn + V(s/es) …",
          vi: "Chuỗi hệ quả hai tầng (dùng lại ở bài Viết Ngày 18).",
          examples: [
            { en: "Teenagers sleep less, which in turn affects their results at school.", vi: "Thanh thiếu niên ngủ ít hơn, điều này đến lượt nó lại ảnh hưởng tới kết quả học tập." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Sáu cụm đi sau “, which” — thuộc lòng để dùng trong Task 2 và Part 3",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        [", which means (that)…", "nghĩa là…", "Rents are rising, **which means** young people cannot move out."],
        [", which leads to / results in…", "dẫn tới…", "Factories release waste into rivers, **which leads to** serious health problems."],
        [", which makes it + adj + to V", "khiến việc… trở nên…", "The job requires night shifts, **which makes it difficult to** have a family life."],
        [", which allows / enables sb to V", "cho phép ai làm gì", "Lectures are recorded, **which allows** students **to** review them later."],
        [", which is why…", "đó là lý do…", "The exam is in English, **which is why** I started this course."],
        [", which suggests (that)…", "điều này cho thấy… (Task 1, Reading)", "Sales fell every winter, **which suggests that** demand is seasonal."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Cẩn thận: chia động từ sau “, which” và đừng dùng “, that / , it”",
      items: [
        "which = cả một ý → động từ **số ít**: ~~Many shops have closed, which **mean**…~~ → which **means**…",
        "Không nối hai câu bằng dấu phẩy + it / this (lỗi comma splice): ~~Prices went up, **it** made people angry.~~ → Prices went up**, which** made people angry. (hoặc chấm câu: Prices went up. **This** made people angry.)",
        "Đừng lạm dụng: mỗi đoạn thân bài **một – hai lần** là đủ. Viết câu nào cũng “, which” thì bài thành một chuỗi dài lê thê.",
      ],
    },
    {
      t: "rule",
      formula: "S + V … , which + V(s/es) …  (which = cả ý đứng trước)",
      vi: "Gộp “… . This means…” thành một câu: “…, which means…”. Động từ sau which chia số ít.",
    },
    {
      t: "quiz",
      id: "t3d17-which-ca-cau-dich",
      title: "Dịch sang tiếng Anh — “, which” thay cả một ý (4 câu)",
      kind: "translate",
      grammar: "S + V … , which + V(s/es) …",
      items: [
        { q: "Nhiều công ty cho phép nhân viên làm việc ở nhà, điều này giúp giảm kẹt xe.", answers: ["Many companies allow employees to work from home, which reduces traffic congestion.", "Many companies allow their employees to work from home, which reduces traffic congestion.", "Many companies allow employees to work from home, which reduces traffic jams.", "Many companies allow employees to work from home, which helps to reduce traffic congestion.", "Many companies allow employees to work from home, which helps reduce traffic congestion.", "Many companies allow employees to work from home, which reduces traffic."], hint: "allow employees to V · which reduces · traffic congestion" },
        { q: "Giá nhà đã tăng gấp đôi, nghĩa là người trẻ không mua nổi căn hộ.", answers: ["House prices have doubled, which means that young people cannot afford a flat.", "House prices have doubled, which means young people cannot afford a flat.", "House prices have doubled, which means that young people cannot afford an apartment.", "House prices have doubled, which means young people cannot afford an apartment.", "House prices have doubled, which means that young people cannot afford to buy a flat.", "House prices have doubled, which means that young people cannot afford to buy an apartment."], hint: "have doubled · which means (that) · cannot afford" },
        { q: "Bài thi bằng tiếng Anh, đó là lý do tôi bắt đầu khoá học này.", answers: ["The exam is in English, which is why I started this course.", "The test is in English, which is why I started this course.", "The exam is in English, which is why I began this course."], hint: "which is why · started" },
        { q: "Trẻ em dành ít thời gian ngoài trời hơn, điều này dẫn tới các vấn đề sức khoẻ.", answers: ["Children spend less time outdoors, which leads to health problems.", "Children spend less time outside, which leads to health problems.", "Children spend less time outdoors, which results in health problems.", "Children spend less time outdoors, which causes health problems."], hint: "spend less time outdoors · which leads to" },
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Lượng từ + of which / of whom — câu số liệu cho Task 1" },
    {
      t: "p",
      text: "Khi muốn nói “**trong số đó, phần lớn / một nửa / 30% …**”, người Việt hay viết ~~“…, most of them are…”~~ — đây là lỗi nối hai câu bằng dấu phẩy. Tiếng Anh dùng **lượng từ + of whom** (người) hoặc **of which** (vật).",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N (người) , most / many / half / 30% / none + of whom + V …",
          vi: "“…, trong số họ phần lớn / một nửa…”.",
          examples: [
            { en: "The company employs 400 people, most of whom work remotely.", vi: "Công ty có 400 nhân viên, phần lớn trong số họ làm việc từ xa." },
            { en: "We interviewed 60 students, a third of whom had a part-time job.", vi: "Chúng tôi phỏng vấn 60 sinh viên, một phần ba trong số đó có việc làm thêm." },
          ],
        },
        {
          formula: "N (vật) , most / half / two / the majority + of which + V …",
          vi: "“…, trong đó phần lớn / hai cái…”.",
          examples: [
            { en: "The city has twelve museums, two of which are free.", vi: "Thành phố có mười hai bảo tàng, trong đó hai cái miễn phí." },
            { en: "The country produced 80 million tonnes of waste, half of which was recycled.", vi: "Nước này thải ra 80 triệu tấn rác, một nửa trong số đó được tái chế." },
          ],
        },
        {
          formula: "N , the + so sánh nhất + of which + be …",
          vi: "Chọn ra cái nổi bật nhất — rất hợp câu overview Task 1.",
          examples: [
            { en: "The chart shows five sources of energy, the largest of which is coal.", vi: "Biểu đồ cho thấy năm nguồn năng lượng, lớn nhất trong đó là than." },
          ],
        },
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai: of them ≠ of which",
      items: [
        "~~The city has twelve museums, two **of them** are free.~~ — hai mệnh đề nối bằng dấu phẩy → sai. Sửa: “…, two **of which** are free.” hoặc “… twelve museums**. Two of them** are free.”",
        "Người → **of whom** (không phải ~~of who~~). Vật → **of which**.",
        "Động từ chia theo danh từ thật: half of **which (waste) was** recycled · most of **whom (people) work** remotely.",
      ],
    },
    {
      t: "rule",
      formula: "N , most / half / two / 30% + of which / of whom + V …",
      vi: "“Trong số đó…” — không viết “, most of them are…”. Người: of whom; vật: of which.",
    },
    {
      t: "quiz",
      id: "t3d17-of-which-dien",
      title: "Điền of which hoặc of whom + chia động từ trong ngoặc (5 câu)",
      kind: "fill",
      items: [
        { q: "The university has 20,000 students, a quarter ______ (come) from abroad.", answers: ["of whom come"], hint: "người + số nhiều" },
        { q: "The town has three cinemas, one ______ (be) closed for repairs at the moment.", answers: ["of which is"], hint: "vật · one → số ít" },
        { q: "The survey covered 500 households, the majority ______ (own) at least one car.", answers: ["of which own", "of which owned"], hint: "households là vật (hộ gia đình)" },
        { q: "She has four brothers, none ______ (live) in Vietnam now.", answers: ["of whom live", "of whom lives"], hint: "người · none: số ít hay số nhiều đều được chấp nhận" },
        { q: "The graph compares six countries, the richest ______ (be) Norway.", answers: ["of which is"], hint: "the + so sánh nhất + of which" },
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Giới từ + which / whom — văn viết trang trọng" },
    {
      t: "p",
      text: "Khi động từ trong mệnh đề quan hệ có giới từ (live **in**, depend **on**, talk **to**), văn nói để giới từ ở **cuối**; văn viết học thuật đưa giới từ lên **trước which / whom**. Ở band 6 bạn cần **nhận ra** cấu trúc này khi đọc (Reading dùng rất nhiều) và **dùng được vài cụm cố định**.",
    },
    {
      t: "table",
      caption: "Văn nói → văn viết",
      head: ["Văn nói / thân mật", "Văn viết trang trọng"],
      rows: [
        ["the house (which) I grew up **in**", "the house **in which** I grew up (= **where** I grew up)"],
        ["the people (who) I work **with**", "the people **with whom** I work"],
        ["the year (which) the law changed **in**", "the year **in which** the law changed (= **when**)"],
        ["the topic (which) we talked **about**", "the topic **about which** we talked"],
        ["the company (which) she works **for**", "the company **for which** she works"],
      ],
    },
    {
      t: "table",
      caption: "Năm cụm cố định đáng thuộc — xuất hiện ở cả đề Task 2 và Reading",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["**the extent to which** + S + V", "mức độ mà…", "The essay discusses **the extent to which** technology improves learning."],
        ["**the way in which** + S + V", "cách mà…", "Social media has changed **the way in which** people communicate."],
        ["**the reason why / for which** + S + V", "lý do mà…", "There are several **reasons why** young people leave the countryside."],
        ["**a situation in which** + S + V", "tình huống mà…", "This creates **a situation in which** nobody takes responsibility."],
        ["**the period during which** + S + V", "giai đoạn mà…", "**The period during which** sales rose fastest was 2015–2018."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai: giới từ + that / who, và thừa giới từ",
      items: [
        "Sau giới từ chỉ dùng **which** (vật) hoặc **whom** (người): ~~the city in **that** I live~~ · ~~the people with **who** I work~~.",
        "Đã đưa giới từ lên trước thì **không lặp lại ở cuối**: ~~the house in which I grew up **in**~~.",
        "**where** đã gồm sẵn giới từ: ~~the city where I live **in**~~ → the city **where** I live / the city **in which** I live.",
      ],
    },
    {
      t: "rule",
      formula: "N + giới từ + which / whom + S + V   (in which = where · the extent to which · the way in which)",
      vi: "Văn viết: giới từ đứng trước which / whom; không dùng that / who sau giới từ; không lặp giới từ ở cuối.",
    },
    {
      t: "quiz",
      id: "t3d17-gioi-tu-which-dich",
      title: "Dịch sang tiếng Anh — giới từ + which (3 câu)",
      kind: "translate",
      grammar: "the way in which · the extent to which · N + in which",
      items: [
        { q: "Mạng xã hội đã thay đổi cách mà mọi người giao tiếp.", answers: ["Social media has changed the way in which people communicate.", "Social media has changed the way people communicate.", "Social media has changed the way that people communicate."], hint: "has changed · the way in which · communicate" },
        { q: "Bài luận này bàn về mức độ mà quảng cáo ảnh hưởng tới trẻ em.", answers: ["This essay discusses the extent to which advertising influences children.", "This essay discusses the extent to which advertising affects children.", "This essay will discuss the extent to which advertising influences children.", "This essay will discuss the extent to which advertising affects children."], hint: "discusses · the extent to which · advertising influences" },
        { q: "Đây là căn phòng mà trong đó bản hợp đồng được ký.", answers: ["This is the room in which the contract was signed.", "This is the room where the contract was signed."], hint: "the room in which · was signed" },
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Rút gọn bằng V-ing — nghĩa chủ động" },
    {
      t: "p",
      text: "Khi từ quan hệ (who / which / that) là **chủ ngữ** và động từ sau nó ở dạng **chủ động**, bạn có thể **bỏ từ quan hệ (và be nếu có), đổi động từ thành V-ing**. Câu ngắn hơn, “dày” thông tin hơn — đúng kiểu câu của bài Reading và bài viết band 6+. V-ing ở đây **không mang thì**: nó theo thì của động từ chính.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N + who / which / that + V (chủ động)  →  N + V-ing",
          vi: "Bỏ từ quan hệ, đổi động từ sang V-ing — gốc là hiện tại đơn, tiếp diễn, hoặc quá khứ đơn chỉ trạng thái / thói quen (một hành động đơn lẻ đã xong thì KHÔNG rút — xem bảng dưới).",
          examples: [
            { en: "People who live in big cities often suffer from stress. → People living in big cities often suffer from stress.", vi: "Người sống ở thành phố lớn thường bị căng thẳng." },
            { en: "The road which leads to the airport was closed. → The road leading to the airport was closed.", vi: "Con đường dẫn tới sân bay đã bị đóng." },
            { en: "Anyone who wants to apply must fill in this form. → Anyone wanting to apply must fill in this form.", vi: "Ai muốn nộp đơn đều phải điền mẫu này." },
          ],
        },
        {
          formula: "N + who / which + am / is / are / was / were + V-ing  →  N + V-ing",
          vi: "Có sẵn be + V-ing thì chỉ việc bỏ who / which + be.",
          examples: [
            { en: "The man who is talking to the manager is my uncle. → The man talking to the manager is my uncle.", vi: "Người đàn ông đang nói chuyện với quản lý là chú tôi." },
          ],
        },
        {
          formula: "N , which + V(s/es) …  →  N , V-ing …   (cả mệnh đề “, which”)",
          vi: "“, which leads to…” rút thành “, leading to…” — rất hay dùng trong Task 1 và Task 2. (Nói chính xác, “, V-ing” ở cuối câu là **mệnh đề phân từ chỉ kết quả** — nên nó dùng được cả cho việc đã xong trong quá khứ, khác với bảng “khi nào KHÔNG rút gọn” bên dưới.)",
          examples: [
            { en: "The factory closed in 2019, which caused 300 job losses. → The factory closed in 2019, causing 300 job losses.", vi: "Nhà máy đóng cửa năm 2019, gây ra 300 trường hợp mất việc." },
            { en: "Sales rose sharply, reaching a peak of 5 million in 2020.", vi: "Doanh số tăng mạnh, đạt đỉnh 5 triệu vào năm 2020." },
          ],
        },
      ],
    },
    {
      t: "table",
      caption: "Khi nào KHÔNG rút gọn bằng V-ing",
      head: ["Trường hợp", "Ví dụ", "Vì sao"],
      rows: [
        ["Từ quan hệ là **tân ngữ**", "the book **which I bought** → ~~the book buying~~", "Chủ ngữ của mệnh đề là “I”, không phải “the book” — chỉ bỏ được which: the book I bought."],
        ["**Một hành động đơn lẻ đã xong** trong quá khứ", "the man **who phoned** yesterday → ~~the man phoning yesterday~~", "V-ing gợi ý việc đang diễn ra / thường xuyên. Giữ nguyên mệnh đề đầy đủ."],
        ["Có **modal** hoặc **thì hoàn thành** mang nghĩa riêng", "students **who have finished** the test → giữ nguyên", "Rút thành “finishing” làm mất nghĩa “đã xong”."],
        ["**whose / where**", "children **whose parents work** abroad → giữ nguyên", "Chỉ rút được khi từ quan hệ là chủ ngữ (who / which / that)."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai: câu có HAI động từ chia",
      items: [
        "~~People **live** in cities often **suffer** from stress.~~ — hai động từ chia cạnh nhau mà không có từ nối. Phải là **who live** hoặc **living**.",
        "~~The number of people **are using** the internet is rising.~~ → The number of people **using** the internet is rising. (động từ chính là **is rising**)",
        "Động từ trạng thái (know, own, contain, belong…) không dùng ở thì tiếp diễn nhưng **vẫn rút gọn bằng V-ing được**: a box **which contains** old photos → a box **containing** old photos.",
      ],
    },
    {
      t: "rule",
      formula: "N + who / which / that + V (chủ động)  →  N + V-ing",
      vi: "Từ quan hệ là chủ ngữ + nghĩa chủ động → bỏ từ quan hệ, dùng V-ing. Mỗi câu vẫn chỉ MỘT động từ chính được chia.",
    },
    {
      t: "quiz",
      id: "t3d17-rut-gon-ving-dich",
      title: "Dịch sang tiếng Anh — bắt buộc dùng V-ing rút gọn (4 câu)",
      kind: "translate",
      grammar: "N + V-ing … + V chính",
      items: [
        { q: "Số người sử dụng xe buýt đã tăng gấp đôi.", answers: ["The number of people using buses has doubled.", "The number of people using the bus has doubled.", "The number of people using buses doubled."], hint: "The number of people using… · has doubled" },
        { q: "Sinh viên sống xa trường thường tốn nhiều tiền đi lại hơn.", answers: ["Students living far from campus often spend more on transport.", "Students living far from the university often spend more on transport.", "Students living far from campus often spend more money on transport.", "Students living far from university often spend more on transport.", "Students living far from the university often spend more money on transport.", "Students living far from school often spend more on transport."], hint: "Students living far from… · spend more on transport" },
        { q: "Có một con đường dẫn thẳng tới bãi biển.", answers: ["There is a road leading directly to the beach.", "There is a road leading straight to the beach.", "There is a path leading directly to the beach.", "There is a path leading straight to the beach."], hint: "There is a road leading… · directly to" },
        { q: "Nhà máy đóng cửa năm 2020, gây ra hai trăm trường hợp mất việc.", answers: ["The factory closed in 2020, causing two hundred job losses.", "The factory closed in 2020, causing 200 job losses.", "The factory closed down in 2020, causing 200 job losses.", "The factory closed down in 2020, causing two hundred job losses."], hint: "closed in 2020 · , causing · job losses" },
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Rút gọn bằng V-ed / V3 — nghĩa bị động (nối Ngày 13)" },
    {
      t: "p",
      text: "Ngày 13 bạn đã học bị động ở mọi thì. Khi mệnh đề quan hệ ở **bị động** (which **is / was / are / were + V3**), rút gọn bằng cách **bỏ which + be, giữ lại V3**. Đây là cấu trúc dùng nhiều nhất trong bài tả **quy trình** (Task 1 process) và trong bài Reading hôm nay.",
    },
    {
      t: "patterns",
      rows: [
        {
          formula: "N + which / who + be + V3  →  N + V3",
          vi: "Bỏ từ quan hệ + be; V3 đứng ngay sau danh từ.",
          examples: [
            { en: "The data which were collected in 2020 show a clear trend. → The data collected in 2020 show a clear trend.", vi: "Số liệu được thu thập năm 2020 cho thấy một xu hướng rõ." },
            { en: "Students who are taught in small groups ask more questions. → Students taught in small groups ask more questions.", vi: "Sinh viên được dạy theo nhóm nhỏ hỏi nhiều hơn." },
            { en: "The water is stored in a tank which is located on the roof. → The water is stored in a tank located on the roof.", vi: "Nước được chứa trong một bể đặt trên mái nhà." },
          ],
        },
        {
          formula: "N + which + is / are being + V3  →  N + being + V3",
          vi: "Việc ĐANG được làm (bị động tiếp diễn) → giữ being.",
          examples: [
            { en: "The bridge which is being built will open next year. → The bridge being built will open next year.", vi: "Cây cầu đang được xây sẽ thông xe năm sau." },
          ],
        },
        {
          formula: "N , which + be + V3 …  →  N , V3 …",
          vi: "Mệnh đề không xác định bị động cũng rút được — giữ dấu phẩy.",
          examples: [
            { en: "The museum, which was built in 1902, attracts a million visitors a year. → The museum, built in 1902, attracts a million visitors a year.", vi: "Bảo tàng, được xây năm 1902, thu hút một triệu khách mỗi năm." },
          ],
        },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Chọn V-ing hay V3? — hỏi một câu duy nhất",
      caption: "Danh từ đứng trước TỰ làm hành động → V-ing. Danh từ đứng trước BỊ / ĐƯỢC làm → V3.",
      steps: [
        { label: "Tìm danh từ đứng trước", sub: "the people ___ · the data ___" },
        { label: "Hỏi: danh từ này tự làm hay bị làm?", sub: "people live (tự làm) · data are collected (được làm)" },
        { label: "Tự làm → **V-ing**", sub: "people **living** in cities" },
        { label: "Bị / được làm → **V3**", sub: "data **collected** in 2020" },
      ],
    },
    {
      t: "note",
      title: "⚠️ Hay sai: lẫn V-ing và V3",
      items: [
        "~~the products **making** in China~~ → the products **made** in China (sản phẩm **được** làm ra).",
        "~~the problems **caused** pollution~~ (nếu ý là “các vấn đề gây ra ô nhiễm”) → the problems **causing** pollution. Còn “the problems **caused by** pollution” = các vấn đề **do** ô nhiễm gây ra — nhìn chữ **by**.",
        "Động từ bất quy tắc: nhớ dùng **cột 3**: the letter **written** (không ~~wrote~~) · the money **spent** · the photo **taken** · the house **built**.",
      ],
    },
    {
      t: "rule",
      formula: "N + which / who + be + V3  →  N + V3 (+ by …)",
      vi: "Mệnh đề quan hệ bị động → bỏ từ quan hệ và be, giữ V3. Chủ động → V-ing; bị động → V3.",
    },
    {
      t: "quiz",
      id: "t3d17-rut-gon-ved-dich",
      title: "Dịch sang tiếng Anh — bắt buộc dùng V3 rút gọn (4 câu)",
      kind: "translate",
      grammar: "N + V3 (+ by / in …) + V chính",
      items: [
        { q: "Số liệu được thu thập năm ngoái cho thấy một sự sụt giảm mạnh.", answers: ["The data collected last year show a sharp decline.", "The data collected last year shows a sharp decline.", "The data collected last year show a sharp fall.", "The data collected last year shows a sharp fall.", "The data collected last year show a sharp decrease.", "The data collected last year shows a sharp decrease.", "The data collected last year show a sharp drop.", "The data collected last year shows a sharp drop."], hint: "The data collected last year · show(s) · a sharp decline" },
        { q: "Hầu hết quần áo bán ở cửa hàng này được làm ở Việt Nam.", answers: ["Most of the clothes sold in this shop are made in Vietnam.", "Most clothes sold in this shop are made in Vietnam.", "Most of the clothes sold in this store are made in Vietnam.", "Most clothes sold in this store are made in Vietnam.", "Most of the clothes sold at this shop are made in Vietnam."], hint: "clothes sold in this shop · are made" },
        { q: "Nước được chứa trong một bể đặt dưới lòng đất.", answers: ["The water is stored in a tank located underground.", "Water is stored in a tank located underground.", "The water is stored in a tank located under the ground.", "The water is stored in a tank placed underground.", "The water is kept in a tank located underground."], hint: "is stored · a tank located underground" },
        { q: "Cây cầu đang được xây sẽ nối hai tỉnh.", answers: ["The bridge being built will connect the two provinces.", "The bridge being built will link the two provinces.", "The bridge being built will connect two provinces.", "The bridge being constructed will connect the two provinces.", "The bridge being built will join the two provinces."], hint: "The bridge being built · will connect" },
      ],
    },
    {
      t: "mcq",
      id: "t3d17-ving-ved-chon",
      title: "V-ing hay V3? (8 câu)",
      items: [
        { q: "The number of students ______ abroad has risen by 20%.", options: ["studied", "studying", "study", "are studying"], correct: 1, why: "Students **tự** đi học (chủ động) → **studying**. “are studying” làm câu có hai động từ chia (are studying … has risen)." },
        { q: "The report ______ last week contains several mistakes.", options: ["published", "publishing", "was published", "publish"], correct: 0, why: "Báo cáo **được** xuất bản (bị động) → **published**. “was published” thành hai động từ chia." },
        { q: "Salt is one of the minerals ______ in seawater.", options: ["finding", "find", "found", "which found"], correct: 2, why: "Khoáng chất **được tìm thấy** → **found** (V3 của find)." },
        { q: "Anyone ______ to join the club should speak to Ms Hoa.", options: ["wished", "wishes", "is wishing", "wishing"], correct: 3, why: "Anyone **tự** muốn → **wishing** (= who wishes). “wishes” làm câu có hai động từ chia." },
        { q: "The liquid ______ at the bottom of the tank is removed every day.", options: ["remaining", "remained", "remains", "is remaining"], correct: 0, why: "remain là nội động từ, không có bị động; chất lỏng **tự** còn lại → **remaining**." },
        { q: "The houses ______ by the flood were rebuilt within a year.", options: ["damaging", "damaged", "were damaged", "damage"], correct: 1, why: "Có **by the flood** → nhà **bị** hư hại → **damaged**." },
        { q: "There is a pipe ______ the tank to the kitchen.", options: ["connected", "connects", "connecting", "is connecting"], correct: 2, why: "Ống **tự** nối bể với bếp (chủ động, có tân ngữ “the tank”) → **connecting**. (“a pipe connected **to** the tank” mới dùng V3.)" },
        { q: "The method ______ in this study was first developed in Japan.", options: ["using", "uses", "which used", "used"], correct: 3, why: "Phương pháp **được dùng** → **used**. “which used” thiếu be (which **was** used)." },
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Ba kiểu rút gọn khác — nhận ra khi đọc" },
    {
      t: "table",
      caption: "Bỏ “who / which + be”, giữ lại phần sau",
      head: ["Phần còn lại", "Đầy đủ", "Rút gọn"],
      rows: [
        ["**Cụm danh từ** (đồng vị)", "Hanoi, **which is** the capital of Vietnam, is famous for its street food.", "Hanoi, **the capital of Vietnam,** is famous for its street food."],
        ["**Tính từ + giới từ**", "Students **who are** interested in the course should register.", "Students **interested in** the course should register."],
        ["**Cụm giới từ**", "The shop **which is** on the corner sells phones.", "The shop **on the corner** sells phones."],
      ],
    },
    {
      t: "p",
      text: "Ba tính từ hay đứng sau danh từ theo kiểu này: **responsible for** (the people responsible for the decision), **available to** (the services available to students), **involved in** (the companies involved in the project). Thấy tính từ đứng **sau** danh từ thì hiểu ngay là mệnh đề quan hệ đã bị rút gọn.",
    },

    /* ── 9 ── */
    { t: "h", text: "9. Dùng khi NÓI: Speaking Part 3" },
    {
      t: "p",
      text: "Rút gọn không chỉ dành cho bài viết. Khi nói về **các nhóm người** ở Part 3, “people **living** in…”, “students **working** part-time”, “products **made** in…” giúp bạn nói nhanh và gọn hơn “people who are living…”. Còn “**, which**” là cách tự nhiên nhất để **thêm bình luận** mà không phải bắt đầu câu mới. Khi nói mệnh đề không xác định, bạn **ngắt một nhịp ngắn** ở chỗ dấu phẩy (luyện ở bài Nghe hôm nay, mục phát âm).",
    },
    {
      t: "dialogue",
      title: "Band 5 (ước tính) — toàn câu đơn",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think people in cities are healthier than people in the countryside?", vi: "Bạn có nghĩ người thành phố khoẻ hơn người ở nông thôn không?" },
        { who: "Candidate", role: "candidate", text: "I think no. People live in city, they have stress. They sit all day. The air is dirty. People in countryside, they walk more. So they are more healthy.", vi: "Tôi nghĩ là không. Người sống ở thành phố, họ bị căng thẳng. Họ ngồi cả ngày. Không khí bẩn. Người ở nông thôn, họ đi bộ nhiều hơn. Nên họ khoẻ hơn." },
      ],
    },
    {
      t: "dialogue",
      title: "Band 6 (ước tính) — cùng ý, thêm mệnh đề quan hệ",
      lines: [
        { who: "Examiner", role: "examiner", text: "Do you think people in cities are healthier than people in the countryside?", vi: "Bạn có nghĩ người thành phố khoẻ hơn người ở nông thôn không?" },
        { who: "Candidate", role: "candidate", text: "Not really, to be honest. People living in big cities usually have office jobs, which means they sit for eight or nine hours a day. On top of that, the air in places like Hanoi, where I study, is quite polluted. People working on farms, on the other hand, are active all day. So although cities have better hospitals, most of which are far too crowded anyway, I'd say country people are generally fitter.", vi: "Thật lòng thì không hẳn. Người sống ở thành phố lớn thường làm văn phòng, nghĩa là họ ngồi tám chín tiếng một ngày. Thêm vào đó, không khí ở những nơi như Hà Nội, nơi tôi đang học, khá ô nhiễm. Ngược lại, người làm việc ở nông trại vận động cả ngày. Nên dù thành phố có bệnh viện tốt hơn, mà phần lớn lại quá tải, tôi cho rằng người nông thôn nhìn chung khoẻ hơn." },
      ],
    },
    {
      t: "table",
      caption: "Câu band 6 có gì mà câu band 5 không có?",
      head: ["Cấu trúc", "Trong câu trả lời band 6", "Thay cho câu band 5"],
      rows: [
        ["V-ing rút gọn", "People **living** in big cities · People **working** on farms", "~~People live in city, they…~~ (hai động từ chia + lặp chủ ngữ)"],
        ["“, which” thay cả ý", "…have office jobs**, which means** they sit for eight or nine hours", "They sit all day. (câu rời, không nói vì sao)"],
        ["where không xác định", "places like Hanoi**, where I study,**", "(không có thông tin cá nhân)"],
        ["lượng từ + of which", "better hospitals**, most of which** are far too crowded", "(không có nhượng bộ)"],
      ],
    },
    {
      t: "rule",
      formula: "People + V-ing … + V … , which means (that) + S + V",
      vi: "Khung nói Part 3: gọi tên nhóm người bằng V-ing rút gọn, rồi thêm hệ quả bằng “, which means…”.",
    },

    /* ── 10 ── */
    { t: "h", text: "10. Luyện tổng hợp" },
    {
      t: "quiz",
      id: "t3d17-ghep-cau",
      title: "Ghép hai câu thành MỘT — theo gợi ý trong ngoặc (6 câu)",
      kind: "translate",
      grammar: "non-defining · , which · of which / of whom · V-ing · V3",
      items: [
        { q: "My laptop is very slow. I bought it in 2018. (, which … ,)", answers: ["My laptop, which I bought in 2018, is very slow."], hint: "My laptop, which I bought…, is…" },
        { q: "The bus was late. This made me miss the exam. (, which)", answers: ["The bus was late, which made me miss the exam."], hint: "…, which made me miss…" },
        { q: "The school has 40 teachers. Most of them are under 35. (of whom)", answers: ["The school has 40 teachers, most of whom are under 35."], hint: "…, most of whom are…" },
        { q: "Many tourists visit Hoi An. They come from Europe. (V-ing — bắt đầu bằng Many tourists)", answers: ["Many tourists visiting Hoi An come from Europe.", "Many tourists coming from Europe visit Hoi An."], hint: "Many tourists visiting Hoi An come…" },
        { q: "The bridge was built in 1990. It needs repairing. (V3 — bắt đầu bằng The bridge)", answers: ["The bridge built in 1990 needs repairing.", "The bridge, built in 1990, needs repairing."], hint: "The bridge built in 1990 needs…" },
        { q: "Prices rose by 10%. They reached a record high. (, V-ing)", answers: ["Prices rose by 10%, reaching a record high."], hint: "…, reaching a record high" },
      ],
    },
    {
      t: "mcq",
      id: "t3d17-sua-loi",
      title: "Câu nào ĐÚNG? (6 câu)",
      items: [
        { q: "Chọn câu đúng.", options: ["Da Lat, that is in the Central Highlands, is cool all year.", "Da Lat which is in the Central Highlands, is cool all year.", "Da Lat, which is in the Central Highlands, is cool all year.", "Da Lat, is in the Central Highlands, is cool all year."], correct: 2, why: "Tên riêng → không xác định: **hai dấu phẩy + which**. A dùng that sau dấu phẩy; B thiếu dấu phẩy đầu; D thiếu từ quan hệ." },
        { q: "Chọn câu đúng.", options: ["The city has ten parks, three of which are closed.", "The city has ten parks, three of them are closed.", "The city has ten parks, three of whom are closed.", "The city has ten parks, which three are closed."], correct: 0, why: "Vật → **of which**. B là comma splice; C dùng whom cho vật; D sai trật tự." },
        { q: "Chọn câu đúng.", options: ["People work at night often sleep badly.", "People who working at night often sleep badly.", "People are working at night often sleep badly.", "People working at night often sleep badly."], correct: 3, why: "**People working** = People who work. A và C có hai động từ chia; B thừa who (phải là who work)." },
        { q: "Chọn câu đúng.", options: ["More people cycle to work, which reduce pollution.", "More people cycle to work, which reduces pollution.", "More people cycle to work, it reduces pollution.", "More people cycle to work, that reduces pollution."], correct: 1, why: "which = cả ý phía trước → **reduces** (số ít). C là comma splice; D dùng that sau dấu phẩy." },
        { q: "Chọn câu đúng.", options: ["This is the office in which I work.", "This is the office in that I work.", "This is the office where I work in.", "This is the office in which I work in."], correct: 0, why: "Giới từ + **which**. B: không dùng that sau giới từ; C: where đã gồm giới từ; D: lặp giới từ." },
        { q: "Chọn câu đúng.", options: ["The goods producing in this factory are exported to Japan.", "The goods which produced in this factory are exported to Japan.", "The goods produced in this factory are exported to Japan.", "The goods are produced in this factory are exported to Japan."], correct: 2, why: "Hàng hoá **được** sản xuất → **produced**. A sai nghĩa chủ động; B thiếu be (which **are** produced); D hai động từ chia." },
      ],
    },
    {
      t: "note",
      title: "Mẹo dùng trong bài thi",
      items: [
        "**Task 1:** “…, reaching a peak of…”, “…, the largest of which was…”, “the figures **shown** in the chart”, “the amount of energy **produced** from coal”.",
        "**Task 2:** “…, which means that…”, “people **living** in rural areas”, “the extent to which…”, “problems **caused by**…”. Mỗi đoạn thân bài 1–2 câu là đủ.",
        "**Speaking Part 3:** gọi tên nhóm người bằng V-ing (“students **studying** abroad”), bình luận bằng “, which is why…”.",
        "**Reading:** thấy V-ing / V3 ngay sau danh từ → đọc thầm thêm “who / which + be” để hiểu đúng ai làm, ai bị làm.",
      ],
    },
  ],
};
/* ─────────────────────────── Bài 2 · Đọc ─────────────────────────── */

const T3D17_READING: Lesson = {
  id: "t3d17-doc",
  kind: "reading",
  title: "Đọc: Flow-chart completion 2 + Diagram label — ngôn ngữ quy trình vòng 2",
  goal: "Làm đúng dạng Flow-chart completion và Diagram label completion ở mức band 6: đọc sơ đồ trước để biết đang thiếu loại từ gì, tìm đúng đoạn tả quy trình, nhận ra paraphrase đổi loại từ và bị động rút gọn, rồi điền đúng số từ — 13 câu trong 20 phút với bài đọc khoảng 830 từ.",
  minutes: 70,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Hai dạng “điền vào hình”: **Flow-chart completion** (sơ đồ các bước — Tập 1 Ngày 6) và **Diagram label completion** (điền nhãn hình vẽ — Tập 2 Ngày 22). Hôm nay làm cả hai trên **một bài đọc dài ~830 từ** kiểu Passage 2.",
        "Band 6 khó hơn ở chỗ: câu trong sơ đồ **không lặp chữ của bài** mà paraphrase (stick together → join; is drawn in → enters), và bài dùng nhiều **bị động + mệnh đề rút gọn** (bài 1 hôm nay).",
        "**Ngôn ngữ quy trình vòng 2**: 16 từ (undergo, extract, convert, evaporate, condense, dissolve, discharge, particle, membrane…) + từ nối trình tự + ngôn ngữ vị trí trong hình. Các từ này dùng lại cho **Writing Task 1 process** (Ngày 28).",
        "Quy tắc sống còn: đáp án là **từ nguyên văn trong bài**, **đúng giới hạn số từ**, và sau khi điền câu phải **đúng ngữ pháp**.",
        "Đẩy band: Reading 23/40 (band 6) — hai dạng này thuộc nhóm “dễ ăn điểm” vì đáp án nằm **gọn trong 1–2 đoạn**; mục tiêu là đúng **≥ 9/10** câu điền.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Hai dạng — giống và khác nhau" },
    {
      t: "table",
      head: ["", "Flow-chart completion", "Diagram label completion"],
      rows: [
        ["Hình cho sẵn", "Các ô nối bằng mũi tên: bước 1 → bước 2 → …", "Hình vẽ một thiết bị / công trình / hiện tượng, có các nhãn đánh số"],
        ["Bài đọc tả gì", "Một **quy trình** theo thời gian (sản xuất, xử lý, thí nghiệm, vòng đời)", "**Cấu tạo** và cách hoạt động — nhiều ngôn ngữ **vị trí**"],
        ["Thứ tự đáp án", "Thường **theo thứ tự bài đọc** (vì quy trình có trình tự)", "**Không chắc theo thứ tự** — nhãn đánh số theo hình, không theo bài"],
        ["Đáp án nằm ở", "1–2 đoạn liền nhau", "Thường **một đoạn duy nhất**"],
        ["Loại từ hay điền", "danh từ (vật liệu, thiết bị), đôi khi động từ / số", "gần như luôn là **danh từ** (tên bộ phận)"],
        ["Đã học ở", "Tập 1 Ngày 6", "Tập 2 Ngày 22"],
      ],
    },
    {
      t: "table",
      caption: "Band 5 → band 6: bài hôm nay khó hơn Tập 2 ở đâu",
      head: ["Điểm khó", "Tập 2 (band 5)", "Hôm nay (band 6)"],
      rows: [
        ["Độ dài bài", "~460 từ, phần quy trình chiếm gần hết", "~830 từ; phải **tự tìm** 2–3 đoạn chứa quy trình giữa các đoạn bối cảnh, chi phí, tranh cãi"],
        ["Paraphrase", "Chủ yếu từ đồng nghĩa (hot → warm)", "Đổi **loại từ** (removal → remove), đổi **chủ động ↔ bị động**, định nghĩa (large objects = fish, seaweed…)"],
        ["Ngữ pháp bài đọc", "Câu đơn, bị động đơn giản", "Bị động + **rút gọn V-ing / V3** (“screens **fitted** across its mouth”), mệnh đề “, which”"],
        ["Bẫy", "Hai danh từ đứng gần nhau", "Từ đúng chủ đề nhưng **sai bước**; định nghĩa kiểu “X, known as Y”"],
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Quy trình 6 bước cho cả hai dạng" },
    {
      t: "sodo",
      kind: "flow",
      title: "Đọc HÌNH trước, đọc BÀI sau",
      caption: "Tổng thời gian cho 10 câu điền: khoảng 14–15 phút.",
      steps: [
        { label: "① Đọc lời dẫn", sub: "ONE WORD ONLY? NO MORE THAN TWO WORDS? Khoanh lại." },
        { label: "② Đọc tiêu đề + cả sơ đồ", sub: "Hiểu quy trình đi từ đâu tới đâu; hình vẽ cái gì." },
        { label: "③ Đoán loại từ từng chỗ trống", sub: "sau a/the → danh từ; sau to → động từ; sau and → cùng loại với từ trước." },
        { label: "④ Scan tìm đoạn chứa quy trình", sub: "Tìm tên riêng, từ kỹ thuật của ô đầu tiên và ô cuối cùng." },
        { label: "⑤ Đọc kỹ đoạn đó, dò từng ô", sub: "Gạch chân cụm paraphrase; đáp án đứng ngay cạnh." },
        { label: "⑥ Chép nguyên văn + kiểm", sub: "Đúng số từ, đúng chính tả, số ít / số nhiều y như bài, câu đúng ngữ pháp." },
      ],
    },
    {
      t: "note",
      title: "Mẹo đoán loại từ khi đọc sơ đồ (bước ③)",
      items: [
        "“water passes through sand and ______” → **and** nối hai thứ cùng loại → danh từ chỉ **vật liệu**.",
        "“______ stop large objects from entering” → chỗ trống là **chủ ngữ**, động từ **stop** không có -s → danh từ **số nhiều**.",
        "“passes on the ______ left in the liquid” → sau **the** và trước V3 rút gọn (left) → chắc chắn là **danh từ**; the không cho biết số ít hay nhiều — phải nhìn bài để chép đúng dạng.",
        "“a sloping glass ______” → sau tính từ + danh từ bổ nghĩa → danh từ chính, số ít (vì có **a**).",
        "Với hình vẽ: nhìn **mũi tên, vị trí** (trên / dưới / bên phải) — bài sẽ dùng above, beneath, along the lower edge…",
      ],
    },

    /* ── 3 ── */
    { t: "h", text: "3. Ngôn ngữ quy trình vòng 2 — 16 từ + từ nối + vị trí" },
    {
      t: "p",
      text: "Tập 1 Ngày 15 và Tập 2 Ngày 20 đã cho bạn lớp từ quy trình đầu tiên (first, then, after that, is heated, is mixed). Vòng 2 là lớp từ **học thuật** mà bài đọc khoa học – kỹ thuật dùng. Học kỹ bây giờ: chính các từ này bạn sẽ **viết ra** trong Task 1 process ở Ngày 28.",
    },
    {
      t: "vocab",
      items: [
        { w: "stage", pos: "n", ipa: "/steɪdʒ/", vi: "giai đoạn, công đoạn", ex: "The process consists of five main stages.", exVi: "Quy trình gồm năm công đoạn chính.", more: "**at this stage** · **the initial / final stage** · đồng nghĩa: step, phase." },
        { w: "undergo", pos: "v", ipa: "/ˌʌndəˈɡəʊ/", vi: "trải qua (một quá trình xử lý)", ex: "The water undergoes several treatments before it is safe to drink.", exVi: "Nước trải qua vài lần xử lý trước khi an toàn để uống.", more: "undergo – underwent – undergone. **undergo treatment / a change / testing**. Chủ ngữ là vật bị xử lý nhưng động từ ở **chủ động**." },
        { w: "extract", pos: "v", ipa: "/ɪkˈstrækt/", vi: "chiết, tách lấy ra", ex: "Salt is extracted from seawater by evaporation.", exVi: "Muối được tách ra từ nước biển bằng cách cho bay hơi.", more: "**extract A from B**. Danh từ: **extraction**. Nhấn âm 2 khi là động từ." },
        { w: "convert", pos: "v", ipa: "/kənˈvɜːt/", vi: "chuyển đổi, biến thành", ex: "Solar panels convert sunlight into electricity.", exVi: "Tấm pin mặt trời biến ánh nắng thành điện.", more: "**convert A into B** (cũng đúng: convert A **to** B; văn tả quy trình hay dùng into). Danh từ: **conversion**. Đồng nghĩa: turn … into, transform." },
        { w: "evaporate", pos: "v", ipa: "/ɪˈvæpəreɪt/", vi: "bay hơi", ex: "As the water is heated, it evaporates.", exVi: "Khi nước được đun nóng, nó bay hơi.", more: "Danh từ: **evaporation**. Thường dùng như **nội động từ**: the water **evaporates** (không cần bị động). Văn kỹ thuật đôi khi viết “the liquid **is evaporated**” (người ta làm cho bay hơi) — đọc hiểu được, nhưng khi tự viết hãy ưu tiên “evaporates”." },
        { w: "condense", pos: "v", ipa: "/kənˈdens/", vi: "ngưng tụ (hơi thành nước)", ex: "The vapour condenses on the cold glass.", exVi: "Hơi nước ngưng tụ trên mặt kính lạnh.", more: "Danh từ: **condensation**. Cặp ngược: evaporate ↔ condense. **vapour** = hơi (BrE), **steam** = hơi nước nóng." },
        { w: "dissolve", pos: "v", ipa: "/dɪˈzɒlv/", vi: "hoà tan", ex: "Sugar dissolves quickly in hot water.", exVi: "Đường tan nhanh trong nước nóng.", more: "**dissolved salt** (muối hoà tan — V3 làm tính từ) · **dissolve in** water." },
        { w: "trap", pos: "v", ipa: "/træp/", vi: "giữ lại, bẫy", ex: "The filter traps dust and small particles.", exVi: "Bộ lọc giữ lại bụi và các hạt nhỏ.", more: "**particle** = hạt nhỏ li ti. Bị động: Heat **is trapped** in the atmosphere." },
        { w: "discharge", pos: "v", ipa: "/dɪsˈtʃɑːdʒ/", vi: "xả, thải ra", ex: "Waste water is discharged into the river.", exVi: "Nước thải được xả ra sông.", more: "**discharge A into B**. Đồng nghĩa: release, return … to. Danh từ cùng chữ: /ˈdɪstʃɑːdʒ/." },
        { w: "intake", pos: "n", ipa: "/ˈɪnteɪk/", vi: "cửa lấy vào; lượng nạp vào", ex: "The intake pipe lies 300 metres from the shore.", exVi: "Ống lấy nước nằm cách bờ 300 mét.", more: "**an intake pipe** · nghĩa 2: **daily intake of sugar** (lượng đường nạp mỗi ngày)." },
        { w: "vapour", pos: "n", ipa: "/ˈveɪpə/", vi: "hơi (nước)", ex: "The vapour rises and meets the cold glass.", exVi: "Hơi nước bốc lên và gặp mặt kính lạnh.", more: "AmE: vapor. **water vapour**. Phần rắn còn lại sau khi nước bay hơi: **residue** (Ngày 9) — bài đọc hay dùng **is left behind**." },
        { w: "particle", pos: "n", ipa: "/ˈpɑːtɪkl/", vi: "hạt nhỏ li ti", ex: "The sand removes fine particles from the water.", exVi: "Cát loại bỏ các hạt mịn khỏi nước.", more: "**fine / tiny particles** · **dust particles**. Lớp vật liệu lọc: **a layer / bed of** sand (layer — Ngày 2)." },
        { w: "chamber", pos: "n", ipa: "/ˈtʃeɪmbə/", vi: "buồng, khoang", ex: "The gas is burned in a sealed chamber.", exVi: "Khí được đốt trong một buồng kín.", more: "Tên bộ phận hay gặp trong hình: chamber, tank, **valve** (van), **nozzle** (vòi phun), **tube** (ống)." },
        { w: "basin", pos: "n", ipa: "/ˈbeɪsn/", vi: "chậu, bồn nông", ex: "Rainwater collects in a shallow basin.", exVi: "Nước mưa đọng trong một bồn nông.", more: "**shallow** (nông) ↔ **deep**. Nghĩa địa lý: **a river basin** (lưu vực sông)." },
        { w: "trough", pos: "n", ipa: "/trɒf/", vi: "máng dài hẹp", ex: "The drops run into a trough along the edge.", exVi: "Các giọt nước chảy vào một cái máng dọc mép.", more: "Đọc là /trɒf/ (như “off”). Nghĩa trong biểu đồ: **a trough** = điểm thấp nhất (ngược với peak)." },
        { w: "membrane", pos: "n", ipa: "/ˈmembreɪn/", vi: "màng (lọc, sinh học)", ex: "Water is forced through a thin membrane.", exVi: "Nước bị ép đi qua một lớp màng mỏng.", more: "**a plastic / cell membrane**. Nhấn âm 1." },
      ],
    },
    {
      t: "table",
      caption: "Từ nối trình tự — bài đọc band 6 dùng, và câu hỏi paraphrase lại",
      head: ["Vị trí trong quy trình", "Trong bài đọc", "Trong sơ đồ / câu hỏi thường thành"],
      rows: [
        ["Mở đầu", "is first drawn in · To begin with · The process starts when", "Step 1 · enters · is taken in"],
        ["Bước kế", "then · next · subsequently · following this · once this has been done", "mũi tên ↓"],
        ["Trước đó", "**before** the brine leaves… · **prior to** discharge", "ô đứng TRƯỚC — cẩn thận thứ tự câu ≠ thứ tự thời gian"],
        ["Đồng thời", "meanwhile · at the same time · while", "hai nhánh song song"],
        ["Kết thúc", "finally · the last stage · is returned to", "ô cuối"],
      ],
    },
    {
      t: "table",
      caption: "Ngôn ngữ vị trí trong hình (Diagram) — nối Tập 2 Ngày 22",
      head: ["Cụm", "Nghĩa", "Ví dụ"],
      rows: [
        ["above / over ↔ beneath / below", "phía trên ↔ phía dưới", "**Above** the basin sits a glass cover."],
        ["the underside of", "mặt dưới của", "Droplets form on **the underside of** the glass."],
        ["along the (lower) edge", "dọc theo mép (dưới)", "A trough is fixed **along the lower edge**."],
        ["across the mouth of", "chắn ngang miệng của", "Screens are fitted **across the mouth of** the pipe."],
        ["at the base / on the floor of", "ở đáy", "Salt is left **on the floor of** the basin."],
        ["leads to / carries … to", "dẫn tới", "A pipe **carries** the water **to** a jar."],
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Năm bẫy và cách tránh" },
    {
      t: "table",
      head: ["Bẫy", "Ví dụ", "Cách tránh"],
      rows: [
        ["**Quá số từ**", "Lời dẫn ONE WORD ONLY, bài viết “sloping glass cover” → ghi “glass cover” là **sai**", "Chọn **danh từ chính** (cover). Tính từ đứng trước đã có sẵn trong sơ đồ hay chưa? Thường đã có."],
        ["**Đúng chủ đề, sai bước**", "Ô hỏi vật chặn rác ở cửa ống; bài có cả “screens” lẫn “sand and gravel” (đều lọc)", "Dò **động từ + vị trí** của ô, không chỉ danh từ: “at the mouth of the pipe” → screens."],
        ["**Đổi từ trong bài**", "Bài: “minerals”; ghi “mineral” hoặc “calcium”", "Chép **y nguyên** dạng số ít / số nhiều. Ví dụ cụ thể (calcium) không thay được tên loại nếu sơ đồ viết “______ such as calcium”."],
        ["**Thứ tự câu ≠ thứ tự thời gian**", "“Before the brine leaves the plant, it is sent through…”", "Gạch chân before / after / once / prior to rồi tự xếp lại bước nào trước."],
        ["**Định nghĩa chen giữa**", "“…the rest, known as brine, is left behind”", "“known as / called / referred to as + X” → X là **tên gọi** — rất hay là đáp án."],
      ],
    },
    {
      t: "rule",
      formula: "Đọc hình → đoán loại từ → tìm đoạn → dò paraphrase → chép nguyên văn, đúng số từ",
      vi: "Flow-chart: đáp án thường theo thứ tự bài. Diagram: dò theo vị trí (above, beneath, along the edge), không theo số thứ tự.",
    },

    /* ── 5 ── */
    { t: "h", text: "5. Khởi động: một quy trình ngắn (3 câu)" },
    {
      t: "passage",
      title: "Recycling glass bottles",
      intro: "Khoảng 100 từ — 2 phút. Hoàn thành sơ đồ bên dưới, ONE WORD ONLY.",
      paras: [
        { text: "Used bottles are first collected from recycling bins and taken to a sorting plant, where they are separated by colour, since green, brown and clear glass cannot be mixed. Any metal caps still attached to the bottles are pulled out by magnets. The sorted glass is then crushed into small pieces known as cullet, which is washed to get rid of paper labels and traces of food. After that, the cullet is fed into a furnace and heated to about 1,500°C until it melts. Finally, the liquid glass is poured into moulds, where it cools and hardens into new bottles." },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "How glass bottles are recycled",
      steps: [
        { label: "Bottles collected and sorted according to **1 ______**" },
        { label: "Metal caps removed using **2 ______**" },
        { label: "Glass crushed into cullet and washed" },
        { label: "Cullet melted in a **3 ______**" },
        { label: "Liquid glass shaped in moulds" },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-doc-khoi-dong",
      title: "Questions 1–3 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(1) sorted according to ______", answers: ["colour", "color"], hint: "bài: “separated **by** …” — according to = by" },
        { q: "(2) removed using ______", answers: ["magnets"], hint: "bài dùng bị động: “are pulled out **by** …”" },
        { q: "(3) melted in a ______", answers: ["furnace"], hint: "bài: “fed into a … and heated … until it melts”" },
      ],
    },
    {
      t: "note",
      title: "Nhìn lại ba kiểu paraphrase vừa gặp",
      items: [
        "**sorted according to** colour ← “separated **by** colour” — đổi động từ + giới từ.",
        "**removed using** magnets ← “**pulled out by** magnets” — phrasal verb ↔ động từ một chữ; by + tác nhân ↔ using.",
        "**melted in a** furnace ← “fed into a furnace and heated… **until it melts**” — bài dùng chủ động (it melts), sơ đồ dùng bị động rút gọn (melted). Bẫy: **cullet** và **moulds** cũng là danh từ lạ nhưng đã có sẵn trong sơ đồ.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Bài đọc luyện tập — Questions 1–13 (20 phút)" },
    {
      t: "p",
      text: "Làm như thi thật: **bấm giờ 20 phút**, không tra từ. Đọc **ba nhóm câu hỏi trước** (sơ đồ quy trình, hình vẽ, ba câu TFNG), rồi mới đọc bài. Gợi ý phân giờ: 3 phút đọc câu hỏi + skim bố cục · 8 phút cho Questions 1–6 · 5 phút cho Questions 7–10 · 4 phút cho Questions 11–13.",
    },
    {
      t: "passage",
      title: "Fresh Water from the Sea",
      intro: "Khoảng 830 từ · dạng Passage 2 · bài tự soạn cho khoá.",
      paras: [
        { label: "A", text: "Around 97 per cent of the water on Earth is salty, and much of the remainder is locked in ice or lies deep underground. For centuries this hardly mattered, because rivers, lakes and wells supplied enough fresh water for most communities. Today, however, growing populations and longer droughts are putting those sources under pressure, particularly in dry coastal regions. As a result, a rising number of cities are turning to the one supply that never runs out: the sea. The technology that makes this possible is called desalination, the removal of salt from seawater, and although it is often presented as a modern invention, its basic principle is very old." },
        { label: "B", text: "The oldest method, distillation, simply copies the natural water cycle. Sailors in the ancient world are said to have boiled seawater and collected the steam, and the same idea survives in a simple device called a solar still, which is still used in remote villages and in the emergency kits carried on lifeboats. A solar still consists of a shallow basin, painted black so that it absorbs as much heat as possible, which is filled with a few centimetres of seawater. Above the basin sits a sloping glass cover. As the sun heats the water, it evaporates, leaving the salt behind as a crust of crystals on the floor of the basin. The vapour rises until it meets the underside of the glass, which is cooler than the air inside, and condenses there into droplets. These run down the slope and drip into a narrow trough fixed along the lower edge, from which a pipe carries the fresh water to a storage jar." },
        { label: "C", text: "The solar still is cheap and needs no fuel, but its output is tiny: a still covering one square metre yields only a few litres a day, barely enough for one person. Supplying a city in this way would require an impossibly large area of glass. The large plants built in the middle of the twentieth century therefore boiled seawater using heat from burning oil or gas, which made the water they produced extremely expensive. The breakthrough came with a different approach altogether, known as reverse osmosis, which today accounts for the majority of the world's desalination capacity." },
        { label: "D", text: "In a reverse osmosis plant, no water is boiled at all. Seawater is first drawn in through an intake pipe lying several hundred metres offshore, where screens fitted across its mouth keep out fish, seaweed and other large objects. The water then enters the pre-treatment stage. A chemical is added which causes fine particles to stick together, and the water is passed slowly through deep beds of sand and gravel that trap them. This step is essential, since even tiny particles would quickly block the equipment that follows. Next, powerful pumps raise the pressure of the water to around sixty times that of the atmosphere and force it against membranes, thin plastic sheets rolled up inside long tubes. The membranes contain holes so small that water molecules can squeeze through while dissolved salt cannot. Roughly half of the water emerges on the far side as fresh water; the rest, now about twice as salty as before and known as brine, is left behind." },
        { label: "E", text: "Two further stages complete the process. Before the brine leaves the plant, it is sent through an energy recovery device, a machine which transfers the pressure remaining in the brine to the incoming seawater and so reduces the work that the pumps must do. The fresh water, meanwhile, is in one sense too pure: water containing no minerals tastes flat and slowly eats away at metal pipes. Minerals such as calcium are therefore added back, together with a small dose of chlorine to kill any bacteria, before the water is pumped into the city's supply. Finally, the brine is returned to the sea through diffusers, rows of nozzles on the seabed designed to mix it rapidly with the surrounding water." },
        { label: "F", text: "Reverse osmosis has made desalinated water far cheaper than it once was. The energy needed to produce a cubic metre of fresh water has fallen to a fraction of the amount consumed by the boiling plants of the 1960s, largely thanks to better membranes and to energy recovery. Even so, electricity remains the biggest single cost, and where it is generated by burning fossil fuels, desalination adds to the very emissions that are making droughts worse in the first place. For this reason, several recent plants have been paired with wind or solar farms built specifically to supply them." },
        { label: "G", text: "The technology also has its critics. Marine biologists point out that brine, being heavier than seawater, tends to sink and spread across the seabed, where it can harm animals unable to move away, and that intake pipes kill enormous numbers of eggs and young fish. Others argue that desalination distracts attention from cheaper measures, such as repairing leaking pipes, which in some cities lose a third of the water put into them, or recycling waste water. Supporters accept these points but describe desalination as a form of insurance: expensive, perhaps, but unlike a reservoir it does not depend on rain. As dry years become more frequent, more coastal cities are deciding that the insurance is worth paying for." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–6.** Complete the flow-chart below. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Reverse osmosis: from the sea to the tap",
      caption: "Sau bước tách, quy trình chia hai nhánh: nước ngọt và nước muối đậm đặc.",
      steps: [
        { label: "**Intake** — seawater enters a pipe offshore", sub: "**1 ______** prevent large objects from getting in" },
        { label: "**Pre-treatment** — a chemical makes small particles join up", sub: "water is filtered through sand and **2 ______**" },
        { label: "**Separation** — pumps push the water at very high pressure", sub: "against **3 ______** with extremely small holes" },
        { label: "About half becomes fresh water; the remaining liquid is called **4 ______**", sub: "(two branches ↓)" },
        { label: "Salty branch: energy recovery device", sub: "passes on the **5 ______** left in the liquid to new seawater; liquid then released through diffusers" },
        { label: "Fresh branch: post-treatment", sub: "**6 ______** like calcium, and chlorine, are added → city supply" },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-doc-flow",
      title: "Questions 1–6 — Flow-chart (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(1) ______ prevent large objects from getting in", answers: ["screens"], hint: "đoạn D, câu 2 — tìm “large objects”" },
        { q: "(2) filtered through sand and ______", answers: ["gravel"], hint: "đoạn D — “beds of sand and …”" },
        { q: "(3) pushed against ______ with extremely small holes", answers: ["membranes"], hint: "đoạn D — sau “force it against …”" },
        { q: "(4) the remaining liquid is called ______", answers: ["brine"], hint: "đoạn D, câu cuối — “known as …”" },
        { q: "(5) passes on the ______ left in the liquid", answers: ["pressure"], hint: "đoạn E, câu 2 — “transfers the … remaining in…”" },
        { q: "(6) ______ like calcium are added", answers: ["minerals"], hint: "đoạn E — “… such as calcium”" },
      ],
    },
    {
      t: "p",
      text: "**Questions 7–10.** Label the diagram below. Choose **ONE WORD ONLY** from the passage for each answer.",
    },
    {
      t: "figure",
      fig: {
        kind: "map",
        title: "A solar still (cross-section)",
        note: "Sơ đồ tự vẽ cho bài luyện — mặt cắt đứng. Mái kính thật ra nằm NGHIÊNG, thấp dần về bên phải. Điền nhãn 7–10.",
        map: {
          cols: 12,
          rows: 8,
          boxes: [
            { x: 0.8, y: 0.8, w: 9.6, h: 0.8, blank: "8" },
            { x: 1.2, y: 3.4, w: 7.4, h: 0.9, label: "seawater" },
            { x: 0.8, y: 4.3, w: 8.2, h: 1, blank: "7" },
            { x: 9.4, y: 2.6, w: 1.6, h: 0.8, blank: "9" },
            { x: 9.6, y: 5.6, w: 1.8, h: 1.8, blank: "10" },
          ],
          paths: [{ x: 10.3, y: 3.4, w: 0.3, h: 2.2, label: "pipe" }],
          pins: [
            { x: 3, y: 0.3, label: "sun ☀" },
            { x: 4.5, y: 2.4, label: "vapour ↑" },
            { x: 8, y: 2, label: "droplets →" },
          ],
        },
      },
    },
    {
      t: "table",
      caption: "Nhãn cần điền",
      head: ["Số", "Mô tả trong hình"],
      rows: [
        ["**7**", "shallow black ______ holding the seawater"],
        ["**8**", "sloping glass ______"],
        ["**9**", "narrow ______ collecting the droplets"],
        ["**10**", "storage ______ for fresh water"],
      ],
    },
    {
      t: "quiz",
      id: "t3d17-doc-diagram",
      title: "Questions 7–10 — Diagram labels (ONE WORD ONLY)",
      kind: "fill",
      items: [
        { q: "(7) shallow black ______ holding the seawater", answers: ["basin"], hint: "đoạn B — “consists of a shallow …, painted black”" },
        { q: "(8) sloping glass ______", answers: ["cover"], hint: "đoạn B — “Above the basin sits…”" },
        { q: "(9) narrow ______ collecting the droplets", answers: ["trough"], hint: "đoạn B — “drip into a narrow … fixed along the lower edge”" },
        { q: "(10) storage ______ for fresh water", answers: ["jar"], hint: "đoạn B, cuối đoạn — “a pipe carries the fresh water to…”" },
      ],
    },
    {
      t: "p",
      text: "**Questions 11–13.** Do the following statements agree with the information given in the passage? Choose **TRUE**, **FALSE** or **NOT GIVEN**.",
    },
    {
      t: "mcq",
      id: "t3d17-doc-tfng",
      title: "Questions 11–13 — True / False / Not Given",
      items: [
        { q: "(11) Solar stills have now completely gone out of use.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn B: “a solar still, which **is still used** in remote villages and in the emergency kits carried on lifeboats” → mâu thuẫn với “completely gone out of use” → **FALSE**." },
        { q: "(12) Water from mid-twentieth-century desalination plants cost a great deal to produce.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn C: “plants built in the middle of the twentieth century… boiled seawater using heat from burning oil or gas, **which made the water they produced extremely expensive**” → cost a great deal = extremely expensive → **TRUE**. (Chú ý “, which” thay cả ý phía trước — bài 1 mục 3.)" },
        { q: "(13) Wind farms supply electricity to desalination plants more cheaply than solar farms do.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Đoạn F chỉ nói vài nhà máy “have been paired with **wind or solar farms**” — không hề so giá điện gió với điện mặt trời → **NOT GIVEN**. Đừng tự suy từ kiến thức ngoài." },
      ],
    },
    {
      t: "note",
      title: "Chấm xong — quy điểm",
      items: [
        "**11–13 câu đúng:** đạt mức band 6+ cho dạng này. **9–10:** gần đạt — xem lại bảng paraphrase bên dưới. **≤ 8:** làm lại bước ②–③ (đọc hình, đoán loại từ) với bài khởi động.",
        "Sai ở Questions 1–6 vì **điền từ đúng nghĩa nhưng không có trong bài** (filters, salt water…) → nhớ: chỉ chép từ nguyên văn.",
        "Sai ở Questions 7–10 vì ghi **hai từ** (glass cover, storage jar) → lời dẫn ONE WORD ONLY; tính từ đã in sẵn trong hình.",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Phân tích sau khi làm: câu nào chứa đáp án, paraphrase kiểu gì" },
    {
      t: "table",
      head: ["Câu", "Trong sơ đồ / hình", "Trong bài (đoạn)", "Kiểu paraphrase"],
      rows: [
        ["1 screens", "prevent large objects from getting in", "D: “screens **fitted** across its mouth **keep out** fish, seaweed and other large objects”", "phrasal verb → động từ + from V-ing; chủ ngữ ẩn sau mệnh đề rút gọn V3 (fitted)"],
        ["2 gravel", "is filtered through sand and …", "D: “is passed slowly through deep beds of sand and gravel that **trap** them”", "đổi động từ: pass through … that trap → filter"],
        ["3 membranes", "push the water… against … with extremely small holes", "D: “force it against membranes… contain holes so small that…”", "force → push; so small → extremely small. Bẫy: **sheets**, **tubes** là mô tả, không phải tên"],
        ["4 brine", "the remaining liquid is called …", "D: “the rest… **known as** brine, is left behind”", "known as = is called; the rest = the remaining liquid"],
        ["5 pressure", "passes on the … left in the liquid", "E: “transfers the pressure **remaining** in the brine to the incoming seawater”", "transfer → pass on; remaining (V-ing rút gọn) → left. Bẫy thứ tự: “**Before** the brine leaves…”"],
        ["6 minerals", "… like calcium… are added", "E: “Minerals **such as** calcium are therefore added back”", "such as = like. Bẫy: calcium là ví dụ, không phải tên loại"],
        ["7 basin", "shallow black … holding the seawater", "B: “a shallow basin, **painted black**…, which is filled with… seawater”", "painted black → black; is filled with → holding"],
        ["8 cover", "sloping glass …", "B: “Above the basin sits a sloping glass cover.” (đảo ngữ: trạng ngữ nơi chốn + V + S)", "gần như nguyên văn — bẫy giới hạn từ"],
        ["9 trough", "narrow … collecting the droplets", "B: “drip into a narrow trough **fixed** along the lower edge”", "drip into → collecting"],
        ["10 jar", "storage … for fresh water", "B: “a pipe carries the fresh water to a storage jar”", "nguyên văn — bẫy: **pipe** (đã có sẵn trong hình)"],
      ],
    },
    {
      t: "note",
      title: "Soi ngữ pháp bài 1 trong bài đọc — đếm xem bạn nhận ra mấy chỗ",
      items: [
        "**V3 rút gọn:** screens **fitted** across its mouth · sheets **rolled up** inside long tubes · a trough **fixed** along the lower edge · the energy **needed** to produce… · farms **built** specifically to supply them · the water **put** into them.",
        "**V-ing rút gọn:** an intake pipe **lying** several hundred metres offshore · the pressure **remaining** in the brine · water **containing** no minerals · a still **covering** one square metre.",
        "**“, which” không xác định:** a solar still**, which** is still used… · reverse osmosis**, which** today accounts for… · leaking pipes**, which** in some cities lose a third…",
        "**“, which” thay cả ý:** …using heat from burning oil or gas**, which made** the water… extremely expensive.",
        "**Giới từ + which:** a narrow trough…, **from which** a pipe carries the fresh water.",
        "**Đồng vị (bỏ which is):** membranes**, thin plastic sheets**… · diffusers**, rows of nozzles** on the seabed · desalination**, the removal of salt** from seawater.",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "desalination", pos: "n", ipa: "/ˌdiːˌsælɪˈneɪʃn/", vi: "sự khử mặn (nước biển)", ex: "Desalination provides drinking water for many coastal cities.", exVi: "Khử mặn cung cấp nước uống cho nhiều thành phố ven biển.", more: "**a desalination plant** (nhà máy khử mặn) · tiền tố **de-** = bỏ đi: deforestation, decaffeinated." },
        { w: "drought", pos: "n", ipa: "/draʊt/", vi: "hạn hán", ex: "The region has suffered three years of drought.", exVi: "Vùng này đã chịu ba năm hạn hán.", more: "Đọc /draʊt/ (vần với “out”). **a severe / prolonged drought** ↔ **flood**." },
        { w: "yield", pos: "v", ipa: "/jiːld/", vi: "cho ra (sản lượng)", ex: "One square metre yields only a few litres a day.", exVi: "Một mét vuông chỉ cho ra vài lít mỗi ngày.", more: "Danh từ cùng chữ: **a high crop yield** (năng suất cây trồng cao)." },
        { w: "account for", pos: "phr v", ipa: "/əˈkaʊnt fɔː/", vi: "chiếm (tỉ lệ)", ex: "Reverse osmosis accounts for most of the world's capacity.", exVi: "Thẩm thấu ngược chiếm phần lớn công suất thế giới.", more: "Dùng ngay trong Task 1: Coal **accounted for** 40% of the total." },
        { w: "reservoir", pos: "n", ipa: "/ˈrezəvwɑː/", vi: "hồ chứa nước", ex: "Unlike a reservoir, a desalination plant does not depend on rain.", exVi: "Khác với hồ chứa, nhà máy khử mặn không phụ thuộc vào mưa.", more: "Đọc theo kiểu Pháp: /ˈrezəvwɑː/. **build a reservoir** · nghĩa bóng: a reservoir of talent." },
        { w: "emission", pos: "n", ipa: "/ɪˈmɪʃn/", vi: "khí thải; sự phát thải", ex: "Burning coal increases carbon emissions.", exVi: "Đốt than làm tăng phát thải các-bon.", more: "**reduce / cut emissions** · động từ: **emit**." },
      ],
    },
    {
      t: "note",
      title: "Mẹo nhớ cho ngày thi",
      items: [
        "Thấy sơ đồ / hình vẽ → **vui lên**: đáp án gom ở 1–2 đoạn, làm xong sớm để dành giờ cho Matching headings và TFNG.",
        "Flow-chart có **hai nhánh** (như bài hôm nay) → bài đọc thường có từ **meanwhile / at the same time** — đó là chỗ đổi nhánh.",
        "Không hiểu từ kỹ thuật (cullet, brine, diffuser) cũng không sao: bài thường **định nghĩa ngay cạnh** bằng dấu phẩy, “known as”, “called”, “that is”. Từ nào không được định nghĩa (như osmosis) thì thường không cần hiểu để làm câu hỏi.",
      ],
    },
  ],
};
/* ─────────────────────────── Bài 3 · Nghe ─────────────────────────── */

const T3D17_LISTENING: Lesson = {
  id: "t3d17-nghe",
  kind: "listening",
  title: "Nghe: Part 3 — Flow-chart completion + trắc nghiệm chọn HAI đáp án",
  goal: "Làm trọn Questions 21–30 của một bài Listening Part 3 ba người nói ở tốc độ tự nhiên: hai cụm “Choose TWO letters” và một sơ đồ quy trình chọn từ hộp A–H — bám được tín hiệu chuyển bước, loại phương án bị bác, và ngắt hơi đúng trước mệnh đề quan hệ không xác định khi nói.",
  minutes: 65,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì",
      items: [
        "Tập 2 Ngày 13 bạn đã gặp cả hai dạng ở mức nhập. Hôm nay làm ở **mức band 6**: ba người nói, ~150 từ/phút, nghe **một lần**, phương án sai được nhắc tới **rồi bị bác**.",
        "**Choose TWO letters (A–E):** 5 phương án, 2 đúng, **mỗi chữ cái một điểm**, thứ tự không quan trọng. Cả 5 phương án **đều được nhắc tới** — việc của bạn là nghe xem cái nào được **xác nhận**.",
        "**Flow-chart chọn từ hộp (A–H):** 6 chỗ trống, 8 lựa chọn → **thừa 2**. Đáp án đi **đúng thứ tự** sơ đồ; mỗi bước được báo bằng một **từ chuyển bước** (first of all, once that's done, before you…).",
        "Ba kiểu bác bỏ phải nghe ra: **người khác không đồng ý** · **“I thought… but actually…”** · **giảng viên nói không cần**.",
        "🔊 Phát âm: **ngắt một nhịp trước mệnh đề quan hệ không xác định** (“The river, | which runs through the town, | is clean”) — nối bài Ngữ pháp hôm nay.",
      ],
    },

    /* ── 1 ── */
    { t: "h", text: "1. Part 3 ở band 6 — khác Tập 2 Ngày 13 ở đâu?" },
    {
      t: "table",
      head: ["", "Tập 2 Ngày 13 (band 5)", "Hôm nay (band 6)"],
      rows: [
        ["Tốc độ", "Chậm hơn, ngắt câu rõ", "~150 từ/phút, có **ngắt lời, nói chồng ý** nhau"],
        ["Người nói", "Giảng viên + 2 sinh viên, mỗi lượt nói khá dài", "3 người đổi lượt nhanh; **quyết định cuối** thường nằm ở câu ngắn (“OK, let's do that.”)"],
        ["Phương án sai", "Cả năm đều được nhắc; ba cái bị **phủ nhận thẳng** (hardly anyone…, not at all)", "Ba cái bị bác **gián tiếp**: từ chối lịch sự (We'd love to, but… / nice idea, only…), giả định bị đính chính (I thought… but actually…), người có thẩm quyền gạt đi"],
        ["Flow-chart", "Chủ yếu **viết từ** nghe được (ONE WORD AND/OR A NUMBER); hộp chữ cái mới thử ở mục 10", "Cả bài chính là **chọn chữ cái từ hộp 8 từ (thừa 2)**; từ trong hộp có thể là **paraphrase** của từ trong băng"],
        ["Thời gian đọc đề", "30 giây trước mỗi nhóm câu", "Như cũ — nhưng phải đọc **nhiều chữ hơn** (10 phương án + hộp 8 từ)"],
      ],
    },
    {
      t: "note",
      title: "30 giây đọc đề: làm gì trước?",
      items: [
        "**Choose TWO:** gạch chân **từ khoá của câu hỏi** (problems? changes they **agree**? what the **tutor** suggests?) — sai đối tượng là sai cả câu. Rồi gạch 1–2 chữ khoá ở mỗi phương án.",
        "**Flow-chart:** đọc **tiêu đề sơ đồ** + các chữ đứng **ngay trước và sau** chỗ trống (động từ!). Đọc lướt hộp từ, nhóm các từ **cùng loại** (bottle – lid – label thuộc cùng một vật).",
        "Đánh dấu chỗ **đổi nhóm câu** (sau câu 24 chuyển sang sơ đồ) — băng sẽ có câu báo: “Now, let's go through the procedure…”.",
      ],
    },

    /* ── 2 ── */
    { t: "h", text: "2. Dạng Choose TWO — cả năm phương án đều được nhắc" },
    {
      t: "p",
      text: "Ở dạng này người ra đề **không** giấu phương án sai — họ cho người nói nhắc tới nó rồi **gạt đi**. Vì vậy **nghe thấy từ khoá ≠ đáp án**. Hãy nghe **thái độ** đi kèm: xác nhận hay bác bỏ.",
    },
    {
      t: "table",
      caption: "Tín hiệu xác nhận và tín hiệu bác bỏ",
      head: ["Loại", "Câu hay nghe", "Nghĩa là"],
      rows: [
        ["✅ Xác nhận sự việc", "That was a real problem. · It kept happening. · We never managed to…", "phương án ĐÚNG"],
        ["✅ Đồng ý với đề xuất", "Good point, let's do that. · I'm happy with that. · That makes sense. · Agreed.", "phương án ĐÚNG (nếu câu hỏi là “agree to do”)"],
        ["❌ Giả định bị bác", "We **thought** it would… **but actually**… · The forecast said… **but in the end**…", "phương án SAI"],
        ["❌ Từ chối lịch sự", "We'd love to, **but**… · It's a nice idea, **only**… · I'm not sure that's realistic.", "phương án SAI"],
        ["❌ Người có thẩm quyền gạt", "You don't need to… · That's outside the scope. · The budget won't cover it.", "phương án SAI"],
        ["❌ Lo hão", "We were worried that…, **but** Dr X said it was fine.", "phương án SAI"],
      ],
    },
    {
      t: "rule",
      formula: "Choose TWO: nghe đủ 5 phương án → gạch cái bị bác (but / actually / not realistic) → còn lại 2",
      vi: "Đừng khoanh ngay khi nghe thấy từ khoá. Chờ câu phản ứng của người kia rồi mới quyết.",
    },

    /* ── 3 ── */
    { t: "h", text: "3. Dạng Flow-chart chọn từ hộp — bám từ chuyển bước" },
    {
      t: "table",
      caption: "Từ chuyển bước khi NÓI (khác văn viết ở bài Đọc)",
      head: ["Vị trí", "Câu hay nghe"],
      rows: [
        ["Bước đầu", "So, first of all… · The very first thing is to… · Before you touch anything…"],
        ["Bước kế", "Then… · After that… · Once that's done… · Once you've got that…"],
        ["Chèn bước trước", "But **before** you do that, you need to… · Make sure you've … **first**."],
        ["Bước cuối", "And the last thing is… · Finally… · And then you're done."],
        ["Sửa lại", "No, hang on — … · Actually, it'd be better to… · Not the lid, the label."],
      ],
    },
    {
      t: "note",
      title: "⚠️ Bẫy riêng của flow-chart chọn từ hộp",
      items: [
        "**Thừa 2 phương án** — và hai từ thừa **cũng được nói ra** (thường là đề xuất bị bác: “Should we measure the depth?” – “No need.”).",
        "Từ trong hộp có thể **khác chữ** với băng: hộp ghi **photograph**, băng nói “take a **picture**”. Trước khi nghe, nghĩ sẵn một từ đồng nghĩa cho mỗi phương án.",
        "Lỡ một bước → **bỏ ngay**, nhảy sang bước kế bằng cách bám từ chuyển bước. Ngồi tiếc một câu là mất luôn hai câu sau.",
        "Mỗi chữ cái thường chỉ dùng **một lần** (trừ khi đề ghi “you may use any letter more than once”).",
      ],
    },

    /* ── 4 ── */
    { t: "h", text: "4. Khởi động: một câu Choose TWO (40 giây)" },
    {
      t: "p",
      text: "**Question.** Which **TWO** things do the students decide to include in their poster? Đọc 5 phương án trong bảng rồi bấm nghe **một lần**.",
    },
    {
      t: "table",
      head: ["Chữ", "Phương án"],
      rows: [
        ["**A**", "a map of the river"],
        ["**B**", "photographs of each site"],
        ["**C**", "a table of results"],
        ["**D**", "quotations from local residents"],
        ["**E**", "a list of references"],
      ],
    },
    {
      t: "listen",
      id: "t3d17-nghe-khoi-dong",
      title: "Planning the poster",
      dan: { so: "Day 17, Recording 1", boiCanh: "two students, Priya and Tom, planning a poster for their river project.", cau: [1, 1] },
      note: "Khoảng 40 giây, hai giọng: Priya (Úc) · Tom (Mỹ).",
      lines: [
        { who: "Priya", voice: "au-nu", text: "Right, the poster. We've only got one A1 sheet, so we can't fit everything in. I'd start with a map of the river, so people can see where the sites are.", vi: "Rồi, tấm áp phích. Mình chỉ có một tờ A1 nên không nhét hết được. Mình sẽ bắt đầu bằng bản đồ con sông, để mọi người thấy các điểm lấy mẫu ở đâu." },
        { who: "Tom", voice: "us-nam", text: "Definitely, that has to go in. What about photos of each site?", vi: "Chắc chắn rồi, cái đó phải có. Còn ảnh từng điểm thì sao?" },
        { who: "Priya", voice: "au-nu", text: "I'd like them, but six photos would take up half the sheet. Let's leave them for the slides.", vi: "Mình cũng thích, nhưng sáu tấm ảnh chiếm nửa tờ mất. Để dành cho slide đi." },
        { who: "Tom", voice: "us-nam", text: "OK. I thought we'd need a big table of results, but actually a graph would be much clearer, wouldn't it?", vi: "Ừ. Mình tưởng cần một bảng kết quả lớn, nhưng thật ra biểu đồ sẽ rõ hơn nhiều, đúng không?" },
        { who: "Priya", voice: "au-nu", text: "Much. Graph, not table. And those comments we got from people living by the river — they'd make it more human.", vi: "Rõ hơn nhiều. Biểu đồ, không phải bảng. Và mấy lời nhận xét của người dân sống ven sông — chúng sẽ làm áp phích gần gũi hơn." },
        { who: "Tom", voice: "us-nam", text: "Yeah, two or three short quotes. I'm happy with that. References can go in the handout.", vi: "Ừ, hai ba câu trích ngắn. Mình đồng ý. Tài liệu tham khảo cho vào tờ phát tay." },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-nghe-khoi-dong-cau",
      title: "Question 1 — gõ HAI chữ cái (ví dụ: A C)",
      kind: "fill",
      items: [
        { q: "Which TWO things do they decide to include in the poster?", answers: ["A D", "AD", "D A", "DA", "A and D", "D and A", "A & D", "D & A", "A, D", "D, A"], hint: "Nghe phản ứng của người thứ hai sau mỗi đề xuất." },
      ],
    },
    {
      t: "note",
      title: "Giải thích",
      items: [
        "**A ✅** — “a map of the river” → Tom: “**Definitely, that has to go in.**”",
        "**B ❌** — “I'd like them, **but**… Let's **leave them for the slides**.” (từ chối lịch sự)",
        "**C ❌** — “**I thought** we'd need a big table… **but actually** a graph would be much clearer.” → Priya: “Graph, **not table**.” (giả định bị bác)",
        "**D ✅** — “comments… from **people living by the river**” (= local residents; V-ing rút gọn!) → Tom: “**I'm happy with that.**”",
        "**E ❌** — “References can go **in the handout**.” (chuyển sang chỗ khác)",
      ],
    },

    /* ── 5 ── */
    { t: "h", text: "5. Bài nghe chính — Part 3: River Lenn water-quality project (Questions 21–30)" },
    {
      t: "p",
      text: "Bối cảnh: hai sinh viên khoa Môi trường, **Priya** và **Tom**, gặp giảng viên hướng dẫn **Dr Novak** để bàn về đồ án đo chất lượng nước sông Lenn sau chuyến đi thử (pilot). Bạn có **30 giây** đọc Questions 21–24, rồi nghe **một lần liền mạch**; băng không dừng trước khi sang Questions 25–30 nên hãy đọc cả sơ đồ trước khi bấm nghe.",
    },
    {
      t: "table",
      caption: "Questions 21–22 — Which TWO problems did the students have during their pilot visit?",
      head: ["Chữ", "Phương án"],
      rows: [
        ["**A**", "The weather was too bad to work in."],
        ["**B**", "A piece of equipment gave unreliable readings."],
        ["**C**", "They were unable to reach one of the sites."],
        ["**D**", "They collected too few samples."],
        ["**E**", "The laboratory was closed when they returned."],
      ],
    },
    {
      t: "table",
      caption: "Questions 23–24 — Which TWO changes do they agree to make to the main study?",
      head: ["Chữ", "Phương án"],
      rows: [
        ["**A**", "visiting the river more often"],
        ["**B**", "adding a site above the town"],
        ["**C**", "testing for a wider range of chemicals"],
        ["**D**", "working together with a second-year group"],
        ["**E**", "taking samples at the same time of day"],
      ],
    },
    {
      t: "p",
      text: "**Questions 25–30.** Complete the flow-chart below. Choose **SIX** answers from the box and write the correct letter, **A–H**, next to Questions 25–30.",
    },
    {
      t: "table",
      caption: "Hộp lựa chọn",
      head: ["A", "B", "C", "D", "E", "F", "G", "H"],
      rows: [["bottle", "cool box", "depth", "label", "lid", "net", "photograph", "temperature"]],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Procedure at each sampling site",
      steps: [
        { label: "Take a **25 ______** of the site from the same fixed point" },
        { label: "Measure the **26 ______** of the water" },
        { label: "Rinse the **27 ______** three times with river water" },
        { label: "Collect the sample from the middle of the stream" },
        { label: "Write the site number and the time on the **28 ______**" },
        { label: "Use a **29 ______** to collect insects from the river bed" },
        { label: "Put everything in the **30 ______** until you reach the lab" },
      ],
    },
    {
      t: "listen",
      id: "t3d17-nghe-bai",
      title: "River Lenn water-quality project",
      dan: { so: "Day 17, Recording 2 (Listening Part 3)", boiCanh: "two environmental science students, Priya and Tom, talking to their tutor, Dr Novak, about a project on water quality in a local river.", cau: [21, 30] },
      note: "Khoảng 4 phút 40 giây, ba giọng: Dr Novak (Anh, nữ) · Priya (Úc, nữ) · Tom (Mỹ, nam). Nghe MỘT lần.",
      lines: [
        { who: "Dr Novak", voice: "uk-nu", text: "Come in, both of you. So, you did your pilot visit to the River Lenn last Thursday. How did it go?", vi: "Mời hai em vào. Thế là thứ Năm tuần trước các em đã đi thử ở sông Lenn. Mọi việc thế nào?" },
        { who: "Tom", voice: "us-nam", text: "Mostly fine, I think. We were kind of nervous about the weather, because the forecast said heavy rain, but in the end it stayed dry all day.", vi: "Em nghĩ phần lớn ổn ạ. Bọn em hơi lo về thời tiết, vì dự báo nói mưa to, nhưng cuối cùng trời khô ráo cả ngày." },
        { who: "Priya", voice: "au-nu", text: "The real headache was the pH meter. We'd test a sample, get six point eight, test the same sample a minute later and get seven point five. It kept happening.", vi: "Cái đau đầu thật sự là máy đo pH. Bọn em đo một mẫu ra sáu phẩy tám, một phút sau đo lại chính mẫu đó ra bảy phẩy năm. Nó cứ bị thế mãi." },
        { who: "Dr Novak", voice: "uk-nu", text: "That sounds like it wasn't calibrated properly. Book the newer one from the technician next time. Anything else?", vi: "Nghe như máy chưa được hiệu chuẩn đúng. Lần tới hãy đặt mượn cái mới hơn ở chỗ kỹ thuật viên. Còn gì nữa không?" },
        { who: "Tom", voice: "us-nam", text: "Yeah, we never got to site three, the one by the old mill. The footpath, which runs behind the factory, was fenced off for building work, and there's no other way down to the water.", vi: "Có ạ, bọn em không tới được điểm số ba, điểm cạnh cối xay cũ. Lối đi bộ, vốn chạy phía sau nhà máy, bị rào lại để thi công, mà không còn đường nào khác xuống mép nước." },
        { who: "Priya", voice: "au-nu", text: "And we were a bit worried we hadn't taken enough samples, six at each site.", vi: "Và bọn em hơi lo là lấy chưa đủ mẫu, mỗi điểm sáu mẫu." },
        { who: "Dr Novak", voice: "uk-nu", text: "Six is plenty for a pilot, don't worry about that. Did you get everything back to the lab in time?", vi: "Sáu mẫu là quá đủ cho chuyến đi thử, đừng lo chuyện đó. Các em có mang mọi thứ về phòng thí nghiệm kịp giờ không?" },
        { who: "Tom", voice: "us-nam", text: "Just about. It was half past five and we assumed the lab would be locked, but the technician had stayed late, so we got everything into the fridge.", vi: "Vừa kịp ạ. Lúc đó năm rưỡi và bọn em cứ tưởng phòng thí nghiệm khoá rồi, nhưng kỹ thuật viên ở lại muộn nên bọn em cho được mọi thứ vào tủ lạnh." },
        { who: "Dr Novak", voice: "uk-nu", text: "Good. Now, the main study. At the moment you're planning to go once a fortnight. Could you manage every week? You'd get a much richer set of data.", vi: "Tốt. Giờ đến nghiên cứu chính. Hiện các em định hai tuần đi một lần. Các em đi mỗi tuần được không? Bộ số liệu sẽ dày hơn nhiều." },
        { who: "Priya", voice: "au-nu", text: "We'd love to, but with our timetable this term it's just not realistic. Thursday is the only free day we share, and every second Thursday we've got lab classes.", vi: "Bọn em rất muốn, nhưng với thời khoá biểu kỳ này thì không khả thi ạ. Thứ Năm là ngày rảnh chung duy nhất, mà cứ cách một thứ Năm bọn em lại có giờ thực hành." },
        { who: "Dr Novak", voice: "uk-nu", text: "Fair enough. Fortnightly it is.", vi: "Cũng được. Vậy giữ hai tuần một lần." },
        { who: "Tom", voice: "us-nam", text: "One thing I did want to change, though. All five of our sites are in the town or below it. Shouldn't we have one upstream, before the river reaches any houses or factories? Otherwise we've got nothing to compare with.", vi: "Nhưng có một điều em muốn đổi. Cả năm điểm của bọn em đều ở trong thị trấn hoặc phía hạ lưu. Mình có nên có một điểm ở thượng lưu, trước khi sông chảy tới nhà cửa hay nhà máy không ạ? Không thì chẳng có gì để so sánh." },
        { who: "Dr Novak", voice: "uk-nu", text: "That's exactly what I was going to suggest. A control site. Priya?", vi: "Đó chính là điều cô định gợi ý. Một điểm đối chứng. Priya thấy sao?" },
        { who: "Priya", voice: "au-nu", text: "Yes, agreed. There's a bridge about two kilometres north of the town that would work. And I wondered whether we could test for more chemicals, metals for instance, not just nitrate and phosphate.", vi: "Vâng, em đồng ý. Có một cây cầu cách thị trấn khoảng hai cây số về phía bắc dùng được. Và em không biết mình có thể xét nghiệm thêm hoá chất không, kim loại chẳng hạn, chứ không chỉ nitrat và phốt phát." },
        { who: "Dr Novak", voice: "uk-nu", text: "It's a nice idea, only the department's budget covers the nitrate and phosphate kits and nothing more, I'm afraid. Now, there's a second-year group doing something similar. Would it help to join forces with them?", vi: "Ý hay đấy, có điều ngân sách khoa chỉ đủ cho bộ thử nitrat và phốt phát thôi, cô e là vậy. À, có một nhóm năm hai đang làm đề tài tương tự. Hợp sức với họ có ích không?" },
        { who: "Tom", voice: "us-nam", text: "I spoke to them, actually. They're on a completely different river, so I don't see much point.", vi: "Thật ra em đã nói chuyện với họ rồi ạ. Họ làm ở một con sông hoàn toàn khác, nên em thấy không ích gì mấy." },
        { who: "Priya", voice: "au-nu", text: "No, me neither. But there is something we got wrong last week. We sampled site one at nine in the morning and site five at three in the afternoon, and water temperature, which affects the oxygen level, changes a lot during the day.", vi: "Em cũng thấy vậy. Nhưng tuần trước có một chỗ bọn em làm sai. Bọn em lấy mẫu điểm một lúc chín giờ sáng và điểm năm lúc ba giờ chiều, mà nhiệt độ nước, thứ ảnh hưởng tới lượng ô-xy, thay đổi nhiều trong ngày." },
        { who: "Dr Novak", voice: "uk-nu", text: "Good, I'm glad you spotted that. So each site should always be sampled at the same hour on every visit. Can you do that?", vi: "Tốt, cô mừng là các em nhận ra. Vậy mỗi điểm phải luôn được lấy mẫu vào cùng một giờ ở mọi chuyến đi. Các em làm được chứ?" },
        { who: "Tom", voice: "us-nam", text: "Sure. Same route, same order, starting at nine. That makes sense.", vi: "Được ạ. Cùng lộ trình, cùng thứ tự, bắt đầu lúc chín giờ. Hợp lý ạ." },
        { who: "Dr Novak", voice: "uk-nu", text: "Right. Now let's go through what you actually do at each site, step by step, because the order matters. What's the very first thing?", vi: "Được. Giờ ta đi qua từng bước các em thực sự làm ở mỗi điểm, vì thứ tự rất quan trọng. Việc đầu tiên là gì?" },
        { who: "Priya", voice: "au-nu", text: "Before we touch anything, we take a picture of the site, always standing in the same spot, so we have a record of the water level and the colour.", vi: "Trước khi đụng vào bất cứ thứ gì, bọn em chụp một tấm hình điểm đó, luôn đứng đúng một chỗ, để có ghi nhận về mực nước và màu nước." },
        { who: "Tom", voice: "us-nam", text: "And then should we measure how deep the water is?", vi: "Rồi sau đó mình có nên đo nước sâu bao nhiêu không ạ?" },
        { who: "Dr Novak", voice: "uk-nu", text: "No, depth isn't needed for this study. What you must do next is take the temperature, straight from the river. If you wait until the sample's in your hand, it'll already have warmed up.", vi: "Không, đề tài này không cần độ sâu. Việc phải làm kế tiếp là đo nhiệt độ, ngay tại sông. Nếu đợi tới khi mẫu đã ở trong tay thì nó ấm lên mất rồi." },
        { who: "Priya", voice: "au-nu", text: "OK. Once that's done, we rinse the bottle three times in the river itself, so nothing from the last site is left inside, and then fill it from the middle of the stream.", vi: "Vâng. Xong bước đó, bọn em tráng chai ba lần ngay bằng nước sông, để không còn gì của điểm trước sót lại bên trong, rồi lấy đầy chai ở giữa dòng." },
        { who: "Tom", voice: "us-nam", text: "And then we write the site number and the time on the lid.", vi: "Rồi bọn em ghi số điểm và giờ lên nắp." },
        { who: "Priya", voice: "au-nu", text: "Not the lid, Tom. The lids all look the same and they got mixed up last time. It goes on the label on the side.", vi: "Không phải nắp đâu Tom. Nắp cái nào cũng giống nhau và lần trước bị lẫn hết. Phải ghi lên nhãn ở thân chai." },
        { who: "Dr Novak", voice: "uk-nu", text: "Quite right. After that, the insects. One of you stands in the water holding the net against the river bed, while the other disturbs the stones just upstream for one minute.", vi: "Đúng vậy. Sau đó là côn trùng. Một em đứng dưới nước giữ vợt sát đáy sông, em kia khuấy đá ngay phía thượng nguồn trong một phút." },
        { who: "Tom", voice: "us-nam", text: "And finally everything goes straight into the cool box, which stays in the shade until we're back at the lab.", vi: "Và cuối cùng mọi thứ cho thẳng vào thùng giữ lạnh, thùng này để trong bóng râm tới khi bọn em về phòng thí nghiệm." },
        { who: "Dr Novak", voice: "uk-nu", text: "Exactly. Write that list out and tape it inside the box.", vi: "Chính xác. Hãy chép danh sách đó ra và dán vào trong thùng." },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-nghe-hai-1",
      title: "Questions 21–22 — gõ HAI chữ cái",
      kind: "fill",
      items: [
        { q: "Which TWO problems did the students have during their pilot visit?", answers: ["B C", "BC", "C B", "CB", "B and C", "C and B", "B & C", "C & B", "B, C", "C, B"], hint: "Ba phương án kia là nỗi lo KHÔNG xảy ra." },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-nghe-hai-2",
      title: "Questions 23–24 — gõ HAI chữ cái",
      kind: "fill",
      items: [
        { q: "Which TWO changes do they agree to make to the main study?", answers: ["B E", "BE", "E B", "EB", "B and E", "E and B", "B & E", "E & B", "B, E", "E, B"], hint: "Câu hỏi là AGREE — phải có người kia đồng ý." },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-nghe-flow",
      title: "Questions 25–30 — ghi MỘT chữ cái (A–H)",
      kind: "fill",
      items: [
        { q: "(25) Take a ______ of the site from the same fixed point", answers: ["G"], hint: "băng dùng từ đồng nghĩa ngắn hơn" },
        { q: "(26) Measure the ______ of the water", answers: ["H"], hint: "đề xuất của Tom bị bác; nghe Dr Novak nói “next”" },
        { q: "(27) Rinse the ______ three times", answers: ["A"], hint: "Once that's done…" },
        { q: "(28) Write the site number and the time on the ______", answers: ["D"], hint: "Tom nói một nơi, Priya sửa lại" },
        { q: "(29) Use a ______ to collect insects", answers: ["F"], hint: "After that, the insects…" },
        { q: "(30) Put everything in the ______", answers: ["B"], hint: "And finally…" },
      ],
    },
    {
      t: "note",
      title: "Chấm điểm: Choose TWO tính 2 điểm mỗi cụm",
      items: [
        "Trong bài thi thật, **mỗi chữ cái đúng = 1 điểm** (đúng B sai C vẫn được 1). Ở đây máy chấm cả cặp — bạn tự cộng: tổng **10 điểm**.",
        "**8–10:** đạt mức band 6+ cho Part 3. **6–7:** nghe lại và dò bảng dưới. **≤ 5:** mở lời thoại, đọc to cùng băng một lượt (shadowing) rồi nghe lại không nhìn.",
      ],
    },

    /* ── 6 ── */
    { t: "h", text: "6. Sau khi nghe — đáp án nằm ở câu nào, bẫy ở đâu" },
    {
      t: "table",
      head: ["Câu", "Đáp án", "Câu trong băng", "Bẫy"],
      rows: [
        ["21–22", "**B**", "“The real headache was the pH meter… **It kept happening.**”", "A: “the forecast said heavy rain, **but in the end** it stayed dry” — lo hão"],
        ["21–22", "**C**", "“we **never got to** site three… fenced off… no other way down”", "D: “worried we hadn't taken enough” → “Six is **plenty**”. E: “**assumed** the lab would be locked, **but** the technician had stayed late”"],
        ["23–24", "**B**", "Tom: “Shouldn't we have one **upstream**?” → Novak: “exactly what I was going to suggest” → Priya: “Yes, **agreed**.”", "above the town = upstream / north of the town (paraphrase)"],
        ["23–24", "**E**", "“each site should always be sampled **at the same hour**” → Tom: “Sure… **That makes sense.**”", "A: “We'd love to, **but**… not realistic” → “Fortnightly it is.” C: “nice idea, **only** the budget…” D: “I don't see much point.”"],
        ["25", "**G** photograph", "“we take a **picture** of the site, always standing in the same spot”", "picture = photograph; same spot = same fixed point"],
        ["26", "**H** temperature", "“What you must do **next** is **take the temperature**”", "C depth: “**No**, depth isn't needed for this study.”"],
        ["27", "**A** bottle", "“**Once that's done**, we rinse the **bottle** three times”", "—"],
        ["28", "**D** label", "“**Not the lid**, Tom… It goes on the **label** on the side.”", "E lid: Tom nói trước, bị Priya sửa"],
        ["29", "**F** net", "“holding the **net** against the river bed”", "—"],
        ["30", "**B** cool box", "“**finally** everything goes straight into the **cool box**”", "fridge (nhắc ở đầu bài) không có trong hộp"],
      ],
    },
    {
      t: "note",
      title: "Mệnh đề quan hệ trong băng — nghe lại và để ý chỗ NGẮT",
      items: [
        "“The footpath, | **which runs behind the factory**, | was fenced off…” — hai chỗ ngắt, giọng **hạ thấp** ở giữa.",
        "“water temperature, | **which affects the oxygen level**, | changes a lot…”",
        "“…the cool box, | **which stays in the shade** until we're back at the lab.”",
        "“comments we got from **people living by the river**” — rút gọn V-ing: **không** ngắt.",
      ],
    },

    /* ── 7 ── */
    { t: "h", text: "7. Luyện thêm: flow-chart VIẾT từ (ONE WORD AND/OR A NUMBER)" },
    {
      t: "p",
      text: "Biến thể còn lại của flow-chart: không có hộp, bạn **viết** từ nghe được. Ở đây chính tả và giới hạn từ quyết định điểm. Nghe kỹ thuật viên **Ben** dặn Priya cách xử lý mẫu khi về phòng thí nghiệm — Questions 1–4.",
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Back at the laboratory",
      steps: [
        { label: "Put the samples in the fridge, set at **1 ______** °C" },
        { label: "Test every sample within **2 ______** hours" },
        { label: "Shake the bottle; pour 10 ml into a test tube" },
        { label: "Add one **3 ______** and wait five minutes" },
        { label: "Compare the colour of the liquid with the **4 ______** on the wall" },
        { label: "Enter the result in the spreadsheet" },
      ],
    },
    {
      t: "listen",
      id: "t3d17-nghe-lab",
      title: "Back at the laboratory",
      dan: { so: "Day 17, Recording 3", boiCanh: "a laboratory technician, Ben, explaining to a student how to test water samples.", cau: [1, 4] },
      note: "Khoảng 1 phút 10 giây, hai giọng: Ben (Anh, nam) · Priya (Úc, nữ).",
      lines: [
        { who: "Ben", voice: "uk-nam", text: "Right, Priya, as soon as you get back, the samples go into this fridge. It's set at four degrees, and please don't change that. The one next door is at minus eighteen, which would freeze them solid.", vi: "Nào Priya, ngay khi về tới nơi, mẫu phải cho vào cái tủ lạnh này. Nó đặt ở bốn độ, và đừng chỉnh nhé. Cái tủ phòng bên là âm mười tám độ, sẽ làm mẫu đông cứng." },
        { who: "Priya", voice: "au-nu", text: "Four degrees. And how long can they stay there? We were told forty-eight hours.", vi: "Bốn độ. Và mẫu để đó được bao lâu ạ? Bọn em được bảo là bốn mươi tám tiếng." },
        { who: "Ben", voice: "uk-nam", text: "That used to be the rule, but nitrate levels start to change after a day, so now it's twenty-four hours at the most. When you're ready to test, give the bottle a good shake and pour ten millilitres into a clean test tube.", vi: "Trước đây quy định thế, nhưng mức nitrat bắt đầu thay đổi sau một ngày, nên giờ tối đa là hai mươi bốn tiếng. Khi sẵn sàng xét nghiệm, lắc kỹ chai rồi rót mười mi-li-lít vào ống nghiệm sạch." },
        { who: "Priya", voice: "au-nu", text: "Then we add the powder?", vi: "Rồi bọn em cho bột vào ạ?" },
        { who: "Ben", voice: "uk-nam", text: "We've stopped using the powder, it was too easy to spill. You drop in one tablet, T-A-B-L-E-T, put the cap on and leave it for five minutes. The liquid turns pink, and you hold the tube up against the chart on the wall, the one with the colour squares, and read off the number.", vi: "Bọn anh không dùng bột nữa, dễ đổ quá. Em thả vào một viên nén, T-A-B-L-E-T, đậy nắp và để năm phút. Dung dịch chuyển hồng, em giơ ống lên so với bảng màu trên tường, cái có các ô màu ấy, rồi đọc con số." },
        { who: "Priya", voice: "au-nu", text: "And the number goes straight into the spreadsheet. Got it.", vi: "Và con số nhập thẳng vào bảng tính. Em hiểu rồi." },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-nghe-lab-cau",
      title: "Questions 1–4 — ONE WORD AND/OR A NUMBER",
      kind: "fill",
      items: [
        { q: "(1) fridge set at ______ °C", answers: ["4", "four"], hint: "Có hai con số nhiệt độ — cái nào là của tủ NÀY?" },
        { q: "(2) test within ______ hours", answers: ["24", "twenty-four", "twenty four"], hint: "“That used to be the rule, but…”" },
        { q: "(3) add one ______", answers: ["tablet"], hint: "được đánh vần" },
        { q: "(4) compare the colour with the ______ on the wall", answers: ["chart"], hint: "“hold the tube up against the …”" },
      ],
    },
    {
      t: "note",
      title: "Giải thích",
      items: [
        "**(1) 4** — “It's set at **four degrees**.” Bẫy: “minus eighteen” là tủ **phòng bên**.",
        "**(2) 24** — “**That used to be the rule, but**… now it's **twenty-four hours** at the most.” Bẫy đổi ý: forty-eight là quy định cũ.",
        "**(3) tablet** — “**We've stopped using the powder**… You drop in one **tablet**.” Bẫy: powder do Priya nhắc, bị bác.",
        "**(4) chart** — “hold the tube up against the **chart** on the wall”. “colour squares” là mô tả, và sơ đồ đã có sẵn chữ colour.",
      ],
    },

    /* ── 8 ── */
    { t: "h", text: "8. Phát âm: ngắt hơi trước mệnh đề quan hệ không xác định" },
    {
      t: "p",
      text: "Dấu phẩy trong bài viết thành **khoảng ngắt** khi nói. Mệnh đề không xác định được nói như một “ngoặc đơn”: **ngắt ngắn → hạ giọng xuống một bậc và nói nhanh hơn một chút → ngắt ngắn → trở lại cao độ cũ**. Mệnh đề xác định và mệnh đề rút gọn **không có dấu phẩy** thì **nói liền**, không ngắt (rút gọn mà có dấu phẩy — “The lab, built in 1990, …” — vẫn ngắt như mệnh đề không xác định). Nghe được chỗ ngắt này, bạn phân biệt được hai nghĩa ở bài Ngữ pháp mục 2; nói được nó, câu dài của bạn nghe **có tổ chức** (tiêu chí P và FC).",
    },
    {
      t: "table",
      head: ["Loại", "Cách nói (| = ngắt ngắn)", "Ghi nhớ"],
      rows: [
        ["Không xác định, giữa câu", "My brother, | who lives in London, | is a doctor.", "hai chỗ ngắt; phần giữa **thấp giọng**"],
        ["Không xác định, cuối câu", "We tested six samples, | two of which were polluted.", "một chỗ ngắt; giọng **đi xuống** ở cuối"],
        ["“, which” thay cả ý", "The bus was late, | which made me miss the class.", "ngắt trước which; **which không nhấn**"],
        ["Xác định / rút gọn (không phẩy)", "People living near the river often go fishing.", "**không ngắt** giữa people và living"],
      ],
    },
    {
      t: "phatam",
      id: "t3d17-phat-am-ngat-hoi",
      title: "Luyện phát âm: ngắt hơi trước mệnh đề quan hệ không xác định",
      note: "Ở mỗi dấu phẩy: dừng nửa nhịp rồi nói tiếp, đừng lên giọng như hỏi. Dòng 6 KHÔNG có dấu phẩy — đọc liền để thấy khác. Máy chấm từng âm; hãy tự nghe lại bản ghi xem chỗ ngắt đã rõ chưa.",
      items: [
        { text: "My brother, who lives in London, is a doctor.", ipa: "maɪ brʌðə huː lɪvz ɪn lʌndən ɪz ə dɒktə", vi: "Anh tôi, người sống ở London, là bác sĩ." },
        { text: "The river, which runs through the town, is very clean.", ipa: "ðə rɪvə wɪtʃ rʌnz θruː ðə taʊn ɪz veri kliːn", vi: "Con sông, vốn chảy qua thị trấn, rất sạch." },
        { text: "We tested six samples, two of which were polluted.", ipa: "wiː testɪd sɪks sɑːmplz tuː əv wɪtʃ wə pəluːtɪd", vi: "Chúng tôi xét nghiệm sáu mẫu, hai trong số đó bị ô nhiễm." },
        { text: "The bus was late, which made me miss the class.", ipa: "ðə bʌs wəz leɪt wɪtʃ meɪd miː mɪs ðə klɑːs", vi: "Xe buýt trễ, khiến tôi lỡ buổi học." },
        { text: "Doctor Novak, whose office is upstairs, will check the results.", ipa: "dɒktə nəʊvæk huːz ɒfɪs ɪz ʌpsteəz wɪl tʃek ðə rɪzʌlts", vi: "Tiến sĩ Novak, người có văn phòng ở tầng trên, sẽ kiểm tra kết quả." },
        { text: "People living near the river often go fishing.", ipa: "piːpl lɪvɪŋ nɪə ðə rɪvə ɒfn ɡəʊ fɪʃɪŋ", vi: "Người sống gần sông thường đi câu cá." },
        { text: "The lab, built in nineteen ninety, needs new equipment.", ipa: "ðə læb bɪlt ɪn naɪntiːn naɪnti niːdz njuː ɪkwɪpmənt", vi: "Phòng thí nghiệm, xây năm 1990, cần thiết bị mới." },
        { text: "Many students work at night, which means they have less time to study.", ipa: "meni stjuːdnts wɜːk ət naɪt wɪtʃ miːnz ðeɪ hæv les taɪm tə stʌdi", vi: "Nhiều sinh viên làm ban đêm, nghĩa là họ có ít thời gian học hơn." },
      ],
    },
    {
      t: "note",
      title: "Mẹo luyện 5 phút mỗi ngày",
      items: [
        "Mở lời thoại bài nghe chính, tìm ba câu có “, which” — **đọc to cùng băng** (shadowing), bắt chước đúng chỗ ngắt của người nói.",
        "Khi trả lời Part 3, tự thêm một câu “, which means…” — nhớ **ngắt trước which**, đừng ngắt sau nó.",
        "Lỗi hay gặp của người Việt: ngắt **sau** từ quan hệ (“The river which, | runs through…”) hoặc lên giọng ở dấu phẩy như đang hỏi. Cả hai đều làm người nghe mất mạch.",
      ],
    },
  ],
};
/* ─────────────────────────── Bài tập Ngày 17 ─────────────────────────── */

const T3D17_HOMEWORK: Lesson = {
  id: "t3d17-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 17",
  goal: "Củng cố mệnh đề quan hệ không xác định, “, which”, of which / of whom, rút gọn V-ing / V3, ngôn ngữ quy trình và kỹ năng nhận ra đề xuất bị bác — 35 câu có đáp án + một đoạn nói Part 3.",
  minutes: 55,
  blocks: [
    {
      t: "recap",
      title: "Trước khi làm",
      items: [
        "Làm **không mở lại bài**; xong mới xem đáp án. Mục tiêu: **≥ 28/35**.",
        "Phần I–III: ngữ pháp (bài 1). Phần IV–V: ngôn ngữ quy trình + flow-chart (bài 2). Phần VI: tín hiệu chấp nhận / bác bỏ (bài 3).",
        "Sai phần nào thì mở lại đúng mục: I → mục 2–5 · II → mục 6–7 · IV → bảng 16 từ · VI → bảng tín hiệu.",
      ],
    },
    { t: "h", text: "Phần I — Chọn từ quan hệ đúng (8 câu)" },
    {
      t: "mcq",
      id: "t3d17-bt-chon",
      title: "I. who · which · whose · where · of which · of whom",
      items: [
        { q: "Hue, ______ was once the capital of Vietnam, attracts millions of visitors.", options: ["that", "which", "where", "who"], correct: 1, why: "Tên riêng + dấu phẩy → không xác định; which làm chủ ngữ của was. Không dùng that sau dấu phẩy; where không làm chủ ngữ được." },
        { q: "We stayed in Sa Pa, ______ the temperature can fall below zero in winter.", options: ["which", "that", "where", "whose"], correct: 2, why: "Sau chỗ trống đã có chủ ngữ (the temperature) + động từ → cần trạng từ quan hệ chỉ nơi chốn: **where** (= in which)." },
        { q: "Professor Tran, ______ book won a national prize, will give the lecture.", options: ["whose", "who", "which", "whom"], correct: 0, why: "“book của giáo sư” → sở hữu: **whose** + danh từ." },
        { q: "The company hired fifty graduates, most ______ had studied engineering.", options: ["of them", "of who", "of which", "of whom"], correct: 3, why: "Người + lượng từ → **of whom**. “of them” tạo comma splice; “of who” sai dạng." },
        { q: "The factory closed last year, ______ meant that 500 people lost their jobs.", options: ["that", "it", "which", "what"], correct: 2, why: "which thay cả mệnh đề phía trước (“việc nhà máy đóng cửa”). it → comma splice." },
        { q: "The report examines the extent ______ social media affects sleep.", options: ["to which", "in which", "which", "to that"], correct: 0, why: "Cụm cố định **the extent to which** + S + V." },
        { q: "The museum has 3,000 paintings, only a tenth ______ are on display.", options: ["of whom", "of which", "which", "of them"], correct: 1, why: "Vật → **of which**." },
        { q: "My manager, ______ I have worked with for six years, is retiring.", options: ["that", "which", "whose", "who"], correct: 3, why: "Người, không xác định → **who** (trang trọng: whom). Không dùng that sau dấu phẩy." },
      ],
    },
    { t: "h", text: "Phần II — V-ing hay V3? (6 câu)" },
    {
      t: "quiz",
      id: "t3d17-bt-rut-gon",
      title: "II. Viết dạng đúng của động từ trong ngoặc (V-ing hoặc V3)",
      kind: "fill",
      items: [
        { q: "The percentage of adults ______ (own) a smartphone rose to 85%.", answers: ["owning"], hint: "adults tự sở hữu → chủ động" },
        { q: "The chart shows the amount of electricity ______ (generate) from wind.", answers: ["generated"], hint: "điện được tạo ra → bị động" },
        { q: "Passengers ______ (travel) without a ticket will be fined.", answers: ["travelling", "traveling"], hint: "passengers tự đi" },
        { q: "The essay ______ (write) by the youngest student won first prize.", answers: ["written"], hint: "có by → bị động; cột 3 của write" },
        { q: "Exports fell by 12%, ______ (reach) their lowest level in ten years.", answers: ["reaching"], hint: ", V-ing = , which reached" },
        { q: "The road ______ (repair) at the moment will reopen in May.", answers: ["being repaired"], hint: "đang được sửa → being + V3" },
      ],
    },
    { t: "h", text: "Phần III — Dịch Việt → Anh (6 câu)" },
    {
      t: "quiz",
      id: "t3d17-bt-dich",
      title: "III. Dịch sang tiếng Anh — dùng cấu trúc trong ngoặc",
      kind: "translate",
      grammar: "mệnh đề quan hệ không xác định · , which · of whom · V-ing · V3",
      items: [
        { q: "Mẹ tôi, người đã dạy học ba mươi năm, vừa nghỉ hưu. (who)", answers: ["My mother, who taught for thirty years, has just retired.", "My mother, who has taught for thirty years, has just retired.", "My mother, who had taught for thirty years, has just retired.", "My mother, who taught for 30 years, has just retired.", "My mum, who taught for thirty years, has just retired."], hint: "who taught · has just retired" },
        { q: "Nhiều người trẻ chuyển lên thành phố, điều này khiến nông thôn thiếu lao động. (, which)", answers: ["Many young people move to cities, which leaves the countryside short of workers.", "Many young people move to cities, which causes a shortage of workers in the countryside.", "Many young people move to the city, which causes a shortage of workers in the countryside.", "Many young people move to cities, which causes a labour shortage in the countryside.", "Many young people move to cities, which leads to a shortage of workers in the countryside.", "Many young people move to cities, which leads to a labour shortage in the countryside.", "Many young people move to cities, which causes a shortage of labour in the countryside."], hint: "move to cities · which causes / leads to · a shortage of workers" },
        { q: "Lớp tôi có ba mươi sinh viên, một nửa trong số đó đi làm thêm. (of whom)", answers: ["My class has thirty students, half of whom work part-time.", "My class has 30 students, half of whom work part-time.", "My class has thirty students, half of whom have part-time jobs.", "My class has thirty students, half of whom have a part-time job.", "There are thirty students in my class, half of whom work part-time."], hint: "half of whom · work part-time" },
        { q: "Số người làm việc ở nhà đã tăng gấp ba. (V-ing)", answers: ["The number of people working from home has tripled.", "The number of people working at home has tripled.", "The number of people working from home has trebled."], hint: "The number of people working from home · has tripled" },
        { q: "Rác thải nhựa bị vứt xuống sông cuối cùng sẽ ra biển. (V3)", answers: ["Plastic waste thrown into rivers eventually ends up in the sea.", "Plastic waste thrown into rivers ends up in the sea eventually.", "Plastic waste thrown into rivers will eventually end up in the sea.", "Plastic waste thrown into the river eventually ends up in the sea.", "Plastic waste thrown into rivers eventually reaches the sea.", "Plastic waste thrown into rivers will eventually reach the sea."], hint: "Plastic waste thrown into rivers · ends up in the sea" },
        { q: "Công nghệ đã thay đổi cách mà chúng ta học. (the way in which)", answers: ["Technology has changed the way in which we learn.", "Technology has changed the way in which we study.", "Technology has changed the way we learn."], hint: "has changed · the way in which" },
      ],
    },
    { t: "h", text: "Phần IV — Từ vựng quy trình (6 câu)" },
    {
      t: "p",
      text: "Chọn một từ trong khung và viết **đúng dạng**: **undergo · extract · convert · evaporate · dissolve · discharge · trap · condense**. (Thừa hai từ.)",
    },
    {
      t: "quiz",
      id: "t3d17-bt-quy-trinh",
      title: "IV. Điền từ trong khung — đúng dạng",
      kind: "fill",
      items: [
        { q: "Oil is ______ from the seeds by pressing them.", answers: ["extracted"], hint: "… A from B · bị động" },
        { q: "In the final stage, the sunlight is ______ into electricity.", answers: ["converted"], hint: "… A into B" },
        { q: "When the liquid is heated, the water ______ and only the salt remains.", answers: ["evaporates"], hint: "nội động từ · chủ ngữ số ít" },
        { q: "All new medicines must ______ years of testing before they are sold.", answers: ["undergo"], hint: "sau must → nguyên mẫu" },
        { q: "The factory was fined for ______ chemicals into the river.", answers: ["discharging"], hint: "sau for → V-ing" },
        { q: "The tablet ______ completely in water within two minutes.", answers: ["dissolves"], hint: "sự thật → hiện tại đơn" },
      ],
    },
    { t: "h", text: "Phần V — Flow-chart completion: đoạn đọc mới (5 câu)" },
    {
      t: "passage",
      title: "How instant coffee is made",
      intro: "Khoảng 120 từ — 4 phút. ONE WORD ONLY from the passage.",
      paras: [
        { text: "Coffee beans arrive at the factory green and are first roasted at about 200°C, which gives them their brown colour and familiar smell. The roasted beans are then ground into a coarse powder and mixed with hot water in tall steel columns, producing a strong liquid coffee. Next, some of the water is removed in an evaporator, leaving a thick extract. In the freeze-drying method, which is used for many premium brands, this extract is frozen at around minus 40°C and broken into small granules. The granules are placed in a vacuum chamber, where the ice turns directly into vapour, leaving dry coffee behind. Finally, the granules are packed into glass jars sealed to keep out moisture." },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Instant coffee production",
      steps: [
        { label: "Green beans are **1 ______** at about 200°C" },
        { label: "Beans are ground, then mixed with hot water inside steel **2 ______**" },
        { label: "Part of the water is taken out using an **3 ______**" },
        { label: "The thick extract is frozen and broken up into **4 ______**" },
        { label: "Ice is removed in a vacuum **5 ______**; coffee is packed in jars" },
      ],
    },
    {
      t: "quiz",
      id: "t3d17-bt-flow",
      title: "V. Questions 1–5 — ONE WORD ONLY",
      kind: "fill",
      items: [
        { q: "(1) Green beans are ______ at about 200°C", answers: ["roasted"], hint: "động từ V3" },
        { q: "(2) inside steel ______", answers: ["columns"], hint: "danh từ số nhiều" },
        { q: "(3) taken out using an ______", answers: ["evaporator"], hint: "sau an → bắt đầu bằng nguyên âm" },
        { q: "(4) broken up into ______", answers: ["granules"], hint: "small …" },
        { q: "(5) a vacuum ______", answers: ["chamber"], hint: "từ của bảng 16 từ" },
      ],
    },
    {
      t: "note",
      title: "Giải thích phần V",
      items: [
        "(1) “are first **roasted** at about 200°C”. (2) “in tall steel **columns**” — tall bị lược. (3) “removed in an **evaporator**” — removed → taken out.",
        "(4) “broken into small **granules**” — broken into → broken up into. (5) “placed in a vacuum **chamber**, where the ice turns directly into vapour” — the ice turns into vapour → ice is removed.",
        "Soi ngữ pháp: “**, which gives** them…” (which thay cả ý) · “**, producing** a strong liquid coffee” · “**, leaving** a thick extract” (V-ing rút gọn) · “jars **sealed** to keep out moisture” (V3 rút gọn).",
      ],
    },
    { t: "h", text: "Phần VI — Đề xuất được chấp nhận hay bị bác? (4 câu)" },
    {
      t: "mcq",
      id: "t3d17-bt-tin-hieu",
      title: "VI. Đọc đoạn thoại ngắn — đề xuất của người A có được CHỌN không?",
      items: [
        { q: "A: “Shall we interview the shop owners as well?” — B: “It's a nice idea, only we've got three days left.”", options: ["Được chọn", "Bị bác"], correct: 1, why: "“It's a nice idea, **only**…” = từ chối lịch sự (lý do: hết thời gian)." },
        { q: "A: “Why don't we put the results in a bar chart?” — B: “That's exactly what I was going to suggest.”", options: ["Được chọn", "Bị bác"], correct: 0, why: "“exactly what I was going to suggest” = đồng ý hoàn toàn." },
        { q: "A: “I assumed we'd need permission from the council.” — B: “So did I, but actually the path is public.”", options: ["Không cần xin phép", "Cần xin phép"], correct: 0, why: "“I assumed… **but actually**…” — giả định bị bác: đường công cộng nên không cần xin phép." },
        { q: "A: “Could we move the presentation to Friday?” — B: “Friday's fine by me. Let's do that.”", options: ["Bị bác", "Được chọn"], correct: 1, why: "“fine by me. **Let's do that.**” = chấp nhận." },
      ],
    },
    { t: "h", text: "Nói thêm — 3 câu Part 3 (ghi âm, AI chấm)" },
    {
      t: "p",
      text: "Mỗi câu trả lời 30–45 giây. Bắt buộc dùng **ít nhất một** “People / Students + **V-ing**…” và **một** “**, which means / , which is why**…”. Nhớ ngắt hơi trước which.",
    },
    {
      t: "speak",
      id: "t3d17-bt-noi",
      part: "3",
      questions: [
        "Why do so many people living in the countryside move to big cities?",
        "Do you think rivers and lakes in your country are cleaner or dirtier than in the past?",
        "Should companies that pollute the environment pay higher taxes?",
      ],
    },
  ],
};

export const NGAY_17: Lesson[] = [T3D17_GRAMMAR, T3D17_READING, T3D17_LISTENING, T3D17_HOMEWORK];
