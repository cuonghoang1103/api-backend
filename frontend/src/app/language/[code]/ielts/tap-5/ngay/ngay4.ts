/**
 * IELTS Tập 5 — Ngày 4 (band 7.0 → 8.0; tự soạn 24/11/2026 — mọi câu ví dụ, bài mẫu, kịch bản nghe, câu bài tập VIẾT MỚI)
 *   Bài 1 (vocab)     100 từ tần suất thấp đáng giá band 8 — PHẦN 1: 50 từ (10 động từ lập luận · 10 tính từ đánh giá ·
 *                     10 danh từ trừu tượng · 10 trạng từ và cụm điều tiết · 10 từ đời thường cho Speaking) [VA5 VD8]
 *                     — danh sách chốt ở docs/ielts-tap5-phu/100-tu-band8.txt (Ngày 28 lấy 50 từ KHÁC) · 🔊 trọng âm từ dài
 *   Bài 2 (writing)   Task 2 Opinion band 8 — thang 5 bậc độ sâu, ví dụ liên quan, chống khái quát, lập trường có điều kiện;
 *                     bài mẫu band 7 và band 8 đặt cạnh nhau (bỏ phiếu bắt buộc) [W03]
 *                     — nối Tập 4 Ngày 4 (ba tầng của một ý, Granted… but…) · Tập 3 Ngày 6 (đếm vế đề, hai lập trường)
 *   Bài 3 (listening) Part 2 + Part 3 tốc độ thật (~175 wpm), bốn người nói, giọng Úc · Ireland · Anh · Mỹ · New Zealand
 *                     [L04 L05] — nối Tập 4 Ngày 4 (MCQ Part 2, bốn kiểu bẫy) · Tập 4 Ngày 12 · 17 (Part 3)
 *   Bài tập Ngày 4    38 câu có đáp án
 * Mọi id bắt đầu `t5d4-`.
 */
import type { Lesson } from '../data';

export const NGAY_4: Lesson[] = [
  /* ═══════════════════════════ BÀI 1 — TỪ VỰNG ═══════════════════════════ */
  {
    id: "t5d4-tu-vung",
    kind: "vocab",
    title: "Từ vựng: 100 từ tần suất thấp đáng giá band 8 — phần 1 (50 từ)",
    goal: "Dùng đúng 50 từ ít gặp nhưng đắt giá (nghĩa chính xác, collocation, sắc thái, register) trong câu Task 2 và câu trả lời Speaking, và biết khi nào KHÔNG nên dùng chúng.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **LR Writing + Speaking từ 7 lên 8**: band 7 “dùng từ ít gặp có ý thức về văn phong và collocation”; band 8 “vốn từ rộng, dùng **trôi chảy**, chuyển nghĩa **chính xác**; từ ít gặp dùng **khéo**”.",
          "50 từ chia năm nhóm theo VIỆC chúng làm trong bài: nêu tác động · đánh giá · gọi tên khái niệm · điều tiết độ chắc · tả trải nghiệm đời thường.",
          "Mỗi từ học **bốn lớp**: nghĩa chính xác → collocation → sắc thái (tốt / xấu / trung tính) → register (viết hay nói) + bẫy dùng sai.",
          "Khoảng một phần ba số từ có trong lộ trình từ vựng C1–C2 của app CT Language; ở đây học **sâu hơn**: đặt vào câu band 8 và chỉ rõ chỗ người Việt dùng sai.",
          "Liều lượng: **4–6 từ nhóm này trong một bài 280 từ** là đủ. Nhồi nhiều hơn làm bài kém tự nhiên và LR tụt.",
          "Phần 2 (50 từ khác) ở Ngày 28. Nối lại: Tập 4 (collocation học thuật), Ngày 2 tập này (AWL 570).",
        ],
      },

      { t: "h", text: "1. “Từ ít gặp” đáng giá khi nào — bốn phép thử trước khi dùng" },
      { t: "p", text: "Giám khảo không đếm từ khó. Họ hỏi: từ này có **nói đúng điều người viết muốn nói** không, và có **đi đúng với hàng xóm của nó** không. Một từ hiếm dùng lệch nghĩa bị tính là lỗi chọn từ — tệ hơn dùng từ thường mà đúng. Trước khi đưa một từ ít gặp vào bài, qua bốn phép thử:" },
      {
        t: "sodo", kind: "flow", title: "Bốn phép thử",
        steps: [
          { label: "① Nghĩa", sub: "Từ thường nào nó thay được? Có lệch gì so với từ đó?" },
          { label: "② Collocation", sub: "Nó đi với danh từ / giới từ nào? (exacerbate + a problem)" },
          { label: "③ Sắc thái", sub: "Khen, chê hay trung tính? (perpetuate chỉ đi với điều xấu)" },
          { label: "④ Register", sub: "Viết học thuật hay nói đời thường? (hitherto ≠ fiddly)" },
        ],
      },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Số từ ít gặp / bài", "8–12, rải dày, có chỗ gượng", "4–6, mỗi từ đứng đúng chỗ cần sự chính xác"],
          ["Collocation", "Đúng phần lớn; đôi chỗ ghép theo tiếng Việt (~~exacerbate the pollution rate~~)", "Đúng gần như tuyệt đối (exacerbate inequality / tensions / the shortage)"],
          ["Sắc thái", "Dùng từ như đồng nghĩa hoàn toàn với từ thường", "Chọn từ VÌ sắc thái: ostensibly thay cho apparently khi muốn ngầm nghi ngờ"],
          ["Lỗi", "Hiếm, nhưng lặp", "Rất hiếm (1 trong cả bài)"],
        ],
      },
      { t: "rule", formula: "Nghĩa → Collocation → Sắc thái → Register", vi: "Không qua đủ bốn phép thử thì dùng từ thường. Từ thường đúng luôn hơn từ hiếm lệch." },

      { t: "h", text: "2. Nhóm A — 10 động từ nêu tác động và lập luận" },
      { t: "p", text: "Thay cho make … worse, stop, limit, support, prove. Mỗi động từ có **một kiểu tân ngữ** quen thuộc — học luôn tân ngữ đó." },
      {
        t: "vocab",
        items: [
          { w: "exacerbate", pos: "v", ipa: "/ɪɡˈzæsəbeɪt/", vi: "làm (điều vốn đã xấu) trầm trọng thêm", ex: "Cutting bus services would only exacerbate the isolation of rural communities.", exVi: "Cắt giảm xe buýt chỉ làm tình trạng cô lập của cộng đồng nông thôn trầm trọng thêm.", more: "exacerbate **a problem / inequality / tensions / a shortage / the situation**. Tân ngữ phải là thứ ĐÃ xấu sẵn: ~~exacerbate pollution levels~~ → exacerbate pollution. Đừng nhầm **exaggerate** (phóng đại)." },
          { w: "circumvent", pos: "v", ipa: "/ˌsɜːkəmˈvent/", vi: "lách, tìm cách vượt qua (luật, rào cản) một cách khôn khéo", ex: "Companies quickly found ways to circumvent the new advertising rules.", exVi: "Các công ty nhanh chóng tìm ra cách lách quy định quảng cáo mới.", more: "circumvent **the law / rules / restrictions / a ban / censorship**. Có ý tinh ranh, thường chê. Khác **avoid** (tránh hẳn) và **violate** (vi phạm thẳng)." },
          { w: "perpetuate", pos: "v", ipa: "/pəˈpetʃueɪt/", vi: "làm (điều xấu) kéo dài mãi, duy trì", ex: "Streaming pupils by ability at an early age may perpetuate social inequality.", exVi: "Phân lớp học sinh theo năng lực từ sớm có thể duy trì mãi bất bình đẳng xã hội.", more: "perpetuate **a stereotype / myth / inequality / a cycle of poverty**. Chỉ đi với điều tiêu cực. Đừng nhầm **perpetrate** (gây ra tội ác)." },
          { w: "curtail", pos: "v", ipa: "/kɜːˈteɪl/", vi: "cắt bớt, hạn chế (quyền, chi tiêu, hoạt động)", ex: "Emergency laws that curtail civil liberties are rarely repealed afterwards.", exVi: "Các luật khẩn cấp hạn chế quyền tự do dân sự hiếm khi được bãi bỏ về sau.", more: "curtail **freedom / spending / powers / a visit**. Trang trọng; là cắt bớt chứ không xoá hẳn. Danh từ: curtailment." },
          { w: "hamper", pos: "v", ipa: "/ˈhæmpə/", vi: "gây cản trở, làm khó tiến triển", ex: "Research in the region has been hampered by a lack of reliable data.", exVi: "Nghiên cứu trong khu vực bị cản trở vì thiếu dữ liệu đáng tin cậy.", more: "hamper **efforts / progress / growth / the investigation**; rất hay ở bị động: be hampered **by**. Nhẹ hơn prevent — vẫn làm được nhưng khó hơn." },
          { w: "entrench", pos: "v", ipa: "/ɪnˈtrentʃ/", vi: "làm ăn sâu, bám rễ khó thay đổi", ex: "Private tutoring tends to entrench the advantages of wealthier families.", exVi: "Dạy thêm tư có xu hướng làm ăn sâu thêm lợi thế của các gia đình khá giả.", more: "entrench **inequality / privilege / attitudes**; tính từ rất dùng được: **deeply entrenched** beliefs / interests. Gần như luôn tiêu cực." },
          { w: "bolster", pos: "v", ipa: "/ˈbəʊlstə/", vi: "củng cố, làm vững thêm", ex: "These findings bolster the case for investing in early-years education.", exVi: "Những phát hiện này củng cố lập luận ủng hộ đầu tư vào giáo dục mầm non.", more: "bolster **the case / argument / confidence / the economy / support**. Tích cực. Không nói ~~bolster a problem~~." },
          { w: "preclude", pos: "v", ipa: "/prɪˈkluːd/", vi: "khiến (điều gì) không thể xảy ra, loại trừ khả năng", ex: "A criminal record should not preclude someone from finding work.", exVi: "Tiền án không nên khiến một người không thể tìm được việc.", more: "preclude **sth** · preclude sb **from V-ing** · does not preclude the possibility that… Rất trang trọng. Khác prevent ở chỗ nhấn vào **khả năng** bị loại bỏ từ trước." },
          { w: "substantiate", pos: "v", ipa: "/səbˈstænʃieɪt/", vi: "đưa ra bằng chứng chứng minh (một nhận định)", ex: "The claim that homework raises attainment is difficult to substantiate.", exVi: "Nhận định rằng bài tập về nhà nâng cao kết quả học tập rất khó chứng minh.", more: "substantiate **a claim / an allegation / an argument**. Trái nghĩa hay dùng: **unsubstantiated** claims. Chủ ngữ là người hoặc bằng chứng." },
          { w: "galvanise", pos: "v", ipa: "/ˈɡælvənaɪz/", vi: "thôi thúc, kích động (ai) hành động ngay", ex: "The floods galvanised public support for stricter planning laws.", exVi: "Trận lụt đã thôi thúc công chúng ủng hộ luật quy hoạch chặt hơn.", more: "galvanise **support / opinion / a community**; galvanise sb **into action**. Mỹ: galvanize. Chủ ngữ thường là một sự kiện gây sốc." },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận — ba cặp nhìn giống nhau",
        items: [
          "**exacerbate** (làm tệ thêm) ≠ **exaggerate** (phóng đại): The media **exaggerated** the risk, which **exacerbated** public anxiety.",
          "**perpetuate** (duy trì điều xấu) ≠ **perpetrate** (gây ra tội): perpetuate a myth · perpetrate a fraud.",
          "**preclude** (loại trừ khả năng) ≠ **exclude** (không cho vào nhóm): exclude students from school · preclude any chance of agreement.",
        ],
      },
      {
        t: "quiz", id: "t5d4-tv-a-dien", kind: "fill", title: "Nhóm A — điền động từ ở DẠNG ĐÚNG, mỗi từ một lần (10 câu)",
        items: [
          { q: "Raising fares at a time of high inflation will simply ___ the hardship of low-paid commuters.", answers: ["exacerbate"], hint: "làm tệ thêm" },
          { q: "Some firms use overseas subsidiaries to ___ national tax rules.", answers: ["circumvent"], hint: "lách" },
          { q: "Advertising of this kind ___ the stereotype that science is not for girls.", answers: ["perpetuates"], hint: "duy trì điều xấu — chia ngôi" },
          { q: "The government has announced plans to ___ spending on new roads.", answers: ["curtail"], hint: "cắt bớt" },
          { q: "Rescue efforts were ___ by heavy rain and poor visibility.", answers: ["hampered"], hint: "bị động" },
          { q: "Decades of underinvestment have ___ the divide between north and south.", answers: ["entrenched"], hint: "làm ăn sâu — V3" },
          { q: "The latest survey results ___ the argument for a shorter working week.", answers: ["bolster"], hint: "củng cố" },
          { q: "The cost of the course should not ___ talented applicants from applying.", answers: ["preclude"], hint: "loại trừ khả năng" },
          { q: "The author makes several bold claims but fails to ___ any of them.", answers: ["substantiate"], hint: "chứng minh" },
          { q: "The documentary ___ thousands of viewers into joining local clean-up groups.", answers: ["galvanised", "galvanized"], hint: "thôi thúc — quá khứ" },
        ],
      },

      { t: "h", text: "3. Nhóm B — 10 tính từ đánh giá" },
      { t: "p", text: "Thay cho common, weak, big, important, clear. Tính từ band 8 không “mạnh hơn” — nó **hẹp hơn**: mỗi từ chỉ nói một kiểu “yếu” hay một kiểu “lớn”." },
      {
        t: "vocab",
        items: [
          { w: "pervasive", pos: "adj", ipa: "/pəˈveɪsɪv/", vi: "lan khắp, hiện diện ở mọi nơi (thường là điều không mong muốn)", ex: "The pervasive influence of social media on teenagers is hard to overstate.", exVi: "Ảnh hưởng lan khắp của mạng xã hội lên thanh thiếu niên khó mà nói quá.", more: "a pervasive **influence / problem / sense of / culture of**. Thường hơi tiêu cực. Khác **widespread** (trung tính: widespread support). Không dùng cho vật đếm được: ~~pervasive cars~~." },
          { w: "tenuous", pos: "adj", ipa: "/ˈtenjuəs/", vi: "mong manh, yếu, thiếu cơ sở (mối liên hệ, lập luận)", ex: "The link between class size and exam results is more tenuous than many assume.", exVi: "Mối liên hệ giữa sĩ số lớp và kết quả thi mong manh hơn nhiều người tưởng.", more: "a tenuous **link / connection / grasp / argument / claim**. Đừng nhầm **tenacious** (bền bỉ — nghĩa gần như ngược)." },
          { w: "untenable", pos: "adj", ipa: "/ʌnˈtenəbl/", vi: "không thể bảo vệ được, không đứng vững (quan điểm, vị trí)", ex: "The view that technology is neutral has become increasingly untenable.", exVi: "Quan điểm cho rằng công nghệ là trung lập ngày càng không đứng vững.", more: "an untenable **position / argument / claim / situation**. Rất hợp để bác quan điểm đối lập trong Task 2 mà vẫn lịch sự." },
          { w: "disproportionate", pos: "adj", ipa: "/ˌdɪsprəˈpɔːʃənət/", vi: "không cân xứng, quá lớn (hoặc quá nhỏ) so với cái được so", ex: "Young drivers account for a disproportionate share of serious accidents.", exVi: "Tài xế trẻ chiếm một tỉ lệ cao bất cân xứng trong các vụ tai nạn nghiêm trọng.", more: "a disproportionate **share / number / amount / impact**; disproportionate **to** sth. Trạng từ cực hữu ích: **disproportionately** affect the poor." },
          { w: "counterintuitive", pos: "adj", ipa: "/ˌkaʊntərɪnˈtjuːɪtɪv/", vi: "trái với điều trực giác mách bảo", ex: "It may seem counterintuitive, but building more roads often increases congestion.", exVi: "Nghe có vẻ trái trực giác, nhưng xây thêm đường thường làm tắc nghẽn tăng lên.", more: "It may seem counterintuitive, but… — câu mở cho một luận điểm bất ngờ. a counterintuitive **finding / result / idea**." },
          { w: "intractable", pos: "adj", ipa: "/ɪnˈtræktəbl/", vi: "nan giải, rất khó giải quyết dứt điểm", ex: "Homelessness has proved one of the most intractable problems facing large cities.", exVi: "Vô gia cư đã chứng tỏ là một trong những vấn đề nan giải nhất của các thành phố lớn.", more: "an intractable **problem / conflict / dispute / disease**. Mạnh hơn difficult: đã thử nhiều cách mà chưa xong. Chỉ dùng 1 lần / bài." },
          { w: "salient", pos: "adj", ipa: "/ˈseɪliənt/", vi: "nổi bật, đáng chú ý nhất", ex: "The most salient feature of the chart is the collapse in print sales after 2010.", exVi: "Đặc điểm nổi bật nhất của biểu đồ là sự sụt giảm doanh số báo in sau năm 2010.", more: "the salient **points / features / facts**. Dùng được cho overview Task 1. Đứng trước danh từ; không nói ~~very salient~~ — dùng the most salient." },
          { w: "tangible", pos: "adj", ipa: "/ˈtændʒəbl/", vi: "cụ thể, thấy được, đo được (lợi ích, kết quả)", ex: "Voters want tangible improvements, not promises.", exVi: "Cử tri muốn những cải thiện thấy được, chứ không phải lời hứa.", more: "tangible **benefits / results / evidence / improvements**. Trái nghĩa: **intangible** (intangible benefits such as confidence)." },
          { w: "conducive", pos: "adj", ipa: "/kənˈdjuːsɪv/", vi: "tạo điều kiện thuận lợi cho", ex: "Open-plan offices are not always conducive to concentration.", exVi: "Văn phòng không vách ngăn không phải lúc nào cũng thuận lợi cho việc tập trung.", more: "be conducive **to** + N / V-ing — luôn **to**, không đứng trước danh từ: ~~a conducive environment~~ ít chuẩn; viết an environment conducive to learning." },
          { w: "commensurate", pos: "adj", ipa: "/kəˈmenʃərət/", vi: "tương xứng với", ex: "Nurses argue that their pay is not commensurate with their responsibilities.", exVi: "Y tá cho rằng lương của họ không tương xứng với trách nhiệm.", more: "be commensurate **with** sth: pay / reward / punishment commensurate with experience / effort / the offence. Luôn **with**." },
        ],
      },
      {
        t: "mcq", id: "t5d4-tv-b-chon", title: "Nhóm B — chọn tính từ và collocation đúng (8 câu)",
        items: [
          { q: "The evidence for this theory is ___ at best: it rests on a single small study.", options: ["tenacious", "tenuous", "tangible"], correct: 1, why: "tenuous = mong manh, thiếu cơ sở. tenacious = bền bỉ; tangible = cụ thể — trái nghĩa cần tìm." },
          { q: "A quiet room with natural light is far more conducive ___ study than a noisy café.", options: ["for", "with", "to"], correct: 2, why: "conducive to + N." },
          { q: "Fines should be commensurate ___ the seriousness of the offence.", options: ["with", "to", "of"], correct: 0, why: "commensurate with." },
          { q: "Low-income households bear a ___ share of the cost of indirect taxes.", options: ["disproportionate", "pervasive", "salient"], correct: 0, why: "a disproportionate share = phần lớn bất cân xứng." },
          { q: "Once the leaked emails were published, the minister's position became ___.", options: ["intractable", "untenable", "counterintuitive"], correct: 1, why: "an untenable position = vị trí không giữ nổi. intractable đi với problem / conflict." },
          { q: "Câu nào dùng **pervasive** tự nhiên nhất?", options: ["There are pervasive cars in the city centre.", "A pervasive sense of insecurity now affects even well-paid workers.", "The scheme received pervasive support from teachers."], correct: 1, why: "pervasive đi với danh từ trừu tượng, thường tiêu cực. Sự ủng hộ rộng rãi = widespread support." },
          { q: "The reform has yet to produce any ___ benefits for patients.", options: ["tangible", "tenuous", "salient"], correct: 0, why: "tangible benefits = lợi ích thấy được." },
          { q: "The conflict over water rights has proved ___ despite three rounds of talks.", options: ["commensurate", "conducive", "intractable"], correct: 2, why: "an intractable conflict = xung đột nan giải, thử nhiều lần chưa xong." },
        ],
      },

      { t: "h", text: "4. Nhóm C — 10 danh từ gọi tên khái niệm" },
      { t: "p", text: "Một danh từ đúng thay được cả một mệnh đề: “there is something we must be careful about” → **one caveat**. Đây là cách band 8 viết gọn mà vẫn chính xác." },
      {
        t: "vocab",
        items: [
          { w: "caveat", pos: "n", ipa: "/ˈkæviæt/", vi: "điều lưu ý, điều kiện kèm theo làm giới hạn một nhận định", ex: "The scheme has clearly worked, with one important caveat: it is expensive.", exVi: "Chương trình rõ ràng có hiệu quả, với một lưu ý quan trọng: nó tốn kém.", more: "with the caveat **that**… · add / enter a caveat · an important caveat. Công cụ tuyệt vời cho bậc 5 (giới hạn) của bài 2 hôm nay." },
          { w: "dichotomy", pos: "n", ipa: "/daɪˈkɒtəmi/", vi: "sự phân đôi thành hai phía đối lập", ex: "The dichotomy between work and leisure is breaking down.", exVi: "Sự phân đôi giữa công việc và giải trí đang dần mất đi.", more: "a dichotomy **between** A **and** B · a false dichotomy (phân đôi giả — đề discuss both views thường là thế). Không dùng cho khác biệt thông thường." },
          { w: "panacea", pos: "n", ipa: "/ˌpænəˈsiːə/", vi: "thuốc chữa bách bệnh, giải pháp cho mọi vấn đề", ex: "Technology is no panacea for the problems of underfunded schools.", exVi: "Công nghệ không phải thuốc chữa bách bệnh cho các vấn đề của trường học thiếu kinh phí.", more: "Gần như luôn ở câu PHỦ ĐỊNH: is **no / not a** panacea **for** sth. Viết ~~X is a panacea~~ nghe ngây thơ." },
          { w: "propensity", pos: "n", ipa: "/prəˈpensəti/", vi: "khuynh hướng tự nhiên (làm một việc gì)", ex: "Humans have a well-documented propensity to overestimate their own abilities.", exVi: "Con người có một khuynh hướng đã được ghi nhận rõ là đánh giá quá cao năng lực của mình.", more: "a propensity **to V** / **for** N (a propensity for violence). Trang trọng hơn tendency; dùng cho đặc điểm bẩm sinh hoặc ăn sâu." },
          { w: "impetus", pos: "n", ipa: "/ˈɪmpɪtəs/", vi: "động lực, lực đẩy khiến việc gì diễn ra nhanh hơn", ex: "The oil crisis provided the impetus for research into alternative fuels.", exVi: "Khủng hoảng dầu mỏ tạo động lực cho nghiên cứu nhiên liệu thay thế.", more: "provide / give (the / fresh / new) impetus **for** sth / **to** sth. Không đếm được hoặc số ít. Trọng âm ở âm tiết ĐẦU." },
          { w: "ramification", pos: "n", ipa: "/ˌræmɪfɪˈkeɪʃn/", vi: "hệ quả lan rộng, khó lường (của một quyết định)", ex: "The ruling has ramifications far beyond the technology sector.", exVi: "Phán quyết này có những hệ quả vượt xa ngành công nghệ.", more: "Gần như luôn **số nhiều**: the ramifications **of** sth; have wider / far-reaching / legal ramifications **for** sb. Rộng và gián tiếp hơn consequences." },
          { w: "discrepancy", pos: "n", ipa: "/dɪˈskrepənsi/", vi: "sự chênh lệch, không khớp (giữa hai thứ lẽ ra phải khớp)", ex: "There is a striking discrepancy between what people say they eat and what they buy.", exVi: "Có một sự không khớp rõ rệt giữa những gì người ta nói mình ăn và những gì họ mua.", more: "a discrepancy **between** A and B / **in** the figures. Khác **disparity** (chênh lệch bất công giữa các nhóm: income disparity) và **difference** (trung tính)." },
          { w: "complacency", pos: "n", ipa: "/kəmˈpleɪsnsi/", vi: "sự tự mãn, chủ quan nên không đề phòng", ex: "Years of low crime had bred complacency among residents.", exVi: "Nhiều năm tội phạm thấp đã sinh ra sự chủ quan trong cư dân.", more: "breed / lead to complacency · there is no room for complacency. Tính từ: **complacent about** sth. Luôn chê." },
          { w: "onus", pos: "n", ipa: "/ˈəʊnəs/", vi: "trách nhiệm (phải làm / phải chứng minh) thuộc về ai", ex: "The onus is on employers to ensure that the workplace is safe.", exVi: "Trách nhiệm bảo đảm nơi làm việc an toàn thuộc về người sử dụng lao động.", more: "the onus is / lies / falls **on** sb **to V** · put / place / shift the onus on sb. Luôn **the** onus, số ít." },
          { w: "trade-off", pos: "n", ipa: "/ˈtreɪd ɒf/", vi: "sự đánh đổi giữa hai điều không thể có trọn cả hai", ex: "Any transport policy involves a trade-off between speed and safety.", exVi: "Chính sách giao thông nào cũng hàm chứa sự đánh đổi giữa tốc độ và an toàn.", more: "a trade-off **between** A and B · make / accept / involve a trade-off. Dùng được cả khi nói. Động từ cụm: trade A off against B." },
        ],
      },
      {
        t: "quiz", id: "t5d4-tv-c-dien", kind: "fill", title: "Nhóm C — điền danh từ (số ít hoặc số nhiều), mỗi từ tối đa một lần (8 câu)",
        items: [
          { q: "Online learning is useful, but it is no ___ for poor teaching.", answers: ["panacea"], hint: "thuốc bách bệnh" },
          { q: "The ___ is on the company to prove that its product is safe.", answers: ["onus"], hint: "trách nhiệm thuộc về" },
          { q: "Auditors noticed a ___ between the reported sales and the money in the account.", answers: ["discrepancy"], hint: "không khớp" },
          { q: "The decision to leave the trade agreement will have ___ for every exporter.", answers: ["ramifications"], hint: "hệ quả lan rộng — số nhiều" },
          { q: "I broadly agree, with the ___ that such schemes must be voluntary.", answers: ["caveat"], hint: "điều lưu ý" },
          { q: "The new evidence gave fresh ___ to the campaign for reform.", answers: ["impetus"], hint: "động lực" },
          { q: "City planners face a constant ___ between density and green space.", answers: ["trade-off", "trade off", "tradeoff"], hint: "sự đánh đổi" },
          { q: "A long period without accidents can breed ___ among staff.", answers: ["complacency"], hint: "sự chủ quan" },
        ],
      },

      { t: "h", text: "5. Nhóm D — 10 trạng từ và cụm điều tiết" },
      { t: "p", text: "Nhóm nhỏ nhưng **đắt nhất**: một trạng từ đúng cho giám khảo thấy bạn điều khiển được độ chắc và thái độ của câu — đúng phần “chuyển nghĩa chính xác” của band 8. Tập 3–4 đã dạy albeit, notwithstanding, thereby; đây là lớp tiếp theo." },
      {
        t: "vocab",
        items: [
          { w: "ostensibly", pos: "adv", ipa: "/ɒˈstensəbli/", vi: "bề ngoài là, trên danh nghĩa là (ngầm ý: thực chất chưa chắc)", ex: "The cameras were installed ostensibly to reduce crime, but they are mainly used to issue parking fines.", exVi: "Camera được lắp với lý do bề ngoài là giảm tội phạm, nhưng chủ yếu dùng để phạt đỗ xe.", more: "Người viết **nghi ngờ** lý do được nêu. Khác apparently (chỉ là “nghe nói / có vẻ”, không ngầm nghi ngờ). Thường đi với but / yet ở vế sau." },
          { w: "inadvertently", pos: "adv", ipa: "/ˌɪnədˈvɜːtəntli/", vi: "một cách vô tình, không chủ ý (gây ra hậu quả)", ex: "Well-meaning parents may inadvertently discourage children from taking risks.", exVi: "Cha mẹ có thiện ý có thể vô tình khiến con ngại mạo hiểm.", more: "inadvertently **cause / create / encourage / reveal**. Rất hợp để nêu **tác dụng phụ** của một chính sách mà không buộc tội ai." },
          { w: "invariably", pos: "adv", ipa: "/ɪnˈveəriəbli/", vi: "lần nào cũng vậy, luôn luôn", ex: "Large public projects invariably cost more than the original estimate.", exVi: "Các dự án công lớn lần nào cũng tốn hơn dự toán ban đầu.", more: "Nghĩa là **always**, KHÔNG phải “không thay đổi”. Mạnh ngang always ⇒ chỉ dùng khi thật sự không có ngoại lệ đáng kể; không thì dùng almost invariably." },
          { w: "unequivocally", pos: "adv", ipa: "/ˌʌnɪˈkwɪvəkli/", vi: "một cách dứt khoát, không mập mờ", ex: "The data show unequivocally that the ban has reduced hospital admissions.", exVi: "Dữ liệu cho thấy một cách dứt khoát rằng lệnh cấm đã làm giảm số ca nhập viện.", more: "state / show / condemn / support sth unequivocally. Ngược với hedging — chỉ dùng cho điều bạn sẵn sàng bảo vệ tuyệt đối; cả bài một lần." },
          { w: "markedly", pos: "adv", ipa: "/ˈmɑːkɪdli/", vi: "một cách rõ rệt (thay đổi, khác biệt)", ex: "Attitudes to remote work have shifted markedly over the past decade.", exVi: "Thái độ với làm việc từ xa đã thay đổi rõ rệt trong thập kỷ qua.", more: "Ba âm tiết: /ˈmɑːkɪdli/. rise / differ / improve **markedly**; markedly **different / higher**. Dùng tốt cho Task 1. Khác remarkably (đáng kinh ngạc)." },
          { w: "nominally", pos: "adv", ipa: "/ˈnɒmɪnəli/", vi: "trên danh nghĩa (thực tế thì khác)", ex: "Education is nominally free, yet parents pay for books, uniforms and transport.", exVi: "Giáo dục trên danh nghĩa là miễn phí, nhưng phụ huynh phải trả tiền sách, đồng phục và đi lại.", more: "nominally **free / independent / in charge**. So với ostensibly: nominally nói về **danh nghĩa / chức danh**, ostensibly nói về **lý do được nêu**." },
          { w: "hitherto", pos: "adv", ipa: "/ˌhɪðəˈtuː/", vi: "cho tới nay, cho tới thời điểm đó", ex: "The reform opened university to groups that had hitherto been excluded.", exVi: "Cuộc cải cách mở cửa đại học cho những nhóm trước đó vẫn bị gạt ra ngoài.", more: "Rất trang trọng, chỉ dùng khi viết. Thường đi với hoàn thành: had hitherto been · hitherto unknown / neglected. Tối đa một lần / bài." },
          { w: "by extension", pos: "cụm", ipa: "/baɪ ɪkˈstenʃn/", vi: "và suy rộng ra thì (cũng đúng với)", ex: "Poor sleep harms concentration and, by extension, academic performance.", exVi: "Ngủ kém hại sự tập trung và, suy rộng ra, cả kết quả học tập.", more: "Đặt giữa hai dấu phẩy, sau **and**. Dùng để nối nguyên nhân với hệ quả xa hơn một bước — đúng bậc 4 (hệ quả) của bài 2." },
          { w: "insofar as", pos: "liên từ", ipa: "/ˌɪnsəˈfɑːr əz/", vi: "trong chừng mực mà, ở mức độ mà", ex: "Competition is healthy insofar as it pushes firms to improve their products.", exVi: "Cạnh tranh là lành mạnh trong chừng mực nó thúc đẩy doanh nghiệp cải tiến sản phẩm.", more: "insofar as + **mệnh đề**. Cho phép đồng ý **có điều kiện** trong một câu — công cụ chính của lập trường band 8. Cũng viết in so far as." },
          { w: "seemingly", pos: "adv", ipa: "/ˈsiːmɪŋli/", vi: "có vẻ như, thoạt nhìn thì", ex: "A seemingly minor change in wording can alter the result of a survey.", exVi: "Một thay đổi thoạt nhìn có vẻ nhỏ trong cách đặt câu có thể làm đổi kết quả khảo sát.", more: "seemingly + **tính từ**: seemingly simple / endless / unrelated. Báo trước rằng thực tế khác với vẻ ngoài." },
        ],
      },
      {
        t: "table", head: ["Từ", "Vị trí trong câu", "Dấu câu", "Lỗi hay gặp"],
        rows: [
          ["ostensibly · nominally · seemingly", "Ngay trước từ nó bổ nghĩa (động từ, tính từ, cụm chỉ mục đích)", "Không cần phẩy", "Đặt đầu câu như một từ nối: ~~Ostensibly, …~~ (được, nhưng yếu hơn)"],
          ["inadvertently · invariably · unequivocally · markedly", "Giữa trợ động từ và động từ chính, hoặc sau động từ", "Không phẩy", "~~Invariably the project costs more~~ → The project **invariably** costs more"],
          ["hitherto", "Sau had / has, trước V3 hoặc tính từ", "Không phẩy", "Dùng với quá khứ đơn: ~~hitherto was~~"],
          ["by extension", "Sau and, giữa hai dấu phẩy", ", and, by extension, …", "Dùng đầu câu thay therefore"],
          ["insofar as", "Giữa câu, mở một mệnh đề đủ chủ vị", "Không phẩy trước nó", "~~insofar as the cost~~ (thiếu động từ)"],
        ],
      },
      { t: "rule", formula: "S + V + adj + insofar as + S + V", vi: "Đồng ý có điều kiện trong một câu: X is justified insofar as it…" },
      {
        t: "quiz", id: "t5d4-tv-d-dich", kind: "translate", title: "Dịch sang tiếng Anh — dùng từ gợi ý của nhóm D (5 câu)", grammar: "Trạng từ điều tiết đặt ngay trước từ nó bổ nghĩa · insofar as + mệnh đề",
        items: [
          { q: "Các dự án như vậy lần nào cũng mất nhiều thời gian hơn kế hoạch.", answers: ["Such projects invariably take longer than planned.", "Projects like this invariably take longer than planned.", "Such projects invariably take longer than expected.", "Such projects invariably take more time than planned."], hint: "invariably" },
          { q: "Chính sách này đã vô tình khuyến khích mọi người lái xe nhiều hơn.", answers: ["This policy has inadvertently encouraged people to drive more.", "The policy has inadvertently encouraged people to drive more.", "This policy inadvertently encouraged people to drive more."], hint: "inadvertently · encourage sb to V" },
          { q: "Du lịch có lợi trong chừng mực nó tạo ra việc làm cho người dân địa phương.", answers: ["Tourism is beneficial insofar as it creates jobs for local people.", "Tourism is beneficial insofar as it provides jobs for local people.", "Tourism is beneficial in so far as it creates jobs for local people.", "Tourism is beneficial insofar as it creates jobs for local residents.", "Tourism is beneficial insofar as it creates employment for local people."], hint: "insofar as · create jobs" },
          { q: "Dịch vụ này trên danh nghĩa là miễn phí, nhưng người dùng trả bằng dữ liệu của họ.", answers: ["The service is nominally free, but users pay with their data.", "This service is nominally free, but users pay with their data.", "The service is nominally free, yet users pay with their data.", "This service is nominally free, yet users pay with their data."], hint: "nominally free · pay with" },
          { q: "Thiếu ngủ ảnh hưởng tới trí nhớ và, suy rộng ra, tới việc học.", answers: ["A lack of sleep affects memory and, by extension, learning.", "Lack of sleep affects memory and, by extension, learning.", "Sleep deprivation affects memory and, by extension, learning.", "A lack of sleep affects memory and, by extension, study."], hint: "by extension — giữa hai dấu phẩy" },
        ],
      },

      { t: "h", text: "6. Nhóm E — 10 từ đời thường cho Speaking" },
      { t: "p", text: "Từ ít gặp khi **nói** không phải từ học thuật. Nó là tính từ, động từ **chính xác cho trải nghiệm hằng ngày**: không nói very difficult mà nói daunting; không nói a bit disappointing mà nói underwhelming. Dùng nhóm A–D trong Part 1 nghe như đọc bài luận; dùng nhóm E nghe như người thật." },
      {
        t: "vocab",
        items: [
          { w: "daunting", pos: "adj", ipa: "/ˈdɔːntɪŋ/", vi: "(việc sắp làm) khiến mình thấy ngợp, e ngại", ex: "Moving to a new city on my own was pretty daunting at first.", exVi: "Một mình chuyển tới thành phố mới lúc đầu khá là ngợp.", more: "a daunting **task / prospect / challenge**; find sth daunting. Nói về cảm giác TRƯỚC khi làm. Khác difficult (bản thân việc đó khó)." },
          { w: "mundane", pos: "adj", ipa: "/mʌnˈdeɪn/", vi: "tầm thường, lặp đi lặp lại hằng ngày, không có gì thú vị", ex: "I listen to podcasts to get through mundane jobs like ironing.", exVi: "Tôi nghe podcast để qua được mấy việc nhàm chán thường ngày như ủi đồ.", more: "mundane **tasks / chores / details / routine**. Dùng được cả khi viết (automate mundane tasks)." },
          { w: "gruelling", pos: "adj", ipa: "/ˈɡruːəlɪŋ/", vi: "cực kỳ mệt mỏi và kéo dài, vắt kiệt sức", ex: "The final month before the deadline was absolutely gruelling.", exVi: "Tháng cuối trước hạn nộp thật sự vắt kiệt sức.", more: "a gruelling **schedule / journey / shift / exam period**. Mỹ: grueling. Mạnh hơn tiring nhiều — đi với absolutely, không đi với very." },
          { w: "underwhelming", pos: "adj", ipa: "/ˌʌndəˈwelmɪŋ/", vi: "gây thất vọng nhẹ vì không được như mong đợi", ex: "The film had brilliant reviews, but I found it a bit underwhelming.", exVi: "Bộ phim được khen rất nhiều, nhưng tôi thấy nó hơi nhạt so với kỳ vọng.", more: "find sth (a bit / rather) underwhelming. Cách chê lịch sự, có chút hài hước. Chủ ngữ là VẬT; người thì **underwhelmed by**." },
          { w: "quirky", pos: "adj", ipa: "/ˈkwɜːki/", vi: "khác lạ theo kiểu thú vị, dễ mến", ex: "There's a quirky little bookshop near my flat that only sells second-hand maps.", exVi: "Gần nhà tôi có một hiệu sách nhỏ khá độc đáo, chỉ bán bản đồ cũ.", more: "a quirky **café / sense of humour / design / character**. Tích cực — khác **weird / odd** (kỳ quặc, hơi chê)." },
          { w: "meticulous", pos: "adj", ipa: "/məˈtɪkjələs/", vi: "tỉ mỉ, cẩn thận đến từng chi tiết", ex: "My dad is meticulous about keeping receipts.", exVi: "Bố tôi rất tỉ mỉ chuyện giữ hoá đơn.", more: "meticulous **about / in** sth · meticulous planning / records / attention to detail. Khen. Khác **fussy / pedantic** (kỹ tính tới mức khó chịu)." },
          { w: "baffling", pos: "adj", ipa: "/ˈbæflɪŋ/", vi: "khó hiểu tới mức bối rối", ex: "I find it baffling that people queue for hours for a new phone.", exVi: "Tôi thấy thật khó hiểu khi người ta xếp hàng hàng giờ để mua điện thoại mới.", more: "I find it baffling that… · a baffling decision. Người: **baffled by** sth. Động từ: It baffles me why…" },
          { w: "dwindle", pos: "v", ipa: "/ˈdwɪndl/", vi: "giảm dần, teo dần (số lượng, sự quan tâm)", ex: "My enthusiasm for the gym dwindled after about three weeks.", exVi: "Hứng thú đi tập của tôi teo dần sau khoảng ba tuần.", more: "numbers / savings / interest / supplies **dwindle** (away / to nothing); tính từ: **dwindling** resources. Nội động từ — không có tân ngữ, không bị động." },
          { w: "cumbersome", pos: "adj", ipa: "/ˈkʌmbəsəm/", vi: "cồng kềnh, rườm rà, mất công (đồ vật hoặc quy trình)", ex: "The old booking system was so cumbersome that most of us just phoned instead.", exVi: "Hệ thống đặt chỗ cũ rườm rà tới mức đa số chúng tôi gọi điện luôn cho xong.", more: "a cumbersome **process / procedure / system / piece of equipment**. Dùng được cả khi viết (cumbersome regulations). Khác **fiddly** (lắt nhắt, thao tác nhỏ): cumbersome là nặng nề, nhiều bước." },
          { w: "fiddly", pos: "adj", ipa: "/ˈfɪdli/", vi: "lắt nhắt, đòi hỏi thao tác nhỏ và khó chịu", ex: "Setting up the printer was really fiddly — it took me the whole evening.", exVi: "Cài cái máy in lắt nhắt kinh khủng — tôi mất cả buổi tối.", more: "Anh-Anh, thân mật: a fiddly job / fiddly to set up / fiddly little screws. Chỉ dùng khi nói. Rất hợp với dân IT kể chuyện cấu hình." },
        ],
      },
      {
        t: "mcq", id: "t5d4-tv-e-chon", title: "Nhóm E — từ nào hợp câu trả lời Speaking? (6 câu)",
        items: [
          { q: "“How was the concert?” — “Honestly, a bit ___. The sound was poor and they only played for an hour.”", options: ["underwhelming", "gruelling", "meticulous"], correct: 0, why: "Thất vọng nhẹ vì không như kỳ vọng ⇒ underwhelming." },
          { q: "“Was the internship hard?” — “The hours were ___ — I was doing twelve-hour shifts six days a week.”", options: ["quirky", "gruelling", "mundane"], correct: 1, why: "Kéo dài và vắt kiệt sức ⇒ gruelling." },
          { q: "“Do you still play the guitar?” — “Not much. My interest ___ once I started university.”", options: ["was dwindled", "dwindled", "dwindled it"], correct: 1, why: "dwindle là nội động từ: không bị động, không tân ngữ." },
          { q: "“Why did you stop using that app?” — “The sign-up process was so ___ — six screens of forms before you could do anything.”", options: ["cumbersome", "quirky", "underwhelming"], correct: 0, why: "Rườm rà, nhiều bước ⇒ cumbersome. underwhelming = gây thất vọng vì kém kỳ vọng, không tả quy trình nhiều bước." },
          { q: "“What's your neighbourhood like?” — “It's full of ___ little shops — there's one that sells nothing but buttons.”", options: ["daunting", "baffling", "quirky"], correct: 2, why: "Khác lạ theo kiểu dễ mến ⇒ quirky." },
          { q: "Từ nào KHÔNG nên đưa vào bài Task 2?", options: ["mundane", "fiddly", "meticulous"], correct: 1, why: "fiddly là thân mật, chỉ dùng khi nói. mundane và meticulous dùng được ở cả hai." },
        ],
      },

      { t: "h", text: "7. Sắc thái — tám cặp dễ dùng lệch" },
      {
        t: "table", head: ["Cặp", "Khác nhau ở", "Ví dụ đúng"],
        rows: [
          ["exacerbate · worsen", "exacerbate cần tân ngữ đã xấu sẵn; worsen dùng được cả nội động từ", "The drought **exacerbated** food shortages. · Conditions **worsened**."],
          ["hamper · preclude", "hamper = làm khó; preclude = làm cho không thể", "Bad weather **hampered** the search. · The treaty **precludes** any military use."],
          ["pervasive · widespread", "pervasive thấm vào mọi ngóc ngách, thường xấu; widespread trung tính", "a **pervasive** culture of overwork · **widespread** support"],
          ["tenuous · untenable", "tenuous = yếu nhưng còn; untenable = không thể giữ nữa", "a **tenuous** link · an **untenable** position"],
          ["discrepancy · disparity", "discrepancy = không khớp giữa hai con số / lời kể; disparity = chênh lệch bất công giữa nhóm", "a **discrepancy** in the accounts · the **disparity** between rich and poor"],
          ["ostensibly · nominally · seemingly", "lý do được nêu · danh nghĩa · vẻ ngoài", "**ostensibly** for safety · **nominally** in charge · **seemingly** simple"],
          ["invariably · inevitably", "invariably = lần nào cũng; inevitably = không tránh khỏi (do bản chất)", "He is **invariably** late. · Prices will **inevitably** rise."],
          ["meticulous · fussy", "meticulous khen; fussy chê", "a **meticulous** editor · a **fussy** eater"],
        ],
      },
      {
        t: "mcq", id: "t5d4-tv-sac-thai", title: "Chọn từ có sắc thái đúng (8 câu)",
        items: [
          { q: "The charity was set up ___ to help refugees, though most of its income was spent on salaries.", options: ["invariably", "ostensibly", "markedly"], correct: 1, why: "Người viết nghi ngờ mục đích được nêu ⇒ ostensibly." },
          { q: "Although the two regions are similar in size, there is a wide ___ in life expectancy between them.", options: ["disparity", "discrepancy", "dichotomy"], correct: 0, why: "Chênh lệch bất công giữa hai nhóm dân ⇒ disparity. discrepancy = hai số liệu lẽ ra phải khớp." },
          { q: "The witness's statement contained several ___ with the video footage.", options: ["disparities", "ramifications", "discrepancies"], correct: 2, why: "Lời khai không khớp với video ⇒ discrepancies." },
          { q: "As demand grows faster than supply, prices will ___ rise.", options: ["inevitably", "inadvertently", "nominally"], correct: 0, why: "Hệ quả tất yếu ⇒ inevitably. (invariably = lần nào cũng, tả thói quen lặp lại.)" },
          { q: "There is ___ support among teachers for smaller classes.", options: ["pervasive", "widespread", "intractable"], correct: 1, why: "Sự ủng hộ là điều tích cực, trung tính ⇒ widespread." },
          { q: "The mayor is ___ in charge of transport, but all major decisions are taken by the national ministry.", options: ["unequivocally", "nominally", "hitherto"], correct: 1, why: "Trên danh nghĩa (chức danh) ⇒ nominally." },
          { q: "Poor road design did not make the journey impossible, but it certainly ___ the emergency services.", options: ["precluded", "hampered", "perpetuated"], correct: 1, why: "Làm khó chứ không làm cho không thể ⇒ hampered." },
          { q: "Câu nào có sắc thái KHEN?", options: ["She is fussy about her notes.", "She is pedantic about her notes.", "She is meticulous about her notes."], correct: 2, why: "meticulous = tỉ mỉ (khen). fussy / pedantic = kỹ tính quá mức (chê)." },
        ],
      },

      { t: "h", text: "8. Nâng câu từ band 7 lên band 8 — và khi nào dừng" },
      {
        t: "table", head: ["Band 7", "Band 8", "Từ làm việc gì"],
        rows: [
          ["Banning cars will make the problem of empty shops worse.", "Banning cars risks **exacerbating** the decline of city-centre retail.", "Một động từ thay make … worse, tân ngữ chính xác"],
          ["This solution cannot solve all problems.", "This is **no panacea**; it addresses congestion but not emissions.", "Danh từ + nói rõ giới hạn"],
          ["Poor people are affected more than rich people.", "The burden falls **disproportionately** on low-income households.", "Trạng từ thay cả mệnh đề so sánh"],
          ["The government says the tax is for health, but maybe it is for money.", "The tax was introduced **ostensibly** on health grounds.", "Một trạng từ mang cả sự nghi ngờ"],
          ["I agree, but only if it helps local people.", "I agree **insofar as** local residents share in the benefits.", "Điều kiện nằm trong câu"],
          ["There is not much evidence for this idea.", "The evidence for this is **tenuous**.", "Tính từ hẹp nghĩa"],
        ],
      },
      {
        t: "note", title: "⚠️ Khi nào dùng từ thường tốt hơn",
        items: [
          "Khi bạn không chắc collocation. “make the problem worse” đúng 100%; “exacerbate the pollution rate” sai.",
          "Khi câu trước đã có một từ nhóm này. Hai từ hiếm sát nhau nghe gượng: ~~This intractable dichotomy invariably exacerbates…~~",
          "Khi đang nói về việc đời thường trong Part 1. “The onus is on me to cook” nghe như đọc luật.",
          "Khi từ đó **mạnh hơn** điều bạn muốn nói: invariably, unequivocally, untenable, intractable đều là từ tuyệt đối.",
        ],
      },
      {
        t: "quiz", id: "t5d4-tv-nang-cau", kind: "translate", title: "Dịch sang tiếng Anh ở mức band 8 — dùng từ gợi ý (5 câu)", grammar: "Từ ít gặp + đúng collocation của nó",
        items: [
          { q: "Tăng học phí sẽ làm trầm trọng thêm bất bình đẳng hiện có.", answers: ["Raising tuition fees would exacerbate existing inequality.", "Raising tuition fees will exacerbate existing inequality.", "Raising tuition fees would exacerbate existing inequalities.", "Increasing tuition fees would exacerbate existing inequality.", "Raising tuition fees will exacerbate existing inequalities.", "Higher tuition fees would exacerbate existing inequality."], hint: "exacerbate · existing inequality" },
          { q: "Trách nhiệm chứng minh sản phẩm an toàn thuộc về nhà sản xuất.", answers: ["The onus is on manufacturers to prove that their products are safe.", "The onus is on the manufacturer to prove that the product is safe.", "The onus is on manufacturers to prove their products are safe.", "The onus is on the manufacturer to prove that its product is safe.", "The onus is on the manufacturer to prove that their product is safe."], hint: "the onus is on … to V" },
          { q: "Mối liên hệ giữa trò chơi điện tử và bạo lực rất mong manh.", answers: ["The link between video games and violence is tenuous.", "The link between video games and violence is very tenuous.", "The connection between video games and violence is tenuous.", "The link between computer games and violence is tenuous."], hint: "the link between … is tenuous" },
          { q: "Lương nên tương xứng với kinh nghiệm.", answers: ["Pay should be commensurate with experience.", "Salaries should be commensurate with experience.", "Salary should be commensurate with experience.", "Wages should be commensurate with experience."], hint: "commensurate with" },
          { q: "Công nghệ không phải thuốc chữa bách bệnh cho các vấn đề của giáo dục.", answers: ["Technology is no panacea for the problems of education.", "Technology is not a panacea for the problems of education.", "Technology is no panacea for the problems in education.", "Technology is not a panacea for the problems in education.", "Technology is no panacea for education's problems."], hint: "no panacea for" },
        ],
      },

      { t: "h", text: "9. 🔊 Phát âm — trọng âm của từ dài" },
      { t: "p", text: "Từ ít gặp mà đặt sai trọng âm thì giám khảo không nhận ra từ — mất cả điểm LR lẫn P. Quy tắc nhanh: từ tận cùng **-ate** (động từ 3 âm tiết trở lên) nhấn âm thứ ba từ cuối (exAcerbate, perPEtuate, subSTANtiate); **-ity / -ety / -ive / -ous / -ion** nhấn ngay trước đuôi (proPENsity, perVAsive, TEnuous, ramifiCAtion). Ngoại lệ phải thuộc: **IMpetus**, **CAveat**, **Onus**, **SAlient**, **TANgible**, comMENsurate, diCHOtomy, panaCEa." },
      {
        t: "phatam", id: "t5d4-phat-am", title: "Đọc to — từ dài đặt đúng trọng âm",
        note: "Gõ nhịp tay vào âm tiết mang trọng âm của từ in đậm trong đầu bạn trước khi đọc. Âm không nhấn đọc nhẹ thành /ə/ hoặc /ɪ/.",
        items: [
          { text: "The policy may exacerbate the problem.", ipa: "ðə pɒləsi meɪ ɪɡzæsəbeɪt ðə prɒbləm", vi: "ex-A-cer-bate — Chính sách này có thể làm vấn đề trầm trọng thêm." },
          { text: "That is a counterintuitive but salient point.", ipa: "ðæt ɪz ə kaʊntərɪntjuːɪtɪv bət seɪliənt pɔɪnt", vi: "counter-in-TU-itive · SA-lient — Đó là một điểm trái trực giác nhưng nổi bật." },
          { text: "There is no panacea for this dichotomy.", ipa: "ðeər ɪz nəʊ pænəsiːə fə ðɪs daɪkɒtəmi", vi: "pana-CE-a · di-CHO-tomy — Không có thuốc bách bệnh cho sự phân đôi này." },
          { text: "The claim is tenuous and ultimately untenable.", ipa: "ðə kleɪm ɪz tenjuəs ənd ʌltɪmətli ʌntenəbl", vi: "TE-nuous · un-TE-nable — Nhận định ấy mong manh và rốt cuộc không đứng vững." },
          { text: "Pay should be commensurate with experience.", ipa: "peɪ ʃəd bi kəmenʃərət wɪð ɪkspɪəriəns", vi: "com-MEN-surate — Lương nên tương xứng với kinh nghiệm." },
          { text: "She inadvertently deleted the file.", ipa: "ʃi ɪnədvɜːtəntli dɪliːtɪd ðə faɪl", vi: "inad-VER-tently — Cô ấy vô tình xoá mất tệp." },
          { text: "The evidence is unequivocally clear.", ipa: "ði evɪdəns ɪz ʌnɪkwɪvəkli klɪə", vi: "une-QUI-vocally — Bằng chứng rõ ràng một cách dứt khoát." },
          { text: "It was a gruelling but meticulous process.", ipa: "ɪt wəz ə ɡruːəlɪŋ bət mətɪkjələs prəʊses", vi: "GRU-elling · me-TI-culous — Đó là một quá trình vắt sức nhưng tỉ mỉ." },
        ],
      },
      {
        t: "note", title: "💡 Cách học 50 từ này trong 7 ngày",
        items: [
          "Hôm nay: học theo nhóm, **che nghĩa** rồi **che từ** bằng nút của khối từ vựng. Từ tự vào Flashcards bộ “Từ của khoá — Tập 5”.",
          "Mỗi ngày 10 phút: với mỗi từ nói to **cụm collocation** (exacerbate inequality), không nói từ trơ.",
          "Bài viết hôm nay (bài 2) và hai bài kế tiếp: mỗi bài cố ý dùng **5 từ** của danh sách, gạch chân, rồi nhờ AI chấm kiểm collocation.",
          "Sau 7 ngày tự kiểm “nhớ sau 7 ngày” ≥ 90%. Từ nào quên ⇒ viết thêm hai câu của riêng bạn.",
          "Ngày 28 học 50 từ còn lại — không trùng danh sách hôm nay.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 2 — VIẾT ═══════════════════════════ */
  {
    id: "t5d4-viet",
    kind: "writing",
    title: "Viết Task 2: Opinion band 8 — lập luận sâu, ví dụ liên quan, không khái quát",
    goal: "Viết một bài Opinion 280–320 từ trong 40 phút mà mỗi thân bài đi đủ năm bậc độ sâu (luận điểm → cơ chế → ví dụ liên quan → hệ quả → giới hạn), không có câu khái quát quá đà, lập trường có điều kiện rõ ràng từ mở bài tới kết bài.",
    minutes: 100,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy tiêu chí nào",
        items: [
          "Đẩy **TR (Task Response) từ 7 lên 8**: band 7 “ý chính được mở rộng và chống đỡ, đôi chỗ còn **khái quát**”; band 8 “trả lời **đủ và sâu**; ý được mở rộng, chống đỡ bằng ví dụ / lý lẽ **có liên quan**”.",
          "Công cụ chính: **thang 5 bậc độ sâu** — Tập 4 Ngày 4 dạy ba tầng (ý → giải thích → ví dụ); hôm nay thêm bậc **cơ chế** và bậc **giới hạn**.",
          "**Ví dụ liên quan**: bốn loại dùng được, ba loại “ví dụ giả” làm tụt điểm (số liệu bịa, chuyện cá nhân, ví dụ rộng hơn luận điểm).",
          "**Chống khái quát**: mỗi nhận định phải nói rõ ai · khi nào · tới mức nào.",
          "**Lập trường có điều kiện** (I agree insofar as… / provided that…) — không phải “đồng ý một nửa cho an toàn”.",
          "So bài mẫu **band 7 và band 8** cùng một đề; dùng 5 từ của bài 1 đúng chỗ. Nối: Tập 4 Ngày 4, Tập 3 Ngày 6.",
        ],
      },

      { t: "h", text: "1. TR band 7 và band 8 — giám khảo thấy gì khác?" },
      {
        t: "table", head: ["", "Band 7", "Band 8"],
        rows: [
          ["Số luận điểm", "2–3 luận điểm, mỗi cái 3–4 câu", "**2 luận điểm**, mỗi cái 5–7 câu — ít hơn nhưng đào sâu hơn"],
          ["Câu giải thích", "Nói lại luận điểm bằng lời khác (“This is because it is good for society.”)", "Nêu **cơ chế**: bước A dẫn tới B dẫn tới C như thế nào"],
          ["Ví dụ", "“For example, in many countries…” — đúng nhưng ai cũng viết được", "Trường hợp cụ thể, và nói rõ nó **chứng minh điều gì**"],
          ["Phản đề", "Nêu rồi bác bằng một câu (“However, I think this is not strong.”)", "Thừa nhận phần đúng, rồi chỉ ra **điều kiện** làm nó mất hiệu lực"],
          ["Độ chắc của nhận định", "always, everyone, will, all young people", "tend to, markedly less likely, in most cases — đúng mức bằng chứng cho phép"],
          ["Lập trường", "Rõ, nhưng tuyệt đối (“I strongly believe…”)", "Rõ **và có phạm vi**: đồng ý tới đâu, với điều kiện gì"],
        ],
      },
      { t: "p", text: "Điều khó chấp nhận nhất với người đang ở band 7: muốn lên 8 phải **viết ít ý hơn**. Ba luận điểm mỗi cái bốn câu luôn nông hơn hai luận điểm mỗi cái bảy câu." },

      { t: "h", text: "2. Thang 5 bậc độ sâu của một luận điểm" },
      {
        t: "sodo", kind: "flow", title: "Năm bậc — mỗi thân bài đi đủ ít nhất bốn",
        caption: "Bậc 2 và bậc 5 là hai bậc phân biệt band 8 với band 7.",
        steps: [
          { label: "① Luận điểm", sub: "một câu, đã có phạm vi" },
          { label: "② Cơ chế", sub: "vì sao / bằng cách nào — chuỗi A → B → C" },
          { label: "③ Ví dụ liên quan", sub: "một trường hợp cụ thể khớp đúng cơ chế" },
          { label: "④ Hệ quả", sub: "so what? — điều đó thay đổi gì cho câu hỏi của đề" },
          { label: "⑤ Giới hạn", sub: "đúng tới đâu, trong điều kiện nào" },
        ],
      },
      { t: "p", text: "Minh hoạ trên đề của bài mẫu hôm nay — **Voting in national elections should be compulsory. To what extent do you agree or disagree?** — với luận điểm “bầu cử bắt buộc làm chính phủ đại diện hơn”:" },
      {
        t: "table", head: ["Bậc", "Band 7 dừng ở đây", "Band 8 viết"],
        rows: [
          ["① Luận điểm", "Compulsory voting makes the government more representative.", "The strongest argument for compulsion concerns **who stays at home** when voting is optional."],
          ["② Cơ chế", "Because everyone votes, the government represents everyone.", "Abstention is not spread evenly: the young and the poor are markedly less likely to vote; parties campaign for the votes actually cast, so their programmes drift towards older, wealthier voters."],
          ["③ Ví dụ", "For example, in Australia almost everyone votes.", "In Australia, where turnout routinely exceeds ninety per cent, no party can win simply by mobilising its own supporters."],
          ["④ Hệ quả", "(không có)", "The benefit lies less in the extra votes themselves than in the change they force on those seeking office."],
          ["⑤ Giới hạn", "(không có)", "Compulsory voting is no panacea: it cannot by itself make citizens informed."],
        ],
      },
      {
        t: "note", title: "💡 Ba câu hỏi tự hỏi để leo bậc",
        items: [
          "Sau luận điểm, hỏi **“Bằng cách nào?”** hai lần liên tiếp. Câu trả lời lần hai thường mới là cơ chế thật.",
          "Sau ví dụ, hỏi **“Thế thì sao?”**. Nếu không trả lời được, ví dụ đó chỉ để trang trí.",
          "Trước khi sang đoạn mới, hỏi **“Lúc nào thì điều này KHÔNG đúng?”**. Câu trả lời là bậc 5 — và thường là cầu nối sang đoạn phản đề.",
        ],
      },
      { t: "rule", formula: "Luận điểm → cơ chế (A → B → C) → ví dụ khớp cơ chế → hệ quả → giới hạn", vi: "Hai thân bài × năm bậc = khoảng 200 từ thân bài. Không cần luận điểm thứ ba." },

      { t: "h", text: "3. Ví dụ “liên quan” — bốn loại dùng được, ba loại giả" },
      { t: "p", text: "Band descriptors không đòi số liệu hay tên nghiên cứu. Chúng đòi ví dụ **relevant**: khớp đúng điều bạn vừa lập luận. Giám khảo không kiểm chứng dữ kiện, nhưng một con số bịa lộ liễu làm cả đoạn mất tin cậy." },
      {
        t: "table", head: ["Loại ví dụ DÙNG ĐƯỢC", "Khung câu", "Ví dụ"],
        rows: [
          ["Xu hướng ai cũng quan sát được", "It is noticeable that… · A familiar pattern is that…", "It is noticeable that parties devote far more attention to pensions than to rents."],
          ["Trường hợp điển hình (nước, ngành, kiểu người) bạn biết chắc", "In X, where…, … · Take X, which…", "In Australia, where attendance at the polls has long been required, turnout routinely exceeds ninety per cent."],
          ["So sánh hai trường hợp", "Compare A with B: while A…, B…", "Compare jury service with voting: the former demands days, the latter half an hour."],
          ["Giả định có cơ sở", "Were X to…, … would… · A student who… would…", "Were turnout among under-25s to match that of pensioners, tuition fees would be a very different issue."],
        ],
      },
      {
        t: "table", head: ["Ví dụ GIẢ", "Vì sao tụt điểm", "Sửa"],
        rows: [
          ["~~A 2019 study by Harvard University showed that 73% of…~~", "Con số và nguồn bịa — giám khảo đọc hàng trăm bài có đúng “nghiên cứu” này", "Research in this area tends to suggest that… (không số, không tên)"],
          ["~~For example, my cousin did not vote last year because…~~", "Chuyện một người không chứng minh được nhận định về xã hội; hạ register", "A first-time voter who has just moved city may well not be registered at all."],
          ["~~For example, many countries have many problems with elections.~~", "Rộng hơn cả luận điểm — không chứng minh gì", "Chọn MỘT nước / một nhóm và nói điều xảy ra ở đó"],
        ],
      },
      {
        t: "patterns",
        rows: [
          {
            formula: "In + nơi, where + S + V, + mệnh đề chính", vi: "Mệnh đề where gói bối cảnh; mệnh đề chính nói điều ví dụ chứng minh.",
            examples: [{ en: "In Singapore, where drivers pay to enter the centre at peak times, congestion has remained manageable despite rising incomes.", vi: "Ở Singapore, nơi tài xế phải trả tiền để vào trung tâm giờ cao điểm, tắc nghẽn vẫn ở mức kiểm soát được dù thu nhập tăng." }],
          },
          {
            formula: "Were + S + to V, S + would + V", vi: "Giả định trang trọng (đảo ngữ thay if) — một lần mỗi bài là đủ.",
            examples: [{ en: "Were entrance exams to be abolished, universities would have to rely on school grades, which vary widely in reliability.", vi: "Nếu bỏ thi đầu vào, các trường đại học sẽ phải dựa vào điểm phổ thông, vốn có độ tin cậy rất khác nhau." }],
          },
          {
            formula: "The point is not that…, but that…", vi: "Câu bậc 4: nói rõ ví dụ chứng minh ĐIỀU GÌ.",
            examples: [{ en: "The point is not that every citizen votes wisely, but that no group can be safely ignored.", vi: "Vấn đề không phải là công dân nào cũng bỏ phiếu sáng suốt, mà là không nhóm nào có thể bị phớt lờ một cách an toàn." }],
          },
        ],
      },
      {
        t: "note", title: "⚠️ Cẩn thận với ví dụ về nước thật",
        items: [
          "Chỉ nêu điều bạn **biết chắc** và nêu ở mức chung: “turnout routinely exceeds ninety per cent” an toàn hơn “turnout was 91.9% in 2019”.",
          "Không chắc ⇒ bỏ tên nước: “In countries where attendance at the polls is required, …”.",
          "Một ví dụ **được khai thác đủ** (bậc 3 + bậc 4) hơn ba ví dụ liệt kê.",
        ],
      },
      { t: "rule", formula: "In X, where…, [điều xảy ra]. The point is not that…, but that…", vi: "Ví dụ + một câu nói rõ nó chứng minh gì = ví dụ liên quan." },
      {
        t: "quiz", id: "t5d4-viet-vi-du-dich", kind: "translate", title: "Dịch sang tiếng Anh — ví dụ và giả định (4 câu)", grammar: "In X, where… · Were S to V, S would V · The point is not that… but that…",
        items: [
          { q: "Ở những nước mà việc bỏ phiếu là bắt buộc, các đảng không thể phớt lờ cử tri trẻ.", answers: ["In countries where voting is compulsory, parties cannot ignore young voters.", "In countries where voting is compulsory, parties cannot afford to ignore young voters.", "In countries where voting is mandatory, parties cannot ignore young voters.", "In countries where voting is compulsory, political parties cannot ignore young voters."], hint: "In countries where · compulsory · ignore" },
          { q: "Nếu học phí bị bãi bỏ, các trường đại học sẽ phụ thuộc hoàn toàn vào ngân sách nhà nước.", answers: ["Were tuition fees to be abolished, universities would depend entirely on public funding.", "If tuition fees were abolished, universities would depend entirely on public funding.", "Were tuition fees to be abolished, universities would rely entirely on public funding.", "If tuition fees were abolished, universities would rely entirely on public funding.", "Were tuition fees to be abolished, universities would depend entirely on state funding.", "Were tuition fees to be abolished, universities would be entirely dependent on public funding."], hint: "Were … to be abolished · depend on" },
          { q: "Vấn đề không phải là bài thi hoàn hảo, mà là mọi lựa chọn thay thế đều kém công bằng hơn.", answers: ["The point is not that exams are perfect, but that every alternative is less fair.", "The point is not that examinations are perfect, but that every alternative is less fair.", "The point is not that tests are perfect, but that every alternative is less fair.", "The point is not that exams are perfect, but that all the alternatives are less fair.", "The point is not that exams are perfect but that every alternative is less fair."], hint: "The point is not that…, but that… · alternative" },
          { q: "Điều đáng chú ý là người trẻ ít có khả năng đi bầu hơn rõ rệt so với người lớn tuổi.", answers: ["It is noticeable that young people are markedly less likely to vote than older people.", "It is noticeable that the young are markedly less likely to vote than the old.", "It is noticeable that young people are markedly less likely to vote than the elderly.", "It is noticeable that young people are markedly less likely to vote than older adults."], hint: "It is noticeable that · markedly less likely to" },
        ],
      },

      { t: "h", text: "4. Chống khái quát — ai, khi nào, tới mức nào" },
      { t: "p", text: "Câu khái quát quá đà (overgeneralisation) là lý do cụ thể mà mô tả band 7 nêu ra. Nó không phải lỗi ngữ pháp nên bạn không thấy khi soát lỗi. Cách chữa: với mỗi nhận định, điền ba ô **ai · khi nào · tới mức nào**." },
      {
        t: "table", head: ["Câu khái quát (band 7)", "Sửa (band 8)", "Đã thêm ô nào"],
        rows: [
          ["Young people are not interested in politics.", "Many people under 25 follow political issues online yet **rarely translate that interest into a vote**.", "ai (under 25) · tới mức nào (many, rarely)"],
          ["If people must vote, they will read the news.", "An obligation to vote **may prompt some** otherwise disengaged citizens to follow the campaign, **at least in its final weeks**.", "tới mức nào (may, some) · khi nào"],
          ["Technology makes students lazy.", "Constant access to worked solutions **can discourage** students from attempting difficult problems **unaided**.", "cơ chế cụ thể thay cho nhãn “lazy”"],
          ["Everyone knows that exams cause stress.", "High-stakes exams place **considerable** pressure on candidates, **particularly where a single paper decides admission**.", "bỏ everyone knows · thêm điều kiện"],
          ["Governments always waste money.", "Large public projects **almost invariably** exceed their budgets.", "phạm vi hẹp lại · almost"],
        ],
      },
      {
        t: "note", title: "⚠️ Hedging không phải là nói mơ hồ",
        items: [
          "Band 8 **chọn** độ chắc theo bằng chứng: chắc thì nói thẳng (Abstention **is** not spread evenly), chưa chắc thì giảm (this **may well** change).",
          "Rào đón mọi câu (“It could perhaps be argued that it might possibly…”) làm lập trường biến mất — TR tụt chứ không tăng.",
          "Mỗi câu **một** từ giảm là đủ: ~~may possibly tend to~~ → tend to.",
          "Câu luận điểm và câu kết luận **không** rào: I believe it should. · On balance, the benefits outweigh the costs.",
        ],
      },
      {
        t: "mcq", id: "t5d4-viet-do-sau", title: "Câu nào sâu hơn / chính xác hơn? (6 câu)",
        items: [
          { q: "Chọn câu **cơ chế** (bậc 2) tốt nhất cho luận điểm “Standardised tests are fairer than interviews.”", options: ["This is because tests are fair for all students.", "Every candidate answers the same questions under the same conditions and is marked against the same scheme, so the result cannot be swayed by accent, confidence or family connections.", "For example, many universities around the world use tests."], correct: 1, why: "B nêu chuỗi: cùng câu hỏi → cùng điều kiện → cùng barem ⇒ loại trừ yếu tố ngoài năng lực. A chỉ lặp lại luận điểm; C là ví dụ rộng, không phải cơ chế." },
          { q: "Chọn ví dụ **liên quan** nhất cho câu: “Private tutoring allows wealth to be converted into exam marks.”", options: ["A recent Oxford survey found that 82.4% of rich students have tutors.", "My neighbour's son had a tutor and passed the exam.", "In cities where an hour's coaching costs more than a day's wage for many families, test preparation is effectively rationed by income."], correct: 2, why: "C là xu hướng quan sát được, khớp đúng cơ chế “tiền → điểm”. A là số liệu bịa; B là chuyện cá nhân." },
          { q: "Câu nào là câu **hệ quả** (bậc 4)?", options: ["The result is that a test designed to measure ability ends up, in part, measuring household income.", "Tests have been used for many years.", "Some students dislike tests."], correct: 0, why: "A trả lời “so what?”: nối ví dụ trở lại câu hỏi về công bằng." },
          { q: "Câu nào KHÔNG khái quát quá đà?", options: ["All teenagers are addicted to their phones.", "Nobody reads books any more.", "Teenagers in many countries now spend more time on their phones than on any other single leisure activity."], correct: 2, why: "C có phạm vi (in many countries) và mức độ đo được; A và B dùng all / nobody." },
          { q: "Câu nào rào đón QUÁ mức?", options: ["Such tests tend to favour candidates from wealthier backgrounds.", "It might possibly be suggested that such tests could perhaps sometimes favour some candidates.", "Such tests are no panacea."], correct: 1, why: "B chồng năm lớp giảm (might, possibly, could, perhaps, sometimes) — lập trường biến mất." },
          { q: "Chọn câu **giới hạn** (bậc 5) tốt nhất cho một bài ủng hộ thi chuẩn hoá.", options: ["However, some people disagree with me.", "This holds only insofar as every candidate has had a realistic chance to prepare; where schooling is deeply unequal, an identical paper is not an equal test.", "In conclusion, tests are the best."], correct: 1, why: "B nói rõ điều kiện làm lập luận đúng và khi nào nó hết đúng. A chỉ báo có người phản đối; C là kết luận tuyệt đối." },
        ],
      },

      { t: "h", text: "5. Lập trường có điều kiện — và phản đề được xử lý bằng điều kiện" },
      { t: "p", text: "Tập 4 Ngày 4 dạy phản đề kiểu **Granted… but…** (nêu rồi bác). Ở band 8, phản đề không bị “bác” mà được **hoá giải**: bạn thừa nhận nó đúng, rồi chỉ ra một thiết kế hay điều kiện khiến nó không còn chặn được lập trường của bạn. Chính điều kiện đó đi vào câu luận đề (thesis)." },
      {
        t: "patterns",
        rows: [
          {
            formula: "I believe + S + should + V, though only insofar as + S + V", vi: "Luận đề có phạm vi — đặt ở cuối mở bài.",
            examples: [{ en: "I believe it should, though only insofar as the law compels attendance at the polls rather than the expression of a preference.", vi: "Tôi cho là nên, nhưng chỉ trong chừng mực luật buộc người dân đến điểm bầu chứ không buộc họ bày tỏ một lựa chọn." }],
          },
          {
            formula: "Neither point is trivial, but both can be met by + N / V-ing", vi: "Thừa nhận hai phản đề cùng lúc rồi báo trước cách hoá giải.",
            examples: [{ en: "Neither point is trivial, but both can be met by design.", vi: "Cả hai điểm đều không nhỏ, nhưng đều có thể được giải quyết bằng cách thiết kế." }],
          },
          {
            formula: "This is not to say that…; rather, …", vi: "Chặn trước một cách hiểu sai lập trường của mình.",
            examples: [{ en: "This is not to say that exams should be the sole criterion; rather, they should carry the greatest weight.", vi: "Nói vậy không có nghĩa bài thi nên là tiêu chí duy nhất; đúng hơn, nó nên có trọng số lớn nhất." }],
          },
          {
            formula: "On balance, … , provided that + S + V", vi: "Kết bài: nhắc lại lập trường CÙNG điều kiện đã nêu ở mở bài.",
            examples: [{ en: "On balance, a modest obligation seems a price worth paying, provided that abstaining formally remains possible.", vi: "Cân nhắc lại, một nghĩa vụ vừa phải có vẻ là cái giá đáng trả, miễn là vẫn có thể chính thức bỏ phiếu trắng." }],
          },
        ],
      },
      {
        t: "note", title: "⚠️ Ba lỗi lập trường ở band 7",
        items: [
          "**“Đồng ý một nửa” cho an toàn** mà không nói nửa nào: ~~I partly agree with this statement.~~ Phải nói rõ: đồng ý với cái gì, không đồng ý với cái gì.",
          "**Mở bài một lập trường, kết bài một lập trường khác** (thêm “however both sides are important”). Điều kiện ở mở bài và kết bài phải là MỘT.",
          "**Phản đề người rơm**: chọn lý lẽ yếu nhất của phía bên kia để bác. Band 8 chọn lý lẽ **mạnh nhất** — và thừa nhận nó không nhỏ.",
        ],
      },
      { t: "rule", formula: "Mở bài: I agree insofar as X · Thân bài 2: phản đề mạnh nhất → hoá giải bằng X · Kết bài: …, provided that X", vi: "Một điều kiện duy nhất chạy xuyên ba chỗ = lập trường rõ suốt bài." },
      {
        t: "quiz", id: "t5d4-viet-lap-truong-dich", kind: "translate", title: "Dịch sang tiếng Anh — lập trường có điều kiện (4 câu)", grammar: "insofar as · provided that · This is not to say that…; rather, …",
        items: [
          { q: "Tôi đồng ý, nhưng chỉ trong chừng mực các bài thi này đo năng lực chứ không đo trí nhớ.", answers: ["I agree, though only insofar as these tests measure ability rather than memory.", "I agree, but only insofar as these tests measure ability rather than memory.", "I agree, though only insofar as these exams measure ability rather than memory.", "I agree, though only insofar as such tests measure ability rather than memory."], hint: "though only insofar as · rather than" },
          { q: "Cả hai phản đối đều không nhỏ, nhưng đều có thể được giải quyết.", answers: ["Neither objection is trivial, but both can be met.", "Neither objection is trivial, but both can be addressed.", "Neither objection is trivial, but both can be answered.", "Neither objection is trivial, but both can be overcome."], hint: "Neither … is trivial, but both can be…" },
          { q: "Nói vậy không có nghĩa là phỏng vấn vô dụng; đúng hơn, chúng nên được dùng cùng với bài thi.", answers: ["This is not to say that interviews are useless; rather, they should be used alongside tests.", "This is not to say that interviews are useless; rather, they should be used alongside exams.", "This is not to say that interviews are useless; rather, they should be used together with tests.", "This is not to say that interviews are useless; rather, they should be used alongside the tests."], hint: "This is not to say that…; rather, … · alongside" },
          { q: "Cân nhắc lại, lợi ích lớn hơn chi phí, miễn là học sinh nghèo được hỗ trợ.", answers: ["On balance, the benefits outweigh the costs, provided that poorer students are supported.", "On balance, the benefits outweigh the costs, provided that poor students are supported.", "On balance, the benefits outweigh the costs, provided that poorer students receive support.", "On balance, the benefits outweigh the costs, provided that students from poorer families are supported.", "On balance, the benefits outweigh the costs, provided poorer students are supported."], hint: "On balance · outweigh · provided that" },
        ],
      },

      { t: "h", text: "6. Dàn ý bài mẫu — hai thân bài, mỗi thân bài năm bậc" },
      { t: "p", text: "Đề: **Some people believe that voting in national elections should be compulsory for all adult citizens. To what extent do you agree or disagree?**" },
      {
        t: "table", head: ["Đoạn", "Việc của đoạn", "Bậc"],
        rows: [
          ["Mở bài (3 câu)", "Bối cảnh: quyền được phớt lờ, ngày càng nhiều người phớt lờ → câu hỏi → luận đề có điều kiện (buộc đi bầu, không buộc chọn)", "—"],
          ["Thân bài 1 (6 câu)", "Ai ở nhà khi bầu cử tự nguyện → đảng chạy theo người đi bầu → Australia → lợi ích nằm ở thay đổi hành vi của ứng viên", "① ② ③ ④"],
          ["Thân bài 2 (4–5 câu)", "Phản đề mạnh nhất (tự do · bỏ phiếu bừa) → thừa nhận → hoá giải bằng thiết kế (ô từ chối mọi ứng viên) → so với nghĩa vụ bồi thẩm", "phản đề + điều kiện"],
          ["Kết bài (2 câu)", "Giới hạn (no panacea) → lập trường + cùng điều kiện ở mở bài", "⑤"],
        ],
      },

      { t: "h", text: "7. Bài mẫu band 7 và band 8 đặt cạnh nhau" },
      { t: "p", text: "Đọc **bài band 7 trước**. Bài này làm đúng mọi thứ Tập 4 dạy: bốn đoạn rõ, có lập trường, có ví dụ, có phản đề. Hãy tự đánh dấu: câu nào khái quát, bậc nào còn thiếu, và **ba lỗi dai dẳng** kiểu Ngày 3 (mạo từ, giới từ) trước khi xem bảng so sánh." },
      {
        t: "passage", title: "Bài mẫu band 7 (ước tính) — 263 từ",
        paras: [
          { text: "In many countries, people can choose whether to vote or not. Some people argue that voting should be compulsory for every adult. I agree with this view because it makes the government more representative and encourages people to care about politics." },
          { text: "The first reason is that compulsory voting makes the result of an election fairer. In countries where voting is optional, many people do not vote, especially young people and poor people. As a result, the politicians only listen to the groups who vote. If everyone has to vote, the government will represent the whole society. For example, Australia has compulsory voting and almost everyone votes there, so its democracy is very strong." },
          { text: "The second reason is that compulsory voting encourages citizens to learn about politics. Nowadays, young people are not interested in political issues and they spend all their time on social media. If they must vote, they will read the news and discuss about the candidates with their family. This will improve the quality of democracy and create more responsible citizens." },
          { text: "Some people say that compulsory voting is against freedom, because people should have the right not to vote. However, I think this argument is not strong. Citizens already have many duties such as paying taxes and going to school, so voting is just another duty. Moreover, voting only takes a few minutes, so it is not a big problem." },
          { text: "In conclusion, I strongly believe that voting should be compulsory because it makes elections fairer and makes people more interested in politics. Governments should introduce this law as soon as possible." },
        ],
      },
      {
        t: "passage", title: "Bài mẫu band 8 (ước tính) — 315 từ",
        paras: [
          { text: "In most democracies, casting a ballot is a right that citizens are free to ignore, and a growing number do. Whether the state should turn that right into a legal duty is contested. I believe it should, though only insofar as the law compels attendance at the polls rather than the expression of a preference." },
          { text: "The strongest argument for compulsion concerns who stays at home when voting is optional. Abstention is not spread evenly: the young, the poor and those who move house frequently are markedly less likely to vote than older, wealthier homeowners. Because parties campaign for the votes that are actually cast, their programmes drift towards the interests of the latter group, and pensions receive more attention than rents. Compulsion interrupts this cycle. In Australia, where attendance has been required for about a century and turnout routinely exceeds ninety per cent, no party can win simply by mobilising its own supporters; it has to persuade the reluctant middle. The benefit, in other words, lies less in the extra votes themselves than in the change they force on those seeking office." },
          { text: "The usual objection is that forcing people to participate violates their freedom, and that reluctant voters will choose carelessly. Neither point is trivial, but both can be met by design. If the ballot paper includes a formal option to reject every candidate, nobody is compelled to endorse anything; what is required is half an hour of a citizen's time every few years, a burden lighter than jury service. As for careless voting, there is little reason to think that an uninterested voter chooses any more randomly than a committed one chooses out of habit." },
          { text: "Compulsory voting is no panacea: it cannot by itself make politicians honest or citizens informed. On balance, however, a modest obligation that brings the whole electorate into view seems a price worth paying, provided that abstaining formally remains possible." },
        ],
      },
      {
        t: "table", head: ["Tiêu chí", "Bài band 7", "Bài band 8"],
        rows: [
          ["TR — số luận điểm và độ sâu", "Hai lý do + phản đề; mỗi lý do dừng ở bậc ① và ③, bậc ② chỉ lặp lại luận điểm", "Một luận điểm đi đủ ① → ④, phản đề được hoá giải, bậc ⑤ ở kết bài"],
          ["TR — khái quát", "young people are not interested · spend all their time · they will read the news · its democracy is very strong", "markedly less likely · routinely exceeds · there is little reason to think — mỗi nhận định đúng mức"],
          ["TR — ví dụ", "Australia: “almost everyone votes, so its democracy is very strong” — không nói ví dụ chứng minh gì", "Australia: turnout cao ⇒ đảng không thể chỉ huy động người của mình ⇒ phải thuyết phục nhóm lưỡng lự"],
          ["TR — lập trường", "strongly believe · as soon as possible — tuyệt đối, không điều kiện", "insofar as … attendance rather than preference → provided that abstaining formally remains possible: một điều kiện xuyên suốt"],
          ["CC — liên kết", "The first reason · The second reason · However · Moreover · In conclusion", "Liên kết bằng ý: this cycle · the latter group · Neither point · As for careless voting · in other words"],
          ["LR — từ vựng", "Đúng nhưng chung: fairer, not strong, a big problem, responsible citizens", "abstention · mobilising its own supporters · the reluctant middle · endorse · no panacea · electorate"],
          ["GRA — cấu trúc", "Chủ yếu câu đơn + because / so / if", "Mệnh đề where không xác định · what is required is… · lies less in A than in B · provided that"],
          ["GRA — lỗi", "the politicians · the whole society (nên: society as a whole) · discuss about — ba lỗi kiểu Ngày 3", "Không có lỗi"],
        ],
      },
      {
        t: "note", title: "💡 Tám thứ mượn được từ bài band 8",
        items: [
          "Mở bài nêu **điều đang thay đổi** (a growing number do) thay cho “In many countries…”.",
          "Câu luận điểm báo trước góc nhìn: The strongest argument for X **concerns** who / what / how…",
          "Dấu hai chấm để mở cơ chế: Abstention is not spread evenly**:** the young, the poor…",
          "Câu ngắn làm bản lề sau câu dài: **Compulsion interrupts this cycle.**",
          "Câu hệ quả: The benefit lies **less in** A **than in** B.",
          "Thừa nhận phản đề: **Neither point is trivial, but** both can be met by design.",
          "So sánh để thu nhỏ một gánh nặng: a burden **lighter than** jury service.",
          "Kết bài hai nhịp: X is **no panacea**… **On balance, however,** …, **provided that**…",
        ],
      },
      {
        t: "quiz", id: "t5d4-viet-dien-mau", kind: "fill", title: "Gập bài mẫu band 8 lại — điền MỘT từ còn thiếu (8 chỗ trống)",
        items: [
          { q: "I believe it should, though only ___ as the law compels attendance at the polls…", answers: ["insofar"] },
          { q: "…the young, the poor and those who move house frequently are ___ less likely to vote than older, wealthier homeowners.", answers: ["markedly"] },
          { q: "…their programmes drift towards the interests of the ___ group, and pensions receive more attention than rents.", answers: ["latter"] },
          { q: "…where attendance has been required for about a century and turnout ___ exceeds ninety per cent…", answers: ["routinely"] },
          { q: "The benefit, in other words, lies ___ in the extra votes themselves than in the change they force on those seeking office.", answers: ["less"] },
          { q: "___ point is trivial, but both can be met by design.", answers: ["Neither"] },
          { q: "Compulsory voting is no ___ : it cannot by itself make politicians honest or citizens informed.", answers: ["panacea"] },
          { q: "…seems a price worth paying, ___ that abstaining formally remains possible.", answers: ["provided"] },
        ],
      },
      {
        t: "sodo", kind: "flow", title: "40 phút cho Task 2 — phân giờ band 8",
        steps: [
          { label: "0–6'", sub: "đếm vế đề · chọn lập trường + ĐIỀU KIỆN · 2 luận điểm, mỗi cái ghi 5 bậc bằng 5 chữ" },
          { label: "6–10'", sub: "mở bài 3 câu, luận đề có insofar as / provided that" },
          { label: "10–30'", sub: "hai thân bài, mỗi cái 6–7 câu" },
          { label: "30–34'", sub: "kết bài 2 câu: giới hạn + lập trường cùng điều kiện" },
          { label: "34–40'", sub: "soát ngược 3 lượt (Ngày 3) + gạch câu khái quát" },
        ],
      },

      { t: "h", text: "8. Đến lượt bạn — viết và để AI chấm" },
      { t: "p", text: "Đề **khác** bài mẫu nhưng cùng dạng. Trước khi viết, ghi dàn ý năm bậc cho từng thân bài (5 chữ mỗi bậc là đủ) và viết ra **điều kiện** của lập trường. Cố ý dùng 5 từ của bài 1 — gạch chân để tự kiểm collocation sau khi AI chấm." },
      {
        t: "essay", id: "t5d4-viet-bai", task: "Task 2", minWords: 280,
        prompt: "Some people believe that standardised tests are the fairest way to select students for university. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
        tips: [
          "Lập trường phải có điều kiện: đồng ý tới đâu, khi nào thì hết đúng?",
          "Hai luận điểm, mỗi cái đi ít nhất bốn trong năm bậc: luận điểm → cơ chế → ví dụ liên quan → hệ quả → giới hạn.",
          "Chọn phản đề MẠNH nhất (ví dụ: luyện thi tư biến thu nhập thành điểm) và hoá giải bằng một điều kiện cụ thể.",
          "Không số liệu bịa, không chuyện cá nhân. Một ví dụ khai thác đủ hơn ba ví dụ liệt kê.",
          "Gợi ý từ của bài 1: entrench · disproportionately · commensurate with · tenuous · caveat · trade-off · no panacea · insofar as.",
          "6 phút cuối: soát ngược ba lượt (chủ – vị, mạo từ, giới từ) + gạch mọi all / always / everyone.",
        ],
      },
      {
        t: "note", title: "Sau khi AI chấm — tự soát năm câu hỏi của band 8",
        items: [
          "Mỗi thân bài có câu **cơ chế** (A → B → C) không, hay câu thứ hai chỉ lặp lại luận điểm?",
          "Sau mỗi ví dụ có câu **“điều này cho thấy…”** không?",
          "Điều kiện ở mở bài và kết bài có phải **cùng một** điều kiện không?",
          "Còn câu nào có all / always / everyone / never / will mà bạn không bảo vệ được?",
          "Năm từ ít gặp: collocation đúng chưa? Có hai từ hiếm nào đứng sát nhau không?",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI 3 — NGHE ═══════════════════════════ */
  {
    id: "t5d4-nghe",
    kind: "listening",
    title: "Nghe Part 2 + Part 3 tốc độ thật — bốn người nói",
    goal: "Làm đúng 17–20/20 câu Part 2 + Part 3 ở tốc độ nói thật (~175 từ/phút), theo được bốn người nói với năm giọng khác nhau, và không rơi vào bẫy “ý được nêu rồi bị người khác bác”.",
    minutes: 80,
    blocks: [
      {
        t: "recap", title: "Bài này học gì · đẩy band nào",
        items: [
          "Đẩy **Listening từ 30–32 lên 35+/40**: Part 2 và Part 3 là nơi band 7 rơi 3–5 câu vì tốc độ và vì nhiều người nói chồng ý lên nhau.",
          "Băng hôm nay chạy **~175 từ/phút**, không có khoảng nghỉ “dễ chịu” như băng Tập 3–4 (150–165).",
          "Part 3 có **bốn người**: một giảng viên (Ireland) và ba sinh viên (Anh, Mỹ, New Zealand). Kỹ năng mới: **ghi ai nghĩ gì**, và nhận ra đồng ý / phản đối nói vòng.",
          "Dạng câu: MCQ ba phương án + **matching** (ghép mỗi mục với một quy định / quyết định).",
          "Nối lại: Tập 4 Ngày 4 (bốn kiểu bẫy MCQ Part 2), Tập 4 Ngày 12 và 17 (Part 3 hai – ba người).",
        ],
      },

      { t: "h", text: "1. Tốc độ thật và bốn người nói — khó thêm ở đâu?" },
      {
        t: "table", head: ["", "Băng Tập 4", "Băng hôm nay (như đề thật khó)"],
        rows: [
          ["Tốc độ", "160–170 từ/phút, ngắt rõ giữa các ý", "~175 từ/phút, ý nọ nối ý kia bằng and / so / but không nghỉ"],
          ["Số người (Part 3)", "2–3", "4 — có lúc ba người nói liên tiếp, mỗi người một câu"],
          ["Đáp án", "Người nói A nêu, người nói B xác nhận", "A nêu → B phản đối → **C (thường là giảng viên) phân xử**; đáp án là lời phân xử"],
          ["Từ khoá câu hỏi", "Nghe thấy gần như nguyên", "Paraphrase mức 3–4; từ nghe thấy nguyên văn thường nằm trong **phương án sai**"],
          ["Giọng", "Một – hai giọng", "Úc · Ireland · Anh · Mỹ · New Zealand trong 8 phút"],
        ],
      },
      {
        t: "note", title: "📌 Ba đặc điểm giọng đáng nhớ trước khi nghe",
        items: [
          "**Úc / New Zealand:** nguyên âm /eɪ/ nghe gần /aɪ/ (day ≈ “die”); New Zealand: /e/ nghe gần /ɪ/ (ten ≈ “tin”, desk ≈ “disk”), /ɪ/ nghe gần /ə/.",
          "**Ireland:** phát âm rõ /r/ ở cuối từ (more, here), /t/ giữa và cuối từ nghe mềm; ngữ điệu lên ở cuối câu kể.",
          "**Mỹ:** /t/ giữa hai nguyên âm thành /d/ nhẹ (better, pretty — đã luyện ở Ngày 1); nguyên âm /ɒ/ thành /ɑː/ (got, logic).",
        ],
      },

      { t: "h", text: "2. Theo dõi ai nói — bảng “ai nghĩ gì” và lời đồng ý / phản đối nói vòng" },
      { t: "p", text: "Trong 30 giây đọc đề Part 3, viết tên các nhân vật thành cột (tên có trong lời dẫn và trong câu hỏi). Trong khi nghe, không chép chữ — chỉ ghi dấu **+ / – / ?** dưới tên người vừa nói. Với câu hỏi “What do they **decide**…”, đáp án là dấu cuối cùng mà không ai phản đối." },
      {
        t: "table", head: ["Nghe thấy", "Nghĩa thật", "Ghi"],
        rows: [
          ["I'd go along with that. · That's what I'd do. · Fair enough.", "Đồng ý", "+"],
          ["I'm not sure it's that serious. · I'm not sure that follows. · Hmm, up to a point.", "**Không đồng ý** (lịch sự)", "–"],
          ["That's what I thought at first, too. But…", "Tôi **đã từng** nghĩ vậy — giờ thì không", "– (bẫy: nghe như đồng ý)"],
          ["It's long, but it's thorough. I wouldn't touch it.", "Nêu khuyết điểm rồi **giữ nguyên**", "+ (bẫy: nghe như chê)"],
          ["The content is fine. But…", "Chỗ khen là mồi; vấn đề nằm sau but", "–"],
          ["Actually, would it make more sense for X to…?", "Đề xuất **đổi** kế hoạch vừa nêu", "kế hoạch cũ bị gạch"],
          ["You won't have that before the deadline, will you? No —…", "Câu hỏi đuôi để **bác** một đề xuất", "–"],
        ],
      },
      {
        t: "note", title: "⚠️ Người Việt hay sai khi nghe nhiều người",
        items: [
          "**Chọn theo người nói đầu tiên.** Ở band 8, ý đầu tiên gần như luôn bị điều chỉnh. Giữ bút, chờ lời phân xử.",
          "**Chọn theo từ nghe được nguyên văn.** “time” nghe rõ hai lần không có nghĩa đáp án là “ran out of time” — nghe xem nó được khẳng định hay bị phủ định (it **wasn't** time).",
          "**Mất dấu người nói khi hai giọng nữ nối nhau.** Bám vào **tên gọi** (“It's not the number I'm worried about, Priya”) — người được gọi tên là người KHÔNG nói câu đó.",
          "**Dừng lại tiếc một câu đã lỡ.** Ở 175 từ/phút, tiếc ba giây là mất luôn câu sau. Đoán, đánh dấu, đi tiếp.",
        ],
      },
      { t: "rule", formula: "A nêu → B điều chỉnh → C phân xử ⇒ đáp án = lời cuối không bị ai bác", vi: "Ghi + / – / ? dưới tên người nói; không chép chữ." },

      { t: "h", text: "3. Part 2 — Questions 11–20 (giọng Úc)" },
      { t: "p", text: "Bạn sẽ nghe một kỹ thuật viên giới thiệu xưởng chế tạo dành cho sinh viên (makerspace) với thành viên mới. Đọc câu 11–15 trong **30 giây**: gạch từ khoá của câu hỏi và tóm mỗi phương án bằng 2–3 chữ. Băng chỉ phát **một lần**; giữa câu 15 và 16 có khoảng nghỉ ngắn để đọc phần ghép." },
      {
        t: "listen", id: "t5d4-nghe-part2", title: "Part 2 — An induction talk at the Foundry",
        note: "Kịch bản tự soạn · khoảng 650 từ · ~175 từ/phút · giọng Úc.",
        dan: { so: "Day 4, Recording 1", boiCanh: "a technician giving an induction talk to new members of a university makerspace called the Foundry.", cau: [11, 20] },
        lines: [
          { who: "Kirra", voice: "au-nu", text: "Morning everyone, and welcome to the Foundry. I'm Kirra, one of the three technicians here, and I'll take about ten minutes to tell you how the place works before we let you loose on anything. A bit of background first. People often assume the Foundry belongs to the engineering faculty, because we're in the basement of their building, but we're actually run by the library, which is why your library card is what gets you through the door. And that's deliberate — the idea from the start was that a history student should feel just as entitled to be here as a mechanical engineer." },
          { who: "Kirra", voice: "au-nu", text: "Now, opening hours. We used to open at eight, but hardly anyone came in before ten, so this year we've shifted everything later: ten in the morning till nine at night on weekdays, and noon till six on Saturdays. We're closed Sundays. During the exam period we push the weekday closing time back to eleven — not, I should say, the opening time, which is what people always assume." },
          { who: "Kirra", voice: "au-nu", text: "Membership itself costs nothing. What you do pay for is whatever you use up — filament, plywood, that sort of thing — and that comes off the print credit on your student account. We stopped taking cash two years ago, after the till went missing, and please don't offer to transfer money to one of us personally. We're not allowed to accept it." },
          { who: "Kirra", voice: "au-nu", text: "The thing I most want you to remember is the tag system. Every machine has a coloured tag on it. Green means anyone who's done today's induction can use it. Amber means you need an extra training session first. And if you see a red tag, the machine's out of order, so leave it alone and — this is the important bit — don't try to fix it yourself, however confident you are. Last term somebody repaired one of the printers for us, and it cost four hundred dollars to undo." },
          { who: "Kirra", voice: "au-nu", text: "One more general point. We get asked constantly whether you can bring in a personal project, something that's nothing to do with your course. Absolutely — about half of what gets made down here is birthday presents. The one thing we don't allow is making things to sell. If you're running a small business, come and talk to me and I'll point you to the enterprise hub in town, which is set up for exactly that." },
          { who: "Kirra", voice: "au-nu", text: "Right, the equipment. The 3D printers are the most popular thing we have, so you can't just walk up to one: reserve a slot on the Foundry page of the library website, at least a day ahead. A print can run for six or seven hours, by the way, so nobody's going to throw you off after sixty minutes. The laser cutter is amber-tagged. There's a forty-minute session every Tuesday and Thursday, and once you've done that, you can use it whenever it's free — no need to reserve. First-years sometimes think they're barred from it. They aren't." },
          { who: "Kirra", voice: "au-nu", text: "The sewing machines confuse people. You'd think they'd be the least dangerous things in the room, and they are, but the two we've got are industrial models and they're on loan, so the condition is that one of us technicians is standing by whenever they're running. Just ask. Soldering stations: we've got eight, they're green-tagged, and there's rarely a queue, so just sit down and get on with it, whenever we're open. Solder's provided, no charge." },
          { who: "Kirra", voice: "au-nu", text: "And finally the woodwork bench. Book it or don't, we're relaxed about that. What we're not relaxed about is timber. People used to bring in old pallets full of nails, which wrecked the saw blades, so now any wood you cut on that bench has to come from our own store. It's sold at cost. OK, that's enough from me. Grab a pair of safety glasses from the box by the door and we'll start with the printers." },
        ],
      },
      {
        t: "mcq", id: "t5d4-nghe-p2-chon", title: "Questions 11–15 — Choose the correct letter, A, B or C",
        items: [
          { q: "11. The Foundry is managed by", options: ["A  the engineering faculty.", "B  the university library.", "C  the students' union."], correct: 1, why: "“People often assume the Foundry belongs to the engineering faculty… but we're actually **run by the library**.” A được nhắc nguyên văn nhưng bị bác (assume… but actually). C không được nhắc." },
          { q: "12. During the exam period, the Foundry", options: ["A  opens earlier in the morning.", "B  stays open later on weekdays.", "C  opens on Sundays as well."], correct: 1, why: "“we push the weekday **closing time back to eleven** — not… the opening time.” A là điều “people always assume” ⇒ sai. Chủ nhật vẫn đóng." },
          { q: "13. How do members pay for the materials they use?", options: ["A  from credit on their student account", "B  in cash at the desk", "C  by transferring money to a technician"], correct: 0, why: "“that comes off the **print credit on your student account**”. B: đã bỏ tiền mặt hai năm trước. C: “please don't offer to transfer money” ⇒ cấm." },
          { q: "14. A red tag on a machine means that it", options: ["A  is not working.", "B  requires additional training.", "C  must not be used without a technician."], correct: 0, why: "“a red tag, the machine's **out of order**” = is not working. B là thẻ amber. C: không được nhắc cho thẻ đỏ (và là quy định của máy may ở phần sau — bẫy nhớ nhầm)." },
          { q: "15. Members are not allowed to use the Foundry to make", options: ["A  things unrelated to their course.", "B  presents for other people.", "C  items that they intend to sell."], correct: 2, why: "“The one thing we don't allow is **making things to sell**.” A và B đều được phép rõ ràng (“Absolutely — about half… is birthday presents”)." },
        ],
      },
      { t: "p", text: "**Questions 16–20.** What is the rule for using each of the following? Choose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 16–20." },
      {
        t: "table", head: ["", "Rules"],
        rows: [
          ["A", "It must be booked in advance."],
          ["B", "A separate training session must be completed first."],
          ["C", "A member of staff must be present."],
          ["D", "It can be used freely at any time during opening hours."],
          ["E", "Materials must be obtained from the Foundry."],
          ["F", "Each session is limited to one hour."],
          ["G", "It is not available to first-year students."],
        ],
      },
      {
        t: "quiz", id: "t5d4-nghe-p2-ghep", kind: "fill", title: "Questions 16–20 — gõ MỘT chữ cái A–G",
        items: [
          { q: "16. 3D printers", answers: ["A"], hint: "“reserve a slot… at least a day ahead”. F là bẫy: “nobody's going to throw you off after sixty minutes”." },
          { q: "17. laser cutter", answers: ["B"], hint: "“amber-tagged… a forty-minute session”. A là bẫy (“no need to reserve”); G là bẫy (“They aren't” barred)." },
          { q: "18. sewing machines", answers: ["C"], hint: "“one of us technicians is standing by whenever they're running”." },
          { q: "19. soldering stations", answers: ["D"], hint: "“just sit down and get on with it, whenever we're open”." },
          { q: "20. woodwork bench", answers: ["E"], hint: "“any wood you cut… has to come from our own store”. A là bẫy: “Book it or don't”." },
        ],
      },
      {
        t: "note", title: "Rút ra từ Part 2",
        items: [
          "Bốn trên năm câu MCQ có **phương án sai được nói nguyên văn** (engineering faculty, opening time, cash, transfer money). Phương án đúng thì được paraphrase.",
          "Câu 12: tín hiệu sửa nằm **sau** đáp án (“not, I should say, the opening time”) — đừng đổi đáp án khi nghe thấy chữ của phương án A.",
          "Phần ghép: ba phương án thừa F, G và một phần của A đều được **nhắc rồi phủ định** (nobody's going to throw you off · They aren't · no need to reserve).",
          "Paraphrase đáng nhớ: out of order = not working · standing by = present · our own store = obtained from the Foundry.",
        ],
      },

      { t: "h", text: "4. Part 3 — Questions 21–30 (bốn người, bốn giọng)" },
      { t: "p", text: "Ba sinh viên ngành máy tính — **Priya** (giọng Anh), **Marcus** (giọng Mỹ), **Hana** (giọng New Zealand) — gặp giảng viên hướng dẫn, **Dr Byrne** (giọng Ireland), để nghe nhận xét về bản nháp báo cáo một nghiên cứu thử nghiệm. Viết bốn tên thành bốn cột trước khi bấm nghe. Đọc câu 21–26 trong **40 giây**." },
      {
        t: "listen", id: "t5d4-nghe-part3", title: "Part 3 — Feedback on a pilot study of peer code review",
        note: "Kịch bản tự soạn · khoảng 730 từ · ~175 từ/phút · giọng Ireland, Anh, Mỹ, New Zealand.",
        dan: { so: "Day 4, Recording 2", boiCanh: "three computing students called Priya, Marcus and Hana talking to their tutor, Dr Byrne, about a report they have written.", cau: [21, 30] },
        lines: [
          { who: "Dr Byrne", voice: "ie-nam", text: "Come in, sit down, the three of you. So, I've read the draft of your pilot study on peer code review. Before I give you my comments, remind me what you actually set out to find." },
          { who: "Priya", voice: "uk-nu", text: "Well, the department's been talking about making peer review compulsory in the first-year programming module, and we wanted to see whether it actually improves the code students hand in, or whether it just adds to their workload." },
          { who: "Marcus", voice: "us-nam", text: "That was the plan, anyway. If I'm honest, what we ended up measuring was narrower than that. We looked at whether students fixed the specific problems their reviewer pointed out. Whether their code got better overall, we can't really say." },
          { who: "Dr Byrne", voice: "ie-nam", text: "I'm glad you've said that, Marcus, because the title promises rather more than the study delivers. Now, your sample. Forty-two students?" },
          { who: "Hana", voice: "nz-nu", text: "Forty-two signed up. Thirty-one finished both rounds. And the thing is, the ones who dropped out weren't random. They were mostly people who'd handed in the first assignment late." },
          { who: "Dr Byrne", voice: "ie-nam", text: "And why does that matter?" },
          { who: "Hana", voice: "nz-nu", text: "Because the students who were left were probably the more organised ones to begin with. So our results might look better than they would for a whole class." },
          { who: "Priya", voice: "uk-nu", text: "I'm not sure it's that serious. Thirty-one's still a decent number for a pilot." },
          { who: "Hana", voice: "nz-nu", text: "It's not the number I'm worried about, Priya, it's who they are." },
          { who: "Dr Byrne", voice: "ie-nam", text: "Hana's right, I'm afraid. The size is acceptable. The make-up of the group is the weakness, and you need to say so openly. Now, the finding you seem proudest of. Students acted on about seventy per cent of the comments they received." },
          { who: "Marcus", voice: "us-nam", text: "Yeah, that caught us off guard. We'd guessed maybe half." },
          { who: "Dr Byrne", voice: "ie-nam", text: "What kind of comments, though?" },
          { who: "Marcus", voice: "us-nam", text: "That's the catch. Most of them were about naming and layout. This variable name is unclear, indent this block. Easy stuff. Comments about the actual logic, where the reviewer said the approach itself was wrong, hardly ever got acted on." },
          { who: "Priya", voice: "uk-nu", text: "I'd assumed that was because students didn't have time to redo the logic." },
          { who: "Marcus", voice: "us-nam", text: "That's what I thought at first, too. But when we went back through the interviews, it wasn't time. They just didn't trust another first-year to be right about something that fundamental." },
          { who: "Dr Byrne", voice: "ie-nam", text: "That, to my mind, is the most interesting thing in the whole report, and it's buried on page nine. Let's go through the report itself, section by section. The literature review." },
          { who: "Priya", voice: "uk-nu", text: "It's long, I know. Six pages." },
          { who: "Dr Byrne", voice: "ie-nam", text: "It's long, but it's thorough and it's well organised. I wouldn't touch it. What I would question is the method section." },
          { who: "Hana", voice: "nz-nu", text: "We thought that was fine?" },
          { who: "Dr Byrne", voice: "ie-nam", text: "The content is fine. But you've put the entire marking rubric, all three pages of it, in the middle of the section. The reader loses the thread." },
          { who: "Hana", voice: "nz-nu", text: "So cut the rubric?" },
          { who: "Marcus", voice: "us-nam", text: "No, people will want to see it. Could it go at the back, as an appendix, and we just refer to it?" },
          { who: "Dr Byrne", voice: "ie-nam", text: "That's what I'd do. Now, results." },
          { who: "Priya", voice: "uk-nu", text: "We were thinking of adding the data from the second cohort, the group who start in January." },
          { who: "Dr Byrne", voice: "ie-nam", text: "You won't have that before the deadline, will you? No, the data you've got is enough. The problem is the order. You lead with the seventy per cent and leave the point about trust until the end. I'd start again from scratch and build the section around that distinction: surface comments versus comments on logic." },
          { who: "Marcus", voice: "us-nam", text: "That's a complete redraft." },
          { who: "Dr Byrne", voice: "ie-nam", text: "It is. It's also the difference between a competent report and a good one." },
          { who: "Hana", voice: "nz-nu", text: "And the recommendations? We had five." },
          { who: "Dr Byrne", voice: "ie-nam", text: "Do you believe all five?" },
          { who: "Hana", voice: "nz-nu", text: "Honestly? The first two. The others are, well, the kind of thing you write because a report's supposed to have recommendations." },
          { who: "Priya", voice: "uk-nu", text: "I'd go along with that. Three and four are basically the same point anyway." },
          { who: "Dr Byrne", voice: "ie-nam", text: "Then lose the padding. Two recommendations you can defend are worth more than five you can't. Keep those two, say them briefly, and stop." },
          { who: "Marcus", voice: "us-nam", text: "So that section gets a lot more compact." },
          { who: "Dr Byrne", voice: "ie-nam", text: "Considerably. Now, one last thing: the presentation next month. Who's doing what?" },
          { who: "Priya", voice: "uk-nu", text: "I'd planned to do the introduction, Hana the method, and Marcus the results, since he did the analysis." },
          { who: "Marcus", voice: "us-nam", text: "Actually, would it make more sense for Hana to take the results? She's the one who spotted the trust thing in the interviews." },
          { who: "Hana", voice: "nz-nu", text: "I don't mind. But then someone else has to do the method." },
          { who: "Marcus", voice: "us-nam", text: "I'll swap with you." },
          { who: "Dr Byrne", voice: "ie-nam", text: "Good. Send me the redraft by the twentieth." },
        ],
      },
      {
        t: "mcq", id: "t5d4-nghe-p3-chon", title: "Questions 21–26 — Choose the correct letter, A, B or C",
        items: [
          { q: "21. What did the students originally intend to find out?", options: ["A  whether peer review should replace marking by tutors", "B  whether peer review leads to better code", "C  how much extra time peer review takes"], correct: 1, why: "Priya: “whether it actually **improves the code** students hand in”. C: workload chỉ là vế “or whether it just adds to…” — không phải thứ họ đo thời gian. A không được nhắc." },
          { q: "22. What does Marcus admit about the study?", options: ["A  It measured something more limited than planned.", "B  It relied on an unreliable marking scheme.", "C  It took longer to complete than expected."], correct: 0, why: "“what we ended up measuring was **narrower than that**” = more limited than planned." },
          { q: "23. Hana is concerned about the sample because", options: ["A  too few students took part.", "B  those who completed it were not typical.", "C  some students missed the first assignment."], correct: 1, why: "“the ones who dropped out weren't random… the students who were left were probably the more organised ones”; “It's **not the number** I'm worried about… it's **who they are**.” A là ý của Priya bị Hana bác; Dr Byrne phân xử: “Hana's right”." },
          { q: "24. What surprised the students about their results?", options: ["A  the proportion of comments that were acted on", "B  the small number of comments reviewers wrote", "C  the amount of attention paid to layout"], correct: 0, why: "“acted on about seventy per cent… that **caught us off guard**. We'd guessed maybe half.” caught off guard = surprised." },
          { q: "25. According to Marcus, students rarely acted on comments about logic because they", options: ["A  ran out of time.", "B  did not understand the comments.", "C  doubted their reviewer's judgement."], correct: 2, why: "“it **wasn't time**. They just **didn't trust another first-year** to be right.” A là giả định của Priya và suy nghĩ BAN ĐẦU của Marcus (“That's what I thought at first, too. But…”) — bẫy điển hình." },
          { q: "26. Who will present the results in next month's presentation?", options: ["A  Priya", "B  Marcus", "C  Hana"], correct: 2, why: "Kế hoạch ban đầu: Marcus. Marcus đề xuất đổi (“would it make more sense for Hana…”), Hana đồng ý (“I don't mind”), Marcus nhận phần method (“I'll swap with you”) ⇒ Hana." },
        ],
      },
      { t: "p", text: "**Questions 27–30.** What does the group decide to do about each section of the report? Choose **FOUR** answers from the box and write the correct letter, **A–F**, next to Questions 27–30." },
      {
        t: "table", head: ["", "Decisions"],
        rows: [
          ["A", "leave it as it is"],
          ["B", "make it shorter"],
          ["C", "rewrite it completely"],
          ["D", "move some material to an appendix"],
          ["E", "add more data"],
          ["F", "remove it from the report"],
        ],
      },
      {
        t: "quiz", id: "t5d4-nghe-p3-ghep", kind: "fill", title: "Questions 27–30 — gõ MỘT chữ cái A–F",
        items: [
          { q: "27. Literature review", answers: ["A"], hint: "“It's long, but… I wouldn't touch it.” B là bẫy (long)." },
          { q: "28. Method", answers: ["D"], hint: "“Could it go at the back, as an appendix…?” — “That's what I'd do.” F là bẫy (“So cut the rubric?” — “No”)." },
          { q: "29. Results", answers: ["C"], hint: "“I'd start again from scratch” — “That's a complete redraft.” E là bẫy (dữ liệu nhóm tháng Một bị bác)." },
          { q: "30. Recommendations", answers: ["B"], hint: "“lose the padding… Keep those two, say them briefly” — “a lot more compact”. Phần này được giữ, chỉ ngắn lại ⇒ không phải F." },
        ],
      },
      {
        t: "table", head: ["Câu", "Ai nêu ý sai", "Ai sửa", "Chữ báo hiệu"],
        rows: [
          ["23", "Priya (thirty-one's a decent number)", "Hana → Dr Byrne phân xử", "It's not the number… · Hana's right, I'm afraid"],
          ["25", "Priya (didn't have time)", "Marcus", "That's what I thought at first, too. But… it wasn't time"],
          ["26", "Priya (Marcus the results)", "Marcus tự đề xuất đổi", "Actually, would it make more sense…"],
          ["27", "Priya (It's long, I know)", "Dr Byrne", "long, but… I wouldn't touch it"],
          ["28", "Hana (So cut the rubric?)", "Marcus → Dr Byrne", "No… as an appendix · That's what I'd do"],
          ["29", "Priya (adding the data)", "Dr Byrne", "You won't have that…, will you? No"],
        ],
      },

      { t: "h", text: "5. Sau khi chấm — luyện lại với chính hai băng này" },
      {
        t: "table", head: ["Bạn sai ở", "Nguyên nhân thường gặp", "Luyện"],
        rows: [
          ["11–15", "Chọn theo chữ nghe được nguyên văn", "Nghe lại, mỗi câu ghi chữ BÁC phương án sai (but actually · not · stopped · don't)"],
          ["16–20", "Không kịp nhìn 7 phương án", "Trước khi nghe, tóm mỗi phương án bằng một chữ: book · train · staff · free · materials · 1h · no-1st"],
          ["21–26", "Lấy ý của người nói đầu", "Nghe lại với bảng bốn cột, chỉ ghi + / –"],
          ["27–30", "Nghe khuyết điểm tưởng là quyết định sửa", "Chỉ ghi khi nghe ĐỘNG TỪ hành động: wouldn't touch · go at the back · start again · lose · keep"],
        ],
      },
      {
        t: "note", title: "💡 Luyện thêm 15 phút",
        items: [
          "**Shadowing** 60 giây đoạn của Dr Byrne và 60 giây của Kirra: nói đuổi theo băng, chậm hơn nửa giây — tập tai với giọng Ireland và Úc.",
          "Mở lời thoại, tô ba màu: ý được nêu · lời bác · lời phân xử. Đếm xem bao nhiêu đáp án nằm ở màu thứ ba.",
          "Ghi vào Sổ lỗi theo **kiểu bẫy**, không theo số câu: “chọn theo người nói đầu” · “chọn theo chữ nguyên văn” · “mất dấu người nói”.",
          "Ngày 15 học riêng bẫy nghe band 8 (số liệu đổi, phủ định kép); Ngày 8 làm Listening Đề 9 ở Online Test.",
        ],
      },
    ],
  },

  /* ═══════════════════════════ BÀI TẬP ═══════════════════════════ */
  {
    id: "t5d4-bai-tap",
    kind: "homework",
    title: "Bài tập Ngày 4",
    goal: "Tự kiểm cả ngày: dùng đúng nghĩa, collocation và sắc thái của 50 từ band 8, nhận ra năm bậc độ sâu và câu khái quát trong một thân bài, nghe ba người nói ở tốc độ thật.",
    minutes: 55,
    blocks: [
      {
        t: "recap", title: "Bài tập hôm nay (38 câu)",
        items: [
          "I: điền từ trong hộp (10 câu) · II: collocation và sắc thái (8 câu) · III: dạng từ (6 câu).",
          "IV: dịch 5 câu ở mức band 8.",
          "V: một thân bài mẫu + 5 câu về năm bậc độ sâu và khái quát.",
          "VI: nghe ba sinh viên bàn kế hoạch (4 câu, tốc độ thật).",
          "Sai từ 3 câu trở lên ở phần I–III ⇒ học lại nhóm từ tương ứng bằng nút Che nghĩa / Che từ.",
        ],
      },
      {
        t: "sodo", kind: "mindmap", title: "Ôn nhanh Ngày 4 trước khi làm bài", center: "Band 8 = chính xác + sâu",
        branches: [
          { label: "Động từ", items: ["exacerbate a problem", "perpetuate a stereotype", "be hampered by", "bolster the case"] },
          { label: "Tính từ", items: ["a tenuous link", "an untenable position", "conducive to", "commensurate with"] },
          { label: "Danh từ", items: ["no panacea for", "the onus is on … to", "a trade-off between", "with the caveat that"] },
          { label: "Điều tiết", items: ["ostensibly", "invariably = always", "insofar as + mệnh đề", ", and, by extension, …"] },
          { label: "Opinion band 8", items: ["5 bậc độ sâu", "ví dụ khớp cơ chế", "ai · khi nào · tới mức nào", "một điều kiện xuyên bài"] },
        ],
      },

      { t: "h", text: "I. Điền từ (10 câu)" },
      { t: "p", text: "Chọn từ trong hộp, mỗi từ dùng một lần, chia dạng nếu cần: **caveat · circumvent · conducive · curtail · daunting · discrepancy · dwindle · inadvertently · intractable · propensity**" },
      {
        t: "quiz", id: "t5d4-bt-dien", kind: "fill", title: "I. Điền từ trong hộp",
        items: [
          { q: "Starting a degree in a foreign language can seem ___ at first.", answers: ["daunting"] },
          { q: "By including a link to the draft, the email ___ revealed the company's plans.", answers: ["inadvertently"] },
          { q: "Traffic congestion in the capital has proved ___ despite decades of investment.", answers: ["intractable"] },
          { q: "As the village's population ___, the school and the post office both closed.", answers: ["dwindled"] },
          { q: "A noisy shared house is hardly ___ to revising for exams.", answers: ["conducive"] },
          { q: "The council voted to ___ late-night bus services in order to save money.", answers: ["curtail"] },
          { q: "Some users install special software to ___ the restrictions on foreign websites.", answers: ["circumvent"] },
          { q: "People have a natural ___ to remember evidence that supports what they already believe.", answers: ["propensity"] },
          { q: "The scheme is a success — with the ___ that it has only been tested in two small towns.", answers: ["caveat"] },
          { q: "There was a clear ___ between the figures in the report and those on the website.", answers: ["discrepancy"] },
        ],
      },

      { t: "h", text: "II. Collocation và sắc thái (8 câu)" },
      {
        t: "mcq", id: "t5d4-bt-chon", title: "II. Chọn đáp án đúng",
        items: [
          { q: "The onus is ___ landlords to make sure that rented homes are safe.", options: ["for", "on", "to"], correct: 1, why: "the onus is on sb to V." },
          { q: "Urban planning always involves a trade-off ___ cost and quality.", options: ["between", "among", "of"], correct: 0, why: "a trade-off between A and B." },
          { q: "Cheap flights are ___ a panacea for struggling regional economies.", options: ["no", "not", "none"], correct: 1, why: "is not a panacea / is no panacea — có a thì dùng not; “no a panacea” sai." },
          { q: "Textbooks that show only male engineers help to ___ an outdated stereotype.", options: ["perpetrate", "perpetuate", "preclude"], correct: 1, why: "perpetuate a stereotype = duy trì định kiến. perpetrate = gây ra (tội ác)." },
          { q: "The new evidence ___ the case for raising the school-leaving age.", options: ["bolsters", "exacerbates", "hampers"], correct: 0, why: "bolster the case = củng cố lập luận. exacerbate đi với điều xấu." },
          { q: "The app is ___ free, but most useful features require a subscription.", options: ["unequivocally", "nominally", "invariably"], correct: 1, why: "Miễn phí trên danh nghĩa ⇒ nominally." },
          { q: "Câu nào dùng từ ĐÚNG?", options: ["The new policy exacerbated the economy.", "The drought exacerbated existing food shortages.", "The teacher exacerbated the students to study."], correct: 1, why: "exacerbate + một điều đã xấu sẵn (food shortages). “the economy” không phải vấn đề; không dùng với người." },
          { q: "Câu nào hợp nhất khi NÓI trong Part 1?", options: ["The onus is on me to prepare breakfast.", "Assembling the wardrobe was really fiddly, so I gave up halfway.", "My hitherto favourite café has closed."], correct: 1, why: "fiddly là từ đời thường đúng register. onus và hitherto quá trang trọng cho chuyện bữa sáng, quán cà phê." },
        ],
      },

      { t: "h", text: "III. Dạng từ (6 câu)" },
      {
        t: "quiz", id: "t5d4-bt-ho-tu", kind: "fill", title: "III. Viết dạng đúng của từ trong ngoặc",
        items: [
          { q: "Rural areas are ___ (DISPROPORTIONATE) affected by cuts to public transport.", answers: ["disproportionately"] },
          { q: "The newspaper printed several ___ (SUBSTANTIATE) claims about the minister.", answers: ["unsubstantiated"], hint: "tính từ phủ định: chưa được chứng minh" },
          { q: "These attitudes are deeply ___ (ENTRENCH) and will not change overnight.", answers: ["entrenched"] },
          { q: "Managers have become ___ (COMPLACENCY) about safety after years without an accident.", answers: ["complacent"] },
          { q: "The benefits of the scheme are largely ___ (TANGIBLE): greater confidence and a sense of belonging.", answers: ["intangible"], hint: "trái nghĩa: không sờ thấy, không đo được" },
          { q: "I was completely ___ (BAFFLING) by the instructions, so I rang the helpline.", answers: ["baffled"] },
        ],
      },

      { t: "h", text: "IV. Dịch sang tiếng Anh (5 câu)" },
      {
        t: "quiz", id: "t5d4-bt-dich", kind: "translate", title: "IV. Dịch — dùng từ gợi ý", grammar: "Từ ít gặp + collocation của nó",
        items: [
          { q: "Nghiên cứu bị cản trở bởi việc thiếu kinh phí.", answers: ["The research was hampered by a lack of funding.", "The research has been hampered by a lack of funding.", "Research was hampered by a lack of funding.", "Research has been hampered by a lack of funding.", "The study was hampered by a lack of funding.", "The research was hampered by the lack of funding."], hint: "be hampered by · a lack of funding" },
          { q: "Không gian mở không phải lúc nào cũng thuận lợi cho sự tập trung.", answers: ["Open-plan offices are not always conducive to concentration.", "Open spaces are not always conducive to concentration.", "Open-plan spaces are not always conducive to concentration.", "An open space is not always conducive to concentration."], hint: "conducive to" },
          { q: "Người có thu nhập thấp bị ảnh hưởng nhiều một cách bất cân xứng bởi lạm phát.", answers: ["People on low incomes are disproportionately affected by inflation.", "Low-income people are disproportionately affected by inflation.", "Low-income households are disproportionately affected by inflation.", "People with low incomes are disproportionately affected by inflation.", "Low earners are disproportionately affected by inflation."], hint: "disproportionately affected by" },
          { q: "Chính sách nào cũng hàm chứa sự đánh đổi giữa tự do và an toàn.", answers: ["Every policy involves a trade-off between freedom and safety.", "Any policy involves a trade-off between freedom and safety.", "Every policy involves a trade-off between freedom and security.", "Any policy involves a trade-off between freedom and security.", "Every policy involves a trade-off between liberty and security."], hint: "involve a trade-off between" },
          { q: "Tôi thấy bộ phim hơi nhạt so với kỳ vọng, dù được khen nhiều.", answers: ["I found the film a bit underwhelming, despite the good reviews.", "I found the film a bit underwhelming, although it had good reviews.", "I found the film a bit underwhelming despite the good reviews.", "I found the movie a bit underwhelming, despite the good reviews.", "I found the film a bit underwhelming, despite its good reviews.", "I found the film rather underwhelming, despite the good reviews."], hint: "find sth a bit underwhelming · despite" },
        ],
      },

      { t: "h", text: "V. Viết: năm bậc độ sâu (5 câu)" },
      { t: "p", text: "Đọc thân bài sau (các câu đã đánh số) cho đề “Standardised tests are the fairest way to select students for university.” rồi trả lời câu 1–5." },
      {
        t: "passage", title: "Một thân bài mẫu",
        paras: [
          { text: "(1) The main case for standardised tests is that they are difficult to manipulate." },
          { text: "(2) Every candidate sits the same paper under the same conditions and is marked against the same scheme, so the outcome cannot be swayed by a confident manner, a prestigious school or a well-connected parent." },
          { text: "(3) Compare this with the personal statement, which can be drafted by a paid adviser, or the interview, in which fluency is easily mistaken for ability." },
          { text: "(4) The consequence is that a test, for all its narrowness, gives an able pupil from an unknown school a route in that no other method reliably offers." },
          { text: "(5) This holds, however, only insofar as preparation is not itself for sale; where intensive coaching is widespread, the paper begins to measure household income as well as ability." },
        ],
      },
      {
        t: "mcq", id: "t5d4-bt-viet", title: "V. Chọn đáp án đúng",
        items: [
          { q: "1. Câu (2) thuộc bậc nào?", options: ["Bậc ② — cơ chế", "Bậc ③ — ví dụ", "Bậc ⑤ — giới hạn"], correct: 0, why: "Câu (2) giải thích BẰNG CÁCH NÀO bài thi khó bị thao túng: cùng đề → cùng điều kiện → cùng barem." },
          { q: "2. Câu (3) dùng loại ví dụ nào?", options: ["Số liệu nghiên cứu", "So sánh hai trường hợp", "Chuyện cá nhân"], correct: 1, why: "Compare this with… — so bài thi với bài luận cá nhân và phỏng vấn." },
          { q: "3. Câu nào trả lời “So what?” (bậc ④)?", options: ["Câu (1)", "Câu (4)", "Câu (5)"], correct: 1, why: "The consequence is that… — nối ví dụ trở lại câu hỏi về công bằng." },
          { q: "4. Cụm nào trong câu (5) làm lập trường trở thành “có điều kiện”?", options: ["as well as ability", "only insofar as", "where intensive coaching is widespread"], correct: 1, why: "only insofar as giới hạn phạm vi đúng của cả lập luận. Mệnh đề where… nêu khi nào nó hết đúng — hệ quả của điều kiện ấy." },
          { q: "5. Nếu thay câu (4) bằng “This shows that tests are always the best method for all students.” thì bài mắc lỗi gì?", options: ["Sai ngữ pháp", "Khái quát quá đà", "Lạc đề"], correct: 1, why: "always + all students là nhận định tuyệt đối không bảo vệ được — đúng lý do giữ TR ở band 7." },
        ],
      },

      { t: "h", text: "VI. Nghe — ba người, tốc độ thật (4 câu)" },
      { t: "p", text: "Ba thành viên câu lạc bộ robot bàn về ngày hội mở. Đọc bốn câu hỏi trong **25 giây**, viết ba tên thành ba cột, nghe **một lần**." },
      {
        t: "listen", id: "t5d4-bt-nghe", title: "Planning the robotics club open day",
        note: "Kịch bản tự soạn · khoảng 290 từ · giọng Canada, Anh, Mỹ.",
        lines: [
          { who: "Chloe", voice: "ca-nu", text: "OK, open day. First thing: where? I'd pencilled in the main hall, because it's the biggest room we can get for free." },
          { who: "Owen", voice: "uk-nam", text: "It's big, but the floor's carpeted, and the line-following robots won't run on carpet. What about the sports hall?" },
          { who: "Dana", voice: "us-nu", text: "The sports hall's booked for basketball every Saturday until Christmas. I checked. The engineering atrium has a hard floor, though, and it's right by the entrance, so people will actually walk past." },
          { who: "Chloe", voice: "ca-nu", text: "Smaller than I'd like, but I can't argue with the floor. Atrium it is. Now, how do we get people to come? Last year we put posters up everywhere and got about fifteen visitors." },
          { who: "Owen", voice: "uk-nam", text: "Posters are a waste of paper. Could we email all the first-years?" },
          { who: "Dana", voice: "us-nu", text: "The faculty won't give us the mailing list. I asked last term. What did work, for the chess club, was getting lecturers to mention it for thirty seconds at the start of a class." },
          { who: "Owen", voice: "uk-nam", text: "That's better than anything I had. I'll ask the three lecturers I know." },
          { who: "Chloe", voice: "ca-nu", text: "Great. And on the day, I thought we'd start with a demonstration, the two robots we took to the regional final." },
          { who: "Dana", voice: "us-nu", text: "A demo's fine, but people forget it in five minutes. I'd rather put a controller in their hands straight away. Let them drive one through the obstacle course, and do the demo later for anyone who's still around." },
          { who: "Chloe", voice: "ca-nu", text: "Hmm. I was worried they'd break something, but I suppose the old training robots can take it. All right, hands-on first." },
          { who: "Owen", voice: "uk-nam", text: "And who's writing the sign-up form?" },
          { who: "Chloe", voice: "ca-nu", text: "I'd assumed Dana, since she did it last year." },
          { who: "Dana", voice: "us-nu", text: "I did, and nobody could read my handwriting. Owen, you built the club website. Can it be an online form this time?" },
          { who: "Owen", voice: "uk-nam", text: "Sure. Leave it with me." },
        ],
      },
      {
        t: "mcq", id: "t5d4-bt-nghe-chon", title: "VI. Choose the correct letter, A, B or C",
        items: [
          { q: "1. Where will the open day be held?", options: ["A  the main hall", "B  the sports hall", "C  the engineering atrium"], correct: 2, why: "Main hall: trải thảm, robot không chạy được. Sports hall: đã kín lịch. “Atrium it is.”" },
          { q: "2. How will the club advertise the event?", options: ["A  by putting up posters", "B  by emailing first-year students", "C  by asking lecturers to announce it"], correct: 2, why: "Posters: “a waste of paper”. Email: khoa không cho danh sách. Owen: “I'll ask the three lecturers I know.”" },
          { q: "3. What will happen first on the day?", options: ["A  Visitors will try controlling a robot.", "B  Members will give a demonstration.", "C  Visitors will watch a video of the regional final."], correct: 0, why: "Chloe đề xuất demo trước; Dana phản đối (“I'd rather put a controller in their hands straight away”); Chloe: “All right, hands-on first.”" },
          { q: "4. Who will prepare the sign-up form?", options: ["A  Chloe", "B  Dana", "C  Owen"], correct: 2, why: "Chloe tưởng là Dana; Dana đề nghị Owen làm form trực tuyến; Owen: “Leave it with me.”" },
        ],
      },
      {
        t: "note", title: "📌 Sai nhiều ở đâu thì ôn ở đó",
        items: [
          "Phần I–III ⇒ bài 1: nhóm từ tương ứng + bảng sắc thái ở mục 7.",
          "Phần IV ⇒ bài 1 mục 8 (nâng câu) — chú ý giới từ đi kèm: conducive to, hampered by, trade-off between.",
          "Phần V ⇒ bài 2 mục 2 và mục 4.",
          "Phần VI ⇒ bài 3 mục 2: cả bốn đáp án đều là ý thứ HAI hoặc thứ BA được nêu, không câu nào là ý đầu tiên.",
        ],
      },
    ],
  },
];
