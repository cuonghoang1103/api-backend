/**
 * IELTS Tập 5 — Ngày 3 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài đọc, câu trả lời mẫu, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)  Lỗi dai dẳng cá nhân: hoà hợp chủ – vị (SVA) · mạo từ · giới từ — truy từ sổ lỗi, viết “quy tắc của tôi”,
 *                    soát ngược ba lượt [G43] — nối Tập 3 Ngày 27 (bảng tự soát 6 lượt) · Tập 4 Ngày 1 (năm ô của cụm danh từ)
 *   Bài 2 (reading)  True / False / Not Given band 8 — câu hỏi dài ~40 từ nhiều vế, suy luận một bước; bài đọc ~1.000 từ
 *                    (lịch sử y học: thuốc chữa bệnh scorbut được tìm ra rồi bị đánh mất), 13 câu [R05 R19]
 *                    — nối Tập 4 Ngày 5 (TFNG band 7) · Tập 3 Ngày 1 (thang paraphrase 4 mức)
 *   Bài 3 (speaking) Part 1 band 8: trả lời tự nhiên ba nhịp, idiom dùng khéo [S04 VD7] — nối Tập 3 Ngày 3 (12 khung Part 1) ·
 *                    Tập 4 Ngày 2 (ôn khung ở mức band 7) · 🔊 nguyên âm đôi /eɪ/ /əʊ/ /aɪ/ /aʊ/ /ɪə/ /eə/
 *   Bài tập Ngày 3   40 câu có đáp án
 * Mọi id bắt đầu `t5d3-`.
 */
import type { Lesson } from '../data';

export const NGAY_3: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t5d3-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Lỗi dai dẳng cá nhân — hoà hợp chủ – vị, mạo từ, giới từ: truy từ sổ lỗi",
    goal: "Tìm ra đúng 2–3 lỗi ngữ pháp của RIÊNG mình trong ba nhóm chủ – vị, mạo từ, giới từ; viết quy tắc cá nhân cho từng lỗi và soát ngược ba lượt để một bài 280 từ chỉ còn 0–1 lỗi.",
    minutes: 95,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **GRA Writing + Speaking từ 7 lên 8**: band 7 là “thường không lỗi, còn vài lỗi dai dẳng”; band 8 là “đa số câu không lỗi, chỉ sai lặt vặt rất hiếm”.",
          "Ba nhóm lỗi người Việt mang theo lâu nhất: **hoà hợp chủ – vị (SVA)** khi chủ ngữ dài, **mạo từ** a / an / the / không mạo từ, **giới từ** sau danh từ – động từ – tính từ.",
          "Hôm nay không học quy tắc mới để biết thêm — học cách **truy lỗi của riêng bạn**: đếm, gọi tên, viết quy tắc một dòng, rồi soát đúng lỗi đó.",
          "Công cụ: **Sổ lỗi** của khoá (`/language/en/ielts/so-loi`) + ba bài viết gần nhất của bạn.",
          "Nối lại: Tập 3 Ngày 27 (bảng tự soát 6 lượt), Tập 4 Ngày 1 (năm ô của cụm danh từ — mạo từ nằm ở ô 1).",
        ],
      },

      { t: "h", text: "1. Vì sao band 7 kẹt ở “lỗi dai dẳng” — và cách truy" },
      { t: "p", text: "Ở band 7 bạn **đã biết** gần hết quy tắc. Lỗi còn lại không đến từ chỗ không biết, mà từ **thói quen**: tiếng Việt không chia động từ theo chủ ngữ, không có mạo từ, và giới từ đi theo logic khác. Khi viết nhanh, não chạy theo thói quen cũ. Vì thế học lại cả chương ngữ pháp không giúp gì; phải biết **chính mình** sai ở đâu rồi soát đúng chỗ đó." },
      {
        t: "table", head: ["Tiêu chí GRA", "Band 7", "Band 8"],
        rows: [
          ["Tỉ lệ câu sạch lỗi", "Khoảng 6–7 trên 10 câu", "Khoảng 9 trên 10 câu"],
          ["Loại lỗi còn lại", "Lặp lại cùng một kiểu (the society, depend to, The number… have)", "Lỗi lặt vặt, mỗi kiểu chỉ một lần (slip)"],
          ["Giám khảo nghĩ gì", "“Người này chưa kiểm soát được mạo từ.”", "“Người này lỡ tay một chỗ.”"],
          ["Việc cần làm", "Xoá **kiểu lỗi**", "Giữ nhịp soát 3 phút cuối bài"],
        ],
      },
      {
        t: "sodo", kind: "flow", title: "Truy lỗi dai dẳng — 5 bước", caption: "Làm một lần hôm nay, lặp lại sau mỗi đề ở Ngày 8 · 16 · 24.",
        steps: [
          { label: "Gom", sub: "3 bài viết gần nhất đã được AI chấm + Sổ lỗi" },
          { label: "Gạch", sub: "tô 3 màu: chủ – vị · mạo từ · giới từ" },
          { label: "Đếm", sub: "kiểu lỗi nào ≥ 2 lần = lỗi dai dẳng" },
          { label: "Viết quy tắc", sub: "một dòng, bằng lời của bạn" },
          { label: "Soát ngược", sub: "mỗi lượt chỉ tìm MỘT kiểu lỗi" },
        ],
      },
      { t: "p", text: "Trước khi học, làm bài chẩn đoán dưới đây. Mỗi câu có **đúng một lỗi** thuộc một trong ba nhóm. Ghi lại câu nào bạn bỏ sót — đó là manh mối đầu tiên." },
      {
        t: "quiz", id: "t5d3-chan-doan", kind: "fill", title: "Chẩn đoán đầu bài — gõ lại từ / cụm ĐÚNG thay cho chỗ gạch (9 câu)",
        items: [
          { q: "The number of people working from home ~~have~~ doubled since 2019.", answers: ["has"], hint: "Nhóm chủ – vị: danh từ chính là number." },
          { q: "One of the main reasons for this trend ~~are~~ the falling cost of devices.", answers: ["is"], hint: "Nhóm chủ – vị: one of + số nhiều + động từ số ít." },
          { q: "Neither the manager nor the employees ~~was~~ informed of the change.", answers: ["were"], hint: "Nhóm chủ – vị: theo chủ ngữ gần động từ nhất." },
          { q: "~~The society~~ benefits when citizens are well informed.", answers: ["Society"], hint: "Nhóm mạo từ: xã hội nói chung." },
          { q: "She carried out ~~a research~~ into sleep patterns among teenagers.", answers: ["research", "some research", "a piece of research", "a study"], hint: "Nhóm mạo từ: research không đếm được." },
          { q: "Unemployment fell sharply in ~~the recent years~~.", answers: ["recent years"], hint: "Nhóm mạo từ: cụm cố định không có the." },
          { q: "There has been a sharp increase ~~of~~ the price of housing.", answers: ["in"], hint: "Nhóm giới từ: increase + ? + thứ tăng." },
          { q: "The committee discussed ~~about~~ the proposal for two hours.", answers: ["discussed", "bỏ about", "ø", "-"], hint: "Nhóm giới từ: discuss là ngoại động từ — gõ “discussed” hoặc dấu “-”." },
          { q: "Poor diet contributes to ~~develop~~ heart disease.", answers: ["developing", "the development of"], hint: "Nhóm giới từ: to ở đây là giới từ." },
        ],
      },

      { t: "h", text: "2. Chủ – vị ① — chủ ngữ dài: tìm DANH TỪ CHÍNH rồi mới chia" },
      { t: "p", text: "Câu học thuật band 8 có chủ ngữ dài 10–15 từ. Lỗi xảy ra vì động từ **đứng cạnh một danh từ khác** chứ không phải danh từ chính (head noun). Cách chữa: lấy bút gạch mọi thứ sau giới từ và mọi mệnh đề quan hệ — phần còn lại là danh từ chính." },
      {
        t: "patterns",
        rows: [
          {
            formula: "N chính + giới từ + N khác + V (theo N chính)", vi: "Cụm giới từ (of, in, for, among…) không bao giờ quyết định động từ.",
            examples: [
              { en: "The **rise** in the number of private vehicles **has** put pressure on city centres.", vi: "Sự gia tăng số xe cá nhân đã gây áp lực lên trung tâm thành phố. (rise … has)" },
              { en: "The **effects** of this policy on rural employment **are** still unclear.", vi: "Tác động của chính sách này lên việc làm nông thôn vẫn chưa rõ. (effects … are)" },
            ],
          },
          {
            formula: "N chính + who / which / that + … + V (theo N chính)", vi: "Mệnh đề quan hệ chen giữa: bỏ qua nó khi chia động từ chính.",
            examples: [
              { en: "**Students** who take a part-time job in their first year **tend** to manage time better.", vi: "Sinh viên đi làm thêm từ năm nhất thường quản lý thời gian tốt hơn." },
              { en: "The **argument** that longer sentences reduce crime **rests** on weak evidence.", vi: "Lập luận rằng án dài hơn làm giảm tội phạm dựa trên bằng chứng yếu." },
            ],
          },
          {
            formula: "one of + N số nhiều + V số ít · one of + N số nhiều + who / that + V số nhiều", vi: "Động từ chính theo one; động từ trong mệnh đề quan hệ theo danh từ số nhiều đứng ngay trước who / that.",
            examples: [
              { en: "One of the factors **is** cost.", vi: "Một trong các yếu tố là chi phí." },
              { en: "Cost is one of the factors that **influence** this decision.", vi: "Chi phí là một trong những yếu tố ảnh hưởng tới quyết định này. (factors … influence)" },
            ],
          },
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai ở chủ ngữ dài",
        items: [
          "Chia theo danh từ **gần nhất**: ~~The quality of the roads have improved.~~ → **has** improved.",
          "Quên -s sau mệnh đề quan hệ dài: ~~A child who spends hours on screens and rarely plays outside tend to…~~ → **tends**.",
          "Chủ ngữ là V-ing hoặc cả một mệnh đề ⇒ **luôn số ít**: **Raising** taxes on sugary drinks **is** unpopular. · **What matters** most **is** consistency.",
          "Đảo ngữ và There: động từ theo danh từ **đứng sau**: There **are** a number of reasons. · Among the causes **is** a lack of funding.",
        ],
      },
      { t: "rule", formula: "Gạch cụm giới từ + mệnh đề quan hệ → N chính + V", vi: "Trước mỗi động từ chính, hỏi: “Ai / cái gì làm việc này?” — trả lời bằng MỘT danh từ." },
      {
        t: "quiz", id: "t5d3-sva-dich", kind: "translate", title: "Dịch sang tiếng Anh — chủ ngữ dài (4 câu)", grammar: "N chính + (giới từ / mệnh đề quan hệ) + V theo N chính",
        items: [
          { q: "Chất lượng của các dịch vụ công ở những vùng này đã giảm.", answers: ["The quality of public services in these areas has declined.", "The quality of public services in these regions has fallen.", "The quality of public services in these areas has fallen.", "The quality of public services in these regions has declined."], hint: "quality · public services · decline" },
          { q: "Một trong những lý do chính là thiếu kinh phí.", answers: ["One of the main reasons is a lack of funding.", "One of the main reasons is the lack of funding.", "One of the major reasons is a lack of funding."], hint: "one of · reason · a lack of funding" },
          { q: "Những người sống gần sân bay thường ngủ kém.", answers: ["People who live near an airport tend to sleep badly.", "People who live near airports tend to sleep badly.", "People who live near airports tend to sleep poorly.", "People living near airports tend to sleep badly.", "People living near airports tend to sleep poorly.", "People who live near an airport tend to sleep poorly."], hint: "people who · tend to · sleep badly" },
          { q: "Giảm số giờ làm việc không phải lúc nào cũng làm giảm năng suất.", answers: ["Reducing working hours does not always reduce productivity.", "Cutting working hours does not always reduce productivity.", "Reducing working hours does not always lower productivity.", "Reducing working hours doesn't always reduce productivity."], hint: "V-ing làm chủ ngữ · does not always" },
        ],
      },

      { t: "h", text: "3. Chủ – vị ② — mười chủ ngữ bẫy" },
      { t: "p", text: "Nhóm này sai không vì chủ ngữ dài mà vì **hình thức đánh lừa**: trông số nhiều nhưng chia số ít, hoặc ngược lại. Học theo bảng, rồi khoanh những dòng bạn từng sai." },
      {
        t: "table", head: ["Chủ ngữ", "Động từ", "Ví dụ đúng", "Lý do"],
        rows: [
          ["**The number of** + N số nhiều", "số ít", "The number of applicants **has** fallen.", "Nói về một con số"],
          ["**A number of** + N số nhiều", "số nhiều", "A number of studies **have** shown this.", "= several"],
          ["A range / variety / series **of** + N số nhiều", "thường số ít trong văn viết trang trọng", "A range of measures **has** been proposed. (have cũng gặp)", "Chọn một cách và giữ suốt bài"],
          ["**Each / Every / Either / Neither** (+ of…)", "số ít", "Each of these solutions **has** a cost.", "Xét từng cái một"],
          ["Danh từ không đếm được: research, evidence, advice, information, equipment, knowledge, progress", "số ít", "The evidence **suggests** otherwise.", "Không thêm -s, không a / an"],
          ["data · media · criteria · phenomena", "số nhiều trong văn học thuật (data, media dùng số ít cũng được chấp nhận)", "The criteria **are** unclear. · The data **show** / shows…", "Số ít: criterion, phenomenon"],
          ["A **as well as / along with / together with** B", "theo A", "The teacher, along with her students, **was** present.", "Phần sau chỉ là chú thích"],
          ["**Either A or B · Neither A nor B · Not only A but also B**", "theo B (gần động từ)", "Neither the minister nor his advisers **were** aware.", "Quy tắc gần nhất"],
          ["Phần trăm / phân số / **most, some, all, half** + of + N", "theo N", "Two thirds of the land **is** farmed. · Half of the students **work**.", "N quyết định"],
          ["**The + tính từ** (the elderly, the unemployed) · **the police**", "số nhiều", "The elderly **are** particularly at risk.", "Chỉ một nhóm người"],
        ],
      },
      { t: "rule", formula: "The number of + Ns + V(s/es) · A number of + Ns + V", vi: "The number = con số (số ít). A number = nhiều (số nhiều). Sai cặp này trong Task 1 là mất điểm thấy ngay." },
      {
        t: "mcq", id: "t5d3-sva-chon", title: "Chọn dạng đúng của động từ (8 câu)",
        items: [
          { q: "A number of universities ___ dropped the entrance exam.", options: ["has", "have", "is"], correct: 1, why: "A number of = several ⇒ động từ số nhiều: have." },
          { q: "The data collected over the last decade ___ a clear pattern.", options: ["reveal", "is reveal", "revealing"], correct: 0, why: "Trong văn học thuật data là số nhiều: reveal. (reveals cũng được chấp nhận nhưng không có trong lựa chọn.)" },
          { q: "Not only the students but also the teacher ___ surprised by the result.", options: ["were", "was", "have been"], correct: 1, why: "Theo chủ ngữ gần động từ nhất: the teacher ⇒ was." },
          { q: "Almost a quarter of the water supplied to the city ___ lost through leaks.", options: ["are", "is", "were"], correct: 1, why: "Phân số + of + N: theo N. Water không đếm được ⇒ is." },
          { q: "The unemployed ___ often blamed for circumstances beyond their control.", options: ["is", "are", "has"], correct: 1, why: "The + tính từ chỉ một nhóm người ⇒ số nhiều: are." },
          { q: "What surprised the researchers most ___ the speed of the recovery.", options: ["was", "were", "have been"], correct: 0, why: "Chủ ngữ là mệnh đề What… ⇒ số ít: was." },
          { q: "Among the reasons given ___ a lack of affordable childcare.", options: ["were", "was", "have"], correct: 1, why: "Đảo ngữ: chủ ngữ thật đứng sau — a lack ⇒ was." },
          { q: "She is one of the few economists who ___ predicted the crisis.", options: ["has", "have", "is"], correct: 1, why: "who thay cho economists (số nhiều) ⇒ have. Đây là chỗ cả người bản ngữ cũng sai." },
        ],
      },

      { t: "h", text: "4. Mạo từ — bốn câu hỏi theo thứ tự" },
      { t: "p", text: "Mạo từ là lỗi số một của người Việt ở band 7 vì tiếng Việt không có khái niệm này. Đừng nhớ hàng chục quy tắc rời. Với **mỗi cụm danh từ**, hỏi lần lượt bốn câu sau (ô 1 trong “năm ô của cụm danh từ”, Tập 4 Ngày 1)." },
      {
        t: "sodo", kind: "flow", title: "Bốn câu hỏi chọn mạo từ",
        steps: [
          { label: "① Người đọc biết CÁI NÀO chưa?", sub: "đã nhắc · chỉ có một · có cụm of / mệnh đề phía sau xác định ⇒ **the**" },
          { label: "② Chưa biết + đếm được số ít?", sub: "⇒ bắt buộc **a / an** (hoặc my, this, each…)" },
          { label: "③ Chưa biết + số nhiều / không đếm được?", sub: "⇒ **không mạo từ** khi nói chung cả loại" },
          { label: "④ Có phải cụm cố định?", sub: "at university · in recent years · the environment…" },
        ],
      },
      {
        t: "table", head: ["Lỗi hay gặp", "Sửa", "Vì sao"],
        rows: [
          ["~~The society~~ / ~~the nature~~ / ~~the technology~~ is changing…", "**Society** / **nature** / **technology**", "Khái niệm trừu tượng nói chung ⇒ không mạo từ"],
          ["~~Life in the cities~~ (nói chung)", "**Life in cities** · nhưng **the life of a nurse**", "Có cụm of xác định cái nào ⇒ the"],
          ["~~a research~~, ~~an advice~~, ~~an evidence~~, ~~a progress~~", "**research**, **a piece of advice**, **evidence**, **progress**", "Không đếm được ⇒ không a / an"],
          ["~~in the recent years~~, ~~the most of people~~, ~~in the conclusion~~", "**in recent years**, **most people**, **in conclusion**", "Cụm cố định"],
          ["~~Government should invest in environment.~~", "**The government** should invest in **the environment**.", "Cái duy nhất mọi người đều biết: the government, the environment, the economy, the internet, the media, the public, the past, the future"],
          ["~~go to the university~~ (để học)", "**go to university** · at school · in hospital · in prison · at work", "Nói về chức năng, không phải toà nhà. (Mỹ: in the hospital, go to college)"],
          ["~~Number of cars rose.~~ · ~~Majority of people~~", "**The number of** cars · **The majority of** people", "the + N + of: number, rate, proportion, percentage, amount, level, majority, rest"],
          ["~~He is engineer.~~ · ~~as teacher~~", "He is **an** engineer. · as **a** teacher", "Nghề nghiệp, vai trò: đếm được số ít ⇒ a / an"],
          ["~~the UK and the Vietnam~~", "**the UK**, **the US**, **the Netherlands**, **the Philippines** · **Vietnam**, **Japan**", "the chỉ khi tên có Kingdom / States / Republic hoặc số nhiều"],
          ["~~Same problem exists…~~ · ~~Most important factor~~", "**The same** problem · **The most** important factor · **the only**, **the first**, **the main**", "Từ xác định duy nhất ⇒ the"],
        ],
      },
      {
        t: "examples",
        items: [
          { en: "**A** tax on plastic bags was introduced in 2015. **The** tax cut bag use by half.", vi: "Lần đầu nhắc: a. Lần hai, người đọc đã biết thuế nào: the." },
          { en: "**Children** learn languages faster than **adults**. · **The** children in this study were aged six.", vi: "Trẻ em nói chung: không mạo từ. Trẻ em trong nghiên cứu này: the." },
          { en: "**The** unemployment **of the 1930s** left a lasting mark. · **Unemployment** damages mental health.", vi: "Có cụm of xác định: the. Nói chung: không mạo từ." },
        ],
      },
      {
        t: "note", title: "💡 Mẹo soát mạo từ trong 60 giây",
        items: [
          "Chỉ soát **danh từ đếm được số ít**: nó không được đứng trơ trụi. Thấy “problem”, “solution”, “government”, “role”, “impact” mà không có a / the / this / its ⇒ gần như chắc chắn sai.",
          "Thấy **the** trước danh từ trừu tượng (society, education, technology, crime, poverty, tourism) ⇒ hỏi: “cái nào?” Không trả lời được ⇒ xoá the.",
          "Thấy **of** sau danh từ ⇒ phần lớn cần the ở trước: the cost of living, the role of parents, the spread of misinformation.",
        ],
      },
      { t: "rule", formula: "N đếm được số ít ⇒ luôn có a / an / the · N trừu tượng nói chung ⇒ không mạo từ · N + of … ⇒ the", vi: "Ba kiểm tra này bắt được phần lớn lỗi mạo từ của người Việt ở band 7." },
      {
        t: "quiz", id: "t5d3-mao-tu-dich", kind: "translate", title: "Dịch sang tiếng Anh — mạo từ (5 câu)", grammar: "Bốn câu hỏi chọn mạo từ",
        items: [
          { q: "Công nghệ đã thay đổi cách con người làm việc.", answers: ["Technology has changed the way people work.", "Technology has changed how people work.", "Technology has changed the way that people work."], hint: "technology (nói chung) · the way" },
          { q: "Chính phủ nên đầu tư nhiều hơn vào giao thông công cộng.", answers: ["The government should invest more in public transport.", "Governments should invest more in public transport.", "The government should invest more in public transportation."], hint: "the government · invest in · public transport" },
          { q: "Tỉ lệ thất nghiệp đã giảm trong những năm gần đây.", answers: ["The unemployment rate has fallen in recent years.", "The rate of unemployment has fallen in recent years.", "The unemployment rate has decreased in recent years.", "The unemployment rate has declined in recent years.", "The rate of unemployment has declined in recent years."], hint: "the … rate · in recent years" },
          { q: "Hầu hết mọi người cho rằng giáo dục là giải pháp tốt nhất.", answers: ["Most people believe that education is the best solution.", "Most people think that education is the best solution.", "Most people believe education is the best solution.", "Most people think education is the best solution."], hint: "most people · education · the best" },
          { q: "Cô ấy đã cho tôi một lời khuyên hữu ích về cuộc sống ở đại học.", answers: ["She gave me a useful piece of advice about life at university.", "She gave me some useful advice about life at university.", "She gave me a useful piece of advice about university life.", "She gave me some useful advice about university life."], hint: "a piece of advice / some advice · life at university" },
        ],
      },
      {
        t: "mcq", id: "t5d3-mao-tu-chon", title: "a / an / the / không mạo từ (Ø) — 8 câu",
        items: [
          { q: "___ poverty remains the main cause of poor health in the region.", options: ["The", "A", "Ø (không mạo từ)"], correct: 2, why: "Khái niệm trừu tượng nói chung ⇒ không mạo từ." },
          { q: "___ poverty of the post-war years shaped a whole generation.", options: ["The", "A", "Ø (không mạo từ)"], correct: 0, why: "Có cụm of xác định sự nghèo nào ⇒ the." },
          { q: "The scheme was ___ success, although costs were higher than expected.", options: ["the", "a", "Ø (không mạo từ)"], correct: 1, why: "success ở đây = một việc thành công (đếm được) ⇒ a success." },
          { q: "Most graduates expect to find work within ___ year of leaving university.", options: ["a", "the", "Ø (không mạo từ)"], correct: 0, why: "within a year: một năm bất kỳ, đếm được số ít ⇒ a." },
          { q: "Rising sea levels are a threat to ___ Netherlands and ___ Bangladesh.", options: ["the / the", "the / Ø", "Ø / Ø"], correct: 1, why: "Tên nước số nhiều có the: the Netherlands. Bangladesh không có." },
          { q: "___ internet has made ___ information far easier to find.", options: ["The / the", "Ø / the", "The / Ø"], correct: 2, why: "the internet (duy nhất); information nói chung không mạo từ." },
          { q: "He was sent to ___ prison for three years; his wife went to ___ prison every week to visit him.", options: ["Ø / the", "the / Ø", "a / a"], correct: 0, why: "Đi tù (chức năng): to prison. Đến toà nhà nhà tù để thăm: to the prison." },
          { q: "This is ___ only study that has followed ___ same families for forty years.", options: ["an / a", "the / the", "the / a"], correct: 1, why: "only và same luôn đi với the." },
        ],
      },

      { t: "h", text: "5. Giới từ ① — danh từ kéo theo giới từ nào" },
      { t: "p", text: "Giới từ sau danh từ không suy ra được từ nghĩa tiếng Việt (“ảnh hưởng **đến**” nhưng lại là influence **on**). Phải học **cả cụm**. Bảng dưới gom những danh từ xuất hiện nhiều nhất trong Task 1 và Task 2." },
      {
        t: "table", head: ["Giới từ", "Danh từ đi kèm", "Ví dụ"],
        rows: [
          ["**in**", "increase, rise, growth, fall, decline, drop, change, improvement, investment, interest, difference (ở mặt nào)", "a sharp rise **in** house prices"],
          ["**of** + con số", "an increase / a fall / a rise **of** 10%", "an increase **of** 10% **in** sales (lượng tăng of, thứ tăng in)"],
          ["**for**", "reason, demand, need, responsibility, respect, support, evidence (ủng hộ), case", "the demand **for** skilled workers"],
          ["**to**", "solution, answer, alternative, threat, damage, access, approach, contribution, response, key, obstacle, barrier", "a practical solution **to** congestion"],
          ["**on**", "effect, impact, influence, emphasis, pressure, reliance, dependence, tax, ban, restriction, research (về chủ đề)", "a ban **on** single-use plastics"],
          ["**of**", "cause, lack, risk, cost, awareness, advantage (của việc), evidence (dấu hiệu), source, loss", "the main cause **of** obesity"],
          ["**between**", "difference, link, gap, relationship, correlation, balance, distinction", "the gap **between** rich and poor"],
          ["**over / into / towards**", "control **over**, advantage **over** (so với); research / an investigation / insight **into**; attitude / a shift / a trend **towards**", "an advantage **over** rivals · research **into** ageing"],
        ],
      },
      {
        t: "note", title: "⚠️ Bốn cặp dễ nhầm nhất",
        items: [
          "**rise in** = tăng về (the rise in crime) · **rise of** = sự trỗi dậy của (the rise of social media). Viết ~~the rise of unemployment~~ là sai nghĩa.",
          "**lack of** (danh từ) nhưng động từ **lack** không có giới từ: Many schools **lack** funding. · ~~lack of funding~~ làm vị ngữ là sai.",
          "**access to** (danh từ) nhưng động từ **access** không có giới từ: Users can **access** the data. · have **access to** the data.",
          "**reason for** + N / V-ing · **reason why** + mệnh đề · không viết ~~reason of~~.",
        ],
      },
      { t: "rule", formula: "an increase of 10% in sales · the reason for · a solution to · an effect on · the cause of", vi: "Học danh từ cùng giới từ của nó như MỘT từ. Lượng thay đổi dùng of, thứ thay đổi dùng in." },

      { t: "h", text: "6. Giới từ ② — động từ, tính từ, và những động từ KHÔNG có giới từ" },
      {
        t: "table", head: ["Nhóm", "Đúng", "Lỗi người Việt"],
        rows: [
          ["Động từ **không** giới từ", "discuss · mention · emphasise · stress · lack · access · enter · reach · contact · affect · approach · address · tackle · resemble · consider · join", "~~discuss about~~, ~~emphasise on~~, ~~mention about~~, ~~affect to~~, ~~contact with~~, ~~reach to~~"],
          ["Động từ + **to** (giới từ) + V-ing", "contribute to · lead to · object to · be committed to · look forward to · be / get used to · with a view to · be accustomed to", "~~contribute to reduce~~ → contribute to **reducing**"],
          ["Động từ + **in / on / from / with / for / of**", "result **in** (dẫn đến) · result **from** (do) · invest **in** · participate **in** · depend / rely / focus / concentrate / spend … **on** · benefit / suffer / prevent sb **from** · deal / cope / comply / provide sb **with** · account / apply / pay **for** · consist **of**", "~~depend to~~, ~~consist in~~ (khác nghĩa), ~~benefit to~~, ~~spend money for~~"],
          ["Tính từ + giới từ", "aware / capable / proud / typical / independent **of** · responsible / suitable / eligible **for** · similar / related / exposed / prone / vulnerable / opposed **to** · dependent / keen / based **on** · different **from** · associated / satisfied / concerned (bận tâm) / faced **with** · involved / interested **in** · concerned **about** (lo lắng)", "~~different with~~, ~~responsible of~~, ~~independent from~~ (ít chuẩn), ~~satisfied about~~"],
          ["Thời gian", "**in** 2020 / the 1990s / May · **on** Monday / 5 May / the morning of 5 May · **at** night / the weekend (Mỹ: on the weekend) / the age of 18 · **by** 2030 (trước hoặc đúng) · **over / during** the period · **from** 2000 **to** 2010 · **between** 2000 **and** 2010", "~~in Monday~~, ~~from 2000 and 2010~~, ~~between 2000 to 2010~~, ~~in the age of~~"],
          ["Số liệu Task 1", "rise / fall **by** 5% (lượng) · rise / fall **to** 20% (đích) · stand / peak / remain **at** 20% · **at** a rate of · **per** capita", "~~rise 5%~~ khi muốn nói đích; ~~peak in 20%~~"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba bẫy tinh ở band 7.5",
        items: [
          "**comprise** không có of: The panel **comprises** five experts. · **be composed of** / **consist of** / **be made up of**. Viết ~~comprises of~~ là lỗi rất hay gặp.",
          "**compared with / to** đứng đầu hoặc cuối câu; không viết ~~comparing with~~ khi chủ ngữ không phải người so sánh.",
          "**despite** không có of (despite the cost) · **in spite of** có of · **regardless of**, **irrespective of**, **because of**, **instead of** có of.",
        ],
      },
      { t: "rule", formula: "discuss + O (không about) · contribute to + V-ing · rise by 5% to 20%", vi: "Ba kiểu lỗi giới từ: thừa (discuss about), thiếu V-ing sau to-giới từ, nhầm by / to trong số liệu." },
      {
        t: "quiz", id: "t5d3-gioi-tu-dich", kind: "translate", title: "Dịch sang tiếng Anh — giới từ (5 câu)", grammar: "Danh từ / động từ / tính từ + giới từ cố định",
        items: [
          { q: "Báo cáo nhấn mạnh sự cần thiết của các biện pháp khẩn cấp.", answers: ["The report emphasises the need for urgent measures.", "The report emphasizes the need for urgent measures.", "The report stresses the need for urgent measures.", "The report emphasises the need for urgent action.", "The report stresses the need for urgent action."], hint: "emphasise (không on) · the need for" },
          { q: "Doanh số tăng 5% lên 20 triệu đô la.", answers: ["Sales rose by 5% to $20 million.", "Sales rose by 5% to 20 million dollars.", "Sales increased by 5% to $20 million.", "Sales increased by 5% to 20 million dollars.", "Sales grew by 5% to $20 million.", "Sales rose by 5 per cent to 20 million dollars."], hint: "rise by … to …" },
          { q: "Nhiều trường ở nông thôn thiếu trang thiết bị cơ bản.", answers: ["Many rural schools lack basic equipment.", "Many schools in rural areas lack basic equipment.", "Many schools in the countryside lack basic equipment."], hint: "lack (động từ, không of) · equipment" },
          { q: "Chính sách này có thể góp phần giảm ô nhiễm không khí.", answers: ["This policy could contribute to reducing air pollution.", "This policy may contribute to reducing air pollution.", "This policy can contribute to reducing air pollution.", "This policy could contribute to a reduction in air pollution.", "This policy might contribute to reducing air pollution."], hint: "contribute to + V-ing" },
          { q: "Kết quả của họ khác với kết quả của các nghiên cứu trước đó.", answers: ["Their results are different from those of earlier studies.", "Their results differ from those of earlier studies.", "Their results are different from those of previous studies.", "Their results differ from those of previous studies.", "Their findings differ from those of previous studies.", "Their findings are different from those of earlier studies."], hint: "different from · those of" },
        ],
      },
      {
        t: "quiz", id: "t5d3-gioi-tu-dien", kind: "fill", title: "Điền MỘT giới từ — hoặc gõ dấu “-” nếu không cần giới từ (8 câu)",
        items: [
          { q: "There is growing demand ___ affordable housing in most capital cities.", answers: ["for"] },
          { q: "The new law had little effect ___ smoking rates among teenagers.", answers: ["on"] },
          { q: "Several speakers mentioned ___ the cost of the scheme.", answers: ["-", "ø", "0", "x", "không"] },
          { q: "Flooding resulted ___ the loss of more than a third of the harvest.", answers: ["in"] },
          { q: "Older employees are no less capable ___ learning new software.", answers: ["of"] },
          { q: "The figure peaked ___ 68% in 2015 before falling back.", answers: ["at"] },
          { q: "The board comprises ___ twelve elected members.", answers: ["-", "ø", "0", "x", "không"] },
          { q: "Local residents strongly object ___ having the motorway widened.", answers: ["to"] },
        ],
      },

      { t: "h", text: "7. Sổ lỗi cá nhân — từ lỗi thành “quy tắc của tôi”" },
      { t: "p", text: "Bây giờ làm bước 3–4 của sơ đồ ở mục 1. Mở **Sổ lỗi** của khoá và ba bài viết gần nhất. Mỗi lỗi ghi một dòng theo mẫu bốn cột. Cột thứ tư là cột quan trọng nhất: quy tắc phải **ngắn, cụ thể, bằng lời của bạn** — không chép lại sách." },
      {
        t: "table", head: ["Câu tôi đã viết", "Sửa", "Nhóm", "Quy tắc của tôi (một dòng)"],
        caption: "Mẫu — ba dòng của một người học band 7. Bạn tự lập bảng của mình với ít nhất 6 dòng.",
        rows: [
          ["~~The amount of cars have increased.~~", "The **number** of cars **has** increased.", "Chủ – vị", "The number of… ⇒ has. (Và cars đếm được ⇒ number, không amount.)"],
          ["~~Government should protect the nature.~~", "**The** government should protect **nature**.", "Mạo từ", "Government luôn có the. Nature / society không bao giờ có the."],
          ["~~This will affect to young people.~~", "This will **affect** young people.", "Giới từ", "affect + người luôn. Effect ON — affect không gì cả."],
        ],
      },
      {
        t: "note", title: "💡 Soát ngược ba lượt — 3 phút cuối bài Task 2",
        items: [
          "**Lượt 1 · Động từ chính (60 giây):** đọc từ câu cuối lên câu đầu; ở mỗi động từ chia, chỉ tay vào danh từ chính của nó.",
          "**Lượt 2 · Danh từ đếm được số ít (60 giây):** mỗi danh từ số ít phải có một từ đứng trước ở ô 1; xoá the trước danh từ trừu tượng nói chung.",
          "**Lượt 3 · Giới từ (60 giây):** dừng ở mỗi of / in / on / to / for sau danh từ và động từ; đối chiếu với danh sách lỗi của riêng bạn.",
          "Đọc **ngược** vì khi đọc xuôi, não tự sửa lỗi theo nghĩa và bạn không nhìn thấy chữ thật trên trang.",
          "Khi Nói: không dừng lại sửa giữa câu quá một lần mỗi câu trả lời. Sửa gọn — “the number of visitors have… has gone up” — rồi đi tiếp.",
        ],
      },
      { t: "rule", formula: "Lỗi lặp ≥ 2 lần ⇒ viết quy tắc một dòng ⇒ mỗi lượt soát chỉ tìm một kiểu lỗi", vi: "Band 8 không đến từ biết thêm ngữ pháp, mà từ xoá hết kiểu lỗi lặp lại." },

      { t: "h", text: "8. Luyện tổng hợp — đoạn văn có 12 lỗi đã biết trước số lượng" },
      { t: "p", text: "Đoạn thân bài dưới đây (đề: lợi ích của việc làm thêm với sinh viên) có **đúng 12 lỗi**: 3 lỗi chủ – vị, 5 lỗi mạo từ, 4 lỗi giới từ. Tự tìm trước trong 4 phút bằng ba lượt soát ngược, rồi làm bài điền bên dưới — mỗi câu hỏi trích lại đúng một chỗ sai, theo thứ tự xuất hiện." },
      {
        t: "passage", title: "Đoạn văn cần soát — 12 lỗi",
        paras: [
          { text: "The number of students who take a part-time job during their degree have grown steadily in the recent years, and the reasons of this trend are not hard to find. Rising tuition fees, together with the cost of accommodation, means that many families can no longer cover every expense. Yet paid work offers more than the income. A student who serves customers or manages stock learn to deal with pressure, and employers consistently emphasise on this kind of experience when they recruit. The research carried out in several countries suggests that a moderate workload has little effect to grades. Problems arise only when working hours exceed about fifteen a week: at that point, a lack of sleep begins to affect concentration, and student may fall behind. In short, part-time work contributes to prepare young people for the adult life, provided that it is kept within limits." },
        ],
      },
      {
        t: "quiz", id: "t5d3-np-doan-van", kind: "fill", title: "Gõ lại cụm ĐÚNG cho từng chỗ sai (12 câu)",
        items: [
          { q: "The number of students … ~~have grown~~ steadily", answers: ["has grown"], hint: "Chủ – vị" },
          { q: "in ~~the recent years~~", answers: ["recent years"], hint: "Mạo từ" },
          { q: "the reasons ~~of~~ this trend", answers: ["for"], hint: "Giới từ" },
          { q: "Rising tuition fees, together with the cost of accommodation, ~~means~~ that…", answers: ["mean"], hint: "Chủ – vị: danh từ chính là fees; together with chỉ là chú thích." },
          { q: "paid work offers more than ~~the income~~", answers: ["income", "an income"], hint: "Mạo từ" },
          { q: "A student who serves customers or manages stock ~~learn~~ to deal with pressure", answers: ["learns"], hint: "Chủ – vị" },
          { q: "employers consistently ~~emphasise on~~ this kind of experience", answers: ["emphasise", "emphasize", "stress"], hint: "Giới từ thừa" },
          { q: "~~The research~~ carried out in several countries suggests…", answers: ["Research"], hint: "Mạo từ: nghiên cứu nói chung, chưa xác định." },
          { q: "has little effect ~~to~~ grades", answers: ["on"], hint: "Giới từ" },
          { q: "and ~~student~~ may fall behind", answers: ["the student", "students", "a student"], hint: "Mạo từ: danh từ đếm được số ít đứng trơ trụi." },
          { q: "part-time work contributes to ~~prepare~~ young people", answers: ["preparing"], hint: "Giới từ to + V-ing" },
          { q: "for ~~the adult life~~", answers: ["adult life"], hint: "Mạo từ" },
        ],
      },
      {
        t: "mcq", id: "t5d3-np-tong-hop", title: "Câu nào KHÔNG có lỗi? (8 câu)",
        items: [
          { q: "Chọn câu đúng.", options: ["The majority of the evidence point to a different conclusion.", "The majority of the evidence points to a different conclusion.", "Majority of the evidence points to a different conclusion."], correct: 1, why: "the majority of + N không đếm được (evidence) ⇒ động từ số ít; majority cần the." },
          { q: "Chọn câu đúng.", options: ["Access to the clean water remains a problem in rural areas.", "Access to clean water remain a problem in rural areas.", "Access to clean water remains a problem in rural areas."], correct: 2, why: "clean water nói chung: không the; danh từ chính access ⇒ remains." },
          { q: "Chọn câu đúng.", options: ["The government has invested heavily in renewable energy.", "Government has invested heavily on renewable energy.", "The government have invested heavily to renewable energy."], correct: 0, why: "the government · invest in. (Anh-Anh chấp nhận the government have, nhưng to là sai.)" },
          { q: "Chọn câu đúng.", options: ["There is a number of reasons for this decline.", "There are a number of reasons for this decline.", "There are a number of reasons of this decline."], correct: 1, why: "a number of reasons ⇒ are; reason for." },
          { q: "Chọn câu đúng.", options: ["Each of the three proposals have its own drawbacks.", "Each of the three proposals has their own drawback.", "Each of the three proposals has its own drawbacks."], correct: 2, why: "Each ⇒ has + its." },
          { q: "Chọn câu đúng.", options: ["Compared with their parents, young adults today are less likely to own a home.", "Comparing with their parents, young adults today are less likely to own home.", "Compared to their parents, the young adults today is less likely to own a home."], correct: 0, why: "Compared with; own a home (đếm được số ít cần a); young adults nói chung không the." },
          { q: "Chọn câu đúng.", options: ["The rise of unemployment among graduates has led to call for reform.", "The rise in unemployment among graduates has led to calls for reform.", "The rise in unemployment among graduates have led to calls of reform."], correct: 1, why: "rise in (tăng về); danh từ chính rise ⇒ has; calls for." },
          { q: "Chọn câu đúng.", options: ["Neither of the two studies provide an evidence of a causal link.", "Neither of the two studies provides the evidence for causal link.", "Neither of the two studies provides evidence of a causal link."], correct: 2, why: "Neither of ⇒ số ít (provides); evidence không đếm được; a causal link đếm được số ít." },
        ],
      },
      {
        t: "note", title: "📌 Mang gì sang các bài sau",
        items: [
          "Bài đọc hôm nay: câu hỏi TFNG dài thường xoay quanh chính những chữ nhỏ bạn vừa soát — **the only**, **most**, **the first**.",
          "Ngày 9 (song song, dangling modifiers) và Ngày 17 (chuỗi lỗi 7 → 8) sẽ quay lại bảng lỗi cá nhân của bạn — giữ bảng đó.",
          "Sau mỗi đề (Ngày 8 · 16 · 24): cập nhật Sổ lỗi, đếm lại. Mục tiêu cuối tập: không còn kiểu lỗi nào xuất hiện hai lần trong một bài.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t5d3-doc",
    kind: "reading",
    title: "Đọc: True / False / Not Given band 8 — câu hỏi dài nhiều vế, suy luận một bước",
    goal: "Làm đúng 7–8/8 câu TFNG khi mỗi câu hỏi dài 30–40 từ gồm hai, ba vế, và đáp án phải suy ra từ điều bài viết ngầm khẳng định chứ không nằm sẵn trong một câu.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy band nào",
        items: [
          "Đẩy **Reading từ 30–32 lên 35+/40**: ở band 7 bạn mất điểm chủ yếu ở 2–3 câu TFNG / YNNG cuối mỗi nhóm — những câu dài và phải suy luận.",
          "Kỹ thuật mới: **chẻ câu hỏi thành vế** và kiểm từng vế riêng; một vế trái bài ⇒ FALSE, một vế không có trong bài ⇒ NOT GIVEN.",
          "Phân biệt **suy luận hợp lệ** (bài viết buộc điều đó phải đúng) với **suy diễn** (hợp lý theo hiểu biết của bạn nhưng bài không nói).",
          "Bài đọc ~1.000 từ, lịch sử y học, 8 đoạn A–H, 13 câu trong 20 phút — **đọc một lần** như đã tập ở Ngày 1.",
          "Nối lại: Tập 4 Ngày 5 (TFNG band 7), Tập 3 Ngày 1 (thang paraphrase 4 mức); ngữ pháp bài 1 hôm nay (the only, most, one of) chính là chỗ đặt bẫy.",
        ],
      },

      { t: "h", text: "1. TFNG ở band 8 khó hơn ở đâu?" },
      {
        t: "table", head: ["", "Band 6–7 (Tập 3–4)", "Band 8 (hôm nay)"],
        rows: [
          ["Độ dài câu hỏi", "12–20 từ, một ý", "30–40 từ, hai hoặc ba vế nối bằng and / because / although / which"],
          ["Vị trí thông tin", "Một câu trong bài", "Hai, ba câu — có khi ở hai đoạn liền nhau"],
          ["Kiểu paraphrase", "Từ đồng nghĩa, đổi dạng từ", "Mức 4: cả ý được diễn đạt lại, không chung chữ nào"],
          ["FALSE vì", "Một chữ trái nghĩa lộ", "Một vế **nhỏ** trái bài (thời gian, nguyên nhân, mức độ) trong khi vế chính đúng"],
          ["NOT GIVEN vì", "Chủ đề không được nhắc", "Chủ đề CÓ được nhắc, các vế khác đúng, nhưng **một vế** bài không hề nói"],
          ["Suy luận", "Hiếm", "Thường xuyên: bài nói A và B, câu hỏi nói hệ quả tất yếu của A + B"],
        ],
      },
      { t: "p", text: "Đề thật chỉ ghi “Do the following statements agree with the information given in the passage?”. Chữ **information** quan trọng: bạn đối chiếu với **dữ kiện bài viết đưa ra**, kể cả điều nó ngầm khẳng định — không đối chiếu với kiến thức của bạn." },

      { t: "h", text: "2. Chẻ câu hỏi thành vế — quy trình 5 bước" },
      {
        t: "sodo", kind: "flow", title: "TFNG câu dài — 5 bước",
        steps: [
          { label: "① Chẻ", sub: "gạch chéo ở and / but / because / which / who / although" },
          { label: "② Đánh dấu chữ nhỏ", sub: "only · first · most · all · mainly · before · never" },
          { label: "③ Tìm vế dễ định vị nhất", sub: "tên riêng, năm, thuật ngữ" },
          { label: "④ Kiểm từng vế", sub: "✓ khớp · ✗ trái · ? không có" },
          { label: "⑤ Kết luận", sub: "có ✗ ⇒ FALSE · không ✗, có ? ⇒ NOT GIVEN · toàn ✓ ⇒ TRUE" },
        ],
      },
      { t: "p", text: "Ví dụ (tự soạn). Bài viết: “The bridge, completed in 1932, was designed by a local engineer who had never built anything larger than a footbridge.” Câu hỏi: **The bridge was finished in the early 1930s / by an engineer from the area / who had previously designed several major bridges.** Vế 1 ✓ · vế 2 ✓ · vế 3 ✗ (never built anything larger than a footbridge) ⇒ **FALSE**. Nếu vế 3 là “who was later given a national award” thì bài không nói ⇒ **NOT GIVEN**." },
      {
        t: "table", head: ["Suy luận HỢP LỆ (chọn TRUE / FALSE được)", "Suy diễn (phải chọn NOT GIVEN)"],
        caption: "Phép thử: nếu điều ngược lại xảy ra, bài viết có thành mâu thuẫn không? Có ⇒ suy luận hợp lệ.",
        rows: [
          ["Bài: “By the time help arrived, the fruit had run out.” ⇒ Câu hỏi: the supply of fruit was limited. **TRUE**", "Câu hỏi: the captain had refused to buy more fruit. **NOT GIVEN** — bài không nói vì sao hết"],
          ["Bài: “She could not have known how lucky the choice was.” ⇒ Câu hỏi: she chose it deliberately for this property. **FALSE**", "Câu hỏi: she later regretted the choice. **NOT GIVEN**"],
          ["Bài: “The method was abandoned almost everywhere.” ⇒ Câu hỏi: the method is still in universal use. **FALSE**", "Câu hỏi: the method was abandoned because of its cost. **NOT GIVEN** nếu bài không nêu lý do"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba bẫy band 8 — người Việt hay dính",
        items: [
          "**Vế đầu đúng nên chọn TRUE luôn.** Người ra đề cố ý để vế đầu khớp từng chữ; bẫy nằm ở vế cuối. Luôn đọc hết câu hỏi.",
          "**Nhầm FALSE với NOT GIVEN ở câu có nguyên nhân.** Bài nói “X xảy ra”; câu hỏi nói “X xảy ra **vì** Y”. Nếu bài đưa nguyên nhân KHÁC ⇒ FALSE. Nếu bài không đưa nguyên nhân nào ⇒ NOT GIVEN.",
          "**Dùng kiến thức ngoài.** Bạn biết vitamin C có trong chanh; nhưng nếu bài không nói “người thời đó biết điều này” thì không được chọn TRUE cho câu “they knew…”.",
          "**Chữ so sánh và chữ tuyệt đối:** more / less / the first / the only / all / never — đúng những chữ bạn vừa soát ở bài ngữ pháp. Khoanh chúng trước khi đọc bài.",
        ],
      },
      { t: "rule", formula: "Một vế ✗ ⇒ FALSE · không ✗ nhưng một vế ? ⇒ NOT GIVEN · mọi vế ✓ ⇒ TRUE", vi: "Kiểm từng vế riêng. Vế nhỏ nhất quyết định đáp án." },

      { t: "h", text: "3. Khởi động — bốn đoạn ngắn" },
      { t: "p", text: "Mỗi câu gồm một đoạn 2–3 câu và một nhận định dài. Chẻ nhận định thành vế trước khi chọn." },
      {
        t: "mcq", id: "t5d3-doc-khoi-dong", title: "TRUE, FALSE hay NOT GIVEN? (4 câu)",
        items: [
          { q: "**Text:** The town's first public library opened in 1894 in two rooms above a bakery. It moved to its present building only after a fire destroyed most of the original collection. — **Statement:** The library first opened above a shop in the 1890s and was relocated because the bakery beneath it needed more space.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Vế 2 trái bài: lý do chuyển là hoả hoạn, không phải tiệm bánh cần chỗ ⇒ FALSE. Bài đưa một nguyên nhân KHÁC nên là FALSE, không phải NOT GIVEN." },
          { q: "**Text:** Of the forty volunteers, only those who slept fewer than six hours performed worse on the memory test; the remainder showed no measurable change. — **Statement:** Most of the volunteers who took part in the study were found to have a poorer memory after the experiment than before it.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài không cho biết bao nhiêu người ngủ dưới sáu giờ, nên không biết đó có phải “most” không ⇒ NOT GIVEN. Đây là bẫy chữ nhỏ: most." },
          { q: "**Text:** The dye was so costly that a single robe could absorb a year of a craftsman's wages, and its use was eventually restricted by law to the ruling family. — **Statement:** By the time the law was passed, ordinary craftsmen could not have afforded clothing coloured with the dye.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Suy luận hợp lệ: một chiếc áo tốn cả năm lương của thợ ⇒ thợ bình thường không thể mua. Nếu điều ngược lại đúng thì bài mâu thuẫn ⇒ TRUE." },
          { q: "**Text:** Critics praised the novel's structure but found its characters thin. It nevertheless sold more copies in its first month than the author's three earlier books combined. — **Statement:** The novel was both a commercial success and the first of the author's books to be well received by critics.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Vế 1 ✓ (bán chạy). Vế 2: bài không nói các sách trước được giới phê bình đón nhận thế nào ⇒ không biết có phải “the first” không ⇒ NOT GIVEN." },
        ],
      },

      { t: "h", text: "4. Bài đọc chính — 20 phút, Questions 1–13" },
      { t: "p", text: "Bài đọc soạn riêng cho khoá, khoảng **1.000 từ**, **8 đoạn A–H**, thể loại **lịch sử y học**. Dữ kiện lịch sử trong bài là thật. Đọc tám câu hỏi 1–8 trước (90 giây), khoanh chữ nhỏ, rồi đọc bài **một lần** — câu hỏi đi theo thứ tự bài." },
      {
        t: "passage", title: "The Cure That Was Lost",
        paras: [
          { label: "A", text: "For most of the age of sail, the greatest danger facing a sailor on a long voyage was neither storm nor enemy fire but a disease that began with nothing more alarming than tiredness. Within weeks the gums swelled and bled, old wounds that had healed years before opened again, and the sufferer, if he was not put ashore, died. Scurvy is thought to have killed more seamen than combat during the seventeenth and eighteenth centuries, and its cause — a diet lacking what we now call vitamin C — was entirely unknown. What makes its history remarkable, however, is not how long the remedy took to find. It is that the remedy was found, put into use across an entire navy, and then, within a few generations, effectively lost again." },
          { label: "B", text: "The discovery is usually credited to James Lind, a Scottish surgeon serving aboard the Royal Navy ship Salisbury. In 1747 he took twelve sailors with scurvy, divided them into six pairs and gave each pair a different supplement to the same basic diet: cider, vinegar, sea water, a dilute acid, a paste of garlic and mustard, or two oranges and a lemon a day. The pair given citrus recovered so quickly that one of them was fit for duty within a week, by which time the supply of fruit had in any case run out. The experiment is often described as the first controlled clinical trial. It is less often mentioned that Lind buried the result in a four-hundred-page treatise published six years later, in which citrus appears as one remedy among many, and that the form in which he recommended it — juice boiled down into a concentrate for easy storage — would have destroyed most of the substance that made it work." },
          { label: "C", text: "It therefore took almost half a century, and the persistence of other naval physicians, before the Admiralty acted. From 1795 a daily ration of lemon juice was issued throughout the fleet, and the effect was dramatic: a disease that had filled naval hospitals became, within a few years, something a ship's surgeon might never see. Yet nobody knew why the juice worked. The prevailing explanation was that scurvy was a disease of putrefaction which acids could counteract, and on that reasoning one sour liquid ought to have been as good as another. The cure rested, in other words, on a correct practice supported by a mistaken theory — an arrangement that works perfectly well until circumstances change." },
          { label: "D", text: "They changed in the 1860s. The lemons the navy had relied on came largely from the Mediterranean; for reasons that had more to do with supporting British colonial growers than with medicine, the supply was switched to limes from the Caribbean. The two fruits were regarded as interchangeable — indeed the words “lemon” and “lime” were used loosely for both — and the lime, being the more acidic, was assumed to be if anything the more effective. In fact, it contains considerably less vitamin C, and the methods then used to process and store the juice, which left it exposed to air and in contact with copper pipes, removed much of what little there was. The ration that sailors continued to drink had become almost worthless." },
          { label: "E", text: "That no one noticed is the most instructive part of the story. By the time the substitution was made, steam power had shortened most voyages to well under the two months or so that scurvy needs to develop, and ships were putting into port, and taking on fresh food, far more often. The lime juice was credited with a protection that speed was in fact providing. Only where men were once again cut off from fresh provisions for long periods did the failure show itself, and the place where that happened was the polar ice." },
          { label: "F", text: "When a British Arctic expedition of 1875 was struck by scurvy despite carrying its full allowance of lime juice, the conclusion drawn was not that the juice had been weakened but that citrus had never been a reliable preventive in the first place. Into the gap came a new theory, well suited to an age that had just discovered bacteria: scurvy was a form of poisoning caused by tinned meat that had gone bad. The idea was not absurd. Expeditions that ate freshly killed seal or bear did stay healthy — fresh meat, lightly cooked, contains enough vitamin C to prevent the disease — and this seemed to confirm that the tins were to blame. Explorers at the start of the twentieth century accordingly inspected their tinned food with great care and treated fruit juice as an afterthought, and several expeditions suffered for it." },
          { label: "G", text: "The way out was found by accident. In 1907 two Norwegian researchers, Axel Holst and Theodor Frølich, were investigating a different shipboard disease and wanted a small mammal to experiment on. They chose guinea pigs, and found that animals fed only on grain developed something that looked exactly like scurvy, and that fresh cabbage or lemon juice cured it. They could not have known how fortunate the choice was: almost all mammals manufacture vitamin C in their own bodies, and the guinea pig is one of the very few that, like human beings, cannot. Had they used rats, as most laboratories then did, they would have seen nothing. Their work made it possible to test foods systematically for the first time, and by the early 1930s the protective substance itself had been isolated." },
          { label: "H", text: "It is tempting to read all this as a tale of stupidity, but the people involved were neither careless nor unintelligent; each wrong turn was a reasonable response to the evidence available. The lesson is a more uncomfortable one. A remedy that is adopted without an understanding of why it works can be undone by changes that appear trivial — a different fruit, a new piece of plumbing — and its failure may be hidden for decades by unrelated progress elsewhere. Knowledge of that kind is not so much possessed as borrowed, and it can be called in without warning." },
        ],
      },
      { t: "p", text: "**Questions 1–8.** Do the following statements agree with the information given in the reading passage? Choose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, **NOT GIVEN** if there is no information on this." },
      {
        t: "mcq", id: "t5d3-doc-tfng", title: "Questions 1–8 — TRUE / FALSE / NOT GIVEN",
        items: [
          { q: "1. Lind's experiment showed that the sailors who were given citrus fruit recovered faster than those given any of the other five supplements, and the Admiralty responded by introducing a citrus ration for the whole fleet within a few years of the publication of his findings.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Vế 1 ✓ (đoạn B). Vế 2 ✗: đoạn C “It therefore took **almost half a century** … before the Admiralty acted” — không phải “within a few years” ⇒ FALSE. Bẫy: vế đầu khớp gần như từng chữ." },
          { q: "2. The form of treatment that Lind himself recommended for use at sea would probably have been less effective than the fresh fruit he had given the sailors in his experiment, because of the way in which the juice was to be prepared.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn B: nước ép “boiled down into a concentrate … **would have destroyed most of the substance that made it work**”. Mất phần lớn hoạt chất ⇒ kém hiệu quả hơn trái tươi: suy luận một bước, hợp lệ ⇒ TRUE. Paraphrase mức 4: không chung chữ nào với câu hỏi." },
          { q: "3. When lemon juice was first issued across the navy, it succeeded in preventing scurvy, but those responsible were mistaken about the reason, believing that it was the acidity of the juice that acted against the disease.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn C: hiệu quả “dramatic” ✓; “nobody knew why”; lời giải thích thịnh hành: “a disease of putrefaction which **acids could counteract**”; “a correct practice supported by **a mistaken theory**” ⇒ TRUE." },
          { q: "4. The switch from Mediterranean lemons to Caribbean limes, which was made mainly for non-medical reasons, had the additional effect of lowering the amount that the navy spent on supplying juice to its ships.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Vế 1 ✓ (đoạn D: “more to do with supporting British colonial growers than with medicine”). Vế 2 ?: bài không nói gì về chi phí của hải quân ⇒ NOT GIVEN. Đừng suy diễn “hàng thuộc địa thì rẻ hơn”." },
          { q: "5. The weakness of the lime juice ration went undetected for many years chiefly because faster ships meant that crews were rarely away from fresh food long enough for the disease to appear.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "Đoạn E: “steam power had shortened most voyages to well under the two months … that scurvy needs to develop”, tàu cập cảng lấy thực phẩm tươi thường xuyên hơn; “a protection that **speed** was in fact providing” ⇒ TRUE. “chiefly because” khớp với việc đây là lời giải thích duy nhất bài đưa ra." },
          { q: "6. After scurvy broke out on the Arctic expedition of 1875, it was concluded that the lime juice carried on board had lost its strength, and tinned meat was consequently adopted as a more dependable means of protecting crews.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn F: “the conclusion drawn was **not** that the juice had been weakened” ⇒ vế 1 ✗. Vế 2 cũng ✗: thịt hộp bị coi là NGUYÊN NHÂN (“the tins were to blame”), không phải biện pháp bảo vệ ⇒ FALSE." },
          { q: "7. Although fresh seal and bear meat protected from scurvy the polar expeditions that ate it, most of the men on those expeditions found it less pleasant to eat than the tinned food they had brought with them.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Vế 1 ✓ (đoạn F: “did stay healthy”). Vế 2 ?: bài không nói gì về việc họ thích ăn thứ nào hơn ⇒ NOT GIVEN." },
          { q: "8. Holst and Frølich selected guinea pigs for their experiments because they were aware that these animals, unlike the rats used in most laboratories at the time, are unable to produce vitamin C in their own bodies.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Đoạn G: “The way out was found **by accident**”; “They **could not have known** how fortunate the choice was” ⇒ họ không biết ⇒ trái với “because they were aware” ⇒ FALSE. Phần còn lại của câu hỏi (chuột, không tự tạo vitamin C) đúng — bẫy nằm ở vế nguyên nhân." },
        ],
      },
      { t: "p", text: "**Questions 9–13.** Complete the summary below. Choose **ONE WORD ONLY** from the passage for each answer." },
      { t: "p", text: "**Why the cure was lost.** The navy's lemon juice ration worked, but the accepted theory held that scurvy was a disease of **9** ______ which any acid could treat. When limes were substituted, their juice lost further strength through exposure to air and to pipes made of **10** ______. The failure was concealed by the arrival of **11** ______ power and became obvious only on polar voyages, where the blame fell instead on **12** ______ meat. Progress resumed when two researchers happened to choose an animal that, like humans, cannot make vitamin C; had they chosen **13** ______, they would have observed nothing." },
      {
        t: "quiz", id: "t5d3-doc-tom-tat", kind: "fill", title: "Questions 9–13 — Summary completion (ONE WORD ONLY)",
        items: [
          { q: "9. a disease of ______", answers: ["putrefaction"], hint: "Đoạn C — lời giải thích thịnh hành." },
          { q: "10. pipes made of ______", answers: ["copper"], hint: "Đoạn D." },
          { q: "11. the arrival of ______ power", answers: ["steam"], hint: "Đoạn E." },
          { q: "12. the blame fell on ______ meat", answers: ["tinned"], hint: "Đoạn F." },
          { q: "13. had they chosen ______", answers: ["rats"], hint: "Đoạn G — câu đảo ngữ điều kiện loại 3." },
        ],
      },

      { t: "h", text: "5. Mổ lại — mỗi câu được chẻ thế nào" },
      {
        t: "table", head: ["Câu", "Vế quyết định", "Chữ trong bài", "Kiểu"],
        rows: [
          ["1 · FALSE", "within a few years of the publication", "almost half a century", "Vế thời gian trái bài; vế đầu là mồi"],
          ["2 · TRUE", "less effective … because of the way the juice was prepared", "boiled down … would have destroyed most of the substance", "Suy luận một bước"],
          ["3 · TRUE", "mistaken about the reason … acidity", "acids could counteract · a mistaken theory", "Paraphrase mức 3–4"],
          ["4 · NOT GIVEN", "lowering the amount the navy spent", "(không có)", "Vế thêm vào, hợp lý nhưng bài không nói"],
          ["5 · TRUE", "faster ships … rarely away from fresh food long enough", "steam power had shortened most voyages · speed was in fact providing", "Gộp hai câu của bài"],
          ["6 · FALSE", "concluded that the juice had lost its strength", "the conclusion drawn was not that the juice had been weakened", "Phủ định trong bài"],
          ["7 · NOT GIVEN", "found it less pleasant to eat", "(không có)", "Chủ đề có, chi tiết không"],
          ["8 · FALSE", "because they were aware", "by accident · could not have known", "Vế nguyên nhân trái bài"],
        ],
      },
      {
        t: "note", title: "💡 Ba điều rút ra cho lần sau",
        items: [
          "Sáu trên tám câu được quyết định bởi **vế cuối** hoặc vế nguyên nhân. Không bao giờ chọn đáp án khi chưa đọc hết câu hỏi.",
          "Hai câu NOT GIVEN đều có **vế đầu đúng**. Vế đầu đúng chỉ cho biết bạn đang ở đúng đoạn — không cho biết đáp án.",
          "Câu 13 dùng đảo ngữ điều kiện (**Had they used rats…**, Tập 4 Ngày 7 và Ngày 19). Đọc lướt qua cấu trúc này là bỏ lỡ đáp án.",
        ],
      },

      { t: "h", text: "6. Ngữ pháp bài 1 trong bài đọc" },
      { t: "p", text: "Sáu chỗ dưới đây lấy từ bài đọc. Điền mà không nhìn lại bài — đây là ba nhóm lỗi của bài 1." },
      {
        t: "quiz", id: "t5d3-doc-ngu-phap", kind: "fill", title: "Điền từ còn thiếu hoặc chia động từ trong ngoặc (6 câu)",
        items: [
          { q: "The pair given citrus recovered so quickly that one of them ___ (be) fit for duty within a week.", answers: ["was"], hint: "one of them + số ít" },
          { q: "The cure rested ___ a correct practice supported by a mistaken theory.", answers: ["on"], hint: "rest + giới từ" },
          { q: "The lemons the navy had relied ___ came largely from the Mediterranean.", answers: ["on"], hint: "rely + giới từ" },
          { q: "Fresh meat, lightly cooked, ___ (contain) enough vitamin C to prevent the disease.", answers: ["contains"], hint: "meat không đếm được" },
          { q: "Almost all mammals ___ (manufacture) vitamin C in their own bodies.", answers: ["manufacture"], hint: "all mammals + số nhiều" },
          { q: "From 1795 ___ daily ration of lemon juice was issued throughout ___ fleet. (gõ hai mạo từ, cách nhau bằng dấu /)", answers: ["a / the", "a/the", "a, the", "a the"], hint: "lần đầu nhắc · cái duy nhất đã biết" },
        ],
      },
      { t: "h", text: "7. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "persistence", pos: "n", ipa: "/pəˈsɪstəns/", vi: "sự kiên trì, bền bỉ (không bỏ cuộc)", ex: "It took the persistence of a few local doctors before the council acted.", exVi: "Phải nhờ sự kiên trì của vài bác sĩ địa phương thì hội đồng mới hành động.", more: "persist in + V-ing · persistent (adj) · trong bài: the persistence of other naval physicians (đoạn C)" },
          { w: "prevailing", pos: "adj", ipa: "/prɪˈveɪlɪŋ/", vi: "đang thịnh hành, phổ biến ở một thời điểm", ex: "The prevailing view among economists has shifted.", exVi: "Quan điểm thịnh hành trong giới kinh tế học đã thay đổi.", more: "the prevailing view / explanation / attitude / conditions. Chỉ đứng trước danh từ." },
          { w: "counteract", pos: "v", ipa: "/ˌkaʊntərˈækt/", vi: "làm mất tác dụng, chống lại tác động của", ex: "Regular exercise can counteract the effects of a desk job.", exVi: "Tập thể dục đều có thể hoá giải tác hại của công việc bàn giấy.", more: "counteract the effects / impact / influence of sth. Không có giới từ sau counteract." },
          { w: "absurd", pos: "adj", ipa: "/əbˈsɜːd/", vi: "vô lý, phi lý tới mức buồn cười", ex: "It would be absurd to close the only clinic in the area to save money.", exVi: "Đóng phòng khám duy nhất trong vùng để tiết kiệm tiền thì thật phi lý.", more: "it would be absurd to + V · trong bài: The idea was not absurd (đoạn F) — nhượng bộ trước khi nói vì sao nó vẫn sai" },
          { w: "substitution", pos: "n", ipa: "/ˌsʌbstɪˈtjuːʃn/", vi: "sự thay thế cái này bằng cái khác", ex: "The substitution of machines for human labour is not new.", exVi: "Việc thay sức người bằng máy móc không phải là chuyện mới.", more: "the substitution **of** A (cái mới) **for** B (cái cũ) · động từ: substitute A for B = replace B with A — thứ tự ngược nhau, rất dễ nhầm." },
          { w: "provisions", pos: "n (số nhiều)", ipa: "/prəˈvɪʒnz/", vi: "lương thực dự trữ cho chuyến đi", ex: "The expedition carried provisions for three months.", exVi: "Đoàn thám hiểm mang theo lương thực cho ba tháng.", more: "Số ít **provision** = sự cung cấp (the provision of healthcare) hoặc điều khoản — nghĩa khác hẳn." },
          { w: "afterthought", pos: "n", ipa: "/ˈɑːftəθɔːt/", vi: "điều nghĩ đến sau cùng, thứ bị coi là phụ", ex: "Accessibility was added to the design as an afterthought.", exVi: "Tính dễ tiếp cận được thêm vào thiết kế như một việc phụ nghĩ ra sau.", more: "as an afterthought · treat sth as an afterthought. Hay dùng để phê bình trong Task 2 và Part 3." },
          { w: "instructive", pos: "adj", ipa: "/ɪnˈstrʌktɪv/", vi: "cho ta nhiều bài học, đáng để rút kinh nghiệm", ex: "The failure of the scheme is instructive.", exVi: "Thất bại của chương trình này cho ta nhiều bài học.", more: "an instructive example / comparison · It is instructive to compare… Khác **instructional** (dùng để giảng dạy)." },
          { w: "manufacture", pos: "v", ipa: "/ˌmænjuˈfæktʃə/", vi: "sản xuất hàng loạt; (cơ thể) tạo ra một chất", ex: "The body cannot manufacture this vitamin on its own.", exVi: "Cơ thể không tự tạo ra được loại vitamin này.", more: "Nghĩa sinh học hay gặp trong Passage 3 và Part 4. Nghĩa bóng: manufacture an excuse = bịa ra." },
          { w: "trivial", pos: "adj", ipa: "/ˈtrɪviəl/", vi: "nhỏ nhặt, không đáng kể", ex: "What seems a trivial change can have serious consequences.", exVi: "Một thay đổi tưởng nhỏ nhặt có thể gây hậu quả nghiêm trọng.", more: "a trivial matter / detail · far from trivial (không hề nhỏ) · động từ: trivialise. Mạnh hơn minor, có ý coi thường." },
        ],
      },
      {
        t: "note", title: "📌 Sau bài này",
        items: [
          "Sai câu 1, 6, 8 ⇒ bạn chọn theo vế đầu: tập chẻ câu hỏi bằng bút trên 10 câu TFNG của Đề 7 và Đề 8 (Online Test).",
          "Sai câu 4, 7 ⇒ bạn suy diễn: với mỗi câu NOT GIVEN, viết ra “bài KHÔNG nói: …”.",
          "Sai câu 2, 5 ⇒ bạn chưa tin vào suy luận hợp lệ: làm lại phép thử “nếu ngược lại thì bài có mâu thuẫn không?”.",
          "Ngày 9 học tiếp Yes / No / Not Given band 8 — cùng quy trình, nhưng đối chiếu với **quan điểm** của tác giả.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d3-noi",
    kind: "speaking",
    title: "Nói Part 1 band 8: trả lời tự nhiên ba nhịp, idiom dùng khéo",
    goal: "Trả lời 10–12 câu Part 1 trong 4–5 phút, mỗi câu 2–3 câu nói liền hơi theo ba nhịp (trả lời thẳng → thu hẹp → một chi tiết riêng), dùng 2–3 cụm thành ngữ đúng nguyên dạng, đúng chỗ, và giữ đủ nguyên âm đôi.",
    minutes: 70,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR + FC Speaking từ 7 lên 8**: band 8 là “idiom và từ ít gặp dùng **khéo**, sai rất ít” và “ngắt vì nội dung, không vì ngôn ngữ”.",
          "Part 1 quyết định **ấn tượng đầu** của giám khảo trong 4–5 phút: nghe như đang trò chuyện hay như đang đọc bài thuộc lòng.",
          "Khung **ba nhịp**: trả lời thẳng → thu hẹp hoặc đính chính → một chi tiết chỉ bạn mới có. 15–20 giây, không hơn.",
          "12 cụm thành ngữ đời thường — và **ba luật** để chúng không phản tác dụng.",
          "🔊 Sáu nguyên âm đôi người Việt hay nói thành nguyên âm đơn: /eɪ/ /əʊ/ /aɪ/ /aʊ/ /ɪə/ /eə/.",
          "Nối lại: Tập 3 Ngày 3 (12 khung Part 1), Tập 4 Ngày 2 (ôn khung ở mức band 7); Ngày 2 của tập này (ngắt vì nội dung).",
        ],
      },

      { t: "h", text: "1. Part 1 ở band 7 và band 8 — khác nhau ở đâu?" },
      {
        t: "table", head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["FC — trôi chảy", "Nói dài không gắng sức; đôi lúc ngắt để tìm từ; mở đầu câu nào cũng “Well, to be honest…”", "Ngắt để **nghĩ nội dung**; mở đầu đa dạng hoặc vào thẳng; tự sửa gọn, hiếm"],
          ["LR — từ vựng", "Có idiom, nhưng là idiom “học để thi” và đôi khi sai dạng", "Cụm đời thường đúng nguyên dạng, đúng mức thân mật; từ chính xác cho việc nhỏ (fiddly, hit and miss)"],
          ["GRA — ngữ pháp", "Câu phức đúng, nhưng lặp một kiểu (because… / so…)", "Trộn tự nhiên: used to, would, mệnh đề quan hệ không xác định, điều kiện, so sánh"],
          ["P — phát âm", "Dễ hiểu; nguyên âm đôi hay bị rút ngắn; ngữ điệu phẳng", "Nguyên âm đôi đủ; trọng âm câu rơi vào chữ mang tin mới"],
          ["Ấn tượng chung", "Trả lời đúng và đủ", "**Nghe như một người thật đang nói chuyện**"],
        ],
      },
      {
        t: "note", title: "⚠️ Ba thói quen giữ người Việt ở band 7 trong Part 1",
        items: [
          "**Nói quá dài.** Part 1 không phải Part 2. Bốn, năm câu cho “Do you like walking?” khiến giám khảo phải cắt lời và bạn mất nhịp.",
          "**Mở bằng câu sáo.** “That's an interesting question.” cho câu hỏi “Do you have a bicycle?” nghe rất lạ. Câu hỏi đơn giản thì vào thẳng.",
          "**Chèn idiom to tát.** “It's raining cats and dogs”, “a piece of cake”, “every coin has two sides” — người bản ngữ hầu như không nói; giám khảo nghe là biết học thuộc.",
        ],
      },

      { t: "h", text: "2. Khung ba nhịp — 15 đến 20 giây" },
      {
        t: "sodo", kind: "flow", title: "Ba nhịp của một câu trả lời Part 1 band 8",
        steps: [
          { label: "① Trả lời thẳng", sub: "Yes / Not really / It depends — trong 3 giây đầu" },
          { label: "② Thu hẹp hoặc đính chính", sub: "not as much as I used to · only when… · at least on weekdays" },
          { label: "③ Một chi tiết riêng", sub: "một việc, một nơi, một con số chỉ bạn mới kể được" },
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Not really, to be honest — I + V… , though I do + V…", vi: "Phủ nhận nhẹ rồi đính chính một phần. do + V để nhấn.",
            examples: [
              { en: "Not really, to be honest — I'm not much of a morning person, though I do make an effort on exam days.", vi: "Thật ra là không — tôi không phải kiểu người của buổi sáng, dù ngày thi thì tôi có cố." },
            ],
          },
          {
            formula: "I used to + V…, but these days I tend to + V…", vi: "So xưa – nay trong một hơi: ăn điểm GRA mà vẫn tự nhiên.",
            examples: [
              { en: "I used to read on paper all the time, but these days I tend to listen to audiobooks on the bus instead.", vi: "Trước tôi toàn đọc sách giấy, nhưng dạo này tôi hay nghe sách nói trên xe buýt hơn." },
            ],
          },
          {
            formula: "It depends on + N / whether… . If…, I'll… ; otherwise…", vi: "Chia hai trường hợp — thay cho “it depends” trơ trụi.",
            examples: [
              { en: "It depends on who I'm with. If it's close friends, I'll happily chat for hours; otherwise I'm fairly quiet.", vi: "Còn tuỳ tôi đi với ai. Bạn thân thì tôi nói hàng giờ; còn không thì tôi khá ít nói." },
            ],
          },
          {
            formula: "…, which + V… (nhận xét về cả ý trước)", vi: "Mệnh đề quan hệ bình luận — dấu hiệu rõ của band 8 khi nói.",
            examples: [
              { en: "My flat is right above a café, which sounds lovely until the grinder starts at six.", vi: "Căn hộ của tôi ở ngay trên một quán cà phê, nghe thì thích cho tới khi máy xay chạy lúc sáu giờ." },
            ],
          },
        ],
      },
      { t: "rule", formula: "Trả lời thẳng → thu hẹp → một chi tiết riêng (2–3 câu, 15–20 giây)", vi: "Chi tiết riêng là thứ không ai học thuộc sẵn được — nó làm câu trả lời nghe thật." },

      { t: "h", text: "3. Idiom dùng khéo — ba luật và 12 cụm đời thường" },
      { t: "p", text: "Bảng mô tả band 8 viết “uses less common and idiomatic vocabulary **skilfully**”. “Idiomatic” ở đây không có nghĩa là thành ngữ hình ảnh kiểu sách giáo khoa; nó là **cách nói mà người bản ngữ thật sự dùng**: cụm động từ, cụm cố định, cách nói giảm. Ba luật:" },
      {
        t: "table", head: ["Luật", "Nghĩa là", "Ví dụ sai"],
        rows: [
          ["① Đúng nguyên dạng", "Không đổi mạo từ, số ít – nhiều, giới từ của cụm", "~~in two mind~~ · ~~hit or missed~~ · ~~lose the track of time~~"],
          ["② Đúng chỗ", "Chỉ dùng khi tình huống của bạn khớp nghĩa cụm; cụm thân mật dùng cho chuyện đời thường, không cho Part 3 trừu tượng", "~~Unemployment is not my cup of tea.~~"],
          ["③ Đúng liều", "Tối đa một cụm trong hai, ba câu trả lời; cả Part 1 chỉ cần 2–3 cụm", "Ba idiom trong một câu trả lời 15 giây"],
        ],
      },
      { t: "p", text: "Tập 3 và Tập 4 đã dạy a creature of habit, a night owl, second nature. Mười hai cụm dưới đây là lớp tiếp theo: ít hình ảnh hơn, tần suất dùng thật cao hơn." },
      {
        t: "vocab",
        items: [
          { w: "hit and miss", pos: "adj (cụm)", ipa: "/ˌhɪt ən ˈmɪs/", vi: "lúc được lúc không, thất thường", ex: "The wifi in my dorm is a bit hit and miss.", exVi: "Wifi ở ký túc xá của tôi hơi thất thường.", more: "Cũng nói hit-or-miss. Dùng cho chất lượng, dịch vụ, kết quả — không dùng cho người." },
          { w: "wind down", pos: "phr v", ipa: "/ˌwaɪnd ˈdaʊn/", vi: "thư giãn dần sau khi bận rộn", ex: "I usually wind down with a podcast before bed.", exVi: "Tôi thường thư giãn bằng một tập podcast trước khi ngủ.", more: "wind /waɪnd/ — vần với find, không phải wind /wɪnd/ (gió). wind down **with** sth / **by** V-ing." },
          { w: "grow on (someone)", pos: "phr v", ipa: "/ˈɡrəʊ ɒn/", vi: "càng ngày càng thấy thích (dù lúc đầu không)", ex: "I didn't like the city at first, but it's grown on me.", exVi: "Lúc đầu tôi không thích thành phố này, nhưng dần dần thấy mến.", more: "Chủ ngữ là VẬT / NƠI, không phải người thích: **It** has grown on **me** — không nói ~~I've grown on it~~." },
          { w: "go-to", pos: "adj / n", ipa: "/ˈɡəʊ tuː/", vi: "(thứ, nơi) mình luôn chọn đầu tiên", ex: "There's a noodle place round the corner that's my go-to when I can't be bothered to cook.", exVi: "Gần nhà có một quán mì là lựa chọn quen thuộc của tôi mỗi khi lười nấu.", more: "my go-to snack / place / app. Thân mật — dùng trong Speaking, không dùng trong Writing." },
          { w: "on the go", pos: "cụm", ipa: "/ɒn ðə ˈɡəʊ/", vi: "luôn di chuyển, bận rộn; (ăn, nghe) trong lúc di chuyển", ex: "I'm on the go most of the day, so I tend to eat on the go as well.", exVi: "Tôi chạy đi chạy lại gần như cả ngày nên cũng hay ăn trên đường luôn.", more: "be on the go · eat / listen / work on the go." },
          { w: "can take it or leave it", pos: "cụm", ipa: "/teɪk ɪt ɔː liːv ɪt/", vi: "có cũng được, không có cũng chẳng sao", ex: "Chocolate? I can take it or leave it, to be honest.", exVi: "Sô-cô-la à? Thật lòng thì có cũng được, không cũng chẳng sao.", more: "Cách nói “không thích lắm” lịch sự và tự nhiên hơn I don't like it very much." },
          { w: "not much of a …", pos: "cụm", ipa: "/nɒt mʌtʃ əv ə/", vi: "không phải kiểu người (thích / giỏi) …", ex: "I'm not much of a cook, but I can follow a recipe.", exVi: "Tôi không phải người nấu ăn giỏi, nhưng làm theo công thức thì được.", more: "not much of a reader / swimmer / morning person / sports fan. Sau a là **danh từ số ít**." },
          { w: "hopeless at", pos: "adj + prep", ipa: "/ˈhəʊpləs ət/", vi: "rất kém (một việc) — nói đùa về bản thân", ex: "I'm hopeless at remembering names.", exVi: "Tôi cực kém khoản nhớ tên người.", more: "hopeless at + N / V-ing. Giới từ **at** (như good at, bad at). Tự giễu nhẹ nhàng — rất tự nhiên trong Part 1." },
          { w: "can't be bothered", pos: "cụm", ipa: "/kɑːnt bi ˈbɒðəd/", vi: "lười, không buồn làm", ex: "Some evenings I just can't be bothered to go to the gym.", exVi: "Có những tối tôi đơn giản là lười chẳng buồn đi tập.", more: "can't be bothered **to V** / **with** N. Anh-Anh, thân mật. Không dùng trong Writing." },
          { w: "in two minds (about)", pos: "cụm", ipa: "/ɪn tuː ˈmaɪndz/", vi: "phân vân, chưa quyết", ex: "I'm in two minds about doing a master's straight after my degree.", exVi: "Tôi đang phân vân chuyện học thạc sĩ ngay sau đại học.", more: "Luôn **minds** số nhiều. in two minds about + N / V-ing / whether to V. (Mỹ: of two minds.)" },
          { w: "lose track of time", pos: "cụm", ipa: "/luːz ˌtræk əv ˈtaɪm/", vi: "mải mê quên cả giờ giấc", ex: "Once I start debugging, I completely lose track of time.", exVi: "Một khi đã bắt đầu gỡ lỗi là tôi quên hẳn giờ giấc.", more: "Không có the: ~~lose the track of time~~. Ngược lại: keep track of sth. · ↺ Ôn lại — đã học ở Tập 3 Ngày 30" },
          { w: "a homebody", pos: "n", ipa: "/ˈhəʊmbɒdi/", vi: "người thích ở nhà hơn ra ngoài", ex: "I'm a bit of a homebody, so a quiet weekend suits me fine.", exVi: "Tôi hơi thuộc tuýp thích ở nhà nên cuối tuần yên tĩnh là hợp.", more: "a bit of a + N (a bit of a homebody / perfectionist / night owl): cách nói giảm rất Anh." },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — idiom nên bỏ và idiom dùng có điều kiện",
        items: [
          "**Nên bỏ hẳn:** it's raining cats and dogs · every coin has two sides · a piece of cake (cho mọi thứ) · kill two birds with one stone (lặp lại nhiều lần) · as busy as a bee.",
          "**Dùng được nhưng đã mòn:** once in a blue moon, not my cup of tea, over the moon — mỗi cụm nhiều nhất một lần trong cả bài thi.",
          "**Sai dạng là mất điểm chứ không được điểm.** Không chắc một cụm ⇒ nói thẳng bằng từ thường: “I rarely go” tốt hơn một idiom sai.",
          "Cụm thân mật (can't be bothered, go-to, hopeless at) thuộc về **Speaking**. Đưa vào Task 2 là sai register (Ngày 15).",
        ],
      },
      {
        t: "mcq", id: "t5d3-noi-idiom", title: "Cụm nào đúng dạng và đúng chỗ? (6 câu)",
        items: [
          { q: "“Do you like your neighbourhood?” — “I wasn't keen at first, but ___.”", options: ["I've grown on it", "it's grown on me", "it's grown in me"], correct: 1, why: "Chủ ngữ là nơi chốn: it has grown on me." },
          { q: "“Do you often cook?” — “___, so I mostly stick to pasta.”", options: ["I'm not much of a cook", "I'm not much a cook", "I'm not many of cook"], correct: 0, why: "not much of a + danh từ số ít." },
          { q: "“Are you going to take the job?” — “Honestly, I'm ___ about it.”", options: ["in two mind", "in second minds", "in two minds"], correct: 2, why: "Cụm cố định: in two minds (số nhiều)." },
          { q: "Câu nào hợp nhất cho câu hỏi “Is the bus service good where you live?”", options: ["It's a piece of cake.", "It's a bit hit and miss, especially late at night.", "It's raining cats and dogs."], correct: 1, why: "hit and miss tả chất lượng thất thường của dịch vụ — khớp nghĩa. Hai cụm kia không khớp tình huống." },
          { q: "Cụm nào KHÔNG nên dùng trong bài luận Task 2?", options: ["a growing number of", "can't be bothered to", "by and large"], correct: 1, why: "can't be bothered là thân mật, chỉ dùng khi nói." },
          { q: "“What do you do in the evenings?” — “I usually ___ with a film.”", options: ["wind down", "wind off", "wind out"], correct: 0, why: "wind down = thư giãn dần." },
        ],
      },

      { t: "h", text: "4. Band 7 và band 8 đặt cạnh nhau — cùng bốn câu hỏi" },
      { t: "p", text: "Nghe (hoặc đọc to) bản band 7 trước. Bản này **tốt**: trôi chảy, đúng ngữ pháp. Hãy tự hỏi nó thiếu gì trước khi xem bản band 8." },
      {
        t: "dialogue", title: "Bản band 7 (ước tính) — chủ đề: Being on time · Weekends",
        lines: [
          { who: "Examiner", role: "examiner", text: "Are you usually on time for things?", vi: "Bạn có thường đúng giờ không?" },
          { who: "Candidate", role: "candidate", text: "Yes, I think I am a punctual person. Being on time is very important in modern society because it shows respect for other people. I always try to arrive early, so I am usually on time for my classes and meetings.", vi: "Có, tôi nghĩ tôi là người đúng giờ. Đúng giờ rất quan trọng trong xã hội hiện đại vì nó thể hiện sự tôn trọng người khác. Tôi luôn cố đến sớm nên thường đúng giờ cho lớp học và cuộc họp." },
          { who: "Examiner", role: "examiner", text: "How do you feel when other people are late?", vi: "Bạn cảm thấy thế nào khi người khác đến muộn?" },
          { who: "Candidate", role: "candidate", text: "To be honest, I feel quite annoyed when people are late, because time is money. However, I understand that sometimes there is a traffic jam, so I try to be patient with them.", vi: "Thật lòng thì tôi khá bực khi người ta đến muộn, vì thời gian là tiền bạc. Tuy nhiên tôi hiểu đôi khi có kẹt xe nên tôi cố kiên nhẫn." },
          { who: "Examiner", role: "examiner", text: "What do you usually do at weekends?", vi: "Cuối tuần bạn thường làm gì?" },
          { who: "Candidate", role: "candidate", text: "At weekends I usually hang out with my friends or stay at home to relax. Sometimes I watch movies or play games. It helps me to reduce stress after a busy week.", vi: "Cuối tuần tôi thường đi chơi với bạn hoặc ở nhà nghỉ ngơi. Thỉnh thoảng tôi xem phim hoặc chơi game. Việc đó giúp tôi giảm căng thẳng sau một tuần bận rộn." },
          { who: "Examiner", role: "examiner", text: "Do you prefer to plan your weekends or be spontaneous?", vi: "Bạn thích lên kế hoạch cho cuối tuần hay tuỳ hứng?" },
          { who: "Candidate", role: "candidate", text: "I prefer to plan my weekends, because if I have a plan, I can use my time more effectively. Every coin has two sides, but I think planning is better for me.", vi: "Tôi thích lên kế hoạch, vì có kế hoạch thì tôi dùng thời gian hiệu quả hơn. Đồng xu nào cũng có hai mặt, nhưng tôi nghĩ lên kế hoạch hợp với tôi hơn." },
        ],
      },
      {
        t: "dialogue", title: "Bản band 8 (ước tính) — cùng bốn câu hỏi",
        lines: [
          { who: "Examiner", role: "examiner", text: "Are you usually on time for things?", vi: "Bạn có thường đúng giờ không?" },
          { who: "Candidate", role: "candidate", text: "For anything official, yes — I'm the one who turns up ten minutes early and waits outside. With friends it's a different story, though. They all know that if I say seven, I mean about quarter past.", vi: "Việc gì chính thức thì có — tôi là người đến sớm mười phút rồi đứng chờ bên ngoài. Nhưng với bạn bè thì lại khác. Ai cũng biết tôi nói bảy giờ nghĩa là khoảng bảy giờ mười lăm." },
          { who: "Examiner", role: "examiner", text: "How do you feel when other people are late?", vi: "Bạn cảm thấy thế nào khi người khác đến muộn?" },
          { who: "Candidate", role: "candidate", text: "It doesn't really bother me, as long as they let me know. What I can't stand is sitting in a café for half an hour with no message, wondering whether I've got the wrong day.", vi: "Tôi không phiền lắm, miễn là họ báo một tiếng. Điều tôi không chịu nổi là ngồi quán cà phê nửa tiếng mà không có tin nhắn nào, tự hỏi hay mình nhớ nhầm ngày." },
          { who: "Examiner", role: "examiner", text: "What do you usually do at weekends?", vi: "Cuối tuần bạn thường làm gì?" },
          { who: "Candidate", role: "candidate", text: "I'm a bit of a homebody, so not a great deal. Saturday morning is for laundry and the market, and after that I tend to wind down with whatever series I'm halfway through. If I've seen one friend by Sunday night, that counts as a sociable weekend.", vi: "Tôi hơi thuộc tuýp thích ở nhà nên cũng không làm gì nhiều. Sáng thứ Bảy là giặt đồ và đi chợ, sau đó tôi hay thư giãn với bộ phim nào đang xem dở. Đến tối Chủ nhật mà gặp được một người bạn thì đã tính là một cuối tuần giao du rồi." },
          { who: "Examiner", role: "examiner", text: "Do you prefer to plan your weekends or be spontaneous?", vi: "Bạn thích lên kế hoạch cho cuối tuần hay tuỳ hứng?" },
          { who: "Candidate", role: "candidate", text: "I'm in two minds about that. I like the idea of being spontaneous, but in practice, if nothing's planned, I lose track of time and suddenly it's Sunday evening. So I've started planning one thing and leaving the rest open.", vi: "Chuyện đó tôi còn phân vân. Tôi thích ý tưởng tuỳ hứng, nhưng thực tế nếu không lên kế hoạch gì thì tôi quên cả giờ giấc và chớp mắt đã tối Chủ nhật. Nên tôi bắt đầu chỉ lên kế hoạch một việc và để ngỏ phần còn lại." },
        ],
      },
      {
        t: "table", head: ["Điểm so sánh", "Bản band 7", "Bản band 8"],
        rows: [
          ["Nhịp ① trả lời thẳng", "Có, nhưng bằng câu đủ chủ vị rất “sách”: I think I am a punctual person", "Vào thẳng và đã thu hẹp ngay: For anything official, yes"],
          ["Nhịp ② thu hẹp", "Không có — khẳng định chung cho mọi trường hợp", "With friends it's a different story · as long as they let me know · in practice…"],
          ["Nhịp ③ chi tiết riêng", "Lý do chung chung ai cũng nói được: shows respect, reduce stress", "ten minutes early and waits outside · laundry and the market · wondering whether I've got the wrong day"],
          ["Idiom", "time is money · every coin has two sides — sáo, không khớp tình huống", "a bit of a homebody · wind down · in two minds · lose track of time — đúng dạng, đúng chỗ, bốn cụm cho bốn câu là mức trần"],
          ["Ngữ pháp", "Toàn because / so / however", "What I can't stand is… (cleft) · if I say seven, I mean… · whatever series I'm halfway through · I've started planning"],
          ["Giọng điệu", "Nghiêm túc như trả lời phỏng vấn", "Có chút tự giễu — nghe như người thật"],
        ],
      },
      {
        t: "note", title: "💡 Cách tự nâng một câu trả lời từ 7 lên 8",
        items: [
          "Gạch mọi câu **ai cũng nói được** (it is important, it helps me relax, in modern society). Thay bằng một việc bạn đã làm tuần này.",
          "Thêm **một chữ thu hẹp**: mostly, at least on weekdays, unless I'm with…, not as much as I used to.",
          "Chỉ giữ **một** cụm thành ngữ, và chỉ khi nó khớp đúng điều bạn vừa kể.",
          "Ghi âm, nghe lại: nếu bạn nghe như đang đọc, hãy bỏ câu đầu tiên và bắt đầu từ câu thứ hai.",
        ],
      },

      { t: "h", text: "5. 🔊 Phát âm — sáu nguyên âm đôi phải nói đủ hai nửa" },
      { t: "p", text: "Dấu vết giọng Việt rõ nhất ở band 7 không còn là âm cuối (bạn đã sửa ở Tập 1–3) mà là **nguyên âm đôi bị rút thành nguyên âm đơn**: late nghe như let, go nghe như “gô”, town nghe như “tao” cụt. Nguyên âm đôi = trượt từ âm thứ nhất sang âm thứ hai trong **một** âm tiết; nửa đầu dài và rõ, nửa sau nhẹ." },
      {
        t: "table", head: ["Âm", "Trượt", "Lỗi người Việt", "Cặp để tự kiểm"],
        rows: [
          ["/eɪ/", "e → ɪ", "nói thành /e/ ngắn: late → let, pain → pen", "late – let · wait – wet · pain – pen"],
          ["/əʊ/ (Mỹ /oʊ/)", "ə → ʊ, môi tròn dần", "nói thành “ô” tiếng Việt, môi không chuyển: go, no, phone, don't", "coat – caught · won't – want"],
          ["/aɪ/", "a → ɪ", "thiếu nửa sau trước phụ âm cuối: time → “tam”, like → “lắc”", "time – Tom · like – lock"],
          ["/aʊ/", "a → ʊ", "cụt nửa sau: town → “tan”, down, about", "town – tan · found – fond"],
          ["/ɪə/", "ɪ → ə", "thành “ia” hai âm tiết hoặc /iː/: here, year, idea, nearly", "here – he · beer – bee"],
          ["/eə/", "e → ə", "thành /e/ hoặc “e-ờ” tách rời: where, care, share, rarely", "where – were · fair – fur"],
        ],
      },
      {
        t: "phatam", id: "t5d3-phat-am", title: "Đọc to — mỗi câu dồn một nguyên âm đôi",
        note: "Đọc chậm lần đầu, kéo dài nửa đầu của nguyên âm đôi rồi trượt sang nửa sau. Lần hai đọc tốc độ nói thật. Chú ý âm cuối /t/ /d/ /k/ /n/ ngay sau nguyên âm đôi — đừng nuốt.",
        items: [
          { text: "I stayed late to make the same mistake again.", ipa: "aɪ steɪd leɪt tə meɪk ðə seɪm mɪsteɪk əɡen", vi: "/eɪ/ — Tôi ở lại muộn để rồi lặp lại đúng lỗi cũ." },
          { text: "I don't go home alone, so I phone the others.", ipa: "aɪ dəʊnt ɡəʊ həʊm ələʊn səʊ aɪ fəʊn ði ʌðəz", vi: "/əʊ/ — Tôi không về nhà một mình nên tôi gọi cho mấy người kia." },
          { text: "I like to ride my bike at night.", ipa: "aɪ laɪk tə raɪd maɪ baɪk ət naɪt", vi: "/aɪ/ — Tôi thích đạp xe vào ban đêm." },
          { text: "How about going out around the town?", ipa: "haʊ əbaʊt ɡəʊɪŋ aʊt əraʊnd ðə taʊn", vi: "/aʊ/ — Hay là mình ra ngoài dạo quanh thị trấn?" },
          { text: "It's nearly a year since I was here.", ipa: "ɪts nɪəli ə jɪə sɪns aɪ wəz hɪə", vi: "/ɪə/ — Gần một năm rồi tôi mới lại ở đây." },
          { text: "I rarely care where we share a meal.", ipa: "aɪ reəli keə weə wi ʃeər ə miːl", vi: "/eə/ — Tôi hiếm khi để tâm chuyện mình ăn chung ở đâu." },
          { text: "No way — I couldn't cope with a slow day.", ipa: "nəʊ weɪ aɪ kʊdnt kəʊp wɪð ə sləʊ deɪ", vi: "/əʊ/ + /eɪ/ — Không đời nào — tôi không chịu nổi một ngày chậm chạp." },
          { text: "To be fair, I've no idea why I find it so tiring.", ipa: "tə bi feə aɪv nəʊ aɪdɪə waɪ aɪ faɪnd ɪt səʊ taɪərɪŋ", vi: "Trộn cả sáu âm — Công bằng mà nói, tôi không hiểu sao mình thấy nó mệt đến thế." },
        ],
      },

      { t: "h", text: "6. Đến lượt bạn — hai lượt Part 1" },
      { t: "p", text: "Trước khi ghi âm, làm bài hoàn thành câu để nạp lại khung và cụm. Sau đó trả lời hai lượt, mỗi lượt hai chủ đề như phòng thi thật. **Không viết câu trả lời ra giấy** — chỉ ghi một chi tiết riêng cho mỗi câu hỏi." },
      {
        t: "quiz", id: "t5d3-noi-hoan-thanh", kind: "fill", title: "Hoàn thành câu trả lời — mỗi chỗ MỘT từ (6 câu)",
        items: [
          { q: "“Do you enjoy cooking?” — “Not really. I'm not ___ of a cook, though I do make a decent omelette.”", answers: ["much"] },
          { q: "“Is public transport good in your city?” — “It's a bit hit and ___ — fine in the centre, hopeless in the suburbs.”", answers: ["miss"] },
          { q: "“Do you like spicy food?” — “I can take it or ___ it, to be honest.”", answers: ["leave"] },
          { q: "“Are you good with directions?” — “No, I'm hopeless ___ reading maps; I rely on my phone.”", answers: ["at"] },
          { q: "“Do you read much?” — “I ___ to read a lot as a child, but these days I tend to listen to podcasts instead.”", answers: ["used"] },
          { q: "“Do you like living in a flat?” — “Mostly. It's right above a bakery, ___ means the whole place smells of bread by six.”", answers: ["which"] },
        ],
      },
      {
        t: "speak", id: "t5d3-noi-luot-1", part: "1",
        questions: [
          "Let's talk about being on time. Are you usually on time for things?",
          "How do you feel when other people are late?",
          "Is being punctual seen as important in your country?",
          "Now let's talk about maps and directions. How do you usually find your way to a new place?",
          "Have you ever got lost? What happened?",
          "Do you think people are losing the ability to find their way without a phone?",
        ],
      },
      {
        t: "speak", id: "t5d3-noi-luot-2", part: "1",
        questions: [
          "Let's talk about snacks. What do you usually eat between meals?",
          "Did you eat the same kinds of snacks when you were a child?",
          "Now let's talk about talking to strangers. Do you find it easy to start a conversation with someone you don't know?",
          "In what situations do people in your country chat with strangers?",
          "Do you prefer messaging people or talking face to face?",
          "Is there anything you would never talk about with someone you had just met?",
        ],
      },
      {
        t: "note", title: "Sau khi AI chấm — tự soát năm câu hỏi của band 8",
        items: [
          "Mỗi câu trả lời có **dưới 25 giây** không? Câu nào dài hơn ⇒ cắt nhịp ③ còn một chi tiết.",
          "Có câu nào mở bằng “That's an interesting question” hay “To be honest” lần thứ ba không?",
          "Tôi dùng mấy cụm thành ngữ? Hơn ba trong một lượt ⇒ quá liều. Có cụm nào sai dạng không?",
          "Nghe lại go, no, home, don't, late, time, town: nguyên âm đôi có đủ hai nửa không?",
          "Lỗi chủ – vị, mạo từ, giới từ nào xuất hiện khi nói? Ghi vào Sổ lỗi — lỗi khi nói thường trùng lỗi khi viết.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d3-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 3",
    goal: "Tự kiểm cả ngày: chia đúng động từ với chủ ngữ dài và chủ ngữ bẫy, chọn đúng mạo từ và giới từ, chẻ câu hỏi TFNG nhiều vế, dùng đúng dạng 12 cụm thành ngữ Part 1.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay (40 câu)",
        items: [
          "I–III: ba nhóm lỗi dai dẳng — chủ – vị (8 câu), mạo từ (7 câu), giới từ (8 câu).",
          "IV: dịch 5 câu, mỗi câu chứa ít nhất hai trong ba nhóm lỗi.",
          "V: một đoạn đọc ngắn + 5 câu TRUE / FALSE / NOT GIVEN nhiều vế.",
          "VI: 7 câu hoàn thành câu trả lời Part 1 bằng cụm thành ngữ.",
          "Sai từ 3 câu trở lên trong một phần ⇒ quay lại mục tương ứng; ghi lỗi vào Sổ lỗi theo mẫu bốn cột.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ôn nhanh Ngày 3 trước khi làm bài", center: "Xoá lỗi dai dẳng",
        branches: [
          { label: "Chủ – vị", items: ["tìm danh từ chính", "the number of + has", "a number of + have", "V-ing / What… + số ít"] },
          { label: "Mạo từ", items: ["đếm được số ít ⇒ a / the", "trừu tượng nói chung ⇒ Ø", "N + of ⇒ the"] },
          { label: "Giới từ", items: ["increase in · of 10%", "discuss Ø · lack Ø", "contribute to + V-ing"] },
          { label: "TFNG band 8", items: ["chẻ vế", "một vế ✗ ⇒ FALSE", "một vế ? ⇒ NOT GIVEN"] },
          { label: "Part 1 band 8", items: ["thẳng → thu hẹp → chi tiết", "idiom: đúng dạng, đúng chỗ, đúng liều", "nguyên âm đôi đủ hai nửa"] },
        ],
      },

      { t: "h", text: "I. Chủ – vị (8 câu)" },
      {
        t: "quiz", id: "t5d3-bt-sva", kind: "fill", title: "I. Chia động từ trong ngoặc ở thì hiện tại đơn hoặc hiện tại hoàn thành",
        items: [
          { q: "The number of households with two or more cars ___ (rise — HTHT) every year since 2010.", answers: ["has risen"] },
          { q: "A number of objections ___ (be — HTĐ) raised at every public meeting.", answers: ["are"] },
          { q: "The equipment used in these laboratories ___ (need — HTĐ) replacing.", answers: ["needs"] },
          { q: "Neither the report nor the two follow-up studies ___ (mention — HTĐ) cost.", answers: ["mention"] },
          { q: "Working irregular shifts ___ (be — HTĐ) known to disrupt sleep.", answers: ["is"] },
          { q: "The criteria for admission ___ (change — HTHT) twice in the last decade.", answers: ["have changed"] },
          { q: "Around 70% of the electricity generated here ___ (come — HTĐ) from hydropower.", answers: ["comes"] },
          { q: "Tourism is one of the industries that ___ (suffer — HTHT) most from the downturn.", answers: ["have suffered"] },
        ],
      },

      { t: "h", text: "II. Mạo từ (7 câu)" },
      {
        t: "mcq", id: "t5d3-bt-mao-tu", title: "II. Chọn phương án đúng",
        items: [
          { q: "___ plays a far larger role in children's lives than it did a generation ago.", options: ["The technology", "Technology", "A technology"], correct: 1, why: "Khái niệm trừu tượng nói chung ⇒ không mạo từ." },
          { q: "The council is looking for ___ to the shortage of parking.", options: ["solution", "the solutions", "a solution"], correct: 2, why: "Đếm được số ít, chưa xác định ⇒ a solution (to)." },
          { q: "___ of applicants has fallen for the third year running.", options: ["Number", "The number", "A number"], correct: 1, why: "the number of… + động từ số ít (has)." },
          { q: "She studied law at ___ before joining the firm.", options: ["university", "the university", "an university"], correct: 0, why: "Nói về việc học (chức năng): at university." },
          { q: "___ in the 1950s was very different from today.", options: ["Life", "The life", "A life"], correct: 0, why: "life nói chung + cụm thời gian ⇒ không mạo từ. (The life of a 1950s miner thì có the vì có of.)" },
          { q: "Crime rates are lower in Japan than in ___.", options: ["United States", "the United States", "an United States"], correct: 1, why: "Tên nước có States ⇒ the." },
          { q: "This is ___ that many governments have been reluctant to address.", options: ["issue", "the issues", "an issue"], correct: 2, why: "Đếm được số ít, lần đầu nhắc ⇒ an issue." },
        ],
      },

      { t: "h", text: "III. Giới từ (8 câu)" },
      {
        t: "quiz", id: "t5d3-bt-gioi-tu", kind: "fill", title: "III. Điền MỘT giới từ — hoặc gõ “-” nếu không cần",
        items: [
          { q: "There has been a marked improvement ___ air quality since the ban.", answers: ["in"] },
          { q: "House prices rose ___ 8% last year, the largest increase in a decade.", answers: ["by"] },
          { q: "Nobody has yet found a convincing alternative ___ the private car in rural areas.", answers: ["to"] },
          { q: "The minister stressed ___ the importance of early education.", answers: ["-", "ø", "0", "x", "không"] },
          { q: "Small firms are particularly vulnerable ___ sudden changes in interest rates.", answers: ["to"] },
          { q: "The findings are consistent ___ those of earlier research.", answers: ["with"] },
          { q: "The company is committed to ___ (reduce → gõ dạng đúng của động từ) its emissions by half.", answers: ["reducing"] },
          { q: "Researchers have gained new insight ___ how habits are formed.", answers: ["into"] },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu)" },
      {
        t: "quiz", id: "t5d3-bt-dich", kind: "translate", title: "IV. Dịch — chú ý cả ba nhóm lỗi", grammar: "Danh từ chính + động từ · mạo từ theo bốn câu hỏi · giới từ cố định",
        items: [
          { q: "Số người sống một mình đã tăng đều trong những năm gần đây.", answers: ["The number of people living alone has risen steadily in recent years.", "The number of people who live alone has risen steadily in recent years.", "The number of people living alone has increased steadily in recent years.", "The number of people who live alone has increased steadily in recent years.", "The number of people living alone has grown steadily in recent years."], hint: "the number of · has · in recent years" },
          { q: "Một trong những nguyên nhân chính của vấn đề này là sự thiếu nhà ở giá rẻ.", answers: ["One of the main causes of this problem is the lack of affordable housing.", "One of the main causes of this problem is a lack of affordable housing.", "One of the major causes of this problem is a lack of affordable housing.", "One of the main causes of this problem is the shortage of affordable housing.", "One of the main causes of this problem is a shortage of affordable housing."], hint: "one of the causes of · is · lack of" },
          { q: "Bằng chứng cho thấy thuế này có rất ít tác động lên hành vi của người tiêu dùng.", answers: ["The evidence suggests that this tax has very little effect on consumer behaviour.", "The evidence suggests that the tax has very little effect on consumer behaviour.", "The evidence shows that this tax has very little effect on consumer behaviour.", "The evidence suggests that this tax has very little impact on consumer behaviour.", "The evidence suggests that this tax has very little effect on consumer behavior.", "Evidence suggests that this tax has very little effect on consumer behaviour."], hint: "evidence + suggests · effect on" },
          { q: "Xã hội được lợi khi người trẻ có khả năng tiếp cận giáo dục đại học.", answers: ["Society benefits when young people have access to higher education.", "Society benefits when young people have access to university education."], hint: "society (Ø) · access to" },
          { q: "Hai phần ba ngân sách được chi cho lương.", answers: ["Two thirds of the budget is spent on salaries.", "Two-thirds of the budget is spent on salaries.", "Two thirds of the budget is spent on wages.", "Two-thirds of the budget is spent on wages."], hint: "two thirds of + N số ít · spend on" },
        ],
      },

      { t: "h", text: "V. Đọc — TRUE / FALSE / NOT GIVEN nhiều vế (5 câu)" },
      { t: "p", text: "Thị trấn trong đoạn dưới đây là **hư cấu**. Chẻ mỗi nhận định thành vế trước khi chọn; làm trong 6 phút." },
      {
        t: "passage", title: "Friday Evenings on the High Street",
        paras: [
          { text: "When the council of Aldbury closed its high street to traffic on Friday evenings in 2022, shopkeepers were almost unanimous in predicting disaster. A survey carried out before the trial found that four in five expected their takings to fall. The opposite happened, though not evenly. Cafés and restaurants reported a rise of around a third in Friday revenue during the first year, largely because tables could now be placed on the road. Shops selling furniture and electrical goods, whose customers generally arrive by car, saw no change on Fridays and a small decline on Saturdays, which their owners attributed to shoppers bringing their visits forward to Thursday." },
          { text: "The council, which had promised to abandon the scheme if a majority of traders still opposed it after twelve months, then held a second survey. This time just under half were against. The closure was therefore made permanent, and has since been extended to Saturday evenings — a decision taken, critics point out, without any further consultation." },
        ],
      },
      {
        t: "mcq", id: "t5d3-bt-tfng", title: "V. TRUE, FALSE hay NOT GIVEN?",
        items: [
          { q: "Before the trial began, the great majority of shopkeepers believed that closing the street would reduce their income, and the first year proved them wrong in every type of business.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "Vế 1 ✓ (four in five). Vế 2 ✗: “though not evenly” — cửa hàng nội thất, điện máy không tăng, thứ Bảy còn giảm nhẹ ⇒ FALSE." },
          { q: "The increase in Friday revenue reported by cafés and restaurants was due mainly to the extra seating made possible by the absence of traffic.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“largely because tables could now be placed on the road” = mainly … extra seating ⇒ TRUE." },
          { q: "The owners of furniture and electrical shops believed that some of their customers had started shopping on a different day rather than staying away altogether.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 0, why: "“attributed to shoppers bringing their visits forward to Thursday” ⇒ khách đổi ngày chứ không bỏ hẳn: suy luận hợp lệ ⇒ TRUE." },
          { q: "The second survey showed that most traders had come to support the scheme, which is why the council felt able to make it permanent.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói “just under half were against”. Hơn một nửa còn lại có thể ủng hộ, cũng có thể không có ý kiến — bài không nói “most supported” ⇒ NOT GIVEN. Lý do giữ chương trình là phe phản đối không còn chiếm đa số." },
          { q: "Traders were asked for their views once again before the closure was extended to cover Saturday evenings.", options: ["TRUE", "FALSE", "NOT GIVEN"], correct: 1, why: "“without any further consultation” ⇒ không hỏi lại ⇒ FALSE." },
        ],
      },

      { t: "h", text: "VI. Part 1 — cụm thành ngữ đúng dạng (7 câu)" },
      { t: "p", text: "Điền **một từ** vào mỗi chỗ trống để hoàn thành cụm đã học ở bài 3." },
      {
        t: "quiz", id: "t5d3-bt-idiom", kind: "fill", title: "VI. Hoàn thành câu trả lời",
        items: [
          { q: "I didn't enjoy jazz at first, but it's really grown ___ me over the years.", answers: ["on"] },
          { q: "I'm in two ___ about moving out of my parents' place.", answers: ["minds"] },
          { q: "When I'm coding I completely lose ___ of time.", answers: ["track"] },
          { q: "After a long day I ___ down by cooking something simple.", answers: ["wind"] },
          { q: "I'm always on the ___, so breakfast is usually a banana on the bus.", answers: ["go"] },
          { q: "I know I should iron my shirts, but most days I can't be ___ .", answers: ["bothered"] },
          { q: "I'm a bit of a ___ — I'd rather stay in with a book than go to a party.", answers: ["homebody"] },
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "Phần I ⇒ bài 1 mục 2–3. Phần II ⇒ bài 1 mục 4. Phần III ⇒ bài 1 mục 5–6.",
          "Phần V ⇒ bài 2 mục 2 (chẻ vế) và bảng suy luận hợp lệ.",
          "Phần VI ⇒ bài 3 mục 3; đọc to lại 12 câu ví dụ.",
        ],
      },
    ],
  },
];
