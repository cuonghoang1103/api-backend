/**
 * IELTS Tập 5 — Ngày 22 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 * 🔬 NGÀY MỔ SPEAKING ĐỀ 10 (docs/ielts-lo-trinh-0-8.md mục 3.5 hàng 22; khuôn N mod 4 = 2 ⇒ vocab · writing · SPEAKING · homework).
 *   Bài 1 (vocab)     Từ cho đề Task 2 lạ: đạo đức · AI · vũ trụ · di truyền (39 từ) + Social issues & equality VÒNG 2 (11 từ) — 50 mục
 *                     `vocab` MỚI (đã đối chiếu mọi khối vocab Tập 3–5: không trùng; các từ vòng 1 như algorithmic bias, surveillance,
 *                     space exploration, genetic engineering, social mobility chỉ ôn ở bài kiểm đầu) + 6 cặp dễ nhầm + kho ý cho bốn đề
 *                     Task 2 lạ                                                                                 [VC33 · mục 3.6 “N22 VC33 vòng 2”]
 *                     — nối Tập 3 Ngày 9 · 22 (công nghệ, khoa học) · Tập 4 Ngày 16 (VC33 vòng 1) · Tập 4 Ngày 28 · Tập 5 Ngày 14.
 *   Bài 2 (writing)   Bài phản biện học thuật ~300 từ (critical response) [W21 E09]: khung 4 khối, 8 lỗ hổng lập luận (tương quan ≠ nhân
 *                     quả, không có nhóm so sánh, hồi quy về trung bình, mẫu tự chọn, xung đột lợi ích…), động từ tường thuật CÓ LẬP
 *                     TRƯỜNG; đề: thông cáo báo chí HƯ CẤU về hệ thống tuần tra dùng AI ở thành phố Carrow; bài mẫu band 7 và band 8 cạnh
 *                     nhau; luyện: thông cáo HƯ CẤU của một ứng dụng học tiếng + một đề Task 2 về chỉnh sửa gen (đoạn phản bác).
 *                     — nối Tập 3 Ngày 26 (báo cáo ngắn) · Tập 4 Ngày 10 · 24 (động từ tường thuật, tóm tắt bài giảng) · Tập 4 Ngày 2
 *                       (Granted… but) · Tập 5 Ngày 12 (nhóm đối chứng) · Ngày 21 (câu chẻ khi nói).
 *   Bài 3 (speaking)  MỔ SPEAKING ĐỀ 10 theo 4 tiêu chí + paraphrase tinh [S06 S10 S17]: đọc `thi-may/de/noi-de10.ts`, chỉ trích NGẮN câu hỏi
 *                     và vài cụm của bài mẫu; mổ 6 câu Part 1 (Colours · Weekends), thẻ Part 2 (truyền thống mong được giữ), 5 câu Part 3
 *                     theo 5 loại; viết MỚI bản band 7 cho thẻ Part 2 và bản band 7 ↔ band 8 cho câu Part 3 chính sách (bài mẫu của đề
 *                     không có câu này); thang 4 mức paraphrase câu hỏi; luyện lại bằng câu MỚI: Part 1 Gifts · Snacks, thẻ Part 2 “a
 *                     custom from another culture you find interesting” · “a gift that took you a long time to choose”, Part 3 Customs
 *                     and visitors. 🔊 trọng âm từ dài của chủ đề truyền thống – xã hội.
 *   Bài tập Ngày 22   37 câu có đáp án + 1 đoạn phản biện ngắn + 2 speak.
 * Đã grep tap-3…tap-5/ngay + thi-may/de: informed consent, gene editing, designer babies, terraform, tokenism, universal basic income,
 * press release, survivorship, Carrow, Gifts, Snacks = 0 kết quả; thẻ Part 2 mới không trùng thẻ nào (đã so danh sách 118 thẻ).
 * Mọi tên người, tổ chức, số liệu trong đề phản biện là HƯ CẤU. Mọi id bắt đầu `t5d22-`.
 */
import type { Lesson } from '../data';

export const NGAY_22: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d22-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Đề Task 2 lạ — đạo đức, AI, vũ trụ, di truyền + Vấn đề xã hội vòng 2 (50 từ)",
    goal: "Có đủ 50 từ và cụm ở mức band 8 để viết và nói về bốn chủ đề “lạ” của Task 2 và Part 3 — đạo đức (informed consent, moral hazard, complicit), AI (black box, human in the loop, liability), vũ trụ (low Earth orbit, spin-off, planetary protection), di truyền (germline, heritable, designer babies) — và về bất bình đẳng ở mức sâu hơn vòng 1 (systemic, entrenched, tokenism, food insecurity); không nhầm sáu cặp dễ lẫn (hereditary / heritable, autonomous / automated…).",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Đề Task 2 “lạ” hiếm khi lạ về CẤU TRÚC — chúng lạ về **từ vựng**. Người band 7 viết được đề công nghệ, nhưng gặp “Should the genetic modification of human embryos be permitted?” thì chỉ còn genetic engineering và “it is dangerous”.",
          "Bốn nhóm mới: **đạo đức** (10) · **AI** (10) · **vũ trụ** (9) · **di truyền** (10). Mỗi nhóm có từ để NÊU VẤN ĐỀ, từ để LẬP LUẬN và một cụm nói khéo.",
          "**Social issues vòng 2** (11 từ): vòng 1 (Tập 4 Ngày 16) có inequality, welfare, discrimination… Vòng 2 nói về CƠ CHẾ: systemic, entrenched, social exclusion, redistribution, tokenism.",
          "Sáu cặp dễ nhầm: hereditary / heritable / inherited · autonomous / automated · ethical / moral · positive discrimination / affirmative action · explainable / transparent · terraform / colonise.",
          "Cuối bài: kho ý cho bốn đề lạ — mỗi đề hai góc nhìn và từ để dùng. Bài 2 (phản biện) và Bài 3 (Part 3) sẽ dùng lại.",
        ],
      },

      { t: "h", text: "Vòng 1 đã học gì — kiểm nhanh trước khi lên vòng 2" },
      { t: "p", text: "Năm từ dưới đây đã học ở Tập 3 Ngày 9 · 22 và Tập 4 Ngày 16. Điền đúng ít nhất 4 thì học tiếp; sai từ 2 câu thì mở lại hai ngày đó trước." },
      {
        t: "quiz", id: "t5d22-on-dau-bai", kind: "fill", title: "Ôn vòng 1 (5 câu) — điền MỘT từ hoặc cụm",
        items: [
          { q: "1. If the training data is skewed, the system may show algorithmic ___ against certain groups.", answers: ["bias"], hint: "algorithmic bias — Tập 4." },
          { q: "2. Cameras on every corner have raised fears of mass ___.", answers: ["surveillance"], hint: "mass surveillance — giám sát diện rộng." },
          { q: "3. Critics argue that the billions spent on space ___ should go to problems on Earth.", answers: ["exploration"], hint: "space exploration — Tập 3." },
          { q: "4. Genetic ___ of crops remains controversial in Europe.", answers: ["engineering", "modification"], hint: "genetic engineering / genetic modification." },
          { q: "5. Free university education is often defended as a way of increasing social ___.", answers: ["mobility"], hint: "social mobility — khả năng đổi tầng lớp (Tập 4 Ngày 16)." },
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Đạo đức — mười từ cho câu hỏi “có nên…?”" },
      {
        t: "sodo", kind: "mindmap", title: "Đạo đức — ba việc của từ vựng",
        center: "**Ethics** trong Task 2",
        branches: [
          { label: "Nêu nguyên tắc", items: ["informed consent", "duty of care", "dignity", "cross a red line"] },
          { label: "Gọi tên lập luận", items: ["utilitarian", "paternalistic", "moral hazard"] },
          { label: "Gọi tên trách nhiệm", items: ["conflict of interest", "complicit", "whistle-blower"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "informed consent", pos: "n", ipa: "/ɪnˌfɔːmd kənˈsent/", vi: "sự đồng ý sau khi đã được giải thích đầy đủ (rủi ro, mục đích)", ex: "No patient should be included in a trial without informed consent.", exVi: "Không bệnh nhân nào được đưa vào thử nghiệm mà chưa đồng ý sau khi được giải thích đầy đủ.", more: "give / obtain informed consent · Task 2 dữ liệu: users rarely give informed consent — they click “agree”" },
          { w: "conflict of interest", pos: "n", ipa: "/ˌkɒnflɪkt əv ˈɪntrəst/", vi: "xung đột lợi ích", ex: "A study funded by the company that sells the product has an obvious conflict of interest.", exVi: "Một nghiên cứu do chính công ty bán sản phẩm tài trợ có xung đột lợi ích rõ ràng.", more: "↺ Ôn lại — đã học ở Tập 5 Ngày 20 (mục Science). Hôm nay dùng nó trong bài phản biện (Bài 2): khi người tài trợ được lợi từ kết quả · declare a conflict of interest · số nhiều: conflicts of interest" },
          { w: "paternalistic", pos: "adj", ipa: "/pəˌtɜːnəˈlɪstɪk/", vi: "kiểu gia trưởng — quyết định thay người khác “vì lợi ích của họ”", ex: "Banning sugary drinks is often criticised as paternalistic.", exVi: "Cấm đồ uống có đường thường bị chê là gia trưởng.", more: "paternalism (n) · a paternalistic government / approach · phản biện: adults should be free to make their own mistakes" },
          { w: "utilitarian", pos: "adj", ipa: "/ˌjuːtɪlɪˈteəriən/", vi: "theo thuyết vị lợi — đúng là thứ mang lại nhiều lợi ích nhất cho nhiều người nhất", ex: "A purely utilitarian argument would sacrifice a few for the benefit of many.", exVi: "Một lập luận thuần vị lợi sẽ hy sinh số ít vì lợi ích của số đông.", more: "utilitarianism (n) · nghĩa thứ hai: thực dụng, chỉ cần dùng được (a utilitarian building)" },
          { w: "moral hazard", pos: "n", ipa: "/ˌmɒrəl ˈhæzəd/", vi: "rủi ro đạo đức — được bảo vệ khỏi hậu quả nên người ta liều hơn", ex: "Bailing out banks creates a moral hazard: they may take the same risks again.", exVi: "Cứu trợ ngân hàng tạo ra rủi ro đạo đức: họ có thể lại liều như cũ.", more: "create / pose a moral hazard · không phải “mối nguy đạo đức” chung chung — là thuật ngữ kinh tế" },
          { w: "duty of care", pos: "n", ipa: "/ˌdjuːti əv ˈkeə/", vi: "nghĩa vụ phải chăm lo, bảo vệ (của người có trách nhiệm với người khác)", ex: "Social media platforms arguably have a duty of care towards child users.", exVi: "Có thể nói các nền tảng mạng xã hội có nghĩa vụ bảo vệ người dùng trẻ em.", more: "owe sb a duty of care · breach a duty of care (vi phạm) · schools / employers / doctors" },
          { w: "complicit", pos: "adj", ipa: "/kəmˈplɪsɪt/", vi: "đồng loã", ex: "By staying silent, the shareholders became complicit in the abuse.", exVi: "Bằng cách im lặng, các cổ đông đã trở nên đồng loã với sự lạm dụng.", more: "be complicit in sth · complicity (n) · KHÔNG nhầm với complicated" },
          { w: "whistle-blower", pos: "n", ipa: "/ˈwɪsl bləʊə/", vi: "người tố giác sai phạm từ bên trong tổ chức", ex: "Whistle-blowers need legal protection if they are to speak up.", exVi: "Người tố giác cần được pháp luật bảo vệ thì mới dám lên tiếng.", more: "blow the whistle on sth · whistle-blowing (n) · protect whistle-blowers" },
          { w: "dignity", pos: "n", ipa: "/ˈdɪɡnəti/", vi: "phẩm giá", ex: "Care for the elderly should preserve their dignity, not just keep them safe.", exVi: "Chăm sóc người già phải giữ được phẩm giá của họ, không chỉ giữ an toàn.", more: "human dignity · treat sb with dignity · loss of dignity · dignified (adj)" },
          { w: "cross a red line", pos: "phr", ipa: "/krɒs ə red ˈlaɪn/", vi: "vượt lằn ranh đỏ (điều không được phép làm)", ex: "Many scientists believe that editing human embryos crosses a red line.", exVi: "Nhiều nhà khoa học tin rằng chỉnh sửa phôi người là vượt lằn ranh đỏ.", more: "draw a red line · a red line for sb · Part 3: Where I'd draw the line is…" },
        ],
      },
      {
        t: "quiz", id: "t5d22-dao-duc", kind: "fill", title: "Đạo đức — điền MỘT từ (4 câu)",
        items: [
          { q: "1. The trial was halted when it emerged that participants had not given ___ consent.", answers: ["informed"], hint: "informed consent." },
          { q: "2. Insuring people against every loss can create a moral ___.", answers: ["hazard"], hint: "moral hazard." },
          { q: "3. Critics call the ban ___: adults, they say, can decide for themselves.", answers: ["paternalistic"], hint: "paternalistic — quyết định thay người khác." },
          { q: "4. The company was accused of being ___ in the cover-up.", answers: ["complicit"], hint: "be complicit in sth." },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Trí tuệ nhân tạo — mười từ vượt qua “AI will take our jobs”" },
      { t: "p", text: "Vòng 1 (Tập 4) có algorithmic bias, machine learning, training data, deepfake, facial recognition. Vòng 2 cho bạn từ để nói CHÍNH XÁC hơn: AI thay việc hay hỗ trợ việc, quyết định của máy có giải thích được không, ai chịu trách nhiệm khi máy sai." },
      {
        t: "vocab",
        items: [
          { w: "automation", pos: "n", ipa: "/ˌɔːtəˈmeɪʃn/", vi: "sự tự động hoá", ex: "Automation has already transformed warehouses and call centres.", exVi: "Tự động hoá đã làm thay đổi các kho hàng và tổng đài.", more: "automate (v) · automated (adj) · the automation of routine tasks · cặp dễ nhầm ở mục 6" },
          { w: "autonomous", pos: "adj", ipa: "/ɔːˈtɒnəməs/", vi: "tự hành, tự quyết định (không cần người điều khiển)", ex: "Who is responsible when an autonomous vehicle causes an accident?", exVi: "Ai chịu trách nhiệm khi xe tự hành gây tai nạn?", more: "autonomous vehicles / weapons / systems · autonomy (n) = quyền tự chủ (cũng dùng cho người)" },
          { w: "black box", pos: "n", ipa: "/ˌblæk ˈbɒks/", vi: "“hộp đen” — hệ thống mà ta thấy đầu vào, đầu ra nhưng không hiểu bên trong", ex: "If a loan is refused by a black box, the applicant cannot challenge the decision.", exVi: "Nếu khoản vay bị một “hộp đen” từ chối, người vay không thể khiếu nại quyết định.", more: "a black-box algorithm / model · trái: explainable AI" },
          { w: "explainable", pos: "adj", ipa: "/ɪkˈspleɪnəbl/", vi: "giải thích được (lý do máy ra quyết định)", ex: "Decisions about people's health should be explainable to the people affected.", exVi: "Quyết định về sức khoẻ của người dân phải giải thích được cho chính những người chịu ảnh hưởng.", more: "explainable AI · explainability (n) · cặp dễ nhầm với transparent ở mục 6" },
          { w: "hallucinate", pos: "v", ipa: "/həˈluːsɪneɪt/", vi: "(AI) bịa ra thông tin nghe có vẻ đúng", ex: "Chatbots can hallucinate references that do not exist.", exVi: "Chatbot có thể bịa ra những tài liệu tham khảo không tồn tại.", more: "hallucination (n) · nghĩa gốc: bị ảo giác · Task 2: tools that confidently hallucinate facts" },
          { w: "human in the loop", pos: "phr", ipa: "/ˌhjuːmən ɪn ðə ˈluːp/", vi: "có con người tham gia kiểm duyệt trong quy trình", ex: "Medical AI should keep a human in the loop for every final decision.", exVi: "AI y tế nên luôn có con người tham gia ở mọi quyết định cuối cùng.", more: "keep a human in the loop · human oversight · Part 3: I'd want a human in the loop" },
          { w: "job displacement", pos: "n", ipa: "/ˈdʒɒb dɪsˌpleɪsmənt/", vi: "việc người lao động bị mất / bị đẩy khỏi công việc", ex: "Retraining schemes can soften the impact of job displacement.", exVi: "Các chương trình đào tạo lại có thể giảm nhẹ tác động của việc mất việc.", more: "displace workers · displacement (n) cũng dùng cho người tị nạn · gần: redundancy (Anh–Anh)" },
          { w: "augment", pos: "v", ipa: "/ɔːɡˈment/", vi: "tăng cường, bổ trợ (chứ không thay thế)", ex: "The best tools augment human judgement rather than replace it.", exVi: "Công cụ tốt nhất bổ trợ phán đoán của con người chứ không thay thế nó.", more: "augment rather than replace · augmented reality · khung tranh luận: augment vs automate" },
          { w: "the alignment problem", pos: "n", ipa: "/ði əˈlaɪnmənt ˌprɒbləm/", vi: "bài toán “căn chỉnh” — làm sao để AI theo đúng mục tiêu, giá trị con người muốn", ex: "The alignment problem becomes more serious as systems become more capable.", exVi: "Bài toán căn chỉnh càng nghiêm trọng khi hệ thống càng mạnh.", more: "align sth with sth · be aligned with human values · thuật ngữ — dùng một lần, giải thích ngắn" },
          { w: "liability", pos: "n", ipa: "/ˌlaɪəˈbɪləti/", vi: "trách nhiệm pháp lý (phải bồi thường)", ex: "The law is unclear about liability when software makes a harmful decision.", exVi: "Luật chưa rõ về trách nhiệm pháp lý khi phần mềm ra quyết định gây hại.", more: "accept / deny liability · be liable for · nghĩa thứ hai: gánh nặng (He's a liability to the team)" },
        ],
      },
      {
        t: "quiz", id: "t5d22-ai", kind: "fill", title: "AI — điền MỘT từ (4 câu)",
        items: [
          { q: "1. Doctors are more likely to trust a system whose decisions are ___.", answers: ["explainable"], hint: "explainable — giải thích được." },
          { q: "2. The software should ___ teachers' work, not replace it.", answers: ["augment"], hint: "augment rather than replace." },
          { q: "3. Several lawyers were embarrassed when the chatbot they used ___ court cases that never existed.", answers: ["hallucinated"], hint: "hallucinate — quá khứ: hallucinated." },
          { q: "4. When an ___ car crashes, it is unclear whether the owner or the manufacturer is to blame.", answers: ["autonomous"], hint: "autonomous vehicle." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Vũ trụ — chín từ cho đề “tiền cho vũ trụ hay cho Trái Đất?”" },
      { t: "p", text: "Đề vũ trụ gần như luôn là câu hỏi về **tiền và ưu tiên**: chi cho thám hiểm có đáng không, tư nhân hoá có tốt không, có nên đưa người lên sao Hoả. Chín từ dưới giúp bạn nói cụ thể thay vì “space is interesting”." },
      {
        t: "vocab",
        items: [
          { w: "commercial spaceflight", pos: "n", ipa: "/kəˌmɜːʃl ˈspeɪsflaɪt/", vi: "bay vũ trụ thương mại (do công ty tư nhân)", ex: "Commercial spaceflight has made launches far cheaper than they were.", exVi: "Bay vũ trụ thương mại đã làm việc phóng tàu rẻ hơn rất nhiều so với trước.", more: "the commercial space industry · private space companies" },
          { w: "space tourism", pos: "n", ipa: "/ˈspeɪs ˌtʊərɪzəm/", vi: "du lịch vũ trụ", ex: "Space tourism is criticised as a playground for the super-rich.", exVi: "Du lịch vũ trụ bị chê là sân chơi của giới siêu giàu.", more: "a space tourist · Task 2: a luxury with a large carbon footprint" },
          { w: "low Earth orbit", pos: "n", ipa: "/ˌləʊ ɜːθ ˈɔːbɪt/", vi: "quỹ đạo Trái Đất tầm thấp (nơi hầu hết vệ tinh hoạt động)", ex: "Thousands of satellites now crowd low Earth orbit.", exVi: "Hàng nghìn vệ tinh giờ chen chúc ở quỹ đạo tầm thấp.", more: "viết tắt LEO · in orbit · orbit (v) the Earth · nối space debris (Tập 3)" },
          { w: "payload", pos: "n", ipa: "/ˈpeɪləʊd/", vi: "khối hàng hữu ích mà tên lửa mang (vệ tinh, thiết bị…)", ex: "Reusable rockets have cut the cost of putting a payload into orbit.", exVi: "Tên lửa tái sử dụng đã cắt giảm chi phí đưa khối hàng lên quỹ đạo.", more: "carry / launch / deliver a payload · nghĩa rộng: phần “hàng” có ích (của email độc hại…)" },
          { w: "probe", pos: "n", ipa: "/prəʊb/", vi: "tàu thăm dò không người lái", ex: "Unmanned probes have sent back images from the edge of the solar system.", exVi: "Tàu thăm dò không người lái đã gửi về hình ảnh từ rìa hệ Mặt Trời.", more: "a space probe · probe (v) = điều tra kỹ (probe into the causes) · Task 2: probes are cheaper and safer than crewed missions" },
          { w: "habitable", pos: "adj", ipa: "/ˈhæbɪtəbl/", vi: "có thể sinh sống được", ex: "No other habitable planet has yet been confirmed.", exVi: "Chưa có hành tinh nào khác được xác nhận là có thể sinh sống.", more: "uninhabitable · habitable zone · KHÔNG nhầm với inhabited (đã có người ở)" },
          { w: "terraform", pos: "v", ipa: "/ˈterəfɔːm/", vi: "cải tạo một hành tinh cho giống Trái Đất", ex: "Plans to terraform Mars remain science fiction for now.", exVi: "Kế hoạch cải tạo sao Hoả cho giống Trái Đất hiện vẫn là khoa học viễn tưởng.", more: "terraforming (n) · lập luận: it would be easier to repair Earth than to terraform Mars" },
          { w: "spin-off", pos: "n", ipa: "/ˈspɪn ɒf/", vi: "sản phẩm / lợi ích phụ ra đời từ một dự án lớn", ex: "Advances in water purification were a spin-off from space research.", exVi: "Những tiến bộ trong lọc nước là lợi ích phụ từ nghiên cứu vũ trụ.", more: "spin-off technology / benefits · Task 2: the case for space spending often rests on spin-offs" },
          { w: "planetary protection", pos: "n", ipa: "/ˌplænətri prəˈtekʃn/", vi: "nguyên tắc bảo vệ hành tinh (tránh mang vi sinh vật đi / về)", ex: "Planetary protection rules require probes to be sterilised before launch.", exVi: "Quy tắc bảo vệ hành tinh yêu cầu tàu thăm dò phải được tiệt trùng trước khi phóng.", more: "contaminate another planet · đề đạo đức: do we have the right to alter another world?" },
        ],
      },
      {
        t: "quiz", id: "t5d22-vu-tru", kind: "fill", title: "Vũ trụ — điền MỘT từ (4 câu)",
        items: [
          { q: "1. Unmanned ___ can explore places that would kill a human crew.", answers: ["probes"], hint: "probe — số nhiều." },
          { q: "2. Supporters point to useful ___, such as improved materials and imaging.", answers: ["spin-offs", "spinoffs"], hint: "spin-off — lợi ích phụ (số nhiều)." },
          { q: "3. Even the most promising planet would take centuries to ___.", answers: ["terraform"], hint: "terraform — cải tạo cho giống Trái Đất." },
          { q: "4. Each launch puts more satellites into low Earth ___.", answers: ["orbit"], hint: "low Earth orbit." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Di truyền — mười từ cho đề chỉnh sửa gen" },
      {
        t: "table", caption: "Ba tầng của một đề di truyền — mỗi tầng một nhóm từ",
        head: ["Tầng", "Câu hỏi", "Từ"],
        rows: [
          ["Kỹ thuật", "làm được gì?", "genome · gene editing · gene therapy · genetically modified"],
          ["Phạm vi", "ảnh hưởng tới ai, bao lâu?", "germline · heritable · hereditary"],
          ["Đạo đức", "có nên không, giới hạn ở đâu?", "designer babies · eugenics · playing God"],
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "genome", pos: "n", ipa: "/ˈdʒiːnəʊm/", vi: "bộ gen (toàn bộ thông tin di truyền của một sinh vật)", ex: "Sequencing a human genome now costs a fraction of what it once did.", exVi: "Giải trình tự một bộ gen người giờ chỉ tốn một phần nhỏ so với trước.", more: "sequence / map a genome · genomic (adj) · genomics (n)" },
          { w: "gene editing", pos: "n", ipa: "/ˈdʒiːn ˌedɪtɪŋ/", vi: "chỉnh sửa gen", ex: "Gene editing could one day eliminate some inherited diseases.", exVi: "Chỉnh sửa gen một ngày nào đó có thể loại bỏ một số bệnh di truyền.", more: "edit genes · genome editing · cụ thể hơn genetic engineering (Tập 3)" },
          { w: "germline", pos: "n / adj", ipa: "/ˈdʒɜːmlaɪn/", vi: "dòng mầm (tế bào trứng, tinh trùng, phôi — thay đổi sẽ truyền cho đời sau)", ex: "Most countries ban germline editing in humans.", exVi: "Hầu hết các nước cấm chỉnh sửa dòng mầm ở người.", more: "germline editing / changes · trái: somatic (chỉ ảnh hưởng một người)" },
          { w: "heritable", pos: "adj", ipa: "/ˈherɪtəbl/", vi: "có thể truyền lại cho đời sau (về mặt sinh học)", ex: "Changes made to an embryo would be heritable.", exVi: "Thay đổi trên phôi sẽ truyền lại cho đời sau.", more: "a heritable trait · heritability (n) · cặp dễ nhầm mục 6" },
          { w: "hereditary", pos: "adj", ipa: "/həˈredɪtri/", vi: "di truyền (bệnh, đặc điểm); cha truyền con nối (tước vị)", ex: "The condition is hereditary, so her children were tested.", exVi: "Bệnh này có tính di truyền, nên con cô ấy đã được xét nghiệm.", more: "a hereditary disease / title / monarchy · cặp dễ nhầm mục 6" },
          { w: "genetically modified", pos: "adj", ipa: "/dʒəˌnetɪkli ˈmɒdɪfaɪd/", vi: "biến đổi gen", ex: "Genetically modified crops can resist drought and pests.", exVi: "Cây trồng biến đổi gen có thể chịu hạn và kháng sâu bệnh.", more: "viết tắt GM · GM food / crops · genetic modification (n)" },
          { w: "designer babies", pos: "n", ipa: "/dɪˌzaɪnə ˈbeɪbiz/", vi: "“em bé thiết kế” — trẻ được chọn đặc điểm bằng can thiệp gen", ex: "Opponents fear that treating disease will lead to designer babies.", exVi: "Người phản đối lo rằng chữa bệnh sẽ dẫn tới “em bé thiết kế”.", more: "cách nói báo chí, mang sắc thái phê phán · Task 2 dùng một lần, có ngoặc kép hoặc so-called" },
          { w: "gene therapy", pos: "n", ipa: "/ˈdʒiːn ˌθerəpi/", vi: "liệu pháp gen (chữa bệnh bằng cách sửa / thay gen)", ex: "Gene therapy has restored some sight to patients with a rare eye disease.", exVi: "Liệu pháp gen đã giúp một số bệnh nhân mắc bệnh mắt hiếm gặp nhìn thấy trở lại phần nào.", more: "undergo gene therapy · khác gene editing ở mục đích: chữa bệnh cho một người" },
          { w: "eugenics", pos: "n", ipa: "/juːˈdʒenɪks/", vi: "thuyết ưu sinh (cải thiện giống người bằng chọn lọc — gắn với nhiều tội ác thế kỷ 20)", ex: "Critics warn that genetic selection could revive the ideas behind eugenics.", exVi: "Người phê phán cảnh báo rằng chọn lọc gen có thể làm sống lại những tư tưởng của thuyết ưu sinh.", more: "từ nặng — dùng cẩn thận, đúng ngữ cảnh lịch sử · eugenic (adj)" },
          { w: "playing God", pos: "phr", ipa: "/ˌpleɪɪŋ ˈɡɒd/", vi: "“đóng vai Thượng đế” — can thiệp vào điều con người không nên quyết định", ex: "Some people feel that choosing a child's genes is playing God.", exVi: "Một số người cảm thấy chọn gen cho con là đóng vai Thượng đế.", more: "accuse sb of playing God · band 8: thuật lại như ý của người khác (Some argue that…), đừng dùng làm lập luận chính" },
        ],
      },
      {
        t: "quiz", id: "t5d22-di-truyen", kind: "fill", title: "Di truyền — điền MỘT từ (4 câu)",
        items: [
          { q: "1. Changes to sperm, eggs or embryos are known as ___ changes because they pass to future generations.", answers: ["germline"], hint: "germline — dòng mầm." },
          { q: "2. ___ therapy treats a disease in one patient without affecting their children.", answers: ["Gene"], hint: "gene therapy." },
          { q: "3. The cost of sequencing a ___ has fallen dramatically.", answers: ["genome"], hint: "sequence a genome." },
          { q: "4. Opponents fear a slide towards so-called designer ___.", answers: ["babies"], hint: "designer babies." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Social issues vòng 2 — từ để nói về CƠ CHẾ của bất bình đẳng (11 từ)" },
      { t: "p", text: "Vòng 1 (Tập 4 Ngày 16) có inequality, poverty line, welfare, social mobility, discrimination, equity, safety net… Đó là từ để GỌI TÊN vấn đề. Vòng 2 là từ để GIẢI THÍCH vì sao nó kéo dài và đánh giá cách sửa." },
      {
        t: "vocab",
        items: [
          { w: "systemic", pos: "adj", ipa: "/sɪˈstemɪk/", vi: "mang tính hệ thống (nằm trong cách hệ thống vận hành, không do một cá nhân)", ex: "The problem is systemic, so replacing one manager will not solve it.", exVi: "Vấn đề mang tính hệ thống, nên thay một quản lý sẽ không giải quyết được.", more: "systemic racism / failure / problems · KHÔNG nhầm với systematic (có phương pháp, bài bản)" },
          { w: "entrenched", pos: "adj", ipa: "/ɪnˈtrentʃt/", vi: "ăn sâu, bám rễ, khó thay đổi", ex: "Inequality becomes entrenched when wealth is passed down untaxed.", exVi: "Bất bình đẳng bám rễ khi của cải được truyền lại mà không bị đánh thuế.", more: "deeply entrenched attitudes / interests · entrench (v)" },
          { w: "social exclusion", pos: "n", ipa: "/ˌsəʊʃl ɪkˈskluːʒn/", vi: "sự bị gạt ra ngoài xã hội (không tiếp cận được việc làm, dịch vụ, quan hệ)", ex: "Poverty is not only about money; it is also about social exclusion.", exVi: "Nghèo không chỉ là chuyện tiền; nó còn là chuyện bị gạt ra ngoài xã hội.", more: "socially excluded groups · trái: social inclusion" },
          { w: "disenfranchised", pos: "adj", ipa: "/ˌdɪsɪnˈfræntʃaɪzd/", vi: "bị tước quyền (bầu cử); cảm thấy không có tiếng nói", ex: "Many young voters feel disenfranchised by the political system.", exVi: "Nhiều cử tri trẻ cảm thấy mình không có tiếng nói trong hệ thống chính trị.", more: "disenfranchise (v) · trái: empowered" },
          { w: "redistribution", pos: "n", ipa: "/ˌriːdɪstrɪˈbjuːʃn/", vi: "sự phân phối lại (của cải, thu nhập — thường qua thuế)", ex: "Progressive taxes are the main tool of redistribution.", exVi: "Thuế luỹ tiến là công cụ chính để phân phối lại thu nhập.", more: "the redistribution of wealth / income · redistribute (v) · redistributive policies" },
          { w: "universal basic income", pos: "n", ipa: "/ˌjuːnɪvɜːsl ˌbeɪsɪk ˈɪnkʌm/", vi: "thu nhập cơ bản phổ quát (khoản tiền đều đặn trả cho mọi người, không điều kiện)", ex: "Universal basic income is often proposed as a response to automation.", exVi: "Thu nhập cơ bản phổ quát thường được đề xuất như một cách ứng phó với tự động hoá.", more: "viết tắt UBI · trái: means-tested benefits (Tập 4) · nối mục 2" },
          { w: "positive discrimination", pos: "n", ipa: "/ˌpɒzətɪv dɪˌskrɪmɪˈneɪʃn/", vi: "phân biệt đối xử tích cực — ưu tiên nhóm thiệt thòi (Anh–Anh)", ex: "Some universities use positive discrimination to widen access.", exVi: "Một số trường đại học dùng ưu tiên nhóm thiệt thòi để mở rộng cơ hội tiếp cận.", more: "Anh–Mỹ: affirmative action · cặp dễ nhầm mục 6" },
          { w: "tokenism", pos: "n", ipa: "/ˈtəʊkənɪzəm/", vi: "làm chiếu lệ cho có (đưa một hai người thuộc nhóm thiểu số vào để tỏ ra công bằng)", ex: "Appointing one woman to a board of twenty is tokenism, not equality.", exVi: "Bổ nhiệm một phụ nữ vào hội đồng hai mươi người là làm cho có, không phải bình đẳng.", more: "a token gesture · token (adj) = mang tính hình thức" },
          { w: "unconscious bias", pos: "n", ipa: "/ʌnˌkɒnʃəs ˈbaɪəs/", vi: "thiên kiến vô thức", ex: "Removing names from CVs can reduce unconscious bias in hiring.", exVi: "Bỏ tên khỏi CV có thể giảm thiên kiến vô thức khi tuyển dụng.", more: "implicit bias · unconscious bias training · nối algorithmic bias: máy học lại thiên kiến của người" },
          { w: "food insecurity", pos: "n", ipa: "/ˈfuːd ɪnsɪˌkjʊərəti/", vi: "tình trạng không chắc có đủ thức ăn", ex: "Food insecurity is rising even in wealthy countries.", exVi: "Tình trạng thiếu bảo đảm lương thực đang tăng kể cả ở các nước giàu.", more: "food-insecure households · food bank (Ngày 21) · trái: food security" },
          { w: "precarious", pos: "adj", ipa: "/prɪˈkeəriəs/", vi: "bấp bênh, không ổn định", ex: "Precarious work makes it hard for young people to rent a home.", exVi: "Việc làm bấp bênh khiến người trẻ khó thuê nhà.", more: "precarious employment / position · precarity (n) · nối the gig economy (Tập 3–5)" },
        ],
      },
      {
        t: "quiz", id: "t5d22-xa-hoi", kind: "fill", title: "Social issues vòng 2 — điền MỘT từ (5 câu)",
        items: [
          { q: "1. The unfairness is ___: it is built into how the system works, not the fault of one person.", answers: ["systemic"], hint: "systemic ≠ systematic." },
          { q: "2. Attitudes this deeply ___ will take a generation to change.", answers: ["entrenched"], hint: "deeply entrenched." },
          { q: "3. A single woman on an all-male panel can look like ___ rather than real change.", answers: ["tokenism"], hint: "tokenism — làm cho có." },
          { q: "4. Zero-hours contracts have made work more ___ for many young people.", answers: ["precarious"], hint: "precarious — bấp bênh." },
          { q: "5. Many families experience food ___ in the last week before payday.", answers: ["insecurity"], hint: "food insecurity." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Sáu cặp dễ nhầm" },
      {
        t: "table",
        head: ["Cặp", "Khác nhau", "Ví dụ"],
        rows: [
          ["**hereditary / heritable / inherited**", "hereditary: bệnh / tước vị di truyền · heritable: CÓ THỂ truyền (thuật ngữ khoa học) · inherited: đã nhận từ cha mẹ (cả tiền của)", "a hereditary disease · heritable changes · inherited wealth"],
          ["**autonomous / automated**", "autonomous: tự quyết định · automated: làm tự động theo lệnh đã định", "an autonomous drone chooses its route; an automated checkout just scans"],
          ["**ethical / moral**", "ethical: theo chuẩn mực nghề nghiệp, quy tắc · moral: theo lương tâm cá nhân", "an ethical code for doctors · a moral duty to help"],
          ["**positive discrimination / affirmative action**", "cùng ý; Anh–Anh dùng positive discrimination (hơi tiêu cực), Anh–Mỹ dùng affirmative action", "chọn một, dùng nhất quán trong bài"],
          ["**explainable / transparent**", "explainable: giải thích được TỪNG quyết định · transparent: công khai cách vận hành, dữ liệu", "a transparent process can still produce unexplainable decisions"],
          ["**terraform / colonise**", "terraform: biến đổi hành tinh · colonise: đến định cư (Tập 3)", "colonise Mars first, terraform it much later — if ever"],
        ],
      },
      {
        t: "mcq", id: "t5d22-de-nham", title: "Cặp dễ nhầm — chọn từ đúng (6 câu)",
        items: [
          { q: "1. Changes made to an embryo's DNA would be ___, passing to every future generation.", options: ["hereditary", "heritable", "inherited"], correct: 1, why: "Khả năng TRUYỀN của một thay đổi (thuật ngữ khoa học) ⇒ heritable." },
          { q: "2. She lives on ___ wealth and has never needed a job.", options: ["inherited", "heritable", "hereditary"], correct: 0, why: "Tiền của đã nhận từ cha mẹ ⇒ inherited." },
          { q: "3. A factory line that repeats the same movement all day is ___, not autonomous.", options: ["automated", "autonomous", "automatic"], correct: 0, why: "Làm theo lệnh định sẵn ⇒ automated. (automatic là tính từ chung; trong ngữ cảnh hệ thống, automated là từ đúng.)" },
          { q: "4. Journalists follow an ___ code that forbids paying sources.", options: ["moral", "ethical", "ethic"], correct: 1, why: "Bộ quy tắc nghề nghiệp ⇒ ethical code." },
          { q: "5. The process was ___ — the data was public — but no one could say why it rejected any particular applicant.", options: ["explainable", "transparent", "systemic"], correct: 1, why: "Công khai quy trình / dữ liệu ⇒ transparent; không giải thích được từng quyết định ⇒ chưa explainable." },
          { q: "6. Unfairness built into the way an institution works is ___.", options: ["systematic", "systemic", "symptomatic"], correct: 1, why: "systemic = thuộc về hệ thống. systematic = bài bản, có phương pháp." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Kho ý cho bốn đề Task 2 lạ — hai góc nhìn mỗi đề" },
      { t: "p", text: "Không phải bài mẫu. Mỗi dòng là thứ bạn ghi ra trong 3 phút dàn ý (Tập 3 Ngày 22: kho ý tưởng). Từ in đậm là từ hôm nay." },
      {
        t: "table",
        head: ["Đề (tóm tắt)", "Góc ủng hộ", "Góc phản đối / thận trọng", "Lập trường band 8 (có điều kiện)"],
        rows: [
          ["Có nên cho phép chỉnh sửa gen người?", "**gene therapy** chữa bệnh **hereditary** nặng; giảm đau khổ", "**germline** thay đổi là **heritable** — không có **informed consent** của đời sau; trượt dần tới **designer babies**", "chấp nhận chữa bệnh cho một người; chưa chấp nhận thay đổi dòng mầm cho tới khi…"],
          ["Có nên dùng AI để ra quyết định về con người (tuyển dụng, cho vay, xét xử)?", "nhanh, rẻ, không mệt; có thể giảm **unconscious bias** của người", "**black box** — không khiếu nại được; học lại thiên kiến cũ; ai chịu **liability**?", "chỉ khi quyết định **explainable** và có **human in the loop**"],
          ["Tiền cho vũ trụ có đáng khi Trái Đất còn nhiều vấn đề?", "**spin-off** công nghệ; vệ tinh khí hậu ở **low Earth orbit**; **probe** rẻ", "**space tourism** cho giới giàu; **terraform** sao Hoả là ảo tưởng", "đáng với khoa học và vệ tinh phục vụ Trái Đất; không đáng với du lịch"],
          ["Có nên trả thu nhập cơ bản cho mọi người khi tự động hoá lan rộng?", "**job displacement**; việc **precarious**; đơn giản hơn trợ cấp xét điều kiện", "chi phí khổng lồ; **moral hazard** (ít muốn làm); không chạm tới bất bình đẳng **entrenched**", "thử nghiệm có kiểm soát trước; kết hợp với đào tạo lại và **redistribution** có mục tiêu"],
        ],
      },
      { t: "rule", formula: "đề lạ = khung quen + từ mới   ·   mỗi góc 2–3 từ đắt   ·   lập trường có điều kiện: chấp nhận X, chưa chấp nhận Y cho tới khi Z", vi: "Bạn không cần ý lạ — cần TỪ chính xác để nói ý quen một cách sắc." },

      /* ── 8 ── */
      { t: "h", text: "8. Dùng ngay — dịch Việt → Anh (5 câu Task 2 / Part 3)" },
      {
        t: "quiz", id: "t5d22-tv-dich", kind: "translate", title: "Dịch Việt → Anh (5 câu)",
        grammar: "dùng ít nhất một từ của mục 1–5 mỗi câu",
        items: [
          { q: "1. Thay đổi trên phôi sẽ truyền cho đời sau, mà những người ấy không thể đồng ý.", answers: ["Changes to an embryo would be heritable, and future generations cannot give informed consent.", "Changes made to embryos would be passed on to future generations, who cannot give informed consent."], hint: "heritable · informed consent" },
          { q: "2. Công cụ tốt nhất bổ trợ bác sĩ chứ không thay thế họ, và luôn có con người tham gia quyết định.", answers: ["The best tools augment doctors rather than replace them, and always keep a human in the loop.", "The best tools augment rather than replace doctors and always keep a human in the loop."], hint: "augment rather than replace · human in the loop" },
          { q: "3. Lập luận mạnh nhất cho nghiên cứu vũ trụ là những lợi ích phụ của nó.", answers: ["The strongest argument for space research is its spin-offs.", "The strongest case for space research rests on its spin-off benefits."], hint: "spin-off(s)" },
          { q: "4. Bất bình đẳng mang tính hệ thống và đã bám rễ qua nhiều thế hệ.", answers: ["The inequality is systemic and has become entrenched over generations.", "Inequality is systemic and has been entrenched for generations."], hint: "systemic · entrenched" },
          { q: "5. Bổ nhiệm một người cho có không phải là bình đẳng.", answers: ["Appointing one person as a token gesture is not equality.", "Appointing a single person for show is tokenism, not equality.", "Tokenism is not equality."], hint: "tokenism / a token gesture" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d22-viet",
    kind: "writing",
    title: "Viết: Bài phản biện học thuật ~300 từ — đánh giá một nhận định bằng chứng cứ (band 7 và band 8 cạnh nhau)",
    goal: "Viết được một bài phản biện ~300 từ đánh giá một nhận định có số liệu: tóm tắt trung lập, ghi nhận điểm mạnh thật, chỉ ra 2–3 lỗ hổng chính xác bằng tên (không có nhóm so sánh, hồi quy về trung bình, xung đột lợi ích…), kết luận có điều kiện kèm chứng cứ nào sẽ thuyết phục được bạn; và dùng đúng các động tác ấy trong đoạn phản bác của Task 2.",
    minutes: 110,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "**Phản biện học thuật** (critical response) là dạng bài đại học năm nhất nào cũng có (E09): đọc một nhận định — bài báo, báo cáo, thông cáo — rồi đánh giá xem chứng cứ có đỡ được nó không. IELTS không thi dạng này, nhưng TR band 8 của Task 2 đòi đúng kỹ năng ấy: ý được ==fully extended and well supported==, phản bác có lý lẽ chứ không chỉ “some people disagree”.",
          "Khung **4 khối**: tóm tắt trung lập → ghi nhận → hai ba câu hỏi phản biện → kết luận có điều kiện + chứng cứ cần có.",
          "**Tám lỗ hổng** hay gặp, mỗi lỗ hổng có một câu phản biện mẫu. Band 7 nói “the evidence is not reliable”; band 8 GỌI TÊN lỗ hổng và nói nó làm hỏng kết luận ở chỗ nào.",
          "Động từ tường thuật có lập trường (Tập 4 Ngày 10 · 24 đã học nhóm trung tính): claims / purports to show (nghi ngờ) ↔ shows / establishes (tin là đúng).",
          "Đề hôm nay: một thông cáo báo chí HƯ CẤU về hệ thống tuần tra dùng AI — nối thẳng từ vựng Bài 1 (algorithm, liability, conflict of interest).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Phản biện học thuật khác Task 2 ở đâu — và giống ở đâu" },
      {
        t: "table",
        head: ["", "Task 2", "Phản biện học thuật"],
        rows: [
          ["Đầu vào", "một câu đề nêu vấn đề chung", "một văn bản cụ thể có nhận định + chứng cứ"],
          ["Nhiệm vụ", "nêu và bảo vệ quan điểm của mình", "đánh giá xem chứng cứ CỦA NGƯỜI KHÁC có đỡ được nhận định của họ không"],
          ["Câu hỏi trung tâm", "Tôi nghĩ gì về X?", "Nếu X đúng, ta phải thấy gì? Văn bản có cho thấy điều đó không?"],
          ["Giọng", "trang trọng, có lập trường", "trang trọng, công bằng: ghi nhận trước khi phê bình"],
          ["Giống nhau", "TR · CC · LR · GRA vẫn là bốn tiêu chí; đoạn phản bác của Task 2 = một phản biện thu nhỏ", ""],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — phản biện không phải bác bỏ",
        items: [
          "Mục tiêu không phải chứng minh nhận định SAI, mà chứng minh chứng cứ CHƯA ĐỦ để tin nó. “The system does not work” là một nhận định mới cần chứng cứ mới — người viết band 7 hay trượt vào đây.",
          "Câu kết tốt nhất của một bài phản biện thường là: “Điều gì sẽ thuyết phục tôi?” — nó cho thấy bạn phê bình để tìm sự thật, không phải để thắng.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khung bốn khối — ~300 từ" },
      {
        t: "sodo", kind: "flow", title: "Bài phản biện 300 từ",
        caption: "Khối ③ chiếm một nửa bài. Mỗi lỗ hổng một đoạn ngắn hoặc hai lỗ hổng một đoạn — không liệt kê năm sáu lỗ hổng nông.",
        steps: [
          { label: "① Tóm tắt trung lập", sub: "40–60 từ · nhận định chính + chứng cứ chính + câu hỏi trung tâm" },
          { label: "② Ghi nhận", sub: "1–2 câu · điểm mạnh THẬT (có thể đặt cuối, trước kết luận)" },
          { label: "③ Hai ba câu hỏi phản biện", sub: "150–180 từ · gọi tên lỗ hổng → vì sao nó làm hỏng kết luận → thiếu dữ liệu gì" },
          { label: "④ Kết luận có điều kiện", sub: "40–60 từ · chứng cứ hiện có cho phép nói gì / chưa cho phép nói gì + cần thêm gì" },
        ],
      },
      { t: "rule", formula: "tóm tắt (trung lập) → ghi nhận (thật) → 2–3 lỗ hổng (gọi tên + hậu quả) → kết luận (có điều kiện + chứng cứ cần có)", vi: "Ít lỗ hổng mà sâu hơn nhiều lỗ hổng mà nông." },

      /* ── 3 ── */
      { t: "h", text: "3. Tám lỗ hổng lập luận hay gặp — và câu phản biện mẫu" },
      {
        t: "table",
        head: ["Lỗ hổng", "Dấu hiệu trong văn bản", "Câu phản biện mẫu"],
        rows: [
          ["**Tương quan ≠ nhân quả**", "“Since X was introduced, Y has fallen.”", "The two may be connected, but the report offers no evidence that one caused the other."],
          ["**Không có nhóm so sánh**", "chỉ so trước / sau ở cùng một nơi", "Without figures for comparable areas that did not adopt the scheme, the fall cannot be attributed to it."],
          ["**Hồi quy về trung bình**", "nơi / người được chọn VÌ đang tệ bất thường", "Figures selected for being unusually high tend to fall back towards normal levels whatever is done."],
          ["**Mẫu tự chọn / chỉ người “sống sót”**", "chỉ tính người trả lời, người học xong, công ty còn tồn tại", "Those who completed the programme are unlikely to be typical of those who started it."],
          ["**Dữ liệu tự báo cáo**", "cảm nhận, khảo sát, “felt”, “said they”", "Feeling safer is a different outcome from being safer."],
          ["**Xung đột lợi ích**", "người đánh giá được lợi từ kết quả", "This does not make the findings false, but an independent evaluation would remove the doubt."],
          ["**Dịch chuyển / tác dụng phụ**", "giải pháp đẩy vấn đề sang chỗ khác", "Some of the problem may simply have moved elsewhere; city-wide figures would show whether it did."],
          ["**Khái quát quá mức**", "một nơi / một năm ⇒ mọi nơi / mãi mãi", "What worked in six districts for one year may not work in twenty-two over a decade."],
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba cách phê bình làm tụt band",
        items: [
          "~~This evidence is not reliable.~~ — không gọi tên vì sao. Thay bằng tên lỗ hổng + hậu quả: “Because the districts were chosen after an unusually bad year, some of the fall would have happened anyway.”",
          "~~This proves that the system does not work.~~ — phản biện chứng cứ yếu bằng một nhận định còn yếu hơn. Band 8: “…the evidence does not yet show that it does.”",
          "~~The company is lying.~~ — buộc tội động cơ. Band 8 chỉ ra CẤU TRÚC có vấn đề (xung đột lợi ích), không đoán động cơ.",
        ],
      },
      {
        t: "mcq", id: "t5d22-viet-lo-hong", title: "Gọi tên lỗ hổng (6 câu)",
        items: [
          { q: "1. “Students at schools that serve breakfast get better grades, so breakfast improves learning.”", options: ["Tương quan ≠ nhân quả", "Dịch chuyển", "Xung đột lợi ích"], correct: 0, why: "Hai thứ đi cùng nhau; có thể do yếu tố khác (trường giàu hơn vừa có bữa sáng vừa có giáo viên tốt)." },
          { q: "2. “We gave extra tutoring to the 20 students with the worst marks; next term their marks rose.”", options: ["Hồi quy về trung bình (và không có nhóm so sánh)", "Mẫu tự chọn", "Khái quát quá mức"], correct: 0, why: "Chọn vì điểm tệ bất thường ⇒ lần sau phần nào tự tăng lại, dù không học thêm." },
          { q: "3. “Nine out of ten people who finished our course recommend it.”", options: ["Dữ liệu tự báo cáo + chỉ tính người học xong", "Hồi quy về trung bình", "Dịch chuyển"], correct: 0, why: "Người bỏ dở (có thể không hài lòng) không được hỏi; “recommend” là cảm nhận." },
          { q: "4. “After the city banned cars from the centre, air pollution there fell by a third.”", options: ["Có thể là dịch chuyển: xe chuyển sang đường vòng", "Xung đột lợi ích", "Không có lỗ hổng nào"], correct: 0, why: "Ô nhiễm có thể chuyển sang các tuyến xung quanh; cần số liệu cả vùng." },
          { q: "5. “A study funded by a sugar manufacturer found no link between sugar and weight gain.”", options: ["Xung đột lợi ích", "Hồi quy về trung bình", "Khái quát quá mức"], correct: 0, why: "Người tài trợ được lợi từ kết quả. Không chứng minh kết quả sai — chỉ cần đánh giá độc lập." },
          { q: "6. “The four-day week worked at one software company, so it should be introduced in every industry.”", options: ["Khái quát quá mức", "Tương quan ≠ nhân quả", "Dữ liệu tự báo cáo"], correct: 0, why: "Một công ty, một ngành ⇒ mọi ngành (bệnh viện, nhà máy…)." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Ngôn ngữ phản biện — động từ có lập trường và bảy khuôn câu" },
      { t: "p", text: "Tập 4 Ngày 10 và 24 dạy động từ tường thuật trung tính (states, argues, suggests). Bài phản biện cần thêm một tầng: chọn động từ cho người đọc biết BẠN tin văn bản đến đâu — mà không cần viết “I think”." },
      {
        t: "table",
        head: ["Bạn tin đến đâu", "Động từ", "Ví dụ"],
        rows: [
          ["Trung tính — chỉ thuật lại", "states · reports · notes · describes", "The release reports an 18 per cent fall."],
          ["Hoài nghi — họ nói vậy, tôi chưa tin", "claims · asserts · maintains · **purports to** show", "The survey purports to show that residents feel safer."],
          ["Tin là đúng — chứng cứ đủ", "shows · demonstrates · establishes · confirms", "The figures establish that burglaries fell; they do not establish why."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "X may well be accurate. The question is whether it shows Y.", vi: "ghi nhận số liệu, chuyển trọng tâm sang suy luận", examples: [
            { en: "The figure may well be accurate. The question is whether it shows that the scheme caused the fall.", vi: "Con số có thể chính xác. Câu hỏi là nó có cho thấy chương trình gây ra sự sụt giảm không." },
          ] },
          { formula: "The figures are consistent with X, but they do not establish Y.", vi: "chứng cứ hợp với X nhưng chưa đủ để kết luận Y", examples: [
            { en: "The figures are consistent with the system working, but they do not establish that it does.", vi: "Số liệu phù hợp với giả thuyết hệ thống hiệu quả, nhưng chưa xác lập được điều đó." },
          ] },
          { formula: "This rests on the assumption that…", vi: "chỉ ra giả định ngầm", examples: [
            { en: "The plan rests on the assumption that what worked in six districts will work in all twenty-two.", vi: "Kế hoạch dựa trên giả định rằng điều hiệu quả ở sáu quận sẽ hiệu quả ở cả hai mươi hai." },
          ] },
          { formula: "Even if we grant that X, it does not follow that Y.", vi: "nhượng bộ rồi chặn bước nhảy logic", examples: [
            { en: "Even if we grant that residents feel safer, it does not follow that they are.", vi: "Kể cả chấp nhận rằng người dân cảm thấy an toàn hơn, điều đó không có nghĩa là họ an toàn hơn." },
          ] },
          { formula: "What the report does not tell us is…", vi: "câu chẻ (Ngày 21) để chỉ dữ liệu bị thiếu", examples: [
            { en: "What the report does not tell us is what happened in the districts without the system.", vi: "Điều báo cáo không cho ta biết là chuyện gì xảy ra ở các quận không có hệ thống." },
          ] },
          { formula: "None of this means that X. But Y should follow, not precede, Z.", vi: "kết luận công bằng: không bác X, chỉ đòi đúng thứ tự", examples: [
            { en: "None of this means the system is useless. But expansion should follow, not precede, the evidence.", vi: "Điều này không có nghĩa hệ thống vô dụng. Nhưng việc mở rộng nên đi sau, chứ không đi trước, chứng cứ." },
          ] },
        ],
      },
      { t: "rule", formula: "may well be accurate → the question is whether → consistent with X, but not Y → rests on the assumption that → should follow, not precede", vi: "Năm khuôn này đủ để viết khung xương của mọi bài phản biện 300 từ." },
      {
        t: "quiz", id: "t5d22-viet-dich", kind: "translate", title: "Dịch Việt → Anh — câu phản biện (4 câu)",
        grammar: "purports to · consistent with… but do not establish · rests on the assumption that · even if we grant that… it does not follow that…",
        items: [
          { q: "1. Khảo sát nhằm chứng tỏ rằng người dùng hài lòng hơn.", answers: ["The survey purports to show that users are more satisfied.", "The survey purports to show that users are happier."], hint: "purport to show — hoài nghi" },
          { q: "2. Số liệu phù hợp với việc ứng dụng có hiệu quả, nhưng chưa xác lập được điều đó.", answers: ["The figures are consistent with the app being effective, but they do not establish that it is.", "The data are consistent with the app working, but they do not establish that it does."], hint: "consistent with… but do not establish…" },
          { q: "3. Lập luận này dựa trên giả định rằng mọi người dùng đều giống nhau.", answers: ["This argument rests on the assumption that all users are alike.", "The argument rests on the assumption that all users are the same."], hint: "rests on the assumption that…" },
          { q: "4. Kể cả chấp nhận rằng điểm số tăng, điều đó không có nghĩa là ứng dụng gây ra sự tăng ấy.", answers: ["Even if we grant that scores rose, it does not follow that the app caused the rise.", "Even if we grant that the scores went up, it does not follow that the app caused it."], hint: "Even if we grant that…, it does not follow that…" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Đề hôm nay — đọc văn bản, gạch chân trước khi đọc bài mẫu" },
      { t: "p", text: "Văn bản dưới là thông cáo báo chí HƯ CẤU (thành phố, hệ thống, công ty, người phát ngôn đều không có thật). Trước khi đọc bài mẫu, dành 5 phút: gạch mọi con số, mọi chữ “because / selected / funded / felt”, và viết ra ba câu hỏi bạn muốn hỏi người viết thông cáo." },
      {
        t: "passage", title: "PRESS RELEASE — Carrow City Council: “PatrolSense pilot cuts burglaries by 18%”",
        paras: [
          { text: "Burglaries in the six districts where PatrolSense was introduced fell by 18 per cent in the system's first year, compared with the previous twelve months. PatrolSense, an artificial intelligence system supplied by Northgate Analytics, uses past crime reports to predict the streets where burglaries are most likely to occur and directs police patrols to those streets each evening." },
          { text: "The six pilot districts were selected because they had recorded the sharpest rise in burglaries in the city during the year before the pilot began. In a survey carried out by Northgate Analytics, which also funded the evaluation, 74 per cent of residents who responded said that they felt safer." },
          { text: "“The results speak for themselves,” said Councillor Ruth Ames. “We intend to extend PatrolSense to all twenty-two districts next spring, at a cost of £2.4 million.”" },
        ],
      },
      { t: "p", text: "**Nhiệm vụ:** Write a critical response of about 300 words for a local policy blog, evaluating whether the evidence in the press release justifies the council's plan to extend the system to the whole city." },
      {
        t: "table", caption: "Năm chỗ cần gạch — bạn gạch được mấy chỗ?",
        head: ["Chỗ trong văn bản", "Lỗ hổng (mục 3)"],
        rows: [
          ["compared with the previous twelve months", "không có nhóm so sánh"],
          ["selected because they had recorded the sharpest rise", "hồi quy về trung bình"],
          ["directs police patrols to those streets", "dịch chuyển sang quận lân cận?"],
          ["carried out by Northgate Analytics, which also funded the evaluation", "xung đột lợi ích"],
          ["74 per cent of residents who responded said that they felt safer", "dữ liệu tự báo cáo + chỉ người trả lời"],
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Hai bài mẫu cùng đề — band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đọc bài band 7 trước. Đếm: bài gọi tên bao nhiêu lỗ hổng? Câu nào phản biện bằng một nhận định quá mạnh? Ghi nhận điểm mạnh nằm ở đâu và có thật không?" },
      {
        t: "passage", title: "Bài mẫu band 7 (ước tính) — 256 từ",
        paras: [
          { text: "The press release from Carrow City Council claims that an AI system called PatrolSense has reduced burglaries by 18 per cent and should therefore be used in all districts. Although this sounds impressive, I believe there are several problems with the evidence." },
          { text: "Firstly, the council only compares the pilot districts with the year before. It does not say what happened in the other sixteen districts. If burglaries also fell there, the system may not be the reason for the decrease. Secondly, the six districts were chosen because burglaries had increased a lot. This means the number could go down naturally the next year, even without any new system." },
          { text: "Another problem is the survey. It was done by Northgate Analytics, the company that sells PatrolSense, so it may not be reliable. Also, we do not know how many residents answered the survey. Feeling safer is not the same as being safer." },
          { text: "Furthermore, the system only changes where police officers patrol. It is possible that burglars simply moved to other areas where there were fewer patrols. In this case, crime in the city did not really fall." },
          { text: "On the other hand, the system may have some benefits. It could help the police to use their time more efficiently, and an 18 per cent decrease is a large number." },
          { text: "In conclusion, the evidence in the press release is not enough to prove that PatrolSense works. The council should not spend £2.4 million before an independent study has been done. This proves that politicians should be more careful with statistics." },
        ],
      },
      { t: "p", text: "Giờ đọc bài band 8. Cùng bốn lỗ hổng — nhưng để ý: lỗ hổng nặng nhất đứng trước và được giải thích tới tận cơ chế; hai lỗ hổng phụ gộp một đoạn; ghi nhận đặt ngay trước kết luận; kết luận nói rõ cần chứng cứ nào." },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 306 từ",
        paras: [
          { text: "Carrow City Council's case for extending PatrolSense rests on a single figure: an 18 per cent fall in burglaries across the six pilot districts in the system's first year. The figure may well be accurate. The question is whether it shows what the council takes it to show — that the system caused the fall — and on the evidence released, it does not." },
          { text: "The most serious difficulty lies in how the districts were chosen. They were selected precisely because burglaries had risen sharply the year before, and unusually high figures tend to fall back towards normal levels whatever is done about them, a pattern statisticians call regression to the mean. Without figures for comparable districts that did not receive the system, there is no way of separating the effect of PatrolSense from a decline that might have happened anyway." },
          { text: "Two further gaps compound the problem. First, the system works by moving patrols, so some burglaries may simply have been displaced to neighbouring districts; a city-wide figure, which the release omits, would reveal whether crime fell or merely relocated. Second, the only other evidence, a survey in which 74 per cent of respondents reported feeling safer, was conducted by the supplier, which also funded the evaluation. This does not make the result false, but it is a conflict of interest that an independent assessment would remove, and feeling safer is, in any case, a different outcome from being safer." },
          { text: "None of this means that the system is ineffective. Directing a limited number of patrols to where they are most needed is a reasonable idea, and the pilot may yet prove its worth. But a £2.4 million expansion should follow, not precede, the evidence: a comparison with similar districts over at least two years, city-wide burglary figures, and an evaluation commissioned from someone with nothing to sell." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Khác nhau ở đâu? — bốn tiêu chí" },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 7", "Bài band 8", "Động tác tạo khác biệt"],
        rows: [
          ["**TR / TA**", "đủ bốn lỗ hổng nhưng ngang hàng nhau; câu cuối “This proves…” là nhận định mới không có chứng cứ; điểm mạnh chung chung (“some benefits”)", "lỗ hổng nặng nhất trước, giải thích tới cơ chế (regression to the mean); kết luận nói rõ chứng cứ còn thiếu; ghi nhận cụ thể (đưa tuần tra tới chỗ cần)", "xếp lỗ hổng theo sức nặng · kết bằng “cần chứng cứ gì”"],
          ["**CC**", "Firstly / Secondly / Another / Furthermore / On the other hand — từ nối máy móc, mỗi đoạn một ý ngắn", "đoạn 2 một lỗ hổng sâu; đoạn 3 “Two further gaps compound the problem. First… Second…”; liên kết bằng chính nội dung", "gộp lỗ hổng phụ · câu chủ đề nói QUAN HỆ giữa các ý"],
          ["**LR**", "reliable, a lot, go down naturally, a large number", "rests on · takes it to show · compound · displaced · relocated · commissioned · conflict of interest · nothing to sell", "động từ có lập trường; thuật ngữ đúng chỗ, giải thích trong câu"],
          ["**GRA**", "câu đơn và ghép là chính, chính xác", "câu chẻ (What… is), mệnh đề quan hệ không xác định (which the release omits), “should follow, not precede”, nhượng bộ “This does not make the result false, but…”", "cấu trúc phục vụ việc phân biệt và nhượng bộ"],
        ],
      },
      {
        t: "note", title: "💡 Mẹo — câu đầu và câu cuối của bài band 8",
        items: [
          "Câu đầu: “…rests on a single figure” — tóm tắt VÀ đặt vấn đề cùng lúc, không cần “This essay will…”.",
          "Câu cuối: “an evaluation commissioned from someone with nothing to sell” — một chi tiết cụ thể, hơi dí dỏm, khép lại lỗ hổng xung đột lợi ích. Band 8 được phép có giọng, miễn là không mỉa mai.",
          "Không có chữ “I” nào trong bài band 8. Lập trường nằm ở động từ (takes it to show, compound, omits).",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Mang sang Task 2 — đoạn phản bác dùng cùng bốn động tác" },
      { t: "p", text: "Trong Task 2 dạng opinion hoặc discussion band 8, đoạn phản bác là một bài phản biện thu nhỏ (90–120 từ): nêu lập luận đối phương CÔNG BẰNG → ghi nhận phần đúng → chỉ ra giả định / chứng cứ yếu → kết luận có điều kiện. Ví dụ với đề “Should governments introduce a universal basic income as automation spreads?” (lập trường: chưa nên áp dụng toàn quốc):" },
      {
        t: "passage", title: "Đoạn phản bác band 8 (ước tính) — 115 từ",
        paras: [
          { text: "Supporters of a universal basic income argue that automation will displace so many workers that only an unconditional payment can prevent mass hardship. The concern is legitimate: routine jobs are already disappearing, and the work replacing them is often precarious. Yet the argument rests on two assumptions that the evidence does not yet support. The first is that job displacement will be rapid and permanent, whereas past waves of automation created new kinds of work even as they destroyed old ones. The second is that a universal payment is the most effective response, when the same money could fund retraining or targeted support for those actually affected. Until trials show otherwise, the case remains unproven." },
        ],
      },
      { t: "rule", formula: "Supporters argue that… · The concern is legitimate: … · Yet the argument rests on two assumptions… · Until… , the case remains unproven.", vi: "Đoạn phản bác Task 2 = phản biện học thuật 110 từ: công bằng trước, sắc sau." },

      /* ── 9 ── */
      { t: "h", text: "9. Kiểm tra cuối bài (6 câu)" },
      {
        t: "mcq", id: "t5d22-viet-kiem", title: "Kiểm tra — bài phản biện (6 câu)",
        items: [
          { q: "1. Câu kết nào hợp với một bài phản biện band 8?", options: ["This proves that the scheme is a failure.", "The evidence does not yet show that the scheme works; a two-year comparison with similar areas would.", "In conclusion, I strongly disagree with the council."], correct: 1, why: "Kết luận có điều kiện + chứng cứ cần có. A là nhận định mới không có chứng cứ; C chỉ nêu cảm nghĩ." },
          { q: "2. Động từ nào cho thấy người viết NGHI NGỜ văn bản?", options: ["The report establishes that…", "The report purports to show that…", "The report notes that…"], correct: 1, why: "purport to show = tự nhận là cho thấy (người viết chưa tin). establishes = tin là đúng; notes = trung tính." },
          { q: "3. Bài 300 từ phát hiện sáu lỗ hổng. Nên:", options: ["viết cả sáu, mỗi lỗ hổng hai câu", "chọn 2–3 lỗ hổng nặng nhất, giải thích tới cơ chế, gộp lỗ hổng phụ", "chỉ viết lỗ hổng dễ giải thích nhất"], correct: 1, why: "Ít mà sâu. Liệt kê sáu lỗ hổng nông là dấu hiệu band 7." },
          { q: "4. “The survey was funded by the company.” Câu phản biện band 8:", options: ["So the company is obviously lying.", "This does not make the result false, but an independent survey would remove the doubt.", "So the survey is useless."], correct: 1, why: "Chỉ ra cấu trúc có vấn đề, không buộc tội động cơ." },
          { q: "5. Ghi nhận điểm mạnh nên:", options: ["bỏ đi cho bài sắc hơn", "cụ thể và thật, thường đặt trước kết luận", "đặt ở câu đầu tiên bằng “On the other hand”"], correct: 1, why: "Ghi nhận cụ thể cho thấy bạn công bằng — tăng độ tin của phần phê bình." },
          { q: "6. Câu nào dùng đúng khuôn?", options: ["The figures are consistent with X, but they do not establish Y.", "The figures are consistent to X, but they are not establish Y.", "The figures consist with X, but not establish Y."], correct: 0, why: "consistent WITH · do not establish." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Viết bài — AI chấm 4 tiêu chí" },
      {
        t: "note", title: "💡 Cách làm: 8 phút đọc và gạch, 30 phút viết, 5 phút soát",
        items: [
          "Gạch mọi con số và mọi chữ cho biết AI thu thập dữ liệu, AI được chọn, AI trả tiền. Viết ba câu hỏi bạn muốn hỏi người viết.",
          "Xếp lỗ hổng theo sức nặng: lỗ hổng nào, nếu đúng, làm SỤP cả kết luận? Viết nó trước và dài nhất.",
          "Soát: có câu “This proves…” nào không? Có ghi nhận nào cụ thể không? Câu cuối có nói cần chứng cứ gì không?",
        ],
      },
      {
        t: "essay", id: "t5d22-viet-bai", task: "Task 2",
        prompt: "CRITICAL RESPONSE (not an IELTS task — university-style writing). Read the advertisement below and write a critical response of about 300 words, evaluating whether the evidence supports the company's final claim.\n\n“WordPath — the 30-day language challenge (fictional company). Users who completed our 30-day challenge scored 23% higher on our end-of-challenge test than on their starting test. Of the 12,000 users who began the challenge last year, 3,100 completed it, and 9 out of 10 of those who completed it said they would recommend WordPath to a friend. Our method works better than classroom learning.”",
        minWords: 280,
        tips: [
          "Lỗ hổng nặng nhất thường là chỉ tính người học xong (3.100 / 12.000): người bỏ cuộc không được tính.",
          "Hai lỗ hổng nữa đáng viết: bài kiểm tra do chính công ty soạn (và làm hai lần — quen đề); không có so sánh với lớp học thật, nên câu cuối “works better than classroom learning” không có chứng cứ nào.",
          "Ghi nhận thật: luyện đều 30 ngày có thể giúp ích; 3.100 người hoàn thành là con số không nhỏ.",
          "Kết: cần chứng cứ gì — nhóm học lớp so sánh, bài kiểm tra độc lập, tính cả người bỏ dở.",
        ],
      },
      {
        t: "essay", id: "t5d22-viet-bai-2", task: "Task 2",
        prompt: "Some people believe that parents should be allowed to use gene editing to protect their children from serious inherited diseases, but not to choose any other characteristics. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Có MỘT đoạn phản bác theo mục 8: nêu công bằng lập luận đối phương → ghi nhận → giả định yếu → kết luận có điều kiện.",
          "Từ Bài 1 dùng được (4–6 từ, đừng ép): gene therapy, germline, heritable, informed consent, designer babies (thuật lại), cross a red line.",
          "Chữ gài: but not to choose any other characteristics — ranh giới giữa “bệnh” và “đặc điểm” có rõ không? Đây là chỗ để bài lên band 8.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t5d22-noi",
    kind: "speaking",
    title: "Nói: Mổ Speaking Đề 10 theo 4 tiêu chí + paraphrase tinh — rồi luyện lại bằng câu MỚI",
    goal: "Tự mổ bài nói Đề 10 của mình theo FC · LR · GRA · P bằng bảng phân tích từng câu (6 câu Part 1, thẻ Part 2, 5 câu Part 3 thuộc 5 loại), biết vì sao bản band 7 dừng ở 7; mở câu trả lời Part 3 bằng paraphrase mức 3–4 (đổi khung, đặt tiêu chí) thay vì lặp lời giám khảo; rồi nói lại các kỹ năng đó với câu hỏi MỚI cho AI chấm.",
    minutes: 105,
    blocks: [
      {
        t: "recap", title: "Bài này học gì",
        items: [
          "Ngày 16 bạn đã làm **Speaking Đề 10** với giám khảo AI (Part 1: Colours · Weekends · Part 2: một truyền thống mong được giữ · Part 3: vì sao truyền thống còn hay mất). Hôm nay mổ đề ấy — đề nằm ở `thi-may/de/noi-de10.ts`; bài chỉ trích ngắn câu hỏi và vài cụm của bài mẫu.",
          "Mổ theo **bốn tiêu chí**: FC (mạch, độ dài, chỗ ngắt) · LR (từ cụ thể, paraphrase, idiom đúng liều) · GRA (thì, cấu trúc có việc) · P (trọng âm từ dài, ngữ điệu).",
          "Mỗi câu Part 3 thuộc một **loại** (sự thật · nguyên nhân hai vế · mức độ / chính sách · đạo đức · dự đoán). Mỗi loại một khung — giám khảo nghe khung trước khi nghe từ.",
          "**Paraphrase tinh** (S10): bốn mức mở câu trả lời — từ lặp lời giám khảo (tránh) tới đặt tiêu chí (“It mostly comes down to whether…”).",
          "Cuối bài **luyện lại bằng câu MỚI** — cùng kỹ năng, khác chủ đề: Part 1 Gifts · Snacks, hai thẻ Part 2 mới, Part 3 Customs and visitors.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Cách mổ một bài nói — năm bước" },
      {
        t: "table",
        head: ["Bước", "Làm gì", "Ra cái gì"],
        rows: [
          ["① Nghe lại", "mở bản ghi lượt nói Đề 10 của bạn (nếu chưa có, làm lại Đề 10 và tự ghi âm bằng điện thoại cùng lúc); chưa làm Đề 10 thì làm ngay hôm nay trước khi đọc tiếp", "bản ghi 11–14 phút"],
          ["② Chép", "chép NGUYÊN VĂN ba câu trả lời: một câu Part 1, phút đầu Part 2, một câu Part 3 — cả “um”, cả câu bỏ dở", "~250 từ chép tay"],
          ["③ Gắn nhãn", "mỗi chỗ yếu ghi một nhãn FC / LR / GRA / P", "danh sách 8–15 nhãn"],
          ["④ So bảng", "đối chiếu với bảng mổ ở mục 2–4", "2–3 lỗi lặp lại = ưu tiên"],
          ["⑤ Luyện lại câu MỚI", "nói các câu ở mục 8 với đúng 2–3 ưu tiên đó; ghi âm lại", "bản nói thứ hai để so"],
        ],
      },
      {
        t: "note", title: "📌 Ghi nhớ — vì sao phải chép tay",
        items: [
          "Nghe lại chỉ cho bạn cảm giác (“nghe cũng ổn”). Chép ra giấy mới cho bạn thấy ba câu liền nhau đều bắt đầu bằng “I think”, hay mười hai lần “very”.",
          "Đừng sửa khi chép. Bản chép là chứng cứ; bản sửa là việc của bước ⑤.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Mổ Part 1 — Colours và Weekends (6 câu)" },
      { t: "p", text: "Part 1 trông dễ, nên người band 7 nói theo quán tính. Sáu câu của Đề 10 mỗi câu có một **chữ gài** — chữ thay đổi kiểu câu trả lời giám khảo chờ nghe. Bảng dưới không cho câu trả lời mẫu để học thuộc; nó chỉ ra câu hỏi THẬT SỰ hỏi gì." },
      {
        t: "table",
        head: ["Câu (trích)", "Chữ gài → câu hỏi thật", "Bẫy band 6–7", "Band 8 làm gì"],
        rows: [
          ["…a colour you **would never** choose for your clothes?", "giả định + lý do", "“I never wear yellow.” (mất would, không lý do)", "nêu một màu + lý do có chút tự giễu: “Probably mustard — I tried it once and looked ill for a week.”"],
          ["Do colours affect your mood **at all**?", "at all mời câu trả lời có mức độ", "giảng tâm lý học màu sắc như bài báo", "trả lời từ trải nghiệm, có sắc thái: “More than I'd like to admit…” / “Not really — although…”"],
          ["…**thought to be** lucky or unlucky in your country?", "văn hoá, nhưng vẫn là Part 1 (20–35 giây)", "liệt kê năm màu như sách hướng dẫn du lịch, nói một phút", "hai màu theo hai hướng + một ghi chú về thay đổi (bài mẫu: đỏ / trắng / thế hệ trẻ)"],
          ["How do you **usually** spend your weekends?", "thói quen — hiện tại đơn, tend to, will", "“I wake up, I eat breakfast, I watch TV…” (liệt kê buổi sáng)", "một khuôn + một ngoại lệ: “Saturdays tend to disappear into chores, so Sunday's the one I protect.”"],
          ["…**prefer** to plan… or to leave them free?", "lựa chọn + điều kiện", "“Both.” rồi im", "chọn có điều kiện: “It depends on how the week's gone — after a heavy one, I want nothing in the diary.”"],
          ["…different from the ones you had **as a child**?", "so sánh quá khứ – hiện tại", "sai thì: “When I was child, I go to my grandmother house.”", "used to / would cho quá khứ, hiện tại đơn cho bây giờ, một câu nhận xét: “Weekends used to just happen to me; now I have to make them happen.”"],
        ],
      },
      {
        t: "note", title: "⚠️ Lỗi người Việt nghe thấy nhiều nhất ở Part 1 Đề 10",
        items: [
          "~~I would never choose the yellow colour.~~ → I'd never wear yellow. Màu sắc không cần the… colour; dùng thẳng tên màu.",
          "~~Colours make my mood become happy.~~ → Bright colours tend to lift my mood. (make + O + V nguyên, không become; lift / brighten someone's mood là collocation đúng.)",
          "~~In my country, red is lucky colour.~~ → Red's considered lucky here. Thiếu mạo từ, và Part 1 nên dùng here / where I'm from thay vì “in my country” lặp lại.",
          "~~When I was child…~~ → When I was a child / As a kid… — thiếu mạo từ a là lỗi GRA cơ bản giám khảo nghe ngay.",
        ],
      },
      {
        t: "mcq", id: "t5d22-noi-p1-chon", title: "Part 1 — chọn câu mở đầu hay nhất (4 câu)",
        items: [
          { q: "1. “Do colours affect your mood at all?”", options: ["Yes. Colours affect my mood very much.", "More than I'd like to admit, actually — a grey morning can flatten me for the whole day.", "According to psychologists, blue is a calming colour."], correct: 1, why: "Trả lời có mức độ + ví dụ của chính mình. A lặp câu hỏi; C giảng bài." },
          { q: "2. “Are your weekends now different from the ones you had as a child?”", options: ["Completely. As a kid, weekends meant my grandparents' house; now they mostly mean catching up on sleep.", "Yes, they are different from the ones I had as a child.", "When I was child, I go to my grandparents' house every weekend."], correct: 0, why: "Paraphrase + so sánh hai thời. B lặp nguyên câu hỏi; C sai thì và thiếu mạo từ." },
          { q: "3. Part 1 nên dài khoảng:", options: ["5–10 giây", "20–35 giây", "60–90 giây"], correct: 1, why: "Hai ba câu: trả lời + lý do / ví dụ. Dài hơn thì giám khảo ngắt và FC không lên." },
          { q: "4. “Do you prefer to plan your weekends or to leave them free?”", options: ["Both of them are good.", "I'd rather leave them free, as long as I've sorted out the boring stuff by Friday.", "Planning is better than leaving free because planning is good."], correct: 1, why: "Chọn + điều kiện (as long as). A né câu hỏi; C lặp từ và vòng tròn." },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Mổ Part 2 — “a tradition in your family or community that you hope will continue”" },
      {
        t: "table", caption: "Thẻ hỏi gì — đọc từng chữ",
        head: ["Chữ trên thẻ", "Nghĩa là", "Nếu bỏ qua"],
        rows: [
          ["**in your family or community**", "truyền thống NHỎ, của nhóm bạn thuộc về", "nói Tết cả nước ⇒ thành bài giới thiệu văn hoá học thuộc"],
          ["**what… when and how… who**", "ba ý kể — hiện tại đơn cho việc lặp lại hằng năm", "kể toàn quá khứ như một lần duy nhất"],
          ["**that you hope will continue**", "có nguy cơ mất ⇒ phải nói vì sao có thể mất", "chỉ khen “it is very meaningful”"],
          ["**explain why**", "ý dài nhất (~40 giây) — chỗ để suy ngẫm", "một câu “because it is our culture”"],
        ],
      },
      { t: "p", text: "Bản band 7 dưới đây do khoá viết MỚI để mổ — nó là lỗi điển hình, không phải bài của ai. Đọc rồi so với bảng ngay sau." },
      {
        t: "dialogue", title: "Bài nói band 7 (ước tính) — khoảng 1 phút 30 giây, 182 từ",
        lines: [
          { who: "Thí sinh A", role: "a", text: "I would like to talk about Tet, which is the most important traditional festival in Vietnam. It usually takes place in January or February, depending on the lunar calendar. Before Tet, people clean and decorate their houses, and they buy a lot of food and flowers.", vi: "Chọn truyền thống CẢ NƯỚC — thẻ hỏi gia đình hoặc cộng đồng. Ý “what” biến thành định nghĩa." },
          { who: "Thí sinh A", role: "a", text: "During Tet, family members come back home and they have meals together. Children receive lucky money in red envelopes, and people visit their relatives and friends. My family also makes banh chung, which is a traditional cake. Everyone in my family takes part in it, from my grandparents to my little cousins.", vi: "Liệt kê việc ai cũng biết; không có chi tiết cảm quan, không có một khoảnh khắc riêng." },
          { who: "Thí sinh A", role: "a", text: "I hope this tradition will continue because it is very meaningful. It helps people to remember their roots and it brings family members closer. Nowadays, young people are very busy and some of them prefer to travel during Tet, so I am worried that the tradition will disappear. In conclusion, Tet is a very important tradition and I hope it will continue forever.", vi: "Ý “why” có mầm tốt (người trẻ đi du lịch) nhưng chỉ một câu; very meaningful / very important lặp; “In conclusion” là ngôn ngữ bài viết." },
        ],
      },
      {
        t: "table", caption: "Bản band 7 ở trên ↔ bài mẫu band 8 của Đề 10 (xem đầy đủ trong Online Test)",
        head: ["Tiêu chí", "Band 7", "Bài mẫu band 8 làm gì (trích ngắn)", "Động tác để học"],
        rows: [
          ["**FC**", "đúng thứ tự thẻ nhưng ý why chỉ 3 câu; kết bằng In conclusion", "điểm xoay trung thực: “as a teenager I found the whole thing a bit of a chore” → giờ hiểu nó để làm gì; kết vòng về chi tiết đầu bài", "ý why = trước tôi nghĩ… / giờ tôi thấy… / nếu mất thì…"],
          ["**LR**", "very meaningful ×1, very important ×1, tradition ×4", "chi tiết cảm quan “smells of incense and fried shallots”; không lặp tradition (the whole thing, the day, it)", "2 chi tiết giác quan + chuỗi từ thay thế (mục 5)"],
          ["**GRA**", "hiện tại đơn + will; câu ghép and… and…", "đảo ngữ ĐÚNG MỘT lần ở cảnh trang trọng nhất: “only when the sticks have burned down do we…”; hiện tại hoàn thành cho thay đổi: “Fewer of us have been able to come”", "một ★ ở chỗ chậm nhất của câu chuyện (Ngày 21)"],
          ["**P**", "đọc đều, giọng xuống ở mọi dấu phẩy", "chậm và hạ giọng ở cảnh bàn thờ, nhanh hơn ở đoạn tự giễu", "ngữ điệu kể chuyện (Ngày 17)"],
        ],
      },
      { t: "rule", formula: "nhỏ + cụ thể (một gia đình, một ngày) → 2 chi tiết giác quan → điểm xoay thật → nếu mất thì… → khép vòng", vi: "Thẻ “hope will continue” chấm ở ý why: phải có nguy cơ mất và lý do riêng của bạn." },

      /* ── 4 ── */
      { t: "h", text: "4. Mổ Part 3 — năm câu, năm loại, năm khung" },
      {
        t: "table",
        head: ["Câu (trích)", "Loại", "Khung band 8", "Lỗi người Việt hay mắc", "★ hợp (Ngày 21)"],
        rows: [
          ["How do children… **learn about** traditional customs?", "sự thật / cách thức", "2–3 kênh (gia đình, trường, mạng) + một nhận xét kênh nào đang mạnh lên / yếu đi", "một câu “from their parents” rồi dừng", "câu chẻ: What's changed isn't…, it's…"],
          ["**Why do some** traditions survive… **while others** die out…?", "nguyên nhân HAI VẾ", "một tiêu chí áp cho cả hai vế (bài mẫu: “whether a tradition still does a job”)", "chỉ giải thích vế survive", "It's not so much X as Y"],
          ["**To what extent should** governments spend public money…?", "mức độ / chính sách", "mức độ (to some extent) + tiêu chí chi cho cái gì + điều kiện", "Yes / No tuyệt đối; “but not too much”", "It's vital that + S + V · Only if…"],
          ["**Is it ever right to** give up a tradition…?", "đạo đức", "“Yes, though…” + phép thử + trường hợp cần thận trọng", "“No, because tradition is our identity.”", "That I accept. What I don't accept is…"],
          ["Do you think… will **become more alike in the future**?", "dự đoán", "dự đoán có mức độ + hai lực ngược nhau + hedging", "“Yes, because of globalisation.” một câu", "Should that happen,…"],
        ],
      },
      { t: "p", text: "Bài mẫu của Đề 10 có câu trả lời band 8 cho câu “Why do some…” và “Is it ever right…”. Câu **chính sách** thì không — nên dưới đây là bản band 7 và band 8 khoá viết mới cho câu ấy." },
      {
        t: "dialogue", title: "Câu Part 3 chính sách — band 7 (ước tính), khoảng 35 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "To what extent should governments spend public money on keeping traditions alive?" },
          { who: "Thí sinh A", role: "a", text: "Yes, I think the government should spend money on traditions, because traditions are very important for our culture and identity. If the government does not spend money, many traditions will disappear. For example, in Vietnam there are many traditional festivals and the government helps to organise them. However, the government also needs to spend money on other things like hospitals and schools. So I think they should spend some money, but not too much.", vi: "Trả lời Yes cho câu To what extent (lệch loại); không có tiêu chí CHI CHO CÁI GÌ; “some money, but not too much” là mức độ rỗng." },
        ],
      },
      {
        t: "dialogue", title: "Câu Part 3 chính sách — band 8 (ước tính), khoảng 55 giây",
        lines: [
          { who: "Examiner", role: "examiner", text: "To what extent should governments spend public money on keeping traditions alive?" },
          { who: "Thí sinh B", role: "candidate", text: "To some extent — but I'd be quite choosy about what the money's for. What public funding does well isn't keeping a custom going artificially; it's protecting the things a tradition can't survive without.", vi: "① Mức độ + ★ câu chẻ sửa tiền đề (giữ sống nhân tạo ↔ bảo vệ thứ không thể thiếu)." },
          { who: "Thí sinh B", role: "candidate", text: "A craft that only has a handful of masters left, say, or recording songs and rituals before the last people who know them are gone. I'd support that without hesitation, because once that knowledge is lost, no amount of money brings it back.", vi: "② Hai ví dụ cụ thể + cơ chế (mất rồi không mua lại được)." },
          { who: "Thí sinh B", role: "candidate", text: "Where I'd be more sceptical is paying for festivals nobody would turn up to otherwise. If a community's stopped caring about something, a subsidy just turns it into a show for tourists. So it's vital that the money go to the people who still practise a tradition, not to the spectacle around it.", vi: "③ Câu xoay bằng câu chẻ nhẹ (Where I'd be…) → ④ ★ giả định It's vital that… go (V nguyên) ở câu chốt." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 7", "Band 8"],
        rows: [
          ["**FC**", "trả lời lệch loại (Yes cho To what extent); ý nhảy sang bệnh viện", "mức độ → tiêu chí → ví dụ → giới hạn → điều kiện chốt; ~55 giây"],
          ["**LR**", "very important, culture and identity, some money", "choosy, a handful of masters, no amount of money, sceptical, subsidy, a show for tourists, spectacle"],
          ["**GRA**", "điều kiện loại 1, câu đơn chính xác", "câu chẻ (What… isn't…, it's…), mệnh đề quan hệ rút gọn, giả định (that the money go), điều kiện loại 1 trong ngữ cảnh lý lẽ"],
          ["**P**", "nhấn đều", "nhấn tương phản: “isn't KEEPING a custom going… it's PROTECTING…”; hạ giọng ở “say”"],
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Paraphrase tinh — bốn mức mở câu trả lời, và chuỗi từ thay thế" },
      { t: "p", text: "Tập 3 Ngày 12 và Tập 5 Ngày 11 dạy paraphrase câu hỏi ở mức đồng nghĩa. Band 8 đi xa hơn: câu đầu tiên của bạn **đổi khung** câu hỏi — biến nó thành một tiêu chí hay một biến số. Ví dụ dùng câu Part 3 số 2 của Đề 10." },
      {
        t: "table",
        head: ["Mức", "Cách làm", "Ví dụ mở đầu", "Dùng khi"],
        rows: [
          ["1 — Lặp", "nhắc lại nguyên câu hỏi", "~~Some traditions survive for centuries because…~~", "không bao giờ"],
          ["2 — Đồng nghĩa", "thay từ, giữ khung", "Some customs last for hundreds of years, while others vanish quickly, mainly because…", "Part 1, câu ngắn"],
          ["3 — Đổi khung", "danh từ hoá / đổi chủ ngữ", "How long a tradition lasts usually depends on…", "Part 3 thường"],
          ["4 — Đặt tiêu chí", "đổi câu hỏi thành MỘT biến số rồi trả lời theo nó", "I think it mostly comes down to whether a tradition still does a job for the people who keep it.", "Part 3 nguyên nhân / mức độ / đạo đức"],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "It (mostly) comes down to whether…", vi: "đặt tiêu chí — mức 4", examples: [
            { en: "It mostly comes down to whether people can see what they'd lose.", vi: "Rốt cuộc phần lớn là do người ta có thấy mình sẽ mất gì hay không." },
          ] },
          { formula: "A lot depends on + N / wh-…", vi: "đổi khung thành biến số — mức 3–4", examples: [
            { en: "A lot depends on who's paying for it.", vi: "Nhiều thứ phụ thuộc vào ai trả tiền." },
          ] },
          { formula: "If by X you mean Y, then…", vi: "thu hẹp phạm vi câu hỏi trước khi trả lời", examples: [
            { en: "If by traditions you mean big national festivals, then no — but family customs are a different story.", vi: "Nếu truyền thống ở đây là lễ hội lớn cấp quốc gia thì không — còn phong tục gia đình lại là chuyện khác." },
          ] },
          { formula: "I'd turn that round slightly: …", vi: "lật câu hỏi — dùng khi tiền đề câu hỏi chưa đúng", examples: [
            { en: "I'd turn that round slightly: it's not that traditions are dying, it's that they're changing shape.", vi: "Tôi muốn lật lại một chút: không phải truyền thống đang chết, mà là chúng đang đổi hình dạng." },
          ] },
        ],
      },
      {
        t: "table", caption: "Chuỗi từ thay thế — để không lặp từ của giám khảo (LR · S10)",
        head: ["Từ của giám khảo", "Thay bằng (chọn theo nghĩa)"],
        rows: [
          ["tradition", "custom · ritual · practice · occasion · gathering · the way things have always been done"],
          ["continue / survive", "carry on · last · keep going · be kept alive · be handed down · outlive"],
          ["die out", "vanish · fade away · fall out of use · be lost · disappear within a generation"],
          ["spend public money on", "fund · subsidise · put taxpayers' money into · support financially"],
          ["become more alike", "converge · become more uniform · lose their local character · blur together"],
        ],
      },
      { t: "rule", formula: "Part 1: trả lời thẳng, mức 2 · Part 3: mức 3–4 ở câu đầu · sau đó: chuỗi từ thay thế, không lặp từ khoá giám khảo quá một lần", vi: "Paraphrase là để định hướng câu trả lời, không phải để câu giờ." },
      {
        t: "mcq", id: "t5d22-noi-paraphrase", title: "Paraphrase — chọn câu mở đầu mức 3–4 (5 câu hỏi MỚI)",
        items: [
          { q: "1. “Why do some people keep in touch with old school friends while others lose contact completely?”", options: ["Some people keep in touch with old school friends because…", "I think it mostly comes down to whether there's still something you share now, not just something you shared then.", "That's a very interesting question about friends."], correct: 1, why: "Mức 4: đổi câu hỏi hai vế thành MỘT tiêu chí (còn điểm chung hiện tại không) — áp được cho cả hai vế." },
          { q: "2. “To what extent should cities control what new buildings look like?”", options: ["A lot depends on where — in a historic centre I'd want strict rules; on the outskirts, far fewer.", "Cities should control what new buildings look like to some extent.", "Yes, cities should control buildings."], correct: 0, why: "Mức 3–4: biến câu hỏi mức độ thành biến số (ở đâu). B lặp; C lệch loại câu." },
          { q: "3. “Is it ever right to break a promise?”", options: ["Breaking a promise is ever right when…", "Yes, though I'd want a very good reason — the test for me is whether keeping it would hurt someone who never agreed to it.", "No, promises are promises."], correct: 1, why: "Khung câu đạo đức: Yes, though… + phép thử. A sai ngữ pháp và lặp; C đóng câu chuyện." },
          { q: "4. “Do you think handwriting will disappear in the future?”", options: ["If by disappear you mean in everyday use, then probably — but I suspect it'll survive in a few places where it still matters, like signatures and notes to yourself.", "I think handwriting will disappear in the future.", "Handwriting is very important and it will never disappear."], correct: 0, why: "Thu hẹp phạm vi (If by… you mean…) + dự đoán có hedging. C khẳng định tuyệt đối." },
          { q: "5. “How do young people in your country usually find out about local events?”", options: ["Young people in my country usually find out about local events by…", "Mostly through their phones, though not in the way you'd expect — it's less the official pages than friends' stories.", "Local events are found out by young people."], correct: 1, why: "Câu sự thật: trả lời thẳng + một nhận xét có độ tinh (không phải trang chính thức mà là story của bạn bè). A lặp nguyên câu hỏi." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. 🔊 Phát âm — trọng âm từ dài của chủ đề truyền thống và xã hội" },
      { t: "p", text: "Lỗi P hay gặp nhất khi mổ bài nói Đề 10 là **trọng âm từ dài**: người Việt nhấn âm cuối (ceremo-NY, tradition-AL-ly) hoặc nhấn đều mọi âm. Tám câu dưới gom những từ dài của đề và của bài hôm nay. Phần dịch ghi âm tiết nhấn bằng CHỮ HOA." },
      {
        t: "phatam", id: "t5d22-phat-am", title: "Luyện phát âm — trọng âm từ dài: ceremony, generation, heritage, authentic…",
        note: "Mỗi câu chỉ có 2–3 từ dài; nhấn ĐÚNG một âm tiết trong mỗi từ ấy, các âm tiết còn lại đọc nhẹ (thường thành /ə/). Thu âm rồi so: Azure sẽ báo từ nào trọng âm sai.",
        items: [
          { text: "Our ceremony has hardly changed in a generation.", ipa: "aʊə serəməni həz hɑːdli tʃeɪndʒd ɪn ə dʒenəreɪʃn", vi: "Nghi lễ của chúng tôi gần như không đổi trong một thế hệ. (CEremony · geneRAtion)" },
          { text: "It's a ritual we inherited from our ancestors.", ipa: "ɪts ə rɪtʃuəl wi ɪnherɪtɪd frəm aʊər ænsestəz", vi: "Đó là một nghi thức chúng tôi thừa hưởng từ tổ tiên. (RItual · inHERited · ANcestors)" },
          { text: "Public funding should protect our cultural heritage.", ipa: "pʌblɪk fʌndɪŋ ʃʊd prətekt aʊə kʌltʃərəl herɪtɪdʒ", vi: "Tiền công nên bảo vệ di sản văn hoá của chúng ta. (PUBlic · CULtural · HERitage)" },
          { text: "The festival became more commercial and less authentic.", ipa: "ðə festɪvl bɪkeɪm mɔː kəmɜːʃl ən les ɔːθentɪk", vi: "Lễ hội trở nên thương mại hơn và kém chân thực hơn. (FEStival · comMERcial · auTHENtic)" },
          { text: "Traditionally, the eldest son was responsible for it.", ipa: "trədɪʃənəli ði eldɪst sʌn wəz rɪspɒnsəbl fɔːr ɪt", vi: "Theo truyền thống, con trai cả chịu trách nhiệm việc đó. (traDItionally · reSPONsible)" },
          { text: "Communities decide which customs are worth preserving.", ipa: "kəmjuːnətiz dɪsaɪd wɪtʃ kʌstəmz ə wɜːθ prɪzɜːvɪŋ", vi: "Cộng đồng quyết định phong tục nào đáng giữ gìn. (comMUnities · CUStoms · preSERving)" },
          { text: "It's an occasion that brings three generations together.", ipa: "ɪts ən əkeɪʒn ðət brɪŋz θriː dʒenəreɪʃnz təɡeðə", vi: "Đó là một dịp quy tụ ba thế hệ. (ocCAsion · geneRAtions · toGETHer)" },
          { text: "Subsidising it would turn it into a performance.", ipa: "sʌbsɪdaɪzɪŋ ɪt wʊd tɜːn ɪt ɪntu ə pəfɔːməns", vi: "Trợ cấp cho nó sẽ biến nó thành một màn trình diễn. (SUBsidising · perFORmance)" },
        ],
      },
      {
        t: "mcq", id: "t5d22-noi-trong-am", title: "Trọng âm — chọn âm tiết được nhấn (4 câu)",
        items: [
          { q: "1. heritage", options: ["HER-i-tage", "her-I-tage", "her-i-TAGE"], correct: 0, why: "/ˈherɪtɪdʒ/ — âm đầu; -age đọc /ɪdʒ/, không phải “ây-giơ”." },
          { q: "2. authentic", options: ["AU-then-tic", "au-THEN-tic", "au-then-TIC"], correct: 1, why: "/ɔːˈθentɪk/ — đuôi -ic nhấn âm NGAY TRƯỚC nó." },
          { q: "3. generation", options: ["GEN-er-a-tion", "gen-er-A-tion", "gen-ER-a-tion"], correct: 1, why: "/ˌdʒenəˈreɪʃn/ — đuôi -tion nhấn âm ngay trước nó." },
          { q: "4. ceremony", options: ["CER-e-mo-ny", "cer-E-mo-ny", "cer-e-MO-ny"], correct: 0, why: "/ˈserəməni/ — âm đầu (Anh–Anh). Lỗi người Việt: cer-e-MO-ny." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Kiểm tra — mổ đề (6 câu)" },
      {
        t: "mcq", id: "t5d22-noi-kiem", title: "Kiểm tra cuối bài (6 câu)",
        items: [
          { q: "1. Câu Part 3 “To what extent should…?” KHÔNG nên mở bằng:", options: ["To some extent — but…", "Yes.", "Up to a point, depending on…"], correct: 1, why: "To what extent hỏi MỨC ĐỘ; Yes / No là lệch loại câu hỏi." },
          { q: "2. Với thẻ “a tradition… that you hope will continue”, ý nào nên dài nhất?", options: ["what the tradition is", "who takes part", "why you hope it will continue"], correct: 2, why: "Ý why ~40 giây: nguy cơ mất + lý do riêng + điểm xoay." },
          { q: "3. Câu nào là paraphrase mức 4?", options: ["Traditions survive because…", "I think it mostly comes down to whether a custom still matters to the people who keep it.", "Some customs last a long time, but others don't."], correct: 1, why: "Đổi câu hỏi thành một tiêu chí (whether…)." },
          { q: "4. Bài mẫu Part 2 của Đề 10 dùng đảo ngữ:", options: ["ở câu đầu để gây ấn tượng", "đúng một lần, ở cảnh trang trọng nhất của câu chuyện", "ba lần cho đủ phạm vi"], correct: 1, why: "“only when the sticks have burned down do we…” — một ★ ở chỗ chậm nhất, đúng luật Ngày 21." },
          { q: "5. Câu hỏi nguyên nhân hai vế (Why do some… while others…?) band 8 nên:", options: ["giải thích kỹ vế đầu", "đưa một tiêu chí áp được cho cả hai vế", "trả lời vế sau trước"], correct: 1, why: "Một tiêu chí cho hai vế = lập luận chặt (FC) và tránh nói hai bài riêng." },
          { q: "6. Bước nào của việc mổ bài nói tạo ra “chứng cứ”?", options: ["nghe lại một lần", "chép nguyên văn, cả câu bỏ dở", "đọc bài mẫu"], correct: 1, why: "Bản chép tay cho thấy lỗi lặp (I think ×3, very ×12) mà tai bỏ qua." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Luyện lại bằng câu MỚI — cùng kỹ năng, khác chủ đề — AI chấm" },
      {
        t: "note", title: "💡 Cách luyện — mang 2–3 ưu tiên từ bước ③",
        items: [
          "Part 1 Gifts · Snacks: mỗi câu có một chữ gài giống Đề 10 (would never · at all · thought to be · usually · prefer · as a child). Tìm chữ gài trước khi nói.",
          "Part 2: thẻ A giống Đề 10 ở chỗ phải giải thích một phong tục; thẻ B giống ở chỗ ý cuối phải có suy ngẫm. 1 phút ghi chú, 2 phút nói, không dừng ghi âm.",
          "Part 3: năm câu đủ năm loại. Câu đầu mỗi câu trả lời là paraphrase mức 3–4; mỗi câu trả lời 1–2 ★ (Ngày 21).",
        ],
      },
      {
        t: "speak", id: "t5d22-noi-p1", part: "1",
        questions: [
          "Is there a gift you would never give someone?",
          "Do you enjoy choosing gifts at all?",
          "Are any gifts thought to be unlucky in your country?",
          "When do you usually have a snack?",
          "Do you prefer to buy snacks or to make them yourself?",
          "Are the snacks you eat now different from the ones you had as a child?",
        ],
      },
      {
        t: "speak", id: "t5d22-noi-p2", part: "2",
        questions: [
          "Describe a custom from another culture that you find interesting. You should say: what the custom is; how you learned about it; what people do; and explain why you find it interesting.",
        ],
      },
      {
        t: "speak", id: "t5d22-noi-p2-them", part: "2",
        questions: [
          "Describe a gift you gave that took you a long time to choose. You should say: who it was for; what the gift was; why it took you so long to choose it; and explain how the person reacted.",
        ],
      },
      {
        t: "speak", id: "t5d22-noi-p3", part: "3",
        questions: [
          "How do people in your country usually learn about the customs of other countries?",
          "Why do some visitors adapt easily to local customs while others find it difficult?",
          "To what extent should tourists be expected to follow local customs?",
          "Is it ever acceptable for a community to keep a custom that visitors find offensive?",
          "Do you think young people will be more or less interested in other cultures in the future?",
        ],
      },
      {
        t: "note", title: "📌 Sau khi luyện — giám khảo AI 14 phút (S17) và sổ Speaking",
        items: [
          "Trong tuần này làm lại trọn một bài Speaking 11–14 phút với giám khảo AI ở Online Test (`/language/en/ielts/thi-may`) — chọn bộ đề bạn CHƯA làm. So bảng nhãn FC / LR / GRA / P với lần Đề 10: lỗi nào đã hết, lỗi nào còn.",
          "Chép vào sổ Speaking: bốn khuôn paraphrase của mục 5, bảng chuỗi từ thay thế, và câu trả lời Part 3 hay nhất bạn vừa nói (nguyên văn).",
          "Ngày 23 (Part 3 phản biện giám khảo khéo) dùng lại bảng năm loại câu hỏi ở mục 4. Ngày 24 làm Đề 11.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 22 ═══════════════════════════ */
  {
    id: "t5d22-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 22 — từ cho đề lạ · cặp dễ nhầm · gọi tên lỗ hổng · đoạn phản biện · paraphrase câu hỏi · nói lại",
    goal: "Ôn trọn Ngày 22 trong 65 phút: dùng đúng 24 từ của bốn chủ đề lạ và social issues vòng 2, không nhầm năm cặp dễ lẫn, dịch năm câu Task 2, gọi tên lỗ hổng trong năm nhận định, chọn câu mở đầu Part 3 mức 3–4 — rồi viết một đoạn phản biện 150–180 từ và nói một thẻ Part 2 mới cho AI chấm.",
    minutes: 65,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay",
        items: [
          "Phần I–V ôn **Bài 1** (50 từ, cặp dễ nhầm, dịch năm câu Task 2). Sai từ 2 câu trong một phần ⇒ đọc lại mục tương ứng và tự đặt ba câu với từ đã sai.",
          "Phần VI và VIII ôn **Bài 2**: gọi tên lỗ hổng, rồi viết đoạn phản biện ngắn có kết luận điều kiện.",
          "Phần VII và IX ôn **Bài 3**: paraphrase mức 3–4, một thẻ Part 2 mới + ba câu Part 3.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ngày 22 trong một hình", center: "Đề lạ, chứng cứ, mổ bài nói",
        branches: [
          { label: "Từ cho đề lạ", items: ["informed consent", "black box · human in the loop", "spin-off · probe", "germline · heritable", "systemic · tokenism"] },
          { label: "Phản biện", items: ["tóm tắt trung lập", "ghi nhận thật", "2–3 lỗ hổng có tên", "kết luận có điều kiện"] },
          { label: "Mổ Đề 10", items: ["chữ gài Part 1", "ý why dài nhất", "5 loại câu Part 3", "chép tay → nhãn"] },
          { label: "Paraphrase", items: ["mức 3: đổi khung", "mức 4: đặt tiêu chí", "chuỗi từ thay thế"] },
        ],
      },

      { t: "h", text: "I. Đạo đức và AI — điền MỘT từ (6 câu) — ôn Bài 1 mục 1–2" },
      {
        t: "quiz", id: "t5d22-bt-dao-duc-ai", kind: "fill", title: "I. Đạo đức · AI",
        items: [
          { q: "1. Employers owe their staff a duty of ___.", answers: ["care"], hint: "duty of care." },
          { q: "2. The engineer who exposed the faulty brakes was praised as a whistle-___.", answers: ["blower"], hint: "whistle-blower." },
          { q: "3. A purely ___ approach would ask only which option helps the greatest number.", answers: ["utilitarian"], hint: "utilitarian — vị lợi." },
          { q: "4. If nobody can explain how the system reached its decision, it is effectively a black ___.", answers: ["box"], hint: "black box." },
          { q: "5. Insurers argue about ___ when a self-driving car causes damage.", answers: ["liability"], hint: "liability — trách nhiệm pháp lý." },
          { q: "6. Automation has led to job ___ in factories and offices alike.", answers: ["displacement"], hint: "job displacement." },
        ],
      },

      { t: "h", text: "II. Vũ trụ và di truyền — chọn phương án đúng (6 câu) — ôn Bài 1 mục 3–4" },
      {
        t: "mcq", id: "t5d22-bt-vu-tru-gen", title: "II. Vũ trụ · Di truyền",
        items: [
          { q: "1. Rules to prevent spacecraft from carrying microbes to other worlds are called planetary ___.", options: ["protection", "prevention", "preservation"], correct: 0, why: "planetary protection — cụm cố định." },
          { q: "2. A rocket's ___ is the satellite or equipment it carries.", options: ["payload", "probe", "orbit"], correct: 0, why: "payload = khối hàng hữu ích." },
          { q: "3. Ticket prices make space ___ affordable only for the very rich.", options: ["tourism", "travelling", "touring"], correct: 0, why: "space tourism — danh từ ghép cố định." },
          { q: "4. A treatment that changes the genes in one patient's blood cells is an example of gene ___.", options: ["therapy", "editing of the germline", "eugenics"], correct: 0, why: "Chữa bệnh cho một người, không truyền đời sau ⇒ gene therapy." },
          { q: "5. Some critics describe embryo editing as “playing ___”.", options: ["God", "doctor", "nature"], correct: 0, why: "playing God — cụm cố định (thuật lại như ý người khác)." },
          { q: "6. Mars is not currently ___: no human could survive there unprotected.", options: ["habitable", "inhabited", "habitual"], correct: 0, why: "habitable = có thể sống được. inhabited = đã có người ở; habitual = thường lệ." },
        ],
      },

      { t: "h", text: "III. Social issues vòng 2 — điền MỘT từ (6 câu) — ôn Bài 1 mục 5" },
      {
        t: "quiz", id: "t5d22-bt-xa-hoi", kind: "fill", title: "III. Social issues vòng 2",
        items: [
          { q: "1. Progressive taxation is a tool for the ___ of wealth.", answers: ["redistribution"], hint: "redistribution of wealth." },
          { q: "2. Young people who feel ___ are less likely to vote.", answers: ["disenfranchised"], hint: "disenfranchised — cảm thấy không có tiếng nói." },
          { q: "3. Poverty often leads to social ___: people stop going out because they cannot afford to.", answers: ["exclusion"], hint: "social exclusion." },
          { q: "4. Anonymous applications are meant to reduce ___ bias.", answers: ["unconscious", "implicit"], hint: "unconscious / implicit bias." },
          { q: "5. Universal basic ___ would pay everyone the same amount, regardless of need.", answers: ["income"], hint: "universal basic income." },
          { q: "6. Positive ___ is known as affirmative action in American English.", answers: ["discrimination"], hint: "positive discrimination (Anh–Anh)." },
        ],
      },

      { t: "h", text: "IV. Cặp dễ nhầm (5 câu) — ôn Bài 1 mục 6" },
      {
        t: "mcq", id: "t5d22-bt-de-nham", title: "IV. Cặp dễ nhầm",
        items: [
          { q: "1. The title of duke is ___ in that family.", options: ["hereditary", "heritable", "inherited"], correct: 0, why: "Tước vị cha truyền con nối ⇒ hereditary." },
          { q: "2. The robot vacuum follows a fixed route — it is ___, not truly autonomous.", options: ["automated", "autonomy", "autonomous"], correct: 0, why: "Làm theo chương trình định sẵn ⇒ automated." },
          { q: "3. Unfairness that is built into how schools are funded is ___.", options: ["systematic", "systemic", "symmetric"], correct: 1, why: "systemic = thuộc về hệ thống." },
          { q: "4. Doctors must follow strict ___ guidelines on patient data.", options: ["moral", "ethical", "morality"], correct: 1, why: "Quy tắc nghề nghiệp ⇒ ethical guidelines." },
          { q: "5. Before people settle on Mars, nobody seriously expects to ___ it for centuries.", options: ["colonise", "terraform", "orbit"], correct: 1, why: "Cải tạo hành tinh cho giống Trái Đất ⇒ terraform; colonise = đến định cư (việc diễn ra TRƯỚC)." },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu) — ôn Bài 1 mục 1–5 · 7" },
      {
        t: "quiz", id: "t5d22-bt-dich", kind: "translate", title: "V. Dịch — câu Task 2 dùng từ mới",
        grammar: "mỗi câu dùng ít nhất một từ của Bài 1",
        items: [
          { q: "1. Cứu trợ những công ty liều lĩnh tạo ra rủi ro đạo đức.", answers: ["Bailing out reckless companies creates a moral hazard.", "Rescuing reckless companies creates moral hazard."], hint: "moral hazard" },
          { q: "2. Quyết định về con người phải giải thích được cho chính những người bị ảnh hưởng.", answers: ["Decisions about people must be explainable to the people they affect.", "Decisions about people should be explainable to those affected."], hint: "explainable to" },
          { q: "3. Tàu thăm dò không người lái rẻ hơn và an toàn hơn các chuyến bay có người.", answers: ["Unmanned probes are cheaper and safer than crewed missions.", "Unmanned probes are cheaper and safer than manned missions."], hint: "probe · crewed / manned missions" },
          { q: "4. Việc làm bấp bênh khiến người trẻ khó lên kế hoạch cho tương lai.", answers: ["Precarious work makes it hard for young people to plan for the future.", "Precarious employment makes it difficult for young people to plan ahead."], hint: "precarious · make it hard for sb to V" },
          { q: "5. Nhiều nhà khoa học tin rằng chỉnh sửa dòng mầm là vượt lằn ranh đỏ.", answers: ["Many scientists believe that germline editing crosses a red line.", "Many scientists believe germline editing crosses a red line."], hint: "germline editing · cross a red line" },
        ],
      },

      { t: "h", text: "VI. Gọi tên lỗ hổng lập luận (5 câu) — ôn Bài 2 mục 3" },
      {
        t: "mcq", id: "t5d22-bt-lo-hong", title: "VI. Lỗ hổng nào?",
        items: [
          { q: "1. “Towns with more libraries have lower crime, so libraries reduce crime.”", options: ["Tương quan ≠ nhân quả", "Hồi quy về trung bình", "Dịch chuyển"], correct: 0, why: "Hai thứ cùng xuất hiện; có thể cả hai do thu nhập cao hơn." },
          { q: "2. “The six worst-performing hospitals were given new managers; a year later, all six had improved.”", options: ["Hồi quy về trung bình (và không có nhóm so sánh)", "Xung đột lợi ích", "Khái quát quá mức"], correct: 0, why: "Chọn vì tệ bất thường ⇒ năm sau phần nào tự cải thiện." },
          { q: "3. “95% of customers who answered our online survey were satisfied.”", options: ["Mẫu tự chọn + dữ liệu tự báo cáo", "Dịch chuyển", "Tương quan ≠ nhân quả"], correct: 0, why: "Chỉ người tự nguyện trả lời; “satisfied” là cảm nhận." },
          { q: "4. “Since the new parking fees, the high street car parks have been half empty — the fees reduced traffic.”", options: ["Dịch chuyển: xe có thể đỗ ở khu dân cư lân cận", "Xung đột lợi ích", "Không có lỗ hổng"], correct: 0, why: "Bãi đỗ vắng ≠ ít xe; xe có thể chuyển chỗ đỗ." },
          { q: "5. “Our tutoring app raised scores at one school in the capital, so it will work in every school in the country.”", options: ["Khái quát quá mức", "Hồi quy về trung bình", "Dữ liệu tự báo cáo"], correct: 0, why: "Một trường thủ đô ⇒ mọi trường (nông thôn, thiếu thiết bị…)." },
        ],
      },

      { t: "h", text: "VII. Paraphrase câu hỏi Part 3 — chọn câu mở đầu hay nhất (4 câu MỚI) — ôn Bài 3 mục 5" },
      {
        t: "mcq", id: "t5d22-bt-paraphrase", title: "VII. Paraphrase mức 3–4",
        items: [
          { q: "1. “Why do some people enjoy living in big cities while others can't wait to leave?”", options: ["Some people enjoy living in big cities because…", "A lot depends on what stage of life you're at — the things that excite you at twenty can exhaust you at forty.", "Big cities are enjoyed by some people."], correct: 1, why: "Mức 3–4: biến câu hỏi hai vế thành một biến số (giai đoạn đời), áp cho cả hai vế." },
          { q: "2. “To what extent should parents limit their children's screen time?”", options: ["Parents should limit their children's screen time to some extent.", "Up to a point — though I'd worry less about the hours than about what's on the screen.", "Yes, they should."], correct: 1, why: "Mức độ + đổi khung (giờ ↔ nội dung). A lặp; C lệch loại." },
          { q: "3. “Is it ever right for a journalist to keep a source secret from the police?”", options: ["Yes, though only when revealing the source would put someone in danger or stop people coming forward in future.", "It is ever right for a journalist…", "Journalists are very important in society."], correct: 0, why: "Khung câu đạo đức: Yes, though + phép thử. C né câu hỏi." },
          { q: "4. “Do you think people will read fewer books in the future?”", options: ["I think people will read fewer books in the future.", "If by books you mean printed ones, probably — but I suspect the amount of reading won't fall nearly as much as people fear.", "No, never."], correct: 1, why: "Thu hẹp phạm vi + hedging. A lặp nguyên; C tuyệt đối." },
        ],
      },

      { t: "h", text: "VIII. Viết một đoạn phản biện (150–180 từ) — AI chấm — ôn Bài 2 mục 2–4" },
      { t: "p", text: "Đọc nhận định HƯ CẤU dưới đây. Viết MỘT đoạn: tóm tắt trung lập (1 câu) → ghi nhận (1 câu) → hai lỗ hổng có tên + hậu quả → kết luận có điều kiện + chứng cứ cần có. Không dùng “This proves…”." },
      {
        t: "essay", id: "t5d22-bt-viet", task: "Task 2",
        prompt: "SHORT CRITICAL RESPONSE (150–180 words). A fitness centre (fictional) advertises: “Members who attended at least three of our classes a week lost an average of 4 kg in three months. Our classes are the most effective way to lose weight.” Evaluate whether the evidence supports the final claim.",
        minWords: 150,
        tips: [
          "Lỗ hổng gợi ý: chỉ tính người đi đều (ai bỏ thì không tính); người đi ba buổi / tuần có thể đã đổi cả chế độ ăn; không so với cách giảm cân khác ⇒ “most effective” không có chứng cứ.",
          "Ghi nhận thật: tập đều có ích; 4 kg / 3 tháng là con số hợp lý.",
          "Khuôn: The figure may well be accurate. The question is whether… · This rests on the assumption that… · …should follow, not precede, the evidence.",
        ],
      },

      { t: "h", text: "IX. Nói — thẻ Part 2 mới + Part 3 — AI chấm — ôn Bài 3 mục 3–5" },
      { t: "p", text: "1 phút ghi chú, 2 phút nói. Ý cuối của thẻ phải dài nhất và có suy ngẫm. Rồi trả lời ba câu Part 3, mở mỗi câu bằng paraphrase mức 3–4." },
      {
        t: "speak", id: "t5d22-bt-noi-p2", part: "2",
        questions: [
          "Describe a piece of local knowledge that you think should be recorded before it is lost. You should say: what it is; who still has this knowledge; how you found out about it; and explain why you think it should be recorded.",
        ],
      },
      {
        t: "speak", id: "t5d22-bt-noi-p3", part: "3",
        questions: [
          "Why do some skills get passed down in families while others are forgotten?",
          "To what extent should schools teach traditional crafts?",
          "Will technology make it easier or harder to preserve local knowledge in the future?",
        ],
      },
    ],
  },
];
