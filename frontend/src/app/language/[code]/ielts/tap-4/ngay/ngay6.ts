/**
 * IELTS Tập 4 — Ngày 6 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài đọc, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     Collocation học thuật verb + noun — 60 cụm theo 5 nhóm chức năng + make / do / have / take
 *                     + Academic Phrasebank nhập môn (12 khung câu)                                           [VD3 VD9]
 *                     — nối Tập 2 Ngày 16 (collocation mở đầu) · Tập 3 Ngày 14 (Task 2) · Tập 3 Ngày 24 (Task 1)
 *   Bài 2 (writing)   Task 1 line graph 3 — năm đường: nhóm xu hướng, overview band 7, chọn số; mẫu band 6 vs band 7 [W08 W17]
 *                     — nối Tập 2 Ngày 4 (line trọn bài) · Tập 3 Ngày 8 (hai đường cắt nhau, Total, dự báo)
 *   Bài 3 (speaking)  Part 2 band 7: Describe a person / a place có CÂU CHUYỆN NHỎ; thành ngữ tính cách đúng nguyên dạng [S05]
 *                     — nối Tập 2 Ngày 3 · 7, Tập 3 Ngày 7 · 14 · 🔊 ngữ điệu kể chuyện
 *   Bài tập Ngày 6    40 câu có đáp án
 *   Kiểm tra chặng    `t4d6-kiem-tra` — gom Ngày 1–6 (ngữ pháp · từ vựng · dịch · nghe · đọc · viết · nói · phát âm)
 * Mọi id bắt đầu `t4d6-`.
 */
import type { Lesson } from '../data';

export const NGAY_6: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d6-tu-vung",
    kind: "vocab",
    title: "Từ vựng: Collocation học thuật verb + noun (conduct research, pose a threat…)",
    goal: "Dùng đúng 60 cặp động từ + danh từ học thuật trong Task 2 và Part 3 (conduct research, pose a threat, implement a policy, strike a balance…), không còn ghép sai kiểu ~~make a research~~ / ~~solve the pollution~~, và mở – nối ý bằng 12 khung câu Academic Phrasebank — đẩy LR band 7 (từ ít gặp dùng có ý thức về collocation).",
    minutes: 85,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "**Collocation** = các từ “quen đi với nhau”. Band 7 ở tiêu chí **LR** ghi rõ: dùng từ ít gặp “có ý thức về văn phong và collocation”. Tức là không chỉ biết từ **research**, mà biết nó đi với **conduct / carry out / do**, không đi với ~~make~~.",
          "Bạn đã học collocation mở đầu ở **Tập 2 Ngày 16**, collocation Task 2 ở **Tập 3 Ngày 14** và Task 1 ở **Tập 3 Ngày 24**. Hôm nay gom riêng loại đáng tiền nhất cho văn học thuật: ==động từ + danh từ==.",
          "60 cụm chia **5 nhóm theo việc bạn cần làm trong bài viết**: nói về nghiên cứu – bằng chứng · nêu vấn đề – nguy cơ · nêu chính sách – hành động · lập luận – quan điểm · nói về thay đổi – kết quả. Vài cụm đã gặp ở Ngày 2 (pose a threat, strike a balance, bear the cost, exacerbate) — hôm nay xếp chúng vào hệ thống cùng các cụm mới.",
          "Lỗi người Việt số 1: dịch từng chữ rồi ghép với **make / do / have** tuỳ tiện. Mục 6 có bảng riêng.",
          "Cuối bài: **Academic Phrasebank** nhập môn — 12 khung câu dựng từ chính các collocation này, dùng được ngay trong Task 2.",
          "Học theo **cặp**, không học từ lẻ: thẻ nhớ ghi “___ a threat” → pose.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Vì sao band 7 cần collocation — và học thế nào" },
      {
        t: "p",
        text: "Đọc hai câu: (a) ~~The government should make a law to solve the pollution.~~ (b) **The government should introduce legislation to tackle pollution.** Cả hai đều hiểu được. Câu (a): **solve the pollution** là cặp lệch (pollution không phải “bài toán” để giải; thừa cả the), còn **make a law** đúng nhưng nhạt và chung chung; giám khảo ghi nhận cặp lệch là lỗi **chọn từ**. Câu (b) dùng đúng hai collocation. Chênh lệch giữa LR 6 và LR 7 phần lớn nằm ở đây.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Cùng một ý — ghép từ band 6 và band 7",
        cols: [
          { title: "Band 6: đúng nghĩa, lệch cặp", items: ["~~make~~ research", "~~solve~~ pollution", "~~give~~ a threat", "~~do~~ a decision", "~~rise~~ awareness", "~~get~~ a conclusion", "~~reduce~~ the gap (được, nhưng nhạt)"] },
          { title: "Band 7: đúng cặp", items: ["**conduct** research", "**tackle** pollution", "**pose** a threat", "**reach / make** a decision", "**raise** awareness", "**draw / reach** a conclusion", "**bridge / narrow** the gap"] },
        ],
        caption: "Không có luật để suy ra cặp đúng — phải học thuộc theo cụm, giống học giới từ đi kèm.",
      },
      {
        t: "note",
        title: "💡 Cách học 60 cụm trong một tuần",
        items: [
          "Mỗi ngày **một nhóm 12 cụm**. Che cột động từ, nhìn danh từ, nói to động từ.",
          "Với mỗi cụm, viết **một câu về chủ đề bạn hay gặp** (môi trường, giáo dục, công nghệ) — không chép câu mẫu.",
          "Học luôn dạng **bị động** vì bài viết dùng nhiều: research **was conducted** · measures **were taken** · a ban **was imposed**.",
          "Mọi cụm trong bài tự vào bộ flashcard “Từ của khoá — Tập 4”.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Nhóm A — Nghiên cứu và bằng chứng (12 cụm)" },
      { t: "p", text: "Dùng khi bạn dẫn chứng trong Task 2 (“Studies conducted in… have shown that…”) và khi nói Part 3 (“There's been a lot of research into…”)." },
      {
        t: "vocab",
        items: [
          { w: "conduct research", pos: "v + n", ipa: "/kənˈdʌkt rɪˈsɜːtʃ/", vi: "tiến hành nghiên cứu", ex: "Scientists have conducted extensive research into the effects of screen time on children.", exVi: "Các nhà khoa học đã tiến hành nghiên cứu sâu rộng về ảnh hưởng của thời gian dùng màn hình lên trẻ em.", more: "= **carry out / do / undertake** research · research **into / on** · research không đếm được: ~~a research~~, ~~researches~~ → **a study / a piece of research** · KHÔNG ~~make research~~" },
          { w: "carry out a survey", pos: "v + n", ipa: "/ˌkæri ˈaʊt ə ˈsɜːveɪ/", vi: "thực hiện một cuộc khảo sát", ex: "The council carried out a survey of 2,000 residents before changing the bus routes.", exVi: "Hội đồng thành phố đã khảo sát 2.000 cư dân trước khi đổi tuyến xe buýt.", more: "carry out **a survey / a study / an experiment / an investigation** · = conduct · a survey **of** people · a survey **on / about** a topic" },
          { w: "undertake a study", pos: "v + n", ipa: "/ˌʌndəˈteɪk ə ˈstʌdi/", vi: "tiến hành một nghiên cứu (trang trọng)", ex: "A ten-year study was undertaken to measure the long-term benefits of the programme.", exVi: "Một nghiên cứu mười năm đã được tiến hành để đo lợi ích dài hạn của chương trình.", more: "undertake **a study / a review / a project / a task** · trang trọng hơn carry out · undertook – undertaken" },
          { w: "collect data", pos: "v + n", ipa: "/kəˈlekt ˈdeɪtə/", vi: "thu thập dữ liệu", ex: "The app collects data on users' sleeping habits.", exVi: "Ứng dụng thu thập dữ liệu về thói quen ngủ của người dùng.", more: "**collect / gather / analyse / interpret** data · data **on** · data + động từ số ít hoặc số nhiều đều được chấp nhận (the data **shows / show**)" },
          { w: "test a hypothesis", pos: "v + n", ipa: "/test ə haɪˈpɒθəsɪs/", vi: "kiểm định một giả thuyết", ex: "The experiment was designed to test the hypothesis that noise reduces concentration.", exVi: "Thí nghiệm được thiết kế để kiểm định giả thuyết rằng tiếng ồn làm giảm sự tập trung.", more: "**test / support / confirm / reject** a hypothesis · số nhiều: hypothes**e**s /haɪˈpɒθəsiːz/" },
          { w: "provide evidence", pos: "v + n", ipa: "/prəˈvaɪd ˈevɪdəns/", vi: "đưa ra bằng chứng", ex: "The report provides clear evidence that smaller classes improve results.", exVi: "Báo cáo đưa ra bằng chứng rõ ràng rằng lớp ít học sinh hơn cải thiện kết quả.", more: "provide **clear / strong / little** evidence **of / for / that** · evidence không đếm được: ~~an evidence~~, ~~evidences~~ · KHÔNG ~~give a proof~~" },
          { w: "yield results", pos: "v + n", ipa: "/jiːld rɪˈzʌlts/", vi: "cho ra kết quả", ex: "The new teaching method has yielded impressive results in rural schools.", exVi: "Phương pháp dạy mới đã cho kết quả ấn tượng ở các trường nông thôn.", more: "yield **results / benefits / a profit / information** · = produce · trang trọng" },
          { w: "draw a conclusion", pos: "v + n", ipa: "/drɔː ə kənˈkluːʒn/", vi: "rút ra kết luận", ex: "It is too early to draw any firm conclusions from the data.", exVi: "Còn quá sớm để rút ra kết luận chắc chắn nào từ dữ liệu.", more: "**draw / reach / come to** a conclusion · draw a conclusion **from** · a **firm / tentative** conclusion · KHÔNG ~~get / make a conclusion~~" },
          { w: "reach a consensus", pos: "v + n", ipa: "/riːtʃ ə kənˈsensəs/", vi: "đạt được đồng thuận", ex: "Experts have yet to reach a consensus on the safest level of sugar intake.", exVi: "Giới chuyên gia vẫn chưa đạt được đồng thuận về mức tiêu thụ đường an toàn nhất.", more: "reach **a consensus / an agreement / a compromise / a verdict** · a consensus **on** · there is a **broad / growing** consensus that…" },
          { w: "raise a question", pos: "v + n", ipa: "/reɪz ə ˈkwestʃən/", vi: "đặt ra câu hỏi, làm nảy sinh vấn đề", ex: "The findings raise important questions about how schools are funded.", exVi: "Những phát hiện này đặt ra các câu hỏi quan trọng về cách trường học được cấp kinh phí.", more: "raise **a question / an issue / concerns / doubts** · raise (ngoại động từ, cần tân ngữ) ≠ rise · KHÔNG ~~rise a question~~" },
          { w: "shed light on", pos: "v + n + prep", ipa: "/ʃed ˈlaɪt ɒn/", vi: "làm sáng tỏ", ex: "Recent studies have shed new light on why teenagers need more sleep.", exVi: "Các nghiên cứu gần đây đã làm sáng tỏ thêm vì sao thanh thiếu niên cần ngủ nhiều hơn.", more: "shed **(new / further) light on** · shed – shed – shed · = clarify, help to explain · KHÔNG ~~shed lights~~" },
          { w: "challenge an assumption", pos: "v + n", ipa: "/ˈtʃælɪndʒ ən əˈsʌmpʃn/", vi: "thách thức một giả định, đặt lại vấn đề", ex: "The study challenges the assumption that older workers are less productive.", exVi: "Nghiên cứu này thách thức giả định rằng người lao động lớn tuổi kém năng suất hơn.", more: "challenge **an assumption / a view / the idea that** · **make** an assumption (đưa ra giả định) · a **common / widespread** assumption" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Nhóm B — Vấn đề và nguy cơ (12 cụm)" },
      { t: "p", text: "Dùng ở thân bài Problem / Solution và ở mọi câu nêu mặt tiêu cực. Lưu ý: **problem** thì **tackle / address / solve**; còn pollution, poverty, crime là hiện tượng nên **tackle / reduce / combat**, không ~~solve~~." },
      {
        t: "vocab",
        items: [
          { w: "pose a threat", pos: "v + n", ipa: "/pəʊz ə θret/", vi: "gây ra mối đe doạ", ex: "Rising sea levels pose a serious threat to coastal cities.", exVi: "Mực nước biển dâng gây ra mối đe doạ nghiêm trọng cho các thành phố ven biển.", more: "pose **a threat / a risk / a danger / a challenge / a problem** **to** · a **serious / major / real** threat · KHÔNG ~~give / make a threat~~" },
          { w: "cause damage", pos: "v + n", ipa: "/kɔːz ˈdæmɪdʒ/", vi: "gây thiệt hại", ex: "The floods caused extensive damage to roads and bridges.", exVi: "Lũ lụt gây thiệt hại trên diện rộng cho đường sá và cầu cống.", more: "cause **extensive / serious / lasting / irreversible** damage **to** · = **do** damage · damage không đếm được: ~~damages~~ (damages = tiền bồi thường) · KHÔNG ~~make damage~~" },
          { w: "do harm", pos: "v + n", ipa: "/duː hɑːm/", vi: "gây hại", ex: "Too much homework can do more harm than good.", exVi: "Quá nhiều bài tập về nhà có thể gây hại nhiều hơn lợi.", more: "**do / cause** harm **to** · do **more harm than good** (cụm rất hợp Task 2) · harm không đếm được · KHÔNG ~~make harm~~" },
          { w: "run the risk of", pos: "v + n + prep", ipa: "/rʌn ðə ˈrɪsk əv/", vi: "có nguy cơ (gặp phải điều xấu)", ex: "Countries that ignore this trend run the risk of falling behind.", exVi: "Những nước phớt lờ xu hướng này có nguy cơ bị tụt lại.", more: "run the risk **of + V-ing** · **take** a risk (chủ động liều) · **pose** a risk **to** (gây nguy cơ cho người khác) · be **at risk of**" },
          { w: "face a challenge", pos: "v + n", ipa: "/feɪs ə ˈtʃælɪndʒ/", vi: "đối mặt với thách thức", ex: "Many developing countries face the challenge of providing clean water.", exVi: "Nhiều nước đang phát triển đối mặt với thách thức cung cấp nước sạch.", more: "face **a challenge / a problem / difficulties / criticism** · bị động: **be faced with** (xem Ngày 5) · KHÔNG ~~face with a challenge~~ (chủ động không có with)" },
          { w: "tackle a problem", pos: "v + n", ipa: "/ˈtækl ə ˈprɒbləm/", vi: "xử lý, giải quyết (một cách quyết liệt)", ex: "Governments need to tackle the problem of youth unemployment.", exVi: "Các chính phủ cần xử lý vấn đề thất nghiệp ở giới trẻ.", more: "tackle **a problem / an issue / crime / poverty / climate change** · = deal with, combat · dùng được với hiện tượng — còn ~~solve pollution~~ thì sai" },
          { w: "address an issue", pos: "v + n", ipa: "/əˈdres ən ˈɪʃuː/", vi: "giải quyết, xử lý một vấn đề (trang trọng)", ex: "The new policy fails to address the underlying issue of low wages.", exVi: "Chính sách mới không giải quyết được vấn đề gốc rễ là lương thấp.", more: "address **an issue / a problem / a need / concerns / the root causes** · trang trọng hơn deal with · KHÔNG ~~address to an issue~~" },
          { w: "exacerbate a problem", pos: "v + n", ipa: "/ɪɡˈzæsəbeɪt ə ˈprɒbləm/", vi: "làm một vấn đề trầm trọng thêm", ex: "Building more roads may simply exacerbate the problem of congestion.", exVi: "Xây thêm đường có thể chỉ làm vấn đề tắc nghẽn trầm trọng thêm.", more: "exacerbate **a problem / the situation / inequality / tensions** · = aggravate, worsen, make … worse · ≠ alleviate" },
          { w: "alleviate poverty", pos: "v + n", ipa: "/əˈliːvieɪt ˈpɒvəti/", vi: "giảm bớt nghèo đói", ex: "Access to small loans has helped to alleviate poverty in rural areas.", exVi: "Việc tiếp cận các khoản vay nhỏ đã giúp giảm bớt nghèo đói ở nông thôn.", more: "alleviate **poverty / suffering / pressure / congestion / the problem** · = ease, relieve · alleviation (n) · KHÔNG ~~alleviate the poor~~" },
          { w: "bridge the gap", pos: "v + n", ipa: "/brɪdʒ ðə ɡæp/", vi: "thu hẹp khoảng cách", ex: "Scholarships can help to bridge the gap between rich and poor students.", exVi: "Học bổng có thể giúp thu hẹp khoảng cách giữa học sinh giàu và nghèo.", more: "**bridge / narrow / close** the gap **between A and B** · ≠ **widen** the gap · the **gender / income / generation** gap" },
          { w: "bear the cost", pos: "v + n", ipa: "/beə ðə kɒst/", vi: "gánh chi phí", ex: "It is usually taxpayers who bear the cost of such projects.", exVi: "Thường thì người nộp thuế là người gánh chi phí của những dự án như vậy.", more: "bear **the cost / the burden / responsibility** · = cover / meet the cost · **incur** costs (phát sinh chi phí) · bore – borne" },
          { w: "meet a need", pos: "v + n", ipa: "/miːt ə niːd/", vi: "đáp ứng một nhu cầu", ex: "The current system does not meet the needs of an ageing population.", exVi: "Hệ thống hiện tại không đáp ứng nhu cầu của một dân số đang già đi.", more: "meet **a need / demand / a target / a requirement / a deadline / expectations** · = satisfy, fulfil · KHÔNG ~~respond the need~~" },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-tv-ab",
        kind: "fill",
        title: "Luyện nhóm A + B — điền MỘT động từ (chia dạng nếu cần) (8 câu)",
        items: [
          { q: "Plastic waste ___ a serious threat to marine life.", answers: ["poses"] },
          { q: "The university ___ a survey of 5,000 graduates last year.", answers: ["conducted", "carried out", "undertook", "did"] },
          { q: "It is difficult to ___ firm conclusions from such a small sample.", answers: ["draw", "reach"] },
          { q: "The tax cut may actually ___ the problem of inequality rather than reduce it.", answers: ["exacerbate", "aggravate", "worsen"] },
          { q: "The discovery has ___ new light on how early humans lived.", answers: ["shed", "thrown", "cast"] },
          { q: "Online courses can help to ___ the gap between urban and rural students.", answers: ["bridge", "narrow", "close"] },
          { q: "Firms that refuse to modernise ___ the risk of losing their customers.", answers: ["run"] },
          { q: "The results ___ serious questions about the safety of the drug.", answers: ["raise"] },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Nhóm C — Chính sách và hành động (12 cụm)" },
      { t: "p", text: "Dùng cho mọi câu “chính phủ / nhà trường / doanh nghiệp nên làm gì” — tức gần như mọi kết bài và mọi đoạn giải pháp." },
      {
        t: "vocab",
        items: [
          { w: "implement a policy", pos: "v + n", ipa: "/ˈɪmplɪment ə ˈpɒləsi/", vi: "thực thi một chính sách", ex: "The policy was implemented in 2019 but has had little effect so far.", exVi: "Chính sách được thực thi năm 2019 nhưng tới nay hầu như chưa có tác dụng.", more: "implement **a policy / a plan / a scheme / reforms / changes** · implementation (n) · = put … into practice · mạnh hơn introduce: làm cho chạy thật" },
          { w: "introduce a measure", pos: "v + n", ipa: "/ˌɪntrəˈdjuːs ə ˈmeʒə/", vi: "đưa ra một biện pháp", ex: "Several cities have introduced measures to limit car use in the centre.", exVi: "Vài thành phố đã đưa ra các biện pháp hạn chế dùng ô tô ở trung tâm.", more: "**introduce / take / adopt** measures **to + V** · introduce **legislation / a law / a tax / a ban** · KHÔNG ~~make a measure~~ · make laws đúng nhưng chung chung — cụ thể hơn: **pass / introduce** a law" },
          { w: "take action", pos: "v + n", ipa: "/teɪk ˈækʃn/", vi: "hành động", ex: "Unless governments take urgent action, the situation will get worse.", exVi: "Nếu các chính phủ không hành động khẩn cấp, tình hình sẽ tệ hơn.", more: "take **urgent / immediate / decisive** action **to + V / on / against** · take **steps / measures** · action không có a: ~~take an action~~ · KHÔNG ~~do action~~" },
          { w: "impose a ban", pos: "v + n", ipa: "/ɪmˈpəʊz ə bæn/", vi: "áp lệnh cấm", ex: "The government imposed a ban on smoking in all public buildings.", exVi: "Chính phủ áp lệnh cấm hút thuốc trong mọi toà nhà công cộng.", more: "impose **a ban / restrictions / a tax / a fine / limits** **on** · ≠ **lift** a ban (dỡ bỏ) · KHÔNG ~~put a ban to~~" },
          { w: "enforce a law", pos: "v + n", ipa: "/ɪnˈfɔːs ə lɔː/", vi: "thực thi, bắt tuân thủ luật", ex: "The law exists, but it is rarely enforced.", exVi: "Luật thì có, nhưng hiếm khi được thực thi.", more: "enforce **a law / rules / regulations / a ban** · enforcement (n): law enforcement · **pass** a law (ban hành) → **enforce** (bắt thực hiện) → **break** a law (vi phạm)" },
          { w: "allocate resources", pos: "v + n", ipa: "/ˈæləkeɪt rɪˈzɔːsɪz/", vi: "phân bổ nguồn lực", ex: "More resources should be allocated to primary health care.", exVi: "Nên phân bổ thêm nguồn lực cho chăm sóc sức khoẻ ban đầu.", more: "allocate **resources / funding / money / time** **to** · allocation (n) · = devote … to · (đã gặp ở Tập 3 Ngày 6: allocate funding to)" },
          { w: "raise awareness", pos: "v + n", ipa: "/reɪz əˈweənəs/", vi: "nâng cao nhận thức", ex: "The campaign aims to raise public awareness of the dangers of sugar.", exVi: "Chiến dịch nhằm nâng cao nhận thức của công chúng về mối nguy của đường.", more: "raise **(public) awareness of / about** · KHÔNG ~~rise awareness~~ / ~~improve awareness~~ / ~~raise the awareness~~ · awareness không đếm được" },
          { w: "strike a balance", pos: "v + n", ipa: "/straɪk ə ˈbæləns/", vi: "tìm được sự cân bằng", ex: "Schools must strike a balance between academic subjects and creative ones.", exVi: "Trường học phải tìm được sự cân bằng giữa môn học thuật và môn sáng tạo.", more: "strike **a balance between A and B** · struck – struck · = find / achieve a balance · câu kết bài Discussion rất hay dùng" },
          { w: "set a precedent", pos: "v + n", ipa: "/set ə ˈpresɪdənt/", vi: "tạo tiền lệ", ex: "Allowing one company to ignore the rules would set a dangerous precedent.", exVi: "Cho phép một công ty phớt lờ quy định sẽ tạo ra một tiền lệ nguy hiểm.", more: "set **a precedent / an example / a standard / a target / a limit** · a **dangerous / legal** precedent · đừng nhầm với president" },
          { w: "exert pressure", pos: "v + n", ipa: "/ɪɡˈzɜːt ˈpreʃə/", vi: "gây áp lực", ex: "Consumers can exert pressure on companies by refusing to buy their products.", exVi: "Người tiêu dùng có thể gây áp lực lên doanh nghiệp bằng cách từ chối mua sản phẩm.", more: "exert **pressure / influence / control** **on / over** · = **put** pressure **on** (ít trang trọng hơn) · be **under** pressure **to + V**" },
          { w: "take responsibility", pos: "v + n", ipa: "/teɪk rɪˌspɒnsəˈbɪləti/", vi: "nhận trách nhiệm", ex: "Individuals should take responsibility for their own health.", exVi: "Mỗi cá nhân nên tự chịu trách nhiệm về sức khoẻ của mình.", more: "**take / accept / bear / assume** responsibility **for** · KHÔNG ~~take responsibility of~~ / ~~have responsible for~~ · be responsible **for**" },
          { w: "play a role", pos: "v + n", ipa: "/pleɪ ə rəʊl/", vi: "đóng vai trò", ex: "Parents play a crucial role in shaping their children's attitudes.", exVi: "Cha mẹ đóng vai trò then chốt trong việc hình thành thái độ của con cái.", more: "play **a key / crucial / vital / major / an active** role **in + N / V-ing** · = play a part in · KHÔNG ~~play a role on~~ / ~~keep a role~~" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Nhóm D — Lập luận và quan điểm (12 cụm)" },
      { t: "p", text: "Dùng để thuật lại ý người khác (Discussion essay) và nêu lập trường của mình mà không lặp “think” mười lần." },
      {
        t: "vocab",
        items: [
          { w: "put forward an argument", pos: "phr v + n", ipa: "/pʊt ˈfɔːwəd ən ˈɑːɡjumənt/", vi: "đưa ra một lập luận", ex: "Several arguments have been put forward in favour of a shorter working week.", exVi: "Đã có nhiều lập luận được đưa ra ủng hộ tuần làm việc ngắn hơn.", more: "put forward **an argument / a proposal / a theory / a suggestion** · = advance, present · an argument **for / against / in favour of** · KHÔNG ~~give an argue~~" },
          { w: "hold a view", pos: "v + n", ipa: "/həʊld ə vjuː/", vi: "giữ một quan điểm", ex: "Many economists hold the view that free trade benefits everyone.", exVi: "Nhiều nhà kinh tế giữ quan điểm rằng thương mại tự do có lợi cho mọi người.", more: "hold **a view / an opinion / a belief** · the **widely held** view that… · held – held · = take the view that" },
          { w: "adopt an approach", pos: "v + n", ipa: "/əˈdɒpt ən əˈprəʊtʃ/", vi: "áp dụng một cách tiếp cận", ex: "Finland has adopted a very different approach to early education.", exVi: "Phần Lan đã áp dụng một cách tiếp cận rất khác đối với giáo dục sớm.", more: "adopt **an approach / a policy / a strategy / a position** · an approach **to** (to là giới từ: an approach to **teaching**) · adopt ≠ adapt (điều chỉnh)" },
          { w: "take … into account", pos: "v + prep + n", ipa: "/teɪk ˌɪntu əˈkaʊnt/", vi: "tính đến, cân nhắc", ex: "Any solution must take the needs of local people into account.", exVi: "Mọi giải pháp đều phải tính đến nhu cầu của người dân địa phương.", more: "take **sth into account / into consideration** · tân ngữ dài thì để sau: take into account **the fact that**… · = consider, allow for" },
          { w: "give rise to", pos: "v + n + prep", ipa: "/ɡɪv ˈraɪz tə/", vi: "làm nảy sinh, dẫn đến", ex: "Rapid urbanisation has given rise to a range of social problems.", exVi: "Đô thị hoá nhanh đã làm nảy sinh hàng loạt vấn đề xã hội.", more: "give rise to **problems / concerns / a debate / speculation** · = lead to, cause · trang trọng · KHÔNG ~~give a rise to~~ / ~~give raise to~~" },
          { w: "lend support to", pos: "v + n + prep", ipa: "/lend səˈpɔːt tə/", vi: "củng cố, ủng hộ (một ý, giả thuyết)", ex: "These figures lend support to the idea that prevention is cheaper than cure.", exVi: "Những con số này củng cố ý kiến rằng phòng bệnh rẻ hơn chữa bệnh.", more: "lend **support / weight / credibility** to **the idea / view / claim that** · lent – lent · = support, back up" },
          { w: "cast doubt on", pos: "v + n + prep", ipa: "/kɑːst ˈdaʊt ɒn/", vi: "gây nghi ngờ về", ex: "New evidence has cast doubt on the official explanation.", exVi: "Bằng chứng mới đã gây nghi ngờ về lời giải thích chính thức.", more: "cast **(serious) doubt on** a claim / a theory / the results · cast – cast – cast · = call … into question · ≠ lend support to" },
          { w: "draw a distinction", pos: "v + n", ipa: "/drɔː ə dɪˈstɪŋkʃn/", vi: "phân biệt rạch ròi", ex: "We need to draw a distinction between using technology and depending on it.", exVi: "Ta cần phân biệt rạch ròi giữa dùng công nghệ và phụ thuộc vào nó.", more: "**draw / make** a (clear) distinction **between A and B** · draw **a comparison / a parallel** between · KHÔNG ~~do a distinction~~" },
          { w: "draw attention to", pos: "v + n + prep", ipa: "/drɔː əˈtenʃn tə/", vi: "hướng sự chú ý tới", ex: "The film drew attention to the conditions in which the workers lived.", exVi: "Bộ phim hướng sự chú ý tới điều kiện sống của những người công nhân.", more: "**draw / call** attention **to** · **pay** attention **to** (chú ý tới) · **attract** attention (thu hút) · KHÔNG ~~take attention~~ / ~~put attention~~" },
          { w: "attach importance to", pos: "v + n + prep", ipa: "/əˈtætʃ ɪmˈpɔːtns tə/", vi: "coi trọng", ex: "Employers attach great importance to communication skills.", exVi: "Nhà tuyển dụng rất coi trọng kỹ năng giao tiếp.", more: "attach **great / little / too much** importance **to** · = place importance / emphasis **on** · KHÔNG ~~give importance for~~" },
          { w: "make a case for", pos: "v + n + prep", ipa: "/meɪk ə ˈkeɪs fə/", vi: "đưa ra lý lẽ ủng hộ", ex: "The report makes a strong case for investing in public transport.", exVi: "Báo cáo đưa ra lý lẽ mạnh mẽ ủng hộ việc đầu tư vào giao thông công cộng.", more: "make **a (strong / convincing) case for / against** · there is **a strong case for** + V-ing — khung câu rất tốt cho thesis" },
          { w: "reach a decision", pos: "v + n", ipa: "/riːtʃ ə dɪˈsɪʒn/", vi: "đi đến quyết định", ex: "The committee has not yet reached a decision on the proposal.", exVi: "Uỷ ban chưa đi đến quyết định về đề xuất này.", more: "**make / take / reach / come to** a decision **on / about** · KHÔNG ~~do a decision~~ · a **difficult / informed** decision" },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-tv-cd",
        title: "Luyện nhóm C + D — chọn động từ đúng (8 câu)",
        items: [
          { q: "1. Governments should ___ stricter limits on advertising aimed at children.", options: ["impose", "put up", "exert", "strike"], correct: 0, why: "**impose** limits / restrictions / a ban **on**. exert đi với pressure / influence; strike đi với a balance." },
          { q: "2. The campaign was designed to ___ awareness of mental health among students.", options: ["rise", "lift", "raise", "grow"], correct: 2, why: "**raise** awareness. rise là nội động từ (không có tân ngữ)." },
          { q: "3. Any transport plan must ___ the needs of disabled passengers into account.", options: ["put", "take", "bring", "hold"], correct: 1, why: "**take** sth into account / into consideration." },
          { q: "4. The new data ___ doubt on the claim that the scheme saves money.", options: ["give", "lend", "draw", "cast"], correct: 3, why: "**cast** doubt on. lend đi với support / weight; draw đi với attention / a distinction." },
          { q: "5. Laws against littering exist in most cities, but they are rarely ___.", options: ["enforced", "exerted", "allocated", "struck"], correct: 0, why: "**enforce** a law = bắt tuân thủ. Bị động: laws are rarely enforced." },
          { q: "6. A good education system has to ___ a balance between knowledge and skills.", options: ["do", "strike", "keep up", "catch"], correct: 1, why: "**strike** a balance between A and B." },
          { q: "7. Rising rents have ___ rise to a wave of protests.", options: ["made", "taken", "given", "put"], correct: 2, why: "**give rise to** = làm nảy sinh. Không có ~~make rise to~~." },
          { q: "8. Teachers ___ a vital role in building children's confidence.", options: ["take", "make", "do", "play"], correct: 3, why: "**play** a role / a part **in**." },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Nhóm E — Thay đổi và kết quả (12 cụm)" },
      { t: "p", text: "Dùng cho câu nêu lợi ích, hệ quả, và cho đoạn kết luận." },
      {
        t: "vocab",
        items: [
          { w: "bring about change", pos: "phr v + n", ipa: "/brɪŋ əˈbaʊt tʃeɪndʒ/", vi: "mang lại, tạo ra thay đổi", ex: "Social media has brought about a profound change in the way people get their news.", exVi: "Mạng xã hội đã tạo ra một thay đổi sâu sắc trong cách người ta tiếp nhận tin tức.", more: "bring about **(a) change / reform / improvements / the collapse of** · = cause, lead to · a change **in** (không phải ~~of~~) · brought – brought" },
          { w: "undergo a transformation", pos: "v + n", ipa: "/ˌʌndəˈɡəʊ ə ˌtrænsfəˈmeɪʃn/", vi: "trải qua một cuộc chuyển mình", ex: "The city centre has undergone a complete transformation in the past decade.", exVi: "Trung tâm thành phố đã trải qua một cuộc lột xác hoàn toàn trong thập kỷ qua.", more: "undergo **a transformation / changes / surgery / training / tests** · underwent – undergone · không dùng bị động · hợp cả Task 1 map" },
          { w: "have an impact on", pos: "v + n + prep", ipa: "/hæv ən ˈɪmpækt ɒn/", vi: "có tác động lên", ex: "Tourism has had a significant impact on the local environment.", exVi: "Du lịch đã có tác động đáng kể lên môi trường địa phương.", more: "have **a significant / profound / lasting / negative** impact / effect / influence **on** · KHÔNG ~~make an impact to~~ / ~~have an impact to~~ · affect (v) không có on: ~~affect on~~" },
          { w: "make progress", pos: "v + n", ipa: "/meɪk ˈprəʊɡres/", vi: "tiến bộ, đạt tiến triển", ex: "The country has made considerable progress in reducing child mortality.", exVi: "Đất nước này đã đạt tiến bộ đáng kể trong việc giảm tử vong trẻ em.", more: "make **considerable / rapid / little** progress **in / towards** · progress không đếm được: ~~a progress~~, ~~progresses~~ · KHÔNG ~~do progress~~" },
          { w: "gain access to", pos: "v + n + prep", ipa: "/ɡeɪn ˈækses tə/", vi: "có được quyền tiếp cận", ex: "Millions of people have gained access to the internet through cheap smartphones.", exVi: "Hàng triệu người đã tiếp cận được internet nhờ điện thoại thông minh giá rẻ.", more: "**gain / have / provide / deny** access **to** · access (v) không có to: ~~access to the internet~~ → **access the internet**" },
          { w: "achieve a goal", pos: "v + n", ipa: "/əˈtʃiːv ə ɡəʊl/", vi: "đạt mục tiêu", ex: "Without proper funding, the scheme is unlikely to achieve its goals.", exVi: "Nếu không có kinh phí đầy đủ, chương trình khó đạt được mục tiêu.", more: "**achieve / reach / attain** a goal / an aim / a target / success · KHÔNG ~~reach success~~ (đúng: achieve success) / ~~get the goal~~" },
          { w: "fulfil your potential", pos: "v + n", ipa: "/fʊlˈfɪl jɔː pəˈtenʃl/", vi: "phát huy hết tiềm năng", ex: "Every child deserves the chance to fulfil their potential.", exVi: "Mọi đứa trẻ đều xứng đáng có cơ hội phát huy hết tiềm năng của mình.", more: "**fulfil / reach / realise** your (full) potential · fulfil **a promise / a role / a requirement / an ambition** · Mỹ: fulfill" },
          { w: "boost the economy", pos: "v + n", ipa: "/buːst ði iˈkɒnəmi/", vi: "thúc đẩy nền kinh tế", ex: "Hosting the games is expected to boost the local economy.", exVi: "Việc đăng cai giải đấu được kỳ vọng sẽ thúc đẩy kinh tế địa phương.", more: "boost **the economy / sales / productivity / confidence / tourism** · = stimulate · a boost **to** (n) · KHÔNG ~~rise the economy~~" },
          { w: "generate revenue", pos: "v + n", ipa: "/ˈdʒenəreɪt ˈrevənjuː/", vi: "tạo ra doanh thu / nguồn thu", ex: "A tax on plastic bags would generate revenue for environmental projects.", exVi: "Thuế đánh vào túi nhựa sẽ tạo nguồn thu cho các dự án môi trường.", more: "generate **revenue / income / profit / jobs / electricity / interest** · tax revenue · KHÔNG ~~make revenue~~" },
          { w: "create opportunities", pos: "v + n", ipa: "/kriˈeɪt ˌɒpəˈtjuːnətiz/", vi: "tạo ra cơ hội", ex: "Remote working has created new opportunities for people in small towns.", exVi: "Làm việc từ xa đã tạo ra cơ hội mới cho người ở các thị trấn nhỏ.", more: "**create / provide / offer** opportunities **for sb / to + V** · create **jobs / wealth / demand** · **take / seize / miss** an opportunity · KHÔNG ~~make opportunities~~" },
          { w: "reap the benefits", pos: "v + n", ipa: "/riːp ðə ˈbenɪfɪts/", vi: "hưởng thành quả, gặt hái lợi ích", ex: "Countries that invested early in education are now reaping the benefits.", exVi: "Những nước đầu tư sớm vào giáo dục nay đang gặt hái thành quả.", more: "reap **the benefits / rewards of** · = enjoy the benefits · **bring / offer** benefits (đem lại) · **outweigh** the benefits" },
          { w: "meet demand", pos: "v + n", ipa: "/miːt dɪˈmɑːnd/", vi: "đáp ứng nhu cầu (thị trường)", ex: "The country cannot build houses fast enough to meet demand.", exVi: "Đất nước không thể xây nhà đủ nhanh để đáp ứng nhu cầu.", more: "meet **(the) demand for** · **growing / rising** demand · demand **for** (không phải ~~of~~) · supply and demand" },
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. make · do · have · take · give — năm động từ “rỗng” người Việt hay ghép sai" },
      {
        t: "p",
        text: "Tiếng Việt nói “làm nghiên cứu”, “làm hại”, “đưa ra quyết định”, “có ảnh hưởng”. Dịch chữ “làm” thành make hay do đều có thể sai. Năm động từ dưới đây gần như không mang nghĩa riêng — nghĩa nằm ở danh từ — nên **chỉ có cách thuộc theo cụm**.",
      },
      {
        t: "table",
        head: ["Động từ", "Đi với", "Lỗi hay gặp"],
        rows: [
          ["**make**", "a decision · an effort · progress · a contribution · a difference · a mistake · an assumption · a case for · a distinction · use of", "~~make research~~ · ~~make damage~~ · ~~make harm~~ · ~~make an impact to~~"],
          ["**do**", "research · harm · damage · business · your best · (more) good · without", "~~do a decision~~ · ~~do a mistake~~ · ~~do progress~~ · ~~do an effort~~"],
          ["**have**", "an effect / impact / influence on · access to · difficulty (in) + V-ing · the opportunity to · a tendency to", "~~have an effect to~~ · ~~have difficulty to do~~"],
          ["**take**", "action · measures · steps · responsibility for · … into account · advantage of · part in · place · a risk", "~~take an action~~ · ~~take care about~~ · ~~take part on~~"],
          ["**give**", "rise to · priority to · an example · an account of · consideration to · (sb) access to", "~~give a threat~~ · ~~give a research~~ · ~~give advices~~"],
        ],
        caption: "Mẹo: **make** thường là TẠO RA một thứ mới (a decision, progress, a mistake); **do** thường là LÀM một hoạt động (research, business, harm).",
      },
      {
        t: "note",
        title: "⚠️ Bốn cặp dễ nhầm trong chính 60 cụm hôm nay",
        items: [
          "**raise** (ngoại: raise awareness / a question / taxes) ≠ **rise** (nội: prices rise). ~~rise awareness~~ sai.",
          "**affect** (v) + tân ngữ ≠ **have an effect on**: Pollution **affects** health / **has an effect on** health. ~~affects on~~ sai.",
          "**solve a problem** nhưng **tackle / reduce / combat** pollution, crime, poverty. ~~solve pollution~~ sai vì pollution không phải “bài toán”.",
          "**face** a challenge (chủ động, không with) ≠ **be faced with** a challenge (bị động, có with).",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Dạng bị động và dạng danh từ — hai cách đổi một collocation" },
      {
        t: "p",
        text: "Nối **Ngày 5**: văn học thuật thích bị động và quan hệ rút gọn. Mỗi collocation verb + noun đổi được sang bị động (**research was conducted**), sang quan hệ rút gọn (**research conducted in 2020**), và nhiều cụm đổi được sang danh từ + of (**the implementation of the policy**). Biết ba dạng là bạn có ba cách paraphrase.",
      },
      {
        t: "table",
        head: ["Chủ động", "Bị động", "Rút gọn / danh hoá"],
        rows: [
          ["They **conducted** the research in 2020.", "The research **was conducted** in 2020.", "research **conducted** in 2020"],
          ["The government **took** measures to cut waste.", "Measures **were taken** to cut waste.", "the measures **taken** to cut waste"],
          ["The city **imposed** a ban on diesel cars.", "A ban **was imposed** on diesel cars.", "**the imposition of** a ban on diesel cars"],
          ["Schools **implemented** the policy slowly.", "The policy **was implemented** slowly.", "**the implementation of** the policy"],
          ["Few people **paid** attention to the warning.", "Little attention **was paid** to the warning.", "the attention **paid** to the warning"],
          ["The state **allocates** resources unevenly.", "Resources **are allocated** unevenly.", "**the allocation of** resources"],
        ],
        caption: "Nhớ: have an impact, undergo a transformation, play a role, run the risk — KHÔNG có bị động.",
      },

      /* ── 9 ── */
      { t: "h", text: "9. Academic Phrasebank nhập môn — 12 khung câu dựng từ collocation" },
      {
        t: "p",
        text: "**Phrasebank** = kho khung câu học thuật xếp theo **chức năng** (giới thiệu vấn đề, dẫn nghiên cứu, nêu hạn chế…). Khung câu không phải là “văn mẫu”: nó chỉ là cái khuôn, nội dung là của bạn. Dùng **hai – ba khung một bài** là vừa; nhiều hơn thì bài nghe như học thuộc (và giám khảo được dặn bỏ qua đoạn học thuộc).",
      },
      {
        t: "table",
        head: ["Chức năng", "Khung câu", "Ví dụ Task 2"],
        rows: [
          ["Giới thiệu vấn đề", "… **poses a growing threat to** …", "Air pollution **poses a growing threat to** public health in large cities."],
          ["Giới thiệu tranh luận", "… **has given rise to** a debate about whether …", "The spread of remote work **has given rise to** a debate about whether offices are still needed."],
          ["Dẫn nghiên cứu", "**Research conducted in** … **has shown that** …", "**Research conducted in** several countries **has shown that** smaller classes help weaker pupils most."],
          ["Dẫn bằng chứng", "**There is growing evidence that** …", "**There is growing evidence that** long commutes damage mental health."],
          ["Thuật ý người khác", "**It is widely held that** … / **Some hold the view that** …", "**Some hold the view that** university education should be free for all."],
          ["Nêu lý lẽ ủng hộ", "**There is a strong case for** + V-ing", "**There is a strong case for** taxing sugary drinks."],
          ["Nghi ngờ một ý", "**This casts doubt on the claim that** …", "**This casts doubt on the claim that** technology always saves time."],
          ["Nêu nguyên nhân", "… **plays a key role in** + V-ing", "Advertising **plays a key role in** shaping children's eating habits."],
          ["Nêu hệ quả", "… **has had a profound impact on** …", "Cheap flights **have had a profound impact on** the way people spend their holidays."],
          ["Đề xuất giải pháp", "**Measures should be taken to** + V", "**Measures should be taken to** bridge the gap between rural and urban schools."],
          ["Nêu điều kiện", "**Any solution must take into account** …", "**Any solution must take into account** the cost to taxpayers."],
          ["Kết luận cân bằng", "**A balance needs to be struck between** A **and** B", "**A balance needs to be struck between** economic growth **and** environmental protection."],
        ],
        caption: "Ngày 21 của Tập 4 sẽ mở rộng Phrasebank; hôm nay chỉ cần thuộc 12 khung này và tự đặt mỗi khung một câu.",
      },
      {
        t: "quiz",
        id: "t4d6-tv-khung",
        kind: "translate",
        title: "Dịch Việt → Anh — dùng khung câu ở mục 9 (5 câu)",
        grammar: "Academic Phrasebank — khung câu + collocation verb + noun",
        items: [
          { q: "Ô nhiễm không khí gây ra mối đe doạ ngày càng lớn cho sức khoẻ cộng đồng.", answers: ["Air pollution poses a growing threat to public health."], hint: "poses a growing threat to" },
          { q: "Cần có biện pháp để thu hẹp khoảng cách giữa người giàu và người nghèo.", answers: ["Measures should be taken to bridge the gap between the rich and the poor.", "Measures should be taken to bridge the gap between rich and poor.", "Measures should be taken to narrow the gap between the rich and the poor.", "Measures should be taken to narrow the gap between rich and poor.", "Measures should be taken to close the gap between the rich and the poor."], hint: "Measures should be taken to · bridge the gap between" },
          { q: "Ngày càng có nhiều bằng chứng cho thấy thiếu ngủ gây hại cho trí nhớ.", answers: ["There is growing evidence that a lack of sleep harms memory.", "There is growing evidence that lack of sleep harms memory.", "There is growing evidence that a lack of sleep damages memory.", "There is growing evidence that lack of sleep damages memory.", "There is growing evidence that a lack of sleep does harm to memory."], hint: "There is growing evidence that · a lack of sleep" },
          { q: "Cha mẹ đóng vai trò then chốt trong việc hình thành thói quen của con cái.", answers: ["Parents play a key role in shaping their children's habits.", "Parents play a crucial role in shaping their children's habits.", "Parents play a vital role in shaping their children's habits.", "Parents play a key role in forming their children's habits."], hint: "play a key role in + V-ing · shaping" },
          { q: "Cần tìm được sự cân bằng giữa tăng trưởng kinh tế và bảo vệ môi trường.", answers: ["A balance needs to be struck between economic growth and environmental protection.", "A balance must be struck between economic growth and environmental protection.", "We need to strike a balance between economic growth and environmental protection.", "A balance needs to be struck between economic growth and protecting the environment."], hint: "A balance needs to be struck between … and …" },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Luyện tập tổng hợp" },
      {
        t: "mcq",
        id: "t4d6-tv-chon",
        title: "Chọn cụm đúng (10 câu)",
        items: [
          { q: "1. A team of psychologists ___ a study of 800 teenagers over five years.", options: ["made", "conducted", "gave", "took"], correct: 1, why: "**conduct / carry out / undertake** a study. ~~make a study~~ không phải collocation học thuật." },
          { q: "2. Fast food does more ___ than good to children's health.", options: ["damages", "hurt", "harm", "injure"], correct: 2, why: "Cụm cố định **do more harm than good**." },
          { q: "3. The findings ___ support to the theory that language is learned socially.", options: ["lend", "borrow", "cast", "shed"], correct: 0, why: "**lend support / weight to**. cast đi với doubt; shed đi với light." },
          { q: "4. Tourism ___ a huge impact on the island's economy.", options: ["has made to", "affects on", "has done", "has had"], correct: 3, why: "**have an impact on**. ~~affect on~~ sai (affect không có giới từ)." },
          { q: "5. Smaller firms cannot ___ the cost of the new safety rules.", options: ["carry on", "bear", "keep", "pose"], correct: 1, why: "**bear the cost** = gánh chi phí." },
          { q: "6. The reforms ___ about a dramatic change in the way hospitals are run.", options: ["took", "gave", "brought", "set"], correct: 2, why: "**bring about** change = tạo ra thay đổi." },
          { q: "7. Experts have failed to ___ a consensus on the causes of the decline.", options: ["reach", "draw", "do", "strike"], correct: 0, why: "**reach** a consensus / an agreement. draw đi với a conclusion (không đi với consensus)." },
          { q: "8. It is essential to ___ a distinction between correlation and cause.", options: ["do", "take", "give", "draw"], correct: 3, why: "**draw / make** a distinction between A and B." },
          { q: "9. Very little progress has been ___ in reducing plastic waste.", options: ["done", "made", "taken", "reached"], correct: 1, why: "**make progress** → bị động: progress has been **made**." },
          { q: "10. Countries that invested in clean energy early are now ___ the benefits.", options: ["earning", "catching", "reaping", "winning"], correct: 2, why: "**reap the benefits / rewards**." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-tv-sua",
        kind: "fill",
        title: "Sửa collocation sai — viết lại ĐỘNG TỪ đúng (chia đúng dạng) (8 câu)",
        items: [
          { q: "The government should ~~solve~~ air pollution in big cities. → ___", answers: ["tackle", "reduce", "combat", "address"] },
          { q: "Scientists ~~made~~ an experiment to test the theory. → ___", answers: ["conducted", "carried out", "did", "performed"] },
          { q: "This campaign ~~rose~~ awareness of road safety. → ___", answers: ["raised"] },
          { q: "The committee finally ~~did~~ a decision last week. → ___", answers: ["made", "reached", "took"] },
          { q: "Social media ~~gives~~ a threat to young people's privacy. → ___", answers: ["poses"] },
          { q: "Parents should ~~have~~ responsibility for their children's behaviour. → ___", answers: ["take", "accept", "bear", "assume"] },
          { q: "The new airport will ~~make~~ thousands of job opportunities. → ___", answers: ["create", "provide", "offer", "generate"] },
          { q: "We cannot ~~get~~ any conclusions from just ten interviews. → ___", answers: ["draw", "reach"] },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d6-viet",
    kind: "writing",
    title: "Viết: Task 1 line graph 3 — nhiều đường, nhóm xu hướng",
    goal: "Viết trọn một bài Task 1 cho biểu đồ năm đường trong 20 phút: gom các đường thành 2–3 nhóm xu hướng, viết overview band 7 nêu cả xu hướng lẫn thay đổi thứ hạng, chọn 8–10 con số đáng nêu thay vì kể hết 25 số — đẩy TA band 7 (làm nổi bật đặc điểm chính) và CC (tổ chức theo nhóm).",
    minutes: 90,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Line graph bạn đã viết ở **Tập 2 Ngày 4** (một – hai đường, overview 2 câu) và **Tập 3 Ngày 8** (hai đường cắt nhau, đường Total, năm dự báo). Hôm nay: ==năm đường== trên một biểu đồ.",
          "Năm đường × năm mốc = 25 con số. Kể hết thì hết giờ, bài thành danh sách — đó là **TA band 5–6**. Band 7 đòi “**clearly presents and highlights key features**”: chọn và làm nổi bật.",
          "Chìa khoá là ==nhóm xu hướng==: đường nào cùng tăng, cùng giảm, cùng đi ngang thì tả **chung một khổ**, trong **một – hai câu**.",
          "Overview band 7 = xu hướng theo **nhóm** + một thay đổi **thứ hạng** (ai từ cuối lên đầu), không có số.",
          "Ngôn ngữ mới: both A and B · albeit at different rates · followed a similar pattern · by contrast · respectively · overtake · the gap widened. Dùng lại participle clause và with + N + V-ing của **Ngày 5**.",
          "Có hai bài mẫu cho cùng một đề — **band 6** và **band 7** (ước tính) — và bảng so theo 4 tiêu chí TA · CC · LR · GRA.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Band 6 và band 7 ở Task 1 khác nhau ở đâu?" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**TA** (trả lời đề)", "Có overview; thông tin được chọn nhưng còn **kể lần lượt từng đường**; chi tiết có chỗ thừa, có chỗ thiếu.", "Overview **rõ** về xu hướng chính; đặc điểm chính được **làm nổi bật** và có số minh hoạ; có thể mở rộng thêm đôi chỗ."],
          ["**CC** (mạch lạc)", "Sắp xếp được nhưng theo **thứ tự chú giải** của biểu đồ; từ nối máy móc (Moreover, Furthermore).", "Sắp xếp theo **logic của số liệu** (nhóm xu hướng); từ nối đa dạng, có referencing (the former, the latter, this figure)."],
          ["**LR** (từ vựng)", "Đủ dùng; lặp increase / decrease; đôi chỗ dùng từ chưa chuẩn.", "Linh hoạt, chính xác: climb, contract, halve, overtake, a fivefold increase; ý thức collocation (a steady decline, by far the largest)."],
          ["**GRA** (ngữ pháp)", "Trộn câu đơn và câu phức; lỗi có nhưng ít khi gây hiểu sai.", "Nhiều câu phức đa dạng (participle clause, with + N + V-ing, mệnh đề quan hệ, quá khứ hoàn thành với by); **phần lớn câu không lỗi**."],
        ],
        caption: "Tóm lại một câu: band 6 TẢ biểu đồ, band 7 PHÂN TÍCH biểu đồ rồi mới tả.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Đề mẫu — năm đường" },
      { t: "p", text: "**Đề:** The graph below shows the number of students enrolled in five subject areas at Westbrook University between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words. (Tên trường và số liệu là hư cấu để luyện tập.)" },
      {
        t: "chart",
        kind: "line",
        title: "Students enrolled in five subject areas at Westbrook University, 2000–2020",
        unit: "thousand",
        labels: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Computing", values: [2, 3, 4.5, 7, 9.5] },
          { name: "Business", values: [6, 7.5, 9, 8.5, 8] },
          { name: "Engineering", values: [4, 4.2, 4.5, 5, 5.5] },
          { name: "Humanities", values: [7, 6.5, 5.5, 4.5, 3.5] },
          { name: "Languages", values: [3, 2.8, 2.2, 1.5, 1] },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Ba phút đọc biểu đồ — 4 câu hỏi để NHÓM" },
      {
        t: "sodo",
        kind: "flow",
        title: "Nhóm xu hướng trong 3 phút",
        steps: [
          { label: "1. So điểm ĐẦU với điểm CUỐI của từng đường", sub: "↑ Computing 2 → 9.5 · ↑ Business 6 → 8 · ↑ Engineering 4 → 5.5 · ↓ Humanities 7 → 3.5 · ↓ Languages 3 → 1" },
          { label: "2. Gom đường cùng hướng thành nhóm", sub: "Nhóm TĂNG: Computing, Business, Engineering · Nhóm GIẢM: Humanities, Languages" },
          { label: "3. Trong mỗi nhóm: ai mạnh nhất? ai khác thường?", sub: "Computing tăng gần 5 lần · Business có đỉnh 2010 rồi tụt · Engineering gần như phẳng" },
          { label: "4. Thứ hạng đổi thế nào? Đường nào cắt nhau?", sub: "Computing: cuối bảng → đầu bảng · Humanities: đầu bảng → thứ tư · Business vượt Humanities trước 2005" },
        ],
        caption: "Bốn câu trả lời này CHÍNH LÀ dàn ý: bước 2 + 4 → overview; bước 3 → hai khổ thân bài.",
      },
      {
        t: "table",
        head: ["Kiểu nhóm", "Dùng khi", "Ví dụ"],
        rows: [
          ["Theo **hướng** (tăng / giảm / đi ngang)", "Các đường tách hướng rõ — hay gặp nhất", "3 ngành tăng · 2 ngành giảm"],
          ["Theo **mức** (cao / thấp)", "Mọi đường cùng hướng, khác độ lớn", "2 nước luôn trên 60% · 3 nước dưới 30%"],
          ["Theo **hình dạng** (đều / có đỉnh / dao động)", "Cùng hướng, cùng mức, khác đường đi", "A và B tăng đều · C lên đỉnh rồi giảm"],
          ["Theo **bản chất** (danh mục đề cho)", "Đề đã có sẵn loại: năng lượng tái tạo / hoá thạch", "gió + mặt trời · than + dầu"],
        ],
        caption: "Chỉ chọn MỘT kiểu nhóm cho cả bài. Đường nào không vào nhóm nào thì tả riêng một câu như “ngoại lệ”.",
      },
      {
        t: "note",
        title: "⚠️ Hay sai khi nhóm: ép đường vào nhóm không đúng",
        items: [
          "Business tăng tổng thể (6 → 8) nhưng **giảm sau 2010**. Viết “Business rose steadily” là **sai số liệu** (mất TA). Phải nói: rose to a peak in 2010 **before slipping back**.",
          "Engineering tăng nhưng **rất ít** (+1.5). Gộp chung câu với Computing thì phải có từ phân biệt mức: **albeit far more slowly / at very different rates**.",
          "Đừng nhóm theo thứ tự chú giải (Computing, Business, Engineering…) — đó là thứ tự của người vẽ, không phải logic của số liệu.",
        ],
      },
      {
        t: "mcq",
        id: "t4d6-viet-nhom",
        title: "Nhóm đường — theo biểu đồ Westbrook (5 câu)",
        items: [
          { q: "1. Cách chia thân bài nào hợp lý nhất?", options: ["Thân 1: 2000–2010 · Thân 2: 2010–2020", "Thân 1: Computing, Business, Engineering · Thân 2: Humanities, Languages", "Mỗi ngành một khổ — năm khổ", "Thân 1: Computing · Thân 2: bốn ngành còn lại"], correct: 1, why: "Ba ngành tăng / hai ngành giảm là đường phân chia rõ nhất. Chia theo thời gian buộc phải nhắc cả năm đường hai lần; năm khổ thì thành danh sách." },
          { q: "2. Câu nào đúng với số liệu?", options: ["Business rose steadily throughout the period.", "Business fell after 2005.", "Business peaked in 2010 and then declined slightly.", "Business was always the most popular subject."], correct: 2, why: "6 → 7.5 → **9** (2010) → 8.5 → 8. A sai vì giảm sau 2010; D sai vì năm 2000 Humanities (7) cao hơn và năm 2020 Computing (9.5) cao hơn." },
          { q: "3. Computing vượt Business trong khoảng nào?", options: ["2005–2010", "2010–2015", "2000–2005", "2015–2020"], correct: 3, why: "2015: Computing 7 < Business 8.5; 2020: Computing 9.5 > Business 8 ⇒ vượt trong 2015–2020." },
          { q: "4. Thay đổi thứ hạng nào đáng đưa vào overview nhất?", options: ["Computing đi từ thấp nhất lên cao nhất.", "Engineering từ thứ ba vẫn ở thứ ba.", "Languages từ thứ tư xuống thứ năm.", "Business từ thứ hai vẫn ở thứ hai."], correct: 0, why: "Từ cuối bảng lên đầu bảng là thay đổi nổi bật nhất. B và D là “không đổi”, C là thay đổi nhỏ." },
          { q: "5. Con số nào KHÔNG cần nêu trong bài?", options: ["Computing năm 2020: 9,500", "Humanities năm 2000: 7,000", "Engineering năm 2005: 4,200", "Business năm 2010: 9,000 (đỉnh)"], correct: 2, why: "4,200 là một điểm giữa của đường gần như phẳng — không phải đầu, cuối, đỉnh hay điểm cắt ⇒ bỏ." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Overview band 7 — nhóm + thứ hạng, không số" },
      {
        t: "sodo",
        kind: "compare",
        title: "Overview cho biểu đồ Westbrook",
        cols: [
          { title: "Band 6 (ước tính)", items: ["Overall, it is clear that some subjects increased and other subjects decreased. Computing had the biggest change.", "✘ “some… other…” — không nói ngành nào", "✘ “the biggest change” — tăng hay giảm?", "✘ không nói gì về thứ hạng"] },
          { title: "Band 7 (ước tính)", items: ["Overall, enrolments in computing, business and engineering all increased, **albeit at very different rates**, while humanities and languages lost students throughout. As a result, computing **moved from last place to first**, and humanities from first to fourth.", "✔ gọi tên hai nhóm", "✔ có mức độ (very different rates)", "✔ có thay đổi thứ hạng", "✔ không có con số"] },
        ],
        caption: "Overview đứng ngay sau câu mở bài. Hai câu, 35–45 từ.",
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "Overall, A, B and C all + V-ed, while / whereas D and E + V-ed.",
            vi: "Câu overview 1: hai nhóm xu hướng.",
            examples: [
              { en: "Overall, spending on housing, transport and health care all rose, whereas the shares going to food and clothing fell.", vi: "Nhìn chung, chi tiêu cho nhà ở, giao thông và y tế đều tăng, trong khi phần dành cho thực phẩm và quần áo giảm." },
            ],
          },
          {
            formula: "As a result, A moved from … place to …, overtaking B. / By the end of the period, A had replaced B as the most popular …",
            vi: "Câu overview 2: thay đổi thứ hạng (không số).",
            examples: [
              { en: "By the end of the period, computing had replaced humanities as the most popular field.", vi: "Đến cuối giai đoạn, công nghệ thông tin đã thay thế nhân văn làm ngành được chọn nhiều nhất." },
            ],
          },
        ],
      },
      { t: "rule", formula: "Overall, [nhóm 1] all rose, albeit at different rates, while [nhóm 2] declined. + [thay đổi thứ hạng].", vi: "Overview band 7 = xu hướng theo NHÓM + một thay đổi THỨ HẠNG. Không số, không năm lẻ." },

      /* ── 5 ── */
      { t: "h", text: "5. Ngôn ngữ nhóm và so sánh — 6 khung câu" },
      {
        t: "table",
        head: ["Việc cần làm", "Khung câu", "Ví dụ (biểu đồ Westbrook)"],
        rows: [
          ["Hai đường cùng hướng", "**Both** A **and** B + V · A and B **followed a similar pattern**", "Humanities and languages **followed a similar pattern**, both declining in every five-year period."],
          ["Cùng hướng, khác mức", "…, **albeit** (far) more slowly / at a lower level", "Engineering also grew, **albeit far more slowly**, gaining only 1,500 students."],
          ["Hai số cho hai đường", "… to X and Y **respectively**", "Humanities and languages fell to 3,500 and 1,000 **respectively**."],
          ["Chuyển sang nhóm đối lập", "**By contrast,** / **In contrast,** / The opposite was true of…", "**By contrast**, the two arts subjects moved in the opposite direction."],
          ["Vượt nhau", "A **overtook** B in / by … · A **had been overtaken by** B **by** 2005", "Humanities **had been overtaken by** business **by** 2005."],
          ["Khoảng cách", "the gap between A and B **widened / narrowed** (to …)", "**The gap between** business and engineering **widened** from 2,000 to 4,500 by 2010."],
        ],
        caption: "albeit /ˌɔːlˈbiːɪt/ = although, nhưng đi với cụm từ (không đi với mệnh đề đủ S + V): albeit slowly · albeit at a lower level.",
      },
      {
        t: "note",
        title: "⚠️ Sai hay gặp: respectively và the former / the latter",
        items: [
          "**respectively** chỉ dùng khi có **hai danh sách cùng thứ tự**: A and B rose to 5 and 7 **respectively** (A–5, B–7). ~~The figure rose to 5 respectively.~~ sai.",
          "respectively đứng **cuối cụm số**, sau dấu phẩy cũng được: 3,500 and 1,000, respectively.",
          "**the former** = cái nhắc trước, **the latter** = cái nhắc sau — chỉ dùng khi vừa nêu **đúng hai** thứ. Ba thứ trở lên thì nhắc lại tên.",
          "~~Both computing and business were increased.~~ → increase / rise là nội động từ khi tả số liệu: both **increased**.",
        ],
      },
      {
        t: "quiz",
        id: "t4d6-viet-khung-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — theo biểu đồ Westbrook (5 câu)",
        grammar: "ngôn ngữ nhóm: both… and · albeit · respectively · by contrast · overtake",
        items: [
          { q: "Nhân văn và ngoại ngữ đi theo một mô hình tương tự.", answers: ["Humanities and languages followed a similar pattern.", "Humanities and languages followed a similar trend."], hint: "followed a similar pattern" },
          { q: "Kỹ thuật cũng tăng, dù chậm hơn nhiều.", answers: ["Engineering also grew, albeit far more slowly.", "Engineering also rose, albeit far more slowly.", "Engineering also increased, albeit far more slowly.", "Engineering also grew, albeit much more slowly.", "Engineering also increased, albeit much more slowly.", "Engineering also rose, albeit much more slowly."], hint: "albeit far more slowly" },
          { q: "Đến năm 2020, nhân văn và ngoại ngữ đã giảm xuống lần lượt còn 3.500 và 1.000.", answers: ["By 2020, humanities and languages had fallen to 3,500 and 1,000 respectively.", "By 2020, humanities and languages had fallen to 3,500 and 1,000, respectively.", "By 2020, humanities and languages had dropped to 3,500 and 1,000 respectively.", "By 2020, humanities and languages had declined to 3,500 and 1,000 respectively."], hint: "By 2020 … had fallen to … respectively" },
          { q: "Công nghệ thông tin vượt kinh doanh trong năm năm cuối.", answers: ["Computing overtook business in the final five years.", "Computing overtook business in the last five years.", "Computing overtook business during the final five years."], hint: "overtook · in the final five years" },
          { q: "Ngược lại, hai ngành xã hội – nhân văn đi theo hướng ngược lại.", answers: ["By contrast, the two arts subjects moved in the opposite direction.", "In contrast, the two arts subjects moved in the opposite direction."], hint: "By contrast · the two arts subjects · in the opposite direction" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Chọn số: mỗi đường tối đa ba con số" },
      {
        t: "p",
        text: "Luật cho biểu đồ nhiều đường: mỗi đường chỉ đáng **đầu – cuối**, cộng thêm **một** điểm đặc biệt nếu có (đỉnh, đáy, điểm cắt). Đường phẳng thì chỉ cần mức thay đổi (“gaining only 1,500”). Năm đường ⇒ khoảng **8–10 con số** cho cả bài. Và thay vì chép số, hãy **tính một bước**: gấp mấy lần, giảm một nửa, giảm hai phần ba — đó là “highlight”.",
      },
      {
        t: "table",
        head: ["Đường", "Số thô", "Số nên viết", "Cách nói band 7"],
        rows: [
          ["Computing", "2 · 3 · 4.5 · 7 · 9.5", "2,000 → 9,500", "an almost **fivefold** increase"],
          ["Business", "6 · 7.5 · 9 · 8.5 · 8", "đỉnh 9,000 (2010) → 8,000", "rose **by half** to a peak of 9,000 **before slipping back** to 8,000"],
          ["Engineering", "4 · 4.2 · 4.5 · 5 · 5.5", "+1,500 → 5,500", "**gaining only** 1,500 students to finish at 5,500"],
          ["Humanities", "7 · 6.5 · 5.5 · 4.5 · 3.5", "7,000 → 3,500", "**halving** to 3,500"],
          ["Languages", "3 · 2.8 · 2.2 · 1.5 · 1", "3,000 → 1,000", "falling **by two-thirds** to **a mere** 1,000"],
        ],
        caption: "Nối Tập 3 Ngày 11 (bội số, phân số): fivefold · by half · halve · by two-thirds. Kiểm lại phép tính trước khi viết — tính sai là mất TA.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Dàn ý 4 đoạn" },
      {
        t: "sodo",
        kind: "flow",
        title: "Dàn ý (3 phút) — bài 170–190 từ",
        steps: [
          { label: "Mở bài (1 câu)", sub: "Paraphrase đề: shows how many students were enrolled in… at five-year intervals between 2000 and 2020." },
          { label: "Overview (2 câu)", sub: "3 ngành tăng, khác tốc độ / 2 ngành giảm + Computing cuối → đầu, Humanities đầu → thứ tư." },
          { label: "Thân 1 — nhóm TĂNG (3 câu)", sub: "Computing (2,000 → 9,500, vượt Business) · Business (đỉnh 2010 rồi tụt) · Engineering (phẳng)." },
          { label: "Thân 2 — nhóm GIẢM (2–3 câu)", sub: "Humanities (lớn nhất 2000, bị Business vượt trước 2005, giảm một nửa) · Languages (cùng mô hình, giảm 2/3)." },
        ],
        caption: "Task 1 KHÔNG có kết bài và KHÔNG có ý kiến / lý do (“because students want jobs” là bịa — mất TA).",
      },

      /* ── 8 ── */
      { t: "h", text: "8. Hai bài mẫu cho cùng một đề — band 6 và band 7 (ước tính)" },
      { t: "p", text: "Đọc bài band 6 trước và tự hỏi: bài này **thiếu** gì? Rồi đọc bài band 7. Mức band ghi ở đây là **ước tính** theo mô tả band công khai, không phải điểm chấm chính thức." },
      {
        t: "passage",
        title: "Bài mẫu band 6 (ước tính) — 168 từ",
        paras: [
          { text: "The line graph gives information about the number of students in five subjects at Westbrook University from 2000 to 2020." },
          { text: "Overall, it is clear that some subjects increased and other subjects decreased. Computing had the biggest change." },
          { text: "In 2000, the number of computing students was 2,000. Then it increased to 3,000 in 2005 and 4,500 in 2010. After that, it rose significantly to 7,000 in 2015 and reached 9,500 in 2020. Business started at 6,000 and increased to 9,000 in 2010, but then it decreased slightly to 8,000. Moreover, engineering increased slowly from 4,000 to 5,500, so it did not change very much." },
          { text: "On the other hand, humanities was the highest in 2000 with 7,000 students. It fell to 6,500 in 2005, 5,500 in 2010 and 4,500 in 2015, and finally it was 3,500. Furthermore, the languages also went down from 3,000 to 1,000 students in 2020, which was the lowest number in the graph. So languages were the least popular subject at the end of the period." },
        ],
      },
      {
        t: "passage",
        title: "Bài mẫu band 7 – 7.5 (ước tính) — 182 từ",
        paras: [
          { text: "The line graph shows how many students were enrolled in five subject areas at Westbrook University at five-year intervals between 2000 and 2020." },
          { text: "Overall, enrolments in computing, business and engineering all increased, albeit at very different rates, while humanities and languages lost students throughout. As a result, computing moved from last place to first, and humanities from first to fourth." },
          { text: "Computing saw the most dramatic growth, climbing from just 2,000 students in 2000 to 9,500 in 2020, an almost fivefold increase, and overtaking business in the final five years. Business had itself risen by half to a peak of 9,000 in 2010, before slipping back to 8,000. Engineering followed a much flatter upward path, gaining only 1,500 students to finish at 5,500." },
          { text: "By contrast, the two arts subjects moved in the opposite direction. Humanities, the largest field in 2000 with 7,000 students, had been overtaken by business by 2005 and continued to contract, halving to 3,500 by the end of the period. Languages followed a similar pattern at a lower level, with enrolments falling by two-thirds from 3,000 to a mere 1,000." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**TA**", "Overview có nhưng mơ hồ (“some subjects… other subjects”). Computing và Humanities bị **kể đủ 5 mốc** — không chọn lọc. Không nêu điểm cắt nào.", "Overview gọi tên hai nhóm + thay đổi thứ hạng. Mỗi đường chỉ đầu – cuối + một điểm đặc biệt. Nêu **hai lần vượt** (computing vượt business; business vượt humanities). Số được **xử lý**: fivefold, by half, halving, by two-thirds."],
          ["**CC**", "Thứ tự theo chú giải. Từ nối đầu câu máy móc: Then · After that · Moreover · On the other hand · Furthermore. “Moreover” dùng sai vai (không phải thêm ý cùng loại).", "Mỗi khổ một nhóm, có câu dẫn (“By contrast, the two arts subjects…”). Liên kết bằng referencing: **itself** · **the two arts subjects** · **a similar pattern**. Chỉ một từ nối đầu câu."],
          ["**LR**", "increased ×4 · decreased / went down · “the biggest change” · “the highest” (thiếu danh từ) · “the languages” (thừa the).", "climb · slip back · contract · halve · overtake · a flatter upward path · a mere 1,000 · the most dramatic growth — đúng collocation, không lặp."],
          ["**GRA**", "Chủ yếu câu đơn + and / but; một mệnh đề quan hệ. Ít lỗi nhưng ít dạng.", "Participle clause (climbing…, overtaking… · gaining… · halving…), **with + N + V-ing**, quá khứ hoàn thành với by (had been overtaken by 2005 · had itself risen), cụm đồng vị (the largest field in 2000). Không lỗi."],
        ],
        caption: "Bài band 6 không “sai” — nó chỉ chưa chọn lọc và chưa nhóm. Đó đúng là khoảng cách 6 → 7 ở Task 1.",
      },
      {
        t: "quiz",
        id: "t4d6-viet-dien-mau",
        kind: "fill",
        title: "Gập bài mẫu band 7 lại — điền MỘT từ (8 chỗ trống)",
        items: [
          { q: "Overall, enrolments in computing, business and engineering all increased, ___ at very different rates.", answers: ["albeit"] },
          { q: "As a result, computing moved from last ___ to first.", answers: ["place"] },
          { q: "Computing climbed from just 2,000 to 9,500, an almost ___ increase.", answers: ["fivefold"] },
          { q: "Business had itself risen by half to a ___ of 9,000 in 2010.", answers: ["peak"] },
          { q: "…, before ___ back to 8,000.", answers: ["slipping", "falling", "dropping"] },
          { q: "By ___, the two arts subjects moved in the opposite direction.", answers: ["contrast"] },
          { q: "Humanities had been ___ by business by 2005.", answers: ["overtaken"] },
          { q: "Languages followed a similar pattern, ___ enrolments falling by two-thirds.", answers: ["with"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-viet-chon",
        title: "Chọn câu tốt nhất cho bài band 7 (5 câu — theo biểu đồ Westbrook)",
        items: [
          { q: "1. Câu mở bài nào tốt nhất?", options: ["The graph below shows the number of students enrolled in five subject areas at Westbrook University between 2000 and 2020.", "The line graph compares student numbers in five fields of study at Westbrook University over a twenty-year period from 2000.", "This graph is about students and subjects.", "I am going to describe a line graph about Westbrook University."], correct: 1, why: "B paraphrase đề (compares · fields of study · over a twenty-year period) mà vẫn đủ thông tin. A chép nguyên đề; C thiếu thông tin; D dùng giọng nói chuyện." },
          { q: "2. Câu nào tả Engineering đúng nhất?", options: ["Engineering increased dramatically to 5,500.", "Engineering fluctuated between 4,000 and 5,500.", "Engineering rose slowly but steadily, from 4,000 to 5,500.", "Engineering remained unchanged at 4,000."], correct: 2, why: "4 → 5.5 là tăng chậm và đều (+1,500 trong 20 năm). dramatically quá mạnh; fluctuated sai (không lên xuống); unchanged sai." },
          { q: "3. Câu nào đúng ngữ pháp và đúng số liệu?", options: ["Humanities and languages fell to 3,500 and 1,000 respectively.", "Humanities and languages were fallen to 3,500 and 1,000.", "Humanities fell to 3,500 respectively.", "Humanities and languages fell to 1,000 and 3,500 respectively."], correct: 0, why: "fall là nội động từ (không ~~were fallen~~); respectively cần hai danh sách cùng thứ tự: humanities–3,500, languages–1,000. D đảo thứ tự ⇒ sai số liệu." },
          { q: "4. Câu nào KHÔNG nên có trong bài Task 1 này?", options: ["Computing overtook business in the final five years.", "Business peaked at 9,000 in 2010.", "The gap between computing and languages widened considerably.", "Computing grew because students wanted well-paid jobs in technology."], correct: 3, why: "Task 1 chỉ tả số liệu. Lý do (“because students wanted…”) không có trong biểu đồ ⇒ bịa, mất TA." },
          { q: "5. Câu nào dùng quá khứ hoàn thành đúng?", options: ["By 2005, business overtakes humanities.", "By 2005, business has overtaken humanities.", "In 2005, business had been overtaking humanities.", "By 2005, business had overtaken humanities."], correct: 3, why: "**By + mốc quá khứ + had V3** (Ngày 3 mục 5): việc đã xong trước mốc 2005." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Lỗi mất điểm ở band 6 → 7 + bảng tự soát 2 phút" },
      {
        t: "note",
        title: "⚠️ 7 lỗi hay gặp với biểu đồ nhiều đường",
        items: [
          "**Kể từng đường, từng năm** — hết giờ, không còn chỗ cho so sánh.",
          "**Overview có số** hoặc overview chỉ nói “there were changes”.",
          "**Ép nhóm sai**: nói cả ba ngành “rose steadily” khi một ngành có đỉnh rồi giảm.",
          "**Tính sai**: 2 → 9.5 là gần **gấp năm** (an almost fivefold increase / nearly five times as many), không phải “increased by 500%” (tăng 500% là gấp sáu).",
          "**Sai đơn vị**: biểu đồ ghi nghìn — 9.5 là **9,500 students**, không phải 9.5 students.",
          "**Thiếu năm / thiếu chủ ngữ số liệu**: ~~Computing was 9,500~~ → **The number of** computing students was 9,500 / Computing **had** 9,500 students.",
          "**Lạm dụng một cấu trúc**: câu nào cũng “, reaching…” hoặc “, with…”.",
        ],
      },
      {
        t: "table",
        head: ["Soát gì (2 phút cuối)", "Câu hỏi tự hỏi"],
        rows: [
          ["Overview", "Có đủ **hai nhóm** + **một thay đổi thứ hạng**? Có lỡ ghi số không?"],
          ["Số liệu", "Mỗi số có **đơn vị + năm**? Phép tính (gấp mấy, một nửa) đã kiểm chưa?"],
          ["Thì", "Toàn bộ **quá khứ đơn**; chỉ dùng had V3 sau **by + năm**?"],
          ["Chủ ngữ", "Có câu nào kiểu ~~Computing was 9,500~~? Có chủ ngữ treo (Ngày 5 mục 7)?"],
          ["Độ dài", "170–190 từ. Dưới 150 bị trừ; trên 200 là đang kể thừa."],
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Tự viết — AI chấm 4 tiêu chí" },
      { t: "p", text: "Bấm giờ **20 phút**: 3 phút đọc và nhóm (4 câu hỏi của mục 3), 15 phút viết, 2 phút soát. Biểu đồ dưới có **ba** nhóm: tăng, giảm và **đi ngang** — đừng ép đường đi ngang vào nhóm nào." },
      {
        t: "chart",
        kind: "line",
        title: "Average weekly hours spent on five leisure activities by people aged 15–24 in one country, 2002–2022",
        unit: "hours",
        labels: ["2002", "2007", "2012", "2017", "2022"],
        series: [
          { name: "Watching television", values: [14, 13, 10, 7, 4] },
          { name: "Social media", values: [1, 4, 9, 13, 16] },
          { name: "Video games", values: [5, 6, 8, 9, 10] },
          { name: "Reading for pleasure", values: [6, 5, 4, 3, 3] },
          { name: "Playing sport", values: [5, 5, 5.5, 5, 5] },
        ],
      },
      {
        t: "essay",
        id: "t4d6-viet-bai",
        task: "Task 1",
        prompt: "The graph below shows the average number of hours per week that people aged 15–24 in one country spent on five leisure activities between 2002 and 2022. (Watching television: 14 – 13 – 10 – 7 – 4; Social media: 1 – 4 – 9 – 13 – 16; Video games: 5 – 6 – 8 – 9 – 10; Reading for pleasure: 6 – 5 – 4 – 3 – 3; Playing sport: 5 – 5 – 5.5 – 5 – 5; figures for 2002, 2007, 2012, 2017 and 2022.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Ba nhóm: **tăng** (social media rất mạnh, video games vừa) · **giảm** (television mạnh, reading) · **đi ngang** (sport — một câu là đủ).",
          "Overview: nhóm + thứ hạng — social media **từ ít nhất lên nhiều nhất**, television từ **nhiều nhất xuống thứ tư** (chỉ còn trên reading). Không số.",
          "Điểm cắt đáng nêu: social media vượt television trong khoảng 2012–2017 (9 → 13 so với 10 → 7).",
          "Xử lý số: 1 → 16 = **a sixteenfold increase**; 14 → 4 = giảm **hơn hai phần ba**; 6 → 3 = **halved**; video games **doubled**.",
          "Dùng ít nhất một câu **with + N + V-ing** và một câu **By + năm + had V3**; tối đa 10 con số.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d6-noi",
    kind: "speaking",
    title: "Nói: Part 2 band 7 — tả người / nơi chốn có một câu chuyện nhỏ",
    goal: "Nói trọn 2 phút Part 2 về một người hoặc một nơi, trong đó có một câu chuyện nhỏ 30–40 giây (cảnh → sự việc → một câu thoại → ý nghĩa) kể bằng đúng thì quá khứ, dùng 2–3 thành ngữ tính cách đúng nguyên dạng và ngữ điệu kể chuyện — đẩy FC (nói dài không gắng sức), LR (từ ít gặp, idiom) và P band 7.",
    minutes: 75,
    blocks: [
      {
        t: "recap",
        title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Part 2 tả **người** bạn đã học ở Tập 2 Ngày 3 và **Tập 3 Ngày 7** (ngân hàng tính cách: mỗi tính cách một chuyện chứng minh); tả **nơi chốn** ở Tập 2 Ngày 7 và **Tập 3 Ngày 14**. Hôm nay nâng “chuyện chứng minh” thành một ==câu chuyện nhỏ== có đầu có đuôi.",
          "Vì sao band 7 cần câu chuyện? Vì kể chuyện buộc bạn dùng **thì quá khứ trộn** (was sitting… when he walked past… I'd expected…), **chi tiết cụ thể**, và **ngữ điệu tự nhiên** — ba thứ mà một chuỗi tính từ (kind, friendly, helpful) không cho được.",
          "Khung 4 nhịp: ==Cảnh → Sự việc → Một câu thoại → Ý nghĩa==. Dài 30–40 giây, đặt ở gợi ý thứ ba của thẻ.",
          "Tính cách nói bằng **thành ngữ đúng nguyên dạng**: a heart of gold · down-to-earth · go the extra mile. Sai một chữ (~~a gold heart~~) là mất tác dụng.",
          "🔊 Phát âm: **ngữ điệu kể chuyện** — giọng treo ở câu nền, hạ ở sự việc chính, ngắt trước câu thoại.",
          "Có hai bài mẫu cho cùng một thẻ — **band 6** và **band 7** (ước tính) — và bảng so theo FC · LR · GRA · P.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Part 2 ở band 7 cần thêm gì so với band 6?" },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7"],
        rows: [
          ["**FC**", "Nói đủ 2 phút nhưng có lúc lặp ý, tự sửa; nối bằng and / so / because.", "Nói dài **không gắng sức**; ý nối nhau bằng mốc kể chuyện (I remember one evening… · Instead, … · And that's exactly what…)."],
          ["**LR**", "Tính từ chung: kind, friendly, nice, simple; paraphrase được.", "Từ ít gặp + **idiom đúng dạng**: down-to-earth, goes the extra mile, tucked away; chi tiết cụ thể (watering can, a mock paper)."],
          ["**GRA**", "Quá khứ đơn là chính; câu phức ít, có lỗi.", "Trộn **quá khứ tiếp diễn + đơn + hoàn thành**, câu thoại trực tiếp, mệnh đề quan hệ, participle clause; thường không lỗi."],
          ["**P**", "Dễ hiểu; ngữ điệu còn đều đều như đọc.", "Ngữ điệu **theo nghĩa**: treo – hạ, nhấn từ bất ngờ, ngắt trước câu thoại."],
        ],
        caption: "Giám khảo không chấm “chuyện có hay không”. Họ chấm NGÔN NGỮ mà câu chuyện buộc bạn phải dùng.",
      },

      /* ── 2 ── */
      { t: "h", text: "2. Câu chuyện nhỏ — khung 4 nhịp" },
      {
        t: "sodo",
        kind: "flow",
        title: "Một câu chuyện 30–40 giây (4–6 câu)",
        steps: [
          { label: "① CẢNH — khi nào, đang làm gì", sub: "I remember one evening… I **was sitting** on the steps, staring at… (quá khứ tiếp diễn)" },
          { label: "② SỰ VIỆC — chuyện gì xảy ra", sub: "…when he **walked** past. I**'d expected** a lecture. Instead, he **glanced** at the paper… (quá khứ đơn + hoàn thành)" },
          { label: "③ MỘT CÂU THOẠI hoặc một chi tiết nhìn thấy được", sub: "…and said, ‘A four means you already know forty per cent.’" },
          { label: "④ Ý NGHĨA — vì sao chuyện này đáng kể", sub: "And that's exactly what we did. / That's when I realised… / …which just shows how patient he is." },
        ],
        caption: "Đặt câu chuyện ở gợi ý thứ ba (what this person is like / what you do there). Nhịp ④ chính là cầu nối sang gợi ý cuối “explain why…”.",
      },
      {
        t: "table",
        head: ["Nhịp", "Câu mở dùng được ngay", "Thì"],
        rows: [
          ["① Cảnh", "I remember one time when… · To give you an idea of what I mean, … · There was this one occasion, about two years ago, when… · One thing that's stuck in my mind is…", "was / were + V-ing"],
          ["② Sự việc", "…when suddenly… · Out of nowhere, … · I'd expected / assumed…, but instead… · The next thing I knew, …", "V2 · had + V3"],
          ["③ Câu thoại", "…and he just said, ‘…’ · She turned to me and went, ‘…’ (thân mật) · All he said was, ‘…’", "hiện tại (trong ngoặc kép)"],
          ["④ Ý nghĩa", "That's when I realised… · It sounds like a small thing, but… · …which just goes to show… · I've never forgotten that.", "V2 → hiện tại / HTHT"],
        ],
        caption: "Nối Ngày 3 mục 6 (quá khứ hoàn thành khi kể chuyện): việc xảy ra TRƯỚC điểm đang kể thì lùi một bậc — I'd expected, I'd been caught in the rain.",
      },
      {
        t: "note",
        title: "⚠️ Hay sai khi kể chuyện",
        items: [
          "Kể bằng **hiện tại đơn**: ~~Yesterday he comes and says…~~ → he **came** and **said**. (Người bản ngữ đôi khi kể bằng hiện tại cho sống động, nhưng trong phòng thi nó dễ bị nghe thành lỗi thì.)",
          "Nền mà dùng quá khứ đơn: ~~I sat on the steps when he walked past.~~ → I **was sitting**… when he walked past.",
          "Chuyện **quá dài**: 90 giây kể chuyện thì không còn thời gian cho gợi ý cuối. 4–6 câu là đủ.",
          "Chuyện **không dính** tính cách vừa nêu. Nói “he goes the extra mile” thì chuyện phải cho thấy ông ấy làm **hơn mức cần**.",
          "Bịa quá xa: không cần chuyện ly kỳ. Một chuyện rất nhỏ, thật (hoặc gần thật), có **một chi tiết cụ thể** là đủ.",
        ],
      },
      { t: "rule", formula: "I remember one + time… I was V-ing…, when + S + V2. I'd expected… Instead, S + V2 and said, ‘…’. That's when I realised…", vi: "Cảnh (tiếp diễn) → Sự việc (đơn + hoàn thành) → Câu thoại → Ý nghĩa. 30–40 giây." },

      /* ── 3 ── */
      { t: "h", text: "3. Tính cách bằng thành ngữ — đúng nguyên dạng (10 cụm)" },
      {
        t: "p",
        text: "Band 7 LR: “uses some less common and **idiomatic** vocabulary”. Thành ngữ chỉ ăn điểm khi (1) **đúng từng chữ** — thành ngữ là khối đúc sẵn, không đổi mạo từ, số nhiều, trật tự; (2) **đúng chỗ** — hai, ba cụm trong hai phút, mỗi cụm có chuyện đi kèm. Mười cụm dưới đây an toàn, tự nhiên, dùng được cho gần như mọi đề tả người.",
      },
      {
        t: "vocab",
        items: [
          { w: "have a heart of gold", pos: "idiom", ipa: "/hæv ə ˌhɑːt əv ˈɡəʊld/", vi: "có tấm lòng vàng, rất tốt bụng", ex: "She can seem strict, but she has a heart of gold.", exVi: "Bà ấy có thể trông nghiêm khắc, nhưng có tấm lòng vàng.", more: "KHÔNG ~~a gold heart~~ / ~~a golden heart~~ / ~~heart of the gold~~ · hay đi sau **but**: nghiêm / cộc cằn **but** has a heart of gold" },
          { w: "down-to-earth", pos: "adj", ipa: "/ˌdaʊn tu ˈɜːθ/", vi: "giản dị, thực tế, không kiêu kỳ", ex: "Despite being so successful, he's remarkably down-to-earth.", exVi: "Dù rất thành đạt, ông ấy giản dị đến bất ngờ.", more: "KHÔNG ~~down to the earth~~ / ~~down-earth~~ · khen người có địa vị mà không ra vẻ · ≠ arrogant, full of himself" },
          { w: "go the extra mile", pos: "idiom", ipa: "/ɡəʊ ði ˌekstrə ˈmaɪl/", vi: "làm hơn mức được yêu cầu, tận tâm", ex: "Our form teacher always went the extra mile for weaker students.", exVi: "Cô chủ nhiệm của chúng tôi luôn tận tâm hơn mức cần với học sinh yếu.", more: "KHÔNG ~~go extra miles~~ / ~~go an extra mile~~ · go the extra mile **for** sb / **to + V** · chia thì ở go: went, has gone" },
          { w: "a people person", pos: "n", ipa: "/ə ˈpiːpl ˌpɜːsn/", vi: "người thích và giỏi giao tiếp với người khác", ex: "My sister is a real people person, so sales suits her perfectly.", exVi: "Chị tôi đúng là người của đám đông, nên nghề bán hàng rất hợp với chị.", more: "KHÔNG ~~a person people~~ / ~~a people's person~~ · phủ định khiêm tốn: I'm **not much of** a people person" },
          { w: "set in your ways", pos: "idiom", ipa: "/ˌset ɪn jɔː ˈweɪz/", vi: "cố hữu, khó đổi thói quen", ex: "My grandfather is rather set in his ways — he has had the same breakfast for forty years.", exVi: "Ông tôi khá cố hữu — bốn mươi năm ăn đúng một kiểu bữa sáng.", more: "đổi **your** theo người: set in **his / her / their** ways · KHÔNG ~~set on his way~~ · sắc thái hơi chê nhưng trìu mến" },
          { w: "have a good head on your shoulders", pos: "idiom", ipa: "/hæv ə ɡʊd ˈhed ɒn jɔː ˈʃəʊldəz/", vi: "chín chắn, biết suy nghĩ", ex: "She's only nineteen, but she has a good head on her shoulders.", exVi: "Cô ấy mới mười chín tuổi nhưng rất chín chắn.", more: "KHÔNG ~~a good head on shoulder~~ (shoulders luôn số nhiều) · = sensible, level-headed" },
          { w: "the life and soul of the party", pos: "idiom", ipa: "/ðə ˌlaɪf ən ˈsəʊl əv ðə ˈpɑːti/", vi: "linh hồn của cuộc vui", ex: "At family gatherings my uncle is always the life and soul of the party.", exVi: "Ở các buổi họp mặt gia đình, chú tôi luôn là linh hồn của cuộc vui.", more: "KHÔNG ~~the soul and life~~ (thứ tự cố định) · Mỹ: the life of the party · ≠ keeps himself to himself" },
          { w: "keep yourself to yourself", pos: "idiom", ipa: "/ˌkiːp jɔːˈself tə jɔːˈself/", vi: "sống kín đáo, ít giao du", ex: "Our neighbour is polite, but he keeps himself to himself.", exVi: "Hàng xóm nhà tôi lịch sự, nhưng sống khá kín đáo.", more: "đổi đại từ: keeps **himself to himself** / **herself to herself** · KHÔNG ~~keeps him to himself~~ · không mang nghĩa chê" },
          { w: "wear your heart on your sleeve", pos: "idiom", ipa: "/ˌweə jɔː ˈhɑːt ɒn jɔː ˈsliːv/", vi: "ruột để ngoài da, không giấu cảm xúc", ex: "You always know how she feels — she wears her heart on her sleeve.", exVi: "Lúc nào bạn cũng biết cô ấy cảm thấy gì — cô ấy ruột để ngoài da.", more: "KHÔNG ~~on her sleeves~~ / ~~in her sleeve~~ · đổi your theo người" },
          { w: "a shoulder to cry on", pos: "idiom", ipa: "/ə ˌʃəʊldə tə ˈkraɪ ɒn/", vi: "người để dựa vào, chịu nghe mình than thở", ex: "Whenever I was homesick, my roommate was a shoulder to cry on.", exVi: "Mỗi khi tôi nhớ nhà, bạn cùng phòng là người để tôi dựa vào.", more: "KHÔNG ~~a shoulder for crying~~ / ~~to cry~~ (phải có **on**) · be / offer / need a shoulder to cry on" },
        ],
      },
      {
        t: "note",
        title: "📌 Ghi nhớ: idiom dùng khi NÓI, không dùng trong Writing",
        items: [
          "Mười cụm trên thuộc văn nói thân mật – trung tính: tốt cho **Speaking**, **không** đưa vào Task 1 / Task 2 (Ngày 18 sẽ học kỹ về register).",
          "Đừng chồng idiom: ~~He has a heart of gold and he is down-to-earth and he goes the extra mile and he is a people person.~~ Một idiom → một chuyện.",
          "Tránh các thành ngữ sáo mà người bản ngữ ít dùng thật: ~~it's raining cats and dogs~~, ~~every coin has two sides~~, ~~as busy as a bee~~.",
        ],
      },
      {
        t: "mcq",
        id: "t4d6-noi-idiom",
        title: "Thành ngữ đúng nguyên dạng + đúng chuyện (6 câu)",
        items: [
          { q: "1. Dạng nào đúng?", options: ["She has a gold heart.", "She has a heart of gold.", "She has a golden heart.", "She has heart of the gold."], correct: 1, why: "Khối cố định: **a heart of gold**." },
          { q: "2. Dạng nào đúng?", options: ["He always goes extra miles for his customers.", "He always goes an extra mile to his customers.", "He always goes the extra mile for his customers.", "He always goes the mile extra for his customers."], correct: 2, why: "**go the extra mile for sb** — có the, mile số ít." },
          { q: "3. “He taught at the top school for thirty years, yet he still cycles to the market in an old T-shirt.” Chuyện này chứng minh ông ấy", options: ["is down-to-earth.", "is the life and soul of the party.", "wears his heart on his sleeve.", "is set in his ways."], correct: 0, why: "Có địa vị mà giản dị, không ra vẻ ⇒ **down-to-earth**." },
          { q: "4. “My aunt has eaten at the same noodle stall every Sunday since 1995 and refuses to try anywhere else.” Cô ấy", options: ["has a good head on her shoulders.", "is a people person.", "is a shoulder to cry on.", "is set in her ways."], correct: 3, why: "Thói quen cố hữu, không chịu đổi ⇒ **set in her ways**." },
          { q: "5. Dạng nào đúng?", options: ["My neighbour keeps him to himself.", "My neighbour keeps himself to himself.", "My neighbour keeps himself for himself.", "My neighbour keeps to him himself."], correct: 1, why: "**keep yourself to yourself** → keeps himself to himself." },
          { q: "6. Câu nào dùng idiom hợp lý nhất trong Part 2?", options: ["He has a heart of gold, he is down-to-earth, he goes the extra mile and he is a people person.", "As the saying goes, every coin has two sides, and so does my uncle.", "He goes the extra mile for his students — for instance, he ran free evening classes for years.", "It was raining cats and dogs when I met my kind uncle."], correct: 2, why: "Một idiom + một chuyện chứng minh. A chồng bốn idiom không chứng minh; B, D là thành ngữ sáo và không nói gì về tính cách." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Tả nơi chốn: chi tiết giác quan + lần đầu tới đó (8 cụm)" },
      {
        t: "p",
        text: "Với đề tả **nơi chốn**, câu chuyện tự nhiên nhất là ==lần đầu bạn tìm ra nơi đó== hoặc **một lần đáng nhớ ở đó**. Trước câu chuyện, cho giám khảo “thấy” nơi ấy bằng 2–3 chi tiết **giác quan** (nhìn – nghe – ngửi), đừng chỉ nói beautiful / peaceful.",
      },
      {
        t: "vocab",
        items: [
          { w: "tucked away", pos: "adj phr", ipa: "/ˌtʌkt əˈweɪ/", vi: "nằm khuất, kín đáo", ex: "The café is tucked away down a narrow alley behind the market.", exVi: "Quán cà phê nằm khuất trong một con hẻm hẹp sau chợ.", more: "be tucked away **in / down / behind** · gợi cảm giác “chỗ ít người biết” · KHÔNG ~~tucked in away~~" },
          { w: "a stone's throw from", pos: "idiom", ipa: "/ə ˌstəʊnz ˈθrəʊ frəm/", vi: "cách rất gần (ném hòn đá là tới)", ex: "My flat is just a stone's throw from the river.", exVi: "Căn hộ của tôi chỉ cách con sông vài bước chân.", more: "(just / only) a stone's throw **from / away from** · KHÔNG ~~a stone throw~~ / ~~a stone's throwing~~" },
          { w: "off the beaten track", pos: "idiom", ipa: "/ˌɒf ðə ˌbiːtn ˈtræk/", vi: "ở nơi hẻo lánh, ít khách lui tới", ex: "We found a little beach that was completely off the beaten track.", exVi: "Chúng tôi tìm được một bãi biển nhỏ hoàn toàn vắng khách.", more: "KHÔNG ~~off the beat track~~ / ~~out of the beaten track~~ · Mỹ: off the beaten path" },
          { w: "have a lot of character", pos: "v phr", ipa: "/hæv ə ˌlɒt əv ˈkærəktə/", vi: "có nét riêng, có hồn (nói về nơi chốn, nhà cửa)", ex: "The old quarter is a bit shabby, but it has a lot of character.", exVi: "Khu phố cổ hơi cũ kỹ, nhưng rất có hồn.", more: "character ở nghĩa này **không đếm được**: ~~a lot of characters~~ · full of character · ≠ soulless, characterless" },
          { w: "the hustle and bustle", pos: "n phr", ipa: "/ðə ˌhʌsl ən ˈbʌsl/", vi: "sự ồn ào náo nhiệt", ex: "I go there to escape the hustle and bustle of the city centre.", exVi: "Tôi tới đó để trốn sự ồn ào náo nhiệt của trung tâm thành phố.", more: "thứ tự cố định: hustle **and** bustle · the hustle and bustle **of** city life · escape / get away from…" },
          { w: "stumble across", pos: "phr v", ipa: "/ˌstʌmbl əˈkrɒs/", vi: "tình cờ tìm thấy", ex: "I stumbled across the bookshop while I was sheltering from the rain.", exVi: "Tôi tình cờ tìm thấy hiệu sách khi đang trú mưa.", more: "= come across, stumble upon · stumble across **a place / an article / an old photo** · dùng mở câu chuyện “lần đầu tới”" },
          { w: "run-down", pos: "adj", ipa: "/ˌrʌn ˈdaʊn/", vi: "xuống cấp, tồi tàn", ex: "From the outside the building looks rather run-down.", exVi: "Nhìn từ bên ngoài, toà nhà trông khá xuống cấp.", more: "a run-down **building / area / hotel** · với người: feel run down = mệt mỏi, kiệt sức · ≠ well-kept" },
          { w: "overlook", pos: "v", ipa: "/ˌəʊvəˈlʊk/", vi: "nhìn ra, trông xuống (từ trên cao)", ex: "The terrace overlooks the whole bay.", exVi: "Sân thượng nhìn ra toàn bộ vịnh.", more: "a room **overlooking** the sea (quan hệ rút gọn — Ngày 5) · nghĩa 2: bỏ sót (overlook a mistake) · KHÔNG ~~overlook to the sea~~" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Ghi chú 1 phút — thêm một ô “STORY”" },
      {
        t: "table",
        head: ["Ô", "Thẻ: an older person you admire", "Ghi gì (từ khoá, không viết câu)"],
        rows: [
          ["1. Who", "who this person is", "Mr Hải · retired physics teacher · 2 doors down"],
          ["2. How", "how you know them", "always known · really — final year"],
          ["3. Like", "what they are like", "down-to-earth (old T-shirt, plants) · extra mile (free classes)"],
          ["★ STORY", "(tự thêm)", "steps · mock paper 4/10 · watering can · ‘40%… other 60’"],
          ["4. Why", "explain why you admire them", "heart of gold · failure = starting point · cousin"],
        ],
        caption: "Ô STORY chỉ cần 4–5 từ khoá: nơi – vật – con số – câu thoại. Ghi câu thoại bằng tiếng Anh ngay để khỏi phải dịch khi nói.",
      },
      {
        t: "sodo",
        kind: "flow",
        title: "Chia 2 phút cho bài có câu chuyện",
        steps: [
          { label: "0:00–0:20 · Who + How", sub: "2–3 câu, đừng sa đà tiểu sử" },
          { label: "0:20–0:50 · Like — 2 tính cách", sub: "mỗi tính cách một câu bằng chứng ngắn" },
          { label: "0:50–1:30 · ★ STORY", sub: "cảnh → sự việc → câu thoại → ý nghĩa" },
          { label: "1:30–2:00 · Why", sub: "nối từ ý nghĩa câu chuyện sang lý do + một câu về hiện tại / tương lai" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Hai bài nói mẫu cho cùng một thẻ: band 6 và band 7 (ước tính)" },
      { t: "p", text: "**Thẻ đề:** Describe an older person you admire. You should say: who this person is · how you know him or her · what he or she is like · and explain why you admire this person." },
      {
        t: "dialogue",
        title: "Bài mẫu band 6 (ước tính) — khoảng 1 phút, 151 từ: đủ ý nhưng không có chuyện",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about my neighbour, Mr Hải. He is a retired teacher and he lives near my parents' house. I have known him for a long time, maybe since I was a child.", vi: "Em muốn nói về hàng xóm của em, thầy Hải. Thầy là giáo viên đã nghỉ hưu và sống gần nhà bố mẹ em. Em biết thầy lâu rồi, có lẽ từ khi còn nhỏ." },
          { who: "Candidate", role: "candidate", text: "He is a very kind person and he is very friendly. He always helps people in my neighbourhood. For example, he teaches children for free in the evening, because some families don't have much money. He is also very simple. He doesn't wear expensive clothes and he likes plants.", vi: "Thầy là người rất tốt bụng và thân thiện. Thầy luôn giúp mọi người trong xóm. Ví dụ, thầy dạy miễn phí cho trẻ em vào buổi tối, vì một số gia đình không có nhiều tiền. Thầy cũng rất giản dị. Thầy không mặc đồ đắt tiền và thích cây cối." },
          { who: "Candidate", role: "candidate", text: "When I was in high school, he helped me a lot with physics. I was not good at physics, but he explained everything very clearly, so I passed the exam. I was very happy.", vi: "Khi em học cấp ba, thầy giúp em rất nhiều môn vật lý. Em không giỏi vật lý, nhưng thầy giải thích mọi thứ rất rõ nên em đã qua kỳ thi. Em rất vui." },
          { who: "Candidate", role: "candidate", text: "I admire him because he is kind and he helps other people without money. I think he is a good example for young people. I want to be like him in the future.", vi: "Em ngưỡng mộ thầy vì thầy tốt bụng và giúp người khác không lấy tiền. Em nghĩ thầy là tấm gương tốt cho người trẻ. Em muốn giống thầy trong tương lai." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài mẫu band 7 – 7.5 (ước tính) — khoảng 2 phút, 295 từ: có câu chuyện nhỏ",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about Mr Hải, a retired physics teacher who lives two doors down from my parents' house. I've known him for as long as I can remember, but I only really got to know him when I was in my final year of secondary school.", vi: "Em muốn nói về thầy Hải, một giáo viên vật lý đã nghỉ hưu, sống cách nhà bố mẹ em hai căn. Em biết thầy từ khi có trí nhớ, nhưng chỉ thật sự hiểu thầy khi học năm cuối cấp ba." },
          { who: "Candidate", role: "candidate", text: "In terms of what he's like, the first thing I'd say is that he's incredibly down-to-earth. He taught at the best school in the province for thirty years, yet you'd never guess it — he's usually in an old T-shirt, watering his plants. He's also someone who genuinely goes the extra mile for other people. For years he's been running free evening classes in his front room for kids in the neighbourhood whose families can't afford private tuition.", vi: "Nói về con người thầy, điều đầu tiên em muốn nói là thầy cực kỳ giản dị. Thầy dạy ở ngôi trường tốt nhất tỉnh suốt ba mươi năm, vậy mà nhìn thì không ai đoán ra — thầy thường mặc chiếc áo thun cũ, tưới cây. Thầy cũng là người thật sự tận tâm hơn mức cần với người khác. Nhiều năm nay thầy mở lớp buổi tối miễn phí ngay ở phòng khách cho bọn trẻ trong xóm mà gia đình không đủ tiền cho đi học thêm." },
          { who: "Candidate", role: "candidate", text: "To give you an idea of what I mean, I remember one evening about a month before my university entrance exam. I was sitting on the steps outside my house, staring at a mock paper with four out of ten written on it, when he walked past with his watering can. I'd expected a lecture. Instead, he glanced at the paper and said, ‘A four means you already know forty per cent. Let's go and find the other sixty.’ And that's exactly what we did — every evening for the next four weeks.", vi: "Để thầy cô hình dung, em nhớ một buổi tối khoảng một tháng trước kỳ thi đại học. Em đang ngồi trên bậc thềm trước nhà, nhìn chằm chằm vào bài thi thử ghi bốn trên mười điểm, thì thầy đi ngang qua với cái bình tưới. Em cứ tưởng sẽ bị giảng một bài. Thay vào đó, thầy liếc qua tờ bài và nói: “Bốn điểm nghĩa là em đã biết bốn mươi phần trăm rồi. Giờ mình đi tìm sáu mươi phần trăm còn lại.” Và đúng là hai thầy trò đã làm thế — tối nào cũng vậy suốt bốn tuần sau đó." },
          { who: "Candidate", role: "candidate", text: "So why do I admire him? Partly because he's got a heart of gold, obviously. But what's really stayed with me is the way he looks at failure — as a starting point rather than a verdict. Having gone through that month with him, I now find myself saying the same thing to my younger cousin whenever she's stuck. If I can be half as patient as he is when I'm his age, I'll be happy.", vi: "Vậy vì sao em ngưỡng mộ thầy? Một phần vì thầy có tấm lòng vàng, hiển nhiên rồi. Nhưng điều thật sự ở lại với em là cách thầy nhìn thất bại — như một điểm xuất phát chứ không phải một bản án. Sau khi trải qua tháng đó với thầy, giờ em thấy mình nói đúng câu ấy với đứa em họ mỗi khi nó bí. Nếu tới tuổi thầy mà em kiên nhẫn được bằng một nửa thầy, em sẽ mãn nguyện." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7"],
        rows: [
          ["**FC**", "Hết ý sau ~1 phút; ý nối bằng For example · because · so. Giám khảo sẽ phải hỏi thêm.", "Đủ 2 phút, không cố kéo. Mốc dẫn: In terms of… · To give you an idea… · Instead, … · So why do I admire him? · Partly… But what's really stayed with me…"],
          ["**LR**", "kind · friendly · simple · helps people · a good example. Đúng nhưng chung chung.", "down-to-earth · goes the extra mile · a heart of gold · private tuition · a mock paper · a starting point rather than a verdict · stuck."],
          ["**GRA**", "Hiện tại đơn + quá khứ đơn; câu ngắn nối and / but / so. Một lỗi nhỏ: “helps other people without money” (ý: for free).", "was sitting… when he walked past · I'd expected · he's been running · whose families can't afford · Having gone through… · If I can be half as patient as he is…"],
          ["**P** (khi nói)", "Dễ hiểu, nhưng mọi câu cùng một độ cao.", "Treo giọng ở “I was sitting on the steps…”, hạ ở “when he walked past”; ngắt trước câu thoại; nhấn **forty** và **sixty**."],
        ],
        caption: "Cùng một người, cùng các ý. Khác biệt đến từ MỘT câu chuyện 40 giây và ba idiom đặt đúng chỗ.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Thêm một mẫu band 7: tả nơi chốn" },
      { t: "p", text: "**Thẻ đề:** Describe a place in your town or city where you go to relax. You should say: where it is · how you found it · what you do there · and explain why it helps you relax." },
      {
        t: "dialogue",
        title: "Bài mẫu band 7 (ước tính) — khoảng 1 phút 30 giây, 207 từ",
        lines: [
          { who: "Candidate", role: "candidate", text: "The place I'd like to describe is a tiny second-hand bookshop tucked away down an alley, just a stone's throw from my university. From the street you'd walk straight past it — there's no sign, just a faded green door. Inside, though, it's got a lot of character: shelves right up to the ceiling, the smell of old paper and coffee, and a ginger cat that's usually asleep on the dictionaries.", vi: "Nơi em muốn tả là một hiệu sách cũ bé xíu nằm khuất trong một con hẻm, chỉ cách trường đại học của em vài bước chân. Đi ngoài đường thì bạn sẽ đi thẳng qua luôn — không có biển hiệu, chỉ có một cánh cửa xanh bạc màu. Nhưng bên trong thì rất có hồn: kệ cao tới tận trần, mùi giấy cũ và cà phê, và một con mèo vàng thường ngủ trên chồng từ điển." },
          { who: "Candidate", role: "candidate", text: "I stumbled across it by accident in my first year. I'd been caught in a downpour and was sheltering in the doorway when the owner, an elderly woman, opened the door and said, ‘You can drip in here if you like.’ I ended up staying for three hours, and I've been going back ever since.", vi: "Em tình cờ tìm ra nó hồi năm nhất. Em bị dính một trận mưa như trút và đang trú ở bậc cửa thì bà chủ, một cụ bà, mở cửa và nói: “Cháu vào trong này mà nhỏ nước cũng được.” Rốt cuộc em ở lại ba tiếng, và từ đó đến giờ vẫn quay lại." },
          { who: "Candidate", role: "candidate", text: "What I do there is nothing special. I order a coffee, pick a book more or less at random and read. Compared with the hustle and bustle of the campus, it's remarkably quiet — nobody's on their phone.", vi: "Việc em làm ở đó chẳng có gì đặc biệt. Em gọi một ly cà phê, chọn một cuốn sách gần như ngẫu nhiên và đọc. So với sự ồn ào náo nhiệt của khuôn viên trường, ở đây yên tĩnh lạ thường — không ai dán mắt vào điện thoại." },
          { who: "Candidate", role: "candidate", text: "I think the reason it matters to me is that it's the one place where I'm not expected to be productive. Everywhere else, I'm either studying or working on a project. There, having switched my phone off, I can actually hear myself think.", vi: "Em nghĩ lý do nó quan trọng với em là vì đó là nơi duy nhất em không bị trông đợi phải làm ra kết quả. Ở mọi nơi khác, em hoặc đang học hoặc đang làm đồ án. Ở đó, sau khi tắt điện thoại, em mới thật sự nghe được mình nghĩ gì." },
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: tìm bốn nhịp trong mẫu nơi chốn",
        items: [
          "① Cảnh: I**'d been caught** in a downpour and **was sheltering** in the doorway…",
          "② Sự việc: …when the owner **opened** the door…",
          "③ Câu thoại: ‘You can drip in here if you like.’",
          "④ Ý nghĩa: I ended up staying for three hours, and I**'ve been going back** ever since.",
          "Ngữ pháp Ngày 5 trong bài: **tucked away** down an alley (V3 rút gọn) · **Compared with** the hustle and bustle… · **having switched** my phone off.",
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Phát âm: ngữ điệu kể chuyện" },
      {
        t: "table",
        head: ["Luật", "Làm gì", "Ví dụ (↗ treo · ↘ hạ · | ngắt)"],
        rows: [
          ["Câu nền ⇒ **treo**", "Cuối mệnh đề nền, giọng đi ngang hoặc hơi lên: báo “còn nữa”.", "I was sitting on the steps ↗ | staring at a mock paper ↗ |"],
          ["Sự việc chính ⇒ **hạ**", "Giọng rơi ở từ mang tin mới.", "…when he walked **past** ↘"],
          ["Trước câu thoại ⇒ **ngắt**", "Dừng nửa nhịp sau said; câu thoại nói cao và chậm hơn một chút.", "…and said, | ‘A **four** means you already know **forty** per cent.’ ↘"],
          ["Từ bất ngờ ⇒ **nhấn**", "Kéo dài và nâng cao độ (không phải hét — Ngày 2 mục 9) ở từ trái với điều người nghe chờ.", "I'd expected a **lecture** ↘ | In**stead** ↗ | he glanced at the paper…"],
          ["Câu chốt ⇒ **chậm + hạ sâu**", "Câu ý nghĩa nói chậm lại, hạ giọng rõ để báo hết chuyện.", "And that's e**xact**ly what we **did** ↘"],
        ],
        caption: "Lỗi của người Việt: nói mọi mệnh đề cùng một độ cao và hạ giọng sau MỖI cụm — nghe như đọc danh sách, người nghe không biết đâu là cao trào.",
      },
      {
        t: "phatam",
        id: "t4d6-phat-am",
        title: "Luyện phát âm — ngữ điệu kể chuyện",
        note: "Bấm “Nghe mẫu” rồi “Đọc & chấm”. Máy chấm từng âm; phần ngữ điệu bạn tự nghe lại bản ghi: câu nền có treo không, sự việc chính có hạ không, có ngắt trước câu thoại không.",
        items: [
          { text: "I was sitting on the steps when he walked past.", ipa: "aɪ wəz sɪtɪŋ ɒn ðə steps wen hi wɔːkt pɑːst", vi: "nền ↗ … sự việc ↘" },
          { text: "I'd expected a lecture.", ipa: "aɪd ɪkspektɪd ə lektʃə", vi: "nhấn lecture, hạ giọng" },
          { text: "Instead, he glanced at the paper.", ipa: "ɪnsted hi ɡlɑːnst ət ðə peɪpə", vi: "Instead ↗ | … paper ↘" },
          { text: "And he said, let's find the other sixty.", ipa: "ənd hi sed lets faɪnd ði ʌðə sɪksti", vi: "ngắt sau said; nhấn other, sixty" },
          { text: "From the street, you'd walk straight past it.", ipa: "frəm ðə striːt juːd wɔːk streɪt pɑːst ɪt", vi: "From the street ↗ | … past it ↘" },
          { text: "Inside, though, it's got a lot of character.", ipa: "ɪnsaɪd ðəʊ ɪts ɡɒt ə lɒt əv kærəktə", vi: "Inside ↗ though ↗ | … character ↘" },
          { text: "I'd been caught in a downpour.", ipa: "aɪd biːn kɔːt ɪn ə daʊnpɔː", vi: "câu nền — giọng treo nhẹ" },
          { text: "You can drip in here if you like.", ipa: "juː kən drɪp ɪn hɪə ɪf juː laɪk", vi: "câu thoại — cao hơn, chậm hơn" },
          { text: "I ended up staying for three hours.", ipa: "aɪ endɪd ʌp steɪɪŋ fə θriː aʊəz", vi: "nhấn three hours" },
          { text: "And that's exactly what we did.", ipa: "ənd ðæts ɪɡzæktli wɒt wi dɪd", vi: "câu chốt — chậm, hạ sâu" },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện tập trước khi ghi âm" },
      {
        t: "quiz",
        id: "t4d6-noi-dien",
        kind: "fill",
        title: "Điền vào câu chuyện — chia động từ trong ngoặc hoặc điền MỘT từ (8 chỗ trống)",
        items: [
          { q: "I remember one afternoon when I ___ (wait) for the bus in the rain.", answers: ["was waiting"] },
          { q: "I ___ (forget) my umbrella that morning, so I was soaked.", answers: ["had forgotten", "'d forgotten"] },
          { q: "Suddenly an old woman ___ (stop) next to me and held her umbrella over my head.", answers: ["stopped"] },
          { q: "All she ___ (say) was, ‘We're going the same way.’", answers: ["said"] },
          { q: "That's ___ I realised how kind strangers can be.", answers: ["when"] },
          { q: "My grandmother has a heart of ___.", answers: ["gold"] },
          { q: "The café is just a stone's ___ from my office.", answers: ["throw"] },
          { q: "He's very successful, yet he's completely down-to-___.", answers: ["earth"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-noi-chon",
        title: "Chọn cách nói đúng / tự nhiên hơn (6 câu)",
        items: [
          { q: "1. Câu nền của một câu chuyện:", options: ["I walked home when it started to rain.", "I walk home when it starts to rain.", "I was walking home when it started to rain.", "I had walked home when it was starting to rain."], correct: 2, why: "Nền = quá khứ tiếp diễn (was walking); sự việc cắt ngang = quá khứ đơn (started)." },
          { q: "2. Việc xảy ra TRƯỚC điểm đang kể:", options: ["I'd left my wallet at home, so I couldn't pay.", "I left my wallet at home, so I can't pay.", "I was leaving my wallet at home, so I couldn't pay.", "I have left my wallet at home, so I couldn't pay."], correct: 0, why: "Để quên ví xảy ra trước lúc không trả được tiền ⇒ had left (lùi một bậc — Ngày 3 mục 6)." },
          { q: "3. Mở câu chuyện tự nhiên nhất:", options: ["Now I will tell a story about him.", "The story is as follows.", "For example, one story.", "To give you an idea of what he's like, I remember one evening when…"], correct: 3, why: "Câu dẫn nối tính cách vừa nêu với câu chuyện. A, B nghe như đọc văn bản; C thiếu động từ." },
          { q: "4. Nhịp ④ (ý nghĩa) của câu chuyện:", options: ["That is the end of my story.", "That's when I realised how much he cared about his students.", "So this is a story.", "After that I went home and had dinner."], correct: 1, why: "Nhịp ④ nói vì sao chuyện đáng kể, và nối sang “why I admire him”. D chỉ kể tiếp sự việc không liên quan." },
          { q: "5. Tả nơi chốn — câu nào “cho thấy” nơi đó tốt nhất?", options: ["It is a very beautiful and peaceful place.", "It is very nice and I like it very much.", "It's a tiny place with shelves right up to the ceiling and the smell of old paper.", "It is a place which is good for relaxing."], correct: 2, why: "Chi tiết nhìn thấy + ngửi thấy được. Ba câu kia chỉ có tính từ chung." },
          { q: "6. Câu nào đúng?", options: ["The shop has a lot of characters.", "The shop is off the beat track.", "I stumbled across the shop by accident.", "The shop is a stone throw from my house."], correct: 2, why: "**stumble across** + nơi chốn. A: character (không đếm được) — a lot of **character**; B: off the **beaten** track; D: a **stone's** throw." },
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Luyện nói — ghi âm, AI chấm" },
      { t: "p", text: "Cách luyện: (1) bấm giờ **1 phút**, ghi 4 ô + ô ★ STORY (4–5 từ khoá, ghi sẵn câu thoại); (2) ghi âm tới khi đủ **2 phút**; (3) nghe lại và tự đánh dấu: có đủ 4 nhịp không? có ít nhất một **was V-ing… when…** và một **had V3** không? idiom có đúng nguyên dạng không? giọng có treo – hạ không? (4) ghi lại lần hai. Chép bản tốt nhất vào **sổ Speaking**." },
      {
        t: "speak",
        id: "t4d6-noi-part2",
        part: "2",
        questions: [
          "Describe an older person you admire. You should say: who this person is, how you know him or her, what he or she is like, and explain why you admire this person.",
          "Describe a place in your town or city where you go to relax. You should say: where it is, how you found it, what you do there, and explain why it helps you relax.",
          "Describe a person you know who is very good at helping other people. You should say: who this person is, how you know him or her, how he or she helps others, and explain why you think this person is good at it.",
        ],
      },
      {
        t: "speak",
        id: "t4d6-noi-hoi-them",
        part: "3",
        questions: [
          "Do you think older people are respected as much today as they were in the past?",
          "What kinds of places do people in your country go to when they want to relax?",
          "Why do some people enjoy telling stories about their own lives?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 6 ═══════════════════════════ */
  {
    id: "t4d6-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 6 — collocation verb + noun · Task 1 nhiều đường · kể chuyện trong Part 2",
    goal: "Tự kiểm lại cả ngày: ghép đúng collocation học thuật, dùng khung câu Phrasebank, nhóm đường và chọn số cho biểu đồ nhiều đường, kể một câu chuyện nhỏ đúng thì — 40 câu có đáp án + 1 bài nói.",
    minutes: 55,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài tập hôm nay",
        items: [
          "Làm **không mở lại bài học**. Xong từng phần mới xem đáp án.",
          "Phần I–III ôn **bài 1** (collocation) · Phần IV–V ôn **bài 2** (Task 1 nhiều đường) · Phần VI ôn **bài 3** (kể chuyện, idiom).",
          "Collocation sai ⇒ chép cả **cặp đúng** vào sổ lỗi, không chỉ chép một từ.",
          "Làm xong thì nghỉ 10 phút rồi sang **bài kiểm tra chặng (Ngày 1–6)**.",
        ],
      },

      { t: "h", text: "Phần I — Chọn động từ đúng (8 câu · ôn bài 1 mục 2–6)" },
      {
        t: "mcq",
        id: "t4d6-bt-chon",
        title: "I. Chọn đáp án đúng",
        items: [
          { q: "1. Deforestation ___ a serious threat to thousands of species.", options: ["makes", "gives", "poses", "puts"], correct: 2, why: "**pose** a threat to." },
          { q: "2. The council plans to ___ a ban on single-use plastic bags.", options: ["impose", "strike", "exert", "shed"], correct: 0, why: "**impose** a ban on." },
          { q: "3. It is too soon to ___ any conclusions about the long-term effects.", options: ["do", "draw", "catch", "take"], correct: 1, why: "**draw / reach** a conclusion." },
          { q: "4. The charity works to ___ poverty in remote mountain villages.", options: ["solve", "exacerbate", "lift", "alleviate"], correct: 3, why: "**alleviate** poverty = giảm bớt. exacerbate = làm tệ hơn (ngược nghĩa); ~~solve poverty~~ không phải collocation." },
          { q: "5. Recent discoveries have ___ doubt on the traditional account.", options: ["cast", "lent", "drawn", "held"], correct: 0, why: "**cast** doubt on." },
          { q: "6. Every citizen should ___ responsibility for reducing waste.", options: ["make", "take", "do", "play"], correct: 1, why: "**take / accept** responsibility for." },
          { q: "7. The factory closure ___ about a rapid change in the town's economy.", options: ["took", "set", "brought", "gave"], correct: 2, why: "**bring about** (a) change." },
          { q: "8. Without investment, the service will be unable to ___ demand.", options: ["reach", "fill", "catch", "meet"], correct: 3, why: "**meet** demand / a need / a target." },
        ],
      },

      { t: "h", text: "Phần II — Điền MỘT danh từ (8 câu · ôn bài 1 mục 2–7)" },
      {
        t: "quiz",
        id: "t4d6-bt-danh-tu",
        kind: "fill",
        title: "II. Điền danh từ còn thiếu của collocation",
        items: [
          { q: "Schools need to strike a ___ between discipline and freedom.", answers: ["balance"] },
          { q: "The campaign helped to raise public ___ of the dangers of smoking.", answers: ["awareness"] },
          { q: "Any new law must take local traditions into ___.", answers: ["account", "consideration"] },
          { q: "Grandparents play an important ___ in bringing up children in many Asian families.", answers: ["role", "part"] },
          { q: "The study sheds new ___ on how children acquire language.", answers: ["light"] },
          { q: "Allowing one exception would set a dangerous ___ for future cases.", answers: ["precedent"] },
          { q: "Too much screen time can do more ___ than good.", answers: ["harm"] },
          { q: "Mass tourism has given ___ to tensions between visitors and residents.", answers: ["rise"] },
        ],
      },

      { t: "h", text: "Phần III — Dịch câu Task 2 (5 câu · ôn bài 1 mục 9)" },
      {
        t: "quiz",
        id: "t4d6-bt-dich",
        kind: "translate",
        title: "III. Dịch sang tiếng Anh — dùng collocation trong gợi ý",
        grammar: "collocation verb + noun · khung câu Phrasebank",
        items: [
          { q: "Chính phủ nên hành động khẩn cấp để xử lý vấn đề ô nhiễm không khí.", answers: ["The government should take urgent action to tackle the problem of air pollution.", "The government should take urgent action to tackle air pollution.", "Governments should take urgent action to tackle the problem of air pollution.", "Governments should take urgent action to tackle air pollution.", "The government should take urgent action to address the problem of air pollution."], hint: "take urgent action · tackle the problem of" },
          { q: "Nghiên cứu được tiến hành ở Nhật Bản đã cho thấy rằng người cao tuổi làm việc lâu hơn.", answers: ["Research conducted in Japan has shown that older people work for longer.", "Research conducted in Japan has shown that older people work longer.", "Research conducted in Japan has shown that elderly people work for longer.", "Research carried out in Japan has shown that older people work for longer.", "Research conducted in Japan has shown that the elderly work for longer."], hint: "Research conducted in · has shown that" },
          { q: "Công nghệ đã có tác động sâu sắc lên cách chúng ta giao tiếp.", answers: ["Technology has had a profound impact on the way we communicate.", "Technology has had a profound impact on how we communicate.", "Technology has had a profound effect on the way we communicate."], hint: "has had a profound impact on" },
          { q: "Có lý lẽ mạnh mẽ ủng hộ việc đầu tư vào giao thông công cộng.", answers: ["There is a strong case for investing in public transport.", "There is a strong case for investing in public transportation."], hint: "There is a strong case for + V-ing" },
          { q: "Chính sách mới không giải quyết được nguyên nhân gốc rễ của vấn đề.", answers: ["The new policy fails to address the root causes of the problem.", "The new policy does not address the root causes of the problem.", "The new policy fails to address the underlying causes of the problem.", "The new policy fails to address the root cause of the problem.", "The new policy does not address the root cause of the problem."], hint: "fails to address · the root causes of" },
        ],
      },

      { t: "h", text: "Phần IV — Đọc biểu đồ nhiều đường (6 câu · ôn bài 2 mục 3–6)" },
      { t: "p", text: "Biểu đồ: phần trăm hộ gia đình ở một nước sở hữu năm loại thiết bị, 2000–2020. Trả lời 6 câu mà **không viết bài**." },
      {
        t: "chart",
        kind: "line",
        title: "Percentage of households in one country owning five devices, 2000–2020",
        unit: "%",
        labels: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Smartphone", values: [0, 5, 35, 70, 90] },
          { name: "Laptop", values: [10, 25, 45, 60, 65] },
          { name: "Landline phone", values: [90, 85, 70, 50, 30] },
          { name: "DVD player", values: [20, 55, 60, 40, 15] },
          { name: "Television", values: [95, 96, 96, 95, 94] },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-bt-bieu-do",
        title: "IV. Chọn đáp án đúng theo biểu đồ thiết bị",
        items: [
          { q: "1. Nhóm nào hợp lý nhất?", options: ["Tăng: smartphone, laptop · Giảm: landline · Lên rồi xuống: DVD player · Đi ngang: television", "Tăng: smartphone, laptop, DVD player · Giảm: landline, television", "Mỗi thiết bị một nhóm", "Cao: television, landline · Thấp: ba thiết bị còn lại"], correct: 0, why: "Bốn kiểu đường rõ ràng. DVD player có đỉnh 2010 rồi giảm — không thể xếp vào “tăng”; television gần như phẳng — không phải “giảm”." },
          { q: "2. Câu overview nào tốt nhất?", options: ["Overall, smartphone ownership rose from 0% to 90%.", "Overall, there were many changes in the ownership of devices.", "Overall, ownership of smartphones and laptops grew substantially while landlines became far less common, and televisions remained almost universal throughout.", "Overall, I think smartphones are more useful than landlines."], correct: 2, why: "Nêu các nhóm xu hướng, không số, không ý kiến. A có số; B mơ hồ; D là ý kiến cá nhân." },
          { q: "3. Smartphone vượt landline trong khoảng nào?", options: ["2005–2010", "2010–2015", "2015–2020", "Không bao giờ"], correct: 1, why: "2010: 35% < 70%; 2015: 70% > 50% ⇒ vượt trong 2010–2015." },
          { q: "4. Câu nào tả DVD player đúng?", options: ["DVD player ownership rose steadily to 60%.", "DVD player ownership fell throughout the period.", "DVD player ownership fluctuated around 20%.", "DVD player ownership tripled to a peak of 60% in 2010 before falling to 15%."], correct: 3, why: "20 → 60 là gấp ba, đỉnh năm 2010, rồi xuống 15%." },
          { q: "5. Landline: 90% → 30%. Cách nói nào đúng?", options: ["fell by a third", "fell to a third of its original level", "fell by 30%", "halved"], correct: 1, why: "30 là **một phần ba của** 90 ⇒ fell **to a third of** its original level (= fell **by two-thirds**). “fell by a third” sẽ là 90 → 60." },
          { q: "6. Con số nào nên BỎ?", options: ["Television năm 2005: 96%", "Smartphone năm 2020: 90%", "DVD player năm 2010: 60% (đỉnh)", "Landline năm 2000: 90%"], correct: 0, why: "Television gần như không đổi — chỉ cần một câu “remained at around 95%”. Mốc giữa 96% không thêm thông tin." },
        ],
      },

      { t: "h", text: "Phần V — Ngôn ngữ nhóm (5 câu · ôn bài 2 mục 5)" },
      {
        t: "quiz",
        id: "t4d6-bt-nhom",
        kind: "fill",
        title: "V. Điền MỘT từ: albeit · contrast · respectively · overtaken · with",
        items: [
          { q: "Laptop ownership also rose, ___ less dramatically than that of smartphones.", answers: ["albeit"] },
          { q: "By 2020, smartphones and laptops were owned by 90% and 65% of households ___.", answers: ["respectively"] },
          { q: "By ___, the proportion of homes with a landline fell in every period.", answers: ["contrast"] },
          { q: "By 2015, landlines had been ___ by both smartphones and laptops.", answers: ["overtaken"] },
          { q: "Television ownership barely changed, ___ the figure remaining at around 95%.", answers: ["with"] },
        ],
      },

      { t: "h", text: "Phần VI — Kể chuyện và idiom (8 câu · ôn bài 3 mục 2–4)" },
      {
        t: "mcq",
        id: "t4d6-bt-noi",
        title: "VI. Chọn đáp án đúng",
        items: [
          { q: "1. I ___ in the library when the fire alarm went off.", options: ["studied", "have studied", "was studying", "study"], correct: 2, why: "Nền của câu chuyện = quá khứ tiếp diễn; chuông báo = sự việc cắt ngang." },
          { q: "2. When I got to the station, I realised I ___ my ticket at home.", options: ["had left", "left", "was leaving", "have left"], correct: 0, why: "Để quên vé xảy ra **trước** lúc tới ga ⇒ had left." },
          { q: "3. Nhịp nào của câu chuyện là “That's when I realised how much she'd done for us”?", options: ["① Cảnh", "② Sự việc", "③ Câu thoại", "④ Ý nghĩa"], correct: 3, why: "Câu rút ra ý nghĩa — cầu nối sang “explain why”." },
          { q: "4. My uncle hates change; he's very ___ in his ways.", options: ["put", "set", "kept", "held"], correct: 1, why: "**set in his ways**." },
          { q: "5. At parties my cousin is the life and ___ of the party.", options: ["heart", "spirit", "soul", "mind"], correct: 2, why: "**the life and soul of the party**." },
          { q: "6. The guesthouse is ___ away at the end of a quiet lane.", options: ["tucked", "put", "kept", "thrown"], correct: 0, why: "**tucked away** = nằm khuất." },
          { q: "7. Dạng nào đúng?", options: ["She wears her heart on her sleeves.", "She wears heart on sleeve.", "She wears her heart in her sleeve.", "She wears her heart on her sleeve."], correct: 3, why: "**wear your heart on your sleeve** — sleeve số ít, giới từ on." },
          { q: "8. Trong Task 2, câu nào hợp văn phong?", options: ["Volunteers have a heart of gold.", "Volunteers make a valuable contribution to their communities.", "Volunteers are the life and soul of the party.", "Volunteers go the extra mile, as the saying goes."], correct: 1, why: "Idiom tính cách thuộc văn nói; trong Writing dùng collocation học thuật: **make a contribution to**." },
        ],
      },

      { t: "h", text: "Nói thêm — Part 2 có câu chuyện (ghi âm, AI chấm)" },
      {
        t: "speak",
        id: "t4d6-bt-noi-part2",
        part: "2",
        questions: [
          "Describe a place you visited as a child that you still remember well. You should say: where it was, who you went there with, what you did there, and explain why you still remember it.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ KIỂM TRA CHẶNG — NGÀY 1–6 ═══════════════════════════ */
  {
    id: "t4d6-kiem-tra",
    kind: "review",
    title: "Kiểm tra chặng (Ngày 1–6)",
    goal: "Đo lại cả chặng 1 của Tập 4 theo 8 phần — ngữ pháp, từ vựng, dịch, nghe, đọc, viết, nói, phát âm — với ngưỡng đạt ≥ 70 % từng phần, và biết chính xác phần nào hụt thì ôn lại Ngày nào trước khi sang Ngày 7.",
    minutes: 180,
    blocks: [
      {
        t: "recap",
        title: "Cách làm bài kiểm tra chặng",
        items: [
          "Làm **một mạch** khoảng 3 giờ (có thể tách: Phần 1–5 buổi sáng, Phần 6–8 buổi chiều). **Không** mở lại bài học, không tra từ.",
          "Mỗi phần có **ngưỡng đạt ≥ 70 %** ghi ngay ở tiêu đề, kèm **Ngày cần ôn** nếu hụt.",
          "Nghe: mỗi bản ghi nghe **một lần**. Đọc: bấm giờ **20 phút**. Viết: Task 1 **20 phút**, Task 2 **40 phút**.",
          "Đạt cả 8 phần ⇒ sang Ngày 7. Hụt phần nào ⇒ ôn đúng Ngày đó rồi làm lại **riêng phần ấy** sau 2 ngày.",
          "Band ghi trong bài (AI chấm Viết / Nói) là **ước tính**, dùng để so với chính bạn ở chặng sau.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Chặng 1 (Ngày 1–6) — những gì sẽ bị kiểm",
        center: "Tập 4 · Chặng 1",
        branches: [
          { label: "Ngữ pháp", items: ["N1 cụm danh từ phức · mạo từ · không đếm được", "N3 HTHT cho xu hướng · By + had V3", "N5 participle clause · chủ ngữ treo"] },
          { label: "Từ vựng", items: ["N2 AWL sublist 7 · Environment 2", "N4 Psychology & behaviour", "N6 collocation verb + noun"] },
          { label: "Đọc", items: ["N1 Passage 3 — câu dài", "N3 Headings ý ẩn", "N5 TFNG / YNNG bẫy band 7"] },
          { label: "Nghe", items: ["N1 Part 1 chính tả · số nhiều", "N4 Part 2 MCQ dài", "N5 Part 3 bốn người"] },
          { label: "Viết", items: ["N2 band 7 trông thế nào", "N4 Opinion ba tầng · Granted… but…", "N6 Task 1 nhiều đường"] },
          { label: "Nói + phát âm", items: ["N2 Part 1 band 7 · sentence stress", "N3 Part 3 xưa – nay – sắp tới · /ɜː/ /ə/", "N6 Part 2 có câu chuyện · ngữ điệu kể"] },
        ],
      },

      /* ───────────── 1. Ngữ pháp ───────────── */
      { t: "h", text: "Phần 1 — Ngữ pháp (15 + 9 câu · đạt ≥ 17/24 · trượt thì ôn Ngày 1, 3, 5)" },
      { t: "p", text: "Câu 1–5 thuộc **Ngày 1** (cụm danh từ, mạo từ, danh từ không đếm được) · câu 6–10 thuộc **Ngày 3** (thì trong văn học thuật) · câu 11–15 thuộc **Ngày 5** (participle clauses). Sai từ 2 câu trong một nhóm ⇒ ôn Ngày đó." },
      {
        t: "mcq",
        id: "t4d6-kt-ngu-phap-chon",
        title: "1a. Chọn đáp án đúng (15 câu)",
        items: [
          { q: "1. ___ of technology has changed the way we work.", options: ["Development", "The development", "A development", "Developments"], correct: 1, why: "N + of + cái cụ thể ⇒ **the**: The development of technology (Ngày 1 mục 5)." },
          { q: "2. Much research ___ that sleep affects memory.", options: ["has shown", "have shown", "show", "are showing"], correct: 0, why: "research không đếm được ⇒ động từ số ít: has shown (Ngày 1 mục 6; Ngày 3 mục 4)." },
          { q: "3. The quality of public services in rural areas ___ still poor.", options: ["are", "were", "is", "have been"], correct: 2, why: "Danh từ chính là **quality** (số ít), không phải services / areas ⇒ is (Ngày 1 mục 4)." },
          { q: "4. There is ___ evidence that the new policy works.", options: ["few", "many", "a few", "little"], correct: 3, why: "evidence không đếm được ⇒ little (rất ít). few / many / a few đi với danh từ đếm được số nhiều." },
          { q: "5. ___ agree that the internet has made daily life easier.", options: ["The most people", "Most of people", "Most people", "Most the people"], correct: 2, why: "most + N = hầu hết: Most people. the most = so sánh nhất (Ngày 1 mục 7, lỗi ④)." },
          { q: "6. The number of people living alone ___ steadily in recent decades.", options: ["grew", "had grown", "is grown", "has grown"], correct: 3, why: "Xu hướng kéo tới nay + cụm thời gian mở (in recent decades) ⇒ HTHT (Ngày 3 mục 2). grow nội động từ, không bị động." },
          { q: "7. By 2010, the figure ___ to 20 million.", options: ["had doubled", "has doubled", "doubled", "was doubling"], correct: 0, why: "By + mốc quá khứ ⇒ had + V3 (Ngày 3 mục 5)." },
          { q: "8. A 2019 survey ___ that 40% of employees felt isolated.", options: ["has found", "finds", "found", "had been found"], correct: 2, why: "Một nghiên cứu cụ thể, có năm ⇒ quá khứ đơn (Ngày 3 mục 4)." },
          { q: "9. In her latest book, Brown ___ that cities are becoming less equal.", options: ["is arguing", "has been argued", "had argued", "argues"], correct: 3, why: "Thuật quan điểm / lập luận của tác giả ⇒ hiện tại đơn: argues (Ngày 3 mục 4)." },
          { q: "10. The last fifty years ___ unprecedented urban growth.", options: ["have seen", "saw", "had seen", "are seeing"], correct: 0, why: "Chủ ngữ thời gian + have seen — khung xu hướng band 7 (Ngày 3 mục 2)." },
          { q: "11. ___ with rising costs, many small firms have closed.", options: ["Faced", "Facing", "Having faced", "Face"], correct: 0, why: "Cụm bị động cố định: (be) **Faced with** (Ngày 5 mục 4). Facing không đi với with." },
          { q: "12. Rents have doubled, ___ many young people to move back in with their parents.", options: ["forced", "which forcing", "to force", "forcing"], correct: 3, why: "V-ing sau dấu phẩy = kết quả của cả mệnh đề trước (Ngày 5 mục 3)." },
          { q: "13. ___ the data, the researchers reached a clear conclusion.", options: ["Analysed", "Having analysed", "Being analysed", "To be analysed"], correct: 1, why: "Phân tích xong trước rồi mới kết luận; researchers là người phân tích ⇒ Having + V3 (Ngày 5 mục 5)." },
          { q: "14. Sales fell in all four countries, ___ Italy recording the steepest decline.", options: ["while", "and", "with", "which"], correct: 2, why: "Absolute clause: with + N + V-ing (Ngày 5 mục 8). while / and cần động từ chia thì." },
          { q: "15. Câu nào KHÔNG có chủ ngữ treo?", options: ["Looking at the chart, sales rose sharply.", "When asked about pay, most nurses complained.", "Having finished the survey, the results were published.", "Being a small country, the people of Singapore import their food."], correct: 1, why: "Người được hỏi là nurses ⇒ khớp. A: sales không nhìn biểu đồ; C: results không làm khảo sát; D: người dân không phải một quốc gia (Ngày 5 mục 7)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-kt-ngu-phap-dien",
        kind: "fill",
        title: "1b. Điền mạo từ (a / an / the, hoặc x nếu không cần) hoặc chia động từ trong ngoặc (9 câu)",
        items: [
          { q: "___ rise of social media has changed the way politicians communicate. (a / an / the / x)", answers: ["The"] },
          { q: "There was ___ sharp fall in sales in 2020. (a / an / the / x)", answers: ["a"] },
          { q: "___ young people today spend too much time online. (a / an / the / x)", answers: ["x", "X", "Ø", "-"] },
          { q: "The laboratory needs more modern ___ . (equipment / equipments)", answers: ["equipment"] },
          { q: "Research ___ (show) that regular exercise improves mood. (nhiều nghiên cứu, còn giá trị tới nay)", answers: ["has shown"] },
          { q: "By the end of the period, sales of the two products ___ (reach) almost the same level.", answers: ["had reached"] },
          { q: "___ (build) in 1890, the station is the oldest in the country.", answers: ["Built"] },
          { q: "___ (not / know) the local language, she felt isolated at first.", answers: ["Not knowing"] },
          { q: "The samples ___ (collect) by the team were analysed in Germany.", answers: ["collected"] },
        ],
      },

      /* ───────────── 2. Từ vựng ───────────── */
      { t: "h", text: "Phần 2 — Từ vựng (12 + 6 câu · đạt ≥ 13/18 · trượt thì ôn Ngày 2, 4, 6)" },
      { t: "p", text: "Câu 1–3: **AWL sublist 7** · câu 4: **Environment vòng 2** (cả bốn thuộc Ngày 2) · câu 5–8: **Psychology, happiness & behaviour** (Ngày 4) · câu 9–12: **collocation verb + noun** (Ngày 6)." },
      {
        t: "mcq",
        id: "t4d6-kt-tu-vung-chon",
        title: "2a. Chọn từ đúng (12 câu)",
        items: [
          { q: "1. The law ___ the sale of cigarettes to anyone under eighteen.", options: ["submits", "converts", "prohibits", "infers"], correct: 2, why: "prohibit = cấm (AWL 7). submit = nộp; convert = chuyển đổi; infer = suy ra." },
          { q: "2. The committee ___ twelve members from five countries.", options: ["comprises", "adapts", "eliminates", "releases"], correct: 0, why: "comprise = gồm có (không có of ở chủ động: comprises twelve members)." },
          { q: "3. Oil is a ___ resource: one day it will run out.", options: ["voluntary", "identical", "visible", "finite"], correct: 3, why: "finite = có hạn. voluntary = tự nguyện; identical = giống hệt; visible = nhìn thấy được." },
          { q: "4. The new limits on river pollution will achieve nothing unless they are strictly ___.", options: ["incentivised", "enforced", "offset", "depleted"], correct: 1, why: "enforce a law / a ban / limits = thực thi, bắt tuân thủ (Ngày 2 mục 4: Environmental laws are useless unless they are properly enforced). incentivise = khuyến khích bằng lợi ích; offset = bù trừ; deplete = làm cạn kiệt." },
          { q: "5. Children who overcome early difficulties often develop great ___ — the ability to recover from setbacks.", options: ["resilience", "gratification", "temperament", "bias"], correct: 0, why: "resilience = sức bật, khả năng phục hồi (Ngày 4 mục 2)." },
          { q: "6. Many teenagers take up smoking because of ___ pressure.", options: ["impulse", "trait", "peer", "stimulus"], correct: 2, why: "peer pressure = áp lực từ bạn bè cùng trang lứa (Ngày 4 mục 3)." },
          { q: "7. Sincere praise can ___ a child's self-esteem.", options: ["suppress", "boost", "procrastinate", "conform"], correct: 1, why: "boost / raise self-esteem (Ngày 4 mục 6). suppress = kìm nén." },
          { q: "8. Working long hours for years can ___ a heavy toll on employees' health.", options: ["make", "do", "give", "take"], correct: 3, why: "take a toll on = gây tổn hại dần (Ngày 4 mục 6)." },
          { q: "9. The floods ___ extensive damage to roads and bridges.", options: ["made", "caused", "gave", "posed"], correct: 1, why: "cause / do damage (Ngày 6 nhóm B). ~~make damage~~ sai; pose đi với a threat." },
          { q: "10. Rising sea levels ___ a serious threat to coastal cities.", options: ["give", "make", "do", "pose"], correct: 3, why: "pose a threat to (Ngày 6 nhóm B)." },
          { q: "11. Experts have yet to ___ a consensus on the causes of the decline.", options: ["reach", "draw", "strike", "cast"], correct: 0, why: "reach a consensus (Ngày 6 nhóm A). draw a conclusion · strike a balance · cast doubt." },
          { q: "12. The reforms failed to ___ the underlying issue of low pay.", options: ["impose", "exert", "address", "shed"], correct: 2, why: "address an issue (Ngày 6 nhóm B)." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-kt-tu-vung-dang",
        kind: "fill",
        title: "2b. Viết dạng đúng của từ trong ngoặc, hoặc điền từ còn thiếu của collocation (6 câu)",
        items: [
          { q: "The campaign aims to raise public ___ (aware) of mental health issues.", answers: ["awareness"] },
          { q: "Many people find a sense of ___ (fulfil) in voluntary work.", answers: ["fulfilment", "fulfillment"] },
          { q: "The ___ (prohibit) of smoking in restaurants was introduced in 2007.", answers: ["prohibition"] },
          { q: "Technological ___ (innovate) has transformed farming.", answers: ["innovation"] },
          { q: "Remote working has had a profound ___ on family life. (một danh từ)", answers: ["impact", "effect", "influence"] },
          { q: "Scholarships can help to ___ the gap between rich and poor students. (một động từ)", answers: ["bridge", "narrow", "close"] },
        ],
      },

      /* ───────────── 3. Dịch ───────────── */
      { t: "h", text: "Phần 3 — Dịch Việt → Anh (6 câu · đạt ≥ 5/6)" },
      { t: "p", text: "Mỗi câu kiểm một điểm của chặng. Câu 1 — Ngày 1 · câu 2, 3 — Ngày 3 · câu 4, 5 — Ngày 5 · câu 6 — Ngày 6." },
      {
        t: "quiz",
        id: "t4d6-kt-dich",
        kind: "translate",
        title: "3. Dịch sang tiếng Anh",
        items: [
          { q: "Sự phát triển của công nghệ đã thay đổi cách chúng ta làm việc.", answers: ["The development of technology has changed the way we work.", "The development of technology has changed how we work."], hint: "The development of · has changed the way" },
          { q: "Số người sống một mình đã tăng đều trong những thập kỷ gần đây.", answers: ["The number of people living alone has grown steadily in recent decades.", "The number of people living alone has risen steadily in recent decades.", "The number of people living alone has increased steadily in recent decades.", "The number of people who live alone has grown steadily in recent decades."], hint: "The number of people living alone · has grown steadily" },
          { q: "Đến năm 2010, con số này đã tăng gấp đôi.", answers: ["By 2010, the figure had doubled.", "By 2010, this figure had doubled.", "By 2010 the figure had doubled.", "By 2010 this figure had doubled."], hint: "By 2010 · had doubled" },
          { q: "Đối mặt với chi phí tăng, công ty đã cắt giảm 200 việc làm.", answers: ["Faced with rising costs, the company cut 200 jobs.", "Faced with rising costs, the company has cut 200 jobs.", "Faced with increasing costs, the company cut 200 jobs."], hint: "Faced with rising costs · cut 200 jobs" },
          { q: "Giá nhà đã tăng mạnh, khiến người trẻ khó mua được nhà.", answers: ["House prices have risen sharply, making it difficult for young people to buy a home.", "House prices have risen sharply, making it difficult for young people to buy a house.", "House prices have risen sharply, making it hard for young people to buy a home.", "House prices have increased sharply, making it difficult for young people to buy a home.", "House prices have risen sharply, making it hard for young people to buy a house."], hint: "…, making it difficult for young people to + V" },
          { q: "Chính phủ nên hành động để thu hẹp khoảng cách giữa người giàu và người nghèo.", answers: ["The government should take action to bridge the gap between rich and poor.", "The government should take action to bridge the gap between the rich and the poor.", "The government should take action to narrow the gap between rich and poor.", "The government should take action to narrow the gap between the rich and the poor.", "Governments should take action to bridge the gap between rich and poor.", "Governments should take action to bridge the gap between the rich and the poor."], hint: "take action · bridge the gap between" },
        ],
      },

      /* ───────────── 4. Nghe ───────────── */
      { t: "h", text: "Phần 4 — Nghe (5 + 4 + 5 câu · đạt ≥ 10/14 · trượt thì ôn Ngày 1, 4, 5)" },
      { t: "p", text: "**Recording 1 (Part 1 — ôn Ngày 1).** Complete the form. Write **ONE WORD AND/OR A NUMBER** for each answer. Chú ý chính tả, số nhiều và lời tự sửa." },
      {
        t: "listen",
        id: "t4d6-kt-nghe-dang-ky",
        title: "Booking a stall at a craft fair",
        dan: { so: "Checkpoint Test 1, Recording 1", boiCanh: "a telephone conversation between a man who wants to book a stall and a member of staff at a craft fair office.", cau: [1, 5] },
        note: "Khoảng 1 phút 20 giây. Helen (Anh, nữ) · Daniel (Canada, nam).",
        lines: [
          { who: "Helen", voice: "uk-nu", text: "Good morning, Ferndale Craft Fair office, Helen speaking.", vi: "Chào buổi sáng, văn phòng Hội chợ thủ công Ferndale, Helen xin nghe." },
          { who: "Daniel", voice: "ca-nam", text: "Hi, I'd like to book a stall for the autumn fair. My name's Daniel Whitcombe.", vi: "Chào chị, tôi muốn đặt một gian hàng cho hội chợ mùa thu. Tôi tên là Daniel Whitcombe." },
          { who: "Helen", voice: "uk-nu", text: "Could you spell the surname for me?", vi: "Anh đánh vần họ giúp tôi được không?" },
          { who: "Daniel", voice: "ca-nam", text: "Sure. It's W-H-I-T-C-O-M-B-E.", vi: "Được. W-H-I-T-C-O-M-B-E." },
          { who: "Helen", voice: "uk-nu", text: "Thank you. And what will you be selling?", vi: "Cảm ơn anh. Anh sẽ bán gì ạ?" },
          { who: "Daniel", voice: "ca-nam", text: "Hand-made candles. Well, I do a little soap as well, but it's mainly candles.", vi: "Nến làm thủ công. À, tôi cũng làm một ít xà phòng, nhưng chủ yếu là nến." },
          { who: "Helen", voice: "uk-nu", text: "Lovely. Now, a standard stall comes with one table. Would you like any extras?", vi: "Hay quá. Một gian tiêu chuẩn có sẵn một cái bàn. Anh có muốn thêm gì không?" },
          { who: "Daniel", voice: "ca-nam", text: "Could I have two extra shelves? I've got a lot of small items to display.", vi: "Cho tôi thêm hai cái kệ được không? Tôi có nhiều món nhỏ cần bày." },
          { who: "Helen", voice: "uk-nu", text: "Of course. That's forty-five pounds for the stall and six for the shelves, so fifty-one pounds altogether.", vi: "Được ạ. Bốn mươi lăm bảng cho gian hàng và sáu bảng cho kệ, tổng cộng năm mươi mốt bảng." },
          { who: "Daniel", voice: "ca-nam", text: "Fine. And which day do we set up?", vi: "Được. Thế ngày nào thì dựng gian?" },
          { who: "Helen", voice: "uk-nu", text: "Stallholders set up on the Thursday — sorry, I tell a lie, that was last year. This year it's Friday the thirteenth, from four in the afternoon.", vi: "Chủ gian dựng vào thứ Năm — xin lỗi, tôi nói nhầm, đó là năm ngoái. Năm nay là thứ Sáu ngày mười ba, từ bốn giờ chiều." },
          { who: "Daniel", voice: "ca-nam", text: "Got it. And where should I park?", vi: "Rõ rồi. Tôi nên đỗ xe ở đâu?" },
          { who: "Helen", voice: "uk-nu", text: "Use the car park on Quarry Lane. That's Q-U-A-double R-Y.", vi: "Anh dùng bãi đỗ trên đường Quarry Lane. Q-U-A-hai chữ R-Y." },
          { who: "Daniel", voice: "ca-nam", text: "Great, thanks very much.", vi: "Tuyệt, cảm ơn chị nhiều." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-kt-nghe-dang-ky-cau",
        kind: "fill",
        title: "Questions 1–5 — Ferndale Craft Fair: stall booking",
        items: [
          { q: "(1) Surname: Daniel ___", answers: ["Whitcombe"] },
          { q: "(2) Main product: hand-made ___", answers: ["candles"] },
          { q: "(3) Extras: two ___", answers: ["shelves"] },
          { q: "(4) Total cost: £ ___", answers: ["51", "fifty-one", "fifty one"] },
          { q: "(5) Set-up: ___ 13th, from 4 p.m. — parking on Quarry Lane", answers: ["Friday"] },
        ],
      },
      {
        t: "note",
        title: "📌 Giải thích Recording 1",
        items: [
          "(1) Đánh vần: W-H-I-T-C-O-M-B-E — có **e** cuối.",
          "(2) **candles** — số nhiều; soap chỉ là “a little… as well” (thông tin nhiễu).",
          "(3) **shelves** — số nhiều bất quy tắc của shelf; viết ~~shelfs~~ là sai.",
          "(4) 45 + 6 = **51**. Hai con số 45 và 6 là bẫy nếu chỉ chép số nghe được đầu tiên.",
          "(5) Thursday là lời nói nhầm (“sorry, I tell a lie, that was last year”) ⇒ **Friday**.",
        ],
      },
      { t: "p", text: "**Recording 2 (Part 2 — ôn Ngày 4).** Choose the correct letter, **A, B or C**." },
      {
        t: "listen",
        id: "t4d6-kt-nghe-sua-do",
        title: "The Greenbank Repair Café",
        dan: { so: "Checkpoint Test 1, Recording 2", boiCanh: "a talk by the coordinator of a community repair café.", cau: [6, 9] },
        note: "Khoảng 1 phút 50 giây, một giọng (Úc, nữ), ~165 từ / phút.",
        lines: [
          { voice: "au-nu", text: "Good evening, everyone, and thanks for coming to hear about the Greenbank Repair Café. For those who haven't been before, the idea is simple: you bring something broken, and one of our volunteers helps you fix it.", vi: "Chào buổi tối mọi người, và cảm ơn đã tới nghe về Quán Sửa đồ Greenbank. Với những ai chưa từng tới, ý tưởng rất đơn giản: bạn mang một món đồ hỏng tới, và một tình nguyện viên của chúng tôi giúp bạn sửa." },
          { voice: "au-nu", text: "People often assume we started the café to save residents money, and of course it does that. A few assume it was an environmental campaign. In fact, what pushed our founder into action was something quite different: she'd noticed that her elderly neighbours hardly spoke to anyone all week, and she wanted to give them a reason to come out and use their skills. The savings and the reduction in waste came later, as welcome side effects.", vi: "Mọi người thường cho rằng chúng tôi mở quán để giúp cư dân tiết kiệm tiền, và dĩ nhiên nó có làm được điều đó. Một số người cho rằng đó là một chiến dịch môi trường. Thật ra, điều thúc đẩy người sáng lập hành động lại khác hẳn: bà nhận thấy các hàng xóm lớn tuổi của mình gần như cả tuần không nói chuyện với ai, và bà muốn cho họ một lý do để ra ngoài và dùng tay nghề của mình. Khoản tiết kiệm và việc giảm rác thải đến sau, như những tác dụng phụ đáng mừng." },
          { voice: "au-nu", text: "So what do people bring? In our first year it was overwhelmingly clothing — zips, hems, that kind of thing. Bicycles have always been steady. But over the past twelve months small electrical items — kettles, lamps, toasters — have overtaken everything else, and they now make up nearly half of what comes through the door.", vi: "Vậy mọi người mang gì tới? Năm đầu tiên thì áp đảo là quần áo — khoá kéo, gấu quần, đại loại thế. Xe đạp thì luôn ở mức đều đều. Nhưng trong mười hai tháng qua, đồ điện nhỏ — ấm đun nước, đèn, máy nướng bánh — đã vượt qua mọi thứ khác, và giờ chiếm gần một nửa số đồ được mang tới." },
          { voice: "au-nu", text: "Now, a change to how the sessions run. Until now you've simply turned up and waited. From next month you'll need to reserve a slot online beforehand. I know some of you would rather we stayed informal, and we did consider a ticket system at the door, but the queues were getting out of hand.", vi: "Giờ là một thay đổi về cách tổ chức các buổi. Từ trước tới nay các bạn cứ tới rồi chờ. Từ tháng sau, các bạn sẽ cần đặt trước một khung giờ trên mạng. Tôi biết một số bạn muốn chúng tôi cứ giữ kiểu thoải mái như cũ, và chúng tôi đã cân nhắc phát vé ở cửa, nhưng hàng người chờ đã vượt quá tầm kiểm soát." },
          { voice: "au-nu", text: "Finally, we're often asked whether we charge. Repairs are free, and they'll stay free. Spare parts you pay for at cost. What we do ask is that you stay with your item while it's being repaired — we're not a drop-off service — because the whole point is that you learn how it's done.", vi: "Cuối cùng, chúng tôi hay được hỏi là có thu phí không. Sửa chữa là miễn phí, và sẽ luôn miễn phí. Linh kiện thay thế thì bạn trả đúng giá gốc. Điều chúng tôi yêu cầu là bạn ở lại bên món đồ trong lúc nó được sửa — chúng tôi không phải dịch vụ gửi đồ rồi về — vì mục đích chính là để bạn học được cách sửa." },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-kt-nghe-sua-do-cau",
        title: "Questions 6–9",
        items: [
          { q: "(6) The café was originally set up in order to", options: ["A reduce the amount of household waste.", "B help older residents feel less isolated.", "C save local people money."], correct: 1, why: "“what pushed our founder into action was…: her elderly neighbours hardly spoke to anyone all week.” A và C được nhắc nhưng là “welcome side effects” đến sau. Bẫy: cả ba phương án đều có trong băng (Ngày 4)." },
          { q: "(7) Which kind of item is brought in most often now?", options: ["A clothes", "B bicycles", "C small electrical goods"], correct: 2, why: "“over the past twelve months small electrical items… have overtaken everything else”. Clothing là của **năm đầu** — bẫy thời gian." },
          { q: "(8) From next month, visitors will have to", options: ["A book a time in advance.", "B collect a ticket at the door.", "C arrive earlier than before."], correct: 0, why: "“you'll need to reserve a slot online beforehand” = book in advance. Vé ở cửa chỉ là phương án đã “consider” rồi bỏ." },
          { q: "(9) What are visitors required to do?", options: ["A pay a small fee for the repair", "B leave the item and collect it later", "C remain present while the item is repaired"], correct: 2, why: "“What we do ask is that you stay with your item while it's being repaired — we're not a drop-off service.” Repairs are free ⇒ loại A." },
        ],
      },
      { t: "p", text: "**Recording 3 (Part 3 — ôn Ngày 5).** Bốn người nói. **Questions 10–13:** What do the students finally agree about each research method? Write the correct letter, **A–F**. **Question 14:** choose A, B or C." },
      {
        t: "table",
        caption: "Comments",
        head: ["Chữ", "Comment"],
        rows: [
          ["**A**", "Too few people would take part."],
          ["**B**", "People would not answer honestly."],
          ["**C**", "It would produce detailed personal accounts."],
          ["**D**", "It would cost too much."],
          ["**E**", "Getting approval would take too long."],
          ["**F**", "The results would be quick to process."],
        ],
      },
      {
        t: "listen",
        id: "t4d6-kt-nghe-thao-luan",
        title: "Choosing methods for a study of procrastination",
        dan: { so: "Checkpoint Test 1, Recording 3", boiCanh: "three psychology students, Jess, Liam and Orla, discussing research methods with their tutor, Dr Reyes.", cau: [10, 14] },
        note: "Khoảng 2 phút, bốn giọng: Dr Reyes (Anh, nam) · Jess (Mỹ, nữ) · Liam (Úc, nam) · Orla (Ireland, nữ).",
        lines: [
          { who: "Dr Reyes", voice: "uk-nam", text: "So, your study of procrastination among first-year students. Which methods have you settled on? The online questionnaire first.", vi: "Vậy, nghiên cứu của các em về thói trì hoãn ở sinh viên năm nhất. Các em chốt những phương pháp nào? Bảng hỏi trực tuyến trước." },
          { who: "Liam", voice: "au-nam", text: "I'd assumed nobody would bother filling it in, to be honest.", vi: "Thú thật là em cứ tưởng sẽ chẳng ai buồn điền." },
          { who: "Jess", voice: "us-nu", text: "Actually, the students' union has offered to email it to every first-year, so numbers won't be a problem. For me the attraction is that the software gives you the totals instantly. We'd have our results in an afternoon.", vi: "Thật ra hội sinh viên đã đề nghị gửi email cho mọi sinh viên năm nhất, nên số lượng không thành vấn đề. Với mình, điểm hấp dẫn là phần mềm cho ra tổng số ngay lập tức. Bọn mình sẽ có kết quả trong một buổi chiều." },
          { who: "Liam", voice: "au-nam", text: "OK, I hadn't realised that. And speed matters, with our deadline.", vi: "Được, mình không biết chuyện đó. Và với hạn nộp của bọn mình thì tốc độ là quan trọng." },
          { who: "Dr Reyes", voice: "uk-nam", text: "And the diaries?", vi: "Còn nhật ký?" },
          { who: "Orla", voice: "ie-nu", text: "I love the idea — people writing down each evening what they'd put off and why. You'd get really rich, individual stories.", vi: "Em rất thích ý tưởng đó — mỗi tối người ta ghi lại mình đã trì hoãn việc gì và vì sao. Sẽ có những câu chuyện cá nhân rất phong phú." },
          { who: "Jess", voice: "us-nu", text: "Would you, though? If I'd wasted a whole day, I don't think I'd write that down for a stranger to read. I'd make myself look better.", vi: "Có thật thế không? Nếu mình phí cả một ngày, mình không nghĩ mình sẽ ghi điều đó ra cho người lạ đọc. Mình sẽ viết sao cho mình trông khá hơn." },
          { who: "Orla", voice: "ie-nu", text: "Hmm. That's true — I probably would too. People would tidy up the truth.", vi: "Ừm. Đúng — chắc mình cũng thế. Người ta sẽ tô lại sự thật." },
          { who: "Dr Reyes", voice: "uk-nam", text: "Quite. And the focus group?", vi: "Đúng vậy. Còn thảo luận nhóm tập trung?" },
          { who: "Liam", voice: "au-nam", text: "My worry there was the expense — hiring a room, refreshments and so on.", vi: "Điều em lo ở đó là chi phí — thuê phòng, đồ ăn nhẹ, vân vân." },
          { who: "Orla", voice: "ie-nu", text: "The department lets students use the seminar rooms for nothing. No, the real strength of a focus group is depth. In an hour's conversation people explain themselves in a way they never do on a form.", vi: "Khoa cho sinh viên dùng phòng seminar miễn phí. Không, điểm mạnh thật sự của thảo luận nhóm là chiều sâu. Trong một giờ trò chuyện, người ta giải thích về mình theo cách mà họ không bao giờ làm trên một tờ phiếu." },
          { who: "Jess", voice: "us-nu", text: "Yes — that's where we'd hear, in their own words, what it actually feels like.", vi: "Đúng — đó là nơi bọn mình được nghe, bằng chính lời của họ, cảm giác ấy thật sự ra sao." },
          { who: "Dr Reyes", voice: "uk-nam", text: "And the phone-tracking app?", vi: "Còn ứng dụng theo dõi việc dùng điện thoại?" },
          { who: "Jess", voice: "us-nu", text: "It's objective, which I like.", vi: "Nó khách quan, điều mà mình thích." },
          { who: "Orla", voice: "ie-nu", text: "But it records personal data, so we'd need permission from the ethics committee, and they only meet once a term. We'd miss the deadline.", vi: "Nhưng nó ghi lại dữ liệu cá nhân, nên bọn mình cần sự cho phép của hội đồng đạo đức, mà họ mỗi học kỳ chỉ họp một lần. Bọn mình sẽ trễ hạn." },
          { who: "Jess", voice: "us-nu", text: "Oh. Then it's out, sadly.", vi: "Ồ. Vậy thì đành loại, tiếc thật." },
          { who: "Dr Reyes", voice: "uk-nam", text: "I agree. One last thing: your sample. You're only looking at first-years, and I'd have no objection to that if you said why. At the moment the proposal doesn't explain the choice at all, and that's what you need to add. Don't widen it to other year groups — you haven't the time.", vi: "Thầy đồng ý. Một điều cuối: mẫu nghiên cứu. Các em chỉ xét sinh viên năm nhất, và thầy không phản đối nếu các em nói rõ vì sao. Hiện giờ đề cương hoàn toàn không giải thích lựa chọn đó, và đó là thứ các em cần bổ sung. Đừng mở rộng sang các khoá khác — các em không có thời gian." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-kt-nghe-thao-luan-ghep",
        kind: "fill",
        title: "Questions 10–13 — viết chữ cái A–F",
        items: [
          { q: "(10) online questionnaire ___", answers: ["F"] },
          { q: "(11) diaries kept by participants ___", answers: ["B"] },
          { q: "(12) focus group ___", answers: ["C"] },
          { q: "(13) phone-tracking app ___", answers: ["E"] },
        ],
      },
      {
        t: "mcq",
        id: "t4d6-kt-nghe-thao-luan-chon",
        title: "Question 14",
        items: [
          { q: "(14) Dr Reyes says the students should", options: ["A include students from other year groups.", "B explain why they have chosen first-year students.", "C reduce the number of participants."], correct: 1, why: "“I'd have no objection to that **if you said why**… the proposal doesn't explain the choice at all, and that's what you need to add. **Don't widen it** to other year groups.” ⇒ B; A bị bác thẳng." },
        ],
      },
      {
        t: "note",
        title: "📌 Giải thích Recording 3 — nhận xét nào bị bác",
        items: [
          "(10) **F** — “the software gives you the totals instantly… results in an afternoon”. Bẫy A: Liam “I'd assumed nobody would bother” → Jess “**Actually**… numbers won't be a problem”.",
          "(11) **B** — Jess: “I'd make myself look better”; Orla: “People would tidy up the truth.” Bẫy C: Orla “rich, individual stories” → Jess “**Would you, though?**”.",
          "(12) **C** — “the real strength… is depth… in their own words”. Bẫy D: Liam lo “the expense” → Orla: phòng được dùng “for nothing”.",
          "(13) **E** — “we'd need permission from the ethics committee, and they only meet once a term. We'd miss the deadline.”",
        ],
      },

      /* ───────────── 5. Đọc ───────────── */
      { t: "h", text: "Phần 5 — Đọc (4 + 6 + 3 câu · đạt ≥ 9/13 · 20 phút · trượt thì ôn Ngày 1, 3, 5)" },
      { t: "p", text: "Bấm giờ **20 phút**. Câu 1–4: Matching headings (Ngày 3) · câu 5–10: Yes / No / Not Given có bẫy band 7 (Ngày 5) · câu 11–13: mục đích, thái độ, câu dài (Ngày 1)." },
      {
        t: "table",
        caption: "List of Headings (Questions 1–4: chọn tiêu đề cho đoạn B–E)",
        head: ["Số", "Heading"],
        rows: [
          ["**i**", "A misleading statistic about households"],
          ["**ii**", "Practical changes in place of general campaigns"],
          ["**iii**", "Why villages are friendlier than cities"],
          ["**iv**", "Similar levels of loneliness, different patterns of contact"],
          ["**v**", "The groups that really are at risk"],
          ["**vi**", "How technology isolates commuters"],
          ["**vii**", "The history of urban housing since 1970"],
        ],
      },
      {
        t: "passage",
        title: "Do Cities Make Us Lonely?",
        intro: "You should spend about 20 minutes on Questions 1–13, which are based on the reading passage below.",
        paras: [
          { label: "A", text: "It has become a commonplace that the modern city is a lonely place. Newspaper features describe apartment blocks in which neighbours never learn one another's names, and the image of the solitary commuter staring into a phone has come to stand for urban life as a whole. The claim is repeated so often that it is rarely examined. When it is, the evidence turns out to be far less tidy than the headlines suggest." },
          { label: "B", text: "Consider first what the surveys actually show. In a study of 12,000 adults carried out across four countries, the sociologist Renata Okoye found that 23 per cent of city dwellers reported feeling lonely ‘often’, compared with 21 per cent of those living in villages — a gap too small to mean much. What differed sharply was the way people met one another. Rural respondents saw the same few people several times a week; urban respondents saw a much larger number of people, but each of them less often. Okoye's conclusion was that cities do not reduce contact so much as redistribute it." },
          { label: "C", text: "Why, then, does the belief persist? Part of the answer lies in a confusion between being alone and being lonely. In the cities Okoye studied, almost a third of homes are now occupied by one person, roughly double the proportion in 1970, and it is tempting to read this figure as a measure of isolation. Yet living alone is, for many, a choice that earlier generations simply could not afford. Those who make it are frequently among the most socially active people in the surveys, precisely because nobody at home is waiting for them." },
          { label: "D", text: "None of this means that urban loneliness is a myth. It is concentrated, however, in particular sections of the population rather than spread evenly across it. Okoye's data point to two: people who have moved to the city within the previous two years, and the very old, especially those whose mobility is limited. For newcomers the problem usually fades with time. For the elderly it tends to worsen, and here the design of the city matters a great deal. A flat on the ninth floor of a building whose lift is frequently out of order can become a kind of prison." },
          { label: "E", text: "It follows that the usual remedies are aimed at the wrong target. Advertisements urging city residents in general to ‘talk to a neighbour’ are harmless, but they treat as universal a difficulty that is in fact specific. In my view, the money would be far better spent on unglamorous things: benches at intervals along pavements, reliable lifts, bus stops with seats, and ground-floor community rooms that do not require a booking. Such measures will never make an inspiring headline. They would, I suspect, do more for the people who are actually lonely than any number of posters." },
        ],
      },
      {
        t: "quiz",
        id: "t4d6-kt-doc-tieu-de",
        kind: "fill",
        title: "Questions 1–4 — ghi số La Mã (i–vii)",
        items: [
          { q: "(1) Paragraph B ___", answers: ["iv"] },
          { q: "(2) Paragraph C ___", answers: ["i"] },
          { q: "(3) Paragraph D ___", answers: ["v"] },
          { q: "(4) Paragraph E ___", answers: ["ii"] },
        ],
      },
      { t: "p", text: "**Questions 5–10.** Do the following statements agree with the claims of the writer? Choose **YES**, **NO** or **NOT GIVEN**." },
      {
        t: "mcq",
        id: "t4d6-kt-doc-ynng",
        title: "Questions 5–10 — Yes / No / Not Given",
        items: [
          { q: "5. Newspaper articles about urban loneliness have become more frequent in recent years.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn A nói báo chí hay mô tả và ý này “is repeated so often”, nhưng không so tần suất nay với trước ⇒ NOT GIVEN (so sánh ngầm với quá khứ)." },
          { q: "6. In Okoye's study, loneliness was far more common among city dwellers than among villagers.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn B: 23% so với 21% — “a gap too small to mean much” ⇒ NO. Bẫy mức độ: có chênh, nhưng không “far more”." },
          { q: "7. City residents met more people than rural residents did, but saw each of them less frequently.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn B: “urban respondents saw a much larger number of people, but each of them less often” — cả hai vế khớp ⇒ YES." },
          { q: "8. The share of one-person homes in the cities Okoye studied has roughly doubled since 1970 and now exceeds a third.", options: ["YES", "NO", "NOT GIVEN"], correct: 1, why: "Đoạn C: vế 1 đúng (roughly double), vế 2 sai — “**Almost** a third” là chưa tới một phần ba ⇒ NO. Bẫy đúng một nửa + số đổi." },
          { q: "9. People who live alone have higher incomes than people who share their homes.", options: ["YES", "NO", "NOT GIVEN"], correct: 2, why: "Đoạn C chỉ nói sống một mình là lựa chọn mà **các thế hệ trước** không đủ tiền chọn; không so thu nhập của người sống một mình với người sống chung hiện nay ⇒ NOT GIVEN (so sánh ngầm)." },
          { q: "10. The loneliness felt by people who have recently moved to a city is generally temporary.", options: ["YES", "NO", "NOT GIVEN"], correct: 0, why: "Đoạn D: “For newcomers the problem usually fades with time.” usually → generally; fades with time → temporary ⇒ YES." },
        ],
      },
      { t: "p", text: "**Questions 11–13.** Choose the correct letter, **A**, **B**, **C** or **D**." },
      {
        t: "mcq",
        id: "t4d6-kt-doc-mcq",
        title: "Questions 11–13",
        items: [
          { q: "11. The writer mentions a flat on the ninth floor in order to", options: ["A argue that tall residential buildings should no longer be built.", "B illustrate how the physical design of a city can isolate old people.", "C criticise the cost of housing in large cities.", "D explain why newcomers find it hard to make friends."], correct: 1, why: "Đoạn D: “here the design of the city matters a great deal” rồi đưa ví dụ căn hộ tầng chín có thang máy hay hỏng ⇒ minh hoạ cho người già hạn chế đi lại." },
          { q: "12. What is the writer's view of campaigns that encourage people to talk to their neighbours?", options: ["A They do more harm than good.", "B They are the most effective remedy available.", "C They cost far too much.", "D They do no harm but are directed at the wrong people."], correct: 3, why: "Đoạn E: “harmless, but they treat as universal a difficulty that is in fact specific” ⇒ vô hại nhưng nhắm sai đối tượng." },
          { q: "13. In the sentence “A flat on the ninth floor of a building whose lift is frequently out of order can become a kind of prison”, the subject noun and the main verb are", options: ["A flat … can become", "B lift … is", "C building … can become", "D floor … is"], correct: 0, why: "Danh từ chính: **A flat**; phần “on the ninth floor of a building whose lift is frequently out of order” là bổ nghĩa sau; động từ chính: **can become** (Ngày 1 — tìm danh từ chính + động từ chính)." },
        ],
      },
      {
        t: "note",
        title: "📌 Giải thích Questions 1–4 (headings)",
        items: [
          "(1) B → **iv**: 23% so với 21% (mức cô đơn gần như nhau) + “What differed sharply was the way people met one another”. Bẫy iii: bài không nói làng thân thiện hơn.",
          "(2) C → **i**: con số “almost a third of homes… one person” dễ bị đọc nhầm là thước đo cô lập. Bẫy vii: có năm 1970 nhưng đoạn không kể lịch sử nhà ở.",
          "(3) D → **v**: “concentrated… in particular sections of the population” — người mới tới và người rất già.",
          "(4) E → **ii**: bác chiến dịch chung chung, đề xuất ghế, thang máy, phòng cộng đồng. Bẫy vi: điện thoại chỉ là một hình ảnh ở đoạn A.",
        ],
      },

      /* ───────────── 6. Viết ───────────── */
      { t: "h", text: "Phần 6 — Viết (6 câu + Task 1 + Task 2 · trượt thì ôn Ngày 2, 4, 6)" },
      {
        t: "mcq",
        id: "t4d6-kt-viet-chon",
        title: "6a. Kiến thức viết band 7 (6 câu · đạt ≥ 5/6)",
        items: [
          { q: "1. Ở tiêu chí Task Response, band 7 hơn band 6 chủ yếu ở chỗ nào?", options: ["Bài dài hơn 300 từ.", "Ý chính được mở rộng và chống đỡ, lập trường rõ suốt bài.", "Dùng nhiều từ nối đầu câu hơn.", "Có nhiều ví dụ số liệu hơn."], correct: 1, why: "Band 6: ý chính rõ nhưng có ý chưa phát triển đủ. Band 7: ý chính được **mở rộng và chống đỡ**, lập trường rõ **suốt bài** (Ngày 2, Ngày 4 mục 1)." },
          { q: "2. Thứ tự ba tầng của một thân bài band 7 là", options: ["Ví dụ → Nhận định → Cơ chế", "Nhận định → Ví dụ → Kết luận chung", "Nhận định → Cơ chế (vì sao) → Trường hợp cụ thể", "Cơ chế → Nhận định → Phản đề"], correct: 2, why: "Nhận định → This is because + cơ chế → N, for instance, + trường hợp cụ thể → nối về đề (Ngày 4 mục 3)." },
          { q: "3. Câu phản đề nào đạt mức band 7?", options: ["Granted, online courses are cheaper, but they rarely provide the feedback that keeps learners going.", "Granted, online courses are cheaper.", "Granted, online courses are cheaper, but I still think classrooms are better.", "Some people say online courses are cheaper. However, some people disagree."], correct: 0, why: "Nêu ý ngược rồi **bác ngay bằng một lý do mới** trong cùng câu (Ngày 4 mục 5). B nêu mà không bác; C chỉ lặp lại lập trường; D không có lập trường." },
          { q: "4. Biểu đồ có năm đường. Thân bài nên chia theo", options: ["thứ tự chú giải của biểu đồ", "từng mốc năm", "mỗi đường một khổ", "nhóm xu hướng (tăng / giảm / đi ngang)"], correct: 3, why: "Nhóm đường cùng xu hướng vào một khổ (Ngày 6 mục 3)." },
          { q: "5. Overview band 7 của biểu đồ nhiều đường gồm", options: ["số đầu và số cuối của mọi đường", "xu hướng theo nhóm + một thay đổi thứ hạng, không có số", "ý kiến của người viết về nguyên nhân", "con số lớn nhất và nhỏ nhất"], correct: 1, why: "Ngày 6 mục 4: nhóm + thứ hạng, không số." },
          { q: "6. Câu nào đúng?", options: ["Tea and coffee were fallen to 35 and 65 respectively.", "Tea fell to 35 respectively.", "Tea and coffee stood at 35 and 65 million litres respectively in 2020.", "Tea and coffee stood respectively 35 and 65."], correct: 2, why: "respectively cần hai danh sách cùng thứ tự; fall là nội động từ (~~were fallen~~) (Ngày 6 mục 5)." },
        ],
      },
      { t: "p", text: "**6b — Task 1 (20 phút, ≥ 150 từ).** Năm đường, **bốn** kiểu xu hướng. Dành 3 phút nhóm trước khi viết (Ngày 6 mục 3)." },
      {
        t: "chart",
        kind: "line",
        title: "Sales of five types of drink in one country, 2000–2020",
        unit: "million litres",
        labels: ["2000", "2005", "2010", "2015", "2020"],
        series: [
          { name: "Bottled water", values: [20, 35, 55, 80, 100] },
          { name: "Coffee", values: [40, 45, 50, 58, 65] },
          { name: "Tea", values: [60, 55, 48, 42, 35] },
          { name: "Fizzy drinks", values: [70, 75, 72, 55, 40] },
          { name: "Fruit juice", values: [30, 31, 30, 29, 30] },
        ],
      },
      {
        t: "essay",
        id: "t4d6-kt-viet-task1",
        task: "Task 1",
        prompt: "The line graph shows sales of five types of drink in one country between 2000 and 2020, in millions of litres. (Bottled water: 20 – 35 – 55 – 80 – 100; Coffee: 40 – 45 – 50 – 58 – 65; Tea: 60 – 55 – 48 – 42 – 35; Fizzy drinks: 70 – 75 – 72 – 55 – 40; Fruit juice: 30 – 31 – 30 – 29 – 30; figures for 2000, 2005, 2010, 2015 and 2020.) Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
        minWords: 150,
        tips: [
          "Nhóm: **tăng** (bottled water rất mạnh — gấp năm; coffee vừa phải) · **giảm** (tea đều; fizzy drinks lên đỉnh 2005 rồi giảm mạnh) · **đi ngang** (fruit juice quanh 30).",
          "Overview **không số**: nước đóng chai từ **thấp nhất lên cao nhất**, nước ngọt có ga từ cao nhất xuống thứ ba; nước ép gần như không đổi.",
          "Điểm cắt đáng nêu: bottled water vượt fizzy drinks trong 2010–2015; coffee vượt tea trong 2005–2010.",
          "Ngữ pháp chặng 1: **By 2015, bottled water had overtaken…** (Ngày 3) · **…, reaching 100 million litres** · **with fruit juice remaining at around 30** (Ngày 5).",
          "Tối đa 10 con số; mỗi số có **đơn vị + năm**.",
        ],
      },
      { t: "p", text: "**6c — Task 2 (40 phút, ≥ 250 từ).** Đề Opinion. Trước khi viết: đếm vế, chọn mức độ, lập dàn ý **mỗi thân bài một ý đi qua ba tầng** (Ngày 4)." },
      {
        t: "essay",
        id: "t4d6-kt-viet-task2",
        task: "Task 2",
        prompt: "Some people believe that governments should measure a country's success by the happiness of its citizens rather than by economic growth. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Hai vế: ① đo thành công bằng **hạnh phúc của người dân**; ② **thay cho** (rather than) tăng trưởng kinh tế. Phải bàn cả việc “thay thế”, không chỉ “hạnh phúc có quan trọng không”.",
          "Thesis có **mức độ** và giữ suốt bài. Mỗi thân bài: **nhận định → This is because… → trường hợp cụ thể → nối về đề**.",
          "Đúng **một** phản đề kiểu **Granted, …, but …** — vế bác phải là lý do mới.",
          "Từ Ngày 4: **well-being · life satisfaction · a sense of fulfilment · material possessions**. Từ Ngày 5–6: **an indicator** (Ngày 5) · **conduct a survey · take … into account · strike a balance between · allocate resources to** (Ngày 6). Phản đề: **Granted, …** (Ngày 2 · 4).",
          "Soát cuối: mạo từ trước **N + of** (the happiness of citizens), danh từ không đếm được (research, evidence, progress), chủ ngữ treo.",
        ],
      },

      /* ───────────── 7. Nói ───────────── */
      { t: "h", text: "Phần 7 — Nói (4 câu Part 1 + Part 2 + 3 câu Part 3 · AI ≥ band 6.5 · trượt thì ôn Ngày 2, 3, 6)" },
      { t: "p", text: "**Part 1** (Ngày 2): mỗi câu 2–3 câu (15–20 giây) theo công thức **Thẳng → Chi tiết cụ thể → Nét riêng**, cài một cụm ít gặp đúng nguyên dạng. **Part 2** (Ngày 6): 2 phút, có **câu chuyện nhỏ** bốn nhịp và 2 idiom đúng nguyên dạng. **Part 3** (Ngày 3): mỗi câu 40–60 giây theo khung **xưa → nay → sắp tới**, discourse markers không lặp." },
      {
        t: "speak",
        id: "t4d6-kt-noi-p1",
        part: "1",
        questions: [
          "What do you usually do to relax after a busy day?",
          "Is there anything about your daily routine that you would like to change?",
          "Do you prefer spending your free time alone or with other people?",
          "How important is it for you to spend time outdoors?",
        ],
      },
      {
        t: "speak",
        id: "t4d6-kt-noi-p2",
        part: "2",
        questions: [
          "Describe a person who taught you something useful. You should say: who this person is, how you know him or her, what he or she taught you, and explain why it has been useful to you.",
        ],
      },
      {
        t: "speak",
        id: "t4d6-kt-noi-p3",
        part: "3",
        questions: [
          "How has the way people learn new skills changed since your parents were young?",
          "Do you think older people will have more or less influence on the young in the future?",
          "Compared with the past, are neighbours in your country closer or more distant today?",
        ],
      },

      /* ───────────── 8. Phát âm ───────────── */
      { t: "h", text: "Phần 8 — Phát âm (8 câu · đạt ≥ 6/8 · rồi đọc lại các khối có máy chấm)" },
      {
        t: "mcq",
        id: "t4d6-kt-phat-am",
        title: "8. Chọn đáp án đúng (8 câu)",
        items: [
          { q: "1. (Ngày 1 — nhịp) Trong câu “The number of people working from home has risen sharply”, những từ nào bị lướt (đọc yếu)?", options: ["number, people, home", "the, of, from, has", "working, risen, sharply", "people, has, sharply"], correct: 1, why: "Từ chức năng (mạo từ, giới từ, trợ động từ) đọc yếu: the /ðə/, of /əv/, from /frəm/, has /həz/. Từ mang nghĩa được nhấn." },
          { q: "2. (Ngày 2 — trọng âm câu mang nghĩa) “I asked for a BLACK coffee.” Nhấn BLACK ngụ ý", options: ["tôi không gọi trà.", "người khác gọi, không phải tôi.", "tôi không gọi cà phê sữa.", "tôi gọi hai ly."], correct: 2, why: "Nhấn từ nào thì đối lập nằm ở từ đó: black ↔ white (cà phê sữa)." },
          { q: "3. (Ngày 2) “SHE didn't write the report.” Nhấn SHE ngụ ý", options: ["người khác đã viết báo cáo.", "cô ấy viết thư, không viết báo cáo.", "cô ấy chỉ đọc báo cáo.", "báo cáo chưa được viết."], correct: 0, why: "Nhấn chủ ngữ ⇒ đối lập ở người làm: không phải cô ấy mà là người khác." },
          { q: "4. (Ngày 3 — /ɜː/) Từ nào KHÔNG có âm /ɜː/?", options: ["early", "journey", "prefer", "heart"], correct: 3, why: "heart /hɑːt/. early /ˈɜːli/, journey /ˈdʒɜːni/, prefer /prɪˈfɜː/ đều có /ɜː/." },
          { q: "5. (Ngày 3 — /ɜː/ và /ə/) Trong từ “further”, hai âm tiết lần lượt là", options: ["/ə/ rồi /ɜː/", "/ɜː/ rồi /ə/", "/ɜː/ rồi /ɜː/", "/ʊ/ rồi /ə/"], correct: 1, why: "further /ˈfɜːðə/: âm tiết có trọng âm là /ɜː/ (dài), âm tiết sau là /ə/ (lướt)." },
          { q: "6. (Ngày 5 — nuốt /t/ /d/) Cụm nào có /t/ bị nuốt khi nói nhanh?", options: ["last of all", "last hour", "last month", "last April"], correct: 2, why: "las(t) month: /t/ kẹp giữa /s/ và /m/. Ba cụm kia sau /t/ là nguyên âm ⇒ nối." },
          { q: "7. (Ngày 5) “grandparents” khi nói tự nhiên thường nghe là", options: ["/ɡrænpeərənts/", "/ɡrændəpeərənts/", "/ɡrɑːndpɑːrənts/", "/ɡrænpærent/"], correct: 0, why: "/d/ kẹp giữa /n/ và /p/ ⇒ rơi." },
          { q: "8. (Ngày 6 — ngữ điệu kể chuyện) “I was sitting on the steps, when he walked past.” Giọng nên", options: ["hạ ở steps, hạ ở past", "treo ở steps, treo ở past", "hạ ở steps, treo ở past", "treo ở steps, hạ ở past"], correct: 3, why: "Câu nền ⇒ treo (báo còn nữa); sự việc chính ⇒ hạ." },
        ],
      },
      { t: "p", text: "Làm xong 8 câu, mở lại và **đọc + chấm** sáu khối phát âm của chặng: Ngày 1 (nhịp câu dài) · Ngày 2 (trọng âm câu) · Ngày 3 (/ɜː/ – /ə/) · Ngày 4 (từ khó chủ đề tâm lý) · Ngày 5 (nuốt /t/ /d/) · Ngày 6 (ngữ điệu kể chuyện). Khối nào dưới 80 điểm thì tập lại 3 lượt." },

      /* ───────────── Kết ───────────── */
      { t: "h", text: "Xong bài kiểm tra — bước tiếp theo" },
      {
        t: "table",
        head: ["Phần", "Ngưỡng đạt", "Hụt thì ôn"],
        rows: [
          ["1. Ngữ pháp", "≥ 17/24", "câu 1–5 → **Ngày 1** · câu 6–10 → **Ngày 3** · câu 11–15 → **Ngày 5**"],
          ["2. Từ vựng", "≥ 13/18", "AWL 7 + Environment → **Ngày 2** · tâm lý → **Ngày 4** · collocation → **Ngày 6**"],
          ["3. Dịch", "≥ 5/6", "theo ghi chú từng câu (Ngày 1, 3, 5, 6)"],
          ["4. Nghe", "≥ 10/14", "Recording 1 → **Ngày 1** · Recording 2 → **Ngày 4** · Recording 3 → **Ngày 5**"],
          ["5. Đọc", "≥ 9/13", "headings → **Ngày 3** · Y/N/NG → **Ngày 5** · câu 11–13 → **Ngày 1**"],
          ["6. Viết", "6a ≥ 5/6 · AI Task 1 và Task 2 ≥ 6.5 (ước tính)", "Task 1 → **Ngày 6** · Task 2 → **Ngày 4** (ba tầng) và **Ngày 2**"],
          ["7. Nói", "AI ≥ 6.5 (ước tính)", "Part 1 → **Ngày 2** · Part 2 → **Ngày 6** · Part 3 → **Ngày 3**"],
          ["8. Phát âm", "≥ 6/8", "theo ghi chú đầu mỗi câu"],
        ],
        caption: "Ngưỡng 70 % từng phần. Một phần hụt không kéo cả bài — chỉ ôn đúng Ngày đó rồi làm lại riêng phần ấy sau 2 ngày.",
      },
      {
        t: "note",
        title: "💡 Cách học tiếp sau bài kiểm tra",
        items: [
          "Chép **mọi câu sai** vào sổ lỗi theo ba cột: câu sai · câu đúng · luật (ghi Ngày và mục).",
          "Với Viết: so bài Task 1 của bạn với **bảng tự soát 2 phút** (Ngày 6 mục 9); so bài Task 2 với **ba tầng** (Ngày 4 mục 3) — tô ba màu cho ba tầng xem đoạn nào thiếu tầng nào.",
          "Với Nói: nghe lại bản ghi Part 2 và đánh dấu bốn nhịp của câu chuyện. Thiếu nhịp nào thì ghi lại lần nữa.",
          "Đạt cả 8 phần ⇒ sang **Ngày 7** (cleft sentences + đảo ngữ · Multiple choice Passage 3 · Part 3 dự đoán tương lai).",
        ],
      },
    ],
  },
];
