/**
 * IELTS Tập 4 — Ngày 1 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (grammar)   Cụm danh từ phức band 7 + mạo từ & danh từ không đếm được — lỗi số 1 ở band 6.5        [G31, ôn G04 G10]
 *                     — nối Tập 3 Ngày 25 (5 ô của cụm danh từ, danh hoá mức 1) · Tập 3 Ngày 3 (mạo từ vòng 2) · Tập 1 Ngày 5 (đếm / không đếm)
 *   Bài 2 (reading)   Passage 3 nhập môn: văn bản lập luận nhân văn – khoa học xã hội, bản đồ lập luận, 900 từ / 17–20 phút;
 *                     bài đọc ~900 từ “The Myth of the Lone Genius”, 13 câu (YES/NO/NOT GIVEN · MCQ · Summary có hộp từ) [R20 R21]
 *                     — nối Tập 3 Ngày 1 (skim bố cục, paraphrase 4 mức) · Tập 3 Ngày 23 (YNNG)
 *   Bài 3 (listening) Part 1 “quá dễ để sai”: chính tả, số nhiều, sửa lời, 10/10 + 2 phút kiểm                  [L03 L16]
 *                     — nối Tập 3 Ngày 1 (Part 1 giọng trộn, sáu dòng soát) · 🔊 nhịp (rhythm) của câu dài
 *   Bài tập Ngày 1    43 câu có đáp án
 * Đầu tập: nhắc làm Đề 6 ở Online Test để đo điểm xuất phát. Mọi id bắt đầu `t4d1-`.
 */
import type { Lesson } from '../data';

export const NGAY_1: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — NGỮ PHÁP ═══════════════════════════ */
  {
    id: "t4d1-ngu-phap",
    kind: "grammar",
    title: "Ngữ pháp: Cụm danh từ phức band 7 — mạo từ và danh từ không đếm được, lỗi số 1 ở band 6.5",
    goal: "Dựng được cụm danh từ dài, đúng trật tự (a government-funded study of sleep patterns among teenagers), chọn đúng a / an / the / Ø cho từng cụm, không còn thêm -s vào research, evidence, advice… — để phần lớn câu trong bài Viết và Nói không còn lỗi (GRA band 7).",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Trước khi học Ngày 1:** vào **Online Test → Đề 6** làm đủ 4 kỹ năng để biết ==điểm xuất phát== của bạn. Ghi lại 4 con số (Listening, Reading, Writing, Speaking) — giữa tập làm Đề 7, cuối tập làm Đề 8 để so.",
          "**Cụm danh từ** (noun phrase) = một danh từ chính + mọi thứ bám quanh nó. Tập 3 Ngày 25 đã học 5 ô của cụm. Hôm nay nâng lên band 7: ==tính từ ghép có gạch nối== (a well-documented decline), chuỗi bổ nghĩa sau (the claim that…, the practice of + V-ing), và chia động từ đúng khi chủ ngữ dài.",
          "**Mạo từ** (article: a / an / the / không mạo từ Ø): mỗi cụm danh từ là một lần phải chọn. Bài luận 280 từ có khoảng 60 cụm danh từ ⇒ 60 lần có thể sai. Đây là loại lỗi nhiều nhất của người Việt ở band 6.5.",
          "**Danh từ không đếm được** trong văn học thuật: research, evidence, information, advice, knowledge, progress, equipment, legislation, infrastructure… ==không có -s, không có a / an==.",
          "Luật mới quan trọng nhất: phần bổ nghĩa SAU danh từ thường quyết định mạo từ — **the** rise **of online shopping** nhưng **a** rise **of 5 %**; Ø economic growth nhưng **the** economic growth **of the 1990s**.",
          "Tiêu chí được đẩy: **GRA** (Writing + Speaking — “phần lớn câu không lỗi” là mốc band 7) và **LR** (cụm danh từ chính xác, đúng văn phong học thuật).",
        ],
      },
      {
        t: "note",
        title: "📌 Việc đầu tiên của Tập 4: làm Đề 6 ở Online Test",
        items: [
          "Mở **Online Test** (thi trên máy tính) → chọn **Đề 6**. Đề này đủ Listening · Reading · Writing · Speaking, độ khó trải từ band 6 tới 7.5.",
          "Làm ==một mạch, đúng giờ==, không tra từ. Bạn chưa học Tập 4 nên điểm thấp là bình thường — đây là số đo, không phải bài thi.",
          "Ghi vào sổ: điểm thô Listening /40, Reading /40 (riêng Passage 3: bao nhiêu /13 hoặc /14?), band ước tính Writing và Speaking. Mục tiêu cuối tập: Listening ≥ 30, Reading ≥ 30 (Passage 3 ≥ 9), Writing 7.0, Speaking 7.0.",
          "Câu sai tự vào **Sổ lỗi**. Bài Đọc hôm nay sẽ dùng lại kết quả Passage 3 của bạn; bài Nghe hôm nay dùng lại kết quả Part 1.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn 5 phút: Tập 3 Ngày 25 (cụm danh từ), Tập 3 Ngày 3 (mạo từ), Tập 1 Ngày 5 (đếm / không đếm)" },
      {
        t: "table",
        head: ["Ô", "Tên", "Ví dụ", "Ghi chú"],
        rows: [
          ["1", "Từ hạn định (determiner)", "**the** / a / this / many / several", "Mạo từ nằm ở ô này"],
          ["2", "Tính từ (và trạng từ đứng trước nó)", "**rapidly growing** / significant", "Ý kiến → kích cỡ → tuổi → màu → nguồn gốc → chất liệu"],
          ["3", "Danh từ làm tính từ", "**tourism** industry / **government** policy", "Luôn số ít: a **car** factory (~~cars factory~~)"],
          ["4", "==Danh từ chính== (head noun)", "**industry**", "Động từ chia theo từ này"],
          ["5", "Phần bổ nghĩa sau", "**in South-East Asia** / that employs millions", "Giới từ + N · mệnh đề quan hệ · V-ing / V3 · to V"],
        ],
        caption: "Năm ô của cụm danh từ (Tập 3 Ngày 25): the rapidly growing tourism industry in South-East Asia. Tìm ô 4 trước, rồi mới nhìn ô 1.",
      },
      {
        t: "table",
        head: ["Câu hỏi", "Nếu CÓ", "Nếu KHÔNG"],
        rows: [
          ["① Người đọc có biết chính xác **cái nào** không? (đã nhắc, chỉ có một, hoặc phần sau nói rõ)", "**the**", "sang câu ②"],
          ["② Danh từ có **đếm được và số ít** không?", "**a / an**", "sang câu ③"],
          ["③ Số nhiều hoặc không đếm được, nói **chung**", "**Ø** (không mạo từ)", "—"],
        ],
        caption: "Ba câu hỏi chọn mạo từ (Tập 2 Ngày 1, Tập 3 Ngày 3). Cả bài hôm nay chỉ là áp ba câu này vào cụm danh từ DÀI.",
      },
      {
        t: "mcq",
        id: "t4d1-on-dau-bai",
        title: "Kiểm tra đầu bài — bạn còn mắc lỗi nào? (6 câu)",
        items: [
          { q: "___ have shown that sleep affects memory.", options: ["Many researches", "A research", "Several studies", "Much studies"], correct: 2, why: "research không đếm được ⇒ không có researches / a research. Muốn đếm thì dùng study: several studies." },
          { q: "___ plays an important role in reducing poverty.", options: ["Education", "The education", "An education", "Educations"], correct: 0, why: "Nói chung về giáo dục (danh từ trừu tượng, không đếm được) ⇒ Ø Education." },
          { q: "___ of social media has changed the way people communicate.", options: ["Rise", "A rise", "Rises", "The rise"], correct: 3, why: "Phần sau “of social media” cho biết chính xác sự trỗi dậy nào ⇒ the rise of…" },
          { q: "The number of students who study abroad ___ every year.", options: ["are increasing", "increases", "increase", "have increased"], correct: 1, why: "Danh từ chính là number (số ít) ⇒ increases. students nằm trong phần bổ nghĩa sau." },
          { q: "She gave me ___ about my essay.", options: ["some useful advice", "an useful advice", "some useful advices", "a useful advice"], correct: 0, why: "advice không đếm được ⇒ some advice / a piece of advice." },
          { q: "___ in my country prefer to live in big cities.", options: ["The most young people", "Most of young people", "Most the young people", "Most young people"], correct: 3, why: "Nói chung ⇒ Most + N số nhiều (không the, không of). Most of the young people in my class = một nhóm cụ thể." },
        ],
      },
      { t: "rule", formula: "Từ hạn định + (adv) adj + N làm tính từ + N chính + phần bổ nghĩa sau", vi: "Tìm danh từ chính trước; mạo từ và động từ đều phụ thuộc vào nó." },

      /* ── 2 ── */
      { t: "h", text: "2. Vì sao đây là “lỗi số 1 ở band 6.5”" },
      {
        t: "p",
        text: "Ở band 6, giám khảo chấp nhận “có lỗi nhưng hiếm khi làm sai nghĩa”. Ở band 7, mô tả đổi thành ==“phần lớn câu không lỗi”== (frequent error-free sentences). Lỗi mạo từ và lỗi -s hầu như không làm sai nghĩa, nên người học bỏ qua. Nhưng chúng làm **câu có lỗi**. Một câu dài 25 từ, ý hay, cấu trúc phức — chỉ cần thiếu một chữ **the** là giám khảo không tính là câu sạch.",
      },
      {
        t: "table",
        head: ["Tiêu chí GRA", "Band 6", "Band 7"],
        rows: [
          ["Loại câu", "Trộn câu đơn và câu phức", "==Đa dạng== câu phức"],
          ["Độ chính xác", "Có lỗi, hiếm khi cản hiểu", "**Phần lớn câu không lỗi**; còn vài lỗi lặt vặt"],
          ["Mạo từ, số nhiều", "Sai 8–12 chỗ / bài 280 từ", "Sai 0–3 chỗ / bài"],
          ["Cụm danh từ", "Ngắn: many people, big problem", "Dài và chính xác: a growing shortage of affordable housing"],
        ],
        caption: "Số lỗi là ước lượng từ bài viết của người học Việt Nam — dùng để tự đo, không phải quy định của IELTS.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Mỗi cụm danh từ — soát 4 bước trong 3 giây",
        steps: [
          { label: "1. Danh từ chính là từ nào?", sub: "the **impact** of tourism on local traditions" },
          { label: "2. Đếm được không? Số ít hay nhiều?", sub: "impact: đếm được, số ít ⇒ phải có từ hạn định" },
          { label: "3. Người đọc biết “cái nào” chưa?", sub: "có “of tourism…” nói rõ ⇒ **the**" },
          { label: "4. Động từ chia theo danh từ chính", sub: "The impact … **is** (không phải are)" },
        ],
        caption: "Lượt 2 (DANH TỪ) trong 6 lượt tự soát bài viết (Tập 3 Ngày 27) — từ hôm nay làm cho thật kỹ.",
      },
      {
        t: "note",
        title: "💡 Mẹo đo lỗi của chính bạn",
        items: [
          "Mở bài Writing Task 2 bạn vừa viết ở Đề 6. Gạch chân ==mọi danh từ chính==. Với mỗi từ, hỏi 4 bước ở sơ đồ trên.",
          "Đếm số chỗ sai. Hơn 5 chỗ ⇒ đây là việc số một của bạn trong 6 ngày tới. Ghi mã lỗi **A** (mạo từ) và **S** (số ít / số nhiều) vào Sổ lỗi như Tập 3 Ngày 2 đã dạy.",
          "Khi nói (Speaking), đừng dừng lại để nghĩ mạo từ. Hãy học thuộc cả cụm: **play an important role**, **have a negative effect on**, **the vast majority of** — cụm đúng thì mạo từ đúng theo.",
        ],
      },
      { t: "rule", formula: "N đếm được số ít KHÔNG BAO GIỜ đứng trần: phải có a / an / the / this / my…", vi: "~~It has positive effect~~ → It has a positive effect. Đây là lỗi thiếu mạo từ hay gặp nhất." },

      /* ── 3 ── */
      { t: "h", text: "3. Bổ nghĩa TRƯỚC danh từ ở band 7: trạng từ + tính từ, tính từ ghép, danh từ làm tính từ" },
      {
        t: "p",
        text: "Band 6 viết “a big increase”. Band 7 nén thêm thông tin vào trước danh từ mà câu vẫn gọn. Ba công cụ: ① **trạng từ + tính từ** (a ==relatively small== increase); ② **tính từ ghép** (compound adjective) — hai, ba từ nối bằng gạch ngang, đứng trước danh từ như một tính từ (a ==long-term== solution); ③ **danh từ làm tính từ** (==energy== consumption).",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "a / an / the + adv + adj + N",
            vi: "Trạng từ chỉ mức độ làm tính từ chính xác hơn — rất hợp Task 1.",
            examples: [
              { en: "There was a relatively modest rise in rail travel.", vi: "Có một mức tăng tương đối khiêm tốn ở việc đi lại bằng tàu." },
              { en: "This is an increasingly common problem in large cities.", vi: "Đây là một vấn đề ngày càng phổ biến ở các thành phố lớn." },
              { en: "Unemployment is a highly complex issue.", vi: "Thất nghiệp là một vấn đề hết sức phức tạp." },
            ],
          },
          {
            formula: "a / an / the + adv-V3 / N-V3 / N-V-ing + N",
            vi: "Tính từ ghép có phân từ: nén cả một mệnh đề quan hệ vào trước danh từ.",
            examples: [
              { en: "a well-paid job (= a job that is paid well)", vi: "một công việc lương cao" },
              { en: "a government-funded scheme (= a scheme that is funded by the government)", vi: "một chương trình do nhà nước tài trợ" },
              { en: "a time-consuming process · labour-saving devices · a fast-growing economy", vi: "một quy trình tốn thời gian · thiết bị tiết kiệm sức lao động · một nền kinh tế tăng trưởng nhanh" },
            ],
          },
          {
            formula: "a / an / the + số-N (số ít) + N",
            vi: "Tính từ ghép có số: danh từ đo lường LUÔN số ít, có gạch nối.",
            examples: [
              { en: "a three-year study · a ten-minute walk · a 20-storey building", vi: "một nghiên cứu ba năm · mười phút đi bộ · một toà nhà 20 tầng" },
              { en: "a five-fold increase · a two-thirds majority", vi: "mức tăng gấp năm · đa số hai phần ba" },
            ],
          },
          {
            formula: "N + N (+ N)",
            vi: "Danh từ làm tính từ: danh từ đứng trước ở số ít. Tối đa 3 danh từ liền nhau.",
            examples: [
              { en: "energy consumption · crime rates · a job interview · health care costs", vi: "mức tiêu thụ năng lượng · tỉ lệ tội phạm · một buổi phỏng vấn xin việc · chi phí chăm sóc sức khoẻ" },
              { en: "the government's climate change policy", vi: "chính sách về biến đổi khí hậu của chính phủ" },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Band 6 (mệnh đề dài)", "Band 7 (nén vào trước danh từ)"],
        rows: [
          ["a plan which will last for five years", "a **five-year** plan"],
          ["countries whose incomes are low", "**low-income** countries"],
          ["a decline that has been documented well", "a **well-documented** decline"],
          ["problems which are related to health", "**health-related** problems"],
          ["food which is produced locally", "**locally produced** food (trạng từ -ly: KHÔNG gạch nối)"],
          ["a method which is effective in terms of cost", "a **cost-effective** method"],
          ["children who are five years old", "**five-year-old** children"],
        ],
        caption: "Nén được thì câu ngắn lại mà thông tin giữ nguyên — đúng kiểu văn học thuật. Nhưng đừng nén quá 3 từ trước một danh từ.",
      },
      {
        t: "note",
        title: "⚠️ Năm lỗi người Việt hay sai với phần đứng trước",
        items: [
          "Thêm -s vào danh từ đo lường: ~~a three-years study~~ → a **three-year** study; ~~a ten-minutes walk~~ → a **ten-minute** walk. (Không có danh từ theo sau thì có -s: The study lasted three **years**.)",
          "Thêm -s vào danh từ làm tính từ: ~~cars factory~~, ~~students loans~~ → **car** factory, **student** loans. Ngoại lệ hay gặp: a **sports** centre, a **sales** manager, the **arts** sector, a **savings** account.",
          "Gạch nối sau trạng từ -ly: ~~a highly-paid job~~ → a **highly paid** job; ~~a rapidly-growing city~~ → a **rapidly growing** city. Nhưng **well-** thì có: a **well-known** writer.",
          "Tính từ ghép đứng SAU động từ be thì bỏ gạch nối: a **well-known** writer nhưng The writer is **well known**; a **long-term** plan nhưng in the **long term**.",
          "Chuỗi danh từ quá dài, khó hiểu: ~~the government youth unemployment reduction programme~~ → the government's **programme to reduce youth unemployment** (chuyển bớt ra phía sau).",
        ],
      },
      { t: "rule", formula: "a / an / the + (adv) + adj ghép (số-N số ít · N-V3 · N-V-ing) + N", vi: "Tính từ ghép đứng trước danh từ có gạch nối; danh từ bên trong luôn số ít: a three-year study." },
      {
        t: "quiz",
        id: "t4d1-truoc-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng tính từ ghép đứng trước danh từ (5 câu)",
        grammar: "a / an / the + tính từ ghép + N",
        items: [
          { q: "Chính phủ đã công bố một kế hoạch mười năm để cải thiện giao thông công cộng.", answers: ["The government has announced a ten-year plan to improve public transport.", "The government announced a ten-year plan to improve public transport.", "The government has announced a 10-year plan to improve public transport.", "The government announced a 10-year plan to improve public transport."], hint: "a ten-year plan · public transport (không the)" },
          { q: "Các gia đình thu nhập thấp chi phần lớn tiền của họ cho thực phẩm.", answers: ["Low-income families spend most of their money on food.", "Low-income households spend most of their money on food."], hint: "low-income families · most of their money · spend … on" },
          { q: "Làm việc ở nhà là một xu hướng ngày càng phổ biến.", answers: ["Working from home is an increasingly common trend.", "Working at home is an increasingly common trend.", "Working from home is an increasingly popular trend.", "Remote working is an increasingly common trend."], hint: "an increasingly common trend" },
          { q: "Đây là một giải pháp dài hạn cho một vấn đề hết sức phức tạp.", answers: ["This is a long-term solution to a highly complex problem.", "This is a long-term solution to a highly complex issue.", "This is a long-term solution to an extremely complex problem."], hint: "a long-term solution to · a highly complex problem" },
          { q: "Thực phẩm sản xuất tại địa phương thường tươi hơn thực phẩm nhập khẩu.", answers: ["Locally produced food is usually fresher than imported food.", "Locally produced food is often fresher than imported food.", "Locally produced food is generally fresher than imported food."], hint: "locally produced food (không gạch nối, không the)" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bổ nghĩa SAU danh từ ở band 7: sáu kiểu — và chia động từ theo danh từ chính" },
      {
        t: "p",
        text: "Tập 3 Ngày 25 dạy năm kiểu bổ nghĩa sau. Band 7 thêm kiểu thứ sáu rất “học thuật”: ==danh từ + that + mệnh đề== để nói rõ **nội dung** của danh từ (the idea **that**…, the fact **that**…, the claim **that**…). Mệnh đề này gọi là mệnh đề đồng vị (appositive clause): nó không tả danh từ mà chính LÀ nội dung của danh từ, nên không thay that bằng which.",
      },
      {
        t: "table",
        head: ["Kiểu", "Khuôn", "Ví dụ"],
        rows: [
          ["① Giới từ + N", "N + of / in / for / among / between…", "a decline **in birth rates** · competition **among local firms**"],
          ["② Mệnh đề quan hệ", "N + who / which / that + V", "policies **that encourage recycling**"],
          ["③ Rút gọn chủ động", "N + V-ing", "people **living in rural areas** (= who live)"],
          ["④ Rút gọn bị động", "N + V3", "the data **collected over ten years** (= which were collected)"],
          ["⑤ to V", "N + to V", "the ability **to adapt** · an attempt **to cut costs** · the best way **to learn**"],
          ["⑥ Nội dung của danh từ ★", "N + that + S + V · N + of + V-ing", "the belief **that money brings happiness** · the practice **of working from home**"],
        ],
        caption: "Kiểu ⑥ đi với danh từ chỉ ý nghĩ / lời nói: idea, belief, view, claim, argument, fact, evidence, assumption, possibility, risk, concern.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "the + N (idea / belief / claim / fact / view) + that + S + V",
            vi: "Nói rõ nội dung của ý kiến / sự thật. Luôn the, luôn that (không which).",
            examples: [
              { en: "The idea that technology isolates people is too simple.", vi: "Ý cho rằng công nghệ làm con người cô lập là quá đơn giản." },
              { en: "There is little evidence that longer prison sentences reduce crime.", vi: "Có rất ít bằng chứng cho thấy án tù dài hơn làm giảm tội phạm." },
              { en: "I disagree with the view that university should be free for everyone.", vi: "Tôi không đồng ý với quan điểm rằng đại học nên miễn phí cho mọi người." },
            ],
          },
          {
            formula: "the + N (practice / habit / cost / risk / process / idea) + of + V-ing",
            vi: "Danh từ + of + V-ing: tên một việc làm.",
            examples: [
              { en: "The cost of raising a child has doubled in twenty years.", vi: "Chi phí nuôi một đứa trẻ đã tăng gấp đôi trong hai mươi năm." },
              { en: "The practice of sending elderly relatives to care homes is still rare in Vietnam.", vi: "Việc gửi người thân lớn tuổi vào viện dưỡng lão vẫn còn hiếm ở Việt Nam." },
            ],
          },
          {
            formula: "N chính + [phần bổ nghĩa sau] + V (chia theo N chính)",
            vi: "Chủ ngữ dài: bỏ phần trong ngoặc vuông ra rồi mới chia động từ.",
            examples: [
              { en: "The number [of people working from home] has risen sharply.", vi: "Số người làm việc ở nhà đã tăng mạnh." },
              { en: "The measures [introduced by the council last year] have had little effect.", vi: "Các biện pháp hội đồng thành phố đưa ra năm ngoái hầu như không có tác dụng." },
              { en: "One [of the main reasons for this trend] is the high cost of housing.", vi: "Một trong những lý do chính của xu hướng này là giá nhà cao." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Chủ ngữ", "Động từ", "Ví dụ"],
        rows: [
          ["**The number of** + N số nhiều", "số ÍT", "The number of cars **has** doubled."],
          ["**A number of** + N số nhiều (= một số)", "số NHIỀU", "A number of studies **have** shown this."],
          ["**One of the** + N số nhiều", "số ÍT", "One of the causes **is** poor diet."],
          ["**The majority of / Most of the** + N số nhiều", "số NHIỀU", "The majority of residents **support** the plan."],
          ["**The proportion / percentage / level / amount of** + N", "số ÍT", "The proportion of women in parliament **remains** low."],
          ["**A range / variety / series of** + N số nhiều", "thường số ÍT trong văn viết", "A range of measures **has** been proposed. (have cũng gặp)"],
          ["N không đếm được + bổ nghĩa số nhiều", "số ÍT", "Research into sleep disorders **shows** that…"],
          ["**Each / Every** + N số ít · **Each of the** + N số nhiều", "số ÍT", "Each of these factors **plays** a part."],
        ],
        caption: "Chủ ngữ dài trong Task 1 và Task 2 — bảng này phủ hầu hết các trường hợp bạn sẽ viết.",
      },
      {
        t: "note",
        title: "⚠️ Hay sai: động từ chạy theo danh từ đứng gần",
        items: [
          "~~The quality of public services in rural areas are poor~~ → **is** poor (danh từ chính: quality).",
          "~~The fact that many young people cannot find jobs show…~~ → **shows** (danh từ chính: fact).",
          "~~Research into the effects of video games have found…~~ → **has** found (research không đếm được ⇒ số ít).",
          "Nhầm that với which ở kiểu ⑥: ~~the idea which money brings happiness~~ → the idea **that** money brings happiness.",
          "Hai giới từ chồng nhau gây khó đọc: ~~the increase of the number of the users of the internet~~ → the **increase in the number of internet users** (increase **in**, và đổi “of the internet” thành danh từ làm tính từ).",
        ],
      },
      { t: "rule", formula: "the + N + that + S + V · the + N + of + V-ing · N chính + [bổ nghĩa sau] + V (theo N chính)", vi: "Chủ ngữ dài bao nhiêu thì động từ vẫn chia theo một từ: danh từ chính." },
      {
        t: "quiz",
        id: "t4d1-sau-dien",
        kind: "fill",
        title: "Chia động từ trong ngoặc ở hiện tại (đơn hoặc hoàn thành) theo danh từ chính (8 câu)",
        items: [
          { q: "The number of people who work more than fifty hours a week ___ (have) fallen since 2010.", answers: ["has"], hint: "Danh từ chính: number" },
          { q: "A number of recent studies ___ (suggest) that short naps improve concentration.", answers: ["suggest"], hint: "a number of = một số ⇒ số nhiều" },
          { q: "The belief that children learn languages faster than adults ___ (be) only partly true.", answers: ["is"], hint: "Danh từ chính: belief" },
          { q: "Research into the causes of traffic accidents ___ (show) that tiredness is a major factor.", answers: ["shows"], hint: "research: không đếm được" },
          { q: "One of the most serious problems facing large cities ___ (be) air pollution.", answers: ["is"], hint: "One of the + N số nhiều ⇒ động từ số ít" },
          { q: "The measures taken by the government so far ___ (have) not solved the housing shortage.", answers: ["have"], hint: "Danh từ chính: measures" },
          { q: "The majority of students in this survey ___ (prefer) online lectures.", answers: ["prefer"], hint: "The majority of + N số nhiều" },
          { q: "The evidence presented in these reports ___ (be) not convincing.", answers: ["is"], hint: "evidence: không đếm được" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. ★ Mạo từ trong cụm danh từ phức: phần bổ nghĩa SAU quyết định" },
      {
        t: "p",
        text: "Đây là luật mới của hôm nay. Ở band 6 bạn đã biết: nhắc lần hai thì dùng the. Nhưng trong văn học thuật, phần lớn chữ **the** xuất hiện ngay ==lần nhắc đầu tiên==, vì phần bổ nghĩa đứng sau đã nói rõ “cái nào”: **the** invention **of the printing press** — chỉ có một sự phát minh ra máy in. Ngược lại, khi phần sau chỉ cho biết **loại** hoặc **số đo**, danh từ vẫn là “một trong nhiều” ⇒ dùng **a / an**: **a** rise **of 5 %**, **a** problem **of great importance**.",
      },
      {
        t: "table",
        head: ["Trường hợp", "Mạo từ", "Ví dụ", "Vì sao"],
        rows: [
          ["N + of + cái cụ thể (xác định duy nhất)", "**the**", "**the** rise of social media · **the** development of vaccines · **the** role of the state · **the** cost of living", "Phần sau nói rõ đúng một thứ"],
          ["N + that-clause (kiểu ⑥)", "**the**", "**the** idea that… · **the** fact that… · **the** view that…", "Nội dung đã nêu ⇒ xác định"],
          ["Số đo: number / amount / proportion / level + of", "**the**", "**the** number of visitors · **the** proportion of women", "Con số của một nhóm cụ thể"],
          ["Lần đầu nêu một thay đổi (+ in)", "**a / an**", "There was **a** sharp fall **in** sales. · **an** increase **in** demand", "Người đọc chưa biết; một trong nhiều thay đổi"],
          ["Thay đổi + of + con số", "**a / an**", "**a** rise of 12 per cent · **an** average of 3 hours", "of + số đo chỉ độ lớn, không xác định"],
          ["Cụm chỉ lượng cố định", "**a / an**", "**a** lack of · **a** shortage of · **a** range of · **a** variety of · **a** number of · **a** sense of · **a** degree of", "Học thuộc cả cụm"],
          ["N trừu tượng / không đếm được, nói chung (kể cả có tính từ)", "**Ø**", "Ø economic growth · Ø public transport · Ø higher education · Ø modern technology · Ø human behaviour", "Tính từ đứng TRƯỚC không làm danh từ xác định"],
          ["Cùng danh từ ấy + of-phrase cụ thể", "**the**", "**the** economic growth **of the 1990s** · **the** behaviour **of consumers**", "Phần SAU làm nó xác định"],
        ],
        caption: "Tính từ đứng trước KHÔNG kéo theo the; phần bổ nghĩa sau (of + cái cụ thể) thì CÓ.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một danh từ — ba mạo từ",
        cols: [
          { title: "Ø — nói chung", items: ["**Unemployment** is rising.", "**Society** has changed.", "**Education** is the key.", "**People** need hope."] },
          { title: "the — phần sau nói rõ", items: ["**the** unemployment **of the 1930s**", "**the** society **we live in**", "**the** education **of girls**", "**the** people **who lost their jobs**"] },
          { title: "a / an — một loại, một lần", items: ["**an** unemployment **rate** of 5 %", "**a** fairer society", "**a** good education", "**a** people (= một dân tộc — hiếm)"] },
        ],
        caption: "a / an + tính từ + danh từ trừu tượng (a good education, a deep understanding of…) = “một kiểu / một mức” của thứ đó — xem mục 6.",
      },
      {
        t: "examples",
        items: [
          { en: "The growth of online shopping has led to a decline in the number of high-street shops.", vi: "Sự phát triển của mua sắm trực tuyến đã dẫn tới sự sụt giảm số cửa hàng trên phố." },
          { en: "Ø Economic growth does not always improve the quality of Ø life.", vi: "Tăng trưởng kinh tế không phải lúc nào cũng cải thiện chất lượng cuộc sống." },
          { en: "There is a shortage of skilled workers in the construction industry.", vi: "Đang thiếu lao động lành nghề trong ngành xây dựng." },
          { en: "The chart shows a rise of 15 per cent in the cost of public transport.", vi: "Biểu đồ cho thấy mức tăng 15 % ở chi phí giao thông công cộng." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai ở chỗ này",
        items: [
          "Bỏ the trước N + of: ~~Development of technology has changed our lives~~ → **The** development of technology… ; ~~Number of tourists increased~~ → **The** number of tourists…",
          "Thêm the vì thấy có tính từ: ~~The modern technology makes life easier~~ → **Modern technology** makes…; ~~The public transport is cheap~~ → **Public transport** is cheap.",
          "Nhầm giới từ sau từ chỉ thay đổi: an increase **in** prices (cái gì tăng) nhưng an increase **of** 10 % (tăng bao nhiêu). ~~an increase of prices~~ là sai.",
          "Quên a trong cụm chỉ lượng: ~~There is lack of evidence~~ → There is **a** lack of evidence; ~~wide range of~~ → **a** wide range of.",
          "the quality **of life** · the cost **of living** · the standard **of living** · the rate **of unemployment**: danh từ đầu có the, danh từ sau of KHÔNG có the (nói chung).",
        ],
      },
      { t: "rule", formula: "the + N + of + cái cụ thể · a / an + N + in … / of + số đo · Ø + (adj) + N trừu tượng nói chung", vi: "Tính từ đứng trước không tạo ra the. Phần “of + cái cụ thể” đứng sau thì có." },
      {
        t: "quiz",
        id: "t4d1-mao-tu-dien",
        kind: "fill",
        title: "Điền a / an / the, hoặc gõ x nếu không cần mạo từ (10 câu)",
        items: [
          { q: "___ invention of the printing press transformed European society.", answers: ["The", "the"], hint: "N + of + cái cụ thể" },
          { q: "Many experts believe that ___ higher education should be free.", answers: ["x", "X", "Ø"], hint: "Nói chung; tính từ không tạo ra the" },
          { q: "There has been ___ sharp decline in the number of small farms.", answers: ["a"], hint: "Lần đầu nêu một thay đổi" },
          { q: "___ unemployment is a serious problem in many developing countries.", answers: ["x", "X", "Ø"], hint: "Không đếm được, nói chung" },
          { q: "___ unemployment of the 1930s led to widespread poverty.", answers: ["The", "the"], hint: "Có of + thời kỳ cụ thể" },
          { q: "The figures show ___ increase of 12 per cent over the decade.", answers: ["an"], hint: "of + con số; increase bắt đầu bằng nguyên âm" },
          { q: "Governments should invest more in ___ public transport.", answers: ["x", "X", "Ø"], hint: "Nói chung" },
          { q: "The study examined ___ behaviour of children who grew up with smartphones.", answers: ["the"], hint: "behaviour + of + nhóm cụ thể" },
          { q: "Tourism can have ___ negative impact on local traditions.", answers: ["a"], hint: "impact đếm được số ít; một tác động (chưa xác định)" },
          { q: "There is ___ lack of affordable housing in most large cities.", answers: ["a"], hint: "Cụm cố định: a lack of" },
        ],
      },
      {
        t: "quiz",
        id: "t4d1-mao-tu-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — chú ý mạo từ của từng cụm danh từ (4 câu)",
        grammar: "the + N + of + cái cụ thể · a / an + N + in · Ø + N nói chung",
        items: [
          { q: "Sự phát triển của trí tuệ nhân tạo đã tạo ra một nhu cầu ngày càng lớn về kỹ sư phần mềm.", answers: ["The development of artificial intelligence has created a growing demand for software engineers.", "The development of AI has created a growing demand for software engineers.", "The development of artificial intelligence has created an increasing demand for software engineers."], hint: "The development of · a growing demand for" },
          { q: "Giá nhà cao là một trong những nguyên nhân chính của vấn đề này.", answers: ["The high cost of housing is one of the main causes of this problem.", "The high price of housing is one of the main causes of this problem.", "The high cost of housing is one of the main causes of the problem.", "High house prices are one of the main causes of this problem."], hint: "The high cost of housing · one of the main causes of" },
          { q: "Có một sự sụt giảm mạnh ở số người đọc báo in.", answers: ["There was a sharp decline in the number of people reading printed newspapers.", "There has been a sharp decline in the number of people reading printed newspapers.", "There has been a sharp decline in the number of people who read printed newspapers.", "There was a sharp decline in the number of people who read printed newspapers.", "There has been a sharp fall in the number of people who read printed newspapers.", "There has been a sharp decline in the number of people reading print newspapers."], hint: "a sharp decline in · the number of people reading" },
          { q: "Công nghệ hiện đại đã cải thiện chất lượng cuộc sống ở các vùng nông thôn.", answers: ["Modern technology has improved the quality of life in rural areas.", "Modern technology has improved the quality of life in the countryside."], hint: "Modern technology (không the) · the quality of life" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Danh từ không đếm được trong văn học thuật — 30 từ không được thêm -s" },
      {
        t: "p",
        text: "Tập 1 Ngày 5 đã dạy nhóm đời thường (water, money, furniture). Ở band 6.5, lỗi nằm ở nhóm ==học thuật==: tiếng Việt nói “các nghiên cứu”, “những bằng chứng”, “nhiều thông tin” nên ta thêm -s theo phản xạ. Danh từ không đếm được (uncountable): ① không có số nhiều; ② không đi với a / an; ③ động từ số ít; ④ đi với much / little / less / a great deal of / the amount of.",
      },
      {
        t: "table",
        head: ["Nhóm", "Không đếm được (KHÔNG -s)", "Muốn đếm thì dùng"],
        rows: [
          ["Tri thức", "research · evidence · information · knowledge · data (dùng như không đếm được hoặc số nhiều) · feedback · news", "a **study** · a **piece of** evidence · a **fact** · a **finding** · a **comment**"],
          ["Lời nói – hỗ trợ", "advice · help · support · permission · training · education · publicity", "a **suggestion** · a **tip** · a **course** · a **degree**"],
          ["Tiến triển – việc làm", "progress · work · employment · unemployment · homework · travel", "a **step forward** · a **job** · a **task** · an **assignment** · a **journey / trip**"],
          ["Vật chất – hạ tầng", "equipment · machinery · furniture · software · luggage · infrastructure · accommodation · transport · traffic · electricity", "a **piece of** equipment · a **machine** · a **program** · a **suitcase** · a **flat / room** · a **vehicle**"],
          ["Luật – xã hội", "legislation · health · wealth · poverty · pollution · behaviour · leisure · damage · violence", "a **law** · a **regulation** · a **habit** · a **form of** behaviour"],
          ["Thiên nhiên", "scenery · wildlife · weather · nature · countryside", "a **view** · an **animal** · a **species** (số ít = số nhiều)"],
        ],
        caption: "30 từ này phủ hầu hết lỗi -s trong bài Task 2. Dán bảng vào sổ.",
      },
      {
        t: "table",
        head: ["Với N không đếm được", "Với N đếm được số nhiều", "Dùng được cả hai"],
        rows: [
          ["**much** research · how much", "**many** studies · how many", "**a lot of** · plenty of · more · most · some · enough"],
          ["**little** evidence (rất ít) · **a little** (một ít)", "**few** studies (rất ít) · **a few** (một vài)", "**a lack of** · no"],
          ["**less** traffic", "**fewer** cars", "—"],
          ["**the amount of** waste · a large **amount of**", "**the number of** cars · a large **number of**", "**a great deal of** chỉ đi với không đếm được"],
        ],
        caption: "Văn viết trang trọng: tránh “a lot of” lặp lại — đổi thành a great deal of / a considerable amount of (không đếm được) · a large number of / numerous (đếm được).",
      },
      {
        t: "table",
        head: ["Danh từ", "Không đếm được — nghĩa chung", "Đếm được — nghĩa khác"],
        rows: [
          ["experience", "work **experience** (kinh nghiệm)", "an unforgettable **experience** (một trải nghiệm)"],
          ["work", "**work** (việc làm, công việc)", "the **works** of Nguyễn Du (tác phẩm) · road **works**"],
          ["paper", "**paper** (giấy)", "a **paper** (bài báo khoa học; tờ báo)"],
          ["business", "do **business** (việc kinh doanh)", "a small **business** (một doanh nghiệp)"],
          ["time", "**time** (thời gian)", "three **times** (lần) · in ancient **times** (thời)"],
          ["room", "there is no **room** (chỗ trống)", "a **room** (căn phòng)"],
          ["damage", "**damage** to the environment (thiệt hại)", "**damages** (tiền bồi thường — luật)"],
          ["behaviour", "human **behaviour**", "**behaviours** (chỉ gặp trong tâm lý học: các kiểu hành vi)"],
        ],
        caption: "Danh từ “hai mặt”: cùng một từ, đếm được hay không tuỳ nghĩa.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "a / an + adj + N trừu tượng + of …",
            vi: "Nâng cao (C1): danh từ trừu tượng không đếm được vẫn nhận a / an khi có tính từ mô tả “một mức / một kiểu”.",
            examples: [
              { en: "Candidates need a good knowledge of English.", vi: "Ứng viên cần có vốn tiếng Anh tốt." },
              { en: "Travelling gives young people a deeper understanding of other cultures.", vi: "Du lịch cho người trẻ sự hiểu biết sâu hơn về các nền văn hoá khác." },
              { en: "Every child deserves a good education.", vi: "Mọi đứa trẻ đều xứng đáng được học hành tử tế." },
            ],
          },
          {
            formula: "a piece of / an item of / a body of / a wealth of + N không đếm được",
            vi: "Từ chỉ đơn vị cho danh từ không đếm được trong văn học thuật.",
            examples: [
              { en: "There is a growing body of evidence that noise harms health.", vi: "Ngày càng có nhiều bằng chứng cho thấy tiếng ồn hại sức khoẻ." },
              { en: "This is an important piece of research.", vi: "Đây là một công trình nghiên cứu quan trọng." },
              { en: "The internet offers a wealth of information.", vi: "Internet cung cấp một lượng thông tin phong phú." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "⚠️ Mười cụm sai chép từ bài viết band 6.5 — sửa lại",
        items: [
          "~~many researches show~~ → **much research shows** / **many studies show** · ~~a research~~ → **a study** / **a piece of research**",
          "~~many evidences~~ → **a great deal of evidence** / **much evidence** · ~~an evidence~~ → **a piece of evidence**",
          "~~informations~~, ~~knowledges~~, ~~advices~~, ~~equipments~~, ~~softwares~~, ~~homeworks~~ → không bao giờ có -s",
          "~~less people~~ → **fewer** people · ~~the amount of cars~~ → **the number of** cars · ~~a large number of traffic~~ → **a large amount of** traffic",
          "~~make a progress~~ → **make progress** (make good / rapid / little progress) · ~~do a research~~ → **do / carry out / conduct research**",
          "~~a good news~~ → **good news** / **a piece of good news**; The news **is** (số ít) good.",
          "~~find a work~~ → find **work** / find **a job** · ~~an accommodation~~ → **accommodation** / **a place to live**",
          "~~traffics~~, ~~pollutions~~ → traffic, pollution; nhưng **traffic jams**, **pollutants** (chất gây ô nhiễm) đếm được.",
          "~~staffs~~ → **staff** (chỉ cả tập thể; động từ thường số nhiều ở Anh: The staff **are** helpful) · một người: **a member of staff**",
          "~~Researches into the brain have~~ → **Research** into the brain **has**…",
        ],
      },
      { t: "rule", formula: "N không đếm được: Ø / much / little / less / a great deal of / the amount of + N + V(s/es)", vi: "research, evidence, information, advice, knowledge, progress, equipment…: không -s, không a / an, động từ số ít." },
      {
        t: "mcq",
        id: "t4d1-khong-dem-chon",
        title: "Chọn cụm đúng — danh từ không đếm được (8 câu)",
        items: [
          { q: "There is ___ that regular exercise reduces stress.", options: ["a strong evidence", "strong evidence", "strong evidences", "many strong evidence"], correct: 1, why: "evidence không đếm được ⇒ không a, không -s: strong evidence." },
          { q: "The team has made ___ in the last two years.", options: ["considerable progress", "a considerable progress", "considerable progresses", "many progress"], correct: 0, why: "progress không đếm được: make considerable progress." },
          { q: "___ people are buying newspapers than ten years ago.", options: ["Less", "Lesser", "Fewer", "Little"], correct: 2, why: "people là danh từ đếm được số nhiều ⇒ fewer." },
          { q: "The new law requires factories to replace ___.", options: ["old machineries", "an old machinery", "old machines equipment", "old machinery"], correct: 3, why: "machinery không đếm được. Đếm được thì dùng machines." },
          { q: "She has ___ of teaching children with learning difficulties.", options: ["a ten years experience", "ten years' experience", "ten years experiences", "ten-years experience"], correct: 1, why: "experience (kinh nghiệm) không đếm được; ten years' experience hoặc ten years of experience." },
          { q: "Living abroad was ___ that changed my view of the world.", options: ["experience", "the experiences", "an experience", "experiences"], correct: 2, why: "Ở đây experience = một trải nghiệm ⇒ đếm được: an experience." },
          { q: "The company spends ___ on staff training.", options: ["a large number of money", "many money", "large amounts of moneys", "a great deal of money"], correct: 3, why: "money không đếm được ⇒ a great deal of / a large amount of money." },
          { q: "Applicants must have ___ of at least one programming language.", options: ["a good knowledge", "good knowledges", "the good knowledge", "good knowledge"], correct: 0, why: "a + adj + knowledge + of…: cấu trúc đặc biệt ở trên (a good knowledge of)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d1-khong-dem-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — danh từ không đếm được (5 câu)",
        grammar: "N không đếm được: không -s, không a / an, động từ số ít",
        items: [
          { q: "Nhiều nghiên cứu cho thấy trẻ em cần ngủ ít nhất chín tiếng mỗi đêm. (dùng research)", answers: ["Much research shows that children need at least nine hours of sleep a night.", "Much research shows that children need at least nine hours of sleep per night.", "A great deal of research shows that children need at least nine hours of sleep a night.", "Much research shows that children need to sleep at least nine hours a night.", "A great deal of research shows that children need at least nine hours of sleep per night.", "Much research shows that children need at least nine hours' sleep a night."], hint: "Much research shows (số ít) · at least nine hours of sleep" },
          { q: "Có rất ít bằng chứng cho thấy bài tập về nhà cải thiện kết quả của học sinh tiểu học.", answers: ["There is little evidence that homework improves the results of primary school pupils.", "There is little evidence that homework improves the results of primary school students.", "There is very little evidence that homework improves the results of primary school pupils.", "There is very little evidence that homework improves the results of primary school students.", "There is little evidence that homework improves primary school pupils' results.", "There is little evidence that homework improves primary school students' results."], hint: "There is little evidence that · homework (không -s)" },
          { q: "Chính phủ nên đầu tư nhiều hơn vào hạ tầng và thiết bị cho các bệnh viện nông thôn.", answers: ["The government should invest more in infrastructure and equipment for rural hospitals.", "Governments should invest more in infrastructure and equipment for rural hospitals.", "The government should invest more in infrastructure and equipment for hospitals in rural areas."], hint: "invest more in · infrastructure · equipment" },
          { q: "Giáo viên đã cho tôi vài lời khuyên hữu ích về cách tìm việc.", answers: ["My teacher gave me some useful advice on how to find a job.", "My teacher gave me some useful advice about how to find a job.", "The teacher gave me some useful advice on how to find a job.", "My teacher gave me some useful advice on how to find work.", "The teacher gave me some useful advice about how to find a job.", "My teacher gave me some useful advice on finding a job."], hint: "some useful advice on · find a job / find work" },
          { q: "Số xe hơi tăng, nhưng lượng giao thông trong trung tâm thành phố lại giảm.", answers: ["The number of cars increased, but the amount of traffic in the city centre fell.", "The number of cars rose, but the amount of traffic in the city centre fell.", "The number of cars increased, but the amount of traffic in the city centre decreased.", "The number of cars has increased, but the amount of traffic in the city centre has fallen.", "The number of cars rose, but the amount of traffic in the city centre decreased.", "The number of cars increased but the amount of traffic in the city centre fell."], hint: "The number of cars · the amount of traffic" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Tám lỗi mạo từ còn sót ở band 6.5" },
      {
        t: "table",
        head: ["Lỗi", "Sai", "Đúng", "Vì sao"],
        rows: [
          ["① the + số nhiều nói chung", "~~The young people today spend too much time online.~~", "**Young people** today spend…", "Nói về cả một loại người ⇒ Ø. the young people **in this survey** thì được."],
          ["② the trước society / nature / space", "~~The society should protect the nature.~~", "**Society** should protect **nature**.", "Ba từ này nói chung thì Ø. Nhưng **the** environment, **the** countryside, **the** planet."],
          ["③ Thiếu the trước thứ “ai cũng biết là cái nào”", "~~Government should control internet.~~", "**The** government should control **the** internet.", "the government · the economy · the media · the public · the environment · the internet · the world · the past / present / future"],
          ["④ most và the most", "~~The most people agree.~~ · ~~Most of people agree.~~", "**Most people** agree. · **Most of the people I know** agree.", "the most = so sánh nhất (the most popular). most = hầu hết."],
          ["⑤ Thiếu a / an trong cụm cố định", "~~plays important role~~ · ~~has negative effect~~ · ~~as result~~", "plays **an** important role · has **a** negative effect · as **a** result", "role, effect, result… đếm được số ít ⇒ không đứng trần"],
          ["⑥ Thiếu the trước từ “chỉ có một”", "~~Main reason is…~~ · ~~Same problem~~ · ~~Only solution~~", "**The** main reason · **the** same problem · **the** only solution · **the** first / next / last · **the** best", "main, same, only, số thứ tự, so sánh nhất ⇒ the"],
          ["⑦ a / an theo ÂM, không theo chữ", "~~a hour~~ · ~~an university~~ · ~~a MBA~~ · ~~an European~~", "**an** hour · **a** university · **an** MBA · **a** European · **an** NGO · **a** one-year course", "Âm đầu là nguyên âm ⇒ an; /juː/ và /w/ là phụ âm ⇒ a"],
          ["⑧ Nơi chốn – thời gian – tên nước", "~~go to the university~~ (đi học) · ~~in the 2020~~ · ~~in 1990s~~ · ~~in UK~~", "go to **university** · in **2020** · in **the** 1990s · in **the** UK / **the** US / **the** Netherlands / **the** Philippines", "Đi đúng mục đích của nơi đó ⇒ Ø (at school, in hospital, in prison, at work). Năm ⇒ Ø; thập niên ⇒ the; nước có Kingdom / States / số nhiều ⇒ the"],
        ],
        caption: "Tám lỗi này chiếm phần lớn lỗi mạo từ còn lại sau band 6. Sáu lỗi đầu đã gặp ở Tập 3 Ngày 3 — nếu vẫn sai, mở lại bài ấy.",
      },
      {
        t: "note",
        title: "📌 Ba cụm “the + tính từ” và ba cụm số liệu hay dùng trong Task 2 / Task 1",
        items: [
          "**the + tính từ** = cả một nhóm người, động từ số nhiều: **the elderly**, **the unemployed**, **the poor**, **the rich**, **the young**, **the disabled**. → The elderly **are** often lonely. (Không viết ~~the elderlies~~, ~~an elderly~~.)",
          "Số liệu: **the majority of** · **a minority of** · **the vast majority of** — the majority, a minority (học thuộc).",
          "Phần trăm: **20 per cent of the population** (không the trước số) · **the percentage of** + N · **a quarter of** / **a third of** / **half (of)** / **two thirds of** + the + N.",
        ],
      },
      { t: "rule", formula: "Ø + N số nhiều nói chung · the + thứ ai cũng biết (the government) · most + N · the + main / same / only / first", vi: "Nói chung về một loại ⇒ không the. Chỉ có một / ai cũng biết cái nào ⇒ the." },
      {
        t: "quiz",
        id: "t4d1-sua-loi",
        kind: "fill",
        title: "Mỗi câu có MỘT lỗi ở cụm trong ngoặc vuông. Viết lại cụm đó cho đúng (8 câu)",
        items: [
          { q: "[The children] need at least an hour of physical activity every day. (nói chung về trẻ em)", answers: ["Children", "children"], hint: "Lỗi ①" },
          { q: "Many people believe that [government] should do more to protect the environment.", answers: ["the government"], hint: "Lỗi ③" },
          { q: "Tourism [plays important role] in the economy of many island nations.", answers: ["plays an important role"], hint: "Lỗi ⑤" },
          { q: "[The most people] in my country still prefer to pay in cash.", answers: ["Most people", "most people"], hint: "Lỗi ④" },
          { q: "She decided to do [a MBA] after working for five years.", answers: ["an MBA"], hint: "Lỗi ⑦" },
          { q: "[Main reason] for this change is the falling price of smartphones.", answers: ["The main reason", "the main reason"], hint: "Lỗi ⑥" },
          { q: "Car ownership rose sharply [in 1990s].", answers: ["in the 1990s"], hint: "Lỗi ⑧" },
          { q: "Modern life has damaged the relationship between people and [the nature].", answers: ["nature"], hint: "Lỗi ②" },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dùng trong bài thi: từ câu band 6 lên câu band 7" },
      {
        t: "p",
        text: "Cụm danh từ phức là cách văn học thuật ==nén thông tin==. Câu band 6 thường là “người + động từ + vì…”. Câu band 7 biến cả hành động thành một cụm danh từ làm chủ ngữ (danh hoá — Tập 3 Ngày 25), rồi dùng một động từ mạnh nối với kết quả. Đừng làm thế với mọi câu: mỗi đoạn 1–2 câu là đủ.",
      },
      {
        t: "table",
        head: ["Ở đâu", "Band 6", "Band 7 — cụm danh từ phức"],
        rows: [
          ["Task 1 — xu hướng", "The number of people who used cars increased quickly.", "There was **a rapid increase in car use**. / **Car ownership** rose sharply."],
          ["Task 1 — overview", "People spent more on food than on other things.", "**The largest share of household spending** went on food."],
          ["Task 2 — nguyên nhân", "Because people consume more, there is more waste.", "**Rising consumption** has led to **a growing volume of household waste**."],
          ["Task 2 — giải pháp", "Governments should make laws about pollution that are stricter.", "**Stricter legislation on industrial pollution** is needed."],
          ["Task 2 — nhượng bộ", "Some people think that money makes people happy, but this is not always true.", "**The assumption that wealth guarantees happiness** does not always hold."],
          ["Speaking Part 3", "Many young people can't buy a house because it is expensive.", "**The main obstacle for first-time buyers** is **the sheer cost of housing**."],
          ["Speaking Part 1", "I like films that make me think.", "I'm drawn to **thought-provoking films with an unexpected ending**."],
        ],
        caption: "Mỗi cụm in đậm đều qua được 4 bước soát ở mục 2: danh từ chính, đếm được không, mạo từ, động từ.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: đừng nén quá đà",
        items: [
          "Một câu chỉ nên có **một** cụm danh từ dài (trên 6 từ). Hai cụm dài nối bằng một động từ yếu (is, has) làm câu nặng và khó đọc — giám khảo trừ CC.",
          "Khi nói, cụm danh từ dài nghe như đọc bài. Speaking chỉ dùng cụm 3–5 từ: **a well-paid job**, **the cost of living**, **a growing number of people**.",
          "Đã danh hoá thì phải đúng giới từ: an increase **in**, a solution **to**, a demand **for**, an impact **on**, a reason **for**, a lack **of** (Tập 3 Ngày 25 mục 6).",
        ],
      },
      { t: "rule", formula: "Cụm danh từ (hành động đã danh hoá) + V mạnh (lead to / result in / reflect / require) + cụm danh từ (kết quả)", vi: "Rising consumption has led to a growing volume of waste. Mỗi đoạn 1–2 câu kiểu này." },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện tổng hợp" },
      {
        t: "mcq",
        id: "t4d1-np-chon",
        title: "Chọn cụm đúng nhất cho văn viết học thuật (8 câu)",
        items: [
          { q: "The council has approved ___ to reduce traffic in the city centre.", options: ["a five-years plan", "a five-year plan", "five-year plan", "a five years' plans"], correct: 1, why: "Tính từ ghép có số: danh từ đo lường số ít, có gạch nối; plan đếm được số ít ⇒ cần a." },
          { q: "___ that social media harms teenagers is not supported by all researchers.", options: ["A claim which", "Claim that", "The claim which", "The claim that"], correct: 3, why: "Kiểu ⑥: the + claim + that + mệnh đề (nội dung của lời khẳng định). Không dùng which." },
          { q: "___ in rural areas has improved significantly.", options: ["The quality of health care", "Quality of the health care", "The quality of the health cares", "A quality of health care"], correct: 0, why: "the + quality + of + Ø health care (nói chung, không đếm được)." },
          { q: "There has been ___ the demand for electric vehicles.", options: ["the sharp rise of", "sharp rise in", "a sharp rise in", "a sharp rise of"], correct: 2, why: "Lần đầu nêu thay đổi ⇒ a; cái gì tăng ⇒ in (of + con số)." },
          { q: "___ carried out in twelve countries suggests that happiness peaks at around 70.", options: ["Researches", "Research", "A research", "The researches"], correct: 1, why: "research không đếm được; “carried out in twelve countries” là phần rút gọn bị động bổ nghĩa sau." },
          { q: "___ live alone, which increases the risk of loneliness.", options: ["Many of the elderly", "Many elderlies", "Much of elderly", "Many of elderly"], correct: 0, why: "the elderly = người cao tuổi (cả nhóm) ⇒ many of the elderly; không có elderlies." },
          { q: "The country's economy depends on ___.", options: ["the exports of the oil", "export of an oil", "oil export's", "oil exports"], correct: 3, why: "Danh từ làm tính từ (oil) + danh từ chính số nhiều nói chung (exports) ⇒ gọn và không cần mạo từ." },
          { q: "___ of working parents now rely on grandparents for childcare.", options: ["Growing number", "The growing number", "A growing number", "A growing amount"], correct: 2, why: "a growing number of + N số nhiều (= ngày càng nhiều). amount chỉ đi với danh từ không đếm được." },
        ],
      },
      {
        t: "quiz",
        id: "t4d1-tong-hop-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu band 7 có cụm danh từ phức (5 câu)",
        grammar: "Cụm danh từ làm chủ ngữ + V (theo danh từ chính)",
        items: [
          { q: "Niềm tin rằng tiền mang lại hạnh phúc rất phổ biến trong giới trẻ.", answers: ["The belief that money brings happiness is very common among young people.", "The belief that money brings happiness is widespread among young people.", "The belief that money brings happiness is very widespread among young people.", "The belief that money brings happiness is common among young people."], hint: "The belief that … is · among young people (không the)" },
          { q: "Chi phí nuôi con ngày càng tăng là lý do chính khiến tỉ lệ sinh giảm.", answers: ["The rising cost of raising children is the main reason for the fall in the birth rate.", "The rising cost of raising children is the main reason for the decline in the birth rate.", "The rising cost of raising a child is the main reason for the fall in the birth rate.", "The rising cost of raising children is the main reason for falling birth rates.", "The rising cost of raising a child is the main reason for the decline in the birth rate.", "The rising cost of bringing up children is the main reason for the fall in the birth rate."], hint: "The rising cost of raising children · the main reason for · the fall in" },
          { q: "Ngày càng nhiều công ty cho phép nhân viên làm việc ở nhà.", answers: ["A growing number of companies allow their employees to work from home.", "A growing number of companies allow employees to work from home.", "A growing number of companies are allowing their employees to work from home.", "A growing number of companies are allowing employees to work from home.", "An increasing number of companies allow their employees to work from home.", "An increasing number of companies allow employees to work from home."], hint: "A growing number of companies + V số nhiều" },
          { q: "Việc thiếu nhà ở giá phải chăng buộc nhiều người trẻ phải sống với bố mẹ.", answers: ["The lack of affordable housing forces many young people to live with their parents.", "A lack of affordable housing forces many young people to live with their parents.", "The shortage of affordable housing forces many young people to live with their parents.", "A shortage of affordable housing forces many young people to live with their parents."], hint: "The / A lack of affordable housing + forces (số ít)" },
          { q: "Một nghiên cứu ba năm do chính phủ tài trợ đã tìm thấy rất ít bằng chứng về mối liên hệ này.", answers: ["A three-year government-funded study found little evidence of this link.", "A three-year, government-funded study found little evidence of this link.", "A government-funded three-year study found little evidence of this link.", "A three-year government-funded study found very little evidence of this link.", "A three-year study funded by the government found little evidence of this link.", "A three-year government-funded study has found little evidence of this link.", "A three-year study funded by the government found very little evidence of this link."], hint: "A three-year government-funded study · little evidence of" },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo dùng trong bài thi",
        items: [
          "**Writing:** dành 3 phút cuối soát riêng danh từ: gạch chân danh từ chính ở chủ ngữ mỗi câu → mạo từ → -s → động từ.",
          "**Speaking:** học theo cụm, không theo từ. Mỗi ngày chép 5 cụm danh từ đúng từ bài mẫu vào Sổ Speaking (a growing number of, the vast majority of, a wide range of, the cost of living, a sense of achievement).",
          "**Reading Passage 3:** chủ ngữ thường dài 10–15 từ. Tìm danh từ chính và động từ chính trước — phần còn lại chỉ là bổ nghĩa. Bài Đọc ngay sau đây sẽ luyện việc này.",
          "**Listening Part 1:** mạo từ không tính vào giới hạn từ nếu bạn không viết nó — nhưng **-s số nhiều thì tính điểm**. Xem bài Nghe hôm nay.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — ĐỌC ═══════════════════════════ */
  {
    id: "t4d1-doc",
    kind: "reading",
    title: "Đọc: Passage 3 nhập môn — văn bản lập luận nhân văn / khoa học xã hội, bản đồ lập luận, 900 từ trong 20 phút",
    goal: "Nhận ra bố cục lập luận của một Passage 3 (quan điểm quen → phản bác → bằng chứng → dè dặt → lập trường tác giả → hệ quả), vẽ bản đồ lập luận trong 3 phút và làm 13 câu của một bài 900 từ trong 20 phút, đúng ít nhất 9 câu.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "**Passage 3** là bài đọc cuối và khó nhất của Reading Academic: khoảng 850–950 từ, thường là văn bản ==lập luận== (tác giả bênh một quan điểm), chủ đề nhân văn hoặc khoa học xã hội, nhiều ý trừu tượng.",
          "Band 6 làm tốt Passage 1–2 rồi hết giờ ở Passage 3. Band 7 cần **Passage 3 ≥ 9/13** (cả bài ≥ 30/40). Bài này dạy cách đọc để đủ giờ.",
          "Công cụ chính: **bản đồ lập luận** — 3 phút đầu ghi cho mỗi đoạn MỘT nhãn chức năng (quan điểm quen / phản bác / bằng chứng / nhưng… / lập trường / hệ quả). Nối Tập 3 Ngày 1 (skim bố cục), nay thêm tầng “đoạn này LÀM GÌ trong lập luận”.",
          "Chia giờ cả đề: **17 – 20 – 23 phút** cho Passage 1 – 2 – 3. Hôm nay tập riêng Passage 3 với mốc 20 phút; cuối tập rút dần.",
          "Dạng câu hỏi hay đi với Passage 3: **YES / NO / NOT GIVEN** (ý kiến tác giả), **Multiple choice**, **Summary có hộp từ**, Matching sentence endings. Hôm nay làm ba dạng đầu; các ngày sau học sâu từng dạng (Ngày 5: bẫy YNNG; Ngày 7: Multiple choice).",
          "Nối bài Ngữ pháp: chủ ngữ trong Passage 3 thường là cụm danh từ dài 10–15 từ — tìm ==danh từ chính + động từ chính== trước.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Passage 3 khác Passage 1–2 ở đâu" },
      {
        t: "table",
        head: ["", "Passage 1", "Passage 2", "Passage 3"],
        rows: [
          ["Kiểu văn bản", "Mô tả, kể sự kiện (lịch sử một phát minh, một loài vật)", "Mô tả + giải thích; đôi khi có nhiều ý kiến chuyên gia", "==Lập luận==: tác giả có quan điểm, bác ý khác, dè dặt, kết luận"],
          ["Chủ đề", "Cụ thể", "Cụ thể → hơi trừu tượng", "Trừu tượng: tri thức, ngôn ngữ, trí nhớ, cái đẹp, công bằng…"],
          ["Câu", "20–25 từ", "25 từ", "30–40 từ, nhiều mệnh đề lồng nhau, cụm danh từ dài"],
          ["Dạng câu hỏi hay gặp", "T/F/NG, điền từ, bảng", "Matching headings, matching information, điền từ", "Y/N/NG, Multiple choice, Summary hộp từ, Matching endings"],
          ["Paraphrase", "Mức 1–2: từ đồng nghĩa", "Mức 2–3: đổi loại từ, đổi cấu trúc", "Mức 3–4: đổi cấu trúc, ==ẩn ý==, gộp hai câu"],
          ["Thời gian nên dùng", "17 phút", "20 phút", "23 phút"],
        ],
        caption: "Ba passage cùng 13–14 câu, mỗi câu 1 điểm. Passage 3 không “đáng giá” hơn — nhưng muốn band 7 thì không được bỏ.",
      },
      {
        t: "note",
        title: "📌 Mở lại kết quả Đề 6 của bạn",
        items: [
          "Passage 3 của Đề 6 bạn đúng mấy câu? Còn bao nhiêu phút khi bắt đầu Passage 3? Ghi hai con số này lên đầu trang vở.",
          "Còn dưới 15 phút khi vào Passage 3 ⇒ vấn đề là ==chia giờ== (mục 4). Còn đủ 20 phút mà đúng dưới 7 câu ⇒ vấn đề là ==cách đọc văn bản lập luận== (mục 2–3) và paraphrase mức 3–4 (mục 6).",
          "Sai nhiều nhất ở dạng nào? Sổ lỗi của Online Test đã ghi sẵn dạng câu — bạn sẽ gặp lại từng dạng trong 30 ngày tới.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Văn bản lập luận đi theo khung nào" },
      {
        t: "p",
        text: "Văn bản mô tả trả lời “cái gì, khi nào, thế nào”. Văn bản **lập luận** (argumentative text) trả lời “==tác giả tin điều gì, và vì sao==”. Người viết học thuật hiếm khi nói thẳng “tôi nghĩ”. Họ đi theo một khung quen: nêu quan điểm mà ai cũng tin → chỉ ra nó có vấn đề → đưa bằng chứng → tự dè dặt (không đi quá xa) → chốt lập trường → nói vì sao chuyện này quan trọng. Biết khung này, bạn đoán được đoạn tiếp theo sẽ làm gì.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung 6 bước của một Passage 3 lập luận",
        steps: [
          { label: "1. Quan điểm quen", sub: "Most people assume… · It is widely believed… · The familiar story is…" },
          { label: "2. Phản bác", sub: "However, … · Yet… · This picture has been challenged…" },
          { label: "3. Bằng chứng", sub: "The first difficulty… · A second… · Studies show…" },
          { label: "4. Dè dặt (nhưng đừng đi quá xa)", sub: "It would be a mistake, however, to conclude… · This is not to say…" },
          { label: "5. Lập trường của tác giả", sub: "The more defensible position is… · On this view…" },
          { label: "6. Hệ quả — vì sao quan trọng", sub: "None of this would matter if… · The implications are…" },
        ],
        caption: "Không phải bài nào cũng đủ 6 bước và đúng thứ tự này, nhưng bước 1 → 2 và bước 4 → 5 gần như luôn có.",
      },
      {
        t: "table",
        head: ["Thể loại (R21)", "Ví dụ chủ đề", "Câu hỏi nên tự đặt khi đọc"],
        rows: [
          ["Nhân văn (lịch sử, triết học, ngôn ngữ, nghệ thuật)", "Thiên tài có thật không · Dịch thuật có trung thành được không", "Tác giả bác quan điểm nào? Giữ lại phần nào?"],
          ["Khoa học xã hội (xã hội học, tâm lý, kinh tế, giáo dục)", "Vì sao ta tin người lạ · Đo hạnh phúc bằng gì", "Bằng chứng là nghiên cứu nào? Tác giả tin nghiên cứu ấy tới đâu?"],
          ["Khoa học tự nhiên dạng bình luận", "Tranh luận về một giả thuyết", "Có mấy giả thuyết? Tác giả nghiêng về cái nào?"],
        ],
        caption: "Tập 4 sẽ đọc đủ 6 thể loại; hôm nay là thể loại nhân văn – lịch sử khoa học.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi đọc văn bản lập luận",
        items: [
          "Tưởng **quan điểm quen** ở đoạn đầu là ý tác giả. Thực ra đoạn mở thường nêu điều tác giả ==sắp bác==. Gặp “the familiar story”, “it is often assumed”, “conventional wisdom” ⇒ ghi nhãn QUEN, chưa phải ý tác giả.",
          "Bỏ sót đoạn **dè dặt**. Sau khi bác quan điểm cũ, tác giả hay lùi một bước (“It would be a mistake, however, to…”). Câu hỏi Y/N/NG và Multiple choice rất thích hỏi đúng chỗ này.",
          "Thấy tên người, năm, con số là dừng lại đọc kỹ. Ở Passage 3 ví dụ chỉ để ==chống đỡ== cho một ý — hãy hỏi “ví dụ này chứng minh ý nào?”.",
          "Đọc từng chữ từ đầu tới cuối rồi mới xem câu hỏi ⇒ hết 12 phút mà chưa trả lời câu nào.",
        ],
      },
      { t: "rule", formula: "Quan điểm quen → Phản bác → Bằng chứng → Dè dặt → Lập trường tác giả → Hệ quả", vi: "Mỗi đoạn làm MỘT việc trong khung này. Biết việc của đoạn là biết tìm đáp án ở đâu." },

      /* ── 3 ── */
      { t: "h", text: "3. Bản đồ lập luận trong 3 phút" },
      {
        t: "p",
        text: "Tập 3 Ngày 1 dạy **skim bố cục**: đọc tiêu đề, đoạn mở, câu đầu mỗi đoạn, đoạn kết, rồi ghi 2–3 từ chủ đề cạnh mỗi đoạn. Với Passage 3, ghi thêm một ==nhãn chức năng==: đoạn này đang đồng ý, phản bác, đưa bằng chứng hay kết luận? Trên máy tính, dùng chức năng **Notes / Highlight** của phần mềm thi; lúc luyện thì ghi ra giấy nháp.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "3 phút đầu của Passage 3",
        steps: [
          { label: "0:00 Tiêu đề + phụ đề", sub: "Có chữ myth / rethinking / in defence of / the case for? ⇒ tác giả có lập trường" },
          { label: "0:20 Đọc trọn đoạn mở", sub: "Tìm quan điểm quen và chữ however / yet" },
          { label: "1:00 Câu đầu mỗi đoạn", sub: "Ghi nhãn: QUEN · BÁC · B.CHỨNG 1 / 2 · VÌ SAO · DÈ DẶT · LẬP TRƯỜNG · HỆ QUẢ" },
          { label: "2:20 Đọc trọn đoạn kết", sub: "Lập trường cuối của tác giả nằm ở đây" },
          { label: "2:50 Liếc các nhóm câu hỏi", sub: "Nhóm nào theo thứ tự bài? Nhóm nào nằm ở một đoạn?" },
        ],
        caption: "Chỉ ghi nhãn 1–2 chữ. Mục đích là biết ĐOẠN NÀO LÀM GÌ, chưa cần hiểu hết.",
      },
      {
        t: "table",
        head: ["Từ / cụm tín hiệu", "Đoạn đó đang làm gì", "Nhãn"],
        rows: [
          ["Ask most people… · It is commonly assumed… · The familiar story… · conventional wisdom", "Nêu quan điểm phổ biến (thường sắp bị bác)", "QUEN"],
          ["however · yet · but · in fact · have spent decades dismantling / questioning", "Bắt đầu phản bác", "BÁC"],
          ["The first difficulty… · A second… · Further evidence… · Consider…", "Đưa bằng chứng / lý lẽ từng cái một", "B.CHỨNG"],
          ["Why, then, … ? · How can we explain…?", "Tự hỏi rồi tự giải thích nguyên nhân", "VÌ SAO"],
          ["It would be a mistake, however, to… · This is not to say… · Admittedly… · Of course…", "Lùi một bước, tránh nói quá", "DÈ DẶT"],
          ["The more defensible position… · On this view… · What this suggests is…", "Chốt lập trường của chính tác giả", "LẬP TRƯỜNG"],
          ["None of this would matter if… · The stakes… · The implications…", "Nói vì sao vấn đề quan trọng / hệ quả", "HỆ QUẢ"],
        ],
        caption: "Chép bảng này vào sổ. Khi đọc bài ở mục 7, hãy khoanh những cụm này.",
      },
      {
        t: "note",
        title: "💡 Mẹo: nhãn chức năng giúp gì cho từng dạng câu hỏi",
        items: [
          "**Y/N/NG** hỏi ý kiến tác giả ⇒ đáp án nằm ở đoạn BÁC, DÈ DẶT, LẬP TRƯỜNG; câu ở đoạn QUEN thường là thứ tác giả ==không== đồng ý.",
          "**Multiple choice** kiểu “The writer mentions X in order to…” ⇒ tìm X rồi đọc nhãn của đoạn chứa X: ví dụ nằm trong đoạn B.CHỨNG thì mục đích là chứng minh ý của đoạn đó.",
          "**Summary** thường tóm MỘT hoặc HAI đoạn liền nhau ⇒ tiêu đề của summary + nhãn đoạn cho biết ngay phải đọc đoạn nào.",
        ],
      },
      { t: "rule", formula: "Tiêu đề → đoạn mở → câu đầu mỗi đoạn (ghi NHÃN) → đoạn kết → liếc câu hỏi = 3 phút", vi: "Chưa có bản đồ thì chưa trả lời câu nào." },

      /* ── 4 ── */
      { t: "h", text: "4. Chia giờ: 17 – 20 – 23 và 20 phút cho bài hôm nay" },
      {
        t: "table",
        head: ["Việc", "Hôm nay (tập riêng Passage 3)", "Trong đề đủ 60 phút"],
        rows: [
          ["Vẽ bản đồ lập luận", "3 phút", "3 phút"],
          ["Trả lời 13–14 câu", "==17 phút== (≈ 75–80 giây / câu)", "17–18 phút"],
          ["Soát chính tả, câu bỏ trống", "(tính trong 17 phút)", "2 phút cuối của 23 phút"],
          ["Tổng", "**20 phút**", "**23 phút** cho Passage 3 (Passage 1: 17 · Passage 2: 20)"],
        ],
        caption: "Vì sao Passage 1 chỉ 17 phút? Vì bạn đã ở band 6: Passage 1 phải nhanh để dành giờ cho Passage 3.",
      },
      {
        t: "note",
        title: "💡 Mẹo giữ giờ ở Passage 3",
        items: [
          "Một câu quá **90 giây** chưa ra ⇒ chọn đáp án hợp lý nhất, đánh dấu (trên máy: nút **Review**), đi tiếp. Không bỏ trống — sai không bị trừ điểm.",
          "Làm theo ==nhóm câu==, không theo từng câu: đọc cả nhóm, xác định vùng đọc, rồi trả lời liền một lượt.",
          "Nhóm Summary có hộp từ thường chỉ nằm trong 1–2 đoạn ⇒ nếu sắp hết giờ, làm nhóm này trước vì tốn ít thời gian đọc nhất.",
          "Reading KHÔNG có thời gian chép đáp án riêng (khác Listening thi giấy). Gõ đáp án ngay khi làm; 2 phút cuối chỉ để soát.",
        ],
      },
      { t: "rule", formula: "Passage 1 – 2 – 3 = 17 – 20 – 23 phút · Passage 3 = 3 phút bản đồ + 17–18 phút trả lời + 2 phút soát", vi: "Quá 90 giây một câu ⇒ chọn, đánh dấu, đi tiếp." },

      /* ── 5 ── */
      { t: "h", text: "5. Câu dài 35 từ: tìm danh từ chính + động từ chính (nối bài Ngữ pháp)" },
      {
        t: "p",
        text: "Câu Passage 3 dài vì chủ ngữ là một ==cụm danh từ phức== và vì có mệnh đề chen giữa. Cách đọc: ① tìm động từ chính (động từ có chia thì, không nằm sau who / which / that); ② lùi về trái tìm danh từ chính của chủ ngữ; ③ phần còn lại là bổ nghĩa — đọc sau.",
      },
      {
        t: "table",
        head: ["Câu gốc", "Xương sống (danh từ chính + động từ chính)", "Phần bổ nghĩa"],
        rows: [
          ["The assumption that children who start school early gain a lasting advantage over their peers has rarely been tested.", "The **assumption** … **has** rarely **been tested**.", "that children [who start school early] gain a lasting advantage over their peers = NỘI DUNG của giả định (kiểu ⑥)"],
          ["Much of the evidence cited in support of open-plan offices, collected largely by the firms that design them, is of doubtful value.", "Much of the **evidence** … **is** of doubtful value.", "cited in support of… (V3 rút gọn) · collected largely by the firms… (V3 rút gọn, chen giữa hai dấu phẩy)"],
          ["What historians have put in its place is at once less romantic and considerably more interesting.", "**What historians have put in its place** (cả mệnh đề là chủ ngữ) **is** …", "at once A and B = vừa A vừa B"],
        ],
        caption: "Đọc xương sống trước: “Giả định … hiếm khi được kiểm chứng.” — rồi mới đọc giả định ấy là gì.",
      },
      {
        t: "mcq",
        id: "t4d1-doc-cau-dai",
        title: "Tìm xương sống của câu (4 câu)",
        items: [
          { q: "“The idea that a single test taken at the age of eleven can predict a child's future has been abandoned in most countries.” — Động từ chính là:", options: ["taken", "can predict", "has been abandoned", "future"], correct: 2, why: "taken là V3 rút gọn; can predict nằm trong mệnh đề that (nội dung của idea). Xương sống: The idea … has been abandoned." },
          { q: "Trong câu trên, điều gì “has been abandoned”?", options: ["một ý tưởng", "một bài kiểm tra", "tương lai của đứa trẻ", "hầu hết các nước"], correct: 0, why: "Danh từ chính của chủ ngữ là idea." },
          { q: "“Few of the studies on which this claim rests, most of them carried out in the 1970s, involved more than fifty participants.” — Câu này nói gì?", options: ["Lời khẳng định này có hơn 50 người ủng hộ.", "Phần lớn nghiên cứu làm nền cho lời khẳng định này có quy mô nhỏ.", "Các nghiên cứu thập niên 1970 đều có trên 50 người tham gia.", "Rất ít nghiên cứu được làm vào thập niên 1970."], correct: 1, why: "Xương sống: Few of the studies … involved more than fifty participants = hầu như không nghiên cứu nào có hơn 50 người ⇒ quy mô nhỏ." },
          { q: "“Nor did he work alone.” — Câu đảo ngữ này nghĩa là:", options: ["Ông ấy cũng không làm việc.", "Ông ấy làm việc một mình.", "Chỉ mình ông ấy làm việc.", "Ông ấy cũng không làm việc một mình."], correct: 3, why: "Nor + trợ động từ + S + V = “và cũng không…”. Đảo ngữ sẽ học kỹ ở Ngày 7; lúc đọc chỉ cần hiểu là phủ định thêm một ý." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Paraphrase mức 3–4: đề nói lại bài đọc thế nào ở Passage 3" },
      {
        t: "table",
        head: ["Mức", "Cách đổi", "Bài đọc viết", "Câu hỏi viết"],
        rows: [
          ["1 (ôn)", "Từ đồng nghĩa", "a **durable** myth", "a **long-lasting** myth"],
          ["2 (ôn)", "Đổi loại từ", "ideas **ripen** within a community", "the **maturing** of ideas within a group"],
          ["3", "Đổi cấu trúc cả câu (chủ động ↔ bị động, khẳng định ↔ phủ định kép, nguyên nhân ↔ kết quả)", "Such coincidences are **not rare** curiosities.", "Simultaneous discoveries happen **frequently**."],
          ["3", "Từ cụ thể ↔ từ khái quát", "shared instruments, technicians, data archives", "**facilities** that researchers use in common"],
          ["4 ★", "Ẩn ý: bài không nói thẳng, phải suy từ thái độ / hình ảnh", "like crediting a cathedral to whoever laid the final stone", "It is **misleading** to give all the credit to the last contributor."],
          ["4 ★", "Gộp ý của hai câu / hai đoạn", "(đoạn nêu luật sáng chế) + (đoạn nêu giải thưởng)", "**Official systems of recognition** favour individuals."],
        ],
        caption: "Mức 1–2 đủ cho Passage 1. Passage 3 sống bằng mức 3–4. Ngày 3 sẽ luyện riêng paraphrase ẩn ý.",
      },
      {
        t: "note",
        title: "⚠️ Bẫy paraphrase ở Passage 3",
        items: [
          "Phương án ==chép nguyên từ== trong bài thường SAI (từ đúng nhưng ghép với ý khác). Phương án đúng thường không có từ nào trùng.",
          "Phủ định kép: not uncommon = common; not rare = frequent; hardly any = almost none; it is difficult to deny = it is true.",
          "Từ giảm nhẹ đổi nghĩa cả câu: **may**, **some**, **partly**, **tend to**, **not necessarily**. Bài nói “may discourage” mà câu hỏi nói “discourages all” ⇒ NO / sai.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Luyện trọn bài — Questions 1–13 (20 phút)" },
      {
        t: "p",
        text: "Bấm giờ ==20 phút==. 3 phút đầu: vẽ bản đồ lập luận — ghi một nhãn cho mỗi đoạn A–H ra giấy. Sau đó làm ba nhóm câu. Không tra từ. Làm xong mới xem giải thích ở mục 8 và bản đồ mẫu ở mục 9.",
      },
      {
        t: "passage",
        title: "The Myth of the Lone Genius",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "Ask most people how the electric light came into being and they will name one man. The story is so familiar that it hardly seems to need telling: a solitary inventor, a flash of insight, a world transformed. Much the same tale is told of the telephone, of the theory of evolution, of the personal computer. Historians of science and technology, however, have spent the better part of a century dismantling this picture, and what they have put in its place is at once less romantic and considerably more interesting." },
          { label: "B", text: "The first difficulty with the lone-genius account is how often the same breakthrough has occurred to several people at once. Calculus was worked out separately by Newton and Leibniz; the principle of natural selection was reached by Darwin and, quite independently, by Alfred Russel Wallace; two rival filings describing a telephone reached the patent office in Washington on the very same day in 1876. Such coincidences are not rare curiosities. As early as 1922, two American sociologists compiled a list of almost 150 of them, and later scholars have added many more. If discovery depended on the unrepeatable brilliance of one mind, these ‘multiples’, as they came to be known, would be close to miraculous. That they are commonplace suggests that ideas ripen within a community, and that when the necessary knowledge and tools are in place, someone — often several people — will take the next step." },
          { label: "C", text: "A second difficulty concerns what inventors actually do. The incandescent lamp usually credited to Thomas Edison was not conjured out of nothing in 1879: more than twenty earlier experimenters had produced electric lamps of one kind or another, and in Britain Joseph Swan was demonstrating a working bulb at much the same time. What Edison contributed was not the idea but a filament that lasted long enough to be commercially useful, together with the generators, wiring and meters without which no bulb could be sold. Nor did he work alone. His laboratory at Menlo Park employed dozens of machinists, chemists and mathematicians, whose experiments ran into the thousands. To describe the outcome as one man's invention is rather like crediting a cathedral to whoever laid the final stone." },
          { label: "D", text: "Why, then, has the myth proved so durable? Part of the answer is simply that stories need protagonists. A narrative with a single hero is easier to tell, to teach and to remember than an account of gradual improvement distributed among hundreds of hands, and school textbooks, which must compress centuries into a few pages, have little room for anything else. Nineteenth-century journalists, hungry for copy, were happy to supply such heroes, and some inventors — Edison prominent among them — proved remarkably skilled at cultivating their own legend." },
          { label: "E", text: "Institutions have reinforced the habit. Patent law must name an inventor, and must draw a sharp line between the applicant who was first and everyone who was not, however narrow the margin. The most celebrated scientific prizes may be divided among no more than three people, even when the work being honoured was carried out by teams numbering in the hundreds. Such rules were adopted for the sake of administrative convenience rather than to make any point about the nature of creativity; nevertheless, they quietly teach the public that knowledge advances by individual leaps." },
          { label: "F", text: "It would be a mistake, however, to swing to the opposite extreme and conclude that individuals do not matter at all. The claim that every discovery was ‘in the air’, and would have been made regardless, is easy to assert and almost impossible to test, since history cannot be rerun. Timing, moreover, is not a trivial detail: an insight that arrives twenty years sooner may alter the lives of a generation. And there remain cases — some would cite Einstein's general theory of relativity — in which it is hard to identify any rival who was close. The more defensible position is that exceptional individuals accelerate and shape developments that are nonetheless collective in origin. Genius, on this view, is real but never self-sufficient." },
          { label: "G", text: "Recent evidence about how research is now conducted points the same way. An analysis of almost twenty million papers published over five decades found that in science, engineering and the social sciences alike, work by teams had steadily gained ground on work by individuals, and that team-written papers were more likely than solo efforts to be heavily cited. As the stock of knowledge grows, the training needed to reach the frontier lengthens and specialisation deepens, so that few problems of any significance can now be solved by one person." },
          { label: "H", text: "None of this would matter much if the myth were merely a harmless simplification. It is not. Young people who believe that discovery belongs to the naturally gifted may decide early that they are not ‘that sort of person’, and there is some evidence that this belief discourages girls in particular. Funding bodies, too, may back celebrated names rather than the unglamorous infrastructure — shared instruments, technicians, data archives — on which progress in fact depends. And when credit is concentrated on one figure, the contributions of assistants, rivals and predecessors disappear from the record. A more accurate history would not diminish the achievements of Newton or Edison. It would simply restore the crowd that was standing behind them all along." },
        ],
      },
      {
        t: "p",
        text: "**Questions 1–6.** Do the following statements agree with the claims of the writer in the reading passage? Choose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, **NOT GIVEN** if it is impossible to say what the writer thinks about this.",
      },
      {
        t: "mcq",
        id: "t4d1-doc-ynng",
        title: "Questions 1–6 — YES / NO / NOT GIVEN",
        items: [
          { q: "1. The account of invention that historians now offer is duller than the traditional one.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A, câu cuối: cái họ đặt vào thay thế “less romantic and considerably more interesting” — kém lãng mạn nhưng THÚ VỊ hơn nhiều ⇒ ngược với “duller” ⇒ NO. Bẫy: “less romantic” dễ bị đọc thành “kém hấp dẫn”." },
          { q: "2. Cases of simultaneous discovery are too common to be dismissed as chance.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “Such coincidences are not rare curiosities… would be close to miraculous. That they are commonplace suggests that ideas ripen within a community” ⇒ tác giả coi sự phổ biến ấy là bằng chứng, không phải ngẫu nhiên ⇒ YES. Paraphrase mức 3: not rare / commonplace → too common." },
          { q: "3. Edison's lamp was of better quality than the one demonstrated by Swan.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói Swan trình diễn một bóng đèn chạy được “at much the same time” và Edison đóng góp dây tóc bền + cả hệ thống. Không có câu nào SO SÁNH chất lượng hai bóng đèn ⇒ NOT GIVEN." },
          { q: "4. Some inventors actively helped to create their own heroic image.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D, câu cuối: “some inventors — Edison prominent among them — proved remarkably skilled at cultivating their own legend” ⇒ YES. cultivate their own legend → actively helped to create their own heroic image." },
          { q: "5. The limit on the number of people who can share a major scientific prize is likely to be raised.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn E có nêu giới hạn “no more than three people”, nhưng không nói gì về việc giới hạn ấy sẽ thay đổi ⇒ NOT GIVEN. Bẫy: có đúng chủ đề nên dễ chọn YES / NO." },
          { q: "6. It can be shown that most discoveries would have happened without the people who are credited with them.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn F: lời khẳng định ấy “is easy to assert and almost impossible to test, since history cannot be rerun” ⇒ KHÔNG thể chứng minh ⇒ ngược với “It can be shown” ⇒ NO." },
        ],
      },
      { t: "p", text: "**Questions 7–10.** Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t4d1-doc-mcq",
        title: "Questions 7–10 — Multiple choice",
        items: [
          { q: "7. The writer refers to a cathedral in paragraph C in order to", options: ["show that major projects take many years to complete.", "illustrate how misleading it is to give all the credit to the final contributor.", "compare Edison's laboratory with a religious institution.", "suggest that Edison's contribution was of no real importance."], correct: 1, why: "“To describe the outcome as one man's invention is rather like crediting a cathedral to whoever laid the final stone” — hình ảnh so sánh (mức 4, ẩn ý): gán cả công trình cho người đặt viên đá cuối là sai lệch. Phương án D sai vì đoạn C vẫn nêu rõ đóng góp thật của Edison (dây tóc bền, hệ thống)." },
          { q: "8. According to paragraph D, the main reason the myth has lasted is that", options: ["a story built around one hero is simpler to tell and recall.", "inventors refused to share credit with their assistants.", "historians lacked access to the relevant records.", "newspapers were paid to promote particular inventors."], correct: 0, why: "“stories need protagonists. A narrative with a single hero is easier to tell, to teach and to remember…” ⇒ phương án A. Phương án D bẫy: báo chí “hungry for copy” (cần bài để đăng), không phải được trả tiền." },
          { q: "9. Which of the following best summarises the writer's position in paragraph F?", options: ["Individuals are merely lucky to be present when a discovery becomes possible.", "The claim that discoveries are ‘in the air’ has now been proved.", "Outstanding individuals influence the speed and direction of progress that is essentially shared.", "The case of relativity shows that most discoveries depend on a single mind."], correct: 2, why: "“The more defensible position is that exceptional individuals accelerate and shape developments that are nonetheless collective in origin.” accelerate and shape → influence the speed and direction; collective in origin → essentially shared. Phương án B ngược (almost impossible to test); D nói quá (“there remain cases” = chỉ vài trường hợp)." },
          { q: "10. What does the writer say about the study described in paragraph G?", options: ["It proves that papers by single authors are no longer published.", "It shows that researchers now need less training than in the past.", "It suggests that specialisation has lowered the quality of research.", "It indicates that collaborative work has become both more common and more influential."], correct: 3, why: "“work by teams had steadily gained ground on work by individuals” (more common) + “team-written papers were more likely … to be heavily cited” (more influential) ⇒ phương án D. Phương án A nói quá; B ngược (training lengthens); C không có trong bài." },
        ],
      },
      {
        t: "p",
        text: "**Questions 11–13.** Complete the summary using the list of words and phrases, **A–G**, below. Gõ MỘT chữ cái cho mỗi câu.",
      },
      {
        t: "table",
        head: ["Why the myth matters"],
        rows: [
          ["The writer insists that the myth has practical consequences. Students who assume that discoverers are born with **11** ______ may give up on science, and girls seem especially likely to do so. Organisations that distribute research money may favour well-known individuals and neglect the **12** ______ that researchers use in common. In addition, concentrating credit on a single person means that the **13** ______ of many others are forgotten."],
          ["**A** legal protection · **B** contributions · **C** publicity · **D** natural talent · **E** prizes · **F** shared facilities · **G** competition"],
        ],
      },
      {
        t: "quiz",
        id: "t4d1-doc-summary",
        kind: "fill",
        title: "Questions 11–13 — Summary completion (gõ chữ cái A–G)",
        items: [
          { q: "11. ______", answers: ["D", "d"] },
          { q: "12. ______", answers: ["F", "f"] },
          { q: "13. ______", answers: ["B", "b"] },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Giải thích đáp án và bảng paraphrase của cả bài" },
      {
        t: "note",
        title: "Giải thích 11–13 (đáp án D · F · B) — cả ba nằm ở đoạn H",
        items: [
          "Tiêu đề summary “Why the myth matters” + nhãn HỆ QUẢ của đoạn H ⇒ chỉ cần đọc đoạn H.",
          "**11 — D natural talent:** “Young people who believe that discovery belongs to **the naturally gifted** may decide early that they are not ‘that sort of person’”. Đổi loại từ (mức 2): naturally gifted → born with natural talent.",
          "**12 — F shared facilities:** “Funding bodies… may back celebrated names rather than the unglamorous **infrastructure — shared instruments, technicians, data archives**”. Cụ thể → khái quát (mức 3). E prizes là bẫy: prizes ở đoạn E, không phải thứ bị bỏ quên.",
          "**13 — B contributions:** “the **contributions** of assistants, rivals and predecessors disappear from the record”. disappear from the record → are forgotten. G competition bẫy vì có chữ rivals.",
          "Về ngữ pháp: sau **13** là “of many others **are** forgotten” ⇒ cần danh từ số nhiều ⇒ loại ngay A, C, D, G. Dùng ngữ pháp để loại trước, rồi mới đọc.",
        ],
      },
      {
        t: "table",
        head: ["Câu", "Bài đọc viết", "Câu hỏi viết", "Mức"],
        rows: [
          ["1", "less romantic and considerably more interesting", "duller (✗)", "3 — trái nghĩa"],
          ["2", "not rare curiosities · commonplace", "too common to be dismissed as chance", "3 — phủ định kép"],
          ["4", "skilled at cultivating their own legend", "actively helped to create their own heroic image", "2–3"],
          ["6", "almost impossible to test", "It can be shown (✗)", "3 — trái nghĩa"],
          ["7", "like crediting a cathedral to whoever laid the final stone", "misleading to give all the credit to the final contributor", "4 — ẩn ý"],
          ["8", "easier to tell, to teach and to remember", "simpler to tell and recall", "1"],
          ["9", "accelerate and shape developments … collective in origin", "influence the speed and direction of progress that is essentially shared", "2–3"],
          ["10", "gained ground on work by individuals · heavily cited", "more common · more influential", "3"],
          ["12", "infrastructure — shared instruments, technicians, data archives", "shared facilities … that researchers use in common", "3 — cụ thể → khái quát"],
        ],
        caption: "Chép 5 dòng bạn thấy khó nhất vào Sổ paraphrase (Tập 3 Ngày 1).",
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bản đồ lập luận của bài vừa đọc — so với bản bạn vẽ" },
      {
        t: "table",
        head: ["Đoạn", "Nhãn", "Từ tín hiệu", "Ý trong 1 dòng"],
        rows: [
          ["A", "QUEN → BÁC", "Ask most people… · however · dismantling this picture", "Ai cũng tin chuyện “một thiên tài”; sử gia đã tháo dỡ nó"],
          ["B", "B.CHỨNG 1", "The first difficulty", "Nhiều người cùng phát minh một thứ cùng lúc (multiples)"],
          ["C", "B.CHỨNG 2", "A second difficulty", "Edison cải tiến + xây hệ thống, và có cả một phòng thí nghiệm"],
          ["D", "VÌ SAO (1)", "Why, then…? · Part of the answer", "Chuyện có một nhân vật chính thì dễ kể, dễ nhớ"],
          ["E", "VÌ SAO (2)", "Institutions have reinforced", "Luật sáng chế và giải thưởng chỉ ghi tên vài người"],
          ["F", "DÈ DẶT → LẬP TRƯỜNG", "It would be a mistake, however · The more defensible position", "Cá nhân vẫn quan trọng: đẩy nhanh và định hướng tiến bộ chung"],
          ["G", "B.CHỨNG (hiện nay)", "Recent evidence… points the same way", "Nghiên cứu ngày nay chủ yếu do nhóm làm"],
          ["H", "HỆ QUẢ", "None of this would matter much if…", "Huyền thoại gây hại thật: học sinh nản, tiền cấp lệch, người đóng góp bị quên"],
        ],
        caption: "6 câu Y/N/NG đi đúng thứ tự A → F. Câu 7–10 mỗi câu một đoạn (C, D, F, G). Summary nằm trọn ở H. Có bản đồ thì không phải đọc lại cả bài.",
      },

      /* ── 10 ── */
      { t: "h", text: "10. Từ vựng hữu ích từ bài đọc" },
      {
        t: "vocab",
        items: [
          { w: "dismantle", pos: "v", ipa: "/dɪsˈmæntl/", vi: "tháo dỡ; bác bỏ từng phần (một lý thuyết)", ex: "Historians have spent decades trying to dismantle this myth.", exVi: "Các sử gia đã mất hàng chục năm để tháo dỡ huyền thoại này.", more: "**dismantle** a myth / a system / a barrier · trái nghĩa: assemble, build up" },
          { w: "solitary", pos: "adj", ipa: "/ˈsɒlətri/", vi: "đơn độc, một mình", ex: "Writing is often seen as a solitary activity.", exVi: "Viết lách thường được xem là một hoạt động đơn độc.", more: "a **solitary** figure / life / walk · solitude (n) · khác lonely (cô đơn, buồn)" },
          { w: "commonplace", pos: "adj", ipa: "/ˈkɒmənpleɪs/", vi: "rất phổ biến, thường thấy", ex: "Working from home has become commonplace.", exVi: "Làm việc ở nhà đã trở nên rất phổ biến.", more: "become **commonplace** · = widespread, common · đứng sau be / become, ít đứng trước danh từ" },
          { w: "durable", pos: "adj", ipa: "/ˈdjʊərəbl/", vi: "bền, tồn tại lâu", ex: "The idea has proved remarkably durable.", exVi: "Ý tưởng ấy hoá ra bền bỉ đến lạ.", more: "**durable** goods / materials / peace · durability (n) · prove **durable**" },
          { w: "protagonist", pos: "n", ipa: "/prəˈtæɡənɪst/", vi: "nhân vật chính", ex: "Every good story needs a strong protagonist.", exVi: "Mọi câu chuyện hay đều cần một nhân vật chính mạnh.", more: "the **protagonist** of a novel / film · dùng được ở Speaking Part 2 (kể về sách, phim)" },
          { w: "cultivate", pos: "v", ipa: "/ˈkʌltɪveɪt/", vi: "vun đắp, gây dựng (hình ảnh, quan hệ); canh tác", ex: "The company has cultivated an image of reliability.", exVi: "Công ty đã gây dựng hình ảnh đáng tin cậy.", more: "**cultivate** an image / a reputation / a relationship / a habit · cultivation (n)" },
          { w: "reinforce", pos: "v", ipa: "/ˌriːɪnˈfɔːs/", vi: "củng cố, làm mạnh thêm", ex: "Advertising often reinforces gender stereotypes.", exVi: "Quảng cáo thường củng cố định kiến giới.", more: "**reinforce** a belief / a stereotype / a message / the idea that… · reinforcement (n)" },
          { w: "defensible", pos: "adj", ipa: "/dɪˈfensəbl/", vi: "có thể bảo vệ được (về lý lẽ), có cơ sở", ex: "This is the only defensible position on the issue.", exVi: "Đây là lập trường duy nhất có cơ sở về vấn đề này.", more: "a **defensible** position / argument · trái nghĩa: indefensible · defend (v), defence (n)" },
          { w: "accelerate", pos: "v", ipa: "/əkˈseləreɪt/", vi: "đẩy nhanh, làm tăng tốc", ex: "Government funding can accelerate the development of new vaccines.", exVi: "Tiền tài trợ của nhà nước có thể đẩy nhanh việc phát triển vắc-xin mới.", more: "**accelerate** the pace of change / growth / the process · acceleration (n) · trái nghĩa: slow down, hold back" },
          { w: "diminish", pos: "v", ipa: "/dɪˈmɪnɪʃ/", vi: "làm giảm, làm lu mờ; giảm đi", ex: "This does not diminish the importance of her work.", exVi: "Điều này không làm giảm tầm quan trọng của công trình của bà.", more: "**diminish** the importance / value / risk of · **diminishing** returns · = reduce, lessen" },
        ],
      },
      {
        t: "note",
        title: "💡 Nhìn lại cả bài — rút kinh nghiệm",
        items: [
          "Chấm: đúng ≥ 9/13 trong 20 phút = đạt mốc band 7 cho Passage 3. Đúng 6–8 ⇒ đọc lại mục 2–3 và vẽ lại bản đồ cho bài này. Dưới 6 ⇒ ôn Tập 3 Ngày 1 (paraphrase 4 mức) và Tập 3 Ngày 23 (Y/N/NG) trước khi sang Ngày 3.",
          "So với Passage 3 của Đề 6: hôm nay bạn có đủ giờ hơn không? Nếu có, lý do là ==bản đồ lập luận== — hãy dùng nó ở mọi Passage 3 từ nay.",
          "Câu sai thuộc loại nào: (a) không tìm ra chỗ trong bài, (b) tìm ra nhưng hiểu sai câu dài, (c) không nhận ra paraphrase, (d) nhầm NO với NOT GIVEN. Ghi mã (a)–(d) vào Sổ lỗi.",
          "Bài này dùng các cụm danh từ của bài Ngữ pháp: **the** principle **of natural selection**, **the** unrepeatable brilliance **of one mind**, **the** claim **that** every discovery was ‘in the air’. Tìm thêm 3 cụm nữa và nói vì sao dùng the.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t4d1-nghe",
    kind: "listening",
    title: "Nghe Part 1 “quá dễ để sai”: chính tả, số nhiều, lời sửa — 10/10 và 2 phút kiểm",
    goal: "Làm đúng 10/10 câu Form completion của một bài Part 1 tốc độ tự nhiên: nghe ra -s số nhiều, viết đúng chính tả từ thường gặp, không sập bẫy sửa lời, và soát lại bằng bảng 8 dòng trong 2 phút; đọc được câu dài đúng nhịp.",
    minutes: 65,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy band nào",
        items: [
          "Band 7 Listening = **30/40**. Part 3 và Part 4 khó, bạn sẽ rơi vài câu ở đó — nên **Part 1 phải 10/10**. Mỗi câu Part 1 mất oan là một câu Part 4 phải gánh.",
          "Ở band 6.5 bạn ==nghe hiểu hết== Part 1. Bạn mất điểm vì **viết**: thiếu -s số nhiều, sai chính tả từ quen (accommodation, Wednesday), ghi con số đầu tiên rồi người nói sửa lại.",
          "Hôm nay: 6 kiểu mất điểm oan · cách nghe và ==đoán== số nhiều từ ngữ pháp của tờ form (nối bài Ngữ pháp: danh từ đếm được số ít không đứng trần) · 30 từ hay sai chính tả · một bài Part 1 đủ 10 câu.",
          "**2 phút kiểm** (thi trên máy): bảng 8 dòng soát — bản nâng từ 6 dòng của Tập 3 Ngày 1.",
          "🔊 Phát âm: **nhịp (rhythm) của câu dài** — tiếng Anh nhấn từ mang nghĩa, lướt từ chức năng. Hiểu nhịp thì cũng nghe -s và mạo từ rõ hơn.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao người band 6.5 vẫn mất 2–3 câu ở Part 1" },
      {
        t: "table",
        head: ["Mục tiêu band 7 (30/40)", "Part 1", "Part 2", "Part 3", "Part 4"],
        rows: [
          ["Số câu đúng nên đạt", "==10==", "8", "6–7", "6–7"],
          ["Nếu Part 1 chỉ 7/10", "7", "8", "phải 7–8", "phải 7–8 ⇒ rất khó"],
        ],
        caption: "Ba điểm ở Part 1 là ba điểm rẻ nhất của cả đề. Mở lại Đề 6: Part 1 của bạn đúng mấy câu? Câu sai là do NGHE hay do VIẾT?",
      },
      {
        t: "table",
        head: ["Kiểu mất điểm oan", "Ví dụ", "Cách chặn"],
        rows: [
          ["① Thiếu / thừa **-s**", "Băng: “twelve display boards” → viết ~~board~~", "Đọc ngữ pháp quanh ô trống TRƯỚC khi nghe (mục 2)"],
          ["② Chính tả từ quen", "~~accomodation~~ · ~~Wensday~~ · ~~recieve~~", "Học 30 từ ở mục 3; gõ chậm, soát lại"],
          ["③ Tên riêng đánh vần", "Đoán Priestly khi người nói đánh vần P-R-I-E-S-T-L-E-Y", "Chờ đánh vần xong; chú ý double, cặp E-I / I-E, chữ câm"],
          ["④ Lời sửa (self-correction)", "“Friday the fourteenth… actually, let's say the fifteenth”", "Chưa ghi chắc cho tới khi hai người CHỐT (Fine / OK / it is)"],
          ["⑤ Hai, ba con số cùng loại", "“sixty members… about seventy came… plan for eighty”", "Đọc nhãn ô: hỏi con số NÀO (dự kiến? năm ngoái? thành viên?)"],
          ["⑥ Dạng từ / vượt giới hạn từ", "Tên chính thức “Photographic Society” nhưng viết ~~photography~~; viết 3 từ khi đề cho ONE WORD", "Chép ĐÚNG từ nghe được; đếm lại số từ"],
        ],
        caption: "Sáu kiểu này không cần giỏi nghe hơn — chỉ cần kỷ luật hơn.",
      },
      {
        t: "note",
        title: "📌 Luật chấm cần thuộc",
        items: [
          "Sai chính tả = **sai cả câu**. Thiếu -s khi băng nói số nhiều = sai. Thừa -s cũng sai.",
          "Viết hoa hay viết thường đều được (thi máy: gõ thường cho nhanh). Số có thể viết bằng chữ số: 245, 9.30, 15 March.",
          "Ngày tháng: 15 March = March 15 = 15th March — đều đúng và tính là MỘT số + MỘT từ.",
          "“ONE WORD AND/OR A NUMBER” ⇒ tối đa một từ + một số. Mạo từ a / the cũng là một từ ⇒ đừng viết.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Số nhiều: nghe bằng tai VÀ đoán bằng ngữ pháp" },
      {
        t: "p",
        text: "Âm **-s** cuối từ rất nhẹ, lại hay dính vào từ sau. Đừng chỉ trông vào tai. Tờ form cho bạn manh mối ngữ pháp: bài Ngữ pháp hôm nay nói ==danh từ đếm được số ít không đứng trần==. Vậy nếu trước ô trống **không** có a / an / the / one, và danh từ là thứ đếm được, thì gần như chắc chắn nó ở **số nhiều**.",
      },
      {
        t: "table",
        head: ["Trên form trước ô trống có…", "Đáp án sẽ là", "Ví dụ"],
        rows: [
          ["**a / an / one / each / every**", "số ÍT", "a packed ______ → lunch"],
          ["Số ≥ 2 · **some / several / all / both / many**", "số NHIỀU", "twelve display ______ → boards"],
          ["Không có gì + danh từ đếm được", "số NHIỀU (hoặc không đếm được)", "Bring: ______ → towels · gloves"],
          ["Động từ **are / were / have** sau ô", "số NHIỀU", "______ are provided → lockers"],
          ["Động từ **is / was / has** sau ô", "số ÍT hoặc không đếm được", "______ is included → breakfast · equipment"],
          ["Danh từ làm tính từ (trước một danh từ khác)", "số ÍT", "______ park → car · ______ fee → exam"],
        ],
        caption: "45 giây đọc form: khoanh a / an / số / are / is quanh mỗi ô trống.",
      },
      {
        t: "table",
        head: ["Âm cuối danh từ", "-s đọc là", "Ví dụ", "Nghe thế nào trong câu"],
        rows: [
          ["/p t k f θ/ (vô thanh)", "/s/", "**tickets**, **maps**, **books**, **photographs**", "tickets‿are: /s/ dính sang nguyên âm sau: “ticket-sare”"],
          ["Nguyên âm và phụ âm hữu thanh", "/z/", "**boards** /bɔːdz/, **towels**, **chairs**, **gloves**", "boards‿and: nghe như “board-zand”"],
          ["/s z ʃ ʒ tʃ dʒ/", "/ɪz/ (thêm một âm tiết)", "**boxes**, **classes**, **badges**, **passes**", "Dễ nghe nhất: từ dài thêm một nhịp"],
        ],
        caption: "Khi -s đứng trước một từ bắt đầu bằng /s/ (chairs‿supplied) thì hai âm nhập làm một — lúc đó chỉ còn ngữ pháp cứu bạn.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với số nhiều khi nghe",
        items: [
          "Tiếng Việt không có âm cuối /s/, /z/ nên tai ta ==tự bỏ== chúng. Hãy nghe có chủ đích: mỗi lần gặp danh từ, hỏi “có /s/ hay /z/ không?”.",
          "Thêm -s vào danh từ không đếm được vì thấy “nhiều”: ~~equipments~~, ~~furnitures~~, ~~informations~~, ~~accommodations~~, ~~luggages~~ — luôn không -s.",
          "Danh từ luôn số nhiều: **clothes**, **scissors**, **glasses** (kính), **trousers**, **headphones**, **stairs**, **goods**, **savings**.",
          "Số nhiều bất quy tắc: **children**, **women** /ˈwɪmɪn/, **men**, **feet**, **teeth**, **people**; **shelves**, **knives**, **leaves**, **lives**; **batteries**, **families**, **ferries**; **potatoes**, **tomatoes**; **photos**, **pianos**.",
          "Người nói liệt kê cả số ít và số nhiều (“a projector… the speakers”): chép đúng dạng của TỪNG thứ, đừng đồng loạt thêm -s.",
        ],
      },
      { t: "rule", formula: "Trước ô trống: a / an / one ⇒ N số ít · số ≥ 2 / some / all / không có gì ⇒ N + s", vi: "Đoán dạng từ trước khi nghe; lúc nghe chỉ cần xác nhận âm /s/ · /z/ · /ɪz/." },
      {
        t: "p",
        text: "**Luyện ngắn — Practice 1.** Sáu câu ngắn, sáu người nói. Đọc sáu dòng ghi chú trước (20 giây), đoán số ít hay số nhiều, rồi nghe **một lần**. Mỗi ô ONE WORD ONLY.",
      },
      {
        t: "listen",
        id: "t4d1-nghe-so-nhieu",
        title: "Six short extracts — singular or plural?",
        dan: { so: "Day 1, Practice 1", boiCanh: "six short extracts in which different speakers explain what is provided and what people need to bring.", cau: [1, 6] },
        note: "Sáu câu ngắn, giọng Anh – Mỹ – Úc – Canada xen kẽ. Nghe một lần, viết đáp án, rồi mới mở lời thoại.",
        lines: [
          { who: "Speaker 1", voice: "uk-nu", text: "We'll give you a locker, but you do need to bring your own towels — one for the pool and one for the showers.", vi: "Chúng tôi sẽ cấp cho bạn một tủ đồ, nhưng bạn cần mang khăn tắm của mình — một cái cho hồ bơi và một cái cho phòng tắm." },
          { who: "Speaker 2", voice: "us-nam", text: "The price includes breakfast and a packed lunch. Evening meals are extra, and you pay for those at the hotel.", vi: "Giá đã gồm bữa sáng và một suất trưa mang theo. Bữa tối tính riêng, và bạn trả ở khách sạn." },
          { who: "Speaker 3", voice: "au-nu", text: "All the tools are supplied, although we do ask everyone to wear gloves, so please buy a pair before the first session.", vi: "Mọi dụng cụ đều được cấp, tuy nhiên chúng tôi yêu cầu mọi người đeo găng tay, nên hãy mua một đôi trước buổi đầu." },
          { who: "Speaker 4", voice: "ca-nam", text: "There's a parking lot behind the building, and the spaces on the left are kept for visitors.", vi: "Có một bãi đỗ xe sau toà nhà, và các chỗ đỗ bên trái dành cho khách." },
          { who: "Speaker 5", voice: "uk-nam", text: "To register, you'll need two passport photographs and a copy of your student card.", vi: "Để đăng ký, bạn cần hai ảnh hộ chiếu và một bản sao thẻ sinh viên." },
          { who: "Speaker 6", voice: "us-nu", text: "The course fee covers the textbook — there's just the one — but it doesn't cover the exam fees.", vi: "Học phí đã gồm sách giáo khoa — chỉ có một cuốn — nhưng không gồm lệ phí thi." },
        ],
      },
      {
        t: "note",
        title: "Notes (Questions 1–6) — ONE WORD ONLY",
        items: [
          "1. Swimming pool — bring your own ______",
          "2. Price includes breakfast and a packed ______",
          "3. Workshop — everyone must wear ______",
          "4. Car park — ______ on the left are for visitors",
          "5. Registration — two passport ______",
          "6. Course fee covers the ______",
        ],
      },
      {
        t: "quiz",
        id: "t4d1-nghe-so-nhieu-dien",
        kind: "fill",
        title: "Practice 1 — ONE WORD ONLY (6 câu)",
        items: [
          { q: "1. Bring your own ______", answers: ["towels"], hint: "Không có a / an trước ô ⇒ đoán số nhiều" },
          { q: "2. Breakfast and a packed ______", answers: ["lunch"], hint: "Có “a” ⇒ số ít" },
          { q: "3. Everyone must wear ______", answers: ["gloves"], hint: "Găng tay luôn đi theo đôi" },
          { q: "4. ______ on the left are for visitors", answers: ["spaces"], hint: "Động từ are ⇒ số nhiều" },
          { q: "5. Two passport ______", answers: ["photographs", "photos"], hint: "two ⇒ số nhiều" },
          { q: "6. Course fee covers the ______", answers: ["textbook"], hint: "“there's just the one”" },
        ],
      },
      {
        t: "note",
        title: "Giải thích Practice 1 — manh mối nằm ở đâu",
        items: [
          "**1 towels:** “your own towels — one for the pool and one for the showers”: /z/ cuối towels dính vào dấu ngắt; “one… and one…” = hai cái ⇒ số nhiều.",
          "**2 lunch:** “a packed lunch” — có a. Bẫy: “evening meals” (số nhiều) đến ngay sau nhưng là thứ KHÔNG gồm trong giá.",
          "**3 gloves:** “wear gloves… buy a pair”. Bẫy: “tools” (đã được cấp, không phải thứ phải đeo).",
          "**4 spaces:** “the spaces on the left are kept for visitors”. Người Canada / Mỹ nói parking lot, form ghi car park — cùng một thứ.",
          "**5 photographs:** “two passport photographs”. Viết photos cũng đúng (cùng một từ, dạng ngắn) — nhưng ~~photoes~~ sai chính tả.",
          "**6 textbook:** “the textbook — there's just the one”. Bẫy: “exam fees” số nhiều đứng cuối câu kéo tai bạn thêm -s.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Ba mươi từ thường gặp ở Part 1 mà người band 6.5 vẫn viết sai" },
      {
        t: "table",
        head: ["Nhóm lỗi", "Viết đúng", "Mẹo nhớ"],
        rows: [
          ["Phụ âm đôi", "a**cc**o**mm**odation · a**dd**ress · co**mm**i**tt**ee · questio**nn**aire · o**cc**a**s**ion · begi**nn**ing · di**ff**erent · a**pp**ointment", "accommodation: 2 c, 2 m. occasion: 2 c, 1 s."],
          ["Chữ câm / âm bị nuốt", "We**d**nesday · Feb**r**uary · gove**rn**ment · enviro**n**ment · recei**p**t · lib**r**ary · cu**p**board · tem**per**ature · veg**e**table · bus**i**ness", "Đọc thầm theo chữ khi viết: Wed-nes-day, Feb-ru-ary."],
          ["ie / ei", "rec**ei**ve · rec**ei**pt · bel**ie**ve · n**ei**ghbour · f**ie**ld · for**ei**gn · w**ei**ght", "Sau c thường là ei (receive); neighbour, foreign, weight là ngoại lệ phải thuộc."],
          ["Nguyên âm yếu /ə/", "sep**a**rate · defin**i**tely · calend**a**r · vegetari**a**n · certific**a**te · restaur**a**nt · gramm**a**r · secret**a**ry", "separate: có “a rat” ở giữa. definitely: có chữ finite."],
          ["Đuôi dễ lẫn", "colle**ague** · guarant**ee** · licen**c**e (danh từ, Anh) · pra**c**tice (danh từ) · stat**io**nery (văn phòng phẩm) · th**eatre** (Anh) / theater (Mỹ)", "Chính tả Anh hay Mỹ đều được chấm đúng, miễn là đúng một kiểu."],
        ],
        caption: "Tháng và thứ cũng hay sai: Wednesday, Thursday, Saturday, February, August, September, December. Viết tắt (Wed, Feb) ĐƯỢC chấp nhận — nhưng viết đủ thì an toàn hơn.",
      },
      {
        t: "dictation",
        id: "t4d1-nghe-chinh-ta",
        title: "Nghe và viết đúng chính tả từ còn thiếu (8 câu)",
        items: [
          { label: "1. Type of ______ required", spell: "What type of accommodation do you require? A single room or a shared flat?", answer: "accommodation" },
          { label: "2. Appointment day", spell: "The earliest appointment I can offer is Wednesday morning at ten.", answer: "Wednesday", alt: ["wednesday", "Wed"] },
          { label: "3. Must keep the ______", spell: "Please keep your receipt, because you'll need it to collect the deposit.", answer: "receipt" },
          { label: "4. Meal preference", spell: "I've noted that two of your guests are vegetarian.", answer: "vegetarian" },
          { label: "5. Course begins in ______", spell: "The next course begins in February, on the second Monday of the month.", answer: "February", alt: ["february", "Feb"] },
          { label: "6. Complete a short ______", spell: "At the end of the visit, we ask everyone to complete a short questionnaire.", answer: "questionnaire" },
          { label: "7. Bring a medical ______", spell: "If you have been ill, you must bring a medical certificate from your doctor.", answer: "certificate" },
          { label: "8. All ______ is provided", spell: "You don't need to bring anything. All equipment is provided by the centre.", answer: "equipment" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Bài chính — Part 1, Questions 1–10 (Form completion)" },
      {
        t: "p",
        text: "Bạn có **45 giây** đọc form. Với mỗi ô, ghi cạnh nó: loại thông tin (tên? ngày? số? danh từ?) và số ít hay số nhiều. Sau đó nghe ==một lần==, gõ đáp án ngay. Hết băng, dùng đúng 2 phút soát theo bảng ở mục 5 rồi mới xem đáp án. Tốc độ băng khoảng 165 từ / phút — nhanh hơn Tập 3.",
      },
      {
        t: "note",
        title: "HARGREAVE ARTS CENTRE — Room hire enquiry (Questions 1–10) · Write ONE WORD AND/OR A NUMBER for each answer",
        items: [
          "Contact name: Daniel **1** ______",
          "Organisation: University **2** ______ Society",
          "Event: end-of-year exhibition (about 40 framed photographs)",
          "Date: Saturday **3** ______",
          "Expected number of guests: **4** ______",
          "Room: the **5** ______ Room (ground floor)",
          "Hire charge (student rate): £ **6** ______ · Deposit: £50",
          "Included in the price: twelve display **7** ______ ; chairs and tables",
          "Extra charge (£30): **8** ______",
          "Evening access: side entrance on **9** ______ Street",
          "Room must be cleared by: **10** ______ pm",
        ],
      },
      {
        t: "listen",
        id: "t4d1-nghe-bai",
        title: "Hiring a room for an exhibition",
        dan: { so: "Day 1, Recording 2 (Listening Part 1)", boiCanh: "a telephone conversation between a woman who works at an arts centre and a man who wants to hire a room for an exhibition.", cau: [1, 10] },
        note: "Khoảng 3 phút rưỡi (≈ 165 từ / phút), hai giọng: Fiona (Anh, nữ — nhân viên) và Daniel (Mỹ, nam — người thuê). Có 10 chỗ dễ mất điểm oan: họ bị đoán sai chính tả, tên gọi thường và tên chính thức, ngày bị đổi, ba con số khách, hai phòng, hai mức giá, danh từ số nhiều, một thứ số ít bên cạnh một thứ số nhiều, tên phố có chữ câm, và ba mốc giờ.",
        lines: [
          { who: "Fiona", voice: "uk-nu", text: "Good afternoon, Hargreave Arts Centre, Fiona speaking. How can I help?", vi: "Chào buổi chiều, Trung tâm Nghệ thuật Hargreave, Fiona xin nghe. Tôi giúp gì được ạ?" },
          { who: "Daniel", voice: "us-nam", text: "Oh, hi. I'm calling to ask about hiring one of your rooms for an exhibition.", vi: "À, chào chị. Tôi gọi để hỏi về việc thuê một phòng của trung tâm cho một buổi triển lãm." },
          { who: "Fiona", voice: "uk-nu", text: "Of course. I'll fill in an enquiry form as we go, if that's all right. Could I take your name?", vi: "Vâng ạ. Tôi sẽ điền phiếu yêu cầu trong lúc mình nói chuyện, nếu anh không phiền. Cho tôi xin tên anh?" },
          { who: "Daniel", voice: "us-nam", text: "Sure. It's Daniel Priestley.", vi: "Vâng. Tôi là Daniel Priestley." },
          { who: "Fiona", voice: "uk-nu", text: "Is that Priestly with L-Y at the end?", vi: "Có phải Priestly với L-Y ở cuối không ạ?" },
          { who: "Daniel", voice: "us-nam", text: "Not quite. It's P-R-I-E-S-T, and then L-E-Y.", vi: "Chưa đúng hẳn. Là P-R-I-E-S-T, rồi L-E-Y." },
          { who: "Fiona", voice: "uk-nu", text: "L-E-Y. Thank you. And are you booking as an individual, or on behalf of an organisation?", vi: "L-E-Y. Cảm ơn anh. Anh đặt với tư cách cá nhân hay thay mặt một tổ chức?" },
          { who: "Daniel", voice: "us-nam", text: "An organisation. I'm the secretary of the university photography club. Well, everyone calls it the photography club, but on paper it's the University Photographic Society, so you'd better put that.", vi: "Một tổ chức. Tôi là thư ký câu lạc bộ nhiếp ảnh của trường. À, ai cũng gọi nó là câu lạc bộ nhiếp ảnh, nhưng trên giấy tờ nó là University Photographic Society, nên chị ghi tên đó thì hơn." },
          { who: "Fiona", voice: "uk-nu", text: "Photographic Society. Fine. And what sort of event is it?", vi: "Photographic Society. Được ạ. Đó là sự kiện gì vậy?" },
          { who: "Daniel", voice: "us-nam", text: "It's our end-of-year exhibition. Members' prints, mostly, around forty framed photographs, plus an opening evening with a short speech.", vi: "Là triển lãm cuối năm của chúng tôi. Chủ yếu là ảnh in của thành viên, khoảng bốn mươi bức đã đóng khung, cùng một buổi tối khai mạc có bài phát biểu ngắn." },
          { who: "Fiona", voice: "uk-nu", text: "Lovely. And when were you hoping to hold it?", vi: "Hay quá. Anh định tổ chức khi nào?" },
          { who: "Daniel", voice: "us-nam", text: "We'd pencilled in Friday, March fourteenth.", vi: "Chúng tôi tạm tính thứ Sáu, ngày 14 tháng 3." },
          { who: "Fiona", voice: "uk-nu", text: "Let me check. I'm afraid the fourteenth is taken. There's a choir rehearsal in the main hall that night, and they use every room. The Saturday is free, though.", vi: "Để tôi xem. Tiếc là ngày 14 đã có người đặt. Tối đó có buổi tập hợp xướng ở sảnh chính, và họ dùng mọi phòng. Nhưng thứ Bảy thì trống." },
          { who: "Daniel", voice: "us-nam", text: "Saturday the fifteenth. Actually, that might suit us better. People won't be rushing over from lectures. Yes, let's say the fifteenth.", vi: "Thứ Bảy ngày 15. Thật ra như vậy có khi hợp với chúng tôi hơn. Mọi người sẽ không phải vội chạy từ giảng đường sang. Vâng, chốt ngày 15 nhé." },
          { who: "Fiona", voice: "uk-nu", text: "The fifteenth of March it is. And how many people are you expecting?", vi: "Vậy là ngày 15 tháng 3. Anh dự kiến có bao nhiêu người?" },
          { who: "Daniel", voice: "us-nam", text: "Well, we have sixty members, but they'll bring friends and family. Last year about seventy turned up, so I'd rather plan for eighty, to be safe.", vi: "Chúng tôi có sáu mươi thành viên, nhưng họ sẽ dẫn bạn bè và người nhà theo. Năm ngoái khoảng bảy mươi người tới, nên tôi muốn tính tám mươi cho chắc." },
          { who: "Fiona", voice: "uk-nu", text: "Eighty. In that case, Studio Two is too small. It only holds fifty. I'd suggest the Orchard Room. It's on the ground floor, it looks out onto the old fruit trees, hence the name, and it gets very good natural light.", vi: "Tám mươi. Vậy thì Studio Two quá nhỏ. Nó chỉ chứa được năm mươi người. Tôi gợi ý phòng Orchard. Phòng ở tầng trệt, nhìn ra vườn cây ăn quả cũ, vì thế mới có tên ấy, và có ánh sáng tự nhiên rất tốt." },
          { who: "Daniel", voice: "us-nam", text: "The Orchard Room sounds ideal. What does it cost?", vi: "Phòng Orchard nghe rất hợp. Giá bao nhiêu ạ?" },
          { who: "Fiona", voice: "uk-nu", text: "The standard evening rate is two hundred and ninety-five pounds. But registered student societies get a reduction, which brings it down to two hundred and forty-five.", vi: "Giá buổi tối thông thường là hai trăm chín mươi lăm bảng. Nhưng các hội sinh viên có đăng ký được giảm, nên còn hai trăm bốn mươi lăm." },
          { who: "Daniel", voice: "us-nam", text: "Two forty-five. That's within our budget. Is there a deposit?", vi: "Hai trăm bốn mươi lăm. Vừa ngân sách của chúng tôi. Có phải đặt cọc không?" },
          { who: "Fiona", voice: "uk-nu", text: "Yes, fifty pounds, payable when you confirm, and that comes off the total.", vi: "Có ạ, năm mươi bảng, trả khi anh xác nhận, và khoản đó được trừ vào tổng." },
          { who: "Daniel", voice: "us-nam", text: "OK. And what's included? We need something to hang the prints on.", vi: "Được. Giá đó gồm những gì? Chúng tôi cần thứ gì đó để treo ảnh." },
          { who: "Fiona", voice: "uk-nu", text: "The price includes twelve display boards. They're free-standing and two metres high. And you're welcome to use the chairs and tables that are already in the room.", vi: "Giá đã gồm mười hai tấm bảng trưng bày. Chúng tự đứng được và cao hai mét. Anh cũng cứ dùng bàn ghế có sẵn trong phòng." },
          { who: "Daniel", voice: "us-nam", text: "Twelve boards should do. What about a projector? We'd like to run a slideshow during the speeches.", vi: "Mười hai tấm chắc là đủ. Còn máy chiếu thì sao? Chúng tôi muốn chạy trình chiếu ảnh trong lúc phát biểu." },
          { who: "Fiona", voice: "uk-nu", text: "We do have one, but the projector isn't included, I'm afraid. It's thirty pounds extra. The speakers, on the other hand, are built into the room, so there's no charge for those.", vi: "Chúng tôi có, nhưng tiếc là máy chiếu không gồm trong giá. Thêm ba mươi bảng. Còn loa thì gắn sẵn trong phòng, nên không tính tiền." },
          { who: "Daniel", voice: "us-nam", text: "Fine, add the projector. Now, where do we actually come in? I've only ever used the front door on Mill Lane.", vi: "Được, chị thêm máy chiếu vào. Còn chúng tôi vào bằng lối nào? Tôi mới chỉ dùng cửa trước ở Mill Lane." },
          { who: "Fiona", voice: "uk-nu", text: "The front entrance is locked after six, so for evening events you'll need the side entrance on Wharf Street. That's W-H-A-R-F.", vi: "Cửa trước khoá sau sáu giờ, nên với sự kiện buổi tối anh cần dùng cửa bên ở phố Wharf. Đánh vần là W-H-A-R-F." },
          { who: "Daniel", voice: "us-nam", text: "Wharf, with an H. Got it.", vi: "Wharf, có chữ H. Tôi ghi rồi." },
          { who: "Fiona", voice: "uk-nu", text: "There's a bell, and the caretaker will let you in from five o'clock so you can set up.", vi: "Ở đó có chuông, và người trông coi toà nhà sẽ mở cửa cho anh từ năm giờ để anh bày biện." },
          { who: "Daniel", voice: "us-nam", text: "Great. And what time do we have to finish?", vi: "Tốt quá. Mấy giờ chúng tôi phải kết thúc?" },
          { who: "Fiona", voice: "uk-nu", text: "Your guests should leave by nine. The building closes at ten, but we ask hirers to have the room cleared and the boards put back by nine thirty, so that the caretaker can lock up.", vi: "Khách của anh nên về trước chín giờ. Toà nhà đóng cửa lúc mười giờ, nhưng chúng tôi đề nghị người thuê dọn xong phòng và xếp bảng về chỗ cũ trước chín rưỡi, để người trông coi còn khoá cửa." },
          { who: "Daniel", voice: "us-nam", text: "So everything out by half past nine. No problem.", vi: "Vậy là dọn hết trước chín rưỡi. Không vấn đề gì." },
          { who: "Fiona", voice: "uk-nu", text: "Wonderful. I'll email you the form this afternoon, and once we have the deposit, the booking is confirmed.", vi: "Tuyệt vời. Chiều nay tôi sẽ gửi phiếu cho anh qua email, và khi chúng tôi nhận được tiền cọc thì việc đặt phòng được xác nhận." },
          { who: "Daniel", voice: "us-nam", text: "Perfect. Thanks very much for your help.", vi: "Tuyệt. Cảm ơn chị rất nhiều." },
        ],
      },
      {
        t: "quiz",
        id: "t4d1-nghe-bai-dien",
        kind: "fill",
        title: "Questions 1–10 — ONE WORD AND/OR A NUMBER",
        items: [
          { q: "1. Contact name: Daniel ______", answers: ["Priestley", "priestley", "PRIESTLEY"] },
          { q: "2. University ______ Society", answers: ["Photographic", "photographic"] },
          { q: "3. Date: Saturday ______", answers: ["15 March", "15th March", "March 15", "March 15th", "15 march", "march 15", "15/3", "15/03"] },
          { q: "4. Expected number of guests: ______", answers: ["80", "eighty"] },
          { q: "5. Room: the ______ Room", answers: ["Orchard", "orchard"] },
          { q: "6. Hire charge (student rate): £ ______", answers: ["245", "£245", "two hundred and forty-five"] },
          { q: "7. Included: twelve display ______", answers: ["boards"] },
          { q: "8. Extra charge (£30): ______", answers: ["projector"] },
          { q: "9. Side entrance on ______ Street", answers: ["Wharf", "wharf"] },
          { q: "10. Room must be cleared by ______ pm", answers: ["9.30", "9:30", "nine thirty"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 1–5 — câu trong băng và bẫy",
        items: [
          "**1 Priestley:** Fiona đoán “Priestly with L-Y” → Daniel sửa “P-R-I-E-S-T, and then L-E-Y”. Bẫy ③: ghi theo lời ĐOÁN. Chú ý cặp I-E và đuôi -LEY.",
          "**2 Photographic:** “everyone calls it the photography club, but on paper it's the University **Photographic** Society, so you'd better put that”. Bẫy ⑥: từ nghe trước (photography) không vừa ô — form cần tên chính thức.",
          "**3 15 March:** “We'd pencilled in Friday, March fourteenth” → “the fourteenth is taken” → “let's say the fifteenth” → Fiona chốt “The fifteenth of March it is”. Form in sẵn chữ Saturday ⇒ không thể là ngày 14 (thứ Sáu). pencil in = tạm ghi, chưa chắc.",
          "**4 80:** ba con số: sixty **members** · about seventy **turned up last year** · “plan for **eighty**”. Nhãn ô là Expected number of guests ⇒ 80. Fiona nhắc lại “Eighty”.",
          "**5 Orchard:** “Studio Two is too small… I'd suggest the Orchard Room” → Daniel: “The Orchard Room sounds ideal”. orchard = vườn cây ăn quả (Fiona giải thích: “looks out onto the old fruit trees, hence the name”).",
        ],
      },
      {
        t: "note",
        title: "Giải thích 6–10 — câu trong băng và bẫy",
        items: [
          "**6 245:** “The standard evening rate is two hundred and ninety-five… student societies get a reduction, which brings it down to two hundred and forty-five”. Form ghi “student rate”. Đừng cộng / trừ £50 tiền cọc — cọc “comes off the total”, form đã có ô riêng.",
          "**7 boards:** “twelve display boards” — /z/ cuối. Form có “twelve” ⇒ chắc chắn số nhiều. Viết board = sai.",
          "**8 projector:** “the projector isn't included… It's thirty pounds extra. The speakers… no charge for those”. Bẫy ①⑤: speakers (số nhiều, miễn phí) đến ngay sau. projector số ít — không thêm -s.",
          "**9 Wharf:** “you'll need the side entrance on Wharf Street. That's W-H-A-R-F”. Bẫy: Mill Lane là cửa TRƯỚC (khoá sau 6 giờ). Chữ H câm; wharf = bến tàu.",
          "**10 9.30:** ba mốc giờ: guests leave **by nine** · building closes **at ten** · room cleared **by nine thirty**. Daniel nhắc lại “half past nine”. Ô hỏi “Room must be cleared by”.",
          "Đúng 10/10 ⇒ đạt. 8–9 ⇒ xem câu sai thuộc kiểu nào trong 6 kiểu ở mục 1 và ghi vào Sổ lỗi. Dưới 8 ⇒ nghe lại với lời thoại, rồi làm lại bài Tập 3 Ngày 1.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Hai phút kiểm — bảng 8 dòng soát (bản band 7)" },
      {
        t: "table",
        head: ["Dòng soát", "Hỏi gì", "Ví dụ ở bài vừa làm"],
        rows: [
          ["1. Giới hạn từ", "Có ô nào quá ONE WORD AND/OR A NUMBER?", "~~the Orchard~~ → Orchard"],
          ["2. Số nhiều ★", "Trước ô có số ≥ 2 / không có a, an? Sau ô là are?", "twelve display **boards**"],
          ["3. Số ít ★", "Trước ô có a / an / the + chỉ một thứ?", "(£30): **projector**"],
          ["4. Chính tả tên riêng", "Đã chép đúng lần đánh vần CUỐI chưa?", "Priestley · Wharf"],
          ["5. Chính tả từ thường", "Có từ nào trong danh sách 30 từ?", "(bài này không có — nhưng hãy luôn soát)"],
          ["6. Lời sửa", "Con số / ngày đã ghi là bản CUỐI chưa?", "15 March (không phải 14) · 245 (không phải 295)"],
          ["7. Đơn vị đã in sẵn", "Form có sẵn £, pm, Street? Đừng gõ lặp", "Form có sẵn £ ⇒ gõ **245** (gõ £245 vẫn đúng); đừng gõ ~~245 pounds~~ (thừa từ)"],
          ["8. Hợp nghĩa", "Đọc lại cả dòng: có hợp lý không?", "cleared by 9.30 pm (trước giờ đóng cửa 10 pm) ✓"],
        ],
        caption: "Nâng từ bảng 6 dòng của Tập 3 Ngày 1: tách số nhiều / số ít (dòng 2–3), tách tên riêng / từ thường (dòng 4–5), thêm lời sửa (dòng 6) và hợp nghĩa (dòng 8); câu bỏ trống xử lý ở mẹo ngay dưới. Mỗi dòng 15 giây.",
      },
      {
        t: "note",
        title: "💡 Mẹo khi lỡ một câu",
        items: [
          "Lỡ câu 3 thì bỏ, nhìn ngay sang nhãn của câu 4 (“Expected number of guests”) và chờ từ khoá. Đứng lại tiếc một câu là mất ba câu.",
          "Trong 2 phút kiểm, quay lại câu đã lỡ và ==đoán có cơ sở==: nhìn ngữ pháp (số ít / nhiều), loại thông tin (ngày, số). Không bao giờ để trống.",
          "Ở Part 1, người nhận thông tin (nhân viên) gần như luôn ==nhắc lại== đáp án (“Eighty.” · “L-E-Y.” · “The fifteenth of March it is.”). Lần nhắc lại là cơ hội thứ hai.",
        ],
      },
      { t: "rule", formula: "2 phút kiểm = giới hạn từ → số nhiều → số ít → tên riêng → chính tả → lời sửa → đơn vị → hợp nghĩa", vi: "Tám dòng, mỗi dòng 15 giây. Part 1 phải 10/10." },

      /* ── 6 ── */
      { t: "h", text: "6. Phát âm: nhịp (rhythm) của câu dài" },
      {
        t: "p",
        text: "Tiếng Việt đọc mỗi tiếng dài gần bằng nhau. Tiếng Anh thì khác: các **từ mang nghĩa** (content words: danh từ, động từ chính, tính từ, trạng từ, từ phủ định) được ==nhấn== và nằm cách nhau khá đều; các **từ chức năng** (function words: a, the, of, to, and, has, that, từ nối, đại từ) bị ==lướt nhanh và đọc yếu== để “nhét” vừa giữa hai nhịp. Vì thế câu dài 12 từ có thể chỉ có 5 nhịp. Đây cũng là lý do bạn khó nghe ra mạo từ và -s: chúng nằm ở phần bị lướt.",
      },
      {
        t: "table",
        head: ["Câu", "Từ được nhấn (nhịp)", "Từ bị lướt (đọc yếu)"],
        rows: [
          ["The **number** of **people** **working** from **home** has **risen** **sharply**.", "number · people · working · home · risen · sharply (6 nhịp)", "the /ðə/ · of /əv/ · from /frəm/ · has /həz/"],
          ["The **room** must be **cleared** by **half** past **nine**.", "room · cleared · half · nine (4 nhịp)", "the · must /məst/ · be /bi/ · by · past"],
          ["**One** of the **main** **reasons** for this **trend** is the **cost** of **housing**.", "One · main · reasons · trend · cost · housing (6 nhịp)", "of the /əv ðə/ · for /fə/ · this · is the · of"],
        ],
        caption: "Vỗ tay theo các từ in đậm, giữ nhịp đều; các từ còn lại phải nói đủ nhanh để kịp nhịp sau.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đọc một câu dài — 4 bước",
        steps: [
          { label: "1. Chia cụm (thought groups)", sub: "The number of people working from home / has risen sharply." },
          { label: "2. Gạch chân từ mang nghĩa", sub: "number · people · working · home · risen · sharply" },
          { label: "3. Lướt từ chức năng", sub: "of → /əv/ · from → /frəm/ · has → /həz/" },
          { label: "4. Nhấn mạnh nhất từ cuối cụm", sub: "…from **HOME** / …**SHARPly**" },
        ],
        caption: "Cụm danh từ dài của bài Ngữ pháp = một cụm hơi thở: đừng ngắt giữa danh từ chính và phần bổ nghĩa sau nó.",
      },
      {
        t: "note",
        title: "💡 Mẹo tập nhịp",
        items: [
          "Đọc chỉ các từ mang nghĩa trước, đều như gõ nhịp: NUMber – PEOple – WORking – HOME – RIsen – SHARPly. Sau đó thêm các từ nhỏ vào mà ==không làm chậm nhịp==.",
          "Đừng đọc rõ từng từ chức năng (“THE number OF people”) — nghe rất “đọc bài” và làm mất điểm P ở Speaking.",
          "Câu dài thì ngắt theo cụm nghĩa, không ngắt sau mỗi 3–4 từ. Chỗ ngắt hợp lý: sau chủ ngữ dài, trước that / which / because, trước cụm giới từ dài.",
          "Ngày 2 học tiếp: trọng âm câu mang nghĩa (nhấn từ nào thì nghĩa đổi theo). Ngày 8: chuỗi âm yếu (should have been).",
        ],
      },
      { t: "rule", formula: "Từ mang nghĩa (N, V, adj, adv, not) = NHẤN · từ chức năng (a, the, of, to, has, that) = lướt, đọc yếu", vi: "Nhịp đều rơi trên từ mang nghĩa; câu dài ngắt theo cụm nghĩa." },
      {
        t: "phatam",
        id: "t4d1-phat-am",
        title: "Luyện phát âm — nhịp của câu dài",
        note: "Mỗi câu: nghe mẫu, vỗ nhịp theo từ mang nghĩa, rồi đọc liền một hơi theo cụm. Đừng đọc rõ the / of / to / has. Bấm vào từng từ để xem từ nào thấp điểm.",
        items: [
          { text: "The number of people working from home has risen sharply.", ipa: "ðə nʌmbər əv piːpl wɜːkɪŋ frəm həʊm həz rɪzn ʃɑːpli", vi: "6 nhịp: number · people · working · home · risen · sharply" },
          { text: "The room must be cleared by half past nine.", ipa: "ðə ruːm məst bi klɪəd baɪ hɑːf pɑːst naɪn", vi: "4 nhịp: room · cleared · half · nine" },
          { text: "The price includes twelve display boards and the use of the chairs.", ipa: "ðə praɪs ɪnkluːdz twelv dɪspleɪ bɔːdz ənd ðə juːs əv ðə tʃeəz", vi: "Giữ rõ /z/ ở includes, boards, chairs" },
          { text: "There is little evidence that longer sentences reduce crime.", ipa: "ðeər ɪz lɪtl evɪdəns ðət lɒŋɡə sentənsɪz rɪdjuːs kraɪm", vi: "Ngắt nhẹ trước that; that đọc yếu /ðət/" },
          { text: "A growing number of companies allow their staff to work from home.", ipa: "ə ɡrəʊɪŋ nʌmbər əv kʌmpəniz əlaʊ ðeə stɑːf tə wɜːk frəm həʊm", vi: "Chủ ngữ dài đọc một hơi: A growing number of companies /" },
          { text: "One of the main reasons for this trend is the cost of housing.", ipa: "wʌn əv ðə meɪn riːznz fə ðɪs trend ɪz ðə kɒst əv haʊzɪŋ", vi: "6 nhịp; of the → /əv ðə/ lướt nhanh" },
          { text: "What historians have put in its place is far more interesting.", ipa: "wɒt hɪstɔːriənz həv pʊt ɪn ɪts pleɪs ɪz fɑː mɔːr ɪntrəstɪŋ", vi: "Ngắt sau place; have đọc yếu /həv/" },
          { text: "It would be a mistake to conclude that individuals do not matter.", ipa: "ɪt wʊd bi ə mɪsteɪk tə kənkluːd ðət ɪndɪvɪdʒuəlz duː nɒt mætə", vi: "Nhấn mistake · conclude · individuals · not · matter" },
        ],
      },
      {
        t: "note",
        title: "💡 Ghi vào sổ sau bài Nghe",
        items: [
          "Điểm bài chính: __ /10. Câu sai thuộc kiểu ①–⑥ nào?",
          "Ba từ trong bảng chính tả bạn viết sai (nếu có) — chép mỗi từ 5 lần.",
          "Một câu dài trong bài Viết Đề 6 của bạn: chia cụm, gạch chân từ mang nghĩa, đọc to 3 lần đúng nhịp.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t4d1-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 1",
    goal: "Tự kiểm 43 câu: mạo từ trong cụm danh từ phức, danh từ không đếm được, chia động từ theo danh từ chính, một đoạn lập luận ngắn với Yes / No / Not Given, một tin nhắn thoại kiểu Part 1 và nhịp câu dài.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (43 câu)",
        items: [
          "**I–IV (29 câu):** mạo từ · cụm danh từ · danh từ không đếm được · sửa lỗi · dịch — ôn bài Ngữ pháp.",
          "**V (5 câu):** một đoạn lập luận khoảng 190 từ, Yes / No / Not Given — ôn bài Đọc mục 2–3 · 6.",
          "**VI (5 câu):** tin nhắn thoại giọng Ireland, điền từ — ôn bài Nghe mục 2–3.",
          "**VII (4 câu):** nhịp của câu dài — ôn bài Nghe mục 6.",
          "Đạt: đúng từ 34/43 (≈ 80 %). Phần nào dưới 70 % ⇒ mở lại đúng mục ghi ở tiêu đề phần đó.",
          "Chưa làm **Đề 6** ở Online Test? Làm trước khi sang Ngày 2 — Ngày 2 sẽ dùng bài Writing Task 2 của Đề 6 để bạn tự chấm theo band 7.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 1 trước khi làm bài",
        center: "Ngày 1",
        branches: [
          { label: "Cụm danh từ", items: ["a three-year study", "the claim that…", "động từ theo N chính"] },
          { label: "Mạo từ", items: ["the + N + of + cái cụ thể", "a rise in / of 5 %", "Ø + N nói chung"] },
          { label: "Không đếm được", items: ["research · evidence · advice", "much / little / less", "a piece of / a body of"] },
          { label: "Passage 3", items: ["bản đồ lập luận 3 phút", "QUEN → BÁC → DÈ DẶT → LẬP TRƯỜNG", "17 – 20 – 23"] },
          { label: "Part 1", items: ["-s số nhiều", "lời sửa · tên đánh vần", "8 dòng soát"] },
          { label: "Nhịp", items: ["nhấn từ mang nghĩa", "lướt the / of / has", "ngắt theo cụm"] },
        ],
      },

      { t: "h", text: "I. Điền a / an / the, hoặc x nếu không cần (10 câu) — ôn Ngữ pháp mục 5 · 7" },
      {
        t: "quiz",
        id: "t4d1-bt-mao-tu",
        kind: "fill",
        title: "I. Điền a / an / the hoặc gõ x",
        items: [
          { q: "___ research suggests that people who walk to work are happier.", answers: ["x", "X", "Ø"] },
          { q: "The report recommends ___ three-year freeze on rents.", answers: ["a"] },
          { q: "___ rise of budget airlines has made foreign travel affordable.", answers: ["The", "the"] },
          { q: "She has ___ MSc in computer science.", answers: ["an"] },
          { q: "Most accidents are caused by ___ human error.", answers: ["x", "X", "Ø"] },
          { q: "___ elderly are more likely to live alone than they were in the past.", answers: ["The", "the"] },
          { q: "There was ___ increase of 8 per cent in rail fares.", answers: ["an"] },
          { q: "Crime fell sharply in ___ 2010s.", answers: ["the"] },
          { q: "Children spend less time in ___ nature than their parents did.", answers: ["x", "X", "Ø"] },
          { q: "___ vast majority of respondents opposed the plan.", answers: ["The", "the"] },
        ],
      },

      { t: "h", text: "II. Chọn đáp án đúng (8 câu) — ôn Ngữ pháp mục 3 · 4 · 6" },
      {
        t: "mcq",
        id: "t4d1-bt-chon",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "___ participants in the study were under thirty.", options: ["The most", "Most of", "Most", "Almost"], correct: 2, why: "Nói chung về người tham gia ⇒ Most + N số nhiều. Most of phải có the / these: most of the participants." },
          { q: "The government has introduced ___ to reduce plastic waste.", options: ["new legislation", "a new legislation", "new legislations", "new legislation's"], correct: 0, why: "legislation không đếm được. Đếm được thì dùng a new law." },
          { q: "The advice given by the two experts ___ contradictory.", options: ["are", "is", "were", "have been"], correct: 1, why: "Danh từ chính là advice (không đếm được) ⇒ động từ số ít. experts nằm trong phần bổ nghĩa sau." },
          { q: "She bought ___ for the new office.", options: ["some furnitures", "a furniture", "several furniture", "some furniture"], correct: 3, why: "furniture không đếm được ⇒ some furniture / a piece of furniture." },
          { q: "The company carried out ___ into customer behaviour.", options: ["a detailed research", "detailed researches", "a detailed study", "detail study"], correct: 2, why: "research không có a / -s. Muốn có a thì đổi sang study: a detailed study." },
          { q: "___ is one of the biggest challenges facing the city.", options: ["The shortage of affordable housing", "The shortage of affordable housings", "Shortage of the affordable housing", "A shortage of the affordable housings"], correct: 0, why: "the + shortage + of + Ø affordable housing (housing không đếm được, nói chung)." },
          { q: "This is ___ I have ever received.", options: ["a best advice", "the best advice", "the best advices", "best advice"], correct: 1, why: "So sánh nhất ⇒ the; advice không có -s." },
          { q: "A 20-___ building will replace the old market.", options: ["storeys", "stories", "storey's", "storey"], correct: 3, why: "Tính từ ghép có số: danh từ đo lường số ít — a 20-storey building." },
        ],
      },

      { t: "h", text: "III. Sửa lỗi (6 câu) — ôn các khung ⚠️ của bài Ngữ pháp" },
      {
        t: "quiz",
        id: "t4d1-bt-sua-loi",
        kind: "fill",
        title: "III. Mỗi câu có MỘT lỗi ở cụm trong ngoặc vuông. Viết lại cụm đó cho đúng",
        items: [
          { q: "[Many researches have] been done on this topic.", answers: ["Much research has", "A great deal of research has", "Many studies have", "much research has", "A lot of research has"], hint: "research không đếm được" },
          { q: "The city needs [a five-years plan] to deal with flooding.", answers: ["a five-year plan"], hint: "Tính từ ghép có số" },
          { q: "[The quality of teachers are] more important than class size.", answers: ["The quality of teachers is", "the quality of teachers is"], hint: "Danh từ chính: quality" },
          { q: "He gave me [an useful information] about the visa process.", answers: ["some useful information", "useful information", "a useful piece of information"], hint: "information không đếm được" },
          { q: "[Less people] are getting married before the age of 25.", answers: ["Fewer people", "fewer people"], hint: "people đếm được" },
          { q: "The idea [which] all students learn in the same way is outdated.", answers: ["that"], hint: "Mệnh đề nêu NỘI DUNG của idea" },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d1-bt-dich",
        kind: "translate",
        title: "IV. Dịch sang tiếng Anh — chú ý mạo từ và số ít / số nhiều",
        grammar: "Cụm danh từ phức + mạo từ đúng + động từ theo danh từ chính",
        items: [
          { q: "Sự gia tăng dân số đô thị đã gây áp lực lên giao thông công cộng.", answers: ["The growth of the urban population has put pressure on public transport.", "The increase in the urban population has put pressure on public transport.", "The rise in the urban population has put pressure on public transport.", "The growth of urban populations has put pressure on public transport.", "The growth in the urban population has put pressure on public transport."], hint: "The growth of the urban population · put pressure on · public transport" },
          { q: "Hầu hết người trẻ ở nước tôi muốn sống ở thành phố lớn.", answers: ["Most young people in my country want to live in big cities.", "Most young people in my country want to live in large cities.", "Most young people in my country want to live in a big city.", "Most young people in my country want to live in a large city."], hint: "Most young people (không the, không of)" },
          { q: "Thiết bị trong các trường học nông thôn thường cũ.", answers: ["The equipment in rural schools is often old.", "Equipment in rural schools is often old.", "The equipment in rural schools is often outdated.", "The equipment in rural schools is usually old.", "Equipment in rural schools is often outdated."], hint: "equipment + is" },
          { q: "Quan điểm cho rằng người cao tuổi không học được công nghệ mới là sai.", answers: ["The view that the elderly cannot learn new technology is wrong.", "The view that elderly people cannot learn new technology is wrong.", "The view that old people cannot learn new technology is wrong.", "The view that the elderly cannot learn new technology is mistaken.", "The view that older people cannot learn new technology is wrong.", "The view that the elderly can't learn new technology is wrong.", "The view that elderly people cannot learn new technology is mistaken."], hint: "The view that … is wrong · the elderly" },
          { q: "Rất nhiều bằng chứng cho thấy giấc ngủ ảnh hưởng đến trí nhớ.", answers: ["A great deal of evidence shows that sleep affects memory.", "A large body of evidence shows that sleep affects memory.", "A great deal of evidence suggests that sleep affects memory.", "A large body of evidence suggests that sleep affects memory.", "Much evidence shows that sleep affects memory.", "A growing body of evidence shows that sleep affects memory."], hint: "A great deal of evidence / A large body of evidence + shows" },
        ],
      },

      { t: "h", text: "V. Đọc — Yes / No / Not Given (5 câu · 7 phút) — ôn bài Đọc mục 2 · 3 · 6" },
      {
        t: "passage",
        title: "Is the Lecture Past Its Prime?",
        paras: [
          { label: "A", text: "It has become fashionable to declare the university lecture obsolete. Since almost any explanation can now be found online, the argument runs, gathering hundreds of students in a hall to listen to a single speaker is a poor use of everyone's time. The case is not a foolish one, but it rests on the assumption that a lecture is merely a means of delivering information — and that assumption deserves closer examination." },
          { label: "B", text: "Several studies suggest that students who attend lectures in person remember the material better than those who watch the same talk as a recording, apparently because a fixed time and place forces them to concentrate rather than skip ahead. Such findings should be treated with some caution, since not every attempt to repeat them has succeeded. Even so, they hint that a lecture may be a tool for building habits of attention as well as for passing on facts. None of this means that recorded lectures should be withdrawn; they are invaluable for revision. It does suggest, however, that abolishing the live lecture altogether would be a decision taken on the basis of convenience rather than evidence." },
        ],
      },
      {
        t: "mcq",
        id: "t4d1-bt-doc",
        title: "V. Do the statements agree with the claims of the writer? YES / NO / NOT GIVEN",
        items: [
          { q: "1. The writer regards the argument against lectures as unreasonable.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn A: “The case is **not a foolish one**” — lập luận ấy không ngớ ngẩn ⇒ ngược với “unreasonable” ⇒ NO. Đây là bước DÈ DẶT: tác giả công nhận phía bên kia trước khi phản bác." },
          { q: "2. Attending a lecture in person encourages students to concentrate.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “a fixed time and place **forces them to concentrate** rather than skip ahead” ⇒ YES (forces → encourages là paraphrase nhẹ hơn nhưng cùng hướng)." },
          { q: "3. The studies on lecture attendance have produced the same result every time they were repeated.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "“**not every attempt to repeat them has succeeded**” ⇒ không phải lần lặp lại nào cũng ra kết quả ấy ⇒ NO." },
          { q: "4. Universities now hold fewer lectures than they did in the past.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Bài chỉ nói có người cho rằng bài giảng đã lỗi thời (“It has become fashionable to declare…”), không nói số buổi giảng tăng hay giảm so với trước ⇒ NOT GIVEN." },
          { q: "5. Abolishing live lectures completely would not be justified by the evidence.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Câu cuối: bỏ hẳn bài giảng trực tiếp sẽ là quyết định “on the basis of **convenience rather than evidence**” ⇒ không dựa trên bằng chứng ⇒ YES. Đây là LẬP TRƯỜNG của tác giả." },
        ],
      },
      {
        t: "note",
        title: "Bản đồ lập luận của đoạn văn V",
        items: [
          "**A:** QUEN (“It has become fashionable to declare…”, “the argument runs”) → DÈ DẶT + BÁC (“not a foolish one, but it rests on the assumption that…”).",
          "**B:** B.CHỨNG (“Several studies suggest…”) → DÈ DẶT (“should be treated with some caution”, “None of this means…”) → LẬP TRƯỜNG (“It does suggest, however, that…”).",
          "Chú ý cụm danh từ kiểu ⑥ của bài Ngữ pháp: **the assumption that** a lecture is merely a means of delivering information.",
        ],
      },

      { t: "h", text: "VI. Nghe — một tin nhắn thoại (5 câu) — ôn bài Nghe mục 2 · 3" },
      {
        t: "note",
        title: "Brannock Print Studio — message for Daniel Priestley · ONE WORD ONLY",
        items: [
          "1. Finished: forty caption ______",
          "2. Not ready yet: two large ______",
          "3. Collect on ______ afternoon",
          "4. Go to the ______ at the back of the building",
          "5. Bring your ______ (order number is on it)",
        ],
      },
      {
        t: "listen",
        id: "t4d1-bt-nghe",
        title: "A voicemail from Brannock Print Studio",
        dan: { so: "Day 1, Homework recording", boiCanh: "a voicemail message from a print studio about an order for an exhibition.", cau: [1, 5] },
        note: "Khoảng 50 giây, một giọng Ireland (nữ). Giọng Ireland: âm /r/ đọc rõ ở cuối từ (order, printer, poster), nguyên âm hơi khác giọng Anh — nghe một lần rồi mới mở lời thoại.",
        lines: [
          { who: "Aoife", voice: "ie-nu", text: "Hello, this is Aoife from Brannock Print Studio, with a message for Daniel Priestley. It's about the order you placed for the photography exhibition.", vi: "Xin chào, tôi là Aoife ở Brannock Print Studio, có lời nhắn cho anh Daniel Priestley. Về đơn hàng anh đặt cho triển lãm ảnh." },
          { who: "Aoife", voice: "ie-nu", text: "First, the forty caption labels are finished, and they look great. The two large posters will take a little longer, I'm afraid.", vi: "Trước hết, bốn mươi nhãn chú thích đã xong và trông rất đẹp. Còn hai tấm áp phích lớn thì tiếc là sẽ lâu hơn một chút." },
          { who: "Aoife", voice: "ie-nu", text: "We'd hoped to have everything ready by Tuesday, but the printer needs a new part, so it'll be Wednesday now. Wednesday afternoon, to be safe.", vi: "Chúng tôi đã mong xong hết vào thứ Ba, nhưng máy in cần thay một linh kiện, nên giờ sẽ là thứ Tư. Chiều thứ Tư, cho chắc." },
          { who: "Aoife", voice: "ie-nu", text: "When you come, please don't go to the main shop, because it's being repainted. Use the workshop at the back instead. There are signs from the car park.", vi: "Khi anh tới, xin đừng vào cửa hàng chính, vì nó đang được sơn lại. Thay vào đó hãy vào xưởng ở phía sau. Có biển chỉ đường từ bãi đỗ xe." },
          { who: "Aoife", voice: "ie-nu", text: "The balance to pay is thirty-eight pounds fifty. And one last thing: please bring your receipt, as we'll need the order number on it. Thanks, Daniel. Bye now.", vi: "Số tiền còn phải trả là ba mươi tám bảng năm mươi xu. Và điều cuối: anh vui lòng mang theo biên lai, vì chúng tôi cần số đơn hàng ghi trên đó. Cảm ơn anh Daniel. Chào anh." },
        ],
      },
      {
        t: "quiz",
        id: "t4d1-bt-nghe-dien",
        kind: "fill",
        title: "VI. Complete the notes — ONE WORD ONLY",
        items: [
          { q: "1. Finished: forty caption ______", answers: ["labels"] },
          { q: "2. Not ready yet: two large ______", answers: ["posters"] },
          { q: "3. Collect on ______ afternoon", answers: ["Wednesday", "wednesday", "Wed"] },
          { q: "4. Go to the ______ at the back", answers: ["workshop"] },
          { q: "5. Bring your ______", answers: ["receipt"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích đáp án VI",
        items: [
          "**1 labels · 2 posters:** trước ô có forty / two ⇒ chắc chắn số nhiều; nghe /z/ cuối. Viết label / poster = sai.",
          "**3 Wednesday:** “ready by Tuesday, but… so it'll be Wednesday now” — lời sửa. Chính tả: We-**d**-nes-day.",
          "**4 workshop:** “don't go to the main shop… Use the workshop at the back instead”. Trước ô có the + một nơi ⇒ số ít.",
          "**5 receipt:** chữ p câm, e trước i sau c. Viết ~~reciept~~ / ~~receit~~ = sai.",
        ],
      },

      { t: "h", text: "VII. Nhịp của câu dài (4 câu) — ôn bài Nghe mục 6" },
      {
        t: "mcq",
        id: "t4d1-bt-nhip",
        title: "VII. Chọn đáp án đúng",
        items: [
          { q: "Trong câu “The cost of living has risen sharply”, từ nào KHÔNG được nhấn?", options: ["cost", "living", "has", "sharply"], correct: 2, why: "has là trợ động từ (từ chức năng) ⇒ đọc yếu /həz/. cost, living, risen, sharply mang nghĩa ⇒ nhấn." },
          { q: "Trong “a number of people”, từ of thường được đọc là", options: ["/ɒv/, rõ và dài", "/əv/, yếu và nhanh", "/ɒf/", "/uːv/"], correct: 1, why: "Từ chức năng ở giữa câu đọc dạng yếu: /əv/." },
          { q: "Chỗ ngắt hơi hợp lý nhất trong câu “The measures introduced by the council last year have had little effect” là", options: ["sau “last year”", "sau “measures”", "sau “council”", "sau “have”"], correct: 0, why: "Ngắt sau cả chủ ngữ dài (danh từ chính + phần bổ nghĩa sau), trước động từ chính have had." },
          { q: "Câu “The room must be cleared by half past nine” có mấy nhịp (từ được nhấn)?", options: ["9", "6", "5", "4"], correct: 3, why: "room · cleared · half · nine. Các từ the, must, be, by, past bị lướt." },
        ],
      },
    ],
  },
];
