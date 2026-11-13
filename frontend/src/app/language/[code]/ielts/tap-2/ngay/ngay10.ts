/**
 * Tập 2 · Ngày 10 — Từ vựng: AWL sublist 2 (phần 1: 30 họ achieve → injure) + ngôn ngữ xu hướng vòng 2
 * [VB2 VC05] · Đọc: Multiple choice một đáp án [R10] · Viết: Advantages / disadvantages essay (+ “outweigh”)
 * [W05] · Bài tập. 🔊 (đề cương không ghi âm cho N10) — chọn /ɜː/ – /ɔː/ trong từ học thuật và từ Task 1
 * (research, occur, survey · source, form, fall).
 *
 * Soạn 12/11/2026 theo docs/ielts-lo-trinh-0-8.md mục 3.2 (hàng N10). AWL sublist 2 có 60 họ từ (Coxhead
 * 2000) — Ngày 10 dạy 30 họ đầu theo thứ tự chữ cái (achieve … injure), Ngày 14 dạy 30 họ còn lại
 * (institute … transfer). Ngôn ngữ xu hướng vòng 2 KHÔNG lặp từ Tập 1 Ngày 11 (rise, fall, peak, fluctuate,
 * level off, recover, overtake…) mà thêm: cụm danh từ (a sharp rise in), mức độ (significant, moderate,
 * marginal), surge / plateau / bottom out / triple / stand at, xấp xỉ số.
 * Bài đọc về điệu nhảy của ong mật chỉ dùng hiểu biết phổ biến (von Frisch, Nobel 1973, “round dance” /
 * “waggle dance”, tranh luận thập niên 1960, thí nghiệm theo dõi bằng radar) và viết chung chung ở chỗ không
 * chắc. Số liệu biểu đồ tự đặt.
 */
import type { Lesson } from '../data';

/* ─────────────────────────── Từ vựng ─────────────────────────── */

const T2D10_TU_VUNG: Lesson = {
  id: "t2d10-tu-vung",
  kind: "vocab",
  title: "Từ vựng: AWL sublist 2 (phần 1) + ngôn ngữ xu hướng vòng 2",
  goal: "Nhận ra và dùng đúng 30 họ từ học thuật đầu của AWL sublist 2 (achieve, affect, aspect, conduct, consume, impact…) kèm dạng từ và collocation, cùng 14 từ / cụm tả xu hướng mức 2 (a sharp rise in, significantly, plateau, surge, triple, stand at…) — đẩy Lexical Resource của Writing lên band 5–6 và hiểu bài đọc học thuật nhanh hơn.",
  minutes: 75,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**AWL** (Academic Word List) = 570 họ từ hay gặp nhất trong văn bản học thuật, chia 10 nhóm (sublist). Sublist 1 học ở Ngày 2 và 4; hôm nay **sublist 2, 30 họ đầu** (achieve → injure).",
        "Học **cả họ từ**, không học một từ: consume → **consumer · consumption** · affect (v) ≠ **effect** (n) · conclude → **conclusion · conclusive**.",
        "Mỗi họ có **collocation** dùng được ngay trong Task 2: **conduct research · have an impact on · achieve a goal · every aspect of life**.",
        "**Ngôn ngữ xu hướng vòng 2** (Tập 1 Ngày 11 đã có rise / fall / peak): thêm ==There was a sharp rise in…== · ==rose significantly / marginally== · ==surge · plateau · triple · stand at==.",
        "Đẩy **LR** của Writing: band 5 = “đủ dùng nhưng hạn chế”; dùng đúng 5–8 từ AWL mỗi bài là bước lên band 6.",
        "Thêm (mục 2b): **bội số / phân số** (increase fourfold, three times as many as, a quarter of the figure for) và **tả trọn một đường trong một câu** (started at…, after which…, before ending at… · with a subsequent + N).",
      ],
    },
    {
      t: "p",
      text: "Từ AWL **không phải từ khó** — phần lớn bạn đã gặp (design, culture, focus, final). Cái khó là dùng **đúng dạng** (consume / consumption / consumer) và **đúng cụm** (have an impact **on**, not ~~impact to~~). Mỗi từ dưới đây có **câu mẫu kiểu Task 2** và dòng ➕ gồm họ từ + collocation. Từ nào đã gặp ở Tập 1 (design, element, evaluate, focus…) thì học **thêm dạng từ** mới.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ví dụ một họ từ: consume",
      center: "**consume** (v) tiêu thụ",
      branches: [
        { label: "consumer (n)", items: ["người tiêu dùng", "consumer goods · consumer behaviour"] },
        { label: "consumption (n, U)", items: ["sự tiêu thụ", "energy / water consumption"] },
        { label: "consumerism (n)", items: ["chủ nghĩa tiêu dùng (Ngày 16)"] },
        { label: "time-consuming (adj)", items: ["tốn thời gian", "a time-consuming process"] },
      ],
      caption: "Học một họ = bốn cách viết lại cùng một ý: “People consume more energy.” → “Energy consumption has risen.” → “Consumers use more energy.”",
    },

    { t: "h", text: "1. AWL sublist 2 — 30 họ từ (achieve → injure)" },
    {
      t: "vocab",
      items: [
        { w: "achieve", pos: "v", ipa: "/əˈtʃiːv/", vi: "đạt được", ex: "Students need clear goals to achieve good results.", exVi: "Học sinh cần mục tiêu rõ ràng để đạt kết quả tốt.", more: "**achievement** (n) · **achievable** (adj). Cụm: **achieve a goal / success / a target**." },
        { w: "acquire", pos: "v", ipa: "/əˈkwaɪə(r)/", vi: "tiếp thu, có được", ex: "Children acquire languages more easily than adults.", exVi: "Trẻ em tiếp thu ngôn ngữ dễ hơn người lớn.", more: "**acquisition** (n). Cụm: **acquire skills / knowledge / a language**." },
        { w: "administration", pos: "n", ipa: "/ədˌmɪnɪˈstreɪʃn/", vi: "công tác quản lý hành chính; chính quyền", ex: "Hospitals spend a lot of money on administration.", exVi: "Bệnh viện chi nhiều tiền cho công việc hành chính.", more: "**administer** (v) · **administrative** (adj) · **administrator** (n)." },
        { w: "affect", pos: "v", ipa: "/əˈfekt/", vi: "ảnh hưởng đến", ex: "Air pollution affects the health of millions of people.", exVi: "Ô nhiễm không khí ảnh hưởng đến sức khoẻ hàng triệu người.", more: "⚠️ **affect** là **động từ**, **effect** là **danh từ**: have an **effect on** = **affect**. ~~affect to~~ sai (không giới từ)." },
        { w: "appropriate", pos: "adj", ipa: "/əˈprəʊpriət/", vi: "phù hợp, thích đáng", ex: "Schools should teach children appropriate ways to use the internet.", exVi: "Trường học nên dạy trẻ cách dùng internet phù hợp.", more: "**inappropriate** · **appropriately**. Cụm: **appropriate for** sb / **to** sth." },
        { w: "aspect", pos: "n", ipa: "/ˈæspekt/", vi: "khía cạnh", ex: "Technology has changed almost every aspect of our lives.", exVi: "Công nghệ đã thay đổi gần như mọi khía cạnh cuộc sống.", more: "Cụm: **every / an important / a negative aspect of** sth." },
        { w: "assist", pos: "v", ipa: "/əˈsɪst/", vi: "hỗ trợ, giúp đỡ", ex: "Volunteers assist elderly people with their shopping.", exVi: "Tình nguyện viên giúp người già đi mua sắm.", more: "**assistance** (n, U) · **assistant** (n). Cụm: **assist sb with / in + V-ing**." },
        { w: "category", pos: "n", ipa: "/ˈkætəɡəri/", vi: "hạng mục, loại", ex: "The products fall into three main categories.", exVi: "Các sản phẩm chia thành ba loại chính.", more: "**categorise** (v). Cụm: **fall into a category**. Task 1: “in **every category**”." },
        { w: "chapter", pos: "n", ipa: "/ˈtʃæptə(r)/", vi: "chương (sách); giai đoạn", ex: "Moving abroad began a new chapter in her life.", exVi: "Chuyển ra nước ngoài mở ra một chương mới trong đời cô ấy." },
        { w: "commission", pos: "n, v", ipa: "/kəˈmɪʃn/", vi: "uỷ ban; uỷ thác (làm một việc)", ex: "The government commissioned a study on traffic safety.", exVi: "Chính phủ đặt làm một nghiên cứu về an toàn giao thông.", more: "Cụm: **commission a report / a study** · **a government commission** · tiền hoa hồng (**earn commission**)." },
        { w: "community", pos: "n", ipa: "/kəˈmjuːnəti/", vi: "cộng đồng", ex: "Local libraries play an important role in the community.", exVi: "Thư viện địa phương đóng vai trò quan trọng trong cộng đồng.", more: "Cụm: **the local community · community service · a sense of community**." },
        { w: "complex", pos: "adj", ipa: "/ˈkɒmpleks/", vi: "phức tạp", ex: "Climate change is a complex problem with no simple solution.", exVi: "Biến đổi khí hậu là vấn đề phức tạp không có lời giải đơn giản.", more: "**complexity** (n). Gần nghĩa: complicated." },
        { w: "computing", pos: "n", ipa: "/kəmˈpjuːtɪŋ/", vi: "tin học, điện toán", ex: "Basic computing skills are essential for most jobs.", exVi: "Kỹ năng tin học cơ bản là thiết yếu cho hầu hết công việc.", more: "Họ **compute**: computer · computation · **computerised**." },
        { w: "conclude", pos: "v", ipa: "/kənˈkluːd/", vi: "kết luận", ex: "The researchers concluded that sleep improves memory.", exVi: "Các nhà nghiên cứu kết luận rằng giấc ngủ cải thiện trí nhớ.", more: "**conclusion** (n): **In conclusion,** · **reach a conclusion** · **conclusive** (adj: dứt khoát)." },
        { w: "conduct", pos: "v", ipa: "/kənˈdʌkt/", vi: "tiến hành", ex: "The university conducted a survey of 2,000 students.", exVi: "Trường đại học đã tiến hành khảo sát 2.000 sinh viên.", more: "Cụm: **conduct research / a survey / an experiment**. Danh từ **conduct** /ˈkɒndʌkt/ = hạnh kiểm (nhấn âm đầu)." },
        { w: "consequence", pos: "n", ipa: "/ˈkɒnsɪkwəns/", vi: "hậu quả", ex: "Deforestation has serious consequences for wildlife.", exVi: "Phá rừng gây hậu quả nghiêm trọng cho động vật hoang dã.", more: "**consequently** (adv) = vì thế · **as a consequence (of)**." },
        { w: "construct", pos: "v", ipa: "/kənˈstrʌkt/", vi: "xây dựng", ex: "The city plans to construct a new bridge.", exVi: "Thành phố dự định xây một cây cầu mới.", more: "**construction** (n): **under construction** · **constructive** (adj: mang tính xây dựng — constructive feedback)." },
        { w: "consume", pos: "v", ipa: "/kənˈsjuːm/", vi: "tiêu thụ", ex: "Air conditioners consume a lot of electricity.", exVi: "Máy lạnh tiêu thụ rất nhiều điện.", more: "**consumer** · **consumption** · **time-consuming** (xem sơ đồ trên)." },
        { w: "credit", pos: "n", ipa: "/ˈkredɪt/", vi: "tín dụng; công nhận, ghi công", ex: "Many young people get into debt with credit cards.", exVi: "Nhiều người trẻ mắc nợ vì thẻ tín dụng.", more: "Cụm: **credit card · on credit** (mua chịu) · **take / get credit for** sth (được ghi công)." },
        { w: "culture", pos: "n", ipa: "/ˈkʌltʃə(r)/", vi: "văn hoá", ex: "Travelling helps young people understand other cultures.", exVi: "Du lịch giúp người trẻ hiểu các nền văn hoá khác.", more: "**cultural** (adj) · **culturally** · **multicultural**. Cụm: **cultural differences / heritage**." },
        { w: "design", pos: "v, n", ipa: "/dɪˈzaɪn/", vi: "thiết kế", ex: "The building was designed to save energy.", exVi: "Toà nhà được thiết kế để tiết kiệm năng lượng.", more: "**designer** (n). Cụm: **be designed to + V** · **be designed for** sb." },
        { w: "distinct", pos: "adj", ipa: "/dɪˈstɪŋkt/", vi: "khác biệt rõ; rõ ràng", ex: "There is a distinct difference between the two groups.", exVi: "Có sự khác biệt rõ giữa hai nhóm.", more: "**distinction** (n) · **distinctive** (adj: đặc trưng — a distinctive accent)." },
        { w: "element", pos: "n", ipa: "/ˈelɪmənt/", vi: "yếu tố, thành phần", ex: "Trust is a key element of any good relationship.", exVi: "Niềm tin là yếu tố then chốt của mọi mối quan hệ tốt.", more: "Cụm: **a key / an essential element of** sth." },
        { w: "equate", pos: "v", ipa: "/iˈkweɪt/", vi: "đánh đồng, coi như nhau", ex: "Many people equate success with money.", exVi: "Nhiều người đánh đồng thành công với tiền bạc.", more: "**equate A with B** · **equation** (n: phương trình; **part of the equation** = một yếu tố của vấn đề)." },
        { w: "evaluate", pos: "v", ipa: "/ɪˈvæljueɪt/", vi: "đánh giá", ex: "Teachers should evaluate students in more than one way.", exVi: "Giáo viên nên đánh giá học sinh bằng nhiều hơn một cách.", more: "**evaluation** (n). Gần nghĩa: assess." },
        { w: "feature", pos: "n, v", ipa: "/ˈfiːtʃə(r)/", vi: "đặc điểm; có / làm nổi bật", ex: "The most striking feature of the graph is the sharp fall in 2020.", exVi: "Đặc điểm nổi bật nhất của biểu đồ là cú giảm mạnh năm 2020.", more: "Task 1: **the main features** (đề luôn viết “reporting the main features”)." },
        { w: "final", pos: "adj", ipa: "/ˈfaɪnl/", vi: "cuối cùng", ex: "The final decision should be made by parents.", exVi: "Quyết định cuối cùng nên do cha mẹ đưa ra.", more: "**finally** (adv) · **finalise** (v: hoàn tất)." },
        { w: "focus", pos: "v, n", ipa: "/ˈfəʊkəs/", vi: "tập trung; trọng tâm", ex: "Schools focus too much on exams.", exVi: "Trường học tập trung quá nhiều vào thi cử.", more: "**focus on** sth · **the focus of** sth. ~~focus in~~ sai." },
        { w: "impact", pos: "n", ipa: "/ˈɪmpækt/", vi: "tác động", ex: "Social media has a huge impact on young people.", exVi: "Mạng xã hội có tác động rất lớn đến người trẻ.", more: "Cụm: **have an impact on** · **a positive / negative impact**. ~~impact to~~ sai." },
        { w: "injure", pos: "v", ipa: "/ˈɪndʒə(r)/", vi: "làm bị thương", ex: "Three people were injured in the accident.", exVi: "Ba người bị thương trong vụ tai nạn.", more: "**injury** (n) · **injured** (adj). Thường dùng bị động: **be injured**." },
      ],
    },
    {
      t: "note",
      title: "Cặp hay nhầm trong nhóm từ hôm nay",
      items: [
        "**affect (v)** ≠ **effect (n)**: Smoking **affects** health. = Smoking **has an effect on** health. ~~Smoking effects health~~ sai.",
        "**consume / consumption / consumer**: ~~The consume of energy~~ → The **consumption** of energy · ~~consumptions~~ (không đếm được).",
        "**conclude / conclusion**: ~~In conclude,~~ → **In conclusion,**",
        "**impact on** · **focus on** · **affect** (không giới từ): ~~affect to students~~ → **affect students**.",
        "**achieve** đi với goal / target / success — không đi với “money”: ~~achieve money~~ → **earn** money.",
      ],
    },
    {
      t: "rule",
      formula: "affect (v) = have an effect on (n) · have an impact on · focus on · conduct research · achieve a goal · every aspect of",
      vi: "Collocation AWL dùng được ngay trong Task 2 — sai giới từ là lỗi LR dễ thấy nhất.",
    },

    { t: "h", text: "2. Ngôn ngữ xu hướng vòng 2 — cho Task 1" },
    {
      t: "p",
      text: "Tập 1 Ngày 11 dạy **động từ** (rise, fall, peak…). Band 5–6 cần thêm **hai thứ**: (1) viết cùng ý bằng **cụm danh từ** — “There was a sharp rise in…” — để câu đa dạng; (2) **mức độ** chính xác hơn “a lot / a little”. Thêm vài động từ mạnh (surge, plateau, triple) và cách **làm tròn số**.",
    },
    {
      t: "table",
      caption: "Hai cách viết cùng một ý",
      head: ["Động từ + trạng từ", "There was + a / an + tính từ + danh từ + in", "Mức độ"],
      rows: [
        ["Sales **rose sharply**.", "There was **a sharp rise in** sales.", "mạnh, đột ngột"],
        ["Prices **increased significantly**.", "There was **a significant increase in** prices.", "đáng kể"],
        ["Use **fell moderately**.", "There was **a moderate fall in** use.", "vừa phải"],
        ["The number **dropped marginally**.", "There was **a marginal drop in** the number.", "rất ít (gần như không đổi)"],
        ["The figure **grew steadily**.", "There was **steady growth in** the figure.", "đều đặn"],
        ["Membership **declined gradually**.", "There was **a gradual decline in** membership.", "từ từ"],
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "dramatic(ally)", pos: "adj (adv)", ipa: "/drəˈmætɪk/", vi: "mạnh, ngoạn mục", ex: "There was a dramatic rise in online sales in 2020.", exVi: "Doanh số trực tuyến tăng vọt năm 2020.", more: "Mạnh nhất trong thang mức độ — dùng khi đường dốc đứng." },
        { w: "significant(ly)", pos: "adj (adv)", ipa: "/sɪɡˈnɪfɪkənt/", vi: "đáng kể", ex: "The number of tourists increased significantly.", exVi: "Số du khách tăng đáng kể.", more: "Danh từ **significance**. Đồng nghĩa: considerable / considerably." },
        { w: "moderate(ly)", pos: "adj (adv)", ipa: "/ˈmɒdərət/", vi: "vừa phải", ex: "Bus use fell moderately over the decade.", exVi: "Lượng đi xe buýt giảm vừa phải trong thập kỷ." },
        { w: "marginal(ly)", pos: "adj (adv)", ipa: "/ˈmɑːdʒɪnl/", vi: "rất nhỏ, không đáng kể", ex: "The figure rose marginally, from 20% to 21%.", exVi: "Số liệu tăng rất ít, từ 20% lên 21%.", more: "≈ slightly, nhưng học thuật hơn." },
        { w: "steady / steadily", pos: "adj / adv", ipa: "/ˈstedi/ · /ˈstedɪli/", vi: "đều đặn", ex: "Car ownership grew steadily between 2000 and 2020.", exVi: "Sở hữu ô tô tăng đều từ 2000 đến 2020." },
        { w: "gradual(ly)", pos: "adj (adv)", ipa: "/ˈɡrædʒuəl/", vi: "từ từ, dần dần", ex: "There was a gradual decline in cinema visits.", exVi: "Số lượt đi rạp giảm dần." },
        { w: "surge", pos: "v, n", ipa: "/sɜːdʒ/", vi: "tăng vọt (bất ngờ, trong thời gian ngắn)", ex: "Demand for bicycles surged in 2020.", exVi: "Nhu cầu xe đạp tăng vọt năm 2020.", more: "**a surge in** sth. Khác **rocket / soar** (Tập 1): surge nhấn **đột ngột**." },
        { w: "plateau", pos: "v, n", ipa: "/ˈplætəʊ/", vi: "chững lại (sau khi tăng), đi ngang", ex: "After years of growth, sales plateaued at around 5 million.", exVi: "Sau nhiều năm tăng, doanh số chững lại quanh 5 triệu.", more: "**reach a plateau**. Gần nghĩa level off (Tập 1)." },
        { w: "bottom out", pos: "phr v", ipa: "/ˌbɒtəm ˈaʊt/", vi: "chạm đáy (rồi thôi giảm)", ex: "Prices bottomed out in 2015 and then began to recover.", exVi: "Giá chạm đáy năm 2015 rồi bắt đầu hồi phục.", more: "Đối lập: **peak** (đạt đỉnh)." },
        { w: "triple", pos: "v", ipa: "/ˈtrɪpl/", vi: "tăng gấp ba", ex: "The number of electric cars tripled in five years.", exVi: "Số ô tô điện tăng gấp ba trong năm năm.", more: "double (gấp đôi) · **triple** · **quadruple** (gấp bốn) · halve (giảm một nửa). Danh từ: **a threefold increase**." },
        { w: "stand at", pos: "phr v", ipa: "/ˈstænd æt/", vi: "ở mức (số liệu tại một thời điểm)", ex: "In 2000, the figure stood at 12%.", exVi: "Năm 2000, số liệu ở mức 12%.", more: "Quá khứ: **stood at**. Câu mở đoạn thân bài rất hay dùng." },
        { w: "approximately", pos: "adv", ipa: "/əˈprɒksɪmətli/", vi: "xấp xỉ, khoảng", ex: "Approximately 40% of students lived at home.", exVi: "Khoảng 40% sinh viên sống ở nhà.", more: "Đồng nghĩa: **around · about · roughly**. Kèm: just over / just under / nearly (Ngày 8)." },
        { w: "majority", pos: "n", ipa: "/məˈdʒɒrəti/", vi: "phần lớn, đa số", ex: "The majority of commuters travelled by car.", exVi: "Phần lớn người đi làm đi bằng ô tô.", more: "**the vast majority (of)** · đối lập **minority** /maɪˈnɒrəti/." },
        { w: "remainder", pos: "n", ipa: "/rɪˈmeɪndə(r)/", vi: "phần còn lại", ex: "60% went by bus, and the remainder walked.", exVi: "60% đi xe buýt, phần còn lại đi bộ.", more: "Dùng nhiều ở biểu đồ tròn (Ngày 12): **the remaining 40%**." },
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Thang mức độ — từ mạnh đến nhẹ",
      steps: [
        { label: "dramatically · sharply", sub: "rất mạnh, dốc đứng" },
        { label: "significantly · considerably", sub: "đáng kể" },
        { label: "moderately", sub: "vừa phải" },
        { label: "slightly", sub: "ít" },
        { label: "marginally", sub: "rất ít — gần như không đổi" },
      ],
      caption: "Chọn mức độ theo ĐỘ DỐC thật của đường, không chọn từ nghe “hay”. 20% → 21% mà viết “rose dramatically” là sai TA.",
    },
    {
      t: "rule",
      formula: "S + rose / fell + sharply / significantly / marginally = There was a + sharp / significant / marginal + rise / fall + in + N",
      vi: "Một câu động từ, câu sau đổi sang cụm danh từ — câu đa dạng hơn, đúng tiêu chí GRA và LR.",
    },
    {
      t: "figure",
      fig: {
        kind: "line",
        title: "Number of international students in one country (thousands), 2000–2020",
        note: "Số liệu tự đặt cho bài luyện.",
        unit: "thousand students",
        categories: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "University students", values: [20, 22, 45, 60, 61] },
          { name: "Language-school students", values: [35, 28, 18, 18, 30] },
        ],
      },
    },
    {
      t: "quiz",
      id: "t2d10-xu-huong-dien",
      title: "Điền MỘT từ — đọc biểu đồ trên (8 câu)",
      kind: "fill",
      items: [
        { q: "(1) In 2000, the number of university students ___ at 20,000. (ở mức — quá khứ)", answers: ["stood"] },
        { q: "(2) Between 2005 and 2010, there was a ___ rise in university students, from 22,000 to 45,000. (mạnh)", answers: ["sharp", "dramatic", "significant", "considerable", "steep", "rapid", "substantial", "marked", "big", "huge"] },
        { q: "(3) From 2015 to 2020, the figure rose only ___, from 60,000 to 61,000. (rất ít, trạng từ)", answers: ["marginally", "slightly"] },
        { q: "(4) In other words, university numbers ___ at around 60,000 after 2015. (chững lại — quá khứ)", answers: ["plateaued", "stabilised", "stabilized", "remained", "stayed"] },
        { q: "(5) Language-school students fell from 35,000 to 18,000 and then ___ out between 2010 and 2015. (chạm đáy)", answers: ["bottomed"] },
        { q: "(6) There was a ___ in language-school students in the final five years, to 30,000. (tăng vọt — danh từ)", answers: ["surge", "rise", "jump", "recovery", "rebound", "growth"] },
        { q: "(7) Over the whole period, the number of university students ___. (gấp ba — quá khứ; 20 → 61)", answers: ["tripled", "trebled"] },
        { q: "(8) In 2000, the ___ of international students were at language schools. (đa số — 35 trên 55)", answers: ["majority"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải",
      items: [
        "**(1) stood** — stand at → **stood at** (quá khứ). **(2) sharp / dramatic** — 22 → 45 trong 5 năm (gấp đôi): dốc nhất của đường.",
        "**(3) marginally** — 60 → 61 = tăng 1.000, gần như không đổi. **(4) plateaued** — sau 2015 đi ngang.",
        "**(5) bottomed** out — 18 → 18 (2010–2015) là đáy, rồi tăng. **(6) surge** — 18 → 30 trong năm năm cuối.",
        "**(7) tripled** — 20 × 3 = 60 ≈ 61 ✓. **(8) majority** — 35 / (35 + 20) ≈ 64% → phần lớn.",
      ],
    },

    { t: "h", text: "2b. Bội số, phân số + tả trọn một đường trong một câu" },
    {
      t: "p",
      text: "Khi một số tăng **rất lớn** (gấp 4, gấp 8), viết “increased dramatically” là chưa chính xác bằng nói thẳng **gấp mấy lần**. Ngược lại, khi so một số **nhỏ** với một số đã nêu, dùng **phân số** (a quarter of…) gọn hơn viết lại cả con số.",
    },
    {
      t: "table",
      caption: "Bội số & phân số — đủ dùng cho Task 1",
      head: ["Ý", "Cách viết", "Ví dụ (số tự đặt)"],
      rows: [
        ["Tăng gấp N lần (động từ)", "double · triple · quadruple · **increase fourfold / fivefold** · **rise more than eightfold**", "Online sales **increased fourfold**, from 5 to 20 million."],
        ["Gấp N lần (danh từ)", "**a twofold / threefold / fourfold increase in** + N", "There was **a fourfold increase in** online sales."],
        ["A gấp N lần B", "A had **three times as many** + N đếm được **as** B · A was **three times as high as** B", "Japan had **three times as many** tourists **as** Korea."],
        ["Một phần của số đã nêu", "**a fifth of that amount** · **a quarter of the figure for** B · **half the figure for** B", "Bus use stood at 40%, while cycling was **a quarter of that figure** (10%)."],
      ],
    },
    {
      t: "note",
      title: "Cẩn thận với bội số và từ “mạnh”",
      items: [
        "**Tính lại trước khi viết**: 5 → 20 là gấp **4** (fourfold), không phải “increased by four times” mơ hồ. 20 → 61 ≈ gấp 3 → triple. Sai phép tính là sai Task Achievement.",
        "**the figure for** + nhóm: “a quarter of **the figure for** buses” — không viết ~~a quarter of buses~~ (nghĩa thành “một phần tư số xe buýt”).",
        "**soar / plummet / rocket** chỉ dùng khi **chắc chắn** đường dốc đứng. Task 1 ưu tiên **increase / decrease + sharply / significantly** — từ chắc đúng an toàn hơn từ “kêu” mà sai mức.",
      ],
    },
    {
      t: "table",
      caption: "Tả trọn một đường trong MỘT câu — 3 khung (số theo biểu đồ du học sinh ở trên)",
      head: ["Khung", "Ví dụ"],
      rows: [
        ["**started at** A, **after which** it rose / fell to B, **before ending at** C", "The number of language-school students **started at** 35,000 in 2000, **after which** it fell to 18,000 in 2010, **before ending at** 30,000 in 2020."],
        ["rose / fell to B, **with a subsequent** + danh từ (rise / fall / surge / plateau)", "University numbers rose sharply to 60,000 in 2015, **with a subsequent plateau** at around 60,000."],
        ["rose / fell…, **reaching** B in…, **before** + V-ing…", "University numbers rose rapidly after 2005, **reaching** 60,000 in 2015, **before** levelling off at around 61,000."],
      ],
    },
    {
      t: "rule",
      formula: "S + started at A, after which it rose to B, before ending at C · S + rose to B, with a subsequent + N",
      vi: "Một câu kể cả chặng đường (đầu – giữa – cuối) thay cho ba câu đơn rời — vừa gọn vừa ăn điểm GRA.",
    },
    {
      t: "quiz",
      id: "t2d10-tu-vung-cau-noi",
      title: "Dịch — bội số, phân số, câu nối cả chặng (4 câu, theo biểu đồ du học sinh)",
      kind: "translate",
      grammar: "triple / increase threefold · half the figure for · started at…, after which…, before ending at… · with a subsequent + N",
      items: [
        { q: "Số sinh viên đại học tăng gấp ba trong cả giai đoạn.", hint: "The number of university students, tripled / increased threefold, over the period", answers: ["The number of university students tripled over the period.", "The number of university students increased threefold over the period.", "The number of university students trebled over the period.", "The number of university students tripled over the whole period.", "The number of university students rose threefold over the period.", "Over the period, the number of university students tripled."] },
        { q: "Năm 2020, số học viên trường ngôn ngữ chỉ bằng khoảng một nửa con số của sinh viên đại học.", hint: "In 2020, the number of language-school students, was only about half the figure for university students", answers: ["In 2020, the number of language-school students was only about half the figure for university students.", "In 2020, the number of language-school students was only around half the figure for university students.", "In 2020, the number of language-school students was about half the figure for university students.", "In 2020 the number of language-school students was only about half the figure for university students.", "In 2020, the number of language-school students was only about half that of university students."] },
        { q: "Số học viên trường ngôn ngữ bắt đầu ở mức 35.000, sau đó giảm xuống 18.000 năm 2010, trước khi kết thúc ở mức 30.000.", hint: "started at 35,000, after which it fell to 18,000 in 2010, before ending at 30,000", answers: ["The number of language-school students started at 35,000, after which it fell to 18,000 in 2010, before ending at 30,000.", "The number of language-school students started at 35,000, after which it dropped to 18,000 in 2010, before ending at 30,000.", "The number of language-school students started at 35,000, after which it decreased to 18,000 in 2010, before ending at 30,000.", "The number of language-school students started at 35,000, after which it fell to 18,000 in 2010 before ending at 30,000.", "The number of language school students started at 35,000, after which it fell to 18,000 in 2010, before ending at 30,000."] },
        { q: "Số học viên trường ngôn ngữ giảm xuống 18.000 vào năm 2010, sau đó là một đợt tăng vọt lên 30.000.", hint: "fell to 18,000 by / in 2010, with a subsequent surge to 30,000", answers: ["The number of language-school students fell to 18,000 in 2010, with a subsequent surge to 30,000.", "The number of language-school students fell to 18,000 by 2010, with a subsequent surge to 30,000.", "The number of language-school students dropped to 18,000 in 2010, with a subsequent surge to 30,000.", "The number of language-school students decreased to 18,000 in 2010, with a subsequent surge to 30,000.", "The number of language school students fell to 18,000 in 2010, with a subsequent surge to 30,000."] },
      ],
    },

    { t: "h", text: "3. Phát âm: /ɜː/ và /ɔː/" },
    {
      t: "table",
      head: ["Âm", "Cách đặt miệng", "Từ AWL & Task 1", "Hay đọc nhầm"],
      rows: [
        ["**/ɜː/** research", "Miệng **dẹt, hơi mở**, lưỡi ở giữa, môi **không tròn**; kéo dài (kiểu Anh: không cong lưỡi)", "research · survey (n) · occur · emerge · third · worse · first · earn", "/ơ/ ngắn, hoặc thành /ɔː/: “ri-xooc”"],
        ["**/ɔː/** source", "Môi **tròn, chu ra**, lưỡi lùi sau; kéo dài", "source · form · fall · report · ignore · order · quarter", "/o/ ngắn: “xót”, “phom”"],
      ],
    },
    {
      t: "phatam",
      id: "t2d10-phat-am",
      title: "Luyện phát âm — /ɜː/ và /ɔː/",
      note: "Bấm “Nghe mẫu”, rồi “Đọc & chấm”. /ɜː/ môi dẹt, không tròn; /ɔː/ môi tròn, chu ra. Cả hai đều DÀI. Phiên âm Anh-Anh: không cong lưỡi cho /r/.",
      items: [
        { text: "research, survey, occur", ipa: "rɪsɜːtʃ sɜːveɪ əkɜː", vi: "/ɜː/" },
        { text: "third, worse, emerge", ipa: "θɜːd wɜːs ɪmɜːdʒ", vi: "/ɜː/" },
        { text: "source, form, fall", ipa: "sɔːs fɔːm fɔːl", vi: "/ɔː/" },
        { text: "work, walk · firm, form", ipa: "wɜːk wɔːk fɜːm fɔːm", vi: "cặp tối thiểu /ɜː/ – /ɔː/" },
        { text: "The survey was conducted in the third quarter.", ipa: "ðə sɜːveɪ wəz kəndʌktɪd ɪn ðə θɜːd kwɔːtə", vi: "survey · third · quarter" },
        { text: "Sales fell to a quarter of the total.", ipa: "seɪlz fel tu ə kwɔːtər əv ðə təʊtl", vi: "quarter /ɔː/" },
        { text: "Research shows the problem is getting worse.", ipa: "rɪsɜːtʃ ʃəʊz ðə prɒbləm ɪz ɡetɪŋ wɜːs", vi: "research · worse" },
        { text: "The report focuses on four sources of energy.", ipa: "ðə rɪpɔːt fəʊkəsɪz ɒn fɔː sɔːsɪz əv enədʒi", vi: "report · four · sources" },
      ],
    },

    { t: "h", text: "4. Luyện tập" },
    {
      t: "mcq",
      id: "t2d10-awl-chon",
      title: "Chọn từ đúng (8 câu)",
      items: [
        { q: "(1) Social media can ___ teenagers' sleep.", options: ["effect", "affect", "affection"], correct: 1, why: "Cần **động từ**: **affect**. effect là danh từ." },
        { q: "(2) The government should ___ a study into the causes of the problem.", options: ["commission", "consume", "equate"], correct: 0, why: "**commission a study** = đặt làm / uỷ thác nghiên cứu." },
        { q: "(3) Energy ___ has risen sharply in hot countries.", options: ["consumer", "consume", "consumption"], correct: 2, why: "Sau **Energy** cần **danh từ chỉ sự tiêu thụ**: consumption. consumer = người tiêu dùng." },
        { q: "(4) The scientists ___ an experiment with 500 volunteers.", options: ["conducted", "achieved", "acquired"], correct: 0, why: "**conduct an experiment**." },
        { q: "(5) Many people wrongly ___ happiness with wealth.", options: ["evaluate", "equate", "focus"], correct: 1, why: "**equate A with B** = đánh đồng A với B." },
        { q: "(6) This decision will have a serious ___ on small businesses.", options: ["impact", "affect", "aspect"], correct: 0, why: "**have an impact on**." },
        { q: "(7) Children ___ new skills very quickly through play.", options: ["construct", "assist", "acquire"], correct: 2, why: "**acquire skills** = tiếp thu kỹ năng." },
        { q: "(8) Learning to cook is an important ___ of independent living.", options: ["chapter", "element", "credit"], correct: 1, why: "**an important element of** = một yếu tố quan trọng của." },
      ],
    },
    {
      t: "quiz",
      id: "t2d10-awl-dich",
      title: "Dịch sang tiếng Anh — câu Task 2 với từ AWL (5 câu)",
      kind: "translate",
      grammar: "have an impact on · affect · conduct a survey · achieve a goal · every aspect of",
      items: [
        { q: "Điện thoại thông minh có tác động lớn đến người trẻ.", hint: "Smartphones, have a huge / big / great impact on, young people", answers: ["Smartphones have a huge impact on young people.", "Smartphones have a big impact on young people.", "Smartphones have a great impact on young people.", "Smartphones have a major impact on young people.", "Smartphones have a significant impact on young people.", "Smartphones have a strong impact on young people.", "Smartphones have a large impact on young people."] },
        { q: "Ô nhiễm không khí ảnh hưởng đến sức khoẻ của trẻ em.", hint: "Air pollution, affects, children's health / the health of children", answers: ["Air pollution affects children's health.", "Air pollution affects the health of children.", "Air pollution has an effect on children's health.", "Air pollution has an impact on children's health.", "Air pollution affects children's health"] },
        { q: "Trường đã tiến hành một cuộc khảo sát với 500 sinh viên.", hint: "The school / university, conducted a survey of / with, 500 students", answers: ["The school conducted a survey of 500 students.", "The university conducted a survey of 500 students.", "The school conducted a survey with 500 students.", "The university conducted a survey with 500 students.", "The school carried out a survey of 500 students.", "The university carried out a survey of 500 students.", "The school did a survey of 500 students.", "The school conducted a survey among 500 students.", "The university conducted a survey among 500 students."] },
        { q: "Để đạt được mục tiêu, bạn cần một kế hoạch rõ ràng.", hint: "To achieve your goal(s), you need, a clear plan", answers: ["To achieve your goal, you need a clear plan.", "To achieve your goals, you need a clear plan.", "To achieve a goal, you need a clear plan.", "You need a clear plan to achieve your goal.", "You need a clear plan to achieve your goals.", "In order to achieve your goal, you need a clear plan.", "In order to achieve your goals, you need a clear plan.", "To reach your goal, you need a clear plan.", "To reach your goals, you need a clear plan.", "To achieve the goal, you need a clear plan."] },
        { q: "Công nghệ đã thay đổi mọi khía cạnh của cuộc sống.", hint: "Technology, has changed, every aspect of (our) life / lives", answers: ["Technology has changed every aspect of life.", "Technology has changed every aspect of our lives.", "Technology has changed every aspect of our life.", "Technology has changed every aspect of people's lives.", "Technology has changed all aspects of life.", "Technology has changed all aspects of our lives."] },
      ],
    },
  ],
};

/* ─────────────────────────── Đọc ─────────────────────────── */

const T2D10_DOC: Lesson = {
  id: "t2d10-doc",
  kind: "reading",
  title: "Đọc: Multiple choice một đáp án",
  goal: "Làm đúng câu trắc nghiệm một đáp án (A–D) của Reading bằng cách nhận ra 4 loại câu hỏi (chi tiết · ý chính · mục đích · từ quy chiếu), tìm đúng vị trí, rồi loại 3 phương án nhiễu (nhắc trong bài nhưng sai ý · đúng nhưng không trả lời câu hỏi · quá tuyệt đối) — đích ≥ 8/11 câu, mức Passage 2 band 5.",
  minutes: 60,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "**Multiple choice (một đáp án)**: câu hỏi hoặc câu dở dang + **4 phương án A–D**, chỉ **một** đúng. Câu hỏi **đi theo thứ tự** bài (trừ câu hỏi ý chính cả bài — thường để cuối).",
        "Bốn loại câu hỏi: ==chi tiết== (According to…, What…?) · ==ý chính / mục đích== (The writer's main purpose in paragraph B is to…) · ==từ quy chiếu== (“it” in line… refers to) · ==ý chính cả bài== (best title).",
        "Bẫy: cả **4 phương án đều có chữ trong bài**. Ba cái sai vì: **nói ngược / sai chi tiết**, **đúng sự thật nhưng không trả lời câu hỏi**, hoặc **quá tuyệt đối** (always, only, all).",
        "Cách làm: đọc **câu hỏi** (chưa đọc phương án) → tìm vị trí → hiểu câu trong bài → **mới** đọc 4 phương án và loại dần.",
        "Đẩy **Reading band 5**: MCQ là dạng tốn thời gian nhất — làm có phương pháp thì không bị mất 3–4 phút mỗi câu.",
      ],
    },

    { t: "h", text: "1. Bốn loại câu hỏi trắc nghiệm" },
    {
      t: "table",
      head: ["Loại", "Câu hỏi trông thế nào", "Tìm đáp án ở đâu"],
      rows: [
        ["**Chi tiết**", "According to the writer, what…? · Von Frisch discovered that…", "**1–2 câu** trong bài, tìm bằng tên / số / từ khoá"],
        ["**Mục đích / ý chính của đoạn**", "What is the main purpose of paragraph C? · In paragraph D, the writer…", "**Câu chủ đề** (thường câu đầu) + hướng đi của cả đoạn"],
        ["**Từ quy chiếu**", "The word “this” in paragraph B refers to…", "**Câu ngay trước** từ đó — this / it / they thay cho danh từ gần nhất có nghĩa hợp"],
        ["**Ý chính cả bài / tiêu đề**", "Which is the best title for the passage?", "Câu đầu và cuối của mỗi đoạn; loại tiêu đề **chỉ đúng một đoạn**"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Năm bước làm trắc nghiệm",
      steps: [
        { label: "Đọc câu hỏi, CHƯA đọc phương án", sub: "gạch từ khoá; xác định loại câu hỏi" },
        { label: "Tìm vị trí", sub: "theo thứ tự; dò tên, số, từ đồng nghĩa" },
        { label: "Đọc kỹ 2–3 câu quanh đó", sub: "tự trả lời bằng lời của mình" },
        { label: "Đọc 4 phương án, loại dần", sub: "gạch cái sai chi tiết · không trả lời câu hỏi · quá tuyệt đối" },
        { label: "Chọn cái còn lại, chuyển câu", sub: "không chắc giữa 2 cái → chọn cái **paraphrase** đúng bài, không chọn cái **trùng chữ**" },
      ],
      caption: "Đọc phương án TRƯỚC khi hiểu bài là cách nhanh nhất để bị bẫy: cả bốn phương án đều được viết cho có vẻ đúng.",
    },
    {
      t: "table",
      caption: "Ba loại phương án nhiễu",
      head: ["Loại nhiễu", "Ví dụ (bài: “Bees mainly use the dance to share the location of food. Water is sometimes shared too.”)", "Vì sao sai"],
      rows: [
        ["**Sai chi tiết / ngược ý**", "Bees use the dance **mainly to find water**.", "Bài: mainly **food**; water chỉ **sometimes**."],
        ["**Đúng nhưng không trả lời câu hỏi**", "Câu hỏi: “What is the **main** purpose of the dance?” — Phương án: “Bees **sometimes** share information about water.”", "Đúng với bài, nhưng **không phải mục đích chính**."],
        ["**Quá tuyệt đối**", "Bees **only** dance about food.", "Bài có nói **water** → “only” sai. Cẩn thận: **always, only, all, never, completely**."],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở trắc nghiệm",
      items: [
        "Chọn phương án có **nhiều chữ trùng** với bài nhất. Đáp án đúng thường **paraphrase**; phương án trùng chữ thường là **bẫy**.",
        "Chọn một câu **đúng ngoài đời** (kiến thức chung) mà bài không nói — như TFNG Tập 1 Ngày 12: **chỉ bài đọc là căn cứ**.",
        "Đọc **hết 4 phương án trước**, rồi mới quay lại bài → đầu óc bị “mồi” bởi phương án sai.",
        "Mất 4–5 phút cho một câu khó. Quy tắc: **quá 2 phút → chọn tạm, đánh dấu, đi tiếp**; quay lại nếu còn giờ.",
      ],
    },
    {
      t: "rule",
      formula: "Câu hỏi → vị trí → tự trả lời → mới đọc A–D → loại: sai chi tiết · đúng nhưng lạc câu hỏi · quá tuyệt đối",
      vi: "Đáp án đúng thường là PARAPHRASE của bài, không phải câu trùng chữ.",
    },
    {
      t: "examples",
      items: [
        { en: "Many people believe that goldfish have a memory of only three seconds. However, experiments have shown that goldfish can remember simple tasks, such as pushing a lever to get food, for several months.", vi: "Nhiều người tin rằng cá vàng chỉ có trí nhớ ba giây. Tuy nhiên, thí nghiệm cho thấy cá vàng có thể nhớ những việc đơn giản, như đẩy cần gạt để có thức ăn, trong vài tháng." },
      ],
    },
    {
      t: "mcq",
      id: "t2d10-doc-thu",
      title: "Làm thử — đoạn về cá vàng (2 câu)",
      items: [
        { q: "(a) What does the writer say about goldfish?", options: ["A They can only remember things for three seconds.", "B They are able to remember some tasks for months.", "C They remember everything they learn.", "D They cannot learn to use a lever."], correct: 1, why: "“can remember simple tasks… for **several months**” → B (paraphrase: **are able to** = can). A là **niềm tin sai** được bài bác bỏ (bẫy trùng chữ “three seconds”). C quá tuyệt đối (**everything**). D ngược ý." },
        { q: "(b) The word “However” is used to…", options: ["A add another example.", "B give a reason.", "C introduce a contrasting fact.", "D summarise the paragraph."], correct: 2, why: "**However** giới thiệu thông tin **trái ngược** với niềm tin phổ biến ở câu trước." },
      ],
    },

    {
      t: "h",
      text: "Thêm: gạch từ khoá PHÂN BIỆT giữa các phương án",
    },
    {
      t: "p",
      text: "Ở bước 4, đừng gạch cả bốn phương án. Bốn phương án thường **giống nhau một nửa** (cùng chủ ngữ, cùng động từ) và chỉ **khác nhau ở một cụm** — cụm đó mới là thứ bạn phải kiểm trong bài. Gạch **phần khác nhau**, bỏ qua **phần chung**.",
    },
    {
      t: "table",
      caption: "Ví dụ: phần chung (bỏ qua) và phần phân biệt (gạch)",
      head: ["Phương án", "Phần chung", "Phần phân biệt — kiểm cái này"],
      rows: [
        ["A The city built the tunnel **to reduce flooding**.", "The city built the tunnel", "**reduce flooding**"],
        ["B The city built the tunnel **to attract tourists**.", "(như trên)", "**attract tourists**"],
        ["C The city built the tunnel **to shorten journeys to the airport**.", "(như trên)", "**shorten journeys / airport**"],
        ["D The city built the tunnel **to replace an old bridge**.", "(như trên)", "**replace / old bridge**"],
      ],
    },
    {
      t: "note",
      title: "Hai trường hợp đặc biệt",
      items: [
        "**Câu “Which of the following is true / NOT mentioned?”** không có từ định vị trong câu hỏi. Đừng đọc lại cả bài một lượt: lấy **cụm phân biệt của từng phương án** làm từ khoá, kiểm **lần lượt A → D** như bốn câu TFNG nhỏ. Câu này thường nằm cuối nhóm — làm sau các câu có vị trí rõ.",
        "**Câu hỏi có tên / số / năm** (According to Dr Lee…, In 1985…) — dò mỏ neo đó trước, rồi mới so phần phân biệt.",
        "Dạng **chọn TWO / THREE đáp án** trong năm–bảy phương án (Choose TWO letters, A–E) có ở Reading, cách làm tương tự nhưng mỗi phương án là một câu đúng/sai riêng — sẽ học ở **Tập 3**.",
      ],
    },
    {
      t: "mcq",
      id: "t2d10-doc-phan-biet",
      title: "Phần nào là từ khoá PHÂN BIỆT cần gạch? (4 câu)",
      items: [
        { q: "(1) A Farmers in the region grew rice. · B Farmers in the region grew coffee. · C Farmers in the region grew tea. — Gạch gì?", options: ["Farmers in the region", "grew", "rice / coffee / tea"], correct: 2, why: "“Farmers in the region grew” **giống nhau** ở cả ba phương án — kiểm nó không loại được gì. Chỉ **cây trồng** là khác → dò rice / coffee / tea trong bài." },
        { q: "(2) A The study lasted two years. · B The study involved two schools. · C The study was paid for by two companies. — Gạch gì?", options: ["The study · two", "lasted · involved · paid for by", "years · schools · companies"], correct: 2, why: "“two” xuất hiện ở cả ba — **bẫy số trùng**. Thứ khác nhau là **years / schools / companies** (kèm động từ). Bài có thể có chữ “two” ở cả ba chỗ — phải kiểm **hai cái gì**." },
        { q: "(3) Câu hỏi: “Which of the following is TRUE about the new library?” — Bạn làm gì trước?", options: ["Đọc lại cả bài từ đầu để tìm chữ “library”", "Lấy cụm phân biệt của từng phương án, kiểm lần lượt A → D", "Chọn phương án dài nhất"], correct: 1, why: "Không có từ định vị riêng → mỗi phương án là **một câu đúng/sai nhỏ**. Kiểm lần lượt bằng cụm phân biệt của nó; phương án nào bài **nói ngược** hoặc **không nói** thì gạch." },
        { q: "(4) A Most visitors came by train. · B Most visitors came by car. · C Most visitors came in summer. — Phương án C khác A, B ở đâu?", options: ["C hỏi về phương tiện", "C hỏi về thời điểm, không phải phương tiện", "C giống hệt A"], correct: 1, why: "A, B phân biệt nhau ở **phương tiện** (train / car); C đổi hẳn sang **thời điểm** (summer). Khi dò, bạn cần tìm **hai loại** thông tin: phương tiện và mùa." },
      ],
    },

    { t: "h", text: "2. Bài đọc luyện tập — Questions 1–11" },
    {
      t: "p",
      text: "Bài đọc soạn riêng cho khoá, **6 đoạn A–F** (khoảng 580 từ), thể loại **khoa học tự nhiên** — cách ong mật “nói chuyện” bằng điệu nhảy. Làm trong **22 phút**: đọc lướt 2 phút, rồi làm câu 1–11 theo 5 bước — đủ cả **4 loại câu hỏi** ở mục 1.",
    },
    {
      t: "passage",
      title: "The dance language of honeybees",
      intro: "Bài đọc 6 đoạn (A–F). Questions 1–11 ở ngay bên dưới.",
      paras: [
        { label: "A", text: "A single colony of honeybees may contain tens of thousands of workers, but only some of them leave the hive to collect food. These foragers face a difficult task: flowers appear and disappear throughout the season, and a good source of nectar may be several kilometres away. For a long time, nobody understood how a colony managed to send so many bees to the right place so quickly. The answer, it turned out, was that bees tell each other where to go — not with sounds, but with movement." },
        { label: "B", text: "The first person to explain this system in detail was the Austrian scientist Karl von Frisch. Working with glass-sided hives that allowed him to watch the bees inside, he noticed that a forager returning with food often performed a strange series of movements on the surface of the honeycomb. Other bees gathered around the dancer, followed her closely, and soon afterwards left the hive themselves. Von Frisch spent decades studying these dances, and in 1973 he shared the Nobel Prize in Physiology or Medicine for his work on animal behaviour." },
        { label: "C", text: "Von Frisch identified two main types of dance. When food is very close to the hive, the forager performs a “round dance”, running in small circles first one way and then the other. This tells the other bees that food is nearby, but not exactly where. When the food is further away, the bee performs a “waggle dance” instead. She runs forward in a straight line while shaking her body from side to side, then circles back to her starting point and repeats the run, tracing a shape like the number eight." },
        { label: "D", text: "The straight part of the waggle dance contains the key information. Its direction shows the direction of the food: because the dance takes place in the darkness of the hive, on a vertical surface, the bees use “straight up” to represent the direction of the sun. If the food lies 40 degrees to the right of the sun, the dancer runs 40 degrees to the right of vertical. The length of the run carries a second message: the longer the waggle run lasts, the further away the food is. Dancers also carry the scent of the flowers they have visited, which helps the new recruits to recognise the right plants when they arrive." },
        { label: "E", text: "Not everyone accepted these ideas. In the 1960s, a group of American researchers argued that the bees which followed a dancer found the food mainly by smell, and that the dance itself carried little useful information. The debate continued for years. It was largely settled by later experiments, including studies in which recruited bees were followed by radar as they left the hive. These showed that the bees first flew in the direction indicated by the dance and only began to search more widely when they were close to the target. Most scientists now agree that both the dance and smell play a part." },
        { label: "F", text: "Today, the dance language is not only a subject of research in itself; it has also become a useful research tool. By filming dances and decoding them, scientists can produce maps of where a colony is finding its food without following a single bee. Such maps have revealed, for example, that bees living in cities sometimes travel shorter distances than those in farmland, possibly because gardens offer a wider variety of flowers throughout the year. Information of this kind could help planners decide where to plant the flowers that bees most need." },
      ],
    },
    {
      t: "p",
      text: "**Questions 1–11.** Choose the correct letter, **A, B, C or D**. Câu 1–8 đi theo thứ tự bài; câu 9–10 hỏi **từ quy chiếu** (đề thật xếp chúng theo thứ tự bài như mọi câu khác — ở đây gom lại sau câu 8 để luyện riêng một loại); câu 11 hỏi **tiêu đề cả bài** (luôn để cuối).",
    },
    {
      t: "mcq",
      id: "t2d10-doc-chon",
      title: "Questions 1–11 — Multiple choice",
      items: [
        { q: "1. According to paragraph A, what did people fail to understand for a long time?", options: ["A why only some bees leave the hive to collect food", "B how bees produce sounds to communicate", "C why flowers grow so far from hives", "D how a colony directs its foragers to food so quickly"], correct: 3, why: "“For a long time, **nobody understood how a colony managed to send so many bees to the right place so quickly**” → D (paraphrase: send… to the right place = directs… to food). A là sự thật bài nêu nhưng không phải điều “không ai hiểu”; B ngược (“**not with sounds**”); C không có." },
        { q: "2. What made it possible for von Frisch to observe the dances?", options: ["A He used hives with glass walls.", "B He trained bees to visit his laboratory.", "C He studied bees outside the hive at night.", "D He followed the foragers to the flowers."], correct: 0, why: "“glass-sided hives **that allowed him to watch** the bees inside” → **glass walls** (glass-sided ↔ with glass walls). Các phương án khác không có." },
        { q: "3. According to paragraph B, the bees that watched a dancer", options: ["A tried to stop her from leaving.", "B left the hive shortly afterwards.", "C began dancing themselves immediately.", "D took food from her."], correct: 1, why: "“followed her closely, and **soon afterwards left the hive** themselves” → **shortly afterwards** = soon afterwards." },
        { q: "4. A bee performs a round dance when", options: ["A she has found a very large amount of food.", "B she wants to show the exact position of food.", "C the food is close to the hive.", "D the sun cannot be seen."], correct: 2, why: "“When food is **very close to the hive**, the forager performs a ‘round dance’”. B sai: round dance cho biết food is nearby, “**but not exactly where**”." },
        { q: "5. In the waggle dance, the direction of the straight run shows", options: ["A where the food is in relation to the sun.", "B how far the food is from the hive.", "C how much food is available.", "D which flowers the bee has visited."], correct: 0, why: "“Its **direction** shows the direction of the food… bees use ‘straight up’ to represent **the direction of the sun**”. B là thông tin của **độ dài** đường chạy (bẫy); D là nhờ **mùi hương**." },
        { q: "6. What did the American researchers in the 1960s believe?", options: ["A Bees could not see the dance in the dark.", "B The dance was more important than smell.", "C Bees did not dance at all.", "D Bees found food mainly through smell rather than the dance."], correct: 3, why: "“found the food **mainly by smell**, and… the dance itself **carried little useful information**” → D. B ngược ý; C quá tuyệt đối (họ không nói ong không nhảy)." },
        { q: "7. The radar experiments showed that recruited bees", options: ["A ignored the information in the dance.", "B searched widely as soon as they left the hive.", "C first followed the direction given by the dance.", "D found the food faster than the dancers."], correct: 2, why: "“the bees **first flew in the direction indicated by the dance** and **only** began to search more widely when they were close” → C. B ngược thứ tự." },
        { q: "8. What is the writer's main point in paragraph F?", options: ["A Decoding dances can tell scientists where bees find food.", "B City bees are healthier than farmland bees.", "C Planners should stop building in farmland.", "D Filming bees is more difficult than following them."], correct: 0, why: "Câu chủ đề: dance language đã thành **công cụ nghiên cứu** — “By filming dances and decoding them, scientists can produce **maps of where a colony is finding its food**”. B không có (bài nói **quãng đường**, không nói sức khoẻ); C, D không có." },
        { q: "9. In paragraph C, the word “This” in “This tells the other bees that food is nearby” refers to", options: ["A the waggle dance.", "B the round dance.", "C the food near the hive.", "D the shape of the number eight."], correct: 1, why: "Từ quy chiếu → nhìn **câu ngay trước**: “the forager performs a **‘round dance’**, running in small circles…”. Chính điệu nhảy đó “cho các con khác biết” thức ăn ở gần. A (waggle dance) và D xuất hiện **sau** chữ This; C sai nghĩa — thức ăn không “tells” được." },
        { q: "10. In paragraph E, the word “These” in “These showed that the bees first flew…” refers to", options: ["A the American researchers.", "B the recruited bees.", "C the later experiments, including the radar studies.", "D the dances."], correct: 2, why: "Câu trước: “It was largely settled by **later experiments, including studies in which recruited bees were followed by radar**”. Cái **cho thấy** (showed) kết quả là **các thí nghiệm**. Bẫy B: “bees” là danh từ **gần nhất**, nhưng ong không “showed that the bees first flew…” — luôn **thay thử** vào câu để kiểm nghĩa." },
        { q: "11. Which is the best title for the whole passage?", options: ["A Why bees are disappearing from cities", "B The life and work of Karl von Frisch", "C Smell versus sight in the insect world", "D How honeybees share information through dance — and why it matters"], correct: 3, why: "Tiêu đề phải **bao trùm cả 6 đoạn**: ong truyền tin bằng điệu nhảy (A–D), tranh luận (E), ứng dụng nghiên cứu (F) → D. B chỉ đúng **đoạn B**; C chỉ là **một phần** đoạn E; A không có (đoạn F chỉ nói ong thành phố bay **quãng ngắn hơn**)." },
      ],
    },
    {
      t: "table",
      caption: "Nhìn lại 11 câu — loại câu hỏi và kiểu bẫy",
      head: ["Câu", "Loại câu hỏi", "Đáp án", "Bẫy chính"],
      rows: [
        ["1", "Chi tiết (điều chưa ai hiểu)", "D", "A là sự thật trong bài nhưng không trả lời câu hỏi; B ngược (not with sounds)"],
        ["2", "Chi tiết", "A", "—"],
        ["3", "Chi tiết", "B", "C (dancing) — bài nói **left the hive**, không nói nhảy"],
        ["4", "Chi tiết", "C", "B ngược: round dance **không** chỉ chính xác"],
        ["5", "Chi tiết", "A", "B là thông tin của **độ dài**, không phải **hướng**"],
        ["6", "Chi tiết (quan điểm người khác)", "D", "B ngược ý; C quá tuyệt đối"],
        ["7", "Chi tiết", "C", "B đảo thứ tự “first… only when…”"],
        ["8", "Ý chính của đoạn", "A", "B lấy chi tiết ví dụ rồi đổi nghĩa"],
        ["9", "Từ quy chiếu", "B", "A, D đứng SAU chữ This; C sai nghĩa"],
        ["10", "Từ quy chiếu", "C", "B là danh từ gần nhất nhưng thay vào thì sai nghĩa"],
        ["11", "Ý chính cả bài (best title)", "D", "B, C chỉ đúng một đoạn; A không có trong bài"],
      ],
    },
    {
      t: "note",
      title: "Tự chấm",
      items: [
        "**10–11 câu**: vững mức Passage 2 band 5.5–6. **8–9 câu**: đạt mục tiêu band 5. **≤ 7 câu**: xem lại từng câu sai thuộc loại bẫy nào (bảng trên), rồi làm lại phần “Làm thử” và 3 câu bất kỳ sau 1 ngày.",
        "Đo thời gian: nếu mất **> 22 phút** cho 11 câu, bạn đang đọc phương án quá sớm. Tập lại bước “tự trả lời trước”.",
      ],
    },
    {
      t: "vocab",
      items: [
        { w: "colony", pos: "n", ipa: "/ˈkɒləni/", vi: "đàn, quần thể (ong, kiến); thuộc địa", ex: "A bee colony can contain 50,000 workers.", exVi: "Một đàn ong có thể có 50.000 ong thợ.", anh: "honeybee" },
        { w: "forager", pos: "n", ipa: "/ˈfɒrɪdʒə(r)/", vi: "con vật đi kiếm ăn", ex: "Foragers return to the hive with nectar.", exVi: "Ong kiếm ăn quay về tổ cùng mật hoa.", more: "Động từ **forage** /ˈfɒrɪdʒ/ (đi kiếm ăn)." },
        { w: "nectar", pos: "n (U)", ipa: "/ˈnektə(r)/", vi: "mật hoa", ex: "Bees turn nectar into honey.", exVi: "Ong biến mật hoa thành mật ong." },
        { w: "identify", pos: "v", ipa: "/aɪˈdentɪfaɪ/", vi: "xác định, nhận ra", ex: "Scientists identified two types of dance.", exVi: "Các nhà khoa học xác định hai kiểu điệu nhảy.", more: "**identification** (n). Từ AWL sublist 1." },
        { w: "indicate", pos: "v", ipa: "/ˈɪndɪkeɪt/", vi: "chỉ ra, cho biết", ex: "The arrow indicates the direction of the exit.", exVi: "Mũi tên chỉ hướng lối ra.", more: "**indication** (n). Từ AWL sublist 1." },
        { w: "recruit", pos: "n, v", ipa: "/rɪˈkruːt/", vi: "người / con mới được tuyển; tuyển", ex: "New recruits follow the dancer.", exVi: "Những con ong mới được huy động bám theo con đang nhảy.", more: "**recruitment** (n) — rất hay gặp ở chủ đề việc làm." },
        { w: "settle (a debate)", pos: "v", ipa: "/ˈsetl/", vi: "giải quyết dứt điểm (cuộc tranh luận)", ex: "The new evidence finally settled the argument.", exVi: "Bằng chứng mới cuối cùng đã giải quyết cuộc tranh cãi.", more: "Nghĩa khác: **settle down** (ổn định cuộc sống)." },
        { w: "decode", pos: "v", ipa: "/ˌdiːˈkəʊd/", vi: "giải mã", ex: "Researchers decode the dances to make maps.", exVi: "Các nhà nghiên cứu giải mã điệu nhảy để vẽ bản đồ." },
      ],
    },
  ],
};

/* ─────────────────────────── Viết ─────────────────────────── */

const T2D10_VIET: Lesson = {
  id: "t2d10-viet",
  kind: "writing",
  title: "Viết: Advantages / disadvantages essay (+ “outweigh”)",
  goal: "Nhận ra hai biến thể của đề lợi – hại (chỉ bàn lợi hại / có hỏi “outweigh”), viết đúng thesis cho từng biến thể, triển khai mỗi thân bài 2 ý có giải thích và ví dụ, kết bài khớp thesis — viết trọn bài ≥ 250 từ đạt band 5.5–6 (TR rõ quan điểm khi đề hỏi; CC từ nối đúng vai).",
  minutes: 85,
  blocks: [
    {
      t: "recap",
      title: "Bài này học gì · đẩy band nào",
      items: [
        "Đề lợi – hại có **hai biến thể**: ① “**Discuss the advantages and disadvantages**” (bàn cả hai, ý kiến **không bắt buộc**) · ② “**Do the advantages outweigh the disadvantages?**” (**bắt buộc** nêu bên nào nặng hơn).",
        "Khung 4 đoạn: **Mở bài** (paraphrase + thesis) → **Thân bài 1** (mặt **yếu hơn**) → **Thân bài 2** (mặt **mạnh hơn**) → **Kết bài** (nhắc lại cân nhắc).",
        "Mỗi thân bài: **câu chủ đề** + **2 ý**, mỗi ý có **giải thích** và **ví dụ** (P-E-E như Opinion essay Ngày 2).",
        "Cụm chức năng: ==One major advantage of… is that…== · ==Another benefit is…== · ==The main drawback is…== · ==On balance, …outweigh…==",
        "Đẩy **TR** (biến thể ② không nêu quan điểm = band 5 trần) và **CC** (từ nối đúng chỗ, không lạm dụng Firstly / Moreover).",
        "Mục 1b: bảng so **3 cách hỏi** (discuss · outweigh · **positive or negative development?**) — mỗi cách một thesis, một cách chia thân bài; dàn ý mẫu cho đề “tốt hay xấu”.",
      ],
    },

    { t: "h", text: "1. Hai biến thể — hai thesis khác nhau" },
    {
      t: "sodo",
      kind: "compare",
      title: "Đọc câu hỏi cuối đề",
      cols: [
        { title: "① Discuss the advantages and disadvantages", anh: "balance-scale", items: ["Bàn **cả hai** mặt cân bằng", "Thesis: “**This essay will discuss** both the benefits and the drawbacks of…”", "Ý kiến riêng: **có thể** nêu ở kết bài, không bắt buộc", "Hai thân bài dài **ngang nhau**"] },
        { title: "② Do the advantages outweigh the disadvantages?", anh: "check-mark-button", items: ["Phải **trả lời câu hỏi**: lợi nặng hơn hay hại nặng hơn", "Thesis: “**I believe the advantages clearly outweigh the disadvantages.**”", "Quan điểm **xuyên suốt**: mở bài, câu chuyển, kết bài", "Thân bài mặt **mạnh hơn** dài, thuyết phục hơn"] },
      ],
      caption: "Đề ② mà viết như đề ① (chỉ liệt kê lợi và hại, không kết luận) ⇒ TR không vượt quá band 5 dù bài hay.",
    },
    {
      t: "table",
      caption: "Các cách hỏi cùng họ",
      head: ["Câu hỏi trong đề", "Biến thể", "Phải làm"],
      rows: [
        ["What are the advantages and disadvantages of…?", "①", "Bàn hai mặt"],
        ["Discuss the advantages and disadvantages of… (and give your own opinion)", "① (+ ý kiến)", "Bàn hai mặt; có “give your opinion” thì **phải** nêu ý kiến"],
        ["Do the advantages outweigh the disadvantages?", "②", "Kết luận bên nào nặng hơn"],
        ["Is this a positive or negative development?", "② (họ hàng)", "Kết luận tích cực hay tiêu cực (Tập 3 học kỹ)"],
      ],
    },
    {
      t: "sodo",
      kind: "flow",
      title: "Khung 4 đoạn cho biến thể ② (outweigh)",
      steps: [
        { label: "Mở bài (2 câu, ~45 từ)", sub: "paraphrase đề + thesis: **I believe the benefits outweigh the drawbacks**" },
        { label: "Thân bài 1 (~80 từ)", sub: "mặt **yếu hơn** (ở đây: hại) — thừa nhận công bằng: **Admittedly, there are some drawbacks…**" },
        { label: "Thân bài 2 (~100 từ)", sub: "mặt **mạnh hơn** (lợi) — 2 ý, giải thích + ví dụ cụ thể" },
        { label: "Kết bài (1–2 câu, ~35 từ)", sub: "**On balance, …** nhắc lại thesis bằng lời khác + tóm 2 lý do chính" },
      ],
      caption: "Đặt mặt mạnh hơn ở SAU để kết thúc thân bài bằng lý lẽ thắng — người đọc nhớ đoạn cuối nhất.",
    },

    { t: "h", text: "1b. Ba cách hỏi lợi – hại, và khi đề hỏi “tốt hay xấu”" },
    {
      t: "table",
      caption: "So 3 cách hỏi — đọc đúng câu hỏi cuối đề trước khi viết thesis",
      head: ["Câu hỏi", "Ý kiến", "Chia thân bài", "Thesis mẫu"],
      rows: [
        ["**Discuss the advantages and disadvantages** of…", "Không bắt buộc (trừ khi có “give your own opinion”)", "TB1 lợi · TB2 hại — **dài ngang nhau**", "This essay will examine both the benefits and the drawbacks of…"],
        ["**Do the advantages outweigh the disadvantages?**", "**Bắt buộc**: bên nào nặng hơn", "TB1 bên **nhẹ** hơn · TB2 bên **nặng** hơn (dài hơn)", "I believe the advantages clearly outweigh the disadvantages."],
        ["**Is this a positive or negative development?**", "**Bắt buộc**: xu hướng này tốt hay xấu", "Cách 1: cả hai TB đều nói một phía (2 lý do tốt) · Cách 2: TB1 thừa nhận mặt xấu nhỏ, TB2 mặt tốt lớn", "I believe this is a largely positive development."],
      ],
    },
    {
      t: "note",
      title: "Đề “positive or negative development” — khác đề outweigh ở đâu, hay sai gì",
      items: [
        "Đề hỏi về một **xu hướng / thay đổi** (development) — mở bài phải nhắc lại xu hướng đó: “**It is becoming increasingly common for** older people **to** use social media.”",
        "Không bắt buộc phải bàn mặt kia. Viết **cả bài một phía** (2 lý do tích cực) vẫn đạt TR, miễn là lập trường rõ. Cách 2 (thừa nhận mặt xấu ở TB1) giúp bài cân nhắc hơn.",
        "Từ đúng loại đề: **a positive / negative development · a welcome trend · a worrying trend · beneficial · harmful** — đừng viết “The advantages outweigh…” khi đề không dùng chữ outweigh (vẫn hiểu được nhưng lệch câu hỏi).",
        "Lỗi hay gặp: ~~I agree that this is positive~~ — đề không hỏi agree. Trả lời thẳng: **I believe this is a positive development.**",
      ],
    },
    {
      t: "note",
      title: "Dàn ý mẫu (gạch đầu dòng, 5 phút) — đề: “More and more older people are using smartphones and social media. Is this a positive or negative development?”",
      items: [
        "**Mở bài**: người cao tuổi dùng điện thoại, mạng xã hội ngày càng nhiều · thesis: **phần lớn tích cực**.",
        "**TB1 (thừa nhận mặt xấu nhỏ)**: Admittedly · dễ bị lừa đảo online, tin giả → cần con cháu hướng dẫn.",
        "**TB2 (mặt tốt lớn)**: giữ liên lạc với con cháu ở xa (gọi video mỗi tuần) → ít cô đơn · tự đặt lịch khám, xem tin tức, học thêm → tự lập hơn.",
        "**Kết bài**: Overall, a positive development, especially if families help them stay safe online.",
      ],
    },
    {
      t: "rule",
      formula: "Discuss adv/disadv → cân bằng · Outweigh → bên nặng hơn ở TB2 · Positive or negative? → I believe this is a (largely) positive / negative development",
      vi: "Ba câu hỏi nghe giống nhau nhưng thesis khác nhau — đọc câu hỏi cuối đề trước khi viết một chữ nào.",
    },

    { t: "h", text: "2. Ngôn ngữ cho đề lợi – hại" },
    {
      t: "patterns",
      rows: [
        { formula: "One major advantage of + N / V-ing + is that + S + V", vi: "Mở ý lợi thứ nhất (câu chủ đề).", examples: [{ en: "One major advantage of taking a gap year is that young people gain real work experience.", vi: "Một lợi ích lớn của năm nghỉ trước đại học là người trẻ có được kinh nghiệm làm việc thật." }] },
        { formula: "Another benefit is that + S + V · A further advantage is + N", vi: "Ý lợi thứ hai — thay cho “Moreover” lặp lại.", examples: [{ en: "Another benefit is that students start university with clearer goals.", vi: "Một lợi ích khác là sinh viên bước vào đại học với mục tiêu rõ ràng hơn." }] },
        { formula: "The main drawback / disadvantage of + N + is that + S + V", vi: "Mở ý hại.", examples: [{ en: "The main drawback of a gap year is the cost.", vi: "Nhược điểm chính của năm nghỉ là chi phí." }] },
        { formula: "Admittedly, + S + V. However, + S + V", vi: "**Thừa nhận** mặt kia rồi đẩy về quan điểm của mình — câu nhượng bộ đơn giản (band 5–6).", examples: [{ en: "Admittedly, some students lose the habit of studying. However, this risk can be reduced with careful planning.", vi: "Phải thừa nhận rằng một số sinh viên mất thói quen học. Tuy nhiên, rủi ro này có thể giảm nhờ lên kế hoạch cẩn thận." }] },
        { formula: "S (lợi) + outweigh(s) + O (hại) · On balance, + S + V", vi: "**outweigh** = nặng hơn, vượt trội hơn. **On balance** = cân nhắc mọi mặt.", examples: [{ en: "On balance, I believe the benefits of a gap year far outweigh the drawbacks.", vi: "Cân nhắc mọi mặt, tôi tin lợi ích của năm nghỉ vượt xa nhược điểm." }] },
      ],
    },
    {
      t: "table",
      caption: "Từ đồng nghĩa để không lặp “advantage / disadvantage”",
      head: ["Lợi", "Hại"],
      rows: [
        ["advantage · benefit · merit · positive aspect · upside", "disadvantage · drawback · downside · negative aspect · risk"],
        ["… is beneficial for · … helps sb (to) + V", "… can be harmful to · … may lead to + N"],
      ],
    },
    {
      t: "note",
      title: "Người Việt hay sai ở đề lợi – hại",
      items: [
        "Đề ② nhưng **không nói bên nào nặng hơn** — chỉ liệt kê. Quan điểm **bên nào nặng hơn** phải rõ ở **mở bài** và **kết bài** (mở bài nên dùng chính chữ outweigh; kết bài có thể diễn đạt lại).",
        "~~The advantages are outweigh the disadvantages~~ → The advantages **outweigh** the disadvantages (outweigh là **động từ**, không cần are).",
        "Mỗi đoạn mở bằng **Firstly / Secondly / Moreover / Furthermore** liên tục — giám khảo coi là **lạm dụng** từ nối (CC band 5). Dùng cụm chức năng ở trên.",
        "Lợi và hại **không cùng chủ đề**: lợi nói về sinh viên, hại nói về nền kinh tế — bài mất cân bằng. Giữ cả hai mặt quanh **cùng đối tượng**.",
        "Kết bài **thêm ý mới** (“Also, the government should…”) — kết bài chỉ **tóm lại**.",
      ],
    },
    {
      t: "rule",
      formula: "One major advantage of + N is that… · Another benefit is that… · The main drawback is… · Admittedly, …. However, … · On balance, A outweighs B",
      vi: "Biến thể “outweigh” BẮT BUỘC kết luận bên nào nặng hơn — ở mở bài và kết bài.",
    },
    {
      t: "quiz",
      id: "t2d10-viet-dich",
      title: "Dịch sang tiếng Anh — câu lợi – hại (5 câu)",
      kind: "translate",
      grammar: "One major advantage of + N / V-ing + is that… · The main drawback of + N + is… · Admittedly, … However, … · On balance, + S + outweigh(s) + O",
      items: [
        { q: "Một lợi ích lớn của việc làm thêm là sinh viên học được cách quản lý tiền.", hint: "One major advantage of, having a part-time job / working part-time, is that, students learn how to manage money", answers: ["One major advantage of having a part-time job is that students learn how to manage money.", "One major advantage of working part-time is that students learn how to manage money.", "One major advantage of having a part-time job is that students learn to manage money.", "One major advantage of working part-time is that students learn to manage money.", "One major advantage of part-time jobs is that students learn how to manage money.", "One major advantage of having a part-time job is that students learn how to manage their money.", "One major advantage of working part-time is that students learn how to manage their money.", "A major advantage of having a part-time job is that students learn how to manage money.", "A major advantage of working part-time is that students learn how to manage money.", "One major benefit of having a part-time job is that students learn how to manage money.", "One major benefit of working part-time is that students learn how to manage money."] },
        { q: "Nhược điểm chính là chi phí cao.", hint: "The main drawback / disadvantage, is the high cost", answers: ["The main drawback is the high cost.", "The main disadvantage is the high cost.", "The main drawback is the high cost of it.", "The main drawback is that it is expensive.", "The main disadvantage is that it is expensive.", "The main downside is the high cost."] },
        { q: "Phải thừa nhận rằng nó có thể tốn thời gian. Tuy nhiên, lợi ích lớn hơn nhiều.", hint: "Admittedly, it can be time-consuming. However, the benefits are much greater", answers: ["Admittedly, it can be time-consuming. However, the benefits are much greater.", "Admittedly, it can be time-consuming. However, the benefits are far greater.", "Admittedly, it can take a lot of time. However, the benefits are much greater.", "Admittedly, it can be time-consuming. However, the benefits are much bigger.", "Admittedly, it may be time-consuming. However, the benefits are much greater.", "Admittedly, it can be time-consuming; however, the benefits are much greater.", "Admittedly, it can be time-consuming. However, the advantages are much greater.", "Admittedly, it can be time-consuming. However, the advantages are far greater."] },
        { q: "Cân nhắc mọi mặt, tôi tin lợi ích vượt trội hơn nhược điểm.", hint: "On balance, I believe, the advantages / benefits, outweigh, the disadvantages / drawbacks", answers: ["On balance, I believe the advantages outweigh the disadvantages.", "On balance, I believe the benefits outweigh the drawbacks.", "On balance, I believe that the advantages outweigh the disadvantages.", "On balance, I believe that the benefits outweigh the drawbacks.", "On balance, I think the advantages outweigh the disadvantages.", "On balance, I believe the advantages outweigh the drawbacks.", "On balance, I believe the benefits outweigh the disadvantages.", "On balance, I think the benefits outweigh the drawbacks.", "On balance, I believe that the benefits outweigh the disadvantages.", "On balance, I believe that the advantages outweigh the drawbacks.", "On balance, I think the benefits outweigh the disadvantages."] },
        { q: "Việc này có thể dẫn đến nợ nần.", hint: "This, may / can, lead to, debt", answers: ["This may lead to debt.", "This can lead to debt.", "This could lead to debt.", "This may lead to debts.", "This can lead to financial debt.", "This might lead to debt.", "It can lead to debt.", "It may lead to debt."] },
      ],
    },

    { t: "h", text: "3. Bài mẫu band 6.5–7 (biến thể outweigh)" },
    {
      t: "p",
      text: "**Đề:** Nowadays, many young people take a gap year — a year of work or travel between finishing school and starting university. **Do the advantages of this outweigh the disadvantages?** Write at least 250 words.",
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Dàn ý 5 phút",
      center: "**Gap year: lợi > hại**",
      branches: [
        { label: "Hại (thân bài 1)", items: ["mất thói quen học", "chi phí du lịch → nợ / phụ thuộc bố mẹ"] },
        { label: "Lợi (thân bài 2)", items: ["kinh nghiệm làm việc + kỹ năng mềm", "biết mình muốn học gì → ít đổi ngành"] },
        { label: "Ví dụ", items: ["làm quán cà phê 6 tháng → giao tiếp, quản lý tiền", "nhiều sinh viên năm nhất đổi ngành / bỏ học vì chọn vội"] },
        { label: "Kết", items: ["On balance · đáng làm", "cần kế hoạch rõ"] },
      ],
    },
    {
      t: "examples",
      items: [
        { en: "[Introduction] In many countries, it is becoming increasingly common for school leavers to spend a year working or travelling before they begin their degree. Although this choice has some drawbacks, I believe its advantages clearly outweigh them.", vi: "[Mở bài] Ở nhiều nước, ngày càng phổ biến việc học sinh tốt nghiệp phổ thông dành một năm đi làm hoặc đi du lịch trước khi vào đại học. Dù lựa chọn này có vài nhược điểm, tôi tin lợi ích của nó rõ ràng vượt trội hơn." },
        { en: "[Body 1] Admittedly, a gap year can cause problems. The main drawback is that students may lose the habit of studying. After twelve months without classes or exams, some find it difficult to concentrate on lectures and long reading lists. In addition, travelling abroad can be very expensive, so young people often have to borrow money or depend on their parents, which is the opposite of the independence they were hoping to gain.", vi: "[Thân bài 1] Phải thừa nhận rằng năm nghỉ có thể gây ra vấn đề. Nhược điểm chính là sinh viên có thể mất thói quen học. Sau mười hai tháng không lớp học, không thi cử, một số người thấy khó tập trung vào bài giảng và danh sách đọc dài. Thêm vào đó, đi du lịch nước ngoài có thể rất tốn kém, nên người trẻ thường phải vay tiền hoặc phụ thuộc bố mẹ — trái ngược với sự tự lập mà họ mong có được." },
        { en: "[Body 2] However, the benefits are far more significant. One major advantage of a gap year is that young people gain real work experience and the soft skills that employers value. For example, a student who works in a busy café for six months learns to communicate with strangers, manage time and handle money, skills that are rarely taught at school. Another benefit is that students start university with a clearer idea of what they want to study. Many first-year students change their course or drop out because they chose it too quickly, and a year outside education gives them time to make a better decision. As a result, they are often more motivated and achieve better results.", vi: "[Thân bài 2] Tuy nhiên, lợi ích quan trọng hơn nhiều. Một lợi ích lớn của năm nghỉ là người trẻ có kinh nghiệm làm việc thật và những kỹ năng mềm mà nhà tuyển dụng coi trọng. Chẳng hạn, một sinh viên làm ở một quán cà phê đông khách trong sáu tháng sẽ học được cách giao tiếp với người lạ, quản lý thời gian và xử lý tiền bạc — những kỹ năng hiếm khi được dạy ở trường. Một lợi ích khác là sinh viên vào đại học với ý tưởng rõ ràng hơn về điều mình muốn học. Nhiều sinh viên năm nhất đổi ngành hoặc bỏ học vì chọn ngành quá vội, và một năm ra khỏi trường cho họ thời gian để quyết định tốt hơn. Nhờ đó, họ thường có động lực hơn và đạt kết quả tốt hơn." },
        { en: "[Conclusion] On balance, although a gap year may cost money and interrupt the habit of studying, I believe the experience and clearer goals it provides make it a worthwhile choice, especially if it is carefully planned.", vi: "[Kết bài] Cân nhắc mọi mặt, dù năm nghỉ có thể tốn tiền và làm gián đoạn thói quen học, tôi tin kinh nghiệm và mục tiêu rõ ràng hơn mà nó mang lại khiến đây là một lựa chọn đáng giá, đặc biệt nếu được lên kế hoạch cẩn thận." },
      ],
    },
    {
      t: "table",
      caption: "Vì sao bài mẫu đạt band 6.5–7 (đếm: 258 từ)",
      head: ["Tiêu chí", "Điểm mạnh", "Còn có thể nâng (band 7)"],
      rows: [
        ["**TR** — trả lời đề", "Trả lời thẳng câu hỏi outweigh ở **mở bài** (clearly outweigh) và **kết bài** (worthwhile choice); hai mặt đều có lý lẽ", "Ví dụ ở thân bài 1 còn chung chung — thêm một tình huống cụ thể"],
        ["**CC** — mạch lạc", "Mặt yếu trước, mặt mạnh sau; câu chuyển **However, the benefits are far more significant**; từ nối đa dạng: Admittedly · In addition · For example · As a result", "Dùng thêm từ quy chiếu (such skills, this experience) để nối câu"],
        ["**LR** — từ vựng", "school leavers · drawback · soft skills · drop out · worthwhile · gain independence · AWL: **achieve** (đã dùng) · có thể thêm **acquire** skills", "Một vài collocation chính xác hơn: **broaden their horizons**"],
        ["**GRA** — ngữ pháp", "Câu phức đa dạng: **Although…**, **which is…**, **who works…**, **because they chose…**; bị động ít nhưng đúng", "Thêm một câu điều kiện (If students plan carefully, …) — Ngày 13"],
      ],
    },
    {
      t: "note",
      title: "Biến thể ①: nếu đề chỉ hỏi “Discuss the advantages and disadvantages”",
      items: [
        "Mở bài đổi thesis: “**This essay will examine both the benefits and the drawbacks of** taking a gap year.”",
        "Hai thân bài **cân bằng** (~90 từ mỗi đoạn), thứ tự lợi trước hại hay ngược lại đều được.",
        "Kết bài: “**In conclusion, a gap year offers** valuable experience **but also involves** financial and academic risks.” — nếu đề **không** hỏi ý kiến, có thể dừng ở đây; nếu đề có “**give your own opinion**” thì thêm một câu: “**Personally, I believe…**”.",
      ],
    },

    { t: "h", text: "4. Tự viết một bài (AI chấm)" },
    {
      t: "essay",
      id: "t2d10-viet-bai",
      task: "Task 2",
      prompt: "In many cities, people are now able to order almost anything online and have it delivered to their home within a few hours. Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      minWords: 250,
      tips: [
        "Đề có “**outweigh**” ⇒ thesis phải nói rõ bên nào nặng hơn, ví dụ: “**Although fast delivery has some drawbacks, I believe its benefits outweigh them.**”",
        "Ý gợi ý — Lợi: **tiết kiệm thời gian** (người bận, người già, người khuyết tật) · **nhiều lựa chọn, so sánh giá**. Hại: **rác bao bì, khí thải xe giao hàng** · **cửa hàng nhỏ gặp khó**, điều kiện làm việc của shipper.",
        "Thân bài 1 = mặt **yếu hơn** (mở bằng **Admittedly,** / **It is true that…**); thân bài 2 = mặt **mạnh hơn** (mở bằng **However, …**).",
        "Mỗi ý: câu chủ đề → giải thích (**This means that…**) → ví dụ (**For example, …**). Dùng 3–5 từ của Ngày 8 và Ngày 10: **consumer, consumption, emissions, affect, have an impact on**.",
        "Kết bài 1–2 câu: **On balance, …** — không thêm ý mới. Đếm từ ≥ 250.",
      ],
    },
  ],
};

/* ─────────────────────────── Bài tập ─────────────────────────── */

const T2D10_BAI_TAP: Lesson = {
  id: "t2d10-bai-tap",
  kind: "homework",
  title: "Bài tập Ngày 10",
  goal: "Tự kiểm tra Ngày 10: 8 câu họ từ AWL, 6 câu nghĩa / collocation AWL, 6 câu ngôn ngữ xu hướng, 5 câu cách làm trắc nghiệm, 6 câu dịch lợi – hại, 6 câu tái tạo một đoạn mẫu — 37 câu có đáp án và lời giải.",
  minutes: 50,
  blocks: [
    {
      t: "recap",
      title: "Bài tập hôm nay (37 câu)",
      items: [
        "**Phần I** (8 câu): viết dạng đúng của từ AWL · **Phần II** (6 câu): chọn từ AWL hợp nghĩa.",
        "**Phần III** (6 câu): đổi câu xu hướng sang cụm danh từ và ngược lại.",
        "**Phần IV** (5 câu): trắc nghiệm trên đoạn ngắn + chiến thuật · **Phần V** (6 câu): dịch câu lợi – hại.",
        "**Phần VI** (6 câu): **tái tạo một đoạn mẫu** — nghe 2 lần, không xem lời, điền lại khung câu rồi viết lại cả đoạn.",
      ],
    },
    {
      t: "sodo",
      kind: "mindmap",
      title: "Ngày 10 trong một hình",
      center: "**Ngày 10**",
      branches: [
        { label: "Từ vựng", items: ["AWL sublist 2: achieve → injure (30 họ)", "affect (v) / effect (n) · impact on", "There was a sharp rise in…", "significantly · marginally · plateau · triple"] },
        { label: "Đọc: trắc nghiệm", items: ["câu hỏi → vị trí → tự trả lời → A–D", "loại: sai chi tiết · lạc câu hỏi · quá tuyệt đối", "đáp án = paraphrase"] },
        { label: "Viết: lợi – hại", items: ["“outweigh” → bắt buộc kết luận", "mặt yếu trước, mặt mạnh sau", "Admittedly… However… On balance…"] },
      ],
    },

    { t: "h", text: "Phần I — Họ từ AWL (8 câu)" },
    {
      t: "quiz",
      id: "t2d10-bt-ho-tu",
      title: "Phần I — Viết dạng đúng của từ trong ngoặc",
      kind: "fill",
      items: [
        { q: "(1) Winning the scholarship was her greatest ___. (achieve)", answers: ["achievement"] },
        { q: "(2) Water ___ in the city has doubled since 2000. (consume)", answers: ["consumption"] },
        { q: "(3) The road is still under ___. (construct)", answers: ["construction"] },
        { q: "(4) The study reached a surprising ___. (conclude)", answers: ["conclusion"] },
        { q: "(5) Heavy rain can have a serious ___ on traffic. (affect — danh từ)", answers: ["effect"] },
        { q: "(6) Vietnam has a rich ___ heritage. (culture)", answers: ["cultural"] },
        { q: "(7) Two players were badly ___ in the match. (injure)", answers: ["injured"] },
        { q: "(8) The team needs more ___ from the government. (assist)", answers: ["assistance"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần I",
      items: [
        "**(1) achievement** — sau **her greatest** cần danh từ. **(2) consumption** — danh từ không đếm được (Water consumption).",
        "**(3) construction** — cụm **under construction**. **(4) conclusion** — **reach a conclusion**.",
        "**(5) effect** — **have an effect on** (affect là động từ). **(6) cultural** — tính từ trước **heritage**.",
        "**(7) injured** — bị động **were injured**. **(8) assistance** — danh từ không đếm được (~~assistances~~).",
      ],
    },

    { t: "h", text: "Phần II — Chọn từ AWL (6 câu)" },
    {
      t: "mcq",
      id: "t2d10-bt-awl",
      title: "Phần II — Chọn đáp án đúng (6 câu)",
      items: [
        { q: "(1) Parents should choose games that are ___ for their child's age.", options: ["distinct", "appropriate", "complex"], correct: 1, why: "**appropriate for** = phù hợp với." },
        { q: "(2) The researchers ___ 300 people about their sleeping habits.", options: ["surveyed", "equated", "credited"], correct: 0, why: "**survey** sb = khảo sát ai. (conducted a survey **of** … cũng đúng nghĩa)" },
        { q: "(3) Smoking is one of the main causes of heart disease, and ___, many countries have banned it indoors.", options: ["finally", "distinctly", "consequently"], correct: 2, why: "**consequently** = vì thế (nối nguyên nhân → kết quả)." },
        { q: "(4) The report ___ on three main problems.", options: ["focuses", "affects", "achieves"], correct: 0, why: "**focus on**." },
        { q: "(5) Children ___ language by listening and copying.", options: ["evaluate", "acquire", "commission"], correct: 1, why: "**acquire language** = tiếp thu ngôn ngữ." },
        { q: "(6) The products are divided into four ___: food, clothes, electronics and books.", options: ["chapters", "aspects", "categories"], correct: 2, why: "Chia thành **loại / hạng mục** → **categories**." },
      ],
    },

    { t: "h", text: "Phần III — Ngôn ngữ xu hướng (6 câu)" },
    {
      t: "quiz",
      id: "t2d10-bt-xu-huong",
      title: "Phần III — Viết lại theo gợi ý (mỗi chỗ trống MỘT từ)",
      kind: "fill",
      items: [
        { q: "(1) Sales rose sharply in 2019. → There was a sharp ___ in sales in 2019.", answers: ["rise", "increase"] },
        { q: "(2) There was a gradual decline in visitors. → Visitors declined ___.", answers: ["gradually"] },
        { q: "(3) Prices fell slightly. → There was a ___ fall in prices.", answers: ["slight", "marginal", "small"] },
        { q: "(4) The number increased from 10 to 30. → The number ___. (gấp ba — quá khứ)", answers: ["tripled", "trebled"] },
        { q: "(5) In 2010, the figure was 45%. → In 2010, the figure ___ at 45%.", answers: ["stood"] },
        { q: "(6) After 2015, the figure stopped rising and stayed at about 60%. → After 2015, the figure ___ at about 60%.", answers: ["plateaued", "stabilised", "stabilized", "remained"] },
      ],
    },

    { t: "h", text: "Phần IV — Trắc nghiệm đọc (5 câu)" },
    {
      t: "passage",
      title: "Night owls and early birds",
      paras: [
        { label: "", text: "Some people feel most alert early in the morning, while others do their best work late at night. Scientists call these differences “chronotypes”. Research suggests that chronotypes are partly inherited, which means that a night owl cannot simply decide to become an early bird. However, a person's chronotype is not fixed for life: most teenagers become night owls during puberty and then gradually shift back towards mornings in their twenties. For this reason, some schools have experimented with starting lessons later, and several have reported that students arrived on time more often and found it easier to concentrate." },
      ],
    },
    {
      t: "mcq",
      id: "t2d10-bt-doc",
      title: "Phần IV — Chọn đáp án đúng (5 câu)",
      items: [
        { q: "(1) According to the passage, chronotypes", options: ["A are completely controlled by the environment.", "B are partly passed down from parents.", "C never change during a person's life.", "D can be chosen by each person."], correct: 1, why: "“**partly inherited**” = **partly passed down from parents** (paraphrase). C quá tuyệt đối và ngược (“not fixed for life”); D ngược (“cannot simply decide”)." },
        { q: "(2) What does the writer say about teenagers?", options: ["A They tend to become night owls.", "B They are always early birds.", "C They sleep more than adults.", "D They cannot concentrate at school."], correct: 0, why: "“most teenagers **become night owls** during puberty” → A. B quá tuyệt đối và ngược; C, D không có." },
        { q: "(3) The phrase “For this reason” refers to the fact that", options: ["A some schools start late.", "B people in their twenties are early birds.", "C chronotypes are inherited.", "D teenagers' sleep pattern shifts later."], correct: 3, why: "Từ quy chiếu: lý do ngay câu trước — thanh thiếu niên thành **cú đêm** ⇒ trường thử cho vào học muộn." },
        { q: "(4) Schools that started later reported that students", options: ["A got higher exam results.", "B slept for fewer hours.", "C were late less often.", "D preferred online lessons."], correct: 2, why: "“students **arrived on time more often**” = **were late less often** (đổi cấu trúc). A không có (chỉ nói concentrate dễ hơn)." },
        { q: "(5) Bạn còn phân vân giữa hai phương án: một cái **trùng nhiều chữ** với bài, một cái **diễn đạt lại** đúng ý bài. Nên chọn…", options: ["A cái trùng nhiều chữ", "B cái diễn đạt lại đúng ý", "C bỏ trống", "D cái dài nhất"], correct: 1, why: "Đáp án trắc nghiệm thường là **paraphrase**; phương án trùng chữ hay là bẫy. Và **không bao giờ bỏ trống**." },
      ],
    },

    { t: "h", text: "Phần V — Dịch câu lợi – hại + xu hướng (6 câu)" },
    {
      t: "quiz",
      id: "t2d10-bt-dich",
      title: "Phần V — Dịch sang tiếng Anh (6 câu)",
      kind: "translate",
      grammar: "One major advantage of + N is that… · Another benefit is that… · The main drawback is… · Admittedly, … However, … · On balance, … outweigh …",
      items: [
        { q: "Một lợi ích lớn của học trực tuyến là sự linh hoạt.", hint: "One major advantage of, online learning, is (its) flexibility", answers: ["One major advantage of online learning is flexibility.", "One major advantage of online learning is its flexibility.", "One major advantage of online learning is that it is flexible.", "One major benefit of online learning is flexibility.", "One major benefit of online learning is its flexibility.", "One major advantage of studying online is flexibility.", "One major advantage of studying online is its flexibility.", "A major advantage of online learning is flexibility.", "A major advantage of online learning is its flexibility.", "One major advantage of online learning is the flexibility."] },
        { q: "Một lợi ích khác là người học có thể tiết kiệm tiền.", hint: "Another benefit is that, learners can save money", answers: ["Another benefit is that learners can save money.", "Another advantage is that learners can save money.", "Another benefit is that students can save money.", "Another advantage is that students can save money.", "Another benefit is that learners are able to save money."] },
        { q: "Nhược điểm chính là thiếu tương tác.", hint: "The main drawback / disadvantage, is the lack of interaction", answers: ["The main drawback is the lack of interaction.", "The main disadvantage is the lack of interaction.", "The main drawback is a lack of interaction.", "The main disadvantage is a lack of interaction.", "The main downside is the lack of interaction."] },
        { q: "Phải thừa nhận rằng một số học sinh cảm thấy cô đơn.", hint: "Admittedly, some students, feel lonely / isolated", answers: ["Admittedly, some students feel lonely.", "Admittedly, some students feel isolated.", "Admittedly, some students may feel lonely.", "Admittedly, some learners feel lonely.", "Admittedly, some learners feel isolated."] },
        { q: "Cân nhắc mọi mặt, lợi ích vượt trội hơn nhược điểm.", hint: "On balance, the advantages / benefits, outweigh, the disadvantages / drawbacks", answers: ["On balance, the advantages outweigh the disadvantages.", "On balance, the benefits outweigh the drawbacks.", "On balance, the advantages outweigh the drawbacks.", "On balance, the benefits outweigh the disadvantages.", "On balance the advantages outweigh the disadvantages."] },
        { q: "Năm 2020 có một sự tăng mạnh về doanh số trực tuyến.", hint: "There was, a sharp / dramatic rise, in online sales, in 2020", answers: ["There was a sharp rise in online sales in 2020.", "There was a dramatic rise in online sales in 2020.", "There was a sharp increase in online sales in 2020.", "There was a dramatic increase in online sales in 2020.", "In 2020, there was a sharp rise in online sales.", "In 2020 there was a sharp increase in online sales.", "There was a significant rise in online sales in 2020."] },
      ],
    },

    { t: "h", text: "Phần VI — Tái tạo một đoạn mẫu (6 câu)" },
    {
      t: "p",
      text: "Cách luyện của Ngày 6 (mục 4b), bản ngắn: **nghe đoạn mẫu 2 lần, KHÔNG mở lời**, ghi từ khoá ra giấy. Rồi điền lại các chỗ trống dưới đây theo trí nhớ. Cuối cùng viết lại **cả đoạn** vào vở bằng lời của bạn và mới mở lời để so — học khung câu, không học thuộc.",
    },
    {
      t: "listen",
      id: "t2d10-bt-tai-tao-nghe",
      title: "Đoạn mẫu — lợi ích của làm việc ở nhà (khoảng band 6.0, ước tính · 81 từ)",
      note: "Nghe 2 lần, chỉ ghi từ khoá. Mở lời sau khi đã điền xong 6 câu và viết lại cả đoạn.",
      lines: [
        { voice: "uk-nam", text: "One major advantage of working from home is that employees save a great deal of time." },
        { voice: "uk-nam", text: "This means that they can spend the hours they used to waste in traffic with their families or on exercise." },
        { voice: "uk-nam", text: "For example, a friend of mine used to spend almost two hours a day commuting, but now she uses that time to cook healthy meals." },
        { voice: "uk-nam", text: "Admittedly, some people feel lonely without colleagues around them." },
        { voice: "uk-nam", text: "On balance, however, I believe the benefits clearly outweigh this drawback." },
      ],
    },
    {
      t: "quiz",
      id: "t2d10-bt-tai-tao",
      title: "Phần VI — Điền lại khung câu theo trí nhớ (MỘT từ mỗi chỗ)",
      kind: "fill",
      items: [
        { q: "(1) One major ___ of working from home is that employees save a great deal of time.", answers: ["advantage", "benefit"] },
        { q: "(2) This ___ that they can spend the hours they used to waste in traffic with their families.", answers: ["means"] },
        { q: "(3) A friend of mine used to spend almost ___ hours a day commuting.", answers: ["two", "2"] },
        { q: "(4) ___, some people feel lonely without colleagues around them. (thừa nhận)", answers: ["Admittedly", "admittedly"] },
        { q: "(5) On ___, however, I believe the benefits clearly outweigh this drawback.", answers: ["balance"] },
        { q: "(6) …I believe the benefits clearly ___ this drawback.", answers: ["outweigh"] },
      ],
    },
    {
      t: "note",
      title: "Lời giải Phần VI — và khung bạn vừa “lấy” được",
      items: [
        "**(1) advantage** — khung **One major advantage of + V-ing + is that…** (câu chủ đề). **(2) means** — **This means that…** (giải thích).",
        "**(3) two** — chi tiết của ví dụ: một người cụ thể + con số + **used to… but now…** (so trước – sau).",
        "**(4) Admittedly** — thừa nhận mặt kia. **(5) balance** + **(6) outweigh** — **On balance, … outweigh…** chốt bên nặng hơn.",
        "Viết lại cả đoạn rồi so: bạn có giữ đủ **4 vai** (chủ đề → giải thích → ví dụ → thừa nhận + chốt) không? Thiếu vai nào thì đó là chỗ cần tập.",
      ],
    },
  ],
};

export const NGAY_10: Lesson[] = [T2D10_TU_VUNG, T2D10_DOC, T2D10_VIET, T2D10_BAI_TAP];
