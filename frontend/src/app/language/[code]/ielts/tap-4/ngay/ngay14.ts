/**
 * IELTS Tập 4 — Ngày 14 (band 6.0 → 7.0; tự soạn 18/11/2026 — mọi câu ví dụ, bài mẫu, đề, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     AWL sublist 9 (đủ 60 họ từ) + Volunteering vòng 2 (20) + Money vòng 2 (22)          [VB9 VC04 VC14]
 *                     — nối Tập 1 Ngày 9 (Tình nguyện vòng 1), Tập 2 Ngày 16 (Money vòng 1), Tập 4 Ngày 8 (AWL sublist 8)
 *   Bài 2 (writing)   Task 2 Advantages / disadvantages band 7 — phán quyết “outweigh” RÕ: 5 thước đo để cân, thesis có
 *                     thước đo, đoạn “thừa nhận rồi cân”, bài mẫu band 6 vs band 7                               [W05]
 *                     — nối Tập 2 Ngày 10 (3 cách hỏi), Tập 3 Ngày 14 (outweigh · positive / negative · 3 lập trường),
 *                       Tập 4 Ngày 10 (động tác đánh giá), Ngày 13 (rào đón, this + danh từ tóm tắt)
 *   Bài 3 (speaking)  Part 2 Describe an event band 7 (khung 5 chặng, một khoảnh khắc, nhìn lại) + Part 3 nối tiếp  [S05 S06]
 *                     — nối Tập 2 Ngày 15 (event vòng 1), Tập 3 Ngày 22 (4 thì kể chuyện) · 🔊 ngữ điệu liệt kê
 *   Bài tập Ngày 14   54 câu có đáp án + 1 đoạn viết
 * Mọi id bắt đầu `t4d14-`.
 */
import type { Lesson } from '../data';

export const NGAY_14: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t4d14-tu-vung",
    kind: "vocab",
    title: "Từ vựng: AWL sublist 9 + Tình nguyện vòng 2 + Tiền bạc & tiêu dùng vòng 2",
    goal: "Nhận ra và dùng đúng 60 họ từ học thuật của AWL sublist 9 (kèm giới từ, họ từ, cặp dễ nhầm như assure / ensure, device / devise, found / find), 20 từ về tình nguyện và khu vực phi lợi nhuận (altruism, grassroots, outreach, beneficiary, social cohesion…) và 22 từ về tiền bạc – tiêu dùng (disposable income, purchasing power, conspicuous consumption, live beyond your means…) — đủ vốn cho bài Viết ưu – nhược và bài Nói về sự kiện hôm nay.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "**AWL** (Academic Word List) = 570 họ từ học thuật, 10 sublist. Tập 4 đã học sublist 7 (Ngày 2) và 8 (Ngày 8). Hôm nay ==sublist 9 — đủ 60 họ từ==, chia 3 nhóm 20. Còn sublist 10 ở Ngày 20.",
          "**Volunteering vòng 2**: Tập 1 Ngày 9 học từ nền (volunteer, charity, donate, raise money). Hôm nay lên tầng **xã hội**: động cơ (altruism), tổ chức (non-profit, the voluntary sector), tác động (social cohesion, beneficiary) — nhóm từ của đề “Should community service be compulsory?”.",
          "**Money vòng 2**: Tập 2 Ngày 16 học mua sắm (bargain, refund, afford). Hôm nay học **kinh tế hộ gia đình và chủ nghĩa tiêu dùng**: disposable income, inflation, conspicuous consumption, run up debts — bài Viết hôm nay (xã hội không tiền mặt) dùng ngay.",
          "Band 7 LR đòi “ý thức về **collocation** và **văn phong**”: mỗi từ dưới đây có dòng mở rộng ghi ==đi với giới từ nào, danh từ nào==. Học cả cụm, không học từ lẻ.",
          "Mọi từ trong bài tự vào **Flashcards** và mục **Tra từ vựng**. Dùng nút “Che nghĩa / Che từ” để tự kiểm sau mỗi nhóm.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. AWL sublist 9 — họ từ 1–20 (accommodate → distort)" },
      {
        t: "p",
        text: "Mỗi dòng là **một họ từ**: từ gốc + các dạng khác ở dòng mở rộng. Đọc câu ví dụ thành tiếng một lần. Sublist 9 có nhiều từ **trang trọng thay cho từ thường**: commence = begin, cease = stop, attain = reach, diminish = decrease — dùng trong Writing, hạn chế trong Speaking.",
      },
      {
        t: "vocab",
        items: [
          { w: "accommodate", pos: "v", ipa: "/əˈkɒmədeɪt/", vi: "đáp ứng; chứa được; điều chỉnh cho hợp", ex: "The new timetable was designed to accommodate part-time students.", exVi: "Thời khoá biểu mới được thiết kế để đáp ứng sinh viên học bán thời gian.", more: "**accommodate** the needs of · accommodation (n — không đếm được trong tiếng Anh-Anh) · chính tả: hai **c**, hai **m**" },
          { w: "analogy", pos: "n", ipa: "/əˈnælədʒi/", vi: "phép so sánh tương đồng", ex: "The author draws an analogy between the brain and a computer.", exVi: "Tác giả so sánh bộ não với máy tính.", more: "**draw an analogy between** A **and** B · by analogy with · analogous (adj) **to**" },
          { w: "anticipate", pos: "v", ipa: "/ænˈtɪsɪpeɪt/", vi: "lường trước, dự kiến", ex: "The council did not anticipate such strong opposition.", exVi: "Hội đồng đã không lường trước sự phản đối mạnh như vậy.", more: "anticipate + N / V-ing / that… (⚠️ không ~~anticipate to V~~) · anticipation (n) · higher **than anticipated**" },
          { w: "assure", pos: "v", ipa: "/əˈʃɔː/", vi: "cam đoan, bảo đảm với ai", ex: "The minister assured the public that the water was safe.", exVi: "Bộ trưởng cam đoan với người dân rằng nước an toàn.", more: "**assure sb that**… · ≠ **ensure** (bảo đảm việc gì xảy ra) ≠ **insure** (mua bảo hiểm) · assurance (n): quality assurance" },
          { w: "attain", pos: "v", ipa: "/əˈteɪn/", vi: "đạt được (sau nỗ lực)", ex: "Few applicants attain the required standard.", exVi: "Ít ứng viên đạt được chuẩn yêu cầu.", more: "**attain** a goal / a level / a degree · attainment (n): educational attainment · attainable (adj)" },
          { w: "behalf", pos: "n", ipa: "/bɪˈhɑːf/", vi: "(on behalf of) thay mặt", ex: "She accepted the award on behalf of the whole team.", exVi: "Cô ấy nhận giải thay mặt cả nhóm.", more: "**on behalf of** sb / **on** sb's **behalf** · ⚠️ không ~~in behalf of~~" },
          { w: "bulk", pos: "n", ipa: "/bʌlk/", vi: "phần lớn; số lượng lớn", ex: "The bulk of the funding comes from private donors.", exVi: "Phần lớn kinh phí đến từ các nhà tài trợ tư nhân.", more: "**the bulk of** + N · buy **in bulk** (mua sỉ) · bulky (adj — cồng kềnh)" },
          { w: "cease", pos: "v", ipa: "/siːs/", vi: "ngừng, chấm dứt (trang trọng)", ex: "The factory ceased production in 2019.", exVi: "Nhà máy ngừng sản xuất năm 2019.", more: "cease + N / to V / V-ing · **cease to exist** · ceaseless (adj) · a ceasefire (lệnh ngừng bắn)" },
          { w: "coherent", pos: "adj", ipa: "/kəʊˈhɪərənt/", vi: "mạch lạc, chặt chẽ", ex: "The essay lacks a coherent argument.", exVi: "Bài luận thiếu một lập luận mạch lạc.", more: "coherence (n — chính là chữ C trong tiêu chí CC) · incoherent (adj) · a **coherent** strategy / policy" },
          { w: "coincide", pos: "v", ipa: "/ˌkəʊɪnˈsaɪd/", vi: "trùng (thời gian); trùng khớp", ex: "The festival coincides with the school holidays.", exVi: "Lễ hội trùng với kỳ nghỉ của học sinh.", more: "**coincide with** · coincidence (n): by coincidence · coincidental (adj)" },
          { w: "commence", pos: "v", ipa: "/kəˈmens/", vi: "bắt đầu (trang trọng)", ex: "Construction is due to commence next spring.", exVi: "Việc xây dựng dự kiến bắt đầu mùa xuân tới.", more: "commence + N / V-ing · commencement (n) · văn nói dùng begin / start" },
          { w: "compatible", pos: "adj", ipa: "/kəmˈpætəbl/", vi: "tương thích; đi cùng nhau được", ex: "Economic growth is not always compatible with environmental protection.", exVi: "Tăng trưởng kinh tế không phải lúc nào cũng đi cùng được với bảo vệ môi trường.", more: "**compatible with** · incompatible (adj) · compatibility (n)" },
          { w: "concurrent", pos: "adj", ipa: "/kənˈkʌrənt/", vi: "đồng thời, diễn ra cùng lúc", ex: "The two studies were concurrent but entirely independent.", exVi: "Hai nghiên cứu diễn ra đồng thời nhưng hoàn toàn độc lập.", more: "concurrent **with** · concurrently (adv — dùng nhiều hơn): The two courses **run concurrently**." },
          { w: "confine", pos: "v", ipa: "/kənˈfaɪn/", vi: "giới hạn trong; giam giữ", ex: "The problem is not confined to large cities.", exVi: "Vấn đề không chỉ giới hạn ở các thành phố lớn.", more: "**be confined to** · confine yourself to + N · a confined space · confinement (n)" },
          { w: "controversy", pos: "n", ipa: "/ˈkɒntrəvɜːsi/", vi: "sự tranh cãi (kéo dài, công khai)", ex: "The decision caused considerable controversy.", exVi: "Quyết định đó gây tranh cãi lớn.", more: "cause / spark / arouse **controversy** · controversy **over / about** · controversial (adj) · cũng đọc /kənˈtrɒvəsi/" },
          { w: "converse", pos: "n / adj", ipa: "/ˈkɒnvɜːs/", vi: "điều ngược lại", ex: "Rich countries consume more than they produce; the converse is true of many poor ones.", exVi: "Nước giàu tiêu nhiều hơn làm ra; ở nhiều nước nghèo thì ngược lại.", more: "**the converse is (also) true** · **conversely** (adv — từ nối band 7: ngược lại) · ≠ converse (v) /kənˈvɜːs/ trò chuyện" },
          { w: "device", pos: "n", ipa: "/dɪˈvaɪs/", vi: "thiết bị; thủ pháp", ex: "Mobile devices now account for most internet traffic.", exVi: "Thiết bị di động hiện chiếm phần lớn lưu lượng internet.", more: "a labour-saving **device** · cohesive devices (phương tiện liên kết) · ≠ **devise** (v) /dɪˈvaɪz/ nghĩ ra" },
          { w: "devote", pos: "v", ipa: "/dɪˈvəʊt/", vi: "dành (thời gian, công sức, tiền)", ex: "She devotes two evenings a week to teaching refugees.", exVi: "Cô ấy dành hai buổi tối mỗi tuần để dạy người tị nạn.", more: "**devote** time / effort / resources **to + N / V-ing** (⚠️ to là giới từ) · devoted (adj) · devotion (n)" },
          { w: "diminish", pos: "v", ipa: "/dɪˈmɪnɪʃ/", vi: "giảm bớt, suy giảm", ex: "The influence of printed newspapers has diminished.", exVi: "Ảnh hưởng của báo in đã suy giảm.", more: "**diminishing returns** (lợi suất giảm dần) · diminish **in** importance / value · gần nghĩa: decline, dwindle" },
          { w: "distort", pos: "v", ipa: "/dɪˈstɔːt/", vi: "bóp méo, làm sai lệch", ex: "Advertising can distort children's view of what is normal.", exVi: "Quảng cáo có thể làm méo cách trẻ nhìn nhận điều gì là bình thường.", more: "**distort** the truth / the facts / the market · distortion (n) · a distorted picture" },
        ],
      },
      {
        t: "quiz",
        id: "t4d14-awl-1",
        kind: "fill",
        title: "Điền dạng đúng của từ trong nhóm 1 (8 câu)",
        items: [
          { q: "1. Lectures will c___ on 4 September. (bắt đầu — trang trọng)", answers: ["commence"], hint: "will + V nguyên mẫu" },
          { q: "2. The b___ of first-year students live on campus. (phần lớn)", answers: ["bulk"], hint: "the ___ of" },
          { q: "3. I am writing on b___ of my colleagues in the finance department.", answers: ["behalf"], hint: "on ___ of" },
          { q: "4. A good essay presents a clear and c___ argument. (mạch lạc)", answers: ["coherent"], hint: "tính từ" },
          { q: "5. Small charities d___ a surprising share of their budget to administration. (dành)", answers: ["devote"], hint: "___ … to" },
          { q: "6. The new app is not c___ with older phones. (tương thích)", answers: ["compatible"], hint: "___ with" },
          { q: "7. Demand for tickets was far higher than a___ . (dự kiến — V3)", answers: ["anticipated"], hint: "than + V3" },
          { q: "8. Sensational headlines d___ the public's understanding of crime. (bóp méo)", answers: ["distort"], hint: "headlines (số nhiều) + V" },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. AWL sublist 9 — họ từ 21–40 (duration → portion)" },
      {
        t: "vocab",
        items: [
          { w: "duration", pos: "n", ipa: "/djuˈreɪʃn/", vi: "khoảng thời gian kéo dài", ex: "Volunteers must commit for the duration of the project.", exVi: "Tình nguyện viên phải cam kết trong suốt thời gian dự án.", more: "**for the duration of** · of short / long duration · durable (adj — bền)" },
          { w: "erode", pos: "v", ipa: "/ɪˈrəʊd/", vi: "xói mòn (đất; niềm tin, giá trị)", ex: "Repeated scandals have eroded public trust in charities.", exVi: "Những vụ bê bối liên tiếp đã làm xói mòn niềm tin của công chúng vào các tổ chức từ thiện.", more: "**erode** trust / confidence / purchasing power · erosion (n): coastal erosion" },
          { w: "ethic", pos: "n", ipa: "/ˈeθɪk/", vi: "chuẩn mực đạo đức", ex: "The firm is known for its strong work ethic.", exVi: "Công ty nổi tiếng về tinh thần làm việc nghiêm túc.", more: "a strong **work ethic** · ethics (n, số nhiều — đạo đức nghề): business / medical ethics · ethical ≠ unethical" },
          { w: "format", pos: "n / v", ipa: "/ˈfɔːmæt/", vi: "định dạng, hình thức", ex: "The speaking test follows the same format every time.", exVi: "Bài thi nói luôn theo cùng một hình thức.", more: "in a digital / printed **format** · the format of the exam" },
          { w: "found", pos: "v", ipa: "/faʊnd/", vi: "thành lập", ex: "The charity was founded in 1985 by a group of teachers.", exVi: "Tổ chức từ thiện được một nhóm giáo viên thành lập năm 1985.", more: "found – **founded** – founded (≠ find – found – found) · founder (n) · foundation (n) · well-founded ≠ unfounded (fears)" },
          { w: "inherent", pos: "adj", ipa: "/ɪnˈhɪərənt/", vi: "vốn có, cố hữu", ex: "There are risks inherent in any form of borrowing.", exVi: "Mọi hình thức vay mượn đều có rủi ro cố hữu.", more: "**inherent in** · inherently (adv): inherently unfair / risky" },
          { w: "insight", pos: "n", ipa: "/ˈɪnsaɪt/", vi: "sự hiểu sâu, cái nhìn thấu", ex: "The interviews offer valuable insights into how families budget.", exVi: "Các cuộc phỏng vấn cho thấy rõ các gia đình tính toán chi tiêu thế nào.", more: "gain / offer / provide **insight into** (⚠️ không ~~about~~) · insightful (adj)" },
          { w: "integral", pos: "adj", ipa: "/ˈɪntɪɡrəl/", vi: "không thể thiếu, gắn liền", ex: "Volunteers are an integral part of the health service.", exVi: "Tình nguyện viên là một phần không thể thiếu của ngành y tế.", more: "**an integral part of** · integral **to** + N" },
          { w: "intermediate", pos: "adj", ipa: "/ˌɪntəˈmiːdiət/", vi: "trung cấp; trung gian", ex: "The course is aimed at intermediate learners.", exVi: "Khoá học dành cho người học trình độ trung cấp.", more: "an **intermediate** level / stage · intermediary (n — người trung gian)" },
          { w: "manual", pos: "adj / n", ipa: "/ˈmænjuəl/", vi: "bằng tay, chân tay; sổ hướng dẫn", ex: "Many manual jobs have been replaced by machines.", exVi: "Nhiều việc chân tay đã bị máy móc thay thế.", more: "**manual** labour / work / workers · manually (adv) · an instruction manual" },
          { w: "mature", pos: "adj / v", ipa: "/məˈtʃʊə/", vi: "trưởng thành, chín chắn", ex: "Voluntary work can help teenagers become more mature.", exVi: "Việc tình nguyện có thể giúp thiếu niên chín chắn hơn.", more: "maturity (n) · immature (adj) · a mature student (sinh viên lớn tuổi) · a mature market" },
          { w: "mediate", pos: "v", ipa: "/ˈmiːdieɪt/", vi: "hoà giải, làm trung gian", ex: "A neighbour offered to mediate between the two families.", exVi: "Một người hàng xóm đề nghị đứng ra hoà giải giữa hai gia đình.", more: "**mediate between** A and B · mediate **in** a dispute · mediation (n) · mediator (n)" },
          { w: "medium", pos: "n / adj", ipa: "/ˈmiːdiəm/", vi: "phương tiện (truyền đạt); vừa, trung bình", ex: "Television remains a powerful medium for advertising.", exVi: "Truyền hình vẫn là một phương tiện quảng cáo mạnh.", more: "số nhiều: **media** · the medium of instruction · medium-sized firms · in the medium term" },
          { w: "military", pos: "adj / n", ipa: "/ˈmɪlətri/", vi: "quân sự; quân đội", ex: "Some countries require a year of military or community service.", exVi: "Một số nước yêu cầu một năm nghĩa vụ quân sự hoặc lao động công ích.", more: "**military** service / spending · the military (n)" },
          { w: "minimal", pos: "adj", ipa: "/ˈmɪnɪml/", vi: "tối thiểu, rất nhỏ", ex: "The scheme was introduced at minimal cost.", exVi: "Chương trình được triển khai với chi phí rất nhỏ.", more: "**minimal** impact / effort / risk · minimise (v) · minimum (n / adj)" },
          { w: "mutual", pos: "adj", ipa: "/ˈmjuːtʃuəl/", vi: "lẫn nhau; chung", ex: "Good partnerships are built on mutual trust.", exVi: "Quan hệ đối tác tốt được xây trên sự tin tưởng lẫn nhau.", more: "**mutual** respect / benefit / understanding · mutually beneficial" },
          { w: "norm", pos: "n", ipa: "/nɔːm/", vi: "chuẩn mực; điều bình thường", ex: "Paying by phone has become the norm in many cities.", exVi: "Thanh toán bằng điện thoại đã thành chuyện bình thường ở nhiều thành phố.", more: "**become the norm** · social / cultural **norms** · normalise (v)" },
          { w: "overlap", pos: "v / n", ipa: "/ˌəʊvəˈlæp/", vi: "chồng lấn, trùng nhau", ex: "The work of the two charities overlaps considerably.", exVi: "Hoạt động của hai tổ chức từ thiện chồng lấn khá nhiều.", more: "overlap **with** · danh từ đọc /ˈəʊvəlæp/: an overlap **between** A and B" },
          { w: "passive", pos: "adj", ipa: "/ˈpæsɪv/", vi: "thụ động", ex: "Scrolling through social media is a largely passive activity.", exVi: "Lướt mạng xã hội phần lớn là một hoạt động thụ động.", more: "**passive** income / consumers / smoking · passively (adv) · ≠ active" },
          { w: "portion", pos: "n", ipa: "/ˈpɔːʃn/", vi: "phần; khẩu phần", ex: "A significant portion of household income goes on rent.", exVi: "Một phần đáng kể thu nhập hộ gia đình dành cho tiền thuê nhà.", more: "a large / significant / small **portion of** · portion size" },
        ],
      },
      {
        t: "quiz",
        id: "t4d14-awl-2",
        kind: "fill",
        title: "Điền dạng đúng của từ trong nhóm 2 (8 câu)",
        items: [
          { q: "1. The food bank was f___ by two retired nurses in 1998. (thành lập — V3)", answers: ["founded"], hint: "found – founded – founded" },
          { q: "2. A degree of risk is i___ in any new business. (cố hữu)", answers: ["inherent"], hint: "___ in" },
          { q: "3. The diaries gave researchers real i___ into how low-income families cope. (hiểu sâu)", answers: ["insight", "insights"], hint: "___ into" },
          { q: "4. The two neighbours had a m___ dislike of each other. (lẫn nhau)", answers: ["mutual"], hint: "tính từ" },
          { q: "5. Coastal e___ threatens hundreds of homes. (danh từ của erode)", answers: ["erosion"], hint: "erode → danh từ" },
          { q: "6. In many offices, flexible hours have become the n___ . (điều bình thường)", answers: ["norm"], hint: "become the ___" },
          { q: "7. Music and dancing are an i___ part of the celebration. (không thể thiếu)", answers: ["integral"], hint: "an ___ part of" },
          { q: "8. The tax change had only a m___ effect on prices. (rất nhỏ)", answers: ["minimal"], hint: "tính từ" },
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. AWL sublist 9 — họ từ 41–60 (preliminary → vision)" },
      {
        t: "vocab",
        items: [
          { w: "preliminary", pos: "adj", ipa: "/prɪˈlɪmɪnəri/", vi: "sơ bộ, bước đầu", ex: "Preliminary results suggest that the scheme is working.", exVi: "Kết quả sơ bộ cho thấy chương trình đang có hiệu quả.", more: "**preliminary** findings / results / talks / stage" },
          { w: "protocol", pos: "n", ipa: "/ˈprəʊtəkɒl/", vi: "quy trình chuẩn; nghi thức", ex: "Staff must follow strict safety protocols.", exVi: "Nhân viên phải theo quy trình an toàn nghiêm ngặt.", more: "follow / breach **protocol** · a research protocol" },
          { w: "qualitative", pos: "adj", ipa: "/ˈkwɒlɪtətɪv/", vi: "định tính", ex: "The team collected qualitative data through long interviews.", exVi: "Nhóm thu dữ liệu định tính qua các cuộc phỏng vấn dài.", more: "≠ **quantitative** (định lượng) · qualitative research / analysis" },
          { w: "refine", pos: "v", ipa: "/rɪˈfaɪn/", vi: "tinh chỉnh; tinh luyện", ex: "The method has been refined over many years.", exVi: "Phương pháp đã được tinh chỉnh qua nhiều năm.", more: "**refine** a method / a model / a search · refinement (n) · refined sugar · an oil refinery" },
          { w: "relax", pos: "v", ipa: "/rɪˈlæks/", vi: "nới lỏng (quy định); thư giãn", ex: "The government has relaxed the rules on Sunday trading.", exVi: "Chính phủ đã nới lỏng quy định về buôn bán ngày Chủ nhật.", more: "nghĩa học thuật: **relax** rules / restrictions / controls · relaxation (n)" },
          { w: "restrain", pos: "v", ipa: "/rɪˈstreɪn/", vi: "kiềm chế, kìm lại", ex: "Higher interest rates are intended to restrain consumer spending.", exVi: "Lãi suất cao hơn nhằm kìm chi tiêu của người tiêu dùng.", more: "restrain sb **from** V-ing · restraint (n): show restraint · wage restraint" },
          { w: "revolution", pos: "n", ipa: "/ˌrevəˈluːʃn/", vi: "cuộc cách mạng", ex: "The digital revolution has transformed the way people shop.", exVi: "Cách mạng số đã thay đổi hẳn cách người ta mua sắm.", more: "revolutionary (adj) · revolutionise (v) · the Industrial Revolution" },
          { w: "rigid", pos: "adj", ipa: "/ˈrɪdʒɪd/", vi: "cứng nhắc", ex: "Rigid working hours make it hard for parents to volunteer.", exVi: "Giờ làm cứng nhắc khiến cha mẹ khó tham gia tình nguyện.", more: "**rigid** rules / structure / hierarchy · rigidity (n) · ≠ flexible" },
          { w: "route", pos: "n", ipa: "/ruːt/", vi: "tuyến đường; con đường (dẫn tới)", ex: "Education is often seen as a route out of poverty.", exVi: "Giáo dục thường được coi là con đường thoát nghèo.", more: "a **route to** success / **out of** poverty · en route (trên đường đi)" },
          { w: "scenario", pos: "n", ipa: "/səˈnɑːriəʊ/", vi: "kịch bản, tình huống giả định", ex: "In the worst-case scenario, the shelter would have to close.", exVi: "Trong kịch bản xấu nhất, nhà tạm lánh sẽ phải đóng cửa.", more: "the worst-case / best-case / most likely **scenario** · số nhiều: scenarios" },
          { w: "sphere", pos: "n", ipa: "/sfɪə/", vi: "lĩnh vực, phạm vi; hình cầu", ex: "Women remain under-represented in the political sphere.", exVi: "Phụ nữ vẫn có ít đại diện trong lĩnh vực chính trị.", more: "the public / private **sphere** · sphere of influence" },
          { w: "subordinate", pos: "adj / n", ipa: "/səˈbɔːdɪnət/", vi: "thứ yếu, phụ thuộc; cấp dưới", ex: "In a crisis, personal interests should be subordinate to those of the group.", exVi: "Trong khủng hoảng, lợi ích cá nhân nên xếp sau lợi ích tập thể.", more: "**subordinate to** · a subordinate clause (mệnh đề phụ) · động từ đọc /səˈbɔːdɪneɪt/" },
          { w: "supplement", pos: "v / n", ipa: "/ˈsʌplɪment/", vi: "bổ sung; phần bổ sung", ex: "Many students supplement their income with part-time work.", exVi: "Nhiều sinh viên kiếm thêm thu nhập bằng việc làm thêm.", more: "**supplement** A **with** B · a supplement **to** · supplementary (adj) · danh từ đọc /ˈsʌplɪmənt/" },
          { w: "suspend", pos: "v", ipa: "/səˈspend/", vi: "đình chỉ, tạm ngừng", ex: "Train services were suspended because of the storm.", exVi: "Dịch vụ tàu bị tạm ngừng vì bão.", more: "**suspend** a service / payments / a student · suspension (n)" },
          { w: "team", pos: "n / v", ipa: "/tiːm/", vi: "đội, nhóm", ex: "A team of volunteers cleans the beach every month.", exVi: "Một nhóm tình nguyện viên dọn bãi biển hằng tháng.", more: "**team up with** · teamwork · team spirit · a team **of** + N số nhiều" },
          { w: "temporary", pos: "adj", ipa: "/ˈtemprəri/", vi: "tạm thời", ex: "The shelter offers temporary accommodation for homeless people.", exVi: "Nhà tạm lánh cung cấp chỗ ở tạm thời cho người vô gia cư.", more: "a **temporary** measure / job / solution · temporarily (adv) · ≠ permanent" },
          { w: "trigger", pos: "v / n", ipa: "/ˈtrɪɡə/", vi: "gây ra, châm ngòi", ex: "The price rise triggered a wave of protests.", exVi: "Đợt tăng giá châm ngòi cho một làn sóng phản đối.", more: "**trigger** a crisis / a debate / a reaction · a trigger **for** (n)" },
          { w: "unify", pos: "v", ipa: "/ˈjuːnɪfaɪ/", vi: "thống nhất, gắn kết", ex: "Major sporting events can unify a divided country.", exVi: "Các sự kiện thể thao lớn có thể gắn kết một đất nước chia rẽ.", more: "a unified approach · unification (n) · gần nghĩa: unite" },
          { w: "violate", pos: "v", ipa: "/ˈvaɪəleɪt/", vi: "vi phạm", ex: "The company was fined for violating consumer protection laws.", exVi: "Công ty bị phạt vì vi phạm luật bảo vệ người tiêu dùng.", more: "**violate** a law / a right / an agreement · violation (n) · ≠ violent (bạo lực)" },
          { w: "vision", pos: "n", ipa: "/ˈvɪʒn/", vi: "tầm nhìn; thị lực", ex: "The founder had a clear vision of what the charity should achieve.", exVi: "Người sáng lập có tầm nhìn rõ ràng về điều tổ chức cần đạt.", more: "a **vision of / for** the future · visionary (adj / n) · envisage (v — hình dung)" },
        ],
      },
      {
        t: "table",
        head: ["Cặp dễ nhầm", "Từ 1", "Từ 2"],
        rows: [
          ["assure · ensure · insure", "**assure** sb that… = cam đoan với ai", "**ensure** that… = bảo đảm việc xảy ra · **insure** = mua bảo hiểm"],
          ["device · devise", "**device** /dɪˈvaɪs/ (n) thiết bị", "**devise** /dɪˈvaɪz/ (v) nghĩ ra: devise a plan"],
          ["found · find", "**found – founded – founded** = thành lập", "**find – found – found** = tìm thấy"],
          ["converse · conversely", "**the converse** (n) = điều ngược lại", "**Conversely,** … (adv) = ngược lại — mở câu"],
          ["ethic · ethics · ethical", "work **ethic** (n số ít) = tinh thần làm việc", "**ethics** = đạo đức nghề · **ethical** (adj)"],
          ["medium · media", "a **medium** (số ít)", "the **media** (số nhiều): The media **are / is**…"],
          ["qualitative · quantitative", "**qualitative** = định tính (phỏng vấn, quan sát)", "**quantitative** = định lượng (con số)"],
          ["temporary · contemporary", "**temporary** = tạm thời", "**contemporary** = đương đại; cùng thời"],
        ],
      },
      {
        t: "mcq",
        id: "t4d14-awl-3",
        title: "Nhóm 3 + cặp dễ nhầm — chọn phương án đúng (8 câu)",
        items: [
          { q: "1. The minister ___ reporters that no jobs would be lost.", options: ["ensured", "assured", "insured", "secured"], correct: 1, why: "assure + người + that. ensure không có tân ngữ chỉ người." },
          { q: "2. Engineers have ___ a cheaper way of purifying water.", options: ["device", "divided", "devised", "deviced"], correct: 2, why: "devise (v) = nghĩ ra; device là danh từ." },
          { q: "3. ___ findings are encouraging, but the full report is not due until May.", options: ["Preliminary", "Subordinate", "Rigid", "Mutual"], correct: 0, why: "preliminary findings = kết quả sơ bộ — đối lập với full report." },
          { q: "4. The rules on opening hours were ___ in 2015, allowing shops to trade on Sundays.", options: ["restrained", "suspended", "violated", "relaxed"], correct: 3, why: "relax the rules = nới lỏng ⇒ cho phép. suspend = tạm đình chỉ toàn bộ; restrain dùng cho người / chi tiêu." },
          { q: "5. The university was ___ in 1906.", options: ["found", "founded", "finded", "find"], correct: 1, why: "found (thành lập) – founded – founded." },
          { q: "6. Open-ended interviews produce ___ data; questionnaires with rating scales produce numbers.", options: ["qualitative", "quantitative", "preliminary", "concurrent"], correct: 0, why: "Phỏng vấn mở ⇒ định tính; con số ⇒ quantitative." },
          { q: "7. Wealthy districts tend to have plenty of green space. ___, poorer ones often have very little.", options: ["Concurrently", "Inherently", "Conversely", "Mutually"], correct: 2, why: "Conversely = ngược lại — nối hai ý đối xứng." },
          { q: "8. The retailer was fined for ___ data protection law.", options: ["distorting", "triggering", "confining", "violating"], correct: 3, why: "violate a law = vi phạm luật." },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Volunteering vòng 2 — động cơ, tổ chức, tác động (20 từ)" },
      {
        t: "p",
        text: "Ở Tập 1 bạn nói được “I do volunteer work and it helps people”. Đề band 7 hỏi sâu hơn: ==vì sao== người ta làm tình nguyện, ==ai== thật sự được lợi, có nên ==bắt buộc== không, và tình nguyện có đang làm thay việc của nhà nước không. Hai mươi từ dưới đây chia theo đúng bốn câu hỏi ấy.",
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Bản đồ từ vựng Tình nguyện vòng 2",
        center: "Volunteering",
        branches: [
          { label: "Động cơ", items: ["altruism", "compassion", "public-spirited", "give something back"] },
          { label: "Tổ chức", items: ["non-profit", "the voluntary sector", "grassroots", "philanthropy"] },
          { label: "Hoạt động", items: ["fundraising", "outreach", "mentor", "pro bono", "community service"] },
          { label: "Người nhận · tác động", items: ["beneficiary", "underprivileged", "vulnerable", "social cohesion", "civic engagement"] },
        ],
      },
      {
        t: "vocab",
        items: [
          { w: "altruism", pos: "n", ipa: "/ˈæltruɪzəm/", vi: "lòng vị tha", ex: "Not all volunteering is motivated by pure altruism.", exVi: "Không phải mọi việc tình nguyện đều xuất phát từ lòng vị tha thuần tuý.", more: "altruistic (adj) · be motivated by altruism · ≠ self-interest (tư lợi)" },
          { w: "compassion", pos: "n", ipa: "/kəmˈpæʃn/", vi: "lòng trắc ẩn", ex: "Working at the shelter taught her compassion for people in difficulty.", exVi: "Làm việc ở nhà tạm lánh dạy cô lòng trắc ẩn với người gặp khó khăn.", more: "compassion **for** · compassionate (adj) · khác **empathy** (sự đồng cảm: đặt mình vào vị trí người khác)" },
          { w: "public-spirited", pos: "adj", ipa: "/ˌpʌblɪk ˈspɪrɪtɪd/", vi: "có tinh thần vì cộng đồng", ex: "A few public-spirited residents repaired the playground themselves.", exVi: "Vài cư dân có tinh thần vì cộng đồng đã tự sửa sân chơi.", more: "public spirit (n) · gần nghĩa: civic-minded" },
          { w: "give something back", pos: "phrase", ipa: "/ɡɪv ˌsʌmθɪŋ ˈbæk/", vi: "đền đáp, đóng góp lại", ex: "Many volunteers say they want to give something back to the community.", exVi: "Nhiều tình nguyện viên nói họ muốn đóng góp lại cho cộng đồng.", more: "give something back **to** society / the community — dùng tốt trong Speaking" },
          { w: "non-profit", pos: "adj / n", ipa: "/ˌnɒn ˈprɒfɪt/", vi: "phi lợi nhuận; tổ chức phi lợi nhuận", ex: "She works for a non-profit organisation that teaches adults to read.", exVi: "Cô ấy làm cho một tổ chức phi lợi nhuận dạy người lớn đọc chữ.", more: "a non-profit (n) · not-for-profit (adj) · an NGO" },
          { w: "the voluntary sector", pos: "n", ipa: "/ðə ˈvɒləntri ˌsektə/", vi: "khu vực tình nguyện (các tổ chức từ thiện, phi lợi nhuận)", ex: "The voluntary sector often fills gaps left by public services.", exVi: "Khu vực tình nguyện thường lấp chỗ trống mà dịch vụ công để lại.", more: "the public / private / voluntary sector · voluntary work · on a voluntary basis" },
          { w: "grassroots", pos: "adj", ipa: "/ˌɡrɑːsˈruːts/", vi: "từ cơ sở, do người dân khởi xướng", ex: "The river clean-up began as a grassroots initiative.", exVi: "Việc dọn sông bắt đầu từ một sáng kiến của chính người dân.", more: "a **grassroots** movement / campaign · at grassroots level · ≠ top-down" },
          { w: "philanthropy", pos: "n", ipa: "/fɪˈlænθrəpi/", vi: "hoạt động từ thiện quy mô lớn (thường của người giàu)", ex: "The new hospital wing was funded by private philanthropy.", exVi: "Khu mới của bệnh viện được tài trợ bằng tiền từ thiện tư nhân.", more: "philanthropist (n) · philanthropic (adj) · charity = nói chung; philanthropy = cho tiền có chiến lược, số lớn" },
          { w: "charitable", pos: "adj", ipa: "/ˈtʃærətəbl/", vi: "(thuộc) từ thiện", ex: "The firm gives one per cent of its profits to charitable causes.", exVi: "Công ty dành một phần trăm lợi nhuận cho các mục đích từ thiện.", more: "a **charitable** donation / cause / organisation · charity (n)" },
          { w: "fundraising", pos: "n", ipa: "/ˈfʌndreɪzɪŋ/", vi: "việc gây quỹ", ex: "The school held a fundraising event for flood victims.", exVi: "Trường tổ chức một sự kiện gây quỹ cho nạn nhân lũ lụt.", more: "a **fundraising** event / campaign · raise funds / money **for** · a fundraiser (n)" },
          { w: "outreach", pos: "n", ipa: "/ˈaʊtriːtʃ/", vi: "hoạt động mang dịch vụ tới tận người cần", ex: "The library runs an outreach programme for elderly residents.", exVi: "Thư viện có chương trình mang sách tới tận nơi cho người cao tuổi.", more: "an **outreach** programme / worker · community outreach" },
          { w: "mentor", pos: "v / n", ipa: "/ˈmentɔː/", vi: "kèm cặp, dìu dắt; người kèm cặp", ex: "Retired engineers mentor students from low-income families.", exVi: "Các kỹ sư nghỉ hưu kèm cặp sinh viên từ gia đình thu nhập thấp.", more: "mentoring (n): a mentoring scheme · act as a mentor **to**" },
          { w: "pro bono", pos: "adj / adv", ipa: "/ˌprəʊ ˈbəʊnəʊ/", vi: "(làm việc chuyên môn) miễn phí vì lợi ích cộng đồng", ex: "The law firm took on the case pro bono.", exVi: "Hãng luật nhận vụ án mà không lấy phí.", more: "**pro bono** work / lawyers — dùng cho việc chuyên môn (luật, tư vấn, thiết kế)" },
          { w: "community service", pos: "n", ipa: "/kəˌmjuːnəti ˈsɜːvɪs/", vi: "việc phục vụ cộng đồng; lao động công ích", ex: "Some schools require forty hours of community service before graduation.", exVi: "Một số trường yêu cầu bốn mươi giờ phục vụ cộng đồng trước khi tốt nghiệp.", more: "**do** community service · compulsory / unpaid community service" },
          { w: "beneficiary", pos: "n", ipa: "/ˌbenɪˈfɪʃəri/", vi: "người thụ hưởng", ex: "The main beneficiaries of the project are rural families.", exVi: "Người thụ hưởng chính của dự án là các gia đình nông thôn.", more: "the main / intended **beneficiaries of** · beneficial (adj) **to**" },
          { w: "underprivileged", pos: "adj", ipa: "/ˌʌndəˈprɪvəlɪdʒd/", vi: "thiệt thòi, kém may mắn", ex: "The scheme provides free tutoring for underprivileged children.", exVi: "Chương trình dạy kèm miễn phí cho trẻ em thiệt thòi.", more: "gần nghĩa: disadvantaged, deprived · the underprivileged (n)" },
          { w: "vulnerable", pos: "adj", ipa: "/ˈvʌlnərəbl/", vi: "dễ bị tổn thương", ex: "Volunteers deliver hot meals to vulnerable people who live alone.", exVi: "Tình nguyện viên mang bữa ăn nóng tới những người dễ tổn thương sống một mình.", more: "**vulnerable to** + N · vulnerable groups · vulnerability (n)" },
          { w: "social cohesion", pos: "n", ipa: "/ˌsəʊʃl kəʊˈhiːʒn/", vi: "sự gắn kết xã hội", ex: "Shared projects strengthen social cohesion in mixed neighbourhoods.", exVi: "Dự án chung làm tăng sự gắn kết xã hội ở khu dân cư đa dạng.", more: "strengthen / promote ≠ undermine **social cohesion** · cohesive (adj)" },
          { w: "civic engagement", pos: "n", ipa: "/ˌsɪvɪk ɪnˈɡeɪdʒmənt/", vi: "sự tham gia của công dân vào đời sống chung", ex: "Volunteering is one of the most visible forms of civic engagement.", exVi: "Tình nguyện là một trong những hình thức tham gia đời sống chung dễ thấy nhất.", more: "civic duty / pride / responsibility · engage **in** (v)" },
          { w: "voluntourism", pos: "n", ipa: "/ˌvɒlənˈtʊərɪzəm/", vi: "du lịch kết hợp tình nguyện", ex: "Critics argue that voluntourism benefits the visitor more than the host community.", exVi: "Người phê phán cho rằng du lịch tình nguyện có lợi cho du khách hơn là cho cộng đồng sở tại.", more: "volunteer + tourism · từ mới, dùng được trong Task 2 khi giải thích ngắn (short volunteering trips abroad)" },
        ],
      },
      {
        t: "table",
        head: ["Muốn nói", "Collocation đúng", "⚠️ Lỗi hay gặp"],
        rows: [
          ["làm tình nguyện", "**do voluntary work** · **volunteer** (v) · work **as a volunteer**", "~~do volunteer~~ · ~~join volunteer~~"],
          ["tình nguyện làm gì", "**volunteer to** + V · **volunteer for** + N · volunteer **at / with** + tổ chức", "~~volunteer doing~~"],
          ["quyên tiền", "**raise money / funds for** · **donate** (money) **to**", "~~donate for~~ · ~~rise money~~"],
          ["không lương", "**unpaid** work · work **on a voluntary basis**", "~~no-salary job~~"],
          ["bắt buộc", "**compulsory / mandatory** community service", "~~forced volunteering~~ (mâu thuẫn nghĩa — hãy nói compulsory service)"],
          ["mang lại lợi ích cho", "**benefit** + N (không giới từ) · be **of benefit to** · be beneficial **to**", "~~benefit for the poor~~ (động từ)"],
        ],
      },
      {
        t: "quiz",
        id: "t4d14-volunteer",
        kind: "fill",
        title: "Điền từ / cụm từ của mục 4 (8 câu)",
        items: [
          { q: "1. The marathon was a f___ event for the children's hospital. (gây quỹ)", answers: ["fundraising"], hint: "a ___ event" },
          { q: "2. Elderly people who live alone are especially v___ to loneliness.", answers: ["vulnerable"], hint: "___ to" },
          { q: "3. The project started at g___ level, with three neighbours and a borrowed van.", answers: ["grassroots"], hint: "từ cơ sở" },
          { q: "4. Lawyers at the firm do ten days of pro ___ work every year.", answers: ["bono"], hint: "pro ___" },
          { q: "5. Students who do community ___ often become more confident.", answers: ["service"], hint: "community ___" },
          { q: "6. The main b___ of the scholarship are girls from rural areas. (số nhiều)", answers: ["beneficiaries"], hint: "y → ies" },
          { q: "7. She wanted to give something ___ to the town where she grew up.", answers: ["back"], hint: "give something ___" },
          { q: "8. Community gardens can strengthen social c___ .", answers: ["cohesion"], hint: "social ___" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Money vòng 2 — thu nhập, nợ và chủ nghĩa tiêu dùng (22 từ)" },
      {
        t: "p",
        text: "Tập 2 Ngày 16 dạy từ để ==mua một món đồ==. Vòng 2 dạy từ để ==bàn về tiền như một vấn đề xã hội==: lương có theo kịp giá không, vì sao người trẻ mắc nợ, người ta mua để dùng hay để khoe. Ba cụm: (a) thu nhập và giá cả · (b) nợ và quản lý tiền · (c) tiêu dùng và thái độ.",
      },
      {
        t: "vocab",
        items: [
          { w: "disposable income", pos: "n", ipa: "/dɪˌspəʊzəbl ˈɪnkʌm/", vi: "thu nhập khả dụng (phần còn lại sau thuế để tiêu)", ex: "Young professionals tend to have more disposable income than students.", exVi: "Người trẻ đi làm thường có nhiều thu nhập khả dụng hơn sinh viên.", more: "have more / less / little disposable income · ⚠️ không phải “thu nhập dùng một lần”" },
          { w: "purchasing power", pos: "n", ipa: "/ˈpɜːtʃəsɪŋ ˌpaʊə/", vi: "sức mua", ex: "Inflation reduces the purchasing power of people's savings.", exVi: "Lạm phát làm giảm sức mua của tiền tiết kiệm.", more: "erode / reduce / increase **purchasing power**" },
          { w: "the cost of living", pos: "n", ipa: "/ðə ˌkɒst əv ˈlɪvɪŋ/", vi: "chi phí sinh hoạt", ex: "Wages have not kept pace with the cost of living.", exVi: "Lương không theo kịp chi phí sinh hoạt.", more: "the rising cost of living · ≠ **standard of living** (mức sống)" },
          { w: "inflation", pos: "n", ipa: "/ɪnˈfleɪʃn/", vi: "lạm phát", ex: "Inflation rose to its highest level in a decade.", exVi: "Lạm phát lên mức cao nhất trong một thập kỷ.", more: "high / low / rising **inflation** · the inflation rate · inflated prices" },
          { w: "affluent", pos: "adj", ipa: "/ˈæfluənt/", vi: "khá giả, sung túc (trang trọng)", ex: "Affluent households spend a smaller share of their income on food.", exVi: "Hộ khá giả chi một phần nhỏ hơn thu nhập cho thực phẩm.", more: "affluence (n) · an affluent society / suburb · rich (thường) → wealthy → **affluent** (trang trọng)" },
          { w: "make ends meet", pos: "idiom", ipa: "/meɪk ˌendz ˈmiːt/", vi: "xoay cho đủ sống", ex: "Many pensioners struggle to make ends meet.", exVi: "Nhiều người hưu trí chật vật mới đủ sống.", more: "**struggle to** make ends meet · dùng được trong Speaking và bài viết bán trang trọng" },
          { w: "live beyond your means", pos: "idiom", ipa: "/lɪv bɪˌjɒnd jɔː ˈmiːnz/", vi: "tiêu quá khả năng", ex: "Easy credit tempts people to live beyond their means.", exVi: "Tín dụng dễ dãi khiến người ta tiêu quá khả năng.", more: "≠ live **within** your means · means (n, luôn có s) = tiền bạc, khả năng tài chính" },
          { w: "run up debts", pos: "phrase", ipa: "/rʌn ʌp ˈdets/", vi: "mắc nợ chồng chất", ex: "Students can run up large debts before they graduate.", exVi: "Sinh viên có thể mắc nợ lớn trước khi tốt nghiệp.", more: "be / get **in debt** · pay off / clear a debt · debt /det/ — chữ **b** câm" },
          { w: "on credit", pos: "phrase", ipa: "/ɒn ˈkredɪt/", vi: "(mua) chịu, trả sau", ex: "Buying on credit makes goods feel cheaper than they really are.", exVi: "Mua chịu khiến món hàng có vẻ rẻ hơn thực tế.", more: "buy sth **on credit** · a credit card · buy now, pay later" },
          { w: "interest", pos: "n", ipa: "/ˈɪntrəst/", vi: "tiền lãi", ex: "The bank charges 20 per cent interest on unpaid balances.", exVi: "Ngân hàng tính lãi 20 phần trăm trên số dư chưa trả.", more: "pay / charge / earn **interest on** · the interest rate · interest-free (adj)" },
          { w: "mortgage", pos: "n", ipa: "/ˈmɔːɡɪdʒ/", vi: "khoản vay thế chấp mua nhà", ex: "First-time buyers find it increasingly hard to get a mortgage.", exVi: "Người mua nhà lần đầu ngày càng khó vay thế chấp.", more: "**take out** / pay off a mortgage · chữ **t** câm" },
          { w: "budget", pos: "v / n", ipa: "/ˈbʌdʒɪt/", vi: "tính toán chi tiêu; ngân sách", ex: "Living away from home forces students to budget carefully.", exVi: "Sống xa nhà buộc sinh viên phải tính toán chi tiêu cẩn thận.", more: "budget **for** + N · be **on a tight budget** · stay within budget" },
          { w: "financial literacy", pos: "n", ipa: "/faɪˌnænʃl ˈlɪtərəsi/", vi: "hiểu biết về tài chính", ex: "Schools should teach financial literacy alongside mathematics.", exVi: "Trường học nên dạy hiểu biết tài chính song song với toán.", more: "financially literate (adj) · improve / lack financial literacy" },
          { w: "frugal", pos: "adj", ipa: "/ˈfruːɡl/", vi: "tằn tiện, tiết kiệm (nghĩa khen)", ex: "My grandparents led a frugal life and never borrowed a penny.", exVi: "Ông bà tôi sống tằn tiện và chưa từng vay một xu.", more: "frugality (n) · frugal / thrifty (khen) ≠ mean / stingy (chê: keo kiệt)" },
          { w: "extravagant", pos: "adj", ipa: "/ɪkˈstrævəɡənt/", vi: "hoang phí, xa hoa", ex: "Extravagant weddings can leave couples in debt for years.", exVi: "Đám cưới xa hoa có thể khiến cặp đôi mắc nợ nhiều năm.", more: "extravagance (n) · gần nghĩa: lavish (xa hoa — trung tính hơn), wasteful (lãng phí — chê)" },
          { w: "consumerism", pos: "n", ipa: "/kənˈsjuːmərɪzəm/", vi: "chủ nghĩa tiêu dùng", ex: "Critics blame advertising for the spread of consumerism.", exVi: "Người phê phán đổ cho quảng cáo đã làm lan rộng chủ nghĩa tiêu dùng.", more: "a consumer society · consumer goods / spending / debt" },
          { w: "materialistic", pos: "adj", ipa: "/məˌtɪəriəˈlɪstɪk/", vi: "coi trọng vật chất", ex: "Some people argue that society has become more materialistic.", exVi: "Có người cho rằng xã hội đã trở nên coi trọng vật chất hơn.", more: "materialism (n) · material possessions (của cải vật chất)" },
          { w: "conspicuous consumption", pos: "n", ipa: "/kənˌspɪkjuəs kənˈsʌmpʃn/", vi: "tiêu dùng phô trương", ex: "Luxury cars are a classic example of conspicuous consumption.", exVi: "Xe sang là ví dụ kinh điển của tiêu dùng phô trương.", more: "conspicuous = dễ thấy, cố ý cho người khác thấy · consume (v) → consumption (n)" },
          { w: "status symbol", pos: "n", ipa: "/ˈsteɪtəs ˌsɪmbl/", vi: "biểu tượng địa vị", ex: "For many teenagers, the latest phone is a status symbol.", exVi: "Với nhiều thiếu niên, chiếc điện thoại mới nhất là biểu tượng địa vị.", more: "be seen as a status symbol · social status" },
          { w: "impulse purchase", pos: "n", ipa: "/ˈɪmpʌls ˌpɜːtʃəs/", vi: "món mua bốc đồng", ex: "Online stores are designed to encourage impulse purchases.", exVi: "Cửa hàng trực tuyến được thiết kế để khuyến khích mua bốc đồng.", more: "impulse buying (n) · buy sth **on impulse**" },
          { w: "cashless", pos: "adj", ipa: "/ˈkæʃləs/", vi: "không dùng tiền mặt", ex: "Several countries are moving rapidly towards a cashless society.", exVi: "Một số nước đang tiến nhanh tới xã hội không tiền mặt.", more: "a **cashless** society / payment · go cashless · contactless payment (chạm thẻ)" },
          { w: "throwaway culture", pos: "n", ipa: "/ˈθrəʊəweɪ ˌkʌltʃə/", vi: "văn hoá dùng rồi vứt", ex: "Cheap fashion has contributed to a throwaway culture.", exVi: "Thời trang giá rẻ đã góp phần tạo nên văn hoá dùng rồi vứt.", more: "a throwaway society · disposable (adj — dùng một lần)" },
        ],
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Sắc thái: cùng nói về tiền, khác thái độ",
        cols: [
          { title: "Khen / trung tính", items: ["**frugal · thrifty** — tiết kiệm khéo", "**affluent · well-off** — khá giả", "**lavish** — hào phóng, xa hoa (trung tính)", "**economical** — (vật) tiết kiệm nhiên liệu, chi phí"] },
          { title: "Chê", items: ["**mean · stingy** — keo kiệt", "**materialistic** — chỉ biết vật chất", "**extravagant · wasteful** — hoang phí", "**cheap** — (người) bủn xỉn; (vật) rẻ tiền, kém"] },
          { title: "Văn phong", items: ["Writing: affluent, low-income, frugal", "Speaking: well-off, hard up, tight with money", "⚠️ không viết ~~rich people / poor people~~ lặp lại — đổi: wealthier households, those on low incomes"] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Lỗi tinh với từ về tiền",
        items: [
          "~~economic car~~ → **economical** (tiết kiệm). **economic** = thuộc về kinh tế: economic growth.",
          "~~spend money for~~ → **spend** money **on** + N · **spend** time **V-ing**.",
          "~~pay the bill by cash~~ → pay **in cash** · pay **by** card / **by** phone.",
          "~~the price is expensive / cheap~~ → the price is **high / low**; món hàng mới expensive / cheap.",
          "~~a debt money~~ → **a debt**; **owe** (v): She owes the bank $5,000.",
          "~~lend~~ ↔ ~~borrow~~: the bank **lends** money **to** you; you **borrow** money **from** the bank.",
          "**income** (mọi nguồn thu) · **salary** (lương tháng, việc văn phòng) · **wage(s)** (lương theo giờ / tuần) · **earnings** (tổng tiền kiếm được).",
        ],
      },
      {
        t: "quiz",
        id: "t4d14-money",
        kind: "fill",
        title: "Điền từ của mục 5 (8 câu)",
        items: [
          { q: "1. Rising rents have pushed up the cost of ___ .", answers: ["living"], hint: "the cost of ___" },
          { q: "2. After tax and rent, she has very little d___ income.", answers: ["disposable"], hint: "___ income" },
          { q: "3. He bought the car on ___ and is still paying for it.", answers: ["credit"], hint: "on ___" },
          { q: "4. Many pensioners struggle to make ends ___ .", answers: ["meet"], hint: "thành ngữ" },
          { q: "5. The couple took out a m___ to buy their first flat.", answers: ["mortgage"], hint: "khoản vay mua nhà" },
          { q: "6. A designer handbag is often bought as a status ___ .", answers: ["symbol"], hint: "status ___" },
          { q: "7. With prices rising by eight per cent a year, i___ is eroding people's savings.", answers: ["inflation"], hint: "lạm phát" },
          { q: "8. People who live beyond their ___ soon run up debts.", answers: ["means"], hint: "luôn có s" },
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Dùng ngay: câu Task 2 và Part 3 với từ hôm nay" },
      {
        t: "examples",
        items: [
          { en: "The bulk of the charity's income is devoted to outreach work with vulnerable teenagers.", vi: "Phần lớn thu nhập của tổ chức được dành cho việc tiếp cận, hỗ trợ thiếu niên dễ tổn thương. (bulk · devote to · outreach · vulnerable)" },
          { en: "Compulsory community service is not inherently unfair, provided that it is compatible with students' academic workload.", vi: "Lao động công ích bắt buộc tự nó không bất công, miễn là nó phù hợp với khối lượng học tập của học sinh. (inherently · compatible with)" },
          { en: "Easy credit has become the norm, and it tempts those with little disposable income to live beyond their means.", vi: "Tín dụng dễ dãi đã thành chuyện bình thường, và nó khiến người có ít thu nhập khả dụng tiêu quá khả năng. (the norm · disposable income · live beyond their means)" },
          { en: "Conversely, a cashless system may erode the privacy of ordinary consumers.", vi: "Ngược lại, một hệ thống không tiền mặt có thể làm xói mòn quyền riêng tư của người tiêu dùng bình thường. (Conversely · cashless · erode)" },
          { en: "Part 3 — I'd say volunteering is partly about altruism, but honestly a lot of people also do it to give something back, or just to meet like-minded people.", vi: "Tôi nghĩ tình nguyện một phần là vì lòng vị tha, nhưng thật ra nhiều người làm còn để đóng góp lại, hoặc chỉ để gặp người cùng chí hướng." },
          { en: "Part 3 — Where I live, a lot of young people struggle to make ends meet, so I'm not sure it's fair to call them materialistic.", vi: "Ở chỗ tôi sống, nhiều người trẻ chật vật mới đủ sống, nên tôi không chắc gọi họ là coi trọng vật chất thì có công bằng không." },
        ],
      },
      {
        t: "quiz",
        id: "t4d14-tv-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — dùng từ trong gợi ý (5 câu)",
        grammar: "the bulk of · an integral part of · erode the purchasing power of · be founded · live beyond one's means",
        items: [
          { q: "1. Phần lớn kinh phí đến từ các khoản quyên góp từ thiện.", answers: ["The bulk of the funding comes from charitable donations.", "The bulk of the money comes from charitable donations."], hint: "The bulk of · charitable donations" },
          { q: "2. Tình nguyện là một phần không thể thiếu của đời sống cộng đồng.", answers: ["Volunteering is an integral part of community life.", "Voluntary work is an integral part of community life."], hint: "an integral part of" },
          { q: "3. Lạm phát đã làm xói mòn sức mua của các gia đình thu nhập thấp.", answers: ["Inflation has eroded the purchasing power of low-income families.", "Inflation has eroded the purchasing power of low-income households."], hint: "erode · purchasing power · low-income" },
          { q: "4. Tổ chức từ thiện này được thành lập năm 2010 để giúp trẻ em thiệt thòi.", answers: ["The charity was founded in 2010 to help underprivileged children.", "This charity was founded in 2010 to help underprivileged children."], hint: "was founded · underprivileged" },
          { q: "5. Nhiều người trẻ tiêu quá khả năng và mắc nợ chồng chất.", answers: ["Many young people live beyond their means and run up debts.", "Many young people live beyond their means and run up large debts.", "Many young people live beyond their means and get into debt."], hint: "live beyond their means · run up debts" },
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t4d14-viet",
    kind: "writing",
    title: "Viết Task 2: Advantages / disadvantages band 7 — phán quyết “outweigh” rõ, có thước đo",
    goal: "Viết một bài “Do the advantages outweigh the disadvantages?” 290–330 từ đạt mức band 7: thesis nói rõ bên nào nặng hơn VÀ vì sao (theo một trong năm thước đo: quy mô, mức nghiêm trọng, độ lâu dài, khả năng khắc phục, ai gánh), thân bài thừa nhận thật bên nhẹ hơn rồi chỉ ra giới hạn của nó, bên nặng hơn được đào sâu và có câu cân trực tiếp, kết bài nhắc lại phán quyết kèm điều kiện — không còn kiểu “liệt kê hai cột rồi chọn bừa” của band 6.",
    minutes: 100,
    blocks: [
      {
        t: "recap",
        items: [
          "Dạng **Advantages / disadvantages** đã học hai vòng: Tập 2 Ngày 10 (ba cách hỏi, khung 4 đoạn) và Tập 3 Ngày 14 (outweigh, positive / negative development, ba lập trường). Hôm nay là vòng 3 — ==band 7==.",
          "Band 6 trả lời “bên nào nặng hơn?” bằng một câu ở kết bài. Band 7 trả lời ==từ mở bài==, và cả bài là quá trình **cân**.",
          "Muốn cân phải có **thước đo**. Năm thước đo: ==quy mô · mức nghiêm trọng · độ lâu dài · khắc phục được không · ai gánh==.",
          "Bên bạn cho là nhẹ hơn phải được **thừa nhận thật** (không dựng bù nhìn), rồi mới chỉ ra giới hạn của nó.",
          "Dùng ngay ngữ pháp Ngày 13 (rào đón, this / such + danh từ) và từ vựng Bài 1 (cashless, impulse purchases, run up debts, vulnerable, devote… to).",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Band 6 và band 7 khác nhau ở đâu trong dạng này" },
      {
        t: "table",
        head: ["", "Band 6", "Band 7"],
        rows: [
          ["**Thesis**", "This essay will discuss both sides. / I think the advantages outweigh.", "Nêu bên nặng hơn + **lý do cân** ngay ở mở bài"],
          ["**Thân bài**", "Đoạn 1: 3–4 ưu điểm liệt kê · Đoạn 2: 3–4 nhược điểm liệt kê", "Mỗi đoạn 2 ý ==đào sâu==; đoạn bên nhẹ có câu chỉ giới hạn; đoạn bên nặng có câu cân trực tiếp"],
          ["**Quan hệ hai đoạn**", "Hai danh sách độc lập, nối bằng However", "Đoạn sau ==trả lời== đoạn trước: by contrast, reach almost everyone…"],
          ["**Phán quyết**", "Xuất hiện lần đầu ở kết bài, lý do mới (“more modern”)", "Có ở mở bài, được chứng minh ở thân bài, nhắc lại ở kết bài kèm điều kiện"],
          ["**Mức chắc chắn**", "will, always, nobody, everything", "tends to, may, in some cases, largely (Ngày 13)"],
        ],
        caption: "Descriptor band 7 TR: “presents a clear position throughout the response”. Chữ quyết định là throughout — suốt bài.",
      },
      {
        t: "sodo",
        kind: "compare",
        title: "Hai cách trả lời câu “Do the advantages outweigh the disadvantages?”",
        cols: [
          { title: "Liệt kê rồi chọn (band 6)", items: ["Ưu 1 · Ưu 2 · Ưu 3", "Nhược 1 · Nhược 2 · Nhược 3", "Kết: “I think the advantages outweigh”", "Người đọc hỏi: ==vì sao?== 3 chọi 3 mà"] },
          { title: "Cân có thước đo (band 7)", items: ["Mở: bên A nặng hơn **vì** rộng hơn / lâu hơn / không khắc phục được", "Bên B: thật, nhưng hẹp / tạm thời / có cách giảm", "Bên A: rộng, lâu, khó thay thế", "Kết: phán quyết + điều kiện"] },
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Ôn 60 giây: ba cách hỏi và việc đếm vế đề" },
      {
        t: "table",
        head: ["Câu hỏi của đề", "Bắt buộc phải có", "Lỗi làm tụt TR"],
        rows: [
          ["Discuss the advantages and disadvantages.", "cả hai phía, tương đối cân đối; phán quyết không bắt buộc nhưng nên có một câu ở kết", "chỉ viết một phía"],
          ["Do the advantages **outweigh** the disadvantages?", "==phán quyết rõ== bên nào nặng hơn + lý do; vẫn phải bàn cả hai phía", "kết “both have advantages and disadvantages” — không trả lời câu hỏi"],
          ["Is this a positive or negative development?", "lập trường (positive / negative / phần lớn positive nhưng…) + lý do", "liệt kê ưu – nhược mà không nói positive hay negative"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: đếm vế đề trước khi nghĩ ý (ôn Tập 3 Ngày 6 · 14)",
        items: [
          "Đề hôm nay: “In many countries, cash is being replaced by card and mobile payments, **and** some shops no longer accept notes and coins at all.”",
          "Có ==hai vế==: (1) xu hướng chung — thanh toán điện tử thay tiền mặt; (2) mức cực đoan — có nơi từ chối hẳn tiền mặt.",
          "Bài band 7 phải chạm cả vế (2): chính việc **từ chối tiền mặt** mới tạo ra nhược điểm nặng nhất (người bị loại ra). Bài chỉ bàn “thẻ tiện hơn tiền” là mới trả lời nửa đề.",
        ],
      },

      /* ── 3 ── */
      { t: "h", text: "3. Năm thước đo để cân — phần lõi của bài hôm nay" },
      {
        t: "p",
        text: "“Outweigh” nghĩa đen là ==nặng hơn khi đặt lên cân==. Không ai cân được nếu không có đơn vị. Trong bài luận, “đơn vị” là một trong năm câu hỏi dưới đây. Chọn **một hoặc hai** thước đo cho cả bài và nói ra thành lời.",
      },
      {
        t: "table",
        head: ["Thước đo", "Câu hỏi", "Câu mẫu (đề tiền mặt)"],
        rows: [
          ["**Quy mô** (scale)", "Bao nhiêu người được / bị ảnh hưởng?", "The benefits **reach almost everyone**, whereas the drawbacks **affect a minority**."],
          ["**Mức nghiêm trọng** (severity)", "Phiền một chút hay tổn hại thật?", "Being unable to buy food is **far more serious than** waiting a few seconds longer at a till."],
          ["**Độ lâu dài** (duration)", "Tạm thời hay vĩnh viễn?", "The difficulties are **largely transitional**; the gains are **permanent**."],
          ["**Khắc phục được không** (remediability)", "Có cách giảm nhẹ / tránh không?", "These problems **can be mitigated by** regulation, while the benefits **cannot be obtained in any other way**."],
          ["**Ai gánh** (distribution)", "Lợi về ai, hại rơi vào ai?", "The costs **fall on those least able to bear them**."],
        ],
      },
      {
        t: "patterns",
        rows: [
          { formula: "S (drawbacks) + be + real, but + can be mitigated / offset / reduced by + N", vi: "Thừa nhận rồi chỉ ra giới hạn của bên nhẹ hơn.", examples: [{ en: "Such problems are real, but they can be mitigated by sensible regulation.", vi: "Những vấn đề như vậy là có thật, nhưng có thể giảm nhẹ bằng quy định hợp lý." }] },
          { formula: "S (benefits), by contrast, + V + …", vi: "Mở đoạn bên nặng hơn — đoạn này trả lời đoạn trước.", examples: [{ en: "The benefits, by contrast, reach almost everyone and are difficult to obtain in any other way.", vi: "Ngược lại, lợi ích đến với gần như mọi người và khó có được bằng cách nào khác." }] },
          { formula: "S + come(s) at too high a cost  ·  S + be + a price worth paying (for + N)", vi: "Hai cách phán quyết ngắn gọn.", examples: [{ en: "A little inconvenience at the till is a price worth paying for lower crime.", vi: "Một chút bất tiện ở quầy thu ngân là cái giá đáng trả để có ít tội phạm hơn." }, { en: "Convenience that excludes the poorest comes at too high a cost.", vi: "Sự tiện lợi mà loại người nghèo nhất ra ngoài thì trả giá quá đắt." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Cẩn thận: ba kiểu “cân giả”",
        items: [
          "**Đếm số lượng**: “There are three advantages and two disadvantages, so the advantages outweigh.” — số ý không phải sức nặng.",
          "**Lý do mới ở kết bài**: thân bài không hề nói “modern”, kết bài bỗng viết “because it is more modern”. Lý do cân phải có sẵn trong thân bài.",
          "**Bù nhìn**: viết bên kia thật yếu (“Some people are too lazy to learn technology”) để dễ thắng. Giám khảo coi đó là thiếu công bằng ⇒ TR không lên 7.",
        ],
      },
      { t: "rule", formula: "A outweighs B  vì  A rộng hơn / nặng hơn / lâu hơn / không khắc phục được / rơi vào người yếu thế", vi: "Chọn 1–2 thước đo, nói thẳng ra trong thesis, rồi dùng chính thước đo ấy ở câu mở đoạn thân bài thứ hai." },
      {
        t: "quiz",
        id: "t4d14-viet-thuoc-do-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — câu cân (4 câu)",
        grammar: "can be mitigated by · by contrast · a price worth paying · fall on",
        items: [
          { q: "1. Những bất lợi này là có thật, nhưng chúng có thể được giảm nhẹ bằng đào tạo.", answers: ["These drawbacks are real, but they can be mitigated by training.", "These disadvantages are real, but they can be mitigated by training."], hint: "real, but… can be mitigated by" },
          { q: "2. Ngược lại, lợi ích đến với gần như mọi người. (The benefits, …)", answers: ["The benefits, by contrast, reach almost everyone.", "The benefits, by contrast, reach nearly everyone."], hint: "by contrast · reach almost everyone" },
          { q: "3. Giá vé cao hơn là cái giá đáng trả để có không khí sạch hơn.", answers: ["Higher fares are a price worth paying for cleaner air.", "Higher ticket prices are a price worth paying for cleaner air."], hint: "a price worth paying for" },
          { q: "4. Chi phí rơi vào những người ít có khả năng gánh nhất.", answers: ["The costs fall on those least able to bear them.", "The cost falls on those least able to bear it."], hint: "fall on those least able to bear them" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Thesis band 7 và ngữ pháp của “outweigh”" },
      {
        t: "patterns",
        rows: [
          { formula: "Although + S + V (bên nhẹ), I would argue that + S (bên nặng) + V, chiefly because + S + V (thước đo)", vi: "Khuôn thesis đầy đủ nhất: nhượng bộ + phán quyết + lý do cân.", examples: [{ en: "Although this shift creates genuine difficulties for certain groups, I would argue that its benefits are greater, chiefly because they are widely shared and lasting.", vi: "Dù sự chuyển dịch này gây khó khăn thật cho một số nhóm, tôi cho rằng lợi ích của nó lớn hơn, chủ yếu vì chúng được chia sẻ rộng và lâu dài." }] },
          { formula: "While + S + V, + the drawbacks are, in my view, + too serious / too widespread + to be justified by + N", vi: "Khi bạn cho rằng NHƯỢC điểm nặng hơn.", examples: [{ en: "While cashless payment is undeniably convenient, the drawbacks are, in my view, too serious to be justified by a few seconds saved at the till.", vi: "Dù thanh toán không tiền mặt rõ ràng tiện lợi, theo tôi các bất lợi quá nghiêm trọng, không thể biện minh bằng vài giây tiết kiệm ở quầy." }] },
          { formula: "A + (far / clearly / marginally) + outweigh(s) + B   ·   B + be + outweighed by + A", vi: "outweigh là ngoại động từ: đi thẳng với tân ngữ, không giới từ.", examples: [{ en: "In my opinion, the long-term gains clearly outweigh the short-term costs.", vi: "Theo tôi, cái lợi dài hạn rõ ràng nặng hơn cái giá ngắn hạn." }, { en: "These risks are outweighed by the benefits to public health.", vi: "Những rủi ro này nhẹ hơn lợi ích đối với sức khoẻ cộng đồng." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai với outweigh",
        items: [
          "~~The advantages outweight the disadvantages.~~ → **outweigh** (động từ không có t; weight là danh từ).",
          "~~The advantages outweigh than the disadvantages.~~ / ~~outweigh over~~ → **outweigh the disadvantages** — không giới từ, không than.",
          "~~The advantages are outweigh the disadvantages.~~ → hoặc **outweigh** (chủ động), hoặc **are outweighed by** (bị động) — không trộn.",
          "~~The advantage outweigh…~~ → chủ ngữ số ít: **outweighs**; số nhiều: **outweigh**.",
          "~~The advantages more outweigh…~~ → mức độ dùng trạng từ: **far / clearly / considerably / marginally / slightly** outweigh.",
          "~~overweigh~~ không phải từ dùng ở đây (overweight = thừa cân).",
          "Bị động đổi chiều nghĩa: The disadvantages **are outweighed by** the advantages = ưu điểm nặng hơn. Đọc lại thesis xem có viết ngược không.",
        ],
      },
      { t: "rule", formula: "Although + bên nhẹ, I would argue that + bên nặng + (far) outweigh(s) + …, chiefly because + thước đo", vi: "Thesis band 7 của dạng outweigh: một câu, ba phần — nhượng bộ, phán quyết, lý do cân." },
      {
        t: "quiz",
        id: "t4d14-viet-thesis-dich",
        kind: "translate",
        title: "Dịch Việt → Anh — thesis và outweigh (3 câu)",
        grammar: "A (far) outweigh(s) B · B is outweighed by A · Although…, I would argue that…",
        items: [
          { q: "1. Theo tôi, lợi ích vượt xa các bất lợi. (In my view, …)", answers: ["In my view, the benefits far outweigh the drawbacks.", "In my view, the advantages far outweigh the disadvantages.", "In my view, the benefits far outweigh the disadvantages."], hint: "far outweigh" },
          { q: "2. Những rủi ro này nhẹ hơn so với lợi ích. (bị động — These risks …)", answers: ["These risks are outweighed by the benefits.", "These risks are outweighed by the advantages."], hint: "are outweighed by" },
          { q: "3. Dù xu hướng này có một số bất lợi, tôi cho rằng lợi ích của nó lớn hơn.", answers: ["Although this trend has some drawbacks, I would argue that its benefits are greater.", "Although this trend has some disadvantages, I would argue that its benefits are greater.", "Although this trend has some drawbacks, I would argue that its advantages are greater."], hint: "Although…, I would argue that its benefits are greater" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Bố cục 4 đoạn: bên nhẹ trước, bên nặng sau" },
      {
        t: "sodo",
        kind: "flow",
        title: "Khung bài outweigh band 7 (290–330 từ)",
        steps: [
          { label: "Mở bài · 2 câu · ~50 từ", sub: "Câu 1: viết lại xu hướng (đủ hai vế đề). Câu 2: thesis = nhượng bộ + phán quyết + thước đo." },
          { label: "Thân bài 1 · bên NHẸ hơn · ~95 từ", sub: "Câu chủ đề thừa nhận (should not be dismissed) → ý 1 đào sâu → ý 2 đào sâu → 1–2 câu giới hạn: real, but… can be mitigated by…" },
          { label: "Thân bài 2 · bên NẶNG hơn · ~110 từ", sub: "Câu chủ đề CÂN (by contrast + thước đo) → ý 1 (cá nhân) → ý 2 (doanh nghiệp / xã hội) — mỗi ý có hệ quả cụ thể" },
          { label: "Kết bài · 2 câu · ~35 từ", sub: "On balance + phán quyết (nhắc lại, đổi lời) + một điều kiện: only as long as…" },
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao bên nhẹ đi trước",
        items: [
          "Người đọc nhớ nhất điều đọc sau cùng. Đặt bên bạn chọn ở Thân bài 2 thì kết bài đến tự nhiên.",
          "Thân bài 1 kết bằng câu **giới hạn** (can be mitigated…) tạo sẵn bản lề cho câu mở Thân bài 2 (by contrast…).",
          "Hai thân bài ==không cần dài bằng nhau==. Bên nặng hơn dài hơn 10–20 từ là hợp lý. Nhưng bên nhẹ dưới 70 từ là thiếu công bằng.",
          "Nếu bạn cho rằng nhược điểm nặng hơn: đảo lại — Thân bài 1 ưu điểm (thừa nhận), Thân bài 2 nhược điểm.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Ngôn ngữ cân: 14 cụm cho câu phán quyết" },
      {
        t: "table",
        head: ["Chức năng", "Cụm", "Ví dụ"],
        rows: [
          ["Thừa nhận bên kia", "**should not be dismissed · are not to be underestimated · it is true that · admittedly**", "The disadvantages **should not be dismissed**."],
          ["Gọi tên mức độ", "a **minor / significant / serious** drawback · a **marginal / substantial / undeniable** benefit", "This is a **significant** drawback for rural customers."],
          ["Giới hạn bên nhẹ", "**can be mitigated / offset / reduced by** · **is largely transitional** · **affects only a minority**", "The loss of jobs **could be offset by** retraining schemes."],
          ["Nói bên nặng hơn", "**far / clearly outweigh** · **are considerably greater than** · **pale in comparison with**", "Such inconveniences **pale in comparison with** the gains in safety."],
          ["Phán quyết ngắn", "**a price worth paying** · **comes at too high a cost** · **do not justify**", "The savings **do not justify** the loss of privacy."],
          ["Mở kết bài", "**On balance, · Weighing these points, · Taken together,**", "**On balance**, I believe that…"],
          ["Điều kiện", "**provided that · as long as · unless** (Ngày 19 học sâu)", "…**provided that** cash remains an option."],
        ],
      },
      {
        t: "note",
        title: "⚠️ Văn phong: bốn cụm band 6 nên bỏ",
        items: [
          "~~Every coin has two sides.~~ / ~~a double-edged sword~~ — sáo, giám khảo gặp hàng trăm lần mỗi ngày.",
          "~~This essay will discuss the advantages and disadvantages.~~ — không có lập trường; với đề outweigh là mất điểm TR.",
          "~~In a nutshell~~ / ~~Last but not least~~ — khẩu ngữ hoặc sáo.",
          "~~pros and cons~~ — hơi khẩu ngữ; viết benefits and drawbacks / advantages and disadvantages.",
        ],
      },

      /* ── 7 ── */
      { t: "h", text: "7. Phân tích đề và dàn ý 6 phút" },
      {
        t: "p",
        text: "**ĐỀ:** In many countries, cash is being replaced by card and mobile payments, and some shops no longer accept notes and coins at all. **Do the advantages of this development outweigh the disadvantages?** Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      },
      {
        t: "table",
        head: ["Bước", "Làm gì", "Kết quả"],
        rows: [
          ["1. Đếm vế (30 giây)", "Gạch chân hai vế + câu hỏi", "(1) thanh toán điện tử thay tiền mặt · (2) có nơi từ chối hẳn tiền mặt · hỏi: outweigh?"],
          ["2. Liệt kê nhanh (2 phút)", "Mỗi bên 3–4 ý, viết bằng từ khoá", "**Ưu:** nhanh, an toàn (khoá thẻ) · tiệm đỡ đếm – cất – nộp tiền · khó trốn thuế. **Nhược:** người già / không tài khoản bị loại · tiêu quá tay, nợ · mất riêng tư · hệ thống sập"],
          ["3. Chọn 2 ý mạnh nhất mỗi bên (1 phút)", "Bỏ ý trùng, ý khó chứng minh", "Nhược: ==bị loại ra== + ==tiêu quá tay==. Ưu: ==nhanh – an toàn== + ==tiệm nhỏ & thuế=="],
          ["4. Cân (1 phút)", "Hỏi năm câu của mục 3", "Nhược: rơi vào thiểu số; có cách giảm (luật buộc nhận tiền mặt, app báo chi tiêu). Ưu: gần như mọi người; lâu dài ⇒ ==ưu nặng hơn=="],
          ["5. Viết thesis (1 phút)", "Nhượng bộ + phán quyết + thước đo", "Although… genuine difficulties for certain groups, … benefits are greater, chiefly because they are widely shared and lasting, whereas the drawbacks affect a minority and can largely be mitigated."],
          ["6. Điều kiện cho kết bài (30 giây)", "Phán quyết đúng khi nào?", "…only as long as cash remains available to those who depend on it."],
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Bài mẫu band 6 (ước tính) — đọc và tìm xem dừng ở đâu" },
      {
        t: "p",
        text: "Bài dưới đây đủ ý, đủ độ dài, ít lỗi ngữ pháp nặng. Nó dừng ở band 6 vì ==không cân==. Vừa đọc vừa tự hỏi: câu nào cho biết vì sao bên này nặng hơn bên kia?",
      },
      {
        t: "examples",
        items: [
          { en: "Nowadays, many people use cards and mobile phones to pay, and some shops do not take cash any more. This essay will discuss the advantages and disadvantages of this trend.", vi: "Mở bài: chép gần nguyên đề; không có lập trường." },
          { en: "There are many advantages of paying without cash. Firstly, it is very convenient. People do not need to bring money when they go out and they can pay very fast. For example, in my city people can pay for a bowl of noodles by scanning a code. Secondly, it is safe because thieves cannot steal your money. Moreover, the government can check all payments, so nobody can avoid tax. This is good for the country because the government has more money for schools and roads. Furthermore, shops save time because they do not need to count money every day.", vi: "Thân bài 1: bốn ưu điểm, mỗi ý một câu; từ nối máy móc đầu câu; cannot / nobody tuyệt đối." },
          { en: "However, there are also some disadvantages. Firstly, old people do not know how to use technology, so they cannot buy things. For example, my grandmother always pays in cash at the market, and many old people in the countryside do not even have a bank account. Secondly, when people pay by card they spend more money because they do not see the money, and they will have debts. In addition, if the internet is broken, nobody can pay for anything. It happened in my city last year when a bank system stopped for one day. Finally, banks and companies know everything that people buy, which is bad for privacy.", vi: "Thân bài 2: bốn nhược điểm; khái quát quá (old people do not know); không liên hệ gì với đoạn trước." },
          { en: "In conclusion, a cashless society has both advantages and disadvantages. I think the advantages outweigh the disadvantages because it is more convenient and modern. People should learn to use new technology.", vi: "Kết bài: phán quyết xuất hiện lần đầu; lý do “modern” chưa hề được chứng minh; câu cuối lạc sang lời khuyên." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Bài mẫu band 7 (ước tính) — cùng đề, cùng các ý" },
      {
        t: "p",
        text: "Cùng những ý của bài trên, bớt đi bốn ý yếu, và thêm ==động tác cân==. Chữ in đậm trong phần chú thích là chỗ bạn nên mượn.",
      },
      {
        t: "examples",
        items: [
          { en: "In a growing number of countries, cards and phones are displacing notes and coins, to the point where some retailers refuse cash altogether. Although this shift creates genuine difficulties for certain groups, I would argue that its benefits are greater, chiefly because they are widely shared and lasting, whereas the drawbacks affect a minority and can largely be mitigated.", vi: "Mở bài: câu 1 phủ cả hai vế đề (displacing… / refuse cash altogether). Câu 2 = **nhượng bộ + phán quyết + hai thước đo** (quy mô · khắc phục được)." },
          { en: "The disadvantages should not be dismissed. The most serious is exclusion: elderly people, and those without a bank account, may find themselves unable to pay for basic goods where cash is refused. A second concern is that digital payment tends to weaken self-control. Because no money visibly leaves the wallet, shoppers are more likely to make impulse purchases and, in some cases, to run up debts. Such problems are real, but neither is beyond remedy. A legal duty on essential shops to accept cash, as several countries have introduced, would protect vulnerable customers, while banking apps that display spending in real time arguably give users more control over their budgets than a purse ever did.", vi: "Thân bài 1: **thừa nhận thật** (should not be dismissed · The most serious is…) → hai ý, mỗi ý có cơ chế (Because no money visibly leaves the wallet) → **Such problems are real, but neither is beyond remedy** → hai cách khắc phục cụ thể. Rào đón: may, tends to, in some cases, arguably." },
          { en: "The benefits, by contrast, reach almost everyone and are difficult to obtain in any other way. For consumers, the gain is speed and security: a stolen phone can be blocked within minutes, whereas stolen cash is simply gone. For small businesses, handling cash is costly, since it has to be counted, stored and taken to the bank, and removing that burden allows a market trader or café owner to devote more time to customers. For society as a whole, electronic records make it considerably harder to evade tax or conceal illegal income, which increases the funds available for public services.", vi: "Thân bài 2: câu chủ đề **cân** bằng đúng thước đo đã hứa (reach almost everyone). Ba tầng người hưởng lợi: consumers → small businesses → society — mỗi tầng một hệ quả cụ thể. that burden = quy chiếu." },
          { en: "On balance, therefore, I believe that the advantages of the move away from cash outweigh the disadvantages. This judgement holds, however, only as long as cash remains available to the minority who still depend on it.", vi: "Kết bài: phán quyết nhắc lại bằng lời khác + **điều kiện** — chính điều kiện này trả lời vế “some shops no longer accept cash at all”." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Bài band 6", "Bài band 7", "Động tác tạo khác biệt"],
        rows: [
          ["**TR**", "Bàn cả hai phía nhưng phán quyết chỉ có ở kết, lý do mới (“modern”); 8 ý không ý nào được phát triển; bỏ sót vế “no longer accept cash”", "Lập trường ở mở bài, chứng minh ở thân bài, nhắc lại ở kết kèm điều kiện; 5 ý đều có cơ chế + hệ quả", "Thesis có thước đo · câu giới hạn bên nhẹ · câu cân mở Thân bài 2"],
          ["**CC**", "Firstly / Secondly / Moreover / Furthermore / In addition / Finally — 8 từ nối đầu câu; hai đoạn không liên hệ", "by contrast, Such problems, A second concern, that burden, This judgement — nối bằng quy chiếu; đoạn 3 trả lời đoạn 2", "this / such + danh từ tóm tắt (Ngày 13) thay cho từ nối"],
          ["**LR**", "pay, money, people, shops lặp; bad for privacy; very convenient", "displacing, exclusion, impulse purchases, run up debts, beyond remedy, evade tax, conceal illegal income", "collocation của Bài 1 + danh hoá (exclusion, security)"],
          ["**GRA**", "Câu đơn + because / so; will / cannot tuyệt đối; ít lỗi nhưng đơn điệu", "Although…, whereas…; Because… ; quan hệ rút gọn; so sánh (than a purse ever did); rào đón đúng liều; không lỗi", "Mệnh đề nhượng bộ, đối lập, phân từ; may / tends to / arguably"],
        ],
      },
      {
        t: "note",
        title: "📌 Đếm trong bài band 7",
        items: [
          "**Rào đón**: may find · tends to · are more likely to · in some cases · arguably · largely — sáu chỗ, mỗi nhận định một lớp. (considerably thì ngược lại — từ ==tăng== mức độ, không phải rào.)",
          "**Quy chiếu thay từ nối**: this shift · Such problems · neither · that burden · This judgement.",
          "**Từ nối đầu câu**: chỉ có ==hai== (On balance, therefore). So với tám của bài band 6.",
          "**Từ vựng Bài 1**: impulse purchases · run up debts · vulnerable · devote… to · budgets.",
        ],
      },

      /* ── 10 ── */
      { t: "h", text: "10. Câu khung dùng lại cho mọi đề outweigh" },
      {
        t: "table",
        head: ["Vị trí", "Khung"],
        rows: [
          ["Mở bài — câu 1", "In a growing number of countries, [xu hướng], to the point where [mức cực đoan của đề]."],
          ["Mở bài — thesis", "Although this [shift / trend / practice] [bất lợi chính], I would argue that its benefits are greater, chiefly because [thước đo]."],
          ["Thân bài 1 — câu chủ đề", "The disadvantages should not be dismissed. The most serious is [danh từ]: …"],
          ["Thân bài 1 — ý 2", "A second concern is that [S + tend to + V]."],
          ["Thân bài 1 — giới hạn", "Such problems are real, but neither is beyond remedy. [Giải pháp 1] would…, while [giải pháp 2]…"],
          ["Thân bài 2 — câu cân", "The benefits, by contrast, [reach almost everyone / are permanent / cannot be obtained in any other way]."],
          ["Thân bài 2 — ba tầng", "For [individuals], … For [businesses / families], … For society as a whole, …"],
          ["Kết bài", "On balance, therefore, I believe that the advantages of [danh từ] outweigh the disadvantages. This judgement holds, however, only as long as [điều kiện]."],
        ],
        caption: "Nếu bạn chọn nhược điểm nặng hơn: đổi chỗ benefits ↔ drawbacks trong mọi khung, và kết: …the drawbacks are too serious to be justified by…",
      },
      { t: "rule", formula: "Such problems are real, but + neither is beyond remedy.  →  The benefits, by contrast, + V …", vi: "Hai câu bản lề của bài outweigh band 7: câu đóng Thân bài 1 và câu mở Thân bài 2." },

      /* ── 11 ── */
      { t: "h", text: "11. Tám lỗi giữ bài outweigh ở band 6.5 — bảng tự soát" },
      {
        t: "table",
        head: ["#", "Lỗi", "Sửa"],
        rows: [
          ["1", "Thesis trung lập với đề outweigh", "Nêu bên nặng hơn + lý do cân"],
          ["2", "Phán quyết đổi giữa chừng (mở bài nói ưu, kết bài nói “it depends”)", "Giữ một lập trường; điều kiện thì được, đổi phe thì không"],
          ["3", "3–4 ý mỗi đoạn, mỗi ý một câu", "2 ý, mỗi ý: nêu → cơ chế → hệ quả / ví dụ"],
          ["4", "Bên kia bị viết thành bù nhìn hoặc chỉ 40 từ", "≥ 70 từ, có “The most serious is…”"],
          ["5", "Không câu nào so sánh hai bên", "Câu giới hạn + câu by contrast"],
          ["6", "Lý do cân mới toanh ở kết bài", "Kết chỉ nhắc lại điều đã chứng minh"],
          ["7", "outweight · outweigh than · are outweigh", "A outweigh(s) B · B is outweighed by A"],
          ["8", "Mọi nhận định tuyệt đối: old people cannot, nobody can", "some / many, may, tend to, in some cases"],
        ],
      },
      {
        t: "mcq",
        id: "t4d14-viet-nhan-dien",
        title: "Nhận diện — 6 câu",
        items: [
          { q: "1. Which thesis best answers “Do the advantages outweigh the disadvantages?” at band 7?", options: ["This essay will examine both the advantages and the disadvantages of this trend.", "There are many advantages and disadvantages, and I will discuss them below.", "Although remote work can isolate employees, I would argue that its benefits are greater, mainly because they are permanent while the drawbacks can be managed.", "Remote work is a double-edged sword with pros and cons."], correct: 2, why: "C có nhượng bộ + phán quyết + thước đo (permanent ↔ can be managed). A, B trung lập; D sáo và không có lập trường." },
          { q: "2. Which sentence is grammatically correct?", options: ["The benefits far outweigh the risks.", "The benefits outweigh than the risks.", "The benefits are outweigh the risks.", "The benefits outweight the risks."], correct: 0, why: "outweigh + tân ngữ trực tiếp; trạng từ mức độ far đứng trước động từ." },
          { q: "3. “These risks are outweighed by the gains in safety.” The writer thinks:", options: ["the risks are more important.", "the gains in safety are more important.", "the two are equally important.", "it is impossible to say."], correct: 1, why: "B is outweighed by A = A nặng hơn B." },
          { q: "4. Which sentence shows real weighing?", options: ["There are three advantages and only two disadvantages.", "I think the advantages are better because it is modern.", "Both sides have good points.", "The drawbacks are temporary and affect few people, whereas the benefits are lasting and widely shared."], correct: 3, why: "D dùng hai thước đo (độ lâu dài, quy mô). A đếm số lượng; B lý do không liên quan; C không phán quyết." },
          { q: "5. Where should the side you find WEAKER normally go?", options: ["In the conclusion only", "In body paragraph 1, acknowledged fairly and then limited", "In body paragraph 2, as the last thing the reader sees", "Nowhere — it should be left out"], correct: 1, why: "Bên nhẹ đi trước, được thừa nhận thật rồi chỉ giới hạn; bên nặng ở Thân bài 2 để dẫn vào kết." },
          { q: "6. Which closing sentence is best for a band 7 essay?", options: ["In a nutshell, every coin has two sides.", "In conclusion, people should think carefully about this issue.", "On balance, the benefits outweigh the drawbacks, provided that vulnerable users are not left behind.", "To sum up, there are advantages and there are disadvantages."], correct: 2, why: "C nhắc lại phán quyết + điều kiện. A sáo; B và D không trả lời câu hỏi." },
        ],
      },

      /* ── 12 ── */
      { t: "h", text: "12. Viết bài — AI chấm 4 tiêu chí (40 phút mỗi bài)" },
      {
        t: "note",
        title: "💡 Cách học: viết bài 1 trước khi nhìn lại bài mẫu",
        items: [
          "**6 phút** dàn ý theo sáu bước ở mục 7 — tự chọn lập trường của bạn; không bắt buộc giống bài mẫu (bạn hoàn toàn có thể cho rằng nhược điểm nặng hơn).",
          "**28 phút** viết 290–330 từ. **6 phút** soát: thesis có thước đo chưa? có câu giới hạn + câu by contrast chưa? outweigh đúng ngữ pháp chưa? mỗi nhận định một lớp rào?",
          "Bài 2 là đề mới về tình nguyện — dùng từ vựng mục 4 của Bài 1.",
        ],
      },
      {
        t: "essay",
        id: "t4d14-viet-bai-1",
        task: "Task 2",
        prompt: "In many countries, cash is being replaced by card and mobile payments, and some shops no longer accept notes and coins at all. Do the advantages of this development outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Thesis: Although… , I would argue that… , chiefly because… (thước đo).",
          "Thân bài 1 = bên bạn cho là nhẹ hơn; kết đoạn bằng câu giới hạn.",
          "Thân bài 2 mở bằng “…, by contrast, …” + đúng thước đo đã nêu ở thesis.",
          "Kết: On balance… + only as long as / provided that…",
          "Soát outweigh: không than, không t, chia số ít / số nhiều.",
        ],
      },
      {
        t: "essay",
        id: "t4d14-viet-bai-2",
        task: "Task 2",
        prompt: "(Luyện thêm — đề mới, tự lập dàn ý) In some countries, secondary school students are required to do a fixed number of hours of unpaid community service before they can graduate. Do the advantages of this requirement outweigh the disadvantages? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        minWords: 250,
        tips: [
          "Đếm vế: unpaid · required (bắt buộc) · before they can graduate (điều kiện tốt nghiệp).",
          "Gợi ý ý: civic engagement, compassion, social cohesion, give something back ↔ thời gian học, tình nguyện bị ép thì còn là tình nguyện không, gánh nặng với học sinh phải đi làm thêm.",
          "Chọn thước đo: ai gánh (học sinh nhà nghèo)? lâu dài (thói quen cả đời)? khắc phục được (cho chọn hoạt động, giờ linh hoạt)?",
          "Dùng ít nhất 5 từ của Bài 1 mục 4.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NÓI ═══════════════════════════ */
  {
    id: "t4d14-noi",
    kind: "speaking",
    title: "Nói: Part 2 — kể một sự kiện ở band 7 (5 chặng, một khoảnh khắc, nhìn lại) + Part 3 nối tiếp",
    goal: "Nói trọn 2 phút về một sự kiện (buổi gây quỹ, lễ kỷ niệm, lễ hội) mà không gắng sức: có bối cảnh trước sự kiện, 2–3 mốc diễn biến, một khoảnh khắc quay chậm và một câu nhìn lại, dùng đúng quá khứ hoàn thành và 6–8 cụm ít gặp (in full swing, pull together, makeshift, go off without a hitch…); rồi trả lời 3–4 câu Part 3 về sự kiện công cộng theo kiểu cân lợi – hại; và lên – xuống giọng đúng khi liệt kê.",
    minutes: 80,
    blocks: [
      {
        t: "recap",
        items: [
          "Đề **Describe an event** đã học ở Tập 2 Ngày 15 (khung cơ bản) và Tập 3 Ngày 22 (bốn thì kể chuyện, đề a time when). Hôm nay là ==band 7==.",
          "Band 6 kể đúng trình tự: đầu tiên… sau đó… cuối cùng. Band 7 kể như ==người kể chuyện==: có bối cảnh, có lúc chậm lại ở một khoảnh khắc, có câu nhìn lại.",
          "Khung **5 chặng**: Dẫn → Bối cảnh → Diễn biến → Khoảnh khắc → Nhìn lại.",
          "LR band 7: “một số từ ít gặp và thành ngữ, có ý thức về văn phong” — hôm nay học 12 cụm tả sự kiện, cộng từ tình nguyện của Bài 1.",
          "Part 3 nối tiếp hỏi về **sự kiện công cộng và lễ hội** — dùng luôn động tác cân của Bài 2 (worth it, as long as…).",
          "🔊 **Ngữ điệu liệt kê**: lên ↗ ở từng mục, xuống ↘ ở mục cuối — sự kiện nào cũng có một danh sách để kể.",
        ],
      },

      /* ── 1 ── */
      { t: "h", text: "1. Từ band 6 lên band 7 khi kể một sự kiện" },
      {
        t: "table",
        head: ["", "Band 6", "Band 7"],
        rows: [
          ["**Mở**", "I want to talk about… It was last year.", "Dẫn + ==lý do sự kiện tồn tại== trong một câu (in the wake of…, to mark…)"],
          ["**Vai của mình**", "I was a volunteer. My job was…", "Bối cảnh bằng quá khứ hoàn thành: I'd volunteered for… · I'd been up since five"],
          ["**Diễn biến**", "Liệt kê đều tay mọi việc", "2–3 mốc; có ==một trục trặc== và cách xử lý"],
          ["**Chi tiết**", "There were many people. It was fun.", "Một khoảnh khắc quay chậm: ai, làm gì, mình thấy gì"],
          ["**Kết**", "I felt very happy. It was meaningful.", "Nhìn lại: Looking back, what's stayed with me is…"],
          ["**Độ dài**", "1 phút 10 – 1 phút 30, phải nghĩ thêm ý", "Đủ 2 phút, giám khảo phải ngắt"],
        ],
      },
      {
        t: "note",
        title: "📌 Vì sao “một trục trặc” lại quan trọng",
        items: [
          "Sự kiện suôn sẻ thì không có gì để kể: “everything went well” hết trong 5 giây.",
          "Một trục trặc nhỏ (mưa, mất điện, thiếu người, đến muộn) cho bạn ==lý do dùng nhiều thì== (had planned… but… ended up…), cho từ vựng xử lý tình huống, và cho cảm xúc đổi chiều.",
          "Không cần bịa lớn. Trục trặc thật, nhỏ, là đủ: loa hỏng, bánh chưa tới, người phát biểu quên giấy.",
        ],
      },

      /* ── 2 ── */
      { t: "h", text: "2. Khung 5 chặng cho 2 phút" },
      {
        t: "sodo",
        kind: "flow",
        title: "Describe an event — 5 chặng",
        steps: [
          { label: "1. Dẫn · 15 giây", sub: "Sự kiện gì, khi nào, ai tổ chức, để làm gì — một đến hai câu" },
          { label: "2. Bối cảnh · 20 giây", sub: "Vì sao mình có mặt, mình đã chuẩn bị gì: I'd volunteered… / I'd been + V-ing…" },
          { label: "3. Diễn biến · 40 giây", sub: "2–3 mốc theo thời gian; một trục trặc + cách xử lý" },
          { label: "4. Khoảnh khắc · 25 giây", sub: "Chậm lại ở MỘT cảnh: một người, một hành động, một cảm giác" },
          { label: "5. Nhìn lại · 20 giây", sub: "Kết quả + điều còn đọng lại: Looking back, … / What's stayed with me is…" },
        ],
        caption: "Bốn dòng gợi ý trên thẻ đề rơi vào chặng 1–3 và 5. Chặng 4 là phần bạn tự thêm — và là phần ăn điểm.",
      },
      {
        t: "table",
        head: ["Chặng", "Câu mở dùng được ngay", "Ghi chú 1 phút (từ khoá)"],
        rows: [
          ["1. Dẫn", "I'd like to talk about… I helped out at / went to… · It was organised by…, in the wake of / to mark / to celebrate…", "fun run · Oct · student union · floods"],
          ["2. Bối cảnh", "I wasn't actually…; I'd volunteered for… · I'd been up since… · We'd been planning it for…", "registration desk · IT · up at 5"],
          ["3. Diễn biến", "And then, about half an hour before…, · For a moment I thought… · But everyone… · By the time…, … had…", "rain + power cut · tarpaulin · by hand"],
          ["4. Khoảnh khắc", "But the moment I remember most came… · There was this… · I can still picture…", "last finisher · guard, 70s · crowd clapped"],
          ["5. Nhìn lại", "In the end, we… · Looking back, though, … · What's stayed with me isn't…, it's…", "60m dong · proudest"],
        ],
      },
      { t: "rule", formula: "Dẫn → Bối cảnh (had + V3) → Diễn biến + một trục trặc → Khoảnh khắc → Nhìn lại (Looking back, …)", vi: "Khung 5 chặng cho mọi đề sự kiện. Chặng 4 không có trên thẻ đề — tự thêm." },

      /* ── 3 ── */
      { t: "h", text: "3. Ngữ pháp kể chuyện band 7 — sáu khuôn" },
      {
        t: "p",
        text: "Tập 3 Ngày 22 đã dạy bốn thì kể chuyện (quá khứ đơn, tiếp diễn, hoàn thành, hoàn thành tiếp diễn). Band 7 cần dùng chúng ==trong cùng một câu== và thêm vài khuôn cho bước ngoặt.",
      },
      {
        t: "patterns",
        rows: [
          { formula: "S + had been + V-ing + (for / since …) + when + S + V2", vi: "Việc đang kéo dài thì bị cắt ngang.", examples: [{ en: "We'd been setting up for about two hours when the rain started.", vi: "Chúng tôi dựng đồ được khoảng hai tiếng thì trời bắt đầu mưa." }] },
          { formula: "S + was / were + about to + V + when + S + V2", vi: "Sắp làm thì có chuyện xảy ra.", examples: [{ en: "The mayor was about to give his speech when the microphone died.", vi: "Thị trưởng sắp phát biểu thì micro tắt." }] },
          { formula: "By the time + S + V2, + S + had + V3", vi: "Tới lúc A thì B đã xong.", examples: [{ en: "By the time the race was in full swing, the rain had eased off.", vi: "Tới lúc cuộc chạy vào guồng thì mưa đã ngớt." }] },
          { formula: "S + ended up + V-ing   ·   S + turned out to be + N / adj", vi: "Kết cục ngoài dự tính.", examples: [{ en: "I ended up checking people in by hand.", vi: "Rốt cuộc tôi phải ghi tên mọi người bằng tay." }, { en: "It turned out to be the best part of the day.", vi: "Hoá ra đó lại là phần hay nhất trong ngày." }] },
          { formula: "S + must / might + have + V3", vi: "Đoán về người hoặc việc lúc đó (ôn Ngày 13).", examples: [{ en: "He must have been well into his seventies.", vi: "Ông ấy hẳn đã ngoài bảy mươi khá xa." }] },
          { formula: "What's stayed with me + is / isn't + N   ·   Looking back, + S + V", vi: "Nhìn lại — câu chẻ của Ngày 7.", examples: [{ en: "Looking back, what's stayed with me isn't the money. It's how everyone pulled together.", vi: "Nhìn lại, điều đọng lại với tôi không phải là số tiền. Mà là cách mọi người chung tay." }] },
        ],
      },
      {
        t: "note",
        title: "⚠️ Người Việt hay sai khi kể",
        items: [
          "**Trượt về hiện tại** giữa chừng: ~~It rained in the morning so we are worried.~~ → we **were** worried. Kể quá khứ thì giữ quá khứ tới hết; chỉ câu nhìn lại mới về hiện tại.",
          "~~I was very exciting.~~ → I was **excited**; the event was **exciting**.",
          "~~My job was register the runners.~~ → My job was **to register** / was **registering**…",
          "~~in the central of Vietnam~~ → **in central Vietnam** / in the centre of Vietnam.",
          "~~At that time the rain stopped.~~ khi muốn nói “tới lúc đó đã tạnh” → **By then** the rain **had stopped**.",
          "~~I joined the event.~~ → **took part in** / **went to** / **helped out at** the event. (join a club / a team / a queue.)",
          "Lạm dụng **very + tính từ**: very happy, very meaningful → thrilled, moving, heartwarming; hoặc tả việc làm mình vui thay vì gọi tên cảm xúc.",
        ],
      },
      {
        t: "quiz",
        id: "t4d14-noi-ke-dich",
        kind: "translate",
        title: "Dịch sang tiếng Anh — khuôn kể chuyện (5 câu)",
        grammar: "had been V-ing when · was about to… when · By the time…, had V3 · ended up V-ing · turned out to be",
        items: [
          { q: "1. Chúng tôi đợi được một tiếng thì xe buýt tới.", answers: ["We had been waiting for an hour when the bus arrived.", "We'd been waiting for an hour when the bus arrived.", "We had been waiting for an hour when the bus came.", "We'd been waiting for an hour when the bus came."], hint: "had been waiting … when" },
          { q: "2. Tôi sắp rời đi thì nhạc bắt đầu.", answers: ["I was about to leave when the music started.", "I was about to leave when the music began."], hint: "was about to … when" },
          { q: "3. Tới lúc chúng tôi đến thì buổi lễ đã kết thúc.", answers: ["By the time we arrived, the ceremony had finished.", "By the time we arrived, the ceremony had ended.", "By the time we got there, the ceremony had finished.", "By the time we got there, the ceremony had ended."], hint: "By the time … had finished" },
          { q: "4. Rốt cuộc chúng tôi phải đi bộ về nhà.", answers: ["We ended up walking home."], hint: "ended up + V-ing" },
          { q: "5. Hoá ra đó là một thành công lớn.", answers: ["It turned out to be a great success.", "It turned out to be a big success.", "It turned out to be a huge success."], hint: "turned out to be" },
        ],
      },

      /* ── 4 ── */
      { t: "h", text: "4. Mười hai cụm ít gặp để tả một sự kiện (vẫn là lời nói tự nhiên)" },
      {
        t: "vocab",
        items: [
          { w: "turnout", pos: "n", ipa: "/ˈtɜːnaʊt/", vi: "số người tới dự", ex: "The turnout was far better than we'd expected.", exVi: "Số người tới dự cao hơn nhiều so với chúng tôi mong đợi.", more: "a good / poor / record **turnout** · turn out (v): Hundreds turned out." },
          { w: "electric", pos: "adj", ipa: "/ɪˈlektrɪk/", vi: "(không khí) sôi sục, phấn khích", ex: "When the band came on, the atmosphere was electric.", exVi: "Khi ban nhạc bước ra, không khí sôi sục hẳn.", more: "the atmosphere was **electric** / buzzing / relaxed / a bit flat" },
          { w: "in full swing", pos: "idiom", ipa: "/ɪn ˌfʊl ˈswɪŋ/", vi: "đang vào guồng, rộn ràng nhất", ex: "By nine o'clock the party was in full swing.", exVi: "Tới chín giờ thì bữa tiệc đã vào guồng.", more: "be / get **in full swing** — không đổi thành ~~in the full swing~~" },
          { w: "go off without a hitch", pos: "idiom", ipa: "/ɡəʊ ˌɒf wɪðaʊt ə ˈhɪtʃ/", vi: "diễn ra trót lọt, không trục trặc", ex: "Despite the rain, the ceremony went off without a hitch.", exVi: "Dù mưa, buổi lễ vẫn diễn ra trót lọt.", more: "hitch (n) = trục trặc nhỏ: a last-minute hitch · phủ định cũng hay: It didn't exactly go off without a hitch." },
          { w: "behind the scenes", pos: "phrase", ipa: "/bɪˌhaɪnd ðə ˈsiːnz/", vi: "ở hậu trường, phía sau", ex: "I was working behind the scenes, sorting out the sound system.", exVi: "Tôi làm ở hậu trường, lo hệ thống âm thanh.", more: "work **behind the scenes** · a behind-the-scenes look" },
          { w: "makeshift", pos: "adj", ipa: "/ˈmeɪkʃɪft/", vi: "tạm bợ, dựng tạm", ex: "We put up a makeshift stage out of wooden pallets.", exVi: "Chúng tôi dựng tạm một sân khấu bằng pa-lét gỗ.", more: "a **makeshift** shelter / stage / desk" },
          { w: "pull together", pos: "phr v", ipa: "/ˌpʊl təˈɡeðə/", vi: "chung tay, đồng lòng", ex: "When the power went off, everyone just pulled together.", exVi: "Khi mất điện, mọi người cứ thế chung tay.", more: "pull together **as a team / community** · ≠ pull yourself together (trấn tĩnh lại)" },
          { w: "call it off", pos: "phr v", ipa: "/ˌkɔːl ɪt ˈɒf/", vi: "huỷ (sự kiện)", ex: "For a moment I thought we'd have to call it off.", exVi: "Có lúc tôi tưởng chúng tôi sẽ phải huỷ.", more: "call off a match / a wedding / a strike · trang trọng: cancel" },
          { w: "the highlight", pos: "n", ipa: "/ðə ˈhaɪlaɪt/", vi: "điểm nhấn, phần hay nhất", ex: "For me, the highlight was the lantern parade at the end.", exVi: "Với tôi, điểm nhấn là màn rước đèn cuối buổi.", more: "**the highlight of** the evening / the trip · highlight (v) = nêu bật" },
          { w: "low-key", pos: "adj", ipa: "/ˌləʊ ˈkiː/", vi: "giản dị, không phô trương", ex: "It was a low-key celebration, just family and a few neighbours.", exVi: "Đó là một buổi mừng giản dị, chỉ có gia đình và vài người hàng xóm.", more: "a **low-key** event / wedding / approach · ≠ lavish, extravagant (Bài 1)" },
          { w: "heartwarming", pos: "adj", ipa: "/ˈhɑːtwɔːmɪŋ/", vi: "ấm lòng", ex: "It was heartwarming to see complete strangers helping each other.", exVi: "Thật ấm lòng khi thấy những người hoàn toàn xa lạ giúp nhau.", more: "a **heartwarming** story / sight · gần nghĩa: moving, touching" },
          { w: "get to someone", pos: "phr v", ipa: "/ˈɡet tə ˌsʌmwʌn/", vi: "làm ai xúc động (hoặc bực)", ex: "I'm not usually sentimental, but that really got to me.", exVi: "Tôi vốn không hay uỷ mị, nhưng cảnh đó làm tôi xúc động thật.", more: "It **got to me**. — khẩu ngữ, chỉ dùng khi nói" },
        ],
      },
      {
        t: "quiz",
        id: "t4d14-noi-cum",
        kind: "fill",
        title: "Điền MỘT từ để hoàn chỉnh cụm (8 câu)",
        items: [
          { q: "1. By the time we arrived, the festival was in full ___ .", answers: ["swing"], hint: "in full ___" },
          { q: "2. Amazingly, the whole evening went off without a ___ .", answers: ["hitch"], hint: "without a ___" },
          { q: "3. More than five hundred people came — a record ___ . (số người tới dự)", answers: ["turnout"], hint: "một từ viết liền" },
          { q: "4. The stage collapsed, but everyone ___ together and rebuilt it in an hour. (quá khứ)", answers: ["pulled"], hint: "pull together" },
          { q: "5. With the storm coming, the organisers decided to call the concert ___ .", answers: ["off"], hint: "call … off" },
          { q: "6. I spent the whole day behind the ___, so I hardly saw the show.", answers: ["scenes"], hint: "behind the ___" },
          { q: "7. We sold tickets from a ___ desk made of two boxes and a door. (dựng tạm)", answers: ["makeshift"], hint: "tính từ" },
          { q: "8. The ___ of the night was definitely the fireworks. (điểm nhấn)", answers: ["highlight"], hint: "the ___ of" },
        ],
      },

      /* ── 5 ── */
      { t: "h", text: "5. Đề 1 — một sự kiện cộng đồng / từ thiện: band 6 và band 7" },
      {
        t: "table",
        head: ["Thẻ đề (cue card)"],
        rows: [
          ["**Describe a community or charity event that you took part in.** You should say: **what** the event was · **where and when** it took place · **what you did** there · and explain **why you remember it**."],
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ghi chú 1 phút — chỉ từ khoá",
        center: "Charity fun run",
        branches: [
          { label: "1. Dẫn", items: ["last Oct · campus", "student union", "floods → families"] },
          { label: "2. Bối cảnh", items: ["registration desk", "IT → spreadsheet", "up at 5"] },
          { label: "3. Diễn biến", items: ["rain + power cut", "makeshift shelter", "by hand · 300"] },
          { label: "4. Khoảnh khắc", items: ["last finisher", "guard · 70s", "crowd clapped"] },
          { label: "5. Nhìn lại", items: ["60m dong · double", "everything wrong → proudest"] },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 6 (ước tính) — khoảng 1 phút 10 giây",
        lines: [
          { who: "Candidate", role: "candidate", text: "I want to talk about a charity run at my university. It was last year in October. The student union organised it because there was a big flood in the central of Vietnam and we wanted to help people there. I was a volunteer. My job was register the runners. I used my laptop to check their names and gave them a number. There were about three hundred people. It rained in the morning so we are worried, but after that the rain stopped. Everybody ran five kilometres around the campus. After the run we had some music and food. We collected a lot of money, I think about sixty million dong. I remember it because it was very meaningful and I felt very happy. I think it was a good event and I want to join again.", vi: "Đúng đề, dễ hiểu, đúng trình tự. Nhưng: dừng ở 1 phút 10; mọi câu đều là câu đơn quá khứ đơn; ba lỗi (in the central of · was register · we are worried); cảm xúc chỉ được gọi tên (very meaningful, very happy); không có cảnh nào người nghe nhìn thấy được." },
        ],
      },
      {
        t: "dialogue",
        title: "Bài nói band 7 (ước tính) — khoảng 2 phút",
        lines: [
          { who: "Candidate", role: "candidate", text: "I'd like to talk about a charity fun run I helped out at last October. It was organised by the student union at my university, in the wake of some pretty devastating floods in central Vietnam, and the idea was to raise money for families who'd lost their homes.", vi: "Tôi muốn kể về một cuộc chạy gây quỹ mà tôi phụ giúp hồi tháng Mười năm ngoái. Hội sinh viên trường tôi tổ chức, sau những trận lũ khá tàn khốc ở miền Trung, với mục đích quyên tiền cho các gia đình mất nhà." },
          { who: "Candidate", role: "candidate", text: "I wasn't actually running. I'd volunteered for the registration desk, mainly because I'm an IT student and somebody had to deal with the spreadsheet. So I'd been up since about five, setting up tables, checking the laptops, printing name tags, that sort of thing.", vi: "Thật ra tôi không chạy. Tôi đã xung phong làm bàn đăng ký, chủ yếu vì tôi học IT và phải có người lo cái bảng tính. Nên tôi dậy từ khoảng năm giờ, kê bàn, kiểm tra laptop, in thẻ tên, đại loại vậy." },
          { who: "Candidate", role: "candidate", text: "And then, about half an hour before the start, two things went wrong at once. It started pouring with rain, and the power went off in the whole building. For a moment I honestly thought we'd have to call it off. But everyone just pulled together. We moved the desk under a makeshift shelter, basically a tarpaulin and four bamboo poles, and I ended up checking people in by hand, on paper, with a queue of three hundred runners in front of me.", vi: "Rồi khoảng nửa tiếng trước giờ xuất phát, hai chuyện hỏng cùng lúc. Trời đổ mưa to, và cả toà nhà mất điện. Có lúc tôi thật sự nghĩ phải huỷ. Nhưng mọi người cứ thế chung tay. Chúng tôi dời bàn vào dưới một cái lán dựng tạm, về cơ bản là tấm bạt với bốn cây tre, và rốt cuộc tôi ghi tên mọi người bằng tay, trên giấy, trước mặt là hàng ba trăm người chạy." },
          { who: "Candidate", role: "candidate", text: "By the time the race was in full swing, the rain had eased off, and the atmosphere was electric. There were students, lecturers, little kids, even a few dogs.", vi: "Tới lúc cuộc chạy vào guồng thì mưa đã ngớt, và không khí sôi sục. Có sinh viên, giảng viên, trẻ nhỏ, thậm chí vài chú chó." },
          { who: "Candidate", role: "candidate", text: "But the moment I remember most came right at the end. The last person to cross the line was a man who must have been well into his seventies, one of the security guards from our dormitory, as it turned out. He was walking by then, not running, and the entire crowd lined up on both sides and clapped him in. I'm not usually sentimental, but that got to me.", vi: "Nhưng khoảnh khắc tôi nhớ nhất đến đúng lúc cuối. Người cuối cùng về đích là một ông hẳn đã ngoài bảy mươi khá xa, hoá ra là một bác bảo vệ ký túc xá của chúng tôi. Lúc đó bác đi bộ chứ không chạy nữa, và cả đám đông xếp hai bên vỗ tay đón bác về. Tôi vốn không uỷ mị, nhưng cảnh đó làm tôi xúc động." },
          { who: "Candidate", role: "candidate", text: "In the end we raised around sixty million dong, which was more than double what we'd hoped for. Looking back, though, what's stayed with me isn't the money. It's that a morning when almost everything went wrong turned out to be the one I'm proudest of.", vi: "Cuối cùng chúng tôi quyên được khoảng sáu mươi triệu đồng, hơn gấp đôi mức mong đợi. Nhưng nhìn lại, điều đọng lại với tôi không phải số tiền. Mà là một buổi sáng gần như mọi thứ đều hỏng lại hoá ra là buổi sáng tôi tự hào nhất." },
        ],
      },
      {
        t: "table",
        head: ["Tiêu chí", "Band 6", "Band 7", "Chỗ tạo khác biệt"],
        rows: [
          ["**FC**", "1 phút 10; câu rời, nối bằng and / but / after that", "2 phút, đủ 5 chặng; And then… · For a moment… · By the time… · In the end… · Looking back, though…", "Khung 5 chặng + dấu mốc thời gian"],
          ["**LR**", "big flood · a lot of money · very meaningful · very happy", "in the wake of · devastating · call it off · pulled together · makeshift · in full swing · eased off · electric · got to me", "9 cụm ít gặp, đều là lời nói tự nhiên"],
          ["**GRA**", "Quá khứ đơn; 3 lỗi (was register · are worried · in the central of)", "I'd volunteered · I'd been up · had eased off · what we'd hoped for · must have been · ended up checking · what's stayed with me isn't… It's that…", "Quá khứ hoàn thành, modal + have, câu chẻ — không lỗi"],
          ["**P**", "Đều giọng; liệt kê không lên xuống", "students ↗, lecturers ↗, little kids ↗, even a few dogs ↘ · nhấn tương phản: walking, not running", "Ngữ điệu liệt kê (mục 8)"],
        ],
      },
      {
        t: "note",
        title: "💡 Mẹo: biến câu chuyện này thành câu trả lời cho đề khác",
        items: [
          "**Describe a time when you worked in a team** ⇒ giữ chặng 3 (mất điện, chung tay), kết: what I learned about teamwork.",
          "**Describe a time when something went wrong** ⇒ mở thẳng bằng chặng 3.",
          "**Describe a person you admire** ⇒ bác bảo vệ ở chặng 4 thành nhân vật chính.",
          "**Describe something you did to help others** ⇒ nguyên bài, đổi câu dẫn.",
          "Đây là “kho 5 câu chuyện” đã nói ở Tập 2 Ngày 23: một chuyện thật, kể kỹ, dùng được cho 4–5 đề.",
        ],
      },

      /* ── 6 ── */
      { t: "h", text: "6. Đề 2 — một dịp mừng / lễ kỷ niệm: tự dựng theo khung" },
      {
        t: "table",
        head: ["Thẻ đề (cue card)"],
        rows: [
          ["**Describe a celebration or special occasion that you remember well.** You should say: **what** was being celebrated · **who** was there · **what happened** · and explain **why it was memorable**."],
        ],
      },
      {
        t: "table",
        head: ["Chặng", "Ví dụ: mừng thọ 80 tuổi của bà", "Cụm nên dùng"],
        rows: [
          ["1. Dẫn", "My grandmother's eightieth birthday, two summers ago, at her house in the countryside", "to mark · a low-key celebration"],
          ["2. Bối cảnh", "She'd always said she didn't want a fuss; my aunts had been planning it in secret for weeks", "She'd always said… · had been planning"],
          ["3. Diễn biến", "Forty relatives; the cake hadn't arrived; my cousin drove an hour to fetch it; lunch in the yard", "was about to… when · ended up · a last-minute hitch"],
          ["4. Khoảnh khắc", "Her youngest great-grandchild sang a folk song she used to sing; she went completely quiet", "I can still picture… · that got to me"],
          ["5. Nhìn lại", "It was the last time the whole family was together; I'm glad nobody listened to her about “no fuss”", "Looking back, · it turned out to be · heartwarming"],
        ],
        caption: "Tự điền chuyện THẬT của bạn vào cột giữa trước khi ghi âm ở mục 9.",
      },

      /* ── 7 ── */
      { t: "h", text: "7. Part 3 nối tiếp — sự kiện công cộng, lễ hội, tiền và công nghệ" },
      {
        t: "table",
        head: ["Câu hỏi", "Kiểu câu hỏi", "Khung trả lời"],
        rows: [
          ["Why do people enjoy going to large public events?", "Lý do", "2 lý do thuộc 2 góc (tâm lý · xã hội) + ví dụ: I think part of it is… But there's also…"],
          ["Are traditional festivals as important to young people as they were to their grandparents?", "So sánh hai nhóm / hai thời", "Trả lời có mức độ → ông bà (used to / would) → người trẻ (tend to) → nhận xét: the form has changed more than the meaning"],
          ["Is it worth cities spending large sums on big public events?", "Đánh giá — cân lợi – hại", "It depends what it's weighed against → lợi → hại → phán quyết + điều kiện (as long as…)"],
          ["How has technology changed the way people experience events?", "Thay đổi", "Trước ↔ nay; một mặt… mặt khác…: more people can watch, but fewer are really present"],
          ["Do you think live events will still matter in the future?", "Dự đoán (ôn Ngày 7)", "Mức chắc chắn + căn cứ + điều kiện: I'd be surprised if… ; if anything, …"],
        ],
      },
      {
        t: "dialogue",
        title: "Cùng một câu hỏi — band 6 rồi band 7",
        lines: [
          { who: "Examiner", role: "examiner", text: "Is it worth cities spending large sums of money on big public events?", vi: "Các thành phố chi những khoản lớn cho sự kiện công cộng lớn thì có đáng không?" },
          { who: "Candidate (band 6)", role: "a", text: "Yes, I think it is worth. Big events are good for the city because many tourists come and they spend money. It also makes people happy. But sometimes it is expensive and the government should spend money for other things like hospitals. So I think it has both good and bad points.", vi: "Có ý, có hai phía — nhưng: “it is worth” thiếu it; spend money for; kết “both good and bad points” không trả lời câu hỏi; không có mức độ, không có điều kiện." },
          { who: "Candidate (band 7)", role: "candidate", text: "I think it depends what the money's being weighed against, really. Events like a big festival or a marathon do tend to bring in tourists, and they give local businesses a boost, at least for a few days. But I'd say the more lasting benefit is less visible: they bring people together who'd otherwise never meet, and in a big city that's worth quite a lot.", vi: "Tôi nghĩ còn tuỳ số tiền đó được đặt lên cân với cái gì. Sự kiện như lễ hội lớn hay giải marathon quả là thường kéo khách du lịch tới, và giúp doanh nghiệp địa phương khởi sắc, ít ra trong vài ngày. Nhưng tôi cho rằng lợi ích lâu dài hơn thì khó thấy hơn: chúng đưa những người vốn chẳng bao giờ gặp nhau lại gần nhau, và ở một thành phố lớn điều đó đáng giá khá nhiều." },
          { who: "Candidate (band 7)", role: "candidate", text: "That said, if a city's struggling to fund basic things like schools or public transport, then a week-long firework festival is pretty hard to justify. So on balance, yes, I think it's worth it, as long as it's something residents actually take part in, and not just a show put on for visitors.", vi: "Dù vậy, nếu một thành phố đang chật vật lo những thứ cơ bản như trường học hay giao thông công cộng, thì một lễ hội pháo hoa kéo dài cả tuần khá khó biện minh. Nên cân lại thì có, tôi nghĩ là đáng, miễn đó là thứ người dân thật sự tham gia, chứ không chỉ là màn trình diễn dựng lên cho du khách." },
        ],
      },
      {
        t: "note",
        title: "📌 Câu band 7 làm được gì",
        items: [
          "**Mở bằng thước đo**: it depends what the money's being weighed against — đúng động tác cân của Bài 2.",
          "**Rào đón**: do tend to · at least for a few days · I'd say · pretty hard to justify (Ngày 13).",
          "**Hai lợi ích khác tầng**: kinh tế (ngắn hạn) ↔ gắn kết (lâu dài).",
          "**That said,** — discourse marker nhượng bộ của văn nói (văn viết: Nevertheless).",
          "**Phán quyết + điều kiện**: on balance, yes… as long as…",
          "Ngữ pháp đúng của worth: **It's worth it.** / It's worth **spending** money on. / It's worth **the money**. (⚠️ ~~It is worth.~~ · ~~worth to spend~~)",
        ],
      },
      { t: "rule", formula: "It depends what … is weighed against → lợi 1 (ngắn hạn) + lợi 2 (lâu dài) → That said, … → So on balance, …, as long as …", vi: "Khung trả lời câu hỏi đánh giá “Is it worth…?” ở Part 3 — 40 đến 50 giây." },
      {
        t: "mcq",
        id: "t4d14-noi-chon",
        title: "Kiểm tra — kể sự kiện và Part 3 (6 câu)",
        items: [
          { q: "1. Which sentence gives BACKGROUND (chặng 2) correctly?", options: ["I volunteer for the registration desk and I am up since five.", "I'd volunteered for the registration desk, so I'd been up since five.", "I have volunteered for the registration desk yesterday.", "I was volunteer the registration desk since five."], correct: 1, why: "Bối cảnh trước mốc chính của chuyện ⇒ quá khứ hoàn thành: I'd volunteered · I'd been up." },
          { q: "2. “By the time the race was in full swing, the rain ___ .”", options: ["eases off", "has eased off", "was easing off since", "had eased off"], correct: 3, why: "By the time + quá khứ đơn, mệnh đề chính quá khứ hoàn thành." },
          { q: "3. Which is the best “moment” (chặng 4)?", options: ["There were many people and everybody was happy.", "The event was very meaningful for me.", "The last person across the line was a guard in his seventies, and the whole crowd clapped him in.", "After that we had music and food."], correct: 2, why: "Khoảnh khắc = một người + một hành động cụ thể mà người nghe hình dung được. A, B gọi tên cảm xúc; D là liệt kê." },
          { q: "4. Which sentence is correct?", options: ["I ended up checking people in by hand.", "I ended up to check people in by hand.", "I was very exciting about the race.", "I joined in the central of Vietnam."], correct: 0, why: "end up + V-ing. C: excited; D: in central Vietnam." },
          { q: "5. Which is correct?", options: ["I think it is worth.", "It's worth to spend the money.", "It's worth for the money.", "I think it's worth it."], correct: 3, why: "worth cần tân ngữ: worth it / worth the money / worth spending." },
          { q: "6. In Part 3, “That said, …” is used to", options: ["add a similar point.", "introduce a point that limits what you have just said.", "give an example.", "end your answer."], correct: 1, why: "That said = dù vậy — nhượng bộ, giới hạn điều vừa nói." },
        ],
      },

      /* ── 8 ── */
      { t: "h", text: "8. Phát âm: ngữ điệu liệt kê" },
      {
        t: "p",
        text: "Khi liệt kê, người bản ngữ ==lên giọng ↗ ở mỗi mục== để báo “còn nữa”, và ==xuống giọng ↘ ở mục cuối== để báo “hết rồi”. Người Việt hay đọc đều hoặc xuống giọng ở mọi mục — người nghe tưởng câu đã hết sau mục đầu, và bài nói nghe như đọc danh sách. Trong bài band 7 ở mục 5: students ↗, lecturers ↗, little kids ↗, even a few dogs ↘.",
      },
      {
        t: "table",
        head: ["Kiểu danh sách", "Ngữ điệu", "Ví dụ", "Người nghe hiểu"],
        rows: [
          ["**Đóng** — đã kể hết", "↗ · ↗ · ↗ · and ↘", "music ↗, food ↗, dancing ↗ and fireworks ↘", "danh sách trọn vẹn, có bốn thứ"],
          ["**Mở** — còn nữa", "↗ · ↗ · ↗ …", "setting up tables ↗, checking the laptops ↗, printing name tags ↗, that sort of thing", "còn nhiều việc tương tự"],
          ["**Liệt kê hành động**", "↗ sau mỗi cụm động từ, ↘ ở cụm cuối", "I set up the tables ↗, checked the laptops ↗ and printed the name tags ↘", "ba việc theo thứ tự"],
          ["**Mục cuối bất ngờ**", "ngắt nhẹ trước mục cuối, nhấn mạnh rồi ↘", "students ↗, lecturers ↗, little kids ↗ | even a few DOGS ↘", "mục cuối là điều thú vị nhất"],
        ],
      },
      {
        t: "note",
        title: "💡 Cách luyện",
        items: [
          "Đếm ngón tay: mỗi mục một ngón, giọng ==đi lên== theo ngón; tới ngón cuối thì ==hạ tay, hạ giọng==.",
          "Ngắt một nhịp rất ngắn sau mỗi dấu phẩy — đừng dính các mục vào nhau.",
          "**and** trước mục cuối đọc yếu /ən/, không nhấn.",
          "Thu âm câu 1 và 5 ở dưới, nghe lại: nếu ba mục đầu nghe giống nhau và mục cuối nghe khác, bạn đã làm đúng.",
        ],
      },
      { t: "rule", formula: "mục 1 ↗ , mục 2 ↗ , mục 3 ↗ and mục cuối ↘", vi: "Lên giọng = còn nữa; xuống giọng = hết. Danh sách mở (… that sort of thing) thì mục nào cũng lên." },
      {
        t: "phatam",
        id: "t4d14-phat-am",
        title: "Luyện phát âm — ngữ điệu liệt kê",
        note: "Lên giọng ở mỗi mục trước dấu phẩy, xuống giọng ở mục cuối. Máy chấm độ chính xác từng từ; ngữ điệu bạn tự nghe lại bằng nút phát lại.",
        items: [
          { text: "We had runners, walkers, children and even a few dogs.", ipa: "wi hæd rʌnəz wɔːkəz tʃɪldrən ənd iːvn ə fjuː dɒɡz", vi: "Chúng tôi có người chạy, người đi bộ, trẻ em và thậm chí vài chú chó." },
          { text: "I set up the tables, checked the laptops and printed the name tags.", ipa: "aɪ set ʌp ðə teɪblz tʃekt ðə læptɒps ənd prɪntɪd ðə neɪm tæɡz", vi: "Tôi kê bàn, kiểm tra laptop và in thẻ tên." },
          { text: "There was music, food, dancing and fireworks.", ipa: "ðeə wəz mjuːzɪk fuːd dɑːnsɪŋ ənd faɪəwɜːks", vi: "Có nhạc, đồ ăn, nhảy múa và pháo hoa." },
          { text: "People came on foot, by bike and by bus.", ipa: "piːpl keɪm ɒn fʊt baɪ baɪk ənd baɪ bʌs", vi: "Người ta đi bộ, đi xe đạp và đi xe buýt tới." },
          { text: "It was hot, crowded, noisy and absolutely wonderful.", ipa: "ɪt wəz hɒt kraʊdɪd nɔɪzi ənd æbsəluːtli wʌndəfl", vi: "Trời nóng, đông, ồn và tuyệt vời vô cùng." },
          { text: "You need time, money, volunteers and a lot of patience.", ipa: "ju niːd taɪm mʌni vɒləntɪəz ənd ə lɒt əv peɪʃns", vi: "Bạn cần thời gian, tiền, tình nguyện viên và rất nhiều kiên nhẫn." },
          { text: "We raised money for food, blankets and medicine.", ipa: "wi reɪzd mʌni fə fuːd blæŋkɪts ənd medsn", vi: "Chúng tôi quyên tiền mua thức ăn, chăn và thuốc." },
          { text: "Festivals bring in tourists, create jobs and keep traditions alive.", ipa: "festɪvlz brɪŋ ɪn tʊərɪsts krieɪt dʒɒbz ənd kiːp trədɪʃnz əlaɪv", vi: "Lễ hội kéo khách du lịch tới, tạo việc làm và giữ cho truyền thống sống mãi." },
        ],
      },
      {
        t: "mcq",
        id: "t4d14-noi-ngu-dieu",
        title: "Ngữ điệu liệt kê — chọn phương án đúng (5 câu)",
        items: [
          { q: "1. “There was music, food, dancing and fireworks.” Giọng XUỐNG ở từ nào?", options: ["music", "food", "dancing", "fireworks"], correct: 3, why: "Mục cuối của danh sách đóng ⇒ xuống giọng." },
          { q: "2. Người nói lên giọng ở MỌI mục: “tables ↗, laptops ↗, name tags ↗…”. Người nghe hiểu:", options: ["Danh sách đã hết.", "Còn những thứ khác nữa.", "Người nói đang hỏi.", "Người nói tức giận."], correct: 1, why: "Không có lần xuống giọng nào ⇒ danh sách mở, còn nữa." },
          { q: "3. Từ “and” trước mục cuối đọc thế nào?", options: ["Yếu: /ən/, không nhấn", "Mạnh: /ænd/, nhấn rõ", "Bỏ hẳn", "Kéo dài và lên giọng"], correct: 0, why: "and là từ chức năng, đọc yếu; trọng âm rơi vào mục cuối." },
          { q: "4. Lỗi ngữ điệu phổ biến nhất của người Việt khi liệt kê:", options: ["Lên giọng ở mục cuối", "Nói quá nhanh", "Xuống giọng ở mọi mục, nghe như bốn câu rời", "Nhấn từ and"], correct: 2, why: "Xuống giọng sau mỗi mục làm người nghe tưởng câu đã hết." },
          { q: "5. Muốn mục cuối gây bất ngờ (“even a few dogs”), bạn nên:", options: ["đọc nó nhỏ và nhanh hơn", "lên giọng ở nó", "bỏ từ even", "ngắt nhẹ trước nó, nhấn dogs rồi xuống giọng"], correct: 3, why: "Ngắt + nhấn + xuống giọng làm mục cuối nổi lên." },
        ],
      },

      /* ── 9 ── */
      { t: "h", text: "9. Luyện nói — ghi âm, AI chấm 4 tiêu chí" },
      {
        t: "note",
        title: "💡 Cách luyện: 1 phút ghi chú — 2 phút nói — nghe lại",
        items: [
          "Mỗi thẻ đề: bấm giờ **1 phút** ghi 5 dòng từ khoá theo 5 chặng (không viết câu). Rồi nói **đủ 2 phút**.",
          "Nghe lại, tự đánh dấu: có bối cảnh bằng had + V3 không? có một khoảnh khắc không? có câu Looking back không? dùng được mấy cụm của mục 4?",
          "Kể chuyện ==thật== của bạn. Chuyện thật mới có chi tiết.",
          "Part 3: mỗi câu 40–50 giây. Câu “Is it worth…?” phải có phán quyết + điều kiện.",
        ],
      },
      {
        t: "speak",
        id: "t4d14-noi-su-kien",
        part: "2",
        questions: [
          "Describe a community or charity event that you took part in. You should say: what the event was; where and when it took place; what you did there; and explain why you remember it.",
        ],
      },
      {
        t: "speak",
        id: "t4d14-noi-dip-mung",
        part: "2",
        questions: [
          "Describe a celebration or special occasion that you remember well. You should say: what was being celebrated; who was there; what happened; and explain why it was memorable.",
        ],
      },
      {
        t: "speak",
        id: "t4d14-noi-part3",
        part: "3",
        questions: [
          "Why do people enjoy going to large public events?",
          "Are traditional festivals as important to young people as they were to their grandparents?",
          "Is it worth cities spending large sums of money on big public events?",
          "How has technology changed the way people experience events such as concerts or festivals?",
        ],
      },
      {
        t: "note",
        title: "📌 Ghi vào sổ Speaking",
        items: [
          "Chép lại bài nói 2 phút của bạn (từ bản ghi âm), gạch chân mọi động từ: có bao nhiêu thì khác nhau?",
          "Ngày mai tự đóng vai giám khảo hỏi lại chính câu chuyện đó dưới một đề khác (mẹo ở cuối mục 5).",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP NGÀY 14 ═══════════════════════════ */
  {
    id: "t4d14-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 14 — AWL sublist 9 · tình nguyện · tiền bạc & tiêu dùng · câu cân “outweigh” · kể sự kiện · ngữ điệu liệt kê",
    goal: "Ôn trọn Ngày 14: dùng đúng từ AWL sublist 9 và họ từ của chúng, từ vựng tình nguyện và tiền bạc vòng 2, phân biệt các cặp dễ nhầm (assure / ensure, device / devise, economic / economical), viết đúng ngữ pháp của outweigh và nhận ra câu cân thật, dùng đúng thì khi kể một sự kiện, và lên – xuống giọng đúng khi liệt kê — 54 câu có đáp án và một thân bài AI chấm.",
    minutes: 70,
    blocks: [
      {
        t: "recap",
        items: [
          "54 câu, 9 phần + một đoạn viết. Làm một mạch rồi chấm.",
          "Phần I–VI ôn **Bài 1** (từ vựng); phần VII ôn **Bài 2** (viết); phần VIII–IX ôn **Bài 3** (nói, ngữ điệu); phần X viết một thân bài “bên nhẹ hơn”.",
          "Mốc đạt: ==mỗi phần ≥ 70 %==. Dưới mốc ⇒ mở lại đúng mục ghi ở tiêu đề phần đó, che nghĩa tự kiểm lại nhóm từ.",
        ],
      },
      {
        t: "sodo",
        kind: "mindmap",
        title: "Ngày 14 trong một hình",
        center: "Cân và kể",
        branches: [
          { label: "AWL 9", items: ["commence · cease · attain", "inherent in · integral to", "erode · diminish · distort", "conversely · preliminary"] },
          { label: "Tình nguyện", items: ["altruism · compassion", "grassroots · non-profit", "outreach · beneficiary", "social cohesion"] },
          { label: "Tiền bạc", items: ["disposable income", "run up debts", "live beyond your means", "conspicuous consumption"] },
          { label: "Viết · Nói", items: ["A far outweighs B", "real, but… can be mitigated", "I'd volunteered… / By the time…", "↗ ↗ ↗ and ↘"] },
        ],
      },

      { t: "h", text: "I. AWL sublist 9 — điền từ trong hộp (10 câu) — ôn Bài 1 mục 1–3" },
      {
        t: "note",
        title: "Hộp từ (mỗi từ dùng một lần, giữ nguyên dạng)",
        items: ["**accommodate · ceased · confined · duration · eroded · portion · scenario · suspended · temporary · triggered**"],
      },
      {
        t: "quiz",
        id: "t4d14-bt-awl",
        kind: "fill",
        title: "I. Điền từ trong hộp",
        items: [
          { q: "1. The hall is large enough to ___ five hundred guests.", answers: ["accommodate"], hint: "chứa được" },
          { q: "2. The magazine ___ publication after forty years.", answers: ["ceased"], hint: "ngừng" },
          { q: "3. Poverty is not ___ to rural areas.", answers: ["confined"], hint: "be ___ to" },
          { q: "4. Phones must be switched off for the ___ of the exam.", answers: ["duration"], hint: "for the ___ of" },
          { q: "5. Years of inflation have ___ the value of pensions.", answers: ["eroded"], hint: "xói mòn" },
          { q: "6. A large ___ of the budget is spent on salaries.", answers: ["portion"], hint: "a large ___ of" },
          { q: "7. In the worst-case ___, the event would be cancelled.", answers: ["scenario"], hint: "worst-case ___" },
          { q: "8. Bus services were ___ during the flood.", answers: ["suspended"], hint: "tạm ngừng" },
          { q: "9. The shelter is only a ___ solution to homelessness.", answers: ["temporary"], hint: "≠ permanent" },
          { q: "10. The announcement ___ an angry reaction from students.", answers: ["triggered"], hint: "châm ngòi" },
        ],
      },

      { t: "h", text: "II. Họ từ — viết dạng đúng của từ trong ngoặc (6 câu) — ôn dòng mở rộng của Bài 1" },
      {
        t: "quiz",
        id: "t4d14-bt-ho-tu",
        kind: "fill",
        title: "II. Viết dạng đúng",
        items: [
          { q: "1. The plan caused a great deal of ___ . (CONTROVERSIAL)", answers: ["controversy"], hint: "danh từ" },
          { q: "2. Borrowing is ___ risky. (INHERENT)", answers: ["inherently"], hint: "trạng từ trước tính từ" },
          { q: "3. Educational ___ is closely linked to family income. (ATTAIN)", answers: ["attainment"], hint: "danh từ" },
          { q: "4. The two schedules are ___ : she cannot attend both. (COMPATIBLE)", answers: ["incompatible"], hint: "tính từ phủ định" },
          { q: "5. The news report gave a ___ picture of the protest. (DISTORT)", answers: ["distorted"], hint: "V3 làm tính từ" },
          { q: "6. The deal was ___ beneficial to both companies. (MUTUAL)", answers: ["mutually"], hint: "trạng từ" },
        ],
      },

      { t: "h", text: "III. Tình nguyện vòng 2 (6 câu) — ôn Bài 1 mục 4" },
      {
        t: "mcq",
        id: "t4d14-bt-tinh-nguyen",
        title: "III. Chọn phương án đúng",
        items: [
          { q: "1. Helping others with no thought of reward is called", options: ["altruism", "consumerism", "philanthropy only", "tokenism"], correct: 0, why: "altruism = lòng vị tha. philanthropy là cho tiền từ thiện quy mô lớn." },
          { q: "2. She ___ at the animal shelter every Saturday.", options: ["does volunteer", "joins volunteer", "volunteers", "makes voluntary"], correct: 2, why: "volunteer là động từ: She volunteers at… Hoặc does voluntary work." },
          { q: "3. A campaign started by ordinary local people, not by the government, is a ___ campaign.", options: ["pro bono", "grassroots", "beneficiary", "top-down"], correct: 1, why: "grassroots = từ cơ sở. top-down là ngược lại." },
          { q: "4. The charity ___ over two million dong for flood victims.", options: ["rose", "donated for", "risen", "raised"], correct: 3, why: "raise money (ngoại động từ): raised. rise – rose – risen là nội động từ." },
          { q: "5. The mobile clinic is part of the hospital's ___ programme for remote villages.", options: ["outreach", "outcome", "outlook", "output"], correct: 0, why: "outreach = mang dịch vụ tới tận nơi người cần." },
          { q: "6. Which sentence is correct?", options: ["The scheme benefits for poor families.", "The scheme is benefit to poor families.", "The scheme benefits poor families.", "The scheme is beneficial for to poor families."], correct: 2, why: "benefit (v) + tân ngữ trực tiếp. Hoặc: is of benefit to / is beneficial to." },
        ],
      },

      { t: "h", text: "IV. Tiền bạc & tiêu dùng vòng 2 (6 câu) — ôn Bài 1 mục 5" },
      {
        t: "quiz",
        id: "t4d14-bt-tien",
        kind: "fill",
        title: "IV. Điền MỘT từ",
        items: [
          { q: "1. Easy credit encourages people to live ___ their means.", answers: ["beyond"], hint: "live ___ your means" },
          { q: "2. Inflation reduces the purchasing ___ of savings.", answers: ["power"], hint: "purchasing ___" },
          { q: "3. He bought it on ___ : he saw it, liked it and paid within a minute. (bốc đồng)", answers: ["impulse"], hint: "on ___" },
          { q: "4. Teaching financial ___ at school would help young people avoid debt.", answers: ["literacy"], hint: "financial ___" },
          { q: "5. Fast fashion feeds a ___ culture in which clothes are worn twice and binned.", answers: ["throwaway"], hint: "___ culture" },
          { q: "6. The bank charges ___ on any money you borrow.", answers: ["interest"], hint: "tiền lãi" },
        ],
      },

      { t: "h", text: "V. Cặp dễ nhầm và collocation (6 câu) — ôn bảng mục 3 và các ô ⚠️ mục 5" },
      {
        t: "mcq",
        id: "t4d14-bt-de-nham",
        title: "V. Chọn phương án đúng",
        items: [
          { q: "1. Strict checks are needed to ___ that donations reach the right people.", options: ["assure", "ensure", "insure", "sure"], correct: 1, why: "ensure that… = bảo đảm việc gì xảy ra. assure cần tân ngữ chỉ người." },
          { q: "2. The team has ___ a simple way of tracking expenses.", options: ["device", "deviced", "devised", "divide"], correct: 2, why: "devise (v) = nghĩ ra." },
          { q: "3. A small car is more ___ to run than a large one.", options: ["economical", "economic", "economy", "economics"], correct: 0, why: "economical = tiết kiệm (nhiên liệu, chi phí). economic = thuộc về kinh tế." },
          { q: "4. She spends a third of her salary ___ rent.", options: ["for", "in", "to", "on"], correct: 3, why: "spend money on + N." },
          { q: "5. My grandmother is careful with money without being mean; she is ___ .", options: ["stingy", "frugal", "extravagant", "materialistic"], correct: 1, why: "frugal = tằn tiện (khen). stingy = keo kiệt (chê)." },
          { q: "6. Online shopping is growing in cities. ___, small high-street shops are closing.", options: ["Conversely", "Mutually", "Preliminary", "On behalf"], correct: 0, why: "Conversely nối hai xu hướng ngược chiều." },
        ],
      },

      { t: "h", text: "VI. Dịch Việt → Anh (5 câu) — ôn Bài 1" },
      {
        t: "quiz",
        id: "t4d14-bt-dich",
        kind: "translate",
        title: "VI. Dịch — dùng từ trong gợi ý",
        grammar: "devote … to + V-ing · be confined to · make ends meet · on behalf of · the norm",
        items: [
          { q: "1. Cô ấy dành các ngày cuối tuần để kèm cặp trẻ em thiệt thòi.", answers: ["She devotes her weekends to mentoring underprivileged children.", "She devotes weekends to mentoring underprivileged children."], hint: "devotes … to mentoring" },
          { q: "2. Vấn đề nợ nần không chỉ giới hạn ở người trẻ.", answers: ["The problem of debt is not confined to young people.", "The debt problem is not confined to young people.", "The problem of debt is not confined to the young."], hint: "is not confined to" },
          { q: "3. Nhiều gia đình thu nhập thấp chật vật mới đủ sống.", answers: ["Many low-income families struggle to make ends meet.", "Many low-income households struggle to make ends meet."], hint: "struggle to make ends meet" },
          { q: "4. Tôi viết thư này thay mặt các tình nguyện viên.", answers: ["I am writing this letter on behalf of the volunteers.", "I am writing on behalf of the volunteers.", "I'm writing this letter on behalf of the volunteers."], hint: "on behalf of" },
          { q: "5. Mua sắm trực tuyến đã trở thành chuyện bình thường.", answers: ["Online shopping has become the norm.", "Shopping online has become the norm."], hint: "has become the norm" },
        ],
      },

      { t: "h", text: "VII. Viết — outweigh và câu cân (6 câu) — ôn Bài 2 mục 3–6" },
      {
        t: "mcq",
        id: "t4d14-bt-viet",
        title: "VII. Chọn phương án đúng",
        items: [
          { q: "1. Which sentence is correct?", options: ["The drawbacks are outweigh by the benefits.", "The drawbacks outweighed than the benefits.", "The benefits outweight the drawbacks.", "The drawbacks are outweighed by the benefits."], correct: 3, why: "Bị động: be + outweighed + by. Không than, không t." },
          { q: "2. “The benefit of free museums far ___ the cost.”", options: ["outweigh", "outweighs", "outweighing", "is outweigh"], correct: 1, why: "Chủ ngữ số ít (The benefit) ⇒ outweighs." },
          { q: "3. Which sentence LIMITS the weaker side (câu giới hạn)?", options: ["There are many disadvantages.", "Firstly, it is expensive. Secondly, it is slow.", "Such problems are real, but they are largely transitional.", "The disadvantages are very bad."], correct: 2, why: "real, but… largely transitional = thừa nhận rồi chỉ giới hạn (thước đo: độ lâu dài)." },
          { q: "4. Which measure is used in “The costs fall on those least able to bear them”?", options: ["ai gánh (distribution)", "quy mô (scale)", "độ lâu dài (duration)", "khắc phục được không (remediability)"], correct: 0, why: "Câu nói về việc chi phí rơi vào ai ⇒ thước đo phân bổ." },
          { q: "5. Which opening to body paragraph 2 best continues from a paragraph on drawbacks?", options: ["Secondly, there are advantages.", "The benefits, by contrast, are permanent and reach the whole population.", "However, I will now discuss the advantages.", "On the other hand, advantages."], correct: 1, why: "by contrast + thước đo (permanent · whole population) = câu cân. A, C chỉ báo chuyển đoạn; D không thành câu." },
          { q: "6. Which phrase should be avoided in a band 7 essay?", options: ["On balance,", "a price worth paying", "should not be dismissed", "Every coin has two sides."], correct: 3, why: "Câu sáo, không mang nội dung. Ba cụm còn lại là ngôn ngữ cân của mục 6." },
        ],
      },

      { t: "h", text: "VIII. Nói — thì khi kể một sự kiện (5 câu) — ôn Bài 3 mục 3–4" },
      {
        t: "quiz",
        id: "t4d14-bt-noi",
        kind: "fill",
        title: "VIII. Chia động từ trong ngoặc / điền MỘT từ",
        items: [
          { q: "1. We ___ (wait) for an hour when the organisers finally opened the gates. (gõ 3 từ)", answers: ["had been waiting", "'d been waiting"], hint: "had been + V-ing" },
          { q: "2. By the time the speeches began, half the audience ___ (leave). (gõ 2 từ)", answers: ["had left"], hint: "By the time + V2, had + V3" },
          { q: "3. I was ___ to go on stage when the lights went out. (sắp)", answers: ["about"], hint: "was ___ to" },
          { q: "4. We missed the last bus and ended up ___ (walk) home.", answers: ["walking"], hint: "ended up + V-ing" },
          { q: "5. The evening turned ___ to be a huge success.", answers: ["out"], hint: "turned ___ to be" },
        ],
      },

      { t: "h", text: "IX. Ngữ điệu liệt kê (4 câu) — ôn Bài 3 mục 8" },
      {
        t: "mcq",
        id: "t4d14-bt-ngu-dieu",
        title: "IX. Chọn phương án đúng",
        items: [
          { q: "1. “We need tables, chairs, a microphone and a projector.” Giọng lên ở:", options: ["chỉ projector", "tables, chairs và a microphone", "chỉ tables", "không từ nào"], correct: 1, why: "Lên ở mọi mục trừ mục cuối." },
          { q: "2. Trong câu trên, giọng xuống ở:", options: ["tables", "chairs", "microphone", "projector"], correct: 3, why: "Mục cuối của danh sách đóng." },
          { q: "3. “…setting up tables ↗, checking laptops ↗, printing name tags ↗, that sort of thing.” Đây là danh sách:", options: ["mở — còn những việc tương tự", "đóng — chỉ có ba việc", "câu hỏi", "câu cảm thán"], correct: 0, why: "Mọi mục đều lên giọng + that sort of thing ⇒ danh sách mở." },
          { q: "4. Nếu bạn xuống giọng ngay sau mục đầu tiên, người nghe sẽ nghĩ:", options: ["bạn đang hỏi", "còn nhiều mục nữa", "câu đã kết thúc", "bạn đang ngạc nhiên"], correct: 2, why: "Xuống giọng = hết. Vì vậy liệt kê phải giữ giọng lên tới mục áp chót." },
        ],
      },

      { t: "h", text: "X. Viết một thân bài “bên nhẹ hơn” (100–130 từ) — AI chấm" },
      {
        t: "p",
        text: "Đề: “More and more people buy things on credit instead of saving up for them first. Do the advantages of this trend outweigh the disadvantages?” Giả sử thesis của bạn là: ==nhược điểm nặng hơn==. Hãy viết **Thân bài 1** — đoạn về **ưu điểm** (bên bạn cho là nhẹ hơn): thừa nhận thật hai ưu điểm, mỗi ý có cơ chế, rồi kết bằng 1–2 câu giới hạn (real, but… / only for those who…). Dùng ít nhất **bốn** từ của Bài 1 mục 5.",
      },
      {
        t: "essay",
        id: "t4d14-bt-viet-doan",
        task: "Task 2",
        prompt: "Topic: More and more people buy things on credit instead of saving up for them first. Do the advantages of this trend outweigh the disadvantages? — Assume your thesis is that the DISADVANTAGES are greater. Write ONLY body paragraph 1 (100–130 words): acknowledge the advantages fairly (two points, each with a mechanism), then end with one or two sentences that limit them (e.g. “Such benefits are real, but they depend on…”). Use at least four of: disposable income, on credit, interest, budget, live beyond their means, run up debts, impulse purchases, financial literacy.",
        minWords: 100,
        tips: [
          "Câu chủ đề: The advantages of buying on credit should not be dismissed.",
          "Hai ưu điểm gợi ý: mua được thứ thiết yếu ngay (tủ lạnh, laptop học tập) · dàn trải chi phí giúp lập ngân sách.",
          "Câu giới hạn: … only for those who budget carefully / as long as the interest is low.",
          "Rào đón mỗi nhận định một lớp: can, may, tends to (Ngày 13).",
        ],
      },
      {
        t: "note",
        title: "📌 Một đoạn mẫu để so sau khi đã viết (band 7, ước tính)",
        items: [
          "The advantages of buying **on credit** should not be dismissed. The most obvious is access: a household with little **disposable income** can obtain an essential item, such as a refrigerator or a laptop for study, at the moment it is needed and not a year later. A second benefit is predictability. Because the cost is spread over fixed monthly payments, it may actually be easier to **budget** for than a single large purchase. Such benefits are real, but they depend on two conditions that are often absent: a low rate of **interest**, and a borrower with enough **financial literacy** to understand the true cost. Where either is missing, credit tends to help people **live beyond their means**.",
          "Đếm: thừa nhận (should not be dismissed) · hai ưu điểm có cơ chế (access · predictability) · câu giới hạn (real, but they depend on…) · 6 từ của Bài 1.",
        ],
      },
    ],
  },
];
