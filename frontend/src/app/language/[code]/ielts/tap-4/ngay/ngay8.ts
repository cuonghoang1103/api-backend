/**
 * IELTS Tập 4 — Ngày 8 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, kịch bản nghe, bài mẫu, số liệu biểu đồ, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     AWL sublist 8 (đủ 60 họ từ) + Health vòng 2: hệ thống y tế (18) + Family vòng 2 (12)
 *                     + Personality vòng 2: thành ngữ tính cách – quan hệ (16)                    [VB8 VC09 VC17 VC32]
 *                     — nối Tập 2 Ngày 4 (Health vòng 1) · Ngày 22 (Family, 10 cụm tính cách), Tập 3 Ngày 18 (Personality vòng 1)
 *   Bài 2 (writing)   Task 1 bar chart 3 — cột CHỒNG (stacked) và cột NHÓM (grouped): đọc tổng + thành phần, nhóm số liệu,
 *                     ngoại lệ; bài mẫu band 6 vs band 7                                                        [W09]
 *                     — nối Tập 2 Ngày 8 (bar nhập môn), Tập 3 Ngày 12 (nhiều nhóm, hai biểu đồ, counterpart)
 *   Bài 3 (listening) Part 4 — bài giảng 6 phút (~1.000 từ, ~165 từ/phút), Note + Sentence completion, câu 31–40  [L06 L18]
 *                     — nối Tập 3 Ngày 13 (Note) · Ngày 24 (Summary + Table) · 🔊 âm yếu chuỗi: should have been   [S13]
 *   Bài tập Ngày 8    50 câu có đáp án + 1 đoạn viết
 * Mọi id bắt đầu `t4d8-`.
 * Ghi chú: khối `chart` / `figure` chỉ vẽ được cột NHÓM. Biểu đồ cột chồng trong bài được hiện bằng cột nhóm + tổng (cột Total
 * trong bảng số liệu, hoặc ghi ngay trong tiêu đề / đề bài), kèm lời dặn “trong đề thật các đoạn này chồng lên nhau”.
 */
import type { Lesson } from '../data';

export const NGAY_8: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d8-tu-vung",
    kind: "vocab",
    title: "Từ vựng: AWL sublist 8 + Hệ thống y tế (Health vòng 2) + Gia đình vòng 2 + thành ngữ tính cách",
    goal: "Nhận ra và dùng đúng 60 họ từ học thuật của AWL sublist 8 (kèm giới từ, họ từ, cặp dễ nhầm), 18 từ về hệ thống y tế (preventive healthcare, primary care, out-of-pocket, referral, degenerative disease…), 12 từ về gia đình hiện đại và 16 thành ngữ tính cách – quan hệ đúng nguyên dạng — biết từ nào dùng cho Writing, từ nào chỉ dùng khi nói — đẩy Lexical Resource band 7: linh hoạt, chính xác, có ý thức về văn phong và collocation.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**AWL** (Academic Word List) = 570 họ từ học thuật, chia 10 sublist. Tập 2–3 đã học sublist 1–6; Tập 4 Ngày 2 học sublist 7; hôm nay ==sublist 8 — đủ 60 họ từ==, chia 3 nhóm 20 từ. Đây là những từ xuất hiện dày ở Passage 3 và bài giảng Part 4.",
          "**Health vòng 2**: Tập 2 Ngày 4 học ăn uống – lối sống (balanced diet, obesity, sedentary, chronic…). Hôm nay lên tầng **hệ thống**: y tế dự phòng, chăm sóc ban đầu, bảo hiểm y tế, bệnh thoái hoá — nhóm từ mà đề Task 2 “Should governments spend more on prevention or treatment?” luôn cần. Bài Viết hôm nay (biểu đồ chi tiêu y tế) và bài Nghe (lịch sử tiêm chủng) dùng ngay nhóm này.",
          "**Family vòng 2**: Tập 2 Ngày 22 học từ nền (nuclear family, breadwinner, upbringing…). Hôm nay học 12 từ về **gia đình hiện đại**: dual-income household, parental leave, the sandwich generation…",
          "**Personality vòng 2**: Tập 3 Ngày 18 học 16 tính từ (conscientious, resilient…). Hôm nay học ==16 thành ngữ== tả tính cách và quan hệ — phải thuộc **đúng nguyên dạng**, sai một từ là hỏng (~~the life and the soul of party~~).",
          "Band 7 LR đòi “ý thức về **văn phong** (register) và **collocation**”: thành ngữ ⇒ **Speaking**; trong **Writing** dùng từ trang trọng tương đương (mục 6 có bảng đổi).",
          "Mọi từ trong bài tự vào **Flashcards** và mục **Tra từ vựng**. Dùng nút “Che nghĩa / Che từ” để tự kiểm sau mỗi nhóm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. AWL sublist 8 — họ từ 1–20 (abandon → detect)" },
      {
        t: "p",
        text: "Mỗi dòng là **một họ từ**: từ gốc + các dạng khác ở dòng mở rộng. Đọc câu ví dụ thành tiếng một lần; để ý **giới từ** và **từ đi kèm** in đậm — ở band 7, biết nghĩa là chưa đủ, phải biết từ đó **đi với gì**.",
      },
      {
        t: "vocab",
        items: [
          { w: "abandon", pos: "v", ipa: "/əˈbændən/", vi: "từ bỏ; bỏ rơi", ex: "The government was forced to abandon the plan after public protests.", exVi: "Chính phủ buộc phải từ bỏ kế hoạch sau các cuộc phản đối.", more: "**abandon** a plan / an attempt / a policy · abandoned (adj): an **abandoned** building · abandonment (n)" },
          { w: "accompany", pos: "v", ipa: "/əˈkʌmpəni/", vi: "đi cùng; đi kèm với", ex: "Economic growth is often accompanied by rising inequality.", exVi: "Tăng trưởng kinh tế thường đi kèm bất bình đẳng gia tăng.", more: "be **accompanied by** + N (bị động rất hay gặp) · ⚠️ không giới từ ở chủ động: ~~accompany with~~" },
          { w: "accumulate", pos: "v", ipa: "/əˈkjuːmjəleɪt/", vi: "tích luỹ; dồn lại", ex: "Evidence has accumulated that air pollution damages children's lungs.", exVi: "Bằng chứng đã tích luỹ dần rằng ô nhiễm không khí hại phổi trẻ em.", more: "**accumulate** wealth / debt / evidence · accumulation (n): the **accumulation of** + N" },
          { w: "ambiguous", pos: "adj", ipa: "/æmˈbɪɡjuəs/", vi: "mơ hồ, hiểu được nhiều cách", ex: "The wording of the law is ambiguous and needs to be clarified.", exVi: "Câu chữ của luật còn mơ hồ và cần được làm rõ.", more: "ambiguity (n) · ≠ unambiguous · **ambiguous** wording / results" },
          { w: "append", pos: "v", ipa: "/əˈpend/", vi: "đính kèm (vào cuối văn bản)", ex: "The full results are appended to the report.", exVi: "Kết quả đầy đủ được đính kèm ở cuối báo cáo.", more: "**append** sth **to** sth · appendix (n, số nhiều appendices): phụ lục" },
          { w: "appreciate", pos: "v", ipa: "/əˈpriːʃieɪt/", vi: "trân trọng; hiểu rõ (tầm quan trọng); tăng giá", ex: "Few people appreciate how much unpaid work carers do.", exVi: "Ít ai hiểu hết người chăm sóc làm bao nhiêu việc không lương.", more: "**appreciate** + N / that / how… · appreciation (n) · ⚠️ ~~I appreciate if you…~~ → I would appreciate **it** if you…" },
          { w: "arbitrary", pos: "adj", ipa: "/ˈɑːbɪtrəri/", vi: "tuỳ tiện, không dựa trên lý do rõ ràng", ex: "The age limit of 65 seems completely arbitrary.", exVi: "Giới hạn tuổi 65 có vẻ hoàn toàn tuỳ tiện.", more: "an **arbitrary** decision / limit / figure · arbitrarily (adv)" },
          { w: "automate", pos: "v", ipa: "/ˈɔːtəmeɪt/", vi: "tự động hoá", ex: "Many routine tasks in hospitals have now been automated.", exVi: "Nhiều việc lặp lại trong bệnh viện nay đã được tự động hoá.", more: "automation (n) · automated (adj): an **automated** system · automatic (adj) / automatically (adv)" },
          { w: "bias", pos: "n, v", ipa: "/ˈbaɪəs/", vi: "thành kiến, sự thiên lệch", ex: "The survey was criticised for its bias towards wealthier households.", exVi: "Cuộc khảo sát bị chỉ trích vì thiên về các hộ khá giả.", more: "**bias against / towards / in favour of** · biased (adj) ≠ unbiased · gender **bias**" },
          { w: "chart", pos: "n, v", ipa: "/tʃɑːt/", vi: "biểu đồ; ghi lại diễn biến", ex: "The study charts the decline of the industry over fifty years.", exVi: "Nghiên cứu ghi lại sự suy giảm của ngành này suốt năm mươi năm.", more: "a bar / pie / flow **chart** · **chart** the progress / rise / decline of · uncharted (adj): chưa ai khám phá" },
          { w: "clarify", pos: "v", ipa: "/ˈklærəfaɪ/", vi: "làm rõ", ex: "The minister was asked to clarify what the new rules meant.", exVi: "Bộ trưởng được yêu cầu làm rõ quy định mới nghĩa là gì.", more: "**clarify** a point / the situation / what… · clarification (n) · clarity (n): sự rõ ràng" },
          { w: "commodity", pos: "n", ipa: "/kəˈmɒdəti/", vi: "hàng hoá (nguyên liệu thô); thứ có giá trị", ex: "Clean water is becoming a scarce commodity in many regions.", exVi: "Nước sạch đang trở thành thứ khan hiếm ở nhiều vùng.", more: "**commodity** prices · a scarce / valuable **commodity** · số nhiều: commodities" },
          { w: "complement", pos: "v, n", ipa: "/ˈkɒmplɪment/", vi: "bổ sung cho (làm hoàn chỉnh)", ex: "Online lessons should complement, not replace, classroom teaching.", exVi: "Bài học trực tuyến nên bổ sung chứ không thay thế việc dạy trên lớp.", more: "complementary (adj) · ⚠️ ≠ **compliment** (lời khen) — đọc giống nhau" },
          { w: "conform", pos: "v", ipa: "/kənˈfɔːm/", vi: "tuân theo; làm theo số đông", ex: "Teenagers often feel pressure to conform to the expectations of their friends.", exVi: "Thanh thiếu niên thường thấy áp lực phải làm theo kỳ vọng của bạn bè.", more: "**conform to** rules / standards / expectations · conformity (n) · non-conformist (n)" },
          { w: "contemporary", pos: "adj, n", ipa: "/kənˈtemprəri/", vi: "đương đại; cùng thời", ex: "Loneliness is one of the major problems of contemporary society.", exVi: "Cô đơn là một trong những vấn đề lớn của xã hội đương đại.", more: "**contemporary** society / art / life · n: người cùng thời — Darwin and his **contemporaries**" },
          { w: "contradict", pos: "v", ipa: "/ˌkɒntrəˈdɪkt/", vi: "mâu thuẫn với; nói ngược lại", ex: "The new findings contradict the results of earlier studies.", exVi: "Phát hiện mới mâu thuẫn với kết quả các nghiên cứu trước.", more: "contradiction (n): a **contradiction between** A and B · contradictory (adj)" },
          { w: "crucial", pos: "adj", ipa: "/ˈkruːʃl/", vi: "cực kỳ quan trọng, mang tính quyết định", ex: "Early diagnosis is crucial to successful treatment.", exVi: "Chẩn đoán sớm là then chốt để điều trị thành công.", more: "**crucial to / for** + N · play a **crucial** role in · It is **crucial that**… · ⚠️ không nói ~~very crucial~~ → absolutely crucial" },
          { w: "currency", pos: "n", ipa: "/ˈkʌrənsi/", vi: "tiền tệ; (ý tưởng) được nhiều người chấp nhận", ex: "The idea has gained currency among economists in recent years.", exVi: "Ý tưởng này được giới kinh tế chấp nhận rộng rãi trong vài năm gần đây.", more: "foreign / local **currency** · gain **currency** (trang trọng: trở nên phổ biến)" },
          { w: "denote", pos: "v", ipa: "/dɪˈnəʊt/", vi: "biểu thị, là ký hiệu của", ex: "In the chart, the darker bars denote government spending.", exVi: "Trong biểu đồ, các cột sẫm hơn biểu thị chi tiêu của chính phủ.", more: "= represent, indicate (trang trọng) · hay gặp trong chú thích biểu đồ, công thức" },
          { w: "detect", pos: "v", ipa: "/dɪˈtekt/", vi: "phát hiện (thứ khó thấy)", ex: "The test can detect the disease years before any symptoms appear.", exVi: "Xét nghiệm này phát hiện được bệnh nhiều năm trước khi có triệu chứng.", more: "early **detection** (n) · detector (n) · **detect** a change / a disease / a fault" },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-awl-1",
        kind: "fill",
        title: "Điền dạng đúng của từ trong nhóm 1 (8 câu)",
        items: [
          { q: "Rising incomes are usually ___ by a fall in the birth rate. (đi kèm)", answers: ["accompanied"] },
          { q: "Regular screening allows the early ___ of several cancers. (danh từ của detect)", answers: ["detection"] },
          { q: "The two reports ___ each other: one says costs fell, the other that they rose. (mâu thuẫn)", answers: ["contradict"] },
          { q: "The question was so ___ that half the class misunderstood it. (mơ hồ)", answers: ["ambiguous"] },
          { q: "Children do not always ___ to the rules their parents set. (tuân theo)", answers: ["conform"] },
          { q: "Private clinics can ___ public hospitals by reducing waiting times. (bổ sung)", answers: ["complement"] },
          { q: "The ___ of rubbish in the river has become a health risk. (danh từ của accumulate)", answers: ["accumulation"] },
          { q: "Access to a doctor in the first hour is ___ to the patient's survival. (then chốt)", answers: ["crucial"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. AWL sublist 8 — họ từ 21–40 (deviate → paragraph)" },
      {
        t: "vocab",
        items: [
          { w: "deviate", pos: "v", ipa: "/ˈdiːvieɪt/", vi: "đi chệch, lệch khỏi", ex: "The results did not deviate significantly from the national average.", exVi: "Kết quả không lệch đáng kể so với mức trung bình cả nước.", more: "**deviate from** a plan / the norm / the average · deviation (n)" },
          { w: "displace", pos: "v", ipa: "/dɪsˈpleɪs/", vi: "thay chỗ; buộc phải rời nơi ở", ex: "Thousands of families were displaced by the flooding.", exVi: "Hàng nghìn gia đình phải rời nơi ở vì lũ lụt.", more: "**displaced** people / workers · displacement (n) · = replace (khi nói công nghệ thay con người)" },
          { w: "drama", pos: "n", ipa: "/ˈdrɑːmə/", vi: "kịch; sự việc kịch tính", ex: "The change in public opinion was dramatic and sudden.", exVi: "Sự thay đổi trong dư luận thật mạnh mẽ và đột ngột.", more: "dramatic (adj): a **dramatic** rise / fall · dramatically (adv) — hai dạng này dùng nhiều nhất trong Task 1 · dramatise (v)" },
          { w: "eventual", pos: "adj", ipa: "/ɪˈventʃuəl/", vi: "cuối cùng (sau một thời gian dài)", ex: "The eventual cost of the hospital was twice the original estimate.", exVi: "Chi phí cuối cùng của bệnh viện gấp đôi ước tính ban đầu.", more: "eventually (adv) = in the end · ⚠️ KHÔNG có nghĩa “có thể / nếu có” · eventuality (n): tình huống có thể xảy ra" },
          { w: "exhibit", pos: "v, n", ipa: "/ɪɡˈzɪbɪt/", vi: "biểu lộ (dấu hiệu, hành vi); trưng bày; hiện vật", ex: "Patients in the early stages may exhibit few symptoms.", exVi: "Bệnh nhân ở giai đoạn đầu có thể biểu lộ rất ít triệu chứng.", more: "**exhibit** signs / symptoms / behaviour · exhibition (n) · chữ h câm" },
          { w: "exploit", pos: "v", ipa: "/ɪkˈsplɔɪt/", vi: "khai thác (tài nguyên, cơ hội); bóc lột", ex: "Some employers exploit migrant workers by paying them below the legal minimum.", exVi: "Một số chủ lao động bóc lột lao động nhập cư bằng cách trả dưới mức tối thiểu.", more: "exploitation (n) · **exploit** resources / an opportunity (trung tính) · **exploit** workers (tiêu cực)" },
          { w: "fluctuate", pos: "v", ipa: "/ˈflʌktʃueɪt/", vi: "dao động, lên xuống thất thường", ex: "Demand for hospital beds fluctuates with the seasons.", exVi: "Nhu cầu giường bệnh dao động theo mùa.", more: "**fluctuate between** A **and** B / **around** + số · fluctuation (n): **fluctuations in** + N" },
          { w: "guideline", pos: "n", ipa: "/ˈɡaɪdlaɪn/", vi: "hướng dẫn, nguyên tắc chỉ đạo", ex: "The ministry has issued new guidelines on the use of antibiotics.", exVi: "Bộ đã ban hành hướng dẫn mới về dùng kháng sinh.", more: "issue / follow / draw up **guidelines on / for** + N · thường ở số nhiều" },
          { w: "highlight", pos: "v, n", ipa: "/ˈhaɪlaɪt/", vi: "làm nổi bật, nêu bật", ex: "The report highlights the shortage of nurses in rural areas.", exVi: "Báo cáo nêu bật tình trạng thiếu điều dưỡng ở nông thôn.", more: "**highlight** a problem / the need for / the importance of · n: the **highlight** of the trip" },
          { w: "implicit", pos: "adj", ipa: "/ɪmˈplɪsɪt/", vi: "ngầm, không nói thẳng", ex: "There is an implicit assumption that grandparents will provide free childcare.", exVi: "Có một giả định ngầm rằng ông bà sẽ trông cháu miễn phí.", more: "≠ **explicit** (nói rõ) · **implicit in** + N · implicitly (adv)" },
          { w: "induce", pos: "v", ipa: "/ɪnˈdjuːs/", vi: "gây ra; thuyết phục (ai làm gì)", ex: "Lack of sleep can induce anxiety and poor concentration.", exVi: "Thiếu ngủ có thể gây lo âu và kém tập trung.", more: "stress-**induced** illness (bệnh do căng thẳng gây ra) · **induce** sb **to** V · inducement (n)" },
          { w: "inevitable", pos: "adj", ipa: "/ɪnˈevɪtəbl/", vi: "không thể tránh khỏi, tất yếu", ex: "It is inevitable that health costs will rise as the population ages.", exVi: "Chi phí y tế tăng khi dân số già đi là điều tất yếu.", more: "It is **inevitable that**… · the **inevitable** result of · inevitably (adv) · inevitability (n)" },
          { w: "infrastructure", pos: "n", ipa: "/ˈɪnfrəstrʌktʃə/", vi: "cơ sở hạ tầng", ex: "Rural areas lack the basic infrastructure needed to attract doctors.", exVi: "Vùng nông thôn thiếu hạ tầng cơ bản cần có để thu hút bác sĩ.", more: "transport / health / digital **infrastructure** · invest in **infrastructure** · không đếm được" },
          { w: "inspect", pos: "v", ipa: "/ɪnˈspekt/", vi: "thanh tra, kiểm tra kỹ", ex: "Care homes are inspected at least once a year.", exVi: "Viện dưỡng lão được thanh tra ít nhất mỗi năm một lần.", more: "inspection (n): carry out an **inspection** · inspector (n)" },
          { w: "intense", pos: "adj", ipa: "/ɪnˈtens/", vi: "mạnh mẽ, dữ dội, gay gắt", ex: "Hospitals are under intense pressure during the winter months.", exVi: "Các bệnh viện chịu áp lực dữ dội vào những tháng mùa đông.", more: "**intense** pressure / competition / heat · intensity (n) · intensify (v) · ≠ intensive (tập trung cao: an **intensive** course, **intensive** care)" },
          { w: "manipulate", pos: "v", ipa: "/məˈnɪpjuleɪt/", vi: "thao túng; điều khiển khéo", ex: "Advertisers are accused of manipulating children's desires.", exVi: "Giới quảng cáo bị cáo buộc thao túng mong muốn của trẻ em.", more: "manipulation (n) · manipulative (adj): a **manipulative** person · **manipulate** data / public opinion" },
          { w: "minimise", pos: "v", ipa: "/ˈmɪnɪmaɪz/", vi: "giảm tới mức thấp nhất", ex: "Washing hands regularly minimises the risk of infection.", exVi: "Rửa tay thường xuyên giảm thiểu nguy cơ lây nhiễm.", more: "**minimise** the risk / cost / impact · ≠ maximise · minimal (adj) · minimum (n, adj)" },
          { w: "nuclear", pos: "adj", ipa: "/ˈnjuːkliə/", vi: "(thuộc) hạt nhân", ex: "The nuclear family is no longer the most common type of household.", exVi: "Gia đình hạt nhân không còn là kiểu hộ gia đình phổ biến nhất.", more: "**nuclear** power / energy / weapons · the **nuclear** family (bố mẹ + con — Tập 2 Ngày 22)" },
          { w: "offset", pos: "v", ipa: "/ˈɒfset/", vi: "bù lại, bù đắp", ex: "The savings from prevention more than offset the cost of the vaccine.", exVi: "Khoản tiết kiệm nhờ phòng bệnh bù lại thừa chi phí vắc-xin.", more: "**offset** the cost / the loss / emissions · be **offset by** · offset – offset – offset" },
          { w: "paragraph", pos: "n", ipa: "/ˈpærəɡrɑːf/", vi: "đoạn văn", ex: "Each body paragraph should develop a single main idea.", exVi: "Mỗi đoạn thân bài nên phát triển một ý chính duy nhất.", more: "a body / introductory / concluding **paragraph** · in the second **paragraph**" },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-awl-2",
        kind: "fill",
        title: "Điền dạng đúng của từ trong nhóm 2 (8 câu)",
        items: [
          { q: "As the population ages, higher spending on care is ___. (không thể tránh)", answers: ["inevitable"] },
          { q: "The number of patients ___ between 300 and 450 a day. (dao động, quá khứ đơn)", answers: ["fluctuated"] },
          { q: "The report ___ the need for more mental health services. (nêu bật, hiện tại đơn)", answers: ["highlights"] },
          { q: "Lower running costs partly ___ the high price of the equipment. (bù lại, hiện tại đơn)", answers: ["offset"] },
          { q: "Doctors must follow strict ___ when prescribing these drugs. (hướng dẫn, số nhiều)", answers: ["guidelines"] },
          { q: "The agreement was never written down; it was simply ___. (ngầm hiểu)", answers: ["implicit"] },
          { q: "Good ventilation ___ the spread of the virus. (giảm thiểu, hiện tại đơn)", answers: ["minimises", "minimizes"] },
          { q: "The number of visits rose ___ after the fee was abolished. (trạng từ của drama)", answers: ["dramatically"] },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. AWL sublist 8 — họ từ 41–60 (plus → widespread)" },
      {
        t: "vocab",
        items: [
          { w: "plus", pos: "prep, n, adj", ipa: "/plʌs/", vi: "cộng với; điểm cộng", ex: "Flexible hours are a major plus for parents of young children.", exVi: "Giờ làm linh hoạt là điểm cộng lớn với cha mẹ có con nhỏ.", more: "a **plus** (n, thân mật) = an advantage · ⚠️ không mở câu bằng ~~Plus, …~~ trong bài viết → In addition, …" },
          { w: "practitioner", pos: "n", ipa: "/prækˈtɪʃənə/", vi: "người hành nghề (y, luật)", ex: "Most patients see a general practitioner before being sent to a specialist.", exVi: "Phần lớn bệnh nhân gặp bác sĩ đa khoa trước khi được chuyển tới chuyên khoa.", more: "a general **practitioner** (GP) · a medical / legal **practitioner** · practise (v) · practice (n)" },
          { w: "predominant", pos: "adj", ipa: "/prɪˈdɒmɪnənt/", vi: "chiếm ưu thế, chủ yếu", ex: "Heart disease is the predominant cause of death in wealthy countries.", exVi: "Bệnh tim là nguyên nhân tử vong chủ yếu ở các nước giàu.", more: "predominantly (adv) = mainly: a **predominantly** elderly population · predominance (n)" },
          { w: "prospect", pos: "n", ipa: "/ˈprɒspekt/", vi: "triển vọng; khả năng xảy ra", ex: "Graduates in nursing have excellent job prospects.", exVi: "Sinh viên tốt nghiệp điều dưỡng có triển vọng việc làm rất tốt.", more: "job / career **prospects** (số nhiều) · the **prospect of** + N / V-ing · prospective (adj): **prospective** students" },
          { w: "radical", pos: "adj", ipa: "/ˈrædɪkl/", vi: "triệt để, căn bản; cấp tiến", ex: "The health service needs radical reform rather than small adjustments.", exVi: "Ngành y tế cần cải cách triệt để chứ không phải điều chỉnh nhỏ.", more: "**radical** change / reform / ideas · radically (adv): **radically** different" },
          { w: "random", pos: "adj", ipa: "/ˈrændəm/", vi: "ngẫu nhiên", ex: "Patients were assigned at random to one of two groups.", exVi: "Bệnh nhân được phân ngẫu nhiên vào một trong hai nhóm.", more: "**at random** · a **random** sample · randomly (adv): **randomly** selected" },
          { w: "reinforce", pos: "v", ipa: "/ˌriːɪnˈfɔːs/", vi: "củng cố, làm mạnh thêm", ex: "Toys for boys and girls often reinforce traditional gender roles.", exVi: "Đồ chơi cho bé trai và bé gái thường củng cố vai trò giới truyền thống.", more: "**reinforce** a belief / a stereotype / a message · reinforcement (n)" },
          { w: "restore", pos: "v", ipa: "/rɪˈstɔː/", vi: "khôi phục, phục hồi", ex: "The operation restored her sight completely.", exVi: "Ca mổ đã phục hồi hoàn toàn thị lực cho bà.", more: "**restore** confidence / order / a building · restoration (n)" },
          { w: "revise", pos: "v", ipa: "/rɪˈvaɪz/", vi: "sửa đổi, điều chỉnh; (Anh) ôn thi", ex: "The forecast was revised upwards after the latest figures were published.", exVi: "Dự báo được điều chỉnh tăng sau khi số liệu mới nhất được công bố.", more: "**revise** upwards / downwards · revision (n) · **revise for** an exam (tiếng Anh-Anh = ôn thi)" },
          { w: "schedule", pos: "n, v", ipa: "/ˈʃedjuːl/", vi: "lịch trình; lên lịch", ex: "The new clinic is scheduled to open next spring.", exVi: "Phòng khám mới dự kiến mở cửa mùa xuân tới.", more: "be **scheduled to** V / **for** + thời gian · ahead of / behind / on **schedule** · Mỹ đọc /ˈskedʒuːl/" },
          { w: "tense", pos: "adj", ipa: "/tens/", vi: "căng thẳng", ex: "Relations between the two generations became increasingly tense.", exVi: "Quan hệ giữa hai thế hệ ngày càng căng thẳng.", more: "tension (n): ease / cause **tension between** A and B · n: a verb **tense** (thì của động từ)" },
          { w: "terminate", pos: "v", ipa: "/ˈtɜːmɪneɪt/", vi: "chấm dứt (trang trọng)", ex: "The company terminated his contract without warning.", exVi: "Công ty chấm dứt hợp đồng của anh ấy mà không báo trước.", more: "**terminate** a contract / an agreement · termination (n) · terminal (adj): a **terminal** illness (bệnh giai đoạn cuối)" },
          { w: "theme", pos: "n", ipa: "/θiːm/", vi: "chủ đề (xuyên suốt)", ex: "Loneliness in old age is a recurring theme in her research.", exVi: "Sự cô đơn tuổi già là chủ đề lặp lại trong nghiên cứu của bà.", more: "a recurring / central **theme** · thematic (adj) · ≠ topic (đề tài cụ thể của một bài)" },
          { w: "thereby", pos: "adv", ipa: "/ˌðeəˈbaɪ/", vi: "qua đó, nhờ đó", ex: "Vaccination protects the individual, thereby reducing the spread of disease.", exVi: "Tiêm chủng bảo vệ cá nhân, qua đó giảm sự lây lan của bệnh.", more: "…, **thereby** + V-ing (nêu kết quả trực tiếp) · ≠ therefore (đứng đầu mệnh đề mới: Therefore, …)" },
          { w: "uniform", pos: "adj, n", ipa: "/ˈjuːnɪfɔːm/", vi: "đồng đều, giống nhau; đồng phục", ex: "The quality of care is far from uniform across the country.", exVi: "Chất lượng chăm sóc không hề đồng đều trên cả nước.", more: "uniformly (adv) · uniformity (n) · a school **uniform**" },
          { w: "vehicle", pos: "n", ipa: "/ˈviːəkl/", vi: "phương tiện (xe); phương tiện để đạt mục đích", ex: "Education is seen as a vehicle for social mobility.", exVi: "Giáo dục được xem là phương tiện để thay đổi vị thế xã hội.", more: "a motor / electric **vehicle** · a **vehicle for** + N (nghĩa bóng, trang trọng) · chữ h câm" },
          { w: "via", pos: "prep", ipa: "/ˈvaɪə/", vi: "qua, thông qua", ex: "Most appointments are now booked via a mobile app.", exVi: "Phần lớn lịch hẹn nay được đặt qua ứng dụng di động.", more: "**via** email / the internet / Singapore (đi qua) · trang trọng hơn through" },
          { w: "virtual", pos: "adj", ipa: "/ˈvɜːtʃuəl/", vi: "ảo (trên mạng); gần như", ex: "Virtual consultations save patients a journey to the clinic.", exVi: "Khám bệnh trực tuyến giúp bệnh nhân khỏi phải tới phòng khám.", more: "**virtual** reality / meetings · virtually (adv) = almost: **virtually** impossible / unchanged" },
          { w: "visual", pos: "adj", ipa: "/ˈvɪʒuəl/", vi: "(thuộc) thị giác, hình ảnh", ex: "Visual warnings on cigarette packets are more effective than text.", exVi: "Cảnh báo bằng hình trên bao thuốc lá hiệu quả hơn chữ.", more: "**visual** aids / impact · visualise (v) · visible (adj): thấy được · vision (n)" },
          { w: "widespread", pos: "adj", ipa: "/ˈwaɪdspred/", vi: "lan rộng, phổ biến", ex: "There is widespread concern about the shortage of care workers.", exVi: "Có mối lo ngại rộng khắp về việc thiếu người chăm sóc.", more: "**widespread** concern / support / use / belief · ⚠️ là tính từ: ~~it widespreads~~ → it **is widespread** / it **spreads widely**" },
        ],
      },
      {
        t: "table",
        head: ["Cặp dễ nhầm", "Từ thứ nhất", "Từ thứ hai"],
        rows: [
          ["complement / compliment", "**complement** = bổ sung cho: Exercise **complements** a healthy diet.", "**compliment** = khen: She paid him a **compliment**."],
          ["implicit / explicit", "**implicit** = ngầm: an **implicit** promise", "**explicit** = nói rõ: **explicit** instructions"],
          ["intense / intensive", "**intense** = mạnh, dữ dội: **intense** pressure", "**intensive** = dồn nhiều trong thời gian ngắn: an **intensive** course, **intensive** care"],
          ["eventually / possibly", "**eventually** = cuối cùng (chắc chắn đã / sẽ xảy ra)", "**possibly** = có thể. ~~eventual problems~~ (nghĩa “vấn đề có thể có”) → **possible** problems"],
          ["thereby / therefore", "…, **thereby** reducing costs. (cùng câu, + V-ing)", "**Therefore**, costs fell. (câu / mệnh đề mới)"],
          ["virtual / visual", "**virtual** = ảo, trên mạng; **virtually** = gần như", "**visual** = thuộc thị giác"],
          ["revise / review", "**revise** = sửa lại (văn bản, con số); Anh-Anh: ôn thi", "**review** = xem xét lại, đánh giá; Mỹ: ôn thi"],
          ["exhibit / exhibition", "**exhibit** (v) = biểu lộ, trưng bày; (n) = một hiện vật", "**exhibition** (n) = cuộc triển lãm"],
        ],
        caption: "Tám cặp này là nguồn lỗi LR quen thuộc ở band 6.5. Chép cặp bạn hay nhầm vào Sổ lỗi.",
      },
      {
        t: "mcq",
        id: "t4d8-awl-3",
        title: "Nhóm 3 + cặp dễ nhầm — chọn phương án đúng (8 câu)",
        items: [
          { q: "The new app sends reminders to patients, ___ reducing the number of missed appointments.", options: ["therefore", "thereby", "although", "whereby"], correct: 1, why: "…, thereby + V-ing: nêu kết quả trực tiếp trong cùng câu. therefore mở mệnh đề mới có chủ ngữ + động từ." },
          { q: "There is ___ support for a tax on sugary drinks.", options: ["widespread", "widespreading", "widely spread", "widespreads"], correct: 0, why: "widespread là tính từ đứng trước danh từ: widespread support." },
          { q: "Online courses should ___ face-to-face teaching rather than replace it.", options: ["compliment", "complementary", "complement", "complete"], correct: 2, why: "complement (v) = bổ sung cho. compliment = khen; complementary là tính từ." },
          { q: "The patients were chosen ___ random from the hospital's records.", options: ["by", "in", "on", "at"], correct: 3, why: "Cụm cố định: at random." },
          { q: "After weeks of ___ care, he was moved to an ordinary ward.", options: ["intensive", "intense", "intensity", "intensified"], correct: 0, why: "intensive care = chăm sóc đặc biệt (hồi sức tích cực). intense = dữ dội." },
          { q: "The birth rate was ___ unchanged between 2010 and 2020.", options: ["visually", "virtually", "eventually", "implicitly"], correct: 1, why: "virtually = almost: virtually unchanged." },
          { q: "The opening of the centre is ___ for next March.", options: ["revised", "restored", "scheduled", "reinforced"], correct: 2, why: "be scheduled for + thời gian = được lên lịch vào." },
          { q: "The figures were ___ downwards when the full data became available.", options: ["terminated", "displaced", "exhibited", "revised"], correct: 3, why: "revise upwards / downwards = điều chỉnh (con số) tăng / giảm." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Health vòng 2 — hệ thống y tế (18 từ)" },
      {
        t: "p",
        text: "Tập 2 Ngày 4 nói về **sức khoẻ của một người** (ăn gì, tập gì). Đề Task 2 và Part 3 ở band 7 hỏi về **sức khoẻ của cả xã hội**: ai trả tiền? nên chi cho phòng bệnh hay chữa bệnh? dân số già thì hệ thống chịu nổi không? Muốn trả lời, bạn cần từ vựng của cả “đường đi” của một bệnh nhân trong hệ thống:",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đường đi của bệnh nhân trong hệ thống y tế",
        steps: [
          { label: "1. Phòng bệnh", sub: "**preventive healthcare**: vaccination · screening · health education" },
          { label: "2. Tuyến đầu", sub: "**primary care**: a general practitioner (GP) · diagnosis" },
          { label: "3. Chuyển tuyến", sub: "a **referral** to a specialist · a **waiting list**" },
          { label: "4. Bệnh viện", sub: "treatment · surgery · **life-threatening** conditions" },
          { label: "5. Chăm sóc dài hạn", sub: "**degenerative diseases** · dementia · **palliative care**" },
        ],
        caption: "Ai trả tiền ở mỗi bước? — publicly funded (nhà nước) · health insurance (bảo hiểm) · out-of-pocket (người bệnh tự trả).",
      },
      {
        t: "vocab",
        items: [
          { w: "healthcare system", pos: "n", ipa: "/ˈhelθkeə ˌsɪstəm/", vi: "hệ thống y tế", ex: "An ageing population puts enormous pressure on the healthcare system.", exVi: "Dân số già đi gây áp lực khổng lồ lên hệ thống y tế.", more: "put pressure / a strain **on** the **healthcare system** · healthcare **provision** (việc cung cấp dịch vụ y tế) · access **to** healthcare" },
          { w: "preventive healthcare", pos: "n", ipa: "/prɪˌventɪv ˈhelθkeə/", vi: "y tế dự phòng", ex: "Spending on preventive healthcare saves money in the long run.", exVi: "Chi cho y tế dự phòng tiết kiệm tiền về lâu dài.", more: "= **preventive medicine** · cũng viết preventative · prevention (n): **Prevention is better than cure.**" },
          { w: "primary care", pos: "n", ipa: "/ˌpraɪməri ˈkeə/", vi: "chăm sóc sức khoẻ ban đầu (tuyến đầu)", ex: "Strong primary care keeps people out of hospital.", exVi: "Tuyến chăm sóc ban đầu mạnh giúp người dân không phải vào viện.", more: "**primary care** services / doctors · ≠ secondary care (bệnh viện, chuyên khoa)" },
          { w: "general practitioner (GP)", pos: "n", ipa: "/ˌdʒenrəl prækˈtɪʃənə/", vi: "bác sĩ đa khoa (bác sĩ gia đình)", ex: "In rural areas, a single GP may serve several villages.", exVi: "Ở nông thôn, một bác sĩ đa khoa có thể phục vụ vài ngôi làng.", more: "see / register with a **GP** · a **GP** surgery (phòng khám đa khoa) · Mỹ: family doctor" },
          { w: "health insurance", pos: "n", ipa: "/ˈhelθ ɪnˌʃʊərəns/", vi: "bảo hiểm y tế", ex: "Workers without health insurance often delay seeing a doctor.", exVi: "Người lao động không có bảo hiểm y tế thường trì hoãn đi khám.", more: "private / compulsory **health insurance** · be **covered by** insurance · take out insurance · an insurance **premium** (phí bảo hiểm)" },
          { w: "universal healthcare", pos: "n", ipa: "/ˌjuːnɪˌvɜːsl ˈhelθkeə/", vi: "y tế toàn dân", ex: "Universal healthcare means that nobody is refused treatment because of cost.", exVi: "Y tế toàn dân nghĩa là không ai bị từ chối điều trị vì chi phí.", more: "**universal** coverage / access · provide / introduce **universal healthcare**" },
          { w: "publicly funded", pos: "adj", ipa: "/ˌpʌblɪkli ˈfʌndɪd/", vi: "do ngân sách nhà nước chi trả", ex: "In a publicly funded system, treatment is paid for through taxation.", exVi: "Trong hệ thống do nhà nước chi trả, việc điều trị được trả bằng tiền thuế.", more: "= state-funded · **be funded through** taxation · ≠ privately funded · public **funding** (n)" },
          { w: "out-of-pocket", pos: "adj", ipa: "/ˌaʊt əv ˈpɒkɪt/", vi: "(chi phí) người bệnh tự bỏ tiền túi", ex: "High out-of-pocket costs push some families into debt.", exVi: "Chi phí tự trả cao đẩy một số gia đình vào cảnh nợ nần.", more: "**out-of-pocket** payments / costs / expenses · pay **out of pocket** (trạng ngữ, không gạch nối)" },
          { w: "screening", pos: "n", ipa: "/ˈskriːnɪŋ/", vi: "sàng lọc, tầm soát (bệnh)", ex: "Regular screening allows cancers to be detected at an early stage.", exVi: "Tầm soát định kỳ cho phép phát hiện ung thư ở giai đoạn sớm.", more: "cancer **screening** · a **screening** programme · **screen** sb **for** a disease (v)" },
          { w: "vaccination", pos: "n", ipa: "/ˌvæksɪˈneɪʃn/", vi: "tiêm chủng", ex: "Childhood vaccination has almost eliminated several deadly diseases.", exVi: "Tiêm chủng cho trẻ em đã gần như loại bỏ vài căn bệnh chết người.", more: "a **vaccination** programme / campaign · be **vaccinated against** + bệnh · vaccine (n) · = immunisation" },
          { w: "diagnosis", pos: "n", ipa: "/ˌdaɪəɡˈnəʊsɪs/", vi: "sự chẩn đoán", ex: "An early diagnosis greatly improves the chances of recovery.", exVi: "Chẩn đoán sớm cải thiện đáng kể cơ hội hồi phục.", more: "số nhiều: **diagnoses** /-siːz/ · make a **diagnosis** · be **diagnosed with** + bệnh (v) · ⚠️ ~~diagnosed diabetes~~ → diagnosed **with** diabetes" },
          { w: "referral", pos: "n", ipa: "/rɪˈfɜːrəl/", vi: "việc chuyển tuyến, giấy giới thiệu (tới chuyên khoa)", ex: "Patients need a referral from their GP to see a specialist.", exVi: "Bệnh nhân cần giấy chuyển từ bác sĩ đa khoa để gặp bác sĩ chuyên khoa.", more: "a **referral to** a specialist · **refer** sb **to** (v) — be referred to hospital" },
          { w: "waiting list", pos: "n", ipa: "/ˈweɪtɪŋ lɪst/", vi: "danh sách chờ", ex: "Some patients spend over a year on the waiting list for surgery.", exVi: "Một số bệnh nhân nằm trong danh sách chờ mổ hơn một năm.", more: "be **on** a **waiting list for** + N · cut / reduce **waiting lists** · **waiting times** (thời gian chờ)" },
          { w: "degenerative disease", pos: "n", ipa: "/dɪˌdʒenərətɪv dɪˈziːz/", vi: "bệnh thoái hoá", ex: "Degenerative diseases become more common as people live longer.", exVi: "Bệnh thoái hoá phổ biến hơn khi con người sống thọ hơn.", more: "degenerate (v): xấu dần đi · age-related **diseases** · a **chronic** condition (bệnh mạn tính — Tập 2 Ngày 4)" },
          { w: "dementia", pos: "n", ipa: "/dɪˈmenʃə/", vi: "chứng sa sút trí tuệ", ex: "Caring for a relative with dementia can be exhausting.", exVi: "Chăm một người thân bị sa sút trí tuệ có thể rất kiệt sức.", more: "suffer **from** / develop **dementia** · people **with dementia** · không đếm được" },
          { w: "mental health", pos: "n", ipa: "/ˌmentl ˈhelθ/", vi: "sức khoẻ tâm thần", ex: "Mental health services receive far less funding than physical health.", exVi: "Dịch vụ sức khoẻ tâm thần nhận ít kinh phí hơn nhiều so với sức khoẻ thể chất.", more: "**mental health** problems / services · ⚠️ không nói ~~mental disease~~ → a **mental illness** · well-being (Tập 2 Ngày 4)" },
          { w: "palliative care", pos: "n", ipa: "/ˌpæliətɪv ˈkeə/", vi: "chăm sóc giảm nhẹ (cho bệnh không chữa khỏi)", ex: "Palliative care aims to relieve pain rather than cure the illness.", exVi: "Chăm sóc giảm nhẹ nhằm giảm đau chứ không chữa khỏi bệnh.", more: "end-of-life care · a hospice (nhà chăm sóc cuối đời) · a **terminal** illness" },
          { w: "life-threatening", pos: "adj", ipa: "/ˈlaɪf θretnɪŋ/", vi: "đe doạ tính mạng", ex: "Emergency departments should give priority to life-threatening conditions.", exVi: "Khoa cấp cứu nên ưu tiên các tình trạng đe doạ tính mạng.", more: "a **life-threatening** illness / injury / condition · ≠ minor (nhẹ) · life expectancy (tuổi thọ — Tập 2 Ngày 4)" },
        ],
      },
      {
        t: "table",
        head: ["Collocation", "Nghĩa", "Câu mẫu Task 2"],
        rows: [
          ["**place a burden / strain on** the health service", "tạo gánh nặng cho ngành y tế", "Lifestyle-related diseases place a growing burden on the health service."],
          ["**ease / relieve pressure on** hospitals", "giảm áp lực cho bệnh viện", "Better primary care would ease pressure on hospitals."],
          ["**allocate funding / resources to**", "phân bổ kinh phí / nguồn lực cho", "A larger share of the budget should be allocated to prevention."],
          ["**have access to** affordable healthcare", "được tiếp cận y tế vừa túi tiền", "Millions of people still have no access to affordable healthcare."],
          ["**early detection / intervention**", "phát hiện / can thiệp sớm", "Early detection is far cheaper than treating advanced disease."],
          ["**health inequalities**", "bất bình đẳng về sức khoẻ", "Health inequalities between rich and poor regions are widening."],
          ["**a shortage of** doctors / nurses / beds", "thiếu bác sĩ / điều dưỡng / giường", "There is a severe shortage of nurses in rural hospitals."],
          ["**be covered by** insurance / the state", "được bảo hiểm / nhà nước chi trả", "Dental treatment is not covered by the basic scheme."],
          ["**promote / encourage** healthy lifestyles", "khuyến khích lối sống lành mạnh", "Governments can promote healthy lifestyles through taxation and education."],
          ["**an ageing population**", "dân số già hoá", "An ageing population means more people living with chronic conditions."],
        ],
        caption: "Mười cụm dùng được cho mọi đề Health ở Task 2 và Part 3.",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với nhóm từ y tế",
        items: [
          "~~the health~~ / ~~a health~~ — **health** không đếm được, không mạo từ: good **health**, public **health**. Nhưng: **the** health **service**, **a** health **problem**.",
          "~~cure a disease by medicine~~ → **treat** a disease **with** medicine. **treat** = điều trị (chưa chắc khỏi) ≠ **cure** = chữa khỏi hẳn. Danh từ: a **cure for** cancer; **treatment for** cancer.",
          "~~prevent diseases to spread~~ → prevent diseases **from spreading** (giới từ phụ thuộc — Ngày 7).",
          "~~The government should invest on healthcare~~ → invest **in** · ~~spend money for~~ → spend money **on**.",
          "~~patients must pay by themselves~~ → patients must pay **out of their own pocket** / pay **for themselves**.",
          "~~an insurance~~ → insurance không đếm được: take out **insurance** / **an insurance policy**.",
        ],
      },
      {
        t: "quiz",
        id: "t4d8-health",
        kind: "fill",
        title: "Điền từ / cụm từ của mục 4 (8 câu)",
        items: [
          { q: "In a ___ funded system, hospitals are paid for through taxation. (một từ)", answers: ["publicly"] },
          { q: "She was put on a waiting ___ for a knee operation. (một từ)", answers: ["list"] },
          { q: "Her GP gave her a ___ to a heart specialist. (giấy chuyển)", answers: ["referral"] },
          { q: "He was diagnosed ___ diabetes at the age of forty. (giới từ)", answers: ["with"] },
          { q: "Families without insurance have to pay ___ of pocket for every visit. (một từ)", answers: ["out"] },
          { q: "Vaccination and screening are examples of ___ healthcare. (dự phòng)", answers: ["preventive", "preventative"] },
          { q: "Poor diets place a heavy ___ on the health service. (gánh nặng)", answers: ["burden", "strain"] },
          { q: "___ care aims to relieve pain when an illness cannot be cured. (giảm nhẹ)", answers: ["Palliative", "palliative"] },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Family vòng 2 — gia đình hiện đại (12 từ)" },
      {
        t: "vocab",
        items: [
          { w: "dual-income household", pos: "n", ipa: "/ˌdjuːəl ˈɪnkʌm ˌhaʊshəʊld/", vi: "hộ gia đình có hai người cùng đi làm", ex: "In dual-income households, parents often struggle to find time for their children.", exVi: "Ở các hộ hai người cùng đi làm, cha mẹ thường chật vật tìm thời gian cho con.", more: "= a two-income family · ≠ a single-income household · the main **breadwinner** (Tập 2 Ngày 22)" },
          { w: "childcare", pos: "n", ipa: "/ˈtʃaɪldkeə/", vi: "dịch vụ / việc trông trẻ", ex: "Affordable childcare allows more mothers to return to work.", exVi: "Dịch vụ trông trẻ vừa túi tiền giúp nhiều bà mẹ quay lại làm việc.", more: "affordable / subsidised **childcare** · **childcare** costs / facilities · không đếm được · a nursery (nhà trẻ)" },
          { w: "parental leave", pos: "n", ipa: "/pəˌrentl ˈliːv/", vi: "nghỉ phép chăm con (cho cả bố và mẹ)", ex: "Fathers in Sweden are entitled to several months of paid parental leave.", exVi: "Các ông bố ở Thuỵ Điển được hưởng vài tháng nghỉ chăm con có lương.", more: "maternity / paternity **leave** · take / be **on** parental leave · be **entitled to** leave" },
          { w: "birth rate", pos: "n", ipa: "/ˈbɜːθ reɪt/", vi: "tỉ lệ sinh", ex: "The birth rate has fallen below the level needed to replace the population.", exVi: "Tỉ lệ sinh đã giảm dưới mức cần để thay thế dân số.", more: "a falling / declining / low **birth rate** · ≠ death rate · fertility rate (số con trung bình mỗi phụ nữ)" },
          { w: "multigenerational household", pos: "n", ipa: "/ˌmʌltiˌdʒenəˈreɪʃənl ˌhaʊshəʊld/", vi: "hộ gia đình nhiều thế hệ", ex: "Multigenerational households remain common in much of Asia.", exVi: "Hộ gia đình nhiều thế hệ vẫn phổ biến ở phần lớn châu Á.", more: "three generations **under one roof** · = an **extended family** living together (Tập 2 Ngày 22)" },
          { w: "care home", pos: "n", ipa: "/ˈkeə həʊm/", vi: "viện dưỡng lão", ex: "Many families cannot afford the fees charged by private care homes.", exVi: "Nhiều gia đình không kham nổi phí của viện dưỡng lão tư nhân.", more: "= a nursing home / a residential home · move **into** a care home · elderly care · a carer (người chăm sóc)" },
          { w: "dependant", pos: "n", ipa: "/dɪˈpendənt/", vi: "người phụ thuộc (con nhỏ, cha mẹ già)", ex: "Workers with dependants are less able to accept jobs far from home.", exVi: "Người lao động có người phụ thuộc khó nhận việc xa nhà hơn.", more: "⚠️ danh từ viết **-ant** (Anh-Anh); tính từ viết **-ent**: be **dependent on** sb" },
          { w: "the sandwich generation", pos: "n", ipa: "/ðə ˈsænwɪdʒ dʒenəˌreɪʃn/", vi: "thế hệ “kẹp giữa” (vừa nuôi con vừa chăm cha mẹ già)", ex: "The sandwich generation faces pressure from both sides: children and elderly parents.", exVi: "Thế hệ kẹp giữa chịu áp lực từ cả hai phía: con cái và cha mẹ già.", more: "dùng được trong Task 2 khi đặt trong ngoặc kép hoặc giải thích: the so-called ‘sandwich generation’" },
          { w: "sibling rivalry", pos: "n", ipa: "/ˌsɪblɪŋ ˈraɪvlri/", vi: "sự ganh đua giữa anh chị em", ex: "A certain amount of sibling rivalry is a normal part of growing up.", exVi: "Một chút ganh đua giữa anh chị em là phần bình thường của tuổi lớn.", more: "rival (n) · rivalry **between** A and B · an only child (con một)" },
          { w: "role model", pos: "n", ipa: "/ˈrəʊl mɒdl/", vi: "hình mẫu để noi theo", ex: "Parents are the first role models that children have.", exVi: "Cha mẹ là những hình mẫu đầu tiên của trẻ.", more: "a positive / good **role model for** sb · act as a **role model** · look up to (Tập 2 Ngày 22)" },
          { w: "peer pressure", pos: "n", ipa: "/ˈpɪə preʃə/", vi: "áp lực từ bạn bè đồng trang lứa", ex: "Teenagers often start smoking because of peer pressure.", exVi: "Thanh thiếu niên thường bắt đầu hút thuốc vì áp lực bạn bè.", more: "give in to / resist **peer pressure** · peers (n): bạn đồng trang lứa · a **peer group**" },
          { w: "nurture", pos: "v, n", ipa: "/ˈnɜːtʃə/", vi: "nuôi dưỡng, vun đắp; sự nuôi dạy", ex: "A stable home nurtures a child's confidence.", exVi: "Một mái ấm ổn định nuôi dưỡng sự tự tin của trẻ.", more: "**nurture** talent / a relationship · nature **versus** nurture (bẩm sinh hay nuôi dạy) · = upbringing (n)" },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-family",
        kind: "fill",
        title: "Điền từ của mục 5 (6 câu)",
        items: [
          { q: "A falling birth ___ means fewer workers to support each pensioner. (một từ)", answers: ["rate"] },
          { q: "New fathers are entitled to four weeks of paid parental ___. (một từ)", answers: ["leave"] },
          { q: "Teenagers who smoke have often given in to ___ pressure. (một từ)", answers: ["peer"] },
          { q: "Without affordable ___, one parent usually has to stop working. (dịch vụ trông trẻ)", answers: ["childcare"] },
          { q: "The debate about nature versus ___ asks how far character is shaped by upbringing. (một từ)", answers: ["nurture"] },
          { q: "Older brothers and sisters often act as role ___ for younger children. (một từ, số nhiều)", answers: ["models"] },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Personality vòng 2 — 16 thành ngữ tính cách và quan hệ (cho Speaking)" },
      {
        t: "p",
        text: "**Thành ngữ** (idiom) = cụm cố định, nghĩa không suy ra được từ từng từ. Band 7 Speaking ghi rõ “uses some less common and **idiomatic** vocabulary”. Nhưng thành ngữ chỉ ăn điểm khi (1) ==đúng nguyên dạng== — không đổi mạo từ, giới từ, số ít / số nhiều; (2) **đúng chỗ** — tả một người cụ thể ở Part 1–2, không nhồi vào câu nào cũng có; (3) **đúng văn phong** — nói thì được, viết Task 2 thì không. Tập 2 Ngày 22 đã nhập 10 cụm dễ (easy-going, a team player, a good listener…); Tập 3 Ngày 18 học tính từ. Ngày 6 đã dùng vài thành ngữ khi tả người ở Part 2; hôm nay học đủ bộ.",
      },
      {
        t: "vocab",
        items: [
          { w: "down-to-earth", pos: "adj", ipa: "/ˌdaʊn tu ˈɜːθ/", vi: "thực tế, giản dị, không màu mè", ex: "Despite her success, she's remained really down-to-earth.", exVi: "Dù thành công, cô ấy vẫn rất giản dị.", more: "Writing: practical, unpretentious · ≠ arrogant (Tập 3 Ngày 18)" },
          { w: "laid-back", pos: "adj", ipa: "/ˌleɪd ˈbæk/", vi: "thoải mái, không hay lo", ex: "My dad's so laid-back that nothing seems to worry him.", exVi: "Bố tôi thoải mái tới mức dường như chẳng gì làm ông lo.", more: "= easy-going (Tập 2 Ngày 22) · Writing: relaxed · ⚠️ ~~lay-back~~" },
          { w: "level-headed", pos: "adj", ipa: "/ˌlevl ˈhedɪd/", vi: "bình tĩnh, sáng suốt (kể cả lúc khó)", ex: "She's the most level-headed person I know — she never panics.", exVi: "Cô ấy là người bình tĩnh nhất tôi biết — không bao giờ hoảng.", more: "Writing: calm, sensible (Tập 3 Ngày 18) · keep a **cool head**" },
          { w: "strong-willed", pos: "adj", ipa: "/ˌstrɒŋ ˈwɪld/", vi: "có ý chí mạnh, cứng cỏi", ex: "My grandmother was a strong-willed woman who ran the whole family.", exVi: "Bà tôi là người phụ nữ cứng cỏi, quán xuyến cả gia đình.", more: "tích cực hơn **stubborn** (bướng — Tập 2 Ngày 22) · Writing: determined" },
          { w: "thick-skinned", pos: "adj", ipa: "/ˌθɪk ˈskɪnd/", vi: "“da dày” — không dễ bị tổn thương bởi lời chê", ex: "You need to be thick-skinned to work in customer service.", exVi: "Phải “da dày” mới làm được dịch vụ khách hàng.", more: "≠ thin-skinned / **sensitive** · Writing: resilient to criticism" },
          { w: "short-tempered", pos: "adj", ipa: "/ˌʃɔːt ˈtempəd/", vi: "nóng tính, dễ nổi cáu", ex: "He gets short-tempered when he hasn't had enough sleep.", exVi: "Anh ấy dễ nổi cáu khi thiếu ngủ.", more: "= quick-tempered · have **a short fuse** · lose your **temper** · Tập 2 Ngày 22: bad-tempered" },
          { w: "a people person", pos: "n", ipa: "/ə ˈpiːpl pɜːsn/", vi: "người thích và giỏi giao tiếp với mọi người", ex: "My sister's a real people person, so a job in sales suits her perfectly.", exVi: "Chị tôi đúng là người của đám đông, nên nghề bán hàng rất hợp.", more: "⚠️ luôn số ít, có **a**: ~~a person people~~, ~~a peoples person~~ · Writing: sociable (Tập 3 Ngày 18)" },
          { w: "a go-getter", pos: "n", ipa: "/ə ˈɡəʊ ɡetə/", vi: "người năng nổ, quyết đạt mục tiêu", ex: "She's a real go-getter — she started her own company at twenty-two.", exVi: "Cô ấy rất năng nổ — lập công ty riêng năm hai mươi hai tuổi.", more: "Writing: ambitious, driven · ≠ a couch potato (người lười vận động)" },
          { w: "the life and soul of the party", pos: "idiom", ipa: "/ðə ˌlaɪf ən ˌsəʊl əv ðə ˈpɑːti/", vi: "linh hồn của bữa tiệc — người làm mọi cuộc vui sôi nổi", ex: "My uncle is always the life and soul of the party at family gatherings.", exVi: "Chú tôi luôn là linh hồn của mọi buổi họp mặt gia đình.", more: "⚠️ đủ ba chữ **the**… **the**: ~~the life and the soul of party~~ · Writing: outgoing, extroverted" },
          { w: "a creature of habit", pos: "idiom", ipa: "/ə ˌkriːtʃər əv ˈhæbɪt/", vi: "người sống theo thói quen, ngại thay đổi", ex: "I'm a creature of habit — I've had the same breakfast for ten years.", exVi: "Tôi là người sống theo thói quen — mười năm nay ăn sáng một món.", more: "⚠️ habit số ít, không mạo từ: ~~a creature of habits~~ / ~~of the habit~~" },
          { w: "set in your ways", pos: "idiom", ipa: "/ˌset ɪn jɔː ˈweɪz/", vi: "bảo thủ trong nếp sống, khó đổi", ex: "My grandparents are rather set in their ways and refuse to shop online.", exVi: "Ông bà tôi khá bảo thủ nếp sống và nhất định không mua hàng trên mạng.", more: "đổi tính từ sở hữu theo người: set in **his / her / their** ways · ways luôn số nhiều · Writing: resistant to change" },
          { w: "have a heart of gold", pos: "idiom", ipa: "/hæv ə ˌhɑːt əv ˈɡəʊld/", vi: "có tấm lòng vàng, rất tốt bụng", ex: "Our neighbour looks strict, but she has a heart of gold.", exVi: "Bà hàng xóm trông nghiêm khắc nhưng có tấm lòng vàng.", more: "⚠️ ~~a golden heart~~ ✗ (không phải thành ngữ này) · Writing: kind-hearted, generous" },
          { w: "wear your heart on your sleeve", pos: "idiom", ipa: "/ˌweə jɔː ˈhɑːt ɒn jɔː ˌsliːv/", vi: "để lộ hết cảm xúc ra ngoài", ex: "You always know how he feels — he wears his heart on his sleeve.", exVi: "Lúc nào bạn cũng biết anh ấy thấy thế nào — anh ấy không giấu cảm xúc.", more: "⚠️ sleeve số ít; giới từ **on** · ≠ **bottle up** your feelings (Tập 3 Ngày 18)" },
          { w: "go the extra mile", pos: "idiom", ipa: "/ˌɡəʊ ði ˌekstrə ˈmaɪl/", vi: "làm nhiều hơn mức được yêu cầu", ex: "She's the kind of teacher who always goes the extra mile for her students.", exVi: "Cô ấy là kiểu giáo viên luôn làm hơn cả bổn phận vì học trò.", more: "go the extra mile **for** sb / **to** V · ⚠️ ~~go an extra mile~~ · Writing: make an additional effort" },
          { w: "see eye to eye (with)", pos: "idiom", ipa: "/ˌsiː ˈaɪ tu aɪ/", vi: "đồng quan điểm (với)", ex: "My brother and I don't always see eye to eye on politics.", exVi: "Anh tôi và tôi không phải lúc nào cũng đồng quan điểm về chính trị.", more: "thường dùng ở **phủ định** · see eye to eye **with** sb **on / about** sth · ⚠️ ~~see eyes to eyes~~ · Writing: agree" },
          { w: "get on like a house on fire", pos: "idiom", ipa: "/ɡet ˌɒn laɪk ə ˌhaʊs ɒn ˈfaɪə/", vi: "hợp nhau ngay và rất thân", ex: "We met on the first day of university and got on like a house on fire.", exVi: "Chúng tôi gặp nhau ngày đầu đại học và hợp nhau ngay lập tức.", more: "= hit it off (immediately) · Tập 2 Ngày 22: get on (well) with · Writing: have a close relationship" },
        ],
      },
      {
        t: "table",
        head: ["Khi NÓI (Part 1–2)", "Khi VIẾT (Task 2)", "Ghi chú"],
        rows: [
          ["She's really **down-to-earth**.", "She is **practical and unpretentious**.", "Tính từ ghép vẫn hơi thân mật"],
          ["He's **a people person**.", "He is **highly sociable** / has **strong interpersonal skills**.", "Task 2 về việc làm: interpersonal skills"],
          ["They don't **see eye to eye**.", "They **disagree** / hold **different views** on…", "Task 2: thế hệ, cha mẹ – con cái"],
          ["Older people are **set in their ways**.", "Older people tend to be **more resistant to change**.", "Thêm tend to — đừng khái quát"],
          ["She always **goes the extra mile**.", "She consistently **exceeds what is expected of her**.", ""],
          ["We **got on like a house on fire**.", "We **quickly formed a close relationship**.", "Thành ngữ dài — tuyệt đối không dùng khi viết"],
        ],
        caption: "Ngày 18 sẽ học trọn chủ đề idiom & register. Quy tắc tạm thời: thành ngữ ⇒ nói; Task 1 – Task 2 ⇒ từ trang trọng.",
      },
      {
        t: "note",
        title: "⚠️ Dùng thành ngữ sao cho được điểm, không mất điểm",
        items: [
          "**Đúng nguyên dạng.** Giám khảo nghe thấy ~~the life and soul of party~~ hay ~~a heart of the gold~~ sẽ ghi nhận là **lỗi từ vựng**, không phải “có cố gắng”.",
          "**Chia động từ, đổi sở hữu — không đổi phần còn lại:** she **wears her** heart on **her** sleeve · they **are set** in **their** ways · he **went** the extra mile.",
          "**Luôn kèm bằng chứng.** Nói thành ngữ rồi kể ngay một việc chứng minh (Tập 3 Ngày 7): She has a heart of gold — **last winter she cooked for a sick neighbour every day for a month**.",
          "**Liều lượng:** Part 2 tả người dài 2 phút — **hai** thành ngữ là đủ. Câu nào cũng có thành ngữ nghe như học thuộc.",
          "Không dùng thành ngữ tả tính cách cho **vật / nơi chốn**, và không dùng trong Task 1 – Task 2.",
        ],
      },
      { t: "rule", formula: "Thành ngữ (đúng nguyên dạng) + because / — + một việc cụ thể chứng minh", vi: "Chỉ dùng khi nói; mỗi bài nói 1–2 thành ngữ; viết thì đổi sang từ trang trọng." },
      {
        t: "mcq",
        id: "t4d8-idiom",
        title: "Thành ngữ tính cách — chọn phương án đúng (8 câu)",
        items: [
          { q: "Chọn câu ĐÚNG nguyên dạng.", options: ["He is the life and soul of party.", "He is a life and soul of the party.", "He is the life and soul of the party.", "He is the life and the soul of parties."], correct: 2, why: "Nguyên dạng: the life and soul of the party." },
          { q: "“My mum never hides how she feels. She ___.”", options: ["wears her heart on her sleeve", "has a heart of gold", "goes the extra mile", "is thick-skinned"], correct: 0, why: "wear your heart on your sleeve = để lộ hết cảm xúc." },
          { q: "“My granddad has done things the same way for fifty years. He's very ___.”", options: ["laid-back", "set in his ways", "down-to-earth", "level-headed"], correct: 1, why: "set in his ways = bảo thủ nếp sống, khó đổi." },
          { q: "Người không dễ buồn khi bị chê là người…", options: ["short-tempered", "strong-willed", "down-to-earth", "thick-skinned"], correct: 3, why: "thick-skinned = “da dày”, không dễ tổn thương vì lời chê." },
          { q: "Chọn câu ĐÚNG.", options: ["We don't see eyes to eyes on money.", "We don't see eye to eye on money.", "We don't see eye by eye on money.", "We don't look eye to eye on money."], correct: 1, why: "see eye to eye (with sb) on sth." },
          { q: "Câu nào hợp cho bài Task 2 (văn viết)?", options: ["Older workers are often set in their ways.", "Older workers are creatures of habit, to be honest.", "Older workers tend to be more resistant to change.", "Older workers don't see eye to eye with young bosses."], correct: 2, why: "Task 2 dùng từ trang trọng + tend to; ba câu kia có thành ngữ / to be honest (văn nói)." },
          { q: "“She stayed two hours after class to help me. She really ___.”", options: ["went the extra mile", "went an extra mile", "went the extra miles", "walked the extra mile"], correct: 0, why: "go the extra mile — mạo từ the, mile số ít; chỉ chia động từ go." },
          { q: "“Nothing ever stresses him out. He's incredibly ___.”", options: ["short-tempered", "strong-willed", "thick-skinned", "laid-back"], correct: 3, why: "laid-back = thoải mái, không hay lo." },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "It is inevitable that an ageing population will place a growing burden on the healthcare system; what governments can influence is how that burden is shared.", vi: "(Task 2) Dân số già đi tất yếu sẽ tạo gánh nặng ngày càng lớn cho hệ thống y tế; điều chính phủ tác động được là gánh nặng ấy được chia thế nào." },
          { en: "Allocating a larger share of the budget to preventive healthcare would allow diseases to be detected early, thereby reducing the need for expensive hospital treatment.", vi: "(Task 2) Phân bổ phần ngân sách lớn hơn cho y tế dự phòng sẽ giúp phát hiện bệnh sớm, qua đó giảm nhu cầu điều trị đắt đỏ ở bệnh viện." },
          { en: "In dual-income households, the cost of childcare can offset much of the second salary, which partly explains the falling birth rate.", vi: "(Task 2) Ở các hộ hai người đi làm, chi phí trông trẻ có thể “ăn” gần hết khoản lương thứ hai, điều này phần nào giải thích tỉ lệ sinh giảm." },
          { en: "Not only do grandparents provide free childcare, but they also reinforce the values that parents are trying to teach.", vi: "(Task 2, đảo ngữ Ngày 7) Ông bà không chỉ trông cháu miễn phí mà còn củng cố những giá trị cha mẹ đang cố dạy." },
          { en: "My grandparents are a bit set in their ways, so we don't always see eye to eye — but my grandmother has a heart of gold, and that's what matters to me.", vi: "(Part 1) Ông bà tôi hơi bảo thủ nếp sống nên không phải lúc nào chúng tôi cũng đồng quan điểm — nhưng bà tôi có tấm lòng vàng, và với tôi đó mới là điều quan trọng." },
          { en: "I'd say waiting lists are likely to get longer, simply because degenerative diseases are becoming so widespread.", vi: "(Part 3, dự đoán có mức độ — Ngày 7) Tôi cho rằng danh sách chờ nhiều khả năng sẽ dài hơn, đơn giản vì bệnh thoái hoá đang ngày càng phổ biến." },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "Collocation: place a burden on · have access to · be accompanied by · thereby + V-ing · be entitled to",
        items: [
          { q: "Bệnh mạn tính tạo gánh nặng lớn cho hệ thống y tế.", answers: ["Chronic diseases place a heavy burden on the healthcare system.", "Chronic diseases place a great burden on the healthcare system.", "Chronic diseases place a huge burden on the healthcare system.", "Chronic diseases put a heavy burden on the healthcare system.", "Chronic diseases place a heavy burden on the health service.", "Chronic conditions place a heavy burden on the healthcare system.", "Chronic diseases place a large burden on the healthcare system."], hint: "place a heavy burden on · the healthcare system" },
          { q: "Nhiều người ở nông thôn không được tiếp cận chăm sóc sức khoẻ ban đầu.", answers: ["Many people in rural areas have no access to primary care.", "Many people in rural areas do not have access to primary care.", "Many people in the countryside have no access to primary care.", "Many people in rural areas don't have access to primary care.", "Many people in the countryside do not have access to primary care."], hint: "have no access to · primary care" },
          { q: "Tầm soát định kỳ cho phép phát hiện sớm, qua đó cứu được nhiều mạng người.", answers: ["Regular screening allows early detection, thereby saving many lives.", "Regular screening enables early detection, thereby saving many lives.", "Regular screening allows for early detection, thereby saving many lives.", "Regular screening allows early detection, thereby saving a lot of lives."], hint: "Regular screening · early detection · thereby saving" },
          { q: "Tỉ lệ sinh giảm thường đi kèm với dân số già hoá.", answers: ["A falling birth rate is often accompanied by an ageing population.", "A falling birth rate is usually accompanied by an ageing population.", "A declining birth rate is often accompanied by an ageing population.", "A declining birth rate is usually accompanied by an ageing population.", "A falling birth rate is often accompanied by an aging population."], hint: "A falling birth rate · is accompanied by · an ageing population" },
          { q: "Cả bố và mẹ đều được hưởng nghỉ phép chăm con có lương.", answers: ["Both parents are entitled to paid parental leave.", "Both mothers and fathers are entitled to paid parental leave.", "Both fathers and mothers are entitled to paid parental leave.", "Both the father and the mother are entitled to paid parental leave."], hint: "Both parents · are entitled to · paid parental leave" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d8-viet",
    kind: "writing",
    title: "Viết Task 1: Bar chart 3 — cột chồng (stacked) và cột nhóm (grouped) ở band 7",
    goal: "Viết trọn một bài Task 1 band 7 (170–200 từ, 20 phút) cho biểu đồ cột chồng hoặc cột nhóm: đọc được ba tầng thông tin (tổng → thành phần → cơ cấu), viết overview hai ý, gom số liệu thành 2–3 nhóm thay vì kể từng cột, nêu được ngoại lệ, dùng đúng ngôn ngữ “tổng – thành phần” (of which · accounted for · made up · the bulk of · with… V-ing) và không lẫn số tuyệt đối với tỉ lệ.",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Tập 2 Ngày 8 dạy **bar chart** nhập môn; Tập 3 Ngày 12 dạy biểu đồ **nhiều nhóm không có thời gian**, đề hai biểu đồ, cột thiếu số liệu và từ counterpart. Hôm nay là vòng 3: ==cột chồng (stacked)== và ==cột nhóm (grouped)== nhiều lớp — hai kiểu đề làm người band 6 “kể hết mọi con số”.",
          "**Cột chồng** = mỗi cột là một **tổng**, chia thành các **đoạn** (thành phần). Phải đọc **ba tầng**: tổng nào lớn nhất → thành phần nào chiếm phần lớn → **cơ cấu** thay đổi ra sao giữa các cột.",
          "Band 7 Task Achievement: “**clearly presents and highlights key features**” — chọn đúng điểm nổi bật và **nhóm số liệu**. Band 6: có overview nhưng thân bài còn **kể lần lượt**.",
          "Ngôn ngữ mới: **of which** · **accounted for / made up / constituted** · **the bulk of** · **the remainder** · **with + N + V-ing** · **the exception being**… · **the reverse was true of**…",
          "Bẫy lớn nhất của cột chồng: lẫn **số tuyệt đối** (dollars, millions) với **tỉ lệ** (%, share). Một thành phần có thể **giảm về số** nhưng **tăng về tỉ lệ**.",
          "Tiêu chí được đẩy: **TA** (chọn – nhóm – so sánh) · **CC** (mỗi khổ một nhóm) · **LR** (từ vựng thành phần – tỉ lệ) · **GRA** (mệnh đề of which, with + V-ing, bị động).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Ôn từ Tập 2 Ngày 8 · Tập 3 Ngày 12 — band 6 và band 7 khác nhau ở đâu" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**TA — overview**", "Có overview, thường **một ý** (cao nhất / thấp nhất)", "Overview **hai ý**: (1) về tổng, (2) về cơ cấu / quy luật chung"],
          ["**TA — chi tiết**", "Kể lần lượt từng cột, gần như đủ mọi con số", "**Chọn** 6–9 con số, **gom** cột giống nhau, nêu **ngoại lệ**"],
          ["**CC**", "Mỗi cột một câu; nối bằng Moreover / Finally", "Mỗi khổ một **nhóm**; nối bằng quy chiếu (Here, …; in both; the remainder) và tương phản (whereas, while)"],
          ["**LR**", "spent · was · had · the highest — lặp", "accounted for · of which · the bulk of · by far · respectively · roughly half as high"],
          ["**GRA**", "Câu đơn + and / while; ít mệnh đề phụ", "of which… · with + N + V-ing · mệnh đề quan hệ, phân từ; **phần lớn câu không lỗi**"],
        ],
        caption: "Theo bảng mô tả band công khai. Band ghi cho các bài mẫu trong bài này là ước tính.",
      },
      {
        t: "note",
        title: "📌 Ôn 60 giây: bốn điều đã học về bar chart",
        items: [
          "Không có trục thời gian ⇒ **không** dùng rise / fall / increase; dùng ngôn ngữ **so sánh tĩnh** (higher than, twice as high as, the lowest figure) — Tập 3 Ngày 12.",
          "Có trục thời gian (các cột là các năm) ⇒ dùng được ngôn ngữ **xu hướng** như line graph (Tập 4 Ngày 6).",
          "Mở bài = viết lại đề bằng từ khác; **overview** không chứa con số cụ thể; không có kết luận / ý kiến.",
          "Nhóm thiếu số liệu ⇒ nói “no data are given for…”, không viết 0 (Tập 3 Ngày 12).",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Cột nhóm và cột chồng — đọc khác nhau thế nào" },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai kiểu biểu đồ cột nhiều lớp",
        cols: [
          { title: "Cột NHÓM (grouped / clustered)", items: ["Mỗi hạng mục có **vài cột đứng cạnh nhau**", "Dễ so **từng thành phần** giữa các hạng mục", "Tổng **không** hiện ra — và thường không có nghĩa (vd % của ba nhóm tuổi)", "Việc chính: tìm **quy luật** (tăng dần theo tuổi?) và **ngoại lệ**"] },
          { title: "Cột CHỒNG (stacked)", items: ["Mỗi hạng mục **một cột**, chia thành các đoạn màu", "**Chiều cao cột = tổng**; mỗi đoạn = một thành phần", "Đoạn ở giữa / trên cùng phải **trừ** mới ra số", "Việc chính: **tổng** → **thành phần lớn nhất** → **cơ cấu** đổi thế nào"] },
          { title: "Cột chồng 100 %", items: ["Mọi cột **cao bằng nhau** (100 %)", "Chỉ cho biết **tỉ lệ**, không cho biết tổng", "Dùng ngôn ngữ proportion / share, **không** nói amount / number", "Đọc như nhiều biểu đồ tròn đặt cạnh nhau (Ngày 18)"] },
        ],
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Đọc cột chồng — 3 tầng, 3 phút",
        steps: [
          { label: "Tầng 1 — TỔNG", sub: "Cột nào cao nhất, thấp nhất? Chênh nhau bao nhiêu lần? Các cột xếp theo quy luật gì?" },
          { label: "Tầng 2 — THÀNH PHẦN", sub: "Đoạn nào lớn nhất ở mọi cột? Đoạn nào nhỏ nhất? Có cột nào khác thường?" },
          { label: "Tầng 3 — CƠ CẤU", sub: "Khi tổng đổi, tỉ lệ từng đoạn đổi cùng chiều hay ngược chiều?" },
          { label: "Chốt overview", sub: "Ý 1 = tầng 1 · Ý 2 = tầng 2 hoặc 3 (cái nào nổi bật hơn)" },
        ],
        caption: "Tầng 3 là tầng người band 6 bỏ qua — và là nơi có “key feature” của hầu hết đề cột chồng.",
      },
      {
        t: "note",
        title: "📌 Về cách hiện biểu đồ trong bài này",
        items: [
          "Khung bài học hiện chỉ vẽ được **cột nhóm**. Với đề cột chồng, bạn sẽ thấy các thành phần đứng **cạnh nhau**, kèm **tổng** của mỗi cột: ở cột **Total** của bảng số liệu (đề mẫu mục 3) hoặc ghi ngay trong tiêu đề / đề bài (Bài 1 ở mục 10).",
          "Hãy tưởng tượng các cột nhỏ của mỗi hạng mục **xếp chồng lên nhau** thành một cột cao bằng tổng — đó là hình bạn gặp trong đề thật.",
          "Trong đề thật, số của đoạn giữa và đoạn trên cùng **không in sẵn**: bạn phải lấy mép trên trừ mép dưới. Sai số ±50 là chấp nhận được; viết **about / approximately / just over** cho an toàn.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Đề mẫu — đọc biểu đồ trước khi viết" },
      {
        t: "p",
        text: "**Đề:** The chart below shows annual health spending per person in five regions of one country in 2022, by source of funding. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. — Đây là cột chồng **không có thời gian** (một năm, năm vùng): dùng **quá khứ đơn** + ngôn ngữ **so sánh tĩnh**.",
      },
      {
        t: "figure",
        fig: {
          kind: "bar",
          title: "Annual health spending per person in five regions of one country in 2022, by source of funding (US dollars)",
          note: "Số liệu tự đặt cho bài luyện. Trong đề thật, ba cột của mỗi vùng CHỒNG lên nhau thành một cột (cao bằng Total trong bảng dưới).",
          unit: "$",
          categories: ["Capital", "Northern", "Eastern", "Central", "Southern"],
          series: [
            { name: "Government", values: [2400, 2100, 1900, 1500, 1000] },
            { name: "Private insurance", values: [1100, 600, 500, 300, 200] },
            { name: "Out-of-pocket payments", values: [500, 400, 600, 700, 900] },
          ],
        },
      },
      {
        t: "table",
        head: ["Region", "Government", "Private insurance", "Out-of-pocket", "Total"],
        rows: [
          ["Capital", "2,400 (60%)", "1,100 (28%)", "500 (13%)", "**4,000**"],
          ["Northern", "2,100 (68%)", "600 (19%)", "400 (13%)", "**3,100**"],
          ["Eastern", "1,900 (63%)", "500 (17%)", "600 (20%)", "**3,000**"],
          ["Central", "1,500 (60%)", "300 (12%)", "700 (28%)", "**2,500**"],
          ["Southern", "1,000 (48%)", "200 (10%)", "900 (43%)", "**2,100**"],
        ],
        caption: "US dollars per person. Phần trăm trong ngoặc do ta TỰ TÍNH khi lập dàn ý (đề thật không in) — làm tròn nên có hàng cộng lại 101 %.",
      },
      {
        t: "table",
        head: ["Tầng", "Câu hỏi", "Điều thấy được"],
        rows: [
          ["**1 — Tổng**", "Vùng nào chi nhiều nhất / ít nhất?", "Capital 4,000 → Southern 2,100 (gần **một nửa**); giảm dần theo thứ tự năm vùng; Northern ≈ Eastern"],
          ["**2 — Thành phần**", "Nguồn nào lớn nhất?", "**Government** lớn nhất ở **mọi** vùng; insurance ở Capital cao vượt hẳn (1,100)"],
          ["**3 — Cơ cấu**", "Tổng giảm thì các đoạn đổi ra sao?", "Government và insurance **giảm theo** tổng; out-of-pocket đi **ngược**: vùng chi ít nhất lại tự trả nhiều nhất (900 = 43 %)"],
          ["**Ngoại lệ**", "Có gì phá quy luật?", "Northern: out-of-pocket **thấp nhất** (400) dù tổng đứng thứ hai; Southern: người bệnh trả **gần bằng** nhà nước"],
        ],
        caption: "Bốn dòng này chính là dàn ý. Overview = dòng 1 + dòng 3.",
      },
      {
        t: "quiz",
        id: "t4d8-viet-doc-bieu-do",
        kind: "fill",
        title: "Đọc biểu đồ — điền số hoặc từ (6 câu)",
        items: [
          { q: "Total spending per person in the Capital was $___. (số)", answers: ["4,000", "4000"] },
          { q: "Total spending in the Southern region was roughly ___ as high as in the Capital. (một từ: half / twice / third)", answers: ["half"] },
          { q: "In every region, the largest source of funding was the ___. (một từ)", answers: ["government"] },
          { q: "Out-of-pocket payments were highest in the ___ region. (một từ)", answers: ["Southern", "southern"] },
          { q: "Private insurance in the Capital was almost ___ as high as in the Northern region. (một từ: twice / half)", answers: ["twice"] },
          { q: "In the Southern region, out-of-pocket payments made up just over ___% of the total. (số tròn chục)", answers: ["40"] },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Ngôn ngữ “tổng – thành phần” cho cột chồng" },
      {
        t: "patterns",
        rows: [
          {
            formula: "Tổng + V (stood at / totalled / reached / amounted to) + số, of which + số + V…",
            vi: "Nêu tổng rồi “mở” ra thành phần ngay trong một câu bằng of which.",
            examples: [
              { en: "Spending in the Capital totalled $4,000 per person, of which $2,400 came from the government.", vi: "Chi tiêu ở Thủ đô tổng cộng 4.000 đô mỗi người, trong đó 2.400 đô đến từ chính phủ." },
              { en: "The Southern region spent $2,100 per person, of which almost half was paid directly by patients.", vi: "Vùng phía Nam chi 2.100 đô mỗi người, trong đó gần một nửa do người bệnh tự trả." },
            ],
          },
          {
            formula: "Thành phần + accounted for / made up / constituted / represented + số (%) + of + tổng",
            vi: "Thành phần đứng trước, tổng đứng sau. comprise đi NGƯỢC chiều: tổng + comprised + các thành phần.",
            examples: [
              { en: "Government funding accounted for about two-thirds of the total in the Northern region.", vi: "Kinh phí nhà nước chiếm khoảng hai phần ba tổng số ở vùng phía Bắc." },
              { en: "Out-of-pocket payments made up over 40% of health spending in the Southern region.", vi: "Khoản người bệnh tự trả chiếm hơn 40 % chi tiêu y tế ở vùng phía Nam." },
            ],
          },
          {
            formula: "the bulk of / the majority of / the largest share of + tổng + V  ·  the remainder + V",
            vi: "“Phần lớn” và “phần còn lại” — không cần nêu số cho từng đoạn nhỏ.",
            examples: [
              { en: "The bulk of the funding came from the state, with insurance and patients sharing the remainder.", vi: "Phần lớn kinh phí đến từ nhà nước, còn bảo hiểm và người bệnh chia nhau phần còn lại." },
            ],
          },
          {
            formula: "…, with + N + V-ing / accounting for / contributing + số",
            vi: "Thêm chi tiết thành phần vào cuối câu mà không cần câu mới.",
            examples: [
              { en: "The Capital recorded the highest total, with private insurance contributing $1,100.", vi: "Thủ đô có tổng cao nhất, trong đó bảo hiểm tư nhân đóng góp 1.100 đô." },
            ],
          },
          {
            formula: "A and B combined / together + V + số   ·   …, at + số + and + số + respectively",
            vi: "Gộp hai thành phần; ghép hai số với hai đối tượng theo đúng thứ tự.",
            examples: [
              { en: "Insurance and out-of-pocket payments combined came to $1,000 in the Northern region.", vi: "Bảo hiểm và khoản tự trả gộp lại là 1.000 đô ở vùng phía Bắc." },
              { en: "The Northern and Eastern regions recorded similar totals, at $3,100 and $3,000 respectively.", vi: "Vùng phía Bắc và phía Đông có tổng tương đương, lần lượt là 3.100 và 3.000 đô." },
            ],
          },
        ],
      },
      {
        t: "table",
        head: ["Nói về SỐ TUYỆT ĐỐI", "Nói về TỈ LỆ", "Ví dụ trên biểu đồ"],
        rows: [
          ["the amount / the figure / spending **was** $1,000", "the proportion / the share / the percentage **was** 48%", "Government (Southern): $1,000 = 48 %"],
          ["**higher / lower** in absolute terms", "a **larger / smaller share** of the total", "Government (Capital vs Central): 2,400 vs 1,500 nhưng cùng 60 %"],
          ["contributed **$500**", "accounted for **one in eight** dollars", "Out-of-pocket (Capital): $500 ≈ 13 %"],
          ["**almost twice as much** as", "**more than three times as large a share** as", "Out-of-pocket (Southern vs Capital): 900 vs 500 (≈ 1,8 lần); 43 % vs 13 % (≈ 3,3 lần)"],
        ],
        caption: "Luôn tự hỏi: mình đang so SỐ hay so TỈ LỆ? Viết rõ in absolute terms / as a share of the total khi cần.",
      },
      {
        t: "note",
        title: "⚠️ Lỗi ngôn ngữ hay gặp với cột chồng",
        items: [
          "~~The government spent 2,400 percent.~~ — đơn vị là **dollars**. Phần trăm là thứ bạn tự tính; nếu dùng, viết **about / roughly** và không lẫn với số đô.",
          "~~The total comprised of three sources.~~ → **comprised** three sources / **consisted of** / **was made up of** three sources. (comprise không có of ở chủ động.)",
          "~~Government accounted 60% of total.~~ → accounted **for** 60% **of the** total.",
          "~~The Capital spent $4,000.~~ — vùng không “tiêu tiền”. Viết: **Spending in** the Capital **was / stood at** $4,000; hoặc $4,000 **was spent** per person in the Capital.",
          "~~Out-of-pocket increased from the Capital to the Southern region.~~ — không có thời gian thì không “increase”. Viết: Out-of-pocket payments **were higher** in the Southern region **than** in the Capital.",
          "~~$900 for out-of-pocket~~ — out-of-pocket là **tính từ**: out-of-pocket **payments** / patients' **direct payments**.",
          "~~respectively~~ đặt sai: phải có **hai danh sách cùng thứ tự** và respectively ở **cuối**: A and B stood at 3,100 and 3,000 **respectively**.",
        ],
      },
      { t: "rule", formula: "Tổng + stood at / totalled + số, of which + số + came from + N  ·  N + accounted for / made up + số (%) + of the total  ·  …, with + N + V-ing", vi: "Nêu tổng trước rồi mở ra thành phần; phân biệt số tuyệt đối với tỉ lệ." },
      {
        t: "quiz",
        id: "t4d8-viet-tong-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh theo biểu đồ (5 câu)",
        grammar: "of which · accounted for / made up · the bulk of · with + N + V-ing · respectively",
        items: [
          { q: "Chi tiêu ở Thủ đô tổng cộng 4.000 đô mỗi người, trong đó 2.400 đô đến từ chính phủ.", answers: ["Spending in the Capital totalled $4,000 per person, of which $2,400 came from the government.", "Spending in the Capital stood at $4,000 per person, of which $2,400 came from the government.", "Spending in the Capital totaled $4,000 per person, of which $2,400 came from the government.", "Spending in the Capital amounted to $4,000 per person, of which $2,400 came from the government.", "Spending in the Capital reached $4,000 per person, of which $2,400 came from the government."], hint: "Spending in the Capital totalled…, of which… came from…" },
          { q: "Khoản người bệnh tự trả chiếm hơn 40 % tổng số ở vùng phía Nam.", answers: ["Out-of-pocket payments made up over 40% of the total in the Southern region.", "Out-of-pocket payments accounted for over 40% of the total in the Southern region.", "Out-of-pocket payments made up more than 40% of the total in the Southern region.", "Out-of-pocket payments accounted for more than 40% of the total in the Southern region.", "Out-of-pocket payments made up over 40 per cent of the total in the Southern region.", "Out-of-pocket payments constituted over 40% of the total in the Southern region."], hint: "Out-of-pocket payments made up / accounted for over 40% of the total" },
          { q: "Phần lớn kinh phí đến từ chính phủ ở cả năm vùng.", answers: ["The bulk of the funding came from the government in all five regions.", "The majority of the funding came from the government in all five regions.", "The bulk of funding came from the government in all five regions.", "In all five regions, the bulk of the funding came from the government.", "The bulk of the funding came from the government in all the five regions."], hint: "The bulk of the funding came from… in all five regions" },
          { q: "Vùng phía Bắc và phía Đông có tổng tương đương, lần lượt là 3.100 và 3.000 đô.", answers: ["The Northern and Eastern regions had similar totals, at $3,100 and $3,000 respectively.", "The Northern and Eastern regions recorded similar totals, at $3,100 and $3,000 respectively.", "The Northern and Eastern regions had similar totals, of $3,100 and $3,000 respectively.", "The Northern and Eastern regions had similar totals: $3,100 and $3,000 respectively.", "The Northern and Eastern regions had similar totals ($3,100 and $3,000 respectively)."], hint: "…had similar totals, at $3,100 and $3,000 respectively" },
          { q: "Thủ đô có tổng cao nhất, trong đó bảo hiểm tư nhân đóng góp 1.100 đô.", answers: ["The Capital had the highest total, with private insurance contributing $1,100.", "The Capital recorded the highest total, with private insurance contributing $1,100.", "The Capital had the highest total, with private insurance accounting for $1,100.", "The Capital recorded the highest total, with private insurance accounting for $1,100."], hint: "The Capital had the highest total, with private insurance contributing…" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Nhóm số liệu và nêu ngoại lệ — kỹ năng tạo ra band 7" },
      {
        t: "p",
        text: "Biểu đồ mẫu có 15 con số (20 nếu tính cả tổng). Kể hết = thân bài dài, không có so sánh, giám khảo ghi “recounts detail mechanically”. Band 7 làm ngược lại: ==gom các cột giống nhau thành nhóm==, viết **mỗi nhóm một khổ**, và dành một câu cho **cái không theo quy luật**.",
      },
      {
        t: "table",
        head: ["Cách nhóm", "Dùng khi", "Trên biểu đồ mẫu"],
        rows: [
          ["**Theo độ lớn** (cao – thấp)", "Các hạng mục chia rõ thành nhóm cao và nhóm thấp", "Khổ 1: Capital + Northern + Eastern (≥ 3,000) · Khổ 2: Central + Southern (≤ 2,500)"],
          ["**Theo quy luật** (cùng chiều – ngược chiều)", "Có thành phần đi ngược các thành phần khác", "Khổ 1: government + insurance (giảm theo tổng) · Khổ 2: out-of-pocket (ngược lại)"],
          ["**Theo sự giống nhau**", "Hai ba hạng mục gần như trùng số", "Northern ≈ Eastern ⇒ tả chung một câu: “recorded similar totals… in both, …”"],
          ["**Theo thời gian** (khi cột là các năm)", "Cột chồng có trục năm", "Khổ 1: tổng + thành phần tăng · Khổ 2: thành phần giảm / đứng yên"],
        ],
        caption: "Chọn MỘT cách cho cả bài. Với biểu đồ mẫu, cách “theo độ lớn” cho bài viết gọn nhất.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "…, the (only) exception being + N  ·  With the exception of + N, …  ·  N + was the exception to this pattern",
            vi: "Nêu quy luật trước, ngoại lệ sau — trong cùng một câu.",
            examples: [
              { en: "Out-of-pocket payments were higher in regions with lower total spending, the only exception being the Northern region.", vi: "Khoản tự trả cao hơn ở các vùng có tổng chi thấp hơn, ngoại lệ duy nhất là vùng phía Bắc." },
              { en: "With the exception of the Capital, private insurance contributed no more than $600 per person.", vi: "Trừ Thủ đô, bảo hiểm tư nhân đóng góp không quá 600 đô mỗi người." },
            ],
          },
          {
            formula: "The reverse / opposite was true of + N  ·  N followed the opposite pattern  ·  By contrast, N…",
            vi: "Chuyển sang thành phần đi ngược chiều.",
            examples: [
              { en: "Government funding fell in line with total spending, but the reverse was true of out-of-pocket payments.", vi: "Kinh phí nhà nước giảm theo tổng chi, nhưng khoản tự trả thì ngược lại." },
            ],
          },
          {
            formula: "N1 and N2 + V + similar…; in both, …  ·  The same was true of + N  ·  N mirrored…",
            vi: "Gom hai hạng mục giống nhau; “in both” thay cho lặp lại tên.",
            examples: [
              { en: "The Northern and Eastern regions recorded similar totals; in both, the state covered about two-thirds of the cost.", vi: "Vùng phía Bắc và phía Đông có tổng tương đương; ở cả hai, nhà nước chi trả khoảng hai phần ba chi phí." },
            ],
          },
          {
            formula: "The most striking / noticeable feature is that…  ·  …was the most striking case",
            vi: "Kéo sự chú ý vào một điểm nổi bật — dùng MỘT lần mỗi bài.",
            examples: [
              { en: "The Southern region was the most striking case: out-of-pocket payments almost matched government funding.", vi: "Vùng phía Nam là trường hợp nổi bật nhất: khoản tự trả gần bằng kinh phí nhà nước." },
            ],
          },
        ],
      },
      {
        t: "note",
        title: "💡 Overview hai ý cho cột chồng — khuôn",
        items: [
          "**Ý 1 (tổng):** Overall, total spending was highest in X and lowest in Y. / …fell steadily from X to Y.",
          "**Ý 2 (thành phần / cơ cấu):** Although A was the largest source everywhere, its contribution shrank as the total fell, while B followed the opposite pattern.",
          "Không có con số trong overview (trừ cách nói tương đối: roughly half, twice as high).",
          "Đặt overview **ngay sau mở bài** — giám khảo tìm nó ở đó. Thiếu overview rõ ⇒ TA không vượt 5.",
        ],
      },
      { t: "rule", formula: "Quy luật chung + , the (only) exception being + N  ·  N1 and N2 + similar…; in both, …  ·  The reverse was true of + N", vi: "Gom cột giống nhau, mỗi nhóm một khổ, một câu cho ngoại lệ — không kể từng cột." },

      /* ── 6 ── */
      { t: "h", text: "6. Dàn ý 3 phút cho đề mẫu" },
      {
        t: "table",
        head: ["Đoạn", "Nội dung", "Con số dùng (9)"],
        rows: [
          ["**Mở bài** (1 câu)", "Viết lại đề: compares how much was spent per person… and how this was divided between three sources", "—"],
          ["**Overview** (2 câu)", "① tổng: cao nhất Capital, giảm dần tới Southern (≈ một nửa) · ② government lớn nhất mọi nơi nhưng giảm theo tổng; out-of-pocket ngược lại", "— (chỉ “roughly half”)"],
          ["**Thân 1** — nhóm chi cao", "Capital: tổng + government + insurance (cao vượt) · Northern ≈ Eastern: tổng; nhà nước ≈ ⅔", "4,000 · 2,400 · 1,100 · 3,100 · 3,000"],
          ["**Thân 2** — nhóm chi thấp", "Central + Southern: tổng thấp; insurance rất nhỏ; người bệnh trả nhiều · Southern nổi bật: 900 ≈ 1,000", "2,500 · 2,100 · 900 · 1,000"],
        ],
        caption: "Bỏ hẳn: out-of-pocket của Capital / Northern / Eastern / Central và government của Northern / Eastern / Central — chúng được nói gộp bằng “about two-thirds”, “far more… than elsewhere”.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Hai bài mẫu đặt cạnh nhau: band 6 và band 7" },
      {
        t: "p",
        text: "Đọc bài band 6 trước và tự trả lời: (1) overview nói mấy ý? (2) thân bài có bao nhiêu con số? (3) có câu nào **so sánh hai vùng** không? Rồi đọc bài band 7; phần ==tô dạ quang== là chỗ tạo ra khác biệt.",
      },
      {
        t: "passage",
        title: "Bài mẫu band 6 (ước tính) — 165 từ",
        paras: [
          { text: "The bar chart shows the health spending per person in five regions of one country in 2022. The spending is divided into three sources, which are government, private insurance and out-of-pocket payments." },
          { text: "Overall, the Capital spent the most money on health and the Southern region spent the least. The government spending was the highest in all regions." },
          { text: "In the Capital, the government spent $2,400, private insurance spent $1,100, which was much higher than in the other regions, and out-of-pocket was $500. In the Northern region, the government spent $2,100, private insurance was $600 and out-of-pocket was $400. In the Eastern region, the figures were $1,900, $500 and $600. Moreover, in the Central region, the government spent $1,500, while private insurance was $300 and out-of-pocket was $700. Finally, the Southern region had $1,000 for government, $200 for private insurance and $900 for out-of-pocket." },
          { text: "In conclusion, the government paid most of health spending in every region, and the Capital had the highest spending in total with $4,000." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 (ước tính) — 197 từ",
        paras: [
          { text: "The bar chart compares how much was spent on health per person in five regions of a country in 2022, and shows how this spending was divided between government funding, private insurance and direct payments by patients." },
          { text: "Overall, ==total spending was highest in the Capital and fell steadily towards the Southern region, where it was roughly half as high==. ==Although the government was the largest source of funding everywhere, its contribution shrank as total spending fell, while out-of-pocket payments followed the opposite pattern.==" },
          { text: "Spending per person in the Capital reached $4,000, ==of which== $2,400 came from the government and $1,100 from private insurance, ==by far the highest insurance figure of any region==. ==The Northern and Eastern regions recorded similar totals==, at $3,100 and $3,000 respectively; ==in both==, the state covered about two-thirds of the cost, ==with insurance and patients sharing the remainder==." },
          { text: "The Central and Southern regions spent considerably less, at $2,500 and $2,100. ==Here==, insurance played only a minor role, ==whereas patients paid far more directly than elsewhere==. ==The Southern region was the most striking case==: out-of-pocket payments, at $900, almost matched the $1,000 provided by the government and made up over 40% of the total." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7", "Bài học"],
        rows: [
          ["**TA**", "Overview có nhưng chỉ nói **cao nhất / thấp nhất**; bỏ sót điểm chính (out-of-pocket đi ngược). Thân bài kể **đủ 15 con số**, hầu như không so sánh. Có “In conclusion” lặp lại.", "Overview **hai ý** (tổng + cơ cấu). Thân bài **9 con số**, gom ba vùng chi cao / hai vùng chi thấp, nêu trường hợp nổi bật.", "Lập dàn ý 3 tầng trước; gạch bỏ con số không phục vụ so sánh"],
          ["**CC**", "Mỗi vùng một câu cùng khuôn; nối bằng Moreover, Finally, In conclusion (máy móc).", "Mỗi khổ một nhóm; quy chiếu: this spending · its contribution · in both · Here · elsewhere · the remainder.", "Thay từ nối đầu câu bằng **quy chiếu** (Ngày 12 học kỹ)"],
          ["**LR**", "spent × 6, was × 6, had; “out-of-pocket was $500” (dùng tính từ như danh từ); “the Capital spent” (vùng không tiêu tiền).", "compares · was divided between · contribution shrank · covered · played only a minor role · almost matched · made up · the most striking case.", "Học cụm của mục 4–5; đổi chủ ngữ: Spending in… / The state… / Patients…"],
          ["**GRA**", "Câu đơn nối bằng and / while; lỗi mạo từ: the health spending, the government spending, most of health spending.", "of which… · where it was… · Although…, …while… · with + N + V-ing · cụm đồng vị (by far the highest…) — **không lỗi**.", "Mỗi khổ một cấu trúc phụ thuộc; soát mạo từ (Ngày 1)"],
        ],
        caption: "Bài band 7 chỉ dài hơn khoảng 30 từ. Nó không “nhiều chữ khó” hơn — nó CHỌN và NHÓM tốt hơn.",
      },
      {
        t: "note",
        title: "💡 Luyện tái tạo bài mẫu",
        items: [
          "Che bài band 7. Chỉ nhìn **bảng dàn ý mục 6** và viết lại trong 17 phút.",
          "So với bài mẫu: overview của bạn có **ý thứ hai** không? Có câu **in both** / **Here** / **the most striking case** không?",
          "Chép ba cụm bạn không tự viết ra được vào Sổ lỗi (vd “of which… came from…”, “with… sharing the remainder”).",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Cột nhóm nhiều lớp ở band 7 — tìm quy luật và ngoại lệ" },
      {
        t: "p",
        text: "Với **cột nhóm**, tổng thường không có nghĩa. Việc cần làm: nhìn **từng hạng mục** xem các cột thay đổi theo chiều nào khi đi từ nhóm này sang nhóm kia, rồi gom các hạng mục **cùng chiều** vào một khổ. Xem biểu đồ dưới: bốn dịch vụ y tế × ba nhóm tuổi.",
      },
      {
        t: "chart",
        kind: "bar",
        title: "Adults in one country who used four health services at least once in 2023, by age group (%)",
        unit: "%",
        labels: ["GP visit", "Dental check-up", "Health screening", "Online consultation"],
        series: [
          { name: "18–34", values: [52, 61, 14, 46] },
          { name: "35–59", values: [68, 58, 39, 31] },
          { name: "60 and over", values: [88, 47, 66, 9] },
        ],
      },
      {
        t: "table",
        head: ["Hạng mục", "Chiều thay đổi theo tuổi", "Xếp vào"],
        rows: [
          ["GP visit", "tăng mạnh: 52 → 68 → 88", "**Khổ 1** — tăng theo tuổi"],
          ["Health screening", "tăng rất mạnh: 14 → 39 → 66 (gần gấp năm)", "**Khổ 1** — tăng theo tuổi"],
          ["Online consultation", "giảm mạnh: 46 → 31 → 9", "**Khổ 2** — giảm theo tuổi"],
          ["Dental check-up", "giảm nhẹ, ít chênh: 61 → 58 → 47", "**Khổ 2** — ngoại lệ (ít biến động)"],
        ],
        caption: "“Theo tuổi” ở đây là so GIỮA các nhóm tại cùng một năm — không phải thay đổi theo thời gian ⇒ dùng rose with age / was higher among…, không dùng increased over the period.",
      },
      {
        t: "examples",
        items: [
          { en: "Overall, older adults were far more likely than younger ones to see a GP or attend a screening, whereas online consultations were used mainly by the young. Dental check-ups showed the least variation between age groups.", vi: "(Overview) Nhìn chung, người lớn tuổi có khả năng đi khám bác sĩ đa khoa hoặc tầm soát cao hơn hẳn người trẻ, trong khi khám trực tuyến chủ yếu do người trẻ dùng. Khám răng ít chênh lệch nhất giữa các nhóm tuổi." },
          { en: "Use of GP services and health screening rose markedly with age. Just over half of 18–34-year-olds saw a GP, compared with 88% of those aged 60 and over, while the proportion attending a screening was almost five times as high in the oldest group as in the youngest (66% against 14%).", vi: "(Thân 1) Việc dùng dịch vụ bác sĩ đa khoa và tầm soát tăng rõ theo tuổi. Hơn một nửa số người 18–34 tuổi đi khám bác sĩ đa khoa, so với 88 % ở nhóm từ 60 tuổi, còn tỉ lệ đi tầm soát ở nhóm già nhất cao gần gấp năm lần nhóm trẻ nhất (66 % so với 14 %)." },
          { en: "The reverse was true of online consultations: these were used by 46% of the youngest adults but by fewer than one in ten of their oldest counterparts. Dental check-ups were the exception to both patterns, with relatively little difference between the three groups (61%, 58% and 47%).", vi: "(Thân 2) Khám trực tuyến thì ngược lại: 46 % người trẻ nhất dùng nhưng chưa tới một phần mười người thuộc nhóm già nhất dùng. Khám răng là ngoại lệ của cả hai quy luật, với chênh lệch tương đối nhỏ giữa ba nhóm (61 %, 58 % và 47 %)." },
        ],
      },
      {
        t: "note",
        title: "📌 Ba điều rút ra từ đoạn mẫu cột nhóm",
        items: [
          "Chủ ngữ là **người / tỉ lệ người**, không phải “the bar”: 46% of the youngest adults · the proportion attending a screening.",
          "Đổi cách nói số: just over half (52 %) · fewer than one in ten (9 %) · almost five times as high (66 so với 14) — Tập 3 Ngày 11.",
          "**counterparts** (Tập 3 Ngày 12) tránh lặp “adults”: the youngest adults… their oldest **counterparts**.",
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bảy lỗi làm bài cột chồng / cột nhóm kẹt ở band 6 — bảng tự soát 2 phút" },
      {
        t: "table",
        head: ["#", "Lỗi", "Sửa"],
        rows: [
          ["1", "Overview chỉ có cao nhất / thấp nhất", "Thêm ý 2 về **cơ cấu** hoặc **quy luật** (tầng 3)"],
          ["2", "Kể từng cột theo thứ tự trái → phải", "Gom thành **2 nhóm**, mỗi nhóm một khổ"],
          ["3", "Hơn 12 con số trong thân bài", "Giữ 6–9 số; phần còn lại nói gộp (about two-thirds, far more than elsewhere)"],
          ["4", "Lẫn số tuyệt đối và tỉ lệ", "Ghi rõ đơn vị; dùng share / proportion chỉ khi nói %"],
          ["5", "Dùng increase / decrease khi không có thời gian", "higher / lower than · as… as · the highest figure"],
          ["6", "Không nhắc **tổng** của cột chồng", "Mỗi nhóm nêu ít nhất một tổng (stood at / totalled)"],
          ["7", "Có kết luận, ý kiến, lý do (“because people there are poor”)", "Task 1 chỉ **tả**; không giải thích nguyên nhân, không In conclusion"],
        ],
        caption: "Dành 2 phút cuối soát 7 dòng này + đếm từ (≥ 150; mục tiêu 170–200).",
      },

      /* ── 10 ── */
      { t: "h", text: "10. Tự viết — AI chấm 4 tiêu chí (20 phút mỗi bài)" },
      {
        t: "sodo",
        kind: "flow",
        title: "20 phút cho Task 1 cột chồng / cột nhóm",
        steps: [
          { label: "0–3': Đọc 3 tầng, chọn cách nhóm", sub: "Ghi: tổng · thành phần · cơ cấu · ngoại lệ; khoanh 6–9 con số" },
          { label: "3–5': Mở bài + overview hai ý", sub: "Overview không có con số cụ thể" },
          { label: "5–17': Hai khổ thân bài", sub: "Mỗi khổ một nhóm; mỗi khổ một câu of which / with + V-ing; một câu ngoại lệ" },
          { label: "17–20': Soát", sub: "Bảy lỗi ở mục 9 + mạo từ + đơn vị + đếm từ" },
        ],
      },
      {
        t: "p",
        text: "**Bài 1 — cột chồng có thời gian.** Ba cột là ba năm ⇒ dùng được ngôn ngữ xu hướng (rose, fell, doubled) **cùng với** ngôn ngữ thành phần. Trong đề thật bốn loại hộ **chồng lên nhau**; tổng số hộ: 1990 = **19** triệu, 2005 = **22** triệu, 2020 = **26** triệu.",
      },
      {
        t: "chart",
        kind: "bar",
        title: "Households in one country by type, 1990–2020 (millions) — in the exam the four types are STACKED; totals: 19, 22 and 26 million",
        unit: "m",
        labels: ["1990", "2005", "2020"],
        series: [
          { name: "One person", values: [4, 6, 9] },
          { name: "Couple without children", values: [5, 6, 7] },
          { name: "Couple with children", values: [9, 8.5, 7.5] },
          { name: "Single parent", values: [1, 1.5, 2.5] },
        ],
      },
      {
        t: "essay",
        id: "t4d8-viet-bai-1",
        task: "Task 1",
        prompt: "The stacked bar chart shows the number of households in one country in 1990, 2005 and 2020, divided into four types (one person; couple without children; couple with children; single parent). Total households: 19 million (1990), 22 million (2005), 26 million (2020). One person: 4, 6, 9 million. Couple without children: 5, 6, 7 million. Couple with children: 9, 8.5, 7.5 million. Single parent: 1, 1.5, 2.5 million. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Ba tầng: tổng tăng 19 → 26 triệu · thành phần lớn nhất ĐỔI (couple with children → one person) · cơ cấu: ba loại tăng, một loại giảm.",
          "Overview hai ý: tổng tăng đều; hộ một người thay hộ vợ chồng có con ở vị trí phổ biến nhất.",
          "Nhóm: khổ 1 = ba loại tăng (one person hơn gấp đôi; single parent tăng 2,5 lần nhưng vẫn nhỏ nhất) · khổ 2 = loại duy nhất giảm (the only type to decline).",
          "Dùng ít nhất một câu of which / with + N + V-ing và một câu so tỉ lệ (từ gần một nửa xuống dưới 30 %).",
          "Có thời gian ⇒ quá khứ đơn + rose / fell / more than doubled; không viết kết luận.",
        ],
      },
      {
        t: "p",
        text: "**Bài 2 — cột nhóm bốn lớp.** Hai giới × hai năm. Trục nào làm xương sống? Thử cả hai: (a) theo **hoạt động** (việc có lương / việc nhà / chăm con), (b) theo **giới**. Chọn cách cho bạn ít khổ nhất và nhiều so sánh nhất.",
      },
      {
        t: "chart",
        kind: "bar",
        title: "Average hours per week spent on three activities by men and women in dual-income households with children in one country, 2000 and 2020",
        unit: "h",
        labels: ["Paid work", "Housework", "Childcare"],
        series: [
          { name: "Men 2000", values: [44, 6, 4] },
          { name: "Women 2000", values: [31, 21, 13] },
          { name: "Men 2020", values: [41, 10, 9] },
          { name: "Women 2020", values: [36, 15, 14] },
        ],
      },
      {
        t: "essay",
        id: "t4d8-viet-bai-2",
        task: "Task 1",
        prompt: "The bar chart shows the average number of hours per week spent on paid work, housework and childcare by men and women in dual-income households with children in one country, in 2000 and 2020. Paid work: men 44 (2000) and 41 (2020), women 31 and 36. Housework: men 6 and 10, women 21 and 15. Childcare: men 4 and 9, women 13 and 14. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Điểm chính: khoảng cách nam – nữ THU HẸP ở cả ba hoạt động, nhưng năm 2020 nữ vẫn làm việc nhà và chăm con nhiều hơn.",
          "Overview hai ý: (1) nam làm việc có lương nhiều hơn, nữ làm việc không lương nhiều hơn ở cả hai năm; (2) chênh lệch nhỏ đi rõ rệt.",
          "Nhóm theo hoạt động: khổ 1 = paid work · khổ 2 = housework + childcare (cùng chiều: nam tăng, nữ giảm hoặc gần như không đổi).",
          "Ngoại lệ đáng nêu: thời gian chăm con của nữ gần như không đổi (13 → 14) trong khi của nam hơn gấp đôi.",
          "Từ nên dùng: the gap narrowed · their male / female counterparts · more than doubled · remained virtually unchanged · unpaid work.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t4d8-nghe",
    kind: "listening",
    title: "Nghe Part 4: bài giảng 6 phút — Note completion + Sentence completion",
    goal: "Nghe một bài giảng đại học dài 6 phút (~165 từ/phút, không quãng nghỉ) và làm đúng ít nhất 8/10 câu Part 4 gồm hai dạng liền nhau — Note completion và Sentence completion: theo được bản đồ bài giảng qua bốn lớp tín hiệu, bắt được đáp án sau khi phương án nhiễu bị gạt đi, điền từ khớp ngữ pháp của câu, và nhận ra chuỗi âm yếu kiểu should have been /ʃəd əv bɪn/.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Part 4** = một người nói, bài giảng học thuật, **không có quãng nghỉ giữa bài**. Tập 2 Ngày 19 nhập môn; Tập 3 Ngày 13 làm Note completion với bài 5 phút; Tập 3 Ngày 24 làm Summary + Table. Hôm nay: bài ==6 phút, khoảng 1.000 từ, 165 từ/phút==, **hai dạng** trong một bài.",
          "**Note completion** (31–36): ghi chú có tiêu đề con, câu cụt — đi theo **tiêu đề**. **Sentence completion** (37–40): câu đầy đủ, là **bản diễn đạt lại** của lời giảng — từ điền vào phải **khớp ngữ pháp**.",
          "Ở band 7, gần như **câu nào cũng có nhiễu**: giảng viên nhắc một khả năng rồi gạt đi (The boy wasn't… he was…). Đáp án đứng **sau** chỗ gạt.",
          "Bài giảng dài cần **sức bền**: lạc 15 giây ở phút thứ 4 là mất 2–3 câu. Bốn lớp tín hiệu (mục 3) giúp bạn bắt lại bài.",
          "🔊 **Âm yếu chuỗi**: should have been nghe như “shudəvbin”. Không nhận ra chuỗi này thì nghe sót cả ý “lẽ ra / hẳn là”.",
          "Mục tiêu Tập 4: Part 3 + Part 4 ≥ 14/20. Hôm nay: **≥ 8/10**.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 4 ở band 7 — khác bài Tập 3 Ngày 13 · 24 ở đâu" },
      {
        t: "table",
        head: ["", "Tập 3 (band 6)", "Hôm nay (band 7)"],
        rows: [
          ["**Độ dài · tốc độ**", "≈ 5 phút · 150 từ/phút", "≈ 6 phút · 165 từ/phút — nhanh hơn một phần mười, dài hơn một phần năm"],
          ["**Số dạng câu hỏi**", "Một dạng cho cả 10 câu", "**Hai dạng**: phải đổi cách đọc giữa bài mà không có quãng nghỉ"],
          ["**Paraphrase**", "Ghi chú dùng từ gần với lời giảng", "Câu hỏi **đổi cả cấu trúc**: chủ động ↔ bị động, động từ ↔ danh từ, gộp hai câu"],
          ["**Nhiễu**", "Khoảng một nửa số câu", "Gần như **mọi câu**: nêu rồi gạt, số cũ – số mới, quan niệm sai – sự thật"],
          ["**Từ vựng**", "Chủ đề quen (bờ biển, năng lượng)", "Chủ đề học thuật hơn (lịch sử y học); có **thuật ngữ được giải thích ngay trong bài**"],
          ["**Thời gian đọc trước**", "≈ 45 giây", "≈ 45 giây cho **cả hai** dạng ⇒ phải chia: 30 giây cho ghi chú, 15 giây cho bốn câu"],
        ],
      },
      {
        t: "note",
        title: "📌 Nghe bài giảng thật ở đại học cũng theo đúng cách này",
        items: [
          "Giảng viên bao giờ cũng **báo trước bố cục** trong 30 giây đầu (I'll begin with… Then I'll turn to… Finally…). Ghi ngay ba bốn từ khoá đó ra lề — đó là **mục lục** của bài.",
          "**Thuật ngữ lạ** luôn được giải thích liền sau: “a technique known as variolation… The idea was to…”, “milkmaids — the young women who milked the cows”. Không cần biết trước; cần **nghe phần giải thích**.",
          "Ghi chú khi nghe bài giảng thật: viết **danh từ + số**, bỏ mạo từ và động từ be; dùng ký hiệu → (dẫn tới), ↑ ↓ (tăng, giảm), ≠ (khác), vs (so với), e.g., c. (khoảng). Ngày 20 sẽ học kiểu ghi chú Cornell.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Hai dạng hôm nay: Note completion và Sentence completion" },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng là điền từ — đọc khác nhau",
        cols: [
          { title: "Note completion", items: ["Trang ghi chú có **tiêu đề con** và gạch đầu dòng", "Câu **cụt**: thiếu mạo từ, động từ", "Bám **tiêu đề con** để biết đang ở đâu", "Từ trước / sau chỗ trống thường **giống** lời giảng hoặc là từ đồng nghĩa gần", "Đoán trước: **loại từ** (danh từ? số nhiều?)"] },
          { title: "Sentence completion", items: ["Các câu **đầy đủ**, đánh số, không có tiêu đề", "Mỗi câu là một **bản tóm tắt viết lại** 2–3 câu của lời giảng", "Bám **tên riêng, năm, danh từ chính** của từng câu", "Từ điền vào phải làm câu **đúng ngữ pháp** (số ít / số nhiều, mạo từ a / an đứng trước)", "Đoán trước: loại từ + **nghĩa** (người? vật? nơi?)"] },
        ],
      },
      {
        t: "table",
        head: ["Dấu trong câu hỏi", "Suy ra về đáp án", "Ví dụ"],
        rows: [
          ["**a / an** + ___", "Danh từ **số ít** đếm được; an ⇒ bắt đầu bằng nguyên âm", "was made as a ___ ⇒ a powder (không phải powders)"],
          ["___ + **were / are** · between ___", "Danh từ **số nhiều**", "passing it between ___ ⇒ orphans"],
          ["the ___ **of** + N", "Danh từ; nghĩa “cái gì của…”", "vaccinated the ___ of each infected person ⇒ contacts"],
          ["**in / by / since** + ___", "Năm hoặc mốc thời gian", "declared free of smallpox in ___ ⇒ 1980"],
          ["could / will / to + ___", "Động từ **nguyên mẫu**", "treated people could ___ the disease ⇒ spread"],
          ["and, often, ___ (sau một danh từ)", "Cùng loại với từ đứng trước (**song song**)", "scarring and, often, ___ ⇒ blindness"],
        ],
        caption: "15 giây đọc bốn câu Sentence completion: khoanh từ ngay TRƯỚC chỗ trống và từ khoá định vị (năm, tên riêng).",
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay mất điểm ở Sentence completion",
        items: [
          "**Sai số ít / số nhiều:** nghe “contacts” viết ~~contact~~, nghe “orphans” viết ~~orphan~~ ⇒ sai. Âm cuối /s/ /z/ rất nhẹ — dùng **ngữ pháp của câu** để kiểm (between ___ ⇒ số nhiều).",
          "**Chép thừa từ đã in:** câu in sẵn “a ___” mà viết ~~a powder~~ ⇒ quá số từ / lặp từ ⇒ sai.",
          "**Vượt giới hạn từ:** ONE WORD AND/OR A NUMBER nghĩa là tối đa **một từ**, hoặc **một số**, hoặc **một từ + một số**. ~~freeze-dried powder~~ = hai từ ⇒ sai (từ có gạch nối tính là một từ, nhưng ở đây powder đã đủ).",
          "**Viết từ nhiễu:** giảng viên nói năm 1967, 1977, 1980 — chỉ một năm khớp với **động từ của câu hỏi** (declared).",
          "**Sai chính tả:** blindness, gardener, cartoons, orphans — viết sai một chữ là mất điểm. Soát trong 2 phút cuối.",
        ],
      },
      { t: "rule", formula: "Trước khi nghe: từ ngay trước chỗ trống → loại từ + số ít / số nhiều  ·  Khi nghe: chờ chỗ GẠT (wasn't… / but… / in fact…) → đáp án đứng sau", vi: "Điền xong đọc lại cả câu: đúng ngữ pháp, đúng số từ, đúng chính tả." },

      /* ── 3 ── */
      { t: "h", text: "3. Bốn lớp tín hiệu giữ bạn không lạc trong 6 phút" },
      {
        t: "table",
        head: ["Lớp", "Việc nó làm", "Cụm hay gặp"],
        rows: [
          ["**1. Mục lục** (30 giây đầu)", "Báo số phần và thứ tự", "I'll begin with… · Then I'll turn to… · Finally, I'll look at…"],
          ["**2. Chuyển phần**", "Báo sang tiêu đề con mới ⇒ nhìn xuống nhóm câu kế", "First, … · Now, … · This brings us to… · The real difficulty was… · In 1967…"],
          ["**3. Gạt – sửa**", "Báo điều vừa nói **không phải** đáp án", "…wasn't, as is sometimes said, … · You might think… They weren't. · At first… So the strategy changed. · Instead of…"],
          ["**4. Nhấn điểm chính**", "Báo điều sắp nói **quan trọng** (thường là đáp án)", "What Jenner did was… · The breakthrough came… · more seriously… · It's from… that we get…"],
        ],
        caption: "Lớp 4 dùng chính câu chẻ của Ngày 7 (What… was… / It's… that…). Nghe thấy What… is / was ⇒ đáp án ở NGAY SAU.",
      },
      {
        t: "note",
        title: "💡 Lạc giữa bài 6 phút thì làm gì",
        items: [
          "Dấu hiệu đã lạc: 15 giây liền không nghe thấy từ nào của dòng ghi chú bạn đang nhìn.",
          "Không cố nhớ lại. Nhìn xuống **tiêu đề con kế tiếp** (hoặc năm / tên riêng của câu kế) và chờ cụm chuyển phần.",
          "Khi đổi dạng (hết câu 36 sang 37): giảng viên **không báo**. Nghe hết đáp án 36 là mắt phải đã ở câu 37.",
          "Câu đã lỡ: cuối bài điền một từ đúng loại, hợp nghĩa. Không bỏ trống.",
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Phát âm: âm yếu chuỗi — should have been /ʃəd əv bɪn/" },
      {
        t: "p",
        text: "Tập 2 Ngày 15 · 17 và Tập 3 Ngày 9 · 20 đã luyện âm yếu /ə/ ở từng từ (to, for, of, can). Trong bài giảng, các từ chức năng hay đi thành **chuỗi ba bốn từ** và cả chuỗi đều yếu: modal + **have** + **been** + V3. Chữ **have** rơi mất /h/, còn lại ==/əv/== — nghe y như **of**; **been** đọc ngắn ==/bɪn/==. Chỉ động từ chính (V3) được nhấn. Người Việt chờ nghe “hev” và “biin” nên **không nhận ra** cả cụm, mất luôn nghĩa “lẽ ra”, “hẳn là”.",
      },
      {
        t: "table",
        head: ["Viết", "Đọc nhanh", "Nghe như", "Nghĩa"],
        rows: [
          ["should have been + V3", "/ʃəd əv bɪn/", "shud-əv-bin", "lẽ ra đã được (nhưng không)"],
          ["could have been + V3", "/kəd əv bɪn/", "kud-əv-bin", "lẽ ra đã có thể được"],
          ["would have been + V3", "/wəd əv bɪn/", "wud-əv-bin", "hẳn đã được (nếu…)"],
          ["must have been + adj / N", "/məst əv bɪn/", "məs-təv-bin", "chắc hẳn đã là"],
          ["might have been + V3", "/maɪt əv bɪn/", "mai-təv-bin", "có thể đã bị / được"],
          ["couldn't have been", "/kʊdnt əv bɪn/", "kudn-təv-bin", "không thể nào đã là"],
          ["had been + V3", "/həd bɪn/ → /əd bɪn/", "əd-bin", "đã được (trước một mốc quá khứ)"],
          ["to have been + V3", "/tə həv bɪn/", "tə-həv-bin", "(là thứ) đã được"],
        ],
        caption: "/t/ và /d/ cuối modal nối sang /əv/: must‿have = “məs-təv”; should‿have = “shu-dəv”.",
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận với chuỗi âm yếu",
        items: [
          "Nghe “shudəv”, “kudəv” ⇒ viết **should have**, **could have** — không bao giờ viết ~~should of~~, ~~could of~~ (lỗi của chính người bản ngữ).",
          "Sau chuỗi này là **V3**: should have been **welcomed**, could have been **prevented**. Âm đuôi -ed của V3 nghe rõ hơn cả chuỗi phía trước — bám vào nó.",
          "Khi **nói**, bạn không bắt buộc đọc yếu như thế, nhưng đừng nhấn đều cả bốn từ (~~SHOULD HAVE BEEN DONE~~): nhấn V3, lướt ba từ kia.",
          "**would've / should've / could've** là dạng viết của văn nói; trong Writing viết đủ **would have**. (Ngày 19 luyện would've trong câu dài.)",
        ],
      },
      { t: "rule", formula: "modal + have + been + V3 ⇒ /ʃəd əv bɪn/ + V3 — lướt ba từ đầu, nhấn V3", vi: "have = /əv/ (như of), been = /bɪn/; nghe “shudəvbin” thì hiểu ngay “lẽ ra đã được”." },
      {
        t: "phatam",
        id: "t4d8-phat-am",
        title: "Luyện phát âm — chuỗi âm yếu: modal + have + been",
        note: "Lướt nhanh, nhẹ ba từ chức năng; dồn hơi vào động từ chính ở cuối. Máy chấm từng từ theo cách đọc yếu ghi trong phiên âm.",
        items: [
          { text: "It should have been welcomed at once.", ipa: "ɪt ʃəd əv bɪn welkəmd ət wʌns", vi: "Lẽ ra nó phải được đón nhận ngay." },
          { text: "Those deaths could have been prevented.", ipa: "ðəʊz deθs kəd əv bɪn prɪventɪd", vi: "Những cái chết đó lẽ ra đã có thể ngăn được." },
          { text: "It must have been an extraordinary moment.", ipa: "ɪt məst əv bɪn ən ɪkstrɔːdnri məʊmənt", vi: "Đó hẳn là một khoảnh khắc phi thường." },
          { text: "That would never have been allowed.", ipa: "ðæt wəd nevər əv bɪn əlaʊd", vi: "Việc đó hẳn sẽ không bao giờ được cho phép." },
          { text: "They might have been exposed.", ipa: "ðeɪ maɪt əv bɪn ɪkspəʊzd", vi: "Họ có thể đã bị phơi nhiễm." },
          { text: "The method had been taken up across Europe.", ipa: "ðə meθəd həd bɪn teɪkən ʌp əkrɒs jʊərəp", vi: "Phương pháp đó đã được áp dụng khắp châu Âu." },
          { text: "It couldn't have been done without them.", ipa: "ɪt kʊdnt əv bɪn dʌn wɪðaʊt ðəm", vi: "Việc đó không thể nào làm được nếu thiếu họ." },
          { text: "The vaccine should have been stored as a powder.", ipa: "ðə væksiːn ʃəd əv bɪn stɔːd əz ə paʊdə", vi: "Vắc-xin lẽ ra phải được bảo quản ở dạng bột." },
        ],
      },
      {
        t: "mcq",
        id: "t4d8-nghe-am-yeu",
        title: "Nghe thấy thế này — thật ra là gì? (5 câu)",
        items: [
          { q: "Bạn nghe: “The results /ʃədəvbɪn/ published earlier.” Câu viết đúng là:", options: ["The results should of been published earlier.", "The results should have been published earlier.", "The results should been published earlier.", "The results should have being published earlier."], correct: 1, why: "/əv/ = have (không phải of); /bɪn/ = been. should have been + V3." },
          { q: "“Many of those deaths /kədəvbɪn/ prevented.” Ý của người nói là:", options: ["Những cái chết đó đã được ngăn chặn.", "Những cái chết đó sẽ được ngăn chặn.", "Những cái chết đó lẽ ra có thể ngăn được, nhưng thực tế đã không.", "Những cái chết đó không thể ngăn được."], correct: 2, why: "could have been + V3 = việc có thể đã xảy ra nhưng thực tế không xảy ra." },
          { q: "“It /məstəvbɪn/ difficult.” Từ bị “nuốt” ở giữa là:", options: ["of", "a", "had", "have"], correct: 3, why: "must have been: have đọc yếu /əv/, /t/ của must nối sang ⇒ “məs-təv”." },
          { q: "Trong chuỗi “would never have been allowed”, từ nào được NHẤN mạnh nhất?", options: ["allowed (và never)", "would", "have", "been"], correct: 0, why: "Động từ chính (V3) và từ phủ định mang nghĩa được nhấn; would / have / been là từ chức năng — đọc yếu." },
          { q: "“By 1800 the method /ədbɪn/ taken up across Europe.” Dạng đầy đủ là:", options: ["has been", "had been", "would been", "and been"], correct: 1, why: "By + mốc quá khứ ⇒ quá khứ hoàn thành bị động: had been taken up; had yếu thành /əd/." },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Luyện ngắn — Practice 1 (4 câu Sentence completion)" },
      {
        t: "p",
        text: "Đọc bốn câu trong **15 giây**: khoanh từ đứng ngay trước chỗ trống và đoán loại từ. Rồi nghe **một lần**. Lời dẫn: **Complete the sentences below. Write ONE WORD ONLY for each answer.**",
      },
      {
        t: "listen",
        id: "t4d8-nghe-ngan",
        title: "Hospital design — the opening of a lecture",
        dan: { so: "Day 8, Practice 1", boiCanh: "the beginning of a lecture on hospital design.", cau: [1, 4] },
        note: "Khoảng 1 phút, giọng Anh (nữ). ONE WORD ONLY.",
        lines: [
          { who: "Lecturer", voice: "uk-nu", text: "Good morning. Today we're looking at how the design of a hospital building affects the people inside it. For most of the nineteenth century, architects had one main concern, and it wasn't comfort: wards were long and narrow, with windows on both sides, because fresh air was believed to prevent infection from passing between patients.", vi: "Chào buổi sáng. Hôm nay ta xem thiết kế của toà nhà bệnh viện ảnh hưởng thế nào tới người bên trong. Gần suốt thế kỷ 19, kiến trúc sư có một mối bận tâm chính, và đó không phải là sự thoải mái: buồng bệnh dài và hẹp, có cửa sổ hai bên, vì người ta tin không khí trong lành ngăn nhiễm trùng lây giữa các bệnh nhân." },
          { who: "Lecturer", voice: "uk-nu", text: "Comfort came much later. In 1984 a now famous study compared patients recovering from the same operation in the same hospital. Half had rooms looking out onto trees; the windows of the other half faced a brick wall. Those with the natural view went home almost a day sooner. They also complained less to the nurses and — this is the finding that surprised people — asked for fewer painkillers.", vi: "Sự thoải mái đến sau đó rất lâu. Năm 1984, một nghiên cứu nay đã nổi tiếng so sánh các bệnh nhân hồi phục sau cùng một ca mổ ở cùng một bệnh viện. Một nửa có phòng nhìn ra cây cối; cửa sổ của nửa kia đối diện một bức tường gạch. Những người có cảnh thiên nhiên về nhà sớm hơn gần một ngày. Họ cũng ít phàn nàn với điều dưỡng hơn và — đây là phát hiện khiến người ta ngạc nhiên — xin ít thuốc giảm đau hơn." },
          { who: "Lecturer", voice: "uk-nu", text: "Since then, researchers have examined the influence of daylight, colour and even artwork. I'll come back to light next week. In this lecture, though, I want to concentrate on noise, which turns out to be the factor patients themselves mention most.", vi: "Từ đó, các nhà nghiên cứu đã xem xét ảnh hưởng của ánh sáng ban ngày, màu sắc và cả tranh ảnh. Tuần sau tôi sẽ quay lại chuyện ánh sáng. Còn trong bài giảng này, tôi muốn tập trung vào tiếng ồn, hoá ra lại là yếu tố chính bệnh nhân nhắc tới nhiều nhất." },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-nghe-ngan-dien",
        kind: "fill",
        title: "Practice 1 — Questions 1–4. ONE WORD ONLY",
        items: [
          { q: "1. Nineteenth-century wards were designed to stop ___ spreading from one patient to another.", answers: ["infection"] },
          { q: "2. In the 1984 study, half of the patients looked out at a ___ wall.", answers: ["brick"] },
          { q: "3. Patients who could see trees required fewer ___.", answers: ["painkillers"] },
          { q: "4. The lecturer's main topic today will be the effect of ___.", answers: ["noise"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích Practice 1",
        items: [
          "**1 infection** — “fresh air was believed to prevent **infection** from passing between patients”. Câu hỏi đổi cấu trúc: prevent… from passing between patients ↔ stop… spreading from one patient to another. “comfort” bị gạt: “it **wasn't** comfort”.",
          "**2 brick** — “the windows of the other half faced a **brick** wall”. “trees” là nửa kia. a ___ wall ⇒ cần tính từ / danh từ bổ nghĩa.",
          "**3 painkillers** — “asked for fewer **painkillers**”. required ↔ asked for. Số nhiều (fewer + danh từ đếm được số nhiều). “complained less to the nurses” là nhiễu: nurses không đi với required fewer.",
          "**4 noise** — “I'll come back to **light** next week. In this lecture, **though**, I want to concentrate on **noise**”. light / daylight / colour / artwork đều được nhắc trước và bị gạt bằng though.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Bài chính — Part 4, Questions 31–40" },
      {
        t: "p",
        text: "Làm như thi thật: **45 giây** đọc cả trang (30 giây cho ghi chú 31–36, 15 giây cho câu 37–40), rồi bấm nghe **một lần duy nhất**, không dừng. Viết đáp án ra giấy khi nghe; hết băng mới gõ vào ô và soát chính tả, số ít / số nhiều. **Questions 31–36:** Complete the notes below. Write **ONE WORD ONLY** for each answer.",
      },
      {
        t: "note",
        title: "THE CONTROL OF SMALLPOX — lecture notes (Questions 31–36)",
        items: [
          "**The disease**",
          "• killed about three in ten of those infected",
          "• survivors: scarring and, often, **31** ___",
          "**Variolation (before vaccination)**",
          "• India and the Ottoman Empire: material placed in a cut in the skin",
          "• China: material blown into the **32** ___",
          "• drawback for the community: treated people could **33** ___ the disease",
          "**Jenner's experiment (1796)**",
          "• local belief: **34** ___ were protected because they had already had cowpox",
          "• idea tested on a boy whose father was Jenner's **35** ___",
          "**Reaction**",
          "• the Royal Society would not publish Jenner's paper",
          "• vaccinated patients were made fun of in **36** ___ in the press",
        ],
      },
      {
        t: "p",
        text: "**Questions 37–40:** Complete the sentences below. Write **ONE WORD AND/OR A NUMBER** for each answer. — **37** On the Spanish expedition of 1803, the vaccine was kept alive by passing it between ___. · **38** From the 1950s, vaccine could be kept in hot countries because it was produced as a ___. · **39** In the strategy that finally succeeded, teams vaccinated the ___ of each infected person. · **40** The world was officially declared free of smallpox in ___.",
      },
      {
        t: "listen",
        id: "t4d8-nghe-bai",
        title: "From variolation to eradication: the control of smallpox",
        dan: { so: "Day 8, Recording 1", boiCanh: "part of a lecture on the history of medicine, about how smallpox was brought under control.", cau: [31, 40] },
        note: "Khoảng 6 phút, ~165 từ/phút, giọng Anh (nam). Một người nói, không có quãng nghỉ. Câu 31–36: ONE WORD ONLY · câu 37–40: ONE WORD AND/OR A NUMBER.",
        lines: [
          { who: "Lecturer", voice: "uk-nam", text: "Good afternoon, everyone. In this session of the history of medicine course, I want to tell the story of how one disease, smallpox, was first controlled and then wiped out completely, and of what that story can teach us about public health today. I'll begin with the disease itself and the methods used against it before vaccination existed. Then I'll turn to Edward Jenner and his famous experiment, and to the reaction it provoked. Finally, I'll look at the practical problems that had to be solved before a vaccine developed in an English village could reach the whole world.", vi: "Chào cả lớp. Trong buổi này của môn lịch sử y học, tôi muốn kể chuyện một căn bệnh — đậu mùa — lần đầu được kiểm soát rồi bị xoá sổ hoàn toàn ra sao, và câu chuyện đó dạy ta điều gì về y tế công cộng hôm nay. Tôi sẽ bắt đầu với chính căn bệnh và các phương pháp chống lại nó trước khi có tiêm chủng. Rồi tôi chuyển sang Edward Jenner và thí nghiệm nổi tiếng của ông, cùng phản ứng mà nó gây ra. Cuối cùng, tôi xét những vấn đề thực tế phải giải quyết trước khi một loại vắc-xin ra đời ở một ngôi làng nước Anh có thể tới được cả thế giới." },
          { who: "Lecturer", voice: "uk-nam", text: "First, the disease. For most of recorded history, smallpox was one of the most feared illnesses on earth. Roughly three in every ten people who caught it died. Those who survived were usually left with deep scars on the face and body, and in a good many cases with blindness as well. It's been estimated that in eighteenth-century Europe it killed several hundred thousand people every year, rich and poor alike.", vi: "Trước hết là căn bệnh. Gần suốt lịch sử thành văn, đậu mùa là một trong những bệnh đáng sợ nhất trên đời. Cứ mười người mắc thì khoảng ba người chết. Người sống sót thường mang sẹo sâu trên mặt và thân thể, và trong khá nhiều trường hợp còn bị mù. Người ta ước tính ở châu Âu thế kỷ 18 nó giết vài trăm nghìn người mỗi năm, giàu nghèo như nhau." },
          { who: "Lecturer", voice: "uk-nam", text: "Now, people had long noticed that anyone who survived smallpox never caught it a second time. And from that observation came a technique known as variolation, which was practised in parts of Asia and Africa centuries before it reached Europe. The idea was to give a healthy person a mild case of the disease on purpose. In India and the Ottoman Empire, material taken from a patient's sore was placed in a small cut in the skin. In China the method was rather different: dried material was ground up and blown into the nose. Variolation did work — most people developed only a mild illness and were then protected for life. But it was far from safe. Perhaps one or two in every hundred died as a result, and, more seriously for the community, people who had been variolated could spread smallpox to those around them while they were recovering. So a technique intended to protect a family might start an epidemic in the neighbourhood.", vi: "Từ lâu người ta đã để ý rằng ai sống sót qua đậu mùa thì không bao giờ mắc lần hai. Từ quan sát đó sinh ra một kỹ thuật gọi là chủng đậu (variolation), được thực hành ở nhiều nơi tại châu Á và châu Phi hàng thế kỷ trước khi tới châu Âu. Ý tưởng là cố ý cho người khoẻ mắc bệnh ở thể nhẹ. Ở Ấn Độ và Đế quốc Ottoman, chất lấy từ mụn của bệnh nhân được đặt vào một vết rạch nhỏ trên da. Ở Trung Quốc cách làm khá khác: chất đã phơi khô được nghiền ra và thổi vào mũi. Chủng đậu quả là có tác dụng — đa số chỉ bị nhẹ rồi được bảo vệ suốt đời. Nhưng nó không hề an toàn. Có lẽ cứ một trăm người thì một hai người chết vì nó, và, nghiêm trọng hơn với cộng đồng, người đã được chủng đậu có thể lây đậu mùa cho người xung quanh trong lúc hồi phục. Thế nên một kỹ thuật nhằm bảo vệ một gia đình lại có thể khơi mào một trận dịch trong khu phố." },
          { who: "Lecturer", voice: "uk-nam", text: "This brings us to Edward Jenner, a doctor working in the English countryside at the end of the eighteenth century. Jenner is often given the credit for a discovery that wasn't really his. It was common knowledge among farmers in his area that milkmaids — the young women who milked the cows — rarely caught smallpox. The farmers' explanation was that these women had already had cowpox, a mild infection picked up from the animals. What Jenner did was to test that belief properly. In 1796 he took material from a cowpox sore on a milkmaid's hand and scratched it into the arm of an eight-year-old boy. The boy wasn't, as is sometimes said, Jenner's own son; he was the son of his gardener. Some weeks later, Jenner deliberately exposed the child to smallpox, and nothing happened. By today's standards, of course, an experiment like that would never have been allowed. But it showed that a harmless infection could protect against a deadly one.", vi: "Điều này đưa ta tới Edward Jenner, một bác sĩ làm việc ở vùng quê nước Anh cuối thế kỷ 18. Jenner thường được ghi công cho một phát hiện vốn không hẳn của ông. Nông dân trong vùng ai cũng biết những cô vắt sữa — các cô gái trẻ vắt sữa bò — hiếm khi mắc đậu mùa. Nông dân giải thích rằng các cô đã từng bị đậu bò, một bệnh nhẹ lây từ con vật. Việc Jenner làm là kiểm chứng niềm tin đó một cách bài bản. Năm 1796 ông lấy chất từ một mụn đậu bò trên tay một cô vắt sữa và rạch vào cánh tay một cậu bé tám tuổi. Cậu bé không phải, như đôi khi người ta nói, là con trai Jenner; cậu là con trai người làm vườn của ông. Vài tuần sau, Jenner cố ý cho đứa trẻ tiếp xúc với đậu mùa, và không có gì xảy ra. Tất nhiên theo chuẩn mực ngày nay, một thí nghiệm như thế hẳn sẽ không bao giờ được cho phép. Nhưng nó cho thấy một bệnh vô hại có thể bảo vệ ta khỏi một bệnh chết người." },
          { who: "Lecturer", voice: "uk-nam", text: "You might think that Jenner's results should have been welcomed at once. They weren't. When he sent his paper to the Royal Society, the leading scientific body in the country, it refused to publish it, and he had to print the work at his own expense. Many doctors, who earned a good living from variolation, were openly hostile. Some religious leaders objected to putting material from an animal into the human body. And the newspapers of the day printed cartoons in which vaccinated patients were shown growing horns and tails. Even so, within a few years the method had been taken up across Europe — and it's from the Latin word for ‘cow’, vacca, that we get the word ‘vaccine’.", vi: "Bạn có thể nghĩ kết quả của Jenner lẽ ra phải được đón nhận ngay. Không hề. Khi ông gửi bài báo tới Hội Hoàng gia, cơ quan khoa học hàng đầu cả nước, họ từ chối đăng, và ông phải tự bỏ tiền in. Nhiều bác sĩ, vốn kiếm khá nhờ chủng đậu, công khai thù địch. Một số nhà lãnh đạo tôn giáo phản đối việc đưa chất từ động vật vào cơ thể người. Còn báo chí thời đó in tranh biếm hoạ vẽ bệnh nhân được tiêm mọc sừng mọc đuôi. Dù vậy, chỉ vài năm sau phương pháp này đã được áp dụng khắp châu Âu — và chính từ chữ La-tinh chỉ “con bò”, vacca, mà ta có chữ “vaccine”." },
          { who: "Lecturer", voice: "uk-nam", text: "The real difficulty was a practical one. Cowpox material stayed active for only a few days, so how could it be carried across an ocean? The Spanish found a remarkable answer. In 1803 an expedition left Spain for the Americas, and on board, besides the sailors and the doctors, were twenty-two orphans. Two of the boys were vaccinated before the ship sailed; when their sores developed, material was passed to the next pair, and so on, arm to arm, for the whole voyage. It sounds shocking to us now, but in this way a living chain of vaccine reached the other side of the Atlantic.", vi: "Khó khăn thật sự lại là chuyện thực tế. Chất đậu bò chỉ còn hoạt tính vài ngày, vậy làm sao mang nó vượt đại dương? Người Tây Ban Nha tìm ra một lời giải đáng kinh ngạc. Năm 1803 một đoàn thám hiểm rời Tây Ban Nha sang châu Mỹ, và trên tàu, ngoài thuỷ thủ và bác sĩ, có hai mươi hai trẻ mồ côi. Hai cậu bé được tiêm trước khi tàu nhổ neo; khi mụn của các em nổi lên, chất được truyền sang cặp tiếp theo, cứ thế, từ tay sang tay, suốt chuyến đi. Với ta bây giờ điều đó nghe thật sốc, nhưng bằng cách ấy một chuỗi vắc-xin sống đã tới được bờ bên kia Đại Tây Dương." },
          { who: "Lecturer", voice: "uk-nam", text: "Even with such efforts, smallpox was still killing millions of people in the middle of the twentieth century, mainly in tropical countries. A large part of the problem was that liquid vaccine was quickly ruined by heat. The breakthrough came in the 1950s, when scientists learned to produce the vaccine as a freeze-dried powder, which could be stored for months without a refrigerator. Looking back, many of those earlier deaths could have been prevented if this simple technology had been available sooner.", vi: "Dù có những nỗ lực như thế, giữa thế kỷ 20 đậu mùa vẫn giết hàng triệu người, chủ yếu ở các nước nhiệt đới. Phần lớn vấn đề nằm ở chỗ vắc-xin dạng lỏng nhanh chóng bị nhiệt làm hỏng. Bước đột phá đến vào thập niên 1950, khi các nhà khoa học học được cách sản xuất vắc-xin ở dạng bột đông khô, có thể trữ nhiều tháng không cần tủ lạnh. Nhìn lại, nhiều cái chết trước đó lẽ ra đã ngăn được nếu công nghệ đơn giản này có sớm hơn." },
          { who: "Lecturer", voice: "uk-nam", text: "In 1967 the World Health Organization launched a campaign to eradicate the disease altogether. At first, the plan was to vaccinate everybody — at least eighty per cent of the population of every country. That proved impossible in crowded or remote regions. So the strategy changed. Instead of trying to reach whole populations, teams concentrated on finding each new case as quickly as possible, isolating the patient, and then vaccinating that person's contacts — family, neighbours, anyone who might have been exposed. This approach, sometimes called ring vaccination, required far less vaccine and turned out to be far more effective.", vi: "Năm 1967 Tổ chức Y tế Thế giới phát động chiến dịch thanh toán hẳn căn bệnh. Ban đầu, kế hoạch là tiêm cho tất cả — ít nhất tám mươi phần trăm dân số mỗi nước. Điều đó hoá ra bất khả thi ở các vùng đông đúc hoặc hẻo lánh. Thế là chiến lược thay đổi. Thay vì cố tiếp cận toàn bộ dân số, các đội tập trung tìm từng ca mới càng nhanh càng tốt, cách ly bệnh nhân, rồi tiêm cho những người tiếp xúc với người đó — gia đình, hàng xóm, bất kỳ ai có thể đã phơi nhiễm. Cách làm này, đôi khi gọi là tiêm chủng vòng, cần ít vắc-xin hơn nhiều và hoá ra hiệu quả hơn nhiều." },
          { who: "Lecturer", voice: "uk-nam", text: "The last person to catch smallpox naturally was a hospital cook in Somalia, in 1977. He recovered. After two more years in which no further cases were found anywhere, the World Health Organization officially declared, in 1980, that the world was free of smallpox. It remains the only human disease ever to have been eradicated. It must have been an extraordinary moment for the thousands of health workers involved. Next week, we'll ask why the same thing has proved so much harder to achieve with other diseases.", vi: "Người cuối cùng mắc đậu mùa tự nhiên là một đầu bếp bệnh viện ở Somalia, năm 1977. Ông đã hồi phục. Sau hai năm nữa không tìm thấy thêm ca nào ở bất cứ đâu, Tổ chức Y tế Thế giới chính thức tuyên bố, vào năm 1980, rằng thế giới đã sạch bệnh đậu mùa. Đến nay đó vẫn là bệnh duy nhất ở người từng bị thanh toán. Đó hẳn là một khoảnh khắc phi thường với hàng nghìn nhân viên y tế tham gia. Tuần sau, ta sẽ hỏi vì sao điều tương tự lại khó đạt được đến vậy với các bệnh khác." },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-nghe-ghi-chu",
        kind: "fill",
        title: "Questions 31–36 — Complete the notes. ONE WORD ONLY",
        items: [
          { q: "31. survivors: scarring and, often, ___", answers: ["blindness"] },
          { q: "32. China: material blown into the ___", answers: ["nose"] },
          { q: "33. treated people could ___ the disease", answers: ["spread"] },
          { q: "34. local belief: ___ were protected because they had already had cowpox", answers: ["milkmaids"] },
          { q: "35. idea tested on a boy whose father was Jenner's ___", answers: ["gardener"] },
          { q: "36. vaccinated patients were made fun of in ___ in the press", answers: ["cartoons"] },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-nghe-cau",
        kind: "fill",
        title: "Questions 37–40 — Complete the sentences. ONE WORD AND/OR A NUMBER",
        items: [
          { q: "37. On the Spanish expedition of 1803, the vaccine was kept alive by passing it between ___.", answers: ["orphans", "22 orphans"] },
          { q: "38. From the 1950s, vaccine could be kept in hot countries because it was produced as a ___.", answers: ["powder"] },
          { q: "39. In the strategy that finally succeeded, teams vaccinated the ___ of each infected person.", answers: ["contacts"] },
          { q: "40. The world was officially declared free of smallpox in ___.", answers: ["1980"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích 31–36 — câu trong băng và bẫy",
        items: [
          "**31 blindness** — “left with deep **scars**… and in a good many cases with **blindness** as well”. scarring đã in sẵn; often = in a good many cases. Cần danh từ song song với scarring ⇒ không viết blind.",
          "**32 nose** — “**In China** the method was rather different: dried material was ground up and blown into the **nose**”. “skin” thuộc Ấn Độ / Ottoman (dòng ghi chú phía trên) — bẫy nhầm nơi.",
          "**33 spread** — “people who had been variolated **could spread** smallpox to those around them”. treated people = people who had been variolated; tín hiệu nhấn: “more seriously for the community” (khớp chữ community trong ghi chú). “died” cũng được nhắc nhưng không hợp “could ___ the disease”.",
          "**34 milkmaids** — “It was common knowledge among **farmers**… that **milkmaids**… rarely caught smallpox”. farmers là người **tin**, milkmaids là người **được bảo vệ**. Số nhiều (… were protected). Thuật ngữ được giải thích ngay: the young women who milked the cows.",
          "**35 gardener** — “The boy **wasn't**, as is sometimes said, Jenner's own **son**; he was the son of his **gardener**”. Bẫy gạt – sửa điển hình; ghi chú đổi: whose father was Jenner's ___.",
          "**36 cartoons** — “the **newspapers** of the day printed **cartoons** in which vaccinated patients were shown growing horns and tails”. the press = newspapers; made fun of = shown growing horns and tails. doctors và religious leaders được nhắc trước nhưng không phải thứ ở “in the press”.",
        ],
      },
      {
        t: "note",
        title: "Giải thích 37–40 — câu trong băng và bẫy",
        items: [
          "**37 orphans** — “on board, **besides** the sailors and the doctors, were twenty-two **orphans**… material was passed to the next pair, and so on, arm to arm”. between ___ ⇒ số nhiều. sailors / doctors bị gạt bằng besides. “22 orphans” cũng đúng (một từ + một số).",
          "**38 powder** — “**liquid** vaccine was quickly ruined by heat. The **breakthrough** came… produce the vaccine as a freeze-dried **powder**”. a ___ ⇒ số ít. liquid là dạng cũ. hot countries = tropical countries / heat.",
          "**39 contacts** — “**At first**, the plan was to vaccinate **everybody**… **So the strategy changed. Instead of**… whole populations… vaccinating that person's **contacts**”. Nghe hai lần gạt (At first… / Instead of…). Số nhiều. family, neighbours là ví dụ của contacts — không viết.",
          "**40 1980** — “a hospital cook in Somalia, in **1977**… officially **declared**, in **1980**, that the world was free of smallpox”. Ba năm xuất hiện: 1967 (phát động), 1977 (ca cuối), 1980 (tuyên bố). Động từ của câu hỏi là declared ⇒ 1980.",
          "Đếm lại: **9 / 10** câu có nhiễu đứng trước đáp án (chỉ câu 31 không). Tín hiệu gạt: In China… rather different · more seriously · wasn't… he was · besides · The breakthrough · At first… Instead of.",
        ],
      },
      {
        t: "table",
        head: ["Đúng / 10", "Mức ước tính cho Part 4", "Việc cần làm"],
        rows: [
          ["9–10", "Band 8 trở lên", "Nghe lại không nhìn chữ; nhại theo (shadowing) đoạn 5 và đoạn 7 — chú ý should have been, could have been."],
          ["8", "Band 7 — đạt mục tiêu hôm nay", "Mở lời thoại, tô mọi tín hiệu lớp 3 (gạt – sửa); ghi câu sai vào Sổ lỗi theo loại bẫy."],
          ["6–7", "Band 6–6.5", "Nghe lần 2, dừng sau mỗi đoạn và nói lại ý chính bằng một câu tiếng Anh; rồi nghe lần 3 một mạch."],
          ["0–5", "Chưa vững", "Ôn Tập 3 Ngày 13 (Note completion) và Ngày 9 (bẫy đổi ý), rồi làm lại bài này sau 3 ngày."],
        ],
        caption: "Band ghi ở đây là ước tính cho riêng Part 4; band Listening thật tính trên 40 câu.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Từ vựng hữu ích từ bài giảng" },
      {
        t: "vocab",
        items: [
          { w: "eradicate", pos: "v", ipa: "/ɪˈrædɪkeɪt/", vi: "thanh toán, xoá sổ hoàn toàn (bệnh, vấn nạn)", ex: "Smallpox is the only human disease to have been eradicated.", exVi: "Đậu mùa là bệnh duy nhất ở người đã bị xoá sổ.", more: "**eradicate** a disease / poverty / corruption · eradication (n) · = wipe out (thân mật hơn)" },
          { w: "epidemic", pos: "n", ipa: "/ˌepɪˈdemɪk/", vi: "trận dịch", ex: "A single infected traveller could start an epidemic.", exVi: "Một người đi đường nhiễm bệnh có thể khơi mào một trận dịch.", more: "a flu **epidemic** · an **epidemic of** obesity (nghĩa bóng) · pandemic: đại dịch toàn cầu · an outbreak: đợt bùng phát" },
          { w: "expose", pos: "v", ipa: "/ɪkˈspəʊz/", vi: "cho tiếp xúc với, phơi nhiễm; phơi bày", ex: "Children who are exposed to tobacco smoke are more likely to develop asthma.", exVi: "Trẻ phơi nhiễm khói thuốc dễ bị hen hơn.", more: "be **exposed to** + N · exposure (n): **exposure to** pollution" },
          { w: "deliberately", pos: "adv", ipa: "/dɪˈlɪbərətli/", vi: "một cách cố ý", ex: "The company deliberately hid the results of the trial.", exVi: "Công ty cố ý giấu kết quả thử nghiệm.", more: "= on purpose, intentionally · ≠ accidentally · deliberate (adj): a **deliberate** decision" },
          { w: "hostile", pos: "adj", ipa: "/ˈhɒstaɪl/", vi: "thù địch, phản đối gay gắt", ex: "Many residents were hostile to the plan at first.", exVi: "Ban đầu nhiều cư dân phản đối kế hoạch gay gắt.", more: "be **hostile to / towards** + N · hostility (n) · openly **hostile**" },
          { w: "breakthrough", pos: "n", ipa: "/ˈbreɪkθruː/", vi: "bước đột phá", ex: "The discovery of antibiotics was a major medical breakthrough.", exVi: "Việc tìm ra kháng sinh là một đột phá y học lớn.", more: "a major / scientific **breakthrough in** + N · make / achieve a **breakthrough**" },
          { w: "isolate", pos: "v", ipa: "/ˈaɪsəleɪt/", vi: "cách ly; cô lập", ex: "Patients with the infection are isolated from other people on the ward.", exVi: "Bệnh nhân nhiễm bệnh được cách ly khỏi người khác trong buồng bệnh.", more: "**isolate** sb **from** · isolation (n): social **isolation** (Tập 3 Ngày 18) · isolated (adj)" },
          { w: "remote", pos: "adj", ipa: "/rɪˈməʊt/", vi: "hẻo lánh, xa xôi", ex: "Mobile clinics bring basic care to remote villages.", exVi: "Phòng khám lưu động đưa dịch vụ chăm sóc cơ bản tới các làng hẻo lánh.", more: "**remote** areas / regions / communities · **remote** working (làm việc từ xa) · remotely (adv)" },
        ],
      },
      {
        t: "note",
        title: "💡 Cách học sau bài",
        items: [
          "Mở lời thoại, bấm nghe **từng đoạn**, nói đuổi theo (shadowing) đoạn 5 (“You might think…”) và đoạn 7 (“Even with such efforts…”) — hai đoạn có should have been / had been / could have been.",
          "Che ghi chú, nghe lại cả bài và tự ghi **ghi chú của riêng bạn** bằng ký hiệu (→ ↑ ↓ ≠). So với trang ghi chú của đề: bạn bắt được mấy tiêu đề con?",
          "Tóm tắt bài giảng trong **bốn câu** tiếng Anh, dùng ít nhất ba từ ở mục 7 và một câu chẻ (What Jenner did was…).",
          "Sai phần này ở bài kiểm tra chặng (Ngày 12) ⇒ quay lại mục 2 và mục 3 của bài này.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t4d8-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 8 — AWL sublist 8 · hệ thống y tế · gia đình · thành ngữ tính cách · cột chồng / cột nhóm · Part 4 · âm yếu chuỗi",
    goal: "Ôn trọn Ngày 8: dùng đúng từ AWL sublist 8 và họ từ của chúng, từ vựng hệ thống y tế và gia đình hiện đại, thành ngữ tính cách đúng nguyên dạng và đúng văn phong; đọc ba tầng của một biểu đồ cột chồng, chọn câu overview và câu thân bài band 7; nghe đoạn cuối một bài giảng và điền câu; nhận ra chuỗi âm yếu; rồi viết một khổ thân bài Task 1.",
    minutes: 60,
    blocks: [
      {
        t: "recap",
        title: "Bài tập hôm nay (50 câu + 1 đoạn viết)",
        items: [
          "**I–IV (30 câu)** — từ vựng: AWL sublist 8, y tế + gia đình, thành ngữ, họ từ và cặp dễ nhầm.",
          "**V (5 câu)** — dịch Việt → Anh câu Task 2 về y tế – gia đình.",
          "**VI (6 câu)** — Task 1: đọc biểu đồ cột chồng, chọn overview, chọn câu đúng.",
          "**VII (5 câu)** — nghe: đoạn cuối một bài giảng, Sentence completion.",
          "**VIII (4 câu)** — âm yếu chuỗi.",
          "**IX** — viết một khổ thân bài Task 1 (80–100 từ), AI chấm. Mục tiêu cả bài: ≥ 40/50 (80 %).",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 8 trong một hình",
        center: "Chính xác: từ – số – âm",
        branches: [
          { label: "AWL 8", items: ["inevitable · widespread · thereby", "be accompanied by · conform to", "complement ≠ compliment"] },
          { label: "Y tế – gia đình", items: ["preventive healthcare · primary care", "out-of-pocket · referral · waiting list", "parental leave · birth rate"] },
          { label: "Thành ngữ (nói)", items: ["set in their ways", "the life and soul of the party", "see eye to eye"] },
          { label: "Cột chồng", items: ["tổng → thành phần → cơ cấu", "of which · accounted for", "the exception being…"] },
          { label: "Part 4", items: ["Note + Sentence", "chờ chỗ gạt – sửa", "shudəvbin = should have been"] },
        ],
      },

      { t: "h", text: "I. AWL sublist 8 — điền từ (10 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "note",
        title: "Hộp từ (mỗi từ dùng một lần; chia dạng nếu cần)",
        items: ["abandon · bias · clarify · exploit · induce · predominant · prospect · reinforce · restore · widespread"],
      },
      {
        t: "quiz",
        id: "t4d8-bt-awl",
        kind: "fill",
        title: "I. Điền từ trong hộp (đúng dạng)",
        items: [
          { q: "The council was forced to ___ its plan to close the hospital. (nguyên mẫu)", answers: ["abandon"] },
          { q: "There is ___ agreement that prevention is cheaper than cure.", answers: ["widespread"] },
          { q: "The study was criticised for its ___ towards younger patients.", answers: ["bias"] },
          { q: "The minister refused to ___ how the scheme would be funded.", answers: ["clarify"] },
          { q: "The ___ of losing their jobs makes many workers anxious.", answers: ["prospect"] },
          { q: "Stereotypes in advertising ___ outdated ideas about family roles. (hiện tại đơn, chủ ngữ số nhiều)", answers: ["reinforce"] },
          { q: "Long working hours can ___ stress-related illness.", answers: ["induce"] },
          { q: "Heart disease is the ___ cause of death among men over sixty.", answers: ["predominant"] },
          { q: "The operation ___ the patient's hearing. (quá khứ đơn)", answers: ["restored"] },
          { q: "Unscrupulous agencies ___ carers by paying them less than the legal minimum. (hiện tại đơn)", answers: ["exploit"] },
        ],
      },

      { t: "h", text: "II. Hệ thống y tế + gia đình (8 câu) — ôn bài Từ vựng mục 4–5" },
      {
        t: "quiz",
        id: "t4d8-bt-yte",
        kind: "fill",
        title: "II. Điền MỘT từ",
        items: [
          { q: "Most people first see a general ___ before being sent to a specialist.", answers: ["practitioner"] },
          { q: "Universal ___ means that treatment does not depend on a person's income.", answers: ["healthcare"] },
          { q: "Cancer ___ programmes aim to detect the disease before symptoms appear.", answers: ["screening"] },
          { q: "An early ___ of dementia allows families to plan for the future.", answers: ["diagnosis"] },
          { q: "The children were vaccinated ___ measles at the age of one. (giới từ)", answers: ["against"] },
          { q: "In dual-___ households, both partners go out to work.", answers: ["income"] },
          { q: "Workers with several ___ often cannot accept jobs far from home. (người phụ thuộc, số nhiều)", answers: ["dependants", "dependents"] },
          { q: "The ‘sandwich ___’ cares for children and ageing parents at the same time.", answers: ["generation"] },
        ],
      },

      { t: "h", text: "III. Thành ngữ tính cách — đúng nguyên dạng, đúng văn phong (6 câu) — ôn bài Từ vựng mục 6" },
      {
        t: "mcq",
        id: "t4d8-bt-idiom",
        title: "III. Chọn phương án đúng",
        items: [
          { q: "“My aunt would help anyone. She has ___.”", options: ["a golden heart", "a heart of gold", "the heart of gold", "a heart of the gold"], correct: 1, why: "Nguyên dạng: have a heart of gold." },
          { q: "“We met at a conference and ___ — we've been friends ever since.”", options: ["saw eye to eye on fire", "went the extra mile", "got on like a house on fire", "wore our hearts on our sleeves"], correct: 2, why: "get on like a house on fire = hợp nhau ngay và rất thân." },
          { q: "“I always sit in the same seat and order the same coffee. I'm ___.”", options: ["a creature of habit", "a creature of habits", "a creature of the habit", "the creature of habit"], correct: 0, why: "a creature of habit — habit số ít, không mạo từ." },
          { q: "Người bình tĩnh, sáng suốt cả khi gặp chuyện khó là người…", options: ["short-tempered", "thick-skinned", "laid-back", "level-headed"], correct: 3, why: "level-headed = bình tĩnh, sáng suốt. laid-back = thoải mái, không hay lo (không nói về sự sáng suốt)." },
          { q: "Câu nào KHÔNG nên viết trong bài Task 2?", options: ["Grandparents and teenagers often hold different views.", "Grandparents and teenagers rarely see eye to eye.", "Older people tend to be more resistant to change.", "Sociable employees usually work well in teams."], correct: 1, why: "see eye to eye là thành ngữ — văn nói. Task 2: hold different views / disagree." },
          { q: "“She's a real ___ — she set up her first business while still at university.”", options: ["people person", "creature of habit", "go-getter", "life and soul"], correct: 2, why: "a go-getter = người năng nổ, quyết đạt mục tiêu." },
        ],
      },

      { t: "h", text: "IV. Họ từ và cặp dễ nhầm (6 câu) — ôn bài Từ vựng mục 1–3" },
      {
        t: "quiz",
        id: "t4d8-bt-ho-tu",
        kind: "fill",
        title: "IV. Viết dạng đúng của từ trong ngoặc / chọn từ đúng",
        items: [
          { q: "The ___ (ambiguous) of the instructions led to several mistakes.", answers: ["ambiguity"] },
          { q: "As costs rise, cuts to services will ___ (inevitable, trạng từ) follow.", answers: ["inevitably"] },
          { q: "There is a clear ___ (contradict) between what the company says and what it does.", answers: ["contradiction"] },
          { q: "The two treatments are ___ (complement): each works better when used with the other.", answers: ["complementary"] },
          { q: "The patient spent three days in (intense / intensive) ___ care.", answers: ["intensive"] },
          { q: "The price of medicines shows sharp ___ (fluctuate, danh từ số nhiều) from year to year.", answers: ["fluctuations"] },
        ],
      },

      { t: "h", text: "V. Dịch Việt → Anh (5 câu)" },
      {
        t: "quiz",
        id: "t4d8-bt-dich",
        kind: "translate",
        title: "V. Dịch — dùng từ trong gợi ý",
        grammar: "Collocation Health / Family + AWL sublist 8",
        items: [
          { q: "Phát hiện sớm là then chốt để điều trị thành công.", answers: ["Early detection is crucial to successful treatment.", "Early detection is crucial for successful treatment.", "Early detection is crucial to the success of treatment.", "Early detection is crucial to treating the disease successfully."], hint: "Early detection · is crucial to · successful treatment" },
          { q: "Chính phủ nên phân bổ nhiều kinh phí hơn cho sức khoẻ tâm thần.", answers: ["The government should allocate more funding to mental health.", "Governments should allocate more funding to mental health.", "The government should allocate more funding to mental health services.", "The government should allocate more funds to mental health.", "The government should allocate more money to mental health."], hint: "allocate more funding to · mental health" },
          { q: "Chi phí trông trẻ cao là một lý do khiến tỉ lệ sinh giảm.", answers: ["The high cost of childcare is one reason for the falling birth rate.", "The high cost of childcare is one reason why the birth rate is falling.", "High childcare costs are one reason for the falling birth rate.", "The high cost of childcare is one reason for the declining birth rate.", "High childcare costs are one reason why the birth rate is falling.", "The high cost of childcare is a reason for the falling birth rate."], hint: "The high cost of childcare · one reason for · the falling birth rate" },
          { q: "Dân số già hoá tất yếu sẽ gây áp lực lên bệnh viện.", answers: ["An ageing population will inevitably put pressure on hospitals.", "An ageing population will inevitably place pressure on hospitals.", "An aging population will inevitably put pressure on hospitals.", "The ageing population will inevitably put pressure on hospitals.", "An ageing population will inevitably put pressure on the hospitals."], hint: "An ageing population · will inevitably · put pressure on" },
          { q: "Bệnh nhân không có bảo hiểm phải tự bỏ tiền túi trả cho việc điều trị.", answers: ["Patients without insurance have to pay for treatment out of pocket.", "Patients without insurance have to pay out of pocket for treatment.", "Patients without insurance must pay for treatment out of pocket.", "Patients without insurance have to pay for their treatment out of pocket.", "Patients without insurance have to pay for treatment out of their own pocket.", "Uninsured patients have to pay for treatment out of pocket.", "Patients without insurance must pay out of pocket for treatment."], hint: "Patients without insurance · pay for treatment · out of pocket" },
        ],
      },

      { t: "h", text: "VI. Task 1 — cột chồng (6 câu) — ôn bài Viết mục 2–5 · 9" },
      {
        t: "p",
        text: "**Biểu đồ:** The chart shows the number of people employed in the health sector of one country in 2005, 2015 and 2025, by type of work (thousands). Trong đề thật ba loại việc **chồng lên nhau** trong mỗi cột năm.",
      },
      {
        t: "table",
        head: ["Year", "Doctors", "Nurses", "Care workers", "Total"],
        rows: [
          ["2005", "60", "180", "60", "**300**"],
          ["2015", "70", "190", "140", "**400**"],
          ["2025", "80", "200", "270", "**550**"],
        ],
        caption: "Thousands of employees. Số liệu tự đặt cho bài luyện.",
      },
      {
        t: "mcq",
        id: "t4d8-bt-viet",
        title: "VI. Chọn phương án đúng",
        items: [
          { q: "Tầng 1 (tổng): câu nào đúng?", options: ["Total employment almost doubled, from 300,000 to 550,000.", "Total employment tripled between 2005 and 2025.", "Total employment remained stable over the period.", "Total employment was highest in 2015."], correct: 0, why: "300 → 550 = tăng 83 %, “almost doubled”. Không phải gấp ba; cao nhất là 2025." },
          { q: "Tầng 3 (cơ cấu): điểm nổi bật nhất là gì?", options: ["Doctors were always the largest group.", "The number of nurses fell.", "Care workers went from the joint-smallest group to the largest.", "All three groups grew at the same rate."], correct: 2, why: "Care workers 60 → 270: từ nhỏ nhất (bằng doctors) thành lớn nhất, vượt nurses (200) năm 2025. Đây là key feature." },
          { q: "Chọn câu overview band 7.", options: ["Overall, there were 300,000 employees in 2005 and 550,000 in 2025.", "Overall, employment in the sector rose considerably, driven largely by care workers, who replaced nurses as the largest group.", "Overall, the chart shows doctors, nurses and care workers in three years.", "In conclusion, I think more care workers are needed because the population is ageing."], correct: 1, why: "Hai ý (tổng + cơ cấu), không có số cụ thể. A chỉ đọc số; C lặp đề; D là ý kiến + giải thích nguyên nhân — không thuộc Task 1." },
          { q: "Nurses: 180 → 200 (nghìn), nhưng tỉ lệ trong tổng: 60 % → 36 %. Câu nào đúng?", options: ["The number of nurses fell from 60% to 36%.", "Nurses decreased sharply in number.", "The proportion of nurses rose slightly.", "Although the number of nurses rose slightly, their share of the total fell from 60% to just over a third."], correct: 3, why: "Số tuyệt đối tăng nhẹ nhưng tỉ lệ giảm — phải tách number và share. A lẫn number với %; B, C sai sự thật." },
          { q: "Chọn câu ĐÚNG ngữ pháp.", options: ["In 2025 the total stood at 550,000, of which 270,000 were care workers.", "In 2025 the total stood at 550,000, which of 270,000 were care workers.", "In 2025 the total comprised of 550,000 employees.", "Care workers accounted 270,000 of the total in 2025."], correct: 0, why: "tổng + , of which + số + V. comprise không có of; account FOR." },
          { q: "Cách nhóm nào hợp nhất cho thân bài?", options: ["Ba khổ: 2005 · 2015 · 2025, mỗi khổ kể ba con số", "Một khổ chứa cả chín con số", "Khổ 1: care workers (tăng vọt) + tổng · Khổ 2: doctors và nurses (tăng chậm, tỉ lệ giảm)", "Khổ 1: số chẵn · Khổ 2: số lẻ"], correct: 2, why: "Nhóm theo quy luật: thành phần tăng vọt ↔ hai thành phần tăng chậm. Kể theo năm = “recounts detail mechanically”." },
        ],
      },

      { t: "h", text: "VII. Nghe — đoạn cuối một bài giảng (5 câu) — ôn bài Nghe mục 2–3" },
      {
        t: "p",
        text: "Đọc năm câu trong 20 giây, đoán loại từ, rồi nghe **một lần**. **Complete the sentences below. Write ONE WORD ONLY for each answer.**",
      },
      {
        t: "listen",
        id: "t4d8-bt-nghe",
        title: "The Milbrook walking study",
        dan: { so: "Day 8, Homework recording", boiCanh: "the last part of a lecture on public health, in which the lecturer summarises a study.", cau: [1, 5] },
        note: "Khoảng 1 phút, giọng Anh (nữ). Nghiên cứu và tên thị trấn là hư cấu, soạn cho bài luyện. ONE WORD ONLY.",
        lines: [
          { who: "Lecturer", voice: "uk-nu", text: "So, to finish, let me summarise the reading for this week — the Milbrook walking study. Researchers followed just over four hundred residents of a small town for three years. Half of them were simply given leaflets about the benefits of exercise. The other half were invited to join a walking group led by a volunteer.", vi: "Vậy để kết thúc, tôi tóm tắt bài đọc tuần này — nghiên cứu đi bộ Milbrook. Các nhà nghiên cứu theo dõi hơn bốn trăm cư dân một thị trấn nhỏ trong ba năm. Một nửa chỉ được phát tờ rơi về lợi ích của tập thể dục. Nửa kia được mời tham gia một nhóm đi bộ do tình nguyện viên dẫn." },
          { who: "Lecturer", voice: "uk-nu", text: "Now, you might expect the difference to show up in people's weight. In fact, weight hardly changed in either group. What did change was blood pressure, which fell significantly among the walkers. The researchers were also interested in why people kept coming. It wasn't the exercise itself, apparently; most participants said the main attraction was the company.", vi: "Bạn có thể nghĩ khác biệt sẽ hiện ra ở cân nặng. Thực tế, cân nặng hầu như không đổi ở cả hai nhóm. Thứ thay đổi là huyết áp, giảm đáng kể ở nhóm đi bộ. Các nhà nghiên cứu cũng muốn biết vì sao người ta tiếp tục tham gia. Có vẻ không phải vì bản thân việc tập; đa số nói điều hấp dẫn chính là có người đồng hành." },
          { who: "Lecturer", voice: "uk-nu", text: "The scheme was cheap, too: the only real expense was the training given to the volunteers. One weakness you should note is that almost all the participants were retired, so we can't assume the results would apply to people of working age. For next week, please read chapter six.", vi: "Chương trình cũng rẻ: khoản chi đáng kể duy nhất là việc tập huấn cho tình nguyện viên. Một điểm yếu các bạn nên lưu ý là gần như mọi người tham gia đều đã nghỉ hưu, nên ta không thể cho rằng kết quả áp dụng được cho người trong độ tuổi lao động. Tuần sau, các bạn đọc chương sáu." },
        ],
      },
      {
        t: "quiz",
        id: "t4d8-bt-nghe-dien",
        kind: "fill",
        title: "VII. Questions 1–5 — ONE WORD ONLY",
        items: [
          { q: "1. One group in the study received only ___ about exercise.", answers: ["leaflets"] },
          { q: "2. The clearest improvement among the walkers was in their blood ___.", answers: ["pressure"] },
          { q: "3. Most people kept attending because they enjoyed the ___.", answers: ["company"] },
          { q: "4. The main cost of the scheme was the ___ of volunteers.", answers: ["training"] },
          { q: "5. A limitation of the study is that nearly all those taking part were ___.", answers: ["retired"] },
        ],
      },
      {
        t: "note",
        title: "Giải thích phần nghe",
        items: [
          "**1 leaflets** — “Half of them were simply given **leaflets** about the benefits of exercise”. received only = were simply given. Số nhiều.",
          "**2 pressure** — “you might expect… **weight**. In fact, weight hardly changed… **What did change was** blood **pressure**”. Gạt – sửa + câu chẻ có do nhấn mạnh (Ngày 7): đáp án ngay sau What did change was.",
          "**3 company** — “**It wasn't** the exercise itself…; most participants said the main attraction was the **company**”. exercise bị gạt bằng câu chẻ phủ định.",
          "**4 training** — “the only real expense was the **training** given to the volunteers”. main cost = the only real expense; câu hỏi đổi given to → of.",
          "**5 retired** — “almost all the participants were **retired**”. limitation = weakness; nearly all = almost all. “working age” là nhóm KHÔNG được nghiên cứu.",
        ],
      },

      { t: "h", text: "VIII. Âm yếu chuỗi (4 câu) — ôn bài Nghe mục 4" },
      {
        t: "mcq",
        id: "t4d8-bt-am-yeu",
        title: "VIII. Chọn phương án đúng",
        items: [
          { q: "Trong “The warning should have been taken seriously”, chữ have đọc là:", options: ["/hæv/", "/heɪv/", "/əv/", "/hɑːv/"], correct: 2, why: "Sau modal, have đọc yếu /əv/ (rơi /h/), nghe như of." },
          { q: "Bạn nghe “It /kʊdntəvbɪn/ easy.” Câu viết đúng là:", options: ["It couldn't of been easy.", "It couldn't have been easy.", "It couldn't been easy.", "It couldn't have being easy."], correct: 1, why: "couldn't have been: /əv/ = have, /bɪn/ = been." },
          { q: "Trong “Many lives could have been saved”, từ được nhấn là:", options: ["could", "have", "been", "lives và saved"], correct: 3, why: "Từ nội dung (danh từ, động từ chính) được nhấn; chuỗi could have been đọc yếu /kəd əv bɪn/." },
          { q: "“It /məstəvbɪn/ a shock.” Người nói muốn nói:", options: ["Chắc hẳn đó đã là một cú sốc.", "Đó phải là một cú sốc (bắt buộc).", "Đó sẽ là một cú sốc.", "Đó không phải là một cú sốc."], correct: 0, why: "must have been = suy đoán chắc chắn về quá khứ (Tập 3 Ngày 19)." },
        ],
      },

      { t: "h", text: "IX. Viết một khổ thân bài Task 1 (80–100 từ) — AI chấm" },
      {
        t: "p",
        text: "Dùng **bảng số liệu ở phần VI** (nhân viên ngành y tế 2005–2025). Mở bài và overview đã cho sẵn — bạn chỉ viết **một khổ thân bài** về **care workers và tổng số**. Cho sẵn: “The chart shows how many people worked in the health sector of one country in three years, divided into doctors, nurses and care workers. Overall, employment in the sector rose considerably, driven largely by care workers, who replaced nurses as the largest group.”",
      },
      {
        t: "essay",
        id: "t4d8-bt-viet-doan",
        task: "Task 1",
        prompt: "Write ONE body paragraph (80–100 words) about the total number of employees and the number of care workers. Data (thousands): 2005 — doctors 60, nurses 180, care workers 60, total 300. 2015 — doctors 70, nurses 190, care workers 140, total 400. 2025 — doctors 80, nurses 200, care workers 270, total 550. The introduction and overview are already written: 'The chart shows how many people worked in the health sector of one country in three years, divided into doctors, nurses and care workers. Overall, employment in the sector rose considerably, driven largely by care workers, who replaced nurses as the largest group.'",
        minWords: 80,
        tips: [
          "Câu 1: tổng — stood at 300,000 in 2005 and almost doubled to 550,000 by 2025.",
          "Câu 2: care workers — more than quadrupled, from 60,000 to 270,000 (hoặc: rose more than fourfold).",
          "Câu 3: mở thành phần bằng of which / with + N + V-ing: …, of which care workers accounted for nearly half.",
          "Một câu so tỉ lệ: from a fifth of the workforce to almost half.",
          "Có thời gian ⇒ quá khứ đơn cho 2005 – 2015; 2025 coi như số đã có (đề không nói là dự báo). Không giải thích nguyên nhân.",
        ],
      },
      {
        t: "note",
        title: "💡 Chấm xong thì làm gì",
        items: [
          "Sai ≥ 3 câu ở phần I hoặc IV ⇒ che nghĩa nhóm AWL tương ứng (bài Từ vựng mục 1–3) và tự kiểm lại; chép cặp dễ nhầm vào Sổ lỗi.",
          "Sai ≥ 2 câu ở phần III ⇒ chép lại 16 thành ngữ, gạch dưới mạo từ và giới từ của từng cái.",
          "Sai ≥ 2 câu ở phần VI ⇒ đọc lại “3 tầng” (bài Viết mục 2) và bảng số tuyệt đối – tỉ lệ (mục 4).",
          "Sai ≥ 2 câu ở phần VII ⇒ mở lời thoại, tô các chỗ gạt – sửa (In fact · What did change was · It wasn't…).",
          "Bài kiểm tra chặng Ngày 12 sẽ hỏi lại AWL sublist 8, cột chồng và Part 4 hai dạng.",
        ],
      },
    ],
  },
];
