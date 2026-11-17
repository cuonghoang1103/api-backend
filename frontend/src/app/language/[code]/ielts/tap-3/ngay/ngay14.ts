/**
 * IELTS Tập 3 — Ngày 14 (band 5.0 → 6.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)    AWL sublist 5 (đủ 60 họ từ) + Work vòng 2: quyền lợi – điều kiện lao động, sự nghiệp (40 từ)
 *                    + 12 collocation Task 2 và 4 kiểu collocation                                   [VB5 VC03 VD3]
 *                    — nối Tập 1 Ngày 5 · 7, Tập 2 Ngày 1 (6 cụm điều kiện làm việc), Tập 2 Ngày 16 (collocation mở đầu)
 *   Bài 2 (writing)  Task 2 Advantages / disadvantages band 6: outweigh — cân hai phía; “positive or negative
 *                    development?” trọn 3 lập trường; bài mẫu band 5 vs band 6                       [W05]
 *                    — nối Tập 2 Ngày 10 (ba cách hỏi lợi – hại)
 *   Bài 3 (speaking) Part 2: Describe a public place vòng 2 (công trình vs vùng đất) + Part 3 dạng ưu – nhược
 *                    [S05 S06] — nối Tập 2 Ngày 7 · 13 · 🔊 /ɪə/ /eə/ /ʊə/
 *   Bài tập Ngày 14  44 câu có đáp án + 1 đoạn viết + 1 lượt nói
 * Mọi id bắt đầu `t3d14-`.
 */
import type { Lesson } from '../data';

export const NGAY_14: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t3d14-tu-vung",
    kind: "vocab",
    title: "Từ vựng: AWL sublist 5 + Việc làm vòng 2 (quyền lợi lao động) + collocation Task 2",
    goal: "Nhận ra và dùng đúng 60 họ từ học thuật của AWL sublist 5, 40 từ về quyền lợi – điều kiện lao động và sự nghiệp (minimum wage, sick leave, pension, redundancy, job security, self-employed…) cùng 12 cụm collocation dùng được cho mọi đề Task 2 — đẩy Lexical Resource band 6: đủ từ cho chủ đề Work, đúng từ đi kèm, đúng họ từ.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**AWL** (Academic Word List) = 570 họ từ học thuật hay gặp nhất, chia 10 sublist. Tập 2 học sublist 1–2; Tập 3 Ngày 2 · 8 học sublist 3–4; hôm nay ==sublist 5 — đủ 60 họ từ==, chia 3 nhóm 20 từ.",
          "**Work vòng 2**: Tập 1 Ngày 5 · 7 học từ về làm việc từ xa (employee, colleague, workload, overtime, burnout…), Tập 2 Ngày 1 nhập 6 cụm về điều kiện làm việc (a steady job, paid leave, the minimum wage…). Hôm nay ôn lại vài từ cũ trong ngữ cảnh mới và học ==40 từ về quyền lợi – điều kiện lao động và sự nghiệp== — nhóm từ mà đề Task 2 và Part 3 về Work luôn cần.",
          "**Collocation** = các từ **hay đi cùng nhau** (make a decision, không phải ~~do a decision~~). Tập 2 Ngày 16 đã mở đầu; hôm nay học ==4 kiểu collocation + 12 cụm dùng cho mọi đề Task 2==.",
          "Band 6 LR: “đủ rộng, dám dùng từ ít gặp dù còn sai”. Cách an toàn nhất để dùng từ ít gặp mà **không sai**: học cả cụm, không học từ lẻ.",
          "Mọi từ trong bài tự vào **Flashcards** và mục **Tra từ vựng**. Dùng nút “Che nghĩa / Che từ” để tự kiểm sau mỗi nhóm.",
          "Bài Viết và bài Nói hôm nay dùng ngay nhóm từ này: đề về **tự làm chủ**, **đổi việc nhiều lần**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. AWL sublist 5 — họ từ 1–20 (academic → equivalent)" },
      {
        t: "p",
        text: "Mỗi dòng là **một họ từ**: từ gốc + dạng khác ở dòng mở rộng. Đọc câu ví dụ thành tiếng một lần; để ý **giới từ** và **từ đi kèm** in đậm — đó là thứ làm bạn dùng đúng, không phải nghĩa tiếng Việt.",
      },
      {
        t: "vocab",
        items: [
          { w: "academic", pos: "adj, n", ipa: "/ˌækəˈdemɪk/", vi: "(thuộc) học thuật; giảng viên đại học", ex: "Academic success does not always lead to a good career.", exVi: "Thành công trong học tập không phải lúc nào cũng dẫn tới sự nghiệp tốt.", more: "**academic** performance / year / qualifications · academy (n) · academically (adv)" },
          { w: "adjust", pos: "v", ipa: "/əˈdʒʌst/", vi: "điều chỉnh; thích nghi", ex: "It takes time to adjust to a new working environment.", exVi: "Cần thời gian để thích nghi với môi trường làm việc mới.", more: "**adjust to** + N / V-ing · adjustment (n): make an **adjustment**" },
          { w: "alter", pos: "v", ipa: "/ˈɔːltə/", vi: "thay đổi (một phần)", ex: "Technology has altered the way people work.", exVi: "Công nghệ đã thay đổi cách con người làm việc.", more: "alteration (n) · alternative ≠ alter · = change (trang trọng hơn)" },
          { w: "amend", pos: "v", ipa: "/əˈmend/", vi: "sửa đổi (luật, văn bản)", ex: "The law was amended to protect part-time workers.", exVi: "Luật đã được sửa đổi để bảo vệ người làm bán thời gian.", more: "**amend** a law / contract · amendment (n)" },
          { w: "aware", pos: "adj", ipa: "/əˈweə/", vi: "nhận thức được, biết", ex: "Many employees are not aware of their legal rights.", exVi: "Nhiều người lao động không biết quyền hợp pháp của mình.", more: "be **aware of** / **that** · awareness (n): **raise awareness of** · ≠ unaware" },
          { w: "capacity", pos: "n", ipa: "/kəˈpæsəti/", vi: "sức chứa; năng lực", ex: "The factory is working at full capacity.", exVi: "Nhà máy đang chạy hết công suất.", more: "at full **capacity** · the **capacity to** + V · a **capacity of** 500 people" },
          { w: "challenge", pos: "n, v", ipa: "/ˈtʃælɪndʒ/", vi: "thách thức; thách thức, chất vấn", ex: "Finding a steady job is a major challenge for graduates.", exVi: "Tìm việc ổn định là thách thức lớn với sinh viên mới ra trường.", more: "face / pose / meet a **challenge** · challenging (adj)" },
          { w: "clause", pos: "n", ipa: "/klɔːz/", vi: "điều khoản; mệnh đề", ex: "There is a clause in the contract about overtime pay.", exVi: "Có một điều khoản trong hợp đồng về tiền làm thêm giờ.", more: "a **clause in** a contract · a relative **clause** (mệnh đề quan hệ)" },
          { w: "compound", pos: "n, adj", ipa: "/ˈkɒmpaʊnd/", vi: "hợp chất; (từ, câu) ghép", ex: "Water is a compound of hydrogen and oxygen.", exVi: "Nước là hợp chất của hydro và oxy.", more: "a chemical **compound** · a **compound** sentence / noun · v /kəmˈpaʊnd/: làm trầm trọng thêm" },
          { w: "conflict", pos: "n, v", ipa: "/ˈkɒnflɪkt/", vi: "xung đột, mâu thuẫn", ex: "Long hours often cause conflict between work and family life.", exVi: "Giờ làm dài thường gây mâu thuẫn giữa công việc và gia đình.", more: "**conflict between** A and B · come into **conflict with** · động từ nhấn sau: /kənˈflɪkt/" },
          { w: "consult", pos: "v", ipa: "/kənˈsʌlt/", vi: "hỏi ý kiến, tham vấn", ex: "Staff should be consulted before major changes are made.", exVi: "Nên hỏi ý kiến nhân viên trước khi có thay đổi lớn.", more: "**consult** sb **about** sth · consultant (n) · consultation (n)" },
          { w: "contact", pos: "n, v", ipa: "/ˈkɒntækt/", vi: "sự liên lạc, tiếp xúc; liên lạc", ex: "Remote workers have little contact with their colleagues.", exVi: "Người làm từ xa ít tiếp xúc với đồng nghiệp.", more: "have / lose **contact with** · ⚠️ động từ KHÔNG giới từ: contact ~~with~~ the manager" },
          { w: "decline", pos: "v, n", ipa: "/dɪˈklaɪn/", vi: "giảm, suy giảm; từ chối (lịch sự)", ex: "Union membership has declined steadily since the 1980s.", exVi: "Số thành viên công đoàn giảm đều từ thập niên 1980.", more: "a sharp **decline in** + N · **decline** an offer (nghĩa “từ chối” thì có tân ngữ: the offer was declined ✓) · nghĩa “giảm” là nội động từ: ~~was declined to 5 %~~ ✗" },
          { w: "discrete", pos: "adj", ipa: "/dɪˈskriːt/", vi: "riêng rẽ, tách biệt", ex: "The course is divided into six discrete units.", exVi: "Khoá học được chia thành sáu phần tách biệt.", more: "⚠️ ≠ **discreet** (kín đáo) — cùng cách đọc, khác nghĩa" },
          { w: "draft", pos: "n, v", ipa: "/drɑːft/", vi: "bản nháp; soạn nháp", ex: "Always read your first draft again before you submit it.", exVi: "Luôn đọc lại bản nháp đầu tiên trước khi nộp.", more: "a first / final **draft** · **draft** a contract / a letter" },
          { w: "enable", pos: "v", ipa: "/ɪˈneɪbl/", vi: "giúp (ai) có thể làm gì", ex: "Flexible hours enable parents to spend more time with their children.", exVi: "Giờ làm linh hoạt giúp cha mẹ có nhiều thời gian hơn với con.", more: "**enable** sb **to** + V (bắt buộc có tân ngữ) · = allow sb to" },
          { w: "energy", pos: "n", ipa: "/ˈenədʒi/", vi: "năng lượng; sức lực", ex: "Commuting for two hours a day takes a lot of energy.", exVi: "Đi làm hai tiếng mỗi ngày tốn rất nhiều sức.", more: "renewable **energy** · save / waste **energy** · energetic (adj)" },
          { w: "enforce", pos: "v", ipa: "/ɪnˈfɔːs/", vi: "thực thi (luật, quy định)", ex: "The minimum wage law is difficult to enforce in small firms.", exVi: "Luật lương tối thiểu khó thực thi ở các công ty nhỏ.", more: "**enforce** a law / rule / ban · enforcement (n): law **enforcement**" },
          { w: "entity", pos: "n", ipa: "/ˈentəti/", vi: "thực thể, tổ chức độc lập", ex: "The two companies remain separate legal entities.", exVi: "Hai công ty vẫn là hai pháp nhân riêng.", more: "a legal / separate / single **entity**" },
          { w: "equivalent", pos: "adj, n", ipa: "/ɪˈkwɪvələnt/", vi: "tương đương; vật tương đương", ex: "A year of work experience can be equivalent to a year of study.", exVi: "Một năm kinh nghiệm làm việc có thể tương đương một năm học.", more: "**equivalent to** + N · the **equivalent of** $500 · equivalence (n)" },
        ],
      },
      {
        t: "quiz",
        id: "t3d14-awl-1",
        kind: "fill",
        title: "Luyện nhóm 1 — điền từ (chia dạng nếu cần): adjust · aware · capacity · conflict · consult · decline · enable · enforce",
        items: [
          { q: "Online courses ___ people in remote areas to gain new skills.", answers: ["enable"] },
          { q: "New employees usually need a few weeks to ___ to the company's culture.", answers: ["adjust"] },
          { q: "Few young workers are ___ of how small their pension will be.", answers: ["aware"] },
          { q: "There has been a steady ___ in the number of factory jobs.", answers: ["decline"] },
          { q: "The stadium has a ___ of 40,000 people.", answers: ["capacity"] },
          { q: "The rules exist, but nobody ___ them. (hiện tại đơn)", answers: ["enforces"] },
          { q: "Residents were not ___ about the plan to close the library. (bị động)", answers: ["consulted"] },
          { q: "Working at weekends can lead to ___ between partners.", answers: ["conflict", "conflicts"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. AWL sublist 5 — họ từ 21–40 (evolve → objective)" },
      {
        t: "vocab",
        items: [
          { w: "evolve", pos: "v", ipa: "/ɪˈvɒlv/", vi: "tiến hoá, phát triển dần", ex: "The role of managers has evolved over the past twenty years.", exVi: "Vai trò của người quản lý đã thay đổi dần trong hai mươi năm qua.", more: "**evolve from** / **into** · evolution (n) · nội động từ: ~~was evolved~~ ✗" },
          { w: "expand", pos: "v", ipa: "/ɪkˈspænd/", vi: "mở rộng", ex: "The company plans to expand into three new markets.", exVi: "Công ty dự định mở rộng sang ba thị trường mới.", more: "**expand into** · expansion (n) · đã gặp ở bài Đọc Ngày 13" },
          { w: "expose", pos: "v", ipa: "/ɪkˈspəʊz/", vi: "làm lộ ra; để tiếp xúc với (thứ có hại)", ex: "Construction workers are exposed to dust and noise every day.", exVi: "Công nhân xây dựng tiếp xúc với bụi và tiếng ồn hằng ngày.", more: "be **exposed to** + N · exposure (n): **exposure to** risk" },
          { w: "external", pos: "adj", ipa: "/ɪkˈstɜːnl/", vi: "bên ngoài", ex: "Small firms often rely on external funding.", exVi: "Doanh nghiệp nhỏ thường dựa vào nguồn vốn bên ngoài.", more: "**external** factors / pressure · ≠ internal" },
          { w: "facilitate", pos: "v", ipa: "/fəˈsɪlɪteɪt/", vi: "tạo điều kiện, làm cho dễ hơn", ex: "Video calls facilitate communication between offices.", exVi: "Cuộc gọi video giúp các văn phòng liên lạc dễ hơn.", more: "**facilitate** learning / trade / discussion · facility (n): cơ sở vật chất" },
          { w: "fundamental", pos: "adj", ipa: "/ˌfʌndəˈmentl/", vi: "cơ bản, nền tảng", ex: "Fair pay is a fundamental right of every worker.", exVi: "Lương công bằng là quyền cơ bản của mọi người lao động.", more: "a **fundamental** right / change / difference · fundamentally (adv)" },
          { w: "generate", pos: "v", ipa: "/ˈdʒenəreɪt/", vi: "tạo ra (việc làm, thu nhập, điện)", ex: "Tourism generates thousands of jobs in the region.", exVi: "Du lịch tạo ra hàng nghìn việc làm trong vùng.", more: "**generate** income / jobs / electricity / ideas" },
          { w: "generation", pos: "n", ipa: "/ˌdʒenəˈreɪʃn/", vi: "thế hệ; sự tạo ra", ex: "The younger generation expects more flexibility at work.", exVi: "Thế hệ trẻ kỳ vọng sự linh hoạt hơn trong công việc.", more: "the younger / older **generation** · future **generations** · the **generation gap**" },
          { w: "image", pos: "n", ipa: "/ˈɪmɪdʒ/", vi: "hình ảnh; ấn tượng trong mắt công chúng", ex: "The scandal damaged the company's public image.", exVi: "Vụ bê bối làm tổn hại hình ảnh của công ty.", more: "public / brand **image** · improve / damage an **image**" },
          { w: "liberal", pos: "adj", ipa: "/ˈlɪbərəl/", vi: "phóng khoáng, tự do (quan điểm)", ex: "Younger managers tend to have more liberal attitudes to dress codes.", exVi: "Quản lý trẻ thường có thái độ thoáng hơn về quy định trang phục.", more: "a **liberal** attitude / society · liberate (v) · liberty (n)" },
          { w: "licence", pos: "n", ipa: "/ˈlaɪsns/", vi: "giấy phép", ex: "You need a licence to run a restaurant.", exVi: "Bạn cần giấy phép để mở nhà hàng.", more: "a driving **licence** · Anh: licence (n) – license (v); Mỹ: license cho cả hai" },
          { w: "logic", pos: "n", ipa: "/ˈlɒdʒɪk/", vi: "lô-gíc, lý lẽ", ex: "I cannot see the logic behind this decision.", exVi: "Tôi không thấy lý lẽ đằng sau quyết định này.", more: "the **logic behind** / **of** · logical (adj) ≠ illogical" },
          { w: "marginal", pos: "adj", ipa: "/ˈmɑːdʒɪnl/", vi: "nhỏ, không đáng kể", ex: "The new policy made only a marginal difference to wages.", exVi: "Chính sách mới chỉ tạo khác biệt không đáng kể về lương.", more: "a **marginal** increase / effect · họ từ AWL ghi là **margin** (n) · marginally (adv) — hay dùng ở Task 1" },
          { w: "medical", pos: "adj", ipa: "/ˈmedɪkl/", vi: "(thuộc) y tế", ex: "Some employers pay for their staff's medical care.", exVi: "Một số chủ lao động trả tiền chăm sóc y tế cho nhân viên.", more: "**medical** care / treatment / staff · medicine (n)" },
          { w: "mental", pos: "adj", ipa: "/ˈmentl/", vi: "(thuộc) tinh thần, tâm thần", ex: "Heavy workloads can harm employees' mental health.", exVi: "Khối lượng việc nặng có thể hại sức khoẻ tinh thần của nhân viên.", more: "**mental** health / illness · mentally (adv) · mentality (n): lối nghĩ" },
          { w: "modify", pos: "v", ipa: "/ˈmɒdɪfaɪ/", vi: "sửa đổi (một chút cho hợp hơn)", ex: "The office was modified to make it accessible to wheelchair users.", exVi: "Văn phòng được sửa lại để người dùng xe lăn vào được.", more: "modification (n) · genetically **modified** food" },
          { w: "monitor", pos: "v, n", ipa: "/ˈmɒnɪtə/", vi: "theo dõi, giám sát; màn hình", ex: "Some companies monitor their employees' emails.", exVi: "Một số công ty theo dõi email của nhân viên.", more: "**monitor** progress / performance · closely **monitored**" },
          { w: "network", pos: "n, v", ipa: "/ˈnetwɜːk/", vi: "mạng lưới; kết nối quan hệ", ex: "Working in an office helps young people build a professional network.", exVi: "Làm ở văn phòng giúp người trẻ xây mạng lưới quan hệ nghề nghiệp.", more: "a **network of** contacts · a social / transport **network** · networking (n)" },
          { w: "notion", pos: "n", ipa: "/ˈnəʊʃn/", vi: "quan niệm, ý niệm", ex: "The notion of a job for life has almost disappeared.", exVi: "Quan niệm về một công việc suốt đời gần như đã biến mất.", more: "the **notion of** + N · the **notion that** + mệnh đề · = idea (trang trọng)" },
          { w: "objective", pos: "n, adj", ipa: "/əbˈdʒektɪv/", vi: "mục tiêu; khách quan", ex: "The main objective of the scheme is to reduce youth unemployment.", exVi: "Mục tiêu chính của chương trình là giảm thất nghiệp ở thanh niên.", more: "achieve / set an **objective** · an **objective** view ≠ subjective" },
        ],
      },
      {
        t: "mcq",
        id: "t3d14-awl-2",
        title: "Luyện nhóm 2 — chọn từ đúng (8 câu)",
        items: [
          { q: "Nurses are ___ to infection every day.", options: ["exposed", "expanded", "evolved", "generated"], correct: 0, why: "be exposed to + thứ có hại = tiếp xúc với." },
          { q: "The new airport is expected to ___ around 5,000 jobs.", options: ["modify", "generate", "monitor", "expose"], correct: 1, why: "generate jobs = tạo việc làm." },
          { q: "Freedom of speech is a ___ right in a democratic society.", options: ["marginal", "external", "fundamental", "liberal"], correct: 2, why: "a fundamental right = quyền cơ bản." },
          { q: "There was only a ___ rise in sales, from 20.1 to 20.3 million.", options: ["mental", "medical", "logic", "marginal"], correct: 3, why: "marginal = rất nhỏ, không đáng kể." },
          { q: "The ___ that money brings happiness is widely accepted.", options: ["notion", "network", "licence", "image"], correct: 0, why: "the notion that… = quan niệm rằng…" },
          { q: "Teachers should ___ each student's progress carefully.", options: ["facilitate", "monitor", "generate", "expand"], correct: 1, why: "monitor progress = theo dõi tiến bộ." },
          { q: "Good public transport ___ movement between the suburbs and the centre.", options: ["exposes", "evolves", "facilitates", "modifies"], correct: 2, why: "facilitate = làm cho dễ dàng hơn." },
          { q: "Our main ___ this year is to cut costs by 10 %.", options: ["logic", "generation", "image", "objective"], correct: 3, why: "objective (n) = mục tiêu." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. AWL sublist 5 — họ từ 41–60 (orient → whereas)" },
      {
        t: "vocab",
        items: [
          { w: "orient", pos: "v", ipa: "/ˈɔːrient/", vi: "định hướng", ex: "The course is oriented towards students who want to start a business.", exVi: "Khoá học hướng tới sinh viên muốn khởi nghiệp.", more: "be **oriented towards** · orientation (n) · career-**oriented** · Anh-Anh còn dùng orientate" },
          { w: "perspective", pos: "n", ipa: "/pəˈspektɪv/", vi: "góc nhìn, quan điểm", ex: "From an employer's perspective, flexible contracts reduce costs.", exVi: "Từ góc nhìn của chủ lao động, hợp đồng linh hoạt giúp giảm chi phí.", more: "**from** a / an … **perspective** · a different **perspective on** + N" },
          { w: "precise", pos: "adj", ipa: "/prɪˈsaɪs/", vi: "chính xác", ex: "It is hard to give a precise figure for the number of freelancers.", exVi: "Khó đưa ra con số chính xác về số người làm tự do.", more: "a **precise** figure / definition · precisely (adv) · precision (n) /prɪˈsɪʒn/" },
          { w: "prime", pos: "adj", ipa: "/praɪm/", vi: "chính, hàng đầu", ex: "Low pay is the prime reason why nurses leave the profession.", exVi: "Lương thấp là lý do chính khiến y tá bỏ nghề.", more: "the **prime** reason / example / minister · primary (adj)" },
          { w: "psychology", pos: "n", ipa: "/saɪˈkɒlədʒi/", vi: "tâm lý học; tâm lý", ex: "She studied psychology before moving into human resources.", exVi: "Cô ấy học tâm lý học trước khi chuyển sang nhân sự.", more: "psychological (adj): **psychological** pressure · psychologist (n) · p câm" },
          { w: "pursue", pos: "v", ipa: "/pəˈsjuː/", vi: "theo đuổi", ex: "More women are pursuing careers in engineering.", exVi: "Ngày càng nhiều phụ nữ theo đuổi sự nghiệp kỹ sư.", more: "**pursue** a career / a goal / an interest · pursuit (n): in **pursuit of**" },
          { w: "ratio", pos: "n", ipa: "/ˈreɪʃiəʊ/", vi: "tỉ lệ (giữa hai nhóm)", ex: "The ratio of managers to workers is one to ten.", exVi: "Tỉ lệ quản lý trên công nhân là một trên mười.", more: "the **ratio of** A **to** B · a **ratio** of 1:10 — hay dùng ở Task 1" },
          { w: "reject", pos: "v", ipa: "/rɪˈdʒekt/", vi: "bác bỏ, từ chối", ex: "The union rejected the company's pay offer.", exVi: "Công đoàn bác bỏ đề xuất lương của công ty.", more: "**reject** an offer / idea / application · rejection (n) · ≠ accept" },
          { w: "revenue", pos: "n", ipa: "/ˈrevənjuː/", vi: "doanh thu; nguồn thu (thuế)", ex: "Income tax is the government's main source of revenue.", exVi: "Thuế thu nhập là nguồn thu chính của chính phủ.", more: "tax / advertising **revenue** · generate **revenue** · ≠ profit (lợi nhuận)" },
          { w: "stable", pos: "adj", ipa: "/ˈsteɪbl/", vi: "ổn định", ex: "Most parents want their children to have a stable income.", exVi: "Hầu hết cha mẹ muốn con có thu nhập ổn định.", more: "a **stable** job / income / economy · stability (n) · ≠ unstable · remain **stable** (Task 1)" },
          { w: "style", pos: "n", ipa: "/staɪl/", vi: "phong cách, kiểu", ex: "Her management style is relaxed but effective.", exVi: "Phong cách quản lý của cô ấy thoải mái nhưng hiệu quả.", more: "a management / teaching **style** · lifestyle · stylish (adj)" },
          { w: "substitute", pos: "n, v", ipa: "/ˈsʌbstɪtjuːt/", vi: "vật / người thay thế; thay thế", ex: "Online meetings are no substitute for face-to-face contact.", exVi: "Họp trực tuyến không thay thế được gặp mặt trực tiếp.", more: "a **substitute for** + N · **substitute** A **for** B (dùng A thay B) · substitution (n)" },
          { w: "sustain", pos: "v", ipa: "/səˈsteɪn/", vi: "duy trì", ex: "It is difficult to sustain economic growth without skilled workers.", exVi: "Khó duy trì tăng trưởng kinh tế nếu thiếu lao động có tay nghề.", more: "**sustain** growth / interest · sustainable (adj): **sustainable** development · sustainability (n)" },
          { w: "symbol", pos: "n", ipa: "/ˈsɪmbl/", vi: "biểu tượng", ex: "A company car used to be a symbol of success.", exVi: "Xe công ty cấp từng là biểu tượng của thành công.", more: "a **symbol of** + N · symbolic (adj) · symbolise (v)" },
          { w: "target", pos: "n, v", ipa: "/ˈtɑːɡɪt/", vi: "mục tiêu, chỉ tiêu; nhắm vào", ex: "Sales staff are under pressure to meet their monthly targets.", exVi: "Nhân viên bán hàng chịu áp lực đạt chỉ tiêu hằng tháng.", more: "meet / set / miss a **target** · be **targeted at** young people" },
          { w: "transit", pos: "n", ipa: "/ˈtrænzɪt/", vi: "sự vận chuyển, quá cảnh", ex: "The goods were damaged in transit.", exVi: "Hàng hoá bị hỏng trong lúc vận chuyển.", more: "**in transit** · public **transit** (Mỹ) = public transport · transition (n): sự chuyển đổi" },
          { w: "trend", pos: "n", ipa: "/trend/", vi: "xu hướng", ex: "There is a growing trend towards working from home.", exVi: "Có xu hướng ngày càng tăng là làm việc tại nhà.", more: "a **trend towards** + N / V-ing · an upward / downward **trend** · follow a **trend**" },
          { w: "version", pos: "n", ipa: "/ˈvɜːʃn/", vi: "phiên bản", ex: "The latest version of the software saves hours of work.", exVi: "Phiên bản mới nhất của phần mềm tiết kiệm hàng giờ làm việc.", more: "the latest / original **version of** + N" },
          { w: "welfare", pos: "n", ipa: "/ˈwelfeə/", vi: "phúc lợi; trợ cấp xã hội", ex: "Good employers care about the welfare of their staff.", exVi: "Chủ lao động tốt quan tâm đến phúc lợi của nhân viên.", more: "the **welfare of** + N · the **welfare** state / system · be **on welfare** (sống bằng trợ cấp)" },
          { w: "whereas", pos: "conj", ipa: "/ˌweərˈæz/", vi: "trong khi (đối lập hai vế)", ex: "Employees receive paid holidays, whereas freelancers do not.", exVi: "Nhân viên được nghỉ phép có lương, trong khi người làm tự do thì không.", more: "…, **whereas** + S + V — nối HAI mệnh đề trong MỘT câu (có thể đứng đầu câu: Whereas A, B); không dùng như từ nối đứng riêng kiểu ~~Whereas, …~~" },
        ],
      },
      {
        t: "quiz",
        id: "t3d14-awl-3",
        kind: "fill",
        title: "Luyện nhóm 3 — viết dạng đúng của từ trong ngoặc (8 câu)",
        items: [
          { q: "The country needs ___ (sustain) economic growth, not a short boom.", answers: ["sustainable"] },
          { q: "Job ___ (stable) matters more to older workers than to graduates.", answers: ["stability"] },
          { q: "Many graduates suffer from ___ (psychology) pressure when they cannot find work.", answers: ["psychological"] },
          { q: "Her application was met with ___ (reject) three times.", answers: ["rejection"] },
          { q: "The new staff attend a two-day ___ (orient) programme.", answers: ["orientation"] },
          { q: "Nobody knows ___ (precise) how many people work in the informal economy.", answers: ["precisely"] },
          { q: "The handshake was a purely ___ (symbol) gesture, not a real agreement.", answers: ["symbolic"] },
          { q: "In ___ (pursue) of higher profits, the firm cut 200 jobs.", answers: ["pursuit"] },
        ],
      },
      {
        t: "table",
        head: ["Động từ", "Danh từ", "Tính từ", "Ghi nhớ"],
        rows: [
          ["adjust", "adjustment", "adjustable", "adjust **to**"],
          ["expand", "expansion", "expansive", "expansion /ʃ/ (phụ âm + sion — Ngày 13)"],
          ["expose", "exposure", "exposed", "exposure **to**"],
          ["generate", "generation", "—", "generation còn nghĩa “thế hệ”"],
          ["modify", "modification", "modified", "y → i + cation"],
          ["pursue", "pursuit", "—", "~~pursuation~~ ✗"],
          ["reject", "rejection", "—", "≠ refuse (từ chối LÀM gì): refuse to work"],
          ["sustain", "sustainability", "sustainable", "sustainable development"],
          ["—", "stability", "stable", "động từ: stabilise"],
          ["—", "logic", "logical", "trạng từ: logically"],
          ["—", "precision", "precise", "precision /ʒ/ (nguyên âm + sion)"],
          ["—", "awareness", "aware", "raise awareness **of**"],
        ],
        caption: "12 họ từ của sublist 5 hay phải đổi dạng nhất trong Writing.",
      },
      {
        t: "note",
        title: "⚠️ Năm lỗi hay sai với sublist 5",
        items: [
          "**enable** phải có người / vật ở giữa: ~~Technology enables to work at home~~ → enables **people** to work at home.",
          "**contact** (động từ) không có giới từ: ~~contact with me~~ → **contact me**. Danh từ thì có: be in **contact with**.",
          "**decline** (nghĩa “giảm”) / **evolve** là nội động từ ⇒ không bị động (ôn Ngày 13): The birth rate **declined**, không phải ~~was declined~~.",
          "**whereas** nối hai vế trong một câu (thường: A, whereas B). Không viết ~~Whereas, …~~ như một từ nối đứng riêng; mở câu mới thì dùng **However, …** / **By contrast, …**",
          "**aware** hầu như chỉ đứng sau be: ~~an aware person~~ → a person who **is aware of**… **revenue** (doanh thu) ≠ **profit** (lợi nhuận) ≠ **income** (thu nhập của người / hộ).",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Work vòng 2 — quyền lợi & điều kiện lao động (20 từ)" },
      {
        t: "p",
        text: "Tập 1 Ngày 5 · 7 đã có: employee, employer, colleague, boss, flexible, job satisfaction, work–life balance, freelancer, workload, overtime, burnout, deadline… Tập 2 Ngày 1 thêm 6 cụm về điều kiện làm việc (a steady job, paid leave, the minimum wage, internship, retire, work overtime). Vài từ cũ được nhắc lại dưới đây trong ngữ cảnh mới; vòng 2 đi sâu vào **người lao động được hưởng gì**: lương, nghỉ phép, bảo hiểm, lương hưu, và chuyện gì xảy ra khi **mất việc**. Đây là kho ý tưởng cho mọi đề so sánh **làm công ăn lương** với **tự làm chủ / làm tự do**.",
      },
      {
        t: "vocab",
        items: [
          { w: "minimum wage", pos: "n", ipa: "/ˌmɪnɪməm ˈweɪdʒ/", vi: "lương tối thiểu", ex: "Many part-time workers earn only the minimum wage.", exVi: "Nhiều người làm bán thời gian chỉ nhận lương tối thiểu.", more: "raise / introduce the **minimum wage** · be paid the **minimum wage** · a living wage: lương đủ sống" },
          { w: "salary", pos: "n", ipa: "/ˈsæləri/", vi: "lương (cố định theo tháng / năm)", ex: "She was offered a starting salary of 800 dollars a month.", exVi: "Cô ấy được đề nghị mức lương khởi điểm 800 đô một tháng.", more: "a monthly / starting / high **salary** · earn a **salary** · ⚠️ a high / low salary, không phải ~~expensive / cheap salary~~" },
          { w: "wage", pos: "n", ipa: "/weɪdʒ/", vi: "tiền công (tính theo giờ / tuần, thường cho lao động tay chân)", ex: "Factory wages have not kept up with rising prices.", exVi: "Tiền công nhà máy không theo kịp giá cả tăng.", more: "hourly **wages** · low-**wage** jobs · salary = nhân viên văn phòng; wage = trả theo giờ" },
          { w: "overtime", pos: "n, adv", ipa: "/ˈəʊvətaɪm/", vi: "giờ làm thêm; (làm) thêm giờ", ex: "Nurses often work overtime without extra pay.", exVi: "Y tá thường làm thêm giờ mà không được trả thêm.", more: "work / do **overtime** · **overtime** pay · unpaid **overtime**" },
          { w: "annual leave", pos: "n", ipa: "/ˌænjuəl ˈliːv/", vi: "nghỉ phép năm", ex: "Full-time staff are entitled to twenty days of annual leave.", exVi: "Nhân viên toàn thời gian được hưởng hai mươi ngày phép năm.", more: "be **entitled to** … days of **annual leave** · take **leave** · paid holiday (cùng nghĩa, ít trang trọng)" },
          { w: "sick leave", pos: "n", ipa: "/ˈsɪk liːv/", vi: "nghỉ ốm (có lương)", ex: "Freelancers lose income whenever they are ill because they have no sick leave.", exVi: "Người làm tự do mất thu nhập mỗi khi ốm vì họ không có chế độ nghỉ ốm.", more: "be **on sick leave** · paid **sick leave** · sick pay: tiền lương khi nghỉ ốm" },
          { w: "parental leave", pos: "n", ipa: "/pəˌrentl ˈliːv/", vi: "nghỉ chăm con mới sinh (cho bố hoặc mẹ)", ex: "Longer parental leave helps fathers bond with their babies.", exVi: "Thời gian nghỉ chăm con dài hơn giúp người bố gắn bó với con.", more: "maternity leave (mẹ) · paternity leave (bố) · take **parental leave**" },
          { w: "pension", pos: "n", ipa: "/ˈpenʃn/", vi: "lương hưu", ex: "People who work for themselves must save for their own pension.", exVi: "Người tự làm chủ phải tự dành dụm cho lương hưu của mình.", more: "a state / company **pension** · live on a **pension** · pensioner (n): người hưởng lương hưu" },
          { w: "retirement", pos: "n", ipa: "/rɪˈtaɪəmənt/", vi: "sự nghỉ hưu; thời gian nghỉ hưu", ex: "Several countries have raised the retirement age to 67.", exVi: "Một số nước đã nâng tuổi nghỉ hưu lên 67.", more: "the **retirement age** · take early **retirement** · retire (v): **retire at** 60 · retired (adj)" },
          { w: "unemployment benefit", pos: "n", ipa: "/ˌʌnɪmˈplɔɪmənt ˌbenɪfɪt/", vi: "trợ cấp thất nghiệp", ex: "He claimed unemployment benefit for six months after losing his job.", exVi: "Anh ấy nhận trợ cấp thất nghiệp sáu tháng sau khi mất việc.", more: "claim / receive **unemployment benefit** · be **on benefits** · the unemployed (n): người thất nghiệp" },
          { w: "redundancy", pos: "n", ipa: "/rɪˈdʌndənsi/", vi: "việc bị cắt giảm nhân sự", ex: "Two hundred workers face redundancy when the factory closes.", exVi: "Hai trăm công nhân đối mặt với việc bị cắt giảm khi nhà máy đóng cửa.", more: "be **made redundant** (bị cho nghỉ vì công ty cắt giảm — không phải do lỗi) · **redundancy** pay" },
          { w: "internship", pos: "n", ipa: "/ˈɪntɜːnʃɪp/", vi: "kỳ thực tập", ex: "An unpaid internship is often the only way into the media industry.", exVi: "Thực tập không lương thường là con đường duy nhất vào ngành truyền thông.", more: "do / complete an **internship at** + công ty · intern (n): thực tập sinh · a paid / unpaid **internship**" },
          { w: "probation", pos: "n", ipa: "/prəˈbeɪʃn/", vi: "thời gian thử việc", ex: "New staff are on probation for the first two months.", exVi: "Nhân viên mới thử việc trong hai tháng đầu.", more: "be **on probation** · a **probation** / probationary period · pass your **probation**" },
          { w: "permanent contract", pos: "n", ipa: "/ˌpɜːmənənt ˈkɒntrækt/", vi: "hợp đồng không thời hạn (dài hạn)", ex: "Banks prefer to lend to people with a permanent contract.", exVi: "Ngân hàng thích cho người có hợp đồng dài hạn vay hơn.", more: "≠ a temporary / fixed-term / zero-hours **contract** · sign a **contract**" },
          { w: "job security", pos: "n", ipa: "/ˈdʒɒb sɪˌkjʊərəti/", vi: "sự ổn định việc làm (khó bị mất việc)", ex: "Civil servants accept lower pay in exchange for job security.", exVi: "Công chức chấp nhận lương thấp hơn để đổi lấy việc làm ổn định.", more: "have / lack / offer **job security** · ≠ job insecurity · Tập 2 Ngày 1 đã nhắc (gần nghĩa của a steady job)" },
          { w: "trade union", pos: "n", ipa: "/ˌtreɪd ˈjuːniən/", vi: "công đoàn", ex: "The trade union negotiated a five per cent pay rise.", exVi: "Công đoàn đã thương lượng được mức tăng lương năm phần trăm.", more: "join a **trade union** · a union member · go on strike: đình công · a pay rise: đợt tăng lương" },
          { w: "working conditions", pos: "n pl", ipa: "/ˈwɜːkɪŋ kənˌdɪʃnz/", vi: "điều kiện làm việc", ex: "Working conditions in the clothing industry are often poor.", exVi: "Điều kiện làm việc trong ngành may mặc thường tồi tệ.", more: "improve / poor / safe **working conditions** · luôn số nhiều" },
          { w: "perk", pos: "n", ipa: "/pɜːk/", vi: "quyền lợi thêm ngoài lương (xe, điện thoại, ăn trưa…)", ex: "Free lunches and a gym are among the perks of the job.", exVi: "Bữa trưa miễn phí và phòng gym là vài quyền lợi của công việc này.", more: "the **perks of** the job · trang trọng hơn: (fringe) benefits · a bonus: tiền thưởng" },
          { w: "health insurance", pos: "n", ipa: "/ˈhelθ ɪnˌʃʊərəns/", vi: "bảo hiểm y tế", ex: "In some countries health insurance is provided by the employer.", exVi: "Ở một số nước bảo hiểm y tế do chủ lao động cung cấp.", more: "have / provide / pay for **health insurance** · social insurance: bảo hiểm xã hội" },
          { w: "shift", pos: "n", ipa: "/ʃɪft/", vi: "ca làm việc", ex: "Working night shifts can damage your health.", exVi: "Làm ca đêm có thể hại sức khoẻ.", more: "work (in) **shifts** · the night / day **shift** · **shift** work · a **shift towards** = sự chuyển dịch sang" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Làm công ăn lương và tự làm chủ — ai được hưởng gì",
        cols: [
          { title: "Employee (nhân viên có hợp đồng)", items: ["a monthly **salary** — thu nhập đều", "paid **annual leave** + **sick leave**", "**pension** + **health insurance** do công ty đóng", "**job security** (nếu hợp đồng dài hạn)", "nhưng: giờ giấc cố định, **overtime**, ít tự quyết"] },
          { title: "Self-employed / freelancer", items: ["thu nhập **không đều** — tháng có tháng không", "ốm hay nghỉ là **mất thu nhập**", "tự lo **pension**, tự mua **insurance**", "không có **redundancy pay**", "nhưng: tự chọn giờ, chọn việc, không giới hạn thu nhập"] },
        ],
        caption: "Bảng này chính là dàn ý của bài Viết hôm nay.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với nhóm từ lương – việc",
        items: [
          "**job** đếm được, **work** không đếm được: find **a job** / find **work** — không viết ~~find a work~~, ~~many works~~ (works = tác phẩm).",
          "Lương **cao / thấp**: a **high / low** salary; công việc lương cao: a **well-paid** job (≠ badly-paid). Không dùng ~~big salary~~ trong văn viết, không dùng ~~expensive salary~~.",
          "“Bị sa thải” có ba mức: be **made redundant** (công ty cắt giảm) · be **dismissed** / **fired** / **sacked** (do lỗi của mình) · **resign** / **quit** (tự xin nghỉ).",
          "**retire** là nghỉ hưu (hết tuổi làm), không phải “nghỉ việc”: ~~I retired my job to study abroad~~ → I **resigned from** / **quit** my job.",
          "**leave** (kỳ nghỉ phép) không đếm được: twenty days of **annual leave**, không viết ~~twenty annual leaves~~.",
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Sự nghiệp & thị trường lao động (20 từ)" },
      {
        t: "vocab",
        items: [
          { w: "a steady job", pos: "cụm n", ipa: "/ə ˌstedi ˈdʒɒb/", vi: "một công việc ổn định", ex: "After years of freelancing, he wanted a steady job.", exVi: "Sau nhiều năm làm tự do, anh ấy muốn một công việc ổn định.", more: "a **steady** income / job · = a stable job, a secure job" },
          { w: "workload", pos: "n", ipa: "/ˈwɜːkləʊd/", vi: "khối lượng công việc", ex: "Teachers complain that their workload has doubled.", exVi: "Giáo viên phàn nàn rằng khối lượng công việc của họ đã tăng gấp đôi.", more: "a heavy / light **workload** · reduce / cope with the **workload**" },
          { w: "promotion", pos: "n", ipa: "/prəˈməʊʃn/", vi: "sự thăng chức", ex: "She got a promotion after only two years.", exVi: "Cô ấy được thăng chức chỉ sau hai năm.", more: "get / gain **promotion** · be **promoted to** manager · **promotion** prospects" },
          { w: "resign", pos: "v", ipa: "/rɪˈzaɪn/", vi: "từ chức, xin nghỉ việc", ex: "He resigned from his job to start his own company.", exVi: "Anh ấy xin nghỉ việc để mở công ty riêng.", more: "**resign from** + N · resignation (n) /ˌrezɪɡˈneɪʃn/ · hand in your notice: nộp đơn xin nghỉ" },
          { w: "dismiss", pos: "v", ipa: "/dɪsˈmɪs/", vi: "sa thải (trang trọng)", ex: "Employees cannot be dismissed without a good reason.", exVi: "Người lao động không thể bị sa thải nếu không có lý do chính đáng.", more: "be **dismissed for** + lý do · dismissal (n): unfair **dismissal** · = fire, sack (thân mật)" },
          { w: "recruit", pos: "v", ipa: "/rɪˈkruːt/", vi: "tuyển dụng", ex: "Hospitals are struggling to recruit enough nurses.", exVi: "Các bệnh viện đang chật vật tuyển đủ y tá.", more: "**recruit** staff · recruitment (n) · = hire, take on" },
          { w: "vacancy", pos: "n", ipa: "/ˈveɪkənsi/", vi: "vị trí đang cần tuyển", ex: "There are over fifty applicants for every vacancy.", exVi: "Có hơn năm mươi người nộp đơn cho mỗi vị trí cần tuyển.", more: "a job **vacancy** · fill a **vacancy** · apply **for** a job · applicant (n)" },
          { w: "apprenticeship", pos: "n", ipa: "/əˈprentɪʃɪp/", vi: "chương trình học nghề (vừa học vừa làm có lương)", ex: "An apprenticeship is a good alternative to university.", exVi: "Học nghề là một lựa chọn tốt thay cho đại học.", more: "do / complete an **apprenticeship** · apprentice (n): người học nghề · vocational training: đào tạo nghề" },
          { w: "workforce", pos: "n", ipa: "/ˈwɜːkfɔːs/", vi: "lực lượng lao động", ex: "Women make up nearly half of the workforce.", exVi: "Phụ nữ chiếm gần một nửa lực lượng lao động.", more: "a skilled **workforce** · enter / leave the **workforce** · = labour force" },
          { w: "labour market", pos: "n", ipa: "/ˈleɪbə ˌmɑːkɪt/", vi: "thị trường lao động", ex: "Graduates face a highly competitive labour market.", exVi: "Sinh viên mới ra trường đối mặt với thị trường lao động cạnh tranh gay gắt.", more: "enter the **labour market** · = job market · Mỹ: labor" },
          { w: "self-employed", pos: "adj", ipa: "/ˌself ɪmˈplɔɪd/", vi: "tự làm chủ, tự kinh doanh", ex: "About one in six workers in the country is self-employed.", exVi: "Khoảng một phần sáu người lao động trong nước là tự làm chủ.", more: "be / become **self-employed** · self-employment (n) · = work for yourself, be your own boss" },
          { w: "freelance", pos: "adj, adv, v", ipa: "/ˈfriːlɑːns/", vi: "(làm) tự do, nhận việc theo dự án", ex: "She works freelance as a graphic designer.", exVi: "Cô ấy làm thiết kế đồ hoạ tự do.", more: "a **freelance** writer · work **freelance** · freelancer (n)" },
          { w: "gig economy", pos: "n", ipa: "/ˈɡɪɡ ɪˌkɒnəmi/", vi: "nền kinh tế việc làm ngắn hạn qua ứng dụng (xe ôm công nghệ, giao hàng…)", ex: "Delivery riders in the gig economy have few legal rights.", exVi: "Người giao hàng trong nền kinh tế việc ngắn hạn có rất ít quyền hợp pháp.", more: "work in the **gig economy** · a gig worker" },
          { w: "job satisfaction", pos: "n", ipa: "/ˈdʒɒb sætɪsˌfækʃn/", vi: "sự hài lòng với công việc", ex: "For many people, job satisfaction matters more than a high salary.", exVi: "Với nhiều người, sự hài lòng với công việc quan trọng hơn lương cao.", more: "get / gain **job satisfaction** **from** + N · a rewarding job: công việc đem lại sự thoả mãn" },
          { w: "career prospects", pos: "n pl", ipa: "/kəˈrɪə ˌprɒspekts/", vi: "triển vọng nghề nghiệp", ex: "Speaking a second language improves your career prospects.", exVi: "Nói được ngoại ngữ thứ hai cải thiện triển vọng nghề nghiệp của bạn.", more: "good / poor **career prospects** · improve / damage your **prospects** · the career ladder: nấc thang sự nghiệp" },
          { w: "burnout", pos: "n", ipa: "/ˈbɜːnaʊt/", vi: "tình trạng kiệt sức vì làm việc quá tải", ex: "Long hours and constant pressure lead to burnout.", exVi: "Giờ làm dài và áp lực liên tục dẫn tới kiệt sức.", more: "suffer from **burnout** · be burnt out (adj)" },
          { w: "work–life balance", pos: "n", ipa: "/ˌwɜːk laɪf ˈbæləns/", vi: "sự cân bằng công việc – cuộc sống", ex: "Flexible hours help employees achieve a better work–life balance.", exVi: "Giờ làm linh hoạt giúp nhân viên cân bằng công việc – cuộc sống tốt hơn.", more: "achieve / maintain / improve a good **work–life balance**" },
          { w: "flexible working", pos: "n", ipa: "/ˌfleksəbl ˈwɜːkɪŋ/", vi: "chế độ làm việc linh hoạt (giờ / nơi làm)", ex: "Flexible working has become common since the pandemic.", exVi: "Làm việc linh hoạt đã trở nên phổ biến từ sau đại dịch.", more: "**flexible** hours · flexibility (n) · remote / hybrid working" },
          { w: "breadwinner", pos: "n", ipa: "/ˈbredwɪnə/", vi: "người kiếm tiền chính trong gia đình", ex: "In many families the mother is now the main breadwinner.", exVi: "Ở nhiều gia đình, người mẹ giờ là người kiếm tiền chính.", more: "the main / sole **breadwinner** · support a family: nuôi gia đình" },
          { w: "earn a living", pos: "cụm v", ipa: "/ˌɜːn ə ˈlɪvɪŋ/", vi: "kiếm sống", ex: "It is hard to earn a living as an artist.", exVi: "Kiếm sống bằng nghề hoạ sĩ rất khó.", more: "**earn / make a living** as + nghề / by + V-ing · the cost of living: chi phí sinh hoạt · make ends meet: xoay xở đủ sống" },
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Work vòng 2 — 4 nhánh để nhớ",
        center: "Work",
        branches: [
          { label: "Tiền", items: ["salary · wage · minimum wage", "overtime · bonus · perk", "pension · unemployment benefit"] },
          { label: "Nghỉ", items: ["annual leave · sick leave", "parental leave", "retirement"] },
          { label: "Vào – ra", items: ["vacancy → recruit → probation", "internship · apprenticeship", "resign · dismiss · redundancy"] },
          { label: "Chất lượng công việc", items: ["job security · a steady job", "workload · burnout · shift", "job satisfaction · work–life balance"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Collocation cho Task 2 — 4 kiểu và 12 cụm dùng cho mọi đề" },
      {
        t: "p",
        text: "Ôn Tập 2 Ngày 16: **collocation** = những từ người bản ngữ quen ghép với nhau. Dịch từng chữ từ tiếng Việt thường ra cụm sai: “học kiến thức” → ~~learn knowledge~~ (đúng: **gain** knowledge), “mưa to” → ~~big rain~~ (đúng: **heavy** rain). Giám khảo chấm LR band 6 nhìn vào đúng chỗ này. Có **4 kiểu** hay dùng trong bài viết:",
      },
      {
        t: "table",
        head: ["Kiểu", "Công thức", "Ví dụ", "Lỗi dịch từ tiếng Việt"],
        rows: [
          ["① Động từ + danh từ", "V + N", "**make** a decision · **do** research · **take** action · **gain** experience · **solve / address** a problem", "~~do a decision~~ · ~~make research~~ · ~~learn experience~~"],
          ["② Tính từ + danh từ", "adj + N", "a **heavy** workload · a **high** salary · a **serious** problem · a **significant** increase · **strong** evidence", "~~a big workload~~ · ~~an expensive salary~~ · ~~a heavy problem~~"],
          ["③ Trạng từ + tính từ / V3", "adv + adj", "**highly** competitive · **widely** believed · **well** paid · **closely** related · **deeply** concerned", "~~very believed~~ · ~~strongly competitive~~"],
          ["④ Danh từ + giới từ / danh từ + danh từ", "N + prep / N + N", "an increase **in** · the cost **of** living · **job** security · **career** prospects", "~~an increase of unemployment~~ · ~~security of job~~"],
        ],
        caption: "Kiểu ④ (danh từ + giới từ) đã học kỹ ở Tập 3 Ngày 9 — hôm nay tập trung kiểu ①–③.",
      },
      {
        t: "vocab",
        items: [
          { w: "play a vital role in", pos: "cụm v", ipa: "/ˌpleɪ ə ˌvaɪtl ˈrəʊl ɪn/", vi: "đóng vai trò thiết yếu trong", ex: "Small businesses play a vital role in creating jobs.", exVi: "Doanh nghiệp nhỏ đóng vai trò thiết yếu trong việc tạo việc làm.", more: "play a **key / major / crucial** role **in** + N / V-ing · ⚠️ ~~play an important part of~~" },
          { w: "have a negative impact on", pos: "cụm v", ipa: "/hæv ə ˌneɡətɪv ˈɪmpækt ɒn/", vi: "có tác động tiêu cực tới", ex: "Night shifts have a negative impact on family life.", exVi: "Ca đêm có tác động tiêu cực tới đời sống gia đình.", more: "have a **positive / significant / lasting** impact **on** · = have an effect **on** · ⚠️ ~~impact to~~" },
          { w: "pose a threat to", pos: "cụm v", ipa: "/ˌpəʊz ə ˈθret tu/", vi: "là mối đe doạ với", ex: "Automation poses a threat to low-skilled jobs.", exVi: "Tự động hoá là mối đe doạ với các việc làm tay nghề thấp.", more: "**pose** a risk / danger / challenge **to** · ⚠️ ~~make a threat~~" },
          { w: "raise awareness of", pos: "cụm v", ipa: "/ˌreɪz əˈweənəs əv/", vi: "nâng cao nhận thức về", ex: "The campaign aims to raise awareness of workers' rights.", exVi: "Chiến dịch nhằm nâng cao nhận thức về quyền của người lao động.", more: "**raise** public **awareness of / about** · ⚠️ ~~rise awareness~~ (rise không có tân ngữ — Ngày 13)" },
          { w: "take measures to", pos: "cụm v", ipa: "/ˌteɪk ˈmeʒəz tu/", vi: "thực hiện biện pháp để", ex: "Governments should take measures to protect gig workers.", exVi: "Chính phủ nên có biện pháp bảo vệ người làm việc ngắn hạn.", more: "**take** steps / action **to** + V · **introduce** measures · ⚠️ ~~do measures~~" },
          { w: "meet the needs of", pos: "cụm v", ipa: "/ˌmiːt ðə ˈniːdz əv/", vi: "đáp ứng nhu cầu của", ex: "Training courses should meet the needs of local employers.", exVi: "Các khoá đào tạo nên đáp ứng nhu cầu của chủ lao động địa phương.", more: "**meet** demand / a target / a deadline / requirements · = **satisfy / fulfil** the needs of (cũng đúng)" },
          { w: "take responsibility for", pos: "cụm v", ipa: "/ˌteɪk rɪˌspɒnsəˈbɪləti fɔː/", vi: "nhận / chịu trách nhiệm về", ex: "Self-employed people must take responsibility for their own pensions.", exVi: "Người tự làm chủ phải tự chịu trách nhiệm về lương hưu của mình.", more: "**bear / accept** responsibility **for** · be responsible **for** · ⚠️ ~~take responsibility of / about~~" },
          { w: "gain experience", pos: "cụm v", ipa: "/ˌɡeɪn ɪkˈspɪəriəns/", vi: "tích luỹ kinh nghiệm", ex: "Internships allow students to gain practical experience.", exVi: "Thực tập cho phép sinh viên tích luỹ kinh nghiệm thực tế.", more: "**gain** knowledge / skills / confidence · ⚠️ ~~learn experience~~ · get knowledge: thân mật, kém học thuật" },
          { w: "widen the gap between", pos: "cụm v", ipa: "/ˌwaɪdn ðə ˈɡæp bɪˌtwiːn/", vi: "nới rộng khoảng cách giữa", ex: "Low wages widen the gap between rich and poor.", exVi: "Lương thấp nới rộng khoảng cách giàu nghèo.", more: "≠ **narrow / bridge / close** the gap · the **gap between** A **and** B · the generation gap" },
          { w: "put pressure on", pos: "cụm v", ipa: "/ˌpʊt ˈpreʃər ɒn/", vi: "gây áp lực lên", ex: "An ageing population puts pressure on the pension system.", exVi: "Dân số già gây áp lực lên hệ thống lương hưu.", more: "**put / place** pressure **on** sb **to** + V · be **under** pressure · ⚠️ ~~make pressure~~" },
          { w: "strike a balance between", pos: "cụm v", ipa: "/ˌstraɪk ə ˈbæləns bɪˌtwiːn/", vi: "tìm được sự cân bằng giữa", ex: "Employers need to strike a balance between flexibility and security.", exVi: "Chủ lao động cần tìm sự cân bằng giữa linh hoạt và ổn định.", more: "**strike / find / achieve** a balance **between** A **and** B" },
          { w: "bring benefits to", pos: "cụm v", ipa: "/ˌbrɪŋ ˈbenɪfɪts tu/", vi: "đem lại lợi ích cho", ex: "Flexible working brings benefits to both staff and employers.", exVi: "Làm việc linh hoạt đem lại lợi ích cho cả nhân viên lẫn chủ lao động.", more: "**bring / offer / provide** benefits · **reap** the benefits (gặt hái) · ⚠️ benefit (v) không có to: benefit workers (không ~~benefit to workers~~); benefit **from** + N = được lợi từ" },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo học collocation — sổ tay 3 cột",
        items: [
          "Cột 1: **danh từ chủ đề** (problem, decision, impact, role, pressure). Cột 2: **động từ đi trước** (address, make, have, play, put). Cột 3: **tính từ đứng giữa** (a serious / growing problem).",
          "Khi đọc bài mẫu hay bài Reading, **gạch cả cụm**, không gạch từ lẻ. Một cụm đúng đáng giá hơn ba từ “khó” dùng sai.",
          "Kiểm một cụm có tự nhiên không: tra trong từ điển collocation trực tuyến, hoặc gõ cụm trong ngoặc kép lên công cụ tìm kiếm xem có báo chí Anh – Mỹ dùng không.",
          "Đừng nhồi: một bài Task 2 band 6 cần khoảng **6–10 collocation đúng**, rải đều các đoạn.",
        ],
      },
      { t: "rule", formula: "V + (adj) + N + giới từ: play a vital role in · have a negative impact on · pose a threat to · put pressure on", vi: "Học collocation theo khuôn 4 mảnh — sai một mảnh (động từ hoặc giới từ) là thành lỗi LR." },
      {
        t: "mcq",
        id: "t3d14-tv-colloc",
        title: "Chọn từ đi kèm đúng (collocation) — 8 câu",
        items: [
          { q: "Parents ___ a vital role in their children's career choices.", options: ["make", "do", "play", "take"], correct: 2, why: "play a role in." },
          { q: "Working sixty hours a week has a serious impact ___ people's health.", options: ["on", "to", "for", "with"], correct: 0, why: "have an impact ON." },
          { q: "The government should ___ measures to reduce youth unemployment.", options: ["do", "take", "make", "put"], correct: 1, why: "take measures / steps / action." },
          { q: "Volunteering is a good way to ___ experience before you apply for a job.", options: ["learn", "study", "know", "gain"], correct: 3, why: "gain experience; “learn experience” là lỗi dịch từ tiếng Việt." },
          { q: "Teachers have a very ___ workload at the end of term.", options: ["heavy", "big", "strong", "high"], correct: 0, why: "a heavy workload (≠ light)." },
          { q: "The job market for graduates is ___ competitive.", options: ["strongly", "highly", "heavily", "deeply"], correct: 1, why: "highly competitive." },
          { q: "Rising rents ___ pressure on young families.", options: ["make", "do", "put", "give"], correct: 2, why: "put / place pressure on." },
          { q: "Robots may ___ a threat to millions of factory jobs.", options: ["make", "do", "take", "pose"], correct: 3, why: "pose a threat to." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Dùng ngay: câu Task 2 và Part 3 về việc làm" },
      {
        t: "examples",
        items: [
          { en: "Employees with a permanent contract are entitled to sick leave and a pension, whereas freelancers have to take responsibility for both.", vi: "Nhân viên có hợp đồng dài hạn được hưởng nghỉ ốm và lương hưu, trong khi người làm tự do phải tự lo cả hai." },
          { en: "The growing trend towards self-employment may put pressure on the welfare system, since fewer people pay regular contributions.", vi: "Xu hướng tự làm chủ ngày càng tăng có thể gây áp lực lên hệ thống phúc lợi, vì ít người đóng góp đều đặn hơn." },
          { en: "From a young person's perspective, an internship is a chance to gain experience and build a professional network.", vi: "Từ góc nhìn của người trẻ, thực tập là cơ hội tích luỹ kinh nghiệm và xây mạng lưới quan hệ nghề nghiệp." },
          { en: "A heavy workload and unpaid overtime have a negative impact on mental health and can eventually lead to burnout.", vi: "Khối lượng việc nặng và làm thêm không lương có tác động tiêu cực tới sức khoẻ tinh thần và cuối cùng có thể dẫn tới kiệt sức." },
          { en: "(Part 3) I'd say job security matters more to my parents' generation, whereas people my age tend to care about work–life balance.", vi: "(Part 3) Tôi cho rằng việc làm ổn định quan trọng hơn với thế hệ bố mẹ tôi, còn người ở tuổi tôi thường quan tâm tới cân bằng công việc – cuộc sống." },
        ],
      },
      {
        t: "mcq",
        id: "t3d14-tv-nghia",
        title: "Chọn từ đúng nghĩa — nhóm Work (8 câu)",
        items: [
          { q: "The factory closed and 300 workers were made ___ .", options: ["redundant", "retired", "resigned", "recruited"], correct: 0, why: "be made redundant = bị cho nghỉ vì cắt giảm." },
          { q: "She is still on ___ , so she could lose the job after two months.", options: ["pension", "probation", "promotion", "overtime"], correct: 1, why: "on probation = đang thử việc." },
          { q: "He doesn't work for a company; he is ___ .", options: ["unemployed", "dismissed", "self-employed", "permanent"], correct: 2, why: "self-employed = tự làm chủ. unemployed = thất nghiệp." },
          { q: "When you are ill, you can take ___ and still be paid.", options: ["annual leave", "parental leave", "a shift", "sick leave"], correct: 3, why: "sick leave = nghỉ ốm có lương." },
          { q: "After forty years of work, he now lives on a small ___ .", options: ["pension", "wage", "perk", "vacancy"], correct: 0, why: "live on a pension = sống bằng lương hưu." },
          { q: "The company has three ___ for software engineers.", options: ["shifts", "vacancies", "benefits", "unions"], correct: 1, why: "vacancy = vị trí cần tuyển." },
          { q: "A company car and free lunches are ___ of the job.", options: ["wages", "workloads", "perks", "prospects"], correct: 2, why: "perks = quyền lợi thêm ngoài lương." },
          { q: "My father is the main ___ ; my mother works part-time.", options: ["applicant", "apprentice", "intern", "breadwinner"], correct: 3, why: "breadwinner = người kiếm tiền chính." },
        ],
      },
      {
        t: "quiz",
        id: "t3d14-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ vựng hôm nay (5 câu)",
        grammar: "Dùng đúng collocation: V + N + giới từ",
        items: [
          { q: "Người làm tự do không có nghỉ ốm hay lương hưu.", answers: ["Freelancers do not have sick leave or a pension.", "Freelancers don't have sick leave or a pension.", "Freelancers have no sick leave or pension.", "Freelancers do not have sick leave or pensions.", "Freelancers have no sick leave or pensions.", "Freelancers do not get sick leave or a pension."], hint: "freelancers · sick leave · pension" },
          { q: "Tự động hoá là mối đe doạ với nhiều việc làm lương thấp.", answers: ["Automation poses a threat to many low-paid jobs.", "Automation poses a threat to many low-wage jobs.", "Automation is a threat to many low-paid jobs.", "Automation poses a threat to a lot of low-paid jobs."], hint: "pose a threat to · low-paid jobs" },
          { q: "Giờ làm linh hoạt giúp cha mẹ có thể dành nhiều thời gian hơn cho con. (enable)", answers: ["Flexible hours enable parents to spend more time with their children.", "Flexible working hours enable parents to spend more time with their children.", "Flexible working enables parents to spend more time with their children."], hint: "enable sb to + V" },
          { q: "Chính phủ nên có biện pháp để cải thiện điều kiện làm việc.", answers: ["The government should take measures to improve working conditions.", "Governments should take measures to improve working conditions.", "The government should take steps to improve working conditions.", "Governments should take steps to improve working conditions.", "The government should take action to improve working conditions."], hint: "take measures to · working conditions" },
          { q: "Lương thấp nới rộng khoảng cách giữa người giàu và người nghèo.", answers: ["Low wages widen the gap between the rich and the poor.", "Low wages widen the gap between rich and poor.", "Low pay widens the gap between the rich and the poor.", "Low pay widens the gap between rich and poor.", "Low salaries widen the gap between the rich and the poor.", "Low salaries widen the gap between rich and poor."], hint: "widen the gap between … and …" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t3d14-viet",
    kind: "writing",
    title: "Viết Task 2: Advantages / disadvantages band 6 — “outweigh” và “positive or negative development?”",
    goal: "Viết một bài lợi – hại ≥ 250 từ ở mức band 6: nhận đúng ba cách hỏi (chỉ nêu lợi – hại · outweigh · positive or negative development), nêu rõ BÊN NÀO NẶNG HƠN ngay từ mở bài và giữ nguyên tới kết bài, xếp phía nhẹ trước – phía nặng sau, có một câu bản lề “cân” hai phía, và viết được cả ba lập trường (tích cực · tiêu cực · tích cực có điều kiện) cho đề “Is this a positive or negative development?”.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 2 Ngày 10 đã học khung bài lợi – hại và bảng **ba cách hỏi**. Hôm nay nâng lên band 6 ở đúng chỗ người học hay mất điểm: ==đề hỏi “bên nào nặng hơn” mà bài chỉ liệt kê hai bên==.",
          "**outweigh** = “nặng hơn, quan trọng hơn”. Đề có từ này ⇒ bài **bắt buộc** có câu trả lời rõ: lợi nặng hơn hay hại nặng hơn. Viết “both have advantages and disadvantages” ở kết bài = **không trả lời đề** ⇒ Task Response kẹt band 5.",
          "Kỹ thuật chính: **phía nhẹ trước, phía nặng sau** + một ==câu bản lề== (However, these drawbacks are outweighed by…) + lý do **vì sao** bên kia nặng hơn.",
          "Dạng anh em: ==Is this a positive or negative development?== — đề không bắt nêu hai phía, nhưng bắt **đánh giá**. Có **3 lập trường**: tích cực · tiêu cực · nhìn chung tích cực nhưng có mặt trái.",
          "Tiêu chí được đẩy: **TR** (trả lời đủ, ý kiến rõ xuyên bài) và **CC** (bố cục có tiến triển). Từ vựng lấy ngay từ bài Từ vựng hôm nay; câu bị động lấy từ Ngày 13 (are outweighed by).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 10: ba cách hỏi lợi – hại" },
      {
        t: "table",
        head: ["Câu lệnh của đề", "Đề đòi gì", "Có phải nêu ý kiến?", "Kết bài phải có"],
        rows: [
          ["**What are the advantages and disadvantages of…?** / Discuss the advantages and disadvantages.", "Trình bày cả hai phía, mỗi phía một thân bài", "Không bắt buộc (có thể thêm một câu nhận xét ở kết bài)", "Tóm tắt hai phía"],
          ["**Do the advantages outweigh the disadvantages?**", "Trình bày hai phía **và cân** xem bên nào nặng hơn", "**Bắt buộc** — ngay ở mở bài", "Nhắc lại: bên nào nặng hơn + lý do chính"],
          ["**Is this a positive or negative development?**", "**Đánh giá** xu hướng: tốt hay xấu", "**Bắt buộc** — ngay ở mở bài", "Nhắc lại đánh giá"],
        ],
        caption: "Hai dòng dưới là hai dạng “phải có lập trường”. Hôm nay học trọn cả hai.",
      },
      {
        t: "mcq",
        id: "t3d14-viet-nhan-dang",
        title: "Nhận dạng đề và lập trường (5 câu)",
        items: [
          { q: "“More people are shopping online than in stores. Do the advantages of this outweigh the disadvantages?” — Câu nào KHÔNG thể là luận điểm (thesis) của bài?", options: ["I believe the benefits of online shopping are greater than its drawbacks.", "This essay will discuss the advantages and disadvantages of online shopping.", "Although online shopping is convenient, I think its disadvantages are more serious.", "In my view, the advantages clearly outweigh the disadvantages."], correct: 1, why: "B chỉ báo “sẽ thảo luận” — không nói bên nào nặng hơn ⇒ chưa trả lời câu hỏi outweigh." },
          { q: "“Many young people now leave their home town to work in big cities. What are the advantages and disadvantages of this?” — Đề này đòi gì?", options: ["Nêu hai phía; không bắt buộc nói bên nào nặng hơn", "Bắt buộc chọn một phía và chỉ viết về phía đó", "Nêu nguyên nhân và giải pháp", "Chỉ nêu lợi ích"], correct: 0, why: "What are the advantages and disadvantages = trình bày hai phía; không có outweigh ⇒ không bắt buộc cân." },
          { q: "“In many countries people are living longer. Is this a positive or negative development?” — Lập trường nào hợp lệ?", options: ["Chỉ “positive”", "Chỉ “negative”", "Positive, negative, hoặc “nhìn chung tích cực nhưng có mặt trái”", "Không cần lập trường, chỉ mô tả xu hướng"], correct: 2, why: "Cả ba lập trường đều được, miễn rõ ràng và nhất quán từ mở bài tới kết bài." },
          { q: "Với đề outweigh, đoạn kết nào ĐẠT yêu cầu?", options: ["In conclusion, this trend has both advantages and disadvantages.", "In conclusion, people should think carefully before deciding.", "In conclusion, there are many advantages and many disadvantages, so it depends.", "In conclusion, although there are some risks, the benefits are considerably greater."], correct: 3, why: "Chỉ D nói rõ bên nào nặng hơn. A, B, C né câu hỏi." },
          { q: "Đề “Do the advantages outweigh the disadvantages?” — bạn cho rằng HẠI nặng hơn. Viết thế nào?", options: ["Không được — đề chỉ cho phép nói lợi nặng hơn", "I believe the disadvantages outweigh the advantages.", "I believe the advantages are outweighed the disadvantages.", "I believe the advantages do not outweigh than the disadvantages."], correct: 1, why: "Được quyền trả lời “không”. C thiếu by (are outweighed BY); D thừa than." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Bài lợi – hại: band 5 và band 6 khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 5 (thường gặp)", "Band 6 (cần đạt)"],
        rows: [
          ["**TR** — trả lời đề", "Liệt kê lợi, liệt kê hại; **không nói bên nào nặng hơn** hoặc chỉ nói ở câu cuối; ý nêu ra nhưng không giải thích", "Lập trường rõ ở **mở bài**, lặp lại ở câu bản lề và **kết bài**; mỗi ý có giải thích hoặc ví dụ"],
          ["**CC** — mạch lạc", "Firstly, Moreover, Besides, Furthermore, Last but not least đứng đầu mọi câu; hai thân bài như hai danh sách rời", "Mỗi thân bài một ý trung tâm; có **câu bản lề** nối hai thân bài; từ nối ít hơn nhưng đúng vai"],
          ["**LR** — từ vựng", "good, bad, many, a lot of, success (sai loại từ); lặp advantages / disadvantages 8–10 lần", "Từ chủ đề đúng collocation (job security, a regular salary, sick leave); thay advantages bằng benefits, drawbacks…"],
          ["**GRA** — ngữ pháp", "Hầu hết câu đơn; lỗi chia động từ, mạo từ dày", "Trộn câu đơn + câu phức (although, whereas, which, if); có bị động; còn lỗi nhưng không làm sai nghĩa"],
        ],
      },
      {
        t: "note",
        title: "📌 Một câu quyết định band 5 hay 6 ở dạng outweigh",
        items: [
          "Giám khảo đọc **mở bài** và **kết bài** trước để tìm câu trả lời cho chữ outweigh. Tìm thấy ở cả hai chỗ, và hai chỗ nói **cùng một điều** ⇒ bạn đã qua cửa TR band 6.",
          "Không cần ý tưởng độc đáo. Ý của bài band 6 dưới đây gần như **trùng** với bài band 5 — khác ở chỗ được **xếp lại** và **cân**.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. “outweigh” — nghĩa, ngữ pháp và các cách nói thay" },
      {
        t: "p",
        text: "**outweigh** /ˌaʊtˈweɪ/ là **ngoại động từ**: A outweighs B = A **nặng hơn / quan trọng hơn** B. Không có giới từ, không có than. Ở bị động (Ngày 13): B **is outweighed by** A. Chủ ngữ số nhiều (the advantages) ⇒ outweigh; chủ ngữ số ít (the benefit, the risk) ⇒ outweigh**s**.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "S (the advantages / benefits) + outweigh + O (the disadvantages / drawbacks)",
            vi: "Lợi nặng hơn hại.",
            examples: [
              { en: "I believe that the advantages of working from home outweigh the disadvantages.", vi: "Tôi tin rằng lợi ích của làm việc tại nhà nặng hơn bất lợi." },
              { en: "The benefits far outweigh the costs.", vi: "Lợi ích vượt xa chi phí." },
            ],
          },
          {
            formula: "S (the disadvantages) + are + outweighed + by + N",
            vi: "Bị động: hại bị lợi lấn át. Dùng làm câu bản lề.",
            examples: [
              { en: "However, these drawbacks are outweighed by two important benefits.", vi: "Tuy nhiên, những bất lợi này bị lấn át bởi hai lợi ích quan trọng." },
            ],
          },
          {
            formula: "Although + S + V (phía nhẹ), S + V (phía nặng)",
            vi: "Luận điểm một câu: nhượng bộ phía nhẹ, khẳng định phía nặng.",
            examples: [
              { en: "Although self-employment involves real risks, I believe that its advantages outweigh its disadvantages.", vi: "Dù tự làm chủ có rủi ro thật, tôi tin rằng lợi ích của nó nặng hơn bất lợi." },
              { en: "While this trend has some benefits, I would argue that its drawbacks are more serious.", vi: "Dù xu hướng này có vài lợi ích, tôi cho rằng mặt hại của nó nghiêm trọng hơn." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Lập trường", "Cách nói thay cho outweigh", "Mức mạnh"],
        rows: [
          ["Lợi nặng hơn", "The benefits **are greater than** the drawbacks. · The advantages **are more significant**. · **On balance**, this is a beneficial change.", "Vừa"],
          ["Lợi nặng hơn hẳn", "The advantages **far / clearly / considerably** outweigh the disadvantages.", "Mạnh"],
          ["Hại nặng hơn", "The disadvantages outweigh the advantages. · The drawbacks **are more serious than** the benefits. · The risks **are too great to ignore**.", "Vừa"],
          ["Có điều kiện", "The advantages outweigh the disadvantages **only if / as long as / provided that**… · **for** skilled workers, **but not for**…", "Có mức độ — hay nhất cho band 6+"],
        ],
        caption: "Đồng nghĩa: advantage = benefit = positive aspect · disadvantage = drawback = downside (hơi thân mật) = negative aspect. Dùng 2–3 từ khác nhau trong bài là đủ.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với outweigh",
        items: [
          "Sai chính tả: ~~outweight~~ (weight là danh từ) → **outweigh**.",
          "Thêm than / to: ~~The advantages outweigh than the disadvantages~~ → outweigh **the disadvantages**.",
          "Bị động thiếu be hoặc by: ~~The drawbacks outweighed by the benefits~~ → **are** outweighed **by**.",
          "Dùng với more: ~~The advantages are more outweigh~~ → The advantages **outweigh**… / are **more significant than**…",
          "Chia sai số: ~~The main benefit outweigh~~ → outweigh**s**. ~~The advantages outweighs~~ → outweigh.",
          "Trả lời bằng chính câu hỏi rồi thôi: ~~I think the advantages outweigh the disadvantages.~~ (hết) — phải có **vì sao**: …because the risks can be reduced, whereas the benefits last a lifetime.",
        ],
      },
      { t: "rule", formula: "Although + phía nhẹ, I believe (that) + the advantages / the disadvantages + outweigh + phía kia", vi: "Luận điểm của bài outweigh: một câu, có nhượng bộ, nói rõ bên nào nặng hơn. Viết ở mở bài, nhắc lại ở kết bài." },
      {
        t: "quiz",
        id: "t3d14-viet-outweigh-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu có outweigh (5 câu)",
        grammar: "A + outweigh(s) + B · B + is / are outweighed by + A",
        items: [
          { q: "Tôi tin rằng lợi ích của xu hướng này nặng hơn bất lợi. (advantages / disadvantages)", answers: ["I believe that the advantages of this trend outweigh the disadvantages.", "I believe the advantages of this trend outweigh the disadvantages.", "I believe that the advantages of this trend outweigh its disadvantages.", "I believe the advantages of this trend outweigh its disadvantages."], hint: "the advantages of this trend outweigh the disadvantages" },
          { q: "Tuy nhiên, những bất lợi này bị lấn át bởi hai lợi ích quan trọng. (drawbacks / benefits)", answers: ["However, these drawbacks are outweighed by two important benefits."], hint: "are outweighed by" },
          { q: "Lợi ích vượt xa rủi ro. (benefits / far / risks)", answers: ["The benefits far outweigh the risks."], hint: "far outweigh" },
          { q: "Dù làm việc tại nhà tiện lợi, tôi nghĩ mặt hại của nó nghiêm trọng hơn. (Although / convenient / drawbacks / more serious)", answers: ["Although working from home is convenient, I think its drawbacks are more serious.", "Although working from home is convenient, I think that its drawbacks are more serious.", "Although working at home is convenient, I think its drawbacks are more serious."], hint: "Although … is convenient, I think its drawbacks are more serious" },
          { q: "Nhìn chung, tôi nghĩ đây là một thay đổi có lợi. (On balance / a beneficial change)", answers: ["On balance, I think this is a beneficial change.", "On balance, I think that this is a beneficial change.", "On balance I think this is a beneficial change."], hint: "On balance, I think this is…" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Cân hai phía: phía nhẹ trước, phía nặng sau, và câu bản lề" },
      {
        t: "p",
        text: "Bài band 5 xếp “lợi trước, hại sau” theo thói quen, bất kể mình nghiêng về bên nào. Bài band 6 xếp theo **lập trường**: phía bạn cho là **nhẹ hơn** đi trước (thân bài 1, ngắn hơn một chút), phía **nặng hơn** đi sau (thân bài 2, dài và sâu hơn). Người đọc nhớ điều đọc sau cùng — và bài kết thúc đúng ở phía bạn ủng hộ. Giữa hai thân bài là **câu bản lề**: nó vừa nối đoạn (CC), vừa nhắc lại lập trường (TR).",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung 4 đoạn cho đề outweigh (ví dụ: bạn cho rằng LỢI nặng hơn)",
        steps: [
          { label: "Mở bài — 2 câu", sub: "Viết lại đề + luận điểm: Although… risks, I believe the advantages outweigh the disadvantages." },
          { label: "Thân bài 1 — phía NHẸ (hại): 3–4 câu", sub: "The main drawback is… → giải thích → ví dụ" },
          { label: "Thân bài 2 — phía NẶNG (lợi): 5–6 câu", sub: "==Câu bản lề==: However, these problems are outweighed by… → lợi 1 + giải thích → lợi 2 + hệ quả → câu “cân”" },
          { label: "Kết bài — 1–2 câu", sub: "In conclusion, although…, I believe… ⇒ nhắc lại bên nặng hơn + lý do chính" },
        ],
        caption: "Bạn cho rằng HẠI nặng hơn? Đảo lại: thân bài 1 = lợi (nhẹ), thân bài 2 = hại (nặng).",
      },
      {
        t: "table",
        head: ["Cách “cân”", "Ý tưởng", "Câu mẫu"],
        rows: [
          ["① So **số người** bị ảnh hưởng", "Hại chỉ chạm một nhóm nhỏ; lợi tới số đông", "This drawback affects only a minority, **whereas** the benefits are shared by the whole community."],
          ["② So **mức độ / thời gian**", "Hại ngắn hạn; lợi lâu dài", "These difficulties are temporary, **while** the advantages last for a whole career."],
          ["③ Hại **khắc phục được**", "Có cách giảm rủi ro ⇒ phần hại nhỏ lại", "Moreover, the risks mentioned above **can be reduced** if people save money before leaving their job."],
          ["④ Lợi **kéo theo** lợi khác", "Lợi cho cá nhân → lợi cho xã hội", "**As a result**, society also benefits, because new businesses create jobs for others."],
        ],
        caption: "Chỉ cần MỘT trong bốn cách, viết thành một câu ở cuối thân bài 2. Thiếu câu này, bài chỉ là hai danh sách đặt cạnh nhau.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi cân hai phía",
        items: [
          "Viết **3 lợi + 3 hại** bằng nhau rồi kết luận “lợi nặng hơn” — người đọc không thấy vì sao. Phía nặng phải **dài hơn, có ví dụ rõ hơn**.",
          "Đổi ý giữa bài: mở bài nói lợi nặng hơn, kết bài viết “it depends on each person”. Lập trường phải **giống nhau** ở cả ba chỗ.",
          "Bỏ hẳn phía nhẹ. Đề outweigh hỏi về **cả hai** phía — phải có ít nhất một đoạn cho phía nhẹ.",
          "Câu bản lề bắt đầu bằng ~~On the other hand, there are also some disadvantages~~ — câu này chỉ chuyển đoạn, không cân. Thêm ý đánh giá: However, **I would argue that** these problems **are outweighed by**…",
          "Lạm dụng từ nối đầu câu: Firstly / Secondly / Moreover / Furthermore / In addition / Last but not least trong cùng một đoạn (ôn Tập 3 Ngày 10: nối bằng **từ quy chiếu** — this, these problems, such freedom).",
        ],
      },
      { t: "rule", formula: "Thân 1 = phía nhẹ → câu bản lề (However, these + N + are outweighed by…) → Thân 2 = phía nặng + 1 câu cân", vi: "Xếp theo lập trường, không xếp theo thói quen “lợi trước hại sau”." },

      /* ── 5 ── */
      { t: "h", text: "5. Phân tích đề và dàn ý 5 phút" },
      {
        t: "p",
        text: "**Đề:** In many countries, a growing number of people are choosing to be **self-employed** rather than to work for a company or organisation. **Do the advantages of this trend outweigh the disadvantages?** — Đếm vế (Tập 3 Ngày 6): ① xu hướng = tự làm chủ **thay vì** làm cho công ty (phải so với việc làm công); ② lợi của xu hướng; ③ hại của xu hướng; ④ **bên nào nặng hơn**. Thiếu vế ④ là thiếu phần quan trọng nhất.",
      },
      {
        t: "table",
        head: ["", "Ý (ghi từ khoá)", "Từ vựng của bài Từ vựng hôm nay"],
        rows: [
          ["Hại 1", "Thu nhập không đều; ốm là mất thu nhập", "a regular salary · sick leave · pension · lose income"],
          ["Hại 2", "Nhiều doanh nghiệp nhỏ đóng cửa → mất tiền tiết kiệm", "close within a few years · lose their savings"],
          ["Lợi 1", "Tự chọn giờ, nơi làm → hợp với người có con nhỏ", "flexibility · enable parents to… · work–life balance"],
          ["Lợi 2", "Thu nhập không bị giới hạn bởi lương cứng → có động lực; tạo việc làm cho người khác", "a fixed salary · keep the profit · create jobs"],
          ["Cân", "Rủi ro giảm được nếu tiết kiệm + mua bảo hiểm trước khi nghỉ việc", "the risks can be reduced · private insurance"],
          ["Lập trường", "**Lợi nặng hơn** ⇒ hại ở thân bài 1, lợi ở thân bài 2", "outweigh · are outweighed by"],
        ],
      },
      {
        t: "note",
        title: "💡 Dàn ý 5 phút — chép khung này ra nháp",
        items: [
          "**Intro:** more people → work for themselves. Although risks → adv **outweigh** disadv.",
          "**B1 (disadv, nhẹ):** no security — salary / sick leave / pension vs lose income; eg freelance designer; small businesses close.",
          "**B2 (adv, nặng):** HOWEVER outweighed by 2 benefits — (1) flexibility: when + where, parents; (2) income not limited, keep profit → new ideas → jobs for others; risks can be reduced (save, insurance).",
          "**Concl:** less secure BUT freedom + higher income more important ⇒ adv outweigh.",
          "Chọn lập trường theo bên bạn **có ý rõ hơn**, không theo điều bạn thật sự tin. Giám khảo chấm ngôn ngữ và lập luận, không chấm quan điểm.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bài mẫu band 5 (ước tính) — đọc và tìm xem hỏng ở đâu" },
      {
        t: "p",
        text: "Bài dưới đây có ý **không tệ** và đủ bốn đoạn. Hãy đọc và tự trả lời trước khi xem bảng ở mục 7: (1) Người viết cho rằng bên nào nặng hơn? (2) Có bao nhiêu từ nối đứng đầu câu? (3) Ý nào được giải thích, ý nào chỉ nêu?",
      },
      {
        t: "examples",
        items: [
          { en: "Nowadays, more and more people want to be self-employed instead of working in a company. This trend has both advantages and disadvantages. In this essay I will discuss both of them.", vi: "(Mở bài) Ngày nay ngày càng nhiều người muốn tự làm chủ thay vì làm trong công ty. Xu hướng này có cả lợi và hại. Trong bài này tôi sẽ thảo luận cả hai." },
          { en: "Firstly, there are many advantages. People who work for themselves are free. They can choose the time to work and they don't have boss. Moreover, they can earn a lot of money if their business is success. For example, my uncle opened a coffee shop and now he is rich. Besides, they can do the job that they like, so they are happy.", vi: "(Thân bài 1) Thứ nhất, có nhiều lợi ích. Người làm cho chính mình thì tự do. Họ chọn được giờ làm và không có sếp. Hơn nữa, họ có thể kiếm nhiều tiền nếu việc kinh doanh thành công. Ví dụ, chú tôi mở quán cà phê và giờ chú ấy giàu. Ngoài ra, họ làm được việc mình thích nên họ vui." },
          { en: "Secondly, there are also some disadvantages. Self-employed people don't have stable salary. Some months they have money but some months they don't have. Furthermore, they don't have insurance and pension like the people working in company. In addition, they must to work very hard and it make them stressful. Last but not least, many new business are failed in the first year.", vi: "(Thân bài 2) Thứ hai, cũng có vài bất lợi. Người tự làm chủ không có lương ổn định. Có tháng có tiền, có tháng không. Hơn nữa, họ không có bảo hiểm và lương hưu như người làm ở công ty. Thêm vào đó, họ phải làm rất vất vả và điều đó làm họ căng thẳng. Cuối cùng nhưng không kém phần quan trọng, nhiều doanh nghiệp mới thất bại trong năm đầu." },
          { en: "In conclusion, being self-employed has both advantages and disadvantages. I think people should think carefully before they decide to be self-employed or not.", vi: "(Kết bài) Tóm lại, tự làm chủ có cả lợi và hại. Tôi nghĩ mọi người nên cân nhắc kỹ trước khi quyết định có tự làm chủ hay không." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi ngôn ngữ trong bài band 5 — sửa lại",
        items: [
          "~~don't have boss~~ → don't have **a** boss · ~~stable salary~~ → **a** stable salary · ~~in company~~ → in **a** company (mạo từ — Tập 3 Ngày 3).",
          "~~their business is success~~ → is **successful** (tính từ) / is **a success** (danh từ).",
          "~~they must to work~~ → they **must work** / **have to** work (sau modal không có to).",
          "~~it make them stressful~~ → it make**s** them **stressed** (người thì stressed; công việc mới stressful — Tập 3 Ngày 7).",
          "~~many new business are failed~~ → many new business**es** **fail** (fail là nội động từ — Ngày 13).",
          "Bài khoảng 180 từ — **chưa đủ 250 từ** ⇒ bị trừ điểm TR ngay cả khi mọi thứ khác đều tốt.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Bài mẫu band 6 (ước tính) — cùng đề, gần như cùng ý" },
      {
        t: "p",
        text: "Cùng những ý trên, nhưng: có **lập trường** ngay ở mở bài · **hại (nhẹ) trước, lợi (nặng) sau** · có **câu bản lề** và **câu cân** · mỗi ý có giải thích. Phần ==tô dạ quang== là những chỗ tạo ra band 6.",
      },
      {
        t: "examples",
        items: [
          { en: "In many countries, a growing number of workers are leaving companies in order to work for themselves. ==Although this choice involves real risks, I believe that its advantages outweigh its disadvantages.==", vi: "(Mở bài) Ở nhiều nước, ngày càng nhiều người lao động rời công ty để làm cho chính mình. Dù lựa chọn này có rủi ro thật, tôi tin rằng lợi ích của nó nặng hơn bất lợi." },
          { en: "==The main drawback of self-employment is the lack of security.== People who work for a company receive a regular salary, paid sick leave and a pension, whereas self-employed people lose income whenever they are ill or have no customers. For instance, a freelance designer may earn well in one month and almost nothing in the next, which makes it difficult to pay rent or get a bank loan. In addition, many small businesses close within a few years, so some people lose their savings.", vi: "(Thân bài 1 — phía nhẹ) Bất lợi chính của việc tự làm chủ là thiếu sự ổn định. Người làm cho công ty nhận lương đều, nghỉ ốm có lương và lương hưu, trong khi người tự làm chủ mất thu nhập mỗi khi ốm hoặc không có khách. Chẳng hạn, một nhà thiết kế tự do có thể kiếm khá trong tháng này và gần như không có gì trong tháng sau, khiến việc trả tiền thuê nhà hay vay ngân hàng trở nên khó. Ngoài ra, nhiều doanh nghiệp nhỏ đóng cửa trong vài năm, nên một số người mất tiền tiết kiệm." },
          { en: "==However, I would argue that these problems are outweighed by two important benefits.== The first is flexibility. Self-employed people can decide when and where they work, which enables parents, for example, to organise their day around their children. This is a kind of freedom that very few employees have. The second benefit is that income is not limited by a fixed salary. If the business is successful, the owner keeps the profit, and this encourages people to work hard and develop new ideas. As a result, society also benefits, because new businesses create jobs for others. ==Moreover, the financial risks mentioned above can be reduced if people save money and buy private insurance before they leave their job.==", vi: "(Thân bài 2 — phía nặng) Tuy nhiên, tôi cho rằng những vấn đề này bị lấn át bởi hai lợi ích quan trọng. Thứ nhất là sự linh hoạt. Người tự làm chủ quyết định được khi nào và ở đâu mình làm việc, điều này giúp các bậc cha mẹ, chẳng hạn, sắp xếp ngày của mình quanh con cái. Đây là kiểu tự do mà rất ít nhân viên có. Lợi ích thứ hai là thu nhập không bị giới hạn bởi lương cố định. Nếu việc kinh doanh thành công, người chủ giữ lợi nhuận, và điều này khuyến khích người ta làm việc chăm và phát triển ý tưởng mới. Kết quả là xã hội cũng được lợi, vì doanh nghiệp mới tạo việc làm cho người khác. Hơn nữa, các rủi ro tài chính nêu trên có thể giảm nếu người ta tiết kiệm và mua bảo hiểm tư nhân trước khi nghỉ việc." },
          { en: "In conclusion, ==although working for yourself is less secure than being an employee, I believe the freedom and the higher potential income it offers are more important.== For this reason, the advantages of this trend outweigh the disadvantages.", vi: "(Kết bài) Tóm lại, dù làm cho chính mình kém ổn định hơn làm nhân viên, tôi tin rằng sự tự do và mức thu nhập tiềm năng cao hơn mà nó đem lại quan trọng hơn. Vì lý do này, lợi ích của xu hướng này nặng hơn bất lợi." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6", "Bài học"],
        rows: [
          ["**TR**", "Mở bài: “will discuss both”. Kết bài: “has both… people should think carefully” ⇒ **không trả lời outweigh**. Thiếu từ (~180).", "Lập trường ở mở bài, câu bản lề, kết bài — **ba lần, cùng một ý**. ~270 từ.", "Viết luận điểm **trước tiên**; kết bài nhắc lại bằng lời khác."],
          ["**TR — phát triển ý**", "“They are free.” “They are happy.” — nêu, không giải thích; ví dụ “my uncle… rich” không chứng minh gì.", "Mỗi ý: nêu → giải thích (whereas, which makes…) → ví dụ / hệ quả.", "Ít ý hơn (2 + 2), **mỗi ý 2–3 câu**."],
          ["**CC**", "8 từ nối đầu câu: Firstly, Moreover, Besides, Secondly, Furthermore, In addition, Last but not least, In conclusion. Hai thân bài không nối với nhau.", "Câu bản lề nối hai thân bài; quy chiếu: this choice, these problems, the risks mentioned above, this trend.", "Bỏ bớt từ nối; dùng **this / these + danh từ tóm tắt**."],
          ["**LR**", "free, happy, rich, a lot of money, work very hard; advantages / disadvantages lặp 6 lần; success (sai loại từ).", "lack of security · a regular salary · paid sick leave · pension · flexibility · a fixed salary · keep the profit; drawback / benefit / risk thay phiên.", "Lấy **cụm** từ bài Từ vựng, không lấy từ lẻ."],
          ["**GRA**", "Gần như toàn câu đơn; khoảng 9 lỗi (mạo từ × 3, loại từ, must to, make → makes, stressful → stressed, business → businesses, are failed).", "although · whereas · whenever · which makes · if · because; **3 câu bị động** (are outweighed by, is not limited by, can be reduced); rất ít lỗi (band 6 vẫn cho phép lỗi, miễn không gây khó hiểu).", "Mỗi đoạn có ít nhất **một câu phức** + bài có 1–2 câu bị động."],
        ],
      },
      {
        t: "note",
        title: "💡 Luyện tái tạo bài mẫu (nối Tập 3 Ngày 2)",
        items: [
          "Đọc bài band 6 hai lần. Che lại. Chỉ nhìn **dàn ý 5 phút** ở mục 5 và viết lại bài trong 30 phút.",
          "So với bài mẫu: bạn thiếu **câu bản lề** không? thiếu **câu cân** không? luận điểm ở mở bài và kết bài có khớp nhau không?",
          "Chép vào Sổ lỗi ba cụm bạn không tự viết ra được (vd “which makes it difficult to…”, “the risks mentioned above”).",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. “Is this a positive or negative development?” — trọn ba lập trường" },
      {
        t: "p",
        text: "Tập 2 Ngày 10 mới giới thiệu câu hỏi này. **development** ở đây = “sự thay đổi, xu hướng” (không phải “sự phát triển”). Đề nêu một xu hướng rồi hỏi bạn **đánh giá**. Khác đề outweigh ở hai điểm: (1) đề **không bắt** nêu cả lợi lẫn hại — bạn có thể viết cả hai thân bài về một phía; (2) nhưng ở band 6 trở lên, nên **thừa nhận phía kia** ít nhất bằng một mệnh đề nhượng bộ, để lập luận không bị một chiều.",
      },
      {
        t: "p",
        text: "**Đề:** In many countries, people now change jobs several times during their working lives instead of staying with one employer. **Is this a positive or negative development?** — Bảng dưới cho thấy **cùng một đề** viết theo ba lập trường.",
      },
      {
        t: "table",
        head: ["Lập trường", "Luận điểm (mở bài)", "Thân bài 1", "Thân bài 2", "Kết bài"],
        rows: [
          ["**① Tích cực**", "In my view, this is **a positive development**, both for workers and for the economy.", "Lợi cho **người lao động**: kỹ năng mới, lương cao hơn mỗi lần chuyển, tránh burnout", "Lợi cho **nền kinh tế / công ty**: ý tưởng mới, người lao động đến nơi cần họ nhất (+ 1 câu nhượng bộ: Admittedly, … less job security)", "Overall, I believe this change **benefits** both individuals and society."],
          ["**② Tiêu cực**", "I believe this is largely **a negative development**, because it reduces security for workers and increases costs for employers.", "Hại cho **người lao động**: mất job security, lương hưu gián đoạn, khó vay mua nhà", "Hại cho **công ty**: tốn tiền tuyển và đào tạo, mất người có kinh nghiệm (+ nhượng bộ: Although some people gain higher pay…)", "For these reasons, I regard this trend as **harmful** rather than helpful."],
          ["**③ Tích cực có điều kiện**", "**Although** this trend has some drawbacks, I believe it is **mainly positive**, particularly for younger workers.", "**Mặt trái** (nhẹ): thiếu ổn định, công ty tốn chi phí đào tạo", "**Mặt tốt** (nặng): kỹ năng, lương, sự hài lòng — mở bằng câu bản lề **However, on the whole…**", "On balance, the advantages for most workers make this **a welcome change**, **as long as** employers continue to invest in training."],
        ],
        caption: "Lập trường ③ dùng lại đúng khung “phía nhẹ trước – phía nặng sau” của mục 4. Đây là lập trường dễ viết nhất và dễ đạt band 6 nhất.",
      },
      {
        t: "table",
        head: ["Muốn nói", "Cụm đánh giá", "Ví dụ"],
        rows: [
          ["Tốt", "a positive / welcome / beneficial development · a change for the better · a step in the right direction", "I regard this as **a welcome development**."],
          ["Xấu", "a negative / worrying / harmful development · a cause for concern · a change for the worse", "This is **a worrying trend** for older employees."],
          ["Phần lớn tốt / xấu", "largely / mainly / on the whole positive · more harmful than helpful", "The change is **on the whole positive**."],
          ["Cho ai, khi nào", "for younger workers · in the long term · as long as · provided that", "It is positive **as long as** workers keep learning."],
        ],
        caption: "Đừng viết “a positive development” năm lần. Luận điểm dùng positive / negative (lặp từ của đề cho rõ), các chỗ sau đổi sang beneficial, welcome, harmful, worrying.",
      },
      {
        t: "examples",
        items: [
          { en: "However, on the whole, I believe that changing jobs brings more benefits than problems. Each new position requires employees to learn different skills and adjust to a different team, so people who have worked for several companies usually become more flexible and more confident. They are also in a stronger position to ask for a higher salary, since they know what other employers are willing to pay. By contrast, those who stay with one company for decades may find that their skills are out of date when they are finally made redundant. In this sense, moving between employers is a form of protection rather than a risk.", vi: "(Thân bài 2 mẫu — lập trường ③, band 6 ước tính) Tuy nhiên, nhìn chung, tôi tin rằng đổi việc đem lại nhiều lợi ích hơn rắc rối. Mỗi vị trí mới đòi hỏi nhân viên học kỹ năng khác và thích nghi với một nhóm khác, nên người từng làm cho vài công ty thường trở nên linh hoạt và tự tin hơn. Họ cũng ở thế mạnh hơn để đề nghị mức lương cao hơn, vì họ biết các chủ lao động khác sẵn sàng trả bao nhiêu. Ngược lại, những người ở lại một công ty hàng chục năm có thể nhận ra kỹ năng của mình đã lỗi thời khi cuối cùng họ bị cắt giảm. Theo nghĩa này, chuyển giữa các nơi làm là một hình thức bảo vệ chứ không phải rủi ro." },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với đề positive / negative",
        items: [
          "Không viết luận điểm kiểu ~~This development is both positive and negative.~~ rồi dừng. Muốn nói “cả hai” thì phải nói **bên nào nhiều hơn**: mainly positive / more negative than positive.",
          "Không dịch development thành “sự phát triển kinh tế” rồi viết lạc sang GDP. **this development = this change = this trend** — chính là xu hướng đề vừa nêu.",
          "Đừng biến bài thành **nguyên nhân – giải pháp** (“Why do people change jobs?”). Đề chỉ hỏi **tốt hay xấu**; nguyên nhân tối đa một câu ở mở bài.",
          "Lập trường ① / ② viết hai thân bài cùng một phía ⇒ hai thân bài phải là **hai góc khác nhau** (cá nhân ↔ công ty / xã hội — bảng góc nhìn Tập 3 Ngày 6), không phải lặp lại một ý.",
          "Vẫn dùng được outweigh ở kết bài: …the benefits of this development clearly outweigh its drawbacks.",
        ],
      },
      { t: "rule", formula: "(Although + mặt kia,) I believe this is a / mainly a positive / negative development + because / for + lý do chính", vi: "Đề “positive or negative development?”: luận điểm phải có một trong hai chữ positive / negative (hoặc từ đồng nghĩa), đặt ở mở bài." },
      {
        t: "quiz",
        id: "t3d14-viet-khung",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh câu khung (6 câu)",
        items: [
          { q: "___ this trend has some drawbacks, I believe it is mainly positive.", answers: ["Although", "While", "Though", "Whilst"] },
          { q: "However, these problems are outweighed ___ two important benefits.", answers: ["by"] },
          { q: "On ___ , I think this is a welcome change.", answers: ["balance"] },
          { q: "In my view, this is a negative ___ , because it reduces job security.", answers: ["development", "trend", "change"] },
          { q: "The benefits ___ outweigh the costs. (trạng từ: “vượt xa”)", answers: ["far", "clearly", "greatly", "considerably", "easily"] },
          { q: "This change is positive as ___ as employers continue to invest in training.", answers: ["long"] },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Sáu lỗi làm bài lợi – hại kẹt ở band 5 — bảng tự soát" },
      {
        t: "note",
        title: "⚠️ Cẩn thận — soát 6 điểm này trong 3 phút cuối",
        items: [
          "**1. Thiếu lập trường.** Đề có outweigh / positive or negative mà mở bài chỉ viết “This essay will discuss…”. ⇒ Tìm trong mở bài một câu có I believe / In my view + bên nặng hơn.",
          "**2. Lập trường đổi giữa chừng.** So câu luận điểm với câu kết: có nói **cùng một bên** không?",
          "**3. Hai danh sách.** Mỗi thân bài 4–5 ý, mỗi ý một câu. ⇒ Giữ **2 ý / đoạn**, mỗi ý 2–3 câu.",
          "**4. Thiếu câu cân.** Tìm một câu so hai phía (are outweighed by / whereas / can be reduced). Không có ⇒ thêm vào cuối thân bài 2.",
          "**5. Lặp advantages / disadvantages.** Đếm: quá 5 lần ⇒ đổi sang benefit, drawback, risk, problem, positive aspect.",
          "**6. Lạc dạng.** Đề lợi – hại mà viết thành discuss both views (“Some people think… others think…”) hoặc nguyên nhân – giải pháp. Đọc lại câu lệnh cuối đề.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "sodo",
        kind: "flow",
        title: "40 phút cho bài lợi – hại",
        steps: [
          { label: "0–5': Đọc đề, đếm vế, chọn lập trường, dàn ý", sub: "Ghi: nhẹ = …, nặng = …, câu cân = …" },
          { label: "5–10': Mở bài 2 câu", sub: "Viết lại đề + luận điểm Although…, I believe…" },
          { label: "10–32': Hai thân bài", sub: "Thân 1 (phía nhẹ) ~70 từ · câu bản lề · Thân 2 (phía nặng) ~100 từ" },
          { label: "32–36': Kết bài", sub: "Nhắc lại bên nặng hơn + lý do chính, không ý mới" },
          { label: "36–40': Soát", sub: "6 điểm ở mục 9 + đếm từ ≥ 250" },
        ],
      },
      {
        t: "essay",
        id: "t3d14-viet-bai",
        task: "Task 2",
        prompt: "Some companies now allow their employees to work four days a week instead of five, for the same salary. Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đếm vế: four days instead of five · for the SAME salary (ai chịu chi phí?) · lợi · hại · bên nào nặng hơn.",
          "Viết luận điểm trước: Although …, I believe that the advantages / disadvantages outweigh …",
          "Thân 1 = phía bạn cho là nhẹ; mở thân 2 bằng câu bản lề: However, … are outweighed by …",
          "Từ nên dùng: work–life balance · burnout · workload · productivity · job satisfaction · recruit · put pressure on.",
          "Kết bài: nhắc lại bên nặng hơn bằng lời khác; không viết “it depends”.",
        ],
      },
      {
        t: "essay",
        id: "t3d14-viet-bai-2",
        task: "Task 2",
        prompt: "In many countries, people now change jobs several times during their working lives instead of staying with one employer. Is this a positive or negative development? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Chọn MỘT trong ba lập trường ở mục 8 và ghi nó thành một câu trước khi viết.",
          "Mở bài phải có chữ positive / negative (hoặc beneficial / harmful).",
          "Lập trường ① hoặc ②: hai thân bài = hai góc (người lao động ↔ công ty / nền kinh tế) + một câu nhượng bộ.",
          "Lập trường ③: mặt trái trước (ngắn), mặt tốt sau (dài), mở thân 2 bằng However, on the whole…",
          "Không chép lại đoạn mẫu ở mục 8 — viết bằng ý và ví dụ của bạn.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t3d14-noi",
    kind: "speaking",
    title: "Nói Part 2: Describe a public place (vòng 2) + Part 3 dạng ưu – nhược",
    goal: "Nói trọn 2 phút về một nơi công cộng ở mức band 6: đọc động từ của thẻ để chọn góc kể, chọn đúng khung “công trình” hay “vùng đất”, tả bằng câu bị động tự nhiên (is located, is surrounded by, was built) và tả không khí đổi theo thời điểm; rồi trả lời câu hỏi Part 3 dạng “What are the advantages / disadvantages of…?” bằng khung hai lợi – một hại – chốt cân; đọc đúng ba nguyên âm đôi /ɪə/ /eə/ /ʊə/.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 2 Ngày 7 đã học đề **Describe a place** lần đầu (khung câu, sơ đồ ý, công trình vs vùng đất). Hôm nay là **vòng 2**: ==nơi công cộng== (public place) — công viên, quảng trường, thư viện, chợ, phố đi bộ — ở mức band 6.",
          "Band 5 tả nơi chốn bằng 3 tính từ (beautiful, famous, crowded) rồi hết ý sau 50 giây. Band 6 **sẵn lòng nói dài**: tả theo một trật tự, có chi tiết nhìn thấy được, và nói được **không khí thay đổi thế nào** theo giờ trong ngày.",
          "Ngữ pháp dùng ngay từ Ngày 13: bị động để tả nơi chốn — is **located** in, is **surrounded by**, **was built** in, **has been turned into**, is **known for**.",
          "Part 3 hôm nay: dạng ==ưu – nhược== (What are the advantages / benefits / drawbacks of…?) — học cạnh bài Viết lợi – hại, nhưng **nói khác viết**: ngắn hơn, 2 lợi + 1 hại + một câu chốt.",
          "Phát âm: ba nguyên âm đôi kết thúc bằng /ə/ — ==/ɪə/== (here, near, clear), ==/eə/== (square, where, air), ==/ʊə/== (tour, sure, rural). Từ chỉ nơi chốn dùng chúng rất nhiều.",
          "Tiêu chí được đẩy: **FC** (nói dài có trật tự), **LR** (từ tả nơi chốn + paraphrase), **GRA** (bị động, mệnh đề quan hệ), **P**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 7: đọc ĐỘNG TỪ của thẻ" },
      {
        t: "p",
        text: "Cùng là “a public place”, nhưng mỗi thẻ hỏi một góc khác nhau. Góc ấy nằm ở **động từ / mệnh đề** sau chữ place. Đọc sai động từ là kể lạc đề — ví dụ thẻ hỏi nơi bạn **muốn tới** mà bạn kể nơi bạn tới hằng tuần.",
      },
      {
        t: "table",
        head: ["Thẻ ghi", "Góc phải kể", "Thì chính"],
        rows: [
          ["a public place you **like to visit** / **often go to**", "Thói quen: tới khi nào, với ai, làm gì", "Hiện tại đơn"],
          ["a public place you **visited** and enjoyed", "Một lần cụ thể: hôm đó thế nào", "Quá khứ đơn"],
          ["a public place you **would like to visit**", "Chưa tới: biết nó từ đâu, mong làm gì ở đó", "would + V; hiện tại đơn để tả"],
          ["a public place that **has changed** / **has been improved**", "Trước ↔ sau: thay đổi gì, bạn thấy sao", "used to + hiện tại hoàn thành (bị động)"],
          ["a public place where people **relax** / a **crowded** place / a **quiet** place", "Tính chất đó phải là trục của cả bài", "Hiện tại đơn"],
        ],
        caption: "30 giây đầu của 1 phút chuẩn bị: gạch động từ của thẻ, chọn thì, rồi mới chọn nơi.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Công trình hay vùng đất? — hai khung tả khác nhau" },
      {
        t: "p",
        text: "Nơi công cộng có hai loại. **Công trình** (building): thư viện, bảo tàng, nhà ga, trung tâm thương mại — có **bên ngoài** và **bên trong**. **Vùng đất / không gian mở** (area): công viên, hồ, quảng trường, phố đi bộ, bãi biển — có **vị trí, các khu, và thời điểm**. Tả lộn xộn (“nó đẹp… có cây… rất nổi tiếng… có cây cầu…”) làm mất điểm mạch lạc. Chọn khung rồi đi **theo một hướng**.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai khung tả nơi công cộng",
        cols: [
          {
            title: "CÔNG TRÌNH (a library, a museum, a mall)",
            items: [
              "1. Ở đâu + xây khi nào: is located… / was built…",
              "2. **Bên ngoài**: hình dáng, vật liệu, cổng",
              "3. **Bên trong**: các tầng / khu, ánh sáng, âm thanh",
              "4. Người ta làm gì ở đó + bạn làm gì",
              "5. Cảm giác + vì sao bạn thích",
            ],
          },
          {
            title: "VÙNG ĐẤT (a park, a lake, a square, a walking street)",
            items: [
              "1. Ở đâu trong thành phố + rộng cỡ nào",
              "2. **Các khu / vật mốc**: giữa có gì, xung quanh có gì",
              "3. **Theo thời điểm**: sáng ↔ tối, ngày thường ↔ cuối tuần",
              "4. Người ta làm gì + bạn làm gì",
              "5. Cảm giác + vì sao bạn thích",
            ],
          },
        ],
        caption: "Bước 3 là chỗ khác nhau: công trình đi từ NGOÀI vào TRONG; vùng đất đi theo THỜI ĐIỂM trong ngày.",
      },
      {
        t: "note",
        title: "💡 Mẹo kéo dài mỗi ô thông tin thêm 2 câu (ôn Tập 2 Ngày 7)",
        items: [
          "**Ở đâu** → thêm: cách chỗ bạn bao xa, đi bằng gì (about fifteen minutes from my university by motorbike).",
          "**Trông thế nào** → thêm: một **chi tiết nhìn thấy được** (a bright red wooden bridge) + một so sánh (it's not very big — you can walk around it in half an hour).",
          "**Người ta làm gì** → thêm: **hai nhóm người** khác nhau (elderly people… teenagers…) hoặc **hai thời điểm**.",
          "**Vì sao thích** → thêm: nó **giải quyết vấn đề gì** của bạn (I spend most of my week staring at a screen, so…) + một câu giả định (If I had to show a visitor one place, it would be this one).",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Ngôn ngữ band 6 để tả nơi công cộng" },
      {
        t: "patterns",
        rows: [
          {
            formula: "S + is located / situated + in / on / near + nơi",
            vi: "Vị trí (bị động — Ngày 13).",
            examples: [
              { en: "The library is located right in the heart of the city, next to the main square.", vi: "Thư viện nằm ngay giữa trung tâm thành phố, cạnh quảng trường chính." },
            ],
          },
          {
            formula: "S + is surrounded by / is lined with / is connected to + N",
            vi: "Xung quanh có gì, nối với gì.",
            examples: [
              { en: "The lake is surrounded by old trees, and the path is lined with benches.", vi: "Hồ được bao quanh bởi cây cổ thụ, và lối đi có ghế dài hai bên." },
              { en: "The temple is connected to the shore by a red wooden bridge.", vi: "Ngôi đền nối với bờ bằng một cây cầu gỗ đỏ." },
            ],
          },
          {
            formula: "S + was built / was opened + in + năm · S + has been + V3 (renovated / turned into)",
            vi: "Lịch sử và thay đổi.",
            examples: [
              { en: "It was built over a hundred years ago and has recently been renovated.", vi: "Nó được xây hơn một trăm năm trước và mới được tu sửa gần đây." },
              { en: "At weekends the roads are closed to traffic, so the whole area is turned into a walking street.", vi: "Cuối tuần các con đường cấm xe, nên cả khu được biến thành phố đi bộ." },
            ],
          },
          {
            formula: "What I like / find interesting about it is (that) + S + V",
            vi: "Câu nhấn để mở phần cảm nhận.",
            examples: [
              { en: "What I find interesting is that the atmosphere changes completely during the day.", vi: "Điều tôi thấy thú vị là không khí thay đổi hoàn toàn trong ngày." },
            ],
          },
          {
            formula: "It's one of the few places where + S + can + V",
            vi: "Nêu lý do bằng mệnh đề quan hệ where.",
            examples: [
              { en: "It's one of the few places in the city where you can escape from the noise of the traffic.", vi: "Đó là một trong số ít nơi trong thành phố mà bạn có thể thoát khỏi tiếng ồn xe cộ." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Muốn tả", "Band 5", "Band 6 — thay bằng"],
        rows: [
          ["Đông người", "very crowded", "**packed with** families · **bustling** · **full of life**"],
          ["Yên tĩnh", "very quiet", "**peaceful** · **calm** · a place to **clear my head**"],
          ["Đẹp", "very beautiful", "**scenic** · **picturesque** · **well looked after** (được chăm sóc tốt)"],
          ["Nổi tiếng", "very famous", "**well known for** its… · **a symbol of** the city · **a popular spot for**…"],
          ["Không khí", "the air is fresh", "the **atmosphere** is relaxed / lively · there's **a real sense of community**"],
          ["Tới đó", "I go there", "I **drop by** after class · I **hang out** there with friends · I **head there** on Sunday evenings"],
        ],
        caption: "Không cần dùng hết. Chọn 4–5 cụm hợp với nơi của bạn và tập cho quen miệng.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi tả nơi chốn",
        items: [
          "~~It locates in the city centre~~ → It **is located** in… (locate cần bị động khi nói vị trí).",
          "~~There have many trees~~ → **There are** many trees. ~~It has many people go there~~ → **Many people go** there / **It attracts** many people.",
          "“The air is fresh” bị dùng cho mọi nơi (kể cả trung tâm thương mại). Chỉ nói khi đúng; nếu không: the atmosphere is…",
          "~~I feel very relax / comfortable~~ → I feel **relaxed** / **at ease**. ~~It's a relax place~~ → a **relaxing** place.",
          "Kể ba hoạt động bằng ba câu cụt: ~~People walk. People take photo. People do exercise.~~ → Some people **jog** around the lake, **while** others just sit on the benches **and** chat.",
          "Quên trả lời ô cuối (explain why…) vì hết ý ở giây 60. Ô “why” phải chiếm **ít nhất 30 giây** cuối.",
        ],
      },
      { t: "rule", formula: "Vị trí (is located) → trông thế nào (is surrounded by) → theo thời điểm (In the morning… In the evening…) → tôi làm gì → vì sao (It's one of the few places where…)", vi: "Khung 5 bước cho nơi công cộng là vùng đất; công trình thì đổi bước 3 thành “ngoài → trong”." },
      {
        t: "quiz",
        id: "t3d14-noi-ta-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — câu tả nơi công cộng (4 câu)",
        grammar: "S + is located / is surrounded by / was built · It's one of the few places where…",
        items: [
          { q: "Công viên nằm ở trung tâm thành phố, gần nhà ga chính.", answers: ["The park is located in the city centre, near the main station.", "The park is located in the centre of the city, near the main station.", "The park is located in the city center, near the main station.", "The park is situated in the city centre, near the main station.", "The park is in the city centre, near the main station."], hint: "is located in · near the main station" },
          { q: "Quảng trường được bao quanh bởi các quán cà phê và toà nhà cũ.", answers: ["The square is surrounded by cafes and old buildings.", "The square is surrounded by cafés and old buildings.", "The square is surrounded by coffee shops and old buildings."], hint: "is surrounded by" },
          { q: "Thư viện được xây năm 1990 và mới được tu sửa gần đây.", answers: ["The library was built in 1990 and has recently been renovated.", "The library was built in 1990 and has been renovated recently.", "The library was built in 1990 and was recently renovated."], hint: "was built · has recently been renovated" },
          { q: "Đó là một trong số ít nơi mà tôi có thể thư giãn.", answers: ["It's one of the few places where I can relax.", "It is one of the few places where I can relax.", "That's one of the few places where I can relax.", "It's one of the few places I can relax in."], hint: "one of the few places where" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Thẻ đề và 1 phút ghi chú" },
      {
        t: "note",
        title: "📌 Cue card",
        items: [
          "**Describe a public place in your town or city that you like to visit.**",
          "You should say:",
          "• where it is",
          "• what it looks like",
          "• what people do there",
          "and explain why you like visiting it.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ từ khoá (ví dụ: hồ ở trung tâm)",
        center: "the lake (AREA)",
        branches: [
          { label: "where", items: ["heart of city", "15 min · motorbike"] },
          { label: "looks like", items: ["not big — 30 min walk", "old trees · temple · red bridge", "stone tower = symbol"] },
          { label: "people do (by time)", items: ["morning: tai chi, jog — peaceful", "weekend eve: no traffic → walking street", "packed: families, musicians"] },
          { label: "why", items: ["escape noise", "screen all week → clear head", "show a visitor"] },
        ],
        caption: "Động từ của thẻ: like to visit ⇒ thói quen ⇒ hiện tại đơn. Loại: vùng đất ⇒ tả theo thời điểm.",
      },

      /* ── 5 ── */
      { t: "h", text: "5. Nghe và so: band 5 và band 6 cho cùng một thẻ" },
      {
        t: "p",
        text: "Hai bài nói về **cùng một nơi**. Nghe bài band 5 trước và đếm xem có bao nhiêu chi tiết bạn “nhìn thấy” được. Rồi nghe bài band 6 và đánh dấu: các câu **bị động**, các cụm **theo thời điểm**, và câu trả lời cho ô **why**.",
      },
      {
        t: "dialogue",
        title: "Bài nói band 5 (ước tính) — khoảng 45 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about Hoan Kiem Lake. It is in Hanoi, in the centre. It is very beautiful and very famous. There are many tree and a small temple in the lake. Many people go there. They walk and take photo and do exercise. At the weekend the street is close for cars, so it is very crowded. I often go there with my friends. We drink milk tea and talk. I like it because it is beautiful and the air is fresh and I feel relax. That's all.", vi: "Tôi muốn nói về Hồ Hoàn Kiếm. Nó ở Hà Nội, ở trung tâm. Nó rất đẹp và rất nổi tiếng. Có nhiều cây và một ngôi đền nhỏ trong hồ. Nhiều người tới đó. Họ đi bộ, chụp ảnh và tập thể dục. Cuối tuần đường cấm ô tô nên rất đông. Tôi thường tới đó với bạn. Chúng tôi uống trà sữa và nói chuyện. Tôi thích nó vì nó đẹp, không khí trong lành và tôi thấy thư giãn. Hết ạ." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 1 phút 50 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about Hoan Kiem Lake, which is right in the heart of Hanoi, about fifteen minutes from my university by motorbike.", vi: "Tôi muốn nói về Hồ Hoàn Kiếm, nằm ngay giữa trung tâm Hà Nội, cách trường đại học của tôi khoảng mười lăm phút đi xe máy." },
          { who: "Candidate", role: "candidate", text: "It's not a very big lake — you can walk around it in about half an hour — but it's surrounded by old trees, and there's a small temple on an island, which is connected to the shore by a bright red wooden bridge. In the middle of the water there's also an old stone tower, which has become a kind of symbol of the city.", vi: "Hồ không lớn lắm — bạn đi bộ một vòng mất khoảng nửa tiếng — nhưng được bao quanh bởi cây cổ thụ, và có một ngôi đền nhỏ trên đảo, nối với bờ bằng một cây cầu gỗ đỏ tươi. Giữa hồ còn có một tháp đá cổ, đã trở thành một kiểu biểu tượng của thành phố." },
          { who: "Candidate", role: "candidate", text: "What I find interesting is that the atmosphere changes completely during the day. Early in the morning it's really peaceful: elderly people do tai chi, and some people jog around the lake. In the evening, especially at weekends, the roads around it are closed to traffic, so the whole area is turned into a walking street. It gets packed with families, street musicians and groups of teenagers dancing.", vi: "Điều tôi thấy thú vị là không khí thay đổi hoàn toàn trong ngày. Sáng sớm rất yên bình: người cao tuổi tập thái cực quyền, vài người chạy bộ quanh hồ. Buổi tối, nhất là cuối tuần, các con đường quanh hồ cấm xe, nên cả khu được biến thành phố đi bộ. Nơi đây chật kín các gia đình, nghệ sĩ đường phố và các nhóm thiếu niên nhảy." },
          { who: "Candidate", role: "candidate", text: "I usually go there on Sunday evenings with a couple of friends. We just walk around, grab some ice cream and watch the performances.", vi: "Tôi thường tới đó tối Chủ nhật với vài người bạn. Chúng tôi chỉ đi dạo, mua kem và xem biểu diễn." },
          { who: "Candidate", role: "candidate", text: "The main reason I like it is that it's one of the few places in Hanoi where you can escape from the noise of the traffic. I spend most of my week staring at a screen, so being near water and trees helps me clear my head. And if I had to choose one place to show a foreign visitor, it would definitely be this one.", vi: "Lý do chính tôi thích nơi này là vì nó là một trong số ít chỗ ở Hà Nội mà bạn thoát được tiếng ồn xe cộ. Tôi dành phần lớn tuần nhìn chằm chằm vào màn hình, nên ở gần nước và cây giúp tôi đầu óc thoáng ra. Và nếu phải chọn một nơi để dẫn khách nước ngoài tới, chắc chắn sẽ là nơi này." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 5", "Bài band 6", "Bài học"],
        rows: [
          ["**FC**", "~45 giây; câu ngắn rời nhau; kết bằng “That's all”", "~1 phút 50; đi đúng 5 bước; có câu mở phần (What I find interesting is…, The main reason I like it is…)", "Mỗi ô của thẻ **2–3 câu**; ô why ≥ 30 giây"],
          ["**LR**", "beautiful, famous, crowded, the air is fresh", "in the heart of · surrounded by · peaceful · packed with · a symbol of the city · clear my head", "Thay 3 tính từ chung bằng **chi tiết nhìn thấy được**"],
          ["**GRA**", "Câu đơn; lỗi: many tree, take photo, is close, feel relax", "Mệnh đề quan hệ (which is…, where you can…), **4 câu bị động**, câu điều kiện loại 2 (if I had to choose…)", "Mỗi bước có **một câu phức**"],
          ["**P**", "Đọc đều đều, liệt kê", "Nhấn từ nội dung; xuống giọng cuối ý", "Tập /ɪə/ /eə/ ở mục 7: here, near, square, where, area"],
        ],
      },
      {
        t: "note",
        title: "💡 Nơi của bạn là CÔNG TRÌNH? — khung mẫu cho thư viện",
        items: [
          "**Ở đâu + xây khi nào:** The city library is located on the main street, about ten minutes' walk from my flat. It was built in the 1990s and has recently been renovated.",
          "**Ngoài:** From the outside it looks like a huge glass box, and there's a wide flight of steps leading up to the entrance.",
          "**Trong:** Inside, it's divided into three floors. The ground floor is for children's books, while the top floor is a silent study area with large windows.",
          "**Người ta làm gì:** Most people there are students preparing for exams, but you also see retired people reading newspapers.",
          "**Vì sao:** What I like most is the atmosphere — everyone around you is concentrating, so it's almost impossible to be lazy.",
        ],
      },
      {
        t: "mcq",
        id: "t3d14-noi-p2-chon",
        title: "Kiểm tra — Part 2 nơi công cộng (5 câu)",
        items: [
          { q: "Thẻ: “Describe a public place that has been improved recently.” Trục của bài là gì?", options: ["Thói quen tới đó của bạn", "So sánh trước và sau khi thay đổi", "Lịch sử từ lúc xây", "Kế hoạch tới đó trong tương lai"], correct: 1, why: "Động từ has been improved ⇒ kể trước ↔ sau: used to… / has been + V3." },
          { q: "Bạn tả một bảo tàng. Trật tự tả nào hợp nhất?", options: ["Sáng → trưa → tối", "Người già → người trẻ", "Bên ngoài → bên trong → người ta làm gì", "Cảm xúc → vị trí → lịch sử"], correct: 2, why: "Bảo tàng là công trình ⇒ đi từ ngoài vào trong." },
          { q: "Câu nào đúng?", options: ["The market is located near the river.", "The market locates near the river.", "The market is locating near the river.", "The market located near the river."], correct: 0, why: "Nói vị trí: be located (bị động)." },
          { q: "Chọn cách nói band 6 cho “It is very crowded at weekends.”", options: ["It is very very crowded at weekends.", "It has many people at weekends.", "There have a lot of people at weekends.", "It gets packed with families at weekends."], correct: 3, why: "be / get packed with + N. B và C sai cấu trúc (There are…)." },
          { q: "Hết ý ở giây thứ 70. Nên làm gì?", options: ["Nói “That's all” và dừng", "Thêm: nơi này giải quyết vấn đề gì của bạn, hoặc bạn sẽ dẫn ai tới đó", "Lặp lại phần mở đầu", "Im lặng chờ giám khảo hỏi"], correct: 1, why: "Kéo dài ô “why” bằng lý do cá nhân hoặc một câu giả định (If I had to…)." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Part 3 dạng ưu – nhược: hai lợi – một hại – chốt" },
      {
        t: "p",
        text: "Sau Part 2 về nơi công cộng, giám khảo thường hỏi rộng ra về **không gian công cộng trong thành phố**. Một kiểu câu hỏi hay gặp là **ưu – nhược** (Tập 2 Ngày 13 đã nhập môn loại này với khung 5 bước; hôm nay nâng lên band 6 — mở bằng số ý, mặt trái thật ngắn, chốt cân): **What are the advantages of…? · What are the benefits of…? · Are there any disadvantages / drawbacks to…? · Is it a good thing that…?** Đây là bản **nói** của bài Viết hôm nay — nhưng đừng đọc lại bài luận. Một câu trả lời Part 3 dài **30–40 giây**, 5–7 câu.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung trả lời câu hỏi ưu – nhược (30–40 giây)",
        steps: [
          { label: "1. Mở: báo số ý", sub: "Well, I think there are two main benefits." },
          { label: "2. Lợi 1 + giải thích", sub: "The most obvious one is… — when…, people…" },
          { label: "3. Lợi 2 + ví dụ", sub: "The other benefit is…, I'd say. For example,…" },
          { label: "4. Một mặt trái (ngắn)", sub: "The only real downside is… / Having said that,…" },
          { label: "5. Chốt: cân lại", sub: "But on the whole, I think the benefits clearly outweigh that." },
        ],
        caption: "Câu hỏi chỉ hỏi DISADVANTAGES? Đảo lại: hai hại → một lợi nhượng bộ → chốt.",
      },
      {
        t: "table",
        head: ["Bước", "Cụm để nói", "Ghi chú"],
        rows: [
          ["Mở", "I think there are **a couple of** benefits. · Well, **the main advantage is probably**… · **Quite a few**, actually.", "Báo trước số ý giúp bạn và giám khảo cùng theo dõi"],
          ["Lợi", "**The most obvious one is**… · **Another good thing is that**… · **It also means (that)**…", "Văn nói: a good thing, a plus, an upside đều được"],
          ["Hại", "**The only real downside is**… · **One drawback is that**… · **The trouble is**…", "downside / trouble hợp văn nói hơn disadvantage"],
          ["Nhượng bộ", "**Having said that,** … · **Mind you,** … · **That said,** …", "Ôn Tập 3 Ngày 10: ngữ điệu xuống – lên"],
          ["Chốt", "**But on the whole**… · **Overall, I'd say the pros outweigh the cons.** · **So all in all, it's a good thing.**", "pros and cons hơi thân mật: hợp khi NÓI; Task 2 nên dùng advantages / drawbacks"],
        ],
      },
      {
        t: "table",
        head: ["", "Viết Task 2 (bài 2 hôm nay)", "Nói Part 3"],
        rows: [
          ["Độ dài", "250+ từ, 4 đoạn", "5–7 câu, 30–40 giây"],
          ["Từ", "advantages, drawbacks, outweigh", "good thing, plus, downside, pros and cons"],
          ["Nối", "However, … · In addition, …", "Having said that, … · Mind you, … · And also…"],
          ["Ví dụ", "Ví dụ chung về xã hội", "Được dùng ví dụ từ thành phố / trải nghiệm của bạn, rồi nói rộng ra"],
          ["Viết tắt", "Không (do not, it is)", "Có (don't, it's, I'd say)"],
        ],
        caption: "Cùng một kỹ năng “cân hai phía”, hai giọng khác nhau.",
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 5 (ước tính) — khoảng 12 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "What are the advantages of having public spaces like parks and squares in a city?", vi: "Việc thành phố có không gian công cộng như công viên và quảng trường có những lợi ích gì?" },
          { who: "Candidate", role: "candidate", text: "I think it has many advantages. People can relax and do exercise. It is good for health. And children can play. Also the air is fresh. So public spaces is very important.", vi: "Tôi nghĩ nó có nhiều lợi ích. Mọi người có thể thư giãn và tập thể dục. Nó tốt cho sức khoẻ. Và trẻ em có thể chơi. Không khí cũng trong lành. Vậy nên không gian công cộng rất quan trọng." },
        ],
      },
      {
        t: "dialogue",
        title: "Câu trả lời band 6 (ước tính) — khoảng 35 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "What are the advantages of having public spaces like parks and squares in a city?", vi: "Việc thành phố có không gian công cộng như công viên và quảng trường có những lợi ích gì?" },
          { who: "Candidate", role: "candidate", text: "Well, I think there are two main benefits. The most obvious one is health: when there's a park nearby, people are much more likely to go for a walk or do some exercise after work, instead of just sitting at home. The other benefit is social, I'd say. Public spaces are free, so they bring together people who wouldn't normally meet — old and young, rich and poor. The only real downside is the cost: they're expensive to look after, and the land could be used for housing. But on the whole, I think the benefits clearly outweigh that.", vi: "Tôi nghĩ có hai lợi ích chính. Rõ nhất là sức khoẻ: khi có công viên gần nhà, người ta dễ đi dạo hoặc tập thể dục sau giờ làm hơn nhiều, thay vì chỉ ngồi nhà. Lợi ích kia là về mặt xã hội. Không gian công cộng miễn phí, nên chúng đưa những người bình thường không gặp nhau lại gần nhau — già và trẻ, giàu và nghèo. Mặt trái thật sự duy nhất là chi phí: chăm sóc chúng tốn kém, và đất đó có thể dùng làm nhà ở. Nhưng nhìn chung, tôi nghĩ lợi ích rõ ràng nặng hơn điều đó." },
        ],
      },
      {
        t: "dialogue",
        title: "Band 6 (ước tính) — câu hỏi về NHƯỢC điểm",
        lines: [
          { who: "Examiner", role: "examiner", text: "Are there any disadvantages to building large shopping centres in the middle of a city?", vi: "Xây trung tâm thương mại lớn giữa thành phố có bất lợi gì không?" },
          { who: "Candidate", role: "candidate", text: "Yes, a couple, I think. The main one is traffic. A big mall attracts thousands of cars, and the streets in the centre usually weren't designed for that, so the whole area gets jammed at weekends. Another problem is that small family shops nearby tend to lose their customers and close down, which makes the city less interesting. Having said that, malls are convenient, especially in hot or rainy weather, so I can see why they're popular. I just think they'd cause fewer problems if they were built on the edge of the city.", vi: "Có, tôi nghĩ có vài cái. Cái chính là giao thông. Một trung tâm thương mại lớn thu hút hàng nghìn ô tô, mà đường ở trung tâm thường không được thiết kế cho việc đó, nên cả khu kẹt cứng vào cuối tuần. Vấn đề khác là các cửa hàng gia đình nhỏ gần đó thường mất khách và đóng cửa, khiến thành phố kém thú vị đi. Nói vậy chứ, trung tâm thương mại tiện, nhất là khi trời nóng hay mưa, nên tôi hiểu vì sao chúng được ưa chuộng. Tôi chỉ nghĩ chúng sẽ gây ít vấn đề hơn nếu được xây ở rìa thành phố." },
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao hai câu trả lời sau ở band 6",
        items: [
          "**FC:** có trật tự nghe ra được — two main benefits → the most obvious one → the other → the only real downside → but on the whole. Bài band 5 là năm câu rời, không giải thích câu nào.",
          "**LR:** are much more likely to · bring together · look after · gets jammed · close down · on the edge of the city. Paraphrase đề: advantages → benefits; disadvantages → problem / the main one.",
          "**GRA:** câu phức (when…, so…, which makes…), bị động (could be used, weren't designed, were built), điều kiện loại 2 (they'd cause fewer problems if they were built…).",
          "Cả hai đều **có chốt**: But on the whole… / I just think… — không treo “…and yeah”.",
          "Câu hỏi chỉ hỏi advantages nhưng thêm **một** mặt trái ngắn rồi cân lại là được phép và cho thấy bạn nghĩ có chiều sâu. Đừng nói về mặt trái dài hơn phần được hỏi.",
        ],
      },
      { t: "rule", formula: "There are two main benefits. The most obvious one is… The other is… The only real downside is… But on the whole, …", vi: "Khung nói cho câu hỏi ưu – nhược Part 3: 2 ý chính + 1 ý ngược + chốt." },
      {
        t: "mcq",
        id: "t3d14-noi-p3-chon",
        title: "Kiểm tra — Part 3 ưu – nhược (5 câu)",
        items: [
          { q: "Giám khảo: “What are the benefits of living near a park?” Câu mở nào tốt nhất?", options: ["Well, I think there are a couple of benefits.", "Yes, I agree.", "There are many benefits such as benefit one is health.", "I don't live near a park."], correct: 0, why: "Báo số ý rồi đi vào ý. B trả lời nhầm kiểu Yes/No; C sai cấu trúc; D né câu hỏi." },
          { q: "Cụm nào hợp văn NÓI để mở phần mặt trái?", options: ["Conversely, it is argued that", "In contrast to the aforementioned benefits,", "The only real downside is", "Nevertheless, the disadvantages are as follows:"], correct: 2, why: "The only real downside is… tự nhiên khi nói. A, B, D là giọng văn viết trang trọng." },
          { q: "“pros and cons” dùng ở đâu?", options: ["Chỉ trong Writing Task 2", "Trong Speaking; tránh trong Task 2", "Cả hai đều rất nên dùng", "Không dùng ở đâu cả"], correct: 1, why: "pros and cons là cách nói thân mật ⇒ hợp Speaking; Task 2 dùng advantages and disadvantages / benefits and drawbacks." },
          { q: "Câu chốt nào đúng ngữ pháp?", options: ["Overall, the pros outweigh than the cons.", "Overall, the pros are outweigh the cons.", "Overall, the pros outweight the cons.", "Overall, I'd say the pros outweigh the cons."], correct: 3, why: "outweigh + tân ngữ trực tiếp; không than, không are, không chữ t cuối." },
          { q: "Câu hỏi chỉ hỏi về advantages. Bạn có được nhắc một disadvantage không?", options: ["Có — một ý ngắn rồi cân lại, sau khi đã nêu đủ lợi ích", "Không — sẽ bị coi là lạc đề", "Có — nên nói về hại nhiều hơn lợi", "Có — nhưng phải xin phép giám khảo trước"], correct: 0, why: "Trả lời đủ điều được hỏi trước; thêm một ý ngược ngắn + câu chốt cho thấy lập luận có chiều sâu." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phát âm: ba nguyên âm đôi /ɪə/ · /eə/ · /ʊə/" },
      {
        t: "p",
        text: "Tập 1 Ngày 6 đã giới thiệu 8 nguyên âm đôi. Ba âm hôm nay cùng một kiểu: bắt đầu bằng một nguyên âm rõ rồi **trượt về /ə/** (âm “ơ” nhẹ). Giọng Anh-Anh **không đọc chữ r** cuối từ, nên chữ r biến thành chính cái đuôi /ə/ ấy: he**re** /hɪə/, squa**re** /skweə/, tou**r** /tʊə/. Người Việt hay đọc cụt thành một nguyên âm (here thành /hi/, where thành /we/) hoặc thêm âm “r” nặng.",
      },
      {
        t: "table",
        head: ["Âm", "Cách tạo", "Chữ viết hay gặp", "Từ tả nơi chốn"],
        rows: [
          ["**/ɪə/**", "/ɪ/ (“i” ngắn) → /ə/", "ear · eer · ere · ea", "h**ere** · n**ear** · cl**ear** · app**ear** · atmosph**ere** · th**ea**tre · exp**er**ience"],
          ["**/eə/**", "/e/ (“e”) → /ə/", "are · air · ear · ere", "squ**are** · wh**ere** · th**ere** · **air** · st**air**s · r**are** · **area** (âm đầu) · rep**air**"],
          ["**/ʊə/**", "/ʊ/ (“u” ngắn) → /ə/", "our · ure · ur", "t**our** · t**our**ist · s**ure** · sec**ure** · r**ur**al · c**ure**"],
        ],
        caption: "Giọng Anh hiện đại hay đọc sure, poor, tour thành /ʃɔː/, /pɔː/, /tɔː/ — cả hai cách đều đúng. Giọng Mỹ đọc rõ r: /hɪr/, /skwer/, /tʊr/.",
      },
      {
        t: "table",
        head: ["Cặp dễ nhầm", "Từ 1", "Từ 2"],
        rows: [
          ["/ɪə/ ↔ /eə/", "**here** /hɪə/ · **beer** /bɪə/ · **really** /ˈrɪəli/", "**hair** /heə/ · **bear** /beə/ · **rarely** /ˈreəli/"],
          ["/iː/ ↔ /ɪə/", "**bee** /biː/ · **knee** /niː/", "**beer** /bɪə/ · **near** /nɪə/"],
          ["/eɪ/ ↔ /eə/", "**stay** /steɪ/ · **they** /ðeɪ/", "**stair** /steə/ · **there** /ðeə/"],
          ["/uː/ ↔ /ʊə/", "**two** /tuː/", "**tour** /tʊə/"],
        ],
        caption: "here ↔ hair và really ↔ rarely là hai cặp làm đổi hẳn nghĩa câu.",
      },
      {
        t: "note",
        title: "💡 Mẹo luyện ba âm này",
        items: [
          "Tập chậm hai nhịp: “i – ơ” (/ɪə/), “e – ơ” (/eə/), “u – ơ” (/ʊə/), rồi nối nhanh dần thành một âm trượt. Nhịp đầu **dài và rõ**, nhịp sau **ngắn và nhẹ**.",
          "Không cong lưỡi đọc “r” ở cuối khi theo giọng Anh. Nhưng nếu từ sau bắt đầu bằng nguyên âm thì **r được đọc để nối**: the**re i**s /ðeər ɪz/, nea**r a** park /nɪər ə pɑːk/ (linking r — Tập 3 Ngày 3).",
          "**where / there / their / they're**: where /weə/; ba từ còn lại cùng đọc /ðeə/.",
          "Nói to câu mở Part 2 của bạn và kiểm: “…which is n**ear** the main squ**are**, wh**ere** t**our**ists…” — một câu có đủ ba âm.",
        ],
      },
      { t: "rule", formula: "/ɪə/ here · near · clear — /eə/ square · where · air — /ʊə/ tour · sure · rural", vi: "Ba nguyên âm đôi trượt về /ə/: nhịp đầu rõ, đuôi /ə/ nhẹ, không đọc r cuối (giọng Anh)." },
      {
        t: "phatam",
        id: "t3d14-phat-am",
        title: "Luyện phát âm — /ɪə/ · /eə/ · /ʊə/ trong câu tả nơi chốn",
        note: "Câu 1–3: /ɪə/ và /eə/. Câu 4–5: /ʊə/. Câu 6–8: trộn. Trượt nhẹ về /ə/, không cong lưỡi đọc r cuối từ; r chỉ đọc khi nối sang nguyên âm (there is, square is, atmosphere of).",
        items: [
          { text: "The square is near here.", ipa: "ðə skweər ɪz nɪə hɪə", vi: "Quảng trường ở gần đây." },
          { text: "There is a clear view from the stairs.", ipa: "ðeər ɪz ə klɪə vjuː frəm ðə steəz", vi: "Từ cầu thang nhìn ra rất rõ." },
          { text: "We shared a chair in the open air.", ipa: "wi ʃeəd ə tʃeər ɪn ði əʊpən eə", vi: "Chúng tôi ngồi chung một chiếc ghế ngoài trời." },
          { text: "Tourists love the atmosphere of the theatre.", ipa: "tʊərɪsts lʌv ði ætməsfɪər əv ðə θɪətə", vi: "Du khách thích không khí của nhà hát." },
          { text: "I am sure the area is secure.", ipa: "aɪ æm ʃʊə ði eəriə ɪz sɪkjʊə", vi: "Tôi chắc khu vực này an toàn." },
          { text: "It is a rare experience in rural areas.", ipa: "ɪt ɪz ə reər ɪkspɪəriəns ɪn rʊərəl eəriəz", vi: "Đó là trải nghiệm hiếm có ở vùng nông thôn." },
          { text: "Careful repairs took nearly a year.", ipa: "keəfl rɪpeəz tʊk nɪəli ə jɪə", vi: "Việc sửa chữa cẩn thận mất gần một năm." },
          { text: "The tour guide was really sincere.", ipa: "ðə tʊə ɡaɪd wəz rɪəli sɪnsɪə", vi: "Hướng dẫn viên rất chân thành." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện nói — ghi âm, AI chấm" },
      {
        t: "p",
        text: "**Part 2:** 1 phút ghi chú theo sơ đồ ở mục 4 (gạch động từ của thẻ → chọn công trình / vùng đất → 4 nhánh từ khoá), rồi nói **đủ 2 phút**. **Part 3:** mỗi câu 30–40 giây theo khung hai lợi – một hại – chốt. Nghe lại bản ghi và tự chấm bằng bảng ở mục 5 trước khi xem điểm AI.",
      },
      {
        t: "speak",
        id: "t3d14-noi-p2",
        part: "2",
        questions: [
          "Describe a public place in your town or city that you like to visit. You should say: where it is, what it looks like, what people do there, and explain why you like visiting it.",
          "Describe a public building (for example a library, a museum or a station) that you think is interesting. You should say: where it is, what it looks like inside and outside, what people do there, and explain why you find it interesting.",
        ],
      },
      {
        t: "speak",
        id: "t3d14-noi-p3",
        part: "3",
        questions: [
          "What are the advantages of having public spaces like parks and squares in a city?",
          "Are there any disadvantages to building large shopping centres in the middle of a city?",
          "What are the benefits and drawbacks of closing city-centre streets to traffic at weekends?",
          "Is it a good thing that more and more people work from home instead of going to an office?",
        ],
      },
      {
        t: "note",
        title: "💡 Ghi vào Sổ Speaking sau khi luyện",
        items: [
          "Chép lại **câu trả lời ô “why”** của bạn và sửa cho tới khi dài ít nhất ba câu.",
          "Ghi 5 cụm tả nơi chốn bạn đã dùng được (packed with, surrounded by…) và 2 cụm bạn muốn dùng lần sau.",
          "Ngày mai tự hỏi lại câu Part 3 thứ ba và trả lời **không nhìn ghi chú** — đo xem có đủ 30 giây và có câu chốt không.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t3d14-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 14",
    goal: "Ôn trọn Ngày 14: dùng đúng từ AWL sublist 5 và từ vựng quyền lợi lao động, chọn đúng collocation Task 2, nhận dạng đề lợi – hại và lập trường, dựng câu khung outweigh / positive development, chọn cách nói Part 3 ưu – nhược, rồi viết một thân bài “phía nặng” và nói hai câu Part 3.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (44 câu + 1 đoạn viết + 1 lượt nói)",
        items: [
          "**I–III (24 câu)** — từ vựng: AWL sublist 5, nhóm Work, collocation.",
          "**IV (6 câu)** — dịch câu Task 2 về việc làm.",
          "**V–VI (10 câu)** — bài Viết: nhận dạng đề, lập trường, câu khung.",
          "**VII (4 câu)** — bài Nói: Part 2 nơi công cộng + Part 3 ưu – nhược + /ɪə/ /eə/ /ʊə/.",
          "**VIII–IX** — viết một thân bài (AI chấm) và nói hai câu Part 3 (AI chấm).",
          "Đạt: ≥ 32/44. Sai nhiều ở phần nào thì mở lại đúng mục ghi trong tiêu đề phần đó.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ôn nhanh Ngày 14 trước khi làm bài",
        center: "Ngày 14",
        branches: [
          { label: "Từ vựng", items: ["AWL 5: enable sb to · aware of · trend towards", "sick leave · pension · redundancy", "play a role in · pose a threat to"] },
          { label: "Viết lợi – hại", items: ["outweigh = phải nói bên nào nặng", "phía nhẹ trước → câu bản lề → phía nặng", "positive / negative: 3 lập trường"] },
          { label: "Nói Part 2", items: ["đọc động từ của thẻ", "công trình: ngoài → trong", "vùng đất: theo thời điểm"] },
          { label: "Nói Part 3", items: ["2 lợi + 1 hại + chốt", "The only real downside is…", "/ɪə/ here · /eə/ square · /ʊə/ tour"] },
        ],
      },

      { t: "h", text: "I. AWL sublist 5 — điền từ (10 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "quiz",
        id: "t3d14-bt-awl",
        kind: "fill",
        title: "I. Điền MỘT từ (chữ cái đầu đã cho; chia dạng nếu cần)",
        items: [
          { q: "There is a growing t___ towards part-time work.", answers: ["trend"] },
          { q: "Smartphones e___ people to work from almost anywhere.", answers: ["enable"] },
          { q: "From an employer's p___ , training is an investment.", answers: ["perspective"] },
          { q: "Unemployment has d___ from 8 % to 5 % over the past decade.", answers: ["declined", "dropped", "decreased"] },
          { q: "Most parents want their children to have a s___ income.", answers: ["stable", "steady", "secure"] },
          { q: "The company failed to meet its sales t___ for the third year.", answers: ["target", "targets"] },
          { q: "Tourism g___ a large share of the island's income. (hiện tại đơn)", answers: ["generates"] },
          { q: "Men usually earn more, w___ women do more unpaid work at home.", answers: ["whereas", "while", "whilst"] },
          { q: "She decided to p___ a career in medicine.", answers: ["pursue"] },
          { q: "Health and safety rules are useless unless they are properly e___ .", answers: ["enforced"] },
        ],
      },

      { t: "h", text: "II. Từ vựng Work vòng 2 (8 câu) — ôn bài Từ vựng mục 4–5" },
      {
        t: "mcq",
        id: "t3d14-bt-work",
        title: "II. Chọn đáp án đúng",
        items: [
          { q: "Full-time employees are ___ to twenty days of annual leave.", options: ["entitled", "allowed", "deserved", "offered"], correct: 0, why: "be entitled to + N = được hưởng." },
          { q: "He ___ from his job last month to travel around Asia.", options: ["retired", "resigned", "dismissed", "recruited"], correct: 1, why: "resign from = tự xin nghỉ việc. retire = nghỉ hưu." },
          { q: "Doctors often suffer from ___ because of their long hours.", options: ["probation", "promotion", "burnout", "overtime"], correct: 2, why: "burnout = kiệt sức vì làm quá tải." },
          { q: "It is hard to find ___ in a small town.", options: ["a work", "works", "job", "work"], correct: 3, why: "work không đếm được: find work / find a job." },
          { q: "An ___ lets young people learn a trade while earning a wage.", options: ["apprenticeship", "applicant", "unemployment", "allowance"], correct: 0, why: "apprenticeship = học nghề có lương." },
          { q: "She has a ___ job in a bank, so she earns far more than I do.", options: ["well-pay", "well-paid", "high-paying salary", "expensive"], correct: 1, why: "a well-paid job = công việc lương cao." },
          { q: "Civil servants have more job ___ than freelancers.", options: ["safety", "secure", "security", "stable"], correct: 2, why: "job security (danh từ ghép)." },
          { q: "The ___ of the country is ageing: one worker in four is over fifty-five.", options: ["labour", "vacancy", "employee", "workforce"], correct: 3, why: "workforce = lực lượng lao động." },
        ],
      },

      { t: "h", text: "III. Collocation (6 câu) — ôn bài Từ vựng mục 6" },
      {
        t: "quiz",
        id: "t3d14-bt-colloc",
        kind: "fill",
        title: "III. Điền MỘT từ để hoàn chỉnh cụm",
        items: [
          { q: "Teachers ___ a vital role in children's development.", answers: ["play"] },
          { q: "Unemployment has a negative impact ___ mental health.", answers: ["on"] },
          { q: "Artificial intelligence may ___ a threat to office jobs.", answers: ["pose"] },
          { q: "The campaign helped to ___ awareness of workers' rights.", answers: ["raise"] },
          { q: "Companies must strike a ___ between profit and staff welfare.", answers: ["balance"] },
          { q: "Parents should take responsibility ___ their children's behaviour.", answers: ["for"] },
        ],
      },

      { t: "h", text: "IV. Dịch Việt → Anh (6 câu)" },
      {
        t: "quiz",
        id: "t3d14-bt-dich",
        kind: "translate",
        title: "IV. Dịch sang tiếng Anh — dùng cụm gợi ý",
        grammar: "Collocation + whereas / although / outweigh",
        items: [
          { q: "Nhân viên được nghỉ phép có lương, trong khi người làm tự do thì không. (whereas)", answers: ["Employees have paid leave, whereas freelancers do not.", "Employees have paid leave, whereas freelancers don't.", "Employees receive paid leave, whereas freelancers do not.", "Employees get paid leave, whereas freelancers do not.", "Employees have paid holidays, whereas freelancers do not.", "Employees receive paid holidays, whereas freelancers do not.", "Employees get paid holidays, whereas freelancers do not."], hint: "paid leave · whereas freelancers do not" },
          { q: "Thực tập giúp sinh viên tích luỹ kinh nghiệm thực tế. (enable)", answers: ["Internships enable students to gain practical experience.", "An internship enables students to gain practical experience."], hint: "enable students to gain practical experience" },
          { q: "Nhiều công nhân bị cắt giảm khi nhà máy đóng cửa. (made redundant)", answers: ["Many workers were made redundant when the factory closed.", "A lot of workers were made redundant when the factory closed.", "Many workers were made redundant when the factory closed down."], hint: "were made redundant" },
          { q: "Dù tự làm chủ có rủi ro, tôi tin rằng lợi ích của nó nặng hơn bất lợi.", answers: ["Although self-employment is risky, I believe that its advantages outweigh its disadvantages.", "Although self-employment is risky, I believe its advantages outweigh its disadvantages.", "Although self-employment involves risks, I believe that its advantages outweigh its disadvantages.", "Although self-employment involves risks, I believe its advantages outweigh its disadvantages.", "Although self-employment has risks, I believe that its advantages outweigh its disadvantages.", "Although self-employment has risks, I believe its advantages outweigh its disadvantages.", "Although self-employment involves risks, I believe that its benefits outweigh its drawbacks.", "Although self-employment is risky, I believe that its benefits outweigh its drawbacks."], hint: "Although self-employment involves risks, I believe (that) its advantages outweigh its disadvantages" },
          { q: "Theo quan điểm của tôi, đây là một thay đổi tích cực cho người lao động trẻ. (development)", answers: ["In my view, this is a positive development for young workers.", "In my opinion, this is a positive development for young workers.", "In my view, this is a positive development for younger workers.", "In my opinion, this is a positive development for younger workers."], hint: "In my view, this is a positive development for" },
          { q: "Dân số già gây áp lực lên hệ thống lương hưu.", answers: ["An ageing population puts pressure on the pension system.", "An aging population puts pressure on the pension system.", "An ageing population places pressure on the pension system.", "The ageing population puts pressure on the pension system."], hint: "an ageing population · put pressure on · the pension system" },
        ],
      },

      { t: "h", text: "V. Đề lợi – hại: dạng đề, lập trường, bố cục (6 câu) — ôn bài Viết mục 1–4 · 8" },
      {
        t: "mcq",
        id: "t3d14-bt-de",
        title: "V. Chọn đáp án đúng",
        items: [
          { q: "Đề nào BẮT BUỘC bạn nói bên nào nặng hơn?", options: ["What are the advantages and disadvantages of studying abroad?", "Discuss the advantages and disadvantages of studying abroad.", "Do the advantages of studying abroad outweigh the disadvantages?", "Why do students choose to study abroad?"], correct: 2, why: "Chỉ câu có outweigh đòi phải cân và chọn bên." },
          { q: "Bạn cho rằng HẠI nặng hơn. Thân bài 1 nên viết về gì?", options: ["Lợi (phía nhẹ)", "Hại (phía nặng)", "Nguyên nhân của xu hướng", "Giải pháp"], correct: 0, why: "Phía nhẹ trước, phía nặng sau ⇒ thân 1 = lợi, thân 2 = hại." },
          { q: "Câu nào là CÂU BẢN LỀ tốt nhất để mở thân bài 2?", options: ["Secondly, there are also some disadvantages.", "However, I would argue that these benefits are outweighed by two serious problems.", "On the other hand, everything has two sides.", "Moreover, there are many disadvantages too."], correct: 1, why: "B vừa nối đoạn (these benefits) vừa nhắc lập trường (are outweighed by). A, C, D chỉ chuyển đoạn." },
          { q: "Câu nào đúng ngữ pháp?", options: ["The advantages outweight the disadvantages.", "The advantages outweigh than the disadvantages.", "The advantages are outweigh the disadvantages.", "The advantages far outweigh the disadvantages."], correct: 3, why: "outweigh + tân ngữ; far đứng trước để nhấn." },
          { q: "“More people are choosing to live alone. Is this a positive or negative development?” — luận điểm nào hỏng?", options: ["I believe this is largely a negative development.", "Although living alone has some drawbacks, I think this trend is mainly positive.", "This development is both positive and negative.", "In my view, this is a welcome change for young adults."], correct: 2, why: "C không cho biết bên nào nhiều hơn ⇒ chưa phải lập trường. Phải thêm mainly positive / more negative than positive." },
          { q: "Câu “Moreover, the risks mentioned above can be reduced if people save money first.” làm nhiệm vụ gì?", options: ["Nêu một lợi ích mới", "Cân hai phía: cho thấy phần hại khắc phục được", "Viết lại đề", "Nêu nguyên nhân của xu hướng"], correct: 1, why: "Đây là cách cân ③: chỉ ra phía hại có thể giảm ⇒ phía lợi nặng hơn." },
        ],
      },

      { t: "h", text: "VI. Ghép câu khung (4 câu) — ôn bài Viết mục 3 · 8, bài Nói mục 6" },
      {
        t: "build",
        id: "t3d14-bt-ghep",
        title: "VI. Bấm các mảnh theo đúng thứ tự để dựng câu",
        items: [
          { vi: "Tuy nhiên, những bất lợi này bị lấn át bởi hai lợi ích quan trọng.", chips: ["However,", "these drawbacks", "are outweighed", "by", "two important benefits.", "outweigh", "than"], answer: ["However,", "these drawbacks", "are outweighed", "by", "two important benefits."] },
          { vi: "Dù xu hướng này có vài bất lợi, tôi tin nó chủ yếu là tích cực.", chips: ["Although", "this trend", "has some drawbacks,", "I believe", "it is mainly positive.", "but", "Despite"], answer: ["Although", "this trend", "has some drawbacks,", "I believe", "it is mainly positive."] },
          { vi: "Nhìn chung, đây là một thay đổi đáng mừng cho hầu hết người lao động.", chips: ["On balance,", "this is", "a welcome change", "for most workers.", "On the balance,", "to"], answer: ["On balance,", "this is", "a welcome change", "for most workers."] },
          { vi: "(Nói) Mặt trái thật sự duy nhất là chi phí.", chips: ["The only", "real downside", "is", "the cost.", "are", "downsides"], answer: ["The only", "real downside", "is", "the cost."] },
        ],
      },

      { t: "h", text: "VII. Nói: Part 2 nơi công cộng · Part 3 ưu – nhược · phát âm (4 câu) — ôn bài Nói mục 2 · 6 · 7" },
      {
        t: "mcq",
        id: "t3d14-bt-noi",
        title: "VII. Chọn đáp án đúng",
        items: [
          { q: "Bạn tả một công viên (vùng đất). Bước 3 của khung nên là gì?", options: ["Tả không khí theo thời điểm: sáng ↔ tối, ngày thường ↔ cuối tuần", "Tả từ ngoài vào trong", "Kể lịch sử từng năm", "Nêu giá vé"], correct: 0, why: "Vùng đất ⇒ tả theo thời điểm; công trình mới tả ngoài → trong." },
          { q: "Câu nào đúng?", options: ["The lake surrounds by old trees.", "The lake is surrounded by old trees.", "The lake is surrounding by old trees.", "The lake surrounded with old trees."], correct: 1, why: "be surrounded by (bị động)." },
          { q: "Giám khảo: “Are there any drawbacks to living in the city centre?” Câu trả lời nào theo đúng khung?", options: ["No.", "City centre is very good. I like it.", "Yes, a couple. The main one is noise… Another problem is the cost of rent… Having said that, it's convenient, so for young people I think it's still worth it.", "The advantages are transport, shops, jobs and entertainment."], correct: 2, why: "C: hai hại + giải thích → một lợi nhượng bộ → chốt. D trả lời sai phía được hỏi." },
          { q: "Từ nào có âm /eə/?", options: ["near", "tour", "here", "square"], correct: 3, why: "square /skweə/. near /nɪə/, here /hɪə/, tour /tʊə/." },
        ],
      },

      { t: "h", text: "VIII. Viết thân bài 2 — “phía nặng” (90–110 từ) — AI chấm" },
      {
        t: "essay",
        id: "t3d14-bt-viet",
        task: "Task 2",
        prompt: "Topic: In many countries, more and more university students have a part-time job while they are studying. Do the advantages of this outweigh the disadvantages? — Write ONLY the SECOND body paragraph (90–110 words): the side you think is stronger. Start with a linking sentence such as “However, I would argue that these problems are outweighed by …” or “However, I believe that these benefits are outweighed by …”, give two points with explanation, and finish with one sentence that weighs the two sides.",
        minWords: 90,
        tips: [
          "Câu 1 = câu bản lề: However, … are outweighed by …",
          "Hai ý, mỗi ý 2 câu: nêu → giải thích / ví dụ (gain experience · earn a living · workload · burnout · career prospects).",
          "Câu cuối = câu cân: whereas… / can be reduced if… / As a result,…",
          "Có ít nhất một câu phức (which, whereas, if) và một câu bị động.",
        ],
      },

      { t: "h", text: "IX. Nói 2 câu Part 3 — ghi âm, AI chấm" },
      {
        t: "speak",
        id: "t3d14-bt-noi-p3",
        part: "3",
        questions: [
          "What are the advantages of having a large public library in a city?",
          "Are there any disadvantages when a city has too many tourists visiting its public places?",
        ],
      },
      {
        t: "note",
        title: "💡 Tự chấm phần IX trước khi xem điểm AI",
        items: [
          "Mỗi câu có đủ **30 giây** không?",
          "Có báo số ý ở câu mở không (two main benefits / a couple of problems)?",
          "Mỗi ý có **một câu giải thích** không?",
          "Có **một ý ngược** ngắn (The only real downside is… / Having said that,…) không?",
          "Có **câu chốt** (But on the whole… / So all in all…) không — hay bạn kết bằng “…and yeah”?",
        ],
      },
    ],
  },
];
